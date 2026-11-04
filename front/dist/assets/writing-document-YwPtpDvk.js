import { i as d, p as u } from "./content-view-0gIO2Kkv.js";
import { e as q } from "./space-loading-FH4pJ97O.js";
const p = 30, W = 10, k = 100;
function P(t) {
  return Number.isInteger(t) && t >= 1 && t <= k ? "" : `正文章数须为 1 到 ${k} 的整数`;
}
const v = 20, h = 74, S = /* @__PURE__ */ new WeakMap();
function C(t) {
  const i = t.map((e, n) => ({
    unit: e,
    ordinal: n + 1,
    label: `第 ${n + 1} 章`,
    searchTitle: e.title.toLocaleLowerCase()
  }));
  return {
    canonical: i,
    reversed: [...i].reverse(),
    byId: new Map(i.map((e) => [e.unit.id, e])),
    firstUnwritten: i.findIndex((e) => !e.unit.has_body),
    pendingPlans: i.filter(({ unit: e }) => !e.has_body && e.plan_stale)
  };
}
function l(t) {
  let i = S.get(t);
  return i || (i = C(t), S.set(t, i)), i;
}
function tt(t, i) {
  const e = i.trim().toLocaleLowerCase();
  return e ? t.reversed.filter((n) => n.searchTitle.includes(e)) : t.reversed;
}
function it(t, i) {
  const e = Math.max(1, Math.ceil(t.length / p)), n = Math.max(0, Math.min(e - 1, i));
  return {
    page: n,
    pages: e,
    rows: t.slice(
      n * p,
      (n + 1) * p
    ),
    start: t.length ? n * p + 1 : 0,
    end: Math.min(t.length, (n + 1) * p),
    total: t.length
  };
}
function et(t, i, e) {
  const n = Math.max(
    0,
    Math.floor(i / h) - 3
  ), r = Math.min(
    t,
    Math.ceil((i + e) / h) + 3
  );
  return {
    start: Math.min(n, t),
    end: r,
    height: t * h
  };
}
function nt(t) {
  if (!t.length) return "";
  const i = t.map((e) => e.ordinal);
  return t.length === 1 ? `第 ${i[0]} 章` : `第 ${Math.min(...i)}—${Math.max(...i)} 章 · ${t.length} 章`;
}
function rt(t, i = W) {
  if (P(i)) return [];
  const e = l(t), n = e.firstUnwritten;
  if (n < 0) return [];
  const r = [], s = i;
  for (let o = n; o < e.canonical.length && r.length < s; o += 1) {
    const a = e.canonical[o];
    if (a.unit.has_body) break;
    r.push(a);
  }
  return r;
}
function st(t) {
  return l(t).pendingPlans;
}
function ot(t, i, e) {
  const n = i > 0 ? Math.max(0, i - t.length) : v, r = e === void 0 ? Math.min(n, v) : e;
  return { start: t.length + 1, end: t.length + r, count: r };
}
const M = [
  { value: "natural", label: "自然流畅" },
  { value: "restrained", label: "冷峻克制" },
  { value: "vivid", label: "细腻沉浸" },
  { value: "humorous", label: "轻松诙谐" }
], O = [
  { value: "first", label: "第一人称" },
  { value: "third_limited", label: "第三人称限定" },
  { value: "omniscient", label: "全知视角" }
], A = [
  { value: "complete", label: "完整故事" },
  { value: "serial", label: "连载小说" }
];
function B(t) {
  return d(t) ? typeof t.genre == "string" && typeof t.style_instructions == "string" && [
    ["style", M],
    ["pov", O],
    ["mode", A]
  ].every(
    ([i, e]) => t[i] === "" || e.some((n) => n.value === t[i])
  ) && [t.chapter_words, t.planned_chapters].every(
    (i) => typeof i == "number" && Number.isSafeInteger(i) && i >= 0
  ) : !1;
}
const y = [
  { id: "overview", label: "故事总纲" },
  { id: "world", label: "环境与规则" }
];
function R(t) {
  return y.some((i) => i.id === t);
}
function $(t) {
  return y.every(({ id: i }) => !!t[i].trim()) && t.characters.length > 0 && t.locations.length > 0 && [t.characters, t.locations, t.props].every(
    (i) => i.every(
      (e) => !!(e.name.trim() && e.description.trim())
    )
  );
}
function U(t) {
  return $(t.outline);
}
const L = {
  title: "故事",
  unit: "章",
  directory: "章节",
  append: "章节"
}, N = [
  { id: "inspiration", label: "灵感" },
  { id: "outline", label: "大纲" },
  { id: "characters", label: "人物" },
  { id: "locations", label: "地点" },
  { id: "props", label: "道具" }
], dt = N.filter(
  (t) => t.id === "characters" || t.id === "locations" || t.id === "props"
);
function V(t) {
  if (t.kind === "entity") return t.section;
  if (t.kind === "section")
    return t.id === "characters" || t.id === "locations" || t.id === "props" ? t.id : void 0;
}
function at(t, i) {
  return i.kind === "section" ? !0 : i.kind === "entity" ? t.outline[i.section].some(
    (e) => e.id === i.id
  ) : t.units.some((e) => e.id === i.id);
}
function I(t) {
  const i = u(t);
  if (!d(i)) return null;
  const e = u(i.json ?? i);
  return d(e) ? e : null;
}
function b(t, i) {
  return Object.keys(t).every((e) => i.includes(e));
}
function w(t) {
  return !d(t) || !b(t, ["id", "unit_type", "title", "plan", "children", "asset_id", "version_id", "has_body", "continuity_valid", "continuity_index", "continuity_status", "continuity_findings", "dependency_stale", "plan_stale"]) ? !1 : typeof t.id == "string" && typeof t.title == "string" && typeof t.plan == "string" && typeof t.has_body == "boolean" && (t.plan_stale === void 0 || typeof t.plan_stale == "boolean") && t.unit_type === "chapter" && Array.isArray(t.children) && t.children.length === 0;
}
function j(t) {
  return !d(t) || !b(t, ["overview", "world", "characters", "locations", "props"]) ? !1 : y.every(({ id: i }) => typeof t[i] == "string") && ["characters", "locations", "props"].every(
    (i) => Array.isArray(t[i]) && t[i].every(
      (e) => d(e) && typeof e.id == "string" && typeof e.name == "string" && typeof e.description == "string"
    )
  );
}
function c(t) {
  const i = I(t);
  return !i || i.type !== "story" || i.schema_version !== 1 || typeof i.title != "string" || !b(i, ["type", "schema_version", "title", "preferences", "inspirations", "selected_inspiration_id", "outline", "units", "archived_units", "status", "active_run_id", "active_request_id"]) || !B(i.preferences) || typeof i.selected_inspiration_id != "string" || !Array.isArray(i.inspirations) || !i.inspirations.every(
    (e) => d(e) && typeof e.id == "string" && typeof e.title == "string" && typeof e.content == "string"
  ) || !j(i.outline) || !Array.isArray(i.units) || !i.units.every(w) || !Array.isArray(i.archived_units) || !i.archived_units.every(w) ? null : i;
}
function ct(t) {
  const i = I(t);
  return i?.type === "writing_unit" && i.schema_version === 1 && typeof i.body == "string" ? i : null;
}
function _t(t) {
  return x(t.resultOutput) ? !0 : Number(t.asset?.id || t.resultRef?.asset_id) > 0 && !!(c(t.asset?.version?.content) || q(t.power, t.kind, t.outputType));
}
function D(t, i) {
  return l(t).byId.get(i)?.label || "";
}
function ut(t, i, e) {
  return t.map((n) => n.id === i ? { ...n, ...e } : n);
}
function pt(t, i) {
  if (i.kind === "unit") {
    const e = l(t.units).byId.get(
      i.id
    )?.unit;
    return e ? `${D(t.units, e.id)} · ${e.title}` : "正文";
  }
  return i.kind === "entity" ? t.outline[i.section].find(
    (e) => e.id === i.id
  )?.name || "素材" : [...N, ...y].find(
    (e) => e.id === i.id
  )?.label || L.directory;
}
function ft(t, i, e = "") {
  return i.kind === "unit" ? i.tab === "plan" ? l(t.units).byId.get(i.id)?.unit.plan || "" : e : i.kind === "entity" ? t.outline[i.section].find(
    (n) => n.id === i.id
  )?.description || "" : R(i.id) ? t.outline[i.id] : "";
}
function lt(t) {
  return t.has_body ? t.continuity_status === "raw_pending" && !t.dependency_stale ? "已写 · 记忆待补" : t.continuity_status === "pending" || t.dependency_stale ? "衔接待整理" : "已写" : t.plan_stale ? "剧情待同步" : "待写";
}
function gt(t) {
  return t ? JSON.stringify([t.kind, t.ids]) : "";
}
function J(t) {
  return !d(t) || !["body", "unit_id", "request_id", "updated_at"].every(
    (i) => typeof t[i] == "string"
  ) || !Number.isSafeInteger(t.run_id) ? !1 : t.units === void 0 ? !0 : Array.isArray(t.units) && t.units.length > 0 && t.units.every(
    (i) => w(i) && i.title.trim() && i.plan.trim() && !i.asset_id && !i.version_id && !i.has_body && !i.continuity_valid && !i.dependency_stale && !i.plan_stale
  ) && Number.isSafeInteger(t.expected_count) && Number(t.expected_count) > 0 && typeof t.complete == "boolean" && (t.accepted_count === void 0 || Number.isSafeInteger(t.accepted_count) && Number(t.accepted_count) >= 0 && Number(t.accepted_count) <= t.units.length && Number(t.accepted_count) < Number(t.expected_count));
}
function yt(t) {
  const i = t?.checkpoint, e = i?.draft;
  return !t || t.document.status === "running" || !e?.units?.length || e.run_id !== t.run_id || e.request_id !== i?.request_id || t.document.active_run_id !== t.run_id ? void 0 : i.action === "generate_chapters" || i.action === "append" || i.action === "generate_outline" && i.phase === "chapters" ? e : void 0;
}
function T(t) {
  if (!d(t)) return;
  const i = t.unit_ids;
  if (!(typeof t.action != "string" || !["generate_inspirations", "generate_outline", "generate_chapters", "generate_units", "generate_section", "propose_edit", "append", "retry_continuity"].includes(t.action) || t.action === "generate_outline" && !["preferences", "direction", "characters", "background", "chapters"].includes(String(t.phase)) || t.action === "generate_units" && t.phase !== "body" && t.phase !== "continuity" || t.action === "retry_continuity" && t.phase !== "continuity" || typeof t.unit_id != "string" || !Array.isArray(i) || !i.every((e) => typeof e == "string" && !!e.trim()) || new Set(i).size !== i.length || !Number.isSafeInteger(t.completed) || Number(t.completed) < 0 || !Number.isSafeInteger(t.target) || Number(t.target) < 0 || typeof t.issued != "boolean" || t.correction_count !== void 0 && t.correction_count !== 0 && t.correction_count !== 1 || t.phase !== void 0 && !["preferences", "direction", "characters", "background", "chapters", "body", "continuity"].includes(String(t.phase)) || t.continuity_unit_id !== void 0 && typeof t.continuity_unit_id != "string" || ["history_completed", "history_total"].some((e) => t[e] !== void 0 && (!Number.isSafeInteger(t[e]) || Number(t[e]) < 0)) || t.draft !== void 0 && !J(t.draft) || t.section_id !== void 0 && t.section_id !== "" && !["inspiration", "overview", "world", "characters", "locations", "props", "chapter_plan"].includes(String(t.section_id)) || [
    "instruction",
    "request_id",
    "selected_text",
    "section_id",
    "entity_id",
    "inspiration_id"
  ].some(
    (e) => t[e] !== void 0 && typeof t[e] != "string"
  ) || t.count !== void 0 && (!Number.isSafeInteger(t.count) || Number(t.count) < 0)))
    return {
      ...t,
      action: t.action,
      instruction: t.instruction,
      count: t.count,
      selected_text: t.selected_text,
      section_id: t.section_id,
      entity_id: t.entity_id,
      inspiration_id: t.inspiration_id,
      unit_id: t.unit_id,
      unit_ids: i,
      completed: Number(t.completed),
      target: Number(t.target),
      issued: t.issued
    };
}
function E(t) {
  const i = u(t);
  if (!d(i)) return null;
  const e = i, n = c(e.document);
  return n && Number(e.work_asset_id) > 0 && Number(e.work_version_id) > 0 && Number.isSafeInteger(e.work_revision) && Number(e.work_revision) >= 0 ? {
    ...e,
    document: n,
    checkpoint: T(e.checkpoint),
    proposal: z(e.proposal)
  } : null;
}
function x(t) {
  const i = u(t);
  return d(i) ? E(i.writing) : null;
}
function ht(t, i, e) {
  const n = x(i), r = t.resultRef?.asset_id || t.asset?.id, s = Math.max(
    t.asset?.id === r && t.asset?.version_id || 0,
    t.resultRef?.asset_id === r && t.resultRef?.version_id || 0
  ), o = t.asset?.version, a = (t.asset?.id === r && o && o.id === s ? c(o.content) : null) || c(i);
  if (!a || !r || !s) return n;
  const _ = f(o), g = {
    work_asset_id: r,
    work_version_id: s,
    work_revision: _,
    work_version: o?.version,
    work_updated_at: o?.updated_at || o?.created_at,
    document: a,
    run_id: a.active_run_id,
    request_id: a.active_request_id,
    status: a.status,
    ...e?.work_asset_id === r && e.work_version_id === s && e.work_revision === _ && e.run_id === a.active_run_id && e.request_id === a.active_request_id ? { checkpoint: e.checkpoint, proposal: e.proposal } : {}
  };
  return n && n.work_asset_id === r && n.work_version_id === s && n.work_revision >= _ ? n : G(n, g);
}
function z(t) {
  if (!(!d(t) || typeof t.run_id != "number" || typeof t.work_asset_id != "number" || typeof t.work_version_id != "number" || !Number.isSafeInteger(t.work_revision) || Number(t.work_revision) < 0 || typeof t.replacement != "string") && ![
    "unit_id",
    "section_id",
    "entity_id",
    "inspiration_id",
    "selected_text"
  ].some((i) => t[i] !== void 0 && typeof t[i] != "string") && !(t.unit_version_id !== void 0 && typeof t.unit_version_id != "number"))
    return {
      run_id: t.run_id,
      work_asset_id: t.work_asset_id,
      work_version_id: t.work_version_id,
      work_revision: Number(t.work_revision),
      replacement: t.replacement,
      unit_id: t.unit_id,
      unit_version_id: t.unit_version_id,
      section_id: t.section_id,
      entity_id: t.entity_id,
      inspiration_id: t.inspiration_id,
      selected_text: t.selected_text
    };
}
function F(t) {
  return d(t) ? Object.entries(t).every(([i, e]) => /^preferences\.(chapter_words|planned_chapters)$/.test(i) ? typeof e == "number" && Number.isSafeInteger(e) && e >= 0 : /^outline\.(characters|locations|props)\.\d+\.id$/.test(i) && typeof e == "string") : !1;
}
function wt(t) {
  const i = u(t);
  if (!d(i) || !d(i.writing_preview))
    return null;
  const e = i.writing_preview;
  return typeof e.work_asset_id != "number" || typeof e.run_id != "number" || typeof e.request_id != "string" || typeof e.step_request_id != "string" || typeof e.active_field != "string" || e.phase !== void 0 && e.phase !== "" && !["preferences", "direction", "characters", "background", "chapters", "body", "continuity"].includes(String(e.phase)) || !d(e.fields) || !Object.values(e.fields).every((n) => typeof n == "string") || e.values !== void 0 && !F(e.values) || e.completed_sections !== void 0 && (!Array.isArray(e.completed_sections) || !e.completed_sections.every((n) => ["world", "locations", "props"].includes(n)) || new Set(e.completed_sections).size !== e.completed_sections.length) || (e.active_field === "" ? Object.keys(e.fields).length > 0 : !Object.prototype.hasOwnProperty.call(e.fields, e.active_field)) || ["unit_id", "section_id", "entity_id", "inspiration_id"].some(
    (n) => e[n] !== void 0 && typeof e[n] != "string"
  ) ? null : {
    work_asset_id: e.work_asset_id,
    run_id: e.run_id,
    request_id: e.request_id,
    step_request_id: e.step_request_id,
    phase: e.phase,
    active_field: e.active_field,
    fields: e.fields,
    values: e.values,
    completed_sections: e.completed_sections,
    unit_id: e.unit_id,
    section_id: e.section_id,
    entity_id: e.entity_id,
    inspiration_id: e.inspiration_id
  };
}
function m(t) {
  const i = t?.checkpoint, e = i?.draft, n = Number(e?.accepted_count);
  return !t || t.document.status !== "running" || !i || !e || !Number.isSafeInteger(n) || n <= 0 || !e.units || n > e.units.length || n >= Number(i.count) || e.expected_count !== i.count || e.run_id !== t.run_id || e.request_id !== i.request_id || i.work_asset_id !== t.work_asset_id || i.work_version_id !== t.work_version_id || i.work_revision !== t.work_revision || !(i.action === "generate_chapters" || i.action === "append" || i.action === "generate_outline" && i.phase === "chapters") ? 0 : n;
}
function mt(t) {
  const i = m(t), e = t?.checkpoint, n = e?.draft;
  if (!t || !e || !n?.units || !i) return null;
  const r = {};
  for (const [s, o] of n.units.slice(0, i).entries())
    r[`units.${s}.title`] = o.title, r[`units.${s}.plan`] = o.plan;
  return {
    work_asset_id: t.work_asset_id,
    run_id: t.run_id,
    request_id: t.request_id,
    step_request_id: e.request_id || "",
    phase: e.phase,
    unit_id: e.unit_id,
    section_id: e.section_id,
    entity_id: e.entity_id,
    inspiration_id: e.inspiration_id,
    fields: r,
    active_field: `units.${i - 1}.plan`
  };
}
function bt(t, i) {
  if (!t || !i || i.document.status !== "running" || t.work_asset_id !== i.work_asset_id || t.run_id !== i.run_id || t.request_id !== i.request_id)
    return !1;
  const e = i.checkpoint;
  if (!e || !e.issued || (t.phase || "") !== (e.phase || "") || e.request_id && t.step_request_id !== e.request_id) return !1;
  const n = e.phase === "continuity" && e.continuity_unit_id || e.unit_id;
  return !n || t.unit_id === n;
}
function H(t, i) {
  const e = t.checkpoint, n = i.checkpoint;
  return !e || !n ? !1 : t.document.status === "running" && i.document.status === "running" && i.work_asset_id === t.work_asset_id && i.work_version_id === t.work_version_id && i.work_revision === t.work_revision && i.run_id === t.run_id && i.request_id === t.request_id && n.action === e.action && n.phase === e.phase && n.completed === e.completed && n.target === e.target && JSON.stringify(n.unit_ids) === JSON.stringify(e.unit_ids) && ["unit_id", "continuity_unit_id", "section_id", "entity_id", "inspiration_id", "selected_text"].every(
    (r) => (n[r] || "") === (e[r] || "")
  );
}
function K(t, i) {
  const e = t.checkpoint, n = i.checkpoint, r = m(t), s = e?.correction_count || 0;
  if (!e || !n || !r && !s || !H(t, i))
    return !1;
  const o = m(i), a = r > 0 && (!n.count || n.count === e.count), _ = (n.count || 0) === (e.count || 0), g = n.correction_count || 0;
  return a && o < r || _ && g < s ? !0 : o === r && g === s && e.issued && !n.issued && (a || _ && s > 0);
}
function G(t, i) {
  return !t || t.work_asset_id !== i.work_asset_id ? i : i.work_version_id < t.work_version_id || i.work_version_id === t.work_version_id && (i.work_revision < t.work_revision || i.work_revision === t.work_revision && t.run_id > i.run_id) || K(t, i) || JSON.stringify(t) === JSON.stringify(i) ? t : i;
}
function kt(t, i) {
  if (!t || !((t.outputType || t.power?.outputType) === "story" || c(t.asset?.version?.content)))
    return !1;
  const e = t.asset?.id || t.resultRef?.asset_id, n = i.asset?.id || i.resultRef?.asset_id, r = t.asset?.version_id || t.resultRef?.version_id || 0, s = i.asset?.version_id || i.resultRef?.version_id || 0;
  return !!(e && e === n && s > 0 && (s < r || s === r && c(i.asset?.version?.content) && f(i.asset?.version) < f(t.asset?.version)));
}
function vt(t, i) {
  return t.id === i.id && (t.version_id > i.version_id || t.version_id === i.version_id && !!c(i.version?.content) && f(t.version) > f(i.version)) && !!c(t.version?.content);
}
function f(t) {
  const i = u(t?.content);
  return d(i) ? Number(i.writing_revision || 0) : 0;
}
function St(t, i, e) {
  const n = V(i);
  let r;
  if (n)
    r = {
      ...t,
      outline: {
        ...t.outline,
        [n]: [
          ...t.outline[n],
          { id: `new:${crypto.randomUUID()}`, name: e.title, description: e.description }
        ]
      }
    };
  else {
    const s = {
      id: `new:${crypto.randomUUID()}`,
      unit_type: "chapter",
      title: e.title,
      plan: e.description,
      children: [],
      asset_id: 0,
      version_id: 0,
      has_body: !1,
      continuity_valid: !1,
      dependency_stale: !1
    };
    r = { ...t, units: [...t.units, s] };
  }
  return r;
}
function Q(t) {
  return t.inspirations.find(
    (i) => i.id === t.selected_inspiration_id
  );
}
function Nt(t, i) {
  const e = t.inspirations.find((n) => n.id === i);
  return !!(e?.title.trim() && e.content.trim() && !t.selected_inspiration_id);
}
function It(t) {
  return Q(t) ? U(t) ? t.units.length ? "body" : "chapters" : "outline" : "inspiration";
}
function xt(t) {
  return { kind: "section", id: "overview" };
}
export {
  W as A,
  st as B,
  v as C,
  ot as D,
  rt as E,
  k as F,
  P as G,
  h as H,
  et as I,
  U as J,
  tt as K,
  yt as L,
  bt as M,
  kt as N,
  x as O,
  G as P,
  D as Q,
  gt as R,
  E as S,
  T,
  vt as U,
  mt as V,
  wt as W,
  B as X,
  y as Y,
  dt as Z,
  L as a,
  ht as b,
  Nt as c,
  l as d,
  xt as e,
  at as f,
  c as g,
  _t as h,
  f as i,
  V as j,
  St as k,
  ft as l,
  R as m,
  p as n,
  nt as o,
  ct as p,
  lt as q,
  M as r,
  Q as s,
  O as t,
  ut as u,
  A as v,
  It as w,
  it as x,
  N as y,
  pt as z
};
