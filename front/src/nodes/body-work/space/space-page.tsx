import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type EdgeChange,
  type KeyCode,
  type Node,
  type NodeChange,
  type NodeMouseHandler,
  type NodeProps,
  type OnConnect,
  type OnInit,
  type OnMove,
  type OnMoveEnd,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./space.css";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Eye,
  FileText,
  FileSearch,
  History,
  Image as ImageIcon,
  Lightbulb,
  Loader2,
  Minus,
  Moon,
  MousePointer2,
  PenTool,
  Play,
  Plus,
  Save,
  Square,
  Sun,
  Type,
  UserCheck,
  Upload,
  Video,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { getCompatModule, useNavigate, useTheme } from "@dever/front-plugin";
import { useBodyLoginConfig } from "../auth/site-config";
import "../shared/body-theme.css";
import { useBodyAppearance } from "../shared/use-body-appearance";
import { FirstFrameVideo } from "../../shared/first-frame-video";
import { VideoThumbnail } from "../../shared/video-thumbnail";
import type { AgentInteraction } from "@/components/agent/interaction-panel";
import {
  fetchSpaceBootstrap,
  fetchSpaceCanvas,
  fetchSpaceCanvasExecution,
  fetchSpaceCanvasExecutions,
  fetchSpacePowerForm,
  fetchSpaceRunStatus,
  generateSpaceCanvasNodeTitle,
  submitSpaceCanvasFeedback,
  submitSpaceInteraction,
  runSpaceCanvas,
  saveSpaceAssetEditVersion,
  saveSpaceCanvasContent,
  saveSpaceCanvasMaterial,
  stopSpaceCanvasRun,
} from "./space-api";
import { useCanvasAutosave, type CanvasSaveStatus } from "./space-autosave";
import { canvasEdgeCarriesMedia, canvasEdgePurpose } from "./space-canvas-edge";
import { SpaceCatalogCache } from "./space-catalog-cache";
import {
  runCanvasGroupMembers,
  storyboardRunBlockedReason,
  summarizeCanvasGroupRuntime,
  type CanvasGroupRuntimeSummary,
} from "./space-group-runtime";
import {
  canConnectCanvasNodes,
  canvasConnectionSourceNodes,
  canvasGroupMembers,
  reconcileCanvasGroupEdges,
  withCanvasNodeGroupAtPosition,
  withMovedCanvasNode,
} from "./space-group-model";
import { PowerIcon } from "../shared/power-icon";
import {
  CanvasViewControls,
  NodeActionMenu,
  useTransientFlowNodes,
} from "./space-workbench";
import {
  CanvasFloatingResizer,
  CanvasNodeResizer,
  normalizeCanvasResultViewState,
  withResizedCanvasNode,
  withResizedCanvasResultView,
  type CanvasNodeBounds,
  type CanvasNodeResizeHandler,
  type CanvasResultViewChangeHandler,
} from "./space-resizer";
import {
  emptyCanvasAgentRuntime,
  hasCanvasAgentRuntimeContent,
  readCanvasAgentResult,
  reduceCanvasAgentRuntime,
} from "./space-agent-runtime";
import type { ReferenceInput } from "../../show/agent-chat/reference";
import { normalizeAssetRecord } from "../asset/asset-api";
import type { AssetRecord } from "../asset/asset-types";
import {
  mergeProjectAssets,
  mergeProjectAssetVersionHistory,
  resultAssetKind,
  runResultAsset,
  withRunResultAsset,
} from "./space-assets";
import { buildNodeResultRef, canvasResultSourceFromNode } from "./space-result";
import { buildCanvasAssetIndex } from "./space-asset-index";
import { buildCanvasReferenceItems } from "./space-composer-reference";
import {
  canvasRunIdentity,
  normalizeCanvasRunRef,
  normalizeCanvasNodeResultPayload,
  canvasNodeResultErrorMessage,
  canvasRunErrorMessage,
  isActiveCanvasRun,
  type CanvasNodeResultRef,
  type CanvasRunRef,
} from "./space-runner";
import {
  canvasExecutionNodeIds,
  canvasNodeRunsInBackend,
  canvasNodeStopsExecution,
} from "./space-execution-plan";
import { watchSpaceCanvasStream, type SpaceStreamFrame } from "./space-stream";
import {
  FEEDBACK_REPLACED_MESSAGE,
  agentFeedbackFromResult,
  createNodeFeedbackRecord,
  currentNodeFeedbackRecords,
  flowFeedbackFromInteraction,
  flowFeedbackFromSnapshot,
  isFeedbackReplacedError,
  isReadonlyFeedbackRecord,
  normalizeFlowRunSnapshot,
  submitNodeFeedbackRecord,
  type FlowFeedbackPrompt,
  type FlowFeedbackRequester,
  type NodeFeedbackRecord,
} from "./space-feedback";
import { uploadSpaceFiles } from "./space-upload";
import {
  documentPreview,
  looseRichJSONText,
  richDocument,
  safeDocumentText,
  safeRichDocument,
} from "../shared/rich-document";
import {
  assetCateById,
  assetCateFromList,
  createLocalNode,
  defaultAssetCateId,
  defaultCanvasNodeTitle,
  emptyCanvasState,
  hasDefaultCanvasNodeSize,
  hydrateCanvasPowerCatalog,
  isCreationPower,
  isCreationRole,
  nextCanvasNodeNo,
  canvasComposerDraftSignature as composerDraftSyncSignature,
  normalizeCanvasComposerDraftOrDefault as normalizeComposerDraft,
  normalizeCanvasNodeIdentities,
  normalizeProjectAsset,
  powerNodeDefaultSize,
  readCanvasComposerDraft,
  relatedFlows,
  visibleAssetCates,
} from "./space-model";
import type {
  AssetCate,
  CanvasComposerDraft,
  ComposerAssetItem,
  CanvasResultRef,
  CanvasFunctionOption,
  CanvasResultSourceRef,
  CanvasResultViewState,
  PowerOption,
  ProjectAsset,
  SpaceBootstrap,
  SpaceCanvasEdge,
  SpaceCanvasNode,
  SpaceCanvasState,
  TeamFlow,
  TeamRole,
} from "./types";
import { SpaceAnimatedEdge } from "./space-edge";
import { FlowRunControl } from "./space-flow-run-control";
import { EditableCanvasNodeTitle } from "./space-node-title";
import {
  mergeCanvasComposerParamValues as mergeSavedComposerParamValues,
} from "./space-power-param";
import { filterActivePowerParams } from "./space-power-param-runtime";
import {
  isCanvasMediaReferenceNode,
  mediaUsageOptions,
  nextMediaUsageForSources,
  reconcileReferenceModeForMediaSources,
  resolveCanvasMultiImagePlan,
  type CanvasConnectedMediaReference,
  type CanvasMediaUsageAssignments,
} from "./space-media-references";
import {
  canvasMediaGridKind,
  canvasMultiMediaGridOutput,
  CanvasNodeContentView,
  contentOutputNeedsRenderer,
} from "./space-content-view";
import {
  firstNonEmptyText,
  contentOutputHasMedia,
  contentOutputMediaURLs,
  parseStoryboardGridOutput,
  normalizeEnergonOutput,
  plainMarkdownTextFromRichOutput,
  preferRicherMediaOutput,
  type StoryboardGridDocument,
  type StoryboardGridFrame,
} from "../shared/content-output";
import { STORYBOARD_GRID_MAX_IMAGES } from "../shared/storyboard-grid-layout";
import {
  isAudioPowerType,
  isStoryboardGridPowerType,
  isVideoComposePowerType,
  resolvePowerPresentation,
} from "../shared/power-presentation";
import {
  canvasStoryboardReferenceSourceSignature,
  isStoryboardDerivedPromptOverridden,
  restoredStoryboardDerivedPrompt,
  syncCanvasStoryboardDerivedGroups,
} from "./space-storyboard-derived-groups";
import { storyboardEditorFocusFromNode } from "./space-storyboard-focus";
import {
  buildStoryboardFrameIndex,
  moveStoryboardFrameNodes,
  markStoryboardFrameResultsCurrent,
  storyboardFrameDisplayBounds,
  storyboardFrameId,
  storyboardFrameMoveDelta,
  storyboardFrameRunSummary,
  storyboardFrameScopes,
  storyboardSourceNodeIdForNode,
  storyboardStructureLockedNodeIds,
  type StoryboardFrameScope,
} from "./space-storyboard-frame";
import {
  StoryboardFrameNode,
  type StoryboardFrameNodeData,
} from "./space-storyboard-frame-node";
import {
  parseStoryboardOutput,
  type StoryboardEditorFocus,
} from "./space-storyboard";
import {
  firstDefinedValue as firstDefined,
  parseMaybeEmbeddedJSON,
  parseMaybeJSON,
  repairJSONControlChars,
  safeJSONString,
  uniqueNonEmptyStrings,
} from "../shared/structured-json";
import type { StoryboardNodeStatus } from "./space-storyboard-node";
import { useCanvasNodeRunError } from "./space-run-error";
import { SpaceTooltip } from "./space-tooltip";
import { CanvasModuleLoading, CanvasStartupLoading } from "./space-loading";
import { useSpacePowerCatalog } from "./use-space-power-catalog";
import {
  isActiveRunningNode,
  omitRunningNode,
  type BackendNodeRunOptions,
  type BackendNodeRunner,
  type ConfirmRequest,
  type ConfirmRequester,
  type FunctionNodeRunner,
  type GeneratedNodePreview,
  type NodeDraftSetter,
  type NodeInputContext,
  type NodeResultSetter,
  type NodeStartRunner,
  type RunningNodeMap,
  type RunningNodeSetter,
  type RunningNodeState,
  type StoryboardFrameRunner,
  type WorkspaceNodeData,
} from "./space-node-runtime";
import {
  AgentInteractionPanel,
  AddNodeMenu,
  AssetAudioPreview,
  AssetBrowser,
  AssetPickerDialog,
  CanvasAgentResultContent,
  CanvasGroupNodeView,
  CanvasResultView,
  hasResultPreviewMedia,
  CanvasRunHistoryDrawer,
  CanvasNodeSettings,
  NodeDetailDialog,
  StoryboardGridCanvasView,
  StoryboardNodeContent,
  VideoComposeView,
  preloadAddNodeMenu,
  preloadAssetBrowser,
  preloadAssetPickerDialog,
  preloadCanvasRunHistoryDrawer,
  preloadCanvasNodeSettings,
  preloadNodeDetailDialog,
} from "./space-optional-components";
const { normalizeAgentResultOutputValue } = getCompatModule(
  "@/lib/agent-result-protocol",
) as {
  normalizeAgentResultOutputValue?: (value: any) => any;
};
type WorkMode = "create" | "result";
type WorkSpaceTheme = "dark" | "light";
const EMPTY_RUNNING_NODE_MAP: RunningNodeMap = {};
const EMPTY_CANVAS_NODES: SpaceCanvasNode[] = [];
const EMPTY_CANVAS_REFERENCE_ITEMS: ComposerAssetItem[] = [];
const EMPTY_CANVAS_MEDIA_REFERENCES: CanvasConnectedMediaReference[] = [];
const EMPTY_CANVAS_EDGE_IDS: ReadonlySet<string> = new Set<string>();
const CANVAS_NODE_TITLE_PROMPT_LIMIT = 800;
type RunningNodeUpdate = (current: RunningNodeMap) => RunningNodeMap;
type RunningNodeBatcher = {
  enqueue: (update: RunningNodeUpdate) => void;
  flush: () => void;
};
type CanvasStreamRuntime = {
  setRunningNode?: RunningNodeSetter;
  runningNodeBatcher?: RunningNodeBatcher;
};
type RecoveredCanvasStreamWatcher = {
  controller: AbortController;
  managedNodeIds: ReadonlySet<string>;
  finishedNodeIds: Set<string>;
};
type WorkspaceCanvasRunRef = CanvasRunRef & {
  asset_cate_id?: number;
  start_node_id?: string;
};
type ActiveWorkspaceCanvasRun = {
  run: WorkspaceCanvasRunRef;
  managedNodeIds: ReadonlySet<string>;
};
type ComposerDraft = CanvasComposerDraft;
type StoryboardGridImportRequest = {
  nodeId: string;
  frameIndex?: number;
};
type CanvasRunInputOptions = {
  assetCate: AssetCate;
  startNode: SpaceCanvasNode;
  canvas: Pick<SpaceCanvasState, "nodes" | "edges" | "viewport">;
  nodes?: SpaceCanvasNode[];
  singleNode?: boolean;
  executionScope?: "storyboard_frame";
  patchStartNodeResult?: boolean;
  runInput?: Record<string, unknown>;
};

function useRunningNodeBatcher(
  setRunningNode: RunningNodeSetter,
): RunningNodeBatcher {
  const pendingUpdatesRef = useRef<RunningNodeUpdate[]>([]);
  const frameRef = useRef(0);
  const flush = useCallback(() => {
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
    const updates = pendingUpdatesRef.current;
    pendingUpdatesRef.current = [];
    if (updates.length === 0) {
      return;
    }
    setRunningNode((current) =>
      updates.reduce((next, update) => update(next), current),
    );
  }, [setRunningNode]);
  const enqueue = useCallback(
    (update: RunningNodeUpdate) => {
      pendingUpdatesRef.current.push(update);
      if (frameRef.current) {
        return;
      }
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = 0;
        flush();
      });
    },
    [flush],
  );
  useEffect(
    () => () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
      pendingUpdatesRef.current = [];
    },
    [],
  );
  return useMemo(() => ({ enqueue, flush }), [enqueue, flush]);
}

function omitRecordKeys<T>(
  values: Record<string, T>,
  keys: ReadonlySet<string>,
) {
  let next: Record<string, T> | null = null;
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(values, key)) {
      continue;
    }
    next ||= { ...values };
    delete next[key];
  }
  return next || values;
}

function collectCanvasNodeRemovalIds(
  canvasNodes: SpaceCanvasNode[],
  targetNodes: SpaceCanvasNode[],
) {
  const removedNodeIds = new Set<string>();
  for (const node of targetNodes) {
    removedNodeIds.add(node.id);
    if (node.type !== "group") {
      continue;
    }
    for (const member of canvasGroupMembers(canvasNodes, node.id)) {
      removedNodeIds.add(member.id);
    }
  }
  return removedNodeIds;
}

function hasRunningCanvasNode(nodes: RunningNodeMap) {
  return Object.values(nodes).some(isActiveRunningNode);
}

function isCanvasRunCanceledError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "");
  return message.includes("运行已取消") || message.includes("运行已停止");
}

type DeleteCanvasNodeOptions = {
  allowStoryboardFrame?: boolean;
};
type AddConfiguredNodeHandler = (
  type: SpaceCanvasNode["type"],
  position?: CanvasPoint,
  options?: {
    asset?: ProjectAsset;
    flow?: TeamFlow;
    functionOption?: CanvasFunctionOption;
    power?: PowerOption;
    role?: TeamRole;
    connectToNodeId?: string;
    connectFromNodeId?: string;
    selectCreated?: boolean;
    replaceSingleAssetNode?: boolean;
  },
) => void;
type CanvasPoint = { x: number; y: number };
type CanvasSelectionRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};
type CanvasRightSelectionGesture = {
  pointerId: number;
  start: CanvasPoint;
  baseNodeIds: string[];
  moved: boolean;
};

function isCanvasPaneTarget(target: EventTarget | null) {
  return (
    target instanceof Element && target.classList.contains("react-flow__pane")
  );
}

function selectionRectFromScreenPoints(
  start: CanvasPoint,
  end: CanvasPoint,
  bounds: DOMRect,
): CanvasSelectionRect {
  return {
    left: Math.min(start.x, end.x) - bounds.left,
    top: Math.min(start.y, end.y) - bounds.top,
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  };
}

function canvasNodeIdsInsideSelection(
  nodes: SpaceCanvasNode[],
  start: CanvasPoint,
  end: CanvasPoint,
) {
  const selection = {
    left: Math.min(start.x, end.x),
    top: Math.min(start.y, end.y),
    right: Math.max(start.x, end.x),
    bottom: Math.max(start.y, end.y),
  };
  return nodes
    .filter((node) => {
      const size = canvasNodeStyleSize(node);
      const nodeRight = node.x + size.width;
      const nodeBottom = node.y + size.height;
      if (node.type === "group") {
        return (
          selection.left <= node.x &&
          selection.top <= node.y &&
          selection.right >= nodeRight &&
          selection.bottom >= nodeBottom
        );
      }
      return (
        selection.left <= nodeRight &&
        selection.right >= node.x &&
        selection.top <= nodeBottom &&
        selection.bottom >= node.y
      );
    })
    .map((node) => node.id);
}

function mergeCanvasNodeSelection(baseNodeIds: string[], hitNodeIds: string[]) {
  return [...new Set([...baseNodeIds, ...hitNodeIds])];
}
type CanvasNodeLookupIndex = {
  nodeById: Map<string, SpaceCanvasNode>;
  groupMembersById: Map<string, SpaceCanvasNode[]>;
  hasResultByNodeId: Map<string, boolean>;
};
type CanvasConnectionIndex = {
  inputContextByNodeId: Map<string, NodeInputContext>;
  incomingMediaReferencesByNodeId: Map<string, CanvasConnectedMediaReference[]>;
};
type CanvasRenderIndex = CanvasNodeLookupIndex &
  CanvasConnectionIndex & {
    runBlockedReasonByNodeId: Map<string, string>;
    highlightedPathEdgesByNodeId: Map<string, ReadonlySet<string>>;
  };
type FlowEdgeDecoration = {
  highlighted: boolean;
  selected: boolean;
  highlightColor: string;
};
type FlowEdgeRenderCacheEntry = FlowEdgeDecoration & {
  baseEdge: Edge;
  renderedEdge: Edge;
  onDeleteEdge: (edgeId: string) => void;
};
type PendingNodeConnection = {
  nodeId: string;
  handleId?: string | null;
  handleType?: string | null;
};
type NodeFocusRequest = {
  nodeId: string;
  nonce: number;
};
type AddNodeMenuState = {
  x: number;
  y: number;
  position: CanvasPoint;
  connection?: PendingNodeConnection;
};

const flowNodeTypes = {
  workSpace: SpaceNodeView,
  storyboardFrame: StoryboardFrameNode,
};

const flowEdgeTypes = {
  animated: SpaceAnimatedEdge,
};

const CANVAS_CONNECTION_LINE_STYLE: CSSProperties = {
  stroke: "var(--ws-green)",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeDasharray: "8 6",
};
const CANVAS_SNAP_GRID: [number, number] = [18, 18];
const CANVAS_MULTI_SELECTION_KEYS: KeyCode = ["Control", "Meta"];
const CANVAS_DEFAULT_EDGE_OPTIONS: Partial<Edge> = {
  type: "animated",
  animated: false,
};
const CANVAS_FIT_VIEW_OPTIONS = { padding: 0.32, maxZoom: 0.72 };

function useStableCallback<Args extends unknown[], Result>(
  callback: (...args: Args) => Result,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  return useCallback((...args: Args) => callbackRef.current(...args), []);
}

export function WorkSpacePage({
  onInitialLoadComplete,
}: {
  onInitialLoadComplete: () => void;
}) {
  const navigate = useNavigate();
  const loginConfig = useBodyLoginConfig();
  const projectId = useMemo(() => readProjectId(), []);
  const catalogCache = useMemo(() => new SpaceCatalogCache(), []);
  const [space, setSpace] = useState<SpaceBootstrap | null>(null);
  const [activeCateId, setActiveCateId] = useState(0);
  const activeCateIdRef = useRef(0);
  const [loadingCateId, setLoadingCateId] = useState<number | null>(null);
  const loadingCateIdRef = useRef<number | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const selectedNodeId = selectedNodeIds[selectedNodeIds.length - 1] || "";
  const [canvasStates, setCanvasStates] = useState<
    Record<string, SpaceCanvasState>
  >({});
  const canvasStatesRef = useRef(canvasStates);
  const [workMode, setWorkMode] = useState<WorkMode>("create");
  const { resolvedTheme: theme, setTheme } = useTheme();
  useBodyAppearance(loginConfig.site.appearance, theme);
  const [nodeMenu, setNodeMenu] = useState<AddNodeMenuState | null>(null);
  const [loading, setLoading] = useState(true);
  const initialLoadingRef = useRef(true);
  const [runningNodes, setRunningNodes] = useState<RunningNodeMap>({});
  const runningNodeBatcher = useRunningNodeBatcher(setRunningNodes);
  const [nodeResultOverrides, setNodeResultOverrides] = useState<
    Record<string, Partial<SpaceCanvasNode>>
  >({});
  const [nodeDetail, setNodeDetail] = useState<SpaceCanvasNode | null>(null);
  const [storyboardDetailFocus, setStoryboardDetailFocus] =
    useState<StoryboardEditorFocus>();
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(
    null,
  );
  const [focusNodeRequest, setFocusNodeRequest] =
    useState<NodeFocusRequest | null>(null);
  const [importPickerOpen, setImportPickerOpen] = useState(false);
  const [pendingImportNodeId, setPendingImportNodeId] = useState("");
  const [storyboardGridImport, setStoryboardGridImport] =
    useState<StoryboardGridImportRequest | null>(null);
  const [error, setError] = useState("");
  const [canvasRunRecords, setCanvasRunRecords] = useState<
    WorkspaceCanvasRunRef[]
  >([]);
  const [canvasRunHistoryRecords, setCanvasRunHistoryRecords] = useState<
    WorkspaceCanvasRunRef[]
  >([]);
  const [canvasRunHistoryLoading, setCanvasRunHistoryLoading] = useState(false);
  const [canvasRunHistoryError, setCanvasRunHistoryError] = useState("");
  const [canvasRunHistoryOpen, setCanvasRunHistoryOpen] = useState(false);
  const [canvasRunHistoryPage, setCanvasRunHistoryPage] = useState(1);
  const [canvasRunHistoryHasMore, setCanvasRunHistoryHasMore] = useState(false);
  const [stoppingCanvasRunKeys, setStoppingCanvasRunKeys] = useState<
    Set<string>
  >(() => new Set());
  const [stoppingAllCanvasRuns, setStoppingAllCanvasRuns] = useState(false);
  const [startFlowFeedbackPrompt, setStartFlowFeedbackPrompt] = useState<{
    node: SpaceCanvasNode;
    recordId: string;
    prompt: FlowFeedbackPrompt;
  } | null>(null);
  const [startFlowFeedbackSubmitting, setStartFlowFeedbackSubmitting] =
    useState(false);
  const pendingImportNodeRef = useRef<SpaceCanvasNode | null>(null);
  const storyboardGridImportSavingRef = useRef(false);
  const requestedNodeTitlesRef = useRef<Set<string>>(new Set());
  const appliedCanvasRunsRef = useRef<Set<string>>(new Set());
  const changedCanvasKeysRef = useRef<Set<number>>(new Set());
  const canvasRunRecordsRef = useRef<WorkspaceCanvasRunRef[]>([]);
  const canvasExecutionRefreshInFlightRef = useRef(false);
  const canvasHistoryRefreshInFlightRef = useRef(false);
  const canvasHistoryBeforeIDsRef = useRef<number[]>([0]);
  const canvasExecutionPollRef = useRef<(() => void) | null>(null);
  const recoveredCanvasStreamWatchersRef = useRef<
    Map<string, RecoveredCanvasStreamWatcher>
  >(new Map());
  const recoveredCanvasStreamCursorsRef = useRef<Map<string, string>>(
    new Map(),
  );
  const startFlowFeedbackRef = useRef<{
    nodeId: string;
    recordId: string;
    resolve: (values: Record<string, unknown>) => void;
    reject: (err: Error) => void;
    submit?: (values: Record<string, unknown>) => Promise<void>;
  } | null>(null);
  const {
    roles,
    powers,
    powerCategories,
    loaded: powerCatalogLoaded,
    required: powerCatalogRequired,
    load: loadPowerCatalog,
  } = useSpacePowerCatalog({
    space,
    canvases: canvasStates,
    cache: catalogCache,
  });

  useEffect(() => {
    canvasStatesRef.current = canvasStates;
  }, [canvasStates]);

  useEffect(() => {
    activeCateIdRef.current = activeCateId;
  }, [activeCateId]);

  useEffect(() => {
    canvasRunRecordsRef.current = canvasRunRecords;
  }, [canvasRunRecords]);

  const handleCanvasSaveError = useCallback((err: unknown) => {
    toast.error(err instanceof Error ? err.message : "保存画布失败");
  }, []);
  const { markCanvasDirty, resetCanvasAutosave, canvasSaveStatus } =
    useCanvasAutosave({
      projectId,
      enabled: Boolean(space),
      canvases: canvasStates,
      setCanvases: setCanvasStates,
      onError: handleCanvasSaveError,
    });

  useEffect(() => {
    if (changedCanvasKeysRef.current.size === 0) {
      return;
    }
    const changedKeys = [...changedCanvasKeysRef.current];
    changedCanvasKeysRef.current.clear();
    for (const assetCateId of changedKeys) {
      markCanvasDirty(assetCateId);
    }
  }, [canvasStates, markCanvasDirty]);

  const loadSpace = useCallback(async () => {
    if (!projectId) {
      setError("缺少作品 ID");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const nextSpace = await fetchSpaceBootstrap(
        projectId,
        activeCateIdRef.current,
      );
      const canvases = hydrateCanvasMapAssets(
        nextSpace.canvases || {},
        nextSpace.assets || [],
      );
      const initialCateId =
        Number(nextSpace.initialAssetCateId || 0) ||
        defaultAssetCateId(nextSpace);
      setSpace(nextSpace);
      canvasStatesRef.current = canvases;
      setCanvasStates(canvases);
      resetCanvasAutosave(canvases);
      activeCateIdRef.current = initialCateId;
      setActiveCateId(initialCateId);
      setLoadingCateId(null);
      loadingCateIdRef.current = null;
      requestedNodeTitlesRef.current = new Set();
      appliedCanvasRunsRef.current = new Set();
      canvasRunRecordsRef.current = [];
      setCanvasRunRecords([]);
      setCanvasRunHistoryRecords([]);
      setCanvasRunHistoryPage(1);
      setCanvasRunHistoryHasMore(false);
      canvasHistoryBeforeIDsRef.current = [0];
      void loadWorkspaceCanvasRuntimeExecutions(
        projectId,
        nextSpace,
        canvases,
        "recovery",
        { assetCateId: initialCateId },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载创作空间失败");
    } finally {
      setLoading(false);
    }
  }, [projectId, resetCanvasAutosave]);

  const requestConfirm = useCallback<ConfirmRequester>((request) => {
    setConfirmRequest(request);
  }, []);

  useEffect(() => {
    void loadSpace();
  }, [loadSpace]);

  useEffect(() => {
    if (loading || !initialLoadingRef.current) {
      return;
    }
    initialLoadingRef.current = false;
    onInitialLoadComplete();
  }, [loading, onInitialLoadComplete]);

  const canvasAssetCates = space?.assetCates;
  const cates = useMemo(() => (space ? visibleAssetCates(space) : []), [space]);
  const hasAssetCates = space ? space.assetCates.length > 0 : false;
  const activeCate = useMemo(
    () => (space ? assetCateById(space, activeCateId) : null),
    [activeCateId, space],
  );
  const activeFlows = useMemo(
    () => (space && activeCate ? relatedFlows(space, activeCate.id) : []),
    [activeCate, space],
  );
  const menuRoles = useMemo(() => {
    return roles.filter(isCreationRole);
  }, [roles]);
  const menuPowers = useMemo(() => powers.filter(isCreationPower), [powers]);
  const activeCanvas = useMemo(
    () =>
      activeCate
        ? canvasStates[String(activeCate.id)] || emptyCanvasState(activeCate.id)
        : emptyCanvasState(0),
    [activeCate, canvasStates],
  );
  const storyboardReferenceSourceSignature = useMemo(
    () =>
      Object.entries(canvasStates)
        .map(
          ([key, canvas]) =>
            `${key}:${canvasStoryboardReferenceSourceSignature(canvas)}`,
        )
        .join("|"),
    [canvasStates],
  );
  const canvasModel = useMemo(
    () => applyNodeResultOverrides(activeCanvas, nodeResultOverrides),
    [activeCanvas, nodeResultOverrides],
  );
  const storyboardGridImportLimit = STORYBOARD_GRID_MAX_IMAGES;
  const canvasAssetEntries = useMemo(
    () =>
      buildCanvasAssetIndex({
        nodes: canvasModel.nodes,
        assets: space?.assets || [],
        assetCateId: activeCate?.id || 0,
        nodeOutput: nodeContextOutput,
        nodePreview: generatedNodePreview,
        assetPreview: (asset) => {
          const output = asset.version?.content ?? asset.name;
          const preview = generatedPreviewFromValue(
            output,
            String(asset.kind || ""),
          );
          if (!hasGeneratedPreview(preview)) {
            preview.text = asset.name;
          }
          return preview;
        },
        nodeHasResult: nodeHasResultContent,
      }),
    [activeCate?.id, canvasModel.nodes, space?.assets],
  );
  const canvasReferenceItems = useMemo(
    () => buildCanvasReferenceItems(canvasAssetEntries),
    [canvasAssetEntries],
  );
  useEffect(() => {
    if (!canvasAssetCates || (powerCatalogRequired && !powerCatalogLoaded)) {
      return;
    }
    setCanvasStates((current) => {
      let next = current;
      for (const [key, canvas] of Object.entries(current)) {
        const assetCateId = Number(key || canvas.assetCateId || 0);
        const synced = syncCanvasStoryboardDerivedGroups({
          canvas,
          assetCate: assetCateFromList(canvasAssetCates, assetCateId),
          powers,
        });
        const normalized = normalizeCanvasForState(synced, assetCateId);
        if (isSameCanvasState(canvas, normalized)) {
          continue;
        }
        if (next === current) {
          next = { ...current };
        }
        next[key] = normalized;
        changedCanvasKeysRef.current.add(assetCateId);
      }
      return next;
    });
  }, [
    canvasAssetCates,
    powerCatalogLoaded,
    powerCatalogRequired,
    powers,
    storyboardReferenceSourceSignature,
  ]);

  const openImportPickerByNodeId = useCallback(
    (nodeId = "") => {
      void preloadAssetPickerDialog();
      setPendingImportNodeId(nodeId);
      pendingImportNodeRef.current =
        activeCanvas.nodes.find((node) => node.id === nodeId) ||
        (pendingImportNodeRef.current?.id === nodeId
          ? pendingImportNodeRef.current
          : null);
      setNodeMenu(null);
      setWorkMode("create");
      setImportPickerOpen(true);
    },
    [activeCanvas.nodes],
  );

  const updateCanvasState = useCallback(
    (
      assetCateId: number,
      updater: (canvas: SpaceCanvasState) => SpaceCanvasState,
    ) => {
      if (!Number.isInteger(assetCateId) || assetCateId < 0) {
        return;
      }
      const applyUpdate = (current: Record<string, SpaceCanvasState>) => {
        const key = String(assetCateId);
        const currentCanvas = current[key] || emptyCanvasState(assetCateId);
        const nextCanvas = normalizeCanvasForState(
          updater(currentCanvas),
          assetCateId,
        );
        if (isSameCanvasState(currentCanvas, nextCanvas)) {
          return current;
        }
        changedCanvasKeysRef.current.add(assetCateId);
        return {
          ...current,
          [key]: nextCanvas,
        };
      };
      const currentRuntimeStates = canvasStatesRef.current;
      const nextRuntimeStates = applyUpdate(currentRuntimeStates);
      canvasStatesRef.current = nextRuntimeStates;
      setCanvasStates((current) => {
        const next =
          current === currentRuntimeStates
            ? nextRuntimeStates
            : applyUpdate(current);
        canvasStatesRef.current = next;
        return next;
      });
    },
    [],
  );

  const updateActiveCanvas = useCallback(
    (updater: (canvas: SpaceCanvasState) => SpaceCanvasState) => {
      if (!activeCate) {
        return;
      }
      updateCanvasState(activeCate.id, updater);
    },
    [activeCate, updateCanvasState],
  );

  const updateCanvasNodeResult = useCallback(
    (assetCateId: number, nodeId: string, patch: Partial<SpaceCanvasNode>) => {
      setNodeResultOverrides((current) =>
        removeCommittedNodeOverrideFields(current, nodeId, patch),
      );
      updateCanvasState(assetCateId, (currentCanvas) => {
        const patchedCanvas = {
          ...currentCanvas,
          nodes: currentCanvas.nodes.map((node) =>
            node.id === nodeId ? { ...node, ...patch } : node,
          ),
        };
        const syncedCanvas = canvasAssetCates
          ? syncCanvasStoryboardDerivedGroups({
              canvas: patchedCanvas,
              assetCate: assetCateFromList(canvasAssetCates, assetCateId),
              powers,
            })
          : patchedCanvas;
        return syncedCanvas;
      });
    },
    [canvasAssetCates, powers, updateCanvasState],
  );

  const updateNodeResult = useCallback<NodeResultSetter>(
    (nodeId, patch) => {
      updateCanvasNodeResult(Number(activeCate?.id || 0), nodeId, patch);
      setNodeDetail((current) =>
        current?.id === nodeId ? { ...current, ...patch } : current,
      );
    },
    [activeCate?.id, updateCanvasNodeResult],
  );

  const requestGeneratedNodeTitle = useCallback(
    (
      assetCateId: number,
      node: SpaceCanvasNode,
      result: CanvasNodeResultRef,
    ) => {
      if (!shouldGenerateCanvasNodeTitle(node, result)) {
        return;
      }
      const versionId = canvasNodeResultVersionId(result);
      const requestKey = `${node.id}:${versionId}`;
      if (requestedNodeTitlesRef.current.has(requestKey)) {
        return;
      }
      requestedNodeTitlesRef.current.add(requestKey);
      const expectedTitle = node.title.trim();
      const canvas = canvasStatesRef.current[String(assetCateId)];
      void generateSpaceCanvasNodeTitle({
        projectId,
        nodeKey: node.id,
        versionId,
        prompt: canvasNodeTitlePrompt(node, canvas),
      })
        .then((generated) => {
          const title = generated.title.trim();
          if (
            !title ||
            title === expectedTitle ||
            generated.versionId !== versionId
          ) {
            return;
          }
          updateCanvasState(assetCateId, (currentCanvas) => {
            const currentNode = currentCanvas.nodes.find(
              (item) => item.id === node.id,
            );
            if (
              !currentNode ||
              currentNode.titleMode !== "auto" ||
              currentNode.title.trim() !== expectedTitle ||
              !isDefaultCanvasNodeTitle(currentNode)
            ) {
              return currentCanvas;
            }
            return {
              ...currentCanvas,
              nodes: currentCanvas.nodes.map((item) =>
                item.id === node.id ? { ...item, title } : item,
              ),
            };
          });
        })
        .catch(() => {
          requestedNodeTitlesRef.current.delete(requestKey);
        });
    },
    [projectId, updateCanvasState],
  );

  const persistCanvasRunSnapshot = useCallback(
    async (input: CanvasStartRunInput) => {
      const cateId = Number(input.assetCate.id || 0);
      if (cateId) {
        markCanvasDirty(cateId);
      }
    },
    [markCanvasDirty],
  );

  const updateNodeComposerDraft = useCallback<NodeDraftSetter>(
    (nodeId, draft) => {
      updateActiveCanvas((canvas) => ({
        ...canvas,
        nodes: canvas.nodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                composerDraft: normalizeComposerDraft(draft),
              }
            : node,
        ),
      }));
    },
    [updateActiveCanvas],
  );
  const removeConnectedMediaEdge = useCallback(
    (edgeId: string) => {
      updateActiveCanvas((canvas) => {
        const edges = canvas.edges.filter((edge) => edge.id !== edgeId);
        return edges.length === canvas.edges.length
          ? canvas
          : { ...canvas, edges };
      });
    },
    [updateActiveCanvas],
  );

  const showNodeDetail = useCallback(
    (node: SpaceCanvasNode, focus?: StoryboardEditorFocus) => {
      void preloadNodeDetailDialog();
      setStoryboardDetailFocus(focus);
      setNodeDetail(node);
    },
    [],
  );

  const patchNodeFeedbackRecords = useCallback(
    (
      nodeId: string,
      updater: (records: NodeFeedbackRecord[]) => NodeFeedbackRecord[],
    ) => {
      setNodeResultOverrides((current) => {
        const canvasNode = activeCanvas.nodes.find(
          (node) => node.id === nodeId,
        );
        if (!canvasNode) {
          return current;
        }
        const currentPatch = current[nodeId] || {};
        const node = {
          ...canvasNode,
          ...currentPatch,
        };
        return {
          ...current,
          [nodeId]: {
            ...currentPatch,
            feedbackRequests: updater(currentNodeFeedbackRecords(node)),
          },
        };
      });
    },
    [activeCanvas.nodes],
  );

  const clearNodeFeedbackRecords = useCallback((nodeIds: string[]) => {
    const targets = new Set(nodeIds.filter(Boolean));
    if (targets.size === 0) {
      return;
    }
    if (
      startFlowFeedbackRef.current &&
      targets.has(startFlowFeedbackRef.current.nodeId)
    ) {
      const pending = startFlowFeedbackRef.current;
      startFlowFeedbackRef.current = null;
      pending.reject(new Error(FEEDBACK_REPLACED_MESSAGE));
    }
    setStartFlowFeedbackPrompt((current) =>
      current && targets.has(current.node.id) ? null : current,
    );
    setNodeResultOverrides((current) => {
      const next = { ...current };
      let changed = false;
      for (const nodeId of targets) {
        const currentPatch = next[nodeId] || {};
        next[nodeId] = {
          ...currentPatch,
          feedbackRequests: [],
        };
        changed = true;
      }
      return changed ? next : current;
    });
  }, []);

  const upsertSpaceAsset = useCallback((asset: ProjectAsset) => {
    if (!asset || !asset.id) {
      return;
    }
    setSpace((current) => {
      if (!current) {
        return current;
      }
      return {
        ...current,
        assets: mergeProjectAssets(current.assets, [asset]),
      };
    });
  }, []);

  const requestStartFlowFeedback = useCallback<FlowFeedbackRequester>(
    ({ node, prompt }) => {
      const record = createStableNodeFeedbackRecord(node, prompt);
      const feedbackRequests = upsertNodeFeedbackRecord(
        currentNodeFeedbackRecords(node),
        record,
      );
      patchNodeFeedbackRecords(node.id, (records) =>
        upsertNodeFeedbackRecord(records, record),
      );
      setStartFlowFeedbackSubmitting(false);
      return new Promise<Record<string, unknown>>((resolve, reject) => {
        startFlowFeedbackRef.current = {
          nodeId: node.id,
          recordId: record.id,
          resolve,
          reject,
        };
        setStartFlowFeedbackPrompt({
          node: { ...node, feedbackRequests },
          recordId: record.id,
          prompt,
        });
      });
    },
    [patchNodeFeedbackRecords],
  );

  const submitStartFlowFeedback = useCallback(
    async (values: Record<string, unknown>) => {
      const pending = startFlowFeedbackRef.current;
      if (!pending || startFlowFeedbackSubmitting) {
        return;
      }
      setStartFlowFeedbackSubmitting(true);
      try {
        await pending.submit?.(values);
        patchNodeFeedbackRecords(pending.nodeId, (records) =>
          submitNodeFeedbackRecord(records, pending.recordId, values),
        );
        startFlowFeedbackRef.current = null;
        setStartFlowFeedbackPrompt(null);
        pending.resolve(values);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "提交反馈失败");
      } finally {
        setStartFlowFeedbackSubmitting(false);
      }
    },
    [patchNodeFeedbackRecords, startFlowFeedbackSubmitting],
  );

  const closeStartFlowFeedback = useCallback(() => {
    setStartFlowFeedbackPrompt(null);
  }, []);

  const openNodeFeedbackRecord = useCallback(
    (node: SpaceCanvasNode, record: NodeFeedbackRecord) => {
      if (
        startFlowFeedbackRef.current?.nodeId === node.id &&
        startFlowFeedbackRef.current.recordId === record.id &&
        record.status === "pending"
      ) {
        setStartFlowFeedbackPrompt({
          node,
          recordId: record.id,
          prompt: record.prompt,
        });
        return;
      }

      if (record.status === "pending") {
        const recovered = pendingCanvasFeedbackContext(
          canvasRunRecordsRef.current,
          node,
          record,
        );
        if (recovered) {
          setStartFlowFeedbackSubmitting(false);
          startFlowFeedbackRef.current = {
            nodeId: node.id,
            recordId: record.id,
            resolve: () => undefined,
            reject: () => undefined,
            submit: async (values) => {
              await submitBackendCanvasFeedbackResponse(
                projectId,
                recovered.run,
                recovered.pending,
                recovered.prompt,
                values,
              );
              toast.success("已提交反馈，流程继续执行");
              window.setTimeout(() => canvasExecutionPollRef.current?.(), 0);
            },
          };
          setStartFlowFeedbackPrompt({
            node,
            recordId: record.id,
            prompt: recovered.prompt,
          });
          return;
        }
      }

      setStartFlowFeedbackPrompt({
        node,
        recordId: record.id,
        prompt: {
          ...record.prompt,
          values: record.values || record.prompt.values || {},
        },
      });
    },
    [projectId],
  );

  const createCanvasRunInput = useCallback(
    ({
      assetCate,
      startNode,
      canvas,
      nodes = canvas.nodes,
      ...executionOptions
    }: CanvasRunInputOptions): CanvasStartRunInput => {
      if (!space) {
        throw new Error("创作空间尚未加载");
      }
      return {
        projectId,
        assetCate,
        space,
        startNode,
        ...executionOptions,
        nodes,
        edges: canvas.edges,
        viewport: canvas.viewport,
        onNodeResult: updateNodeResult,
        onAssetCreated: upsertSpaceAsset,
        setRunningNode: setRunningNodes,
        runningNodeBatcher,
        requestFlowFeedback: requestStartFlowFeedback,
        requestNodeTitle: (node, result) =>
          requestGeneratedNodeTitle(assetCate.id, node, result),
      };
    },
    [
      projectId,
      requestGeneratedNodeTitle,
      requestStartFlowFeedback,
      runningNodeBatcher,
      space,
      updateNodeResult,
      upsertSpaceAsset,
    ],
  );

  const recoverCanvasRunExecution = useCallback(
    async (runInput: CanvasStartRunInput | null) => {
      if (!space) {
        return;
      }
      await loadWorkspaceCanvasRuntimeExecutions(
        projectId,
        space,
        canvasStatesRef.current,
        "recovery",
        { runIds: [Number(runInput?.canvasRun?.run_id || 0)] },
      );
    },
    [projectId, space],
  );

  const runStartNode = useCallback<NodeStartRunner>(
    async (startNode) => {
      if (!space || !activeCate) {
        return;
      }
      let runInput: CanvasStartRunInput | null = null;
      try {
        clearNodeFeedbackRecords(
          canvasExecutionNodeIds(
            startNode.id,
            canvasModel.nodes,
            canvasModel.edges,
          ),
        );
        runInput = createCanvasRunInput({
          assetCate: activeCate,
          startNode,
          canvas: {
            nodes: canvasModel.nodes,
            edges: canvasModel.edges,
            viewport: activeCanvas.viewport,
          },
        });
        await runCanvasFromStartNode(runInput);
        await persistCanvasRunSnapshot(runInput);
        toast.success("开始节点执行完成");
      } catch (err) {
        if (isFeedbackReplacedError(err)) {
          return;
        }
        if (isCanvasRunCanceledError(err)) {
          return;
        }
        const message = err instanceof Error ? err.message : "开始节点执行失败";
        setRunningNodes((current) => ({
          ...current,
          [startNode.id]: {
            nodeId: startNode.id,
            title: startNode.title,
            startedAt: Date.now(),
            progress: 92,
            status: "error",
          },
        }));
        toast.error(message);
        window.setTimeout(() => {
          setRunningNodes((current) => omitRunningNode(current, startNode.id));
        }, 1400);
      } finally {
        await recoverCanvasRunExecution(runInput);
      }
    },
    [
      activeCate,
      activeCanvas.viewport,
      canvasModel.edges,
      canvasModel.nodes,
      clearNodeFeedbackRecords,
      createCanvasRunInput,
      persistCanvasRunSnapshot,
      recoverCanvasRunExecution,
      setRunningNodes,
      space,
    ],
  );

  const runStoryboardFrame = useCallback<StoryboardFrameRunner>(
    async (sourceNodeId) => {
      if (!space || !activeCate) {
        return;
      }
      const cateId = Number(activeCate.id || 0);
      const currentCanvas =
        canvasStatesRef.current[String(cateId)] || activeCanvas;
      const sourceNode = currentCanvas.nodes.find(
        (node) => node.id === sourceNodeId,
      );
      if (!sourceNode) {
        toast.error("分镜脚本节点不存在");
        return;
      }
      const frame = storyboardFrameScopes(
        currentCanvas.nodes,
        nodeHasResultContent,
      ).find((current) => current.sourceNodeId === sourceNodeId);
      if (!frame) {
        toast.error("当前分镜脚本尚未生成制作组");
        return;
      }
      const runSummary = storyboardFrameRunSummary(
        frame,
        currentCanvas.nodes,
        nodeHasResultContent,
      );
      if (runSummary.blockedReason) {
        toast.error(runSummary.blockedReason);
        return;
      }

      const frameId = storyboardFrameId(sourceNodeId);
      const runInput = createCanvasRunInput({
        assetCate: activeCate,
        startNode: sourceNode,
        executionScope: "storyboard_frame",
        patchStartNodeResult: false,
        canvas: currentCanvas,
      });
      clearNodeFeedbackRecords(runSummary.pendingNodeIds);
      setRunningNodes((current) => ({
        ...current,
        [frameId]: {
          nodeId: frameId,
          title: `${sourceNode.title || "分镜脚本"}制作区`,
          startedAt: Date.now(),
          progress: 0,
          status: "running",
        },
      }));
      let cleanupDelay = 650;
      try {
        await runCanvasFromStartNode(runInput);
        toast.success("制作区执行完成");
      } catch (err) {
        if (isCanvasRunCanceledError(err)) {
          cleanupDelay = 0;
        } else {
          cleanupDelay = 1400;
          const message = err instanceof Error ? err.message : "制作区执行失败";
          setRunningNodes((current) => ({
            ...current,
            [frameId]: {
              ...(current[frameId] || {
                nodeId: frameId,
                title: `${sourceNode.title || "分镜脚本"}制作区`,
                startedAt: Date.now(),
                progress: 0,
              }),
              status: "error",
            },
          }));
          toast.error(message);
        }
      } finally {
        const successfulNodeIds = new Set(
          (runInput.canvasRun?.node_results || [])
            .filter((result) => canvasRunNodeResultStatus(result) === "success")
            .map((result) => result.node_key)
            .filter(Boolean),
        );
        if (successfulNodeIds.size > 0) {
          updateActiveCanvas((canvas) =>
            markStoryboardRunResultsCurrent({
              canvas,
              sourceNodeId,
              successfulNodeIds,
              assetCate: activeCate,
              powers,
            }),
          );
          await persistCanvasRunSnapshot(runInput);
        }
        window.setTimeout(() => {
          setRunningNodes((current) => omitRunningNode(current, frameId));
        }, cleanupDelay);
        await recoverCanvasRunExecution(runInput);
      }
    },
    [
      activeCanvas,
      activeCate,
      clearNodeFeedbackRecords,
      createCanvasRunInput,
      persistCanvasRunSnapshot,
      powers,
      recoverCanvasRunExecution,
      space,
      updateActiveCanvas,
    ],
  );

  const runBackendSingleNode = useCallback<BackendNodeRunner>(
    async (node, options) => {
      if (!space || !activeCate) {
        return;
      }
      const currentCanvas =
        canvasStatesRef.current[String(activeCate.id)] || activeCanvas;
      const currentNode =
        currentCanvas.nodes.find((item) => item.id === node.id) || node;
      const targetNode = mergeBackendSingleNodeDraft({
        ...currentNode,
        composerDraft: {
          ...(currentNode.composerDraft || {}),
          ...(node.composerDraft || {}),
        },
      });
      const executionNodes = currentCanvas.nodes.map((item) =>
        item.id === targetNode.id ? targetNode : item,
      );
      const inputContext = buildNodeInputContext(
        node.id,
        executionNodes,
        currentCanvas.edges,
      );
      const runInput = createCanvasRunInput({
        assetCate: activeCate,
        startNode: targetNode,
        singleNode: true,
        canvas: currentCanvas,
        nodes: executionNodes,
        runInput: {
          _manual_input_context: inputContext || undefined,
          _agent_turn_input: options?.agentInput,
          manual_node_id: node.id,
        },
      });
      updateNodeResult(targetNode.id, { runError: "" });
      setRunningNodes((current) => ({
        ...current,
        [targetNode.id]: {
          ...(current[targetNode.id] || {}),
          nodeId: targetNode.id,
          title: targetNode.title,
          startedAt: current[targetNode.id]?.startedAt || Date.now(),
          progress: Math.max(current[targetNode.id]?.progress || 0, 8),
          status: "running",
          ...(options?.agentInput
            ? { agent: emptyCanvasAgentRuntime() }
            : {}),
        },
      }));
      try {
        await runCanvasFromStartNode(runInput);
        await persistCanvasRunSnapshot(runInput);
      } catch (err) {
        if (isCanvasRunCanceledError(err)) {
          updateNodeResult(targetNode.id, { runError: "" });
          setRunningNodes((current) =>
            omitRunningNode(current, targetNode.id),
          );
          return;
        }
        updateNodeResult(targetNode.id, {
          runError: err instanceof Error ? err.message : "节点运行失败",
        });
        setRunningNodes((current) => ({
          ...current,
          [targetNode.id]: {
            ...(current[targetNode.id] || {
              nodeId: targetNode.id,
              title: targetNode.title,
              startedAt: Date.now(),
            }),
            progress: 92,
            status: "error",
          },
        }));
        window.setTimeout(() => {
          setRunningNodes((current) => omitRunningNode(current, targetNode.id));
        }, 1400);
        throw err;
      } finally {
        await recoverCanvasRunExecution(runInput);
      }
    },
    [
      activeCate,
      activeCanvas,
      createCanvasRunInput,
      persistCanvasRunSnapshot,
      recoverCanvasRunExecution,
      setRunningNodes,
      space,
      updateNodeResult,
    ],
  );

  const runFunctionNodeAction = useCallback<FunctionNodeRunner>(
    async (node) => {
      if (!activeCate) {
        throw new Error("当前分类不存在");
      }
      return runCanvasFunctionNodeAction({
        node,
        projectId,
        assetCate: activeCate,
        inputContext: node.inputContext || null,
        onNodeResult: updateNodeResult,
        onAssetCreated: upsertSpaceAsset,
        onRunStartNode: runStartNode,
        onOpenImportPicker: openImportPickerByNodeId,
      });
    },
    [
      activeCate,
      openImportPickerByNodeId,
      projectId,
      runStartNode,
      updateNodeResult,
      upsertSpaceAsset,
    ],
  );

  useEffect(() => {
    if (!space) {
      return;
    }
    applyCanvasRunRecordsToCanvas(
      canvasRunRecords,
      activeCanvas,
      activeCateId,
      space,
    );
  }, [activeCanvas, activeCateId, canvasRunRecords, space]);

  async function switchCate(cateId: number) {
    if (loadingCateIdRef.current != null) {
      return false;
    }
    const key = String(cateId);
    let loadedNow = false;
    if (!Object.prototype.hasOwnProperty.call(canvasStatesRef.current, key)) {
      loadingCateIdRef.current = cateId;
      setLoadingCateId(cateId);
      try {
        const bundle = await fetchSpaceCanvas({
          projectId,
          assetCateId: cateId,
        });
        const hydratedCanvas = hydrateCanvasAssets(
          hydrateCanvasPowerCatalog(bundle.canvas, powers),
          bundle.assets,
        );
        setSpace((current) =>
          current
            ? {
                ...current,
                assets: mergeProjectAssets(current.assets, bundle.assets),
              }
            : current,
        );
        const nextCanvases = {
          ...canvasStatesRef.current,
          [key]: hydratedCanvas,
        };
        canvasStatesRef.current = nextCanvases;
        setCanvasStates(nextCanvases);
        loadedNow = true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "加载分类画布失败");
        return false;
      } finally {
        loadingCateIdRef.current = null;
        setLoadingCateId(null);
      }
    }
    activeCateIdRef.current = cateId;
    setActiveCateId(cateId);
    setSelectedNodeIds([]);
    setFocusNodeRequest(null);
    setNodeMenu(null);
    if (!space) {
      return true;
    }
    const nextCanvas =
      canvasStatesRef.current[String(cateId)] || emptyCanvasState(cateId);
    applyCanvasRunRecordsToCanvas(canvasRunRecords, nextCanvas, cateId, space);
    if (loadedNow) {
      void loadWorkspaceCanvasRuntimeExecutions(
        projectId,
        space,
        canvasStatesRef.current,
        "recovery",
        { assetCateId: cateId },
      );
    }
    return true;
  }

  function focusCanvasNode(nodeId: string) {
    setFocusNodeRequest((current) => ({
      nodeId,
      nonce: (current?.nonce || 0) + 1,
    }));
  }
  const consumeFocusNodeRequest = useCallback((request: NodeFocusRequest) => {
    setFocusNodeRequest((current) => {
      if (
        !current ||
        current.nodeId !== request.nodeId ||
        current.nonce !== request.nonce
      ) {
        return current;
      }
      return null;
    });
  }, []);

  async function loadWorkspaceCanvasRuntimeExecutions(
    nextProjectId: number,
    nextSpace: SpaceBootstrap,
    canvases: Record<string, SpaceCanvasState>,
    scope: "recovery" | "active",
    options: { assetCateId?: number; runIds?: number[] } = {},
  ) {
    if (canvasExecutionRefreshInFlightRef.current) {
      return;
    }
    canvasExecutionRefreshInFlightRef.current = true;
    try {
      const previousActiveRuns =
        scope === "active"
          ? canvasRunRecordsActiveLatestRuns(canvasRunRecordsRef.current)
          : [];
      const runIds = (options.runIds || []).filter((runId) => runId > 0);
      const requestedRunIds =
        runIds.length > 0
          ? runIds
          : scope === "active"
            ? previousActiveRuns.map((run) => Number(run.run_id || 0))
            : [];
      const loadRecoverySummary =
        scope === "recovery" && requestedRunIds.length === 0;
      let canvasExecutions = await fetchSpaceCanvasExecutions({
        projectId: nextProjectId,
        scope,
        assetCateId: options.assetCateId,
        runIds: requestedRunIds,
        summaryOnly: loadRecoverySummary,
      });
      let items = normalizeWorkspaceCanvasRuns(canvasExecutions.items);
      if (loadRecoverySummary) {
        const missingRunIds = canvasRecoveryDetailRunIds(items, canvases);
        if (missingRunIds.length === 0) {
          items = [];
        } else {
          canvasExecutions = await fetchSpaceCanvasExecutions({
            projectId: nextProjectId,
            scope,
            assetCateId: options.assetCateId,
            runIds: missingRunIds,
          });
          items = normalizeWorkspaceCanvasRuns(canvasExecutions.items);
        }
      }
      if (scope === "active" && previousActiveRuns.length > 0) {
        const returnedKeys = new Set(items.map(canvasRunIdentity));
        const missingRuns = previousActiveRuns.filter(
          (run) => !returnedKeys.has(canvasRunIdentity(run)),
        );
        if (missingRuns.length > 0) {
          const terminalRuns = await Promise.all(
            missingRuns.map(async (run) => {
              try {
                const detail = await fetchSpaceCanvasExecution({
                  projectId: nextProjectId,
                  executionId: Number(run.execution_id || 0),
                  runId: Number(run.run_id || 0),
                  requestId: String(run.request_id || ""),
                });
                return normalizeWorkspaceCanvasRun(detail);
              } catch {
                return null;
              }
            }),
          );
          items = mergeWorkspaceCanvasRunRecords(
            items,
            terminalRuns.filter((run): run is WorkspaceCanvasRunRef =>
              Boolean(run),
            ),
          );
        }
      }
      const nextRecords = mergeWorkspaceCanvasRunRecords(
        canvasRunRecordsRef.current,
        items,
      );
      canvasRunRecordsRef.current = nextRecords;
      setCanvasRunRecords(nextRecords);
      for (const [key, canvas] of Object.entries(canvases)) {
        const cateId = Number(canvas.assetCateId || key || 0);
        applyCanvasRunRecordsToCanvas(items, canvas, cateId, nextSpace);
      }
    } catch {
      // Active runs retain their previous state and retry on the next interval.
    } finally {
      canvasExecutionRefreshInFlightRef.current = false;
    }
  }

  async function loadWorkspaceCanvasHistory(
    nextProjectId: number,
    pageIndex = 0,
  ) {
    if (canvasHistoryRefreshInFlightRef.current) {
      return;
    }
    const beforeId = canvasHistoryBeforeIDsRef.current[pageIndex] || 0;
    canvasHistoryRefreshInFlightRef.current = true;
    setCanvasRunHistoryLoading(true);
    setCanvasRunHistoryError("");
    try {
      const canvasExecutions = await fetchSpaceCanvasExecutions({
        projectId: nextProjectId,
        scope: "history",
        beforeId,
        limit: 20,
      });
      setCanvasRunHistoryRecords(
        normalizeWorkspaceCanvasRuns(canvasExecutions.items),
      );
      setCanvasRunHistoryPage(pageIndex + 1);
      setCanvasRunHistoryHasMore(canvasExecutions.hasMore);
      const cursors = canvasHistoryBeforeIDsRef.current.slice(0, pageIndex + 1);
      if (canvasExecutions.hasMore && canvasExecutions.beforeId > 0) {
        cursors[pageIndex + 1] = canvasExecutions.beforeId;
      }
      canvasHistoryBeforeIDsRef.current = cursors;
    } catch (err) {
      setCanvasRunHistoryError(
        err instanceof Error ? err.message : "读取画布运行记录失败",
      );
    } finally {
      canvasHistoryRefreshInFlightRef.current = false;
      setCanvasRunHistoryLoading(false);
    }
  }

  const recoverableCanvasRunEntries = useMemo(
    () => canvasRunRecordsActiveLatest(canvasRunRecords),
    [canvasRunRecords],
  );
  const hasRecoverableCanvasRuns = recoverableCanvasRunEntries.length > 0;
  const hasCanvasRunsToStop =
    hasRecoverableCanvasRuns || hasRunningCanvasNode(runningNodes);

  async function stopCanvasRuns(requestedRuns?: CanvasRunRef[]) {
    const stopAll = !requestedRuns;
    if (
      (stopAll &&
        (stoppingAllCanvasRuns || stoppingCanvasRunKeys.size > 0)) ||
      (!stopAll &&
        requestedRuns?.some((run) =>
          stoppingCanvasRunKeys.has(canvasRunIdentity(run)),
        ))
    ) {
      return;
    }

    let targetKeys: string[] = [];
    if (stopAll) {
      setStoppingAllCanvasRuns(true);
    }
    try {
      let targets = requestedRuns || [];
      if (stopAll) {
        const activeExecutions = await fetchSpaceCanvasExecutions({
          projectId,
          scope: "active",
          limit: 50,
        });
        targets = uniqueActiveCanvasRuns([
          ...canvasRunRecordsRef.current,
          ...canvasRunHistoryRecords,
          ...normalizeWorkspaceCanvasRuns(activeExecutions.items),
        ]);
      }
      targets = uniqueActiveCanvasRuns(targets);
      if (targets.length === 0) {
        toast.info("当前没有运行中的任务");
        return;
      }

      targetKeys = targets.map(canvasRunIdentity);
      setStoppingCanvasRunKeys((current) => {
        const next = new Set(current);
        for (const key of targetKeys) {
          next.add(key);
        }
        return next;
      });

      const results = await Promise.allSettled(
        targets.map((run) =>
          stopSpaceCanvasRun({
            projectId,
            runId: Number(run.run_id || 0),
            requestId: String(run.request_id || ""),
          }),
        ),
      );
      const statusByRun = new Map<string, string>();
      const stoppedRuns: CanvasRunRef[] = [];
      let failedCount = 0;
      results.forEach((result, index) => {
        const run = targets[index];
        if (result.status === "rejected") {
          failedCount += 1;
          return;
        }
        const status = String(
          normalizeCanvasRunRef(result.value).status || "",
        );
        statusByRun.set(canvasRunIdentity(run), status);
        if (status === "canceled") {
          stoppedRuns.push(run);
        }
      });

      if (statusByRun.size > 0) {
        const updatedAt = new Date().toISOString();
        const updateStatuses = (runs: WorkspaceCanvasRunRef[]) =>
          runs.map((run) => {
            const status = statusByRun.get(canvasRunIdentity(run));
            return status ? { ...run, status, updated_at: updatedAt } : run;
          });
        const nextRecords = updateStatuses(canvasRunRecordsRef.current);
        canvasRunRecordsRef.current = nextRecords;
        setCanvasRunRecords(nextRecords);
        setCanvasRunHistoryRecords(updateStatuses);
      }

      if (stoppedRuns.length > 0) {
        const stoppedNodeIds = new Set(
          stoppedRuns.flatMap((run) => canvasRunNodeIds(run)),
        );
        setRunningNodes((current) => {
          if (stopAll && failedCount === 0) {
            return EMPTY_RUNNING_NODE_MAP;
          }
          let next = current;
          for (const nodeId of stoppedNodeIds) {
            if (!next[nodeId]) {
              continue;
            }
            if (next === current) {
              next = { ...current };
            }
            delete next[nodeId];
          }
          return next;
        });
        toast.success(
          stoppedRuns.length === 1
            ? "已停止运行"
            : `已停止 ${stoppedRuns.length} 个运行`,
        );
      } else if (failedCount === 0) {
        toast.info("任务已经结束，无需停止");
      }
      if (failedCount > 0) {
        toast.error(
          failedCount === targets.length
            ? "停止运行失败，请稍后重试"
            : `${failedCount} 个运行停止失败，请稍后重试`,
        );
      }

      if (canvasRunHistoryOpen) {
        void loadWorkspaceCanvasHistory(
          projectId,
          Math.max(0, canvasRunHistoryPage - 1),
        );
      }
      window.setTimeout(() => canvasExecutionPollRef.current?.(), 0);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "停止画布运行失败");
    } finally {
      if (targetKeys.length > 0) {
        setStoppingCanvasRunKeys((current) => {
          const next = new Set(current);
          for (const key of targetKeys) {
            next.delete(key);
          }
          return next;
        });
      }
      if (stopAll) {
        setStoppingAllCanvasRuns(false);
      }
    }
  }

  function requestStopAllCanvasRuns() {
    requestConfirm({
      title: "停止所有运行？",
      description:
        "停止后不会再提交后续任务。正在生成的内容会尝试取消，已经完成或已经计费的任务不会撤销。",
      confirmText: "停止全部",
      tone: "danger",
      onConfirm: () => stopCanvasRuns(),
    });
  }

  function requestStopCanvasRun(run: CanvasRunRef) {
    requestConfirm({
      title: "停止这次运行？",
      description:
        "停止后不会再提交这次运行的后续任务，正在生成的内容会尝试取消。",
      confirmText: "停止运行",
      tone: "danger",
      onConfirm: () => stopCanvasRuns([run]),
    });
  }

  canvasExecutionPollRef.current = space
    ? () => {
        void loadWorkspaceCanvasRuntimeExecutions(
          projectId,
          space,
          canvasStatesRef.current,
          "active",
          { assetCateId: activeCateIdRef.current },
        );
      }
    : null;

  useEffect(() => {
    if (!space || !hasRecoverableCanvasRuns) {
      return;
    }
    const timer = window.setInterval(() => {
      canvasExecutionPollRef.current?.();
    }, canvasRunStatusPollIntervalMs);
    return () => window.clearInterval(timer);
  }, [hasRecoverableCanvasRuns, projectId, space]);

  useEffect(() => {
    const watchers = recoveredCanvasStreamWatchersRef.current;
    const cursors = recoveredCanvasStreamCursorsRef.current;
    const activeStreams: Array<{
      key: string;
      requestId: string;
      run: WorkspaceCanvasRunRef;
      managedNodeIds: ReadonlySet<string>;
    }> = [];
    if (space) {
      for (const entry of recoverableCanvasRunEntries) {
        const run = entry.run;
        const requestId = String(run.request_id || "").trim();
        if (!requestId) {
          continue;
        }
        activeStreams.push({
          key: `${projectId}:${requestId}`,
          requestId,
          run,
          managedNodeIds: entry.managedNodeIds,
        });
      }
    }

    const activeKeys = new Set(activeStreams.map((stream) => stream.key));
    for (const [key, watcher] of watchers) {
      if (activeKeys.has(key)) {
        continue;
      }
      watcher.controller.abort();
      watchers.delete(key);
      cursors.delete(key);
    }

    for (const stream of activeStreams) {
      const existingWatcher = watchers.get(stream.key);
      if (existingWatcher) {
        existingWatcher.managedNodeIds = stream.managedNodeIds;
        for (const nodeId of canvasRunFinishedNodeIds(stream.run)) {
          existingWatcher.finishedNodeIds.add(nodeId);
        }
        continue;
      }
      const controller = new AbortController();
      const watcher: RecoveredCanvasStreamWatcher = {
        controller,
        managedNodeIds: stream.managedNodeIds,
        finishedNodeIds: canvasRunFinishedNodeIds(stream.run),
      };
      watchers.set(stream.key, watcher);
      void watchSpaceCanvasStream({
        projectId,
        requestId: stream.requestId,
        lastId: cursors.get(stream.key) || "0-0",
        signal: controller.signal,
        onFrame: (frame) => {
          if (controller.signal.aborted) {
            return;
          }
          if (frame.stream_id) {
            cursors.set(stream.key, frame.stream_id);
          }
          applyRecoveredCanvasStreamFrame(
            { setRunningNode: setRunningNodes, runningNodeBatcher },
            frame,
            watcher.managedNodeIds,
            watcher.finishedNodeIds,
          );
        },
      }).catch(() => {
        if (
          !controller.signal.aborted &&
          watchers.get(stream.key) === watcher
        ) {
          watchers.delete(stream.key);
        }
      });
    }
  }, [projectId, recoverableCanvasRunEntries, runningNodeBatcher, space]);

  useEffect(
    () => () => {
      for (const watcher of recoveredCanvasStreamWatchersRef.current.values()) {
        watcher.controller.abort();
      }
      recoveredCanvasStreamWatchersRef.current.clear();
      recoveredCanvasStreamCursorsRef.current.clear();
    },
    [],
  );

  function applyCanvasRunRecordsToCanvas(
    runs: WorkspaceCanvasRunRef[],
    canvas: SpaceCanvasState,
    cateId: number,
    targetSpace: SpaceBootstrap,
  ) {
    const relatedRuns = runs.filter(
      (run) =>
        canvasRunRecordMatchesCate(run, cateId) &&
        !canvasRunAlreadyAppliedToCanvas(run, canvas),
    );
    if (relatedRuns.length === 0) {
      return;
    }
    const appliedNodeKeys = new Set<string>();
    const claimedNodeKeys = new Set<string>();
    for (const run of relatedRuns) {
      const managedNodeKeys = new Set(
        canvasRunNodeIds(run).filter((nodeId) => {
          if (claimedNodeKeys.has(nodeId)) {
            return false;
          }
          claimedNodeKeys.add(nodeId);
          return true;
        }),
      );
      if (managedNodeKeys.size === 0) {
        continue;
      }
      const latestResults = (run.node_results || []).filter((result) => {
        const nodeKey = result.node_key;
        if (
          !nodeKey ||
          !managedNodeKeys.has(nodeKey) ||
          appliedNodeKeys.has(nodeKey)
        ) {
          return false;
        }
        appliedNodeKeys.add(nodeKey);
        return true;
      });
      applyCanvasRunRecord(
        run,
        canvas,
        targetSpace,
        latestResults,
        managedNodeKeys,
      );
    }
  }

  function applyCanvasRunRecord(
    run: WorkspaceCanvasRunRef,
    canvas: SpaceCanvasState,
    targetSpace: SpaceBootstrap,
    results: CanvasNodeResultRef[] = run.node_results || [],
    managedNodeIds?: ReadonlySet<string>,
  ) {
    const startNode = canvasRunRecordStartNode(run, canvas.nodes);
    if (!startNode) {
      return;
    }
    const runCate = assetCateById(targetSpace, canvas.assetCateId);
    if (!runCate) {
      return;
    }
    const input: CanvasStartRunInput = {
      projectId,
      assetCate: runCate,
      space: targetSpace,
      startNode,
      nodes: canvas.nodes,
      edges: canvas.edges,
      viewport: canvas.viewport,
      onNodeResult: (nodeId, patch) =>
        updateCanvasNodeResult(canvas.assetCateId, nodeId, patch),
      onAssetCreated: upsertSpaceAsset,
      setRunningNode: setRunningNodes,
      requestFlowFeedback: requestStartFlowFeedback,
      requestNodeTitle: (node, result) =>
        requestGeneratedNodeTitle(canvas.assetCateId, node, result),
      canvasRun: run,
    };
    const newResults = results.filter((result) => {
      const key = canvasRunRecordResultApplyKey(run, result);
      if (!key || appliedCanvasRunsRef.current.has(key)) {
        return false;
      }
      appliedCanvasRunsRef.current.add(key);
      return true;
    });
    applyBackendCanvasRunResults(input, newResults);
    markBackendCanvasNodeResultsDone(input, newResults);
    markRecoveredStoryboardRunResultsCurrent(input, run, startNode);
    syncBackendCanvasRunRuntime(input, run, managedNodeIds);
    finishBackendCanvasRunningNodes(input, run, managedNodeIds);
  }

  function markRecoveredStoryboardRunResultsCurrent(
    input: CanvasStartRunInput,
    run: WorkspaceCanvasRunRef,
    startNode: SpaceCanvasNode,
  ) {
    if (
      run.single_node ||
      String(run.status || "")
        .trim()
        .toLowerCase() !== "success" ||
      !parseStoryboardOutput(startNode.resultOutput)
    ) {
      return;
    }
    const successfulNodeIds = new Set(
      (run.node_results || [])
        .filter((result) => canvasRunNodeResultStatus(result) === "success")
        .map((result) => result.node_key)
        .filter(Boolean),
    );
    updateCanvasState(input.assetCate.id, (canvas) =>
      markStoryboardRunResultsCurrent({
        canvas,
        sourceNodeId: startNode.id,
        successfulNodeIds,
        assetCate: input.assetCate,
        powers,
      }),
    );
  }

  function addConfiguredNode(
    type: SpaceCanvasNode["type"],
    position?: CanvasPoint,
    options?: {
      asset?: ProjectAsset;
      flow?: TeamFlow;
      functionOption?: CanvasFunctionOption;
      power?: PowerOption;
      role?: TeamRole;
      connectToNodeId?: string;
      connectFromNodeId?: string;
      selectCreated?: boolean;
      replaceSingleAssetNode?: boolean;
    },
  ): SpaceCanvasNode | null {
    if (!activeCate) {
      return null;
    }
    const node = createLocalNode(
      type,
      activeCate,
      activeCanvas.nodes.length,
      position,
      options,
    );
    const nodeAssetCate = space
      ? assetCateById(space, assetNodeCateId(node) || activeCate.id)
      : activeCate;
    if (type === "asset") {
      node.cardinality = nodeAssetCate.cardinality;
    }
    const replacementAssetCateId =
      type === "asset" && options?.replaceSingleAssetNode
        ? assetNodeCateId(node) || Number(nodeAssetCate.id || 0)
        : 0;
    const replacementTarget = replacementAssetCateId
      ? findReplaceableAssetNode(
          activeCanvas.nodes,
          activeCanvas.edges,
          replacementAssetCateId,
          options?.connectFromNodeId,
        )
      : null;
    const duplicateReplacementNodeIds = replacementTarget
      ? connectedAssetNodeIds(
          activeCanvas.nodes,
          activeCanvas.edges,
          replacementAssetCateId,
          options?.connectFromNodeId,
          replacementTarget.id,
        )
      : new Set<string>();
    const selectedCreatedNodeId = replacementTarget?.id || node.id;
    const connection = nodeMenu?.connection;
    updateActiveCanvas((canvas) => {
      let edges = canvas.edges;
      const currentReplacementTarget = replacementAssetCateId
        ? findReplaceableAssetNode(
            canvas.nodes,
            canvas.edges,
            replacementAssetCateId,
            options?.connectFromNodeId,
          )
        : null;
      if (currentReplacementTarget) {
        const duplicateNodeIds = connectedAssetNodeIds(
          canvas.nodes,
          canvas.edges,
          replacementAssetCateId,
          options?.connectFromNodeId,
          currentReplacementTarget.id,
        );
        edges = canvas.edges.filter(
          (edge) =>
            !duplicateNodeIds.has(edge.from) && !duplicateNodeIds.has(edge.to),
        );
        if (connection) {
          const endpoints = connectedNodeEdgeEndpoints(
            connection,
            currentReplacementTarget.id,
          );
          edges = appendCanvasEdge(edges, endpoints.source, endpoints.target);
        } else if (options?.connectFromNodeId) {
          edges = appendCanvasEdge(
            edges,
            options.connectFromNodeId || "",
            currentReplacementTarget.id,
          );
        } else if (options?.connectToNodeId) {
          edges = appendCanvasEdge(
            edges,
            currentReplacementTarget.id,
            options.connectToNodeId || "",
          );
        }
        const nextNodes = canvas.nodes
          .filter((item) => !duplicateNodeIds.has(item.id))
          .map((item) =>
            item.id === currentReplacementTarget.id
              ? replaceAssetNode(item, node)
              : item,
          );
        return {
          ...canvas,
          nodes: nextNodes,
          edges: reconcileCanvasGroupEdges(nextNodes, edges),
        };
      }
      if (connection) {
        const endpoints = connectedNodeEdgeEndpoints(connection, node.id);
        edges = appendCanvasEdge(edges, endpoints.source, endpoints.target);
      } else if (options?.connectFromNodeId) {
        edges = appendCanvasEdge(
          edges,
          options.connectFromNodeId || "",
          node.id,
        );
      } else if (options?.connectToNodeId) {
        edges = appendCanvasEdge(edges, node.id, options.connectToNodeId || "");
      }
      const nextNodes = withCanvasNodeGroupAtPosition(
        [...canvas.nodes, node],
        node.id,
        { x: node.x, y: node.y },
      );
      return {
        ...canvas,
        nodes: nextNodes,
        edges: reconcileCanvasGroupEdges(nextNodes, edges),
      };
    });
    if (replacementTarget) {
      const replacementNode = replaceAssetNode(replacementTarget, node);
      setNodeResultOverrides((current) => {
        const next = { ...current };
        for (const nodeId of duplicateReplacementNodeIds) {
          delete next[nodeId];
        }
        next[replacementTarget.id] = {
          ...(next[replacementTarget.id] || {}),
          ...assetNodeResultOverride(replacementNode),
        };
        return next;
      });
    }
    if (options?.selectCreated !== false) {
      setSelectedNodeIds([selectedCreatedNodeId]);
      focusCanvasNode(selectedCreatedNodeId);
    }
    setWorkMode("create");
    setNodeMenu(null);
    return replacementTarget ? replaceAssetNode(replacementTarget, node) : node;
  }

  function copyCanvasNode(node: SpaceCanvasNode, position?: CanvasPoint) {
    if (!activeCate) {
      return;
    }
    if (storyboardStructureLockedNodeIds(activeCanvas.nodes).has(node.id)) {
      toast.info("脚本托管节点不能复制，请在分镜脚本中修改结构");
      return;
    }
    const clone = cloneCanvasNode(
      node,
      activeCate.id,
      activeCanvas.nodes.length,
      position,
    );
    updateActiveCanvas((canvas) => {
      const nodes = withCanvasNodeGroupAtPosition(
        [...canvas.nodes, clone],
        clone.id,
        { x: clone.x, y: clone.y },
      );
      return {
        ...canvas,
        nodes,
        edges: reconcileCanvasGroupEdges(nodes, canvas.edges),
      };
    });
    setNodeResultOverrides((current) => {
      const patch = current[node.id];
      return patch ? { ...current, [clone.id]: patch } : current;
    });
    setSelectedNodeIds([clone.id]);
    focusCanvasNode(clone.id);
    setNodeMenu(null);
    toast.success("已复制节点");
  }

  function deleteCanvasNodes(
    targetNodes: SpaceCanvasNode[],
    options: DeleteCanvasNodeOptions = {},
  ) {
    const removedNodeIds = collectCanvasNodeRemovalIds(
      activeCanvas.nodes,
      targetNodes,
    );
    if (removedNodeIds.size === 0) {
      return;
    }
    const managedNodeIds = storyboardStructureLockedNodeIds(activeCanvas.nodes);
    if (
      !options.allowStoryboardFrame &&
      [...removedNodeIds].some((nodeId) => managedNodeIds.has(nodeId))
    ) {
      toast.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区");
      return;
    }
    updateActiveCanvas((canvas) => {
      const nodes = canvas.nodes.filter((item) => !removedNodeIds.has(item.id));
      return {
        ...canvas,
        nodes,
        edges: reconcileCanvasGroupEdges(nodes, canvas.edges),
      };
    });
    setNodeResultOverrides((current) =>
      omitRecordKeys(current, removedNodeIds),
    );
    setRunningNodes((current) => omitRecordKeys(current, removedNodeIds));
    setSelectedNodeIds([]);
    setFocusNodeRequest((current) =>
      current && removedNodeIds.has(current.nodeId) ? null : current,
    );
    setNodeDetail((current) =>
      current && removedNodeIds.has(current.id) ? null : current,
    );
    setPendingImportNodeId((current) =>
      removedNodeIds.has(current) ? "" : current,
    );
    if (
      pendingImportNodeRef.current &&
      removedNodeIds.has(pendingImportNodeRef.current.id)
    ) {
      pendingImportNodeRef.current = null;
    }
    toast.success(
      targetNodes.length > 1 || removedNodeIds.size > 1
        ? `已删除 ${removedNodeIds.size} 个节点`
        : "已删除节点",
    );
  }

  function addAssetNode(asset: ProjectAsset, position?: CanvasPoint) {
    addConfiguredNode("asset", position, { asset });
  }

  function patchImportNodeResult(nodeId: string, asset: ProjectAsset) {
    if (!nodeId) {
      return;
    }
    const sourceNode =
      activeCanvas.nodes.find((node) => node.id === nodeId) ||
      (pendingImportNodeRef.current?.id === nodeId
        ? pendingImportNodeRef.current
        : null);
    if (!sourceNode) {
      return;
    }
    const output =
      firstDisplayOutput(asset.version?.content) ||
      extractDisplayOutput(asset.version?.content);
    updateNodeResult(
      nodeId,
      buildGeneratedNodeResultPatch(
        {
          ...sourceNode,
          kind: asset.kind || activeCate.kind,
          assetCateId: Number(asset.asset_cate_id || activeCate.id || 0),
        },
        {
          output,
          asset,
        },
        "导入资产",
      ),
    );
    void patchDirectDisplayNodes(nodeId, output);
  }

  async function patchDirectDisplayNodes(
    sourceNodeId: string,
    output: unknown,
  ) {
    if (!sourceNodeId) {
      return;
    }
    const directDisplayNodes = activeCanvas.edges
      .filter((edge) => edge.from === sourceNodeId)
      .map((edge) => activeCanvas.nodes.find((node) => node.id === edge.to))
      .filter(
        (node): node is SpaceCanvasNode =>
          Boolean(node) &&
          node.type === "function" &&
          node.functionOption?.key === "display",
      );
    if (directDisplayNodes.length === 0) {
      return;
    }
    for (const displayNode of directDisplayNodes) {
      updateNodeResult(
        displayNode.id,
        buildGeneratedNodeResultPatch(displayNode, { output }, "展示导入结果"),
      );
    }
  }

  function useImportedAsset(asset: ProjectAsset) {
    const importNodeId = pendingImportNodeId;
    if (!importNodeId) {
      addAssetNode(asset);
      return;
    }
    const sourceNode =
      activeCanvas.nodes.find((node) => node.id === importNodeId) ||
      (pendingImportNodeRef.current?.id === importNodeId
        ? pendingImportNodeRef.current
        : null);
    if (!sourceNode) {
      addAssetNode(asset);
      setPendingImportNodeId("");
      pendingImportNodeRef.current = null;
      return;
    }
    patchImportNodeResult(importNodeId, asset);
  }

  function closeImportPicker() {
    setImportPickerOpen(false);
    setPendingImportNodeId("");
    pendingImportNodeRef.current = null;
  }

  function openStoryboardGridImport(nodeId: string, frameIndex?: number) {
    void preloadAssetPickerDialog();
    setStoryboardGridImport({ nodeId, frameIndex });
    setNodeMenu(null);
    setWorkMode("create");
  }

  async function useStoryboardGridImportedAssets(assets: AssetRecord[]) {
    const request = storyboardGridImport;
    if (!request || storyboardGridImportSavingRef.current) {
      return;
    }
    const node = canvasModel.nodes.find((item) => item.id === request.nodeId);
    if (!node) {
      toast.error("宫格节点不存在");
      return;
    }
    const selectedImages = assets.filter(
      (asset) => asset.kind === "image" && asset.id > 0 && asset.versionID > 0,
    );
    const replacingSingleFrame = Number.isInteger(request.frameIndex);
    if (replacingSingleFrame && selectedImages.length === 0) {
      toast.error("请选择一张图片");
      return;
    }
    if (!replacingSingleFrame && selectedImages.length === 0) {
      toast.error("请至少选择一张图片");
      return;
    }
    if (
      !replacingSingleFrame &&
      selectedImages.length > STORYBOARD_GRID_MAX_IMAGES
    ) {
      toast.error(`一次最多导入 ${STORYBOARD_GRID_MAX_IMAGES} 张图片`);
      return;
    }

    const currentGrid = parseStoryboardGridOutput([
      node.asset?.version?.content,
      node.resultOutput,
    ]);
    const nextGrid = replacingSingleFrame
      ? storyboardGridWithImportedFrame(
          currentGrid,
          Number(request.frameIndex),
          selectedImages[0],
          node.title,
        )
      : storyboardGridDocumentFromAssets(
          selectedImages,
          currentGrid,
          node.title,
        );
    if (!nextGrid) {
      toast.error("当前宫格内容不可编辑");
      return;
    }

    storyboardGridImportSavingRef.current = true;
    try {
      const currentAssetID = Number(node.asset?.id || 0);
      const currentVersionID = Number(
        node.asset?.version?.id || node.asset?.version_id || 0,
      );
      const savedAsset =
        currentAssetID > 0 && currentVersionID > 0
          ? await saveSpaceAssetEditVersion({
              projectId,
              assetId: currentAssetID,
              versionId: currentVersionID,
              content: nextGrid,
            })
          : await saveSpaceCanvasMaterial({
              projectId,
              assetCateId: Number(node.assetCateId || activeCate?.id || 0),
              name: nextGrid.title || node.title || "宫格图片",
              kind: "collection",
              content: nextGrid,
              nodeKey: node.id,
              requestId: `storyboard-grid-import:${node.id}:${Date.now()}`,
            });
      const normalizedAsset = mergeProjectAssetVersionHistory(
        savedAsset,
        node.asset,
      );
      upsertSpaceAsset(normalizedAsset);
      updateNodeResult(
        node.id,
        buildAssetVersionNodePatch(node, normalizedAsset),
      );
      toast.success(replacingSingleFrame ? "宫格图片已替换" : "图片已导入宫格");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "导入宫格图片失败");
    } finally {
      storyboardGridImportSavingRef.current = false;
    }
  }

  function addPowerNode(power: PowerOption, position?: CanvasPoint) {
    addConfiguredNode("power", position, { power });
  }

  function openImportPicker(nodeId = "") {
    openImportPickerByNodeId(nodeId);
  }

  async function uploadImportAssets(files: File[]): Promise<AssetRecord[]> {
    const previews = await uploadSpaceFiles({
      projectID: projectId,
      teamID: Number(space?.project.team_id || 0),
      files,
    });
    const assets: AssetRecord[] = [];
    for (const preview of previews) {
      const asset = normalizeProjectAsset(preview.asset);
      if (asset.id) {
        upsertSpaceAsset(asset);
      }
      const record = normalizeAssetRecord(preview.asset);
      if (record.id) assets.push(record);
    }
    return assets;
  }

  function addAgentNode(role: TeamRole, position?: CanvasPoint) {
    addConfiguredNode("agent", position, { role });
  }

  function addFlowNode(flow: TeamFlow, position?: CanvasPoint) {
    addConfiguredNode("flow", position, { flow });
  }

  function addGroupNode(position?: CanvasPoint) {
    addConfiguredNode("group", position);
  }

  function addFunctionNode(
    functionOption: CanvasFunctionOption,
    position?: CanvasPoint,
  ) {
    const node = addConfiguredNode("function", position, { functionOption });
    if (functionOption.key === "import") {
      pendingImportNodeRef.current = node;
      openImportPicker(node?.id || "");
    }
  }

  function openNodeMenu(
    screen: CanvasPoint,
    position: CanvasPoint,
    connection?: PendingNodeConnection,
  ) {
    void preloadAddNodeMenu();
    setWorkMode("create");
    setNodeMenu({
      x: screen.x,
      y: screen.y,
      position,
      connection,
    });
    void loadPowerCatalog();
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  const handleSelectCanvasNodes = useStableCallback((nodeIds: string[]) => {
    setSelectedNodeIds(nodeIds);
    setNodeMenu(null);
  });
  const handleOpenCanvasNodeMenu = useStableCallback(openNodeMenu);
  const handleAddConfiguredNode = useStableCallback(addConfiguredNode);
  const handleCopyCanvasNode = useStableCallback(copyCanvasNode);
  const handleDeleteCanvasNodes = useStableCallback(deleteCanvasNodes);
  const handleCanvasNodesCommit = useStableCallback(
    (nodes: SpaceCanvasNode[]) =>
      updateActiveCanvas((canvas) => ({ ...canvas, nodes })),
  );
  const handleCanvasEdgesCommit = useStableCallback(
    (edges: SpaceCanvasEdge[]) =>
      updateActiveCanvas((canvas) => ({ ...canvas, edges })),
  );
  const handleCanvasViewportCommit = useStableCallback(
    (viewport: SpaceCanvasState["viewport"]) =>
      updateActiveCanvas((canvas) => {
        if (canvas.nodes.length === 0 && canvas.edges.length === 0) {
          return canvas;
        }
        return { ...canvas, viewport };
      }),
  );
  const handleOpenStoryboardGridImport = useStableCallback(
    openStoryboardGridImport,
  );

  if (loading) {
    if (initialLoadingRef.current) {
      return null;
    }
    return <CanvasStartupLoading />;
  }

  if (error || !space || !activeCate) {
    return (
      <main className={`ws-page is-${theme} ws-loading-screen`}>
        <div className="ws-loading-card ws-error-card">
          <span>{error || "创作空间不存在"}</span>
        </div>
      </main>
    );
  }

  return (
    <main className={`ws-page is-${theme} is-${workMode}-view`}>
      <CanvasWorkbench
        activeCate={activeCate}
        mode={workMode}
        interactive={workMode === "create"}
        nodes={canvasModel.nodes}
        edges={canvasModel.edges}
        viewport={activeCanvas.viewport}
        selectedNodeId={selectedNodeId}
        selectedNodeIds={selectedNodeIds}
        onSelectNodes={handleSelectCanvasNodes}
        onOpenNodeMenu={handleOpenCanvasNodeMenu}
        onAddConfiguredNode={handleAddConfiguredNode}
        onCopyNode={handleCopyCanvasNode}
        onDeleteNodes={handleDeleteCanvasNodes}
        onShowNodeDetail={showNodeDetail}
        onNodesCommit={handleCanvasNodesCommit}
        onEdgesCommit={handleCanvasEdgesCommit}
        onConnectedMediaEdgeRemove={removeConnectedMediaEdge}
        onViewportCommit={handleCanvasViewportCommit}
        focusNodeRequest={focusNodeRequest}
        onFocusNodeRequestConsumed={consumeFocusNodeRequest}
        projectId={projectId}
        space={space}
        canvasReferenceItems={canvasReferenceItems}
        catalogCache={catalogCache}
        runningNodes={runningNodes}
        setRunningNode={setRunningNodes}
        onNodeResult={updateNodeResult}
        onNodeDraftChange={updateNodeComposerDraft}
        onAssetCreated={upsertSpaceAsset}
        onRunStoryboardFrame={runStoryboardFrame}
        onRunFunctionNode={runFunctionNodeAction}
        onRunBackendNode={runBackendSingleNode}
        onOpenStoryboardGridImport={handleOpenStoryboardGridImport}
        onClearFeedbackRecords={clearNodeFeedbackRecords}
        requestConfirm={requestConfirm}
        onOpenFeedbackRecord={openNodeFeedbackRecord}
      />

      <TopCanvasToolbar
        space={space}
        cates={cates}
        activeCate={activeCate}
        saveStatus={canvasSaveStatus[String(activeCate.id)] || "saved"}
        hasAssetCates={hasAssetCates}
        loadingCateId={loadingCateId}
        onBack={() => navigate({ to: "/bot/work" })}
        onSelectCate={switchCate}
        onRefresh={loadSpace}
        onOpenRunHistory={() => {
          setCanvasRunHistoryOpen(true);
          void loadWorkspaceCanvasHistory(projectId, 0);
        }}
        onRunHistoryIntent={preloadCanvasRunHistoryDrawer}
        canStopRuns={hasCanvasRunsToStop}
        stoppingRuns={
          stoppingAllCanvasRuns || stoppingCanvasRunKeys.size > 0
        }
        onStopRuns={requestStopAllCanvasRuns}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {canvasRunHistoryOpen ? (
        <Suspense
          fallback={<CanvasModuleLoading label="正在加载运行历史" overlay />}
        >
          <CanvasRunHistoryDrawer
            open
            runs={canvasRunHistoryRecords}
            loading={canvasRunHistoryLoading}
            error={canvasRunHistoryError}
            page={canvasRunHistoryPage}
            hasNextPage={canvasRunHistoryHasMore}
            onOpenChange={setCanvasRunHistoryOpen}
            onRefresh={() => loadWorkspaceCanvasHistory(projectId, 0)}
            onPreviousPage={() =>
              loadWorkspaceCanvasHistory(
                projectId,
                Math.max(0, canvasRunHistoryPage - 2),
              )
            }
            onNextPage={() =>
              loadWorkspaceCanvasHistory(projectId, canvasRunHistoryPage)
            }
            stoppingRunKeys={stoppingCanvasRunKeys}
            onStopRun={requestStopCanvasRun}
            onLocateRun={(run) => {
              const nodeId = String(run.start_node_id || "");
              if (!nodeId) {
                return;
              }
              setCanvasRunHistoryOpen(false);
              void switchCate(Number(run.asset_cate_id || activeCateId)).then(
                (switched) => {
                  if (switched) {
                    window.requestAnimationFrame(() => focusCanvasNode(nodeId));
                  }
                },
              );
            }}
          />
        </Suspense>
      ) : null}

      <LeftCanvasDock
        mode={workMode}
        onModeIntent={(mode) => {
          if (mode === "result") {
            void preloadAssetBrowser();
          }
        }}
        onSelectMode={(mode) => {
          setWorkMode(mode);
          setNodeMenu(null);
        }}
      />

      {importPickerOpen ? (
        <Suspense
          fallback={<CanvasModuleLoading label="正在加载资产选择器" overlay />}
        >
          <AssetPickerDialog
            open
            teamID={space.project.team_id}
            scopeProjectID={space.project.id}
            title="导入资产"
            description="选择已有资产或上传本地文件，确认后加入当前画布。"
            initialFilters={{
              sourceType: "project",
              projectID: space.project.id,
            }}
            confirmSelection
            contentMode="full"
            validateAsset={(asset) =>
              asset.versionID > 0 ? "" : "该资产没有可用版本，无法导入。"
            }
            onUpload={uploadImportAssets}
            onClose={closeImportPicker}
            onConfirm={(assets) => {
              const asset = assets[0];
              if (asset) useImportedAsset(normalizeProjectAsset(asset));
            }}
          />
        </Suspense>
      ) : null}

      {storyboardGridImport ? (
        <Suspense
          fallback={<CanvasModuleLoading label="正在加载图片选择器" overlay />}
        >
          <AssetPickerDialog
            open
            teamID={space.project.team_id}
            scopeProjectID={space.project.id}
            title={
              Number.isInteger(storyboardGridImport.frameIndex)
                ? "替换宫格图片"
                : "导入宫格图片"
            }
            description={
              Number.isInteger(storyboardGridImport.frameIndex)
                ? "选择一张已有图片或上传本地图片。"
                : `选择 1-${storyboardGridImportLimit} 张已有图片，或上传本地图片。`
            }
            initialFilters={{
              sourceType: "project",
              projectID: space.project.id,
              kind: "image",
            }}
            allowedKinds={["image"]}
            multiple={!Number.isInteger(storyboardGridImport.frameIndex)}
            maxSelection={storyboardGridImportLimit}
            confirmSelection
            contentMode="full"
            uploadAccept="image/*"
            validateAsset={(asset) =>
              asset.kind !== "image"
                ? "请选择图片资产。"
                : asset.versionID > 0
                  ? ""
                  : "该图片没有可用版本，无法导入。"
            }
            onUpload={uploadImportAssets}
            onClose={() => setStoryboardGridImport(null)}
            onConfirm={(assets) => {
              void useStoryboardGridImportedAssets(assets);
            }}
          />
        </Suspense>
      ) : null}

      {workMode === "result" ? (
        <div className="ws-workspace-overlay ws-asset-workspace">
          <Suspense fallback={<CanvasModuleLoading label="正在加载资产" />}>
            <AssetBrowser
              teamID={space.project.team_id}
              scopeProjectID={space.project.id}
              onLocalUpload={uploadImportAssets}
              initialFilters={{
                sourceType: "project",
                projectID: space.project.id,
                assetCateID: hasAssetCates ? activeCate.id : 0,
              }}
              headerAction={
                <SpaceTooltip label="关闭资产">
                  <button type="button" onClick={() => setWorkMode("create")}>
                    <X aria-hidden="true" />
                    <span className="sr-only">关闭资产</span>
                  </button>
                </SpaceTooltip>
              }
            />
          </Suspense>
        </div>
      ) : null}

      {startFlowFeedbackPrompt ? (
        <FlowFeedbackDialog
          key={`${startFlowFeedbackPrompt.node.id}-${startFlowFeedbackPrompt.recordId}`}
          prompt={startFlowFeedbackPrompt.prompt}
          running={startFlowFeedbackSubmitting}
          readonly={isReadonlyFeedbackRecord(
            startFlowFeedbackPrompt,
            canvasModel.nodes,
            startFlowFeedbackRef.current,
          )}
          history={currentNodeFeedbackRecords(
            canvasModel.nodes.find(
              (node) => node.id === startFlowFeedbackPrompt.node.id,
            ) || startFlowFeedbackPrompt.node,
          )}
          activeRecordId={startFlowFeedbackPrompt.recordId}
          onSelectRecord={(record) => {
            const currentNode =
              canvasModel.nodes.find(
                (node) => node.id === startFlowFeedbackPrompt.node.id,
              ) || startFlowFeedbackPrompt.node;
            setStartFlowFeedbackPrompt({
              node: currentNode,
              recordId: record.id,
              prompt: {
                ...record.prompt,
                values: record.values || record.prompt.values || {},
              },
            });
          }}
          onClose={closeStartFlowFeedback}
          onSubmit={submitStartFlowFeedback}
        />
      ) : null}

      {confirmRequest ? (
        <CanvasConfirmDialog
          request={confirmRequest}
          onClose={() => setConfirmRequest(null)}
        />
      ) : null}

      {nodeMenu ? (
        <Suspense
          fallback={<CanvasModuleLoading label="正在加载节点菜单" overlay />}
        >
          <AddNodeMenu
            menu={nodeMenu}
            flows={activeFlows}
            powers={menuPowers}
            powerCategories={powerCategories}
            roles={menuRoles}
            onClose={() => setNodeMenu(null)}
            onSelectFlow={(flow) => addFlowNode(flow, nodeMenu.position)}
            onSelectFunction={(functionOption) =>
              addFunctionNode(functionOption, nodeMenu.position)
            }
            onSelectGroup={() => addGroupNode(nodeMenu.position)}
            onSelectRole={(role) => addAgentNode(role, nodeMenu.position)}
            onSelectPower={(power) => addPowerNode(power, nodeMenu.position)}
          />
        </Suspense>
      ) : null}

      {nodeDetail ? (
        <Suspense
          fallback={<CanvasModuleLoading label="正在加载节点详情" overlay />}
        >
          <NodeDetailDialog
            projectId={space.project.id}
            teamId={space.team.id}
            assetCateId={Number(
              nodeDetail.assetCateId ||
                nodeDetail.asset?.asset_cate_id ||
                activeCate?.id ||
                0,
            )}
            node={nodeDetail}
            storyboardFocus={storyboardDetailFocus}
            canvasNodes={canvasModel.nodes}
            connectedMediaReferences={canvasIncomingMediaConnections(
              canvasModel.nodes,
              canvasModel.edges,
              nodeDetail.id,
            )}
            canvasReferenceItems={canvasReferenceItems.filter(
              (item) => item.source !== "current" || item.id !== nodeDetail.id,
            )}
            onNodeDraftChange={(draft) => {
              if (!draft) {
                return;
              }
              updateNodeComposerDraft(nodeDetail.id, draft);
              setNodeDetail((current) =>
                current?.id === nodeDetail.id
                  ? { ...current, composerDraft: draft }
                  : current,
              );
            }}
            onConnectedMediaEdgeRemove={removeConnectedMediaEdge}
            onRunNode={runBackendSingleNode}
            onAssetUpdated={(asset) => {
              const normalizedAsset = mergeProjectAssetVersionHistory(
                asset,
                nodeDetail.asset,
              );
              upsertSpaceAsset(normalizedAsset);
              const nodePatch = buildAssetVersionNodePatch(
                nodeDetail,
                normalizedAsset,
              );
              if (!nodeDetail.id.startsWith("asset-detail-")) {
                updateNodeResult(nodeDetail.id, nodePatch);
              }
              setNodeDetail((current) =>
                current?.id === nodeDetail.id
                  ? {
                      ...current,
                      ...nodePatch,
                    }
                  : current,
              );
            }}
            onClose={() => {
              setNodeDetail(null);
              setStoryboardDetailFocus(undefined);
            }}
          />
        </Suspense>
      ) : null}
    </main>
  );
}

function TopCanvasToolbar({
  space,
  cates,
  activeCate,
  saveStatus,
  hasAssetCates,
  loadingCateId,
  onBack,
  onSelectCate,
  onRefresh,
  onOpenRunHistory,
  onRunHistoryIntent,
  canStopRuns,
  stoppingRuns,
  onStopRuns,
  theme,
  onToggleTheme,
}: {
  space: SpaceBootstrap;
  cates: AssetCate[];
  activeCate: AssetCate;
  saveStatus: CanvasSaveStatus;
  hasAssetCates: boolean;
  loadingCateId: number | null;
  onBack: () => void;
  onSelectCate: (cateId: number) => void | Promise<boolean>;
  onRefresh: () => void;
  onOpenRunHistory: () => void;
  onRunHistoryIntent: () => void;
  canStopRuns: boolean;
  stoppingRuns: boolean;
  onStopRuns: () => void;
  theme: WorkSpaceTheme;
  onToggleTheme: () => void;
}) {
  const activeIndex = Math.max(
    0,
    cates.findIndex((cate) => cate.id === activeCate.id),
  );
  return (
    <header className="ws-topbar">
      <div className="ws-project-head">
        <button
          type="button"
          className="ws-back-button"
          onClick={onBack}
          aria-label="返回工作台"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="ws-project-copy">
          <strong>{space.project.name}</strong>
          <span>
            {space.team.name || space.project.team?.name || "自由团队"}
          </span>
        </div>
      </div>

      {hasAssetCates ? (
        <nav
          className="ws-cate-strip"
          aria-label="资产类型"
          style={
            {
              "--ws-cate-total": cates.length,
              "--ws-cate-active": activeIndex,
            } as CSSProperties
          }
        >
          <span className="ws-cate-indicator" />
          {cates.map((cate) => (
            <button
              key={cate.id}
              type="button"
              className={`ws-cate ${cate.id === activeCate.id ? "is-active" : ""}`}
              disabled={loadingCateId != null}
              onClick={() => {
                void onSelectCate(cate.id);
              }}
            >
              {loadingCateId === cate.id ? (
                <Loader2 size={12} className="animate-spin" />
              ) : null}
              <span className="ws-cate-name">{cate.name}</span>
            </button>
          ))}
        </nav>
      ) : null}

      <div
        className={`ws-top-actions ${canStopRuns ? "has-running" : ""}`}
      >
        <CanvasSaveIndicator status={saveStatus} />
        {canStopRuns ? (
          <SpaceTooltip label="停止画布中所有运行中的任务">
            <button
              type="button"
              className="ws-action ws-stop-action"
              disabled={stoppingRuns}
              onClick={onStopRuns}
            >
              {stoppingRuns ? (
                <Loader2 size={15} className="ws-spin" />
              ) : (
                <Square size={13} fill="currentColor" />
              )}
              {stoppingRuns ? "停止中" : "停止全部"}
            </button>
          </SpaceTooltip>
        ) : null}
        <SpaceTooltip label="查看画布运行记录">
          <button
            type="button"
            className="ws-action"
            onPointerEnter={onRunHistoryIntent}
            onFocus={onRunHistoryIntent}
            onClick={onOpenRunHistory}
          >
            <History size={15} />
            运行记录
          </button>
        </SpaceTooltip>
        <button type="button" className="ws-action" onClick={onToggleTheme}>
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          {theme === "dark" ? "亮色" : "暗色"}
        </button>
        <button type="button" className="ws-action" onClick={onRefresh}>
          <CheckCircle2 size={15} />
          刷新
        </button>
      </div>
    </header>
  );
}

function CanvasSaveIndicator({ status }: { status: CanvasSaveStatus }) {
  const label =
    status === "saving"
      ? "保存中"
      : status === "error"
        ? "保存失败，正在重试"
        : status === "dirty"
          ? "未保存"
          : "已保存";
  return (
    <SpaceTooltip label={label}>
      <span className={`ws-save-indicator is-${status}`}>
        {status === "saving" ? (
          <Loader2 size={14} className="ws-spin" />
        ) : (
          <Save size={14} />
        )}
        {label}
      </span>
    </SpaceTooltip>
  );
}

const dockModeOptions: Array<{
  key: WorkMode;
  label: string;
  icon: LucideIcon;
}> = [
  { key: "create", label: "创作", icon: PenTool },
  { key: "result", label: "资产", icon: FileSearch },
];

function LeftCanvasDock({
  mode,
  onModeIntent,
  onSelectMode,
}: {
  mode: WorkMode;
  onModeIntent: (mode: WorkMode) => void;
  onSelectMode: (mode: WorkMode) => void;
}) {
  return (
    <nav className="ws-dock" aria-label="画布视角">
      {dockModeOptions.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            type="button"
            className={`ws-dock-button ${item.key === mode ? "is-active" : ""}`}
            onPointerEnter={() => onModeIntent(item.key)}
            onFocus={() => onModeIntent(item.key)}
            onClick={() => onSelectMode(item.key)}
          >
            <Icon size={20} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

const CanvasWorkbench = memo(function CanvasWorkbench({
  activeCate,
  mode,
  interactive,
  nodes,
  edges,
  viewport,
  selectedNodeId,
  selectedNodeIds,
  onSelectNodes,
  onOpenNodeMenu,
  onAddConfiguredNode,
  onCopyNode,
  onDeleteNodes,
  onShowNodeDetail,
  onNodesCommit,
  onEdgesCommit,
  onConnectedMediaEdgeRemove,
  onViewportCommit,
  focusNodeRequest,
  onFocusNodeRequestConsumed,
  projectId,
  space,
  canvasReferenceItems,
  catalogCache,
  runningNodes,
  setRunningNode,
  onNodeResult,
  onNodeDraftChange,
  onAssetCreated,
  onRunStoryboardFrame,
  onRunFunctionNode,
  onRunBackendNode,
  onOpenStoryboardGridImport,
  onClearFeedbackRecords,
  requestConfirm,
  onOpenFeedbackRecord,
}: {
  activeCate: AssetCate;
  mode: WorkMode;
  interactive: boolean;
  nodes: SpaceCanvasNode[];
  edges: SpaceCanvasEdge[];
  viewport: SpaceCanvasState["viewport"];
  selectedNodeId: string;
  selectedNodeIds: string[];
  onSelectNodes: (ids: string[]) => void;
  onOpenNodeMenu: (
    screen: CanvasPoint,
    position: CanvasPoint,
    connection?: PendingNodeConnection,
  ) => void;
  onAddConfiguredNode?: AddConfiguredNodeHandler;
  onCopyNode: (node: SpaceCanvasNode, position?: CanvasPoint) => void;
  onDeleteNodes: (
    nodes: SpaceCanvasNode[],
    options?: DeleteCanvasNodeOptions,
  ) => void;
  onShowNodeDetail: (
    node: SpaceCanvasNode,
    focus?: StoryboardEditorFocus,
  ) => void;
  onNodesCommit: (nodes: SpaceCanvasNode[]) => void;
  onEdgesCommit: (edges: SpaceCanvasEdge[]) => void;
  onConnectedMediaEdgeRemove: (edgeId: string) => void;
  onViewportCommit: (viewport: SpaceCanvasState["viewport"]) => void;
  focusNodeRequest: NodeFocusRequest | null;
  onFocusNodeRequestConsumed: (request: NodeFocusRequest) => void;
  projectId: number;
  space: SpaceBootstrap;
  canvasReferenceItems: ComposerAssetItem[];
  catalogCache: SpaceCatalogCache;
  runningNodes: RunningNodeMap;
  setRunningNode: RunningNodeSetter;
  onNodeResult: NodeResultSetter;
  onNodeDraftChange: NodeDraftSetter;
  onAssetCreated: (asset: ProjectAsset) => void;
  onRunStoryboardFrame: StoryboardFrameRunner;
  onRunFunctionNode: FunctionNodeRunner;
  onOpenStoryboardGridImport: (nodeId: string, frameIndex?: number) => void;
  onClearFeedbackRecords: (nodeIds: string[]) => void;
  requestConfirm: ConfirmRequester;
  onRunBackendNode: BackendNodeRunner;
  onOpenFeedbackRecord: (
    node: SpaceCanvasNode,
    record: NodeFeedbackRecord,
  ) => void;
}) {
  const [flowInstance, setFlowInstance] = useState<FlowViewport | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState("");
  const [draggingNodeId, setDraggingNodeId] = useState("");
  const [resizingNodeId, setResizingNodeId] = useState("");
  const [proximityEdge, setProximityEdge] = useState<Edge | null>(null);
  const [nodeActionMenu, setNodeActionMenu] = useState<{
    nodeId: string;
    x: number;
    y: number;
  } | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState("");
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [collapsedStoryboardFrameIds, setCollapsedStoryboardFrameIds] =
    useState<Set<string>>(() => new Set());
  const [viewportZoom, setViewportZoom] = useState(1);
  const pendingViewportZoomRef = useRef(1);
  const appliedViewportZoomRef = useRef(1);
  const viewportZoomFrameRef = useRef<number | null>(null);
  const [selectionRect, setSelectionRect] =
    useState<CanvasSelectionRect | null>(null);
  const selectedNodeIdSet = useMemo(
    () => new Set(selectedNodeIds),
    [selectedNodeIds],
  );
  const canvasWrapRef = useRef<HTMLElement | null>(null);
  const flowNodeCache = useRef<Map<string, Node<WorkspaceNodeData>>>(
    new Map(),
  );
  const flowEdgeRenderCache = useRef<Map<string, FlowEdgeRenderCacheEntry>>(
    new Map(),
  );
  const storyboardFrameNodeCache = useRef<Map<string, Node>>(new Map());
  const pendingConnectionRef = useRef<PendingNodeConnection | null>(null);
  const connectionCompletedRef = useRef(false);
  const skipNextPaneClickRef = useRef(false);
  const skipNextNodeClickRef = useRef(false);
  const rightSelectionRef = useRef<CanvasRightSelectionGesture | null>(null);
  const suppressNextPaneContextMenuRef = useRef(false);
  const edgesRef = useRef(edges);
  edgesRef.current = edges;
  const flushViewportZoom = useCallback((zoom: number) => {
    const nextZoom = normalizeCanvasZoom(zoom);
    pendingViewportZoomRef.current = nextZoom;
    if (
      viewportZoomFrameRef.current != null &&
      typeof window !== "undefined"
    ) {
      window.cancelAnimationFrame(viewportZoomFrameRef.current);
    }
    viewportZoomFrameRef.current = null;
    appliedViewportZoomRef.current = nextZoom;
    applyCanvasOverlayZoom(canvasWrapRef.current, nextZoom);
    setViewportZoom((current) =>
      Math.abs(current - nextZoom) > 0.005 ? nextZoom : current,
    );
  }, []);
  const scheduleViewportZoom = useCallback((zoom: number) => {
    const nextZoom = normalizeCanvasZoom(zoom);
    pendingViewportZoomRef.current = nextZoom;
    if (Math.abs(appliedViewportZoomRef.current - nextZoom) <= 0.005) {
      return;
    }
    if (viewportZoomFrameRef.current != null) {
      return;
    }
    if (typeof window === "undefined") {
      appliedViewportZoomRef.current = nextZoom;
      setViewportZoom(nextZoom);
      return;
    }
    viewportZoomFrameRef.current = window.requestAnimationFrame(() => {
      viewportZoomFrameRef.current = null;
      const scheduledZoom = pendingViewportZoomRef.current;
      appliedViewportZoomRef.current = scheduledZoom;
      applyCanvasOverlayZoom(canvasWrapRef.current, scheduledZoom);
    });
  }, []);
  useEffect(
    () => () => {
      if (
        viewportZoomFrameRef.current != null &&
        typeof window !== "undefined"
      ) {
        window.cancelAnimationFrame(viewportZoomFrameRef.current);
      }
    },
    [],
  );
  const commitCanvasEdges = useCallback(
    (nextEdges: SpaceCanvasEdge[]) => {
      edgesRef.current = nextEdges;
      onEdgesCommit(nextEdges);
    },
    [onEdgesCommit],
  );
  const updateConnectedMediaUsages = useCallback(
    (assignments: CanvasMediaUsageAssignments) => {
      const assignmentEntries = Object.entries(assignments);
      if (assignmentEntries.length === 0) {
        return;
      }
      const assignmentsByID = new Map(assignmentEntries);
      let changed = false;
      const nextEdges = edgesRef.current.map((edge) => {
        if (!assignmentsByID.has(edge.id)) {
          return edge;
        }
        const mediaUsage = assignmentsByID.get(edge.id) || undefined;
        if ((edge.mediaUsage || undefined) === mediaUsage) {
          return edge;
        }
        changed = true;
        return { ...edge, mediaUsage };
      });
      if (changed) {
        commitCanvasEdges(nextEdges);
      }
    },
    [commitCanvasEdges],
  );
  const removeConnectedMediaEdge = useCallback(
    (edgeId: string) => {
      const nextEdges = edgesRef.current.filter((edge) => edge.id !== edgeId);
      if (nextEdges.length !== edgesRef.current.length) {
        edgesRef.current = nextEdges;
        setSelectedEdgeId((current) => (current === edgeId ? "" : current));
        onConnectedMediaEdgeRemove(edgeId);
      }
    },
    [onConnectedMediaEdgeRemove],
  );
  const resizeNode: CanvasNodeResizeHandler = (nodeId, bounds) => {
    setResizingNodeId("");
    if (!interactive) {
      return;
    }
    const nextNodes = withResizedCanvasNode(nodes, nodeId, bounds);
    if (nextNodes !== nodes) {
      onNodesCommit(nextNodes);
    }
  };
  const resizeResultView: CanvasResultViewChangeHandler = (
    nodeId,
    resultView,
  ) => {
    setResizingNodeId("");
    if (!interactive) {
      return;
    }
    const nextNodes = withResizedCanvasResultView(nodes, nodeId, resultView);
    if (nextNodes !== nodes) {
      onNodesCommit(nextNodes);
    }
  };
  const nodeActionsRef = useRef({
    onNodeResult,
    onNodeDraftChange,
    onAssetCreated,
    onRunFunctionNode,
    onOpenStoryboardGridImport,
    onClearFeedbackRecords,
    onOpenFeedbackRecord,
    onShowNodeDetail,
    requestConfirm,
    onRunBackendNode,
    onConnectedMediaUsagesChange: updateConnectedMediaUsages,
    onConnectedMediaEdgeRemove: removeConnectedMediaEdge,
    onNodeResizeStart: setResizingNodeId,
    onNodeResizeEnd: resizeNode,
    onResultViewResizeEnd: resizeResultView,
  });
  nodeActionsRef.current = {
    onNodeResult,
    onNodeDraftChange,
    onAssetCreated,
    onRunFunctionNode,
    onOpenStoryboardGridImport,
    onClearFeedbackRecords,
    onOpenFeedbackRecord,
    onShowNodeDetail,
    requestConfirm,
    onRunBackendNode,
    onConnectedMediaUsagesChange: updateConnectedMediaUsages,
    onConnectedMediaEdgeRemove: removeConnectedMediaEdge,
    onNodeResizeStart: setResizingNodeId,
    onNodeResizeEnd: resizeNode,
    onResultViewResizeEnd: resizeResultView,
  };
  const stableNodeActions = useMemo(
    () => ({
      onNodeResult: (nodeId: string, patch: Partial<SpaceCanvasNode>) =>
        nodeActionsRef.current.onNodeResult(nodeId, patch),
      onNodeDraftChange: (nodeId: string, draft: ComposerDraft) =>
        nodeActionsRef.current.onNodeDraftChange(nodeId, draft),
      onAssetCreated: (asset: ProjectAsset) =>
        nodeActionsRef.current.onAssetCreated(asset),
      onRunFunctionNode: (node: SpaceCanvasNode) =>
        nodeActionsRef.current.onRunFunctionNode(node),
      onOpenStoryboardGridImport: (nodeId: string, frameIndex?: number) =>
        nodeActionsRef.current.onOpenStoryboardGridImport(nodeId, frameIndex),
      onClearFeedbackRecords: (nodeIds: string[]) =>
        nodeActionsRef.current.onClearFeedbackRecords(nodeIds),
      onOpenFeedbackRecord: (
        node: SpaceCanvasNode,
        record: NodeFeedbackRecord,
      ) => nodeActionsRef.current.onOpenFeedbackRecord(node, record),
      onShowNodeDetail: (
        node: SpaceCanvasNode,
        focus?: StoryboardEditorFocus,
      ) => nodeActionsRef.current.onShowNodeDetail(node, focus),
      requestConfirm: (request: ConfirmRequest) =>
        nodeActionsRef.current.requestConfirm(request),
      onRunBackendNode: (
        node: SpaceCanvasNode,
        options?: BackendNodeRunOptions,
      ) => nodeActionsRef.current.onRunBackendNode(node, options),
      onConnectedMediaUsagesChange: (
        assignments: CanvasMediaUsageAssignments,
      ) => nodeActionsRef.current.onConnectedMediaUsagesChange(assignments),
      onConnectedMediaEdgeRemove: (edgeId: string) =>
        nodeActionsRef.current.onConnectedMediaEdgeRemove(edgeId),
      onNodeResizeStart: (nodeId: string) =>
        nodeActionsRef.current.onNodeResizeStart(nodeId),
      onNodeResizeEnd: (nodeId: string, bounds: CanvasNodeBounds) =>
        nodeActionsRef.current.onNodeResizeEnd(nodeId, bounds),
      onResultViewResizeEnd: (
        nodeId: string,
        resultView: CanvasResultViewState,
      ) => nodeActionsRef.current.onResultViewResizeEnd(nodeId, resultView),
    }),
    [],
  );
  const canvasRenderIndex = useMemo(
    () => buildCanvasRenderIndex(nodes, edges),
    [edges, nodes],
  );
  const storyboardFrameIndex = useMemo(
    () =>
      buildStoryboardFrameIndex(
        nodes,
        (node) => canvasRenderIndex.hasResultByNodeId.get(node.id) || false,
      ),
    [canvasRenderIndex.hasResultByNodeId, nodes],
  );
  const storyboardFrames = storyboardFrameIndex.frames;
  const storyboardFrameRunBlockedReasonById = useMemo(
    () =>
      new Map(
        storyboardFrames.map((frame) => [
          frame.id,
          storyboardFrameRunSummary(
            frame,
            nodes,
            (node) =>
              canvasRenderIndex.hasResultByNodeId.get(node.id) || false,
            canvasRenderIndex.nodeById,
          ).blockedReason,
        ]),
      ),
    [canvasRenderIndex.hasResultByNodeId, nodes, storyboardFrames],
  );
  const storyboardFrameById = useMemo(
    () => new Map(storyboardFrames.map((frame) => [frame.id, frame])),
    [storyboardFrames],
  );
  const structureLockedStoryboardNodeIds = storyboardFrameIndex.sourceNodeIds;
  const storyboardSourceIdByNodeId =
    storyboardFrameIndex.sourceNodeIdByNodeId;
  useEffect(() => {
    const activeFrameIds = new Set(storyboardFrames.map((frame) => frame.id));
    setCollapsedStoryboardFrameIds((current) => {
      const next = new Set(
        [...current].filter((frameId) => activeFrameIds.has(frameId)),
      );
      const unchanged =
        next.size === current.size &&
        [...next].every((frameId) => current.has(frameId));
      return unchanged ? current : next;
    });
  }, [storyboardFrames]);

  const hiddenStoryboardNodeIds = useMemo(() => {
    const hidden = new Set<string>();
    for (const frame of storyboardFrames) {
      if (!collapsedStoryboardFrameIds.has(frame.id)) {
        continue;
      }
      for (const nodeId of frame.memberNodeIds) {
        hidden.add(nodeId);
      }
    }
    return hidden;
  }, [collapsedStoryboardFrameIds, storyboardFrames]);

  const focusStoryboardFrame = useCallback(
    (frameId: string) => {
      const frame = storyboardFrameById.get(frameId);
      const canvasBounds = canvasWrapRef.current?.getBoundingClientRect();
      if (!frame || !flowInstance || !canvasBounds) {
        return;
      }
      const bounds = storyboardFrameDisplayBounds(
        frame,
        collapsedStoryboardFrameIds.has(frame.id),
      );
      const availableWidth = Math.max(1, canvasBounds.width - 144);
      const availableHeight = Math.max(1, canvasBounds.height - 144);
      const nextZoom = Math.max(
        0.35,
        Math.min(
          0.9,
          availableWidth / bounds.width,
          availableHeight / bounds.height,
        ),
      );
      flowInstance.setCenter?.(
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height / 2,
        { zoom: nextZoom, duration: 320 },
      );
      flushViewportZoom(nextZoom);
    },
    [
      collapsedStoryboardFrameIds,
      flowInstance,
      flushViewportZoom,
      storyboardFrameById,
    ],
  );

  const toggleStoryboardFrame = useCallback(
    (frameId: string) => {
      const frame = storyboardFrameById.get(frameId);
      if (!frame) {
        return;
      }
      const collapsing = !collapsedStoryboardFrameIds.has(frameId);
      setCollapsedStoryboardFrameIds((current) => {
        const next = new Set(current);
        if (next.has(frameId)) {
          next.delete(frameId);
        } else {
          next.add(frameId);
        }
        return next;
      });
      if (collapsing) {
        const memberNodeIds = new Set(frame.memberNodeIds);
        onSelectNodes(
          selectedNodeIds.filter((nodeId) => !memberNodeIds.has(nodeId)),
        );
        setHoveredNodeId("");
        setSelectedEdgeId("");
        setNodeActionMenu(null);
      }
    },
    [
      collapsedStoryboardFrameIds,
      onSelectNodes,
      selectedNodeIds,
      storyboardFrameById,
    ],
  );
  const storyboardFrameActionsRef = useRef({
    onRun: onRunStoryboardFrame,
    onFocus: focusStoryboardFrame,
    onToggle: toggleStoryboardFrame,
  });
  storyboardFrameActionsRef.current = {
    onRun: onRunStoryboardFrame,
    onFocus: focusStoryboardFrame,
    onToggle: toggleStoryboardFrame,
  };
  const canvasNodeIdSignature = useMemo(
    () => nodes.map((node) => node.id).join("\u0000"),
    [nodes],
  );
  const canvasNodeIds = useMemo(
    () =>
      new Set(
        canvasNodeIdSignature ? canvasNodeIdSignature.split("\u0000") : [],
      ),
    [canvasNodeIdSignature],
  );
  const fitKey = useMemo(
    () =>
      canvasNodeIdSignature
        ? `${activeCate.id}:${canvasNodeIdSignature}`
        : "",
    [activeCate.id, canvasNodeIdSignature],
  );
  const canvasHasRunningNode = useMemo(
    () => hasRunningCanvasNode(runningNodes),
    [runningNodes],
  );

  const derivedFlowNodes = useMemo<Node[]>(() => {
    const hasIndexedResult = (node: SpaceCanvasNode) =>
      canvasRenderIndex.hasResultByNodeId.get(node.id) || false;
    const activeIds = new Set<string>();
    const nextNodes = nodes
      .filter((node) => !hiddenStoryboardNodeIds.has(node.id))
      .map((node) => {
        activeIds.add(node.id);
        const position = { x: node.x, y: node.y };
        const selected = selectedNodeIdSet.has(node.id);
        const showNodeSettings =
          selected &&
          selectedNodeIds.length === 1 &&
          nodeUsesComposerSettings(node);
        const powerViewMode =
          node.type === "power"
            ? resolvePowerPresentation(node.power, node.kind, node.outputType)
                .viewMode
            : "";
        const needsNodeSettingsContext = showNodeSettings;
        const nodeSpace = needsNodeSettingsContext ? space : null;
        const nodeCanvasReferenceItems =
          needsNodeSettingsContext ||
          powerViewMode === "storyboard" ||
          powerViewMode === "video_compose"
            ? canvasReferenceItems
            : EMPTY_CANVAS_REFERENCE_ITEMS;
        const nodeConnectedMediaReferences =
          powerViewMode === "video_compose" ||
          showNodeSettings
            ? canvasRenderIndex.incomingMediaReferencesByNodeId.get(node.id) ||
              EMPTY_CANVAS_MEDIA_REFERENCES
            : EMPTY_CANVAS_MEDIA_REFERENCES;
        const structureLocked = structureLockedStoryboardNodeIds.has(node.id);
        const storyboardSourceNodeId =
          storyboardSourceIdByNodeId.get(node.id) || "";
        const storyboardSourceNode = storyboardSourceNodeId
          ? canvasRenderIndex.nodeById.get(storyboardSourceNodeId) || null
          : null;
        const storyboardFrameRunning = Boolean(
          storyboardSourceNodeId &&
          isActiveRunningNode(
            runningNodes[storyboardFrameId(storyboardSourceNodeId)],
          ),
        );
        const className = `ws-flow-node ws-flow-node-${node.type}`;

        const runningNode = runningNodes[node.id] || null;
        const groupMembers =
          node.type === "group"
            ? canvasRenderIndex.groupMembersById.get(node.id) ||
              EMPTY_CANVAS_NODES
            : EMPTY_CANVAS_NODES;
        const groupRuntime =
          node.type === "group"
            ? summarizeCanvasGroupRuntime({
                members: groupMembers,
                runningNodes,
                groupState: runningNode,
                hasResult: hasIndexedResult,
              })
            : null;
        const nodeCanvasHasRunning =
          node.type === "function" && node.functionOption?.key === "start"
            ? canvasHasRunningNode
            : false;
        const inputContext =
          canvasRenderIndex.inputContextByNodeId.get(node.id) || null;
        const runBlockedReason =
          canvasRenderIndex.runBlockedReasonByNodeId.get(node.id) || "";
        const cached = flowNodeCache.current.get(node.id);
        const cachedData = cached?.data;
        const canReuseData =
          cachedData?.sourceNode === node &&
          cachedData.projectId === projectId &&
          cachedData.space === nodeSpace &&
          cachedData.runningNode === runningNode &&
          sameCanvasNodes(cachedData.groupMembers || [], groupMembers) &&
          sameCanvasGroupRuntime(cachedData.groupRuntime, groupRuntime) &&
          cachedData.canvasHasRunningNode === nodeCanvasHasRunning &&
          cachedData.canvasReferenceItems === nodeCanvasReferenceItems &&
          cachedData.connectedMediaReferences ===
            nodeConnectedMediaReferences &&
          cachedData.interactive === interactive &&
          cachedData.structureLocked === structureLocked &&
          cachedData.storyboardSourceNode === storyboardSourceNode &&
          cachedData.storyboardFrameRunning === storyboardFrameRunning &&
          cachedData.runBlockedReason === runBlockedReason &&
          cachedData.showNodeSettings === showNodeSettings &&
          sameNodeInputContext(cachedData.inputContext, inputContext);
        const nodeData: WorkspaceNodeData =
          canReuseData && cachedData
            ? cachedData
            : {
              ...node,
              sourceNode: node,
              projectId,
              space: nodeSpace,
              catalogCache,
              runningNode,
              groupMembers,
              groupRuntime,
              canvasHasRunningNode: nodeCanvasHasRunning,
              canvasReferenceItems: nodeCanvasReferenceItems,
              connectedMediaReferences: nodeConnectedMediaReferences,
              interactive,
              structureLocked,
              storyboardSourceNode,
              storyboardFrameRunning,
              runBlockedReason,
              showNodeSettings,
              setRunningNode,
              ...stableNodeActions,
              inputContext,
            };

        const cachedStyle = cached?.style as CSSProperties | undefined;
        const nodeStyleSize = canvasNodeStyleSize(node);
        if (
          cached &&
          cached.position.x === position.x &&
          cached.position.y === position.y &&
          cached.data === nodeData &&
          cached.selected === selected &&
          cached.className === className &&
          cached.draggable === (interactive && !structureLocked) &&
          cached.deletable === !structureLocked &&
          cached.zIndex ===
            (node.type === "group" ? 0 : node.groupId ? 2 : 1) &&
          cachedStyle?.width === nodeStyleSize.width &&
          cachedStyle?.height === nodeStyleSize.height
        ) {
          return cached;
        }
        const nextNode: Node<WorkspaceNodeData> = {
          ...cached,
          id: node.id,
          type: "workSpace",
          position,
          data: nodeData,
          selected,
          className,
          draggable: interactive && !structureLocked,
          deletable: !structureLocked,
          zIndex: node.type === "group" ? 0 : node.groupId ? 2 : 1,
          style: {
            ...cached?.style,
            width: nodeStyleSize.width,
            height: nodeStyleSize.height,
          },
        };
        flowNodeCache.current.set(node.id, nextNode);
        return nextNode;
      });
    for (const cachedId of flowNodeCache.current.keys()) {
      if (!activeIds.has(cachedId)) {
        flowNodeCache.current.delete(cachedId);
      }
    }
    const activeFrameIds = new Set<string>();
    const frameNodes = storyboardFrames.map((frame): Node => {
      activeFrameIds.add(frame.id);
      const collapsed = collapsedStoryboardFrameIds.has(frame.id);
      const bounds = storyboardFrameDisplayBounds(frame, collapsed);
      const runBlockedReason =
        storyboardFrameRunBlockedReasonById.get(frame.id) || "";
      const frameRunning =
        isActiveRunningNode(runningNodes[frame.id]) ||
        frame.workNodeIds.some((nodeId) =>
          isActiveRunningNode(runningNodes[nodeId]),
        );
      const cached = storyboardFrameNodeCache.current.get(frame.id);
      const cachedData = cached?.data as StoryboardFrameNodeData | undefined;
      const canReuseData =
        cachedData?.title === frame.title &&
        cachedData.groupCount === frame.groupCount &&
        cachedData.workNodeCount === frame.workNodeCount &&
        cachedData.completedCount === frame.completedCount &&
        cachedData.running === frameRunning &&
        cachedData.runBlockedReason === runBlockedReason &&
        cachedData.collapsed === collapsed;
      const data: StoryboardFrameNodeData =
        canReuseData && cachedData
          ? cachedData
          : {
              type: "storyboardFrame",
              title: frame.title,
              groupCount: frame.groupCount,
              workNodeCount: frame.workNodeCount,
              completedCount: frame.completedCount,
              running: frameRunning,
              runBlockedReason,
              collapsed,
              onRun:
                cachedData?.onRun ||
                (() => {
                  void storyboardFrameActionsRef.current.onRun(
                    frame.sourceNodeId,
                  );
                }),
              onFocus:
                cachedData?.onFocus ||
                (() => storyboardFrameActionsRef.current.onFocus(frame.id)),
              onToggleCollapsed:
                cachedData?.onToggleCollapsed ||
                (() => storyboardFrameActionsRef.current.onToggle(frame.id)),
            };
      const selected = selectedNodeIdSet.has(frame.id);
      const cachedStyle = cached?.style as CSSProperties | undefined;
      if (
        cached &&
        cached.position.x === bounds.x &&
        cached.position.y === bounds.y &&
        cached.data === data &&
        cached.selected === selected &&
        cached.draggable === interactive &&
        cached.selectable === interactive &&
        cached.focusable === interactive &&
        cachedStyle?.width === bounds.width &&
        cachedStyle?.height === bounds.height
      ) {
        return cached;
      }
      const nextFrameNode: Node = {
        ...cached,
        id: frame.id,
        type: "storyboardFrame",
        position: { x: bounds.x, y: bounds.y },
        data,
        selected,
        className: "ws-flow-node ws-flow-node-storyboard-frame",
        zIndex: -1,
        draggable: interactive,
        selectable: interactive,
        connectable: false,
        deletable: false,
        focusable: interactive,
        dragHandle: ".ws-storyboard-frame-header",
        style: {
          ...cached?.style,
          width: bounds.width,
          height: bounds.height,
        },
      };
      storyboardFrameNodeCache.current.set(frame.id, nextFrameNode);
      return nextFrameNode;
    });
    for (const cachedId of storyboardFrameNodeCache.current.keys()) {
      if (!activeFrameIds.has(cachedId)) {
        storyboardFrameNodeCache.current.delete(cachedId);
      }
    }
    return [...frameNodes, ...nextNodes];
  }, [
    collapsedStoryboardFrameIds,
    canvasRenderIndex,
    hiddenStoryboardNodeIds,
    interactive,
    structureLockedStoryboardNodeIds,
    nodes,
    projectId,
    runningNodes,
    selectedNodeIds.length,
    selectedNodeIdSet,
    setRunningNode,
    space,
    catalogCache,
    canvasReferenceItems,
    canvasHasRunningNode,
    stableNodeActions,
    storyboardFrames,
    storyboardFrameRunBlockedReasonById,
    storyboardSourceIdByNodeId,
  ]);

  const { flowNodes, setFlowNodes } = useTransientFlowNodes(
    derivedFlowNodes,
    draggingNodeId || resizingNodeId,
  );

  const deleteEdge = useCallback(
    (edgeId: string) => {
      if (!interactive) {
        return;
      }
      setSelectedEdgeId("");
      onEdgesCommit(edges.filter((edge) => edge.id !== edgeId));
    },
    [edges, interactive, onEdgesCommit],
  );

  const requestDeleteEdge = useCallback(
    (edgeId: string) => {
      if (!interactive || !edges.some((edge) => edge.id === edgeId)) {
        return;
      }
      requestConfirm({
        title: "删除连线",
        description: "删除后，上下游节点将不再通过这条连线传递内容。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => deleteEdge(edgeId),
      });
    },
    [deleteEdge, edges, interactive, requestConfirm],
  );

  const requestDeleteNodes = useCallback(
    (targetNodes: SpaceCanvasNode[]) => {
      if (!interactive || targetNodes.length === 0) {
        return;
      }
      const removedNodeIds = collectCanvasNodeRemovalIds(nodes, targetNodes);
      if (removedNodeIds.size === 0) {
        return;
      }
      if (
        [...removedNodeIds].some((nodeId) =>
          structureLockedStoryboardNodeIds.has(nodeId),
        )
      ) {
        toast.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区");
        return;
      }
      const singleTarget = targetNodes.length === 1 ? targetNodes[0] : null;
      const includesGroup = targetNodes.some((node) => node.type === "group");
      requestConfirm({
        title: singleTarget
          ? `删除「${singleTarget.title}」`
          : `删除 ${removedNodeIds.size} 个节点`,
        description: includesGroup
          ? "会同时删除组内节点，并移除与这些节点相连的连线。"
          : singleTarget
            ? "会同时移除与该节点相连的连线。"
            : "会同时移除与这些节点相连的连线。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          setSelectedEdgeId("");
          onDeleteNodes(targetNodes);
        },
      });
    },
    [
      interactive,
      structureLockedStoryboardNodeIds,
      nodes,
      onDeleteNodes,
      requestConfirm,
    ],
  );

  const requestDeleteStoryboardFrames = useCallback(
    (
      targetFrames: StoryboardFrameScope[],
      additionalNodes: SpaceCanvasNode[] = [],
    ) => {
      if (!interactive || targetFrames.length === 0) {
        return;
      }
      const frameMemberIds = new Set(
        targetFrames.flatMap((frame) => frame.memberNodeIds),
      );
      const requestedNodeIds = new Set([
        ...frameMemberIds,
        ...additionalNodes.map((node) => node.id),
      ]);
      const targetNodes = nodes.filter((node) => requestedNodeIds.has(node.id));
      if (targetNodes.length === 0) {
        return;
      }
      const singleFrame =
        targetFrames.length === 1 &&
        additionalNodes.every((node) => frameMemberIds.has(node.id))
          ? targetFrames[0]
          : null;
      const groupCount = targetNodes.filter(
        (node) => node.type === "group",
      ).length;
      const nodeCount = targetNodes.length - groupCount;
      requestConfirm({
        title: singleFrame
          ? `删除「${singleFrame.title}」制作区`
          : `删除 ${targetNodes.length} 个节点`,
        description: singleFrame
          ? `将删除其中 ${groupCount} 个分组和 ${nodeCount} 个节点，并移除相关连线。已生成素材会归档保留。`
          : "会同时删除所选制作区内的节点、分组及相关连线；已生成素材会归档保留。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          setSelectedEdgeId("");
          onDeleteNodes(targetNodes, { allowStoryboardFrame: true });
        },
      });
    },
    [interactive, nodes, onDeleteNodes, requestConfirm],
  );

  const baseFlowEdges = useMemo<Edge[]>(
    () =>
      edges
        .filter(
          (edge) =>
            canvasNodeIds.has(edge.from) &&
            canvasNodeIds.has(edge.to) &&
            !hiddenStoryboardNodeIds.has(edge.from) &&
            !hiddenStoryboardNodeIds.has(edge.to),
        )
        .map((edge) => ({
          id: edge.id,
          source: edge.from,
          sourceHandle: "output-0",
          target: edge.to,
          targetHandle: "input-0",
          type: "animated",
          animated: false,
          data: {
            physicalFrom: edge.from,
            physicalTo: edge.to,
            logicalFrom: edge.logicalFrom,
            logicalTo: edge.logicalTo,
            purpose: canvasEdgePurpose(edge),
            executionMode: edge.executionMode,
            mediaUsage: edge.mediaUsage,
          },
        })),
    [canvasNodeIds, edges, hiddenStoryboardNodeIds],
  );

  const flowEdges = useMemo<Edge[]>(() => {
    const selectedPathEdges =
      canvasRenderIndex.highlightedPathEdgesByNodeId.get(selectedNodeId) ||
      EMPTY_CANVAS_EDGE_IDS;
    const hoveredPathEdges =
      canvasRenderIndex.highlightedPathEdgesByNodeId.get(hoveredNodeId) ||
      EMPTY_CANVAS_EDGE_IDS;
    const highlightedPathEdges = new Set<string>([
      ...selectedPathEdges,
      ...hoveredPathEdges,
    ]);
    const highlightedPathSourceNodeId =
      selectedPathEdges.size > 0
        ? selectedNodeId
        : hoveredPathEdges.size > 0
          ? hoveredNodeId
          : "";
    const activeEdgeIds = new Set<string>();
    const rendered = baseFlowEdges.map((edge) => {
      activeEdgeIds.add(edge.id);
      const decoration = flowEdgeDecoration(
        edge,
        canvasRenderIndex.nodeById,
        hoveredNodeId,
        selectedNodeId,
        selectedEdgeId,
        highlightedPathEdges,
        highlightedPathSourceNodeId,
      );
      const cached = flowEdgeRenderCache.current.get(edge.id);
      if (
        cached?.baseEdge === edge &&
        cached.highlighted === decoration.highlighted &&
        cached.selected === decoration.selected &&
        cached.highlightColor === decoration.highlightColor &&
        cached.onDeleteEdge === requestDeleteEdge
      ) {
        return cached.renderedEdge;
      }
      const renderedEdge = decorateFlowEdge(
        edge,
        decoration,
        requestDeleteEdge,
      );
      flowEdgeRenderCache.current.set(edge.id, {
        ...decoration,
        baseEdge: edge,
        renderedEdge,
        onDeleteEdge: requestDeleteEdge,
      });
      return renderedEdge;
    });
    for (const cachedEdgeId of flowEdgeRenderCache.current.keys()) {
      if (!activeEdgeIds.has(cachedEdgeId)) {
        flowEdgeRenderCache.current.delete(cachedEdgeId);
      }
    }
    return rendered;
  }, [
    baseFlowEdges,
    canvasRenderIndex,
    hoveredNodeId,
    requestDeleteEdge,
    selectedEdgeId,
    selectedNodeId,
  ]);

  const renderedEdges = useMemo(
    () => (proximityEdge ? [...flowEdges, proximityEdge] : flowEdges),
    [flowEdges, proximityEdge],
  );

  useEffect(() => {
    if (
      !flowInstance ||
      !fitKey ||
      focusNodeRequest ||
      viewport.zoom != null ||
      typeof window === "undefined"
    ) {
      return;
    }
    const timer = setTimeout(() => {
      flowInstance.fitView?.({ padding: 0.32, duration: 250, maxZoom: 0.72 });
    }, 150);
    return () => clearTimeout(timer);
  }, [fitKey, flowInstance, focusNodeRequest, viewport.zoom]);

  useEffect(() => {
    if (!flowInstance || !focusNodeRequest || typeof window === "undefined") {
      return;
    }
    const node = nodes.find((item) => item.id === focusNodeRequest.nodeId);
    if (!node) {
      onFocusNodeRequestConsumed(focusNodeRequest);
      return;
    }
    const collapsedFrame = storyboardFrames.find(
      (frame) =>
        collapsedStoryboardFrameIds.has(frame.id) &&
        frame.memberNodeIds.includes(node.id),
    );
    if (collapsedFrame) {
      setCollapsedStoryboardFrameIds((current) => {
        const next = new Set(current);
        next.delete(collapsedFrame.id);
        return next;
      });
      return;
    }
    const timer = window.setTimeout(() => {
      const position = { x: node.x, y: node.y };
      const nextZoom = node.type === "power" ? 1.02 : 0.96;
      flowInstance.setCenter?.(
        position.x + (node.width || 180) / 2,
        position.y + (node.height || 180) / 2,
        { zoom: nextZoom, duration: 320 },
      );
      flushViewportZoom(nextZoom);
      onFocusNodeRequestConsumed(focusNodeRequest);
    }, 80);
    return () => window.clearTimeout(timer);
  }, [
    collapsedStoryboardFrameIds,
    flowInstance,
    flushViewportZoom,
    focusNodeRequest,
    nodes,
    onFocusNodeRequestConsumed,
    storyboardFrames,
  ]);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (!interactive) {
        return;
      }
      setFlowNodes((current) => {
        const nextNodes = applyNodeChanges(changes, current);
        for (const node of nextNodes) {
          flowNodeCache.current.set(node.id, node);
        }
        return nextNodes;
      });

      const nextSelectedNodeIds = new Set(selectedNodeIds);
      let hasSelectionChange = false;
      for (const change of changes) {
        if (change.type !== "select") {
          continue;
        }
        hasSelectionChange = true;
        if (change.selected) {
          nextSelectedNodeIds.delete(change.id);
          nextSelectedNodeIds.add(change.id);
        } else {
          nextSelectedNodeIds.delete(change.id);
        }
      }
      if (hasSelectionChange) {
        onSelectNodes([...nextSelectedNodeIds]);
      }
    },
    [interactive, onSelectNodes, selectedNodeIds],
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (!interactive) {
        return;
      }
      let nextSelectedEdgeId = "";
      let hasSelectionChange = false;
      for (const change of changes) {
        if (change.type === "select") {
          hasSelectionChange = true;
          if (change.selected) {
            nextSelectedEdgeId = change.id;
          }
        }
      }
      if (hasSelectionChange) {
        setSelectedEdgeId(nextSelectedEdgeId);
      }
      const structuralChanges = changes.filter(
        (change) => change.type !== "select",
      );
      if (structuralChanges.length === 0) {
        return;
      }
      const nextEdges = applyEdgeChanges(structuralChanges, flowEdges);
      commitCanvasEdges(flowEdgesToCanvasEdges(nextEdges));
    },
    [commitCanvasEdges, flowEdges, interactive],
  );

  const appendConfiguredCanvasEdge = useCallback(
    async (sourceNodeId: string, targetNodeId: string) => {
      const currentEdges = edgesRef.current;
      if (
        currentEdges.some((edge) => {
          const endpoints = canvasEdgeNodeIDs(edge);
          return (
            endpoints.sourceNodeId === sourceNodeId &&
            endpoints.targetNodeId === targetNodeId
          );
        })
      ) {
        return;
      }
      const targetNode = nodes.find((node) => node.id === targetNodeId);
      const sourceNodes = canvasConnectionSourceNodes(nodes, sourceNodeId);
      const mediaSourceNodes = sourceNodes.filter(isCanvasMediaReferenceNode);
      let mediaUsage: string | undefined;
      let projectedTargetDraft: ComposerDraft | undefined;
      if (
        targetNode?.type === "power" &&
        targetNode.power &&
        mediaSourceNodes.length > 0
      ) {
        try {
          const targetId = Number(
            targetNode.composerDraft?.selectedTargetId || 0,
          );
          const releaseId = Number(
            space.release?.id || space.project.release_id || 0,
          );
          const form = await catalogCache.loadPowerForm(
            {
              projectId,
              releaseId,
              flowId: Number(targetNode.flow?.id || 0),
              powerId: Number(targetNode.power?.id || 0),
              powerKey: targetNode.power?.key || "",
              targetId,
            },
            () =>
              fetchSpacePowerForm({
                projectId,
                flowId: Number(targetNode.flow?.id || 0),
                powerId: Number(targetNode.power?.id || 0),
                powerKey: targetNode.power?.key || "",
                targetId,
              }),
          );
          const formParams = form.params || [];
          const targetDraft = readNodeComposerDraft(targetNode);
          const currentConnections = canvasIncomingMediaConnections(
            nodes,
            edgesRef.current,
            targetNodeId,
          );
          const savedValues = mergeSavedComposerParamValues(
            formParams,
            targetDraft,
          );
          const projectedMultiImagePlan = resolveCanvasMultiImagePlan({
            node: targetNode,
            content: targetDraft.promptContent,
            items: canvasReferenceItems,
            connections: currentConnections,
            params: formParams,
            values: savedValues,
            requestedMode: targetDraft.multiImageMode,
            additionalSources: mediaSourceNodes,
          });
          const projectedMultiImageMode = projectedMultiImagePlan.active
            ? projectedMultiImagePlan.mode
            : undefined;
          if (projectedMultiImagePlan.error) {
            toast.error(projectedMultiImagePlan.error);
            return;
          }
          const formValues = reconcileReferenceModeForMediaSources(
            formParams,
            savedValues,
            [
              ...currentConnections.map((connection) => connection.source),
              ...mediaSourceNodes,
            ],
            projectedMultiImageMode,
          );
          const options = mediaUsageOptions(
            filterActivePowerParams(formParams, formValues),
          );
          const assignment = nextMediaUsageForSources(
            currentConnections,
            options,
            mediaSourceNodes,
            targetDraft.promptContent,
            canvasReferenceItems,
            projectedMultiImageMode,
          );
          if (assignment.error) {
            toast.error(assignment.error);
            return;
          }
          mediaUsage = assignment.usage;
          if (projectedMultiImagePlan.active && projectedMultiImageMode) {
            const nextDraft = normalizeComposerDraft({
              ...targetDraft,
              paramValues: formValues,
              multiImageMode: projectedMultiImageMode,
            });
            if (
              composerDraftSyncSignature(nextDraft) !==
              composerDraftSyncSignature(targetDraft)
            ) {
              projectedTargetDraft = nextDraft;
            }
          }
        } catch (error) {
          toast.error(
            error instanceof Error
              ? `媒体用途加载失败，未建立连线：${error.message}`
              : "媒体用途加载失败，未建立连线",
          );
          return;
        }
      }
      if (targetNode && projectedTargetDraft) {
        onNodeDraftChange(targetNode.id, projectedTargetDraft);
      }
      commitCanvasEdges(
        reconcileCanvasGroupEdges(
          nodes,
          appendCanvasEdge(
            edgesRef.current,
            sourceNodeId,
            targetNodeId,
            mediaUsage,
          ),
        ),
      );
    },
    [
      canvasReferenceItems,
      catalogCache,
      commitCanvasEdges,
      nodes,
      onNodeDraftChange,
      projectId,
      space,
    ],
  );

  const handleConnect = useCallback<OnConnect>(
    (connection) => {
      if (!interactive) {
        return;
      }
      connectionCompletedRef.current = true;
      if (
        !connection.source ||
        !connection.target ||
        connection.source === connection.target
      ) {
        return;
      }
      void appendConfiguredCanvasEdge(
        connection.source || "",
        connection.target || "",
      );
    },
    [appendConfiguredCanvasEdge, interactive],
  );

  const handleConnectStart = useCallback(
    (_event: unknown, params: any) => {
      if (!interactive) {
        return;
      }
      const nodeId = String(params?.nodeId || "");
      if (nodeId) {
        skipNextNodeClickRef.current = true;
        onSelectNodes([]);
        setNodeActionMenu(null);
      }
      pendingConnectionRef.current = nodeId
        ? {
            nodeId,
            handleId: params?.handleId || null,
            handleType: params?.handleType || null,
          }
        : null;
      connectionCompletedRef.current = false;
      setSelectedEdgeId("");
    },
    [interactive, onSelectNodes],
  );

  const handleConnectEnd = useCallback(
    (event: any) => {
      if (!interactive) {
        pendingConnectionRef.current = null;
        connectionCompletedRef.current = false;
        return;
      }
      const pendingConnection = pendingConnectionRef.current;
      pendingConnectionRef.current = null;
      if (pendingConnection?.nodeId && typeof window !== "undefined") {
        window.setTimeout(() => {
          skipNextNodeClickRef.current = false;
        }, 0);
      }
      if (connectionCompletedRef.current) {
        connectionCompletedRef.current = false;
        return;
      }
      if (!pendingConnection?.nodeId) {
        return;
      }
      const screen = pointerFromConnectEndEvent(event);
      if (!screen) {
        return;
      }
      skipNextPaneClickRef.current = true;
      onOpenNodeMenu(
        screen,
        flowPositionFromScreen(flowInstance, screen),
        pendingConnection,
      );
    },
    [flowInstance, interactive, onOpenNodeMenu],
  );

  const handleEdgeClick = useCallback(
    (event: ReactMouseEvent | MouseEvent, edge: Edge) => {
      if (!interactive) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      setNodeActionMenu(null);
      onSelectNodes([]);
      setSelectedEdgeId(edge.id);
    },
    [interactive, onSelectNodes],
  );

  useEffect(() => {
    if (!selectedEdgeId || typeof window === "undefined") {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (!interactive || !isCanvasDeleteShortcut(event)) {
        return;
      }
      event.preventDefault();
      requestDeleteEdge(selectedEdgeId);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [interactive, requestDeleteEdge, selectedEdgeId]);

  useEffect(() => {
    if (
      selectedNodeIds.length === 0 ||
      selectedEdgeId ||
      typeof window === "undefined"
    ) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (!interactive || !isCanvasDeleteShortcut(event)) {
        return;
      }
      const selectedNodes = nodes.filter((node) =>
        selectedNodeIdSet.has(node.id),
      );
      const selectedFrames = selectedNodeIds
        .map((nodeId) => storyboardFrameById.get(nodeId))
        .filter((frame): frame is StoryboardFrameScope => Boolean(frame));
      if (selectedNodes.length === 0 && selectedFrames.length === 0) {
        return;
      }
      event.preventDefault();
      if (selectedFrames.length > 0) {
        requestDeleteStoryboardFrames(selectedFrames, selectedNodes);
        return;
      }
      requestDeleteNodes(selectedNodes);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    interactive,
    nodes,
    requestDeleteNodes,
    requestDeleteStoryboardFrames,
    selectedEdgeId,
    selectedNodeIds.length,
    selectedNodeIds,
    selectedNodeIdSet,
    storyboardFrameById,
  ]);

  const updateProximityEdge = useCallback((nextEdge: Edge | null) => {
    setProximityEdge((current: Edge | null) =>
      isSamePreviewEdge(current, nextEdge) ? current : nextEdge,
    );
  }, []);

  const checkValidConnection = useCallback(
    (connection: any) => {
      if (!interactive) {
        return false;
      }
      const sourceNode = nodes.find(
        (n: SpaceCanvasNode) => n.id === connection.source,
      );
      const targetNode = nodes.find(
        (n: SpaceCanvasNode) => n.id === connection.target,
      );
      return canConnectNodes(sourceNode, targetNode);
    },
    [interactive, nodes],
  );

  const handleNodeDrag = useCallback(
    (_event: ReactMouseEvent | MouseEvent, draggedNode: Node) => {
      if (!interactive) {
        return;
      }
      const storyboardFrame = storyboardFrameById.get(draggedNode.id);
      if (storyboardFrame) {
        const delta = storyboardFrameMoveDelta(
          storyboardFrame,
          draggedNode.position,
        );
        const memberNodeIds = new Set(storyboardFrame.memberNodeIds);
        setFlowNodes((current) =>
          current.map((flowNode) => {
            if (!memberNodeIds.has(flowNode.id)) {
              return flowNode;
            }
            const member = nodes.find((node) => node.id === flowNode.id);
            return member
              ? {
                  ...flowNode,
                  position: {
                    x: member.x + delta.x,
                    y: member.y + delta.y,
                  },
                }
              : flowNode;
          }),
        );
        updateProximityEdge(null);
        return;
      }
      if (structureLockedStoryboardNodeIds.has(draggedNode.id)) {
        updateProximityEdge(null);
        return;
      }
      const sourceNode = nodes.find((node) => node.id === draggedNode.id);
      if (!sourceNode) {
        updateProximityEdge(null);
        return;
      }
      if (sourceNode.type === "group") {
        const deltaX = draggedNode.position.x - sourceNode.x;
        const deltaY = draggedNode.position.y - sourceNode.y;
        setFlowNodes((current) =>
          current.map((flowNode) => {
            const member = nodes.find((node) => node.id === flowNode.id);
            if (member?.groupId !== sourceNode.id) {
              return flowNode;
            }
            return {
              ...flowNode,
              position: {
                x: member.x + deltaX,
                y: member.y + deltaY,
              },
            };
          }),
        );
        updateProximityEdge(null);
        return;
      }
      const hasConnections = flowEdges.some(
        (edge) =>
          edge.source === draggedNode.id || edge.target === draggedNode.id,
      );
      if (hasConnections) {
        updateProximityEdge(null);
        return;
      }
      const closest = findClosestConnectableNode(draggedNode, flowNodes, nodes);
      if (!closest) {
        updateProximityEdge(null);
        return;
      }
      const connection = resolveProximityConnection(
        sourceNode,
        closest.domainNode,
      );
      if (!connection) {
        updateProximityEdge(null);
        return;
      }
      updateProximityEdge(createProximityPreviewEdge(connection));
    },
    [
      flowEdges,
      flowNodes,
      interactive,
      structureLockedStoryboardNodeIds,
      nodes,
      setFlowNodes,
      storyboardFrameById,
      updateProximityEdge,
    ],
  );

  const handleNodeDragStop = useCallback(
    (_event: ReactMouseEvent | MouseEvent, draggedNode: Node) => {
      if (!interactive) {
        setDraggingNodeId("");
        updateProximityEdge(null);
        return;
      }
      const storyboardFrame = storyboardFrameById.get(draggedNode.id);
      if (storyboardFrame) {
        const movedNodes = moveStoryboardFrameNodes(
          nodes,
          storyboardFrame,
          draggedNode.position,
        );
        if (movedNodes !== nodes) {
          onNodesCommit(movedNodes);
        }
        setDraggingNodeId("");
        updateProximityEdge(null);
        return;
      }
      if (structureLockedStoryboardNodeIds.has(draggedNode.id)) {
        setDraggingNodeId("");
        updateProximityEdge(null);
        return;
      }
      const sourceNode = nodes.find((node) => node.id === draggedNode.id);
      let membershipChanged = false;
      if (sourceNode) {
        const movedNodes = withMovedCanvasNode(
          nodes,
          draggedNode.id,
          draggedNode.position,
        );
        const groupedNodes = withCanvasNodeGroupAtPosition(
          movedNodes,
          draggedNode.id,
          draggedNode.position,
        );
        membershipChanged =
          (sourceNode.groupId || "") !==
          (groupedNodes.find((node) => node.id === sourceNode.id)?.groupId ||
            "");
        if (groupedNodes !== nodes) {
          onNodesCommit(groupedNodes);
        }
        const groupedEdges = reconcileCanvasGroupEdges(groupedNodes, edges);
        if (!sameCanvasEdges(edges, groupedEdges)) {
          onEdgesCommit(groupedEdges);
        }
      }
      setDraggingNodeId("");
      if (membershipChanged) {
        updateProximityEdge(null);
        return;
      }
      if (!proximityEdge) {
        updateProximityEdge(null);
        return;
      }
      const exists = flowEdges.some(
        (edge) =>
          edge.source === proximityEdge.source &&
          edge.target === proximityEdge.target,
      );
      if (!exists) {
        void appendConfiguredCanvasEdge(
          proximityEdge.source,
          proximityEdge.target,
        );
      }
      updateProximityEdge(null);
    },
    [
      edges,
      appendConfiguredCanvasEdge,
      flowEdges,
      interactive,
      structureLockedStoryboardNodeIds,
      onNodesCommit,
      nodes,
      proximityEdge,
      storyboardFrameById,
      updateProximityEdge,
    ],
  );

  const handleCanvasPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (
        !interactive ||
        event.button !== 2 ||
        !isCanvasPaneTarget(event.target)
      ) {
        return;
      }
      rightSelectionRef.current = {
        pointerId: event.pointerId,
        start: { x: event.clientX, y: event.clientY },
        baseNodeIds: event.ctrlKey || event.metaKey ? [...selectedNodeIds] : [],
        moved: false,
      };
      suppressNextPaneContextMenuRef.current = false;
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture?.(event.pointerId);
    },
    [interactive, selectedNodeIds],
  );

  const handleCanvasPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const gesture = rightSelectionRef.current;
      if (
        !gesture ||
        gesture.pointerId !== event.pointerId ||
        !flowInstance ||
        !canvasWrapRef.current
      ) {
        return;
      }
      const deltaX = event.clientX - gesture.start.x;
      const deltaY = event.clientY - gesture.start.y;
      if (!gesture.moved && Math.hypot(deltaX, deltaY) < 5) {
        return;
      }
      gesture.moved = true;
      event.preventDefault();
      event.stopPropagation();
      const bounds = canvasWrapRef.current.getBoundingClientRect();
      setSelectionRect(
        selectionRectFromScreenPoints(
          gesture.start,
          {
            x: event.clientX,
            y: event.clientY,
          },
          bounds,
        ),
      );
      const hitNodeIds = canvasNodeIdsInsideSelection(
        nodes,
        flowPositionFromScreen(flowInstance, gesture.start),
        flowPositionFromScreen(flowInstance, {
          x: event.clientX,
          y: event.clientY,
        }),
      );
      onSelectNodes(mergeCanvasNodeSelection(gesture.baseNodeIds, hitNodeIds));
      setSelectedEdgeId("");
      setNodeActionMenu(null);
    },
    [flowInstance, nodes, onSelectNodes],
  );

  const finishCanvasPointerSelection = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const gesture = rightSelectionRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) {
        return;
      }
      rightSelectionRef.current = null;
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setSelectionRect(null);
      if (!gesture.moved) {
        return;
      }
      suppressNextPaneContextMenuRef.current = true;
      event.preventDefault();
      event.stopPropagation();
    },
    [],
  );

  const handlePaneClick = useCallback(
    (event: ReactMouseEvent | MouseEvent) => {
      if (!interactive) {
        return;
      }
      if (skipNextPaneClickRef.current) {
        skipNextPaneClickRef.current = false;
        return;
      }
      onSelectNodes([]);
      setSelectedEdgeId("");
      setNodeActionMenu(null);
      if (!("detail" in event) || event.detail !== 2) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const screen = { x: event.clientX, y: event.clientY };
      onOpenNodeMenu(screen, flowPositionFromScreen(flowInstance, screen));
    },
    [flowInstance, interactive, onOpenNodeMenu, onSelectNodes],
  );

  const handlePaneContextMenu = useCallback(
    (event: ReactMouseEvent | MouseEvent) => {
      if (!interactive) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (suppressNextPaneContextMenuRef.current) {
        suppressNextPaneContextMenuRef.current = false;
        return;
      }
      const screen = { x: event.clientX, y: event.clientY };
      onOpenNodeMenu(screen, flowPositionFromScreen(flowInstance, screen));
    },
    [flowInstance, interactive, onOpenNodeMenu],
  );

  const handleNodeContextMenu = useCallback(
    (event: ReactMouseEvent | MouseEvent, node: Node) => {
      if (!interactive) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (storyboardFrameById.has(node.id)) {
        setSelectedEdgeId("");
        if (!selectedNodeIdSet.has(node.id)) {
          onSelectNodes([node.id]);
        }
        setNodeActionMenu({
          nodeId: node.id,
          x: event.clientX,
          y: event.clientY,
        });
        return;
      }
      setSelectedEdgeId("");
      if (!selectedNodeIdSet.has(node.id)) {
        onSelectNodes([node.id]);
      }
      setNodeActionMenu({
        nodeId: node.id,
        x: event.clientX,
        y: event.clientY,
      });
    },
    [interactive, onSelectNodes, selectedNodeIdSet, storyboardFrameById],
  );

  const actionNode = nodeActionMenu
    ? nodes.find((node) => node.id === nodeActionMenu.nodeId) || null
    : null;
  const actionStoryboardFrame = nodeActionMenu
    ? storyboardFrameById.get(nodeActionMenu.nodeId) || null
    : null;
  const actionNodeStructureLocked = Boolean(
    actionNode && structureLockedStoryboardNodeIds.has(actionNode.id),
  );
  const actionStoryboardSourceNode = actionNode
    ? nodes.find(
        (node) => node.id === storyboardSourceNodeIdForNode(nodes, actionNode),
      ) || null
    : null;
  const actionNodePosition = actionNode
    ? { x: actionNode.x, y: actionNode.y }
    : undefined;

  function closeNodeActionMenu() {
    setNodeActionMenu(null);
  }

  function copyActionNode() {
    if (!interactive || !actionNode) {
      return;
    }
    if (actionNodeStructureLocked) {
      toast.info("脚本托管节点不能复制，请在分镜脚本中修改结构");
      closeNodeActionMenu();
      return;
    }
    onCopyNode(
      actionNode,
      actionNodePosition
        ? { x: actionNodePosition.x + 34, y: actionNodePosition.y + 34 }
        : undefined,
    );
    closeNodeActionMenu();
  }

  function deleteActionNode() {
    if (!interactive || (!actionNode && !actionStoryboardFrame)) {
      return;
    }
    if (actionStoryboardFrame) {
      const targetFrame = actionStoryboardFrame;
      closeNodeActionMenu();
      requestDeleteStoryboardFrames([targetFrame]);
      return;
    }
    if (!actionNode) {
      return;
    }
    if (actionNodeStructureLocked) {
      toast.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区");
      closeNodeActionMenu();
      return;
    }
    const targetNode = actionNode;
    closeNodeActionMenu();
    requestDeleteNodes([targetNode]);
  }

  function detailActionNode() {
    if (!actionNode) {
      return;
    }
    onShowNodeDetail(actionNode);
    closeNodeActionMenu();
  }

  function editStoryboardStructureActionNode() {
    if (!actionStoryboardSourceNode) {
      return;
    }
    onShowNodeDetail(
      actionStoryboardSourceNode,
      storyboardEditorFocusFromNode(actionNode),
    );
    closeNodeActionMenu();
  }

  function resetStoryboardPromptActionNode() {
    if (!actionNode) {
      return;
    }
    const restoredDraft = restoredStoryboardDerivedPrompt(actionNode, nodes);
    if (!restoredDraft) {
      closeNodeActionMenu();
      return;
    }
    onNodeDraftChange(actionNode.id, restoredDraft);
    toast.success("已恢复脚本生成的提示词");
    closeNodeActionMenu();
  }

  const onDragOver = useCallback(
    (event: DragEvent) => {
      if (!interactive) {
        return;
      }
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
    },
    [interactive],
  );

  const onDrop = useCallback(
    (event: DragEvent) => {
      if (!interactive) {
        return;
      }
      event.preventDefault();
      if (!flowInstance || !onAddConfiguredNode) return;

      const nodeType = event.dataTransfer.getData(
        "application/shemic-nodetype",
      ) as SpaceCanvasNode["type"];
      if (!nodeType) return;

      const detailRaw = event.dataTransfer.getData("application/shemic-detail");
      const detail = detailRaw ? JSON.parse(detailRaw) : undefined;

      const position = flowInstance.screenToFlowPosition
        ? flowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          })
        : flowPositionFromScreen(flowInstance, {
            x: event.clientX,
            y: event.clientY,
          });

      if (nodeType === "asset" && detail) {
        onAddConfiguredNode("asset", position, { asset: detail });
      } else if (nodeType === "power" && detail) {
        onAddConfiguredNode("power", position, { power: detail });
      } else if (nodeType === "agent" && detail) {
        onAddConfiguredNode("agent", position, { role: detail });
      } else if (nodeType === "flow" && detail) {
        onAddConfiguredNode("flow", position, { flow: detail });
      } else if (nodeType === "function" && detail) {
        onAddConfiguredNode("function", position, { functionOption: detail });
      } else {
        onAddConfiguredNode(nodeType, position);
      }
    },
    [flowInstance, interactive, onAddConfiguredNode],
  );

  const resetCanvasView = useCallback(() => {
    flowInstance?.fitView?.({ padding: 0.32, duration: 260, maxZoom: 0.9 });
  }, [flowInstance]);

  const zoomCanvasTo = useCallback(
    (zoom: number) => {
      const nextZoom = normalizeCanvasZoom(zoom);
      flushViewportZoom(nextZoom);
      flowInstance?.zoomTo?.(nextZoom, { duration: 120 });
    },
    [flowInstance, flushViewportZoom],
  );

  const zoomCanvasIn = useCallback(() => {
    const nextZoom = normalizeCanvasZoom(viewportZoom + 0.12);
    flushViewportZoom(nextZoom);
    flowInstance?.zoomIn?.({ duration: 140 });
  }, [flowInstance, flushViewportZoom, viewportZoom]);

  const zoomCanvasOut = useCallback(() => {
    const nextZoom = normalizeCanvasZoom(viewportZoom - 0.12);
    flushViewportZoom(nextZoom);
    flowInstance?.zoomOut?.({ duration: 140 });
  }, [flowInstance, flushViewportZoom, viewportZoom]);

  const handleNodeClick = useCallback<NodeMouseHandler>(() => {
    if (!interactive) {
      return;
    }
    if (skipNextNodeClickRef.current) {
      skipNextNodeClickRef.current = false;
      return;
    }
    setSelectedEdgeId("");
    setNodeActionMenu(null);
  }, [interactive]);

  const handleNodeDragStart = useCallback<NodeMouseHandler>(
    (_event, node) => {
      if (interactive) {
        setDraggingNodeId(node.id);
      }
    },
    [interactive],
  );

  const handleNodeMouseEnter = useCallback<NodeMouseHandler>(
    (_event, node) => {
      setHoveredNodeId(node.id);
      const sourceNode =
        node.type === "workSpace"
          ? (node as Node<WorkspaceNodeData>).data.sourceNode
          : null;
      if (sourceNode && nodeUsesComposerSettings(sourceNode)) {
        void preloadCanvasNodeSettings();
      }
    },
    [],
  );

  const handleNodeMouseLeave = useCallback<NodeMouseHandler>(() => {
    setHoveredNodeId("");
  }, []);

  const handleFlowInit = useCallback<OnInit>(
    (instance) => {
      const nextInstance = instance as FlowViewport;
      setFlowInstance(nextInstance);
      if (viewport.x != null && viewport.y != null && viewport.zoom != null) {
        nextInstance.setViewport?.({
          x: viewport.x,
          y: viewport.y,
          zoom: viewport.zoom,
        });
        flushViewportZoom(viewport.zoom);
      } else {
        flushViewportZoom(nextInstance.getZoom?.() || 1);
      }
    },
    [flushViewportZoom, viewport.x, viewport.y, viewport.zoom],
  );

  const handleViewportMove = useCallback<OnMove>(
    (_event, nextViewport) => {
      scheduleViewportZoom(nextViewport.zoom);
    },
    [scheduleViewportZoom],
  );

  const handleViewportMoveEnd = useCallback<OnMoveEnd>(
    (_event, nextViewport) => {
      flushViewportZoom(nextViewport.zoom);
      onViewportCommit({
        x: nextViewport.x,
        y: nextViewport.y,
        zoom: nextViewport.zoom,
      });
    },
    [flushViewportZoom, onViewportCommit],
  );

  const toggleMiniMap = useCallback(() => {
    setShowMiniMap((value) => !value);
  }, []);

  const toggleSnapToGrid = useCallback(() => {
    setSnapToGrid((value) => !value);
  }, []);

  const canvasWrapClassName = [
    "ws-canvas-wrap",
    draggingNodeId ? "is-dragging" : "",
    selectionRect ? "is-selecting" : "",
    resizingNodeId ? "is-resizing" : "",
    interactive ? "is-interactive" : "is-passive",
    mode === "result" ? "is-result-mode" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      ref={canvasWrapRef}
      className={canvasWrapClassName}
      style={canvasOverlayVariables(viewportZoom)}
      onPointerDownCapture={handleCanvasPointerDown}
      onPointerMoveCapture={handleCanvasPointerMove}
      onPointerUpCapture={finishCanvasPointerSelection}
      onPointerCancelCapture={finishCanvasPointerSelection}
    >
      <ReactFlow
        nodes={flowNodes}
        edges={renderedEdges}
        onlyRenderVisibleElements
        nodeTypes={flowNodeTypes}
        edgeTypes={flowEdgeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onConnectStart={handleConnectStart}
        onConnectEnd={handleConnectEnd}
        isValidConnection={checkValidConnection}
        connectionLineStyle={CANVAS_CONNECTION_LINE_STYLE}
        onEdgeClick={handleEdgeClick}
        onNodeClick={handleNodeClick}
        onNodeContextMenu={handleNodeContextMenu}
        onNodeDragStart={handleNodeDragStart}
        onNodeDrag={handleNodeDrag}
        onNodeDragStop={handleNodeDragStop}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        onInit={handleFlowInit}
        onMove={handleViewportMove}
        onMoveEnd={handleViewportMoveEnd}
        onPaneClick={handlePaneClick}
        onPaneContextMenu={handlePaneContextMenu}
        nodesDraggable={interactive}
        nodesConnectable={interactive}
        nodesFocusable={interactive}
        edgesFocusable={interactive}
        elementsSelectable={interactive}
        deleteKeyCode={null}
        multiSelectionKeyCode={CANVAS_MULTI_SELECTION_KEYS}
        panOnDrag={interactive}
        panOnScroll={false}
        zoomOnScroll={interactive}
        zoomOnPinch={interactive}
        snapToGrid={snapToGrid}
        snapGrid={CANVAS_SNAP_GRID}
        zoomOnDoubleClick={false}
        minZoom={0.35}
        maxZoom={1.45}
        defaultEdgeOptions={CANVAS_DEFAULT_EDGE_OPTIONS}
        fitView={viewport.zoom == null}
        fitViewOptions={CANVAS_FIT_VIEW_OPTIONS}
      >
        {interactive && showMiniMap && nodes.length > 0 ? (
          <MiniMap
            position="bottom-left"
            pannable
            zoomable
            nodeClassName={miniMapNodeClassName}
            nodeColor={miniMapFlowNodeColor}
          />
        ) : null}
      </ReactFlow>

      {selectionRect ? (
        <div
          className="ws-canvas-selection-marquee"
          style={selectionRect}
          aria-hidden="true"
        />
      ) : null}

      {interactive ? (
        <CanvasViewControls
          showMiniMap={showMiniMap}
          snapToGrid={snapToGrid}
          zoom={viewportZoom}
          onToggleMiniMap={toggleMiniMap}
          onToggleSnap={toggleSnapToGrid}
          onReset={resetCanvasView}
          onZoomIn={zoomCanvasIn}
          onZoomOut={zoomCanvasOut}
          onZoomChange={zoomCanvasTo}
        />
      ) : null}

      {interactive && nodes.length === 0 ? (
        <div className="ws-empty-note" role="note">
          <span className="ws-empty-action">
            <MousePointer2 size={16} />
            <strong>双击屏幕</strong>
          </span>
          <span className="ws-empty-copy">画布自由生成</span>
        </div>
      ) : null}

      {interactive &&
      nodeActionMenu &&
      (actionNode || actionStoryboardFrame) ? (
        <NodeActionMenu
          point={nodeActionMenu}
          canShowDetail={Boolean(
            actionNode && nodeHasResultContent(actionNode),
          )}
          canCopy={Boolean(actionNode && !actionNodeStructureLocked)}
          canDelete={Boolean(
            actionStoryboardFrame || !actionNodeStructureLocked,
          )}
          canEditStructure={Boolean(
            actionStoryboardSourceNode &&
            actionStoryboardSourceNode.id !== actionNode?.id,
          )}
          canResetStoryboardPrompt={Boolean(
            actionNode && isStoryboardDerivedPromptOverridden(actionNode),
          )}
          onClose={closeNodeActionMenu}
          onCopy={copyActionNode}
          onDelete={deleteActionNode}
          onDetail={detailActionNode}
          onEditStructure={editStoryboardStructureActionNode}
          onResetStoryboardPrompt={resetStoryboardPromptActionNode}
        />
      ) : null}
    </section>
  );
});

function CanvasConfirmDialog({
  request,
  onClose,
}: {
  request: ConfirmRequest;
  onClose: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  async function confirm() {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    const action = request.onConfirm;
    onClose();
    try {
      void Promise.resolve(action()).catch((err) => {
        toast.error(err instanceof Error ? err.message : "操作失败");
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "操作失败");
    }
  }
  return (
    <div
      className="ws-confirm-backdrop"
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
    >
      <section
        className="ws-confirm-card"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="ws-confirm-copy">
          <h3>{request.title}</h3>
          <p>{request.description}</p>
        </div>
        <div className="ws-confirm-actions">
          <button type="button" disabled={submitting} onClick={onClose}>
            取消
          </button>
          <button
            type="button"
            className={request.tone === "danger" ? "is-danger" : "is-primary"}
            disabled={submitting}
            onClick={() => void confirm()}
          >
            {submitting ? "处理中..." : request.confirmText || "确认"}
          </button>
        </div>
      </section>
    </div>
  );
}

type FlowViewport = {
  screenToFlowPosition?: (position: CanvasPoint) => CanvasPoint;
  project?: (position: CanvasPoint) => CanvasPoint;
  fitView?: (options?: {
    padding?: number;
    duration?: number;
    maxZoom?: number;
  }) => void;
  setViewport?: (
    viewport: { x: number; y: number; zoom: number },
    options?: { duration?: number },
  ) => void;
  setCenter?: (
    x: number,
    y: number,
    options?: { zoom?: number; duration?: number },
  ) => void;
  zoomIn?: (options?: { duration?: number }) => void;
  zoomOut?: (options?: { duration?: number }) => void;
  zoomTo?: (zoom: number, options?: { duration?: number }) => void;
  getZoom?: () => number;
};

function applyNodeResultOverrides(
  model: {
    nodes: SpaceCanvasNode[];
    edges: { id: string; from: string; to: string }[];
  },
  overrides: Record<string, Partial<SpaceCanvasNode>>,
) {
  if (Object.keys(overrides).length === 0) {
    return model;
  }
  return {
    ...model,
    nodes: model.nodes.map((node) => {
      const patch = overrides[node.id];
      return patch ? { ...node, ...patch } : node;
    }),
  };
}

function removeCommittedNodeOverrideFields(
  overrides: Record<string, Partial<SpaceCanvasNode>>,
  nodeId: string,
  patch: Partial<SpaceCanvasNode>,
) {
  const currentPatch = overrides[nodeId];
  if (!currentPatch) {
    return overrides;
  }
  const committedKeys = Object.keys(patch) as Array<keyof SpaceCanvasNode>;
  if (
    !committedKeys.some((key) =>
      Object.prototype.hasOwnProperty.call(currentPatch, key),
    )
  ) {
    return overrides;
  }
  const nextPatch = { ...currentPatch };
  for (const key of committedKeys) {
    delete nextPatch[key];
  }
  const next = { ...overrides };
  if (Object.keys(nextPatch).length === 0) {
    delete next[nodeId];
  } else {
    next[nodeId] = nextPatch;
  }
  return next;
}

function markStoryboardRunResultsCurrent({
  canvas,
  sourceNodeId,
  successfulNodeIds,
  assetCate,
  powers,
}: {
  canvas: SpaceCanvasState;
  sourceNodeId: string;
  successfulNodeIds: ReadonlySet<string>;
  assetCate: AssetCate;
  powers: PowerOption[];
}) {
  let current = canvas;
  const maxPasses = Math.max(2, successfulNodeIds.size + 1);
  for (let pass = 0; pass < maxPasses; pass += 1) {
    const marked = {
      ...current,
      nodes: markStoryboardFrameResultsCurrent(
        current.nodes,
        sourceNodeId,
        successfulNodeIds,
      ),
    };
    current = syncCanvasStoryboardDerivedGroups({
      canvas: marked,
      assetCate,
      powers,
    });
    const unsettled = current.nodes.some((node) => {
      const item = node.storyboardItem;
      if (
        !item ||
        item.sourceNodeId !== sourceNodeId ||
        !successfulNodeIds.has(node.id)
      ) {
        return false;
      }
      return Boolean(
        item.stale ||
        (item.sourceSignature &&
          item.resultSourceSignature !== item.sourceSignature),
      );
    });
    if (!unsettled) {
      break;
    }
  }
  return current;
}

function storyboardGridDocumentFromAssets(
  assets: AssetRecord[],
  currentGrid: StoryboardGridDocument | null,
  fallbackTitle: string,
  minimumFrameCount = assets.length,
): StoryboardGridDocument {
  const frameCount = Math.min(
    STORYBOARD_GRID_MAX_IMAGES,
    Math.max(2, assets.length, minimumFrameCount),
  );
  return {
    type: "storyboard_grid",
    version: Math.max(1, Number(currentGrid?.version || 1)),
    title: firstNonEmptyText(currentGrid?.title, fallbackTitle, "宫格图片"),
    summary: currentGrid?.summary || "",
    frames: Array.from({ length: frameCount }, (_, index) =>
      assets[index]
        ? storyboardGridFrameFromAsset(assets[index], index)
        : emptyStoryboardGridFrame(index),
    ),
  };
}

function storyboardGridWithImportedFrame(
  grid: StoryboardGridDocument | null,
  frameIndex: number,
  asset: AssetRecord,
  fallbackTitle: string,
): StoryboardGridDocument | null {
  if (
    frameIndex < 0 ||
    frameIndex >= STORYBOARD_GRID_MAX_IMAGES ||
    (grid?.frames.length || 0) > STORYBOARD_GRID_MAX_IMAGES
  ) {
    return null;
  }
  const current =
    grid ||
    storyboardGridDocumentFromAssets([], null, fallbackTitle, frameIndex + 1);
  const frameCount = Math.min(
    STORYBOARD_GRID_MAX_IMAGES,
    Math.max(2, current.frames.length, frameIndex + 1),
  );
  const imported = storyboardGridFrameFromAsset(asset, frameIndex);
  return {
    ...current,
    frames: Array.from(
      { length: frameCount },
      (_, index) => current.frames[index] || emptyStoryboardGridFrame(index),
    ).map((frame, index) =>
      index === frameIndex
        ? {
            ...frame,
            image: imported.image,
            status: "success",
            error: "",
            assetID: imported.assetID,
            assetVersionID: imported.assetVersionID,
          }
        : frame,
    ),
  };
}

function emptyStoryboardGridFrame(index: number): StoryboardGridFrame {
  const order = index + 1;
  return {
    id: `frame-${String(order).padStart(2, "0")}`,
    order,
    title: `画面 ${String(order).padStart(2, "0")}`,
    description: "",
    prompt: "",
    status: "pending",
    image: "",
    error: "",
    assetID: 0,
    assetVersionID: 0,
  };
}

function storyboardGridFrameFromAsset(
  asset: AssetRecord,
  index: number,
): StoryboardGridFrame {
  const order = index + 1;
  return {
    id: `frame-${String(order).padStart(2, "0")}`,
    order,
    title: asset.name || `画面 ${String(order).padStart(2, "0")}`,
    description: "",
    prompt: "",
    status: "success",
    image: contentOutputMediaURLs(asset.version?.content, "image")[0] || "",
    error: "",
    assetID: asset.id,
    assetVersionID: asset.versionID,
  };
}

function buildGeneratedNodeResultPatch(
  node: SpaceCanvasNode,
  result: any,
  fallbackPrompt: string,
): Partial<SpaceCanvasNode> {
  const rawOutput = firstDefined(
    result?.output,
    result?.asset?.version?.content,
    result?.version?.content,
    result?.result?.output,
    result?.result?.asset?.version?.content,
    result?.data?.output,
    result?.data?.content,
    result?.data?.result,
    result?.data,
  );
  const output =
    node.type === "agent" && rawOutput != null
      ? parseMaybeJSON(rawOutput)
      : firstDisplayOutput(rawOutput) || extractDisplayOutput(rawOutput);
  const storyboard =
    node.type === "power" &&
    resolvePowerPresentation(node.power, node.kind, node.outputType)
      .viewMode === "storyboard"
      ? parseStoryboardOutput([
          rawOutput,
          result?.asset?.version?.content,
          result?.version?.content,
          result?.result,
          output,
        ])
      : null;
  const storyboardGrid =
    node.type === "power" &&
    isStoryboardGridPowerType(node.power, node.kind, node.outputType)
      ? parseStoryboardGridOutput([
          rawOutput,
          result?.asset?.version?.content,
          result?.version?.content,
          result?.result,
          output,
        ])
      : null;
  const resultKind = firstNonEmptyText(
    String(result?.asset?.kind || ""),
    String(result?.kind || ""),
    nodePreviewKind(node, output),
  );
  const preview = generatedPreviewFromValue(output, resultKind);
  const outputText = displayTextFromOutput(output, "");
  const generatedTitle = firstNonEmptyText(
    storyboardGrid?.title,
    storyboard?.title,
  );
  const summary =
    storyboardGrid?.summary ||
    storyboard?.summary ||
    preview.text ||
    (!looksLikeURL(outputText) ? outputText : "") ||
    preview.imageUrl ||
    preview.videoUrl ||
    preview.audioUrl ||
    preview.fileUrl ||
    (fallbackPrompt ? `已按提示生成：${fallbackPrompt}` : "生成完成");

  return {
    ...(generatedTitle && node.titleMode === "auto"
      ? { title: generatedTitle }
      : {}),
    description: summary,
    resultRef: buildNodeResultRef(result),
    resultOutput: storyboardGrid || storyboard || output,
    asset: result?.asset || node.asset,
    kind: result?.asset?.kind || node.power?.kind || node.kind,
  };
}

function buildAssetVersionNodePatch(
  node: SpaceCanvasNode,
  asset: ProjectAsset,
): Partial<SpaceCanvasNode> {
  const content = asset.version?.content;
  const patch = buildGeneratedNodeResultPatch(
    node,
    {
      asset,
      output: content,
    },
    documentPreview(content),
  );
  return {
    ...patch,
    asset,
  };
}

function readNodeComposerDraft(node: SpaceCanvasNode): ComposerDraft {
  return readCanvasComposerDraft(node.composerDraft);
}

function mergeBackendSingleNodeDraft(node: SpaceCanvasNode): SpaceCanvasNode {
  const draft = readNodeComposerDraft(node);
  if (node.type !== "power" && node.type !== "agent") {
    return node;
  }
  return {
    ...node,
    composerDraft: {
      ...(node as any).composerDraft,
      prompt: draft.prompt,
      promptContent: draft.promptContent,
      paramValues: draft.paramValues,
      selectedTargetId: draft.selectedTargetId,
      multiImageMode: draft.multiImageMode,
    },
  };
}

function createStableNodeFeedbackRecord(
  node: SpaceCanvasNode,
  prompt: FlowFeedbackPrompt,
) {
  const record = createNodeFeedbackRecord(node, prompt);
  return {
    ...record,
    id: nodeFeedbackRecordStableId(node, prompt, record.id),
  };
}

function nodeFeedbackRecordStableId(
  node: SpaceCanvasNode,
  prompt: FlowFeedbackPrompt,
  fallbackId: string,
) {
  const approvalId = Number(prompt.approval?.id || 0);
  if (approvalId > 0) {
    return `${node.id}:${approvalId}`;
  }
  const interactionId = String(prompt.interaction?.interaction?.id || "");
  if (interactionId) {
    return `${node.id}:${interactionId}`;
  }
  const promptKey = safeJSONString({
    title: prompt.title,
    fields: (prompt.fields || []).map((field) => field.key),
    content: prompt.approval?.content,
  });
  return promptKey
    ? `${node.id}:feedback:${simpleStringHash(promptKey)}`
    : fallbackId;
}

function upsertNodeFeedbackRecord(
  records: NodeFeedbackRecord[],
  record: NodeFeedbackRecord,
) {
  const approvalId = Number(record.prompt?.approval?.id || 0);
  const index = records.findIndex(
    (current) =>
      current.id === record.id ||
      (approvalId > 0 &&
        Number(current.prompt?.approval?.id || 0) === approvalId),
  );
  if (index < 0) {
    return [...records, record];
  }
  return records.map((current, currentIndex) => {
    if (currentIndex !== index) {
      return current;
    }
    const submitted = current.status === "submitted";
    const values = current.values || current.prompt?.values || record.values;
    return {
      ...current,
      title: record.title,
      description: record.description,
      prompt: {
        ...record.prompt,
        values: values || record.prompt.values || {},
      },
      values: current.values,
      status: submitted ? current.status : record.status,
      submittedAt: current.submittedAt,
    };
  });
}

type CanvasStartRunInput = {
  projectId: number;
  assetCate: AssetCate;
  space: SpaceBootstrap;
  startNode: SpaceCanvasNode;
  singleNode?: boolean;
  executionScope?: "storyboard_frame";
  patchStartNodeResult?: boolean;
  nodes: SpaceCanvasNode[];
  edges: SpaceCanvasEdge[];
  viewport: SpaceCanvasState["viewport"];
  runInput?: Record<string, unknown>;
  onNodeResult: NodeResultSetter;
  onAssetCreated: (asset: ProjectAsset) => void;
  setRunningNode?: RunningNodeSetter;
  runningNodeBatcher?: RunningNodeBatcher;
  requestFlowFeedback?: FlowFeedbackRequester;
  requestNodeTitle?: (
    node: SpaceCanvasNode,
    result: CanvasNodeResultRef,
  ) => void;
  canvasRun?: CanvasRunRef | null;
};

const canvasRunStreamTimeoutMs = 60 * 60 * 1000;
const canvasRunStatusPollIntervalMs = 2000;
const canvasRunStatusPollFailureLimit = 3;

async function runCanvasFromStartNode(input: CanvasStartRunInput) {
  const requestId = createCanvasRunRequestId(input.startNode.id);
  const appliedNodeResults = new Set<string>();
  let hasAppliedNodeResult = false;
  let streamLastId = "0-0";
  let rawCanvasRun = await runSpaceCanvas({
    projectId: input.projectId,
    assetCateId: Number(input.assetCate.id || 0),
    startNodeId: input.startNode.id,
    requestId,
    singleNode: input.singleNode,
    executionScope: input.executionScope,
    canvas: {
      assetCateId: Number(input.assetCate.id || 0),
      nextNodeNo: nextCanvasNodeNo(input.nodes),
      nodes: input.nodes,
      edges: input.edges,
      viewport: input.viewport || {},
    },
    runInput: {
      ...(input.runInput || {}),
      start_node_id: input.startNode.id,
    },
  });
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const canvasRun = await waitForCanvasRun(
      input,
      rawCanvasRun,
      streamLastId,
      (results) => {
        const applied = applyBackendCanvasRunResults(
          input,
          results,
          appliedNodeResults,
        );
        markBackendCanvasNodeResultsDone(input, results);
        hasAppliedNodeResult = hasAppliedNodeResult || applied > 0;
      },
      () => hasAppliedNodeResult,
      (lastId) => {
        streamLastId = lastId;
      },
    );
    input.canvasRun = canvasRun;
    syncBackendCanvasRunRuntime(input, canvasRun);
    if (
      canvasRunCanReturnAppliedSingleNodeResult(
        input,
        canvasRun,
        hasAppliedNodeResult,
      ) &&
      (canvasRun.status === "running" || canvasRun.status === "pending")
    ) {
      toast.info("节点结果已返回，后台运行仍在收尾");
      return;
    }
    const executed = Number(canvasRun.executed || 0);
    if (!input.singleNode && input.patchStartNodeResult !== false) {
      input.onNodeResult(
        input.startNode.id,
        buildFunctionRunPatch(
          canvasRun,
          canvasRunSummaryText(canvasRun, executed),
        ),
      );
    }
    const terminalStatus = String(canvasRun.status || "").toLowerCase();
    if (terminalStatus !== "waiting") {
      finishBackendCanvasRunningNodes(input, canvasRun);
      if (terminalStatus === "fail" || terminalStatus === "error") {
        throw new Error(canvasRunErrorMessage(canvasRun));
      }
      if (terminalStatus === "canceled" || terminalStatus === "cancelled") {
        throw new Error("画布运行已取消");
      }
      return;
    }
    await resumeBackendCanvasRun(input, canvasRun);
    rawCanvasRun = {
      ...canvasRun,
      status: "running",
      pending_node: null,
    };
  }
  throw new Error("画布运行多次等待反馈，请稍后继续");
}

async function waitForCanvasRun(
  input: CanvasStartRunInput,
  rawCanvasRun: unknown,
  streamLastId: string,
  applyNodeResults: (results: CanvasNodeResultRef[]) => void,
  hasAppliedNodeResult: () => boolean,
  onStreamLastId: (lastId: string) => void,
): Promise<CanvasRunRef> {
  let canvasRun = normalizeSingleNodeCanvasRun(
    input,
    normalizeCanvasRunRef(rawCanvasRun),
  );
  canvasRun = normalizeCanvasRunTerminalStatus(input, canvasRun);
  applyNodeResults(canvasRun.node_results || []);
  syncBackendCanvasRunRuntime(input, canvasRun);
  if (canvasRun.status !== "running" && canvasRun.status !== "pending") {
    return canvasRun;
  }
  if (!canvasRun.run_id && !canvasRun.request_id) {
    return canvasRun;
  }
  const requestId = String(canvasRun.request_id || "");
  const controller = new AbortController();
  const waitDeadline = Date.now() + canvasRunStreamTimeoutMs;
  let streamTimedOut = false;
  let streamError: unknown = null;
  const streamTimer = window.setTimeout(() => {
    streamTimedOut = true;
    controller.abort();
  }, canvasRunStreamTimeoutMs);
  try {
    const streamedRun = await waitForCanvasRunStream(
      input,
      requestId,
      streamLastId,
      (frame) => {
        if (frame.stream_id) {
          onStreamLastId(frame.stream_id);
        }
        const nextRun = canvasRunFromStreamFrame(frame, input);
        if (!nextRun) {
          applyCanvasStreamNodeFrame(input, frame);
          return;
        }
        canvasRun = normalizeSingleNodeCanvasRun(
          input,
          mergeCanvasRunRef(canvasRun, nextRun),
        );
        applyNodeResults(canvasRun.node_results || []);
        syncBackendCanvasRunRuntime(input, canvasRun);
      },
      controller.signal,
    );
    if (streamedRun) {
      canvasRun = normalizeSingleNodeCanvasRun(
        input,
        mergeCanvasRunRef(canvasRun, streamedRun),
      );
      syncBackendCanvasRunRuntime(input, canvasRun);
    }
    applyNodeResults(canvasRun.node_results || []);
  } catch (error) {
    streamError = error;
  } finally {
    window.clearTimeout(streamTimer);
    controller.abort();
    input.runningNodeBatcher?.flush();
  }

  canvasRun = normalizeCanvasRunTerminalStatus(input, canvasRun);
  if (
    canvasRunNeedsStatusConvergence(input, canvasRun) &&
    !canvasRunCanReturnAppliedSingleNodeResult(
      input,
      canvasRun,
      hasAppliedNodeResult(),
    )
  ) {
    try {
      canvasRun = await waitForCanvasRunTerminalStatus(
        input,
        canvasRun,
        requestId,
        applyNodeResults,
        hasAppliedNodeResult,
        waitDeadline,
      );
    } catch (statusError) {
      if (streamError instanceof Error && !streamTimedOut) {
        throw streamError;
      }
      throw statusError;
    }
  }
  if (
    !canvasRunNeedsStatusConvergence(input, canvasRun) ||
    canvasRunCanReturnAppliedSingleNodeResult(
      input,
      canvasRun,
      hasAppliedNodeResult(),
    )
  ) {
    return canvasRun;
  }
  throw streamError instanceof Error && !streamTimedOut
    ? streamError
    : new Error("画布仍在运行，请稍后刷新查看结果");
}

async function waitForCanvasRunTerminalStatus(
  input: CanvasStartRunInput,
  currentRun: CanvasRunRef,
  fallbackRequestId: string,
  applyNodeResults: (results: CanvasNodeResultRef[]) => void,
  hasAppliedNodeResult: () => boolean,
  deadline: number,
) {
  let canvasRun = currentRun;
  let consecutiveFailures = 0;
  for (;;) {
    if (Date.now() >= deadline) {
      throw new Error("画布仍在运行，请稍后刷新查看结果");
    }
    try {
      canvasRun = await fetchCanvasRunStatusSnapshot(
        input,
        canvasRun,
        fallbackRequestId,
        applyNodeResults,
      );
      consecutiveFailures = 0;
    } catch (error) {
      consecutiveFailures += 1;
      if (consecutiveFailures >= canvasRunStatusPollFailureLimit) {
        throw error;
      }
    }
    if (
      !canvasRunNeedsStatusConvergence(input, canvasRun) ||
      canvasRunCanReturnAppliedSingleNodeResult(
        input,
        canvasRun,
        hasAppliedNodeResult(),
      )
    ) {
      return canvasRun;
    }
    await waitForCanvasConvergence(
      Math.min(canvasRunStatusPollIntervalMs, deadline - Date.now()),
    );
  }
}

function canvasRunCanReturnAppliedSingleNodeResult(
  input: CanvasStartRunInput,
  canvasRun: CanvasRunRef,
  hasAppliedNodeResult: boolean,
) {
  return Boolean(
    input.singleNode &&
    !isGroupCanvasRunInput(input) &&
    hasAppliedNodeResult &&
    !canvasRunHasPendingFeedback(canvasRun),
  );
}

function canvasRunHasPendingFeedback(canvasRun: CanvasRunRef) {
  const status = String(canvasRun.status || "")
    .trim()
    .toLowerCase();
  if (status === "waiting") {
    return true;
  }
  if (firstPendingApprovalFromCanvasRun(canvasRun)) {
    return true;
  }
  const values: unknown[] = [
    canvasRun.pending_node,
    canvasRun.output,
    ...(canvasRun.node_results || []),
  ];
  return values.some((value) => Boolean(canvasPayloadInteraction(value)));
}

async function fetchCanvasRunStatusSnapshot(
  input: CanvasStartRunInput,
  currentRun: CanvasRunRef,
  fallbackRequestId: string,
  applyNodeResults: (results: CanvasNodeResultRef[]) => void,
) {
  let canvasRun = currentRun;
  const runId = Number(canvasRun.run_id || 0);
  const requestId = String(canvasRun.request_id || fallbackRequestId || "");
  if (!runId && !requestId) {
    return canvasRun;
  }
  const status = await fetchSpaceRunStatus({
    projectId: input.projectId,
    runId,
    requestId,
  });
  canvasRun = normalizeSingleNodeCanvasRun(
    input,
    mergeCanvasRunRef(canvasRun, normalizeCanvasRunRef(status)),
  );
  canvasRun = normalizeCanvasRunTerminalStatus(input, canvasRun);
  applyNodeResults(canvasRun.node_results || []);
  syncBackendCanvasRunRuntime(input, canvasRun);
  return canvasRun;
}

function canvasRunNeedsStatusConvergence(
  input: CanvasStartRunInput,
  canvasRun: CanvasRunRef,
) {
  const status = String(canvasRun.status || "")
    .trim()
    .toLowerCase();
  if (status !== "running" && status !== "pending") {
    return false;
  }
  return !canvasRunHasCompleteTerminalResults(input, canvasRun);
}

function canvasRunHasCompleteTerminalResults(
  input: CanvasStartRunInput,
  canvasRun: CanvasRunRef,
) {
  if (
    canvasRunRecordHasCompleteTerminalResults(
      canvasRun as WorkspaceCanvasRunRef,
    )
  ) {
    return true;
  }
  if (!input.singleNode) {
    return false;
  }
  return (canvasRun.node_results || []).some(
    (result) =>
      result.node_key === input.startNode.id &&
      canvasNodeRunFinishedStatus(canvasRunNodeResultStatus(result)),
  );
}

function normalizeCanvasRunTerminalStatus(
  input: CanvasStartRunInput,
  canvasRun: CanvasRunRef,
) {
  if (!canvasRunNeedsTerminalStatusPatch(input, canvasRun)) {
    return canvasRun;
  }
  return {
    ...canvasRun,
    status: terminalCanvasRunStatusFromResults(canvasRun.node_results || []),
  };
}

function canvasRunNeedsTerminalStatusPatch(
  input: CanvasStartRunInput,
  canvasRun: CanvasRunRef,
) {
  const status = String(canvasRun.status || "")
    .trim()
    .toLowerCase();
  if (status !== "running" && status !== "pending") {
    return false;
  }
  return canvasRunHasCompleteTerminalResults(input, canvasRun);
}

function terminalCanvasRunStatusFromResults(results: CanvasNodeResultRef[]) {
  for (const result of results) {
    const status = canvasRunNodeResultStatus(result);
    if (status === "fail") {
      return "fail";
    }
    if (status === "canceled" || status === "cancelled") {
      return "canceled";
    }
  }
  return "success";
}

function waitForCanvasConvergence(delayMs: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, delayMs);
  });
}

async function waitForCanvasRunStream(
  input: CanvasStartRunInput,
  requestId: string,
  lastId: string,
  onFrame: (frame: SpaceStreamFrame) => void,
  signal: AbortSignal,
): Promise<CanvasRunRef | null> {
  let finalRun: CanvasRunRef | null = null;
  await watchSpaceCanvasStream({
    projectId: input.projectId,
    requestId,
    lastId,
    signal,
    onFrame: (frame) => {
      onFrame(frame);
      if (String(frame.type || "").toLowerCase() !== "result") {
        return;
      }
      if (isErrorStreamFrame(frame)) {
        throw new Error(frame.msg || "画布流返回失败");
      }
      finalRun = normalizeSingleNodeCanvasRun(
        input,
        normalizeCanvasRunRef(frame.output || {}),
      );
    },
  });
  return finalRun;
}

function isErrorStreamFrame(frame: SpaceStreamFrame) {
  return Number(frame.status || 0) === 2;
}

function normalizeSingleNodeCanvasRun(
  input: CanvasStartRunInput,
  canvasRun: CanvasRunRef,
): CanvasRunRef {
  if (!input.singleNode) {
    return canvasRun;
  }
  if (isGroupCanvasRunInput(input)) {
    return canvasRun;
  }
  const existing = (canvasRun.node_results || []).find(
    (result) => result.node_key === input.startNode.id,
  );
  const status = String(canvasRun.status || existing?.status || "");
  if (existing && (status !== "waiting" || canvasRun.pending_node)) {
    return canvasRun;
  }
  const approval = firstPendingApprovalFromCanvasRun(canvasRun);
  const output = firstDefined(existing?.output, canvasRun.output);
  const result: CanvasNodeResultRef = {
    execution_id: Number(canvasRun.execution_id || existing?.execution_id || 0),
    node_key: input.startNode.id,
    node_type: input.startNode.type,
    node_run_id: Number(existing?.node_run_id || 0),
    run_id: Number(canvasRun.run_id || existing?.run_id || 0),
    request_id: String(canvasRun.request_id || existing?.request_id || ""),
    status: status || "success",
    error: existing?.error || canvasRun.error,
    output,
    asset: existing?.asset,
    version: existing?.version,
    result: {
      ...(existing?.result || {}),
      run_id: canvasRun.run_id,
      request_id: canvasRun.request_id,
      flow_run_id: canvasRun.flow_run_id,
      release_id: canvasRun.release_id,
      status: status || "success",
      error: existing?.error || canvasRun.error,
      output,
      approval,
    },
    approval: firstDefined(existing?.approval, approval),
    interaction: firstDefined(
      existing?.interaction,
      canvasPayloadInteraction(existing?.result),
      canvasPayloadInteraction(canvasRun.pending_node),
      canvasPayloadInteraction(canvasRun.output),
    ),
    persists_result: Boolean(existing?.persists_result),
    agent_run_id: Number(existing?.agent_run_id || 0),
  };
  const nodeResults = [
    ...(canvasRun.node_results || []).filter(
      (item) => item.node_key !== input.startNode.id,
    ),
    result,
  ];
  return {
    ...canvasRun,
    node_results: nodeResults,
    pending_node:
      status === "waiting"
        ? {
            ...result,
            status: "waiting",
            approval: result.approval,
            interaction: result.interaction,
          }
        : canvasRun.pending_node,
  };
}

function isGroupCanvasRunInput(input: CanvasStartRunInput) {
  return input.singleNode && input.startNode.type === "group";
}

function firstPendingApprovalFromCanvasRun(canvasRun: CanvasRunRef) {
  const output = canvasRun.output;
  const approvals = Array.isArray(canvasRun.approvals)
    ? canvasRun.approvals
    : output &&
        typeof output === "object" &&
        Array.isArray((output as any).approvals)
      ? (output as any).approvals
      : output &&
          typeof output === "object" &&
          Array.isArray((output as any).data?.approvals)
        ? (output as any).data.approvals
        : [];
  return approvals.find(
    (approval: any) =>
      approval &&
      typeof approval === "object" &&
      (approval.status === "pending" || approval.decision === "pending"),
  );
}

function canvasRunFromStreamFrame(
  frame: SpaceStreamFrame,
  input?: CanvasStartRunInput,
): CanvasRunRef | null {
  if (String(frame.type || "").toLowerCase() === "result") {
    return normalizeCanvasRunRef(frame.output || {});
  }
  const output = frame.output || {};
  const event = String(output.event || "");
  if (String(output.scope || "") === "canvas_child" && event !== "waiting") {
    return null;
  }
  if (event !== "node_finished" && event !== "waiting") {
    return null;
  }
  const nodeResult = canvasNodeResultFromStreamOutput(output, {
    requireDisplayableResult: event !== "waiting",
    node: input?.nodes.find(
      (item) => item.id === String(output.node_key || output.node_id || ""),
    ),
  });
  if (!nodeResult) {
    return null;
  }
  return {
    execution_id: Number((output as any).execution_id || 0),
    request_id: String(frame.request_id || output.parent_request_id || ""),
    run_id: Number(output.parent_run_id || output.run_id || 0),
    flow_run_id: Number(output.parent_flow_run_id || output.flow_run_id || 0),
    release_id: Number(output.release_id || 0),
    status: event === "waiting" ? "waiting" : "running",
    node_results: [nodeResult],
    pending_node: event === "waiting" ? nodeResult : null,
  };
}

function canvasNodeResultFromStreamOutput(
  output: Record<string, unknown>,
  options: { requireDisplayableResult?: boolean; node?: SpaceCanvasNode } = {},
): CanvasNodeResultRef | null {
  const nodeKey = String(output.node_key || output.node_id || "");
  if (!nodeKey) {
    return null;
  }
  const resultOutput = output.output;
  const result =
    resultOutput && typeof resultOutput === "object"
      ? (resultOutput as Record<string, unknown>)
      : {};
  const nodeResult = normalizeCanvasNodeResultPayload(result, nodeKey);
  if (!nodeResult) {
    return null;
  }
  const normalizedResult = nodeResult as unknown as Record<string, unknown>;
  if (
    options.requireDisplayableResult &&
    !shouldApplyCanvasStreamResult(output, normalizedResult, options.node)
  ) {
    return null;
  }
  return {
    ...nodeResult,
    node_key: nodeKey,
    execution_id: Number(
      output.execution_id ||
        nodeResult.execution_id ||
        (result as any).execution_id ||
        0,
    ),
    node_type: String(output.node_type || nodeResult.node_type || ""),
    node_run_id: Number(output.node_run_id || nodeResult.node_run_id || 0),
    run_id: Number(
      output.run_id || nodeResult.run_id || (result as any).run_id || 0,
    ),
    request_id: String(
      output.request_id ||
        nodeResult.request_id ||
        (result as any).request_id ||
        "",
    ),
    child_run_id: Number(
      output.child_run_id ||
        nodeResult.child_run_id ||
        (result as any).child_run_id ||
        0,
    ),
    child_request_id: String(
      output.child_request_id ||
        nodeResult.child_request_id ||
        (result as any).child_request_id ||
        "",
    ),
    status: String(output.status || nodeResult.status || ""),
    error: String(
      output.error || nodeResult.error || (result as any).error || "",
    ),
    output: nodeResult.output ?? (result as any).output ?? resultOutput,
    asset: nodeResult.asset ?? (result as any).asset,
    version:
      nodeResult.version ??
      (result as any).version ??
      nodeResult.asset?.version,
    result: nodeResult.result ?? nodeResult,
    approval: firstDefined(
      nodeResult.approval,
      streamApprovalFromOutput(output, normalizedResult),
    ),
    interaction: firstDefined(
      output.interaction,
      nodeResult.interaction,
      canvasPayloadInteraction(nodeResult),
    ),
    persists_result: Boolean(
      output.persists_result || nodeResult.persists_result,
    ),
    agent_run_id: Number(
      output.agent_run_id ||
        nodeResult.agent_run_id ||
        (result as any).agent_run_id ||
        0,
    ),
    source_signature: nodeResult.source_signature,
  };
}

function streamApprovalFromOutput(
  output: Record<string, unknown>,
  result: Record<string, unknown>,
) {
  const approval = firstDefined(
    output.approval,
    (result as any).approval,
    (result as any).result?.approval,
  );
  if (approval && typeof approval === "object") {
    return approval;
  }
  const approvalId = Number(
    firstDefined(
      output.approval_id,
      (result as any).approval_id,
      (result as any).result?.approval_id,
    ) || 0,
  );
  return approvalId > 0 ? { id: approvalId } : undefined;
}

function canvasPayloadInteraction(
  value: unknown,
  depth = 0,
): Record<string, unknown> | undefined {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    depth > 6
  ) {
    return undefined;
  }
  const payload = value as Record<string, unknown>;
  if (
    payload.interaction &&
    typeof payload.interaction === "object" &&
    !Array.isArray(payload.interaction)
  ) {
    return payload.interaction as Record<string, unknown>;
  }
  for (const key of ["result", "pending_node"] as const) {
    const interaction = canvasPayloadInteraction(payload[key], depth + 1);
    if (interaction) {
      return interaction;
    }
  }
  const nodeResults = Array.isArray(payload.node_results)
    ? payload.node_results
    : [];
  for (const nodeResult of nodeResults) {
    const interaction = canvasPayloadInteraction(nodeResult, depth + 1);
    if (interaction) {
      return interaction;
    }
  }
  return undefined;
}

function shouldApplyCanvasStreamResult(
  eventOutput: Record<string, unknown>,
  result: Record<string, unknown>,
  node?: SpaceCanvasNode,
) {
  if (Boolean(eventOutput.persists_result)) {
    return true;
  }
  const nodeType = String(eventOutput.node_type || "");
  if (nodeType !== "function") {
    return true;
  }
  const functionKey = String(
    eventOutput.function_key ||
      result.function_key ||
      node?.functionOption?.key ||
      "",
  );
  if (functionKey === "display") {
    return true;
  }
  return Boolean(
    result.asset ||
    result.version ||
    (result as any).asset?.version ||
    (result as any).data?.asset ||
    (result as any).data?.version,
  );
}

function applyCanvasStreamNodeFrame(
  input: CanvasStreamRuntime,
  frame: SpaceStreamFrame,
) {
  if (!input.setRunningNode) {
    return;
  }
  const output = frame.output || {};
  const event = String(output.event || "");
  const nodeId = String(output.node_key || output.node_id || "");
  if (!nodeId) {
    return;
  }
  if (event !== "node_output") {
    input.runningNodeBatcher?.flush();
  }
  if (event === "node_started") {
    input.setRunningNode((current) => ({
      ...current,
      [nodeId]: {
        nodeId,
        title: String(output.node_name || output.node_key || nodeId),
        startedAt: Date.now(),
        status: "running",
        progress: Math.max(current[nodeId]?.progress || 0, 18),
        agent: current[nodeId]?.agent,
      },
    }));
    return;
  }
  if (event === "node_output") {
    const updateRunningNode = (current: RunningNodeMap) => {
      const running = current[nodeId];
      if (!running || running.status !== "running") {
        return current;
      }
      const nodeOutput = canvasStreamNodeOutput(output.output);
      const nodeType = String(output.node_type || "").toLowerCase();
      const isPowerStream = nodeType === "power";
      const isAgentStream = nodeType === "agent";
      const streamEvent = String(
        nodeOutput.semantic_event || nodeOutput.event || "",
      ).toLowerCase();
      const streamMeta = canvasStreamNodeOutput(nodeOutput.meta);
      const isStructuredStatus =
        isPowerStream &&
        streamEvent === "status" &&
        Boolean(String(streamMeta.output_type || ""));
      const hasStructuredStatusPayload =
        isStructuredStatus &&
        Boolean(nodeOutput.json && typeof nodeOutput.json === "object");
      const hasDisplayableStreamOutput =
        isPowerStream &&
        (streamEvent === "audio_ready" ||
          hasStructuredStatusPayload ||
          contentOutputHasMedia(nodeOutput));
      const nextGeneratedCount = Number(streamMeta.generated_count || 0);
      const generatedCount = isStructuredStatus
        ? Math.max(
            running.generatedCount || 0,
            Number.isFinite(nextGeneratedCount) ? nextGeneratedCount : 0,
          )
        : running.generatedCount;
      const deltaText =
        isPowerStream &&
        typeof nodeOutput.text === "string" &&
        (streamEvent === "delta" || !streamEvent)
          ? nodeOutput.text
          : "";
      const streamOutput =
        hasDisplayableStreamOutput ? nodeOutput : running.streamOutput;
      return {
        ...current,
        [nodeId]: {
          ...running,
          progress: Math.max(running.progress, 72),
          streamText: deltaText
            ? `${running.streamText || ""}${deltaText}`
            : running.streamText,
          streamOutput,
          streamStarted:
            running.streamStarted ||
            Boolean(deltaText) ||
            Boolean(streamOutput),
          ...(isStructuredStatus
            ? { streamStarted: true, generatedCount }
            : {}),
          agent: isAgentStream
            ? reduceCanvasAgentRuntime(running.agent, nodeOutput)
            : running.agent,
        },
      };
    };
    if (input.runningNodeBatcher) {
      input.runningNodeBatcher.enqueue(updateRunningNode);
    } else {
      input.setRunningNode(updateRunningNode);
    }
  }
}

function applyRecoveredCanvasStreamFrame(
  input: CanvasStreamRuntime,
  frame: SpaceStreamFrame,
  managedNodeIds: ReadonlySet<string>,
  finishedNodeIds: Set<string>,
) {
  const output = frame.output || {};
  const event = String(output.event || "");
  const nodeId = String(output.node_key || output.node_id || "");
  if (
    !nodeId ||
    (managedNodeIds.size > 0 && !managedNodeIds.has(nodeId)) ||
    finishedNodeIds.has(nodeId)
  ) {
    return;
  }
  if (event === "node_finished") {
    finishedNodeIds.add(nodeId);
    input.runningNodeBatcher?.flush();
    return;
  }
  applyCanvasStreamNodeFrame(input, frame);
}

function canvasStreamNodeOutput(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}

function mergeCanvasRunRef(
  current: CanvasRunRef,
  next: CanvasRunRef,
): CanvasRunRef {
  const nodeResults = [...(current.node_results || [])];
  for (const result of next.node_results || []) {
    const key = canvasNodeResultApplyKey(result);
    const index = nodeResults.findIndex(
      (item) => canvasNodeResultApplyKey(item) === key,
    );
    if (index >= 0) {
      nodeResults[index] = result;
    } else {
      nodeResults.push(result);
    }
  }
  return {
    ...current,
    ...next,
    node_runs: next.node_runs?.length ? next.node_runs : current.node_runs,
    execution_plan: next.execution_plan || current.execution_plan,
    node_results: nodeResults,
    pending_node:
      next.status === "waiting"
        ? next.pending_node || current.pending_node
        : next.pending_node || null,
  };
}

function markBackendCanvasNodeResultsDone(
  input: CanvasStartRunInput,
  results: CanvasNodeResultRef[],
) {
  if (!input.setRunningNode) {
    return;
  }
  const doneResults = results.filter((result) =>
    canvasNodeRunFinishedStatus(result.status),
  );
  if (doneResults.length === 0) {
    return;
  }
  input.setRunningNode((current) =>
    markCanvasNodeResultsDoneState(input, current, doneResults),
  );
  window.setTimeout(() => {
    input.setRunningNode?.((current) => {
      let changed = false;
      let next = current;
      for (const result of doneResults) {
        const nodeId = result.node_key;
        const running = next[nodeId];
        if (!running || running.status === "running") {
          continue;
        }
        if (next === current) {
          next = { ...current };
        }
        delete next[nodeId];
        changed = true;
      }
      return changed ? next : current;
    });
  }, 650);
}

function markCanvasNodeResultsDoneState(
  input: CanvasStartRunInput,
  current: RunningNodeMap,
  results: CanvasNodeResultRef[],
) {
  let changed = false;
  const next = { ...current };
  for (const result of results) {
    const nodeId = result.node_key;
    const node = input.nodes.find((item) => item.id === nodeId);
    if (result.status === "canceled") {
      if (next[nodeId]) {
        delete next[nodeId];
        changed = true;
      }
      continue;
    }
    if (result.status === "waiting") {
      next[nodeId] = {
        nodeId,
        title: node?.title || nodeId,
        startedAt: current[nodeId]?.startedAt || Date.now(),
        progress: 92,
        status: "waiting",
      };
      changed = true;
      continue;
    }
    const running = next[nodeId];
    if (!running) {
      continue;
    }
    next[nodeId] = {
      ...running,
      progress: 100,
      status: result.status === "success" ? "success" : "error",
      agent:
        node?.type === "agent"
          ? readCanvasAgentResult(result.output)
          : running.agent,
    };
    changed = true;
  }
  return changed ? next : current;
}

function finishBackendCanvasRunningNodes(
  input: CanvasStartRunInput,
  canvasRun: CanvasRunRef,
  managedNodeIds?: ReadonlySet<string>,
) {
  if (
    !input.setRunningNode ||
    canvasRun.status === "running" ||
    canvasRun.status === "pending" ||
    canvasRun.status === "waiting"
  ) {
    return;
  }
  if (canvasRun.status === "canceled") {
    input.setRunningNode((current) => {
      const nodeIds = backendCanvasRunActiveNodeIds(
        input,
        canvasRun,
        current,
        managedNodeIds,
      );
      if (nodeIds.length === 0) {
        return current;
      }
      const next = { ...current };
      for (const nodeId of nodeIds) {
        delete next[nodeId];
      }
      return next;
    });
    return;
  }
  const finishedStatus =
    canvasRun.status === "success" ? "success" : "error";
  input.setRunningNode((current) => {
    let changed = false;
    const next = { ...current };
    const nodeIds = backendCanvasRunActiveNodeIds(
      input,
      canvasRun,
      current,
      managedNodeIds,
    );
    for (const nodeId of nodeIds) {
      const running = next[nodeId];
      if (!running) {
        continue;
      }
      next[nodeId] = {
        ...running,
        progress:
          finishedStatus === "success" ? 100 : Math.max(running.progress, 92),
        status: finishedStatus,
      };
      changed = true;
    }
    return changed ? next : current;
  });
  window.setTimeout(
    () => {
      input.setRunningNode?.((current) => {
        let changed = false;
        let next = current;
        const nodeIds = backendCanvasRunActiveNodeIds(
          input,
          canvasRun,
          current,
          managedNodeIds,
        );
        for (const nodeId of nodeIds) {
          const running = next[nodeId];
          if (!running || running.status === "running") {
            continue;
          }
          if (next === current) {
            next = { ...current };
          }
          delete next[nodeId];
          changed = true;
        }
        return changed ? next : current;
      });
    },
    finishedStatus === "success" ? 650 : 1200,
  );
}

function backendCanvasRunActiveNodeIds(
  input: CanvasStartRunInput,
  canvasRun: CanvasRunRef,
  current: RunningNodeMap,
  managedNodeIds?: ReadonlySet<string>,
) {
  const allowed = new Set(
    backendCanvasRunNodeIds(input, canvasRun).filter(
      (nodeId) => !managedNodeIds || managedNodeIds.has(nodeId),
    ),
  );
  return Object.keys(current).filter((nodeId) => allowed.has(nodeId));
}

function markCanvasRunRecordRunningNodes(
  input: CanvasStartRunInput,
  canvasRun: CanvasRunRef,
  managedNodeIds?: ReadonlySet<string>,
) {
  if (!input.setRunningNode) {
    return;
  }
  const runStatus = String(canvasRun.status || "")
    .trim()
    .toLowerCase();
  if (!["running", "pending", "waiting"].includes(runStatus)) {
    return;
  }
  const finishedNodeIds = canvasRunFinishedNodeIds(canvasRun);
  const activeNodeStatuses = new Map<string, RunningNodeState["status"]>();
  let hasManagedNodeRun = false;
  let firstPendingNodeId = "";
  for (const nodeRun of canvasRun.node_runs || []) {
    const nodeId = String(nodeRun.node_key || "");
    if (
      !nodeId ||
      finishedNodeIds.has(nodeId) ||
      (managedNodeIds && !managedNodeIds.has(nodeId))
    ) {
      continue;
    }
    hasManagedNodeRun = true;
    const status = String(nodeRun.status || "")
      .trim()
      .toLowerCase();
    if (status === "running") {
      activeNodeStatuses.set(nodeId, "running");
    } else if (status === "waiting") {
      activeNodeStatuses.set(nodeId, "waiting");
    } else if (status === "pending" && !firstPendingNodeId) {
      firstPendingNodeId = nodeId;
    }
  }
  const pendingNodeId = String(canvasRun.pending_node?.node_key || "");
  if (
    pendingNodeId &&
    !finishedNodeIds.has(pendingNodeId) &&
    (!managedNodeIds || managedNodeIds.has(pendingNodeId))
  ) {
    activeNodeStatuses.set(pendingNodeId, "waiting");
  }
  if (activeNodeStatuses.size === 0 && firstPendingNodeId) {
    activeNodeStatuses.set(firstPendingNodeId, "running");
  }
  if (activeNodeStatuses.size === 0 && !hasManagedNodeRun) {
    const fallbackNodeId = String(canvasRun.start_node_id || "");
    if (
      fallbackNodeId &&
      !finishedNodeIds.has(fallbackNodeId) &&
      (!managedNodeIds || managedNodeIds.has(fallbackNodeId))
    ) {
      activeNodeStatuses.set(
        fallbackNodeId,
        runStatus === "waiting" ? "waiting" : "running",
      );
    }
  }
  if (activeNodeStatuses.size === 0) {
    return;
  }
  const startedAt = Date.parse(String(canvasRun.created_at || ""));
  input.setRunningNode((current) => {
    let changed = false;
    const next = { ...current };
    for (const [nodeId, status] of activeNodeStatuses) {
      const node = input.nodes.find((item) => item.id === nodeId);
      if (!node) {
        continue;
      }
      const existing = current[nodeId];
      if (existing?.status === status) {
        continue;
      }
      next[nodeId] = {
        nodeId,
        title: node.title,
        startedAt:
          existing?.startedAt ||
          (Number.isFinite(startedAt) ? startedAt : Date.now()),
        progress: status === "waiting" ? 92 : existing?.progress || 0,
        status,
      };
      changed = true;
    }
    return changed ? next : current;
  });
}

function backendCanvasRunNodeIds(
  input: CanvasStartRunInput,
  canvasRun: CanvasRunRef,
) {
  const result = new Set(canvasRunNodeIds(canvasRun));
  if (input.singleNode) {
    result.add(input.startNode.id);
  }
  return [...result];
}

function canvasRunRecordMatchesCate(
  run: WorkspaceCanvasRunRef,
  cateId: number,
) {
  const runCateId = Number(run.asset_cate_id || 0);
  return runCateId === 0 || runCateId === Number(cateId || 0);
}

function canvasRunNodeIds(run: CanvasRunRef) {
  const nodeIds = new Set<string>();
  const startNodeId = String(run.start_node_id || "");
  if (startNodeId) {
    nodeIds.add(startNodeId);
  }
  for (const nodeRun of run.node_runs || []) {
    if (nodeRun.node_key) {
      nodeIds.add(nodeRun.node_key);
    }
  }
  for (const nodeResult of run.node_results || []) {
    if (nodeResult.node_key) {
      nodeIds.add(nodeResult.node_key);
    }
  }
  for (const node of run.execution_plan?.nodes || []) {
    if (node.id) {
      nodeIds.add(node.id);
    }
  }
  return [...nodeIds];
}

function canvasRunFinishedNodeIds(run: CanvasRunRef) {
  return new Set(
    (run.node_results || [])
      .filter((result) =>
        canvasNodeRunFinishedStatus(canvasRunNodeResultStatus(result)),
      )
      .map((result) => result.node_key)
      .filter(Boolean),
  );
}

function canvasRunRecordsActiveLatestRuns(runs: WorkspaceCanvasRunRef[]) {
  return canvasRunRecordsActiveLatest(runs).map((entry) => entry.run);
}

function uniqueActiveCanvasRuns(runs: CanvasRunRef[]) {
  const activeRuns = new Map<string, CanvasRunRef>();
  for (const run of runs) {
    if (!isActiveCanvasRun(run)) {
      continue;
    }
    activeRuns.set(canvasRunIdentity(run), run);
  }
  return [...activeRuns.values()];
}

function canvasRunRecordsActiveLatest(runs: WorkspaceCanvasRunRef[]) {
  const claimedNodeIds = new Set<string>();
  const activeRuns: ActiveWorkspaceCanvasRun[] = [];
  for (const run of runs) {
    const managedNodeIds = new Set<string>();
    for (const nodeId of canvasRunNodeIds(run)) {
      if (claimedNodeIds.has(nodeId)) {
        continue;
      }
      claimedNodeIds.add(nodeId);
      managedNodeIds.add(nodeId);
    }
    if (managedNodeIds.size === 0) {
      continue;
    }
    if (isActiveCanvasRun(run)) {
      activeRuns.push({ run, managedNodeIds });
    }
  }
  return activeRuns;
}

function normalizeWorkspaceCanvasRuns(values: unknown[]) {
  return values
    .map(normalizeWorkspaceCanvasRun)
    .filter((run): run is WorkspaceCanvasRunRef => Boolean(run));
}

function normalizeWorkspaceCanvasRun(value: unknown) {
  const run = normalizeCanvasRunRef(value);
  return run.run_id || run.request_id ? (run as WorkspaceCanvasRunRef) : null;
}

function canvasRecoveryDetailRunIds(
  runs: WorkspaceCanvasRunRef[],
  canvases: Record<string, SpaceCanvasState>,
) {
  const result = new Set<number>();
  for (const run of runs) {
    const runId = Number(run.run_id || 0);
    if (runId > 0 && !canvasRecoveryRunAlreadyApplied(run, canvases)) {
      result.add(runId);
    }
  }
  return [...result];
}

function canvasRecoveryRunAlreadyApplied(
  run: WorkspaceCanvasRunRef,
  canvases: Record<string, SpaceCanvasState>,
) {
  const runCateId = Number(run.asset_cate_id || 0);
  const candidates = runCateId
    ? [canvases[String(runCateId)]].filter(
        (canvas): canvas is SpaceCanvasState => Boolean(canvas),
      )
    : Object.values(canvases);
  return candidates.some((canvas) =>
    canvasRunAlreadyAppliedToCanvas(run, canvas),
  );
}

function canvasRunAlreadyAppliedToCanvas(
  run: WorkspaceCanvasRunRef,
  canvas: SpaceCanvasState,
) {
  const status = String(run.status || "")
    .trim()
    .toLowerCase();
  if (
    !["success", "fail", "failed", "error", "canceled", "cancelled"].includes(
      status,
    )
  ) {
    return false;
  }
  const nodesByID = new Map(canvas.nodes.map((node) => [node.id, node]));
  if (!run.single_node) {
    const results = (run.node_results || []).filter(
      (result) => result.node_key,
    );
    if (results.length === 0) {
      return false;
    }
    let matchedNodeCount = 0;
    for (const result of results) {
      const node = nodesByID.get(result.node_key);
      if (!node) {
        continue;
      }
      matchedNodeCount += 1;
      if (!canvasResultRefCoversRun(node.resultRef, run, result)) {
        return false;
      }
    }
    return matchedNodeCount > 0;
  }
  const node = nodesByID.get(String(run.start_node_id || ""));
  return canvasResultRefCoversRun(node?.resultRef, run);
}

function canvasResultRefCoversRun(
  resultRef: CanvasResultRef | undefined,
  run: WorkspaceCanvasRunRef,
  result?: CanvasNodeResultRef,
) {
  if (!resultRef) {
    return false;
  }
  const executionId = Number(run.execution_id || 0);
  const currentExecutionId = Number(resultRef.execution_id || 0);
  if (
    executionId > 0 &&
    currentExecutionId > 0 &&
    currentExecutionId >= executionId
  ) {
    return true;
  }
  const runId = Number(run.run_id || 0);
  const currentRunId = Number(resultRef.run_id || 0);
  if (runId > 0 && currentRunId > 0 && currentRunId >= runId) {
    return true;
  }
  const nodeRunId = Number(result?.node_run_id || 0);
  const currentNodeRunId = Number(resultRef.node_run_id || 0);
  if (nodeRunId > 0 && currentNodeRunId > 0 && currentNodeRunId >= nodeRunId) {
    return true;
  }
  const requestId = String(result?.request_id || run.request_id || "");
  return Boolean(requestId && resultRef.request_id === requestId);
}

function mergeWorkspaceCanvasRunRecords(
  current: WorkspaceCanvasRunRef[],
  incoming: WorkspaceCanvasRunRef[],
) {
  const records = new Map<string, WorkspaceCanvasRunRef>();
  for (const run of current) {
    records.set(canvasRunIdentity(run), run);
  }
  for (const run of incoming) {
    records.set(canvasRunIdentity(run), run);
  }
  return [...records.values()]
    .sort(compareWorkspaceCanvasRunRecency)
    .slice(0, 50);
}

function compareWorkspaceCanvasRunRecency(
  left: WorkspaceCanvasRunRef,
  right: WorkspaceCanvasRunRef,
) {
  const executionDifference =
    Number(right.execution_id || 0) - Number(left.execution_id || 0);
  if (executionDifference !== 0) {
    return executionDifference;
  }
  const updatedDifference =
    canvasRunRecordTimestamp(right) - canvasRunRecordTimestamp(left);
  if (updatedDifference !== 0) {
    return updatedDifference;
  }
  return Number(right.run_id || 0) - Number(left.run_id || 0);
}

function canvasRunRecordTimestamp(run: WorkspaceCanvasRunRef) {
  const timestamp = Date.parse(String(run.updated_at || run.created_at || ""));
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function canvasRunRecordHasCompleteTerminalResults(run: WorkspaceCanvasRunRef) {
  const expectedNodeIds = canvasRunRecordExpectedResultNodeIds(run);
  if (expectedNodeIds.size === 0) {
    return false;
  }
  const finishedNodeIds = new Set<string>();
  for (const result of run.node_results || []) {
    const status = canvasRunNodeResultStatus(result);
    if (status === "waiting" || status === "running" || status === "pending") {
      return false;
    }
    if (canvasNodeRunFinishedStatus(status)) {
      finishedNodeIds.add(result.node_key);
    }
  }
  for (const nodeId of expectedNodeIds) {
    if (!finishedNodeIds.has(nodeId)) {
      return false;
    }
  }
  return true;
}

function canvasRunRecordExpectedResultNodeIds(run: WorkspaceCanvasRunRef) {
  const planNodeIds = new Set<string>();
  for (const node of run.execution_plan?.nodes || []) {
    if (canvasRunPlanNodeCanReturnResult(node)) {
      planNodeIds.add(node.id);
    }
  }
  if (planNodeIds.size > 0) {
    return planNodeIds;
  }

  const nodeRunIds = new Set<string>();
  for (const nodeRun of run.node_runs || []) {
    if (nodeRun.node_key) {
      nodeRunIds.add(nodeRun.node_key);
    }
  }
  if (nodeRunIds.size > 0) {
    return nodeRunIds;
  }

  const startNodeId = String(run.start_node_id || "");
  if (
    startNodeId &&
    (run.node_results || []).some((result) => result.node_key === startNodeId)
  ) {
    return new Set([startNodeId]);
  }
  return new Set<string>();
}

function canvasRunPlanNodeCanReturnResult(node: {
  type?: string;
  function_key?: string;
}) {
  if (["asset", "power", "agent", "flow"].includes(String(node.type || ""))) {
    return true;
  }
  if (node.type !== "function") {
    return false;
  }
  return node.function_key === "save" || node.function_key === "display";
}

function canvasRunRecordStartNode(
  run: WorkspaceCanvasRunRef,
  nodes: SpaceCanvasNode[],
) {
  const nodeId =
    run.start_node_id ||
    run.execution_plan?.order?.[0] ||
    run.execution_plan?.nodes?.[0]?.id ||
    "";
  if (nodeId) {
    const node = nodes.find((item) => item.id === nodeId);
    if (node) {
      return node;
    }
  }
  return nodes.find(isStartFunctionNode) || nodes[0] || null;
}

function canvasRunRecordResultApplyKey(
  run: WorkspaceCanvasRunRef,
  result: CanvasNodeResultRef,
) {
  return [
    run.run_id || run.request_id || "",
    canvasNodeResultApplyKey(result),
  ].join(":");
}

function canvasNodeRunFinishedStatus(status?: string) {
  const normalized = String(status || "")
    .trim()
    .toLowerCase();
  return (
    normalized === "success" ||
    normalized === "fail" ||
    normalized === "canceled" ||
    normalized === "cancelled"
  );
}

function canvasRunNodeResultStatus(result?: CanvasNodeResultRef | null) {
  if (!result) {
    return "";
  }
  const status = String(result.status || (result.result as any)?.status || "")
    .trim()
    .toLowerCase();
  if (status === "error") {
    return "fail";
  }
  if (status === "cancelled") {
    return "canceled";
  }
  return status;
}

function createCanvasRunRequestId(startNodeId: string) {
  const randomPart =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `canvas-${randomPart}-${startNodeId}`.slice(0, 64);
}

function createCanvasSaveRequestId(
  purpose: string,
  nodeId: string,
  content: unknown,
) {
  const contentKey =
    typeof content === "string" ? content : safeJSONString(content);
  const bucket = Math.floor(Date.now() / 5000);
  return `${purpose}-${nodeId}-${bucket}-${simpleStringHash(contentKey)}`.slice(
    0,
    96,
  );
}

function simpleStringHash(value: string) {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }
  return (hash >>> 0).toString(36);
}

function syncBackendCanvasRunRuntime(
  input: CanvasStartRunInput,
  canvasRun: CanvasRunRef,
  managedNodeIds?: ReadonlySet<string>,
) {
  syncBackendCanvasFeedbackRecord(input, canvasRun);
  markCanvasRunRecordRunningNodes(input, canvasRun, managedNodeIds);
}

function syncBackendCanvasFeedbackRecord(
  input: CanvasStartRunInput,
  canvasRun: CanvasRunRef,
) {
  if (canvasRun.status !== "waiting") {
    return;
  }
  const pending = canvasRun.pending_node;
  if (!pending?.node_key) {
    return;
  }
  const node = input.nodes.find((item) => item.id === pending.node_key);
  if (!node) {
    return;
  }
  const prompt = backendCanvasFeedbackPrompt(pending, node);
  if (!prompt) {
    return;
  }
  const record = createStableNodeFeedbackRecord(node, prompt);
  const currentFeedbackRequests = currentNodeFeedbackRecords(node);
  const feedbackRequests = upsertNodeFeedbackRecord(
    currentFeedbackRequests,
    record,
  );
  if (
    safeJSONString(currentFeedbackRequests) !== safeJSONString(feedbackRequests)
  ) {
    const patchedNode = {
      ...node,
      feedbackRequests,
    };
    input.nodes = input.nodes.map((item) =>
      item.id === node.id ? patchedNode : item,
    );
    input.onNodeResult(node.id, { feedbackRequests });
  }
  input.setRunningNode?.((current) => ({
    ...current,
    [node.id]: {
      nodeId: node.id,
      title: node.title,
      startedAt: current[node.id]?.startedAt || Date.now(),
      progress: 92,
      status: "waiting",
    },
  }));
}

async function resumeBackendCanvasRun(
  input: CanvasStartRunInput,
  canvasRun: CanvasRunRef,
) {
  const pending = canvasRun.pending_node;
  if (!pending?.node_key) {
    throw new Error("画布运行等待反馈，但缺少等待节点");
  }
  const node = input.nodes.find((item) => item.id === pending.node_key);
  if (!node) {
    throw new Error("画布运行等待节点不存在");
  }
  const prompt = backendCanvasFeedbackPrompt(pending, node);
  if (!prompt || !input.requestFlowFeedback) {
    throw new Error(`${node.title} 需要补充信息，请单独处理后继续`);
  }
  const values = await input.requestFlowFeedback({ node, prompt });
  return submitBackendCanvasFeedbackResponse(
    input.projectId,
    canvasRun,
    pending,
    prompt,
    values,
  );
}

async function submitBackendCanvasFeedbackResponse(
  projectId: number,
  canvasRun: CanvasRunRef,
  pending: CanvasNodeResultRef,
  prompt: FlowFeedbackPrompt,
  values: Record<string, unknown>,
) {
  if (prompt.interaction) {
    return submitSpaceInteraction({
      projectId,
      runId: Number(prompt.interaction.runId || pending.child_run_id || 0),
      nodeRunId: Number(prompt.interaction.nodeRunId || 0),
      interactionId: String(prompt.interaction.interaction.id || ""),
      data: values,
    });
  }
  return submitSpaceCanvasFeedback({
    projectId,
    runId: Number(canvasRun.run_id || 0),
    requestId: String(canvasRun.request_id || ""),
    nodeKey: pending.node_key,
    approvalId: Number(prompt.approval.id || 0),
    feedback: values,
  });
}

function pendingCanvasFeedbackContext(
  runs: WorkspaceCanvasRunRef[],
  node: SpaceCanvasNode,
  record: NodeFeedbackRecord,
) {
  for (const run of runs) {
    if (
      String(run.status || "")
        .trim()
        .toLowerCase() !== "waiting"
    ) {
      continue;
    }
    const pending = run.pending_node;
    if (!pending || pending.node_key !== node.id) {
      continue;
    }
    const prompt = backendCanvasFeedbackPrompt(pending, node);
    if (!prompt) {
      continue;
    }
    const currentRecord = createStableNodeFeedbackRecord(node, prompt);
    if (currentRecord.id === record.id) {
      return { run, pending, prompt };
    }
  }
  return null;
}

function backendCanvasFeedbackPrompt(
  pending: CanvasNodeResultRef,
  node: SpaceCanvasNode,
): FlowFeedbackPrompt | null {
  const interactionValue =
    pending.interaction && typeof pending.interaction === "object"
      ? pending.interaction
      : canvasPayloadInteraction(pending);
  if (interactionValue?.interaction?.id) {
    return flowFeedbackFromInteraction({
      runId: Number(interactionValue.run_id || pending.child_run_id || 0),
      nodeRunId: Number(interactionValue.node_run_id || 0),
      interaction: interactionValue.interaction,
    });
  }
  const nodeType = pending.node_type || node.type;
  if (nodeType === "flow") {
    const source =
      pending.output && typeof pending.output === "object"
        ? { ...(pending.output as Record<string, unknown>) }
        : pending.result && typeof pending.result === "object"
          ? { ...(pending.result as Record<string, unknown>) }
          : {};
    const approval = firstDefined(
      pending.approval,
      (pending.result as any)?.approval,
      (pending.output as any)?.approval,
    );
    if (approval && !Array.isArray((source as any).approvals)) {
      (source as any).approvals = [approval];
    }
    const snapshot = normalizeFlowRunSnapshot(source);
    return flowFeedbackFromSnapshot(snapshot);
  }
  return agentFeedbackFromResult(
    backendCanvasNodeResultPayload(pending),
    node.title,
  );
}

function applyBackendCanvasRunResults(
  input: CanvasStartRunInput,
  results: CanvasNodeResultRef[],
  appliedNodeResults?: Set<string>,
) {
  let applied = 0;
  const nodesById = new Map(input.nodes.map((node) => [node.id, node]));
  for (const result of results) {
    const node = nodesById.get(result.node_key);
    const status = canvasRunNodeResultStatus(result);
    if (!node || !canvasNodeRunFinishedStatus(status)) {
      continue;
    }
    const resultKey = canvasNodeResultApplyKey(result);
    if (
      status === "success" &&
      resultKey &&
      appliedNodeResults?.has(resultKey)
    ) {
      continue;
    }
    const patch = buildBackendCanvasNodePatch(input, node, result);
    input.onNodeResult(node.id, patch);
    if (resultKey) {
      appliedNodeResults?.add(resultKey);
    }
    if (status === "success") {
      applied += 1;
    }
    const patchedNode = {
      ...node,
      ...patch,
    };
    nodesById.set(node.id, patchedNode);
    input.nodes = input.nodes.map((item) =>
      item.id === node.id ? patchedNode : item,
    );
    if (status === "success" && patch.asset) {
      input.onAssetCreated(patch.asset);
    }
    if (status === "success") {
      input.requestNodeTitle?.(patchedNode, result);
    }
  }
  return applied;
}

function canvasNodeTitlePrompt(
  node: SpaceCanvasNode,
  canvas?: SpaceCanvasState,
) {
  const prompt = readNodeComposerDraft(node).prompt.trim();
  const inputContext = canvas
    ? buildNodeInputContext(node.id, canvas.nodes, canvas.edges)
    : null;
  const context = inputContext?.text.trim() || "";
  const source = [prompt, context ? `上游内容：\n${context}` : ""]
    .filter(Boolean)
    .join("\n\n");
  return Array.from(source).slice(0, CANVAS_NODE_TITLE_PROMPT_LIMIT).join("");
}

function shouldGenerateCanvasNodeTitle(
  node: SpaceCanvasNode,
  result: CanvasNodeResultRef,
) {
  if (
    node.type !== "power" ||
    node.titleMode !== "auto" ||
    node.storyboardItem ||
    canvasRunNodeResultStatus(result) !== "success" ||
    canvasNodeResultVersionId(result) <= 0 ||
    !isDefaultCanvasNodeTitle(node)
  ) {
    return false;
  }
  return (
    resolvePowerPresentation(node.power, node.kind, node.outputType)
      .viewMode !== "storyboard"
  );
}

function isDefaultCanvasNodeTitle(node: SpaceCanvasNode) {
  const nodeNo = Number(node.nodeNo || 0);
  return (
    nodeNo > 0 &&
    node.title.trim() === defaultCanvasNodeTitle(node, nodeNo).trim()
  );
}

function canvasNodeResultVersionId(result: CanvasNodeResultRef) {
  const payload = result as any;
  const candidates = [
    payload.version_id,
    payload.versionId,
    payload.version?.id,
    payload.asset?.version_id,
    payload.asset?.versionId,
    payload.asset?.version?.id,
    payload.result?.version_id,
    payload.result?.versionId,
    payload.result?.version?.id,
    payload.result?.asset?.version_id,
    payload.result?.asset?.version?.id,
    payload.output?.version_id,
    payload.output?.version?.id,
    payload.output?.asset?.version_id,
    payload.output?.asset?.version?.id,
    payload.data?.version_id,
    payload.data?.version?.id,
    payload.data?.asset?.version_id,
    payload.data?.asset?.version?.id,
  ];
  for (const candidate of candidates) {
    const versionId = Number(candidate || 0);
    if (Number.isInteger(versionId) && versionId > 0) {
      return versionId;
    }
  }
  return 0;
}

function canvasNodeResultApplyKey(result: CanvasNodeResultRef) {
  return [
    result.node_key,
    result.execution_id || "",
    result.request_id || "",
    result.node_run_id || "",
    result.child_run_id || "",
    result.status || "",
    result.source_signature || "",
    Number(
      result.version?.id ||
        result.asset?.version?.id ||
        (result.result as any)?.version?.id ||
        0,
    ),
    Number(result.asset?.id || (result.result as any)?.asset?.id || 0),
  ].join(":");
}

function buildBackendCanvasNodePatch(
  input: CanvasStartRunInput,
  node: SpaceCanvasNode,
  result: CanvasNodeResultRef,
) {
  const normalizedResult = backendCanvasNodeResultPayload(result);
  const status = canvasRunNodeResultStatus(result);
  if (status === "fail") {
    return mergeNodeFeedbackRecordsIntoPatch(node, {
      resultRef: buildNodeResultRef(normalizedResult),
      runError: canvasNodeResultErrorMessage(result),
    });
  }
  if (status === "canceled" || status === "cancelled") {
    return mergeNodeFeedbackRecordsIntoPatch(node, {
      resultRef: buildNodeResultRef(normalizedResult),
      runError: "节点运行已取消",
    });
  }
  const asset = runResultAsset({
    result: normalizedResult,
    previousAsset: node.asset,
    previousAssets: input.space.assets,
  });
  const withFeedbackRecords = (patch: Partial<SpaceCanvasNode>) =>
    mergeNodeFeedbackRecordsIntoPatch(
      node,
      applyStoryboardNodeResultSourceState(
        node,
        patch,
        result.source_signature,
      ),
    );
  if (asset) {
    return withFeedbackRecords({
      ...buildGeneratedNodeResultPatch(
        node,
        withRunResultAsset(normalizedResult, asset),
        "后端执行结果",
      ),
      runError: "",
    });
  }
  return withFeedbackRecords({
    ...buildGeneratedNodeResultPatch(node, normalizedResult, "后端执行结果"),
    runError: "",
  });
}

function applyStoryboardNodeResultSourceState(
  node: SpaceCanvasNode,
  patch: Partial<SpaceCanvasNode>,
  resultSourceSignature?: string,
) {
  const storyboardItem = node.storyboardItem;
  const resultSignature = String(resultSourceSignature || "").trim();
  if (!storyboardItem || !resultSignature) {
    return patch;
  }
  const sourceSignature = String(storyboardItem.sourceSignature || "").trim();
  return {
    ...patch,
    storyboardItem: {
      ...storyboardItem,
      resultSourceSignature: resultSignature,
      stale: sourceSignature
        ? resultSignature !== sourceSignature
        : Boolean(storyboardItem.stale),
    },
  };
}

function mergeNodeFeedbackRecordsIntoPatch(
  node: SpaceCanvasNode,
  patch: Partial<SpaceCanvasNode>,
) {
  const records = currentNodeFeedbackRecords(node);
  if (records.length === 0 || Array.isArray((patch as any).feedbackRequests)) {
    return patch;
  }
  return {
    ...patch,
    feedbackRequests: records,
  };
}

function backendCanvasNodeResultPayload(result: CanvasNodeResultRef) {
  const payload: Record<string, unknown> = {
    ...(result.result && typeof result.result === "object"
      ? result.result
      : {}),
    execution_id: result.execution_id || (result.result as any)?.execution_id,
    run_id: result.run_id || (result.result as any)?.run_id,
    request_id: result.request_id || (result.result as any)?.request_id,
    node_run_id: result.node_run_id || (result.result as any)?.node_run_id,
    child_run_id: result.child_run_id || (result.result as any)?.child_run_id,
    child_request_id:
      result.child_request_id || (result.result as any)?.child_request_id,
    status: result.status || (result.result as any)?.status,
    error: result.error || (result.result as any)?.error,
    output: result.output ?? (result.result as any)?.output,
    asset: result.asset || (result.result as any)?.asset,
    version:
      result.version ||
      (result.result as any)?.version ||
      result.asset?.version,
    agent_run_id: result.agent_run_id || (result.result as any)?.agent_run_id,
  };
  return payload;
}

function canvasRunSummaryText(canvasRun: CanvasRunRef, executed: number) {
  if (canvasRun.status === "waiting") {
    return `已执行 ${executed} 个连接节点，等待补充信息`;
  }
  if (canvasRun.status === "fail" || canvasRun.status === "error") {
    return canvasRunErrorMessage(
      canvasRun,
      `画布运行失败，已执行 ${executed} 个连接节点`,
    );
  }
  return `已执行 ${executed} 个连接节点`;
}

async function saveCanvasContentResult(input: {
  projectId: number;
  assetCateId: number;
  name: string;
  kind: string;
  content: unknown;
  runRef?: SpaceCanvasNode["resultRef"] | null;
  nodeKey?: string;
  requestId?: string;
  source?: CanvasResultSourceRef | null;
  previousAsset?: ProjectAsset | null;
  previousAssets?: ProjectAsset[];
}) {
  const assetCateId = requireRealAssetCateId(input.assetCateId);
  if (!assetCateId) {
    throw new Error("当前团队没有配置资产分类，不能保存作品");
  }
  const savedAsset = await saveSpaceCanvasContent({
    projectId: input.projectId,
    assetCateId,
    name: input.name,
    kind: input.kind,
    content: input.content,
    runId: Number(input.runRef?.run_id || 0),
    nodeRunId: Number(input.runRef?.node_run_id || 0),
    releaseId: Number(input.runRef?.release_id || 0),
    nodeKey: input.nodeKey,
    requestId: input.requestId,
    source: input.source,
  });
  const previousAsset =
    input.previousAsset ||
    input.previousAssets?.find((asset) => asset.id === savedAsset.id) ||
    null;
  return mergeProjectAssetVersionHistory(savedAsset, previousAsset);
}

function requireRealAssetCateId(assetCateId: number) {
  return Math.max(0, Number(assetCateId || 0));
}

function generatedNodePreview(node: SpaceCanvasNode): GeneratedNodePreview {
  const output = nodeContextOutput(node);
  const preview = generatedPreviewFromValue(
    output,
    nodePreviewKind(node, output),
  );
  if (!hasGeneratedPreview(preview)) {
    preview.text = displayTextFromOutput(output, "");
  }
  return preview;
}

function nodePreviewKind(node: SpaceCanvasNode, output: unknown) {
  const outputKind = previewKindFromOutput(output);
  if (node.type === "power") {
    return firstNonEmptyText(
      String(node.power?.kind || ""),
      outputKind,
      String(node.asset?.kind || ""),
      String(node.kind || ""),
    );
  }
  return firstNonEmptyText(
    String(node.asset?.kind || ""),
    String(node.power?.kind || ""),
    outputKind,
    String(node.kind || ""),
  );
}

function nodeDetailPreview(node: SpaceCanvasNode): GeneratedNodePreview {
  const preview = generatedNodePreview(node);
  if (hasGeneratedPreview(preview)) {
    return preview;
  }
  const assetPreview = generatedPreviewFromValue(
    nodeContextOutput(node),
    String(node.kind || node.power?.kind || ""),
  );
  if (!hasGeneratedPreview(assetPreview)) {
    assetPreview.text = displayTextFromOutput(nodeContextOutput(node), "");
  }
  return assetPreview;
}

function nodeRichDocument(node: SpaceCanvasNode) {
  return fixedTiptapRichDocumentFromNode(node) || richDocumentFromNode(node);
}

function nodeEnergonOutput(node: SpaceCanvasNode) {
  if (node.storyboardItem?.itemType === "subtitle") {
    return { text: node.description || "字幕轨已准备" };
  }
  return nodeContextOutput(node);
}

function storyboardNodeOutput(node: SpaceCanvasNode) {
  return [
    node.asset?.version?.content,
    node.resultOutput,
    nodeEnergonOutput(node),
  ];
}

function storyboardGridAspectRatio(node: SpaceCanvasNode) {
  const values = node.composerDraft?.paramValues || {};
  return firstNonEmptyText(
    values.aspectRatio,
    values.aspect_ratio,
    values.ratio,
  );
}

function fixedTiptapRichDocumentFromNode(node: SpaceCanvasNode) {
  return firstTiptapRichDocument(
    node.asset?.version?.content,
    node.resultOutput,
  );
}

function firstTiptapRichDocument(...values: any[]) {
  for (const value of values) {
    const rich = fixedTiptapRichDocument(value);
    if (rich) {
      return rich;
    }
  }
  return null;
}

function firstDisplayOutput(...values: any[]) {
  for (const value of values) {
    const output = normalizeEnergonDisplayOutput(value);
    if (hasDisplayOutput(output)) {
      return output;
    }
  }
  return "";
}

function normalizeEnergonDisplayOutput(value: any): any {
  const parsed = parseMaybeJSON(value);
  const agentResult = parseAgentResultBlock(parsed);
  if (agentResult !== parsed) {
    return normalizeEnergonDisplayOutput(agentResult);
  }
  const protocolOutput = normalizeAgentResultOutputValue?.(parsed) ?? parsed;
  const output = normalizeEnergonDisplayValue(protocolOutput, new Set());
  if (hasDisplayOutput(output)) {
    return output;
  }
  if (protocolOutput !== parsed) {
    const fallbackOutput = normalizeEnergonDisplayValue(parsed, new Set());
    if (hasDisplayOutput(fallbackOutput)) {
      return fallbackOutput;
    }
  }
  const fixedRichOutput = fixedTiptapRichOutput(parsed);
  if (fixedRichOutput) {
    return normalizeEnergonOutput?.(fixedRichOutput) ?? fixedRichOutput;
  }
  const canvasOutput = normalizeDisplayOutputForCanvas(value);
  if (canvasOutput !== parsed && hasDisplayOutput(canvasOutput)) {
    return canvasOutput;
  }
  return "";
}

function normalizeEnergonDisplayValue(value: any, seen: Set<any>): any {
  const parsed = parseMaybeJSON(value);
  const agentResult = parseAgentResultBlock(parsed);
  if (agentResult !== parsed) {
    return normalizeEnergonDisplayValue(agentResult, seen);
  }
  if (typeof parsed === "string") {
    const fixedOutput = fixedRichDisplayOutput(parsed);
    if (hasDisplayOutput(fixedOutput)) {
      return fixedOutput;
    }
    const looseText = looseRichJSONText(parsed);
    if (looseText) {
      return { text: looseText };
    }
    return looksLikeStructuredJSONSnippet(parsed) ? "" : parsed;
  }
  if (Array.isArray(parsed)) {
    const output = parsed
      .map((item) => normalizeEnergonDisplayValue(item, seen))
      .filter(hasDisplayOutput);
    return output.length > 0 ? output : "";
  }
  if (!parsed || typeof parsed !== "object") {
    return parsed;
  }
  if (isRichDocumentLike(parsed)) {
    const embeddedOutput = embeddedStructuredDisplayOutput(parsed);
    if (embeddedOutput !== undefined) {
      return normalizeEnergonDisplayValue(embeddedOutput, seen);
    }
    const markdownText = plainMarkdownTextFromRichDocument(parsed);
    if (markdownText) {
      return { text: markdownText };
    }
    const rich = fixedTiptapRichDocument(parsed) || safeRichDocument(parsed);
    return rich ? { rich } : parsed;
  }
  if (seen.has(parsed)) {
    return "";
  }
  seen.add(parsed);

  if (isAgentResultPayload(parsed)) {
    return normalizeAgentResultPayloadForEnergon(parsed);
  }

  if (isDirectEnergonOutputObject(parsed)) {
    return parsed;
  }

  for (const key of ["output", "result", "data", "content", "json", "value"]) {
    if (!(key in parsed)) {
      continue;
    }
    const output = normalizeEnergonDisplayValue(parsed[key], seen);
    if (hasDisplayOutput(output)) {
      return output;
    }
  }

  const payloadRich = richDocumentFromPayload(parsed as Record<string, any>);
  if (payloadRich) {
    const output = { rich: payloadRich };
    return normalizeEnergonOutput?.(output) ?? output;
  }

  const rich = safeRichDocument(parsed);
  if (rich) {
    return { rich };
  }
  const fixedRichOutput = fixedTiptapRichOutput(parsed);
  if (fixedRichOutput) {
    return normalizeEnergonOutput?.(fixedRichOutput) ?? fixedRichOutput;
  }

  const extracted = extractDisplayOutput(parsed);
  if (extracted !== parsed) {
    return normalizeEnergonDisplayValue(extracted, seen);
  }

  if (isAgentResultPayloadObject(parsed)) {
    return normalizeAgentResultPayloadForEnergon(parsed);
  }
  if (isRunEnvelope(parsed)) {
    const text = firstNonEmptyText(parsed.message, parsed.error, parsed.status);
    return text ? { text } : "";
  }
  return hasMeaningfulObjectOutput(parsed) ? parsed : "";
}

function isAgentResultPayloadObject(value: any) {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (value.format ||
      value.result_mode ||
      value.rich ||
      value.images ||
      value.videos ||
      value.audios ||
      value.files)
  );
}

function normalizeAgentResultPayloadForEnergon(value: Record<string, any>) {
  const result: Record<string, any> = {};
  const content = parseMaybeJSON(value.content);
  if (content && typeof content === "object" && !Array.isArray(content)) {
    copyEnergonOutputFields(result, content);
  }
  copyEnergonOutputFields(result, value);
  const text = agentResultPayloadText(value);
  if (text) {
    result.text = text;
  }
  if (!hasDisplayOutput(result) && content && typeof content === "object") {
    return content;
  }
  return hasMeaningfulObjectOutput(result) ? result : "";
}

function agentResultPayloadText(value: Record<string, any>) {
  const direct = firstNonEmptyText(value.text);
  if (direct) {
    return direct;
  }
  const content = parseMaybeJSON(value.content);
  if (typeof content === "string") {
    return content.trim();
  }
  if (content && typeof content === "object" && !Array.isArray(content)) {
    return firstNonEmptyText((content as Record<string, any>).text);
  }
  return "";
}

function normalizeDisplayOutputForCanvas(value: any): any {
  const agentResult = parseAgentResultBlock(value);
  if (agentResult !== value) {
    return normalizeDisplayOutputForCanvas(agentResult);
  }
  const fixedRichOutput = fixedTiptapRichOutput(value);
  if (fixedRichOutput) {
    return fixedRichOutput;
  }
  const fixedOutput = fixedRichDisplayOutput(value);
  if (hasDisplayOutput(fixedOutput)) {
    return fixedOutput;
  }
  const parsed = parseMaybeJSON(value);
  const rich = safeRichDocument(parsed);
  if (rich) {
    return { rich };
  }
  const extracted = extractDisplayOutput(parsed);
  if (extracted !== parsed) {
    const extractedRich = safeRichDocument(extracted);
    return extractedRich ? { rich: extractedRich } : extracted;
  }
  return parsed;
}

function fixedTiptapRichOutput(value: any): { rich: any } | null {
  const rich = fixedTiptapRichDocument(value);
  return rich ? { rich } : null;
}

function fixedTiptapRichDocument(value: any, seen = new Set<any>()): any {
  const parsed = parseMaybeJSON(value);
  const agentResult = parseAgentResultBlock(parsed);
  if (agentResult !== parsed) {
    return fixedTiptapRichDocument(agentResult, seen);
  }
  if (Array.isArray(parsed)) {
    if (seen.has(parsed)) {
      return null;
    }
    seen.add(parsed);
    for (const item of parsed) {
      const rich = fixedTiptapRichDocument(item, seen);
      if (rich) {
        return rich;
      }
    }
    return null;
  }
  if (!parsed || typeof parsed !== "object") {
    return null;
  }
  if (seen.has(parsed)) {
    return null;
  }
  seen.add(parsed);
  if (isRichDocumentLike(parsed)) {
    return fixedTiptapRichDocumentFromTextDoc(parsed, seen) || parsed;
  }
  const row = parsed as Record<string, any>;
  const candidates = [
    valueAtPath(row, ["output", "content", "rich"]),
    valueAtPath(row, ["output", "rich"]),
    valueAtPath(row, ["content", "rich"]),
    row.content,
    row.rich,
    row.text,
    row.summary,
  ];
  for (const candidate of candidates) {
    if (candidate === parsed) {
      continue;
    }
    const rich = fixedTiptapRichDocument(candidate, seen);
    if (rich) {
      return rich;
    }
  }
  return null;
}

function fixedTiptapRichDocumentFromTextDoc(doc: any, seen: Set<any>): any {
  const texts = collectTiptapTextValues(doc);
  for (const text of texts) {
    const rich = fixedTiptapRichDocumentFromStructuredText(text, seen);
    if (rich) {
      return rich;
    }
  }
  return fixedTiptapRichDocumentFromStructuredText(texts.join(""), seen);
}

function fixedTiptapRichDocumentFromStructuredText(
  value: string,
  seen: Set<any>,
): any {
  const text = String(value || "").trim();
  if (!looksLikeStructuredJSONSnippet(text)) {
    return null;
  }
  const parsedText = parseMaybeEmbeddedJSON(text);
  if (parsedText === text || parsedText === value) {
    return null;
  }
  return fixedTiptapRichDocument(parsedText, seen);
}

function collectTiptapText(value: any): string {
  return collectTiptapTextValues(value).join("");
}

function collectTiptapTextValues(value: any, seen = new Set<any>()): string[] {
  if (!value) {
    return [];
  }
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectTiptapTextValues(item, seen));
  }
  if (typeof value !== "object") {
    return [];
  }
  if (seen.has(value)) {
    return [];
  }
  seen.add(value);
  const values: string[] = [];
  if (typeof value.text === "string") {
    values.push(value.text);
  }
  if (Array.isArray(value.content)) {
    values.push(...collectTiptapTextValues(value.content, seen));
  }
  return values;
}

function fixedRichDisplayOutput(value: any): any {
  const rich = fixedRichDocument(value);
  if (rich) {
    return { rich };
  }
  const parsed = parseMaybeJSON(value);
  if (!parsed) {
    return "";
  }
  if (typeof parsed === "string") {
    const looseText = looseRichJSONText(parsed);
    return looseText ? { text: looseText } : "";
  }
  return "";
}

function fixedRichDocument(
  value: any,
  seen = new Set<any>(),
): ReturnType<typeof richDocument> {
  const parsed = parseMaybeJSON(value);
  if (isRichDocumentLike(parsed)) {
    return fixedTiptapRichDocumentFromTextDoc(parsed, seen) || parsed;
  }
  if (Array.isArray(parsed)) {
    return safeRichDocument(normalizeDisplayOutput(parsed));
  }
  if (!parsed || typeof parsed !== "object") {
    return null;
  }
  if (seen.has(parsed)) {
    return null;
  }
  seen.add(parsed);

  const row = parsed as Record<string, any>;
  const payloadRich = richDocumentFromPayload(row);
  if (payloadRich) {
    return payloadRich;
  }

  const fixedCandidates = [
    valueAtPath(row, ["output", "content", "rich"]),
    valueAtPath(row, ["output", "content"]),
    valueAtPath(row, ["output", "rich"]),
    valueAtPath(row, ["content", "output", "content", "rich"]),
    valueAtPath(row, ["content", "output", "content"]),
    valueAtPath(row, ["content", "rich"]),
    valueAtPath(row, ["data", "output", "content", "rich"]),
    valueAtPath(row, ["data", "output", "content"]),
    valueAtPath(row, ["data", "content", "rich"]),
    row.rich,
    row.output,
    row.result,
    row.content,
    row.data,
    row.value,
    row.json,
    row.text,
    row.message,
  ];

  for (const candidate of fixedCandidates) {
    if (candidate == null || candidate === parsed) {
      continue;
    }
    const candidateRich = fixedRichDocument(candidate, seen);
    if (candidateRich) {
      return candidateRich;
    }
  }

  for (const [key, candidate] of Object.entries(row)) {
    if (
      !isLikelyNestedResultKey(key) ||
      !candidate ||
      typeof candidate !== "object"
    ) {
      continue;
    }
    const candidateRich = fixedRichDocument(candidate, seen);
    if (candidateRich) {
      return candidateRich;
    }
  }

  return null;
}

function richDocumentFromPayload(
  payload: Record<string, any>,
): ReturnType<typeof richDocument> {
  if (isRichDocumentLike(payload)) {
    return payload;
  }
  if (
    Array.isArray(payload.content) &&
    (String(payload.format || "").toLowerCase() === "rich_json" ||
      String(payload.content?.format || "").toLowerCase() === "rich_json" ||
      payload.type === undefined)
  ) {
    return safeRichDocument({
      type: "doc",
      content: payload.content,
    });
  }
  if (
    (String(payload.format || "").toLowerCase() === "rich_json" ||
      String(payload.content?.format || "").toLowerCase() === "rich_json") &&
    payload.rich != null
  ) {
    return fixedRichDocument(payload.rich);
  }
  if (
    (String(payload.format || "").toLowerCase() === "rich_json" ||
      String(payload.content?.format || "").toLowerCase() === "rich_json") &&
    payload.content?.rich != null
  ) {
    return fixedRichDocument(payload.content.rich);
  }
  return null;
}

function isRichDocumentLike(
  value: any,
): value is NonNullable<ReturnType<typeof richDocument>> {
  return Boolean(
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    value.type === "doc" &&
    Array.isArray(value.content),
  );
}

function copyEnergonOutputFields(
  target: Record<string, any>,
  source: Record<string, any>,
) {
  for (const key of [
    "format",
    "title",
    "text",
    "reasoning",
    "rich",
    "images",
    "videos",
    "audios",
    "files",
    "json",
    "error",
    "progress",
    "meta",
  ]) {
    if (hasDisplayOutput(source[key])) {
      target[key] =
        key === "rich" ? normalizeEnergonRichValue(source[key]) : source[key];
    }
  }
}

function normalizeEnergonRichValue(value: any) {
  const rich =
    fixedRichDocument(value) ||
    safeRichDocument(normalizeDisplayOutput(value)) ||
    safeRichDocument(value);
  return rich || value;
}

function hasMeaningfulObjectOutput(value: Record<string, any>) {
  return Object.entries(value).some(([key, item]) => {
    if (key.startsWith("_") || key === "format") {
      return false;
    }
    return hasDisplayOutput(item);
  });
}

function isDirectEnergonOutputObject(value: any) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  if (
    "output" in value ||
    "result" in value ||
    "data" in value ||
    "content" in value ||
    "kind" in value ||
    "event" in value
  ) {
    return false;
  }
  return [
    "text",
    "rich",
    "images",
    "videos",
    "audios",
    "files",
    "json",
    "error",
  ].some((key) => hasDisplayOutput(value[key]));
}

function hasDisplayOutput(value: any): boolean {
  if (value == null || value === "") {
    return false;
  }
  if (typeof value === "string") {
    const text = value.trim();
    return (
      text.length > 0 &&
      !looksLikeStructuredJSONSnippet(text) &&
      !isNonContentText(text)
    );
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.some(hasDisplayOutput);
  }
  if (typeof value !== "object") {
    return false;
  }
  if (fixedRichDocument(value)) {
    return true;
  }
  if (isRunEnvelope(value as Record<string, any>)) {
    return false;
  }
  return hasMeaningfulObjectOutput(value);
}

function nodeDisplayText(node: SpaceCanvasNode) {
  return displayTextFromOutput(
    nodeContextOutput(node),
    node.description || node.title,
  );
}

function richDocumentFromNode(node: SpaceCanvasNode) {
  const candidates = [
    nodeContextOutput(node),
    node.asset?.version?.content,
    node.description,
  ];
  for (const candidate of candidates) {
    const rich =
      fixedRichDocument(candidate) ||
      safeRichDocument(normalizeDisplayOutputForCanvas(candidate)) ||
      safeRichDocument(extractDisplayOutput(candidate)) ||
      safeRichDocument(candidate);
    if (rich) {
      return rich;
    }
  }
  return null;
}

function displayTextFromOutput(value: any, fallback = "") {
  const output = extractDisplayOutput(value);
  const rich = safeRichDocument(output);
  const richText = rich ? safeDocumentText(rich).trim() : "";
  if (richText && !isNonContentText(richText)) {
    return richText;
  }

  const text = safeDocumentText(output).trim();
  if (isNonContentText(text)) {
    return "";
  }
  const looseText = looseRichJSONText(text);
  if (looseText) {
    return looseText;
  }
  if (text && !looksLikeStructuredJSONSnippet(text)) {
    return text;
  }
  if (looksLikeJSONText(text)) {
    const parsedText = safeDocumentText(
      extractDisplayOutput(parseMaybeJSON(text)),
    ).trim();
    if (parsedText && parsedText !== text && !isNonContentText(parsedText)) {
      return parsedText;
    }
  }

  const fallbackText = String(fallback || "").trim();
  if (isNonContentText(fallbackText)) {
    return "";
  }
  const looseFallbackText = looseRichJSONText(fallbackText);
  if (looseFallbackText) {
    return looseFallbackText;
  }
  if (!looksLikeStructuredJSONSnippet(fallbackText)) {
    return fallbackText;
  }
  const parsedFallbackText = safeDocumentText(
    extractDisplayOutput(parseMaybeJSON(fallbackText)),
  ).trim();
  return parsedFallbackText &&
    parsedFallbackText !== fallbackText &&
    !isNonContentText(parsedFallbackText)
    ? parsedFallbackText
    : "";
}

function isNonContentText(text: string) {
  const normalized = text.trim();
  if (!normalized) {
    return false;
  }
  return (
    isEmptyPlaceholderText(normalized) || isTransientAssistantText(normalized)
  );
}

function isEmptyPlaceholderText(text: string) {
  const normalized = text.trim();
  return normalized === "map[]" || normalized === "<nil>";
}

function isTransientAssistantText(text: string) {
  const normalized = text.trim();
  if (!normalized) {
    return false;
  }
  return /^(i\s+(will|ll|'ll)\s+(start|begin)|let'?s\s+(list|check|inspect)|first,\s*i\s+(will|ll|'ll)|i'?m\s+going\s+to\s+(check|inspect))/i.test(
    normalized,
  );
}

function generatedPreviewFromValue(
  value: any,
  kind: string,
): GeneratedNodePreview {
  const preview: GeneratedNodePreview = {
    text: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: "",
    fileUrl: "",
  };
  const normalizedValue = extractDisplayOutput(value);
  fillGeneratedPreview(preview, normalizedValue, kind);
  if (!hasGeneratedPreview(preview) && normalizedValue !== value) {
    fillGeneratedPreview(preview, value, kind);
  }
  if (
    hasResultPreviewMedia(preview) &&
    looksLikeStructuredJSONSnippet(preview.text)
  ) {
    preview.text = "";
  }
  return preview;
}

function mergeGeneratedPreview(
  primary: GeneratedNodePreview,
  fallback: GeneratedNodePreview,
): GeneratedNodePreview {
  return {
    text: firstNonEmptyText(primary.text, fallback.text),
    imageUrl: primary.imageUrl || fallback.imageUrl,
    videoUrl: primary.videoUrl || fallback.videoUrl,
    audioUrl: primary.audioUrl || fallback.audioUrl,
    fileUrl: primary.fileUrl || fallback.fileUrl,
  };
}

function fillGeneratedPreview(
  preview: GeneratedNodePreview,
  value: any,
  kind: string,
  seen: Set<any> = new Set(),
  depth = 0,
) {
  if (depth > 12) {
    return;
  }
  if (value == null) {
    return;
  }
  if (typeof value === "string") {
    setPreviewString(preview, value, kind);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      fillGeneratedPreview(preview, item, kind, seen, depth + 1);
      if (hasResultPreviewMedia(preview)) {
        return;
      }
    }
    return;
  }
  if (typeof value !== "object") {
    preview.text = String(value);
    return;
  }
  if (seen.has(value)) {
    return;
  }
  seen.add(value);

  const row = value as Record<string, any>;
  const mediaUrl = fillGeneratedPreviewMedia(preview, row, kind);
  const displayText = displayTextFromOutput(value, "");
  if (displayText && displayText !== mediaUrl && !looksLikeURL(displayText)) {
    preview.text ||= displayText;
  }
  const genericUrl = firstMediaURLText(row.url, row.src, row.href);
  if (genericUrl && genericUrl !== mediaUrl) {
    setPreviewString(preview, genericUrl, kind);
  }
  preview.imageUrl ||= firstMediaURLText(
    row.image,
    row.image_url,
    row.imageUrl,
    firstArrayValue(row.images),
    firstArrayValue(row.imageUrls),
  );
  preview.videoUrl ||= firstMediaURLText(
    row.video,
    row.video_url,
    row.videoUrl,
    firstArrayValue(row.videos),
    firstArrayValue(row.videoUrls),
  );
  preview.audioUrl ||= firstMediaURLText(
    row.audio,
    row.audio_url,
    row.audioUrl,
    firstArrayValue(row.audios),
    firstArrayValue(row.audioUrls),
  );
  preview.fileUrl ||= firstMediaURLText(
    row.file,
    row.file_url,
    row.fileUrl,
    firstArrayValue(row.files),
    firstArrayValue(row.fileUrls),
  );

  if (!hasResultPreviewMedia(preview)) {
    for (const key of ["output", "result", "content", "body", "data", "rich"]) {
      if (row[key] && typeof row[key] === "object") {
        fillGeneratedPreview(preview, row[key], kind, seen, depth + 1);
        if (hasResultPreviewMedia(preview)) {
          return;
        }
      }
    }
  }
  if (
    !preview.text &&
    !hasGeneratedPreview(preview) &&
    !isWrappedOutput(row) &&
    hasMeaningfulObjectOutput(row)
  ) {
    try {
      const fallbackText = JSON.stringify(value, null, 2);
      if (!isEmptyContextText(fallbackText)) {
        preview.text = fallbackText;
      }
    } catch {
      const fallbackText = String(value);
      if (!isEmptyContextText(fallbackText)) {
        preview.text = fallbackText;
      }
    }
  }
}

function fillGeneratedPreviewMedia(
  preview: GeneratedNodePreview,
  row: Record<string, any>,
  kind: string,
) {
  const mediaKind = firstPreviewMediaKind(
    kind,
    row.kind,
    row.media_kind,
    row.mediaKind,
    row.media_type,
    row.mediaType,
    row.type,
    row.name,
  );
  if (!mediaKind) {
    return "";
  }
  const mediaUrl = firstMediaURLText(...mediaCandidatesForKind(row, mediaKind));
  if (!mediaUrl) {
    return "";
  }
  if (mediaKind === "image") preview.imageUrl ||= mediaUrl;
  if (mediaKind === "video") preview.videoUrl ||= mediaUrl;
  if (mediaKind === "audio") preview.audioUrl ||= mediaUrl;
  if (mediaKind === "file") preview.fileUrl ||= mediaUrl;
  return mediaUrl;
}

function previewKindFromOutput(value: unknown): string {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "";
  }
  const row = value as Record<string, any>;
  return firstPreviewMediaKind(
    row.kind,
    row.media_kind,
    row.mediaKind,
    row.media_type,
    row.mediaType,
    row.type,
    row.name,
  );
}

function firstPreviewMediaKind(...values: any[]) {
  for (const value of values) {
    const kind = normalizePreviewMediaKind(String(value || ""));
    if (kind) {
      return kind;
    }
  }
  return "";
}

function normalizePreviewMediaKind(kind: string) {
  const normalized = kind.trim().toLowerCase();
  if (
    normalized === "image" ||
    normalized === "images" ||
    normalized === "picture" ||
    normalized === "pictures" ||
    normalized === "mediaimage" ||
    normalized === "editor media image" ||
    normalized === "editormediaimage" ||
    normalized.includes("image") ||
    normalized === "图片" ||
    normalized === "图像"
  ) {
    return "image";
  }
  if (
    normalized === "video" ||
    normalized === "videos" ||
    normalized === "mediavideo" ||
    normalized === "editor media video" ||
    normalized === "editormediavideo" ||
    normalized.includes("video") ||
    normalized === "视频"
  ) {
    return "video";
  }
  if (
    normalized === "audio" ||
    normalized === "audios" ||
    normalized === "music" ||
    normalized === "voice" ||
    normalized === "mediaaudio" ||
    normalized === "editor media audio" ||
    normalized === "editormediaaudio" ||
    normalized.includes("audio") ||
    normalized === "音频" ||
    normalized === "音乐" ||
    normalized === "语音"
  ) {
    return "audio";
  }
  if (
    normalized === "file" ||
    normalized === "files" ||
    normalized === "attachment" ||
    normalized === "attachments" ||
    normalized === "mediafile" ||
    normalized === "editorfile" ||
    normalized === "editor media file" ||
    normalized === "editormediafile" ||
    normalized === "文件" ||
    normalized === "附件"
  ) {
    return "file";
  }
  return "";
}

function mediaCandidatesForKind(
  row: Record<string, any>,
  kind: "image" | "video" | "audio" | "file",
) {
  const common = [
    row.url,
    row.src,
    row.href,
    row.path,
    row.file_url,
    row.fileUrl,
    row.text,
    row.content,
    row.value,
    valueAtPath(row, ["attrs", "src"]),
    valueAtPath(row, ["attrs", "url"]),
    valueAtPath(row, ["attrs", "href"]),
  ];
  if (kind === "image") {
    return [
      row.image,
      row.image_url,
      row.imageUrl,
      firstArrayValue(row.images),
      firstArrayValue(row.imageUrls),
      ...common,
    ];
  }
  if (kind === "video") {
    return [
      row.video,
      row.video_url,
      row.videoUrl,
      firstArrayValue(row.videos),
      firstArrayValue(row.videoUrls),
      ...common,
    ];
  }
  if (kind === "audio") {
    return [
      row.audio,
      row.audio_url,
      row.audioUrl,
      firstArrayValue(row.audios),
      firstArrayValue(row.audioUrls),
      ...common,
    ];
  }
  return [
    row.file,
    row.file_url,
    row.fileUrl,
    firstArrayValue(row.files),
    firstArrayValue(row.fileUrls),
    ...common,
  ];
}

function setPreviewString(
  preview: GeneratedNodePreview,
  value: string,
  kind: string,
) {
  const text = value.trim();
  if (!text) {
    return;
  }
  if (isNonContentText(text)) {
    return;
  }
  if (looksLikeJSONText(text)) {
    const parsed = parseMaybeJSON(text);
    if (parsed !== text) {
      fillGeneratedPreview(preview, parsed, kind);
      if (hasResultPreviewMedia(preview)) {
        return;
      }
    }
    const parsedText = displayTextFromOutput(parsed, "");
    if (parsedText && !looksLikeURL(parsedText)) {
      preview.text ||= parsedText;
    }
    return;
  }
  const looseText = looseRichJSONText(text);
  if (looseText) {
    preview.text ||= looseText;
    return;
  }
  const documentTextValue = safeDocumentText(text);
  if (documentTextValue && documentTextValue !== text) {
    preview.text ||= documentTextValue;
    return;
  }
  const markdownMedia = firstMarkdownMediaPreview(text, kind);
  if (markdownMedia) {
    setPreviewMedia(preview, markdownMedia.kind, markdownMedia.url);
    preview.text ||= markdownMedia.caption;
    return;
  }
  if (looksLikeURL(text)) {
    const normalizedKind = normalizePreviewMediaKind(kind);
    if (
      normalizedKind === "image" ||
      /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(text)
    ) {
      preview.imageUrl ||= text;
      return;
    }
    if (
      normalizedKind === "video" ||
      /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(text)
    ) {
      preview.videoUrl ||= text;
      return;
    }
    if (
      normalizedKind === "audio" ||
      /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(text)
    ) {
      preview.audioUrl ||= text;
      return;
    }
    preview.fileUrl ||= text;
    return;
  }
  preview.text ||= text;
}

function firstMarkdownMediaPreview(text: string, kind: string) {
  const hintedKind = previewKindFromTextHint(text, kind);
  const imageMatch = text.match(
    /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/,
  );
  if (imageMatch) {
    const url = cleanMarkdownURL(imageMatch[2]);
    if (url) {
      return {
        kind: "image" as const,
        url,
        caption: markdownMediaCaption(text, imageMatch[0], imageMatch[1]),
      };
    }
  }
  const looseImageMatch = text.match(
    /!\[[^\]]*]\(\s*<?((?:https?:\/\/|data:|blob:)[^\s<>)]+)/i,
  );
  if (looseImageMatch) {
    const url = cleanMarkdownURL(looseImageMatch[1]);
    if (url) {
      return {
        kind: "image" as const,
        url,
        caption: markdownMediaCaption(text, looseImageMatch[0], ""),
      };
    }
  }

  const linkPattern =
    /\[([^\]]+)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;
  let linkMatch: RegExpExecArray | null;
  while ((linkMatch = linkPattern.exec(text))) {
    const url = cleanMarkdownURL(linkMatch[2]);
    const mediaKind = previewMediaKindFromURL(url, hintedKind);
    if (mediaKind) {
      return {
        kind: mediaKind,
        url,
        caption: markdownMediaCaption(text, linkMatch[0], linkMatch[1]),
      };
    }
  }

  const inlineURL = firstInlineURL(text);
  const mediaKind = previewMediaKindFromURL(inlineURL, hintedKind);
  if (mediaKind) {
    return {
      kind: mediaKind,
      url: inlineURL,
      caption: markdownMediaCaption(text, inlineURL, ""),
    };
  }
  return null;
}

function previewKindFromTextHint(text: string, kind: string) {
  if (normalizePreviewMediaKind(kind)) {
    return kind;
  }
  return textHasImagePreviewHint(text) ? "image" : kind;
}

function textHasImagePreviewHint(text: string) {
  const imageKeywordURL =
    /(?:图片|图像|image|photo|picture).{0,40}(?:https?:\/\/|data:|blob:)/i;
  return /!\[[^\]]*]\(/.test(text) || imageKeywordURL.test(text);
}

function setPreviewMedia(
  preview: GeneratedNodePreview,
  kind: "image" | "video" | "audio" | "file",
  url: string,
) {
  if (kind === "image") preview.imageUrl ||= url;
  if (kind === "video") preview.videoUrl ||= url;
  if (kind === "audio") preview.audioUrl ||= url;
  if (kind === "file") preview.fileUrl ||= url;
}

function previewMediaKindFromURL(url: string, kind: string) {
  if (!url || !looksLikeURL(url)) {
    return "";
  }
  const normalizedKind = normalizePreviewMediaKind(kind);
  if (
    normalizedKind === "image" ||
    /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(url)
  ) {
    return "image" as const;
  }
  if (normalizedKind === "video" || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url)) {
    return "video" as const;
  }
  if (
    normalizedKind === "audio" ||
    /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(url)
  ) {
    return "audio" as const;
  }
  if (normalizedKind === "file") {
    return "file" as const;
  }
  return "";
}

function markdownMediaCaption(
  text: string,
  matchedText: string,
  label: string,
) {
  const caption = text.replace(matchedText, "").replace(/\s+/g, " ").trim();
  if (caption && caption !== text.trim() && !looksLikeURL(caption)) {
    return caption;
  }
  return String(label || "").trim();
}

function cleanMarkdownURL(value: string) {
  const url = cleanInlineURL(value);
  return looksLikeURL(url) ? url : "";
}

function firstInlineURL(text: string) {
  const match = text.match(/(?:https?:\/\/|data:|blob:)[^\s<>)]+/i);
  return match ? cleanInlineURL(match[0]) : "";
}

function cleanInlineURL(value: string) {
  return String(value || "")
    .trim()
    .replace(/^<|>$/g, "")
    .replace(/[.,，。；;]+$/g, "");
}

function isWrappedOutput(value: Record<string, any>) {
  return Boolean(
    value.output ||
    value.result ||
    value.content ||
    value.rich ||
    value.agent_run_id ||
    value.approval_id,
  );
}

function hasGeneratedPreview(preview: GeneratedNodePreview) {
  const text = String(preview.text || "").trim();
  return Boolean(
    (text && !isEmptyContextText(text)) ||
    preview.imageUrl ||
    preview.videoUrl ||
    preview.audioUrl ||
    preview.fileUrl,
  );
}

function firstMediaText(...values: any[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (value && typeof value === "object") {
      const text = firstNonEmptyText(
        value.url,
        value.src,
        value.href,
        value.path,
        value.file,
        value.file_url,
        value.fileUrl,
        value.image,
        value.image_url,
        value.imageUrl,
        value.video,
        value.video_url,
        value.videoUrl,
        value.audio,
        value.audio_url,
        value.audioUrl,
        valueAtPath(value, ["attrs", "src"]),
        valueAtPath(value, ["attrs", "url"]),
        valueAtPath(value, ["attrs", "href"]),
      );
      if (text) {
        return text;
      }
    }
  }
  return "";
}

function firstMediaURLText(...values: any[]) {
  const text = firstMediaText(...values);
  return looksLikeURL(text) ? text : "";
}

function firstArrayValue(value: any) {
  return Array.isArray(value) ? value[0] : undefined;
}

function looksLikeURL(text: string) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(text);
}

function flowPositionFromScreen(
  flow: FlowViewport | null,
  screen: CanvasPoint,
) {
  if (flow?.screenToFlowPosition) {
    return flow.screenToFlowPosition(screen);
  }
  if (flow?.project) {
    return flow.project(screen);
  }
  return screen;
}

function cloneCanvasNode(
  node: SpaceCanvasNode,
  assetCateId: number,
  index: number,
  position?: CanvasPoint,
): SpaceCanvasNode {
  const x = position?.x ?? node.x + 34;
  const y = position?.y ?? node.y + 34;
  return {
    ...node,
    id: `local-${node.type}-${Date.now()}-${index}`,
    nodeNo: undefined,
    title: `${node.title} 副本`,
    titleMode: "manual",
    x,
    y,
    assetCateId: node.assetCateId || assetCateId,
    group:
      node.type === "group" && node.group?.origin === "script"
        ? { origin: "manual" }
        : node.group,
    storyboardItem: undefined,
    storyboardMaterializedSignature: undefined,
    local: true,
  };
}

function buildCanvasRenderIndex(
  nodes: SpaceCanvasNode[],
  edges: SpaceCanvasEdge[],
): CanvasRenderIndex {
  const nodeLookup = buildCanvasNodeLookupIndex(nodes);
  const connectionIndex = buildCanvasConnectionIndex(
    nodes,
    edges,
    nodeLookup,
  );
  const hasResult = (node: SpaceCanvasNode) =>
    nodeLookup.hasResultByNodeId.get(node.id) || false;
  return {
    ...nodeLookup,
    ...connectionIndex,
    runBlockedReasonByNodeId: new Map(
      nodes.map((node) => [
        node.id,
        storyboardRunBlockedReason({
          targets:
            node.type === "group"
              ? nodeLookup.groupMembersById.get(node.id) || []
              : [node],
          nodesByID: nodeLookup.nodeById,
          hasResult,
        }),
      ]),
    ),
    highlightedPathEdgesByNodeId: buildHighlightedCanvasPathIndex(
      nodeLookup.nodeById,
      edges,
    ),
  };
}

function buildCanvasNodeLookupIndex(
  nodes: SpaceCanvasNode[],
): CanvasNodeLookupIndex {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const hasResultByNodeId = new Map(
    nodes.map((node) => [node.id, nodeHasResultContent(node)]),
  );
  const groupMembersById = new Map<string, SpaceCanvasNode[]>();
  for (const node of nodes) {
    if (!node.groupId) {
      continue;
    }
    const members = groupMembersById.get(node.groupId) || [];
    members.push(node);
    groupMembersById.set(node.groupId, members);
  }
  return { nodeById, groupMembersById, hasResultByNodeId };
}

function buildCanvasConnectionIndex(
  nodes: SpaceCanvasNode[],
  edges: SpaceCanvasEdge[],
  nodeLookup: CanvasNodeLookupIndex,
  onlyTargetNodeId = "",
): CanvasConnectionIndex {
  const { nodeById, groupMembersById, hasResultByNodeId } = nodeLookup;
  const connectionSourceNodes = (sourceNodeId: string) => {
    const source = nodeById.get(sourceNodeId);
    if (!source) {
      return [];
    }
    return source.type === "group"
      ? groupMembersById.get(source.id) || []
      : [source];
  };
  const contextSourceNodeIds = new Set<string>();
  for (const edge of edges) {
    const endpoints = canvasEdgeNodeIDs(edge);
    if (onlyTargetNodeId && endpoints.targetNodeId !== onlyTargetNodeId) {
      continue;
    }
    const { sourceNodeId } = endpoints;
    for (const sourceNode of connectionSourceNodes(sourceNodeId)) {
      contextSourceNodeIds.add(sourceNode.id);
    }
  }
  const contextSourceByNodeId = new Map<
    string,
    NodeInputContext["sources"][number]
  >();
  for (const node of nodes) {
    if (contextSourceNodeIds.has(node.id)) {
      const source = nodeInputContextSource(
        node,
        hasResultByNodeId.get(node.id) || false,
      );
      if (source && nodeInputContextLine(source).trim() !== "") {
        contextSourceByNodeId.set(node.id, source);
      }
    }
  }
  const sourcesByTargetId = new Map<string, NodeInputContext["sources"]>();
  const incomingMediaReferencesByNodeId = new Map<
    string,
    CanvasConnectedMediaReference[]
  >();
  const contextSourceIdsByTargetId = new Map<string, Set<string>>();
  for (const edge of edges) {
    const { sourceNodeId, targetNodeId } = canvasEdgeNodeIDs(edge);
    if (
      (onlyTargetNodeId && targetNodeId !== onlyTargetNodeId) ||
      !nodeById.has(targetNodeId)
    ) {
      continue;
    }
    for (const sourceNode of connectionSourceNodes(sourceNodeId)) {
      if (
        canvasEdgeCarriesMedia(edge) &&
        isCanvasMediaReferenceNode(sourceNode)
      ) {
        const references =
          incomingMediaReferencesByNodeId.get(targetNodeId) || [];
        references.push({ edge, source: sourceNode });
        incomingMediaReferencesByNodeId.set(targetNodeId, references);
      }
      const source = contextSourceByNodeId.get(sourceNode.id);
      const usedSourceIds =
        contextSourceIdsByTargetId.get(targetNodeId) || new Set<string>();
      if (!source || usedSourceIds.has(sourceNode.id)) {
        continue;
      }
      usedSourceIds.add(sourceNode.id);
      contextSourceIdsByTargetId.set(targetNodeId, usedSourceIds);
      const sources = sourcesByTargetId.get(targetNodeId) || [];
      sources.push(source);
      sourcesByTargetId.set(targetNodeId, sources);
    }
  }
  const inputContextByNodeId = new Map<string, NodeInputContext>();
  for (const [nodeId, sources] of sourcesByTargetId) {
    inputContextByNodeId.set(nodeId, {
      sources,
      text: sources.map(nodeInputContextLine).join("\n\n"),
    });
  }
  return {
    inputContextByNodeId,
    incomingMediaReferencesByNodeId,
  };
}

function canvasEdgeNodeIDs(edge: SpaceCanvasEdge) {
  return {
    sourceNodeId: edge.logicalFrom || edge.from,
    targetNodeId: edge.logicalTo || edge.to,
  };
}

function canvasIncomingMediaConnections(
  nodes: SpaceCanvasNode[],
  edges: SpaceCanvasEdge[],
  targetNodeId: string,
): CanvasConnectedMediaReference[] {
  const result: CanvasConnectedMediaReference[] = [];
  for (const edge of edges) {
    if (!canvasEdgeCarriesMedia(edge)) {
      continue;
    }
    const endpoints = canvasEdgeNodeIDs(edge);
    if (endpoints.targetNodeId !== targetNodeId) {
      continue;
    }
    for (const source of canvasConnectionSourceNodes(
      nodes,
      endpoints.sourceNodeId,
    )) {
      if (isCanvasMediaReferenceNode(source)) {
        result.push({ edge, source });
      }
    }
  }
  return result;
}

function buildNodeInputContext(
  nodeId: string,
  nodes: SpaceCanvasNode[],
  edges: SpaceCanvasEdge[],
): NodeInputContext | null {
  const nodeLookup = buildCanvasNodeLookupIndex(nodes);
  return (
    buildCanvasConnectionIndex(nodes, edges, nodeLookup, nodeId)
      .inputContextByNodeId.get(nodeId) || null
  );
}

function nodeInputContextSource(node: SpaceCanvasNode, hasResult: boolean) {
  if (!hasResult) {
    return null;
  }
  const output = nodeContextOutput(node);
  const preview = generatedPreviewFromValue(
    output,
    nodePreviewKind(node, output),
  );
  if (!hasGeneratedPreview(preview)) {
    preview.text = displayTextFromOutput(
      output,
      node.description || node.title,
    );
  }
  return {
    nodeId: node.id,
    title: node.title,
    type: node.type,
    output,
    preview,
    resultRef: node.resultRef,
  };
}

function sameNodeInputContext(
  left: NodeInputContext | null | undefined,
  right: NodeInputContext | null | undefined,
) {
  if (left === right) {
    return true;
  }
  if (!left || !right || left.text !== right.text) {
    return false;
  }
  return (
    left.sources.length === right.sources.length &&
    left.sources.every((source, index) => {
      const candidate = right.sources[index];
      return (
        source.nodeId === candidate.nodeId &&
        source.title === candidate.title &&
        source.type === candidate.type &&
        source.output === candidate.output &&
        source.resultRef === candidate.resultRef &&
        source.preview.text === candidate.preview.text &&
        source.preview.imageUrl === candidate.preview.imageUrl &&
        source.preview.videoUrl === candidate.preview.videoUrl &&
        source.preview.audioUrl === candidate.preview.audioUrl &&
        source.preview.fileUrl === candidate.preview.fileUrl
      );
    })
  );
}

function nodeInputContextLine(source: NodeInputContext["sources"][number]) {
  const preview = source.preview;
  const text =
    preview.text ||
    preview.imageUrl ||
    preview.videoUrl ||
    preview.audioUrl ||
    preview.fileUrl ||
    stringifyContextValue(source.output);
  if (!String(text || "").trim()) {
    return "";
  }
  return `[${source.title}]\n${text}`;
}

function nodeContextOutput(node: SpaceCanvasNode) {
  return firstMeaningfulNodeOutput(
    preferRicherMediaOutput(node.asset?.version?.content, node.resultOutput),
  );
}

function firstMeaningfulNodeOutput(...values: any[]) {
  let fallback: any;
  for (const value of values) {
    if (value == null) {
      continue;
    }
    if (fallback === undefined) {
      fallback = value;
    }
    const embeddedOutput = embeddedStructuredDisplayOutput(value);
    if (embeddedOutput !== undefined) {
      return embeddedOutput;
    }
    const markdownText = plainMarkdownTextFromRichDocument(value);
    if (markdownText) {
      return { text: markdownText };
    }
    const output = firstDisplayOutput(value) || extractDisplayOutput(value);
    if (hasDisplayOutput(output) || hasContextOutput(output)) {
      return output;
    }
  }
  if (fallback !== undefined) {
    return firstDisplayOutput(fallback) || extractDisplayOutput(fallback);
  }
  return undefined;
}

function embeddedStructuredDisplayOutput(value: any) {
  const parsed = parseMaybeJSON(value);
  const rich = isRichDocumentLike(parsed) ? parsed : fixedRichDocument(parsed);
  if (!rich) {
    return undefined;
  }
  const richText = collectTiptapText(rich).trim();
  if (!looksLikeStructuredJSONSnippet(richText)) {
    return undefined;
  }
  const embedded = parseMaybeEmbeddedJSON(richText);
  if (embedded === richText) {
    return undefined;
  }
  const normalized = extractDisplayOutput(embedded);
  if (hasDisplayOutput(normalized) || hasContextOutput(normalized)) {
    return normalized;
  }
  return undefined;
}

function plainMarkdownTextFromRichDocument(value: any) {
  const parsed = parseMaybeJSON(value);
  const rich = isRichDocumentLike(parsed) ? parsed : fixedRichDocument(parsed);
  return plainMarkdownTextFromRichOutput(rich);
}

function extractDisplayOutput(value: any): any {
  const parsed = parseMaybeJSON(value);
  const agentResult = parseAgentResultBlock(parsed);
  if (agentResult !== parsed) {
    return extractDisplayOutput(agentResult);
  }
  if (isDirectEnergonOutputObject(parsed)) {
    return parsed;
  }
  if (isAgentResultPayload(parsed)) {
    const output = normalizeAgentResultPayloadForEnergon(parsed);
    if (hasDisplayOutput(output)) {
      return output;
    }
  }
  const fixedRichOutput = fixedTiptapRichOutput(parsed);
  if (fixedRichOutput) {
    return fixedRichOutput.rich;
  }
  if (isRichDocumentLike(parsed)) {
    return parsed;
  }
  const rich = fixedRichDocument(parsed);
  if (rich) {
    return rich;
  }
  return normalizeDisplayOutput(extractDisplayOutputInner(parsed, new Set()));
}

function extractDisplayOutputInner(value: any, seen: Set<any>): any {
  if (!value || typeof value !== "object") {
    return value;
  }
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);

  const row = value as Record<string, any>;
  const directRich = directRichOutput(row);
  if (directRich !== undefined) {
    return directRich;
  }

  const nestedNodeOutput = firstNestedNodeOutput(row, seen);
  if (nestedNodeOutput !== undefined) {
    return nestedNodeOutput;
  }

  for (const path of displayOutputPaths) {
    const candidate = valueAtPath(row, path);
    if (candidate === undefined || candidate === value) {
      continue;
    }
    const normalized = extractDisplayOutputInner(
      parseMaybeJSON(candidate),
      seen,
    );
    if (isDisplayOutputValue(normalized)) {
      return normalized;
    }
  }

  if (isRunEnvelope(row)) {
    for (const key of ["output", "result", "data", "body"]) {
      if (row[key] === undefined || row[key] === value) {
        continue;
      }
      const normalized = extractDisplayOutputInner(
        parseMaybeJSON(row[key]),
        seen,
      );
      if (isDisplayOutputValue(normalized)) {
        return normalized;
      }
    }
  }

  return value;
}

function firstNestedNodeOutput(row: Record<string, any>, seen: Set<any>) {
  for (const [key, value] of Object.entries(row)) {
    if (!isLikelyNestedResultKey(key) || !value || typeof value !== "object") {
      continue;
    }
    const normalized = extractDisplayOutputInner(parseMaybeJSON(value), seen);
    if (isDisplayOutputValue(normalized)) {
      return normalized;
    }
  }
  return undefined;
}

function isLikelyNestedResultKey(key: string) {
  return /^(node|step|task|power|agent)[_-]?\d+$/i.test(key);
}

const displayOutputPaths = [
  ["output", "content", "rich"],
  ["output", "content"],
  ["output", "rich"],
  ["content", "output", "content", "rich"],
  ["content", "output", "content"],
  ["content", "output", "rich"],
  ["content", "data", "text"],
  ["content", "data", "content"],
  ["content", "rich"],
  ["content", "text"],
  ["data", "output", "content", "rich"],
  ["data", "output", "content"],
  ["data", "content", "rich"],
  ["data", "content"],
  ["rich"],
] as const;

function directRichOutput(row: Record<string, any>) {
  const payloadRich = richDocumentFromPayload(row);
  if (payloadRich) {
    return payloadRich;
  }
  if (
    String(row.result_mode || "").toLowerCase() === "inline" &&
    row.content != null
  ) {
    const content = parseMaybeJSON(row.content);
    if (content && typeof content === "object") {
      const rich = directRichOutput(content as Record<string, any>);
      if (rich !== undefined) {
        return rich;
      }
    }
  }
  return undefined;
}

function normalizeDisplayOutput(value: any) {
  const parsed = parseMaybeJSON(value);
  if (
    parsed &&
    typeof parsed === "object" &&
    !Array.isArray(parsed) &&
    !parsed.type &&
    Array.isArray(parsed.content)
  ) {
    return {
      type: "doc",
      content: parsed.content,
    };
  }
  if (Array.isArray(parsed)) {
    return {
      type: "doc",
      content: parsed,
    };
  }
  return parsed;
}

function isRunEnvelope(row: Record<string, any>) {
  return Boolean(
    row.agent_run_id ||
    row.approval_id ||
    row.node_run_id ||
    row.request_id ||
    row.approved !== undefined ||
    row.message !== undefined,
  );
}

function isDisplayOutputValue(value: any) {
  if (value == null) {
    return false;
  }
  if (typeof value === "string") {
    const text = value.trim();
    return (
      text.length > 0 &&
      !looksLikeStructuredJSONSnippet(text) &&
      !isNonContentText(text)
    );
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value !== "object") {
    return true;
  }
  if (fixedRichDocument(value) || safeRichDocument(value)) {
    return true;
  }
  if (isRunEnvelope(value as Record<string, any>)) {
    return false;
  }
  const text = safeDocumentText(value).trim();
  return Boolean(text && !isEmptyContextText(text));
}

function valueAtPath(source: Record<string, any>, path: readonly string[]) {
  let current: any = source;
  for (const key of path) {
    if (!current || typeof current !== "object" || !(key in current)) {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

function parseAgentResultBlock(value: any) {
  if (typeof value !== "string") {
    return value;
  }
  const text = value.trim();
  for (const language of ["agent-result", "agent-output", "json"]) {
    const extracted = extractFencedAgentResultPayload(text, language);
    if (extracted !== undefined) {
      return extracted;
    }
  }
  return value;
}

function extractFencedAgentResultPayload(value: string, language: string) {
  const open = `\`\`\`${language}`;
  const start = value.toLowerCase().indexOf(open);
  if (start < 0) {
    return undefined;
  }
  let bodyStart = start + open.length;
  while (bodyStart < value.length && /\s/.test(value[bodyStart] || "")) {
    bodyStart += 1;
  }
  let searchStart = bodyStart;
  while (searchStart < value.length) {
    const end = value.indexOf("```", searchStart);
    const body =
      end >= 0 ? value.slice(bodyStart, end) : value.slice(bodyStart);
    const parsed = parseAgentResultJSON(body, language === "json");
    if (parsed) {
      return parsed;
    }
    if (end < 0) {
      return undefined;
    }
    searchStart = end + 3;
  }
  return undefined;
}

function parseAgentResultJSON(value: string, strict = false) {
  const text = value.trim();
  const repaired = repairJSONControlChars(text);
  for (const source of uniqueNonEmptyStrings([text, repaired])) {
    const parsed = parseMaybeJSON(source);
    if (
      parsed !== source &&
      (strict
        ? isStrictAgentResultPayload(parsed)
        : isAgentResultPayload(parsed))
    ) {
      return parsed;
    }
  }
  return null;
}

function isStrictAgentResultPayload(value: any) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const kind = String(value.kind || value.type || value.event || "")
    .toLowerCase()
    .trim();
  return (
    [
      "final",
      "result",
      "final_result",
      "answer",
      "tool",
      "tool_result",
      "power_result",
    ].includes(kind) ||
    "content" in value ||
    "tasks" in value ||
    "suggestions" in value ||
    "rich" in value
  );
}

function isAgentResultPayload(value: any) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const kind = String(value.kind || value.type || value.event || "")
    .toLowerCase()
    .trim();
  return (
    [
      "final",
      "result",
      "final_result",
      "answer",
      "tool",
      "tool_result",
      "power_result",
    ].includes(kind) ||
    "content" in value ||
    "tasks" in value ||
    "suggestions" in value ||
    [
      "title",
      "text",
      "rich",
      "images",
      "videos",
      "audios",
      "files",
      "json",
    ].some((key) => hasDisplayOutput(value[key]))
  );
}

function looksLikeJSONText(value: string) {
  const text = String(value || "").trim();
  return (
    (text.startsWith("{") && text.endsWith("}")) ||
    (text.startsWith("[") && text.endsWith("]"))
  );
}

function looksLikeStructuredJSONSnippet(value: string) {
  const text = String(value || "").trim();
  return Boolean(
    text &&
    (looksLikeJSONText(text) ||
      text.startsWith("{") ||
      text.startsWith("[") ||
      text.includes('"agent_run_id"') ||
      text.includes('"node_run_id"') ||
      text.includes('"approval_id"')),
  );
}

function stringifyContextValue(value: unknown) {
  if (value == null) {
    return "";
  }
  if (typeof value === "string") {
    return isNonContentText(value) ? "" : value;
  }
  const documentText = safeDocumentText(value).trim();
  if (documentText && isNonContentText(documentText)) {
    return "";
  }
  try {
    const text = JSON.stringify(value);
    return isEmptyContextText(text) ? "" : text;
  } catch {
    const text = String(value);
    return isNonContentText(text) ? "" : text;
  }
}

function hasContextOutput(value: unknown) {
  const text = stringifyContextValue(value).trim();
  return Boolean(text && !isEmptyContextText(text));
}

function isEmptyContextText(text: string) {
  const normalized = text.trim();
  return (
    !normalized ||
    normalized === "{}" ||
    normalized === "[]" ||
    normalized === "null" ||
    isNonContentText(normalized)
  );
}

function canConnectNodes(
  sourceNode?: SpaceCanvasNode,
  targetNode?: SpaceCanvasNode,
) {
  return canConnectCanvasNodes(sourceNode, targetNode);
}

function connectedNodeEdgeEndpoints(
  connection: PendingNodeConnection,
  newNodeId: string,
) {
  if (connection.handleType === "target") {
    return {
      source: newNodeId,
      target: connection.nodeId,
    };
  }
  return {
    source: connection.nodeId,
    target: newNodeId,
  };
}

function appendCanvasEdge(
  current: SpaceCanvasEdge[],
  source: string,
  target: string,
  mediaUsage?: string,
) {
  if (!source || !target || source === target) {
    return current;
  }
  const edgeExists = current.some((edge) => {
    const endpoints = canvasEdgeNodeIDs(edge);
    return (
      endpoints.sourceNodeId === source && endpoints.targetNodeId === target
    );
  });
  if (edgeExists) {
    return current;
  }
  return [
    ...current,
    {
      id: `edge-${source}-${target}-${Date.now()}`,
      from: source,
      to: target,
      purpose: "media",
      ...(mediaUsage ? { mediaUsage } : {}),
    },
  ];
}

function assetNodeCateId(node: SpaceCanvasNode) {
  return Number(node.asset?.asset_cate_id || node.assetCateId || 0);
}

function isAssetNodeForCate(node: SpaceCanvasNode, assetCateId: number) {
  return node.type === "asset" && assetNodeCateId(node) === assetCateId;
}

function findReplaceableAssetNode(
  nodes: SpaceCanvasNode[],
  edges: SpaceCanvasEdge[],
  assetCateId: number,
  sourceNodeId?: string,
) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  if (sourceNodeId) {
    for (const edge of edges) {
      if (edge.from !== sourceNodeId) {
        continue;
      }
      const targetNode = byId.get(edge.to);
      if (targetNode && isAssetNodeForCate(targetNode, assetCateId)) {
        return targetNode;
      }
    }
  }
  return nodes.find((node) => isAssetNodeForCate(node, assetCateId)) || null;
}

function connectedAssetNodeIds(
  nodes: SpaceCanvasNode[],
  edges: SpaceCanvasEdge[],
  assetCateId: number,
  sourceNodeId: string | undefined,
  keepNodeId: string,
) {
  const duplicateIds = new Set<string>();
  if (!sourceNodeId || !assetCateId) {
    return duplicateIds;
  }
  const byId = new Map(nodes.map((node) => [node.id, node]));
  for (const edge of edges) {
    if (edge.from !== sourceNodeId || edge.to === keepNodeId) {
      continue;
    }
    const targetNode = byId.get(edge.to);
    if (targetNode && isAssetNodeForCate(targetNode, assetCateId)) {
      duplicateIds.add(targetNode.id);
    }
  }
  return duplicateIds;
}

function replaceAssetNode(
  currentNode: SpaceCanvasNode,
  nextNode: SpaceCanvasNode,
): SpaceCanvasNode {
  return {
    ...nextNode,
    id: currentNode.id,
    x: currentNode.x,
    y: currentNode.y,
    width: currentNode.width || nextNode.width,
    height: currentNode.height || nextNode.height,
    groupId: currentNode.groupId,
    local: currentNode.local !== false,
  };
}

function assetNodeResultOverride(
  node: SpaceCanvasNode,
): Partial<SpaceCanvasNode> {
  return {
    title: node.title,
    subtitle: node.subtitle,
    description: node.description,
    assetCateId: node.assetCateId,
    kind: node.kind,
    cardinality: node.cardinality,
    asset: node.asset,
  };
}

function flowEdgesToCanvasEdges(edges: Edge[]): SpaceCanvasEdge[] {
  return edges
    .map((edge) => ({
      id: String(edge.id || `edge-${edge.source}-${edge.target}`),
      from: String(edge.data?.physicalFrom || edge.source || ""),
      to: String(edge.data?.physicalTo || edge.target || ""),
      logicalFrom: String(edge.data?.logicalFrom || "") || undefined,
      logicalTo: String(edge.data?.logicalTo || "") || undefined,
      purpose:
        edge.data?.purpose === "structure" ||
        edge.data?.purpose === "dependency"
          ? edge.data.purpose
          : "media",
      executionMode:
        String(edge.data?.executionMode || "") === "manual"
          ? ("manual" as const)
          : undefined,
      mediaUsage: String(edge.data?.mediaUsage || "") || undefined,
    }))
    .filter((edge) => edge.from && edge.to && edge.from !== edge.to);
}

function normalizeCanvasForState(
  canvas: SpaceCanvasState,
  assetCateId: number,
): SpaceCanvasState {
  const nodeIds = new Set(canvas.nodes.map((node) => node.id));
  let nodesChanged = false;
  const normalizedNodes = canvas.nodes.map((node) => {
    const nodeAssetCateId = Number(node.assetCateId ?? assetCateId);
    const local = node.local !== false;
    if (node.assetCateId === nodeAssetCateId && node.local === local) {
      return node;
    }
    nodesChanged = true;
    return {
      ...node,
      assetCateId: nodeAssetCateId,
      local,
    };
  });
  const normalizedEdges = canvas.edges.filter(
    (edge) => nodeIds.has(edge.from) && nodeIds.has(edge.to),
  );
  return normalizeCanvasNodeIdentities({
    assetCateId,
    nextNodeNo: canvas.nextNodeNo,
    nodes: nodesChanged ? normalizedNodes : canvas.nodes,
    edges:
      normalizedEdges.length === canvas.edges.length
        ? canvas.edges
        : normalizedEdges,
    viewport: canvas.viewport || {},
    updatedAt: canvas.updatedAt,
  });
}

function hydrateCanvasMapAssets(
  canvases: Record<string, SpaceCanvasState>,
  assets: ProjectAsset[],
) {
  return Object.fromEntries(
    Object.entries(canvases).map(([key, canvas]) => [
      key,
      hydrateCanvasAssets(canvas, assets),
    ]),
  );
}

function hydrateCanvasAssets(
  canvas: SpaceCanvasState,
  assets: ProjectAsset[],
): SpaceCanvasState {
  if (!assets.length) {
    return canvas;
  }
  const byID = new Map(assets.map((asset) => [asset.id, asset]));
  const byNodeKey = new Map(
    assets
      .filter(
        (asset) =>
          String(asset.role || "") === "material" &&
          String(asset.status || "") !== "archived" &&
          String(asset.node_key || asset.version?.node_key || "").trim(),
      )
      .map((asset) => [
        String(asset.node_key || asset.version?.node_key || "").trim(),
        asset,
      ]),
  );
  return {
    ...canvas,
    nodes: canvas.nodes.map((node) =>
      hydrateCanvasNodeAsset(node, byID, byNodeKey),
    ),
  };
}

function hydrateCanvasNodeAsset(
  node: SpaceCanvasNode,
  assetsByID: Map<number, ProjectAsset>,
  assetsByNodeKey: Map<string, ProjectAsset>,
): SpaceCanvasNode {
  const assetID = canvasNodeReferencedAssetID(node);
  const asset =
    (assetID > 0 ? assetsByID.get(assetID) : undefined) ||
    (node.type === "power" || node.type === "agent" || node.type === "flow"
      ? assetsByNodeKey.get(node.id)
      : undefined);
  if (!asset) {
    return node;
  }
  const patch = buildAssetVersionNodePatch(node, asset);
  const assetRunId = Number(patch.resultRef?.run_id || 0);
  const currentRunId = Number(node.resultRef?.run_id || 0);
  return {
    ...node,
    ...patch,
    ...(node.runError && assetRunId > currentRunId ? { runError: "" } : {}),
    asset,
  };
}

function canvasNodeReferencedAssetID(node: SpaceCanvasNode) {
  return Number(node.resultRef?.asset_id || node.asset?.id || 0);
}

function isSameCanvasState(left: SpaceCanvasState, right: SpaceCanvasState) {
  return (
    left === right ||
    (left.assetCateId === right.assetCateId &&
      sameCanvasNodes(left.nodes, right.nodes) &&
      sameCanvasEdges(left.edges, right.edges) &&
      left.viewport.x === right.viewport.x &&
      left.viewport.y === right.viewport.y &&
      left.viewport.zoom === right.viewport.zoom &&
      left.updatedAt === right.updatedAt)
  );
}

function sameCanvasNodes(left: SpaceCanvasNode[], right: SpaceCanvasNode[]) {
  return (
    left === right ||
    (left.length === right.length &&
      left.every((node, index) => node === right[index]))
  );
}

function sameCanvasGroupRuntime(
  left: CanvasGroupRuntimeSummary | null | undefined,
  right: CanvasGroupRuntimeSummary | null | undefined,
) {
  if (left === right) {
    return true;
  }
  if (!left || !right) {
    return false;
  }
  return (
    left.memberCount === right.memberCount &&
    left.runnableCount === right.runnableCount &&
    left.completedCount === right.completedCount &&
    left.failedCount === right.failedCount &&
    left.staleCount === right.staleCount &&
    left.status === right.status
  );
}

function sameCanvasEdges(left: SpaceCanvasEdge[], right: SpaceCanvasEdge[]) {
  return (
    left === right ||
    (left.length === right.length &&
      left.every((edge, index) => {
        const candidate = right[index];
        return (
          edge === candidate ||
          (edge.id === candidate.id &&
            edge.from === candidate.from &&
            edge.to === candidate.to &&
            (edge.logicalFrom || "") === (candidate.logicalFrom || "") &&
            (edge.logicalTo || "") === (candidate.logicalTo || "") &&
            (edge.purpose || "") === (candidate.purpose || "") &&
            (edge.executionMode || "auto") ===
              (candidate.executionMode || "auto") &&
            (edge.mediaUsage || "") === (candidate.mediaUsage || ""))
        );
      }))
  );
}

function resolveProximityConnection(
  sourceNode: SpaceCanvasNode,
  targetNode: SpaceCanvasNode,
) {
  if (canConnectNodes(sourceNode, targetNode)) {
    return { source: sourceNode.id, target: targetNode.id };
  }
  if (canConnectNodes(targetNode, sourceNode)) {
    return { source: targetNode.id, target: sourceNode.id };
  }
  return null;
}

function createProximityPreviewEdge(connection: {
  source: string;
  target: string;
}): Edge {
  return {
    id: "proximity-preview",
    source: connection.source,
    sourceHandle: "output-0",
    target: connection.target,
    targetHandle: "input-0",
    type: "animated",
    animated: true,
    style: {
      stroke: "#0ea5e9",
      strokeWidth: 2,
      strokeDasharray: "5 5",
      opacity: 0.86,
      animation: "ws-dashdraw 0.5s linear infinite",
    },
    data: {
      isHighlighted: true,
      highlightColor: "#0ea5e9",
    },
  };
}

function isSamePreviewEdge(current: Edge | null, next: Edge | null) {
  if (!current && !next) {
    return true;
  }
  if (!current || !next) {
    return false;
  }
  return current.source === next.source && current.target === next.target;
}

function findClosestConnectableNode(
  draggedNode: Node,
  flowNodes: Node[],
  domainNodes: SpaceCanvasNode[],
) {
  const maxDistance = 150;
  const domainById = new Map(domainNodes.map((node) => [node.id, node]));
  let closest: { distance: number; domainNode: SpaceCanvasNode } | null = null;
  for (const node of flowNodes) {
    if (node.id === draggedNode.id) {
      continue;
    }
    const domainNode = domainById.get(node.id);
    if (!domainNode) {
      continue;
    }
    const dx = node.position.x - draggedNode.position.x;
    const dy = node.position.y - draggedNode.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < maxDistance && (!closest || distance < closest.distance)) {
      closest = { distance, domainNode };
    }
  }
  return closest;
}

function flowEdgeDecoration(
  edge: Edge,
  nodeMap: Map<string, SpaceCanvasNode>,
  hoveredNodeId: string,
  selectedNodeId: string,
  selectedEdgeId: string,
  highlightedPathEdges: ReadonlySet<string>,
  highlightedPathSourceNodeId: string,
): FlowEdgeDecoration {
  const selected = edge.id === selectedEdgeId;
  const pathHighlighted = highlightedPathEdges.has(edge.id);
  const highlighted =
    selected ||
    pathHighlighted ||
    edge.source === hoveredNodeId ||
    edge.target === hoveredNodeId ||
    edge.source === selectedNodeId ||
    edge.target === selectedNodeId;
  const activeNodeId =
    edge.source === hoveredNodeId || edge.target === hoveredNodeId
      ? hoveredNodeId
      : selectedNodeId;
  return {
    highlighted,
    selected,
    highlightColor: highlighted
      ? nodeHighlightColor(
          nodeMap.get(
            pathHighlighted ? highlightedPathSourceNodeId : activeNodeId,
          ),
        )
      : "var(--ws-edge)",
  };
}

function decorateFlowEdge(
  edge: Edge,
  decoration: FlowEdgeDecoration,
  onDeleteEdge: (edgeId: string) => void,
): Edge {
  return {
    ...edge,
    data: {
      ...edge.data,
      isHighlighted: decoration.highlighted,
      isSelected: decoration.selected,
      onDelete: onDeleteEdge,
      highlightColor: decoration.highlightColor,
    },
  };
}

function buildHighlightedCanvasPathIndex(
  nodeById: Map<string, SpaceCanvasNode>,
  edges: SpaceCanvasEdge[],
) {
  const outgoing = new Map<string, SpaceCanvasEdge[]>();
  for (const edge of edges) {
    const sourceEdges = outgoing.get(edge.from);
    if (sourceEdges) {
      sourceEdges.push(edge);
    } else {
      outgoing.set(edge.from, [edge]);
    }
  }
  const result = new Map<string, ReadonlySet<string>>();
  for (const startNode of nodeById.values()) {
    if (
      startNode.type !== "function" ||
      startNode.functionOption?.key !== "start"
    ) {
      continue;
    }
    const highlighted = new Set<string>();
    const visitedNodes = new Set<string>([startNode.id]);
    const queue = [...(outgoing.get(startNode.id) || [])];
    for (let index = 0; index < queue.length; index += 1) {
      const edge = queue[index];
      if (!edge || highlighted.has(edge.id)) {
        continue;
      }
      highlighted.add(edge.id);
      if (visitedNodes.has(edge.to)) {
        continue;
      }
      visitedNodes.add(edge.to);
      const targetNode = nodeById.get(edge.to);
      if (targetNode && canvasNodeStopsExecution(targetNode)) {
        continue;
      }
      queue.push(...(outgoing.get(edge.to) || []));
    }
    if (highlighted.size > 0) {
      result.set(startNode.id, highlighted);
    }
  }
  return result;
}

function nodeHighlightColor(node?: SpaceCanvasNode) {
  if (node?.type === "asset") return "#10b981";
  if (node?.type === "power") return "#8b5cf6";
  if (node?.type === "agent") return "#f59e0b";
  if (node?.type === "flow") return "#3b82f6";
  if (node?.type === "function" || node?.type === "group") return "#f43f5e";
  return "#3b82f6";
}

function pointerFromConnectEndEvent(event: any): CanvasPoint | null {
  const touch = event?.changedTouches?.[0] || event?.touches?.[0];
  if (touch) {
    return { x: touch.clientX, y: touch.clientY };
  }
  if (
    typeof event?.clientX === "number" &&
    typeof event?.clientY === "number"
  ) {
    return { x: event.clientX, y: event.clientY };
  }
  return null;
}

function isEditableEventTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true']"),
  );
}

function isCanvasDeleteShortcut(event: KeyboardEvent) {
  return (
    !event.repeat &&
    (event.key === "Delete" || event.key === "Backspace") &&
    !isEditableEventTarget(event.target)
  );
}

function functionIcon(key: string): LucideIcon {
  if (key === "start") return Play;
  if (key === "import") return Upload;
  if (key === "display") return Eye;
  return Save;
}

function isStartFunctionNode(node: SpaceCanvasNode) {
  if (node.type !== "function") {
    return false;
  }
  return node.functionOption?.key === "start" || node.title === "开始";
}

function isVisibleResultFunctionNode(node: SpaceCanvasNode) {
  if (node.type !== "function") {
    return false;
  }
  const key = node.functionOption?.key || "";
  return key === "import" || key === "save" || key === "display";
}

function shouldRenderFunctionResultCard(node: SpaceCanvasNode) {
  return isVisibleResultFunctionNode(node) && nodeHasResultContent(node);
}

function buildFunctionStatusPatch(
  description: string,
): Partial<SpaceCanvasNode> {
  return {
    description,
  };
}

function buildFunctionRunPatch(
  result: any,
  description: string,
): Partial<SpaceCanvasNode> {
  return {
    ...buildFunctionStatusPatch(description),
    resultRef: buildNodeResultRef({
      ...result,
      asset: undefined,
      version: undefined,
      role: undefined,
    }),
  };
}

const MULTI_MEDIA_GRID_NODE_SIZE = { width: 520, height: 340 } as const;
const FUNCTION_RESULT_TOOLBAR_HEIGHT = 44;

function canvasNodeStyleSize(node: SpaceCanvasNode) {
  if (node.type === "function") {
    if (shouldRenderFunctionResultCard(node)) {
      if (!hasDefaultCanvasNodeSize(node)) {
        return { width: node.width, height: node.height };
      }
      const mediaGridSize = defaultCanvasMediaGridSize(node);
      if (mediaGridSize) {
        return {
          width: mediaGridSize.width,
          height: mediaGridSize.height + FUNCTION_RESULT_TOOLBAR_HEIGHT,
        };
      }
      return functionResultNodeDefaultSize(node);
    }
    return { width: 128, height: 46 };
  }
  const mediaGridSize = defaultCanvasMediaGridSize(node);
  if (mediaGridSize) {
    return mediaGridSize;
  }
  return {
    width: node.width,
    height: node.height,
  };
}

function defaultCanvasMediaGridSize(node: SpaceCanvasNode) {
  if (
    !hasDefaultCanvasNodeSize(node) ||
    !canvasNodeCanRenderMediaGrid(node)
  ) {
    return null;
  }
  const preview = generatedNodePreview(node);
  const mediaGrid = canvasMultiMediaGridOutput(
    nodeEnergonOutput(node),
    canvasMediaGridKind(preview),
  );
  if (!mediaGrid) {
    return null;
  }
  return {
    width: Math.max(node.width, MULTI_MEDIA_GRID_NODE_SIZE.width),
    height: Math.max(node.height, MULTI_MEDIA_GRID_NODE_SIZE.height),
  };
}

function canvasNodeCanRenderMediaGrid(node: SpaceCanvasNode) {
  if (node.type === "asset" || node.type === "function") {
    return true;
  }
  if (node.type !== "power") {
    return false;
  }
  const viewMode = resolvePowerPresentation(
    node.power,
    node.kind,
    node.outputType,
  ).viewMode;
  return !["storyboard", "storyboard_grid", "video_compose"].includes(
    viewMode,
  );
}

function functionResultNodeDefaultSize(node: SpaceCanvasNode) {
  const preview = generatedNodePreview(node);
  const kind = preview.audioUrl
    ? "audio"
    : preview.videoUrl
      ? "video"
      : preview.imageUrl
        ? "image"
        : String(node.kind || "");
  const contentSize = powerNodeDefaultSize({
    kind,
    outputType: "",
    output: undefined,
  });
  return {
    width: contentSize.width,
    height: contentSize.height + FUNCTION_RESULT_TOOLBAR_HEIGHT,
  };
}

function NodeHandle({
  id,
  type,
  position,
  className,
  style,
}: {
  id: string;
  type: "target" | "source";
  position: Position;
  className: string;
  style?: CSSProperties;
}) {
  return (
    <Handle
      id={id}
      type={type}
      position={position}
      className={`ws-rf-handle ${className}`}
      style={style}
    >
      <span aria-hidden="true">
        {type === "target" ? <Minus size={12} /> : <Plus size={12} />}
      </span>
    </Handle>
  );
}

function NodeSelectionOverlays({
  node,
  selected,
}: {
  node: WorkspaceNodeData;
  selected?: boolean;
}) {
  const resizable =
    node.type === "asset" ||
    node.type === "power" ||
    node.type === "group" ||
    (node.type === "function" && shouldRenderFunctionResultCard(node));
  const resizer = (
    <CanvasNodeResizer
      node={node}
      enabled={node.interactive && !node.structureLocked}
      resizable={resizable}
      onResizeStart={node.onNodeResizeStart}
      onResizeEnd={node.onNodeResizeEnd}
    />
  );
  if (node.type === "flow") {
    const running = isActiveRunningNode(node.runningNode);
    return (
      <>
        {resizer}
        <FlowRunControl
          node={node}
          running={running}
          onRun={() => {
            if (running) {
              return;
            }
            node.onClearFeedbackRecords([node.id]);
            void node.onRunBackendNode(node).catch((error) => {
              toast.error(
                error instanceof Error ? error.message : "流程运行失败",
              );
            });
          }}
        />
      </>
    );
  }
  if (node.type === "asset") {
    return resizer;
  }
  if (node.type === "group") {
    return resizer;
  }
  if (node.type === "function") {
    return resizer;
  }
  if (
    !nodeUsesComposerSettings(node) ||
    !selected ||
    !node.showNodeSettings
  ) {
    return resizer;
  }
  return (
    <>
      {resizer}
      <Suspense
        fallback={<CanvasModuleLoading label="正在加载参数编辑器" compact />}
      >
        <CanvasNodeSettings key={node.id} node={node} />
      </Suspense>
    </>
  );
}

function nodeUsesComposerSettings(node: SpaceCanvasNode) {
  if (node.type === "agent") {
    return true;
  }
  return (
    node.type === "power" &&
    !isVideoComposePowerType(node.power, node.kind, node.outputType)
  );
}

function NodeQuickDetailButton({
  node,
  onShowNodeDetail,
}: {
  node: SpaceCanvasNode;
  onShowNodeDetail?: (node: SpaceCanvasNode) => void;
}) {
  if (!onShowNodeDetail || !nodeHasResultContent(node)) {
    return null;
  }
  return (
    <button
      type="button"
      className="ws-node-quick-view nodrag nopan"
      aria-label="查看详情"
      onPointerEnter={preloadNodeDetailDialog}
      onFocus={preloadNodeDetailDialog}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onShowNodeDetail(node);
      }}
    >
      <Eye size={14} />
    </button>
  );
}

const DEFAULT_ATTACHED_RESULT_VIEW: CanvasResultViewState = {
  width: 270,
  height: 250,
  offsetX: 0,
  offsetY: 0,
};

function NodeResultBubble({
  node,
  runningNode,
  onShowNodeDetail,
}: {
  node: WorkspaceNodeData;
  runningNode?: RunningNodeState | null;
  onShowNodeDetail?: (node: SpaceCanvasNode) => void;
}) {
  const normalizedResultView = normalizeCanvasResultViewState(
    node.resultView || DEFAULT_ATTACHED_RESULT_VIEW,
  );
  const {
    width: savedResultWidth,
    height: savedResultHeight,
    offsetX: savedResultOffsetX,
    offsetY: savedResultOffsetY,
  } = normalizedResultView;
  const [resultView, setResultView] = useState(normalizedResultView);
  const [resizing, setResizing] = useState(false);
  useEffect(() => {
    setResultView({
      width: savedResultWidth,
      height: savedResultHeight,
      offsetX: savedResultOffsetX,
      offsetY: savedResultOffsetY,
    });
  }, [
    savedResultHeight,
    savedResultOffsetX,
    savedResultOffsetY,
    savedResultWidth,
  ]);
  const agentRuntime = node.type === "agent" ? runningNode?.agent : undefined;
  const hasAgentRuntime = hasCanvasAgentRuntimeContent(agentRuntime);
  if (!nodeHasResultContent(node) && !hasAgentRuntime) {
    return null;
  }
  const basePreview = generatedNodePreview(node);
  const outputText = nodeDisplayText(node);
  const text = firstNonEmptyText(
    displayTextFromOutput(basePreview.text, ""),
    displayTextFromOutput(outputText, ""),
    displayTextFromOutput(node.description, ""),
    node.title,
    "暂无结果",
  );
  const rich = nodeRichDocument(node);
  const displayOutput = nodeEnergonOutput(node);
  const contentOutput = hasDisplayOutput(displayOutput)
    ? displayOutput
    : rich
      ? { rich }
      : text;
  const preview = hasResultPreviewMedia(basePreview)
    ? basePreview
    : mergeGeneratedPreview(
        basePreview,
        generatedPreviewFromValue(text, previewKindFromTextHint(text, "")),
      );
  const canResize = node.interactive;
  const rawAgentOutput = firstDefined(
    node.resultOutput,
    node.asset?.version?.content,
  );
  const continueAgent =
    node.type === "agent"
      ? async (agentInput: ReferenceInput) => {
          if (isActiveRunningNode(runningNode)) {
            return;
          }
          try {
            await node.onRunBackendNode(node, { agentInput });
          } catch (err) {
            toast.error(
              err instanceof Error ? err.message : "智能体继续运行失败",
            );
          }
        }
      : undefined;
  return (
    <Suspense fallback={<CanvasModuleLoading label="正在加载节点结果" />}>
      <CanvasResultView
        output={contentOutput}
        fallback={text}
        preview={preview}
        mediaLabel={mediaPreviewCaption(preview)}
        className={`ws-agent-result-bubble ${resizing ? "is-resizing" : ""}`}
        followContent={Boolean(runningNode && runningNode.status !== "error")}
        followKey={agentRuntime}
        style={{
          width: resultView.width,
          height: resultView.height,
          left: `calc(100% + 12px + ${Number(resultView.offsetX || 0)}px)`,
          top: `calc(50% + ${Number(resultView.offsetY || 0)}px)`,
        }}
        onOpen={onShowNodeDetail ? () => onShowNodeDetail(node) : undefined}
        onOpenIntent={preloadNodeDetailDialog}
        resizeControls={
          <CanvasFloatingResizer
            value={resultView}
            enabled={canResize}
            onResizeStart={() => {
              setResizing(true);
              node.onNodeResizeStart(node.id);
            }}
            onResize={setResultView}
            onResizeEnd={(nextView) => {
              setResultView(nextView);
              setResizing(false);
              node.onResultViewResizeEnd(node.id, nextView);
            }}
          />
        }
      >
        {node.type === "agent" ? (
          <Suspense
            fallback={
              <CanvasModuleLoading label="正在加载智能体结果" compact />
            }
          >
            <CanvasAgentResultContent
              output={rawAgentOutput}
              runtime={agentRuntime}
              fallback={text}
              running={isActiveRunningNode(runningNode)}
              onContinue={continueAgent}
            />
          </Suspense>
        ) : undefined}
      </CanvasResultView>
    </Suspense>
  );
}

function FunctionResultCard({
  node,
  running = false,
  onShowNodeDetail,
}: {
  node: WorkspaceNodeData;
  running?: boolean;
  onShowNodeDetail?: (node: SpaceCanvasNode) => void;
}) {
  const preview = generatedNodePreview(node);
  const rich = nodeRichDocument(node);
  const displayOutput = nodeEnergonOutput(node);
  const displayText = firstNonEmptyText(
    nodeDisplayText(node),
    displayTextFromOutput(preview.text, ""),
    displayTextFromOutput(node.description, ""),
    "暂无内容",
  );
  const contentOutput = hasDisplayOutput(displayOutput)
    ? displayOutput
    : rich
      ? { rich }
      : displayText;
  const renderGeneratedMedia =
    !contentOutputNeedsRenderer(contentOutput, preview) &&
    Boolean(preview.imageUrl || preview.videoUrl || preview.audioUrl);
  const onMediaSize =
    renderGeneratedMedia && !preview.audioUrl
      ? generatedMediaAutoSizeHandler(
          node,
          node.onNodeResult,
          FUNCTION_RESULT_TOOLBAR_HEIGHT,
        )
      : undefined;
  return (
    <Suspense fallback={<CanvasModuleLoading label="正在加载节点结果" />}>
      <CanvasResultView
        output={contentOutput}
        fallback={displayText}
        preview={preview}
        mediaLabel={mediaPreviewCaption(preview)}
        className={`ws-node-function-result-card ${
          renderGeneratedMedia ? "has-media" : ""
        }`}
        customContentIsPureMedia={renderGeneratedMedia}
        onOpen={onShowNodeDetail ? () => onShowNodeDetail(node) : undefined}
        onOpenIntent={preloadNodeDetailDialog}
      >
        {renderGeneratedMedia ? (
          <CanvasGeneratedNodeContent
            preview={preview}
            output={contentOutput}
            fallback={displayText}
            generating={running}
            showMediaCaption={false}
            onMediaSize={onMediaSize}
          />
        ) : undefined}
      </CanvasResultView>
    </Suspense>
  );
}

function NodeFeedbackBeacon({
  node,
  onOpenFeedbackRecord,
}: {
  node: SpaceCanvasNode;
  onOpenFeedbackRecord?: (
    node: SpaceCanvasNode,
    record: NodeFeedbackRecord,
  ) => void;
}) {
  const records = currentNodeFeedbackRecords(node);
  if (!onOpenFeedbackRecord || records.length === 0) {
    return null;
  }
  const pendingCount = records.filter(
    (record) => record.status === "pending",
  ).length;
  const latest =
    [...records].reverse().find((record) => record.status === "pending") ||
    records[records.length - 1];
  return (
    <button
      type="button"
      className={`ws-node-feedback-beacon nodrag nopan ${
        pendingCount > 0 ? "is-pending" : "is-done"
      }`}
      aria-label={pendingCount > 0 ? "继续填写反馈" : "查看反馈记录"}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onOpenFeedbackRecord(node, latest);
      }}
    >
      <Lightbulb size={15} fill="currentColor" />
      {records.length > 1 ? <span>{records.length}</span> : null}
    </button>
  );
}

function nodeHasResultRef(node: SpaceCanvasNode) {
  const ref = node.resultRef;
  return Boolean(
    ref?.run_id ||
    ref?.node_run_id ||
    ref?.asset_id ||
    ref?.version_id ||
    ref?.request_id,
  );
}

function nodeHasResultContent(node: SpaceCanvasNode) {
  if (!nodeCanHaveExecutionResult(node)) {
    return false;
  }
  if (
    !nodeHasResultRef(node) &&
    node.asset?.version?.content == null &&
    node.resultOutput == null
  ) {
    return false;
  }
  const output = nodeContextOutput(node);
  if (output == null) {
    return false;
  }
  const preview = generatedPreviewFromValue(
    output,
    nodePreviewKind(node, output),
  );
  return hasGeneratedPreview(preview) || hasContextOutput(output);
}

function nodeCanHaveExecutionResult(node: SpaceCanvasNode) {
  if (node.type !== "function") {
    return true;
  }
  return isVisibleResultFunctionNode(node);
}

async function runCanvasFunctionNodeAction(input: {
  node: SpaceCanvasNode;
  projectId: number;
  assetCate: AssetCate | null;
  inputContext: NodeInputContext | null;
  onNodeResult: NodeResultSetter;
  onAssetCreated?: (asset: ProjectAsset) => void;
  onRunStartNode: NodeStartRunner;
  onOpenImportPicker: (nodeId: string) => void;
}) {
  const optionKey = input.node.functionOption?.key || "";
  const upstreamOutput = inputContextOutput(input.inputContext);
  if (optionKey === "display") {
    if (upstreamOutput == null) {
      throw new Error("展示节点没有可展示的上游结果");
    }
    input.onNodeResult(
      input.node.id,
      buildGeneratedNodeResultPatch(
        input.node,
        { output: upstreamOutput },
        "展示上游结果",
      ),
    );
    toast.success("已展示上游结果");
    return true;
  }
  if (optionKey === "save") {
    if (upstreamOutput == null) {
      throw new Error("保存节点没有可保存的上游结果");
    }
    const asset = await saveCanvasContentResult({
      projectId: input.projectId,
      assetCateId: Number(input.node.assetCateId || input.assetCate?.id || 0),
      name: functionAssetName(input.node, input.inputContext),
      kind: resultAssetKind(input.node),
      content: upstreamOutput,
      nodeKey: input.node.id,
      requestId: createCanvasSaveRequestId(
        "save",
        input.node.id,
        upstreamOutput,
      ),
      source: canvasResultSourceFromContext(input.inputContext),
      previousAsset: input.node.asset,
    });
    input.onAssetCreated?.(asset);
    input.onNodeResult(
      input.node.id,
      buildGeneratedNodeResultPatch(
        input.node,
        {
          output: asset.version?.content || upstreamOutput,
          asset,
        },
        "保存上游结果",
      ),
    );
    toast.success("资产已保存");
    return true;
  }
  if (optionKey === "start") {
    await input.onRunStartNode(input.node);
    return true;
  }
  if (optionKey === "import") {
    input.onOpenImportPicker(input.node.id);
    return true;
  }
  input.onNodeResult(
    input.node.id,
    buildGeneratedNodeResultPatch(
      input.node,
      { output: "操作已应用" },
      "操作已应用",
    ),
  );
  toast.success("操作已应用");
  return true;
}

function latestInputContextSource(inputContext: NodeInputContext | null) {
  const sources = inputContext?.sources || [];
  return sources.length > 0 ? sources[sources.length - 1] : null;
}

function inputContextOutput(inputContext: NodeInputContext | null) {
  const source = latestInputContextSource(inputContext);
  if (source?.output != null) {
    return source.output;
  }
  if (inputContext?.text) {
    return { text: inputContext.text };
  }
  return null;
}

function canvasResultSourceFromContext(
  inputContext: NodeInputContext | null,
): CanvasResultSourceRef | null {
  const source = latestInputContextSource(inputContext);
  return canvasResultSourceFromNode(source);
}

function functionAssetName(
  node: SpaceCanvasNode,
  inputContext: NodeInputContext | null,
) {
  const source = latestInputContextSource(inputContext);
  return firstNonEmptyText(source?.title, node.title, "画布资产");
}

function FlowFeedbackDialog({
  prompt,
  running,
  readonly,
  history,
  activeRecordId,
  onSelectRecord,
  onClose,
  onSubmit,
}: {
  prompt: FlowFeedbackPrompt;
  running: boolean;
  readonly?: boolean;
  history?: NodeFeedbackRecord[];
  activeRecordId?: string;
  onSelectRecord?: (record: NodeFeedbackRecord) => void;
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>) => void;
}) {
  const interaction = useMemo(
    () => flowFeedbackPanelInteraction(prompt),
    [prompt],
  );

  if (typeof document === "undefined") {
    return null;
  }
  const portalContainer = document.querySelector(".ws-page") || document.body;

  return createPortal(
    <div className="ws-flow-feedback-backdrop" onMouseDown={onClose}>
      <div
        className="ws-flow-feedback-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="ws-flow-feedback-head">
          <div>
            <strong>{prompt.title || "补充信息"}</strong>
            {readonly ? (
              <span>已提交的反馈记录，可查看之前填写的内容。</span>
            ) : prompt.description ? (
              <span>{prompt.description}</span>
            ) : null}
          </div>
          <button
            type="button"
            className="ws-flow-feedback-close"
            disabled={running}
            onClick={onClose}
            aria-label="关闭"
          >
            <X size={18} />
          </button>
        </header>
        {history && history.length > 1 ? (
          <div className="ws-flow-feedback-tabs">
            {history.map((record, index) => (
              <button
                key={record.id}
                type="button"
                className={record.id === activeRecordId ? "is-active" : ""}
                onClick={() => onSelectRecord?.(record)}
              >
                <span>{index + 1}</span>
                {record.status === "pending" ? "待反馈" : "已提交"}
              </button>
            ))}
          </div>
        ) : null}
        <div className="ws-flow-feedback-body custom-scrollbar">
          <Suspense fallback={<CanvasModuleLoading label="正在加载交互表单" />}>
            <AgentInteractionPanel
              interaction={interaction}
              disabled={running}
              readonly={readonly}
              hideHeader
              layout="dialog"
              initialData={readonly ? prompt.values : undefined}
              onSubmit={(result) =>
                onSubmit(
                  flowFeedbackSubmitValues(prompt, interaction, result.data),
                )
              }
            />
          </Suspense>
        </div>
        {readonly ? (
          <footer className="ws-flow-feedback-foot">
            <button
              type="button"
              className="ws-flow-feedback-submit"
              onClick={onClose}
            >
              <CheckCircle2 size={16} />
              <span>知道了</span>
            </button>
          </footer>
        ) : null}
      </div>
    </div>,
    portalContainer,
  );
}

function flowFeedbackSubmitValues(
  prompt: FlowFeedbackPrompt,
  interaction: AgentInteraction,
  data: Record<string, unknown>,
) {
  if (String(interaction.type || "").toLowerCase() === "power_params") {
    return data;
  }
  return {
    ...(prompt.values || {}),
    ...data,
  };
}

function flowFeedbackPanelInteraction(
  prompt: FlowFeedbackPrompt,
): AgentInteraction {
  const current = prompt.interaction?.interaction || {};
  const fields = Array.isArray(current.fields)
    ? current.fields
    : prompt.fields.length > 0
      ? prompt.fields
      : [
          {
            id: 0,
            key: "text",
            name: "补充信息",
            type: "textarea",
            required: true,
          },
        ];
  return {
    ...current,
    id: String(current.id || `flow-feedback-${prompt.approval?.id || 0}`),
    type: String(current.type || "form"),
    title: String(current.title || prompt.title || "补充信息"),
    description: String(current.description || prompt.description || ""),
    fields,
    values: prompt.values,
  };
}

function normalizeCanvasZoom(zoom: number) {
  return Math.max(
    0.35,
    Math.min(1.45, Number.isFinite(zoom) ? zoom : 1),
  );
}

function canvasOverlayVariables(zoom: number): CSSProperties {
  const safeZoom = normalizeCanvasZoom(zoom);
  return {
    "--ws-node-overlay-scale": String(1 / safeZoom),
    "--ws-node-overlay-gap": `${16 / safeZoom}px`,
  } as CSSProperties;
}

function applyCanvasOverlayZoom(element: HTMLElement | null, zoom: number) {
  if (!element) {
    return;
  }
  const safeZoom = normalizeCanvasZoom(zoom);
  element.style.setProperty("--ws-node-overlay-scale", String(1 / safeZoom));
  element.style.setProperty("--ws-node-overlay-gap", `${16 / safeZoom}px`);
}

function shouldConfirmNodeRun(node: SpaceCanvasNode) {
  return node.type === "function" && node.functionOption?.key === "start";
}

function nodeRunConfirmDescription(node: SpaceCanvasNode) {
  if (node.type === "function" && node.functionOption?.key === "start") {
    return "将从该开始节点沿连接线执行后续节点，直到保存或展示。";
  }
  if (node.type === "agent") {
    return "将把当前提示词、文件和上下文发送给该智能体。";
  }
  if (node.type === "power") {
    return "将使用当前参数运行该能力节点。";
  }
  return "确认后开始执行该节点。";
}

async function runCanvasGroupNodeTargets(
  group: SpaceCanvasNode,
  sourceNode: SpaceCanvasNode,
  members: SpaceCanvasNode[],
  runNode: BackendNodeRunner,
) {
  if (group.group?.origin !== "script") {
    await runNode(sourceNode);
    return;
  }
  const runnableMembers = members.filter(canvasNodeRunsInBackend);
  const pendingMembers = runnableMembers.filter(
    (member) => member.storyboardItem?.stale || !nodeHasResultContent(member),
  );
  const targets = pendingMembers.length > 0 ? pendingMembers : runnableMembers;
  await runCanvasGroupMembers(targets, runNode);
}

function SpaceNodeView({
  data,
  selected,
}: NodeProps<Node<WorkspaceNodeData>>) {
  const node = data;
  const {
    sourceNode,
    projectId,
    runningNode,
    setRunningNode,
    onShowNodeDetail,
    onNodeResult,
    onOpenFeedbackRecord,
    canvasReferenceItems,
    connectedMediaReferences,
    onConnectedMediaEdgeRemove,
    onNodeDraftChange,
    onOpenStoryboardGridImport,
    onRunBackendNode,
    structureLocked,
    storyboardSourceNode,
  } = data;
  const powerPresentation =
    node.type === "power"
      ? resolvePowerPresentation(node.power, node.kind, node.outputType)
      : null;
  const isStoryboardPower = powerPresentation?.viewMode === "storyboard";
  const isStoryboardGridPower =
    powerPresentation?.viewMode === "storyboard_grid";
  const isVideoComposePower = powerPresentation?.viewMode === "video_compose";
  if (node.type === "group") {
    const members = node.groupMembers;
    const storyboardFrameRunning = node.storyboardFrameRunning;
    const groupRuntime =
      node.groupRuntime ||
      summarizeCanvasGroupRuntime({
        members,
        runningNodes: EMPTY_RUNNING_NODE_MAP,
        groupState: runningNode,
        hasResult: nodeHasResultContent,
      });
    const runBlockedReason = node.runBlockedReason;
    let runGroup: (() => void) | undefined;
    if (!runBlockedReason && !storyboardFrameRunning) {
      runGroup = () => {
        setRunningNode((current) => ({
          ...current,
          [node.id]: {
            nodeId: node.id,
            title: node.title,
            startedAt: Date.now(),
            progress: 8,
            status: "running",
          },
        }));
        void runCanvasGroupNodeTargets(
          node,
          sourceNode,
          members,
          onRunBackendNode,
        )
          .then(() => {
            setRunningNode((current) => omitRunningNode(current, node.id));
          })
          .catch((error) => {
            setRunningNode((current) => ({
              ...current,
              [node.id]: {
                ...(current[node.id] || {
                  nodeId: node.id,
                  title: node.title,
                  startedAt: Date.now(),
                  progress: 8,
                }),
                status: "error",
              },
            }));
            toast.error(
              error instanceof Error ? error.message : "分组运行失败",
            );
            window.setTimeout(() => {
              setRunningNode((current) => omitRunningNode(current, node.id));
            }, 1400);
          });
      };
    }
    return (
      <Suspense fallback={<CanvasModuleLoading label="正在加载分组" />}>
        <CanvasGroupNodeView
          node={node}
          memberCount={groupRuntime.memberCount}
          runnableCount={groupRuntime.runnableCount}
          completedCount={groupRuntime.completedCount}
          failedCount={groupRuntime.failedCount}
          staleCount={groupRuntime.staleCount}
          status={groupRuntime.status}
          frameRunning={storyboardFrameRunning}
          selected={selected}
          managed={structureLocked}
          onRename={
            !structureLocked
              ? (title) => onNodeResult(node.id, { title, titleMode: "manual" })
              : undefined
          }
          onEditStructure={
            storyboardSourceNode
              ? () =>
                  onShowNodeDetail(
                    storyboardSourceNode,
                    storyboardEditorFocusFromNode(node),
                  )
              : undefined
          }
          onRun={runGroup}
          runBlockedReason={runBlockedReason}
        >
          <NodeHandle
            id="input-0"
            type="target"
            position={Position.Left}
            className="is-in"
          />
          <NodeHandle
            id="output-0"
            type="source"
            position={Position.Right}
            className="is-out"
          />
          <NodeSelectionOverlays node={node} selected={selected} />
        </CanvasGroupNodeView>
      </Suspense>
    );
  }

  // 1. circular agent representation
  if (node.type === "agent") {
    const showRunFrame =
      isActiveRunningNode(runningNode) || runningNode?.status === "success";
    return (
      <div
        className={`ws-node-agent-wrap ${selected ? "is-selected" : ""} ${showRunFrame ? "is-running" : ""}`}
      >
        <NodeHandle
          id="input-0"
          type="target"
          position={Position.Left}
          className="is-in"
          style={{ left: "4px" }}
        />
        <NodeHandle
          id="output-0"
          type="source"
          position={Position.Right}
          className="is-out"
          style={{ right: "4px" }}
        />
        <div className="ws-node-circle">
          <div className="ws-node-circle-avatar">
            <UserCheck size={20} className="ws-icon-amber" />
          </div>
          <EditableCanvasNodeTitle
            className="ws-node-circle-title"
            title={node.title}
            onRename={
              onNodeResult
                ? (title) =>
                    onNodeResult(node.id, { title, titleMode: "manual" })
                : undefined
            }
          />
        </div>
        {showRunFrame ? (
          <svg
            className="ws-node-running-border is-spin is-circle is-agent"
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <circle
              className="ws-node-running-track"
              cx="50"
              cy="50"
              r="47"
              pathLength="100"
            />
            <circle
              className="ws-node-running-progress"
              cx="50"
              cy="50"
              r="47"
              pathLength="100"
              strokeDasharray="18 82"
              strokeDashoffset="0"
            />
          </svg>
        ) : null}
        <NodeFeedbackBeacon
          node={node}
          onOpenFeedbackRecord={onOpenFeedbackRecord}
        />
        <NodeResultBubble
          node={node}
          runningNode={runningNode}
          onShowNodeDetail={onShowNodeDetail}
        />
        <NodeSelectionOverlays node={node} selected={selected} />
      </div>
    );
  }

  // 2. SVG Hexagon flow representation
  if (node.type === "flow") {
    const showRunFrame =
      isActiveRunningNode(runningNode) || runningNode?.status === "success";
    return (
      <div
        className={`ws-node-flow-wrap ${selected ? "is-selected" : ""} ${showRunFrame ? "is-running" : ""}`}
      >
        <svg
          className="ws-hexagon-svg"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <polygon
            points="50,4 93,27 93,73 50,96 7,73 7,27"
            stroke={selected ? "var(--ws-blue)" : "var(--ws-border)"}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        {showRunFrame ? (
          <svg
            className="ws-node-running-border is-spin is-hexagon"
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon
              className="ws-node-running-track"
              points="50,5 92,28 92,72 50,95 8,72 8,28"
              pathLength="100"
            />
            <polygon
              className="ws-node-running-progress"
              points="50,5 92,28 92,72 50,95 8,72 8,28"
              pathLength="100"
              strokeDasharray="18 82"
              strokeDashoffset="0"
            />
          </svg>
        ) : null}
        <div className="ws-node-flow-content">
          <div className="ws-node-flow-avatar">
            <Workflow size={16} className="ws-icon-blue" />
          </div>
          <EditableCanvasNodeTitle
            className="ws-node-flow-title"
            title={node.title}
            onRename={
              onNodeResult
                ? (title) =>
                    onNodeResult(node.id, { title, titleMode: "manual" })
                : undefined
            }
          />
        </div>
        <NodeHandle
          id="input-0"
          type="target"
          position={Position.Left}
          className="is-in"
          style={{ left: "11px" }}
        />
        <NodeHandle
          id="output-0"
          type="source"
          position={Position.Right}
          className="is-out"
          style={{ right: "11px" }}
        />
        <NodeFeedbackBeacon
          node={node}
          onOpenFeedbackRecord={onOpenFeedbackRecord}
        />
        <NodeResultBubble node={node} onShowNodeDetail={onShowNodeDetail} />
        <NodeSelectionOverlays node={node} selected={selected} />
      </div>
    );
  }

  // 3. Function command capsule representation
  if (node.type === "function") {
    const functionKey =
      node.functionOption?.key || (node.title.includes("保存") ? "save" : "");
    const isStartFunction = functionKey === "start";
    const FunctionIcon = functionIcon(functionKey);
    const { onRunFunctionNode, requestConfirm } = node;
    const isCurrentNodeRunning = isActiveRunningNode(runningNode);
    const startLocked = isStartFunction && node.canvasHasRunningNode;
    const nodeRunning = isCurrentNodeRunning;
    const renderResultCard = shouldRenderFunctionResultCard(node);
    const inputHandleStyle: CSSProperties = renderResultCard
      ? { left: "0px", top: "19px" }
      : { left: "0px" };
    const outputHandleStyle: CSSProperties = renderResultCard
      ? { left: "128px", right: "auto", top: "19px" }
      : { right: "0px" };
    const markFunctionNodeRunning = (status: RunningNodeState["status"]) => {
      setRunningNode((current) => ({
        ...current,
        [node.id]: {
          nodeId: node.id,
          title: node.title,
          startedAt: Date.now(),
          progress: status === "success" ? 100 : status === "error" ? 92 : 0,
          status,
        },
      }));
      if (status !== "running" && status !== "waiting") {
        window.setTimeout(
          () => setRunningNode((current) => omitRunningNode(current, node.id)),
          status === "success" ? 650 : 1200,
        );
      }
    };
    const executeFunctionNode = () => {
      const useLocalRunningState = !isStartFunction;
      if (useLocalRunningState) {
        markFunctionNodeRunning("running");
      }
      void onRunFunctionNode(node)
        .then(() => {
          if (useLocalRunningState) {
            markFunctionNodeRunning("success");
          }
        })
        .catch((error) => {
          if (useLocalRunningState) {
            markFunctionNodeRunning("error");
          }
          toast.error(error instanceof Error ? error.message : "执行出错");
        });
    };
    const runFunctionNode = () => {
      if (nodeRunning || startLocked) {
        return;
      }
      if (shouldConfirmNodeRun(node)) {
        requestConfirm({
          title: `执行「${node.title}」`,
          description: nodeRunConfirmDescription(node),
          confirmText: "执行",
          onConfirm: executeFunctionNode,
        });
        return;
      }
      executeFunctionNode();
    };
    const handleFunctionClick = (event: ReactMouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      runFunctionNode();
    };
    return (
      <div
        className={`ws-node-function-wrap ${selected ? "is-selected" : ""} ${
          nodeRunning ? "is-running" : ""
        } ${renderResultCard ? "has-result-card" : ""} is-${functionKey || "default"}`}
      >
        <div
          className="ws-node-function-pill"
          role="button"
          tabIndex={0}
          aria-disabled={nodeRunning || startLocked}
          onClick={handleFunctionClick}
          onKeyDown={(event) => {
            if (
              (event.key !== "Enter" && event.key !== " ")
            ) {
              return;
            }
            event.preventDefault();
            event.stopPropagation();
            runFunctionNode();
          }}
        >
          <div className="ws-node-function-icon">
            {isCurrentNodeRunning ? (
              <Loader2 size={15} className="ws-spin" />
            ) : (
              <FunctionIcon
                size={15}
                fill={isStartFunction ? "currentColor" : "none"}
              />
            )}
          </div>
          <span className="ws-node-function-title">
            {isCurrentNodeRunning
              ? runningNode?.status === "waiting"
                ? "等待中"
                : "运行中"
              : node.title}
          </span>
        </div>
        {renderResultCard ? (
          <FunctionResultCard
            node={node}
            running={nodeRunning}
            onShowNodeDetail={onShowNodeDetail}
          />
        ) : null}
        <NodeHandle
          id="input-0"
          type="target"
          position={Position.Left}
          className="is-in"
          style={inputHandleStyle}
        />
        <NodeHandle
          id="output-0"
          type="source"
          position={Position.Right}
          className="is-out"
          style={outputHandleStyle}
        />
        <NodeFeedbackBeacon
          node={node}
          onOpenFeedbackRecord={onOpenFeedbackRecord}
        />
        {renderResultCard ? null : (
          <NodeResultBubble node={node} onShowNodeDetail={onShowNodeDetail} />
        )}
        <NodeSelectionOverlays node={node} selected={selected} />
      </div>
    );
  }
  // 4. Asset representations
  if (node.type === "asset") {
    if (node.kind === "image") {
      const preview = nodeDetailPreview(node);
      const contentOutput = nodeEnergonOutput(node);
      const useContentView = contentOutputNeedsRenderer(contentOutput, preview);
      const onMediaSize = generatedMediaAutoSizeHandler(node, onNodeResult);
      const className = [
        "ws-node-image-wrap",
        selected ? "is-selected" : "",
        preview.imageUrl ? "has-media" : "",
      ]
        .filter(Boolean)
        .join(" ");
      return (
        <div className={className}>
          <div className="ws-node-floating-label">
            <ImageIcon size={13} className="ws-icon-green" />
            <span>{node.title || "图片资产"}</span>
          </div>
          <div className="ws-node-image-container ws-node-content-container">
            {useContentView ? (
              <div className="ws-node-scroll-content nowheel">
                <CanvasNodeContentView
                  output={contentOutput}
                  fallback={preview.text || node.description || "图片资产"}
                  mediaGridKind="image"
                  className="ws-canvas-content-view"
                />
              </div>
            ) : preview.imageUrl ? (
              <CanvasStableImage
                src={preview.imageUrl}
                alt={node.title}
                className="ws-node-image-raw"
                onMediaSize={onMediaSize}
              />
            ) : (
              <div className="ws-node-image-empty">
                <ImageIcon size={24} />
                <span>{preview.text || node.description || "图片资产"}</span>
              </div>
            )}
          </div>
          <NodeHandle
            id="input-0"
            type="target"
            position={Position.Left}
            className="is-in"
          />
          <NodeHandle
            id="output-0"
            type="source"
            position={Position.Right}
            className="is-out"
          />
          <NodeQuickDetailButton
            node={node}
            onShowNodeDetail={onShowNodeDetail}
          />
          <NodeSelectionOverlays node={node} selected={selected} />
        </div>
      );
    }

    if (node.kind === "video") {
      const preview = nodeDetailPreview(node);
      const contentOutput = nodeEnergonOutput(node);
      const useContentView = contentOutputNeedsRenderer(contentOutput, preview);
      const onMediaSize = generatedMediaAutoSizeHandler(node, onNodeResult);
      const className = [
        "ws-node-video-wrap",
        selected ? "is-selected" : "",
        preview.videoUrl || preview.imageUrl ? "has-media" : "",
      ]
        .filter(Boolean)
        .join(" ");
      return (
        <div className={className}>
          <div className="ws-node-floating-label">
            <Video size={13} className="ws-icon-green" />
            <span>{node.title || "视频资产"}</span>
          </div>
          <div className="ws-node-video-container ws-node-content-container">
            {useContentView ? (
              <div className="ws-node-scroll-content nowheel">
                <CanvasNodeContentView
                  output={contentOutput}
                  fallback={preview.text || node.description || "视频资产"}
                  mediaGridKind="video"
                  className="ws-canvas-content-view"
                />
              </div>
            ) : preview.videoUrl ? (
              <VideoThumbnail
                key={preview.videoUrl}
                src={preview.videoUrl}
                className="ws-node-video-raw"
                onMediaSize={onMediaSize}
              />
            ) : preview.imageUrl ? (
              <CanvasStableImage
                src={preview.imageUrl}
                alt={node.title}
                className="ws-node-video-raw"
                onMediaSize={onMediaSize}
              />
            ) : (
              <div className="ws-node-image-empty">
                <Video size={24} />
                <span>{preview.text || node.description || "视频资产"}</span>
              </div>
            )}
            {useContentView ? null : (
              <div className="ws-node-video-play">
                <div>
                  <Play size={14} fill="currentColor" />
                </div>
              </div>
            )}
          </div>
          <NodeHandle
            id="input-0"
            type="target"
            position={Position.Left}
            className="is-in"
          />
          <NodeHandle
            id="output-0"
            type="source"
            position={Position.Right}
            className="is-out"
          />
          <NodeQuickDetailButton
            node={node}
            onShowNodeDetail={onShowNodeDetail}
          />
          <NodeSelectionOverlays node={node} selected={selected} />
        </div>
      );
    }

    // Default text asset
    const preview = nodeDetailPreview(node);
    const rich = nodeRichDocument(node);
    const displayOutput = nodeEnergonOutput(node);
    const displayText = nodeDisplayText(node);
    const contentOutput = hasDisplayOutput(displayOutput)
      ? displayOutput
      : rich
        ? { rich }
        : displayText || preview.text;
    const useContentView = contentOutputNeedsRenderer(contentOutput, preview);
    const hasTextMedia = Boolean(
      preview.imageUrl || preview.videoUrl || preview.audioUrl,
    );
    const className = [
      "ws-node-text-wrap",
      selected ? "is-selected" : "",
      hasTextMedia ? "has-media" : "",
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <div className={className}>
        <div className="ws-node-floating-label">
          <Type size={13} className="ws-icon-green" />
          <span>{node.title}</span>
        </div>
        <div className="ws-node-text-card">
          {!useContentView && preview.imageUrl ? (
            <div className="ws-node-text-media">
              <img
                src={preview.imageUrl}
                alt={mediaPreviewCaption(preview) || node.title}
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : !useContentView && preview.videoUrl ? (
            <div className="ws-node-text-media">
              <VideoThumbnail
                key={preview.videoUrl}
                src={preview.videoUrl}
              />
            </div>
          ) : !useContentView && preview.audioUrl ? (
            <div className="ws-node-text-media is-audio">
              <Suspense
                fallback={<CanvasModuleLoading label="正在加载音频" compact />}
              >
                <AssetAudioPreview src={preview.audioUrl} />
              </Suspense>
            </div>
          ) : !useContentView && preview.fileUrl ? (
            <div className="ws-node-text-file">
              <FileText size={16} />
              <span>{mediaPreviewCaption(preview) || "文件内容"}</span>
            </div>
          ) : (
            <div className="ws-node-scroll-content nowheel">
              <CanvasNodeContentView
                output={contentOutput}
                fallback={displayText || preview.text || "暂无内容"}
                mediaGridKind={canvasMediaGridKind(preview)}
                className="ws-canvas-content-view"
              />
            </div>
          )}
        </div>
        <NodeHandle
          id="input-0"
          type="target"
          position={Position.Left}
          className="is-in"
        />
        <NodeHandle
          id="output-0"
          type="source"
          position={Position.Right}
          className="is-out"
        />
        <NodeQuickDetailButton
          node={node}
          onShowNodeDetail={onShowNodeDetail}
        />
        <NodeSelectionOverlays node={node} selected={selected} />
      </div>
    );
  }

  // 5. Power Nodes
  if (node.type === "power") {
    const isPowerRunning = isActiveRunningNode(runningNode);
    const isAudioPower = isAudioPowerType(node.power, node.kind);
    const storyboardGrid = isStoryboardGridPower
      ? parseStoryboardGridOutput(
          isPowerRunning
            ? [runningNode?.streamOutput, storyboardNodeOutput(node)]
            : storyboardNodeOutput(node),
        )
      : null;
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
    const showStreamOutput = Boolean(
      !isStoryboardPower &&
      !isStoryboardGridPower &&
      !isVideoComposePower &&
      runningNode?.streamStarted &&
      (runningNode.streamText || runningNode.streamOutput) &&
      runningNode.status !== "success",
    );
    const preview = showStreamOutput
      ? runningNode?.streamOutput
        ? generatedPreviewFromValue(runningNode.streamOutput, "audio")
        : {
            text: runningNode?.streamText || "",
            imageUrl: "",
            videoUrl: "",
            audioUrl: "",
            fileUrl: "",
          }
      : generatedNodePreview(node);
    const contentOutput = showStreamOutput
      ? runningNode?.streamOutput || { text: runningNode?.streamText || "" }
      : nodeEnergonOutput(node);
    const hasPowerContent =
      isStoryboardPower ||
      isStoryboardGridPower ||
      isVideoComposePower ||
      showStreamOutput ||
      storyboardHasResult;
    const hasPowerMedia =
      !isStoryboardPower &&
      !isStoryboardGridPower &&
      !isVideoComposePower &&
      Boolean(
        preview.imageUrl ||
        preview.videoUrl ||
        preview.audioUrl ||
        preview.fileUrl,
      );
    const onMediaSize = generatedMediaAutoSizeHandler(node, onNodeResult);
    const className = [
      "ws-node-power-wrap",
      selected ? "is-selected" : "",
      isPowerRunning ? "is-running" : "",
      node.runError && !isPowerRunning ? "is-error" : "",
      isStoryboardPower ? "is-storyboard" : "",
      isStoryboardGridPower ? "is-storyboard-grid" : "",
      isVideoComposePower ? "is-video-compose" : "",
      isAudioPower ? "is-audio" : "",
      hasPowerContent ? "has-content" : "",
      hasPowerMedia ? "has-media" : "",
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <div className={className}>
        <div className="ws-node-floating-label">
          <PowerIcon
            power={node.power}
            kind={node.kind}
            outputType={node.outputType}
            size={13}
            className="ws-icon-violet"
          />
          <EditableCanvasNodeTitle
            title={node.title}
            onRename={
              onNodeResult && !structureLocked
                ? (title) =>
                    onNodeResult(node.id, { title, titleMode: "manual" })
                : undefined
            }
          />
          {node.storyboardItem?.stale ? (
            <SpaceTooltip label="上游素材或提示词已变化；当前结果仍可使用，重新运行可更新">
              <span className="ws-node-stale-badge">可更新</span>
            </SpaceTooltip>
          ) : null}
          {isStoryboardDerivedPromptOverridden(node) ? (
            <span className="ws-node-prompt-override-badge">提示词已修改</span>
          ) : null}
        </div>
        <div className="ws-node-power-card">
          {isPowerRunning ? (
            <svg className="ws-node-running-border is-spin" aria-hidden="true">
              <rect
                className="ws-node-running-track"
                x="0"
                y="0"
                width="100%"
                height="100%"
                rx="6"
                pathLength="100"
              />
              <rect
                className="ws-node-running-progress"
                x="0"
                y="0"
                width="100%"
                height="100%"
                rx="6"
                pathLength="100"
                strokeDasharray="18 82"
                strokeDashoffset="0"
              />
            </svg>
          ) : null}
          {isVideoComposePower ? (
            <Suspense
              fallback={<CanvasModuleLoading label="正在加载视频合成" />}
            >
              <VideoComposeView
                composition={node.composerDraft?.videoComposition}
                referenceItems={canvasReferenceItems.filter(
                  (item) => item.source !== "current" || item.id !== node.id,
                )}
                connectedMediaReferences={connectedMediaReferences}
                running={isPowerRunning}
                onChange={
                  onNodeDraftChange
                    ? (videoComposition) =>
                        onNodeDraftChange(node.id, {
                          ...(node.composerDraft || {}),
                          videoComposition,
                        })
                    : undefined
                }
                onConnectedMediaEdgeRemove={onConnectedMediaEdgeRemove}
                onRun={
                  onRunBackendNode
                    ? (videoComposition) => {
                        void onRunBackendNode({
                          ...node,
                          composerDraft: {
                            ...(node.composerDraft || {}),
                            videoComposition,
                          },
                        }).catch((error) =>
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : "视频合成失败",
                          ),
                        );
                      }
                    : undefined
                }
                onOpenDetail={
                  onShowNodeDetail ? () => onShowNodeDetail(node) : undefined
                }
              />
            </Suspense>
          ) : isStoryboardPower ? (
            <Suspense
              fallback={
                <CanvasModuleLoading label="正在加载分镜内容" compact />
              }
            >
              <StoryboardNodeContent
                output={
                  isPowerRunning
                    ? runningNode?.streamText || ""
                    : storyboardNodeOutput(node)
                }
                status={storyboardStatus}
                started={Boolean(runningNode?.streamStarted)}
                generatedShotCount={runningNode?.generatedCount || 0}
                referenceItems={canvasReferenceItems.filter(
                  (item) => item.source !== "current" || item.id !== node.id,
                )}
                onOpenDetail={
                  storyboardHasResult && onShowNodeDetail
                    ? () => onShowNodeDetail(node)
                    : undefined
                }
              />
            </Suspense>
          ) : isStoryboardGridPower ? (
            <Suspense
              fallback={
                <CanvasModuleLoading label="正在加载分镜宫格" compact />
              }
            >
              <StoryboardGridCanvasView
                grid={storyboardGrid}
                aspectRatio={storyboardGridAspectRatio(node)}
                running={isPowerRunning}
                layout={node.composerDraft?.storyboardGridLayout}
                onLayoutChange={
                  onNodeDraftChange
                    ? (storyboardGridLayout) =>
                        onNodeDraftChange(node.id, {
                          ...(node.composerDraft || {}),
                          storyboardGridLayout,
                        })
                    : undefined
                }
                onImport={
                  onOpenStoryboardGridImport
                    ? () => onOpenStoryboardGridImport(node.id)
                    : undefined
                }
                onFrameImport={
                  onOpenStoryboardGridImport
                    ? (_frame, index) =>
                        onOpenStoryboardGridImport(node.id, index)
                    : undefined
                }
                onSlotImport={
                  onOpenStoryboardGridImport
                    ? (index) => onOpenStoryboardGridImport(node.id, index)
                    : undefined
                }
                onEdit={
                  storyboardGrid && onShowNodeDetail
                    ? () => onShowNodeDetail(node)
                    : undefined
                }
              />
            </Suspense>
          ) : hasPowerContent ? (
            <CanvasGeneratedNodeContent
              preview={preview}
              output={contentOutput}
              fallback={node.description}
              streaming={isPowerRunning && showStreamOutput}
              generating={isPowerRunning && hasPowerMedia && !showStreamOutput}
              onMediaSize={onMediaSize}
            />
          ) : (
            <PowerNodeEmptyState />
          )}
        </div>
        {node.runError && !isPowerRunning ? (
          <CanvasNodeErrorNotice
            projectId={projectId}
            node={node}
            onOpenDetail={
              onShowNodeDetail ? () => onShowNodeDetail(node) : undefined
            }
          />
        ) : null}
        <NodeHandle
          id="input-0"
          type="target"
          position={Position.Left}
          className="is-in"
        />
        <NodeHandle
          id="output-0"
          type="source"
          position={Position.Right}
          className="is-out"
        />
        {isStoryboardPower ||
        isStoryboardGridPower ||
        isVideoComposePower ? null : (
          <NodeQuickDetailButton
            node={node}
            onShowNodeDetail={onShowNodeDetail}
          />
        )}
        <NodeSelectionOverlays node={node} selected={selected} />
      </div>
    );
  }

  // Fallback
  return (
    <div className={`ws-node ${selected ? "is-selected" : ""}`}>
      <NodeHandle
        id="input-0"
        type="target"
        position={Position.Left}
        className="is-in"
      />
      <NodeHandle
        id="output-0"
        type="source"
        position={Position.Right}
        className="is-out"
      />
      <div className="ws-node-title">{node.title}</div>
      <div className="ws-node-desc">{node.description}</div>
      <NodeQuickDetailButton node={node} onShowNodeDetail={onShowNodeDetail} />
      <NodeSelectionOverlays node={node} selected={selected} />
    </div>
  );
}

function CanvasNodeErrorNotice({
  projectId,
  node,
  onOpenDetail,
}: {
  projectId: number;
  node: SpaceCanvasNode;
  onOpenDetail?: () => void;
}) {
  const { error } = useCanvasNodeRunError(projectId, node);
  const content = (
    <>
      <AlertCircle size={14} />
      <span>{error}</span>
    </>
  );
  return (
    <SpaceTooltip label={error}>
      {onOpenDetail ? (
        <button
          type="button"
          className="ws-node-run-error is-action nodrag nowheel"
          aria-label={`打开错误详情：${error}`}
          onClick={(event) => {
            event.stopPropagation();
            onOpenDetail();
          }}
        >
          {content}
        </button>
      ) : (
        <div className="ws-node-run-error">{content}</div>
      )}
    </SpaceTooltip>
  );
}

function CanvasGeneratedNodeContent({
  preview,
  output,
  fallback,
  streaming,
  generating = false,
  onMediaSize,
  showMediaCaption = true,
}: {
  preview: GeneratedNodePreview;
  output: any;
  fallback: string;
  streaming?: boolean;
  generating?: boolean;
  onMediaSize?: (width: number, height: number) => void;
  showMediaCaption?: boolean;
}) {
  const textRef = useRef<HTMLDivElement>(null);
  const followStreamRef = useRef(true);
  const caption = showMediaCaption ? mediaPreviewCaption(preview) : "";
  const useContentView = contentOutputNeedsRenderer(output, preview);

  useEffect(() => {
    if (!streaming) {
      followStreamRef.current = true;
      return;
    }
    const element = textRef.current;
    if (!element || !followStreamRef.current) {
      return;
    }
    element.scrollTop = element.scrollHeight;
  }, [preview.text, streaming]);

  if (!useContentView && preview.imageUrl) {
    return (
      <div
        className={`ws-node-generated-media ${generating ? "is-generating" : ""}`}
      >
        <CanvasStableImage
          src={preview.imageUrl}
          alt={caption || "生成图片"}
          onMediaSize={onMediaSize}
        />
        {caption ? <p>{caption}</p> : null}
        <CanvasMediaGenerationOverlay active={generating} />
      </div>
    );
  }
  if (!useContentView && preview.videoUrl) {
    return (
      <div
        className={`ws-node-generated-media ${generating ? "is-generating" : ""}`}
      >
        <FirstFrameVideo
          key={preview.videoUrl}
          src={preview.videoUrl}
          className="nopan nowheel"
          controls
          playsInline
          preload="metadata"
          onLoadedMetadata={(event) =>
            onMediaSize?.(
              event.currentTarget.videoWidth,
              event.currentTarget.videoHeight,
            )
          }
        />
        {caption ? <p>{caption}</p> : null}
        <CanvasMediaGenerationOverlay active={generating} />
      </div>
    );
  }
  if (!useContentView && preview.audioUrl) {
    return (
      <div
        className={`ws-node-generated-media is-audio ${generating ? "is-generating" : ""}`}
      >
        <Suspense
          fallback={<CanvasModuleLoading label="正在加载音频" compact />}
        >
          <AssetAudioPreview src={preview.audioUrl} autoPlay={streaming} />
        </Suspense>
        <CanvasMediaGenerationOverlay active={generating} />
      </div>
    );
  }
  if (!useContentView && preview.fileUrl) {
    return (
      <div className="ws-node-generated-file">
        <FileText size={16} />
        <span>{caption || "文件内容"}</span>
      </div>
    );
  }
  return (
    <div
      ref={textRef}
      className="ws-node-generated-text ws-node-scroll-content nowheel"
      onScroll={(event) => {
        const element = event.currentTarget;
        followStreamRef.current =
          element.scrollHeight - element.scrollTop - element.clientHeight < 12;
      }}
    >
      <CanvasNodeContentView
        output={output}
        fallback={preview.text || fallback}
        streaming={streaming}
        mediaGridKind={canvasMediaGridKind(preview)}
        className="ws-canvas-content-view"
      />
    </div>
  );
}

function CanvasStableImage({
  src,
  alt,
  className,
  onMediaSize,
}: {
  src: string;
  alt: string;
  className?: string;
  onMediaSize?: (width: number, height: number) => void;
}) {
  const [displayedSrc, setDisplayedSrc] = useState(src);

  useEffect(() => {
    if (!src || src === displayedSrc) {
      return;
    }
    let active = true;
    const image = new Image();
    image.onload = () => {
      const decoded = image.decode?.() || Promise.resolve();
      void decoded
        .catch(() => undefined)
        .then(() => {
          if (active) {
            setDisplayedSrc(src);
          }
        });
    };
    image.src = src;
    return () => {
      active = false;
      image.onload = null;
    };
  }, [displayedSrc, src]);

  return (
    <img
      src={displayedSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onLoad={(event) =>
        onMediaSize?.(
          event.currentTarget.naturalWidth,
          event.currentTarget.naturalHeight,
        )
      }
    />
  );
}

function CanvasMediaGenerationOverlay({ active }: { active: boolean }) {
  if (!active) {
    return null;
  }
  return (
    <div
      className="ws-node-media-generating nodrag nopan nowheel"
      role="status"
      aria-live="polite"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <Loader2 size={18} className="ws-spin" />
      <span>生成中</span>
    </div>
  );
}

function mediaPreviewCaption(preview: GeneratedNodePreview) {
  const text = String(preview.text || "").trim();
  if (!text || looksLikeURL(text)) {
    return "";
  }
  return text;
}

function generatedMediaNodeSize(
  width: number,
  height: number,
): Pick<SpaceCanvasNode, "width" | "height"> | null {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return null;
  }
  const ratio = width / height;
  const maxWidth = 330;
  const maxHeight = 340;
  let nextWidth = maxWidth;
  let nextHeight = nextWidth / ratio;
  if (nextHeight > maxHeight) {
    nextHeight = maxHeight;
    nextWidth = nextHeight * ratio;
  }
  return {
    width: Math.round(clampNumber(nextWidth, 150, maxWidth)),
    height: Math.round(clampNumber(nextHeight, 150, maxHeight)),
  };
}

function generatedMediaAutoSizeHandler(
  node: SpaceCanvasNode,
  onNodeResult?: NodeResultSetter,
  heightOffset = 0,
) {
  if (node.groupId || !onNodeResult) {
    return undefined;
  }
  return (width: number, height: number) => {
    const contentSize = generatedMediaNodeSize(width, height);
    if (!contentSize) {
      return;
    }
    const nextSize = {
      width: contentSize.width,
      height: contentSize.height + heightOffset,
    };
    if (
      Math.abs((node.width || 0) - nextSize.width) <= 2 &&
      Math.abs((node.height || 0) - nextSize.height) <= 2
    ) {
      return;
    }
    onNodeResult(node.id, nextSize);
  };
}

function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function PowerNodeEmptyState() {
  return (
    <div className="ws-node-power-empty" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function miniMapNodeClassName(node: Node) {
  return node.type === "storyboardFrame" ? "ws-minimap-storyboard-frame" : "";
}

function miniMapFlowNodeColor(node: Node) {
  return node.type === "storyboardFrame"
    ? "transparent"
    : miniMapNodeColor(node.data as SpaceCanvasNode);
}

function miniMapNodeColor(node: SpaceCanvasNode) {
  if (node.type === "group") return "#e85d75";
  if (node.type === "asset") return "#23c483";
  if (node.type === "power") return "#8b5cf6";
  if (node.type === "agent") return "#f59e0b";
  if (node.type === "flow") return "#3b82f6";
  return "#e85d75";
}

function readProjectId() {
  if (typeof window === "undefined") {
    return 0;
  }
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("project_id") || params.get("id") || 0);
}
