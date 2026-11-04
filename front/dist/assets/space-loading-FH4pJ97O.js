import { a as l, j as c } from "./preloadable-BrN58FXf.js";
import { a as m, d as p } from "./file-kind-BSFhe2vU.js";
import { r as w } from "./vendor-icons-UGaOWWu-.js";
const f = {
  general: { name: "通用", viewMode: "content" },
  storyboard: { name: "分镜脚本", viewMode: "storyboard" },
  story: { name: "故事", viewMode: "writing" },
  storyboard_grid: { name: "宫格", viewMode: "storyboard_grid" },
  speech: { name: "语音合成", viewMode: "content" },
  lip_sync: { name: "口型同步", viewMode: "content" },
  video_compose: { name: "视频合成", viewMode: "video_compose" }
}, v = {
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
function d(e, t = "", o = "") {
  const n = s(e?.kind || t) || "text", r = s(o || e?.outputType) || "general", a = f[r], u = s(e?.output?.key) === r ? e?.output : void 0;
  return {
    outputType: r,
    outputName: n === "text" || n === "llm" || r !== "general" ? String(u?.name || "").trim() || a?.name || r : "",
    kindName: g(n),
    viewMode: s(u?.viewMode) || a?.viewMode || "content"
  };
}
function _(e, t = "", o = "") {
  return d(e, t, o).viewMode === "storyboard";
}
function T(e, t = "", o = "") {
  return d(e, t, o).viewMode === "video_compose";
}
function h(e, t = "", o = "") {
  return d(e, t, o).viewMode === "storyboard_grid";
}
function L(e, t = "") {
  const o = s(e?.kind || t);
  return o === "audio" || o === "music";
}
function g(e) {
  const t = s(e) || "text";
  return v[t] || "文本";
}
function s(e) {
  return String(e || "").trim().toLowerCase();
}
function R(e, t = "", o = "") {
  return d(e, t, o).viewMode === "writing";
}
const i = window.ReactDOM || {}, x = i.createPortal, N = i.flushSync;
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
function C() {
  const e = /* @__PURE__ */ new Map();
  return (t, o) => {
    const n = e.get(t);
    if (n)
      return n;
    let r;
    return r = Promise.resolve().then(o).finally(() => {
      e.get(t) === r && e.delete(t);
    }), e.set(t, r), r;
  };
}
const M = 2;
function O(e) {
  return Number(e) === M;
}
function E(e, t, o) {
  const n = String(e ?? "").trim(), r = String(t ?? "").trim();
  return n || r || o;
}
function k({
  label: e,
  overlay: t = !1,
  compact: o = !1,
  delay: n = 160
}) {
  const [r, a] = m(n <= 0);
  return p(() => {
    if (n <= 0) {
      a(!0);
      return;
    }
    const u = window.setTimeout(() => a(!0), n);
    return () => window.clearTimeout(u);
  }, [n]), r ? /* @__PURE__ */ l(
    "div",
    {
      className: `ws-module-loading ${t ? "is-overlay" : ""} ${o ? "is-compact" : ""}`,
      role: "status",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ c(w, { size: 20, "aria-hidden": "true" }),
        /* @__PURE__ */ c("span", { children: e })
      ]
    }
  ) : null;
}
export {
  k as C,
  i as R,
  C as a,
  E as b,
  x as c,
  T as d,
  R as e,
  _ as f,
  L as g,
  h,
  O as i,
  N as j,
  d as r
};
