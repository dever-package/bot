# Agent Runtime v2 Integrations and Cutover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Team、Project、Workspace、Skill 和维护任务切到共享 Runtime v2，清除旧 Runtime/Step/前端协议，并在受保护维护窗口完成数据库与三份制品切换。

**Architecture:** 内部调用方只使用非交互 `Execute/Cancel/GetRun`，保留自己的状态机、审批与调度。切换前先完成全部代码和双前端制品准备，再以开发数据库和 Redis 身份硬校验为门槛执行破坏性迁移；任一步失败同时恢复数据库、backend、bot plugin 和宿主 front。

**Tech Stack:** Go 1.25、Dever Service、PostgreSQL、Redis Stream、Bash migration guard、React Team Debug DTO

---

## 前置条件

- `01-core`、`02-tools-output`、`03-assistant-api`、`04-frontend` 全部完成。
- bot、backend/bot plugin、宿主 front 的协议常量均为 `agent-runtime/v2`。
- 用户已保存当前开发数据库与三份旧制品；8091 Demo 仍在独立数据库/Redis DB 1 上运行。
- 本计划不运行 build/test/lint；制品由用户现有发布流程生成并手工验证。

### Task 1：切换 Team Agent Node 与独立角色

**Files:**

- Modify: `service/team/main.go`
- Modify: `service/team/node_executor.go`
- Modify: `service/team/runtime_role.go`
- Modify: `service/team/runtime_cancel.go`
- Modify: `service/team/runtime.go`
- Modify: `service/team/frontend.go`
- Modify: `service/agent/app/source_router.go`
- Create: `service/agent/app/source_stream_sink.go`

- [ ] **Step 1：注入共享 Runtime Service**

Replace concrete temporary construction with:

```go
type AgentRuntime interface {
    Start(context.Context, runtimecore.ExecuteRequest) (runtimecore.RunHandle, error)
    Wait(context.Context, runtimecore.RunRef) (runtimecore.RunResult, error)
    Execute(context.Context, runtimecore.ExecuteRequest) (runtimecore.RunResult, error)
    Cancel(context.Context, runtimecore.RunRef) error
    GetRun(context.Context, runtimecore.RunRef) (runtimecore.RunView, error)
    ListItems(context.Context, uint64) ([]runtimecore.ItemView, error)
}

type Service struct {
    agent AgentRuntime
}
```

Delete `newAgentRuntime`。`team.NewService()` 保存默认惰性 provider `func() AgentRuntime { return app.Default().Runtime }`，只在真正执行/取消 Agent node 时取共享实例；保留 `WithAgentRuntime(AgentRuntime)` 供显式组合。这样现有 API package-level Service 不会在 Go init 阶段启动数据库 worker，也不得再构造 Gateway、Store 或 agent stream。`service/agent/app` 不 import Team，因此保持单向 `team → app → runtime`，不产生循环依赖。

- [ ] **Step 2：切换 `runAgentNode`**

In `service/team/node_executor.go`, replace `RunInternal` and callbacks with Start → persist link → Wait:

```go
handle, err := s.agent.Start(ctx, runtimecore.ExecuteRequest{
    RequestID: stableNodeAttemptRequestID(run.ID, nodeRun.ID, node.Key),
    Agent:     runtimecore.AgentRef{ID: agentID},
    Input:     inputBlocks,
    Messages:  nodeHistory,
    Source: runtimecore.RunSource{
        Type: "team", ID: nodeRun.ID, ParentID: run.ID,
        Metadata: map[string]any{"stream_request_id": run.RequestID},
    },
    Invocation: invocation,
    Output:     outputContract,
})
if err == nil {
    err = persistAgentRunIDCAS(ctx, nodeRun.ID, handle.RunID)
}
if err != nil {
    if handle.RunID > 0 { _ = s.agent.Cancel(context.WithoutCancel(ctx), runtimecore.RunRef{ID: handle.RunID, RequestID: handle.RequestID}) }
    return err
}
result, err := s.agent.Wait(ctx, runtimecore.RunRef{ID: handle.RunID, RequestID: handle.RequestID})
```

