import { NextResponse } from "next/server";
import { SYSTEM_PROMPT, buildUserPrompt, safeParseJSON } from "@/lib/prompt";
import { generateFromLocalLLM } from "@/lib/llm";
import { preprocessWebsiteText, fetchWebsiteResearchText } from "@/lib/research";
import { buildFallbackLandingPage, type LandingRequest } from "@/lib/fallback";
import { buildShowcasePage } from "@/lib/showcase-template";

export const dynamic = "force-dynamic";

const HARD_TIMEOUT_MS = 58_000;
const ATTEMPT_MAX_MS = 24_000;
const ATTEMPT_MIN_MS = 8_000;
const RESERVED_FALLBACK_MS = 3_000;
const WEBSITE_FETCH_MAX_MS = 7_000;
const WEBSITE_FETCH_MIN_BUDGET_MS = 2_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function remainingBudgetMs(startedAt: number) {
  return HARD_TIMEOUT_MS - (Date.now() - startedAt);
}

function clipPromptText(text: unknown, maxLen = 2500) {
  if (typeof text !== "string") {
    return "";
  }

  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length <= maxLen
    ? normalized
    : `${normalized.slice(0, maxLen - 1).trim()}...`;
}

function extractGeneratedContent(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  if (candidate.content && typeof candidate.content === "object") {
    return candidate.content as Record<string, unknown>;
  }

  if (
    candidate.company &&
    candidate.hero &&
    candidate.pillars &&
    candidate.products
  ) {
    return candidate;
  }

  return null;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function hasMeaningfulString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function mergeContent(base: unknown, generated: unknown): unknown {
  if (generated === null || generated === undefined) {
    return base;
  }

  if (typeof generated === "string") {
    return hasMeaningfulString(generated) ? generated : base;
  }

  if (typeof generated === "number" || typeof generated === "boolean") {
    return generated;
  }

  if (Array.isArray(generated)) {
    if (generated.length === 0) {
      return Array.isArray(base) ? base : generated;
    }

    const baseArray = Array.isArray(base) ? base : [];

    return generated.map((item, index) => {
      const baseItem = baseArray[index];
      return mergeContent(baseItem, item);
    });
  }

  if (isObject(generated)) {
    const baseObject = isObject(base) ? base : {};
    const result: Record<string, unknown> = { ...baseObject };

    for (const key of Object.keys(generated)) {
      result[key] = mergeContent(baseObject[key], generated[key]);
    }

    return result;
  }

  return generated;
}

function buildResponse(
  content: Record<string, unknown>,
  websiteUrl?: string,
  tone?: string
) {
  return {
    content,
    html: buildShowcasePage(content, websiteUrl, tone)
  };
}

function appendResearchChunk(chunks: string[], value: unknown) {
  if (typeof value !== "string") {
    return;
  }

  const normalized = value.trim();
  if (!normalized) {
    return;
  }

  chunks.push(normalized);
}

export async function POST(req: Request) {
  let body: LandingRequest = {};

  try {
    body = (await req.json()) as LandingRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const fallbackPayload = buildFallbackLandingPage(body);
  const fallbackContent = fallbackPayload.content as Record<string, unknown>;
  const startedAt = Date.now();

  try {
    const researchChunks: string[] = [];
    appendResearchChunk(researchChunks, body.research_notes_raw);

    const websiteUrl = typeof body.website_url === "string" ? body.website_url.trim() : "";
    if (websiteUrl) {
      const remainingForWebsiteFetch =
        remainingBudgetMs(startedAt) - ATTEMPT_MIN_MS - RESERVED_FALLBACK_MS;

      if (remainingForWebsiteFetch >= WEBSITE_FETCH_MIN_BUDGET_MS) {
        const timeoutMs = Math.min(WEBSITE_FETCH_MAX_MS, remainingForWebsiteFetch);

        try {
          const websiteResearch = await withTimeout(
            fetchWebsiteResearchText(websiteUrl),
            timeoutMs,
            "Website research"
          );
          appendResearchChunk(researchChunks, websiteResearch);
        } catch (err) {
          const message = err instanceof Error ? err.message : "website research failed";
          console.warn("Website research skipped:", message);
        }
      }
    }

    const combinedResearchRaw = researchChunks.join("\n\n").trim();
    const researchStructured = combinedResearchRaw
      ? await preprocessWebsiteText(combinedResearchRaw)
      : null;

    const mergedBody = {
      ...body,
      research_notes: researchStructured
        ? JSON.stringify(researchStructured)
        : clipPromptText(combinedResearchRaw)
    };

    const userPrompt = buildUserPrompt(mergedBody);
    const strictSystemPrompt = `${SYSTEM_PROMPT}\n\nStrict mode: return valid JSON with a single root key named \"content\".`;

    const attempts: Array<{ systemPrompt: string; temperature: number; numPredict: number }> = [
      { systemPrompt: strictSystemPrompt, temperature: 0.18, numPredict: 700 },
      { systemPrompt: strictSystemPrompt, temperature: 0.1, numPredict: 520 }
    ];

    let generatedContent: Record<string, unknown> | null = null;
    let lastError: Error | null = null;

    for (const attempt of attempts) {
      const remaining = remainingBudgetMs(startedAt) - RESERVED_FALLBACK_MS;

      if (remaining < ATTEMPT_MIN_MS) {
        break;
      }

      const timeoutMs = Math.min(ATTEMPT_MAX_MS, remaining);

      try {
        const raw = await withTimeout(
          generateFromLocalLLM(attempt.systemPrompt, userPrompt, {
            numPredict: attempt.numPredict,
            temperature: attempt.temperature,
            topP: 0.88,
            topK: 35,
            repeatPenalty: 1.12,
            repeatLastN: 64
          }),
          timeoutMs,
          "Model generation"
        );

        const parsed = safeParseJSON(raw.trim());
        const parsedContent = extractGeneratedContent(parsed);

        if (!parsedContent) {
          throw new Error("Missing content in model output");
        }

        generatedContent = parsedContent;
        break;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error("Invalid model output");
      }
    }

    if (generatedContent) {
      const completedContent = mergeContent(
        fallbackContent,
        generatedContent
      ) as Record<string, unknown>;

      return NextResponse.json(buildResponse(completedContent, body.website_url, body.tone));
    }

    console.warn(
      "Using fallback landing page:",
      lastError?.message ?? "generation budget exceeded"
    );
    return NextResponse.json(buildResponse(fallbackContent, body.website_url, body.tone));
  } catch (err) {
    console.error("POST /api/generate failed:", err);
    return NextResponse.json(buildResponse(fallbackContent, body.website_url, body.tone));
  }
}
