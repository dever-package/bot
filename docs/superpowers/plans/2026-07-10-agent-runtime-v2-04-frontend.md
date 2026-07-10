# Agent Runtime v2 Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在宿主 front 与 bot plugin 两个仓库中交付统一的 Agent Runtime v2 Client、状态归并和 UI，使 Chat Drawer、Agent 调试页、Skill Test、Media 与 Quick Fill 使用同一 Run/Item/Event 协议。

**Architecture:** 宿主 `/data/project/shemic/front` 是 Runtime wire types、Client、Reducer、Store、Selectors、通用 UI 和 Assistant Surface Adapter 的唯一实现；`backend/package/bot/front` 只保留调试页与技能场景的薄 Surface。Agent v2 使用独立 Client，不改造仍服务于 Energon、上传和 Team 的 generic stream；最终删除 v1 runner、v1 parts、浏览器消息双写和 final fence 解释。

**Tech Stack:** React、TypeScript、Zustand vanilla store、现有 Dever request/auth helpers、SSE、Tiptap/RichText、现有 Assistant Session/Memory/Reference 组件

---

## 执行前提与硬约束

- 权威规格：[`../specs/2026-07-10-agent-runtime-v2-design.md`](../specs/2026-07-10-agent-runtime-v2-design.md)。
- 本计划在 01 Core、02 Tools/Output、03 Assistant/API 已完成并冻结以下 v2 HTTP 契约后执行：

```text
POST /bot/admin/agent/run
GET  /bot/admin/agent/stream
GET  /bot/admin/agent/run_status
POST /bot/admin/agent/cancel
POST /bot/admin/agent/resume
POST /bot/admin/assistant/send_message
```

- 两个仓库必须从 Roadmap 中用户确认的 baseline worktree 开始，不能在当前脏工作区直接覆盖文件。
- 不新增 v1/v2 feature flag，不接受 v1 Event，不上传 Chat history，不从 Markdown fence 猜最终输出。
- 不运行或安排 build、test、lint、typecheck、Go 命令或 Dever 构建命令。实施阶段只允许 `git diff --check`、`rg`、`git status` 等静态核对；功能验收由用户手工完成。
- 不手改 `backend/package/bot/front/dist/**`、宿主编译产物或 manifest 生成物。

## 文件结构锁定

### 宿主 `/data/project/shemic/front`

Create:

```text
src/lib/agent-runtime/protocol.ts
src/lib/agent-runtime/client.ts
src/lib/agent-runtime/headless.ts
src/lib/agent-runtime/reducer.ts
src/lib/agent-runtime/store.ts
src/lib/agent-runtime/selectors.ts
src/lib/agent-runtime/effects.ts
src/components/agent-runtime/provider.tsx
src/components/agent-runtime/thread.tsx
src/components/agent-runtime/message-item.tsx
src/components/agent-runtime/content-block.tsx
src/components/agent-runtime/tool-item.tsx
src/components/agent-runtime/interaction-item.tsx
src/components/agent-runtime/artifact-item.tsx
src/components/agent-runtime/suggestion-item.tsx
src/components/agent-runtime/composer.tsx
src/components/agent-runtime/run-status.tsx
src/lib/assistant/runtime-attachments.ts
```

Modify:

```text
src/lib/plugin/sdk-compat.ts
src/lib/assistant/client.ts
src/lib/assistant/session.ts
src/lib/assistant/media.ts
src/lib/assistant/quick-fill.ts
src/components/assistant/drawer.tsx
src/components/assistant/media-generate.tsx
src/components/assistant/form-actions.tsx
```

Delete after every consumer is migrated:

```text
src/lib/agent/runner.ts
```

Keep unchanged as generic infrastructure:

```text
src/lib/runtime-stream-runner.ts
src/lib/runtime-stream-output.ts
src/lib/stream.ts
src/lib/agent-result-protocol.ts
src/components/energon/content-view.tsx
src/components/assistant/global.tsx
```

### Bot `/data/project/shemic/backend/package/bot`

Create:

```text
front/src/nodes/show/agent-surface-effects.ts
front/src/nodes/show/agent-debug-panel.tsx
front/src/nodes/show/agent-debug-session-bar.tsx
```

Replace or modify:

```text
front/src/nodes/show/agent.tsx
front/src/nodes/show/skill-test.tsx
front/src/nodes/show/skill-creator.tsx
front/page/admin/agent/agent/list.json
front/page/admin/agent/skill_draft/list.json
front/page/admin/agent/skill_pack/list.json
front/package.json
```

Delete:

```text
front/src/nodes/show/agent-parts.ts
front/src/nodes/show/agent-message-parts.tsx
front/src/nodes/show/agent-markdown-text.tsx
front/src/nodes/show/agent-result.tsx
front/src/nodes/show/agent-content-output.tsx
```

Keep unchanged:

```text
front/src/nodes/show/stream-request.tsx
front/src/plugin.ts
front/page/admin/energon/power/list.json
```

## Phase A：宿主 v2 基础设施与未启用共享 UI

### Task 1: 定义严格 wire protocol

**Repository:** `/data/project/shemic/front`

**Files:**
- Create: `src/lib/agent-runtime/protocol.ts`

- [ ] **Step 1: 定义协议版本、状态、ContentBlock 和输出类型**

在 `protocol.ts` 写入唯一版本常量，并使用 tagged union；不定义宽泛的 Runtime renderer payload。

```ts
export const AGENT_RUNTIME_PROTOCOL_VERSION = 'agent-runtime/v2' as const

export type RunStatus =
  | 'queued'
  | 'running'
  | 'waiting_input'
  | 'waiting_approval'
  | 'interrupted'
  | 'completed'
  | 'failed'
  | 'canceled'

export type InteractionOption = {
  id: string
  label: string
  value: string
}

export type InteractionField = {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'option' | 'multi_option'
  required: boolean
  options?: InteractionOption[]
}

export type ContentBlock =
  | { type: 'text'; text: string }
  | { type: 'image'; artifact_id?: string; url?: string; mime_type?: string; alt?: string }
  | { type: 'file'; artifact_id?: string; url?: string; name: string; mime_type?: string }
  | { type: 'tool_call'; id: string; name: string; arguments: Record<string, unknown> }
  | { type: 'tool_result'; tool_call_id: string; content: ContentBlock[]; structured?: Record<string, unknown>; is_error: boolean }
  | { type: 'artifact_ref'; artifact_id: string; kind: ArtifactKind; title?: string }
  | { type: 'interaction'; interaction_id: string; title: string; fields: InteractionField[]; status: string }

export type ArtifactKind = 'image' | 'video' | 'audio' | 'file'

export type ArtifactRef = {
  id: string
  run_id: number
  item_id: number
  kind: ArtifactKind
  status: 'pending' | 'running' | 'ready' | 'failed'
  url?: string
  storage_ref?: string
  asset_id?: number
  version_id?: number
  mime_type?: string
  title?: string
  error?: PublicError
}

export type OutputEnvelope = {
  type: 'text' | 'structured' | 'rich_document'
  text: string
  data?: unknown
  rich_json?: Record<string, unknown>
  artifacts: ArtifactRef[]
  citations: Array<{ title: string; url?: string; source_id?: string }>
  suggestions: Suggestion[]
}
```

- [ ] **Step 2: 定义 Run、Item 和严格 ItemPayload map**

```ts
export type PublicError = {
  code: string
  message: string
  retryable: boolean
  run_id?: number
  item_id?: number
  call_id?: string
}

export type Usage = {
  input_tokens: number
  output_tokens: number
  cached_tokens: number
  reasoning_tokens: number
  model_turns: number
  tool_calls: number
  compactions: number
  cost: number
  queue_ms: number
  context_ms: number
  model_request_ms: number
  first_model_event_ms: number
  first_visible_text_ms: number
  model_total_ms: number
  tool_wait_ms: number
  output_finalize_ms: number
  total_ms: number
}

export type RuntimeRun = {
  id: number
  agent_id: number
  request_id: string
  source_type: 'chat' | 'debug' | 'team' | 'project' | 'skill' | 'internal'
  source_id: number
  parent_source_id: number
  status: RunStatus
  phase: string
  version: number
  output?: OutputEnvelope
  usage: Usage
  error?: PublicError
  resume_required: boolean
  created_at: string
  updated_at: string
}

export type Suggestion = { id: string; label: string; value: string }

export type ResolvedCallPolicy = {
  read_only: boolean
  side_effect: boolean
  parallel_safe: boolean
  idempotent: boolean
  approval: 'none' | 'once'
  can_suspend: boolean
  supports_external_idempotency: boolean
  capability_key?: string
  policy_version: string
  timeout_ms: number
  max_attempts: number
  retry_backoff_ms: number
  retryable_codes: string[]
}

export type ItemPayloadMap = {
  user_message: { partial: boolean; content_offset: number }
  assistant_message: { partial: boolean; content_offset: number }
  tool_call: { arguments: Record<string, unknown>; arguments_digest: string; policy: ResolvedCallPolicy }
  tool_result: { structured?: Record<string, unknown>; presentation?: Record<string, unknown>; is_error: boolean; error?: PublicError }
  interaction: { interaction_id: string; title: string; fields: InteractionField[]; expires_at: string }
  approval: { kind: string; batch_id: string; call_ids: string[]; decisions: Record<string, string>; expires_at: string; tool_item_id?: number }
  artifact: ArtifactRef
  suggestion: { suggestions: Suggestion[] }
  front_action: { action: string; target: string; values: Record<string, unknown>; reason: string; status: string }
  compaction: { from_seq: number; to_seq: number; summary: Record<string, unknown>; source_hash: string }
  warning: { error: PublicError }
  error: { error: PublicError }
}

export type RuntimeItemType = keyof ItemPayloadMap

export type RuntimeItemOf<K extends RuntimeItemType> = {
  id: number
  run_id: number
  parent_item_id: number
  seq: number
  type: K
  status: string
  role: string
  call_id: string
  name: string
  attempt: number
  version: number
  content: ContentBlock[]
  payload: ItemPayloadMap[K]
  started_at?: string
  finished_at?: string
  created_at: string
}

export type RuntimeItem = {
  [K in RuntimeItemType]: RuntimeItemOf<K>
}[RuntimeItemType]
```

