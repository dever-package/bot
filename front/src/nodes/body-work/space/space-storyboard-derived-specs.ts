import type { StoryboardGroupDirection } from "./space-storyboard-derived-layout";
import {
  storyboardProductionIncludesReferenceImages,
  storyboardProductionIncludesShotVideos,
  storyboardProductionIncludesSubtitles,
  storyboardProductionIncludesVoice,
  storyboardProductionUsesNativeAudio,
  storyboardShotSubtitleTracks,
  storyboardShotMaterials,
  storyboardNarrationSpeech,
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
  localOutput?: unknown;
  paramValues?: Record<string, unknown>;
  visualContext?: string;
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
  sharedEndShotId?: string;
  sharedStartShotId?: string;
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
  | "setting";

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
  enabled: (
    storyboard: StoryboardDocument,
    context?: StoryboardDerivedGroupContext,
  ) => boolean;
  items: (
    storyboard: StoryboardDocument,
    context?: StoryboardDerivedGroupContext,
  ) => StoryboardDerivedItem[];
};

export type StoryboardDerivedGroupContext = {
  framePlanVersion?: number;
  // 已由故事设定组提供形象的素材，分镜不再派生自己的素材节点。
  settingItemKeys?: ReadonlySet<string>;
};

export function storyboardSettingItemKey(type: string, id: string) {
  return `${type}:${id}`;
}

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
    items: storyboardPlannedShotImageItems,
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
    title: "配音组",
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
];

function storyboardShotVideoItems(
  storyboard: StoryboardDocument,
) {
  const requiredDurationValues = storyboardRequiredDurationValues(storyboard);
  const imagePlans = storyboardShotImageSequencePlans(storyboard.shots);
  return storyboard.shots.map((shot, index) => {
    const imagePlan = index === 0 && storyboard.chapter_boundary?.connection === "continue"
      ? storyboardShotImagePlan({ ...shot, continue_previous: true })
      : imagePlans[index];
    const sources = storyboardPlannedShotVideoSources(
      storyboard,
      shot,
      index,
      imagePlan,
    );
    return {
      type: "shot" as const,
      visualContext: storyboardVisualContext(storyboard, storyboardShotMaterials(storyboard, shot)),
      id: shot.id,
      title: `镜头 ${shot.order || index + 1}`,
      prompt: storyboardVideoPrompt(
        storyboard,
        shot,
        sources.externalReferences,
        imagePlan,
      ),
      ...sources,
      paramValues: storyboardVideoParamValues(
        storyboard,
        shot,
        imagePlan,
      ),
      shotId: shot.id,
      shotImageMode: imagePlan?.mode,
      sharedEndShotId:
        imagePlan?.mode === "next_first" ? shot.shared_end_shot_id : undefined,
      sharedStartShotId:
        shot.continue_previous && index > 0
          ? storyboard.shots[index - 1].id
          : undefined,
      shotDuration: shot.duration,
      requiredDurationValues,
      continuityAnchor: shot.continuity_anchor,
    };
  });
}

function storyboardPlannedShotImageItems(storyboard: StoryboardDocument) {
  const imagePlans = storyboardShotImageSequencePlans(storyboard.shots);
  return storyboard.shots.flatMap((shot, index) => {
    const imagePlan =
      index === 0 && storyboard.chapter_boundary?.connection === "continue"
        ? storyboardShotImagePlan({ ...shot, continue_previous: true })
        : imagePlans[index];
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
        visualContext: storyboardVisualContext(storyboard, storyboardShotMaterials(storyboard, shot)),
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
    enabled: (storyboard, context) =>
      storyboardProductionIncludesReferenceImages(storyboard) &&
      storyboard.materials.some(ownsMaterial(itemType, context)),
    items: (storyboard, context) =>
      storyboard.materials
        .filter(ownsMaterial(itemType, context))
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
            visualContext: storyboardVisualContext(storyboard, [material]),
            externalReferences,
          };
        }),
  };
}

function ownsMaterial(
  itemType: StoryboardMaterialType,
  context?: StoryboardDerivedGroupContext,
) {
  return (material: StoryboardMaterial) =>
    material.type === itemType &&
    !context?.settingItemKeys?.has(
      storyboardSettingItemKey(material.type, material.id),
    );
}