`persistAgentRunIDCAS` 必须在 Start 返回后立即把 handle.RunID 写入 `bot_team_node_run.agent_run_id`，只允许 0 或同值，之后长模型/工具执行期间 Cancel 始终可定位；关联写失败必须 best-effort Cancel 该 Run，不得继续 Wait。Wait 的 Go error 只表示无法取得结果；`status=completed` 才按节点成功处理，failed/canceled/resting 都映射成明确 Team node failure，非交互 Catalog 正常情况下不得 resting。

在 `service/agent/app/source_stream_sink.go` 实现只依赖 `front/service/stream` 的组合 Sink：实现 `Emit(ctx,source,event)`；默认 Agent v2 stream 已由 Runtime Emitter 写且不得重复，Sink 只让 `team/project` 根据 server-owned RunSource.Metadata 中的 `stream_request_id` 额外镜像到 team stream，其余 source 为 Noop。Sink 只映射事件，不更新 Team/Project 业务状态，也不 import `service/team` 或 `service/project`。修改 frozen SourceRouter 的构造输入，而不是运行时动态注册。

- [ ] **Step 3：删除不可达的 Runtime interaction 转 Team Approval 分支**

Remove current branches that turn Agent `interaction` into Team waiting/approval. Effective Catalog for team excludes interaction、approval、CanSuspend tools; a violation returns `noninteractive_tool_blocked` and fails the node deterministically.

- [ ] **Step 4：切换独立沟通角色**

Apply the same Start → persist AgentRunID → Wait contract in `runtime_role.go`, using a stable role-attempt request_id and `Source{Type:"team"}`. Preserve Team role records and blackboard; do not move them into Runtime.

- [ ] **Step 5：切换取消与调试读取**

`runtime_cancel.go` calls:

```go
return s.agent.Cancel(ctx, runtimecore.RunRef{ID: agentRunID})
```

It must not query `agentmodel.NewRunModel` to discover request_id. `runtime.go` replaces `RunTraces` with RunView/Items and maps them to one v2 Team Debug DTO.

- [ ] **Step 6：静态检查并提交 Team 适配**

Run:

```bash
rg -n 'RunInternal|OnRunCreated|OnStream|RunTraces|agentmodel.NewRunModel' service/team
git diff --check -- service/team
```

Expected: no matches for old Runtime calls or direct Runtime model reads.

Commit:

```bash
git add service/team service/agent/app/source_router.go service/agent/app/source_stream_sink.go
git commit -m "refactor: run team agents through runtime v2"
```

### Task 2：切换 Project 与 Workspace

**Files:**

- Modify: `service/project/run.go`
- Modify: `service/project/workspace_cancel.go`
- Modify: `service/project/workspace_stream.go`
- Modify: `service/project/workspace_execution.go`
- Modify: `service/project/workspace_run.go`
- Modify: `service/project/workspace_run_helper.go`
- Modify: `service/project/workspace_node_execution.go`

- [ ] **Step 1：给 Project Service 注入共享 Runtime**

Use the same `AgentRuntime` interface or a smaller local interface. `project.NewService()` 与 `NewWorkspaceService()` 使用同样的惰性 provider，并提供显式 option 供组合；Delete all `runtime.NewService + energon.NewGatewayService + frontstream.New("agent")` construction。Project 仍可复用 Team 的业务 Service，但两者共享同一个 Runtime 实例。

- [ ] **Step 2：切换 `RunCanvasAgent`**

