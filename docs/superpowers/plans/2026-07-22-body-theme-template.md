# Body Theme And Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为单站点 Body 增加可配置的主题、品牌主色、登录页模板和工作台模板，同时保持现有业务页面与运行链路不变。

**Architecture:** 继续复用 `bot_body_config` 和现有公开配置接口。数据库只保存经过约束的预设标识与可选十六进制品牌色，前端在一个共享模块中归一化配置并投射为语义 CSS 变量；模板仅改变登录页和工作台外层布局，不复制创作、对话、工具、资产或画布业务组件。

**Tech Stack:** Go、Dever ORM、Dever page JSON、React、TypeScript、CSS

---

### Task 1: 扩展配置契约

**Files:**
- Modify: `model/body/config.go`
- Modify: `service/body/config.go`
- Modify: `front/page/admin/body/config/set.json`
- Modify: `front/src/nodes/body-work/auth/site-config.ts`

- [x] 增加主题预设、自定义品牌主色、登录页模板和工作台模板字段与默认值。
- [x] 使用 Model Options 作为后台单选项事实来源，不新增 CRUD API。
- [x] 通过现有 `login/config` 返回外观配置，并在前端边界统一校验未知值。

### Task 2: 建立共享外观映射

**Files:**
- Create: `front/src/nodes/body-work/shared/body-appearance.ts`
- Modify: `front/src/nodes/body-work/shared/body-theme.css`

- [x] 在共享模块中归一化模板、主题和品牌主色。
- [x] 将预设及自定义色映射为登录页、工作台和画布共用的语义变量。
- [x] 保留现有绿色变量为语义变量别名，避免形成第二套样式路径。

### Task 3: 接入预置模板

**Files:**
- Modify: `front/src/nodes/body-work/auth/login-page.tsx`
- Modify: `front/src/nodes/body-work/auth/login-page.css`
- Modify: `front/src/nodes/body-work/home/home-shell.tsx`
- Modify: `front/src/nodes/body-work/home/workbench-sidebar.css`

- [x] 登录页支持当前分栏、居中聚焦和品牌展示三种模板。
- [x] 工作台支持当前紧凑导航、宽侧栏和顶部导航三种模板。
- [x] 所有模板继续复用同一个数据加载、导航和页面内容组件。

### Task 4: 同步画布外观

**Files:**
- Modify: `front/src/nodes/body-work/space/space-page.tsx`
- Modify: `front/src/nodes/body-work/space/space.css`

- [x] 画布复用同一主题配置和现有宿主明暗模式。
- [x] 只映射品牌强调色，不改变节点类型业务颜色和执行逻辑。

### Task 5: 静态复审

**Files:**
- Check: all files above

- [x] 解析所有修改后的 JSON。
- [x] 运行 Dever 静态审计和 `git diff --check`。
- [x] 搜索配置字段全链路，确认数据库、服务、前端归一化和根节点属性一致。
- [x] 按项目要求不运行 build 或 test，视觉和交互由用户手动验证。
