# Body Login And Site Configuration Implementation Plan

> 2026-07-21 更新：本文中的飞书占位按钮已由 [Body 飞书登录实施计划](2026-07-21-body-feishu-login.md) 接续替换为真实 OAuth 登录。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore a dedicated Body login page and add typed Body site, login-link, and third-party-account configuration managed from one admin page.

**Architecture:** Three `model/body` models own persistence. Standard page JSON handles all admin writes, while a single public read-only Body API aggregates enabled display configuration for a shared frontend loader used by the login page and workbench brand. The login page remains on the existing authenticated-site sign-in route and reuses the existing user password APIs.

**Tech Stack:** Go, Dever ORM and page JSON, React, TypeScript, Dever front plugin SDK, Lucide icons.

**Project constraints:** Do not run builds or tests. Do not create a Git commit. Verification is limited to formatting, JSON parsing, static search, Dever audit, and manual diff review.

---

### Task 1: Add Typed Body Configuration Models

**Files:**
- Create: `model/body/config.go`
- Create: `model/body/link.go`
- Create: `model/body/account.go`

- [x] **Step 1: Add singleton site configuration**

Define `Config`, `DefaultConfigID`, the default Body brand values, a seed for `id=1`, and `NewConfigModel()` backed by `bot_body_config`.

```go
type Config struct {
    ID               uint64
    SiteName         string
    Logo             string
    Favicon          string
    LoginTitle       string
    LoginDescription string
    CreatedAt        time.Time
    UpdatedAt        time.Time
}
```

- [x] **Step 2: Add login-link model**

Define `Link` with `name`, `url`, `target`, `status`, `sort`, and `created_at`. Add target/status Options, a `status,sort,id` index, and default order `sort asc,id asc`.

- [x] **Step 3: Add third-party-account model**

Define `Account` with stable `provider`, display `name`, optional `icon`, `status`, `sort`, and `created_at`. Add a unique provider index and a seed for `feishu / 使用飞书账户继续`.

- [x] **Step 4: Format the model files**

Run:

```bash
gofmt -w model/body/config.go model/body/link.go model/body/account.go
```

Expected: command exits successfully and only formats these three files.

### Task 2: Replace The Canvas Admin Entry With One Configuration Page

**Files:**
- Delete: `front/page/admin/body/canvas/list.json`
- Delete: `front/page/admin/body/canvas/update.json`
- Create: `front/page/admin/body/config/set.json`
- Create: `front/page/admin/body/link/update.json`
- Create: `front/page/admin/body/account/update.json`

- [x] **Step 1: Build the configuration page shell**

Create a single menu page under `bot-body` with a line or sidebar `nav-tab` targeting `state.currentTab` and the values `site`, `links`, and `accounts`.

```json
{
  "type": "nav-tab",
  "meta": {
    "target": "state.currentTab",
    "variant": "line",
    "tabs": [
      { "label": "站点设置", "value": "site" },
      { "label": "登录链接", "value": "links" },
      { "label": "三方账号", "value": "accounts" }
    ]
  }
}
```

- [x] **Step 2: Add singleton site form**

Use `form-input`, `form-textarea`, and single-image `form-upload` nodes tagged with `meta.tab: "site"`. Load and save `bot.body.NewConfigModel` with the fixed `id=1` and a site-tab-only save button.

- [x] **Step 3: Add login-link table and modal**

Use a named `data.links` model container, `show-table` with `value: "links.list"`, status/sort inline editing, and create/edit/delete feedback controls. Set `reloadDataKey: "links"` where a control needs to reload the named container.

- [x] **Step 4: Add account table and modal**

Use `data.accounts.model: "bot.body.NewAccountModel"`, `value: "accounts.list"`, status/sort inline editing, and create/edit controls. The edit form exposes provider, display name, icon, status, and sort only.

- [x] **Step 5: Add focused update pages**

Create hidden type-2 update pages for links and accounts. Use standard `save` actions with `params: "form"`; do not add CRUD services or APIs.

- [x] **Step 6: Parse all changed page JSON files**

Run:

```bash
jq empty front/page/admin/body/config/set.json front/page/admin/body/link/update.json front/page/admin/body/account/update.json
```

Expected: no output and exit code 0.

### Task 3: Add The Public Login Configuration Read Contract

**Files:**
- Create: `service/body/config.go`
- Create: `api/body/login.go`
- Modify: `dever.json`
- Modify: `docs/superpowers/specs/2026-07-17-body-login-site-config-design.md`

- [x] **Step 1: Aggregate display configuration in the Body service**

Add `Service.LoginConfig(ctx)` returning a stable map containing the singleton config, enabled links, and enabled accounts. Project rows into explicit display maps rather than returning ORM structs directly.

```go
return map[string]any{
    "config": configPayload(config),
    "links": linkPayloads(links),
    "accounts": accountPayloads(accounts),
}, nil
```

- [x] **Step 2: Add a thin public API handler**

Add `type Login struct{}` with `GetConfig`, producing `GET /bot/body/login/config` through the existing route convention and `botapi.WriteJSON`.

- [x] **Step 3: Publicize only the exact read path**

Add `login/config` to `front.sites.body.public`. Keep `access.mode` as `login` and leave all workbench/project APIs protected.

- [x] **Step 4: Align the design document route**

Replace the preliminary `/bot/body/login_config` name with the generated route `/bot/body/login/config`.

