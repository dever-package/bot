import { a as h } from "./_commonjsHelpers-CTFd9u1x.js";
import { m } from "./stream-Y1y6FALE.js";
import { m as k } from "./content-view-DKqPlRti.js";
import { m as b } from "./in-flight-request-DlB1DJg0.js";
await window.DeverFront?.ensureCompat?.(["@/lib/agent/runner"]);
const u = window.DeverFront?.sdk?.getCompatModule("@/lib/agent/runner");
if (!u || Object.keys(u).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/agent/runner");
await window.DeverFront?.ensureCompat?.(["@/lib/page-schema-reload"]);
const f = window.DeverFront?.sdk?.getCompatModule("@/lib/page-schema-reload");
if (!f || Object.keys(f).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/page-schema-reload");
const p = m.streamValueText, w = k.EnergonContentView;
function B({
  output: n,
  streaming: t = !1,
  emptyText: e = "等待智能体返回。"
}) {
  return /* @__PURE__ */ h(
    w,
    {
      output: n,
      streaming: t,
      emptyText: e
    }
  );
}
function E(n) {
  const t = p(n).trim();
  return !t || j(t) || t.includes("```") || y(t) ? t : $(t);
}
function j(n) {
  const t = p(n).trim();
  return t ? !!(t.includes("```agent-interaction") || t.includes("```agent-action") || t.includes("```agent-result") || t.includes("```agent-output")) : !1;
}
function y(n) {
  const t = n.split(/\n/).map((e) => e.trim()).filter(Boolean);
  return t.length >= 3 ? !0 : t.some(
    (e) => /^(#{1,6}\s+|\d{1,2}\.\s+|[-*]\s+)/.test(e)
  );
}
function $(n) {
  let t = n.replace(/[ \t]+/g, " ");
  return t = t.replace(/([：:。！？!?；;])(?=\d{1,2}\.[^\d\s])/g, `$1

`), t = t.replace(
    /([^\n])(\d{1,2})\.([^\s\d])/g,
    (e, r, o, a) => `${r}

${o}. ${a}`
  ), t = t.replace(
    /(^|\n)(\d{1,2})\.\s*([^\n-]{2,42})\s*-\s*/g,
    (e, r, o, a) => `${r}${o}. ${a.trim()}
- `
  ), t = t.replace(/(^|\n)(\d{1,2})\.([^\s])/g, "$1$2. $3"), t = t.replace(/([：:。！？!?；;])\s*-\s*/g, `$1
- `), t = t.replace(/\n-\s*/g, `
- `), t = t.replace(/\n{3,}/g, `

`), t.trim();
}
const S = b.request;
function d(n) {
  return !!n && typeof n == "object" && !Array.isArray(n);
}
async function F(n, t) {
  const e = await S(n, "post", t);
  if (!d(e))
    return {};
  const r = Number(e.status || 0), o = Number(e.code || 0);
  if (r === 2 || o === 401) {
    const a = String(e.msg || e.message || "请求失败").trim();
    throw new Error(a || "请求失败");
  }
  return d(e.data) ? e.data : {};
}
const g = m.streamValueText;
function J(n) {
  const t = D(n), e = t ? x(t) : null;
  if (!t || !e)
    return null;
  const r = s(e.patch) ? e.patch : s(e.draft) ? e.draft : null;
  if (!r)
    return null;
  const o = i(e, "draft_id", "draftId", "id") || i(t, "draft_id", "draftId", "id"), a = i(e, "pack_id", "packId") || i(t, "pack_id", "packId"), c = i(e, "cate_id", "cateId") || i(t, "cate_id", "cateId");
  return {
    ...o > 0 ? { id: o } : {},
    ...a > 0 ? { pack_id: a } : {},
    ...c > 0 ? { cate_id: c } : {},
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
    (o) => s(o) && (s(o.patch) || s(o.draft))
  ) || null;
}
function D(n) {
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
  for (const e of O(n))
    for (const r of A(e)) {
      const o = C(r);
      if (o)
        return o;
    }
  return null;
}
function l(n) {
  return g(n.kind || n.type || n.event).trim().toLowerCase() === "skill_draft_patch" || s(n.patch) || s(n.draft);
}
function O(n) {
  const t = [], e = (o) => {
    const a = g(o).trim();
    a && !t.includes(a) && t.push(a);
  };
  e(n.text), e(n.markdown), e(n.message);
  const r = s(n.content) ? n.content : null;
  return r && (e(r.text), e(r.markdown), e(r.message)), t;
}
function A(n) {
  const t = [];
  for (const e of n.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)) {
    const r = e[1]?.trim();
    r && t.push(r);
  }
  return t.push(...P(n)), t.length === 0 && t.push(n), [...new Set(t)];
}
function P(n) {
  const t = [];
  for (let e = 0; e < n.length; e += 1) {
    if (n[e] !== "{")
      continue;
    const r = _(n, e);
    r && (t.push(r), e += r.length - 1);
  }
  return t;
}
function _(n, t) {
  let e = 0, r = !1, o = !1;
  for (let a = t; a < n.length; a += 1) {
    const c = n[a];
    if (r && o) {
      o = !1;
      continue;
    }
    if (r && c === "\\") {
      o = !0;
      continue;
    }
    if (c === '"') {
      r = !r;
      continue;
    }
    if (!r) {
      if (c === "{")
        e += 1;
      else if (c === "}" && (e -= 1, e === 0))
        return n.slice(t, a + 1);
    }
  }
  return "";
}
function C(n) {
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
  B as A,
  F as a,
  f as b,
  E as c,
  d as i,
  u as m,
  J as r
};
