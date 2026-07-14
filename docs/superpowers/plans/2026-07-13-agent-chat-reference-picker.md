# Agent Chat Reference Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 精简智能体聊天 `@` 选择器，将消息素材按消息分组横向展示，并统一优化悬浮预览的居中布局。

**Architecture:** bot 引用加载器负责把后端消息与已完成素材转换为稳定的 `ReferenceOption` 数据；共享引用组件只处理选择、布局和预览。保留现有会话/消息分页与引用提交协议，删除仅供资源中心入口使用的前端兼容读取。

**Tech Stack:** React、TypeScript、Tiptap、Lucide、Dever front plugin

---

### Task 1: 扩展引用选项的数据契约

**Files:**
- Modify: `/data/project/shemic/front/src/components/reference-composer/types.ts`
- Modify: `/data/project/shemic/backend/package/bot/front/src/nodes/show/agent-chat/reference.ts`
- Modify: `/data/project/shemic/backend/package/bot/front/src/nodes/show/agent-chat/artifact.ts`

- [ ] **Step 1: 删除资源中心 scope**

  将共享组件和 bot 侧的 `ReferenceScope` 统一收敛为 `"current" | "history"`，删除 `resource` 分支、`getCompatModule("@/lib/resource")`、资源列表转换和资源类型判断函数。

- [ ] **Step 2: 定义消息素材集合**

  为两侧 `ReferenceOption` 增加同名的可选字段：

  ```ts
  materials?: ReferenceOption[]
  ```

  会话选项继续使用 `hasChildren` 远程进入消息列表；只有消息选项携带 `materials`，避免把远程子列表与当前消息内素材混为一类。

- [ ] **Step 3: 规范化素材序号与地址**

  在 `AgentChatArtifact` 增加 `displayNo`，从后端 `display_no` 读取。素材只有满足 `status === "ready"` 且存在 `url` 或 `previewUrl` 才加入消息的 `materials`。

  使用统一映射生成短标签：

  ```ts
  const artifactLabels = {
    image: "图",
    video: "视频",
    audio: "音频",
    file: "文件",
  } as const
  ```

  序号优先取 `displayNo`，否则按同一消息内同类型素材顺序递增。视频的预览地址保留 `previewUrl || url`，不再只为图片写入预览地址。

- [ ] **Step 4: 让搜索覆盖消息素材**

  `filterOptions` 在匹配消息标题和描述之外，也匹配 `materials` 的短标签、类型和原始预览文本；命中素材时保留所属消息和该消息的素材集合。

### Task 2: 重构选择器的消息与素材展示

**Files:**
- Modify: `/data/project/shemic/front/src/components/reference-composer/picker.tsx`
- Modify: `/data/project/shemic/front/src/components/reference-composer/index.tsx`

- [ ] **Step 1: 精简入口与搜索文案**

  `scopes` 仅保留“当前会话”和“历史会话”，搜索提示改为“搜索消息或会话”。桌面宽度调整为 `min(560px, 100%)`，移动端继续由左右 10px 约束宽度。

- [ ] **Step 2: 拆分消息行与素材行**

  提取 `ReferencePickerItem` 负责会话/消息列表行，提取 `ReferenceMaterialGrid` 负责消息下的素材。消息主体保留原来的图标、标题、描述、悬浮预览和点击行为。

  素材区使用独立按钮：

  ```tsx
  <div className='reference-picker-materials'>
    {materials.map((material) => (
      <ReferenceMaterialItem
        key={material.key}
        material={material}
        loadPreview={loadPreview}
        onSelect={onSelect}
      />
    ))}
  </div>
  ```

  素材按钮的点击事件只调用 `onSelect(material)`，不触发消息选择。

- [ ] **Step 3: 实现固定缩略图与自动换行**

  素材区使用 `display: flex; flex-wrap: wrap`。单项固定为约 88px 宽，预览框固定 88px × 88px；图片使用 `object-fit: cover`，视频使用 `<video muted preload="metadata">` 并叠加播放图标，音频和文件居中展示类型图标。标签单行居中，只显示短编号。

