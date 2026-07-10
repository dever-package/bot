# Agent Runtime v2 Tools, Context and Output Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Runtime Core 之上实现只暴露已挂载能力的完整 Tool Engine、可压缩的 Token Context、可恢复 Artifact，以及 Markdown、Structured、Tiptap Rich Document 三种统一输出。

**Architecture:** Runtime Core 继续只负责 Run/Item/Lease/Loop；本阶段增加显式 `Registry → Mount Resolver → Policy → Scheduler → Executor → Outcome` 工具链，并通过 `engine` 端口接入 Context 与 Output。知识库、Skill、Power、前端动作和素材均是 Tool Adapter；Assistant、Team、Project 不进入 Runtime 包。工具结果、交互、审批、Artifact、压缩和输出全部落为 Item，模型只看到预算内的 `ModelContent`。

**Tech Stack:** Go 1.25、Dever ORM/Service/Page JSON、PostgreSQL、现有 Energon Gateway、现有 front upload、Tiptap JSON

---

## 实施约束

- 前置完成 `2026-07-10-agent-runtime-v2-01-core.md`，沿用其中 `runtime/core`、`runtime/store`、`runtime/engine`、`runtime/model` 公共契约。
- 本阶段不修改 `service/energon/**`、`model/energon/**` 或 Provider Adapter。
- 不恢复 `init() + ProviderFactory`；任何重复 tool key、capability key 或 schema hash 冲突都在模型调用前失败。
- `platform_mcp_call` 不注册、不挂载、不进入 seed；真实 MCP 只允许按发现到的具体工具逐项注册。
- 本计划不安排 build、test、lint；实现提交后按总 Roadmap 的手工验收阶段验证。
- 每个 Task 单独提交；提交中不得混入用户已有改动。

### Task 1：补齐 Agent 挂载关系并锁定 Core 模型边界

**Files:**

- Modify: `model/agent/agent.go`
- Modify: `model/agent/agent_knowledge_base.go`

- [ ] **Step 1：复用 Core 已创建的唯一挂载模型**

`AgentTool`、`AgentPower`、`MemoryEnabled`、`OutputType`、`OutputSchema` 已由 Core 计划 Task 2 创建，本计划不得重复定义或改类型。确认全仓只有 `bot_agent_tool`、`bot_agent_power` 各一个 Model，`MemoryEnabled` 继续使用 Core 固定的 `int16` 开关语义。

- [ ] **Step 2：复核两个挂载关系并增加知识库关系入口**

`NewAgentModel()` 必须直接复用 Core 已增加的 `agent_tools`、`agent_powers` Through relation，本任务只补 `agent_knowledge_bases`，不得保留或新增 `tools/powers` 同义入口。三者排序分别为 `sort asc,tool_key asc`、`sort asc,id asc`、`sort asc,id asc`。Skill 继续只使用现有 `skill_pack_id`，不得增加第二套 Agent-Skill 关系。

`agent_knowledge_bases` 关系必须经过 `bot_agent_knowledge_base`，保留 join 行上的 prompt、retrieve_limit、score_threshold、status、sort；不得直接把所有 KnowledgeBase 暴露给 Runtime。

- [ ] **Step 3：静态确认无重复定义并提交**

```bash
rg -n 'type AgentTool struct|type AgentPower struct|MemoryEnabled|OutputType|OutputSchema' model/agent
git diff --check -- model/agent/agent.go model/agent/agent_knowledge_base.go
git add model/agent/agent.go model/agent/agent_knowledge_base.go
git commit -m "feat: expose agent runtime mount relations"
```

预期：每个类型和 Agent 字段只有一处定义；本提交只增加关系，不重建 Core 模型。

### Task 2：建立共享 JSON Schema 与显式 Tool Registry

**Files:**

- Create: `service/agent/runtime/jsonschema/schema.go`
- Create: `service/agent/runtime/jsonschema/validate.go`
- Create: `service/agent/runtime/jsonschema/helpers.go`
- Create: `service/agent/runtime/tool/types.go`
- Create: `service/agent/runtime/tool/registry.go`

- [ ] **Step 1：实现共享 Schema 编译器**

`jsonschema.Compile` 在保存 Agent 和冻结 Catalog 时校验 Schema 本身，`Validate` 同时供工具参数、挂载配置、Structured Output 和 Rich blocks 使用：

```go
type Schema map[string]any

type Compiled struct {
    Schema Schema
    Hash   string
}

func Compile(raw any) (Compiled, error)
func (c Compiled) Validate(value any) error
func CanonicalHash(schema Schema) (string, error)
```

首版明确支持 `type`、`properties`、`required`、`additionalProperties`、`items`、`enum`、`const`、`oneOf`、`anyOf`、`allOf`、`minimum/maximum`、`minLength/maxLength`、`minItems/maxItems`、`pattern`、`format:uri`。遇到未支持关键字直接返回 `schema_unsupported`，不能静默忽略约束。

- [ ] **Step 2：定义 Tool、Policy 与 Outcome 契约**

```go
type Definition struct {
    Name          string
    HandlerVersion string
    Description   string
    InputSchema   jsonschema.Schema
    MountSchema   jsonschema.Schema
    ReadOnly      bool
    SideEffect    bool
    ParallelSafe  bool
    Idempotent    bool
    Approval      ApprovalMode
    CanSuspend    bool
    ResolvePolicy PolicyResolver
    Timeout       time.Duration
    ResultBudget  int
    ResultMode    ResultMode
    ArgumentPolicy ArgumentPolicy
}

type ResolvedCallPolicy struct {
    ReadOnly                    bool
    SideEffect                  bool
    ParallelSafe                bool
    Idempotent                  bool
    Approval                    ApprovalMode
    CanSuspend                  bool
    SupportsExternalIdempotency bool
    CapabilityKey               string
    PolicyVersion               string
    TimeoutMS                   int64
    MaxAttempts                 int
    RetryBackoffMS              int64
    RetryableCodes              []string
}

type Outcome struct {
    ModelContent []core.ContentBlock
    Structured   any
    Presentation *Presentation
    Artifacts    []core.ArtifactRef
    Control      Control
    Error        *ToolError
}
```

固定 `Control=continue/suspend/finish`，`ResultMode=observation/interaction/presentation`，`ApprovalMode=none/once`。静态 Definition 表示最坏情况；动态 policy 只能收紧。重试默认 `MaxAttempts=1`；只有只读或明确幂等 Tool 可提高到 2，并冻结固定有界 backoff 与允许重试的 transport/timeout code 清单。未知业务错误不可重试。

`ArgumentPolicy` 固定允许持久化的字段、server-owned opaque reference 字段和拒绝的 credential 路径。所有 arguments 在 Schema 后、创建 Item 前统一经过 `ArgumentGuard`：拒绝/清除 `authorization/cookie/token/password/api_key/secret` 等 raw credential，要求 Handler 从 mount 的 opaque secret ref 服务端解析；digest 基于 canonical sanitized arguments。未经该 Guard 的原始模型 arguments 不进入 Run/Item/Event/日志。

- [ ] **Step 3：实现无全局副作用的 Registry**

