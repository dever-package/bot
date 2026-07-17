# Body 团队工作区与统一资产中心实施计划

> 本计划用于后续逐阶段实施。每完成一项更新复选框；遵守项目约束，不运行 `npm run build` 或任何自动化测试，不创建 Git 提交。

**目标：** 在保留现有 Body 首页整体样式和项目卡片样式的前提下，将左侧菜单统一为“项目、对话、工具、资产”，并建立一套由 Body 资产页、项目资产弹窗及后续 `@资产` 选择器共同复用的资产浏览、详情、版本和保存机制。

**核心架构：** 后端以“当前用户 + 当前团队”为资产隔离边界，以逻辑资产承载当前版本、资产版本表承载历史版本，以明确的来源字段支持项目/工具/对话筛选。前端从现有画布资产弹窗和详情弹窗中提取通用 `AssetBrowser`、`AssetCard`、`AssetDetailDialog`、`AssetPreview`，所有入口使用同一套组件，仅传入不同的初始筛选条件和选择行为。

**技术范围：** Dever Model/Page JSON、Go Service/API、React/TypeScript、现有 Dever front plugin、现有流式能力运行与 Agent Chat 组件。

---

## 一、已确认的产品契约

### 1. 团队工作区与菜单

- 左侧菜单顺序固定为：`项目 / 对话 / 工具 / 资产`。
- `工具` 是 Body 前台名称，后台仍使用“团队能力”。
- 团队切换器保留在左下区域；切换团队后，项目、对话、工具和资产全部切换到该团队的数据。
- 项目页继续使用现有项目卡片列表和新建入口，不重做既有视觉样式。
- 团队能力只有同时满足“状态开启”和“首页开启”时才在工具页出现；“首页”默认开启。
- 团队角色按团队隔离并显示在对话页。

### 2. 资产定义

资产只表示用户明确保存或项目流程明确产出的可复用数据，不等同于运行历史。

| 维度 | 值 | 说明 |
| --- | --- | --- |
| 业务角色 | 作品 | 最终成品，当前仅由项目产出 |
| 业务角色 | 素材 | 项目节点结果、工具保存结果、对话保存结果 |
| 资产类型 | 文本 | 普通文本、Markdown 等文本内容 |
| 资产类型 | 图片 | 单图或同一结果中的图片集合 |
| 资产类型 | 音频 | 可播放音频 |
| 资产类型 | 视频 | 可播放视频 |
| 资产类型 | 富文本 | 结构化富文本，例如 `rich_json` |
| 资产类型 | 文件 | 不能归入上述类型的可下载文件 |

- 团队没有配置资产分类时，表示该团队没有“作品”产出；项目入口本身仍可按团队配置启用，项目节点产生的素材也仍可保存。
- 项目保存作品时必须绑定有效资产分类，不能以分类 `0` 或临时默认分类创建作品。
- `作品 / 素材` 既是内部保存和版本归属规则，也是在“项目来源且团队有资产分类”时使用的筛选项；卡片或详情可以将其作为只读来源信息展示。
- 每条逻辑资产包含多个版本，并记录一个“当前版本”。
- 卡片列表只展示当前版本；点击卡片进入详情弹窗后可以查看其他版本。
- 在详情中选择历史版本只改变当前预览；点击“设为当前”才更新资产的当前版本，该操作不会生成新版本。
- 只有保存、明确的重新生成或项目节点再次成功产出时才增加版本。
- 未生成、运行中、失败、被取消的项目节点不属于资产，不进入资产列表。
- 单独的“历史记录”本期不做；运行记录与已保存资产保持两个概念。

### 3. 来源与筛选顺序

统一资产浏览器的筛选顺序固定为：

1. 来源：`全部 / 项目 / 工具 / 对话`
2. 项目资产角色：`全部 / 作品 / 素材`，仅在“来源为项目，并且当前团队存在资产分类”时展示
3. 类型：`全部 / 文本 / 图片 / 音频 / 视频 / 富文本 / 文件`

