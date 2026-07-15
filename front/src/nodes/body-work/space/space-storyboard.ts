import { plainMarkdownTextFromRichOutput } from "./space-content-output";
import { embeddedJSONValues } from "./space-structured-json";

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

export type StoryboardShot = Record<string, unknown> & {
  id: string;
  order: number;
  duration: number;
  visual: string;
  camera_movement: string;
  dialogue: string;
  narration: string;
  sound_music: string;
};

export type StoryboardDocument = Record<string, unknown> & {
  type: "storyboard";
  version: number;
  title: string;
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

const MATERIAL_LIST_ALIASES = {
  characters: ["characters", "roles", "people", "角色", "人物"],
  scenes: ["scenes", "locations", "places", "场景", "地点"],
  props: ["props", "items", "objects", "道具", "物品"],
} as const;

export function parseStoryboardOutput(value: unknown) {
  return findStoryboard(value, new Set(), 0);
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
    camera_movement: "",
    dialogue: "",
    narration: "",
    sound_music: "",
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

export function storyboardHasMaterialManifest(
  storyboard: StoryboardDocument,
) {
  return Boolean(storyboard.materials);
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
    "camera_movement",
    "dialogue",
    "narration",
    "sound_music",
    "duration",
    "order",
  ].some((key) => key in value);
}

function normalizeStoryboard(row: Record<string, unknown>): StoryboardDocument {
  const shots = Array.isArray(row.shots) ? row.shots : [];
  const usedShotIds = new Set<string>();
  const materials = normalizeStoryboardMaterials(row);
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
    ...(materials ? { materials } : {}),
  };
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

function normalizeMaterialList(
  value: unknown,
  type: StoryboardMaterialType,
) {
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
  };
  for (const key of [
    ...CAMERA_MOVEMENT_ALIASES,
    ...SOUND_MUSIC_ALIASES,
  ]) {
    delete normalized[key];
  }
  return normalized;
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
