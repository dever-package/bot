import type { CanvasRunRef } from "./space-runner";

type RunListener = (run: CanvasRunRef) => void;

// 页面的一次批量核对唤醒对应运行的流消费者，不为每个节点另起轮询。
export function createCanvasRunObservation() {
  const listeners = new Map<string, Set<RunListener>>();
  const key = (projectId: number, canvasId: number, requestId: string) =>
    JSON.stringify([projectId, canvasId, requestId]);

  return {
    subscribe(
      projectId: number,
      canvasId: number,
      requestId: string,
      listener: RunListener,
    ) {
      const identity = key(projectId, canvasId, requestId);
      const subscribers = listeners.get(identity) || new Set<RunListener>();
      subscribers.add(listener);
      listeners.set(identity, subscribers);
      return () => {
        subscribers.delete(listener);
        if (subscribers.size === 0) listeners.delete(identity);
      };
    },
    publish(projectId: number, run: CanvasRunRef) {
      const identity = key(
        projectId,
        Number(run.canvas_id || 0),
        String(run.request_id || ""),
      );
      for (const listener of listeners.get(identity) || []) listener(run);
    },
    clear() {
      listeners.clear();
    },
  };
}
