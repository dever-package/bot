# Agent Chat 全屏弹窗设计

状态：已确认
日期：2026-07-11

## 目标

恢复备份中“运行智能体”的全屏弹窗方式，同时保留当前精简后的多轮聊天、流式输出和移动端布局。

## 结构

- 智能体列表页只挂载 `show-agent-chat` 节点，不再使用 `feedback-modal` 包裹聊天组件。
- `show-agent-chat` 读取现有 `openPath`，打开时渲染覆盖整个视口的 `Dialog`。
- 弹窗尺寸使用旧实现的 `100vw` 和 `100dvh`，无圆角、无外边距、无默认关闭按钮。
- 聊天标题栏提供明确的关闭按钮；关闭时将 `openPath` 写为 `false`。
- 没有配置 `openPath` 时，组件继续支持原有嵌入式高度，避免降低组件复用能力。

## 行为

- 打开、关闭、Escape 和右上角关闭按钮统一通过 `openPath` 控制。
- 关闭弹窗后，现有 effect 负责中止请求和停止运行，不增加第二套清理逻辑。
- 全屏模式下聊天根容器占满剩余空间；嵌入模式继续使用 `containerHeight`。
- 保留手机版顶部横向会话栏和桌面端左侧会话栏。

## 范围

修改：

- `front/page/admin/agent/agent/list.json`
- `front/src/nodes/show/agent-chat.tsx`

不修改通用 `feedback-modal`、后端 API、runtime、会话存储和流式协议。

## 验收

1. 点击“运行智能体”后弹窗铺满整个浏览器视口。
2. 右上角关闭、Escape 和弹窗关闭事件都能正确关闭运行页。
3. 关闭运行中的弹窗时，现有停止逻辑仍然生效。
4. 手机端和桌面端内部聊天布局保持现有响应式行为。

按项目要求不运行 build、test 或 lint，只做源码静态检查和 Dever audit。
