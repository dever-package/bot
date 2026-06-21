---
name: dever-bot
description: Use when 修改 Dever bot 组件，包括 agent、energon、team flow、workspace/project canvas、asset、knowledge、skill install、bot front/page JSON、front 插件、API、Service、权限、执行、流式输出和升级影响。
version: 0.1.0
---

# Bot 组件

本组件 skill 必须和 `shemic-dever` 一起使用。先遵守 Dever 框架规则，再按这里的 bot 组件边界修改。

## 事实来源

- 组件源码：`backend/package/bot`
- 组件声明：`backend/package/bot/dever.json`
- Model：`model/agent`、`model/asset`、`model/body`、`model/energon`、`model/project`、`model/team`、`model/workspace`
- Service：`service/agent`、`service/asset`、`service/body`、`service/energon`、`service/project`、`service/team`
- API：`api`
- 后台页面：`front/page`
- 前端插件源码：`front/src`

## 硬规则

- 不为 package/front 已能处理的后台页面新增 CRUD wrapper Service/API。
- 不手改生成文件或编译后的 front 插件产物。
- 后台自定义 API 放 `api/admin`，URL 是 `/bot/admin/...`；body 工作台 API 放 `api/body`，URL 是 `/bot/body/...`。
- `dever.json.front.sites.admin.api` 只追加 `bot/admin` 到后台权限域；`body` 站点主 API 是 `bot/body`。
- canvas、workspace、team 执行语义留在 bot Service，不塞进 page JSON。
- API 保持薄；执行、权限、锁、记录、流式输出和外部调用放 Service。
- 节点、运行、资产执行状态通过现有 workspace/team/project service 路径持久化；没有清晰 model 目的时，不新增平行运行表或重复审计表。
- 修改 workspace 或 team flow 行为前，先检查同组件已有 run、lock、context、record、helper service。

## Page 和 Front 规则

- 普通 bot 后台页面保持 page JSON。
- 只有 canvas、workspace、flow、editor 这类 page JSON 表达不了的交互才写 React/plugin。
- 新增 bot 专属 page service 前，先复用 package/front node/action。
- body 工作台前端使用 `joinSiteApi()`；后台自定义接口只调用 `/bot/admin/...`。
- 不硬编码 `/front/route/action`，使用当前站点 runtime。

## Service/API 规则

- `service/agent`：agent 执行和最终结果行为。
- `service/energon`：provider/source/power 调用和归一化。
- `service/project`：workspace/project canvas 执行、锁、记录、stream 和权限。
- `service/team`：team flow runtime、节点执行、校验、审批和 stream。
- `service/assistant`：后台 AI 助理、`show-agent` 多轮会话、历史会话、长期记忆和记忆确认。

新增 Service 代码只放到归属 service 目录。避免新增会导致 package/front 循环依赖的跨 package import。

## AI 助理和技能创建

- 创建技能、安装技能、智能体测试和后台 AI 助理都复用 `bot_assistant_session` / `bot_assistant_message`，用 `agent_key + context_key` 隔离场景；不要再新增场景专用 message 表。
- 长期记忆复用 `bot_memory`，按 `owner_type/owner_id + scope + agent_key + context_key + session_id` 隔离；低置信或冲突候选放 `bot_memory_candidate` 并在本轮消息下确认。
- 记忆抽取复用当前 agent 的 `llm_power_id`；不可用时才退回确定性规则。secret、cookie、token、api key 不进入记忆、prompt、日志。
- 创建技能的 AI 对话必须只产出和应用草稿 patch；发布仍走校验、沙箱测试和发布流程。
- AI 助理内历史、记忆、交互参数弹窗必须高于 AI 助理层；AI 助理层必须高于普通业务弹窗，且不能点击助理导致普通弹窗关闭。

## 常见检查

- 权限错误：先查 bot 权限 service 和 package/front action 上下文，不要先放宽 auth。
- flow/canvas 执行错误：先查 run 状态、节点执行、锁和 stream watcher，不要先改 UI。
- option/model 错误：先查 model Options/Relations 和 page 上下文，不要硬编码 model 名。
