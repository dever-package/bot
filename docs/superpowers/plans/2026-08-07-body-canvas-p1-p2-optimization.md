# Body Canvas P1/P2 Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce Body canvas startup latency and runtime render fan-out while replacing the untyped React Flow node-data contract with focused, reusable boundaries.

**Architecture:** Keep the existing React Flow visibility rendering, node caches, stream batching, and category-scoped API loading. Remove redundant route loading and broad speculative preloads, lazy-load only heavy specialized node views, project global runtime state into stable per-node data, and move the always-visible flow action into a lightweight component. Avoid mechanical file splitting that does not change bundle boundaries.

**Tech Stack:** React, TypeScript, `@xyflow/react`, Dever front plugin runtime, Vite dynamic imports.

---

### Task 1: Preserve a recoverable baseline

**Files:**
- Create: `/data/project/shemic/backups/backend-package-bot_before-body-canvas-p1-p2_20260807_012332.tar.gz`
- Create: `/data/project/shemic/backups/backend-package-bot_before-body-canvas-p1-p2_20260807_012332.tar.gz.sha256`

- [x] **Step 1: Archive the complete current `backend/package/bot` component**

  Preserve tracked, untracked, generated, and repository metadata exactly as they exist before this task.

- [x] **Step 2: Verify archive readability and SHA-256**

  Expected SHA-256: `abbf5bdfe41f178e7128d6d207e1b09a405c135f140946a51f05bfc476c1db8c`.

### Task 2: Remove redundant startup and speculative loading

**Files:**
- Modify: `front/src/nodes/body-work/space/space-entry.tsx`
- Modify: `front/src/nodes/body-work/space/space-page.tsx`

- [x] **Step 1: Remove the inner `React.lazy` boundary**

  Import `WorkSpacePage` synchronously inside the already lazily registered plugin route. Keep `CanvasStartupLoading` for bootstrap/API loading.

- [x] **Step 2: Remove canvas-wide pointer-entry preloads**

  Do not fetch node detail and prompt composer modules merely because the pointer entered the canvas.

- [x] **Step 3: Retain intent-based preloads**

  Preload detail on node/detail intent, preload the complete settings module only for power/agent nodes that use composer settings, and load the add-node menu from its actual opening path.

### Task 3: Make heavy node views conditional

**Files:**
- Modify: `front/src/nodes/body-work/space/space-optional-components.ts`
- Modify: `front/src/nodes/body-work/space/space-page.tsx`

- [x] **Step 1: Add shared preloadable module boundaries**

  Move storyboard content and storyboard-grid canvas views behind the existing `createPreloadableModule` mechanism. Keep ordinary node renderers synchronous.

- [x] **Step 2: Load only when the matching node actually renders**

  Keep specialized storyboard, grid, and video-compose views behind their render-time lazy boundaries. Do not scan the whole canvas merely to speculate about a future module load.

- [x] **Step 3: Preserve non-blank Suspense fallbacks**

  Storyboard, grid, and video-compose nodes must continue showing the existing canvas loading state during a first module fetch.

### Task 4: Replace the untyped React Flow node-data contract

**Files:**
- Create: `front/src/nodes/body-work/space/space-node-runtime.ts`
- Modify: `front/src/nodes/body-work/space/space-group-runtime.ts`
- Modify: `front/src/nodes/body-work/space/space-page.tsx`

- [x] **Step 1: Define one `WorkspaceNodeData` contract**

  The contract owns the domain node, runtime state, input context, references, interaction flags, and node actions. Remove UI-layer `(data as any)` reads.

- [x] **Step 2: Project global running state into stable values**

  Pass a boolean to start nodes and a derived summary to group nodes instead of the complete `runningNodes` map.

- [x] **Step 3: Preserve the existing node object cache**

  Compare group summaries by value so unrelated stream progress updates reuse cached group/start node data.

### Task 5: Extract the lightweight flow run control

**Files:**
- Create: `front/src/nodes/body-work/space/space-flow-run-control.tsx`
- Modify: `front/src/nodes/body-work/space/space-page.tsx`

- [x] **Step 1: Render flow execution without `NodeBottomSettings`**

  Preserve the existing button appearance, running state, feedback clearing, backend runner, and error toast.

- [x] **Step 2: Remove unreachable flow branches from the heavy settings component**

  Power/agent composer behavior and selected asset/function behavior remain unchanged.

### Task 6: Static review and handoff

**Files:**
- Review: all files changed above

- [x] **Step 1: Format only changed TypeScript files**

  Use the repository formatter without invoking a build or test command.

  The component has no configured formatter executable or script, so the
  changed sections were formatted and reviewed manually without installing a
  new dependency.

