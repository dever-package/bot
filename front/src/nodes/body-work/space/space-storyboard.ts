import { plainMarkdownTextFromRichOutput } from "./space-content-output";
import { embeddedJSONValues } from "./space-structured-json";
import { normalizeStoryboardReferences } from "./space-storyboard-reference";
import type {
  CanvasReferenceContent,
  CanvasStoryboardReference,
} from "./types";

export const STORYBOARD_VERSION = 8;
export const MIN_STORYBOARD_SHOT_DURATION = 4;
export const MAX_STORYBOARD_SHOTS = 50;

export const STORYBOARD_TRANSITION_TYPES = [
  "none",
  "fade",
  "crossfade",
  "fadeblack",
  "fadewhite",
  "wipeleft",
  "wiperight",
] as const;

export type StoryboardTransitionType =
  (typeof STORYBOARD_TRANSITION_TYPES)[number];

export const STORYBOARD_TRANSITION_LABELS: Record<
  StoryboardTransitionType,
  string
> = {
  none: "硬切",
  fade: "淡化",
  crossfade: "交叉溶解",
  fadeblack: "黑场淡化",
  fadewhite: "白场淡化",
  wipeleft: "向左擦除",
  wiperight: "向右擦除",
};

export const STORYBOARD_VISUAL_MODES = ["photoreal", "stylized"] as const;

export type StoryboardVisualMode =
  (typeof STORYBOARD_VISUAL_MODES)[number];

export const STORYBOARD_VISUAL_MODE_LABELS: Record<
  StoryboardVisualMode,
  string
> = {
  photoreal: "写实影像",
  stylized: "非写实影像",
};

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
  voice: string;
  reference_keys: string[];
};

export type StoryboardMaterialUsage = {
  shotIds: string[];
  speechIds: string[];
};

export type StoryboardEditorFocus = {
  section?: "materials" | "shots";
  materialType?: StoryboardMaterialType;
  materialId?: string;
  shotId?: string;
};

export type StoryboardWorkflowStatus = "draft" | "confirmed";

export type StoryboardWorkflow = {
  status: StoryboardWorkflowStatus;
  confirmed_at: string;
};

export const STORYBOARD_OUTPUT_TARGETS = [
  "final_video",
  "shot_videos",
  "storyboard_only",
] as const;

export type StoryboardOutputTarget =
  (typeof STORYBOARD_OUTPUT_TARGETS)[number];

export type StoryboardProductionMode = "auto" | "off";

export type StoryboardProductionPlan = {
  output_target: StoryboardOutputTarget;
  voice_mode: StoryboardProductionMode;
  subtitle_mode: StoryboardProductionMode;
  lip_sync_mode: StoryboardProductionMode;
  shot_visual_strategy: "auto";
};

export const DEFAULT_STORYBOARD_PRODUCTION_PLAN: StoryboardProductionPlan = {
  output_target: "final_video",
  voice_mode: "auto",
  subtitle_mode: "auto",
  lip_sync_mode: "off",
  shot_visual_strategy: "auto",
};

const LEGACY_STORYBOARD_PRODUCTION_PLAN: StoryboardProductionPlan = {
  ...DEFAULT_STORYBOARD_PRODUCTION_PLAN,
  lip_sync_mode: "auto",
};

export type StoryboardStoryline = {
  setup: string;
  development: string;
  payoff: string;
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
  subtitle_enabled: boolean;
  subtitle_text: string;
};

export type StoryboardCaptionType = "caption" | "title" | "highlight";

export type StoryboardCaption = Record<string, unknown> & {
  id: string;
  type: StoryboardCaptionType;
  text: string;
  start_time: number;
  end_time: number;
};

export type StoryboardSubtitleTrack = {
  id: string;
  text: string;
  start_time: number;
  end_time?: number;
  speech_id?: string;
  source: "speech" | "caption";
};

export type StoryboardReferenceField =
  | "description"
  | "camera_instruction"
  | "video_prompt";

export type StoryboardShot = Record<string, unknown> & {
  id: string;
  order: number;
  duration: number;
  beat: string;
  transition: string;
  transition_type: StoryboardTransitionType;
  transition_duration_ms: number;
  description: string;
  camera_instruction: string;
  video_prompt: string;
  material_ids: string[];
  reference_keys: string[];
  match_previous: boolean;
  continue_previous: boolean;
  continuity_anchor: string;
  speech: StoryboardSpeech[];
  captions: StoryboardCaption[];
  reference_contents?: Partial<
    Record<StoryboardReferenceField, CanvasReferenceContent>
  >;
};

