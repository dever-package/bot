import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import type { ProjectItem, ProjectView } from "./project-api";

export function CreateProjectCard({ onCreate }: { onCreate: () => void }) {
  return (
    <button type="button" className="hb-script-create-card" onClick={onCreate}>
      <span className="hb-script-create-plus">
        <Plus size={20} strokeWidth={1.35} />
      </span>
      <span className="hb-script-create-title">新作品</span>
      <span className="hb-script-create-desc">创建我的作品</span>
    </button>
  );
}

export function ProjectCard({
  project,
  view,
  restoring = false,
  onOpen,
  onEdit,
  onDelete,
  onRestore,
}: {
  project: ProjectItem;
  view: ProjectView;
  restoring?: boolean;
  onOpen?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    function closeOnOutsidePointer(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const cardContent = (
    <>
      <span className="hb-script-card-binding" aria-hidden="true" />
      <span className="hb-script-card-body">
        <strong>{project.name}</strong>
        <span>{project.description}</span>
      </span>
      <time>
        {formatRelativeTime(
          view === "trash"
            ? project.deletedAt || project.updatedAt
            : project.updatedAt || project.createdAt,
          view === "trash" ? "删除于" : "最近编辑",
        )}
      </time>
    </>
  );

  function runMenuAction(action?: () => void) {
    setMenuOpen(false);
    action?.();
  }

  return (
    <article
      className={`hb-script-card ${menuOpen ? "has-open-menu" : ""} ${restoring ? "is-busy" : ""}`}
    >
      {view === "works" ? (
        <button
          type="button"
          className="hb-script-card-main"
          onClick={onOpen}
          aria-label={`打开作品：${project.name}`}
        >
          {cardContent}
        </button>
      ) : (
        <div className="hb-script-card-main is-trash">{cardContent}</div>
      )}

      <div className="hb-script-card-menu" ref={menuRef}>
        <button
          type="button"
          className="hb-script-card-menu-trigger"
          aria-label={`${project.name}的更多操作`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          disabled={restoring}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {restoring ? (
            <Loader2 size={15} className="hb-script-spin" />
          ) : (
            <MoreHorizontal size={17} />
          )}
        </button>

        {menuOpen ? (
          <div className="hb-script-card-menu-popover" role="menu">
            {view === "works" ? (
              <>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => runMenuAction(onEdit)}
                >
                  <Pencil size={14} />
                  编辑作品
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="is-danger"
                  onClick={() => runMenuAction(onDelete)}
                >
                  <Trash2 size={14} />
                  移入回收站
                </button>
              </>
            ) : (
              <button
                type="button"
                role="menuitem"
                disabled={restoring}
                onClick={() => runMenuAction(onRestore)}
              >
                <RotateCcw size={14} />
                恢复作品
              </button>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function ProjectLoading() {
  return (
    <div className="hb-script-grid">
      {[0, 1, 2].map((item) => (
        <div key={item} className="hb-script-skeleton" aria-hidden="true">
          <span />
          <strong />
          <em />
          <small />
        </div>
      ))}
    </div>
  );
}

function formatRelativeTime(value: string, prefix: string) {
  if (!value) {
    return prefix;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return prefix;
  }
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  if (seconds < minute) {
    return `${prefix} 刚刚`;
  }
  if (seconds < hour) {
    return `${prefix} ${Math.floor(seconds / minute)}分钟前`;
  }
  if (seconds < day) {
    return `${prefix} ${Math.floor(seconds / hour)}小时前`;
  }
  return `${prefix} ${Math.floor(seconds / day)}天前`;
}
