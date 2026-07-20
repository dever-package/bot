import type { StoryboardGroupDirection } from "./space-storyboard-derived-layout";
import {
  isStoryboardVisibleDialogue,
  storyboardHasVisibleDialogue,
  storyboardMaterialReferenceNames,
  storyboardPromptWithStyle,
  storyboardShotFallbackPrompt,
  type StoryboardDocument,
  type StoryboardMaterial,
  type StoryboardShot,
  type StoryboardSpeech,
} from "./space-storyboard";
import type { CanvasReferenceContent, CanvasStoryboardItemType } from "./types";

export type StoryboardPowerKind = "image" | "video" | "audio";

export type StoryboardDerivedOptions = {
  enableLipSync: boolean;
};

export type StoryboardDerivedSourceItem = {
  type: CanvasStoryboardItemType;
  id: string;
};

export type StoryboardDerivedItem = {
  type: CanvasStoryboardItemType;
  id: string;
  title: string;
  prompt: string;
  promptContent?: CanvasReferenceContent;
  sourceItems?: StoryboardDerivedSourceItem[];
  sourceNodeIds?: string[];
  sourceSignatureParts?: string[];
  shotId?: string;
  frameRole?: "start" | "end";
  speechId?: string;
  speechIds?: string[];
  characterId?: string;
  speechKind?: "dialogue" | "narration";
  speakerMode?: "visible" | "offscreen";
  startTime?: number;
  shotDuration?: number;
};

export type StoryboardDerivedGroupKey =
  | "characters"
  | "scenes"
  | "props"
  | "shot_frames"
  | "shots"
  | "speech"
  | "lip_sync";

export type StoryboardDerivedGroupSpec = {
  key: StoryboardDerivedGroupKey;
  title: string;
  itemType: CanvasStoryboardItemType;
  powerKind: StoryboardPowerKind;
  outputType: string;
  direction: StoryboardGroupDirection;
  sourceGroupKeys?: StoryboardDerivedGroupKey[];
  layoutIndex: number;
  enabled: (
    storyboard: StoryboardDocument,
    options: StoryboardDerivedOptions,
  ) => boolean;
  items: (
    storyboard: StoryboardDocument,
    options: StoryboardDerivedOptions,
  ) => StoryboardDerivedItem[];
};

const MATERIAL_LABELS: Record<"character" | "scene" | "prop", string> = {
  character: "角色",
  scene: "场景",
  prop: "道具",
};

export const STORYBOARD_DERIVED_GROUP_SPECS: StoryboardDerivedGroupSpec[] = [
  materialGroupSpec("characters", "角色组", "character", 0),
  materialGroupSpec("scenes", "场景组", "scene", 1),
  materialGroupSpec("props", "道具组", "prop", 2),
  {
    key: "shot_frames",
    title: "镜头画面组",
    itemType: "shot_frame",
    powerKind: "image",
    outputType: "general",
    direction: "downstream",
    layoutIndex: 0,
    enabled: () => true,
    items: (storyboard, options) =>
      storyboard.shots.flatMap((shot, index) =>
        (["start", "end"] as const).map((frameRole) => ({
          type: "shot_frame" as const,
          id: shotFrameItemId(shot.id, frameRole),
          title: shotFrameTitle(shot, index, frameRole),
          prompt: storyboardShotFramePrompt(
            storyboard,
            shot,
            frameRole,
            options,
          ),
          sourceItems: storyboardShotMaterialSourceItems(storyboard, shot.id),
          shotId: shot.id,
          frameRole,
        })),
      ),
  },
  {
    key: "shots",
    title: "镜头视频组",
    itemType: "shot",
    powerKind: "video",
    outputType: "general",
    direction: "downstream",
    sourceGroupKeys: ["shot_frames"],
    layoutIndex: 1,
    enabled: () => true,
    items: (storyboard, options) =>
      storyboard.shots.map((shot, index) => {
        const prompt = storyboardVideoPrompt(storyboard, shot, options);
        return {
          type: "shot",
          id: shot.id,
          title: `镜头 ${shot.order || index + 1}`,
          prompt,
          sourceItems: (["start", "end"] as const).map((frameRole) => ({
            type: "shot_frame" as const,
            id: shotFrameItemId(shot.id, frameRole),
          })),
        };
      }),
  },
  {
    key: "speech",
    title: "角色配音组",
    itemType: "speech",
    powerKind: "audio",
    outputType: "speech",
    direction: "downstream",
    layoutIndex: 2,
    enabled: (storyboard) => storyboard.shots.some(hasStoryboardSpeech),
    items: storyboardSpeechItems,
  },
  {
    key: "lip_sync",
    title: "口型同步组",
    itemType: "lip_sync",
    powerKind: "video",
    outputType: "lip_sync",
    direction: "downstream",
    sourceGroupKeys: ["shots", "speech"],
    layoutIndex: 3,
    enabled: (storyboard, options) =>
      options.enableLipSync &&
      storyboard.shots.some(storyboardHasVisibleDialogue),
    items: storyboardLipSyncItems,
  },
];

