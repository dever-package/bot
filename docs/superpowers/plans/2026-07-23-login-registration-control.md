# Login Registration Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make login media and text contrast configurable, and let administrators disable self-registration without duplicating user registration logic.

**Architecture:** `bot_body_config.register_status` is the single persisted switch. The public login configuration exposes a normalized boolean, while a Body-scoped registration endpoint checks the same model value before delegating to `user.AuthService.Register`; the React login page only renders and calls that guarded path.

**Tech Stack:** Go, Dever Model/Page JSON/API/Service, React, TypeScript, CSS.

---

### Task 1: Persist and edit the registration switch

**Files:**
- Modify: `model/body/config.go`
- Modify: `front/page/admin/body/config/set.json`

- [x] Add `DefaultRegisterStatus` and `Config.RegisterStatus`, seed it as enabled, and include it in `DefaultConfig()`.
- [x] Add a login-tab `form-switch` bound to `form.register_status` with `trueValue: 1` and `falseValue: 2`.
- [x] Add `register_status` to the form field whitelist and default form data.
- [x] Change login media help text to describe an optional introduction image and no default background image.

### Task 2: Guard Body login registration on the server

**Files:**
- Create: `service/body/register.go`
- Modify: `service/body/config.go`
- Modify: `api/body/login.go`
- Modify: `dever.json`

- [x] Return `register_enabled` from `loginConfigPayload()` using `register_status == StatusEnabled`.
- [x] Add a focused `RegisterRequest` and `Service.Register()` that rejects disabled registration, then delegates to `userservice.AuthService.Register`.
- [x] Add the thin `Login.PostRegister` request adapter.
- [x] Declare `login/register` as a public Body-site route.

### Task 3: Apply the contract in the login UI

**Files:**
- Modify: `front/src/nodes/body-work/auth/site-config.ts`
- Modify: `front/src/nodes/body-work/auth/login-page.tsx`
- Modify: `front/src/nodes/body-work/auth/login-page.css`

- [x] Add `registerEnabled` to the normalized site config with a backward-compatible enabled fallback.
- [x] Reset register mode when configuration disables it, hide the mode switch, guard submit, and use `joinSiteApi("login/register")`.
- [x] Render the introduction artwork only when the backend provides a valid image.
- [x] Remove bundled desktop and mobile background-image defaults while preserving configured background images and bottom colors.

### Task 4: Static verification

**Files:**
- Verify all modified files above.

- [x] Run `gofmt` on modified Go files.
- [x] Parse modified JSON files.
- [x] Run the Dever static audit for the changed bot model, API, service, and page files.
- [x] Run `git diff --check` and inspect the scoped diff.
- [x] Do not run build, type-check, or tests, per project instruction.

### Task 5: Configure readable login copy

**Files:**
- Modify: `model/body/config.go`
- Modify: `service/body/config.go`
- Modify: `front/page/admin/body/config/set.json`
- Modify: `front/src/nodes/body-work/auth/site-config.ts`
- Modify: `front/src/nodes/body-work/shared/body-appearance.ts`
- Modify: `front/src/nodes/body-work/auth/login-page.css`

- [x] Add the optional `login_text_color` field to the model, seed, default config, form whitelist, and login configuration payload.
- [x] Add a login-tab `form-color` that reuses the shared color node and validates `#RRGGBB`.
- [x] Normalize the color through `BodyAppearanceConfig` and expose it as a page-scoped CSS variable.
- [x] Use white copy automatically when a background image exists and no explicit color is configured.
- [x] Add restrained text shadow only when a background image exists, without changing form or header text colors.
- [x] Run Go formatting, JSON parsing, Dever audit, cross-layer field search, and `git diff --check`; do not run build or tests.

### Task 6: Prevent delayed login appearance

**Files:**
- Modify: `front/src/nodes/body-work/auth/site-config.ts`
- Modify: `front/src/nodes/body-work/auth/login-page.tsx`
- Modify: `front/src/nodes/body-work/auth/login-page.css`

- [x] Expose login configuration readiness without changing existing config consumers.
- [x] Hold the login UI until its configuration and configured background image are ready.
- [x] Extend a configured login background color or image beneath the fixed header.
- [x] Run the Dever static audit and `git diff --check`; do not run build, type-check, or tests.

### Task 7: Share rich filing content across login and workbench

**Files:**
- Modify: `model/body/config.go`
- Modify: `service/body/config.go`
- Modify: `front/page/admin/body/config/set.json`
- Modify: `front/src/nodes/body-work/auth/site-config.ts`
- Modify: `front/src/nodes/body-work/auth/login-page.tsx`
- Modify: `front/src/nodes/body-work/auth/login-page.css`
- Modify: `front/src/nodes/body-work/home/workbench-user-menu.tsx`
- Modify: `front/src/nodes/body-work/home/workbench-sidebar.css`
- Modify: `front/src/nodes/body-work/shared/body-filing.tsx`

- [x] Persist Dever rich-text JSON in one Body config field and expose it through the existing login configuration response.
- [x] Put the shared filing editor at the bottom of Site Configuration and remove the separate filing tab without deleting legacy database fields.
- [x] Render rich content through the public `RichTextView`, with the existing structured filing rows as an empty-content fallback.
- [x] Keep the desktop filing footer in the first viewport and compact short desktop layouts instead of moving the footer into document flow.
- [x] Run Go formatting, JSON parsing, Dever audit, cross-layer searches, and `git diff --check`; do not run build, type-check, or tests.
