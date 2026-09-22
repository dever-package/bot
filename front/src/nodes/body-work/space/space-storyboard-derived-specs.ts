import type { StoryboardGroupDirection } from "./space-storyboard-derived-layout";
import {
  isStoryboardVisibleDialogue,
  storyboardProductionIncludesLipSync,
  storyboardProductionIncludesReferenceImages,
  storyboardProductionIncludesShotVideos,
  storyboardProductionIncludesSubtitles,
  storyboardProductionIncludesVoice,
  storyboardShotSubtitleTracks,
  storyboardShotMaterials,
  type StoryboardDocument,
  type StoryboardMaterial,
  type StoryboardMaterialType,
  type StoryboardShot,
  type StoryboardSpeech,
} from "./space-storyboard";
import { storyboardRequiredDurationValues } from "./space-storyboard-duration";
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
      shotImageMode: imagePlan?.mode,
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
            prompt: storyboardMaterialPrompt(material),
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

function storyboardMaterialPrompt(material: StoryboardMaterial) {
  return material.prompt.trim() || `${material.name}素材`;
}

function storyboardShotMaterialSourceItems(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
) {
  return storyboardMaterialSourceItems(
    storyboardShotMaterials(storyboard, shot),
  );
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
  const frameLabel = anchorFrameRole === "end" ? "尾帧" : "连续性参考帧";
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
  const currentImageItems = imagePlan.nodeMode === "none" ? [] : [imageItem];
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
  _storyboard: StoryboardDocument,
  shot: StoryboardShot,
  _previousShot?: StoryboardShot,
  _externalReferences: CanvasStoryboardReference[] = [],
) {
  return storyboardEditableFramePrompt(shot, "start");
}

function storyboardShotFramePrompt(
  _storyboard: StoryboardDocument,
  shot: StoryboardShot,
  frameRole: StoryboardFrameRole,
  _anchorLabel: string,
  _referenceMaterials: StoryboardMaterial[],
  _externalReferences: CanvasStoryboardReference[] = [],
) {
  return storyboardEditableFramePrompt(shot, frameRole);
}

function storyboardShotReferenceImagesPrompt(
  _storyboard: StoryboardDocument,
  shot: StoryboardShot,
  _sources: ReturnType<typeof storyboardPlannedShotFrameSources>,
) {
  return storyboardEditablePromptParts([
    `镜头画面：${shot.description.trim()}`,
    shot.spatial_layout.trim() ? `空间关系：${shot.spatial_layout.trim()}` : "",
    `起始状态：${shot.continuity_state.entry.trim()}`,
    shot.start_framing?.trim() ? `静态构图：${shot.start_framing.trim()}` : "",
  ]);
}

function storyboardShotFramePairFrames(
  _storyboard: StoryboardDocument,
  shot: StoryboardShot,
  _sources: ReturnType<typeof storyboardPlannedShotFrameSources>,
): StoryboardImageSequenceFrame[] {
  const startPrompt = storyboardEditableFramePrompt(shot, "start");
  const endPrompt = storyboardEditableFramePrompt(shot, "end");
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

function storyboardShotFramePairPrompt(frames: StoryboardImageSequenceFrame[]) {
  return [
    `首帧：${frames[0]?.prompt || ""}`,
    `尾帧：${frames[1]?.prompt || ""}`,
  ].join("\n\n");
}

function storyboardEditableFramePrompt(
  shot: StoryboardShot,
  frameRole: StoryboardFrameRole,
) {
  const state =
    frameRole === "end"
      ? shot.continuity_state.exit.trim()
      : shot.continuity_state.entry.trim();
  return storyboardEditablePromptParts([
    `镜头画面：${shot.description.trim()}`,
    shot.spatial_layout.trim() ? `空间关系：${shot.spatial_layout.trim()}` : "",
    `${frameRole === "end" ? "尾帧" : "首帧"}状态：${state}`,
    (frameRole === "end" ? shot.end_framing : shot.start_framing)?.trim()
      ? `静态构图：${(frameRole === "end" ? shot.end_framing : shot.start_framing)?.trim()}`
      : "",
  ]);
}

function storyboardVideoPrompt(
  _storyboard: StoryboardDocument,
  shot: StoryboardShot,
  _references: CanvasStoryboardReference[] = [],
  _framePlanVersion?: number,
  _imagePlan?: StoryboardShotImagePlan,
) {
  return storyboardEditablePromptParts([
    `画面内容：${shot.description.trim()}`,
    shot.spatial_layout.trim() ? `空间关系：${shot.spatial_layout.trim()}` : "",
    `起始状态：${shot.continuity_state.entry.trim()}`,
    shot.start_framing?.trim() ? `起始构图：${shot.start_framing.trim()}` : "",
    `动作推进：${shot.beat.trim()}`,
    `结束状态：${shot.continuity_state.exit.trim()}`,
    shot.end_framing?.trim() ? `结束构图：${shot.end_framing.trim()}` : "",
    shot.camera_instruction.trim()
      ? `运镜：${shot.camera_instruction.trim()}`
      : "",
    shot.video_prompt.trim() ? `补充视觉要求：${shot.video_prompt.trim()}` : "",
  ]);
}

function storyboardEditablePromptParts(parts: string[]) {
  return parts.filter(Boolean).join("\n");
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

function storyboardShotImageParamValues(storyboard: StoryboardDocument) {
  return { aspectRatio: storyboard.aspect_ratio };
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
