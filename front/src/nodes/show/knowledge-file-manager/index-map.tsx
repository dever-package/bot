import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  FileText,
  FolderTree,
  GitBranch,
  Link2,
  RefreshCw,
  Search,
  Timer,
  X,
  XCircle,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { toast } from "sonner"
import {
  loadIndexOverview,
  loadKnowledgeGraph,
  loadKnowledgeIndexTree,
  openKnowledgeNode,
} from "./api"
import type {
  KnowledgeGraphEdge,
  KnowledgeGraphResult,
  KnowledgeIndexStageOverview,
  KnowledgeIndexOverview,
  KnowledgeIndexStatus,
  KnowledgeIndexStatusCounts,
  KnowledgeIndexTreeNode,
  KnowledgeNodeOpenResult,
  KnowledgeNodeResult,
} from "./types"

type KnowledgeIndexMapProps = {
  knowledgeBaseID: number
  open: boolean
  onClose: () => void
  onRefreshFiles?: () => void
}

type IndexMapViewMode = "tree" | "graph"

const indexMapPollInterval = 2400
const defaultTreeDepth = 4
const defaultTreeLimit = 500
const defaultGraphLimit = 240

export function KnowledgeIndexMap({
  knowledgeBaseID,
  open,
  onClose,
  onRefreshFiles,
}: KnowledgeIndexMapProps) {
  const [overview, setOverview] = useState<KnowledgeIndexOverview | null>(null)
  const [tree, setTree] = useState<KnowledgeIndexTreeNode[]>([])
  const [graph, setGraph] = useState<KnowledgeGraphResult>({ nodes: [], edges: [] })
  const [viewMode, setViewMode] = useState<IndexMapViewMode>("tree")
  const [mapQuery, setMapQuery] = useState("")
  const [graphType, setGraphType] = useState("all")
  const [selectedEdgeID, setSelectedEdgeID] = useState<number>(0)
  const [selectedNodeID, setSelectedNodeID] = useState<number>(0)
  const [nodeDetail, setNodeDetail] = useState<KnowledgeNodeOpenResult | null>(null)
  const [expandedIDs, setExpandedIDs] = useState<Set<number>>(() => new Set())
  const [loading, setLoading] = useState(false)
  const [graphLoading, setGraphLoading] = useState(false)
  const [nodeLoading, setNodeLoading] = useState(false)
  const expandedInitializedRef = useRef(false)
  const visibleGraph = useMemo(
    () => filterGraph(graph, mapQuery, graphType),
    [graph, graphType, mapQuery],
  )

  const hasRunningIndex = useMemo(() => {
    if (!overview) {
      return false
    }
    return (
      normalizeIndexStatus(overview.base.index_status) === "running" ||
      overview.docs.running > 0 ||
      overview.nodes.running > 0
    )
  }, [overview])

  useEffect(() => {
    setOverview(null)
    setTree([])
    setGraph({ nodes: [], edges: [] })
    setViewMode("tree")
    setMapQuery("")
    setGraphType("all")
    setSelectedEdgeID(0)
    setSelectedNodeID(0)
    setNodeDetail(null)
    setExpandedIDs(new Set())
    expandedInitializedRef.current = false
  }, [knowledgeBaseID])

  const reloadMap = useCallback(
    async (silent = false) => {
      if (!knowledgeBaseID) {
        return
      }
      if (!silent) {
        setLoading(true)
      }
      try {
        const [nextOverview, nextTree] = await Promise.all([
          loadIndexOverview({ knowledgeBaseID }),
          loadKnowledgeIndexTree({
            knowledgeBaseID,
            depth: defaultTreeDepth,
            limit: defaultTreeLimit,
          }),
        ])
        setOverview(nextOverview)
        setTree(nextTree.nodes || [])
        setExpandedIDs((current) => {
          if (expandedInitializedRef.current || current.size > 0) {
            return current
          }
          return new Set(nextTree.nodes.flatMap((node) => collectExpandableIDs(node)))
        })
        expandedInitializedRef.current = true
        setSelectedNodeID((current) => {
          if (current) {
            return current
          }
          const firstNode = firstTreeNode(nextTree.nodes || [])
          return firstNode?.id || 0
        })
      } catch (error) {
        if (!silent) {
          toast.error(errorMessage(error, "加载知识地图失败"))
        }
      } finally {
        if (!silent) {
          setLoading(false)
        }
      }
    },
    [knowledgeBaseID],
  )

  const reloadGraph = useCallback(
    async (silent = false) => {
      if (!knowledgeBaseID) {
        return
      }
      if (!silent) {
        setGraphLoading(true)
      }
      try {
        const nextGraph = await loadKnowledgeGraph({
          knowledgeBaseID,
          limit: defaultGraphLimit,
        })
        setGraph({
          nodes: nextGraph.nodes || [],
          edges: nextGraph.edges || [],
        })
      } catch (error) {
        if (!silent) {
          toast.error(errorMessage(error, "加载关系图谱失败"))
        }
      } finally {
        if (!silent) {
          setGraphLoading(false)
        }
      }
    },
    [knowledgeBaseID],
  )

  useEffect(() => {
    if (!open) {
      return
    }
    void reloadMap()
  }, [open, reloadMap])

  useEffect(() => {
    if (!open || viewMode !== "graph") {
      return
    }
    void reloadGraph()
  }, [open, reloadGraph, viewMode])

  useEffect(() => {
    if (!open || !hasRunningIndex) {
      return
    }
    const timer = window.setInterval(() => {
      void reloadMap(true)
      if (viewMode === "graph") {
        void reloadGraph(true)
      }
      onRefreshFiles?.()
    }, indexMapPollInterval)
    return () => window.clearInterval(timer)
  }, [hasRunningIndex, onRefreshFiles, open, reloadGraph, reloadMap, viewMode])

  useEffect(() => {
    if (!open) {
      return
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose, open])

  useEffect(() => {
    if (!open || !selectedNodeID) {
      setNodeDetail(null)
      return
    }
    setNodeLoading(true)
    openKnowledgeNode({ nodeID: selectedNodeID })
      .then(setNodeDetail)
      .catch((error) => toast.error(errorMessage(error, "加载知识节点失败")))
      .finally(() => setNodeLoading(false))
  }, [open, selectedNodeID])

  const toggleExpanded = useCallback((nodeID: number) => {
    setExpandedIDs((current) => {
      const next = new Set(current)
      if (next.has(nodeID)) {
        next.delete(nodeID)
      } else {
        next.add(nodeID)
      }
      return next
    })
  }, [])

  const expandAll = useCallback(() => {
    setExpandedIDs(new Set(tree.flatMap((node) => collectExpandableIDs(node))))
  }, [tree])

  const collapseAll = useCallback(() => {
    setExpandedIDs(new Set())
  }, [])

  if (!open) {
    return null
  }

  return (
    <div
      className="knowledge-index-map"
      role="dialog"
      aria-modal="true"
      aria-label="知识地图"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="knowledge-index-map__panel"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="knowledge-index-map__header">
          <div>
            <strong>知识地图</strong>
            <span>{overview?.base.name || "查看索引结构、进度和错误状态"}</span>
          </div>
          <div className="knowledge-index-map__actions">
            <button
              type="button"
              onClick={() => {
                void reloadMap()
                if (viewMode === "graph") {
                  void reloadGraph()
                }
                onRefreshFiles?.()
              }}
              disabled={loading || graphLoading}
              title="刷新"
            >
              <RefreshCw size={16} className={loading || graphLoading ? "is-spinning" : ""} />
            </button>
            <button type="button" onClick={onClose} title="关闭" aria-label="关闭知识地图">
              <X size={17} />
            </button>
          </div>
        </header>

        <section className="knowledge-index-map__overview">
          <ProgressSummary overview={overview} loading={loading} />
          <StageSummary stages={overview?.stages || []} />
          <StatusGroup title="文档状态" counts={overview?.docs} />
          <StatusGroup title="节点状态" counts={overview?.nodes} />
        </section>

        <main className="knowledge-index-map__content">
          <section className="knowledge-index-map__tree">
            <div className="knowledge-index-map__section-head">
              <div>
                <strong>{viewMode === "tree" ? "目录图谱" : "关系图谱"}</strong>
                <span>
                  {viewMode === "tree"
                    ? "目录 → 文档 → 文档目录节点"
                    : "文档节点 → 概念 → 概念关系"}
                </span>
              </div>
              <div className="knowledge-index-map__section-actions">
                <div className="knowledge-index-map-search">
                  <Search size={14} />
                  <input
                    value={mapQuery}
                    onChange={(event) => setMapQuery(event.target.value)}
                    placeholder="搜索节点"
                  />
                </div>
                <ViewModeTabs value={viewMode} onChange={setViewMode} />
                {viewMode === "graph" ? (
                  <GraphTypeSelect value={graphType} onChange={setGraphType} />
                ) : null}
                {viewMode === "tree" ? (
                  <>
                    <button type="button" onClick={expandAll}>
                      展开
                    </button>
                    <button type="button" onClick={collapseAll}>
                      收起
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => void reloadGraph()}
                    disabled={graphLoading}
                  >
                    刷新
                  </button>
                )}
              </div>
            </div>
            {viewMode === "tree" ? (
              <TreeView
                loading={loading}
                tree={tree}
                query={mapQuery}
                expandedIDs={expandedIDs}
                selectedNodeID={selectedNodeID}
                onToggle={toggleExpanded}
                onSelect={setSelectedNodeID}
              />
            ) : (
              <GraphView
                graph={graph}
                loading={graphLoading}
                query={mapQuery}
                typeFilter={graphType}
                selectedNodeID={selectedNodeID}
                selectedEdgeID={selectedEdgeID}
                onSelectNode={setSelectedNodeID}
                onSelectEdge={setSelectedEdgeID}
              />
            )}
          </section>

          <aside className="knowledge-index-map__detail">
            <NodeDetailPanel detail={nodeDetail} loading={nodeLoading} />
            <EdgeDetailPanel edge={selectedGraphEdge(visibleGraph, selectedEdgeID)} nodes={visibleGraph.nodes || []} />
            <RecentErrors errors={overview?.recent_errors || []} />
          </aside>
        </main>
      </div>
    </div>
  )
}

