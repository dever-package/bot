import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  CheckCircle2,
  FolderTree,
  Loader2,
  Pencil,
  Play,
} from "lucide-react";
import type { CanvasGroupRunStatus } from "./space-group-runtime";
import { SpaceTooltip } from "./space-tooltip";
import type { SpaceCanvasNode } from "./types";

export function CanvasGroupNodeView({
  node,
  memberCount,
  runnableCount,
  completedCount,
  failedCount,
  staleCount,
  status,
  frameRunning = false,
  selected,
  managed = false,
  onRename,
  onEditStructure,
  onRun,
  runBlockedReason = "",
  children,
}: {
  node: SpaceCanvasNode;
  memberCount: number;
  runnableCount: number;
  completedCount: number;
  failedCount: number;
  staleCount: number;
  status: CanvasGroupRunStatus;
  frameRunning?: boolean;
  selected?: boolean;
  managed?: boolean;
  onRename?: (title: string) => void;
  onEditStructure?: () => void;
  onRun?: () => void;
  runBlockedReason?: string;
  children?: ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(node.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const running = status === "running" || status === "waiting";
  const runTooltip = running
    ? "分组正在执行"
    : frameRunning
      ? "制作区正在执行"
      : runBlockedReason ||
        (runnableCount === 0
          ? "分组内暂无可运行节点"
          : staleCount > 0
            ? `重新生成 ${staleCount} 个已变更节点`
            : "运行分组");
  const runDisabled =
    !onRun ||
    runnableCount === 0 ||
    running ||
    frameRunning ||
    Boolean(runBlockedReason);

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
      } ${status === "error" ? "is-error" : ""} ${
        managed ? "is-managed" : ""
      }`}
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
          <SpaceTooltip
            label={managed ? "名称由分镜脚本管理" : "双击重命名"}
          >
            <strong
              className="ws-node-group-title"
              onDoubleClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (managed || !onRename) {
                  return;
                }
                setEditing(true);
              }}
            >
              {node.title || "未命名分组"}
            </strong>
          </SpaceTooltip>
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
        ) : runBlockedReason ? (
          <SpaceTooltip label={runBlockedReason}>
            <span className="ws-node-group-status">等待前置</span>
          </SpaceTooltip>
        ) : frameRunning ? (
          <span className="ws-node-group-status">等待调度</span>
        ) : staleCount > 0 ? (
          <SpaceTooltip label="上游素材或提示词已变化；当前结果仍可使用，重新运行可更新">
            <span className="ws-node-group-status is-stale">
              可更新 {staleCount}
            </span>
          </SpaceTooltip>
        ) : runnableCount > 0 && completedCount === runnableCount ? (
          <span className="ws-node-group-status is-complete">
            <CheckCircle2 size={12} />
            已完成
          </span>
        ) : null}
        {onEditStructure ? (
          <SpaceTooltip label="编辑分镜结构">
            <button
              type="button"
              className="ws-node-group-edit nodrag nopan"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onEditStructure();
              }}
              aria-label="编辑分镜结构"
            >
              <Pencil size={13} />
            </button>
          </SpaceTooltip>
        ) : null}
        <SpaceTooltip label={runTooltip}>
          <button
            type="button"
            className="ws-node-group-run nodrag nopan"
            disabled={runDisabled}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onRun?.();
            }}
            aria-label="运行分组"
          >
            {running ? (
              <Loader2 size={14} className="ws-spin" />
            ) : (
              <Play size={14} />
            )}
          </button>
        </SpaceTooltip>
      </header>
      <div className="ws-node-group-surface" aria-hidden="true" />
      {children}
    </div>
  );
}
