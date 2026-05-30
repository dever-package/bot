import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import {
  BaseEdge,
  Controls,
  EdgeLabelRenderer,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import type {
  Connection,
  Edge as ReactFlowEdge,
  EdgeProps,
  FinalConnectionState,
  Node as ReactFlowNode,
  NodeProps,
  OnConnectStartParams,
  OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  AlertCircle,
  Bot,
  CheckCircle,
  Combine,
  Database,
  FileText,
  GitBranch,
  PenTool,
  Sparkles,
  SquarePen,
  Terminal,
  Trash2,
  User,
  UserCheck,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentInteractionPanel } from "@/components/agent/interaction-panel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatStreamDuration,
  useStreamClock,
  type StreamTiming,
} from "@/components/stream-timing";
import type {
  CanvasPoint,
  ConnectState,
  ContextMenuState,
  DebugApprovalSubmit,
  FlowEdge,
  FlowItem,
  GraphExecutionState,
  NodeEdge,
  Selection,
  TeamNode,
  ViewMode,
} from "./types";
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  GRAPH_ACTION_BUTTON_STYLE,
  GRAPH_ACTION_ICON_STYLE,
  RUN_STATUS_FAIL,
  RUN_STATUS_RUNNING,
  RUN_STATUS_SUCCESS,
  RUN_STATUS_WAITING,
} from "./constants";
import {
  defaultGraphPosition,
  resolveNodeEdgeConditionOptions,
  workspaceNodeTypeLabel,
} from "./graph-state";
import {
  debugNodeTiming,
  graphExecutionCardStyle,
  graphExecutionEdgeKey,
  shouldShowRuntimeTiming,
} from "./debug-state";

type TeamGraphNodeData = {
  kind: ViewMode;
  item: FlowItem | TeamNode;
  connect: ConnectState;
  nodeTypes: Array<{ id: string; value: string }>;
  readonly: boolean;
  executionState?: GraphExecutionState | null;
  paramApi: string;
  now: number;
  onOpenNodeResult?: (nodeKey: string) => void;
  onSubmitApproval?: DebugApprovalSubmit;
  onEdit: (selection: Exclude<Selection, null>) => void;
  onDelete: (selection: Exclude<Selection, null>) => void;
} & Record<string, unknown>;

type TeamGraphEdgeData = {
  view: ViewMode;
  edge: FlowEdge | NodeEdge;
  index: number;
  preview?: boolean;
  highlighted?: boolean;
  nodes: TeamNode[];
  edgeConditions: Array<{ id: string; value: string }>;
  readonly: boolean;
  onSelect: (selection: Selection) => void;
  onDelete: (selection: Exclude<Selection, null>) => void;
  onChangeNodeEdge: (index: number, patch: Partial<NodeEdge>) => void;
} & Record<string, unknown>;

type TeamGraphNode = ReactFlowNode<TeamGraphNodeData, "teamGraphNode">;
type TeamGraphEdge = ReactFlowEdge<TeamGraphEdgeData, "teamGraphEdge">;
type ProximityConnection = {
  source: string;
  target: string;
};

const CONNECTED_NODE_MAX_DISTANCE = 220;
const CONNECTED_NODE_FALLBACK_DISTANCE = 170;
const PROXIMITY_CONNECT_DISTANCE = 150;

export function Canvas({
  view,
  flows,
  flowEdges,
  nodes,
  nodeEdges,
  edgeConditions,
  selected,
  connect,
  readonly,
  nodeTypes,
  executionState,
  paramApi,
  onSelect,
  onConnect,
  onOpenNodeResult,
  onSubmitApproval,
  onEdit,
  onDelete,
  onFlowConnect,
  onFlowConnectNew,
  onNodeConnect,
  onNodeConnectNew,
  onMove,
  onChangeNodeEdge,
}: {
  view: ViewMode;
  flows: FlowItem[];
  flowEdges: FlowEdge[];
  nodes: TeamNode[];
  nodeEdges: NodeEdge[];
  edgeConditions: Array<{ id: string; value: string }>;
  selected: Selection;
  connect: ConnectState;
  readonly: boolean;
  nodeTypes: Array<{ id: string; value: string }>;
  executionState?: GraphExecutionState | null;
  paramApi: string;
  onSelect: (selection: Selection) => void;
  onConnect: (connect: ConnectState) => void;
  onOpenNodeResult?: (nodeKey: string) => void;
  onSubmitApproval?: DebugApprovalSubmit;
  onEdit: (selection: Exclude<Selection, null>) => void;
  onDelete: (selection: Exclude<Selection, null>) => void;
  onFlowConnect: (fromKey: string, toKey: string) => void;
  onFlowConnectNew: (fromKey: string, position: CanvasPoint) => void;
  onNodeConnect: (fromKey: string, toKey: string) => void;
  onNodeConnectNew: (fromKey: string, position: CanvasPoint) => void;
  onMove: (kind: ViewMode, key: string, position: Record<string, any>) => void;
  onChangeNodeEdge: (index: number, patch: Partial<NodeEdge>) => void;
}) {
  return (
    <ReactFlowProvider>
      <ReactFlowCanvas
        view={view}
        flows={flows}
        flowEdges={flowEdges}
        nodes={nodes}
        nodeEdges={nodeEdges}
        edgeConditions={edgeConditions}
        selected={selected}
        connect={connect}
        readonly={readonly}
        nodeTypes={nodeTypes}
        executionState={executionState}
        paramApi={paramApi}
        onSelect={onSelect}
        onConnect={onConnect}
        onOpenNodeResult={onOpenNodeResult}
        onSubmitApproval={onSubmitApproval}
        onEdit={onEdit}
        onDelete={onDelete}
        onFlowConnect={onFlowConnect}
        onFlowConnectNew={onFlowConnectNew}
        onNodeConnect={onNodeConnect}
        onNodeConnectNew={onNodeConnectNew}
        onMove={onMove}
        onChangeNodeEdge={onChangeNodeEdge}
      />
    </ReactFlowProvider>
  );
}