function storyboardSpeechItems(storyboard: StoryboardDocument) {
  const voice = storyboard.narrator_voice.trim();
  const narrationItems: StoryboardDerivedItem[] = storyboardNarrationSpeech(storyboard)
    .map(({ speech, shotId }, index) => ({
      type: "speech",
      id: speech.id,
      title: `旁白 ${index + 1}`,
      prompt: speech.text.trim(),
      ...(voice ? { paramValues: { voice } } : {}),
      shotId,
      speechId: speech.id,
      speechKind: "narration",
      startTime: speech.start_time,
    }));
  return [...narrationItems, ...storyboard.shots.flatMap((shot, shotIndex) =>
    shot.speech
      .filter((speech) => speech.kind === "dialogue" && speech.text.trim())
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
  )];
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

function storyboardVisualContext(storyboard: StoryboardDocument, materials: StoryboardMaterial[]) {
  return JSON.stringify([storyboard.visual_mode, storyboard.style_prompt.trim(),
    materials.map((material) => [material.id, material.type, material.name, material.prompt.trim()]),
  ]);
}

function storyboardMaterialPrompt(material: StoryboardMaterial) {
  return material.prompt.trim() || `${material.name}素材`;
}

function storyboardMaterialSourceItems(materials: StoryboardMaterial[]) {
  return materials.map((material) => ({
    type: material.type,
    id: material.id,
  }));
}

function storyboardPlannedShotFrameSources(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  index: number,
  frameRole: StoryboardFrameRole,
) {
  // A continued chapter has no newly generated opening frame to reference.
  const frameShots =
    index === 0 && storyboard.chapter_boundary?.connection === "continue"
      ? [{ ...shot, continue_previous: true }, ...storyboard.shots.slice(1)]
      : storyboard.shots;
  const referencePlan = storyboardFrameReferencePlan(
    frameShots,
    index,
    frameRole,
    storyboard.materials,
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
  const actualBoundary = storyboardProductionIncludesShotVideos(storyboard) &&
    shot.continue_previous && anchorID && anchorID !== shot.id;
  const anchorItem = anchorID
    ? { type: actualBoundary ? "shot" as const : "shot_image" as const, id: anchorID }
    : undefined;
  return {
    anchorLabel: storyboardFrameAnchorLabel(storyboard, shot, index, frameRole, referencePlan),
    dependencyItems: anchorItem ? [anchorItem] : [],
    // A video dependency supplies its extracted tail at runtime, not the video
    // itself as an ordinary image-model reference.
    referenceItems: [...(anchorItem && !actualBoundary ? [anchorItem] : []), ...materialItems],
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
  if (imagePlan.mode === "next_first" && shot.shared_end_shot_id) {
    const shared = { type: "shot_image" as const, id: shot.shared_end_shot_id };
    return {
      dependencyItems: [],
      referenceItems: [...currentImageItems, shared],
      externalReferences,
    };
  }
  const previousShot = index > 0 ? storyboard.shots[index - 1] : undefined;
  if (shot.continue_previous && previousShot) {
    const previousItem = { type: "shot" as const, id: previousShot.id };
    return {
      dependencyItems: [previousItem],
      referenceItems: currentImageItems,
      externalReferences,
    };
  }
  return {
    dependencyItems: [],
    referenceItems: currentImageItems,
    externalReferences,
  };
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
    shot.camera_instruction.trim() ? `取景：${shot.camera_instruction.trim()}` : "",
    shot.spatial_layout.trim() ? `空间关系：${shot.spatial_layout.trim()}` : "",
    `${frameRole === "end" ? "尾帧" : "首帧"}状态：${state}`,
    (frameRole === "end" ? shot.end_framing : shot.start_framing)?.trim()
      ? `静态构图：${(frameRole === "end" ? shot.end_framing : shot.start_framing)?.trim()}`
      : "",
  ]);
}

function storyboardVideoPrompt(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  _references: CanvasStoryboardReference[] = [],
  _imagePlan?: StoryboardShotImagePlan,
) {
  return storyboardEditablePromptParts([
    `画面内容：${shot.description.trim()}`,
    shot.spatial_layout.trim() ? `空间关系：${shot.spatial_layout.trim()}` : "",
    `起始状态：${shot.continuity_state.entry.trim()}`,
    shot.start_framing?.trim() ? `起始构图：${shot.start_framing.trim()}` : "",
    `结束状态：${shot.continuity_state.exit.trim()}`,
    shot.end_framing?.trim() ? `结束构图：${shot.end_framing.trim()}` : "",
    shot.camera_instruction.trim()
      ? `运镜：${shot.camera_instruction.trim()}`
      : "",
    shot.video_prompt.trim() ? `镜内动作与声音：${shot.video_prompt.trim()}` : "",
    ...(storyboardProductionUsesNativeAudio(storyboard)
      ? [
          "声音方式：视频原声",
          ...shot.speech.filter((speech) => speech.text.trim()).map((speech) => {
            const actor = storyboard.materials.find((material) => material.id === speech.character_id);
            const speaker = speech.kind === "narration" ? "旁白" : actor?.name || speech.character_id;
            const voice = speech.kind === "narration" ? storyboard.narrator_voice : actor?.voice;
            return `${speech.start_time}秒，${speaker}（${speech.kind === "narration" || speech.speaker_mode === "offscreen" ? "画外" : "出镜"}）：${speech.text}${voice ? `；声线：${voice}` : ""}`;
          }),
        ]
      : []),
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
  imagePlan?: StoryboardShotImagePlan,
) {
  const plan = imagePlan || storyboardShotImagePlan(shot);
  return {
    aspectRatio: storyboard.aspect_ratio,
    duration: shot.duration,
    referenceMode: plan.referenceMode,
  };
}