团队没有资产分类时不可能产生作品，因此选择项目来源后隐藏“全部 / 作品 / 素材”，直接展示符合项目级联和类型条件的项目素材。来源为全部、工具或对话时也不展示该筛选。

来源的下级筛选：

- 项目：有资产分类时为 `项目 -> 资产分类 -> 节点`；没有资产分类时省略分类级，使用 `项目 -> 节点`
- 工具：选择当前团队的具体能力
- 对话：选择当前团队的具体角色/智能体

独立资产页和项目内资产弹窗是同一个组件、同一种布局、同一套交互：

- 独立资产页初始来源为“全部”。
- 项目资产弹窗自动预选“项目 + 当前项目 + 当前资产分类”；当前团队没有资产分类时省略分类条件，从具体节点打开时可继续预选节点。
- 自动预选只是初始筛选，用户仍可清空条件并查看当前团队的全部资产。
- 不增加“独立页模式”和“项目弹窗模式”两套分支。

### 4. 保存与版本规则

| 来源 | 是否自动保存 | 保存角色 | 新资产/新版本判断 |
| --- | --- | --- | --- |
| 项目节点 | 成功后自动保存 | 素材 | 同一项目节点再次成功运行，追加该逻辑素材的新版本 |
| 项目最终输出 | 有有效资产分类时，用户执行现有保存/发布动作 | 作品 | 同一作品继续保存时追加版本；没有资产分类时不保存作品 |
| 工具 | 不自动保存，用户点击“保存为素材” | 素材 | 普通新结果创建新素材；从某条已保存资产明确执行“重新生成/继续编辑”时追加目标资产版本 |
| 对话 | 不自动保存，用户点击“保存为素材” | 素材 | 普通新回复创建新素材；从某条已保存资产明确执行“重新生成/继续编辑”时追加目标资产版本 |

- 用户只执行“保存”，不让用户选择“新素材”还是“新版本”。
- 后端根据操作链路自动判断：普通运行/消息创建新素材，只有显式重新生成操作携带的合法目标资产才追加版本。
- `@` 引用只属于上下文和来源追溯，不能单独作为“追加被引用资产版本”的依据；一次输入可能引用多个资产，也不应覆盖任何一个来源资产。
- 相同运行结果或相同消息重复点击保存必须幂等，不能重复创建资产或版本。
- 团队能力和团队角色都不配置资产分类；它们保存的只能是素材。
- 只有项目流程节点保留资产分类配置。

### 5. `@` 与 `#` 的后续契约

- 所有 `prompt` 类型输入框支持 `@资产`。
- 智能体聊天输入框同时支持 `@资产` 和 `#会话信息`。
- 智能体当前已有的 `@会话信息` 行为只改触发符为 `#`，保留原选择弹窗和读取逻辑。
- 新的 `@资产` 选择器直接复用统一资产浏览器；资产卡片悬浮或触控操作区增加“使用”按钮。
- 插入时使用该资产的当前版本。
- 项目内 `@` 默认带入当前项目和当前资产分类筛选，也可以切换到全部资产。
- 不同能力的 `prompt` 参数可通过允许的资产类型限制 `@` 候选项，不在各页面复制过滤逻辑。

---

## 二、结构与复用原则

### 通用前端组件

从现有画布资产实现中提取并复用：

- `AssetBrowser`：筛选、分页、卡片网格、空状态和加载状态。
- `AssetCard`：展示当前版本摘要，点击打开详情；选择场景额外展示“使用”。
- `AssetDetailDialog`：资产详情、版本列表、当前版本切换和媒体操作。
- `AssetPreview`：文本、图片、音频、视频、富文本、文件的统一渲染。
- `AssetSourceFilters`：来源及项目/工具/对话级联筛选。

复用现有画布的视觉和预览能力，但必须解除以下耦合：

- 不依赖当前画布 `activeCate` 才能查询。
- 不以 `CanvasAssetEntry` 或画布节点状态作为通用资产类型。
- 点击已保存资产卡片只能打开资产详情，不能隐式打开节点编辑器。
- 等待、运行、失败节点仍由画布节点界面展示，不能进入通用资产卡片。

