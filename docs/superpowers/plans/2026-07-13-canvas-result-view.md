# Canvas Result View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify agent/flow result bubbles and display-function result cards with the canvas content renderer, edge-aligned scrolling, persisted proportional resizing, and resize handles that work on corner hover without selecting the node first.

**Architecture:** A reusable `CanvasResultView` owns result presentation and delegates Markdown, rich JSON, and mixed media to the existing `CanvasNodeContentView`. A consolidated `space-resizer.tsx` owns shared resize constraints and exposes a React Flow adapter for real nodes plus a Pointer Events adapter for attached result cards. Node dimensions and attached-result dimensions continue through the existing canvas JSON/autosave path; no runtime or backend API changes are required.

**Tech Stack:** React, TypeScript, `@xyflow/react` 12, existing shared `ContentView`, existing canvas autosave, CSS.

**Project constraint:** Do not run `npm run build` or any automated test command. The user will test in the browser. Verification is limited to Dever static audit, source/reference inspection, and `git diff --check`.

---

### Task 1: Add persisted attached-result dimensions

**Files:**
- Modify: `front/src/nodes/body-work/space/types.ts`
- Modify: `front/src/nodes/body-work/space/space-canvas-state.ts`
- Modify: `front/src/nodes/body-work/space/space-model.ts`

- [ ] **Step 1: Add the result view state to the canvas node contract**

Add one focused type and reference it from `SpaceCanvasNode`:

```ts
export type CanvasResultViewState = {
  width: number;
  height: number;
  offsetX?: number;
  offsetY?: number;
};

export type SpaceCanvasNode = {
  // existing fields
  resultView?: CanvasResultViewState;
};
```

- [ ] **Step 2: Serialize result dimensions through the existing canvas JSON**

Extend `PersistedCanvasNode` with `result_view` and add a dedicated serializer so optional offsets may be negative:

```ts
type PersistedCanvasResultView = {
  width: number;
  height: number;
  offset_x?: number;
  offset_y?: number;
};

function persistedResultView(
  value: SpaceCanvasNode["resultView"],
): PersistedCanvasResultView | undefined {
  if (!value) return undefined;
  const width = Number(value.width);
  const height = Number(value.height);
  if (!Number.isFinite(width) || !Number.isFinite(height)) return undefined;
  const result: PersistedCanvasResultView = { width, height };
  if (Number.isFinite(Number(value.offsetX))) result.offset_x = Number(value.offsetX);
  if (Number.isFinite(Number(value.offsetY))) result.offset_y = Number(value.offsetY);
  return result;
}
```

Assign the result in `persistedCanvasNode` without changing the existing autosave contract.

- [ ] **Step 3: Normalize old and new canvas payloads**

Add `normalizeCanvasResultView` and read both snake-case persisted data and camel-case in-memory compatibility data:

```ts
function normalizeCanvasResultView(value: unknown) {
  const row = asRecord(value);
  const width = finiteNumber(row.width);
  const height = finiteNumber(row.height);
  if (width == null || height == null || width <= 0 || height <= 0) {
    return undefined;
  }
  const offsetX = finiteNumber(firstDefined(row.offset_x, row.offsetX));
  const offsetY = finiteNumber(firstDefined(row.offset_y, row.offsetY));
  return {
    width,
    height,
    ...(offsetX == null ? {} : { offsetX }),
    ...(offsetY == null ? {} : { offsetY }),
  };
}
```

Old canvas data without `result_view` must continue to load with defaults.

### Task 2: Consolidate node and attached-card resize behavior

**Files:**
- Create: `front/src/nodes/body-work/space/space-resizer.tsx`
- Delete: `front/src/nodes/body-work/space/space-node-resizer.tsx`

- [ ] **Step 1: Move the current React Flow resizer into the shared module**

Keep `CanvasNodeBounds`, `CanvasNodeResizeHandler`, and `withResizedCanvasNode`. Change `CanvasNodeResizer` to accept an explicit `resizable` flag and remove the `selected` requirement:

```tsx
export function CanvasNodeResizer({ node, enabled, resizable, onResizeStart, onResizeEnd }: Props) {
  if (!enabled || !resizable || !onResizeEnd) return null;
  return RESIZE_CORNERS.map(({ position }) => (
    <NodeResizeControl
      key={position}
      position={position}
      className="ws-resize-control ws-node-resize-control nodrag nopan"
      minWidth={MIN_RESULT_WIDTH}
      minHeight={MIN_RESULT_HEIGHT}
      maxWidth={MAX_RESULT_SIZE}
      maxHeight={MAX_RESULT_SIZE}
      keepAspectRatio
      onResizeStart={() => onResizeStart?.(node.id)}
      onResizeEnd={(_event, params) =>
        onResizeEnd(node.id, normalizeCanvasNodeBounds(params))
      }
    />
  ));
}
```

- [ ] **Step 2: Add proportional bounds calculation for attached cards**

Export a pure `resizeFloatingResultView` helper. It selects the dominant pointer axis, clamps width by both width and height limits, preserves the starting ratio, and adjusts offsets only for the dragged left/top side:

```ts
const nextWidth = clamp(
  Math.abs(deltaX) >= Math.abs(deltaY * ratio)
    ? start.width + horizontalDirection * deltaX
    : (start.height + verticalDirection * deltaY) * ratio,
  Math.max(MIN_RESULT_WIDTH, MIN_RESULT_HEIGHT * ratio),
  Math.min(MAX_RESULT_SIZE, MAX_RESULT_SIZE * ratio),
);
const nextHeight = nextWidth / ratio;
```

