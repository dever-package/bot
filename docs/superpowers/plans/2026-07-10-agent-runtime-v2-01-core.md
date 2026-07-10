# Agent Runtime v2 Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不改动 Energon 模型接入层的前提下，重建 Agent Runtime v2 的领域协议、持久化、单活 Coordinator、事件快照、薄 Model Client、基础唯一 Agent Loop 和根 Service。

**Architecture:** 领域和 wire 类型放在无上层依赖的 `service/agent/runtime/core`，Store、Engine、Event、Model Client 仅依赖 core，根 `runtime.Service` 负责组合，避免 Go import cycle。此阶段删除旧 Runtime 并建立只支持纯文本多轮模型采样的 v2 内核；工具执行、Assistant、Team、Project、前端和数据库切换由后续计划完成。

**Tech Stack:** Go、Dever ORM、PostgreSQL、现有 Energon Gateway、`package/front/service/stream`、Redis Stream。

---

## 执行边界

- 必须在独立 worktree/分支执行，开始前使用 `using-git-worktrees` skill。
- 当前 bot 工作区存在未提交 Runtime 和 Energon 改动；执行前必须由用户先保存并确认 Energon 基线 commit。
- 本计划中间提交会主动删除旧 Runtime，而旧 API、Assistant、Team、Project、Skill Planner 仍在调用旧符号。因此该分支在后续调用方切换计划完成前**不可发布、不可部署、不可启动 backend**。
- 不运行或安排 `go test`、`go build`、`go vet`、lint、`npm run build` 或任何测试命令。
- 不执行数据库迁移，不启动会自动同步 Model 的 backend，不清理 Redis；8091 Demo 和它的数据库、Redis DB 1、`shemic_demo` prefix 完全不接触。
- 每个任务只提交本任务列出的文件；不得把用户已有改动混入提交。
- 本计划允许的验证仅为 `gofmt`、`rg`、`git diff --check`、`git status` 和人工源码审阅。

## 文件职责总览

### 修改或新增的 Model

```text
model/agent/agent.go                 Agent 的 memory/output contract 字段和挂载 relation
model/agent/runtime_config.go        Runtime 默认值、配置规范化、Worker/lease 配置
model/agent/agent_tool.go             静态 Tool 显式挂载
model/agent/agent_power.go            Energon Power 显式挂载
model/agent/model_capability.go       Runtime 已验证模型能力
model/agent/runtime_leader.go         单活 leader lease 与 fencing token
model/agent/run.go                    v2 Run 权威状态机
model/agent/item.go                   v2 Item 权威执行记录
model/agent/step.go                   删除
```

### 新 Runtime 依赖方向

```text
runtime/core        无 Runtime 上层依赖的领域和 wire 类型
      ↑
      ├── runtime/store    Dever ORM、CAS、Run/Item/lease 持久化
      ├── runtime/event    Agent Stream、事件 envelope、snapshot barrier
      ├── runtime/model    Energon 反腐层和 ModelEvent
      └── runtime/engine   Coordinator、Worker、唯一基础 Loop
                  ↑
             runtime.Service
```

根 `runtime` 可以 import 子包；任何子包都不得 import 根 `runtime`。根目录通过 type alias 暴露稳定公共类型。

## 阶段完成标准

本计划完成时应具备：

- v2 Run/Item/Mount/Capability/Leader Model。
- request_id + canonical hash 幂等创建。
- Run/Item version CAS 和合法状态转换。
- 单活 leader、Worker Pool、Run lease、heartbeat、启动中断扫描。
- `agent-runtime/v2` 事件 envelope、cursor 续读、带 gate 的 `GetRun` snapshot。
- 仅调用现有 Energon Gateway 的流式 Model Client。
- 一个基础纯文本 Agent Loop，多轮模型采样使用同一 checkpoint；模型意外返回工具调用时明确失败，不做 JSON fallback。
- 根 Service 的 `Start/Execute/Wait/Resume(interrupted)/Cancel/GetRun/ListItems/ReadEvents/Health`。
- 不包含 Tool Engine、知识库工具、Skill、Power/Asset 工具、Assistant 投影、Team/Project 适配、API 和前端切换。

### Task 1: 抽离 Runtime 外配置 helper，并扩展 RuntimeConfig

**Files:**
- Modify: `model/agent/runtime_config.go`
- Modify: `service/agent/setting/runtime.go`
- Modify: `service/agent/skill/draft/service.go`
- Modify: `service/agent/sandbox/config.go`

- [ ] **Step 1: 在 Model 中定义唯一 RuntimeConfig 规范化入口**

在 `model/agent/runtime_config.go` 保留现有字段和默认值，增加下列常量、字段和公开函数：

```go
const (
	DefaultRuntimeWorkerCount             = 4
	DefaultRuntimeGlobalConcurrency       = 8
	DefaultRuntimePerAgentConcurrency     = 2
	DefaultRuntimePerActorConcurrency     = 2
	DefaultRuntimeLeaderLeaseSeconds      = 30
	DefaultRuntimeRunLeaseSeconds         = 45
	DefaultRuntimeHeartbeatSeconds        = 10
	DefaultRuntimeQueueScanSeconds        = 5
	DefaultRuntimeStreamBlockMilliseconds = 40
)

type RuntimeConfig struct {
	ID                          uint64
	DefaultMaxAutoSteps         int
	HardMaxAutoSteps            int
	SkillMetadataMaxSkills      int
	SkillMetadataFieldMaxLength int
	SkillFileMaxBytes           int
	SkillLoadedContentMaxLength int
	ScriptSandboxDriver         string
	ScriptSandboxBwrapPath      string
	ScriptSandboxNetworkMode    string
	ScriptSandboxTimeoutSeconds int
	ScriptSandboxOutputMaxBytes int
	ToolTimeoutSeconds          int
	MaxModelTurns               int
	MaxToolCalls                int
	MaxConsecutiveToolErrors    int
	MaxRunSeconds               int
	MaxToolArgumentsBytes       int
	MaxInputTokens              int
	MaxOutputTokens             int
	MaxTotalTokens              int
	MaxArtifacts                int
	MaxOutputBytes              int
	WorkerCount                 int
	GlobalConcurrency           int
	PerAgentConcurrency         int
	PerActorConcurrency         int
	LeaderLeaseSeconds          int
	RunLeaseSeconds             int
	HeartbeatSeconds            int
	QueueScanSeconds            int
	StreamBlockMilliseconds     int
	CreatedAt                   time.Time
}

func NormalizeRuntimeConfig(config RuntimeConfig) RuntimeConfig
func NormalizeRuntimeScriptSandboxDriver(value string) string
func NormalizeRuntimeScriptSandboxNetworkMode(value string) string
```

`NormalizeRuntimeConfig` 必须补齐所有非正数默认值；固定初始安全值为 model turns 16、tool calls 32、连续 tool error 3、Run 3600 秒、单次 arguments 256 KiB、input/output/total token 65536/8192/73728、Artifact 32、最终 output 2 MiB。最终有效值还要与 Agent、RuntimeOptions 和 ResolvedCapability 逐项取更小正数。`HeartbeatSeconds` 必须小于 `RunLeaseSeconds`，否则使用两个默认值；`LeaderLeaseSeconds` 必须大于 `HeartbeatSeconds`，否则使用默认值。更新 `runtimeConfigSeed` 和 `DefaultRuntimeConfig()`，确保 Model 默认值与 Go 默认值一致。

- [ ] **Step 2: 将后台保存 hook 切到 Model helper**

在 `service/agent/setting/runtime.go` 删除 `agentruntime` import，改为：

```go
record["script_sandbox_driver"] = agentmodel.NormalizeRuntimeScriptSandboxDriver(
	util.ToStringTrimmed(record["script_sandbox_driver"]),
)
record["script_sandbox_network_mode"] = agentmodel.NormalizeRuntimeScriptSandboxNetworkMode(
	util.ToStringTrimmed(record["script_sandbox_network_mode"]),
)
```

同时规范化全部新增并发、lease 与 hard-limit 字段，并拒绝以下关系：

```text
worker_count/global_concurrency/per_agent_concurrency/per_actor_concurrency <= 0
heartbeat_seconds >= run_lease_seconds
heartbeat_seconds >= leader_lease_seconds
stream_block_milliseconds < 25 或 > 250
max_output_tokens > max_total_tokens
max_input_tokens + max_output_tokens > max_total_tokens
max_tool_arguments_bytes/max_output_bytes/max_artifacts <= 0
```

- [ ] **Step 3: 切换 Skill Draft 和 Sandbox 调用点**

在 `service/agent/skill/draft/service.go` 将：

```go
runtimeConfig := agentruntime.WithDefaults(runtimeConfig(ctx))
```

替换为：

```go
runtimeConfig := agentmodel.NormalizeRuntimeConfig(runtimeConfig(ctx))
```

在 `service/agent/sandbox/config.go` 删除本地 `runtimeConfigWithDefaults`、`normalizeScriptSandboxDriver` 和 `normalizeScriptSandboxNetworkMode`，使用：

```go
func ConfigFromRuntimeConfig(config agentmodel.RuntimeConfig) Config {
	config = agentmodel.NormalizeRuntimeConfig(config)
	return NormalizeConfig(Config{
		Driver:         config.ScriptSandboxDriver,
		BwrapPath:      config.ScriptSandboxBwrapPath,
		NetworkMode:    config.ScriptSandboxNetworkMode,
		Timeout:        time.Duration(config.ScriptSandboxTimeoutSeconds) * time.Second,
		OutputMaxBytes: config.ScriptSandboxOutputMaxBytes,
	})
}
```

- [ ] **Step 4: 格式化并静态确认 Runtime 外不再引用旧 helper**

```bash
gofmt -w model/agent/runtime_config.go service/agent/setting/runtime.go service/agent/skill/draft/service.go service/agent/sandbox/config.go
rg -n 'agentruntime\.(WithDefaults|NormalizeScriptSandbox)' service/agent/setting service/agent/skill/draft service/agent/sandbox
git diff --check -- model/agent/runtime_config.go service/agent/setting/runtime.go service/agent/skill/draft/service.go service/agent/sandbox/config.go
```

预期：`rg` 无输出；`git diff --check` 无输出。

- [ ] **Step 5: 提交配置解耦**

```bash
git add model/agent/runtime_config.go service/agent/setting/runtime.go service/agent/skill/draft/service.go service/agent/sandbox/config.go
git commit -m "refactor: centralize agent runtime config"
```

### Task 2: 增加 Agent 输出契约、挂载、能力和 leader Model

**Files:**
- Modify: `model/agent/agent.go`
- Create: `model/agent/agent_tool.go`
- Create: `model/agent/agent_power.go`
- Create: `model/agent/model_capability.go`
- Create: `model/agent/runtime_leader.go`

- [ ] **Step 1: 扩展 Agent 唯一运行配置来源**

在 `Agent` 中加入：

```go
MemoryEnabled int16  `dorm:"type:smallint;not null;default:1;comment:启用长期记忆"`
OutputType    string `dorm:"type:varchar(32);not null;default:'text';comment:输出类型"`
OutputSchema  string `dorm:"type:text;not null;default:'{}';comment:输出 JSON Schema"`
```

