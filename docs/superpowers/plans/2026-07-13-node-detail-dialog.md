# Unified Node Detail Dialog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将所有画布节点结果统一到可编辑详情弹窗，修正版本不可变、自动保存竞态、重复生成版本和历史加载性能问题。

**Architecture:** 后端继续复用现有 asset/project Service，把当前版本更新、生成版本幂等、历史分页和恢复版本定义成明确业务动作。前端使用共享 `NodeDetailDialog` 外壳、内容适配器、版本面板和串行草稿保存 hook；`space-page.tsx` 只负责打开弹窗及合并节点更新。

**Tech Stack:** Go、Dever ORM/Service/API、React、TypeScript、Tiptap `RichTextEditor`、现有 storyboard 解析与画布资产协议。

**Design:** `docs/superpowers/specs/2026-07-13-node-detail-dialog-design.md`

**Verification constraint:** 按项目要求，不运行 `npm run build`、任何 build、Go test、npm test 或其它测试命令。只执行 `gofmt`、定向引用检查、Dever 静态审计和 `git diff --check`，最终交互由用户手动验证。

---

## File Map

### Backend

- Modify `model/asset/version.go`: 增加版本更新时间和幂等查询索引。
- Modify `service/asset/main.go`: 当前版本更新约束、创建时间语义、生成版本幂等、精简默认资产响应。
- Create `service/asset/version_history.go`: 版本摘要分页、单版本详情和恢复版本。
- Modify `service/project/service.go`: 暴露项目权限范围内的版本业务方法，移除直接切换旧版本。
- Modify `api/body/project.go`: 增加历史分页、历史详情、恢复版本薄 API，删除直接切换 API。

### Frontend

- Modify `front/src/nodes/body-work/space/types.ts`: 完整版本元数据、详情和分页类型。
- Modify `front/src/nodes/body-work/space/space-model.ts`: 统一资产和版本响应规范化。
- Modify `front/src/nodes/body-work/space/space-api.ts`: 新详情、分页、历史详情、恢复和编辑 API。
- Modify `front/src/nodes/body-work/space/space-storyboard-view.tsx`: 提取受控分镜表格供详情编辑复用。
- Create `front/src/nodes/body-work/space/node-detail/node-detail-content.ts`: 所有结果内容的正反向适配和摘要。
- Create `front/src/nodes/body-work/space/node-detail/use-node-detail-draft.ts`: 串行自动保存状态机。
- Create `front/src/nodes/body-work/space/node-detail/node-detail-header.tsx`: 标题、保存状态和操作。
- Create `front/src/nodes/body-work/space/node-detail/node-detail-editor.tsx`: 富文本、分镜和文件编辑适配器。
- Create `front/src/nodes/body-work/space/node-detail/version-panel.tsx`: 紧凑版本列表和分页状态。
- Create `front/src/nodes/body-work/space/node-detail/node-detail-dialog.tsx`: 详情加载、历史预览、恢复和关闭编排。
- Modify `front/src/nodes/body-work/space/space-page.tsx`: 接入新弹窗，删除旧详情实现和重复 helper。
- Modify `front/src/nodes/body-work/space/space-assets.ts`: 合并轻量历史项和当前完整版本，不要求所有历史含 content。
- Modify `front/src/nodes/body-work/space/space.css`: 用单一区域替换旧详情样式及后置覆盖。

---

### Task 1: 固化当前版本更新与版本时间语义

**Files:**
- Modify: `model/asset/version.go`
- Modify: `service/asset/main.go:205-251`

- [ ] **Step 1: 给版本模型增加更新时间**

在 `Version` 中保留创建时间并增加独立更新时间：

```go
CreatedAt time.Time `dorm:"comment:创建时间"`
UpdatedAt time.Time `dorm:"comment:更新时间"`
```

在 `VersionIndex` 增加面向幂等查询的普通索引，不设唯一约束，避免空请求 ID 的人工保存相互冲突：

```go
AssetRequestNode struct{} `index:"asset_id,request_id,node_key"`
```

- [ ] **Step 2: 创建版本时同时写入两个时间**

在 `insertAssetVersionWithRetry` 的记录中增加：

```go
"created_at": now,
"updated_at": now,
```

在 `VersionToMap` 中输出 `updated_at`；旧数据的零值由响应 helper 回退为 `created_at`：

```go
updatedAt := row.UpdatedAt
if updatedAt.IsZero() {
    updatedAt = row.CreatedAt
}
```

