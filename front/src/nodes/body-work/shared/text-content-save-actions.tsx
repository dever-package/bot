import { Copy, Loader2, RotateCcw, Save } from "lucide-react";
import type { ContentDraftStatus } from "./use-content-draft";

export function TextContentSaveActions({
  status,
  hasPendingChanges,
  onReset,
  onSaveAsNewVersion,
  onSave,
}: {
  status: ContentDraftStatus;
  hasPendingChanges: boolean;
  onReset: () => void;
  onSaveAsNewVersion: () => void;
  onSave: () => void;
}) {
  const saving = status === "saving";
  const disabled = saving || !hasPendingChanges;
  return (
    <>
      <button
        type="button"
        className="wb-detail-command"
        disabled={disabled}
        onClick={onReset}
      >
        <RotateCcw size={13} />
        <span>取消修改</span>
      </button>
      <button
        type="button"
        className="wb-detail-command"
        disabled={disabled}
        onClick={onSaveAsNewVersion}
      >
        <Copy size={13} />
        <span>保存为新版本</span>
      </button>
      <button
        type="button"
        className="wb-detail-command is-primary"
        disabled={disabled}
        onClick={onSave}
      >
        {saving ? (
          <Loader2 size={13} className="wb-detail-spin" />
        ) : (
          <Save size={13} />
        )}
        <span>{saving ? "保存中" : "保存"}</span>
      </button>
    </>
  );
}