type ReactFlowCanvasProps = {
  view: ViewMode;
  flows: FlowItem[];
  flowEdges: FlowEdge[];
  nodes: TeamNode[];
  nodeEdges: NodeEdge[];
  edgeConditions: Array<{ id: string; value: string }>;
  selected: Selection;
  connect: ConnectState;
  readonly: boolean;
  nodeTypes: Array<{ id: string; value: string }>;
  executionState?: GraphExecutionState | null;
  paramApi: string;
  onSelect: (selection: Selection) => void;
  onConnect: (connect: ConnectState) => void;
  onOpenNodeResult?: (nodeKey: string) => void;
  onSubmitApproval?: DebugApprovalSubmit;
  onEdit: (selection: Exclude<Selection, null>) => void;
  onDelete: (selection: Exclude<Selection, null>) => void;
  onFlowConnect: (fromKey: string, toKey: string) => void;
  onFlowConnectNew: (fromKey: string, position: CanvasPoint) => void;
  onNodeConnect: (fromKey: string, toKey: string) => void;
  onNodeConnectNew: (fromKey: string, position: CanvasPoint) => void;
  onMove: (kind: ViewMode, key: string, position: Record<string, any>) => void;
  onChangeNodeEdge: (index: number, patch: Partial<NodeEdge>) => void;
};

