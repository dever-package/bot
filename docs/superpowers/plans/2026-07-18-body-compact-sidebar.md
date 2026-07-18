# Body Compact Sidebar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Body 工作台左侧导航收窄为固定紧凑栏，并补齐用户菜单、团队切换、主题切换和可配置备案信息。

**Architecture:** 继续复用现有 Body 配置模型与登录配置接口，不新增平行业务 API。首页只负责页面编排，紧凑侧栏和用户菜单拆为独立组件；主题状态统一复用宿主 `ThemeProvider`，画布不再维护第二套本地主题。

**Tech Stack:** Go/Dever ORM、Dever page JSON、React、TypeScript、CSS、front plugin SDK。

---

### Task 1: 扩展 Body 基础配置

**Files:**
- Modify: `backend/package/bot/model/body/config.go`
- Modify: `backend/package/bot/service/body/config.go`
- Modify: `backend/package/bot/front/page/admin/body/config/set.json`
- Modify: `backend/package/bot/front/src/nodes/body-work/auth/site-config.ts`

- [x] 为企业名称、地址、营业执照、ICP备案和公安备案增加结构化字段。
- [x] 在现有基础配置页增加“备案信息”标签和保存入口。
- [x] 通过现有登录配置接口下发备案信息，空字段保持隐藏语义。

### Task 2: 扩展 front plugin SDK

**Files:**
- Modify: `front/src/lib/plugin/sdk-compat.ts`
- Modify: `backend/package/front/sdk/src/index.ts`
- Modify: `backend/package/front/sdk/types/index.d.ts`

- [x] 对插件公开宿主主题状态和现有 Dialog 原语。
- [x] 保持账号、团队和退出逻辑使用公开 SDK，不跨包引用宿主私有实现。

### Task 3: 拆分紧凑侧栏和用户菜单

**Files:**
- Create: `backend/package/bot/front/src/nodes/body-work/home/workbench-sidebar.tsx`
- Create: `backend/package/bot/front/src/nodes/body-work/home/workbench-user-menu.tsx`
- Create: `backend/package/bot/front/src/nodes/body-work/home/workbench-sidebar.css`
- Modify: `backend/package/bot/front/src/nodes/body-work/home/home-shell.tsx`

- [x] 实现固定 80px 导航栏和图标加短标签的导航结构。
- [x] 积分与消息复用同一个“敬请期待”弹窗。
- [x] 用户菜单提供个人信息、团队切换、主题切换和退出确认。
- [x] 菜单底部只展示后台已配置的备案信息。

### Task 4: 统一主题并静态复核

**Files:**
- Modify: `backend/package/bot/front/src/nodes/body-work/shared/body-theme.css`
- Modify: `backend/package/bot/front/src/nodes/body-work/home/workbench-appearance.css`
- Modify: `backend/package/bot/front/src/nodes/body-work/space/space-page.tsx`

- [x] 增加 Body 工作区深色变量并让首页组件使用统一变量。
- [x] 画布主题切换改用宿主 `ThemeProvider`，删除画布本地主题存储。
- [x] 只执行格式化、JSON 解析、diff 检查和源码审阅；按项目要求不运行 build/test。