```go
type Handler interface {
    Execute(context.Context, CallContext) (Outcome, error)
}

type Registered struct {
    Definition Definition
    Handler    Handler
}

type Registry struct { /* private immutable map */ }

func NewRegistry(entries ...Registered) (*Registry, error)
func (r *Registry) Register(Registered) error
func (r *Registry) Freeze() (Snapshot, error)
```

`Register` 拒绝空 key、空 HandlerVersion、重复 key+version、无 Handler、非法 Input/Mount Schema；同 name 只能有一个 active version，旧 version 只可作为有界恢复 handler 显式保留。`Freeze` 深复制并按 name 排序，之后禁止写入。

- [ ] **Step 4：提交 Registry 基础**

```bash
git add service/agent/runtime/jsonschema/schema.go service/agent/runtime/jsonschema/validate.go service/agent/runtime/jsonschema/helpers.go service/agent/runtime/tool/types.go service/agent/runtime/tool/registry.go
git commit -m "feat: add explicit runtime tool registry"
```

### Task 3：实现 Mount Resolver、Effective Catalog 与 Policy 快照

**Files:**

- Create: `service/agent/runtime/tool/mount.go`
- Create: `service/agent/runtime/tool/mount_repository.go`
- Create: `service/agent/runtime/tool/catalog.go`
- Create: `service/agent/runtime/tool/policy.go`
- Modify: `service/agent/runtime/core/item.go`

- [ ] **Step 1：定义挂载事实与解析输入**

```go
type MountState struct {
    DirectTools   []agentmodel.AgentTool
    Powers        []MountedPower
    Knowledge     []MountedKnowledgeBase
    SkillPackID   uint64
    SkillEntries  []agentskill.Entry
}

type ResolveRequest struct {
    AgentID      uint64
    LLMPowerID   uint64
    SkillPackID  uint64
    Source       core.RunSource
    Invocation   core.InvocationContext
    Model        runtimemodel.ResolvedCapability
    Runtime      agentmodel.RuntimeConfig
}

type MountRepository interface {
    Load(context.Context, ResolveRequest) (MountState, error)
}
```

Dever 实现只查询启用行；按 Invocation 中服务端固化的 resource IDs 再取交集。AgentPower 排除当前 LLM Power、停用 Power 和 `kind=text/embeddings`。

- [ ] **Step 2：按固定派生规则构造 Catalog**

```go
type Catalog struct {
    Definitions []ResolvedDefinition
    ByName      map[string]ResolvedTool
    Capabilities CapabilityDirectory
    Hash        string
}

func (r Resolver) Resolve(context.Context, ResolveRequest) (Catalog, error)
```

规则必须逐项实现：

- AgentTool 只解析具体 `tool_key`，config 通过对应 MountSchema。
- 有 Knowledge relation 才派生四个知识库工具。
- Skill Pack 非空即派生只读 `read_skill`；含可调用 method/script 时再派生 `run_skill`。
- `runtime_role=capability` 的 AgentPower 才派生 capability 三工具。
- Power 原生 kind 为 `image/video/audio` 时默认允许对应素材 kind；`multi/workflow/role/text` 只有受审 AgentPower mount config 明列 `runtime_role=asset + asset_kinds[]` 才派生 `create_assets`。`file` 是允许的产物 kind，不要求 Energon 存在 file kind。运行时禁止按 Power 名称猜素材能力。
- 非交互 Source 先逐 target/operation 解析冻结 policy，过滤 `CanSuspend` 或 `Approval!=none` 的 capability/skill entry，再重建 wrapper 动态 enum 和最坏 policy；安全 entry 仍可通过同一个 wrapper 使用。过滤后为空才删除 wrapper。普通静态 blocking Tool 直接删除。
- 模型不支持 Tool Calling 且 Catalog 非空时返回 `model_tool_unsupported`。

- [ ] **Step 3：解析并冻结每次调用的动态 policy**

```go
type PolicyResolver interface {
    ResolvePolicy(context.Context, PolicyContext) (ResolvedCallPolicy, error)
}

func ResolveCallPolicy(
    ctx context.Context,
    definition Definition,
    mountConfig map[string]any,
    call core.ToolCall,
) (ResolvedCallPolicy, error)
```

在参数 Schema 通过之后、审批或调度之前解析。Mount 只能把 `none` 提高为 `once`、把 timeout 缩短到全局/Definition 上限；未知 Power/Skill operation 固定为副作用、非幂等、串行、一次审批。

- [ ] **Step 4：把 policy 加入严格 Item payload**

`tool_call` payload 必须包含 `arguments`、`arguments_digest`、`policy`；Item 进入 `running` 前保存完成。Resume、重试、重启恢复只能读该快照，不能重新解释当前挂载。

- [ ] **Step 5：提交挂载解析**

```bash
git add service/agent/runtime/tool/mount.go service/agent/runtime/tool/mount_repository.go service/agent/runtime/tool/catalog.go service/agent/runtime/tool/policy.go service/agent/runtime/core/item.go
git commit -m "feat: resolve immutable agent tool catalogs"
```

### Task 4：实现 Scheduler、Executor、Outcome Normalizer 并接入 Loop

**Files:**

- Create: `service/agent/runtime/tool/engine.go`
- Create: `service/agent/runtime/tool/scheduler.go`
- Create: `service/agent/runtime/tool/executor.go`
- Create: `service/agent/runtime/tool/outcome.go`
- Modify: `service/agent/runtime/tool/types.go`
- Modify: `service/agent/runtime/core/run.go`
- Modify: `service/agent/runtime/store/repository.go`
- Modify: `service/agent/runtime/store/item.go`
- Modify: `service/agent/runtime/engine/ports.go`
- Modify: `service/agent/runtime/engine/coordinator.go`
- Modify: `service/agent/runtime/engine/turn.go`
- Modify: `service/agent/runtime/engine/loop.go`
- Modify: `service/agent/runtime/engine/resume.go`
- Create: `service/agent/runtime/blocking_expiry.go`
- Modify: `service/agent/runtime/deps.go`

- [ ] **Step 1：定义 Tool Engine 端口**

```go
type ToolEngine interface {
    Catalog(context.Context, tool.ResolveRequest) (tool.Catalog, error)
    ExecuteBatch(context.Context, tool.BatchRequest) (tool.BatchResult, error)
    Resume(context.Context, tool.ResumeRequest) (tool.ResumeResult, error)
    QuiesceRun(context.Context, uint64) (tool.QuiesceResult, error)
}

type CommitGate interface {
    WithRun(context.Context, uint64, func() error) error
}

type BatchResult struct {
    Results       []core.ContentBlock
    Completed     []core.ItemView
    RestingStatus string
    BlockingItem *core.ItemView
    Control       Control
}

type QuiesceResult struct {
    Uncertain    bool
    BlockingItem *core.ItemView
}
```

`CommitGate` 端口定义在 `runtime/tool`，Core 的 `engine` concrete gate 直接满足它；`runtime/tool` 禁止 import `runtime/engine`，从而保持 `engine → tool → store/core` 单向依赖。`engine.Dependencies` 增加 ToolEngine。`BatchResult.Control=finish` 让 suggestion/presentation-only Tool turn 在结果已持久化后直接进入 Output Finalize；`suspend` 必须同时带 resting status/blocking item。

