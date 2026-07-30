import { c as f } from "./createLucideIcon-Gw0gLVQ5.js";
const w = [
  ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1", key: "1wp1u1" }],
  ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", key: "1s80jp" }],
  ["path", { d: "M10 12h4", key: "a56b0p" }]
], b = f("archive", w), y = 1, a = 2;
function g(e) {
  const o = h(e) ? e : {};
  return {
    id: i(o.id),
    name: P(o.name || o.value) || "未命名分组",
    type: i(o.type) === a ? a : y,
    status: i(o.status) === 2 ? 2 : 1,
    sort: i(o.sort, 100)
  };
}
function _(e, o, s) {
  const u = new Map(
    o.filter((t) => t.id > 0).map((t) => [t.id, t])
  ), n = /* @__PURE__ */ new Map(), c = [];
  for (const t of e) {
    const r = u.get(s(t));
    if (r?.status !== 2 && r?.type === a) {
      const p = n.get(r.id) || [];
      p.push(t), n.set(r.id, p);
      continue;
    }
    c.push(t);
  }
  const d = o.filter(
    (t) => t.status !== 2 && t.type === a && (n.get(t.id)?.length || 0) > 0
  ).sort((t, r) => t.sort - r.sort || t.id - r.id).map((t) => ({
    category: t,
    powers: n.get(t.id) || []
  }));
  return { basicPowers: c, groups: d };
}
function A(e) {
  return [
    ...e.basicPowers,
    ...e.groups.flatMap((o) => o.powers)
  ];
}
function h(e) {
  return !!(e && typeof e == "object" && !Array.isArray(e));
}
function P(e) {
  return typeof e == "string" ? e.trim() : "";
}
function i(e, o = 0) {
  const s = Number(e);
  return Number.isFinite(s) ? s : o;
}
export {
  b as A,
  _ as b,
  A as f,
  g as n
};
