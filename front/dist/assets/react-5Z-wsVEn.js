import { q as y, a as N, h as T, S as C, R as u } from "./file-kind-D6bMOzYN.js";
function L(t) {
  return window.DeverFront?.sdk?.defineFrontPlugin?.(t) || t;
}
function r(t) {
  const e = window.DeverFront?.sdk;
  if (e?.lazyNode)
    return e.lazyNode(t);
  let o = null;
  const n = () => (o || (o = t().catch((l) => {
    throw o = null, l;
  })), o), a = y(n);
  return a.preload = n, a;
}
function U(...t) {
  return F().useNavigate(...t);
}
function F() {
  const t = window.DeverFront?.sdk;
  if (!t)
    throw new Error("Dever front plugin SDK is not ready");
  return t;
}
const k = window.React, v = k.Fragment;
function _(t, e) {
  return e == null ? t || {} : Object.assign({}, t || {}, { key: e });
}
function s(t, e, o) {
  return k.createElement(t, _(e, o));
}
const f = s, I = ".ws-startup-loading{display:grid;position:fixed;inset:0;z-index:9999;place-items:center;background:#f4f6f5;color:#18211d;font-family:Inter,PingFang SC,Microsoft YaHei,sans-serif}.ws-startup-loading-content{display:grid;justify-items:center;gap:10px}.ws-startup-loading-content>strong{font-size:18px;font-weight:650}.ws-startup-loading-content>span:last-child{color:#6b7670;font-size:14px}.ws-startup-loading-spinner{width:26px;height:26px;border:2px solid #d5dcda;border-top-color:#155b43;border-radius:50%;animation:ws-startup-loading-spin .8s linear infinite}@keyframes ws-startup-loading-spin{to{transform:rotate(360deg)}}.dark .ws-startup-loading{background:#111613;color:#f4f7f5}.dark .ws-startup-loading .ws-startup-loading-content>span:last-child{color:#a7b0ab}.dark .ws-startup-loading .ws-startup-loading-spinner{border-color:#38413d;border-top-color:#8cc7ad}";
function j() {
  return /* @__PURE__ */ f(v, { children: [
    /* @__PURE__ */ s("style", { children: I }),
    /* @__PURE__ */ s("main", { className: "ws-startup-loading", role: "status", "aria-live": "polite", children: /* @__PURE__ */ f("div", { className: "ws-startup-loading-content", children: [
      /* @__PURE__ */ s("span", { className: "ws-startup-loading-spinner", "aria-hidden": "true" }),
      /* @__PURE__ */ s("strong", { children: "正在加载创作空间" }),
      /* @__PURE__ */ s("span", { children: "正在准备画布与项目内容" })
    ] }) })
  ] });
}
const z = y(
  () => import("./writing-run-labels-BXHG45m8.js").then((t) => t.a4).then((t) => ({
    default: t.WorkSpacePage
  }))
);
function D() {
  const [t, e] = N(!0), o = T(() => {
    e(!1);
  }, []);
  return /* @__PURE__ */ f(v, { children: [
    /* @__PURE__ */ s(C, { fallback: null, children: /* @__PURE__ */ s(z, { onInitialLoadComplete: o }) }),
    t ? /* @__PURE__ */ s(j, {}) : null
  ] });
}
const h = () => import("./agent-nodes-gW_AtAmY.js"), K = Promise.resolve({ default: D }), O = {
  name: "bot",
  nodes: {
    "show-agent": r(
      () => h().then((t) => ({
        default: t.ShowAgent
      }))
    ),
    "show-agent-chat": r(
      () => import("./protected-8-nodes-show-agent-chat-tsx-CYSDR4Bb.js").then((t) => ({
        default: t.ShowAgentChat
      }))
    ),
    "show-skill-creator": r(
      () => h().then((t) => ({
        default: t.ShowSkillCreator
      }))
    ),
    "show-skill-test": r(
      () => import("./skill-test-DDZ5PNdO.js").then((t) => ({
        default: t.ShowSkillTest
      }))
    ),
    "show-team-workspace": r(
      () => import("./team-workspace-BVZty5I7.js").then((t) => ({
        default: t.ShowTeamWorkspace
      }))
    ),
    "show-stream-request": r(
      () => import("./show-stream-request-CWK8mXdU.js").then((t) => ({
        default: t.ShowStreamRequest
      }))
    ),
    "show-knowledge-file-manager": r(
      () => import("./protected-7-nodes-show-knowledge-file-manager-tsx-Cd_Wghab.js").then((t) => ({
        default: t.ShowKnowledgeFileManager
      }))
    ),
    "bot-body-work-login-page": r(
      () => import("./login-page-DhFQAzII.js").then((t) => ({
        default: t.WorkLoginPage
      }))
    ),
    "bot-body-content-page": r(
      () => import("./standalone-content-page-Dznb2XkK.js").then(
        (t) => ({
          default: t.StandaloneContentPage
        })
      )
    ),
    "bot-body-work-home-shell": r(
      () => import("./home-shell-I7QjF-rh.js").then((t) => t.h).then((t) => ({
        default: t.WorkHomeShell
      }))
    ),
    "bot-body-work-space-page": r(() => K)
  }
}, W = L(O);
window.DeverFront?.registerPlugin(W);
const A = {
  general: { name: "通用", viewMode: "content" },
  storyboard: { name: "分镜脚本", viewMode: "storyboard" },
  story: { name: "故事", viewMode: "writing" },
  storyboard_grid: { name: "宫格", viewMode: "storyboard_grid" },
  speech: { name: "语音合成", viewMode: "content" },
  lip_sync: { name: "口型同步", viewMode: "content" },
  video_compose: { name: "视频合成", viewMode: "video_compose" }
}, E = {
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
function p(t, e = "", o = "") {
  const n = d(t?.kind || e) || "text", a = d(o || t?.outputType) || "general", l = A[a], g = d(t?.output?.key) === a ? t?.output : void 0;
  return {
    outputType: a,
    outputName: n === "text" || n === "llm" || a !== "general" ? String(g?.name || "").trim() || l?.name || a : "",
    kindName: R(n),
    viewMode: d(g?.viewMode) || l?.viewMode || "content"
  };
}
function Y(t, e = "", o = "") {
  return p(t, e, o).viewMode === "storyboard";
}
function G(t, e = "", o = "") {
  return p(t, e, o).viewMode === "video_compose";
}
function $(t, e = "", o = "") {
  return p(t, e, o).viewMode === "storyboard_grid";
}
function J(t, e = "") {
  const o = d(t?.kind || e);
  return o === "audio" || o === "music";
}
function R(t) {
  const e = d(t) || "text";
  return E[e] || "文本";
}
function d(t) {
  return String(t || "").trim().toLowerCase();
}
function Q(t, e = "", o = "") {
  return p(t, e, o).viewMode === "writing";
}
const b = (t) => {
  let e;
  const o = /* @__PURE__ */ new Set(), n = (i, m) => {
    const c = typeof i == "function" ? i(e) : i;
    if (!Object.is(c, e)) {
      const x = e;
      e = m ?? (typeof c != "object" || c === null) ? c : Object.assign({}, e, c), o.forEach((M) => M(e, x));
    }
  }, a = () => e, w = { setState: n, getState: a, getInitialState: () => P, subscribe: (i) => (o.add(i), () => o.delete(i)) }, P = e = t(n, a, w);
  return w;
}, q = ((t) => t ? b(t) : b), B = (t) => t;
function V(t, e = B) {
  const o = u.useSyncExternalStore(
    t.subscribe,
    u.useCallback(() => e(t.getState()), [t, e]),
    u.useCallback(() => e(t.getInitialState()), [t, e])
  );
  return u.useDebugValue(o), o;
}
const S = (t) => {
  const e = q(t), o = (n) => V(e, n);
  return Object.assign(o, e), o;
}, X = ((t) => t ? S(t) : S);
export {
  v as F,
  f as a,
  U as b,
  Q as c,
  Y as d,
  q as e,
  X as f,
  J as g,
  $ as h,
  G as i,
  s as j,
  p as r,
  V as u
};
