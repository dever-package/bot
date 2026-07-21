import { plainMarkdownTextFromRichOutput } from "./space-content-output";
import { embeddedJSONValues } from "./space-structured-json";
import type { CanvasReferenceContent } from "./types";

export const STORYBOARD_VERSION = 4;
export const MIN_STORYBOARD_SHOT_DURATION = 4;

export const STORYBOARD_VISUAL_MODES = ["photoreal", "stylized"] as const;

export type StoryboardVisualMode =
  (typeof STORYBOARD_VISUAL_MODES)[number];

export const STORYBOARD_ASPECT_RATIOS = [
  "16:9",
  "9:16",
  "1:1",
  "4:3",
  "3:4",
  "21:9",
] as const;

export type StoryboardAspectRatio = (typeof STORYBOARD_ASPECT_RATIOS)[number];

export const DEFAULT_STORYBOARD_ASPECT_RATIO: StoryboardAspectRatio = "16:9";

export type StoryboardMaterialType = "character" | "scene" | "prop";

export const STORYBOARD_MATERIAL_LABELS: Record<
  StoryboardMaterialType,
  string
> = {
  character: "角色",
  scene: "场景",
  prop: "道具",
};

export type StoryboardMaterial = Record<string, unknown> & {
  id: string;
  type: StoryboardMaterialType;
  name: string;
  prompt: string;
};

export type StoryboardWorkflowStatus = "draft" | "confirmed";

export type StoryboardWorkflow = {
  status: StoryboardWorkflowStatus;
  confirmed_at: string;
};

export type StoryboardSpeechKind = "dialogue" | "narration";

export type StoryboardSpeakerMode = "visible" | "offscreen";

export type StoryboardSpeech = Record<string, unknown> & {
  id: string;
  kind: StoryboardSpeechKind;
  text: string;
  start_time: number;
  character_id?: string;
  speaker_mode?: StoryboardSpeakerMode;
};

export type StoryboardReferenceField =
  | "description"
  | "camera_instruction"
  | "video_prompt";

export type StoryboardShot = Record<string, unknown> & {
  id: string;
  order: number;
  duration: number;
  description: string;
  camera_instruction: string;
  video_prompt: string;
  material_ids: string[];
  continue_previous: boolean;
  speech: StoryboardSpeech[];
  reference_contents?: Partial<
    Record<StoryboardReferenceField, CanvasReferenceContent>
  >;
};

