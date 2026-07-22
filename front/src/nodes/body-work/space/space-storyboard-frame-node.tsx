import { ChevronDown, ChevronUp, Clapperboard, Focus } from "lucide-react";
import type { MouseEvent } from "react";
import type { NodeProps } from "@xyflow/react";
import { SpaceTooltip } from "./space-tooltip";

export type StoryboardFrameNodeData = {
  type: "storyboardFrame";
  title: string;
  groupCount: number;
  workNodeCount: number;
  completedCount: number;
  collapsed: boolean;
  onFocus: () => void;
  onToggleCollapsed: () => void;
};

export function StoryboardFrameNode({ data }: NodeProps<any>) {
  const frame = data as StoryboardFrameNodeData;
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

function stopAnd(action: () => void) {
  return (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };
}
