# Ask User Stepper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. The user explicitly prohibits subagents, build commands, and automated tests.

**Goal:** 将 `ask_user` 改为带自然语言引导、AI 推荐默认值和逐题卡片的通用分步交互，并保证结构化回答在后续上下文中可恢复。

**Architecture:** 后端工具只输出紧凑字段协议和推荐值，runtime 负责自然语言规则、无正文时的兜底提示以及历史上下文恢复。通用 `AgentInteractionPanel` 根据 `interaction.presentation=stepper` 组合独立的分步展示组件，`agent-chat` 不保存重复表单状态。

**Tech Stack:** Go、Dever ORM/runtime、React、TypeScript、Tailwind CSS、Lucide、现有 `PowerParamField` 与上传组件。

---

### Task 1: 收紧 ask_user 协议并加入 AI 推荐值

**Files:**
- Modify: `service/agent/runtime/tool/provider/ask_user.go`

- [ ] **Step 1: 将工具输入限制为 1-4 个必要字段**

删除模型生成的可见 `title` 和 `description`，将 schema 改为只接收 `fields`。字段保留 `key`、`label`、`type`、`options` 和 `recommended`：

```go
const (
    maxAskUserFields  = 4
    maxAskUserOptions = 6
)

"recommended": map[string]any{
    "type":        "array",
    "description": "AI 推荐并默认选中的选项，必须来自 options",
    "maxItems":    maxAskUserOptions,
    "items":       map[string]any{"type": "string"},
},
```

工具说明明确：选择题必须提供推荐值；一轮最多四问；可选信息不进入表单。

- [ ] **Step 2: 规范化推荐值并输出 stepper 标识**

新增小函数过滤不在选项中的推荐值：

```go
func normalizeRecommendedOptions(value any, options []map[string]any, single bool) []string
```

规范化后的字段加入：

```go
normalized["recommended"] = recommended
```

交互输出保持稳定的内部标题，但前端不展示重复标题：

```go
interaction := map[string]any{
    "id":           "ask-user-" + interactionID,
    "type":         "form",
    "presentation": "stepper",
    "title":        "需求确认",
    "fields":       fields,
}
```

- [ ] **Step 3: 格式化并静态审阅**

运行 `gofmt`；检查 schema 没有 `nil` 数组、字段数量与设计文档一致。不要运行 Go test。

### Task 2: 保证 ask_user 前存在自然语言流式说明

**Files:**
- Modify: `service/agent/runtime/loop/service.go`
- Modify: `service/agent/runtime/loop/tool_communication.go`

- [ ] **Step 1: 加强模型沟通规则**

在 runtime 系统规则中增加：

```text
调用 ask_user 前，先用用户当前语言输出一句简短自然说明，解释为什么需要确认这些信息；不要在正文重复问题和选项。
```

同时把“一次所有问题”改为“一次最多四个必要问题，仍不足时下一轮再问”。

- [ ] **Step 2: 增加无正文兜底**

扩展 `fallbackToolPreamble`：当首个工具 `Kind=interaction` 时返回：

```text
为了继续完成这个任务，我需要先确认几个关键信息。
```

媒体工具原有自然语言逻辑保持不变，知识库工具仍不播报。

- [ ] **Step 3: 格式化并人工检查事件顺序**

确认 runner 仍按 `delta -> interaction final` 输出，不新增模型请求，不改变其他工具活动事件。

### Task 3: 将结构化表单回答纳入后续历史上下文

**Files:**
- Modify: `service/agent/runtime/reference/content.go`
- Modify: `service/agent/runtime/context/history.go`

- [ ] **Step 1: 提供存储内容到模型文本的公共转换**

在 reference 包新增：

```go
func InteractionResponsePrompt(value any) string {
    content, ok := parseContent(value)
    if !ok || content.InteractionResponse == nil {
        return ""
    }
    raw, err := json.Marshal(content.InteractionResponse.Value())
    if err != nil {
        return ""
    }
    return "interaction_response:\n" + string(raw)
}
```

- [ ] **Step 2: 组装历史消息时追加结构化回答**

在 `recentHistory` 处理用户消息时追加：

