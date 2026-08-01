import type { StoryboardGroupDirection } from "./space-storyboard-derived-layout";
import {
  STORYBOARD_MATERIAL_LABELS,
  STORYBOARD_TRANSITION_LABELS,
  isStoryboardVisibleDialogue,
  storyboardHasVisibleDialogue,
  storyboardProductionIncludesLipSync,
  storyboardProductionIncludesReferenceImages,
  storyboardProductionIncludesShotVideos,
  storyboardProductionIncludesSubtitles,
  storyboardProductionIncludesVoice,
  storyboardPromptWithStyle,
  storyboardShotSubtitleTracks,
  storyboardShotFallbackPrompt,
  storyboardShotMaterials,
  storyboardVisibleSpeakerIds,
  type StoryboardDocument,
  type StoryboardMaterial,
  type StoryboardMaterialType,
  type StoryboardShot,
  type StoryboardSpeech,
} from "./space-storyboard";
import type {
  CanvasReferenceContent,
  CanvasStoryboardItemType,
  CanvasStoryboardReference,
} from "./types";

export type StoryboardPowerKind = "text" | "image" | "video" | "audio";

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
  dependencyItems?: StoryboardDerivedSourceItem[];
  referenceItems?: StoryboardDerivedSourceItem[];
  dependencyNodeIds?: string[];
  referenceNodeIds?: string[];
  externalReferences?: CanvasStoryboardReference[];
  sourceSignatureParts?: string[];
  localOutput?: unknown;
  paramValues?: Record<string, unknown>;
  shotId?: string;
  speechId?: string;
  speechIds?: string[];
  characterId?: string;
  speechKind?: "dialogue" | "narration";
  speakerMode?: "visible" | "offscreen";
  startTime?: number;
  shotDuration?: number;
  continuityAnchor?: string;
  optional?: boolean;
};

export type StoryboardDerivedGroupKey =
  | "characters"
  | "scenes"
  | "props"
  | "shot_images"
  | "shots"
  | "speech"
  | "subtitles"
  | "lip_sync";

