import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Building2,
  Check,
  ChevronRight,
  LogOut,
  Monitor,
  Moon,
  Sun,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  resetFrontRuntimeCache,
  useAuthStore,
  useNavigate,
  useTheme,
} from "@dever/front-plugin";
import type { BodyFilingInfo } from "../auth/site-config";
import type { WorkbenchTeam } from "./workbench-api";

type MenuPanel = "team" | "theme" | null;

export function WorkbenchUserMenu({
  teams,
  teamID,
  disabled,
  filing,
  onTeamChange,
}: {
  teams: WorkbenchTeam[];
  teamID: number;
  disabled: boolean;
  filing: BodyFilingInfo;
  onTeamChange: (teamID: number) => void;
}) {
  const auth = useAuthStore((state: any) => state.auth);
  const navigate = useNavigate();
  const { resolvedTheme, setTheme, theme } = useTheme();
  const user = auth.user;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelCloseTimerRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<MenuPanel>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const selectedTeam = teams.find((team) => team.id === teamID);
  const filingRows = useMemo(() => createFilingRows(filing), [filing]);
  const roleLabel =
    Array.isArray(user?.role) && user.role.length > 0
      ? user.role.join("、")
      : "普通用户";

  const clearPanelCloseTimer = useCallback(() => {
    if (panelCloseTimerRef.current === null) {
      return;
    }
    window.clearTimeout(panelCloseTimerRef.current);
    panelCloseTimerRef.current = null;
  }, []);

  const activatePanel = useCallback(
    (panel: Exclude<MenuPanel, null>) => {
      clearPanelCloseTimer();
      setActivePanel(panel);
    },
    [clearPanelCloseTimer],
  );

  const schedulePanelClose = useCallback(() => {
    clearPanelCloseTimer();
    panelCloseTimerRef.current = window.setTimeout(() => {
      panelCloseTimerRef.current = null;
      setActivePanel(null);
    }, 180);
  }, [clearPanelCloseTimer]);

  useEffect(() => {
    if (!open) {
      clearPanelCloseTimer();
      setActivePanel(null);
      return;
    }
    const closeFromOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const closeFromEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeFromEscape);
    return () => {
      clearPanelCloseTimer();
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeFromEscape);
    };
  }, [clearPanelCloseTimer, open]);

  const signOut = () => {
    const redirect = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    setSignOutOpen(false);
    setOpen(false);
    auth.reset();
    resetFrontRuntimeCache();
    navigate({
      to: "/sign-in",
      search: { redirect },
      replace: true,
    });
  };

  return (
    <>
      <div ref={rootRef} className="hb-user-menu-root">
        <button
          type="button"
          className="hb-rail-user"
          aria-label="打开用户菜单"
          aria-expanded={open}
          title={user?.name || user?.account || "用户菜单"}
          onClick={() => setOpen((current) => !current)}
        >
          <span>{avatarText(user?.name || user?.account)}</span>
        </button>

        {open ? (
          <div className="hb-user-menu" role="menu">
            <div className="hb-user-summary">
              <span className="hb-user-summary-avatar">
                {avatarText(user?.name || user?.account)}
              </span>
              <span>
                <strong>{user?.name || "未命名用户"}</strong>
                <small>{user?.account || "暂无账号信息"}</small>
              </span>
            </div>

            <div className="hb-user-menu-list">
              <MenuButton
                icon={UserRound}
                label="个人信息"
                onClick={() => {
                  setProfileOpen(true);
                  setOpen(false);
                }}
              />
              <SubmenuButton
                icon={Building2}
                label="团队切换"
                detail={selectedTeam?.name || "暂无团队"}
                active={activePanel === "team"}
                onActivate={() => activatePanel("team")}
                onDeactivate={schedulePanelClose}
              >
                <div className="hb-user-submenu-head">
                  <strong>切换团队</strong>
                  <span>{teams.length} 个团队</span>
                </div>
                <div className="hb-user-team-list">
                  {teams.length === 0 ? (
                    <span className="hb-user-team-empty">暂无可用团队</span>
                  ) : (
                    teams.map((team) => (
                      <SubmenuChoice
                        key={team.id}
                        icon={Building2}
                        label={team.name}
                        active={team.id === teamID}
                        disabled={disabled}
                        onClick={() => onTeamChange(team.id)}
                      />
                    ))
                  )}
                </div>
              </SubmenuButton>
              <SubmenuButton
                icon={resolvedTheme === "dark" ? Moon : Sun}
                label={resolvedTheme === "dark" ? "深色模式" : "浅色模式"}
                detail="切换展示模式"
                active={activePanel === "theme"}
                onActivate={() => activatePanel("theme")}
                onDeactivate={schedulePanelClose}
              >
                <div className="hb-user-submenu-head">
                  <strong>展示模式</strong>
                </div>
                <SubmenuChoice
                  icon={Sun}
                  label="浅色"
                  active={theme === "light"}
                  onClick={() => setTheme("light")}
                />
                <SubmenuChoice
                  icon={Moon}
                  label="深色"
                  active={theme === "dark"}
                  onClick={() => setTheme("dark")}
                />
                <SubmenuChoice
                  icon={Monitor}
                  label="跟随系统"
                  active={theme === "system"}
                  onClick={() => setTheme("system")}
                />
              </SubmenuButton>
              <MenuButton
                icon={LogOut}
                label="退出"
                tone="danger"
                onClick={() => {
                  setSignOutOpen(true);
                  setOpen(false);
                }}
              />
            </div>

            {filingRows.length > 0 ? (
              <footer className="hb-user-filing">
                {filingRows.map((row) =>
                  row.url ? (
                    <a
                      key={row.key}
                      href={row.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {row.label}
                    </a>
                  ) : (
                    <span key={row.key}>{row.label}</span>
                  ),
                )}
              </footer>
            ) : null}
          </div>
        ) : null}
      </div>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>个人信息</DialogTitle>
            <DialogDescription>查看当前登录账户的基本信息。</DialogDescription>
          </DialogHeader>
          <div className="hb-profile-dialog">
            <ProfileRow label="用户名称" value={user?.name || "未设置"} />
            <ProfileRow label="登录账号" value={user?.account || "未设置"} />
            <ProfileRow label="账号角色" value={roleLabel} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={signOutOpen} onOpenChange={setSignOutOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>退出登录</DialogTitle>
            <DialogDescription>
              确认退出当前账户吗？退出后需要重新登录才能继续访问工作台。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignOutOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={signOut}>
              退出
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MenuButton({
  icon: Icon,
  label,
  tone,
  onClick,
}: {
  icon: typeof UserRound;
  label: string;
  tone?: "danger";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`hb-user-menu-item ${tone === "danger" ? "is-danger" : ""}`}
      role="menuitem"
      onClick={onClick}
    >
      <Icon />
      <span>{label}</span>
    </button>
  );
}

function SubmenuButton({
  icon: Icon,
  label,
  detail,
  active,
  onActivate,
  onDeactivate,
  children,
}: {
  icon: typeof UserRound;
  label: string;
  detail: string;
  active: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={`hb-user-submenu-shell ${active ? "is-active" : ""}`}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
    >
      <button
        type="button"
        className="hb-user-menu-item"
        role="menuitem"
        onClick={onActivate}
      >
        <Icon />
        <span>
          {label}
          <small>{detail}</small>
        </span>
        <ChevronRight className="hb-user-menu-chevron" />
      </button>
      <div className="hb-user-submenu">{children}</div>
    </div>
  );
}

function SubmenuChoice({
  icon: Icon,
  label,
  active,
  disabled = false,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`hb-submenu-choice ${active ? "is-active" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon />
      <span>{label}</span>
      {active ? <Check className="hb-submenu-choice-check" /> : null}
    </button>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function avatarText(value: unknown) {
  const text = String(value || "用").trim();
  return (text || "用").slice(0, 1).toUpperCase();
}

function createFilingRows(filing: BodyFilingInfo) {
  const rows: Array<{ key: string; label: string; url?: string }> = [];
  if (filing.businessLicenseURL) {
    rows.push({
      key: "business-license",
      label: "营业执照",
      url: filing.businessLicenseURL,
    });
  }
  if (filing.icpRecord) {
    rows.push({
      key: "icp-record",
      label: filing.icpRecord,
      url: filing.icpRecordURL,
    });
  }
  if (filing.publicSecurityRecord) {
    rows.push({
      key: "public-security-record",
      label: filing.publicSecurityRecord,
      url: filing.publicSecurityRecordURL,
    });
  }
  if (filing.companyName) {
    rows.push({ key: "company-name", label: filing.companyName });
  }
  if (filing.companyAddress) {
    rows.push({ key: "company-address", label: filing.companyAddress });
  }
  return rows;
}
