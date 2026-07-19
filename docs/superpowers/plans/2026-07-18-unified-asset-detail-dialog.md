# Unified Asset Detail Dialog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Body asset list and canvas node detail use one shared full-screen detail-dialog structure while keeping asset content read-only.

**Architecture:** Extract a small shared dialog frame, header, and generic version selector into `body-work/shared`. Keep `AssetDetailDialog` and `NodeDetailDialog` as separate controllers because they use different APIs and permissions; both compose the shared presentation components.

**Tech Stack:** React, TypeScript, lucide-react, existing Dever front plugin APIs and CSS.

---

## File Map

- Create `front/src/nodes/body-work/shared/detail-dialog.tsx`: shared Portal frame, header, action slots, and generic version selector.
- Create `front/src/nodes/body-work/shared/detail-dialog.css`: the only source for shared dialog frame, header, version menu, loading state, history bar, read-only preview, and responsive styles.
- Modify `front/src/nodes/body-work/space/node-detail/node-detail-header.tsx`: adapt canvas node metadata and draft state into the shared header.
- Modify `front/src/nodes/body-work/space/node-detail/version-select.tsx`: retain canvas version normalization as a thin wrapper over the shared selector.
- Modify `front/src/nodes/body-work/space/node-detail/node-detail-dialog.tsx`: compose the shared frame and shared workspace classes without changing canvas save/restore behavior.
- Modify `front/src/nodes/body-work/space/space.css`: remove styles moved to the shared dialog stylesheet; retain editor-, storyboard-, file-, and discard-confirm-specific rules.
- Modify `front/src/nodes/body-work/asset/asset-detail-dialog.tsx`: replace the independent modal with the shared frame/header/version selector and a read-only preview workspace.
- Modify `front/src/nodes/body-work/asset/asset.css`: remove the obsolete `wb-asset-dialog-*` and old version-sidebar rules; retain asset browser/card/picker styles.

### Task 1: Create Shared Detail Dialog Primitives

**Files:**
- Create: `front/src/nodes/body-work/shared/detail-dialog.tsx`
- Create: `front/src/nodes/body-work/shared/detail-dialog.css`

- [ ] **Step 1: Define the normalized version contract**

```tsx
export type DetailVersionOption<T> = {
  id: number;
  version: number;
  updatedAt: string;
  value: T;
};
```

The shared selector only reads this contract. API-specific snake_case/camelCase fields stay in their owning controller.

- [ ] **Step 2: Implement the shared Portal frame**

```tsx
export function DetailDialogFrame({
  ariaLabel,
  header,
  children,
  onRequestClose,
}: {
  ariaLabel: string;
  header: ReactNode;
  children: ReactNode;
  onRequestClose: () => void;
}) {
  const dialog = (
    <div className="wb-detail-backdrop" onMouseDown={onRequestClose}>
      <section
        className="wb-detail-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {header}
        {children}
      </section>
    </div>
  );
  return typeof document === "undefined"
    ? null
    : createPortal(dialog, document.body);
}
```

- [ ] **Step 3: Implement the shared header**

`DetailDialogHeader` accepts `icon`, `title`, `subtitle`, `versionSelect`, `state`, `updatedAt`, `actions`, optional `downloadUrl`, and `onClose`. It owns the close/download icon buttons; canvas save state and asset action buttons are passed as slots.

- [ ] **Step 4: Implement the generic version selector**

`DetailVersionSelect<T>` renders the existing version dropdown behavior from normalized `DetailVersionOption<T>[]`, including current/selected labels, infinite-load trigger, loading, error, retry, and close-on-outside-click.

- [ ] **Step 5: Move common styles into the shared stylesheet**

Use `wb-detail-*` classes for the full-screen frame, three-column header, version dropdown, history bar, scroll area, loading/error state, action buttons, and responsive rules. The read-only preview rules must:

- center image/video and constrain them to the viewport;
- use a wide audio player;
- constrain text/rich-text/file content to a readable width;
- preserve the existing Body font and neutral color tokens;
- collapse header metadata/actions safely on mobile without overlapping.

### Task 2: Migrate Canvas Node Detail to the Shared Frame

**Files:**
- Modify: `front/src/nodes/body-work/space/node-detail/node-detail-header.tsx`
- Modify: `front/src/nodes/body-work/space/node-detail/version-select.tsx`
- Modify: `front/src/nodes/body-work/space/node-detail/node-detail-dialog.tsx`
- Modify: `front/src/nodes/body-work/space/space.css`

- [ ] **Step 1: Make `NodeDetailHeader` a node-specific adapter**

Keep `DetailNodeIcon`, power presentation labels, and save-status calculation in the canvas folder. Return `DetailDialogHeader` instead of duplicating header markup.

- [ ] **Step 2: Make `NodeDetailVersionSelect` a version adapter**

Map each canvas `AssetVersion` to:

```tsx
{
  id: Number(version.id || 0),
  version: Number(version.version || 0),
  updatedAt: String(version.updated_at || version.created_at || ""),
  value: version,
}
```

