import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  Building2,
  ChevronDown,
  FileStack,
  Gift,
  Loader2,
  Megaphone,
  MessagesSquare,
  PanelLeft,
  RefreshCw,
  Zap,
} from "lucide-react";
import { BodySiteBrand } from "../auth/site-brand";
import {
  applyBodySiteMetadata,
  useBodyLoginConfig,
} from "../auth/site-config";
import { WorkProjectPage } from "../project/project-page";
import { BodyToaster } from "../shared/body-toaster";
import "../shared/body-theme.css";
import type { AssetRecord } from "../asset/asset-types";
import { WorkbenchAssetPage } from "./asset-page";
import { WorkbenchDialoguePage } from "./dialogue-page";
import { WorkbenchFunctionPage } from "./function-page";
import {
  loadWorkbenchCatalog,
  type WorkbenchCatalog,
  type WorkbenchTeam,
} from "./workbench-api";

type WorkPageKey = "function" | "dialogue" | "works" | "assets";

const TEAM_STORAGE_KEY = "bot.body.workbench.team";
const pageItems = [
  { key: "works", label: "项目", icon: FileStack },
  { key: "dialogue", label: "对话", icon: MessagesSquare },
  { key: "function", label: "工具", icon: Zap },
  { key: "assets", label: "资产", icon: Archive },
] satisfies Array<{ key: WorkPageKey; label: string; icon: typeof Zap }>;