### 统一后端职责

- Model：保存资产归属、来源、角色、类型、当前版本和状态。
- Asset Service：统一完成保存、幂等、版本追加、查询、权限校验和当前版本切换。
- Workbench/Team Service：解析可信的能力运行、会话消息和项目节点来源，调用 Asset Service，不复制资产保存规则。
- API：只解析请求和输出响应，不直接拼装资产版本或绕过 Service 查询。

---

## 三、分阶段实施任务

### Task 1：固定 Body 导航与页面职责

**Files:**
- Modify: `front/src/nodes/body-work/home/home-shell.tsx`
- Review: `front/src/nodes/body-work/project/project-page.tsx`
- Review: `front/src/nodes/body-work/home/function-page.tsx`
- Review: `front/src/nodes/body-work/home/dialogue-page.tsx`
- Review: `front/src/nodes/body-work/home/asset-page.tsx`

- [x] 将菜单顺序调整为“项目、对话、工具、资产”，并将当前前台“功能”文案统一为“工具”。
- [x] 项目作为默认入口；团队未启用项目时按菜单顺序回退到“对话”，没有可用角色时再回退“工具”，最后回退“资产”。
- [x] 保留 Body 外壳、左侧栏宽度、底部团队切换器、项目卡片和移动端抽屉的现有样式，不做无关重绘。
- [x] 核对工具只读取 `status + home_status` 均开启的团队能力；对话只读取当前团队启用的角色。

### Task 2：收敛资产数据契约并清理旧配置

**Files:**
- Modify: `model/asset/asset.go`
- Modify: `model/asset/version.go`
- Modify: `model/team/team_power.go`
- Modify: `model/team/role.go`
- Modify: `model/team/relation.go`
- Modify: `front/page/admin/team/team_power/update.json`
- Modify: `front/page/admin/team/role/update.json`
- Modify: `service/team/types.go`
- Modify: `service/team/graph.go`
- Modify: `service/team/release.go`
- Modify: `service/team/workbench.go`
- Modify: `service/team/frontend.go`
- Modify: `service/team/hook.go`
- Modify: `service/team/repo.go`
- Modify: `service/team/runtime.go`
- Modify: `service/team/runtime_role.go`
- Modify: `service/team/node_executor.go`
- Review: `model/team/flow_node.go`

- [x] 将资产来源规范为 `project / tool / dialogue`，业务角色规范为 `work / material`，资产类型规范为 `text / image / audio / video / richtext / file`。
- [x] 为逻辑资产增加可直接筛选的来源标识和来源名称，避免列表查询依赖逐条反查或根据版本 JSON 猜来源。
- [x] 项目来源继续保存 `project_id / asset_cate_id / node_key`，支持三级联动与项目弹窗默认筛选。
- [x] 版本 `source` 保存完整追溯信息，例如运行、节点运行、会话、消息、请求、父资产和父版本标识。
- [x] 删除团队能力、团队角色的模型字段、索引、关联、后台表单及发布/运行快照中的资产分类配置；项目流程节点和团队资产分类配置保持不变。
- [x] 项目中的能力/角色节点优先读取流程节点自己的可选资产分类；没有分类时仍按项目和节点保存素材。Body 工具和对话运行不再要求资产分类。
- [x] 不增加旧 `content/material/mixed/function/work` 协议的兼容读取分支；旧资产数据按已确认范围清理，实际执行清理前再次展示目标表和影响行数。

### Task 3：建立统一资产查询、详情和版本服务

**Files:**
- Modify: `service/asset/main.go`
- Modify: `service/asset/canvas.go`
- Modify: `service/asset/version_history.go`
- Create: `service/asset/query.go`
- Create: `service/asset/source.go`
- Modify: `service/workbench/service.go`
- Modify: `api/body/workbench.go`

