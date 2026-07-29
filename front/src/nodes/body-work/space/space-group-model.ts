import type { SpaceCanvasEdge, SpaceCanvasNode } from "./types";

export const DEFAULT_GROUP_NODE_SIZE = { width: 720, height: 420 };
export const MIN_GROUP_NODE_SIZE = { width: 360, height: 240 };
export const MAX_GROUP_NODE_SIZE = { width: 2400, height: 1600 };

const GROUP_HEADER_HEIGHT = 48;
const GROUP_CONTENT_PADDING = 16;

export function isCanvasGroupNode(node?: SpaceCanvasNode | null) {
  return node?.type === "group";
}

export function canvasGroupMembers(nodes: SpaceCanvasNode[], groupId: string) {
  return nodes.filter((node) => node.groupId === groupId);
}

export function canConnectCanvasNodes(
  sourceNode?: SpaceCanvasNode,
  targetNode?: SpaceCanvasNode,
) {
  if (!sourceNode || !targetNode || sourceNode.id === targetNode.id) {
    return false;
  }
  if (
    (sourceNode.type === "group" && targetNode.groupId === sourceNode.id) ||
    (targetNode.type === "group" && sourceNode.groupId === targetNode.id)
  ) {
    return false;
  }
  if (
    sourceNode.groupId !== targetNode.groupId &&
    ((sourceNode.type !== "group" && Boolean(sourceNode.groupId)) ||
      (targetNode.type !== "group" && Boolean(targetNode.groupId)))
  ) {
    return false;
  }
  return true;
}

export function withMovedCanvasNode(
  nodes: SpaceCanvasNode[],
  nodeId: string,
  position: { x: number; y: number },
) {
  const target = nodes.find((node) => node.id === nodeId);
  if (!target || (target.x === position.x && target.y === position.y)) {
    return nodes;
  }
  const deltaX = position.x - target.x;
  const deltaY = position.y - target.y;
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return { ...node, ...position };
    }
    if (target.type === "group" && node.groupId === target.id) {
      return {
        ...node,
        x: node.x + deltaX,
        y: node.y + deltaY,
      };
    }
    return node;
  });
}

export function withCanvasNodeGroupAtPosition(
  nodes: SpaceCanvasNode[],
  nodeId: string,
  position: { x: number; y: number },
) {
  const target = nodes.find((node) => node.id === nodeId);
  if (!target || target.type === "group") {
    return nodes;
  }
  const moved = { ...target, ...position };
  const groupId = containingCanvasGroupId(nodes, moved);
  if ((target.groupId || "") === groupId) {
    return nodes;
  }
  return nodes.map((node) =>
    node.id === nodeId ? { ...node, groupId: groupId || undefined } : node,
  );
}

export function withoutCanvasGroupAndMembers(
  nodes: SpaceCanvasNode[],
  groupId: string,
) {
  return nodes.filter(
    (node) => node.id !== groupId && node.groupId !== groupId,
  );
}

export function reconcileCanvasGroupEdges(
  nodes: SpaceCanvasNode[],
  edges: SpaceCanvasEdge[],
) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const seen = new Set<string>();
  const result: SpaceCanvasEdge[] = [];
  for (const edge of edges) {
    const logicalFrom = edge.logicalFrom || edge.from;
    const logicalTo = edge.logicalTo || edge.to;
    const source = nodeMap.get(logicalFrom);
    const target = nodeMap.get(logicalTo);
    if (!source || !target) {
      continue;
    }
    const crossBoundary = source.groupId !== target.groupId;
    const from =
      crossBoundary && source.type !== "group" && source.groupId
        ? source.groupId
        : source.id;
    const to =
      crossBoundary && target.type !== "group" && target.groupId
        ? target.groupId
        : target.id;
    if (!from || !to || from === to) {
      continue;
    }
    const key = `${logicalFrom}\u0000${logicalTo}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push({ ...edge, from, to, logicalFrom, logicalTo });
  }
  return result;
}

function containingCanvasGroupId(
  nodes: SpaceCanvasNode[],
  target: SpaceCanvasNode,
) {
  const centerX = target.x + target.width / 2;
  const centerY = target.y + target.height / 2;
  const groups = nodes
    .filter(
      (node) =>
        node.type === "group" &&
        node.id !== target.id &&
        centerX >= node.x + GROUP_CONTENT_PADDING &&
        centerX <= node.x + node.width - GROUP_CONTENT_PADDING &&
        centerY >= node.y + GROUP_HEADER_HEIGHT &&
        centerY <= node.y + node.height - GROUP_CONTENT_PADDING,
    )
    .sort(
      (left, right) => left.width * left.height - right.width * right.height,
    );
  return groups[0]?.id || "";
}
