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
  initialFilters,
  selectable = false,
  selectedAssetIDs,
  allowedKinds,
  onSelect,
  onContinue,
  canContinue,
  onAssetChanged,
  onAssetRemoved,
  headerAction,
  reloadSignal = 0,
  catalogOptions,
  contentMode = "preview",
  className = "",
}: {
  teamID: number;
  initialFilters?: Partial<AssetFilters>;
  selectable?: boolean;
  selectedAssetIDs?: number[];
  allowedKinds?: AssetKind[];
  onSelect?: (asset: AssetRecord) => void;
  onContinue?: (asset: AssetRecord) => void;
  canContinue?: (asset: AssetRecord) => boolean;
  onAssetChanged?: (asset: AssetRecord) => void;
  onAssetRemoved?: (assetID: number) => void;
  headerAction?: ReactNode;
  reloadSignal?: number;
  catalogOptions?: AssetCatalogOptions;
  contentMode?: AssetContentMode;
  className?: string;
}) {
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
  const [view, setView] = useState<AssetView>("assets");
  const [options, setOptions] = useState<AssetFilterOptions>(emptyOptions);
  const [page, setPage] = useState<AssetPage>(emptyPage);
  const [selectedAssetID, setSelectedAssetID] = useState(0);
  const [renameTarget, setRenameTarget] = useState<AssetRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AssetRecord | null>(null);
  const [operationAssetID, setOperationAssetID] = useState(0);
  const [loading, setLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadVersion, setReloadVersion] = useState(0);
  const loadRequestRef = useRef(0);
  const selectedAssetIDKey = JSON.stringify(selectedAssetIDs || []);
  const selectedAssetIDSet = useMemo(
    () => new Set(JSON.parse(selectedAssetIDKey) as number[]),
    [selectedAssetIDKey],
  );

  useEffect(() => {
    loadRequestRef.current += 1;
    setFilters(resolvedInitialFilters);
    setView("assets");
    setOptions(emptyOptions);
    setPage(emptyPage);
    setSelectedAssetID(0);
    setRenameTarget(null);
    setDeleteTarget(null);
    setError("");
  }, [resolvedInitialFilters, teamID]);

  useEffect(() => {
    let active = true;
    setOptionsLoading(true);
    loadAssetFilterOptions(teamID, catalogOptions)
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
  }, [catalogOptions, teamID]);

  const load = useCallback(
    async (targetPage: number) => {
      const requestID = ++loadRequestRef.current;
      setLoading(true);
      setError("");
      try {
        const nextPage = await loadAssetPage({
          teamID,
          filters,
          view,
          contentMode,
          page: targetPage,
          pageSize: 24,
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
    [contentMode, filters, teamID, view],
  );

  useEffect(() => {
    void load(1);
  }, [load, reloadSignal, reloadVersion]);

  function changeFilters(next: AssetFilters) {
    setFilters(next);
    setPage((current) => ({ ...current, page: 1 }));
  }

  function refresh() {
    setReloadVersion((current) => current + 1);
  }

  function changeView(nextView: AssetView) {
    if (nextView === view || operationAssetID) return;
    loadRequestRef.current += 1;
    setView(nextView);
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

  return (
    <section className={`wb-asset-browser ${className}`.trim()}>
      <header className="wb-asset-browser-head">
        <AssetSourceFilters
          filters={filters}
          options={options}
          sourceLabels={sourceLabels}
          allowedKinds={normalizedAllowedKinds}
          view={view}
          onChange={changeFilters}
          onViewChange={changeView}
        />
        <div className="wb-asset-browser-actions">
          <span>{loading ? "正在加载" : `${page.total} 项`}</span>
          <button type="button" onClick={refresh} title="刷新资产">
            <RefreshCw className={loading ? "is-spinning" : ""} />
            <span className="sr-only">刷新资产</span>
          </button>
          {headerAction}
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
                selectable={selectable && view === "assets"}
                selected={view === "assets" && selectedAssetIDSet.has(asset.id)}
                busy={operationAssetID === asset.id}
                onOpen={(current) => setSelectedAssetID(current.id)}
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
          <button
            type="button"
            disabled={page.page <= 1 || loading}
            onClick={() => void load(page.page - 1)}
            title="上一页"
          >
            <ChevronLeft />
          </button>
          <span>
            {page.page} / {Math.max(1, Math.ceil(page.total / page.pageSize))}
          </span>
          <button
            type="button"
            disabled={!page.hasMore || loading}
            onClick={() => void load(page.page + 1)}
            title="下一页"
          >
            <ChevronRight />
          </button>
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
        desc={`“${deleteTarget?.name || "该资产"}”将从资产列表移除，你可以稍后在回收站中恢复。`}
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
  const allowed = assetKindSpecs
    .map((option) => option.key)
    .filter((kind) => input?.includes(kind));
  return allowed.length === assetKindSpecs.length ? [] : allowed;
}

function errorText(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
