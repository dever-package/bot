# Storyboard Canvas States Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让分镜能力节点使用适合表格的默认尺寸，并在生成中隐藏原始 JSON、生成后展示可编辑分镜表格和完整详情入口。

**Architecture:** 保留现有 Energon SSE、storyboard 协议解析器和 `StoryboardView`，新增一个只负责分镜节点四种状态的展示组件。`space-page.tsx` 只按能力类型分发到该组件；旧尺寸归一化集中在 `space-model.ts`，不在渲染阶段临时修改画布数据。

**Tech Stack:** React、TypeScript、XYFlow、Lucide React、Dever front plugin。

**Constraints:** 按项目要求不运行 `npm run build`、任何 build、Go test、npm test 或其他自动测试；只执行定向引用检查、diff 检查和 Dever 静态审计。目标源码当前包含未提交修改，实施时不自动提交源码，避免把无关改动带入提交。

---

## File Structure

- Modify: `front/src/nodes/body-work/space/space-storyboard.ts`
  增加分镜类型判断和总时长计算两个纯函数。
- Create: `front/src/nodes/body-work/space/space-storyboard-node.tsx`
  组合未生成、生成中、已完成、失败/格式异常四种画布状态；复用 `StoryboardView`，不负责协议解析细节或保存请求。
- Modify: `front/src/nodes/body-work/space/space-model.ts`
  统一新节点默认尺寸，并只迁移精确匹配旧默认值的分镜节点。
- Modify: `front/src/nodes/body-work/space/space-page.tsx`
  判断分镜能力、停止把流式 JSON 交给通用内容视图，并传入保存和详情回调。
- Modify: `front/src/nodes/body-work/space/space.css`
  定义分镜节点状态、滚动区域和操作区样式。

### Task 1: 分镜纯函数与旧尺寸归一化

**Files:**
- Modify: `front/src/nodes/body-work/space/space-storyboard.ts`
- Modify: `front/src/nodes/body-work/space/space-model.ts`

- [ ] **Step 1: 增加共享的类型和总时长函数**

在 `space-storyboard.ts` 的公开函数区增加：

```ts
export function isStoryboardKind(value: unknown) {
  return String(value || "").trim().toLowerCase() === "storyboard";
}

export function storyboardTotalDuration(storyboard: StoryboardDocument) {
  return storyboard.shots.reduce(
    (total, shot) => total + Math.max(0, Number(shot.duration) || 0),
    0,
  );
}
```

`space-page.tsx` 和 `space-model.ts` 都使用 `isStoryboardKind`，不再各写一遍字符串归一化。

- [ ] **Step 2: 用命名常量统一能力节点默认尺寸**

在 `space-model.ts` 顶部导入 `isStoryboardKind`，并在 `nodeDefaultSize` 附近定义：

```ts
const DEFAULT_POWER_NODE_SIZE = { width: 180, height: 180 } as const;
const DEFAULT_STORYBOARD_NODE_SIZE = { width: 620, height: 360 } as const;

function nodeDefaultSize(type: SpaceCanvasNode["type"], powerKind = "") {
  switch (type) {
    case "agent":
      return { width: 154, height: 154 };
    case "flow":
      return { width: 210, height: 160 };
    case "function":
      return { width: 128, height: 46 };
    case "power":
      return isStoryboardKind(powerKind)
        ? { ...DEFAULT_STORYBOARD_NODE_SIZE }
        : { ...DEFAULT_POWER_NODE_SIZE };
    default:
      return { width: 250, height: 170 };
  }
}
```

- [ ] **Step 3: 只迁移精确的历史默认尺寸**

在 `space-model.ts` 增加：

```ts
function normalizeLegacyStoryboardNodeSize(node: SpaceCanvasNode) {
  if (
    node.type !== "power" ||
    !isStoryboardKind(node.power?.kind || node.kind) ||
    node.width !== DEFAULT_POWER_NODE_SIZE.width ||
    node.height !== DEFAULT_POWER_NODE_SIZE.height
  ) {
    return node;
  }
  return {
    ...node,
    ...DEFAULT_STORYBOARD_NODE_SIZE,
  };
}
```

