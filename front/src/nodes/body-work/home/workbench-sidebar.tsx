import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { BodySiteBrand } from "../auth/site-brand";
import type { BodySiteConfig } from "../auth/site-config";
import type { WorkbenchTeam } from "./workbench-api";
import { WorkbenchAccountCenter } from "./workbench-account-center";
import { WorkbenchSystemMessagePanel } from "./workbench-system-message-panel";
import { WorkbenchUserMenu } from "./workbench-user-menu";

export type WorkbenchPageKey = "function" | "dialogue" | "works" | "assets";

export type WorkbenchNavigationItem = {
  key: WorkbenchPageKey;
  label: string;
  icon: LucideIcon;
};

export function WorkbenchSidebar({
  site,
  navigation,
  activePage,
  teams,
  teamID,
  loading,
  onNavigate,
  onTeamChange,
}: {
  site: BodySiteConfig;
  navigation: WorkbenchNavigationItem[];
  activePage: WorkbenchPageKey;
  teams: WorkbenchTeam[];
  teamID: number;
  loading: boolean;
  onNavigate: (page: WorkbenchPageKey) => void;
  onTeamChange: (teamID: number) => void;
}) {
  const [pointsOpen, setPointsOpen] = useState(false);

  return (
    <>
      <aside className="hb-laper-sidebar" aria-label="工作台导航">
        <div className="hb-laper-sidebar-head">
          <div className="hb-rail-brand-wrap">
            <BodySiteBrand
              site={site}
              className="hb-rail-brand"
              logoClassName="hb-rail-brand-logo"
              nameClassName="hb-rail-brand-name"
            />
            <span className="hb-rail-brand-tooltip" role="tooltip">
              {site.siteName}
            </span>
          </div>
        </div>

        <nav className="hb-laper-nav" aria-label="工作区导航">
          {navigation.map((page) => {
            const Icon = page.icon;
            return (
              <button
                key={page.key}
                type="button"
                className={`hb-laper-nav-item ${
                  activePage === page.key ? "is-active" : ""
                }`}
                aria-current={activePage === page.key ? "page" : undefined}
                title={page.label}
                onClick={() => onNavigate(page.key)}
              >
                <Icon strokeWidth={1.9} />
                <span>{page.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="hb-laper-sidebar-foot">
          <RailAction
            icon={Sparkles}
            label="积分"
            onClick={() => setPointsOpen(true)}
          />
          <WorkbenchSystemMessagePanel site={site} />
          <WorkbenchUserMenu
            teams={teams}
            teamID={teamID}
            disabled={loading}
            filing={site.filing}
            onTeamChange={onTeamChange}
          />
        </div>
      </aside>

      <WorkbenchAccountCenter open={pointsOpen} onOpenChange={setPointsOpen} />
    </>
  );
}

function RailAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="hb-rail-action"
      title={label}
      onClick={onClick}
    >
      <Icon strokeWidth={1.8} />
      <span>{label}</span>
    </button>
  );
}