- [ ] **Step 3: 定义 EventData map、Snapshot 和前端 Surface 契约**

```ts
export type EventDataMap = {
  'run.started': { run: RuntimeRun }
  'run.status': { run: RuntimeRun }
  'run.waiting': { run: RuntimeRun }
  'run.interrupted': { run: RuntimeRun }
  'run.completed': { run: RuntimeRun; output: OutputEnvelope }
  'run.failed': { run: RuntimeRun; error?: PublicError }
  'run.canceled': { run: RuntimeRun; error?: PublicError }
  'item.started': { item: RuntimeItem }
  'item.updated': { item: RuntimeItem }
  'content.delta': { text: string; start_offset: number; end_offset: number }
  'tool.started': { item: RuntimeItemOf<'tool_call'> }
  'tool.progress': { call_id: string; name: string; progress: number; message?: string }
  'tool.completed': { item: RuntimeItemOf<'tool_result'> }
  'tool.failed': { item: RuntimeItemOf<'tool_result'> }
  'interaction.required': { item: RuntimeItemOf<'interaction'> }
  'interaction.resolved': { item: RuntimeItemOf<'interaction'> }
  'approval.required': { item: RuntimeItemOf<'approval'> }
  'approval.resolved': { item: RuntimeItemOf<'approval'> }
  'artifact.updated': { item: RuntimeItemOf<'artifact'>; artifact: ArtifactRef }
  'artifact.ready': { item: RuntimeItemOf<'artifact'>; artifact: ArtifactRef }
  'suggestion.ready': { item: RuntimeItemOf<'suggestion'> }
  'front_action.ready': { item: RuntimeItemOf<'front_action'> }
  'usage.updated': { usage: Usage }
  'snapshot.barrier': { run_version: number; item_versions: Record<string, number> }
}

export type RuntimeEventType = keyof EventDataMap

export type RuntimeEventOf<K extends RuntimeEventType> = {
  version: typeof AGENT_RUNTIME_PROTOCOL_VERSION
  event_id: string
  run_id: number
  request_id: string
  run_version: number
  item_id?: number
  item_version?: number
  type: K
  timestamp: string
  data: EventDataMap[K]
}

export type RuntimeEvent = {
  [K in RuntimeEventType]: RuntimeEventOf<K>
}[RuntimeEventType]

export type RunHandle = {
  protocol_version: typeof AGENT_RUNTIME_PROTOCOL_VERSION
  run_id: number
  request_id: string
  status: RunStatus
  stream_cursor: string
}

export type RunView = {
  protocol_version: typeof AGENT_RUNTIME_PROTOCOL_VERSION
  run: RuntimeRun
  items: RuntimeItem[]
  resume_cursor: string
  snapshot_at: string
}

export type SurfaceMessage = {
  id: number
  role: 'user' | 'assistant'
  text: string
  kind: string
  run_id?: number
  run_version?: number
  client_message_id?: string
  status: number
  content?: ContentBlock[]
  output?: OutputEnvelope
}

export type RuntimeComposerSubmission = {
  client_message_id: string
  text: string
  attachments: Array<{ id: string; name: string; mime_type?: string }>
  context: {
    page_context: Record<string, unknown>
    permission_context: Record<string, unknown>
  }
}

export type SurfaceSnapshot = {
  session_id: number
  messages: SurfaceMessage[]
  active_run?: RunHandle
}

export type RuntimeSurfaceAdapter = {
  load: () => Promise<SurfaceSnapshot>
  send: (submission: RuntimeComposerSubmission) => Promise<{ upsert_messages: SurfaceMessage[]; run?: RunHandle }>
  reload: () => Promise<SurfaceSnapshot>
}
```

- [ ] **Step 4: 增加运行时协议守卫**

导出 `assertAgentRuntimeVersion`、`parseRunHandle`、`parseRunView` 和 `parseRuntimeEvent`。守卫必须拒绝版本不符、未知 Event type、缺失 run/item version，以及 Event type 与 Item type 不匹配的数据。

```ts
export function assertAgentRuntimeVersion(value: unknown): asserts value is typeof AGENT_RUNTIME_PROTOCOL_VERSION {
  if (value !== AGENT_RUNTIME_PROTOCOL_VERSION) {
    throw new Error('前后端 Agent Runtime 版本不一致。')
  }
}

const runtimeEventTypes = new Set<RuntimeEventType>([
  'run.started', 'run.status', 'run.waiting', 'run.interrupted',
  'run.completed', 'run.failed', 'run.canceled',
  'item.started', 'item.updated', 'content.delta',
  'tool.started', 'tool.progress', 'tool.completed', 'tool.failed',
  'interaction.required', 'interaction.resolved',
  'approval.required', 'approval.resolved',
  'artifact.updated', 'artifact.ready', 'suggestion.ready',
  'front_action.ready', 'usage.updated', 'snapshot.barrier',
])
```

- [ ] **Step 5: 静态核对并提交**

```bash
git diff --check -- src/lib/agent-runtime/protocol.ts
rg -n 'agent-runtime/v1|\bany\b' src/lib/agent-runtime/protocol.ts
git status --short -- src/lib/agent-runtime/protocol.ts
git add src/lib/agent-runtime/protocol.ts
git commit -m "feat(front): define agent runtime v2 protocol"
```

Expected: `git diff --check` 无输出；两次 `rg` 无输出；提交只包含 `protocol.ts`。

### Task 2: 实现独立 v2 Runtime Client

**Repository:** `/data/project/shemic/front`

**Files:**
- Create: `src/lib/agent-runtime/client.ts`
- Create: `src/lib/agent-runtime/headless.ts`

- [ ] **Step 1: 定义 Client 输入、错误和固定 API**

```ts
export type StartRunInput = {
  request_id: string
  agent: { id?: number; key?: string }
  input: ContentBlock[]
  source: { type: 'debug'; id: number; parent_id: number; metadata: Record<string, unknown> }
  trace?: boolean
}

export type ResumeRunInput = {
  run_id: number
  item_id?: number
  call_id?: string
  action: 'submit' | 'approve' | 'deny' | 'confirm_completed' | 'retry' | 'continue' | 'cancel'
  answer?: Record<string, unknown>
  idempotency_key: string
  external_idempotency_key?: string
}

export type RuntimeRunRef = Pick<RunHandle, 'run_id' | 'request_id'>

export class AgentRuntimeTransportError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly retryable: boolean,
    readonly snapshotRequired = false,
    readonly run?: RunHandle
  ) {
    super(message)
  }
}

export type RuntimeTransportError = {
  code: 'stream_expired' | 'stream_cursor_conflict' | 'stream_read_failed'
  message: string
  retryable: boolean
}

const API = {
  start: '/bot/admin/agent/run',
  stream: '/bot/admin/agent/stream',
  status: '/bot/admin/agent/run_status',
  cancel: '/bot/admin/agent/cancel',
  resume: '/bot/admin/agent/resume',
} as const
```

- [ ] **Step 2: 实现 start、snapshot、cancel 和 resume**

普通 `start/status/cancel/resume` 响应先解 Dever envelope：`status=2` 时必须从 `data.error` 解析严格 `PublicError`，可选 `data.run` 必须经 `parseRunHandle`，二者共同构造 `AgentRuntimeTransportError`；不能把顶层 msg 当唯一机器错误。成功后再调用 Task 1 parser，不使用 `runRuntimeStream`。Stream 建连前的 HTTP 错误按 code 严格二选一：`stream_*` 只解析 `RuntimeTransportError`，RunRef/Actor/权限/输入错误解析 `PublicError`；SSE 建连后的 `status=2` 仍只允许 transport error。

```ts
export async function startAgentRun(input: StartRunInput): Promise<RunHandle>
export async function getAgentRunSnapshot(ref: RuntimeRunRef): Promise<RunView>
export async function cancelAgentRun(ref: RuntimeRunRef): Promise<void>
export async function resumeAgentRun(input: ResumeRunInput): Promise<RunHandle>

export async function waitAgentRun(
  handle: RunHandle,
  options?: { signal?: AbortSignal; on_event?: (event: RuntimeEvent) => void }
): Promise<RunView>

export async function resumeAndWaitAgentRun(
  input: ResumeRunInput,
  options?: { signal?: AbortSignal; on_event?: (event: RuntimeEvent) => void }
): Promise<RunView>
```

