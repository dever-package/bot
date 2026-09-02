import {
  ChevronDown,
  ChevronUp,
  Clapperboard,
  Focus,
  Loader2,
  Maximize2,
  Minimize2,
  Play,
  Square,
} from "lucide-react";
import { memo, type MouseEvent } from "react";
import type { Node, NodeProps } from "@xyflow/react";
import type { StoryboardFrameDisplayMode } from "./space-storyboard-frame";
import {
  StoryboardFrameOverview,
  sameStoryboardFrameGroups,
  type StoryboardFrameGroupData,
} from "./space-storyboard-frame-overview";
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
  stopping: boolean;
  executionStatus: string;
  currentNodeTitle: string;
  runBlockedReason: string;
  mode: StoryboardFrameDisplayMode;
  groups: StoryboardFrameGroupData[];
  onRun: () => void;
  onStop?: () => void;
  onFocus: () => void;
  onSetDisplayMode: (mode: StoryboardFrameDisplayMode) => void;
};

function StoryboardFrameNodeView({
  data: frame,
}: NodeProps<Node<StoryboardFrameNodeData>>) {
  const runLabel = storyboardFrameRunLabel(frame);
  const runHint = frame.running
    ? frame.stopping
      ? "正在停止制作区执行"
      : frame.currentNodeTitle
        ? `正在执行：${frame.currentNodeTitle}`
        : "制作区正在执行"
    : frame.runBlockedReason ||
      (frame.completedCount > 0
        ? "只执行尚未完成或上次失败的内容"
        : "按依赖顺序生成制作区内容");
  return (
    <section
      className={`ws-storyboard-frame is-${frame.mode}`}
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
          {frame.executionStatus ? ` · ${frame.executionStatus}` : ""}
          {frame.currentNodeTitle
            ? ` · 正在执行：${frame.currentNodeTitle}`
            : ""}
        </span>
        <StoryboardFrameRunAction frame={frame} label={runLabel} hint={runHint} />
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
        <StoryboardFrameModeActions frame={frame} />
      </header>
      {frame.mode === "overview" ? (
        <StoryboardFrameOverview groups={frame.groups} />
      ) : frame.mode === "expanded" ? (
        <div className="ws-storyboard-frame-surface" aria-hidden="true" />
      ) : null}
    </section>
  );
}

function StoryboardFrameRunAction({
  frame,
  label,
  hint,
}: {
  frame: StoryboardFrameNodeData;
  label: string;
  hint: string;
}) {
  if (frame.running) {
    return (
      <SpaceTooltip label={hint}>
        <button
          type="button"
          className="nodrag nopan ws-storyboard-frame-run is-stop"
          aria-label="停止制作区执行"
          disabled={frame.stopping || !frame.onStop}
          onClick={frame.onStop ? stopAnd(frame.onStop) : undefined}
        >
          {frame.stopping ? (
            <Loader2 size={14} className="ws-spin" />
          ) : (
            <Square size={13} fill="currentColor" />
          )}
          <span>{frame.stopping ? "停止中" : "停止"}</span>
        </button>
      </SpaceTooltip>
    );
  }
  return (
    <SpaceTooltip label={hint}>
      <button
        type="button"
        className="nodrag nopan ws-storyboard-frame-run"
        aria-label={label}
        disabled={Boolean(frame.runBlockedReason)}
        onClick={stopAnd(frame.onRun)}
      >
        <Play size={14} fill="currentColor" />
        <span>{label}</span>
      </button>
    </SpaceTooltip>
  );
}

function StoryboardFrameModeActions({
  frame,
}: {
  frame: StoryboardFrameNodeData;
}) {
  if (frame.mode === "minimized") {
    return (
      <SpaceTooltip label="打开制作概览">
        <button
          type="button"
          className="nodrag nopan"
          aria-label="打开制作概览"
          onClick={stopAnd(() => frame.onSetDisplayMode("overview"))}
        >
          <ChevronDown size={15} />
        </button>
      </SpaceTooltip>
    );
  }
  if (frame.mode === "expanded") {
    return (
      <SpaceTooltip label="返回制作概览">
        <button
          type="button"
          className="nodrag nopan"
          aria-label="返回制作概览"
          onClick={stopAnd(() => frame.onSetDisplayMode("overview"))}
        >
          <Minimize2 size={15} />
        </button>
      </SpaceTooltip>
    );
  }
  return (
    <span className="ws-storyboard-frame-mode-actions">
      <SpaceTooltip label="最小化制作区">
        <button
          type="button"
          className="nodrag nopan"
          aria-label="最小化制作区"
          onClick={stopAnd(() => frame.onSetDisplayMode("minimized"))}
        >
          <ChevronUp size={15} />
        </button>
      </SpaceTooltip>
      <SpaceTooltip label="展开全部制作节点">
        <button
          type="button"
          className="nodrag nopan"
          aria-label="展开全部制作节点"
          onClick={stopAnd(() => frame.onSetDisplayMode("expanded"))}
        >
          <Maximize2 size={15} />
        </button>
      </SpaceTooltip>
    </span>
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
      previous.stopping === next.stopping &&
      previous.executionStatus === next.executionStatus &&
      previous.currentNodeTitle === next.currentNodeTitle &&
      previous.runBlockedReason === next.runBlockedReason &&
      previous.mode === next.mode &&
      sameStoryboardFrameGroups(previous.groups, next.groups) &&
      Boolean(previous.onStop) === Boolean(next.onStop))
  );
}

function storyboardFrameRunLabel(frame: StoryboardFrameNodeData) {
  if (frame.running) return "执行中";
  if (frame.workNodeCount > 0 && frame.completedCount >= frame.workNodeCount) {
    return "已完成";
  }
  return frame.completedCount > 0 ? "继续执行" : "开始执行";
}

function stopAnd(action: () => void) {
  return (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };
}
