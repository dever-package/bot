# Agent Runtime v2 设计规格

状态：已确认设计，等待实施计划
日期：2026-07-10
范围：`backend/package/bot` 单智能体运行时与 bot 插件、宿主 `front` 的共享 Chat/Runtime 客户端，以及现有调用方的受控适配

## 1. 决策摘要

本次删除现有 `service/agent/runtime` 实现，并在相同目录从零重建完整的单智能体运行时。最终实现遵循以下不可变决策：

1. 先固化并提交当前 Energon 能力基线；此后模型接入层冻结，不新增 OpenAI、Claude 或其他模型原生适配层。
2. Runtime 只通过现有 `Gateway.Request`、`CollectStream`、`CancelStream`/`StopStream` 调用模型。
3. Chat Session、Message、标题和长期记忆继续归 `service/assistant` 管理。
4. Runtime 只管理 Run、Item、Checkpoint、工具执行、输出和实时事件。
5. 所有现有可用工具能力保留，但只有 Agent 明确挂载且当前场景允许的工具才暴露给模型。
6. 普通回答使用流式 Markdown；JSON 只用于工具参数、结构化输出和内部事件；最终图文交付物为 Tiptap `rich_json`。
7. Team、Flow、Project 不重构编排；首版对这些来源禁用 Runtime 交互工具，只适配非交互 Execute、事件、取消和查询。
8. 不兼容旧 Runtime 协议和旧运行数据；开发库相关运行、Chat 历史允许清空。
9. 后端重启后，遗留的 `queued` 和没有未决副作用的过期 `running` Run 进入 `interrupted`；存在未决副作用时进入 `waiting_approval/uncertain`，已有 `waiting_*` 保持等待，均由用户显式处理。
10. 本次实现不运行 `npm run build`、Go/前端测试或其他测试命令，由用户手动验收。
11. bot package 与宿主 front 是两个独立仓库，最终版本必须协调发布；不支持新旧 Runtime 前后端混跑。

## 2. 背景与问题

当前 Runtime 约 14,900 行，Agent 调试页约 8,100 行。主要问题不是功能数量，而是职责混合：

- Runtime 同时承担 HTTP 请求解析、Chat 同步、上下文构建、工具循环、输出协议、资产任务、Trace 和流事件。
- `Run` 与 `RunInternal` 形成两条平行执行路径。
- Runtime 和前端都写 Assistant Message，只能依赖 `request_id` 去重。
- `ask_user` 结束当前 Run，而不是暂停后恢复同一个 Run。
- 当前 `bot_agent_step` 混合 Trace、LLM delta 和业务步骤，不能作为可恢复的执行记录。
- 所有启用 Power 可能进入工具候选，没有严格按 Agent 挂载收敛。
- 工具结构化 `Data` 与 Summary 分离，模型经常只能看到 Summary。
- 同批工具调用串行执行。
- Context 主要按消息数和字符数截断，不是 Token Budget，也没有正式 Compaction Item。
- Agent 调试页、Chat Drawer、Skill Test 各自解析流、保存消息、恢复状态和处理交互。
- 前端同一段正文可能同时存在于 `text`、`output`、`finalOutput`、`parts` 和 `resultDetail`。

本设计通过一个小而完整的执行内核解决这些问题，不把 Team、Flow 或模型 Provider 的复杂度搬进 Runtime。

## 3. 目标与非目标

### 3.1 目标

- 支持完整的单智能体 Agent Loop 和多次模型采样。
- 支持文本、附件、工具调用、工具结果、交互、审批和 Artifact 内容块。
- 支持工具挂载、权限、参数校验、超时、重试、取消、并行和进度事件。
- 支持 `ask_user`、审批和进程中断后的同 Run 恢复。
- 支持 Token Budget、工具结果清理、结构化摘要和 Prompt 稳定前缀。
- 支持 Markdown、JSON Schema 和 rich document 输出契约。
- 支持流式快速反馈、断线续读和基于 Run/Item 的页面重建。
- 让 Chat、Agent 调试页、Team、Project、Skill Planner 复用同一执行内核。
- 为未来 Work 同时启动多个 Run 提供稳定接口，但不实现 Work 编排。

### 3.2 非目标

- 不实现多智能体协作、子智能体、Team 调度或 Flow 图执行。
- 不重构 Energon、Provider、Power、Service、Account 或协议 Adapter。
- 不实现旧请求、旧流事件或旧数据库记录的兼容读取。
- 不新增 Runtime 专属 Chat Session/Message 表。
- 不新增逐 Token Event 数据表。
- 不保留基于自由文本或自定义 JSON 的工具调用猜测 fallback。
- 不自动恢复并重放未知副作用工具。

### 3.3 实施前置条件

开始删除 Runtime 前必须满足：

1. 用户先保存当前 bot 和宿主 front 的未提交工作，确定可回退基线。
2. 给当前 Energon 源码建立明确 commit，并通过源码检查确认下列能力：
   - 文本流 delta。
   - 完整 assistant 输出。
   - 原生 Tool Call 的 id、name、arguments。
   - 同一响应多个 Tool Call。
   - 请求侧 `tools`、`tool_choice`、`response_format`/输出 Schema 的透传。
   - assistant Tool Call 与 user/tool Result 的多轮消息回灌。
   - 流式 Tool arguments delta 的累积和完整结束事件。
   - Usage 和上游错误。
   - `CancelStream`/`StopStream`。
   - 对每个启用文本 Service 记录 native tool/structured output/stream arguments/context window/max output capability，供第 9.0 节 Runtime capability seed 使用。
3. 任一能力缺失时停止 Runtime 实施并请求用户决定；不得借 Runtime 重构顺手修改 Energon。
4. 明确开发数据库名及 Stream 的 `addr + redis_db + prefix`，并将 `shemic_demo`、Redis DB 1、`prefix=shemic_demo` 和 8091 Demo 环境加入硬拒绝名单。
5. bot 和 front 两仓各自在独立提交中工作，禁止把用户现有无关改动混入 Runtime 提交。

## 4. 边界与所有权

| 能力/数据 | 唯一所有者 | Runtime 如何使用 |
| --- | --- | --- |
| Agent 配置、设定、挂载 | `model/agent`、`service/agent/setting` | 启动时读取并固化快照 |
| 模型、Provider、Power、Token 日志 | `service/energon` | 通过窄 Gateway 接口调用 |
| Chat Session、Message、标题 | `service/assistant` | 由 RunProjector 对接 |
| 长期记忆 | `service/memory`、`service/assistant` | Runtime 可读取；写入由 Assistant 异步处理 |
| Run、Item、Checkpoint、Usage | 新 Runtime | 权威持久化 |
| 实时 delta 和进度事件 | Runtime Event Emitter + `front/service/stream` | 短期传输，不逐 Token 入库 |
| 知识库业务 | `service/agent/knowledge` | Knowledge Tool 适配器调用 |
| Skill 解析、加载、内置方法 | `service/agent/skill` | Skill Tool 适配器调用 |
| 脚本执行和隔离 | `service/agent/sandbox` | Platform/Skill Tool 调用 |
| 资产生成与持久化 | `service/asset`、Energon Power | Asset Tool 调用，Runtime 管理 Tool Item |
| Team/Flow/Workspace 状态 | 原 `service/team`、`service/project` | 只保存 Agent Run 引用并消费标准事件 |

Runtime 不得 import `service/assistant`、`service/team` 或 `service/project`。调用方只通过 `RunSource`、`RunProjector` 和 `EventSink` 接入，具体实现由组合根注入。`RunProjector` 负责来源数据投影，`EventSink` 负责实时事件映射，不再使用其他同义接口名。

组合根注入一个按 `RunSource.Type` 查找依赖的 `SourceRouter`：

```go
type SourceRouter interface {
    Projector(RunSource) RunProjector
    EventSink(RunSource) EventSink
}
```

`ExecuteRequest` 不携带任意 callback。`chat/debug/team/project/skill/internal` 必须在组合根显式注册；无需业务投影的已知 source 注册 Noop Projector 和默认 Agent Stream Sink。未知 source 在 Start 前以 `invalid_input` 拒绝；需要业务映射的 Team/Project Sink 由组合根显式注册。

## 5. 总体架构

```text
Agent 调试页 / Chat / Team / Project / Skill Planner
                         │
                  Runtime Service
       Start / Execute / Resume / Cancel / Status
                         │
                    Run Coordinator
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   Context Engine    Agent Loop      Output Engine
                         │
               ┌─────────┴─────────┐
               │                   │
         Model Client          Tool Engine
               │                   │
      现有 Energon Gateway    Catalog/Policy/Scheduler
                         │
                   Event Emitter
                         │
              Run / Item / SSE Stream
```

### 5.1 目录结构

```text
service/agent/runtime/
├── service.go
├── types.go
├── config.go
├── errors.go
├── engine/
│   ├── loop.go
│   ├── turn.go
│   ├── state.go
│   └── resume.go
├── model/
│   ├── client.go
│   ├── request.go
│   └── stream.go
├── context/
│   ├── builder.go
│   ├── budget.go
│   ├── history.go
│   └── compact.go
├── tool/
│   ├── types.go
│   ├── catalog.go
│   ├── registry.go
│   ├── policy.go
│   ├── executor.go
│   ├── scheduler.go
│   └── builtin/
├── event/
│   ├── types.go
│   └── emitter.go
├── output/
│   ├── contract.go
│   ├── markdown.go
│   ├── structured.go
│   └── rich.go
└── store/
    ├── repository.go
    ├── run.go
    └── item.go
```

不再设置 `runtime/chat`。Chat 是 Runtime 调用方，不是 Loop 类型。

### 5.2 Run Coordinator 与 Worker

Runtime Service 必须是组合根创建并注入调用方的共享实例，Team、Project 和 Cancel 路径不得临时 `NewService`。Coordinator 负责：

- 有界的进程内 Run Worker Pool。
- 全局、每 Agent 和每 Actor 并发上限。
- Run claim、lease、heartbeat 和版本 CAS。
- lease fencing：模型/工具调用前、外部副作用前、结果提交前都验证 `lease_owner + version`。
- Run 级取消注册表及模型/工具子任务级联取消。
- 启动时扫描 queued、过期 lease 和 running Run。
- 运行期间按短周期扫描未被进程内队列消费的 queued Run；通知丢失不能让 Run 永久卡住。

首版部署边界是**单活 Runtime leader**：一个开发/生产环境同一时刻只允许一个 backend 进程启用 Runtime Worker、Event Emitter 和 snapshot API。进程启动先取得带 fencing token 的数据库 leader lease；第二个实例不能取得 lease 时 Runtime health 必须失败，不能以普通副本继续提供这些端点。leader 切换前先让旧 lease 过期并把活动 Run 按本节规则中断。多活 Runtime 需要分布式 per-run gate 和 owner routing，明确不在本次范围；Run lease 字段仍保留用于崩溃恢复和未来扩展。

本次不引入新的持久队列。数据库中的 `queued` 是权威待执行状态，进程内队列只是加速层。进程重启后：

- `waiting_input`、`waiting_approval` 保持原状态。
- 未领取的 `queued` 改为 `interrupted`。
- lease 过期的 `running` 若存在已经提交 running、但没有终态的 SideEffect Tool Item，则先把 Item 改为 `uncertain`、幂等创建 `side_effect_resolution` Approval、Run 改为 `waiting_approval`；其他 running Run 改为 `interrupted`。
- 用户显式 Resume 后状态先回到 `queued`，再由 Worker claim 为 `running`。

