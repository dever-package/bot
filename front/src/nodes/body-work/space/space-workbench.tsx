import { useEffect, useState } from "react";
import type { Node } from "@xyflow/react";
import {
  Copy,
  Eye,
  Map as MapIcon,
  Maximize2,
  Minus,
  MousePointer2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { SpaceTooltip } from "./space-tooltip";

export function useTransientFlowNodes(
  derivedNodes: Node[],
  interactingNodeId: string,
) {
  const [flowNodes, setFlowNodes] = useState<Node[]>([]);

  useEffect(() => {
    if (!interactingNodeId) {
      setFlowNodes(derivedNodes);
    }
  }, [derivedNodes, interactingNodeId]);

  return { flowNodes, setFlowNodes };
}

export function NodeActionMenu({
  point,
  canShowDetail,
  canCopy = true,
  canDelete = true,
  canEditStructure = false,
  onClose,
  onCopy,
  onDelete,
  onDetail,
  onEditStructure,
}: {
  point: { x: number; y: number };
  canShowDetail: boolean;
  canCopy?: boolean;
  canDelete?: boolean;
  canEditStructure?: boolean;
  onClose: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onDetail: () => void;
  onEditStructure?: () => void;
}) {
  return (
    <>
      <div className="ws-node-action-backdrop" onMouseDown={onClose} />
      <section
        className="ws-node-action-menu"
        style={{ left: point.x, top: point.y }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {canShowDetail ? (
          <button type="button" onClick={onDetail}>
            <Eye size={15} />
            <span>详情</span>
          </button>
        ) : null}
        {canEditStructure && onEditStructure ? (
          <button type="button" onClick={onEditStructure}>
            <Pencil size={15} />
            <span>编辑分镜</span>
          </button>
        ) : null}
        {canCopy ? (
          <button type="button" onClick={onCopy}>
            <Copy size={15} />
            <span>复制</span>
          </button>
        ) : null}
        {canDelete ? (
          <button type="button" className="is-danger" onClick={onDelete}>
            <Trash2 size={15} />
            <span>删除</span>
          </button>
        ) : null}
      </section>
    </>
  );
}

export function CanvasViewControls({
  showMiniMap,
  snapToGrid,
  zoom,
  onToggleMiniMap,
  onToggleSnap,
  onReset,
  onZoomIn,
  onZoomOut,
  onZoomChange,
}: {
  showMiniMap: boolean;
  snapToGrid: boolean;
  zoom: number;
  onToggleMiniMap: () => void;
  onToggleSnap: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomChange: (zoom: number) => void;
}) {
  return (
    <div className="ws-view-controls nodrag nopan">
      <SpaceTooltip label={showMiniMap ? "隐藏小地图" : "显示小地图"}>
        <button
          type="button"
          className={showMiniMap ? "is-active" : ""}
          onClick={onToggleMiniMap}
          aria-label={showMiniMap ? "隐藏小地图" : "显示小地图"}
        >
          <MapIcon size={16} />
        </button>
      </SpaceTooltip>
      <SpaceTooltip label={snapToGrid ? "关闭网格吸附" : "开启网格吸附"}>
        <button
          type="button"
          className={snapToGrid ? "is-active" : ""}
          onClick={onToggleSnap}
          aria-label={snapToGrid ? "关闭网格吸附" : "开启网格吸附"}
        >
          <MousePointer2 size={16} />
        </button>
      </SpaceTooltip>
      <SpaceTooltip label="重置视图">
        <button type="button" onClick={onReset} aria-label="重置视图">
          <Maximize2 size={15} />
        </button>
      </SpaceTooltip>
      <div className="ws-view-zoom">
        <SpaceTooltip label="缩小">
          <button type="button" onClick={onZoomOut} aria-label="缩小">
            <Minus size={15} />
          </button>
        </SpaceTooltip>
        <input
          type="range"
          min="0.35"
          max="1.45"
          step="0.01"
          value={Math.max(0.35, Math.min(1.45, zoom))}
          onChange={(event) => onZoomChange(Number(event.target.value))}
          aria-label="画布缩放"
        />
        <SpaceTooltip label="放大">
          <button type="button" onClick={onZoomIn} aria-label="放大">
            <Plus size={15} />
          </button>
        </SpaceTooltip>
      </div>
    </div>
  );
}
