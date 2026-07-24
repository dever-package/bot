import type {
  RuntimeRunRef,
  RuntimeRunSnapshot,
  RuntimeRunStatus,
} from "./types";

const STATUS_ALIASES: Record<string, RuntimeRunStatus> = {
  pending: "pending",
  queued: "pending",
  queue: "pending",
  running: "running",
  run: "running",
  started: "running",
  starting: "running",
  processing: "running",
  active: "running",
  executing: "running",
  execute: "running",
  in_progress: "running",
  "in-progress": "running",
  waiting: "waiting",
  wait: "waiting",
  success: "success",
  succeeded: "success",
  done: "success",
  completed: "success",
  complete: "success",
  fail: "fail",
  failed: "fail",
  failure: "fail",
  error: "fail",
  canceled: "canceled",
  cancelled: "canceled",
};

export function normalizeRuntimeRunStatus(value: unknown): RuntimeRunStatus {
  const status = String(value || "").trim().toLowerCase();
  return STATUS_ALIASES[status] || "pending";
}

export function runtimeRunStatusFromEvent(
  event: Record<string, unknown>,
  value?: unknown,
): RuntimeRunStatus {
  if (String(value || "").trim()) {
    return normalizeRuntimeRunStatus(value);
  }
  const eventName = String(event.event || event.type || "")
    .trim()
    .toLowerCase();
  if (eventName.includes("cancel")) {
    return "canceled";
  }
  if (eventName.includes("fail") || eventName.includes("error")) {
    return "fail";
  }
  if (eventName.includes("wait")) {
    return "waiting";
  }
  if (
    eventName.includes("finish") ||
    eventName.includes("success") ||
    eventName.includes("complete")
  ) {
    return "success";
  }
  if (
    eventName.includes("start") ||
    eventName.includes("progress") ||
    eventName.includes("running")
  ) {
    return "running";
  }
  return "pending";
}

export function isRuntimeRunActive(value: unknown) {
  const status = normalizeRuntimeRunStatus(value);
  return status === "pending" || status === "running";
}

export function isRuntimeRunBlocking(value: unknown) {
  return normalizeRuntimeRunStatus(value) === "waiting";
}

export function isRuntimeRunTerminal(value: unknown) {
  const status = normalizeRuntimeRunStatus(value);
  return status === "success" || status === "fail" || status === "canceled";
}

export function normalizeRuntimeRunSnapshot(value: any): RuntimeRunSnapshot {
  const source = value && typeof value === "object" ? value : {};
  const rawRun =
    source.run && typeof source.run === "object" ? source.run : source;
  const run: RuntimeRunRef = {
    ...rawRun,
    id: Number(rawRun.id || source.run_id || 0),
    request_id: String(rawRun.request_id || source.request_id || ""),
    status: normalizeRuntimeRunStatus(rawRun.status || source.status),
    error: String(rawRun.error || source.error || ""),
  };
  return {
    ...source,
    view: String(source.view || ""),
    run,
    flow_runs: normalizeRuntimeRows(source.flow_runs, "status"),
    node_runs: normalizeRuntimeRows(source.node_runs, "status"),
    interactions: arrayValue(source.interactions),
    approvals: arrayValue(source.approvals),
    ...(Array.isArray(source.agent_runs)
      ? { agent_runs: source.agent_runs }
      : {}),
    ...(Array.isArray(source.blackboard)
      ? { blackboard: source.blackboard }
      : {}),
    ...(Array.isArray(source.messages) ? { messages: source.messages } : {}),
  };
}

export function mergeRuntimeRunSnapshot(
  currentValue: unknown,
  nextValue: unknown,
): RuntimeRunSnapshot {
  const current = normalizeRuntimeRunSnapshot(currentValue);
  const next = normalizeRuntimeRunSnapshot(nextValue);
  return {
    ...current,
    ...next,
    run: {
      ...current.run,
      ...next.run,
    },
    flow_runs: mergeRuntimeRows(current.flow_runs, next.flow_runs),
    node_runs: mergeRuntimeRows(current.node_runs, next.node_runs),
    interactions: next.interactions || current.interactions || [],
    approvals: next.approvals || current.approvals || [],
    agent_runs: next.agent_runs || current.agent_runs,
    blackboard: next.blackboard || current.blackboard,
    messages: next.messages || current.messages,
  };
}

function normalizeRuntimeRows(value: unknown, statusKey: string) {
  return arrayValue(value).map((row) => ({
    ...row,
    [statusKey]: normalizeRuntimeRunStatus(row?.[statusKey]),
  }));
}

function mergeRuntimeRows(
  currentRows: Record<string, any>[] = [],
  nextRows: Record<string, any>[] = [],
) {
  if (nextRows.length === 0) {
    return currentRows;
  }
  const currentByKey = new Map(
    currentRows.map((row) => [runtimeRowKey(row), row] as const),
  );
  return nextRows.map((row) => ({
    ...(currentByKey.get(runtimeRowKey(row)) || {}),
    ...row,
  }));
}

function runtimeRowKey(row: Record<string, any>) {
  return String(
    row.id || row.node_run_id || row.flow_run_id || row.node_key || row.flow_id,
  );
}

function arrayValue(value: unknown): Record<string, any>[] {
  return Array.isArray(value)
    ? value.filter(
        (row): row is Record<string, any> =>
          Boolean(row) && typeof row === "object" && !Array.isArray(row),
      )
    : [];
}