Call non-interactive Start with `Source{Type:"project", ID: nodeExecutionID, ParentID: workspaceRunID, Metadata:{"stream_request_id": workspaceRequestID}}` and stable child request_id；immediately CAS-persist handle.RunID to the workspace/node execution row, then Wait. Populate server-owned `Invocation.ArtifactScope{ProjectID,BodyID,TeamID,FlowID,AssetCateID,RequireAsset}` from validated workspace records before Start；Tool Artifact persistence must never infer these IDs from model output or current mutable workspace state. Preserve workspace locks、records and node status in Project Service. Only completed is success.

- [ ] **Step 3：修复 Asset Run 语义**

Replace the current incorrect final-output call:

```go
asset.SaveVersionRequest{RunID: result.RunID}
```

with:

```go
asset.SaveVersionRequest{
    RunID:       teamRunID,
    NodeRunID:   nodeRunID,
    AgentRunID:  ptrUint64(result.RunID),
    AgentItemID: nil,
}
```

When no Team Run exists, RunID remains zero; it never receives Agent Run ID. This row represents the Project final document/result and therefore has nullable AgentItemID；不得随便借用一个媒体 Artifact Item。每个 Tool Artifact 的正式 Version 已由 ArtifactStore 按 agent_run_id+agent_item_id 幂等写入，Project 不得重复 SaveVersion。若未来最终文档本身需要 Item 关联，先创建明确的 final-output Artifact Item。

- [ ] **Step 4：切换 Workspace Cancel 与 Stream 映射**

Cancel only by persisted Agent Run ID；缺失 ID 的旧记录在维护窗口统一清空或解除引用，不增加 request_id 兼容查找。Stream mapping consumes v2 envelope RunID/ItemID, not `output.meta.run_id` or child payload guesses.

- [ ] **Step 5：静态检查并提交 Project 适配**

Run:

```bash
rg -n 'RunInternal|\.Stop\(|NewService\(agentruntime|output.*meta.*run_id' service/project
rg -n 'SaveVersionRequest\{[^}]*RunID: result.RunID' service/project
git diff --check -- service/project
```

Expected: all old calls and AgentRun-as-TeamRun writes are absent.

Commit:

```bash
git add service/project
git commit -m "refactor: run project agents through runtime v2"
```

### Task 3：切换 Skill、配置与维护任务

**Files:**

- Modify: `service/agent/skill/install/planner.go`
- Modify: `service/agent/skill/draft/service.go`
- Modify: `service/agent/setting/runtime.go`
- Modify: `service/maintenance/cron.go`

- [ ] **Step 1：切换 Skill Install Planner**

Use shared Runtime Execute with SkillInstallerAgentID、stable `request_id + "-planner"` and `Source{Type:"skill"}`. Its Effective Catalog contains only `create_skill_install_plan` and safe dependencies; no ask_user/approval. Execute 的 Go error 仅表示基础设施失败；只有 result.Status=completed 才解析 install plan，failed/canceled/resting 均按明确业务失败返回。

- [ ] **Step 2：移除 Runtime Config 反向依赖**

`skill/draft/service.go` uses `sandbox.ConfigFromRuntimeConfig` directly. `setting/runtime.go` imports normalization from `service/agent/sandbox` or `model/agent`, never from Runtime.

- [ ] **Step 3：改 Maintenance 清理顺序**

Replace Step cleanup with:

```text
expired Assistant projections / Artifact references checked
bot_agent_item delete by expired run IDs
bot_agent_run delete
```

Never delete a Run before Items or while Assistant/Team/Workspace still references it.

- [ ] **Step 4：静态检查并提交**

```bash
rg -n 'agentruntime.WithDefaults|RunInternal|NewStepModel' \
  service/agent/skill service/agent/setting service/maintenance
git diff --check -- service/agent/skill service/agent/setting service/maintenance
git add service/agent/skill service/agent/setting service/maintenance
git commit -m "refactor: adapt skill and maintenance runtime callers"
```

### Task 4：迁移 Team Debug 与 Runtime 管理页面

**Files:**

