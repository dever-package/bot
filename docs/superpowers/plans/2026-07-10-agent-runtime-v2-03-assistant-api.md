# Agent Runtime v2 Assistant and API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 Assistant 的唯一消息写入链路和薄 API 暴露 Runtime v2，使 Chat 与调试调用共享同一 Run、Resume、Cancel 和快照语义。

**Architecture:** Assistant 持有 Session/Message/标题/长期记忆，Runtime 持有 Run/Item；二者通过注入的 `RunProjector` 与 `MemoryReader` 连接。`service/agent/app` 是唯一组合根，构造共享 Runtime/Coordinator、SourceRouter 和带 Runtime 依赖的 Assistant Service，避免 Runtime 反向 import Assistant。

**Tech Stack:** Go 1.25、Dever ORM、Dever admin API、Runtime v2 core、现有 Assistant/Memory Service

---

## 前置条件

- 已完成 `01-core` 和 `02-tools-output`。
- 当前分支尚未发布；旧前端仍未切换。
- 不运行 build/test/lint；静态检查后交给用户在 `04-frontend` 完成时一起手工验证。

### Task 1：扩展 Assistant Session 与 Message Model

**Files:**

- Modify: `model/assistant/session.go`
- Modify: `model/assistant/message.go`

- [ ] **Step 1：给 Session 增加同会话运行预留字段**

Add to `Session`:

```go
ActiveRequestID string `dorm:"type:varchar(128);not null;default:'';comment:当前运行请求"`
ActiveRequestOwner string `dorm:"type:varchar(128);not null;default:'';comment:创建预留实例"`
ActiveRequestAt *time.Time `dorm:"null;comment:创建预留时间"`
Version         uint64 `dorm:"type:bigint;not null;default:1;comment:乐观锁版本"`
```

Add index:

```go
ActiveRequest struct{} `index:"active_request_id"`
ActiveStale   struct{} `index:"active_request_id,active_request_at"`
```

`active_request_id` 只有 Terminal Projector 在 request_id 仍匹配时清空；同时清空 owner/at，waiting/interrupted 不清空。owner 由组合根 InstanceID 填入，不接受客户端值。

`ClearSession`、`ArchiveSession`、`RebindSessionContext` 在 active_request_id 非空时返回 `session_run_active`；调用方必须先显式 Cancel 并等待 Terminal Projector。Rename/Review 不改变运行关联。

- [ ] **Step 2：给 Message 增加 Runtime 投影关联**

Add to `Message`:

```go
RunID            *uint64 `dorm:"type:bigint;null;comment:智能体运行"`
RunVersion       uint64 `dorm:"type:bigint;not null;default:0;comment:运行投影版本"`
ClientMessageID  string `dorm:"type:varchar(128);not null;default:'';comment:客户端消息幂等键"`
ReplyToMessageID uint64 `dorm:"type:bigint;not null;default:0;comment:回复的用户消息"`
PostprocessStatus string `dorm:"type:varchar(32);not null;default:'none';comment:标题记忆处理状态"`
PostprocessAttempts int  `dorm:"type:int;not null;default:0;comment:标题记忆处理次数"`
PostprocessError  string `dorm:"type:text;not null;default:'';comment:标题记忆处理错误"`
```

Required indexes:

```text
unique(session_id,run_id,role) where run_id is not null
unique(session_id,client_message_id) where client_message_id <> ''
unique(session_id,request_id,role) where request_id <> ''
```

If Dever index metadata cannot express partial indexes, keep lookup indexes in Model and create the partial unique indexes in `migrations/postgres/003_agent_runtime_v2.sql`; never replace them with application-only check-then-insert.

同一迁移把 Message.Content 默认值从 `{}` 改为 `[]`，Runtime user/assistant message 只保存严格 `[]ContentBlock`；Message.Output 只保存完整 `OutputEnvelope` 或 `{}`。旧 Assistant 数据在维护窗口清空，不写 object/array 兼容解析。

- [ ] **Step 3：更新 Message 公共映射**

Modify the message-to-map helper in `service/assistant/main.go` so every history row includes:

```go
map[string]any{
    "id":                  row.ID,
    "run_id":              row.RunID,
    "run_version":         row.RunVersion,
    "client_message_id":   row.ClientMessageID,
    "reply_to_message_id": row.ReplyToMessageID,
    "request_id":          row.RequestID,
    "status":              row.Status,
}
```

- [ ] **Step 4：静态检查并提交 Model**

Run:

```bash
git diff --check -- model/assistant service/assistant/main.go
rg -n 'ActiveRequestID|ClientMessageID|ReplyToMessageID|RunID' model/assistant service/assistant/main.go
```

Expected: 字段只有一个定义，Message 映射不再丢 run_id。

Commit:

```bash
git add model/assistant/session.go model/assistant/message.go service/assistant/main.go
git commit -m "feat: link assistant messages to agent runs"
```

### Task 2：实现 Assistant Runtime Projector

**Files:**

- Create: `service/assistant/runtime_projector.go`
- Create: `service/assistant/runtime_history.go`
- Create: `service/assistant/runtime_memory.go`
- Create: `service/assistant/runtime_postprocess.go`
- Modify: `service/assistant/main.go`

- [ ] **Step 1：定义 Projector 的持久依赖**

Create:

```go
type RuntimeProjector struct {
    messages *orm.Model[assistantmodel.Message]
    sessions *orm.Model[assistantmodel.Session]
    postprocess RuntimePostprocessQueue
}

func NewRuntimeProjector(queue RuntimePostprocessQueue) RuntimeProjector
```

The implementation must satisfy:

```go
var _ runtimecore.RunProjector = RuntimeProjector{}
```

- [ ] **Step 2：实现 `OnCreated`**

```go
func (p RuntimeProjector) OnCreated(ctx context.Context, run runtimecore.Run) error {
    // Use run.Source.ID + server-owned metadata.user_message_id; return the run_id row or insert one placeholder.
}
```

The placeholder stores `request_id/run_id/run_version/reply_to_message_id/status=running` and empty ContentBlock array. `reply_to_message_id` 必须等于 Run 创建时冻结的 metadata.user_message_id，禁止用“当前最后一条 user message”猜测。It never writes a user message. Existing rows with a newer or equal run_version are returned unchanged.

- [ ] **Step 3：实现 `OnResting`**

```go
func (p RuntimeProjector) OnResting(
    ctx context.Context,
    run runtimecore.Run,
    item *runtimecore.Item,
) error
```

For `waiting_input/waiting_approval/interrupted`, CAS-update the same assistant row only when stored run_version is older, with current status and interaction/approval reference. The callback item is the blocking Item (interrupted may be nil), not the assistant message；因此 Projector 不伪造/查询 partial content，活动正文始终由 `active_run → GetRun` snapshot 恢复。Do not clear `Session.ActiveRequestID`.

- [ ] **Step 4：实现 `OnTerminal`**

```go
func (p RuntimeProjector) OnTerminal(
    ctx context.Context,
    result runtimecore.RunResult,
) error
```

In one transaction:

1. Upsert the single assistant row by run_id and reject stale run_version overwrites.
2. Persist OutputEnvelope/Error and final status.
3. CAS-clear `active_request_id/active_request_owner/active_request_at` only when request_id equals result.RequestID.
4. Return projection errors without rolling back the completed Runtime Run.

- [ ] **Step 5：实现权威历史对齐**

`runtime_history.go` exposes:

```go
type RuntimeHistoryReader interface {
    GetRun(context.Context, runtimecore.RunRef) (runtimecore.RunView, error)
    RetryProjection(context.Context, runtimecore.RunRef) error
}

func ReconcileRuntimeHistory(
    ctx context.Context,
    reader RuntimeHistoryReader,
    session assistantmodel.Session,
    rows []assistantmodel.Message,
) ([]runtimecore.Message, error)
```

When a terminal projection is pending, construct model history from Run/Items and trigger projection retry. A read failure returns `projection_unavailable`; never continue with missing assistant content.

- [ ] **Step 6：实现 MemoryReader Adapter**

`runtime_memory.go` implements `runtimecore.MemoryReader` using existing memory scope functions. Query keys are server-owned `owner_type/owner_id + agent_key + context_key + session_id`; ignore client memory owner fields.

- [ ] **Step 7：恢复成功消息后的标题与长期记忆处理**

`OnTerminal(completed)` 在投影事务内把 assistant message 的 `postprocess_status` 置为 `pending`，但不阻塞 Run terminal。`runtime_postprocess.go` 实现一个容量固定的 worker + pending scanner，按 run_id 幂等复用现有 title/memory 提取函数；只处理 completed 且投影成功的消息，最多重试 3 次，失败保留脱敏错误供维护重放。failed/canceled 不提炼长期记忆。

```go
type RuntimePostprocessQueue interface {
    Enqueue(context.Context, uint64) error
    Start(context.Context) error
    Close(context.Context) error
}
```

