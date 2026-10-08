import type { Node } from "@xyflow/react";
import type { SetStateAction } from "react";

export type TransientFlowNodeState<NodeType extends Node = Node> = {
  interactionId: string;
  baseNodes: NodeType[];
  nodes: NodeType[];
};

const interactionFields = [
  "position",
  "measured",
  "width",
  "height",
  "dragging",
  "resizing",
] as const;

export function activeTransientFlowNodeState<NodeType extends Node>(
  interactionId: string,
  state: TransientFlowNodeState<NodeType> | null,
) {
  return interactionId && state?.interactionId === interactionId ? state : null;
}

export function resolveTransientFlowNodes<NodeType extends Node>(
  derivedNodes: NodeType[],
  interactionId: string,
  transientState: TransientFlowNodeState<NodeType> | null,
) {
  const activeState = activeTransientFlowNodeState(interactionId, transientState);
  if (!activeState) {
    return derivedNodes;
  }
  const baseById = new Map(activeState.baseNodes.map((node) => [node.id, node]));
  const transientById = new Map(activeState.nodes.map((node) => [node.id, node]));
  const nextNodes = derivedNodes.map((node) => {
    const base = baseById.get(node.id);
    const transient = transientById.get(node.id);
    if (!base || !transient) {
      return node;
    }
    if (node === base) {
      return transient;
    }
    let next = node;
    for (const field of interactionFields) {
      if (transient[field] === base[field] || transient[field] === node[field]) {
        continue;
      }
      if (next === node) {
        next = { ...node };
      }
      Object.assign(next, { [field]: transient[field] });
    }
    return next;
  });
  if (nextNodes.every((node, index) => node === derivedNodes[index])) {
    return derivedNodes;
  }
  return nextNodes.length === activeState.nodes.length &&
    nextNodes.every((node, index) => node === activeState.nodes[index])
    ? activeState.nodes
    : nextNodes;
}

export function updateTransientFlowNodes<NodeType extends Node>(
  current: TransientFlowNodeState<NodeType> | null,
  derivedNodes: NodeType[],
  interactionId: string,
  update: SetStateAction<NodeType[]>,
): TransientFlowNodeState<NodeType> | null {
  if (!interactionId) {
    return current;
  }
  const sourceNodes = resolveTransientFlowNodes(
    derivedNodes,
    interactionId,
    current,
  );
  return {
    interactionId,
    baseNodes: derivedNodes,
    nodes: typeof update === "function" ? update(sourceNodes) : update,
  };
}
