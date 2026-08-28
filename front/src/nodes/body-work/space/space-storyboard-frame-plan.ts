export const STORYBOARD_FRAME_PLAN_VERSION = 5;

export const STORYBOARD_SHOT_IMAGE_MODES = [
  "first_frame",
  "last_frame",
  "first_last",
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
  match_previous?: boolean;
  continue_previous?: boolean;
  camera_instruction?: unknown;
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
  let nodeMode = mode;
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
  const plans = shots.map((shot) => {
    const plan = storyboardShotImagePlan(shot);
    return !storyboardShotHasVisibleEndChange(shot) &&
      (plan.mode === "first_last" || plan.mode === "last_frame")
      ? storyboardShotImagePlan({ ...shot, shot_image_mode: "first_frame" })
      : plan;
  });
  for (let index = plans.length - 1; index > 0; index -= 1) {
    const shot = shots[index];
    const plan = plans[index];
    if (!storyboardShotNeedsPreviousEndFrame(shot, plan)) {
      continue;
    }
    ensureStoryboardPreviousContinuityFrame(shots, plans, index - 1);
  }
  return plans;
}

export function storyboardShotHasVisibleEndChange(
  shot: Partial<StoryboardFramePlanShot>,
) {
  const state =
    shot.continuity_state &&
    typeof shot.continuity_state === "object" &&
    !Array.isArray(shot.continuity_state)
      ? (shot.continuity_state as Record<string, unknown>)
      : {};
  const entryState = framePlanText(state.entry);
  const exitState = framePlanText(state.exit);
  return (
    (Boolean(entryState) && Boolean(exitState) && entryState !== exitState) ||
    storyboardCameraInstructionChangesFrame(shot.camera_instruction)
  );
}

function ensureStoryboardPreviousContinuityFrame(
  shots: readonly StoryboardFramePlanShot[],
  plans: StoryboardShotImagePlan[],
  startIndex: number,
) {
  for (let index = startIndex; index >= 0; index -= 1) {
    if (storyboardFrameMediaIndex(plans[index].frameMediaItems, "end")) {
      return;
    }
    const shot = shots[index];
    const hasVisibleEndChange = storyboardShotHasVisibleEndChange(shot);
    if (
      plans[index].nodeMode === "first_frame" &&
      !shot.continue_previous &&
      !hasVisibleEndChange
    ) {
      return;
    }
    if (shot.continue_previous && !hasVisibleEndChange) {
      continue;
    }
    plans[index] = storyboardShotImagePlan({
      ...shot,
      shot_image_mode: hasVisibleEndChange
        ? shot.continue_previous
          ? "last_frame"
          : "first_last"
        : "first_frame",
    });
    return;
  }
}

function storyboardCameraInstructionChangesFrame(value: unknown) {
  const instruction = framePlanText(value).toLowerCase().replace(/\s+/g, "");
  return [
    "推近",
    "推进",
    "推远",
    "拉近",
    "拉远",
    "横移",
    "纵移",
    "平移",
    "跟拍",
    "跟随",
    "摇镜",
    "摇摄",
    "环绕",
    "变焦",
    "升起",
    "上升",
    "下降",
    "上移",
    "下移",
    "旋转",
    "甩镜",
    "手持晃动",
    "向前移动",
    "向后移动",
    "dolly",
    "pushin",
    "pullout",
    "pan",
    "tilt",
    "zoom",
    "tracking",
    "orbit",
    "crane",
  ].some((marker) => instruction.includes(marker));
}

function framePlanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function storyboardShotImageModesForShot(
  shot: Partial<StoryboardFramePlanShot>,
) {
  return STORYBOARD_SHOT_IMAGE_MODES.filter(
    (mode) =>
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

function storyboardShotNeedsPreviousEndFrame(
  shot: Partial<StoryboardFramePlanShot>,
  plan: StoryboardShotImagePlan,
) {
  return (
    Boolean(shot.match_previous) ||
    (Boolean(shot.continue_previous) && plan.nodeMode === "last_frame")
  );
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
    .filter(
      (frame): frame is StoryboardImageSequenceFrame => Boolean(frame),
    );
}

export function storyboardFrameMediaIndex(
  items: readonly StoryboardFrameMediaItem[] | undefined,
  role: StoryboardFrameRole,
) {
  return items?.find((item) => item.frameRole === role)?.mediaIndex || 0;
}

export function storyboardFrameAnchorID(
  shots: StoryboardFramePlanShot[],
  index: number,
  role: StoryboardFrameRole,
) {
  return storyboardFrameAnchor(shots, index, role)?.id || "";
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
    if (
      storyboardFrameMediaIndex(candidatePlan?.frameMediaItems, "start") &&
      !storyboardShotHasVisibleEndChange(shots[cursor])
    ) {
      return {
        id: shots[cursor].id,
        shotIndex: cursor,
        frameRole: "start" as const,
      };
    }
    if (
      !shots[cursor].continue_previous ||
      storyboardShotHasVisibleEndChange(shots[cursor])
    ) {
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
