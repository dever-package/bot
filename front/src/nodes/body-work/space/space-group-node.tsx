import { useEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, FolderTree, Loader2, Play } from "lucide-react";
import type { CanvasGroupRunStatus } from "./space-group-runtime";
import type { SpaceCanvasNode } from "./types";

export function CanvasGroupNodeView({
  node,
  memberCount,
  runnableCount,
  completedCount,
  failedCount,
  status,
  selected,
  onRename,
  onRun,
  children,
}: {
  node: SpaceCanvasNode;
  memberCount: number;
  runnableCount: number;
  completedCount: number;
  failedCount: number;
  status: CanvasGroupRunStatus;
  selected?: boolean;
  onRename?: (title: string) => void;
  onRun?: () => void;
  children?: ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(node.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const running = status === "running" || status === "waiting";

  useEffect(() => {
    if (!editing) {
      setTitle(node.title);
    }
  }, [editing, node.title]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const finishRename = () => {
    const nextTitle = title.trim() || "未命名分组";
    setEditing(false);
    setTitle(nextTitle);
    if (nextTitle !== node.title) {
      onRename?.(nextTitle);
    }
  };

  return (
    <div
      className={`ws-node-group-wrap ${selected ? "is-selected" : ""} ${
        running ? "is-running" : ""
      } ${status === "error" ? "is-error" : ""}`}
    >
      <header className="ws-node-group-header">
        <span className="ws-node-group-icon" aria-hidden="true">
          <FolderTree size={15} />
        </span>
        {editing ? (
          <input
            ref={inputRef}
            className="ws-node-group-title-input nodrag nowheel"
            value={title}
            maxLength={64}
            aria-label="分组名称"
            onChange={(event) => setTitle(event.target.value)}
            onBlur={finishRename}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                finishRename();
              } else if (event.key === "Escape") {
                event.preventDefault();
                setTitle(node.title);
                setEditing(false);
              }
            }}
          />
        ) : (
          <strong
            className="ws-node-group-title"
            title="双击重命名"
            onDoubleClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setEditing(true);
            }}
          >
            {node.title || "未命名分组"}
          </strong>
        )}
        <span className="ws-node-group-count">
          {running
            ? `${completedCount}/${runnableCount}`
            : `${memberCount} 个节点`}
        </span>
        {status === "waiting" ? (
          <span className="ws-node-group-status">等待反馈</span>
        ) : status === "error" ? (
          <span className="ws-node-group-status">
            {failedCount > 0 ? `失败 ${failedCount}` : "运行失败"}
          </span>
        ) : runnableCount > 0 && completedCount === runnableCount ? (
          <span className="ws-node-group-status is-complete">
            <CheckCircle2 size={12} />
            已完成
          </span>
        ) : null}
        <button
          type="button"
          className="ws-node-group-run nodrag nopan"
          disabled={!onRun || runnableCount === 0 || running}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onRun?.();
          }}
          aria-label="运行分组"
          title={runnableCount === 0 ? "分组内暂无可运行节点" : "运行分组"}
        >
          {running ? <Loader2 size={14} className="ws-spin" /> : <Play size={14} />}
        </button>
      </header>
      <div className="ws-node-group-surface" aria-hidden="true" />
      {children}
    </div>
  );
}
