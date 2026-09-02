# Canvas Rule Boundaries Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent canvas reads from mutating historical data and centralize function-node and run-status semantics without changing the persisted canvas protocol.

**Architecture:** Keep storyboard graph materialization in the existing canvas editing flow, but invoke it only after an explicit storyboard source change. Move repeated function-node decisions into focused frontend and backend semantic owners; keep legacy title inference only at the canvas read boundary.

**Tech Stack:** React, TypeScript, Node test runner, Go, Dever bot Service.

---

### Task 1: Lock the current contracts with failing tests

**Files:**

- Create: `test/canvas_rule_boundaries_test.go`
- Create: `test/storyboard_materialization.test.ts`

- [x] Assert canvas startup does not call storyboard materialization or mark a canvas dirty.
- [x] Assert storyboard refresh preserves manually removed structure while explicit materialization remains available.
- [x] Assert same-detail refresh, real version changes, and catalog-loading deferral as executable behaviors.
- [x] Assert known function keys expose one stable behavior definition and unknown keys are rejected.

### Task 2: Make storyboard loading read-only

**Files:**

- Modify: `front/src/nodes/body-work/space/space-page.tsx`
- Modify: `front/src/nodes/body-work/space/space-storyboard-derived-groups.ts`
- Create: `front/src/nodes/body-work/space/space-storyboard-materialization.ts`

- [x] Remove catalog-triggered synchronization from the page load path.
- [x] Expose separate explicit materialization and existing-structure refresh operations.
- [x] Materialize only the changed storyboard source; refresh for same-detail and ordinary result updates.
- [x] Defer materialization until the power catalog is ready, then process only queued source nodes.
- [x] Refresh result signatures after execution without creating, deleting, or laying out nodes.

### Task 3: Centralize frontend function-node semantics

**Files:**

- Create: `front/src/nodes/body-work/space/space-function.ts`
- Modify: `front/src/nodes/body-work/space/space-model.ts`
- Modify: `front/src/nodes/body-work/space/space-add-node-menu.tsx`
- Modify: `front/src/nodes/body-work/space/space-execution-plan.ts`
- Modify: `front/src/nodes/body-work/space/space-page.tsx`

- [x] Define the four supported keys and their visible-result, backend-run, persistence, and stop behavior once.
- [x] Resolve exact historical titles only in `normalizeCanvasNode`; all runtime callers use the normalized key.
- [x] Replace repeated key branches with the semantic helper where behavior is identical.
- [x] Make unsupported function actions return an explicit error instead of a fake success result.

### Task 4: Centralize backend function-node semantics

**Files:**

- Create: `service/project/workspace_function.go`
- Modify: `service/project/assistant_canvas_patch.go`
- Modify: `service/project/workspace_run.go`
- Modify: `service/project/workspace_run_helper.go`
- Modify: `service/project/workspace_runs.go`
- Modify: `service/project/workspace_group.go`

- [x] Define supported, runnable, persistent, result-bearing, stopping, and input-count semantics once.
- [x] Reuse those helpers in planning, validation, recovery, group output selection, and assistant patch validation.
- [x] Preserve the existing execution behavior and payload fields.

### Task 5: Reuse canonical run-status normalization

**Files:**

- Modify: `front/src/nodes/body-work/space/space-runner.ts`
- Modify: `front/src/nodes/body-work/space/space-page.tsx`

- [x] Move nested node-result status normalization into the runner boundary.
- [x] Replace local terminal-status aliases with the existing runtime status helpers.

### Task 6: Verify and clean up

**Files:**

- Verify all files changed above.

- [x] Run the focused Go and Node behavior tests without a frontend build.
- [x] Check TypeScript syntax for the changed files and compile the backend project package with read-only dependencies.
- [x] Run Dever's targeted static audit and `git diff --check`.
- [x] Confirm no generated `front/dist` file, database model, public API, or persisted canvas field changed.
