import { j as g } from "./space-storyboard-material-ECvLpyk_.js";
import { a5 as w, a8 as I, a9 as b, aa as P, ab as y, b as C, W as M, l as _, ac as h, ad as z, ae as E } from "./vendor-icons-BZHLe0mm.js";
import { c as m } from "./file-kind-Cq3pESGF.js";
import { r as S } from "./space-assistant-layout-Drz4je9C.js";
const k = 1, l = 2;
function D(r) {
  const e = v(r) ? r : {};
  return {
    id: u(e.id),
    name: A(e.name || e.value) || "未命名分组",
    type: u(e.type) === l ? l : k,
    status: u(e.status) === 2 ? 2 : 1,
    sort: u(e.sort, 100)
  };
}
function G(r, e, n) {
  const o = new Map(
    e.filter((t) => t.id > 0).map((t) => [t.id, t])
  ), i = /* @__PURE__ */ new Map(), a = [];
  for (const t of r) {
    const s = o.get(n(t));
    if (s?.status !== 2 && s?.type === l) {
      const d = i.get(s.id) || [];
      d.push(t), i.set(s.id, d);
      continue;
    }
    a.push(t);
  }
  const c = e.filter(
    (t) => t.status !== 2 && t.type === l && (i.get(t.id)?.length || 0) > 0
  ).sort((t, s) => t.sort - s.sort || t.id - s.id).map((t) => ({
    category: t,
    powers: i.get(t.id) || []
  }));
  return { basicPowers: a, groups: c };
}
function W(r) {
  return [
    ...r.basicPowers,
    ...r.groups.flatMap((e) => e.powers)
  ];
}
function v(r) {
  return !!(r && typeof r == "object" && !Array.isArray(r));
}
function A(r) {
  return typeof r == "string" ? r.trim() : "";
}
function u(r, e = 0) {
  const n = Number(r);
  return Number.isFinite(n) ? n : e;
}
await window.DeverFront?.ensureCompat?.(["@/lib/icon"]);
const f = window.DeverFront?.sdk?.getCompatModule("@/lib/icon");
if (!f || Object.keys(f).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/icon");
function Y({
  iconName: r,
  iconImage: e,
  fallbackIcon: n,
  className: o,
  strokeWidth: i
}) {
  const a = String(e || "").trim();
  if (a)
    return m("img", {
      src: a,
      alt: "",
      "aria-hidden": !0,
      draggable: !1,
      className: o
    });
  const c = p(r, n);
  return m(c, { className: o, strokeWidth: i });
}
function p(r, e) {
  const n = O(r);
  return L(n) || e;
}
function L(r) {
  if (!r)
    return null;
  try {
    const e = f.resolveLucideIcon, n = e?.(r);
    if (n)
      return n;
  } catch {
  }
  return null;
}
function O(r) {
  const e = String(r || "").trim();
  return !e || e === "-" ? "" : e.replace(/^i-lucide-/i, "").replace(/^lucide[:/\\-]/i, "").replace(/Icon$/i, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/--+/g, "-").replace(/^-|-$/g, "").toLowerCase();
}
function $({
  power: r,
  kind: e,
  outputType: n,
  size: o,
  className: i
}) {
  const a = S(r, e, n), c = T(a.outputType) || x(r?.kind || e || ""), t = p(r?.icon, c);
  return /* @__PURE__ */ g(t, { size: o, className: i });
}
function T(r) {
  return String(r).trim().toLowerCase() === "storyboard" ? w : null;
}
function V({
  name: r,
  size: e,
  className: n
}) {
  const o = p(r, E);
  return /* @__PURE__ */ g(o, { size: e, className: n });
}
function x(r) {
  const e = String(r || "").toLowerCase();
  return e === "text" || e === "llm" ? I : e === "image" ? b : e === "video" ? P : e === "audio" || e === "music" ? y : e === "file" ? C : e === "workflow" ? M : e === "role" || e === "agent" ? _ : e === "multi" ? h : z;
}
export {
  Y as C,
  $ as P,
  V as a,
  G as b,
  W as f,
  D as n,
  p as r
};
