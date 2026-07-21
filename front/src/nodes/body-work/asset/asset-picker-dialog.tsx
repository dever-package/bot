import { Loader2, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { createPortal } from "react-dom";
import { AssetBrowser } from "./asset-browser";
import type {
  AssetContentMode,
  AssetFilters,
  AssetKind,
  AssetRecord,
} from "./asset-types";

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
  contentMode = "preview",
  validateAsset,
  uploadAccept,
  onUpload,
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
  contentMode?: AssetContentMode;
  validateAsset?: (asset: AssetRecord) => string;
  uploadAccept?: string;
  onUpload?: (files: File[]) => Promise<AssetRecord[]>;
  onClose: () => void;
  onConfirm: (assets: AssetRecord[], selectedAssetIDs: number[]) => void;
}) {
  const initialSelectionKey = JSON.stringify(initialSelectedAssetIDs);
  const normalizedInitialSelection = useMemo(
    () => uniquePositiveIDs(JSON.parse(initialSelectionKey) as number[]),
    [initialSelectionKey],
  );
  const initialFilterKey = JSON.stringify(initialFilters || {});
  const normalizedInitialFilters = useMemo(
    () => JSON.parse(initialFilterKey) as Partial<AssetFilters>,
    [initialFilterKey],
  );
  const [selectedAssetIDs, setSelectedAssetIDs] = useState<number[]>(
    normalizedInitialSelection,
  );
  const [selectedAssets, setSelectedAssets] = useState<
    Map<number, AssetRecord>
  >(new Map());
  const [browserFilters, setBrowserFilters] = useState<Partial<AssetFilters>>(
    normalizedInitialFilters,
  );
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [reloadSignal, setReloadSignal] = useState(0);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const selectionLimit = multiple ? Math.max(1, maxSelection) : 1;

  useEffect(() => {
    if (!open) return;
    setSelectedAssetIDs(normalizedInitialSelection.slice(0, selectionLimit));
    setSelectedAssets(new Map());
    setBrowserFilters(normalizedInitialFilters);
    setMessage("");
    setUploading(false);
  }, [
    normalizedInitialFilters,
    normalizedInitialSelection,
    open,
    selectionLimit,
    teamID,
  ]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !uploading) onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open, uploading]);

  async function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";
    if (!onUpload || selectedFiles.length === 0 || uploading) return;

    const available = multiple
      ? Math.max(selectionLimit - selectedAssetIDs.length, 0)
      : 1;
    if (available <= 0) {
      setMessage(`最多选择 ${selectionLimit} 项资产。`);
      return;
    }

    setUploading(true);
    setMessage("");
    const uploadedAssets: AssetRecord[] = [];
    const errors: string[] = [];
    try {
      for (const file of selectedFiles.slice(0, available)) {
        try {
          const assets = await onUpload([file]);
          for (const asset of assets) {
            const validationMessage = validateAsset?.(asset) || "";
            if (validationMessage) {
              errors.push(`${file.name}：${validationMessage}`);
            } else if (asset.id > 0) {
              uploadedAssets.push(asset);
            }
          }
        } catch (error) {
          errors.push(`${file.name}：${errorText(error, "上传失败")}`);
        }
      }

      if (uploadedAssets.length > 0) {
        addUploadedAssets(uploadedAssets);
        setBrowserFilters({
          sourceType: "upload",
          kind: allowedKinds?.length === 1 ? allowedKinds[0] : "",
        });
        setReloadSignal((current) => current + 1);
      }
      setMessage(errors.join("；"));
    } finally {
      setUploading(false);
    }
  }

  function addUploadedAssets(assets: AssetRecord[]) {
    const uniqueAssets = Array.from(
      new Map(assets.map((asset) => [asset.id, asset])).values(),
    );
    setSelectedAssets((current) => {
      const next = new Map(current);
      uniqueAssets.forEach((asset) => next.set(asset.id, asset));
      return next;
    });
    setSelectedAssetIDs((current) =>
      multiple
        ? uniquePositiveIDs([
            ...current,
            ...uniqueAssets.map((asset) => asset.id),
          ]).slice(0, selectionLimit)
        : uniqueAssets[0]
          ? [uniqueAssets[0].id]
          : current,
    );
  }

  function selectAsset(asset: AssetRecord) {
    if (confirmSelection && multiple && selectedAssetIDs.includes(asset.id)) {
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
        if (event.target === event.currentTarget && !uploading) onClose();
      }}
    >
      <div className="wb-asset-reference-dialog">
        <header>
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <button
            type="button"
            title="关闭"
            disabled={uploading}
            onClick={onClose}
          >
            <X aria-hidden="true" />
            <span className="sr-only">关闭</span>
          </button>
        </header>
        {message ? <p className="wb-asset-picker-message">{message}</p> : null}
        <AssetBrowser
          teamID={teamID}
          initialFilters={browserFilters}
          allowedKinds={allowedKinds}
          contentMode={contentMode}
          selectable
          selectedAssetIDs={selectedAssetIDs}
          reloadSignal={reloadSignal}
          onAssetChanged={(asset) => {
            if (selectedAssetIDs.includes(asset.id)) {
              setSelectedAssets((current) =>
                new Map(current).set(asset.id, asset),
              );
            }
          }}
          onAssetRemoved={(assetID) => {
            setSelectedAssetIDs((current) =>
              current.filter((id) => id !== assetID),
            );
            setSelectedAssets((current) => {
              const next = new Map(current);
              next.delete(assetID);
              return next;
            });
          }}
          headerAction={
            onUpload ? (
              <>
                <button
                  type="button"
                  className="wb-asset-local-upload"
                  disabled={uploading}
                  title="本地上传"
                  onClick={() => uploadInputRef.current?.click()}
                >
                  {uploading ? (
                    <Loader2 className="is-spinning" aria-hidden="true" />
                  ) : (
                    <Upload aria-hidden="true" />
                  )}
                  <span>{uploading ? "上传中" : "本地上传"}</span>
                </button>
                <input
                  ref={uploadInputRef}
                  type="file"
                  hidden
                  multiple={multiple}
                  accept={uploadAccept}
                  onChange={uploadFiles}
                />
              </>
            ) : undefined
          }
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
                disabled={uploading || selectedAssetIDs.length === 0}
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

function errorText(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
