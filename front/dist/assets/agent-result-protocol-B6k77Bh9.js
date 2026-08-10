import { m as l } from "./runtime-stream-runner-BrsTPWU1.js";
const g = l.watchRuntimeStream;
async function p(n) {
  let e = n.initialState;
  const r = await g({
    streamApi: n.streamApi,
    requestID: n.requestID,
    lastID: n.lastID || "0-0",
    blockMs: n.blockMs || 15e3,
    signal: n.signal,
    stopOnResult: !0,
    acceptErrorResult: n.acceptErrorResult,
    onFrame: (t) => {
      e = n.reduceFrame(e, t), n.onUpdate?.(e);
    }
  });
  if (!n.signal?.aborted && n.fetchSnapshot)
    try {
      const t = await n.fetchSnapshot();
      e = n.mergeSnapshot ? n.mergeSnapshot(e, t) : t, n.onUpdate?.(e);
    } catch (t) {
      if (!r.completed)
        throw t;
    }
  return {
    state: e,
    lastID: r.lastID,
    completed: r.completed
  };
}
function _(n) {
  const e = n?.interaction && typeof n.interaction == "object" && !Array.isArray(n.interaction) ? n.interaction : {};
  return {
    runId: Number(n?.run_id || n?.runId || 0),
    nodeRunId: Number(n?.node_run_id || n?.nodeRunId || 0),
    nodeKey: String(n?.node_key || n?.nodeKey || ""),
    nodeName: String(n?.node_name || n?.nodeName || ""),
    interaction: e
  };
}
const m = {
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
  cancelled: "canceled"
};
function i(n) {
  const e = String(n || "").trim().toLowerCase();
  return m[e] || "pending";
}
function b(n, e) {
  if (String(e || "").trim())
    return i(e);
  const r = String(n.event || n.type || "").trim().toLowerCase();
  return r.includes("cancel") ? "canceled" : r.includes("fail") || r.includes("error") ? "fail" : r.includes("wait") ? "waiting" : r.includes("finish") || r.includes("success") || r.includes("complete") ? "success" : r.includes("start") || r.includes("progress") || r.includes("running") ? "running" : "pending";
}
function a(n) {
  const e = n && typeof n == "object" ? n : {}, r = e.run && typeof e.run == "object" ? e.run : e, t = {
    ...r,
    id: Number(r.id || e.run_id || 0),
    request_id: String(r.request_id || e.request_id || ""),
    status: i(r.status || e.status),
    error: String(r.error || e.error || "")
  };
  return {
    ...e,
    view: String(e.view || ""),
    run: t,
    flow_runs: u(e.flow_runs, "status"),
    node_runs: u(e.node_runs, "status"),
    interactions: s(e.interactions),
    approvals: s(e.approvals),
    ...Array.isArray(e.agent_runs) ? { agent_runs: e.agent_runs } : {},
    ...Array.isArray(e.blackboard) ? { blackboard: e.blackboard } : {},
    ...Array.isArray(e.messages) ? { messages: e.messages } : {}
  };
}
function y(n, e) {
  const r = a(n), t = a(e);
  return {
    ...r,
    ...t,
    run: {
      ...r.run,
      ...t.run
    },
    flow_runs: c(r.flow_runs, t.flow_runs),
    node_runs: c(r.node_runs, t.node_runs),
    interactions: t.interactions || r.interactions || [],
    approvals: t.approvals || r.approvals || [],
    agent_runs: t.agent_runs || r.agent_runs,
    blackboard: t.blackboard || r.blackboard,
    messages: t.messages || r.messages
  };
}
function u(n, e) {
  return s(n).map((r) => ({
    ...r,
    [e]: i(r?.[e])
  }));
}
function c(n = [], e = []) {
  if (e.length === 0)
    return n;
  const r = new Map(
    n.map((t) => [o(t), t])
  );
  return e.map((t) => ({
    ...r.get(o(t)) || {},
    ...t
  }));
}
function o(n) {
  return String(
    n.id || n.node_run_id || n.flow_run_id || n.node_key || n.flow_id
  );
}
function s(n) {
  return Array.isArray(n) ? n.filter(
    (e) => !!e && typeof e == "object" && !Array.isArray(e)
  ) : [];
}
await window.DeverFront?.ensureCompat?.(["@/lib/agent-result-protocol"]);
const d = window.DeverFront?.sdk?.getCompatModule("@/lib/agent-result-protocol");
if (!d || Object.keys(d).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/agent-result-protocol");
export {
  i as a,
  d as b,
  y as m,
  _ as n,
  b as r,
  p as w
};
