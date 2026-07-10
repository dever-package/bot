# Agent Runtime v2 Implementation Roadmap

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按已确认规格删除旧 Agent Runtime，交付支持多轮、工具、知识库、素材与 rich document 的完整单智能体运行时。

**Architecture:** 实施分为 Runtime 内核、工具与输出、Assistant/API、双前端、内部调用方与切换五个连续子计划。所有工作在冻结 Energon 和现有前端基线后的隔离 worktree 中进行；旧代码与新代码不得在任何可发布版本中混跑，数据库只在最后维护窗口切换。

**Tech Stack:** Go 1.25、Dever ORM/Service/API、PostgreSQL、Redis Stream、React、TypeScript、Tiptap、现有 Energon Gateway

---

## 计划集合

按顺序执行，不能跳阶段：

1. [Runtime Core Plan](./2026-07-10-agent-runtime-v2-01-core.md)
2. [Tools, Context and Output Plan](./2026-07-10-agent-runtime-v2-02-tools-output.md)
3. [Assistant and API Plan](./2026-07-10-agent-runtime-v2-03-assistant-api.md)
4. [Frontend Plan](./2026-07-10-agent-runtime-v2-04-frontend.md)
5. [Integrations and Cutover Plan](./2026-07-10-agent-runtime-v2-05-integrations-cutover.md)

权威设计规格：

- [Agent Runtime v2 Design](../specs/2026-07-10-agent-runtime-v2-design.md)

## 不可变约束

- 最终只保留一个 Agent Loop，不保留 v1/v2 开关、旧请求、旧事件或旧数据兼容。
- 不修改 `service/energon/**`、`model/energon/**` 和 Provider Adapter；先把当前未提交 Energon 文件冻结为基线。
- Runtime 不 import Assistant、Team 或 Project；它们通过 `RunProjector`、`EventSink` 和公共 Service 接入。
- 所有模型可见工具来自 AgentTool、AgentPower、KnowledgeBase、SkillPack 与权限交集。
- 普通回答流式 Markdown；Structured 使用 JSON Schema；Rich Document 确定性生成 Tiptap `rich_json`。
- 首版单活 Runtime leader；不同 Session/Source 的 Run 可由同一 Coordinator 并行执行。
- 8091 Demo、`shemic_demo`、Redis DB 1 和 `prefix=shemic_demo` 永远不进入开发迁移或 Stream 清理。
- 遵照用户要求，不运行 `npm run build`、`dever build`、`go test`、前端 test、lint 或等价命令；每阶段只做静态检查，最终由用户手工验收。

## Task 0：冻结当前真实基线

**Repositories:**

- `/data/project/shemic/backend/package/bot`
- `/data/project/shemic/front`

当前两个仓库都有大量用户未提交改动。尤其以下 Energon 文件不能被 Runtime 计划覆盖或丢失：

```text
service/energon/call.go
service/energon/request.go
service/energon/normalize.go
service/energon/protocol/openai.go
service/energon/protocol/openai_tool_call.go
service/energon/protocol/stream.go
service/energon/stream/session.go
service/energon/media_persist.go
```

- [ ] **Step 1：只读记录三仓状态**

Run:

```bash
git -C /data/project/shemic/backend/package/bot status --short
git -C /data/project/shemic/front status --short
git -C /data/project/shemic/backend/package/front status --short
```

Expected: 将状态交给用户确认。不得自动 stash、reset、checkout 或提交用户现有改动。

- [ ] **Step 2：由用户确认 bot 与宿主 front 的保存方式**

Required outcome:

```text
bot baseline commit:  用户确认后记录完整 40 位 SHA
front baseline commit: 用户确认后记录完整 40 位 SHA
Energon baseline:      included in bot baseline
```

Expected: 两个基线能恢复当前真实文件；`backend/package/front` 本次不改，不需要纳入 Runtime 分支。

- [ ] **Step 3：核对 Energon 冻结能力**

Inspect only:

```bash
rg -n 'tools|tool_choice|response_format|tool_calls|arguments' \
  service/energon/protocol service/energon/request.go
rg -n 'CollectStream|CancelStream|StopStream|PowerParamConfig' service/energon
```

Expected: 文本 delta、assistant Tool Call、Tool Result 回灌、并行 Tool Call、流式 arguments、usage、取消均可从冻结源码获得。任一缺失立即停止，不借 Runtime 计划修改 Energon。

- [ ] **Step 4：生成切换前工具挂载事实清单**

Create during execution:

```text
migrations/agent-runtime-v2-tool-mount-manifest.json
```

