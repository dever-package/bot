import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  CSSProperties,
  Dispatch,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  SetStateAction,
  WheelEvent as ReactWheelEvent,
} from "react";
import {
  Check,
  Eye,
  Loader2,
  Maximize2,
  Network,
  Plus,
  Save,
  SquarePen,
  Trash2,
  Workflow,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { toast } from "sonner";
import { request } from "@/lib/request";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { AssistantContextFormFillButton } from "@/components/assistant/form-actions";
import { AssistantTaskPopover } from "@/components/assistant/task-popover";
import {
  AgentInteractionPanel,
  type AgentInteraction,
  type AgentInteractionSubmitResult,
} from "@/components/agent/interaction-panel";
import { EnergonContentView } from "@/components/energon/content-view";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SearchableOptionPicker } from "@/components/searchable-option-picker";
import type {
  AssistantFieldContext,
  AssistantPageContext,
} from "@/lib/assistant/context";
import {
  assistantReferencePayload,
  type AssistantReferenceFile,
} from "@/lib/assistant/reference";
import {
  createRuntimeStreamTiming,
  formatStreamDuration,
  isStreamTimingRunning,
  streamTimingPercentFromOutput,
  StreamTimingBadge,
  useStreamClock,
  type StreamTiming,
} from "@/components/stream-timing";
import { watchRuntimeStream } from "@/lib/runtime-stream-runner";
import type { RuntimeStreamFrame } from "@/lib/stream";
import {
  agentResultPayloadTitle,
  extractAgentResultPayload,
  isAgentResultProtocolText,
  normalizeAgentResultOutputValue,
} from "@/lib/agent-result-protocol";
import type { NodeItemProps } from "@/page/nodes";

type FlowItem = {
  id?: number;
  key: string;
  name: string;
  goal?: string;
  config?: Record<string, any>;
  position?: Record<string, any>;
  status?: number;
  sort?: number;
};

type FlowEdge = {
  id?: number;
  from_key: string;
  to_key: string;
  condition?: string;
  status?: number;
  sort?: number;
};

type TeamNode = {
  id?: number;
  node_key: string;
  name: string;
  type: string;
  role_id?: number;
  role_key?: string;
  agent_id?: number;
  power_id?: number;
  sub_team_id?: number;
  config?: Record<string, any>;
  position?: Record<string, any>;
  status?: number;
  sort?: number;
};

type NodeEdge = {
  id?: number;
  from_key: string;
  to_key: string;
  condition?: string;
  status?: number;
  sort?: number;
};

type AgentOption = {
  id: number;
  cate_id?: number;
  name: string;
};

type RoleOption = {
  id: number;
  team_id?: number;
  role_type?: string;
  role_key?: string;
  name: string;
  agent_id?: number;
};

type TeamOption = {
  id: number;
  cate_id?: number;
  release_id?: number;
  name: string;
  flows?: FlowItem[];
  roles?: RoleOption[];
};

type RoleTypeOption = {
  id: string;
  value: string;
};

type PowerOption = {
  id: number;
  cate_id?: number;
  name: string;
  key: string;
  kind: string;
};

type PowerKindOption = {
  id: string;
  value: string;
};

type AgentCateOption = {
  id: number;
  value?: string;
  name?: string;
};

type WorkspaceData = {
  team?: Record<string, any>;
  flows?: FlowItem[];
  flow_edges?: FlowEdge[];
  nodes_by_flow?: Record<string, TeamNode[]>;
  edges_by_flow?: Record<string, NodeEdge[]>;
  roles?: RoleOption[];
  agents?: AgentOption[];
  agent_cates?: AgentCateOption[];
  teams?: TeamOption[];
  role_types?: RoleTypeOption[];
  powers?: PowerOption[];
  power_kinds?: PowerKindOption[];
  node_types?: Array<{ id: string; value: string }>;
  edge_conditions?: Array<{ id: string; value: string }>;
};

type Selection =
  | { kind: "flow"; key: string }
  | { kind: "flow_edge"; index: number }
  | { kind: "node"; key: string }
  | { kind: "node_edge"; index: number }
  | null;

type ConnectState = {
  kind: "flow" | "node";
  fromKey: string;
} | null;

type GraphExecutionNodeState = {
  status: string;
  run?: any;
};

type GraphExecutionState = {
  active: boolean;
  running: boolean;
  nodeRuns: any[];
  nodeRunsByKey: Record<string, GraphExecutionNodeState>;
  agentRunsByID: Record<string, any>;
  pendingApprovalsByNodeKey: Record<string, DebugPendingApproval>;
  activeEdgeKeys: Set<string>;
  completedEdgeKeys: Set<string>;
};

type ContextMenuState = {
  x: number;
  y: number;
  target: Exclude<Selection, null>;
} | null;

type CanvasPoint = {
  x: number;
  y: number;
};

type CanvasPanState = {
  x: number;
  y: number;
  scrollLeft: number;
  scrollTop: number;
} | null;

type ViewMode = "flow" | "node";
type DebugTarget = "team" | "flow";
type DebugPendingApproval = {
  id: string | number;
  title: string;
  nodeRunID?: string | number;
  nodeKey?: string;
  kind?: string;
  interaction: AgentInteraction;
};
type DebugApprovalSubmit = (
  approval: DebugPendingApproval,
  result: AgentInteractionSubmitResult,
) => void;
type DebugNodeTimingContext = {
  node?: TeamNode;
  nodeRuns?: any[];
};

const NODE_TYPES = [
  { id: "agent", value: "智能体" },
  { id: "role", value: "团队角色" },
  { id: "power", value: "能力" },
  { id: "team", value: "团队工作流" },
  { id: "context", value: "上下文" },
  { id: "condition", value: "条件" },
  { id: "merge", value: "合并" },
  { id: "human_approval", value: "人工确认" },
  { id: "save", value: "保存" },
];
const VISIBLE_NODE_TYPE_IDS = new Set(NODE_TYPES.map((item) => item.id));

const ROLE_TYPES: RoleTypeOption[] = [
  { id: "chat", value: "沟通" },
  { id: "planner", value: "规划" },
  { id: "worker", value: "执行" },
  { id: "reviewer", value: "审核" },
];

const EDGE_CONDITIONS = [
  { id: "always", value: "总是" },
  { id: "completed", value: "完成" },
  { id: "passed", value: "通过" },
  { id: "failed", value: "不通过" },
  { id: "approved", value: "确认" },
  { id: "rejected", value: "驳回" },
];

const CONDITION_OPERATORS = [
  { id: "exists", value: "有内容" },
  { id: "contains", value: "包含" },
  { id: "equals", value: "等于" },
  { id: "truthy", value: "为真" },
  { id: "falsy", value: "为假" },
];

const CARD_WIDTH = 192;
const CARD_HEIGHT = 116;
const GRAPH_ACTION_BUTTON_STYLE = {
  width: 28,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  lineHeight: 0,
} satisfies CSSProperties;
const GRAPH_ACTION_ICON_STYLE = {
  display: "block",
  flex: "0 0 auto",
} satisfies CSSProperties;
const GRAPH_ACTION_GROUP_STYLE = {
  right: 16,
  bottom: 16,
} satisfies CSSProperties;
const CANVAS_WIDTH = 2200;
const CANVAS_HEIGHT = 1400;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.8;
const ZOOM_STEP = 0.12;
const TEAM_PUBLISH_DRAFT = "draft";
const TEAM_PUBLISH_PUBLISHED = "published";
const TEAM_PUBLISH_EDITING = "editing";
const RUN_STATUS_RUNNING = "running";
const RUN_STATUS_WAITING = "waiting";
const RUN_STATUS_SUCCESS = "success";
const RUN_STATUS_FAIL = "fail";
const RUN_STATUS_CANCELED = "canceled";
const RUN_STATUS_PENDING = "pending";
const DEBUG_STREAM_BLOCK_MS = 15000;
const DEBUG_CLIENT_STARTED_AT = "_client_started_at";
const DEBUG_STREAM_LAST_ID = "_stream_last_id";
const THINK_ASSISTANT_FIELDS: AssistantFieldContext[] = [
  {
    path: "form.name",
    name: "名称",
    type: "form-input",
  },
  {
    path: "form.goal",
    name: "目标",
    type: "form-textarea",
  },
];