Worker 使用脱离 HTTP 请求生命周期的后台 Context；Actor、权限和资源范围来自已持久化、脱敏的 Invocation snapshot。

失去 lease 的旧 Worker 必须立即取消自身模型/工具 Context，禁止继续副作用或提交结果。只有当前 fencing owner 可以更新 checkpoint、Item 终态和 Run 状态。

## 6. Runtime 公共契约

### 6.1 Service

```go
type Service interface {
    Start(context.Context, ExecuteRequest) (RunHandle, error)
    Execute(context.Context, ExecuteRequest) (RunResult, error)
    Wait(context.Context, RunRef) (RunResult, error)
    Resume(context.Context, ResumeRequest) (RunHandle, error)
    Cancel(context.Context, RunRef) error
    GetRun(context.Context, RunRef) (RunView, error)
    ListItems(context.Context, uint64) ([]ItemView, error)
    ReadEvents(context.Context, uint64, string) ([]StreamEvent, error)
}
```

```go
type RunRef struct {
    ID        uint64
    RequestID string
}
```

`RunRef` 至少提供 ID 或 request_id；同时提供时必须指向同一 Run，否则返回 `run_ref_conflict`。

```go
type RunView struct {
    Run          RunPublic
    Items        []ItemView
    ResumeCursor string
    SnapshotAt   time.Time
}
```

- `Start` 创建并异步调度 Run，供 Chat 和调试页使用。
- `Execute` 由 `Start + Wait` 组成，供 Team、Project、Skill Planner 使用。
- `Wait` 在 Run 进入 lifecycle terminal 或 resumable resting state 时返回，不会跨 `waiting_*` 无限阻塞。
- `Resume` 只接受 `waiting_input`、`waiting_approval` 或 `interrupted` 状态。
- `Cancel` 对终态幂等；取消必须向当前模型流和所有活动 Tool Item 传播。
- `GetRun` 返回带 Items 和续读屏障的权威 `RunView`；`ListItems` 只用于分页调试和审计，不单独承担断线恢复。

`RunResult` 必须包含 `run_id`、`request_id`、`status`、`output`、`error` 和 `resume_required`。`completed/failed/canceled` 返回 lifecycle terminal；`waiting_input/waiting_approval/interrupted` 返回 `resume_required=true`。首版 Team/Project/Skill 来源不挂载交互工具，因此其正常 Execute 不会进入 waiting。

### 6.2 ExecuteRequest

```go
type ExecuteRequest struct {
    RequestID   string
    Agent       AgentRef
    Input       []ContentBlock
    Messages    []Message
    Source      RunSource
    Invocation  InvocationContext
    Output      OutputContract
    Options     RuntimeOptions
}
```

前端不得直接提交完整 Chat 历史。`service/assistant` 从数据库读取权威 Session 历史后构造 `Messages`。内部调用方可以提交自身受控上下文。

`RequestID` 是调用方幂等键：Chat 使用 `session_id + client_message_id` 的稳定派生值并关联到已保存 user message，Team/Project 使用节点 attempt ID，调试页在发送前生成 UUID。相同 request_id 且规范化请求 hash 一致时返回既有 Run；hash 不同返回 `request_id_conflict`。Runtime 不以随机生成 request_id 掩盖重试语义。

Canonical request hash 使用 UTF-8 canonical JSON（对象 key 递归排序、数字规范化、保留文本语义，仅统一 CRLF）计算 SHA-256，包含 AgentRef、Input、Messages、完整 RunSource、脱敏后的 Invocation identity/scope、OutputContract 和影响执行的 RuntimeOptions，不含 RequestID、时间戳、secret、Memory 查询结果及运行时生成快照。Chat 重试必须按原 user message 的位置重建同一历史；Start 在唯一索引冲突时读取既有 Run，在数据库内比较 `request_hash` 后 get-or-create，禁止应用层“先查再插”。

### 6.3 RunSource

```go
type RunSource struct {
    Type     string // chat/debug/team/project/skill/internal
    ID       uint64
    ParentID uint64
    Metadata map[string]any
}
```

`RunSource` 只负责关联，不让 Runtime 依赖调用方模型。

```go
type EventSink interface {
    Emit(context.Context, StreamEvent) error
}
```

默认 EventSink 写入 Agent stream；Team/Project 可注入只做事件映射的组合 Sink。业务状态更新不得隐藏在 EventSink 中。

### 6.4 ResumeRequest

```go
type ResumeRequest struct {
    RunID          uint64
    ItemID         uint64
    CallID         string
    Action         string // submit/approve/deny/confirm_completed/retry/continue/cancel
    Answer         map[string]any
    IdempotencyKey string
    ExternalIdempotencyKey string
    Invocation     InvocationContext
}
```

- 一次 Run 同时只允许一个 blocking Interaction/Approval Item；同一模型响应中的多个待审批 Tool Call 合并到一个批次 Approval Item。
- `submit` 的 CallID 是原 `ask_user` call_id；批次 approve/deny 的 CallID 是 approval `batch_id`，逐项决定放在 `Answer.decisions`；`confirm_completed/retry` 使用 uncertain Tool 的原 call_id；`continue` 用于 `interrupted` Run，ItemID/CallID 可为空。
- Resume 必须重新校验 Actor、RunSource、Item、call_id、当前状态、表单 Schema 和有效期。
- 相同 idempotency key 的重复请求返回同一结果；相同 Item 的冲突请求返回 `resume_conflict`。
- Interaction/Approval 过期后对应 Item 失败，Run 转 `failed`，用户只能重新发起任务。
- `cancel` 等价于 Runtime Cancel。
- `confirm_completed` 只接受引用 `uncertain` Tool Item 的 `side_effect_resolution` Approval。Runtime 将该 Tool Item 标记 completed，生成与原 call_id 配对且注明“用户确认外部动作已完成”的 Tool Result，完成 Approval、保存 checkpoint，再以 CAS 将 Run 从 `waiting_approval` 转为 `queued`。
- `IdempotencyKey` 只去重 Resume 请求；`ExternalIdempotencyKey` 只透传给目标工具，二者不得混用。
- `continue` 只接受 `interrupted`，从最后安全 checkpoint 将 Run 以 CAS 转为 `queued`；其中未完成的只读/幂等工具可创建下一 attempt，副作用工具不会存在于该状态。
- `retry` 只用于 `side_effect_resolution` Approval，必须由调用方为该外部系统提供并确认使用同一个有效 ExternalIdempotencyKey。它创建同一 call_id 的下一 attempt，不覆盖旧 Item。

### 6.5 InvocationContext

`InvocationContext` 是 API 在启动前完成认证和权限校验后的不可变快照，至少包含：

- Actor 类型和 ID。
- 租户/站点信息。
- locale 和时区。
- 当前页面、Workspace、资源范围。
- 允许的前端动作和字段路径。
- 可访问知识库、Skill、Power 的约束。

不得携带 Cookie、Authorization、API Key 或完整 HTTP Header。确实需要调用 Dever Service 的工具在工具适配器内部构造受控上下文。

### 6.6 跨仓 Wire Types

下列是 backend、bot plugin 与宿主 front 必须同构的公共形状；数据库实体可有更多私有字段，但 API 不得透出 snapshot secret：

```go
type AgentRef struct { ID uint64; Key string }

type RuntimeOptions struct {
    Trace                bool
    DeadlineAt           *time.Time
    MaxModelTurns        int
    MaxToolCalls         int
    MaxOutputTokens      int
    DisableParallelTools bool
}

type RunHandle struct {
    ProtocolVersion string
    RunID           uint64
    RequestID       string
    Status          string
    StreamCursor    string
}

type RunPublic struct {
    ID, AgentID uint64
    RequestID, SourceType, Status, Phase string
    SourceID, ParentSourceID uint64
    Version uint64
    Output *OutputEnvelope
    Usage Usage
    Error *PublicError
    ResumeRequired bool
    CreatedAt, UpdatedAt time.Time
}

type ItemView struct {
    ID, RunID, ParentItemID uint64
    Seq int
    Type, Status, Role, CallID, Name string
    Attempt int
    Version uint64
    Content []ContentBlock
    Payload ItemPayload
    StartedAt, FinishedAt *time.Time
    CreatedAt time.Time
}

type PublicError struct {
    Code, Message string
    Retryable bool
    RunID, ItemID uint64
    CallID string
}

type Usage struct {
    InputTokens, OutputTokens, CachedTokens, ReasoningTokens int64
    ModelTurns, ToolCalls, Compactions int
    Cost float64
    DurationMS int64
}

type Suggestion struct { ID, Label, Value string }
```

AgentRef 同时给 ID/Key 时必须指向同一 Agent。RuntimeOptions 的数字 0 表示使用配置默认值；调用方只能收紧上限，不能提高 RuntimeConfig/Agent 限制，普通前端不能设置 Trace/Deadline。`RunResult` 等于 `RunPublic` 的终态/静止态结果加完整 Output/Error，不再定义第二套同义字段。

`ItemPayload` 是按 Item.type 判别的严格 union：

| Item type | payload 必填结构 |
| --- | --- |
| `user_message/assistant_message` | `{partial:boolean, content_offset:int}` |
| `tool_call` | `{arguments:object, arguments_digest:string, policy:ResolvedCallPolicy}` |
| `tool_result` | `{structured?:object, presentation?:object, is_error:boolean, error?:PublicError}` |
| `interaction` | `{interaction_id,title,fields,expires_at}` |
| `approval` | `{kind,batch_id,call_ids,decisions,expires_at,tool_item_id?}` |
| `artifact` | `ArtifactRef` |
| `suggestion` | `{suggestions:Suggestion[]}` |
| `front_action` | `{action,target,values,reason,status}` |
| `compaction` | `{from_seq,to_seq,summary,source_hash}` |
| `warning/error` | `{error:PublicError}` |

未知字段可保留在数据库私有 payload，但公共 API 解码失败而不是落入 `any` Renderer。Go 定义和 TypeScript discriminated union 以协议 fixture 校对，不由前后端各自猜测。

## 7. 持久化模型

### 7.1 `bot_agent_run`

保留表名，删除旧数据并重建字段：

| 字段 | 说明 |
| --- | --- |
| `id` | Run 主键 |
| `request_id` | 唯一外部请求 ID |
| `request_hash` | canonical ExecuteRequest 的 SHA-256，用于幂等冲突检查 |
| `agent_id` | Agent |
| `source_type/source_id/parent_source_id` | 调用来源 |
| `source_metadata` | 服务端构造、脱敏后的 RunSource.Metadata |
| `status` | 状态机状态 |
| `phase` | 当前可展示阶段，不参与终态判断 |
| `input` | 规范化输入 JSON |
| `config_snapshot` | Agent、Runtime、OutputContract 快照 |
| `tool_snapshot` | 有效工具和 schema hash |
| `messages_snapshot` | 启动时规范化、脱敏的初始 Message/ContentBlock |
| `invocation_snapshot` | Actor、权限和资源范围快照，不含 secret |
| `checkpoint` | 可恢复消息链、待处理 Item 和循环位置 |
| `output` | 最终 OutputEnvelope |
| `usage` | Token、费用、耗时和调用计数 |
| `error` | 公开错误和内部错误码，不含 secret |
| `model_turn_count/tool_call_count/item_count` | 聚合计数 |
| `version` | Run CAS 版本 |
| `lease_owner/lease_expires_at/heartbeat_at` | Worker claim 和失联检测 |
| `projection_status/projection_attempts/projection_error` | Source 投影重试状态 |
| `started_at/waiting_at/finished_at/created_at/updated_at` | 时间字段 |

状态只有：

