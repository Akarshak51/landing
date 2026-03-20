export const SYSTEM_PROMPT = `
You are a marketing copywriter for premium, visually stunning landing pages.

Your task:
1. Read the user-provided company information.
2. Generate comprehensive marketing copy in structured form.
3. Return ONE valid JSON object with a single root key: "content".

Output format:
{
  "content": {
    "company": { "name": "", "tagline": "", "one_line": "" },
    "hero": {
      "headline": "",
      "subheadline": "",
      "big_numbers": [{ "label": "", "value": "" }],
      "supporting_paragraph": ""
    },
    "pillars": [{ "title": "", "tag": "", "description": "" }],
    "features": [{ "title": "", "description": "", "icon": "" }],
    "products": [{
      "name": "",
      "short_pitch": "",
      "detail_paragraph": "",
      "key_features": [""]
    }],
    "use_cases": [{
      "title": "",
      "audience": "",
      "scenario": "",
      "outcome": ""
    }],
    "testimonials": [{
      "quote": "",
      "author": "",
      "role": ""
    }],
    "faq": [{
      "question": "",
      "answer": ""
    }],
    "team": [{
      "name": "",
      "role": "",
      "bio": ""
    }],
    "partners": [{
      "name": "",
      "description": ""
    }],
    "proof": [{ "metric": "", "explanation": "" }],
    "vision": { "headline": "", "body": "" },
    "cta": { "primary_label": "", "secondary_label": "", "note": "" },
    "disclaimers": [""]
  }
}

Rules:
- Return valid JSON parseable by JSON.parse.
- Do not include markdown, backticks, or explanatory text.
- Do not include an "html" key.
- Keep language clear, compelling, and benefit-focused.
- If exact numbers are unknown, use safe phrases like "thousands of users".
- hero.big_numbers: 3-4 entries with impressive metrics.
- pillars: 3-6 entries with compelling value propositions.
- features: 4-8 entries showcasing key capabilities.
- products: 1-3 entries with detailed descriptions.
- use_cases: 2-4 entries with realistic scenarios.
- testimonials: 2-6 entries with authentic quotes.
- faq: 3-6 entries addressing common questions.
- team: 2-6 entries (optional - can be empty array).
- partners: 2-8 entries (optional - can be empty array).
- proof: 2-6 entries with qualitative or quantitative evidence.
- Keep claims realistic but impactful.
- Make the copy stand out with unique angles and fresh perspectives.
`.trim();

export function buildUserPrompt(body: any) {
  const {
    company_name,
    website_url,
    short_description,
    target_audience,
    tone,
    research_notes
  } = body;

  return `
company_name: ${company_name}
website_url: ${website_url || "N/A"}
short_description: ${short_description}
target_audience: ${target_audience}
tone: ${tone || "bold"}

research_notes (JSON string or text):
${research_notes || "N/A"}
`.trim();
}

function extractCodeFenceBlocks(text: string) {
  const blocks: string[] = [];
  const regex = /```(?:json)?\s*([\s\S]*?)```/gi;

  let match: RegExpExecArray | null = null;
  while ((match = regex.exec(text)) !== null) {
    const block = match[1]?.trim();
    if (block) {
      blocks.push(block);
    }
  }

  return blocks;
}

function readBalancedObject(text: string, start: number) {
  if (text[start] !== "{") {
    return null;
  }

  let depth = 0;
  let inString = false;
  let quote: '"' | "'" = '"';
  let escaped = false;

  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (ch === "\\") {
        escaped = true;
        continue;
      }

      if (ch === quote) {
        inString = false;
      }

      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      continue;
    }

    if (ch === "{") {
      depth += 1;
      continue;
    }

    if (ch === "}") {
      depth -= 1;

      if (depth === 0) {
        return text.slice(start, i + 1).trim();
      }

      if (depth < 0) {
        return null;
      }
    }
  }

  return null;
}