- [x] **Step 5: Format backend files and parse Dever config**

Run:

```bash
gofmt -w service/body/config.go api/body/login.go
jq empty dever.json
```

Expected: both commands exit successfully.

### Task 4: Add One Shared Frontend Site-Configuration Loader

**Files:**
- Create: `front/src/nodes/body-work/auth/site-config.ts`
- Create: `front/src/nodes/body-work/auth/site-brand.tsx`

- [x] **Step 1: Define the frontend contract and normalizer**

Define `BodySiteConfig`, `BodyLoginLink`, `BodyLoginAccount`, and `BodyLoginConfig`. Load `joinSiteApi("login/config")`, normalize all unknown response fields once, and fall back to `getSiteConfig()` defaults.

- [x] **Step 2: Add request caching and a reusable hook**

Keep one module-level request promise/cache and expose `useBodyLoginConfig()` so the login page and workbench do not duplicate request and fallback logic.

- [x] **Step 3: Centralize title and favicon side effects**

Expose `applyBodySiteMetadata(config)` to update `document.title` and the favicon link. Keep DOM mutation out of the page render body.

- [x] **Step 4: Add a shared brand component**

Render the configured logo URL when present and fall back to `SiteLogo`. Render the configured site name with safe truncation constraints.

### Task 5: Restore And Redesign The Dedicated Login Page

**Files:**
- Modify: `front/src/nodes/body-work/auth/login-page.tsx`
- Create: `front/src/nodes/body-work/auth/login-page.css`
- Create: `front/src/nodes/body-work/auth/assets/login-artwork.webp`
- Create: `front/src/nodes/body-work/auth/assets/login-pattern.webp`
- Create: `front/src/nodes/body-work/shared/body-theme.css`
- Delete: `front/src/nodes/body-work/auth/auth-dialog.tsx`

- [x] **Step 1: Restore the existing authentication flow**

Move the prior password login/register logic back into `WorkLoginPage`: validate account/password, call `/user/auth/login` or `/user/auth/register`, update `useAuthStore`, reset runtime cache, load main info, and navigate through `resolvePostLoginTarget`.

- [x] **Step 2: Render dynamic header links**

Use `BodySiteBrand` and enabled `body_link` rows. Render safe `target`/`rel` values. On mobile, place non-empty links in an icon-triggered menu; render no empty menu button.

- [x] **Step 3: Render Feishu and password entry**

Render configured third-party account buttons before the password form. For `feishu`, show the configured icon/name and use `toast.info("飞书登录暂未开放")`. Preserve account/password login and registration switching.

- [x] **Step 4: Reproduce the approved editorial login layout**

Use the approved screenshot proportions for the centered header, notice bar, hero copy, login form, background texture, and large right-side artwork. Keep the configured site brand and authentication content instead of copying the reference brand.

- [x] **Step 5: Add desktop and mobile layout rules**

Use a stable two-column desktop grid. On narrow screens, put the form first and render the artwork below it. Prevent horizontal scrolling, overlapping text, and viewport-scaled typography.

### Task 6: Remove Guest Workbench State And Reuse The Dynamic Brand

**Files:**
- Modify: `front/src/nodes/body-work/home/home-shell.tsx`

- [x] **Step 1: Remove guest authentication branches**

Remove `WorkAuthDialog`, `authRedirect`, `authOpen`, guest profile, guest empty-state actions, and all unauthenticated catalog branching. The route already guarantees an authenticated user before this component renders.

- [x] **Step 2: Preserve all current team workbench behavior**

Keep the current menu order `项目 / 对话 / 工具 / 资产`, team picker, project-enabled filtering, catalog loading, asset continuation, and existing responsive behavior unchanged.

- [x] **Step 3: Reuse the shared site brand**

Replace direct `SiteLogo/getSiteConfig` use with `useBodyLoginConfig` plus `BodySiteBrand`, and apply metadata from the same config contract.

- [x] **Step 4: Remove orphaned guest CSS and imports**

Use static search for `WorkAuthDialog`, `authRedirect`, `authOpen`, and `hb-laper-guest` and remove only code owned by the previous guest-login implementation.

### Task 7: Static Verification And Scope Review

**Files:**
- Review every file changed in Tasks 1-6.

- [x] **Step 1: Parse structured configuration**

Run `jq empty` for every changed JSON file. Expected: exit code 0 and no output.

- [x] **Step 2: Format Go sources**

Run `gofmt -w` on only the newly created Go files. Expected: no errors.

- [x] **Step 3: Run Dever static audit**

Run:

```bash
bash /root/.agents/skills/shemic-dever/scripts/audit.sh \
  model/body service/body api/body front/page/admin/body dever.json
```

Expected: no forbidden old page protocol, generated-file edits, or component-boundary violations.

- [x] **Step 4: Search for stale behavior and unsafe permission changes**

Run searches confirming there are no references to `WorkAuthDialog`, no Body `access.mode=public`, no `body_menu`, and no admin page references to `bot/body/canvas`.

- [x] **Step 5: Review the diff without reverting unrelated work**

Use `git diff --` limited to this task's files. Confirm the workbench feature code from prior changes remains intact and no generated or dist file was edited.

- [x] **Step 6: Report verification limits accurately**

Do not claim compilation or runtime success. State that build/tests were not run per user instruction and list the manual login/admin/mobile checks the user must perform.