function ProgressSummary({
  overview,
  loading,
}: {
  overview: KnowledgeIndexOverview | null
  loading: boolean
}) {
  const status = normalizeIndexStatus(overview?.base.index_status)
  const statusView = indexStatusView(status)
  const progress = clamp(overview?.progress || 0, 0, 100)
  const Icon = statusView.icon
  return (
    <article className="knowledge-index-map-summary">
      <div className="knowledge-index-map-summary__title">
        <span>
          <Icon size={16} className={status === "running" || loading ? "is-spinning" : ""} />
          {statusView.label}
        </span>
        <strong>{progress}%</strong>
      </div>
      <div className="knowledge-index-map-summary__bar">
        <span style={{ width: `${progress}%` }} />
      </div>
      {overview?.base.error_message ? (
        <p className="knowledge-index-map-summary__error">{overview.base.error_message}</p>
      ) : (
        <p>已索引 {overview?.docs.success || 0} / {overview?.docs.total || 0} 个文档</p>
      )}
    </article>
  )
}

function StatusGroup({
  title,
  counts,
}: {
  title: string
  counts?: KnowledgeIndexStatusCounts
}) {
  return (
    <article className="knowledge-index-map-status">
      <strong>{title}</strong>
      <div>
        <StatusPill status="success" label="完成" count={counts?.success || 0} />
        <StatusPill status="running" label="进行中" count={counts?.running || 0} />
        <StatusPill status="pending" label="待处理" count={counts?.pending || 0} />
        <StatusPill status="failed" label="失败" count={counts?.failed || 0} />
      </div>
    </article>
  )
}