Run 的 `tool_snapshot` 保存完整严格 `CatalogSnapshot`，checkpoint 只保存其 canonical hash：

```go
type CatalogSnapshot struct {
    Hash         string
    Tools        []ResolvedToolSnapshot
    Capabilities []CapabilitySnapshot
    Resources    []MountedResourceSnapshot
}

type ResolvedToolSnapshot struct {
    Name, DefinitionHash, HandlerVersion, PolicyVersion string
    MountConfig       map[string]any
    ResourceIDs       []uint64
    AllowedHosts      []string
    AllowedScripts    []string
    DefaultArguments  map[string]any
}

type MountedResourceSnapshot struct {
    Kind, Key, ContentHash string
    ID                     uint64
    Config                 map[string]any
}
```

snapshot 仅含 ArgumentGuard 清理后的普通配置与 opaque secret refs，不含明文 secret；Knowledge relation、Skill entry、Power/capability identity、动态 enum 和 handler/policy version 均冻结。Skill resource config 包含 entry/manifest/content hash 及允许 script path+digest；执行时回读文件必须复核 hash，变化或旧 Handler version 已不可用时明确 `tool_snapshot_unavailable`，不能执行新内容猜兼容。Knowledge 可读取同一冻结 base/file identity 的当前索引内容，但不能越出 mount IDs。`CallContext` 只能从 snapshot 取得 mount config/resource/host/script/default arguments，Resume/restart 禁止重读当前挂载表来改变既有 Run。

把 Core 的基础 Checkpoint 一次性扩展为最终可恢复形状，不另建 ToolCheckpoint：

```go
type Checkpoint struct {
    Messages             []Message
    NextModelTurn        int
    AssistantItemID      uint64
    AssistantVersion     uint64
    VisibleTextOffset    int
    LastSafeItemSeq      int
    CompletedCallIDs     []string
    PendingCallIDs       []string
    ToolCallCount        int
    Usage                Usage
    CompactionBoundary   int
    BlockingItemID       uint64
    BlockingCallID       string
    OutputContractHash   string
    ToolSnapshotHash     string
    MemoryEntryHashes    []string
    ResumeReceipts       []ResumeReceipt
    PendingExternalIdempotencyKeys map[string]string
}
```

数组按稳定顺序保存且空值为 `[]`，map 空值为 `{}`；`ResumeReceipts` 沿用 Core 的唯一结构，不能另建 interaction/approval 幂等表。除 `PendingExternalIdempotencyKeys` 外只保存 hash/ID，不保存 secret、raw answer 或原始 HTTP 上下文。该私有 map 仅按 `call_id:next_attempt` 暂存 side-effect retry 真正执行所需的 external key，绝不进入 RunView/Item/Event/日志/模型；对应 Tool Result 提交后立即清除，restart audit 仍可安全恢复同一次 retry。

- [ ] **Step 2：实现确定性批调度**

调度顺序固定：完整解析全部 call → 每项 Schema/权限/policy → 找到原始顺序的第一个 blocking boundary → 创建一个 interaction 或一个批 approval → 执行 boundary 前允许执行的项 → 按模型原顺序组装结果。

完整模型响应收齐后，先对全部 calls 执行 Schema、ArgumentGuard、权限和 policy，再在一个 CommitGate 中写 sanitized `tool_call` Item、pending call IDs 和 checkpoint，之后才能开始任何外部调用；所有 sidecar 遵守 Core parent 链，tool_result/artifact 指向 tool_call，其余本 turn sidecar 指向 assistant_message。arguments 仍是 partial/非法 JSON 时不创建可执行 Item，以 `model_protocol_error` 进入失败或 interrupted 边界，禁止从文本补猜。

同批 `ReadOnly && ParallelSafe` 默认并发 4；SideEffect、非幂等和 `DisableParallelTools` 全部串行。单个无效 sibling 生成 `tool_invalid_arguments` 结果，不取消已通过的独立 sibling。

- [ ] **Step 3：实现可恢复执行状态**

外部调用前先将 Tool Item CAS 为 `running`；结果提交前再次通过 CommitGate 校验 lease。只有冻结 policy 允许、错误码命中且尚未达到 MaxAttempts 的只读/幂等项可自动重试；每次真实外调都创建同 call_id 的 next-attempt tool_call/tool_result Item，并计入 MaxToolCalls，绝不在一个 Item 内隐式循环。可能已成功但结果未提交的副作用项转 `uncertain`，并幂等创建 `side_effect_resolution` approval。

所有 Tool Resume 先在同一个 CommitGate + 数据库事务中校验 Core `ResumeReceipt`：相同 key/hash 返回当前同一 Run Handle 且不重复 Item/外部调用，相同 key/不同 hash 返回 `resume_conflict`。Resume HTTP 路径只提交 resolution、checkpoint、receipt 和 `resting -> queued` CAS，再交给 Coordinator；绝不在请求 Context 中执行已批准或重试的外部 Tool。Worker claim 后从 pending call/policy snapshot 恢复执行。`Resume(action=approve|deny)` 必须引用 approval `batch_id`；`Answer.decisions` 为空时把 action 应用于整批全部未决 call，非空时只合并其中合法的 `approve|deny`。同一 call 的冲突决定返回 `resume_conflict`；存在未决定项时仍保持 `waiting_approval`，任何副作用均不执行。全部决定后，deny 项生成配对的 error Tool Result，approve 项保留为 pending，再将同一 Run CAS 回 `queued`。

`side_effect_resolution` 只接受 `confirm_completed`、`retry` 或 `cancel`：confirm_completed 生成注明用户确认的原 call_id Tool Result；retry 必须同时满足冻结 policy 的 `SupportsExternalIdempotency=true` 并携带已验证的 ExternalIdempotencyKey，保留旧 uncertain Item、创建下一 pending attempt，并把 key 暂存到上述私有 checkpoint map，随后由 Worker 执行；否则拒绝 retry。

本阶段扩展根 Service.Cancel：Coordinator.SignalCancel 让执行让出 gate 后调用 `ToolEngine.QuiesceRun`。没有 in-flight side effect 才提交 Run canceled；可能已执行但无结果的 side effect 必须把 Tool Item 置 uncertain、幂等创建 `side_effect_resolution` approval 并把 Run 置 waiting_approval，发送 waiting/approval 事件并走 OnResting。Cancel HTTP 随后 snapshot 可看到该状态；不得把不确定副作用伪装成已取消终态。

`store.Repository` 增加按 expires_at 分页读取当前 waiting interaction/approval 的方法。`engine` 增加小型 `LeaderMaintenance` 端口，由 Coordinator 仅在持有 leader lease 时周期调用；根包 `blocking_expiry.go` 在 CommitGate 中把过期 Item 置 failed、Run 置 failed，写 `interaction_expired/approval_expired` Error Item 和终态事件，再走同一 OnTerminal 投影。它也接管 restart audit 发现的未决副作用：按已冻结 policy 把 running Tool Item 置 uncertain，幂等创建 `side_effect_resolution` Approval，发送 approval.required，并走 OnResting。waiting Run 不持有 worker lease，禁止靠用户下一次 Resume 才清理过期或 uncertain 状态。

