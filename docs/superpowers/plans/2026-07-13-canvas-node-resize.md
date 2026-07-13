# Canvas Node Proportional Resize Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add selected-only, four-corner proportional resizing to rectangular asset and power nodes and persist the final bounds through the existing canvas autosave path.

**Architecture:** A focused `CanvasNodeResizer` wraps React Flow's `NodeResizeControl` and owns resize eligibility, bounds normalization, and the four shared controls. `CanvasFlow` keeps resize interaction transient, then commits the final `x/y/width/height` through its existing `onNodesCommit`; `NodeSelectionOverlays` mounts the shared resizer for every node without duplicating it across render branches.

**Tech Stack:** React, TypeScript, `@xyflow/react` 12, existing canvas state and autosave, CSS.

**Project constraint:** Do not run `npm run build` or any automated test command. Verification is limited to static source inspection and `git diff --check`; the user performs browser testing.

---

### Task 1: Add the shared canvas node resizer

**Files:**
- Create: `front/src/nodes/body-work/space/space-node-resizer.tsx`

- [ ] **Step 1: Define resize bounds and eligibility**

Create a focused module with the shared limits, node predicate, and immutable node update:

```tsx
import {
  NodeResizeControl,
  type ControlPosition,
  type ResizeParams,
} from "@xyflow/react";
import type { SpaceCanvasNode } from "./types";

export type CanvasNodeBounds = Pick<
  SpaceCanvasNode,
  "x" | "y" | "width" | "height"
>;

export type CanvasNodeResizeHandler = (
  nodeId: string,
  bounds: CanvasNodeBounds,
) => void;

const RESIZE_POSITIONS: ControlPosition[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

const MIN_NODE_WIDTH = 140;
const MIN_NODE_HEIGHT = 100;
const MAX_NODE_SIZE = 720;

export function canResizeCanvasNode(node: SpaceCanvasNode) {
  return node.type === "asset" || node.type === "power";
}

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
```

- [ ] **Step 2: Render only the four proportional controls**

Add the shared component and normalize React Flow's final floating-point bounds once at commit time:

```tsx
export function CanvasNodeResizer({
  node,
  selected,
  onResizeStart,
  onResizeEnd,
}: {
  node: SpaceCanvasNode;
  selected?: boolean;
  onResizeStart?: (nodeId: string) => void;
  onResizeEnd?: CanvasNodeResizeHandler;
}) {
  if (!selected || !canResizeCanvasNode(node) || !onResizeEnd) {
    return null;
  }
  return (
    <>
      {RESIZE_POSITIONS.map((position) => (
        <NodeResizeControl
          key={position}
          position={position}
          className="ws-node-resize-control nopan"
          minWidth={MIN_NODE_WIDTH}
          minHeight={MIN_NODE_HEIGHT}
          maxWidth={MAX_NODE_SIZE}
          maxHeight={MAX_NODE_SIZE}
          keepAspectRatio
          onResizeStart={() => onResizeStart?.(node.id)}
          onResizeEnd={(_event, params: ResizeParams) =>
            onResizeEnd(node.id, normalizeCanvasNodeBounds(params))
          }
        />
      ))}
    </>
  );
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
```

### Task 2: Connect resize interaction to canvas state

**Files:**
- Modify: `front/src/nodes/body-work/space/space-page.tsx`
- Modify: `front/src/nodes/body-work/space/space-workbench.tsx`

- [ ] **Step 1: Keep derived node synchronization paused during resize**

Rename the second `useTransientFlowNodes` argument to describe both drag and resize interactions without changing behavior:

```tsx
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
```

- [ ] **Step 2: Add stable resize callbacks to `CanvasFlow`**

Import `CanvasNodeResizer`, `CanvasNodeResizeHandler`, and `withResizedCanvasNode`; add `resizingNodeId` beside `draggingNodeId`. Store the latest resize callbacks in the existing `nodeActionsRef`, then expose stable actions:

```tsx
const [resizingNodeId, setResizingNodeId] = useState("");

const resizeNode: CanvasNodeResizeHandler = (nodeId, bounds) => {
  const nextNodes = withResizedCanvasNode(nodes, nodeId, bounds);
  setResizingNodeId("");
  if (nextNodes !== nodes) {
    onNodesCommit(nextNodes);
  }
};

nodeActionsRef.current = {
  // existing actions
  onNodeResizeStart: setResizingNodeId,
  onNodeResizeEnd: resizeNode,
};

const stableNodeActions = useMemo(
  () => ({
    // existing actions
    onNodeResizeStart: (nodeId: string) =>
      nodeActionsRef.current.onNodeResizeStart(nodeId),
    onNodeResizeEnd: (nodeId: string, bounds: CanvasNodeBounds) =>
      nodeActionsRef.current.onNodeResizeEnd(nodeId, bounds),
  }),
  [],
);

const { flowNodes, setFlowNodes } = useTransientFlowNodes(
  derivedFlowNodes,
  draggingNodeId || resizingNodeId,
);
```

