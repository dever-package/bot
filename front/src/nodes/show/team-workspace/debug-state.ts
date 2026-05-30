import type { CSSProperties } from "react";
import type {
  AgentInteraction,
  AgentInteractionSubmitResult,
} from "@/components/agent/interaction-panel";
import {
  assistantReferencePayload,
  type AssistantReferenceFile,
} from "@/lib/assistant/reference";
import {
  createRuntimeStreamTiming,
  formatStreamDuration,
  isStreamTimingRunning,
  streamTimingPercentFromOutput,
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
import type {
  DebugPendingApproval,
  GraphExecutionState,
  NodeEdge,
  TeamNode,
  DebugNodeTimingContext,
} from "./types";
import {
  DEBUG_CLIENT_STARTED_AT,
  DEBUG_STREAM_BLOCK_MS,
  DEBUG_STREAM_LAST_ID,
  NODE_TYPES,
  RUN_STATUS_CANCELED,
  RUN_STATUS_FAIL,
  RUN_STATUS_PENDING,
  RUN_STATUS_RUNNING,
  RUN_STATUS_SUCCESS,
  RUN_STATUS_WAITING,
} from "./constants";

export function buildDebugInput(
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

export function buildDebugPreparingStatus(input: Record<string, any>) {
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

export function buildDebugStartStatus(
  startData: any,
  input: Record<string, any>,
) {
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

export async function watchDebugStream(
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

export function withDebugStreamCursor(
  current: any,
  frame: RuntimeStreamFrame<any>,
) {
  const streamID = String(frame?.stream_id || "");
  if (!streamID) {
    return current;
  }
  return {
    ...current,
    [DEBUG_STREAM_LAST_ID]: streamID,
  };
}

export function applyDebugStreamFrame(
  current: any,
  frame: RuntimeStreamFrame<any>,
) {
  const output = frame?.output;
  if (frame?.type === "result" && isDebugRunStatusPayload(output)) {
    return mergeDebugRunStatusPayload(current, output);
  }
  if (!isPlainDebugRecord(output)) {
    return current;
  }
  return applyDebugStreamEvent(current, output);
}

export function mergeDebugRunStatusPayload(current: any, payload: any) {
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

export function mergeDebugRowsFromPayload(
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

export function isDebugRunStatusPayload(value: any) {
  return Boolean(
    isPlainDebugRecord(value) &&
    (isPlainDebugRecord(value.run) ||
      Array.isArray(value.flow_runs) ||
      Array.isArray(value.node_runs)),
  );
}

export function applyDebugStreamEvent(
  current: any,
  event: Record<string, any>,
) {
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

export function cloneDebugRunStatus(value: any) {
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

export function isRunLevelDebugEvent(event: any) {
  return ["run_started", "run_finished", "waiting"].includes(
    String(event || ""),
  );
}

export function mergeDebugRunFromEvent(
  current: any,
  event: Record<string, any>,
) {
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

export function debugFlowRunFromEvent(event: Record<string, any>) {
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

export function debugNodeRunFromEvent(event: Record<string, any>) {
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

export function compactDebugRow(row: Record<string, any>) {
  const result: Record<string, any> = {};
  Object.entries(row).forEach(([key, value]) => {
    if (hasDebugStreamValue(value)) {
      result[key] = value;
    }
  });
  return result;
}

export function upsertDebugRow(
  rows: any[],
  row: Record<string, any>,
  keys: string[],
) {
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

export function mergeDebugRow(current: any, row: Record<string, any>) {
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

export function ensureDebugClientStartedAt(row: Record<string, any>) {
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

export function shouldTrackDebugClientStartedAt(row: Record<string, any>) {
  const status = String(row?.status || "");
  return (
    status === RUN_STATUS_RUNNING ||
    status === RUN_STATUS_WAITING ||
    hasDebugStreamValue(row?.started_at)
  );
}

export function assignDebugValue(
  target: Record<string, any>,
  key: string,
  value: any,
) {
  if (hasDebugStreamValue(value)) {
    target[key] = value;
  }
}

export function hasDebugStreamValue(value: any) {
  if (value == null || value === "") {
    return false;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return true;
}

export function buildPendingDebugApprovalsByNodeKey(
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

export function pendingDebugApprovalFromApproval(
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

export function pendingDebugApprovalFromNodeRun(
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

export function debugApprovalKindFromNodeRun(
  row: any,
  interaction: AgentInteraction,
) {
  const nodeType = String(row?.node_type || "");
  if (nodeType === "human_approval") {
    return "human_approval";
  }
  if (String(interaction?.type || "") === "power_params") {
    return "power";
  }
  return "agent_interaction";
}

export function normalizeDebugApprovalInteraction(
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

export function markDebugApprovalSubmitted(
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

export function markDebugRunResumed(current: any, data: any) {
  const next = cloneDebugRunStatus(current);
  next.run = {
    ...(next.run || {}),
    id: Number(data?.run_id || next.run?.id || 0),
    request_id: String(data?.request_id || next.run?.request_id || ""),
    status: String(data?.status || RUN_STATUS_RUNNING),
  };
  return next;
}

export function debugRecord(value: any): Record<string, any> {
  return isPlainDebugRecord(value) ? value : {};
}

export function runStatusLabel(status: string) {
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

export function debugVisibleNodeError(row: any) {
  if (!row?.error || String(row?.status || "") === RUN_STATUS_SUCCESS) {
    return "";
  }
  return String(row.error);
}

export function debugStatusClass(status: string) {
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

export function buildGraphExecutionState(
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

export function graphExecutionEdgeKey(
  edge: Pick<NodeEdge, "from_key" | "to_key">,
  index: number,
) {
  return `${edge.from_key}->${edge.to_key}:${index}`;
}

export function graphExecutionCardStyle(
  status: string,
): CSSProperties | undefined {
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

export function graphExecutionBadgeClass(status: string) {
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

export function graphExecutionStatusLabel(status: string, nodeType?: string) {
  if (isDebugActiveStatus(status)) {
    return "执行中";
  }
  return debugNodeStatusLabel(status, nodeType);
}

export function debugNodeStatusLabel(status: string, nodeType?: string) {
  if (
    status === RUN_STATUS_WAITING &&
    String(nodeType || "") === "human_approval"
  ) {
    return "等待人工确认";
  }
  return runStatusLabel(status);
}

export function sortDebugRunRows(rows: any[]) {
  return [...rows].sort(compareDebugRunRows);
}

export function compareDebugRunRows(left: any, right: any) {
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

export function debugSortDate(value: any) {
  return parseDebugDate(value)?.getTime() ?? Number.MAX_SAFE_INTEGER;
}

export function isDebugActiveStatus(status: any) {
  return String(status || "") === RUN_STATUS_RUNNING;
}

export function shouldShowRuntimeTiming(nodeType: string) {
  return (
    nodeType === "agent" ||
    nodeType === "role" ||
    nodeType === "power" ||
    nodeType === "team"
  );
}

export function isDebugNodeTimingActive(row: any, agentTrace: any) {
  const timing = shouldShowRuntimeTiming(String(row?.node_type || ""))
    ? debugNodeTiming(row, agentTrace)
    : undefined;
  return isStreamTimingRunning(timing) || isDebugActiveStatus(row?.status);
}

export function debugNodeTiming(
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

export function debugNodeTimingLabel(
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

export function debugTeamWorkflowTimingLabel(
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

export function teamNodeSubFlowID(node?: TeamNode) {
  return Number(node?.config?.sub_flow_id || node?.config?.flow_id || 0);
}

export function lastTraceStreamOutput(trace: any) {
  const entries = arrayValue(trace?.stream);
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const output = entries[index]?.payload?.output;
    if (hasDebugDisplayOutput(output)) {
      return output;
    }
  }
  return undefined;
}

export function debugNodeDisplayOutput(row: any, agentTrace: any) {
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

export function debugMergeNodeDisplayOutput(value: any) {
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

export function debugMergeSourceDisplayOutput(source: any) {
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

export function debugMergeSectionOutput(
  title: string,
  key: string,
  value: any,
) {
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

export function debugMergeMetaText(meta: any) {
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

export function debugWorkflowDisplayOutput(value: any) {
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

export function debugSubmittedApprovalOutput(value: any) {
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

export function debugApprovalDecisionText(value: Record<string, any>) {
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

export function compactSubmittedApprovalData(data: Record<string, any>) {
  const result: Record<string, any> = {};
  Object.entries(data).forEach(([key, item]) => {
    if (["interaction", "output", "params", "text"].includes(key)) {
      return;
    }
    result[key] = item;
  });
  return result;
}

export function firstDebugOutputValue(...values: any[]) {
  for (const value of values) {
    const output = normalizeDebugResultOutput(stripDebugMetadata(value));
    if (hasDebugDisplayOutput(output)) {
      return output;
    }
  }
  return undefined;
}

export function normalizeDebugResultOutput(value: any): any {
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

export function firstDebugNestedOutputValue(value: Record<string, any>) {
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

export function normalizeDebugAgentResultPayload(
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

export function normalizeDebugAgentContent(
  value: any,
): Record<string, any> | null {
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

export function copyDebugResultOutputFields(
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

export function hasDebugResultValue(value: any) {
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

export function debugAgentResultText(value: any): string {
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

export function firstDebugRunLabel(...values: any[]) {
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

export function debugAgentResultTitle(value: any) {
  if (!isPlainDebugRecord(value)) {
    return "";
  }
  const content = isPlainDebugRecord(value.content) ? value.content : {};
  return firstDebugText(value.title, content.title);
}

export function extractDebugAgentResultPayload(text: string):
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

export function extractDebugAgentResultPayloadByLang(
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

export function parseDebugAgentResultPayload(value: string) {
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

export function isDebugAgentResultPayload(
  value: any,
): value is Record<string, any> {
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

export function repairDebugJSONControlChars(value: string) {
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

export function escapeDebugJSONControlChar(value: string) {
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

export function isDebugFenceWhitespace(value: string) {
  return value === " " || value === "\t" || value === "\r" || value === "\n";
}

export function stripDebugMetadata(value: any): any {
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

export function hasDebugDisplayOutput(value: any): boolean {
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

export function debugSaveNodeNotice(output: any) {
  const asset = isPlainDebugRecord(output?._debug_asset)
    ? output._debug_asset
    : null;
  const name = firstDebugText(asset?.name, asset?.title);
  const target = name ? `素材「${name}」的新版本` : "素材版本";
  return `调试模式不会真正保存；正式运行会保存为${target}，并写入团队记忆。`;
}

export function isPlainDebugRecord(value: any): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function debugNodeTypeLabel(type: any) {
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

export function formatRunTimeRange(startedAt: any, finishedAt: any) {
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

export function parseDebugDate(value: any) {
  if (!value) {
    return null;
  }
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDebugTime(date: Date) {
  return date.toLocaleTimeString("zh-CN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function arrayValue(value: any): any[] {
  return Array.isArray(value) ? value : [];
}

export function agentTraceByID(rows: any[]) {
  const result: Record<string, any> = {};
  rows.forEach((row) => {
    if (row?.id) {
      result[String(row.id)] = row;
    }
  });
  return result;
}

export function debugRowKey(row: any, index: number) {
  return String(
    row?.id || row?.request_id || row?.key || row?.node_key || index,
  );
}

export function firstDebugText(...values: any[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}