组合根启动和关闭该 worker；进程崩溃后 pending scanner 继续，禁止在 `OnTerminal` 中启动无生命周期 goroutine。

- [ ] **Step 8：提交 Projector 与 Adapter**

Run:

```bash
git diff --check -- service/assistant
rg -n 'agentmodel.NewRunModel|NewStepModel' service/assistant
```

Expected: Assistant 只通过 Runtime Service/RunView 读取运行，无 Step 引用。

Commit:

```bash
git add service/assistant/runtime_projector.go service/assistant/runtime_history.go service/assistant/runtime_memory.go service/assistant/runtime_postprocess.go service/assistant/main.go
git commit -m "feat: project agent runs into assistant sessions"
```

### Task 3：实现唯一 `Assistant.SendMessage`

**Files:**

- Create: `service/assistant/send.go`
- Create: `service/assistant/runtime_output.go`
- Modify: `service/assistant/main.go`

- [ ] **Step 1：定义发送契约**

```go
type SendMessageRequest struct {
    ClientMessageID string
    SessionID       uint64
    AgentKey        string
    Input           []runtimecore.ContentBlock
    ContextKey      string
    SourceType      string
    OutputKey       string
    Invocation      runtimecore.InvocationContext
}

type SendMessageResult struct {
    UpsertMessages []assistantmodel.Message
    Run            *runtimecore.RunHandle
}
```

`ClientMessageID`、SessionID、AgentKey、Input 必填；`SourceType` 只允许 `chat/debug`。`OutputKey` 为空表示 Agent 默认，只能选择服务器注册的固定 key，不能携带 raw schema。前端不能传完整 history、memory owner、tool keys 或 assistant final message。

- [ ] **Step 2：注入 Runtime，不 import 组合根**

Extend Assistant Service:

```go
type RuntimeService interface {
    Start(context.Context, runtimecore.ExecuteRequest) (runtimecore.RunHandle, error)
    GetRun(context.Context, runtimecore.RunRef) (runtimecore.RunView, error)
    RetryProjection(context.Context, runtimecore.RunRef) error
}

type Dependencies struct {
    Runtime          RuntimeService
    ReservationOwner string
    ActiveSends      *ActiveSendRegistry
}

func NewService(options ...Option) Service
func WithRuntime(service RuntimeService) Option
```

Existing Session/Memory callers may use `NewService()`; only SendMessage requires injected Runtime.

`Dependencies` 另接收 server-owned `ReservationOwner` 和进程内 `ActiveSendRegistry`；后者只标记当前 Start 临界区，不存业务数据。`ResolveSession` 在 `active_request_id` 非空时必须通过注入 Runtime 的 `GetRun` 返回 `active_run:{protocol_version,run_id,request_id,status,stream_cursor}`；cursor 使用 RunView.resume_cursor。找不到权威 Run 返回 `projection_unavailable`，不能把 running 消息当普通历史静默丢掉。未注入 Runtime 的内部 Service 仍可做 Rebind/Memory 操作，但不得调用 SendMessage 或解析 active Run。

- [ ] **Step 3：实现 Session CAS 与 user message 幂等写入**

In a DB transaction:

1. Verify Session owner/context/agent.
2. Derive `request_id = sourceType + ":" + sessionID + ":" + clientMessageID`.
3. If the client_message_id exists, return its existing chat_error or RunHandle.
4. CAS active_request_id from empty to request_id，同时写 ReservationOwner/now；another value returns `session_run_active` and current RunRef.
5. Insert the user Message once.

- [ ] **Step 4：构造稳定 ExecuteRequest**

`runtime_output.go` 实现不可变 `OutputContractResolver`：`default` 读取 Agent 默认，`quick_fill` 使用服务器内置 `{values:object,explanation?:string}` schema，`media` 使用 text + Artifact 语义；未知 key 返回 `invalid_input`。Read history only through the saved user message position, reconcile earlier terminal projections, then call:

```go
handle, err := s.runtime.Start(ctx, runtimecore.ExecuteRequest{
    RequestID: requestID,
    Agent:     runtimecore.AgentRef{Key: req.AgentKey},
    Input:     req.Input,
    Messages:  history,
    Source: runtimecore.RunSource{
        Type: req.SourceType,
        ID:   req.SessionID,
        Metadata: map[string]any{
            "session_id": req.SessionID,
            "user_message_id": userMessage.ID,
            "context_key": req.ContextKey,
        },
    },
    Invocation: req.Invocation,
    Output:     outputResolver.Resolve(req.AgentKey, req.OutputKey),
})
```