在 `normalizeCanvasNode` 完成 `power`、`kind` 等字段赋值后，将最后的 `return node` 改为：

```ts
return normalizeLegacyStoryboardNodeSize(node);
```

不要迁移其他尺寸，避免覆盖用户手动缩放结果。新建节点继续通过 `nodeDefaultSize` 得到 `620 × 360`。

### Task 2: 分镜节点专用状态组件

**Files:**
- Create: `front/src/nodes/body-work/space/space-storyboard-node.tsx`

- [ ] **Step 1: 定义单一状态接口**

创建组件，状态只允许四种值，避免由多个布尔值组合出矛盾状态：

```tsx
import {
  CheckCircle2,
  CircleAlert,
  Clapperboard,
  Maximize2,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  parseStoryboardOutput,
  storyboardTotalDuration,
  type StoryboardDocument,
} from "./space-storyboard";
import { StoryboardView } from "./space-storyboard-view";

export type StoryboardNodeStatus =
  | "empty"
  | "running"
  | "complete"
  | "error";

type StoryboardNodeContentProps = {
  output?: unknown;
  status: StoryboardNodeStatus;
  editable?: boolean;
  onSave?: (storyboard: StoryboardDocument) => Promise<void>;
  onOpenDetail?: () => void;
};
```

- [ ] **Step 2: 实现生成中、空态和错误态**

组件先处理非完成状态，运行时不读取或渲染 `output`：

```tsx
export function StoryboardNodeContent({
  output,
  status,
  editable = false,
  onSave,
  onOpenDetail,
}: StoryboardNodeContentProps) {
  if (status === "running") {
    return (
      <div className="ws-storyboard-node-state is-running" aria-live="polite">
        <div className="ws-storyboard-node-skeleton" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <strong>正在生成分镜，请稍候</strong>
      </div>
    );
  }

  if (status === "error") {
    return (
      <StoryboardNodeMessage
        icon={<CircleAlert size={28} />}
        title="分镜生成失败"
        description="请检查输入后重新生成"
        tone="error"
      />
    );
  }

  if (status === "empty") {
    return (
      <StoryboardNodeMessage
        icon={<Clapperboard size={28} />}
        title="等待生成分镜"
        description="运行后将在这里展示可编辑镜头"
      />
    );
  }

  const storyboard = parseStoryboardOutput(output);
  if (!storyboard) {
    return (
      <StoryboardNodeMessage
        icon={<CircleAlert size={28} />}
        title="分镜格式异常"
        description="打开详情查看原始结果或重新生成"
        tone="error"
        onOpenDetail={onOpenDetail}
      />
    );
  }

  return (
    <section className="ws-storyboard-node is-complete">
      <header className="ws-storyboard-node-summary">
        <span className="ws-storyboard-node-complete">
          <CheckCircle2 size={14} />
          分镜已生成
        </span>
        <span>
          {storyboard.shots.length} 个镜头 · {storyboardTotalDuration(storyboard)} 秒
        </span>
      </header>
      <div className="ws-storyboard-node-body nowheel">
        <StoryboardView
          storyboard={storyboard}
          editable={editable}
          onSave={onSave}
        />
      </div>
      {onOpenDetail ? (
        <footer className="ws-storyboard-node-actions">
          <StoryboardDetailButton onOpenDetail={onOpenDetail} />
        </footer>
      ) : null}
    </section>
  );
}
```

- [ ] **Step 3: 提取共享消息结构**

在同一文件补充：

