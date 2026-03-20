"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { Llm, type ModelType } from "@llama-node/core";

const MODELS_DIR = path.resolve(process.cwd(), "models");
const DEFAULT_MODEL_PATH = path.resolve(MODELS_DIR, "model.bin");
const DEFAULT_MODEL_CANDIDATES = [
  DEFAULT_MODEL_PATH,
  path.resolve(MODELS_DIR, "model.ggml"),
  path.resolve(MODELS_DIR, "model.GGML")
];
const MODEL_FILENAME_HINT = /\.(bin|ggml|gguf)$/i;

type GenerationOptions = {
  numPredict?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  repeatPenalty?: number;
  repeatLastN?: number;
};

let llmInstance: Llm | null = null;
let llmInitPromise: Promise<Llm> | null = null;

function isNodeErrno(err: unknown): err is NodeJS.ErrnoException {
  return typeof err === "object" && err !== null && "code" in err;
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function toRepoRelative(filePath: string) {
  return path.relative(process.cwd(), filePath) || filePath;
}

async function listCandidateModelFiles() {
  try {
    const entries = await fs.readdir(MODELS_DIR, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile() && MODEL_FILENAME_HINT.test(entry.name))
      .map((entry) => path.resolve(MODELS_DIR, entry.name));
  } catch (err) {
    if (isNodeErrno(err) && err.code === "ENOENT") {
      return [];
    }

    throw err;
  }
}

async function readModelMagic(filePath: string) {
  const fd = await fs.open(filePath, "r");

  try {
    const header = Buffer.alloc(4);
    const { bytesRead } = await fd.read(header, 0, 4, 0);
    return bytesRead < 4 ? null : header.toString("ascii");
  } finally {
    await fd.close();
  }
}

async function resolveModelPath() {
  const configuredModelPath = process.env.LLM_MODEL_PATH
    ? path.resolve(process.cwd(), process.env.LLM_MODEL_PATH)
    : null;

  if (configuredModelPath) {
    if (await fileExists(configuredModelPath)) {
      return configuredModelPath;
    }

    throw new Error(
      `Model file not found at ${configuredModelPath}. ` +
        "Set LLM_MODEL_PATH to a compatible GGML .bin file."
    );
  }

  for (const candidatePath of DEFAULT_MODEL_CANDIDATES) {
    if (await fileExists(candidatePath)) {
      return candidatePath;
    }
  }

  const discoveredModels = await listCandidateModelFiles();
  const ggufModels: string[] = [];
  const nonGgufModels: string[] = [];

  for (const modelPath of discoveredModels) {
    const magic = await readModelMagic(modelPath).catch(() => null);

    if (magic === "GGUF") {
      ggufModels.push(modelPath);
      continue;
    }

    nonGgufModels.push(modelPath);
  }

  if (nonGgufModels.length === 1) {
    return nonGgufModels[0];
  }

  if (nonGgufModels.length > 1) {
    throw new Error(
      "Multiple model files found in models/. " +
        `Set LLM_MODEL_PATH to one file. Candidates: ${nonGgufModels
          .map((filePath) => toRepoRelative(filePath))
          .join(", ")}`
    );
  }

  if (ggufModels.length > 0) {
    throw new Error(
      "Unsupported model format: GGUF. " +
        `Found GGUF model file(s): ${ggufModels
          .map((filePath) => toRepoRelative(filePath))
          .join(", ")}. ` +
        "@llama-node/core currently expects GGML .bin models. " +
        "Provide a compatible .bin file via LLM_MODEL_PATH or models/model.bin."
    );
  }

  throw new Error(
    `Model file not found at ${DEFAULT_MODEL_PATH}. ` +
      "Set LLM_MODEL_PATH or place a GGML .bin model at models/model.bin."
  );
}

async function ensureSupportedModel(modelPath: string) {
  const magic = await readModelMagic(modelPath);

  if (!magic) {
    throw new Error(`Model file is too small or invalid: ${modelPath}`);
  }

  if (magic === "GGUF") {
    throw new Error(
      "Unsupported model format: GGUF. @llama-node/core currently expects GGML .bin models. " +
        "Provide a compatible .bin file via LLM_MODEL_PATH or models/model.bin."
    );
  }
}

async function initLLM() {
  if (llmInstance) {
    return llmInstance;
  }

  if (!llmInitPromise) {
    llmInitPromise = (async () => {
      const modelPath = await resolveModelPath();
      await ensureSupportedModel(modelPath);

      return Llm.load(
        {
          modelType: "Llama" as ModelType,
          modelPath,
          numCtxTokens: 2048
        },
        true
      );
    })().catch((err) => {
      llmInitPromise = null;
      throw err;
    });
  }

  llmInstance = await llmInitPromise;
  return llmInstance;
}

function trimAtStopSequences(text: string, stops: string[]) {
  let cutoff = text.length;

  for (const stop of stops) {
    const idx = text.indexOf(stop);
    if (idx >= 0) {
      cutoff = Math.min(cutoff, idx);
    }
  }

  return text.slice(0, cutoff);
}

export async function generateFromLocalLLM(
  systemPrompt: string,
  userPrompt: string,
  options: GenerationOptions = {}
) {
  const llm = await initLLM();

  const fullPrompt = [
    "System:",
    systemPrompt,
    "",
    "User:",
    userPrompt,
    "",
    "Assistant:"
  ].join("\n").trim();

  const raw = await new Promise<string>((resolve, reject) => {
    const chunks: string[] = [];
    let done = false;

    llm.inference(
      {
        prompt: fullPrompt,
        numPredict: options.numPredict ?? 1200,
        temperature: options.temperature ?? 0.7,
        topP: options.topP ?? 0.9,
        topK: options.topK ?? 40,
        repeatPenalty: options.repeatPenalty ?? 1.1,
        repeatLastN: options.repeatLastN ?? 64,
        feedPrompt: true,
        ignoreEos: false,
        float16: false,
        batchSize: 8,
        numThreads: 4,
        feedPromptOnly: false
      },
      (result) => {
        if (done) {
          return;
        }

        switch (result.type) {
          case "Data":
            chunks.push(result.data?.token ?? "");
            break;
          case "End":
            done = true;
            resolve(chunks.join(""));
            break;
          case "Error":
            done = true;
            reject(new Error(result.message ?? "Local LLM inference failed"));
            break;
        }
      }
    );
  });

  return trimAtStopSequences(raw, ["</s>", "System:", "User:"]).trim();
}

