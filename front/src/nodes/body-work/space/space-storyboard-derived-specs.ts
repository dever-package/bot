import type { StoryboardGroupDirection } from "./space-storyboard-derived-layout";
import {
  STORYBOARD_MATERIAL_LABELS,
  isStoryboardVisibleDialogue,
  storyboardHasVisibleDialogue,
  storyboardPromptWithStyle,
  storyboardShotFallbackPrompt,
  storyboardShotMaterials,
  storyboardVisibleSpeakerIds,
  type StoryboardDocument,
  type StoryboardMaterial,
  type StoryboardMaterialType,
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
  paramValues?: Record<string, unknown>;
  shotId?: string;
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
  | "shot_images"
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

const MATERIAL_GROUP_KEYS: StoryboardDerivedGroupKey[] = [
  "characters",
  "scenes",
  "props",
];

const MATERIAL_REFERENCE_RULES: Record<StoryboardMaterialType, string> = {
  character:
    "生成纯角色设定图，只展示当前角色的正面、侧面、背面和关键细节，不得出现其他人物、文字、水印或界面元素",
  scene:
    "生成纯场景设定图，只展示固定空间的外观、内部结构、光线和关键区域，不得出现任何人物、角色、动物、文字、水印或界面元素",
  prop:
    "生成纯道具设定图，只展示当前道具的多角度造型、比例、材质和关键细节，不得出现人物、手持者、文字、水印或界面元素",
};

export const STORYBOARD_DERIVED_GROUP_SPECS: StoryboardDerivedGroupSpec[] = [
  materialGroupSpec("characters", "角色组", "character", 0),
  materialGroupSpec("scenes", "场景组", "scene", 1),
  materialGroupSpec("props", "道具组", "prop", 2),
  {
    key: "shot_images",
    title: "镜头参考图组",
    itemType: "shot_image",
    powerKind: "image",
    outputType: "general",
    direction: "downstream",
    sourceGroupKeys: MATERIAL_GROUP_KEYS,
    layoutIndex: 0,
    enabled: () => true,
    items: (storyboard, options) =>
      storyboard.shots.map((shot, index) => ({
        type: "shot_image" as const,
        id: shot.id,
        title: `镜头 ${shot.order || index + 1} 参考图`,
        prompt: storyboardShotImagePrompt(storyboard, shot, options),
        sourceItems: storyboardShotMaterialSourceItems(storyboard, shot),
        paramValues: storyboardShotImageParamValues(storyboard),
        shotId: shot.id,
      })),
  },
  {
    key: "shots",
    title: "镜头视频组",
    itemType: "shot",
    powerKind: "video",
    outputType: "general",
    direction: "downstream",
    sourceGroupKeys: ["shot_images"],
    layoutIndex: 1,
    enabled: () => true,
    items: (storyboard, options) =>
      storyboard.shots.map((shot, index) => ({
        type: "shot" as const,
        id: shot.id,
        title: `镜头 ${shot.order || index + 1}`,
        prompt: storyboardVideoPrompt(storyboard, shot, options),
        sourceItems: storyboardShotVideoSourceItems(storyboard, shot, index),
        paramValues: storyboardVideoParamValues(storyboard, shot),
        shotId: shot.id,
        shotDuration: shot.duration,
      })),
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
  itemType: StoryboardMaterialType,
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
    enabled: (storyboard) =>
      storyboard.materials.some((material) => material.type === itemType),
    items: (storyboard) =>
      storyboard.materials
        .filter((material) => material.type === itemType)
        .map((material) => ({
          type: itemType,
          id: material.id,
          title: material.name,
          prompt: storyboardMaterialPrompt(storyboard, material),
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
  const character = storyboard.materials.find(
    (item) => item.type === "character" && item.id === speech.character_id,
  );
  return `镜头 ${shotOrder} ${character?.name || "角色"}配音`;
}

function hasStoryboardSpeech(shot: StoryboardShot) {
  return shot.speech.some((speech) => speech.text.trim());
}

function storyboardMaterialPrompt(
  storyboard: StoryboardDocument,
  material: StoryboardMaterial,
) {
  const prompt = material.prompt.trim();
  if (prompt) {
    return storyboardPromptWithStyle(
      storyboard,
      `${prompt}。${MATERIAL_REFERENCE_RULES[material.type]}`,
    );
  }
  const relatedDescriptions = storyboard.shots
    .filter((shot) => shot.material_ids.includes(material.id))
    .map((shot) => shot.description.trim())
    .filter(Boolean);
  const context = relatedDescriptions.length
    ? `相关镜头：${relatedDescriptions.join("；")}`
    : "保持整部作品的统一视觉风格";
  return storyboardPromptWithStyle(
    storyboard,
    `${STORYBOARD_MATERIAL_LABELS[material.type]}“${material.name}”的素材生成图。${context}。${MATERIAL_REFERENCE_RULES[material.type]}`,
  );
}

function storyboardShotMaterialSourceItems(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
) {
  return storyboardShotMaterials(storyboard, shot).map((material) => ({
    type: material.type,
    id: material.id,
  }));
}

function storyboardShotVideoSourceItems(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  index: number,
) {
  const previousShot = index > 0 ? storyboard.shots[index - 1] : undefined;
  return [
    { type: "shot_image" as const, id: shot.id },
    ...(shot.continue_previous && previousShot
      ? [{ type: "shot" as const, id: previousShot.id }]
      : []),
  ];
}

function storyboardShotImagePrompt(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  options: StoryboardDerivedOptions,
) {
  const referenceOrder = storyboardShotMaterials(storyboard, shot)
    .map(
      (material, index) =>
        `参考图${index + 1}是${STORYBOARD_MATERIAL_LABELS[material.type]}“${material.name}”`,
    )
    .join("，");
  const parts = [
    `镜头 ${shot.order} 的单张参考画面`,
    referenceOrder ? `图片顺序说明：${referenceOrder}` : "",
    referenceOrder
      ? "必须严格按照上述图片顺序识别素材，不得交换、合并或忽略参考对象"
      : "",
    "严格保持参考角色的五官、发型、服装、配色和体型，保持场景结构、道具造型以及整部作品画风一致",
    "不同参考对象必须保持各自独立的轮廓、材质和尺度，不得把角色与道具融合、机械化、穿戴化或互换材质",
    "角色必须保留参考图中的发饰数量与位置以及完整服装，道具必须保持参考图中的原始尺寸比例",
    shot.description.trim(),
    shot.camera_instruction.trim()
      ? `镜头语言：${shot.camera_instruction.trim()}`
      : "",
    storyboardVisibleFaceConstraint(shot, options),
    `画幅：${storyboard.aspect_ratio}`,
    "画面中不要出现字幕、对白文字、水印或界面元素",
  ].filter(Boolean);
  return storyboardPromptWithStyle(storyboard, parts.join("。"));
}

function storyboardVideoPrompt(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  options: StoryboardDerivedOptions,
) {
  const basePrompt =
    shot.video_prompt.trim() || storyboardShotFallbackPrompt(shot);
  const parts = [
    basePrompt,
    shot.continue_previous
      ? "承接上一镜头的结束状态，保持人物、服装、道具、场景光线和动作方向一致，但不要重复上一镜头内容"
      : "这是新的镜头段落，按当前镜头素材和描述建立画面",
    storyboardVisibleFaceConstraint(shot, options),
    `画幅：${storyboard.aspect_ratio}`,
    "不生成可辨识对白、旁白、字幕或背景音乐，只保留环境声、动作声和不可辨识的人物声音",
    `时长 ${shot.duration} 秒`,
  ].filter(Boolean);
  return storyboardPromptWithStyle(storyboard, parts.join("。"));
}

function storyboardShotImageParamValues(storyboard: StoryboardDocument) {
  return { aspectRatio: storyboard.aspect_ratio, resolution: "2k" };
}

function storyboardVideoParamValues(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
) {
  return {
    aspectRatio: storyboard.aspect_ratio,
    duration: shot.duration,
  };
}

function storyboardVisibleFaceConstraint(
  shot: StoryboardShot,
  options: StoryboardDerivedOptions,
) {
  if (!options.enableLipSync || !storyboardHasVisibleDialogue(shot)) {
    return "";
  }
  const speakerID = [...storyboardVisibleSpeakerIds(shot)][0];
  if (!speakerID) {
    return "";
  }
  return "出镜说话角色是画面中唯一清晰可识别的正脸，其他人物使用背面、侧后方、远景或遮挡构图";
}
