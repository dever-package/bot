import { normalizeRuntimeRunStatus } from "../../../runtime/team-run";

export type CanvasRunRef = {
  execution_id?: number;
  run_id?: number;
  request_id?: string;
  asset_cate_id?: number;
  start_node_id?: string;
  flow_run_id?: number;
  release_id?: number;
  status?: string;
  error?: string;
  executed?: number;
  total?: number;
  single_node?: boolean;
  created_at?: string;
  updated_at?: string;
  title?: string;
  output?: unknown;
  approvals?: any[];
  interactions?: any[];
  node_results?: CanvasNodeResultRef[];
  pending_node?: CanvasNodeResultRef | null;
  node_runs?: CanvasNodeRunRef[];
  execution_plan?: CanvasExecutionPlanRef | null;
};

export type CanvasNodeRunRef = {
  node_run_id?: number;
  node_id?: number;
  node_key?: string;
  node_type?: string;
  status?: string;
  persists_result?: boolean;
};

export type CanvasNodeResultRef = {
  execution_id?: number;
  node_key: string;
  node_type?: string;
  node_run_id?: number;
  run_id?: number;
  request_id?: string;
  child_run_id?: number;
  child_request_id?: string;
  status?: string;
  error?: string;
  output?: unknown;
  asset?: any;
  version?: any;
  result?: any;
  approval?: any;
  interaction?: any;
  persists_result?: boolean;
  agent_run_id?: number;
  source_signature?: string;
};

export type CanvasExecutionPlanRef = {
  nodes: CanvasExecutionPlanNodeRef[];
  edges: CanvasExecutionPlanEdgeRef[];
  incoming: Map<string, string[]>;
  outgoing: Map<string, string[]>;
  order: string[];
};

export type CanvasExecutionPlanNodeRef = {
  id: string;
  type: string;
  title: string;
  kind?: string;
  output_type?: string;
  group_id?: string;
  function_key: string;
  asset_cate_id: number;
  persists_result: boolean;
  stops_flow: boolean;
};

export type CanvasExecutionPlanEdgeRef = {
  id: string;
  source: string;
  target: string;
};

export function canvasRunIdentity(run: CanvasRunRef) {
  const executionId = Number(run.execution_id || 0);
  if (executionId > 0) {
    return `execution:${executionId}`;
  }
  const runId = Number(run.run_id || 0);
  if (runId > 0) {
    return `run:${runId}`;
  }
  return `request:${String(run.request_id || "")}`;
}

export function isActiveCanvasRun(run: CanvasRunRef) {
  const status = String(run.status || "").trim();
  if (!status) {
    return false;
  }
  const normalized = normalizeRuntimeRunStatus(status);
  return (
    normalized === "pending" ||
    normalized === "running" ||
    normalized === "waiting"
  );
}

export function normalizeCanvasRunRef(value: any): CanvasRunRef {
  const output =
    value?.output && typeof value.output === "object" ? value.output : {};
  const run = value?.run && typeof value.run === "object" ? value.run : {};
  return {
    execution_id: Number(value?.execution_id || 0),
    run_id: Number(value?.run_id || run.id || 0),
    request_id: String(value?.request_id || run.request_id || ""),
    asset_cate_id: Number(value?.asset_cate_id || 0),
    start_node_id: String(value?.start_node_id || ""),
    flow_run_id: Number(value?.flow_run_id || run.flow_run_id || 0),
    release_id: Number(value?.release_id || run.release_id || 0),
    status: normalizeRuntimeRunStatus(value?.status || run.status),
    error: canvasErrorText(value?.error || run.error),
    executed: Number(value?.executed || value?.output?.executed || 0),
    total: Number(value?.total || value?.output?.total || 0),
    single_node: Boolean(value?.single_node),
    created_at: String(value?.created_at || ""),
    updated_at: String(value?.updated_at || ""),
    title: String(value?.title || ""),
    output: value?.output || run.output,
    approvals: Array.isArray(value?.approvals)
      ? value.approvals
      : Array.isArray(value?.data?.approvals)
        ? value.data.approvals
        : [],
    interactions: Array.isArray(value?.interactions)
      ? value.interactions
      : Array.isArray(value?.data?.interactions)
        ? value.data.interactions
        : [],
    node_results: normalizeCanvasNodeResultRefs(
      value?.node_results || output.node_results,
    ),
    pending_node: normalizeCanvasNodeResultRef(
      value?.pending_node || output.pending_node,
    ),
    execution_plan: normalizeCanvasExecutionPlanRef(value?.execution_plan),
    node_runs: Array.isArray(value?.node_runs)
      ? value.node_runs
          .map(normalizeCanvasNodeRunRef)
          .filter((item): item is CanvasNodeRunRef => Boolean(item))
      : [],
  };
}

