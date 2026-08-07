import { c as d, j as m } from "./createLucideIcon-fWv1XcFy.js";
import { S as l } from "./sparkles-hCbN2Dw6.js";
import { B as f } from "./brain-C0oaiNVY.js";
import { F as y } from "./file-text-GWInsYzS.js";
import { I as w, V as k } from "./first-frame-video-DlIx6mwp.js";
import { M as v } from "./music-DaWYUdzx.js";
import { W as g, U as M } from "./workflow-DCWxX26l.js";
import { r as p } from "./power-menu-DU0NNyd7.js";
const h = [
  [
    "path",
    { d: "M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z", key: "1tn4o7" }
  ],
  ["path", { d: "m6.2 5.3 3.1 3.9", key: "iuk76l" }],
  ["path", { d: "m12.4 3.4 3.1 4", key: "6hsd6n" }],
  ["path", { d: "M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z", key: "ltgou9" }]
], b = d("clapperboard", h);
const _ = [
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["path", { d: "M19 7h-9", key: "6i9tg" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
], T = d("settings-2", _);
const x = [
  ["path", { d: "M12 4v16", key: "1654pz" }],
  ["path", { d: "M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2", key: "e0r10z" }],
  ["path", { d: "M9 20h6", key: "s66wpe" }]
], P = d("type", x), I = {
  general: { name: "通用", viewMode: "content" },
  storyboard: { name: "分镜脚本", viewMode: "storyboard" },
  storyboard_grid: { name: "宫格", viewMode: "storyboard_grid" },
  speech: { name: "语音合成", viewMode: "content" },
  lip_sync: { name: "口型同步", viewMode: "content" },
  video_compose: { name: "视频合成", viewMode: "video_compose" }
}, S = {
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
function c(o, e = "", t = "") {
  const n = i(o?.kind || e) || "text", r = i(t || o?.outputType) || "general", a = I[r], s = i(o?.output?.key) === r ? o?.output : void 0;
  return {
    outputType: r,
    outputName: n === "text" || n === "llm" || r !== "general" ? String(s?.name || "").trim() || a?.name || r : "",
    kindName: L(n),
    viewMode: i(s?.viewMode) || a?.viewMode || "content"
  };
}
function E(o, e = "", t = "") {
  return c(o, e, t).viewMode === "storyboard";
}
function W(o, e = "", t = "") {
  return c(o, e, t).viewMode === "video_compose";
}
function j(o, e = "", t = "") {
  return c(o, e, t).viewMode === "storyboard_grid";
}
function H(o, e = "") {
  const t = i(o?.kind || e);
  return t === "audio" || t === "music";
}
function L(o) {
  const e = i(o) || "text";
  return S[e] || "文本";
}
function i(o) {
  return String(o || "").trim().toLowerCase();
}
function Z({
  power: o,
  kind: e,
  outputType: t,
  size: n,
  className: r
}) {
  const a = c(o, e, t), s = C(a.outputType) || z(o?.kind || e || ""), u = p(o?.icon, s);
  return /* @__PURE__ */ m(u, { size: n, className: r });
}
function C(o) {
  return String(o).trim().toLowerCase() === "storyboard" ? b : null;
}
function $({
  name: o,
  size: e,
  className: t
}) {
  const n = p(o, T);
  return /* @__PURE__ */ m(n, { size: e, className: t });
}
function z(o) {
  const e = String(o || "").toLowerCase();
  return e === "text" || e === "llm" ? P : e === "image" ? w : e === "video" ? k : e === "audio" || e === "music" ? v : e === "file" ? y : e === "workflow" ? g : e === "role" || e === "agent" ? M : e === "multi" ? l : f;
}
export {
  b as C,
  Z as P,
  P as T,
  $ as a,
  H as b,
  E as c,
  j as d,
  W as i,
  c as r
};