- [ ] **Step 5：处理 Start 前失败与崩溃窗口**

Send 在调用 Runtime.Start 前把 request_id 加入 ActiveSendRegistry，返回后 defer 删除。If no Run exists, insert one `chat_error` row with `run_id=nil`, request_id and reply_to_message_id, then CAS-clear the reservation and return `UpsertMessages:[user,chat_error], Run:nil` as a handled business result。Startup/next-send stale reservation scan 只处理超过固定短超时、owner 非当前活动临界区的记录；在 Session 行锁事务内再次确认 request_id/owner/at 未变、ActiveSendRegistry 无该 key 且 Runtime 仍无 Run，才幂等创建同一 error 并清空预留，never silently execute the old message。If a Run exists, return exactly the persisted user/assistant rows as UpsertMessages and a pointer to the same RunHandle；retry with the same client_message_id returns the same IDs and optional Run shape.不得用 uint64 的 0 猜 SQL NULL，否则 partial unique 与多条 chat_error 无法可靠实现。

- [ ] **Step 6：提交 SendMessage**

Run:

```bash
git diff --check -- service/assistant
rg -n 'RecordMessage' service/assistant/send.go
```

Expected: SendMessage never calls old RecordMessage to produce Runtime messages.

Commit:

```bash
git add service/assistant/send.go service/assistant/runtime_output.go service/assistant/main.go
git commit -m "feat: add idempotent assistant send message"
```

### Task 4：建立唯一应用组合根

**Files:**

- Create: `service/agent/app/runtime.go`
- Create: `service/agent/app/source_router.go`
- Create: `service/maintenance/agent_runtime.go`

- [ ] **Step 1：复用 Core 的不可变 StaticSourceRouter**

```go
func newSourceRouter(input map[string]runtimecore.SourceAdapter) (runtimecore.SourceRouter, error)
```

输入在构造时一次性提供 `chat/debug/team/project/skill/internal`；函数调用 Core 的 `NewStaticSourceRouter` 后立即冻结，不再实现第二套可变 registry。`chat` 使用 Assistant Projector；`debug` 使用 server-owned conditional adapter：只有 Source metadata 同时含 Assistant SendMessage 冻结的 `session_id/user_message_id` 才投影 Assistant，直接 `/agent/run` 的 debug 使用 Noop。这个判别不能由客户端自由 metadata 控制。已知但尚无业务投影的 source 显式使用 Noop。Unknown source returns `invalid_input`。

- [ ] **Step 2：构造单例应用服务**

```go
type Services struct {
    Runtime   *runtime.Service
    Assistant assistant.Service
    Sources   runtimecore.SourceRouter
    StartError error
}

func Default() *Services
func Shutdown(context.Context) error
```

Use `sync.Once`，按固定顺序组装，避免 Runtime/Assistant 对象依赖环：

```text
Assistant PostprocessQueue + standalone Projector + standalone MemoryReader
→ frozen SourceRouter
→ Gateway/ModelClient + Store/Event + Tool Registry/Mount Resolver
→ Knowledge/Skill/Sandbox/Power/Artifact adapters
→ ContextBuilder + OutputEngine
→ Runtime Service
→ Assistant Service(WithRuntime + same InstanceID reservation owner + ActiveSendRegistry) + OutputContractResolver
```

所有 Tool Registry entry 只在这里显式汇总；ArtifactStore 使用 `service/asset` adapter，MemoryReader 使用前一步 standalone Assistant adapter。`Default` 在实例发布前只调用一次 `Runtime.StartBackground(context.Background())`、Assistant stale-reservation audit 和 postprocess worker，把失败保存在 `StartError`；所有 Run API 在 StartError 非空或 Health 不健康时返回明确 `internal_error`，不得接受一个永远无人消费的 queued Run。`Shutdown` 按 Assistant worker → Runtime 的顺序各关闭一次，供宿主生命周期接入；进程退出仍由宿主负责。Register Assistant Projector/MemoryReader for `chat/debug`. Runtime package itself never imports `service/assistant`.

- [ ] **Step 3：限制 Runtime 构造位置**

After all plans, allowed construction paths are exactly:

```text
service/agent/app.Default()
runtime.NewService(...) inside service/agent/app/runtime.go
```

Team、Project、Skill 和 Cancel 调用方只能接收或获取共享 Service，不能临时创建 Gateway/Runtime。