`getAgentRunSnapshot/cancelAgentRun` 始终同时发送同一 Handle/View 的 run_id 与 request_id；不得只凭数据库 ID 请求另一个 Actor 的 Run。`cancelAgentRun` 对已终态响应视为成功；其它非零错误保留后端 `code/message/retryable`。

`headless.ts` 只编排 client：捕获 Start/Resume 返回的新 RunHandle，用 run_id/request_id/stream_cursor watch；遇 cursor/offset/item-version 问题 GetRun 原子恢复并从 resume_cursor 继续，直到 resting/terminal 返回最终 RunView。Media、QuickFill 和 Skill Test 复用它，不各写一套等待循环。

- [ ] **Step 3: 实现 v2 SSE parser 与续读**

```ts
export type WatchAgentRunInput = {
  run_id: number
  request_id: string
  cursor: string
  signal?: AbortSignal
  on_event: (event: RuntimeEvent) => void
}

export type WatchAgentRunResult = {
  cursor: string
  resting: boolean
  snapshot_required: boolean
}

export async function watchAgentRun(input: WatchAgentRunInput): Promise<WatchAgentRunResult>
```

固定行为：

1. GET 参数固定为 `run_id`、`request_id`、`last_id=cursor`、`transport=sse`；run_id/request_id 必须来自同一 RunHandle/RunView。
2. 每条 SSE data 先校验现有通用 envelope `{status,type,request_id,output,stream_id}`；`status=2` 时只从 `output.error` 解析 `RuntimeTransportError`，再统一包装成 `AgentRuntimeTransportError`。成功帧只把 `output` 交给 Runtime parser；Run 业务失败表现为其中的 `run.failed` Event，其 `PublicError` 由 Runtime Event parser 处理。
3. SSE `id` 是 `event_id` 的 transport authority；output 中缺失时填入，冲突时抛 `stream_cursor_conflict`。
4. 每条事件调用 `parseRuntimeEvent` 后才交给 reducer。
5. `run.completed/run.failed/run.canceled/run.interrupted` 结束当前 watch。
6. `run.waiting` 在状态为 `waiting_input/waiting_approval` 时结束当前 watch。
7. 408/425/429/500/502/503/504 或 `stream_read_failed` 使用当前 cursor 有界重连；`stream_expired` 返回 `snapshot_required=true`。
8. Abort 只断开观看，不隐式 Cancel；取消必须显式调用 `cancelAgentRun`。

- [ ] **Step 4: 静态核对并提交**

```bash
git diff --check -- src/lib/agent-runtime/client.ts src/lib/agent-runtime/headless.ts
rg -n 'runRuntimeStream|watchRuntimeStream|agent-runtime/v1|history' src/lib/agent-runtime/client.ts
git add src/lib/agent-runtime/client.ts src/lib/agent-runtime/headless.ts
git commit -m "feat(front): add agent runtime v2 client"
```

Expected: 静态检查无错误；Client 不依赖 generic runner，也不发送 history。

### Task 3: 实现纯 Reducer 与 snapshot 替换

**Repository:** `/data/project/shemic/front`

**Files:**
- Create: `src/lib/agent-runtime/reducer.ts`

- [ ] **Step 1: 定义单一状态源**

```ts
export type RuntimeState = {
  runsByID: Record<string, RuntimeRun>
  itemsByID: Record<string, RuntimeItem>
  itemIDsByRun: Record<string, string[]>
  lastEventIDByRun: Record<string, string>
  contentOffsetByItem: Record<string, number>
  toolProgressByRunCall: Record<string, { progress: number; message: string }>
  snapshotRequiredByRun: Record<string, boolean>
}

export function createRuntimeState(): RuntimeState {
  return {
    runsByID: {},
    itemsByID: {},
    itemIDsByRun: {},
    lastEventIDByRun: {},
    contentOffsetByItem: {},
    toolProgressByRunCall: {},
    snapshotRequiredByRun: {},
  }
}
```

- [ ] **Step 2: 实现 event_id、run_version 与 item_version 幂等规则**

```ts
export function reduceRuntimeEvent(state: RuntimeState, event: RuntimeEvent): RuntimeState
```

处理顺序固定为：

1. 用只接受 Redis `milliseconds-sequence` 形状的 `compareStreamCursor` 比较 event_id；小于等于该 Run 已应用 cursor 时忽略，格式非法时标记 snapshot required。Redis ID 不连续是正常现象，不能把跨毫秒或 sequence 跳号当 gap。
2. `run_version` 小于已知 Run version 时忽略 Run 状态更新。
3. 对携带完整 Item 的事件：`item_version <= known` 忽略 snapshot；`item_version > known+1` 标记 snapshot required 且不应用该 Item。`content.delta` 是例外：item_version 等于当前完整 snapshot 时仍按 offset 应用，不能被 stale snapshot 规则吞掉。
4. 新 Item 按 `seq,id` 稳定排序写入 `itemIDsByRun`。
5. reducer 只返回新状态，不调用 API、导航、Assistant Message 保存或 page store。

- [ ] **Step 3: 实现 content.delta offset 规则**

只允许将 delta 追加到 `assistant_message` Item：

```ts
function applyContentDelta(
  state: RuntimeState,
  event: RuntimeEventOf<'content.delta'>
): RuntimeState
```

- `end_offset <= current_offset`：重复事件，忽略正文但推进 cursor。
- `start_offset === current_offset`：追加 text，并记录 `end_offset`。
- 其它 offset：不裁剪字符串，将 `snapshotRequiredByRun[runID]` 设为 true。
- 新 `item.updated` 完整 Content 覆盖增量正文，offset 取 `payload.content_offset`。

- [ ] **Step 4: 实现原子 snapshot 替换**

```ts
export function replaceRuntimeSnapshot(state: RuntimeState, view: RunView): RuntimeState
```

该函数一次替换同一 Run 的 Run、Items、offset、排序与 `resume_cursor`，清除该 Run 的 `snapshotRequiredByRun`；旧 Run 的其它 Item 不得残留。

- [ ] **Step 5: 静态核对并提交**

```bash
git diff --check -- src/lib/agent-runtime/reducer.ts
rg -n 'request\(|fetch\(|navigate|saveAssistantMessage|setValueByPath' src/lib/agent-runtime/reducer.ts
git add src/lib/agent-runtime/reducer.ts
git commit -m "feat(front): add agent runtime event reducer"
```

Expected: Reducer 无 I/O 和 Surface 副作用。

### Task 4: 实现 Store 与 Selectors

**Repository:** `/data/project/shemic/front`

**Files:**
- Create: `src/lib/agent-runtime/store.ts`
- Create: `src/lib/agent-runtime/selectors.ts`

- [ ] **Step 1: 创建 vanilla Store API**

```ts
export type AgentRuntimeStore = {
  getState: () => RuntimeState
  subscribe: (listener: () => void) => () => void
  dispatch: (event: RuntimeEvent) => void
  dispatchBatch: (events: RuntimeEvent[]) => void
  replaceSnapshot: (view: RunView) => void
  clearRun: (runID: number) => void
}

export function createAgentRuntimeStore(initial = createRuntimeState()): AgentRuntimeStore
```

`dispatchBatch` 在一次 store set 中顺序调用 reducer；`clearRun` 只清指定 Run。Store 为每个 Run 保留按 event_id 的单一有序队列：正文 delta 在 16～40ms 窗口内批量提交；任何非 `content.delta` Event 到达时，必须先同步 drain 同 Run 先前排队 delta，再 dispatch 当前事件。`replaceSnapshot/clearRun` 前取消该 Run 的 batch timer 并丢弃旧排队 delta，snapshot 后绝不再应用 barrier 之前内容。批处理只能减少 set 次数，绝不能重排事件。

- [ ] **Step 2: 定义 UI 只读 selector**

```ts
export function selectRun(state: RuntimeState, runID: number): RuntimeRun | undefined
export function selectRunItems(state: RuntimeState, runID: number): RuntimeItem[]
export function selectThreadMessages(state: RuntimeState, runID: number): RuntimeItem[]
export function selectPendingInteraction(state: RuntimeState, runID: number): RuntimeItemOf<'interaction'> | undefined
export function selectPendingApproval(state: RuntimeState, runID: number): RuntimeItemOf<'approval'> | undefined
export function selectArtifacts(state: RuntimeState, runID: number): ArtifactRef[]
export function selectSuggestions(state: RuntimeState, runID: number): Suggestion[]
export function selectRunResting(state: RuntimeState, runID: number): boolean
export function selectRunCancelable(state: RuntimeState, runID: number): boolean
```

Tool progress key 固定为 `${run_id}:${call_id}`（需要区分重试展示时再追加 attempt），禁止只用 call_id 造成并行 Run 串线。

`selectThreadMessages` 只返回 user/assistant message Item；sidecar selector 用 parent_item_id 递归向上找到最近 message（带 visited/cycle guard），因此 tool_result→tool_call→assistant 和 artifact→tool_call→assistant 都能归组。parent=0、parent 缺失或非法环的 Item 放入明确 run-level timeline/fallback 区域并显示协议错误，不能静默隐藏，也不复制进 message output。

- [ ] **Step 3: 静态核对并提交**

```bash
git diff --check -- src/lib/agent-runtime/store.ts src/lib/agent-runtime/selectors.ts
rg -n 'fetch\(|request\(|saveAssistantMessage|setValueByPath' src/lib/agent-runtime/store.ts src/lib/agent-runtime/selectors.ts
git add src/lib/agent-runtime/store.ts src/lib/agent-runtime/selectors.ts
git commit -m "feat(front): add agent runtime store and selectors"
```

