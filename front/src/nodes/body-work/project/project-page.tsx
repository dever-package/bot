import { useCallback, useEffect, useRef, useState } from "react";
import { ArchiveRestore, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@dever/front-plugin";
import {
  createProject,
  loadProjectList,
  moveProjectToTrash,
  restoreProject,
  updateProject,
  type ProjectItem,
  type ProjectMetadataInput,
  type ProjectView,
} from "./project-api";
import { CreateProjectCard, ProjectCard, ProjectLoading } from "./project-card";
import { DeleteProjectDialog, ProjectMetadataDialog } from "./project-dialogs";
import "./project.css";

type MetadataDialogState = {
  mode: "create" | "edit";
  project?: ProjectItem;
};

export function WorkProjectPage({
  teamID = 0,
  onRequireAuth,
}: {
  teamID?: number;
  onRequireAuth?: () => void;
}) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ProjectView>("works");
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(teamID > 0);
  const [metadataDialog, setMetadataDialog] =
    useState<MetadataDialogState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectItem | null>(null);
  const [restoringID, setRestoringID] = useState(0);
  const loadRequestRef = useRef(0);

  const loadWorkspace = useCallback(async () => {
    const requestID = ++loadRequestRef.current;
    if (!teamID) {
      setProjects([]);
      setLoading(false);
      return;
    }
    setProjects([]);
    setLoading(true);
    try {
      const nextProjects = await loadProjectList(teamID, activeView);
      if (requestID === loadRequestRef.current) {
        setProjects(nextProjects);
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
  }, [activeView, teamID]);

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
      } else {
        if (!teamID) {
          throw new Error("当前创作空间不可用");
        }
        await createProject(teamID, input);
        toast.success("作品已创建");
      }
      await loadWorkspace();
      setMetadataDialog(null);
    },
    [loadWorkspace, metadataDialog, teamID],
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }
    await moveProjectToTrash(deleteTarget.id);
    toast.success("作品已移入回收站");
    await loadWorkspace();
    setDeleteTarget(null);
  }, [deleteTarget, loadWorkspace]);

  const handleRestore = useCallback(
    async (project: ProjectItem) => {
      if (restoringID) {
        return;
      }
      setRestoringID(project.id);
      try {
        await restoreProject(project.id);
        toast.success("作品已恢复");
        await loadWorkspace();
      } catch (error: unknown) {
        toast.error(errorMessage(error, "恢复作品失败"));
      } finally {
        setRestoringID(0);
      }
    },
    [loadWorkspace, restoringID],
  );

  function changeView(view: ProjectView) {
    if (view === activeView) {
      return;
    }
    setProjects([]);
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
          {projects.map((project) => (
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
      ) : projects.length > 0 ? (
        <div className="hb-script-grid">
          {projects.map((project) => (
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

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}