- [ ] **Step 4：实现 Outcome 归一化**

执行 batch 前按 checkpoint + 当前 batch 检查有效 MaxToolCalls；连续 Tool Error 达 MaxConsecutiveToolErrors 后不再调用模型，写 Error Item 并以 `tool_failed` 终止。Handler 的 raw Outcome 先经过统一 secret redactor、URL/字段 allowlist 和大小预算，raw 值永不写 Run/Item/Event/日志；清理后的 Structured/Presentation 归一化为 JSON object 后留在 Item（标量/数组统一包为 `{value:...}`）。给模型的 `ModelContent` 使用独立更小预算并保留 artifact/read reference，前端只得到 presentation allowlist。Denied、timeout、schema error 都生成配对的 `tool_result` 且 `is_error=true`。完整 batch 按原 call 顺序追加 `Message{Role:"tool"}` 的 tool_result blocks 并保存 checkpoint，下一 Model turn 只从该权威 Messages 恢复。Scheduler 从 blocking boundary 到 batch 可继续的 wall time 累加到 Usage.ToolWaitMS，每个 Tool 自身 wall time 仍由 Item 时间字段表达。

- [ ] **Step 5：提交工具执行内核**

```bash
git add service/agent/runtime/tool/engine.go service/agent/runtime/tool/scheduler.go service/agent/runtime/tool/executor.go service/agent/runtime/tool/outcome.go service/agent/runtime/tool/types.go service/agent/runtime/core/run.go service/agent/runtime/store/repository.go service/agent/runtime/store/item.go service/agent/runtime/engine/ports.go service/agent/runtime/engine/coordinator.go service/agent/runtime/engine/turn.go service/agent/runtime/engine/loop.go service/agent/runtime/engine/resume.go service/agent/runtime/blocking_expiry.go service/agent/runtime/deps.go
git commit -m "feat: schedule and execute mounted tools"
```

### Task 5：实现 ask_user、suggestion、front action 与安装计划工具

**Files:**

- Create: `service/agent/runtime/tool/builtin/interaction.go`
- Create: `service/agent/runtime/tool/builtin/suggestion.go`
- Create: `service/agent/runtime/tool/builtin/front.go`
- Create: `service/agent/runtime/tool/builtin/install_plan.go`
- Create: `service/agent/runtime/tool/builtin/register.go`

- [ ] **Step 1：实现真正暂停的 `ask_user`**

Schema 固定 `{title,description?,fields[]}`；field type 只允许 `text/textarea/select/option/multi_option`，option 固定 `{id,label,value}`。Handler 返回 `ResultMode=interaction` 和 `Control=suspend`。

Scheduler 创建 `interaction` Item、保存 schema/call_id/expires_at/checkpoint，将 Run 转 `waiting_input`。同一响应只接受第一个 `ask_user`，其余生成 `tool_invalid_arguments`。`Resume(action=submit)` 校验 Item、call_id、过期时间和 answer schema，生成原 call_id 配对结果并把同一 Run CAS 回 `queued`。

- [ ] **Step 2：实现 suggestion presentation**

`suggest_actions` 只接受 `{items:[{id?,label,value}]}`，归一化为 `core.Suggestion`，写 `suggestion` Item 和 `OutputEnvelope.Suggestions`。已有可交付正文且无 observation tool 时允许 `Control=finish`。

- [ ] **Step 3：实现受控前端动作**

`fill_form/patch_form/open_page/open_form` 的动作名必须命中 Invocation 的 `FrontActions`；fill/patch 的每个字段必须命中 `FieldPaths`，open 的站内 target 必须命中服务端从当前 `Page + ResourceScopes` 派生的页面白名单。只写 `front_action` Item，不直接修改数据库。target、values、reason 先过字段 allowlist、大小限制和统一 secret redactor，再写审计 Item；输出不包含权限快照或被拒绝的原值。

- [ ] **Step 4：实现安装规划输出工具**

`create_skill_install_plan` 只返回已验证的 `skill_install_plan` 结构，不下载、不执行命令、不写文件；限定最多 8 个 `download/command` 步骤及固定 collect schema。

- [ ] **Step 5：显式汇总内置注册项并提交**

`builtin.Entries(deps)` 返回 `[]tool.Registered`，不调用 `init()`。

```bash
git add service/agent/runtime/tool/builtin/interaction.go service/agent/runtime/tool/builtin/suggestion.go service/agent/runtime/tool/builtin/front.go service/agent/runtime/tool/builtin/install_plan.go service/agent/runtime/tool/builtin/register.go
git commit -m "feat: add runtime interaction and front tools"
```

### Task 6：实现四个知识库文件工具

**Files:**

- Create: `service/agent/runtime/tool/builtin/knowledge.go`
- Modify: `service/agent/runtime/tool/builtin/register.go`

- [ ] **Step 1：定义唯一知识库工具面**

只注册：

```text
open_knowledge_init
list_knowledge_files
search_knowledge_files
read_knowledge_file
```

不注册旧的 node search/open/read 分支。四个 Definition 均为只读、幂等、可并行、无需审批，分别设置小型 InputSchema 和 ResultBudget。

- [ ] **Step 2：复用现有 Knowledge Service**

Adapter 只能调用：

```go
OpenKnowledgeInitFile(ctx, baseID, maxChars)
ListKnowledgeRuntimeFiles(ctx, baseID, limit)
SearchKnowledgeRuntimeFiles(ctx, baseID, query, limit)
ReadKnowledgeRuntimeFile(ctx, baseID, fileIDOrPath, maxChars)
```

base_id 必须属于 Catalog 快照中的 Knowledge mount，并再次命中 Invocation resource scope；不接受任意知识库 ID。Search 只返回候选和 preview，事实引用必须通过 read 回读原文。

- [ ] **Step 3：归一化知识引用并提交**

Structured 保留 `base_id/path/hash/score/truncated`；Presentation 写规范 Citation `{title,url?,source_id}`，`source_id` 使用稳定 `knowledge:<base_id>:<file_id-or-path>`。ModelContent 只保留标题、路径、必要正文和可再次读取的 ID。

```bash
git add service/agent/runtime/tool/builtin/knowledge.go service/agent/runtime/tool/builtin/register.go
git commit -m "feat: add mounted knowledge file tools"
```

### Task 7：实现 Skill、Sandbox 与受控 HTTP/Script 工具

**Files:**

- Create: `service/agent/skill/repository.go`
- Create: `service/agent/runtime/tool/sandbox.go`
- Create: `service/agent/runtime/tool/builtin/skill.go`
- Create: `service/agent/runtime/tool/builtin/platform.go`
- Modify: `service/agent/runtime/tool/builtin/register.go`

- [ ] **Step 1：复用 Core 已抽离的 Sandbox 配置边界**

不得再次定义 RuntimeConfig 默认值或 Sandbox driver/network normalizer。`service/agent/runtime/tool/sandbox.go` 只声明工具执行所需的小端口，并由组合根使用现有 `service/agent/sandbox` 适配：