### Task 5: 隔离 Surface Effects

**Repository:** `/data/project/shemic/front`

**Files:**
- Create: `src/lib/agent-runtime/effects.ts`

- [ ] **Step 1: 定义受控 Effect 接口**

```ts
export type AgentRuntimeSurfaceEffects = {
  onFrontAction?: (item: RuntimeItemOf<'front_action'>, context: RuntimeComposerSubmission['context']) => Promise<void>
  onArtifactReady?: (item: RuntimeItemOf<'artifact'>) => Promise<void>
  onRunResting?: (run: RuntimeRun) => Promise<void>
  onRunTerminal?: (run: RuntimeRun) => Promise<void>
}

export const EMPTY_AGENT_RUNTIME_EFFECTS: AgentRuntimeSurfaceEffects = Object.freeze({})

export type AppliedEffectKey = `item:${number}:${number}:${number}` | `run:${number}:${number}:${string}`

export function runtimeEffectKey(item: RuntimeItem): AppliedEffectKey {
  return `item:${item.run_id}:${item.id}:${item.version}`
}

export function runtimeRunEffectKey(event: RuntimeEvent): AppliedEffectKey {
  return `run:${event.run_id}:${event.run_version}:${event.type}`
}
```

- [ ] **Step 2: 实现 Event 到 Effect 的窄分发**

```ts
export async function applyRuntimeSurfaceEffect(
  event: RuntimeEvent,
  effects: AgentRuntimeSurfaceEffects,
  applied: Set<AppliedEffectKey>,
  resolveContext: (runID: number) => RuntimeComposerSubmission['context'] | undefined
): Promise<void>
```

只分发 `front_action.ready`、`artifact.ready`、resting 和 terminal Run Event。FrontAction 分发前必须用 resolveContext(event.run_id) 取得发送快照，缺失即拒绝；Item 事件按 `runtimeEffectKey`、Run 事件按 `runtimeRunEffectKey` 去重。失败由 Surface 展示，不回写 Reducer，也不改变 Run 终态。

- [ ] **Step 3: 静态核对并提交**

```bash
git diff --check -- src/lib/agent-runtime/effects.ts
rg -n 'navigate|setValueByPath|window\.location' src/lib/agent-runtime/effects.ts
git add src/lib/agent-runtime/effects.ts
git commit -m "feat(front): isolate agent runtime surface effects"
```

Expected: 通用 Effects 文件只定义注入和调度，不包含 bot 页面路径或字段名。

### Task 6: 实现严格 Item Renderer

**Repository:** `/data/project/shemic/front`

**Files:**
- Create: `src/components/agent-runtime/content-block.tsx`
- Create: `src/components/agent-runtime/tool-item.tsx`
- Create: `src/components/agent-runtime/interaction-item.tsx`
- Create: `src/components/agent-runtime/artifact-item.tsx`
- Create: `src/components/agent-runtime/suggestion-item.tsx`
- Create: `src/components/agent-runtime/message-item.tsx`

- [ ] **Step 1: 按 ContentBlock.type 确定性渲染正文**

```tsx
export function AgentRuntimeContentBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'text':
      return <EnergonContentView output={{ text: block.text }} emptyText="" />
    case 'image':
      return block.url ? <img src={block.url} alt={block.alt || ''} className="max-w-full rounded-lg" /> : null
    case 'file':
      return block.url ? <a href={block.url}>{block.name}</a> : <span>{block.name}</span>
    case 'artifact_ref':
      return <span>{block.title || block.artifact_id}</span>
    case 'interaction':
    case 'tool_call':
    case 'tool_result':
      return null
  }
}

export function AgentRuntimeOutput({ output }: { output: OutputEnvelope }) {
  if (output.type === 'rich_document' && output.rich_json) {
    return <RichTextView value={output.rich_json} />
  }
  if (output.type === 'structured') {
    return <EnergonContentView output={{ json: output.data }} emptyText="" />
  }
  return output.text ? <EnergonContentView output={{ text: output.text }} emptyText="" /> : null
}
```

未知 block 在 `parseRuntimeEvent` 已拒绝，Renderer 不设置 fallback 分支猜结构。

- [ ] **Step 2: 实现 Tool 与 Artifact 状态卡**

`AgentRuntimeToolItem` 只展示 `name/status/progress/presentation/error`，不展示 secret、原始模型请求或私有 reasoning。`AgentRuntimeArtifactItem` 按 `kind` 使用 `img/video/audio/a`，`pending/running/failed` 有明确状态。

```tsx
export function AgentRuntimeToolItem(props: {
  call: RuntimeItemOf<'tool_call'>
  result?: RuntimeItemOf<'tool_result'>
  progress?: { progress: number; message: string }
  debug: boolean
}): JSX.Element

export function AgentRuntimeArtifactItem(props: {
  item: RuntimeItemOf<'artifact'>
}): JSX.Element
```

- [ ] **Step 3: 实现同 Run Resume 的 Interaction**

```tsx
export type InteractionSubmit = {
  run_id: number
  item_id: number
  call_id: string
  answer: Record<string, unknown>
  idempotency_key: string
}

export function AgentRuntimeInteractionItem(props: {
  item: RuntimeItemOf<'interaction'>
  disabled: boolean
  onSubmit: (input: InteractionSubmit) => Promise<void>
}): JSX.Element

export function AgentRuntimeApprovalItem(props: {
  item: RuntimeItemOf<'approval'>
  disabled: boolean
  onDecision: (input: ResumeRunInput) => Promise<void>
}): JSX.Element
```

Interaction 提交固定调用 `resumeAgentRun({ action:'submit' })`；普通 Approval 使用 `batch_id` 作为 call_id，整批操作用 `approve/deny`，逐项决定放入 `answer.decisions`。`kind=side_effect_resolution` 时改为“确认已完成 / 使用外部幂等键重试 / 取消”三种动作，分别提交 `confirm_completed/retry/cancel`；只有关联 Tool policy 支持 external idempotency 时显示 retry 并要求 key。两者都不得构造新 user message 或启动第二个 Run。

- [ ] **Step 4: 实现 Suggestion 与 Message 聚合**

`AgentRuntimeMessageItem` 接收一个 message Item 和由 selector 提供的 children Item；正文、Tool、Artifact、Interaction、Approval 与 Suggestion 各渲染一次。若 terminal `rich_json` 已引用某 ready artifact_id，普通 Thread 不再重复显示同一 Artifact 卡片；debug panel 仍保留其 Item。未被 rich document 引用的 Artifact 正常显示。

```tsx
export function AgentRuntimeMessageItem(props: {
  message: RuntimeItemOf<'user_message'> | RuntimeItemOf<'assistant_message'>
  children: RuntimeItem[]
  debug: boolean
  onResume: (input: ResumeRunInput) => Promise<void>
  onSuggestion: (suggestion: Suggestion) => void
}): JSX.Element
```

- [ ] **Step 5: 静态核对并提交**

```bash
git diff --check -- src/components/agent-runtime
rg -n 'agent-runtime/v1|agent-result|finalOutput|resultDetail|dangerouslySetInnerHTML' src/components/agent-runtime
git add src/components/agent-runtime/content-block.tsx \
  src/components/agent-runtime/tool-item.tsx \
  src/components/agent-runtime/interaction-item.tsx \
  src/components/agent-runtime/artifact-item.tsx \
  src/components/agent-runtime/suggestion-item.tsx \
  src/components/agent-runtime/message-item.tsx
git commit -m "feat(front): add agent runtime item renderers"
```

### Task 7: 实现 Provider、Thread、Composer 与 Run Status

**Repository:** `/data/project/shemic/front`

**Files:**
- Create: `src/components/agent-runtime/provider.tsx`
- Create: `src/components/agent-runtime/thread.tsx`
- Create: `src/components/agent-runtime/composer.tsx`
- Create: `src/components/agent-runtime/run-status.tsx`

- [ ] **Step 1: 定义 Provider Context**

```tsx
export type AgentRuntimeProviderProps = {
  adapter: RuntimeSurfaceAdapter
  effects?: AgentRuntimeSurfaceEffects
  debug?: boolean
  children: ReactNode
}

export type AgentRuntimeContextValue = {
  snapshot: SurfaceSnapshot
  state: RuntimeState
  activeRunID: number
  eventTrace: RuntimeEvent[]
  loading: boolean
  sending: boolean
  error: string
  send: (submission: RuntimeComposerSubmission) => Promise<void>
  cancel: () => Promise<void>
  resume: (input: ResumeRunInput) => Promise<void>
  reload: () => Promise<void>
}

export function AgentRuntimeProvider(props: AgentRuntimeProviderProps): JSX.Element
export function useAgentRuntime(): AgentRuntimeContextValue
```

- [ ] **Step 2: 实现 Provider 生命周期**

固定顺序：