- [ ] **Step 3: 只允许修改资产当前版本**

在 `UpdateVersionContent` 找到版本后增加当前指针校验：

```go
if version.ID != asset.VersionID {
    return nil, nil, fmt.Errorf("历史版本不可编辑，请先恢复为新版本")
}
```

更新记录只写正文和更新时间，不再覆盖创建时间：

```go
assetmodel.NewVersionModel().Update(ctx, map[string]any{"id": version.ID}, map[string]any{
    "content":    jsonText(EnsureDocument(content, asset.Kind)),
    "updated_at": time.Now(),
})
```

资产的 `version_id` 已经等于当前版本，不在编辑接口里重复改变它，只保持 `status` 为 current。

- [ ] **Step 4: 格式化并检查本任务差异**

Run:

```bash
gofmt -w model/asset/version.go service/asset/main.go
git diff --check -- model/asset/version.go service/asset/main.go
git diff -- model/asset/version.go service/asset/main.go
```

Expected: `created_at` 只在插入版本时写入；更新正文只改变 `updated_at`；没有修改其它 model 或生成文件。

---

### Task 2: 让节点生成版本具备业务幂等

**Files:**
- Modify: `service/asset/main.go:113-188,426-446`

- [ ] **Step 1: 增加稳定版本查询 helper**

在 asset Service 内增加仅对非空运行键生效的查询：

```go
func findSavedVersion(ctx context.Context, assetID uint64, requestID string, nodeKey string) *assetmodel.Version {
    requestID = strings.TrimSpace(requestID)
    nodeKey = strings.TrimSpace(nodeKey)
    if assetID == 0 || requestID == "" || nodeKey == "" {
        return nil
    }
    return assetmodel.NewVersionModel().Find(ctx, map[string]any{
        "asset_id":  assetID,
        "request_id": requestID,
        "node_key":   nodeKey,
    })
}
```

该 helper 不按 content 判断；同一 `request_id + node_key` 代表同一次节点结果落库。

- [ ] **Step 2: 在资产锁内复用已保存版本**

`saveVersion` 找到或创建 asset 后、调用 `insertAssetVersionWithRetry` 前执行：

```go
if version := findSavedVersion(ctx, asset.ID, req.RequestID, req.NodeKey); version != nil {
    assetModel.Update(ctx, map[string]any{"id": asset.ID}, map[string]any{
        "kind":       req.Kind,
        "role":       req.Role,
        "version_id": version.ID,
        "status":     assetmodel.StatusCurrent,
    })
    asset = assetModel.Find(ctx, map[string]any{"id": asset.ID})
    if asset == nil {
        return nil, nil, fmt.Errorf("读取资产失败")
    }
    return asset, version, nil
}
```

保留现有 `withAssetSaveLock`。锁负责并发串行，查询负责重复请求复用，不用锁代替幂等。

- [ ] **Step 3: 确认所有画布生成路径传递稳定键**

Run:

```bash
rg -n 'RequestID:|NodeKey:' service/project service/team | rg 'SaveVersionRequest|SaveAssetRequest|RequestID:|NodeKey:'
```

检查 `saveWorkspaceCanvasMaterial`、保存功能节点和单智能体持久化都传递运行 request ID 与画布 node key。缺失 node key 的非画布调用保持原行为，不被错误去重。

- [ ] **Step 4: 格式化并检查差异**

Run:

```bash
gofmt -w service/asset/main.go
git diff --check -- service/asset/main.go model/asset/version.go
```

Expected: 相同运行键第二次进入 `SaveVersion` 时返回已有版本，空运行键仍创建新版本。

---

### Task 3: 拆出版本历史分页、详情与恢复业务

**Files:**
- Create: `service/asset/version_history.go`
- Modify: `service/asset/main.go:99-110,254-266,393-407`

- [ ] **Step 1: 定义分页请求和轻量响应**

在新文件中定义：

```go
package asset

type VersionPageRequest struct {
    Page     int
    PageSize int
}

type RestoreVersionRequest struct {
    ProjectID uint64
    AssetID   uint64
    VersionID uint64
    RequestID string
    NodeKey   string
}

const (
    defaultVersionPageSize = 20
    maxVersionPageSize     = 50
)
```

增加 `normalizeVersionPage`，把 page 钳制为至少 1，pageSize 默认 20、最大 50。

- [ ] **Step 2: 实现版本摘要分页**

