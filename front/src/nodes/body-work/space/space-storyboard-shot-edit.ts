import type { CanvasReferenceContent } from "./types";
import {
  normalizeStoryboardOrder,
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

/** 已绑定的续接构图是一个边界，两端一起更新；未绑定的冲突仍由校验报告。 */
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

/** 复用整片校验，只拦当前镜头问题及本次编辑新引入的相邻问题。 */
export function storyboardShotDraftIssues(
  storyboard: StoryboardDocument,
  shot: StoryboardShot,
  materials: StoryboardMaterial[],
) {
  const index = storyboard.shots.findIndex((entry) => entry.id === shot.id);
  const merged = applyStoryboardShotEdit(storyboard, shot, materials);
  const issues = storyboardValidationIssues(merged).filter(
    (issue) =>
      issue.severity === "error" &&
      (issue.shotId === shot.id ||
        Boolean(
          issue.materialId && shot.material_ids.includes(issue.materialId),
        )),
  );
  const previousShotId = storyboard.shots[index - 1]?.id;
  const nextShotId = storyboard.shots[index + 1]?.id;
  const issueKey = (issue: { shotId?: string; message: string }) =>
    `${issue.shotId}:${issue.message}`;
  const existingNextIssues = new Set(
    storyboardValidationIssues(normalizeStoryboardOrder(storyboard))
      .filter(
        (issue) =>
          issue.severity === "error" &&
          (issue.shotId === nextShotId || issue.shotId === previousShotId),
      )
      .map(issueKey),
  );
  const nextIssues =
    nextShotId || previousShotId
      ? storyboardValidationIssues(normalizeStoryboardOrder(merged)).filter(
          (issue) =>
            issue.severity === "error" &&
            (issue.shotId === nextShotId || issue.shotId === previousShotId) &&
            !existingNextIssues.has(issueKey(issue)),
        )
      : [];
  return [...issues, ...nextIssues];
}

/** 生成只在全量校验成功后替换草稿；字段变更时丢弃与旧文字绑定的引用。 */
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