export type StoryboardDocument = Record<string, unknown> & {
  type: "storyboard";
  version: typeof STORYBOARD_VERSION;
  workflow: StoryboardWorkflow;
  production_plan: StoryboardProductionPlan;
  title: string;
  summary: string;
  target_duration: number;
  target_shot_count: number;
  narrator_voice: string;
  storyline: StoryboardStoryline;
  style_prompt: string;
  visual_mode: StoryboardVisualMode;
  aspect_ratio: StoryboardAspectRatio;
  references: CanvasStoryboardReference[];
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
    beat: "",
    transition: "",
    transition_type: "none",
    transition_duration_ms: 0,
    description: "",
    camera_instruction: "",
    video_prompt: "",
    material_ids: [],
    reference_keys: [],
    match_previous: false,
    continue_previous: false,
    continuity_anchor: "",
    speech: [],
    captions: [],
  };
}

export function createStoryboardMaterial(
  materials: StoryboardMaterial[],
  type: StoryboardMaterialType,
): StoryboardMaterial {
  const usedIds = new Set(materials.map((material) => material.id));
  let sequence = materials.filter((material) => material.type === type).length + 1;
  let id = `${type}-${sequence}`;
  while (usedIds.has(id)) {
    sequence += 1;
    id = `${type}-${sequence}`;
  }
  return {
    id,
    type,
    name: "",
    prompt: "",
    voice: "",
    reference_keys: [],
  };
}

export function storyboardMaterialUsage(
  storyboard: StoryboardDocument,
  materialId: string,
): StoryboardMaterialUsage {
  const shotIds: string[] = [];
  const speechIds: string[] = [];
  for (const shot of storyboard.shots) {
    if (shot.material_ids.includes(materialId)) {
      shotIds.push(shot.id);
    }
    for (const speech of shot.speech) {
      if (speech.character_id === materialId) {
        speechIds.push(speech.id);
      }
    }
  }
  return { shotIds, speechIds };
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
    subtitle_enabled: true,
    subtitle_text: "",
    ...(kind === "dialogue"
      ? { character_id: "", speaker_mode: "offscreen" as const }
      : {}),
  };
}

export function createStoryboardCaption(
  shot: StoryboardShot,
): StoryboardCaption {
  const usedIds = new Set(shot.captions.map((caption) => caption.id));
  let sequence = shot.captions.length + 1;
  let id = `${shot.id}-caption-${sequence}`;
  while (usedIds.has(id)) {
    sequence += 1;
    id = `${shot.id}-caption-${sequence}`;
  }
  return {
    id,
    type: "caption",
    text: "",
    start_time: 0,
    end_time: Math.min(shot.duration, 2),
  };
}

export function normalizeStoryboardOrder(
  storyboard: StoryboardDocument,
): StoryboardDocument {
  const workflow = normalizeStoryboardWorkflow(storyboard.workflow);
  const references = normalizeStoryboardReferences(storyboard.references);
  const referenceKeys = new Set(references.map((reference) => reference.key));
  const materialIDs = new Set(
    storyboard.materials.map((material) => material.id),
  );
  return {
    ...storyboard,
    version: STORYBOARD_VERSION,
    workflow,
    production_plan: normalizeStoryboardProductionPlan(
      storyboard.production_plan,
      workflow.status === "confirmed",
    ),
    target_duration: Math.max(
      MIN_STORYBOARD_SHOT_DURATION,
      Math.round(Number(storyboard.target_duration) || 0),
    ),
    target_shot_count: Math.min(
      MAX_STORYBOARD_SHOTS,
      Math.max(1, Math.round(Number(storyboard.target_shot_count) || 0)),
    ),
    narrator_voice: storyboard.narrator_voice.trim(),
    aspect_ratio: normalizeStoryboardAspectRatio(storyboard.aspect_ratio),
    references,
    materials: storyboard.materials.map((material) => ({
      ...material,
      voice: material.type === "character" ? material.voice.trim() : "",
      reference_keys: uniqueStrings(material.reference_keys).filter((key) =>
        referenceKeys.has(key),
      ),
    })),
    shots: storyboard.shots.map((shot, index) => ({
      ...shot,
      id: shot.id || `shot-${index + 1}`,
      order: index + 1,
      transition: index > 0 ? shot.transition.trim() : "",
      transition_type:
        index > 0
          ? normalizeStoryboardTransitionType(shot.transition_type)
          : "none",
      transition_duration_ms:
        index > 0 && shot.transition_type !== "none"
          ? Math.min(5000, Math.max(100, Math.round(shot.transition_duration_ms)))
          : 0,
      material_ids: uniqueStrings(shot.material_ids).filter((id) =>
        materialIDs.has(id),
      ),
      reference_keys: uniqueStrings(shot.reference_keys).filter((key) =>
        referenceKeys.has(key),
      ),
      match_previous:
        index > 0 && !shot.continue_previous && Boolean(shot.match_previous),
      continue_previous: index > 0 && Boolean(shot.continue_previous),
      continuity_anchor:
        index > 0 && shot.continue_previous
          ? shot.continuity_anchor.trim()
          : "",
    })),
  };
}