- [x] 定义统一查询参数：团队、当前用户、来源、项目、资产分类、节点、具体工具/角色、可选作品/素材角色、类型、页码和每页数量；作品/素材参数只允许在项目来源下生效。
- [x] 资产列表只返回已保存且有效的逻辑资产，并直接携带当前版本卡片所需摘要；筛选和分页在服务端完成。
- [x] 提取通用资产详情、版本列表和“设为当前”方法，同时供项目资产和团队工作区资产使用，禁止复制两套详情逻辑。
- [x] 所有列表、详情、切换当前版本操作都校验当前用户和当前团队归属，不能通过资产 ID 跨团队读取。
- [x] 保留并扩展 `SaveVersion` 作为唯一版本写入入口，集中处理幂等键、版本号递增和当前版本更新。
- [x] API 保持薄层，只将请求转为 Service 查询，不在接口层重新推断来源。

### Task 4：从画布提取统一资产浏览与详情组件

**Files:**
- Create: `front/src/nodes/body-work/asset/asset-types.ts`
- Create: `front/src/nodes/body-work/asset/asset-api.ts`
- Create: `front/src/nodes/body-work/asset/asset-browser.tsx`
- Create: `front/src/nodes/body-work/asset/asset-source-filters.tsx`
- Create: `front/src/nodes/body-work/asset/asset-card.tsx`
- Create: `front/src/nodes/body-work/asset/asset-detail-dialog.tsx`
- Create: `front/src/nodes/body-work/asset/asset-preview.tsx`
- Create: `front/src/nodes/body-work/asset/asset.css`
- Modify: `front/src/nodes/body-work/space/space-asset-viewer.tsx`
- Modify: `front/src/nodes/body-work/space/space-page.tsx`
- Review: `front/src/nodes/body-work/space/node-detail/node-detail-dialog.tsx`

- [x] 先复用现有画布资产卡片、分页、空状态、媒体预览、详情和版本切换的稳定实现，再抽离对画布状态的依赖。
- [x] `AssetBrowser` 通过显式 props 接收初始筛选、固定团队、是否可选择和选择回调；组件内部不判断自己位于资产页还是项目弹窗。
- [x] `AssetSourceFilters` 根据当前来源和团队资产分类数量决定是否展示“全部/作品/素材”：项目来源且存在分类时展示，其余情况隐藏并清除失效角色条件。
- [x] 资产列表统一使用响应式卡片网格；卡片点击打开 `AssetDetailDialog`。
- [x] 详情弹窗统一展示六种资产类型、来源路径、当前版本和版本列表；选择历史版本先预览，只有“设为当前”才更新卡片所用版本。
- [x] 普通浏览卡片不显示“使用”；`@资产` 等选择场景通过同一张卡片的操作槽显示“使用”。
- [x] 桌面端按可用宽度自动调整列数；移动端减少列数，筛选器可折叠/横向滚动，详情使用全屏或接近全屏布局，文字和按钮不得溢出。

### Task 5：替换 Body 资产页和项目资产弹窗

**Files:**
- Modify: `front/src/nodes/body-work/home/asset-page.tsx`
- Modify: `front/src/nodes/body-work/space/space-asset-viewer.tsx`
- Modify: `front/src/nodes/body-work/space/space-page.tsx`

- [x] 删除当前资产页的左列表/右预览临时布局，直接渲染通用 `AssetBrowser` 卡片网格。
- [x] Body 资产页默认使用“全部来源、全部类型”，并受当前团队切换控制。
- [x] 项目资产弹窗也直接渲染同一 `AssetBrowser`，自动传入当前项目、可选资产分类和可选节点的初始值；没有分类时不传分类筛选。
- [x] 用户更改筛选后，两个入口的筛选结构、卡片、详情、分页和空状态完全一致。
- [x] 画布只在节点已成功保存为素材后展示对应资产；运行状态继续留在节点本身。

### Task 6：接入工具手动保存素材

**Files:**
- Modify: `service/workbench/service.go`
- Modify: `api/body/workbench.go`
- Modify: `front/src/nodes/body-work/home/function-page.tsx`
- Modify: `front/src/nodes/body-work/home/workbench-api.ts`
- Review: 现有能力参数表单、流式运行和结果渲染组件

