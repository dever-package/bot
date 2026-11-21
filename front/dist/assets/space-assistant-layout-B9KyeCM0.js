function C(n) {
  const e = y(n) ? n : {};
  return {
    id: p(e.id),
    name: R(e.name || e.value) || "未命名分组",
    type: p(e.type) === 2 ? 2 : 1,
    status: p(e.status) === 2 ? 2 : 1,
    sort: p(e.sort, 100)
  };
}
function N(n, e, t) {
  const r = new Map(
    e.filter((s) => s.id > 0).map((s) => [s.id, s])
  ), i = /* @__PURE__ */ new Map(), d = [];
  for (const s of n) {
    const u = r.get(t(s));
    if (u?.status !== 2 && u?.type === 2) {
      const _ = i.get(u.id) || [];
      _.push(s), i.set(u.id, _);
      continue;
    }
    d.push(s);
  }
  const l = e.filter(
    (s) => s.status !== 2 && s.type === 2 && (i.get(s.id)?.length || 0) > 0
  ).sort((s, u) => s.sort - u.sort || s.id - u.id).map((s) => ({
    category: s,
    powers: i.get(s.id) || []
  }));
  return { basicPowers: d, groups: l };
}
function I(n) {
  return [
    ...n.basicPowers,
    ...n.groups.flatMap((e) => e.powers)
  ];
}
function y(n) {
  return !!(n && typeof n == "object" && !Array.isArray(n));
}
function R(n) {
  return typeof n == "string" ? n.trim() : "";
}
function p(n, e = 0) {
  const t = Number(n);
  return Number.isFinite(t) ? t : e;
}
const P = {
  general: { name: "通用", viewMode: "content" },
  setting: { name: "设定", viewMode: "setting" },
  storyboard: { name: "分镜脚本", viewMode: "storyboard" },
  story: { name: "故事", viewMode: "writing" },
  storyboard_grid: { name: "宫格", viewMode: "storyboard_grid" },
  speech: { name: "语音合成", viewMode: "content" },
  video_compose: { name: "视频合成", viewMode: "video_compose" }
}, T = {
  text: "文本",
  llm: "文本",
  image: "图片",
  audio: "音频",
  music: "音频",
  video: "视频",
  file: "文件",
  mixed: "图文",
  role: "角色",
  multi: "多模态",
  embeddings: "向量",
  workflow: "工作流"
};
function m(n, e = "", t = "") {
  const r = a(n?.kind || e) || "text", i = a(t || n?.outputType) || "general", d = P[i], l = a(n?.output?.key) === i ? n?.output : void 0;
  return {
    outputType: i,
    outputName: r === "text" || r === "llm" || i !== "general" ? String(l?.name || "").trim() || d?.name || i : "",
    kindName: b(r),
    viewMode: a(l?.viewMode) || d?.viewMode || "content"
  };
}
function Y(n, e = "", t = "") {
  return m(n, e, t).viewMode === "storyboard";
}
function G(n, e = "", t = "") {
  return m(n, e, t).viewMode === "video_compose";
}
function W(n, e = "", t = "") {
  return m(n, e, t).viewMode === "storyboard_grid";
}
function k(n, e = "") {
  const t = a(n?.kind || e);
  return t === "audio" || t === "music";
}
function b(n) {
  const e = a(n) || "text";
  return T[e] || "文本";
}
function a(n) {
  return String(n || "").trim().toLowerCase();
}
function x(n, e = "", t = "") {
  return m(n, e, t).viewMode === "writing";
}
const E = {
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
function c(n) {
  const e = String(n || "").trim().toLowerCase();
  return E[e] || "pending";
}
function D(n, e) {
  if (String(e || "").trim())
    return c(e);
  const t = String(n.event || n.type || "").trim().toLowerCase();
  return t.includes("cancel") ? "canceled" : t.includes("fail") || t.includes("error") ? "fail" : t.includes("wait") ? "waiting" : t.includes("finish") || t.includes("success") || t.includes("complete") ? "success" : t.includes("start") || t.includes("progress") || t.includes("running") ? "running" : "pending";
}
function L(n) {
  const e = c(n);
  return e === "pending" || e === "running";
}
function U(n) {
  return c(n) === "waiting";
}
function B(n) {
  const e = c(n);
  return e === "success" || e === "fail" || e === "canceled";
}
function f(n) {
  const e = n && typeof n == "object" ? n : {}, t = e.run && typeof e.run == "object" ? e.run : e, r = {
    ...t,
    id: Number(t.id || e.run_id || 0),
    request_id: String(t.request_id || e.request_id || ""),
    status: c(t.status || e.status),
    error: String(t.error || e.error || "")
  };
  return {
    ...e,
    view: String(e.view || ""),
    run: r,
    flow_runs: S(e.flow_runs, "status"),
    node_runs: S(e.node_runs, "status"),
    interactions: g(e.interactions),
    approvals: g(e.approvals),
    ...Array.isArray(e.agent_runs) ? { agent_runs: e.agent_runs } : {},
    ...Array.isArray(e.blackboard) ? { blackboard: e.blackboard } : {},
    ...Array.isArray(e.messages) ? { messages: e.messages } : {}
  };
}
function q(n, e) {
  const t = f(n), r = f(e);
  return {
    ...t,
    ...r,
    run: {
      ...t.run,
      ...r.run
    },
    flow_runs: w(t.flow_runs, r.flow_runs),
    node_runs: w(t.node_runs, r.node_runs),
    interactions: r.interactions || t.interactions || [],
    approvals: r.approvals || t.approvals || [],
    agent_runs: r.agent_runs || t.agent_runs,
    blackboard: r.blackboard || t.blackboard,
    messages: r.messages || t.messages
  };
}
function S(n, e) {
  return g(n).map((t) => ({
    ...t,
    [e]: c(t?.[e])
  }));
}
function w(n = [], e = []) {
  if (e.length === 0)
    return n;
  const t = new Map(
    n.map((r) => [A(r), r])
  );
  return e.map((r) => ({
    ...t.get(A(r)) || {},
    ...r
  }));
}
function A(n) {
  return String(
    n.id || n.node_run_id || n.flow_run_id || n.node_key || n.flow_id
  );
}
function g(n) {
  return Array.isArray(n) ? n.filter(
    (e) => !!e && typeof e == "object" && !Array.isArray(e)
  ) : [];
}
const o = window.ReactDOM || {}, F = o.createPortal, z = o.flushSync;
o.preconnect;
o.prefetchDNS;
o.preinit;
o.preinitModule;
o.preload;
o.preloadModule;
o.requestFormReset;
o.unstable_batchedUpdates;
o.useFormState;
o.useFormStatus;
o.version;
const M = 2;
function K(n) {
  return Number(n) === M;
}
function V(n, e, t) {
  const r = String(n ?? "").trim(), i = String(e ?? "").trim();
  return r || i || t;
}
function j() {
  const n = /* @__PURE__ */ new Map();
  return (e, t) => {
    const r = n.get(e);
    if (r)
      return r;
    let i;
    return i = Promise.resolve().then(t).finally(() => {
      n.get(e) === i && n.delete(e);
    }), n.set(e, i), i;
  };
}
const O = 520, v = 440, h = 720, H = "bot.canvasAssistant.width", X = "bot.canvasAssistant.open";
function J(n) {
  return Number.isFinite(n) ? Math.min(
    h,
    Math.max(v, Math.round(n))
  ) : O;
}
function Q(n, e) {
  const t = n && e;
  return {
    launcherVisible: n && !t,
    panelVisible: t
  };
}
function Z(n) {
  return n === "1";
}
export {
  o as R,
  X as S,
  j as a,
  N as b,
  F as c,
  V as d,
  J as e,
  I as f,
  L as g,
  U as h,
  K as i,
  c as j,
  G as k,
  x as l,
  Y as m,
  C as n,
  q as o,
  D as p,
  k as q,
  m as r,
  Q as s,
  Z as t,
  O as u,
  H as v,
  W as w,
  z as x,
  B as y
};