```text
queued
running
waiting_input
waiting_approval
interrupted
completed
failed
canceled
```

生命周期终态只有 `completed`、`failed`、`canceled`。`waiting_input`、`waiting_approval`、`interrupted` 是可恢复静止态，不写 `finished_at`。

允许的状态转换：

| From | To |
| --- | --- |
| `queued` | `running/interrupted/canceled/failed` |
| `running` | `waiting_input/waiting_approval/completed/failed/canceled/interrupted` |
| `waiting_input` | `queued/failed/canceled` |
| `waiting_approval` | `queued/failed/canceled` |
| `interrupted` | `queued/canceled` |
| `completed/failed/canceled` | 无 |

所有转换使用 `id + current_status + version` 条件更新。`started_at` 在首次 claim 时写入；`waiting_at` 在进入可恢复静止态时写入；`finished_at` 只在 lifecycle terminal 写入。

### 7.2 删除 `bot_agent_step`

旧 Step 不兼容保留，删除表和 `model/agent/step.go`。

### 7.3 新增 `bot_agent_item`

| 字段 | 说明 |
| --- | --- |
| `id` | Item 主键 |
| `run_id` | 所属 Run |
| `seq` | Run 内唯一序号，`run_id + seq` 唯一 |
| `parent_item_id` | 父 Item，可为空 |
| `type` | Item 类型 |
| `status` | Item 状态 |
| `role` | user/assistant/tool/system，可为空 |
| `call_id` | 工具调用 ID，可为空 |
| `attempt` | 同一 call_id 的执行尝试，从 1 开始 |
| `version` | Item 乐观锁版本 |
| `name` | 工具、Artifact 或交互名称 |
| `content` | `[]ContentBlock` JSON；空内容为 `[]`，不能在单对象/数组间兼容猜测 |
| `payload` | 调试元数据和扩展字段 |
| `started_at/finished_at/created_at` | 时间字段 |

Item 类型：

```text
user_message
assistant_message
tool_call
tool_result
interaction
approval
artifact
suggestion
front_action
compaction
warning
error
```

Item 状态：

```text
pending
running
waiting
completed
failed
denied
canceled
interrupted
uncertain
```

Tool Item 唯一约束为 `run_id + call_id + type + attempt`。`tool_call` 和 `tool_result` 可以共享 call_id，但不能共享同一 type/attempt。

不持久化每个 Token delta。当前 `assistant_message` 在流式过程中按时间或大小阈值更新，结束时写权威终态。

### 7.4 Assistant Message

`bot_assistant_message` 增加 nullable `run_id`、`client_message_id` 和 `reply_to_message_id`。约束为：

```text
partial unique(session_id, run_id, role) where run_id is not null
partial unique(session_id, client_message_id) where client_message_id is not empty
partial unique(session_id, request_id, role) where request_id is not empty
```

`request_id` 保留外部关联，不再作为双写补偿机制。普通系统消息和 Runtime.Start 创建 Run 之前的失败消息允许 `run_id=null`，以 request_id/reply_to_message_id 幂等。

`bot_assistant_session` 增加 `active_request_id` 和 `version`。Assistant 通过 `version + active_request_id` CAS 预留同 Session 唯一非终态请求；Terminal Projector 只有在值仍匹配当前 request_id 时才能清空。等待和 interrupted 状态不清空。

### 7.5 Agent 工具挂载

新增：

- `bot_agent_tool`：挂载 Runtime 静态工具 key 和配置。
- `bot_agent_power`：挂载 Energon Power。

`bot_agent_tool` 字段和约束：

| 字段 | 约束 |
| --- | --- |
| `id/agent_id/tool_key` | `tool_key` 使用 Runtime Registry 稳定 key；`agent_id + tool_key` 唯一 |
| `config` | JSON；必须通过该 Tool Definition 的 MountSchema，未知字段拒绝 |
| `status/sort` | disabled 不进入 Catalog；同 sort 时按 tool_key 稳定排序 |
| `created_at/updated_at` | 审计时间 |

`bot_agent_power` 字段和约束：

| 字段 | 约束 |
| --- | --- |
| `id/agent_id/power_id` | `agent_id + power_id` 唯一；Power 必须存在且启用 |
| `config` | 只允许 `default_arguments`、`approval`、`timeout_ms`；approval 只能提高风险等级，timeout 只能缩短全局上限 |
| `status/sort` | disabled 不进入 Catalog；同 sort 时按 Power 稳定 key 排序 |
| `created_at/updated_at` | 审计时间 |

Power 在首版不膨胀成“一项能力一个模型 Tool”。非素材 Power 使用 `power:<stable_key>` capability key，经固定的 `capability_search/describe_capability/call_capability` 三个工具发现和调用；素材 Power 作为 `create_assets` 的受控 power 枚举。显示名不参与身份。解析有效 Catalog 时若静态 Tool、Skill Tool 或 MCP Tool 同名，或 capability key 重复，Run 在调用模型前以 `tool_name_conflict` 失败，不能静默覆盖。

继续复用：

- `bot_agent_knowledge_base`。
- Agent 的 `skill_pack_id`。

关系到模型 Tool 的派生映射固定为：

| 已配置关系 | 条件派生的模型 Tool |
| --- | --- |
| 至少一个启用 KnowledgeBase | `open_knowledge_init/list_knowledge_files/search_knowledge_files/read_knowledge_file` |
| 启用且含可调用方法的 Skill Pack | `run_skill` |
| 至少一个启用非素材 AgentPower | `capability_search/describe_capability/call_capability` |
| 至少一个启用素材 AgentPower | `create_assets` |

这些 wrapper 不重复写 AgentTool，但仍是“显式关系派生”，关系为空时绝不进入 Manifest。

Agent 默认输出契约由 `output_type` 和 `output_schema` 表达；Agent Setting 中的 `output` 仍是自然语言风格要求，不能替代机器可验证的 OutputContract。

切换时必须生成显式挂载，不能让现有 Agent 因新表为空而突然失去全部能力。删除旧 Registry/Profile 前，从冻结基线生成并人工审查 `migrations/agent-runtime-v2-tool-mount-manifest.json`，文件逐 Agent 记录 `agent_id`、旧 profile、静态 tool keys、power IDs 和来源；迁移只消费这份已提交清单，不在切换时重新猜测：

- `agent_chat` 的直接 AgentTool 候选只有 `ask_user`、`suggest_actions`；`create_assets`、`run_skill` 和 capability 三工具按上表记录为 derived effective tools，Manifest 写最终结果和来源，不写 wildcard 或重复 AgentTool 行。
- `front_assistant` 只记录 `ask_user`、`suggest_actions`、`fill_form`、`patch_form`、`open_page`、`open_form` 中旧调用面真实启用的项。
- `skill_installer` 只记录其专属 `create_skill_install_plan` 及冻结基线真实使用的非交互依赖；`skill_create/internal` 同样从具体调用点生成白名单，不使用旧 profile 的 `AllowAll`。
- `platform_mcp_call` 当前执行器未配置，不进入 Manifest；未来真实 MCP Tool 按发现结果逐个挂载。
- 内置 Agent 使用同一 Manifest/model seed 写入经过审查的 AgentTool/AgentPower 挂载。
- 对现有自定义 Agent，把冻结基线实际可见且启用的非 LLM Power ID 写成显式 AgentPower 行；切换后管理员可以删减。
- 知识库和 Skill 继续按现有关系，不重复回填。
- 新建 Agent 使用明确的工具方案/预设，不再隐式获得所有启用 Power。

知识库四个工具由 `bot_agent_knowledge_base` 关系派生，Skill 工具由 `skill_pack_id` 派生；它们仍属于 Effective Catalog 的显式条件挂载，不重复写 AgentTool。Manifest 必须同时记录这些派生关系的数量和 hash，切换前后校验一致。

### 7.6 Agent Runtime 配置唯一来源

在现有 `bot_agent` 增加：

| 字段 | 默认/约束 |
| --- | --- |
| `memory_enabled` | smallint/bool，现有 Agent 迁移为 true 以保持当前 Assistant 默认，新 Agent 默认 true，可显式关闭 |
| `output_type` | `text`，只允许 `text/structured/rich_document` |
| `output_schema` | JSON text，默认 `{}`；structured 必填有效 JSON Schema，rich_document 使用第 14.5 节内置 Schema，可附加收紧约束 |

Agent 的模型、温度、超时、最大步数继续使用现有字段；自然语言设定继续来自 Setting Pack；工具/Power/Knowledge/Skill 只来自第 7.5 节四类关系。Runtime 启动时一次读取这些值并写 config/tool snapshot，客户端提交的 `memory_enabled/output_type/tool keys` 一律忽略或拒绝。

“工具预设”不是第五个运行时数据源，也不在 Agent 上保存会漂移的 preset key。首版 seed preset 是固定清单：

| preset | 可选范围/默认 | 直接 AgentTool 展开 | 资源关系 |
| --- | --- | --- | --- |
| `normal-basic` | 新建普通 Agent 默认 | `ask_user`,`suggest_actions` | Power/Knowledge/Skill 默认空，只写用户在创建表单明确选择的关系 |
| `normal-empty` | 普通 Agent 可选 | 空 | 同上，只写用户明确选择的关系并按第 7.5 节派生 wrapper |
| `front-assistant` | 系统 seed 专用 | `ask_user`,`suggest_actions`,`fill_form`,`patch_form`,`open_page`,`open_form` | 使用该系统 Agent seed 明确声明的关系 |
| `skill-installer` | 系统 seed 专用 | `ask_user`,`suggest_actions`,`create_skill_install_plan` | 使用该系统 Agent seed 明确声明的关系 |
| `skill-creator` | 系统 seed 专用 | `ask_user`,`suggest_actions` | 使用该系统 Agent seed 的 Skill/Power 关系并派生 wrapper |
| `internal-automation` | 仅受信任内部调用点 | `platform_request`,`platform_script` | 资源 ID 必须由 server-side seed 明列；不允许普通管理员选择 |

`platform_mcp_call` 不属于任何 preset。新增/复制 Agent 时由 `AgentProvisioner` 校验 preset allowlist，在同一事务中创建 Agent 并展开上述 AgentTool 及用户明确选择的 AgentPower/Knowledge/Skill 关系；preset 为空时普通 Agent 固定使用 `normal-basic`，内部 Agent 必须显式指定其系统 preset。以后编辑直接维护实际关系。现有 Agent 只由已提交 Mount Manifest 回填，不套用新建默认。Agent 管理页必须展示并编辑 memory、output contract 与实际挂载关系。

## 8. 消息和 ContentBlock

```go
type Message struct {
    Role   Role
    Blocks []ContentBlock
}
```

ContentBlock 类型：

```text
text
image
file
tool_call
tool_result
artifact_ref
interaction
```

Go 和 TypeScript 必须使用同构的 tagged union。JSON 结构至少为：

```text
{type:"text", text:string}
{type:"image", artifact_id?:string, url?:string, mime_type?:string, alt?:string}
{type:"file", artifact_id?:string, url?:string, name:string, mime_type?:string}
{type:"tool_call", id:string, name:string, arguments:object}
{type:"tool_result", tool_call_id:string, content:ContentBlock[], structured?:object, is_error:boolean}
{type:"artifact_ref", artifact_id:string, kind:string, title?:string}
{type:"interaction", interaction_id:string, title:string, fields:InteractionField[], status:string}
```

`InteractionField` 固定为 `{key,label,type,required,options?}`，其中 type 只允许 `text/textarea/select/option/multi_option`；option 固定为 `{id,label,value}`。前后端不得再接受同义字段类型的兼容猜测。