Add `is-resizing` to `canvasWrapClassName` while a resize is active. This prevents streaming or other parent updates from replacing React Flow's transient dimensions before the pointer is released.

- [ ] **Step 3: Mount the resizer once through selection overlays**

Read the two stable actions from node data in `NodeSelectionOverlays`. Return the shared resizer for asset nodes, keep function nodes fixed, and include the resizer alongside existing settings for power nodes:

```tsx
const onNodeResizeStart = (node as any).onNodeResizeStart as
  | ((nodeId: string) => void)
  | undefined;
const onNodeResizeEnd = (node as any).onNodeResizeEnd as
  | CanvasNodeResizeHandler
  | undefined;
const resizer = (
  <CanvasNodeResizer
    node={node}
    selected={selected}
    onResizeStart={onNodeResizeStart}
    onResizeEnd={onNodeResizeEnd}
  />
);

if (node.type === "asset") {
  return resizer;
}
if (node.type === "function") {
  return null;
}
if (!selected && node.type !== "flow") {
  return resizer;
}
return (
  <>
    {resizer}
    <NodeBottomSettings ... />
  </>
);
```

- [ ] **Step 4: Preserve manually resized power media nodes after reload**

Only provide the existing media natural-size callback while the power node still has its untouched default `180 x 180` dimensions:

```tsx
const canAdoptGeneratedMediaSize =
  node.width === 180 && node.height === 180;

onMediaSize={
  canAdoptGeneratedMediaSize
    ? (width, height) => {
        const nextSize = generatedMediaNodeSize(width, height);
        if (!nextSize || !onNodeResult) return;
        onNodeResult(node.id, nextSize);
      }
    : undefined
}
```

This keeps initial media sizing but prevents a persisted user size from being overwritten when the image or video loads again after refresh.

### Task 3: Style the controls and perform static verification

**Files:**
- Modify: `front/src/nodes/body-work/space/space.css`

- [ ] **Step 1: Add low-noise corner handles**

Append scoped styles for a stable 18-pixel pointer target and a smaller visual corner:

```css
.ws-canvas-wrap .react-flow__resize-control.ws-node-resize-control {
  z-index: 60;
  width: 18px;
  height: 18px;
  border: 0;
  border-radius: 0;
  background: transparent;
  opacity: 0.72;
  transition: opacity 120ms ease;
}

.ws-canvas-wrap .ws-node-resize-control::after {
  content: "";
  position: absolute;
  width: 7px;
  height: 7px;
  border-color: #60746a;
  border-style: solid;
}

.ws-canvas-wrap .ws-node-resize-control.top.left::after {
  right: 2px;
  bottom: 2px;
  border-width: 1.5px 0 0 1.5px;
}

.ws-canvas-wrap .ws-node-resize-control.top.right::after {
  bottom: 2px;
  left: 2px;
  border-width: 1.5px 1.5px 0 0;
}

.ws-canvas-wrap .ws-node-resize-control.bottom.left::after {
  top: 2px;
  right: 2px;
  border-width: 0 0 1.5px 1.5px;
}

.ws-canvas-wrap .ws-node-resize-control.bottom.right::after {
  top: 2px;
  left: 2px;
  border-width: 0 1.5px 1.5px 0;
}

.ws-canvas-wrap .ws-node-resize-control:hover {
  opacity: 1;
}
```

Add an `is-resizing` override for the existing asset/power hover transform so the card does not move while a corner is being dragged.

- [ ] **Step 2: Check the implementation without build or tests**

Run only the permitted static checks:

```bash
git diff --check -- \
  front/src/nodes/body-work/space/space-node-resizer.tsx \
  front/src/nodes/body-work/space/space-page.tsx \
  front/src/nodes/body-work/space/space-workbench.tsx \
  front/src/nodes/body-work/space/space.css

rg -n "CanvasNodeResizer|onNodeResize(Start|End)|withResizedCanvasNode|is-resizing" \
  front/src/nodes/body-work/space
```

Expected: `git diff --check` prints no whitespace errors; `rg` shows one shared resizer implementation, stable canvas callbacks, one overlay mount path, and the scoped styles.

- [ ] **Step 3: Hand off manual browser verification**

Do not run build or tests. Ask the user to verify all four corners, aspect ratio, left-corner position stability, live edge updates, persistence after refresh, content scrolling, node dragging, and absence of controls on agent/flow/function nodes.

Because `space-page.tsx`, `space-workbench.tsx`, and `space.css` already contain unrelated uncommitted work, do not create an implementation commit that would capture those changes. Report the exact files changed instead.