```go
type SandboxRunner interface {
    Run(context.Context, agentsandbox.Config, agentsandbox.Request) (agentsandbox.Result, error)
}
```

配置一律经 Core Task 1 的 `agentmodel.NormalizeRuntimeConfig` 和 `agentsandbox.ConfigFromRuntimeConfig`；Setting Hook 与 Skill Draft 不在本任务重复修改。

- [ ] **Step 2：集中 Skill Pack 读取**

`agentskill.ListPackEntries(ctx, packID)` 复用现有 SkillPackItem/Skill 查询，并稳定按 pack item sort/id 返回 `Entry`。Context 与 Tool 共用该函数，避免各自复制 ORM 查询。

- [ ] **Step 3：用 `read_skill` 渐进加载正文，用一个 `run_skill` 合并 method 与 script**

`read_skill` 是只读、幂等 observation Tool，输入 `{skill}`，只能从 frozen Skill resource snapshot 调用现有 `agentskill.ReadContent`，并复核 content_hash；不一致返回 `tool_snapshot_unavailable`。按 Tool/Context token budget 返回 SKILL.md 正文和 hash；模型先看到紧凑 metadata，需要时再读，不把所有技能正文常驻 Prompt。纯 SKILL.md/on-demand 技能因此仍可使用。

`run_skill` 输入固定 `{skill,operation,target,arguments}`，其中 operation 为 `method/script`。Builtin method 通过 `ResolveLoadedBuiltinMethod` 和受控 Dever Service 调用；script 只能来自该 Entry 的 `ManifestScripts`，通过 `sandbox.Run` 执行，并使用 `LoadConfigEnv/RedactSecrets`。

PolicyResolver 按具体 operation 解析：已登记内置 method 使用固定 policy；script 和未知 method 均为副作用、非幂等、串行、一次审批。

- [ ] **Step 4：保留两个受信任内部工具**

`platform_request` 只允许 mount config 中的 host、GET/POST、128 KiB 响应上限，并复用 `ValidateExternalURL/NewExternalHTTPClient`；`platform_script` 只允许 server-side preset 明列的 skill/script。二者不出现在普通 Agent 的可选列表。

- [ ] **Step 5：提交 Skill/Sandbox 适配**

```bash
git add service/agent/skill/repository.go service/agent/runtime/tool/sandbox.go service/agent/runtime/tool/builtin/skill.go service/agent/runtime/tool/builtin/platform.go service/agent/runtime/tool/builtin/register.go
git commit -m "feat: add sandboxed runtime skill tools"
```

### Task 8：实现 Power capability directory 与普通 Power 执行器

**Files:**

- Create: `service/agent/runtime/tool/power_policy.go`
- Create: `service/agent/runtime/tool/builtin/capability.go`
- Create: `service/agent/runtime/tool/builtin/power.go`
- Modify: `service/agent/runtime/tool/builtin/register.go`

- [ ] **Step 1：构造紧凑 capability directory**

每个受审 mount 中 `runtime_role=capability` 的启用 AgentPower 生成稳定 key `power:<power.key>`。只向模型暴露 `capability_search/describe_capability/call_capability`，不为每个 Power 展开一个 Tool Definition；显示名不参与身份。

- [ ] **Step 2：实现逐 capability policy**

```go
type PowerPolicyRegistry struct { /* key/kind dispatch */ }

func (r PowerPolicyRegistry) Resolve(PowerCapability) ResolvedCallPolicy
```

已登记 policy 按稳定 key 优先、kind 次之；未知能力保守为副作用、非幂等、串行、一次审批。非交互 Source 先移除不安全 capability；目录为空时三个 wrapper 均不进入 Catalog。

- [ ] **Step 3：实现 Power 调用**

`call_capability` 只能选择 Catalog directory 中的 key；合并 AgentPower `default_arguments` 后再用现有 Power 参数配置归一化。调用现有 Gateway Request/CollectStream/CancelStream，使用 `run_id + call_id + attempt` 派生子 request ID，结果只通过 Outcome 返回，禁止直接写 Run output 或 Assistant Message。

- [ ] **Step 4：提交 capability 工具**

```bash
git add service/agent/runtime/tool/power_policy.go service/agent/runtime/tool/builtin/capability.go service/agent/runtime/tool/builtin/power.go service/agent/runtime/tool/builtin/register.go
git commit -m "feat: add mounted power capability tools"
```

### Task 9：建立 Artifact Item、upload-backed Store 与 Asset Version 关联

**Files:**

- Modify: `service/agent/runtime/core/output.go`
- Create: `service/agent/runtime/tool/artifact.go`
- Create: `service/agent/runtime/tool/artifact_resolver.go`
- Create: `service/asset/runtime_artifact.go`
- Modify: `model/asset/version.go`
- Modify: `service/asset/main.go`
- Create: `migrations/postgres/003_agent_runtime_v2.sql`

- [ ] **Step 1：固定 Artifact 公共形状和身份**

```go
type ArtifactRef struct {
    ID         string
    RunID      uint64
    ItemID     uint64
    Kind       string
    Status     string
    URL        string
    StorageRef string
    AssetID    uint64
    VersionID  uint64
    MimeType   string
    Title      string
    Error      *PublicError
}
```

先 Append `type=artifact,status=pending` Item，再以 `art_ + base36(item.ID)` 生成 ID。两层状态不得混写：Artifact Item 只允许 `pending → running → completed/failed`，其 payload `ArtifactRef.Status` 才允许 `pending → running → ready/failed`；ready 必须与 Item completed 在同一 CommitGate 提交。一次 retry 新建 Item，不复用失败 ID。

- [ ] **Step 2：定义 Runtime 只依赖的 ArtifactStore**

```go
type ArtifactStore interface {
    Persist(context.Context, PersistArtifactRequest) (PersistedArtifact, error)
    Resolve(context.Context, string) (PersistedArtifact, error)
    GetOrCreateAssetVersion(context.Context, PersistAssetVersionRequest) (PersistedAssetVersion, error)
}

type PersistArtifactRequest struct {
    RunID, ItemID                 uint64
    Kind, Title, MimeType         string
    RemoteURL                     string
    Content                       []byte
    ProjectID, BodyID             uint64
    TeamID, FlowID, AssetCateID   uint64
    RequireAsset                  bool
    Source                        map[string]any
}
```

Runtime 不 import asset/front 包；`service/asset/runtime_artifact.go` 实现该接口。

`ProjectID/BodyID/TeamID/FlowID/AssetCateID/RequireAsset` 只能从 Run 创建时 server-owned、已授权并冻结的 `Invocation.ArtifactScope` 映射，Handler/模型 arguments 不能覆盖。

- [ ] **Step 3：使用现有 upload 持久化并回读**

远程 URL 先通过现有 `ValidateExternalURL/NewExternalHTTPClient` 的内网/重定向/大小限制，再使用 `frontupload.ImportURLResource`；二进制使用 `frontupload.ImportFile` 并检查 MaxOutputBytes。`storage_ref` 固定为 `upload:<file_id>`。Persist 以 `run_id+item_id+content_digest` 分阶段 CAS：已有同 digest 的 upload/storage_ref/AssetVersion 直接回读，不重复导入；同 identity 不同 digest 返回 `internal_error`。ready 前必须通过 `uploadrepo.FindUploadFile` 回读，核对 kind/mime/hash，并从 `BuildUploadFilePayload` 取得稳定 URL。