未知 block type 在持久化时保留于 Item payload，但不得直接发送给模型或公共 Renderer。Tool denied/error 必须用 `tool_result.is_error=true` 表达，不能只写自然语言状态。

工具调用和结果必须通过 `call_id` 配对。Runtime 不把消息链扁平化为字符串，不用 Markdown fence 传递内部控制协议。

Provider 特有数据只能放在 `metadata`，Agent Loop 不基于 Provider 名称或私有字段分支。

## 9. 模型 Client 边界

### 9.0 冻结基线

“模型层不动”指第 3.3 节能力检查通过并提交后的 Energon 基线。Runtime 实施不得修改 `service/energon/**`、`model/energon/**` 或 Provider Adapter。当前工作区中尚未提交的 Energon 改动必须先由用户决定如何保存；规格不把未提交文件当成稳定依赖。

Runtime 自有 `bot_agent_model_capability`，不修改 Energon 表：

| 字段 | 说明 |
| --- | --- |
| `service_id` | 唯一，对应现有 Energon Service |
| `native_tool_calling` | 是否支持本规格原生 Tool Call 多轮 |
| `native_structured_output` | 是否支持 response_format/schema |
| `stream_tool_arguments` | 是否提供可完整聚合的 arguments delta |
| `context_window_tokens/max_output_tokens` | 正整数模型预算 |
| `status/verified_at/source` | 启用状态、人工验证时间和依据 |

迁移只为第 3.3 节实际验证过的启用文本 Service 写 seed；未登记目标返回 `model_capability_unknown`，不能凭 Provider 名猜能力。Runtime 的 `ModelCapabilityResolver` 读取 Agent 的 LLMPower、现有 PowerTarget/Service 配置和这张表：当 Energon 可能按顺序 fallback 到多个 target 时，布尔能力取交集、Token 上限取最小值；Power 允许并实际指定 `source_target_id` 时只取该 target。解析结果连同 eligible target IDs 写 config snapshot。这样 Gateway 接口和 Energon 选择逻辑不改，Context/Tool/Structured Output 在 Start 前仍有确定依据。

现有 `service/energon` 和 `model/energon` 保持不变。Runtime 的 `model.Client` 只是反腐层：

```text
Runtime Message/ToolDefinition
        ↓
现有 GatewayRequest body
        ↓
Gateway.Request / CollectStream / CancelStream
        ↓
Runtime ModelEvent
```

建议窄接口：

```go
type Gateway interface {
    Request(context.Context, energonservice.GatewayRequest) botprotocol.Response
    CollectStream(context.Context, botstream.CollectOptions) botstream.CollectResult
    CancelStream(context.Context, string) error
}
```

Power 参数查询作为 Tool Engine 的独立依赖，不把整个 Gateway 暴露给 Loop。

### 9.1 ModelEvent

内部事件至少包含：

```text
message.started
text.delta
tool_call.started
tool_call.arguments.delta
tool_call.completed
usage.updated
message.completed
model.failed
```

工具参数只在完整 JSON 收齐后解析和校验。

### 9.2 模型能力要求

- 未挂载工具时，不支持 Tool Calling 的模型可执行纯文本 Run。
- 挂载任何模型可见工具时，模型必须支持现有 Energon 原生 Tool Calling。
- 不再用 Prompt 要求模型输出自定义 JSON 来猜测 Tool Call。
- 能力不匹配在 Run 启动前返回 `model_tool_unsupported`。
- Structured Output 仅在共同能力支持时传 response_format；否则使用第 14.4 节严格 JSON fallback。Context Budget 始终使用共同 `context_window_tokens`，不能使用字符数替代。

## 10. Agent Loop

### 10.1 主循环

```text
1. 创建 queued Run 和 input Item
2. 固化 Agent、工具、Context、OutputContract 快照
3. 条件更新 Run 为 running
4. 构建模型上下文
5. 创建 assistant_message Item
6. 调用模型并实时发送 delta
7. 完成 assistant_message Item
8. 若无 Tool Call，进入 OutputEngine
9. 若有 Tool Call，校验、授权、审批和执行
10. 写 tool_call/tool_result Item
11. 将 ModelContent 回灌消息链
12. 保存 checkpoint，回到第 4 步
13. 输出完成后 Run → completed
```

Loop 不知道知识库、资产、技能、前端动作或安装场景。这些差异由 Tool Definition、Tool Outcome、OutputContract 和 RunSource 表达。

### 10.2 限制

每个 Run 必须同时执行以下限制：

- 最大模型 Turn 数。
- 最大工具调用总数。
- 最大连续工具错误数。
- 最大输入、输出和总 Token。
- 最大 Run 总时长。
- 单 Tool 超时和全局最大 Tool 超时。
- 最大并行 Tool 数。
- 最大 Artifact 数和输出大小。

达到限制必须产生明确 Error Item 和终态，不允许无限循环。

### 10.3 checkpoint

每次模型完整响应、每批工具完成、进入等待状态和重要压缩后保存 checkpoint。Checkpoint 包含：

- 已确认的 Message/ContentBlock 链。
- 已完成和待处理 Tool Call ID。
- 当前 Turn、Tool 和 Token 计数。
- 当前 Compaction boundary。
- 待回答 Interaction/Approval Item。
- 输出契约和工具快照 hash。

Checkpoint 不保存 secret、完整 HTTP Header 或无需恢复的原始流 delta。

## 11. Tool Engine

### 11.1 组成

```text
Tool Registry
    ↓
Agent Mount Resolver
    ↓
Effective Catalog
    ↓
Schema Validator
    ↓
Policy / Approval
    ↓
Scheduler
    ↓
Executor
    ↓
Outcome Normalizer
```

不再使用 `init() + ProviderFactory` 的隐式全局注册。Catalog 在服务装配时显式注册，启动 Run 时生成不可变有效工具快照。

### 11.2 有效工具公式

```text
Runtime Registry
∩ Agent 挂载
∩ 当前资源可用
∩ 当前场景支持
∩ 用户权限
∩ 模型能力
```

不存在或不可执行的工具不得进入模型 Manifest。当前永远返回“未配置”的 MCP 占位工具删除；连接真实 MCP 后，发现到的具体 Tool 逐个注册。

### 11.3 保留的能力

- `ask_user`。
- `suggest_actions`。
- `open_knowledge_init`。
- `list_knowledge_files`。
- `search_knowledge_files`。
- `read_knowledge_file`。
- Skill 内置方法和受控脚本。
- 普通 Power。
- 图片、视频、音频等 Asset Power。
- 受控 HTTP/脚本工具。
- 前端动作。
- 真实 MCP 工具。

### 11.4 Definition

```go
type Definition struct {
    Name         string
    Description  string
    InputSchema  JSONSchema
    MountSchema  JSONSchema
    ReadOnly     bool
    SideEffect   bool
    ParallelSafe bool
    Idempotent   bool
    Approval     ApprovalMode
    CanSuspend   bool
    ResolvePolicy PolicyResolver
    Timeout      time.Duration
    ResultBudget int
    ResultMode   ResultMode
}
```

上述 ReadOnly/SideEffect/ParallelSafe/Idempotent/Approval/CanSuspend 是静态最坏情况。参数会选择具体 Power/Skill/MCP 方法的动态工具必须实现 PolicyResolver：

```go
type ResolvedCallPolicy struct {
    ReadOnly, SideEffect, ParallelSafe, Idempotent bool
    Approval ApprovalMode
    CanSuspend, SupportsExternalIdempotency bool
    CapabilityKey string
    PolicyVersion string
}
```

Schema 校验后、创建审批/调度前解析 policy，并在 Tool Call Item 进入 running 之前持久化到 payload；重试、重启和 uncertain 处理只能使用该快照。动态解析结果只能比 Definition 最坏情况更具体，Agent mount config 只能提高审批/缩短超时，不能把未知副作用声明成只读。

`call_capability` 的目录项必须携带逐 capability policy。内置 Tool/Skill 方法由各 Adapter 注册；Power 由 Runtime 的 `PowerPolicyRegistry` 按稳定 key/kind 提供；未知项保守为串行、非幂等、副作用、需要审批。非交互 Source 构造 capability directory 时先剔除不安全条目，并重建 `call_capability` 参数 enum；若没有安全条目，三个 capability 工具都不进入 Manifest。

`ResultMode`：

- `observation`：结果回灌模型并继续 Loop。
- `interaction`：创建交互并暂停。
- `presentation`：生成 UI/Artifact sidecar；当同一响应已有可交付正文且没有其他 observation 工具时，可直接完成而不强制额外模型轮次。

### 11.5 Outcome

```go
type Outcome struct {
    ModelContent []ContentBlock
    Structured   any
    Presentation *Presentation
    Artifacts    []ArtifactRef
    Control      Control
    Error        *ToolError
}
```

- `ModelContent` 是模型真正收到的结果，必须含完成任务所需的事实。
- `Structured` 保存完整业务数据，供 Runtime、调试或 Artifact 使用。
- `Presentation` 只用于前端卡片、进度和引用。
- 大结果保存为 Artifact 或可再次读取的引用，只把预算内摘要和定位信息给模型。
- `Control` 只有 `continue`、`suspend`、`finish`。

### 11.6 ArtifactRef

```go
type ArtifactRef struct {
    ID       string
    RunID    uint64
    ItemID   uint64
    Kind     string // image/video/audio/file
    Status   string // pending/running/ready/failed
    URL      string
    StorageRef string
    AssetID, VersionID uint64
    MimeType string
    Title    string
    Error    *PublicError
}
```

Artifact 不新增独立表，身份由 Artifact Item 固定：先插入 pending `artifact` Item，再生成 `artifact_id = "art_" + base36(item_id)`；一个媒体结果一个 Item，ID 永不因重试或 URL 变化而改变。`ArtifactResolver` 通过 item_id 反查并校验 `run_id + item_id + artifact_id`，模型返回的任意 URL 不能伪装成已持久化 Artifact。

存储分两层：

- 所有 chat/debug/project Artifact 都先经注入的 `ArtifactStore` 使用现有 `front/service/upload` 持久化，Item 保存不含 secret 的 storage_ref、稳定 URL、mime、checksum；进程重启只从 Item + upload repository 恢复。
- Source 有合法 ProjectID/BodyID 且业务要求成为正式资产时，再调用现有 `service/asset.SaveVersion`，ArtifactRef/Item 保存 asset_id/version_id。纯 chat/debug 没有 Project/Body 时只保留 upload-backed Artifact，不伪造 Asset 行，也不调用会拒绝空归属的 SaveVersion。

`bot_asset_version` 除 nullable `agent_run_id` 外再增加 nullable `agent_item_id`，`service/asset.SaveVersionRequest` 同步增加二者；现有 `run_id/node_run_id` 继续只表达 Team。`agent_run_id + agent_item_id` 建索引并在非零时唯一，保证 Version 可回查唯一 Artifact Item。二进制和正式 Asset/Version 仍由 upload/`service/asset` 所有，Runtime 只保存引用和生命周期。

生命周期固定为 pending → running → ready/failed；工具 attempt 重试创建新 Artifact Item，不复用 failed ID。只有 upload 持久化成功、可回读且 kind/mime 校验通过后才能 ready；若还要求正式 Asset，则 Asset Version 保存也必须成功。

Rich Document 只能引用 `status=ready` 且 kind 与 block type 一致的 Artifact。默认 `allow_partial_artifacts=false`，缺失、失败或类型不符导致 `output_validation_failed`；调用方显式设为 true 时，OutputEngine 删除失败媒体块、插入一段可见警告，并在 OutputEnvelope.Artifacts 中保留失败引用和错误。