Normalize final values to whole pixels before persistence.

- [ ] **Step 3: Add a Pointer Events adapter for attached cards**

`CanvasFloatingResizer` renders the same four transparent corner targets, captures the pointer, emits local preview changes during movement, and calls `onResizeEnd` once on pointer up/cancel. Every handle must stop propagation and carry `nodrag nopan nowheel` so resizing cannot move a React Flow node, pan the canvas, or open details.

### Task 3: Build the reusable result view

**Files:**
- Create: `front/src/nodes/body-work/space/space-result-view.tsx`

- [ ] **Step 1: Centralize result presentation**

Create `CanvasResultView` with `output`, `fallback`, `preview`, `className`, `style`, optional detail action, and optional resize controls. It must render one `.ws-result-view-scroll.ws-node-scroll-content` content layer.

- [ ] **Step 2: Keep structured content on the shared renderer**

When `contentOutputNeedsRenderer(output)` is true, render:

```tsx
<CanvasNodeContentView
  output={output}
  fallback={fallback}
  className="ws-canvas-content-view ws-result-content-view"
/>
```

This remains the only Markdown/rich JSON/mixed-media protocol path.

- [ ] **Step 3: Centralize pure media fallbacks**

For a pure image, video, audio, or file preview, render the existing media semantics inside the same scroll layer. Do not stringify structured output before giving `CanvasNodeContentView` a chance to recognize it.

- [ ] **Step 4: Isolate detail interaction from embedded controls**

Preserve Enter/Space detail access, but ignore click activation from links, buttons, audio/video controls, and resize handles. This keeps rich content usable without accidental detail opening.

### Task 4: Integrate unified results and persisted resizing

**Files:**
- Modify: `front/src/nodes/body-work/space/space-page.tsx`

- [ ] **Step 1: Replace duplicated bubble/card content branches**

Delete `NodeResultBubbleContent`. Render both `NodeResultBubble` and `FunctionResultCard` through `CanvasResultView`, passing their already-derived `contentOutput`, fallback text, and media preview.

- [ ] **Step 2: Add stable attached-result state updates**

Add a `CanvasResultViewChangeHandler` to the existing node action ref and stable node data. The handler immutably updates only `node.resultView` and calls `onNodesCommit` once after the pointer interaction:

```ts
const resizeResultView = (nodeId: string, resultView: CanvasResultViewState) => {
  const nextNodes = nodes.map((node) =>
    node.id === nodeId ? { ...node, resultView } : node,
  );
  onNodesCommit(nextNodes);
};
```

`NodeResultBubble` maintains only transient local dimensions during drag and synchronizes them when persisted props change.

- [ ] **Step 3: Allow display-result cards to use saved node dimensions**

Update `canvasNodeStyleSize` so a display function result uses `node.width/node.height` after the user has resized it, otherwise keeps the existing `330 x 250` first-result default. Import/save behavior remains unchanged.

- [ ] **Step 4: Expand React Flow resize eligibility without selection**

`NodeSelectionOverlays` computes one predicate:

```ts
const resizable =
  node.type === "asset" ||
  node.type === "power" ||
  (node.type === "function" &&
    node.functionOption?.key === "display" &&
    shouldRenderFunctionResultCard(node));
```

Mount `CanvasNodeResizer` for that predicate whenever the canvas is editable. Do not render settings for function nodes, and do not gate controls on `selected`.

- [ ] **Step 5: Keep read-only mode and existing runtime paths unchanged**

Pass the existing `interactive` flag to both resizers. Do not change canvas execution, agent/flow runtime, ability streaming, result extraction, API calls, or backend services.

### Task 5: Apply shared result and hover-resize styling

**Files:**
- Modify: `front/src/nodes/body-work/space/space.css`

- [ ] **Step 1: Give all result surfaces the same edge-scroll layout**

Add `.ws-result-view` and `.ws-result-view-scroll` rules. Remove effective fixed `max-height`/`overflow: hidden` constraints from agent bubbles and result content, and let the inner `.ws-node-scroll-content` own vertical scrolling and the existing subtle edge scrollbar.

- [ ] **Step 2: Reveal resize corners on hover**

Keep the 18-pixel transparent hit targets active while visual corners default to `opacity: 0`. Reveal them with:

```css
.react-flow__node:hover .ws-node-resize-control,
.ws-result-view:hover .ws-floating-resize-control,
.ws-resize-control:hover {
  opacity: 1;
}
```

Use the existing four corner border shapes and cursor directions for both adapters.

- [ ] **Step 3: Preserve stable layout during resize**

Extend the existing `.is-resizing` hover-transform override to display result cards. Ensure scrollbars, labels, handles, and resize targets do not resize or shift their parent layout.

### Task 6: Static review and handoff

**Files:**
- Review all files above.

- [ ] **Step 1: Inspect all imports and stale references**

Use `rg` to confirm no runtime reference remains to `space-node-resizer`, `NodeResultBubbleContent`, duplicated result media branches, or selection-gated resize logic.

- [ ] **Step 2: Run permitted static checks only**

Run the Dever audit command from `backend/package/bot`, then `git diff --check`. Do not run a build, typecheck, lint suite, or test command.

- [ ] **Step 3: Self-review the diff**

Confirm the implementation has one content renderer, one pure-media fallback, one set of resize limits, one persisted attached-result schema, and no backend/runtime changes caused by this task.

- [ ] **Step 4: Provide focused manual test cases**

Hand off browser checks for Markdown, rich JSON, mixed media, scroll placement, all four resize corners, no-selection interaction, node dragging, edge updates, read-only mode, and refresh persistence.