```tsx
function StoryboardNodeMessage({
  icon,
  title,
  description,
  tone = "default",
  onOpenDetail,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  tone?: "default" | "error";
  onOpenDetail?: () => void;
}) {
  return (
    <div className={`ws-storyboard-node-state is-${tone}`}>
      <span className="ws-storyboard-node-state-icon">{icon}</span>
      <strong>{title}</strong>
      <span>{description}</span>
      {onOpenDetail ? (
        <StoryboardDetailButton onOpenDetail={onOpenDetail} />
      ) : null}
    </div>
  );
}

function StoryboardDetailButton({
  onOpenDetail,
}: {
  onOpenDetail: () => void;
}) {
  return (
    <button
      type="button"
      className="ws-storyboard-detail-button nodrag nopan"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onOpenDetail();
      }}
    >
      <Maximize2 size={13} />
      <span>打开完整分镜</span>
    </button>
  );
}
```

组件不复制保存队列或行编辑逻辑。

### Task 3: 接入能力节点并停止展示流式 JSON

**Files:**
- Modify: `front/src/nodes/body-work/space/space-page.tsx`

- [ ] **Step 1: 集中计算分镜能力和状态**

导入 `isStoryboardKind`、`StoryboardNodeContent` 和 `StoryboardNodeStatus`。在 `SpaceNodeView` 中把现有 `storyboardEditable` 改为：

```ts
const isStoryboardPower =
  node.type === "power" &&
  isStoryboardKind(node.power?.kind || node.kind);
const storyboardEditable =
  isStoryboardPower && !isActiveRunningNode(runningNode);
```

在能力节点分支中增加：

```ts
const storyboardHasResult = nodeHasResultContent(node);
const storyboardStatus: StoryboardNodeStatus = isPowerRunning
  ? "running"
  : runningNode?.status === "error"
    ? "error"
    : runningNode?.status === "success" && !storyboardHasResult
      ? "running"
      : storyboardHasResult
        ? "complete"
        : "empty";
```

- [ ] **Step 2: 普通能力才显示流式文本**

将 `showStreamText` 的条件改为：

```ts
const showStreamText = Boolean(
  !isStoryboardPower &&
    runningNode?.streamStarted &&
    runningNode.streamText &&
    runningNode.status !== "success",
);
```

`contentOutput` 对分镜始终使用最终的 `nodeEnergonOutput(node)`，不把 `runningNode.streamText` 包装成 `{ text }`。给能力节点根元素追加 `is-storyboard` 类，并让 `hasPowerContent` 在分镜状态下恒为 `true`，关闭普通能力空态脉冲。

对应计算保持为：

```ts
const contentOutput = showStreamText
  ? { text: runningNode?.streamText || "" }
  : nodeEnergonOutput(node);
const hasPowerContent =
  isStoryboardPower || showStreamText || nodeHasResultContent(node);

const className = [
  "ws-node-power-wrap",
  selected ? "is-selected" : "",
  isPowerRunning ? "is-running" : "",
  isStoryboardPower ? "is-storyboard" : "",
  hasPowerContent ? "has-content" : "",
  hasPowerMedia ? "has-media" : "",
]
  .filter(Boolean)
  .join(" ");
```

- [ ] **Step 3: 用专用组件替换分镜能力内容**

在 `.ws-node-power-card` 内保留现有运行边框，然后先分支分镜：

```tsx
{isStoryboardPower ? (
  <StoryboardNodeContent
    output={nodeEnergonOutput(node)}
    status={storyboardStatus}
    editable={storyboardEditable}
    onSave={storyboardEditable ? saveStoryboard : undefined}
    onOpenDetail={
      storyboardHasResult && onShowNodeDetail
        ? () => onShowNodeDetail(node)
        : undefined
    }
  />
) : hasPowerContent ? (
  <PowerNodeGeneratedContent
    preview={preview}
    output={contentOutput}
    fallback={node.description}
    streaming={isPowerRunning && showStreamText}
    onMediaSize={
      canAdoptGeneratedMediaSize
        ? (width, height) => {
            const nextSize = generatedMediaNodeSize(width, height);
            if (!nextSize || !onNodeResult) {
              return;
            }
            if (
              Math.abs((node.width || 0) - nextSize.width) > 2 ||
              Math.abs((node.height || 0) - nextSize.height) > 2
            ) {
              onNodeResult(node.id, nextSize);
            }
          }
        : undefined
    }
  />
) : (
  <PowerNodeEmptyState />
)}
```

