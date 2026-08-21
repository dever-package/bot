import { X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { createPortal } from "react-dom";
import { BodyWorkTooltip } from "../shared/body-work-tooltip";
import { requestErrorMessage as errorText } from "../shared/api-response";
import { AssetBrowser } from "./asset-browser";
import { AssetUploadButton } from "./asset-upload-button";
import {
  createSequentialAssetUploadProgress,
  type AssetUploadHandler,
  type AssetUploadProgress,
} from "./asset-upload-progress";
import type {
  AssetContentMode,
  AssetFilters,
  AssetKind,
  AssetRecord,
} from "./asset-types";
import { assetLibraryKey } from "./official-material";

export function AssetPickerDialog({
  open,
  teamID,
  scopeProjectID = 0,
  title = "选择资产",
  description = "使用资产当前版本",
  initialFilters,
  allowedKinds,
  initialSelectedAssetIDs = [],
  initialSelectedAssetKeys = [],
  usedAssetIDs = [],
  usedAssetKeys = [],
  includeOfficial = true,
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
  scopeProjectID?: number;
  title?: string;
  description?: string;
  initialFilters?: Partial<AssetFilters>;
  allowedKinds?: AssetKind[];
  initialSelectedAssetIDs?: number[];
  initialSelectedAssetKeys?: string[];
  usedAssetIDs?: number[];
  usedAssetKeys?: string[];
  includeOfficial?: boolean;
  multiple?: boolean;
  maxSelection?: number;
  confirmSelection?: boolean;
  contentMode?: AssetContentMode;
  validateAsset?: (asset: AssetRecord) => string;
  uploadAccept?: string;
  onUpload?: AssetUploadHandler<AssetRecord>;
  onClose: () => void;
  onConfirm: (assets: AssetRecord[], selectedAssetKeys: string[]) => void;
}) {
  const initialSelectionKey = JSON.stringify({
    initialSelectedAssetIDs,
    initialSelectedAssetKeys,
  });
  const normalizedInitialSelection = useMemo(
    () =>
      uniqueLibraryKeys([
        ...initialSelectedAssetKeys,
        ...initialSelectedAssetIDs.map((id) => `asset:${id}`),
      ]),
    [initialSelectionKey],
  );
  const initialFilterKey = JSON.stringify(initialFilters || {});
  const normalizedInitialFilters = useMemo(
    () => JSON.parse(initialFilterKey) as Partial<AssetFilters>,
    [initialFilterKey],
  );
  const [selectedAssetKeys, setSelectedAssetKeys] = useState<string[]>(
    normalizedInitialSelection,
  );
  const [selectedAssets, setSelectedAssets] = useState<
    Map<string, AssetRecord>
  >(new Map());
  const [browserFilters, setBrowserFilters] = useState<Partial<AssetFilters>>(
    normalizedInitialFilters,
  );
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] =
    useState<AssetUploadProgress | null>(null);
  const [reloadSignal, setReloadSignal] = useState(0);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const selectionLimit = multiple ? Math.max(1, maxSelection) : 1;

  useEffect(() => {
    if (!open) return;
    setSelectedAssetKeys(normalizedInitialSelection.slice(0, selectionLimit));
    setSelectedAssets(new Map());
    setBrowserFilters(normalizedInitialFilters);
    setMessage("");
    setUploading(false);
    setUploadProgress(null);
  }, [
    normalizedInitialFilters,
    normalizedInitialSelection,
    open,
    selectionLimit,
    scopeProjectID,
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
      ? Math.max(selectionLimit - selectedAssetKeys.length, 0)
      : 1;
    if (available <= 0) {
      setMessage(`最多选择 ${selectionLimit} 项素材。`);
      return;
    }

    const filesToUpload = selectedFiles.slice(0, available);
    const progress = createSequentialAssetUploadProgress(
      filesToUpload,
      setUploadProgress,
    );
    setUploading(true);
    setUploadProgress(null);
    setMessage("");
    const uploadedAssets: AssetRecord[] = [];
    const errors: string[] = [];
    try {
      for (const [fileIndex, file] of filesToUpload.entries()) {
        progress.start(fileIndex);
        try {
          const assets = await onUpload([file], {
            onProgress: (current) =>
              progress.report(
                fileIndex,
                current.loaded,
                current.total,
                current.phase,
              ),
          });
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
        } finally {
          progress.complete(fileIndex);
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
      setUploadProgress(null);
    }
  }

  function addUploadedAssets(assets: AssetRecord[]) {
    const uniqueAssets = Array.from(
      new Map(assets.map((asset) => [assetLibraryKey(asset), asset])).values(),
    );
    setSelectedAssets((current) => {
      const next = new Map(current);
      uniqueAssets.forEach((asset) => next.set(assetLibraryKey(asset), asset));
      return next;
    });
    setSelectedAssetKeys((current) =>
      multiple
        ? uniqueLibraryKeys([
            ...current,
            ...uniqueAssets.map(assetLibraryKey),
          ]).slice(0, selectionLimit)
        : uniqueAssets[0]
          ? [assetLibraryKey(uniqueAssets[0])]
          : current,
    );
  }

  function selectAsset(asset: AssetRecord) {
    const libraryKey = assetLibraryKey(asset);
    if (
      confirmSelection &&
      multiple &&
      selectedAssetKeys.includes(libraryKey)
    ) {
      setSelectedAssetKeys((current) =>
        current.filter((key) => key !== libraryKey),
      );
      setSelectedAssets((current) => {
        const next = new Map(current);
        next.delete(libraryKey);
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
      onConfirm([asset], [libraryKey]);
      onClose();
      return;
    }

    if (!multiple) {
      setSelectedAssetKeys([libraryKey]);
      setSelectedAssets(new Map([[libraryKey, asset]]));
      return;
    }

    if (selectedAssetKeys.length >= selectionLimit) {
      setMessage(`最多选择 ${selectionLimit} 项素材。`);
      return;
    }
    setSelectedAssetKeys((current) => [...current, libraryKey]);
    setSelectedAssets((current) => new Map(current).set(libraryKey, asset));
  }

  function confirm() {
    const assets = selectedAssetKeys
      .map((key) => selectedAssets.get(key))
      .filter((asset): asset is AssetRecord => Boolean(asset));
    onConfirm(assets, selectedAssetKeys);
    onClose();
  }

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="wb-asset-reference-backdrop"
      data-slot="dialog-layer"
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
          <BodyWorkTooltip label="关闭">
            <button type="button" disabled={uploading} onClick={onClose}>
              <X aria-hidden="true" />
              <span className="sr-only">关闭</span>
            </button>
          </BodyWorkTooltip>
        </header>
        {message ? <p className="wb-asset-picker-message">{message}</p> : null}
        <AssetBrowser
          teamID={teamID}
          scopeProjectID={scopeProjectID}
          initialFilters={browserFilters}
          allowedKinds={allowedKinds}
          contentMode={contentMode}
          detailLayer="nested"
          selectable
          selectedAssetKeys={selectedAssetKeys}
          usedAssetIDs={usedAssetIDs}
          usedAssetKeys={usedAssetKeys}
          includeOfficial={includeOfficial}
          reloadSignal={reloadSignal}
          onAssetChanged={(asset) => {
            const libraryKey = assetLibraryKey(asset);
            if (selectedAssetKeys.includes(libraryKey)) {
              setSelectedAssets((current) =>
                new Map(current).set(libraryKey, asset),
              );
            }
          }}
          onAssetRemoved={(assetID) => {
            const libraryKey = `asset:${assetID}`;
            setSelectedAssetKeys((current) =>
              current.filter((key) => key !== libraryKey),
            );
            setSelectedAssets((current) => {
              const next = new Map(current);
              next.delete(libraryKey);
              return next;
            });
          }}
          headerAction={
            onUpload ? (
              <>
                <AssetUploadButton
                  uploading={uploading}
                  progress={uploadProgress}
                  onClick={() => uploadInputRef.current?.click()}
                />
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
              已选 {selectedAssetKeys.length}
              {multiple ? ` / ${selectionLimit}` : ""} 项
            </span>
            <div>
              <button type="button" onClick={onClose}>
                取消
              </button>
              <button
                type="button"
                className="is-primary"
                disabled={uploading || selectedAssetKeys.length === 0}
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

function uniqueLibraryKeys(keys: string[]) {
  return Array.from(
    new Set(
      keys
        .map((key) => String(key || "").trim())
        .filter((key) => /^(asset|material):[1-9]\d*$/.test(key)),
    ),
  );
}
