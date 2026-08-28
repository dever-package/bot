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
import { storyboardRequiredDurationValues } from "./space-storyboard-duration";
import { storyboardShotLyricsPrompt } from "./space-storyboard-lyrics";
import type {
  CanvasReferenceContent,
  CanvasStoryboardItemType,
  CanvasStoryboardReference,
} from "./types";
import {
  STORYBOARD_SHOT_IMAGE_MODE_LABELS,
  storyboardFrameReferencePlan,
  storyboardShotImagePlan,
  storyboardShotImageSequencePlans,
  usesStoryboardFramePlan,
  type StoryboardFrameMediaItem,
  type StoryboardFrameRole,
  type StoryboardImageSequenceFrame,
  type StoryboardShotImagePlan,
  type StoryboardShotImageMode,
} from "./space-storyboard-frame-plan";

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
  shotImageMode?: StoryboardShotImageMode;
  frameRole?: StoryboardFrameRole;
  frameMediaItems?: StoryboardFrameMediaItem[];
  imageSequenceFrames?: StoryboardImageSequenceFrame[];
  speechId?: string;
  speechIds?: string[];
  characterId?: string;
  speechKind?: "dialogue" | "narration";
  speakerMode?: "visible" | "offscreen";
  startTime?: number;
  shotDuration?: number;
  requiredDurationValues?: number[];
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
  items: (
    storyboard: StoryboardDocument,
    context?: StoryboardDerivedGroupContext,
  ) => StoryboardDerivedItem[];
};

export type StoryboardDerivedGroupContext = {
  framePlanVersion?: number;
};

const MATERIAL_GROUP_KEYS: StoryboardDerivedGroupKey[] = [
  "characters",
  "scenes",
  "props",
];

