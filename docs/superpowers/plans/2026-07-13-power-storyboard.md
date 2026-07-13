# Power Storyboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有能力类型中增加“分镜脚本”，给所有能力增加默认空的设定提示词，并由 Energon 统一注入能力设定和分镜协议。

**Architecture:** 继续使用 `Power.Kind` 和现有 `power` 画布节点。能力设定只存于服务端 `Power.Prompt`，在 Energon 选中能力后统一合并到 `ShemicRequest.Set.role`；画布和后台调试不分别实现提示词拼接。前端只补齐 `storyboard` 的标签和图标。

**Tech Stack:** Go、Dever ORM/Page JSON、React、TypeScript、Energon Shemic/OpenAI 协议。

---

### Task 1: 能力模型与后台表单

**Files:**
- Modify: `model/energon/power.go`
- Modify: `front/page/admin/energon/power/update.json`

- [ ] **Step 1: 增加能力设定字段和分镜脚本类型**

在 `Power` 中增加默认空的文本字段，并在能力类型选项中登记 `storyboard`：

```go
Prompt string `dorm:"type:text;not null;default:'';comment:设定提示词"`

{"id": "storyboard", "value": "分镜脚本"},
```

默认 LLM seed 显式写入 `"prompt": ""`，保证 seed 与字段默认值一致。

- [ ] **Step 2: 在能力编辑页最后增加设定提示词编辑器**

在来源和参数配置之后、表单末尾增加：

```json
{
  "type": "form-editor",
  "name": "设定提示词",
  "placeholder": "填写该能力长期生效的职责、输出要求和约束，可留空。",
  "value": "form.prompt",
  "mode": "form",
  "info": "每次调用该能力时作为系统设定发送；分镜脚本还会自动加入固定的 storyboard JSON 协议。",
  "meta": {
    "formLayout": "vertical",
    "minHeight": 220,
    "maxHeight": 420
  }
}
```

在表单默认数据中加入 `"prompt": ""`。

### Task 2: Energon 统一设定注入

**Files:**
- Create: `service/energon/power_prompt.go`
- Modify: `service/energon/normalize.go`

- [ ] **Step 1: 定义固定分镜协议和单一合并函数**

新增 `applyPowerPrompt(req, power)`，依次合并：内置分镜协议、`power.Prompt`、调用方现有 `set.role`。过滤空段并用两个换行连接；使用新 map 写回 `req.Set`，避免修改调用方共享 map。

固定协议明确要求返回：

```json
{
  "type": "storyboard",
  "version": 1,
  "title": "",
  "shots": [
    {
      "id": "shot-1",
      "order": 1,
      "duration": 4,
      "visual": "",
      "dialogue": "",
      "narration": ""
    }
  ]
}
```

同时把合并后的 `set` 写回 `req.Raw.Body["set"]`，保证使用原始 body 的 Shemic 来源也能收到设定。

- [ ] **Step 2: 在能力解析成功后只注入一次**

在 `resolveNormalizePlan` 找到并校验能力后调用：

```go
applyPowerPrompt(req, power)
```

位置早于来源重试循环，使同步和 SSE 调用共用同一逻辑，且多来源失败重试不会重复追加提示词。代理透传模式维持原始请求语义，不注入能力设定。

### Task 3: 分镜脚本类型在管理端和画布中的一致展示

**Files:**
- Modify: `service/team/graph.go`
- Modify: `front/src/nodes/show/team-workspace/graph-state.ts`
- Modify: `front/src/nodes/body-work/space/space-model.ts`
- Modify: `front/src/nodes/body-work/space/space-power-icon.tsx`

- [ ] **Step 1: 补齐后端和团队编辑器类型标签**

在后端 `powerKindOptions` 和团队编辑器 fallback labels 中加入：

```text
storyboard -> 分镜脚本
```

后端排序放在 `text` 之后，其他能力顺序保持不变。

- [ ] **Step 2: 补齐 Body 画布标签和图标**

`powerKindLabel("storyboard")` 返回“分镜脚本”，`defaultPowerName("storyboard")` 返回“分镜脚本能力”。`space-power-icon.tsx` 使用 Lucide `Clapperboard` 作为未配置自定义图标时的 fallback。

### Task 4: 静态自检

**Files:**
- Check all modified files above

- [ ] **Step 1: 格式化 Go 源码**

Run:

```bash
gofmt -w model/energon/power.go service/energon/power_prompt.go service/energon/normalize.go service/team/graph.go
```

只格式化本次涉及的 Go 文件，不格式化已有前端大文件。

- [ ] **Step 2: 执行非测试型静态检查**

Run:

```bash
git diff --check
rg -n 'storyboard|设定提示词|Prompt' model/energon/power.go front/page/admin/energon/power/update.json service/energon service/team/graph.go front/src/nodes/show/team-workspace/graph-state.ts front/src/nodes/body-work/space/space-model.ts front/src/nodes/body-work/space/space-power-icon.tsx
bash skills/skills-dever/scripts/audit.sh backend/package/bot
```

预期：`git diff --check` 无空白错误，引用检查能看到模型、提示词注入和全部标签映射；Dever audit 不报告本次改动引入的规则错误。按用户要求不运行 build、Go test、npm test 或任何自动测试。

- [ ] **Step 3: 检查变更范围**

Run:

```bash
git diff -- model/energon/power.go front/page/admin/energon/power/update.json service/energon/power_prompt.go service/energon/normalize.go service/team/graph.go front/src/nodes/show/team-workspace/graph-state.ts front/src/nodes/body-work/space/space-model.ts front/src/nodes/body-work/space/space-power-icon.tsx
```

确认没有修改生成文件、编译产物、API、额外 Service 或画布节点类型。目标文件已有用户改动，因此不自动提交实现代码，避免把无关修改带入提交。

### Task 5: 画布来源菜单遵守能力规则

**Files:**
- Modify: `front/src/nodes/body-work/space/space-page.tsx`

- [ ] **Step 1: 统一计算画布可选来源状态**

在 `NodeBottomSettings` 中以 `powerForm.source_rule === 2` 作为唯一可选条件。表单加载完成后，非可选规则把 `selectedTargetId` 归零；保存草稿和运行节点时也使用归零后的有效来源 ID。

- [ ] **Step 2: 按规则传递来源菜单属性**

只有可选规则才向 `PromptComposer` 传入 `sources` 和 `onSourceChange`。现有来源切换、参数合并和缓存逻辑保持不变。

### Task 6: 共享 storyboard 解析与表格组件

**Files:**
- Create: `front/src/nodes/body-work/space/space-storyboard.ts`
- Create: `front/src/nodes/body-work/space/space-storyboard-view.tsx`
- Modify: `front/src/nodes/body-work/space/space-content-view.tsx`
- Modify: `front/src/nodes/body-work/space/space.css`

- [ ] **Step 1: 实现单一 storyboard 解析器**

定义 `StoryboardDocument`、`StoryboardShot` 和 `parseStoryboardOutput`。解析直接对象、包装字段、JSON 字符串、代码块及富文本中的 JSON；规范化缺失的 `id`、`order`、`duration` 和文本字段，同时保留未知字段。

- [ ] **Step 2: 实现可复用分镜表格**

表格提供标题、时长加减、画面描述、台词、旁白、新增、删除和上下移动。只在收到保存回调时启用编辑，否则作为所有节点共用的只读分镜结果视图。

- [ ] **Step 3: 接入统一内容渲染入口**

`CanvasNodeContentView` 先调用 storyboard 解析器；成功则渲染分镜表格，失败继续走现有 `ContentView`。不在具体节点中复制解析判断。

### Task 7: 分镜编辑保存与节点尺寸

**Files:**
- Modify: `front/src/nodes/body-work/space/space-page.tsx`
- Modify: `front/src/nodes/body-work/space/space-model.ts`

- [ ] **Step 1: 复用资产版本接口保存分镜**

脚本能力结果把保存回调传给共享内容视图。稳定资产调用 `saveSpaceAssetEditVersion`，成功后复用 `buildAssetVersionNodePatch` 和资产列表更新；无资产结果直接更新 `resultOutput`。

- [ ] **Step 2: 增加防抖和顺序保存**

分镜组件在停止输入 800 毫秒后保存，并串行提交连续修改，避免较早请求晚返回覆盖新内容。显示“编辑中 / 保存中 / 已保存 / 保存失败”。

- [ ] **Step 3: 调整新建分镜能力节点默认尺寸**

`createLocalNode` 根据所选能力类型给 storyboard 使用表格尺寸，其他节点默认尺寸不变；现有四角等比例缩放继续生效。

### Task 8: 静态自检与手工验证清单

**Files:**
- Check all files changed in Tasks 5-7 and `front/page/admin/energon/power/update.json`

- [ ] **Step 1: 执行非构建、非测试静态检查**

仅运行 `git diff --check`、定向 `rg` 引用检查和 Dever 静态审计。按用户要求不运行 `npm run build`、任何 build、Go test、npm test 或其他测试命令。

- [ ] **Step 2: 检查变更范围**

确认能力表单字段顺序正确，来源规则没有前端重复常量分支，storyboard 解析只存在一个入口，且未修改生成文件或新增后端 API。