`OutputType` options 只能为 `text/structured/rich_document`。现有 seed 的 `memory_enabled=1`、`output_type=text`、`output_schema={}`。给 `NewAgentModel()` 增加唯一命名的 `agent_tools` 和 `agent_powers` through relation，排序分别为 `sort asc,tool_key asc` 和 `sort asc,id asc`；后续计划只能复用，不能再增加 `tools/powers` 同义 relation。

- [ ] **Step 2: 新增静态 Tool 挂载 Model**

在 `model/agent/agent_tool.go` 定义：

```go
type AgentTool struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:挂载ID"`
	AgentID   uint64    `dorm:"type:bigint;not null;default:0;comment:智能体"`
	ToolKey   string    `dorm:"type:varchar(128);not null;comment:工具标识"`
	Config    string    `dorm:"type:text;not null;default:'{}';comment:挂载配置"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
	UpdatedAt time.Time `dorm:"comment:更新时间"`
}

type AgentToolIndex struct {
	AgentTool       struct{} `unique:"agent_id,tool_key"`
	AgentStatusSort struct{} `index:"agent_id,status,sort"`
}

func NewAgentToolModel() *orm.Model[AgentTool]
```

表名固定为 `bot_agent_tool`，不写默认工具 seed；挂载数据只来自后续受审 Mount Manifest。

- [ ] **Step 3: 新增 Power 挂载 Model**

在 `model/agent/agent_power.go` 定义 `AgentPower`，字段为 `id/agent_id/power_id/config/status/sort/created_at/updated_at`，唯一索引为 `agent_id,power_id`，表名固定 `bot_agent_power`。增加到 `bot.energon.NewPowerModel` 的 relation，但 Model 不推断 Power 类型，也不自动补挂载。

- [ ] **Step 4: 新增模型能力 Model**

在 `model/agent/model_capability.go` 定义：

```go
type ModelCapability struct {
	ID                     uint64    `dorm:"primaryKey;autoIncrement;comment:能力记录ID"`
	ServiceID              uint64    `dorm:"type:bigint;not null;default:0;comment:Energon服务"`
	NativeToolCalling      int16     `dorm:"type:smallint;not null;default:2;comment:原生工具调用"`
	NativeStructuredOutput int16     `dorm:"type:smallint;not null;default:2;comment:原生结构化输出"`
	StreamToolArguments    int16     `dorm:"type:smallint;not null;default:2;comment:流式工具参数"`
	TokenCounter           string    `dorm:"type:varchar(64);not null;default:'';comment:Token计数器"`
	ContextWindowTokens    int       `dorm:"type:int;not null;default:0;comment:上下文窗口"`
	MaxOutputTokens        int       `dorm:"type:int;not null;default:0;comment:最大输出Token"`
	Status                 int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	VerifiedAt             time.Time `dorm:"comment:验证时间"`
	Source                 string    `dorm:"type:varchar(255);not null;default:'';comment:验证依据"`
	CreatedAt              time.Time `dorm:"comment:创建时间"`
	UpdatedAt              time.Time `dorm:"comment:更新时间"`
}

type ModelCapabilityIndex struct {
	Service       struct{} `unique:"service_id"`
	StatusService struct{} `index:"status,service_id"`
}
```

表名为 `bot_agent_model_capability`。本阶段不猜 Provider 能力、不写 seed；后续迁移只消费用户确认的 Energon 能力清单。

- [ ] **Step 5: 新增单活 leader Model**

在 `model/agent/runtime_leader.go` 定义单行表：

```go
const RuntimeLeaderID uint64 = 1

type RuntimeLeader struct {
	ID             uint64     `dorm:"primaryKey;comment:LeaderID"`
	LeaseOwner     string     `dorm:"type:varchar(128);not null;default:'';comment:租约持有者"`
	FencingToken   uint64     `dorm:"type:bigint;not null;default:0;comment:隔离令牌"`
	LeaseExpiresAt *time.Time `dorm:"null;comment:租约过期时间"`
	HeartbeatAt    *time.Time `dorm:"null;comment:心跳时间"`
	UpdatedAt      time.Time  `dorm:"comment:更新时间"`
}

func NewRuntimeLeaderModel() *orm.Model[RuntimeLeader]
```

表名为 `bot_agent_runtime_leader`，只 seed `id=1/fencing_token=0/lease_owner=''`。

- [ ] **Step 6: 格式化、静态检查并提交**

```bash
gofmt -w model/agent/agent.go model/agent/agent_tool.go model/agent/agent_power.go model/agent/model_capability.go model/agent/runtime_leader.go
rg -n 'bot_agent_(tool|power|model_capability|runtime_leader)' model/agent
git diff --check -- model/agent
git add model/agent/agent.go model/agent/agent_tool.go model/agent/agent_power.go model/agent/model_capability.go model/agent/runtime_leader.go
git commit -m "feat: add agent runtime mount models"
```

预期：`rg` 命中四个新表名；`git diff --check` 无输出。

### Task 3: 重建 Run 并用 Item 取代 Step

**Files:**
- Modify: `model/agent/run.go`
- Delete: `model/agent/step.go`
- Create: `model/agent/item.go`

- [ ] **Step 1: 将 Run 改成 v2 权威状态机**

用下列完整字段替换旧 `Run`：

```go
type Run struct {
	ID                  uint64     `dorm:"primaryKey;autoIncrement;comment:运行ID"`
	RequestID           string     `dorm:"type:varchar(128);not null;comment:请求ID"`
	RequestHash         string     `dorm:"type:char(64);not null;comment:规范请求哈希"`
	AgentID             uint64     `dorm:"type:bigint;not null;default:0;comment:智能体"`
	SourceType          string     `dorm:"type:varchar(32);not null;comment:来源类型"`
	SourceID            uint64     `dorm:"type:bigint;not null;default:0;comment:来源ID"`
	ParentSourceID      uint64     `dorm:"type:bigint;not null;default:0;comment:父来源ID"`
	SourceMetadata      string     `dorm:"type:text;not null;default:'{}';comment:来源元数据"`
	Status              string     `dorm:"type:varchar(32);not null;default:'queued';comment:状态"`
	Phase               string     `dorm:"type:varchar(64);not null;default:'queued';comment:阶段"`
	Input               string     `dorm:"type:text;not null;default:'[]';comment:规范输入"`
	ConfigSnapshot      string     `dorm:"type:text;not null;default:'{}';comment:配置快照"`
	ToolSnapshot        string     `dorm:"type:text;not null;default:'{}';comment:工具快照"`
	MessagesSnapshot    string     `dorm:"type:text;not null;default:'[]';comment:初始消息快照"`
	InvocationSnapshot  string     `dorm:"type:text;not null;default:'{}';comment:调用身份快照"`
	Checkpoint          string     `dorm:"type:text;not null;default:'{}';comment:恢复检查点"`
	Output              string     `dorm:"type:text;not null;default:'{}';comment:最终输出"`
	Usage               string     `dorm:"type:text;not null;default:'{}';comment:用量"`
	Error               string     `dorm:"type:text;not null;default:'{}';comment:公开错误"`
	ModelTurnCount      int        `dorm:"type:int;not null;default:0;comment:模型轮次"`
	ToolCallCount       int        `dorm:"type:int;not null;default:0;comment:工具调用数"`
	ItemCount           int        `dorm:"type:int;not null;default:0;comment:Item数量"`
	Version             uint64     `dorm:"type:bigint;not null;default:1;comment:CAS版本"`
	LeaseOwner          string     `dorm:"type:varchar(128);not null;default:'';comment:Worker租约"`
	LeaseFencingToken   uint64     `dorm:"type:bigint;not null;default:0;comment:Leader隔离令牌"`
	LeaseExpiresAt      *time.Time `dorm:"null;comment:Worker租约过期"`
	HeartbeatAt         *time.Time `dorm:"null;comment:Worker心跳"`
	ProjectionStatus    string     `dorm:"type:varchar(32);not null;default:'pending';comment:投影状态"`
	ProjectionAttempts  int        `dorm:"type:int;not null;default:0;comment:投影次数"`
	ProjectionError     string     `dorm:"type:text;not null;default:'';comment:投影错误"`
	StartedAt           *time.Time `dorm:"null;comment:开始时间"`
	WaitingAt           *time.Time `dorm:"null;comment:等待时间"`
	FinishedAt          *time.Time `dorm:"null;comment:结束时间"`
	CreatedAt           time.Time  `dorm:"comment:创建时间"`
	UpdatedAt           time.Time  `dorm:"comment:更新时间"`
}
```

索引必须包含：`unique(request_id)`、`agent_id,status,created_at`、`source_type,source_id,created_at`、`status,lease_expires_at`。状态 options 仅允许：

```text
queued running waiting_input waiting_approval interrupted completed failed canceled
```

- [ ] **Step 2: 新增 Item Model**

在 `model/agent/item.go` 定义：

```go
type Item struct {
	ID           uint64     `dorm:"primaryKey;autoIncrement;comment:ItemID"`
	RunID        uint64     `dorm:"type:bigint;not null;default:0;comment:运行"`
	Seq          int        `dorm:"type:int;not null;default:1;comment:序号"`
	ParentItemID uint64     `dorm:"type:bigint;not null;default:0;comment:父Item"`
	Type         string     `dorm:"type:varchar(32);not null;comment:类型"`
	Status       string     `dorm:"type:varchar(32);not null;default:'pending';comment:状态"`
	Role         string     `dorm:"type:varchar(32);not null;default:'';comment:消息角色"`
	CallID       string     `dorm:"type:varchar(128);not null;default:'';comment:调用ID"`
	Attempt      int        `dorm:"type:int;not null;default:1;comment:尝试次数"`
	Version      uint64     `dorm:"type:bigint;not null;default:1;comment:CAS版本"`
	Name         string     `dorm:"type:varchar(128);not null;default:'';comment:名称"`
	Content      string     `dorm:"type:text;not null;default:'[]';comment:内容块"`
	Payload      string     `dorm:"type:text;not null;default:'{}';comment:结构化载荷"`
	StartedAt    *time.Time `dorm:"null;comment:开始时间"`
	FinishedAt   *time.Time `dorm:"null;comment:结束时间"`
	CreatedAt    time.Time  `dorm:"comment:创建时间"`
	UpdatedAt    time.Time  `dorm:"comment:更新时间"`
}

type ItemIndex struct {
	RunSeq         struct{} `unique:"run_id,seq"`
	RunCallAttempt struct{} `index:"run_id,call_id,type,attempt"`
	RunStatusSeq   struct{} `index:"run_id,status,seq"`
	ParentCreated  struct{} `index:"parent_item_id,created_at"`
}
```

Item type 和 status 必须完全使用设计规格中的枚举。`run_id,call_id,type,attempt` 的幂等约束必须在迁移中建为 `WHERE call_id <> ''` 的 partial unique index；不能用普通 unique index，否则第二个 `call_id=''` 的 assistant/user/sidecar Item 会冲突。`Run` relation 从 `steps` 改为 `items -> bot.agent.NewItemModel`。

- [ ] **Step 3: 删除 Step 源码并检查 Runtime Model 边界**

删除 `model/agent/step.go`。本阶段不修改仍引用 `NewStepModel` 的 Maintenance/页面文件，因为它们属于后续调用方切换；执行边界已明确该分支不可启动。

