import { r as w, j as g } from "./react-5Z-wsVEn.js";
import { O as I, a9 as b, a7 as P, a6 as y, aa as C, b as M, W as _, l as h, ab as z, ac as E, ad as O } from "./vendor-icons-fVDtJt66.js";
import { c as m } from "./file-kind-D6bMOzYN.js";
const S = 1, l = 2;
function j(r) {
  const e = k(r) ? r : {};
  return {
    id: u(e.id),
    name: v(e.name || e.value) || "未命名分组",
    type: u(e.type) === l ? l : S,
    status: u(e.status) === 2 ? 2 : 1,
    sort: u(e.sort, 100)
  };
}
function D(r, e, t) {
  const o = new Map(
    e.filter((n) => n.id > 0).map((n) => [n.id, n])
  ), i = /* @__PURE__ */ new Map(), s = [];
  for (const n of r) {
    const a = o.get(t(n));
    if (a?.status !== 2 && a?.type === l) {
      const p = i.get(a.id) || [];
      p.push(n), i.set(a.id, p);
      continue;
    }
    s.push(n);
  }
  const c = e.filter(
    (n) => n.status !== 2 && n.type === l && (i.get(n.id)?.length || 0) > 0
  ).sort((n, a) => n.sort - a.sort || n.id - a.id).map((n) => ({
    category: n,
    powers: i.get(n.id) || []
  }));
  return { basicPowers: s, groups: c };
}
function G(r) {
  return [
    ...r.basicPowers,
    ...r.groups.flatMap((e) => e.powers)
  ];
}
function k(r) {
  return !!(r && typeof r == "object" && !Array.isArray(r));
}
function v(r) {
  return typeof r == "string" ? r.trim() : "";
}
function u(r, e = 0) {
  const t = Number(r);
  return Number.isFinite(t) ? t : e;
}
await window.DeverFront?.ensureCompat?.(["@/lib/icon"]);
const d = window.DeverFront?.sdk?.getCompatModule("@/lib/icon");
if (!d || Object.keys(d).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/icon");
function W({
  iconName: r,
  iconImage: e,
  fallbackIcon: t,
  className: o,
  strokeWidth: i
}) {
  const s = String(e || "").trim();
  if (s)
    return m("img", {
      src: s,
      alt: "",
      "aria-hidden": !0,
      draggable: !1,
      className: o
    });
  const c = f(r, t);
  return m(c, { className: o, strokeWidth: i });
}
function f(r, e) {
  const t = L(r);
  return A(t) || e;
}
function A(r) {
  if (!r)
    return null;
  try {
    const e = d.resolveLucideIcon, t = e?.(r);
    if (t)
      return t;
  } catch {
  }
  return null;
}
function L(r) {
  const e = String(r || "").trim();
  return !e || e === "-" ? "" : e.replace(/^i-lucide-/i, "").replace(/^lucide[:/\\-]/i, "").replace(/Icon$/i, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/--+/g, "-").replace(/^-|-$/g, "").toLowerCase();
}
function Y({
  power: r,
  kind: e,
  outputType: t,
  size: o,
  className: i
}) {
  const s = w(r, e, t), c = T(s.outputType) || x(r?.kind || e || ""), n = f(r?.icon, c);
  return /* @__PURE__ */ g(n, { size: o, className: i });
}
function T(r) {
  return String(r).trim().toLowerCase() === "storyboard" ? I : null;
}
function $({
  name: r,
  size: e,
  className: t
}) {
  const o = f(r, O);
  return /* @__PURE__ */ g(o, { size: e, className: t });
}
function x(r) {
  const e = String(r || "").toLowerCase();
  return e === "text" || e === "llm" ? b : e === "image" ? P : e === "video" ? y : e === "audio" || e === "music" ? C : e === "file" ? M : e === "workflow" ? _ : e === "role" || e === "agent" ? h : e === "multi" ? z : E;
}
export {
  W as C,
  Y as P,
  $ as a,
  D as b,
  G as f,
  j as n,
  f as r
};
