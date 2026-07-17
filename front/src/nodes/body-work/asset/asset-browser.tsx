import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { loadAssetFilterOptions, loadAssetPage } from "./asset-api";
import { AssetCard } from "./asset-card";
import { AssetDetailDialog } from "./asset-detail-dialog";
import { AssetSourceFilters } from "./asset-source-filters";
import {
  emptyAssetFilters,
  type AssetFilterOptions,
  type AssetFilters,
  type AssetKind,
  type AssetPage,
  type AssetRecord,
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
  allowedKinds,
  onSelect,
  onContinue,
  canContinue,
  headerAction,
  className = "",
}: {
  teamID: number;
  initialFilters?: Partial<AssetFilters>;
  selectable?: boolean;
  allowedKinds?: AssetKind[];
  onSelect?: (asset: AssetRecord) => void;
  onContinue?: (asset: AssetRecord) => void;
  canContinue?: (asset: AssetRecord) => boolean;
  headerAction?: ReactNode;
  className?: string;
}) {
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
  const [options, setOptions] = useState<AssetFilterOptions>(emptyOptions);
  const [page, setPage] = useState<AssetPage>(emptyPage);
  const [selectedAssetID, setSelectedAssetID] = useState(0);
  const [loading, setLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadVersion, setReloadVersion] = useState(0);
  const loadRequestRef = useRef(0);

  useEffect(() => {
    loadRequestRef.current += 1;
    setFilters(resolvedInitialFilters);
    setOptions(emptyOptions);
    setPage(emptyPage);
    setSelectedAssetID(0);
    setError("");
  }, [resolvedInitialFilters, teamID]);

  useEffect(() => {
    let active = true;
    setOptionsLoading(true);
    loadAssetFilterOptions(teamID)
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
  }, [teamID]);

  const load = useCallback(
    async (targetPage: number) => {
      const requestID = ++loadRequestRef.current;
      setLoading(true);
      setError("");
      try {
        const nextPage = await loadAssetPage({
          teamID,
          filters,
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
    [filters, teamID],
  );

  useEffect(() => {
    void load(1);
  }, [load, reloadVersion]);

  function changeFilters(next: AssetFilters) {
    setFilters(next);
    setPage((current) => ({ ...current, page: 1 }));
  }

  function refresh() {
    setReloadVersion((current) => current + 1);
  }

  return (
    <section className={`wb-asset-browser ${className}`.trim()}>
      <header className="wb-asset-browser-head">
        <AssetSourceFilters
          filters={filters}
          options={options}
          allowedKinds={normalizedAllowedKinds}
          onChange={changeFilters}
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
            icon={<Archive />}
            text={optionsLoading ? "正在读取资产配置" : "暂无符合条件的资产"}
          />
        ) : (
          <div className="wb-asset-grid">
            {page.items.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                selectable={selectable}
                onOpen={(current) => setSelectedAssetID(current.id)}
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
          selectable={selectable}
          onClose={() => setSelectedAssetID(0)}
          onSelect={onSelect}
          onContinue={
            onContinue
              ? (asset) => {
                  setSelectedAssetID(0);
                  onContinue(asset);
                }
              : undefined
          }
          canContinue={canContinue}
          onAssetChanged={() => refresh()}
        />
      ) : null}
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
  if (allowedKinds.length > 0 && !allowedKinds.includes(next.kind as AssetKind)) {
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
