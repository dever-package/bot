import type { Dispatch, SetStateAction } from "react";
import type { ReferenceInput } from "../../show/agent-chat/reference";
import type { CanvasAgentRuntimeState } from "./space-agent-runtime";
import type { SpaceCatalogCache } from "./space-catalog-cache";
import type { CanvasGroupRuntimeSummary } from "./space-group-runtime";
import type {
  CanvasConnectedMediaReference,
  CanvasMediaUsageAssignments,
} from "./space-media-references";
import type { NodeFeedbackRecord } from "./space-feedback";
import type {
  CanvasNodeResizeHandler,
  CanvasResultViewChangeHandler,
} from "./space-resizer";
import type { StoryboardEditorFocus } from "./space-storyboard";
import type {
  CanvasComposerDraft,
  CanvasContentPreview,
  ComposerAssetItem,
  ProjectAsset,
  SpaceBootstrap,
  SpaceCanvasNode,
} from "./types";

export type RunningNodeState = {
  nodeId: string;
  title: string;
  startedAt: number;
  progress: number;
  status: "running" | "waiting" | "success" | "error";
  streamText?: string;
  streamOutput?: Record<string, unknown>;
  streamStarted?: boolean;
  generatedCount?: number;
  agent?: CanvasAgentRuntimeState;
};

export type RunningNodeMap = Record<string, RunningNodeState>;
export type RunningNodeSetter = Dispatch<SetStateAction<RunningNodeMap>>;

export function omitRunningNode(
  nodes: RunningNodeMap,
  nodeId: string,
): RunningNodeMap {
  if (!Object.prototype.hasOwnProperty.call(nodes, nodeId)) {
    return nodes;
  }
  const next = { ...nodes };
  delete next[nodeId];
  return next;
}

export function isActiveRunningNode(node?: RunningNodeState | null) {
  return node?.status === "running" || node?.status === "waiting";
}

export type NodeResultSetter = (
  nodeId: string,
  patch: Partial<SpaceCanvasNode>,
) => void;

export type NodeDraftSetter = (
  nodeId: string,
  draft: CanvasComposerDraft,
) => void;

export type NodeStartRunner = (node: SpaceCanvasNode) => Promise<void>;
export type StoryboardFrameRunner = (sourceNodeId: string) => Promise<void>;

export type BackendNodeRunOptions = {
  agentInput?: ReferenceInput;
};

export type BackendNodeRunner = (
  node: SpaceCanvasNode,
  options?: BackendNodeRunOptions,
) => Promise<void>;

export type CanvasRunnableNode = SpaceCanvasNode & {
  inputContext?: NodeInputContext | null;
};

export type FunctionNodeRunner = (
  node: CanvasRunnableNode,
) => Promise<boolean>;

export type ConfirmRequest = {
  title: string;
  description: string;
  confirmText?: string;
  tone?: "danger" | "primary";
  onConfirm: () => void | Promise<void>;
};

export type ConfirmRequester = (request: ConfirmRequest) => void;

export type GeneratedNodePreview = CanvasContentPreview;

export type NodeInputContext = {
  text: string;
  sources: Array<{
    nodeId: string;
    title: string;
    type: SpaceCanvasNode["type"];
    output: unknown;
    preview: GeneratedNodePreview;
    resultRef?: SpaceCanvasNode["resultRef"];
  }>;
};

type WorkspaceNodeActions = {
  setRunningNode: RunningNodeSetter;
  onNodeResult: NodeResultSetter;
  onNodeDraftChange: NodeDraftSetter;
  onAssetCreated: (asset: ProjectAsset) => void;
  onRunFunctionNode: FunctionNodeRunner;
  onOpenStoryboardGridImport: (nodeId: string, frameIndex?: number) => void;
  onClearFeedbackRecords: (nodeIds: string[]) => void;
  onOpenFeedbackRecord: (
    node: SpaceCanvasNode,
    record: NodeFeedbackRecord,
  ) => void;
  onShowNodeDetail: (
    node: SpaceCanvasNode,
    focus?: StoryboardEditorFocus,
  ) => void;
  requestConfirm: ConfirmRequester;
  onRunBackendNode: BackendNodeRunner;
  onConnectedMediaUsagesChange: (
    assignments: CanvasMediaUsageAssignments,
  ) => void;
  onConnectedMediaEdgeRemove: (edgeId: string) => void;
  onNodeResizeStart: (nodeId: string) => void;
  onNodeResizeEnd: CanvasNodeResizeHandler;
  onResultViewResizeEnd: CanvasResultViewChangeHandler;
};

export type WorkspaceNodeData = SpaceCanvasNode &
  WorkspaceNodeActions & {
    sourceNode: SpaceCanvasNode;
    projectId: number;
    space: SpaceBootstrap | null;
    catalogCache: SpaceCatalogCache;
    runningNode: RunningNodeState | null;
    groupMembers: SpaceCanvasNode[];
    groupRuntime: CanvasGroupRuntimeSummary | null;
    canvasHasRunningNode: boolean;
    canvasReferenceItems: ComposerAssetItem[];
    connectedMediaReferences: CanvasConnectedMediaReference[];
    interactive: boolean;
    structureLocked: boolean;
    storyboardSourceNode: SpaceCanvasNode | null;
    storyboardFrameRunning: boolean;
    runBlockedReason: string;
    showNodeSettings: boolean;
    inputContext: NodeInputContext | null;
  };