export function ShowTeamWorkspace({ item }: NodeItemProps) {
  const meta = item.meta ?? {};
  const teamID = useMemo(() => resolveTeamID(), []);
  const [workspace, setWorkspace] = useState<WorkspaceData>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<ViewMode>("flow");
  const [selectedFlowKey, setSelectedFlowKey] = useState("");
  const [selection, setSelection] = useState<Selection>(null);
  const [connect, setConnect] = useState<ConnectState>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Selection>(null);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [dragFlowKey, setDragFlowKey] = useState("");
  const [debugOpen, setDebugOpen] = useState(false);
  const [debugTarget, setDebugTarget] = useState<DebugTarget>("team");
  const [debugPrompt, setDebugPrompt] = useState("");
  const [debugRunning, setDebugRunning] = useState(false);
  const [debugResult, setDebugResult] = useState<any>(null);
  const [debugNodeResultKey, setDebugNodeResultKey] = useState("");
  const [hiddenDebugApprovalIds, setHiddenDebugApprovalIds] = useState<
    Set<string>
  >(() => new Set());

  const workspaceApi = String(meta.workspaceApi || "/bot/team/workspace_data");
  const saveFlowApi = String(meta.saveFlowApi || "/bot/team/save_flow_graph");
  const saveNodeApi = String(meta.saveNodeApi || "/bot/team/save_node_graph");
  const runTeamApi = String(meta.runTeamApi || "/bot/team/run_team");
  const runFlowApi = String(meta.runFlowApi || "/bot/team/run_flow");
  const streamApi = String(meta.streamApi || "/bot/team/stream");
  const approvalApi = String(meta.approvalApi || "/bot/team/submit_approval");
  const paramApi = String(meta.paramApi || "/bot/energon/power_params");

  const publishStatus = normalizeTeamPublishStatus(
    workspace.team?.publish_status,
  );
  const readonly = isTeamReadonly(workspace.team);
  const flows = workspace.flows ?? [];
  const flowEdges = workspace.flow_edges ?? [];
  const activeFlow = flows.find((flow) => flow.key === selectedFlowKey);
  const activeNodes = selectedFlowKey
    ? (workspace.nodes_by_flow?.[selectedFlowKey] ?? [])
    : [];
  const activeNodeEdges = selectedFlowKey
    ? (workspace.edges_by_flow?.[selectedFlowKey] ?? [])
    : [];
  const roles = workspace.roles ?? [];
  const agents = workspace.agents ?? [];
  const agentCates = workspace.agent_cates ?? [];
  const teams = workspace.teams ?? [];
  const roleTypes = workspace.role_types?.length
    ? workspace.role_types
    : ROLE_TYPES;
  const teamBindingOptions = useMemo(
    () =>
      buildTeamBindingOptions({
        currentTeamID: teamID,
        currentTeamName: String(workspace.team?.name || "当前团队"),
        flows,
        roles,
        teams,
      }),
    [flows, roles, teamID, teams, workspace.team?.name],
  );
  const powers = workspace.powers ?? [];
  const powerKinds = workspace.power_kinds ?? [];
  const nodeTypes = visibleNodeTypes(
    workspace.node_types?.length ? workspace.node_types : NODE_TYPES,
  );
  const edgeConditions = workspace.edge_conditions?.length
    ? workspace.edge_conditions
    : EDGE_CONDITIONS;
  const nodeDebugMode =
    view === "node" &&
    debugTarget === "flow" &&
    Boolean(debugRunning || debugResult);
  const editingLocked = readonly || nodeDebugMode;
  const pendingDebugApprovalsByNodeKey = useMemo(
    () =>
      buildPendingDebugApprovalsByNodeKey(
        debugResult,
        hiddenDebugApprovalIds,
      ),
    [debugResult, hiddenDebugApprovalIds],
  );
  const nodeExecutionState = useMemo(
    () =>
      nodeDebugMode
        ? buildGraphExecutionState(
            debugResult,
            activeNodes,
            activeNodeEdges,
            debugRunning,
            pendingDebugApprovalsByNodeKey,
          )
        : null,
    [
      activeNodeEdges,
      activeNodes,
      debugResult,
      debugRunning,
      nodeDebugMode,
      pendingDebugApprovalsByNodeKey,
    ],
  );

  const applyWorkspaceData = useCallback((data: any) => {
    const next = normalizeWorkspace(data);
    setWorkspace(next);
    setSelectedFlowKey((current) =>
      next.flows?.some((flow) => flow.key === current)
        ? current
        : next.flows?.[0]?.key || "",
    );
  }, []);

  const ensureEditable = useCallback(() => {
    if (!readonly) {
      return true;
    }
    toast.info("团队已发布，请先进入编辑草稿后再修改");
    return false;
  }, [readonly]);

  const loadWorkspace = useCallback(async () => {
    if (!teamID) {
      return;
    }
    setLoading(true);
    try {
      const result = await request(workspaceApi, "get", { team_id: teamID });
      if (result.code !== 0) {
        throw new Error(result.message || "加载团队失败");
      }
      applyWorkspaceData(result.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "加载团队失败");
    } finally {
      setLoading(false);
    }
  }, [applyWorkspaceData, teamID, workspaceApi]);

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  const saveFlowGraph = async () => {
    if (!teamID) {
      return false;
    }
    if (!ensureEditable()) {
      return false;
    }
    setSaving(true);
    try {
      const result = await request(saveFlowApi, "post", {
        team_id: teamID,
        flows,
        edges: flowEdges,
      });
      if (result.code !== 0) {
        throw new Error(result.message || "保存工作流图失败");
      }
      applyWorkspaceData(result.data);
      toast.success("工作流配置已保存");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存工作流图失败");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveNodeGraph = async () => {
    if (!ensureEditable()) {
      return false;
    }
    const flowSaved = await saveFlowGraph();
    if (!flowSaved) {
      return false;
    }
    if (!activeFlow?.id) {
      return true;
    }
    setSaving(true);
    try {
      const result = await request(saveNodeApi, "post", {
        flow_id: activeFlow.id,
        nodes: normalizeNodesForSave(activeNodes),
        edges: activeNodeEdges,
      });
      if (result.code !== 0) {
        throw new Error(result.message || "保存节点图失败");
      }
      applyWorkspaceData(result.data);
      toast.success("节点视图已保存");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存节点图失败");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const publishTeam = async () => {
    if (!teamID || saving) {
      return;
    }
    setSaving(true);
    try {
      const result = await request(saveFlowApi, "post", {
        team_id: teamID,
        action: "publish",
      });
      if (result.code !== 0) {
        throw new Error(result.message || "发布失败");
      }
      applyWorkspaceData(result.data);
      setView("flow");
      setSelection(null);
      setConnect(null);
      setEditorOpen(false);
      toast.success("团队已发布");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "发布失败");
    } finally {
      setSaving(false);
    }
  };

  const editDraft = async () => {
    if (!teamID || saving) {
      return;
    }
    setSaving(true);
    try {
      const result = await request(saveFlowApi, "post", {
        team_id: teamID,
        action: "edit_draft",
      });
      if (result.code !== 0) {
        throw new Error(result.message || "进入编辑草稿失败");
      }
      applyWorkspaceData(result.data);
      toast.success("已进入编辑草稿");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "进入编辑草稿失败");
    } finally {
      setSaving(false);
    }
  };

  const openDebugDialog = (target: DebugTarget) => {
    if (target === "flow" && !activeFlow?.id) {
      toast.error("请先选择一个已保存的工作流");
      return;
    }
    setDebugTarget(target);
    setDebugPrompt("");
    setDebugResult(null);
    setHiddenDebugApprovalIds(new Set());
    setDebugOpen(true);
  };

  const startDebugRun = async (
    target: DebugTarget,
    promptValue: string,
    references: AssistantReferenceFile[] = [],
    signal?: AbortSignal,
  ) => {
    const prompt = promptValue.trim();
    if (!prompt) {
      toast.error("请输入调试要求或目标");
      return;
    }
    if (target === "flow" && !activeFlow?.id) {
      toast.error("请先选择一个已保存的工作流");
      return;
    }
    const input = buildDebugInput(prompt, references);
    setDebugTarget(target);
    setDebugPrompt(prompt);
    setDebugOpen(false);
    setEditorOpen(false);
    setDeleteTarget(null);
    setConnect(null);
    setDebugNodeResultKey("");
    setHiddenDebugApprovalIds(new Set());
    setDebugRunning(true);
    setDebugResult(buildDebugPreparingStatus(input));
    try {
      if (!readonly) {
        const saved =
          target === "flow" ? await saveNodeGraph() : await saveFlowGraph();
        if (!saved) {
          setDebugResult(null);
          return;
        }
      }
      if (signal?.aborted) {
        return;
      }

      const payload: Record<string, any> = {
        team_id: teamID,
        release_id: 0,
        debug_current_graph: true,
        input,
      };
      if (target === "flow") {
        payload.flow_id = activeFlow?.id;
      }

      const result = await request(
        target === "team" ? runTeamApi : runFlowApi,
        "post",
        payload,
      );
      if (result.code !== 0) {
        throw new Error(result.message || "启动调试失败");
      }
      const startStatus = buildDebugStartStatus(result.data, payload.input);
      setDebugResult(startStatus);
      const status = await watchDebugStream(
        streamApi,
        startStatus,
        setDebugResult,
        signal,
      );
      if (signal?.aborted) {
        return;
      }
      setDebugResult(status);
    } catch (error) {
      const message = error instanceof Error ? error.message : "调试失败";
      setDebugResult({ error: message });
      toast.error(message);
    } finally {
      setDebugRunning(false);
    }
  };

  const runDebug = async () => {
    await startDebugRun(debugTarget, debugPrompt);
  };

  const submitDebugApproval = async (
    approval: DebugPendingApproval,
    result: AgentInteractionSubmitResult,
  ) => {
    if (!approval?.id) {
      return;
    }
    const approvalID = String(approval.id);
    const decision = String(result.data.decision || "approved");
    const comment = String(result.data.comment || result.text || "");
    const previousResult = debugResult;
    const optimisticStatus = markDebugApprovalSubmitted(
      previousResult,
      approval,
      result,
    );
    setHiddenDebugApprovalIds((current) => {
      const next = new Set(current);
      next.add(approvalID);
      return next;
    });
    setDebugResult(optimisticStatus);
    setDebugRunning(true);
    try {
      const response = await request(approvalApi, "post", {
        approval_id: approval.id,
        decision,
        comment,
        data: {
          ...result.data,
          params: result.data,
          text: result.text,
          interaction: approval.interaction,
        },
      });
      if (response.code !== 0) {
        throw new Error(response.message || "提交反馈失败");
      }
      const submittedStatus = markDebugRunResumed(
        optimisticStatus,
        response.data,
      );
      setDebugResult(submittedStatus);
      toast.success("已提交反馈，流程继续执行");
      const status = await watchDebugStream(
        streamApi,
        submittedStatus,
        setDebugResult,
      );
      setDebugResult(status);
    } catch (error) {
      setHiddenDebugApprovalIds((current) => {
        const next = new Set(current);
        next.delete(approvalID);
        return next;
      });
      setDebugResult(previousResult);
      toast.error(error instanceof Error ? error.message : "提交反馈失败");
    } finally {
      setDebugRunning(false);
    }
  };

  const clearFlowDebugExecution = () => {
    if (debugRunning) {
      toast.info("调试执行中，完成后再退出查看模式");
      return;
    }
    setDebugResult(null);
    setDebugNodeResultKey("");
    setHiddenDebugApprovalIds(new Set());
    setSelection(null);
  };

  const saveCurrentGraph = view === "flow" ? saveFlowGraph : saveNodeGraph;

  const openEditor = (target: Exclude<Selection, null>) => {
    if (!ensureEditable()) {
      return;
    }
    setSelection(target);
    setEditorOpen(true);
  };

  const openFlow = (flow: FlowItem) => {
    setSelectedFlowKey(flow.key);
    setSelection(null);
    setView("node");
  };

  const createFlow = () => {
    if (!ensureEditable()) {
      return;
    }
    const key = `flow_${Date.now()}`;
    setWorkspace((current) => ({
      ...current,
      flows: [
        ...(current.flows ?? []),
        createFlowItem(current.flows ?? [], key),
      ],
    }));
    setSelectedFlowKey(key);
    setView("flow");
    setSelection({ kind: "flow", key });
    setEditorOpen(true);
  };

  const requestDelete = (target: Exclude<Selection, null>) => {
    if (!ensureEditable()) {
      return;
    }
    setSelection(target);
    setDeleteTarget(target);
  };

  const confirmDelete = () => {
    if (!ensureEditable()) {
      return;
    }
    if (!deleteTarget) {
      return;
    }

    const deletingActiveFlow =
      deleteTarget.kind === "flow" && deleteTarget.key === selectedFlowKey;
    const nextFlow = deletingActiveFlow
      ? (workspace.flows ?? []).find((flow) => flow.key !== deleteTarget.key)
      : null;

    setWorkspace((current) =>
      removeGraphSelection(current, deleteTarget, selectedFlowKey),
    );
    if (deletingActiveFlow) {
      setSelectedFlowKey(nextFlow?.key ?? "");
      if (!nextFlow) {
        setView("flow");
      }
    }
    setSelection(null);
    setDeleteTarget(null);
    setEditorOpen(false);
    toast.success(
      deleteTarget.kind === "flow"
        ? "已删除，保存后生效"
        : "已从画布移除，保存后生效",
    );
  };

  if (!teamID) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        缺少 team_id，无法进入团队工作流配置。
      </div>
    );
  }

  return (
    <div
      className="grid overflow-hidden rounded-md border bg-background"
      style={{
        gridTemplateColumns: "16rem minmax(0, 1fr)",
        height: "min(76vh, 48rem)",
        minHeight: "34rem",
      }}
    >
      <aside className="flex min-h-0 min-w-0 flex-col border-r bg-muted/20">
        <div className="border-b p-4">
          <div className="text-xs text-muted-foreground">当前团队</div>
          <div className="mt-1 truncate text-base font-semibold">
            {workspace.team?.name || "团队"}
          </div>
          <div className="mt-2 inline-flex rounded bg-background px-2 py-0.5 text-xs text-muted-foreground">
            {teamPublishStatusLabel(publishStatus)}
          </div>
        </div>
        <div className="border-b p-2">
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm",
              view === "flow"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted",
            )}
            onClick={() => {
              setView("flow");
              setSelection(null);
              setConnect(null);
            }}
          >
            <Network className="size-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate">工作流视图</span>
          </button>
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-medium">工作流列表</span>
          <Button
            size="icon"
            variant="ghost"
            disabled={editingLocked}
            onClick={createFlow}
          >
            <Plus className="size-4" />
          </Button>
        </div>
        <div
          className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-2 pb-3 pr-1"
          style={{ scrollbarGutter: "stable" }}
        >
          {flows.map((flow) => (
            <div
              key={flow.key}
              draggable={!editingLocked}
              aria-grabbed={dragFlowKey === flow.key}
              className={cn(
                "mb-1 flex w-full select-none items-center gap-1 rounded-md",
                isActiveFlowListItem(view, selectedFlowKey, flow)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
                dragFlowKey === flow.key && "opacity-60",
                nodeDebugMode && "cursor-not-allowed opacity-60",
              )}
              onDragStart={(event) => {
                if (editingLocked) {
                  event.preventDefault();
                  return;
                }
                setDragFlowKey(flow.key);
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", flow.key);
              }}
              onDragOver={(event) => {
                if (!editingLocked && dragFlowKey && dragFlowKey !== flow.key) {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (editingLocked || !dragFlowKey || dragFlowKey === flow.key) {
                  return;
                }
                setWorkspace((current) =>
                  reorderFlows(current, dragFlowKey, flow.key),
                );
                setDragFlowKey("");
              }}
              onDragEnd={() => setDragFlowKey("")}
            >
              <button
                type="button"
                disabled={nodeDebugMode}
                className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left text-sm"
                onClick={() => openFlow(flow)}
              >
                <Workflow className="size-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">
                  {flow.name || flow.key}
                </span>
              </button>
              <button
                type="button"
                disabled={editingLocked}
                className={cn(
                  "mr-2 inline-flex size-6 items-center justify-center rounded hover:bg-background/70",
                  isActiveFlowListItem(view, selectedFlowKey, flow) &&
                    "hover:bg-primary-foreground/15",
                  editingLocked && "cursor-not-allowed opacity-60",
                )}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (!ensureEditable()) {
                    return;
                  }
                  setSelectedFlowKey(flow.key);
                  setSelection({ kind: "flow", key: flow.key });
                  setEditorOpen(true);
                }}
              >
                <SquarePen className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      <section
        className="grid min-h-0 min-w-0"
        style={{ gridTemplateRows: "auto minmax(0, 1fr) auto" }}
      >
        <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
          <Button
            size="sm"
            variant="outline"
            disabled={editingLocked}
            onClick={() => {
              if (view === "flow") {
                createFlow();
                return;
              }
              if (!activeFlow?.id) {
                toast.info("请先保存工作流，再新增节点");
                return;
              }
              addNode(selectedFlowKey, setWorkspace);
            }}
          >
            <Plus className="size-4" />
            {view === "flow" ? "新增工作流" : "新增节点"}
          </Button>
          {connect ? (
            <Button
              size="sm"
              variant="default"
              onClick={() => setConnect(null)}
            >
              <X className="size-4" />
              取消连线
            </Button>
          ) : null}
          <Button
            size="sm"
            variant="outline"
            disabled={saving || editingLocked}
            onClick={saveCurrentGraph}
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            保存
          </Button>
          {readonly ? (
            <Button
              size="sm"
              variant="outline"
              disabled={saving}
              onClick={() => void editDraft()}
            >
              <SquarePen className="size-4" />
              编辑草稿
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              disabled={saving || editingLocked}
              onClick={() => setPublishConfirmOpen(true)}
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              发布
            </Button>
          )}
          {view === "flow" ? (
            <Button
              size="sm"
              variant="outline"
              disabled={debugRunning}
              onClick={() => openDebugDialog("team")}
            >
              <Network className="size-4" />
              调试
            </Button>
          ) : null}
          {view === "node" && activeFlow ? (
            <AssistantTaskPopover
              title={nodeDebugMode ? "重新调试工作流" : "调试工作流"}
              description="输入本次调试目标，可添加参考资源；开始后会锁定画布并按节点顺序展示执行路径。"
              triggerLabel={nodeDebugMode ? "重新调试" : "调试工作流"}
              triggerVariant="outline"
              triggerSize="sm"
              submitLabel="开始调试"
              loadingText="启动调试"
              disabled={debugRunning || !activeFlow?.id}
              textareaPlaceholder="输入这次调试要完成的目标、输入材料或约束..."
              onSubmit={async ({
                instruction,
                references,
                signal,
                setStatus,
              }) => {
                if (!instruction.trim()) {
                  toast.error("请输入调试要求或目标");
                  return false;
                }
                setStatus("正在启动工作流调试");
                void startDebugRun("flow", instruction, references, signal);
                return true;
              }}
            />
          ) : null}
          {nodeDebugMode ? (
            <Button
              size="sm"
              variant="ghost"
              disabled={debugRunning}
              onClick={clearFlowDebugExecution}
            >
              退出调试
            </Button>
          ) : null}
          {loading ? (
            <span className="text-sm text-muted-foreground">加载中...</span>
          ) : null}
        </div>

        <Canvas
          view={view}
          flows={flows}
          flowEdges={flowEdges}
          nodes={activeNodes}
          nodeEdges={activeNodeEdges}
          edgeConditions={edgeConditions}
          selected={selection}
          connect={connect}
          readonly={editingLocked}
          nodeTypes={nodeTypes}
          executionState={nodeExecutionState}
          paramApi={paramApi}
          onSelect={setSelection}
          onConnect={setConnect}
          onOpenNodeResult={(nodeKey) => setDebugNodeResultKey(nodeKey)}
          onSubmitApproval={(approval, result) =>
            void submitDebugApproval(approval, result)
          }
          onEdit={openEditor}
          onDelete={requestDelete}
          onFlowConnect={(fromKey, toKey) =>
            !editingLocked
              ? setWorkspace((current) => addFlowEdge(current, fromKey, toKey))
              : undefined
          }
          onFlowConnectNew={(fromKey, position) => {
            if (!ensureEditable()) {
              return;
            }
            const key = `flow_${Date.now()}`;
            setWorkspace((current) =>
              addConnectedFlow(current, fromKey, key, position),
            );
            setSelection({ kind: "flow", key });
          }}
          onNodeConnect={(fromKey, toKey) =>
            !editingLocked
              ? setWorkspace((current) =>
                  addNodeEdge(current, selectedFlowKey, fromKey, toKey),
                )
              : undefined
          }
          onNodeConnectNew={(fromKey, position) => {
            if (!ensureEditable() || !selectedFlowKey) {
              return;
            }
            const key = `node_${Date.now()}`;
            setWorkspace((current) =>
              addConnectedNode(
                current,
                selectedFlowKey,
                fromKey,
                key,
                position,
              ),
            );
            setSelection({ kind: "node", key });
          }}
          onMove={(kind, key, position) =>
            !editingLocked
              ? setWorkspace((current) =>
                  kind === "flow"
                    ? updateFlow(current, key, { position })
                    : updateNode(current, selectedFlowKey, key, { position }),
                )
              : undefined
          }
          onChangeNodeEdge={(index, patch) =>
            !editingLocked
              ? setWorkspace((current) =>
                  updateNodeEdge(current, selectedFlowKey, index, patch),
                )
              : undefined
          }
        />
      </section>

      <EditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        selected={selection}
        flows={flows}
        nodes={activeNodes}
        agents={agents}
        agentCates={agentCates}
        currentTeamID={teamID}
        currentTeamName={String(workspace.team?.name || "当前团队")}
        roles={roles}
        roleTypes={roleTypes}
        teamBindingOptions={teamBindingOptions}
        powers={powers}
        powerKinds={powerKinds}
        nodeTypes={nodeTypes}
        readonly={editingLocked}
        onChangeFlow={(key, patch) =>
          !editingLocked
            ? setWorkspace((current) => updateFlow(current, key, patch))
            : undefined
        }
        onChangeNode={(key, patch) =>
          !editingLocked
            ? setWorkspace((current) =>
                updateNode(current, selectedFlowKey, key, patch),
              )
            : undefined
        }
      />

      <DebugNodeResultDialog
        open={Boolean(debugNodeResultKey)}
        nodeKey={debugNodeResultKey}
        nodes={activeNodes}
        result={debugResult}
        approval={
          debugNodeResultKey
            ? pendingDebugApprovalsByNodeKey[debugNodeResultKey]
            : undefined
        }
        paramApi={paramApi}
        onOpenChange={(open) => !open && setDebugNodeResultKey("")}
        onSubmitApproval={(approval, result) =>
          void submitDebugApproval(approval, result)
        }
      />

      <DebugDialog
        open={debugOpen}
        target={debugTarget}
        prompt={debugPrompt}
        running={debugRunning}
        result={debugResult}
        paramApi={paramApi}
        pendingApprovalsByNodeKey={pendingDebugApprovalsByNodeKey}
        onOpenChange={setDebugOpen}
        onPromptChange={setDebugPrompt}
        onRun={runDebug}
        onSubmitApproval={(approval, result) =>
          void submitDebugApproval(approval, result)
        }
      />

      <ConfirmDialog
        open={publishConfirmOpen}
        onOpenChange={setPublishConfirmOpen}
        title="发布"
        desc="确定要发布吗？系统会校验工作流编排并生成可运行版本。"
        confirmText="发布"
        disabled={saving}
        isLoading={saving}
        handleConfirm={() => {
          setPublishConfirmOpen(false);
          void publishTeam();
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={deleteDialogTitle(deleteTarget)}
        desc={deleteDialogDescription(deleteTarget)}
        confirmText="删除"
        destructive
        handleConfirm={confirmDelete}
      />
    </div>
  );
}

function Canvas({
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
  view: "flow" | "node";
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
  onMove: (
    kind: "flow" | "node",
    key: string,
    position: Record<string, any>,
  ) => void;
  onChangeNodeEdge: (index: number, patch: Partial<NodeEdge>) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
  const [connectPointer, setConnectPointer] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panning, setPanning] = useState<CanvasPanState>(null);
  const [dragging, setDragging] = useState<{
    kind: "flow" | "node";
    key: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const now = useStreamClock(Boolean(executionState?.active));
  const items = view === "flow" ? flows : nodes;
  const edges = view === "flow" ? flowEdges : nodeEdges;
  const positions = useMemo(() => {
    const result = new Map<string, { x: number; y: number }>();
    items.forEach((item: any, index) => {
      const key = view === "flow" ? item.key : item.node_key;
      const fallback = defaultGraphPosition(index);
      result.set(key, {
        x: Number(item.position?.x ?? fallback.x),
        y: Number(item.position?.y ?? fallback.y),
      });
    });
    return result;
  }, [items, view]);

  useEffect(() => {
    if (!dragging || readonly) {
      return;
    }
    const handleMove = (event: MouseEvent) => {
      const point = toCanvasPoint(canvasRef.current, event, zoom);
      onMove(dragging.kind, dragging.key, {
        x: Math.max(16, point.x - dragging.offsetX),
        y: Math.max(16, point.y - dragging.offsetY),
      });
    };
    const handleUp = () => setDragging(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragging, onMove, readonly, zoom]);

  useEffect(() => {
    if (!panning) {
      return;
    }
    const handleMove = (event: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      canvas.scrollLeft = panning.scrollLeft - (event.clientX - panning.x);
      canvas.scrollTop = panning.scrollTop - (event.clientY - panning.y);
    };
    const handleUp = () => setPanning(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [panning]);

  useEffect(() => {
    if (readonly) {
      setConnectPointer(null);
      return;
    }
    if (!connect) {
      setConnectPointer(null);
      return;
    }

    const updatePointer = (event: MouseEvent) => {
      setConnectPointer(toCanvasPoint(canvasRef.current, event, zoom));
    };
    const finishConnect = (event: MouseEvent) => {
      const point = toCanvasPoint(canvasRef.current, event, zoom);
      const targetKey = findCardAtPoint(positions, point);
      if (targetKey && targetKey !== connect.fromKey) {
        if (view === "flow") {
          onFlowConnect(connect.fromKey, targetKey);
        } else {
          onNodeConnect(connect.fromKey, targetKey);
        }
      } else if (
        !targetKey &&
        isMeaningfulConnectDrag(positions.get(connect.fromKey), point)
      ) {
        const position = clampGraphPosition({
          x: point.x,
          y: point.y - CARD_HEIGHT / 2,
        });
        if (view === "flow") {
          onFlowConnectNew(connect.fromKey, position);
        } else {
          onNodeConnectNew(connect.fromKey, position);
        }
      }
      onConnect(null);
      setConnectPointer(null);
    };

    window.addEventListener("mousemove", updatePointer);
    window.addEventListener("mouseup", finishConnect);
    return () => {
      window.removeEventListener("mousemove", updatePointer);
      window.removeEventListener("mouseup", finishConnect);
    };
  }, [
    connect,
    onConnect,
    onNodeConnect,
    onNodeConnectNew,
    onFlowConnect,
    onFlowConnectNew,
    positions,
    readonly,
    view,
    zoom,
  ]);

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

  const openContextMenu = (
    event: ReactMouseEvent,
    target: Exclude<Selection, null>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(target);
    if (readonly) {
      return;
    }
    setContextMenu({ x: event.clientX, y: event.clientY, target });
  };

  const handleCardClick = (
    event: ReactMouseEvent<HTMLDivElement>,
    key: string,
  ) => {
    if (isGraphCardControlTarget(event)) {
      return;
    }
    onSelect(view === "flow" ? { kind: "flow", key } : { kind: "node", key });
  };

  const zoomTo = useCallback(
    (nextZoom: number, anchor?: CanvasPoint) => {
      const canvas = canvasRef.current;
      const clampedZoom = clampZoom(nextZoom);
      if (!canvas || clampedZoom === zoom) {
        setZoom(clampedZoom);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const anchorClient = anchor ?? {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      const graphPoint = {
        x: (anchorClient.x - rect.left + canvas.scrollLeft) / zoom,
        y: (anchorClient.y - rect.top + canvas.scrollTop) / zoom,
      };

      setZoom(clampedZoom);
      window.requestAnimationFrame(() => {
        canvas.scrollLeft =
          graphPoint.x * clampedZoom - (anchorClient.x - rect.left);
        canvas.scrollTop =
          graphPoint.y * clampedZoom - (anchorClient.y - rect.top);
      });
    },
    [zoom],
  );

  const fitView = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || positions.size === 0) {
      zoomTo(1);
      return;
    }

    const bounds = getGraphBounds(positions);
    const padding = 160;
    const nextZoom = clampZoom(
      Math.min(
        canvas.clientWidth / (bounds.width + padding * 2),
        canvas.clientHeight / (bounds.height + padding * 2),
        1.2,
      ),
    );

    setZoom(nextZoom);
    window.requestAnimationFrame(() => {
      canvas.scrollLeft = Math.max(0, (bounds.x - padding) * nextZoom);
      canvas.scrollTop = Math.max(0, (bounds.y - padding) * nextZoom);
    });
  }, [positions, zoomTo]);

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && !event.metaKey) {
      return;
    }
    event.preventDefault();
    zoomTo(zoom + (event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP), {
      x: event.clientX,
      y: event.clientY,
    });
  };

  const startPan = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.button !== 0 || connect) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest('[data-graph-interactive="true"]')) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    event.preventDefault();
    setPanning({
      x: event.clientX,
      y: event.clientY,
      scrollLeft: canvas.scrollLeft,
      scrollTop: canvas.scrollTop,
    });
  };

  return (
    <div className="relative min-h-0 min-w-0 overflow-hidden bg-background">
      {executionState?.active ? (
        <style>{`
          @keyframes team-edge-flow {
            to { stroke-dashoffset: -36; }
          }
          @keyframes team-node-running {
            0%, 100% { box-shadow: 0 0 0 3px rgb(37 99 235 / 0.16), 0 8px 18px rgb(37 99 235 / 0.10); }
            50% { box-shadow: 0 0 0 6px rgb(37 99 235 / 0.08), 0 8px 22px rgb(37 99 235 / 0.16); }
          }
        `}</style>
      ) : null}
      <div
        ref={canvasRef}
        className={cn(
          "absolute inset-0 select-none overflow-auto",
          connect
            ? "cursor-crosshair"
            : panning
              ? "cursor-grabbing"
              : "cursor-grab",
        )}
        onClick={() => setContextMenu(null)}
        onMouseDown={startPan}
        onWheel={handleWheel}
      >
        <div
          className="relative"
          style={{
            width: CANVAS_WIDTH * zoom,
            height: CANVAS_HEIGHT * zoom,
          }}
        >
          <div
            className="absolute left-0 top-0"
            style={{
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              transform: `scale(${zoom})`,
              transformOrigin: "0 0",
            }}
          >
            <svg className="pointer-events-none absolute inset-0 size-full">
              {edges.map((edge: any, index) => {
                const fromKey = edge.from_key;
                const toKey = edge.to_key;
                const from = positions.get(fromKey);
                const to = positions.get(toKey);
                if (!from || !to) {
                  return null;
                }
                const selectedEdge =
                  selected?.kind ===
                    (view === "flow" ? "flow_edge" : "node_edge") &&
                  selected.index === index;
                const path = connectorPath(
                  connectorStartPoint(from),
                  connectorEndPoint(to),
                );
                const executionEdgeKey = graphExecutionEdgeKey(edge, index);
                const activeExecutionEdge =
                  executionState?.activeEdgeKeys.has(executionEdgeKey);
                const completedExecutionEdge =
                  executionState?.completedEdgeKeys.has(executionEdgeKey);
                const stroke = selectedEdge
                  ? "#2563eb"
                  : activeExecutionEdge
                    ? "#2563eb"
                    : completedExecutionEdge
                      ? "#10b981"
                      : "#cbd5e1";
                return (
                  <g key={`${fromKey}-${toKey}-${index}`}>
                    <path
                      d={path}
                      fill="none"
                      stroke={stroke}
                      strokeLinecap="round"
                      strokeDasharray={activeExecutionEdge ? "8 10" : undefined}
                      strokeWidth={selectedEdge || activeExecutionEdge ? 3 : 2}
                      markerEnd={
                        selectedEdge || activeExecutionEdge
                          ? "url(#team-arrow-selected)"
                          : completedExecutionEdge
                            ? "url(#team-arrow-success)"
                            : "url(#team-arrow)"
                      }
                      style={
                        activeExecutionEdge
                          ? {
                              animation: "team-edge-flow 0.9s linear infinite",
                              filter:
                                "drop-shadow(0 0 5px rgb(37 99 235 / 0.45))",
                            }
                          : undefined
                      }
                    />
                  </g>
                );
              })}
              {connect && connectPointer && positions.get(connect.fromKey) ? (
                <path
                  d={connectorPath(
                    connectorStartPoint(positions.get(connect.fromKey)!),
                    connectPointer,
                  )}
                  fill="none"
                  stroke="#2563eb"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  strokeWidth={2}
                />
              ) : null}
              <defs>
                <marker
                  id="team-arrow"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L0,6 L8,3 z" fill="#cbd5e1" />
                </marker>
                <marker
                  id="team-arrow-selected"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L0,6 L8,3 z" fill="#2563eb" />
                </marker>
                <marker
                  id="team-arrow-success"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
                </marker>
              </defs>
            </svg>
            {edges.map((edge: any, index) => {
              const from = positions.get(edge.from_key);
              const to = positions.get(edge.to_key);
              if (!from || !to) return null;
              const edgeSelection =
                view === "flow"
                  ? ({ kind: "flow_edge", index } as const)
                  : ({ kind: "node_edge", index } as const);
              const selectedEdge =
                selected?.kind === edgeSelection.kind &&
                selected.index === index;
              const isFlowEdge = view === "flow";
              const conditionOptions = isFlowEdge
                ? []
                : resolveNodeEdgeConditionOptions(edge, nodes, edgeConditions);
              const configurableEdge = conditionOptions.length > 0;
              const left = (from.x + to.x) / 2 + CARD_WIDTH / 2;
              const top = (from.y + to.y) / 2 + CARD_HEIGHT / 2;
              if (!configurableEdge) {
                return (
                  <button
                    key={`edge-button-${edge.from_key}-${edge.to_key}-${index}`}
                    type="button"
                    data-graph-interactive="true"
                    className={cn(
                      "absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-background text-xs text-foreground shadow-sm",
                      selectedEdge && !readonly
                        ? "size-6 border-destructive text-destructive hover:bg-destructive/10"
                        : selectedEdge
                          ? "size-5 border-blue-300 text-blue-600"
                          : "size-3 border-border",
                    )}
                    title={
                      selectedEdge && !readonly
                        ? "删除关系"
                        : "点击选中关系，Delete 删除"
                    }
                    style={{ left, top }}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (selectedEdge && !readonly) {
                        onDelete(edgeSelection);
                      } else {
                        onSelect(edgeSelection);
                      }
                    }}
                    onContextMenu={(event) =>
                      openContextMenu(event, edgeSelection)
                    }
                  >
                    {selectedEdge && !readonly ? (
                      <X className="size-3.5" />
                    ) : null}
                  </button>
                );
              }
              const fallbackCondition = conditionOptions[0]?.id ?? "";
              const condition = conditionOptions.some(
                (item) => item.id === edge.condition,
              )
                ? edge.condition || fallbackCondition
                : fallbackCondition;
              return (
                <div
                  key={`edge-button-${edge.from_key}-${edge.to_key}-${index}`}
                  data-graph-interactive="true"
                  className="absolute z-10 w-24 -translate-x-1/2 -translate-y-1/2"
                  style={{ left, top }}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(edgeSelection);
                  }}
                  onContextMenu={(event) =>
                    openContextMenu(event, edgeSelection)
                  }
                >
                  {selectedEdge && !readonly ? (
                    <button
                      type="button"
                      className="absolute -right-2 -top-2 z-20 flex size-5 items-center justify-center rounded-full border border-destructive bg-background text-destructive shadow-sm hover:bg-destructive/10"
                      title="删除关系"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(edgeSelection);
                      }}
                    >
                      <X className="size-3" />
                    </button>
                  ) : null}
                  <Select
                    value={condition}
                    disabled={readonly}
                    onValueChange={(value) =>
                      onChangeNodeEdge(index, { condition: value })
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
              );
            })}
            {items.map((item: any) => {
              const key = view === "flow" ? item.key : item.node_key;
              const position = positions.get(key) ?? { x: 80, y: 80 };
              const targetSelection =
                view === "flow"
                  ? ({ kind: "flow", key } as const)
                  : ({ kind: "node", key } as const);
              const isSelected =
                selected?.kind === (view === "flow" ? "flow" : "node") &&
                selected.key === key;
              const isConnecting =
                connect?.kind === view && connect.fromKey === key;
              const cardSelectionStyle = isSelected
                ? {
                    borderColor: "#94a3b8",
                    boxShadow:
                      "0 0 0 3px rgb(148 163 184 / 0.22), 0 4px 12px rgb(15 23 42 / 0.08)",
                  }
                : undefined;
              const executionNode = executionState?.nodeRunsByKey[key];
              const executionRun = executionNode?.run;
              const executionAgentTrace = executionRun?.agent_run_id
                ? executionState?.agentRunsByID[
                    String(executionRun.agent_run_id)
                  ]
                : undefined;
              const executionTiming =
                view === "node" &&
                executionRun &&
                shouldShowRuntimeTiming(
                  String(executionRun.node_type || item.type || ""),
                )
                  ? debugNodeTiming(executionRun, executionAgentTrace, {
                      node: item,
                      nodeRuns: executionState?.nodeRuns || [],
                    })
                  : undefined;
              const executionStatus = executionNode?.status || "";
              const executionCardStyle =
                graphExecutionCardStyle(executionStatus);
              const pendingApproval =
                view === "node"
                  ? executionState?.pendingApprovalsByNodeKey[key]
                  : undefined;
              return (
                <div
                  key={key}
                  data-graph-interactive="true"
                  className={cn(
                    "group absolute z-20 select-none rounded-md border bg-background p-3 shadow-sm",
                    readonly
                      ? "cursor-pointer"
                      : connect
                        ? "cursor-crosshair"
                        : "cursor-move",
                    isConnecting && "border-amber-400 ring-2 ring-amber-300/40",
                    executionStatus &&
                      "transition-[border-color,box-shadow,transform]",
                    executionStatus === RUN_STATUS_SUCCESS &&
                      "border-emerald-300",
                    executionStatus === RUN_STATUS_FAIL &&
                      "border-destructive/60",
                    isDebugActiveStatus(executionStatus) && "border-blue-400",
                    isSelected && "z-30",
                    executionTiming && "hover:z-40",
                    executionTiming &&
                      isStreamTimingRunning(executionTiming) &&
                      "z-40",
                    pendingApproval && "z-50",
                  )}
                  style={{
                    left: position.x,
                    top: position.y,
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                    ...cardSelectionStyle,
                    ...executionCardStyle,
                  }}
                  onClick={(event) => handleCardClick(event, key)}
                  onContextMenu={(event) =>
                    openContextMenu(event, targetSelection)
                  }
                  onMouseDown={(event) => {
                    if (event.button !== 0) {
                      return;
                    }
                    if (readonly) {
                      return;
                    }
                    event.stopPropagation();
                    const rect = event.currentTarget.getBoundingClientRect();
                    setDragging({
                      kind: view,
                      key,
                      offsetX: (event.clientX - rect.left) / zoom,
                      offsetY: (event.clientY - rect.top) / zoom,
                    });
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-semibold">
                      {item.name || key}
                    </div>
                    {executionStatus ? (
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-xs",
                          graphExecutionBadgeClass(executionStatus),
                        )}
                      >
                        {graphExecutionStatusLabel(
                          executionStatus,
                          String(executionRun?.node_type || item.type || ""),
                        )}
                      </span>
                    ) : view === "node" ? (
                      <span
                        className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground"
                        style={{ fontSize: 10 }}
                      >
                        {workspaceNodeTypeLabel(item.type, nodeTypes)}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {view === "flow"
                      ? item.goal || item.key
                      : nodeCardDescription(item)}
                  </div>
                  {executionTiming ? (
                    <GraphExecutionTimingPopover
                      timing={executionTiming}
                      now={now}
                      pinned={
                        isStreamTimingRunning(executionTiming) ||
                        isDebugActiveStatus(executionStatus)
                      }
                    />
                  ) : null}
                  {executionStatus && view === "node" && onOpenNodeResult ? (
                    <button
                      type="button"
                      data-stop-card-click="true"
                      className={cn(
                        "absolute inset-0 z-20 flex items-center justify-center rounded-md",
                        "bg-background/70 opacity-0 backdrop-blur-sm transition-opacity",
                        "group-hover:opacity-100",
                      )}
                      title="查看结果"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpenNodeResult(key);
                      }}
                      onMouseDown={(event) => event.stopPropagation()}
                    >
                      <span className="inline-flex size-9 items-center justify-center rounded-full border bg-background/95 text-foreground shadow-md ring-1 ring-border/70">
                        <Eye className="size-4" />
                      </span>
                    </button>
                  ) : null}
                  {pendingApproval && onSubmitApproval ? (
                    <DebugNodeApprovalPopover
                      approval={pendingApproval}
                      paramApi={paramApi}
                      onSubmit={onSubmitApproval}
                    />
                  ) : null}
                  {!readonly ? (
                    <div
                      className="pointer-events-none absolute z-30 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                      style={GRAPH_ACTION_GROUP_STYLE}
                    >
                      <button
                        type="button"
                        className="pointer-events-auto rounded-md border bg-background text-muted-foreground shadow-sm hover:text-foreground"
                        style={GRAPH_ACTION_BUTTON_STYLE}
                        title="编辑"
                        onClick={(event) => {
                          event.stopPropagation();
                          onEdit(targetSelection);
                        }}
                        onMouseDown={(event) => event.stopPropagation()}
                      >
                        <SquarePen
                          className="size-3.5"
                          style={GRAPH_ACTION_ICON_STYLE}
                        />
                      </button>
                      <button
                        type="button"
                        className="pointer-events-auto rounded-md border bg-background text-destructive shadow-sm hover:bg-destructive/10"
                        style={GRAPH_ACTION_BUTTON_STYLE}
                        title="删除"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDelete(targetSelection);
                        }}
                        onMouseDown={(event) => event.stopPropagation()}
                      >
                        <Trash2
                          className="size-3.5"
                          style={GRAPH_ACTION_ICON_STYLE}
                        />
                      </button>
                    </div>
                  ) : null}
                  {!readonly ? (
                    <button
                      type="button"
                      className={cn(
                        "absolute -right-2 top-1/2 z-30 size-4 -translate-y-1/2 rounded-full",
                        "cursor-crosshair border bg-background shadow-sm",
                        "hover:border-blue-400 hover:bg-blue-50",
                      )}
                      aria-label="拖拽连线"
                      title="拖拽连线"
                      onClick={(event) => event.stopPropagation()}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setConnectPointer(
                          toCanvasPoint(
                            canvasRef.current,
                            event.nativeEvent,
                            zoom,
                          ),
                        );
                        onConnect({ kind: view, fromKey: key });
                      }}
                    />
                  ) : null}
                  <span className="absolute -left-2 top-1/2 size-4 -translate-y-1/2 rounded-full border bg-background" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <CanvasZoomControls
        zoom={zoom}
        onZoomIn={() => zoomTo(zoom + ZOOM_STEP)}
        onZoomOut={() => zoomTo(zoom - ZOOM_STEP)}
        onFitView={fitView}
      />
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

