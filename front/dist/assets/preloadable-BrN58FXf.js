import { q as d, a as m, h as l, S as b, b as f, d as k } from "./file-kind-BSFhe2vU.js";
function y(e) {
  return window.DeverFront?.sdk?.defineFrontPlugin?.(e) || e;
}
function a(e) {
  const t = window.DeverFront?.sdk;
  if (t?.lazyNode)
    return t.lazyNode(e);
  let n = null;
  const o = () => (n || (n = e().catch((s) => {
    throw n = null, s;
  })), n), r = d(o);
  return r.preload = o, r;
}
function W(...e) {
  return S().useNavigate(...e);
}
function S() {
  const e = window.DeverFront?.sdk;
  if (!e)
    throw new Error("Dever front plugin SDK is not ready");
  return e;
}
const g = window.React, h = g.Fragment;
function v(e, t) {
  return t == null ? e || {} : Object.assign({}, e || {}, { key: t });
}
function i(e, t, n) {
  return g.createElement(e, v(t, n));
}
const c = i, x = ".ws-startup-loading{display:grid;position:fixed;inset:0;z-index:9999;place-items:center;background:#f4f6f5;color:#18211d;font-family:Inter,PingFang SC,Microsoft YaHei,sans-serif}.ws-startup-loading-content{display:grid;justify-items:center;gap:10px}.ws-startup-loading-content>strong{font-size:18px;font-weight:650}.ws-startup-loading-content>span:last-child{color:#6b7670;font-size:14px}.ws-startup-loading-spinner{width:26px;height:26px;border:2px solid #d5dcda;border-top-color:#155b43;border-radius:50%;animation:ws-startup-loading-spin .8s linear infinite}@keyframes ws-startup-loading-spin{to{transform:rotate(360deg)}}.dark .ws-startup-loading{background:#111613;color:#f4f7f5}.dark .ws-startup-loading .ws-startup-loading-content>span:last-child{color:#a7b0ab}.dark .ws-startup-loading .ws-startup-loading-spinner{border-color:#38413d;border-top-color:#8cc7ad}";
function P() {
  return /* @__PURE__ */ c(h, { children: [
    /* @__PURE__ */ i("style", { children: x }),
    /* @__PURE__ */ i("main", { className: "ws-startup-loading", role: "status", "aria-live": "polite", children: /* @__PURE__ */ c("div", { className: "ws-startup-loading-content", children: [
      /* @__PURE__ */ i("span", { className: "ws-startup-loading-spinner", "aria-hidden": "true" }),
      /* @__PURE__ */ i("strong", { children: "正在加载创作空间" }),
      /* @__PURE__ */ i("span", { children: "正在准备画布与项目内容" })
    ] }) })
  ] });
}
const C = d(
  () => import("./space-page-D7KRQcEU.js").then((e) => ({
    default: e.WorkSpacePage
  }))
);
function L() {
  const [e, t] = m(!0), n = l(() => {
    t(!1);
  }, []);
  return /* @__PURE__ */ c(h, { children: [
    /* @__PURE__ */ i(b, { fallback: null, children: /* @__PURE__ */ i(C, { onInitialLoadComplete: n }) }),
    e ? /* @__PURE__ */ i(P, {}) : null
  ] });
}
const p = () => import("./agent-nodes-C8FxCovt.js"), N = Promise.resolve({ default: L }), F = {
  name: "bot",
  nodes: {
    "show-agent": a(
      () => p().then((e) => ({
        default: e.ShowAgent
      }))
    ),
    "show-agent-chat": a(
      () => import("./protected-8-nodes-show-agent-chat-tsx-DSr_gbvn.js").then((e) => ({
        default: e.ShowAgentChat
      }))
    ),
    "show-skill-creator": a(
      () => p().then((e) => ({
        default: e.ShowSkillCreator
      }))
    ),
    "show-skill-test": a(
      () => import("./skill-test-BqM58_AN.js").then((e) => ({
        default: e.ShowSkillTest
      }))
    ),
    "show-team-workspace": a(
      () => import("./team-workspace-1eOkCX5H.js").then((e) => ({
        default: e.ShowTeamWorkspace
      }))
    ),
    "show-stream-request": a(
      () => import("./show-stream-request-Bx9yvsXa.js").then((e) => ({
        default: e.ShowStreamRequest
      }))
    ),
    "show-knowledge-file-manager": a(
      () => import("./protected-7-nodes-show-knowledge-file-manager-tsx-DLGJt3lZ.js").then((e) => ({
        default: e.ShowKnowledgeFileManager
      }))
    ),
    "bot-body-work-login-page": a(
      () => import("./login-page-D1Jpfyuh.js").then((e) => ({
        default: e.WorkLoginPage
      }))
    ),
    "bot-body-content-page": a(
      () => import("./standalone-content-page-CPICKCfR.js").then(
        (e) => ({
          default: e.StandaloneContentPage
        })
      )
    ),
    "bot-body-work-home-shell": a(
      () => import("./home-shell-DQLfgZSa.js").then((e) => e.h).then((e) => ({
        default: e.WorkHomeShell
      }))
    ),
    "bot-body-work-space-page": a(() => N)
  }
}, D = y(F);
window.DeverFront?.registerPlugin(D);
const R = "素材库", j = [
  { key: "project", label: "创作" },
  { key: "tool", label: "工具" },
  { key: "dialogue", label: "对话" },
  { key: "upload", label: "上传" },
  { key: "import", label: "导入" },
  { key: "official", label: R }
], z = [
  { key: "work", label: "作品" },
  { key: "material", label: "素材" }
], I = [
  { key: "collection", label: "集合" },
  { key: "text", label: "文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "richtext", label: "富文本" },
  { key: "file", label: "文件" }
];
function A(e, t = {}) {
  const n = t.fallback || "资产", o = u(j, e, n);
  return t[e] || o;
}
function M(e) {
  return u(z, e, "素材");
}
function T(e) {
  return u(I, e, "资产");
}
function q(e) {
  if (e.length === 0 || e.some((o) => ["text", "richtext", "file"].includes(o)))
    return;
  const t = {
    image: "image/*",
    audio: "audio/*",
    video: "video/*"
  }, n = e.map((o) => t[o]).filter((o) => !!o);
  return n.length > 0 ? Array.from(new Set(n)).join(",") : void 0;
}
function E(e, t) {
  return e && (t.length === 0 || t.some((n) => ["richtext", "video"].includes(n)));
}
function H(e) {
  return e.id <= 0 ? !1 : e.libraryType === "material" ? e.version?.content != null : e.versionID > 0;
}
function u(e, t, n) {
  return e.find((o) => o.key === t)?.label || n;
}
function B(e) {
  let t;
  const n = () => (t || (t = e().catch((o) => {
    throw t = void 0, o;
  })), t);
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
function O(e, t) {
  return {
    Component: d(
      () => e.load().then((n) => ({ default: t(n) }))
    ),
    preload: e.preload
  };
}
function U(e, t = 140) {
  const n = f(0), o = f(e);
  o.current = e;
  const r = l(() => {
    n.current && (window.clearTimeout(n.current), n.current = 0);
  }, []), s = l(() => {
    r(), o.current?.();
  }, [r]), w = l(() => {
    r(), o.current && (n.current = window.setTimeout(() => {
      n.current = 0, o.current?.();
    }, t));
  }, [r, t]);
  return k(() => r, [r]), { schedule: w, cancel: r, preloadNow: s };
}
export {
  h as F,
  c as a,
  q as b,
  B as c,
  A as d,
  O as e,
  T as f,
  M as g,
  j as h,
  I as i,
  i as j,
  z as k,
  E as l,
  H as m,
  U as n,
  W as u
};
