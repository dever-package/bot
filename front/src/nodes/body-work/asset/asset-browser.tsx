import {
  Archive,
  ArchiveRestore,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import {
  loadAssetFilterOptions,
  loadAssetPage,
  moveAssetToTrash,
  restoreAsset,
} from "./asset-api";
import { AssetCard } from "./asset-card";
import { AssetDetailDialog } from "./asset-detail-dialog";
import { OfficialMaterialDetailDialog } from "./official-material-detail-dialog";
import { AssetRenameDialog } from "./asset-rename-dialog";
import { AssetSourceFilters } from "./asset-source-filters";
import { useAssetSourceLabels } from "./asset-source-labels";
import { AssetUploadButton } from "./asset-upload-button";
import { BodyWorkTooltip } from "../shared/body-work-tooltip";
import { useAuthUserScopeKey } from "../shared/auth-scope";
import { requestErrorMessage as errorText } from "../shared/api-response";
import type { DetailDialogLayer } from "../shared/detail-dialog";
import {
  emptyAssetFilters,
  type AssetCatalogOptions,
  type AssetContentMode,
  type AssetFilterOptions,
  type AssetFilters,
  type AssetKind,
  type AssetPage,
  type AssetRecord,
  type AssetView,
} from "./asset-types";
import { assetKindSpecs } from "./asset-contract";
import {
  assetLibraryKey,
  defaultOfficialAssetKind,
  officialCategoriesForKind,
} from "./official-material";
import type {
  AssetUploadHandler,
  AssetUploadProgress,
} from "./asset-upload-progress";
import "./asset.css";

const emptyOptions: AssetFilterOptions = {
  projects: [],
  tools: [],
  dialogues: [],
  assetCates: [],
  materialLibrary: {
    enabled: false,
    pack: { id: 0, name: "", description: "" },
    kinds: [],
    categories: [],
  },
};

const emptyPage: AssetPage = {
  items: [],
  page: 1,
  pageSize: 24,
  total: 0,
  hasMore: false,
};

const assetDeleteConfirmLayerZIndex = 10040;

export function AssetBrowser({
  teamID,
  scopeProjectID = 0,
  initialFilters,
  selectable = false,
  excludeCollections = false,
  selectedAssetIDs,
  selectedAssetKeys,
  usedAssetIDs,
  usedAssetKeys,
  includeOfficial = true,
  allowedKinds,
  onSelect,
  onContinue,
  canContinue,
  onAssetChanged,
  onAssetRemoved,
  onLocalUpload,
  uploadAccept,
  headerAction,
  reloadSignal = 0,
  catalogOptions,
  contentMode = "preview",
  detailLayer = "default",
  className = "",
}: {
  teamID: number;
  scopeProjectID?: number;
  initialFilters?: Partial<AssetFilters>;
  selectable?: boolean;
  excludeCollections?: boolean;
  selectedAssetIDs?: number[];
  selectedAssetKeys?: string[];
  usedAssetIDs?: number[];
  usedAssetKeys?: string[];
  includeOfficial?: boolean;
  allowedKinds?: AssetKind[];
  onSelect?: (asset: AssetRecord) => void;
  onContinue?: (asset: AssetRecord) => void;
  canContinue?: (asset: AssetRecord) => boolean;
  onAssetChanged?: (asset: AssetRecord) => void;
  onAssetRemoved?: (assetID: number) => void;
  onLocalUpload?: AssetUploadHandler<AssetRecord>;
  uploadAccept?: string;
  headerAction?: ReactNode;
  reloadSignal?: number;
  catalogOptions?: AssetCatalogOptions;
  contentMode?: AssetContentMode;
  detailLayer?: DetailDialogLayer;
  className?: string;
}) {
  const requestScopeKey = useAuthUserScopeKey();
  const sourceLabels = useAssetSourceLabels();
  const allowedKindKey = JSON.stringify(allowedKinds || []);
  const normalizedAllowedKinds = useMemo(
    () => normalizeAllowedKinds(allowedKinds),
    [allowedKindKey],
  );
  const initialKey = JSON.stringify({ initialFilters, normalizedAllowedKinds });
  const resolvedInitialFilters = useMemo(
    () => normalizeInitialFilters(initialFilters, normalizedAllowedKinds),
    [initialKey],
  );
  const [filters, setFilters] = useState<AssetFilters>(resolvedInitialFilters);
  const [activeCollection, setActiveCollection] = useState<AssetRecord | null>(
    null,
  );
  const [view, setView] = useState<AssetView>("assets");
  const [options, setOptions] = useState<AssetFilterOptions>(emptyOptions);
  const [page, setPage] = useState<AssetPage>(emptyPage);
  const [selectedAsset, setSelectedAsset] = useState<AssetRecord | null>(null);
  const [renameTarget, setRenameTarget] = useState<AssetRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AssetRecord | null>(null);
  const [operationAssetID, setOperationAssetID] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] =
    useState<AssetUploadProgress | null>(null);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadVersion, setReloadVersion] = useState(0);
  const loadRequestRef = useRef(0);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const rootFiltersRef = useRef<AssetFilters>(resolvedInitialFilters);
  const rootViewRef = useRef<AssetView>("assets");
  const selectedAssetKey = JSON.stringify({
    selectedAssetIDs,
    selectedAssetKeys,
  });
  const selectedAssetKeySet = useMemo(
    () =>
      new Set([
        ...(selectedAssetKeys || []),
        ...(selectedAssetIDs || []).map((id) => `asset:${id}`),
      ]),
    [selectedAssetKey],
  );
  const usedAssetKey = JSON.stringify({ usedAssetIDs, usedAssetKeys });
  const usedAssetKeySet = useMemo(
    () =>
      new Set([
        ...(usedAssetKeys || []),
        ...(usedAssetIDs || []).map((id) => `asset:${id}`),
      ]),
    [usedAssetKey],
  );

  useEffect(() => {
    loadRequestRef.current += 1;
    setFilters(resolvedInitialFilters);
    rootFiltersRef.current = resolvedInitialFilters;
    setActiveCollection(null);
    setView("assets");
    rootViewRef.current = "assets";
    setOptions(emptyOptions);
    setPage(emptyPage);
    setSelectedAsset(null);
    setRenameTarget(null);
    setDeleteTarget(null);
    setOperationAssetID(0);
    setUploading(false);
    setUploadProgress(null);
    setError("");
  }, [requestScopeKey, resolvedInitialFilters, scopeProjectID, teamID]);

  useEffect(() => {
    let active = true;
    setOptionsLoading(true);
    loadAssetFilterOptions(teamID, catalogOptions, requestScopeKey)
      .then((next) => {
        if (active) {
          setOptions(next);
          setFilters((current) => {
            const normalized = normalizeOfficialFilters(
              current,
              next,
              normalizedAllowedKinds,
              includeOfficial,
            );
            if (!activeCollection) rootFiltersRef.current = normalized;
            return normalized;
          });
        }
      })
      .catch((currentError) => {
        if (active) setError(errorText(currentError, "加载资产筛选项失败"));
      })
      .finally(() => {
        if (active) setOptionsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [
    catalogOptions,
    includeOfficial,
    normalizedAllowedKinds,
    requestScopeKey,
    teamID,
  ]);

  const load = useCallback(
    async (targetPage: number) => {
      const requestID = ++loadRequestRef.current;
      setLoading(true);
      setError("");
      try {
        const nextPage = await loadAssetPage({
          teamID,
          scopeProjectID,
          filters,
          view,
          contentMode,
          page: targetPage,
          pageSize: 24,
          collectionID: activeCollection?.id,
          excludeCollections,
          requestScopeKey,
        });
        if (requestID === loadRequestRef.current) {
          setPage(nextPage);
        }
      } catch (currentError) {
        if (requestID === loadRequestRef.current) {
          setError(errorText(currentError, "加载资产失败"));
        }
      } finally {
        if (requestID === loadRequestRef.current) {
          setLoading(false);
        }
      }
    },
    [
      activeCollection?.id,
      contentMode,
      excludeCollections,
      filters,
      requestScopeKey,
      scopeProjectID,
      teamID,
      view,
    ],
  );

  useEffect(() => {
    void load(1);
  }, [load, reloadSignal, reloadVersion]);

  function changeFilters(next: AssetFilters) {
    if (next.sourceType === "official" && view !== "assets") {
      setView("assets");
      rootViewRef.current = "assets";
    }
    setFilters(next);
    if (!activeCollection) rootFiltersRef.current = next;
    setPage((current) => ({ ...current, page: 1 }));
  }

  function refresh() {
    setReloadVersion((current) => current + 1);
  }

  function openAsset(asset: AssetRecord) {
    if (asset.kind !== "collection") {
      setSelectedAsset(asset);
      return;
    }
    rootFiltersRef.current = filters;
    rootViewRef.current = view;
    setActiveCollection(asset);
    setFilters({
      ...emptyAssetFilters,
      kind:
        filters.kind === "collection"
          ? normalizedAllowedKinds.length === 1
            ? normalizedAllowedKinds[0]
            : ""
          : filters.kind,
    });
    setPage(emptyPage);
    setSelectedAsset(null);
    setError("");
  }

  function closeCollection() {
    loadRequestRef.current += 1;
    setActiveCollection(null);
    setFilters(rootFiltersRef.current);
    setView(rootViewRef.current);
    setPage(emptyPage);
    setSelectedAsset(null);
    setError("");
  }

  function changeView(nextView: AssetView) {
    if (nextView === view || operationAssetID) return;
    loadRequestRef.current += 1;
    setView(nextView);
    if (!activeCollection) rootViewRef.current = nextView;
    setPage(emptyPage);
    setSelectedAsset(null);
    setRenameTarget(null);
    setDeleteTarget(null);
    setError("");
  }

  async function confirmDelete() {
    if (!deleteTarget || operationAssetID) return;
    const assetID = deleteTarget.id;
    setOperationAssetID(assetID);
    try {
      await moveAssetToTrash({ teamID, assetID });
      setDeleteTarget(null);
      if (
        selectedAsset?.libraryType === "asset" &&
        selectedAsset.id === assetID
      ) {
        setSelectedAsset(null);
      }
      onAssetRemoved?.(assetID);
      toast.success("资产已移入回收站");
      refresh();
    } catch (currentError) {
      toast.error(errorText(currentError, "删除资产失败"));
    } finally {
      setOperationAssetID(0);
    }
  }

  async function restore(current: AssetRecord) {
    if (operationAssetID) return;
    setOperationAssetID(current.id);
    try {
      const asset = await restoreAsset({ teamID, assetID: current.id });
      onAssetChanged?.(asset);
      toast.success("资产已恢复");
      refresh();
    } catch (currentError) {
      toast.error(errorText(currentError, "恢复资产失败"));
    } finally {
      setOperationAssetID(0);
    }
  }

  async function uploadLocalFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!onLocalUpload || files.length === 0 || uploading) return;

    setUploading(true);
    setUploadProgress(null);
    try {
      const assets = await onLocalUpload(files, {
        onProgress: setUploadProgress,
      });
      if (assets.length === 0) {
        throw new Error("上传完成，但没有生成可用资产");
      }
      assets.forEach((asset) => onAssetChanged?.(asset));
      const uploadFilters: AssetFilters = {
        ...emptyAssetFilters,
        sourceType: "upload",
        kind:
          normalizedAllowedKinds.length === 1 ? normalizedAllowedKinds[0] : "",
      };
      loadRequestRef.current += 1;
      setActiveCollection(null);
      setView("assets");
      rootViewRef.current = "assets";
      setFilters(uploadFilters);
      rootFiltersRef.current = uploadFilters;
      setPage(emptyPage);
      setSelectedAsset(null);
      setError("");
      toast.success(`已上传 ${assets.length} 项资产`);
    } catch (currentError) {
      toast.error(errorText(currentError, "上传资产失败"));
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  }

  return (
    <section className={`wb-asset-browser ${className}`.trim()}>
      <header className="wb-asset-browser-head">
        <AssetSourceFilters
          filters={filters}
          options={options}
          scopeProjectID={scopeProjectID}
          sourceLabels={sourceLabels}
          allowedKinds={normalizedAllowedKinds}
          includeOfficial={includeOfficial}
          view={view}
          collectionName={activeCollection?.name}
          onCollectionBack={activeCollection ? closeCollection : undefined}
          onChange={changeFilters}
          onViewChange={changeView}
        />
        <div className="wb-asset-browser-actions">
          <span>{loading ? "正在加载" : `${page.total} 项`}</span>
          <BodyWorkTooltip
            label={filters.sourceType === "official" ? "刷新官方素材" : "刷新资产"}
          >
            <button type="button" onClick={refresh}>
              <RefreshCw className={loading ? "is-spinning" : ""} />
              <span className="sr-only">
                {filters.sourceType === "official" ? "刷新官方素材" : "刷新资产"}
              </span>
            </button>
          </BodyWorkTooltip>
          {!activeCollection && onLocalUpload ? (
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
                multiple
                accept={uploadAccept}
                onChange={uploadLocalFiles}
              />
            </>
          ) : null}
          {!activeCollection ? headerAction : null}
        </div>
      </header>

      <div className="wb-asset-browser-body">
        {loading && page.items.length === 0 ? (
          <AssetState icon={<Loader2 className="is-spinning" />} />
        ) : error ? (
          <AssetState text={error} error />
        ) : page.items.length === 0 ? (
          <AssetState
            icon={view === "trash" ? <ArchiveRestore /> : <Archive />}
            text={
              optionsLoading
                ? "正在读取资产配置"
                : view === "trash"
                  ? "回收站为空"
                  : activeCollection
                    ? "集合内暂无符合条件的资产"
                    : filters.sourceType === "official"
                      ? "当前分类暂无官方素材"
                      : "暂无符合条件的资产"
            }
          />
        ) : (
          <div className="wb-asset-grid">
            {page.items.map((asset) => {
              const libraryKey = assetLibraryKey(asset);
              return (
                <AssetCard
                  key={libraryKey}
                  asset={asset}
                  sourceLabels={sourceLabels}
                  view={view}
                  selectable={
                    asset.kind !== "collection" &&
                    selectable &&
                    view === "assets"
                  }
                  selected={
                    view === "assets" && selectedAssetKeySet.has(libraryKey)
                  }
                  used={view === "assets" && usedAssetKeySet.has(libraryKey)}
                  busy={operationAssetID === asset.id}
                  readOnly={asset.libraryType === "material"}
                  onOpen={openAsset}
                  onRename={setRenameTarget}
                  onDelete={view === "assets" ? setDeleteTarget : undefined}
                  onRestore={view === "trash" ? restore : undefined}
                  onSelect={onSelect}
                />
              );
            })}
          </div>
        )}
      </div>

      {page.total > page.pageSize ? (
        <footer className="wb-asset-pagination">
          <BodyWorkTooltip label="上一页">
            <button
              type="button"
              disabled={page.page <= 1 || loading}
              onClick={() => void load(page.page - 1)}
            >
              <ChevronLeft />
            </button>
          </BodyWorkTooltip>
          <span>
            {page.page} / {Math.max(1, Math.ceil(page.total / page.pageSize))}
          </span>
          <BodyWorkTooltip label="下一页">
            <button
              type="button"
              disabled={!page.hasMore || loading}
              onClick={() => void load(page.page + 1)}
            >
              <ChevronRight />
            </button>
          </BodyWorkTooltip>
        </footer>
      ) : null}

      {selectedAsset?.libraryType === "asset" ? (
        <AssetDetailDialog
          teamID={teamID}
          assetID={selectedAsset.id}
          selectable={selectable && view === "assets"}
          layer={detailLayer}
          onClose={() => setSelectedAsset(null)}
          onSelect={
            onSelect
              ? (asset) => {
                  setSelectedAsset(null);
                  onSelect(asset);
                }
              : undefined
          }
          onContinue={
            onContinue
              ? (asset) => {
                  setSelectedAsset(null);
                  onContinue(asset);
                }
              : undefined
          }
          canContinue={canContinue}
          onAssetChanged={(asset) => {
            refresh();
            onAssetChanged?.(asset);
          }}
        />
      ) : null}

      {selectedAsset?.libraryType === "material" ? (
        <OfficialMaterialDetailDialog
          teamID={teamID}
          material={selectedAsset}
          selectable={selectable && view === "assets"}
          layer={detailLayer}
          onClose={() => setSelectedAsset(null)}
          onSelect={
            onSelect
              ? (material) => {
                  setSelectedAsset(null);
                  onSelect(material);
                }
              : undefined
          }
        />
      ) : null}

      <AssetRenameDialog
        teamID={teamID}
        asset={renameTarget}
        onClose={() => setRenameTarget(null)}
        onRenamed={(asset) => {
          setPage((current) => ({
            ...current,
            items: current.items.map((item) =>
              item.id === asset.id ? asset : item,
            ),
          }));
          onAssetChanged?.(asset);
          refresh();
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        layerZIndex={assetDeleteConfirmLayerZIndex}
        onOpenChange={(open) => {
          if (!open && !operationAssetID) setDeleteTarget(null);
        }}
        title="移入回收站？"
        desc={
          deleteTarget?.kind === "collection"
            ? `“${deleteTarget.name}”及集合内素材将移入回收站，你可以稍后恢复。`
            : `“${deleteTarget?.name || "该资产"}”将从资产列表移除，你可以稍后在回收站中恢复。`
        }
        confirmText="移入回收站"
        destructive
        isLoading={Boolean(operationAssetID)}
        handleConfirm={() => void confirmDelete()}
      />
    </section>
  );
}

function AssetState({
  icon,
  text = "",
  error = false,
}: {
  icon?: ReactNode;
  text?: string;
  error?: boolean;
}) {
  return (
    <div className={`wb-asset-state ${error ? "is-error" : ""}`.trim()}>
      {icon}
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function normalizeInitialFilters(
  input: Partial<AssetFilters> | undefined,
  allowedKinds: AssetKind[],
): AssetFilters {
  const next = { ...emptyAssetFilters, ...(input || {}) };
  if (
    allowedKinds.length > 0 &&
    !allowedKinds.includes(next.kind as AssetKind)
  ) {
    next.kind = allowedKinds[0];
  }
  if (next.projectID) {
    next.sourceType = "project";
    next.sourceID = next.projectID;
  }
  if (next.sourceType !== "project") {
    next.projectID = 0;
    next.assetCateID = 0;
    next.nodeKey = "";
    next.role = "";
  }
  return next;
}

function normalizeAllowedKinds(input?: AssetKind[]) {
  const selectableKinds = assetKindSpecs.filter(
    (option) => option.key !== "collection",
  );
  const allowed = selectableKinds
    .map((option) => option.key)
    .filter((kind) => input?.includes(kind));
  return allowed.length === selectableKinds.length ? [] : allowed;
}

function normalizeOfficialFilters(
  filters: AssetFilters,
  options: AssetFilterOptions,
  allowedKinds: AssetKind[],
  includeOfficial: boolean,
): AssetFilters {
  if (filters.sourceType !== "official") return filters;
  const fallbackKind = defaultOfficialAssetKind(
    options.materialLibrary,
    allowedKinds,
  );
  if (!includeOfficial || !options.materialLibrary.enabled || !fallbackKind) {
    return {
      ...emptyAssetFilters,
      kind: allowedKinds.length === 1 ? allowedKinds[0] : "",
    };
  }
  const availableKinds = new Set(
    options.materialLibrary.kinds.map((option) => option.assetKind),
  );
  const kind =
    filters.kind &&
    availableKinds.has(filters.kind) &&
    (allowedKinds.length === 0 || allowedKinds.includes(filters.kind))
      ? filters.kind
      : fallbackKind;
  const categoryIDs = new Set(
    officialCategoriesForKind(options.materialLibrary, kind).map(
      (category) => category.id,
    ),
  );
  return {
    ...filters,
    kind,
    materialCateID: categoryIDs.has(filters.materialCateID)
      ? filters.materialCateID
      : 0,
  };
}
