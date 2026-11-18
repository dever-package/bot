import type { CanvasReferenceContent } from "./types";
import {
  storyboardShotSceneKey,
  type StoryboardDocument,
  type StoryboardMaterial,
  type StoryboardReferenceField,
  type StoryboardShot,
  type StoryboardShotGeneration,
} from "./space-storyboard";
import { storyboardValidationIssues } from "./space-storyboard-validation";

export const STORYBOARD_REFERENCE_FIELDS: StoryboardReferenceField[] = [
  "description",
  "spatial_layout",
  "start_framing",
  "end_framing",
  "camera_instruction",
  "video_prompt",
];

export function storyboardReferenceFieldPatch(
  shot: StoryboardShot,
  field: StoryboardReferenceField,
  value: string,
  content?: CanvasReferenceContent,
): Partial<StoryboardShot> {
  const referenceContents = { ...(shot.reference_contents || {}) };
  if (content) {
    referenceContents[field] = content;
  } else {
    delete referenceContents[field];
  }
  return {
    [field]: value,
    reference_contents: referenceContents,
  };
}

export function cloneStoryboardShot(shot: StoryboardShot): StoryboardShot {
  return {
    ...shot,
    material_ids: [...shot.material_ids],
    continuity_state: { ...shot.continuity_state },
    speech: shot.speech.map((speech) => ({ ...speech })),
    captions: shot.captions.map((caption) => ({ ...caption })),
    reference_contents: { ...(shot.reference_contents || {}) },
  };
}

/** 已绑定的续接构图是一个边界，两端一起更新；保留未绑定的构图文字。 */
export function applyStoryboardShotEdit(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  materials: StoryboardMaterial[],
): StoryboardDocument {
  const index = storyboard.shots.findIndex((entry) => entry.id === shot.id);
  if (index < 0) return storyboard;
  const original = storyboard.shots[index];
  const shots = [...storyboard.shots];
  shots[index] = shot;
  const sceneIDs = new Set([...storyboard.materials, ...materials]
    .filter((material) => material.type === "scene").map((material) => material.id));
  if (storyboardShotSceneKey(original, sceneIDs) !== storyboardShotSceneKey(shot, sceneIDs)) {
    return { ...storyboard, materials, shots };
  }
  const previous = storyboard.shots[index - 1];
  const next = storyboard.shots[index + 1];
  if (
    previous &&
    original.continue_previous &&
    shot.continue_previous &&
    (original.start_framing?.trim() || "") &&
    (original.start_framing?.trim() || "") ===
      (previous.end_framing?.trim() || "") &&
    shot.start_framing !== original.start_framing
  ) {
    shots[index - 1] = {
      ...previous,
      ...storyboardReferenceFieldPatch(
        previous,
        "end_framing",
        shot.start_framing || "",
      ),
    };
  }
  if (
    next?.continue_previous &&
    (original.end_framing?.trim() || "") &&
    (original.end_framing?.trim() || "") ===
      (next.start_framing?.trim() || "") &&
    shot.end_framing !== original.end_framing
  ) {
    shots[index + 1] = {
      ...next,
      ...storyboardReferenceFieldPatch(
        next,
        "start_framing",
        shot.end_framing || "",
      ),
    };
  }
  return { ...storyboard, materials, shots };
}

/** 只检查当前镜头执行所需的字段与引用，不判断创作内容。 */
export function storyboardShotDraftIssues(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  materials: StoryboardMaterial[],
) {
  return storyboardValidationIssues(applyStoryboardShotEdit(storyboard, shot, materials)).filter(
    (issue) => issue.shotId === shot.id || Boolean(issue.materialId && shot.material_ids.includes(issue.materialId)),
  );
}

/** 生成保留当前镜头身份和有效引用；字段变更时丢弃与旧文字绑定的引用。 */
export function applyGeneratedStoryboardShot(
  storyboard: StoryboardDocument,
  draft: StoryboardShot,
  generation: StoryboardShotGeneration,
): StoryboardShotGeneration {
  if (generation.shot.id !== draft.id || generation.shot.order !== draft.order)
    throw new Error("生成的镜头标识或顺序与当前镜头不符");
  const reference_contents = { ...generation.shot.reference_contents };
  for (const field of STORYBOARD_REFERENCE_FIELDS) {
    if (
      draft[field] === generation.shot[field] &&
      draft.reference_contents?.[field]
    )
      reference_contents[field] = draft.reference_contents[field];
  }
  const shot = { ...generation.shot, reference_contents };
  const issues = storyboardShotDraftIssues(
    storyboard,
    shot,
    generation.materials,
  );
  if (issues.length)
    throw new Error(issues.map((issue) => issue.message).join("；"));
  return { shot: cloneStoryboardShot(shot), materials: generation.materials };
}