function collectBalancedObjectCandidates(text: string, maxCandidates = 32) {
  const candidates: string[] = [];

  for (let i = 0; i < text.length; i += 1) {
    if (text[i] !== "{") {
      continue;
    }

    const candidate = readBalancedObject(text, i);
    if (!candidate) {
      continue;
    }

    candidates.push(candidate);

    if (candidates.length >= maxCandidates) {
      break;
    }
  }

  return candidates;
}

function normalizeQuotes(text: string) {
  return text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
}

function tryParseObject(text: string) {
  const trimmed = text.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    // Continue to fallback normalization.
  }

  const normalized = normalizeQuotes(trimmed);
  if (normalized !== trimmed) {
    try {
      const parsed = JSON.parse(normalized);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      // Keep null.
    }
  }

  return null;
}

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractObjectForKey(raw: string, key: string) {
  const keyPattern = new RegExp(`['"]${escapeRegex(key)}['"]\\s*:`, "i");
  const match = keyPattern.exec(raw);

  if (!match) {
    return null;
  }

  let idx = match.index + match[0].length;
  while (idx < raw.length && /\s/.test(raw[idx])) {
    idx += 1;
  }

  const braceIndex = raw.indexOf("{", idx);
  if (braceIndex < 0) {
    return null;
  }

  const candidate = readBalancedObject(raw, braceIndex);
  if (!candidate) {
    return null;
  }

  return tryParseObject(candidate);
}

function readQuotedString(text: string, start: number): { value: string; quote: '"' | "'"; end: number } | null {
  const quote = text[start] as '"' | "'";
  if (quote !== '"' && quote !== "'") {
    return null;
  }

  let escaped = false;
  let value = "";

  for (let i = start + 1; i < text.length; i += 1) {
    const ch = text[i];

    if (escaped) {
      value += ch;
      escaped = false;
      continue;
    }

    if (ch === "\\") {
      value += ch;
      escaped = true;
      continue;
    }

    if (ch === quote) {
      return { value, quote, end: i };
    }

    value += ch;
  }

  return null;
}

function decodeQuotedValue(value: string, quote: '"' | "'") {
  if (quote === '"') {
    try {
      return JSON.parse(`"${value}"`) as string;
    } catch {
      // Fall through to best-effort decode.
    }
  }

  return value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");
}

function extractStringForKey(raw: string, key: string) {
  const keyPattern = new RegExp(`['"]${escapeRegex(key)}['"]\\s*:`, "i");
  const match = keyPattern.exec(raw);

  if (!match) {
    return null;
  }

  let idx = match.index + match[0].length;
  while (idx < raw.length && /\s/.test(raw[idx])) {
    idx += 1;
  }

  const parsed = readQuotedString(raw, idx);
  if (!parsed) {
    return null;
  }

  return decodeQuotedValue(parsed.value, parsed.quote);
}

function extractHtmlDocument(raw: string) {
  const lower = raw.toLowerCase();
  const doctypeIndex = lower.indexOf("<!doctype");
  const htmlIndex = lower.indexOf("<html");
  const start = doctypeIndex >= 0 ? doctypeIndex : htmlIndex >= 0 ? htmlIndex : -1;

  if (start < 0) {
    return null;
  }

  const closing = "</html>";
  const end = lower.lastIndexOf(closing);
  if (end < 0 || end < start) {
    return null;
  }

  return raw.slice(start, end + closing.length).trim();
}

export function safeParseJSON(raw: string) {
  const normalized = raw.replace(/^\uFEFF/, "").trim();
  const parseCandidates = new Set<string>();

  parseCandidates.add(normalized);

  for (const block of extractCodeFenceBlocks(normalized)) {
    parseCandidates.add(block);
  }

  for (const candidate of Array.from(parseCandidates)) {
    for (const objectCandidate of collectBalancedObjectCandidates(candidate)) {
      parseCandidates.add(objectCandidate);
    }
  }

  for (const candidate of parseCandidates) {
    const parsed = tryParseObject(candidate);
    if (parsed) {
      return parsed;
    }
  }

  const content = extractObjectForKey(normalized, "content");
  const html = extractStringForKey(normalized, "html") ?? extractHtmlDocument(normalized);

  if (content && html) {
    return { content, html };
  }

  throw new Error("Invalid JSON from model");
}



