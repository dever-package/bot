import type { StoryboardGroupDirection } from "./space-storyboard-derived-layout";
import {
  storyboardMaterialReferenceNames,
  storyboardPromptWithStyle,
  storyboardShotFallbackPrompt,
  type StoryboardDocument,
  type StoryboardMaterial,
  type StoryboardShot,
} from "./space-storyboard";
import type { CanvasReferenceContent, CanvasStoryboardItemType } from "./types";

export type StoryboardPowerKind = "image" | "video";

export type StoryboardDerivedItem = {
  type: CanvasStoryboardItemType;
  id: string;
  title: string;
  prompt: string;
  promptContent?: CanvasReferenceContent;
};

export type StoryboardDerivedGroupKey =
  | "characters"
  | "scenes"
  | "props"
  | "shot_frames"
  | "shots";

export type StoryboardDerivedGroupSpec = {
  key: StoryboardDerivedGroupKey;
  title: string;
  itemType: CanvasStoryboardItemType;
  powerKind: StoryboardPowerKind;
  direction: StoryboardGroupDirection;
  sourceGroupKey?: StoryboardDerivedGroupKey;
  layoutIndex: number;
  enabled: (storyboard: StoryboardDocument) => boolean;
  items: (storyboard: StoryboardDocument) => StoryboardDerivedItem[];
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
    direction: "downstream",
    layoutIndex: 0,
    enabled: () => true,
    items: (storyboard) =>
      storyboard.shots.map((shot, index) => ({
        type: "shot_frame",
        id: shot.id,
        title: shotFrameTitle(shot, index),
        prompt: storyboardShotFramePrompt(storyboard, shot),
      })),
  },
  {
    key: "shots",
    title: "镜头视频组",
    itemType: "shot",
    powerKind: "video",
    direction: "downstream",
    sourceGroupKey: "shot_frames",
    layoutIndex: 1,
    enabled: () => true,
    items: (storyboard) =>
      storyboard.shots.map((shot, index) => {
        const prompt = storyboardVideoPrompt(storyboard, shot);
        return {
          type: "shot",
          id: shot.id,
          title: `镜头 ${shot.order || index + 1}`,
          prompt,
        };
      }),
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
    .map((shot) => shot.visual.trim())
    .filter(Boolean);
  const context = relatedVisuals.length
    ? `相关镜头：${relatedVisuals.join("；")}`
    : "保持整部故事的统一视觉风格";
  return storyboardPromptWithStyle(
    storyboard,
    `${MATERIAL_LABELS[itemType]}“${material.name}”的素材生成图。${context}`,
  );
}

function shotFrameTitle(shot: StoryboardShot, index: number) {
  return `镜头画面 ${shot.order || index + 1}`;
}

function storyboardShotFramePrompt(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
) {
  const prompt = [
    shot.visual.trim(),
    shot.camera_movement.trim()
      ? `镜头构图与机位参考：${shot.camera_movement.trim()}`
      : "",
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
) {
  const prompt = storyboardPromptWithStyle(
    storyboard,
    shot.prompt.trim() || storyboardShotFallbackPrompt(shot),
  );
  return storyboardMaterialReferenceNames(storyboard).reduce(
    (current, name) => current.split(`@${name}`).join(name),
    prompt,
  );
}
