import { plainMarkdownTextFromRichOutput } from "./space-content-output";
import { embeddedJSONValues } from "./space-structured-json";
import type { CanvasReferenceContent } from "./types";

export type StoryboardMaterialType = "character" | "scene" | "prop";

export type StoryboardMaterial = Record<string, unknown> & {
  id: string;
  name: string;
  prompt: string;
  shot_ids: string[];
};

export type StoryboardMaterials = {
  characters: StoryboardMaterial[];
  scenes: StoryboardMaterial[];
  props: StoryboardMaterial[];
};

export type StoryboardMaterialReference = Pick<
  StoryboardMaterial,
  "id" | "name" | "shot_ids"
> & {
  type: StoryboardMaterialType;
};

export type StoryboardShot = Record<string, unknown> & {
  id: string;
  order: number;
  duration: number;
  visual: string;
  camera_movement: string;
  dialogue: string;
  narration: string;
  sound_music: string;
  prompt: string;
  reference_contents?: Partial<
    Record<StoryboardReferenceField, CanvasReferenceContent>
  >;
};

export type StoryboardReferenceField =
  | "visual"
  | "camera_movement"
  | "dialogue"
  | "narration"
  | "sound_music"
  | "prompt";

export type StoryboardDocument = Record<string, unknown> & {
  type: "storyboard";
  version: number;
  title: string;
  style_prompt: string;
  shots: StoryboardShot[];
  materials?: StoryboardMaterials;
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

const CAMERA_MOVEMENT_ALIASES = [
  "cameraMovement",
  "camera_motion",
  "cameraMotion",
  "camera",
  "movement",
  "运镜",
] as const;

const SOUND_MUSIC_ALIASES = [
  "soundMusic",
  "sound",
  "music",
  "audio",
  "bgm",
  "音效/配乐",
  "音效",
  "配乐",
] as const;

const SHOT_PROMPT_ALIASES = [
  "video_prompt",
  "videoPrompt",
  "generation_prompt",
  "generationPrompt",
  "视频提示词",
] as const;

const STYLE_PROMPT_ALIASES = [
  "stylePrompt",
  "visual_style",
  "visualStyle",
  "style",
] as const;

const MATERIAL_LIST_ALIASES = {
  characters: ["characters", "roles", "people", "角色", "人物"],
  scenes: ["scenes", "locations", "places", "场景", "地点"],
  props: ["props", "items", "objects", "道具", "物品"],
} as const;

const MATERIAL_COLLECTIONS = [
  { key: "characters", type: "character" },
  { key: "scenes", type: "scene" },
  { key: "props", type: "prop" },
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

export function storyboardMaterialReferenceNames(
  storyboard: StoryboardDocument,
) {
  return storyboardMaterialReferences(storyboard.materials)
    .map((material) => material.name.trim())
    .filter(Boolean)
    .sort((left, right) => right.length - left.length);
}

export function createStoryboardShot(index: number): StoryboardShot {
  return {
    id: `shot-${index + 1}`,
    order: index + 1,
    duration: 4,
    visual: "",
    camera_movement: "",
    dialogue: "",
    narration: "",
    sound_music: "",
    prompt: "",
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

export function storyboardPromptWithStyle(
  storyboard: StoryboardDocument,
  prompt: string,
) {
  const basePrompt = prompt.trim();
  const stylePrompt = String(storyboard.style_prompt || "").trim();
  if (!stylePrompt || basePrompt.includes(stylePrompt)) {
    return basePrompt;
  }
  if (!basePrompt) {
    return `统一视觉风格：${stylePrompt}`;
  }
  const separator = /[。！？!?；;，,：:]$/.test(basePrompt) ? "" : "。";
  return `${basePrompt}${separator}统一视觉风格：${stylePrompt}`;
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
  if (
    String(row.type || "")
      .trim()
      .toLowerCase() === "storyboard"
  ) {
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
    "camera_movement",
    "dialogue",
    "narration",
    "sound_music",
    "prompt",
    "duration",
    "order",
  ].some((key) => key in value);
}

function normalizeStoryboard(row: Record<string, unknown>): StoryboardDocument {
  const shots = Array.isArray(row.shots) ? row.shots : [];
  const usedShotIds = new Set<string>();
  const materials = normalizeStoryboardMaterials(row);
  const normalizedShots = shots.map((shot, index) => {
    const normalized = normalizeStoryboardShot(shot, index);
    normalized.id = uniqueShotId(normalized.id, index, usedShotIds);
    usedShotIds.add(normalized.id);
    return normalized;
  });
  return {
    ...row,
    type: "storyboard",
    version: positiveInteger(row.version, 1),
    title: stringValue(row.title),
    style_prompt: stringValue(
      firstDefined(
        row.style_prompt,
        ...STYLE_PROMPT_ALIASES.map((key) => row[key]),
      ),
    ),
    shots: materials
      ? normalizeStoryboardMaterialMentions(normalizedShots, materials)
      : normalizedShots,
    ...(materials ? { materials } : {}),
  };
}

function storyboardMaterialReferences(
  materials?: StoryboardMaterials,
): StoryboardMaterialReference[] {
  if (!materials) {
    return [];
  }
  return MATERIAL_COLLECTIONS.flatMap(({ key, type }) =>
    materials[key].map((material) => ({
      type,
      id: material.id,
      name: material.name,
      shot_ids: material.shot_ids,
    })),
  );
}

function normalizeStoryboardMaterialMentions(
  shots: StoryboardShot[],
  materials: StoryboardMaterials,
) {
  const references = storyboardMaterialReferences(materials);
  return shots.map((shot) => {
    const names = references
      .filter((material) => material.shot_ids.includes(shot.id))
      .map((material) => material.name.trim())
      .filter(Boolean);
    if (!names.length) {
      return shot;
    }
    return {
      ...shot,
      visual: normalizeMaterialMentions(shot.visual, names, true),
      camera_movement: normalizeMaterialMentions(
        shot.camera_movement,
        names,
        false,
      ),
      dialogue: normalizeMaterialMentions(shot.dialogue, names, false),
      narration: normalizeMaterialMentions(shot.narration, names, false),
      sound_music: normalizeMaterialMentions(shot.sound_music, names, false),
      prompt: normalizeMaterialMentions(shot.prompt, names, true),
    };
  });
}

function normalizeMaterialMentions(
  value: string,
  materialNames: string[],
  appendMissing: boolean,
) {
  const names = [...new Set(materialNames)].sort(
    (left, right) => right.length - left.length,
  );
  let result = prefixMaterialNames(value, names);
  if (!appendMissing) {
    return result;
  }
  const missing = names.filter((name) => !result.includes(`@${name}`));
  if (!missing.length) {
    return result;
  }
  const mentions = missing.map((name) => `@${name}`).join(" ");
  result = result.trim();
  return result ? `${result}；${mentions}` : mentions;
}

function prefixMaterialNames(value: string, names: string[]) {
  let result = "";
  let cursor = 0;
  while (cursor < value.length) {
    if (value[cursor] === "@") {
      const mentioned = names.find((name) =>
        value.startsWith(name, cursor + 1),
      );
      if (mentioned) {
        result += `@${mentioned}`;
        cursor += mentioned.length + 1;
        continue;
      }
    }
    const matched = names.find((name) => value.startsWith(name, cursor));
    if (matched) {
      result += `@${matched}`;
      cursor += matched.length;
      continue;
    }
    result += value[cursor];
    cursor += 1;
  }
  return result;
}

function normalizeStoryboardMaterials(
  row: Record<string, unknown>,
): StoryboardMaterials | undefined {
  const nested = isRecord(row.materials)
    ? row.materials
    : isRecord(row.material_manifest)
      ? row.material_manifest
      : null;
  const source = nested || row;
  const hasManifest = Boolean(
    nested ||
    Object.values(MATERIAL_LIST_ALIASES).some((aliases) =>
      aliases.some((key) => source[key] != null),
    ),
  );
  if (!hasManifest) {
    return undefined;
  }
  return {
    characters: normalizeMaterialList(
      firstDefined(
        ...MATERIAL_LIST_ALIASES.characters.map((key) => source[key]),
      ),
      "character",
    ),
    scenes: normalizeMaterialList(
      firstDefined(...MATERIAL_LIST_ALIASES.scenes.map((key) => source[key])),
      "scene",
    ),
    props: normalizeMaterialList(
      firstDefined(...MATERIAL_LIST_ALIASES.props.map((key) => source[key])),
      "prop",
    ),
  };
}

function normalizeMaterialList(value: unknown, type: StoryboardMaterialType) {
  const values = Array.isArray(value)
    ? value
    : isRecord(value)
      ? Object.entries(value).map(([key, item]) =>
          isRecord(item) ? { id: key, ...item } : { id: key, name: item },
        )
      : [];
  const usedIds = new Set<string>();
  return values.map((value, index) => {
    const row = isRecord(value) ? value : { name: value };
    const name = stringValue(firstDefined(row.name, row.title, row.label));
    const requestedId = stringValue(firstDefined(row.id, row.key));
    const baseId = requestedId || fallbackMaterialId(type, name, index);
    const id = uniqueMaterialId(baseId, usedIds);
    usedIds.add(id);
    return {
      ...row,
      id,
      name: name || materialFallbackName(type, index),
      prompt: stringValue(
        firstDefined(
          row.prompt,
          row.image_prompt,
          row.imagePrompt,
          row.description,
          row.visual,
          row.appearance,
        ),
      ),
      shot_ids: normalizeShotIds(
        firstDefined(row.shot_ids, row.shotIds, row.shots),
      ),
    };
  });
}

function normalizeShotIds(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }
  const seen = new Set<string>();
  return value
    .map((item) => stringValue(isRecord(item) ? item.id : item).trim())
    .filter((id) => {
      if (!id || seen.has(id)) {
        return false;
      }
      seen.add(id);
      return true;
    });
}

function fallbackMaterialId(
  type: StoryboardMaterialType,
  name: string,
  index: number,
) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${type}-${slug || stableTextHash(name) || index + 1}`;
}

function stableTextHash(value: string) {
  const text = value.trim();
  if (!text) {
    return "";
  }
  let hash = 2166136261;
  for (const char of text) {
    hash ^= char.codePointAt(0) || 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function uniqueMaterialId(requestedId: string, usedIds: Set<string>) {
  if (!usedIds.has(requestedId)) {
    return requestedId;
  }
  let suffix = 2;
  while (usedIds.has(`${requestedId}-${suffix}`)) {
    suffix += 1;
  }
  return `${requestedId}-${suffix}`;
}

function materialFallbackName(type: StoryboardMaterialType, index: number) {
  const labels: Record<StoryboardMaterialType, string> = {
    character: "角色",
    scene: "场景",
    prop: "道具",
  };
  return `${labels[type]} ${index + 1}`;
}

function normalizeStoryboardShot(
  value: unknown,
  index: number,
): StoryboardShot {
  const row = isRecord(value) ? value : {};
  const normalized: StoryboardShot = {
    ...row,
    id: stringValue(row.id) || `shot-${index + 1}`,
    order: index + 1,
    duration: positiveInteger(row.duration, 4),
    visual: stringValue(row.visual),
    camera_movement: stringValue(
      firstDefined(
        row.camera_movement,
        ...CAMERA_MOVEMENT_ALIASES.map((key) => row[key]),
      ),
    ),
    dialogue: stringValue(row.dialogue),
    narration: stringValue(row.narration),
    sound_music: stringValue(
      firstDefined(
        row.sound_music,
        ...SOUND_MUSIC_ALIASES.map((key) => row[key]),
      ),
    ),
    prompt: stringValue(
      firstDefined(row.prompt, ...SHOT_PROMPT_ALIASES.map((key) => row[key])),
    ),
  };
  for (const key of [
    ...CAMERA_MOVEMENT_ALIASES,
    ...SOUND_MUSIC_ALIASES,
    ...SHOT_PROMPT_ALIASES,
  ]) {
    delete normalized[key];
  }
  normalized.prompt =
    normalized.prompt.trim() || storyboardShotFallbackPrompt(normalized);
  return normalized;
}

export function storyboardShotFallbackPrompt(shot: StoryboardShot) {
  const parts = [
    shot.visual,
    shot.camera_movement ? `运镜：${shot.camera_movement}` : "",
    shot.dialogue ? `对白：${shot.dialogue}` : "",
    shot.narration ? `旁白：${shot.narration}` : "",
    shot.sound_music ? `声音：${shot.sound_music}` : "",
    shot.duration > 0 ? `时长：${shot.duration} 秒` : "",
  ].filter(Boolean);
  return parts.join("。") || `镜头 ${shot.order} 视频生成提示词`;
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
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function firstDefined(...values: unknown[]) {
  return values.find((value) => value !== undefined && value !== null);
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
