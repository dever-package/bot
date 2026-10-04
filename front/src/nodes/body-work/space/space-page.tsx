import {
  createContext,
  memo,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
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
  type OnConnectEnd,
  type OnConnectStart,
  type OnInit,
  type IsValidConnection,
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
  Link2,
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
  Video,
  Workflow,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { requestErrorMessage as errorMessage } from "../shared/api-response";
import { useNavigate, useTheme } from "@dever/front-plugin";
import { useBodyLoginConfig } from "../auth/site-config";
import "../shared/body-theme.css";
import { useBodyAppearance } from "../shared/use-body-appearance";
import { PlayableVideoPreview } from "../../shared/playable-video-preview";
import type { AgentInteraction } from "@/components/agent/interaction-panel";
import {
  confirmSpaceStoryboard,
  createSpaceCanvas,
  deleteSpaceCanvas,
  fetchDeletedSpaceCanvases,
  fetchSpaceBootstrap,
  fetchSpaceCanvas,
  fetchSpaceCanvasExecution,
  fetchSpaceCanvasExecutions,
  fetchSpacePowerForm,
  fetchSpaceRunStatus,
  generateSpaceCanvasNodeTitle,
  renameSpaceCanvas,
  reorderSpaceCanvases,
  restoreSpaceCanvas,
  submitSpaceCanvasFeedback,
  submitSpaceInteraction,
  runSpaceCanvas,
  saveSpaceAssetEditVersion,
  saveSpaceCanvasContent,
  saveSpaceCanvasMaterial,
  stopAllSpaceCanvasRuns,
  stopSpaceCanvasRun,
} from "./space-api";
import { useCanvasAutosave, type CanvasSaveStatus } from "./space-autosave";
import {
  canvasEdgeCarriesMedia,
  canvasEdgePurpose,
  replaceVisibleCanvasEdges,
} from "./space-canvas-edge";
import { SpaceCatalogCache } from "./space-catalog-cache";
import {
  canvasGroupRunTargetNodeIds,
  storyboardRunBlockedReason,
  summarizeCanvasGroupRuntime,
  type CanvasGroupRuntimeSummary,
} from "./space-group-runtime";
import {
  canConnectCanvasNodes,
  canvasConnectionSourceNodes,
  canvasGroupMembers,
  constrainScriptGroupMemberPosition,
  reconcileCanvasGroupEdges,
  withCanvasNodeGroupAtPosition,
  withMovedCanvasNode,
} from "./space-group-model";
import { PowerIcon } from "../shared/power-icon";
import { CanvasViewControls, NodeActionMenu } from "./space-workbench";
import { useTransientFlowNodes } from "./use-transient-flow-nodes";
import { useStableFlowNodeReferences } from "./use-stable-flow-nodes";
import { createStableCallbackProxy } from "./space-stable-callback";
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
import {
  invalidateAssetFilterOptionsCache,
  normalizeAssetRecord,
} from "../asset/asset-api";
import { assetRecordHasUsableContent } from "../asset/asset-contract";
import type { AssetRecord } from "../asset/asset-types";
import {
  mergeProjectAssets,
  mergeProjectAssetVersionHistory,
  resultAssetKind,
  runResultAsset,
  withRunResultAsset,
} from "./space-assets";
import {
  buildNodeResultRef,
  canvasNodeCoversRunResult,
  canvasResultSourceFromNode,
} from "./space-result";
import { buildCanvasAssetIndex } from "./space-asset-index";
import { buildCanvasReferenceItems } from "./space-composer-reference";
import {
  canvasRunIdentity,
  normalizeCanvasRunRef,
  normalizeCanvasNodeResultPayload,
  canvasNodeResultErrorMessage,
  canvasRunErrorMessage,
  canvasRunNodeResultStatus,
  isActiveCanvasRun,
  isCanvasRunTerminalStatus,
  isCanvasRunCanceledError,
  type CanvasNodeResultRef,
  type CanvasRunRef,
} from "./space-runner";
import {
  canvasExecutionFallbackRunningNodeId,
  canvasExecutionNodeIds,
  canvasExecutionOptimisticNodeIds,
  canvasNodeStopsExecution,
  clearCanvasExecutionNodeErrors,
} from "./space-execution-plan";
import {
  canvasFunctionDefinition,
  isCanvasFunctionNode,
} from "./space-function";
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
import type { AssetUploadOptions } from "../asset/asset-upload-progress";
import { documentPreview } from "../shared/rich-document";
import {
  assetCateById,
  assetCateFromList,
  createLocalNode,
  defaultAssetCateId,
  emptyCanvasState,
  hasDefaultCanvasNodeSize,
  hydrateCanvasPowerCatalog,
  isCreationPower,
  isCreationRole,
  isDefaultCanvasNodeTitle,
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
  CanvasSummary,
  CanvasComposerDraft,
  ComposerAssetItem,
  CanvasFunctionOption,
  CanvasResultSourceRef,
  CanvasResultViewState,
  CanvasNodeRunTiming,
  PowerOption,
  PowerParam,
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
import { mergeCanvasComposerParamValues as mergeSavedComposerParamValues } from "./space-power-param";
import { filterActivePowerParams } from "./space-power-param-runtime";
import {
  availableCanvasTextBindingParams,
  canvasNodeSupportsStoryboardLyrics,
  canvasNodeSupportsTextBinding,
  canvasTextBindingParamAvailable,
  canvasTextConnectionSummary,
  removeCanvasParamBindingsForSources,
  removeCanvasTextConnectionBinding,
  replaceCanvasParamBindingForConnection,
  resolveAutomaticCanvasTextBindingRepair,
  resolveCanvasTextBindingDecision,
  resolveCanvasTextBindingControl,
  withCanvasStoryboardLyricsSource,
} from "./space-param-binding";
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
  contentOutputNeedsRenderer,
} from "./space-content-output";
import { CanvasNodeContentView } from "./space-content-view";
import {
  firstNonEmptyText,
  contentOutputHasMedia,
  contentOutputMediaURLs,
  parseStoryboardGridOutput,
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
  canvasStoryboardSourceRequiresMaterialization,
  isStoryboardDerivedPromptOverridden,
  materializeCanvasStoryboardDerivedGroups,
  refreshCanvasStoryboardDerivedGroups,
  restoredStoryboardDerivedPrompt,
} from "./space-storyboard-derived-groups";
import { storyboardSourceNodeIdsAffectedByNodeUpdate } from "./space-storyboard-derived-update";
import { canvasStoryboardUpdateMode } from "./space-storyboard-materialization";
import { storyboardEditorFocusFromNode } from "./space-storyboard-focus";
import {
  buildStoryboardFrameIndex,
  markStoryboardFrameResultsCurrent,
  storyboardFrameId,
  storyboardFrameRunSummary,
  storyboardFrameScopes,
  storyboardSourceNodeIdForNode,
  storyboardStructureLockedNodeIds,
  type StoryboardFrameScope,
} from "./space-storyboard-frame";
import {
  isStoryboardConfirmed,
  parseStoryboardOutput,
  type StoryboardEditorFocus,
  type StoryboardProductionPlan,
} from "./space-storyboard";
import {
  firstDefinedValue as firstDefined,
  parseMaybeJSON,
  safeJSONString,
} from "../shared/structured-json";
import type { StoryboardNodeStatus } from "./space-storyboard-node";
import {
  resolveCanvasResultViewDraft,
  updateCanvasResultViewDraft,
  type CanvasResultViewDraft,
} from "./space-result-view-state";
import { useCanvasNodeRunError } from "./space-run-error";
import { CanvasNodeRunTimingView } from "./space-node-run-timing";
import {
  normalizeCanvasEstimatedDuration,
  normalizeCanvasNodeRunTiming,
  resolveCanvasActiveRunStartedAt,
} from "./space-run-timing";
import { SpaceTooltip } from "./space-tooltip";
import { CanvasModuleLoading } from "./space-loading";
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
  type NodeDraftUpdateOptions,
  type NodeInputContext,
  type NodeResultSetter,
  type NodeStartRunner,
  type RunningNodeMap,
  type RunningNodeSetter,
  type RunningNodeState,
  type StoryboardFrameRunner,
  type StoryboardWorkspaceData,
  type StoryboardWorkspaceGroupData,
  type StoryboardWorkspaceResultData,
  type WorkspaceNodeData,
} from "./space-node-runtime";
import {
  applyRunningNodeUpdateBatch,
  mergeRunningNodeUpdate,
  type RunningNodeStateUpdate,
  type RunningNodeUpdateBatch,
} from "./space-running-node-batcher";
import {
  AgentInteractionPanel,
  AddNodeMenu,
  AssetAudioPreview,
  AssetBrowser,
  AssetDetailDialog,
  AssetPickerDialog,
  CanvasAgentResultContent,
  CanvasGroupNodeView,
  CanvasParamBindingDialog,
  CanvasResultView,
  hasResultPreviewMedia,
  CanvasRunHistoryDrawer,
  CanvasNodeSettings,
  NodeDetailDialog,
  SpaceCanvasManagerDialog,
  StoryboardGridCanvasView,
  SpaceAssistant,
  StoryboardConfirmDialog,
  StoryboardNodeContent,
  VideoComposeView,
  preloadAddNodeMenu,
  preloadAssetBrowser,
  preloadAssetDetailDialog,
  preloadAssetPickerDialog,
  preloadCanvasRunHistoryDrawer,
  preloadCanvasNodeSettings,
  preloadNodeDetailDialog,
  preloadSpaceAssistant,
} from "./space-optional-components";
import { SpaceAssistantLauncher } from "./space-assistant-launcher";
import {
  clampSpaceAssistantWidth,
  resolveSpaceAssistantVisibility,
  SPACE_ASSISTANT_DEFAULT_WIDTH,
  SPACE_ASSISTANT_OPEN_STORAGE_KEY,
  SPACE_ASSISTANT_WIDTH_STORAGE_KEY,
  storedSpaceAssistantOpen,
} from "./space-assistant-layout";
import {
  displayTextFromOutput,
  extractDisplayOutput,
  firstDisplayOutput,
  firstTiptapRichDocument,
  generatedPreviewFromValue,
  hasContextOutput,
  hasDisplayOutput,
  hasGeneratedPreview,
  looksLikeURL,
  mergeGeneratedPreview,
  nodeContextOutput,
  nodeDisplayText,
  previewKindFromOutput,
  previewKindFromTextHint,
  richDocumentFromNode,
  stringifyContextValue,
} from "./space-output-protocol";
type WorkMode = "create" | "result";
type WorkSpaceTheme = "dark" | "light";
type UnknownRecord = Record<string, unknown>;

function isUnknownRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asUnknownRecord(value: unknown): UnknownRecord {
  return isUnknownRecord(value) ? value : {};
}