const MATERIAL_REFERENCE_RULES: Record<StoryboardMaterialType, string> = {
  character:
    "生成一张纯角色设定图，在同一张图内依次展示当前角色的正面全身、侧面全身、背面全身，以及面部和服装关键细节；各视角互不遮挡，必须保持同一人物的五官、发型、服装、体型和比例一致，采用清晰规范的角色设定图排版，不得拆分生成多张独立图片，不得出现其他人物、文字、水印或界面元素",
  scene:
    "生成一张纯场景参考图，采用能够完整说明空间关系的广角主视图，清晰展示固定空间的环境、结构、光线和关键区域；只生成一个完整画面，不得使用拼图、宫格或分栏排版，不得出现任何人物、角色、动物、文字、水印或界面元素",
  prop: "生成一张纯道具参考图，采用四分之三主视角，清晰展示当前道具的造型、比例、材质和关键细节；只生成一个完整画面，不得使用拼图、宫格、分栏或多视角排版，不得出现人物、手持者、文字、水印或界面元素",
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
    items: storyboardShotImageItems,
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
    items: storyboardShotVideoItems,
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

function storyboardShotVideoItems(
  storyboard: StoryboardDocument,
  context?: StoryboardDerivedGroupContext,
) {
  const requiredDurationValues = storyboardRequiredDurationValues(storyboard);
  const imagePlans = usesStoryboardFramePlan(context?.framePlanVersion)
    ? storyboardShotImageSequencePlans(storyboard.shots)
    : [];
  return storyboard.shots.map((shot, index) => {
    const imagePlan = usesStoryboardFramePlan(context?.framePlanVersion)
      ? imagePlans[index]
      : undefined;
    const sources = storyboardShotVideoSources(
      storyboard,
      shot,
      index,
      context?.framePlanVersion,
      imagePlan,
    );
    return {
      type: "shot" as const,
      id: shot.id,
      title: `镜头 ${shot.order || index + 1}`,
      prompt: storyboardVideoPrompt(
        storyboard,
        shot,
        sources.externalReferences,
        context?.framePlanVersion,
        imagePlan,
      ),
      ...sources,
      paramValues: storyboardVideoParamValues(
        storyboard,
        shot,
        context?.framePlanVersion,
        imagePlan,
      ),
      shotId: shot.id,
      shotDuration: shot.duration,
      requiredDurationValues,
      continuityAnchor: shot.continuity_anchor,
    };
  });
}

function storyboardShotImageItems(
  storyboard: StoryboardDocument,
  context?: StoryboardDerivedGroupContext,
) {
  return usesStoryboardFramePlan(context?.framePlanVersion)
    ? storyboardPlannedShotImageItems(storyboard)
    : storyboardLegacyShotImageItems(storyboard);
}

function storyboardLegacyShotImageItems(storyboard: StoryboardDocument) {
  return storyboard.shots.flatMap((shot, index) => {
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
  });
}

function storyboardPlannedShotImageItems(storyboard: StoryboardDocument) {
  const imagePlans = storyboardShotImageSequencePlans(storyboard.shots);
  return storyboard.shots.flatMap((shot, index) => {
    const imagePlan = imagePlans[index];
    if (imagePlan.nodeMode === "none") {
      return [];
    }
    const frameRole = imagePlan.nodeMode === "last_frame" ? "end" : "start";
    const sources = storyboardPlannedShotFrameSources(
      storyboard,
      shot,
      index,
      frameRole,
    );
    const promptPlan = storyboardShotImageModePromptPlan(
      storyboard,
      shot,
      imagePlan.nodeMode,
      sources,
    );
    return [
      {
        type: "shot_image" as const,
        id: shot.id,
        title: storyboardShotImageTitle(
          shot.order || index + 1,
          imagePlan.nodeMode,
        ),
        prompt: promptPlan.prompt,
        dependencyItems: sources.dependencyItems,
        referenceItems: sources.referenceItems,
        externalReferences: sources.externalReferences,
        paramValues: storyboardShotImageParamValues(storyboard),
        shotId: shot.id,
        shotImageMode: imagePlan.nodeMode,
        frameMediaItems: imagePlan.frameMediaItems,
        imageSequenceFrames: promptPlan.frames,
      },
    ];
  });
}

function storyboardShotImageTitle(
  order: number,
  mode: Exclude<StoryboardShotImageMode, "none">,
) {
  return `镜头 ${order} ${STORYBOARD_SHOT_IMAGE_MODE_LABELS[mode]}`;
}

function storyboardShotImageModePromptPlan(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  mode: Exclude<StoryboardShotImageMode, "none">,
  sources: ReturnType<typeof storyboardPlannedShotFrameSources>,
): { prompt: string; frames?: StoryboardImageSequenceFrame[] } {
  switch (mode) {
    case "first_last": {
      const frames = storyboardShotFramePairFrames(storyboard, shot, sources);
      return {
        prompt: storyboardShotFramePairPrompt(frames),
        frames,
      };
    }
    case "references":
      return {
        prompt: storyboardShotReferenceImagesPrompt(storyboard, shot, sources),
      };
    case "last_frame":
      return {
        prompt: storyboardShotFramePrompt(
          storyboard,
          shot,
          "end",
          sources.anchorLabel,
          sources.referenceMaterials,
          sources.externalReferences,
        ),
      };
    default:
      return {
        prompt: storyboardShotFramePrompt(
          storyboard,
          shot,
          "start",
          sources.anchorLabel,
          sources.referenceMaterials,
          sources.externalReferences,
        ),
      };
  }
}

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
  const referenceContext = storyboardReferenceContext(references);
  const prompt = material.prompt.trim();
  if (prompt) {
    return storyboardPromptWithStyle(
      storyboard,
      `${referenceContext}${prompt}。${MATERIAL_REFERENCE_RULES[material.type]}`,
      material.type,
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
    `${referenceContext}${STORYBOARD_MATERIAL_LABELS[material.type]}“${material.name}”的素材生成图。${context}。${MATERIAL_REFERENCE_RULES[material.type]}`,
    material.type,
  );
}

function storyboardShotMaterialSourceItems(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
) {
  return storyboardMaterialSourceItems(storyboardShotMaterials(storyboard, shot));
}

function storyboardMaterialSourceItems(materials: StoryboardMaterial[]) {
  return materials.map((material) => ({
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

function storyboardPlannedShotFrameSources(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  index: number,
  frameRole: StoryboardFrameRole,
) {
  const referencePlan = storyboardFrameReferencePlan(
    storyboard.shots,
    index,
    frameRole,
  );
  const referenceMaterialIDs = new Set(referencePlan.materialIDs);
  const referenceMaterials = storyboardShotMaterials(storyboard, shot).filter(
    (material) => referenceMaterialIDs.has(material.id),
  );
  const materialItems = storyboardMaterialSourceItems(referenceMaterials);
  const externalReferences = storyboardPlannedShotImageReferences(
    storyboard,
    referencePlan.referenceKeys,
    referencePlan.includeGlobalReferences,
    referenceMaterials,
  );
  const anchorID = referencePlan.anchorID;
  const anchorItem = anchorID
    ? { type: "shot_image" as const, id: anchorID }
    : undefined;
  return {
    anchorLabel: storyboardFrameAnchorLabel(
      storyboard,
      shot,
      index,
      frameRole,
      referencePlan,
    ),
    dependencyItems: anchorItem ? [anchorItem] : [],
    referenceItems: [...(anchorItem ? [anchorItem] : []), ...materialItems],
    referenceMaterials,
    externalReferences,
  };
}

function storyboardPlannedShotImageReferences(
  storyboard: StoryboardDocument,
  referenceKeys: string[],
  includeGlobalReferences: boolean,
  referenceMaterials: StoryboardMaterial[],
) {
  const absorbedReferenceKeys = new Set(
    referenceMaterials.flatMap((material) => material.reference_keys),
  );
  if (referenceMaterials.length) {
    for (const reference of storyboardGlobalReferences(storyboard, "image")) {
      absorbedReferenceKeys.add(reference.key);
    }
  }
  const referenceKeySet = new Set(referenceKeys);
  return uniqueStoryboardReferences(
    storyboard.references.filter(
      (reference) =>
        reference.kind === "image" &&
        !absorbedReferenceKeys.has(reference.key) &&
        (STORYBOARD_GLOBAL_REFERENCE_PURPOSES.image.has(reference.purpose)
          ? includeGlobalReferences
          : referenceKeySet.has(reference.key)),
    ),
  );
}

function storyboardFrameAnchorLabel(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  index: number,
  frameRole: StoryboardFrameRole,
  referencePlan: ReturnType<typeof storyboardFrameReferencePlan>,
) {
  const { anchorID, anchorFrameRole, anchorShotIndex } = referencePlan;
  if (!anchorID) {
    return "";
  }
  if (anchorID === shot.id) {
    return "本镜头首帧";
  }
  const anchorShot = storyboard.shots[anchorShotIndex];
  if (!anchorShot) {
    return "";
  }
  const relation = anchorShotIndex === index - 1 ? "上一镜头" : "镜头";
  const frameLabel =
    anchorFrameRole === "end" ? "尾帧" : "连续性参考帧";
  return frameRole === "start"
    ? `${relation} ${anchorShot.order || anchorShotIndex + 1} 的${frameLabel}`
    : `${relation} ${anchorShot.order || anchorShotIndex + 1} 的${frameLabel}规划图`;
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
  framePlanVersion?: number,
  imagePlan?: StoryboardShotImagePlan,
) {
  if (usesStoryboardFramePlan(framePlanVersion)) {
    return storyboardPlannedShotVideoSources(
      storyboard,
      shot,
      index,
      imagePlan || storyboardShotImagePlan(shot),
    );
  }
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

function storyboardPlannedShotVideoSources(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  index: number,
  imagePlan: StoryboardShotImagePlan,
) {
  const externalReferences = storyboardShotVideoReferences(storyboard, shot);
  const imageItem = {
    type: "shot_image" as const,
    id: shot.id,
  };
  const currentImageItems =
    imagePlan.nodeMode === "none" ? [] : [imageItem];
  const previousShot = index > 0 ? storyboard.shots[index - 1] : undefined;
  if (shot.continue_previous && previousShot) {
    const previousItem = { type: "shot" as const, id: previousShot.id };
    return {
      dependencyItems: [previousItem],
      referenceItems: [previousItem, ...currentImageItems],
      externalReferences,
    };
  }
  return {
    dependencyItems: [],
    referenceItems: currentImageItems,
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
  const parts = [
    `镜头 ${shot.order} 的单张参考画面`,
    ...storyboardShotReferencePurposeParts(
      externalReferences,
      previousShot ? `前序镜头 ${previousShot.order} 的参考画面` : "",
      shotMaterials,
    ),
    previousShot
      ? "当前镜头明确要求匹配上一镜画面；前序镜头只用于保持共同主体状态、光线与空间关系，当前素材清单中不存在的对象不得继续保留"
      : "",
    storyboardNarrativeExecutionContext(storyboard, shot),
    `入镜关键帧状态：${shot.continuity_state.entry.trim()}`,
    "当前图片只表现镜头开始时的入镜状态，不提前表现本镜头动作完成后的出镜状态",
    ...storyboardShotVisualConsistencyParts(shotMaterials),
    shot.description.trim(),
    shot.camera_instruction.trim()
      ? `镜头语言：${shot.camera_instruction.trim()}`
      : "",
    storyboardVisibleFaceConstraint(shot),
    `画幅：${storyboard.aspect_ratio}`,
    "画面中不要出现字幕、对白文字、水印或界面元素",
  ].filter(Boolean);
  return storyboardPromptWithStyle(
    storyboard,
    joinStoryboardPromptParts(parts),
  );
}

function storyboardShotFramePrompt(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  frameRole: StoryboardFrameRole,
  anchorLabel: string,
  referenceMaterials: StoryboardMaterial[],
  externalReferences: CanvasStoryboardReference[] = [],
) {
  const shotMaterials = storyboardShotMaterials(storyboard, shot);
  const isEndFrame = frameRole === "end";
  const parts = [
    `镜头 ${shot.order} 的单张${isEndFrame ? "尾帧" : "首帧"}画面`,
    ...storyboardShotReferencePurposeParts(
      externalReferences,
      anchorLabel,
      referenceMaterials,
    ),
    storyboardFrameAnchorInstruction(shot, frameRole, anchorLabel),
    anchorLabel ? storyboardShotMaterialInventory(shotMaterials) : "",
    storyboardFrameNarrativeContext(storyboard, shot),
    `镜头画面内容：${shot.description.trim()}`,
    ...storyboardFrameStateParts(shot, frameRole),
    ...storyboardShotVisualConsistencyParts(shotMaterials),
    storyboardFrameCameraInstruction(shot, frameRole),
    storyboardVisibleFaceConstraint(shot),
    `画幅：${storyboard.aspect_ratio}`,
    "画面中不要出现字幕、对白文字、水印或界面元素",
  ].filter(Boolean);
  return storyboardPromptWithStyle(
    storyboard,
    joinStoryboardPromptParts(parts),
  );
}

function storyboardShotReferenceImagesPrompt(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  sources: ReturnType<typeof storyboardPlannedShotFrameSources>,
) {
  const shotMaterials = storyboardShotMaterials(storyboard, shot);
  const parts = [
    `镜头 ${shot.order} 的参考图组`,
    ...storyboardShotReferencePurposeParts(
      sources.externalReferences,
      sources.anchorLabel,
      sources.referenceMaterials,
    ),
    sources.anchorLabel
      ? storyboardFrameAnchorInstruction(shot, "start", sources.anchorLabel)
      : "",
    sources.anchorLabel ? storyboardShotMaterialInventory(shotMaterials) : "",
    storyboardFrameNarrativeContext(storyboard, shot),
    `镜头画面内容：${shot.description.trim()}`,
    `镜头起始状态：${shot.continuity_state.entry.trim()}`,
    `镜头主要变化：${shot.beat.trim()}`,
    `镜头结束状态：${shot.continuity_state.exit.trim()}`,
    "根据维持本镜头人物、场景、道具、动作关系和构图所需的信息，生成 1 至 4 张相互补充的独立参考图片",
    "这些图片是并列的视觉参考，不是首尾帧或连续时间关键帧，不得暗示固定播放顺序",
    "每张图片只承担一种清晰参考目的，不得生成拼图、宫格、分栏、候选图、编号文字或标题",
    "整组必须保持人物身份、服装、关键道具、场景结构、光线、色彩和画风完全一致",
    ...storyboardShotVisualConsistencyParts(shotMaterials),
    shot.camera_instruction.trim()
      ? `镜头语言参考：${shot.camera_instruction.trim()}`
      : "",
    storyboardVisibleFaceConstraint(shot),
    `画幅：${storyboard.aspect_ratio}`,
    "画面中不要出现字幕、对白文字、水印或界面元素",
  ].filter(Boolean);
  return storyboardPromptWithStyle(
    storyboard,
    joinStoryboardPromptParts(parts),
  );
}

function storyboardShotReferencePurposeParts(
  externalReferences: CanvasStoryboardReference[],
  anchorLabel: string,
  referenceMaterials: StoryboardMaterial[],
) {
  const referenceLabels = [
    ...externalReferences.map(storyboardReferenceDescription),
    ...(anchorLabel ? [anchorLabel] : []),
    ...referenceMaterials.map(
      (material) =>
        `${STORYBOARD_MATERIAL_LABELS[material.type]}“${material.name}”`,
    ),
  ];
  return referenceLabels.length
    ? [
        `参考素材用途：${referenceLabels.join("、")}`,
        "必须分别识别并保留以上参考对象；具体图片编号以运行时追加的参考素材索引为准",
      ]
    : [];
}

function storyboardShotFramePairFrames(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  sources: ReturnType<typeof storyboardPlannedShotFrameSources>,
): StoryboardImageSequenceFrame[] {
  const startPrompt = storyboardShotFramePrompt(
    storyboard,
    shot,
    "start",
    sources.anchorLabel,
    sources.referenceMaterials,
    sources.externalReferences,
  );
  const endPrompt = storyboardShotFramePrompt(
    storyboard,
    shot,
    "end",
    "",
    [],
  );
  return [
    {
      title: "首帧",
      description: shot.continuity_state.entry.trim(),
      prompt: startPrompt,
    },
    {
      title: "尾帧",
      description: shot.continuity_state.exit.trim(),
      prompt: endPrompt,
    },
  ];
}

function storyboardShotFramePairPrompt(
  frames: StoryboardImageSequenceFrame[],
) {
  return [
    "必须生成且只能生成 2 张按顺序排列的独立图片；不得合并为拼图、宫格或候选图，输出顺序不得交换",
    `第 1 张（首帧）：\n${frames[0]?.prompt || ""}`,
    "生成第 2 张时，必须把刚生成的第 1 张首帧作为一致性参考，只推进本镜头动作，不得复制首帧",
    `第 2 张（尾帧）：\n${frames[1]?.prompt || ""}`,
  ].join("\n\n");
}

function storyboardShotMaterialInventory(materials: StoryboardMaterial[]) {
  const labels = materials.map(
    (material) =>
      `${STORYBOARD_MATERIAL_LABELS[material.type]}“${material.name}”`,
  );
  return labels.length
    ? `当前镜头对象清单：${labels.join("、")}；锚点中未列出的对象不得继续保留`
    : "当前镜头对象清单为空；锚点中的人物、角色、动物和道具不得继续保留";
}

function storyboardFrameNarrativeContext(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
) {
  const stage = storyboardNarrativeStage(storyboard, shot);
  return [
    `故事目标：${storyboard.summary.trim()}`,
    storyboardShotLyricsPrompt(storyboard, shot),
    stage.trim() ? `当前叙事阶段：${stage.trim()}` : "",
  ]
    .filter(Boolean)
    .join("；");
}

function storyboardFrameStateParts(
  shot: StoryboardShot,
  frameRole: StoryboardFrameRole,
) {
  const entryState = shot.continuity_state.entry.trim();
  const exitState = shot.continuity_state.exit.trim();
  const beat = shot.beat.trim();
  if (frameRole === "start") {
    return [
      `目标首帧状态：${entryState}`,
      beat ? `本镜动作将在首帧之后发生：${beat}` : "",
      `不得提前表现尾帧状态：${exitState}`,
      "当前图片必须停在动作尚未开始的时刻，只表现起点状态",
    ].filter(Boolean);
  }
  return [
    `起点状态：${entryState}`,
    beat ? `必须完成的可见变化：${beat}` : "",
    `目标尾帧状态：${exitState}`,
    "必须与第 1 张首帧存在可辨识的画面变化，至少让主体位置、姿态、动作、道具状态或镜头构图中的一项明确不同；第 1 张首帧只用于保持身份、画风和空间连续，不得直接复制",
  ].filter(Boolean);
}

function storyboardFrameCameraInstruction(
  shot: StoryboardShot,
  frameRole: StoryboardFrameRole,
) {
  const instruction = shot.camera_instruction.trim();
  if (!instruction) {
    return "";
  }
  return frameRole === "end"
    ? `尾帧构图：${instruction}；采用动作和运镜完成后的画面位置`
    : `首帧构图：${instruction}；采用动作和运镜开始前的画面位置`;
}

function storyboardFrameAnchorInstruction(
  shot: StoryboardShot,
  frameRole: StoryboardFrameRole,
  anchorLabel: string,
) {
  if (!anchorLabel) {
    return "";
  }
  if (frameRole === "start") {
    return "当前镜头要求匹配连续性参考帧；保持共同主体状态、光线、构图方向与空间关系，当前素材清单中不存在的对象不得继续保留";
  }
  return shot.continue_previous
    ? "以上一镜连续性参考帧为动作起点，推进本镜变化后形成当前尾帧；不得重复上一镜内容，除本镜明确动作造成的道具增减或状态变化外，不得改变人物、服装、场景光线和动作方向"
    : "以本镜头首帧为动作起点，只推进本镜变化并形成明确尾帧；保持人物身份、服装、道具、场景结构、光线和轴线一致";
}

function storyboardShotVisualConsistencyParts(
  shotMaterials: StoryboardMaterial[],
) {
  const hasCharacterMaterial = shotMaterials.some(
    (material) => material.type === "character",
  );
  return [
    hasCharacterMaterial
      ? "严格保持参考角色的五官、发型、服装、配色和体型，保持场景结构、道具造型以及整部作品画风一致"
      : "当前镜头没有角色素材，不得生成清晰可识别的人物、歌手、演员、乐手、路人或人脸；故事目标、叙事阶段和外部参考中出现的人物也不得擅自带入画面。保持场景结构、道具造型以及整部作品画风一致",
    "不同参考对象必须保持各自独立的轮廓、材质和尺度，不得把角色与道具融合、机械化、穿戴化或互换材质",
    hasCharacterMaterial
      ? "角色必须保留参考图中的发饰数量与位置以及完整服装，道具必须保持参考图中的原始尺寸比例"
      : "道具必须保持参考图中的原始尺寸比例",
  ];
}

function storyboardVideoPrompt(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  references: CanvasStoryboardReference[] = [],
  framePlanVersion?: number,
  imagePlan?: StoryboardShotImagePlan,
) {
  if (usesStoryboardFramePlan(framePlanVersion)) {
    return storyboardPlannedVideoPrompt(
      storyboard,
      shot,
      references,
      imagePlan || storyboardShotImagePlan(shot),
    );
  }
  const basePrompt =
    shot.video_prompt.trim() || storyboardShotFallbackPrompt(shot);
  const parts = [
    `补充视觉要求：${basePrompt}`,
    storyboardShotLyricsPrompt(storyboard, shot),
    storyboardReferenceContext(references),
    shot.continue_previous
      ? `使用上一镜头真实尾帧继续生成。连续性锚点：${shot.continuity_anchor}。保持人物、服装、道具、场景光线和动作方向一致，但不要重复上一镜头内容`
      : "这是新的镜头段落，以当前镜头参考图为画面锚点建立画面",
    storyboardVisibleFaceConstraint(shot),
    `画幅：${storyboard.aspect_ratio}`,
    "不生成可辨识对白、旁白、字幕或背景音乐，只保留环境声、动作声和不可辨识的人物声音",
    `时长 ${shot.duration} 秒`,
  ].filter(Boolean);
  return storyboardPromptWithStyle(
    storyboard,
    joinStoryboardPromptParts(parts),
  );
}

function storyboardPlannedVideoPrompt(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  references: CanvasStoryboardReference[],
  imagePlan: StoryboardShotImagePlan,
) {
  const basePrompt =
    shot.video_prompt.trim() || storyboardShotFallbackPrompt(shot);
  const parts = [
    "约束优先级：真实输入帧与参考素材 > 起始和结束状态 > 动作推进与运镜 > 补充视觉要求；低优先级内容冲突时忽略低优先级内容",
    `补充视觉要求：${basePrompt}`,
    storyboardShotLyricsPrompt(storyboard, shot),
    storyboardReferenceContext(references),
    `起始状态：${shot.continuity_state.entry.trim()}`,
    `动作推进：${shot.beat.trim()}`,
    `结束状态：${shot.continuity_state.exit.trim()}`,
    shot.camera_instruction.trim()
      ? `运镜：${shot.camera_instruction.trim()}`
      : "运镜：固定机位，保持构图和轴线稳定",
    storyboardVideoImageInstruction(shot, imagePlan),
    storyboardVisibleFaceConstraint(shot),
    `画幅：${storyboard.aspect_ratio}`,
    "不生成可辨识对白、旁白、字幕或背景音乐，只保留环境声、动作声和不可辨识的人物声音",
    `时长 ${shot.duration} 秒`,
  ].filter(Boolean);
  return storyboardPromptWithStyle(
    storyboard,
    joinStoryboardPromptParts(parts),
  );
}

function storyboardVideoImageInstruction(
  shot: StoryboardShot,
  imagePlan: StoryboardShotImagePlan,
) {
  const consistencyRule =
    "不改变人物身份、服装、道具、场景、光线或动作方向";
  if (shot.continue_previous) {
    const continuation = `严格使用从上一镜头真实视频提取的尾帧作为首帧。连续性锚点：${shot.continuity_anchor}。动作从真实尾帧自然继续，不重复上一镜内容`;
    switch (imagePlan.nodeMode) {
      case "last_frame":
        return `${continuation}；使用当前镜头单张尾帧作为尾帧，只补全两帧之间的连续动作，${consistencyRule}`;
      default:
        return `${continuation}，${consistencyRule}`;
    }
  }
  switch (imagePlan.nodeMode) {
    case "first_last":
      return `严格使用当前镜头首尾帧节点的第 1 张作为首帧、第 2 张作为尾帧，只补全两帧之间的连续动作，${consistencyRule}`;
    case "references":
      return `当前镜头参考图组只作为并列视觉参考，不代表首帧、尾帧或时间顺序关键帧；根据文字描述生成完整动作，${consistencyRule}`;
    case "none":
      return `当前镜头采用纯文本生成，不使用镜头图片参考；严格按照起始状态、动作推进和结束状态生成，${consistencyRule}`;
    default:
      return `严格使用当前镜头单张首帧作为首帧，从该状态自然完成本镜动作，${consistencyRule}`;
  }
}

function storyboardNarrativeExecutionContext(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
) {
  const index = storyboard.shots.findIndex((item) => item.id === shot.id);
  const narrativeStage = storyboardNarrativeStage(storyboard, shot).trim();
  const nextTransition = storyboard.shots[index + 1]?.transition.trim();
  return [
    `故事目标：${storyboard.summary.trim()}`,
    storyboardShotLyricsPrompt(storyboard, shot),
    narrativeStage ? `当前叙事阶段：${narrativeStage}` : "",
    `本镜变化：${shot.beat.trim()}`,
    shot.transition.trim() ? `从上一镜进入本镜：${shot.transition.trim()}` : "",
    storyboardShotIncomingTransition(shot, index),
    nextTransition ? `本镜结束需为下一镜建立：${nextTransition}` : "",
  ]
    .filter(Boolean)
    .join("；");
}

function storyboardNarrativeStage(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
) {
  const index = storyboard.shots.findIndex((item) => item.id === shot.id);
  if (index <= 0) {
    return storyboard.storyline.setup;
  }
  return index >= storyboard.shots.length - 1
    ? storyboard.storyline.payoff
    : storyboard.storyline.development;
}

function storyboardShotIncomingTransition(shot: StoryboardShot, index: number) {
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
    ...storyboardGlobalReferences(storyboard, "image"),
  ]);
}

function storyboardShotImageReferences(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
) {
  return uniqueStoryboardReferences([
    ...storyboard.references.filter(
      (reference) =>
        reference.kind === "image" &&
        shot.reference_keys.includes(reference.key),
    ),
    ...storyboardGlobalReferences(storyboard, "image"),
  ]);
}

function storyboardShotVideoReferences(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
) {
  return uniqueStoryboardReferences([
    ...storyboard.references.filter(
      (reference) =>
        reference.kind === "video" &&
        shot.reference_keys.includes(reference.key),
    ),
    ...storyboardGlobalReferences(storyboard, "video"),
  ]);
}

const STORYBOARD_GLOBAL_REFERENCE_PURPOSES: Record<
  "image" | "video",
  ReadonlySet<CanvasStoryboardReference["purpose"]>
> = {
  image: new Set<CanvasStoryboardReference["purpose"]>([
    "visual_style",
    "brand_style",
  ]),
  video: new Set<CanvasStoryboardReference["purpose"]>([
    "visual_style",
    "motion_style",
    "performance",
    "brand_style",
  ]),
};

function storyboardGlobalReferences(
  storyboard: StoryboardDocument,
  kind: "image" | "video",
) {
  const purposes = STORYBOARD_GLOBAL_REFERENCE_PURPOSES[kind];
  return storyboard.references.filter(
    (reference) => reference.kind === kind && purposes.has(reference.purpose),
  );
}

function storyboardReferenceContext(references: CanvasStoryboardReference[]) {
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
  soundtrack: "作为全片主音轨的音乐气质和节奏依据",
  performance: "只参考动作、舞蹈、演奏或表演方式，不沿用原视频主体身份",
  product: "作为广告商品主体的外观、材质、比例与关键细节锚点",
  brand_style: "只参考品牌色彩、陈列、光线和影调，不复制其中的文字或主体",
  brand_logo: "只作为品牌身份和构图规划参考，不要求模型还原可辨识文字",
};

function storyboardReferenceDescription(reference: CanvasStoryboardReference) {
  const purposeRule = STORYBOARD_REFERENCE_USE_RULES[reference.purpose];
  return purposeRule ? `${reference.label}（${purposeRule}）` : reference.label;
}

function uniqueStoryboardReferences(references: CanvasStoryboardReference[]) {
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
  framePlanVersion?: number,
  imagePlan?: StoryboardShotImagePlan,
) {
  const plan = imagePlan || storyboardShotImagePlan(shot);
  return {
    aspectRatio: storyboard.aspect_ratio,
    duration: shot.duration,
    ...(usesStoryboardFramePlan(framePlanVersion) && plan.referenceMode
      ? { referenceMode: plan.referenceMode }
      : {}),
  };
}

function storyboardVisibleFaceConstraint(shot: StoryboardShot) {
  if (!storyboardHasVisibleDialogue(shot)) {
    return "";
  }
  const speakerID = [...storyboardVisibleSpeakerIds(shot)][0];
  if (!speakerID) {
    return "";
  }
  return "出镜说话角色是画面中唯一清晰可识别的正脸，其他人物使用背面、侧后方、远景或遮挡构图";
}