- Modify: `front/src/nodes/show/team-workspace/debug-state.ts`
- Modify: `front/src/nodes/show/team-workspace/debug-panel.tsx`
- Modify: `front/src/nodes/show/team-workspace/canvas.tsx`
- Modify: `front/page/admin/agent/run/list.json`
- Modify: `front/page/admin/agent/run/view.json`
- Delete: `front/page/admin/agent/step/list.json`
- Delete: `front/page/admin/agent/step/view.json`

- [ ] **Step 1：定义 Team Debug v2 DTO**

Use `runs/items/usage/error` with explicit run_id、item_id、call_id、status; remove `steps` and raw legacy stream assumptions.

- [ ] **Step 2：更新 Run 管理页**

Run list shows request_id、Agent、source、status、phase、usage、timestamps. Run view renders Item timeline through model relation; no Step page remains.

- [ ] **Step 3：提交页面适配**

```bash
git add front/src/nodes/show/team-workspace front/page/admin/agent/run
git add -u front/page/admin/agent/step
git commit -m "refactor(front): show runtime v2 run items"
```

### Task 5：彻底清除 v1 残留

**Files:**

- Inspect/Delete: `service/agent/runtime/**` old files listed in design section 23.1
- Inspect/Delete: old frontend files listed in `04-frontend`
- Inspect: entire bot repository

- [ ] **Step 1：删除旧 Go 符号与协议**

Required absent symbols:

```text
RunInternal
RunRequest
InternalRunRequest
InternalRunResult
ResolveProfile
AllowAll
ProviderFactory/RegisterProvider init registry
agent-runtime/v1
bot_agent_step/NewStepModel
syncAssistantRunStarted/syncAssistantExecutionMessage
```

- [ ] **Step 2：删除自由文本 Tool/Result fallback**

Remove Markdown fence、custom JSON Tool Call guessing、final result fence and placeholder-based asset parsing. Structured fallback is allowed only for OutputContract JSON validation, never Tool Calling.

- [ ] **Step 3：静态全仓扫描**

Run:

```bash
rg -n 'RunInternal|InternalRunRequest|ResolveProfile|AllowAll|RegisterProvider|agent-runtime/v1|NewStepModel|bot_agent_step' .
rg -n 'final_result|tool_call_synthesized|placeholder_id.*正文' service/agent/runtime front/src
git diff --check
```

Expected: no v1 symbols; any match in design/migration documentation is reviewed separately, not executable code.

- [ ] **Step 4：提交清理**

```bash
git add -A service/agent/runtime model/agent front/src front/page
git commit -m "refactor: remove agent runtime v1"
```

### Task 6：编写受保护迁移与回滚脚本

**Files:**

- Modify: `migrations/postgres/003_agent_runtime_v2.sql`
- Modify: `migrations/agent-runtime-v2-tool-mount-manifest.json`
- Create: `migrations/agent-runtime-v2-cutover.sh`
- Create: `migrations/agent-runtime-v2-rollback.md`

- [ ] **Step 1：实现环境硬保护函数**

The cutover script requires explicit arguments and rejects defaults:

```bash
require_environment() {
  test "$DATABASE_NAME" = "$EXPECTED_DATABASE_NAME"
  test "$DATABASE_NAME" != "shemic_demo"
  test "$REDIS_ADDR" = "$EXPECTED_REDIS_ADDR"
  test "$REDIS_DB" = "$EXPECTED_REDIS_DB"
  test "$REDIS_DB" != "1"
  test "$REDIS_PREFIX" = "$EXPECTED_REDIS_PREFIX"
  test "$REDIS_PREFIX" != "shemic_demo"
  test "$PROJECT_ROOT" != "/data/project/shemic/demo"
  test "$HTTP_PORT" != "8091"
}
```

Missing/unparseable values exit before SQL or Redis commands. Rollback calls the same function.

- [ ] **Step 2：写 PostgreSQL transaction**

`003_agent_runtime_v2.sql` must:

```text
BEGIN
materialize audited old Chat/Debug session + owner/context scopes in a temporary table
delete only bot_memory rows matching those old Runtime Chat/Debug scopes, recording before/after counts
identify Project-created AssetVersion rows whose legacy run_id points to old Agent Run IDs; preserve content but clear only those run_id/node_run_id values, recording count
clear every retained Team/Workspace old agent_run_id reference
delete all development Runtime-backed Assistant messages and sessions selected by the audited Runtime owner/context scope
drop bot_agent_step
drop/recreate bot_agent_run from v2 Model schema
create bot_agent_item
alter bot_agent with memory/output contract columns
create AgentTool/AgentPower/ModelCapability/RuntimeLeader schema
alter bot_agent_runtime_config with coordinator/context budget columns
alter Assistant Session/Message
alter Asset Version agent_run_id + agent_item_id
create partial unique indexes
COMMIT
```

Required partial unique indexes are explicit: Item `(run_id,call_id,type,attempt) WHERE call_id <> ''`; Assistant `(session_id,run_id,role) WHERE run_id IS NOT NULL`、`(session_id,client_message_id) WHERE client_message_id <> ''`、`(session_id,request_id,role) WHERE request_id <> ''`; Asset Version `(agent_run_id,agent_item_id) WHERE both IS NOT NULL`. Nullable Assistant/Asset IDs use pointer/SQL NULL, never zero-as-null guessing.

Legacy Asset cleanup must use the pre-migration audited Project request/source association; do not clear normal Team run_id rows. `bot_memory` is shared infrastructure and must not be truncated：only rows matching the saved Runtime Chat/Debug session/owner/agent/context scope are deleted before Message/Session. Do not clear Agent、Setting、Skill、Knowledge、Power、Provider、Team/Flow/Workspace definitions or unrelated Memory.

- [ ] **Step 3：导入显式挂载**

Task 0 已生成受审 manifest，本任务只补最终 protocol/schema hash 和用户确认的能力记录，不重新推断工具。The script validates manifest version/hash and inserts exact AgentTool/AgentPower/ModelCapability rows. Knowledge/Skill remain in existing relation tables; compare relation count/hash before and after.

- [ ] **Step 4：定义回滚文档**

Exact order:

```text
keep writes stopped
stop v2 backend
restore verified DB backup/schema
restore old backend + bot plugin + host front
run the same Redis guard
clear only failed development agent stream prefix
start old backend
verify old protocol
```

- [ ] **Step 5：提交迁移资产**

```bash
git add migrations
git commit -m "chore: add agent runtime v2 cutover migration"
```

### Task 7：执行协调维护窗口

**State:** development backend only; Demo excluded.

- [ ] **Step 1：由用户预备三份匹配制品**

Record:

```text
backend commit/checksum
bot plugin manifest checksum
host front commit/checksum
protocol version = agent-runtime/v2
```

The agent does not run build/test commands.

- [ ] **Step 2：由用户停止开发写流量并备份**

Backup database schema/data、old backend、old bot plugin、old host front and current config. Verify backup readability before migration.

- [ ] **Step 3：运行 guard 与 migration**

Only the user-authorized development database/Redis identity may pass. Keep 8091 running and untouched.

- [ ] **Step 4：同时部署三份 v2 制品**

Do not expose a partial combination. Version mismatch must render a clear error and refuse old event parsing.

- [ ] **Step 5：用户执行完整手工验收**

Use design specification section 26, including Markdown chat、multi-turn tool loop、Knowledge、ask_user Resume、approval、cancel、interrupted/uncertain、parallel tools、Structured、Rich Tiptap、image/video/audio Artifact、Team/Project、cursor recovery and Demo isolation.

- [ ] **Step 6：健康后放量或按固定顺序回滚**

No v2 user write is accepted before health/manual smoke succeeds, so rollback never converts v2 Run data back to v1.