实现：

```go
func (s Service) ProjectVersionPage(
    ctx context.Context,
    projectID uint64,
    assetID uint64,
    req VersionPageRequest,
) (map[string]any, error)
```

流程固定为：校验 `FindProjectAsset`；使用 `Count` 计算总数；用 ORM options 的 `page/pageSize/order` 读取本页；通过 `VersionSummaryToMap` 输出 `id/asset_id/run_id/node_run_id/release_id/request_id/node_key/source/version/summary/created_at/updated_at`，不输出 content。

分页响应结构：

```go
return map[string]any{
    "items":      items,
    "page":       page,
    "page_size":  pageSize,
    "total":      total,
    "has_more":   int64(page*pageSize) < total,
}, nil
```

摘要从本页版本 content 中提取并限制为 120 个 rune；图片、视频、音频、文件没有正文时分别返回“图片内容”“视频内容”“音频内容”“文件内容”。

- [ ] **Step 3: 实现单个历史版本详情**

实现：

```go
func (s Service) ProjectVersionDetail(
    ctx context.Context,
    projectID uint64,
    assetID uint64,
    versionID uint64,
) (map[string]any, error)
```

必须同时校验 asset 属于 project、version 属于 asset，然后返回：

```go
return map[string]any{"version": VersionToMap(*version)}, nil
```

- [ ] **Step 4: 实现恢复为新版本**

`RestoreProjectVersion` 校验项目、资产和来源版本后，复用 `SaveVersion`，不直接改旧版本或资产指针：

```go
source := map[string]any{
    "action":                   "restore",
    "restored_from_version_id": version.ID,
    "restored_from_version":    version.Version,
}
asset, restored, err := s.SaveVersion(ctx, SaveVersionRequest{
    ProjectID:   asset.ProjectID,
    BodyID:      asset.BodyID,
    TeamID:      asset.TeamID,
    FlowID:      asset.FlowID,
    AssetCateID: asset.AssetCateID,
    RequestID:   req.RequestID,
    NodeKey:     req.NodeKey,
    Source:      source,
    Name:        asset.Name,
    Kind:        asset.Kind,
    Role:        asset.Role,
    Content:     jsonValue(version.Content),
    Sort:        asset.Sort,
})
```

返回 `AssetDetailMap` 和新版本。前端恢复成功后重新读取版本第一页。

- [ ] **Step 5: 精简默认资产详情响应**

从 `AssetDetailMap` 删除无条件的 `listVersions`，使节点执行和普通资产列表不携带全部历史正文。

`ProjectDetail` 改为读取当前 asset 和第一页摘要：

```go
page, err := service.ProjectVersionPage(ctx, projectID, assetID, VersionPageRequest{})
if err != nil {
    return nil, err
}
return map[string]any{
    "asset":         service.AssetDetailMap(ctx, *asset, nil),
    "versions":      page["items"],
    "version_total": page["total"],
    "has_more":      page["has_more"],
}, nil
```

删除已经没有调用者的全量 `listVersions` helper。

- [ ] **Step 6: 格式化并检查本任务文件**

Run:

```bash
gofmt -w service/asset/main.go service/asset/version_history.go
git diff --check -- service/asset/main.go service/asset/version_history.go
rg -n 'listVersions|ProjectVersionPage|ProjectVersionDetail|RestoreProjectVersion' service/asset
```

Expected: 默认资产响应不再包含全部历史 content，分页和历史详情分别读取。

---

### Task 4: 暴露项目版本 API 并移除危险切换语义

**Files:**
- Modify: `service/project/service.go:40-46,175-253`
- Modify: `api/body/project.go:63-126`

- [ ] **Step 1: 增加 project Service 方法**

新增权限包装方法：

```go
func (s Service) AssetVersions(ctx context.Context, projectID uint64, assetID uint64, page int, pageSize int) (map[string]any, error)
func (s Service) AssetVersionDetail(ctx context.Context, projectID uint64, assetID uint64, versionID uint64) (map[string]any, error)
func (s Service) RestoreAssetVersion(ctx context.Context, projectID uint64, req assetservice.RestoreVersionRequest) (map[string]any, error)
```

三个方法先调用 `requireProject`。恢复动作继续使用 `withWorkspaceAssetLock`，锁 key 为 `restore + assetID + versionID + requestID`，内部调用 `s.asset.RestoreProjectVersion`。