- [ ] **Step 4：给正式 Asset Version 增加 Agent 关联**

`Version` 增加 nullable `AgentRunID/AgentItemID`，Go 字段使用 `*uint64` 明确表达 SQL NULL；`SaveVersionRequest` 同步增加两个 nullable 字段，insert 与 `VersionToMap` 同步写出。Project final-output row 可只有 AgentRunID，Tool Artifact Version 必须二者都有。SQL 增加：

```sql
CREATE UNIQUE INDEX bot_asset_version_agent_artifact_uidx
ON bot_asset_version(agent_run_id, agent_item_id)
WHERE agent_run_id IS NOT NULL AND agent_item_id IS NOT NULL;
```

现有 `run_id/node_run_id` 仍只表达 Team。纯 chat/debug 只保存 upload；有合法 ProjectID/BodyID 且 `RequireAsset=true` 才调用 `GetOrCreateAssetVersion`。该 adapter 先按 `agent_run_id+agent_item_id` 查找：同 content digest 返回既有 Version，不同 digest 返回 `internal_error`；不得依赖现有 `SaveVersion` 的版本号冲突重试来实现幂等。进程在 upload/Version 成功而 Item 尚未 completed 时重启，必须通过这些阶段记录继续回读，不能再次创建外部资源。

- [ ] **Step 5：提交 Artifact 基础**

```bash
git add service/agent/runtime/core/output.go service/agent/runtime/tool/artifact.go service/agent/runtime/tool/artifact_resolver.go service/asset/runtime_artifact.go model/asset/version.go service/asset/main.go migrations/postgres/003_agent_runtime_v2.sql
git commit -m "feat: add recoverable runtime artifacts"
```

### Task 10：实现 create_assets 与进度事件

**Files:**

- Create: `service/agent/runtime/tool/builtin/assets.go`
- Create: `service/agent/runtime/tool/builtin/asset_tasks.go`
- Modify: `service/agent/runtime/tool/builtin/register.go`
- Modify: `service/agent/runtime/event/emitter.go`

- [ ] **Step 1：定义素材任务 Schema**

`create_assets` 接受 `{tasks:[{id,title,kind,power,prompt,input,dependencies,sort}]}`；kind 只允许 `image/video/audio/file`，power enum 只包含 Catalog snapshot 中 `runtime_role=asset` 且 `asset_kinds` 匹配的 AgentPower。原生 image/video/audio 自动只有对应 kind；multi/workflow/role/text 必须有受审 mount config，禁止名称启发式。task ID 在当前 call 内唯一，dependencies 必须存在且无环。

- [ ] **Step 2：执行依赖 DAG**

同一依赖层最多并发 3 个素材任务；跨层等待前置 Artifact ready。创建前用现有 Artifact Item 数 + 本 batch 数检查有效 MaxArtifacts，超限返回 `tool_invalid_arguments`。每个任务先创建自己的 Artifact Item，再调用 Asset Power；进度限流后发送该 Tool 的 `tool.progress` 和完整 Artifact 快照的 `artifact.updated`，ArtifactRef ready + Item completed 同步后发送 `artifact.ready`，但所有状态以 Item + payload 的上述双层规则为权威。

- [ ] **Step 3：持久化每个媒体结果**

从 Power output 提取与 task kind 对应的 URL/data，逐个调用 ArtifactStore；upload 和可选 Asset Version 全部成功后把 ArtifactRef 更新为 ready、Item 更新为 completed。缺少对应媒体、mime 不匹配、持久化失败均把两层更新为 failed 并返回可见 ToolError。

- [ ] **Step 4：移除旧异步旁路语义**

新实现不得启动脱离 Run lease 的 background goroutine，不直接更新 `bot_agent_run.output`，不查询或修改 Assistant Message。Outcome 返回 ArtifactRef 和进度 presentation，由 Loop 统一 checkpoint。

- [ ] **Step 5：提交素材工具**

```bash
git add service/agent/runtime/tool/builtin/assets.go service/agent/runtime/tool/builtin/asset_tasks.go service/agent/runtime/tool/builtin/register.go service/agent/runtime/event/emitter.go
git commit -m "feat: add runtime asset generation tools"
```

### Task 11：实现 Token Budget、稳定 Context 前缀与 MemoryReader

**Files:**

- Modify: `model/agent/runtime_config.go`
- Modify: `front/page/admin/agent/runtime_config/set.json`
- Modify: `service/agent/setting/runtime.go`
- Create: `service/agent/runtime/core/memory.go`
- Create: `service/agent/runtime/context/types.go`
- Create: `service/agent/runtime/context/budget.go`
- Create: `service/agent/runtime/context/builder.go`
- Create: `service/agent/runtime/context/skill.go`
- Create: `service/agent/runtime/context/memory.go`
- Modify: `service/agent/runtime/engine/ports.go`
- Modify: `service/agent/runtime/engine/loop.go`

- [ ] **Step 1：增加可管理的预算参数**

RuntimeConfig 增加 `max_parallel_tools=4`、`context_cleanup_percent=70`、`context_compact_percent=80`、`context_hard_percent=90`、`context_output_reserve_tokens=8192`、`context_summary_tokens=2048`、`context_memory_tokens=2048`、`tool_result_inline_tokens=1200`。Setting Page 同时展示这些字段和 Core 已增加的 model/tool/error/run/token/arguments/artifact/output hard limits，不能让新增限制只能改数据库。保存 Hook 保证 `cleanup < compact < hard < 100`、输出预留为正数，且所有 hard limit 关系继续通过 Core normalizer 校验。

- [ ] **Step 2：定义 Context 端口与 TokenCounter**

```go
type ContextBuilder interface {
    Build(context.Context, contextengine.BuildRequest) (contextengine.Bundle, error)
}

type TokenCounter interface {
    Count(context.Context, runtimemodel.ResolvedCapability, []core.Message, []core.ToolDefinition) (int, error)
}

type MemoryEntry struct {
    ID         uint64
    Title      string
    Content    string
    Kind       string
    Scope      string
    Importance int
}

type MemoryQuery struct {
    AgentID, ActorID, SessionID uint64
    ActorType, SourceType       string
    ContextKey                  string
    Limit, TokenBudget          int
}

type MemoryReader interface {
    Load(context.Context, MemoryQuery) ([]MemoryEntry, error)
}
```

`MemoryEntry`、`MemoryQuery`、`MemoryReader` 放在 dependency-neutral 的 `runtime/core/memory.go`，Context Builder 和 Assistant Adapter 都只复用 `core` 中这一份端口；不得在两个包各定义一套同名接口。

