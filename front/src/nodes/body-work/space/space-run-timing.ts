import type { CanvasNodeRunTiming } from "./types";

export function normalizeCanvasNodeRunTiming(
  value: unknown,
): CanvasNodeRunTiming | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  const row = value as Record<string, unknown>;
  const startedAt = canvasRunTimestamp(row.started_at ?? row.startedAt);
  if (startedAt == null) {
    return undefined;
  }
  const finishedAt = canvasRunTimestamp(row.finished_at ?? row.finishedAt);
  return {
    startedAt,
    ...(finishedAt != null && finishedAt >= startedAt ? { finishedAt } : {}),
  };
}

export function normalizeCanvasEstimatedDuration(value: unknown) {
  const duration = Number(value);
  return Number.isFinite(duration) && duration > 0
    ? Math.round(duration)
    : undefined;
}

export function resolveCanvasActiveRunStartedAt({
  nodeRunTiming,
  runCreatedAt,
  currentStartedAt,
  now = Date.now(),
}: {
  nodeRunTiming?: CanvasNodeRunTiming;
  runCreatedAt?: unknown;
  currentStartedAt?: number;
  now?: number;
}) {
  return (
    canvasRunTimestamp(nodeRunTiming?.startedAt) ??
    canvasRunTimestamp(runCreatedAt) ??
    canvasRunTimestamp(currentStartedAt) ??
    now
  );
}

export function formatCanvasRunDuration(durationMS: number) {
  const totalSeconds = Math.max(0, Math.floor(durationMS / 1000));
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  return hours > 0
    ? `${hours}:${padDurationPart(minutes)}:${padDurationPart(seconds)}`
    : `${padDurationPart(totalMinutes)}:${padDurationPart(seconds)}`;
}

export function canvasRunTimingPresentation(
  elapsedMS: number,
  active: boolean,
  estimatedDurationValue?: unknown,
) {
  const elapsed = formatCanvasRunDuration(elapsedMS);
  if (!active) {
    return {
      elapsed: `用时 ${elapsed}`,
      estimate: "",
      tooltip: `本次运行总耗时 ${elapsed}`,
    };
  }
  const durationMS = normalizeCanvasEstimatedDuration(estimatedDurationValue);
  if (!durationMS) {
    return {
      elapsed: `已用 ${elapsed}`,
      estimate: "剩余估算中",
      tooltip: `已运行 ${elapsed}，暂无历史平均用时，无法估算剩余时间`,
    };
  }
  const estimate =
    elapsedMS >= durationMS
      ? `已超预计 ${formatCanvasRunDuration(elapsedMS - durationMS)}`
      : `剩余约 ${formatCanvasRunDuration(durationMS - elapsedMS)}`;
  return {
    elapsed: `已用 ${elapsed}`,
    estimate,
    tooltip: `已运行 ${elapsed}，历史平均约 ${formatCanvasRunDuration(durationMS)}，${estimate}`,
  };
}

function canvasRunTimestamp(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value < 1_000_000_000_000 ? value * 1000 : value;
  }
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function padDurationPart(value: number) {
  return String(value).padStart(2, "0");
}
