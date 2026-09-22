import {
  Clapperboard,
  Focus,
  LayoutGrid,
  Loader2,
  Maximize2,
  Play,
  Square,
} from "lucide-react";
import { memo, type MouseEvent, type ReactNode } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { StoryboardFrameDisplayMode } from "./space-storyboard-frame";
import {
  StoryboardFrameOverview,
  type StoryboardFrameGroupData,
  type StoryboardFrameResultData,
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
  renderNode: (node: StoryboardFrameResultData["node"]) => ReactNode;
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
      {frame.mode === "overview" ? (
        <Handle
          id="storyboard-input"
          type="target"
          position={Position.Left}
          isConnectable={false}
          className="ws-storyboard-frame-input"
        />
      ) : null}
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
        <StoryboardFrameRunAction
          frame={frame}
          label={runLabel}
          hint={runHint}
        />
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
        <SpaceTooltip
          label={
            frame.mode === "overview" ? "展开全部制作节点" : "返回制作概览"
          }
        >
          <button
            type="button"
            className="nodrag nopan"
            aria-label={
              frame.mode === "overview" ? "展开全部制作节点" : "返回制作概览"
            }
            onClick={stopAnd(() =>
              frame.onSetDisplayMode(
                frame.mode === "overview" ? "expanded" : "overview",
              ),
            )}
          >
            {frame.mode === "overview" ? (
              <Maximize2 size={15} />
            ) : (
              <LayoutGrid size={15} />
            )}
          </button>
        </SpaceTooltip>
      </header>
      {frame.mode === "overview" ? (
        <StoryboardFrameOverview
          groups={frame.groups}
          renderNode={frame.renderNode}
        />
      ) : (
        <div className="ws-storyboard-frame-surface" aria-hidden="true" />
      )}
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

export const StoryboardFrameNode = memo(
  StoryboardFrameNodeView,
  (previous, next) => sameStoryboardFrameData(previous.data, next.data),
);

export function sameStoryboardFrameData(
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

function sameStoryboardFrameGroups(
  previous: StoryboardFrameGroupData[],
  next: StoryboardFrameGroupData[],
) {
  return (
    previous === next ||
    (previous.length === next.length &&
      previous.every((group, index) => {
        const candidate = next[index];
        return (
          group.id === candidate.id &&
          group.title === candidate.title &&
          group.memberCount === candidate.memberCount &&
          group.runnableCount === candidate.runnableCount &&
          group.completedCount === candidate.completedCount &&
          group.failedCount === candidate.failedCount &&
          group.staleCount === candidate.staleCount &&
          group.status === candidate.status &&
          group.runBlockedReason === candidate.runBlockedReason &&
          group.stopping === candidate.stopping &&
          Boolean(group.onRun) === Boolean(candidate.onRun) &&
          Boolean(group.onStop) === Boolean(candidate.onStop) &&
          sameStoryboardFrameResults(group.results, candidate.results)
        );
      }))
  );
}

function sameStoryboardFrameResults(
  previous: StoryboardFrameResultData[],
  next: StoryboardFrameResultData[],
) {
  return (
    previous === next ||
    (previous.length === next.length &&
      previous.every((result, index) => {
        const candidate = next[index];
        return (
          result.nodeId === candidate.nodeId &&
          result.status === candidate.status &&
          result.node.sourceNode === candidate.node.sourceNode &&
          result.node.runningNode === candidate.node.runningNode &&
          result.node.runBlockedReason === candidate.node.runBlockedReason &&
          result.node.storyboardFrameRunning ===
            candidate.node.storyboardFrameRunning &&
          result.node.canvasReferenceItems ===
            candidate.node.canvasReferenceItems &&
          result.node.connectedMediaReferences ===
            candidate.node.connectedMediaReferences &&
          result.node.inputContext === candidate.node.inputContext &&
          result.node.space === candidate.node.space &&
          Boolean(result.onOpen) === Boolean(candidate.onOpen)
        );
      }))
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
