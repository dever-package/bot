# 画布暗色模式与分组连线 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让画布共享 Body 主题设置并完整呈现 Paper 暗色模式，同时让分组连线按“开始”节点规则高亮为红色。

**Architecture:** 保留共享 `useTheme` 作为唯一主题来源，将 Paper 视觉层的中性色集中到亮/暗 CSS 变量；连线颜色继续由现有节点类型映射派发，只补齐 `group` 类型。

**Tech Stack:** React、TypeScript、CSS、React Flow、Dever front plugin

---

### Task 1: 统一 Paper 主题色

**Files:**
- Modify: `front/src/nodes/body-work/space/space.css`

- [ ] 将 Paper 视觉层的中性颜色定义为背景、表面、文字、边框、悬停、网格和阴影变量。
- [ ] 为 `.ws-page.is-light` 和 `.ws-page.is-dark` 分别提供变量值。
- [ ] 将 Paper 视觉层中重复的浅色中性属性改为变量，保留媒体与节点业务强调色。

### Task 2: 补齐分组连线颜色

**Files:**
- Modify: `front/src/nodes/body-work/space/space-page.tsx`

- [ ] 在 `nodeHighlightColor` 中让 `group` 返回与 `function` 相同的红色。
- [ ] 保持默认灰线以及悬停、选中时才高亮的现有逻辑不变。

### Task 3: 静态复查

**Files:**
- Check: `front/src/nodes/body-work/space/space.css`
- Check: `front/src/nodes/body-work/space/space-page.tsx`

- [ ] 运行 Dever audit，预期无错误。
- [ ] 运行 `git diff --check`，预期无空白错误。
- [ ] 检查主题仍只使用共享 `useTheme`，且没有新增持久化字段或主题状态。
- [ ] 不运行构建或测试命令，交由用户手动验证视觉和交互。