- [ ] **Step 4: 格式化、静态审阅并提交**

```bash
gofmt -w model/agent/run.go model/agent/item.go
rg -n 'NewStepModel|type Step struct' model/agent
rg -n 'queued|waiting_input|waiting_approval|interrupted|completed|failed|canceled' model/agent/run.go
git diff --check -- model/agent/run.go model/agent/item.go model/agent/step.go
git add model/agent/run.go model/agent/item.go model/agent/step.go
git commit -m "feat: rebuild agent run item models"
```

预期：第一个 `rg` 无输出；第二个 `rg` 命中全部 v2 状态；`git diff --check` 无输出。

### Task 4: 删除旧 Runtime，建立 dependency-neutral core 和公共 alias

**Files:**
- Delete: `service/agent/runtime/assistant_sync.go`
- Delete: `service/agent/runtime/body.go`
- Delete: `service/agent/runtime/config.go`
- Delete: `service/agent/runtime/deps.go`
- Delete: `service/agent/runtime/hooks.go`
- Delete: `service/agent/runtime/lifecycle.go`
- Delete: `service/agent/runtime/main.go`
- Delete: `service/agent/runtime/policy.go`
- Delete: `service/agent/runtime/profile.go`
- Delete: `service/agent/runtime/reference.go`
- Delete: `service/agent/runtime/repo.go`
- Delete: `service/agent/runtime/request.go`
- Delete: `service/agent/runtime/request_context.go`
- Delete: `service/agent/runtime/runner.go`
- Delete: `service/agent/runtime/trace.go`
- Delete: `service/agent/runtime/view.go`
- Delete: `service/agent/runtime/chat/**`
- Delete: `service/agent/runtime/context/**`
- Delete: `service/agent/runtime/result/**`
- Delete: `service/agent/runtime/stream/**`
- Delete: `service/agent/runtime/tool/**`
- Create: `service/agent/runtime/core/content.go`
- Create: `service/agent/runtime/core/request.go`
- Create: `service/agent/runtime/core/run.go`
- Create: `service/agent/runtime/core/item.go`
- Create: `service/agent/runtime/core/output.go`
- Create: `service/agent/runtime/core/event.go`
- Create: `service/agent/runtime/core/model.go`
- Create: `service/agent/runtime/core/source.go`
- Create: `service/agent/runtime/core/error.go`
- Create: `service/agent/runtime/core/canonical.go`
- Create: `service/agent/runtime/types.go`
- Create: `service/agent/runtime/errors.go`

- [ ] **Step 1: 删除旧 Runtime 实现**

只删除本任务 Files 中列出的旧目录和文件。确认 `service/agent/runtime` 下只剩随后创建的 v2 文件；不保留 Profile、JSON Tool fallback、旧 stream writer、Trace/Step 或 Assistant 双写代码。

- [ ] **Step 2: 定义 ContentBlock、Message 和 Output wire types**

`core/content.go` 定义与 TypeScript wire protocol 同构、由 `type` 严格判别的内容和消息：

```go
type InteractionOption struct {
	ID    string `json:"id"`
	Label string `json:"label"`
	Value string `json:"value"`
}

type InteractionField struct {
	Key      string              `json:"key"`
	Label    string              `json:"label"`
	Type     string              `json:"type"`
	Required bool                `json:"required"`
	Options  []InteractionOption `json:"options,omitempty"`
}

type ContentBlock struct {
	Type          string             `json:"type"`
	Text          string             `json:"text,omitempty"`
	ArtifactID    string             `json:"artifact_id,omitempty"`
	URL           string             `json:"url,omitempty"`
	MimeType      string             `json:"mime_type,omitempty"`
	Alt           string             `json:"alt,omitempty"`
	Name          string             `json:"name,omitempty"`
	ID            string             `json:"id,omitempty"`
	Arguments     json.RawMessage    `json:"arguments,omitempty"`
	ToolCallID    string             `json:"tool_call_id,omitempty"`
	Content       []ContentBlock     `json:"content,omitempty"`
	Structured    json.RawMessage    `json:"structured,omitempty"`
	IsError       bool               `json:"is_error"`
	Kind          string             `json:"kind,omitempty"`
	Title         string             `json:"title,omitempty"`
	InteractionID string             `json:"interaction_id,omitempty"`
	Fields        []InteractionField `json:"fields,omitempty"`
	Status        string             `json:"status,omitempty"`
}

type ToolCall struct {
	ID        string          `json:"id"`
	Name      string          `json:"name"`
	Arguments json.RawMessage `json:"arguments"`
}

type Message struct {
	Role   string         `json:"role"`
	Blocks []ContentBlock `json:"blocks"`
}
```

`ContentBlock.Type` 只允许 `text/image/file/tool_call/tool_result/artifact_ref/interaction`；`ValidateContentBlock` 按 type 拒绝互斥字段和缺少的必填字段。Message.Role 只允许 `user/assistant/tool`：tool message 只能含 tool_result，assistant 的 tool_call 必须由后续 tool message 同 ID 配对，system prompt 不伪装成历史 Message。由于 `tool_result.is_error=false` 也必须显式出现在 wire，而其它 block 又不得带该字段，`ContentBlock` 必须实现按 Type 分派的 `MarshalJSON/UnmarshalJSON`（或等价的私有 concrete wire structs）；不能直接依赖上面宽 struct 的默认编码。`tool_call.arguments` 与 `tool_result.structured` 必须是 object，`tool_result.content` 递归验证且以 `tool_call_id` 配对，Interaction field type 只允许 `text/textarea/select/option/multi_option`。`ToolCall` 只是 Loop/Policy 使用的解析视图，由完整 `tool_call` block 确定性转换，不能形成第二套持久协议。`core/output.go` 定义：

```go
type OutputContract struct {
	Type    string         `json:"type"`
	Schema  json.RawMessage `json:"schema,omitempty"`
	Options map[string]any `json:"options,omitempty"`
}

type ArtifactRef struct {
	ID         string       `json:"id"`
	RunID      uint64       `json:"run_id"`
	ItemID     uint64       `json:"item_id"`
	Kind       string       `json:"kind"`
	Status     string       `json:"status"`
	URL        string       `json:"url,omitempty"`
	StorageRef string       `json:"storage_ref,omitempty"`
	AssetID    uint64       `json:"asset_id,omitempty"`
	VersionID  uint64       `json:"version_id,omitempty"`
	MimeType   string       `json:"mime_type,omitempty"`
	Title      string       `json:"title,omitempty"`
	Error      *PublicError `json:"error,omitempty"`
}

type Citation struct {
	Title    string `json:"title"`
	URL      string `json:"url,omitempty"`
	SourceID string `json:"source_id,omitempty"`
}

type OutputEnvelope struct {
	Type        string          `json:"type"`
	Text        string          `json:"text"`
	Data        json.RawMessage `json:"data,omitempty"`
	RichJSON    json.RawMessage `json:"rich_json,omitempty"`
	Artifacts   []ArtifactRef   `json:"artifacts"`
	Citations   []Citation      `json:"citations"`
	Suggestions []Suggestion    `json:"suggestions"`
}
```

JSON tag 使用 snake_case；空集合编码为 `[]`，不能编码为 `null`。

- [ ] **Step 3: 定义 ExecuteRequest、RunSource 和 InvocationContext**

在 `core/request.go` 定义唯一请求契约：

```go
type AgentRef struct {
	ID  uint64 `json:"id,omitempty"`
	Key string `json:"key,omitempty"`
}

type RuntimeOptions struct {
	Trace                bool       `json:"trace,omitempty"`
	DeadlineAt           *time.Time `json:"deadline_at,omitempty"`
	MaxModelTurns        int        `json:"max_model_turns,omitempty"`
	MaxToolCalls         int        `json:"max_tool_calls,omitempty"`
	MaxOutputTokens      int        `json:"max_output_tokens,omitempty"`
	DisableParallelTools bool       `json:"disable_parallel_tools,omitempty"`
}

type RunSource struct {
	Type     string         `json:"type"`
	ID       uint64         `json:"id"`
	ParentID uint64         `json:"parent_id,omitempty"`
	Metadata map[string]any `json:"metadata,omitempty"`
}

type ExecuteRequest struct {
	RequestID  string            `json:"request_id"`
	Agent      AgentRef          `json:"agent"`
	Input      []ContentBlock    `json:"input"`
	Messages   []Message         `json:"messages,omitempty"`
	Source     RunSource         `json:"source"`
	Invocation InvocationContext `json:"invocation"`
	Output     OutputContract    `json:"output"`
	Options    RuntimeOptions    `json:"options"`
}

type RunRef struct {
	ID        uint64 `json:"id,omitempty"`
	RequestID string `json:"request_id,omitempty"`
}

type RunAccessRequest struct {
	RunRef
	ActorType string
	ActorID   uint64
	TenantID  uint64
	Site      string
	Admin     bool
}

type ResumeRequest struct {
	RunID                  uint64            `json:"run_id"`
	ItemID                 uint64            `json:"item_id,omitempty"`
	CallID                 string            `json:"call_id,omitempty"`
	Action                 string            `json:"action"`
	Answer                 map[string]any    `json:"answer,omitempty"`
	IdempotencyKey         string            `json:"idempotency_key"`
	ExternalIdempotencyKey string            `json:"external_idempotency_key,omitempty"`
	Invocation             InvocationContext `json:"invocation"`
}
```

`RunSource.Type` 只允许 `chat/debug/team/project/skill/internal`；`RunRef` 至少提供 ID 或 RequestID，同时提供时必须指向同一 Run。`ExecuteRequest.Input` 只允许当前 user 输入的 text/image/file，tool_call/tool_result/interaction 只能出现在服务端构造并已配对验证的 Messages 中。`InvocationContext` 只含：

```go
type InvocationContext struct {
	ActorType      string
	ActorID        uint64
	TenantID       uint64
	Site           string
	Locale         string
	Timezone       string
	Page           string
	WorkspaceID    uint64
	ResourceScopes []string
	FrontActions   []string
	FieldPaths     []string
	KnowledgeIDs   []uint64
	SkillIDs       []uint64
	PowerIDs       []uint64
	PageContext    json.RawMessage
	ArtifactScope  ArtifactScope
}

type ArtifactScope struct {
	ProjectID   uint64
	BodyID      uint64
	TeamID      uint64
	FlowID      uint64
	AssetCateID uint64
	RequireAsset bool
}
```

`PageContext` 必须是 API/内部调用方完成字段 allowlist、大小预算与 secret redaction 后的 canonical JSON object，作为本 Run 冻结页面事实写入 request hash 和 Invocation snapshot；它不是权限来源。ContextBuilder 只把它放动态后缀。`ArtifactScope` 只由 server-owned Project/Team adapter 填充，并与 Actor/resource scope 交叉校验；普通 HTTP Start/Chat 不能自由指定。其余字段不定义 Cookie、Authorization、Header 或任意 secret。

- [ ] **Step 4: 定义 Run、Item、Usage、Checkpoint 和状态转换表**

`core/run.go` 定义：