function GraphExecutionTimingPopover({
  timing,
  now,
  pinned,
}: {
  timing: StreamTiming;
  now: number;
  pinned: boolean;
}) {
  return (
    <div
      data-stop-card-click="true"
      className={cn(
        "pointer-events-none absolute z-40 max-w-[18rem]",
        "transition-opacity duration-150",
        pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100",
      )}
      style={{
        left: 0,
        top: CARD_HEIGHT + 8,
      }}
    >
      <StreamTimingBadge timing={timing} now={now} className="max-w-full" />
    </div>
  );
}

function DebugNodeApprovalPopover({
  approval,
  paramApi,
  onSubmit,
}: {
  approval: DebugPendingApproval;
  paramApi: string;
  onSubmit: DebugApprovalSubmit;
}) {
  return (
    <>
      <button
        type="button"
        data-stop-card-click="true"
        className={cn(
          "absolute -right-3 top-9 z-40 rounded-full border border-amber-300",
          "bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 shadow-sm",
          "hover:bg-amber-100",
        )}
        title="需要补充信息"
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        反馈
      </button>
      <div
        data-assistant-layer="true"
        data-stop-card-click="true"
        className={cn(
          "absolute left-[calc(100%+0.75rem)] top-0 z-50 max-h-[min(28rem,calc(100vh-2rem))] w-80 max-w-[calc(100vw-2rem)]",
          "overflow-hidden rounded-md border bg-background shadow-lg",
          "[&_*]:max-w-full [&_label]:min-w-0 [&_span]:break-words",
        )}
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <AgentInteractionPanel
          interaction={approval.interaction}
          paramApi={paramApi}
          layout="inline"
          onSubmit={(result) => onSubmit(approval, result)}
        />
      </div>
    </>
  );
}

function CanvasZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitView,
}: {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
}) {
  return (
    <div
      data-graph-interactive="true"
      className="absolute right-3 top-3 z-40 flex items-center gap-1 rounded-md border bg-background/95 p-1 shadow-sm"
    >
      <Button
        size="icon"
        variant="ghost"
        className="size-8"
        title="缩小"
        onClick={onZoomOut}
      >
        <ZoomOut className="size-4" />
      </Button>
      <div className="min-w-12 text-center text-xs tabular-nums text-muted-foreground">
        {Math.round(zoom * 100)}%
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="size-8"
        title="放大"
        onClick={onZoomIn}
      >
        <ZoomIn className="size-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="size-8"
        title="适应视图"
        onClick={onFitView}
      >
        <Maximize2 className="size-4" />
      </Button>
    </div>
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

function toCanvasPoint(
  container: HTMLDivElement | null,
  event: MouseEvent,
  zoom = 1,
) {
  const rect = container?.getBoundingClientRect();
  if (!rect || !container) {
    return { x: 0, y: 0 };
  }
  return {
    x: (event.clientX - rect.left + container.scrollLeft) / zoom,
    y: (event.clientY - rect.top + container.scrollTop) / zoom,
  };
}

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(value.toFixed(2))));
}

function getGraphBounds(positions: Map<string, CanvasPoint>) {
  let minX = CANVAS_WIDTH;
  let minY = CANVAS_HEIGHT;
  let maxX = 0;
  let maxY = 0;

  positions.forEach((position) => {
    minX = Math.min(minX, position.x);
    minY = Math.min(minY, position.y);
    maxX = Math.max(maxX, position.x + CARD_WIDTH);
    maxY = Math.max(maxY, position.y + CARD_HEIGHT);
  });

  return {
    x: minX,
    y: minY,
    width: Math.max(CARD_WIDTH, maxX - minX),
    height: Math.max(CARD_HEIGHT, maxY - minY),
  };
}