function normalizeCanvasNodeResultRef(value: any): CanvasNodeResultRef | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const nodeKey = String(value.node_key || "");
  if (!nodeKey) {
    return null;
  }
  return {
    node_key: nodeKey,
    execution_id: Number(value.execution_id || 0),
    node_type: String(value.node_type || ""),
    node_run_id: Number(value.node_run_id || 0),
    run_id: Number(value.run_id || 0),
    request_id: String(value.request_id || ""),
    child_run_id: Number(value.child_run_id || 0),
    child_request_id: String(value.child_request_id || ""),
    status: normalizeRuntimeRunStatus(value.status),
    error: canvasErrorText(value.error),
    output: value.output,
    asset: value.asset,
    version: value.version,
    result: value.result,
    approval: value.approval,
    interaction: value.interaction,
    persists_result: Boolean(value.persists_result),
    agent_run_id: Number(value.agent_run_id || 0),
    source_signature: String(value.source_signature || ""),
  };
}

function normalizeCanvasNodeResultRefs(value: any): CanvasNodeResultRef[] {
  return Array.isArray(value)
    ? value
        .map(normalizeCanvasNodeResultRef)
        .filter((item): item is CanvasNodeResultRef => Boolean(item))
    : [];
}

export function normalizeCanvasNodeResultPayload(
  value: any,
  expectedNodeKey = "",
): CanvasNodeResultRef | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const nodeKey = String(expectedNodeKey || "").trim();
  const nestedResults = normalizeCanvasNodeResultRefs(value.node_results);
  const nestedResult = nodeKey
    ? nestedResults.find((item) => item.node_key === nodeKey)
    : nestedResults[0];
  if (nestedResult) {
    return nestedResult;
  }
  return normalizeCanvasNodeResultRef(
    nodeKey && !String(value.node_key || "").trim()
      ? { ...value, node_key: nodeKey }
      : value,
  );
}

export function canvasNodeResultRawError(
  result?: CanvasNodeResultRef | null,
) {
  if (!result) {
    return "";
  }
  return preferredCanvasErrorText(
    result.error,
    (result.result as any)?.error,
    (result.output as any)?.error,
  );
}

export function canvasRunRawError(run?: CanvasRunRef | null) {
  if (!run) {
    return "";
  }
  const failedResult = [...(run.node_results || [])]
    .reverse()
    .find((result) => {
      const status = normalizeRuntimeRunStatus(
        result.status || (result.result as any)?.status,
      );
      return status === "fail";
    });
  return preferredCanvasErrorText(
    canvasNodeResultRawError(failedResult),
    (run.output as any)?.error,
    run.error,
  );
}

export function canvasNodeResultErrorMessage(
  result?: CanvasNodeResultRef | null,
  fallback = "节点运行失败",
) {
  return canvasExecutionErrorMessage(
    canvasNodeResultRawError(result),
    fallback,
  );
}

export function canvasRunErrorMessage(
  run?: CanvasRunRef | null,
  fallback = "画布运行失败",
) {
  return canvasExecutionErrorMessage(canvasRunRawError(run), fallback);
}

export function canvasExecutionErrorMessage(
  error: unknown,
  fallback = "运行失败",
) {
  const raw = canvasErrorText(error);
  if (!raw) {
    return fallback;
  }
  if (
    raw.includes("InputImageSensitiveContentDetected") ||
    raw.includes("PrivacyInformation")
  ) {
    return "参考图片可能包含真人或隐私信息，请更换参考图后重试。";
  }
  if (raw.includes("资产当前版本已变化")) {
    return "引用的资产版本已变化，请刷新画布后重试。";
  }
  return raw.length > 500 ? `${raw.slice(0, 497)}...` : raw;
}

