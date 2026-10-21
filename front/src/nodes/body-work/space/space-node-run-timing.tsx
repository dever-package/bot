import { Clock3 } from "lucide-react";
import { useCanvasRunClock } from "./use-canvas-run-clock";
import {
  isActiveRunningNode,
  type RunningNodeState,
} from "./space-node-runtime";
import { canvasRunTimingPresentation } from "./space-run-timing";
import { SpaceTooltip } from "./space-tooltip";
import type { CanvasNodeRunTiming } from "./types";

export function CanvasNodeRunTimingView({
  runTiming,
  runningNode,
  showEstimate = true,
  active: activeOverride,
  observed = false,
}: {
  runTiming?: CanvasNodeRunTiming;
  runningNode?: RunningNodeState | null;
  showEstimate?: boolean;
  active?: boolean;
  observed?: boolean;
}) {
  const active = activeOverride ?? isActiveRunningNode(runningNode);
  const timing =
    activeOverride !== undefined
      ? runTiming
      : active
        ? { startedAt: runningNode?.startedAt || 0, finishedAt: undefined }
        : completedRunningNodeTiming(runningNode) || runTiming;
  const now = useCanvasRunClock(Boolean(active && timing?.startedAt));

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
  const elapsed = `${observed ? "本次查看" : ""}${presentation.elapsed}`;
  const label = observed
    ? elapsed
    : showEstimate
      ? presentation.tooltip
      : elapsed;

  return (
    <SpaceTooltip label={label} side="top" sideOffset={6}>
      <span
        className={`ws-node-run-timing${active ? " is-active" : ""}`}
        aria-label={label}
      >
        <Clock3 size={11} aria-hidden="true" />
        <span>{elapsed}</span>
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
