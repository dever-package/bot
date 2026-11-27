import { q as c, a as w, h as i, S as m, b as u, d as b } from "./file-kind-X0KKJPkQ.js";
function k(t) {
  return window.DeverFront?.sdk?.defineFrontPlugin?.(t) || t;
}
function o(t) {
  const e = window.DeverFront?.sdk;
  if (e?.lazyNode)
    return e.lazyNode(t);
  let n = null;
  const a = () => (n || (n = t().catch((l) => {
    throw n = null, l;
  })), n), r = c(a);
  return r.preload = a, r;
}
function R(...t) {
  return S().useNavigate(...t);
}
function S() {
  const t = window.DeverFront?.sdk;
  if (!t)
    throw new Error("Dever front plugin SDK is not ready");
  return t;
}
const f = window.React, g = f.Fragment;
function v(t, e) {
  return e == null ? t || {} : Object.assign({}, t || {}, { key: e });
}
function s(t, e, n) {
  return f.createElement(t, v(e, n));
}
const d = s, P = ".ws-startup-loading{display:grid;position:fixed;inset:0;z-index:9999;place-items:center;background:#f4f6f5;color:#18211d;font-family:Inter,PingFang SC,Microsoft YaHei,sans-serif}.ws-startup-loading-content{display:grid;justify-items:center;gap:10px}.ws-startup-loading-content>strong{font-size:18px;font-weight:650}.ws-startup-loading-content>span:last-child{color:#6b7670;font-size:14px}.ws-startup-loading-spinner{width:26px;height:26px;border:2px solid #d5dcda;border-top-color:#155b43;border-radius:50%;animation:ws-startup-loading-spin .8s linear infinite}@keyframes ws-startup-loading-spin{to{transform:rotate(360deg)}}.dark .ws-startup-loading{background:#111613;color:#f4f7f5}.dark .ws-startup-loading .ws-startup-loading-content>span:last-child{color:#a7b0ab}.dark .ws-startup-loading .ws-startup-loading-spinner{border-color:#38413d;border-top-color:#8cc7ad}";
function y() {
  return /* @__PURE__ */ d(g, { children: [
    /* @__PURE__ */ s("style", { children: P }),
    /* @__PURE__ */ s("main", { className: "ws-startup-loading", role: "status", "aria-live": "polite", children: /* @__PURE__ */ d("div", { className: "ws-startup-loading-content", children: [
      /* @__PURE__ */ s("span", { className: "ws-startup-loading-spinner", "aria-hidden": "true" }),
      /* @__PURE__ */ s("strong", { children: "正在加载创作空间" }),
      /* @__PURE__ */ s("span", { children: "正在准备画布与项目内容" })
    ] }) })
  ] });
}
const N = c(
  () => import("./space-page-sAJFaiZ6.js").then((t) => ({
    default: t.WorkSpacePage
  }))
);
function x() {
  const [t, e] = w(!0), n = i(() => {
    e(!1);
  }, []);
  return /* @__PURE__ */ d(g, { children: [
    /* @__PURE__ */ s(m, { fallback: null, children: /* @__PURE__ */ s(N, { onInitialLoadComplete: n }) }),
    t ? /* @__PURE__ */ s(y, {}) : null
  ] });
}
const p = () => import("./agent-nodes-DYvodHrU.js"), F = Promise.resolve({ default: x }), C = {
  name: "bot",
  nodes: {
    "show-agent": o(
      () => p().then((t) => ({
        default: t.ShowAgent
      }))
    ),
    "show-agent-chat": o(
      () => import("./protected-8-nodes-show-agent-chat-tsx-BHXSF7b0.js").then((t) => ({
        default: t.ShowAgentChat
      }))
    ),
    "show-skill-creator": o(
      () => p().then((t) => ({
        default: t.ShowSkillCreator
      }))
    ),
    "show-skill-test": o(
      () => import("./skill-test-Zitb-RCw.js").then((t) => ({
        default: t.ShowSkillTest
      }))
    ),
    "show-team-workspace": o(
      () => import("./team-workspace-90SKAH1k.js").then((t) => ({
        default: t.ShowTeamWorkspace
      }))
    ),
    "show-stream-request": o(
      () => import("./show-stream-request-BC_FMYeM.js").then((t) => ({
        default: t.ShowStreamRequest
      }))
    ),
    "show-knowledge-file-manager": o(
      () => import("./protected-7-nodes-show-knowledge-file-manager-tsx-DBDy88lp.js").then((t) => ({
        default: t.ShowKnowledgeFileManager
      }))
    ),
    "bot-body-work-login-page": o(
      () => import("./login-page-CFloFbig.js").then((t) => ({
        default: t.WorkLoginPage
      }))
    ),
    "bot-body-content-page": o(
      () => import("./standalone-content-page-4ASgXU37.js").then(
        (t) => ({
          default: t.StandaloneContentPage
        })
      )
    ),
    "bot-body-work-home-shell": o(
      () => import("./home-shell-N8tIyo7S.js").then((t) => t.h).then((t) => ({
        default: t.WorkHomeShell
      }))
    ),
    "bot-body-work-space-page": o(() => F)
  }
}, D = k(C);
window.DeverFront?.registerPlugin(D);
const z = {
  character: "角色",
  scene: "场景",
  prop: "道具"
};
function A(t) {
  let e;
  const n = () => (e || (e = t().catch((a) => {
    throw e = void 0, a;
  })), e);
  return {
    load: n,
    preload: () => n().then(
      () => {
      },
      () => {
      }
    )
  };
}
function I(t, e) {
  return {
    Component: c(
      () => t.load().then((n) => ({ default: e(n) }))
    ),
    preload: t.preload
  };
}
function T(t, e = 140) {
  const n = u(0), a = u(t);
  a.current = t;
  const r = i(() => {
    n.current && (window.clearTimeout(n.current), n.current = 0);
  }, []), l = i(() => {
    r(), a.current?.();
  }, [r]), h = i(() => {
    r(), a.current && (n.current = window.setTimeout(() => {
      n.current = 0, a.current?.();
    }, e));
  }, [r, e]);
  return b(() => r, [r]), { schedule: h, cancel: r, preloadNow: l };
}
export {
  g as F,
  z as S,
  d as a,
  I as b,
  A as c,
  T as d,
  s as j,
  R as u
};
