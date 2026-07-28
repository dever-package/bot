import {
  Archive,
  ArchiveRestore,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Upload,
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
import { AssetRenameDialog } from "./asset-rename-dialog";
import { AssetSourceFilters } from "./asset-source-filters";
import { useAssetSourceLabels } from "./asset-source-labels";
import { BodyWorkTooltip } from "../shared/body-work-tooltip";
import { useAuthUserScopeKey } from "../shared/auth-scope";
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
import "./asset.css";

const emptyOptions: AssetFilterOptions = {
  projects: [],
  tools: [],
  dialogues: [],
  assetCates: [],
  nodes: [],
};

const emptyPage: AssetPage = {
  items: [],
  page: 1,
  pageSize: 24,
  total: 0,
  hasMore: false,
};

export function AssetBrowser({
  teamID,
  scopeProjectID = 0,
  initialFilters,
  selectable = false,
  excludeCollections = false,
  selectedAssetIDs,
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
  className = "",
}: {
  teamID: number;
  scopeProjectID?: number;
  initialFilters?: Partial<AssetFilters>;
  selectable?: boolean;
  excludeCollections?: boolean;
  selectedAssetIDs?: number[];
  allowedKinds?: AssetKind[];
  onSelect?: (asset: AssetRecord) => void;
  onContinue?: (asset: AssetRecord) => void;
  canContinue?: (asset: AssetRecord) => boolean;
  onAssetChanged?: (asset: AssetRecord) => void;
  onAssetRemoved?: (assetID: number) => void;
  onLocalUpload?: (files: File[]) => Promise<AssetRecord[]>;
  uploadAccept?: string;
  headerAction?: ReactNode;
  reloadSignal?: number;
  catalogOptions?: AssetCatalogOptions;
  contentMode?: AssetContentMode;
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
  const [selectedAssetID, setSelectedAssetID] = useState(0);
  const [renameTarget, setRenameTarget] = useState<AssetRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AssetRecord | null>(null);
  const [operationAssetID, setOperationAssetID] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadVersion, setReloadVersion] = useState(0);
  const loadRequestRef = useRef(0);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const rootFiltersRef = useRef<AssetFilters>(resolvedInitialFilters);
  const rootViewRef = useRef<AssetView>("assets");
  const selectedAssetIDKey = JSON.stringify(selectedAssetIDs || []);
  const selectedAssetIDSet = useMemo(
    () => new Set(JSON.parse(selectedAssetIDKey) as number[]),
    [selectedAssetIDKey],
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
    setSelectedAssetID(0);
    setRenameTarget(null);
    setDeleteTarget(null);
    setOperationAssetID(0);
    setUploading(false);
    setError("");
  }, [requestScopeKey, resolvedInitialFilters, scopeProjectID, teamID]);

  useEffect(() => {
    let active = true;
    setOptionsLoading(true);
    loadAssetFilterOptions(teamID, catalogOptions, requestScopeKey)
      .then((next) => {
        if (active) setOptions(next);
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
  }, [catalogOptions, requestScopeKey, teamID]);

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
    setFilters(next);
    if (!activeCollection) rootFiltersRef.current = next;
    setPage((current) => ({ ...current, page: 1 }));
  }

  function refresh() {
    setReloadVersion((current) => current + 1);
  }

  function openAsset(asset: AssetRecord) {
    if (asset.kind !== "collection") {
      setSelectedAssetID(asset.id);
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
    setSelectedAssetID(0);
    setError("");
  }

  function closeCollection() {
    loadRequestRef.current += 1;
    setActiveCollection(null);
    setFilters(rootFiltersRef.current);
    setView(rootViewRef.current);
    setPage(emptyPage);
    setSelectedAssetID(0);
    setError("");
  }

  function changeView(nextView: AssetView) {
    if (nextView === view || operationAssetID) return;
    loadRequestRef.current += 1;
    setView(nextView);
    if (!activeCollection) rootViewRef.current = nextView;
    setPage(emptyPage);
    setSelectedAssetID(0);
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
      if (selectedAssetID === assetID) setSelectedAssetID(0);
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
    try {
      const assets = await onLocalUpload(files);
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
      setSelectedAssetID(0);
      setError("");
      toast.success(`已上传 ${assets.length} 项资产`);
    } catch (currentError) {
      toast.error(errorText(currentError, "上传资产失败"));
    } finally {
      setUploading(false);
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
          view={view}
          collectionName={activeCollection?.name}
          onCollectionBack={activeCollection ? closeCollection : undefined}
          onChange={changeFilters}
          onViewChange={changeView}
        />
        <div className="wb-asset-browser-actions">
          <span>{loading ? "正在加载" : `${page.total} 项`}</span>
          <BodyWorkTooltip label="刷新资产">
            <button type="button" onClick={refresh}>
              <RefreshCw className={loading ? "is-spinning" : ""} />
              <span className="sr-only">刷新资产</span>
            </button>
          </BodyWorkTooltip>
          {!activeCollection && onLocalUpload ? (
            <>
              <BodyWorkTooltip label="本地上传">
                <button
                  type="button"
                  className="wb-asset-local-upload"
                  disabled={uploading}
                  onClick={() => uploadInputRef.current?.click()}
                >
                  {uploading ? (
                    <Loader2 className="is-spinning" aria-hidden="true" />
                  ) : (
                    <Upload aria-hidden="true" />
                  )}
                  <span>{uploading ? "上传中" : "本地上传"}</span>
                </button>
              </BodyWorkTooltip>
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
                    : "暂无符合条件的资产"
            }
          />
        ) : (
          <div className="wb-asset-grid">
            {page.items.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                sourceLabels={sourceLabels}
                view={view}
                selectable={
                  asset.kind !== "collection" && selectable && view === "assets"
                }
                selected={view === "assets" && selectedAssetIDSet.has(asset.id)}
                busy={operationAssetID === asset.id}
                onOpen={openAsset}
                onRename={setRenameTarget}
                onDelete={view === "assets" ? setDeleteTarget : undefined}
                onRestore={view === "trash" ? restore : undefined}
                onSelect={onSelect}
              />
            ))}
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

      {selectedAssetID ? (
        <AssetDetailDialog
          teamID={teamID}
          assetID={selectedAssetID}
          selectable={selectable && view === "assets"}
          onClose={() => setSelectedAssetID(0)}
          onSelect={
            onSelect
              ? (asset) => {
                  setSelectedAssetID(0);
                  onSelect(asset);
                }
              : undefined
          }
          onContinue={
            onContinue
              ? (asset) => {
                  setSelectedAssetID(0);
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

function errorText(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
