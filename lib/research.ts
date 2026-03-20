"use server";

type ResearchSummary = {
  company_overview: string;
  products_services: string[];
  target_customers: string[];
  key_features: string[];
  benefits_promises: string[];
  social_proof: string[];
  notable_phrases: string[];
};

const WEBSITE_FETCH_TIMEOUT_MS = 7_000;
const MAX_HTML_LENGTH = 320_000;
const MAX_WEBSITE_TEXT = 6_500;

function uniqueList(values: string[], limit = 6) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = value.replace(/\s+/g, " ").trim();

    if (!normalized || normalized.length < 6) {
      continue;
    }

    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(normalized);

    if (result.length >= limit) {
      break;
    }
  }

  return result;
}

function normalizeWhitespace(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(text: string) {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x2F;/gi, "/")
    .replace(/&#x27;/gi, "'");
}

function stripTags(text: string) {
  return normalizeWhitespace(decodeHtmlEntities(text.replace(/<[^>]+>/g, " ")));
}

function extractMatches(html: string, pattern: RegExp, limit = 12) {
  const results: string[] = [];
  let match: RegExpExecArray | null = null;

  while ((match = pattern.exec(html)) !== null) {
    const candidate = stripTags(match[1] ?? "");
    if (candidate.length >= 20) {
      results.push(candidate);
    }

    if (results.length >= limit) {
      break;
    }
  }

  return results;
}

function normalizeWebsiteHtml(html: string) {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
}

function summarizeWebsiteHtml(html: string) {
  const normalizedHtml = normalizeWebsiteHtml(html.slice(0, MAX_HTML_LENGTH));

  const titleMatch = normalizedHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? stripTags(titleMatch[1]) : "";

  const metaMatch = normalizedHtml.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i
  );
  const metaDescription = metaMatch ? stripTags(metaMatch[1]) : "";

  const headings = extractMatches(normalizedHtml, /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi, 10);
  const paragraphs = extractMatches(normalizedHtml, /<p[^>]*>([\s\S]*?)<\/p>/gi, 16);
  const listItems = extractMatches(normalizedHtml, /<li[^>]*>([\s\S]*?)<\/li>/gi, 12);

  const merged = uniqueList(
    [title, metaDescription, ...headings, ...paragraphs, ...listItems].filter(Boolean),
    32
  ).join(". ");

  if (!merged) {
    return "";
  }

  return merged.length <= MAX_WEBSITE_TEXT
    ? merged
    : `${merged.slice(0, MAX_WEBSITE_TEXT - 1).trim()}...`;
}

function isHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function splitSentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length >= 20);
}

function pickByPattern(sentences: string[], patterns: RegExp[], limit = 5) {
  const picked = sentences.filter((sentence) =>
    patterns.some((pattern) => pattern.test(sentence))
  );

  return uniqueList(picked, limit);
}

function compact(text: string, max = 420) {
  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max - 1).trim()}...`;
}

function extractCandidatesFromLists(cleaned: string) {
  return cleaned
    .split(/\||\u2022|-|\n|;/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length >= 8);
}

function buildResearchSummary(cleaned: string): ResearchSummary {
  const sentences = splitSentences(cleaned);
  const listCandidates = extractCandidatesFromLists(cleaned);

  const products = pickByPattern(
    sentences,
    [
      /\b(product|service|platform|solution|suite|tool|software|app|offering)\b/i,
      /\b(we provide|we offer|our product|our platform|our service)\b/i
    ],
    5
  );

  const audiences = pickByPattern(
    sentences,
    [
      /\b(for|serving|used by|built for|designed for)\b/i,
      /\b(customers?|teams?|businesses?|brands?|enterprises?|startups?)\b/i
    ],
    5
  );

  const features = pickByPattern(
    [...listCandidates, ...sentences],
    [
      /\b(feature|includes|supports|automation|integration|dashboard|analytics|tracking|workflow|reports?)\b/i,
      /\b(real-time|scalable|secure|customizable|api|mobile|cloud)\b/i
    ],
    6
  );

  const benefits = pickByPattern(
    sentences,
    [
      /\b(help|improve|reduce|increase|accelerate|save|grow|boost|optimiz)\b/i,
      /\b(faster|better|easier|reliable|efficient|quality|results?)\b/i
    ],
    6
  );

  const proof = pickByPattern(
    sentences,
    [
      /\b(trusted by|customers?|clients?|teams?|companies?)\b/i,
      /\b\d+\b/,
      /\b(case study|testimonial|review|award|rating)\b/i
    ],
    5
  );

  const notable = uniqueList([
    ...products,
    ...features,
    ...benefits,
    ...sentences.slice(0, 3)
  ], 7);

  return {
    company_overview: compact(cleaned),
    products_services: products,
    target_customers: audiences,
    key_features: features,
    benefits_promises: benefits,
    social_proof: proof,
    notable_phrases: notable
  };
}

export async function preprocessWebsiteText(raw: string) {
  if (!raw || raw.trim().length < 50) {
    return null;
  }

  const cleaned = raw
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 9000);

  return buildResearchSummary(cleaned);
}

export async function fetchWebsiteResearchText(rawUrl?: string) {
  const url = normalizeWhitespace(rawUrl ?? "");
  if (!url || !isHttpUrl(url)) {
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WEBSITE_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "LandingForgeBot/1.0"
      }
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.includes("text/html")) {
      return null;
    }

    const html = await response.text();
    const summary = summarizeWebsiteHtml(html);

    return summary.length >= 50 ? summary : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
