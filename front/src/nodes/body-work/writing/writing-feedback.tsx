import { useState } from "react";
import { Square } from "lucide-react";
import { type WritingSnapshot, type WritingPreview } from "./writing-document";
import { generationTaskTitle } from "./writing-run-labels";
import { writingRetryCommand, writingActionReason } from "./writing-workspace";
import { WritingDialog } from "./writing-dialog";
import {
  WritingGenerationProgress,
  type WritingGenerationTiming,
} from "./writing-generation-progress";

export function WritingFeedback({
  snapshot,
  inline = false,
  preview,
  generationTiming,
  running,
  busy,
  readonly,
  error,
  conflicted,
  reloadDisabled,
  onReload,
  onRetry,
  onStop,
}: {
  snapshot: WritingSnapshot | null;
  inline?: boolean;
  preview?: WritingPreview | null;
  generationTiming?: WritingGenerationTiming | null;
  running: boolean;
  busy: boolean;
  readonly: boolean;
  error: string;
  conflicted: boolean;
  reloadDisabled: boolean;
  onReload: () => Promise<void>;
  onRetry: () => void;
  onStop: () => Promise<void>;
}) {
  const [confirmReload, setConfirmReload] = useState(false);
  const retry = writingRetryCommand(snapshot);
  const retryReason =
    retry && snapshot
      ? writingActionReason(snapshot.document, retry.action, retry.extra)
      : "";
  const historyPaused = snapshot?.document.status === "stopped" && Boolean(snapshot.checkpoint?.history_total && (snapshot.checkpoint.history_completed || 0) < snapshot.checkpoint.history_total);
  return (
    <div className={`writing-feedback${inline ? " is-title-status" : ""}`}>
      <WritingGenerationProgress
        snapshot={snapshot}
        preview={preview}
        running={running}
        generationTiming={generationTiming}
      >
        {running && (
          <button
            disabled={
              busy ||
              readonly ||
              !snapshot?.run_id ||
              snapshot.document.status !== "running"
            }
            onClick={() => void onStop()}
          >
            <Square size={13} />
            停止生成
          </button>
        )}
      </WritingGenerationProgress>
      {error && !conflicted && (
        <div role="alert" className="writing-error">
          <p title={error}>{error}</p>
          <button disabled={reloadDisabled} onClick={() => void onReload()}>
            刷新状态
          </button>
        </div>
      )}
      {conflicted && (
        <div role="alert" className="writing-error">
          <p>
            作品已在其他窗口更新。当前未保存内容已保留，请先复制需要保留的修改。
          </p>
          <button disabled={busy} onClick={() => setConfirmReload(true)}>
            载入最新版
          </button>
        </div>
      )}
      {confirmReload && (
        <WritingDialog
          title="载入最新版"
          closeDisabled={busy}
          onClose={() => setConfirmReload(false)}
        >
          <div className="writing-dialog-scroll">
            <p>载入最新版将放弃当前未保存修改，请先复制需要保留的内容。</p>
            <div className="writing-actions">
              <button
                disabled={busy}
                onClick={async () => {
                  await onReload();
                  setConfirmReload(false);
                }}
              >
                放弃修改并载入
              </button>
              <button disabled={busy} onClick={() => setConfirmReload(false)}>
                保留编辑
              </button>
            </div>
          </div>
        </WritingDialog>
      )}
      {snapshot && retry && (
        <div className="writing-progress">
          <span>{historyPaused ? `前文已整理 ${snapshot.checkpoint?.history_completed || 0}/${snapshot.checkpoint?.history_total}` : `${generationTaskTitle(snapshot)}未完成`}</span>
          <button
            disabled={
              busy || readonly || running || conflicted || Boolean(retryReason)
            }
            title={retryReason || undefined}
            onClick={onRetry}
          >
            {historyPaused ? "继续整理" : "重试这一步"}
          </button>
          {retryReason && <small>{retryReason}</small>}
        </div>
      )}
    </div>
  );
}
