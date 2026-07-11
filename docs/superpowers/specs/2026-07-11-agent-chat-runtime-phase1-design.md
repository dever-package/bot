# Agent Chat Runtime 第一步

状态：待实施
日期：2026-07-11

## 目标

先把最简单的单智能体聊天跑通：

```text
用户输入 + 历史消息
  -> 创建 Run 和 input Step
  -> 读取 Agent 的 llm_power_id 和设定
  -> 调用 Energon LLM 流
  -> 前端逐段显示 Markdown
  -> 前端保存消息，Runtime 完成 Run/Step
```

只做多轮聊天，不做 Agent Loop。

## 后端

在现有 `service/agent/runtime/` 增加一个轻量 Chat Service：

- 根据 Agent key/ID 读取启用的 Agent。
- 根据 `llm_power_id` 读取启用的文本能力。
- 组合分类提示词和智能体设定。
- 接收本轮文本和前端传来的历史消息。
- 调用现有 Energon Gateway，设置 `stream=true` 和 Agent 温度。
- Stream 和 Stop 直接委托 Energon，不增加第二层流。
- 复用现有 Run、Step 模型记录本轮执行。

新增三个薄接口：

```text
POST /bot/admin/agent_runtime/run
GET  /bot/admin/agent_runtime/stream
POST /bot/admin/agent_runtime/stop
```

Runtime 不读写 Session、Message，也不新增表。

每次发送只记录：

- 一条 `bot_agent_run`：开始时为 `running`，结束时更新为 `success`、`fail` 或 `canceled`，并写入输出、错误、耗时和步骤数。
- 一条 `input` Step：记录本轮用户输入。
- 一条 `final` 或 `error` Step：记录最终 Markdown 或错误。

不记录每个流片段。Runtime 使用现有 `CollectStream` 在后台汇总最终结果并完成 Run/Step；前端仍直接读取 Energon stream。

## 会话

复用已有 `/bot/admin/assistant/*` 接口和：

- `bot_assistant_session`
- `bot_assistant_message`

前端负责：

1. 新建或打开会话。
2. 保存用户消息。
3. 把本轮之前的会话历史传给 Runtime；当前输入单独传，不能重复进入历史。
4. 流结束后保存助手 Markdown 原文。

## 前端

新增一个独立的 `show-agent-chat` 组件，不修改旧 `show-agent`。

布局：

- 左侧：新对话和会话列表。
- 右侧：消息内容区和底部输入框。
- 用户消息右对齐浅色气泡。
- 助手消息直接显示 Markdown 正文。
- 支持发送、停止、新建会话和切换会话。
- 风格参考豆包的简洁双栏聊天，不复制品牌样式。

Agent 列表的“运行智能体”弹窗改用新组件；其他旧调用方不动。

## 明确不做

- 知识库、技能、工具、Function Calling。
- 记忆、附件、图片、视频、引用。
- `rich_json`、结果卡片、交互表单。
- 逐 token/流片段 Step、恢复、审批、并发任务。
- Team、Flow、Project 改造。

## 手动验收

1. 第一轮回复能快速流式出现。
2. 第二轮能使用第一轮上下文。
3. 刷新后会话和已完成消息仍存在。
4. 可以新建并切换会话。
5. Markdown 标题、列表和代码块能展示。
6. 每轮生成都有一条 Run，以及 input、final/error 两条 Step。
7. 本阶段不会调用任何工具。

按项目要求不运行 build、test 或 lint，只做静态检查。
