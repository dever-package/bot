import {
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  NodeResizeControl,
  type ControlPosition,
  type ResizeParams,
} from "@xyflow/react";
import type {
  CanvasResultViewState,
  SpaceCanvasNode,
} from "./types";
import {
  MAX_GROUP_NODE_SIZE,
  MIN_GROUP_NODE_SIZE,
} from "./space-group-model";
import { isAudioPowerType } from "../shared/power-presentation";

export type CanvasNodeBounds = Pick<
  SpaceCanvasNode,
  "x" | "y" | "width" | "height"
>;

export type CanvasNodeResizeHandler = (
  nodeId: string,
  bounds: CanvasNodeBounds,
) => void;

export type CanvasResultViewChangeHandler = (
  nodeId: string,
  resultView: CanvasResultViewState,
) => void;

type ResizeCorner = {
  position: ControlPosition;
  className: string;
  horizontalDirection: -1 | 1;
  verticalDirection: -1 | 1;
  top: boolean;
  left: boolean;
};

type FloatingResizeDrag = {
  pointerId: number;
  startX: number;
  startY: number;
  startView: CanvasResultViewState;
  currentView: CanvasResultViewState;
  corner: ResizeCorner;
  scale: number;
};

const RESIZE_CORNERS: ResizeCorner[] = [
  {
    position: "top-left",
    className: "is-top-left",
    horizontalDirection: -1,
    verticalDirection: -1,
    top: true,
    left: true,
  },
  {
    position: "top-right",
    className: "is-top-right",
    horizontalDirection: 1,
    verticalDirection: -1,
    top: true,
    left: false,
  },
  {
    position: "bottom-left",
    className: "is-bottom-left",
    horizontalDirection: -1,
    verticalDirection: 1,
    top: false,
    left: true,
  },
  {
    position: "bottom-right",
    className: "is-bottom-right",
    horizontalDirection: 1,
    verticalDirection: 1,
    top: false,
    left: false,
  },
];

export const MIN_RESULT_WIDTH = 140;
export const MIN_RESULT_HEIGHT = 100;
export const MAX_RESULT_SIZE = 720;
const MIN_AUDIO_NODE_SIZE = { width: 280, height: 64 } as const;

export function withResizedCanvasNode(
  nodes: SpaceCanvasNode[],
  nodeId: string,
  bounds: CanvasNodeBounds,
) {
  const normalized = normalizeCanvasNodeBounds(bounds);
  const target = nodes.find((node) => node.id === nodeId);
  if (!target || sameCanvasNodeBounds(target, normalized)) {
    return nodes;
  }
  return nodes.map((node) =>
    node.id === nodeId ? { ...node, ...normalized } : node,
  );
}

export function withResizedCanvasResultView(
  nodes: SpaceCanvasNode[],
  nodeId: string,
  resultView: CanvasResultViewState,
) {
  const normalized = normalizeCanvasResultViewState(resultView);
  const target = nodes.find((node) => node.id === nodeId);
  if (!target || sameCanvasResultView(target.resultView, normalized)) {
    return nodes;
  }
  return nodes.map((node) =>
    node.id === nodeId ? { ...node, resultView: normalized } : node,
  );
}

export function CanvasNodeResizer({
  node,
  enabled,
  resizable,
  onResizeStart,
  onResizeEnd,
}: {
  node: SpaceCanvasNode;
  enabled?: boolean;
  resizable?: boolean;
  onResizeStart?: (nodeId: string) => void;
  onResizeEnd?: CanvasNodeResizeHandler;
}) {
  if (!enabled || !resizable || !onResizeEnd) {
    return null;
  }
  const isGroup = node.type === "group";
  const isAudioPower =
    node.type === "power" && isAudioPowerType(node.power, node.kind);
  return (
    <>
      {RESIZE_CORNERS.map((corner) => (
        <NodeResizeControl
          key={corner.position}
          position={corner.position}
          className={`ws-resize-control ws-node-resize-control ${corner.className} nodrag nopan`}
          minWidth={
            isGroup
              ? MIN_GROUP_NODE_SIZE.width
              : isAudioPower
                ? MIN_AUDIO_NODE_SIZE.width
                : MIN_RESULT_WIDTH
          }
          minHeight={
            isGroup
              ? MIN_GROUP_NODE_SIZE.height
              : isAudioPower
                ? MIN_AUDIO_NODE_SIZE.height
                : MIN_RESULT_HEIGHT
          }
          maxWidth={isGroup ? MAX_GROUP_NODE_SIZE.width : MAX_RESULT_SIZE}
          maxHeight={isGroup ? MAX_GROUP_NODE_SIZE.height : MAX_RESULT_SIZE}
          keepAspectRatio={!isGroup && !isAudioPower}
          onResizeStart={() => onResizeStart?.(node.id)}
          onResizeEnd={(_event, params: ResizeParams) =>
            onResizeEnd(node.id, normalizeCanvasNodeBounds(params))
          }
        />
      ))}
    </>
  );
}

