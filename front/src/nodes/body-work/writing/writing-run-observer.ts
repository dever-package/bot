import { isRuntimeRunTerminal } from "../../../runtime/team-run";
import { fetchSpaceRunStatus } from "../space/space-api";
import {
  watchSpaceCanvasStream,
  type SpaceStreamFrame,
} from "../space/space-stream";

type RunIdentity = {
  projectId: number;
  workAssetId: number;
  runId: number;
  requestId: string;
  running: boolean;
};
type RunStatus = NonNullable<
  Awaited<ReturnType<typeof fetchSpaceRunStatus>>
>["run"];
type Listener = {
  onFrame: (frame: SpaceStreamFrame) => void;
  onStatus: (run: RunStatus) => void;
  onEnd: () => void;
  onError: (cause: unknown) => void;
};
const observations = new Map<string, ReturnType<typeof createObservation>>();
const reconciliationInterval = 15_000;

/** 卡片和详情共享原 Run 的流及状态核对，最后一个消费者离开即释放。 */
export function observeWritingRun(identity: RunIdentity, listener: Listener) {
  const key = JSON.stringify([
    identity.projectId,
    identity.workAssetId,
    identity.runId,
    identity.requestId,
  ]);
  let observation = observations.get(key);
  if (!observation) {
    observation = createObservation(identity);
    observations.set(key, observation);
  }
  const unsubscribe = observation.subscribe(listener);
  return () => {
    unsubscribe();
    if (!observation.size) {
      observation.dispose();
      if (observations.get(key) === observation) observations.delete(key);
    }
  };
}

function createObservation(identity: RunIdentity) {
  const controller = new AbortController();
  const listeners = new Set<Listener>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let started = false;
  let ended = false;
  let checking = false;
  let checkAfterPending = false;
  let latestFrame: SpaceStreamFrame | undefined;
  let latestStatus: RunStatus;
  let lastError: unknown;
  const active = () => !controller.signal.aborted && !ended;
  const dispose = () => {
    clearTimeout(timer);
    controller.abort();
  };
  const finish = (cause?: unknown) => {
    if (!active()) return;
    ended = true;
    lastError = cause;
    dispose();
    for (const listener of listeners) {
      if (cause) listener.onError(cause);
      else listener.onEnd();
    }
  };
  const checkStatus = async () => {
    if (!active()) return;
    clearTimeout(timer);
    if (checking) {
      checkAfterPending = true;
      return;
    }
    checking = true;
    try {
      const result = await fetchSpaceRunStatus({
        projectId: identity.projectId,
        runId: identity.runId,
        requestId: identity.requestId,
        reportError: false,
      });
      if (!active()) return;
      const run = result?.run;
      if (
        !run ||
        Number(run.id) !== identity.runId ||
        String(run.request_id) !== identity.requestId
      ) {
        finish(new Error("运行状态与当前故事不匹配"));
        return;
      }
      latestStatus = run;
      for (const listener of listeners) listener.onStatus(run);
      // 以同一 Run 的终态与错误收敛，不能只看先到的终态文档。
      if (isRuntimeRunTerminal(run.status) || !identity.running) finish();
    } catch (cause) {
      if (!active()) return;
      const code = Number((cause as { code?: unknown })?.code);
      if (code === 401 || code === 403 || !identity.running) finish(cause);
      // 临时状态请求失败由仍在恢复的原 SSE 和下一轮核对接续。
    } finally {
      checking = false;
      if (active() && checkAfterPending) {
        checkAfterPending = false;
        void checkStatus();
      } else if (active())
        timer = setTimeout(checkStatus, reconciliationInterval);
    }
  };
  const start = () => {
    if (started) return;
    started = true;
    void checkStatus();
    if (!identity.running || !active()) return;
    void watchSpaceCanvasStream({
      projectId: identity.projectId,
      requestId: identity.requestId,
      signal: controller.signal,
      recoverOnError: true,
      onFrame: (frame) => {
        if (!active()) return;
        latestFrame = frame;
        for (const listener of listeners) listener.onFrame(frame);
      },
    })
      .then(() => {
        if (active()) void checkStatus();
      })
      .catch((cause) => finish(cause));
  };
  return {
    get size() {
      return listeners.size;
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      if (latestStatus) listener.onStatus(latestStatus);
      if (latestFrame) listener.onFrame(latestFrame);
      if (ended) {
        if (lastError) listener.onError(lastError);
        else listener.onEnd();
      }
      start();
      return () => listeners.delete(listener);
    },
    dispose,
  };
}
