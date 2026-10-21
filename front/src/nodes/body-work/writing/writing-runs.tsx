import { useCallback, useEffect, useRef, useState } from "react";
import {
  isRuntimeRunActive,
  normalizeRuntimeRunStatus,
} from "../../../runtime/team-run";
import { fetchWritingRuns, type WritingRun } from "./writing-api";
import { formatDetailVersionTime } from "../shared/detail-dialog";

import { WritingDialog } from "./writing-dialog";
import { writingRunActionLabel } from "./writing-run-labels";

const statusLabels = {
  pending: "等待中",
  running: "运行中",
  waiting: "等待处理",
  success: "已完成",
  fail: "失败",
  canceled: "已停止",
};
export function WritingRuns({
  projectId,
  canvasId,
  workAssetId,
  activeRunId,
  busy,
  readonly,
  commandError,
  onStop,
  onClose,
}: {
  projectId: number;
  canvasId: number;
  workAssetId: number;
  activeRunId: number;
  busy: boolean;
  readonly: boolean;
  commandError?: string;
  onStop: () => Promise<void>;
  onClose: () => void;
}) {
  const [runs, setRuns] = useState<WritingRun[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stopping, setStopping] = useState(false);
  const [stopAttempted, setStopAttempted] = useState(false);
  const stopBusy = useRef(false);
  const cursor = useRef(0);
  const inFlight = useRef(false);
  const mounted = useRef(true);
  const load = useCallback(
    async (more = false) => {
      if (inFlight.current) return;
      inFlight.current = true;
      setLoading(true);
      try {
        const previousCursor = more ? cursor.current : 0;
        const result = await fetchWritingRuns({
          projectId,
          canvasId,
          workAssetId,
          beforeId: previousCursor,
        });
        if (!mounted.current) return;
        setRuns((previous) =>
          more
            ? [
                ...previous,
                ...result.items.filter(
                  (run) => !previous.some((entry) => entry.id === run.id),
                ),
              ]
            : result.items,
        );
        cursor.current = result.beforeId;
        setHasMore(
          result.hasMore &&
            result.beforeId > 0 &&
            result.beforeId !== previousCursor,
        );
        setError("");
      } catch (cause) {
        if (mounted.current)
          setError(cause instanceof Error ? cause.message : "读取运行记录失败");
      } finally {
        inFlight.current = false;
        if (mounted.current) setLoading(false);
      }
    },
    [canvasId, projectId, workAssetId],
  );
  useEffect(() => {
    mounted.current = true;
    void load();
    return () => {
      mounted.current = false;
    };
  }, [load, activeRunId]);
  const stopRun = async () => {
    if (busy || readonly || stopBusy.current) return;
    stopBusy.current = true;
    setStopping(true);
    setStopAttempted(true);
    try {
      await onStop();
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "停止运行失败");
    } finally {
      stopBusy.current = false;
      setStopping(false);
    }
  };
  const failure = error || (stopAttempted && !stopping ? commandError : "");
  return (
    <WritingDialog
      title="运行记录"
      className="writing-runs-dialog"
      closeDisabled={stopping}
      onClose={onClose}
    >
      <div className="writing-dialog-scroll">
        <div className="writing-actions">
          <button disabled={loading || stopping} onClick={() => void load()}>
            刷新
          </button>
        </div>
        {failure && (
          <p role="alert" className="writing-error">
            {failure}
          </p>
        )}
        {runs.map((run) => (
          <article key={run.id} className="writing-run-entry">
            <div className="writing-row">
              <strong>{writingRunActionLabel(run.action)}</strong>
              <span className="writing-run-status">
                {statusLabels[normalizeRuntimeRunStatus(run.status)]}
              </span>
            </div>
            <p className="writing-run-time">
              {formatDetailVersionTime(run.created_at || run.updated_at)}
            </p>
            {run.checkpoint && run.checkpoint.target > 0 && (
              <p className="writing-run-progress">
                已完成 {run.checkpoint.completed}/{run.checkpoint.target}
              </p>
            )}
            {run.instruction && (
              <p className="writing-run-instruction">{run.instruction}</p>
            )}
            {run.error && <p className="writing-error">{run.error}</p>}
            {run.id === activeRunId && isRuntimeRunActive(run.status) && (
              <button
                disabled={busy || readonly || stopping}
                onClick={() => void stopRun()}
              >
                {stopping ? "正在停止…" : "停止本次运行"}
              </button>
            )}
          </article>
        ))}
        {!runs.length && !loading && <p>暂无运行记录</p>}
        {loading && <p role="status">正在读取记录…</p>}
        {hasMore && (
          <button
            disabled={loading || stopping}
            onClick={() => void load(true)}
          >
            加载更多
          </button>
        )}
      </div>
    </WritingDialog>
  );
}
