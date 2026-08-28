import { AlertCircle, CheckCircle2, FileInput, Loader2, X } from "lucide-react";
import { useEffect, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { BodyWorkTooltip } from "../shared/body-work-tooltip";
import type { AssetRecord, WebContentImportPlatform } from "./asset-types";
import type { WebContentImportTask } from "./web-content-import-api";
import { useWebContentImport } from "./use-web-content-import";

export function AssetImportDialog({
  open,
  teamID,
  projectID = 0,
  canvasID = 0,
  platforms,
  maxItems,
  onClose,
  onImported,
  onTaskChange,
}: {
  open: boolean;
  teamID: number;
  projectID?: number;
  canvasID?: number;
  platforms: WebContentImportPlatform[];
  maxItems: number;
  onClose: () => void;
  onImported: (
    assets: AssetRecord[],
    warnings: string[],
    task: WebContentImportTask,
  ) => void;
  onTaskChange?: (task: WebContentImportTask | null) => void;
}) {
  const importer = useWebContentImport({
    open,
    teamID,
    projectID,
    canvasID,
    onClose,
    onImported,
    onTaskChange,
  });

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      onClose();
    };
    window.addEventListener("keydown", closeOnEscape, true);
    return () => window.removeEventListener("keydown", closeOnEscape, true);
  }, [onClose, open]);

  function submit(event: FormEvent) {
    event.preventDefault();
    void importer.submit();
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="wb-asset-form-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="导入网络内容"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        className="wb-asset-form-dialog wb-asset-import-dialog"
        onSubmit={submit}
      >
        <header>
          <div>
            <span className="wb-asset-form-icon">
              <FileInput aria-hidden="true" />
            </span>
            <div>
              <h2>导入网络内容</h2>
              <p>
                支持：
                {platforms.map((platform) => platform.name).join("、") ||
                  "已配置的平台"}
              </p>
            </div>
          </div>
          <BodyWorkTooltip label="关闭">
            <button type="button" onClick={onClose}>
              <X aria-hidden="true" />
              <span className="sr-only">关闭</span>
            </button>
          </BodyWorkTooltip>
        </header>

        {importer.task ? (
          <ImportProgress
            task={importer.task}
            active={importer.active}
            platforms={platforms}
          />
        ) : (
          <label>
            <span>链接或分享内容</span>
            <textarea
              autoFocus
              value={importer.source}
              maxLength={8192}
              disabled={importer.submitting}
              placeholder="粘贴内容链接或分享文本，可一次粘贴多条"
              onChange={(event) => importer.setSource(event.target.value)}
            />
            <small className="wb-asset-import-help">
              自动识别对应平台，一次最多 {maxItems} 条，可混合粘贴
            </small>
          </label>
        )}

        {importer.error ? (
          <p className="wb-asset-form-error wb-asset-import-error">
            <AlertCircle aria-hidden="true" />
            <span>{importer.error}</span>
          </p>
        ) : null}

        <footer>
          <button type="button" onClick={onClose}>
            关闭
          </button>
          {importer.task?.status === "failed" ? (
            <button
              type="button"
              className="is-primary"
              onClick={importer.reset}
            >
              重新导入
            </button>
          ) : importer.active ? null : (
            <button
              type="submit"
              className="is-primary"
              disabled={importer.submitting || !importer.source.trim()}
            >
              {importer.submitting ? <Loader2 className="is-spinning" /> : null}
              {importer.submitting ? "提交中" : "导入"}
            </button>
          )}
        </footer>
      </form>
    </div>,
    document.body,
  );
}

function ImportProgress({
  task,
  active,
  platforms,
}: {
  task: WebContentImportTask;
  active: boolean;
  platforms: WebContentImportPlatform[];
}) {
  const progress = Math.min(100, Math.max(0, task.progress));
  const platformNames = new Map(
    platforms.map((platform) => [platform.key, platform.name]),
  );
  const completed = task.successCount + task.skippedCount;
  const summary = task.failedCount
    ? `已导入 ${completed} 项，${task.failedCount} 项失败`
    : active
      ? task.stageMessage || "正在导入"
      : `已导入 ${completed} 项`;
  return (
    <section className="wb-asset-import-status" aria-live="polite">
      <div className="wb-asset-import-status-head">
        {active ? (
          <Loader2 className="is-spinning" aria-hidden="true" />
        ) : task.status === "failed" ? (
          <AlertCircle aria-hidden="true" />
        ) : (
          <CheckCircle2 aria-hidden="true" />
        )}
        <div>
          <strong>{summary}</strong>
          <span>共 {task.itemTotal} 条内容</span>
        </div>
        <b>{progress}%</b>
      </div>
      <div
        className="wb-asset-import-progress"
        role="progressbar"
        aria-label="网页内容导入进度"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="wb-asset-import-items">
        {task.items.map((item, index) => (
          <div
            key={item.id || `${item.platform}-${index}`}
            className={item.status === "failed" ? "is-failed" : ""}
          >
            <b>{platformNames.get(item.platform) || item.platform}</b>
            <span title={item.sourceURL}>
              {item.title || item.sourceURL || `第 ${index + 1} 条内容`}
            </span>
            <em title={importItemStatus(item)}>{importItemStatus(item)}</em>
          </div>
        ))}
      </div>
    </section>
  );
}

function importItemStatus(item: WebContentImportTask["items"][number]) {
  if (item.status === "failed") return item.errorMessage || "导入失败";
  if (item.status === "success") return "已导入";
  if (item.status === "skipped") return "已存在";
  return item.stageMessage || "等待导入";
}
