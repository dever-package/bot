import { p as F, a as P, h as I, S as M, R as w } from "./file-kind-DFeonxO2.js";
function j(t) {
  return window.DeverFront?.sdk?.defineFrontPlugin?.(t) || t;
}
function l(t) {
  const e = window.DeverFront?.sdk;
  if (e?.lazyNode)
    return e.lazyNode(t);
  let o = null;
  const a = () => (o || (o = t().catch((g) => {
    throw o = null, g;
  })), o), i = F(a);
  return i.preload = a, i;
}
function $(...t) {
  return D().useNavigate(...t);
}
function D() {
  const t = window.DeverFront?.sdk;
  if (!t)
    throw new Error("Dever front plugin SDK is not ready");
  return t;
}
const x = window.React, C = x.Fragment;
function L(t, e) {
  return e == null ? t || {} : Object.assign({}, t || {}, { key: e });
}
function c(t, e, o) {
  return x.createElement(t, L(e, o));
}
const k = c, R = ".ws-startup-loading{display:grid;position:fixed;inset:0;z-index:9999;place-items:center;background:#f4f6f5;color:#18211d;font-family:Inter,PingFang SC,Microsoft YaHei,sans-serif}.ws-startup-loading-content{display:grid;justify-items:center;gap:10px}.ws-startup-loading-content>strong{font-size:18px;font-weight:650}.ws-startup-loading-content>span:last-child{color:#6b7670;font-size:14px}.ws-startup-loading-spinner{width:26px;height:26px;border:2px solid #d5dcda;border-top-color:#155b43;border-radius:50%;animation:ws-startup-loading-spin .8s linear infinite}@keyframes ws-startup-loading-spin{to{transform:rotate(360deg)}}.dark .ws-startup-loading{background:#111613;color:#f4f7f5}.dark .ws-startup-loading .ws-startup-loading-content>span:last-child{color:#a7b0ab}.dark .ws-startup-loading .ws-startup-loading-spinner{border-color:#38413d;border-top-color:#8cc7ad}";
function W() {
  return /* @__PURE__ */ k(C, { children: [
    /* @__PURE__ */ c("style", { children: R }),
    /* @__PURE__ */ c("main", { className: "ws-startup-loading", role: "status", "aria-live": "polite", children: /* @__PURE__ */ k("div", { className: "ws-startup-loading-content", children: [
      /* @__PURE__ */ c("span", { className: "ws-startup-loading-spinner", "aria-hidden": "true" }),
      /* @__PURE__ */ c("strong", { children: "正在加载创作空间" }),
      /* @__PURE__ */ c("span", { children: "正在准备画布与项目内容" })
    ] }) })
  ] });
}
const K = F(
  () => import("./space-page-B7eY-TDj.js").then((t) => t.K).then((t) => ({
    default: t.WorkSpacePage
  }))
);
function A() {
  const [t, e] = P(!0), o = I(() => {
    e(!1);
  }, []);
  return /* @__PURE__ */ k(C, { children: [
    /* @__PURE__ */ c(M, { fallback: null, children: /* @__PURE__ */ c(K, { onInitialLoadComplete: o }) }),
    t ? /* @__PURE__ */ c(W, {}) : null
  ] });
}
const z = () => import("./agent-nodes-DfPOrnUM.js"), E = Promise.resolve({ default: A }), O = {
  name: "bot",
  nodes: {
    "show-agent": l(
      () => z().then((t) => ({
        default: t.ShowAgent
      }))
    ),
    "show-agent-chat": l(
      () => import("./protected-7-nodes-show-agent-chat-tsx-B1YzlqTo.js").then((t) => ({
        default: t.ShowAgentChat
      }))
    ),
    "show-skill-creator": l(
      () => z().then((t) => ({
        default: t.ShowSkillCreator
      }))
    ),
    "show-skill-test": l(
      () => import("./skill-test-BKIxzyna.js").then((t) => ({
        default: t.ShowSkillTest
      }))
    ),
    "show-team-workspace": l(
      () => import("./team-workspace-DSToEvEj.js").then((t) => ({
        default: t.ShowTeamWorkspace
      }))
    ),
    "show-stream-request": l(
      () => import("./show-stream-request-BkfH5PGE.js").then((t) => ({
        default: t.ShowStreamRequest
      }))
    ),
    "show-knowledge-file-manager": l(
      () => import("./protected-6-nodes-show-knowledge-file-manager-tsx-TADur35h.js").then((t) => ({
        default: t.ShowKnowledgeFileManager
      }))
    ),
    "bot-body-work-login-page": l(
      () => import("./login-page-DbaQ9JCt.js").then((t) => ({
        default: t.WorkLoginPage
      }))
    ),
    "bot-body-content-page": l(
      () => import("./standalone-content-page-BllZZaty.js").then(
        (t) => ({
          default: t.StandaloneContentPage
        })
      )
    ),
    "bot-body-work-home-shell": l(
      () => import("./home-shell-B0kc4R6J.js").then((t) => t.h).then((t) => ({
        default: t.WorkHomeShell
      }))
    ),
    "bot-body-work-space-page": l(() => E)
  }
}, q = j(O);
window.DeverFront?.registerPlugin(q);
const v = (t) => {
  let e;
  const o = /* @__PURE__ */ new Set(), a = (n, s) => {
    const r = typeof n == "function" ? n(e) : n;
    if (!Object.is(r, e)) {
      const d = e;
      e = s ?? (typeof r != "object" || r === null) ? r : Object.assign({}, e, r), o.forEach((p) => p(e, d));
    }
  }, i = () => e, m = { setState: a, getState: i, getInitialState: () => u, subscribe: (n) => (o.add(n), () => o.delete(n)) }, u = e = t(a, i, m);
  return m;
}, T = ((t) => t ? v(t) : v);
function G(t, e) {
  const o = t.map((n) => ({
    name: String(n.name || ""),
    size: y(n.size)
  })), a = o.reduce((n, s) => n + s.size, 0), i = o.map((n) => Math.max(n.size, 1)), g = i.reduce((n, s) => n + s, 0), f = o.map(() => 0);
  function m(n, s) {
    const r = o[n];
    if (!r || !e) return;
    const d = o.reduce(
      (h, b, S) => h + b.size * f[S],
      0
    ), p = i.reduce(
      (h, b, S) => h + b * f[S],
      0
    );
    e({
      phase: s,
      fileName: r.name,
      fileIndex: n + 1,
      fileCount: o.length,
      loaded: Math.round(d),
      total: a,
      percent: g > 0 ? Math.round(Math.min(1, p / g) * 100) : 100
    });
  }
  function u(n, s, r) {
    o[n] && (f[n] = Math.max(f[n], B(s)), m(n, r));
  }
  return {
    start(n) {
      u(n, 0, "preparing");
    },
    report(n, s, r, d = "uploading") {
      const p = o[n];
      if (!p) return;
      const h = d === "saving" || d === "complete" ? 1 : H(s, r, p.size);
      u(n, h, d);
    },
    saving(n) {
      u(n, 1, "saving");
    },
    complete(n) {
      u(n, 1, "complete");
    }
  };
}
function H(t, e, o) {
  const a = y(t), i = y(e);
  return i > 0 ? a / i : o > 0 ? a / o : 0;
}
function y(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) && e > 0 ? e : 0;
}
function B(t) {
  return Math.max(0, Math.min(Number.isFinite(t) ? t : 0, 1));
}
const U = (t) => t;
function V(t, e = U) {
  const o = w.useSyncExternalStore(
    t.subscribe,
    w.useCallback(() => e(t.getState()), [t, e]),
    w.useCallback(() => e(t.getInitialState()), [t, e])
  );
  return w.useDebugValue(o), o;
}
const N = (t) => {
  const e = T(t), o = (a) => V(e, a);
  return Object.assign(o, e), o;
}, J = ((t) => t ? N(t) : N);
export {
  C as F,
  k as a,
  $ as b,
  G as c,
  T as d,
  J as e,
  c as j,
  V as u
};