export type StoryboardDerivedGroupSpec = {
  key: StoryboardDerivedGroupKey;
  title: string;
  itemType: CanvasStoryboardItemType;
  powerKind: StoryboardPowerKind;
  outputType: string;
  local?: boolean;
  direction: StoryboardGroupDirection;
  sourceGroupKeys?: StoryboardDerivedGroupKey[];
  layoutIndex: number;
  enabled: (storyboard: StoryboardDocument) => boolean;
  items: (storyboard: StoryboardDocument) => StoryboardDerivedItem[];
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
    enabled: storyboardProductionIncludesReferenceImages,
    items: (storyboard) =>
      storyboard.shots.flatMap((shot, index) => {
        if (shot.continue_previous) {
          return [];
        }
        const sources = storyboardShotImageSources(storyboard, shot, index);
        return [
          {
            type: "shot_image" as const,
            id: shot.id,
            title: `镜头 ${shot.order || index + 1} 参考图`,
            prompt: storyboardShotImagePrompt(
              storyboard,
              shot,
              sources.previousShot,
              sources.externalReferences,
            ),
            dependencyItems: sources.dependencyItems,
            referenceItems: sources.referenceItems,
            externalReferences: sources.externalReferences,
            paramValues: storyboardShotImageParamValues(storyboard),
            shotId: shot.id,
          },
        ];
      }),
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
    enabled: storyboardProductionIncludesShotVideos,
    items: (storyboard) =>
      storyboard.shots.map((shot, index) => {
        const sources = storyboardShotVideoSources(storyboard, shot, index);
        return {
          type: "shot" as const,
          id: shot.id,
          title: `镜头 ${shot.order || index + 1}`,
          prompt: storyboardVideoPrompt(
            storyboard,
            shot,
            sources.externalReferences,
          ),
          ...sources,
          paramValues: storyboardVideoParamValues(storyboard, shot),
          shotId: shot.id,
          shotDuration: shot.duration,
          continuityAnchor: shot.continuity_anchor,
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
    enabled: storyboardProductionIncludesVoice,
    items: storyboardSpeechItems,
  },
  {
    key: "subtitles",
    title: "字幕组",
    itemType: "subtitle",
    powerKind: "text",
    outputType: "general",
    local: true,
    direction: "downstream",
    layoutIndex: 3,
    enabled: storyboardProductionIncludesSubtitles,
    items: storyboardSubtitleItems,
  },
  {
    key: "lip_sync",
    title: "口型同步组",
    itemType: "lip_sync",
    powerKind: "video",
    outputType: "lip_sync",
    direction: "downstream",
    sourceGroupKeys: ["shots", "speech"],
    layoutIndex: 4,
    enabled: storyboardProductionIncludesLipSync,
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
      storyboardProductionIncludesReferenceImages(storyboard) &&
      storyboard.materials.some((material) => material.type === itemType),
    items: (storyboard) =>
      storyboard.materials
        .filter((material) => material.type === itemType)
        .map((material) => {
          const externalReferences = storyboardMaterialReferences(
            storyboard,
            material,
          );
          return {
            type: itemType,
            id: material.id,
            title: material.name,
            prompt: storyboardMaterialPrompt(
              storyboard,
              material,
              externalReferences,
            ),
            externalReferences,
          };
        }),
  };
}

function storyboardSpeechItems(storyboard: StoryboardDocument) {
  return storyboard.shots.flatMap((shot, shotIndex) =>
    shot.speech
      .filter((speech) => speech.text.trim())
      .map((speech, speechIndex) => {
        const voice = storyboardSpeechVoice(storyboard, speech);
        return {
          type: "speech" as const,
          id: speech.id,
          title: storyboardSpeechTitle(
            storyboard,
            speech,
            shot.order || shotIndex + 1,
            speechIndex,
          ),
          prompt: speech.text.trim(),
          ...(voice ? { paramValues: { voice } } : {}),
          shotId: shot.id,
          speechId: speech.id,
          characterId: speech.character_id,
          speechKind: speech.kind,
          speakerMode: speech.speaker_mode,
          startTime: speech.start_time,
          shotDuration: shot.duration,
        };
      }),
  );
}

function storyboardSpeechVoice(
  storyboard: StoryboardDocument,
  speech: StoryboardSpeech,
) {
  if (speech.kind === "narration") {
    return storyboard.narrator_voice.trim();
  }
  return (
    storyboard.materials.find(
      (material) =>
        material.type === "character" && material.id === speech.character_id,
    )?.voice || ""
  ).trim();
}

function storyboardSubtitleItems(storyboard: StoryboardDocument) {
  return storyboard.shots.flatMap((shot, index) => {
    const tracks = storyboardShotSubtitleTracks(shot);
    if (!tracks.length) {
      return [];
    }
    return [
      {
        type: "subtitle" as const,
        id: shot.id,
        title: `镜头 ${shot.order || index + 1} 字幕`,
        prompt: tracks.map((track) => track.text).join(" / "),
        localOutput: {
          type: "storyboard_subtitles",
          shot_id: shot.id,
          tracks,
        },
        shotId: shot.id,
        shotDuration: shot.duration,
      },
    ];
  });
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
        dependencyItems: [
          { type: "shot" as const, id: shot.id },
          ...sourceSpeechIds.map((id) => ({ type: "speech" as const, id })),
        ],
        referenceItems: [
          { type: "shot" as const, id: shot.id },
          ...sourceSpeechIds.map((id) => ({ type: "speech" as const, id })),
        ],
        shotId: shot.id,
        speechIds,
        characterId,
        shotDuration: shot.duration,
        optional: true,
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

function storyboardMaterialPrompt(
  storyboard: StoryboardDocument,
  material: StoryboardMaterial,
  references: CanvasStoryboardReference[],
) {
  const referenceInstruction = storyboardReferenceInstructions(references);
  const prompt = material.prompt.trim();
  if (prompt) {
    return storyboardPromptWithStyle(
      storyboard,
      `${referenceInstruction}${prompt}。${MATERIAL_REFERENCE_RULES[material.type]}`,
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
    `${referenceInstruction}${STORYBOARD_MATERIAL_LABELS[material.type]}“${material.name}”的素材生成图。${context}。${MATERIAL_REFERENCE_RULES[material.type]}`,
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

function storyboardShotImageSources(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  index: number,
) {
  const materialItems = storyboardShotMaterialSourceItems(storyboard, shot);
  const externalReferences = storyboardShotImageReferences(storyboard, shot);
  const previousShot = shot.match_previous
    ? storyboardPreviousReferenceShot(storyboard, index)
    : undefined;
  if (!previousShot) {
    return {
      previousShot: undefined,
      dependencyItems: [],
      referenceItems: materialItems,
      externalReferences,
    };
  }
  const previousItem = {
    type: "shot_image" as const,
    id: previousShot.id,
  };
  return {
    previousShot,
    dependencyItems: [previousItem],
    referenceItems: [previousItem, ...materialItems],
    externalReferences,
  };
}

function storyboardPreviousReferenceShot(
  storyboard: StoryboardDocument,
  index: number,
) {
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    const candidate = storyboard.shots[cursor];
    if (!candidate.continue_previous) {
      return candidate;
    }
  }
  return undefined;
}

function storyboardShotVideoSources(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  index: number,
) {
  const externalReferences = storyboardShotVideoReferences(storyboard, shot);
  const previousShot = index > 0 ? storyboard.shots[index - 1] : undefined;
  if (shot.continue_previous && previousShot) {
    const previousItem = { type: "shot" as const, id: previousShot.id };
    return {
      dependencyItems: [previousItem],
      referenceItems: [previousItem],
      externalReferences,
    };
  }
  return {
    dependencyItems: [],
    referenceItems: [{ type: "shot_image" as const, id: shot.id }],
    externalReferences,
  };
}

function storyboardShotImagePrompt(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  previousShot?: StoryboardShot,
  externalReferences: CanvasStoryboardReference[] = [],
) {
  const shotMaterials = storyboardShotMaterials(storyboard, shot);
  const referenceOrder = [
    ...externalReferences.map(
      (reference, index) =>
        `参考图${index + 1}是${storyboardReferenceDescription(reference)}`,
    ),
    previousShot
      ? `参考图${externalReferences.length + 1}是前序镜头 ${previousShot.order} 的参考画面`
      : "",
    ...shotMaterials.map(
      (material, index) =>
        `参考图${externalReferences.length + index + (previousShot ? 2 : 1)}是${STORYBOARD_MATERIAL_LABELS[material.type]}“${material.name}”`,
    ),
  ]
    .filter(Boolean)
    .join("，");
  const parts = [
    `镜头 ${shot.order} 的单张参考画面`,
    referenceOrder ? `图片顺序说明：${referenceOrder}` : "",
    referenceOrder
      ? "必须严格按照上述图片顺序识别素材，不得交换、合并或忽略参考对象"
      : "",
    previousShot
      ? "当前镜头明确要求匹配上一镜画面；前序镜头只用于保持共同主体状态、光线与空间关系，当前素材清单中不存在的对象不得继续保留"
      : "",
    storyboardNarrativeExecutionContext(storyboard, shot),
    `入镜关键帧状态：${shot.continuity_state.entry.trim()}`,
    "当前图片只表现镜头开始时的入镜状态，不提前表现本镜头动作完成后的出镜状态",
    "严格保持参考角色的五官、发型、服装、配色和体型，保持场景结构、道具造型以及整部作品画风一致",
    "不同参考对象必须保持各自独立的轮廓、材质和尺度，不得把角色与道具融合、机械化、穿戴化或互换材质",
    "角色必须保留参考图中的发饰数量与位置以及完整服装，道具必须保持参考图中的原始尺寸比例",
    shot.description.trim(),
    shot.camera_instruction.trim()
      ? `镜头语言：${shot.camera_instruction.trim()}`
      : "",
    storyboardVisibleFaceConstraint(shot),
    `画幅：${storyboard.aspect_ratio}`,
    "画面中不要出现字幕、对白文字、水印或界面元素",
  ].filter(Boolean);
  return storyboardPromptWithStyle(storyboard, joinStoryboardPromptParts(parts));
}

function storyboardVideoPrompt(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  references: CanvasStoryboardReference[] = [],
) {
  const basePrompt =
    shot.video_prompt.trim() || storyboardShotFallbackPrompt(shot);
  const parts = [
    storyboardNarrativeExecutionContext(storyboard, shot),
    `入镜状态：${shot.continuity_state.entry.trim()}`,
    `出镜状态：${shot.continuity_state.exit.trim()}`,
    "视频必须从入镜状态开始，只完成本镜头的主要动作，并准确停在出镜状态",
    basePrompt,
    storyboardReferenceInstructions(references),
    shot.continue_previous
      ? `使用上一镜头真实尾帧继续生成。连续性锚点：${shot.continuity_anchor}。保持人物、服装、道具、场景光线和动作方向一致，但不要重复上一镜头内容`
      : "这是新的镜头段落，以当前镜头参考图为画面锚点建立画面",
    storyboardVisibleFaceConstraint(shot),
    `画幅：${storyboard.aspect_ratio}`,
    "不生成可辨识对白、旁白、字幕或背景音乐，只保留环境声、动作声和不可辨识的人物声音",
    `时长 ${shot.duration} 秒`,
  ].filter(Boolean);
  return storyboardPromptWithStyle(storyboard, joinStoryboardPromptParts(parts));
}

function storyboardNarrativeExecutionContext(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
) {
  const index = storyboard.shots.findIndex((item) => item.id === shot.id);
  const stage =
    index <= 0
      ? storyboard.storyline.setup
      : index >= storyboard.shots.length - 1
        ? storyboard.storyline.payoff
        : storyboard.storyline.development;
  const nextTransition = storyboard.shots[index + 1]?.transition.trim();
  return [
    `故事目标：${storyboard.summary.trim()}`,
    `当前叙事阶段：${stage.trim()}`,
    `本镜变化：${shot.beat.trim()}`,
    shot.transition.trim() ? `从上一镜进入本镜：${shot.transition.trim()}` : "",
    storyboardShotIncomingTransition(shot, index),
    nextTransition ? `本镜结束需为下一镜建立：${nextTransition}` : "",
  ]
    .filter(Boolean)
    .join("；");
}

function storyboardShotIncomingTransition(
  shot: StoryboardShot,
  index: number,
) {
  if (index <= 0) {
    return "";
  }
  const label = STORYBOARD_TRANSITION_LABELS[shot.transition_type];
  if (shot.transition_type === "none") {
    return `进入本镜的剪辑方式：${label}`;
  }
  return `进入本镜的剪辑方式：${label}，时长 ${shot.transition_duration_ms} 毫秒；这是后期剪辑信息，画面本身不要生成转场叠影`;
}

function storyboardMaterialReferences(
  storyboard: StoryboardDocument,
  material: StoryboardMaterial,
) {
  return uniqueStoryboardReferences([
    ...storyboard.references.filter(
      (reference) =>
        reference.kind === "image" &&
        material.reference_keys.includes(reference.key),
    ),
    ...storyboard.references.filter(
      (reference) =>
        reference.kind === "image" && reference.purpose === "visual_style",
    ),
  ]);
}

function storyboardShotImageReferences(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
) {
  return uniqueStoryboardReferences([
    ...storyboard.references.filter(
      (reference) =>
        reference.kind === "image" && shot.reference_keys.includes(reference.key),
    ),
    ...storyboard.references.filter(
      (reference) =>
        reference.kind === "image" && reference.purpose === "visual_style",
    ),
  ]);
}

function storyboardShotVideoReferences(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
) {
  return uniqueStoryboardReferences([
    ...storyboard.references.filter(
      (reference) =>
        reference.kind === "video" && shot.reference_keys.includes(reference.key),
    ),
    ...storyboard.references.filter(
      (reference) =>
        reference.kind === "video" &&
        (reference.purpose === "motion_style" ||
          reference.purpose === "visual_style"),
    ),
  ]);
}

function storyboardReferenceInstructions(
  references: CanvasStoryboardReference[],
) {
  const descriptions = references.map(storyboardReferenceDescription);
  return descriptions.length > 0
    ? `参考素材：${descriptions.join("；")}。`
    : "";
}

const STORYBOARD_REFERENCE_USE_RULES: Record<
  CanvasStoryboardReference["purpose"],
  string
> = {
  visual_style: "只参考画风、色彩、光线和材质，不复制其中的人物或剧情",
  motion_style: "只参考运镜、动作和剪辑节奏，不沿用原视频主体、剧情或声音",
  character: "作为指定角色的外观与身份锚点",
  scene: "作为指定场景的空间、陈设与光线锚点",
  prop: "作为指定道具的造型、材质与比例锚点",
  shot: "作为指定镜头的主体、构图与空间关系锚点",
};

function storyboardReferenceDescription(
  reference: CanvasStoryboardReference,
) {
  return `${reference.label}（${[
    STORYBOARD_REFERENCE_USE_RULES[reference.purpose],
    reference.instruction,
  ]
    .filter(Boolean)
    .join("；")}）`;
}

function uniqueStoryboardReferences(
  references: CanvasStoryboardReference[],
) {
  const result: CanvasStoryboardReference[] = [];
  const used = new Set<number>();
  for (const reference of references) {
    if (used.has(reference.asset_id)) {
      continue;
    }
    used.add(reference.asset_id);
    result.push(reference);
  }
  return result;
}

function joinStoryboardPromptParts(parts: string[]) {
  return parts
    .map((part) => part.trim().replace(/[。！？!?；;，,：:]+$/g, ""))
    .filter(Boolean)
    .join("。");
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
) {
  if (!storyboardHasVisibleDialogue(shot)) {
    return "";
  }
  const speakerID = [...storyboardVisibleSpeakerIds(shot)][0];
  if (!speakerID) {
    return "";
  }
  return "出镜说话角色是画面中唯一清晰可识别的正脸，其他人物使用背面、侧后方、远景或遮挡构图";
}