1. `adapter.load()` 获取 Assistant 投影消息和 active RunRef。
2. active Run 存在时先 `getAgentRunSnapshot()` 原子替换，再按权威 status 分支：只有 queued/running 从 resume_cursor watch；waiting/interrupted 只显示 Resume/Cancel；terminal 直接 reload Assistant 投影，绝不等待一个不会再出现的 terminal event。
3. `send()` 在点击发送时只调用一次 Composer.buildContext，冻结 submission；保持同一个 `client_message_id` 调用 `adapter.send()`，按持久 message id upsert `upsert_messages`。若 run 缺失，显示幂等 chat_error 后结束；存在 Run 时以 run_id 保存该 submission.context 供后续 Effect 使用，再 watch。网络重试复用同一 submission，既不得 append 重复消息，也不得重新读取页面上下文。
   若 Send 抛出 `session_run_active` 且 typed error 带 `run`，Provider 把它当权威 active Run 接管：先 GetRun snapshot，再按第 2 条状态分支恢复；不得丢掉 RunHandle、重复发送或只显示无操作错误。其它带 `run` 的错误（例如 direct Start 投影失败）由调用 Surface snapshot 后展示该已创建 Run 的终态/错误。
4. watch 的 `snapshot_required` 或 reducer offset gap 触发一次 `getAgentRunSnapshot()`。
5. waiting/interrupted 停止 spinner，但保留 Resume 操作；`resume()` 必须捕获新的 RunHandle 并用其 request_id/stream_cursor 重新 watch。
6. terminal 后调用 `adapter.reload()` 获取稳定 Assistant 投影；若同 run_id 的 assistant message 仍非终态，继续以 Runtime Item 显示，并在后台按 `1s/2s/5s/15s/30s` 有界 reload，直到投影终态或显示“历史同步待重试”；不得阻塞已完成内容。
7. unmount 只 Abort watch；Cancel 按钮才调用后端 Cancel。若当前 watch 已因 waiting/interrupted 关闭，Cancel 成功后主动 GetRun + reload，不依赖流里再收到 canceled。

`debug=true` 时 Provider 额外保留当前 Session 最近 200 条已验证 RuntimeEvent ring buffer，切 session/clear run 时清空；普通 Chat 不保存 trace。该 trace 只含公开脱敏 wire event。

Effect 分发按 item.run_id 取得发送时保存的 context；没有快照时拒绝执行而不是使用“当前页面”。terminal 后所有 terminal effects 处理完再清理该 run 的 context。

- [ ] **Step 3: 实现 Thread 和历史/活动 Run 合并**

```tsx
export function AgentRuntimeThread(props: {
  className?: string
  emptyText: string
}): JSX.Element
```

稳定 user/assistant 历史来自 `SurfaceSnapshot.messages`；当前 `run_id` 只用 live `assistant_message` Item 覆盖 assistant 投影，Runtime `user_message` Item 不在 Assistant Surface 再渲染，避免当前 user 消息双显。live content 不写回消息数组，相同 `run_id` 只能显示一份 assistant 内容。稳定消息带 `OutputEnvelope.rich_json` 时调用 `AgentRuntimeOutput`，不得把 Tiptap JSON 当文本展示。

- [ ] **Step 4: 实现 Composer 和状态动作**

```tsx
export function AgentRuntimeComposer(props: {
  placeholder: string
  references?: Array<{ id: string; name: string; mime_type?: string }>
  onReferencesChange?: (items: Array<{ id: string; name: string; mime_type?: string }>) => void
  buildContext: () => Record<string, unknown>
}): JSX.Element

export function AgentRuntimeRunStatus(): JSX.Element
```

Composer 发送前使用 `crypto.randomUUID()` 生成 `client_message_id`，网络重试复用原值。active/waiting/interrupted Run 存在时禁止发送第二条消息，Run Status 显示回答、审批、继续或取消入口。

- [ ] **Step 5: 静态核对并提交**

```bash
git diff --check -- src/components/agent-runtime/provider.tsx \
  src/components/agent-runtime/thread.tsx \
  src/components/agent-runtime/composer.tsx \
  src/components/agent-runtime/run-status.tsx
rg -n 'saveAssistantMessage|history:|runRuntimeStream|agent-runtime/v1' src/components/agent-runtime
git add src/components/agent-runtime/provider.tsx \
  src/components/agent-runtime/thread.tsx \
  src/components/agent-runtime/composer.tsx \
  src/components/agent-runtime/run-status.tsx
git commit -m "feat(front): add shared agent runtime provider"
```

### Task 8: 增加 Assistant Surface Adapter 并暴露 SDK

**Repository:** `/data/project/shemic/front`

**Files:**
- Modify: `src/lib/assistant/client.ts:1-145`
- Modify: `src/lib/assistant/session.ts:36-220,323-360`
- Create: `src/lib/assistant/runtime-attachments.ts`
- Modify: `src/lib/plugin/sdk-compat.ts:1-125`

- [ ] **Step 1: 扩展 Assistant Message 投影字段**

在 `session.ts` 的消息 normalize 中保留后端返回的稳定字段：

```ts
export type AssistantProjectedMessage = SurfaceMessage & {
  reply_to_message_id?: number
  request_id?: string
  run_version?: number
  client_message_id?: string
}

export type RuntimeAssistantSessionPayload = Omit<AssistantSessionPayload, 'messages'> & {
  messages: AssistantProjectedMessage[]
  active_run?: RunHandle
}
```

`normalizeMessage()` 必须读取 `id/run_id/run_version/client_message_id/status/reply_to_message_id/request_id`，并把 content 严格解析为 `ContentBlock[]`；不得用数组 index 或随机数作为持久消息身份。Session response 的 `active_run` 必须经 `parseRunHandle` 后保留，Adapter.load 映射为 `SurfaceSnapshot.active_run`，不能被旧 normalize 丢弃。

- [ ] **Step 2: 在 Assistant Client 增加统一 SendMessage**

先增加 v2 导出，旧 Drawer 所需旧导出只保留到 Task 12～14 完成，期间不形成生产制品。

```ts
export type AssistantSendMessageInput = {
  client_message_id: string
  session_id: number
  agent_key: string
  context_key: string
  output_key?: 'default' | 'quick_fill' | 'media'
  text: string
  attachments: RuntimeComposerSubmission['attachments']
  page_context: Record<string, unknown>
  permission_context: Record<string, unknown>
  source_type: 'chat' | 'debug'
}

export type AssistantSendMessageResult = {
  upsert_messages: SurfaceMessage[]
  run?: RunHandle
}

export async function sendAssistantMessage(
  input: AssistantSendMessageInput
): Promise<AssistantSendMessageResult>

export function createAssistantRuntimeSurfaceAdapter(input: {
  sessionID?: number
  agentKey: string
  contextKey: string
  sourceType: 'chat' | 'debug'
}): RuntimeSurfaceAdapter
```

`sendAssistantMessage` 复用 v2 Client 的 Dever envelope/PublicError parser，不复制第二套 status/msg 判断。

`runtime-attachments.ts` 复用现有 upload/reference pipeline，导出异步 `toRuntimeAttachmentRefs`：只返回 `{id,name,mime_type?}` server references；现有 `AssistantReferenceFile` 的 `type` 映射为 mime_type。id 缺失的 local/data_url/blob 必须先上传，上传失败则禁止 Send，绝不把客户端 URL 传给 Runtime。Chat、Media、QuickFill 共用这一 mapper。

Adapter 的 `load` 在 `sessionID` 缺失时调用现有 Session API 创建/加载会话，并把返回 ID 写入闭包中的 `activeSessionID`；`SurfaceSnapshot.session_id` 永远返回该权威 ID。Adapter 的 `send` 只使用 Composer 本次提交时已经调用一次并冻结的 `submission.context`，不得再次读取 active page/permission；只调用 `/bot/admin/assistant/send_message`，不保存 user/running/final message，不提交 history。

- [ ] **Step 3: 在 SDK compat 显式注册 v2 模块**

增加 namespace import 和以下映射：

```ts
'@/lib/agent-runtime/protocol': agentRuntimeProtocolModule,
'@/lib/agent-runtime/client': agentRuntimeClientModule,
'@/lib/agent-runtime/headless': agentRuntimeHeadlessModule,
'@/lib/agent-runtime/store': agentRuntimeStoreModule,
'@/lib/agent-runtime/selectors': agentRuntimeSelectorsModule,
'@/lib/agent-runtime/effects': agentRuntimeEffectsModule,
'@/lib/assistant/client': assistantClientModule,
'@/lib/assistant/session': assistantSessionModule,
'@/components/agent-runtime/provider': agentRuntimeProviderModule,
'@/components/agent-runtime/thread': agentRuntimeThreadModule,
'@/components/agent-runtime/composer': agentRuntimeComposerModule,
'@/components/agent-runtime/run-status': agentRuntimeRunStatusModule,
```

保留 `runtime-stream-runner`、`runtime-stream-output`、`stream` 和通用组件映射。

- [ ] **Step 4: 静态核对并提交宿主 Phase A**

```bash
git diff --check -- src/lib/assistant/client.ts src/lib/assistant/session.ts src/lib/assistant/runtime-attachments.ts src/lib/plugin/sdk-compat.ts
rg -n "agent-runtime/protocol|agent-runtime/client|agent-runtime/provider|assistant/client" src/lib/plugin/sdk-compat.ts
git add src/lib/assistant/client.ts src/lib/assistant/session.ts src/lib/assistant/runtime-attachments.ts src/lib/plugin/sdk-compat.ts
git commit -m "feat(front): expose agent runtime v2 surfaces"
```

Expected: v2 模块已可被 bot plugin 获取；Chat Drawer 尚未切换，因此该提交不得单独作为最终生产版本。

