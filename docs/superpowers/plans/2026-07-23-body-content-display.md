# Body Content Display Implementation Plan

> **For agentic workers:** execute inline in the current workspace. The project explicitly forbids build/test commands and Git commits for this task.

**Goal:** Add a configurable workbench “内容” entry for one selected category, and let login-page single links open public content articles without duplicating article bodies.

**Architecture:** `bot_body_config.content_category_id` owns the workbench category binding. `bot_body_content_article.visibility` owns anonymous versus login-only access. Authenticated content endpoints expose the configured category; one exact public endpoint exposes only enabled public articles. The existing public login page renders public articles through a query parameter, avoiding a second public site shell.

**Tech Stack:** Dever Model/Page JSON/Service/API, Go, React, TypeScript, existing Body theme variables and `RichTextView` compatibility module.

---

### Task 1: Persist Content Display Configuration

**Files:**
- Modify: `model/body/config.go`
- Modify: `model/body/content_category.go`
- Modify: `model/body/content_article.go`
- Modify: `model/body/function.go`
- Modify: `model/body/link.go`

- [x] Add the configured workbench category to the single-site config.
- [x] Add `public` and `login` article visibility, defaulting existing/new content to login-only.
- [x] Add the fixed `content` function entry with configurable display metadata.
- [x] Extend single links to choose an external URL or a public article while preserving existing URL rows.

### Task 2: Extend Admin Pages

**Files:**
- Modify: `front/page/admin/body/config/set.json`
- Modify: `front/page/admin/body/content_article/list.json`
- Modify: `front/page/admin/body/content_article/update.json`
- Modify: `front/page/admin/body/link/update.json`

- [x] Add “前台展示分类” to the function settings tab and save it through the existing Config model.
- [x] Add article visibility to create/edit and list views.
- [x] Add conditional single-link fields for external URL versus public article.

### Task 3: Add Read-Only Content Services

**Files:**
- Create: `service/body/content.go`
- Create: `api/body/content.go`
- Modify: `service/body/config.go`
- Modify: `dever.json`

- [x] Return enabled article names from the configured enabled category to authenticated users.
- [x] Return authenticated article detail only when it belongs to that configured category.
- [x] Return anonymous detail only for enabled public articles in enabled categories.
- [x] Publish only the exact `content/public` endpoint; keep list/detail authenticated.
- [x] Normalize login-page links so invalid or non-public article links are omitted.

### Task 4: Render Shared Article Views

**Files:**
- Create: `front/src/nodes/body-work/shared/body-rich-text.tsx`
- Modify: `front/src/nodes/body-work/shared/body-filing.tsx`
- Create: `front/src/nodes/body-work/content/content-api.ts`
- Create: `front/src/nodes/body-work/content/content-article-view.tsx`
- Create: `front/src/nodes/body-work/content/workbench-content-page.tsx`
- Create: `front/src/nodes/body-work/content/public-content-page.tsx`
- Create: `front/src/nodes/body-work/content/content-page.css`
- Create: `front/src/nodes/body-work/home/workbench-content-menu.tsx`
- Modify: `front/src/nodes/body-work/auth/site-config.ts`
- Modify: `front/src/nodes/body-work/auth/login-page.tsx`
- Modify: `front/src/nodes/body-work/home/home-shell.tsx`
- Modify: `front/src/nodes/body-work/home/workbench-sidebar.tsx`
- Modify: `front/src/nodes/body-work/home/workbench-sidebar.css`

- [x] Extract one Body rich-text renderer and reuse it for filing and content.
- [x] Load authenticated content navigation once and hide the menu when no usable article exists.
- [x] Show article titles on hover/focus and open one detail in the workbench main area.
- [x] Resolve article links against the current login path and render public content from `content_id`.
- [x] Preserve current Body branding, theme surfaces, mobile navigation, loading, empty and error states.

### Task 5: Restricted Verification

- [x] Run `gofmt` on changed Go files.
- [x] Parse changed Page JSON files.
- [x] Run the Dever static audit on all changed paths.
- [x] Run `git diff --check`, including untracked files through no-index checks.
- [x] Do not run build, type-check, tests, or create a commit; report manual runtime checks explicitly.