function materialGroupSpec(
  key: "characters" | "scenes" | "props",
  title: string,
  itemType: "character" | "scene" | "prop",
  layoutIndex: number,
): StoryboardDerivedGroupSpec {
  return {
    key,
    title,
    itemType,
    powerKind: "image",
    outputType: "general",
    direction: "upstream",
    layoutIndex,
    enabled: (storyboard) => Boolean(storyboard.materials),
    items: (storyboard) =>
      (storyboard.materials?.[key] || []).map((material) => ({
        type: itemType,
        id: material.id,
        title: material.name,
        prompt: storyboardMaterialPrompt(storyboard, material, itemType),
      })),
  };
}

function storyboardSpeechItems(storyboard: StoryboardDocument) {
  return storyboard.shots.flatMap((shot, shotIndex) =>
    shot.speech
      .filter((speech) => speech.text.trim())
      .map((speech, speechIndex) => ({
        type: "speech" as const,
        id: speech.id,
        title: storyboardSpeechTitle(
          storyboard,
          speech,
          shot.order || shotIndex + 1,
          speechIndex,
        ),
        prompt: speech.text.trim(),
        shotId: shot.id,
        speechId: speech.id,
        characterId: speech.character_id,
        speechKind: speech.kind,
        speakerMode: speech.speaker_mode,
        startTime: speech.start_time,
        shotDuration: shot.duration,
      })),
  );
}

function storyboardLipSyncItems(storyboard: StoryboardDocument) {
  return storyboard.shots.flatMap((shot, index) => {
    const visibleSpeech = shot.speech.filter(isStoryboardVisibleDialogue);
    if (!visibleSpeech.length) {
      return [];
    }
    const speechIds = visibleSpeech.map((item) => item.id);
    const characterId = visibleSpeech[0]?.character_id;
    const sourceSpeechIds = shot.speech
      .filter((item) => item.text.trim())
      .map((item) => item.id);
    return [
      {
        type: "lip_sync" as const,
        id: shot.id,
        title: `镜头 ${shot.order || index + 1} 口型`,
        prompt: `同步镜头 ${shot.order || index + 1} 的角色口型`,
        sourceItems: [
          { type: "shot" as const, id: shot.id },
          ...sourceSpeechIds.map((id) => ({ type: "speech" as const, id })),
        ],
        shotId: shot.id,
        speechIds,
        characterId,
        shotDuration: shot.duration,
      },
    ];
  });
}

function storyboardSpeechTitle(
  storyboard: StoryboardDocument,
  speech: StoryboardSpeech,
  shotOrder: number,
  speechIndex: number,
) {
  if (speech.kind === "narration") {
    return `镜头 ${shotOrder} 旁白 ${speechIndex + 1}`;
  }
  const character = storyboard.materials?.characters.find(
    (item) => item.id === speech.character_id,
  );
  return `镜头 ${shotOrder} ${character?.name || "角色"}配音`;
}