function findCardAtPoint(
  positions: Map<string, { x: number; y: number }>,
  point: { x: number; y: number },
) {
  for (const [key, position] of positions.entries()) {
    const withinX = point.x >= position.x && point.x <= position.x + CARD_WIDTH;
    const withinY =
      point.y >= position.y && point.y <= position.y + CARD_HEIGHT;
    if (withinX && withinY) {
      return key;
    }
  }
  return "";
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

function nodeCardDescription(node: TeamNode) {
  if (node.type === "agent" || node.type === "role") {
    return String(node.config?.goal ?? "").trim() || node.name || node.node_key;
  }
  return node.node_key;
}

function connectorStartPoint(position: CanvasPoint) {
  return {
    x: position.x + CARD_WIDTH,
    y: position.y + CARD_HEIGHT / 2,
  };
}

function connectorEndPoint(position: CanvasPoint) {
  return {
    x: position.x,
    y: position.y + CARD_HEIGHT / 2,
  };
}

function connectorPath(start: CanvasPoint, end: CanvasPoint) {
  const direction = end.x >= start.x ? 1 : -1;
  const distance = Math.abs(end.x - start.x);
  const controlOffset = Math.max(80, Math.min(240, distance * 0.45));
  const controlStartX = start.x + controlOffset * direction;
  const controlEndX = end.x - controlOffset * direction;

  return [
    `M ${start.x} ${start.y}`,
    `C ${controlStartX} ${start.y}, ${controlEndX} ${end.y}, ${end.x} ${end.y}`,
  ].join(" ");
}

function isMeaningfulConnectDrag(
  source: { x: number; y: number } | undefined,
  point: CanvasPoint,
) {
  if (!source) {
    return false;
  }
  const start = connectorStartPoint(source);
  return Math.hypot(point.x - start.x, point.y - start.y) > 48;
}

function clampGraphPosition(point: CanvasPoint) {
  return {
    x: Math.max(16, Math.min(CANVAS_WIDTH - CARD_WIDTH - 16, point.x)),
    y: Math.max(16, Math.min(CANVAS_HEIGHT - CARD_HEIGHT - 16, point.y)),
  };
}

function EditorDialog({
  open,
  onOpenChange,
  selected,
  flows,
  nodes,
  currentTeamID,
  currentTeamName,
  roles,
  roleTypes,
  agents,
  agentCates,
  teamBindingOptions,
  powers,
  powerKinds,
  nodeTypes,
  readonly,
  onChangeFlow,
  onChangeNode,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: Selection;
  flows: FlowItem[];
  nodes: TeamNode[];
  currentTeamID: number;
  currentTeamName: string;
  roles: RoleOption[];
  roleTypes: RoleTypeOption[];
  agents: AgentOption[];
  agentCates: AgentCateOption[];
  teamBindingOptions: TeamOption[];
  powers: PowerOption[];
  powerKinds: PowerKindOption[];
  nodeTypes: Array<{ id: string; value: string }>;
  readonly: boolean;
  onChangeFlow: (key: string, patch: Partial<FlowItem>) => void;
  onChangeNode: (key: string, patch: Partial<TeamNode>) => void;
}) {
  if (!selected) {
    return null;
  }

  const title = resolveEditorTitle(selected);

  let content: ReactNode = null;
  let headerAction: ReactNode = null;
  if (selected.kind === "flow") {
    const flow = flows.find((item) => item.key === selected.key);
    if (flow) {
      const assistantContext = buildFlowAssistantContext(flow);
      headerAction = readonly ? null : (
        <AssistantContextFormFillButton
          context={assistantContext}
          className="mt-[-0.125rem]"
          variant="outline"
          size="sm"
          onApplyValues={(values) =>
            applyFlowAssistantValues(flow.key, values, onChangeFlow)
          }
        />
      );
      content = (
        <div className="space-y-1">
          <Field label="名称">
            <Input
              value={flow.name || ""}
              disabled={readonly}
              onChange={(event) =>
                onChangeFlow(flow.key, { name: event.target.value })
              }
            />
          </Field>
          <Field label="目标">
            <Textarea
              value={flow.goal || ""}
              disabled={readonly}
              onChange={(event) =>
                onChangeFlow(flow.key, { goal: event.target.value })
              }
            />
          </Field>
        </div>
      );
    }
  } else if (selected.kind === "node") {
    const node = nodes.find((item) => item.node_key === selected.key);
    content = node ? (
      <div className="space-y-1">
        <Field label="名称">
          <Input
            value={node.name || ""}
            disabled={readonly}
            onChange={(event) =>
              onChangeNode(node.node_key, { name: event.target.value })
            }
          />
        </Field>
        <Field label="类型">
          <OptionRadioGroup
            options={nodeTypes}
            value={node.type || "agent"}
            onValueChange={(value) =>
              onChangeNode(node.node_key, normalizeNodeTypePatch(node, value))
            }
            disabled={readonly}
          />
        </Field>
        {node.type === "role" ? (
          <RoleBindingFields
            node={node}
            roles={roles}
            roleTypes={roleTypes}
            currentTeamID={currentTeamID}
            currentTeamName={currentTeamName}
            teams={teamBindingOptions}
            readonly={readonly}
            onChangeNode={onChangeNode}
          />
        ) : null}
        {node.type === "agent" ? (
          <AgentBindingFields
            node={node}
            agents={agents}
            agentCates={agentCates}
            readonly={readonly}
            onChangeNode={onChangeNode}
          />
        ) : null}
        {node.type === "power" ? (
          <PowerBindingFields
            node={node}
            powers={powers}
            powerKinds={powerKinds}
            readonly={readonly}
            onChangeNode={onChangeNode}
          />
        ) : null}
        {node.type === "team" ? (
          <TeamBindingFields
            node={node}
            currentTeamID={currentTeamID}
            currentTeamName={currentTeamName}
            teams={teamBindingOptions}
            readonly={readonly}
            onChangeNode={onChangeNode}
          />
        ) : null}
        {node.type === "condition" ? (
          <ConditionFields
            node={node}
            readonly={readonly}
            onChangeNode={onChangeNode}
          />
        ) : null}
        {node.type === "agent" || node.type === "role" ? (
          <Field label="目标">
            <Textarea
              value={String(node.config?.goal ?? "")}
              disabled={readonly}
              placeholder="填写给智能体的详细任务目标；留空时使用名称作为目标"
              onChange={(event) =>
                onChangeNode(node.node_key, {
                  config: {
                    ...(node.config ?? {}),
                    goal: event.target.value,
                  },
                })
              }
            />
          </Field>
        ) : null}
      </div>
    ) : null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col gap-0 overflow-visible p-0 sm:max-w-2xl"
        style={{ maxHeight: "min(82vh, 48rem)" }}
      >
        <DialogHeader className="shrink-0 px-6 py-4 text-start">
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="min-w-0 pt-1">{title}</DialogTitle>
            <div className="flex shrink-0 items-start gap-2">
              {headerAction}
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="-mr-3 -mt-2 size-8 shrink-0 self-start"
                >
                  <span className="sr-only">关闭</span>
                  <X className="size-4" />
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto px-6 pb-6 pt-2">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OptionRadioGroup({
  options,
  value,
  disabled,
  onValueChange,
}: {
  options: Array<{ id: string; value: string }>;
  value: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className="grid gap-2 sm:grid-cols-2"
      disabled={disabled}
    >
      {options.map((option) => (
        <label
          key={option.id}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm",
            value === option.id && "border-primary bg-primary/5 text-primary",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          <RadioGroupItem value={option.id} disabled={disabled} />
          <span>{option.value}</span>
        </label>
      ))}
    </RadioGroup>
  );
}

function DebugDialog({
  open,
  target,
  prompt,
  running,
  result,
  paramApi,
  pendingApprovalsByNodeKey,
  onOpenChange,
  onPromptChange,
  onRun,
  onSubmitApproval,
}: {
  open: boolean;
  target: DebugTarget;
  prompt: string;
  running: boolean;
  result: any;
  paramApi: string;
  pendingApprovalsByNodeKey: Record<string, DebugPendingApproval>;
  onOpenChange: (open: boolean) => void;
  onPromptChange: (value: string) => void;
  onRun: () => void;
  onSubmitApproval: DebugApprovalSubmit;
}) {
  const title = target === "team" ? "调试" : "调试工作流";
  const status = String(result?.run?.status || result?.status || "");
  const runHint = status
    ? `当前状态：${runStatusLabel(status)}`
    : "调试会先自动保存，并使用当前保存内容运行";
  const emptyHint =
    "输入目标后会先自动保存当前编辑内容，并使用保存后的内容执行；每个节点的执行状态和输出会显示在这里。";
  const submitHint =
    target === "team"
      ? "会先保存当前团队工作流编排，再按保存后的内容逐个执行。"
      : "会先保存当前工作流节点流程，再按节点顺序执行。";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex flex-col overflow-hidden sm:max-w-4xl"
        style={{
          height: "min(82vh, 48rem)",
          maxHeight: "min(82vh, 48rem)",
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border bg-muted/20">
            <div className="flex items-center justify-between gap-3 border-b px-3 py-2">
              <div className="text-sm font-medium">运行展示</div>
              <div className="text-xs text-muted-foreground">{runHint}</div>
            </div>
            <div className="relative min-h-0 flex-1">
              {result ? (
                <div className="absolute inset-0 overflow-hidden">
                  <DebugRunDisplay
                    result={result}
                    paramApi={paramApi}
                    pendingApprovalsByNodeKey={pendingApprovalsByNodeKey}
                    onSubmitApproval={onSubmitApproval}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted-foreground">
                  <span className="max-w-3xl">{emptyHint}</span>
                </div>
              )}
            </div>
          </div>
          <div className="shrink-0 rounded-md border bg-background p-3 shadow-sm">
            <Textarea
              value={prompt}
              disabled={running}
              className="min-h-24 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
              placeholder="输入这次调试要完成的目标、输入材料或约束..."
              onChange={(event) => onPromptChange(event.target.value)}
            />
            <div className="mt-3 flex items-center justify-between gap-3 border-t pt-3">
              <div className="text-xs text-muted-foreground">{submitHint}</div>
              <Button disabled={running} onClick={onRun}>
                {running ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Workflow className="size-4" />
                )}
                {running ? "调试中" : "开始调试"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DebugRunDisplay({
  result,
  paramApi,
  pendingApprovalsByNodeKey,
  onSubmitApproval,
}: {
  result: any;
  paramApi: string;
  pendingApprovalsByNodeKey: Record<string, DebugPendingApproval>;
  onSubmitApproval: DebugApprovalSubmit;
}) {
  const run = result?.run || {};
  const nodeRuns = sortDebugRunRows(arrayValue(result?.node_runs));
  const agentByID = agentTraceByID(arrayValue(result?.agent_runs));
  const active =
    isDebugActiveStatus(run.status) ||
    nodeRuns.some((row) =>
      isDebugNodeTimingActive(row, agentByID[String(row.agent_run_id)]),
    );
  const now = useStreamClock(active);

  if (result?.error && !result?.run) {
    return (
      <div className="h-full overflow-auto p-4 text-sm text-destructive">
        {String(result.error)}
      </div>
    );
  }

  return (
    <div
      className="h-full space-y-3 overflow-auto p-4 text-sm"
      style={{ maxHeight: "calc(min(82vh, 48rem) - 14rem)" }}
    >
      {nodeRuns.length > 0 ? (
        <div className="space-y-3">
          {nodeRuns.map((row, index) => (
            <DebugNodeRunCard
              key={debugRowKey(row, index)}
              row={row}
              index={index}
              agentTrace={agentByID[String(row.agent_run_id)]}
              approval={pendingApprovalsByNodeKey[String(row?.node_key || "")]}
              paramApi={paramApi}
              now={now}
              onSubmitApproval={onSubmitApproval}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-full min-h-72 items-center justify-center text-center text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            <Loader2 className="size-3 animate-spin" />
            正在等待节点开始执行...
          </div>
        </div>
      )}
      {run.error ? (
        <div className="rounded-md bg-destructive/10 p-3 text-xs text-destructive">
          {run.error}
        </div>
      ) : null}
    </div>
  );
}

function DebugNodeRunCard({
  row,
  index,
  agentTrace,
  approval,
  paramApi,
  now,
  onSubmitApproval,
}: {
  row: any;
  index: number;
  agentTrace?: any;
  approval?: DebugPendingApproval;
  paramApi: string;
  now: number;
  onSubmitApproval: DebugApprovalSubmit;
}) {
  const title = row.node_name || row.node_key || `节点 ${index + 1}`;
  const nodeType = String(row.node_type || "");
  const output = debugNodeDisplayOutput(row, agentTrace);
  const timing = shouldShowRuntimeTiming(nodeType)
    ? debugNodeTiming(row, agentTrace)
    : undefined;
  const active = isDebugNodeTimingActive(row, agentTrace);
  const saveNotice = nodeType === "save" ? debugSaveNodeNotice(row.output) : "";
  const visibleError = debugVisibleNodeError(row);

  return (
    <article className="rounded-md border bg-background p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium">
            {index + 1}. {title}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {debugNodeTypeLabel(nodeType)} ·{" "}
            {formatRunTimeRange(row.started_at, row.finished_at)}
          </div>
        </div>
        {timing ? (
          <StreamTimingBadge timing={timing} now={now} className="max-w-full" />
        ) : (
          <DebugStatusBadge status={row.status} nodeType={nodeType} />
        )}
        {visibleError ? (
          <div className="basis-full rounded bg-destructive/10 p-2 text-xs text-destructive">
            {visibleError}
          </div>
        ) : null}
      </div>

      {saveNotice ? (
        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {saveNotice}
        </div>
      ) : null}

      {approval ? (
        <div className="mt-3 overflow-hidden rounded-md border border-amber-200 bg-amber-50/45">
          <AgentInteractionPanel
            interaction={approval.interaction}
            paramApi={paramApi}
            layout="inline"
            onSubmit={(result) => onSubmitApproval(approval, result)}
          />
        </div>
      ) : null}

      <div className="mt-3 rounded-md border bg-muted/15 p-3">
        {hasDebugDisplayOutput(output) ? (
          <EnergonContentView output={output} emptyText="暂无节点输出。" />
        ) : active ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            正在等待节点输出...
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">暂无节点输出。</div>
        )}
      </div>
    </article>
  );
}

function DebugStatusBadge({
  status,
  nodeType,
}: {
  status?: string;
  nodeType?: string;
}) {
  const current = String(status || RUN_STATUS_PENDING);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs",
        debugStatusClass(current),
      )}
    >
      {current === RUN_STATUS_RUNNING ? (
        <Loader2 className="size-3 animate-spin" />
      ) : null}
      {debugNodeStatusLabel(current, nodeType)}
    </span>
  );
}

function DebugNodeResultDialog({
  open,
  nodeKey,
  nodes,
  result,
  approval,
  paramApi,
  onOpenChange,
  onSubmitApproval,
}: {
  open: boolean;
  nodeKey: string;
  nodes: TeamNode[];
  result: any;
  approval?: DebugPendingApproval;
  paramApi: string;
  onOpenChange: (open: boolean) => void;
  onSubmitApproval: DebugApprovalSubmit;
}) {
  const node = nodes.find((item) => item.node_key === nodeKey);
  const resultNodeRuns = sortDebugRunRows(arrayValue(result?.node_runs));
  const row = resultNodeRuns.find(
    (item) => String(item?.node_key || "") === nodeKey,
  );
  const agentByID = agentTraceByID(arrayValue(result?.agent_runs));
  const agentTrace = row?.agent_run_id
    ? agentByID[String(row.agent_run_id)]
    : undefined;
  const nodeType = String(row?.node_type || node?.type || "");
  const output =
    row && !approval ? debugNodeDisplayOutput(row, agentTrace) : undefined;
  const saveNotice =
    nodeType === "save" && row ? debugSaveNodeNotice(row.output) : "";
  const timing =
    row && shouldShowRuntimeTiming(nodeType)
      ? debugNodeTiming(row, agentTrace, { node, nodeRuns: resultNodeRuns })
      : undefined;
  const active =
    isStreamTimingRunning(timing) ||
    Boolean(row && isDebugActiveStatus(row.status));
  const now = useStreamClock(active);
  const visibleError = debugVisibleNodeError(row);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-w-none flex-col gap-0 overflow-hidden p-0"
        style={{
          width: "min(56rem, calc(100vw - 2rem))",
          height: "min(82vh, 48rem)",
        }}
      >
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle className="min-w-0 truncate pr-7">
            {node?.name || row?.node_name || nodeKey || "节点结果"}
          </DialogTitle>
        </DialogHeader>
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-background px-6 py-4">
          {timing || row ? (
            <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border bg-muted/15 px-3 py-2">
              <span className="text-xs text-muted-foreground">执行状态</span>
              {timing ? (
                <StreamTimingBadge
                  timing={timing}
                  now={now}
                  className="max-w-full"
                />
              ) : (
                <DebugStatusBadge status={row?.status} nodeType={nodeType} />
              )}
            </div>
          ) : null}
          {visibleError ? (
            <div className="mb-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {visibleError}
            </div>
          ) : null}
          {saveNotice ? (
            <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {saveNotice}
            </div>
          ) : null}
          {approval ? (
            <div className="mb-3 overflow-hidden rounded-md border border-amber-200 bg-amber-50/45">
              <AgentInteractionPanel
                interaction={approval.interaction}
                paramApi={paramApi}
                layout="inline"
                onSubmit={(result) => onSubmitApproval(approval, result)}
              />
            </div>
          ) : null}
          {approval ? null : hasDebugDisplayOutput(output) ? (
            <EnergonContentView
              output={output}
              emptyText="暂无节点输出。"
              className="min-w-0"
            />
          ) : active ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              节点正在执行，等待输出...
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              这个节点还没有输出。
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RoleBindingFields({
  node,
  roles,
  roleTypes,
  currentTeamID,
  currentTeamName,
  teams,
  readonly,
  onChangeNode,
}: {
  node: TeamNode;
  roles: RoleOption[];
  roleTypes: RoleTypeOption[];
  currentTeamID: number;
  currentTeamName: string;
  teams: TeamOption[];
  readonly: boolean;
  onChangeNode: (key: string, patch: Partial<TeamNode>) => void;
}) {
  const selectedRoleID = Number(node.role_id || node.config?.role_id || 0);
  const roleTeams = teams.length
    ? teams
    : buildTeamBindingOptions({
        currentTeamID,
        currentTeamName,
        flows: [],
        roles,
        teams,
      });
  const selectedRole = findRoleInTeams(roleTeams, selectedRoleID);
  const selectedTeamID = Number(
    node.config?.role_team_id ||
      selectedRole?.team_id ||
      currentTeamID ||
      roleTeams[0]?.id ||
      0,
  );
  const selectedTeam = findTeamOption(roleTeams, selectedTeamID);
  const teamRoles = selectedTeam?.roles ?? [];
  const firstAvailableRoleType =
    teamRoles[0]?.role_type || roleTypes[0]?.id || "";
  const selectedRoleType = String(
    node.config?.role_type ||
      selectedRole?.role_type ||
      firstAvailableRoleType,
  );
  const filteredRoles = selectedRoleType
    ? teamRoles.filter((role) => role.role_type === selectedRoleType)
    : teamRoles;
  const roleValue = filteredRoles.some((role) => role.id === selectedRoleID)
    ? String(selectedRoleID)
    : undefined;

  return (
    <Field label="绑定角色">
      <div className="grid gap-2 sm:grid-cols-3">
        <SearchableOptionPicker
          value={selectedTeamID ? String(selectedTeamID) : undefined}
          options={roleTeams.map((team) => ({
            id: team.id,
            value: team.name || "未命名团队",
          }))}
          disabled={readonly}
          clearable={false}
          placeholder="选择团队"
          searchPlaceholder="输入团队筛选..."
          emptyText="未找到团队"
          onChange={(nextValue) => {
            const value = Array.isArray(nextValue)
              ? (nextValue[0] ?? "")
              : nextValue;
            const nextTeamID = Number(value || currentTeamID || 0);
            const nextTeam = findTeamOption(roleTeams, nextTeamID);
            const nextRoleType =
              nextTeam?.roles?.[0]?.role_type || selectedRoleType;
            onChangeNode(node.node_key, {
              role_id: 0,
              role_key: "",
              config: {
                ...(node.config ?? {}),
                role_team_id: nextTeamID,
                role_id: 0,
                role_key: "",
                role_type: nextRoleType,
              },
            });
          }}
        />
        <SearchableOptionPicker
          value={selectedRoleType || undefined}
          options={roleTypes}
          disabled={readonly}
          clearable={false}
          placeholder="选择角色类型"
          searchPlaceholder="输入角色类型筛选..."
          onChange={(nextValue) => {
            const value = Array.isArray(nextValue)
              ? (nextValue[0] ?? "")
              : nextValue;
            onChangeNode(node.node_key, {
              role_id: 0,
              role_key: "",
              config: {
                ...(node.config ?? {}),
                role_team_id: selectedTeamID,
                role_id: 0,
                role_key: "",
                role_type: value,
              },
            });
          }}
        />
        <SearchableOptionPicker
          value={roleValue}
          options={filteredRoles.map((role) => ({
            id: role.id,
            value: role.name || role.role_key || "未命名角色",
          }))}
          disabled={readonly}
          placeholder="选择角色"
          searchPlaceholder="输入角色筛选..."
          emptyText="未找到团队角色"
          onClear={() =>
            onChangeNode(node.node_key, {
              role_id: 0,
              role_key: "",
              config: {
                ...(node.config ?? {}),
                role_team_id: selectedTeamID,
                role_id: 0,
                role_key: "",
                role_type: selectedRoleType,
              },
            })
          }
          onChange={(nextValue) => {
            const value = Array.isArray(nextValue)
              ? (nextValue[0] ?? "")
              : nextValue;
            const nextRole = filteredRoles.find(
              (role) => String(role.id) === String(value),
            );
            onChangeNode(node.node_key, {
              role_id: nextRole?.id || 0,
              role_key: nextRole?.role_key || "",
              config: {
                ...(node.config ?? {}),
                role_team_id: selectedTeamID,
                role_id: nextRole?.id || 0,
                role_key: nextRole?.role_key || "",
                role_type: nextRole?.role_type || selectedRoleType,
              },
            });
          }}
        />
      </div>
    </Field>
  );
}

function AgentBindingFields({
  node,
  agents,
  agentCates,
  readonly,
  onChangeNode,
}: {
  node: TeamNode;
  agents: AgentOption[];
  agentCates: AgentCateOption[];
  readonly: boolean;
  onChangeNode: (key: string, patch: Partial<TeamNode>) => void;
}) {
  return (
    <Field label="绑定智能体">
      <AgentSelector
        agentID={node.agent_id}
        cateID={Number(node.config?.agent_cate_id || 0)}
        agents={agents}
        agentCates={agentCates}
        disabled={readonly}
        onChange={({ agentID, cateID }) =>
          onChangeNode(node.node_key, {
            agent_id: agentID,
            config: {
              ...(node.config ?? {}),
              agent_cate_id: cateID,
            },
          })
        }
      />
    </Field>
  );
}

function PowerBindingFields({
  node,
  powers,
  powerKinds,
  readonly,
  onChangeNode,
}: {
  node: TeamNode;
  powers: PowerOption[];
  powerKinds: PowerKindOption[];
  readonly: boolean;
  onChangeNode: (key: string, patch: Partial<TeamNode>) => void;
}) {
  const selectedPowerID = Number(node.power_id || node.config?.power_id || 0);
  const selectedPower = powers.find((power) => power.id === selectedPowerID);
  const kinds = powerKinds.length ? powerKinds : derivePowerKindOptions(powers);
  const selectedKind = String(
    node.config?.power_kind ||
      selectedPower?.kind ||
      kinds[0]?.id ||
      powers[0]?.kind ||
      "",
  );
  const filteredPowers = selectedKind
    ? powers.filter((power) => power.kind === selectedKind)
    : powers;

  return (
    <Field label="绑定能力">
      <div className="grid gap-2 sm:grid-cols-2">
        <SearchableOptionPicker
          value={selectedKind || undefined}
          options={kinds.map((kind) => ({ id: kind.id, value: kind.value }))}
          disabled={readonly}
          clearable={false}
          placeholder="选择能力类型"
          searchPlaceholder="输入能力类型筛选..."
          onChange={(nextValue) => {
            const value = Array.isArray(nextValue)
              ? (nextValue[0] ?? "")
              : nextValue;
            const nextPower = powers.find((power) => power.kind === value);
            onChangeNode(node.node_key, {
              power_id: nextPower?.id || 0,
              config: {
                ...(node.config ?? {}),
                power_kind: value,
                power_id: nextPower?.id || 0,
                power_key: nextPower?.key || "",
              },
            });
          }}
        />
        <SearchableOptionPicker
          value={selectedPowerID ? String(selectedPowerID) : undefined}
          options={filteredPowers.map((power) => ({
            id: power.id,
            value: power.name || "未命名能力",
          }))}
          disabled={readonly}
          placeholder="选择能力"
          searchPlaceholder="输入能力筛选..."
          emptyText="未找到匹配能力"
          onClear={() =>
            onChangeNode(node.node_key, {
              power_id: 0,
              config: {
                ...(node.config ?? {}),
                power_id: 0,
                power_key: "",
              },
            })
          }
          onChange={(nextValue) => {
            const value = Array.isArray(nextValue)
              ? (nextValue[0] ?? "")
              : nextValue;
            const nextPower = powers.find(
              (power) => String(power.id) === String(value),
            );
            onChangeNode(node.node_key, {
              power_id: nextPower?.id || 0,
              config: {
                ...(node.config ?? {}),
                power_kind: nextPower?.kind || selectedKind,
                power_id: nextPower?.id || 0,
                power_key: nextPower?.key || "",
              },
            });
          }}
        />
      </div>
    </Field>
  );
}

function TeamBindingFields({
  node,
  currentTeamID,
  currentTeamName,
  teams,
  readonly,
  onChangeNode,
}: {
  node: TeamNode;
  currentTeamID: number;
  currentTeamName: string;
  teams: TeamOption[];
  readonly: boolean;
  onChangeNode: (key: string, patch: Partial<TeamNode>) => void;
}) {
  const selectedTeamID = Number(
    node.sub_team_id ||
      node.config?.sub_team_id ||
      currentTeamID ||
      teams[0]?.id ||
      0,
  );
  const workflowTeams = teams.length
    ? teams
    : buildTeamBindingOptions({
        currentTeamID,
        currentTeamName,
        flows: [],
        roles: [],
        teams,
      });
  const selectedTeam = findTeamOption(workflowTeams, selectedTeamID);
  const teamFlows = (selectedTeam?.flows ?? []).filter((flow) =>
    Boolean(flow.id),
  );
  const selectedFlowID = Number(
    node.config?.sub_flow_id || node.config?.flow_id || 0,
  );

  return (
    <Field label="工作流">
      <div className="grid gap-2 sm:grid-cols-2">
        <SearchableOptionPicker
          value={selectedTeamID ? String(selectedTeamID) : undefined}
          options={workflowTeams.map((team) => ({
            id: team.id,
            value: team.name || "未命名团队",
          }))}
          disabled={readonly}
          clearable={false}
          placeholder="选择团队"
          searchPlaceholder="输入团队筛选..."
          emptyText="未找到团队"
          onChange={(nextValue) => {
            const value = Array.isArray(nextValue)
              ? (nextValue[0] ?? "")
              : nextValue;
            const nextTeam = findTeamOption(workflowTeams, Number(value));
            const nextTeamID = nextTeam?.id || currentTeamID || 0;
            onChangeNode(node.node_key, {
              sub_team_id: nextTeamID,
              config: {
                ...(node.config ?? {}),
                sub_team_id: nextTeamID,
                release_id: nextTeam?.release_id || 0,
                sub_flow_id: 0,
                sub_flow_key: "",
              },
            });
          }}
        />
        <SearchableOptionPicker
          value={selectedFlowID ? String(selectedFlowID) : undefined}
          options={teamFlows.map((flow) => ({
            id: flow.id || 0,
            value: flow.name || flow.key || "未命名工作流",
          }))}
          disabled={readonly}
          placeholder="团队总工作流"
          searchPlaceholder="输入工作流筛选..."
          emptyText="未找到工作流"
          onClear={() =>
            onChangeNode(node.node_key, {
              config: {
                ...(node.config ?? {}),
                sub_team_id: selectedTeamID,
                release_id: selectedTeam?.release_id || 0,
                sub_flow_id: 0,
                sub_flow_key: "",
              },
            })
          }
          onChange={(nextValue) => {
            const value = Array.isArray(nextValue)
              ? (nextValue[0] ?? "")
              : nextValue;
            const nextFlow = teamFlows.find(
              (flow) => String(flow.id || "") === String(value),
            );
            onChangeNode(node.node_key, {
              sub_team_id: selectedTeamID,
              config: {
                ...(node.config ?? {}),
                sub_team_id: selectedTeamID,
                release_id: selectedTeam?.release_id || 0,
                sub_flow_id: nextFlow?.id || 0,
                sub_flow_key: nextFlow?.key || "",
              },
            });
          }}
        />
      </div>
    </Field>
  );
}

function ConditionFields({
  node,
  readonly,
  onChangeNode,
}: {
  node: TeamNode;
  readonly: boolean;
  onChangeNode: (key: string, patch: Partial<TeamNode>) => void;
}) {
  const operator = normalizeConditionOperator(node.config?.operator);
  const needsValue = operator === "contains" || operator === "equals";
  const updateConfig = (patch: Record<string, any>) =>
    onChangeNode(node.node_key, {
      config: {
        ...(node.config ?? {}),
        ...patch,
      },
    });

  return (
    <>
      <Field label="判断方式">
        <OptionRadioGroup
          options={CONDITION_OPERATORS}
          value={operator}
          disabled={readonly}
          onValueChange={(value) => updateConfig({ operator: value })}
        />
      </Field>
      {needsValue ? (
        <Field label="判断值">
          <Input
            value={String(node.config?.value ?? "")}
            disabled={readonly}
            placeholder={
              operator === "contains"
                ? "输入要包含的内容"
                : "输入要完全等于的内容"
            }
            onChange={(event) => updateConfig({ value: event.target.value })}
          />
        </Field>
      ) : null}
    </>
  );
}

function AgentSelector({
  agentID,
  cateID,
  agents,
  agentCates,
  disabled = false,
  onChange,
}: {
  agentID?: number;
  cateID?: number;
  agents: AgentOption[];
  agentCates: AgentCateOption[];
  disabled?: boolean;
  onChange: (value: { agentID: number; cateID: number }) => void;
}) {
  const selectedAgent = agents.find((agent) => agent.id === agentID);
  const visibleAgentCates = agentCates.length
    ? agentCates
    : deriveAgentCateOptions(agents);
  const selectedCateID = String(
    selectedAgent?.cate_id || cateID || visibleAgentCates[0]?.id || "",
  );
  const filteredAgents = selectedCateID
    ? agents.filter((agent) => String(agent.cate_id || "") === selectedCateID)
    : agents;

  return (
    <div className="grid grid-cols-2 gap-2">
      <SearchableOptionPicker
        value={selectedCateID || undefined}
        options={visibleAgentCates.map((cate) => ({
          id: cate.id,
          value: agentCateLabel(cate),
        }))}
        disabled={disabled}
        clearable={false}
        placeholder="选择分类"
        searchPlaceholder="输入分类筛选..."
        emptyText="未找到智能体分类"
        onChange={(nextValue) => {
          const value = Array.isArray(nextValue)
            ? (nextValue[0] ?? "")
            : nextValue;
          const currentAgent = agents.find((agent) => agent.id === agentID);
          const keepAgent =
            currentAgent &&
            String(currentAgent.cate_id || "") === String(value);
          onChange({
            agentID: keepAgent ? Number(agentID || 0) : 0,
            cateID: Number(value),
          });
        }}
      />
      <SearchableOptionPicker
        value={agentID ? String(agentID) : undefined}
        options={filteredAgents.map((agent) => ({
          id: agent.id,
          value: agent.name || "未命名智能体",
        }))}
        disabled={disabled}
        clearable={false}
        placeholder="选择智能体"
        searchPlaceholder="输入智能体筛选..."
        emptyText="未找到智能体"
        onChange={(nextValue) => {
          const value = Array.isArray(nextValue)
            ? (nextValue[0] ?? "")
            : nextValue;
          const agent = agents.find((item) => String(item.id) === value);
          onChange({
            agentID: Number(value),
            cateID: Number(agent?.cate_id || selectedCateID || 0),
          });
        }}
      />
    </div>
  );
}

function resolveEditorTitle(selection: Exclude<Selection, null>) {
  if (selection.kind === "flow") {
    return "编辑工作流";
  }
  if (selection.kind === "node") {
    return "编辑节点";
  }
  return selection.kind === "flow_edge" ? "编辑工作流关系" : "编辑节点关系";
}

function deleteDialogTitle(selection: Selection) {
  if (selection?.kind === "flow") {
    return "删除工作流";
  }
  if (selection?.kind === "flow_edge" || selection?.kind === "node_edge") {
    return "删除关系";
  }
  return "删除图中项目";
}

function deleteDialogDescription(selection: Selection) {
  if (selection?.kind === "flow") {
    return "保存后该工作流会被停用，不做物理删除，已发布或历史运行数据不会被直接清掉。";
  }
  if (selection?.kind === "flow_edge" || selection?.kind === "node_edge") {
    return "删除后会移除这条关系线。保存前仍只在当前编辑状态中生效。";
  }
  return "删除后会同时移除关联连线。保存前仍只在当前编辑状态中生效。";
}

function normalizeNodeTypePatch(
  node: TeamNode,
  type: string,
): Partial<TeamNode> {
  const baseConfig = omitConfigKeys(node.config, [
    "goal",
    "agent_cate_id",
    "role_id",
    "role_key",
    "role_team_id",
    "role_type",
    "power_id",
    "power_key",
    "power_kind",
    "sub_team_id",
    "sub_flow_id",
    "sub_flow_key",
    "release_id",
    "operator",
    "source_key",
    "input_key",
    "value",
    "body_key",
    "content_key",
  ]);
  if (type === "agent") {
    return {
      type,
      role_id: 0,
      role_key: "",
      power_id: 0,
      sub_team_id: 0,
      config: omitConfigKeys(node.config, [
        "role_id",
        "role_key",
        "role_team_id",
        "role_type",
        "power_id",
        "power_key",
        "power_kind",
        "sub_team_id",
        "sub_flow_id",
        "sub_flow_key",
        "release_id",
        "operator",
        "source_key",
        "input_key",
        "value",
        "body_key",
        "content_key",
      ]),
    };
  }
  if (type === "role") {
    return {
      type,
      agent_id: 0,
      power_id: 0,
      sub_team_id: 0,
      config: omitConfigKeys(node.config, [
        "agent_cate_id",
        "power_id",
        "power_key",
        "power_kind",
        "sub_team_id",
        "sub_flow_id",
        "sub_flow_key",
        "release_id",
        "operator",
        "source_key",
        "input_key",
        "value",
        "body_key",
        "content_key",
      ]),
    };
  }
  if (type === "power") {
    return {
      type,
      role_id: 0,
      role_key: "",
      agent_id: 0,
      sub_team_id: 0,
      config: omitConfigKeys(node.config, [
        "goal",
        "agent_cate_id",
        "role_id",
        "role_key",
        "role_team_id",
        "role_type",
        "sub_team_id",
        "sub_flow_id",
        "sub_flow_key",
        "release_id",
        "operator",
        "source_key",
        "input_key",
        "value",
        "body_key",
        "content_key",
      ]),
    };
  }
  if (type === "team") {
    return {
      type,
      role_id: 0,
      role_key: "",
      agent_id: 0,
      power_id: 0,
      config: omitConfigKeys(node.config, [
        "goal",
        "agent_cate_id",
        "role_id",
        "role_key",
        "role_team_id",
        "role_type",
        "power_id",
        "power_key",
        "power_kind",
        "operator",
        "source_key",
        "input_key",
        "value",
        "body_key",
        "content_key",
      ]),
    };
  }
  if (type === "condition") {
    return {
      type,
      role_id: 0,
      role_key: "",
      agent_id: 0,
      power_id: 0,
      sub_team_id: 0,
      config: {
        ...omitConfigKeys(node.config, [
          "goal",
          "agent_cate_id",
          "role_id",
          "role_key",
          "role_team_id",
          "role_type",
          "power_id",
          "power_key",
          "power_kind",
          "sub_team_id",
          "sub_flow_id",
          "sub_flow_key",
          "release_id",
          "body_key",
          "content_key",
        ]),
        operator: normalizeConditionOperator(node.config?.operator),
      },
    };
  }
  if (type === "save") {
    return {
      type,
      role_id: 0,
      role_key: "",
      agent_id: 0,
      power_id: 0,
      sub_team_id: 0,
      config: baseConfig,
    };
  }
  return {
    type,
    role_id: 0,
    role_key: "",
    agent_id: 0,
    power_id: 0,
    sub_team_id: 0,
    config: baseConfig,
  };
}

function agentCateLabel(cate: AgentCateOption) {
  return String(cate.value || cate.name || cate.id);
}

function buildTeamBindingOptions({
  currentTeamID,
  currentTeamName,
  flows,
  roles,
  teams,
}: {
  currentTeamID: number;
  currentTeamName: string;
  flows: FlowItem[];
  roles: RoleOption[];
  teams: TeamOption[];
}) {
  const byID = new Map<number, TeamOption>();
  if (currentTeamID) {
    byID.set(currentTeamID, {
      id: currentTeamID,
      name: currentTeamName || "当前团队",
      flows,
      roles: roles.map((role) => ({
        ...role,
        team_id: Number(role.team_id || currentTeamID),
      })),
    });
  }
  teams.forEach((team) => {
    if (!team?.id) {
      return;
    }
    const existing = byID.get(team.id);
    const keepCurrentDraft = team.id === currentTeamID && Boolean(existing);
    const flowsSource = keepCurrentDraft
      ? existing?.flows
      : (team.flows ?? existing?.flows ?? []);
    const rolesSource = keepCurrentDraft
      ? existing?.roles
      : (team.roles ?? existing?.roles ?? []);
    byID.set(team.id, {
      ...existing,
      ...team,
      name: keepCurrentDraft
        ? existing?.name || team.name || ""
        : team.name || existing?.name || "",
      flows: (flowsSource ?? []).map(normalizeFlowItem),
      roles: (rolesSource ?? []).map((role) => ({
        ...role,
        team_id: Number(role.team_id || team.id),
      })),
    });
  });
  return Array.from(byID.values());
}

function findTeamOption(teams: TeamOption[], teamID: number) {
  return teams.find((team) => Number(team.id) === Number(teamID));
}

function findRoleInTeams(teams: TeamOption[], roleID: number) {
  if (!roleID) {
    return undefined;
  }
  for (const team of teams) {
    const role = (team.roles ?? []).find(
      (item) => Number(item.id) === Number(roleID),
    );
    if (role) {
      return role;
    }
  }
  return undefined;
}

function deriveAgentCateOptions(agents: AgentOption[]) {
  const cateIDs = Array.from(
    new Set(agents.map((agent) => Number(agent.cate_id || 0)).filter(Boolean)),
  );
  return cateIDs.map((id) => ({
    id,
    value: `分类${id}`,
  }));
}

function derivePowerKindOptions(powers: PowerOption[]) {
  const labels: Record<string, string> = {
    text: "文本",
    image: "图片",
    video: "视频",
    audio: "音频",
    role: "角色",
    multi: "多模态",
    embeddings: "向量",
    workflow: "工作流",
  };
  const seen = Array.from(
    new Set(powers.map((power) => power.kind).filter(Boolean)),
  );
  return seen.map((kind) => ({ id: kind, value: labels[kind] || kind }));
}

function normalizeConditionOperator(value: unknown) {
  const operator = String(value || "exists")
    .trim()
    .toLowerCase();
  return CONDITION_OPERATORS.some((item) => item.id === operator)
    ? operator
    : "exists";
}

function resolveNodeEdgeConditionOptions(
  edge: Pick<NodeEdge, "from_key">,
  nodes: TeamNode[],
  edgeConditions: Array<{ id: string; value: string }>,
) {
  const fromNode = nodes.find((node) => node.node_key === edge.from_key);
  if (!fromNode) {
    return [];
  }
  if (fromNode.type === "condition") {
    return pickEdgeConditions(edgeConditions, ["passed", "failed"]);
  }
  if (fromNode.type === "human_approval") {
    return pickEdgeConditions(edgeConditions, ["approved", "rejected"]);
  }
  return [];
}

function pickEdgeConditions(
  edgeConditions: Array<{ id: string; value: string }>,
  ids: string[],
) {
  const byID = new Map(edgeConditions.map((item) => [item.id, item]));
  return ids
    .map((id) => byID.get(id))
    .filter((item): item is { id: string; value: string } => !!item);
}

function buildDebugInput(
  prompt: string,
  references: AssistantReferenceFile[] = [],
) {
  const referenceFiles = assistantReferencePayload(references);
  return {
    goal: prompt,
    requirement: prompt,
    prompt,
    user_input: prompt,
    reference_files: referenceFiles ?? [],
  };
}

function buildDebugPreparingStatus(input: Record<string, any>) {
  return {
    run: {
      id: 0,
      request_id: "",
      status: RUN_STATUS_RUNNING,
      input,
      output: {},
      error: "",
    },
    flow_runs: [],
    node_runs: [],
    agent_runs: [],
    blackboard: [],
    approvals: [],
  };
}

function buildDebugStartStatus(startData: any, input: Record<string, any>) {
  return {
    run: {
      id: Number(startData?.run_id || 0),
      request_id: String(startData?.request_id || ""),
      status: String(startData?.status || RUN_STATUS_RUNNING),
      release_id: Number(startData?.release_id || 0),
      input,
      output: {},
      error: "",
    },
    flow_runs: [],
    node_runs: [],
    agent_runs: [],
    blackboard: [],
    approvals: [],
  };
}

async function watchDebugStream(
  streamApi: string,
  startStatus: any,
  onUpdate?: (result: any) => void,
  signal?: AbortSignal,
) {
  const requestID = String(startStatus?.run?.request_id || "");
  if (!requestID) {
    return startStatus;
  }

  let latest = startStatus;
  const result = await watchRuntimeStream<any>({
    streamApi,
    requestID,
    lastID: String(startStatus?.[DEBUG_STREAM_LAST_ID] || "0-0"),
    blockMs: DEBUG_STREAM_BLOCK_MS,
    signal,
    stopOnResult: true,
    onFrame: (frame) => {
      latest = withDebugStreamCursor(
        applyDebugStreamFrame(latest, frame),
        frame,
      );
      onUpdate?.(latest);
    },
  });
  if (result.lastID) {
    latest = {
      ...latest,
      [DEBUG_STREAM_LAST_ID]: result.lastID,
    };
  }
  return latest;
}

function withDebugStreamCursor(current: any, frame: RuntimeStreamFrame<any>) {
  const streamID = String(frame?.stream_id || "");
  if (!streamID) {
    return current;
  }
  return {
    ...current,
    [DEBUG_STREAM_LAST_ID]: streamID,
  };
}

function applyDebugStreamFrame(current: any, frame: RuntimeStreamFrame<any>) {
  const output = frame?.output;
  if (frame?.type === "result" && isDebugRunStatusPayload(output)) {
    return mergeDebugRunStatusPayload(current, output);
  }
  if (!isPlainDebugRecord(output)) {
    return current;
  }
  return applyDebugStreamEvent(current, output);
}

function mergeDebugRunStatusPayload(current: any, payload: any) {
  return {
    ...payload,
    node_runs: mergeDebugRowsFromPayload(
      arrayValue(current?.node_runs),
      arrayValue(payload?.node_runs),
      ["id", "node_key", "node_id"],
    ),
    flow_runs: mergeDebugRowsFromPayload(
      arrayValue(current?.flow_runs),
      arrayValue(payload?.flow_runs),
      ["id", "flow_id", "flow_key"],
    ),
  };
}

function mergeDebugRowsFromPayload(
  currentRows: any[],
  payloadRows: any[],
  keys: string[],
) {
  return payloadRows.map((row) => {
    const current = currentRows.find((item) =>
      keys.some(
        (key) =>
          hasDebugStreamValue(row?.[key]) &&
          String(item?.[key]) === String(row?.[key]),
      ),
    );
    return current
      ? mergeDebugRow(current, row)
      : ensureDebugClientStartedAt(row);
  });
}

function isDebugRunStatusPayload(value: any) {
  return Boolean(
    isPlainDebugRecord(value) &&
    (isPlainDebugRecord(value.run) ||
      Array.isArray(value.flow_runs) ||
      Array.isArray(value.node_runs)),
  );
}

function applyDebugStreamEvent(current: any, event: Record<string, any>) {
  const next = cloneDebugRunStatus(current);
  const scope = String(event.scope || "");
  if (scope === "run" || isRunLevelDebugEvent(event.event)) {
    next.run = mergeDebugRunFromEvent(next.run, event);
  }
  if (scope === "flow") {
    next.flow_runs = upsertDebugRow(
      next.flow_runs,
      debugFlowRunFromEvent(event),
      ["id", "flow_id", "flow_key"],
    );
  }
  if (scope === "node") {
    next.node_runs = upsertDebugRow(
      next.node_runs,
      debugNodeRunFromEvent(event),
      ["id", "node_key", "node_id"],
    );
  }
  if (event.error) {
    next.error = String(event.error);
  }
  return next;
}

function cloneDebugRunStatus(value: any) {
  return {
    ...value,
    run: { ...(value?.run || {}) },
    flow_runs: arrayValue(value?.flow_runs).map((row) => ({ ...row })),
    node_runs: arrayValue(value?.node_runs).map((row) => ({ ...row })),
    agent_runs: arrayValue(value?.agent_runs),
    blackboard: arrayValue(value?.blackboard),
    approvals: arrayValue(value?.approvals),
    messages: arrayValue(value?.messages),
  };
}

function isRunLevelDebugEvent(event: any) {
  return ["run_started", "run_finished", "waiting"].includes(
    String(event || ""),
  );
}

function mergeDebugRunFromEvent(current: any, event: Record<string, any>) {
  const run = { ...(current || {}) };
  assignDebugValue(run, "id", event.run_id);
  assignDebugValue(run, "team_id", event.team_id);
  assignDebugValue(run, "release_id", event.release_id);
  assignDebugValue(run, "status", event.status || event.run_status);
  assignDebugValue(run, "input", event.input);
  assignDebugValue(run, "output", event.output);
  assignDebugValue(run, "error", event.error);
  assignDebugValue(run, "started_at", event.started_at);
  assignDebugValue(run, "finished_at", event.finished_at);
  return run;
}

function debugFlowRunFromEvent(event: Record<string, any>) {
  return compactDebugRow({
    id: event.flow_run_id,
    run_id: event.run_id,
    flow_id: event.flow_id,
    flow_key: event.flow_key,
    flow_name: event.flow_name,
    name: event.flow_name,
    status: event.status,
    input: event.input,
    output: event.output,
    error: event.error,
    started_at: event.started_at,
    finished_at: event.finished_at,
  });
}

function debugNodeRunFromEvent(event: Record<string, any>) {
  return compactDebugRow({
    id: event.node_run_id,
    run_id: event.run_id,
    flow_run_id: event.flow_run_id,
    flow_id: event.flow_id,
    flow_key: event.flow_key,
    flow_name: event.flow_name,
    node_id: event.node_id,
    node_key: event.node_key,
    node_name: event.node_name,
    name: event.node_name,
    node_type: event.node_type,
    status: event.status,
    input: event.input,
    output: event.output,
    agent_run_id: event.agent_run_id,
    agent_request_id: event.agent_request_id,
    agent_stream_type: event.agent_stream_type,
    error: event.error,
    started_at: event.started_at,
    finished_at: event.finished_at,
  });
}

function compactDebugRow(row: Record<string, any>) {
  const result: Record<string, any> = {};
  Object.entries(row).forEach(([key, value]) => {
    if (hasDebugStreamValue(value)) {
      result[key] = value;
    }
  });
  return result;
}

function upsertDebugRow(rows: any[], row: Record<string, any>, keys: string[]) {
  if (!Object.keys(row).length) {
    return rows;
  }
  const nextRow = ensureDebugClientStartedAt(row);
  const index = rows.findIndex((current) =>
    keys.some(
      (key) =>
        hasDebugStreamValue(nextRow[key]) &&
        String(current?.[key]) === String(nextRow[key]),
    ),
  );
  if (index < 0) {
    return [...rows, nextRow];
  }
  const next = [...rows];
  next[index] = mergeDebugRow(next[index], nextRow);
  return next;
}

function mergeDebugRow(current: any, row: Record<string, any>) {
  const merged = {
    ...current,
    ...row,
  };
  if (hasDebugStreamValue(current?.[DEBUG_CLIENT_STARTED_AT])) {
    merged[DEBUG_CLIENT_STARTED_AT] = current[DEBUG_CLIENT_STARTED_AT];
  } else if (shouldTrackDebugClientStartedAt(merged)) {
    merged[DEBUG_CLIENT_STARTED_AT] =
      row[DEBUG_CLIENT_STARTED_AT] || Date.now();
  }
  if (
    hasDebugStreamValue(current?.started_at) &&
    hasDebugStreamValue(row.started_at) &&
    !hasDebugStreamValue(row.finished_at)
  ) {
    merged.started_at = current.started_at;
  }
  return merged;
}

function ensureDebugClientStartedAt(row: Record<string, any>) {
  if (!shouldTrackDebugClientStartedAt(row)) {
    return row;
  }
  if (hasDebugStreamValue(row[DEBUG_CLIENT_STARTED_AT])) {
    return row;
  }
  return {
    ...row,
    [DEBUG_CLIENT_STARTED_AT]: Date.now(),
  };
}

function shouldTrackDebugClientStartedAt(row: Record<string, any>) {
  const status = String(row?.status || "");
  return (
    status === RUN_STATUS_RUNNING ||
    status === RUN_STATUS_WAITING ||
    hasDebugStreamValue(row?.started_at)
  );
}

function assignDebugValue(
  target: Record<string, any>,
  key: string,
  value: any,
) {
  if (hasDebugStreamValue(value)) {
    target[key] = value;
  }
}

function hasDebugStreamValue(value: any) {
  if (value == null || value === "") {
    return false;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return true;
}

function buildPendingDebugApprovalsByNodeKey(
  result: any,
  hiddenApprovalIds: Set<string> = new Set(),
): Record<string, DebugPendingApproval> {
  const pendingByNodeKey: Record<string, DebugPendingApproval> = {};
  const nodeKeyByRunID = new Map<string, string>();

  for (const row of arrayValue(result?.node_runs)) {
    const nodeRunID = String(row?.id || "");
    const nodeKey = String(row?.node_key || "");
    if (nodeRunID && nodeKey) {
      nodeKeyByRunID.set(nodeRunID, nodeKey);
    }
  }

  for (const approval of arrayValue(result?.approvals)) {
    const pending = pendingDebugApprovalFromApproval(approval);
    if (!pending) {
      continue;
    }
    if (hiddenApprovalIds.has(String(pending.id))) {
      continue;
    }
    const nodeKey = firstDebugText(
      pending.nodeKey,
      approval?.node_key,
      nodeKeyByRunID.get(
        String(pending.nodeRunID || approval?.node_run_id || ""),
      ),
    );
    if (nodeKey) {
      pendingByNodeKey[nodeKey] = {
        ...pending,
        nodeKey,
      };
    }
  }

  for (const row of arrayValue(result?.node_runs)) {
    const pending = pendingDebugApprovalFromNodeRun(row);
    if (pending && hiddenApprovalIds.has(String(pending.id))) {
      continue;
    }
    const nodeKey = String(row?.node_key || pending?.nodeKey || "");
    if (pending && nodeKey && !pendingByNodeKey[nodeKey]) {
      pendingByNodeKey[nodeKey] = {
        ...pending,
        nodeKey,
      };
    }
  }

  return pendingByNodeKey;
}

function pendingDebugApprovalFromApproval(
  approval: any,
): DebugPendingApproval | null {
  if (String(approval?.status || "") !== RUN_STATUS_PENDING) {
    return null;
  }
  if (!approval?.id) {
    return null;
  }
  const content = debugRecord(approval?.content);
  const interaction = normalizeDebugApprovalInteraction(
    content.interaction,
    approval?.title,
    approval?.id,
  );
  return {
    id: approval.id,
    title: firstDebugText(approval?.title, interaction.title),
    nodeRunID: approval.node_run_id,
    nodeKey: firstDebugText(approval?.node_key),
    kind: firstDebugText(content.kind, content.type),
    interaction,
  };
}

function pendingDebugApprovalFromNodeRun(
  row: any,
): DebugPendingApproval | null {
  if (String(row?.status || "") !== RUN_STATUS_WAITING) {
    return null;
  }
  const output = debugRecord(row?.output);
  const approvalID = output.approval_id || output.approvalId;
  if (!approvalID) {
    return null;
  }
  const interaction = normalizeDebugApprovalInteraction(
    output.interaction,
    row?.node_name || row?.name,
    approvalID,
  );
  return {
    id: approvalID,
    title: firstDebugText(row?.node_name, row?.name, interaction.title),
    nodeRunID: row.id,
    nodeKey: String(row?.node_key || ""),
    kind: debugApprovalKindFromNodeRun(row, interaction),
    interaction,
  };
}

function debugApprovalKindFromNodeRun(row: any, interaction: AgentInteraction) {
  const nodeType = String(row?.node_type || "");
  if (nodeType === "human_approval") {
    return "human_approval";
  }
  if (String(interaction?.type || "") === "power_params") {
    return "power";
  }
  return "agent_interaction";
}

function normalizeDebugApprovalInteraction(
  value: any,
  title: any,
  approvalID: any,
): AgentInteraction {
  if (isPlainDebugRecord(value) && firstDebugText(value.type)) {
    return value as AgentInteraction;
  }
  return {
    id: `team-approval-${approvalID || Date.now()}`,
    type: "form",
    title: firstDebugText(title) || "等待用户反馈",
    description: "补充反馈后，团队工作流会继续执行。",
    fields: [
      {
        key: "decision",
        name: "处理结果",
        type: "select",
        required: true,
        default_value: "approved",
        options: [
          { label: "通过", value: "approved" },
          { label: "驳回", value: "rejected" },
        ],
      },
      {
        key: "comment",
        name: "反馈说明",
        type: "textarea",
        placeholder: "填写补充信息、选择原因或修改建议。",
      },
    ],
    values: {
      decision: "approved",
    },
  };
}

function markDebugApprovalSubmitted(
  current: any,
  approval: DebugPendingApproval,
  result: AgentInteractionSubmitResult,
) {
  const next = cloneDebugRunStatus(current);
  next.approvals = arrayValue(next.approvals).map((row) =>
    String(row?.id || "") === String(approval.id)
      ? {
          ...row,
          status: RUN_STATUS_SUCCESS,
          decision: result.data.decision || "approved",
          comment: result.data.comment || result.text,
        }
      : row,
  );
  next.node_runs = arrayValue(next.node_runs).map((row) => {
    const sameRunID =
      approval.nodeRunID &&
      String(row?.id || "") === String(approval.nodeRunID);
    const sameNodeKey =
      approval.nodeKey &&
      String(row?.node_key || "") === String(approval.nodeKey);
    if (!sameRunID && !sameNodeKey) {
      return row;
    }
    if (approval.kind === "agent_interaction") {
      return {
        ...row,
        status: RUN_STATUS_RUNNING,
        output: {
          approval_id: approval.id,
          text: "已提交反馈，继续执行当前节点。",
          feedback: {
            text: result.text,
            data: result.data,
          },
        },
      };
    }
    return {
      ...row,
      status: RUN_STATUS_SUCCESS,
      output: {
        approval_id: approval.id,
        decision: result.data.decision || "approved",
        comment: result.data.comment || result.text,
        text: result.text,
        data: result.data,
      },
    };
  });
  return next;
}

function markDebugRunResumed(current: any, data: any) {
  const next = cloneDebugRunStatus(current);
  next.run = {
    ...(next.run || {}),
    id: Number(data?.run_id || next.run?.id || 0),
    request_id: String(data?.request_id || next.run?.request_id || ""),
    status: String(data?.status || RUN_STATUS_RUNNING),
  };
  return next;
}

function debugRecord(value: any): Record<string, any> {
  return isPlainDebugRecord(value) ? value : {};
}

function runStatusLabel(status: string) {
  const labels: Record<string, string> = {
    [RUN_STATUS_RUNNING]: "运行中",
    [RUN_STATUS_WAITING]: "等待反馈",
    [RUN_STATUS_SUCCESS]: "成功",
    [RUN_STATUS_FAIL]: "失败",
    [RUN_STATUS_CANCELED]: "已取消",
    [RUN_STATUS_PENDING]: "等待中",
  };
  return labels[status] || status || "未知";
}

function debugVisibleNodeError(row: any) {
  if (!row?.error || String(row?.status || "") === RUN_STATUS_SUCCESS) {
    return "";
  }
  return String(row.error);
}

function debugStatusClass(status: string) {
  switch (status) {
    case RUN_STATUS_SUCCESS:
      return "bg-emerald-50 text-emerald-700";
    case RUN_STATUS_FAIL:
      return "bg-destructive/10 text-destructive";
    case RUN_STATUS_RUNNING:
      return "bg-blue-50 text-blue-700";
    case RUN_STATUS_WAITING:
      return "bg-amber-50 text-amber-700";
    case RUN_STATUS_CANCELED:
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted/60 text-muted-foreground";
  }
}

function buildGraphExecutionState(
  result: any,
  nodes: TeamNode[],
  edges: NodeEdge[],
  running: boolean,
  pendingApprovalsByNodeKey: Record<string, DebugPendingApproval> = {},
): GraphExecutionState {
  const nodeRunsByKey: Record<string, GraphExecutionNodeState> = {};
  const agentRunsByID = agentTraceByID(arrayValue(result?.agent_runs));
  const successKeys = new Set<string>();
  const activeKeys = new Set<string>();
  const nodeRuns = sortDebugRunRows(arrayValue(result?.node_runs));

  nodeRuns.forEach((row) => {
    const key = String(row?.node_key || "");
    if (!key) {
      return;
    }
    const status = String(row?.status || RUN_STATUS_PENDING);
    nodeRunsByKey[key] = { status, run: row };
    if (status === RUN_STATUS_SUCCESS) {
      successKeys.add(key);
    }
    if (isDebugActiveStatus(status)) {
      activeKeys.add(key);
    }
  });

  const nodeKeys = new Set(nodes.map((node) => node.node_key));
  const activeEdgeKeys = new Set<string>();
  const completedEdgeKeys = new Set<string>();
  edges.forEach((edge, index) => {
    if (!nodeKeys.has(edge.from_key) || !nodeKeys.has(edge.to_key)) {
      return;
    }
    const key = graphExecutionEdgeKey(edge, index);
    if (successKeys.has(edge.from_key) && activeKeys.has(edge.to_key)) {
      activeEdgeKeys.add(key);
    }
    if (successKeys.has(edge.from_key) && successKeys.has(edge.to_key)) {
      completedEdgeKeys.add(key);
    }
  });

  return {
    active: running || Boolean(result?.run),
    running,
    nodeRuns,
    nodeRunsByKey,
    agentRunsByID,
    pendingApprovalsByNodeKey,
    activeEdgeKeys,
    completedEdgeKeys,
  };
}

function graphExecutionEdgeKey(
  edge: Pick<NodeEdge, "from_key" | "to_key">,
  index: number,
) {
  return `${edge.from_key}->${edge.to_key}:${index}`;
}

function graphExecutionCardStyle(status: string): CSSProperties | undefined {
  if (isDebugActiveStatus(status)) {
    return {
      animation: "team-node-running 1.4s ease-in-out infinite",
      borderColor: "#2563eb",
    };
  }
  if (status === RUN_STATUS_SUCCESS) {
    return {
      borderColor: "#86efac",
      boxShadow:
        "0 0 0 3px rgb(16 185 129 / 0.12), 0 4px 12px rgb(15 23 42 / 0.08)",
    };
  }
  if (status === RUN_STATUS_FAIL) {
    return {
      borderColor: "#f87171",
      boxShadow:
        "0 0 0 3px rgb(239 68 68 / 0.12), 0 4px 12px rgb(15 23 42 / 0.08)",
    };
  }
  if (status === RUN_STATUS_WAITING) {
    return {
      borderColor: "#f59e0b",
      boxShadow:
        "0 0 0 3px rgb(245 158 11 / 0.14), 0 4px 12px rgb(15 23 42 / 0.08)",
    };
  }
  return undefined;
}

function graphExecutionBadgeClass(status: string) {
  if (isDebugActiveStatus(status)) {
    return "bg-blue-50 text-blue-700";
  }
  if (status === RUN_STATUS_SUCCESS) {
    return "bg-emerald-50 text-emerald-700";
  }
  if (status === RUN_STATUS_FAIL) {
    return "bg-destructive/10 text-destructive";
  }
  if (status === RUN_STATUS_WAITING) {
    return "bg-amber-50 text-amber-700";
  }
  return "bg-muted text-muted-foreground";
}

function graphExecutionStatusLabel(status: string, nodeType?: string) {
  if (isDebugActiveStatus(status)) {
    return "执行中";
  }
  return debugNodeStatusLabel(status, nodeType);
}

function debugNodeStatusLabel(status: string, nodeType?: string) {
  if (
    status === RUN_STATUS_WAITING &&
    String(nodeType || "") === "human_approval"
  ) {
    return "等待人工确认";
  }
  return runStatusLabel(status);
}

function sortDebugRunRows(rows: any[]) {
  return [...rows].sort(compareDebugRunRows);
}

function compareDebugRunRows(left: any, right: any) {
  const leftStarted = debugSortDate(left?.started_at);
  const rightStarted = debugSortDate(right?.started_at);
  if (leftStarted !== rightStarted) {
    return leftStarted - rightStarted;
  }

  const leftCreated = debugSortDate(left?.created_at);
  const rightCreated = debugSortDate(right?.created_at);
  if (leftCreated !== rightCreated) {
    return leftCreated - rightCreated;
  }

  return Number(left?.id || 0) - Number(right?.id || 0);
}

function debugSortDate(value: any) {
  return parseDebugDate(value)?.getTime() ?? Number.MAX_SAFE_INTEGER;
}

function isDebugActiveStatus(status: any) {
  return String(status || "") === RUN_STATUS_RUNNING;
}

function shouldShowRuntimeTiming(nodeType: string) {
  return (
    nodeType === "agent" ||
    nodeType === "role" ||
    nodeType === "power" ||
    nodeType === "team"
  );
}

function isDebugNodeTimingActive(row: any, agentTrace: any) {
  const timing = shouldShowRuntimeTiming(String(row?.node_type || ""))
    ? debugNodeTiming(row, agentTrace)
    : undefined;
  return isStreamTimingRunning(timing) || isDebugActiveStatus(row?.status);
}

function debugNodeTiming(
  row: any,
  agentTrace: any,
  context?: DebugNodeTimingContext,
): StreamTiming | undefined {
  const source = agentTrace || row;
  const status = row?.status || source?.status;
  const startedAt =
    row?.[DEBUG_CLIENT_STARTED_AT] ||
    row?.started_at ||
    source?.started_at ||
    row?.created_at;
  return createRuntimeStreamTiming({
    status,
    startedAt,
    finishedAt: source?.finished_at || row?.finished_at,
    label: debugNodeTimingLabel(row, agentTrace, context),
    percent: streamTimingPercentFromOutput(
      lastTraceStreamOutput(agentTrace),
      source?.output,
      row?.output,
    ),
  });
}

function debugNodeTimingLabel(
  row: any,
  agentTrace: any,
  context?: DebugNodeTimingContext,
) {
  const streamOutput = lastTraceStreamOutput(agentTrace);
  const teamWorkflowLabel = debugTeamWorkflowTimingLabel(row, context);
  return (
    firstDebugRunLabel(
      streamOutput?.text,
      streamOutput?.message,
      agentTrace?.output?.text,
      row?.output?.text,
    ) ||
    teamWorkflowLabel ||
    `${debugNodeTypeLabel(row?.node_type)}：${row?.node_name || row?.node_key || "节点"}`
  );
}

function debugTeamWorkflowTimingLabel(
  row: any,
  context?: DebugNodeTimingContext,
) {
  if (String(row?.node_type || "") !== "team") {
    return "";
  }
  const flowID = teamNodeSubFlowID(context?.node);
  if (!flowID) {
    return `${debugNodeTypeLabel(row?.node_type)}：${row?.node_name || row?.node_key || "节点"}`;
  }
  const runningNodes = arrayValue(context?.nodeRuns)
    .filter((item) => {
      if (Number(item?.flow_id || 0) !== flowID) {
        return false;
      }
      const status = String(item?.status || "");
      return status === RUN_STATUS_RUNNING || status === RUN_STATUS_WAITING;
    })
    .slice(0, 2)
    .map((item) => `${item?.node_name || item?.node_key || "节点"}正在执行`);
  if (runningNodes.length === 0) {
    return `${debugNodeTypeLabel(row?.node_type)}：${row?.node_name || row?.node_key || "节点"}`;
  }
  return runningNodes.join("、");
}

function teamNodeSubFlowID(node?: TeamNode) {
  return Number(node?.config?.sub_flow_id || node?.config?.flow_id || 0);
}

function lastTraceStreamOutput(trace: any) {
  const entries = arrayValue(trace?.stream);
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const output = entries[index]?.payload?.output;
    if (hasDebugDisplayOutput(output)) {
      return output;
    }
  }
  return undefined;
}

function debugNodeDisplayOutput(row: any, agentTrace: any) {
  const nodeType = String(row?.node_type || "");
  const rowOutput = stripDebugMetadata(row?.output);
  const traceOutput = stripDebugMetadata(agentTrace?.output);
  const approvalOutput = debugSubmittedApprovalOutput(rowOutput);

  if (hasDebugDisplayOutput(approvalOutput)) {
    return approvalOutput;
  }

  if (nodeType === "agent" || nodeType === "role") {
    const nestedOutput = isPlainDebugRecord(rowOutput)
      ? rowOutput.output
      : undefined;
    return firstDebugOutputValue(
      traceOutput,
      nestedOutput,
      isPlainDebugRecord(nestedOutput) ? nestedOutput.output : undefined,
      isPlainDebugRecord(nestedOutput) ? nestedOutput.content : undefined,
      isPlainDebugRecord(rowOutput) && rowOutput.summary
        ? { text: rowOutput.summary }
        : undefined,
      rowOutput,
    );
  }

  if (nodeType === "power") {
    return firstDebugOutputValue(
      isPlainDebugRecord(rowOutput) ? rowOutput.output : undefined,
      isPlainDebugRecord(rowOutput) ? rowOutput.data?.output : undefined,
      rowOutput,
    );
  }

  if (nodeType === "merge") {
    return debugMergeNodeDisplayOutput(rowOutput);
  }

  if (nodeType === "team") {
    return firstDebugOutputValue(
      isPlainDebugRecord(rowOutput)
        ? debugWorkflowDisplayOutput(rowOutput.output)
        : undefined,
      isPlainDebugRecord(rowOutput) ? rowOutput.result?.run?.output : undefined,
      isPlainDebugRecord(rowOutput) ? rowOutput.result?.output : undefined,
      rowOutput,
    );
  }

  return firstDebugOutputValue(
    isPlainDebugRecord(rowOutput) ? rowOutput.output : undefined,
    isPlainDebugRecord(rowOutput) ? rowOutput.result : undefined,
    rowOutput,
  );
}

function debugMergeNodeDisplayOutput(value: any) {
  const record = debugRecord(value);
  if (!Object.keys(record).length) {
    return firstDebugOutputValue(value);
  }

  const sourceOutputs = arrayValue(record.sources)
    .map(debugMergeSourceDisplayOutput)
    .filter(hasDebugDisplayOutput);
  if (sourceOutputs.length > 0) {
    const metaText = debugMergeMetaText(record.meta);
    return metaText ? [{ text: metaText }, ...sourceOutputs] : sourceOutputs;
  }

  const mergedOutputs = Object.entries(debugRecord(record.merged))
    .map(([key, item]) => debugMergeSectionOutput(key, key, item))
    .filter(hasDebugDisplayOutput);
  if (mergedOutputs.length > 0) {
    return mergedOutputs;
  }

  return firstDebugOutputValue(
    record.text ? { text: record.text } : undefined,
    record.output,
    record.result,
    record.content,
    record.data,
    value,
  );
}

function debugMergeSourceDisplayOutput(source: any) {
  const record = debugRecord(source);
  if (!Object.keys(record).length) {
    return firstDebugOutputValue(source);
  }
  return debugMergeSectionOutput(
    firstDebugText(record.title, record.key, "上游节点"),
    firstDebugText(record.key),
    record.text || record.content,
  );
}

function debugMergeSectionOutput(title: string, key: string, value: any) {
  const output = firstDebugOutputValue(
    value,
    isPlainDebugRecord(value) ? value.output : undefined,
    isPlainDebugRecord(value) ? value.result : undefined,
    isPlainDebugRecord(value) ? value.content : undefined,
    isPlainDebugRecord(value) && value.text ? { text: value.text } : undefined,
  );
  if (!hasDebugDisplayOutput(output)) {
    return undefined;
  }
  const heading = firstDebugText(title, key, "上游节点");
  if (typeof output === "string") {
    return { title: heading, text: output };
  }
  if (isPlainDebugRecord(output)) {
    return { ...output, title: heading };
  }
  return { title: heading, json: output };
}

function debugMergeMetaText(meta: any) {
  const record = debugRecord(meta);
  const incomingCount = Number(record.incoming_count || 0);
  const incomingSourceCount = Number(
    record.incoming_source_count || record.source_count || 0,
  );
  const sourceCount = Number(record.source_count || 0);
  const missingCount = Number(record.missing_source_count || 0);
  if (!incomingCount && !sourceCount && !missingCount) {
    return "";
  }
  const lines = [`合并上游：${incomingSourceCount}/${incomingCount}`];
  if (sourceCount > incomingSourceCount) {
    lines.push(`展示条目：${sourceCount}`);
  }
  if (missingCount > 0) {
    lines.push(`缺少输出：${missingCount}`);
  }
  return lines.join("，");
}

function debugWorkflowDisplayOutput(value: any) {
  const record = debugRecord(stripDebugMetadata(value));
  if (!Object.keys(record).length) {
    return value;
  }
  const direct = firstDebugOutputValue(
    record.output,
    record.result,
    record.content,
    record.data,
    record.text ? { text: record.text } : undefined,
  );
  if (hasDebugDisplayOutput(direct)) {
    return direct;
  }
  const keys = Object.keys(record)
    .filter(
      (key) => !key.startsWith("_") && !["input", "user_input"].includes(key),
    )
    .reverse();
  for (const key of keys) {
    const item = stripDebugMetadata(record[key]);
    const nested = isPlainDebugRecord(item)
      ? firstDebugOutputValue(
          item.output,
          item.result,
          item.content,
          item.data,
          item.text ? { text: item.text } : undefined,
        )
      : firstDebugOutputValue(item);
    if (hasDebugDisplayOutput(nested)) {
      return nested;
    }
  }
  return undefined;
}

function debugSubmittedApprovalOutput(value: any) {
  if (!isPlainDebugRecord(value)) {
    return undefined;
  }
  if (
    !hasDebugStreamValue(value.approval_id) &&
    !hasDebugStreamValue(value.approvalId)
  ) {
    return undefined;
  }
  const content = debugRecord(value.content);
  const approvalKind = firstDebugText(content.kind, content.type).toLowerCase();
  const approvalText = debugApprovalDecisionText(value);
  if (approvalText && approvalKind !== "agent_interaction") {
    return { text: approvalText };
  }
  const data = debugRecord(value.data);
  const submittedData = Object.keys(data).length
    ? data
    : debugRecord(content.data);
  const text = firstDebugText(value.text, submittedData.text, value.comment);
  return firstDebugOutputValue(
    submittedData.output,
    submittedData.params,
    text ? { text } : undefined,
    compactSubmittedApprovalData(submittedData),
  );
}

function debugApprovalDecisionText(value: Record<string, any>) {
  const decision = String(value.decision || "").toLowerCase();
  if (!decision) {
    return "";
  }
  const label =
    decision === "approved"
      ? "人工确认：已通过"
      : decision === "rejected"
        ? "人工确认：已驳回"
        : `人工确认：${decision}`;
  const comment = firstDebugText(value.comment);
  return comment ? `${label}\n\n${comment}` : label;
}

function compactSubmittedApprovalData(data: Record<string, any>) {
  const result: Record<string, any> = {};
  Object.entries(data).forEach(([key, item]) => {
    if (["interaction", "output", "params", "text"].includes(key)) {
      return;
    }
    result[key] = item;
  });
  return result;
}

function firstDebugOutputValue(...values: any[]) {
  for (const value of values) {
    const output = normalizeDebugResultOutput(stripDebugMetadata(value));
    if (hasDebugDisplayOutput(output)) {
      return output;
    }
  }
  return undefined;
}

function normalizeDebugResultOutput(value: any): any {
  const protocolOutput = normalizeAgentResultOutputValue(value);
  if (protocolOutput !== value && hasDebugDisplayOutput(protocolOutput)) {
    return protocolOutput;
  }

  if (typeof value === "string") {
    const protocol = extractDebugAgentResultPayload(value);
    if (protocol) {
      return normalizeDebugAgentResultPayload(
        protocol.payload,
        protocol.cleanText,
      );
    }
    const payload = parseDebugAgentResultPayload(value);
    if (payload) {
      return normalizeDebugAgentResultPayload(payload);
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(normalizeDebugResultOutput).filter(hasDebugDisplayOutput);
  }
  if (!isPlainDebugRecord(value)) {
    return value;
  }

  const textProtocol = extractDebugAgentResultPayload(
    firstDebugText(value.text),
  );
  if (textProtocol) {
    return normalizeDebugAgentResultPayload(
      textProtocol.payload,
      textProtocol.cleanText,
    );
  }
  if (isDebugAgentResultPayload(value)) {
    return normalizeDebugAgentResultPayload(value);
  }
  const nested = firstDebugNestedOutputValue(value);
  if (nested !== undefined) {
    return nested;
  }

  return value;
}

function firstDebugNestedOutputValue(value: Record<string, any>) {
  for (const key of ["output", "result", "data", "content", "json", "value"]) {
    const normalized = normalizeDebugResultOutput(
      stripDebugMetadata(value[key]),
    );
    if (hasDebugDisplayOutput(normalized)) {
      return normalized;
    }
  }
  return undefined;
}

function normalizeDebugAgentResultPayload(
  payload: Record<string, any>,
  fallbackText = "",
) {
  const result: Record<string, any> = {};
  const content = normalizeDebugAgentContent(payload.content);

  if (content) {
    copyDebugResultOutputFields(result, content);
  }
  copyDebugResultOutputFields(result, payload);

  const text = debugAgentResultText(payload) || fallbackText;
  if (text) {
    result.text = text;
  }
  if (!hasDebugDisplayOutput(result) && content) {
    return content;
  }
  return result;
}

function normalizeDebugAgentContent(value: any): Record<string, any> | null {
  if (isPlainDebugRecord(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    return {
      format: "markdown",
      text: value.trim(),
    };
  }
  return null;
}

function copyDebugResultOutputFields(
  target: Record<string, any>,
  source: Record<string, any>,
) {
  const keys = [
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
  ];
  keys.forEach((key) => {
    if (hasDebugResultValue(source[key])) {
      target[key] = source[key];
    }
  });
  if (!hasDebugResultValue(target.rich) && isPlainDebugRecord(source.value)) {
    target.rich = source.value;
  }
}

function hasDebugResultValue(value: any) {
  if (value == null || value === "") {
    return false;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (isPlainDebugRecord(value)) {
    return Object.keys(value).length > 0;
  }
  return true;
}

function debugAgentResultText(value: any): string {
  if (!isPlainDebugRecord(value)) {
    return typeof value === "string" ? value.trim() : "";
  }
  const direct = firstDebugText(value.text);
  if (direct) {
    return direct;
  }
  const content = value.content;
  if (typeof content === "string") {
    return content.trim();
  }
  if (isPlainDebugRecord(content)) {
    return firstDebugText(content.text);
  }
  return "";
}

function firstDebugRunLabel(...values: any[]) {
  for (const value of values) {
    const text = firstDebugText(value);
    if (!text) {
      continue;
    }
    const protocol =
      extractAgentResultPayload(text) || extractDebugAgentResultPayload(text);
    if (protocol) {
      const label = firstDebugText(
        protocol.cleanText,
        agentResultPayloadTitle(protocol.payload),
        debugAgentResultTitle(protocol.payload),
      );
      if (label) {
        return label;
      }
      continue;
    }
    if (isAgentResultProtocolText(text)) {
      continue;
    }
    return text;
  }
  return "";
}

function debugAgentResultTitle(value: any) {
  if (!isPlainDebugRecord(value)) {
    return "";
  }
  const content = isPlainDebugRecord(value.content) ? value.content : {};
  return firstDebugText(value.title, content.title);
}

function extractDebugAgentResultPayload(text: string):
  | {
      cleanText: string;
      payload: Record<string, any>;
    }
  | undefined {
  for (const lang of ["agent-result", "agent-output", "json"]) {
    const result = extractDebugAgentResultPayloadByLang(text, lang);
    if (result) {
      return result;
    }
  }
  const payload = parseDebugAgentResultPayload(text);
  return payload ? { cleanText: "", payload } : undefined;
}

function extractDebugAgentResultPayloadByLang(
  text: string,
  lang: string,
):
  | {
      cleanText: string;
      payload: Record<string, any>;
    }
  | undefined {
  const open = `\`\`\`${lang}`;
  const start = text.indexOf(open);
  if (start < 0) {
    return undefined;
  }

  let bodyStart = start + open.length;
  while (bodyStart < text.length && isDebugFenceWhitespace(text[bodyStart])) {
    bodyStart += 1;
  }

  let searchStart = bodyStart;
  while (searchStart < text.length) {
    const end = text.indexOf("```", searchStart);
    if (end < 0) {
      const payload = parseDebugAgentResultPayload(text.slice(bodyStart));
      return payload
        ? {
            cleanText: text.slice(0, start).trim(),
            payload,
          }
        : undefined;
    }

    const payload = parseDebugAgentResultPayload(text.slice(bodyStart, end));
    if (payload) {
      return {
        cleanText: `${text.slice(0, start)}${text.slice(end + 3)}`.trim(),
        payload,
      };
    }
    searchStart = end + 3;
  }

  return undefined;
}

function parseDebugAgentResultPayload(value: string) {
  const text = value.trim();
  const repaired = repairDebugJSONControlChars(text);
  const sources = repaired === text ? [text] : [text, repaired];
  for (const source of sources) {
    try {
      const parsed = JSON.parse(source);
      if (isDebugAgentResultPayload(parsed)) {
        return parsed;
      }
    } catch {
      // continue with repaired source when needed
    }
  }
  return undefined;
}

function isDebugAgentResultPayload(value: any): value is Record<string, any> {
  if (!isPlainDebugRecord(value)) {
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
    ].some((key) => hasDebugResultValue(value[key]))
  );
}

function repairDebugJSONControlChars(value: string) {
  let result = "";
  let inString = false;
  let escaped = false;
  for (const char of value) {
    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      result += char;
      escaped = inString;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }
    if (inString && char.charCodeAt(0) < 32) {
      result += escapeDebugJSONControlChar(char);
      continue;
    }
    result += char;
  }
  return result;
}

function escapeDebugJSONControlChar(value: string) {
  switch (value) {
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "\t":
      return "\\t";
    default:
      return `\\u${value.charCodeAt(0).toString(16).padStart(4, "0")}`;
  }
}

function isDebugFenceWhitespace(value: string) {
  return value === " " || value === "\t" || value === "\r" || value === "\n";
}

function stripDebugMetadata(value: any): any {
  if (Array.isArray(value)) {
    return value.map(stripDebugMetadata).filter(hasDebugDisplayOutput);
  }
  if (!isPlainDebugRecord(value)) {
    return value;
  }

  const result: Record<string, any> = {};
  Object.entries(value).forEach(([key, item]) => {
    if (key === "_debug_asset") {
      return;
    }
    result[key] = item;
  });
  return result;
}

function hasDebugDisplayOutput(value: any): boolean {
  if (value == null || value === "") {
    return false;
  }
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.some(hasDebugDisplayOutput);
  }
  if (!isPlainDebugRecord(value)) {
    return false;
  }
  return Object.keys(value).some(
    (key) => key !== "_debug_asset" && hasDebugDisplayOutput(value[key]),
  );
}

function debugSaveNodeNotice(output: any) {
  const asset = isPlainDebugRecord(output?._debug_asset)
    ? output._debug_asset
    : null;
  const name = firstDebugText(asset?.name, asset?.title);
  const target = name ? `素材「${name}」的新版本` : "素材版本";
  return `调试模式不会真正保存；正式运行会保存为${target}，并写入团队记忆。`;
}

function isPlainDebugRecord(value: any): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function debugNodeTypeLabel(type: any) {
  const labels: Record<string, string> = {
    agent: "智能体节点",
    role: "团队角色",
    power: "能力节点",
    team: "团队工作流",
    context: "上下文节点",
    condition: "条件节点",
    merge: "合并节点",
    human_approval: "人工确认",
    save: "保存节点",
  };
  const key = String(type || "");
  return labels[key] || key;
}

function formatRunTimeRange(startedAt: any, finishedAt: any) {
  const started = parseDebugDate(startedAt);
  const finished = parseDebugDate(finishedAt);
  if (!started) {
    return "等待开始";
  }
  const parts = [`开始 ${formatDebugTime(started)}`];
  if (finished) {
    parts.push(`结束 ${formatDebugTime(finished)}`);
    parts.push(
      `耗时 ${formatStreamDuration(finished.getTime() - started.getTime())}`,
    );
  } else {
    parts.push("运行中");
  }
  return parts.join(" · ");
}

function parseDebugDate(value: any) {
  if (!value) {
    return null;
  }
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDebugTime(date: Date) {
  return date.toLocaleTimeString("zh-CN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function arrayValue(value: any): any[] {
  return Array.isArray(value) ? value : [];
}

function agentTraceByID(rows: any[]) {
  const result: Record<string, any> = {};
  rows.forEach((row) => {
    if (row?.id) {
      result[String(row.id)] = row;
    }
  });
  return result;
}

function debugRowKey(row: any, index: number) {
  return String(
    row?.id || row?.request_id || row?.key || row?.node_key || index,
  );
}

function firstDebugText(...values: any[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function buildFlowAssistantContext(flow: FlowItem): AssistantPageContext {
  return {
    scope: "modal",
    route: "bot/team/flow",
    page: {
      name: "编辑工作流",
      title: flow.name || flow.key,
    },
    form: {
      fields: flowAssistantFields(),
      values: collectFlowAssistantValues(flow),
    },
  };
}

function flowAssistantFields() {
  return THINK_ASSISTANT_FIELDS;
}

function collectFlowAssistantValues(flow: FlowItem) {
  const values: Record<string, unknown> = {};
  if (flow.name) {
    values["form.name"] = flow.name;
  }
  if (flow.goal) {
    values["form.goal"] = flow.goal;
  }
  return values;
}

function applyFlowAssistantValues(
  key: string,
  values: Record<string, unknown>,
  onChangeFlow: (key: string, patch: Partial<FlowItem>) => void,
) {
  const patch: Partial<FlowItem> = {};
  const name = readAssistantTextValue(values, "form.name");
  const goal = readAssistantTextValue(values, "form.goal");

  if (name !== undefined) {
    patch.name = name;
  }
  if (goal !== undefined) {
    patch.goal = goal;
  }
  if (Object.keys(patch).length > 0) {
    onChangeFlow(key, patch);
  }
}

function readAssistantTextValue(values: Record<string, unknown>, path: string) {
  const shortPath = path.replace(/^form\./, "");
  const value = values[path] ?? values[shortPath];
  if (value === undefined || value === null) {
    return undefined;
  }
  return typeof value === "string" ? value : JSON.stringify(value);
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-4 space-y-2 text-sm">
      <div className="font-medium">{label}</div>
      {children}
    </div>
  );
}

function resolveTeamID() {
  if (typeof window === "undefined") return 0;
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("team_id") || params.get("id") || 0);
}

function normalizeWorkspace(data: any): WorkspaceData {
  return {
    team: normalizeTeamData(data?.team),
    flows: Array.isArray(data?.flows) ? data.flows.map(normalizeFlowItem) : [],
    flow_edges: Array.isArray(data?.flow_edges) ? data.flow_edges : [],
    nodes_by_flow: data?.nodes_by_flow ?? {},
    edges_by_flow: data?.edges_by_flow ?? data?.node_edges_by_flow ?? {},
    roles: Array.isArray(data?.roles) ? data.roles : [],
    agents: Array.isArray(data?.agents) ? data.agents : [],
    agent_cates: Array.isArray(data?.agent_cates) ? data.agent_cates : [],
    teams: Array.isArray(data?.teams) ? data.teams : [],
    role_types: Array.isArray(data?.role_types) ? data.role_types : ROLE_TYPES,
    powers: Array.isArray(data?.powers) ? data.powers : [],
    power_kinds: Array.isArray(data?.power_kinds) ? data.power_kinds : [],
    node_types: Array.isArray(data?.node_types) ? data.node_types : NODE_TYPES,
    edge_conditions: Array.isArray(data?.edge_conditions)
      ? data.edge_conditions
      : EDGE_CONDITIONS,
  };
}

function normalizeTeamData(team: any) {
  const normalized = team && typeof team === "object" ? { ...team } : {};
  normalized.publish_status = normalizeTeamPublishStatus(
    normalized.publish_status,
  );
  normalized.current_release_id = Number(normalized.current_release_id || 0);
  normalized.release_version = Number(normalized.release_version || 0);
  normalized.readonly =
    Boolean(normalized.readonly) || isTeamReadonly(normalized);
  return normalized;
}

function normalizeFlowItem(flow: any): FlowItem {
  return { ...flow };
}

function normalizeTeamPublishStatus(value: unknown) {
  const status = String(value ?? "")
    .trim()
    .toLowerCase();
  if (
    status === TEAM_PUBLISH_PUBLISHED ||
    status === "已发布" ||
    status === "发布"
  ) {
    return TEAM_PUBLISH_PUBLISHED;
  }
  if (
    status === TEAM_PUBLISH_EDITING ||
    status === "编辑草稿" ||
    status === "editing_draft"
  ) {
    return TEAM_PUBLISH_EDITING;
  }
  return TEAM_PUBLISH_DRAFT;
}

function isTeamReadonly(team: Record<string, any> | undefined) {
  return (
    Boolean(team?.readonly) ||
    normalizeTeamPublishStatus(team?.publish_status) === TEAM_PUBLISH_PUBLISHED
  );
}

function teamPublishStatusLabel(status: string) {
  if (status === TEAM_PUBLISH_PUBLISHED) {
    return "已发布";
  }
  if (status === TEAM_PUBLISH_EDITING) {
    return "编辑草稿";
  }
  return "草稿";
}

function isActiveFlowListItem(
  view: ViewMode,
  selectedFlowKey: string,
  flow: FlowItem,
) {
  if (view === "node") {
    return selectedFlowKey === flow.key;
  }
  return false;
}

function workspaceNodeTypeLabel(
  type: unknown,
  nodeTypes: Array<{ id: string; value: string }>,
) {
  const id = String(type || "agent");
  if (id === "role") {
    return "团队角色";
  }
  if (id === "team") {
    return "团队工作流";
  }
  return (
    nodeTypes.find((item) => item.id === id)?.value ||
    NODE_TYPES.find((item) => item.id === id)?.value ||
    id
  );
}

function visibleNodeTypes(types: Array<{ id: string; value: string }>) {
  return types.filter((type) => VISIBLE_NODE_TYPE_IDS.has(type.id));
}

function normalizeNodesForSave(nodes: TeamNode[]) {
  return nodes.map((node) => ({
    ...node,
    role_id:
      node.type === "role"
        ? Number(node.role_id || node.config?.role_id || 0)
        : 0,
    role_key:
      node.type === "role"
        ? String(node.role_key || node.config?.role_key || "")
        : "",
    agent_id: node.type === "agent" ? node.agent_id : 0,
    power_id:
      node.type === "power"
        ? Number(node.power_id || node.config?.power_id || 0)
        : 0,
    sub_team_id:
      node.type === "team"
        ? Number(node.sub_team_id || node.config?.sub_team_id || 0)
        : 0,
    config: normalizeNodeConfigForSave(node),
  }));
}

function normalizeNodeConfigForSave(node: TeamNode) {
  const config = omitConfigKeys(node.config, [
    "task",
    "input_keys",
    "output_key",
  ]);
  if (node.type === "agent") {
    return omitConfigKeys(config, [
      "role_id",
      "role_key",
      "role_team_id",
      "role_type",
      "power_id",
      "power_key",
      "power_kind",
      "sub_team_id",
      "sub_flow_id",
      "sub_flow_key",
      "release_id",
      "operator",
      "source_key",
      "input_key",
      "value",
      "body_key",
      "content_key",
    ]);
  }
  if (node.type === "role") {
    return omitConfigKeys(config, [
      "agent_cate_id",
      "power_id",
      "power_key",
      "power_kind",
      "sub_team_id",
      "sub_flow_id",
      "sub_flow_key",
      "release_id",
      "operator",
      "source_key",
      "input_key",
      "value",
      "body_key",
      "content_key",
    ]);
  }
  if (node.type === "power") {
    return omitConfigKeys(config, [
      "goal",
      "agent_cate_id",
      "role_id",
      "role_key",
      "role_team_id",
      "role_type",
      "sub_team_id",
      "sub_flow_id",
      "sub_flow_key",
      "release_id",
      "operator",
      "source_key",
      "input_key",
      "value",
      "body_key",
      "content_key",
    ]);
  }
  if (node.type === "team") {
    return omitConfigKeys(config, [
      "goal",
      "agent_cate_id",
      "role_id",
      "role_key",
      "role_team_id",
      "role_type",
      "power_id",
      "power_key",
      "power_kind",
      "operator",
      "source_key",
      "input_key",
      "value",
      "body_key",
      "content_key",
    ]);
  }
  if (node.type === "condition") {
    return {
      ...omitConfigKeys(config, [
        "goal",
        "agent_cate_id",
        "role_id",
        "role_key",
        "role_team_id",
        "role_type",
        "power_id",
        "power_key",
        "power_kind",
        "sub_team_id",
        "sub_flow_id",
        "sub_flow_key",
        "release_id",
        "body_key",
        "content_key",
      ]),
      operator: normalizeConditionOperator(config.operator),
    };
  }
  if (node.type === "save") {
    return omitConfigKeys(config, [
      "goal",
      "agent_cate_id",
      "role_id",
      "role_key",
      "role_team_id",
      "role_type",
      "power_id",
      "power_key",
      "power_kind",
      "sub_team_id",
      "sub_flow_id",
      "sub_flow_key",
      "release_id",
      "operator",
      "source_key",
      "input_key",
      "value",
      "body_key",
      "content_key",
    ]);
  }
  return omitConfigKeys(config, [
    "goal",
    "agent_cate_id",
    "role_id",
    "role_key",
    "role_team_id",
    "role_type",
    "power_id",
    "power_key",
    "power_kind",
    "sub_team_id",
    "sub_flow_id",
    "sub_flow_key",
    "release_id",
    "operator",
    "source_key",
    "input_key",
    "value",
    "body_key",
    "content_key",
  ]);
}

function omitConfigKeys(
  config: Record<string, any> | undefined,
  keys: string[],
) {
  const next = { ...(config ?? {}) };
  keys.forEach((key) => {
    delete next[key];
  });
  return next;
}

function addNode(
  flowKey: string,
  setWorkspace: Dispatch<SetStateAction<WorkspaceData>>,
) {
  if (!flowKey) {
    toast.error("请先选择一个工作流");
    return;
  }
  const key = `node_${Date.now()}`;
  setWorkspace((current) => {
    const nodes = current.nodes_by_flow?.[flowKey] ?? [];
    return {
      ...current,
      nodes_by_flow: {
        ...(current.nodes_by_flow ?? {}),
        [flowKey]: [...nodes, createNodeItem(nodes, key)],
      },
    };
  });
}

function createFlowItem(
  flows: FlowItem[],
  key: string,
  position?: CanvasPoint,
): FlowItem {
  return {
    key,
    name: nextIndexedName("工作流", flows, (flow) => flow.name),
    goal: "",
    position: position ?? defaultGraphPosition(flows.length),
    status: 1,
    sort: (flows.length + 1) * 10,
  };
}

function createNodeItem(
  nodes: TeamNode[],
  key: string,
  position?: CanvasPoint,
): TeamNode {
  return {
    node_key: key,
    name: nextIndexedName("节点", nodes, (node) => node.name),
    type: "agent",
    role_id: 0,
    role_key: "",
    agent_id: 0,
    power_id: 0,
    sub_team_id: 0,
    config: {},
    position: position ?? defaultGraphPosition(nodes.length),
    status: 1,
    sort: (nodes.length + 1) * 10,
  };
}

function defaultGraphPosition(index: number) {
  return {
    x: 90 + (index % 4) * 280,
    y: 90 + Math.floor(index / 4) * 180,
  };
}

function nextIndexedName<T>(
  prefix: string,
  rows: T[],
  getName: (row: T) => string,
) {
  const used = new Set<number>();
  const pattern = new RegExp(`^${escapeRegExp(prefix)}(\\d+)$`);
  rows.forEach((row) => {
    const match = String(getName(row) || "")
      .trim()
      .match(pattern);
    if (match) {
      used.add(Number(match[1]));
    }
  });

  let index = 1;
  while (used.has(index)) {
    index += 1;
  }
  return `${prefix}${index}`;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function addFlowEdge(
  workspace: WorkspaceData,
  fromKey: string,
  toKey: string,
): WorkspaceData {
  if (
    fromKey === toKey ||
    (workspace.flow_edges ?? []).some(
      (edge) => edge.from_key === fromKey && edge.to_key === toKey,
    )
  ) {
    return workspace;
  }
  return {
    ...workspace,
    flow_edges: [
      ...(workspace.flow_edges ?? []),
      {
        from_key: fromKey,
        to_key: toKey,
        condition: "completed",
        status: 1,
        sort: ((workspace.flow_edges?.length ?? 0) + 1) * 10,
      },
    ],
  };
}

function addConnectedFlow(
  workspace: WorkspaceData,
  fromKey: string,
  key: string,
  position: CanvasPoint,
) {
  const flows = workspace.flows ?? [];
  if (flows.some((flow) => flow.key === key)) {
    return workspace;
  }
  return addFlowEdge(
    {
      ...workspace,
      flows: [...flows, createFlowItem(flows, key, position)],
    },
    fromKey,
    key,
  );
}

function addNodeEdge(
  workspace: WorkspaceData,
  flowKey: string,
  fromKey: string,
  toKey: string,
): WorkspaceData {
  const edges = workspace.edges_by_flow?.[flowKey] ?? [];
  if (
    fromKey === toKey ||
    edges.some((edge) => edge.from_key === fromKey && edge.to_key === toKey)
  ) {
    return workspace;
  }
  const nodes = workspace.nodes_by_flow?.[flowKey] ?? [];
  const fromNode = nodes.find((node) => node.node_key === fromKey);
  return {
    ...workspace,
    edges_by_flow: {
      ...(workspace.edges_by_flow ?? {}),
      [flowKey]: [
        ...edges,
        {
          from_key: fromKey,
          to_key: toKey,
          condition: defaultNodeEdgeCondition(fromNode?.type, edges, fromKey),
          status: 1,
          sort: (edges.length + 1) * 10,
        },
      ],
    },
  };
}

function addConnectedNode(
  workspace: WorkspaceData,
  flowKey: string,
  fromKey: string,
  key: string,
  position: CanvasPoint,
) {
  const nodes = workspace.nodes_by_flow?.[flowKey] ?? [];
  if (nodes.some((node) => node.node_key === key)) {
    return workspace;
  }
  return addNodeEdge(
    {
      ...workspace,
      nodes_by_flow: {
        ...(workspace.nodes_by_flow ?? {}),
        [flowKey]: [...nodes, createNodeItem(nodes, key, position)],
      },
    },
    flowKey,
    fromKey,
    key,
  );
}

function defaultNodeEdgeCondition(
  fromNodeType: string | undefined,
  edges: NodeEdge[],
  fromKey: string,
) {
  const outgoing = new Set(
    edges
      .filter((edge) => edge.from_key === fromKey)
      .map((edge) => String(edge.condition || "")),
  );
  if (fromNodeType === "condition") {
    return outgoing.has("passed") ? "failed" : "passed";
  }
  if (fromNodeType === "human_approval") {
    return outgoing.has("approved") ? "rejected" : "approved";
  }
  return "always";
}

function updateFlow(
  workspace: WorkspaceData,
  key: string,
  patch: Partial<FlowItem>,
): WorkspaceData {
  return {
    ...workspace,
    flows: (workspace.flows ?? []).map((flow) =>
      flow.key === key ? { ...flow, ...patch } : flow,
    ),
  };
}

function reorderFlows(
  workspace: WorkspaceData,
  fromKey: string,
  toKey: string,
): WorkspaceData {
  const flows = [...(workspace.flows ?? [])];
  const fromIndex = flows.findIndex((flow) => flow.key === fromKey);
  const toIndex = flows.findIndex((flow) => flow.key === toKey);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return workspace;
  }
  const [moved] = flows.splice(fromIndex, 1);
  flows.splice(toIndex, 0, moved);
  return {
    ...workspace,
    flows: flows.map((flow, index) => ({
      ...flow,
      sort: (index + 1) * 10,
    })),
  };
}

function updateNode(
  workspace: WorkspaceData,
  flowKey: string,
  key: string,
  patch: Partial<TeamNode>,
): WorkspaceData {
  const nodes = workspace.nodes_by_flow?.[flowKey] ?? [];
  return {
    ...workspace,
    nodes_by_flow: {
      ...(workspace.nodes_by_flow ?? {}),
      [flowKey]: nodes.map((node) =>
        node.node_key === key ? { ...node, ...patch } : node,
      ),
    },
  };
}

function updateNodeEdge(
  workspace: WorkspaceData,
  flowKey: string,
  index: number,
  patch: Partial<NodeEdge>,
): WorkspaceData {
  const edges = workspace.edges_by_flow?.[flowKey] ?? [];
  return {
    ...workspace,
    edges_by_flow: {
      ...(workspace.edges_by_flow ?? {}),
      [flowKey]: edges.map((edge, currentIndex) =>
        currentIndex === index ? { ...edge, ...patch } : edge,
      ),
    },
  };
}

function removeGraphSelection(
  workspace: WorkspaceData,
  selection: Exclude<Selection, null>,
  flowKey: string,
): WorkspaceData {
  if (selection.kind === "flow") {
    const nodesByFlow = { ...(workspace.nodes_by_flow ?? {}) };
    const edgesByFlow = { ...(workspace.edges_by_flow ?? {}) };
    delete nodesByFlow[selection.key];
    delete edgesByFlow[selection.key];
    return {
      ...workspace,
      flows: (workspace.flows ?? []).filter(
        (flow) => flow.key !== selection.key,
      ),
      flow_edges: (workspace.flow_edges ?? []).filter(
        (edge) =>
          edge.from_key !== selection.key && edge.to_key !== selection.key,
      ),
      nodes_by_flow: nodesByFlow,
      edges_by_flow: edgesByFlow,
    };
  }

  if (selection.kind === "flow_edge") {
    return {
      ...workspace,
      flow_edges: (workspace.flow_edges ?? []).filter(
        (_edge, index) => index !== selection.index,
      ),
    };
  }

  if (selection.kind === "node") {
    const nodes = workspace.nodes_by_flow?.[flowKey] ?? [];
    const edges = workspace.edges_by_flow?.[flowKey] ?? [];
    return {
      ...workspace,
      nodes_by_flow: {
        ...(workspace.nodes_by_flow ?? {}),
        [flowKey]: nodes.filter((node) => node.node_key !== selection.key),
      },
      edges_by_flow: {
        ...(workspace.edges_by_flow ?? {}),
        [flowKey]: edges.filter(
          (edge) =>
            edge.from_key !== selection.key && edge.to_key !== selection.key,
        ),
      },
    };
  }

  const edges = workspace.edges_by_flow?.[flowKey] ?? [];
  return {
    ...workspace,
    edges_by_flow: {
      ...(workspace.edges_by_flow ?? {}),
      [flowKey]: edges.filter((_edge, index) => index !== selection.index),
    },
  };
}