分镜节点不再额外渲染居中的 `NodeQuickDetailButton`，完整详情由底部按钮打开；其他能力继续保留眼睛按钮。

节点底部使用明确分支：

```tsx
{isStoryboardPower ? null : (
  <NodeQuickDetailButton
    node={node}
    onShowNodeDetail={onShowNodeDetail}
  />
)}
```

- [ ] **Step 4: 收窄通用生成内容组件职责**

从 `PowerNodeGeneratedContent` 的 props 和内部 `CanvasNodeContentView` 调用中移除：

```ts
storyboardEditable
storyboardDisabled
onStoryboardSave
```

通用 `CanvasNodeContentView` 仍保留 storyboard 只读解析能力，供资产节点、展示节点和详情视图复用；只有分镜能力节点的运行状态和编辑入口移入专用组件。

### Task 4: 分镜节点布局和滚动样式

**Files:**
- Modify: `front/src/nodes/body-work/space/space.css`

- [ ] **Step 1: 建立稳定的三段式布局**

在 storyboard 样式区增加：

```css
.ws-node-power-wrap.is-storyboard .ws-node-power-card {
  justify-content: flex-start;
  padding: 14px;
}

.ws-storyboard-node {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  gap: 10px;
}

.ws-storyboard-node-summary {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #7b8783;
  font-size: 10px;
}

.ws-storyboard-node-complete {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #287a53;
  font-weight: 650;
}

.ws-storyboard-node-body {
  min-width: 0;
  min-height: 0;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-color: transparent transparent;
  scrollbar-width: thin;
}

.ws-storyboard-node-body:hover {
  scrollbar-color: rgba(96, 116, 106, 0.28) transparent;
}

.ws-storyboard-node-body::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.ws-storyboard-node-body::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: transparent;
}

.ws-storyboard-node-body:hover::-webkit-scrollbar-thumb {
  background: rgba(96, 116, 106, 0.28);
}
```

- [ ] **Step 2: 增加生成中和消息状态**

```css
.ws-storyboard-node-state {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #7b8783;
  text-align: center;
}

.ws-storyboard-node-state strong {
  color: #27302d;
  font-size: 13px;
  font-weight: 650;
}

.ws-storyboard-node-state.is-error .ws-storyboard-node-state-icon {
  color: #be3450;
}

.ws-storyboard-node-skeleton {
  display: flex;
  width: min(82%, 420px);
  flex-direction: column;
  gap: 9px;
  margin-bottom: 22px;
}

.ws-storyboard-node-skeleton span {
  height: 9px;
  border-radius: 4px;
  background: #e7ebe9;
  animation: ws-node-empty-shimmer 1.9s ease-in-out infinite;
}

.ws-storyboard-node-skeleton span:nth-child(2) {
  width: 72%;
}

.ws-storyboard-node-skeleton span:nth-child(3) {
  width: 46%;
}
```

- [ ] **Step 3: 增加完整详情操作区**

```css
.ws-storyboard-node-actions {
  display: flex;
  flex: none;
  justify-content: flex-end;
  border-top: 1px solid #edf0ee;
  padding-top: 9px;
}

.ws-storyboard-detail-button {
  display: inline-flex;
  height: 28px;
  align-items: center;
  gap: 6px;
  border: 1px solid #d7dfdb;
  border-radius: 5px;
  padding: 0 10px;
  background: #ffffff;
  color: #476458;
  font: inherit;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
}

.ws-storyboard-detail-button:hover {
  border-color: #91a79a;
  background: #f4f7f5;
  color: #1a4a35;
}
```