```go
type RunHandle struct {
	ProtocolVersion string `json:"protocol_version"`
	RunID           uint64 `json:"run_id"`
	RequestID       string `json:"request_id"`
	Status          string `json:"status"`
	StreamCursor    string `json:"stream_cursor"`
}

type Usage struct {
	InputTokens     int64   `json:"input_tokens"`
	OutputTokens    int64   `json:"output_tokens"`
	CachedTokens    int64   `json:"cached_tokens"`
	ReasoningTokens int64   `json:"reasoning_tokens"`
	ModelTurns      int     `json:"model_turns"`
	ToolCalls       int     `json:"tool_calls"`
	Compactions     int     `json:"compactions"`
	Cost            float64 `json:"cost"`
	QueueMS         int64   `json:"queue_ms"`
	ContextMS       int64   `json:"context_ms"`
	ModelRequestMS  int64   `json:"model_request_ms"`
	FirstModelEventMS int64 `json:"first_model_event_ms"`
	FirstVisibleTextMS int64 `json:"first_visible_text_ms"`
	ModelTotalMS    int64   `json:"model_total_ms"`
	ToolWaitMS      int64   `json:"tool_wait_ms"`
	OutputFinalizeMS int64  `json:"output_finalize_ms"`
	TotalMS         int64   `json:"total_ms"`
}

type RunPublic struct {
	ID               uint64          `json:"id"`
	AgentID          uint64          `json:"agent_id"`
	RequestID        string          `json:"request_id"`
	SourceType       string          `json:"source_type"`
	SourceID         uint64          `json:"source_id"`
	ParentSourceID   uint64          `json:"parent_source_id"`
	Status           string          `json:"status"`
	Phase            string          `json:"phase"`
	Version          uint64          `json:"version"`
	Output           *OutputEnvelope `json:"output,omitempty"`
	Usage            Usage           `json:"usage"`
	Error            *PublicError    `json:"error,omitempty"`
	ResumeRequired   bool            `json:"resume_required"`
	CreatedAt        time.Time       `json:"created_at"`
	UpdatedAt        time.Time       `json:"updated_at"`
}

type RunView struct {
	ProtocolVersion string    `json:"protocol_version"`
	Run          RunPublic `json:"run"`
	Items        []ItemView `json:"items"`
	ResumeCursor string     `json:"resume_cursor"`
	SnapshotAt   time.Time  `json:"snapshot_at"`
}

type Run struct {
	RunPublic
	Source RunSource `json:"-"`
}

type RunResult struct {
	RunID          uint64          `json:"run_id"`
	RunVersion     uint64          `json:"run_version"`
	RequestID      string          `json:"request_id"`
	Status         string          `json:"status"`
	Output         *OutputEnvelope `json:"output,omitempty"`
	Usage          Usage           `json:"usage"`
	Error          *PublicError    `json:"error,omitempty"`
	ResumeRequired bool            `json:"resume_required"`
}
```

Checkpoint 在 core 阶段使用完整固定结构：

```go
type Checkpoint struct {
	Messages          []Message `json:"messages"`
	NextModelTurn     int       `json:"next_model_turn"`
	AssistantItemID   uint64    `json:"assistant_item_id"`
	AssistantVersion  uint64    `json:"assistant_version"`
	VisibleTextOffset int       `json:"visible_text_offset"`
	LastSafeItemSeq   int       `json:"last_safe_item_seq"`
	ResumeReceipts    []ResumeReceipt `json:"resume_receipts"`
}

type ResumeReceipt struct {
	KeyHash     string `json:"key_hash"`
	RequestHash string `json:"request_hash"`
	Action      string `json:"action"`
	ItemID      uint64 `json:"item_id,omitempty"`
	CallID      string `json:"call_id,omitempty"`
	RunVersion  uint64 `json:"run_version"`
	Status      string `json:"status"`
}
```

`ResumeReceipts` 最多受 `MaxToolCalls + MaxModelTurns` 限制，按写入顺序保存；只保存 idempotency key 的 SHA-256 与 canonical ResumeRequest hash，不保存 raw answer、ExternalIdempotencyKey 或 Invocation。相同 key/hash 返回当前同一 Run 的 Handle，相同 key/不同 hash 返回 `resume_conflict`。

`core/item.go` 定义 `ItemView` 和严格 `ItemPayload` 判别结构：

```go
type ItemView struct {
	ID           uint64       `json:"id"`
	RunID        uint64       `json:"run_id"`
	ParentItemID uint64       `json:"parent_item_id"`
	Seq          int          `json:"seq"`
	Type         string       `json:"type"`
	Status       string       `json:"status"`
	Role         string       `json:"role"`
	CallID       string       `json:"call_id"`
	Name         string       `json:"name"`
	Attempt      int          `json:"attempt"`
	Version      uint64       `json:"version"`
	Content      []ContentBlock `json:"content"`
	Payload      ItemPayload  `json:"payload"`
	StartedAt    *time.Time   `json:"started_at,omitempty"`
	FinishedAt   *time.Time   `json:"finished_at,omitempty"`
	CreatedAt    time.Time    `json:"created_at"`
}

type ItemPayload interface {
	isItemPayload()
}

type MessageItemPayload struct {
	Partial       bool `json:"partial"`
	ContentOffset int  `json:"content_offset"`
}

type ResolvedCallPolicy struct {
	ReadOnly                    bool   `json:"read_only"`
	SideEffect                  bool   `json:"side_effect"`
	ParallelSafe                bool   `json:"parallel_safe"`
	Idempotent                  bool   `json:"idempotent"`
	Approval                    string `json:"approval"`
	CanSuspend                  bool   `json:"can_suspend"`
	SupportsExternalIdempotency bool   `json:"supports_external_idempotency"`
	CapabilityKey               string `json:"capability_key,omitempty"`
	PolicyVersion               string `json:"policy_version"`
	TimeoutMS                   int64  `json:"timeout_ms"`
	MaxAttempts                 int    `json:"max_attempts"`
	RetryBackoffMS              int64  `json:"retry_backoff_ms"`
	RetryableCodes              []string `json:"retryable_codes"`
}

type ToolCallItemPayload struct {
	Arguments       json.RawMessage    `json:"arguments"`
	ArgumentsDigest string             `json:"arguments_digest"`
	Policy          ResolvedCallPolicy `json:"policy"`
}

type ToolResultItemPayload struct {
	Structured   json.RawMessage `json:"structured,omitempty"`
	Presentation json.RawMessage `json:"presentation,omitempty"`
	IsError      bool            `json:"is_error"`
	Error        *PublicError    `json:"error,omitempty"`
}

type ArtifactItemPayload ArtifactRef

type SuggestionItemPayload struct {
	Suggestions []Suggestion `json:"suggestions"`
}

type ErrorItemPayload struct {
	Error PublicError `json:"error"`
}

type InteractionItemPayload struct {
	InteractionID string             `json:"interaction_id"`
	Title         string             `json:"title"`
	Fields        []InteractionField `json:"fields"`
	ExpiresAt     time.Time          `json:"expires_at"`
}

type ApprovalItemPayload struct {
	Kind       string            `json:"kind"`
	BatchID    string            `json:"batch_id"`
	CallIDs    []string          `json:"call_ids"`
	Decisions  map[string]string `json:"decisions"`
	ExpiresAt  time.Time         `json:"expires_at"`
	ToolItemID uint64            `json:"tool_item_id,omitempty"`
}

type Suggestion struct {
	ID    string `json:"id"`
	Label string `json:"label"`
	Value string `json:"value"`
}

type FrontActionPayload struct {
	Action string         `json:"action"`
	Target string         `json:"target"`
	Values map[string]any `json:"values"`
	Reason string         `json:"reason"`
	Status string         `json:"status"`
}

type CompactionPayload struct {
	FromSeq    int             `json:"from_seq"`
	ToSeq      int             `json:"to_seq"`
	Summary    json.RawMessage `json:"summary"`
	SourceHash string          `json:"source_hash"`
}
```

每个 concrete payload 在 `core` 内实现未导出的 `isItemPayload()` marker；`artifact` 使用 `ArtifactItemPayload`，`suggestion` 使用 `SuggestionItemPayload`，`warning/error` 使用 `ErrorItemPayload`。Store decoder 必须先读 Item.type，再把 payload JSON 解成唯一 concrete 类型；encoding/json 因 interface 中保存 concrete value，公开 `payload` 直接编码为 `{partial:...}`、`{arguments:...}` 等结构，绝不能出现 `{message:{...}}` 包装。`ValidateItemPayload(type,payload)` 用 type switch 要求 Item.type 与 concrete payload 精确对应，不能把未知结构交给前端猜测。状态转换只允许：

```go
var AllowedRunTransitions = map[string]map[string]struct{}{
	"queued":            {"running": {}, "interrupted": {}, "canceled": {}, "failed": {}},
	"running":           {"waiting_input": {}, "waiting_approval": {}, "completed": {}, "failed": {}, "canceled": {}, "interrupted": {}},
	"waiting_input":     {"queued": {}, "failed": {}, "canceled": {}},
	"waiting_approval":  {"queued": {}, "failed": {}, "canceled": {}},
	"interrupted":       {"queued": {}, "canceled": {}},
	"completed":         {},
	"failed":            {},
	"canceled":          {},
}
```

增加 `IsLifecycleTerminal`、`IsResting`、`CanTransition` 三个纯函数。

- [ ] **Step 5: 定义 ModelEvent、StreamEvent 和 Source ports**

`core/model.go` 定义：

```go
type ModelEvent struct {
	Type       string
	Text       string
	CallID     string
	ToolName   string
	Arguments  string
	Usage      Usage
	FinishReason string
	Error      *PublicError
}

type ToolDefinition struct {
	Name        string          `json:"name"`
	Description string          `json:"description"`
	InputSchema json.RawMessage `json:"input_schema"`
}

type ModelRequest struct {
	RequestID      string
	AgentID        uint64
	PowerKey       string
	SourceTargetID uint64
	SystemPrompt   string
	Input          []ContentBlock
	Messages       []Message
	Tools          []ToolDefinition
	Output         OutputContract
	Temperature    float64
	MaxOutputTokens int
	ParallelTools  bool
}

type ModelResponse struct {
	Message      Message
	ToolCalls    []ToolCall
	Usage        Usage
	FinishReason string
}

type EventData struct {
	Run          *RunPublic        `json:"run,omitempty"`
	Item         *ItemView         `json:"item,omitempty"`
	Output       *OutputEnvelope   `json:"output,omitempty"`
	Error        *PublicError      `json:"error,omitempty"`
	Text         string            `json:"text,omitempty"`
	StartOffset  *int              `json:"start_offset,omitempty"`
	EndOffset    *int              `json:"end_offset,omitempty"`
	CallID       string            `json:"call_id,omitempty"`
	Name         string            `json:"name,omitempty"`
	Progress     *float64          `json:"progress,omitempty"`
	Message      string            `json:"message,omitempty"`
	Artifact     *ArtifactRef      `json:"artifact,omitempty"`
	Usage        *Usage            `json:"usage,omitempty"`
	RunVersion   uint64            `json:"run_version,omitempty"`
	ItemVersions map[string]uint64 `json:"item_versions,omitempty"`
}

type StreamEvent struct {
	Version     string    `json:"version"`
	EventID    string    `json:"event_id"`
	RunID      uint64    `json:"run_id"`
	RequestID  string    `json:"request_id"`
	RunVersion uint64    `json:"run_version"`
	ItemID     uint64    `json:"item_id,omitempty"`
	ItemVersion uint64   `json:"item_version,omitempty"`
	Type        string    `json:"type"`
	Timestamp   time.Time `json:"timestamp"`
	Data        EventData `json:"data"`
}
```

