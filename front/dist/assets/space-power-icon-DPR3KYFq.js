import { c as n, j as i } from "./createLucideIcon-CEtb6KSk.js";
import { S as u } from "./sparkles-BKIkAh44.js";
import { B as f } from "./brain-DIfmyuwv.js";
import { F as d } from "./file-text-CclNuHuN.js";
import { I as l } from "./image-BBD2HfB8.js";
import { M as y } from "./music-DzobwfHt.js";
import { W as k, U as h } from "./workflow-Cs2Tatpf.js";
import { V as g } from "./video-BAp8-tqb.js";
import { r as a } from "./configured-icon-BkvRvz03.js";
import { r as I } from "./upload-asset-api-DAbIOMVJ.js";
const w = [
  [
    "path",
    { d: "M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z", key: "1tn4o7" }
  ],
  ["path", { d: "m6.2 5.3 3.1 3.9", key: "iuk76l" }],
  ["path", { d: "m12.4 3.4 3.1 4", key: "6hsd6n" }],
  ["path", { d: "M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z", key: "ltgou9" }]
], M = n("clapperboard", w);
const x = [
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["path", { d: "M19 7h-9", key: "6i9tg" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
], v = n("settings-2", x);
const C = [
  ["path", { d: "M12 4v16", key: "1654pz" }],
  ["path", { d: "M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2", key: "e0r10z" }],
  ["path", { d: "M9 20h6", key: "s66wpe" }]
], P = n("type", C);
function K({
  power: o,
  kind: r,
  outputType: t,
  size: e,
  className: c
}) {
  const s = I(o, r, t), m = _(s.outputType) || b(o?.kind || r || ""), p = a(o?.icon, m);
  return /* @__PURE__ */ i(p, { size: e, className: c });
}
function _(o) {
  return String(o).trim().toLowerCase() === "storyboard" ? M : null;
}
function U({
  name: o,
  size: r,
  className: t
}) {
  const e = a(o, v);
  return /* @__PURE__ */ i(e, { size: r, className: t });
}
function b(o) {
  const r = String(o || "").toLowerCase();
  return r === "text" || r === "llm" ? P : r === "image" ? l : r === "video" ? g : r === "audio" || r === "music" ? y : r === "file" ? d : r === "workflow" ? k : r === "role" || r === "agent" ? h : r === "multi" ? u : f;
}
export {
  M as C,
  K as P,
  P as T,
  U as a
};
