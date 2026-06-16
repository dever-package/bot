export type CanvasRunRef = {
  execution_id?: number;
  run_id?: number;
  request_id?: string;
  asset_cate_id?: number;
  start_node_id?: string;
  flow_run_id?: number;
  release_id?: number;
  status?: string;
  executed?: number;
  output?: unknown;
  approvals?: any[];
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
  output?: unknown;
  asset?: any;
  version?: any;
  result?: any;
  approval?: any;
  persists_result?: boolean;
  agent_run_id?: number;
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

export function normalizeCanvasRunRef(value: any): CanvasRunRef {
  const output = value?.output && typeof value.output === "object" ? value.output : {};
  const run = value?.run && typeof value.run === "object" ? value.run : {};
  return {
    execution_id: Number(value?.execution_id || 0),
    run_id: Number(value?.run_id || run.id || 0),
    request_id: String(value?.request_id || run.request_id || ""),
    asset_cate_id: Number(value?.asset_cate_id || 0),
    start_node_id: String(value?.start_node_id || ""),
    flow_run_id: Number(value?.flow_run_id || run.flow_run_id || 0),
    release_id: Number(value?.release_id || run.release_id || 0),
    status: String(value?.status || run.status || ""),
    executed: Number(value?.executed || value?.output?.executed || 0),
    output: value?.output || run.output,
    approvals: Array.isArray(value?.approvals)
      ? value.approvals
      : Array.isArray(value?.data?.approvals)
        ? value.data.approvals
        : [],
    node_results: Array.isArray(value?.node_results || output.node_results)
      ? (value.node_results || output.node_results)
          .map(normalizeCanvasNodeResultRef)
          .filter((item): item is CanvasNodeResultRef => Boolean(item))
      : [],
    pending_node: normalizeCanvasNodeResultRef(value?.pending_node || output.pending_node),
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
    status: String(value.status || ""),
    output: value.output,
    asset: value.asset,
    version: value.version,
    result: value.result,
    approval: value.approval,
    persists_result: Boolean(value.persists_result),
    agent_run_id: Number(value.agent_run_id || 0),
  };
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
    status: String(value?.status || ""),
    persists_result: Boolean(value?.persists_result),
  };
}
