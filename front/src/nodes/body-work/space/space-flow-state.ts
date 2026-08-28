import type { Node } from "@xyflow/react";
import type { SetStateAction } from "react";

export type TransientFlowNodeState<NodeType extends Node = Node> = {
  interactionId: string;
  nodes: NodeType[];
};

export function resolveTransientFlowNodes<NodeType extends Node>(
  derivedNodes: NodeType[],
  interactionId: string,
  transientState: TransientFlowNodeState<NodeType> | null,
) {
  return interactionId && transientState?.interactionId === interactionId
    ? transientState.nodes
    : derivedNodes;
}

export function updateTransientFlowNodes<NodeType extends Node>(
  current: TransientFlowNodeState<NodeType> | null,
  derivedNodes: NodeType[],
  interactionId: string,
  update: SetStateAction<NodeType[]>,
): TransientFlowNodeState<NodeType> {
  const sourceNodes =
    interactionId && current?.interactionId === interactionId
      ? current.nodes
      : derivedNodes;
  return {
    interactionId,
    nodes: typeof update === "function" ? update(sourceNodes) : update,
  };
}