- [ ] **Step 4：接入现有 backend bootstrap**

`service/maintenance/agent_runtime.go` 通过现有 `frontcron.RegisterBootstrap` 注册 `EnsureAgentRuntimeStarted(ctx)`；它只调用 `app.Default()` 并检查 `StartError/Health`，不再创建实例。这样 Coordinator 在服务启动时恢复 queued/expired Run，而不是等首个用户请求。不得用无界 goroutine 或第二个 scheduler。

- [ ] **Step 5：提交组合根**

```bash
git add service/agent/app service/maintenance/agent_runtime.go
git commit -m "feat: compose a shared agent runtime"
```

### Task 5：切换薄 Agent API

**Files:**

- Rewrite: `api/admin/agent.go`
- Create: `api/admin/agent_runtime_context.go`
- Create: `api/admin/agent_runtime_response.go`
- Modify: `api/stream.go`

- [ ] **Step 1：定义 Runtime 专用响应映射**

`writeRuntimeJSON` 保持 Dever `{status,data,msg}` 外壳，但错误时把脱敏后的 `core.PublicError` 固定放到 `data.error`，完整保留 `code/message/retryable/run_id/item_id/call_id`；若错误同时关联一个已存在 Run（例如 `session_run_active` 或 Start 的 `projection_unavailable`），还必须在同一 `data.run` 放严格 `RunHandle`。Assistant 的 active-run error 和 Runtime 的 handle+error 通过一个只读 `RuntimeRunHandle() *RunHandle` 错误附件接口交给 writer，不能把 cursor 塞进 PublicError。未知 error 统一转 `internal_error`，原 cause 只记服务端日志。不得修改通用 `botapi.WriteJSON` 的行为，避免影响非 Runtime API。

Stream transport 另定义 API-only `RuntimeTransportError`，形状同 `{code,message,retryable}`，code 只允许 `stream_expired/stream_cursor_conflict/stream_read_failed`；它只出现在 HTTP/SSE envelope，绝不持久化到 Run/Item 或冒充 core.PublicError。Stream 建连前的 cursor/reader transport failure 使用它，但 RunRef、Actor、权限和输入校验失败仍返回 `core.PublicError`；前端按 code 严格分支。

在 `api/stream.go` 新增而非替换 `HandleRuntimeStreamRead`：成功帧仍为现有 `{status,type,request_id,output,stream_id}`，其中 output 是严格 RuntimeEvent；读取错误帧固定为 `status=2/type=result/output.error=RuntimeTransportError`。Run 自身失败仍通过成功 transport 帧里的 `run.failed` Event 携带 `core.PublicError`，两类错误不得互换。普通 `HandleStreamRead` 和 Energon/Team/Upload consumers 不变。

- [ ] **Step 2：集中构造 InvocationContext**

`agent_runtime_context.go` extracts authenticated Actor, locale/timezone, site, allowed resource IDs, page actions and selected source target. It never copies Cookie、Authorization or API keys into Runtime types.

- [ ] **Step 3：实现 Start API**

Keep `POST /bot/admin/agent/run`, bind:

```go
type agentRunBody struct {
    RequestID string                     `json:"request_id"`
    Agent     runtimecore.AgentRef       `json:"agent"`
    Input     []runtimecore.ContentBlock `json:"input"`
    Source    runtimecore.RunSource      `json:"source"`
    Trace     bool                       `json:"trace"`
}
```

该 HTTP 入口只接受 `source.type=debug`；只保留 server allowlist 中的 source metadata，并强制删除 `session_id/user_message_id/projection_mode`，禁止客户端伪装 Assistant 投影或 `team/project/skill/internal`。Input 只接受 text 和经 upload repository 回查授权的 image/file，拒绝客户端提交 tool_call/tool_result/interaction 或任意远程 URL。OutputContract、模型上限和 Tool 范围均从 Agent/Runtime 配置解析，HTTP body 不能覆盖；`trace` 也必须受管理员权限控制。Validate, call `app.Default().Runtime.Start`, return RunHandle with `protocol_version=agent-runtime/v2`。内部 Team/Project/Skill 直接调用 Service，可使用受信任的完整 ExecuteRequest。

- [ ] **Step 4：实现 Stream 与 Snapshot API**

```text
GET /bot/admin/agent/stream
GET /bot/admin/agent/run_status
```