确认表格外层只负责纵向滚动，现有 `.ws-storyboard-table-wrap` 继续负责横向滚动，避免两个容器同时滚动同一方向。

### Task 5: 静态检查与用户手工验证清单

**Files:**
- Check: `front/src/nodes/body-work/space/space-storyboard.ts`
- Check: `front/src/nodes/body-work/space/space-storyboard-node.tsx`
- Check: `front/src/nodes/body-work/space/space-model.ts`
- Check: `front/src/nodes/body-work/space/space-page.tsx`
- Check: `front/src/nodes/body-work/space/space.css`

- [ ] **Step 1: 检查引用和重复逻辑**

Run:

```bash
rg -n "isStoryboardKind|StoryboardNodeContent|StoryboardNodeStatus|streamText" \
  front/src/nodes/body-work/space/space-storyboard.ts \
  front/src/nodes/body-work/space/space-storyboard-node.tsx \
  front/src/nodes/body-work/space/space-model.ts \
  front/src/nodes/body-work/space/space-page.tsx
```

Expected: 类型判断只调用 `isStoryboardKind`；分镜运行分支不把 `streamText` 传入 `StoryboardNodeContent`；普通能力仍保留原流式文本逻辑。

- [ ] **Step 2: 执行非测试型静态检查**

Run:

```bash
git diff --check -- \
  front/src/nodes/body-work/space/space-storyboard.ts \
  front/src/nodes/body-work/space/space-storyboard-node.tsx \
  front/src/nodes/body-work/space/space-model.ts \
  front/src/nodes/body-work/space/space-page.tsx \
  front/src/nodes/body-work/space/space.css

bash /root/.agents/skills/shemic-dever/scripts/audit.sh \
  front/src/nodes/body-work/space/space-storyboard.ts \
  front/src/nodes/body-work/space/space-storyboard-node.tsx \
  front/src/nodes/body-work/space/space-model.ts \
  front/src/nodes/body-work/space/space-page.tsx \
  front/src/nodes/body-work/space/space.css
```

Expected: `git diff --check` 无输出；Dever audit 输出“dever skill audit 通过”。不要运行 build 或测试。

- [ ] **Step 3: 检查实际变更范围**

Run:

```bash
git diff -- \
  front/src/nodes/body-work/space/space-storyboard.ts \
  front/src/nodes/body-work/space/space-storyboard-node.tsx \
  front/src/nodes/body-work/space/space-model.ts \
  front/src/nodes/body-work/space/space-page.tsx \
  front/src/nodes/body-work/space/space.css

git status --short -- \
  front/src/nodes/body-work/space/space-storyboard.ts \
  front/src/nodes/body-work/space/space-storyboard-node.tsx \
  front/src/nodes/body-work/space/space-model.ts \
  front/src/nodes/body-work/space/space-page.tsx \
  front/src/nodes/body-work/space/space.css
```

Expected: 状态中只出现上述五个前端源码文件；没有后端、SSE 协议、生成文件、编译产物或其他节点行为变更。`space-storyboard-node.tsx` 是未跟踪新文件时，以 `git status` 的 `??` 记录为准。

- [ ] **Step 4: 交给用户手工验证**

用户手工确认：

1. 新建分镜能力节点默认约为 `620 × 360`。
2. 旧的 `180 × 180` 分镜节点刷新后采用新尺寸，手动缩放过的其他尺寸保持不变。
3. 分镜生成中只显示骨架、运行边框和“正在生成分镜，请稍候”，不出现 `{ "type": "storyboard" ... }`。
4. 完成后展示标题、镜头数、总时长和可编辑表格；多镜头时节点内部可滚动。
5. “打开完整分镜”打开现有详情弹窗，编辑保存和下游连线结果保持正常。
6. 普通文本能力仍按原逻辑流式显示文字，图片、视频和其他能力展示不变。