function StageSummary({ stages }: { stages: KnowledgeIndexStageOverview[] }) {
  const visible = stages.filter((stage) => stage.running > 0 || stage.failed > 0)
  return (
    <article className="knowledge-index-map-status">
      <strong>索引阶段</strong>
      {visible.length ? (
        <div>
          {visible.map((stage) => (
            <span
              key={stage.stage}
              className={`knowledge-index-map-pill ${stage.failed > 0 ? "is-failed" : "is-running"}`}
            >
              {stage.label}
              <b>{stage.failed > 0 ? stage.failed : stage.running}</b>
            </span>
          ))}
        </div>
      ) : (
        <p className="knowledge-index-map-status__empty">暂无运行中的阶段</p>
      )}
    </article>
  )
}

function StatusPill({
  status,
  label,
  count,
}: {
  status: KnowledgeIndexStatus
  label: string
  count: number
}) {
  const view = indexStatusView(status)
  const Icon = view.icon
  return (
    <span className={`knowledge-index-map-pill is-${view.status}`}>
      <Icon size={13} />
      {label}
      <b>{count}</b>
    </span>
  )
}

function ViewModeTabs({
  value,
  onChange,
}: {
  value: IndexMapViewMode
  onChange: (value: IndexMapViewMode) => void
}) {
  const items: Array<{ value: IndexMapViewMode; label: string }> = [
    { value: "tree", label: "目录" },
    { value: "graph", label: "图谱" },
  ]
  return (
    <div className="knowledge-index-map-tabs" role="tablist" aria-label="知识地图视图">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={value === item.value}
          className={value === item.value ? "is-active" : ""}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

function GraphTypeSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <select
      className="knowledge-index-map-type-select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="图谱类型筛选"
    >
      <option value="all">全部</option>
      <option value="concept">概念</option>
      <option value="source">文档节点</option>
      <option value="middle">资源/其他</option>
    </select>
  )
}

