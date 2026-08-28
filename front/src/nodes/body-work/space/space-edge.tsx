import { ChevronDown, Link2, Scissors } from "lucide-react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";

type SpaceEdgeData = {
  isHighlighted?: boolean;
  isSelected?: boolean;
  highlightColor?: string;
  bindingLabel?: string;
  bindingInteractive?: boolean;
  bindingShowChevron?: boolean;
  bindingInvalid?: boolean;
  onDelete?: (edgeId: string) => void;
  onEditBinding?: (edgeId: string) => void;
};

export function SpaceAnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const edgeData = (data || {}) as SpaceEdgeData;
  const isSelected = Boolean(edgeData.isSelected);
  const isHighlighted = Boolean(edgeData.isHighlighted || isSelected);
  const highlightColor = edgeData.highlightColor || "#0ea5e9";
  const stroke = isSelected
    ? "var(--ws-edge-selected)"
    : isHighlighted
      ? highlightColor
      : "var(--ws-edge)";
  const strokeWidth = isSelected ? 2.8 : isHighlighted ? 2.4 : 1.45;
  const opacity = isHighlighted ? 0.96 : 0.62;
  const bindingLabel = String(edgeData.bindingLabel || "").trim();
  const bindingInteractive = Boolean(edgeData.bindingInteractive);
  const showBindingControl = Boolean(bindingLabel);
  const showEdgeActions = showBindingControl || isSelected;

  return (
    <>
      {isHighlighted ? (
        <BaseEdge
          path={edgePath}
          style={{
            stroke: highlightColor,
            strokeWidth: 7,
            opacity: 0.12,
          }}
        />
      ) : null}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke,
          strokeWidth,
          opacity,
          transition:
            "stroke 160ms ease, stroke-width 160ms ease, opacity 160ms ease",
        }}
      />
      {showEdgeActions ? (
        <EdgeLabelRenderer>
          <div
            className={[
              "ws-edge-actions nodrag nopan",
              bindingLabel ? "is-bound" : "",
              edgeData.bindingInvalid ? "is-invalid" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            {showBindingControl ? (
              bindingInteractive ? (
                <button
                  type="button"
                  className="ws-edge-binding"
                  aria-label={`调整参数连接，当前为${bindingLabel}`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    edgeData.onEditBinding?.(String(id));
                  }}
                >
                  <Link2 size={14} aria-hidden="true" />
                  <span>{bindingLabel}</span>
                  {edgeData.bindingShowChevron ? (
                    <ChevronDown size={13} aria-hidden="true" />
                  ) : null}
                </button>
              ) : (
                <div className="ws-edge-binding is-static">
                  <Link2 size={14} aria-hidden="true" />
                  <span>{bindingLabel}</span>
                </div>
              )
            ) : null}
            {isSelected ? (
              <button
                type="button"
                className="ws-edge-delete"
                aria-label="删除连线"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  edgeData.onDelete?.(String(id));
                }}
              >
                <Scissors size={15} />
              </button>
            ) : null}
          </div>
        </EdgeLabelRenderer>
      ) : null}
      {isHighlighted ? (
        <>
          <circle r="3" fill={highlightColor}>
            <animateMotion
              dur="2.8s"
              repeatCount="indefinite"
              path={edgePath}
            />
          </circle>
          <circle r="1.8" fill="rgba(255, 255, 255, 0.92)">
            <animateMotion
              dur="2.8s"
              repeatCount="indefinite"
              path={edgePath}
            />
          </circle>
        </>
      ) : null}
    </>
  );
}
