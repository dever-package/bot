import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  Building2,
  FileStack,
  Loader2,
  MessagesSquare,
  RefreshCw,
  Zap,
} from "lucide-react";
import {
  applyBodySiteMetadata,
  useBodyLoginConfig,
} from "../auth/site-config";
import { WorkProjectPage } from "../project/project-page";
import { BodyToaster } from "../shared/body-toaster";
import "../shared/body-theme.css";
import "./workbench-appearance.css";
import type { AssetRecord } from "../asset/asset-types";
import { WorkbenchAssetPage } from "./asset-page";
import { WorkbenchDialoguePage } from "./dialogue-page";
import { WorkbenchFunctionPage } from "./function-page";
import {
  WorkbenchSidebar,
  type WorkbenchNavigationItem,
  type WorkbenchPageKey,
} from "./workbench-sidebar";
import "./workbench-sidebar.css";
import {
  loadWorkbenchCatalog,
  type WorkbenchCatalog,
} from "./workbench-api";

const TEAM_STORAGE_KEY = "bot.body.workbench.team";
const pageItems = [
  { key: "works", label: "项目", icon: FileStack },
  { key: "dialogue", label: "对话", icon: MessagesSquare },
  { key: "function", label: "工具", icon: Zap },
  { key: "assets", label: "资产", icon: Archive },
] satisfies WorkbenchNavigationItem[];

