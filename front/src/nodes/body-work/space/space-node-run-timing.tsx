import { Clock3 } from "lucide-react";
import { useSyncExternalStore } from "react";
import {
  isActiveRunningNode,
  type RunningNodeState,
} from "./space-node-runtime";
import { canvasRunTimingPresentation } from "./space-run-timing";
import { SpaceTooltip } from "./space-tooltip";
import type { CanvasNodeRunTiming } from "./types";

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

export function CanvasNodeRunTimingView({
  runTiming,
  runningNode,
  showEstimate = true,
}: {
  runTiming?: CanvasNodeRunTiming;
  runningNode?: RunningNodeState | null;
  showEstimate?: boolean;
}) {
  const active = isActiveRunningNode(runningNode);
  const timing = active
    ? { startedAt: runningNode?.startedAt || 0, finishedAt: undefined }
    : completedRunningNodeTiming(runningNode) || runTiming;
  const now = useSyncExternalStore(
    active && timing?.startedAt ? subscribeRunClock : subscribeInactiveRunClock,
    readRunClock,
    readRunClock,
  );

  if (
    !timing?.startedAt ||
    (!active && (!timing.finishedAt || timing.finishedAt < timing.startedAt))
  ) {
    return null;
  }

  const elapsedMS = Math.max(
    0,
    (active ? now : timing.finishedAt || timing.startedAt) - timing.startedAt,
  );
  const presentation = canvasRunTimingPresentation(
    elapsedMS,
    active,
    runningNode?.estimatedDurationMs,
  );
  const label = showEstimate ? presentation.tooltip : presentation.elapsed;

  return (
    <SpaceTooltip label={label} side="top" sideOffset={6}>
      <span
        className={`ws-node-run-timing${active ? " is-active" : ""}`}
        aria-label={label}
      >
        <Clock3 size={11} aria-hidden="true" />
        <span>{presentation.elapsed}</span>
      </span>
    </SpaceTooltip>
  );
}

function completedRunningNodeTiming(
  runningNode?: RunningNodeState | null,
): CanvasNodeRunTiming | undefined {
  if (!runningNode?.startedAt || !runningNode.finishedAt) {
    return undefined;
  }
  return {
    startedAt: runningNode.startedAt,
    finishedAt: runningNode.finishedAt,
  };
}