function valueAtUnknownPath(
  value: unknown,
  ...path: readonly string[]
): unknown {
  let current = value;
  for (const key of path) {
    if (!isUnknownRecord(current)) {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

const EMPTY_RUNNING_NODE_MAP: RunningNodeMap = {};
const EMPTY_CANVAS_NODES: SpaceCanvasNode[] = [];
const EMPTY_CANVAS_REFERENCE_ITEMS: ComposerAssetItem[] = [];
const EMPTY_CANVAS_MEDIA_REFERENCES: CanvasConnectedMediaReference[] = [];
const EMPTY_CANVAS_EDGE_IDS: ReadonlySet<string> = new Set<string>();
const CANVAS_NODE_TITLE_PROMPT_LIMIT = 800;
type RunningNodeBatcher = {
  enqueue: (nodeId: string, update: RunningNodeStateUpdate) => void;
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
type ReferenceAssetDetailTarget = {
  nodeId: string;
  assetID: number;
};
type CanvasRunInputOptions = {
  assetCate: AssetCate;
  startNode: SpaceCanvasNode;
  canvas: SpaceCanvasState;
  nodes?: SpaceCanvasNode[];
  singleNode?: boolean;
  targetNodeIds?: string[];
  executionScope?: "storyboard_frame";
  patchStartNodeResult?: boolean;
  runInput?: Record<string, unknown>;
  onCanvasRunChange?: (run: CanvasRunRef) => void;
};

function useRunningNodeBatcher(
  setRunningNode: RunningNodeSetter,
): RunningNodeBatcher {
  const pendingUpdatesRef = useRef<RunningNodeUpdateBatch>(new Map());
  const flushTimerRef = useRef(0);
  const flush = useCallback(() => {
    if (flushTimerRef.current) {
      window.clearTimeout(flushTimerRef.current);
      flushTimerRef.current = 0;
    }
    const updates = pendingUpdatesRef.current;
    pendingUpdatesRef.current = new Map();
    if (updates.size === 0) {
      return;
    }
    setRunningNode((current) => applyRunningNodeUpdateBatch(current, updates));
  }, [setRunningNode]);
  const enqueue = useCallback(
    (nodeId: string, update: RunningNodeStateUpdate) => {
      mergeRunningNodeUpdate(pendingUpdatesRef.current, nodeId, update);
      if (flushTimerRef.current) {
        return;
      }
      flushTimerRef.current = window.setTimeout(() => {
        flushTimerRef.current = 0;
        flush();
      }, runningNodeFlushIntervalMs);
    },
    [flush],
  );
  useEffect(
    () => () => {
      if (flushTimerRef.current) {
        window.clearTimeout(flushTimerRef.current);
      }
      pendingUpdatesRef.current = new Map();
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
  contextMenuHandled: boolean;
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
type PendingNodeConnection = {
  nodeId: string;
  handleId?: string | null;
  handleType?: string | null;
};
type PendingParamBindingConnection = {
  sourceNodeId: string;
  targetNodeId: string;
  sourceTitle: string;
  targetTitle: string;
  params: PowerParam[];
  selectedParamKey?: string;
  lyricsAvailable: boolean;
  lyricsSelected: boolean;
  editing: boolean;
};
type CanvasEdgeCommitOptions = {
  draftByNodeId?: ReadonlyMap<string, CanvasComposerDraft>;
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
  workSpace: memo(SpaceNodeView, workspaceNodePropsEqual),
};
const EmbeddedCanvasNodeContext = createContext(false);

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
  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  return useMemo(() => createStableCallbackProxy(callbackRef), []);
}

export function WorkSpacePage({
  onInitialLoadComplete,
}: {
  onInitialLoadComplete: () => void;
}) {
  const navigate = useNavigate();
  const loginConfig = useBodyLoginConfig();
  const projectId = useMemo(() => readProjectId(), []);
  const requestedCanvasId = useMemo(() => readCanvasId(), []);
  const catalogCache = useMemo(() => new SpaceCatalogCache(), []);
  const [space, setSpace] = useState<SpaceBootstrap | null>(null);
  const [activeCanvasId, setActiveCanvasId] = useState(requestedCanvasId);
  const activeCanvasIdRef = useRef(requestedCanvasId);
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
  const [canvasManagerOpen, setCanvasManagerOpen] = useState(false);
  const [deletedCanvases, setDeletedCanvases] = useState<CanvasSummary[]>([]);
  const [deletedCanvasLoading, setDeletedCanvasLoading] = useState(false);
  const deletedCanvasRequestRef = useRef(0);
  const [workMode, setWorkMode] = useState<WorkMode>("create");
  const [assistantOpen, setAssistantOpen] = useState(() =>
    readStoredAssistantOpen(projectId),
  );
  const [assistantExpanded, setAssistantExpanded] = useState(false);
  const [assistantWidth, setAssistantWidth] = useState(() =>
    readStoredAssistantWidth(),
  );
  const { resolvedTheme: theme, setTheme } = useTheme();
  useBodyAppearance(loginConfig.site.appearance, theme);
  const [nodeMenu, setNodeMenu] = useState<AddNodeMenuState | null>(null);
  const [loading, setLoading] = useState(true);
  const initialLoadingRef = useRef(true);
  const [runningNodes, setRunningNodes] = useState<RunningNodeMap>({});
  const runningNodesRef = useRef(runningNodes);
  runningNodesRef.current = runningNodes;
  const runningNodeBatcher = useRunningNodeBatcher(setRunningNodes);
  const [nodeResultOverrides, setNodeResultOverrides] = useState<
    Record<string, Partial<SpaceCanvasNode>>
  >({});
  const [nodeDetail, setNodeDetail] = useState<SpaceCanvasNode | null>(null);
  const [storyboardToConfirm, setStoryboardToConfirm] = useState<{
    canvasId: number;
    nodeId: string;
  } | null>(null);
  const pageContainerRef = useRef<HTMLElement | null>(null);
  const [confirmingStoryboard, setConfirmingStoryboard] = useState(false);
  const [referenceAssetDetail, setReferenceAssetDetail] =
    useState<ReferenceAssetDetailTarget | null>(null);
  const [storyboardDetailFocus, setStoryboardDetailFocus] =
    useState<StoryboardEditorFocus>();
  const [storyboardDetailSectionId, setStoryboardDetailSectionId] =
    useState<string>();
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
  const locallyManagedCanvasRunRequestIdsRef = useRef<Set<string>>(new Set());
  const [
    locallyManagedCanvasRunRequestIds,
    setLocallyManagedCanvasRunRequestIds,
  ] = useState<ReadonlySet<string>>(() => new Set());
  const [
    pendingStoryboardMaterializations,
    setPendingStoryboardMaterializations,
  ] = useState<Record<string, { canvasId: number; nodeId: string }>>({});
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
    load: loadPowerCatalog,
  } = useSpacePowerCatalog({
    space,
    canvases: canvasStates,
    cache: catalogCache,
  });

  useEffect(() => {
    setPendingStoryboardMaterializations({});
  }, [space?.project.id, space?.project.release_id, space?.release?.id]);

  useEffect(() => {
    canvasStatesRef.current = canvasStates;
  }, [canvasStates]);

  useEffect(() => {
    activeCateIdRef.current = activeCateId;
  }, [activeCateId]);

  useEffect(() => {
    activeCanvasIdRef.current = activeCanvasId;
  }, [activeCanvasId]);

  useEffect(() => {
    canvasRunRecordsRef.current = canvasRunRecords;
  }, [canvasRunRecords]);

  const updateLocallyManagedCanvasRun = useCallback(
    (requestId: string, managed: boolean) => {
      requestId = requestId.trim();
      if (!requestId) {
        return;
      }
      const current = locallyManagedCanvasRunRequestIdsRef.current;
      if (current.has(requestId) === managed) {
        return;
      }
      const next = new Set(current);
      if (managed) {
        next.add(requestId);
      } else {
        next.delete(requestId);
      }
      locallyManagedCanvasRunRequestIdsRef.current = next;
      setLocallyManagedCanvasRunRequestIds(next);
    },
    [],
  );

  const rememberCanvasRunRecord = useCallback(
    (run: CanvasRunRef) => {
      const normalized = normalizeWorkspaceCanvasRun(run);
      if (!normalized) {
        return;
      }
      const requestId = String(normalized.request_id || "").trim();
      if (requestId) {
        updateLocallyManagedCanvasRun(requestId, isActiveCanvasRun(normalized));
      }
      const nextRecords = mergeWorkspaceCanvasRunRecords(
        canvasRunRecordsRef.current,
        [normalized],
      );
      canvasRunRecordsRef.current = nextRecords;
      setCanvasRunRecords(nextRecords);
    },
    [updateLocallyManagedCanvasRun],
  );

  const releaseLocallyManagedCanvasRun = useCallback(
    (run: CanvasRunRef | null | undefined) => {
      const requestId = String(run?.request_id || "").trim();
      if (requestId) {
        updateLocallyManagedCanvasRun(requestId, false);
      }
    },
    [updateLocallyManagedCanvasRun],
  );

  const handleCanvasSaveError = useCallback((err: unknown) => {
    toast.error(err instanceof Error ? err.message : "保存画布失败");
  }, []);
  const {
    markCanvasDirty,
    flushCanvasSave,
    adoptCanvasSnapshot,
    forgetCanvasSnapshot,
    resetCanvasAutosave,
    canvasSaveStatus,
  } = useCanvasAutosave({
    projectId,
    enabled: Boolean(space),
    canvases: canvasStates,
    setCanvases: setCanvasStates,
    onError: handleCanvasSaveError,
  });
  const loadRuntimeExecutions = useStableCallback(
    loadWorkspaceCanvasRuntimeExecutions,
  );
  const applyRunRecordsToCanvas = useStableCallback(
    applyCanvasRunRecordsToCanvas,
  );

  useEffect(() => {
    if (changedCanvasKeysRef.current.size === 0) {
      return;
    }
    const changedKeys = [...changedCanvasKeysRef.current];
    changedCanvasKeysRef.current.clear();
    for (const canvasId of changedKeys) {
      markCanvasDirty(canvasId);
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
        activeCanvasIdRef.current,
        activeCateIdRef.current,
      );
      const canvases = hydrateCanvasMapAssets(
        nextSpace.canvases || {},
        nextSpace.assets || [],
      );
      const initialCanvasId =
        Number(nextSpace.initialCanvasId || 0) ||
        Number(Object.values(canvases)[0]?.id || 0);
      const initialCateId =
        Number(nextSpace.initialAssetCateId || 0) ||
        defaultAssetCateId(nextSpace);
      setSpace(nextSpace);
      canvasStatesRef.current = canvases;
      setCanvasStates(canvases);
      resetCanvasAutosave(canvases);
      activeCanvasIdRef.current = initialCanvasId;
      setActiveCanvasId(initialCanvasId);
      activeCateIdRef.current = initialCateId;
      setActiveCateId(initialCateId);
      writeCanvasId(initialCanvasId);
      setLoadingCateId(null);
      loadingCateIdRef.current = null;
      deletedCanvasRequestRef.current += 1;
      setCanvasManagerOpen(false);
      setDeletedCanvases([]);
      setDeletedCanvasLoading(false);
      requestedNodeTitlesRef.current = new Set();
      appliedCanvasRunsRef.current = new Set();
      canvasRunRecordsRef.current = [];
      setCanvasRunRecords([]);
      locallyManagedCanvasRunRequestIdsRef.current = new Set();
      setLocallyManagedCanvasRunRequestIds(new Set());
      setCanvasRunHistoryRecords([]);
      setCanvasRunHistoryPage(1);
      setCanvasRunHistoryHasMore(false);
      canvasHistoryBeforeIDsRef.current = [0];
      void loadRuntimeExecutions(projectId, nextSpace, canvases, "recovery", {
        canvasId: initialCanvasId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载创作空间失败");
    } finally {
      setLoading(false);
    }
  }, [loadRuntimeExecutions, projectId, resetCanvasAutosave]);

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
  const hasAssetCates = cates.length > 1;
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
  const lipSyncAvailable = useMemo(
    () =>
      powers.some(
        (power) =>
          Number(power.id || 0) > 0 &&
          String(power.kind || "")
            .trim()
            .toLowerCase() === "video" &&
          resolvePowerPresentation(power).outputType === "lip_sync",
      ),
    [powers],
  );
  const activeCanvas = useMemo(() => {
    const summary = space?.canvasList.find(
      (canvas) => canvas.id === activeCanvasId,
    );
    return (
      canvasStates[String(activeCanvasId)] ||
      emptyCanvasState(
        summary?.assetCateId || activeCate?.id || 0,
        activeCanvasId,
        summary?.name || "第一幕",
      )
    );
  }, [activeCanvasId, activeCate?.id, canvasStates, space?.canvasList]);
  const activeCateCanvases = useMemo(
    () =>
      (space?.canvasList || [])
        .filter((canvas) => canvas.assetCateId === activeCate?.id)
        .sort((left, right) => left.sort - right.sort || left.id - right.id),
    [activeCate?.id, space?.canvasList],
  );
  const loadDeletedCanvases = useCallback(
    async (assetCateId: number) => {
      const requestID = deletedCanvasRequestRef.current + 1;
      deletedCanvasRequestRef.current = requestID;
      setDeletedCanvasLoading(true);
      try {
        const rows = await fetchDeletedSpaceCanvases({
          projectId,
          assetCateId,
        });
        if (deletedCanvasRequestRef.current === requestID) {
          setDeletedCanvases(rows);
        }
      } catch (err) {
        if (deletedCanvasRequestRef.current === requestID) {
          setDeletedCanvases([]);
          toast.error(
            err instanceof Error ? err.message : "加载已删除画布失败",
          );
        }
      } finally {
        if (deletedCanvasRequestRef.current === requestID) {
          setDeletedCanvasLoading(false);
        }
      }
    },
    [projectId],
  );
  const openCanvasManager = useCallback(() => {
    if (!activeCate) return;
    setCanvasManagerOpen(true);
    setDeletedCanvases([]);
    void loadDeletedCanvases(activeCate.id);
  }, [activeCate, loadDeletedCanvases]);
  const canvasModel = useMemo(
    () => applyNodeResultOverrides(activeCanvas, nodeResultOverrides),
    [activeCanvas, nodeResultOverrides],
  );
  const assistantSelectedNodes = useMemo(() => {
    const selected = new Set(selectedNodeIds);
    return canvasModel.nodes.filter((node) => selected.has(node.id));
  }, [canvasModel.nodes, selectedNodeIds]);
  const handleAssistantCanvasChanged = useCallback(
    async (canvasId: number) => {
      const bundle = await fetchSpaceCanvas({
        projectId,
        canvasId,
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
              canvasList:
                bundle.canvasList.length > 0
                  ? bundle.canvasList
                  : current.canvasList,
            }
          : current,
      );
      const key = String(canvasId);
      const nextCanvases = {
        ...canvasStatesRef.current,
        [key]: hydratedCanvas,
      };
      canvasStatesRef.current = nextCanvases;
      setCanvasStates(nextCanvases);
      adoptCanvasSnapshot(hydratedCanvas);
    },
    [adoptCanvasSnapshot, powers, projectId],
  );
  const updateAssistantWidth = useCallback((width: number) => {
    const nextWidth = clampSpaceAssistantWidth(width);
    setAssistantWidth(nextWidth);
    writeSpaceAssistantStorage(
      SPACE_ASSISTANT_WIDTH_STORAGE_KEY,
      String(nextWidth),
    );
  }, []);
  const updateAssistantOpen = useCallback(
    (open: boolean) => {
      setAssistantOpen(open);
      if (!open) {
        setAssistantExpanded(false);
      }
      writeSpaceAssistantStorage(
        `${SPACE_ASSISTANT_OPEN_STORAGE_KEY}:${projectId}`,
        open ? "1" : "0",
      );
    },
    [projectId],
  );
  const storyboardGridImportLimit = STORYBOARD_GRID_MAX_IMAGES;
  const canvasAssetEntries = useMemo(
    () =>
      buildCanvasAssetIndex({
        nodes: canvasModel.nodes,
        assets: space?.assets || [],
        canvasId: activeCanvas.id,
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
    [activeCanvas.id, activeCate?.id, canvasModel.nodes, space?.assets],
  );
  const canvasReferenceItems = useMemo(
    () => buildCanvasReferenceItems(canvasAssetEntries),
    [canvasAssetEntries],
  );
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
      canvasId: number,
      updater: (canvas: SpaceCanvasState) => SpaceCanvasState,
    ) => {
      if (!Number.isInteger(canvasId) || canvasId <= 0) {
        return;
      }
      const applyUpdate = (current: Record<string, SpaceCanvasState>) => {
        const key = String(canvasId);
        const currentCanvas = current[key];
        if (!currentCanvas) return current;
        const nextCanvas = normalizeCanvasForState(
          updater(currentCanvas),
          currentCanvas.assetCateId,
        );
        if (isSameCanvasState(currentCanvas, nextCanvas)) {
          return current;
        }
        changedCanvasKeysRef.current.add(canvasId);
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
      updateCanvasState(activeCanvas.id, updater);
    },
    [activeCanvas.id, activeCate, updateCanvasState],
  );

  const updateCanvasNodeResult = useCallback(
    (canvasId: number, nodeId: string, patch: Partial<SpaceCanvasNode>) => {
      const currentCanvas = canvasStatesRef.current[String(canvasId)];
      const currentNode = currentCanvas?.nodes.find(
        (node) => node.id === nodeId,
      );
      const storyboardUpdateMode = canvasStoryboardUpdateMode(
        canvasStoryboardSourceRequiresMaterialization(currentNode, patch),
        powerCatalogLoaded && Boolean(canvasAssetCates),
      );
      if (storyboardUpdateMode === "defer-materialize") {
        setPendingStoryboardMaterializations((current) => ({
          ...current,
          [`${canvasId}:${nodeId}`]: { canvasId, nodeId },
        }));
        if (!powerCatalogLoaded) {
          void loadPowerCatalog();
        }
      }
      if (activeCanvasIdRef.current === canvasId) {
        setNodeResultOverrides((current) =>
          removeCommittedNodeOverrideFields(current, nodeId, patch),
        );
      }
      updateCanvasState(canvasId, (currentCanvas) => {
        const assetCateId = currentCanvas.assetCateId;
        const patchedCanvas = {
          ...currentCanvas,
          nodes: currentCanvas.nodes.map((node) =>
            node.id === nodeId ? { ...node, ...patch } : node,
          ),
        };
        if (!canvasAssetCates) {
          return patchedCanvas;
        }
        const syncInput = {
          canvas: patchedCanvas,
          assetCate: assetCateFromList(canvasAssetCates, assetCateId),
          powers,
        };
        if (storyboardUpdateMode === "materialize") {
          return materializeCanvasStoryboardDerivedGroups({
            ...syncInput,
            sourceNodeId: nodeId,
          });
        }
        if (storyboardUpdateMode === "defer-materialize") {
          return patchedCanvas;
        }
        const sourceNodeIds = storyboardSourceNodeIdsAffectedByNodeUpdate(
          patchedCanvas.nodes,
          nodeId,
        );
        return sourceNodeIds.length
          ? refreshCanvasStoryboardDerivedGroups({
              ...syncInput,
              sourceNodeIds,
            })
          : patchedCanvas;
      });
    },
    [
      canvasAssetCates,
      loadPowerCatalog,
      powerCatalogLoaded,
      powers,
      updateCanvasState,
    ],
  );

  useEffect(() => {
    if (
      !powerCatalogLoaded ||
      !canvasAssetCates ||
      Object.keys(pendingStoryboardMaterializations).length === 0
    ) {
      return;
    }
    const pending = Object.values(pendingStoryboardMaterializations);
    setPendingStoryboardMaterializations({});
    for (const { canvasId, nodeId } of pending) {
      updateCanvasState(canvasId, (canvas) =>
        materializeCanvasStoryboardDerivedGroups({
          canvas,
          assetCate: assetCateFromList(canvasAssetCates, canvas.assetCateId),
          powers,
          sourceNodeId: nodeId,
        }),
      );
    }
  }, [
    canvasAssetCates,
    pendingStoryboardMaterializations,
    powerCatalogLoaded,
    powers,
    updateCanvasState,
  ]);

  const updateNodeResult = useCallback<NodeResultSetter>(
    (nodeId, patch) => {
      updateCanvasNodeResult(activeCanvas.id, nodeId, patch);
      if (activeCanvasIdRef.current === activeCanvas.id) {
        setNodeDetail((current) =>
          current?.id === nodeId ? { ...current, ...patch } : current,
        );
      }
    },
    [activeCanvas.id, updateCanvasNodeResult],
  );

  const requestGeneratedNodeTitle = useCallback(
    (canvasId: number, node: SpaceCanvasNode, result: CanvasNodeResultRef) => {
      if (!shouldGenerateCanvasNodeTitle(node, result)) {
        return;
      }
      const versionId = Number(result.version_id || 0);
      const requestKey = `${canvasId}:${node.id}:${versionId}`;
      if (requestedNodeTitlesRef.current.has(requestKey)) {
        return;
      }
      requestedNodeTitlesRef.current.add(requestKey);
      const expectedTitle = node.title.trim();
      const canvas = canvasStatesRef.current[String(canvasId)];
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
          updateCanvasState(canvasId, (currentCanvas) => {
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
      if (input.canvasId) {
        markCanvasDirty(input.canvasId);
      }
    },
    [markCanvasDirty],
  );

  const updateNodeComposerDraft = useCallback<NodeDraftSetter>(
    (nodeId, draft, options) => {
      const updateResult: { canvas?: SpaceCanvasState } = {};
      updateActiveCanvas((canvas) => {
        const nodes = canvas.nodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                composerDraft: normalizeComposerDraft(draft),
              }
            : node,
        );
        updateResult.canvas = { ...canvas, nodes };
        return updateResult.canvas;
      });
      if (options?.save === "immediate" && updateResult.canvas) {
        void flushCanvasSave(updateResult.canvas).catch(() => undefined);
      }
    },
    [flushCanvasSave, updateActiveCanvas],
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
    (
      node: SpaceCanvasNode,
      focus?: StoryboardEditorFocus,
      storyboardSectionId?: string,
    ) => {
      const referenceTarget = referenceAssetDetailTarget(node);
      if (referenceTarget) {
        void preloadAssetDetailDialog();
        setNodeDetail(null);
        setStoryboardDetailFocus(undefined);
        setStoryboardDetailSectionId(undefined);
        setReferenceAssetDetail(referenceTarget);
        return;
      }
      void preloadNodeDetailDialog();
      setReferenceAssetDetail(null);
      setStoryboardDetailFocus(focus);
      setStoryboardDetailSectionId(storyboardSectionId);
      setNodeDetail(node);
    },
    [],
  );
  const syncNodeDetailProjection = useCallback((node: WorkspaceNodeData) => {
    setNodeDetail((current) =>
      current?.id === node.id && current !== node ? node : current,
    );
  }, []);

  const openStoryboardConfirmation = useStableCallback((nodeId: string) => {
    setStoryboardToConfirm({ canvasId: activeCanvas.id, nodeId });
  });
  const confirmStoryboardNode =
    storyboardToConfirm?.canvasId === activeCanvas.id
      ? canvasModel.nodes.find((node) => node.id === storyboardToConfirm.nodeId)
      : undefined;
  const confirmStoryboardDocument = confirmStoryboardNode
    ? parseStoryboardOutput(storyboardNodeOutput(confirmStoryboardNode))
    : null;

  async function confirmStoryboardFromCanvas(plan: StoryboardProductionPlan) {
    if (confirmingStoryboard || !confirmStoryboardNode) {
      return false;
    }
    const assetId = Number(
      confirmStoryboardNode.asset?.id ||
        confirmStoryboardNode.resultRef?.asset_id ||
        0,
    );
    const versionId = Number(
      confirmStoryboardNode.asset?.version_id ||
        confirmStoryboardNode.asset?.version?.id ||
        confirmStoryboardNode.resultRef?.version_id ||
        0,
    );
    if (!assetId || !versionId) {
      toast.error("当前分镜尚未保存，不能确认");
      return false;
    }
    setConfirmingStoryboard(true);
    try {
      const asset = await confirmSpaceStoryboard({
        projectId,
        assetId,
        versionId,
        productionPlan: plan,
      });
      applyCanvasNodeAssetUpdate(confirmStoryboardNode, asset);
      setStoryboardToConfirm(null);
      toast.success("分镜已确认，制作组将按当前版本同步");
      return true;
    } catch (error) {
      toast.error(errorMessage(error, "确认分镜失败"));
      return false;
    } finally {
      setConfirmingStoryboard(false);
    }
  }

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

  const applyCanvasNodeAssetUpdate = useCallback(
    (node: SpaceCanvasNode, asset: ProjectAsset) => {
      const normalizedAsset = mergeProjectAssetVersionHistory(
        asset,
        node.asset,
      );
      upsertSpaceAsset(normalizedAsset);
      const nodePatch = buildAssetVersionNodePatch(node, normalizedAsset);
      if (!node.id.startsWith("asset-detail-")) {
        updateNodeResult(node.id, nodePatch);
      }
      setNodeDetail((current) =>
        current?.id === node.id ? { ...current, ...nodePatch } : current,
      );
    },
    [updateNodeResult, upsertSpaceAsset],
  );

  const onReferenceAssetChanged = useCallback(
    (asset: AssetRecord) => {
      if (!referenceAssetDetail) {
        return;
      }
      const referenceNode = activeCanvas.nodes.find(
        (node) => node.id === referenceAssetDetail.nodeId,
      );
      if (!referenceNode) {
        return;
      }
      const normalizedAsset = normalizeProjectAsset(asset);
      const nodePatch = buildAssetVersionNodePatch(
        referenceNode,
        normalizedAsset,
      );
      upsertSpaceAsset(normalizedAsset);
      updateNodeResult(referenceNode.id, nodePatch);
    },
    [
      activeCanvas.nodes,
      referenceAssetDetail,
      updateNodeResult,
      upsertSpaceAsset,
    ],
  );

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
      const canvasId = canvas.id;
      const setCanvasRunningNodes: RunningNodeSetter = (update) => {
        setRunningNodes((current) => {
          if (activeCanvasIdRef.current !== canvasId) {
            return current;
          }
          return typeof update === "function" ? update(current) : update;
        });
      };
      const canvasRunningNodeBatcher: RunningNodeBatcher = {
        enqueue: (nodeId, update) =>
          runningNodeBatcher.enqueue(nodeId, (current) =>
            activeCanvasIdRef.current === canvasId ? update(current) : current,
          ),
        flush: runningNodeBatcher.flush,
      };
      return {
        projectId,
        canvasId,
        assetCate,
        space,
        startNode,
        ...executionOptions,
        nodes,
        edges: canvas.edges,
        viewport: canvas.viewport,
        canvasUpdatedAt: canvas.updatedAt,
        flushCanvasSave,
        onNodeResult: updateNodeResult,
        onAssetCreated: upsertSpaceAsset,
        setRunningNode: setCanvasRunningNodes,
        getRunningNode: (nodeId) => runningNodesRef.current[nodeId],
        runningNodeBatcher: canvasRunningNodeBatcher,
        requestFlowFeedback: requestStartFlowFeedback,
        requestNodeTitle: (node, result) =>
          requestGeneratedNodeTitle(canvas.id, node, result),
      };
    },
    [
      projectId,
      flushCanvasSave,
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
      await loadRuntimeExecutions(
        projectId,
        space,
        canvasStatesRef.current,
        "recovery",
        {
          canvasId: runInput?.canvasId || activeCanvasIdRef.current,
          runIds: [Number(runInput?.canvasRun?.run_id || 0)],
        },
      );
    },
    [loadRuntimeExecutions, projectId, space],
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
            ...activeCanvas,
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
        runInput?.setRunningNode?.((current) => ({
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
          runInput?.setRunningNode?.((current) =>
            omitRunningNode(current, startNode.id),
          );
        }, 1400);
      } finally {
        await recoverCanvasRunExecution(runInput);
      }
    },
    [
      activeCate,
      activeCanvas,
      canvasModel.edges,
      canvasModel.nodes,
      clearNodeFeedbackRecords,
      createCanvasRunInput,
      persistCanvasRunSnapshot,
      recoverCanvasRunExecution,
      space,
    ],
  );

  const runStoryboardFrame = useCallback<StoryboardFrameRunner>(
    async (sourceNodeId) => {
      if (!space || !activeCate) {
        return;
      }
      const currentCanvas =
        canvasStatesRef.current[String(activeCanvas.id)] || activeCanvas;
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
        onCanvasRunChange: rememberCanvasRunRecord,
        canvas: currentCanvas,
      });
      clearNodeFeedbackRecords(runSummary.pendingNodeIds);
      runInput.setRunningNode?.((current) => ({
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
          runInput.setRunningNode?.((current) => ({
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
        releaseLocallyManagedCanvasRun(runInput.canvasRun);
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
          runInput.setRunningNode?.((current) =>
            omitRunningNode(current, frameId),
          );
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
      releaseLocallyManagedCanvasRun,
      rememberCanvasRunRecord,
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
        canvasStatesRef.current[String(activeCanvas.id)] || activeCanvas;
      const currentNode =
        currentCanvas.nodes.find((item) => item.id === node.id) || node;
      const targetNode = mergeBackendSingleNodeDraft({
        ...currentNode,
        composerDraft: {
          ...(currentNode.composerDraft || {}),
          ...(node.composerDraft || {}),
        },
      });
      const optimisticNodeIds = canvasExecutionOptimisticNodeIds(
        targetNode.id,
        options?.targetNodeIds,
      );
      const executionNodes = clearCanvasExecutionNodeErrors(
        currentCanvas.nodes.map((item) =>
          item.id === targetNode.id ? targetNode : item,
        ),
        optimisticNodeIds,
      );
      const executionNodesById = new Map(
        executionNodes.map((item) => [item.id, item]),
      );
      const optimisticNodes = optimisticNodeIds
        .map((nodeId) => executionNodesById.get(nodeId))
        .filter((item): item is SpaceCanvasNode => Boolean(item));
      const clearOptimisticRunningNodes = (current: RunningNodeMap) => {
        let next = current;
        for (const nodeId of optimisticNodeIds) {
          if (!next[nodeId]) {
            continue;
          }
          if (next === current) {
            next = { ...current };
          }
          delete next[nodeId];
        }
        return next;
      };
      const inputContext = buildNodeInputContext(
        node.id,
        executionNodes,
        currentCanvas.edges,
      );
      const runInput = createCanvasRunInput({
        assetCate: activeCate,
        startNode: targetNode,
        singleNode: true,
        targetNodeIds: options?.targetNodeIds,
        onCanvasRunChange: rememberCanvasRunRecord,
        canvas: currentCanvas,
        nodes: executionNodes,
        runInput: {
          _manual_input_context: inputContext || undefined,
          _agent_turn_input: options?.agentInput,
          manual_node_id: node.id,
        },
      });
      for (const optimisticNode of optimisticNodes) {
        updateNodeResult(optimisticNode.id, { runError: "" });
      }
      runInput.setRunningNode?.((current) => {
        const next = { ...current };
        for (const optimisticNode of optimisticNodes) {
          const existing = current[optimisticNode.id];
          next[optimisticNode.id] = {
            ...(existing || {}),
            nodeId: optimisticNode.id,
            title: optimisticNode.title,
            startedAt: existing?.startedAt || Date.now(),
            progress: Math.max(existing?.progress || 0, 8),
            status: "running",
            ...(optimisticNode.id === targetNode.id && options?.agentInput
              ? { agent: emptyCanvasAgentRuntime() }
              : {}),
          };
        }
        return next;
      });
      try {
        await runCanvasFromStartNode(runInput);
        await persistCanvasRunSnapshot(runInput);
      } catch (err) {
        if (isCanvasRunCanceledError(err)) {
          updateNodeResult(targetNode.id, { runError: "" });
          runInput.setRunningNode?.(clearOptimisticRunningNodes);
          return;
        }
        updateNodeResult(targetNode.id, {
          runError: err instanceof Error ? err.message : "节点运行失败",
        });
        runInput.setRunningNode?.((current) => ({
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
          runInput.setRunningNode?.(clearOptimisticRunningNodes);
        }, 1400);
        throw err;
      } finally {
        releaseLocallyManagedCanvasRun(runInput.canvasRun);
        await recoverCanvasRunExecution(runInput);
      }
    },
    [
      activeCate,
      activeCanvas,
      createCanvasRunInput,
      persistCanvasRunSnapshot,
      recoverCanvasRunExecution,
      releaseLocallyManagedCanvasRun,
      rememberCanvasRunRecord,
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
        canvasId: activeCanvas.id,
        assetCate: activeCate,
        inputContext: node.inputContext || null,
        onNodeResult: updateNodeResult,
        onAssetCreated: upsertSpaceAsset,
        onRunStartNode: runStartNode,
        onOpenImportPicker: openImportPickerByNodeId,
      });
    },
    [
      activeCanvas.id,
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
    applyRunRecordsToCanvas(canvasRunRecords, activeCanvas, space);
  }, [activeCanvas, applyRunRecordsToCanvas, canvasRunRecords, space]);

  async function flushActiveCanvasBeforeSwitch() {
    const canvas =
      canvasStatesRef.current[String(activeCanvasIdRef.current)] ||
      activeCanvas;
    if (!canvas.id) {
      return true;
    }
    try {
      await flushCanvasSave(canvas);
      return true;
    } catch {
      return false;
    }
  }

  function resetCanvasScopedView() {
    setSelectedNodeIds([]);
    setNodeResultOverrides({});
    setRunningNodes({});
    setFocusNodeRequest(null);
    setNodeMenu(null);
    setNodeDetail(null);
    setStoryboardToConfirm(null);
    setReferenceAssetDetail(null);
    setStoryboardDetailFocus(undefined);
    setImportPickerOpen(false);
    setPendingImportNodeId("");
    pendingImportNodeRef.current = null;
    setStoryboardGridImport(null);
    setCanvasRunHistoryOpen(false);
  }

  async function switchCanvas(canvasId: number) {
    if (canvasId === activeCanvasIdRef.current) return true;
    if (loadingCateIdRef.current != null) {
      return false;
    }
    const summary = space?.canvasList.find((canvas) => canvas.id === canvasId);
    if (!summary) {
      toast.error("目标画布不存在");
      return false;
    }
    if (!(await flushActiveCanvasBeforeSwitch())) return false;

    const key = String(canvasId);
    if (!Object.prototype.hasOwnProperty.call(canvasStatesRef.current, key)) {
      loadingCateIdRef.current = summary.assetCateId;
      setLoadingCateId(summary.assetCateId);
      try {
        const bundle = await fetchSpaceCanvas({
          projectId,
          canvasId,
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
                canvasList:
                  bundle.canvasList.length > 0
                    ? bundle.canvasList
                    : current.canvasList,
              }
            : current,
        );
        const nextCanvases = {
          ...canvasStatesRef.current,
          [key]: hydratedCanvas,
        };
        canvasStatesRef.current = nextCanvases;
        setCanvasStates(nextCanvases);
        adoptCanvasSnapshot(hydratedCanvas);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "加载画布失败");
        return false;
      } finally {
        loadingCateIdRef.current = null;
        setLoadingCateId(null);
      }
    }
    activeCanvasIdRef.current = canvasId;
    setActiveCanvasId(canvasId);
    activeCateIdRef.current = summary.assetCateId;
    setActiveCateId(summary.assetCateId);
    writeCanvasId(canvasId);
    resetCanvasScopedView();
    if (!space) {
      return true;
    }
    const nextCanvas =
      canvasStatesRef.current[key] ||
      emptyCanvasState(summary.assetCateId, canvasId, summary.name);
    applyRunRecordsToCanvas(canvasRunRecords, nextCanvas, space);
    void loadRuntimeExecutions(
      projectId,
      space,
      canvasStatesRef.current,
      "recovery",
      { canvasId },
    );
    return true;
  }

  async function switchCate(cateId: number) {
    const target = (space?.canvasList || [])
      .filter((canvas) => canvas.assetCateId === cateId)
      .sort((left, right) => left.sort - right.sort || left.id - right.id)[0];
    if (target) return switchCanvas(target.id);
    if (!space || loadingCateIdRef.current != null) return false;

    if (!(await flushActiveCanvasBeforeSwitch())) return false;
    loadingCateIdRef.current = cateId;
    setLoadingCateId(cateId);
    try {
      const bundle = await fetchSpaceCanvas({
        projectId,
        canvasId: 0,
        assetCateId: cateId,
      });
      const hydratedCanvas = hydrateCanvasAssets(
        hydrateCanvasPowerCatalog(bundle.canvas, powers),
        bundle.assets,
      );
      const canvasId = hydratedCanvas.id;
      const nextCanvases = {
        ...canvasStatesRef.current,
        [String(canvasId)]: hydratedCanvas,
      };
      canvasStatesRef.current = nextCanvases;
      setCanvasStates(nextCanvases);
      adoptCanvasSnapshot(hydratedCanvas);
      setSpace((current) =>
        current
          ? {
              ...current,
              assets: mergeProjectAssets(current.assets, bundle.assets),
              canvasList:
                bundle.canvasList.length > 0
                  ? bundle.canvasList
                  : current.canvasList,
            }
          : current,
      );
      activeCanvasIdRef.current = canvasId;
      setActiveCanvasId(canvasId);
      activeCateIdRef.current = cateId;
      setActiveCateId(cateId);
      writeCanvasId(canvasId);
      resetCanvasScopedView();
      void loadRuntimeExecutions(projectId, space, nextCanvases, "recovery", {
        canvasId,
      });
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "加载输出类型失败");
      return false;
    } finally {
      loadingCateIdRef.current = null;
      setLoadingCateId(null);
    }
  }

  async function createCanvas(name: string) {
    if (!activeCate) return;
    if (!(await flushActiveCanvasBeforeSwitch())) {
      throw new Error("当前画布保存失败，未创建新画布");
    }
    try {
      const result = await createSpaceCanvas({
        projectId,
        assetCateId: activeCate.id,
        name,
      });
      const created = result.canvas;
      if (!created?.id) throw new Error("新画布数据为空");
      const hydratedCanvas = hydrateCanvasPowerCatalog(created, powers);
      const nextCanvases = {
        ...canvasStatesRef.current,
        [String(created.id)]: hydratedCanvas,
      };
      canvasStatesRef.current = nextCanvases;
      setCanvasStates(nextCanvases);
      adoptCanvasSnapshot(hydratedCanvas);
      setSpace((current) =>
        current
          ? {
              ...current,
              canvasList: result.canvasList,
              initialCanvasId: created.id,
              initialAssetCateId: created.assetCateId,
            }
          : current,
      );
      activeCanvasIdRef.current = created.id;
      setActiveCanvasId(created.id);
      activeCateIdRef.current = created.assetCateId;
      setActiveCateId(created.assetCateId);
      writeCanvasId(created.id);
      resetCanvasScopedView();
      invalidateCurrentTeamAssetFilters();
      toast.success("画布已创建");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "创建画布失败");
      throw err;
    }
  }

  async function renameCanvas(canvasId: number, name: string) {
    try {
      const result = await renameSpaceCanvas({ projectId, canvasId, name });
      setSpace((current) =>
        current ? { ...current, canvasList: result.canvasList } : current,
      );
      setCanvasStates((current) => {
        const canvas = current[String(canvasId)];
        if (!canvas) return current;
        const next = {
          ...current,
          [String(canvasId)]: { ...canvas, name },
        };
        canvasStatesRef.current = next;
        return next;
      });
      invalidateCurrentTeamAssetFilters();
      toast.success("画布已重命名");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "重命名画布失败");
      throw err;
    }
  }

  async function reorderCanvases(canvasIds: number[]) {
    if (!activeCate) return;
    try {
      const result = await reorderSpaceCanvases({
        projectId,
        assetCateId: activeCate.id,
        canvasIds,
      });
      setSpace((current) =>
        current ? { ...current, canvasList: result.canvasList } : current,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "调整画布顺序失败");
      throw err;
    }
  }

  async function deleteCanvas(canvasId: number) {
    try {
      const deletingActive = canvasId === activeCanvasIdRef.current;
      const deletingCanvas = canvasStatesRef.current[String(canvasId)];
      if (deletingCanvas) {
        await flushCanvasSave(deletingCanvas);
      }
      const result = await deleteSpaceCanvas({ projectId, canvasId });
      forgetCanvasSnapshot(canvasId);
      setSpace((current) =>
        current ? { ...current, canvasList: result.canvasList } : current,
      );
      if (canvasStatesRef.current[String(canvasId)]) {
        const next = { ...canvasStatesRef.current };
        delete next[String(canvasId)];
        canvasStatesRef.current = next;
        setCanvasStates(next);
      }
      if (deletingActive && result.activeCanvasId) {
        const nextSummary = result.canvasList.find(
          (canvas) => canvas.id === result.activeCanvasId,
        );
        let nextCanvas = canvasStatesRef.current[String(result.activeCanvasId)];
        if (!nextCanvas) {
          const bundle = await fetchSpaceCanvas({
            projectId,
            canvasId: result.activeCanvasId,
          });
          nextCanvas = hydrateCanvasAssets(
            hydrateCanvasPowerCatalog(bundle.canvas, powers),
            bundle.assets,
          );
          const nextCanvases = {
            ...canvasStatesRef.current,
            [String(nextCanvas.id)]: nextCanvas,
          };
          canvasStatesRef.current = nextCanvases;
          setCanvasStates(nextCanvases);
          setSpace((current) =>
            current
              ? {
                  ...current,
                  assets: mergeProjectAssets(current.assets, bundle.assets),
                  canvasList: result.canvasList,
                }
              : current,
          );
        }
        adoptCanvasSnapshot(nextCanvas);
        activeCanvasIdRef.current = nextCanvas.id;
        setActiveCanvasId(nextCanvas.id);
        activeCateIdRef.current =
          nextSummary?.assetCateId || nextCanvas.assetCateId;
        setActiveCateId(nextSummary?.assetCateId || nextCanvas.assetCateId);
        writeCanvasId(nextCanvas.id);
        resetCanvasScopedView();
        if (space) {
          void loadRuntimeExecutions(
            projectId,
            space,
            canvasStatesRef.current,
            "recovery",
            { canvasId: nextCanvas.id },
          );
        }
      }
      void loadDeletedCanvases(activeCateIdRef.current);
      invalidateCurrentTeamAssetFilters();
      toast.success("画布已删除");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "删除画布失败");
      throw err;
    }
  }

  async function restoreCanvas(canvasId: number) {
    try {
      if (!(await flushActiveCanvasBeforeSwitch())) {
        throw new Error("当前画布保存失败，未恢复画布");
      }
      const result = await restoreSpaceCanvas({ projectId, canvasId });
      if (!result.canvas?.id) {
        throw new Error("恢复后的画布数据为空");
      }
      let restoredCanvas = result.canvas;
      let restoredAssets: ProjectAsset[] = [];
      let restoredCanvasList = result.canvasList;
      let restoreWarning = "";
      try {
        const bundle = await fetchSpaceCanvas({
          projectId,
          canvasId: result.canvas.id,
        });
        restoredCanvas = bundle.canvas;
        restoredAssets = bundle.assets;
        if (bundle.canvasList.length > 0) {
          restoredCanvasList = bundle.canvasList;
        }
      } catch (loadError) {
        restoreWarning =
          loadError instanceof Error
            ? `画布已恢复，但资产加载失败：${loadError.message}`
            : "画布已恢复，但资产加载失败，请刷新页面";
      }
      const restored = hydrateCanvasAssets(
        hydrateCanvasPowerCatalog(restoredCanvas, powers),
        restoredAssets,
      );
      const nextCanvases = {
        ...canvasStatesRef.current,
        [String(restored.id)]: restored,
      };
      canvasStatesRef.current = nextCanvases;
      setCanvasStates(nextCanvases);
      adoptCanvasSnapshot(restored);
      setSpace((current) =>
        current
          ? {
              ...current,
              assets: mergeProjectAssets(current.assets, restoredAssets),
              canvasList: restoredCanvasList,
              initialCanvasId: restored.id,
              initialAssetCateId: restored.assetCateId,
            }
          : current,
      );
      activeCanvasIdRef.current = restored.id;
      setActiveCanvasId(restored.id);
      activeCateIdRef.current = restored.assetCateId;
      setActiveCateId(restored.assetCateId);
      writeCanvasId(restored.id);
      setDeletedCanvases((current) =>
        current.filter((canvas) => canvas.id !== restored.id),
      );
      setCanvasManagerOpen(false);
      resetCanvasScopedView();
      invalidateCurrentTeamAssetFilters();
      if (space) {
        void loadRuntimeExecutions(projectId, space, nextCanvases, "recovery", {
          canvasId: restored.id,
        });
      }
      if (restoreWarning) toast.warning(restoreWarning);
      else toast.success("画布已恢复");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "恢复画布失败");
      throw err;
    }
  }

  function invalidateCurrentTeamAssetFilters() {
    const teamID = Number(space?.project.team_id || 0);
    invalidateAssetFilterOptionsCache(teamID > 0 ? { teamID } : undefined);
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
    options: { canvasId?: number; runIds?: number[] } = {},
  ) {
    if (canvasExecutionRefreshInFlightRef.current) {
      return;
    }
    canvasExecutionRefreshInFlightRef.current = true;
    try {
      const scopedCanvas = options.canvasId
        ? canvases[String(options.canvasId)]
        : undefined;
      const existingRecords = scopedCanvas
        ? canvasRunRecordsRef.current.filter((run) =>
            canvasRunRecordMatchesCanvas(run, scopedCanvas),
          )
        : canvasRunRecordsRef.current;
      const previousActiveRuns =
        scope === "active"
          ? canvasRunRecordsActiveLatestRuns(existingRecords).filter(
              (run) =>
                !locallyManagedCanvasRunRequestIdsRef.current.has(
                  String(run.request_id || "").trim(),
                ),
            )
          : [];
      const runIds = (options.runIds || []).filter((runId) => runId > 0);
      const requestedRunIds =
        runIds.length > 0
          ? runIds
          : scope === "active"
            ? previousActiveRuns.map((run) => Number(run.run_id || 0))
            : [];
      if (scope === "active" && requestedRunIds.length === 0) {
        return;
      }
      const loadRecoverySummary =
        scope === "recovery" && requestedRunIds.length === 0;
      let canvasExecutions = await fetchSpaceCanvasExecutions({
        projectId: nextProjectId,
        scope,
        canvasId: options.canvasId,
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
            canvasId: options.canvasId,
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
      for (const canvas of Object.values(canvases)) {
        applyRunRecordsToCanvas(items, canvas, nextSpace);
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
        canvasId: activeCanvasIdRef.current,
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
    () =>
      canvasRunRecordsActiveLatest(
        canvasRunRecords.filter((run) =>
          canvasRunRecordMatchesCanvas(run, activeCanvas),
        ),
      ),
    [activeCanvas, canvasRunRecords],
  );
  const hasRecoverableCanvasRuns = recoverableCanvasRunEntries.length > 0;
  const hasPollableCanvasRuns = recoverableCanvasRunEntries.some((entry) => {
    const requestId = String(entry.run.request_id || "").trim();
    return !requestId || !locallyManagedCanvasRunRequestIds.has(requestId);
  });
  const hasCanvasRunsToStop =
    hasRecoverableCanvasRuns || hasRunningCanvasNode(runningNodes);

  async function stopCanvasRuns(requestedRuns?: CanvasRunRef[]) {
    const stopAll = !requestedRuns;
    if (
      (stopAll && (stoppingAllCanvasRuns || stoppingCanvasRunKeys.size > 0)) ||
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
      let targets: CanvasRunRef[] = requestedRuns || [];
      let failedCount = 0;
      let targetCount = targets.length;
      if (stopAll) {
        const stopped = await stopAllSpaceCanvasRuns(
          projectId,
          activeCanvasIdRef.current,
        );
        targets = stopped.items.map(normalizeCanvasRunRef);
        failedCount = stopped.failedCount;
        targetCount = stopped.count;
      } else {
        targets = uniqueActiveCanvasRuns(targets);
      }
      if (targetCount === 0) {
        toast.info("当前没有运行中的任务");
        return;
      }

      if (!stopAll) {
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
        targets = results.flatMap((result, index) => {
          if (result.status === "rejected") {
            failedCount += 1;
            return [];
          }
          const stoppedRun = normalizeCanvasRunRef(result.value);
          return [
            {
              ...targets[index],
              status: stoppedRun.status,
              error: stoppedRun.error,
            },
          ];
        });
      }

      const statusByRun = canvasRunStatusIndex(targets);
      const stoppedRuns = targets.filter((run) => run.status === "canceled");

      if (statusByRun.size > 0) {
        const updatedAt = new Date().toISOString();
        const updateStatuses = (runs: WorkspaceCanvasRunRef[]) =>
          runs.map((run) => {
            const status = canvasRunIndexedStatus(statusByRun, run);
            return status ? { ...run, status, updated_at: updatedAt } : run;
          });
        const nextRecords = updateStatuses(canvasRunRecordsRef.current);
        canvasRunRecordsRef.current = nextRecords;
        setCanvasRunRecords(nextRecords);
        setCanvasRunHistoryRecords(updateStatuses);
      }

      if (stoppedRuns.length > 0) {
        const stoppedNodeIds = new Set(
          stoppedRuns.flatMap((run) => {
            const nodeIds = canvasRunNodeIds(run);
            const storyboardFrameNodeId = canvasRunStoryboardFrameNodeId(run);
            return storyboardFrameNodeId
              ? [...nodeIds, storyboardFrameNodeId]
              : nodeIds;
          }),
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
          failedCount === targetCount
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
      title: "停止当前画布的所有运行？",
      description:
        "只停止当前画布。停止后不会再提交后续任务，正在生成的内容会尝试取消；其他画布和已经完成或计费的任务不受影响。",
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
        void loadRuntimeExecutions(
          projectId,
          space,
          canvasStatesRef.current,
          "active",
          { canvasId: activeCanvasIdRef.current },
        );
      }
    : null;

  useEffect(() => {
    if (!space || !hasPollableCanvasRuns) {
      return;
    }
    const timer = window.setInterval(() => {
      canvasExecutionPollRef.current?.();
    }, canvasRunStatusPollIntervalMs);
    return () => window.clearInterval(timer);
  }, [hasPollableCanvasRuns, projectId, space]);

  useEffect(() => {
    const watchers = recoveredCanvasStreamWatchersRef.current;
    const cursors = recoveredCanvasStreamCursorsRef.current;
    const activeStreams: Array<{
      key: string;
      canvasId: number;
      requestId: string;
      run: WorkspaceCanvasRunRef;
      managedNodeIds: ReadonlySet<string>;
    }> = [];
    if (space) {
      for (const entry of recoverableCanvasRunEntries) {
        const run = entry.run;
        const requestId = String(run.request_id || "").trim();
        if (!requestId || locallyManagedCanvasRunRequestIds.has(requestId)) {
          continue;
        }
        activeStreams.push({
          key: `${projectId}:${requestId}`,
          canvasId: Number(run.canvas_id || activeCanvasIdRef.current),
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
          if (
            controller.signal.aborted ||
            activeCanvasIdRef.current !== stream.canvasId
          ) {
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
  }, [
    locallyManagedCanvasRunRequestIds,
    projectId,
    recoverableCanvasRunEntries,
    runningNodeBatcher,
    space,
  ]);

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
    targetSpace: SpaceBootstrap,
  ) {
    const relatedRuns = runs.filter((run) =>
      canvasRunRecordMatchesCanvas(run, canvas),
    );
    if (relatedRuns.length === 0) {
      return;
    }
    const nodesByID = new Map(canvas.nodes.map((node) => [node.id, node]));
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
      const resultsAlreadyApplied = canvasRunAlreadyAppliedToCanvas(
        run,
        canvas,
      );
      const latestResults = resultsAlreadyApplied
        ? []
        : (run.node_results || []).filter((result) => {
            const nodeKey = result.node_key;
            if (
              !nodeKey ||
              !managedNodeKeys.has(nodeKey) ||
              appliedNodeKeys.has(nodeKey) ||
              canvasNodeCoversRunResult(nodesByID.get(nodeKey), run, result)
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
      canvasId: canvas.id,
      assetCate: runCate,
      space: targetSpace,
      startNode,
      nodes: canvas.nodes,
      edges: canvas.edges,
      viewport: canvas.viewport,
      onNodeResult: (nodeId, patch) =>
        updateCanvasNodeResult(canvas.id, nodeId, patch),
      onAssetCreated: upsertSpaceAsset,
      setRunningNode: setRunningNodes,
      getRunningNode: (nodeId) => runningNodesRef.current[nodeId],
      requestFlowFeedback: requestStartFlowFeedback,
      requestNodeTitle: (node, result) =>
        requestGeneratedNodeTitle(canvas.id, node, result),
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
    updateCanvasState(input.canvasId, (canvas) =>
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
      const nodes = removeCanvasParamBindingsForSources(
        canvas.nodes,
        removedNodeIds,
      ).filter((item) => !removedNodeIds.has(item.id));
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
    setReferenceAssetDetail((current) =>
      current && removedNodeIds.has(current.nodeId) ? null : current,
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

  function patchImportNodeResult(
    nodeId: string,
    asset: ProjectAsset,
    fallbackSourceNode?: SpaceCanvasNode | null,
  ) {
    if (!nodeId) {
      return;
    }
    const sourceNode =
      activeCanvas.nodes.find((node) => node.id === nodeId) ||
      (fallbackSourceNode?.id === nodeId
        ? fallbackSourceNode
        : pendingImportNodeRef.current?.id === nodeId
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
        "引用资产",
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
          Boolean(node) && isCanvasFunctionNode(node, "display"),
      );
    if (directDisplayNodes.length === 0) {
      return;
    }
    for (const displayNode of directDisplayNodes) {
      updateNodeResult(
        displayNode.id,
        buildGeneratedNodeResultPatch(displayNode, { output }, "展示引用结果"),
      );
    }
  }

  function importAsset(
    asset: ProjectAsset,
    importNodeId = pendingImportNodeId,
    fallbackSourceNode: SpaceCanvasNode | null = pendingImportNodeRef.current,
  ) {
    if (!importNodeId) {
      addAssetNode(asset);
      return;
    }
    const sourceNode =
      activeCanvas.nodes.find((node) => node.id === importNodeId) ||
      (fallbackSourceNode?.id === importNodeId
        ? fallbackSourceNode
        : pendingImportNodeRef.current?.id === importNodeId
          ? pendingImportNodeRef.current
          : null);
    if (!sourceNode) {
      addAssetNode(asset);
      setPendingImportNodeId("");
      pendingImportNodeRef.current = null;
      return;
    }
    patchImportNodeResult(importNodeId, asset, fallbackSourceNode);
  }

  async function importAssetRecord(
    record: AssetRecord,
    importNodeId = pendingImportNodeId,
    fallbackSourceNode: SpaceCanvasNode | null = pendingImportNodeRef.current,
  ) {
    if (record.libraryType !== "material") {
      importAsset(
        normalizeProjectAsset(record),
        importNodeId,
        fallbackSourceNode,
      );
      return;
    }

    if (!assetRecordHasUsableContent(record)) {
      toast.error("该素材没有可用内容，无法引用");
      return;
    }

    const assetCateId = Number(activeCate?.id || 0);
    const requestTarget = importNodeId || `new-${Date.now()}`;
    try {
      const savedAsset = await saveSpaceCanvasMaterial({
        projectId,
        canvasId: activeCanvas.id,
        assetCateId,
        name: record.name || "素材库资产",
        kind: record.kind,
        content: record.version?.content,
        nodeKey: importNodeId,
        requestId: `official-material:${record.id}:${requestTarget}`,
      });
      const normalizedAsset = normalizeProjectAsset(savedAsset);
      upsertSpaceAsset(normalizedAsset);
      importAsset(normalizedAsset, importNodeId, fallbackSourceNode);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "引用素材库资产失败",
      );
    }
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

  async function importStoryboardGridAssets(assets: AssetRecord[]) {
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
      (asset) => asset.kind === "image" && assetRecordHasUsableContent(asset),
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
              canvasId: activeCanvas.id,
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

  async function uploadImportAssets(
    files: File[],
    options?: AssetUploadOptions,
  ): Promise<AssetRecord[]> {
    const { uploadSpaceFiles } = await import("./space-upload");
    const previews = await uploadSpaceFiles({
      projectID: projectId,
      canvasID: activeCanvas.id,
      teamID: Number(space?.project.team_id || 0),
      files,
      onProgress: options?.onProgress,
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
    if (node && isCanvasFunctionNode(node, "import")) {
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
    return null;
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

  const {
    launcherVisible: assistantLauncherVisible,
    panelVisible: assistantVisible,
  } = resolveSpaceAssistantVisibility(space.assistant.available, assistantOpen);

  return (
    <main
      ref={pageContainerRef}
      className={`ws-page is-${theme} is-${workMode}-view ${
        assistantVisible ? "is-assistant-open" : ""
      } ${assistantExpanded ? "is-assistant-expanded" : ""}`}
      style={
        {
          "--ws-assistant-width": `${assistantWidth}px`,
        } as CSSProperties
      }
    >
      <CanvasWorkbench
        activeCate={activeCate}
        mode={workMode}
        interactive={workMode === "create"}
        canvasCount={activeCateCanvases.length}
        activeCanvasName={activeCanvas.name}
        canvasManagerOpen={canvasManagerOpen}
        onOpenCanvasManager={openCanvasManager}
        nodes={canvasModel.nodes}
        edges={canvasModel.edges}
        viewport={activeCanvas.viewport}
        canvasId={activeCanvas.id}
        selectedNodeId={selectedNodeId}
        selectedNodeIds={selectedNodeIds}
        onSelectNodes={handleSelectCanvasNodes}
        onOpenNodeMenu={handleOpenCanvasNodeMenu}
        onAddConfiguredNode={handleAddConfiguredNode}
        onCopyNode={handleCopyCanvasNode}
        onDeleteNodes={handleDeleteCanvasNodes}
        onShowNodeDetail={showNodeDetail}
        detailNodeId={nodeDetail?.id || ""}
        onDetailNodeProjection={syncNodeDetailProjection}
        onConfirmStoryboard={openStoryboardConfirmation}
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
        canvasRunRecords={canvasRunRecords}
        stoppingCanvasRunKeys={stoppingCanvasRunKeys}
        onStopCanvasRun={requestStopCanvasRun}
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
        canvases={activeCateCanvases}
        activeCanvas={activeCanvas}
        saveStatus={canvasSaveStatus[String(activeCanvas.id)] || "saved"}
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
        stoppingRuns={stoppingAllCanvasRuns || stoppingCanvasRunKeys.size > 0}
        onStopRuns={requestStopAllCanvasRuns}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {canvasManagerOpen ? (
        <Suspense
          fallback={<CanvasModuleLoading label="正在加载画布管理" overlay />}
        >
          <SpaceCanvasManagerDialog
            open
            canvases={activeCateCanvases}
            deletedCanvases={deletedCanvases}
            deletedLoading={deletedCanvasLoading}
            activeCanvasId={activeCanvas.id}
            disabled={loadingCateId != null}
            onClose={() => setCanvasManagerOpen(false)}
            onSelect={switchCanvas}
            onCreate={createCanvas}
            onRename={renameCanvas}
            onReorder={reorderCanvases}
            onDelete={deleteCanvas}
            onRestore={restoreCanvas}
          />
        </Suspense>
      ) : null}

      {assistantVisible ? (
        <Suspense
          fallback={
            <aside
              className="ws-assistant-panel"
              style={
                {
                  "--ws-assistant-panel-width": `${assistantWidth}px`,
                } as CSSProperties
              }
            >
              <CanvasModuleLoading label="正在加载画布助手" />
            </aside>
          }
        >
          <SpaceAssistant
            assistant={space.assistant}
            project={space.project}
            team={space.team}
            activeAssetCateID={activeCate.id}
            activeCanvas={activeCanvas}
            selectedNodes={assistantSelectedNodes}
            width={assistantWidth}
            expanded={assistantExpanded}
            onWidthChange={updateAssistantWidth}
            onToggleExpanded={() => setAssistantExpanded((current) => !current)}
            onClose={() => updateAssistantOpen(false)}
            onFlushCanvas={flushCanvasSave}
            onCanvasChanged={handleAssistantCanvasChanged}
            onUploadAssets={uploadImportAssets}
          />
        </Suspense>
      ) : null}

      {assistantLauncherVisible ? (
        <SpaceAssistantLauncher
          assistantName={space.assistant.name}
          onIntent={preloadSpaceAssistant}
          onOpen={() => updateAssistantOpen(true)}
        />
      ) : null}

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
              const switchTarget = Number(run.canvas_id || 0)
                ? switchCanvas(Number(run.canvas_id))
                : switchCate(Number(run.asset_cate_id || activeCateId));
              void switchTarget.then((switched) => {
                if (switched) {
                  window.requestAnimationFrame(() => focusCanvasNode(nodeId));
                }
              });
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
            title="选择资产"
            description="选择已有资产或上传本地文件，确认后引用到当前画布。"
            initialFilters={{
              sourceType: "project",
              projectID: space.project.id,
              canvasID: activeCanvas.id,
            }}
            confirmSelection
            contentMode="full"
            validateAsset={(asset) =>
              assetRecordHasUsableContent(asset)
                ? ""
                : "该资产没有可用内容，无法引用。"
            }
            onUpload={uploadImportAssets}
            onClose={closeImportPicker}
            onConfirm={(assets) => {
              const asset = assets[0];
              if (asset) void importAssetRecord(asset);
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
              canvasID: activeCanvas.id,
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
                : assetRecordHasUsableContent(asset)
                  ? ""
                  : "该图片没有可用内容，无法导入。"
            }
            onUpload={uploadImportAssets}
            onClose={() => setStoryboardGridImport(null)}
            onConfirm={(assets) => {
              void importStoryboardGridAssets(assets);
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
              scopeCanvasID={activeCanvas.id}
              onLocalUpload={uploadImportAssets}
              initialFilters={{
                sourceType: "project",
                projectID: space.project.id,
                canvasID: activeCanvas.id,
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

      {confirmStoryboardNode &&
      confirmStoryboardDocument &&
      !isStoryboardConfirmed(confirmStoryboardDocument) ? (
        <Suspense
          fallback={<CanvasModuleLoading label="正在加载分镜确认" overlay />}
        >
          <StoryboardConfirmDialog
            storyboard={confirmStoryboardDocument}
            lipSyncAvailable={lipSyncAvailable}
            submitting={confirmingStoryboard}
            portalContainer={pageContainerRef.current}
            onClose={() => setStoryboardToConfirm(null)}
            onEditIssue={(issue) => {
              setStoryboardToConfirm(null);
              showNodeDetail(confirmStoryboardNode, {
                shotId: issue.shotId,
                materialId: issue.materialId,
              });
            }}
            onConfirm={confirmStoryboardFromCanvas}
          />
        </Suspense>
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
            storyboardInitialSectionId={storyboardDetailSectionId}
            storyboardWorkspace={
              (nodeDetail as Partial<WorkspaceNodeData>).storyboardWorkspace
            }
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
            onAssetUpdated={(asset) =>
              applyCanvasNodeAssetUpdate(nodeDetail, asset)
            }
            onConfirmStoryboard={() =>
              openStoryboardConfirmation(nodeDetail.id)
            }
            onClose={() => {
              setNodeDetail(null);
              setStoryboardDetailFocus(undefined);
              setStoryboardDetailSectionId(undefined);
            }}
          />
        </Suspense>
      ) : null}

      {referenceAssetDetail ? (
        <Suspense
          fallback={<CanvasModuleLoading label="正在加载资产详情" overlay />}
        >
          <AssetDetailDialog
            teamID={space.project.team_id}
            assetID={referenceAssetDetail.assetID}
            layer="nested"
            onAssetChanged={onReferenceAssetChanged}
            onClose={() => setReferenceAssetDetail(null)}
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
  canvases,
  activeCanvas,
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
  canvases: SpaceBootstrap["canvasList"];
  activeCanvas: SpaceCanvasState;
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
          <div className="ws-project-title-row">
            <strong>{space.project.name}</strong>
            {canvases.length > 1 ? (
              <span className="ws-project-canvas-name">
                <i>/</i>
                {activeCanvas.name || "第一幕"}
              </span>
            ) : null}
          </div>
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

      <div className={`ws-top-actions ${canStopRuns ? "has-running" : ""}`}>
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
  canvasCount,
  activeCanvasName,
  canvasManagerOpen,
  onOpenCanvasManager,
  nodes,
  edges,
  viewport,
  canvasId,
  selectedNodeId,
  selectedNodeIds,
  onSelectNodes,
  onOpenNodeMenu,
  onAddConfiguredNode,
  onCopyNode,
  onDeleteNodes,
  onShowNodeDetail,
  detailNodeId,
  onDetailNodeProjection,
  onConfirmStoryboard,
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
  canvasRunRecords,
  stoppingCanvasRunKeys,
  onStopCanvasRun,
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
  canvasCount: number;
  activeCanvasName: string;
  canvasManagerOpen: boolean;
  onOpenCanvasManager: () => void;
  nodes: SpaceCanvasNode[];
  edges: SpaceCanvasEdge[];
  viewport: SpaceCanvasState["viewport"];
  canvasId: number;
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
    storyboardSectionId?: string,
  ) => void;
  detailNodeId: string;
  onDetailNodeProjection: (node: WorkspaceNodeData) => void;
  onConfirmStoryboard: (nodeId: string) => void;
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
  canvasRunRecords: WorkspaceCanvasRunRef[];
  stoppingCanvasRunKeys: ReadonlySet<string>;
  onStopCanvasRun: (run: CanvasRunRef) => void;
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
  const [pendingParamBinding, setPendingParamBinding] =
    useState<PendingParamBindingConnection | null>(null);
  const [bindingParamsByTargetId, setBindingParamsByTargetId] = useState<
    Map<string, PowerParam[]>
  >(() => new Map());
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
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
  const pendingConnectionRef = useRef<PendingNodeConnection | null>(null);
  const connectionCompletedRef = useRef(false);
  const skipNextPaneClickRef = useRef(false);
  const skipNextNodeClickRef = useRef(false);
  const rightSelectionRef = useRef<CanvasRightSelectionGesture | null>(null);
  const suppressNextPaneContextMenuRef = useRef(false);
  const edgesRef = useRef(edges);
  useLayoutEffect(() => {
    edgesRef.current = edges;
  }, [edges]);
  const flushViewportZoom = useCallback((zoom: number) => {
    const nextZoom = normalizeCanvasZoom(zoom);
    pendingViewportZoomRef.current = nextZoom;
    if (viewportZoomFrameRef.current != null && typeof window !== "undefined") {
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
    (nextEdges: SpaceCanvasEdge[], options: CanvasEdgeCommitOptions = {}) => {
      const previousEdges = edgesRef.current;
      edgesRef.current = nextEdges;
      onEdgesCommit(nextEdges);

      const remainingConnections = new Set(
        nextEdges
          .filter((edge) => canvasEdgePurpose(edge) === "media")
          .map((edge) => {
            const endpoints = canvasEdgeNodeIDs(edge);
            return `${endpoints.sourceNodeId}\u0000${endpoints.targetNodeId}`;
          }),
      );
      const removedSourceIDsByTarget = new Map<string, Set<string>>();
      for (const edge of previousEdges) {
        if (canvasEdgePurpose(edge) !== "media") {
          continue;
        }
        const endpoints = canvasEdgeNodeIDs(edge);
        const connectionKey = `${endpoints.sourceNodeId}\u0000${endpoints.targetNodeId}`;
        if (remainingConnections.has(connectionKey)) {
          continue;
        }
        const sourceIDs =
          removedSourceIDsByTarget.get(endpoints.targetNodeId) ||
          new Set<string>();
        sourceIDs.add(endpoints.sourceNodeId);
        removedSourceIDsByTarget.set(endpoints.targetNodeId, sourceIDs);
      }
      const draftByNodeId = new Map(options.draftByNodeId);
      for (const [targetNodeId, sourceNodeIds] of removedSourceIDsByTarget) {
        const targetNode = nodes.find((node) => node.id === targetNodeId);
        const currentDraft = targetNode?.composerDraft;
        let nextDraft = draftByNodeId.get(targetNodeId) || currentDraft;
        if (!targetNode || !nextDraft) {
          continue;
        }
        for (const sourceNodeId of sourceNodeIds) {
          nextDraft = removeCanvasTextConnectionBinding(
            nextDraft,
            sourceNodeId,
          );
        }
        if (nextDraft !== currentDraft) {
          draftByNodeId.set(targetNode.id, nextDraft);
        } else {
          draftByNodeId.delete(targetNode.id);
        }
      }
      const draftUpdates = [...draftByNodeId].map(([nodeId, draft]) => ({
        nodeId,
        draft,
      }));
      draftUpdates.forEach((update, index) => {
        onNodeDraftChange(
          update.nodeId,
          update.draft,
          index === draftUpdates.length - 1 ? { save: "immediate" } : undefined,
        );
      });
    },
    [nodes, onEdgesCommit, onNodeDraftChange],
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
  const removeTextParamConnection = useCallback(
    (sourceNodeId: string, targetNodeId: string) => {
      const currentEdges = edgesRef.current;
      const nextEdges = currentEdges.filter((edge) => {
        const endpoints = canvasEdgeNodeIDs(edge);
        return !(
          canvasEdgePurpose(edge) === "media" &&
          endpoints.sourceNodeId === sourceNodeId &&
          endpoints.targetNodeId === targetNodeId
        );
      });
      if (nextEdges.length !== currentEdges.length) {
        setSelectedEdgeId("");
        commitCanvasEdges(nextEdges);
        return;
      }

      const targetNode = nodes.find((node) => node.id === targetNodeId);
      if (!targetNode?.composerDraft) {
        return;
      }
      const nextDraft = removeCanvasTextConnectionBinding(
        targetNode.composerDraft,
        sourceNodeId,
      );
      if (nextDraft !== targetNode.composerDraft) {
        onNodeDraftChange(targetNodeId, nextDraft, { save: "immediate" });
      }
    },
    [commitCanvasEdges, nodes, onNodeDraftChange],
  );
  const resizeNode = useCallback<CanvasNodeResizeHandler>(
    (nodeId, bounds) => {
      setResizingNodeId("");
      if (!interactive) {
        return;
      }
      const nextNodes = withResizedCanvasNode(nodes, nodeId, bounds);
      if (nextNodes !== nodes) {
        onNodesCommit(nextNodes);
      }
    },
    [interactive, nodes, onNodesCommit],
  );
  const resizeResultView = useCallback<CanvasResultViewChangeHandler>(
    (nodeId, resultView) => {
      setResizingNodeId("");
      if (!interactive) {
        return;
      }
      const nextNodes = withResizedCanvasResultView(nodes, nodeId, resultView);
      if (nextNodes !== nodes) {
        onNodesCommit(nextNodes);
      }
    },
    [interactive, nodes, onNodesCommit],
  );
  const nodeActionsRef = useRef({
    onNodeResult,
    onNodeDraftChange,
    onAssetCreated,
    onRunFunctionNode,
    onOpenStoryboardGridImport,
    onClearFeedbackRecords,
    onOpenFeedbackRecord,
    onShowNodeDetail,
    onConfirmStoryboard,
    requestConfirm,
    onRunBackendNode,
    onConnectedMediaUsagesChange: updateConnectedMediaUsages,
    onConnectedMediaEdgeRemove: removeConnectedMediaEdge,
    onTextParamConnectionRemove: removeTextParamConnection,
    onNodeResizeStart: setResizingNodeId,
    onNodeResizeEnd: resizeNode,
    onResultViewResizeEnd: resizeResultView,
  });
  useLayoutEffect(() => {
    nodeActionsRef.current = {
      onNodeResult,
      onNodeDraftChange,
      onAssetCreated,
      onRunFunctionNode,
      onOpenStoryboardGridImport,
      onClearFeedbackRecords,
      onOpenFeedbackRecord,
      onShowNodeDetail,
      onConfirmStoryboard,
      requestConfirm,
      onRunBackendNode,
      onConnectedMediaUsagesChange: updateConnectedMediaUsages,
      onConnectedMediaEdgeRemove: removeConnectedMediaEdge,
      onTextParamConnectionRemove: removeTextParamConnection,
      onNodeResizeStart: setResizingNodeId,
      onNodeResizeEnd: resizeNode,
      onResultViewResizeEnd: resizeResultView,
    };
  }, [
    onAssetCreated,
    onClearFeedbackRecords,
    onNodeDraftChange,
    onNodeResult,
    onOpenFeedbackRecord,
    onOpenStoryboardGridImport,
    onRunBackendNode,
    onRunFunctionNode,
    onShowNodeDetail,
    onConfirmStoryboard,
    removeConnectedMediaEdge,
    removeTextParamConnection,
    requestConfirm,
    resizeNode,
    resizeResultView,
    updateConnectedMediaUsages,
  ]);
  const stableNodeActions = useMemo(
    () => ({
      onNodeResult: (nodeId: string, patch: Partial<SpaceCanvasNode>) =>
        nodeActionsRef.current.onNodeResult(nodeId, patch),
      onNodeDraftChange: (
        nodeId: string,
        draft: ComposerDraft,
        options?: NodeDraftUpdateOptions,
      ) => nodeActionsRef.current.onNodeDraftChange(nodeId, draft, options),
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
        storyboardSectionId?: string,
      ) =>
        nodeActionsRef.current.onShowNodeDetail(
          node,
          focus,
          storyboardSectionId,
        ),
      onConfirmStoryboard: (nodeId: string) =>
        nodeActionsRef.current.onConfirmStoryboard(nodeId),
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
      onTextParamConnectionRemove: (
        sourceNodeId: string,
        targetNodeId: string,
      ) =>
        nodeActionsRef.current.onTextParamConnectionRemove(
          sourceNodeId,
          targetNodeId,
        ),
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
  const storyboardFrameById = useMemo(
    () => new Map(storyboardFrames.map((frame) => [frame.id, frame])),
    [storyboardFrames],
  );
  const storyboardFrameBySourceId = useMemo(
    () =>
      new Map(storyboardFrames.map((frame) => [frame.sourceNodeId, frame])),
    [storyboardFrames],
  );
  const storyboardFrameRunSummaryById = useMemo(
    () =>
      new Map(
        storyboardFrames.map((frame) => [
          frame.id,
          storyboardFrameRunSummary(
            frame,
            nodes,
            (node) => canvasRenderIndex.hasResultByNodeId.get(node.id) || false,
            canvasRenderIndex.nodeById,
          ),
        ]),
      ),
    [
      canvasRenderIndex.hasResultByNodeId,
      canvasRenderIndex.nodeById,
      nodes,
      storyboardFrames,
    ],
  );
  const storyboardFrameRunBySourceId = useMemo(() => {
    const result = new Map<string, WorkspaceCanvasRunRef>();
    for (const run of canvasRunRecords) {
      if (!canvasRunStoryboardFrameNodeId(run)) {
        continue;
      }
      const runCanvasId = Number(run.canvas_id || 0);
      if (runCanvasId > 0 && runCanvasId !== canvasId) {
        continue;
      }
      const sourceNodeId = String(run.start_node_id || "").trim();
      if (sourceNodeId && !result.has(sourceNodeId)) {
        result.set(sourceNodeId, run);
      }
    }
    return result;
  }, [canvasId, canvasRunRecords]);
  const activeCanvasRunByStartNodeId = useMemo(() => {
    const result = new Map<string, WorkspaceCanvasRunRef>();
    for (const run of canvasRunRecords) {
      const runCanvasId = Number(run.canvas_id || 0);
      if (
        !isActiveCanvasRun(run) ||
        (runCanvasId > 0 && runCanvasId !== canvasId)
      ) {
        continue;
      }
      const startNodeId = String(run.start_node_id || "").trim();
      if (startNodeId && !result.has(startNodeId)) {
        result.set(startNodeId, run);
      }
    }
    return result;
  }, [canvasId, canvasRunRecords]);
  const structureLockedStoryboardNodeIds = storyboardFrameIndex.sourceNodeIds;
  const storyboardSourceIdByNodeId = storyboardFrameIndex.sourceNodeIdByNodeId;
  const hiddenStoryboardNodeIds = useMemo(
    () =>
      new Set(
        storyboardFrames.flatMap((frame) =>
          frame.memberNodeIds.filter(
            (nodeId) => nodeId !== frame.sourceNodeId,
          ),
        ),
      ),
    [storyboardFrames],
  );
  const runStoryboardFrameAction = useStableCallback(
    (frameId: string, sourceNodeId: string) => {
      const frame = storyboardFrameById.get(frameId);
      const runSummary = storyboardFrameRunSummaryById.get(frameId);
      if (!frame || !runSummary) {
        return;
      }
      const pendingCount = runSummary.pendingNodeIds.length;
      const skippedCount = Math.max(0, frame.workNodeCount - pendingCount);
      requestConfirm({
        title: `执行“${frame.title}”制作区？`,
        description: `将执行 ${pendingCount} 个待处理节点${
          skippedCount > 0 ? `，跳过 ${skippedCount} 个已有有效结果的节点` : ""
        }。执行期间不能单独运行该制作区内的节点。`,
        confirmText: "执行制作区",
        tone: "primary",
        onConfirm: () => onRunStoryboardFrame(sourceNodeId),
      });
    },
  );
  const stopStoryboardFrameAction = useStableCallback(
    (sourceNodeId: string) => {
      const run = storyboardFrameRunBySourceId.get(sourceNodeId);
      if (run && isActiveCanvasRun(run)) {
        onStopCanvasRun(run);
      }
    },
  );
  const runStoryboardGroupAction = useStableCallback((groupId: string) => {
    const group = canvasRenderIndex.nodeById.get(groupId);
    if (!group) {
      return;
    }
    runCanvasGroupNodeAction({
      group,
      sourceNode: group,
      members:
        canvasRenderIndex.groupMembersById.get(groupId) || EMPTY_CANVAS_NODES,
      setRunningNode,
      runNode: onRunBackendNode,
    });
  });
  const runStoryboardResultNodeAction = useStableCallback((nodeId: string) => {
    const node = canvasRenderIndex.nodeById.get(nodeId);
    if (node) {
      void onRunBackendNode(node).catch((error) =>
        toast.error(error instanceof Error ? error.message : "节点运行失败"),
      );
    }
  });
  const stopStoryboardResultRunAction = useStableCallback((nodeId: string) => {
    const run = activeCanvasRunByStartNodeId.get(nodeId);
    if (run) {
      onStopCanvasRun(run);
    }
  });
  const showStoryboardResultAction = useStableCallback((nodeId: string) => {
    const node = canvasRenderIndex.nodeById.get(nodeId);
    if (node) {
      onShowNodeDetail(node);
    }
  });
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
      canvasNodeIdSignature ? `${activeCate.id}:${canvasNodeIdSignature}` : "",
    [activeCate.id, canvasNodeIdSignature],
  );
  const canvasHasRunningNode = useMemo(
    () => hasRunningCanvasNode(runningNodes),
    [runningNodes],
  );
  const renderStoryboardWorkspaceNode = useStableCallback(
    (node: WorkspaceNodeData, selected: boolean) => (
      <EmbeddedCanvasNodeContext.Provider value>
        <SpaceNodeView data={node} selected={selected} />
      </EmbeddedCanvasNodeContext.Provider>
    ),
  );

  const derivedFlowNodes = useMemo<Node[]>(() => {
    const hasIndexedResult = (node: SpaceCanvasNode) =>
      canvasRenderIndex.hasResultByNodeId.get(node.id) || false;
    const projectWorkspaceNodeData = (
      node: SpaceCanvasNode,
      embedded = false,
    ): WorkspaceNodeData => {
      const selected = !embedded && selectedNodeIdSet.has(node.id);
      const showNodeSettings =
        selected &&
        selectedNodeIds.length === 1 &&
        nodeUsesComposerSettings(node);
      const powerViewMode =
        node.type === "power"
          ? resolvePowerPresentation(node.power, node.kind, node.outputType)
              .viewMode
          : "";
      const needsNodeSettingsContext = embedded || showNodeSettings;
      const nodeSpace = needsNodeSettingsContext ? space : null;
      const nodeCanvasReferenceItems =
        needsNodeSettingsContext ||
        powerViewMode === "storyboard" ||
        powerViewMode === "video_compose"
          ? canvasReferenceItems
          : EMPTY_CANVAS_REFERENCE_ITEMS;
      const nodeConnectedMediaReferences =
        embedded || powerViewMode === "video_compose" || showNodeSettings
          ? canvasRenderIndex.incomingMediaReferencesByNodeId.get(node.id) ||
            EMPTY_CANVAS_MEDIA_REFERENCES
          : EMPTY_CANVAS_MEDIA_REFERENCES;
      const structureLocked = structureLockedStoryboardNodeIds.has(node.id);
      const storyboardSourceNodeId =
        storyboardSourceIdByNodeId.get(node.id) || "";
      const storyboardSourceNode = storyboardSourceNodeId
        ? canvasRenderIndex.nodeById.get(storyboardSourceNodeId) || null
        : null;
      const storyboardFrameRun = storyboardSourceNodeId
        ? storyboardFrameRunBySourceId.get(storyboardSourceNodeId)
        : undefined;
      const storyboardFrameRunning = Boolean(
        storyboardSourceNodeId &&
        ((storyboardFrameRun && isActiveCanvasRun(storyboardFrameRun)) ||
          isActiveRunningNode(
            runningNodes[storyboardFrameId(storyboardSourceNodeId)],
          )),
      );
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
      const nodeCanvasHasRunning = isStartFunctionNode(node)
        ? canvasHasRunningNode
        : false;
      const inputContext =
        canvasRenderIndex.inputContextByNodeId.get(node.id) || null;
      const runBlockedReason = storyboardFrameRunning
        ? "制作区正在执行"
        : canvasRenderIndex.runBlockedReasonByNodeId.get(node.id) || "";
      const nodeData: WorkspaceNodeData = {
        ...node,
        sourceNode: node,
        projectId,
        canvasId,
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
        ...(embedded ? { embedded: true } : {}),
        setRunningNode,
        ...stableNodeActions,
        inputContext,
      };
      return nodeData;
    };

    const createStoryboardWorkspaceData = (
      frame: StoryboardFrameScope,
    ): StoryboardWorkspaceData => {
      const runSummary = storyboardFrameRunSummaryById.get(frame.id);
      const latestFrameRun = storyboardFrameRunBySourceId.get(
        frame.sourceNodeId,
      );
      const activeFrameRun =
        latestFrameRun && isActiveCanvasRun(latestFrameRun)
          ? latestFrameRun
          : undefined;
      const frameRunning =
        Boolean(activeFrameRun) || isActiveRunningNode(runningNodes[frame.id]);
      const memberRunning = frame.memberNodeIds.some((nodeId) =>
        isActiveRunningNode(runningNodes[nodeId]),
      );
      const runBlockedReason = frameRunning
        ? ""
        : memberRunning
          ? "制作区内有节点正在执行"
          : runSummary?.blockedReason || "";
      const currentNodeTitle =
        storyboardFrameCurrentNodeTitle(
          frame,
          activeFrameRun,
          runningNodes,
          canvasRenderIndex.nodeById,
        ) || (frameRunning ? "准备执行" : "");
      const stopping = Boolean(
        activeFrameRun &&
        stoppingCanvasRunKeys.has(canvasRunIdentity(activeFrameRun)),
      );
      return {
        frameId: frame.id,
        sourceNodeId: frame.sourceNodeId,
        groupCount:
          frame.groupCount +
          Number(
            frame.workNodeIds.some(
              (nodeId) =>
                canvasRenderIndex.nodeById.get(nodeId)?.storyboardItem
                  ?.itemType === "video_compose",
            ),
          ),
        workNodeCount: frame.workNodeCount,
        completedCount: frame.completedCount,
        running: frameRunning,
        stopping,
        executionStatus: storyboardFrameExecutionStatus(
          latestFrameRun,
          runningNodes[frame.id],
          stopping,
        ),
        currentNodeTitle,
        runBlockedReason,
        groups: storyboardFrameOverviewGroups({
          frame,
          nodeById: canvasRenderIndex.nodeById,
          groupMembersById: canvasRenderIndex.groupMembersById,
          runBlockedReasonByNodeId: canvasRenderIndex.runBlockedReasonByNodeId,
          runningNodes,
          frameRunning,
          activeRunByStartNodeId: activeCanvasRunByStartNodeId,
          stoppingCanvasRunKeys,
          hasResult: hasIndexedResult,
          onRunGroup: runStoryboardGroupAction,
          onRunNode: runStoryboardResultNodeAction,
          onStopRun: stopStoryboardResultRunAction,
          onOpenNode: showStoryboardResultAction,
          projectNode: (node) => projectWorkspaceNodeData(node, true),
        }),
        renderNode: renderStoryboardWorkspaceNode,
        onRun: () => runStoryboardFrameAction(frame.id, frame.sourceNodeId),
        onStop: activeFrameRun
          ? () => stopStoryboardFrameAction(frame.sourceNodeId)
          : undefined,
      };
    };

    const projectWorkspaceNode = (
      node: SpaceCanvasNode,
    ): Node<WorkspaceNodeData> => {
      const position = { x: node.x, y: node.y };
      const selected = selectedNodeIdSet.has(node.id);
      const nodeData = projectWorkspaceNodeData(node);
      const storyboardFrame = storyboardFrameBySourceId.get(node.id);
      if (storyboardFrame) {
        nodeData.storyboardWorkspace =
          createStoryboardWorkspaceData(storyboardFrame);
      }

      const nodeZIndex = node.type === "group" ? 1 : node.groupId ? 3 : 2;
      const nodeStyleSize = canvasNodeStyleSize(node);
      return {
        id: node.id,
        type: "workSpace",
        position,
        data: nodeData,
        selected,
        className: `ws-flow-node ws-flow-node-${node.type}`,
        draggable:
          interactive &&
          (!nodeData.structureLocked || Boolean(storyboardFrame)),
        deletable: !nodeData.structureLocked,
        zIndex: nodeZIndex,
        ...stableFlowNodeSize(nodeStyleSize),
      } satisfies Node<WorkspaceNodeData>;
    };
    const nextNodes = nodes
      .filter((node) => !hiddenStoryboardNodeIds.has(node.id))
      .map(projectWorkspaceNode);
    return nextNodes;
  }, [
    activeCanvasRunByStartNodeId,
    canvasRenderIndex,
    storyboardFrameRunBySourceId,
    hiddenStoryboardNodeIds,
    interactive,
    structureLockedStoryboardNodeIds,
    nodes,
    canvasId,
    projectId,
    runningNodes,
    selectedNodeIds.length,
    selectedNodeIdSet,
    setRunningNode,
    space,
    catalogCache,
    canvasReferenceItems,
    canvasHasRunningNode,
    runStoryboardGroupAction,
    runStoryboardResultNodeAction,
    runStoryboardFrameAction,
    renderStoryboardWorkspaceNode,
    showStoryboardResultAction,
    stopStoryboardResultRunAction,
    stopStoryboardFrameAction,
    stableNodeActions,
    storyboardFrameBySourceId,
    storyboardFrameRunSummaryById,
    storyboardSourceIdByNodeId,
    stoppingCanvasRunKeys,
  ]);

  const stableDerivedFlowNodes = useStableFlowNodeReferences(
    derivedFlowNodes,
    sameDerivedFlowNode,
  );
  const projectedDetailNode = useMemo(() => {
    if (!detailNodeId) return undefined;
    for (const flowNode of stableDerivedFlowNodes) {
      const node = flowNode.data as WorkspaceNodeData;
      if (node.id === detailNodeId) return node;
      for (const group of node.storyboardWorkspace?.groups || []) {
        const result = group.results.find(
          (candidate) => candidate.nodeId === detailNodeId,
        );
        if (result) return result.node;
      }
    }
    return undefined;
  }, [detailNodeId, stableDerivedFlowNodes]);
  useEffect(() => {
    if (projectedDetailNode) {
      onDetailNodeProjection(projectedDetailNode);
    }
  }, [onDetailNodeProjection, projectedDetailNode]);
  const { flowNodes, setFlowNodes } = useTransientFlowNodes(
    stableDerivedFlowNodes,
    draggingNodeId || resizingNodeId,
  );

  const deleteEdge = useCallback(
    (edgeId: string) => {
      if (!interactive) {
        return;
      }
      setSelectedEdgeId("");
      commitCanvasEdges(edges.filter((edge) => edge.id !== edgeId));
    },
    [commitCanvasEdges, edges, interactive],
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
        .map((edge) => {
          const endpoints = canvasEdgeNodeIDs(edge);
          const sourceNode = canvasRenderIndex.nodeById.get(
            endpoints.sourceNodeId,
          );
          const targetNode = canvasRenderIndex.nodeById.get(
            endpoints.targetNodeId,
          );
          const bindingSummary = canvasTextConnectionSummary(
            targetNode?.composerDraft,
            endpoints.sourceNodeId,
            bindingParamsByTargetId.get(endpoints.targetNodeId),
          );
          const isTextParamConnection = Boolean(
            canvasEdgePurpose(edge) === "media" &&
            targetNode?.type === "power" &&
            targetNode.power &&
            (bindingSummary || canvasNodeSupportsTextBinding(sourceNode)),
          );
          const loadedParams = bindingParamsByTargetId.get(
            endpoints.targetNodeId,
          );
          const availableParams =
            isTextParamConnection && targetNode && loadedParams
              ? activeCanvasTextBindingParams(
                  targetNode,
                  loadedParams,
                  endpoints.sourceNodeId,
                )
              : undefined;
          const lyricsAvailable =
            canvasNodeSupportsStoryboardLyrics(targetNode);
          const bindingControl = isTextParamConnection
            ? resolveCanvasTextBindingControl(
                bindingSummary,
                availableParams,
                lyricsAvailable,
              )
            : undefined;
          return {
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
              bindingLabel: bindingControl?.label,
              bindingInteractive: bindingControl?.interactive,
              bindingShowChevron: bindingControl?.showChevron,
              bindingInvalid: bindingControl?.invalid,
            },
          };
        }),
    [
      bindingParamsByTargetId,
      canvasNodeIds,
      canvasRenderIndex.nodeById,
      edges,
      hiddenStoryboardNodeIds,
    ],
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
    const requestedNode = nodes.find(
      (item) => item.id === focusNodeRequest.nodeId,
    );
    if (!requestedNode) {
      onFocusNodeRequestConsumed(focusNodeRequest);
      return;
    }
    const hiddenFrame = hiddenStoryboardNodeIds.has(requestedNode.id)
      ? storyboardFrames.find((frame) =>
          frame.memberNodeIds.includes(requestedNode.id),
        )
      : undefined;
    const node = hiddenFrame
      ? nodes.find((item) => item.id === hiddenFrame.sourceNodeId) ||
        requestedNode
      : requestedNode;
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
    flowInstance,
    flushViewportZoom,
    focusNodeRequest,
    hiddenStoryboardNodeIds,
    nodes,
    onFocusNodeRequestConsumed,
    storyboardFrames,
  ]);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (!interactive) {
        return;
      }
      const constrainedChanges = changes.map((change) => {
        if (change.type !== "position" || !change.position) {
          return change;
        }
        const position = constrainScriptGroupMemberPosition(
          nodes,
          change.id,
          change.position,
        );
        if (position === change.position) {
          return change;
        }
        return {
          ...change,
          position,
          ...(change.positionAbsolute ? { positionAbsolute: position } : {}),
        };
      });
      setFlowNodes((current) => {
        return applyNodeChanges(constrainedChanges, current);
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
    [interactive, nodes, onSelectNodes, selectedNodeIds, setFlowNodes],
  );

  const loadCanvasTargetPowerForm = useCallback(
    (targetNode: SpaceCanvasNode) => {
      const targetId = Number(targetNode.composerDraft?.selectedTargetId || 0);
      const releaseId = Number(
        space.release?.id || space.project.release_id || 0,
      );
      return catalogCache.loadPowerForm(
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
    },
    [catalogCache, projectId, space.project.release_id, space.release?.id],
  );

  const textParamTargetNodes = useMemo(() => {
    const targetNodeIds = new Set(
      edges.flatMap((edge) => {
        if (canvasEdgePurpose(edge) !== "media") {
          return [];
        }
        const endpoints = canvasEdgeNodeIDs(edge);
        const sourceNode = canvasRenderIndex.nodeById.get(
          endpoints.sourceNodeId,
        );
        const targetNode = canvasRenderIndex.nodeById.get(
          endpoints.targetNodeId,
        );
        return targetNode?.type === "power" &&
          targetNode.power &&
          canvasNodeSupportsTextBinding(sourceNode)
          ? [targetNode.id]
          : [];
      }),
    );
    for (const node of nodes) {
      if (
        node.type === "power" &&
        node.power &&
        (Object.keys(node.composerDraft?.paramBindings || {}).length > 0 ||
          Boolean(node.composerDraft?.storyboardLyricsSourceNodeId))
      ) {
        targetNodeIds.add(node.id);
      }
    }
    return nodes.filter((node) => targetNodeIds.has(node.id));
  }, [canvasRenderIndex.nodeById, edges, nodes]);

  useEffect(() => {
    if (textParamTargetNodes.length === 0) {
      return;
    }
    let canceled = false;
    void Promise.all(
      textParamTargetNodes.map(
        async (targetNode): Promise<readonly [string, PowerParam[]] | null> => {
          try {
            const form = await loadCanvasTargetPowerForm(targetNode);
            return [targetNode.id, form.params || []] as const;
          } catch {
            return null;
          }
        },
      ),
    ).then((entries) => {
      if (canceled) {
        return;
      }
      setBindingParamsByTargetId(
        new Map(
          entries.filter((entry): entry is readonly [string, PowerParam[]] =>
            Boolean(entry),
          ),
        ),
      );
    });
    return () => {
      canceled = true;
    };
  }, [loadCanvasTargetPowerForm, textParamTargetNodes]);

  const commitCanvasTextConnection = useCallback(
    (sourceNodeId: string, targetNodeId: string, targetParamKey: string) => {
      const sourceExists = nodes.some((node) => node.id === sourceNodeId);
      const targetNode = nodes.find((node) => node.id === targetNodeId);
      if (!sourceExists || !targetNode) {
        toast.info("节点已变化，请重新连接");
        return;
      }
      const currentDraft = readNodeComposerDraft(targetNode);
      if (
        !canvasTextBindingParamAvailable(
          currentDraft,
          targetParamKey,
          sourceNodeId,
        )
      ) {
        toast.info("该参数已被其他文本连接占用，请重新选择");
        return;
      }
      const nextDraft = replaceCanvasParamBindingForConnection(
        currentDraft,
        sourceNodeId,
        targetParamKey,
      );
      commitCanvasEdges(
        reconcileCanvasGroupEdges(
          nodes,
          appendCanvasEdge(edgesRef.current, sourceNodeId, targetNodeId),
        ),
        nextDraft !== currentDraft
          ? { draftByNodeId: new Map([[targetNode.id, nextDraft]]) }
          : undefined,
      );
    },
    [commitCanvasEdges, nodes],
  );

  const commitCanvasStoryboardLyricsConnection = useCallback(
    (sourceNodeId: string, targetNodeId: string) => {
      const sourceNode = nodes.find((node) => node.id === sourceNodeId);
      const targetNode = nodes.find((node) => node.id === targetNodeId);
      if (
        !targetNode ||
        !canvasNodeSupportsTextBinding(sourceNode) ||
        !canvasNodeSupportsStoryboardLyrics(targetNode)
      ) {
        toast.info("节点已变化，请重新连接");
        return;
      }

      const currentDraft = readNodeComposerDraft(targetNode);
      const previousLyricsSourceNodeId = String(
        currentDraft.storyboardLyricsSourceNodeId || "",
      ).trim();
      const nextDraft = withCanvasStoryboardLyricsSource(
        currentDraft,
        sourceNodeId,
      );
      const retainedEdges = edgesRef.current.filter((edge) => {
        if (
          !previousLyricsSourceNodeId ||
          previousLyricsSourceNodeId === sourceNodeId ||
          canvasEdgePurpose(edge) !== "media"
        ) {
          return true;
        }
        const endpoints = canvasEdgeNodeIDs(edge);
        return !(
          endpoints.sourceNodeId === previousLyricsSourceNodeId &&
          endpoints.targetNodeId === targetNodeId
        );
      });
      if (retainedEdges.length !== edgesRef.current.length) {
        setSelectedEdgeId("");
      }
      commitCanvasEdges(
        reconcileCanvasGroupEdges(
          nodes,
          appendCanvasEdge(retainedEdges, sourceNodeId, targetNodeId),
        ),
        { draftByNodeId: new Map([[targetNode.id, nextDraft]]) },
      );
    },
    [commitCanvasEdges, nodes],
  );

  useEffect(() => {
    for (const targetNode of textParamTargetNodes) {
      const loadedParams = bindingParamsByTargetId.get(targetNode.id);
      if (!loadedParams) {
        continue;
      }
      const sourceNodeIds = edges.flatMap((edge) => {
        if (canvasEdgePurpose(edge) !== "media") {
          return [];
        }
        const endpoints = canvasEdgeNodeIDs(edge);
        if (endpoints.targetNodeId !== targetNode.id) {
          return [];
        }
        const sourceNode = canvasRenderIndex.nodeById.get(
          endpoints.sourceNodeId,
        );
        if (
          targetNode.composerDraft?.storyboardLyricsSourceNodeId ===
          endpoints.sourceNodeId
        ) {
          return [];
        }
        return canvasNodeSupportsTextBinding(sourceNode)
          ? [endpoints.sourceNodeId]
          : [];
      });
      const repair = resolveAutomaticCanvasTextBindingRepair(
        sourceNodeIds,
        targetNode.composerDraft,
        activeCanvasTextParams(targetNode, loadedParams),
      );
      if (repair) {
        commitCanvasTextConnection(
          repair.sourceNodeId,
          targetNode.id,
          repair.targetParamKey,
        );
      }
    }
  }, [
    bindingParamsByTargetId,
    canvasRenderIndex.nodeById,
    commitCanvasTextConnection,
    edges,
    textParamTargetNodes,
  ]);

  const editEdgeParamBinding = useCallback(
    async (edgeId: string) => {
      if (!interactive) {
        return;
      }
      const edge = edgesRef.current.find(
        (candidate) => candidate.id === edgeId,
      );
      if (!edge) {
        return;
      }
      const { sourceNodeId, targetNodeId } = canvasEdgeNodeIDs(edge);
      const sourceNode = nodes.find((node) => node.id === sourceNodeId);
      const targetNode = nodes.find((node) => node.id === targetNodeId);
      const currentBinding = canvasTextConnectionSummary(
        targetNode?.composerDraft,
        sourceNodeId,
      );
      if (
        targetNode?.type !== "power" ||
        !targetNode.power ||
        (!currentBinding && !canvasNodeSupportsTextBinding(sourceNode))
      ) {
        return;
      }
      try {
        const form = await loadCanvasTargetPowerForm(targetNode);
        const params = activeCanvasTextBindingParams(
          targetNode,
          form.params || [],
          sourceNodeId,
        );
        const selectedBinding = canvasTextConnectionSummary(
          targetNode.composerDraft,
          sourceNodeId,
          form.params || [],
        );
        const lyricsAvailable = canvasNodeSupportsStoryboardLyrics(targetNode);
        setBindingParamsByTargetId((current) => {
          const next = new Map(current);
          next.set(targetNodeId, form.params || []);
          return next;
        });
        setSelectedEdgeId(edgeId);
        if (lyricsAvailable) {
          setPendingParamBinding({
            sourceNodeId,
            targetNodeId,
            sourceTitle: sourceNode?.title || "上游节点",
            targetTitle: targetNode.title || targetNode.power.name,
            params,
            selectedParamKey:
              selectedBinding?.purpose === "param"
                ? selectedBinding.targetParamKey
                : undefined,
            lyricsAvailable: true,
            lyricsSelected: selectedBinding?.purpose === "storyboard_lyrics",
            editing: true,
          });
          return;
        }
        const decision = resolveCanvasTextBindingDecision(params);
        if (decision.kind === "unavailable") {
          toast.info("当前能力没有可用的文本参数");
          return;
        }
        if (decision.kind === "automatic") {
          if (selectedBinding?.targetParamKey !== decision.targetParamKey) {
            commitCanvasTextConnection(
              sourceNodeId,
              targetNodeId,
              decision.targetParamKey,
            );
          }
          return;
        }
        setPendingParamBinding({
          sourceNodeId,
          targetNodeId,
          sourceTitle: sourceNode?.title || "上游节点",
          targetTitle: targetNode.title || targetNode.power.name,
          params: decision.params,
          selectedParamKey: selectedBinding?.targetParamKey,
          lyricsAvailable: false,
          lyricsSelected: false,
          editing: true,
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "参数列表加载失败",
        );
      }
    },
    [commitCanvasTextConnection, interactive, loadCanvasTargetPowerForm, nodes],
  );

  const requestEditEdgeBinding = useCallback(
    (edgeId: string) => {
      void editEdgeParamBinding(edgeId);
    },
    [editEdgeParamBinding],
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
    return baseFlowEdges.map((edge) => {
      const decoration = flowEdgeDecoration(
        edge,
        canvasRenderIndex.nodeById,
        hoveredNodeId,
        selectedNodeId,
        selectedEdgeId,
        highlightedPathEdges,
        highlightedPathSourceNodeId,
      );
      const decoratedEdge = decorateFlowEdge(edge, decoration);
      return {
        ...decoratedEdge,
        data: {
          ...decoratedEdge.data,
          onDelete: requestDeleteEdge,
          onEditBinding: requestEditEdgeBinding,
        },
      };
    });
  }, [
    baseFlowEdges,
    canvasRenderIndex,
    hoveredNodeId,
    requestDeleteEdge,
    requestEditEdgeBinding,
    selectedEdgeId,
    selectedNodeId,
  ]);

  const renderedEdges = useMemo(
    () => [...flowEdges, ...(proximityEdge ? [proximityEdge] : [])],
    [flowEdges, proximityEdge],
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
      commitCanvasEdges(
        replaceVisibleCanvasEdges(
          edgesRef.current,
          new Set(flowEdges.map((edge) => edge.id)),
          flowEdgesToCanvasEdges(nextEdges),
        ),
      );
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
      const sourceNode = nodes.find((node) => node.id === sourceNodeId);
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
          const form = await loadCanvasTargetPowerForm(targetNode);
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
          const formValues = reconcileReferenceModeForMediaSources(
            formParams,
            savedValues,
            [
              ...currentConnections.map((connection) => connection.source),
              ...mediaSourceNodes,
            ],
          );
          const projectedMultiImagePlan = resolveCanvasMultiImagePlan({
            node: targetNode,
            content: targetDraft.promptContent,
            items: canvasReferenceItems,
            connections: currentConnections,
            params: formParams,
            values: formValues,
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
      } else if (
        targetNode?.type === "power" &&
        targetNode.power &&
        canvasNodeSupportsTextBinding(sourceNode)
      ) {
        try {
          const form = await loadCanvasTargetPowerForm(targetNode);
          const params = activeCanvasTextBindingParams(
            targetNode,
            form.params || [],
            sourceNodeId,
          );
          const lyricsAvailable =
            canvasNodeSupportsStoryboardLyrics(targetNode);
          setBindingParamsByTargetId((current) => {
            const next = new Map(current);
            next.set(targetNodeId, form.params || []);
            return next;
          });
          if (lyricsAvailable) {
            setPendingParamBinding({
              sourceNodeId,
              targetNodeId,
              sourceTitle: sourceNode?.title || "上游节点",
              targetTitle: targetNode.title || targetNode.power.name,
              params,
              lyricsAvailable: true,
              lyricsSelected: false,
              editing: false,
            });
            return;
          }
          const decision = resolveCanvasTextBindingDecision(params);
          if (decision.kind === "unavailable") {
            toast.info("当前能力没有可用的文本参数，未建立连线");
            return;
          }
          if (decision.kind === "automatic") {
            commitCanvasTextConnection(
              sourceNodeId,
              targetNodeId,
              decision.targetParamKey,
            );
            return;
          }
          setPendingParamBinding({
            sourceNodeId,
            targetNodeId,
            sourceTitle: sourceNode?.title || "上游节点",
            targetTitle: targetNode.title || targetNode.power.name,
            params: decision.params,
            lyricsAvailable: false,
            lyricsSelected: false,
            editing: false,
          });
          return;
        } catch (error) {
          toast.error(
            error instanceof Error
              ? `参数列表加载失败，未建立连线：${error.message}`
              : "参数列表加载失败，未建立连线",
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
      commitCanvasTextConnection,
      commitCanvasEdges,
      loadCanvasTargetPowerForm,
      nodes,
      onNodeDraftChange,
    ],
  );

  const finishPendingParamBinding = useCallback(
    (targetParamKey: string) => {
      const pending = pendingParamBinding;
      if (!pending) {
        return;
      }
      setPendingParamBinding(null);
      commitCanvasTextConnection(
        pending.sourceNodeId,
        pending.targetNodeId,
        targetParamKey,
      );
    },
    [commitCanvasTextConnection, pendingParamBinding],
  );

  const finishPendingLyricsBinding = useCallback(() => {
    const pending = pendingParamBinding;
    if (!pending?.lyricsAvailable) {
      return;
    }
    setPendingParamBinding(null);
    commitCanvasStoryboardLyricsConnection(
      pending.sourceNodeId,
      pending.targetNodeId,
    );
  }, [commitCanvasStoryboardLyricsConnection, pendingParamBinding]);

  const closePendingParamBinding = useCallback(() => {
    setPendingParamBinding(null);
  }, []);

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

  const handleConnectStart = useCallback<OnConnectStart>(
    (_event, params) => {
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

  const handleConnectEnd = useCallback<OnConnectEnd>(
    (event) => {
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
        .map((nodeId) => storyboardFrameBySourceId.get(nodeId))
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
    storyboardFrameBySourceId,
  ]);

  const updateProximityEdge = useCallback((nextEdge: Edge | null) => {
    setProximityEdge((current: Edge | null) =>
      isSamePreviewEdge(current, nextEdge) ? current : nextEdge,
    );
  }, []);

  const checkValidConnection = useCallback<IsValidConnection>(
    (connection) => {
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
      if (storyboardFrameBySourceId.has(draggedNode.id)) {
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
      const constrainedPosition = constrainScriptGroupMemberPosition(
        nodes,
        draggedNode.id,
        draggedNode.position,
      );
      const effectiveDraggedNode =
        constrainedPosition === draggedNode.position
          ? draggedNode
          : { ...draggedNode, position: constrainedPosition };
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
      const closest = findClosestConnectableNode(
        effectiveDraggedNode,
        flowNodes,
        nodes,
      );
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
      storyboardFrameBySourceId,
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
      if (storyboardFrameBySourceId.has(draggedNode.id)) {
        const movedNodes = withMovedCanvasNode(
          nodes,
          draggedNode.id,
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
        const position = constrainScriptGroupMemberPosition(
          nodes,
          draggedNode.id,
          draggedNode.position,
        );
        const movedNodes = withMovedCanvasNode(nodes, draggedNode.id, position);
        const groupedNodes = withCanvasNodeGroupAtPosition(
          movedNodes,
          draggedNode.id,
          position,
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
          commitCanvasEdges(groupedEdges);
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
      commitCanvasEdges,
      flowEdges,
      interactive,
      structureLockedStoryboardNodeIds,
      onNodesCommit,
      nodes,
      proximityEdge,
      storyboardFrameBySourceId,
      updateProximityEdge,
    ],
  );

  const handleCanvasPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!interactive || event.button !== 2) {
        return;
      }
      suppressNextPaneContextMenuRef.current = false;
      if (!isCanvasPaneTarget(event.target)) {
        return;
      }
      rightSelectionRef.current = {
        pointerId: event.pointerId,
        start: { x: event.clientX, y: event.clientY },
        baseNodeIds: event.ctrlKey || event.metaKey ? [...selectedNodeIds] : [],
        moved: false,
        contextMenuHandled: false,
      };
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture?.(event.pointerId);
    },
    [interactive, selectedNodeIds],
  );

  const openCanvasNodeMenuAtScreen = useCallback(
    (screen: CanvasPoint) => {
      onOpenNodeMenu(screen, flowPositionFromScreen(flowInstance, screen));
    },
    [flowInstance, onOpenNodeMenu],
  );

  const handleCanvasContextMenuCapture = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      const gesture = rightSelectionRef.current;
      if (
        !interactive ||
        (!gesture && !suppressNextPaneContextMenuRef.current)
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      suppressNextPaneContextMenuRef.current = false;
      if (gesture) {
        gesture.contextMenuHandled = true;
      }
    },
    [interactive],
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
      suppressNextPaneContextMenuRef.current = !gesture.contextMenuHandled;
      event.preventDefault();
      event.stopPropagation();
      if (!gesture.moved && event.type === "pointerup") {
        openCanvasNodeMenuAtScreen({
          x: event.clientX,
          y: event.clientY,
        });
      }
    },
    [openCanvasNodeMenuAtScreen],
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
      openCanvasNodeMenuAtScreen({ x: event.clientX, y: event.clientY });
    },
    [interactive, onSelectNodes, openCanvasNodeMenuAtScreen],
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
      openCanvasNodeMenuAtScreen({ x: event.clientX, y: event.clientY });
    },
    [interactive, openCanvasNodeMenuAtScreen],
  );

  const handleNodeContextMenu = useCallback(
    (event: ReactMouseEvent | MouseEvent, node: Node) => {
      if (!interactive) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
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
    [interactive, onSelectNodes, selectedNodeIdSet],
  );

  const actionNode = nodeActionMenu
    ? nodes.find((node) => node.id === nodeActionMenu.nodeId) || null
    : null;
  const actionStoryboardFrame = nodeActionMenu
    ? storyboardFrameBySourceId.get(nodeActionMenu.nodeId) || null
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

  const handleNodeMouseEnter = useCallback<NodeMouseHandler>((_event, node) => {
    setHoveredNodeId(node.id);
    const sourceNode =
      node.type === "workSpace"
        ? (node as Node<WorkspaceNodeData>).data.sourceNode
        : null;
    if (sourceNode && nodeUsesComposerSettings(sourceNode)) {
      void preloadCanvasNodeSettings();
    }
  }, []);

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
      onContextMenuCapture={handleCanvasContextMenuCapture}
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

      <CanvasViewControls
        canvasCount={canvasCount}
        activeCanvasName={activeCanvasName}
        canvasManagerOpen={canvasManagerOpen}
        showViewTools={interactive}
        showMiniMap={showMiniMap}
        snapToGrid={snapToGrid}
        zoom={viewportZoom}
        onOpenCanvasManager={onOpenCanvasManager}
        onToggleMiniMap={toggleMiniMap}
        onToggleSnap={toggleSnapToGrid}
        onReset={resetCanvasView}
        onZoomIn={zoomCanvasIn}
        onZoomOut={zoomCanvasOut}
        onZoomChange={zoomCanvasTo}
      />

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

      {pendingParamBinding ? (
        <Suspense
          fallback={<CanvasModuleLoading label="正在加载参数绑定" overlay />}
        >
          <CanvasParamBindingDialog
            sourceTitle={pendingParamBinding.sourceTitle}
            targetTitle={pendingParamBinding.targetTitle}
            params={pendingParamBinding.params}
            selectedParamKey={pendingParamBinding.selectedParamKey}
            lyricsAvailable={pendingParamBinding.lyricsAvailable}
            lyricsSelected={pendingParamBinding.lyricsSelected}
            editing={pendingParamBinding.editing}
            onClose={closePendingParamBinding}
            onSelect={finishPendingParamBinding}
            onSelectLyrics={finishPendingLyricsBinding}
          />
        </Suspense>
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
    current = refreshCanvasStoryboardDerivedGroups({
      canvas: marked,
      assetCate,
      powers,
      sourceNodeIds: [sourceNodeId],
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
    assetID: asset.libraryType === "asset" ? asset.id : 0,
    assetVersionID: asset.libraryType === "asset" ? asset.versionID : 0,
  };
}

function buildGeneratedNodeResultPatch(
  node: SpaceCanvasNode,
  result: unknown,
  fallbackPrompt: string,
): Partial<SpaceCanvasNode> {
  const resultAssetValue = valueAtUnknownPath(result, "asset");
  const resultAsset = isUnknownRecord(resultAssetValue)
    ? normalizeProjectAsset(resultAssetValue)
    : undefined;
  const rawOutput = firstDefined(
    valueAtUnknownPath(result, "output"),
    valueAtUnknownPath(result, "asset", "version", "content"),
    valueAtUnknownPath(result, "version", "content"),
    valueAtUnknownPath(result, "result", "output"),
    valueAtUnknownPath(result, "result", "asset", "version", "content"),
    valueAtUnknownPath(result, "data", "output"),
    valueAtUnknownPath(result, "data", "content"),
    valueAtUnknownPath(result, "data", "result"),
    valueAtUnknownPath(result, "data"),
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
          valueAtUnknownPath(result, "asset", "version", "content"),
          valueAtUnknownPath(result, "version", "content"),
          valueAtUnknownPath(result, "result"),
          output,
        ])
      : null;
  const storyboardGrid =
    node.type === "power" &&
    isStoryboardGridPowerType(node.power, node.kind, node.outputType)
      ? parseStoryboardGridOutput([
          rawOutput,
          valueAtUnknownPath(result, "asset", "version", "content"),
          valueAtUnknownPath(result, "version", "content"),
          valueAtUnknownPath(result, "result"),
          output,
        ])
      : null;
  const resultKind = firstNonEmptyText(
    String(valueAtUnknownPath(result, "asset", "kind") || ""),
    String(valueAtUnknownPath(result, "kind") || ""),
    nodePreviewKind(node, output),
  );
  const preview = generatedPreviewFromValue(output, resultKind);
  const outputText = displayTextFromOutput(output, "");
  const generatedTitle = firstNonEmptyText(
    storyboardGrid?.title,
    storyboard?.title,
  );
  const fallbackSummary = generatedNodeSummaryText(fallbackPrompt);
  const summary =
    generatedNodeSummaryText(storyboardGrid?.summary) ||
    generatedNodeSummaryText(storyboard?.summary) ||
    generatedNodeSummaryText(preview.text) ||
    generatedNodeSummaryText(outputText) ||
    (fallbackSummary ? `已按提示生成：${fallbackSummary}` : "生成完成");

  return {
    ...(generatedTitle && node.titleMode === "auto"
      ? { title: generatedTitle }
      : {}),
    description: summary,
    resultRef: buildNodeResultRef(result),
    resultOutput: storyboardGrid || storyboard || output,
    asset: resultAsset || node.asset,
    kind: resultAsset?.kind || node.power?.kind || node.kind,
  };
}

function generatedNodeSummaryText(value: unknown) {
  const text = firstNonEmptyText(value);
  return looksLikeURL(text) ? "" : text;
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

function activeCanvasTextBindingParams(
  targetNode: SpaceCanvasNode,
  params: PowerParam[],
  sourceNodeId: string,
) {
  return availableCanvasTextBindingParams(
    activeCanvasTextParams(targetNode, params),
    readNodeComposerDraft(targetNode),
    sourceNodeId,
  );
}

function activeCanvasTextParams(
  targetNode: SpaceCanvasNode,
  params: PowerParam[],
) {
  const draft = readNodeComposerDraft(targetNode);
  const values = mergeSavedComposerParamValues(params, draft);
  return filterActivePowerParams(params, values);
}

function mergeBackendSingleNodeDraft(node: SpaceCanvasNode): SpaceCanvasNode {
  const draft = readNodeComposerDraft(node);
  if (node.type !== "power" && node.type !== "agent") {
    return node;
  }
  return {
    ...node,
    composerDraft: {
      ...node.composerDraft,
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
  canvasId: number;
  assetCate: AssetCate;
  space: SpaceBootstrap;
  startNode: SpaceCanvasNode;
  singleNode?: boolean;
  targetNodeIds?: string[];
  executionScope?: "storyboard_frame";
  patchStartNodeResult?: boolean;
  nodes: SpaceCanvasNode[];
  edges: SpaceCanvasEdge[];
  viewport: SpaceCanvasState["viewport"];
  canvasUpdatedAt?: string;
  flushCanvasSave?: (canvas: SpaceCanvasState) => Promise<void>;
  runInput?: Record<string, unknown>;
  onNodeResult: NodeResultSetter;
  onAssetCreated: (asset: ProjectAsset) => void;
  setRunningNode?: RunningNodeSetter;
  getRunningNode?: (nodeId: string) => RunningNodeState | undefined;
  runningNodeBatcher?: RunningNodeBatcher;
  requestFlowFeedback?: FlowFeedbackRequester;
  requestNodeTitle?: (
    node: SpaceCanvasNode,
    result: CanvasNodeResultRef,
  ) => void;
  onCanvasRunChange?: (run: CanvasRunRef) => void;
  canvasRun?: CanvasRunRef | null;
};

const canvasRunStreamTimeoutMs = 60 * 60 * 1000;
const canvasRunStatusPollIntervalMs = 2000;
const runningNodeFlushIntervalMs = 80;
const canvasRunStatusPollFailureLimit = 3;

async function runCanvasFromStartNode(input: CanvasStartRunInput) {
  const requestId = createCanvasRunRequestId(input.startNode.id);
  const appliedNodeResults = new Set<string>();
  let hasAppliedNodeResult = false;
  let streamLastId = "0-0";
  const executionCanvas: SpaceCanvasState = {
    id: input.canvasId,
    name: "",
    sort: 0,
    status: 1,
    assetCateId: Number(input.assetCate.id || 0),
    nextNodeNo: nextCanvasNodeNo(input.nodes),
    nodes: input.nodes,
    edges: input.edges,
    viewport: input.viewport || {},
    updatedAt: input.canvasUpdatedAt,
  };
  await input.flushCanvasSave?.(executionCanvas);
  let rawCanvasRun = await runSpaceCanvas({
    projectId: input.projectId,
    canvasId: input.canvasId,
    assetCateId: Number(input.assetCate.id || 0),
    startNodeId: input.startNode.id,
    requestId,
    singleNode: input.singleNode,
    targetNodeIds: input.targetNodeIds,
    executionScope: input.executionScope,
    canvas: executionCanvas,
    runInput: {
      ...(input.runInput || {}),
      start_node_id: input.startNode.id,
    },
  });
  notifyCanvasRunChange(input, normalizeCanvasRunRef(rawCanvasRun));
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
    notifyCanvasRunChange(input, canvasRun);
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

function notifyCanvasRunChange(input: CanvasStartRunInput, run: CanvasRunRef) {
  const nextRun = {
    ...run,
    canvas_id: Number(run.canvas_id || input.canvasId),
    asset_cate_id: Number(run.asset_cate_id || input.assetCate.id || 0),
    start_node_id: String(run.start_node_id || input.startNode.id),
    execution_scope: String(run.execution_scope || input.executionScope || ""),
  };
  input.canvasRun = nextRun;
  input.onCanvasRunChange?.(nextRun);
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
      isCanvasRunTerminalStatus(canvasRunNodeResultStatus(result)),
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
    if (status === "canceled") {
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
  const output = asUnknownRecord(canvasRun.output);
  const outputData = asUnknownRecord(output.data);
  const approvals = Array.isArray(canvasRun.approvals)
    ? canvasRun.approvals
    : Array.isArray(output.approvals)
      ? output.approvals
      : Array.isArray(outputData.approvals)
        ? outputData.approvals
        : [];
  return approvals.find(
    (approval) =>
      isUnknownRecord(approval) &&
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
    execution_id: Number(output.execution_id || 0),
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
  const result = isUnknownRecord(resultOutput) ? resultOutput : {};
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
        result.execution_id ||
        0,
    ),
    node_type: String(output.node_type || nodeResult.node_type || ""),
    node_run_id: Number(output.node_run_id || nodeResult.node_run_id || 0),
    run_id: Number(output.run_id || nodeResult.run_id || result.run_id || 0),
    request_id: String(
      output.request_id || nodeResult.request_id || result.request_id || "",
    ),
    child_run_id: Number(
      output.child_run_id ||
        nodeResult.child_run_id ||
        result.child_run_id ||
        0,
    ),
    child_request_id: String(
      output.child_request_id ||
        nodeResult.child_request_id ||
        result.child_request_id ||
        "",
    ),
    status: String(output.status || nodeResult.status || ""),
    error: String(output.error || nodeResult.error || result.error || ""),
    output: nodeResult.output ?? result.output ?? resultOutput,
    asset: nodeResult.asset ?? result.asset,
    version: nodeResult.version ?? result.version ?? nodeResult.asset?.version,
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
        result.agent_run_id ||
        0,
    ),
    source_signature: nodeResult.source_signature,
    runTiming: normalizeCanvasNodeRunTiming(
      firstDefined(output.run_timing, nodeResult.runTiming, result.run_timing),
    ),
  };
}

function streamApprovalFromOutput(
  output: Record<string, unknown>,
  result: Record<string, unknown>,
) {
  const nestedResult = asUnknownRecord(result.result);
  const approval = firstDefined(
    output.approval,
    result.approval,
    nestedResult.approval,
  );
  if (approval && typeof approval === "object") {
    return approval;
  }
  const approvalId = Number(
    firstDefined(
      output.approval_id,
      result.approval_id,
      nestedResult.approval_id,
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
  if (eventOutput.persists_result) {
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
  const functionDefinition = canvasFunctionDefinition(functionKey);
  if (functionDefinition?.runsInBackend && !functionDefinition.persistsResult) {
    return true;
  }
  return Boolean(
    result.asset ||
    result.version ||
    valueAtUnknownPath(result, "asset", "version") ||
    valueAtUnknownPath(result, "data", "asset") ||
    valueAtUnknownPath(result, "data", "version"),
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
    input.setRunningNode((current) => {
      const existing = current[nodeId];
      return {
        ...current,
        [nodeId]: {
          ...existing,
          nodeId,
          title: String(output.node_name || output.node_key || nodeId),
          startedAt: resolveCanvasActiveRunStartedAt({
            currentStartedAt: existing?.startedAt,
          }),
          status: "running",
          progress: Math.max(existing?.progress || 0, 18),
        },
      };
    });
    return;
  }
  if (event === "node_output") {
    const updateRunningNode: RunningNodeStateUpdate = (running) => {
      if (!running || running.status !== "running") {
        return running;
      }
      const nodeOutput = canvasStreamNodeOutput(output.output);
      const nodeType = String(output.node_type || "").toLowerCase();
      const isPowerStream = nodeType === "power";
      const isAgentStream = nodeType === "agent";
      const streamEvent = String(
        nodeOutput.semantic_event || nodeOutput.event || "",
      ).toLowerCase();
      const streamMeta = canvasStreamNodeOutput(nodeOutput.meta);
      const estimatedDurationMs = normalizeCanvasEstimatedDuration(
        firstDefined(
          streamMeta.estimated_duration_ms,
          streamMeta.estimatedDurationMs,
        ),
      );
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
      const nextTargetCount = Number(streamMeta.target_count || 0);
      const generatedCount = isStructuredStatus
        ? Math.max(
            running.generatedCount || 0,
            Number.isFinite(nextGeneratedCount) ? nextGeneratedCount : 0,
          )
        : running.generatedCount;
      const targetCount =
        isStructuredStatus &&
        Number.isInteger(nextTargetCount) &&
        nextTargetCount > 0
          ? nextTargetCount
          : running.targetCount;
      const deltaText =
        isPowerStream &&
        typeof nodeOutput.text === "string" &&
        (streamEvent === "delta" || !streamEvent)
          ? nodeOutput.text
          : "";
      const streamOutput = hasDisplayableStreamOutput
        ? nodeOutput
        : running.streamOutput;
      return {
        ...running,
        progress: Math.max(running.progress, 72),
        streamText: deltaText
          ? `${running.streamText || ""}${deltaText}`
          : running.streamText,
        streamOutput,
        estimatedDurationMs: estimatedDurationMs || running.estimatedDurationMs,
        streamStarted:
          running.streamStarted || Boolean(deltaText) || Boolean(streamOutput),
        ...(isStructuredStatus
          ? { streamStarted: true, generatedCount, targetCount }
          : {}),
        agent: isAgentStream
          ? reduceCanvasAgentRuntime(running.agent, nodeOutput)
          : running.agent,
      };
    };
    if (input.runningNodeBatcher) {
      input.runningNodeBatcher.enqueue(nodeId, updateRunningNode);
    } else {
      input.setRunningNode((current) => {
        const nextNode = updateRunningNode(current[nodeId]);
        if (nextNode === current[nodeId]) {
          return current;
        }
        return nextNode
          ? { ...current, [nodeId]: nextNode }
          : omitRunningNode(current, nodeId);
      });
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
    execution_scope: next.execution_scope || current.execution_scope,
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
    isCanvasRunTerminalStatus(result.status),
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
        startedAt: resolveCanvasActiveRunStartedAt({
          nodeRunTiming: result.runTiming,
          currentStartedAt: current[nodeId]?.startedAt,
        }),
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
      startedAt: result.runTiming?.startedAt || running.startedAt,
      finishedAt: result.runTiming?.finishedAt || Date.now(),
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
  const finishedStatus = canvasRun.status === "success" ? "success" : "error";
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
  const storyboardFrameNodeId = canvasRunStoryboardFrameNodeId(canvasRun);
  const allowed = new Set(
    backendCanvasRunNodeIds(input, canvasRun).filter(
      (nodeId) =>
        nodeId === storyboardFrameNodeId ||
        !managedNodeIds ||
        managedNodeIds.has(nodeId),
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
  const runTimingByNodeId = new Map<string, CanvasNodeRunTiming>();
  for (const nodeRun of canvasRun.node_runs || []) {
    if (nodeRun.node_key && nodeRun.runTiming) {
      runTimingByNodeId.set(String(nodeRun.node_key), nodeRun.runTiming);
    }
  }
  for (const result of canvasRun.node_results || []) {
    if (result.node_key && result.runTiming) {
      runTimingByNodeId.set(result.node_key, result.runTiming);
    }
  }
  const storyboardFrameNodeId = canvasRunStoryboardFrameNodeId(canvasRun);
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
    const fallbackNodeId = canvasExecutionFallbackRunningNodeId(
      canvasRun.start_node_id,
      storyboardFrameNodeId,
    );
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
  if (storyboardFrameNodeId) {
    activeNodeStatuses.set(
      storyboardFrameNodeId,
      runStatus === "waiting" ? "waiting" : "running",
    );
  }
  if (activeNodeStatuses.size === 0) {
    return;
  }
  input.setRunningNode((current) => {
    let changed = false;
    const next = { ...current };
    for (const [nodeId, status] of activeNodeStatuses) {
      const node = input.nodes.find((item) => item.id === nodeId);
      const isStoryboardFrame = nodeId === storyboardFrameNodeId;
      if (!node && !isStoryboardFrame) {
        continue;
      }
      const existing = current[nodeId];
      const startedAt = resolveCanvasActiveRunStartedAt({
        nodeRunTiming: runTimingByNodeId.get(nodeId),
        runCreatedAt: canvasRun.created_at,
        currentStartedAt: existing?.startedAt,
      });
      if (existing?.status === status && existing.startedAt === startedAt) {
        continue;
      }
      next[nodeId] = {
        ...existing,
        nodeId,
        title: isStoryboardFrame
          ? `${input.startNode.title || "分镜脚本"}制作区`
          : node?.title || nodeId,
        startedAt,
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
  const storyboardFrameNodeId = canvasRunStoryboardFrameNodeId(canvasRun);
  if (storyboardFrameNodeId) {
    result.add(storyboardFrameNodeId);
  }
  if (input.singleNode) {
    result.add(input.startNode.id);
  }
  return [...result];
}

function storyboardFrameCurrentNodeTitle(
  frame: StoryboardFrameScope,
  activeRun: CanvasRunRef | undefined,
  runningNodes: RunningNodeMap,
  nodesByID: ReadonlyMap<string, SpaceCanvasNode>,
) {
  const activeNodeIds = new Set(
    frame.memberNodeIds.filter((nodeId) =>
      isActiveRunningNode(runningNodes[nodeId]),
    ),
  );
  if (activeNodeIds.size === 0 && activeRun) {
    for (const nodeRun of activeRun.node_runs || []) {
      const status = String(nodeRun.status || "")
        .trim()
        .toLowerCase();
      if (status === "running" || status === "waiting") {
        activeNodeIds.add(String(nodeRun.node_key || ""));
      }
    }
    if (activeNodeIds.size === 0 && activeRun.pending_node?.node_key) {
      activeNodeIds.add(activeRun.pending_node.node_key);
    }
  }
  const titles = [...activeNodeIds]
    .filter(Boolean)
    .map((nodeId) => nodesByID.get(nodeId)?.title || nodeId)
    .filter((title, index, values) => values.indexOf(title) === index);
  if (titles.length > 1) {
    return `${titles[0]} 等 ${titles.length} 个节点`;
  }
  return titles[0] || "";
}

function storyboardFrameExecutionStatus(
  run: CanvasRunRef | undefined,
  runtime: RunningNodeState | undefined,
  stopping: boolean,
) {
  if (stopping) {
    return "停止中";
  }
  const runStatus = String(run?.status || "")
    .trim()
    .toLowerCase();
  if (isActiveRunningNode(runtime) || (run && isActiveCanvasRun(run))) {
    return runtime?.status === "waiting" || runStatus === "waiting"
      ? "等待反馈"
      : "执行中";
  }
  if (runtime?.status === "error") {
    return "启动失败";
  }
  switch (runStatus) {
    case "success":
      return "已完成";
    case "fail":
    case "failed":
    case "error":
      return "执行失败";
    case "canceled":
    case "cancelled":
      return "已停止";
    default:
      return "";
  }
}

function storyboardFrameOverviewGroups({
  frame,
  nodeById,
  groupMembersById,
  runBlockedReasonByNodeId,
  runningNodes,
  frameRunning,
  activeRunByStartNodeId,
  stoppingCanvasRunKeys,
  hasResult,
  onRunGroup,
  onRunNode,
  onStopRun,
  onOpenNode,
  projectNode,
}: {
  frame: StoryboardFrameScope;
  nodeById: ReadonlyMap<string, SpaceCanvasNode>;
  groupMembersById: ReadonlyMap<string, SpaceCanvasNode[]>;
  runBlockedReasonByNodeId: ReadonlyMap<string, string>;
  runningNodes: RunningNodeMap;
  frameRunning: boolean;
  activeRunByStartNodeId: ReadonlyMap<string, WorkspaceCanvasRunRef>;
  stoppingCanvasRunKeys: ReadonlySet<string>;
  hasResult: (node: SpaceCanvasNode) => boolean;
  onRunGroup: (groupId: string) => void;
  onRunNode: (nodeId: string) => void;
  onStopRun: (nodeId: string) => void;
  onOpenNode: (nodeId: string) => void;
  projectNode: (node: SpaceCanvasNode) => WorkspaceNodeData;
}) {
  const groups = frame.memberNodeIds
    .map((nodeId) => nodeById.get(nodeId))
    .filter(
      (node): node is SpaceCanvasNode =>
        node?.type === "group" && node.group?.origin === "script",
    )
    .map((group) => {
      const members = groupMembersById.get(group.id) || EMPTY_CANVAS_NODES;
      return storyboardFrameOverviewGroup({
        executionNode: group,
        members,
        runBlockedReasonByNodeId,
        runningNodes,
        frameRunning,
        activeRunByStartNodeId,
        stoppingCanvasRunKeys,
        hasResult,
        onRun: () => onRunGroup(group.id),
        onStopRun,
        onOpenNode,
        projectNode,
      });
    });
  const composition = frame.workNodeIds
    .map((nodeId) => nodeById.get(nodeId))
    .find((node) => node?.storyboardItem?.itemType === "video_compose");
  if (composition) {
    groups.push(
      storyboardFrameOverviewGroup({
        executionNode: composition,
        members: [composition],
        runBlockedReasonByNodeId,
        runningNodes,
        frameRunning,
        activeRunByStartNodeId,
        stoppingCanvasRunKeys,
        hasResult,
        onRun: () => onRunNode(composition.id),
        onStopRun,
        onOpenNode,
        projectNode,
      }),
    );
  }
  return groups;
}

function storyboardFrameOverviewGroup({
  executionNode,
  members,
  runBlockedReasonByNodeId,
  runningNodes,
  frameRunning,
  activeRunByStartNodeId,
  stoppingCanvasRunKeys,
  hasResult,
  onRun,
  onStopRun,
  onOpenNode,
  projectNode,
}: {
  executionNode: SpaceCanvasNode;
  members: SpaceCanvasNode[];
  runBlockedReasonByNodeId: ReadonlyMap<string, string>;
  runningNodes: RunningNodeMap;
  frameRunning: boolean;
  activeRunByStartNodeId: ReadonlyMap<string, WorkspaceCanvasRunRef>;
  stoppingCanvasRunKeys: ReadonlySet<string>;
  hasResult: (node: SpaceCanvasNode) => boolean;
  onRun: () => void;
  onStopRun: (nodeId: string) => void;
  onOpenNode: (nodeId: string) => void;
  projectNode: (node: SpaceCanvasNode) => WorkspaceNodeData;
}): StoryboardWorkspaceGroupData {
  const runtime = summarizeCanvasGroupRuntime({
    members,
    runningNodes,
    groupState: runningNodes[executionNode.id],
    hasResult,
  });
  const activeRun = activeRunByStartNodeId.get(executionNode.id);
  const runStatus = String(activeRun?.status || "")
    .trim()
    .toLowerCase();
  const status =
    activeRun && runtime.status === "idle"
      ? runStatus === "waiting"
        ? "waiting"
        : "running"
      : runtime.status;
  const active = status === "running" || status === "waiting";
  const unavailable = runtime.runnableCount === 0;
  const runBlockedReason = active
    ? ""
    : frameRunning
      ? "制作区正在执行"
      : runBlockedReasonByNodeId.get(executionNode.id) ||
        (unavailable ? "当前分组未配置可用能力" : "");
  return {
    id: executionNode.id,
    title: executionNode.title || "未命名分组",
    memberCount: runtime.memberCount,
    runnableCount: runtime.runnableCount,
    completedCount: runtime.completedCount,
    failedCount: runtime.failedCount,
    staleCount: runtime.staleCount,
    status,
    runBlockedReason,
    stopping: Boolean(
      activeRun && stoppingCanvasRunKeys.has(canvasRunIdentity(activeRun)),
    ),
    results: members.map((node) =>
      storyboardFrameOverviewResult(
        node,
        runningNodes[node.id],
        hasResult(node),
        onOpenNode,
        projectNode,
      ),
    ),
    onRun: !active && !runBlockedReason ? onRun : undefined,
    onStop: activeRun ? () => onStopRun(executionNode.id) : undefined,
  };
}

function storyboardFrameOverviewResult(
  node: SpaceCanvasNode,
  runtime: RunningNodeState | undefined,
  hasResult: boolean,
  onOpenNode: (nodeId: string) => void,
  projectNode: (node: SpaceCanvasNode) => WorkspaceNodeData,
): StoryboardWorkspaceResultData {
  const status = storyboardFrameOverviewResultStatus(node, runtime, hasResult);
  return {
    nodeId: node.id,
    status,
    node: projectNode(node),
    onOpen: () => onOpenNode(node.id),
  };
}

function storyboardFrameOverviewResultStatus(
  node: SpaceCanvasNode,
  runtime: RunningNodeState | undefined,
  hasResult: boolean,
): StoryboardWorkspaceResultData["status"] {
  if (runtime?.status === "running") return "running";
  if (runtime?.status === "waiting") return "waiting";
  if (runtime?.status === "error") return "error";
  if (node.storyboardItem?.stale) return "stale";
  return hasResult ? "complete" : "pending";
}

function canvasRunStoryboardFrameNodeId(canvasRun: CanvasRunRef) {
  if (String(canvasRun.execution_scope || "").trim() !== "storyboard_frame") {
    return "";
  }
  const sourceNodeId = String(canvasRun.start_node_id || "").trim();
  return sourceNodeId ? storyboardFrameId(sourceNodeId) : "";
}

function canvasRunRecordMatchesCanvas(
  run: WorkspaceCanvasRunRef,
  canvas: SpaceCanvasState,
) {
  const runCanvasId = Number(run.canvas_id || 0);
  if (runCanvasId > 0) return runCanvasId === canvas.id;
  const runCateId = Number(run.asset_cate_id || 0);
  return runCateId === 0 || runCateId === canvas.assetCateId;
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
        isCanvasRunTerminalStatus(canvasRunNodeResultStatus(result)),
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

function canvasRunStatusIndex(runs: CanvasRunRef[]) {
  const statuses = new Map<string, string>();
  for (const run of runs) {
    const status = String(run.status || "").trim();
    if (!status) {
      continue;
    }
    for (const identity of canvasRunIdentities(run)) {
      statuses.set(identity, status);
    }
  }
  return statuses;
}

function canvasRunIndexedStatus(
  statuses: ReadonlyMap<string, string>,
  run: CanvasRunRef,
) {
  for (const identity of canvasRunIdentities(run)) {
    const status = statuses.get(identity);
    if (status) {
      return status;
    }
  }
  return "";
}

function canvasRunIdentities(run: CanvasRunRef) {
  const identities: string[] = [];
  if (Number(run.execution_id || 0) > 0) {
    identities.push(`execution:${Number(run.execution_id)}`);
  }
  if (Number(run.run_id || 0) > 0) {
    identities.push(`run:${Number(run.run_id)}`);
  }
  const requestId = String(run.request_id || "").trim();
  if (requestId) {
    identities.push(`request:${requestId}`);
  }
  return identities;
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
  const runCanvasId = Number(run.canvas_id || 0);
  if (runCanvasId > 0) {
    const canvas = canvases[String(runCanvasId)];
    return canvas ? canvasRunAlreadyAppliedToCanvas(run, canvas) : false;
  }
  const runCateId = Number(run.asset_cate_id || 0);
  const candidates = runCateId
    ? Object.values(canvases).filter(
        (canvas) => canvas.assetCateId === runCateId,
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
      if (!canvasNodeCoversRunResult(node, run, result)) {
        return false;
      }
    }
    return matchedNodeCount > 0;
  }
  const startNodeID = String(run.start_node_id || "");
  const node = nodesByID.get(startNodeID);
  const result = (run.node_results || []).find(
    (candidate) => candidate.node_key === startNodeID,
  );
  return canvasNodeCoversRunResult(node, run, result);
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
    if (isCanvasRunTerminalStatus(status)) {
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
  return Boolean(
    node.type === "function" &&
    canvasFunctionDefinition(node.function_key)?.runsInBackend,
  );
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
      valueAtUnknownPath(pending.result, "approval"),
      valueAtUnknownPath(pending.output, "approval"),
    );
    if (approval && !Array.isArray(source.approvals)) {
      source.approvals = [approval];
    }
    const snapshot = normalizeFlowRunSnapshot(source);
    return flowFeedbackFromSnapshot(snapshot);
  }
  return agentFeedbackFromResult(pending, node.title);
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
    if (!node || !isCanvasRunTerminalStatus(status)) {
      continue;
    }
    const resultKey = canvasNodeResultApplyKey(result);
    if (
      status === "success" &&
      resultKey &&
      appliedNodeResults?.has(resultKey) &&
      (!result.runTiming ||
        node.runTiming?.finishedAt === result.runTiming.finishedAt)
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
    Number(result.version_id || 0) <= 0 ||
    !isDefaultCanvasNodeTitle(node)
  ) {
    return false;
  }
  return (
    resolvePowerPresentation(node.power, node.kind, node.outputType)
      .viewMode !== "storyboard"
  );
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
    result.version_id || "",
    result.asset_id || "",
  ].join(":");
}

function buildBackendCanvasNodePatch(
  input: CanvasStartRunInput,
  node: SpaceCanvasNode,
  result: CanvasNodeResultRef,
) {
  const status = canvasRunNodeResultStatus(result);
  const runTiming =
    completedCanvasNodeRunTiming(result.runTiming) ||
    completedCanvasNodeResultTiming(input, result.node_key);
  const withRunTiming = (patch: Partial<SpaceCanvasNode>) =>
    runTiming ? { ...patch, runTiming } : patch;
  if (status === "fail") {
    return withRunTiming(
      mergeNodeFeedbackRecordsIntoPatch(node, {
        resultRef: buildNodeResultRef(result),
        runError: canvasNodeResultErrorMessage(result),
      }),
    );
  }
  if (status === "canceled") {
    return withRunTiming(
      mergeNodeFeedbackRecordsIntoPatch(node, { runError: "" }),
    );
  }
  const asset = runResultAsset({
    result,
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
    return withRunTiming(
      withFeedbackRecords({
        ...buildGeneratedNodeResultPatch(
          node,
          withRunResultAsset(result, asset),
          "后端执行结果",
        ),
        runError: "",
      }),
    );
  }
  return withRunTiming(
    withFeedbackRecords({
      ...buildGeneratedNodeResultPatch(node, result, "后端执行结果"),
      runError: "",
    }),
  );
}

function completedCanvasNodeRunTiming(
  runTiming?: CanvasNodeRunTiming,
): CanvasNodeRunTiming | undefined {
  if (
    !runTiming?.startedAt ||
    !runTiming.finishedAt ||
    runTiming.finishedAt < runTiming.startedAt
  ) {
    return undefined;
  }
  return runTiming;
}

function completedCanvasNodeResultTiming(
  input: CanvasStartRunInput,
  nodeId: string,
): CanvasNodeRunTiming | undefined {
  const runningNode = input.getRunningNode?.(nodeId);
  if (!runningNode?.startedAt) {
    return undefined;
  }
  return {
    startedAt: runningNode.startedAt,
    finishedAt: runningNode.finishedAt || Date.now(),
  };
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
  if (records.length === 0 || Array.isArray(patch.feedbackRequests)) {
    return patch;
  }
  return {
    ...patch,
    feedbackRequests: records,
  };
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
  canvasId: number;
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
    canvasId: input.canvasId,
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
    storyboardFramePlanVersion: undefined,
    composerDraft: node.composerDraft
      ? { ...node.composerDraft, paramBindings: undefined }
      : undefined,
    local: true,
  };
}

function buildCanvasRenderIndex(
  nodes: SpaceCanvasNode[],
  edges: SpaceCanvasEdge[],
): CanvasRenderIndex {
  const nodeLookup = buildCanvasNodeLookupIndex(nodes);
  const connectionIndex = buildCanvasConnectionIndex(nodes, edges, nodeLookup);
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
    buildCanvasConnectionIndex(
      nodes,
      edges,
      nodeLookup,
      nodeId,
    ).inputContextByNodeId.get(nodeId) || null
  );
}

function nodeInputContextSource(node: SpaceCanvasNode, hasResult: boolean) {
  if (!hasResult) {
    return null;
  }
  const output = nodeContextOutput(node);
  const kind = nodePreviewKind(node, output);
  const preview = generatedPreviewFromValue(output, kind);
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
    kind,
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
        source.kind === candidate.kind &&
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
): SpaceCanvasEdge[] {
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
    id: canvas.id,
    name: canvas.name,
    sort: canvas.sort,
    status: canvas.status,
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
  const scopedAssets = assets.filter(
    (asset) => Number(asset.canvas_id || 0) === canvas.id,
  );
  const byID = new Map(assets.map((asset) => [asset.id, asset]));
  const byNodeKey = new Map(
    scopedAssets
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

function referenceAssetDetailTarget(
  node: SpaceCanvasNode,
): ReferenceAssetDetailTarget | null {
  if (!isCanvasFunctionNode(node, "import")) {
    return null;
  }
  const assetID = canvasNodeReferencedAssetID(node);
  return assetID > 0 ? { nodeId: node.id, assetID } : null;
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

function decorateFlowEdge(edge: Edge, decoration: FlowEdgeDecoration): Edge {
  return {
    ...edge,
    data: {
      ...edge.data,
      isHighlighted: decoration.highlighted,
      isSelected: decoration.selected,
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
    if (!isCanvasFunctionNode(startNode, "start")) {
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

function pointerFromConnectEndEvent(
  event: MouseEvent | TouchEvent,
): CanvasPoint | null {
  const touch =
    "changedTouches" in event
      ? event.changedTouches[0] || event.touches[0]
      : undefined;
  if (touch) {
    return { x: touch.clientX, y: touch.clientY };
  }
  if (
    "clientX" in event &&
    typeof event.clientX === "number" &&
    typeof event.clientY === "number"
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

function renderFunctionIcon(key: string, filled: boolean) {
  const props = { size: 15, fill: filled ? "currentColor" : "none" };
  if (key === "start") return <Play {...props} />;
  if (key === "import") return <Link2 {...props} />;
  if (key === "display") return <Eye {...props} />;
  if (key === "save") return <Save {...props} />;
  return <AlertCircle {...props} />;
}

function isStartFunctionNode(node: SpaceCanvasNode) {
  return isCanvasFunctionNode(node, "start");
}

function isVisibleResultFunctionNode(node: SpaceCanvasNode) {
  return Boolean(
    node.type === "function" &&
    canvasFunctionDefinition(node.functionOption?.key)?.showsResult,
  );
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
  result: unknown,
  description: string,
): Partial<SpaceCanvasNode> {
  return {
    ...buildFunctionStatusPatch(description),
    resultRef: buildNodeResultRef({
      ...asUnknownRecord(result),
      asset: undefined,
      version: undefined,
      role: undefined,
    }),
  };
}

const MULTI_MEDIA_GRID_NODE_SIZE = { width: 620, height: 420 } as const;
const FUNCTION_RESULT_TOOLBAR_HEIGHT = 44;

function shouldUseCompactStoryboardImageGrid(
  node: Pick<SpaceCanvasNode, "groupId" | "storyboardItem">,
  preview: GeneratedNodePreview,
) {
  return Boolean(
    node.groupId &&
    node.storyboardItem &&
    preview.imageUrl &&
    canvasMediaGridKind(preview) === "image",
  );
}

function stableFlowNodeSize(
  size: { width: number; height: number },
  style?: CSSProperties,
) {
  // Controlled node replacements stay visible while ReactFlow remeasures them.
  return {
    initialWidth: size.width,
    initialHeight: size.height,
    style: {
      ...style,
      width: size.width,
      height: size.height,
    },
  };
}

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
  if (!hasDefaultCanvasNodeSize(node) || !canvasNodeCanRenderMediaGrid(node)) {
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
  if (shouldUseCompactStoryboardImageGrid(node, preview)) {
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
  return !["storyboard", "storyboard_grid", "video_compose"].includes(viewMode);
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
  const embedded = useContext(EmbeddedCanvasNodeContext);
  if (embedded) return null;
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
  if (node.embedded) return null;
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
  if (!nodeUsesComposerSettings(node) || !selected || !node.showNodeSettings) {
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
  const [resultViewDraft, setResultViewDraft] =
    useState<CanvasResultViewDraft | null>(null);
  const resultView = resolveCanvasResultViewDraft(
    normalizedResultView,
    resultViewDraft,
  );
  const [resizing, setResizing] = useState(false);
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
              setResultViewDraft((current) =>
                updateCanvasResultViewDraft(
                  normalizedResultView,
                  current,
                  resultView,
                ),
              );
              setResizing(true);
              node.onNodeResizeStart(node.id);
            }}
            onResize={(nextView) =>
              setResultViewDraft((current) =>
                updateCanvasResultViewDraft(
                  normalizedResultView,
                  current,
                  nextView,
                ),
              )
            }
            onResizeEnd={(nextView) => {
              setResizing(false);
              node.onResultViewResizeEnd(node.id, nextView);
              setResultViewDraft(null);
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
        openOnContentClick
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
  canvasId: number;
  assetCate: AssetCate | null;
  inputContext: NodeInputContext | null;
  onNodeResult: NodeResultSetter;
  onAssetCreated?: (asset: ProjectAsset) => void;
  onRunStartNode: NodeStartRunner;
  onOpenImportPicker: (nodeId: string) => void;
}) {
  const definition = canvasFunctionDefinition(input.node.functionOption?.key);
  if (!definition) {
    throw new Error(
      `不支持的画布功能：${input.node.functionOption?.key || input.node.title || "未配置"}`,
    );
  }
  const optionKey = definition.key;
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
      canvasId: input.canvasId,
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
  throw new Error(`不支持的画布功能：${optionKey}`);
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
  return Math.max(0.35, Math.min(1.45, Number.isFinite(zoom) ? zoom : 1));
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
  return isStartFunctionNode(node);
}

function nodeRunConfirmDescription(node: SpaceCanvasNode) {
  if (isStartFunctionNode(node)) {
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
  const targetNodeIds = canvasGroupRunTargetNodeIds({
    members,
    hasResult: nodeHasResultContent,
  });
  await runNode(sourceNode, { targetNodeIds });
}

function runCanvasGroupNodeAction({
  group,
  sourceNode,
  members,
  setRunningNode,
  runNode,
}: {
  group: SpaceCanvasNode;
  sourceNode: SpaceCanvasNode;
  members: SpaceCanvasNode[];
  setRunningNode: RunningNodeSetter;
  runNode: BackendNodeRunner;
}) {
  setRunningNode((current) => ({
    ...current,
    [group.id]: {
      nodeId: group.id,
      title: group.title,
      startedAt: Date.now(),
      progress: 8,
      status: "running",
    },
  }));
  void runCanvasGroupNodeTargets(group, sourceNode, members, runNode)
    .then(() => {
      setRunningNode((current) => omitRunningNode(current, group.id));
    })
    .catch((error) => {
      setRunningNode((current) => ({
        ...current,
        [group.id]: {
          ...(current[group.id] || {
            nodeId: group.id,
            title: group.title,
            startedAt: Date.now(),
            progress: 8,
          }),
          status: "error",
        },
      }));
      toast.error(error instanceof Error ? error.message : "分组运行失败");
      window.setTimeout(() => {
        setRunningNode((current) => omitRunningNode(current, group.id));
      }, 1400);
    });
}

function SpaceNodeView({
  data,
  selected,
}: Pick<NodeProps<Node<WorkspaceNodeData>>, "data" | "selected">) {
  const embedded = useContext(EmbeddedCanvasNodeContext);
  const node = data;
  const {
    sourceNode,
    projectId,
    runningNode,
    setRunningNode,
    onShowNodeDetail,
    onConfirmStoryboard,
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
      runGroup = () =>
        runCanvasGroupNodeAction({
          group: node,
          sourceNode,
          members,
          setRunningNode,
          runNode: onRunBackendNode,
        });
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
    const functionKey = node.functionOption?.key || "";
    const isStartFunction = isCanvasFunctionNode(node, "start");
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
            if (event.key !== "Enter" && event.key !== " ") {
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
              renderFunctionIcon(functionKey, isStartFunction)
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
        <NodeQuickDetailButton
          node={node}
          onShowNodeDetail={onShowNodeDetail}
        />
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
              <PlayableVideoPreview
                key={preview.videoUrl}
                src={preview.videoUrl}
                poster={preview.videoPosterUrl}
                className="ws-node-video-raw"
                ariaLabel={node.title || "视频资产"}
                objectFit="contain"
                allowDragFromVideo
                playButtonOnly
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
              <PlayableVideoPreview
                key={preview.videoUrl}
                src={preview.videoUrl}
                poster={preview.videoPosterUrl}
                ariaLabel={mediaPreviewCaption(preview) || node.title}
                objectFit="cover"
                allowDragFromVideo
                playButtonOnly
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
    const onMediaSize = node.embedded
      ? undefined
      : generatedMediaAutoSizeHandler(node, onNodeResult);
    const className = [
      "ws-node-power-wrap",
      selected ? "is-selected" : "",
      isPowerRunning ? "is-running" : "",
      node.runError && !isPowerRunning ? "is-error" : "",
      isStoryboardPower ? "is-storyboard" : "",
      isStoryboardGridPower ? "is-storyboard-grid" : "",
      isVideoComposePower ? "is-video-compose" : "",
      isAudioPower ? "is-audio" : "",
      node.embedded ? "is-embedded" : "",
      hasPowerContent ? "has-content" : "",
      hasPowerMedia ? "has-media" : "",
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <div className={className}>
        <div className="ws-node-floating-meta">
          <div className="ws-node-floating-label">
            <PowerIcon
              power={node.power}
              kind={node.kind}
              outputType={node.outputType}
              size={13}
              className="ws-icon-violet"
            />
            <EditableCanvasNodeTitle
              className="ws-node-floating-title"
              title={node.title}
              onRename={
                onNodeResult && !structureLocked
                  ? (title) =>
                      onNodeResult(node.id, { title, titleMode: "manual" })
                  : undefined
              }
            />
          </div>
          <CanvasNodeRunTimingView
            runTiming={node.runTiming}
            runningNode={runningNode}
            showEstimate={!embedded}
          />
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
                generatedShotCount={runningNode?.generatedCount || 0}
                targetShotCount={runningNode?.targetCount || 0}
                workspace={node.storyboardWorkspace}
                referenceItems={canvasReferenceItems.filter(
                  (item) => item.source !== "current" || item.id !== node.id,
                )}
                onOpenDetail={
                  storyboardHasResult && onShowNodeDetail
                    ? (sectionId, focus) =>
                        onShowNodeDetail(node, focus, sectionId)
                    : undefined
                }
                onConfirm={
                  node.interactive && storyboardHasResult
                    ? () => onConfirmStoryboard(node.id)
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
              videoObjectFit="cover"
              onMediaSize={onMediaSize}
              compactMediaGrid={shouldUseCompactStoryboardImageGrid(
                node,
                preview,
              )}
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

function workspaceNodePropsEqual(
  previous: Pick<NodeProps<Node<WorkspaceNodeData>>, "data" | "selected">,
  next: Pick<NodeProps<Node<WorkspaceNodeData>>, "data" | "selected">,
) {
  return (
    sameWorkspaceNodeData(previous.data, next.data) &&
    previous.selected === next.selected
  );
}

function sameWorkspaceNodeData(
  previous: WorkspaceNodeData,
  next: WorkspaceNodeData,
) {
  return (
    previous === next ||
    (previous.sourceNode === next.sourceNode &&
      previous.projectId === next.projectId &&
      previous.canvasId === next.canvasId &&
      previous.space === next.space &&
      previous.catalogCache === next.catalogCache &&
      previous.runningNode === next.runningNode &&
      sameCanvasNodes(previous.groupMembers, next.groupMembers) &&
      sameCanvasGroupRuntime(previous.groupRuntime, next.groupRuntime) &&
      previous.canvasHasRunningNode === next.canvasHasRunningNode &&
      previous.canvasReferenceItems === next.canvasReferenceItems &&
      previous.connectedMediaReferences === next.connectedMediaReferences &&
      previous.interactive === next.interactive &&
      previous.structureLocked === next.structureLocked &&
      previous.storyboardSourceNode === next.storyboardSourceNode &&
      previous.storyboardFrameRunning === next.storyboardFrameRunning &&
      sameStoryboardWorkspaceData(
        previous.storyboardWorkspace,
        next.storyboardWorkspace,
      ) &&
      previous.runBlockedReason === next.runBlockedReason &&
      previous.showNodeSettings === next.showNodeSettings &&
      sameNodeInputContext(previous.inputContext, next.inputContext))
  );
}

function sameStoryboardWorkspaceData(
  previous?: StoryboardWorkspaceData,
  next?: StoryboardWorkspaceData,
) {
  if (previous === next) return true;
  if (!previous || !next) return false;
  return (
    previous.frameId === next.frameId &&
    previous.sourceNodeId === next.sourceNodeId &&
    previous.groupCount === next.groupCount &&
    previous.workNodeCount === next.workNodeCount &&
    previous.completedCount === next.completedCount &&
    previous.running === next.running &&
    previous.stopping === next.stopping &&
    previous.executionStatus === next.executionStatus &&
    previous.currentNodeTitle === next.currentNodeTitle &&
    previous.runBlockedReason === next.runBlockedReason &&
    Boolean(previous.onStop) === Boolean(next.onStop) &&
    sameStoryboardWorkspaceGroups(previous.groups, next.groups)
  );
}

function sameStoryboardWorkspaceGroups(
  previous: StoryboardWorkspaceGroupData[],
  next: StoryboardWorkspaceGroupData[],
) {
  return (
    previous === next ||
    (previous.length === next.length &&
      previous.every((group, index) => {
        const candidate = next[index];
        return (
          group.id === candidate.id &&
          group.title === candidate.title &&
          group.memberCount === candidate.memberCount &&
          group.runnableCount === candidate.runnableCount &&
          group.completedCount === candidate.completedCount &&
          group.failedCount === candidate.failedCount &&
          group.staleCount === candidate.staleCount &&
          group.status === candidate.status &&
          group.runBlockedReason === candidate.runBlockedReason &&
          group.stopping === candidate.stopping &&
          Boolean(group.onRun) === Boolean(candidate.onRun) &&
          Boolean(group.onStop) === Boolean(candidate.onStop) &&
          sameStoryboardWorkspaceResults(group.results, candidate.results)
        );
      }))
  );
}

function sameStoryboardWorkspaceResults(
  previous: StoryboardWorkspaceResultData[],
  next: StoryboardWorkspaceResultData[],
) {
  return (
    previous === next ||
    (previous.length === next.length &&
      previous.every((result, index) => {
        const candidate = next[index];
        return (
          result.nodeId === candidate.nodeId &&
          result.status === candidate.status &&
          sameWorkspaceNodeData(result.node, candidate.node)
        );
      }))
  );
}

function sameDerivedFlowNode(previous: Node, next: Node) {
  if (
    previous === next ||
    (previous.id === next.id &&
      previous.type === next.type &&
      previous.position.x === next.position.x &&
      previous.position.y === next.position.y &&
      previous.selected === next.selected &&
      previous.className === next.className &&
      previous.draggable === next.draggable &&
      previous.deletable === next.deletable &&
      previous.selectable === next.selectable &&
      previous.connectable === next.connectable &&
      previous.focusable === next.focusable &&
      previous.zIndex === next.zIndex &&
      previous.dragHandle === next.dragHandle &&
      previous.initialWidth === next.initialWidth &&
      previous.initialHeight === next.initialHeight &&
      previous.style?.width === next.style?.width &&
      previous.style?.height === next.style?.height)
  ) {
    if (previous === next) {
      return true;
    }
    return sameWorkspaceNodeData(
      previous.data as WorkspaceNodeData,
      next.data as WorkspaceNodeData,
    );
  }
  return false;
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
  videoObjectFit = "contain",
  onMediaSize,
  showMediaCaption = true,
  compactMediaGrid = false,
}: {
  preview: GeneratedNodePreview;
  output: unknown;
  fallback: string;
  streaming?: boolean;
  generating?: boolean;
  videoObjectFit?: CSSProperties["objectFit"];
  onMediaSize?: (width: number, height: number) => void;
  showMediaCaption?: boolean;
  compactMediaGrid?: boolean;
}) {
  const textRef = useRef<HTMLDivElement>(null);
  const followStreamRef = useRef(true);
  const caption = showMediaCaption ? mediaPreviewCaption(preview) : "";
  const useContentView = contentOutputNeedsRenderer(output, preview);
  const mediaGridKind = canvasMediaGridKind(preview);
  const renderCompactMediaGrid = Boolean(
    compactMediaGrid && canvasMultiMediaGridOutput(output, mediaGridKind),
  );

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
        <PlayableVideoPreview
          key={preview.videoUrl}
          src={preview.videoUrl}
          poster={preview.videoPosterUrl}
          className="nopan nowheel"
          ariaLabel={caption || "生成视频"}
          objectFit={videoObjectFit}
          allowDragFromVideo
          playButtonOnly
          onMediaSize={onMediaSize}
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
      className={`ws-node-generated-text ws-node-scroll-content nowheel ${
        renderCompactMediaGrid ? "is-compact-media-grid" : ""
      }`}
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
        mediaGridKind={mediaGridKind}
        compactMediaGrid={renderCompactMediaGrid}
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

function miniMapFlowNodeColor(node: Node) {
  return miniMapNodeColor(node.data as SpaceCanvasNode);
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

function readCanvasId() {
  if (typeof window === "undefined") return 0;
  return Number(
    new URLSearchParams(window.location.search).get("canvas_id") || 0,
  );
}

function writeCanvasId(canvasId: number) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (canvasId > 0) url.searchParams.set("canvas_id", String(canvasId));
  else url.searchParams.delete("canvas_id");
  // Canvas selection is address-bar state, not a page navigation. TanStack
  // Router wraps the history instance method and would reload the Page here.
  window.History.prototype.replaceState.call(
    window.history,
    window.history.state,
    "",
    url,
  );
}

function readStoredAssistantOpen(projectId: number) {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return storedSpaceAssistantOpen(
      window.localStorage.getItem(
        `${SPACE_ASSISTANT_OPEN_STORAGE_KEY}:${projectId}`,
      ),
    );
  } catch {
    return false;
  }
}

function readStoredAssistantWidth() {
  if (typeof window === "undefined") {
    return SPACE_ASSISTANT_DEFAULT_WIDTH;
  }
  try {
    return clampSpaceAssistantWidth(
      Number(
        window.localStorage.getItem(SPACE_ASSISTANT_WIDTH_STORAGE_KEY) ||
          SPACE_ASSISTANT_DEFAULT_WIDTH,
      ),
    );
  } catch {
    return SPACE_ASSISTANT_DEFAULT_WIDTH;
  }
}

function writeSpaceAssistantStorage(key: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // The panel remains usable when storage is unavailable.
  }
}
