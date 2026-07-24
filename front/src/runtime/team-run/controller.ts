import { watchRuntimeStream } from "@/lib/runtime-stream-runner";
import type {
  RuntimeRunControllerOptions,
  RuntimeRunControllerResult,
} from "./types";

export async function watchRuntimeRun<TState>(
  options: RuntimeRunControllerOptions<TState>,
): Promise<RuntimeRunControllerResult<TState>> {
  let state = options.initialState;
  const watched = await watchRuntimeStream<any>({
    streamApi: options.streamApi,
    requestID: options.requestID,
    lastID: options.lastID || "0-0",
    blockMs: options.blockMs || 15000,
    signal: options.signal,
    stopOnResult: true,
    acceptErrorResult: options.acceptErrorResult,
    onFrame: (frame) => {
      state = options.reduceFrame(state, frame);
      options.onUpdate?.(state);
    },
  });
  if (!options.signal?.aborted && options.fetchSnapshot) {
    try {
      const snapshot = await options.fetchSnapshot();
      state = options.mergeSnapshot
        ? options.mergeSnapshot(state, snapshot)
        : (snapshot as TState);
      options.onUpdate?.(state);
    } catch (error) {
      if (!watched.completed) {
        throw error;
      }
    }
  }
  return {
    state,
    lastID: watched.lastID,
    completed: watched.completed,
  };
}