清单必须按 `agent_id` 稳定排序，至少包含：

```json
{
  "version": "agent-runtime/v2",
  "model_capabilities": [
    {
      "service_id": 1,
      "native_tool_calling": true,
      "native_structured_output": false,
      "stream_tool_arguments": true,
      "token_counter": "conservative_utf8_bytes",
      "context_window_tokens": 65536,
      "max_output_tokens": 8192,
      "verified_source": "user-confirmed frozen Energon service"
    }
  ],
  "agents": [
    {
      "agent_id": 1,
      "profile": "agent_chat",
      "direct_tool_keys": ["ask_user", "suggest_actions"],
      "power_mounts": [
        {"power_id": 9, "runtime_role": "asset", "asset_kinds": ["image"]}
      ],
      "knowledge_relation_hash": "sha256:...",
      "skill_relation_hash": "sha256:...",
      "derived_tool_keys": []
    }
  ]
}
```

Expected: 不允许 wildcard；`platform_mcp_call` 不进入清单；现有自定义 Agent 当前能看到的非 LLM Power 固化成具体 Power ID。每个 Power 还必须由用户确认 `runtime_role=capability|asset`；asset 明列 `asset_kinds=image|video|audio|file`。旧 resolver 对 `multi/workflow` 或名称的猜测只能生成待确认候选，不能直接成为运行时规则。`model_capabilities` 只记录 Step 3 从冻结源码和用户实际配置确认的文本 Service；不能按 Provider 名或模型名称猜布尔能力、Token 上限或 tokenizer。没有精确 tokenizer adapter 时可显式确认 `conservative_utf8_bytes`，它按 canonical payload UTF-8 byte 上界计数，不是运行时临时 fallback。

- [ ] **Step 5：创建隔离 worktree**

Required sub-skill at execution time: `using-git-worktrees`。

Expected layout:

```text
/data/project/shemic/.worktrees/bot-agent-runtime-v2
/data/project/shemic/.worktrees/front-agent-runtime-v2
```

Expected: worktree 从用户确认的两个 baseline commit 创建，不从当前脏工作区猜测文件版本。

## 阶段依赖

```text
冻结基线与 Mount Manifest
            │
            ▼
01 Core：协议、Model、Store、Coordinator、Model Client、基础 Loop
            │
            ▼
02 Tools/Output：挂载、Policy、Knowledge、Skill、Power、Artifact、Rich JSON
            │
            ▼
03 Assistant/API：幂等消息、投影、Resume/Cancel、薄 API
            │
            ▼
04 Frontend：共享 Client/Reducer/UI、Chat Drawer、Agent 调试页
            │
            ▼
05 Integrations/Cutover：Team/Project/Skill、清理旧代码、DB/发布切换
```

## 提交边界

每个提交只包含一个职责，建议顺序：

```text
chore: freeze agent runtime migration inputs
refactor: move sandbox config outside runtime
feat: define agent runtime v2 models and contracts
feat: add agent runtime store and coordinator
feat: add agent runtime model loop
feat: add mounted tool engine
feat: add knowledge skill and power tools
feat: add runtime artifacts and output contracts
feat: add assistant runtime projection
feat: expose agent runtime v2 api
feat(front): add shared agent runtime client
feat(front): migrate assistant and agent surfaces
refactor: adapt team project and skill callers
chore: remove agent runtime v1 and cut over schema
```

禁止把用户原有无关修改、Energon 基线修改和 Runtime 实现混进同一提交。

## 每阶段静态检查

允许执行：

```bash
git diff --check
rg -n 'TODO|FIXME|TBD|兼容|fallback' service model api front migrations
rg -n 'service/agent/runtime' api service/team service/project service/assistant service/agent/skill
git status --short
```

不允许执行：

```text
go test / go vet / go build
npm / pnpm build
npm / pnpm test
eslint / tsc / dever build / dever front build
```

## 最终完成条件

- Runtime v1 文件、Step Model/Page、旧 Chat 双写、旧前端流解释器全部从 Agent 路径删除。
- Chat 与调试页均能通过同一 Run/Item/Event 协议进行多轮对话、工具调用和恢复。
- 未挂知识库/Skill/Power 的 Agent 看不到对应工具；挂载后能调用并把真实结果回灌模型。
- 图片、视频、音频和文件成为可恢复 Artifact；Rich Document 输出为有效 Tiptap JSON。
- Team/Project/Skill 复用非交互 Execute；取消与 agent_run_id 关系正确。
- 版本不匹配明确拒绝；不存在 v1/v2 混跑窗口。
- 用户完成设计规格第 26 节全部手工验收。