- [ ] **Step 2: 删除直接切换旧版本 Service**

删除 `UseAssetVersion`。保留 `UpdateAssetVersion`，它现在只能更新当前版本。

Run:

```bash
rg -n 'UseAssetVersion|UseVersion\(' . --glob '!front/dist/**'
```

在前端迁移完成前允许暂时看到 `space-api.ts` 和旧弹窗调用；Task 9 完成后必须归零。

- [ ] **Step 3: 增加薄 API 方法**

在 `api/body/project.go` 增加：

```go
func (Project) GetAssetVersions(c *server.Context) error
func (Project) GetAssetVersionDetail(c *server.Context) error
func (Project) PostRestoreAssetVersion(c *server.Context) error
```

参数协议：

```text
GET  project/asset_versions       project_id, asset_id, page, page_size
GET  project/asset_version_detail project_id, asset_id, version_id
POST project/restore_asset_version project_id, asset_id, version_id, request_id, node_key
```

API 只做参数绑定和 `WriteJSON`，不实现权限、复制或版本号逻辑。删除 `PostUseAssetVersion`。

- [ ] **Step 4: 格式化并做定向引用检查**

Run:

```bash
gofmt -w service/project/service.go api/body/project.go
git diff --check -- service/project/service.go api/body/project.go
rg -n 'AssetVersions|AssetVersionDetail|RestoreAssetVersion|PostUseAssetVersion' service/project api/body/project.go
```

Expected: 三个新 API 均为薄封装，旧直接切换 API 已删除。

---

### Task 5: 定义前端版本数据契约与 API

**Files:**
- Modify: `front/src/nodes/body-work/space/types.ts:146-174`
- Modify: `front/src/nodes/body-work/space/space-model.ts:397-438`
- Modify: `front/src/nodes/body-work/space/space-api.ts:215-270`
- Modify: `front/src/nodes/body-work/space/space-assets.ts`

- [ ] **Step 1: 扩展版本类型并定义分页结果**

使用以下结构替换当前不完整的版本类型：

```ts
export type AssetVersion = {
  id: number;
  asset_id: number;
  run_id?: number;
  node_run_id?: number;
  release_id?: number;
  request_id?: string;
  node_key?: string;
  source?: Record<string, unknown>;
  version: number;
  summary?: string;
  content?: unknown;
  created_at?: string;
  updated_at?: string;
};

export type AssetVersionPage = {
  items: AssetVersion[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

export type SpaceAssetDetail = {
  asset: ProjectAsset;
  versions: AssetVersion[];
  versionTotal: number;
  hasMore: boolean;
};
```

- [ ] **Step 2: 统一版本响应规范化**

从 `space-model.ts` 导出 `normalizeAssetVersion` 和 `normalizeAssetVersions`。补齐 `request_id/node_key/source/summary/updated_at`，并让 `normalizeProjectAsset` 继续只规范 asset 本身。

`space-assets.ts` 的历史合并必须允许摘要项没有 content：当前完整版本按 id 覆盖同 id 摘要，其他历史摘要保持轻量结构。

- [ ] **Step 3: 改造详情和历史 API**

`fetchSpaceAssetDetail` 返回 `SpaceAssetDetail`，从顶层读取 asset、versions、version_total、has_more。

新增：

```ts
export async function fetchSpaceAssetVersions(input: {
  projectId: number;
  assetId: number;
  page: number;
  pageSize?: number;
}): Promise<AssetVersionPage>

export async function fetchSpaceAssetVersionDetail(input: {
  projectId: number;
  assetId: number;
  versionId: number;
}): Promise<AssetVersion>

export async function restoreSpaceAssetVersion(input: {
  projectId: number;
  assetId: number;
  versionId: number;
  requestId: string;
  nodeKey: string;
}): Promise<ProjectAsset>
```

删除 `useSpaceAssetVersion`。`saveSpaceAssetEditVersion` 移除没有被后端消费的 `requestId` 参数和请求字段，避免伪幂等语义。

- [ ] **Step 4: 做静态类型引用检查**

Run:

```bash
rg -n 'SpaceAssetDetail|AssetVersionPage|fetchSpaceAssetVersions|fetchSpaceAssetVersionDetail|restoreSpaceAssetVersion|useSpaceAssetVersion' front/src/nodes/body-work/space
git diff --check -- front/src/nodes/body-work/space/types.ts front/src/nodes/body-work/space/space-model.ts front/src/nodes/body-work/space/space-api.ts front/src/nodes/body-work/space/space-assets.ts
```