export function WorkHomeShell({ item }: { item?: any }) {
  const loginConfig = useBodyLoginConfig();
  const [activePage, setActivePage] = useState<WorkbenchPageKey>(() =>
    resolveInitialPage(
      typeof item?.value === "string" ? item.value : item?.value?.page,
    ),
  );
  const [catalog, setCatalog] = useState<WorkbenchCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [continuationAsset, setContinuationAsset] =
    useState<AssetRecord | null>(null);
  const catalogRequestRef = useRef(0);

  const loadCatalog = useCallback(async (teamID = 0) => {
    const requestID = ++catalogRequestRef.current;
    setLoading(true);
    setError("");
    try {
      const next = await loadWorkbenchCatalog(teamID);
      if (requestID !== catalogRequestRef.current) {
        return;
      }
      setCatalog(next);
      setContinuationAsset(null);
      if (next.team?.id) {
        rememberTeamID(next.team.id);
      }
      setActivePage((current) => resolveCatalogPage(current, next));
    } catch (currentError: unknown) {
      if (requestID !== catalogRequestRef.current) {
        return;
      }
      setError(
        currentError instanceof Error
          ? currentError.message
          : "加载团队工作区失败",
      );
    } finally {
      if (requestID === catalogRequestRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    applyBodySiteMetadata(loginConfig.site);
  }, [loginConfig.site]);

  useEffect(() => {
    void loadCatalog(readTeamID());
  }, [loadCatalog]);

  const navigation = useMemo(
    () =>
      pageItems.filter(
        (page) => page.key !== "works" || !catalog || catalog.projectEnabled,
      ),
    [catalog],
  );
  const currentPage =
    navigation.find((page) => page.key === activePage) || navigation[0];

  const canContinueAsset = useCallback(
    (asset: AssetRecord) =>
      asset.sourceType === "dialogue"
        ? Boolean(catalog?.roles.some((role) => role.id === asset.sourceID))
        : Boolean(catalog?.powers.some((power) => power.id === asset.sourceID)),
    [catalog?.powers, catalog?.roles],
  );

  const continueAsset = useCallback(
    (asset: AssetRecord) => {
      if (!canContinueAsset(asset)) {
        return;
      }
      setContinuationAsset(asset);
      setActivePage(
        asset.sourceType === "dialogue" ? "dialogue" : "function",
      );
    },
    [canContinueAsset],
  );
  const clearContinuation = useCallback(() => setContinuationAsset(null), []);

  return (
    <main className="hb-laper-app">
      <BodyToaster />
      <WorkbenchSidebar
        site={loginConfig.site}
        navigation={navigation}
        activePage={currentPage?.key || "assets"}
        teams={catalog?.teams || []}
        teamID={catalog?.team?.id || 0}
        loading={loading}
        onNavigate={setActivePage}
        onTeamChange={(teamID) => void loadCatalog(teamID)}
      />

      <section className="hb-laper-main">
        <div className="hb-laper-frame">
          <div className="hb-laper-content">
            {loading ? (
              <PageLoading />
            ) : error ? (
              <PageError
                message={error}
                onRetry={() => void loadCatalog(catalog?.team?.id)}
              />
            ) : !catalog?.team ? (
              <NoTeam />
            ) : (
              <PageContent
                page={currentPage?.key || "assets"}
                catalog={catalog}
                continuationAsset={continuationAsset}
                onContinueAsset={continueAsset}
                canContinueAsset={canContinueAsset}
                onClearContinuation={clearContinuation}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function PageContent({
  page,
  catalog,
  continuationAsset,
  onContinueAsset,
  canContinueAsset,
  onClearContinuation,
}: {
  page: WorkbenchPageKey;
  catalog: WorkbenchCatalog;
  continuationAsset: AssetRecord | null;
  onContinueAsset: (asset: AssetRecord) => void;
  canContinueAsset: (asset: AssetRecord) => boolean;
  onClearContinuation: () => void;
}) {
  const teamID = catalog.team?.id || 0;
  const [visitedPages, setVisitedPages] = useState<WorkbenchPageKey[]>([page]);

  useEffect(() => {
    setVisitedPages((current) =>
      current.includes(page) ? current : [...current, page],
    );
  }, [page]);

  return (
    <div className="h-full min-h-0">
      {visitedPages.includes("function") ? (
        <div className={page === "function" ? "h-full min-h-0" : "hidden"}>
          <WorkbenchFunctionPage
            teamID={teamID}
            powers={catalog.powers}
            continuationAsset={continuationAsset}
            onClearContinuation={onClearContinuation}
          />
        </div>
      ) : null}
      {visitedPages.includes("dialogue") ? (
        <div className={page === "dialogue" ? "h-full min-h-0" : "hidden"}>
          <WorkbenchDialoguePage
            teamID={teamID}
            roles={catalog.roles}
            continuationAsset={continuationAsset}
            onClearContinuation={onClearContinuation}
          />
        </div>
      ) : null}
      {page === "works" ? (
        <div className="h-full overflow-y-auto">
          <WorkProjectPage teamID={teamID} />
        </div>
      ) : null}
      {page === "assets" ? (
        <WorkbenchAssetPage
          teamID={teamID}
          onContinue={onContinueAsset}
          canContinue={canContinueAsset}
        />
      ) : null}
    </div>
  );
}

function PageLoading() {
  return (
    <div className="flex h-full items-center justify-center text-[var(--body-work-muted)]">
      <Loader2 className="size-5 animate-spin" />
    </div>
  );
}

function PageError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex h-full items-center justify-center px-6 text-center">
      <div>
        <p className="m-0 text-sm text-red-600">{message}</p>
        <button
          type="button"
          className="mx-auto mt-4 inline-flex h-9 items-center gap-2 rounded-md border border-[var(--body-work-line)] bg-[var(--body-work-surface)] px-3 text-sm text-[var(--body-work-text)]"
          onClick={onRetry}
        >
          <RefreshCw className="size-4" />
          重试
        </button>
      </div>
    </div>
  );
}

function NoTeam() {
  return (
    <div className="flex h-full items-center justify-center px-6 text-center">
      <div>
        <Building2 className="mx-auto mb-3 size-6 text-[var(--body-work-muted)]" />
        <p className="m-0 text-sm font-medium text-[var(--body-work-text)]">
          暂无已发布团队
        </p>
      </div>
    </div>
  );
}

function resolveInitialPage(value: unknown): WorkbenchPageKey {
  switch (value) {
    case "dialogue":
      return "dialogue";
    case "works":
    case "project":
      return "works";
    case "assets":
      return "assets";
    default:
      return "works";
  }
}

function resolveCatalogPage(
  current: WorkbenchPageKey,
  catalog: WorkbenchCatalog,
): WorkbenchPageKey {
  if (current !== "works" || catalog.projectEnabled) {
    return current;
  }
  if (catalog.roles.length > 0) {
    return "dialogue";
  }
  if (catalog.powers.length > 0) {
    return "function";
  }
  return "assets";
}

function readTeamID() {
  try {
    return Number(window.localStorage.getItem(TEAM_STORAGE_KEY) || 0);
  } catch {
    return 0;
  }
}

function rememberTeamID(teamID: number) {
  try {
    window.localStorage.setItem(TEAM_STORAGE_KEY, String(teamID));
  } catch {
    // 浏览器禁用本地存储时只影响团队记忆，不影响当前工作区。
  }
}