`core/event.go` 定义协议版本常量 `agent-runtime/v2`。事件 type 只允许规格中的 `run.started/run.status/item.started/item.updated/content.delta/tool.*/interaction.*/approval.*/artifact.*/suggestion.ready/front_action.ready/usage.updated/snapshot.barrier/run.waiting/run.completed/run.failed/run.canceled/run.interrupted`。`ValidateStreamEvent` 按 type 要求 EventData 中恰好出现对应字段，并要求所有事件有 run_version、所有 Item 事件有 item_id/item_version；`event_id` 只由 Stream 写入后补齐。`core/source.go` 定义：

```go
type RunProjector interface {
	OnCreated(context.Context, Run) error
	OnResting(context.Context, Run, *Item) error
	OnTerminal(context.Context, RunResult) error
}

type EventSink interface {
	Emit(context.Context, RunSource, StreamEvent) error
}

type SourceAdapter struct {
	Projector RunProjector
	Sink      EventSink
}

type SourceRouter interface {
	Projector(RunSource) RunProjector
	EventSink(RunSource) EventSink
}
```

内部 `Run` 嵌入 `RunPublic` 并额外携带脱敏后的 `RunSource`，只传给 Projector/EventSink，永不进入公开 RunView/Event；`Item` 使用 `type Item = ItemView`。根包同时 alias `Run`、`Item`。实现 `NoopProjector`、`NoopEventSink` 和只接受 `chat/debug/team/project/skill/internal` 的 `StaticSourceRouter`；提供 `NewStaticSourceRouter(map[string]SourceAdapter) (SourceRouter, error)`，构造时深复制并冻结，运行期间不可再注册。Sink 必须显式接收该 RunSource，Team/Project 镜像不能从公开 Event 猜 `stream_request_id`。

- [ ] **Step 6: 定义公开错误和 canonical request hash**

`core/error.go` 定义唯一公开错误形状和内部 cause wrapper：

```go
type PublicError struct {
	Code      string `json:"code"`
	Message   string `json:"message"`
	Retryable bool   `json:"retryable"`
	RunID     uint64 `json:"run_id,omitempty"`
	ItemID    uint64 `json:"item_id,omitempty"`
	CallID    string `json:"call_id,omitempty"`
}

type RuntimeError struct {
	Public PublicError
	Cause  error
}
```

`RuntimeError.Cause` 只进入脱敏日志，绝不 JSON 序列化。公开错误码只允许规格中的值：

```text
invalid_input agent_not_found agent_disabled model_unavailable
model_tool_unsupported model_capability_unknown model_stream_failed
model_protocol_error context_overflow run_ref_conflict request_id_conflict
projection_unavailable session_run_active tool_not_found tool_name_conflict
tool_invalid_arguments tool_denied tool_timeout tool_failed tool_snapshot_unavailable interaction_expired
approval_expired resume_conflict side_effect_uncertain noninteractive_tool_blocked
output_validation_failed run_timeout run_canceled run_interrupted internal_error
```

`ErrLeaseLost`、`ErrLeaderUnavailable` 和 `ErrRunNotResumable` 是 Store/Coordinator 内部 sentinel，不进入 `PublicError.Code`；边界 mapper 按当前 Run 状态映射到上面的公开码。

`core/canonical.go` 实现 `CanonicalRequestHash(ExecuteRequest) (string, error)`：递归排序 object key，统一 CRLF，规范 JSON number，保留数组顺序；`Invocation.PageContext` 必须先解成 JSON object 再参与 canonical 化，不能把 RawMessage 当 byte slice/base64；排除 RequestID、时间戳和运行时生成快照。禁止用 `fmt.Sprint(map)` 计算 hash。

- [ ] **Step 7: 在根包公开 type alias**

`runtime/types.go` 只做稳定 alias，例如：

```go
type ExecuteRequest = core.ExecuteRequest
type ResumeRequest = core.ResumeRequest
type RunRef = core.RunRef
type RunHandle = core.RunHandle
type Run = core.Run
type Item = core.Item
type RunView = core.RunView
type RunResult = core.RunResult
type StreamEvent = core.StreamEvent
type ContentBlock = core.ContentBlock
type Message = core.Message
type OutputContract = core.OutputContract
```

`runtime/errors.go` 公开错误码 alias；不得复制第二套值。

- [ ] **Step 8: 格式化、扫描旧结构并提交**

```bash
gofmt -w service/agent/runtime/core service/agent/runtime/types.go service/agent/runtime/errors.go
rg -n 'ProfileAgentChat|runJSONFallbackTurn|syncAssistantRun|NewStepModel' service/agent/runtime
rg -n 'agent-runtime/v2' service/agent/runtime/core
git diff --check -- service/agent/runtime
git add -A service/agent/runtime
git commit -m "refactor: replace legacy runtime contracts"
```

预期：第一个 `rg` 无输出；第二个命中协议常量；`git diff --check` 无输出。此提交以后分支不可启动，直到后续调用方切换计划完成。

### Task 5: 实现 Run/Item Store、幂等创建和 CAS

**Files:**
- Create: `service/agent/runtime/store/repository.go`
- Create: `service/agent/runtime/store/codec.go`
- Create: `service/agent/runtime/store/run.go`
- Create: `service/agent/runtime/store/item.go`
- Create: `service/agent/runtime/store/transition.go`

- [ ] **Step 1: 定义无循环依赖的 Repository 接口**

在 `store/repository.go` 定义：

```go
type Repository interface {
	FindAgent(context.Context, core.AgentRef) (agentmodel.Agent, error)
	FindRuntimeConfig(context.Context) (agentmodel.RuntimeConfig, error)
	ListAgentTools(context.Context, uint64) ([]agentmodel.AgentTool, error)
	ListAgentPowers(context.Context, uint64) ([]agentmodel.AgentPower, error)
	FindPower(context.Context, uint64) (energonmodel.Power, error)
	ListPowerTargets(context.Context, uint64) ([]energonmodel.PowerTarget, error)
	FindModelCapability(context.Context, uint64) (agentmodel.ModelCapability, error)
	CreateOrGetRun(context.Context, CreateRunInput) (agentmodel.Run, bool, error)
	FindRun(context.Context, core.RunRef) (agentmodel.Run, error)
	ListItems(context.Context, uint64) ([]agentmodel.Item, error)
	ReadRunSnapshot(context.Context, core.RunRef) (agentmodel.Run, []agentmodel.Item, error)
	AppendItem(context.Context, AppendItemInput) (agentmodel.Item, error)
	UpdateItem(context.Context, UpdateItemInput) (agentmodel.Item, error)
	TransitionRun(context.Context, TransitionInput) (agentmodel.Run, error)
	UpdateRunProjection(context.Context, ProjectionInput) (agentmodel.Run, error)
	SaveCheckpoint(context.Context, CheckpointInput) (agentmodel.Run, error)
	ClaimRun(context.Context, ClaimInput) (agentmodel.Run, error)
	HeartbeatRun(context.Context, HeartbeatInput) error
	ReleaseRunLease(context.Context, ReleaseLeaseInput) error
	ListQueuedRunIDs(context.Context, int) ([]uint64, error)
	ListExpiredRunningRuns(context.Context, time.Time, int) ([]agentmodel.Run, error)
	HasUnsettledSideEffect(context.Context, uint64) (bool, error)
}
```

所有 input 都必须显式包含需要的 `run_id/current_status/version/lease_owner/fencing_token`；不接受任意 `map[string]any` 从 Engine 穿透到 Store。`ListQueuedRunIDs` 只返回 `projection_status=ready` 的 Run，避免投影失败的 Chat Run 被 scanner 提前执行。

- [ ] **Step 2: 实现 JSON codec 和公开 Model mapper**

`store/codec.go` 提供严格 `encodeJSON/decodeJSON`，空数组和空对象使用调用方给定默认值；实现：

```go
func RunPublic(row agentmodel.Run) (core.RunPublic, error)
func RunDomain(row agentmodel.Run) (core.Run, error)
func ItemView(row agentmodel.Item) (core.ItemView, error)
```

`RunDomain` 只给 Projector/Engine，解码已脱敏 `source_metadata`；`RunPublic` 永不包含 Metadata。任一权威 JSON 字段损坏都返回 `internal_error`，不把原始字符串透给前端。

- [ ] **Step 3: 实现 request_id 原子 get-or-create**

`CreateOrGetRun` 先计算好的 `RequestHash` 入库，依赖 `request_id` 唯一索引处理并发：

```text
Insert 成功                    -> created=true
唯一索引冲突且 hash 相同       -> 读取既有 Run，created=false
唯一索引冲突且 hash 不同       -> request_id_conflict
其他数据库错误                 -> internal_error
```

不得使用“先 Find 再 Insert”作为唯一保护。初始状态固定 `queued/version=1/phase=queued`，同时在事务中插入 `user_message` Item，并更新 `item_count`。

- [ ] **Step 4: 实现 Run 状态 CAS**

`store/transition.go` 必须先调用 `core.CanTransition`，再按以下过滤条件 Update：

```go
filter := map[string]any{
	"id":      input.RunID,
	"status":  input.From,
	"version": input.Version,
}
```

更新必须 `version = version + 1`。ORM 不支持表达原子自增时，在 `orm.Transaction` 内读取、以旧 version 过滤更新并重新读取；受影响行数为 0 返回内部 `ErrLeaseLost` 或 `ErrRunNotResumable`，不能无条件覆盖。

- [ ] **Step 5: 实现 Item seq 与 Item version CAS**

`AppendItem` 在 `orm.Transaction` 内锁定或 CAS 更新 Run 的 `item_count/version`，使用新 `item_count` 作为 seq 后插入 Item。`UpdateItem` 必须以 `id/run_id/version` 过滤并递增 version。Tool Item 的 `call_id/type/attempt` 唯一冲突返回已存在 Item，仅当内容摘要一致；摘要不一致返回 `internal_error`。

Parent 规则固定：user/assistant message 和 compaction 可为 run-level `parent_item_id=0`；同一模型 turn 创建的 tool_call/interaction/approval/suggestion/front_action/warning/error 以该 assistant_message 为 parent；tool_result 以对应 tool_call 为 parent；由工具产生的 Artifact 以 tool_call 为 parent。任何 parent 必须属于同 Run 且 seq 更小，禁止环。无法合理归属的系统 Error 允许 parent=0，但前端必须显示在 run-level timeline，不能静默丢弃。

- [ ] **Step 6: 实现 checkpoint 和 claim fencing**

`SaveCheckpoint/ClaimRun` 必须验证 `lease_owner + lease_fencing_token + version` 并返回新的 Run/version。`HeartbeatRun/ReleaseRunLease` 只按 `id + running/resting status + lease_owner + lease_fencing_token` 更新 lease/heartbeat 字段，不递增业务 version，避免心跳与 Item commit 制造伪冲突；它们仍不得绕过 fencing token。`ClaimRun` 只允许 `queued -> running`，首次 claim 写 `started_at`，后续 Resume 不覆盖。失去 owner 或 fencing token 一律返回内部 `ErrLeaseLost`。

