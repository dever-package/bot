import type { CSSProperties } from "react";
import { Loader2, Play } from "lucide-react";
import type { SpaceCanvasNode } from "./types";

const FLOW_RUN_OVERLAY_STYLE = {
  zIndex: 999,
  "--ws-node-overlay-scale": "1",
  "--ws-node-overlay-gap": "16px",
} as CSSProperties;

type FlowRunControlProps = {
  node: SpaceCanvasNode;
  running: boolean;
  onRun: () => void;
};

export function FlowRunControl({
  node,
  running,
  onRun,
}: FlowRunControlProps) {
  if (node.type !== "flow" || !node.flow) {
    return null;
  }

  return (
    <div
      className="ws-node-bottom-settings is-flow-run-only nodrag nowheel"
      onClick={(event) => event.stopPropagation()}
      style={FLOW_RUN_OVERLAY_STYLE}
    >
      <button
        type="button"
        className="ws-node-flow-run"
        disabled={running}
        onClick={onRun}
      >
        {running ? (
          <Loader2 size={15} className="ws-spin" />
        ) : (
          <Play size={15} fill="currentColor" />
        )}
        <span>{running ? "运行中" : "执行"}</span>
      </button>
    </div>
  );
}
