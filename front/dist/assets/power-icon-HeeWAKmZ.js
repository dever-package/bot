import { j as y } from "./preloadable-Bomi5PEU.js";
import { n as b, a6 as v, a3 as P, a2 as I, a7 as M, b as _, W as C, l as T, a8 as k, a9 as S, aa as L } from "./vendor-icons-B3DKX3la.js";
import { c as g } from "./_commonjsHelpers-61wyk6v6.js";
const h = 1, l = 2;
function V(o) {
  const e = x(o) ? o : {};
  return {
    id: d(e.id),
    name: A(e.name || e.value) || "未命名分组",
    type: d(e.type) === l ? l : h,
    status: d(e.status) === 2 ? 2 : 1,
    sort: d(e.sort, 100)
  };
}
function W(o, e, t) {
  const i = new Map(
    e.filter((n) => n.id > 0).map((n) => [n.id, n])
  ), r = /* @__PURE__ */ new Map(), s = [];
  for (const n of o) {
    const u = i.get(t(n));
    if (u?.status !== 2 && u?.type === l) {
      const w = r.get(u.id) || [];
      w.push(n), r.set(u.id, w);
      continue;
    }
    s.push(n);
  }
  const a = e.filter(
    (n) => n.status !== 2 && n.type === l && (r.get(n.id)?.length || 0) > 0
  ).sort((n, u) => n.sort - u.sort || n.id - u.id).map((n) => ({
    category: n,
    powers: r.get(n.id) || []
  }));
  return { basicPowers: s, groups: a };
}
function Y(o) {
  return [
    ...o.basicPowers,
    ...o.groups.flatMap((e) => e.powers)
  ];
}
function x(o) {
  return !!(o && typeof o == "object" && !Array.isArray(o));
}
function A(o) {
  return typeof o == "string" ? o.trim() : "";
}
function d(o, e = 0) {
  const t = Number(o);
  return Number.isFinite(t) ? t : e;
}
await window.DeverFront?.ensureCompat?.(["@/lib/icon"]);
const m = window.DeverFront?.sdk?.getCompatModule("@/lib/icon");
if (!m || Object.keys(m).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/icon");
function j({
  iconName: o,
  iconImage: e,
  fallbackIcon: t,
  className: i,
  strokeWidth: r
}) {
  const s = String(e || "").trim();
  if (s)
    return g("img", {
      src: s,
      alt: "",
      "aria-hidden": !0,
      draggable: !1,
      className: i
    });
  const a = f(o, t);
  return g(a, { className: i, strokeWidth: r });
}
function f(o, e) {
  const t = O(o);
  return E(t) || e;
}
function E(o) {
  if (!o)
    return null;
  try {
    const e = m.resolveLucideIcon, t = e?.(o);
    if (t)
      return t;
  } catch {
  }
  return null;
}
function O(o) {
  const e = String(o || "").trim();
  return !e || e === "-" ? "" : e.replace(/^i-lucide-/i, "").replace(/^lucide[:/\\-]/i, "").replace(/Icon$/i, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/--+/g, "-").replace(/^-|-$/g, "").toLowerCase();
}
const z = {
  general: { name: "通用", viewMode: "content" },
  storyboard: { name: "分镜脚本", viewMode: "storyboard" },
  storyboard_grid: { name: "宫格", viewMode: "storyboard_grid" },
  speech: { name: "语音合成", viewMode: "content" },
  lip_sync: { name: "口型同步", viewMode: "content" },
  video_compose: { name: "视频合成", viewMode: "video_compose" }
}, B = {
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
function p(o, e = "", t = "") {
  const i = c(o?.kind || e) || "text", r = c(t || o?.outputType) || "general", s = z[r], a = c(o?.output?.key) === r ? o?.output : void 0;
  return {
    outputType: r,
    outputName: i === "text" || i === "llm" || r !== "general" ? String(a?.name || "").trim() || s?.name || r : "",
    kindName: R(i),
    viewMode: c(a?.viewMode) || s?.viewMode || "content"
  };
}
function U(o, e = "", t = "") {
  return p(o, e, t).viewMode === "storyboard";
}
function $(o, e = "", t = "") {
  return p(o, e, t).viewMode === "video_compose";
}
function Z(o, e = "", t = "") {
  return p(o, e, t).viewMode === "storyboard_grid";
}
function q(o, e = "") {
  const t = c(o?.kind || e);
  return t === "audio" || t === "music";
}
function R(o) {
  const e = c(o) || "text";
  return B[e] || "文本";
}
function c(o) {
  return String(o || "").trim().toLowerCase();
}
function H({
  power: o,
  kind: e,
  outputType: t,
  size: i,
  className: r
}) {
  const s = p(o, e, t), a = F(s.outputType) || K(o?.kind || e || ""), n = f(o?.icon, a);
  return /* @__PURE__ */ y(n, { size: i, className: r });
}
function F(o) {
  return String(o).trim().toLowerCase() === "storyboard" ? b : null;
}
function J({
  name: o,
  size: e,
  className: t
}) {
  const i = f(o, L);
  return /* @__PURE__ */ y(i, { size: e, className: t });
}
function K(o) {
  const e = String(o || "").toLowerCase();
  return e === "text" || e === "llm" ? v : e === "image" ? P : e === "video" ? I : e === "audio" || e === "music" ? M : e === "file" ? _ : e === "workflow" ? C : e === "role" || e === "agent" ? T : e === "multi" ? k : S;
}
export {
  j as C,
  H as P,
  U as a,
  W as b,
  f as c,
  J as d,
  q as e,
  Z as f,
  Y as g,
  $ as i,
  V as n,
  p as r
};
