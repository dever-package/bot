import { k as p, p as h, F as Q, V as lt, W as _t, X as pt, j as mt, Y as gt, Z as Te, l as yt, _ as De, $ as Re, h as _e, a0 as ht, s as F, g as Be, a1 as wt, a2 as $, a3 as bt, a4 as vt, a5 as kt, a6 as St, e as qe } from "./asset-preview-BZxHU4Mm.js";
import { i as It } from "./preloadable-CT3tMmBD.js";
import { c as xt } from "./react-5Z-wsVEn.js";
const U = 30, Rt = 10, Me = 100;
function Mt(e) {
  return Number.isInteger(e) && e >= 1 && e <= Me ? "" : `正文章数须为 1 到 ${Me} 的整数`;
}
const Pe = 20, te = 74, Ce = /* @__PURE__ */ new WeakMap();
function Pt(e) {
  const t = e.map((n, r) => ({
    unit: n,
    ordinal: r + 1,
    label: `第 ${r + 1} 章`,
    searchTitle: n.title.toLocaleLowerCase()
  }));
  return {
    canonical: t,
    reversed: [...t].reverse(),
    byId: new Map(t.map((n) => [n.unit.id, n])),
    firstUnwritten: t.findIndex((n) => !n.unit.has_body),
    pendingPlans: t.filter(({ unit: n }) => !n.has_body && n.plan_stale)
  };
}
function V(e) {
  let t = Ce.get(e);
  return t || (t = Pt(e), Ce.set(e, t)), t;
}
function jn(e, t) {
  const n = t.trim().toLocaleLowerCase();
  return n ? e.reversed.filter((r) => r.searchTitle.includes(n)) : e.reversed;
}
function zn(e, t) {
  const n = Math.max(1, Math.ceil(e.length / U)), r = Math.max(0, Math.min(n - 1, t));
  return {
    page: r,
    pages: n,
    rows: e.slice(
      r * U,
      (r + 1) * U
    ),
    start: e.length ? r * U + 1 : 0,
    end: Math.min(e.length, (r + 1) * U),
    total: e.length
  };
}
function Jn(e, t, n) {
  const r = Math.max(
    0,
    Math.floor(t / te) - 3
  ), i = Math.min(
    e,
    Math.ceil((t + n) / te) + 3
  );
  return {
    start: Math.min(r, e),
    end: i,
    height: e * te
  };
}
function Gn(e) {
  if (!e.length) return "";
  const t = e.map((n) => n.ordinal);
  return e.length === 1 ? `第 ${t[0]} 章` : `第 ${Math.min(...t)}—${Math.max(...t)} 章 · ${e.length} 章`;
}
function Hn(e, t = Rt) {
  if (Mt(t)) return [];
  const n = V(e), r = n.firstUnwritten;
  if (r < 0) return [];
  const i = [], s = t;
  for (let o = r; o < n.canonical.length && i.length < s; o += 1) {
    const c = n.canonical[o];
    if (c.unit.has_body) break;
    i.push(c);
  }
  return i;
}
function Yn(e) {
  return V(e).pendingPlans;
}
function Qn(e, t, n) {
  const r = t > 0 ? Math.max(0, t - e.length) : Pe, i = n === void 0 ? Math.min(r, Pe) : n;
  return { start: e.length + 1, end: e.length + i, count: i };
}
const Ct = [
  { value: "natural", label: "自然流畅" },
  { value: "restrained", label: "冷峻克制" },
  { value: "vivid", label: "细腻沉浸" },
  { value: "humorous", label: "轻松诙谐" }
], Nt = [
  { value: "first", label: "第一人称" },
  { value: "third_limited", label: "第三人称限定" },
  { value: "omniscient", label: "全知视角" }
], $t = [
  { value: "complete", label: "完整故事" },
  { value: "serial", label: "连载小说" }
];
function Ot(e) {
  return p(e) ? typeof e.genre == "string" && typeof e.style_instructions == "string" && [
    ["style", Ct],
    ["pov", Nt],
    ["mode", $t]
  ].every(
    ([t, n]) => e[t] === "" || n.some((r) => r.value === e[t])
  ) && [e.chapter_words, e.planned_chapters].every(
    (t) => typeof t == "number" && Number.isSafeInteger(t) && t >= 0
  ) : !1;
}
const X = [
  { id: "overview", label: "故事总纲" },
  { id: "world", label: "环境与规则" }
];
function Ut(e) {
  return X.some((t) => t.id === e);
}
function At(e) {
  return X.every(({ id: t }) => !!e[t].trim()) && e.characters.length > 0 && e.locations.length > 0 && [e.characters, e.locations, e.props].every(
    (t) => t.every(
      (n) => !!(n.name.trim() && n.description.trim())
    )
  );
}
function Ft(e) {
  return At(e.outline);
}
const Tt = {
  title: "故事",
  unit: "章",
  directory: "章节",
  append: "章节"
}, pe = [
  { id: "inspiration", label: "灵感" },
  { id: "outline", label: "大纲" },
  { id: "characters", label: "人物" },
  { id: "locations", label: "地点" },
  { id: "props", label: "道具" }
], Xn = pe.filter(
  (e) => e.id === "characters" || e.id === "locations" || e.id === "props"
);
function Dt(e) {
  if (e.kind === "entity") return e.section;
  if (e.kind === "section")
    return e.id === "characters" || e.id === "locations" || e.id === "props" ? e.id : void 0;
}
function Zn(e, t) {
  return t.kind === "section" ? !0 : t.kind === "entity" ? e.outline[t.section].some(
    (n) => n.id === t.id
  ) : e.units.some((n) => n.id === t.id);
}
function Le(e) {
  const t = h(e);
  if (!p(t)) return null;
  const n = h(t.json ?? t);
  return p(n) ? n : null;
}
function me(e, t) {
  return Object.keys(e).every((n) => t.includes(n));
}
function re(e) {
  return !p(e) || !me(e, ["id", "unit_type", "title", "plan", "children", "asset_id", "version_id", "has_body", "continuity_valid", "continuity_index", "continuity_status", "continuity_findings", "dependency_stale", "plan_stale"]) ? !1 : typeof e.id == "string" && typeof e.title == "string" && typeof e.plan == "string" && typeof e.has_body == "boolean" && (e.plan_stale === void 0 || typeof e.plan_stale == "boolean") && e.unit_type === "chapter" && Array.isArray(e.children) && e.children.length === 0;
}
function Bt(e) {
  return !p(e) || !me(e, ["overview", "world", "characters", "locations", "props"]) ? !1 : X.every(({ id: t }) => typeof e[t] == "string") && ["characters", "locations", "props"].every(
    (t) => Array.isArray(e[t]) && e[t].every(
      (n) => p(n) && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string"
    )
  );
}
function S(e) {
  const t = Le(e);
  return !t || t.type !== "story" || t.schema_version !== 1 || typeof t.title != "string" || !me(t, ["type", "schema_version", "title", "preferences", "inspirations", "selected_inspiration_id", "outline", "units", "archived_units", "status", "active_run_id", "active_request_id"]) || !Ot(t.preferences) || typeof t.selected_inspiration_id != "string" || !Array.isArray(t.inspirations) || !t.inspirations.every(
    (n) => p(n) && typeof n.id == "string" && typeof n.title == "string" && typeof n.content == "string"
  ) || !Bt(t.outline) || !Array.isArray(t.units) || !t.units.every(re) || !Array.isArray(t.archived_units) || !t.archived_units.every(re) ? null : t;
}
function er(e) {
  const t = Le(e);
  return t?.type === "writing_unit" && t.schema_version === 1 && typeof t.body == "string" ? t : null;
}
function tr(e) {
  return Ve(e.resultOutput) ? !0 : Number(e.asset?.id || e.resultRef?.asset_id) > 0 && !!(S(e.asset?.version?.content) || xt(e.power, e.kind, e.outputType));
}
function Ke(e, t) {
  return V(e).byId.get(t)?.label || "";
}
function nr(e, t, n) {
  return e.map((r) => r.id === t ? { ...r, ...n } : r);
}
function rr(e, t) {
  if (t.kind === "unit") {
    const n = V(e.units).byId.get(
      t.id
    )?.unit;
    return n ? `${Ke(e.units, n.id)} · ${n.title}` : "正文";
  }
  return t.kind === "entity" ? e.outline[t.section].find(
    (n) => n.id === t.id
  )?.name || "素材" : [...pe, ...X].find(
    (n) => n.id === t.id
  )?.label || Tt.directory;
}
function ir(e, t, n = "") {
  return t.kind === "unit" ? t.tab === "plan" ? V(e.units).byId.get(t.id)?.unit.plan || "" : n : t.kind === "entity" ? e.outline[t.section].find(
    (r) => r.id === t.id
  )?.description || "" : Ut(t.id) ? e.outline[t.id] : "";
}
function or(e) {
  return e.has_body ? e.continuity_status === "raw_pending" && !e.dependency_stale ? "已写 · 记忆待补" : e.continuity_status === "pending" || e.dependency_stale ? "衔接待整理" : "已写" : e.plan_stale ? "剧情待同步" : "待写";
}
function ge(e) {
  return e ? JSON.stringify([e.kind, e.ids]) : "";
}
function qt(e) {
  return !p(e) || !["body", "unit_id", "request_id", "updated_at"].every(
    (t) => typeof e[t] == "string"
  ) || !Number.isSafeInteger(e.run_id) ? !1 : e.units === void 0 ? !0 : Array.isArray(e.units) && e.units.length > 0 && e.units.every(
    (t) => re(t) && t.title.trim() && t.plan.trim() && !t.asset_id && !t.version_id && !t.has_body && !t.continuity_valid && !t.dependency_stale && !t.plan_stale
  ) && Number.isSafeInteger(e.expected_count) && Number(e.expected_count) > 0 && typeof e.complete == "boolean" && (e.accepted_count === void 0 || Number.isSafeInteger(e.accepted_count) && Number(e.accepted_count) >= 0 && Number(e.accepted_count) <= e.units.length && Number(e.accepted_count) < Number(e.expected_count));
}
function sr(e) {
  const t = e?.checkpoint, n = t?.draft;
  return !e || e.document.status === "running" || !n?.units?.length || n.run_id !== e.run_id || n.request_id !== t?.request_id || e.document.active_run_id !== e.run_id ? void 0 : t.action === "generate_chapters" || t.action === "append" || t.action === "generate_outline" && t.phase === "chapters" ? n : void 0;
}
function Lt(e) {
  if (!p(e)) return;
  const t = e.unit_ids;
  if (!(typeof e.action != "string" || !["generate_inspirations", "generate_outline", "generate_chapters", "generate_units", "generate_section", "propose_edit", "append", "retry_continuity"].includes(e.action) || e.action === "generate_outline" && !["preferences", "direction", "characters", "background", "chapters"].includes(String(e.phase)) || e.action === "generate_units" && e.phase !== "body" && e.phase !== "continuity" || e.action === "retry_continuity" && e.phase !== "continuity" || typeof e.unit_id != "string" || !Array.isArray(t) || !t.every((n) => typeof n == "string" && !!n.trim()) || new Set(t).size !== t.length || !Number.isSafeInteger(e.completed) || Number(e.completed) < 0 || !Number.isSafeInteger(e.target) || Number(e.target) < 0 || typeof e.issued != "boolean" || e.correction_count !== void 0 && e.correction_count !== 0 && e.correction_count !== 1 || e.phase !== void 0 && !["preferences", "direction", "characters", "background", "chapters", "body", "continuity"].includes(String(e.phase)) || e.continuity_unit_id !== void 0 && typeof e.continuity_unit_id != "string" || ["history_completed", "history_total"].some((n) => e[n] !== void 0 && (!Number.isSafeInteger(e[n]) || Number(e[n]) < 0)) || e.draft !== void 0 && !qt(e.draft) || e.section_id !== void 0 && e.section_id !== "" && !["inspiration", "overview", "world", "characters", "locations", "props", "chapter_plan"].includes(String(e.section_id)) || [
    "instruction",
    "request_id",
    "selected_text",
    "section_id",
    "entity_id",
    "inspiration_id"
  ].some(
    (n) => e[n] !== void 0 && typeof e[n] != "string"
  ) || e.count !== void 0 && (!Number.isSafeInteger(e.count) || Number(e.count) < 0)))
    return {
      ...e,
      action: e.action,
      instruction: e.instruction,
      count: e.count,
      selected_text: e.selected_text,
      section_id: e.section_id,
      entity_id: e.entity_id,
      inspiration_id: e.inspiration_id,
      unit_id: e.unit_id,
      unit_ids: t,
      completed: Number(e.completed),
      target: Number(e.target),
      issued: e.issued
    };
}
function Kt(e) {
  const t = h(e);
  if (!p(t)) return null;
  const n = t, r = S(n.document);
  return r && Number(n.work_asset_id) > 0 && Number(n.work_version_id) > 0 && Number.isSafeInteger(n.work_revision) && Number(n.work_revision) >= 0 ? {
    ...n,
    document: r,
    checkpoint: Lt(n.checkpoint),
    proposal: Vt(n.proposal)
  } : null;
}
function Ve(e) {
  const t = h(e);
  return p(t) ? Kt(t.writing) : null;
}
function ar(e, t, n) {
  const r = Ve(t), i = e.resultRef?.asset_id || e.asset?.id, s = Math.max(
    e.asset?.id === i && e.asset?.version_id || 0,
    e.resultRef?.asset_id === i && e.resultRef?.version_id || 0
  ), o = e.asset?.version, c = (e.asset?.id === i && o && o.id === s ? S(o.content) : null) || S(t);
  if (!c || !i || !s) return r;
  const a = B(o), f = {
    work_asset_id: i,
    work_version_id: s,
    work_revision: a,
    work_version: o?.version,
    work_updated_at: o?.updated_at || o?.created_at,
    document: c,
    run_id: c.active_run_id,
    request_id: c.active_request_id,
    status: c.status,
    ...n?.work_asset_id === i && n.work_version_id === s && n.work_revision === a && n.run_id === c.active_run_id && n.request_id === c.active_request_id ? { checkpoint: n.checkpoint, proposal: n.proposal } : {}
  };
  return r && r.work_asset_id === i && r.work_version_id === s && r.work_revision >= a ? r : zt(r, f);
}
function Vt(e) {
  if (!(!p(e) || typeof e.run_id != "number" || typeof e.work_asset_id != "number" || typeof e.work_version_id != "number" || !Number.isSafeInteger(e.work_revision) || Number(e.work_revision) < 0 || typeof e.replacement != "string") && ![
    "unit_id",
    "section_id",
    "entity_id",
    "inspiration_id",
    "selected_text"
  ].some((t) => e[t] !== void 0 && typeof e[t] != "string") && !(e.unit_version_id !== void 0 && typeof e.unit_version_id != "number"))
    return {
      run_id: e.run_id,
      work_asset_id: e.work_asset_id,
      work_version_id: e.work_version_id,
      work_revision: Number(e.work_revision),
      replacement: e.replacement,
      unit_id: e.unit_id,
      unit_version_id: e.unit_version_id,
      section_id: e.section_id,
      entity_id: e.entity_id,
      inspiration_id: e.inspiration_id,
      selected_text: e.selected_text
    };
}
function Wt(e) {
  return p(e) ? Object.entries(e).every(([t, n]) => /^preferences\.(chapter_words|planned_chapters)$/.test(t) ? typeof n == "number" && Number.isSafeInteger(n) && n >= 0 : /^outline\.(characters|locations|props)\.\d+\.id$/.test(t) && typeof n == "string") : !1;
}
function cr(e) {
  const t = h(e);
  if (!p(t) || !p(t.writing_preview))
    return null;
  const n = t.writing_preview;
  return typeof n.work_asset_id != "number" || typeof n.run_id != "number" || typeof n.request_id != "string" || typeof n.step_request_id != "string" || typeof n.active_field != "string" || n.phase !== void 0 && n.phase !== "" && !["preferences", "direction", "characters", "background", "chapters", "body", "continuity"].includes(String(n.phase)) || !p(n.fields) || !Object.values(n.fields).every((r) => typeof r == "string") || n.values !== void 0 && !Wt(n.values) || n.completed_sections !== void 0 && (!Array.isArray(n.completed_sections) || !n.completed_sections.every((r) => ["world", "locations", "props"].includes(r)) || new Set(n.completed_sections).size !== n.completed_sections.length) || (n.active_field === "" ? Object.keys(n.fields).length > 0 : !Object.prototype.hasOwnProperty.call(n.fields, n.active_field)) || ["unit_id", "section_id", "entity_id", "inspiration_id"].some(
    (r) => n[r] !== void 0 && typeof n[r] != "string"
  ) ? null : {
    work_asset_id: n.work_asset_id,
    run_id: n.run_id,
    request_id: n.request_id,
    step_request_id: n.step_request_id,
    phase: n.phase,
    active_field: n.active_field,
    fields: n.fields,
    values: n.values,
    completed_sections: n.completed_sections,
    unit_id: n.unit_id,
    section_id: n.section_id,
    entity_id: n.entity_id,
    inspiration_id: n.inspiration_id
  };
}
function ie(e) {
  const t = e?.checkpoint, n = t?.draft, r = Number(n?.accepted_count);
  return !e || e.document.status !== "running" || !t || !n || !Number.isSafeInteger(r) || r <= 0 || !n.units || r > n.units.length || r >= Number(t.count) || n.expected_count !== t.count || n.run_id !== e.run_id || n.request_id !== t.request_id || t.work_asset_id !== e.work_asset_id || t.work_version_id !== e.work_version_id || t.work_revision !== e.work_revision || !(t.action === "generate_chapters" || t.action === "append" || t.action === "generate_outline" && t.phase === "chapters") ? 0 : r;
}
function dr(e) {
  const t = ie(e), n = e?.checkpoint, r = n?.draft;
  if (!e || !n || !r?.units || !t) return null;
  const i = {};
  for (const [s, o] of r.units.slice(0, t).entries())
    i[`units.${s}.title`] = o.title, i[`units.${s}.plan`] = o.plan;
  return {
    work_asset_id: e.work_asset_id,
    run_id: e.run_id,
    request_id: e.request_id,
    step_request_id: n.request_id || "",
    phase: n.phase,
    unit_id: n.unit_id,
    section_id: n.section_id,
    entity_id: n.entity_id,
    inspiration_id: n.inspiration_id,
    fields: i,
    active_field: `units.${t - 1}.plan`
  };
}
function ur(e, t) {
  if (!e || !t || t.document.status !== "running" || e.work_asset_id !== t.work_asset_id || e.run_id !== t.run_id || e.request_id !== t.request_id)
    return !1;
  const n = t.checkpoint;
  if (!n || !n.issued || (e.phase || "") !== (n.phase || "") || n.request_id && e.step_request_id !== n.request_id) return !1;
  const r = n.phase === "continuity" && n.continuity_unit_id || n.unit_id;
  return !r || e.unit_id === r;
}
function Et(e, t) {
  const n = e.checkpoint, r = t.checkpoint;
  return !n || !r ? !1 : e.document.status === "running" && t.document.status === "running" && t.work_asset_id === e.work_asset_id && t.work_version_id === e.work_version_id && t.work_revision === e.work_revision && t.run_id === e.run_id && t.request_id === e.request_id && r.action === n.action && r.phase === n.phase && r.completed === n.completed && r.target === n.target && JSON.stringify(r.unit_ids) === JSON.stringify(n.unit_ids) && ["unit_id", "continuity_unit_id", "section_id", "entity_id", "inspiration_id", "selected_text"].every(
    (i) => (r[i] || "") === (n[i] || "")
  );
}
function jt(e, t) {
  const n = e.checkpoint, r = t.checkpoint, i = ie(e), s = n?.correction_count || 0;
  if (!n || !r || !i && !s || !Et(e, t))
    return !1;
  const o = ie(t), c = i > 0 && (!r.count || r.count === n.count), a = (r.count || 0) === (n.count || 0), f = r.correction_count || 0;
  return c && o < i || a && f < s ? !0 : o === i && f === s && n.issued && !r.issued && (c || a && s > 0);
}
function zt(e, t) {
  return !e || e.work_asset_id !== t.work_asset_id ? t : t.work_version_id < e.work_version_id || t.work_version_id === e.work_version_id && (t.work_revision < e.work_revision || t.work_revision === e.work_revision && e.run_id > t.run_id) || jt(e, t) || JSON.stringify(e) === JSON.stringify(t) ? e : t;
}
function fr(e, t) {
  if (!e || !((e.outputType || e.power?.outputType) === "story" || S(e.asset?.version?.content)))
    return !1;
  const n = e.asset?.id || e.resultRef?.asset_id, r = t.asset?.id || t.resultRef?.asset_id, i = e.asset?.version_id || e.resultRef?.version_id || 0, s = t.asset?.version_id || t.resultRef?.version_id || 0;
  return !!(n && n === r && s > 0 && (s < i || s === i && S(t.asset?.version?.content) && B(t.asset?.version) < B(e.asset?.version)));
}
function lr(e, t) {
  return e.id === t.id && (e.version_id > t.version_id || e.version_id === t.version_id && !!S(t.version?.content) && B(e.version) > B(t.version)) && !!S(e.version?.content);
}
function B(e) {
  const t = h(e?.content);
  return p(t) ? Number(t.writing_revision || 0) : 0;
}
function _r(e, t, n) {
  const r = Dt(t);
  let i;
  if (r)
    i = {
      ...e,
      outline: {
        ...e.outline,
        [r]: [
          ...e.outline[r],
          { id: `new:${crypto.randomUUID()}`, name: n.title, description: n.description }
        ]
      }
    };
  else {
    const s = {
      id: `new:${crypto.randomUUID()}`,
      unit_type: "chapter",
      title: n.title,
      plan: n.description,
      children: [],
      asset_id: 0,
      version_id: 0,
      has_body: !1,
      continuity_valid: !1,
      dependency_stale: !1
    };
    i = { ...e, units: [...e.units, s] };
  }
  return i;
}
function Jt(e) {
  return e.inspirations.find(
    (t) => t.id === e.selected_inspiration_id
  );
}
function pr(e, t) {
  const n = e.inspirations.find((r) => r.id === t);
  return !!(n?.title.trim() && n.content.trim() && !e.selected_inspiration_id);
}
function mr(e) {
  return Jt(e) ? Ft(e) ? e.units.length ? "body" : "chapters" : "outline" : "inspiration";
}
function gr(e) {
  return { kind: "section", id: "overview" };
}
function yr(e) {
  const t = S(e.output);
  if (!t) return [e];
  const n = [
    ...pe.map((r) => ({
      kind: "section",
      id: r.id,
      title: r.label
    })),
    ...t.units.filter((r) => r.has_body).map((r) => ({
      kind: "unit",
      id: r.id,
      title: `${Ke(t.units, r.id)} ${r.title}`
    }))
  ];
  return [
    e,
    ...n.map((r) => ({
      ...e,
      id: `${e.id}:${r.kind}:${r.id}`,
      title: `${e.title} · ${r.title}`,
      contentSelection: { kind: r.kind, ids: [r.id] },
      preview: { ...e.preview, text: r.title },
      output: void 0
    }))
  ];
}
function hr(e, t) {
  const n = (t?.parts || []).flatMap(
    (r) => r.type === "reference" && r.ref_content_selection && r.ref_version_id ? [
      {
        key: `writing-pinned:${r.ref_id}:${r.ref_version_id}:${ge(r.ref_content_selection)}`,
        refType: r.ref_type,
        refId: r.ref_id,
        label: r.label,
        versionID: r.ref_version_id,
        origin: r.ref_origin,
        originID: r.ref_origin_id,
        contentSelection: r.ref_content_selection
      }
    ] : []
  );
  return [...e, ...n];
}
function wr(e, t, n) {
  return {
    ...e,
    parts: e.parts.map((r) => {
      if (r.type !== "reference" || r.ref_content_selection) return r;
      const i = t?.parts.find(
        (c) => c.type === "reference" && c.ref_type === r.ref_type && c.ref_id === r.ref_id && c.ref_version_id === r.ref_version_id && c.ref_origin_id === r.ref_origin_id && c.label === r.label
      ), s = n.find(
        (c) => c.refType === r.ref_type && c.refId === r.ref_id && c.versionID === r.ref_version_id && c.label === r.label
      ), o = i?.type === "reference" ? i.ref_content_selection : s?.contentSelection;
      return o ? { ...r, ref_content_selection: o } : r;
    })
  };
}
function br(e) {
  return `writing:${ge(e)}`;
}
const We = /* @__PURE__ */ new Set([
  "image",
  "video",
  "audio",
  "file"
]);
function vr(e) {
  return e.type === "file" || e.type === "files";
}
function Gt(e) {
  return e.type === "prompt";
}
function kr(e) {
  return ![
    "hidden",
    "description",
    "prompt",
    "file",
    "files"
  ].includes(e.type);
}
function Sr(e) {
  const t = Array.from(
    new Set(
      (e.accepted_kinds || e.asset_kinds || []).map(ye).filter((n) => !!n)
    )
  );
  return t.length > 0 ? t : [];
}
function Ht(e) {
  return (e.accepted_kinds || []).map(ye).filter(
    (t) => !!t && We.has(t)
  );
}
function W(e) {
  const t = ye(e);
  return t && We.has(t) ? t : void 0;
}
function Yt(e) {
  return e.type !== "files" ? 1 : Math.max(0, Number(e.max_files || 0));
}
function ye(e) {
  const t = String(e || "").toLowerCase();
  return t === "rich" ? "richtext" : t === "music" ? "audio" : [
    "collection",
    "text",
    "image",
    "audio",
    "video",
    "richtext",
    "file"
  ].includes(t) ? t : void 0;
}
function Qt(e, t) {
  return !!(e && It(e.source_rule) && t > 0 && !e.sources.some(
    (n) => n.target_id === t || n.id === t
  ));
}
function Ir(e, t) {
  return Qt(e, t.selectedTargetId || 0) ? t.paramValues || {} : Zt(e.params || [], t);
}
function Xt(e) {
  const t = e.default_value ?? "";
  if (e.type === "switch")
    return tn(t);
  if (e.type === "multi_option")
    return he(e, Ne(t));
  if (e.type === "files")
    return we(Ne(t));
  if (e.type === "option" || e.type === "select") {
    const n = R(e.options || [], t) || e.options?.[0];
    return T(
      e,
      N(n) || t
    );
  }
  return T(e, t);
}
function Ee(e) {
  const t = {};
  for (const n of e)
    !n.key || n.type === "description" || (t[n.key] = Xt(n));
  return t;
}
function xr(e, t, n) {
  const r = Ee(e), i = new Map(
    n.map((s) => [s.key, s])
  );
  for (const s of e) {
    const o = i.get(s.key);
    s.key && o && Object.prototype.hasOwnProperty.call(t, s.key) && en(s, o, t[s.key]) && (r[s.key] = he(s, t[s.key]));
  }
  return r;
}
function Zt(e, t) {
  const n = Ee(e), r = t.paramValues || {};
  for (const s of e)
    s.key && Object.prototype.hasOwnProperty.call(r, s.key) && (n[s.key] = he(
      s,
      r[s.key]
    ));
  const i = e.find(Gt);
  return i?.key && t.prompt.trim() && (n[i.key] = t.prompt), n;
}
function T(e, t) {
  if (e.value_type !== "number" || t === "")
    return t;
  const n = Number(t);
  return Number.isFinite(n) ? n : t;
}
function he(e, t) {
  if (e.type === "option" || e.type === "select") {
    const n = R(e.options || [], t) || e.options?.[0];
    return T(
      e,
      N(n) || t
    );
  }
  return e.type === "multi_option" ? we(t).map((n) => {
    const r = R(e.options || [], n);
    return T(
      e,
      N(r) || n
    );
  }) : T(e, t);
}
function en(e, t, n) {
  if (e.type !== t.type || e.value_type !== t.value_type)
    return !1;
  if (e.type === "option" || e.type === "select") {
    const r = e.options || [];
    return r.length === 0 || !!R(r, n);
  }
  if (e.type === "multi_option") {
    const r = e.options || [];
    return r.length === 0 || we(n).every(
      (i) => !!R(r, i)
    );
  }
  return e.value_type === "number" ? n === "" || Number.isFinite(Number(n)) : !0;
}
function N(e) {
  return e ? String(e.native_value || "").trim() || String(e.value || "").trim() || String(e.name || "").trim() || String(e.id || "") : "";
}
function R(e, t) {
  const n = String(t ?? "").trim();
  if (!n)
    return;
  const r = [
    (i) => i.native_value,
    (i) => i.value,
    (i) => i.name,
    (i) => i.id
  ];
  for (const i of r) {
    const s = e.find(
      (o) => String(i(o) ?? "").trim() === n
    );
    if (s)
      return s;
  }
}
function Rr(e, t, n = [e]) {
  return t.some(
    (r) => R(n, r) === e
  );
}
function Ne(e) {
  if (typeof e != "string")
    return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
function we(e) {
  return Array.isArray(e) ? e.map((t) => String(t)).filter(Boolean) : typeof e == "string" ? e ? [e] : [] : e ? [String(e)] : [];
}
function tn(e) {
  if (typeof e == "boolean")
    return e;
  const t = String(e ?? "").trim().toLowerCase();
  return t === "1" || t === "true" || t === "yes" || t === "on";
}
await window.DeverFront?.ensureCompat?.(["@/components/agent/stream-request-params"]);
const oe = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!oe || Object.keys(oe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const E = oe, nn = E.filterActivePowerParams || ((e) => e), Mr = E.isPowerParamConditionController || (() => !1), Pr = E.shouldDisplayPowerParam || (() => !0), Cr = E.PowerParamOptionDialog, Nr = E.normalizeParamPreviewType, rn = "referencemode", on = "references";
function $r({
  node: e,
  content: t,
  items: n,
  connections: r,
  params: i,
  values: s,
  requestedMode: o,
  additionalSources: c = []
}) {
  const a = un(
    nn(i, s)
  );
  return fn({
    targetKind: v(e) || e.power?.kind || e.kind,
    content: t,
    items: n,
    connections: r,
    mediaOptions: a,
    requestedMode: o,
    additionalSources: c
  });
}
function Or(e, t) {
  return e.flatMap(({ edge: n, source: r }) => {
    const i = Ye(t, r), s = Number(
      i?.refId || r.asset?.id || r.resultRef?.asset_id || 0
    );
    return s <= 0 ? [] : [
      {
        refType: "asset",
        refId: s,
        versionId: Number(
          i?.versionID || r.asset?.version?.id || r.asset?.version_id || r.resultRef?.version_id || 0
        ),
        label: He(r, i),
        usage: String(n.mediaUsage || ""),
        trigger: "@",
        origin: "edge",
        originID: n.id,
        contentSelection: i?.contentSelection,
        mediaCount: I(r)
      }
    ];
  });
}
function v(e) {
  if (!e)
    return;
  const t = [e.kind, e.asset?.kind, e.power?.kind], n = [e.asset?.version?.content, e.resultOutput];
  if (Q(n)?.frames.some((s) => !!s.image))
    return "image";
  let i = !1;
  for (const s of t) {
    const o = W(s);
    if (o === "file") {
      i = !0;
      continue;
    }
    if (o)
      return o;
  }
  return i && an(n) ? "file" : void 0;
}
function sn(e) {
  return !!v(e);
}
function an(e) {
  return e.some(
    (t) => se(t, /* @__PURE__ */ new Set(), 0)
  );
}
function se(e, t, n) {
  if (e == null || n > 10)
    return !1;
  if (typeof e == "string")
    return /^(?:https?:\/\/|\/|data:)/i.test(e.trim());
  if (Array.isArray(e))
    return e.some((i) => se(i, t, n + 1));
  if (typeof e != "object" || t.has(e))
    return !1;
  t.add(e);
  const r = e;
  return [
    r.file,
    r.files,
    r.file_url,
    r.fileUrl,
    r.url,
    r.src,
    r.download,
    r.download_url,
    r.downloadUrl,
    r.open_url,
    r.path,
    r.output,
    r.result,
    r.data,
    r.content,
    r.body,
    r.value,
    r.json,
    r.media_files,
    r.mediaFiles
  ].some((i) => se(i, t, n + 1));
}
function Ur(e, t, n) {
  return n.some((i) => {
    const s = v(i);
    return s === "video" || s === "audio";
  }) && dn(
    e,
    t,
    on
  ) || t;
}
function cn(e) {
  return j(e.key) === rn;
}
function dn(e, t, n) {
  const r = e.find(cn);
  if (!r?.key)
    return t;
  const i = R(
    r.options || [],
    n
  );
  if (!i)
    return;
  const s = R(
    r.options || [],
    t[r.key]
  );
  return N(s) === N(i) ? t : {
    ...t,
    [r.key]: N(i)
  };
}
function un(e) {
  const t = e.flatMap((n) => {
    if (n.type !== "file" && n.type !== "files")
      return [];
    const r = String(n.key || "").trim(), i = Ht(n);
    return !r || i.length === 0 ? [] : [
      {
        key: r,
        label: String(n.name || r),
        maxFiles: Yt(n),
        acceptedKinds: i
      }
    ];
  });
  return D(
    t.map(
      (n) => ee(n) ? { ...n, maxFiles: 1 } : n
    )
  );
}
function Ar(e) {
  return e.find((t) => Z(t.key))?.key || "firstFrame";
}
function fn({
  targetKind: e,
  content: t,
  items: n,
  connections: r,
  mediaOptions: i,
  requestedMode: s,
  additionalSources: o = []
}) {
  const c = ln(
    t,
    n,
    r,
    o
  ), a = c.reduce(
    (y, ft) => y + ft.amount,
    0
  ), f = c.some((y) => Z(y.usage)) && c.some((y) => je(y.usage)), _ = W(e) === "video" && a > 1, d = O(
    i,
    "image",
    "per_image"
  ), u = O(
    i,
    "image",
    "shared_reference"
  ), l = d.length > 0, m = u.some(
    ee
  ), g = (!m || c.every((y) => y.amount === 1)) && gn(u, a), k = [
    {
      value: "per_image",
      label: "逐图生成",
      enabled: l,
      reason: l ? void 0 : "当前能力没有可逐张接收图片的参数"
    },
    {
      value: "shared_reference",
      label: m ? "首尾帧生成" : "共同参考",
      enabled: g,
      reason: g ? void 0 : m ? "当前能力不能将这些图片作为同一次首尾帧输入" : "当前能力不能在一次请求中接收这些参考图片"
    }
  ];
  if (!_)
    return {
      active: !1,
      imageCount: a,
      structured: c.some((y) => y.structured),
      explicitFramePair: f,
      options: k,
      error: ""
    };
  const w = c.some((y) => y.structured), M = f && g ? "shared_reference" : w && l ? "per_image" : g ? "shared_reference" : "per_image", ut = k.find(
    (y) => y.value === s && y.enabled
  )?.value || M, xe = k.some((y) => y.enabled);
  return {
    active: _,
    imageCount: a,
    structured: w,
    explicitFramePair: f,
    mode: xe ? ut : void 0,
    defaultMode: M,
    options: k,
    error: xe ? "" : "当前能力无法接收这组图片素材"
  };
}
function ln(e, t, n, r) {
  const i = new Map(
    n.map(
      (a) => [
        b(
          a.edge.id,
          x(a)
        ),
        a
      ]
    )
  ), s = /* @__PURE__ */ new Set(), o = [];
  for (const a of e?.parts || []) {
    if (a.type !== "reference" || !be(a.ref_type))
      continue;
    const f = a.ref_type === "asset" && a.ref_origin_id ? i.get(
      b(a.ref_origin_id, a.ref_id)
    ) : void 0, _ = f ? Ye(t, f.source) : ve(t, a);
    if ((f ? v(f.source) : W(_?.kind)) !== "image")
      continue;
    f && s.add(
      b(
        f.edge.id,
        x(f)
      )
    );
    const u = f ? I(f.source) : Y(_, "image", a.ref_media_count);
    o.push({
      amount: q(a, u),
      usage: String(a.usage || f?.edge.mediaUsage || ""),
      structured: ne(f?.source, _)
    });
  }
  for (const a of n) {
    const f = b(
      a.edge.id,
      x(a)
    );
    s.has(f) || v(a.source) !== "image" || o.push({
      amount: I(a.source),
      usage: String(a.edge.mediaUsage || ""),
      structured: ne(a.source)
    });
  }
  const c = new Set(
    n.map((a) => a.source.id)
  );
  for (const a of r)
    c.has(a.id) || v(a) !== "image" || o.push({
      amount: I(a),
      usage: "",
      structured: ne(a)
    });
  return o;
}
function ne(e, t) {
  return !!(e?.storyboardItem?.itemType === "shot_image" || Q([
    e?.asset?.version?.content,
    e?.resultOutput,
    t?.output,
    t?.asset
  ]));
}
function _n(e, t) {
  return e.find((n) => n.key === t);
}
function Z(e) {
  const t = j(e);
  return t === "firstframe" || t === "startframe";
}
function je(e) {
  const t = j(e);
  return t === "lastframe" || t === "endframe";
}
function pn(e) {
  const t = j(e);
  return t === "firstframe" || t === "startframe" || t === "lastframe" || t === "endframe";
}
function mn(e) {
  if (!e.acceptedKinds.includes("image"))
    return !1;
  const t = j(e.key);
  return ["images", "reference", "referenceimage", "referenceimages"].includes(
    t
  );
}
function D(e) {
  return e.map((t, n) => ({ option: t, index: n })).sort(
    (t, n) => $e(t.option) - $e(n.option) || t.index - n.index
  ).map(({ option: t }) => t);
}
function $e(e) {
  return mn(e) ? 0 : Z(e.key) ? 1 : je(e.key) ? 2 : 3;
}
function ee(e) {
  return pn(e.key);
}
function O(e, t, n) {
  const r = e.filter(
    (o) => o.acceptedKinds.includes(t)
  );
  if (t !== "image" || !n)
    return r;
  const i = r.filter((o) => !ee(o));
  if (n === "shared_reference")
    return D(i.length > 0 ? i : r);
  const s = r.filter(
    (o) => Z(o.key)
  );
  return s.length > 0 ? D(s) : D(i);
}
function Fr(e, t) {
  if (!t)
    return e;
  const n = /* @__PURE__ */ new Set();
  for (const r of ["image", "video", "audio", "file"])
    for (const i of O(
      e,
      r,
      t
    ))
      n.add(i);
  return e.filter((r) => n.has(r));
}
function gn(e, t) {
  let n = t;
  for (const r of e) {
    const i = C(r);
    if (i <= 0 || (n -= i, n <= 0))
      return !0;
  }
  return !1;
}
function j(e) {
  return String(e || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}
function Tr(e, t, n, r, i = {}, s = !1, o) {
  const c = new Map(
    (t?.parts || []).flatMap(
      (d) => d.type === "reference" && d.ref_type === "asset" && d.ref_origin === "edge" && d.ref_origin_id ? [
        [
          b(d.ref_origin_id, d.ref_id),
          d
        ]
      ] : []
    )
  ), a = e.flatMap(
    (d) => {
      const u = v(d.source);
      if (!u)
        return [];
      const l = I(d.source), m = c.get(
        b(
          d.edge.id,
          x(d)
        )
      );
      return [
        {
          referenceKey: vn(d),
          label: bn(d),
          kind: u,
          amount: q(m, l),
          mediaCount: l,
          mediaSelected: de(m),
          usage: hn(d, i),
          required: !0
        }
      ];
    }
  );
  for (const [d, u] of (t?.parts || []).entries()) {
    if (u.type !== "reference" || !be(u.ref_type) || u.ref_origin === "edge")
      continue;
    const l = ve(n, u), m = W(l?.kind);
    m && a.push({
      referenceKey: `${u.ref_type}:${u.ref_id}:${d}`,
      label: String(u.label || l?.title || "引用素材"),
      kind: m,
      amount: q(
        u,
        Y(l, m, u.ref_media_count)
      ),
      mediaCount: Y(
        l,
        m,
        u.ref_media_count
      ),
      mediaSelected: de(u),
      usage: String(u.usage || ""),
      required: s
    });
  }
  const f = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Set();
  for (const d of a) {
    const u = `${d.referenceKey}:${d.usage}`;
    if (_.has(u))
      continue;
    _.add(u);
    const l = O(
      r,
      d.kind,
      o
    );
    if (l.length === 0) {
      if (d.required)
        return `当前能力未配置可接收${Ge(d.kind)}素材的参数`;
      continue;
    }
    const m = _n(l, d.usage);
    if (d.usage && !m)
      return `「${d.label}」的素材用途与当前能力参数不兼容`;
    const g = m || (l.length === 1 ? l[0] : void 0);
    if (!g)
      return `请为「${d.label}」选择素材用途`;
    const k = d.kind === "image" && o === "per_image", w = k ? 1 : d.amount, M = C(g) > 0 ? Math.max(
      C(g) - (f.get(g.key) || 0),
      0
    ) : 0;
    if (!k && !d.mediaSelected && d.mediaCount > 1 && C(g) > 0 && d.mediaCount > M)
      return `「${d.label}」包含 ${d.mediaCount} 项素材，请从引用中选择具体素材`;
    if (!ce(g, f, w))
      return `${g.label}参数最多接收 ${C(g)} 个素材`;
    k || H(f, g.key, w);
  }
  return "";
}
function Dr(e, t, n, r, i = [], s) {
  const o = n.filter(sn), c = o.flatMap((u) => {
    const l = v(u);
    return l ? [l] : [];
  }), a = D(
    t.filter(
      (u) => c.every(
        (l) => O([u], l, s).includes(
          u
        )
      )
    )
  );
  if (c.length === 0 || a.length === 0) {
    const u = c[0];
    return {
      usage: void 0,
      error: c.length > 1 ? "当前能力未配置可同时接收该分组媒体素材的参数" : `当前能力未配置可接收${Ge(u || "file")}素材的参数`
    };
  }
  const f = yn(
    e,
    t,
    r,
    i,
    s
  ), _ = s === "per_image" && c.every((u) => u === "image") ? 1 : o.reduce(
    (u, l) => u + I(l),
    0
  ), d = ze(
    a,
    f,
    _
  );
  return d ? {
    usage: d.key,
    error: ""
  } : {
    usage: void 0,
    error: `${a[0].label}参数已达到素材数量上限`
  };
}
function Br(e, t, n, r, i, s) {
  if (!t || r.length === 0)
    return { content: t, assignments: {} };
  const o = new Map(
    ae(
      e,
      n,
      i,
      s
    ).map((u) => [u.key, u])
  ), a = [...ae(
    t,
    n,
    i,
    s
  )].sort((u, l) => {
    const m = Oe(
      u,
      o.get(u.key)
    ), g = Oe(
      l,
      o.get(l.key)
    );
    return m - g || u.partIndex - l.partIndex;
  }), f = t.parts.map((u) => ({ ...u })), _ = {}, d = /* @__PURE__ */ new Map();
  for (const u of a) {
    const l = o.get(u.key), m = O(
      r,
      u.kind,
      s
    ), g = u.usage && u.usage !== l?.usage ? u.usage : "", w = ze(
      m,
      d,
      u.kind === "image" && s === "per_image" ? 1 : u.amount,
      g,
      l?.usage || u.usage
    )?.key || "";
    w && (u.kind === "image" && s === "per_image" || H(d, w, u.amount));
    const M = f[u.partIndex];
    M?.type === "reference" && (M.usage = w || void 0), u.connection && w !== String(u.connection.edge.mediaUsage || "") && (_[u.connection.edge.id] = w || void 0);
  }
  return { content: { ...t, parts: f }, assignments: _ };
}
function yn(e, t, n, r = [], i) {
  const s = /* @__PURE__ */ new Map(), o = ae(
    n,
    r,
    e,
    i
  ), c = /* @__PURE__ */ new Set();
  for (const a of o) {
    const f = t.find((_) => _.key === a.usage);
    f && !(a.kind === "image" && i === "per_image") && H(s, f.key, a.amount), a.connection && c.add(
      b(
        a.connection.edge.id,
        x(a.connection)
      )
    );
  }
  for (const a of e) {
    const f = b(
      a.edge.id,
      x(a)
    );
    if (c.has(f))
      continue;
    const _ = String(a.edge.mediaUsage || ""), d = t.find((u) => u.key === _);
    d && !(v(a.source) === "image" && i === "per_image") && H(
      s,
      d.key,
      I(a.source)
    );
  }
  return s;
}
function hn(e, t) {
  return String(
    Object.prototype.hasOwnProperty.call(t, e.edge.id) ? t[e.edge.id] || "" : e.edge.mediaUsage || ""
  );
}
function ae(e, t, n, r) {
  if (!e)
    return [];
  const i = new Map(
    n.map((o) => [
      b(
        o.edge.id,
        x(o)
      ),
      o
    ])
  ), s = /* @__PURE__ */ new Map();
  return e.parts.flatMap((o, c) => {
    if (o.type !== "reference" || !be(o.ref_type))
      return [];
    const a = o.ref_type === "asset" && o.ref_origin_id ? i.get(
      b(o.ref_origin_id, o.ref_id)
    ) : void 0, f = ve(t, o), _ = a ? v(a.source) : W(f?.kind);
    if (!_)
      return [];
    const d = a ? `edge:${b(
      a.edge.id,
      x(a)
    )}` : `${o.ref_type}:${o.ref_id}:${o.ref_version_id || 0}`, u = s.get(d) || 0;
    return s.set(d, u + 1), [
      {
        key: a ? d : `${d}:${u}`,
        partIndex: c,
        kind: _,
        amount: _ === "image" && r === "per_image" ? 1 : a ? q(
          o,
          I(a.source)
        ) : q(
          o,
          Y(
            f,
            _,
            o.ref_media_count
          )
        ),
        usage: String(o.usage || ""),
        connection: a
      }
    ];
  });
}
function Oe(e, t) {
  return e.usage && e.usage !== t?.usage ? 0 : t ? 1 : 2;
}
function ze(e, t, n, ...r) {
  for (const i of r) {
    const s = e.find((o) => o.key === i);
    if (s && ce(s, t, n))
      return s;
  }
  return e.find(
    (i) => ce(i, t, n)
  );
}
function C(e) {
  return ee(e) ? 1 : e.maxFiles;
}
function ce(e, t, n = 1) {
  const r = C(e);
  return r <= 0 || (t.get(e.key) || 0) + n <= r;
}
function H(e, t, n = 1) {
  e.set(t, (e.get(t) || 0) + n);
}
function Je(e, t) {
  return wn(e, t).map((n) => n.url);
}
function wn(e, t) {
  if (t === "image") {
    const n = lt(e);
    if (n.length > 0)
      return n.map((r) => ({ url: r, thumbnail: r }));
  }
  return _t(e, t);
}
function I(e) {
  const t = v(e);
  return !e || !t || t === "file" ? 1 : Math.max(
    1,
    Je(
      [e.asset?.version?.content, e.resultOutput],
      t
    ).length
  );
}
function Y(e, t, n = 0) {
  return !e || t === "file" ? Math.max(1, n) : Math.max(
    1,
    n,
    Je(e.output, t).length
  );
}
function de(e) {
  return !!((e?.ref_media_items?.length || 0) > 0 || String(e?.ref_media_url || "").trim() || Number(e?.ref_media_index || 0) > 0);
}
function q(e, t) {
  return (e?.ref_media_items?.length || 0) > 0 ? e?.ref_media_items?.length || 0 : de(e) ? 1 : Math.max(1, t);
}
function b(e, t) {
  return `${String(e || "")}:${Number(t || 0)}`;
}
function be(e) {
  return e === "asset" || e === "material";
}
function ve(e, t) {
  return e.find(
    (n) => (n.refType || "asset") === t.ref_type && Number(n.refId || 0) === Number(t.ref_id || 0) && (!t.ref_version_id || Number(n.versionID || 0) === Number(t.ref_version_id))
  );
}
function x(e) {
  return Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
}
function Ge(e) {
  switch (e) {
    case "image":
      return "图片";
    case "video":
      return "视频";
    case "audio":
      return "音频";
    default:
      return "文件";
  }
}
function bn(e) {
  return He(e.source);
}
function He(e, t) {
  for (const n of [e.asset?.name, t?.title, e.title]) {
    const r = String(n || "").trim();
    if (r)
      return r;
  }
  return "媒体素材";
}
function vn(e) {
  const t = Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
  return t > 0 ? `asset:${t}` : `node:${e.source.id}`;
}
function Ye(e, t) {
  const n = Number(t.asset?.id || t.resultRef?.asset_id || 0), r = Number(
    t.asset?.version?.id || t.asset?.version_id || t.resultRef?.version_id || 0
  );
  return e.find(
    (i) => (i.refType || "asset") === "asset" && Number(i.refId || 0) === n && (!r || Number(i.versionID || 0) === r)
  ) || e.find((i) => i.id === t.id);
}
function qr(e, t, n) {
  const r = Sn(e, t), i = n || e.kind, s = Q(r);
  if (s)
    return {
      mode: "storyboard_grid",
      value: s,
      format: "json",
      summary: Xe(s),
      downloadUrl: ""
    };
  const o = yt(r);
  if (o)
    return {
      mode: "storyboard",
      value: o,
      format: "json",
      summary: De(o),
      downloadUrl: ""
    };
  const c = et(r);
  if (c) {
    if (i === "text") {
      const l = Re(c);
      return z(l?.markdown || _e(c));
    }
    const u = Nn(r) ? null : Re(c);
    return u && ht(u.plainText) ? z(u.markdown) : Ae(c);
  }
  const a = fe(r);
  if (a)
    return {
      mode: "file",
      value: a,
      format: "json",
      summary: a.description || a.name || "文件内容",
      downloadUrl: a.url
    };
  const f = Pn(r);
  if (f)
    return z(f);
  const _ = In(r);
  if (_)
    return Ae(_);
  const d = le(r) || e.description || "";
  return z(d);
}
function Ue(e, t, n = {}) {
  const r = n.includeNodeResult === !1 ? t?.content : pt(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    tt(e, "result", "output")
  ), i = h(r);
  if (Q(i))
    return;
  const s = mt(i);
  for (const c of [i, h(s)])
    if (gt(c))
      return kn(c);
  const o = Mn(e.kind, i);
  if (o)
    return o;
}
function kn(e) {
  const n = Te(e).map((r) => {
    if (!p(r) || r.json === void 0)
      return r;
    const i = { ...r };
    return delete i.json, i;
  });
  return n.length === 1 ? n[0] : n;
}
function Sn(e, t) {
  return wt(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    tt(e, "result", "output"),
    e.description
  );
}
function Qe(e) {
  if (e.mode === "storyboard" || e.mode === "storyboard_grid")
    return e.value;
  if (e.mode === "file")
    return Rn(e.value);
  const t = String(e.value || "");
  return e.format === "markdown" ? { format: "markdown", text: t } : F(h(t)) || Cn(t);
}
function Lr(e) {
  return Be(Qe(e));
}
function Kr(e, t) {
  const n = { ...e, value: t };
  if (n.mode === "storyboard")
    n.summary = De(t);
  else if (n.mode === "storyboard_grid")
    n.summary = Xe(t);
  else if (n.mode === "file") {
    const r = t;
    n.summary = r.description || r.name || "文件内容", n.downloadUrl = r.url;
  } else
    n.summary = ke(_e(Qe(n)));
  return n;
}
function Xe(e) {
  return $(
    e.summary,
    `${e.title || "宫格图片"} · ${e.frames.length} 张`
  );
}
function Ae(e) {
  const t = _e(e);
  return {
    mode: "rich",
    value: Be(e),
    format: "json",
    summary: ke(t),
    downloadUrl: Ze(e)
  };
}
function z(e) {
  return {
    mode: "rich",
    value: e,
    format: "markdown",
    summary: ke(e),
    downloadUrl: ""
  };
}
function In(e) {
  if (typeof e == "string" && h(e) === e)
    return null;
  const t = Te(e), n = [];
  return ue(
    t,
    n,
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    0
  ), n.length === 0 ? null : F({ type: "doc", content: n });
}
function ue(e, t, n, r, i, s) {
  if (e == null || s > 12)
    return;
  const o = h(e);
  if (typeof o == "string") {
    Fe(t, o, r);
    return;
  }
  if (Array.isArray(o)) {
    o.forEach(
      (a) => ue(
        a,
        t,
        n,
        r,
        i,
        s + 1
      )
    );
    return;
  }
  if (!p(o) || n.has(o))
    return;
  n.add(o);
  const c = et(o);
  if (c) {
    for (const a of c.content || [])
      t.push(a);
    return;
  }
  Fe(
    t,
    $(o.title, o.text),
    r
  ), xn(o, t, i);
  for (const a of [
    "rich",
    "content",
    "output",
    "result",
    "data",
    "body",
    "value"
  ])
    o[a] !== void 0 && ue(
      o[a],
      t,
      n,
      r,
      i,
      s + 1
    );
}
function xn(e, t, n) {
  const r = [
    { kind: "image", values: [e.image, e.image_url, e.imageUrl, e.images] },
    { kind: "video", values: [e.video, e.video_url, e.videoUrl, e.videos] },
    { kind: "audio", values: [e.audio, e.audio_url, e.audioUrl, e.audios] }
  ];
  for (const i of r)
    for (const s of i.values)
      for (const o of L(s)) {
        const c = `${i.kind}:${o}`;
        n.has(c) || (n.add(c), t.push({
          type: $n(i.kind),
          attrs: { src: o }
        }));
      }
}
function Fe(e, t, n) {
  const r = String(t || "").trim();
  !r || rt(r) || Se(r) || n.has(r) || (n.add(r), e.push({
    type: "paragraph",
    content: [{ type: "text", text: r }]
  }));
}
function L(e) {
  return Array.isArray(e) ? e.flatMap(L) : typeof e == "string" ? rt(e.trim()) ? [e.trim()] : [] : p(e) ? [
    e.url,
    e.src,
    e.path,
    e.download_url,
    e.downloadUrl
  ].flatMap(L) : [];
}
function fe(e) {
  const t = h(e);
  if (Array.isArray(t)) {
    for (const r of t) {
      const i = fe(r);
      if (i)
        return i;
    }
    return null;
  }
  if (!p(t))
    return null;
  const n = On(
    t.file,
    t.file_url,
    t.fileUrl,
    t.files
  );
  if (n)
    return {
      url: n,
      name: $(t.name, t.filename, t.title) || nt(n),
      description: $(
        t.description,
        t.text,
        t.summary
      )
    };
  for (const r of ["content", "output", "result", "data", "body", "value"])
    if (t[r] !== void 0) {
      const i = fe(t[r]);
      if (i)
        return i;
    }
  return null;
}
function Rn(e) {
  return {
    type: "file",
    file_url: e.url,
    name: e.name || nt(e.url),
    description: e.description.trim()
  };
}
function Mn(e, t) {
  if (e !== "image" && e !== "video" && e !== "audio")
    return;
  const n = L(t);
  if (n.length !== 0)
    return {
      [`${e}s`]: n
    };
}
function le(e) {
  const t = h(e);
  if (typeof t == "string")
    return Se(t) ? "" : t;
  if (Array.isArray(t))
    return t.map(le).filter(Boolean).join(`

`);
  if (!p(t))
    return "";
  const n = $(
    t.text,
    t.summary,
    t.description
  );
  if (n)
    return n;
  for (const r of ["content", "output", "result", "data", "body", "value"])
    if (t[r] !== void 0) {
      const i = le(t[r]);
      if (i)
        return i;
    }
  return "";
}
function Pn(e) {
  const t = h(e);
  return typeof t == "string" ? Se(t) ? "" : t : p(t) && String(t.format || "").trim().toLowerCase() === "markdown" ? $(t.text, t.markdown) : "";
}
function Cn(e) {
  const t = e.split(/\n{2,}/).map((n) => n.trim());
  return {
    type: "doc",
    content: (t.length ? t : [""]).map((n) => ({
      type: "paragraph",
      content: n ? [{ type: "text", text: n }] : []
    }))
  };
}
function Ze(e) {
  if (!e || typeof e != "object")
    return "";
  if (["editorMediaImage", "editorMediaVideo", "editorMediaAudio"].includes(
    String(e.type || "")
  ))
    return String(e.attrs?.src || "").trim();
  for (const t of Array.isArray(e.content) ? e.content : []) {
    const n = Ze(t);
    if (n)
      return n;
  }
  return "";
}
function et(e) {
  const t = h(e);
  if (!p(t))
    return null;
  if (String(t.type || "") === "doc")
    return F(t);
  const n = Object.keys(t).filter((r) => r !== "format");
  return n.length === 1 && n[0] === "rich" ? F(t.rich) : String(t.format || "").trim().toLowerCase() === "rich_json" ? F(t.rich ?? t.content) : null;
}
function Nn(e) {
  const t = h(e);
  return p(t) && String(t.format || "").trim().toLowerCase() === "rich_json";
}
function $n(e) {
  return {
    image: "editorMediaImage",
    video: "editorMediaVideo",
    audio: "editorMediaAudio"
  }[e];
}
function On(...e) {
  for (const t of e) {
    const n = L(t)[0];
    if (n)
      return n;
  }
  return "";
}
function tt(e, ...t) {
  let n = e;
  for (const r of t) {
    if (!p(n))
      return;
    n = n[r];
  }
  return n;
}
function nt(e) {
  const n = (e.split(/[?#]/)[0] || "").split("/").pop() || "";
  try {
    return decodeURIComponent(n) || "文件";
  } catch {
    return n || "文件";
  }
}
function ke(e) {
  const t = String(e || "").replace(/\s+/g, " ").trim();
  return t.length > 120 ? `${t.slice(0, 120)}…` : t || "暂无内容";
}
function rt(e) {
  return /^(https?:\/\/|\/|data:)/i.test(e);
}
function Se(e) {
  const t = e.trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function Vr(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const i of n) {
    const s = i.storyboardItem;
    if (s?.sourceNodeId === t && s.itemType === "shot_image" && s.shotId) {
      const o = r.get(s.shotId) || {};
      if (bt(s.shotImageMode) === "references") {
        o.referenceNode = i, r.set(s.shotId, o);
        continue;
      }
      const c = vt(
        s.frameMediaItems
      );
      if (c.length)
        for (const a of c)
          o[a.frameRole] = {
            node: i,
            mediaIndex: a.mediaIndex
          };
      else
        o[kt(s.frameRole)] = {
          node: i,
          mediaIndex: 1
        };
      r.set(s.shotId, o);
    }
  }
  return e.shots.map((i) => {
    const s = r.get(i.id), o = St(i);
    if (o.nodeMode === "references")
      return {
        shot: i,
        start: A(),
        references: Un(s?.referenceNode)
      };
    if (o.nodeMode === "last_frame")
      return {
        shot: i,
        start: A(s?.end)
      };
    if (o.nodeMode === "none")
      return {
        shot: i,
        start: A()
      };
    const c = o.mode === "next_first" ? r.get(i.shared_end_shot_id || "")?.start : s?.end;
    return {
      shot: i,
      start: A(s?.start),
      ...c ? { end: A(c) } : {}
    };
  });
}
function Un(e) {
  const t = e ? it(e) : void 0;
  return (t ? qe(t, "image") : []).slice(0, 4).map((r) => ({ node: e, imageURL: r }));
}
function A(e) {
  const t = e ? it(e.node) : void 0;
  return {
    node: e?.node,
    imageURL: t ? An(t, e?.mediaIndex || 1) : ""
  };
}
function An(e, t) {
  const n = e && typeof e == "object" && !Array.isArray(e) ? e : void 0, r = n?.meta && typeof n.meta == "object" && !Array.isArray(n.meta) ? n.meta : void 0, s = (Array.isArray(r?.items) ? r.items : []).find((c) => !c || typeof c != "object" || Array.isArray(c) ? !1 : Number(c.order) === t);
  return String(s?.image || "").trim() || qe(e, "image")[t - 1] || "";
}
function it(e) {
  const t = e.resultRef?.asset_id ?? e.asset?.id, n = e.resultRef?.version_id ?? e.asset?.version?.id ?? e.asset?.version_id, i = [e.asset?.version, ...e.asset?.versions || []].find(
    (s) => s && s.id === n && s.asset_id === t
  );
  return i ? Ue(e, i, {
    includeNodeResult: !1
  }) : Ue({
    ...e,
    asset: void 0,
    result: void 0,
    resultOutput: e.resultOutput
  });
}
function Ie(e, t) {
  const n = String(e || ""), r = Dn(t);
  if (!n || r.length === 0)
    return {
      version: 1,
      parts: n ? [{ type: "text", text: n }] : []
    };
  const i = [];
  let s = 0;
  for (; s < n.length; ) {
    const o = Bn(n, s, r);
    if (!o) {
      K(i, n.slice(s));
      break;
    }
    o.index > s && K(i, n.slice(s, o.index)), i.push({
      type: "reference",
      ref_type: o.target.refType,
      ref_id: o.target.refId,
      label: P(o.target.label),
      usage: o.target.usage,
      purpose: o.target.purpose,
      ref_trigger: o.target.trigger || "@",
      ref_version_id: o.target.versionId,
      ref_origin: o.target.origin,
      ref_origin_id: o.target.originID,
      ref_media_url: o.target.mediaURL,
      ref_media_index: o.target.mediaIndex,
      ref_media_count: o.target.mediaCount,
      ref_media_items: o.target.mediaItems,
      ref_content_selection: o.target.contentSelection
    }), s = o.index + o.target.mention.length;
  }
  return { version: 1, parts: i };
}
function Wr(e, t) {
  return Ie(
    e,
    qn(t)
  );
}
function Er(e, t) {
  const n = st(
    t,
    G
  ), r = Ie(e, n), i = new Set(
    ot(r).map(
      G
    )
  ), s = n.filter(
    (c) => !i.has(G(c))
  );
  if (!s.length)
    return r;
  const o = [];
  for (let c = 0; c < s.length; c += 1)
    dt(
      o,
      s[c],
      c === s.length - 1 ? r.parts[0] : void 0
    );
  return { version: 1, parts: [...o, ...r.parts] };
}
function Fn(e) {
  return !!e?.parts.some((t) => t.type === "reference");
}
function jr(e, t, n) {
  if (!t || !e.includes("@") && !e.includes("#"))
    return t;
  const r = Ie(e, [
    ...ot(t),
    ...n
  ]);
  return Fn(r) ? r : t;
}
function ot(e) {
  return e ? e.parts.filter((t) => t.type === "reference").map(
    (t) => ({
      refType: t.ref_type,
      refId: t.ref_id,
      label: P(t.label),
      usage: t.usage,
      purpose: t.purpose,
      trigger: t.ref_trigger === "#" ? "#" : "@",
      versionId: t.ref_version_id,
      origin: t.ref_origin,
      originID: t.ref_origin_id,
      mediaURL: t.ref_media_url,
      mediaIndex: t.ref_media_index,
      mediaCount: t.ref_media_count,
      mediaItems: t.ref_media_items,
      contentSelection: t.ref_content_selection
    })
  ) : [];
}
function Tn(e) {
  return e ? e.parts.map(
    (t) => t.type === "text" ? t.text : `${t.ref_trigger === "#" ? "#" : "@"}${P(t.label)}`
  ).join("") : "";
}
function zr(e, t, n) {
  const r = st(
    n.filter(
      (d) => d.origin === "edge" && !!d.originID
    ),
    J
  ), i = new Map(
    r.map((d) => [
      J(d),
      d
    ])
  ), s = t?.version === 1 ? t.parts : e ? [{ type: "text", text: e }] : [], o = [], c = /* @__PURE__ */ new Set();
  let a = !1;
  for (const d of s) {
    if (d.type === "reference" && d.ref_origin === "edge" && d.ref_origin_id) {
      const u = J({
        refId: d.ref_id,
        originID: d.ref_origin_id
      }), l = i.get(u);
      if (!l) {
        a = !0;
        continue;
      }
      ct(o, {
        ...l,
        purpose: d.purpose,
        mediaURL: d.ref_media_url,
        mediaIndex: d.ref_media_index,
        mediaCount: d.ref_media_count,
        mediaItems: d.ref_media_items,
        contentSelection: d.ref_content_selection,
        ...d.ref_content_selection ? { versionId: d.ref_version_id, label: d.label } : {}
      }), c.add(u), a = !1;
      continue;
    }
    if (d.type === "text") {
      let u = d.text;
      if (a && /^\s/.test(u)) {
        const l = o[o.length - 1];
        (!l || l.type === "text" && /\s$/.test(l.text)) && (u = u.slice(1));
      }
      K(o, u), a = !1;
      continue;
    }
    o.push({ ...d }), a = !1;
  }
  const f = r.filter(
    (d) => !c.has(J(d))
  );
  if (f.length > 0) {
    const d = o[o.length - 1];
    d && (d.type !== "text" || !/\s$/.test(d.text)) && K(o, " ");
    for (const u of f)
      dt(o, u);
  }
  const _ = { version: 1, parts: o };
  return {
    value: Tn(_),
    content: _
  };
}
function P(e) {
  return e.trim().replace(/^[@#]+/, "").trim();
}
function Dn(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (n.refId <= 0)
      continue;
    const r = n.trigger || "@", i = P(n.label);
    if (!i)
      continue;
    const s = `${r}${i}`;
    t.has(s) || t.set(s, { ...n, mention: s });
  }
  return [...t.values()].sort(
    (n, r) => r.mention.length - n.mention.length
  );
}
function Bn(e, t, n) {
  let r;
  for (const i of n) {
    const s = e.indexOf(i.mention, t);
    s < 0 || (!r || s < r.index || s === r.index && i.mention.length > r.target.mention.length) && (r = { index: s, target: i });
  }
  return r;
}
function K(e, t) {
  if (!t)
    return;
  const n = e[e.length - 1];
  if (n?.type === "text") {
    n.text += t;
    return;
  }
  e.push({ type: "text", text: t });
}
function st(e, t = at) {
  const n = [], r = /* @__PURE__ */ new Set();
  for (const i of e) {
    if (i.refId <= 0 || !P(i.label))
      continue;
    const s = t(i);
    r.has(s) || (r.add(s), n.push(i));
  }
  return n;
}
function qn(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = P(n.label);
    if (n.refId <= 0 || !r)
      continue;
    const i = `${n.trigger || "@"}${r}`, s = G(n), o = t.get(i);
    if (!o) {
      t.set(i, {
        target: n,
        targetKey: s,
        ambiguous: !1
      });
      continue;
    }
    o.targetKey !== s && (o.ambiguous = !0);
  }
  return [...t.values()].filter((n) => !n.ambiguous).map((n) => n.target);
}
function G(e) {
  return `${at(e)}:${e.usage || ""}:${e.purpose || ""}`;
}
function at(e) {
  const t = e.originID ? `${e.refType}:${e.refId}:${e.origin || ""}:${e.originID}` : `${e.refType}:${e.refId}`;
  return e.contentSelection ? `${t}:${e.versionId || 0}:${ge(e.contentSelection)}` : t;
}
function J(e) {
  return `${String(e.originID || "")}:${Number(e.refId || 0)}`;
}
function ct(e, t) {
  e.push({
    type: "reference",
    ref_type: t.refType,
    ref_id: t.refId,
    label: P(t.label),
    usage: t.usage,
    purpose: t.purpose,
    ref_trigger: t.trigger || "@",
    ref_version_id: t.versionId,
    ref_origin: t.origin,
    ref_origin_id: t.originID,
    ref_media_url: t.mediaURL,
    ref_media_index: t.mediaIndex,
    ref_media_count: t.mediaCount,
    ref_media_items: t.mediaItems,
    ref_content_selection: t.contentSelection
  });
}
function dt(e, t, n) {
  ct(e, t), Ln(e, n);
}
function Ln(e, t) {
  t?.type === "text" && /^\s/.test(t.text) || K(e, " ");
}
function Jr(e, t, n, r, i) {
  if (!t || !n || t === n)
    return e;
  const s = e.findIndex((f) => i(f) === t);
  if (s < 0)
    return e;
  const o = [...e], [c] = o.splice(s, 1), a = o.findIndex((f) => i(f) === n);
  return a < 0 ? e : (o.splice(a + (r === "after" ? 1 : 0), 0, c), o);
}
function Gr(e, t, n) {
  if (!t.length)
    return e;
  const r = new Map(e.map((o) => [n(o), o])), i = [];
  for (const o of t)
    r.has(o) && i.push(r.get(o));
  const s = new Set(i.map(n));
  return [
    ...i,
    ...e.filter((o) => !s.has(n(o)))
  ];
}
function Hr(e, t) {
  return e.length === t.length && e.every((n, r) => n === t[r]);
}
export {
  V as $,
  kr as A,
  Mr as B,
  cn as C,
  zr as D,
  Or as E,
  Br as F,
  q as G,
  Nr as H,
  he as I,
  tn as J,
  R as K,
  Rr as L,
  N as M,
  Gt as N,
  Ir as O,
  Cr as P,
  Qt as Q,
  Ur as R,
  $r as S,
  nn as T,
  un as U,
  Fr as V,
  Pr as W,
  Tr as X,
  Ar as Y,
  xr as Z,
  jr as _,
  Je as a,
  er as a0,
  gr as a1,
  Zn as a2,
  S as a3,
  B as a4,
  Dt as a5,
  _r as a6,
  ir as a7,
  nr as a8,
  Ut as a9,
  Ee as aA,
  Tn as aB,
  Er as aC,
  ot as aD,
  Fn as aE,
  it as aF,
  fr as aG,
  sn as aH,
  Zt as aI,
  Dr as aJ,
  Ve as aK,
  zt as aL,
  dr as aM,
  cr as aN,
  Ot as aO,
  X as aP,
  Xn as aQ,
  U as aa,
  Gn as ab,
  or as ac,
  Ct as ad,
  Nt as ae,
  $t as af,
  zn as ag,
  pe as ah,
  rr as ai,
  Rt as aj,
  Yn as ak,
  Pe as al,
  Qn as am,
  Hn as an,
  Me as ao,
  Mt as ap,
  te as aq,
  Jn as ar,
  Ft as as,
  jn as at,
  sr as au,
  ur as av,
  Kt as aw,
  Lt as ax,
  lr as ay,
  yr as az,
  pr as b,
  Wr as c,
  mr as d,
  Jt as e,
  Tt as f,
  Kr as g,
  tr as h,
  ar as i,
  qr as j,
  Ue as k,
  Qe as l,
  Lr as m,
  P as n,
  Gr as o,
  hr as p,
  v as q,
  wr as r,
  Vr as s,
  Ye as t,
  Hr as u,
  Jr as v,
  br as w,
  wn as x,
  vr as y,
  Sr as z
};