Pass `option.value` back to the existing `onSelect` callback so canvas history logic remains unchanged.

- [ ] **Step 3: Replace the canvas dialog shell**

Wrap the existing history bar, editor, video composer, and discard confirmation in `DetailDialogFrame`. Preserve `closeDialog`, draft flushing, restore requests, and Escape-key handling exactly as controller behavior.

- [ ] **Step 4: Remove migrated common CSS**

Delete the old frame/header/version/workspace common rules from `space.css`. Keep `.ws-node-detail-editor-*`, media editor, rich editor, storyboard, file editor, and discard-confirm rules, updating their parent selectors to the shared `wb-detail-*` structure where necessary.

- [ ] **Step 5: Static canvas regression audit**

Confirm with `rg` that `saveSpaceAssetEditVersion`, `restoreSpaceAssetVersion`, `draft.flush`, `VideoComposeView`, and `showDiscardConfirm` remain connected after the presentation refactor.

### Task 3: Migrate Asset Detail to the Shared Read-Only Dialog

**Files:**
- Modify: `front/src/nodes/body-work/asset/asset-detail-dialog.tsx`
- Modify: `front/src/nodes/body-work/asset/asset.css`

- [ ] **Step 1: Normalize asset versions for the shared selector**

Map each Body `AssetVersion` to:

```tsx
{
  id: version.id,
  version: version.version,
  updatedAt: version.updatedAt || version.createdAt,
  value: version,
}
```

Continue using `loadAssetDetail`, `loadAssetVersions`, and `loadAssetVersion`; do not call project/canvas APIs.

- [ ] **Step 2: Compose the shared header**

Use `AssetKindIcon`, the asset name, source/kind/role label, shared version selector, `只读预览` state, and the selected version time. Put `使用` and `继续对话/重新生成` in the shared header action slot when their existing conditions are satisfied.

- [ ] **Step 3: Render historical-version actions consistently**

When the selected version is not current, show the shared history bar with the selected version number and a `设为当前` action. After success, replace the detail asset/current preview and call `onAssetChanged` as before.

- [ ] **Step 4: Render the read-only content workspace**

Place `AssetPreview` inside `wb-detail-readonly-content is-${asset.kind}`. Loading, missing asset, version-load error, and retry states use the shared `wb-detail-content-state` layout; no editor or autosave hook is mounted.

- [ ] **Step 5: Preserve close and caller callbacks**

Keep `onSelect`, `onContinue`, `canContinue`, and `onAssetChanged` signatures unchanged so `AssetBrowser`, the asset picker, tool parameters, and dialogue references do not require parallel callback implementations.

- [ ] **Step 6: Delete obsolete asset-dialog CSS**

Remove `wb-asset-dialog-*`, `wb-asset-version-*`, `wb-asset-current-*`, `wb-asset-use-*`, and `wb-asset-continue-*` rules that are no longer referenced. Do not alter asset browser, card, source filter, pagination, or picker styles.

### Task 4: Static Quality Gate

**Files:**
- Check all files changed in Tasks 1-3.

- [ ] **Step 1: Check shared ownership and duplication**

Run:

```bash
rg -n "wb-asset-dialog|ws-node-detail-(backdrop|modal|head|version)" \
  front/src/nodes/body-work
```

Expected: no obsolete asset dialog structure and no duplicated node-only frame/version selectors; editor-specific node selectors may remain.

- [ ] **Step 2: Check API isolation**

Run:

```bash
rg -n "fetchSpaceAsset|saveSpaceAsset|restoreSpaceAsset" \
  front/src/nodes/body-work/asset
```

Expected: no matches. Asset detail must continue using `workbench/*` asset APIs.

- [ ] **Step 3: Run the Dever static audit**

Run:

```bash
bash /root/.agents/skills/shemic-dever/scripts/audit.sh \
  front/src/nodes/body-work/shared/detail-dialog.tsx \
  front/src/nodes/body-work/shared/detail-dialog.css \
  front/src/nodes/body-work/space/node-detail \
  front/src/nodes/body-work/space/space.css \
  front/src/nodes/body-work/asset
```

Expected: `dever skill audit 通过`.

- [ ] **Step 4: Check patch formatting**

Run:

```bash
git diff --check -- \
  front/src/nodes/body-work/shared \
  front/src/nodes/body-work/space/node-detail \
  front/src/nodes/body-work/space/space.css \
  front/src/nodes/body-work/asset
```

Expected: exit code `0` with no output.

- [ ] **Step 5: Record manual verification scope**

Do not run builds or tests. Hand off these manual checks to the user:

1. Open project, tool, dialogue, and upload assets from the Body asset list.
2. Switch current and historical versions and set a historical version current.
3. Verify use/continue actions still close and return to the caller.
4. Open canvas node details and verify editing, autosave, restore, video compose, and discard confirmation.
5. Repeat asset and canvas detail checks on desktop and mobile widths.

No Git commit is created unless the user explicitly requests one.
