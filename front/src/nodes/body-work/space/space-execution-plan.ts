import type {
  SpaceCanvasEdge,
  SpaceCanvasNode,
} from "./types";

export function canvasExecutionNodeIds(
  startNodeId: string,
  nodes: SpaceCanvasNode[],
  edges: SpaceCanvasEdge[],
) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const outgoing = canvasOutgoingEdges(edges);
  const result = new Set<string>();
  const groupMembers = new Map<string, string[]>();
  for (const node of nodes) {
    if (!node.groupId) {
      continue;
    }
    groupMembers.set(node.groupId, [
      ...(groupMembers.get(node.groupId) || []),
      node.id,
    ]);
  }
  const visit = (nodeId: string) => {
    for (const targetId of outgoing.get(nodeId) || []) {
      if (result.has(targetId)) {
        continue;
      }
      result.add(targetId);
      const targetNode = nodeMap.get(targetId);
      if (targetNode?.type === "group") {
        for (const memberId of groupMembers.get(targetNode.id) || []) {
          if (!result.has(memberId)) {
            result.add(memberId);
            visit(memberId);
          }
        }
      }
      if (!targetNode || !canvasNodeStopsExecution(targetNode)) {
        visit(targetId);
      }
    }
  };
  visit(startNodeId);
  return [...result];
}

export function canvasNodeStopsExecution(node: SpaceCanvasNode) {
  return (
    node.type === "function" &&
    (node.functionOption?.key === "save" ||
      node.functionOption?.key === "display")
  );
}

export function canvasNodeRunsInBackend(node: SpaceCanvasNode) {
  if (node.type === "power") {
    return Boolean(Number(node.power?.id || 0) > 0 || node.power?.key);
  }
  if (["asset", "agent", "flow"].includes(node.type)) {
    return true;
  }
  return (
    node.type === "function" &&
    (node.functionOption?.key === "save" ||
      node.functionOption?.key === "display")
  );
}

function canvasOutgoingEdges(edges: SpaceCanvasEdge[]) {
  const outgoing = new Map<string, string[]>();
  for (const edge of edges) {
    if (!edge.from || !edge.to || edge.executionMode === "manual") {
      continue;
    }
    const sourceNodeId = edge.logicalFrom || edge.from;
    const targetNodeId = edge.logicalTo || edge.to;
    outgoing.set(sourceNodeId, [
      ...(outgoing.get(sourceNodeId) || []),
      targetNodeId,
    ]);
  }
  return outgoing;
}