### 11.7 Power 和 Asset

Power 与 Asset 使用同一个动态 Tool Resolver，避免重复的 Schema、权限和参数映射：

```text
Power Tool Resolver
  ├─ Standard Power Executor
  └─ Asset Power Executor + Progress/Artifact Presenter
```

Asset 专用逻辑只处理长任务进度、媒体持久化和 rich document 引用，不允许工具绕过 Runtime Store 直接修改 `bot_agent_run.output`。

这是一套挂载和执行内核、两个模型入口：普通非素材 Power 走紧凑 capability directory，图片/视频/音频/文件 Power 走 `create_assets`。这样保留 Artifact/进度语义，又不会把全部 Power Schema 塞入每轮 Prompt。两类入口都只能看到 `bot_agent_power` 已挂载、当前启用且权限允许的 Power。

### 11.8 调度

- 调用前先完成整批 Schema 校验和授权。
- 任何审批未完成时，后续副作用工具不得执行。
- 同批 `ReadOnly && ParallelSafe` 工具有界并发，默认上限 4。
- 写入、外部副作用或非幂等工具串行。
- 结果按模型原始 Tool Call 顺序回灌。
- 自动重试只适用于只读或明确幂等工具。
- Tool Item 使用 `run_id + call_id` 作为幂等关联；工具支持幂等键时透传该值。

同批调用的确定性规则：

- 每个 Call 独立产生结果；一个参数错误不取消已校验通过的独立 sibling。
- 按模型原始顺序确定第一个 blocking boundary（Interaction 或 Approval）；只创建这一类 blocking Item，另一类及其后的 Call 保留 pending 于 checkpoint，Resume 后再调度，任何时刻不同时存在两个 blocking Item。
- 所有 sibling 均完成后，按原始顺序一次性构造 Tool Result Message。
- Blocking Interaction 出现时，不执行它之后的副作用 Call；已完成的只读结果保存在 checkpoint，Resume 后一并回灌。
- 需要审批的副作用 Call 在整批审批完成前不执行；deny 生成 error Tool Result，不影响已批准的独立 Call。
- 一个并行 sibling 失败不主动取消其他 sibling，除非 Run 被取消或超时。

副作用状态先提交为 `running` 再调用外部系统。若外部动作可能已成功但进程在结果入库前崩溃，Tool Item 转为 `uncertain`，并创建 `kind=side_effect_resolution` 的 Approval Item 引用该 Tool Item，Run 转 `waiting_approval`。非幂等工具不得自动重试；用户必须选择“确认已完成”“带幂等键重试”或“取消”。选择 retry 时旧 uncertain Item 保留，并写 `resolved_action=retry_authorized`，新建下一 attempt；Runtime 不宣称提供无法保证的 exactly-once 外部副作用。

同一模型响应的当前 Approval boundary 中有多个需要审批的 Call 时，只创建一个 `approval` Item。其 payload 保存稳定 `batch_id`、原始顺序和每个 `{call_id, tool, arguments_digest, risk}`；对应 `tool_call` Item 保持 pending。Resume 默认对整批 approve/deny，也可通过 `Answer.decisions: {call_id: approve|deny}` 明确逐项决定，未决定项继续等待且任何副作用仍不执行。只有整批都有决定后，Run 才以 CAS 转为 `queued`。

## 12. 交互、审批和恢复

### 12.1 `ask_user`

`ask_user` 是模型可见的 Runtime 控制工具。执行时：

1. 创建 `interaction` Item。
2. 保存表单 Schema、call_id 和有效期。
3. 保存 checkpoint。
4. Run 转为 `waiting_input`。
5. 前端提交后调用 `Resume`，不创建新 Run。
6. Runtime 生成与原 call_id 配对的 Tool Result，以 CAS 将 Run 从 `waiting_input` 转为 `queued`；Worker 再 claim 为 `running`。

模型一次响应若生成多个 `ask_user`，Runtime 只接受第一个，并为其余调用生成 `tool_invalid_arguments`；一个表单应通过 `fields` 一次收集所需信息。

### 12.2 审批

需要审批的 Tool Call 创建 `approval` Item 和 `approval.required` 事件。审批结果：

- approve：记录批次决定；只有整批均已决定后才以 CAS 将 Run 转为 `queued`，由取得 lease 的 Worker 执行获批 Tool Call。
- deny：记录批次决定并为被拒 Call 生成 `is_error/denied` Tool Result；只有整批均已决定后才转为 `queued`，由下一轮模型处理拒绝结果。
- confirm_completed：仅用于 `uncertain` 副作用，按第 6.4 节生成成功 Tool Result、checkpoint 并重新排队。
- retry：仅按第 6.4 节允许的幂等规则创建下一 attempt 并重新排队。
- cancel：取消整个 Run。

审批规则可按一次、当前 Run 或持久策略保存；首版至少支持一次审批。

### 12.3 进程重启

启动时扫描超出心跳阈值的 `running` Run，并按是否存在不确定副作用分流：

- 完成的 Tool Item 永不重放。
- 未完成的只读/幂等工具可在用户继续后重试。
- 已提交 running、但未记录终态的副作用 Tool Item 改为 `uncertain`，幂等创建 `side_effect_resolution` Approval，Run 进入 `waiting_approval`，必须按第 6.4 节确认完成、带幂等键重试或取消。
- 中断的 assistant_message 标记 `interrupted/partial`，保留用户已看到的文本。
- Resume 从最后完整安全边界开始新的模型请求，并携带“上次生成中断、不要重复已完成动作”的运行说明。

本次不实现后端启动后的自动续跑。

`queued` 和 `running` 都参与重启扫描；`waiting_input`、`waiting_approval` 保持等待。Heartbeat 默认在 Item 状态变化时更新，并在长模型/工具任务期间按固定周期更新。

## 13. Context Engine

### 13.1 上下文分层

```text
稳定前缀
  ├─ Runtime 最小规则
  ├─ Agent 设定
  ├─ always-load Skill
  └─ 稳定工具定义

动态后缀
  ├─ Compaction 摘要
  ├─ 必要长期记忆
  ├─ 最近消息
  ├─ 当前未完成工具链
  ├─ 用户附件和引用
  └─ 当前输入
```

静态内容和工具按稳定 key 排序，避免无意义的 JSON 字段、顺序或空白变化破坏现有模型层的 Prompt Cache。Runtime 不增加 Provider 特有缓存参数。

### 13.2 长期记忆

Runtime 只依赖由组合根注入的读取接口，不 import `service/memory`：

```go
type MemoryReader interface {
    Load(context.Context, MemoryQuery) ([]MemoryEntry, error)
}

type MemoryQuery struct {
    AgentID    uint64
    ActorType  string
    ActorID    uint64
    SourceType string
    SessionID  uint64
    ContextKey string
    Limit      int
    TokenBudget int
}
```

- 只有 `chat/debug` 且 Agent 快照明确 `memory_enabled=true` 时读取长期记忆；未启用时不查询、不注入。
- `Assistant.SendMessage` 用服务端权威 Session、Actor 和 Agent 信息构造 scope；客户端不能提交任意 memory owner/context。
- MemoryReader 返回已脱敏、按优先级和时间排序的条目；Context Engine 在 Pinned Memory 预算内截断并记录注入条目的 ID/hash。
- `team/project/skill/internal` 首版不读取 Runtime 长期记忆，只使用各自显式传入的 Messages/状态，避免跨来源污染。
- Runtime 不写长期记忆。Chat/调试 Run 成功 completed 后由 Assistant 的 `RunProjector.OnTerminal` 异步提炼并写入；失败不改变 Run 终态。

### 13.3 Skill

- `always` Skill 正文进入稳定前缀。
- `on_demand` Skill 只提供紧凑 metadata。
- 命中后通过 Skill Loader 加载正文或内置方法。
- Agent 未挂载的 Skill 完全不进入 Prompt。
- 正文、metadata 和脚本输出均受独立预算限制。

### 13.4 知识库

- 不预读整套知识库。
- Prompt 只说明当前 Agent 可访问的知识库范围和四个文件工具。
- Agent 先使用 `open/list/search/read`，需要确认事实时回读原文。
- 检索候选只作为线索，不能替代原文证据。

### 13.5 Token Budget

预算按模型上下文上限计算，不按固定消息数或字符数计算。至少划分：

- 固定 Prompt 和工具 Manifest。
- 输出 Token 预留。
- Compaction 摘要。
- Pinned Memory。
- 最近消息。
- 活动 Tool Call/Result 原子组。
- 当前输入和附件。

默认阈值：

```text
70%：清理旧工具结果和重复展示数据
80%：生成结构化摘要并写 compaction Item
90%：停止继续扩张，返回 context_overflow 或请求拆分任务
```

具体比例可由 RuntimeConfig 调整，但必须保留输出预留。

### 13.6 Tool Result 清理

- 小结果直接内联。
- 中结果裁剪并保留关键字段。
- 大结果保存 Artifact/引用。
- 旧结果从模型窗口清理，但 Run/Item 审计记录保留。
- `tool_call + tool_result` 始终作为原子组处理。
- 当前未完成任务依赖的结果不得清理。

### 13.7 Compaction

Compaction 生成结构化摘要，至少保留：

- 用户目标和最新约束。
- 已完成工作和关键结论。
- 未完成任务、待处理错误和下一步。
- 重要实体、文件、资源和 Artifact 引用。
- 已完成副作用和不得重复的 Tool Call。
- 待回答 Interaction/Approval。

摘要和被替换的 Item boundary 写入 `compaction` Item。原始 Item 不删除。

## 14. Output Engine

### 14.1 OutputContract

```go
type OutputContract struct {
    Type   string // text/structured/rich_document
    Schema any
    Options map[string]any
}
```

优先级：受信任内部调用覆盖 > Agent 默认 OutputContract > `text`。用户输入不能任意覆盖系统要求的 Schema。

### 14.2 OutputEnvelope

```go
type OutputEnvelope struct {
    Type        string
    Text        string
    Data        any
    RichJSON    any
    Artifacts   []ArtifactRef
    Citations   []Citation
    Suggestions []Suggestion
}
```

### 14.3 Text

- 普通 Chat 直接流式 Markdown。
- 不要求模型包装 JSON。
- 不做第二次模型格式化调用。
- Markdown 清理只能是确定性纯函数，不能猜测隐藏协议。

### 14.4 Structured

- 使用 JSON Schema 约束和验证。
- Provider 支持结构化输出时通过现有 Energon options 传递。
- 不支持时要求模型返回 JSON，并在 Runtime 端严格解析。
- 验证失败最多进行一次修复 Turn；仍失败则 `output_validation_failed`。

### 14.5 Rich document

模型输出紧凑语义块，而不是完整 Tiptap JSON：

```json
{
  "title": "示例",
  "blocks": [
    {"type": "paragraph", "text": "正文"},
    {"type": "image", "artifact_id": "asset_x", "caption": "说明"}
  ]
}
```

OutputEngine 确定性转换为最终 Tiptap `rich_json`。图片、视频、音频由 Tool Engine 生成 Artifact，语义块只引用 `artifact_id`。转换失败是 Runtime 输出错误，不通过前端兼容解析兜底。

`OutputContract.Options.allow_partial_artifacts` 按第 11.6 节处理，默认 false；它只控制失败媒体的降级，不放宽 rich block Schema、Artifact 归属或 kind 校验。

首版语义块完整集合：

