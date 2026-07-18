import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AssetBrowser } from "./asset-browser";
import type { AssetFilters, AssetKind, AssetRecord } from "./asset-types";

export function AssetPickerDialog({
  open,
  teamID,
  title = "选择资产",
  description = "使用资产当前版本",
  initialFilters,
  allowedKinds,
  initialSelectedAssetIDs = [],
  multiple = false,
  maxSelection = 1,
  confirmSelection = false,
  validateAsset,
  onClose,
  onConfirm,
}: {
  open: boolean;
  teamID: number;
  title?: string;
  description?: string;
  initialFilters?: Partial<AssetFilters>;
  allowedKinds?: AssetKind[];
  initialSelectedAssetIDs?: number[];
  multiple?: boolean;
  maxSelection?: number;
  confirmSelection?: boolean;
  validateAsset?: (asset: AssetRecord) => string;
  onClose: () => void;
  onConfirm: (assets: AssetRecord[], selectedAssetIDs: number[]) => void;
}) {
  const initialSelectionKey = JSON.stringify(initialSelectedAssetIDs);
  const normalizedInitialSelection = useMemo(
    () => uniquePositiveIDs(JSON.parse(initialSelectionKey) as number[]),
    [initialSelectionKey],
  );
  const [selectedAssetIDs, setSelectedAssetIDs] = useState<number[]>(
    normalizedInitialSelection,
  );
  const [selectedAssets, setSelectedAssets] = useState<Map<number, AssetRecord>>(
    new Map(),
  );
  const [message, setMessage] = useState("");
  const selectionLimit = multiple ? Math.max(1, maxSelection) : 1;

  useEffect(() => {
    if (!open) return;
    setSelectedAssetIDs(normalizedInitialSelection.slice(0, selectionLimit));
    setSelectedAssets(new Map());
    setMessage("");
  }, [normalizedInitialSelection, open, selectionLimit, teamID]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open]);

  function selectAsset(asset: AssetRecord) {
    if (
      confirmSelection &&
      multiple &&
      selectedAssetIDs.includes(asset.id)
    ) {
      setSelectedAssetIDs((current) => current.filter((id) => id !== asset.id));
      setSelectedAssets((current) => {
        const next = new Map(current);
        next.delete(asset.id);
        return next;
      });
      setMessage("");
      return;
    }

    const validationMessage = validateAsset?.(asset) || "";
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }
    setMessage("");

    if (!confirmSelection) {
      onConfirm([asset], [asset.id]);
      onClose();
      return;
    }

    if (!multiple) {
      setSelectedAssetIDs([asset.id]);
      setSelectedAssets(new Map([[asset.id, asset]]));
      return;
    }

    if (selectedAssetIDs.length >= selectionLimit) {
      setMessage(`最多选择 ${selectionLimit} 项资产。`);
      return;
    }
    setSelectedAssetIDs((current) => [...current, asset.id]);
    setSelectedAssets((current) => new Map(current).set(asset.id, asset));
  }

  function confirm() {
    const assets = selectedAssetIDs
      .map((id) => selectedAssets.get(id))
      .filter((asset): asset is AssetRecord => Boolean(asset));
    onConfirm(assets, selectedAssetIDs);
    onClose();
  }

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="wb-asset-reference-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="wb-asset-reference-dialog">
        <header>
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <button type="button" title="关闭" onClick={onClose}>
            <X aria-hidden="true" />
            <span className="sr-only">关闭</span>
          </button>
        </header>
        {message ? <p className="wb-asset-picker-message">{message}</p> : null}
        <AssetBrowser
          teamID={teamID}
          initialFilters={initialFilters}
          allowedKinds={allowedKinds}
          selectable
          selectedAssetIDs={selectedAssetIDs}
          onSelect={selectAsset}
        />
        {confirmSelection ? (
          <footer className="wb-asset-picker-footer">
            <span>
              已选 {selectedAssetIDs.length}
              {multiple ? ` / ${selectionLimit}` : ""} 项
            </span>
            <div>
              <button type="button" onClick={onClose}>
                取消
              </button>
              <button
                type="button"
                className="is-primary"
                disabled={selectedAssetIDs.length === 0}
                onClick={confirm}
              >
                确认使用
              </button>
            </div>
          </footer>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

function uniquePositiveIDs(ids: number[]) {
  return Array.from(
    new Set(ids.map(Number).filter((id) => Number.isFinite(id) && id > 0)),
  );
}