- [x] 继续复用现有能力参数定义、`prompt` 参数、流式运行和统一结果渲染，不复制后台能力执行器。
- [x] 只有成功且包含可保存结果的运行展示“保存为素材”；运行完成本身不写入资产。
- [x] 保存请求只提交可信运行标识和可选名称，后端根据运行记录解析能力、团队、结果类型和来源，不能信任前端伪造来源。
- [x] 普通运行结果创建新素材；只有从资产详情明确发起的重新生成请求才携带目标资产并追加版本，普通 `@` 引用不触发追加。
- [x] 保存成功后按钮进入已保存状态；重复点击命中幂等结果，并可打开刚保存的资产详情。

### Task 7：接入对话手动保存素材

**Files:**
- Modify: `api/body/workbench_chat.go`
- Modify: `service/workbench/service.go`
- Modify: `service/agent/runtime/chat/access.go`
- Modify: `service/agent/runtime/chat/message_repository.go`
- Modify: `front/src/nodes/body-work/home/dialogue-page.tsx`
- Modify: `front/src/nodes/show/agent-chat/index.tsx`
- Review: 现有 Agent Chat 消息、会话列表和结果渲染组件

- [x] 继续复用 Agent Chat 组件、自动打开最近会话和现有流式消息流程。
- [x] 只在可保存的智能体回复上提供“保存为素材”，发送和回复完成时不自动写资产。
- [x] 保存请求以会话/消息标识为依据，后端校验消息属于当前用户、当前团队和当前角色。
- [x] 普通回复创建新素材；只有从资产详情明确发起的继续编辑请求才携带目标资产并追加版本，普通 `@` 引用不触发追加。
- [x] 同一消息重复保存保持幂等，保存后可打开统一资产详情弹窗。

### Task 8：统一项目自动素材与作品保存

**Files:**
- Modify: `service/asset/main.go`
- Modify: `service/project/run.go`
- Modify: `service/project/service.go`
- Modify: `service/project/workspace_node_execution.go`
- Modify: `service/project/workspace_run.go`
- Modify: `service/team/frontend.go`
- Modify: `service/team/node_executor.go`
- Modify: `front/src/nodes/body-work/space/space-page.tsx`
- Modify: `front/src/nodes/body-work/space/space-api.ts`

- [x] 项目节点只有成功并产出有效结果时自动保存为素材；同一项目、可选资产分类、节点的后续成功运行追加版本，没有分类时使用“项目 + 节点”确定逻辑素材。
- [x] 项目最终保存/发布结果只有绑定有效资产分类时才写为作品；团队没有资产分类时不创建作品，同一逻辑作品后续保存追加版本。
- [x] 节点取消、失败、运行中和空结果不创建资产，也不生成占位版本。
- [x] 统一调用 Asset Service，不在项目 Service 内维护第二套版本号和当前版本规则。

### Task 9：接入 `@资产` 与 `#会话信息`

**Files:**
- Modify: `front/src/nodes/body-work/space/space-prompt-composer.tsx`
- Modify: `front/src/nodes/show/agent-chat/index.tsx`
- Modify: `front/src/nodes/show/agent-chat/reference.ts`
- Modify: `/data/project/shemic/front/src/components/reference-composer/types.ts`
- Modify: `/data/project/shemic/front/src/components/reference-composer/index.tsx`
- Modify: `/data/project/shemic/front/src/components/reference-composer/text.ts`
- Modify: `/data/project/shemic/front/src/components/reference-composer/serialize.ts`
- Modify: `/data/project/shemic/front/src/components/reference-composer/picker.tsx`
- Reuse: `front/src/nodes/body-work/asset/asset-browser.tsx`
- Reuse: `front/src/nodes/body-work/asset/asset-card.tsx`

