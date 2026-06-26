import { useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Clock3,
  FileText,
  Film,
  Gift,
  Megaphone,
  PanelLeft,
  Plus,
  Trash2,
} from "lucide-react";
import { SiteLogo, getSiteConfig } from "@dever/front-plugin";
import { WorkProjectPage } from "../project/project-page";

type WorkPageKey = "project" | "video" | "community" | "recent" | "trash";

type PrimaryNavItem = {
  key: WorkPageKey;
  label: string;
  icon: typeof FileText;
  badge?: string;
};

const primaryNavItems: PrimaryNavItem[] = [
  { key: "recent", label: "最近", icon: Clock3 },
  { key: "project", label: "剧本项目", icon: FileText },
  { key: "video", label: "影像制作", icon: Film, badge: "BETA" },
  { key: "community", label: "社区", icon: BookOpen },
  { key: "trash", label: "回收站", icon: Trash2 },
];

const pageTitles: Record<WorkPageKey, string> = {
  project: "剧本项目",
  video: "影像制作",
  community: "社区",
  recent: "最近",
  trash: "回收站",
};

export function WorkHomeShell({ item }: { item?: any }) {
  const site = getSiteConfig();
  const pageValue =
    typeof item?.value === "string" ? item.value : item?.value?.page;
  const initialPage = resolveInitialPage(pageValue);
  const [activePage, setActivePage] = useState<WorkPageKey>(initialPage);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const content = useMemo(() => {
    if (activePage === "project" || activePage === "recent") {
      return <WorkProjectPage />;
    }
    return <ComingSoon title={pageTitles[activePage]} />;
  }, [activePage]);

  return (
    <main
      className={cx(
        "hb-laper-app",
        sidebarCollapsed && "is-sidebar-collapsed",
      )}
    >
      <WorkHomeStyles />
      <aside className="hb-laper-sidebar" aria-label="工作台导航">
        <div className="hb-laper-sidebar-head">
          <div className="hb-laper-brand" aria-label={site.name || "神创工作台"}>
            <SiteLogo className="hb-laper-brand-logo" />
            <span>{site.name || "神创工作台"}</span>
          </div>
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

        <nav className="hb-laper-nav" aria-label="工作台菜单">
          <button
            type="button"
            className="hb-laper-nav-item"
            aria-label="新建"
            title="新建"
          >
            <Plus size={19} strokeWidth={1.9} />
            <span>新建</span>
          </button>
          {primaryNavItems.map((nav) => (
            <SidebarButton
              key={nav.key}
              active={activePage === nav.key}
              item={nav}
              onClick={() => setActivePage(nav.key)}
            />
          ))}
        </nav>

        <div className="hb-laper-sidebar-foot">
          <button
            type="button"
            className="hb-laper-earn"
            aria-label="赚取"
            title="赚取"
          >
            <Gift size={19} strokeWidth={1.9} />
            <span>赚取</span>
          </button>

          <section className="hb-laper-points" aria-label="积分">
            <div className="hb-laper-points-top">
              <strong>110积分</strong>
              <span>订阅神创</span>
            </div>
            <p>在社交媒体发布神创帖子 获得最高2000积分,或3个月会员</p>
            <button type="button" className="hb-laper-profile">
              <span className="hb-laper-avatar">你</span>
              <span className="hb-laper-profile-text">
                <strong>你好</strong>
                <small>Junior</small>
              </span>
              <ChevronDown size={18} strokeWidth={1.8} />
            </button>
          </section>

          <button
            type="button"
            className="hb-laper-update"
            aria-label="更新说明"
            title="更新说明"
          >
            <Megaphone size={18} strokeWidth={1.9} />
            <span>更新说明</span>
          </button>
        </div>
      </aside>

      <section className="hb-laper-main">
        <div className="hb-laper-frame">
          <header className="hb-laper-topbar">
            <h1>{pageTitles[activePage]}</h1>
          </header>
          <div className="hb-laper-content">{content}</div>
        </div>
      </section>
    </main>
  );
}

function SidebarButton({
  active,
  item,
  onClick,
}: {
  active: boolean;
  item: PrimaryNavItem;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      className={cx("hb-laper-nav-item", active && "is-active")}
      aria-label={item.label}
      title={item.label}
      onClick={onClick}
    >
      <Icon size={20} strokeWidth={1.85} />
      <span>{item.label}</span>
      {item.badge ? <em>{item.badge}</em> : null}
    </button>
  );
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="hb-laper-placeholder">
      <h2>{title}</h2>
      <p>当前入口只完成视觉占位，功能稍后接入。</p>
    </div>
  );
}

function resolveInitialPage(value: unknown): WorkPageKey {
  return value === "video" ||
    value === "community" ||
    value === "recent" ||
    value === "trash"
    ? value
    : "project";
}

