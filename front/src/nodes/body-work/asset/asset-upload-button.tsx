import { Loader2, Upload } from "lucide-react";
import { BodyWorkTooltip } from "../shared/body-work-tooltip";
import type { AssetUploadProgress } from "./asset-upload-progress";

export function AssetUploadButton({
  uploading,
  progress,
  onClick,
}: {
  uploading: boolean;
  progress: AssetUploadProgress | null;
  onClick: () => void;
}) {
  const label = uploadButtonLabel(uploading, progress);
  const determinate =
    uploading &&
    progress &&
    (progress.phase !== "preparing" || progress.percent > 0)
      ? progress.percent
      : null;

  return (
    <BodyWorkTooltip label={label}>
      <button
        type="button"
        className="wb-asset-local-upload"
        disabled={uploading}
        aria-busy={uploading}
        onClick={onClick}
      >
        {uploading ? (
          <Loader2 className="is-spinning" aria-hidden="true" />
        ) : (
          <Upload aria-hidden="true" />
        )}
        <span>{label}</span>
        {uploading ? (
          <span
            className={`wb-asset-upload-progress${determinate == null ? " is-indeterminate" : ""}`}
            role="progressbar"
            aria-label="上传进度"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={determinate ?? undefined}
            aria-valuetext={
              determinate == null ? "正在准备上传" : `${determinate}%`
            }
          >
            <span style={{ width: `${determinate ?? 40}%` }} />
          </span>
        ) : null}
      </button>
    </BodyWorkTooltip>
  );
}

function uploadButtonLabel(
  uploading: boolean,
  progress: AssetUploadProgress | null,
) {
  if (!uploading) return "上传";
  if (!progress) return "上传中";
  if (progress.phase === "preparing") {
    return progress.percent > 0 ? `上传中 ${progress.percent}%` : "上传中";
  }
  if (progress.phase === "saving") return "处理中";
  return `上传中 ${progress.percent}%`;
}