- [ ] **Step 7: 格式化、静态检查并提交**

```bash
gofmt -w service/agent/runtime/store
rg -n 'map\[string\]any' service/agent/runtime/store/repository.go
rg -n 'request_id_conflict|ErrLeaseLost|CanTransition' service/agent/runtime/store
git diff --check -- service/agent/runtime/store
git add service/agent/runtime/store
git commit -m "feat: add runtime persistence store"
```

预期：接口文件不以任意 map 作为 Engine 输入；错误码和转换检查均有命中；`git diff --check` 无输出。

### Task 6: 实现 leader lease、Run gate 和有界 Coordinator

**Files:**
- Create: `service/agent/runtime/store/leader.go`
- Create: `service/agent/runtime/engine/config.go`
- Create: `service/agent/runtime/engine/gate.go`
- Create: `service/agent/runtime/engine/ports.go`
- Create: `service/agent/runtime/engine/lease.go`
- Create: `service/agent/runtime/engine/worker.go`
- Create: `service/agent/runtime/engine/coordinator.go`
- Create: `service/agent/runtime/engine/state.go`

- [ ] **Step 1: 扩展 Store 的 leader lease 接口**

给 Repository 增加：

```go
AcquireLeader(context.Context, AcquireLeaderInput) (LeaderLease, error)
RenewLeader(context.Context, RenewLeaderInput) (LeaderLease, error)
ReleaseLeader(context.Context, LeaderLease) error
```

`AcquireLeader` 在事务中读取 `id=1`，只允许当前 owner 或 `lease_expires_at < now` 的实例以旧 `fencing_token` 条件更新；成功后 token 加一。`RenewLeader` 必须同时匹配 owner 和 token。第二实例不能获取时返回内部 `ErrLeaderUnavailable`。

- [ ] **Step 2: 实现 per-run CommitGate**

`engine/gate.go` 定义：

```go
type CommitGate interface {
	WithRun(context.Context, uint64, func() error) error
}
```

实现按 run_id 延迟创建的 keyed mutex；记录 waiter 数，最后一个 waiter 离开后删除 key，避免长期内存增长。Item commit、Run transition、生命周期事件和 snapshot 都使用同一 gate。

- [ ] **Step 3: 定义 Worker Runner 端口和 Coordinator**

```go
type Runner interface {
	Run(context.Context, ClaimedRun) core.RunResult
}

type EventEmitter interface {
	Emit(context.Context, core.RunSource, core.StreamEvent) (string, error)
}

type LifecycleObserver interface {
	OnResting(context.Context, core.Run, *core.Item) error
	OnTerminal(context.Context, core.RunResult) error
}

type Coordinator struct {
	store      store.Repository
	runner     Runner
	gate       CommitGate
	config     Config
	owner      string
	lease      store.LeaderLease
	queue      chan uint64
	stop       context.CancelFunc
	wg         sync.WaitGroup
}
```

`state.go` 维护受锁的 bounded `in_queue` set，Enqueue 对同 run_id 幂等，Worker pop 时删除，scanner 重扫不能填满重复 ID。`Config` 只从 `agentmodel.NormalizeRuntimeConfig` 映射 Worker、并发、lease、heartbeat 和 scan 时长。`engine/ports.go` 中的 EventEmitter 让 Engine 只依赖 core，不 import runtime/event；LifecycleObserver 由 Coordinator restart audit 与 Loop 注入同一个 root implementation，Engine 不直接拼 Projector 重试逻辑。

- [ ] **Step 4: 实现 Start 和单活 leader 行为**

`Coordinator.Start(ctx)` 必须按无竞态顺序：获取 leader lease → 启动 leader heartbeat → 在 Worker/queue scanner 尚未可见 queued Run 时完成一次 restart audit → 启动固定数量 Worker → 启动 queue scanner。不得先让 Worker claim 再把同一批启动前 queued Run 改为 interrupted。任一步失败都取消已启动 goroutine、等待 WaitGroup 并释放 lease。`Health()` 返回 `protocol_version/leader/owner/fencing_token/worker_count/queue_depth`。

- [ ] **Step 5: 实现并发限制和 Run claim**

Worker 从有界 channel 取 run_id；在 claim 前按全局 → Agent → Actor 固定顺序做 non-blocking/短超时 acquire。Actor key 从已持久化 `InvocationSnapshot` 的 `actor_type:actor_id` 得到。任一局部限额繁忙时释放已取 permit，把 run_id 有界退避后交回 scanner/requeue，不能让全部 Worker 阻塞在同一 Actor 导致其它 Session 饥饿；不得为等待 permit 启新 goroutine。claim 失败或 Run 已非 queued 时同样释放全部 semaphore，不执行模型。

- [ ] **Step 6: 实现 heartbeat、lease fencing 和取消树**

每个活动 Run 建立独立 Context 和 cancel。heartbeat 周期调用 `HeartbeatRun`；失败时立即 cancel 模型 Context，并禁止保存 checkpoint/Item/终态。Coordinator 只提供 `SignalCancel(runID)` 取消进程内 Context并等待该执行让出 CommitGate，不做数据库 CAS；模型和未来工具子任务都从 Run Context 派生。权威 canceled transition、event 和投影只由根 Service.Cancel 提交，避免双 CAS。

- [ ] **Step 7: 实现启动和周期扫描**

restart audit 规则固定为：

```text
queued -> interrupted
expired running 且无未决副作用 Item -> interrupted
expired running 且有 running side-effect Tool Item -> Item uncertain，Run waiting_approval
waiting_input/waiting_approval -> 不改变
```

本阶段尚不创建副作用 Tool Item，但 Store 查询和分支必须完整，供 Tool Engine 后续复用。正常运行中的 queue scanner 只重新 enqueue 当前 `queued`，不改变状态。

- [ ] **Step 8: 格式化、静态检查并提交**

```bash
gofmt -w service/agent/runtime/store/leader.go service/agent/runtime/engine
rg -n 'go func|make\(chan uint64|AcquireLeader|HeartbeatRun|lease_fencing_token' service/agent/runtime/engine service/agent/runtime/store/leader.go
git diff --check -- service/agent/runtime/engine service/agent/runtime/store/leader.go service/agent/runtime/store/repository.go
git add service/agent/runtime/engine service/agent/runtime/store/leader.go service/agent/runtime/store/repository.go
git commit -m "feat: add runtime leader coordinator"
```

预期：所有后台 goroutine 都由 Coordinator Context 和 WaitGroup 持有；`git diff --check` 无输出。

### Task 7: 实现事件适配器和 snapshot barrier

**Files:**
- Create: `service/agent/runtime/event/store.go`
- Create: `service/agent/runtime/event/emitter.go`
- Create: `service/agent/runtime/event/snapshot.go`
- Create: `service/agent/runtime/event/reader.go`

- [ ] **Step 1: 封装现有 Agent Stream**

`event/store.go` 定义窄接口并用 `frontstream.Service` 实现：

```go
type StreamStore interface {
	Write(context.Context, string, map[string]any) (string, error)
	Read(context.Context, string, string, int64, time.Duration) ([]frontstream.Entry, error)
	FirstCursor(context.Context, string) (string, error)
	CurrentCursor(context.Context, string) (string, error)
	IsExpired(context.Context, string, string) (bool, error)
}
```

实现固定使用 `frontstream.New("agent")` 的注入实例，不在每次 Emit 时 New。`FirstCursor/CurrentCursor` 用现有 Read 分页实现；空流返回 `0-0`。`IsExpired` 对普通 cursor 在其早于当前 first cursor 时为 true；`0-0` 只有在保留的首帧已不是该 Run 的 `run.started` 时才视为过期，否则允许从头重放。Redis ID 不要求连续。

- [ ] **Step 2: 实现 v2 Event Emitter**

`event/emitter.go` 构造：

```go
type Emitter struct {
	streams StreamStore
	router  core.SourceRouter
	now     func() time.Time
}

func (e *Emitter) Emit(ctx context.Context, source core.RunSource, event core.StreamEvent) (string, error)
```

Emit 前补齐 `Version=agent-runtime/v2` 与 `Timestamp`，写入前 `EventID` 必须为空；先用严格 JSON codec 把已验证 `core.StreamEvent` 转为 `map[string]any`，再传给当前签名只接受 map 的 `frontstream.ResponsePayload(request_id,"stream",wireMap,"",1)`，禁止直接传 struct 或手拼字段。Redis XAdd 成功后得到 cursor，但不改写已存 entry。成功写默认 Agent Stream 后再调用 `SourceRouter.EventSink(source).Emit(ctx,source,event)`；业务 Sink 失败只写独立 sink_delivery telemetry/error，不污染 Assistant projection_status，也不回滚 Run/Item 权威状态。所有 Loop/Service/snapshot 事件发送点都必须持有或从 Store 读取同一 Run 的私有 Source。

- [ ] **Step 3: 定义 assistant snapshot flusher 端口**

`event/snapshot.go` 定义：

```go
type SnapshotFlusher interface {
	FlushAssistantItem(context.Context, uint64) error
}

type SnapshotService struct {
	store   store.Repository
	streams StreamStore
	gate    engine.CommitGate
	flusher SnapshotFlusher
	now     func() time.Time
}
```

基础阶段使用 `NoopSnapshotFlusher`；Loop 接入后替换为活动 assistant buffer flusher。

- [ ] **Step 4: 实现严格 snapshot barrier**

`SnapshotService.GetRun` 按顺序执行：

```text
取得 per-run gate
FlushAssistantItem
在同一 SQL 读事务读取 RunDomain + Items
构造 snapshot.barrier{run_version,item_versions}
仍持有 gate 时 Append barrier，成功 cursor 为 C
返回 RunView{Run:RunPublic,Items,ResumeCursor:C,SnapshotAt:now}
释放 gate
```

`store.Repository` 为此提供单次 `ReadRunSnapshot`，不得分两次 ORM 查询拼快照。barrier Append 失败则整个 GetRun 失败，不返回不可续读的 snapshot；`CurrentCursor` 不能替代 barrier。Event Emitter 的生命周期事件、Store Item commit 和 Loop delta flush 也必须在同一 gate 内。客户端应用 snapshot 后只读取严格大于 C 的事件，通过 Item version 去重。

- [ ] **Step 5: 实现 SSE/轮询 reader 适配器**

`event/reader.go` 暴露现有 API 可直接复用的签名：

```go
func (s *Reader) ReadEntries(
	ctx context.Context,
	requestID string,
	lastID string,
	count int64,
	block time.Duration,
) ([]frontstream.Entry, error)
```

`ReadEntries` 对每个 entry 严格解开 `frontstream.ResponsePayload.output`，校验 v2 wire 后把 entry.ID 同时补到 `output.event_id`；若 wire 已有不同 event_id 则返回内部 transport sentinel `ErrStreamCursorConflict`，它不写入 Run/PublicError。这样 SSE `id`、outer stream_id 与 RuntimeEvent.event_id 三者一致。另提供 `ReadEvents(ctx, runID, cursor)`，先以 run_id 找到 request_id，再走同一解码器；协议不匹配返回 `invalid_input`，不兼容读取旧事件。