function ReactFlowCanvas({
  view,
  flows,
  flowEdges,
  nodes,
  nodeEdges,
  edgeConditions,
  selected,
  connect,
  readonly,
  nodeTypes,
  executionState,
  paramApi,
  onSelect,
  onConnect,
  onOpenNodeResult,
  onSubmitApproval,
  onEdit,
  onDelete,
  onFlowConnect,
  onFlowConnectNew,
  onNodeConnect,
  onNodeConnectNew,
  onMove,
  onChangeNodeEdge,
}: ReactFlowCanvasProps) {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
  const connectSourceRef = useRef<string | null>(null);
  const syncedViewRef = useRef(view);
  const draggingNodeRef = useRef(false);
  const { fitView, screenToFlowPosition } = useReactFlow<
    TeamGraphNode,
    TeamGraphEdge
  >();
  const now = useStreamClock(Boolean(executionState?.active));
  const items = view === "flow" ? flows : nodes;
  const edges = view === "flow" ? flowEdges : nodeEdges;
  const graphSignature = useMemo(
    () =>
      items
        .map((item: FlowItem | TeamNode) => graphItemKey(view, item))
        .join("|"),
    [items, view],
  );

  const derivedGraphNodes = useMemo<TeamGraphNode[]>(
    () =>
      items.map((item: FlowItem | TeamNode, index) => {
        const key = graphItemKey(view, item);
        const fallback = defaultGraphPosition(index);
        return {
          id: key,
          type: "teamGraphNode",
          position: {
            x: Number(item.position?.x ?? fallback.x),
            y: Number(item.position?.y ?? fallback.y),
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          selected: selected?.kind === view && selected.key === key,
          zIndex: selected?.kind === view && selected.key === key ? 100 : 1,
          draggable: !readonly,
          connectable: !readonly,
          style: {
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
          },
          data: {
            kind: view,
            item,
            connect,
            nodeTypes,
            readonly,
            executionState,
            paramApi,
            now,
            onOpenNodeResult,
            onSubmitApproval,
            onEdit,
            onDelete,
          },
        };
      }),
    [
      executionState,
      connect,
      items,
      nodeTypes,
      now,
      onDelete,
      onEdit,
      onOpenNodeResult,
      onSubmitApproval,
      paramApi,
      readonly,
      selected,
      view,
    ],
  );
  const [graphNodes, setGraphNodes] =
    useState<TeamGraphNode[]>(derivedGraphNodes);
  const [proximityConnection, setProximityConnection] =
    useState<ProximityConnection | null>(null);
  const [hoveredNodeKey, setHoveredNodeKey] = useState("");

  const graphEdges = useMemo<TeamGraphEdge[]>(() => {
    const nextEdges = edges.map((edge: FlowEdge | NodeEdge, index) => {
      const edgeSelectionKind = view === "flow" ? "flow_edge" : "node_edge";
      const selectedEdge =
        selected?.kind === edgeSelectionKind && selected.index === index;
      const executionEdgeKey = graphExecutionEdgeKey(edge, index);
      const activeExecutionEdge =
        executionState?.activeEdgeKeys.has(executionEdgeKey);
      const completedExecutionEdge =
        executionState?.completedEdgeKeys.has(executionEdgeKey);
      const highlightedEdge = isNodeEdgeConnectedTo(edge, hoveredNodeKey);
      const runningEdge = activeExecutionEdge || completedExecutionEdge;
      const stroke = selectedEdge
        ? "#2563eb"
        : highlightedEdge || runningEdge
          ? "#6366f1"
          : "#d4d4d8";

      return {
        id: graphEdgeID(view, edge, index),
        source: edge.from_key,
        target: edge.to_key,
        type: "teamGraphEdge",
        animated: Boolean(runningEdge || highlightedEdge),
        selected: selectedEdge,
        selectable: true,
        reconnectable: false,
        zIndex: selectedEdge || activeExecutionEdge || highlightedEdge ? 20 : 1,
        style: {
          stroke,
          strokeWidth:
            selectedEdge || activeExecutionEdge || highlightedEdge ? 2 : 1.5,
          strokeDasharray: selectedEdge || highlightedEdge ? "8 7" : "7 9",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          filter:
            activeExecutionEdge || highlightedEdge
              ? "drop-shadow(0 0 5px rgb(37 99 235 / 0.45))"
              : undefined,
        },
        data: {
          view,
          edge,
          index,
          highlighted: highlightedEdge,
          nodes,
          edgeConditions,
          readonly,
          onSelect,
          onDelete,
          onChangeNodeEdge,
        },
      };
    });
    if (proximityConnection) {
      nextEdges.push({
        id: proximityConnectionID(proximityConnection),
        source: proximityConnection.source,
        target: proximityConnection.target,
        type: "teamGraphEdge",
        animated: false,
        selectable: false,
        reconnectable: false,
        zIndex: 0,
        style: {
          stroke: "#6366f1",
          strokeWidth: 1.8,
          strokeDasharray: "5 7",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          opacity: 0.8,
        },
        data: {
          view,
          edge: {
            from_key: proximityConnection.source,
            to_key: proximityConnection.target,
            condition: "",
          },
          index: -1,
          preview: true,
          nodes,
          edgeConditions,
          readonly: true,
          onSelect,
          onDelete,
          onChangeNodeEdge,
        },
      });
    }
    return nextEdges;
  }, [
    edgeConditions,
    edges,
    executionState,
    hoveredNodeKey,
    nodes,
    onChangeNodeEdge,
    onDelete,
    onSelect,
    proximityConnection,
    readonly,
    selected,
    view,
  ]);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      void fitView({ padding: 0.24, maxZoom: 1.15, duration: 160 });
    });
  }, [fitView, graphSignature, view]);

  useEffect(() => {
    setGraphNodes((current) => {
      if (draggingNodeRef.current) {
        return current;
      }
      if (syncedViewRef.current !== view) {
        syncedViewRef.current = view;
        return derivedGraphNodes;
      }
      return mergeGraphNodes(current, derivedGraphNodes);
    });
  }, [derivedGraphNodes, view]);

  useEffect(() => {
    if (!contextMenu) {
      return;
    }
    const close = () => setContextMenu(null);
    const closeWithKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    window.addEventListener("click", close);
    window.addEventListener("contextmenu", close);
    window.addEventListener("keydown", closeWithKeyboard);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("contextmenu", close);
      window.removeEventListener("keydown", closeWithKeyboard);
    };
  }, [contextMenu]);

  useEffect(() => {
    const handleDeleteSelected = (event: KeyboardEvent) => {
      if (readonly || !selected || event.defaultPrevented) {
        return;
      }
      if (event.key !== "Delete" && event.key !== "Backspace") {
        return;
      }
      if (isTypingTarget(event.target)) {
        return;
      }
      event.preventDefault();
      onDelete(selected);
    };
    window.addEventListener("keydown", handleDeleteSelected);
    return () => window.removeEventListener("keydown", handleDeleteSelected);
  }, [onDelete, readonly, selected]);

  const handleNodesChange = useCallback<OnNodesChange<TeamGraphNode>>(
    (changes) => {
      if (readonly) {
        return;
      }
      setGraphNodes((current) => applyNodeChanges(changes, current));
    },
    [readonly],
  );

  const handleNodeDragStart = useCallback(() => {
    draggingNodeRef.current = true;
    setProximityConnection(null);
  }, []);

  const handleNodeDrag = useCallback(
    (_event: ReactMouseEvent, node: TeamGraphNode) => {
      if (readonly) {
        return;
      }
      const nextConnection = resolveProximityConnection(
        node,
        graphNodes,
        edges,
      );
      setProximityConnection((current) =>
        sameProximityConnection(current, nextConnection)
          ? current
          : nextConnection,
      );
    },
    [edges, graphNodes, readonly],
  );

  const handleNodeDragStop = useCallback(
    (_event: ReactMouseEvent, node: TeamGraphNode) => {
      draggingNodeRef.current = false;
      const nextConnection = resolveProximityConnection(
        node,
        graphNodes,
        edges,
      );
      setProximityConnection(null);
      if (readonly) {
        return;
      }
      const position = canvasPointFromPosition(node.position);
      setGraphNodes((current) =>
        mergeGraphNodes(current, derivedGraphNodes).map((item) =>
          item.id === node.id ? { ...item, position } : item,
        ),
      );
      onMove(view, node.id, position);
      if (nextConnection) {
        if (view === "flow") {
          onFlowConnect(nextConnection.source, nextConnection.target);
        } else {
          onNodeConnect(nextConnection.source, nextConnection.target);
        }
      }
    },
    [
      derivedGraphNodes,
      edges,
      graphNodes,
      onFlowConnect,
      onMove,
      onNodeConnect,
      readonly,
      view,
    ],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (readonly || !connection.source || !connection.target) {
        return;
      }
      if (view === "flow") {
        onFlowConnect(connection.source, connection.target);
      } else {
        onNodeConnect(connection.source, connection.target);
      }
    },
    [onFlowConnect, onNodeConnect, readonly, view],
  );

  const handleConnectStart = useCallback(
    (_event: MouseEvent | TouchEvent, params: OnConnectStartParams) => {
      connectSourceRef.current = params.nodeId;
      if (params.nodeId) {
        onConnect({ kind: view, fromKey: params.nodeId });
      }
    },
    [onConnect, view],
  );

  const handleConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
      const fromKey = connectSourceRef.current;
      connectSourceRef.current = null;
      onConnect(null);
      if (readonly || !fromKey || connectionState.toNode) {
        return;
      }
      const clientPoint = clientPointFromConnectEvent(event);
      if (!clientPoint) {
        return;
      }
      const flowPoint = screenToFlowPosition(clientPoint);
      const source = graphNodes.find((node) => node.id === fromKey);
      if (!isMeaningfulConnectDrag(source?.position, flowPoint)) {
        return;
      }
      const position = connectedNodePosition(source?.position, flowPoint);
      if (view === "flow") {
        onFlowConnectNew(fromKey, position);
      } else {
        onNodeConnectNew(fromKey, position);
      }
    },
    [
      graphNodes,
      onConnect,
      onFlowConnectNew,
      onNodeConnectNew,
      readonly,
      screenToFlowPosition,
      view,
    ],
  );

  const handleNodeClick = useCallback(
    (event: ReactMouseEvent, node: TeamGraphNode) => {
      if (isGraphCardControlTarget(event)) {
        return;
      }
      if (hasOpenableNodeResult(node)) {
        event.stopPropagation();
        node.data.onOpenNodeResult?.(node.id);
        return;
      }
      onSelect(graphNodeSelection(view, node.id));
    },
    [onSelect, view],
  );

  const handleNodeContextMenu = useCallback(
    (event: ReactMouseEvent, node: TeamGraphNode) => {
      event.preventDefault();
      const target = graphNodeSelection(view, node.id);
      onSelect(target);
      if (!readonly) {
        setContextMenu({ x: event.clientX, y: event.clientY, target });
      }
    },
    [onSelect, readonly, view],
  );

  const handleNodeMouseEnter = useCallback(
    (_event: ReactMouseEvent, node: TeamGraphNode) => {
      setHoveredNodeKey(node.id);
    },
    [],
  );

  const handleNodeMouseLeave = useCallback(() => {
    setHoveredNodeKey("");
  }, []);

  const handleEdgeClick = useCallback(
    (event: ReactMouseEvent, edge: TeamGraphEdge) => {
      event.stopPropagation();
      const target = graphEdgeSelection(edge);
      const alreadySelected =
        selected?.kind === target.kind && selected.index === target.index;
      const configurable = isGraphEdgeConfigurable(edge);
      if (alreadySelected && !readonly && !configurable) {
        onDelete(target);
        return;
      }
      onSelect(target);
    },
    [onDelete, onSelect, readonly, selected],
  );

  const handleEdgeContextMenu = useCallback(
    (event: ReactMouseEvent, edge: TeamGraphEdge) => {
      event.preventDefault();
      const target = graphEdgeSelection(edge);
      onSelect(target);
      if (!readonly) {
        setContextMenu({ x: event.clientX, y: event.clientY, target });
      }
    },
    [onSelect, readonly],
  );

  return (
    <div
      className="relative min-h-0 min-w-0 overflow-hidden"
      style={{ background: "#fff" }}
    >
      <style>{`
        .team-workflow-react-flow .react-flow__node {
          background: transparent;
          border: 0;
          box-shadow: none;
          opacity: 1;
          overflow: visible;
        }
        .team-workflow-react-flow .react-flow__node.dragging,
        .team-workflow-react-flow .react-flow__node.selected {
          z-index: 1000 !important;
          opacity: 1 !important;
        }
        .team-workflow-react-flow .react-flow__node.dragging .team-graph-node-circle {
          box-shadow: 0 14px 34px rgb(15 23 42 / 0.18);
        }
        .team-workflow-react-flow .react-flow__node:focus,
        .team-workflow-react-flow .react-flow__node:focus-visible {
          outline: none;
        }
        .team-workflow-react-flow .react-flow__edge-path {
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: stroke 0.25s ease, stroke-width 0.25s ease, opacity 0.25s ease, stroke-dasharray 0.25s ease;
        }
        .team-graph-node .react-flow__handle {
          opacity: 0.38;
          transition: opacity 150ms ease, border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
        }
        .team-graph-node:hover .react-flow__handle,
        .team-graph-node[data-selected="true"] .react-flow__handle {
          opacity: 0.75;
        }
        .team-graph-node {
          position: relative;
          display: flex;
          width: ${CARD_WIDTH}px;
          height: ${CARD_HEIGHT}px;
          align-items: center;
          justify-content: center;
          user-select: none;
        }
        .team-graph-node-circle {
          position: relative;
          display: flex;
          width: ${CARD_WIDTH}px;
          height: ${CARD_HEIGHT}px;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          border: 2px solid hsl(var(--border));
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          box-shadow: 0 4px 12px rgb(15 23 42 / 0.12);
          transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
        }
        .team-graph-node:hover .team-graph-node-circle {
          box-shadow: 0 8px 20px rgb(15 23 42 / 0.15);
        }
        .team-graph-node-label {
          position: absolute;
          top: ${CARD_HEIGHT + 8}px;
          left: 50%;
          width: 150px;
          transform: translateX(-50%);
          pointer-events: auto;
          user-select: none;
          text-align: center;
        }
        .team-graph-node-title {
          display: block;
          pointer-events: none;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: hsl(var(--foreground));
          font-size: 11px;
          font-weight: 700;
          line-height: 1.1;
        }
        .team-graph-node-subtitle {
          display: block;
          pointer-events: none;
          margin-top: 2px;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: hsl(var(--muted-foreground));
          font-size: 9px;
          line-height: 1;
          opacity: 0.7;
        }
        .team-graph-node-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          display: flex;
          width: 16px;
          height: 16px;
          align-items: center;
          justify-content: center;
          border: 1px solid hsl(var(--background));
          border-radius: 9999px;
          box-shadow: 0 1px 3px rgb(15 23 42 / 0.18);
        }
        .team-graph-actions {
          position: relative;
          z-index: 30;
          display: flex;
          height: 24px;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 6px;
          opacity: 0;
          transform: translateY(-3px);
          pointer-events: none;
          transition: opacity 150ms ease, transform 150ms ease;
        }
        .team-graph-node:hover .team-graph-actions,
        .team-graph-node[data-selected="true"] .team-graph-actions {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .team-graph-action-button {
          pointer-events: auto;
          border: 1px solid hsl(var(--border));
          border-radius: 9999px;
          background: hsl(var(--background));
          color: hsl(var(--muted-foreground));
          box-shadow: 0 3px 10px rgb(15 23 42 / 0.10);
          transition: border-color 150ms ease, color 150ms ease, background 150ms ease, transform 150ms ease;
        }
        .team-graph-action-button:hover {
          border-color: rgb(99 102 241 / 0.55);
          color: hsl(var(--foreground));
          transform: translateY(-1px);
        }
        .team-graph-action-button-danger:hover {
          border-color: hsl(var(--destructive) / 0.45);
          color: hsl(var(--destructive));
        }
        .team-graph-progress-indeterminate {
          animation: team-graph-spin 1s linear infinite;
          transform-origin: center;
        }
        @keyframes team-graph-spin {
          to { transform: rotate(360deg); }
        }
        .team-workflow-react-flow .react-flow__edge.animated .react-flow__edge-path {
          stroke-dasharray: 8 10;
          animation-duration: 0.9s;
        }
        .team-workflow-react-flow .react-flow__controls {
          border-color: hsl(var(--border));
          box-shadow: 0 8px 24px rgb(15 23 42 / 0.08);
        }
        .team-workflow-react-flow .react-flow__controls-button {
          border-color: hsl(var(--border));
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        @keyframes team-node-running {
          0%, 100% { box-shadow: 0 0 0 3px rgb(37 99 235 / 0.16), 0 8px 18px rgb(37 99 235 / 0.10); }
          50% { box-shadow: 0 0 0 6px rgb(37 99 235 / 0.08), 0 8px 22px rgb(37 99 235 / 0.16); }
        }
      `}</style>
      <ReactFlow<TeamGraphNode, TeamGraphEdge>
        className="team-workflow-react-flow"
        nodes={graphNodes}
        edges={graphEdges}
        nodeTypes={TEAM_GRAPH_NODE_TYPES}
        edgeTypes={TEAM_GRAPH_EDGE_TYPES}
        nodesDraggable={!readonly}
        nodesConnectable={!readonly}
        nodesFocusable
        edgesFocusable
        elementsSelectable
        connectOnClick={false}
        deleteKeyCode={null}
        fitView
        fitViewOptions={{ padding: 0.24, maxZoom: 1.15 }}
        minZoom={0.35}
        maxZoom={1.8}
        nodeDragThreshold={4}
        connectionRadius={48}
        defaultEdgeOptions={{ type: "teamGraphEdge" }}
        proOptions={{ hideAttribution: true }}
        onNodesChange={handleNodesChange}
        onConnect={handleConnect}
        onConnectStart={handleConnectStart}
        onConnectEnd={handleConnectEnd}
        onNodeDragStart={handleNodeDragStart}
        onNodeDrag={handleNodeDrag}
        onNodeDragStop={handleNodeDragStop}
        onNodeClick={handleNodeClick}
        onNodeContextMenu={handleNodeContextMenu}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        onEdgeClick={handleEdgeClick}
        onEdgeContextMenu={handleEdgeContextMenu}
        onPaneClick={() => {
          setContextMenu(null);
          onSelect(null);
        }}
        onPaneContextMenu={(event) => {
          event.preventDefault();
          setContextMenu(null);
        }}
      >
        <Controls showInteractive={false} position="top-right" />
      </ReactFlow>
      <CanvasContextMenu
        menu={contextMenu}
        onEdit={(target) => {
          setContextMenu(null);
          onEdit(target);
        }}
        onDelete={(target) => {
          setContextMenu(null);
          onDelete(target);
        }}
      />
    </div>
  );
}