export type StoryboardDocument = Record<string, unknown> & {
  type: "storyboard";
  version: typeof STORYBOARD_VERSION;
  workflow: StoryboardWorkflow;
  title: string;
  style_prompt: string;
  visual_mode: StoryboardVisualMode;
  aspect_ratio: StoryboardAspectRatio;
  materials: StoryboardMaterial[];
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

export function storyboardTotalDuration(storyboard: StoryboardDocument) {
  return storyboard.shots.reduce(
    (total, shot) => total + Math.max(0, Number(shot.duration) || 0),
    0,
  );
}

export function isStoryboardShotDurationValid(value: number) {
  return Number.isInteger(value) && value >= MIN_STORYBOARD_SHOT_DURATION;
}

export function storyboardMaterialsByType(
  storyboard: StoryboardDocument,
  type: StoryboardMaterialType,
) {
  return storyboard.materials.filter((material) => material.type === type);
}

export function storyboardShotMaterials(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
) {
  const materials = new Map(
    storyboard.materials.map((material) => [material.id, material]),
  );
  return shot.material_ids
    .map((id) => materials.get(id))
    .filter((material): material is StoryboardMaterial => Boolean(material));
}

export function createStoryboardShot(index: number): StoryboardShot {
  return {
    id: `shot-${index + 1}`,
    order: index + 1,
    duration: MIN_STORYBOARD_SHOT_DURATION,
    description: "",
    camera_instruction: "",
    video_prompt: "",
    material_ids: [],
    continue_previous: index > 0,
    speech: [],
  };
}

export function createStoryboardSpeech(
  shot: StoryboardShot,
  kind: StoryboardSpeechKind = "dialogue",
): StoryboardSpeech {
  const usedIds = new Set(shot.speech.map((speech) => speech.id));
  let sequence = shot.speech.length + 1;
  let id = `${shot.id}-speech-${sequence}`;
  while (usedIds.has(id)) {
    sequence += 1;
    id = `${shot.id}-speech-${sequence}`;
  }
  return {
    id,
    kind,
    text: "",
    start_time: 0,
    ...(kind === "dialogue"
      ? { character_id: "", speaker_mode: "offscreen" as const }
      : {}),
  };
}

export function normalizeStoryboardOrder(
  storyboard: StoryboardDocument,
): StoryboardDocument {
  const materialIDs = new Set(
    storyboard.materials.map((material) => material.id),
  );
  return {
    ...storyboard,
    version: STORYBOARD_VERSION,
    workflow: normalizeStoryboardWorkflow(storyboard.workflow),
    aspect_ratio: normalizeStoryboardAspectRatio(storyboard.aspect_ratio),
    shots: storyboard.shots.map((shot, index) => ({
      ...shot,
      id: shot.id || `shot-${index + 1}`,
      order: index + 1,
      material_ids: uniqueStrings(shot.material_ids).filter((id) =>
        materialIDs.has(id),
      ),
      continue_previous: index > 0 && Boolean(shot.continue_previous),
    })),
  };
}

export function isStoryboardConfirmed(storyboard: StoryboardDocument) {
  return storyboard.workflow.status === "confirmed";
}

export function storyboardSpeechCount(storyboard: StoryboardDocument) {
  return storyboard.shots.reduce(
    (total, shot) => total + shot.speech.filter(hasSpeechText).length,
    0,
  );
}

export function storyboardSpeechLabel(speech: StoryboardSpeech) {
  if (speech.kind === "narration") {
    return "旁白";
  }
  return speech.speaker_mode === "visible" ? "出镜对白" : "画外音";
}

export function isStoryboardVisibleDialogue(speech: StoryboardSpeech) {
  return (
    speech.kind === "dialogue" &&
    speech.speaker_mode === "visible" &&
    Boolean(speech.text.trim())
  );
}

export function storyboardHasVisibleDialogue(shot: StoryboardShot) {
  return shot.speech.some(isStoryboardVisibleDialogue);
}

export function storyboardVisibleSpeakerIds(shot: StoryboardShot) {
  return new Set(
    shot.speech
      .filter(isStoryboardVisibleDialogue)
      .map((speech) => speech.character_id?.trim())
      .filter((characterId): characterId is string => Boolean(characterId)),
  );
}

export function storyboardSummary(storyboard: StoryboardDocument) {
  const title = storyboard.title.trim() || "分镜脚本";
  return `${title} · ${storyboard.shots.length} 个镜头`;
}

export function storyboardPromptWithStyle(
  storyboard: StoryboardDocument,
  prompt: string,
) {
  const basePrompt = prompt.trim();
  const stylePrompt = storyboard.style_prompt.trim();
  if (!stylePrompt || basePrompt.includes(stylePrompt)) {
    return basePrompt;
  }
  if (!basePrompt) {
    return `统一视觉风格：${stylePrompt}`;
  }
  const separator = /[。！？!?；;，,：:]$/.test(basePrompt) ? "" : "。";
  return `${basePrompt}${separator}统一视觉风格：${stylePrompt}`;
}

export function normalizeStoryboardAspectRatio(
  value: unknown,
): StoryboardAspectRatio {
  const normalized = stringValue(value) as StoryboardAspectRatio;
  return STORYBOARD_ASPECT_RATIOS.includes(normalized)
    ? normalized
    : DEFAULT_STORYBOARD_ASPECT_RATIO;
}

export function storyboardShotFallbackPrompt(shot: StoryboardShot) {
  const speech = shot.speech
    .filter(hasSpeechText)
    .map((item) => `${storyboardSpeechLabel(item)}：${item.text.trim()}`)
    .join("；");
  const parts = [
    shot.description,
    shot.camera_instruction ? `镜头语言：${shot.camera_instruction}` : "",
    speech,
    shot.duration > 0 ? `时长：${shot.duration} 秒` : "",
  ].filter(Boolean);
  return parts.join("。") || `镜头 ${shot.order} 视频生成提示词`;
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
    for (const parsed of embeddedJSONValues(value)) {
      const storyboard = findStoryboard(parsed, seen, depth + 1);
      if (storyboard) {
        return storyboard;
      }
    }
    return null;
  }
  if (typeof value !== "object" || seen.has(value)) {
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
  const storyboard = decodeStoryboard(row);
  if (storyboard) {
    return storyboard;
  }

  const richText = richDocumentText(row);
  if (richText) {
    const richStoryboard = findStoryboard(richText, seen, depth + 1);
    if (richStoryboard) {
      return richStoryboard;
    }
  }

  for (const key of STORYBOARD_WRAPPER_KEYS) {
    const candidate = row[key];
    if (candidate == null || candidate === value) {
      continue;
    }
    const nested = findStoryboard(candidate, seen, depth + 1);
    if (nested) {
      return nested;
    }
  }
  return null;
}

function decodeStoryboard(
  row: Record<string, unknown>,
): StoryboardDocument | null {
  const visualMode = stringValue(row.visual_mode).toLowerCase();
  if (
    stringValue(row.type).toLowerCase() !== "storyboard" ||
    numberValue(row.version) !== STORYBOARD_VERSION ||
    typeof row.title !== "string" ||
    typeof row.style_prompt !== "string" ||
    !isStoryboardVisualMode(visualMode) ||
    !Array.isArray(row.materials) ||
    !Array.isArray(row.shots)
  ) {
    return null;
  }

  const materials = row.materials.map(decodeStoryboardMaterial);
  if (materials.some((material) => !material)) {
    return null;
  }
  const normalizedMaterials = materials as StoryboardMaterial[];
  const materialIDs = new Set<string>();
  for (const material of normalizedMaterials) {
    if (materialIDs.has(material.id)) {
      return null;
    }
    materialIDs.add(material.id);
  }

  const usedShotIDs = new Set<string>();
  const shots = row.shots.map((shot, index) =>
    decodeStoryboardShot(shot, index, materialIDs),
  );
  if (shots.some((shot) => !shot)) {
    return null;
  }
  const normalizedShots = shots as StoryboardShot[];
  for (const shot of normalizedShots) {
    if (usedShotIDs.has(shot.id)) {
      return null;
    }
    usedShotIDs.add(shot.id);
  }

  return {
    ...row,
    type: "storyboard",
    version: STORYBOARD_VERSION,
    workflow: normalizeStoryboardWorkflow(row.workflow),
    title: row.title,
    style_prompt: row.style_prompt,
    visual_mode: visualMode,
    aspect_ratio: normalizeStoryboardAspectRatio(row.aspect_ratio),
    materials: normalizedMaterials,
    shots: normalizedShots,
  };
}

function isStoryboardVisualMode(value: string): value is StoryboardVisualMode {
  return STORYBOARD_VISUAL_MODES.includes(value as StoryboardVisualMode);
}

function decodeStoryboardMaterial(value: unknown): StoryboardMaterial | null {
  if (!isRecord(value)) {
    return null;
  }
  const type = stringValue(value.type).toLowerCase();
  if (
    !isStoryboardMaterialType(type) ||
    typeof value.id !== "string" ||
    !value.id.trim() ||
    typeof value.name !== "string" ||
    typeof value.prompt !== "string"
  ) {
    return null;
  }
  return {
    ...value,
    id: value.id.trim(),
    type,
    name: value.name.trim().replace(/^[@#]+/, ""),
    prompt: value.prompt.trim(),
  };
}

function decodeStoryboardShot(
  value: unknown,
  index: number,
  materialIDs: Set<string>,
): StoryboardShot | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    !value.id.trim() ||
    typeof value.description !== "string" ||
    typeof value.camera_instruction !== "string" ||
    typeof value.video_prompt !== "string" ||
    typeof value.continue_previous !== "boolean" ||
    !Array.isArray(value.material_ids) ||
    !Array.isArray(value.speech)
  ) {
    return null;
  }
  const duration = numberValue(value.duration);
  if (duration == null || !isStoryboardShotDurationValid(duration)) {
    return null;
  }
  const materialIdList = value.material_ids.map(stringValue);
  if (
    materialIdList.some((id) => !id || !materialIDs.has(id)) ||
    new Set(materialIdList).size !== materialIdList.length
  ) {
    return null;
  }
  const speech = value.speech.map(decodeStoryboardSpeech);
  if (speech.some((item) => !item)) {
    return null;
  }
  return {
    ...value,
    id: value.id.trim(),
    order: index + 1,
    duration,
    description: value.description,
    camera_instruction: value.camera_instruction,
    video_prompt: value.video_prompt,
    material_ids: materialIdList,
    continue_previous: index > 0 && value.continue_previous,
    speech: speech as StoryboardSpeech[],
  };
}

function decodeStoryboardSpeech(value: unknown): StoryboardSpeech | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    !value.id.trim() ||
    typeof value.text !== "string"
  ) {
    return null;
  }
  const kind = stringValue(value.kind).toLowerCase();
  const startTime = numberValue(value.start_time);
  if (
    (kind !== "dialogue" && kind !== "narration") ||
    startTime == null ||
    startTime < 0
  ) {
    return null;
  }
  if (kind === "narration") {
    const narration: StoryboardSpeech = {
      ...value,
      id: value.id.trim(),
      kind,
      text: value.text,
      start_time: startTime,
    };
    delete narration.character_id;
    delete narration.speaker_mode;
    return narration;
  }
  const speakerMode = stringValue(value.speaker_mode).toLowerCase();
  if (
    typeof value.character_id !== "string" ||
    (speakerMode !== "visible" && speakerMode !== "offscreen")
  ) {
    return null;
  }
  return {
    ...value,
    id: value.id.trim(),
    kind,
    text: value.text,
    start_time: startTime,
    character_id: value.character_id.trim(),
    speaker_mode: speakerMode,
  };
}

function normalizeStoryboardWorkflow(value: unknown): StoryboardWorkflow {
  const row = isRecord(value) ? value : {};
  const status =
    stringValue(row.status).toLowerCase() === "confirmed"
      ? "confirmed"
      : "draft";
  return {
    status,
    confirmed_at: status === "confirmed" ? stringValue(row.confirmed_at) : "",
  };
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

function isStoryboardMaterialType(
  value: string,
): value is StoryboardMaterialType {
  return value === "character" || value === "scene" || value === "prop";
}

function hasSpeechText(speech: StoryboardSpeech) {
  return speech.text.trim().length > 0;
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function numberValue(value: unknown) {
  const number = typeof value === "number" ? value : Number.NaN;
  return Number.isFinite(number) ? number : null;
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
