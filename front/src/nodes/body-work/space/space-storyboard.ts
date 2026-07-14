import { plainMarkdownTextFromRichOutput } from "./space-content-output";

export type StoryboardShot = Record<string, unknown> & {
  id: string;
  order: number;
  duration: number;
  visual: string;
  dialogue: string;
  narration: string;
};

export type StoryboardDocument = Record<string, unknown> & {
  type: "storyboard";
  version: number;
  title: string;
  shots: StoryboardShot[];
};

const STORYBOARD_WRAPPER_KEYS = [
  "storyboard",
  "json",
  "output",
  "result",
  "data",
  "content",
  "body",
  "value",
  "text",
  "finalOutput",
  "final_output",
  "rich",
] as const;

export function parseStoryboardOutput(value: unknown) {
  return findStoryboard(value, new Set(), 0);
}

export function isStoryboardKind(value: unknown) {
  return String(value || "").trim().toLowerCase() === "storyboard";
}

export function storyboardTotalDuration(storyboard: StoryboardDocument) {
  return storyboard.shots.reduce(
    (total, shot) => total + Math.max(0, Number(shot.duration) || 0),
    0,
  );
}

export function createStoryboardShot(index: number): StoryboardShot {
  return {
    id: `shot-${index + 1}`,
    order: index + 1,
    duration: 4,
    visual: "",
    dialogue: "",
    narration: "",
  };
}

export function normalizeStoryboardOrder(
  storyboard: StoryboardDocument,
): StoryboardDocument {
  return {
    ...storyboard,
    shots: storyboard.shots.map((shot, index) => ({
      ...shot,
      id: shot.id || `shot-${index + 1}`,
      order: index + 1,
    })),
  };
}

export function storyboardSummary(storyboard: StoryboardDocument) {
  const title = storyboard.title.trim() || "分镜脚本";
  return `${title} · ${storyboard.shots.length} 个镜头`;
}

function findStoryboard(
  value: unknown,
  seen: Set<object>,
  depth: number,
): StoryboardDocument | null {
  if (value == null || depth > 10) {
    return null;
  }
  if (typeof value === "string") {
    const parsed = parseStoryboardText(value);
    return parsed === value
      ? null
      : findStoryboard(parsed, seen, depth + 1);
  }
  if (typeof value !== "object") {
    return null;
  }
  if (seen.has(value)) {
    return null;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    for (const item of value) {
      const storyboard = findStoryboard(item, seen, depth + 1);
      if (storyboard) {
        return storyboard;
      }
    }
    return null;
  }

  const row = value as Record<string, unknown>;
  if (isStoryboardRecord(row)) {
    return normalizeStoryboard(row);
  }

  const richText = richDocumentText(row);
  if (richText) {
    const storyboard = findStoryboard(richText, seen, depth + 1);
    if (storyboard) {
      return storyboard;
    }
  }

  for (const key of STORYBOARD_WRAPPER_KEYS) {
    const candidate = row[key];
    if (candidate == null || candidate === value) {
      continue;
    }
    const storyboard = findStoryboard(candidate, seen, depth + 1);
    if (storyboard) {
      return storyboard;
    }
  }
  return null;
}

function isStoryboardRecord(row: Record<string, unknown>) {
  if (!Array.isArray(row.shots)) {
    return false;
  }
  if (String(row.type || "").trim().toLowerCase() === "storyboard") {
    return true;
  }
  return row.shots.some(isStoryboardShotRecord);
}

function isStoryboardShotRecord(value: unknown) {
  if (!isRecord(value)) {
    return false;
  }
  return [
    "visual",
    "dialogue",
    "narration",
    "duration",
    "order",
  ].some((key) => key in value);
}

function normalizeStoryboard(row: Record<string, unknown>): StoryboardDocument {
  const shots = Array.isArray(row.shots) ? row.shots : [];
  const usedShotIds = new Set<string>();
  return {
    ...row,
    type: "storyboard",
    version: positiveInteger(row.version, 1),
    title: stringValue(row.title),
    shots: shots.map((shot, index) => {
      const normalized = normalizeStoryboardShot(shot, index);
      normalized.id = uniqueShotId(normalized.id, index, usedShotIds);
      usedShotIds.add(normalized.id);
      return normalized;
    }),
  };
}

function normalizeStoryboardShot(
  value: unknown,
  index: number,
): StoryboardShot {
  const row = isRecord(value) ? value : {};
  return {
    ...row,
    id: stringValue(row.id) || `shot-${index + 1}`,
    order: index + 1,
    duration: positiveInteger(row.duration, 4),
    visual: stringValue(row.visual),
    dialogue: stringValue(row.dialogue),
    narration: stringValue(row.narration),
  };
}

function parseStoryboardText(value: string): unknown {
  const text = value.trim();
  if (!text) {
    return value;
  }
  const fenced = extractJSONFence(text);
  if (fenced) {
    const parsed = parseJSON(fenced);
    if (parsed !== fenced) {
      return parsed;
    }
  }
  const parsed = parseJSON(text);
  if (parsed !== text) {
    return parsed;
  }
  const objectText = extractJSONObject(text);
  return objectText ? parseJSON(objectText) : value;
}

function extractJSONFence(value: string) {
  const match = value.match(/```(?:json|storyboard)?\s*([\s\S]*?)```/i);
  return match?.[1]?.trim() || "";
}

function extractJSONObject(value: string) {
  const start = value.indexOf("{");
  const end = value.lastIndexOf("}");
  return start >= 0 && end > start ? value.slice(start, end + 1) : "";
}

function parseJSON(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function richDocumentText(value: unknown) {
  const plainText = plainMarkdownTextFromRichOutput(value);
  if (plainText) {
    return plainText;
  }
  if (!isRecord(value)) {
    return "";
  }
  const rich =
    value.type === "doc"
      ? value
      : isRecord(value.rich) && value.rich.type === "doc"
        ? value.rich
        : null;
  return rich ? collectRichText(rich).trim() : "";
}

function collectRichText(value: unknown): string {
  if (!isRecord(value)) {
    return "";
  }
  if (value.type === "text") {
    return stringValue(value.text);
  }
  if (value.type === "hardBreak") {
    return "\n";
  }
  if (!Array.isArray(value.content)) {
    return "";
  }
  const separator =
    value.type === "doc" ||
    value.type === "paragraph" ||
    value.type === "codeBlock"
      ? "\n"
      : "";
  return value.content.map(collectRichText).join(separator);
}

function positiveInteger(value: unknown, fallback: number) {
  const number = Number.parseFloat(String(value ?? ""));
  return Number.isFinite(number) && number > 0
    ? Math.max(1, Math.round(number))
    : fallback;
}

function stringValue(value: unknown) {
  return typeof value === "string"
    ? value
    : value == null
      ? ""
      : String(value);
}

function uniqueShotId(
  requestedId: string,
  index: number,
  usedIds: Set<string>,
) {
  const baseId = requestedId || `shot-${index + 1}`;
  if (!usedIds.has(baseId)) {
    return baseId;
  }
  let suffix = 2;
  while (usedIds.has(`${baseId}-${suffix}`)) {
    suffix += 1;
  }
  return `${baseId}-${suffix}`;
}

function isRecord(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
