import type { SpaceCanvasNode } from "./types";
import { canvasNodeRunsInBackend } from "./space-execution-plan";
import { storyboardRunBlockedReason } from "./space-group-runtime";

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
  workNodeIds: string[];
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

export function storyboardManagedNodeIds(nodes: SpaceCanvasNode[]) {
  const sourceNodeIds = storyboardSourceNodeIds(nodes);
  const scriptGroupIds = new Set(
    nodes
      .filter(
        (node) =>
          node.type === "group" &&
          node.group?.origin === "script" &&
          Boolean(node.group.sourceNodeId),
      )
      .map((node) => node.id),
  );
  const managedNodeIds = new Set(sourceNodeIds);
  for (const node of nodes) {
    if (
      node.storyboardItem?.sourceNodeId ||
      (node.type === "group" && node.group?.origin === "script") ||
      Boolean(node.groupId && scriptGroupIds.has(node.groupId))
    ) {
      managedNodeIds.add(node.id);
    }
  }
  return managedNodeIds;
}

export function storyboardStructureLockedNodeIds(nodes: SpaceCanvasNode[]) {
  return storyboardSourceNodeIds(nodes);
}

export function storyboardSourceNodeIdForNode(
  nodes: SpaceCanvasNode[],
  node: SpaceCanvasNode,
) {
  if (node.storyboardItem?.sourceNodeId) {
    return node.storyboardItem.sourceNodeId;
  }
  if (node.type === "group" && node.group?.origin === "script") {
    return node.group.sourceNodeId || "";
  }
  const sourceNodeIds = storyboardSourceNodeIds(nodes);
  if (sourceNodeIds.has(node.id)) {
    return node.id;
  }
  if (!node.groupId) {
    return "";
  }
  const group = nodes.find((candidate) => candidate.id === node.groupId);
  return group?.group?.origin === "script"
    ? group.group.sourceNodeId || ""
    : "";
}

export function storyboardFrameScopes(
  nodes: SpaceCanvasNode[],
  hasResult: (node: SpaceCanvasNode) => boolean,
) {
  const storyboardNodeIds = storyboardSourceNodeIds(nodes);

  const scopes: StoryboardFrameScope[] = [];
  for (const sourceNodeId of storyboardNodeIds) {
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
      (node) =>
        node.storyboardItem?.sourceNodeId === sourceNodeId &&
        !node.storyboardItem.optional,
    );
    const bounds = storyboardFrameBounds(members);
    scopes.push({
      id: storyboardFrameId(sourceNodeId),
      sourceNodeId,
      title: sourceNode.title || "分镜脚本",
      memberNodeIds: members.map((node) => node.id),
      workNodeIds: workNodes.map((node) => node.id),
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

export function storyboardFrameRunSummary(
  scope: StoryboardFrameScope,
  nodes: SpaceCanvasNode[],
  hasResult: (node: SpaceCanvasNode) => boolean,
) {
  const nodesByID = new Map(nodes.map((node) => [node.id, node]));
  const workNodes = scope.workNodeIds
    .map((nodeId) => nodesByID.get(nodeId))
    .filter((node): node is SpaceCanvasNode => Boolean(node));
  const pendingNodeIDs = new Set(
    workNodes
      .filter((node) => node.storyboardItem?.stale || !hasResult(node))
      .map((node) => node.id),
  );

  let changed = true;
  while (changed) {
    changed = false;
    for (const node of workNodes) {
      if (
        pendingNodeIDs.has(node.id) ||
        node.storyboardItem?.itemType === "video_compose"
      ) {
        continue;
      }
      if (
        storyboardDependencyNodeIds(node).some((nodeId) =>
          pendingNodeIDs.has(nodeId),
        )
      ) {
        pendingNodeIDs.add(node.id);
        changed = true;
      }
    }
  }

  const composition = workNodes.find(
    (node) => node.storyboardItem?.itemType === "video_compose",
  );
  if (pendingNodeIDs.size > 0 && composition) {
    pendingNodeIDs.add(composition.id);
  }
  const pendingNodes = workNodes.filter((node) =>
    pendingNodeIDs.has(node.id),
  );
  if (pendingNodes.length === 0) {
    return { pendingNodeIds: [] as string[], blockedReason: "制作区已完成" };
  }
  const unavailable = pendingNodes.find(
    (node) => !canvasNodeRunsInBackend(node),
  );
  if (unavailable) {
    return {
      pendingNodeIds: pendingNodes.map((node) => node.id),
      blockedReason: `“${unavailable.title || "未命名节点"}”未配置可用能力`,
    };
  }
  return {
    pendingNodeIds: pendingNodes.map((node) => node.id),
    blockedReason: storyboardRunBlockedReason({
      targets: pendingNodes,
      nodesByID,
      hasResult,
    }),
  };
}

export function markStoryboardFrameResultsCurrent(
  nodes: SpaceCanvasNode[],
  sourceNodeId: string,
  successfulNodeIds: ReadonlySet<string>,
) {
  let changed = false;
  const next = nodes.map((node) => {
    const item = node.storyboardItem;
    if (
      !item ||
      item.sourceNodeId !== sourceNodeId ||
      !successfulNodeIds.has(node.id)
    ) {
      return node;
    }
    changed = true;
    return {
      ...node,
      storyboardItem: {
        ...item,
        resultSourceSignature:
          item.sourceSignature || item.resultSourceSignature,
        stale: false,
      },
    };
  });
  return changed ? next : nodes;
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

export function storyboardFrameId(sourceNodeId: string) {
  return `storyboard-frame:${sourceNodeId}`;
}

function storyboardDependencyNodeIds(node: SpaceCanvasNode) {
  return [
    ...(node.storyboardItem?.dependencyNodeIds || []),
    ...(node.storyboardItem?.referenceNodeIds || []),
  ];
}

function storyboardSourceNodeIds(nodes: SpaceCanvasNode[]) {
  const sourceNodeIds = new Set<string>();
  for (const node of nodes) {
    if (node.storyboardMaterializedSignature) {
      sourceNodeIds.add(node.id);
    }
    if (node.group?.origin === "script" && node.group.sourceNodeId) {
      sourceNodeIds.add(node.group.sourceNodeId);
    }
    if (node.storyboardItem?.sourceNodeId) {
      sourceNodeIds.add(node.storyboardItem.sourceNodeId);
    }
  }
  return sourceNodeIds;
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
