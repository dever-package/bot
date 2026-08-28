import {
  ChevronDown,
  ChevronUp,
  Clapperboard,
  Focus,
  Loader2,
  Play,
} from "lucide-react";
import { memo, type MouseEvent } from "react";
import type { Node, NodeProps } from "@xyflow/react";
import { SpaceTooltip } from "./space-tooltip";

export type StoryboardFrameNodeData = {
  type: "storyboardFrame";
  frameId: string;
  sourceNodeId: string;
  title: string;
  groupCount: number;
  workNodeCount: number;
  completedCount: number;
  running: boolean;
  runBlockedReason: string;
  runActionEnabled?: boolean;
  collapsed: boolean;
  onRun: () => void;
  onFocus: () => void;
  onToggleCollapsed: () => void;
};

function StoryboardFrameNodeView({
  data: frame,
}: NodeProps<Node<StoryboardFrameNodeData>>) {
  const runLabel = storyboardFrameRunLabel(frame);
  const runHint = frame.running
    ? "制作区正在执行"
    : frame.runBlockedReason ||
      (frame.completedCount > 0
        ? "只执行尚未完成或上次失败的内容"
        : "按依赖顺序生成制作区内容");
  return (
    <section
      className={`ws-storyboard-frame ${frame.collapsed ? "is-collapsed" : ""}`}
      aria-label={`${frame.title} 分镜制作区`}
    >
      <header className="ws-storyboard-frame-header">
        <span className="ws-storyboard-frame-icon" aria-hidden="true">
          <Clapperboard size={15} />
        </span>
        <strong>{frame.title} · 分镜制作区</strong>
        <span className="ws-storyboard-frame-progress">
          {frame.groupCount} 组 · {frame.completedCount}/{frame.workNodeCount}{" "}
          完成
        </span>
        {frame.runActionEnabled ? (
          <SpaceTooltip label={runHint}>
            <button
              type="button"
              className="nodrag nopan ws-storyboard-frame-run"
              aria-label={runLabel}
              disabled={frame.running || Boolean(frame.runBlockedReason)}
              onClick={stopAnd(frame.onRun)}
            >
              {frame.running ? (
                <Loader2 size={14} className="ws-spin" />
              ) : (
                <Play size={14} fill="currentColor" />
              )}
              <span>{runLabel}</span>
            </button>
          </SpaceTooltip>
        ) : null}
        <SpaceTooltip label="聚焦制作区">
          <button
            type="button"
            className="nodrag nopan"
            aria-label="聚焦制作区"
            onClick={stopAnd(frame.onFocus)}
          >
            <Focus size={14} />
          </button>
        </SpaceTooltip>
        <SpaceTooltip label={frame.collapsed ? "展开制作区" : "折叠制作区"}>
          <button
            type="button"
            className="nodrag nopan"
            aria-label={frame.collapsed ? "展开制作区" : "折叠制作区"}
            onClick={stopAnd(frame.onToggleCollapsed)}
          >
            {frame.collapsed ? (
              <ChevronDown size={15} />
            ) : (
              <ChevronUp size={15} />
            )}
          </button>
        </SpaceTooltip>
      </header>
      {frame.collapsed ? null : (
        <div className="ws-storyboard-frame-surface" aria-hidden="true" />
      )}
    </section>
  );
}

export const StoryboardFrameNode = memo(
  StoryboardFrameNodeView,
  (previous, next) => sameStoryboardFrameData(previous.data, next.data),
);

function sameStoryboardFrameData(
  previous: StoryboardFrameNodeData,
  next: StoryboardFrameNodeData,
) {
  return (
    previous === next ||
    (previous.frameId === next.frameId &&
      previous.sourceNodeId === next.sourceNodeId &&
      previous.title === next.title &&
      previous.groupCount === next.groupCount &&
      previous.workNodeCount === next.workNodeCount &&
      previous.completedCount === next.completedCount &&
      previous.running === next.running &&
      previous.runBlockedReason === next.runBlockedReason &&
      previous.runActionEnabled === next.runActionEnabled &&
      previous.collapsed === next.collapsed)
  );
}

function storyboardFrameRunLabel(frame: StoryboardFrameNodeData) {
  if (frame.running) return "生成中";
  if (frame.workNodeCount > 0 && frame.completedCount >= frame.workNodeCount) {
    return "已完成";
  }
  return frame.completedCount > 0 ? "继续生成" : "开始生成";
}

function stopAnd(action: () => void) {
  return (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };
}
