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
  storyboardShotPrompt,
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
  storyboardVideoFrameBindings,
  storyboardFrameMediaItemsForMode,
  storyboardShotFrameItemID,
  type StoryboardFrameMediaItem,
  type StoryboardFrameRole,
  type StoryboardImageSequenceFrame,
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
  return storyboard.shots.map((shot, index) => {
    const { start, end } = storyboardVideoFrameBindings(storyboard.shots, index, storyboard.chapter_boundary?.connection === "continue");
    return {
      type: "shot" as const,
      visualContext: storyboardVisualContext(storyboard, storyboardShotMaterials(storyboard, shot)),
      id: shot.id,
      title: "镜头 " + (shot.order || index + 1),
      prompt: storyboardVideoPrompt(storyboard, shot),
      referenceItems: (start ? [start, end] : [end]).map((frame) => storyboardFrameSource(frame.shotId, frame.role)),
      externalReferences: storyboardShotVideoReferences(storyboard, shot),
      paramValues: {
        aspectRatio: storyboard.aspect_ratio,
        duration: shot.duration,
        referenceMode: "frames",
      },
      shotId: shot.id,
      shotImageMode: "first_last" as const,
      sharedStartShotId: start && start.shotId !== shot.id ? start.shotId : undefined,
      shotDuration: shot.duration,
      requiredDurationValues,
      continuityAnchor: shot.continuity_anchor,
    };
  });
}

function storyboardFrameSource(shotId: string, role: StoryboardFrameRole): StoryboardDerivedSourceItem {
  return { type: "shot_image", id: storyboardShotFrameItemID(shotId, role) };
}

function storyboardPlannedShotImageItems(storyboard: StoryboardDocument) {
  return storyboard.shots.flatMap((shot, index) => {
    const chapterContinues = index === 0 && storyboard.chapter_boundary?.connection === "continue";
    const { start } = storyboardVideoFrameBindings(storyboard.shots, index, chapterContinues);
    const roles: StoryboardFrameRole[] = start?.shotId === shot.id ? ["start", "end"] : ["end"];
    return roles.map((role) => {
      const mode = role === "end" ? "last_frame" : "first_frame";
      const sources = storyboardPlannedShotFrameSources(storyboard, shot, index, role, chapterContinues);
      return {
        ...storyboardFrameSource(shot.id, role),
        visualContext: storyboardVisualContext(storyboard, storyboardShotMaterials(storyboard, shot)),
        title: "镜头 " + (shot.order || index + 1) + " " + STORYBOARD_SHOT_IMAGE_MODE_LABELS[mode],
        prompt: storyboardEditableFramePrompt(shot, role),
        ...sources,
        paramValues: { aspectRatio: storyboard.aspect_ratio },
        shotId: shot.id,
        shotImageMode: mode,
        frameRole: role,
        frameMediaItems: storyboardFrameMediaItemsForMode(mode),
      };
    });
  });
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
  chapterContinues: boolean,
) {
  const referencePlan = storyboardFrameReferencePlan(
    storyboard.shots,
    index,
    frameRole,
    storyboard.materials,
  );
  const anchorItem = !chapterContinues && referencePlan.anchorID && referencePlan.anchorFrameRole
    ? storyboardFrameSource(referencePlan.anchorID, referencePlan.anchorFrameRole)
    : undefined;
  const referenceMaterialIDs = new Set(chapterContinues ? shot.material_ids : referencePlan.materialIDs);
  const referenceMaterials = storyboardShotMaterials(storyboard, shot).filter(
    (material) => referenceMaterialIDs.has(material.id),
  );
  const externalReferences = storyboardPlannedShotImageReferences(
    storyboard,
    chapterContinues ? shot.reference_keys : referencePlan.referenceKeys,
    chapterContinues || referencePlan.includeGlobalReferences,
    referenceMaterials,
  );
  return {
    dependencyItems: anchorItem ? [anchorItem] : [],
    referenceItems: [...(anchorItem ? [anchorItem] : []), ...storyboardMaterialSourceItems(referenceMaterials)],
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

function storyboardEditableFramePrompt(
  shot: StoryboardShot,
  frameRole: StoryboardFrameRole,
) {
  const framing = storyboardShotPrompt(shot, frameRole);
  const state =
    frameRole === "end"
      ? shot.continuity_state.exit.trim()
      : shot.continuity_state.entry.trim();
  return storyboardEditablePromptParts([
    shot.spatial_layout.trim() ? `空间关系：${shot.spatial_layout.trim()}` : "",
    `${frameRole === "end" ? "尾帧" : "首帧"}状态：${state}`,
    framing ? "静态构图：" + framing : "",
  ]);
}

function storyboardVideoPrompt(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
) {
  const motion = storyboardShotPrompt(shot, "video");
  return storyboardEditablePromptParts([
    `画面内容：${shot.description.trim()}`,
    shot.spatial_layout.trim() ? `空间关系：${shot.spatial_layout.trim()}` : "",
    `起始状态：${shot.continuity_state.entry.trim()}`,
    shot.start_framing?.trim() ? `起始构图：${shot.start_framing.trim()}` : "",
    `结束状态：${shot.continuity_state.exit.trim()}`,
    shot.end_framing?.trim() ? `结束构图：${shot.end_framing.trim()}` : "",
    shot.handoff?.incoming ? "本段入点：" + shot.handoff.incoming : "",
    shot.handoff?.outgoing ? "本段出点：" + shot.handoff.outgoing : "",
    shot.handoff?.camera_path ? "连续经过的空间路线：" + shot.handoff.camera_path : "",
    shot.camera_instruction.trim()
      ? `运镜：${shot.camera_instruction.trim()}`
      : "",
    motion ? "镜内动作与声音：" + motion : "",
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
