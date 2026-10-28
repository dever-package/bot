export const STORYBOARD_FRAME_PLAN_VERSION = 5;

export const STORYBOARD_SHOT_IMAGE_MODES = [
  "first_frame",
  "last_frame",
  "first_last",
  "next_first",
  "references",
  "none",
] as const;

export type StoryboardShotImageMode =
  (typeof STORYBOARD_SHOT_IMAGE_MODES)[number];

export const DEFAULT_STORYBOARD_SHOT_IMAGE_MODE: StoryboardShotImageMode =
  "first_frame";

export const STORYBOARD_SHOT_IMAGE_MODE_LABELS: Record<
  StoryboardShotImageMode,
  string
> = {
  first_frame: "首帧",
  last_frame: "尾帧",
  first_last: "首尾帧",
  next_first: "首帧 → 下一镜首帧",
  references: "参考图组",
  none: "无参考图",
};

export type StoryboardFrameRole = "start" | "end";

export type StoryboardFrameMediaItem = {
  frameRole: StoryboardFrameRole;
  mediaIndex: number;
};

export type StoryboardImageSequenceFrame = {
  title: string;
  description: string;
  prompt: string;
};

type StoryboardFramePlanShot = {
  id: string;
  shot_image_mode?: unknown;
  shared_end_shot_id?: string;
  match_previous?: boolean;
  continue_previous?: boolean;
  camera_instruction?: unknown;
  start_framing?: string;
  end_framing?: string;
  transition_type?: string;
  continuity_state?: unknown;
  material_ids?: readonly string[];
  reference_keys?: readonly string[];
};

export type StoryboardFrameReferencePlan = {
  anchorID: string;
  anchorFrameRole: StoryboardFrameRole | "";
  anchorShotIndex: number;
  materialIDs: string[];
  referenceKeys: string[];
  includeGlobalReferences: boolean;
};

export type StoryboardShotImagePlan = {
  mode: StoryboardShotImageMode;
  nodeMode: StoryboardShotImageMode;
  frameMediaItems: StoryboardFrameMediaItem[];
  referenceMode: "" | "frames" | "references";
};

export function normalizeStoryboardFramePlanVersion(value: unknown) {
  const version = Number(value);
  return Number.isInteger(version) && version > 0 ? version : undefined;
}

export function usesStoryboardFramePlan(value: unknown) {
  return (
    (normalizeStoryboardFramePlanVersion(value) || 0) >=
    STORYBOARD_FRAME_PLAN_VERSION
  );
}

export function storyboardFramePlanVersionForSync(
  currentVersion: unknown,
  materialize: boolean,
) {
  const normalizedVersion = normalizeStoryboardFramePlanVersion(currentVersion);
  return materialize
    ? Math.max(normalizedVersion || 0, STORYBOARD_FRAME_PLAN_VERSION)
    : normalizedVersion;
}

export function parseStoryboardFrameRole(
  value: unknown,
): StoryboardFrameRole | undefined {
  return value === "start" || value === "end" ? value : undefined;
}

export function storyboardFrameRole(value: unknown): StoryboardFrameRole {
  return parseStoryboardFrameRole(value) || "start";
}

export function storyboardFrameMediaUsage(role: unknown) {
  return storyboardFrameRole(role) === "end" ? "lastFrame" : "firstFrame";
}

export function normalizeStoryboardShotImageMode(
  value: unknown,
): StoryboardShotImageMode {
  return (
    parseStoryboardShotImageMode(value) || DEFAULT_STORYBOARD_SHOT_IMAGE_MODE
  );
}

export function parseStoryboardShotImageMode(
  value: unknown,
): StoryboardShotImageMode | undefined {
  return STORYBOARD_SHOT_IMAGE_MODES.includes(value as StoryboardShotImageMode)
    ? (value as StoryboardShotImageMode)
    : undefined;
}

export function storyboardFrameMediaItemsForMode(
  mode: StoryboardShotImageMode,
): StoryboardFrameMediaItem[] {
  switch (mode) {
    case "first_frame":
      return [{ frameRole: "start", mediaIndex: 1 }];
    case "last_frame":
      return [{ frameRole: "end", mediaIndex: 1 }];
    case "first_last":
      return storyboardFramePairMediaItems();
    default:
      return [];
  }
}