function firstCanvasErrorText(...values: unknown[]) {
  for (const value of values) {
    const text = canvasErrorText(value);
    if (text) {
      return text;
    }
  }
  return "";
}

const genericCanvasErrorMessages = new Set([
  "画布运行失败",
  "节点运行失败",
  "节点执行失败",
  "运行失败",
  "执行出错",
]);

export function isGenericCanvasErrorMessage(error: unknown) {
  return genericCanvasErrorMessages.has(canvasErrorText(error));
}

function preferredCanvasErrorText(...values: unknown[]) {
  let fallback = "";
  for (const value of values) {
    const text = canvasErrorText(value);
    if (!text) {
      continue;
    }
    fallback ||= text;
    if (!genericCanvasErrorMessages.has(text)) {
      return text;
    }
  }
  return fallback;
}

function canvasErrorText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (value instanceof Error) {
    return value.message.trim();
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "";
  }
  const record = value as Record<string, unknown>;
  const nested = firstCanvasErrorText(record.error, record.message, record.msg);
  if (nested) {
    return nested;
  }
  const code = canvasErrorText(record.code);
  const message = canvasErrorText(record.detail);
  return [code, message].filter(Boolean).join(": ");
}

function normalizeCanvasExecutionPlanRef(
  value: any,
): CanvasExecutionPlanRef | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const nodes = Array.isArray(value.nodes)
    ? value.nodes
        .map(normalizeCanvasExecutionPlanNodeRef)
        .filter(
          (node): node is CanvasExecutionPlanNodeRef => Boolean(node),
        )
    : [];
  const edges = Array.isArray(value.edges)
    ? value.edges
        .map(normalizeCanvasExecutionPlanEdgeRef)
        .filter(
          (edge): edge is CanvasExecutionPlanEdgeRef => Boolean(edge),
        )
    : [];
  return {
    nodes,
    edges,
    incoming: normalizePlanAdjacency(value.incoming),
    outgoing: normalizePlanAdjacency(value.outgoing),
    order: Array.isArray(value.order)
      ? value.order.map((item: any) => String(item || "")).filter(Boolean)
      : nodes.map((node: CanvasExecutionPlanNodeRef) => node.id),
  };
}

function normalizeCanvasExecutionPlanNodeRef(
  value: any,
): CanvasExecutionPlanNodeRef | null {
  const id = String(value?.id || "");
  if (!id) {
    return null;
  }
  return {
    id,
    type: String(value?.type || ""),
    title: String(value?.title || ""),
    kind: String(value?.kind || ""),
    output_type: String(value?.output_type || ""),
    group_id: String(value?.group_id || ""),
    function_key: String(value?.function_key || ""),
    asset_cate_id: Number(value?.asset_cate_id || 0),
    persists_result: Boolean(value?.persists_result),
    stops_flow: Boolean(value?.stops_flow),
  };
}

function normalizeCanvasExecutionPlanEdgeRef(
  value: any,
): CanvasExecutionPlanEdgeRef | null {
  const source = String(value?.source || "");
  const target = String(value?.target || "");
  if (!source || !target) {
    return null;
  }
  return {
    id: String(value?.id || `${source}-${target}`),
    source,
    target,
  };
}

function normalizePlanAdjacency(value: any) {
  const result = new Map<string, string[]>();
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return result;
  }
  for (const [key, row] of Object.entries(value)) {
    const items = Array.isArray(row)
      ? row.map((item) => String(item || "")).filter(Boolean)
      : [];
    result.set(String(key), items);
  }
  return result;
}

function normalizeCanvasNodeRunRef(value: any): CanvasNodeRunRef | null {
  const nodeKey = String(value?.node_key || "");
  const nodeRunId = Number(value?.node_run_id || 0);
  if (!nodeKey || nodeRunId <= 0) {
    return null;
  }
  return {
    node_run_id: nodeRunId,
    node_id: Number(value?.node_id || 0),
    node_key: nodeKey,
    node_type: String(value?.node_type || ""),
    status: normalizeRuntimeRunStatus(value?.status),
    persists_result: Boolean(value?.persists_result),
  };
}
