import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArchiveRestore,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@dever/front-plugin";
import { useAuthUserScopeKey } from "../shared/auth-scope";
import { requestErrorMessage as errorMessage } from "../shared/api-response";
import {
  createProject,
  loadProjectList,
  moveProjectToTrash,
  restoreProject,
  updateProject,
  type ProjectItem,
  type ProjectMetadataInput,
  type ProjectPage,
  type ProjectView,
} from "./project-api";
import { CreateProjectCard, ProjectCard, ProjectLoading } from "./project-card";
import { DeleteProjectDialog, ProjectMetadataDialog } from "./project-dialogs";
import "./project.css";

type MetadataDialogState = {
  mode: "create" | "edit";
  project?: ProjectItem;
};

const emptyProjectPage: ProjectPage = {
  items: [],
  page: 1,
  pageSize: 24,
  total: 0,
  hasMore: false,
};

export function WorkProjectPage({
  teamID = 0,
  onRequireAuth,
}: {
  teamID?: number;
  onRequireAuth?: () => void;
}) {
  const navigate = useNavigate();
  const requestScopeKey = useAuthUserScopeKey();
  const [activeView, setActiveView] = useState<ProjectView>("works");
  const [projectPage, setProjectPage] =
    useState<ProjectPage>(emptyProjectPage);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(teamID > 0);
  const [metadataDialog, setMetadataDialog] =
    useState<MetadataDialogState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectItem | null>(null);
  const [restoringID, setRestoringID] = useState(0);
  const loadRequestRef = useRef(0);

  const loadWorkspace = useCallback(async () => {
    const requestID = ++loadRequestRef.current;
    if (!teamID) {
      setProjectPage(emptyProjectPage);
      setLoading(false);
      return;
    }
    setProjectPage((current) => ({ ...current, items: [] }));
    setLoading(true);
    try {
      const nextPage = await loadProjectList(
        teamID,
        activeView,
        pageNumber,
        24,
        requestScopeKey,
      );
      if (requestID === loadRequestRef.current) {
        setProjectPage(nextPage);
      }
    } catch (error: unknown) {
      if (requestID === loadRequestRef.current) {
        toast.error(errorMessage(error, "加载作品失败"));
      }
    } finally {
      if (requestID === loadRequestRef.current) {
        setLoading(false);
      }
    }
  }, [activeView, pageNumber, requestScopeKey, teamID]);

  useEffect(() => {
    void loadWorkspace();
    return () => {
      loadRequestRef.current += 1;
    };
  }, [loadWorkspace]);

  const openCreateDialog = useCallback(() => {
    if (!teamID && onRequireAuth) {
      onRequireAuth();
      return;
    }
    setMetadataDialog({ mode: "create" });
  }, [onRequireAuth, teamID]);

  const saveMetadata = useCallback(
    async (input: ProjectMetadataInput) => {
      if (metadataDialog?.mode === "edit" && metadataDialog.project) {
        await updateProject(metadataDialog.project.id, input);
        toast.success("作品信息已更新");
        await loadWorkspace();
      } else {
        if (!teamID) {
          throw new Error("当前创作空间不可用");
        }
        await createProject(teamID, input);
        toast.success("作品已创建");
        if (pageNumber === 1) {
          await loadWorkspace();
        } else {
          setPageNumber(1);
        }
      }
      setMetadataDialog(null);
    },
    [loadWorkspace, metadataDialog, pageNumber, teamID],
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }
    await moveProjectToTrash(deleteTarget.id);
    toast.success("作品已移入回收站");
    if (projectPage.items.length === 1 && pageNumber > 1) {
      setPageNumber((current) => current - 1);
    } else {
      await loadWorkspace();
    }
    setDeleteTarget(null);
  }, [deleteTarget, loadWorkspace, pageNumber, projectPage.items.length]);

  const handleRestore = useCallback(
    async (project: ProjectItem) => {
      if (restoringID) {
        return;
      }
      setRestoringID(project.id);
      try {
        await restoreProject(project.id);
        toast.success("作品已恢复");
        if (projectPage.items.length === 1 && pageNumber > 1) {
          setPageNumber((current) => current - 1);
        } else {
          await loadWorkspace();
        }
      } catch (error: unknown) {
        toast.error(errorMessage(error, "恢复作品失败"));
      } finally {
        setRestoringID(0);
      }
    },
    [loadWorkspace, pageNumber, projectPage.items.length, restoringID],
  );

  function changeView(view: ProjectView) {
    if (view === activeView) {
      return;
    }
    setProjectPage(emptyProjectPage);
    setPageNumber(1);
    setLoading(true);
    setActiveView(view);
  }

  return (
    <div className="hb-script-page">
      <header className="hb-script-toolbar">
        <div className="hb-script-tabs" role="tablist" aria-label="创作视图">
          <button
            type="button"
            role="tab"
            aria-selected={activeView === "works"}
            className={activeView === "works" ? "is-active" : ""}
            onClick={() => changeView("works")}
          >
            <FolderOpen size={14} />
            作品
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeView === "trash"}
            className={activeView === "trash" ? "is-active" : ""}
            onClick={() => changeView("trash")}
          >
            <ArchiveRestore size={14} />
            回收站
          </button>
        </div>
      </header>

      {loading ? (
        <ProjectLoading />
      ) : activeView === "works" ? (
        <div className="hb-script-grid">
          <CreateProjectCard onCreate={openCreateDialog} />
          {projectPage.items.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              view="works"
              onOpen={() =>
                navigate({
                  to: "/bot/work/space",
                  search: { project_id: String(project.id) },
                })
              }
              onEdit={() => setMetadataDialog({ mode: "edit", project })}
              onDelete={() => setDeleteTarget(project)}
            />
          ))}
        </div>
      ) : projectPage.items.length > 0 ? (
        <div className="hb-script-grid">
          {projectPage.items.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              view="trash"
              restoring={restoringID === project.id}
              onRestore={() => void handleRestore(project)}
            />
          ))}
        </div>
      ) : (
        <ProjectTrashEmpty />
      )}

      {projectPage.total > projectPage.pageSize ? (
        <footer className="hb-script-pagination">
          <button
            type="button"
            title="上一页"
            disabled={pageNumber <= 1 || loading}
            onClick={() => setPageNumber((current) => current - 1)}
          >
            <ChevronLeft />
          </button>
          <span>
            {projectPage.page} /{" "}
            {Math.max(1, Math.ceil(projectPage.total / projectPage.pageSize))}
          </span>
          <button
            type="button"
            title="下一页"
            disabled={!projectPage.hasMore || loading}
            onClick={() => setPageNumber((current) => current + 1)}
          >
            <ChevronRight />
          </button>
        </footer>
      ) : null}

      {metadataDialog ? (
        <ProjectMetadataDialog
          key={`${metadataDialog.mode}-${metadataDialog.project?.id || 0}`}
          mode={metadataDialog.mode}
          project={metadataDialog.project}
          onClose={() => setMetadataDialog(null)}
          onSubmit={saveMetadata}
        />
      ) : null}

      {deleteTarget ? (
        <DeleteProjectDialog
          project={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      ) : null}
    </div>
  );
}

function ProjectTrashEmpty() {
  return (
    <div className="hb-script-empty">
      <ArchiveRestore size={24} strokeWidth={1.5} />
      <strong>回收站为空</strong>
    </div>
  );
}