export function reconcileStoryboardContinuity(
  previous: StoryboardDocument,
  next: StoryboardDocument,
): StoryboardDocument {
  const previousPredecessors = new Map<string, string>();
  previous.shots.forEach((shot, index) => {
    if (index > 0) {
      previousPredecessors.set(shot.id, previous.shots[index - 1].id);
    }
  });
  return {
    ...next,
    shots: next.shots.map((shot, index) => {
      const predecessorID = index > 0 ? next.shots[index - 1].id : "";
      const predecessorChanged =
        index === 0 || previousPredecessors.get(shot.id) !== predecessorID;
      return {
        ...shot,
        transition: predecessorChanged ? "" : shot.transition,
        transition_type: predecessorChanged ? "none" : shot.transition_type,
        transition_duration_ms: predecessorChanged
          ? 0
          : shot.transition_duration_ms,
        match_previous:
          !predecessorChanged && !shot.continue_previous
            ? shot.match_previous
            : false,
        continue_previous:
          !predecessorChanged && Boolean(shot.continue_previous),
        continuity_anchor:
          !predecessorChanged && shot.continue_previous
            ? shot.continuity_anchor
            : "",
      };
    }),
  };
}

export function isStoryboardConfirmed(storyboard: StoryboardDocument) {
  return storyboard.workflow.status === "confirmed";
}

export function normalizeStoryboardProductionPlan(
  value: unknown,
  legacyFallback = false,
): StoryboardProductionPlan {
  const fallback = legacyFallback
    ? LEGACY_STORYBOARD_PRODUCTION_PLAN
    : DEFAULT_STORYBOARD_PRODUCTION_PLAN;
  if (!isRecord(value)) {
    return { ...fallback };
  }
  const outputTarget = stringValue(value.output_target).toLowerCase();
  return {
    output_target: STORYBOARD_OUTPUT_TARGETS.includes(
      outputTarget as StoryboardOutputTarget,
    )
      ? (outputTarget as StoryboardOutputTarget)
      : fallback.output_target,
    voice_mode: normalizeStoryboardProductionMode(
      value.voice_mode,
      fallback.voice_mode,
    ),
    subtitle_mode: normalizeStoryboardProductionMode(
      value.subtitle_mode,
      fallback.subtitle_mode,
    ),
    lip_sync_mode: normalizeStoryboardProductionMode(
      value.lip_sync_mode,
      fallback.lip_sync_mode,
    ),
    shot_visual_strategy: "auto",
  };
}

export function storyboardProductionIncludesVisualPipeline(
  storyboard: StoryboardDocument,
) {
  return storyboard.production_plan.output_target !== "storyboard_only";
}

export function storyboardProductionIncludesComposition(
  storyboard: StoryboardDocument,
) {
  return storyboard.production_plan.output_target === "final_video";
}

export function storyboardProductionIncludesVoice(
  storyboard: StoryboardDocument,
) {
  return (
    storyboardProductionIncludesVisualPipeline(storyboard) &&
    storyboard.production_plan.voice_mode === "auto" &&
    storyboardSpeechCount(storyboard) > 0
  );
}

export function storyboardProductionIncludesSubtitles(
  storyboard: StoryboardDocument,
) {
  return (
    storyboardProductionIncludesVisualPipeline(storyboard) &&
    storyboard.production_plan.subtitle_mode === "auto" &&
    storyboardSubtitleCount(storyboard) > 0
  );
}