```text
heading       {level:1..6, text}
paragraph     {text, marks?}
bullet_list   {items:string[]}
ordered_list  {items:string[], start?}
blockquote    {text}
code          {text, language?}
divider       {}
image         {artifact_id, caption?, alt?}
video         {artifact_id, caption?}
audio         {artifact_id, caption?}
```

`marks` 只允许 `bold/italic/strike/code/link`；link 必须包含 `href`，并经过 URL 协议校验。列表首版只接受纯文本 item，不接受递归 block。

确定映射：`heading → heading`、`paragraph → paragraph`、`bullet_list → bulletList/listItem`、`ordered_list → orderedList/listItem`、`blockquote → blockquote`、`code → codeBlock`、`divider → horizontalRule`、媒体分别映射到 `editorMediaImage/editorMediaVideo/editorMediaAudio`。不在集合内的 block 导致 Schema 验证失败。

## 15. Event 协议

### 15.1 Envelope

```json
{
  "version": "agent-runtime/v2",
  "event_id": "stream cursor",
  "run_id": 1001,
  "request_id": "req_x",
  "run_version": 7,
  "item_id": 2201,
  "item_version": 3,
  "type": "content.delta",
  "timestamp": "2026-07-10T00:00:00Z",
  "data": {}
}
```

- `run_id` 永远是数据库数字 ID，不得写入 request_id。
- `request_id` 是外部关联字符串。
- `run_version` 在所有事件中必填；Reducer 拒绝小于当前 Run version 的延迟状态事件。
- `item_id` 在 Item 相关事件中必填。
- `event_id` 是 transport 提供的单调 stream cursor，也是续读和去重的唯一事件顺序依据；它由 stream read/response adapter 在写入成功后补入返回 Envelope，不要求业务 payload 在写入前预知 cursor。
- `item_version` 用于拒绝陈旧 Item 更新。
- 前端发现 cursor 过期、Item version 跳跃或无法续读时获取 snapshot。

Go 的 `StreamEvent` 和 TypeScript 的 `RuntimeEvent` 都是上述公共字段加按 type 判别的 `EventData` union；不得把 data 暴露为无约束 map 后由组件猜结构。

### 15.2 事件类型

```text
run.started
run.status
item.started
item.updated
content.delta

tool.started
tool.progress
tool.completed
tool.failed

interaction.required
interaction.resolved
approval.required
approval.resolved

artifact.updated
artifact.ready
suggestion.ready
front_action.ready
usage.updated
snapshot.barrier

run.waiting
run.completed
run.failed
run.canceled
run.interrupted
```

EventData 固定为：

| Event | data |
| --- | --- |
| `run.started/run.status/run.waiting/run.interrupted` | `{run:RunPublic}` |
| `run.completed` | `{run:RunPublic, output:OutputEnvelope}` |
| `run.failed/run.canceled` | `{run:RunPublic, error?:PublicError}` |
| `item.started/item.updated` | `{item:ItemView}` |
| `content.delta` | `{text:string, start_offset:int, end_offset:int}`，offset 为 UTF-8 byte offset |
| `tool.started/tool.completed/tool.failed` | `{item:ItemView}` |
| `tool.progress` | `{call_id,name,progress:number,message?:string}` |
| `interaction.required/resolved` | `{item:ItemView}`，且 type 必须为 `interaction`、payload 必须为 Interaction payload |
| `approval.required/resolved` | `{item:ItemView}`，且 type 必须为 `approval`、payload 必须为 Approval payload |
| `artifact.updated/ready` | `{item:ItemView, artifact:ArtifactRef}`，且 Item type 必须为 `artifact` |
| `suggestion.ready/front_action.ready` | `{item:ItemView}` |
| `usage.updated` | `{usage:Usage}` |
| `snapshot.barrier` | `{run_version:uint64,item_versions:Record<item_id,uint64>}` |

`content.delta` 只作用于同一 assistant Item：`end_offset <= current_offset` 时是重复并忽略，`start_offset == current_offset` 时追加，出现 gap/overlap 不可安全裁剪时立即 GetRun。任何较新的 `item.updated` 用完整 Content 替换增量正文，并把 current_offset 设置为 payload.content_offset；终态前必须先持久化并发送完整 Item snapshot。

生命周期终态事件只有 `run.completed`、`run.failed`、`run.canceled`。`run.interrupted` 会结束当前活动执行流，但 Run 仍可 Resume；前端停止 spinner 并展示“继续”操作。`interaction.required` 和 `approval.required` 只改变为等待状态。

### 15.3 持久化与恢复

- 使用现有 `front/service/stream` 传输和短期保留事件。
- 不新增 Runtime Event 数据表。
- 前端保存 transport cursor，断线后从 cursor 续读。
- 流不存在或已过期时调用带屏障的 `GetRun` 重建。
- Stream 事件是视图加速层；Run/Item 是权威事实。

`GetRun` 必须在单活 leader 内建立串行化 snapshot barrier，不宣称 Redis cursor 与 SQL 属于同一事务：

1. 获取 Coordinator 的 per-run commit/event gate，暂停该 Run 的 Item commit、生命周期事件和 `content.delta` 发送。
2. 若 Worker 仍在进程内，先把 assistant 内存 buffer flush 到 Item；leader 重启后不存在 buffer，以 DB 中 partial Item 为准。
3. 在一致性 SQL 读事务中读取 Run 和全部当前 Items，结束 SQL 事务。
4. 仍持有 gate 时向同一 Runtime stream 追加 `snapshot.barrier`，data 带 `run_version + item_versions`；stream Append 成功返回的 cursor `C` 才是 `resume_cursor`。Append 失败则整个 GetRun 失败，不返回不可续读快照。
5. 返回同一 `RunView` 的 snapshot 与 C 后释放 gate；该 Run 的后续事件 cursor 必须严格大于 C。
6. 前端先原子替换 snapshot，再从 C 之后续读；`run_version + item_version` 拒绝陈旧更新，`event_id` 去重。

`front/service/stream` 的 Runtime Adapter 必须提供 `Append→cursor`、`ReadAfter(cursor)`、`FirstCursor`、`TailCursor` 和 `IsExpired(cursor)` 窄契约。不能实现这些能力时，不得用时间戳或最后一个业务事件猜 cursor。`snapshot.barrier` 只用于恢复协议，不渲染 UI。

`ListItems` 的分页结果没有该屏障，只用于调试历史，前端恢复链路不得把它和另一次 `GetRun` 拼成伪快照。

Run/Item 生命周期和终态变更先在数据库事务内提交，事务成功后才发送对应事件。`content.delta` 是唯一例外：它可先于下一次 assistant Item 快照发送，因此崩溃时最后一个快照之后的可见片段可能丢失，并以 `partial/interrupted` 为准。若数据库提交后、生命周期事件发送前进程崩溃，前端通过 snapshot 恢复；不得为了事件与数据库“恰好一次”而新增逐 Token Outbox。投影失败由 Run projection 状态重试，不影响 Run/Item 权威记录。

## 16. Chat 与 Assistant

### 16.1 单一写入链路

```text
Agent 调试页 / Chat Drawer
      │
      ▼
Assistant.SendMessage
  1. 校验 Session 归属
  2. 同一事务先 CAS 预留 active_request_id，再用 client_message_id 幂等保存 user message
  3. 后端对齐关联 Run 后读取该消息位置的权威历史，构造受控 Memory scope
  4. Runtime.Start 按 request_id 原子 get-or-create queued Run
  5. RunProjector.OnCreated 创建带 run_id 的 assistant running message
  6. Projector 成功后进入执行队列
      │
      ▼
Runtime Event Stream
      │
      ├─ 前端只渲染
      └─ Assistant Projector 更新 assistant message
```

运行创建和消息占位必须是幂等的：

- Runtime 创建 Run 之前 Start 失败时不存在 run_id，Assistant 以 request_id + reply_to_message_id 为幂等关联创建普通 `chat_error` assistant message，`run_id=null`；这不是 RunProjector 事件。
- queued Run 已创建后，`RunProjector.OnCreated` 必须在进入执行队列前同步、按 run_id 幂等创建 assistant 占位消息。
- OnCreated 失败时 Run 转 `failed` 且不调用模型，Start 返回包含 run_id 的失败引用；投影重试仍以同一 run_id 补建一条 failed assistant message，不能再创建第二个 Run 或第二条运行消息。

同一 client_message_id 的网络重试先返回既有 user message、chat_error 或 RunHandle，不重复调用 Start。进程若在预留 `active_request_id` 后、创建 Run 前崩溃，Assistant 在下次请求/启动扫描中按短超时核对 request_id；确认既无 Run 也无活动创建事务后，幂等创建 chat_error 并清空该预留，不能直接重新执行原消息。

Runtime Item 是执行权威记录，Assistant Message 是供 Chat 历史和列表使用的投影。完成投影失败不回滚已完成 Run；Run 记录 `projection_status=retrying`，后台按有限退避重试，超过上限保留 `projection_error` 并允许人工重放投影。

Assistant 历史响应保留每条运行消息的 run_id/status。页面刷新遇到未终态消息时，Runtime Provider 通过带屏障的 `GetRun` 恢复当前正文和 Items；Assistant Message 不按 delta 或 Item 快照双写，只在 `OnResting/OnTerminal` 时同步稳定内容。

发送下一条 Chat 消息前，Assistant 必须按 run_id 检查此前消息的 projection 状态；若终态投影尚未成功，先从 Runtime Run/Item 权威记录构造本轮历史并触发投影重试。无法读取权威 Run 时返回明确错误，不能用缺失的 assistant 内容继续模型对话。

### 16.2 依赖倒置

Runtime 只依赖接口：

```go
type RunProjector interface {
    OnCreated(context.Context, Run) error
    OnResting(context.Context, Run, *Item) error
    OnTerminal(context.Context, RunResult) error
}
```

Assistant 实现该接口，Runtime 不 import Assistant。`OnResting` 只覆盖 `waiting_input/waiting_approval/interrupted`，Item 在 interrupted 无明确阻塞项时可空；`OnTerminal` 只覆盖 `completed/failed/canceled`，RunResult 携带 Output/Error。调用顺序固定为 `OnCreated → 零或多次 OnResting → OnTerminal`，每个回调按 run_id + run_version 幂等。成功完成后的标题和长期记忆异步处理，不阻塞 `run.completed`。

### 16.3 前端请求

前端只提交：

- client_message_id（发送前生成 UUID，重试保持不变）。
- session_id。
- agent key。
- 当前输入和附件。
- 页面 Context/Permission/Reference。

前端不提交权威历史、不写 user/running/final message、不解析 final result fence。

### 16.4 Chat 并发边界

同一 Chat Session 首版只允许一个非终态 Run，保证消息因果顺序。用户在 active/waiting/interrupted Run 未处理时再次发送，Assistant 返回 `session_run_active` 和现有 RunRef，由 UI 提供继续、回答、取消或等待，不静默排队第二条消息。

Coordinator 仍可同时执行不同 Session/Source 的多个 Run；Agent 调试页可用独立 Session/Run 标签并行。未来 Work 将每个任务作为独立上下文启动多个 Run，不复用同一 Chat 消息链，因此无需修改 Runtime 内核。

## 17. 前端架构

### 17.1 Runtime Client

宿主仓库 `/data/project/shemic/front` 承载共享 Client、Store 和通用 UI；bot 仓库只承载 Agent 调试页 Surface。宿主路径：

```text
/data/project/shemic/front/src/lib/agent-runtime/
├── protocol.ts
├── client.ts
├── reducer.ts
├── store.ts
├── selectors.ts
└── effects.ts
```