export function CanvasFloatingResizer({
  value,
  enabled,
  onResizeStart,
  onResize,
  onResizeEnd,
}: {
  value: CanvasResultViewState;
  enabled?: boolean;
  onResizeStart?: () => void;
  onResize: (value: CanvasResultViewState) => void;
  onResizeEnd: (value: CanvasResultViewState) => void;
}) {
  const dragRef = useRef<FloatingResizeDrag | null>(null);
  if (!enabled) {
    return null;
  }

  const startResize = (
    event: ReactPointerEvent<HTMLDivElement>,
    corner: ResizeCorner,
  ) => {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const startView = normalizeCanvasResultViewState(value);
    const renderedWidth =
      event.currentTarget.parentElement?.getBoundingClientRect().width ||
      startView.width;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startView,
      currentView: startView,
      corner,
      scale: Math.max(0.01, renderedWidth / startView.width),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    onResizeStart?.();
  };

  const resize = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const nextView = resizeFloatingResultView(
      drag.startView,
      drag.corner,
      (event.clientX - drag.startX) / drag.scale,
      (event.clientY - drag.startY) / drag.scale,
    );
    drag.currentView = nextView;
    onResize(nextView);
  };

  const finishResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onResizeEnd(normalizeCanvasResultViewState(drag.currentView));
  };

  return (
    <>
      {RESIZE_CORNERS.map((corner) => (
        <div
          key={corner.position}
          className={`ws-resize-control ws-floating-resize-control ${corner.className} nodrag nopan nowheel`}
          onPointerDown={(event) => startResize(event, corner)}
          onPointerMove={resize}
          onPointerUp={finishResize}
          onPointerCancel={finishResize}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        />
      ))}
    </>
  );
}

function resizeFloatingResultView(
  start: CanvasResultViewState,
  corner: ResizeCorner,
  deltaX: number,
  deltaY: number,
) {
  const ratio = start.width / start.height;
  const widthFromHorizontal =
    start.width + corner.horizontalDirection * deltaX;
  const widthFromVertical =
    (start.height + corner.verticalDirection * deltaY) * ratio;
  const nextWidth = clampResultWidth(
    Math.abs(widthFromHorizontal - start.width) >=
      Math.abs(widthFromVertical - start.width)
      ? widthFromHorizontal
      : widthFromVertical,
    ratio,
  );
  const nextHeight = nextWidth / ratio;
  const offsetX = Number(start.offsetX || 0);
  const offsetY = Number(start.offsetY || 0);
  return normalizeCanvasResultViewState({
    width: nextWidth,
    height: nextHeight,
    offsetX: corner.left ? offsetX + start.width - nextWidth : offsetX,
    offsetY: corner.top
      ? offsetY + (start.height - nextHeight) / 2
      : offsetY + (nextHeight - start.height) / 2,
  });
}

function clampResultWidth(width: number, ratio: number) {
  const minimum = Math.max(MIN_RESULT_WIDTH, MIN_RESULT_HEIGHT * ratio);
  const maximum = Math.min(MAX_RESULT_SIZE, MAX_RESULT_SIZE * ratio);
  if (minimum > maximum) {
    return Math.min(MAX_RESULT_SIZE, Math.max(MIN_RESULT_WIDTH, width));
  }
  return Math.min(maximum, Math.max(minimum, width));
}

export function normalizeCanvasResultViewState(
  value: CanvasResultViewState,
) {
  const width = positiveFiniteNumber(value.width, MIN_RESULT_WIDTH);
  const height = positiveFiniteNumber(value.height, MIN_RESULT_HEIGHT);
  const ratio = width / height;
  const normalizedWidth = clampResultWidth(width, ratio);
  return {
    width: Math.round(normalizedWidth),
    height: Math.round(normalizedWidth / ratio),
    offsetX: Math.round(finiteNumber(value.offsetX, 0)),
    offsetY: Math.round(finiteNumber(value.offsetY, 0)),
  };
}

function positiveFiniteNumber(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function finiteNumber(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeCanvasNodeBounds(bounds: CanvasNodeBounds) {
  return {
    x: Math.round(bounds.x),
    y: Math.round(bounds.y),
    width: Math.round(bounds.width),
    height: Math.round(bounds.height),
  };
}

function sameCanvasNodeBounds(
  node: SpaceCanvasNode,
  bounds: CanvasNodeBounds,
) {
  return (
    node.x === bounds.x &&
    node.y === bounds.y &&
    node.width === bounds.width &&
    node.height === bounds.height
  );
}

function sameCanvasResultView(
  current: CanvasResultViewState | undefined,
  next: CanvasResultViewState,
) {
  return (
    current?.width === next.width &&
    current?.height === next.height &&
    Number(current?.offsetX || 0) === Number(next.offsetX || 0) &&
    Number(current?.offsetY || 0) === Number(next.offsetY || 0)
  );
}