export function storyboardShotImagePlan(
  shot: Partial<StoryboardFramePlanShot>,
): StoryboardShotImagePlan {
  const requestedMode = normalizeStoryboardShotImageMode(shot.shot_image_mode);
  const continuesPrevious = Boolean(shot.continue_previous);
  const matchesPrevious = Boolean(shot.match_previous);
  const mode = normalizeStoryboardShotImageModeForLinks(
    requestedMode,
    matchesPrevious,
    continuesPrevious,
  );
  let nodeMode: StoryboardShotImageMode =
    mode === "next_first" ? "first_frame" : mode;
  if (continuesPrevious && mode === "first_frame") {
    nodeMode = "none";
  }
  return {
    mode,
    nodeMode,
    frameMediaItems: storyboardFrameMediaItemsForMode(nodeMode),
    referenceMode:
      mode === "references" ? "references" : mode === "none" ? "" : "frames",
  };
}

export function storyboardShotImageSequencePlans(
  shots: readonly StoryboardFramePlanShot[],
) {
  return shots.map(storyboardShotImagePlan);
}

function framePlanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function storyboardShotImageModesForShot(
  shot: Partial<StoryboardFramePlanShot>,
) {
  return STORYBOARD_SHOT_IMAGE_MODES.filter(
    (mode) =>
      !(mode === "next_first" && shot.continue_previous) &&
      storyboardShotImagePlan({ ...shot, shot_image_mode: mode }).mode === mode,
  );
}

function normalizeStoryboardShotImageModeForLinks(
  mode: StoryboardShotImageMode,
  matchesPrevious: boolean,
  continuesPrevious: boolean,
) {
  if (continuesPrevious && mode === "first_last") {
    return "last_frame";
  }
  if (mode === "last_frame" && !continuesPrevious) {
    return DEFAULT_STORYBOARD_SHOT_IMAGE_MODE;
  }
  if (
    (continuesPrevious && (mode === "references" || mode === "none")) ||
    (matchesPrevious && mode === "none")
  ) {
    return DEFAULT_STORYBOARD_SHOT_IMAGE_MODE;
  }
  return mode;
}

export function storyboardFramePairMediaItems(): StoryboardFrameMediaItem[] {
  return [
    { frameRole: "start", mediaIndex: 1 },
    { frameRole: "end", mediaIndex: 2 },
  ];
}

export function normalizeStoryboardFrameMediaItems(
  value: unknown,
): StoryboardFrameMediaItem[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const result: StoryboardFrameMediaItem[] = [];
  const usedRoles = new Set<StoryboardFrameRole>();
  const usedIndexes = new Set<number>();
  for (const candidate of value) {
    if (
      !candidate ||
      typeof candidate !== "object" ||
      Array.isArray(candidate)
    ) {
      continue;
    }
    const row = candidate as Record<string, unknown>;
    const frameRole = parseStoryboardFrameRole(row.frameRole ?? row.frame_role);
    const mediaIndex = Number(row.mediaIndex ?? row.media_index);
    if (
      !frameRole ||
      !Number.isInteger(mediaIndex) ||
      mediaIndex <= 0 ||
      usedRoles.has(frameRole) ||
      usedIndexes.has(mediaIndex)
    ) {
      continue;
    }
    usedRoles.add(frameRole);
    usedIndexes.add(mediaIndex);
    result.push({ frameRole, mediaIndex });
  }
  return result.sort((left, right) => left.mediaIndex - right.mediaIndex);
}

export function normalizeStoryboardImageSequenceFrames(
  value: unknown,
): StoryboardImageSequenceFrame[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((raw) => {
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
        return undefined;
      }
      const row = raw as Record<string, unknown>;
      const prompt = framePlanText(row.prompt);
      if (!prompt) {
        return undefined;
      }
      const title = framePlanText(row.title);
      return {
        title: title || "画面",
        description: framePlanText(row.description) || title || prompt,
        prompt,
      };
    })
    .filter((frame): frame is StoryboardImageSequenceFrame => Boolean(frame));
}

export function storyboardFrameMediaIndex(
  items: readonly StoryboardFrameMediaItem[] | undefined,
  role: StoryboardFrameRole,
) {
  return items?.find((item) => item.frameRole === role)?.mediaIndex || 0;
}