function TreeView({
  loading,
  tree,
  query,
  expandedIDs,
  selectedNodeID,
  onToggle,
  onSelect,
}: {
  loading: boolean
  tree: KnowledgeIndexTreeNode[]
  query: string
  expandedIDs: Set<number>
  selectedNodeID: number
  onToggle: (nodeID: number) => void
  onSelect: (nodeID: number) => void
}) {
  const filteredTree = useMemo(() => filterTreeNodes(tree, query), [query, tree])
  if (loading && !tree.length) {
    return (
      <IndexMapState
        icon={<RefreshCw className="is-spinning" size={18} />}
        label="加载地图中"
      />
    )
  }
  if (!filteredTree.length) {
    return (
      <IndexMapState
        icon={<FolderTree size={20} />}
        label={tree.length ? "没有匹配的节点" : "暂无索引节点，先执行智能索引"}
      />
    )
  }
  return (
    <div className="knowledge-index-map-tree">
      {filteredTree.map((node) => (
        <IndexMapTreeNode
          key={node.id}
          node={node}
          level={0}
          expandedIDs={expandedIDs}
          selectedNodeID={selectedNodeID}
          onToggle={onToggle}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

function GraphView({
  graph,
  loading,
  query,
  typeFilter,
  selectedNodeID,
  selectedEdgeID,
  onSelectNode,
  onSelectEdge,
}: {
  graph: KnowledgeGraphResult
  loading: boolean
  query: string
  typeFilter: string
  selectedNodeID: number
  selectedEdgeID: number
  onSelectNode: (nodeID: number) => void
  onSelectEdge: (edgeID: number) => void
}) {
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null)
  const filteredGraph = useMemo(
    () => filterGraph(graph, query, typeFilter),
    [graph, query, typeFilter],
  )
  const layout = useMemo(() => buildGraphLayout(filteredGraph), [filteredGraph])
  if (loading && !graph.nodes.length) {
    return (
      <IndexMapState
        icon={<RefreshCw className="is-spinning" size={18} />}
        label="加载关系图谱中"
      />
    )
  }
  if (!layout.nodes.length || !layout.edges.length) {
    return (
      <IndexMapState
        icon={<GitBranch size={20} />}
        label={graph.nodes.length ? "没有匹配的关系图谱" : "暂无关系图谱，先执行智能索引"}
      />
    )
  }
  const showEdgeLabels = layout.edges.length <= 60
  return (
    <div className="knowledge-index-map-graph">
      <div className="knowledge-index-map-graph__tools">
        <button type="button" onClick={() => setZoom((value) => clamp(value + 0.12, 0.72, 1.8))}>
          <ZoomIn size={14} />
        </button>
        <button type="button" onClick={() => setZoom((value) => clamp(value - 0.12, 0.72, 1.8))}>
          <ZoomOut size={14} />
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom(1)
            setOffset({ x: 0, y: 0 })
          }}
        >
          复位
        </button>
      </div>
      <svg viewBox="0 0 980 560" role="img" aria-label="知识关系图谱">
        <defs>
          <marker
            id="knowledge-graph-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        <g
          transform={`translate(${offset.x}, ${offset.y}) scale(${zoom})`}
          onPointerDown={(event) => {
            dragRef.current = {
              x: event.clientX,
              y: event.clientY,
              offsetX: offset.x,
              offsetY: offset.y,
            }
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerMove={(event) => {
            const drag = dragRef.current
            if (!drag) {
              return
            }
            setOffset({
              x: drag.offsetX + event.clientX - drag.x,
              y: drag.offsetY + event.clientY - drag.y,
            })
          }}
          onPointerUp={(event) => {
            dragRef.current = null
            event.currentTarget.releasePointerCapture(event.pointerId)
          }}
        >
          <g className="knowledge-index-map-graph__edges">
            {layout.edges.map((edge) => (
              <g
                key={edge.id || `${edge.from_node_id}-${edge.to_node_id}-${edge.edge_type}`}
                className={selectedEdgeID === edge.id ? "is-selected" : ""}
                onClick={(event) => {
                  event.stopPropagation()
                  onSelectEdge(edge.id)
                }}
              >
                <path d={edge.path} markerEnd="url(#knowledge-graph-arrow)" />
                {showEdgeLabels ? (
                  <text x={edge.labelX} y={edge.labelY}>
                    {compactGraphLabel(edge.label || edge.edge_type, 12)}
                  </text>
                ) : null}
              </g>
            ))}
          </g>
          <g className="knowledge-index-map-graph__nodes">
            {layout.nodes.map((node) => (
              <g
                key={node.id}
                role="button"
                tabIndex={0}
                className={`knowledge-index-map-graph__node is-${node.group}${selectedNodeID === node.id ? " is-selected" : ""}`}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={(event) => {
                  event.stopPropagation()
                  onSelectNode(node.id)
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    onSelectNode(node.id)
                  }
                }}
              >
                <circle r={node.radius} />
                <text className="knowledge-index-map-graph__node-title" y="-3">
                  {compactGraphLabel(node.title || node.path || String(node.id), 13)}
                </text>
                <text className="knowledge-index-map-graph__node-type" y="14">
                  {nodeTypeView(node.node_type).label}
                </text>
              </g>
            ))}
          </g>
        </g>
      </svg>
      <div className="knowledge-index-map-graph__legend">
        <span className="is-source">文档/节点</span>
        <span className="is-concept">概念</span>
        <span>共 {layout.nodes.length} 个节点 / {layout.edges.length} 条关系</span>
      </div>
    </div>
  )
}

function IndexMapTreeNode({
  node,
  level,
  expandedIDs,
  selectedNodeID,
  onToggle,
  onSelect,
}: {
  node: KnowledgeIndexTreeNode
  level: number
  expandedIDs: Set<number>
  selectedNodeID: number
  onToggle: (nodeID: number) => void
  onSelect: (nodeID: number) => void
}) {
  const children = node.children || []
  const hasChildren = children.length > 0 || Boolean(node.children_count)
  const expanded = expandedIDs.has(node.id)
  const view = nodeTypeView(node.node_type)
  const status = normalizeIndexStatus(node.index_status)
  const statusView = indexStatusView(status)
  const NodeIcon = view.icon
  const StatusIcon = statusView.icon
  return (
    <div className="knowledge-index-map-tree__node">
      <button
        type="button"
        className={`knowledge-index-map-tree__row${selectedNodeID === node.id ? " is-selected" : ""}`}
        style={{ paddingLeft: 12 + level * 22 }}
        onClick={() => onSelect(node.id)}
      >
        <span
          className="knowledge-index-map-tree__toggle"
          onClick={(event) => {
            event.stopPropagation()
            if (hasChildren) {
              onToggle(node.id)
            }
          }}
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown size={15} />
            ) : (
              <ChevronRight size={15} />
            )
          ) : null}
        </span>
        <NodeIcon size={15} />
        <span className="knowledge-index-map-tree__title">{node.title || view.label}</span>
        <span
          className={`knowledge-index-map-tree__status is-${statusView.status}`}
          title={statusView.label}
        >
          <StatusIcon size={13} />
        </span>
      </button>
      {expanded && children.length ? (
        <div className="knowledge-index-map-tree__children">
          {children.map((child) => (
            <IndexMapTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expandedIDs={expandedIDs}
              selectedNodeID={selectedNodeID}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function NodeDetailPanel({
  detail,
  loading,
}: {
  detail: KnowledgeNodeOpenResult | null
  loading: boolean
}) {
  if (loading) {
    return (
      <section className="knowledge-index-map-card">
        <IndexMapState
          icon={<RefreshCw className="is-spinning" size={18} />}
          label="加载节点中"
        />
      </section>
    )
  }
  if (!detail?.node) {
    return (
      <section className="knowledge-index-map-card">
        <IndexMapState icon={<CircleDot size={18} />} label="选择一个节点查看详情" />
      </section>
    )
  }
  const node = detail.node
  return (
    <section className="knowledge-index-map-card">
      <div className="knowledge-index-map-card__header">
        <div>
          <strong>{node.title || "未命名节点"}</strong>
          <span>{nodeTypeView(node.node_type).label} · {node.path || "/"}</span>
          {node.index_stage ? <span>阶段：{indexStageLabel(node.index_stage)}</span> : null}
        </div>
        <StatusPill
          status={normalizeIndexStatus(node.index_status)}
          label={indexStatusView(node.index_status).label}
          count={1}
        />
      </div>
      <p className="knowledge-index-map-card__summary">
        {node.summary || node.plain_text || node.content || "暂无内容摘要。"}
      </p>
      <KeywordList values={node.keywords || []} />
      <NodeLinks title="子节点" icon={<GitBranch size={14} />} nodes={detail.children || []} />
      <NodeLinks title="相关节点" icon={<Link2 size={14} />} nodes={detail.related || []} />
    </section>
  )
}

function NodeLinks({
  title,
  icon,
  nodes,
}: {
  title: string
  icon: ReactNode
  nodes: KnowledgeNodeResult[]
}) {
  return (
    <div className="knowledge-index-map-links">
      <h4>
        {icon}
        {title}
        <span>{nodes.length}</span>
      </h4>
      {nodes.length ? (
        <div>
          {nodes.slice(0, 8).map((node) => (
            <span key={node.id}>{node.title || node.path || `#${node.id}`}</span>
          ))}
        </div>
      ) : (
        <p>暂无{title}。</p>
      )}
    </div>
  )
}

function RecentErrors({ errors }: { errors: KnowledgeIndexOverview["recent_errors"] }) {
  return (
    <section className="knowledge-index-map-card">
      <div className="knowledge-index-map-card__header">
        <div>
          <strong>最近错误</strong>
          <span>失败文档会显示在这里</span>
        </div>
      </div>
      {errors?.length ? (
        <div className="knowledge-index-map-errors">
          {errors.map((error) => (
            <article key={error.id}>
              <strong>{error.title || error.storage_path || `文档 ${error.id}`}</strong>
              <p>{error.error_message || "索引失败"}</p>
            </article>
          ))}
        </div>
      ) : (
        <IndexMapState icon={<CheckCircle2 size={18} />} label="暂无索引错误" />
      )}
    </section>
  )
}

function EdgeDetailPanel({
  edge,
  nodes,
}: {
  edge: KnowledgeGraphEdge | null
  nodes: KnowledgeNodeResult[]
}) {
  if (!edge) {
    return null
  }
  const fromNode = nodes.find((node) => node.id === edge.from_node_id)
  const toNode = nodes.find((node) => node.id === edge.to_node_id)
  return (
    <section className="knowledge-index-map-card">
      <div className="knowledge-index-map-card__header">
        <div>
          <strong>{edge.label || edge.edge_type || "关系"}</strong>
          <span>
            {fromNode?.title || `node:${edge.from_node_id}`} → {toNode?.title || `node:${edge.to_node_id}`}
          </span>
        </div>
      </div>
      <p className="knowledge-index-map-card__summary">
        {edge.summary || edge.evidence || "暂无关系说明。"}
      </p>
      {edge.evidence ? (
        <div className="knowledge-index-map-edge-evidence">
          <strong>证据</strong>
          <p>{edge.evidence}</p>
        </div>
      ) : null}
    </section>
  )
}

function KeywordList({ values }: { values: string[] }) {
  const list = values.map((value) => value.trim()).filter(Boolean).slice(0, 12)
  if (!list.length) {
    return null
  }
  return (
    <div className="knowledge-index-map-keywords">
      {list.map((value) => (
        <span key={value}>{value}</span>
      ))}
    </div>
  )
}

function IndexMapState({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="knowledge-index-map-state">
      {icon}
      <span>{label}</span>
    </div>
  )
}

function firstTreeNode(nodes: KnowledgeIndexTreeNode[]) {
  for (const node of nodes) {
    if (node) {
      return node
    }
  }
  return null
}

function collectExpandableIDs(node: KnowledgeIndexTreeNode): number[] {
  const children = node.children || []
  const ids = children.length ? [node.id] : []
  return ids.concat(children.flatMap(collectExpandableIDs))
}

function filterTreeNodes(nodes: KnowledgeIndexTreeNode[], query: string): KnowledgeIndexTreeNode[] {
  const keyword = query.trim().toLowerCase()
  if (!keyword) {
    return nodes
  }
  return nodes.flatMap((node) => {
    const children = filterTreeNodes(node.children || [], keyword)
    if (nodeMatchesQuery(node, keyword) || children.length) {
      return [{ ...node, children }]
    }
    return []
  })
}

function filterGraph(graph: KnowledgeGraphResult, query: string, typeFilter: string): KnowledgeGraphResult {
  const keyword = query.trim().toLowerCase()
  const allowedNodes = new Set<number>()
  for (const node of graph.nodes || []) {
    if (typeFilter !== "all" && graphNodeGroup(node) !== typeFilter) {
      continue
    }
    if (keyword && !nodeMatchesQuery(node, keyword)) {
      continue
    }
    allowedNodes.add(node.id)
  }
  const edges = (graph.edges || []).filter((edge) => {
    if (allowedNodes.has(edge.from_node_id) && allowedNodes.has(edge.to_node_id)) {
      return true
    }
    if (!keyword) {
      return false
    }
    return edgeMatchesQuery(edge, keyword)
  })
  const edgeNodeIDs = new Set<number>()
  for (const edge of edges) {
    edgeNodeIDs.add(edge.from_node_id)
    edgeNodeIDs.add(edge.to_node_id)
  }
  return {
    nodes: (graph.nodes || []).filter((node) => edgeNodeIDs.has(node.id)),
    edges,
  }
}

function selectedGraphEdge(graph: KnowledgeGraphResult, edgeID: number) {
  if (!edgeID) {
    return null
  }
  return (graph.edges || []).find((edge) => edge.id === edgeID) || null
}

function nodeMatchesQuery(node: KnowledgeNodeResult, query: string) {
  return [
    node.title,
    node.path,
    node.summary,
    node.content,
    node.plain_text,
    node.node_type,
  ].some((value) => String(value || "").toLowerCase().includes(query))
}

function edgeMatchesQuery(edge: KnowledgeGraphEdge, query: string) {
  return [
    edge.label,
    edge.edge_type,
    edge.summary,
    edge.evidence,
  ].some((value) => String(value || "").toLowerCase().includes(query))
}

type GraphLayoutNode = KnowledgeNodeResult & {
  x: number
  y: number
  radius: number
  group: "source" | "middle" | "concept"
}

type GraphLayoutEdge = KnowledgeGraphEdge & {
  path: string
  labelX: number
  labelY: number
}

function buildGraphLayout(graph: KnowledgeGraphResult): {
  nodes: GraphLayoutNode[]
  edges: GraphLayoutEdge[]
} {
  const linkedIDs = new Set<number>()
  for (const edge of graph.edges || []) {
    if (edge.from_node_id && edge.to_node_id) {
      linkedIDs.add(edge.from_node_id)
      linkedIDs.add(edge.to_node_id)
    }
  }
  const nodes = (graph.nodes || [])
    .filter((node) => linkedIDs.has(node.id))
    .map((node) => ({ ...node, group: graphNodeGroup(node) }))
  const groupOrder: Array<GraphLayoutNode["group"]> = ["source", "middle", "concept"]
  const grouped = groupOrder.reduce(
    (result, group) => {
      result[group] = nodes.filter((node) => node.group === group)
      return result
    },
    {} as Record<GraphLayoutNode["group"], Array<KnowledgeNodeResult & { group: GraphLayoutNode["group"] }>>,
  )
  const xByGroup: Record<GraphLayoutNode["group"], number> = {
    source: 180,
    middle: 500,
    concept: 800,
  }
  const layoutNodes = groupOrder.flatMap((group) => {
    const rows = grouped[group]
    const step = Math.max(54, Math.min(96, 440 / Math.max(rows.length - 1, 1)))
    const startY = 70 + Math.max(0, (440 - step * (rows.length - 1)) / 2)
    return rows.map((node, index) => ({
      ...node,
      x: xByGroup[group],
      y: rows.length === 1 ? 280 : startY + index * step,
      radius: graphNodeRadius(node),
    }))
  })
  const nodeByID = new Map(layoutNodes.map((node) => [node.id, node]))
  const layoutEdges = (graph.edges || []).flatMap((edge) => {
    const from = nodeByID.get(edge.from_node_id)
    const to = nodeByID.get(edge.to_node_id)
    if (!from || !to) {
      return []
    }
    const delta = Math.max(Math.abs(to.x - from.x) * 0.42, 80)
    return [{
      ...edge,
      path: `M ${from.x} ${from.y} C ${from.x + delta} ${from.y}, ${to.x - delta} ${to.y}, ${to.x} ${to.y}`,
      labelX: (from.x + to.x) / 2,
      labelY: (from.y + to.y) / 2 - 6,
    }]
  })
  return { nodes: layoutNodes, edges: layoutEdges }
}

function graphNodeGroup(node: KnowledgeNodeResult): GraphLayoutNode["group"] {
  if (node.node_type === "concept") {
    return "concept"
  }
  if (node.node_type === "doc" || node.node_type === "heading" || node.node_type === "page") {
    return "source"
  }
  return "middle"
}

function graphNodeRadius(node: KnowledgeNodeResult) {
  if (node.node_type === "concept") {
    return 34
  }
  if (node.node_type === "doc") {
    return 31
  }
  return 27
}

function compactGraphLabel(value: string, maxLength: number) {
  const text = String(value || "").trim()
  if (text.length <= maxLength) {
    return text
  }
  return `${text.slice(0, Math.max(maxLength - 1, 1))}…`
}

function nodeTypeView(nodeType: string) {
  if (nodeType === "root" || nodeType === "dir") {
    return { label: "目录", icon: FolderTree }
  }
  if (nodeType === "doc") {
    return { label: "文档", icon: FileText }
  }
  if (nodeType === "concept") {
    return { label: "概念", icon: GitBranch }
  }
  return { label: nodeType || "节点", icon: CircleDot }
}

function normalizeIndexStatus(value: unknown): KnowledgeIndexStatus {
  switch (String(value || "").trim().toLowerCase()) {
    case "pending":
      return "pending"
    case "running":
      return "running"
    case "success":
      return "success"
    case "failed":
    case "fail":
      return "failed"
    default:
      return ""
  }
}

function indexStatusView(status: unknown) {
  const value = normalizeIndexStatus(status)
  if (value === "running") {
    return { status: value, label: "索引中", icon: RefreshCw }
  }
  if (value === "pending") {
    return { status: value, label: "待索引", icon: Timer }
  }
  if (value === "failed") {
    return { status: value, label: "索引失败", icon: XCircle }
  }
  if (value === "success") {
    return { status: value, label: "已索引", icon: CheckCircle2 }
  }
  return { status: "" as KnowledgeIndexStatus, label: "未索引", icon: Timer }
}

function indexStageLabel(stage: string) {
  const labels: Record<string, string> = {
    pending: "待处理",
    parse: "解析文档",
    nodes: "生成节点",
    summary: "生成摘要",
    graph: "抽取图谱",
    vector: "向量化",
    complete: "完成",
    failed: "失败",
  }
  return labels[String(stage || "").trim()] || stage
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}