- `protocol.ts`：严格事件和 Item 联合类型。
- `client.ts`：start/watch/cancel/resume/snapshot。
- `reducer.ts`：纯事件归并，无 I/O 和副作用。
- `store.ts`：队列、批量刷新、按 Item 订阅。
- `selectors.ts`：派生消息、工具、Artifact 和运行状态。
- `effects.ts`：受控前端动作和 Surface 业务副作用。

### 17.2 UI 组件

```text
/data/project/shemic/front/src/components/agent-runtime/
├── provider.tsx
├── thread.tsx
├── message-item.tsx
├── content-block.tsx
├── tool-item.tsx
├── interaction-item.tsx
├── artifact-item.tsx
├── suggestion-item.tsx
├── composer.tsx
└── run-status.tsx
```

Agent 调试页和 Chat Drawer 复用同一个 Provider、Thread、Composer 和 Item Renderer。调试页额外展示 Tool 参数、Usage、耗时和 Event Trace。

### 17.3 单一状态源

```ts
type RuntimeState = {
  runsByID: Record<string, RuntimeRun>
  itemsByID: Record<string, RuntimeItem>
  itemIDsByRun: Record<string, string[]>
  lastEventIDByRun: Record<string, string>
}
```

正文只存在于 `assistant_message` Item 的 ContentBlock。Artifact、交互、建议和工具是独立 Item，UI 通过 selector 组合，不复制到多份 message output。

### 17.4 Reducer 规则

- 只处理语义事件并更新状态。
- 不调用 API、不导航、不保存消息、不修改 page store。
- lifecycle terminal 结束 Run；`interrupted` 结束当前执行但保留 resumable 状态。
- `interaction.required` 将 Run 改为 `waiting_input`。
- 重复事件按 event_id 幂等忽略，陈旧 Item 按 item_version 忽略。
- 陈旧 Run 事件按 run_version 忽略；content.delta 按 UTF-8 offset 追加，缺口触发 GetRun，不能按字符串猜重叠。
- delta 在 16～40ms 内按动画帧批量 dispatch。

### 17.5 Surface Adapter

技能草稿应用、表单填充、页面导航等不进入公共 Runtime UI。它们消费 `artifact.ready` 或 `front_action.ready`，在对应 Surface Adapter 中执行并记录结果。

### 17.6 两仓协议与发布

- Runtime 协议常量为 `agent-runtime/v2`，后端 start/status/stream 均返回版本。
- 宿主 front 的 `plugin/sdk-compat.ts` 显式导出 Runtime Client、Provider 和类型，bot plugin 不复制实现。
- 开发提交顺序：先在宿主 front 增加未启用的 v2 共享模块和 compat 导出；再切 bot backend/plugin；最后切 Chat Drawer 并删除旧 Agent 依赖。
- 生产发布在同一维护窗口完成新 backend、bot plugin manifest 和宿主 front；不提供 v1/v2 兼容分支。
- 版本不匹配时前端停止运行并提示“前后端版本不一致”，不得猜测旧事件结构。
- 首版发布配置必须保证每个环境只有一个 Runtime leader 实例；第二实例抢不到 leader lease 时不得通过 Runtime health 或接收 Runtime 流量。

## 18. 性能与 Token 策略

### 18.1 感知速度目标

- `run.started` 本地开销目标：请求接受后 100ms 内。
- Runtime 读取 Energon Stream 的 block：25～50ms。
- 前端 delta 合并：16～40ms。
- assistant Item 快照：约 500ms 或累计 4KB。
- 工具开始和进度事件在收到后立即转发。

模型供应商延迟不纳入本地 100ms 目标。

### 18.2 避免额外串行步骤

- 不先调用模型做意图分类或 Tool 路由。
- 普通 Chat 不做 JSON 格式化 Turn。
- 标题和长期记忆在 Run 完成后异步处理。
- 同批安全工具并发。
- `suggest_actions` 等 presentation tool 在已有可交付正文时不强制额外模型 Turn。

### 18.3 Token 减少

- 只提供 Agent 已挂载工具。
- 工具 Schema 简短、稳定排序。
- Skill metadata-first，正文按需加载。
- 知识库按需读取，不注入全部文档。
- 大 Tool Result 使用 Artifact/引用。
- 清理旧 Tool Result，再进行摘要。
- Rich document 使用紧凑语义块，Runtime 再转 Tiptap JSON。
- Prompt 固定前缀与动态后缀分离。

### 18.4 指标

Run Usage 至少记录：

- queue_ms。
- context_ms。
- model_request_ms。
- first_model_event_ms。
- first_visible_text_ms。
- model_total_ms。
- tool_wait_ms 和每个 Tool wall time。
- output_finalize_ms。
- total_ms。
- input/output/cached/reasoning token（上游有值时）。
- model_turn_count、tool_call_count、compaction_count。

前端展示状态和工具进度，不展示私有 Chain of Thought。

## 19. 安全与权限

- Runtime 启动前完成 Agent、Session、Source 和资源权限校验。
- Effective Catalog 是最小权限工具面。
- Front Action 使用允许路径和动作白名单。
- 写入、外部调用、危险脚本按 Tool Definition 要求审批。
- Secret、Cookie、Token、API Key 不进入 Prompt、Run、Item、Event 和日志。
- Tool Result 在进入模型和前端前分别执行预算、脱敏和展示归一化。
- 脚本执行继续使用现有 Sandbox 限制，RuntimeConfig 的 Sandbox 字段不得因清理旧 Runtime 而丢失。
- Tool 调用和副作用保留 call_id、Actor、资源范围和终态审计。

## 20. 错误模型

公开错误码：

```text
invalid_input
agent_not_found
agent_disabled
model_unavailable
model_tool_unsupported
model_capability_unknown
model_stream_failed
model_protocol_error
context_overflow
run_ref_conflict
request_id_conflict
projection_unavailable
session_run_active

tool_not_found
tool_name_conflict
tool_invalid_arguments
tool_denied
tool_timeout
tool_failed

interaction_expired
approval_expired
resume_conflict
side_effect_uncertain
noninteractive_tool_blocked
output_validation_failed
run_timeout
run_canceled
run_interrupted
internal_error
```

错误结构包含：

- code。
- 面向用户的 message。
- retryable。
- run_id/item_id/call_id。
- 供日志定位的内部 cause，返回前脱敏。

工具错误规则：

- 参数错误作为结构化 Tool Result 回灌，允许模型一次自我修正。
- 可恢复业务错误由模型决定换参数或换工具。
- 达到连续错误上限后 Run 失败。
- 首个 ModelEvent 前的瞬时连接错误，在最近 checkpoint 之后没有任何副作用时最多自动重试一次；认证、额度、模型配置类错误直接 `failed`。
- 已出现可见 delta，或已接收任意 Tool Call/arguments 片段后发生流错误，不自动重试：assistant Item 标记 `interrupted/partial`，保存安全 checkpoint，Run 以 CAS 从 `running` 转为 `interrupted`，发送 `run.interrupted` 并提供显式 Resume。
- 完整 Tool arguments 结束事件到达但 JSON/协议仍非法时，以 `model_protocol_error` 失败，不猜测自由文本工具调用。

## 21. Team、Flow、Project 和内部调用方

本次只做非交互接口适配：

```text
RunInternal         → Execute
InternalRunRequest  → ExecuteRequest
InternalRunResult   → RunResult
OnRunCreated        → RunProjector.OnCreated
OnRunResting        → RunProjector.OnResting
OnRunTerminal       → RunProjector.OnTerminal
OnStream            → EventSink.Emit
Stop                → Cancel
RunTraces           → GetRun + ListItems
```

直接调用点至少包括：

- Team Agent Node Executor。
- Team 独立沟通角色。
- Project 单 Agent 节点。
- Workspace Cancel。
- Skill Install Planner。
- Team 调试 Run Trace。

Team/Flow 的 Run、NodeRun、Approval、Blackboard、锁和状态机均保留。首版 `source_type in (team,project,skill,internal)` 的 Effective Catalog 在普通交集之后再强制排除：

- `ResultMode=interaction` 的工具。
- `Approval != never` 的工具。
- 根据当前 Source/Invocation/资源策略存在动态升级为 Runtime approval 可能的工具。
- 可能返回 `Control=suspend` 的业务工具。

因此不是只隐藏 `ask_user` 或 approval control tool，而是从模型 Manifest 根除所有可能让 Runtime 等待的工具。若工具实现违反快照声明并在执行时请求 interaction/approval，Runtime 自动拒绝为 `noninteractive_tool_blocked` Tool Result；不得进入 waiting。Team 自身审批继续按原状态机运行。交互式 Skill 创建/安装页面必须以 `chat` 或 `debug` Source 调用，不使用非交互 `skill/internal` Source。以后正式重构 Team 时，再启用 Runtime Interaction/Resume。

现有 Team/Workspace 的 `agent_run_id` 继续引用新 `bot_agent_run.id`。Asset Version 的 `run_id` 是 Team Run 语义，不能再写 Agent Run ID；本次按第 11.6 节新增 nullable `agent_run_id + agent_item_id`，并更新 relation 和写入点。这是必要模型迁移，不称为 Team 机械适配。

## 22. API

后台 API 保持薄：

```text
POST /bot/admin/agent/run
GET  /bot/admin/agent/stream
GET  /bot/admin/agent/run_status
POST /bot/admin/agent/cancel
POST /bot/admin/agent/resume
```

建议响应：

```json
{
  "run_id": 1001,
  "request_id": "req_x",
  "status": "queued",
  "stream_cursor": "0-0"
}
```

`run_status` 返回 Run、Items、Output 和当前 stream cursor，不返回原始 secret 或完整模型请求。

Assistant 增加统一业务入口 `SendMessage`；具体 HTTP 路由可沿用现有 assistant API 命名规则。旧前端 `message` 写入接口不再用于运行消息，但仍可保留给非 Runtime 的受控消息维护场景。

## 23. 删除、保留与迁移

### 23.0 分仓范围

本设计产生两个仓库的独立提交：

- `backend/package/bot`：Runtime、Model、API、Assistant/Team/Project 适配、bot plugin Agent Surface。
- `/data/project/shemic/front`：共享 Runtime Client/Store/UI、Chat Drawer 和 SDK compat 导出。

提交必须按职责拆分，发布必须协调；规格文档放在 bot 仓库不代表宿主 front 不在范围内。

### 23.1 删除并重建

当前 `service/agent/runtime/**` 全部删除后重建，包括：

- `chat/**`。
- `context/**`。
- `stream/**`。
- `tool/**`。
- `result/**`。
- `main.go`、`runner.go`、`deps.go`、`request.go`。
- `assistant_sync.go`。
- `profile.go`、`policy.go`、`hooks.go`、`lifecycle.go`。
- 旧 `repo.go`、`reference.go`、`trace.go`、`view.go`。

旧能力只迁移行为，不迁移旧接口、Profile 分支或兼容解析。

### 23.2 Runtime 外保留复用

- `service/energon/**`、`model/energon/**`。
- `service/agent/knowledge`。
- `service/agent/skill`。
- `service/agent/sandbox`。
- `service/asset`。
- `service/assistant` 和 `service/memory`。
- `front/service/stream`、Bot 通用流 payload。
- RichText、Markdown、媒体、Interaction、Reference 和 Memory 前端组件。

### 23.3 前端删除重写