## Phase B：bot 调试与技能 Surface

### Task 9: 将 ShowAgent 重建为薄 Surface

**Repository:** `/data/project/shemic/backend/package/bot`

**Files:**
- Replace: `front/src/nodes/show/agent.tsx:1-8156`
- Create: `front/src/nodes/show/agent-surface-effects.ts`
- Create: `front/src/nodes/show/agent-debug-panel.tsx`
- Create: `front/src/nodes/show/agent-debug-session-bar.tsx`
- Modify: `front/page/admin/agent/agent/list.json:303-321`

- [ ] **Step 1: 实现 bot 专属受控 Effects**

```ts
export function createAgentSurfaceEffects(input: {
  navigate: (to: string) => void
  setValueByPath: (path: string, value: unknown) => void
  allowedPaths: string[]
  onSkillDraftArtifact?: (item: RuntimeItemOf<'artifact'>) => Promise<void>
}): AgentRuntimeSurfaceEffects
```

只接受后端已授权的 `open_page/open_form/fill_form/patch_form`，target 必须是绝对站内路径，字段必须命中 `allowedPaths`。Skill Draft 保存只消费严格 Artifact/FrontAction Item，不读取 assistant text 或 JSON fence。

- [ ] **Step 2: 实现轻量 Debug Session Bar**

`AgentDebugSessionBar` 复用宿主现有 Assistant Session API，显示当前 agent/context 的最近会话、创建新会话和切换入口；选中 session_id 传给 Surface Adapter。切换只 abort 当前 watch 并在新标签 load snapshot，不 Cancel 后端 Run，因此两个不同 Session 可并行。不得在 bot 内复制 Session CRUD client。

- [ ] **Step 3: 实现独立 Debug Panel**

```tsx
export function AgentDebugPanel(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
}): JSX.Element
```

Panel 在 Provider 内调用 `useAgentRuntime()` 取得 run/items/eventTrace。只展示 Run ID、request_id、phase、Usage、Tool call name/attempt/status/duration、已由后端脱敏的 arguments 和 Event 顺序；不展示完整 Tool result、模型私有 reasoning 或任何未经过 public wire 的值。

- [ ] **Step 4: 用共享 Provider 重写 ShowAgent**

保留公共导出名，保证 `front/src/plugin.ts` 无需变化：

```tsx
export function ShowAgent({ item, store }: NodeItemProps) {
  const navigate = useNavigate()
  const agentKey = useStore(store, () =>
    valueText(getStoreValueByPath(store, String(item.meta?.agentPath || ''))) ||
    valueText(item.meta?.agentKey)
  )
  const contextKey = valueText(item.meta?.contextKey) || `agent:${agentKey}`
  const [sessionID, setSessionID] = useState<number>()
  const [debugOpen, setDebugOpen] = useState(false)
  const adapter = useMemo(
    () => createAssistantRuntimeSurfaceAdapter({
      sessionID,
      agentKey,
      contextKey,
      sourceType: 'debug',
    }),
    [agentKey, contextKey, item, sessionID, store]
  )
  const effects = useMemo(
    () => createAgentSurfaceEffects({
      navigate: (to) => navigate({ to }),
      setValueByPath: (path, value) => store.getState().setValueByPath(path, value),
      allowedPaths: normalizeStringList(item.meta?.frontActionAllowedPaths),
    }),
    [item.meta?.frontActionAllowedPaths, navigate, store]
  )

  return (
    <>
      <AgentDebugSessionBar agentKey={agentKey} contextKey={contextKey} value={sessionID} onChange={setSessionID} />
      <AgentRuntimeProvider key={sessionID || 'current'} adapter={adapter} effects={effects} debug>
        <AgentRuntimeThread emptyText={String(item.meta?.emptyText || '')} />
        <AgentRuntimeRunStatus />
        <AgentRuntimeComposer
          placeholder={String(item.meta?.placeholder || '输入消息...')}
          buildContext={() => resolveAgentInvocationContext(item, store)}
        />
        <AgentDebugPanel open={debugOpen} onOpenChange={setDebugOpen} />
      </AgentRuntimeProvider>
    </>
  )
}

function resolveAgentInvocationContext(item: NodeItemProps['item'], store: NodeItemProps['store']) {
  const configured = isPlainRecord(item.meta?.inputContext) ? item.meta?.inputContext : {}
  const pageContext = Object.fromEntries(
    Object.entries(configured).map(([key, path]) => [
      key,
      getStoreValueByPath(store, String(path)),
    ])
  )
  return {
    page_context: pageContext,
    permission_context: {
      page: String(item.meta?.page || ''),
      front_actions: normalizeStringList(item.meta?.frontActions),
      field_paths: normalizeStringList(item.meta?.frontActionAllowedPaths),
    },
  }
}

function normalizeStringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((item) => valueText(item).trim()).filter(Boolean)
    : []
}
```

`ShowAgent` 不得再定义 Session API、Message 保存、run_status 轮询、Parts merge、Result normalization、Memory normalize 或 stream recovery。

- [ ] **Step 5: 精简 Agent page JSON**

`agent/list.json` 的 `show-agent` meta 只保留：

```json
{
  "agentPath": "data.actionTarget.runAgent.key",
  "agentNamePath": "data.actionTarget.runAgent.name",
  "openPath": "state.dialog.run",
  "sessionEnabled": true,
  "memoryEnabled": false,
  "sourceType": "debug",
  "sessionContext": {
    "agent": "data.actionTarget.runAgent.key"
  },
  "placeholder": "输入消息...",
  "emptyText": "发送消息，查看智能体如何调用已挂载的工具。"
}
```

删除 `requestApi/streamApi/stopApi/runStatusApi/blockMs/autoRecoverSavedRuns`。

- [ ] **Step 6: 静态核对并提交**

```bash
git diff --check -- front/src/nodes/show/agent.tsx \
  front/src/nodes/show/agent-surface-effects.ts \
  front/src/nodes/show/agent-debug-panel.tsx \
  front/src/nodes/show/agent-debug-session-bar.tsx \
  front/page/admin/agent/agent/list.json
rg -n 'runAgentStream|stopAgentStream|agent-runtime/v1|savePersistentMessage|runStatusApi|finalOutput|resultDetail' front/src/nodes/show/agent.tsx
git add front/src/nodes/show/agent.tsx \
  front/src/nodes/show/agent-surface-effects.ts \
  front/src/nodes/show/agent-debug-panel.tsx \
  front/src/nodes/show/agent-debug-session-bar.tsx \
  front/page/admin/agent/agent/list.json
git commit -m "feat(bot-front): rebuild agent debug surface"
```

Expected: `ShowAgent` 只组合宿主 Runtime UI 与 bot Surface 配置；旧关键词无命中。

### Task 10: 迁移 Skill Test/Creator 并删除 bot v1 UI

**Repository:** `/data/project/shemic/backend/package/bot`

**Files:**
- Modify: `front/src/nodes/show/skill-test.tsx:1-2070`
- Modify: `front/src/nodes/show/skill-creator.tsx:1-130`
- Modify: `front/page/admin/agent/skill_draft/list.json:272-345`
- Modify: `front/page/admin/agent/skill_pack/list.json:583-611`
- Modify: `front/package.json`
- Delete: `front/src/nodes/show/agent-parts.ts`
- Delete: `front/src/nodes/show/agent-message-parts.tsx`
- Delete: `front/src/nodes/show/agent-markdown-text.tsx`
- Delete: `front/src/nodes/show/agent-result.tsx`
- Delete: `front/src/nodes/show/agent-content-output.tsx`

- [ ] **Step 1: 将 Skill Test 的运行调用切到 v2 Client**

保留 `ShowSkillTest` 导出和沙箱测试/发布 UI，只替换两处 `runAgentStream` 与 `stopAgentStream`：

```ts
const handle = await startAgentRun({
  request_id: crypto.randomUUID(),
  agent: { key: agentKey },
  input: [{ type: 'text', text: prompt }],
  source: {
    type: 'debug',
    id: Number(draftID || 0),
    parent_id: 0,
    metadata: { surface: 'skill_test' },
  },
})

const runtimeStore = createAgentRuntimeStore()
const view = await waitAgentRun(handle, {
  signal: controller.signal,
  on_event: runtimeStore.dispatch,
})
```

Skill Test 通过 `selectRun/selectRunItems/selectPendingInteraction` 读取状态；headless helper 已统一处理 snapshot required 并返回 RunView，不再维护第二套 frame output。

停止操作调用 `cancelAgentRun({run_id:handle.run_id,request_id:handle.request_id})`；interaction 使用 `resumeAndWaitAgentRun(...,{on_event:runtimeStore.dispatch})`，捕获 resumed handle 后持续到下一 resting/terminal，不得把表单回答放进 history 启动新 Run。

- [ ] **Step 2: 让 Skill Creator 只组装 Surface 配置**

`ShowSkillCreator` 继续确保 draft 存在，然后把 `sourceType:'debug'`、draft context 和 `onSkillDraftArtifact` 交给薄 `ShowAgent`。删除 `skillDraftPatchAutoApply` 这种由公共 Agent 猜最终 JSON 的配置。

- [ ] **Step 3: 统一 Skill Draft 与 Install page meta**