function hasStoryboardSpeech(shot: StoryboardShot) {
  return shot.speech.some((speech) => speech.text.trim());
}

function storyboardMaterialPrompt(
  storyboard: StoryboardDocument,
  material: StoryboardMaterial,
  itemType: "character" | "scene" | "prop",
) {
  const prompt = material.prompt.trim();
  if (prompt) {
    return storyboardPromptWithStyle(storyboard, prompt);
  }
  const relatedVisuals = storyboard.shots
    .filter((shot) => material.shot_ids.includes(shot.id))
    .flatMap((shot) => [shot.visual.trim(), shot.end_visual.trim()])
    .filter(Boolean);
  const context = relatedVisuals.length
    ? `相关镜头：${relatedVisuals.join("；")}`
    : "保持整部故事的统一视觉风格";
  return storyboardPromptWithStyle(
    storyboard,
    `${MATERIAL_LABELS[itemType]}“${material.name}”的素材生成图。${context}`,
  );
}

function storyboardShotMaterialSourceItems(
  storyboard: StoryboardDocument,
  shotId: string,
) {
  return (
    [
      ["character", storyboard.materials?.characters || []],
      ["scene", storyboard.materials?.scenes || []],
      ["prop", storyboard.materials?.props || []],
    ] as const
  ).flatMap(([type, materials]) =>
    materials
      .filter((material) => material.shot_ids.includes(shotId))
      .map((material) => ({ type, id: material.id })),
  );
}

function shotFrameItemId(shotId: string, frameRole: "start" | "end") {
  return `${shotId}:${frameRole}`;
}

function shotFrameTitle(
  shot: StoryboardShot,
  index: number,
  frameRole: "start" | "end",
) {
  const roleLabel = frameRole === "start" ? "首帧" : "尾帧";
  return `镜头 ${shot.order || index + 1} ${roleLabel}`;
}

function storyboardShotFramePrompt(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  frameRole: "start" | "end",
  options: StoryboardDerivedOptions,
) {
  const visual = frameRole === "start" ? shot.visual : shot.end_visual;
  const roleLabel = frameRole === "start" ? "首帧" : "尾帧";
  const prompt = [
    visual.trim(),
    shot.camera_movement.trim()
      ? `${roleLabel}构图与机位参考：${shot.camera_movement.trim()}`
      : "",
    storyboardLipSyncFacePrompt(shot, options),
  ]
    .filter(Boolean)
    .join("。");
  return storyboardPromptWithStyle(
    storyboard,
    prompt || storyboardShotFallbackPrompt(shot),
  );
}

function storyboardVideoPrompt(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  options: StoryboardDerivedOptions,
) {
  const prompt = storyboardPromptWithStyle(
    storyboard,
    shot.prompt.trim() || storyboardShotFallbackPrompt(shot),
  );
  const content = storyboardMaterialReferenceNames(storyboard).reduce(
    (current, name) => current.split(`@${name}`).join(name),
    prompt,
  );
  const requirements = [
    storyboardLipSyncFacePrompt(shot, options),
    "声音要求：仅保留环境声和动作声，不生成对白、旁白或背景音乐",
  ].filter(Boolean);
  return `${content}${/[。！？!?；;]$/.test(content) ? "" : "。"}${requirements.join("。")}。`;
}

function storyboardLipSyncFacePrompt(
  shot: StoryboardShot,
  options: StoryboardDerivedOptions,
) {
  if (!options.enableLipSync || !storyboardHasVisibleDialogue(shot)) {
    return "";
  }
  return "口型要求：说话角色是画面中唯一清晰可识别的正脸，其他人物不得露出第二张清晰正脸";
}
