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
  const visit = (nodeId: string) => {
    for (const targetId of outgoing.get(nodeId) || []) {
      if (result.has(targetId)) {
        continue;
      }
      result.add(targetId);
      const targetNode = nodeMap.get(targetId);
      if (!targetNode || !canvasNodeStopsExecution(targetNode)) {
        visit(targetId);
      }
    }
  };
  visit(startNodeId);
  return [...result];
}

export function orderedCanvasExecutionNodes(
  startNodeId: string,
  nodes: SpaceCanvasNode[],
  edges: SpaceCanvasEdge[],
) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  return canvasExecutionNodeIds(startNodeId, nodes, edges)
    .map((nodeId) => nodeMap.get(nodeId))
    .filter((node): node is SpaceCanvasNode => Boolean(node));
}

export function canvasNodeStopsExecution(node: SpaceCanvasNode) {
  return (
    node.type === "function" &&
    (node.functionOption?.key === "save" ||
      node.functionOption?.key === "display")
  );
}

function canvasOutgoingEdges(edges: SpaceCanvasEdge[]) {
  const outgoing = new Map<string, string[]>();
  for (const edge of edges) {
    if (!edge.from || !edge.to) {
      continue;
    }
    outgoing.set(edge.from, [...(outgoing.get(edge.from) || []), edge.to]);
  }
  return outgoing;
}
