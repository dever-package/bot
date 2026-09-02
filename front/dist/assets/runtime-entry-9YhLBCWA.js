import { l as d, a as g, e as h, S as w } from "./_commonjsHelpers-C76sftkf.js";
function f(t) {
  return window.DeverFront?.sdk?.defineFrontPlugin?.(t) || t;
}
function e(t) {
  const n = window.DeverFront?.sdk;
  if (n?.lazyNode)
    return n.lazyNode(t);
  let a = null;
  const s = () => (a || (a = t().catch((p) => {
    throw a = null, p;
  })), a), i = d(s);
  return i.preload = s, i;
}
function C(...t) {
  return m().useNavigate(...t);
}
function m() {
  const t = window.DeverFront?.sdk;
  if (!t)
    throw new Error("Dever front plugin SDK is not ready");
  return t;
}
const c = window.React, u = c.Fragment;
function k(t, n) {
  return n == null ? t || {} : Object.assign({}, t || {}, { key: n });
}
function o(t, n, a) {
  return c.createElement(t, k(n, a));
}
const r = o, b = ".ws-startup-loading{display:grid;position:fixed;inset:0;z-index:9999;place-items:center;background:#f4f6f5;color:#18211d;font-family:Inter,PingFang SC,Microsoft YaHei,sans-serif}.ws-startup-loading-content{display:grid;justify-items:center;gap:10px}.ws-startup-loading-content>strong{font-size:18px;font-weight:650}.ws-startup-loading-content>span:last-child{color:#6b7670;font-size:14px}.ws-startup-loading-spinner{width:26px;height:26px;border:2px solid #d5dcda;border-top-color:#155b43;border-radius:50%;animation:ws-startup-loading-spin .8s linear infinite}@keyframes ws-startup-loading-spin{to{transform:rotate(360deg)}}.dark .ws-startup-loading{background:#111613;color:#f4f7f5}.dark .ws-startup-loading .ws-startup-loading-content>span:last-child{color:#a7b0ab}.dark .ws-startup-loading .ws-startup-loading-spinner{border-color:#38413d;border-top-color:#8cc7ad}";
function S() {
  return /* @__PURE__ */ r(u, { children: [
    /* @__PURE__ */ o("style", { children: b }),
    /* @__PURE__ */ o("main", { className: "ws-startup-loading", role: "status", "aria-live": "polite", children: /* @__PURE__ */ r("div", { className: "ws-startup-loading-content", children: [
      /* @__PURE__ */ o("span", { className: "ws-startup-loading-spinner", "aria-hidden": "true" }),
      /* @__PURE__ */ o("strong", { children: "正在加载创作空间" }),
      /* @__PURE__ */ o("span", { children: "正在准备画布与项目内容" })
    ] }) })
  ] });
}
const y = d(
  () => import("./space-entry-BdgKs8y7.js").then((t) => ({
    default: t.WorkSpaceEntry
  }))
);
function v() {
  const [t, n] = g(!0), a = h(() => {
    n(!1);
  }, []);
  return /* @__PURE__ */ r(u, { children: [
    /* @__PURE__ */ o(w, { fallback: null, children: /* @__PURE__ */ o(y, { onInitialLoadComplete: a }) }),
    t ? /* @__PURE__ */ o(S, {}) : null
  ] });
}
const l = () => import("./agent-nodes-DAUkNhal.js"), x = Promise.resolve({ default: v }), F = {
  name: "bot",
  nodes: {
    "show-agent": e(
      () => l().then((t) => ({
        default: t.ShowAgent
      }))
    ),
    "show-agent-chat": e(
      () => import("./protected-7-nodes-show-agent-chat-tsx-BHDd_K5t.js").then((t) => ({
        default: t.ShowAgentChat
      }))
    ),
    "show-skill-creator": e(
      () => l().then((t) => ({
        default: t.ShowSkillCreator
      }))
    ),
    "show-skill-test": e(
      () => import("./skill-test-BzKiVhbj.js").then((t) => ({
        default: t.ShowSkillTest
      }))
    ),
    "show-team-workspace": e(
      () => import("./team-workspace-NAiSDZZ_.js").then((t) => ({
        default: t.ShowTeamWorkspace
      }))
    ),
    "show-stream-request": e(
      () => import("./show-stream-request-DXLSvPHs.js").then((t) => ({
        default: t.ShowStreamRequest
      }))
    ),
    "show-knowledge-file-manager": e(
      () => import("./protected-6-nodes-show-knowledge-file-manager-tsx-CrRmSfHo.js").then((t) => ({
        default: t.ShowKnowledgeFileManager
      }))
    ),
    "bot-body-work-login-page": e(
      () => import("./login-page-CxVFQhBi.js").then((t) => ({
        default: t.WorkLoginPage
      }))
    ),
    "bot-body-content-page": e(
      () => import("./standalone-content-page-BJGVOnGq.js").then(
        (t) => ({
          default: t.StandaloneContentPage
        })
      )
    ),
    "bot-body-work-home-shell": e(
      () => import("./home-shell-iyclopkj.js").then((t) => t.h).then((t) => ({
        default: t.WorkHomeShell
      }))
    ),
    "bot-body-work-space-page": e(() => x)
  }
}, N = f(F);
window.DeverFront?.registerPlugin(N);
export {
  u as F,
  r as a,
  o as j,
  C as u
};