Expected: 旧切换函数只可能暂时残留在尚未迁移的旧详情组件，Task 9 后必须完全删除。

---

### Task 6: 提取统一内容适配器和受控分镜表格

**Files:**
- Create: `front/src/nodes/body-work/space/node-detail/node-detail-content.ts`
- Modify: `front/src/nodes/body-work/space/space-storyboard-view.tsx`

- [ ] **Step 1: 定义详情编辑模型**

在 `node-detail-content.ts` 定义：

```ts
export type NodeDetailContentMode = "rich" | "storyboard" | "file";

export type NodeDetailEditableContent = {
  mode: NodeDetailContentMode;
  value: unknown;
  format: "json" | "markdown";
  summary: string;
  downloadUrl: string;
};

export function resolveNodeDetailContent(
  node: SpaceCanvasNode,
  version?: AssetVersion,
): NodeDetailEditableContent

export function serializeNodeDetailContent(
  content: NodeDetailEditableContent,
): unknown

export function nodeDetailContentFingerprint(
  content: NodeDetailEditableContent,
): string
```

fingerprint 使用规范化后的可保存值生成稳定 JSON 字符串，不使用时间或组件状态。

- [ ] **Step 2: 按固定优先级解析所有节点结果**

原始值优先级：显式 version content、节点当前 asset version content、`resultOutput`、`result.output`、description。

解析顺序：

```text
storyboard -> rich document -> 图文/媒体协议转有序 rich document -> Markdown -> file -> 只读 fallback
```

把旧详情区域中的 `nodeDetailEditorSource`、媒体收集、媒体富文本节点、Markdown 文本和保存序列化 helper 移入该文件。继续复用 `richDocument`、`normalizeEnergonOutput`、`parseStoryboardOutput` 和 `plainMarkdownTextFromRichOutput`，不创建第二套协议解析。

图片、视频、音频必须生成 Tiptap 的 `editorMediaImage/editorMediaVideo/editorMediaAudio` 节点；无法识别的结构化协议不得直接作为 JSON 正文。

- [ ] **Step 3: 把分镜表格拆成受控展示组件**

从 `StoryboardView` 提取并导出：

```ts
export function StoryboardTable({
  storyboard,
  editable,
  disabled,
  onChange,
}: {
  storyboard: StoryboardDocument;
  editable?: boolean;
  disabled?: boolean;
  onChange?: (storyboard: StoryboardDocument) => void;
})
```

`StoryboardTable` 只处理行增删、排序和字段变更，不保存。现有画布 `StoryboardView` 保留自己的节点内保存包装，并通过 `StoryboardTable` 渲染；新详情编辑器直接使用受控表格和统一草稿 hook。不得复制表格 JSX。

- [ ] **Step 4: 检查解析职责没有重复**

Run:

```bash
rg -n 'function nodeDetail(EditorSource|Media|Markdown|Rich)|StoryboardTable|resolveNodeDetailContent' front/src/nodes/body-work/space
git diff --check -- front/src/nodes/body-work/space/node-detail/node-detail-content.ts front/src/nodes/body-work/space/space-storyboard-view.tsx
```

Expected: 详情协议解析只有 `node-detail-content.ts` 一个入口；分镜表格 JSX 只有一份。

---

### Task 7: 实现串行详情草稿保存状态机

**Files:**
- Create: `front/src/nodes/body-work/space/node-detail/use-node-detail-draft.ts`

- [ ] **Step 1: 定义 hook 契约**

```ts
export type NodeDetailDraftStatus =
  | "saved"
  | "dirty"
  | "saving"
  | "error";

export function useNodeDetailDraft<T>({
  identity,
  initialValue,
  enabled,
  fingerprint,
  onSave,
}: {
  identity: string;
  initialValue: T;
  enabled: boolean;
  fingerprint: (value: T) => string;
  onSave: (value: T) => Promise<void>;
}): {
  value: T;
  status: NodeDetailDraftStatus;
  setValue: (value: T) => void;
  retry: () => void;
  flush: () => Promise<boolean>;
}
```

- [ ] **Step 2: 使用 revision 和单请求队列实现保存**

内部 refs 至少包括：