Budget 使用 `runtime/model.ResolvedCapability.ContextWindowTokens`，实际输出预留取 `max(context_output_reserve_tokens, effective MaxOutputTokens)`，输入上限固定为 context window 减该预留；预留已不小于 context window 时在模型调用前返回 `context_overflow`。TokenCounter 由已验证 ModelCapability.TokenCounter 选择：已注册精确 tokenizer 使用 exact adapter；`conservative_utf8_bytes` 对 canonical messages/tools 的 UTF-8 bytes 加固定协议 overhead，作为不会低估 byte-level 模型的上界。未知 counter 或执行失败对外返回 `internal_error`，内部 cause 记录 `token_count_unavailable`；禁止临时改用 `字符数/4` 或按 Provider 名猜 tokenizer。

- [ ] **Step 3：构建稳定前缀与动态后缀**

稳定前缀依次为 Runtime 最小规则、Agent setting、按 key 排序的 mounted Skill metadata、按 key 排序的 Tool Definitions。现有 Skill Model/Manifest 没有 `load_mode`，不得臆造；正文统一通过 `read_skill` 渐进加载，其 observation 进入动态历史。动态后缀依次为 compaction、pinned memory、服务端冻结并脱敏的 PageContext、紧凑 OutputContract 指令、最近消息、活动 tool 原子组、附件/引用、当前输入。text contract 明确要求自然 Markdown、禁止 JSON 外壳；structured/rich 只注入当前受信任 schema/hash 和必要格式规则，普通用户文本不能覆盖。

所有 map 使用 canonical JSON；空字段不输出，稳定集合按 key 排序，避免破坏现有模型层 Prompt Cache。

- [ ] **Step 4：限制长期记忆作用域**

只有 `chat/debug`、Agent snapshot 的 `memory_enabled=true` 且组合根注入 MemoryReader 时加载。`team/project/skill/internal` 永不查询；Runtime 只读不写。注入 Item/hash 记录到 checkpoint，内容在 memory budget 内截断。

- [ ] **Step 5：接入 Loop 并提交**

在每次模型 Turn 前调用 ContextBuilder，模型请求只取 Bundle.Messages/Tools；Bundle.Budget 写 usage diagnostics，完整 Build wall time 累加 Usage.ContextMS。

```bash
git add model/agent/runtime_config.go front/page/admin/agent/runtime_config/set.json service/agent/setting/runtime.go service/agent/runtime/core/memory.go service/agent/runtime/context/types.go service/agent/runtime/context/budget.go service/agent/runtime/context/builder.go service/agent/runtime/context/skill.go service/agent/runtime/context/memory.go service/agent/runtime/engine/ports.go service/agent/runtime/engine/loop.go
git commit -m "feat: add token budgeted runtime context"
```

### Task 12：实现 Tool Result 清理与可审计 Compaction

**Files:**

- Create: `service/agent/runtime/context/history.go`
- Create: `service/agent/runtime/context/prune.go`
- Create: `service/agent/runtime/context/compact.go`
- Modify: `service/agent/runtime/context/builder.go`
- Modify: `service/agent/runtime/engine/checkpoint.go`
- Modify: `service/agent/runtime/engine/loop.go`

- [ ] **Step 1：建立原子历史组**

`tool_call + tool_result` 按 call_id 组成不可拆分组；当前未完成任务依赖、最新 interaction/approval、所有副作用结果和 artifact refs 固定 pinned。未知 block 不发给模型但保留在 Item。

- [ ] **Step 2：在 70% 阈值做确定性清理**

先删除重复 Presentation，再将旧大 Tool Result 替换为摘要与可回读 ID；Item 原文不变。清理结果重新计数，不足时才进入 compaction。

- [ ] **Step 3：在 80% 阈值生成结构化摘要**

```go
type CompactionSummary struct {
    Goals, Constraints, Completed, Conclusions []string
    Pending, Errors, NextSteps                  []string
    Entities, Files, Artifacts                  []Reference
    CompletedSideEffects                        []ToolReference
    Blocking                                    *BlockingReference
}
```

Compactor 使用同一 ModelClient 的 structured request，限制在 summary token budget；`summary` 以 canonical JSON object 写入 `compaction` Item `{from_seq,to_seq,summary,source_hash}` 并保存 checkpoint，原始 Item 不删除。一次 compaction 失败返回明确错误，不循环调用。

- [ ] **Step 4：在 90% 阈值停止扩张**

经过 prune/compact 仍越过 hard threshold 时，若当前输入可拆分则返回可见 `context_overflow` 建议；否则 Run failed。任何路径都保留 output reserve。

- [ ] **Step 5：提交 Context 生命周期**

```bash
git add service/agent/runtime/context/history.go service/agent/runtime/context/prune.go service/agent/runtime/context/compact.go service/agent/runtime/context/builder.go service/agent/runtime/engine/checkpoint.go service/agent/runtime/engine/loop.go
git commit -m "feat: compact agent runtime context"
```

### Task 13：实现 Markdown 与 Structured Output

**Files:**

- Modify: `service/agent/runtime/core/output.go`
- Create: `service/agent/runtime/output/engine.go`
- Create: `service/agent/runtime/output/contract.go`
- Create: `service/agent/runtime/output/markdown.go`
- Create: `service/agent/runtime/output/structured.go`
- Modify: `service/agent/runtime/engine/ports.go`
- Modify: `service/agent/runtime/engine/turn.go`
- Modify: `service/agent/runtime/engine/loop.go`
- Modify: `service/agent/runtime/deps.go`

- [ ] **Step 1：固定输出公共契约**

```go
type OutputContract struct {
    Type    string
    Schema  json.RawMessage
    Options map[string]any
}

type OutputEnvelope struct {
    Type        string
    Text        string
    Data        json.RawMessage
    RichJSON    json.RawMessage
    Artifacts   []ArtifactRef
    Citations   []Citation
    Suggestions []Suggestion
}
```

优先级固定为受信任内部调用覆盖、Agent 默认、`text`。普通用户输入不能改变 schema。

- [ ] **Step 2：实现直接 Markdown 输出**

text contract 直接使用已经流式发送的 assistant text；只做 CRLF、非法控制字符、未闭合末尾 code fence 的确定性清理。不启动第二次模型调用，不要求 JSON 包装。

- [ ] **Step 3：实现 Structured Output**

Agent 保存时编译 OutputSchema。`ResolvedCapability.NativeStructuredOutput=true` 时把 schema 交给现有 ModelRequest response format；否则要求单个 JSON value 并在 Runtime 严格解析。验证失败只允许一次 repair Turn，repair 输入仅含 schema、验证错误和原输出；第二次失败返回 `output_validation_failed`。

- [ ] **Step 4：接入最终化端口并提交**

```go
type OutputEngine interface {
    Finalize(context.Context, output.FinalizeRequest) (core.OutputEnvelope, error)
}
```

无 Tool Call 的完整 assistant message，或 Tool batch 已全部持久化且返回 `Control=finish` 时，才进入 Finalize；仍有 observation/pending/blocking call 时禁止完成。FinalizeRequest 携带本 Run 的权威 Items；OutputEngine 按 seq 聚合 ArtifactRef、Knowledge citation presentation 和 Suggestion，按稳定 ID 去重，不能从正文正则提取。canonical JSON 编码后的 Envelope 不能超过有效 MaxOutputBytes，否则返回 `output_validation_failed`。Finalize wall time 累加 Usage.OutputFinalizeMS；完成后保存 OutputEnvelope，再把 Run 转 completed。

