import { a as p, j as d } from "./space-storyboard-material-ECvLpyk_.js";
import { X as f } from "./vendor-icons-BZHLe0mm.js";
import { q as S, b as m, h as l, d as w } from "./file-kind-Cq3pESGF.js";
const v = {
  general: { name: "通用", viewMode: "content" },
  setting: { name: "设定", viewMode: "setting" },
  storyboard: { name: "分镜脚本", viewMode: "storyboard" },
  story: { name: "故事", viewMode: "writing" },
  storyboard_grid: { name: "宫格", viewMode: "storyboard_grid" },
  speech: { name: "语音合成", viewMode: "content" },
  video_compose: { name: "视频合成", viewMode: "video_compose" }
}, P = {
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
function c(e, t = "", n = "") {
  const r = s(e?.kind || t) || "text", o = s(n || e?.outputType) || "general", a = v[o], u = s(e?.output?.key) === o ? e?.output : void 0;
  return {
    outputType: o,
    outputName: r === "text" || r === "llm" || o !== "general" ? String(u?.name || "").trim() || a?.name || o : "",
    kindName: T(r),
    viewMode: s(u?.viewMode) || a?.viewMode || "content"
  };
}
function R(e, t = "", n = "") {
  return c(e, t, n).viewMode === "storyboard";
}
function C(e, t = "", n = "") {
  return c(e, t, n).viewMode === "video_compose";
}
function O(e, t = "", n = "") {
  return c(e, t, n).viewMode === "storyboard_grid";
}
function x(e, t = "") {
  const n = s(e?.kind || t);
  return n === "audio" || n === "music";
}
function T(e) {
  const t = s(e) || "text";
  return P[t] || "文本";
}
function s(e) {
  return String(e || "").trim().toLowerCase();
}
function I(e, t = "", n = "") {
  return c(e, t, n).viewMode === "writing";
}
function D({
  message: e,
  onDismiss: t,
  floating: n = !1
}) {
  return e ? /* @__PURE__ */ p(
    "div",
    {
      className: `ws-operation-error nodrag nowheel${n ? " is-floating" : ""}`,
      role: "alert",
      onPointerDown: (r) => r.stopPropagation(),
      children: [
        /* @__PURE__ */ d("span", { children: e }),
        /* @__PURE__ */ d("button", { type: "button", "aria-label": "关闭错误提示", onClick: t, children: /* @__PURE__ */ d(f, { size: 14 }) })
      ]
    }
  ) : null;
}
const i = window.ReactDOM || {}, k = i.createPortal, L = i.flushSync;
i.preconnect;
i.prefetchDNS;
i.preinit;
i.preinitModule;
i.preload;
i.preloadModule;
i.requestFormReset;
i.unstable_batchedUpdates;
i.useFormState;
i.useFormStatus;
i.version;
function W() {
  const e = /* @__PURE__ */ new Map();
  return (t, n) => {
    const r = e.get(t);
    if (r)
      return r;
    let o;
    return o = Promise.resolve().then(n).finally(() => {
      e.get(t) === o && e.delete(t);
    }), e.set(t, o), o;
  };
}
const g = 2;
function F(e) {
  return Number(e) === g;
}
function K(e, t, n) {
  const r = String(e ?? "").trim(), o = String(t ?? "").trim();
  return r || o || n;
}
function q(e, t) {
  if (!Object.prototype.hasOwnProperty.call(e, t))
    return e;
  const n = { ...e };
  return delete n[t], n;
}
function _(e) {
  return e?.status === "running" || e?.status === "waiting";
}
function z(e) {
  return _(e) ? {} : {
    statusText: void 0,
    executionPhase: void 0,
    queuePosition: void 0,
    reconnecting: void 0,
    generatedCount: void 0,
    targetCount: void 0
  };
}
function U(e) {
  let t;
  const n = () => (t || (t = e().catch((r) => {
    throw t = void 0, r;
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
function j(e, t) {
  return {
    Component: S(
      () => e.load().then((n) => ({ default: t(n) }))
    ),
    preload: e.preload
  };
}
function V(e, t = 140) {
  const n = m(0), r = m(e);
  r.current = e;
  const o = l(() => {
    n.current && (window.clearTimeout(n.current), n.current = 0);
  }, []), a = l(() => {
    o(), r.current?.();
  }, [o]), u = l(() => {
    o(), r.current && (n.current = window.setTimeout(() => {
      n.current = 0, r.current?.();
    }, t));
  }, [o, t]);
  return w(() => o, [o]), { schedule: u, cancel: o, preloadNow: a };
}
const A = 520, b = 440, h = 720, G = "bot.canvasAssistant.width", H = "bot.canvasAssistant.open";
function Y(e) {
  return Number.isFinite(e) ? Math.min(
    h,
    Math.max(b, Math.round(e))
  ) : A;
}
function B(e, t) {
  const n = e && t;
  return {
    launcherVisible: e && !n,
    panelVisible: n
  };
}
function X(e) {
  return e === "1";
}
export {
  i as R,
  D as S,
  U as a,
  W as b,
  k as c,
  j as d,
  K as e,
  Y as f,
  _ as g,
  C as h,
  F as i,
  I as j,
  R as k,
  x as l,
  z as m,
  B as n,
  H as o,
  A as p,
  G as q,
  c as r,
  X as s,
  q as t,
  O as u,
  L as v,
  V as w
};
