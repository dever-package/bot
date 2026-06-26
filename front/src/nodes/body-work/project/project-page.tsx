import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ChevronDown, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { joinSiteApi, request, useNavigate } from "@dever/front-plugin";
import { isSuccessResponse } from "../shared/api-response";

type ProjectItem = {
  id: number;
  body_id?: number;
  team_id?: number;
  release_id?: number;
  name: string;
  description?: string;
  cover?: string;
  created_at?: string;
  updated_at?: string;
  team?: {
    id?: number;
    name?: string;
    version?: number;
  };
};

type TeamItem = {
  id: number;
  name: string;
  description?: string;
  release_id?: number;
  version?: number;
  can_create?: boolean;
};

type CreateProjectPayload = {
  name: string;
  teamID: number;
  releaseID?: number;
};

const freeCanvasTeam: TeamItem = {
  id: 0,
  name: "自由画布",
  description: "不绑定团队流程和资产类型，自由添加节点创作。",
  release_id: 0,
  version: 0,
  can_create: true,
};

export function WorkProjectPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const availableTeams = useMemo(() => createTeamOptions(teams), [teams]);

  const loadWorkspace = useCallback(async () => {
    setLoading(true);
    try {
      const [projectResult, teamResult] = await Promise.all([
        request(joinSiteApi("project/list")),
        request(joinSiteApi("project/team_list")),
      ]);

      if (!isSuccessResponse(projectResult)) {
        toast.error(
          projectResult.message || projectResult.msg || "加载剧本失败",
        );
      } else {
        setProjects(toProjectItems(projectResult.data?.items));
      }

      if (!isSuccessResponse(teamResult)) {
        toast.error(teamResult.message || teamResult.msg || "加载类型失败");
      } else {
        setTeams(toTeamItems(teamResult.data?.items));
      }
    } catch {
      toast.error("加载工作台失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  return (
    <div className="hb-script-page">
      <WorkProjectStyles />

      {loading ? (
        <ProjectLoading />
      ) : (
        <ProjectGrid
          projects={projects}
          onCreate={() => setModalOpen(true)}
        />
      )}

      {modalOpen ? (
        <CreateProjectModal
          teams={availableTeams}
          onClose={() => setModalOpen(false)}
          onCreated={async () => {
            setModalOpen(false);
            await loadWorkspace();
          }}
        />
      ) : null}
    </div>
  );
}

function ProjectGrid({
  projects,
  onCreate,
}: {
  projects: ProjectItem[];
  onCreate: () => void;
}) {
  return (
    <div className="hb-script-grid">
      <CreateProjectCard onCreate={onCreate} />
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

function CreateProjectCard({ onCreate }: { onCreate: () => void }) {
  return (
    <button
      type="button"
      className="hb-script-create-card"
      onClick={onCreate}
    >
      <span className="hb-script-create-plus">
        <Plus size={20} strokeWidth={1.35} />
      </span>
      <span className="hb-script-create-title">新作品</span>
      <span className="hb-script-create-desc">撰写专业的结构化作品</span>
    </button>
  );
}

function ProjectCard({ project }: { project: ProjectItem }) {
  const navigate = useNavigate();
  const description =
    project.description?.trim() || projectTeamDescription(project);

  return (
    <button
      type="button"
      className="hb-script-card"
      onClick={() =>
        navigate({
          to: "/bot/work/space",
          search: { project_id: String(project.id) },
        })
      }
    >
      <span className="hb-script-card-binding" aria-hidden="true" />
      <span className="hb-script-card-body">
        <strong>{project.name || "未命名剧本"}</strong>
        <span>{description}</span>
      </span>
      <time>
        {formatRecentEdit(project.updated_at || project.created_at)}
      </time>
    </button>
  );
}

function ProjectLoading() {
  return (
    <div className="hb-script-grid">
      {[0, 1, 2].map((item) => (
        <div key={item} className="hb-script-skeleton">
          <span />
          <strong />
          <em />
          <small />
        </div>
      ))}
    </div>
  );
}

function CreateProjectModal({
  teams,
  onClose,
  onCreated,
}: {
  teams: TeamItem[];
  onClose: () => void;
  onCreated: () => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [teamID, setTeamID] = useState(() => String(teams[0]?.id ?? 0));
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!teamID && teams.length > 0) {
      setTeamID(String(teams[0].id));
    }
  }, [teamID, teams]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }
    const selectedTeam = teams.find((team) => String(team.id) === teamID);
    if (!name.trim()) {
      setMessage("请输入剧本标题");
      return;
    }
    if (!selectedTeam) {
      setMessage("请选择类型");
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      const result = await createProject({
        name: name.trim(),
        teamID: selectedTeam.id,
        releaseID: selectedTeam.release_id,
      });
      if (!isSuccessResponse(result)) {
        setMessage(result.message || result.msg || "创建剧本失败");
        return;
      }
      toast.success("剧本已创建");
      await onCreated();
    } finally {
      setSubmitting(false);
    }
  }

  const selectedTeam = teams.find((team) => String(team.id) === teamID);

  return (
    <div className="hb-script-modal-backdrop">
      <form className="hb-script-modal" onSubmit={submit}>
        <button
          type="button"
          className="hb-script-modal-close"
          onClick={onClose}
          aria-label="关闭"
        >
          <X size={17} strokeWidth={2.1} />
        </button>

        <header className="hb-script-modal-head">
          <h2>新建剧本</h2>
          <p>先创建一个剧本项目，后续功能会进入画布继续编辑。</p>
        </header>

        <div className="hb-script-modal-body">
          <label className="hb-script-field">
            <span>标题</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="例如：赤壁一把火"
              autoFocus
            />
          </label>

          <div className="hb-script-field">
            <span>类型</span>
            <div className="hb-script-select">
              <button
                type="button"
                className="hb-script-select-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>
                  {selectedTeam ? teamDisplayName(selectedTeam) : "自由画布"}
                </span>
                <ChevronDown
                  size={16}
                  className={dropdownOpen ? "is-open" : undefined}
                />
              </button>

              {dropdownOpen && teams.length > 0 ? (
                <>
                  <div
                    className="hb-script-select-backdrop"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="hb-script-select-options">
                    {teams.map((team) => (
                      <button
                        key={team.id}
                        type="button"
                        className={
                          String(team.id) === teamID ? "is-selected" : undefined
                        }
                        onClick={() => {
                          setTeamID(String(team.id));
                          setDropdownOpen(false);
                        }}
                      >
                        {teamDisplayName(team)}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {message ? (
            <div className="hb-script-form-error">{message}</div>
          ) : null}
        </div>

        <footer className="hb-script-modal-actions">
          <button
            type="button"
            className="hb-script-secondary"
            onClick={onClose}
          >
            取消
          </button>
          <button
            type="submit"
            className="hb-script-primary"
            disabled={submitting}
          >
            {submitting ? <Loader2 size={15} className="hb-script-spin" /> : null}
            创建
          </button>
        </footer>
      </form>
    </div>
  );
}

function WorkProjectStyles() {
  return (
    <style>{`
      .hb-script-page {
        width: 100%;
        min-height: 100%;
        background: #ffffff;
        padding: 24px 31px 51px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans SC", "PingFang SC", sans-serif;
      }

      .hb-script-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, 181px);
        gap: 22px;
        align-items: start;
        justify-content: start;
        overflow: visible;
      }

      .hb-script-create-card,
      .hb-script-card {
        position: relative;
        appearance: none;
        display: flex;
        width: 181px;
        height: 254px;
        cursor: pointer;
        flex-direction: column;
        padding: 0;
        border-radius: 3px;
        background: #ffffff;
        color: #171a19;
        font: inherit;
        letter-spacing: 0;
        text-align: left;
      }

      .hb-script-create-card {
        align-items: center;
        justify-content: center;
        border: 1.6px dashed #7f9f91;
        box-shadow: 8px 8px 0 rgba(28, 42, 36, 0.055);
        transition: border-color 140ms ease, background-color 140ms ease, box-shadow 140ms ease, transform 140ms ease;
      }

      .hb-script-create-card:hover {
        border-color: #6b8d7e;
        background: #fcfdfc;
      }

      @media (hover: hover) and (pointer: fine) {
        .hb-script-create-card:hover {
          z-index: 4;
          box-shadow:
            8px 8px 0 rgba(28, 42, 36, 0.055),
            0 10px 18px rgba(16, 24, 21, 0.055);
          transform: scale(1.018);
        }
      }

      .hb-script-create-plus {
        display: inline-flex;
        width: 22px;
        height: 22px;
        align-items: center;
        justify-content: center;
        color: #7f9a94;
        transform: translateY(-18px);
      }

      .hb-script-create-plus svg {
        width: 16px;
        height: 16px;
      }

      .hb-script-create-title {
        margin-top: -5px;
        color: #171a19;
        font-size: 12px;
        font-weight: 600;
        line-height: 1.1;
      }

      .hb-script-create-desc {
        margin-top: 10px;
        color: #6b7370;
        font-size: 10.5px;
        font-weight: 400;
        line-height: 1.2;
      }

      .hb-script-card {
        justify-content: space-between;
        isolation: isolate;
        overflow: visible;
        border: 1px solid #d2d9d6;
        box-shadow:
          2px 2px 0 rgba(6, 13, 11, 0.018),
          6px 6px 0 rgba(6, 13, 11, 0.022);
        transition: border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease;
      }

      .hb-script-card::before,
      .hb-script-card::after {
        content: "";
        position: absolute;
        inset: -1px;
        pointer-events: none;
        border: 1px solid #dce3e1;
        border-radius: 3px;
        background: #ffffff;
        opacity: 0;
        transform: translate(0, 0) rotate(0deg);
        transform-origin: 50% 88%;
        transition: opacity 130ms ease, transform 150ms ease, box-shadow 150ms ease;
      }

      .hb-script-card::before {
        z-index: -2;
      }

      .hb-script-card::after {
        z-index: -1;
      }

      @media (hover: hover) and (pointer: fine) {
        .hb-script-card:hover {
          z-index: 5;
          border-color: #cfd8d4;
          box-shadow:
            0 10px 18px rgba(16, 24, 21, 0.06),
            2px 2px 0 rgba(6, 13, 11, 0.018);
          transform: translateY(-1px);
        }

        .hb-script-card:hover::before {
          opacity: 0.86;
          box-shadow: 0 6px 12px rgba(16, 24, 21, 0.04);
          transform: translate(-4px, -4px) rotate(-1.2deg);
        }

        .hb-script-card:hover::after {
          opacity: 0.92;
          box-shadow: 0 7px 13px rgba(16, 24, 21, 0.045);
          transform: translate(5px, -6px) rotate(1.4deg);
        }
      }

      .hb-script-card:focus-visible {
        outline: 2px solid rgba(127, 159, 145, 0.7);
        outline-offset: 4px;
      }

      .hb-script-card:active {
        transform: translateY(1px);
      }

      .hb-script-card-binding {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 24px;
        width: 1px;
        border-left: 1px dashed #e4e8e6;
      }

      .hb-script-card-body {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        padding: 17px 19px 0 34px;
      }

      .hb-script-card-body strong {
        display: -webkit-box;
        overflow: hidden;
        color: #171a19;
        font-size: 16px;
        font-weight: 700;
        line-height: 1.32;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .hb-script-card-body span {
        display: -webkit-box;
        max-width: 114px;
        margin-top: 10px;
        overflow: hidden;
        color: #5f6865;
        font-size: 10.5px;
        font-weight: 400;
        line-height: 1.5;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .hb-script-card time {
        position: relative;
        z-index: 1;
        display: block;
        padding: 0 19px 18px 34px;
        color: #9ca3a0;
        font-size: 9.6px;
        font-weight: 400;
        line-height: 1.2;
      }

      .hb-script-skeleton {
        position: relative;
        width: 181px;
        height: 254px;
        overflow: hidden;
        border: 1px solid #d2d9d6;
        border-radius: 3px;
        background: #ffffff;
        box-shadow:
          2px 2px 0 rgba(6, 13, 11, 0.02),
          6px 6px 0 rgba(6, 13, 11, 0.022);
      }

      .hb-script-skeleton::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, transparent 0%, rgba(244, 246, 245, 0.9) 45%, transparent 75%);
        animation: hb-script-shimmer 1.1s linear infinite;
        transform: translateX(-100%);
      }

      .hb-script-skeleton span,
      .hb-script-skeleton strong,
      .hb-script-skeleton em,
      .hb-script-skeleton small {
        position: absolute;
        display: block;
        border-radius: 999px;
        background: #f4f6f5;
      }

      .hb-script-skeleton span {
        top: 21px;
        left: 34px;
        width: 106px;
        height: 16px;
      }

      .hb-script-skeleton strong {
        top: 46px;
        left: 34px;
        width: 74px;
        height: 13px;
      }

      .hb-script-skeleton em {
        top: 77px;
        left: 34px;
        width: 110px;
        height: 10px;
      }

      .hb-script-skeleton small {
        bottom: 19px;
        left: 34px;
        width: 70px;
        height: 10px;
      }

      .hb-script-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(15, 23, 42, 0.18);
        padding: 24px;
        backdrop-filter: blur(3px);
      }

      .hb-script-modal {
        position: relative;
        width: min(460px, 100%);
        overflow: visible;
        border: 1px solid #dce3e1;
        border-radius: 8px;
        background: #ffffff;
        box-shadow: 0 24px 70px rgba(16, 24, 21, 0.18);
      }

      .hb-script-modal-close {
        position: absolute;
        top: 12px;
        right: 12px;
        display: inline-flex;
        width: 30px;
        height: 30px;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: #7b8783;
      }

      .hb-script-modal-close:hover {
        background: #f0f3f2;
        color: #101817;
      }

      .hb-script-modal-head {
        padding: 28px 30px 14px;
      }

      .hb-script-modal-head h2 {
        margin: 0;
        color: #101817;
        font-size: 18px;
        font-weight: 700;
        line-height: 1.2;
      }

      .hb-script-modal-head p {
        margin: 8px 0 0;
        color: #6f7b78;
        font-size: 13px;
        line-height: 1.5;
      }

      .hb-script-modal-body {
        display: grid;
        gap: 15px;
        padding: 8px 30px 20px;
      }

      .hb-script-field {
        display: grid;
        gap: 8px;
      }

      .hb-script-field > span {
        color: #4e5a56;
        font-size: 13px;
        font-weight: 650;
      }

      .hb-script-field input,
      .hb-script-select-trigger {
        width: 100%;
        height: 42px;
        border: 1px solid #dce3e1;
        border-radius: 6px;
        background: #fbfcfc;
        color: #101817;
        font: inherit;
        font-size: 14px;
        outline: none;
      }

      .hb-script-field input {
        padding: 0 13px;
      }

      .hb-script-field input:focus,
      .hb-script-select-trigger:focus {
        border-color: #95a8a1;
        background: #ffffff;
      }

      .hb-script-select {
        position: relative;
      }

      .hb-script-select-trigger {
        display: flex;
        cursor: pointer;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 0 12px;
        text-align: left;
      }

      .hb-script-select-trigger span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .hb-script-select-trigger svg {
        color: #6f7b78;
        transition: transform 120ms ease;
      }

      .hb-script-select-trigger svg.is-open {
        transform: rotate(180deg);
      }

      .hb-script-select-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1010;
        background: transparent;
      }

      .hb-script-select-options {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        z-index: 1020;
        display: grid;
        gap: 3px;
        max-height: 220px;
        overflow: auto;
        border: 1px solid #dce3e1;
        border-radius: 6px;
        background: #ffffff;
        padding: 5px;
        box-shadow: 0 14px 34px rgba(16, 24, 21, 0.12);
      }

      .hb-script-select-options button {
        height: 34px;
        cursor: pointer;
        border: 0;
        border-radius: 5px;
        background: transparent;
        color: #101817;
        font: inherit;
        font-size: 13px;
        text-align: left;
        padding: 0 10px;
      }

      .hb-script-select-options button:hover,
      .hb-script-select-options button.is-selected {
        background: #eef3f1;
      }

      .hb-script-form-error {
        border-radius: 6px;
        background: #fff1f0;
        color: #b42318;
        padding: 10px 12px;
        font-size: 13px;
      }

      .hb-script-modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding: 0 30px 28px;
      }

      .hb-script-secondary,
      .hb-script-primary {
        display: inline-flex;
        height: 38px;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        gap: 7px;
        border-radius: 6px;
        font: inherit;
        font-size: 13px;
        font-weight: 700;
        padding: 0 20px;
      }

      .hb-script-secondary {
        border: 1px solid #dce3e1;
        background: #ffffff;
        color: #46524e;
      }

      .hb-script-primary {
        border: 1px solid #101817;
        background: #101817;
        color: #ffffff;
      }

      .hb-script-primary:disabled {
        cursor: not-allowed;
        border-color: #cfd7d4;
        background: #cfd7d4;
      }

      .hb-script-spin {
        animation: hb-script-spin 0.8s linear infinite;
      }

      @keyframes hb-script-spin {
        to { transform: rotate(360deg); }
      }

      @keyframes hb-script-shimmer {
        to { transform: translateX(100%); }
      }

      @media (max-width: 900px) {
        .hb-script-page {
          padding: 24px;
        }

        .hb-script-grid {
          grid-template-columns: repeat(auto-fill, minmax(152px, 1fr));
        }

        .hb-script-create-card,
        .hb-script-card,
        .hb-script-skeleton {
          width: 100%;
          max-width: 181px;
        }
      }

      @media (max-width: 640px) {
        .hb-script-page {
          padding: 16px 14px 22px;
        }

        .hb-script-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px 12px;
        }

        .hb-script-create-card,
        .hb-script-card,
        .hb-script-skeleton {
          width: 100%;
          max-width: none;
          height: auto;
          min-height: 190px;
          aspect-ratio: 181 / 254;
        }

        .hb-script-create-plus {
          transform: translateY(-10px);
        }

        .hb-script-create-title {
          font-size: 11.5px;
        }

        .hb-script-create-desc {
          max-width: 86%;
          font-size: 10px;
          text-align: center;
        }

        .hb-script-card-binding {
          left: 21px;
        }

        .hb-script-card-body {
          padding: 15px 14px 0 30px;
        }

        .hb-script-card-body strong {
          font-size: 14px;
          line-height: 1.28;
        }

        .hb-script-card-body span {
          max-width: none;
          margin-top: 8px;
          font-size: 10px;
          line-height: 1.45;
        }

        .hb-script-card time {
          padding: 0 14px 15px 30px;
          font-size: 9px;
        }

        .hb-script-modal-backdrop {
          align-items: flex-end;
          padding: 12px;
        }

        .hb-script-modal {
          width: 100%;
          border-radius: 10px;
        }

        .hb-script-modal-head {
          padding: 26px 22px 12px;
        }

        .hb-script-modal-body {
          padding: 8px 22px 18px;
        }

        .hb-script-modal-actions {
          padding: 0 22px 22px;
        }
      }
    `}</style>
  );
}

function toProjectItems(value: any): ProjectItem[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => ({
    id: Number(item?.id || 0),
    body_id: Number(item?.body_id || 0),
    team_id: Number(item?.team_id || 0),
    release_id: Number(item?.release_id || 0),
    name: String(item?.name || ""),
    description: String(item?.description || ""),
    cover: String(item?.cover || ""),
    created_at: String(item?.created_at || ""),
    updated_at: String(item?.updated_at || ""),
    team: {
      id: Number(item?.team?.id || 0),
      name: String(item?.team?.name || ""),
      version: Number(item?.team?.version || 0),
    },
  }));
}

function toTeamItems(value: any): TeamItem[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => ({
    id: Number(item?.id || 0),
    name: String(item?.name || ""),
    description: String(item?.description || ""),
    release_id: Number(item?.release_id || 0),
    version: Number(item?.version || 0),
    can_create: item?.can_create !== false,
  }));
}

function createTeamOptions(teams: TeamItem[]) {
  const releasedTeams = teams.filter(
    (team) => team.id > 0 && team.can_create !== false,
  );
  return [freeCanvasTeam, ...releasedTeams];
}

function projectTeamDescription(project: ProjectItem) {
  const name = project.team?.name?.trim();
  if (!project.team_id || !name || name.toLowerCase() === "workflow") {
    return "开始你的创作之旅...";
  }
  return `基于「${name}」继续创作...`;
}

function teamDisplayName(team: TeamItem) {
  if (team.id === 0) {
    return "自由画布";
  }
  return team.name.trim() || "未命名团队";
}

function createProject(payload: CreateProjectPayload) {
  return request(joinSiteApi("project/create"), "post", {
    name: payload.name,
    team_id: payload.teamID,
    release_id: payload.releaseID || 0,
  });
}

function formatRecentEdit(value?: string) {
  if (!value) {
    return "最近编辑";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "最近编辑";
  }
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  if (seconds < minute) {
    return "最近编辑 刚刚";
  }
  if (seconds < hour) {
    return `最近编辑 ${Math.floor(seconds / minute)}分钟前`;
  }
  if (seconds < day) {
    return `最近编辑 ${Math.floor(seconds / hour)}小时前`;
  }
  return `最近编辑 ${Math.floor(seconds / day)}天前`;
}
