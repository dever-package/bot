import { FileInput, Loader2 } from "lucide-react";
import { BodyWorkTooltip } from "../shared/body-work-tooltip";
import type { WebContentImportTask } from "./web-content-import-api";
import { isActiveWebContentImport } from "./web-content-import-state";

export function AssetImportButton({
  disabled,
  task,
  onClick,
}: {
  disabled?: boolean;
  task?: WebContentImportTask | null;
  onClick: () => void;
}) {
  const active = isActiveWebContentImport(task);
  const progress = active ? Math.min(100, Math.max(0, task.progress)) : 0;
  const label = active ? `导入 ${progress}%` : "导入";
  return (
    <BodyWorkTooltip
      label={active ? task.stageMessage || "正在导入" : "导入网络内容"}
    >
      <button
        type="button"
        className="wb-asset-import-button"
        disabled={disabled}
        aria-busy={active}
        onClick={onClick}
      >
        {active ? (
          <Loader2 className="is-spinning" aria-hidden="true" />
        ) : (
          <FileInput aria-hidden="true" />
        )}
        <span>{label}</span>
        {active ? (
          <span
            className="wb-asset-upload-progress"
            role="progressbar"
            aria-label="网络内容导入进度"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span style={{ width: `${progress}%` }} />
          </span>
        ) : null}
      </button>
    </BodyWorkTooltip>
  );
}