```ts
const valueRef = useRef(initialValue);
const revisionRef = useRef(0);
const savedRevisionRef = useRef(0);
const savedFingerprintRef = useRef(fingerprint(initialValue));
const inFlightRef = useRef<Promise<void> | null>(null);
const timerRef = useRef<number | null>(null);
const generationRef = useRef(0);
```

规则：`setValue` 只在 fingerprint 变化时增加 revision；停止输入 1200ms 后保存；请求在途时不并发，新 revision 在 finally 后只保存最新值；响应只有在 generation 和 revision 仍有效时才能写 `saved`。

- [ ] **Step 3: 实现失败、重试和 flush**

- 保存失败设置 `error`，保留 revision 和草稿，不自动再次调度。
- `retry` 清除错误并立即调度当前最新 revision。
- `flush` 清除 debounce，等待当前请求，然后继续保存最新 revision，全部成功返回 `true`，失败返回 `false`。
- identity 变化和卸载递增 generation，旧响应不能改变新详情状态。
- 外部 `initialValue` 变化时，只有 identity 改变或本地已保存才重置，不能覆盖 dirty 草稿。

- [ ] **Step 4: 定向检查状态机约束**

Run:

```bash
rg -n 'setTimeout|inFlightRef|revisionRef|generationRef|flush|retry' front/src/nodes/body-work/space/node-detail/use-node-detail-draft.ts
git diff --check -- front/src/nodes/body-work/space/node-detail/use-node-detail-draft.ts
```

Expected: hook 内只有一个保存入口；错误状态没有定时自动重试；status 不参与 debounce effect 的重复调度。

---

### Task 8: 创建详情展示组件

**Files:**
- Create: `front/src/nodes/body-work/space/node-detail/node-detail-header.tsx`
- Create: `front/src/nodes/body-work/space/node-detail/node-detail-editor.tsx`
- Create: `front/src/nodes/body-work/space/node-detail/version-panel.tsx`

- [ ] **Step 1: 实现紧凑顶部栏**

`NodeDetailHeader` props：

```ts
type NodeDetailHeaderProps = {
  title: string;
  kind: string;
  status: NodeDetailDraftStatus;
  updatedAt: string;
  downloadUrl?: string;
  onRetry: () => void;
  onClose: () => void;
};
```

使用现有节点类型图标和 Lucide `Download/X/RotateCw`。状态只显示短文本；仅 error 状态可以点击重试；所有图标按钮包含 `aria-label` 和 tooltip。

- [ ] **Step 2: 实现统一编辑入口**

`NodeDetailEditor` 接收 `NodeDetailEditableContent`、`readOnly`、`onChange`：

- rich 模式使用 compat `RichTextEditor`，通过 adapter 在 editor value 与详情 value 之间转换。
- storyboard 模式使用 Task 6 的受控 `StoryboardTable`。
- file 模式显示附件块、下载操作和可编辑名称/说明，不显示原始协议 JSON。
- 历史预览统一传 `readOnly=true`，不通过 CSS 假装只读。
- 无法解析时显示明确错误、下载原始数据入口和返回当前版本操作，不渲染空编辑器。

- [ ] **Step 3: 实现版本面板**

`VersionPanel` props：

```ts
type VersionPanelProps = {
  items: AssetVersion[];
  currentVersionId: number;
  selectedVersionId: number;
  total: number;
  hasMore: boolean;
  loading: boolean;
  error: string;
  onSelect: (version: AssetVersion) => void;
  onLoadMore: () => void;
  onRetry: () => void;
};
```

每项只显示版本号、当前标记、`updated_at || created_at`、来源标签和一行 summary。列表项不负责读取正文、不调用恢复接口。加载失败在面板内部显示局部重试。

- [ ] **Step 4: 检查展示组件边界**

Run:

```bash
rg -n 'fetchSpace|saveSpace|restoreSpace' front/src/nodes/body-work/space/node-detail/node-detail-header.tsx front/src/nodes/body-work/space/node-detail/node-detail-editor.tsx front/src/nodes/body-work/space/node-detail/version-panel.tsx
```

Expected: 三个展示组件不直接调用 API，副作用只留给 dialog 和 draft hook。

---

### Task 9: 编排新弹窗并接入画布

**Files:**
- Create: `front/src/nodes/body-work/space/node-detail/node-detail-dialog.tsx`
- Modify: `front/src/nodes/body-work/space/space-page.tsx:40-100,1735-1752,3133-4230`
- Modify: `front/src/nodes/body-work/space/space.css:1906-2395,2537-2615,7030-7118,7683-7693`

