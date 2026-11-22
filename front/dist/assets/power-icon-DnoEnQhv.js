import { j as l } from "./preloadable-R-5sHdlM.js";
import { a5 as f, a7 as m, a8 as p, a9 as g, aa as I, b as w, W as C, l as b, ab as v, ac as k, ad as z } from "./vendor-icons-IZIW7U43.js";
import { c as s } from "./file-kind-Cq3pESGF.js";
import { r as L } from "./space-assistant-layout-B9KyeCM0.js";
await window.DeverFront?.ensureCompat?.(["@/lib/icon"]);
const c = window.DeverFront?.sdk?.getCompatModule("@/lib/icon");
if (!c || Object.keys(c).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/icon");
function j({
  iconName: r,
  iconImage: e,
  fallbackIcon: n,
  className: o,
  strokeWidth: i
}) {
  const t = String(e || "").trim();
  if (t)
    return s("img", {
      src: t,
      alt: "",
      "aria-hidden": !0,
      draggable: !1,
      className: o
    });
  const a = u(r, n);
  return s(a, { className: o, strokeWidth: i });
}
function u(r, e) {
  const n = h(r);
  return S(n) || e;
}
function S(r) {
  if (!r)
    return null;
  try {
    const e = c.resolveLucideIcon, n = e?.(r);
    if (n)
      return n;
  } catch {
  }
  return null;
}
function h(r) {
  const e = String(r || "").trim();
  return !e || e === "-" ? "" : e.replace(/^i-lucide-/i, "").replace(/^lucide[:/\\-]/i, "").replace(/Icon$/i, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/--+/g, "-").replace(/^-|-$/g, "").toLowerCase();
}
function T({
  power: r,
  kind: e,
  outputType: n,
  size: o,
  className: i
}) {
  const t = L(r, e, n), a = P(t.outputType) || x(r?.kind || e || ""), d = u(r?.icon, a);
  return /* @__PURE__ */ l(d, { size: o, className: i });
}
function P(r) {
  return String(r).trim().toLowerCase() === "storyboard" ? f : null;
}
function _({
  name: r,
  size: e,
  className: n
}) {
  const o = u(r, z);
  return /* @__PURE__ */ l(o, { size: e, className: n });
}
function x(r) {
  const e = String(r || "").toLowerCase();
  return e === "text" || e === "llm" ? m : e === "image" ? p : e === "video" ? g : e === "audio" || e === "music" ? I : e === "file" ? w : e === "workflow" ? C : e === "role" || e === "agent" ? b : e === "multi" ? v : k;
}
export {
  j as C,
  T as P,
  _ as a,
  u as r
};
