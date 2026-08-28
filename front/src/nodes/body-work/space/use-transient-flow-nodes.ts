import { useCallback, useState, type SetStateAction } from "react";
import type { Node } from "@xyflow/react";
import {
  resolveTransientFlowNodes,
  updateTransientFlowNodes,
  type TransientFlowNodeState,
} from "./space-flow-state";

export function useTransientFlowNodes<NodeType extends Node>(
  derivedNodes: NodeType[],
  interactionId: string,
) {
  const [transientState, setTransientState] =
    useState<TransientFlowNodeState<NodeType> | null>(null);
  const flowNodes = resolveTransientFlowNodes(
    derivedNodes,
    interactionId,
    transientState,
  );
  const setFlowNodes = useCallback(
    (update: SetStateAction<NodeType[]>) => {
      setTransientState((current) =>
        updateTransientFlowNodes(current, derivedNodes, interactionId, update),
      );
    },
    [derivedNodes, interactionId],
  );

  return { flowNodes, setFlowNodes };
}
