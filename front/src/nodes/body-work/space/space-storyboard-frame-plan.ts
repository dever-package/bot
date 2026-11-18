export const STORYBOARD_FRAME_PLAN_VERSION = 8;

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
  "first_last";

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
  scene_index?: unknown;
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
  const mode = DEFAULT_STORYBOARD_SHOT_IMAGE_MODE;
  const nodeMode = shot.continue_previous ? "last_frame" : mode;
  return {
    mode,
    nodeMode,
    frameMediaItems: storyboardFrameMediaItemsForMode(nodeMode),
    referenceMode: "frames",
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
  materials: readonly { id: string; type: string }[],
): StoryboardFrameReferencePlan {
  const shot = shots[index];
  const anchor = storyboardFrameAnchor(shots, index, role, materials);
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
    // A close-up may not show the whole subject or environment. A new
    // framing still needs the current identity, prop and scene references.
    materialIDs: uniqueFrameSourceKeys(shot.material_ids).filter(
      (id) => role === "start" || !anchorShot?.material_ids?.includes(id),
    ),
    referenceKeys: role === "start"
      ? uniqueFrameSourceKeys(shot.reference_keys)
      : frameSourceKeyDifference(shot.reference_keys, anchorShot?.reference_keys),
    includeGlobalReferences: false,
  };
}

function storyboardFrameAnchor(
  shots: readonly StoryboardFramePlanShot[],
  index: number,
  role: StoryboardFrameRole,
  materials: readonly { id: string; type: string }[],
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
  // Match the visible subject, including props in shots without people.
  // Insert shots must not replace the returning subject's reference frame.
  const currentIDs = new Set(shot.material_ids || []);
  const idsOfType = (type: string) => materials
    .filter((item) => item.type === type && currentIDs.has(item.id))
    .map((item) => item.id);
  const characters = idsOfType("character");
  const props = idsOfType("prop");
  const scenes = idsOfType("scene");
  const sceneIDs = new Set(materials.filter((item) => item.type === "scene").map((item) => item.id));
  const subjects = characters.length ? characters : props.length ? props : scenes;
  const matching = role === "start" && shot.match_previous && !shot.continue_previous;
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    if (matching) {
      const candidate = shots[cursor];
      const incoming = shots[cursor + 1];
      // A script section boundary is only a reset if the scene actually resets.
      if (incoming.scene_index != null && candidate.scene_index != null &&
          incoming.scene_index !== candidate.scene_index &&
          !incoming.match_previous && !incoming.continue_previous) break;
      const candidateIDs = candidate.material_ids || [];
      const candidateScenes = candidateIDs.filter((id) => sceneIDs.has(id));
      if (scenes.length && candidateScenes.length &&
          (scenes.length !== candidateScenes.length || !scenes.every((id) => candidateScenes.includes(id)))) break;
      if (!scenes.every((id) => candidateIDs.includes(id)) ||
          !subjects.some((id) => candidateIDs.includes(id))) continue;
    }
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
