import { k as u, p as l, O as xe, x as ne, j as Ie, N as Se, a7 as ie, aj as G, h as q, ak as Re, s as k, g as re, M as Ne, L as b, e as oe } from "./asset-audio-preview-Cezm24us.js";
import { ac as Me, ad as Ce, p as $e, ae as se, W as Oe, V as H, af as Ae, _ as Te, d as Ue } from "./asset-preview-Bb3VoJnt.js";
import { j as We } from "./space-assistant-layout-Drz4je9C.js";
const v = 30, De = 10, Q = 100;
function Pe(e) {
  return Number.isInteger(e) && e >= 1 && e <= Q ? "" : `正文章数须为 1 到 ${Q} 的整数`;
}
const X = 20, T = 74, Y = /* @__PURE__ */ new WeakMap();
function Le(e) {
  const t = e.map((n, i) => ({
    unit: n,
    ordinal: i + 1,
    label: `第 ${i + 1} 章`,
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
function R(e) {
  let t = Y.get(e);
  return t || (t = Le(e), Y.set(e, t)), t;
}
function Rt(e, t) {
  const n = t.trim().toLocaleLowerCase();
  return n ? e.reversed.filter((i) => i.searchTitle.includes(n) || String(i.ordinal) === n) : e.reversed;
}
function Nt(e, t) {
  const n = Math.max(1, Math.ceil(e.length / v)), i = Math.max(0, Math.min(n - 1, t));
  return {
    page: i,
    pages: n,
    rows: e.slice(
      i * v,
      (i + 1) * v
    ),
    start: e.length ? i * v + 1 : 0,
    end: Math.min(e.length, (i + 1) * v),
    total: e.length
  };
}
function Mt(e, t, n) {
  const i = Math.max(
    0,
    Math.floor(t / T) - 3
  ), r = Math.min(
    e,
    Math.ceil((t + n) / T) + 3
  );
  return {
    start: Math.min(i, e),
    end: r,
    height: e * T
  };
}
function Ct(e) {
  if (!e.length) return "";
  const t = e.map((n) => n.ordinal);
  return e.length === 1 ? `第 ${t[0]} 章` : `第 ${Math.min(...t)}—${Math.max(...t)} 章 · ${e.length} 章`;
}
function $t(e, t = De) {
  if (Pe(t)) return [];
  const n = R(e), i = n.firstUnwritten;
  if (i < 0) return [];
  const r = [], s = t;
  for (let o = i; o < n.canonical.length && r.length < s; o += 1) {
    const a = n.canonical[o];
    if (a.unit.has_body) break;
    r.push(a);
  }
  return r;
}
function Ot(e) {
  return R(e).pendingPlans;
}
function At(e, t, n) {
  const i = t > 0 ? Math.max(0, t - e.length) : X, r = n === void 0 ? Math.min(i, X) : n;
  return { start: e.length + 1, end: e.length + r, count: r };
}
const qe = [
  { value: "natural", label: "自然流畅" },
  { value: "restrained", label: "冷峻克制" },
  { value: "vivid", label: "细腻沉浸" },
  { value: "humorous", label: "轻松诙谐" }
], je = [
  { value: "first", label: "第一人称" },
  { value: "third_limited", label: "第三人称限定" },
  { value: "omniscient", label: "全知视角" }
], Be = [
  { value: "complete", label: "完整故事" },
  { value: "serial", label: "连载小说" }
];
function Fe(e) {
  return u(e) ? typeof e.genre == "string" && typeof e.style_instructions == "string" && [
    ["style", qe],
    ["pov", je],
    ["mode", Be]
  ].every(
    ([t, n]) => e[t] === "" || n.some((i) => i.value === e[t])
  ) && [e.chapter_words, e.planned_chapters].every(
    (t) => typeof t == "number" && Number.isSafeInteger(t) && t >= 0
  ) : !1;
}
const O = [
  { id: "overview", label: "故事总纲" },
  { id: "world", label: "环境与规则" }
];
function Ve(e) {
  return O.some((t) => t.id === e);
}
function Ee(e) {
  return O.every(({ id: t }) => !!e[t].trim()) && e.characters.length > 0 && e.locations.length > 0 && [e.characters, e.locations, e.props].every(
    (t) => t.every(
      (n) => !!(n.name.trim() && n.description.trim())
    )
  );
}
function ze(e) {
  return Ee(e.outline);
}
const Je = {
  title: "故事",
  unit: "章",
  directory: "章节",
  append: "章节"
}, j = [
  { id: "inspiration", label: "灵感" },
  { id: "outline", label: "大纲" },
  { id: "characters", label: "人物" },
  { id: "locations", label: "地点" },
  { id: "props", label: "道具" }
], Tt = j.filter(
  (e) => e.id === "characters" || e.id === "locations" || e.id === "props"
);
function Ke(e) {
  if (e.kind === "entity") return e.section;
  if (e.kind === "section")
    return e.id === "characters" || e.id === "locations" || e.id === "props" ? e.id : void 0;
}
function Ut(e, t) {
  return t.kind === "section" ? !0 : t.kind === "entity" ? e.outline[t.section].some(
    (n) => n.id === t.id
  ) : e.units.some((n) => n.id === t.id);
}
function ae(e) {
  const t = l(e);
  if (!u(t)) return null;
  const n = l(t.json ?? t);
  return u(n) ? n : null;
}
function B(e, t) {
  return Object.keys(e).every((n) => t.includes(n));
}
function U(e) {
  return !u(e) || !B(e, ["id", "unit_type", "title", "plan", "children", "asset_id", "version_id", "has_body", "continuity_valid", "continuity_index", "continuity_status", "continuity_findings", "dependency_stale", "plan_stale"]) ? !1 : typeof e.id == "string" && typeof e.title == "string" && typeof e.plan == "string" && typeof e.has_body == "boolean" && (e.plan_stale === void 0 || typeof e.plan_stale == "boolean") && e.unit_type === "chapter" && Array.isArray(e.children) && e.children.length === 0;
}
function Ge(e) {
  return !u(e) || !B(e, ["overview", "world", "characters", "locations", "props"]) ? !1 : O.every(({ id: t }) => typeof e[t] == "string") && ["characters", "locations", "props"].every(
    (t) => Array.isArray(e[t]) && e[t].every(
      (n) => u(n) && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string"
    )
  );
}
function g(e) {
  const t = ae(e);
  return !t || t.type !== "story" || t.schema_version !== 1 || typeof t.title != "string" || !B(t, ["type", "schema_version", "title", "preferences", "inspirations", "selected_inspiration_id", "outline", "units", "archived_units", "status", "active_run_id", "active_request_id"]) || !Fe(t.preferences) || typeof t.selected_inspiration_id != "string" || !Array.isArray(t.inspirations) || !t.inspirations.every(
    (n) => u(n) && typeof n.id == "string" && typeof n.title == "string" && typeof n.content == "string"
  ) || !Ge(t.outline) || !Array.isArray(t.units) || !t.units.every(U) || !Array.isArray(t.archived_units) || !t.archived_units.every(U) ? null : t;
}
function Wt(e) {
  const t = ae(e);
  return t?.type === "writing_unit" && t.schema_version === 1 && typeof t.body == "string" ? t : null;
}
function Dt(e) {
  return ce(e.resultOutput) ? !0 : Number(e.asset?.id || e.resultRef?.asset_id) > 0 && !!(g(e.asset?.version?.content) || We(e.power, e.kind, e.outputType));
}
function de(e, t) {
  return R(e).byId.get(t)?.label || "";
}
function Pt(e, t, n) {
  return e.map((i) => i.id === t ? { ...i, ...n } : i);
}
function Lt(e, t) {
  if (t.kind === "unit") {
    const n = R(e.units).byId.get(
      t.id
    )?.unit;
    return n ? `${de(e.units, n.id)} · ${n.title}` : "正文";
  }
  return t.kind === "entity" ? e.outline[t.section].find(
    (n) => n.id === t.id
  )?.name || "素材" : [...j, ...O].find(
    (n) => n.id === t.id
  )?.label || Je.directory;
}
function qt(e, t, n = "") {
  return t.kind === "unit" ? t.tab === "plan" ? R(e.units).byId.get(t.id)?.unit.plan || "" : n : t.kind === "entity" ? e.outline[t.section].find(
    (i) => i.id === t.id
  )?.description || "" : Ve(t.id) ? e.outline[t.id] : "";
}
function jt(e) {
  return e.has_body ? e.continuity_status === "raw_pending" && !e.dependency_stale ? "已写 · 记忆待补" : e.continuity_status === "pending" || e.dependency_stale ? "衔接待整理" : "已写" : e.plan_stale ? "剧情待同步" : "待写";
}
function F(e) {
  return e ? JSON.stringify([e.kind, e.ids]) : "";
}
function He(e) {
  return !u(e) || !["body", "unit_id", "request_id", "updated_at"].every(
    (t) => typeof e[t] == "string"
  ) || !Number.isSafeInteger(e.run_id) ? !1 : e.units === void 0 ? !0 : Array.isArray(e.units) && e.units.length > 0 && e.units.every(
    (t) => U(t) && t.title.trim() && t.plan.trim() && !t.asset_id && !t.version_id && !t.has_body && !t.continuity_valid && !t.dependency_stale && !t.plan_stale
  ) && Number.isSafeInteger(e.expected_count) && Number(e.expected_count) > 0 && typeof e.complete == "boolean" && (e.accepted_count === void 0 || Number.isSafeInteger(e.accepted_count) && Number(e.accepted_count) >= 0 && Number(e.accepted_count) <= e.units.length && Number(e.accepted_count) < Number(e.expected_count));
}
function Bt(e) {
  const t = e?.checkpoint, n = t?.draft;
  return !e || e.document.status === "running" || !n?.units?.length || n.run_id !== e.run_id || n.request_id !== t?.request_id || e.document.active_run_id !== e.run_id ? void 0 : t.action === "generate_chapters" || t.action === "append" || t.action === "generate_outline" && t.phase === "chapters" ? n : void 0;
}
function Qe(e) {
  if (!u(e)) return;
  const t = e.unit_ids;
  if (!(typeof e.action != "string" || !["generate_inspirations", "generate_outline", "generate_chapters", "generate_units", "generate_section", "propose_edit", "append", "retry_continuity"].includes(e.action) || e.action === "generate_outline" && !["preferences", "direction", "characters", "background", "chapters"].includes(String(e.phase)) || e.action === "generate_units" && e.phase !== "body" && e.phase !== "continuity" || e.action === "retry_continuity" && e.phase !== "continuity" || typeof e.unit_id != "string" || !Array.isArray(t) || !t.every((n) => typeof n == "string" && !!n.trim()) || new Set(t).size !== t.length || !Number.isSafeInteger(e.completed) || Number(e.completed) < 0 || !Number.isSafeInteger(e.target) || Number(e.target) < 0 || typeof e.issued != "boolean" || e.correction_count !== void 0 && e.correction_count !== 0 && e.correction_count !== 1 || e.phase !== void 0 && !["preferences", "direction", "characters", "background", "chapters", "body", "continuity"].includes(String(e.phase)) || e.continuity_unit_id !== void 0 && typeof e.continuity_unit_id != "string" || ["history_completed", "history_total"].some((n) => e[n] !== void 0 && (!Number.isSafeInteger(e[n]) || Number(e[n]) < 0)) || e.draft !== void 0 && !He(e.draft) || e.section_id !== void 0 && e.section_id !== "" && !["inspiration", "overview", "world", "characters", "locations", "props", "chapter_plan"].includes(String(e.section_id)) || [
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
function Xe(e) {
  const t = l(e);
  if (!u(t)) return null;
  const n = t, i = g(n.document);
  return i && Number(n.work_asset_id) > 0 && Number(n.work_version_id) > 0 && Number.isSafeInteger(n.work_revision) && Number(n.work_revision) >= 0 ? {
    ...n,
    document: i,
    checkpoint: Qe(n.checkpoint),
    proposal: Ye(n.proposal)
  } : null;
}
function ce(e) {
  const t = l(e);
  return u(t) ? Xe(t.writing) : null;
}
function Ft(e, t, n) {
  const i = ce(t), r = e.resultRef?.asset_id || e.asset?.id, s = Math.max(
    e.asset?.id === r && e.asset?.version_id || 0,
    e.resultRef?.asset_id === r && e.resultRef?.version_id || 0
  ), o = e.asset?.version, a = (e.asset?.id === r && o && o.id === s ? g(o.content) : null) || g(t);
  if (!a || !r || !s) return i;
  const c = x(o), f = {
    work_asset_id: r,
    work_version_id: s,
    work_revision: c,
    work_version: o?.version,
    work_updated_at: o?.updated_at || o?.created_at,
    document: a,
    run_id: a.active_run_id,
    request_id: a.active_request_id,
    status: a.status,
    ...n?.work_asset_id === r && n.work_version_id === s && n.work_revision === c && n.run_id === a.active_run_id && n.request_id === a.active_request_id ? { checkpoint: n.checkpoint, proposal: n.proposal } : {}
  };
  return i && i.work_asset_id === r && i.work_version_id === s && i.work_revision >= c ? i : nt(i, f);
}
function Ye(e) {
  if (!(!u(e) || typeof e.run_id != "number" || typeof e.work_asset_id != "number" || typeof e.work_version_id != "number" || !Number.isSafeInteger(e.work_revision) || Number(e.work_revision) < 0 || typeof e.replacement != "string") && ![
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
function Ze(e) {
  return u(e) ? Object.entries(e).every(([t, n]) => /^preferences\.(chapter_words|planned_chapters)$/.test(t) ? typeof n == "number" && Number.isSafeInteger(n) && n >= 0 : /^outline\.(characters|locations|props)\.\d+\.id$/.test(t) && typeof n == "string") : !1;
}
function Vt(e) {
  const t = l(e);
  if (!u(t) || !u(t.writing_preview))
    return null;
  const n = t.writing_preview;
  return typeof n.work_asset_id != "number" || typeof n.run_id != "number" || typeof n.request_id != "string" || typeof n.step_request_id != "string" || typeof n.active_field != "string" || n.phase !== void 0 && n.phase !== "" && !["preferences", "direction", "characters", "background", "chapters", "body", "continuity"].includes(String(n.phase)) || !u(n.fields) || !Object.values(n.fields).every((i) => typeof i == "string") || n.values !== void 0 && !Ze(n.values) || n.completed_sections !== void 0 && (!Array.isArray(n.completed_sections) || !n.completed_sections.every((i) => ["world", "locations", "props"].includes(i)) || new Set(n.completed_sections).size !== n.completed_sections.length) || (n.active_field === "" ? Object.keys(n.fields).length > 0 : !Object.prototype.hasOwnProperty.call(n.fields, n.active_field)) || ["unit_id", "section_id", "entity_id", "inspiration_id"].some(
    (i) => n[i] !== void 0 && typeof n[i] != "string"
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
function W(e) {
  const t = e?.checkpoint, n = t?.draft, i = Number(n?.accepted_count);
  return !e || e.document.status !== "running" || !t || !n || !Number.isSafeInteger(i) || i <= 0 || !n.units || i > n.units.length || i >= Number(t.count) || n.expected_count !== t.count || n.run_id !== e.run_id || n.request_id !== t.request_id || t.work_asset_id !== e.work_asset_id || t.work_version_id !== e.work_version_id || t.work_revision !== e.work_revision || !(t.action === "generate_chapters" || t.action === "append" || t.action === "generate_outline" && t.phase === "chapters") ? 0 : i;
}
function Et(e) {
  const t = W(e), n = e?.checkpoint, i = n?.draft;
  if (!e || !n || !i?.units || !t) return null;
  const r = {};
  for (const [s, o] of i.units.slice(0, t).entries())
    r[`units.${s}.title`] = o.title, r[`units.${s}.plan`] = o.plan;
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
    fields: r,
    active_field: `units.${t - 1}.plan`
  };
}
function zt(e, t) {
  if (!e || !t || t.document.status !== "running" || e.work_asset_id !== t.work_asset_id || e.run_id !== t.run_id || e.request_id !== t.request_id)
    return !1;
  const n = t.checkpoint;
  if (!n || !n.issued || (e.phase || "") !== (n.phase || "") || n.request_id && e.step_request_id !== n.request_id) return !1;
  const i = n.phase === "continuity" && n.continuity_unit_id || n.unit_id;
  return !i || e.unit_id === i;
}
function et(e, t) {
  const n = e.checkpoint, i = t.checkpoint;
  return !n || !i ? !1 : e.document.status === "running" && t.document.status === "running" && t.work_asset_id === e.work_asset_id && t.work_version_id === e.work_version_id && t.work_revision === e.work_revision && t.run_id === e.run_id && t.request_id === e.request_id && i.action === n.action && i.phase === n.phase && i.completed === n.completed && i.target === n.target && JSON.stringify(i.unit_ids) === JSON.stringify(n.unit_ids) && ["unit_id", "continuity_unit_id", "section_id", "entity_id", "inspiration_id", "selected_text"].every(
    (r) => (i[r] || "") === (n[r] || "")
  );
}
function tt(e, t) {
  const n = e.checkpoint, i = t.checkpoint, r = W(e), s = n?.correction_count || 0;
  if (!n || !i || !r && !s || !et(e, t))
    return !1;
  const o = W(t), a = r > 0 && (!i.count || i.count === n.count), c = (i.count || 0) === (n.count || 0), f = i.correction_count || 0;
  return a && o < r || c && f < s ? !0 : o === r && f === s && n.issued && !i.issued && (a || c && s > 0);
}
function nt(e, t) {
  return !e || e.work_asset_id !== t.work_asset_id ? t : t.work_version_id < e.work_version_id || t.work_version_id === e.work_version_id && (t.work_revision < e.work_revision || t.work_revision === e.work_revision && e.run_id > t.run_id) || tt(e, t) || JSON.stringify(e) === JSON.stringify(t) ? e : t;
}
function Jt(e, t) {
  if (!e || !((e.outputType || e.power?.outputType) === "story" || g(e.asset?.version?.content)))
    return !1;
  const n = e.asset?.id || e.resultRef?.asset_id, i = t.asset?.id || t.resultRef?.asset_id, r = e.asset?.version_id || e.resultRef?.version_id || 0, s = t.asset?.version_id || t.resultRef?.version_id || 0;
  return !!(n && n === i && s > 0 && (s < r || s === r && g(t.asset?.version?.content) && x(t.asset?.version) < x(e.asset?.version)));
}
function Kt(e, t) {
  return e.id === t.id && (e.version_id > t.version_id || e.version_id === t.version_id && !!g(t.version?.content) && x(e.version) > x(t.version)) && !!g(e.version?.content);
}
function x(e) {
  const t = l(e?.content);
  return u(t) ? Number(t.writing_revision || 0) : 0;
}
function Gt(e, t, n) {
  const i = Ke(t);
  let r;
  if (i)
    r = {
      ...e,
      outline: {
        ...e.outline,
        [i]: [
          ...e.outline[i],
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
    r = { ...e, units: [...e.units, s] };
  }
  return r;
}
function it(e) {
  return e.inspirations.find(
    (t) => t.id === e.selected_inspiration_id
  );
}
function Ht(e) {
  return !!(e && (e.selected_inspiration_id || e.units.length || e.outline.overview.trim()));
}
function Qt(e, t) {
  const n = e.inspirations.find((i) => i.id === t);
  return !!(n?.title.trim() && n.content.trim() && !e.selected_inspiration_id);
}
function Xt(e) {
  return e.units.length ? "body" : !it(e) && !e.outline.overview.trim() ? "inspiration" : ze(e) ? e.units.length ? "body" : "chapters" : "outline";
}
function Yt(e) {
  return { kind: "section", id: "overview" };
}
function ue(e) {
  return Me(e, (t) => {
    if (t.type !== "setting" || t.version !== 1 || !Array.isArray(t.materials)) return null;
    const n = t.materials.map(Ce);
    return n.some((i) => !i) ? null : { ...t, materials: n };
  });
}
function Zt(e) {
  return ue([e.asset?.version?.content, e.resultOutput]);
}
function en(e, t, n) {
  const i = ot(e, t), r = n || e.kind, s = ne(i);
  if (s)
    return {
      mode: "storyboard_grid",
      value: s,
      format: "json",
      summary: le(s),
      downloadUrl: ""
    };
  const o = $e(i);
  if (o)
    return {
      mode: "storyboard",
      value: o,
      format: "json",
      summary: se(o),
      downloadUrl: ""
    };
  const a = ue(i);
  if (a) return { mode: "setting", value: a, format: "json", summary: a.title, downloadUrl: "" };
  const c = pe(i);
  if (c) {
    if (r === "text") {
      const N = G(c);
      return M(N?.markdown || q(c));
    }
    const p = lt(i) ? null : G(c);
    return p && Re(p.plainText) ? M(p.markdown) : ee(c);
  }
  const f = P(i);
  if (f)
    return {
      mode: "file",
      value: f,
      format: "json",
      summary: f.description || f.name || "文件内容",
      downloadUrl: f.url
    };
  const m = ut(i);
  if (m)
    return M(m);
  const d = st(i);
  if (d)
    return ee(d);
  const _ = L(i) || e.description || "";
  return M(_);
}
function Z(e, t, n = {}) {
  const i = n.includeNodeResult === !1 ? t?.content : xe(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    me(e, "result", "output")
  ), r = l(i);
  if (ne(r))
    return;
  const s = Ie(r);
  for (const a of [r, l(s)])
    if (Se(a))
      return rt(a);
  const o = ct(e.kind, r);
  if (o)
    return o;
}
function rt(e) {
  const n = ie(e).map((i) => {
    if (!u(i) || i.json === void 0)
      return i;
    const r = { ...i };
    return delete r.json, r;
  });
  return n.length === 1 ? n[0] : n;
}
function ot(e, t) {
  return Ne(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    me(e, "result", "output"),
    e.description
  );
}
function fe(e) {
  if (e.mode === "storyboard" || e.mode === "storyboard_grid" || e.mode === "setting")
    return e.value;
  if (e.mode === "file")
    return dt(e.value);
  const t = String(e.value || "");
  return e.format === "markdown" ? { format: "markdown", text: t } : k(l(t)) || ft(t);
}
function tn(e) {
  return re(fe(e));
}
function nn(e, t) {
  const n = { ...e, value: t };
  if (n.mode === "storyboard")
    n.summary = se(t);
  else if (n.mode === "setting")
    n.summary = t.title;
  else if (n.mode === "storyboard_grid")
    n.summary = le(t);
  else if (n.mode === "file") {
    const i = t;
    n.summary = i.description || i.name || "文件内容", n.downloadUrl = i.url;
  } else
    n.summary = V(q(fe(n)));
  return n;
}
function le(e) {
  return b(
    e.summary,
    `${e.title || "宫格图片"} · ${e.frames.length} 张`
  );
}
function ee(e) {
  const t = q(e);
  return {
    mode: "rich",
    value: re(e),
    format: "json",
    summary: V(t),
    downloadUrl: _e(e)
  };
}
function M(e) {
  return {
    mode: "rich",
    value: e,
    format: "markdown",
    summary: V(e),
    downloadUrl: ""
  };
}
function st(e) {
  if (typeof e == "string" && l(e) === e)
    return null;
  const t = ie(e), n = [];
  return D(
    t,
    n,
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    0
  ), n.length === 0 ? null : k({ type: "doc", content: n });
}
function D(e, t, n, i, r, s) {
  if (e == null || s > 12)
    return;
  const o = l(e);
  if (typeof o == "string") {
    te(t, o, i);
    return;
  }
  if (Array.isArray(o)) {
    o.forEach(
      (c) => D(
        c,
        t,
        n,
        i,
        r,
        s + 1
      )
    );
    return;
  }
  if (!u(o) || n.has(o))
    return;
  n.add(o);
  const a = pe(o);
  if (a) {
    for (const c of a.content || [])
      t.push(c);
    return;
  }
  te(
    t,
    b(o.title, o.text),
    i
  ), at(o, t, r);
  for (const c of [
    "rich",
    "content",
    "output",
    "result",
    "data",
    "body",
    "value"
  ])
    o[c] !== void 0 && D(
      o[c],
      t,
      n,
      i,
      r,
      s + 1
    );
}
function at(e, t, n) {
  const i = [
    { kind: "image", values: [e.image, e.image_url, e.imageUrl, e.images] },
    { kind: "video", values: [e.video, e.video_url, e.videoUrl, e.videos] },
    { kind: "audio", values: [e.audio, e.audio_url, e.audioUrl, e.audios] }
  ];
  for (const r of i)
    for (const s of r.values)
      for (const o of I(s)) {
        const a = `${r.kind}:${o}`;
        n.has(a) || (n.add(a), t.push({
          type: _t(r.kind),
          attrs: { src: o }
        }));
      }
}
function te(e, t, n) {
  const i = String(t || "").trim();
  !i || ye(i) || E(i) || n.has(i) || (n.add(i), e.push({
    type: "paragraph",
    content: [{ type: "text", text: i }]
  }));
}
function I(e) {
  return Array.isArray(e) ? e.flatMap(I) : typeof e == "string" ? ye(e.trim()) ? [e.trim()] : [] : u(e) ? [
    e.url,
    e.src,
    e.path,
    e.download_url,
    e.downloadUrl
  ].flatMap(I) : [];
}
function P(e) {
  const t = l(e);
  if (Array.isArray(t)) {
    for (const i of t) {
      const r = P(i);
      if (r)
        return r;
    }
    return null;
  }
  if (!u(t))
    return null;
  const n = pt(
    t.file,
    t.file_url,
    t.fileUrl,
    t.files
  );
  if (n)
    return {
      url: n,
      name: b(t.name, t.filename, t.title) || ge(n),
      description: b(
        t.description,
        t.text,
        t.summary
      )
    };
  for (const i of ["content", "output", "result", "data", "body", "value"])
    if (t[i] !== void 0) {
      const r = P(t[i]);
      if (r)
        return r;
    }
  return null;
}
function dt(e) {
  return {
    type: "file",
    file_url: e.url,
    name: e.name || ge(e.url),
    description: e.description.trim()
  };
}
function ct(e, t) {
  if (e !== "image" && e !== "video" && e !== "audio")
    return;
  const n = I(t);
  if (n.length !== 0)
    return {
      [`${e}s`]: n
    };
}
function L(e) {
  const t = l(e);
  if (typeof t == "string")
    return E(t) ? "" : t;
  if (Array.isArray(t))
    return t.map(L).filter(Boolean).join(`

`);
  if (!u(t))
    return "";
  const n = b(
    t.text,
    t.summary,
    t.description
  );
  if (n)
    return n;
  for (const i of ["content", "output", "result", "data", "body", "value"])
    if (t[i] !== void 0) {
      const r = L(t[i]);
      if (r)
        return r;
    }
  return "";
}
function ut(e) {
  const t = l(e);
  return typeof t == "string" ? E(t) ? "" : t : u(t) && String(t.format || "").trim().toLowerCase() === "markdown" ? b(t.text, t.markdown) : "";
}
function ft(e) {
  const t = e.split(/\n{2,}/).map((n) => n.trim());
  return {
    type: "doc",
    content: (t.length ? t : [""]).map((n) => ({
      type: "paragraph",
      content: n ? [{ type: "text", text: n }] : []
    }))
  };
}
function _e(e) {
  if (!e || typeof e != "object")
    return "";
  if (["editorMediaImage", "editorMediaVideo", "editorMediaAudio"].includes(
    String(e.type || "")
  ))
    return String(e.attrs?.src || "").trim();
  for (const t of Array.isArray(e.content) ? e.content : []) {
    const n = _e(t);
    if (n)
      return n;
  }
  return "";
}
function pe(e) {
  const t = l(e);
  if (!u(t))
    return null;
  if (String(t.type || "") === "doc")
    return k(t);
  const n = Object.keys(t).filter((i) => i !== "format");
  return n.length === 1 && n[0] === "rich" ? k(t.rich) : String(t.format || "").trim().toLowerCase() === "rich_json" ? k(t.rich ?? t.content) : null;
}
function lt(e) {
  const t = l(e);
  return u(t) && String(t.format || "").trim().toLowerCase() === "rich_json";
}
function _t(e) {
  return {
    image: "editorMediaImage",
    video: "editorMediaVideo",
    audio: "editorMediaAudio"
  }[e];
}
function pt(...e) {
  for (const t of e) {
    const n = I(t)[0];
    if (n)
      return n;
  }
  return "";
}
function me(e, ...t) {
  let n = e;
  for (const i of t) {
    if (!u(n))
      return;
    n = n[i];
  }
  return n;
}
function ge(e) {
  const n = (e.split(/[?#]/)[0] || "").split("/").pop() || "";
  try {
    return decodeURIComponent(n) || "文件";
  } catch {
    return n || "文件";
  }
}
function V(e) {
  const t = String(e || "").replace(/\s+/g, " ").trim();
  return t.length > 120 ? `${t.slice(0, 120)}…` : t || "暂无内容";
}
function ye(e) {
  return /^(https?:\/\/|\/|data:)/i.test(e);
}
function E(e) {
  const t = e.trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function rn(e, t, n) {
  const i = /* @__PURE__ */ new Map();
  for (const r of n) {
    const s = r.storyboardItem;
    if (s?.sourceNodeId === t && s.itemType === "shot_image" && s.shotId) {
      const o = i.get(s.shotId) || {};
      if (Oe(s.shotImageMode) === "references") {
        o.referenceNode = r, i.set(s.shotId, o);
        continue;
      }
      const a = H(
        s.frameMediaItems
      );
      if (a.length)
        for (const c of a)
          o[c.frameRole] = {
            node: r,
            mediaIndex: c.mediaIndex
          };
      else
        o[Ae(s.frameRole)] = {
          node: r,
          mediaIndex: 1
        };
      i.set(s.shotId, o);
    }
  }
  return e.shots.map((r, s) => {
    const o = i.get(r.id), a = s === 0 ? e.chapter_boundary : void 0, c = Te(
      a?.connection === "continue" ? { ...r, continue_previous: !0 } : r
    );
    if (c.nodeMode === "references")
      return {
        shot: r,
        start: h(),
        references: mt(o?.referenceNode)
      };
    if (c.nodeMode === "last_frame") {
      const m = o?.end?.node, d = m ? z(m) : void 0, _ = d && !Array.isArray(d) ? d.meta?.storyboard_boundary_frame : void 0, p = e.shots[s - 1];
      let N = p ? i.get(p.id)?.end : void 0;
      if (a) {
        const A = n.find((w) => w.storyboardItem?.sourceNodeId === a.node_id && w.storyboardItem?.itemType === "shot_image" && w.storyboardItem?.shotId === a.shot_id), K = H(A?.storyboardItem?.frameMediaItems).find((w) => w.frameRole === "end")?.mediaIndex;
        A && K && (N = { node: A, mediaIndex: K });
      }
      return {
        shot: r,
        start: Ue(e) ? { node: m, imageURL: typeof _?.url == "string" ? _.url : "" } : h(N),
        end: h(o?.end)
      };
    }
    if (c.nodeMode === "none")
      return {
        shot: r,
        start: h()
      };
    const f = c.mode === "next_first" ? i.get(r.shared_end_shot_id || "")?.start : o?.end;
    return {
      shot: r,
      start: h(o?.start),
      ...f ? { end: h(f) } : {}
    };
  });
}
function mt(e) {
  const t = e ? z(e) : void 0;
  return (t ? oe(t, "image") : []).slice(0, 4).map((i) => ({ node: e, imageURL: i }));
}
function h(e) {
  const t = e ? z(e.node) : void 0;
  return {
    node: e?.node,
    imageURL: t ? gt(t, e?.mediaIndex || 1) : ""
  };
}
function gt(e, t) {
  const n = e && typeof e == "object" && !Array.isArray(e) ? e : void 0, i = n?.meta && typeof n.meta == "object" && !Array.isArray(n.meta) ? n.meta : void 0, s = (Array.isArray(i?.items) ? i.items : []).find((a) => !a || typeof a != "object" || Array.isArray(a) ? !1 : Number(a.order) === t);
  return String(s?.image || "").trim() || oe(e, "image")[t - 1] || "";
}
function z(e) {
  const t = e.resultRef?.asset_id ?? e.asset?.id, n = e.resultRef?.version_id ?? e.asset?.version?.id ?? e.asset?.version_id, r = [e.asset?.version, ...e.asset?.versions || []].find(
    (s) => s && s.id === n && s.asset_id === t
  );
  return r ? Z(e, r, {
    includeNodeResult: !1
  }) : Z({
    ...e,
    asset: void 0,
    result: void 0,
    resultOutput: e.resultOutput
  });
}
function J(e, t) {
  const n = String(e || ""), i = bt(t);
  if (!n || i.length === 0)
    return {
      version: 1,
      parts: n ? [{ type: "text", text: n }] : []
    };
  const r = [];
  let s = 0;
  for (; s < n.length; ) {
    const o = wt(n, s, i);
    if (!o) {
      S(r, n.slice(s));
      break;
    }
    o.index > s && S(r, n.slice(s, o.index)), r.push({
      type: "reference",
      ref_type: o.target.refType,
      ref_id: o.target.refId,
      label: y(o.target.label),
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
      ref_media_excluded: o.target.mediaExcluded,
      ref_content_selection: o.target.contentSelection
    }), s = o.index + o.target.mention.length;
  }
  return { version: 1, parts: r };
}
function on(e, t) {
  return J(
    e,
    vt(t)
  );
}
function sn(e, t) {
  const n = be(
    t,
    $
  ), i = J(e, n), r = new Set(
    he(i).map(
      $
    )
  ), s = n.filter(
    (a) => !r.has($(a))
  );
  if (!s.length)
    return i;
  const o = [];
  for (let a = 0; a < s.length; a += 1)
    ke(
      o,
      s[a],
      a === s.length - 1 ? i.parts[0] : void 0
    );
  return { version: 1, parts: [...o, ...i.parts] };
}
function yt(e) {
  return !!e?.parts.some((t) => t.type === "reference");
}
function an(e, t, n) {
  if (!t || !e.includes("@") && !e.includes("#"))
    return t;
  const i = J(e, [
    ...he(t),
    ...n
  ]);
  return yt(i) ? i : t;
}
function he(e) {
  return e ? e.parts.filter((t) => t.type === "reference").map(
    (t) => ({
      refType: t.ref_type,
      refId: t.ref_id,
      label: y(t.label),
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
      mediaExcluded: t.ref_media_excluded,
      contentSelection: t.ref_content_selection
    })
  ) : [];
}
function ht(e) {
  return e ? e.parts.map(
    (t) => t.type === "text" ? t.text : `${t.ref_trigger === "#" ? "#" : "@"}${y(t.label)}`
  ).join("") : "";
}
function dn(e, t, n) {
  const i = be(
    n.filter(
      (d) => d.origin === "edge" && !!d.originID
    ),
    C
  ), r = new Map(
    i.map((d) => [
      C(d),
      d
    ])
  ), s = t?.version === 1 ? t.parts : e ? [{ type: "text", text: e }] : [], o = [], a = /* @__PURE__ */ new Set();
  let c = !1;
  for (const d of s) {
    if (d.type === "reference" && d.ref_origin === "edge" && d.ref_origin_id) {
      const _ = C({
        refId: d.ref_id,
        originID: d.ref_origin_id
      }), p = r.get(_);
      if (!p) {
        c = !0;
        continue;
      }
      ve(o, {
        ...p,
        usage: d.usage,
        purpose: d.purpose,
        mediaURL: d.ref_media_url,
        mediaIndex: d.ref_media_index,
        mediaCount: d.ref_media_count,
        mediaItems: d.ref_media_items,
        mediaExcluded: d.ref_media_excluded,
        contentSelection: d.ref_content_selection,
        ...d.ref_content_selection ? { versionId: d.ref_version_id, label: d.label } : {}
      }), a.add(_), c = !1;
      continue;
    }
    if (d.type === "text") {
      let _ = d.text;
      if (c && /^\s/.test(_)) {
        const p = o[o.length - 1];
        (!p || p.type === "text" && /\s$/.test(p.text)) && (_ = _.slice(1));
      }
      S(o, _), c = !1;
      continue;
    }
    o.push({ ...d }), c = !1;
  }
  const f = i.filter(
    (d) => !a.has(C(d))
  );
  if (f.length > 0) {
    const d = o[o.length - 1];
    d && (d.type !== "text" || !/\s$/.test(d.text)) && S(o, " ");
    for (const _ of f)
      ke(o, _);
  }
  const m = { version: 1, parts: o };
  return {
    value: ht(m),
    content: m
  };
}
function y(e) {
  return e.trim().replace(/^[@#]+/, "").trim();
}
function bt(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (n.refId <= 0)
      continue;
    const i = n.trigger || "@", r = y(n.label);
    if (!r)
      continue;
    const s = `${i}${r}`;
    t.has(s) || t.set(s, { ...n, mention: s });
  }
  return [...t.values()].sort(
    (n, i) => i.mention.length - n.mention.length
  );
}
function wt(e, t, n) {
  let i;
  for (const r of n) {
    const s = e.indexOf(r.mention, t);
    s < 0 || (!i || s < i.index || s === i.index && r.mention.length > i.target.mention.length) && (i = { index: s, target: r });
  }
  return i;
}
function S(e, t) {
  if (!t)
    return;
  const n = e[e.length - 1];
  if (n?.type === "text") {
    n.text += t;
    return;
  }
  e.push({ type: "text", text: t });
}
function be(e, t = we) {
  const n = [], i = /* @__PURE__ */ new Set();
  for (const r of e) {
    if (r.refId <= 0 || !y(r.label))
      continue;
    const s = t(r);
    i.has(s) || (i.add(s), n.push(r));
  }
  return n;
}
function vt(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const i = y(n.label);
    if (n.refId <= 0 || !i)
      continue;
    const r = `${n.trigger || "@"}${i}`, s = $(n), o = t.get(r);
    if (!o) {
      t.set(r, {
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
function $(e) {
  return `${we(e)}:${e.usage || ""}:${e.purpose || ""}`;
}
function we(e) {
  const t = e.originID ? `${e.refType}:${e.refId}:${e.origin || ""}:${e.originID}` : `${e.refType}:${e.refId}`;
  return e.contentSelection ? `${t}:${e.versionId || 0}:${F(e.contentSelection)}` : t;
}
function C(e) {
  return `${String(e.originID || "")}:${Number(e.refId || 0)}`;
}
function ve(e, t) {
  e.push({
    type: "reference",
    ref_type: t.refType,
    ref_id: t.refId,
    label: y(t.label),
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
    ref_media_excluded: t.mediaExcluded,
    ref_content_selection: t.contentSelection
  });
}
function ke(e, t, n) {
  ve(e, t), kt(e, n);
}
function kt(e, t) {
  t?.type === "text" && /^\s/.test(t.text) || S(e, " ");
}
function cn(e) {
  const t = g(e.output);
  if (!t) return [e];
  const n = [
    ...j.map((i) => ({
      kind: "section",
      id: i.id,
      title: i.label
    })),
    ...t.units.filter((i) => i.has_body).map((i) => ({
      kind: "unit",
      id: i.id,
      title: `${de(t.units, i.id)} ${i.title}`
    }))
  ];
  return [
    e,
    ...n.map((i) => ({
      ...e,
      id: `${e.id}:${i.kind}:${i.id}`,
      title: `${e.title} · ${i.title}`,
      contentSelection: { kind: i.kind, ids: [i.id] },
      preview: { ...e.preview, text: i.title },
      output: void 0
    }))
  ];
}
function un(e, t) {
  const n = (t?.parts || []).flatMap(
    (i) => i.type === "reference" && i.ref_content_selection && i.ref_version_id ? [
      {
        key: `writing-pinned:${i.ref_id}:${i.ref_version_id}:${F(i.ref_content_selection)}`,
        refType: i.ref_type,
        refId: i.ref_id,
        label: i.label,
        versionID: i.ref_version_id,
        origin: i.ref_origin,
        originID: i.ref_origin_id,
        contentSelection: i.ref_content_selection
      }
    ] : []
  );
  return [...e, ...n];
}
function fn(e, t, n) {
  return {
    ...e,
    parts: e.parts.map((i) => {
      if (i.type !== "reference" || i.ref_content_selection) return i;
      const r = t?.parts.find(
        (a) => a.type === "reference" && a.ref_type === i.ref_type && a.ref_id === i.ref_id && a.ref_version_id === i.ref_version_id && a.ref_origin_id === i.ref_origin_id && a.label === i.label
      ), s = n.find(
        (a) => a.refType === i.ref_type && a.refId === i.ref_id && a.versionID === i.ref_version_id && a.label === i.label
      ), o = r?.type === "reference" ? r.ref_content_selection : s?.contentSelection;
      return o ? { ...i, ref_content_selection: o } : i;
    })
  };
}
function ln(e) {
  return `writing:${F(e)}`;
}
export {
  zt as $,
  g as A,
  x as B,
  Ke as C,
  Gt as D,
  qt as E,
  Pt as F,
  Ve as G,
  v as H,
  Ct as I,
  jt as J,
  qe as K,
  je as L,
  Be as M,
  Nt as N,
  j as O,
  Lt as P,
  De as Q,
  Ot as R,
  X as S,
  At as T,
  $t as U,
  Q as V,
  Pe as W,
  T as X,
  Mt as Y,
  Rt as Z,
  Bt as _,
  un as a,
  he as a0,
  sn as a1,
  ht as a2,
  yt as a3,
  z as a4,
  Jt as a5,
  ce as a6,
  nt as a7,
  Kt as a8,
  cn as a9,
  Et as aa,
  Vt as ab,
  Fe as ac,
  O as ad,
  Tt as ae,
  Xe as af,
  Qe as ag,
  y as b,
  on as c,
  rn as d,
  Qt as e,
  Xt as f,
  it as g,
  Dt as h,
  Ht as i,
  Je as j,
  Ft as k,
  en as l,
  Z as m,
  nn as n,
  fe as o,
  ue as p,
  tn as q,
  fn as r,
  Zt as s,
  an as t,
  dn as u,
  Wt as v,
  ln as w,
  R as x,
  Yt as y,
  Ut as z
};