export function storyboardProductionIncludesLipSync(
  storyboard: StoryboardDocument,
) {
  return (
    storyboardProductionIncludesVoice(storyboard) &&
    storyboard.production_plan.lip_sync_mode === "auto" &&
    storyboard.shots.some(storyboardHasVisibleDialogue)
  );
}

export function storyboardSpeechCount(storyboard: StoryboardDocument) {
  return storyboard.shots.reduce(
    (total, shot) => total + shot.speech.filter(hasSpeechText).length,
    0,
  );
}

export function storyboardSubtitleCount(storyboard: StoryboardDocument) {
  return storyboard.shots.reduce(
    (total, shot) => total + storyboardShotSubtitleTracks(shot).length,
    0,
  );
}

export function storyboardShotSubtitleTracks(
  shot: StoryboardShot,
): StoryboardSubtitleTrack[] {
  const speechTracks = shot.speech
    .filter(
      (speech) => speech.subtitle_enabled && Boolean(speech.text.trim()),
    )
    .map((speech) => ({
      id: `subtitle-${speech.id}`,
      text: speech.subtitle_text.trim() || speech.text.trim(),
      start_time: speech.start_time,
      speech_id: speech.id,
      source: "speech" as const,
    }));
  const captionTracks = shot.captions
    .filter((caption) => Boolean(caption.text.trim()))
    .map((caption) => ({
      id: caption.id,
      text: caption.text.trim(),
      start_time: caption.start_time,
      end_time: caption.end_time,
      source: "caption" as const,
    }));
  return [...speechTracks, ...captionTracks].sort(
    (left, right) => left.start_time - right.start_time,
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

export function storyboardContentSummary(storyboard: StoryboardDocument) {
  return (
    storyboard.summary.trim() ||
    storyboardContentSummaryFromShots("", storyboard.shots)
  );
}

export function withStoryboardStylePrompt(
  storyboard: StoryboardDocument,
  stylePrompt: string,
): StoryboardDocument {
  const previousStylePrompt = storyboard.style_prompt.trim();
  const nextStoryboard = { ...storyboard, style_prompt: stylePrompt };
  if (
    !previousStylePrompt ||
    previousStylePrompt === stylePrompt.trim()
  ) {
    return nextStoryboard;
  }
  return {
    ...nextStoryboard,
    materials: storyboard.materials.map((material) => ({
      ...material,
      prompt: withoutStoryboardStyleClause(
        material.prompt,
        previousStylePrompt,
      ),
    })),
    shots: storyboard.shots.map((shot) => ({
      ...shot,
      video_prompt: withoutStoryboardStyleClause(
        shot.video_prompt,
        previousStylePrompt,
      ),
    })),
  };
}

export function storyboardPromptWithStyle(
  storyboard: StoryboardDocument,
  prompt: string,
) {
  const visualModePrompt =
    storyboard.visual_mode === "photoreal"
      ? "画面类型：写实影像，人物五官、身体比例、光线和材质保持真实自然"
      : "画面类型：非写实影像，保持统一造型语言，不得漂移为真人摄影";
  let basePrompt = appendStoryboardPromptClause(prompt.trim(), visualModePrompt);
  const stylePrompt = storyboard.style_prompt.trim();
  if (!stylePrompt) {
    return basePrompt;
  }
  const styleClause = `统一视觉风格：${stylePrompt}`;
  basePrompt = appendStoryboardPromptClause(basePrompt, styleClause);
  return basePrompt;
}

function withoutStoryboardStyleClause(prompt: string, stylePrompt: string) {
  const clause = `统一视觉风格：${stylePrompt}`;
  const normalizedPrompt = prompt
    .trimEnd()
    .replace(/[。！？!?；;，,\s]+$/g, "");
  if (!normalizedPrompt.endsWith(clause)) {
    return prompt;
  }
  return normalizedPrompt
    .slice(0, -clause.length)
    .replace(/[。！？!?；;，,：:\s]+$/g, "")
    .trimEnd();
}

function appendStoryboardPromptClause(
  prompt: string,
  clause: string,
) {
  if (!clause || prompt.includes(clause)) {
    return prompt;
  }
  if (!prompt) {
    return clause;
  }
  const separator = /[。！？!?；;，,：:]$/.test(prompt) ? "" : "。";
  return `${prompt}${separator}${clause}`;
}

export function normalizeStoryboardAspectRatio(
  value: unknown,
): StoryboardAspectRatio {
  const normalized = stringValue(value) as StoryboardAspectRatio;
  return STORYBOARD_ASPECT_RATIOS.includes(normalized)
    ? normalized
    : DEFAULT_STORYBOARD_ASPECT_RATIO;
}

export function normalizeStoryboardTransitionType(
  value: unknown,
): StoryboardTransitionType {
  const normalized = stringValue(value) as StoryboardTransitionType;
  return STORYBOARD_TRANSITION_TYPES.includes(normalized)
    ? normalized
    : "none";
}

export function storyboardShotFallbackPrompt(shot: StoryboardShot) {
  const speech = shot.speech
    .filter(hasSpeechText)
    .map((item) => `${storyboardSpeechLabel(item)}：${item.text.trim()}`)
    .join("；");
  const parts = [
    shot.description,
    shot.camera_instruction ? `镜头语言：${shot.camera_instruction}` : "",
    shot.continue_previous && shot.continuity_anchor
      ? `连续性锚点：${shot.continuity_anchor}`
      : "",
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
    typeof row.narrator_voice !== "string" ||
    typeof row.style_prompt !== "string" ||
    !isStoryboardVisualMode(visualMode) ||
    !Array.isArray(row.references) ||
    !Array.isArray(row.materials) ||
    !Array.isArray(row.shots)
  ) {
    return null;
  }

  const storyline = decodeStoryboardStoryline(row.storyline);
  if (!storyline) {
    return null;
  }
  const references = normalizeStoryboardReferences(row.references);
  if (references.length !== row.references.length) {
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

  const targetDuration = numberValue(row.target_duration);
  const targetShotCount = numberValue(row.target_shot_count);
  if (
    targetDuration == null ||
    !Number.isInteger(targetDuration) ||
    targetDuration < MIN_STORYBOARD_SHOT_DURATION ||
    targetShotCount == null ||
    !Number.isInteger(targetShotCount) ||
    targetShotCount < 1 ||
    targetShotCount > MAX_STORYBOARD_SHOTS
  ) {
    return null;
  }

  const workflow = normalizeStoryboardWorkflow(row.workflow);
  return {
    ...row,
    type: "storyboard",
    version: STORYBOARD_VERSION,
    workflow,
    production_plan: normalizeStoryboardProductionPlan(
      row.production_plan,
      workflow.status === "confirmed",
    ),
    title: row.title,
    summary: storyboardContentSummaryFromShots(
      stringValue(row.summary),
      normalizedShots,
    ),
    target_duration: targetDuration,
    target_shot_count: targetShotCount,
    narrator_voice: row.narrator_voice.trim(),
    storyline,
    style_prompt: row.style_prompt,
    visual_mode: visualMode,
    aspect_ratio: normalizeStoryboardAspectRatio(row.aspect_ratio),
    references,
    materials: normalizedMaterials,
    shots: normalizedShots,
  };
}

function decodeStoryboardStoryline(
  value: unknown,
): StoryboardStoryline | null {
  if (!isRecord(value)) {
    return null;
  }
  const setup = stringValue(value.setup);
  const development = stringValue(value.development);
  const payoff = stringValue(value.payoff);
  if (!setup || !development || !payoff) {
    return null;
  }
  return { setup, development, payoff };
}

function storyboardContentSummaryFromShots(
  value: string,
  shots: StoryboardShot[],
) {
  const explicit = value.trim();
  if (explicit) {
    return explicit;
  }
  const descriptions = shots
    .map((shot) => shot.description.trim())
    .filter(Boolean);
  return descriptions.length > 0
    ? descriptions.join("；")
    : "暂无内容简介";
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
    typeof value.prompt !== "string" ||
    typeof value.voice !== "string" ||
    !Array.isArray(value.reference_keys)
  ) {
    return null;
  }
  return {
    ...value,
    id: value.id.trim(),
    type,
    name: value.name.trim().replace(/^[@#]+/, ""),
    prompt: value.prompt.trim(),
    voice: type === "character" ? value.voice.trim() : "",
    reference_keys: uniqueStrings(value.reference_keys.map(stringValue)),
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
    typeof value.beat !== "string" ||
    !value.beat.trim() ||
    typeof value.transition !== "string" ||
    typeof value.transition_type !== "string" ||
    typeof value.match_previous !== "boolean" ||
    typeof value.description !== "string" ||
    typeof value.camera_instruction !== "string" ||
    typeof value.video_prompt !== "string" ||
    typeof value.continue_previous !== "boolean" ||
    typeof value.continuity_anchor !== "string" ||
    !Array.isArray(value.material_ids) ||
    !Array.isArray(value.reference_keys) ||
    !Array.isArray(value.speech) ||
    !Array.isArray(value.captions)
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
  const captions = value.captions.map(decodeStoryboardCaption);
  if (
    captions.some(
      (item) => !item || (item as StoryboardCaption).end_time > duration,
    )
  ) {
    return null;
  }
  const continuesPrevious = index > 0 && value.continue_previous;
  if (
    (index === 0 && (value.match_previous || value.continue_previous)) ||
    (value.match_previous && value.continue_previous)
  ) {
    return null;
  }
  const matchesPrevious =
    index > 0 && !continuesPrevious && value.match_previous;
  const transition = value.transition.trim();
  if (index > 0 && !transition) {
    return null;
  }
  const continuityAnchor = value.continuity_anchor.trim();
  if (continuesPrevious && !continuityAnchor) {
    return null;
  }
  const transitionType = normalizeStoryboardTransitionType(
    value.transition_type,
  );
  const transitionDuration = numberValue(value.transition_duration_ms);
  if (
    transitionType !== value.transition_type ||
    transitionDuration == null ||
    !Number.isInteger(transitionDuration) ||
    transitionDuration < 0 ||
    transitionDuration > 5000 ||
    (index === 0 &&
      (transitionType !== "none" || transitionDuration !== 0)) ||
    (index > 0 && transitionType === "none" && transitionDuration !== 0) ||
    (index > 0 && transitionType !== "none" && transitionDuration < 100)
  ) {
    return null;
  }
  return {
    ...value,
    id: value.id.trim(),
    order: index + 1,
    duration,
    beat: value.beat.trim(),
    transition: index > 0 ? transition : "",
    transition_type: index > 0 ? transitionType : "none",
    transition_duration_ms:
      index > 0 && transitionType !== "none" ? transitionDuration : 0,
    description: value.description,
    camera_instruction: value.camera_instruction,
    video_prompt: value.video_prompt,
    material_ids: materialIdList,
    reference_keys: uniqueStrings(value.reference_keys.map(stringValue)),
    match_previous: matchesPrevious,
    continue_previous: continuesPrevious,
    continuity_anchor: continuesPrevious ? continuityAnchor : "",
    speech: speech as StoryboardSpeech[],
    captions: captions as StoryboardCaption[],
  };
}

function decodeStoryboardSpeech(value: unknown): StoryboardSpeech | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    !value.id.trim() ||
    typeof value.text !== "string" ||
    typeof value.subtitle_enabled !== "boolean" ||
    typeof value.subtitle_text !== "string"
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
      subtitle_enabled: value.subtitle_enabled,
      subtitle_text: value.subtitle_text,
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
    subtitle_enabled: value.subtitle_enabled,
    subtitle_text: value.subtitle_text,
  };
}

function decodeStoryboardCaption(value: unknown): StoryboardCaption | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    !value.id.trim() ||
    typeof value.text !== "string"
  ) {
    return null;
  }
  const type = stringValue(value.type).toLowerCase();
  const startTime = numberValue(value.start_time);
  const endTime = numberValue(value.end_time);
  if (
    !isStoryboardCaptionType(type) ||
    startTime == null ||
    endTime == null ||
    startTime < 0 ||
    endTime <= startTime
  ) {
    return null;
  }
  return {
    ...value,
    id: value.id.trim(),
    type,
    text: value.text,
    start_time: startTime,
    end_time: endTime,
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

function normalizeStoryboardProductionMode(
  value: unknown,
  fallback: StoryboardProductionMode,
): StoryboardProductionMode {
  const mode = stringValue(value).toLowerCase();
  return mode === "auto" || mode === "off" ? mode : fallback;
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

function isStoryboardCaptionType(
  value: string,
): value is StoryboardCaptionType {
  return value === "caption" || value === "title" || value === "highlight";
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