- [ ] **Step 1: 实现详情加载和当前草稿**

`NodeDetailDialog` 保持当前外部契约：

```ts
export function NodeDetailDialog({
  projectId,
  node,
  onAssetUpdated,
  onClose,
}: {
  projectId: number;
  node: SpaceCanvasNode;
  onAssetUpdated?: (asset: ProjectAsset) => void;
  onClose: () => void;
})
```

打开时调用 `fetchSpaceAssetDetail`。当前版本交给 `resolveNodeDetailContent` 和 `useNodeDetailDraft`；保存时调用 `saveSpaceAssetEditVersion`，成功后复用 `mergeProjectAssetVersionHistory` 并通过 `onAssetUpdated` 把完整 asset 交回父组件。弹窗不复制画布节点 patch 逻辑。

没有稳定 asset/version 的节点详情保持只读，不伪造可保存状态。

- [ ] **Step 2: 实现历史只读预览和请求竞态保护**

选择历史版本前调用 `draft.flush()`；失败时留在当前编辑状态。历史正文通过 `fetchSpaceAssetVersionDetail` 按需读取，并使用 AbortController 或递增 request sequence，只接受最后一次选择。

历史模式必须满足：

```text
selectedVersionId != currentVersionId
-> editor readOnly
-> 不调用 update_asset_version
-> 显示“返回当前版本 / 恢复为新版本”提示条
```

- [ ] **Step 3: 实现恢复为新版本**

在 `node-detail-dialog.tsx` 定义恢复请求 ID helper，确保同一次点击及其网络重试复用同一个 ID，不沿用会随时间桶变化的画布保存 helper：

```ts
function createNodeDetailRequestId(purpose: string, nodeId: string) {
  const random =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${purpose}-${nodeId}-${random}`.slice(0, 64);
}
```

恢复按钮调用：

```ts
restoreSpaceAssetVersion({
  projectId,
  assetId: asset.id,
  versionId: selectedVersion.id,
  requestId: createNodeDetailRequestId("restore", node.id),
  nodeKey: node.id,
})
```

成功后通过 `onAssetUpdated` 更新节点、返回当前模式并重新加载版本第一页。请求 ID 每次用户点击生成一个 UUID，同一次网络重试复用该 ID。

- [ ] **Step 4: 实现关闭前保存**

关闭按钮和 backdrop 使用同一 `requestClose`：

```ts
const saved = await draft.flush();
if (saved) {
  onClose();
  return;
}
setDiscardConfirmOpen(true);
```

放弃确认只关闭弹窗，不把失败草稿写入节点；继续编辑关闭确认框并保留草稿。保存或恢复过程中禁用重复提交。

- [ ] **Step 5: 接入分页版本栏**

“加载更多”调用 `fetchSpaceAssetVersions(page + 1)`，按 version id 去重追加摘要。切回当前版本使用已保存的当前内容，不重复请求；恢复或节点 prop 中出现新的当前版本时刷新第一页。

- [ ] **Step 6: 从 space-page 删除旧实现**

导入新 `NodeDetailDialog`。父组件传入 `onAssetUpdated`，收到 asset 后继续复用现有 `buildAssetVersionNodePatch(nodeDetail, asset)`，然后执行当前 `updateNodeResult` 和 `setNodeDetail` 合并。删除旧组件及仅供它使用的：

```text
NodeDetailVersionItem
NodeDetailSaveStatus
nodeDetailVersionItems
nodeDetailEditorSource
nodeDetailMediaRichDocumentFromOutput
NodeDetailRichEditor
parseEditableContentForSave
```

删除 `CompatRichTextEditor` 和 `useSpaceAssetVersion` 的旧 import；对仍被节点卡片使用的 `nodeDetailPreview` 等通用 preview helper 保持原位，不误删其它节点渲染逻辑。

同文件现有 storyboard 节点保存仍调用 `saveSpaceAssetEditVersion`；同步删除该调用已失效的 `requestId` 参数，保存结果继续走现有 `buildAssetVersionNodePatch`。

- [ ] **Step 7: 用单一 CSS 区域重做界面**

删除旧详情样式和 7000 行后的详情覆盖，只保留一个连续区块。关键布局：

```css
.ws-node-detail-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: grid;
  place-items: center;
  padding: 14px;
  background: rgba(22, 27, 25, 0.22);
}