- [x] 将共享 composer 的单一硬编码 `@` 扩展为按触发符注册引用提供器；画布/工具只注册 `@资产`，Agent Chat 同时注册 `@资产` 和 `#会话信息`。
- [x] 将 Agent Chat 现有会话信息提供器的触发符从 `@` 改为 `#`，保持原会话/消息选择、预览和提交协议。
- [x] 为所有 `prompt` 参数输入框接入 `@资产`；普通文本、数字、选择器等非 prompt 参数不接入。
- [x] `@资产` 弹窗复用 `AssetBrowser`，只启用选择行为并在卡片上显示“使用”。
- [x] 项目内输入框传入当前项目和可选资产分类初始筛选；没有分类时只传项目，工具和智能体输入框默认查看当前团队全部可用资产。
- [x] 根据 prompt 参数允许的资产类型过滤候选项；不支持的资产卡片不展示，而不是选择后再报错。
- [x] 引用序列化同时保存触发符、引用类型、资产 ID 和当前版本 ID，不能再假定所有标签都以 `@` 开头；后端运行前再次校验归属和版本有效性。

### Task 10：清理、静态检查与手动验收

**Files:**
- Review: 本计划涉及的全部文件

- [x] 删除旧资产页面临时类型、重复预览器、前端全量拉取后筛选和项目/团队两套详情查询分支。
- [x] 检查资产类型、来源、角色和筛选选项只在共享契约/映射中定义一次，页面不得各自维护字符串分支。
- [x] 对 Go 文件执行 `gofmt -d` 检查，对 JSON 执行 `jq empty`，执行 `git diff --check` 和 Dever 规范审计；按项目要求不运行 build 或任何 test。
- [x] 实际清理旧资产数据前列出目标表、行数和不可恢复影响，确认后再执行。
- [ ] 由用户在 `dever run` 环境手动验收桌面端和手机端完整流程。

旧数据清理记录（2026-07-17）：执行前 `shemic_bot_asset` 84 行、`shemic_bot_asset_version` 453 行、`shemic_bot_body_canvas` 1 行、`shemic_bot_body_canvas_brain` 0 行、`shemic_bot_project_canvas` 9 行、`shemic_bot_workspace_asset_lock` 0 行，共 547 行。经用户确认后已在同一事务中清理，事务提交后复核六张表均为 0 行。

---

## 四、手动验收清单

- [ ] Body 左侧顺序为“项目、对话、工具、资产”，原有布局、项目卡片和团队切换样式未被重做。
- [ ] 切换团队后，四个页面的数据立即按当前团队隔离。
- [ ] 工具页仅展示启用且勾选“首页”的团队能力；对话页展示当前团队角色并自动打开最近会话。
- [ ] 独立资产页和项目资产弹窗的筛选、卡片、详情、版本和移动端交互完全一致。
- [ ] 项目弹窗默认选中当前项目和可用资产分类；没有分类时直接按项目/节点筛选，并且都可切换到全部来源。
- [ ] 项目来源且团队有资产分类时展示“全部/作品/素材”筛选；团队没有资产分类时隐藏该筛选并只展示项目素材，其他来源也不展示。
- [ ] 项目成功节点自动产生素材版本；失败、运行中、未生成节点不出现在资产中。
- [ ] 工具结果和对话回复不会自动保存，点击“保存为素材”后才出现，重复点击不重复写入。
- [ ] 有有效资产分类的项目最终输出可以保存为作品；团队没有资产分类时没有作品但仍可有项目素材，工具和对话永远不会产生作品。
- [ ] 六种资产类型都能在卡片和详情中正确预览或下载，详情可以切换版本。
- [ ] `@` 只选择已保存资产并使用当前版本；智能体 `#` 仍能选择原会话信息。
- [ ] 手机端菜单、筛选、卡片、保存按钮和全屏详情无重叠、溢出或不可点击区域。

---

## 五、明确不在本期范围内

- 不新增独立运行历史页面。
- 不把工具运行过程或智能体每条消息自动写入资产。
- 不把失败、运行中、未生成的项目节点包装为资产。
- 不为工具和团队角色增加资产分类配置。
- 不维护旧资产字段和旧画布资产数据的兼容分支。
- 不另做一套项目资产弹窗或一套 `@` 专用资产卡片。