`GetStream` 要求 `run_id + request_id + last_id`，先调用 Runtime.AuthorizeRun 校验二者属于当前 Actor 可访问的同一 Run，再把已核对 request_id/last_id 交给 `botapi.HandleRuntimeStreamRead` 与 Runtime Event Adapter。建连前 RunRef/Actor/权限失败返回 PublicError，cursor 过期返回 API-only `stream_expired` transport error；SSE 建立后的 reader error 使用上述严格 transport error frame。`GetRunStatus` 同样先 AuthorizeRun，requires run_id/request_id and returns the barrier-backed RunView; it never appends old raw stream frames.

- [ ] **Step 5：实现 Cancel 与 Resume API**

```text
POST /bot/admin/agent/cancel
POST /bot/admin/agent/resume
```

Cancel binds run_id/request_id and first calls AuthorizeRun；Resume 也先授权同一 Run，再 bind exact ResumeRequest、server-side reconstruct Invocation and reject client Actor/resource scope. Delete PostStop and Agent `/stop` behavior.

- [ ] **Step 6：提交 Agent API**

Run:

```bash
git diff --check -- api/admin/agent.go api/admin/agent_runtime_context.go api/admin/agent_runtime_response.go api/stream.go
rg -n 'PostStop|RunInternal|RunStatus' api/admin/agent.go
```

Expected: no old symbols or free-form history body.

Commit:

```bash
git add api/admin/agent.go api/admin/agent_runtime_context.go api/admin/agent_runtime_response.go api/stream.go
git commit -m "feat: expose agent runtime v2 api"
```

### Task 6：增加 Assistant Send API

**Files:**

- Modify: `api/admin/assistant.go`

- [ ] **Step 1：所有 Assistant HTTP 入口使用组合根实例**

删除 `var assistantRunner = assistantservice.NewService()`。Session/Message/Memory API 统一取得 `app.Default().Assistant`，这样 Session load 才能返回 active_run，且全进程只有一份 Runtime/Postprocess 依赖；非 Runtime 的受控 Message/Memory 方法仍由同一 Service 提供。

- [ ] **Step 2：新增 `PostSendMessage`**

Route: `POST /bot/admin/assistant/send_message`，与前端共享 `AssistantSurfaceAdapter` 使用同一条固定入口。

Bind only:

```text
client_message_id
session_id
agent_key
context_key
source_type
output_key
text/attachments
page_context/permission_context/reference IDs
```

API 把 text/attachments 确定性转换为 `[]ContentBlock`；attachment 必须用 id/storage reference 回查现有 upload 并验证 Actor/Session 可访问性，URL、mime、name 使用服务端记录，拒绝客户端任意远程 URL。`permission_context` 只作为服务器解析权限范围的候选值，必须与当前登录 Actor、页面和资源重新求交集后构造 Invocation，不能原样信任；page_context 同样执行字段 allowlist、大小预算和 secret redaction，canonical 后写入唯一 `Invocation.PageContext`，不再保留第二份 SendMessage 字段。Call `app.Default().Assistant.SendMessage`; return `{upsert_messages,run?}`。该方法使用 `writeRuntimeJSON`，确保 session_run_active/projection_unavailable 等错误结构不丢失。

- [ ] **Step 3：收窄旧 `PostMessage`**

Keep it only for explicit non-Runtime controlled message maintenance. Reject writes containing Runtime run_id, running status, final output or assistant role with Runtime request_id.

- [ ] **Step 4：提交 Assistant API**

```bash
git add api/admin/assistant.go
git commit -m "feat: expose assistant send message api"
```

### Task 7：本阶段静态验收

**Files:** all files in this plan.

- [ ] **Step 1：检查依赖方向**

Run:

```bash
rg -n 'service/assistant|service/team|service/project' service/agent/runtime
rg -n 'service/agent/app' service/assistant
```

Expected: both commands have no matches. `service/agent/app` may import Assistant/Runtime, but neither imports app back.

- [ ] **Step 2：检查双写与旧入口**

Run:

```bash
rg -n 'syncAssistant|RecordMessage.*running|PostStop|RunInternal' \
  service/agent/runtime service/assistant api/admin/agent.go
```

Expected: no old Runtime Assistant sync, Stop or RunInternal path.

- [ ] **Step 3：交给用户手工验证 API 契约**

Manual cases:

```text
same client_message_id -> same user message and RunHandle
same request_id + different hash -> request_id_conflict
second active message in same session -> session_run_active
waiting/interrupted keeps active_request_id
terminal projection clears matching active_request_id
run_status returns protocol v2 RunView + resume_cursor
```

No build/test command is run by the agent.
