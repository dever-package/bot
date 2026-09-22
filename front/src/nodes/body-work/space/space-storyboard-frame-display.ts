export type StoryboardFrameDisplayMode = "overview" | "expanded";

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
  overviewPosition?: { x: number; y: number };
};

export const STORYBOARD_FRAME_OVERVIEW_SIZE = {
  width: 680,
  height: 420,
};

const STORYBOARD_FRAME_SUMMARY_GAP = 48;

export function storyboardFrameDisplayModes(
  frames: StoryboardFrameDisplayScope[],
  expandedFrameId: string,
) {
  return new Map<string, StoryboardFrameDisplayMode>(
    frames.map((frame) => [
      frame.id,
      frame.id === expandedFrameId ? "expanded" : "overview",
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
  return {
    x:
      scope.overviewPosition?.x ??
      scope.sourceBounds.x +
        scope.sourceBounds.width +
        STORYBOARD_FRAME_SUMMARY_GAP,
    y: scope.overviewPosition?.y ?? scope.sourceBounds.y,
    ...STORYBOARD_FRAME_OVERVIEW_SIZE,
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