`skill_draft/list.json` 删除旧 Agent endpoint、blockMs 和自动 final kind 解释；保留 draft id/pack/cate 作为 context。`skill_pack/list.json` 删除 `/bot/admin/skill_install/run|stream|stop`，改用统一 `show-agent` + `sourceType:'debug'`，安装能力由安装 Agent 显式挂载 Tool 决定。

- [ ] **Step 4: 删除 v1 UI 文件和 bot-only assistant-ui 依赖**

```bash
git rm front/src/nodes/show/agent-parts.ts \
  front/src/nodes/show/agent-message-parts.tsx \
  front/src/nodes/show/agent-markdown-text.tsx \
  front/src/nodes/show/agent-result.tsx \
  front/src/nodes/show/agent-content-output.tsx
```

从 `front/package.json` 删除：

```json
"@assistant-ui/react": "^0.14.26",
"@assistant-ui/react-markdown": "^0.14.5"
```

不增加宿主依赖，不生成或修改 dist。

- [ ] **Step 5: 确认 generic stream 与 plugin 注册未改**

```bash
git diff --exit-code -- front/src/nodes/show/stream-request.tsx front/src/plugin.ts front/page/admin/energon/power/list.json
rg -n 'show-agent|show-skill-test|show-stream-request' front/src/plugin.ts
```

Expected: 三个保留文件无本任务差异；plugin 仍注册相同节点名。

- [ ] **Step 6: 静态核对并提交 bot Phase B**

```bash
git diff --check -- front/src/nodes/show front/page/admin/agent front/package.json
rg -n 'runAgentStream|stopAgentStream|agent-runtime/v1|agent-result|agent-output' front/src/nodes/show front/page/admin/agent
git add front/src/nodes/show/skill-test.tsx \
  front/src/nodes/show/skill-creator.tsx \
  front/page/admin/agent/skill_draft/list.json \
  front/page/admin/agent/skill_pack/list.json \
  front/package.json
git add -u front/src/nodes/show
git commit -m "refactor(bot-front): migrate skill surfaces to runtime v2"
```

Expected: v1 Agent UI 引用无命中；generic `ShowStreamRequest` 仍存在。

## Phase C：Chat、Media、Quick Fill 与宿主 v1 清理

### Task 11: 将 Chat Drawer 切到共享 Provider

**Repository:** `/data/project/shemic/front`

**Files:**
- Modify: `src/components/assistant/drawer.tsx:1-1351`
- Modify: `src/lib/assistant/session.ts`

- [ ] **Step 1: 保留 Drawer 外壳与 Assistant 上下文**

保留 Sheet、标题、历史会话、Memory、Reference Picker、当前页面 Context 与 Permission 加载。删除 Drawer 内的 `messages/running/status/timing/abortRef` Runtime 状态以及 `send/stop/submitInteraction/recordAssistantMessage/buildAssistantHistory`。

- [ ] **Step 2: 创建 Drawer 的 Assistant Surface Adapter**

```tsx
const adapter = useMemo(
  () => createAssistantRuntimeSurfaceAdapter({
    sessionID,
    agentKey: 'front-assistant',
    contextKey: sessionContextKey,
    sourceType: 'chat',
  }),
  [sessionContextKey, sessionID]
)

const buildCurrentAssistantContext = useCallback(
  () => {
    const registration = getActiveAssistantPage()
    return {
      page_context: {
        ...buildAssistantPageContext(registration),
        __runtime_page_identity: assistantPageIdentity(registration),
      },
      permission_context: buildAssistantPermissionPayload(permissionContext),
    }
  },
  [permissionContext]
)

const frontAssistantEffects = useMemo<AgentRuntimeSurfaceEffects>(
  () => ({
    onFrontAction: async (item, runContext) => {
      const payload = item.payload
      const registration = getActiveAssistantPage()
      if (assistantPageIdentity(registration) !== runContext.page_context.__runtime_page_identity) {
        throw new Error('任务所属页面已切换，已拒绝应用页面动作。')
      }
      const frozen = parseRuntimeAssistantContext(runContext)
      const action = runtimeFrontActionToAssistantAction(payload)
      await applyAssistantFrontAction(
        {
          registration,
          context: frozen.pageContext,
          permissionContext: frozen.permissionContext,
          navigate: (target) => navigate({ to: stripRouterBasePath(target.to), search: target.search }),
        },
        action
      )
    },
  }),
  [navigate]
)
```

- [ ] **Step 3: 用共享 Provider/Thread/Composer 替换消息循环**

```tsx
<AgentRuntimeProvider adapter={adapter} effects={frontAssistantEffects}>
  <AgentRuntimeThread emptyText="直接描述要完成的页面任务。" />
  <AgentRuntimeRunStatus />
  <AgentRuntimeComposer
    placeholder="输入需求、修改要求，或粘贴材料让我处理当前页面..."
    references={runtimeReferences}
    onReferencesChange={setRuntimeReferences}
    buildContext={buildCurrentAssistantContext}
  />
</AgentRuntimeProvider>
```

新增纯函数 `runtimeFrontActionToAssistantAction()`，按 fill_form/patch_form/open_page/open_form 分别校验并转换 Runtime `{action,target,values,reason}` 为现有 Assistant action 的真实字段形状，禁止 TypeScript cast 掩盖不兼容。`parseRuntimeAssistantContext()` 严格校验并把通用 Record 窄化为现有 `AssistantPageContext/AssistantPermissionContext`，拒绝缺字段而不做 cast。`frontAssistantEffects` 继续复用 `applyAssistantFrontAction` 的权限校验；动作由 `front_action.ready` Item 触发，不从文本 fence 提取。Effect 必须使用 run_id 对应的发送快照；当前页面 identity 不同或已卸载时可见拒绝，绝不把页面 A 的动作应用到页面 B。

Reference Picker 在写入 Composer 状态前调用 `toRuntimeAttachmentRefs`，因此 Provider 只收到 upload-backed server references。

- [ ] **Step 4: 移除浏览器运行消息写入**

Drawer 不再调用 `saveAssistantMessage`。历史、新建、归档、恢复、改名、Memory 管理仍调用 `session.ts` 现有 API。interaction 表单由共享 `interaction-item.tsx` 调用 Resume 同一 Run。

- [ ] **Step 5: 静态核对并提交**

```bash
git diff --check -- src/components/assistant/drawer.tsx src/lib/assistant/session.ts
rg -n 'runAssistantAgent|runAgentStream|saveAssistantMessage|buildAssistantHistory|onDelta|onFinalOutput' src/components/assistant/drawer.tsx
git add src/components/assistant/drawer.tsx src/lib/assistant/session.ts
git commit -m "refactor(front): migrate chat drawer to runtime v2"
```

### Task 12: 迁移 Assistant Media

**Repository:** `/data/project/shemic/front`

**Files:**
- Modify: `src/lib/assistant/media.ts:1-620`
- Modify: `src/components/assistant/media-generate.tsx`

- [ ] **Step 1: 为 Media interaction error 保存 RunRef**

```ts
export class AssistantMediaInteractionRequiredError extends Error {
  constructor(
    readonly run: RunHandle,
    readonly item: RuntimeItemOf<'interaction'>
  ) {
    super('需要补充素材生成参数。')
  }
}
```

UI 保存 `run_id/item_id/call_id`，不得保存旧 history 供下一次重新执行。

- [ ] **Step 2: 将首次生成切到 Assistant SendMessage**

`runAssistantMediaGeneration` 保持现有对外函数名和返回的媒体 item 结构，但内部使用独立 media Session 的 `sendAssistantMessage`，watch 到 resting/terminal 后从 Artifact Item 提取结果。

```ts
const started = await sendAssistantMessage({
  client_message_id: crypto.randomUUID(),
  session_id: session.id,
  agent_key: 'front-assistant',
  context_key: session.context_key,
  output_key: 'media',
  text: prompt,
  attachments: await toRuntimeAttachmentRefs(references),
  page_context: context,
  permission_context: permission,
  source_type: 'chat',
})

if (!started.run) {
  throw assistantChatError(started.upsert_messages)
}
const view = await waitAgentRun(started.run)
```

- [ ] **Step 3: 将继续生成改为 Resume**

UI 在一次用户回答开始时生成 `resumeIdempotencyKey` 并与 pending Run/Item 状态一起保存；网络结果未知时重试复用，只有新的用户决定才生成新 key。捕获 Resume 返回的新 cursor 并通过共享 headless helper 等待：

```ts
const view = await resumeAndWaitAgentRun({
  run_id: required.run.run_id,
  item_id: required.item.id,
  call_id: required.item.call_id,
  action: 'submit',
  answer: result.data,
  idempotency_key: resumeIdempotencyKey,
})
```

从 `view.items` 提取 Artifact；helper 会从 resumed handle 的 stream_cursor 继续并在 gap 时 snapshot，不创建第二条任务消息。

- [ ] **Step 4: 静态核对并提交**

```bash
git diff --check -- src/lib/assistant/media.ts src/components/assistant/media-generate.tsx
rg -n 'runAssistantAgent|runAgentStream|history:' src/lib/assistant/media.ts src/components/assistant/media-generate.tsx
git add src/lib/assistant/media.ts src/components/assistant/media-generate.tsx
git commit -m "refactor(front): migrate assistant media to runtime v2"
```

### Task 13: 迁移 Quick Fill

**Repository:** `/data/project/shemic/front`

**Files:**
- Modify: `src/lib/assistant/quick-fill.ts:1-520`
- Modify: `src/components/assistant/form-actions.tsx`