function WorkHomeStyles() {
  return (
    <style>{`
      .hb-laper-app {
        --laper-bg: #f4f6f5;
        --laper-sidebar: #f4f6f5;
        --laper-surface: #ffffff;
        --laper-text: #171a19;
        --laper-muted: #6b7370;
        --laper-faint: #9ca3a0;
        --laper-line: #e4e8e6;
        --laper-line-strong: #d2d9d6;
        --laper-active: #e4e8e6;
        --laper-primary: #1a4a35;
        --laper-green: #4a6d47;
        --laper-deep-blue: #123d66;
        --laper-indigo: #151681;
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
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans SC", "PingFang SC", sans-serif;
        font-size: 12.8px;
        letter-spacing: 0;
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
        align-items: center;
        gap: 6px;
        min-width: 0;
        color: #171a19;
        font-size: 18px;
        font-weight: 700;
        line-height: 1;
      }

      .hb-laper-brand span,
      .hb-laper-nav-item span,
      .hb-laper-nav-item em,
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
      .hb-laper-update,
      .hb-laper-profile {
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
        flex: 0 0 auto;
        width: 16px;
        height: 16px;
        color: #6b7370;
      }

      .hb-laper-nav-item span {
        min-width: 0;
        flex: 0 1 auto;
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

      .hb-laper-nav-item em {
        display: inline-flex;
        height: 13px;
        align-items: center;
        border-radius: 999px;
        background: #d2d9d6;
        color: #6b7370;
        padding: 0 7px;
        font-size: 9px;
        font-style: normal;
        font-weight: 700;
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
        margin: 11px 0 11px;
        max-width: 176px;
        color: rgba(255, 255, 255, 0.88);
        font-size: 10.5px;
        font-weight: 600;
        line-height: 1.45;
      }

      .hb-laper-profile {
        display: flex;
        width: 100%;
        height: 56px;
        cursor: pointer;
        align-items: center;
        gap: 10px;
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

      .hb-laper-profile-text strong {
        font-size: 12.5px;
        font-weight: 600;
        line-height: 1.1;
      }

      .hb-laper-profile-text small {
        color: var(--laper-muted);
        font-size: 10.5px;
        line-height: 1.1;
      }

      .hb-laper-profile svg {
        width: 14px;
        height: 14px;
        color: #5d6865;
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
        background: #e4e8e6;
        color: #171a19;
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
      .hb-laper-app.is-sidebar-collapsed .hb-laper-nav-item em,
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

      .hb-laper-content {
        min-height: 0;
        flex: 1;
        overflow: auto;
        background: #ffffff;
      }

      .hb-laper-placeholder {
        display: flex;
        height: 100%;
        min-height: 288px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #7b8783;
        text-align: center;
      }

      .hb-laper-placeholder h2 {
        margin: 0 0 6px;
        color: var(--laper-text);
        font-size: 16px;
        font-weight: 600;
      }

      .hb-laper-placeholder p {
        margin: 0;
        font-size: 11px;
      }

      @media (max-width: 900px) {
        .hb-laper-sidebar {
          width: 190px;
          flex-basis: 190px;
        }

        .hb-laper-points {
          display: none;
        }

        .hb-laper-topbar {
          padding: 0 19px;
        }
      }

      @media (max-width: 640px) {
        .hb-laper-app {
          position: fixed;
          flex-direction: column;
        }

        .hb-laper-sidebar {
          order: 2;
          width: 100%;
          height: 58px;
          flex: 0 0 58px;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          border-top: 1px solid var(--laper-line);
          padding: 6px 8px;
          overflow-x: auto;
        }

        .hb-laper-app.is-sidebar-collapsed .hb-laper-sidebar {
          width: 100%;
          height: 58px;
          flex: 0 0 58px;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          padding: 6px 8px;
        }

        .hb-laper-sidebar-head {
          display: none;
        }

        .hb-laper-sidebar-foot {
          display: none;
        }

        .hb-laper-nav {
          width: max-content;
          min-width: 100%;
          flex-direction: row;
          justify-content: space-around;
          gap: 4px;
        }

        .hb-laper-nav-item {
          width: 50px;
          min-height: 44px;
          flex: 0 0 50px;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
          padding: 0;
        }

        .hb-laper-app.is-sidebar-collapsed .hb-laper-nav-item {
          width: 50px;
          min-height: 44px;
          flex: 0 0 50px;
          flex-direction: column;
          gap: 4px;
        }

        .hb-laper-nav-item span {
          display: block;
          width: 100%;
          font-size: 10px;
          font-weight: 500;
          text-align: center;
        }

        .hb-laper-app.is-sidebar-collapsed .hb-laper-nav-item span {
          display: block;
        }

        .hb-laper-nav-item em {
          display: none;
        }

        .hb-laper-main {
          order: 1;
          width: 100%;
          height: auto;
          min-height: 0;
          flex: 1;
          padding: 0;
        }

        .hb-laper-topbar {
          height: 40px;
          flex-basis: 40px;
          padding: 0 14px;
        }
      }
    `}</style>
  );
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
