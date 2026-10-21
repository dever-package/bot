import { useSyncExternalStore } from "react";

const runClockListeners = new Set<() => void>();
let runClockNow = Date.now();
let runClockTimer: number | undefined;

function subscribeRunClock(listener: () => void) {
  runClockListeners.add(listener);
  if (runClockTimer == null && typeof window !== "undefined") {
    runClockNow = Date.now();
    runClockTimer = window.setInterval(() => {
      runClockNow = Date.now();
      runClockListeners.forEach((current) => current());
    }, 1000);
  }
  return () => {
    runClockListeners.delete(listener);
    if (runClockListeners.size === 0 && runClockTimer != null) {
      window.clearInterval(runClockTimer);
      runClockTimer = undefined;
    }
  };
}

function subscribeInactiveRunClock() {
  return () => undefined;
}

function readRunClock() {
  return runClockNow;
}

export function useCanvasRunClock(active: boolean) {
  return useSyncExternalStore(
    active ? subscribeRunClock : subscribeInactiveRunClock,
    readRunClock,
    readRunClock,
  );
}
