import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  Loader2,
  Network,
  Plus,
  Save,
  SquarePen,
  Workflow,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { request } from "@/lib/request";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { AssistantTaskPopover } from "@/components/assistant/task-popover";
import type { AgentInteractionSubmitResult } from "@/components/agent/interaction-panel";
import type { AssistantReferenceFile } from "@/lib/assistant/reference";
import type { NodeItemProps } from "@/page/nodes";
import { Canvas } from "./team-workspace/canvas";
import {
  DebugDialog,
  DebugNodeResultDialog,
} from "./team-workspace/debug-panel";
import {
  buildDebugInput,
  buildDebugPreparingStatus,
  buildDebugStartStatus,
  buildGraphExecutionState,
  buildPendingDebugApprovalsByNodeKey,
  markDebugApprovalSubmitted,
  markDebugRunResumed,
  watchDebugStream,
} from "./team-workspace/debug-state";
import {
  EditorDialog,
  deleteDialogDescription,
  deleteDialogTitle,
} from "./team-workspace/editor";
import {
  addConnectedFlow,
  addConnectedNode,
  addFlowEdge,
  addNode,
  addNodeEdge,
  buildTeamBindingOptions,
  createFlowItem,
  isActiveFlowListItem,
  isTeamReadonly,
  normalizeNodesForSave,
  normalizeTeamPublishStatus,
  normalizeWorkspace,
  removeGraphSelection,
  reorderFlows,
  teamPublishStatusLabel,
  updateFlow,
  updateNode,
  updateNodeEdge,
  visibleNodeTypes,
} from "./team-workspace/graph-state";
import {
  EDGE_CONDITIONS,
  NODE_TYPES,
  ROLE_TYPES,
} from "./team-workspace/constants";
import type {
  ConnectState,
  DebugPendingApproval,
  DebugTarget,
  FlowItem,
  Selection,
  ViewMode,
  WorkspaceData,
} from "./team-workspace/types";

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
  const assetCates = workspace.asset_cates ?? [];
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
      buildPendingDebugApprovalsByNodeKey(debugResult, hiddenDebugApprovalIds),
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
      setDebugResult((current: any) =>
        current ? { ...current, error: message } : { error: message },
      );
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
        assetCates={assetCates}
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

function resolveTeamID() {
  if (typeof window === "undefined") return 0;
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("team_id") || params.get("id") || 0);
}
