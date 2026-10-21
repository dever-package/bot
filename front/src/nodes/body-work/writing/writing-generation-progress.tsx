import { useState, type ReactNode } from "react";
import { Clock3, Loader2 } from "lucide-react";
import { useCanvasRunClock } from "../space/use-canvas-run-clock";
import { formatCanvasRunDuration } from "../space/space-run-timing";
import type { CanvasNodeRunTiming } from "../space/types";
import type { WritingSnapshot, WritingPreview } from "./writing-document";
import { generationTaskTitle } from "./writing-run-labels";
import "./writing-generation-progress.css";

export type WritingGenerationTiming = CanvasNodeRunTiming & {
  workAssetId: number;
  runId: number;
  requestId: string;
  source: "server" | "observed";
};

function GenerationClock({
  timing,
}: {
  timing?: WritingGenerationTiming | null;
}) {
  const [observedAt] = useState(Date.now);
  const now = useCanvasRunClock(true);
  const elapsed = formatCanvasRunDuration(
    Math.max(0, now - (timing?.startedAt || observedAt)),
  );
  const label =
    timing?.source === "server" ? `已用 ${elapsed}` : `本次查看已用 ${elapsed}`;
  return (
    <span className="writing-generation-clock" role="timer" aria-live="off">
      <Clock3 size={13} aria-hidden="true" />
      {label}
    </span>
  );
}

/** 只呈现已持久化 checkpoint，未完成的模型文本不会进入可编辑草稿。 */
export function WritingGenerationProgress({
  snapshot,
  running,
  generationTiming,
  children,
}: {
  snapshot: WritingSnapshot | null;
  preview?: WritingPreview | null;
  running: boolean;
  generationTiming?: WritingGenerationTiming | null;
  children?: ReactNode;
}) {
  // 画布已开始下一次提交，但新 Run 尚未返回时，不沿用上一次完成进度。
  if (running && snapshot?.document.status !== "running") snapshot = null;
  const timing =
    generationTiming &&
    generationTiming.workAssetId === snapshot?.work_asset_id &&
    generationTiming.runId === snapshot.run_id &&
    generationTiming.requestId === snapshot.request_id
      ? generationTiming
      : null;
  if (!running) return null;
  const checkpoint = snapshot?.checkpoint;
  const target = Number(checkpoint?.target) || 0;
  const completed = Math.max(
    0,
    Math.min(target, Number(checkpoint?.completed) || 0),
  );
  return (
    <div className="writing-generation-progress">
      <span
        className="writing-generation-task"
        role="status"
        title={generationTaskTitle(snapshot)}
      >
        <Loader2 size={14} className="ws-spin" aria-hidden="true" />
        <span>{generationTaskTitle(snapshot)}</span>
      </span>
      <GenerationClock
        key={`${snapshot?.work_asset_id}:${snapshot?.run_id}:${snapshot?.request_id}`}
        timing={timing}
      />
      {target > 1 && (
        <span className="writing-generation-count">
          已完成 {completed}/{target}
        </span>
      )}
      {children}
    </div>
  );
}
