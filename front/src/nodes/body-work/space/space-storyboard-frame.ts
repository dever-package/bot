import type { SpaceCanvasNode } from "./types";

const FRAME_PADDING_X = 52;
const FRAME_PADDING_TOP = 72;
const FRAME_PADDING_BOTTOM = 48;

export const STORYBOARD_FRAME_COLLAPSED_SIZE = {
  width: 360,
  height: 52,
};

export type StoryboardFrameScope = {
  id: string;
  sourceNodeId: string;
  title: string;
  memberNodeIds: string[];
  groupCount: number;
  workNodeCount: number;
  completedCount: number;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export function storyboardFrameScopes(
  nodes: SpaceCanvasNode[],
  hasResult: (node: SpaceCanvasNode) => boolean,
) {
  const sourceNodeIds = new Set<string>();
  for (const node of nodes) {
    if (node.group?.origin === "script" && node.group.sourceNodeId) {
      sourceNodeIds.add(node.group.sourceNodeId);
    }
    if (node.storyboardItem?.sourceNodeId) {
      sourceNodeIds.add(node.storyboardItem.sourceNodeId);
    }
  }

  const scopes: StoryboardFrameScope[] = [];
  for (const sourceNodeId of sourceNodeIds) {
    const sourceNode = nodes.find((node) => node.id === sourceNodeId);
    if (!sourceNode) {
      continue;
    }
    const groups = nodes.filter(
      (node) =>
        node.type === "group" &&
        node.group?.origin === "script" &&
        node.group.sourceNodeId === sourceNodeId,
    );
    const groupIds = new Set(groups.map((group) => group.id));
    const members = nodes.filter(
      (node) =>
        node.id === sourceNodeId ||
        node.group?.sourceNodeId === sourceNodeId ||
        node.storyboardItem?.sourceNodeId === sourceNodeId ||
        Boolean(node.groupId && groupIds.has(node.groupId)),
    );
    if (members.length <= 1) {
      continue;
    }
    const workNodes = members.filter(
      (node) => node.storyboardItem?.sourceNodeId === sourceNodeId,
    );
    const bounds = storyboardFrameBounds(members);
    scopes.push({
      id: storyboardFrameId(sourceNodeId),
      sourceNodeId,
      title: sourceNode.title || "分镜脚本",
      memberNodeIds: members.map((node) => node.id),
      groupCount: groups.length,
      workNodeCount: workNodes.length,
      completedCount: workNodes.filter(
        (node) => !node.storyboardItem?.stale && hasResult(node),
      ).length,
      bounds,
    });
  }
  return scopes.sort(
    (left, right) =>
      left.bounds.y - right.bounds.y || left.bounds.x - right.bounds.x,
  );
}

export function storyboardFrameDisplayBounds(
  scope: StoryboardFrameScope,
  collapsed: boolean,
) {
  return collapsed
    ? {
        x: scope.bounds.x,
        y: scope.bounds.y,
        ...STORYBOARD_FRAME_COLLAPSED_SIZE,
      }
    : scope.bounds;
}

export function moveStoryboardFrameNodes(
  nodes: SpaceCanvasNode[],
  scope: StoryboardFrameScope,
  position: { x: number; y: number },
) {
  const delta = storyboardFrameMoveDelta(scope, position);
  if (delta.x === 0 && delta.y === 0) {
    return nodes;
  }
  const memberNodeIds = new Set(scope.memberNodeIds);
  return nodes.map((node) =>
    memberNodeIds.has(node.id)
      ? { ...node, x: node.x + delta.x, y: node.y + delta.y }
      : node,
  );
}

export function storyboardFrameMoveDelta(
  scope: StoryboardFrameScope,
  position: { x: number; y: number },
) {
  return {
    x: position.x - scope.bounds.x,
    y: position.y - scope.bounds.y,
  };
}

function storyboardFrameId(sourceNodeId: string) {
  return `storyboard-frame:${sourceNodeId}`;
}

function storyboardFrameBounds(nodes: SpaceCanvasNode[]) {
  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;
  for (const node of nodes) {
    const width = positiveSize(node.width, 180);
    const height = positiveSize(node.height, 180);
    left = Math.min(left, node.x);
    top = Math.min(top, node.y);
    right = Math.max(right, node.x + width);
    bottom = Math.max(bottom, node.y + height);
  }
  return {
    x: left - FRAME_PADDING_X,
    y: top - FRAME_PADDING_TOP,
    width: right - left + FRAME_PADDING_X * 2,
    height: bottom - top + FRAME_PADDING_TOP + FRAME_PADDING_BOTTOM,
  };
}

function positiveSize(value: number, fallback: number) {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}
