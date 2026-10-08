import { j as w } from "./react-CDpwMNlY.js";
await window.DeverFront?.ensureCompat?.(["@/lib/stream", "@/components/energon/content-view"]);
const l = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!l || Object.keys(l).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const g = l.streamValueText, u = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!u || Object.keys(u).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const b = u.EnergonContentView;
function P({
  output: e,
  streaming: t = !1,
  emptyText: n = "等待智能体返回。"
}) {
  return /* @__PURE__ */ w(
    b,
    {
      output: e,
      streaming: t,
      emptyText: n
    }
  );
}
function N(e) {
  const t = g(e).trim();
  return !t || k(t) || t.includes("```") || j(t) ? t : y(t);
}
function k(e) {
  const t = g(e).trim();
  return t ? !!(t.includes("```agent-interaction") || t.includes("```agent-action") || t.includes("```agent-result") || t.includes("```agent-output")) : !1;
}
function j(e) {
  const t = e.split(/\n/).map((n) => n.trim()).filter(Boolean);
  return t.length >= 3 ? !0 : t.some(
    (n) => /^(#{1,6}\s+|\d{1,2}\.\s+|[-*]\s+)/.test(n)
  );
}
function y(e) {
  let t = e.replace(/[ \t]+/g, " ");
  return t = t.replace(/([：:。！？!?；;])(?=\d{1,2}\.[^\d\s])/g, `$1

`), t = t.replace(
    /([^\n])(\d{1,2})\.([^\s\d])/g,
    (n, r, o, c) => `${r}

${o}. ${c}`
  ), t = t.replace(
    /(^|\n)(\d{1,2})\.\s*([^\n-]{2,42})\s*-\s*/g,
    (n, r, o, c) => `${r}${o}. ${c.trim()}
- `
  ), t = t.replace(/(^|\n)(\d{1,2})\.([^\s])/g, "$1$2. $3"), t = t.replace(/([：:。！？!?；;])\s*-\s*/g, `$1
- `), t = t.replace(/\n-\s*/g, `
- `), t = t.replace(/\n{3,}/g, `

`), t.trim();
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const f = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!f || Object.keys(f).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const _ = f.request;
function p(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
async function T(e, t) {
  const n = await _(e, "post", t);
  if (!p(n))
    return {};
  const r = Number(n.status || 0), o = Number(n.code || 0);
  if (r === 2 || o === 401) {
    const c = String(n.msg || n.message || "请求失败").trim();
    throw new Error(c || "请求失败");
  }
  return p(n.data) ? n.data : {};
}
await window.DeverFront?.ensureCompat?.(["@/lib/stream"]);
const d = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!d || Object.keys(d).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const h = d.streamValueText;
function I(e) {
  const t = C(e), n = t ? v(t) : null;
  if (!t || !n)
    return null;
  const r = s(n.patch) ? n.patch : s(n.draft) ? n.draft : null;
  if (!r)
    return null;
  const o = a(n, "draft_id", "draftId", "id") || a(t, "draft_id", "draftId", "id"), c = a(n, "pack_id", "packId") || a(t, "pack_id", "packId"), i = a(n, "cate_id", "cateId") || a(t, "cate_id", "cateId");
  return {
    ...o > 0 ? { id: o } : {},
    ...c > 0 ? { pack_id: c } : {},
    ...i > 0 ? { cate_id: i } : {},
    patch: r
  };
}
function v(e) {
  const t = s(e.result) ? e.result : null, n = s(e.content) ? e.content : null;
  return [
    e,
    s(e.json) ? e.json : null,
    n && s(n.json) ? n.json : null,
    t,
    t && s(t.json) ? t.json : null
  ].find(
    (o) => s(o) && (s(o.patch) || s(o.draft))
  ) || null;
}
function C(e) {
  const t = [
    e,
    s(e.json) ? e.json : null,
    s(e.content) && s(e.content.json) ? e.content.json : null,
    s(e.result) ? e.result : null,
    s(e.result) && s(e.result.json) ? e.result.json : null
  ];
  for (const n of t)
    if (s(n) && m(n))
      return n;
  for (const n of D(e))
    for (const r of S(n)) {
      const o = $(r);
      if (o)
        return o;
    }
  return null;
}
function m(e) {
  return h(e.kind || e.type || e.event).trim().toLowerCase() === "skill_draft_patch" || s(e.patch) || s(e.draft);
}
function D(e) {
  const t = [], n = (o) => {
    const c = h(o).trim();
    c && !t.includes(c) && t.push(c);
  };
  n(e.text), n(e.markdown), n(e.message);
  const r = s(e.content) ? e.content : null;
  return r && (n(r.text), n(r.markdown), n(r.message)), t;
}
function S(e) {
  const t = [];
  for (const n of e.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)) {
    const r = n[1]?.trim();
    r && t.push(r);
  }
  return t.push(...x(e)), t.length === 0 && t.push(e), [...new Set(t)];
}
function x(e) {
  const t = [];
  for (let n = 0; n < e.length; n += 1) {
    if (e[n] !== "{")
      continue;
    const r = O(e, n);
    r && (t.push(r), n += r.length - 1);
  }
  return t;
}
function O(e, t) {
  let n = 0, r = !1, o = !1;
  for (let c = t; c < e.length; c += 1) {
    const i = e[c];
    if (r && o) {
      o = !1;
      continue;
    }
    if (r && i === "\\") {
      o = !0;
      continue;
    }
    if (i === '"') {
      r = !r;
      continue;
    }
    if (!r) {
      if (i === "{")
        n += 1;
      else if (i === "}" && (n -= 1, n === 0))
        return e.slice(t, c + 1);
    }
  }
  return "";
}
function $(e) {
  try {
    const t = JSON.parse(e);
    if (Array.isArray(t))
      return t.find(
        (n) => s(n) && m(n)
      ) || null;
    if (s(t) && m(t))
      return t;
  } catch {
    return null;
  }
  return null;
}
function a(e, ...t) {
  for (const n of t) {
    if (!Object.prototype.hasOwnProperty.call(e, n))
      continue;
    const r = Number(e[n] || 0);
    if (Number.isFinite(r) && r > 0)
      return r;
  }
  return 0;
}
function s(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
export {
  P as A,
  T as a,
  N as b,
  p as i,
  I as r
};