- [x] **Step 2: Run allowed static checks**

  Run Dever audit for changed source, inspect unresolved names/imports with source searches, and run `git diff --check`.

- [x] **Step 3: Review bundle-boundary intent from source**

  Confirm there is one route lazy boundary, no canvas-wide optional-module preload, no `canvasRunningNodes` node-data field, and no node UI `NodeProps<any>` contract.

- [x] **Step 4: Leave functional verification to the project maintainer**

  Do not run `npm run build`, `dever build`, TypeScript test commands, or any test suite. Report the exact manual flows that still require browser verification.

### Task 7: Converge the remaining canvas boundaries

**Files:**
- Create: `front/src/nodes/body-work/space/space-node-settings.tsx`
- Create: `front/src/nodes/body-work/space/space-node-runtime.ts`
- Create: `front/src/nodes/body-work/space/space-composer-reference.ts`
- Create: `front/src/nodes/body-work/space/space-power-param-runtime.ts`
- Modify: `front/src/nodes/body-work/space/space-page.tsx`
- Modify: `front/src/nodes/body-work/space/space-optional-components.ts`
- Modify: `front/src/nodes/body-work/space/space-model.ts`
- Modify: `front/src/nodes/body-work/space/space-power-param.ts`
- Modify: `front/src/nodes/body-work/space/space-media-references.tsx`
- Modify: `front/src/nodes/body-work/space/space-storyboard-frame.ts`
- Modify: `front/src/nodes/body-work/space/space-prompt-composer.tsx`
- Modify: `front/src/nodes/body-work/space/types.ts`
- Modify: `front/src/nodes/body-work/space/space.css`

- [x] **Step 1: Preserve the convergence baseline**

  Archive and verify the complete component at `/data/project/shemic/backups/backend-package-bot_before-canvas-convergence_20260807_023541.tar.gz` before changing the large canvas page.

- [x] **Step 2: Extract the selected-node settings boundary**

  Move power/agent composer state and side effects out of `space-page.tsx`. Keep one lazy settings boundary and remove unreachable asset/function/default settings branches and their dead CSS.

- [x] **Step 3: Consolidate shared domain and runtime helpers**

  Share composer draft normalization, parameter merging, reference-library construction, multi-image planning, power-runtime adaptation, and the typed React Flow node contract. Keep `ComposerAssetItem` in `types.ts` so domain modules do not depend on a UI component.

- [x] **Step 4: Establish one execution owner**

  Route node settings and function actions through the canonical backend runner. Centralize common run-input construction and post-run recovery without duplicating global running-state ownership.

- [x] **Step 5: Precompute canvas render indexes**

  Index node results, group members, dependency blocking, input contexts, media connections, and storyboard ownership outside the per-node render loop. Reuse precomputed storyboard run summaries across progress updates.

- [x] **Step 6: Complete the allowed quality gate**

  Parse all 81 canvas TypeScript/TSX files, inspect unused imports and runtime import cycles, verify CSS balance, run the Dever source audit, and run `git diff --check`. Build, typecheck, and tests remain intentionally unexecuted per project instruction.

### Task 8: Complete the canvas runtime pass

**Files:**
- Modify: `front/src/nodes/body-work/space/space-page.tsx`
- Modify: `front/src/nodes/body-work/space/use-space-power-catalog.ts`

- [x] **Step 1: Preserve the final-pass baseline**

  Archive and verify the complete component at `/data/project/shemic/backups/backend-package-bot_before-canvas-final-pass_20260807_045518.tar.gz` before editing the current working tree.

- [x] **Step 2: Restore runtime imports**

  Import running-node predicates as JavaScript values so the canvas cannot erase them through a type-only import during bundling.

- [x] **Step 3: Stabilize the React Flow render boundary**

  Keep parent canvas actions and React Flow event props referentially stable, memoize the workbench boundary, reuse a constant multi-selection key configuration, and remove the unused selected-node dependency from node projection.

- [x] **Step 4: Stop rescanning loaded catalogs**

  Preserve the catalog requirement once loaded so subsequent canvas updates short-circuit the full canvas capability scan.

- [x] **Step 5: Complete allowed static verification**

  Parse the changed TypeScript/TSX sources, run the Dever source audit, inspect the React Flow prop boundary, and run `git diff --check`. Build, typecheck, and tests remain intentionally unexecuted per project instruction.

- [ ] **Step 6: Complete browser verification**

  The project maintainer verifies initial canvas loading, node selection and dragging, viewport persistence, node execution progress, category switching, and catalog-backed storyboard behavior.