```bash
git add service/agent/runtime/core/output.go service/agent/runtime/output/engine.go service/agent/runtime/output/contract.go service/agent/runtime/output/markdown.go service/agent/runtime/output/structured.go service/agent/runtime/engine/ports.go service/agent/runtime/engine/turn.go service/agent/runtime/engine/loop.go service/agent/runtime/deps.go
git commit -m "feat: add runtime output contracts"
```

### Task 14：实现 Rich semantic blocks 到 Tiptap rich_json

**Files:**

- Create: `service/agent/runtime/output/rich_schema.go`
- Create: `service/agent/runtime/output/rich.go`
- Create: `service/agent/runtime/output/tiptap.go`
- Modify: `service/agent/runtime/output/engine.go`

- [ ] **Step 1：固定紧凑 Rich Schema**

只接受：

```text
heading       {level:1..6,text}
paragraph     {text,marks?}
bullet_list   {items:string[]}
ordered_list  {items:string[],start?}
blockquote    {text}
code          {text,language?}
divider       {}
image         {artifact_id,caption?,alt?}
video         {artifact_id,caption?}
audio         {artifact_id,caption?}
```

marks 只允许 `bold/italic/strike/code/link`，link 必须含通过协议校验的 href；列表 item 不递归。

- [ ] **Step 2：严格解析并解析 Artifact**

Rich model output 先由共享 JSON Schema 验证；媒体块通过 ArtifactResolver 核对 `artifact_id → run_id/item_id/status=ready/kind`，模型提供的 URL 不能替代 Artifact。

`allow_partial_artifacts=false` 时任一失败媒体导致 `output_validation_failed`；显式为 true 时删除该媒体块、插入可见 paragraph warning，并在 Envelope.Artifacts 保留失败引用。

- [ ] **Step 3：确定性生成 Tiptap doc**

固定映射为 `heading`、`paragraph`、`bulletList/listItem`、`orderedList/listItem`、`blockquote`、`codeBlock`、`horizontalRule`、`editorMediaImage/editorMediaVideo/editorMediaAudio`。媒体节点 attrs 必须至少写后端已解析的 `src`，并按类型写 `alt/caption/title/mime_type/artifact_id`；绝不把模型 URL 直接写入 attrs。根结构必须是：

```json
{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"正文"}]}]}
```

转换器不解析 Markdown、不猜旧字段、不调用模型。`OutputEnvelope.Type=rich_document`，`RichJSON` 保存最终 doc，`Text` 保存可访问性摘要。

- [ ] **Step 4：提交 Rich Output**

```bash
git add service/agent/runtime/output/rich_schema.go service/agent/runtime/output/rich.go service/agent/runtime/output/tiptap.go service/agent/runtime/output/engine.go
git commit -m "feat: render rich agent output as tiptap json"
```

### Task 15：实现 Agent 挂载管理页、Provider 与 seed preset

**Files:**

- Modify: `front/page/admin/agent/agent/update.json`
- Create: `front/page/admin/agent/agent_tool/update.json`
- Create: `front/page/admin/agent/agent_power/update.json`
- Modify: `service/agent/setting/options.go`
- Modify: `service/agent/setting/agent.go`
- Create: `service/agent/setting/provisioner.go`
- Modify: `model/agent/agent_tool.go`

- [ ] **Step 1：提供可选工具与 Power Provider**

`OptionService.ProviderLoadRuntimeTools` 从 frozen Registry 返回管理员可挂载静态项，仅包含 key/name/description/mount_schema；排除派生 wrapper、internal-only 和 `platform_mcp_call`。`ProviderLoadRuntimePowers` 返回启用且非 `text/embeddings` 的 Power。

- [ ] **Step 2：增加嵌套挂载表单**

Agent 编辑页增加 memory switch、output type、structured schema editor，以及 `form.agent_tools`、`form.agent_powers`、`form.agent_knowledge_bases` 三个 form-array；Skill 继续用现有 skill_pack selector。子页分别编辑具体 key/power、config、status、sort，不提供 wildcard。

- [ ] **Step 3：验证保存输入**

AgentHook 编译 output schema；structured 必须是非空 object schema，rich_document 使用内置 schema并只允许收紧 Options。AgentTool config 使用选中 Definition MountSchema；AgentPower config 拒绝未知字段、降低审批、延长全局 timeout、LLM/embedding Power。

- [ ] **Step 4：实现事务型 AgentProvisioner**

```go
type ProvisionRequest struct {
    Agent            map[string]any
    Preset           string
    ToolMounts       []agentmodel.AgentTool
    PowerMounts      []agentmodel.AgentPower
    KnowledgeMounts  []agentmodel.AgentKnowledgeBase
}

func (p AgentProvisioner) Create(context.Context, ProvisionRequest) (*agentmodel.Agent, error)
```

普通新 Agent preset 为空时固定展开 `normal-basic`；普通管理员只能选 `normal-basic/normal-empty`。系统 seed 固定展开：

```text
normal-basic:       ask_user,suggest_actions
normal-empty:       (no direct tools)
front-assistant:    ask_user,suggest_actions,fill_form,patch_form,open_page,open_form
skill-installer:    ask_user,suggest_actions,create_skill_install_plan
skill-creator:      ask_user,suggest_actions
internal-automation:platform_request,platform_script
```

Preset 只在创建事务展开为实际关系，不写入 Agent 字段。internal-automation 只允许 server-side seed。现有 Agent 不套新建默认，由总 Roadmap 的 Mount Manifest 切换任务回填。

- [ ] **Step 5：写入固定内置 AgentTool seeds**

`agentToolSeed` 为 Agent IDs 1–4 写入上述 direct rows；不写 capability/run_skill/create_assets/knowledge 派生 rows，也不创建全局 AgentPower seed。

- [ ] **Step 6：提交管理能力**

```bash
git add front/page/admin/agent/agent/update.json front/page/admin/agent/agent_tool/update.json front/page/admin/agent/agent_power/update.json service/agent/setting/options.go service/agent/setting/agent.go service/agent/setting/provisioner.go model/agent/agent_tool.go
git commit -m "feat: manage agent runtime tool mounts"
```

## 完成边界

- Registry 中存在但未被 AgentTool/AgentPower/Knowledge/Skill 显式关系选中的能力，模型 Manifest 中不存在。
- Tool Call 参数、mount config、dynamic policy、approval、attempt、Outcome 都有可恢复 Item 记录。
- `ask_user` 与 approval 恢复同一 run_id；非交互 Source 的 Catalog 不含任何可进入 waiting 的入口。
- Knowledge、Skill、Power、Asset、front action 均通过统一 Tool Engine 回灌，不存在直接修改 Run output/Assistant Message 的旁路。
- Context 始终保留输出 token 预留，并按 70/80/90 阈值 prune、compact、停止扩张。
- text 为流式 Markdown，structured 为经 Schema 验证的数据，rich_document 为确定性 Tiptap `rich_json`。
- Artifact 可从 Item + upload repository 恢复；正式 Asset Version 可用 `agent_run_id + agent_item_id` 唯一回查。