function TeamGraphNodeCard({ data, selected }: NodeProps<TeamGraphNode>) {
  const key = graphItemKey(data.kind, data.item);
  const targetSelection = graphNodeSelection(data.kind, key);
  const nodeType = graphNodeType(data.item);
  const executionNode = data.executionState?.nodeRunsByKey[key];
  const executionRun = executionNode?.run;
  const executionAgentTrace = executionRun?.agent_run_id
    ? data.executionState?.agentRunsByID[String(executionRun.agent_run_id)]
    : undefined;
  const executionTiming =
    data.kind === "node" &&
    executionRun &&
    shouldShowRuntimeTiming(
      String(executionRun.node_type || graphNodeType(data.item) || ""),
    )
      ? debugNodeTiming(executionRun, executionAgentTrace, {
          node: data.item as TeamNode,
          nodeRuns: data.executionState?.nodeRuns || [],
        })
      : undefined;
  const executionStatus = executionNode?.status || "";
  const executionCardStyle = graphExecutionCardStyle(executionStatus);
  const pendingApproval =
    data.kind === "node"
      ? data.executionState?.pendingApprovalsByNodeKey[key]
      : undefined;
  const visualStatus = nodeVisualStatus(executionStatus);
  const progress = normalizeNodeProgress(executionTiming?.percent);
  const isConnecting =
    data.connect?.kind === data.kind && data.connect.fromKey === key;

  return (
    <div
      data-graph-interactive="true"
      data-selected={selected ? "true" : undefined}
      className="team-graph-node"
      style={{
        cursor: data.readonly ? "pointer" : "move",
        zIndex: pendingApproval ? 50 : executionTiming ? 40 : undefined,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={nodeHandleStyle(visualStatus, "target")}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={nodeHandleStyle(visualStatus, "source")}
      />
      <div
        className="team-graph-node-circle"
        style={{
          ...nodeCircleStyle(visualStatus, selected, isConnecting),
          ...executionCardStyle,
        }}
      >
        {visualStatus === "running" ? (
          <svg
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              transform: "rotate(-90deg)",
            }}
            viewBox="0 0 64 64"
          >
            <circle
              cx="32"
              cy="32"
              r="30"
              fill="transparent"
              stroke="rgb(59 130 246 / 0.15)"
              strokeWidth="2"
            />
            <circle
              cx="32"
              cy="32"
              r="30"
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={
                progress == null ? "team-graph-progress-indeterminate" : ""
              }
              style={
                progress != null
                  ? {
                      strokeDasharray: "188.5",
                      strokeDashoffset: `${188.5 * (1 - progress / 100)}`,
                    }
                  : {
                      strokeDasharray: "45 143.5",
                      strokeDashoffset: "0",
                    }
              }
            />
          </svg>
        ) : null}
        {graphNodeIcon(graphItemName(data.item), nodeType, data.kind)}
        <NodeStatusBadge status={visualStatus} />
      </div>
      {pendingApproval && data.onSubmitApproval ? (
        <DebugNodeApprovalDialog
          approval={pendingApproval}
          paramApi={data.paramApi}
          onSubmit={data.onSubmitApproval}
        />
      ) : null}
      <div className="team-graph-node-label">
        <span className="team-graph-node-title">
          {graphItemName(data.item) || key}
        </span>
        <span className="team-graph-node-subtitle">
          {nodeStatusText({
            status: visualStatus,
            timing: executionTiming,
            now: data.now,
            idleText:
              data.kind === "flow"
                ? graphFlowGoal(data.item) || key
                : workspaceNodeTypeLabel(nodeType, data.nodeTypes),
          })}
        </span>
        {!data.readonly ? (
          <div className="team-graph-actions">
            <button
              type="button"
              className="nodrag nopan team-graph-action-button"
              style={GRAPH_ACTION_BUTTON_STYLE}
              title="编辑"
              onClick={(event) => {
                event.stopPropagation();
                data.onEdit(targetSelection);
              }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <SquarePen size={13} style={GRAPH_ACTION_ICON_STYLE} />
            </button>
            <button
              type="button"
              className="nodrag nopan team-graph-action-button team-graph-action-button-danger"
              style={{
                ...GRAPH_ACTION_BUTTON_STYLE,
                color: "hsl(var(--destructive))",
              }}
              title="删除"
              onClick={(event) => {
                event.stopPropagation();
                data.onDelete(targetSelection);
              }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <Trash2 size={13} style={GRAPH_ACTION_ICON_STYLE} />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type NodeVisualStatus = "idle" | "running" | "waiting" | "done" | "error";

function nodeVisualStatus(status: string): NodeVisualStatus {
  if (status === RUN_STATUS_RUNNING) {
    return "running";
  }
  if (status === RUN_STATUS_WAITING) {
    return "waiting";
  }
  if (status === RUN_STATUS_SUCCESS) {
    return "done";
  }
  if (status === RUN_STATUS_FAIL) {
    return "error";
  }
  return "idle";
}

function normalizeNodeProgress(value: unknown) {
  if (value == null || value === "") {
    return null;
  }
  const percent = Number(value);
  if (!Number.isFinite(percent) || percent <= 0) {
    return null;
  }
  return Math.max(0, Math.min(100, Math.round(percent)));
}

function nodeCircleStyle(
  status: NodeVisualStatus,
  selected?: boolean,
  connecting?: boolean,
): CSSProperties {
  const style: CSSProperties = {};
  if (selected) {
    style.borderColor = "#6366f1";
    style.boxShadow =
      "0 0 15px rgb(99 102 241 / 0.35), 0 0 0 4px rgb(99 102 241 / 0.12)";
  }
  if (connecting) {
    style.borderColor = "#f59e0b";
    style.boxShadow =
      "0 0 0 4px rgb(251 191 36 / 0.18), 0 4px 12px rgb(15 23 42 / 0.12)";
  }
  if (status === "running") {
    style.borderColor = "#3b82f6";
    style.boxShadow =
      "0 0 0 4px rgb(59 130 246 / 0.08), 0 0 18px rgb(59 130 246 / 0.16)";
  }
  if (status === "waiting") {
    style.borderColor = "#f59e0b";
    style.boxShadow =
      "0 0 0 4px rgb(245 158 11 / 0.10), 0 0 20px rgb(245 158 11 / 0.28)";
  }
  if (status === "done") {
    style.borderColor = "#10b981";
    style.boxShadow = "0 4px 12px rgb(16 185 129 / 0.15)";
  }
  if (status === "error") {
    style.borderColor = "hsl(var(--destructive))";
    style.boxShadow = "0 4px 12px rgb(239 68 68 / 0.16)";
  }
  return style;
}

function nodeHandleStyle(
  status: NodeVisualStatus,
  handleType: "source" | "target",
): CSSProperties {
  let borderColor = "rgb(15 23 42 / 0.34)";
  if (status === "done" && handleType === "source") {
    borderColor = "rgb(16 185 129 / 0.55)";
  }
  if (status === "running") {
    borderColor = "rgb(59 130 246 / 0.6)";
  }
  if (status === "waiting") {
    borderColor = "rgb(245 158 11 / 0.6)";
  }
  if (status === "error") {
    borderColor = "rgb(239 68 68 / 0.62)";
  }
  const style: CSSProperties = {
    width: 7,
    height: 7,
    top: "50%",
    transform:
      handleType === "target"
        ? "translate(-50%, -50%)"
        : "translate(50%, -50%)",
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor,
    background: "hsl(var(--background))",
    boxShadow: "0 0 0 2px rgb(255 255 255 / 0.9)",
  };
  if (handleType === "target") {
    style.left = 0;
  } else {
    style.right = 0;
  }
  return style;
}

function NodeStatusBadge({ status }: { status: NodeVisualStatus }) {
  if (status === "running" || status === "idle") {
    return null;
  }
  const icon =
    status === "done" ? <CheckCircle size={10} /> : <AlertCircle size={10} />;

  return (
    <span className="team-graph-node-badge" style={nodeBadgeStyle(status)}>
      {icon}
    </span>
  );
}

function nodeBadgeStyle(status: NodeVisualStatus): CSSProperties {
  if (status === "done") {
    return { background: "#10b981", color: "#fff" };
  }
  if (status === "waiting") {
    return { background: "#f59e0b", color: "#fff" };
  }
  if (status === "error") {
    return {
      background: "hsl(var(--destructive))",
      color: "hsl(var(--destructive-foreground))",
    };
  }
  return { background: "hsl(var(--background))" };
}

function nodeStatusText({
  status,
  timing,
  now,
  idleText,
}: {
  status: NodeVisualStatus;
  timing?: StreamTiming;
  now: number;
  idleText: string;
}) {
  const duration = nodeTimingDuration(timing, now);
  if (status === "running") {
    return `进行中${duration}`;
  }
  if (status === "waiting") {
    return "待决策";
  }
  if (status === "done") {
    return `已完成${duration}`;
  }
  if (status === "error") {
    return "已失败";
  }
  return idleText || "待激活";
}

function nodeTimingDuration(timing: StreamTiming | undefined, now: number) {
  if (!timing?.startedAt) {
    return "";
  }
  const finishedAt = timing.finishedAt || now || Date.now();
  return `（${formatStreamDuration(finishedAt - timing.startedAt)}）`;
}

function graphNodeIcon(name: string, type: string, kind: ViewMode) {
  const normalizedType = String(type || "").toLowerCase();
  const normalizedName = String(name || "").toLowerCase();
  if (kind === "flow") {
    return <Workflow size={20} color="#6366f1" />;
  }
  if (normalizedType === "agent") {
    return <Bot size={20} color="#3b82f6" />;
  }
  if (normalizedType === "role") {
    return <User size={20} color="#6366f1" />;
  }
  if (normalizedType === "power") {
    return <Zap size={20} color="#f59e0b" />;
  }
  if (normalizedType === "team") {
    return <Workflow size={20} color="#14b8a6" />;
  }
  if (normalizedType === "context") {
    return <FileText size={20} color="#0ea5e9" />;
  }
  if (normalizedType === "condition") {
    return <GitBranch size={20} color="#f97316" />;
  }
  if (normalizedType === "merge") {
    return <Combine size={20} color="#f43f5e" />;
  }
  if (normalizedType === "human_approval") {
    return <UserCheck size={20} color="#8b5cf6" />;
  }
  if (normalizedType === "save") {
    return <Database size={20} color="#10b981" />;
  }
  if (
    normalizedName.includes("收集") ||
    normalizedName.includes("输入") ||
    normalizedName.includes("反馈") ||
    normalizedName.includes("审批")
  ) {
    return <UserCheck size={20} color="#8b5cf6" />;
  }
  if (
    normalizedName.includes("保存") ||
    normalizedName.includes("存储") ||
    normalizedName.includes("入库")
  ) {
    return <Database size={20} color="#10b981" />;
  }
  if (
    normalizedName.includes("写") ||
    normalizedName.includes("剧本") ||
    normalizedName.includes("故事") ||
    normalizedName.includes("设计") ||
    normalizedName.includes("创作")
  ) {
    return <PenTool size={20} color="#a855f7" />;
  }
  if (
    normalizedName.includes("背景") ||
    normalizedName.includes("世界") ||
    normalizedName.includes("元素") ||
    normalizedName.includes("灵感")
  ) {
    return <Sparkles size={20} color="#f59e0b" />;
  }
  return <Terminal size={20} color="#71717a" />;
}

function TeamGraphEdgeLine(props: EdgeProps<TeamGraphEdge>) {
  const { data, selected, style, animated } = props;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  });
  if (!data) {
    return <BaseEdge path={edgePath} style={style} />;
  }
  if (data.preview) {
    return <BaseEdge path={edgePath} style={style} interactionWidth={0} />;
  }
  const edgeSelection = graphEdgeSelectionFromData(data.view, data.index);
  const conditionOptions =
    data.view === "flow"
      ? []
      : resolveNodeEdgeConditionOptions(
          data.edge as NodeEdge,
          data.nodes,
          data.edgeConditions,
        );
  const configurableEdge = conditionOptions.length > 0;
  const fallbackCondition = conditionOptions[0]?.id ?? "";
  const condition = conditionOptions.some(
    (item) => item.id === data.edge.condition,
  )
    ? data.edge.condition || fallbackCondition
    : fallbackCondition;
  const showLabel = configurableEdge || selected;
  const highlighted = Boolean(data.highlighted);
  const edgeStyle = {
    ...style,
    opacity: selected ? 1 : highlighted ? 0.95 : animated ? 0.72 : 0.42,
    transition:
      "stroke 0.25s ease, stroke-width 0.25s ease, opacity 0.25s ease",
  };

  return (
    <>
      <BaseEdge path={edgePath} style={edgeStyle} interactionWidth={32} />
      {animated ? (
        <g style={{ opacity: selected || highlighted ? 0.9 : 0.45 }}>
          <circle r="2.5" fill="#6366f1" opacity="0.25">
            <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
          </circle>
          <circle r="1.5" fill="#818cf8">
            <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
          </circle>
        </g>
      ) : null}
      {showLabel ? (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan nowheel absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
            onClick={(event) => {
              event.stopPropagation();
              data.onSelect(edgeSelection);
            }}
            onContextMenu={(event) => {
              event.preventDefault();
              event.stopPropagation();
              data.onSelect(edgeSelection);
            }}
          >
            {!configurableEdge ? (
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center rounded-full border bg-background text-xs text-foreground shadow-sm",
                  selected && !data.readonly
                    ? "size-6 border-destructive text-destructive hover:bg-destructive/10"
                    : "size-5 border-blue-300 text-blue-600",
                )}
                title={
                  selected && !data.readonly
                    ? "删除关系"
                    : "点击选中关系，Delete 删除"
                }
                onClick={(event) => {
                  event.stopPropagation();
                  if (selected && !data.readonly) {
                    data.onDelete(edgeSelection);
                  } else {
                    data.onSelect(edgeSelection);
                  }
                }}
              >
                {selected && !data.readonly ? <X className="size-3.5" /> : null}
              </button>
            ) : (
              <div className="relative w-24">
                {selected && !data.readonly ? (
                  <button
                    type="button"
                    className="absolute -right-2 -top-2 z-20 flex size-5 items-center justify-center rounded-full border border-destructive bg-background text-destructive shadow-sm hover:bg-destructive/10"
                    title="删除关系"
                    onClick={(event) => {
                      event.stopPropagation();
                      data.onDelete(edgeSelection);
                    }}
                  >
                    <X className="size-3" />
                  </button>
                ) : null}
                <Select
                  value={condition}
                  disabled={data.readonly}
                  onValueChange={(value) =>
                    data.onChangeNodeEdge(data.index, { condition: value })
                  }
                >
                  <SelectTrigger className="h-7 justify-center rounded-full bg-background px-3 pr-3 text-xs shadow-sm [&_.select-trigger-chevron]:hidden">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}

const TEAM_GRAPH_NODE_TYPES = {
  teamGraphNode: TeamGraphNodeCard,
};

const TEAM_GRAPH_EDGE_TYPES = {
  teamGraphEdge: TeamGraphEdgeLine,
};

function hasOpenableNodeResult(node: TeamGraphNode) {
  const data = node.data;
  if (data.kind !== "node" || !data.onOpenNodeResult) {
    return false;
  }

  const executionStatus = data.executionState?.nodeRunsByKey[node.id]?.status;
  const pendingApproval =
    data.executionState?.pendingApprovalsByNodeKey[node.id];
  return Boolean(executionStatus && !pendingApproval);
}

function DebugNodeApprovalDialog({
  approval,
  paramApi,
  onSubmit,
}: {
  approval: DebugPendingApproval;
  paramApi: string;
  onSubmit: DebugApprovalSubmit;
}) {
  return (
    <Dialog open>
      <DialogContent
        data-assistant-layer="true"
        data-stop-card-click="true"
        className={cn(
          "flex max-h-[86vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl",
          "[&_*]:max-w-full [&_label]:min-w-0 [&_span]:break-words",
        )}
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        onWheel={(event) => event.stopPropagation()}
      >
        <AgentInteractionPanel
          interaction={approval.interaction}
          paramApi={paramApi}
          layout="dialog"
          onSubmit={(result) => onSubmit(approval, result)}
        />
      </DialogContent>
    </Dialog>
  );
}

function CanvasContextMenu({
  menu,
  onEdit,
  onDelete,
}: {
  menu: ContextMenuState;
  onEdit: (selection: Exclude<Selection, null>) => void;
  onDelete: (selection: Exclude<Selection, null>) => void;
}) {
  if (!menu) {
    return null;
  }

  return (
    <div
      className="fixed z-50 min-w-32 rounded-md border bg-popover p-1 text-sm text-popover-foreground shadow-lg"
      style={{ left: menu.x, top: menu.y }}
      onClick={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.preventDefault()}
    >
      {menu.target.kind === "flow" || menu.target.kind === "node" ? (
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left hover:bg-accent hover:text-accent-foreground"
          onClick={() => onEdit(menu.target)}
        >
          <SquarePen className="size-4" />
          编辑
        </button>
      ) : null}
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-destructive hover:bg-destructive/10"
        onClick={() => onDelete(menu.target)}
      >
        <Trash2 className="size-4" />
        删除
      </button>
    </div>
  );
}

function graphItemKey(view: ViewMode, item: FlowItem | TeamNode) {
  return view === "flow" ? (item as FlowItem).key : (item as TeamNode).node_key;
}

function canvasPointFromPosition(
  position: Partial<CanvasPoint>,
  yOffset = 0,
): CanvasPoint {
  const x = Number(position.x);
  const y = Number(position.y) + yOffset;
  return {
    x: Number.isFinite(x) ? x : 0,
    y: Number.isFinite(y) ? y : 0,
  };
}

function connectedNodePosition(
  sourcePosition: CanvasPoint | undefined,
  dropPoint: CanvasPoint,
) {
  const dropPosition = canvasPointFromPosition(dropPoint, -CARD_HEIGHT / 2);
  if (!sourcePosition) {
    return dropPosition;
  }

  const sourceCenter = nodeCenter(sourcePosition);
  const dropCenter = nodeCenter(dropPosition);
  const dx = dropCenter.x - sourceCenter.x;
  const dy = dropCenter.y - sourceCenter.y;
  const distance = Math.hypot(dx, dy);
  if (distance > 0 && distance <= CONNECTED_NODE_MAX_DISTANCE) {
    return dropPosition;
  }

  const directionX = distance > 0 ? dx / distance : 1;
  const directionY = distance > 0 ? dy / distance : 0;
  return {
    x:
      sourceCenter.x +
      directionX * CONNECTED_NODE_FALLBACK_DISTANCE -
      CARD_WIDTH / 2,
    y:
      sourceCenter.y +
      directionY * CONNECTED_NODE_FALLBACK_DISTANCE -
      CARD_HEIGHT / 2,
  };
}

function resolveProximityConnection(
  draggedNode: TeamGraphNode,
  graphNodes: TeamGraphNode[],
  edges: Array<FlowEdge | NodeEdge>,
): ProximityConnection | null {
  if (!isNodeIsolated(draggedNode.id, edges)) {
    return null;
  }

  const draggedCenter = nodeCenter(draggedNode.position);
  let closestNode: TeamGraphNode | null = null;
  let closestDistance = Number.MAX_VALUE;
  graphNodes.forEach((node) => {
    if (node.id === draggedNode.id) {
      return;
    }
    const center = nodeCenter(node.position);
    const distance = Math.hypot(
      center.x - draggedCenter.x,
      center.y - draggedCenter.y,
    );
    if (distance < closestDistance && distance < PROXIMITY_CONNECT_DISTANCE) {
      closestNode = node;
      closestDistance = distance;
    }
  });

  if (!closestNode) {
    return null;
  }

  const closestIsSource = closestNode.position.x < draggedNode.position.x;
  const connection = {
    source: closestIsSource ? closestNode.id : draggedNode.id,
    target: closestIsSource ? draggedNode.id : closestNode.id,
  };
  return edgeExists(edges, connection) ? null : connection;
}

function nodeCenter(position: CanvasPoint) {
  return {
    x: position.x + CARD_WIDTH / 2,
    y: position.y + CARD_HEIGHT / 2,
  };
}

function isNodeIsolated(key: string, edges: Array<FlowEdge | NodeEdge>) {
  return !edges.some((edge) => edge.from_key === key || edge.to_key === key);
}

function isNodeEdgeConnectedTo(
  edge: FlowEdge | NodeEdge,
  nodeKey: string | undefined,
) {
  if (!nodeKey) {
    return false;
  }
  return edge.from_key === nodeKey || edge.to_key === nodeKey;
}

function edgeExists(
  edges: Array<FlowEdge | NodeEdge>,
  connection: ProximityConnection,
) {
  return edges.some(
    (edge) =>
      edge.from_key === connection.source && edge.to_key === connection.target,
  );
}

function sameProximityConnection(
  left: ProximityConnection | null,
  right: ProximityConnection | null,
) {
  return left?.source === right?.source && left?.target === right?.target;
}

function proximityConnectionID(connection: ProximityConnection) {
  return `proximity:${connection.source}:${connection.target}`;
}

function mergeGraphNodes(
  currentNodes: TeamGraphNode[],
  nextNodes: TeamGraphNode[],
) {
  if (!currentNodes.length) {
    return nextNodes;
  }
  const currentByID = new Map(currentNodes.map((node) => [node.id, node]));
  return nextNodes.map((node) => {
    const current = currentByID.get(node.id);
    return current ? { ...current, ...node, position: current.position } : node;
  });
}

function graphItemName(item: FlowItem | TeamNode) {
  return item.name;
}

function graphFlowGoal(item: FlowItem | TeamNode) {
  return "node_key" in item ? "" : item.goal || "";
}

function graphNodeType(item: FlowItem | TeamNode) {
  return "node_key" in item ? item.type || "" : "";
}

function graphNodeSelection(
  view: ViewMode,
  key: string,
): Exclude<Selection, null> {
  return view === "flow" ? { kind: "flow", key } : { kind: "node", key };
}

function graphEdgeID(view: ViewMode, edge: FlowEdge | NodeEdge, index: number) {
  return `${view}:${edge.from_key}->${edge.to_key}:${index}`;
}

function graphEdgeSelection(edge: TeamGraphEdge): Exclude<Selection, null> {
  const data = edge.data!;
  return graphEdgeSelectionFromData(data.view, data.index);
}

function graphEdgeSelectionFromData(
  view: ViewMode,
  index: number,
): Exclude<Selection, null> {
  return view === "flow"
    ? { kind: "flow_edge", index }
    : { kind: "node_edge", index };
}

function isGraphEdgeConfigurable(edge: TeamGraphEdge) {
  const data = edge.data!;
  if (data.view === "flow") {
    return false;
  }
  return (
    resolveNodeEdgeConditionOptions(
      data.edge as NodeEdge,
      data.nodes,
      data.edgeConditions,
    ).length > 0
  );
}

function clientPointFromConnectEvent(event: MouseEvent | TouchEvent) {
  if ("clientX" in event) {
    return { x: event.clientX, y: event.clientY };
  }
  const touch = event.changedTouches[0] ?? event.touches[0];
  return touch ? { x: touch.clientX, y: touch.clientY } : null;
}

function isTypingTarget(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  if (!element) {
    return false;
  }
  const tagName = element.tagName.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    element.isContentEditable ||
    Boolean(element.closest('[contenteditable="true"]'))
  );
}

function isGraphCardControlTarget(event: ReactMouseEvent<HTMLElement>) {
  const target = event.target as HTMLElement | null;
  if (!target) {
    return false;
  }
  if (isTypingTarget(target)) {
    return true;
  }
  const interactive = target.closest(
    [
      "button",
      "a",
      "input",
      "textarea",
      "select",
      '[role="button"]',
      '[role="menuitem"]',
      '[role="option"]',
      '[data-assistant-layer="true"]',
      '[data-stop-card-click="true"]',
    ].join(","),
  );
  return Boolean(interactive && event.currentTarget.contains(interactive));
}

function isMeaningfulConnectDrag(
  source: { x: number; y: number } | undefined,
  point: CanvasPoint,
) {
  if (!source) {
    return false;
  }
  const start = {
    x: source.x + CARD_WIDTH,
    y: source.y + CARD_HEIGHT / 2,
  };
  return Math.hypot(point.x - start.x, point.y - start.y) > 48;
}