- `backend/package/bot/front/src/nodes/show/agent.tsx` 重建为薄页面组合器。
- `agent-parts.ts` 和 `agent-message-parts.tsx` 由统一 protocol/reducer 取代。
- 删除 Agent 专属旧流解释器、运行消息写入、history 拼装和 final fence 解析。
- 删除公共 Agent UI 中的 Skill Draft JSON 猜测和页面 Store 修改。
- `front/src/lib/agent/runner.ts` 改由新 Runtime Client 取代。
- `front/src/lib/assistant/client.ts` 只保留 Chat Surface Adapter，不再解释 Runtime 流。
- Chat Drawer 保留外壳，运行状态和消息逻辑移到 Agent Runtime Provider。

### 23.4 暂不删除

以下仍被 Team、Energon、上传或通用 stream 使用，本次只让 Agent Runtime 停止依赖：

- `front/src/lib/runtime-stream-runner.ts`。
- `front/src/lib/runtime-stream-output.ts`。
- `backend/package/bot/front/src/nodes/show/stream-request.tsx`。
- Workspace/Team 专用 stream 文件。

### 23.5 Runtime 外机械调整

- `api/admin/agent.go` 切换 Start/Resume/Cancel。
- Assistant 增加 SendMessage 和 RunProjector，删除 Runtime 双写。
- Team、Project、Skill Planner 切换 Execute。
- Team/Workspace Cancel 改调用 Runtime Service，不直接查 Runtime Model。
- Team Debug 改读 Run/Items。
- Maintenance 清理从 Step 改为 Item 后 Run。
- 修正 Asset Version 混用 Agent Run ID。
- 将被 Runtime 外代码依赖的 Sandbox Config normalize 函数移到 `service/agent/sandbox` 或 model config，确保旧 Runtime 可整目录删除。

## 24. 数据清理

只处理开发 backend 数据库和开发 Agent Stream，8091 Demo 不动。切换命令必须通过同一个环境保护函数读取并验证：

- 数据库目标等于明确传入的开发库，且不等于 `shemic_demo`。
- Stream 的实际 `addr + redis_db + prefix` 等于明确传入的开发配置。
- 硬拒绝 `redis_db=1`、`prefix=shemic_demo`、Demo project root 和监听 8091 的进程配置。

任一值缺失、无法解析或不匹配立即退出；只知道 Redis addr 相同不能视为安全。

必须清理：

```text
DROP TABLE bot_agent_step
DROP TABLE 后按 v2 schema 重建 bot_agent_run
CREATE TABLE bot_agent_item
先 DELETE bot_assistant_message，再 DELETE bot_assistant_session
按已保存的旧 Session/owner/context 范围 DELETE 对应 Chat Memory
清理开发环境 Agent Stream Namespace
```

`bot_memory` 不能无条件整表清空，因为还承载其他场景。只删除关联旧 Chat Session 或属于本次 Chat owner/context 的记录。

如果保留 Team/Workspace 历史，将旧 `agent_run_id` 置零，避免悬空引用。如果决定同时清空所有运行历史，可清理 Team/Workspace 运行记录，但不得清除配置定义。

不得清理：

- Agent、Agent Setting、Setting Pack。
- Skill、Skill Pack。
- Knowledge 配置和文档。
- Power、Provider、Service、Account。
- Asset 配置。
- Team、Flow、Workspace 定义。

### 24.1 切换 Runbook

旧 Runtime 和新 Schema 不支持混跑，因此数据库切换只能在新代码完成后的维护窗口执行：

1. 在停机前预备协议均为 `agent-runtime/v2` 的 backend 制品、bot plugin manifest/前端制品和宿主 front 制品；记录 bot/backend 与 front 两仓 commit、三份制品 checksum。制品构建和验证由用户现有发布流程完成，本任务不运行 build/test。
2. 备份开发数据库 schema/data、旧 backend、旧 bot plugin、旧宿主 front 和当前配置；验证备份可读。8091 Demo 制品和数据库不进入操作清单。
3. 停止开发 backend 的写流量，尚未健康放量前不接受 v2 新写入；8091 Demo 继续使用独立数据库。
4. 校验目标数据库硬保护，记录 Run、Step、Session、Message、相关 Memory、Agent/Skill/Knowledge/Power 配置、工具挂载 Manifest 及外部引用计数。
5. 在清 Session 前保存旧 Session ID 集合，并只删除这些 Session 对应的 Chat Memory。
6. 先检测数据库驱动和 DDL 事务能力：
   - PostgreSQL 且本次全部 DDL 支持事务时，在一个显式事务中执行下列 schema/data 操作。
   - 驱动存在 DDL 自动提交或不支持事务回滚时，不宣称原子事务；保持停机，先完成可恢复备份，再按编号 migration script 执行，每步记录完成标记，并准备与备份版本匹配的 restore script。
7. 执行 schema/data 操作：
   - 将保留的 Team/Workspace 记录中的旧 `agent_run_id` 置零。
   - 清理旧 Assistant Message/Session。
   - 删除 `bot_agent_step`，重建 `bot_agent_run`，创建 `bot_agent_item`。
   - 修改 Assistant Session/Message、创建 AgentTool/AgentPower/ModelCapability，并增加 Asset Version `agent_run_id + agent_item_id` schema。
   - 按第 7.5 节写入显式工具/Power 挂载。
8. 事务成功或非事务脚本全部成功后，重新执行数据库与 Redis 环境保护函数，只清理已验证开发 `prefix` 下的 `agent` stream namespace。
9. 同一维护窗口部署第 1 步的匹配 backend、bot plugin 和宿主 front，不允许替换其中一份后对用户放量。
10. 在无用户写流量下由用户手工检查协议版本、health、schema、默认挂载和只读 smoke；重新记录计数，确认配置定义数量不变、旧运行引用不存在、Asset `agent_run_id + agent_item_id` 正确。
11. 三份制品与数据库同时健康后才恢复开发环境写流量。

任一步失败的回滚顺序固定为：停止/保持停止新写入 → 停止 v2 backend → 恢复第 2 步数据库备份和 schema → 恢复三份旧制品 → 通过同一 Redis 环境保护函数后只清理失败切换产生的开发 Agent Stream → 启动旧 backend 并核对旧协议。由于健康放量前没有 v2 用户写入，回滚不需要把 v2 Run 反向转换为 v1。任何回滚命令仍必须通过数据库、Redis、Demo project root 和 8091 硬拒绝校验。

开发期间不得先运行会破坏旧 Runtime 的自动迁移。若 Dever 启动会自动变更 schema，则切换前保持 backend 停止，代码和 schema 在同一维护窗口一次切换。

## 25. 实施顺序

1. 保存当前两仓工作、建立 Energon 能力基线 commit，并在删除旧 Runtime 前生成/审查/提交第 7.5 节工具挂载 Manifest。
2. 定义 Run、Item、ContentBlock、Tool、Event、OutputContract 和 Error 公共协议。
3. 在代码分支中完成新 Run/Item Model、Repository 和状态转换，但不对共享开发库执行破坏性迁移。
4. 实现现有 Energon 的薄 Model Client。
5. 实现共享 Coordinator、唯一 Agent Loop、限制、Checkpoint、Cancel 和中断扫描。
6. 实现显式 Tool Registry、Agent Mount Resolver、Policy、Executor 和 Scheduler。
7. 迁移 Knowledge、Skill、Power、Asset、Front、Platform 和 MCP 工具行为。
8. 实现 Interaction、Approval 和 Resume。
9. 实现 Context Budget、Tool Result 清理和 Compaction。
10. 实现 Text、Structured 和 Rich Document OutputEngine。
11. 实现统一 Event Emitter 和 Run Snapshot。
12. 实现 Assistant SendMessage/RunProjector，删除前后端双写。
13. 先在宿主 front 增加 v2 Client/Store/UI 和 SDK compat，再重建 bot Agent Surface，最后切 Chat Drawer。
14. 适配 Team、Project、Skill Planner、Cancel、Debug、Asset relation 和 Maintenance。
15. 完成旧 Runtime、旧协议和旧前端兼容代码删除后，按第 24.1 节执行协调数据库/发布切换。
16. 由用户按验收清单进行手动验证。

最终目录不得同时保留 Runtime v1/v2 或兼容开关。

## 26. 手动验收清单

用户手动验证以下场景：

1. 无工具 Agent 流式 Markdown 对话。
2. Agent 只看到已挂载工具，未挂知识库时不能调用知识库。
3. 知识库 list/search/read，模型能看到真实结果而非只有“完成”摘要。
4. 单次响应中的多个只读工具并行，结果顺序稳定。
5. 写入或外部副作用工具串行并触发审批。
6. `ask_user` 进入 `waiting_input`，回答后继续同一个 run_id。
7. 审批拒绝后模型收到 denied Tool Result 并可调整方案。
8. 模型流、Tool、Asset 长任务都可取消。
9. 后端重启后普通运行标记 `interrupted`，未决副作用进入 `uncertain/waiting_approval`；继续时不重复已完成副作用。
10. SSE 断线后按 cursor 续读；流过期后按 Run/Items 重建。
11. 长对话触发 Tool Result 清理和 Compaction，用户约束不丢失。
12. 普通 Chat 不输出协议 JSON 或 Markdown 控制 fence。
13. Structured 输出严格通过 Schema。
14. Rich Document 最终生成有效 Tiptap `rich_json`，段落媒体引用有效。
15. Agent 调试页展示正文、工具卡片、参数、进度、Usage、耗时和错误。
16. Chat Drawer 和 Agent 调试页复用同一事件 Reducer。
17. Session 中每个 Run 只有一条 Assistant 运行消息，不再双写。
18. Team Agent 节点、Project 单 Agent 节点、Skill Planner 正常调用新 Execute。
19. Team/Workspace 取消能级联取消 Agent Run。
20. 8091 Demo 环境和数据库不受影响。
21. queued、model streaming、每个 Tool 状态和 projection 阶段分别模拟重启，状态均可解释和恢复。
22. 并发 Resume/Cancel 只有一个 CAS 成功，重复 idempotency key 返回同一结果。
23. 非幂等副作用在“外部成功、结果未入库”后显示 uncertain，不自动重试。
24. 默认 AgentTool/AgentPower 挂载存在，新 Agent 不隐式获得全局 Power。
25. Team/Project 来源不能看到任何可能交互/审批的工具；实现违规请求得到 `noninteractive_tool_blocked` 且不进入 waiting。
26. bot plugin、backend、宿主 front 版本不匹配时明确拒绝，不解析旧协议。
27. 切换前后配置定义计数一致，旧 agent_run_id 无悬空引用，Asset `agent_run_id + agent_item_id` 语义正确。
28. 同一 Chat Session 的第二个非终态 Run 被 `session_run_active` 拒绝，不破坏消息因果顺序。
29. 不同 Session/调试标签的多个 Run 在 Coordinator 限额内并行执行、分别取消和恢复。

## 27. 完成定义

本重构完成必须同时满足：

- 最终代码中只存在一个 Agent Loop。
- Runtime 不 import Assistant、Team、Project 或模型 Provider 实现。
- Energon 模型接入层没有为本重构新增或修改协议分支。
- Chat、调试页和内部调用方使用相同 Run/Item/Event 语义。
- `ask_user`、Approval、Cancel、Interrupted Resume 是真实状态转换；`interrupted` 不被误当 lifecycle terminal。
- 工具可见性来自 Agent 挂载和权限交集。
- Tool Result 的 ModelContent 可验证地进入模型上下文。
- Runtime DB 只保存 Run/Item 权威状态，不逐 Token 建 Event 记录。
- 普通文本、Structured 和 rich document 输出均有唯一确定协议。
- 旧 Runtime、旧 Step、旧双写和旧前端兼容解析全部删除。
- 用户完成手动验收，未触碰 Demo 环境。