export function storyboardFrameReferencePlan(
  shots: StoryboardFramePlanShot[],
  index: number,
  role: StoryboardFrameRole,
): StoryboardFrameReferencePlan {
  const shot = shots[index];
  const anchor = storyboardFrameAnchor(shots, index, role);
  if (!shot || !anchor) {
    return {
      anchorID: "",
      anchorFrameRole: "",
      anchorShotIndex: -1,
      materialIDs: uniqueFrameSourceKeys(shot?.material_ids),
      referenceKeys: uniqueFrameSourceKeys(shot?.reference_keys),
      includeGlobalReferences: true,
    };
  }

  const anchorShot = shots[anchor.shotIndex];
  return {
    anchorID: anchor.id,
    anchorFrameRole: anchor.frameRole,
    anchorShotIndex: anchor.shotIndex,
    materialIDs: frameSourceKeyDifference(
      shot.material_ids,
      anchorShot?.material_ids,
    ),
    referenceKeys: frameSourceKeyDifference(
      shot.reference_keys,
      anchorShot?.reference_keys,
    ),
    includeGlobalReferences: false,
  };
}

function storyboardFrameAnchor(
  shots: readonly StoryboardFramePlanShot[],
  index: number,
  role: StoryboardFrameRole,
) {
  const shot = shots[index];
  if (!shot) {
    return undefined;
  }
  const plans = storyboardShotImageSequencePlans(shots);
  if (role === "end" && !shot.continue_previous) {
    return storyboardFrameMediaIndex(plans[index]?.frameMediaItems, "start")
      ? { id: shot.id, shotIndex: index, frameRole: "start" as const }
      : undefined;
  }
  if (
    (role === "start" && !shot.match_previous && !shot.continue_previous) ||
    index <= 0
  ) {
    return undefined;
  }
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    const candidatePlan = plans[cursor];
    if (storyboardFrameMediaIndex(candidatePlan?.frameMediaItems, "end")) {
      return {
        id: shots[cursor].id,
        shotIndex: cursor,
        frameRole: "end" as const,
      };
    }
    if (storyboardFrameMediaIndex(candidatePlan?.frameMediaItems, "start")) {
      return {
        id: shots[cursor].id,
        shotIndex: cursor,
        frameRole: "start" as const,
      };
    }
    if (!shots[cursor].continue_previous) {
      return undefined;
    }
  }
  return undefined;
}

function frameSourceKeyDifference(
  current: readonly string[] | undefined,
  inherited: readonly string[] | undefined,
) {
  const inheritedKeys = new Set(uniqueFrameSourceKeys(inherited));
  return uniqueFrameSourceKeys(current).filter(
    (key) => !inheritedKeys.has(key),
  );
}

function uniqueFrameSourceKeys(values: readonly string[] | undefined) {
  return [
    ...new Set((values || []).map((value) => value.trim()).filter(Boolean)),
  ];
}

/** Explicit endpoint binding; identity matching alone does not establish continuity. */
export function storyboardSharedFrameIssue(
  shots: readonly StoryboardFramePlanShot[],
  index: number,
  materials: readonly { id: string; type: string }[],
): string {
  const shot = shots[index];
  if (shot?.shot_image_mode !== "next_first") return "";
  const next = shots[index + 1];
  if (!next) return "最后一镜没有下一镜，请改用首帧或独立首尾帧";
  if (shot.shared_end_shot_id !== next.id)
    return "来源不再是相邻下一镜，请重新选择结束画面";
  if (shot.continue_previous || next.continue_previous || !next.match_previous)
    return "须使用计划首帧直接连续，不能与真实视频尾帧续接混用";
  if (
    !["first_frame", "first_last", "next_first"].includes(
      normalizeStoryboardShotImageMode(next.shot_image_mode),
    )
  )
    return "下一镜没有可共享的首帧";
  if (next.transition_type && next.transition_type !== "none")
    return "下一镜不能设置转场效果";
  const state = (value: unknown) =>
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const exit = framePlanText(state(shot.continuity_state).exit);
  if (!exit || exit !== framePlanText(state(next.continuity_state).entry))
    return "结束状态必须与下一镜入镜状态完全一致";
  if (
    !shot.end_framing?.trim() ||
    shot.end_framing.trim() !== next.start_framing?.trim()
  )
    return "结束构图必须与下一镜起始构图完全一致";
  const stable = materials;
  const current = stable.filter((material) =>
    shot.material_ids?.includes(material.id),
  );
  const following = stable.filter((material) =>
    next.material_ids?.includes(material.id),
  );
  if (
    !current.some((material) => material.type === "scene") ||
    current.length !== following.length ||
    current.some((material) => !next.material_ids?.includes(material.id))
  )
    return "必须保持同一场景与相同主体素材";
  return "";
}
