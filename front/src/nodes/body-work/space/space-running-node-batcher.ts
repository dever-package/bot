import type {
  RunningNodeMap,
  RunningNodeState,
} from "./space-node-runtime";

export type RunningNodeStateUpdate = (
  current: RunningNodeState | undefined,
) => RunningNodeState | undefined;

export type RunningNodeUpdateBatch = Map<string, RunningNodeStateUpdate>;

export function mergeRunningNodeUpdate(
  pending: RunningNodeUpdateBatch,
  nodeId: string,
  update: RunningNodeStateUpdate,
) {
  const previous = pending.get(nodeId);
  pending.set(
    nodeId,
    previous ? (current) => update(previous(current)) : update,
  );
}

export function applyRunningNodeUpdateBatch(
  current: RunningNodeMap,
  pending: RunningNodeUpdateBatch,
) {
  let next = current;
  for (const [nodeId, update] of pending) {
    const previousNode = current[nodeId];
    const nextNode = update(previousNode);
    if (nextNode === previousNode) {
      continue;
    }
    if (next === current) {
      next = { ...current };
    }
    if (nextNode) {
      next[nodeId] = nextNode;
    } else {
      delete next[nodeId];
    }
  }
  return next;
}