- [ ] **Step 1: 扩展 Quick Fill interaction 引用**

```ts
export class AssistantQuickFillInteractionRequiredError extends Error {
  constructor(
    readonly run: RunHandle,
    readonly item: RuntimeItemOf<'interaction'>
  ) {
    super('需要补充自动填充信息。')
  }
}
```

- [ ] **Step 2: 将首次 Quick Fill 切到 SendMessage + strict Output**

调用 `/bot/admin/assistant/send_message` 并提交 `output_key:'quick_fill'`；这是服务器已注册契约的 key，不提交 raw schema。引用附件同样先 `await toRuntimeAttachmentRefs`。无 run 的 chat_error 直接显示并结束；有 Run 时调用 `waitAgentRun`，再从权威 `RunView.run.output` 读取 `OutputEnvelope.data`；禁止从 send 响应消息、assistant text、JSON fence 或历史 output shell 猜最终值。

```ts
export type QuickFillOutput = {
  values: Record<string, unknown>
  explanation?: string
}

function quickFillOutput(output: OutputEnvelope): QuickFillOutput {
  if (output.type !== 'structured' || !isQuickFillOutput(output.data)) {
    throw new Error('智能填充返回结构不符合约定。')
  }
  return output.data
}

function isQuickFillOutput(value: unknown): value is QuickFillOutput {
  return Boolean(
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    'values' in value &&
    value.values &&
    typeof value.values === 'object' &&
    !Array.isArray(value.values)
  )
}
```

- [ ] **Step 3: 将 continue 函数改为 Resume 原 Run**

`continueAssistantQuickFill` 与 `continueAssistantContextQuickFill` 使用异常对象上的 Run/Item 调 `resumeAndWaitAgentRun(action:'submit')`，使用 UI 为本次回答保存并在网络重试复用的 idempotency_key，然后从返回 terminal RunView 读取 Output。`form-actions.tsx` 不再构造 interaction history。

解析得到的 `output.values` 必须继续走现有 Quick Fill 字段 allowlist、field mode、overwrite 与 permission 过滤/应用链（复用当前 `filterPatchValues/filterQuickFillActions` 和受控 apply helper）；本重构只替换结果来源，绝不能把任意 output key 直接交给 `setValueByPath`。

- [ ] **Step 4: 静态核对并提交**

```bash
git diff --check -- src/lib/assistant/quick-fill.ts src/components/assistant/form-actions.tsx
rg -n 'runAssistantAgent|history:|agent-result|agent-output' src/lib/assistant/quick-fill.ts src/components/assistant/form-actions.tsx
git add src/lib/assistant/quick-fill.ts src/components/assistant/form-actions.tsx
git commit -m "refactor(front): migrate quick fill to runtime v2"
```

### Task 14: 删除宿主 v1 runner 与旧 Assistant Client 解释器

**Repository:** `/data/project/shemic/front`

**Files:**
- Modify: `src/lib/assistant/client.ts`
- Modify: `src/lib/plugin/sdk-compat.ts`
- Delete: `src/lib/agent/runner.ts`

- [ ] **Step 1: 删除 Assistant Client 的旧导出和解析**

从 `assistant/client.ts` 删除：

```text
AssistantStatusHandler
AssistantRunOptions
runAssistantAgent
stopAssistantAgent
buildAssistantHistoryRow
assistantFinalText
isAssistantResultShellText
extractAgentResultText
```

最终文件只保留 `sendAssistantMessage`、`createAssistantRuntimeSurfaceAdapter` 和它们的严格类型。

- [ ] **Step 2: 删除 v1 agent runner**

```bash
git rm src/lib/agent/runner.ts
```

从 `sdk-compat.ts` 删除 `agentRunnerModule` import 和 `'@/lib/agent/runner'` 映射。不得删除 generic `runtimeStreamRunnerModule/runtimeStreamOutputModule/streamModule`。

- [ ] **Step 3: 核对所有 v1 引用已清零且 generic stream 仍有消费者**

```bash
rg -n 'runAgentStream|stopAgentStream|@/lib/agent/runner|agent-runtime/v1' src
rg -n 'runRuntimeStream|watchRuntimeStream|normalizeRuntimeFrameOutput' \
  src/lib src/components src/page
git status --short
```

Expected: 第一条无输出；第二条仍能看到 upload、Energon 或其它 generic consumer；删除范围只有 Agent v1。

- [ ] **Step 4: 静态核对并提交宿主 Phase C**

```bash
git diff --check -- src/lib/assistant/client.ts src/lib/plugin/sdk-compat.ts src/lib/agent/runner.ts
git add src/lib/assistant/client.ts src/lib/plugin/sdk-compat.ts
git add -u src/lib/agent
git commit -m "chore(front): remove agent runtime v1 client"
```

## 双仓提交与发布依赖

开发顺序固定为：

```text
front Phase A commits
  1. feat(front): define agent runtime v2 protocol
  2. feat(front): add agent runtime v2 client
  3. feat(front): add agent runtime event reducer
  4. feat(front): add agent runtime store and selectors
  5. feat(front): isolate agent runtime surface effects
  6. feat(front): add agent runtime item renderers
  7. feat(front): add shared agent runtime provider
  8. feat(front): expose agent runtime v2 surfaces
          │
          ▼
bot Phase B commits
  9. feat(bot-front): rebuild agent debug surface
 10. refactor(bot-front): migrate skill surfaces to runtime v2
          │
          ▼
front Phase C commits
 11. refactor(front): migrate chat drawer to runtime v2
 12. refactor(front): migrate assistant media to runtime v2
 13. refactor(front): migrate quick fill to runtime v2
 14. chore(front): remove agent runtime v1 client
```

生产不能按上述 commit 顺序逐个放流量。维护窗口前由用户现有发布流程预备并记录：

```text
backend/package/bot commit
bot plugin manifest artifact checksum
host front commit
host front artifact checksum
backend artifact checksum
protocol version = agent-runtime/v2
```

正式切换顺序：停止开发环境新写入 → 部署 v2 backend → 部署匹配的 bot plugin 制品 → 部署包含 SDK compat 与新 Chat Drawer 的宿主 front → 核对三者版本 → 再恢复流量。新 bot plugin 依赖宿主 `sdk-compat`，因此不能在旧宿主 front 上单独放量；版本不符必须显示“前后端 Agent Runtime 版本不一致”。回滚必须同时恢复 backend、bot plugin、host front 三份旧制品。

## 用户手工验收清单

用户在协调部署完成后手工验证，不由实施代理运行自动命令：

- [ ] Agent 调试页创建新会话，连续发送两轮，第二轮能引用第一轮事实。
- [ ] 刷新 Agent 调试页，稳定历史来自 Assistant Message，活动 Run 从 snapshot 恢复且正文不重复。
- [ ] 挂载知识库的 Agent 能显示 Knowledge Tool 状态并读取原文；未挂知识库的 Agent 看不到该 Tool。
- [ ] `ask_user` 显示表单，提交后原 `run_id` 不变并继续执行。
- [ ] 批次 Approval 显示待审批调用，approve/deny 后原 Run 继续；重复点击不产生第二次执行。
- [ ] 中断 Run 停止 spinner，点击“继续”从 checkpoint 恢复；Cancel 后显示 canceled 且不能再发送 Tool。
- [ ] 图片、视频、音频和文件显示独立 Artifact 状态；ready 后刷新仍可展示。
- [ ] rich document 使用后端 `rich_json` 渲染，不出现协议 JSON 或 Markdown 控制 fence。
- [ ] 两个不同 Session 可同时执行；同一 Session active Run 时第二条消息被明确阻止。
- [ ] Chat Drawer 能调用页面 Front Action，未授权路径不修改 page store。
- [ ] Media Generate 缺参时 Resume 原 Run，生成结果来自 Artifact Item。
- [ ] Quick Fill 缺参时 Resume 原 Run，最终只接受 structured Output。
- [ ] Skill Test 可启动、观看、Cancel 和 Resume v2 Run；Skill Install 不再请求 `/skill_install/run|stream|stop`。
- [ ] Energon Power 调试页 `show-stream-request` 仍可使用原 generic stream。
- [ ] Team Debug 和 upload 的 generic stream 未被 Agent v2 Client 改写。
- [ ] 使用旧 bot plugin、旧宿主 front 或旧 backend 任一组合时，页面明确拒绝版本不匹配。

## 本子计划完成条件

- 宿主只有一套 `agent-runtime/v2` protocol/client/reducer/store/provider。
- Chat Drawer、Agent Debug、Skill Test、Media、Quick Fill 不上传 history、不写运行消息、不解释 final fence。
- Interaction、Approval、Continue 与 Cancel 都作用于同一个 Run。
- bot `ShowAgent` 是薄 Surface；Tool、Artifact、Content 与状态归并来自宿主共享实现。
- `src/lib/agent/runner.ts`、bot v1 parts/result/markdown 文件和 bot-only assistant-ui 依赖已删除。
- `runtime-stream-runner.ts`、`runtime-stream-output.ts`、`ShowStreamRequest`、Team/Workspace stream 与 upload generic stream 保留。
- 两仓提交可独立审查，但只能以匹配的 backend、bot plugin、host front 制品协调发布。
- 用户完成上述手工验收后，才能进入 05 Integrations/Cutover 的正式放量步骤。
