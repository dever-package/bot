import { g as m, r as k } from "./runtime-entry-CkPHMDB1.js";
import { j as b } from "./createLucideIcon-Gw0gLVQ5.js";
import { m as p } from "./stream-DlOGAsXV.js";
import { m as j } from "./content-view-BWYCBIVh.js";
const f = m("@/lib/agent/runner");
if (!f || Object.keys(f).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/agent/runner");
const u = m("@/lib/page-schema-reload");
if (!u || Object.keys(u).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/page-schema-reload");
const h = p.streamValueText, y = j.EnergonContentView;
function E({
  output: n,
  streaming: t = !1,
  emptyText: e = "等待智能体返回。"
}) {
  return /* @__PURE__ */ b(
    y,
    {
      output: n,
      streaming: t,
      emptyText: e
    }
  );
}
function J(n) {
  const t = h(n).trim();
  return !t || S(t) || t.includes("```") || $(t) ? t : w(t);
}
function S(n) {
  const t = h(n).trim();
  return t ? !!(t.includes("```agent-interaction") || t.includes("```agent-action") || t.includes("```agent-result") || t.includes("```agent-output")) : !1;
}
function $(n) {
  const t = n.split(/\n/).map((e) => e.trim()).filter(Boolean);
  return t.length >= 3 ? !0 : t.some(
    (e) => /^(#{1,6}\s+|\d{1,2}\.\s+|[-*]\s+)/.test(e)
  );
}
function w(n) {
  let t = n.replace(/[ \t]+/g, " ");
  return t = t.replace(/([：:。！？!?；;])(?=\d{1,2}\.[^\d\s])/g, `$1

`), t = t.replace(
    /([^\n])(\d{1,2})\.([^\s\d])/g,
    (e, r, c, o) => `${r}

${c}. ${o}`
  ), t = t.replace(
    /(^|\n)(\d{1,2})\.\s*([^\n-]{2,42})\s*-\s*/g,
    (e, r, c, o) => `${r}${c}. ${o.trim()}
- `
  ), t = t.replace(/(^|\n)(\d{1,2})\.([^\s])/g, "$1$2. $3"), t = t.replace(/([：:。！？!?；;])\s*-\s*/g, `$1
- `), t = t.replace(/\n-\s*/g, `
- `), t = t.replace(/\n{3,}/g, `

`), t.trim();
}
function d(n) {
  return !!n && typeof n == "object" && !Array.isArray(n);
}
async function R(n, t) {
  const e = await k(n, "post", t);
  if (!d(e))
    return {};
  const r = Number(e.status || 0), c = Number(e.code || 0);
  if (r === 2 || c === 401) {
    const o = String(e.msg || e.message || "请求失败").trim();
    throw new Error(o || "请求失败");
  }
  return d(e.data) ? e.data : {};
}
const g = p.streamValueText;
function V(n) {
  const t = O(n), e = t ? x(t) : null;
  if (!t || !e)
    return null;
  const r = s(e.patch) ? e.patch : s(e.draft) ? e.draft : null;
  if (!r)
    return null;
  const c = i(e, "draft_id", "draftId", "id") || i(t, "draft_id", "draftId", "id"), o = i(e, "pack_id", "packId") || i(t, "pack_id", "packId"), a = i(e, "cate_id", "cateId") || i(t, "cate_id", "cateId");
  return {
    ...c > 0 ? { id: c } : {},
    ...o > 0 ? { pack_id: o } : {},
    ...a > 0 ? { cate_id: a } : {},
    patch: r
  };
}
function x(n) {
  const t = s(n.result) ? n.result : null, e = s(n.content) ? n.content : null;
  return [
    n,
    s(n.json) ? n.json : null,
    e && s(e.json) ? e.json : null,
    t,
    t && s(t.json) ? t.json : null
  ].find(
    (c) => s(c) && (s(c.patch) || s(c.draft))
  ) || null;
}
function O(n) {
  const t = [
    n,
    s(n.json) ? n.json : null,
    s(n.content) && s(n.content.json) ? n.content.json : null,
    s(n.result) ? n.result : null,
    s(n.result) && s(n.result.json) ? n.result.json : null
  ];
  for (const e of t)
    if (s(e) && l(e))
      return e;
  for (const e of A(n))
    for (const r of P(e)) {
      const c = N(r);
      if (c)
        return c;
    }
  return null;
}
function l(n) {
  return g(n.kind || n.type || n.event).trim().toLowerCase() === "skill_draft_patch" || s(n.patch) || s(n.draft);
}
function A(n) {
  const t = [], e = (c) => {
    const o = g(c).trim();
    o && !t.includes(o) && t.push(o);
  };
  e(n.text), e(n.markdown), e(n.message);
  const r = s(n.content) ? n.content : null;
  return r && (e(r.text), e(r.markdown), e(r.message)), t;
}
function P(n) {
  const t = [];
  for (const e of n.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)) {
    const r = e[1]?.trim();
    r && t.push(r);
  }
  return t.push(..._(n)), t.length === 0 && t.push(n), [...new Set(t)];
}
function _(n) {
  const t = [];
  for (let e = 0; e < n.length; e += 1) {
    if (n[e] !== "{")
      continue;
    const r = D(n, e);
    r && (t.push(r), e += r.length - 1);
  }
  return t;
}
function D(n, t) {
  let e = 0, r = !1, c = !1;
  for (let o = t; o < n.length; o += 1) {
    const a = n[o];
    if (r && c) {
      c = !1;
      continue;
    }
    if (r && a === "\\") {
      c = !0;
      continue;
    }
    if (a === '"') {
      r = !r;
      continue;
    }
    if (!r) {
      if (a === "{")
        e += 1;
      else if (a === "}" && (e -= 1, e === 0))
        return n.slice(t, o + 1);
    }
  }
  return "";
}
function N(n) {
  try {
    const t = JSON.parse(n);
    if (Array.isArray(t))
      return t.find(
        (e) => s(e) && l(e)
      ) || null;
    if (s(t) && l(t))
      return t;
  } catch {
    return null;
  }
  return null;
}
function i(n, ...t) {
  for (const e of t) {
    if (!Object.prototype.hasOwnProperty.call(n, e))
      continue;
    const r = Number(n[e] || 0);
    if (Number.isFinite(r) && r > 0)
      return r;
  }
  return 0;
}
function s(n) {
  return !!n && typeof n == "object" && !Array.isArray(n);
}
export {
  E as A,
  R as a,
  u as b,
  J as c,
  d as i,
  f as m,
  V as r
};