export function WorkHomeShell({ item }: { item?: any }) {
  const loginConfig = useBodyLoginConfig();
  const [activePage, setActivePage] = useState<WorkPageKey>(() =>
    resolveInitialPage(
      typeof item?.value === "string" ? item.value : item?.value?.page,
    ),
  );
  const [catalog, setCatalog] = useState<WorkbenchCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
        (page) =>
          page.key !== "works" ||
          !catalog ||
          catalog.projectEnabled,
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
    <main
      className={cx(
        "hb-laper-app",
        sidebarCollapsed && "is-sidebar-collapsed",
      )}
    >
      <BodyToaster />
      <WorkHomeStyles />
      <aside className="hb-laper-sidebar" aria-label="工作台导航">
        <div className="hb-laper-sidebar-head">
          <BodySiteBrand
            site={loginConfig.site}
            className="hb-laper-brand"
            logoClassName="hb-laper-brand-logo"
          />
          <button
            type="button"
            className="hb-laper-collapse"
            aria-label={sidebarCollapsed ? "展开侧栏" : "收起侧栏"}
            aria-expanded={!sidebarCollapsed}
            title={sidebarCollapsed ? "展开侧栏" : "收起侧栏"}
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
          >
            <PanelLeft size={18} strokeWidth={1.9} />
          </button>
        </div>

        <nav className="hb-laper-nav" aria-label="工作区导航">
          {navigation.map((page) => (
            <NavigationButton
              key={page.key}
              page={page}
              active={currentPage?.key === page.key}
              onClick={() => setActivePage(page.key)}
            />
          ))}
        </nav>

        <div className="hb-laper-sidebar-foot">
          <button type="button" className="hb-laper-earn">
            <Gift size={19} strokeWidth={1.9} />
            <span>赚取</span>
          </button>

          <section className="hb-laper-points" aria-label="团队工作区">
            <div className="hb-laper-points-top">
              <strong>团队工作区</strong>
              <span>{catalog?.teams.length || 0} 个团队</span>
            </div>
            <p>项目、对话、工具和资产均按当前团队隔离。</p>
            <TeamPicker
              teams={catalog?.teams || []}
              teamID={catalog?.team?.id || 0}
              disabled={loading}
              profile
              onChange={(teamID) => void loadCatalog(teamID)}
            />
          </section>

          <button type="button" className="hb-laper-update">
            <Megaphone size={18} strokeWidth={1.9} />
            <span>更新说明</span>
          </button>
        </div>
      </aside>

      <section className="hb-laper-main">
        <div className="hb-laper-frame">
          <header className="hb-laper-topbar">
            <h1>{currentPage?.label || "工作区"}</h1>
            <div className="hb-laper-mobile-team">
              <TeamPicker
                teams={catalog?.teams || []}
                teamID={catalog?.team?.id || 0}
                disabled={loading}
                compact
                onChange={(teamID) => void loadCatalog(teamID)}
              />
            </div>
          </header>

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
  page: WorkPageKey;
  catalog: WorkbenchCatalog;
  continuationAsset: AssetRecord | null;
  onContinueAsset: (asset: AssetRecord) => void;
  canContinueAsset: (asset: AssetRecord) => boolean;
  onClearContinuation: () => void;
}) {
  const teamID = catalog.team?.id || 0;
  const [visitedPages, setVisitedPages] = useState<WorkPageKey[]>([page]);

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

function NavigationButton({
  page,
  active,
  onClick,
}: {
  page: (typeof pageItems)[number];
  active: boolean;
  onClick: () => void;
}) {
  const Icon = page.icon;
  return (
    <button
      type="button"
      className={cx("hb-laper-nav-item", active && "is-active")}
      aria-label={page.label}
      title={page.label}
      onClick={onClick}
    >
      <Icon size={20} strokeWidth={1.85} />
      <span>{page.label}</span>
    </button>
  );
}

function TeamPicker({
  teams,
  teamID,
  disabled,
  compact = false,
  profile = false,
  onChange,
}: {
  teams: WorkbenchTeam[];
  teamID: number;
  disabled: boolean;
  compact?: boolean;
  profile?: boolean;
  onChange: (teamID: number) => void;
}) {
  const selectedTeam = teams.find((team) => team.id === teamID);

  if (profile) {
    return (
      <label className="hb-laper-profile">
        <span className="hb-laper-avatar">
          {(selectedTeam?.name || "团").slice(0, 1)}
        </span>
        <span className="hb-laper-profile-text">
          <strong>{selectedTeam?.name || "暂无团队"}</strong>
          <small>切换团队</small>
        </span>
        <ChevronDown size={18} strokeWidth={1.8} />
        <select
          value={teamID || ""}
          disabled={disabled || teams.length === 0}
          aria-label="切换团队"
          onChange={(event) => onChange(Number(event.target.value))}
        >
          {teams.length === 0 ? <option value="">暂无团队</option> : null}
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label
      className={
        compact
          ? "relative flex h-9 min-w-0 max-w-[240px] flex-1 items-center gap-2 rounded-md border border-[#d8ddda] bg-white px-2"
          : "relative flex h-11 w-full items-center gap-2 rounded-md border border-[#d8ddda] bg-[#f8f9f8] px-3"
      }
    >
      <Building2 className="size-4 shrink-0 text-[#66716c]" />
      <select
        value={teamID || ""}
        disabled={disabled || teams.length === 0}
        className="min-w-0 flex-1 appearance-none bg-transparent pr-5 text-sm font-medium text-[#27312c] outline-none disabled:opacity-60"
        aria-label="切换团队"
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {teams.length === 0 ? <option value="">暂无团队</option> : null}
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-3.5 text-[#78827e]" />
    </label>
  );
}

function PageLoading() {
  return (
    <div className="flex h-full items-center justify-center text-[#74807a]">
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
          className="mx-auto mt-4 inline-flex h-9 items-center gap-2 rounded-md border border-[#d7ddda] bg-white px-3 text-sm text-[#3f4a45]"
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
        <Building2 className="mx-auto mb-3 size-6 text-[#8b9691]" />
        <p className="m-0 text-sm font-medium text-[#4f5a55]">暂无已发布团队</p>
      </div>
    </div>
  );
}

function resolveInitialPage(value: unknown): WorkPageKey {
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
  current: WorkPageKey,
  catalog: WorkbenchCatalog,
): WorkPageKey {
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

function WorkHomeStyles() {
  return (
    <style>{`
      .hb-laper-app {
        --laper-bg: var(--body-work-bg);
        --laper-sidebar: var(--body-work-bg);
        --laper-surface: var(--body-work-surface);
        --laper-text: var(--body-work-text);
        --laper-muted: var(--body-work-muted);
        --laper-line: var(--body-work-line);
        --laper-active: var(--body-work-active);
        --laper-deep-blue: var(--body-work-blue);
        --laper-indigo: var(--body-work-indigo);
        position: fixed;
        inset: 0;
        z-index: 1;
        display: flex;
        width: 100vw;
        min-width: 100vw;
        height: 100vh;
        min-height: 100vh;
        overflow: hidden;
        background: var(--laper-bg);
        color: var(--laper-text);
        font-size: 12.8px;
      }

      .hb-laper-app * {
        box-sizing: border-box;
      }

      .hb-laper-sidebar {
        display: flex;
        width: 240px;
        height: 100vh;
        flex: 0 0 240px;
        flex-direction: column;
        justify-content: flex-start;
        background: var(--laper-sidebar);
        padding: 16px 8px 22px;
        transition: width 180ms ease, flex-basis 180ms ease, padding 180ms ease;
      }

      .hb-laper-sidebar-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 6px 22px 11px;
        transition: padding 180ms ease;
      }

      .hb-laper-brand {
        display: inline-flex;
        min-width: 0;
        align-items: center;
        gap: 6px;
        color: #171a19;
        font-size: 18px;
        font-weight: 700;
        line-height: 1;
      }

      .hb-laper-brand span,
      .hb-laper-nav-item span,
      .hb-laper-earn span,
      .hb-laper-update span,
      .hb-laper-points {
        transition: opacity 120ms ease, transform 120ms ease;
      }

      .hb-laper-brand-logo {
        display: block;
        width: 20px;
        height: 20px;
        flex: 0 0 20px;
        object-fit: contain;
      }

      .hb-laper-collapse,
      .hb-laper-nav-item,
      .hb-laper-earn,
      .hb-laper-update {
        appearance: none;
        border: 0;
        font: inherit;
        letter-spacing: 0;
      }

      .hb-laper-collapse {
        display: inline-flex;
        width: 26px;
        height: 26px;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        background: transparent;
        color: #6b7370;
        transition: background-color 120ms ease, color 120ms ease, transform 180ms ease;
      }

      .hb-laper-collapse svg {
        width: 14px;
        height: 14px;
      }

      .hb-laper-collapse:hover {
        background: var(--laper-active);
        color: var(--laper-text);
      }

      .hb-laper-nav {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .hb-laper-nav-item {
        position: relative;
        display: flex;
        width: 100%;
        min-height: 40px;
        cursor: pointer;
        align-items: center;
        gap: 11px;
        border-radius: 6px;
        background: transparent;
        color: var(--laper-text);
        padding: 0 13px;
        text-align: left;
        transition: background-color 120ms ease, color 120ms ease;
      }

      .hb-laper-nav-item svg {
        width: 16px;
        height: 16px;
        flex: 0 0 auto;
        color: #6b7370;
      }

      .hb-laper-nav-item span {
        min-width: 0;
        overflow: hidden;
        font-size: 12.8px;
        font-weight: 400;
        line-height: 1.2;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .hb-laper-nav-item:hover,
      .hb-laper-nav-item.is-active {
        background: var(--laper-active);
      }

      .hb-laper-nav-item.is-active span {
        font-weight: 500;
      }

      .hb-laper-sidebar-foot {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: auto;
        padding: 0 16px;
      }

      .hb-laper-earn {
        display: flex;
        height: 32px;
        cursor: pointer;
        align-items: center;
        gap: 10px;
        border-radius: 4px;
        background: #ffffff;
        color: #6b7370;
        padding: 0 11px;
        text-align: left;
        box-shadow: inset 0 0 0 1px var(--laper-line);
      }

      .hb-laper-earn svg {
        width: 15px;
        height: 15px;
      }

      .hb-laper-earn span {
        font-size: 12.8px;
        font-weight: 400;
      }

      .hb-laper-points {
        position: relative;
        overflow: hidden;
        border-radius: 14px;
        background:
          radial-gradient(circle at 14px 14px, rgba(0, 0, 0, 0.12) 0.8px, transparent 1px) 0 0 / 8px 8px,
          linear-gradient(135deg, #79ad8b 0%, #8fb79b 100%);
        padding: 14px 11px 8px;
        color: #ffffff;
        box-shadow: 0 11px 22px rgba(44, 82, 63, 0.16);
      }

      .hb-laper-points-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .hb-laper-points-top strong {
        font-size: 14px;
        font-weight: 700;
        line-height: 1;
      }

      .hb-laper-points-top span {
        display: inline-flex;
        height: 18px;
        align-items: center;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.34);
        padding: 0 11px;
        font-size: 10px;
        font-weight: 600;
      }

      .hb-laper-points p {
        margin: 11px 0;
        max-width: 176px;
        color: rgba(255, 255, 255, 0.88);
        font-size: 10.5px;
        font-weight: 600;
        line-height: 1.45;
      }

      .hb-laper-profile {
        position: relative;
        display: flex;
        width: 100%;
        height: 56px;
        cursor: pointer;
        align-items: center;
        gap: 10px;
        overflow: hidden;
        border-radius: 6px;
        background: #ffffff;
        color: var(--laper-text);
        padding: 8px 10px;
        box-shadow: 0 10px 22px rgba(37, 65, 51, 0.12);
      }

      .hb-laper-avatar {
        display: inline-flex;
        width: 39px;
        height: 39px;
        flex: 0 0 39px;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: linear-gradient(135deg, #dd236f 0%, #ef3a61 48%, #d8a930 100%);
        color: #ffffff;
        font-size: 15px;
        font-weight: 900;
      }

      .hb-laper-profile-text {
        display: flex;
        min-width: 0;
        flex: 1;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
      }

      .hb-laper-profile-text strong,
      .hb-laper-profile-text small {
        display: block;
        width: 100%;
        overflow: hidden;
        line-height: 1.1;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .hb-laper-profile-text strong {
        font-size: 12.5px;
        font-weight: 600;
      }

      .hb-laper-profile-text small {
        color: var(--laper-muted);
        font-size: 10.5px;
      }

      .hb-laper-profile svg {
        width: 14px;
        height: 14px;
        color: #5d6865;
      }

      .hb-laper-profile select {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        opacity: 0;
      }

      .hb-laper-profile select:disabled {
        cursor: default;
      }

      .hb-laper-update {
        display: flex;
        height: 27px;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        gap: 7px;
        border-radius: 6px;
        background: linear-gradient(90deg, var(--laper-deep-blue) 0%, var(--laper-indigo) 100%);
        color: #ffffff;
        font-size: 11px;
        font-weight: 700;
        box-shadow: 0 8px 14px rgba(24, 33, 122, 0.14);
      }

      .hb-laper-update svg {
        width: 14px;
        height: 14px;
      }

      .hb-laper-app.is-sidebar-collapsed .hb-laper-sidebar {
        width: 64px;
        flex-basis: 64px;
        padding: 16px 7px 18px;
      }

      .hb-laper-app.is-sidebar-collapsed .hb-laper-sidebar-head {
        justify-content: center;
        padding: 0 0 22px;
      }

      .hb-laper-app.is-sidebar-collapsed .hb-laper-brand {
        display: none;
      }

      .hb-laper-app.is-sidebar-collapsed .hb-laper-collapse {
        background: var(--laper-active);
        color: var(--laper-text);
        transform: rotate(180deg);
      }

      .hb-laper-app.is-sidebar-collapsed .hb-laper-nav {
        align-items: center;
      }

      .hb-laper-app.is-sidebar-collapsed .hb-laper-nav-item {
        width: 40px;
        min-height: 40px;
        justify-content: center;
        gap: 0;
        padding: 0;
      }

      .hb-laper-app.is-sidebar-collapsed .hb-laper-nav-item span,
      .hb-laper-app.is-sidebar-collapsed .hb-laper-earn span,
      .hb-laper-app.is-sidebar-collapsed .hb-laper-update span,
      .hb-laper-app.is-sidebar-collapsed .hb-laper-points {
        display: none;
      }

      .hb-laper-app.is-sidebar-collapsed .hb-laper-sidebar-foot {
        gap: 8px;
        padding: 0 5px;
      }

      .hb-laper-app.is-sidebar-collapsed .hb-laper-earn,
      .hb-laper-app.is-sidebar-collapsed .hb-laper-update {
        width: 40px;
        height: 40px;
        justify-content: center;
        padding: 0;
      }

      .hb-laper-app.is-sidebar-collapsed .hb-laper-update {
        background: #ffffff;
        color: #6b7370;
        box-shadow: inset 0 0 0 1px var(--laper-line);
      }

      .hb-laper-main {
        min-width: 0;
        flex: 1;
        height: 100vh;
        overflow: hidden;
        background: var(--laper-bg);
        padding: 11px 11px 11px 0;
      }

      .hb-laper-frame {
        display: flex;
        width: 100%;
        height: 100%;
        min-width: 0;
        flex-direction: column;
        overflow: hidden;
        border-radius: 6px;
        background: var(--laper-surface);
      }

      .hb-laper-topbar {
        display: flex;
        height: 38px;
        flex: 0 0 38px;
        align-items: center;
        border-bottom: 1px solid var(--laper-line);
        padding: 0 31px;
      }

      .hb-laper-topbar h1 {
        margin: 0;
        color: var(--laper-text);
        font-size: 14.5px;
        font-weight: 500;
        line-height: 1;
      }

      .hb-laper-mobile-team {
        display: none;
      }

      .hb-laper-content {
        min-height: 0;
        flex: 1;
        overflow: hidden;
        background: #ffffff;
      }

      @media (max-width: 900px) {
        .hb-laper-sidebar {
          width: 190px;
          flex-basis: 190px;
        }

        .hb-laper-points {
          overflow: visible;
          background: transparent;
          padding: 0;
          box-shadow: none;
        }

        .hb-laper-points-top,
        .hb-laper-points p {
          display: none;
        }

        .hb-laper-topbar {
          padding: 0 19px;
        }
      }

      @media (max-width: 640px) {
        .hb-laper-app {
          flex-direction: column;
        }

        .hb-laper-sidebar,
        .hb-laper-app.is-sidebar-collapsed .hb-laper-sidebar {
          order: 2;
          width: 100%;
          height: calc(58px + env(safe-area-inset-bottom));
          flex: 0 0 calc(58px + env(safe-area-inset-bottom));
          flex-direction: row;
          align-items: flex-start;
          justify-content: center;
          overflow-x: auto;
          border-top: 1px solid var(--laper-line);
          padding: 6px 8px env(safe-area-inset-bottom);
        }

        .hb-laper-sidebar-head,
        .hb-laper-sidebar-foot {
          display: none;
        }

        .hb-laper-nav,
        .hb-laper-app.is-sidebar-collapsed .hb-laper-nav {
          width: 100%;
          min-width: 0;
          flex-direction: row;
          justify-content: space-around;
          gap: 4px;
        }

        .hb-laper-nav-item,
        .hb-laper-app.is-sidebar-collapsed .hb-laper-nav-item {
          width: 64px;
          min-height: 44px;
          flex: 1 1 64px;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
          padding: 0;
        }

        .hb-laper-nav-item span,
        .hb-laper-app.is-sidebar-collapsed .hb-laper-nav-item span {
          display: block;
          width: 100%;
          font-size: 10px;
          font-weight: 500;
          text-align: center;
        }

        .hb-laper-main {
          order: 1;
          width: 100%;
          height: auto;
          min-height: 0;
          flex: 1;
          padding: 0;
        }

        .hb-laper-frame {
          border-radius: 0;
        }

        .hb-laper-topbar {
          height: 48px;
          flex-basis: 48px;
          justify-content: space-between;
          gap: 12px;
          padding: 0 12px 0 14px;
        }

        .hb-laper-topbar h1 {
          flex: 0 0 auto;
          font-size: 14px;
        }

        .hb-laper-mobile-team {
          display: flex;
          min-width: 0;
          max-width: 220px;
          flex: 1;
          justify-content: flex-end;
        }
      }
    `}</style>
  );
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
