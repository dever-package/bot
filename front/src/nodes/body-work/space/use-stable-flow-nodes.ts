import { useMemo, useRef } from "react";
import type { Node } from "@xyflow/react";

export function useStableFlowNodeReferences<NodeType extends Node>(
  nodes: NodeType[],
  equivalent: (previous: NodeType, next: NodeType) => boolean,
) {
  const previousNodesRef = useRef<NodeType[]>([]);

  return useMemo(() => {
    const stableNodes = reuseEquivalentFlowNodes(
      nodes,
      previousNodesRef.current,
      equivalent,
    );
    previousNodesRef.current = stableNodes;
    return stableNodes;
  }, [equivalent, nodes]);
}

export function reuseEquivalentFlowNodes<NodeType extends Node>(
  nodes: NodeType[],
  previousNodes: NodeType[],
  equivalent: (previous: NodeType, next: NodeType) => boolean,
) {
  const previousByID = new Map(previousNodes.map((node) => [node.id, node]));
  const nextNodes = nodes.map((node) => {
    const previous = previousByID.get(node.id);
    return previous && equivalent(previous, node) ? previous : node;
  });
  return previousNodes.length === nextNodes.length &&
    nextNodes.every((node, index) => node === previousNodes[index])
    ? previousNodes
    : nextNodes;
}
