# Canvas Content View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让所有画布节点和共享结果视图统一解析 Markdown、`rich_json` 与混合媒体输出。

**Architecture:** 共享协议组件导出通用名称 `ContentView`，画布通过单一 `CanvasNodeContentView` 适配 compat module、fallback 和 streaming。节点只保留布局与纯媒体尺寸职责，不再分别解析输出格式。

**Tech Stack:** React、TypeScript、Dever front plugin compat module、ReactMarkdown、Tiptap rich JSON。

---

### Task 1: Rename the shared protocol renderer

**Files:**
- Modify: `../../../front/src/components/energon/content-view.tsx`
- Modify: `front/src/nodes/show/agent-result.tsx`
- Modify: `front/src/nodes/show/stream-request.tsx`
- Modify: `front/src/nodes/show/team-workspace/debug-panel.tsx`
- Modify: `front/src/nodes/show/agent-content-output.tsx`
- Modify: `front/src/nodes/show/agent-chat/message-output.tsx`
- Modify: `../../../front/src/components/assistant/drawer.tsx`

- [ ] **Step 1: Export the generic component name**

Rename the existing prop type and function without changing its body, then retain the old symbol as an alias:

```diff
-type EnergonContentViewProps = {
+export type ContentViewProps = {
   output?: any
   streaming?: boolean
   emptyText?: string
 }

-export function EnergonContentView({
+export function ContentView({
   output,
   streaming = false,
   emptyText = '暂无内容。',
   className,
   uploadRules,
   mediaLayout = 'default',
   mediaPreviewLayerZIndex,
   onMediaPreview,
-}: EnergonContentViewProps) {
+}: ContentViewProps) {
   const items = normalizeEnergonOutput(output)
   // Keep the existing render body below this line unchanged.
 }

+export const EnergonContentView = ContentView
```

- [ ] **Step 2: Update source consumers**

Replace imports and JSX usage from `EnergonContentView` to `ContentView`. Keep `EnergonOutput` and `normalizeEnergonOutput` names unchanged.

### Task 2: Add the canvas adapter

**Files:**
- Create: `front/src/nodes/body-work/space/space-content-view.tsx`
- Modify: `front/src/nodes/body-work/space/space-page.tsx`

- [ ] **Step 1: Implement `CanvasNodeContentView`**

Resolve `ContentView` through `getCompatModule`, use fallback text only when output is empty, and pass streaming state through:

```tsx
function hasCanvasContent(value: unknown) {
  if (value == null || value === '') return false
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'object') return Object.keys(value).length > 0
  return true
}

export function CanvasNodeContentView({ output, fallback, streaming, className }: Props) {
  const resolvedOutput = hasCanvasContent(output) ? output : fallback ? { text: fallback } : output
  return ContentView ? (
    <ContentView output={resolvedOutput} streaming={streaming} emptyText="暂无内容" className={className} />
  ) : (
    <p className={className}>{fallback}</p>
  )
}
```

- [ ] **Step 2: Centralize composite-output selection**

Use normalized output to identify text, rich, reasoning, errors, JSON or multiple blocks. Pure media may keep the existing optimized renderer; composite output must use `CanvasNodeContentView`.

### Task 3: Route every canvas result surface through the adapter

**Files:**
- Modify: `front/src/nodes/body-work/space/space-page.tsx`

- [ ] **Step 1: Replace text and rich branches**

Update asset details, text asset cards, function result cards and node result bubbles so Markdown and rich JSON use `CanvasNodeContentView` rather than `<p>` or direct rich-first branches.

- [ ] **Step 2: Update power streaming**

Pass the partial text as `{ text: streamText }`, set `streaming`, keep the outer scroll ref and remove the duplicated local cursor.

- [ ] **Step 3: Preserve pure-media sizing**

Keep the current image/video/audio/file branches only when normalized output has no text/rich/composite content. This preserves `onLoad` sizing without truncating mixed content.

### Task 4: Align canvas content styles

**Files:**
- Modify: `front/src/nodes/body-work/space/space.css`

- [ ] **Step 1: Add shared node content styles**

Apply compact typography, list indentation, code/table overflow and media constraints under `.ws-canvas-content-view`. Keep `.ws-node-scroll-content` as the only scrolling owner.

- [ ] **Step 2: Remove obsolete duplicate text/rich selectors**

Delete selectors that only supported the replaced `<p>`/rich branches when they are no longer referenced.

### Task 5: Static verification

**Files:**
- Inspect all modified source files.

- [ ] **Step 1: Check consumer coverage**

Run `rg -n "EnergonContentView|CanvasNodeContentView|ContentView" front/src ../../../front/src` and confirm old-name usage remains only at the compatibility alias.

- [ ] **Step 2: Check formatting defects**

Run `git diff --check` and inspect the focused diff. Do not run build or tests per project instruction.

- [ ] **Step 3: Hand off manual cases**

Ask the user to verify plain Markdown, rich JSON, mixed text/image, pure media, scrolling, dragging and streaming in the running canvas.
