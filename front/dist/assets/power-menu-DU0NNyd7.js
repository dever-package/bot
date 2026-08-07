import { c as f } from "./createLucideIcon-fWv1XcFy.js";
import { h as l, g as m } from "./runtime-entry-ClkZDmNs.js";
const g = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
], C = f("moon", g);
const y = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
], z = f("sun", y);
function A({
  iconName: e,
  iconImage: t,
  fallbackIcon: r,
  className: i,
  strokeWidth: c
}) {
  const s = String(t || "").trim();
  if (s)
    return l("img", {
      src: s,
      alt: "",
      "aria-hidden": !0,
      draggable: !1,
      className: i
    });
  const p = h(e, r);
  return l(p, { className: i, strokeWidth: c });
}
function h(e, t) {
  const r = M(e);
  return w(r) || t;
}
function w(e) {
  if (!e)
    return null;
  try {
    const t = m("@/lib/icon").resolveLucideIcon, r = t?.(e);
    if (r)
      return r;
  } catch {
  }
  return null;
}
function M(e) {
  const t = String(e || "").trim();
  return !t || t === "-" ? "" : t.replace(/^i-lucide-/i, "").replace(/^lucide[:/\\-]/i, "").replace(/Icon$/i, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/--+/g, "-").replace(/^-|-$/g, "").toLowerCase();
}
const I = 1, u = 2;
function E(e) {
  const t = k(e) ? e : {};
  return {
    id: a(t.id),
    name: b(t.name || t.value) || "未命名分组",
    type: a(t.type) === u ? u : I,
    status: a(t.status) === 2 ? 2 : 1,
    sort: a(t.sort, 100)
  };
}
function L(e, t, r) {
  const i = new Map(
    t.filter((n) => n.id > 0).map((n) => [n.id, n])
  ), c = /* @__PURE__ */ new Map(), s = [];
  for (const n of e) {
    const o = i.get(r(n));
    if (o?.status !== 2 && o?.type === u) {
      const d = c.get(o.id) || [];
      d.push(n), c.set(o.id, d);
      continue;
    }
    s.push(n);
  }
  const p = t.filter(
    (n) => n.status !== 2 && n.type === u && (c.get(n.id)?.length || 0) > 0
  ).sort((n, o) => n.sort - o.sort || n.id - o.id).map((n) => ({
    category: n,
    powers: c.get(n.id) || []
  }));
  return { basicPowers: s, groups: p };
}
function R(e) {
  return [
    ...e.basicPowers,
    ...e.groups.flatMap((t) => t.powers)
  ];
}
function k(e) {
  return !!(e && typeof e == "object" && !Array.isArray(e));
}
function b(e) {
  return typeof e == "string" ? e.trim() : "";
}
function a(e, t = 0) {
  const r = Number(e);
  return Number.isFinite(r) ? r : t;
}
export {
  A as C,
  C as M,
  z as S,
  L as b,
  R as f,
  E as n,
  h as r
};