.ws-node-detail-modal {
  display: grid;
  width: min(1560px, calc(100vw - 28px));
  height: min(920px, calc(100vh - 28px));
  grid-template-columns: minmax(0, 1fr) 304px;
  grid-template-rows: 48px minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid #d9dfdc;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 24px 64px rgba(23, 26, 25, 0.18);
}
```

正文白底、工具栏 sticky、版本栏只用分隔线。版本项使用紧凑行而非大卡片；选中状态使用低对比背景和左侧指示线。`max-width: 1100px` 时版本栏改为抽屉。所有文字必须在容器内换行或省略，不覆盖操作按钮。

- [ ] **Step 8: 做定向源码检查**

Run:

```bash
rg -n 'function NodeDetailDialog|NodeDetailRichEditor|useSpaceAssetVersion|ws-node-detail-modal|ws-node-detail-side-list' front/src/nodes/body-work/space
git diff --check -- front/src/nodes/body-work/space/node-detail front/src/nodes/body-work/space/space-page.tsx front/src/nodes/body-work/space/space.css
```

Expected: `NodeDetailDialog` 只有新目录一份；旧切换函数、旧编辑器和重复 CSS 选择器已删除。

---

### Task 10: 清理旧接口并完成静态自检

**Files:**
- Check all files modified in Tasks 1-9
- Modify only if stale references remain

- [ ] **Step 1: 确认旧版本切换路径完全删除**

Run:

```bash
rg -n 'use_asset_version|useSpaceAssetVersion|UseAssetVersion|UseVersion\(' api service front/src --glob '!front/dist/**'
```

Expected: 无输出。若仍有真实消费者，停止删除并回到 Service 语义检查；不得保留一个能直接把历史版本变成可编辑当前版本的入口。

- [ ] **Step 2: 格式化本次 Go 文件**

Run:

```bash
gofmt -w model/asset/version.go service/asset/main.go service/asset/version_history.go service/project/service.go api/body/project.go
```

- [ ] **Step 3: 执行非测试型静态检查**

从 `/data/project/shemic` 运行：

```bash
git -C backend/package/bot diff --check
rg -n 'updated_at|ProjectVersionPage|RestoreAssetVersion|useNodeDetailDraft|NodeDetailDialog|VersionPanel' backend/package/bot/model/asset backend/package/bot/service/asset backend/package/bot/service/project backend/package/bot/api/body/project.go backend/package/bot/front/src/nodes/body-work/space
bash skills/skills-dever/scripts/audit.sh backend/package/bot
```

Expected: `git diff --check` 无空白错误；引用检查覆盖 model、Service、API、状态机和新弹窗；Dever audit 不报告本次改动引入的边界错误。按用户要求不运行任何 build 或 test。

- [ ] **Step 4: 检查变更范围和重复实现**

Run:

```bash
git -C backend/package/bot diff --stat
rg -n 'nodeDetailEditorSource|parseEditableContentForSave|NodeDetailSaveStatus|PostUseAssetVersion' backend/package/bot --glob '!front/dist/**'
git -C backend/package/bot status --short
```

Expected: 旧详情解析和直接切换语义无残留；未修改生成文件和 `front/dist`；不覆盖工作区原有的无关改动。

- [ ] **Step 5: 交付用户手动验证清单**

不由实现代理运行，交给用户在浏览器检查：

```text
1. 文本、能力、智能体、流程、展示、图片、视频、音频、文件、分镜均能打开统一详情。
2. Markdown、rich JSON 和图文混排展示正确并可编辑；媒体不显示协议 JSON。
3. 连续输入只更新当前版本，右侧版本数量不增加。
4. 保存失败停止重复请求，点击重试后继续保存；立即关闭不会丢失未保存内容。
5. 点击历史版本只读预览，不改变当前标记；返回当前后仍可编辑。
6. 恢复历史版本创建一个新版本，原历史版本内容和创建时间不变。
7. 同一节点运行结果重复完成/刷新落库不会出现两个版本。
8. 版本超过 20 条时可以加载更多，首次详情请求不包含全部历史正文。
9. 快速点击多个历史版本只展示最后一次选择，旧请求不会覆盖当前内容。
10. 窄窗口版本栏变为抽屉，正文、工具栏和按钮没有重叠。
```

由于当前工作区已有大量用户改动，实施阶段不自动提交业务代码；每个 Task 结束后只定向检查本任务文件，最终由用户决定是否提交，避免把无关改动带入 commit。