- [ ] **Step 4: 保持键盘和分页行为稳定**

  上下键只遍历顶层会话/消息选项；素材通过鼠标/触控选择，不进入现有 `activeIndex`，避免改变已稳定的键盘分页逻辑。保留 IntersectionObserver 加载更多和滚轮事件隔离。

### Task 3: 优化悬浮预览的内容布局

**Files:**
- Modify: `/data/project/shemic/front/src/components/reference-composer/reference-preview-popover.tsx`

- [ ] **Step 1: 居中正文与状态**

  正文容器使用居中的最大宽度和 `text-center`；加载和错误状态也保持水平居中。保留 `whitespace-pre-wrap` 与滚动区域，长内容仍可完整查看。

- [ ] **Step 2: 居中媒体并保持比例**

  媒体容器使用居中的自适应网格。单图限制最大宽高并使用 `object-contain`；视频、音频和文件预览居中占据合适宽度，不再依赖 `col-span-2` 绑定固定两列布局。

- [ ] **Step 3: 保持标签预览复用**

  不修改 `ReferencePreviewPopover` 的加载协议、删除引用按钮和延迟打开逻辑，确保输入框标签、已发送消息标签以及选择器素材都复用相同预览实现。

### Task 4: 清理与静态自检

**Files:**
- Review: 上述全部修改文件

- [ ] **Step 1: 删除失效代码**

  使用 `rg` 确认 `resource` scope、`loadResourceReferences`、`resourceReferenceOption` 和 `@/lib/resource` 不再残留在 bot 引用选择器实现中。

- [ ] **Step 2: 检查类型与重复逻辑**

  核对共享 `ReferenceOption` 与 bot 镜像类型字段一致；素材类型、短标签和状态过滤只存在于 bot 数据组装层，选择器不重复解释后端状态。

- [ ] **Step 3: 检查补丁格式**

  仅运行 `git diff --check` 和源码检索，不运行构建、测试或 `npm run build`。

- [ ] **Step 4: 提供手动验收清单**

  手动验证当前会话、历史会话、搜索、消息引用、各类素材引用、素材换行、视频首帧、悬浮预览居中以及移动端可用宽度。

### Task 5: 将消息列表按对话轮次展示

**Files:**
- Create: `/data/project/shemic/front/src/components/reference-composer/turns.ts`
- Modify: `/data/project/shemic/front/src/components/reference-composer/types.ts`
- Modify: `/data/project/shemic/front/src/components/reference-composer/picker.tsx`
- Modify: `/data/project/shemic/front/src/components/reference-composer/index.tsx`
- Modify: `/data/project/shemic/backend/package/bot/front/src/nodes/show/agent-chat/reference.ts`

- [x] **Step 1: 给消息选项补充角色元数据**

  两侧 `ReferenceOption` 增加可选的 `messageRole`：

  ```ts
  messageRole?: "user" | "assistant"
  ```

  bot 引用加载器从消息记录写入该字段；会话和素材选项不写，避免通过展示文案推断业务角色。

- [x] **Step 2: 提取轮次分组函数**

  新建 `turns.ts`，将按时间倒序的相邻 `assistant`、`user` 消息组合成一个派生轮次。非消息选项保持普通列表行；分页边界缺失一侧时保留单侧轮次，下一页合并后重新计算。

- [x] **Step 3: 分离轮次、消息侧和素材渲染**

  `ReferencePicker` 对派生轮次使用两列布局，左侧渲染智能体回复，右侧渲染用户消息。两个消息按钮各自保留原来的 `ReferencePreviewPopover` 和 `onSelect(item)`；素材对两侧集合去重后统一放在轮次下方。

- [x] **Step 4: 保持键盘选择和移动端行为**

  `activeIndex` 继续对应原始消息选项，键盘回车仍只选择当前单条消息。移动端将用户消息排在上方、智能体回复排在下方，素材继续位于整轮底部。

- [x] **Step 5: 进行非构建静态检查**

  只检查补丁格式、消息角色字段一致性和已删除样式引用；不运行 build、TypeScript 检查或任何自动化测试。