- [ ] **Step 6: 格式化、静态检查并提交**

```bash
gofmt -w service/agent/runtime/event
rg -n 'agent-runtime/v2|CurrentCursor|WithRun|ResumeCursor' service/agent/runtime/event
git diff --check -- service/agent/runtime/event
git add service/agent/runtime/event
git commit -m "feat: add runtime event snapshots"
```

### Task 8: 实现冻结 Energon 的薄 Model Client

**Files:**
- Create: `service/agent/runtime/model/client.go`
- Create: `service/agent/runtime/model/request.go`
- Create: `service/agent/runtime/model/stream.go`
- Create: `service/agent/runtime/model/capability.go`

- [ ] **Step 1: 定义唯一 Gateway port**

`model/client.go` 只允许：

```go
type Gateway interface {
	Request(context.Context, energonservice.GatewayRequest) botprotocol.Response
	CollectStream(context.Context, botstream.CollectOptions) botstream.CollectResult
	CancelStream(context.Context, string) error
	StopStream(context.Context, string) botprotocol.Response
}

type Client struct {
	gateway Gateway
	block   time.Duration
}

func (c Client) Stream(
	ctx context.Context,
	req core.ModelRequest,
	onEvent func(context.Context, core.ModelEvent) error,
) (core.ModelResponse, error)
```

不得 import Energon Provider、Adapter 或 Account 实现，不新增模型原生分支。

- [ ] **Step 2: 实现 Runtime Message 到 GatewayRequest 的单向映射**

`model/request.go` 构造 body：

```go
body := map[string]any{
	"power": req.PowerKey,
	"set": map[string]any{
		"id":   strconv.FormatUint(req.AgentID, 10),
		"role": req.SystemPrompt,
	},
	"input":   contentBlocksToEnergonInput(req.Input),
	"history": messagesToEnergonHistory(req.Messages),
	"options": map[string]any{
		"stream":                true,
		"temperature":           req.Temperature,
		"max_completion_tokens": req.MaxOutputTokens,
	},
}
```

`messagesToEnergonHistory` 必须确定性保留 assistant tool_call id/name/arguments 与随后同 ID 的 tool_result content/is_error，顺序不变；不把 Tool Result 扁平化为普通 user 文本。冻结 Energon mapping 无法表达时立即停止实施，而不是增加 JSON fence fallback。`req.SourceTargetID > 0` 时必须同时写 `body["source_target_id"]`，使 Energon 实际选择与 CapabilityResolver 已验证的 target 完全一致；否则不得宣称单 target 能力。 有 Tool Definitions 时才写 `tools/tool_choice=auto/parallel_tool_calls`；有原生 structured contract 时才写 `response_format`。基础 Loop 传空工具清单。

- [ ] **Step 3: 归一化 Energon stream 为 ModelEvent**

`model/stream.go` 处理：

```text
delta                -> text.delta
tool_call_delta      -> tool_call.started / tool_call.arguments.delta
usage                -> usage.updated
end/result           -> message.completed
上游 error/result 2  -> model.failed
```

`CollectStream.OnOutput` 不会收到最终 result frame，因此完成时必须同时读取 `CollectResult.State.Outputs` 和 `CollectResult.Frame`，用 `botprotocol.MergeStreamResult` 得到完整 assistant 文本和 Tool Calls。取消时先 `CancelStream`，必要时再 `StopStream`。

- [ ] **Step 4: 实现 ModelCapabilityResolver**

`model/capability.go` 从 Agent 的 LLM Power、启用 PowerTarget、Service 和 `bot_agent_model_capability` 解析：

```go
type ResolvedCapability struct {
	NativeToolCalling      bool
	NativeStructuredOutput bool
	StreamToolArguments    bool
	TokenCounter           string
	ContextWindowTokens    int
	MaxOutputTokens        int
	EligibleTargetIDs      []uint64
}
```

多个 fallback target：布尔值取交集，Token 上限取最小正数；TokenCounter 必须一致，否则只有全部记录明确允许 conservative_utf8_bytes 时才降到该上界 counter。明确 `source_target_id` 时只解析该 target。缺少记录返回 `model_capability_unknown`，不得按 Provider 名猜测。

- [ ] **Step 5: 格式化、确认 Energon 零改动并提交**

```bash
gofmt -w service/agent/runtime/model
git diff --name-only -- service/energon model/energon
rg -n 'Gateway interface|CollectResult\.Frame|MergeStreamResult|model_capability_unknown' service/agent/runtime/model
git diff --check -- service/agent/runtime/model
git add service/agent/runtime/model
git commit -m "feat: add energon runtime model client"
```

预期：第一条命令只显示执行计划开始前已经存在且用户确认过的 Energon 基线差异，不新增本任务差异；Runtime Model Client 中命中全部关键边界；`git diff --check` 无输出。

### Task 9: 实现基础唯一 Agent Loop 和 checkpoint

**Files:**
- Create: `service/agent/runtime/engine/checkpoint.go`
- Create: `service/agent/runtime/engine/telemetry.go`
- Create: `service/agent/runtime/engine/turn.go`
- Create: `service/agent/runtime/engine/loop.go`
- Create: `service/agent/runtime/engine/resume.go`

- [ ] **Step 1: 定义 Loop 的窄依赖**

```go
type ModelClient interface {
	Stream(context.Context, core.ModelRequest, func(context.Context, core.ModelEvent) error) (core.ModelResponse, error)
}

type EventEmitter interface {
	Emit(context.Context, core.StreamEvent) (string, error)
}

type Loop struct {
	store   store.Repository
	model   ModelClient
	events  EventEmitter
	gate    CommitGate
	now     func() time.Time
}
```

Loop 不 import Assistant、Team、Project、HTTP Context 或前端包。

- [ ] **Step 2: 实现 checkpoint codec**

`engine/checkpoint.go` 只接受 `core.Checkpoint`。基础 checkpoint 完整保存：

```go
type Checkpoint struct {
	Messages          []Message
	NextModelTurn     int
	AssistantItemID   uint64
	AssistantVersion  uint64
	VisibleTextOffset int
	LastSafeItemSeq   int
	ResumeReceipts    []ResumeReceipt
}
```

保存前验证所有 assistant tool_calls 都有匹配 tool result；基础阶段出现 tool_call 时不写可恢复 checkpoint，而是返回 `model_tool_unsupported`。

`telemetry.go` 使用注入的 monotonic clock 累计 queue/context/model request/first model event/first visible text/model total/tool wait/output finalize/total 时间；首次时间只写一次。Run Usage 每次 checkpoint 和 terminal 都持久化。每个 Tool wall time 使用 Item.started_at/finished_at 计算，不塞进聚合 Usage。结构化日志只记录 run_id/request_id/source/agent/item_id/call_id/status/耗时和错误码，不记录 Prompt、Content、arguments、Tool Result 或 secret。

- [ ] **Step 3: 实现单次模型 turn**

`turn.go` 在 gate 内创建 running `assistant_message` Item，然后调用 Model Client。`text.delta` 立即发流，同时按 `100ms 或 512 rune` 阈值更新 assistant Item 快照；最终强制 flush。事件必须带 `run_id/item_id/item_version`。

- [ ] **Step 4: 实现错误边界**

规则固定：

```text
首个可见 delta 前的瞬时模型错误，且本 Run 无副作用 -> 最多重试一次
已发送可见 delta 后模型错误 -> assistant Item interrupted，Run interrupted
鉴权、配置、能力错误且无可见 delta -> Run failed
Context cancel -> Run canceled
ErrLeaseLost -> 立即停止，不由旧 Worker 写终态
```

- [ ] **Step 5: 实现基础多轮 Loop**

`loop.go` 从 checkpoint 恢复 messages，执行有效 `MaxModelTurns`，并用 Run 创建时间 + 有效 MaxRunSeconds 建立总 deadline。每个 ModelEvent 累加 Usage：input/total token 超限返回 `context_overflow`，Run deadline 返回 `run_timeout`，output token/byte 超限返回 `output_validation_failed`；所有路径先写 Error Item。tool arguments delta 超过 MaxToolArgumentsBytes 时取消上游并返回 `model_protocol_error`。纯文本 `message.completed` 即完成 Run；如果模型返回 Tool Call，而 Tool Definitions 为空，写 error Item 并以 `model_tool_unsupported` 失败。不得解析正文 JSON 猜工具调用，不得调用旧 Profile 分支。

完成时构造基础输出：

```go
core.OutputEnvelope{
	Type: "text",
	Text: finalText,
}
```

并在 gate 内按顺序提交 assistant Item、checkpoint、Run completed，再发送 `run.completed`。

- [ ] **Step 6: 实现 interrupted continue**

`resume.go` 只处理 `ResumeRequest.Action=continue`：重新校验当前 Invocation Actor/权限和 Source，但继续使用 Run snapshot 中冻结的 PageContext，CAS `interrupted -> queued`，保留最后安全 checkpoint，并交回 Coordinator enqueue。非法 action 返回 `invalid_input`，状态不可恢复返回 `resume_conflict`；交互和审批由后续计划实现。

- [ ] **Step 7: 将 Loop 接到 Coordinator Runner**

实现：

```go
func (l *Loop) Run(ctx context.Context, claimed ClaimedRun) core.RunResult
```

每次模型请求前、事件快照 commit 前、终态 commit 前调用 `claimed.Fence.Check(ctx)`。不得由 Loop 自建 goroutine。

- [ ] **Step 8: 格式化、静态检查并提交**

```bash
gofmt -w service/agent/runtime/engine
rg -n 'json_fallback|ProfileAgentChat|go func' service/agent/runtime/engine
rg -n 'text.delta|assistant_message|interrupted|model_tool_unsupported|Checkpoint' service/agent/runtime/engine
git diff --check -- service/agent/runtime/engine
git add service/agent/runtime/engine
git commit -m "feat: add single agent loop"
```

预期：第一条 `rg` 无输出；第二条命中基础 Loop 的全部关键状态；`git diff --check` 无输出。

### Task 10: 实现根 Service、共享生命周期和 core 阶段手工交接

**Files:**
- Create: `service/agent/runtime/deps.go`
- Create: `service/agent/runtime/config.go`
- Create: `service/agent/runtime/service.go`
- Create: `service/agent/runtime/start.go`
- Create: `service/agent/runtime/query.go`
- Create: `service/agent/runtime/cancel.go`
- Create: `service/agent/runtime/resume.go`
- Create: `service/agent/runtime/projection.go`
- Create: `service/agent/runtime/health.go`

- [ ] **Step 1: 定义根 Service 依赖**

`deps.go` 定义：

```go
type Dependencies struct {
	Store        store.Repository
	Gateway      model.Gateway
	Streams      event.StreamStore
	SourceRouter core.SourceRouter
	Now          func() time.Time
	InstanceID   string
}

type Service struct {
	store       store.Repository
	coordinator *engine.Coordinator
	loop        *engine.Loop
	emitter     *event.Emitter
	snapshots   *event.SnapshotService
	reader      *event.Reader
	router      core.SourceRouter
	now         func() time.Time
}
```

`NewService` 只构造，不启动 goroutine。`StartBackground(ctx)` 获取 leader 并启动 Coordinator；`Close(ctx)` 停止 Worker、等待 WaitGroup、释放 leader。调用方必须持有一个 Service 实例，禁止每请求 New。

