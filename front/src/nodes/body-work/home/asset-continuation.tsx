import { RotateCcw, X } from "lucide-react";
import type { AssetRecord } from "../asset/asset-types";

export function AssetContinuationNotice({
  asset,
  action,
  onCancel,
}: {
  asset: AssetRecord;
  action: string;
  onCancel: () => void;
}) {
  return (
    <div className="flex min-h-10 shrink-0 items-center justify-between gap-3 border-b border-[#dce5e0] bg-[#f0f5f2] px-4 py-2 text-xs text-[#365447] md:px-6">
      <span className="flex min-w-0 items-center gap-2">
        <RotateCcw className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="min-w-0 truncate">
          {action}“{asset.name}”，保存后将新增版本
        </span>
      </span>
      <button
        type="button"
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border-0 bg-transparent text-[#5d6c64] hover:bg-[#dfe9e4]"
        title="取消继续编辑"
        aria-label="取消继续编辑"
        onClick={onCancel}
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
