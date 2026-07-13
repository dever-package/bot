# 画布统一结果视图与悬停缩放设计

## 背景

画布结果内容已经接入共享 `ContentView`，但外层容器仍有三套不同实现。文本和能力节点使用贴边滚动容器；智能体与流程的附属结果气泡使用固定 `max-height` 和 `overflow: hidden`；展示功能节点虽然能渲染 Markdown 和富文本，却没有统一滚动容器，并被强制为固定尺寸。现有节点缩放还要求先选中节点，与连续排版画布的操作习惯不一致。

## 目标

- 智能体、流程和展示节点结果与文本节点使用相同的内容渲染及滚动语义。
- Markdown、rich JSON、图文混排、纯媒体和文件结果继续由同一个协议渲染路径处理。
- 结果内容超出容器时显示贴边、低透明度滚动条，不再裁掉正文。
- 资产节点、能力节点、展示结果节点和附属结果卡无需先选中即可从四角等比例缩放。
- 用户调整的节点或结果卡尺寸随画布保存，刷新后恢复。
- 智能体圆形和流程六边形本体保持固定大小。

## 根因与边界

问题不在 Markdown 解析。`NodeResultBubble` 和 `FunctionResultCard` 已经把输出交给 `CanvasNodeContentView`，但各自重复处理纯媒体并使用不同的尺寸与溢出样式。修复应统一结果视图外壳，不新增 Markdown 或 rich JSON 判断。

附属结果卡不是 React Flow 节点，不能使用 `NodeResizeControl` 修改其尺寸；普通节点和展示节点仍应继续复用 React Flow 的节点缩放。两类缩放共享尺寸约束、四角定义和视觉样式，但使用各自适合的状态适配器。

## 组件设计

新增 `CanvasResultView`，职责为：

1. 接收已经规范化的 `output`、fallback 和媒体预览。
2. 统一选择共享 `CanvasNodeContentView` 或纯图片、视频、音频、文件展示。
3. 提供与文本节点一致的绝对定位滚动容器。
4. 处理打开详情的点击与键盘交互。
5. 接收外部缩放控件，不持有画布数据。

现有 `NodeResultBubbleContent` 和 `FunctionResultCard` 内重复的媒体分支收敛到该组件。结果内容协议仍只由 `CanvasNodeContentView` 解释。

现有 `space-node-resizer.tsx` 扩展并更名为 `space-resizer.tsx`，集中放置：

- 四角位置、最小/最大尺寸和等比例计算。
- 基于 `NodeResizeControl` 的 `CanvasNodeResizer`。
- 基于 Pointer Events 的 `CanvasFloatingResizer`，用于附属结果卡。

两种适配器共用同一尺寸边界和角标样式，不复制四套角落逻辑。

## 数据模型与持久化

`SpaceCanvasNode` 新增可选 `resultView`：

```ts
type CanvasResultViewState = {
  width: number;
  height: number;
  offsetX?: number;
  offsetY?: number;
};
```

智能体与流程结果卡默认位于本体右侧。`width/height` 控制结果卡尺寸，`offsetX/offsetY` 只用于从左侧或顶部角落缩放时维持对角位置。该状态按 `result_view.width/height/offset_x/offset_y` 写入现有 canvas JSON，并由当前自动保存接口持久化，不新增后端 Service、API 或数据表。

展示功能节点继续使用节点已有 `x/y/width/height`。首次出现展示结果时，如果仍是功能胶囊默认尺寸，则按 `330 x 250` 展示；用户缩放后以保存尺寸为准。

## 缩放交互

- 可编辑画布中的缩放控件始终渲染，不依赖节点选中状态。
- 四角保留透明命中区；节点或结果卡悬停时显示低对比角标，角标悬停时增强。
- 拖动任一角按当前宽高比缩放，最小 `140 x 100`，最大边 `720`。
- 普通节点和展示节点缩放过程中由 React Flow 实时更新节点与连线，结束后一次提交 `x/y/width/height`。
- 附属结果卡使用 Pointer Capture，缩放过程中只更新本地预览，结束后一次提交 `resultView`，避免连续触发自动保存。
- 缩放控件使用 `nodrag` 和 `nopan`，不会触发节点拖动、画布平移或打开详情。
- 结果查看模式保持只读，不允许缩放。

## 内容与滚动

`CanvasResultView` 的内容层复用 `.ws-node-scroll-content` 行为：容器绝对贴边、正文按统一内边距排版、纵向滚动条位于边框内缘，横向仅在代码块或表格内部出现。

滚动条默认低透明度，悬停时稍微增强。Markdown 标题、列表、引用、代码、表格，以及 rich JSON 中的图片、视频、音频和文件，全部沿用共享 `ContentView`。纯图片或视频填充结果卡时继续保持 `object-fit`，不会降级成 JSON。

## 兼容与错误处理

- 旧画布没有 `result_view` 时使用默认结果卡尺寸与位置。
- 非法、缺失或超出范围的尺寸在读取和提交时统一钳制。
- 结果内容为空时继续使用现有 fallback。
- 当前 `FunctionResultCard` 中重复声明的 `useContentView` 一并删除，这是独立的源码语法错误。
- 不修改智能体运行、团队流程、能力执行、流式协议或后端结果结构。

## 验证

按项目要求不运行 build 或自动测试。实施后仅运行 Dever 静态审计、引用检查和 diff 空白检查，由用户手动验证：

- 智能体与流程结果支持 Markdown、rich JSON、图文混排和贴边滚动。
- 展示节点结果与文本节点排版、滚动一致。
- 不选中节点时，四角悬停即可缩放资产、能力、展示结果和附属结果卡。
- 四个角等比例缩放，内容不触发详情、节点拖动或画布平移。
- 展示节点连线随尺寸实时更新。
- 刷新后节点和附属结果卡尺寸保持。
- 结果查看模式不能修改尺寸。