- [ ] **Step 2: 实现 Start 的幂等创建顺序**

`Start` 必须按顺序：

```text
验证 AgentRef/RunSource/Invocation/OutputContract
解析 Agent 与已验证 Model Capability
规范化 ExecuteRequest 并计算 request_hash
CreateOrGetRun
既有 Run -> 返回同一 RunHandle，stream_cursor 固定为 0-0 以重放保留事件
新 Run -> Projector.OnCreated 同步成功
CommitGate 内写 run.started(queued)，取得 stream cursor
Coordinator.Enqueue
返回 RunHandle
```

AgentRef 同时给 ID/Key 时必须命中同一行；RuntimeOptions 数字 0 使用默认，正数只能与 RuntimeConfig、Agent 和 ResolvedCapability 取更小值，不能提高上限，DeadlineAt 只能缩短 MaxRunSeconds。

RunHandle.StreamCursor 使用刚写入的 `run.started` cursor，使客户端无需等 Worker claim 即可开始 watch；记录请求接受到该事件的本地耗时，目标不超过 100ms。Projector 失败时不 enqueue；在同一 CommitGate 内把 Run 从 queued 转为 failed，写 `projection_status=retrying` 与公开 `projection_unavailable`，尽力写 `run.failed`，然后返回包含同一 run_id/request_id/status=failed 的 RunHandle 和错误。后续投影重试仍按该 run_id 补建唯一 failed assistant message，不创建第二个 Run。关键 Agent stream 写入失败时 Run 不执行并返回 `internal_error`；Team/Project 的额外镜像 Sink 失败只记日志，不改变权威 Run。未知 Source 在创建 Run 前拒绝。

- [ ] **Step 3: 实现统一投影生命周期与有限重试**

`projection.go` 是调用 Projector 的唯一位置，并实现注入 Engine/maintenance 的 `LifecycleObserver`。`OnCreated` 成功后把 projection_status 置为 `ready`；每个状态变更的唯一 owner 在 DB commit + lifecycle event 后调用 observer：Loop 负责其 resting/terminal，Coordinator restart audit 负责 interrupted/uncertain，Service.Cancel 负责 canceled，后续 blocking-expiry 负责过期 terminal。任何路径不得再直接调用 Projector 或二次 transition。Resting/Terminal 投影失败不回滚权威 Run，只以 CAS 写 `retrying/attempts/error`。

`StartBackground` 同时启动一个有界 projection worker：按 `1s/2s/5s/15s/30s` 最多重放五次。重放在一次权威 snapshot read 中取得 RunDomain、checkpoint 和 Items，先幂等调用 `OnCreated`；resting 时按 Checkpoint.BlockingItemID 传 blocker（interrupted 可 nil），terminal 时从 Run 构造 RunResult。不得把“最后一条 Item”当 blocker。成功写 `ready`，耗尽写 `failed` 并保留脱敏错误。公开：

```go
func (s *Service) RetryProjection(context.Context, RunRef) error
```

该方法只重新排队同一个 Run 的投影，不重新执行模型或工具，供 Assistant 历史对齐和人工维护使用。

- [ ] **Step 4: 实现 Execute 和 Wait**

```go
func (s *Service) Execute(ctx context.Context, req ExecuteRequest) (RunResult, error)
func (s *Service) Wait(ctx context.Context, ref RunRef) (RunResult, error)
```

`Execute = Start + Wait`。Wait 轮询权威 Run 状态，并在 lifecycle terminal 或 `waiting_input/waiting_approval/interrupted` 返回；不跨 resting state 无限等待。Context 取消只停止等待，不自动取消 Run。业务 `failed/canceled/resting` 均以 `RunResult,nil` 返回，调用方必须检查 Status/Error/ResumeRequired；Go error 只表示无法取得权威结果的 validation、storage、leader 或 context failure。

- [ ] **Step 5: 实现 Cancel 和 Resume**

`Cancel` 对终态幂等；Core 尚无 Tool 时，非终态先 `Coordinator.SignalCancel`，再在 CommitGate 内以当前 version 单次 CAS 到 canceled，写 event 并调用 LifecycleObserver.OnTerminal；Worker 看到显式取消只退出，绝不竞争写第二个终态。02 Tool plan 会在这一步加入 uncertain side-effect audit。`Resume` 本阶段只接受 interrupted + continue；在同一个 CommitGate + 数据库事务内校验/追加 `ResumeReceipt` 并执行 `interrupted -> queued` CAS，随后在 gate 内写 `run.status`，其 cursor 作为返回 RunHandle.StreamCursor，成功后才 enqueue。重复 key/hash 不再次 transition/enqueue，而是从当前 Run + snapshot cursor 重建同一运行的 Handle；相同 key/不同 hash 返回 `resume_conflict`。

- [ ] **Step 6: 实现 GetRun/ListItems/ReadEvents 和 snapshot barrier**

```go
func (s *Service) GetRun(ctx context.Context, ref RunRef) (RunView, error)
func (s *Service) ListItems(ctx context.Context, runID uint64) ([]ItemView, error)
func (s *Service) ReadEvents(ctx context.Context, runID uint64, cursor string) ([]StreamEvent, error)
func (s *Service) ReadEventEntries(ctx context.Context, requestID, cursor string, count int64, block time.Duration) ([]frontstream.Entry, error)
func (s *Service) AuthorizeRun(ctx context.Context, access RunAccessRequest) (RunRef, error)
```

`GetRun` 必须调用 `SnapshotService.GetRun`，不得分别读 Run 和 Items。`RunRef` 同时给 ID/request_id 时必须校验一致。`AuthorizeRun` 读取私有 Invocation snapshot，要求 ActorType/ActorID/TenantID/Site 与创建者一致；Admin 只能由已认证 HTTP context 服务端设置。不存在、不匹配或未授权统一返回不泄露存在性的 `run_ref_conflict`。它返回已核对 ID+RequestID 的 RunRef，供所有外部 status/stream/cancel/resume 使用；内部 Team/Project 调用不走 HTTP 授权端口。

- [ ] **Step 7: 实现 Health 和显式后台启动要求**

```go
type Health struct {
	ProtocolVersion string
	Leader          bool
	InstanceID      string
	FencingToken    uint64
	Workers         int
	QueueDepth      int
	Started         bool
	Error           string
}
```

未调用 `StartBackground`、抢不到 leader、leader heartbeat 失效时 `Healthy()` 必须为 false；不能静默降级成无 Worker 的 API 实例。

- [ ] **Step 8: 公开完整根 Service 方法集**

确认最终公开签名为：

```go
func NewService(Dependencies) (*Service, error)
func (s *Service) StartBackground(context.Context) error
func (s *Service) Close(context.Context) error
func (s *Service) Start(context.Context, ExecuteRequest) (RunHandle, error)
func (s *Service) Execute(context.Context, ExecuteRequest) (RunResult, error)
func (s *Service) Wait(context.Context, RunRef) (RunResult, error)
func (s *Service) Resume(context.Context, ResumeRequest) (RunHandle, error)
func (s *Service) Cancel(context.Context, RunRef) error
func (s *Service) GetRun(context.Context, RunRef) (RunView, error)
func (s *Service) ListItems(context.Context, uint64) ([]ItemView, error)
func (s *Service) ReadEvents(context.Context, uint64, string) ([]StreamEvent, error)
func (s *Service) ReadEventEntries(context.Context, string, string, int64, time.Duration) ([]frontstream.Entry, error)
func (s *Service) AuthorizeRun(context.Context, RunAccessRequest) (RunRef, error)
func (s *Service) RetryProjection(context.Context, RunRef) error
func (s *Service) Health() Health
```

- [ ] **Step 9: 格式化并做 core 范围静态自检**

```bash
gofmt -w service/agent/runtime
rg -n 'service/(assistant|team|project)' service/agent/runtime --glob '*.go'
rg -n 'RunInternal|InternalRunRequest|ProfileAgentChat|json_fallback|NewStepModel' service/agent/runtime --glob '*.go'
rg -n '^func \(s \*Service\) (Start|Execute|Wait|Resume|Cancel|GetRun|ListItems|ReadEvents|RetryProjection|Health)' service/agent/runtime
git diff --check -- model/agent service/agent/runtime service/agent/setting/runtime.go service/agent/skill/draft/service.go service/agent/sandbox/config.go
```

预期：前两个 `rg` 无输出；第三个命中完整根 Service 方法；`git diff --check` 无输出。

- [ ] **Step 10: 确认本阶段没有越界修改**

```bash
git status --short
git diff --name-only
```

人工核对本计划未修改：

```text
service/energon/**
model/energon/**
api/**
service/assistant/**
service/team/**
service/project/**
backend/package/bot/front/**
/data/project/shemic/front/**
```

Task 1 明确列出的三个 Runtime 外 helper 调用文件除外。

- [ ] **Step 11: 提交根 Service**

```bash
git add service/agent/runtime
git commit -m "feat: add agent runtime v2 core service"
```

## 本计划不执行的后续工作

以下内容必须分别进入后续实施计划，不能塞入本阶段提交：

1. Tool Catalog、Mount Resolver、Policy、Executor、Scheduler 和工具 Outcome。
2. Knowledge、Skill、Power、Asset、Front Action、Platform、真实 MCP 工具。
3. `ask_user`、批次 Approval、uncertain side-effect 完整 Resume。
4. Token Budget、Tool Result eviction、正式 Compaction。
5. Structured/Rich Document OutputEngine 和 Artifact Item 持久化。
6. Assistant `SendMessage/RunProjector` 与 Chat 多轮消息投影。
7. Agent API、Team、Project、Skill Planner、Cancel、Maintenance 和 Asset relation 适配。
8. bot plugin、宿主 front Runtime Client/Store/UI。
9. Mount Manifest 消费、PostgreSQL migration、数据清理、Redis 清理和协调发布。

## 用户手工验收准备清单

本计划不启动 backend；只在后续所有调用方完成切换且用户准备好隔离数据库后，交给用户手工验证：

- 单实例取得 leader，第二实例 Runtime health 失败。
- 同 request_id/hash 返回同 Run；同 request_id/不同 hash 返回冲突。
- 不同 Run 在配置并发上限内并行，同 Agent/Actor 限额有效。
- backend 中断后 queued/running 进入 interrupted，continue 恢复同 Run。
- 文本 delta 实时到达，最终 Run/assistant Item/output 一致。
- 流 cursor 续读不重复；流过期后 GetRun snapshot 可重建。
- 已可见 delta 后模型错误产生 interrupted，不误写 failed/completed。
- Cancel 传播到 Energon stream，并只由当前 fencing owner 写 canceled。
- Energon Provider/Adapter、Demo 8091、Demo 数据库和 Demo Redis 不发生变化。

## 静态交接记录

执行者完成本计划后应记录：

```text
bot commit 起点
Energon 冻结基线 commit
本计划每个 Task 的 commit
改动文件清单
gofmt 与 git diff --check 结果
未运行 build/test/lint 的明确说明
后续计划开始前仍然存在的旧调用方编译断点清单
```

该记录是后续 Tool Engine 和调用方切换计划的输入；在旧调用方断点清零前，不得部署本分支。