```go
if response := runtimereference.InteractionResponsePrompt(row.Content); response != "" {
    text = strings.TrimSpace(text + "\n\n" + response)
}
```

当前轮仍复用 `ModelInput` 的结构字段；后续轮不再仅依赖可读摘要。

- [ ] **Step 3: 静态检查上下文大小限制**

确认结构化回答仍经过 `normalizeHistory` 的单消息和总字符限制，不绕过现有 token 控制。

### Task 4: 新增通用分步交互组件

**Files:**
- Create: `/data/project/shemic/front/src/components/agent/interaction-stepper.tsx`
- Modify: `/data/project/shemic/front/src/components/agent/interaction-panel.tsx`
- Modify: `/data/project/shemic/front/src/lib/agent/types.ts`

- [ ] **Step 1: 扩展通用交互类型**

给字段增加 `recommended?: unknown[]`，给交互增加 `presentation?: string`。在分步组件内定义：

```ts
export type InteractionStepperParam = PowerParam & {
  recommendedValues: string[]
}
```

- [ ] **Step 2: 规范化推荐值并初始化默认选择**

`normalizeInteractionField` 只保留存在于选项中的推荐值。单选取第一项，多选保留全部；推荐值写入 `default_value`，同时保留 `recommendedValues` 供 UI 展示标签。

- [ ] **Step 3: 实现逐题状态和选择卡片**

`AgentInteractionStepper` 接收参数、当前值、文件、禁用状态及变更/提交回调。组件职责：

- 维护当前步骤索引和每题自定义输入状态。
- 顶部显示“需求确认”、`Step N/M` 和等宽分段进度条。
- `option` 渲染整行单选卡片，`multi_option` 渲染整行多选卡片。
- 推荐项显示“推荐”标签；推荐值由父组件初始化为默认选中。
- 其他字段复用 `PowerParamField`，不复制上传和校验实现。
- “自定义补充”展开输入框；单选覆盖选项，多选追加自定义值。
- 每一步用 `validateMainParams([currentParam], values)` 校验后再前进。
- “剩余全部交给 AI 决定”仅在剩余字段都有推荐值时启用，并一次写入推荐值后提交。

- [ ] **Step 4: 在 AgentInteractionPanel 中组合 stepper**

当 `interaction.presentation === 'stepper'` 时：

- 隐藏原有标题头。
- 使用 `AgentInteractionStepper`。
- `buildSubmitResult` 接受可选的 values 覆盖值，保证“全部 AI 决策”不会因 React 异步状态提交旧数据。
- 只读状态继续复用 `ReadonlyInteractionValues`。

普通 `form` 和 `power_params` 路径保持原样。

- [ ] **Step 5: 人工静态审阅响应式布局**

确认卡片最大宽度、移动端单列、内容滚动和底部按钮不会遮挡；不运行前端 build/test。

### Task 5: Agent Chat 接入与静态收尾

**Files:**
- Modify: `front/src/nodes/show/agent-chat/interaction.ts`
- Modify: `front/src/nodes/show/agent-chat/interaction-view.tsx`

- [ ] **Step 1: 保留 presentation 字段**

`readAgentChatInteraction` 将后端 `presentation` 原样归一化到通用 `AgentInteraction`，不在聊天层实现步骤状态。

- [ ] **Step 2: 调整聊天区卡片宽度**

分步模式使用接近参考图的 `max-w-xl`；普通交互保留原宽度。模型自然语言仍由现有 `StreamingMarkdown` 流式展示。

- [ ] **Step 3: 执行允许的静态检查**

运行：

```bash
gofmt -w <本计划涉及的 Go 文件>
git diff --check
bash /data/project/shemic/skills/skills-dever/scripts/audit.sh <本计划涉及的 bot 文件>
```

人工核对 TypeScript 导入、props 和类型名称。按用户要求不运行 `npm run build`、`tsc`、Go test 或任何自动化测试。

- [ ] **Step 4: 分仓库提交本次文件**

只暂存本计划修改的文件，避开两个仓库已有的无关改动。分别提交 backend/package/bot 和 front；提交前再次检查 staged diff。
