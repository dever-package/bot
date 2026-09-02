export type StoryboardFrameDisplayMode =
  | "overview"
  | "minimized"
  | "expanded";

export type StoryboardFrameBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type StoryboardFrameDisplayScope = {
  id: string;
  sourceNodeId: string;
  memberNodeIds: string[];
  sourceBounds: StoryboardFrameBounds;
  bounds: StoryboardFrameBounds;
};

export const STORYBOARD_FRAME_OVERVIEW_SIZE = {
  width: 680,
  height: 420,
};

export const STORYBOARD_FRAME_COLLAPSED_SIZE = {
  width: 360,
  height: 52,
};

const STORYBOARD_FRAME_SUMMARY_GAP = 48;

export function storyboardFrameDisplayModes(
  frames: StoryboardFrameDisplayScope[],
  expandedFrameId: string,
  minimizedFrameIds: ReadonlySet<string>,
) {
  const expandedFrameExists = frames.some(
    (frame) => frame.id === expandedFrameId,
  );
  return new Map<string, StoryboardFrameDisplayMode>(
    frames.map((frame) => [
      frame.id,
      expandedFrameExists && frame.id === expandedFrameId
        ? "expanded"
        : minimizedFrameIds.has(frame.id)
          ? "minimized"
          : "overview",
    ]),
  );
}

export function storyboardFrameDisplayBounds(
  scope: StoryboardFrameDisplayScope,
  mode: StoryboardFrameDisplayMode,
): StoryboardFrameBounds {
  if (mode === "expanded") {
    return scope.bounds;
  }
  const size =
    mode === "minimized"
      ? STORYBOARD_FRAME_COLLAPSED_SIZE
      : STORYBOARD_FRAME_OVERVIEW_SIZE;
  return {
    x:
      scope.sourceBounds.x +
      scope.sourceBounds.width +
      STORYBOARD_FRAME_SUMMARY_GAP,
    y: scope.sourceBounds.y,
    ...size,
  };
}

export function storyboardFrameHiddenNodeIds(
  frames: StoryboardFrameDisplayScope[],
  modeForFrame: (
    frame: StoryboardFrameDisplayScope,
  ) => StoryboardFrameDisplayMode,
) {
  const hidden = new Set<string>();
  for (const frame of frames) {
    if (modeForFrame(frame) === "expanded") {
      continue;
    }
    for (const nodeId of frame.memberNodeIds) {
      if (nodeId !== frame.sourceNodeId) {
        hidden.add(nodeId);
      }
    }
  }
  return hidden;
}
