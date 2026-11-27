import { l as ge, r as he, n as tt, m as we, q as rt } from "./space-assistant-layout-B9KyeCM0.js";
import { n as de, C as nt } from "./asset-preview-B63J-8X6.js";
import { i as f, e as M, am as d, a9 as w, an as be, ao as Ie, ap as Se, a1 as ve, aq as X, ar as v, as as ke, at as Ce, a4 as Ne, au as xe, a5 as Re, p as it, y as ot, av as st } from "./asset-audio-preview-DlcU6JQ0.js";
import { G as at, n as Ae, _ as dt, $ as ct, B as Me, Y as ut, a0 as _t } from "./space-story-setting-reference-Dmqa_708.js";
import { w as T, s as b } from "./asset-upload-progress-DID-32U3.js";
const pt = { width: 720, height: 420 }, en = { width: 360, height: 240 }, tn = { width: 2400, height: 1600 }, Te = 48, A = 16;
function ft(e, t) {
  return e.filter((r) => r.groupId === t);
}
function rn(e, t) {
  const r = e.find((n) => n.id === t);
  return r ? r.type === "group" ? ft(e, r.id) : [r] : [];
}
function nn(e, t) {
  return !(!e || !t || e.id === t.id || e.type === "group" && t.groupId === e.id || t.type === "group" && e.groupId === t.id || e.groupId !== t.groupId && t.type !== "group" && t.groupId);
}
function on(e, t, r) {
  const n = e.find((o) => o.id === t);
  if (!n || n.x === r.x && n.y === r.y)
    return e;
  const i = r.x - n.x, s = r.y - n.y;
  return e.map((o) => o.id === t ? { ...o, ...r } : n.type === "group" && o.groupId === n.id ? {
    ...o,
    x: o.x + i,
    y: o.y + s
  } : o);
}
function sn(e, t, r) {
  const n = e.find((c) => c.id === t), i = n ? je(e, n) : void 0;
  if (!n || !i)
    return r;
  const s = ce(
    r.x,
    i.x + A,
    i.x + i.width - A - n.width
  ), o = ce(
    r.y,
    i.y + Te,
    i.y + i.height - A - n.height
  );
  return s === r.x && o === r.y ? r : { x: s, y: o };
}
function an(e, t, r) {
  const n = e.find((o) => o.id === t);
  if (!n || n.type === "group" || je(e, n))
    return e;
  const i = { ...n, ...r }, s = yt(e, i);
  return (n.groupId || "") === s ? e : e.map(
    (o) => o.id === t ? { ...o, groupId: s || void 0 } : o
  );
}
function lt(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    i.type === "group" && i.group?.origin === "script" && t.set(i.id, i.group.sourceNodeId || "");
  if (t.size === 0) return e;
  let r = !1;
  const n = e.map((i) => {
    const s = t.get(i.groupId || "");
    return s === void 0 || i.storyboardItem?.sourceNodeId === s ? i : (r = !0, { ...i, groupId: void 0 });
  });
  return r ? n : e;
}
function mt(e, t) {
  const r = new Map(e.map((s) => [s.id, s])), n = /* @__PURE__ */ new Set(), i = [];
  for (const s of t) {
    const o = s.logicalFrom || s.from, c = s.logicalTo || s.to, u = r.get(o), p = r.get(c);
    if (!u || !p)
      continue;
    const m = u.groupId !== p.groupId, _ = m && u.type !== "group" && u.groupId ? u.groupId : u.id, h = m && p.type !== "group" && p.groupId ? p.groupId : p.id;
    if (!_ || !h || _ === h)
      continue;
    const I = `${o}\0${c}\0${at(s)}`;
    n.has(I) || (n.add(I), i.push({ ...s, from: _, to: h, logicalFrom: o, logicalTo: c }));
  }
  return i;
}
function yt(e, t) {
  const r = t.x + t.width / 2, n = t.y + t.height / 2;
  return e.filter(
    (s) => s.type === "group" && s.group?.origin !== "script" && s.id !== t.id && r >= s.x + A && r <= s.x + s.width - A && n >= s.y + Te && n <= s.y + s.height - A
  ).sort(
    (s, o) => s.width * s.height - o.width * o.height
  )[0]?.id || "";
}
function je(e, t) {
  if (!(!t.groupId || t.type === "group"))
    return e.find(
      (r) => r.id === t.groupId && r.type === "group" && r.group?.origin === "script"
    );
}
function ce(e, t, r) {
  return Math.min(Math.max(e, t), Math.max(t, r));
}
const z = 30, gt = 10, ue = 100;
function ht(e) {
  return Number.isInteger(e) && e >= 1 && e <= ue ? "" : `正文章数须为 1 到 ${ue} 的整数`;
}
const _e = 20, U = 74, pe = /* @__PURE__ */ new WeakMap();
function wt(e) {
  const t = e.map((r, n) => ({
    unit: r,
    ordinal: n + 1,
    label: `第 ${n + 1} 章`,
    searchTitle: r.title.toLocaleLowerCase()
  }));
  return {
    canonical: t,
    reversed: [...t].reverse(),
    byId: new Map(t.map((r) => [r.unit.id, r])),
    firstUnwritten: t.findIndex((r) => !r.unit.has_body),
    pendingPlans: t.filter(({ unit: r }) => !r.has_body && r.plan_stale)
  };
}
function q(e) {
  let t = pe.get(e);
  return t || (t = wt(e), pe.set(e, t)), t;
}
function dn(e, t) {
  const r = t.trim().toLocaleLowerCase();
  return r ? e.reversed.filter((n) => n.searchTitle.includes(r) || String(n.ordinal) === r) : e.reversed;
}
function cn(e, t) {
  const r = Math.max(1, Math.ceil(e.length / z)), n = Math.max(0, Math.min(r - 1, t));
  return {
    page: n,
    pages: r,
    rows: e.slice(
      n * z,
      (n + 1) * z
    ),
    start: e.length ? n * z + 1 : 0,
    end: Math.min(e.length, (n + 1) * z),
    total: e.length
  };
}
function un(e, t, r) {
  const n = Math.max(
    0,
    Math.floor(t / U) - 3
  ), i = Math.min(
    e,
    Math.ceil((t + r) / U) + 3
  );
  return {
    start: Math.min(n, e),
    end: i,
    height: e * U
  };
}
function _n(e) {
  if (!e.length) return "";
  const t = e.map((r) => r.ordinal);
  return e.length === 1 ? `第 ${t[0]} 章` : `第 ${Math.min(...t)}—${Math.max(...t)} 章 · ${e.length} 章`;
}
function pn(e, t = gt) {
  if (ht(t)) return [];
  const r = q(e), n = r.firstUnwritten;
  if (n < 0) return [];
  const i = [], s = t;
  for (let o = n; o < r.canonical.length && i.length < s; o += 1) {
    const c = r.canonical[o];
    if (c.unit.has_body) break;
    i.push(c);
  }
  return i;
}
function fn(e) {
  return q(e).pendingPlans;
}
function ln(e, t, r) {
  const n = t > 0 ? Math.max(0, t - e.length) : _e, i = r === void 0 ? Math.min(n, _e) : r;
  return { start: e.length + 1, end: e.length + i, count: i };
}
const bt = [
  { value: "natural", label: "自然流畅" },
  { value: "restrained", label: "冷峻克制" },
  { value: "vivid", label: "细腻沉浸" },
  { value: "humorous", label: "轻松诙谐" }
], It = [
  { value: "first", label: "第一人称" },
  { value: "third_limited", label: "第三人称限定" },
  { value: "omniscient", label: "全知视角" }
], St = [
  { value: "complete", label: "完整故事" },
  { value: "serial", label: "连载小说" }
];
function vt(e) {
  return f(e) ? typeof e.genre == "string" && typeof e.style_instructions == "string" && [
    ["style", bt],
    ["pov", It],
    ["mode", St]
  ].every(
    ([t, r]) => e[t] === "" || r.some((n) => n.value === e[t])
  ) && [e.chapter_words, e.planned_chapters].every(
    (t) => typeof t == "number" && Number.isSafeInteger(t) && t >= 0
  ) : !1;
}
const K = [
  { id: "overview", label: "故事总纲" },
  { id: "world", label: "环境与规则" }
];
function kt(e) {
  return K.some((t) => t.id === e);
}
function Ct(e) {
  return K.every(({ id: t }) => !!e[t].trim()) && e.characters.length > 0 && e.locations.length > 0 && [e.characters, e.locations, e.props].every(
    (t) => t.every(
      (r) => !!(r.name.trim() && r.description.trim())
    )
  );
}
function Nt(e) {
  return Ct(e.outline);
}
const xt = {
  title: "故事",
  unit: "章",
  directory: "章节",
  append: "章节"
}, Q = [
  { id: "inspiration", label: "灵感" },
  { id: "outline", label: "大纲" },
  { id: "characters", label: "人物" },
  { id: "locations", label: "地点" },
  { id: "props", label: "道具" }
], mn = Q.filter(
  (e) => e.id === "characters" || e.id === "locations" || e.id === "props"
);
function Rt(e) {
  if (e.kind === "entity") return e.section;
  if (e.kind === "section")
    return e.id === "characters" || e.id === "locations" || e.id === "props" ? e.id : void 0;
}
function yn(e, t) {
  return t.kind === "section" ? !0 : t.kind === "entity" ? e.outline[t.section].some(
    (r) => r.id === t.id
  ) : e.units.some((r) => r.id === t.id);
}
function ze(e) {
  const t = M(e);
  if (!f(t)) return null;
  const r = M(t.json ?? t);
  return f(r) ? r : null;
}
function ee(e, t) {
  return Object.keys(e).every((r) => t.includes(r));
}
function G(e) {
  return !f(e) || !ee(e, ["id", "unit_type", "title", "plan", "children", "asset_id", "version_id", "has_body", "continuity_valid", "continuity_index", "continuity_status", "continuity_findings", "dependency_stale", "plan_stale"]) ? !1 : typeof e.id == "string" && typeof e.title == "string" && typeof e.plan == "string" && typeof e.has_body == "boolean" && (e.plan_stale === void 0 || typeof e.plan_stale == "boolean") && e.unit_type === "chapter" && Array.isArray(e.children) && e.children.length === 0;
}
function At(e) {
  return !f(e) || !ee(e, ["overview", "world", "characters", "locations", "props"]) ? !1 : K.every(({ id: t }) => typeof e[t] == "string") && ["characters", "locations", "props"].every(
    (t) => Array.isArray(e[t]) && e[t].every(
      (r) => f(r) && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string"
    )
  );
}
function N(e) {
  const t = ze(e);
  return !t || t.type !== "story" || t.schema_version !== 1 || typeof t.title != "string" || !ee(t, ["type", "schema_version", "title", "preferences", "inspirations", "selected_inspiration_id", "outline", "units", "archived_units", "status", "active_run_id", "active_request_id"]) || !vt(t.preferences) || typeof t.selected_inspiration_id != "string" || !Array.isArray(t.inspirations) || !t.inspirations.every(
    (r) => f(r) && typeof r.id == "string" && typeof r.title == "string" && typeof r.content == "string"
  ) || !At(t.outline) || !Array.isArray(t.units) || !t.units.every(G) || !Array.isArray(t.archived_units) || !t.archived_units.every(G) ? null : t;
}
function gn(e) {
  const t = ze(e);
  return t?.type === "writing_unit" && t.schema_version === 1 && typeof t.body == "string" ? t : null;
}
function hn(e) {
  return Ee(e.resultOutput) ? !0 : Number(e.asset?.id || e.resultRef?.asset_id) > 0 && !!(N(e.asset?.version?.content) || ge(e.power, e.kind, e.outputType));
}
function De(e, t) {
  return q(e).byId.get(t)?.label || "";
}
function wn(e, t, r) {
  return e.map((n) => n.id === t ? { ...n, ...r } : n);
}
function bn(e, t) {
  if (t.kind === "unit") {
    const r = q(e.units).byId.get(
      t.id
    )?.unit;
    return r ? `${De(e.units, r.id)} · ${r.title}` : "正文";
  }
  return t.kind === "entity" ? e.outline[t.section].find(
    (r) => r.id === t.id
  )?.name || "素材" : [...Q, ...K].find(
    (r) => r.id === t.id
  )?.label || xt.directory;
}
function In(e, t, r = "") {
  return t.kind === "unit" ? t.tab === "plan" ? q(e.units).byId.get(t.id)?.unit.plan || "" : r : t.kind === "entity" ? e.outline[t.section].find(
    (n) => n.id === t.id
  )?.description || "" : kt(t.id) ? e.outline[t.id] : "";
}
function Sn(e) {
  return e.has_body ? e.continuity_status === "raw_pending" && !e.dependency_stale ? "已写 · 记忆待补" : e.continuity_status === "pending" || e.dependency_stale ? "衔接待整理" : "已写" : e.plan_stale ? "剧情待同步" : "待写";
}
function te(e) {
  return e ? JSON.stringify([e.kind, e.ids]) : "";
}
function Mt(e) {
  return !f(e) || !["body", "unit_id", "request_id", "updated_at"].every(
    (t) => typeof e[t] == "string"
  ) || !Number.isSafeInteger(e.run_id) ? !1 : e.units === void 0 ? !0 : Array.isArray(e.units) && e.units.length > 0 && e.units.every(
    (t) => G(t) && t.title.trim() && t.plan.trim() && !t.asset_id && !t.version_id && !t.has_body && !t.continuity_valid && !t.dependency_stale && !t.plan_stale
  ) && Number.isSafeInteger(e.expected_count) && Number(e.expected_count) > 0 && typeof e.complete == "boolean" && (e.accepted_count === void 0 || Number.isSafeInteger(e.accepted_count) && Number(e.accepted_count) >= 0 && Number(e.accepted_count) <= e.units.length && Number(e.accepted_count) < Number(e.expected_count));
}
function vn(e) {
  const t = e?.checkpoint, r = t?.draft;
  return !e || e.document.status === "running" || !r?.units?.length || r.run_id !== e.run_id || r.request_id !== t?.request_id || e.document.active_run_id !== e.run_id ? void 0 : t.action === "generate_chapters" || t.action === "append" || t.action === "generate_outline" && t.phase === "chapters" ? r : void 0;
}
function Tt(e) {
  if (!f(e)) return;
  const t = e.unit_ids;
  if (!(typeof e.action != "string" || !["generate_inspirations", "generate_outline", "generate_chapters", "generate_units", "generate_section", "propose_edit", "append", "retry_continuity"].includes(e.action) || e.action === "generate_outline" && !["preferences", "direction", "characters", "background", "chapters"].includes(String(e.phase)) || e.action === "generate_units" && e.phase !== "body" && e.phase !== "continuity" || e.action === "retry_continuity" && e.phase !== "continuity" || typeof e.unit_id != "string" || !Array.isArray(t) || !t.every((r) => typeof r == "string" && !!r.trim()) || new Set(t).size !== t.length || !Number.isSafeInteger(e.completed) || Number(e.completed) < 0 || !Number.isSafeInteger(e.target) || Number(e.target) < 0 || typeof e.issued != "boolean" || e.correction_count !== void 0 && e.correction_count !== 0 && e.correction_count !== 1 || e.phase !== void 0 && !["preferences", "direction", "characters", "background", "chapters", "body", "continuity"].includes(String(e.phase)) || e.continuity_unit_id !== void 0 && typeof e.continuity_unit_id != "string" || ["history_completed", "history_total"].some((r) => e[r] !== void 0 && (!Number.isSafeInteger(e[r]) || Number(e[r]) < 0)) || e.draft !== void 0 && !Mt(e.draft) || e.section_id !== void 0 && e.section_id !== "" && !["inspiration", "overview", "world", "characters", "locations", "props", "chapter_plan"].includes(String(e.section_id)) || [
    "instruction",
    "request_id",
    "selected_text",
    "section_id",
    "entity_id",
    "inspiration_id"
  ].some(
    (r) => e[r] !== void 0 && typeof e[r] != "string"
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
function jt(e) {
  const t = M(e);
  if (!f(t)) return null;
  const r = t, n = N(r.document);
  return n && Number(r.work_asset_id) > 0 && Number(r.work_version_id) > 0 && Number.isSafeInteger(r.work_revision) && Number(r.work_revision) >= 0 ? {
    ...r,
    document: n,
    checkpoint: Tt(r.checkpoint),
    proposal: zt(r.proposal)
  } : null;
}
function Ee(e) {
  const t = M(e);
  return f(t) ? jt(t.writing) : null;
}
function kn(e, t, r) {
  const n = Ee(t), i = e.resultRef?.asset_id || e.asset?.id, s = Math.max(
    e.asset?.id === i && e.asset?.version_id || 0,
    e.resultRef?.asset_id === i && e.resultRef?.version_id || 0
  ), o = e.asset?.version, c = (e.asset?.id === i && o && o.id === s ? N(o.content) : null) || N(t);
  if (!c || !i || !s) return n;
  const u = O(o), p = {
    work_asset_id: i,
    work_version_id: s,
    work_revision: u,
    work_version: o?.version,
    work_updated_at: o?.updated_at || o?.created_at,
    document: c,
    run_id: c.active_run_id,
    request_id: c.active_request_id,
    status: c.status,
    ...r?.work_asset_id === i && r.work_version_id === s && r.work_revision === u && r.run_id === c.active_run_id && r.request_id === c.active_request_id ? { checkpoint: r.checkpoint, proposal: r.proposal } : {}
  };
  return n && n.work_asset_id === i && n.work_version_id === s && n.work_revision >= u ? n : Pt(n, p);
}
function zt(e) {
  if (!(!f(e) || typeof e.run_id != "number" || typeof e.work_asset_id != "number" || typeof e.work_version_id != "number" || !Number.isSafeInteger(e.work_revision) || Number(e.work_revision) < 0 || typeof e.replacement != "string") && ![
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
function Dt(e) {
  return f(e) ? Object.entries(e).every(([t, r]) => /^preferences\.(chapter_words|planned_chapters)$/.test(t) ? typeof r == "number" && Number.isSafeInteger(r) && r >= 0 : /^outline\.(characters|locations|props)\.\d+\.id$/.test(t) && typeof r == "string") : !1;
}
function Cn(e) {
  const t = M(e);
  if (!f(t) || !f(t.writing_preview))
    return null;
  const r = t.writing_preview;
  return typeof r.work_asset_id != "number" || typeof r.run_id != "number" || typeof r.request_id != "string" || typeof r.step_request_id != "string" || typeof r.active_field != "string" || r.phase !== void 0 && r.phase !== "" && !["preferences", "direction", "characters", "background", "chapters", "body", "continuity"].includes(String(r.phase)) || !f(r.fields) || !Object.values(r.fields).every((n) => typeof n == "string") || r.values !== void 0 && !Dt(r.values) || r.completed_sections !== void 0 && (!Array.isArray(r.completed_sections) || !r.completed_sections.every((n) => ["world", "locations", "props"].includes(n)) || new Set(r.completed_sections).size !== r.completed_sections.length) || (r.active_field === "" ? Object.keys(r.fields).length > 0 : !Object.prototype.hasOwnProperty.call(r.fields, r.active_field)) || ["unit_id", "section_id", "entity_id", "inspiration_id"].some(
    (n) => r[n] !== void 0 && typeof r[n] != "string"
  ) ? null : {
    work_asset_id: r.work_asset_id,
    run_id: r.run_id,
    request_id: r.request_id,
    step_request_id: r.step_request_id,
    phase: r.phase,
    active_field: r.active_field,
    fields: r.fields,
    values: r.values,
    completed_sections: r.completed_sections,
    unit_id: r.unit_id,
    section_id: r.section_id,
    entity_id: r.entity_id,
    inspiration_id: r.inspiration_id
  };
}
function Y(e) {
  const t = e?.checkpoint, r = t?.draft, n = Number(r?.accepted_count);
  return !e || e.document.status !== "running" || !t || !r || !Number.isSafeInteger(n) || n <= 0 || !r.units || n > r.units.length || n >= Number(t.count) || r.expected_count !== t.count || r.run_id !== e.run_id || r.request_id !== t.request_id || t.work_asset_id !== e.work_asset_id || t.work_version_id !== e.work_version_id || t.work_revision !== e.work_revision || !(t.action === "generate_chapters" || t.action === "append" || t.action === "generate_outline" && t.phase === "chapters") ? 0 : n;
}
function Nn(e) {
  const t = Y(e), r = e?.checkpoint, n = r?.draft;
  if (!e || !r || !n?.units || !t) return null;
  const i = {};
  for (const [s, o] of n.units.slice(0, t).entries())
    i[`units.${s}.title`] = o.title, i[`units.${s}.plan`] = o.plan;
  return {
    work_asset_id: e.work_asset_id,
    run_id: e.run_id,
    request_id: e.request_id,
    step_request_id: r.request_id || "",
    phase: r.phase,
    unit_id: r.unit_id,
    section_id: r.section_id,
    entity_id: r.entity_id,
    inspiration_id: r.inspiration_id,
    fields: i,
    active_field: `units.${t - 1}.plan`
  };
}
function xn(e, t) {
  if (!e || !t || t.document.status !== "running" || e.work_asset_id !== t.work_asset_id || e.run_id !== t.run_id || e.request_id !== t.request_id)
    return !1;
  const r = t.checkpoint;
  if (!r || !r.issued || (e.phase || "") !== (r.phase || "") || r.request_id && e.step_request_id !== r.request_id) return !1;
  const n = r.phase === "continuity" && r.continuity_unit_id || r.unit_id;
  return !n || e.unit_id === n;
}
function Et(e, t) {
  const r = e.checkpoint, n = t.checkpoint;
  return !r || !n ? !1 : e.document.status === "running" && t.document.status === "running" && t.work_asset_id === e.work_asset_id && t.work_version_id === e.work_version_id && t.work_revision === e.work_revision && t.run_id === e.run_id && t.request_id === e.request_id && n.action === r.action && n.phase === r.phase && n.completed === r.completed && n.target === r.target && JSON.stringify(n.unit_ids) === JSON.stringify(r.unit_ids) && ["unit_id", "continuity_unit_id", "section_id", "entity_id", "inspiration_id", "selected_text"].every(
    (i) => (n[i] || "") === (r[i] || "")
  );
}
function Ot(e, t) {
  const r = e.checkpoint, n = t.checkpoint, i = Y(e), s = r?.correction_count || 0;
  if (!r || !n || !i && !s || !Et(e, t))
    return !1;
  const o = Y(t), c = i > 0 && (!n.count || n.count === r.count), u = (n.count || 0) === (r.count || 0), p = n.correction_count || 0;
  return c && o < i || u && p < s ? !0 : o === i && p === s && r.issued && !n.issued && (c || u && s > 0);
}
function Pt(e, t) {
  return !e || e.work_asset_id !== t.work_asset_id ? t : t.work_version_id < e.work_version_id || t.work_version_id === e.work_version_id && (t.work_revision < e.work_revision || t.work_revision === e.work_revision && e.run_id > t.run_id) || Ot(e, t) || JSON.stringify(e) === JSON.stringify(t) ? e : t;
}
function Rn(e, t) {
  if (!e || !((e.outputType || e.power?.outputType) === "story" || N(e.asset?.version?.content)))
    return !1;
  const r = e.asset?.id || e.resultRef?.asset_id, n = t.asset?.id || t.resultRef?.asset_id, i = e.asset?.version_id || e.resultRef?.version_id || 0, s = t.asset?.version_id || t.resultRef?.version_id || 0;
  return !!(r && r === n && s > 0 && (s < i || s === i && N(t.asset?.version?.content) && O(t.asset?.version) < O(e.asset?.version)));
}
function An(e, t) {
  return e.id === t.id && (e.version_id > t.version_id || e.version_id === t.version_id && !!N(t.version?.content) && O(e.version) > O(t.version)) && !!N(e.version?.content);
}
function O(e) {
  const t = M(e?.content);
  return f(t) ? Number(t.writing_revision || 0) : 0;
}
function Mn(e, t, r) {
  const n = Rt(t);
  let i;
  if (n)
    i = {
      ...e,
      outline: {
        ...e.outline,
        [n]: [
          ...e.outline[n],
          { id: `new:${crypto.randomUUID()}`, name: r.title, description: r.description }
        ]
      }
    };
  else {
    const s = {
      id: `new:${crypto.randomUUID()}`,
      unit_type: "chapter",
      title: r.title,
      plan: r.description,
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
function qt(e) {
  return e.inspirations.find(
    (t) => t.id === e.selected_inspiration_id
  );
}
function $t(e) {
  return !!(e && (e.selected_inspiration_id || e.units.length || e.outline.overview.trim()));
}
function Tn(e, t) {
  const r = e.inspirations.find((n) => n.id === t);
  return !!(r?.title.trim() && r.content.trim() && !e.selected_inspiration_id);
}
function jn(e) {
  return e.units.length ? "body" : !qt(e) && !e.outline.overview.trim() ? "inspiration" : Nt(e) ? e.units.length ? "body" : "chapters" : "outline";
}
function zn(e) {
  return { kind: "section", id: "overview" };
}
const H = {
  id: 0,
  team_id: 0,
  name: "自由",
  kind: "richtext",
  cardinality: "multiple",
  status: 1,
  sort: 0,
  virtual: !0
}, Bt = { width: 180, height: 180 }, Wt = { width: 240, height: 160 }, fe = { width: 620, height: 360 }, J = { width: 800, height: 460 }, le = { width: 560, height: 520 };
function Ft(e) {
  const t = l(e);
  return {
    project: Jt(t.project),
    team: Zt(t.team),
    release: Xt(t.release),
    assetCates: C(t.asset_cates).map(Qt),
    flows: C(t.flows).map(tr),
    canvasList: C(t.canvas_list).map(L),
    canvases: nr(t.canvas),
    assets: C(l(t.assets).items).map(We),
    assistant: Vt(t.assistant),
    initialCanvasId: d(t.active_canvas_id),
    initialAssetCateId: d(t.active_asset_cate_id)
  };
}
function L(e) {
  const t = l(e);
  return {
    id: d(t.id),
    projectId: d(t.project_id),
    assetCateId: d(t.asset_cate_id),
    name: a(t.name) || "第一幕",
    sort: d(t.sort),
    status: d(t.status),
    updatedAt: a(t.updated_at),
    deletedAt: a(t.deleted_at)
  };
}
function Vt(e) {
  const t = l(e);
  return {
    available: !!t.available,
    reason: a(t.reason),
    releaseID: d(t.release_id),
    roleID: d(t.role_id),
    roleType: a(t.role_type),
    name: a(t.name) || "画布助手",
    assignment: a(t.assignment),
    agentID: d(t.agent_id),
    agentKey: a(t.agent_key),
    contextKey: a(t.context_key),
    openingEnabled: !!t.opening_enabled
  };
}
function Dn(e, t = 0, r = "第一幕") {
  return {
    id: t,
    name: r,
    sort: 0,
    status: 1,
    assetCateId: e,
    nextNodeNo: 1,
    nodes: [],
    edges: [],
    viewport: {}
  };
}
function re(e, t = 0) {
  const r = l(e), n = d(
    w(r.asset_cate_id, t)
  ), i = C(r.nodes).map(or).filter((c) => !!c), s = lt(i), o = C(r.edges).map(wr).filter((c) => !!c);
  return Kt({
    id: d(r.id),
    name: a(r.name) || "第一幕",
    sort: d(r.sort),
    status: d(r.status) || 1,
    assetCateId: n,
    nextNodeNo: Math.max(1, d(r.next_node_no)),
    nodes: s,
    edges: s === i ? o : mt(s, o),
    viewport: br(r.viewport),
    updatedAt: a(r.updated_at),
    loadedBaseline: a(r.canvas_baseline)
  });
}
function Kt(e) {
  let t = Lt(e.nodes, e.nextNodeNo), r = t !== e.nextNodeNo;
  const n = e.nodes.map((i) => {
    if (!Ut(i) || Number(i.nodeNo || 0) > 0)
      return i;
    const s = t++, o = i.titleMode || "manual";
    return r = !0, {
      ...i,
      nodeNo: s,
      titleMode: o,
      ...o === "auto" && !i.storyboardItem ? { title: Oe(i, s) } : {}
    };
  });
  return r ? { ...e, nextNodeNo: t, nodes: n } : e;
}
function Lt(e, t = 1) {
  return Math.max(
    1,
    Number(t || 1),
    ...e.map((r) => Number(r.nodeNo || 0) + 1)
  );
}
function Ut(e) {
  return e.type === "power" || e.type === "agent" || e.type === "flow";
}
function Oe(e, t) {
  let r = "节点";
  return e.type === "power" ? r = e.power?.name.trim() || Pe(e) : e.type === "agent" ? r = String(e.role?.name || "智能体").trim() || "智能体" : e.type === "flow" && (r = String(e.flow?.name || "流程").trim() || "流程"), `${r}-${t}`;
}
function En(e) {
  const t = Number(e.nodeNo || 0);
  if (t <= 0)
    return !1;
  const r = e.title.trim();
  return r === Oe(e, t).trim() ? !0 : e.type === "power" && r === `${Pe(e)}-${t}`.trim();
}
function Pe(e) {
  const t = he(
    e.power,
    e.kind,
    e.outputType
  );
  return t.outputType !== "general" && t.outputName || t.kindName;
}
function Gt(e) {
  const t = l(e);
  return {
    roles: C(t.roles).map(er),
    powers: C(t.powers).map(qe),
    powerCategories: C(t.power_cates).map(tt),
    powerKinds: C(t.power_kinds).map(rr),
    outputTypes: C(t.output_types).map(Be)
  };
}
function ne(e) {
  return We(l(e));
}
function Yt(e) {
  return e.assetCates.length > 0 ? e.assetCates : [H];
}
function On(e) {
  return Yt(e)[0]?.id ?? 0;
}
function Ht(e, t) {
  const r = e.length > 0 ? e : [H];
  return r.find((n) => n.id === t) || r[0] || H;
}
function Pn(e, t) {
  return Ht(e.assetCates, t);
}
function qn(e, t) {
  return t === 0 ? e.flows.slice(0, 4) : e.flows.filter((r) => Ir(r).has(t)).slice(0, 4);
}
function $n(e) {
  return e.create_status !== 2;
}
function Bn(e) {
  return e.createStatus !== 2;
}
function Wn(e, t, r, n, i) {
  const s = n?.x ?? 420 + r % 3 * 190, o = n?.y ?? 610 + Math.floor(r / 3) * 170, c = i?.asset, u = i?.flow, p = i?.functionOption, m = i?.power, _ = i?.role, h = m ? he(m) : null, I = Number(c?.asset_cate_id || t.id), k = {
    asset: [
      c?.name || "资产引用",
      c ? de(c.kind) : de(t.kind),
      c && nt(c.version?.content) || "引用已有资产，作为其他节点的上下文。"
    ],
    power: [
      m?.name || Sr(t.kind),
      h?.outputName || h?.kindName || "能力节点",
      m ? `调用 ${m.name} 能力，按参数生成内容。` : "输入提示词和参数，直接生成文本、图片、视频或音频。"
    ],
    agent: [
      _?.name || "智能体节点",
      _?.role_type || "角色执行",
      _?.assignment || "调用团队角色或指定智能体完成一段任务。"
    ],
    flow: [
      u?.name || "流程节点",
      "团队流程",
      u?.goal || "执行一组团队预设流程。"
    ],
    function: [
      p?.label || "保存节点",
      "功能",
      p?.description || "开始、引用、保存、展示等功能节点。"
    ],
    group: [
      "未命名分组",
      "分组",
      "拖入节点后，可统一接收上下文并执行组内节点。"
    ]
  }, [Xe, Qe, et] = k[e], ae = Ve(e, m);
  return {
    id: `local-${e}-${Date.now()}-${r}`,
    type: e,
    title: Xe,
    titleMode: e === "power" || e === "agent" || e === "flow" ? "auto" : void 0,
    subtitle: Qe,
    description: et,
    x: s,
    y: o,
    width: ae.width,
    height: ae.height,
    assetCateId: I,
    kind: c?.kind || m?.kind || t.kind,
    outputType: m?.outputType,
    cardinality: t.cardinality,
    asset: c,
    flow: u,
    functionOption: p,
    power: m,
    role: _,
    group: e === "group" ? { origin: "manual" } : void 0,
    local: !0
  };
}
function Jt(e) {
  const t = l(e), r = l(t.team);
  return {
    id: d(t.id),
    body_id: d(t.body_id),
    team_id: d(t.team_id),
    release_id: d(t.release_id),
    name: a(t.name) || "未命名作品",
    description: a(t.description),
    mode: a(t.mode) || "team",
    team: {
      id: d(r.id),
      name: a(r.name),
      version: d(r.version)
    }
  };
}
function Zt(e) {
  const t = l(e);
  return {
    id: d(t.id),
    name: a(t.name) || "自由团队",
    description: a(t.description)
  };
}
function Xt(e) {
  const t = l(e);
  return {
    id: d(t.id),
    team_id: d(t.team_id),
    version: d(t.version),
    status: a(t.status)
  };
}
function Qt(e) {
  return {
    id: d(e.id),
    team_id: d(e.team_id),
    name: a(e.name) || "未命名资产",
    kind: a(e.kind) || "text",
    cardinality: a(e.cardinality) || "single",
    status: d(e.status),
    sort: d(e.sort)
  };
}
function er(e) {
  return {
    id: d(e.id),
    team_id: d(e.team_id),
    role_type: a(e.role_type),
    role_key: a(e.role_key),
    name: a(e.name),
    agent_id: d(e.agent_id),
    assignment: a(e.assignment),
    create_status: $e(e.create_status)
  };
}
function tr(e) {
  return {
    id: d(e.id),
    name: a(e.name),
    key: a(e.key),
    goal: a(e.goal),
    config: l(e.config),
    status: d(e.status),
    sort: d(e.sort),
    output_asset_cate_ids: Ke(e.output_asset_cate_ids)
  };
}
function qe(e) {
  const t = a(e.kind) || "text", r = Be(l(e.output)), n = a(e.output_type) || "general";
  return {
    id: d(e.id),
    cate_id: d(e.cate_id),
    name: a(e.name) || a(e.key) || "未命名能力",
    key: a(e.key),
    icon: a(e.icon),
    description: a(e.description),
    outputType: n,
    output: r.key ? r : void 0,
    kind: t,
    createStatus: $e(e.create_status)
  };
}
function $e(e) {
  return Number(e) === 2 ? 2 : 1;
}
function Be(e) {
  return {
    key: a(e.key),
    name: a(e.name),
    allowedKinds: W(e.allowed_kinds),
    viewMode: a(e.view_mode),
    defaultWidth: d(e.default_width),
    defaultHeight: d(e.default_height),
    structured: !!e.structured,
    sort: d(e.sort)
  };
}
function rr(e) {
  return {
    id: a(e.id),
    value: a(e.value) || a(e.name) || a(e.id)
  };
}
function We(e) {
  const t = ie(l(e.version)), r = oe(e.versions);
  return {
    id: d(e.id),
    project_id: d(w(e.project_id, e.projectID)),
    body_id: d(w(e.body_id, e.bodyID)),
    team_id: d(w(e.team_id, e.teamID)),
    flow_id: d(w(e.flow_id, e.flowID)),
    canvas_id: d(w(e.canvas_id, e.canvasID)),
    asset_cate_id: d(
      w(e.asset_cate_id, e.assetCateID)
    ),
    node_key: a(w(e.node_key, e.nodeKey)),
    name: a(e.name),
    kind: a(e.kind) || "text",
    role: a(e.role),
    version_id: d(w(e.version_id, e.versionID)),
    status: a(e.status),
    sort: d(e.sort),
    created_at: a(w(e.created_at, e.createdAt)),
    version: t,
    versions: r.length ? r : void 0
  };
}
function ie(e) {
  const t = d(e.id);
  if (!(!t && e.content == null))
    return {
      id: t,
      asset_id: d(w(e.asset_id, e.assetID)),
      run_id: d(w(e.run_id, e.runID)),
      node_run_id: d(w(e.node_run_id, e.nodeRunID)),
      release_id: d(w(e.release_id, e.releaseID)),
      request_id: a(w(e.request_id, e.requestID)),
      node_key: a(w(e.node_key, e.nodeKey)),
      source: l(e.source),
      version: d(e.version),
      summary: a(e.summary),
      content: e.content,
      created_at: a(w(e.created_at, e.createdAt)),
      updated_at: a(w(e.updated_at, e.updatedAt))
    };
}
function oe(e) {
  return C(e).map(ie).filter((t) => !!t);
}
function nr(e) {
  const t = l(e), r = {};
  for (const [n, i] of Object.entries(t)) {
    const s = re(i), o = s.id || d(n);
    o > 0 && (r[String(o)] = { ...s, id: o });
  }
  return r;
}
function ir(e, t) {
  const r = new Map(
    t.filter((i) => i.id > 0).map((i) => [i.id, i])
  ), n = new Map(
    t.filter((i) => i.key).map((i) => [i.key, i])
  );
  for (const i of Object.values(e))
    i.nodes = i.nodes.map((s) => {
      if (s.type !== "power" || !s.power)
        return s;
      const o = r.get(Number(s.power.id || 0)) || n.get(s.power.key);
      if (!o)
        return s;
      const c = s.outputType || s.power.outputType || o.outputType;
      return {
        ...s,
        outputType: c,
        power: {
          ...o,
          outputType: c,
          output: o.outputType === c ? o.output : s.power.output
        }
      };
    });
  return e;
}
function Fn(e, t) {
  const r = String(e.id);
  return ir({ [r]: e }, t)[r];
}
function or(e) {
  const t = a(e.id), r = a(e.type);
  if (!t || !r)
    return null;
  const n = a(e.run_error), i = a(e.title), s = ct(
    e.function_option,
    i
  ), o = a(e.description), c = s?.key === "import", u = {
    id: t,
    nodeNo: d(e.node_no) || void 0,
    type: r,
    title: c && i === "导入" ? "引用" : i,
    titleMode: a(e.title_mode) === "manual" ? "manual" : a(e.title_mode) === "auto" ? "auto" : void 0,
    subtitle: a(e.subtitle),
    description: c && (!o || o === "导入资产并连接到当前节点。") ? "选择资产并引用到当前节点。" : o,
    x: d(e.x),
    y: d(e.y),
    width: d(e.width),
    height: d(e.height),
    sizeMode: e.size_mode === "auto" || e.size_mode === "manual" ? e.size_mode : void 0,
    groupId: a(e.group_id),
    group: ar(e.group),
    storyboardItem: dr(e.storyboard_item),
    storyboardMaterializedSignature: a(
      e.storyboard_materialized_signature
    ),
    storyboardFramePlanVersion: ve(
      e.storyboard_frame_plan_version
    ),
    assetCateId: d(e.asset_cate_id),
    outputType: a(e.output_type),
    count: e.count == null ? void 0 : d(e.count),
    functionOption: s,
    composerDraft: yr(e.composer_draft),
    resultRef: hr(e.result_ref),
    runTiming: ut(e.run_timing),
    resultOutput: e.result_output,
    resultView: sr(e.result_view),
    runError: Me(n) ? "" : n,
    local: e.local !== !1
  }, p = a(e.kind), m = a(
    e.cardinality
  ), _ = cr(e.flow), h = ur(e.role), I = _r(e.asset), k = pr(e.power);
  return p && (u.kind = p), m && (u.cardinality = m), _ && (u.flow = _), h && (u.role = h), I && (u.asset = I), k && (u.power = k, u.outputType = u.outputType || k.outputType, we(k) && u.width === fe.width && u.height === fe.height && (u.width = J.width, u.height = J.height)), u;
}
function sr(e) {
  const t = l(e), r = v(t.width), n = v(t.height);
  if (r == null || n == null || r <= 0 || n <= 0)
    return;
  const i = v(t.offset_x), s = v(t.offset_y);
  return {
    width: r,
    height: n,
    ...i == null ? {} : { offsetX: i },
    ...s == null ? {} : { offsetY: s }
  };
}
function ar(e) {
  const t = l(e);
  if (Object.keys(t).length)
    return {
      origin: a(t.origin),
      sourceNodeId: a(t.source_node_id),
      syncKey: a(t.sync_key),
      layoutKey: a(t.layout_key),
      visualMode: a(t.visual_mode),
      stylePrompt: a(t.style_prompt),
      aspectRatio: a(t.aspect_ratio)
    };
}
function dr(e) {
  const t = l(e), r = a(t.source_node_id), n = a(t.item_type), i = a(t.item_id);
  if (!r || !i || ![
    "character",
    "scene",
    "prop",
    "shot_image",
    "shot",
    "speech",
    "subtitle",
    "video_compose"
  ].includes(n))
    return;
  const s = f(t.generated_inputs) ? {
    referenceContent: Z(
      t.generated_inputs.reference_content
    ),
    visualContext: typeof t.generated_inputs.visual_context == "string" ? t.generated_inputs.visual_context : void 0,
    voice: typeof t.generated_inputs.voice == "string" ? t.generated_inputs.voice : void 0
  } : void 0;
  return {
    sourceNodeId: r,
    itemType: n,
    itemId: i,
    generatedPrompt: a(t.generated_prompt),
    generatedInputs: s,
    dependencyNodeIds: W(t.dependency_node_ids),
    referenceNodeIds: W(t.reference_node_ids),
    externalReferenceAssetIds: Ke(t.external_reference_asset_ids),
    shotId: a(t.shot_id),
    shotImageMode: Re(t.shot_image_mode),
    frameRole: xe(t.frame_role),
    frameMediaItems: Ne(t.frame_media_items),
    imageSequenceFrames: Ce(
      t.image_sequence_frames
    ),
    speechId: a(t.speech_id),
    speechIds: W(t.speech_ids),
    characterId: a(t.character_id),
    speechKind: a(t.speech_kind),
    speakerMode: a(t.speaker_mode),
    startTime: v(t.start_time),
    shotDuration: v(t.shot_duration),
    requiredDurationValues: ke(
      t.required_duration_values
    ),
    continuityAnchor: a(t.continuity_anchor),
    sharedEndShotId: a(t.shared_end_shot_id),
    sharedStartShotId: a(t.shared_start_shot_id),
    optional: t.optional === !0 || t.optional === 1 || String(t.optional || "").toLowerCase() === "true"
  };
}
function cr(e) {
  const t = l(e), r = d(t.id), n = a(t.key), i = a(t.name);
  if (!(!r && !n && !i))
    return {
      id: r,
      key: n,
      name: i,
      goal: a(t.goal)
    };
}
function ur(e) {
  const t = l(e), r = d(t.id), n = a(t.name);
  if (!(!r && !n))
    return {
      id: r,
      name: n,
      role_type: a(t.role_type),
      agent_id: d(t.agent_id)
    };
}
function _r(e) {
  const t = l(e), r = d(t.id);
  if (r)
    return {
      id: r,
      project_id: 0,
      body_id: 0,
      team_id: 0,
      flow_id: 0,
      asset_cate_id: d(t.asset_cate_id),
      name: a(t.name),
      kind: a(t.kind),
      role: a(t.role),
      version_id: d(t.version_id),
      sort: 0
    };
}
function pr(e) {
  const t = l(e), r = d(t.id), n = a(t.key);
  if (!(!r && !n))
    return qe({
      ...t,
      id: r,
      key: n,
      name: a(t.name)
    });
}
function Fe(e) {
  const t = l(e);
  if (!Object.keys(t).length)
    return;
  const r = a(t.storyboardGridLayout);
  return {
    prompt: a(t.prompt),
    storyboardPromptOverride: a(t.storyboardPromptOverride),
    promptContent: Z(t.promptContent),
    paramValues: l(t.paramValues),
    paramBindings: dt(t.paramBindings),
    selectedTargetId: d(t.selectedTargetId),
    videoComposition: Ae(t.videoComposition),
    storyboardReferences: Se(
      t.storyboardReferences
    ),
    storyboardWorkType: gr(t.storyboardWorkType),
    storyboardLyricsSourceNodeId: a(t.storyboardLyricsSourceNodeId),
    minShotDuration: Ie(t.minShotDuration),
    storyboardRangeStartMs: me(
      t.storyboardRangeStartMs,
      !0
    ),
    storyboardRangeEndMs: me(
      t.storyboardRangeEndMs,
      !1
    ),
    storyboardGridLayout: r ? be(r) : void 0,
    multiImageMode: mr(t.multiImageMode),
    mediaSelections: Object.fromEntries(
      Object.entries(l(t.mediaSelections)).flatMap(([n, i]) => {
        const s = Z(i);
        return s ? [[n, s]] : [];
      })
    )
  };
}
function fr(e) {
  return Fe(e) || {
    prompt: "",
    paramValues: {},
    selectedTargetId: 0
  };
}
function Vn(e) {
  const t = fr(e), r = lr(t.promptContent);
  return r ? { ...t, prompt: r } : t;
}
function Kn(e) {
  return JSON.stringify([
    e.prompt,
    e.storyboardPromptOverride || "",
    e.promptContent || null,
    e.paramValues || {},
    e.paramBindings || {},
    e.selectedTargetId || 0,
    e.storyboardReferences || [],
    e.storyboardWorkType || "",
    e.storyboardLyricsSourceNodeId || "",
    e.minShotDuration || "",
    e.storyboardRangeStartMs ?? "",
    e.storyboardRangeEndMs ?? "",
    e.storyboardGridLayout || "",
    e.multiImageMode || "",
    e.mediaSelections || {}
  ]);
}
function Ln(e) {
  return JSON.stringify(
    (e?.parts || []).filter((t) => t.type === "reference")
  );
}
function lr(e) {
  return e?.parts?.some((t) => t.type === "reference") ? e.parts.map((t) => {
    if (t.type === "text")
      return t.text;
    const r = String(t.label || "").trim();
    return r.startsWith("@") ? r : `@${r}`;
  }).join("") : "";
}
function mr(e) {
  const t = a(e);
  return t === "per_image" || t === "shared_reference" ? t : void 0;
}
function yr(e) {
  const t = l(e);
  if (Object.keys(t).length)
    return Fe({
      prompt: t.prompt,
      storyboardPromptOverride: t.storyboard_prompt_override,
      promptContent: t.prompt_content,
      paramValues: t.param_values,
      paramBindings: t.param_bindings,
      selectedTargetId: t.selected_target_id,
      videoComposition: t.video_composition,
      storyboardReferences: t.storyboard_references,
      storyboardWorkType: t.storyboard_work_type,
      storyboardLyricsSourceNodeId: t.storyboard_lyrics_source_node_id,
      minShotDuration: t.min_shot_duration,
      storyboardRangeStartMs: t.storyboard_range_start_ms,
      storyboardRangeEndMs: t.storyboard_range_end_ms,
      storyboardGridLayout: t.storyboard_grid_layout,
      multiImageMode: t.multi_image_mode,
      mediaSelections: t.media_selections
    });
}
function gr(e) {
  const t = a(e);
  return X(t) ? t : void 0;
}
function me(e, t) {
  const r = v(e);
  if (!(r == null || !Number.isInteger(r) || r < (t ? 0 : 1)))
    return r;
}
function Z(e) {
  const t = l(e), r = Array.isArray(t.parts) ? t.parts.filter((n) => {
    const i = l(n);
    return i.type === "text" || i.type === "reference";
  }) : [];
  if (!(Number(t.version) !== 1 || r.length === 0))
    return { version: 1, parts: r };
}
function hr(e) {
  const t = l(e);
  if (Object.keys(t).length)
    return {
      run_id: d(t.run_id),
      request_id: a(t.request_id),
      flow_run_id: d(t.flow_run_id),
      node_run_id: d(t.node_run_id),
      asset_id: d(t.asset_id),
      version_id: d(t.version_id),
      release_id: d(t.release_id),
      role: a(t.role),
      status: a(t.status),
      updated_at: a(t.updated_at)
    };
}
function wr(e) {
  const t = a(e.from), r = a(e.to);
  if (!t || !r)
    return null;
  const n = a(e.purpose);
  return {
    id: a(e.id) || `edge-${t}-${r}`,
    from: t,
    to: r,
    logicalFrom: a(e.logical_from) || void 0,
    logicalTo: a(e.logical_to) || void 0,
    purpose: n === "media" || n === "structure" || n === "dependency" ? n : void 0,
    executionMode: a(e.execution_mode) === "manual" ? "manual" : void 0,
    mediaUsage: a(e.media_usage) || void 0
  };
}
function br(e) {
  const t = l(e), r = {};
  return t.x != null && (r.x = d(t.x)), t.y != null && (r.y = d(t.y)), t.zoom != null && (r.zoom = d(t.zoom)), r;
}
function Ir(e) {
  return new Set(e.output_asset_cate_ids);
}
function Sr(e) {
  switch (e) {
    case "image":
      return "生图能力";
    case "video":
      return "生视频能力";
    case "audio":
      return "生音频能力";
    default:
      return "文生文能力";
  }
}
function Ve(e, t) {
  switch (e) {
    case "agent":
      return { width: 154, height: 154 };
    case "flow":
      return { width: 210, height: 160 };
    case "function":
      return { width: 128, height: 46 };
    case "group":
      return { ...pt };
    case "power":
      return vr(t);
    default:
      return { width: 250, height: 170 };
  }
}
function vr(e) {
  if (ge(e))
    return kr();
  if (rt(e))
    return { ...Wt };
  if (we(e))
    return { ...J };
  const t = Cr(e);
  return t || { ...Bt };
}
function kr(e) {
  return {
    ...le,
    height: $t(e) ? 210 : le.height
  };
}
function Cr(e) {
  const t = Number(e?.output?.defaultWidth || 0), r = Number(e?.output?.defaultHeight || 0);
  return t > 0 && r > 0 ? { width: t, height: r } : null;
}
function Nr(e) {
  return Ve(
    e.type,
    e.power || {
      kind: String(e.kind || ""),
      outputType: e.outputType || ""
    }
  );
}
function xr(e) {
  if (e.sizeMode === "manual")
    return !1;
  const t = Nr(e);
  return e.width === t.width && e.height === t.height;
}
function Un(e) {
  return e.sizeMode === "auto" || xr(e);
}
function W(e) {
  return Array.isArray(e) ? e.map(a).filter(Boolean) : [];
}
function Ke(e) {
  if (!Array.isArray(e))
    return [];
  const t = [], r = /* @__PURE__ */ new Set();
  for (const n of e) {
    const i = d(n);
    !i || i <= 0 || r.has(i) || (r.add(i), t.push(i));
  }
  return t;
}
function C(e) {
  return Array.isArray(e) ? e.filter(f) : [];
}
function l(e) {
  return f(e) ? e : {};
}
function a(e) {
  return e == null ? "" : String(e).trim();
}
function se(e, t) {
  const r = String(e || ""), n = Mr(t);
  if (!r || n.length === 0)
    return {
      version: 1,
      parts: r ? [{ type: "text", text: r }] : []
    };
  const i = [];
  let s = 0;
  for (; s < r.length; ) {
    const o = Tr(r, s, n);
    if (!o) {
      P(i, r.slice(s));
      break;
    }
    o.index > s && P(i, r.slice(s, o.index)), i.push({
      type: "reference",
      ref_type: o.target.refType,
      ref_id: o.target.refId,
      label: R(o.target.label),
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
  return { version: 1, parts: i };
}
function Gn(e, t) {
  return se(
    e,
    jr(t)
  );
}
function Yn(e, t) {
  const r = Ue(
    t,
    F
  ), n = se(e, r), i = new Set(
    Le(n).map(
      F
    )
  ), s = r.filter(
    (c) => !i.has(F(c))
  );
  if (!s.length)
    return n;
  const o = [];
  for (let c = 0; c < s.length; c += 1)
    He(
      o,
      s[c],
      c === s.length - 1 ? n.parts[0] : void 0
    );
  return { version: 1, parts: [...o, ...n.parts] };
}
function Rr(e) {
  return !!e?.parts.some((t) => t.type === "reference");
}
function Hn(e, t, r) {
  if (!t || !e.includes("@") && !e.includes("#"))
    return t;
  const n = se(e, [
    ...Le(t),
    ...r
  ]);
  return Rr(n) ? n : t;
}
function Le(e) {
  return e ? e.parts.filter((t) => t.type === "reference").map(
    (t) => ({
      refType: t.ref_type,
      refId: t.ref_id,
      label: R(t.label),
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
function Ar(e) {
  return e ? e.parts.map(
    (t) => t.type === "text" ? t.text : `${t.ref_trigger === "#" ? "#" : "@"}${R(t.label)}`
  ).join("") : "";
}
function Jn(e, t, r) {
  const n = Ue(
    r.filter(
      (_) => _.origin === "edge" && !!_.originID
    ),
    B
  ), i = new Map(
    n.map((_) => [
      B(_),
      _
    ])
  ), s = t?.version === 1 ? t.parts : e ? [{ type: "text", text: e }] : [], o = [], c = /* @__PURE__ */ new Set();
  let u = !1;
  for (const _ of s) {
    if (_.type === "reference" && _.ref_origin === "edge" && _.ref_origin_id) {
      const h = B({
        refId: _.ref_id,
        originID: _.ref_origin_id
      }), I = i.get(h);
      if (!I) {
        u = !0;
        continue;
      }
      Ye(o, {
        ...I,
        usage: _.usage,
        purpose: _.purpose,
        mediaURL: _.ref_media_url,
        mediaIndex: _.ref_media_index,
        mediaCount: _.ref_media_count,
        mediaItems: _.ref_media_items,
        mediaExcluded: _.ref_media_excluded,
        contentSelection: _.ref_content_selection,
        ..._.ref_content_selection ? { versionId: _.ref_version_id, label: _.label } : {}
      }), c.add(h), u = !1;
      continue;
    }
    if (_.type === "text") {
      let h = _.text;
      if (u && /^\s/.test(h)) {
        const I = o[o.length - 1];
        (!I || I.type === "text" && /\s$/.test(I.text)) && (h = h.slice(1));
      }
      P(o, h), u = !1;
      continue;
    }
    o.push({ ..._ }), u = !1;
  }
  const p = n.filter(
    (_) => !c.has(B(_))
  );
  if (p.length > 0) {
    const _ = o[o.length - 1];
    _ && (_.type !== "text" || !/\s$/.test(_.text)) && P(o, " ");
    for (const h of p)
      He(o, h);
  }
  const m = { version: 1, parts: o };
  return {
    value: Ar(m),
    content: m
  };
}
function R(e) {
  return e.trim().replace(/^[@#]+/, "").trim();
}
function Mr(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e) {
    if (r.refId <= 0)
      continue;
    const n = r.trigger || "@", i = R(r.label);
    if (!i)
      continue;
    const s = `${n}${i}`;
    t.has(s) || t.set(s, { ...r, mention: s });
  }
  return [...t.values()].sort(
    (r, n) => n.mention.length - r.mention.length
  );
}
function Tr(e, t, r) {
  let n;
  for (const i of r) {
    const s = e.indexOf(i.mention, t);
    s < 0 || (!n || s < n.index || s === n.index && i.mention.length > n.target.mention.length) && (n = { index: s, target: i });
  }
  return n;
}
function P(e, t) {
  if (!t)
    return;
  const r = e[e.length - 1];
  if (r?.type === "text") {
    r.text += t;
    return;
  }
  e.push({ type: "text", text: t });
}
function Ue(e, t = Ge) {
  const r = [], n = /* @__PURE__ */ new Set();
  for (const i of e) {
    if (i.refId <= 0 || !R(i.label))
      continue;
    const s = t(i);
    n.has(s) || (n.add(s), r.push(i));
  }
  return r;
}
function jr(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e) {
    const n = R(r.label);
    if (r.refId <= 0 || !n)
      continue;
    const i = `${r.trigger || "@"}${n}`, s = F(r), o = t.get(i);
    if (!o) {
      t.set(i, {
        target: r,
        targetKey: s,
        ambiguous: !1
      });
      continue;
    }
    o.targetKey !== s && (o.ambiguous = !0);
  }
  return [...t.values()].filter((r) => !r.ambiguous).map((r) => r.target);
}
function F(e) {
  return `${Ge(e)}:${e.usage || ""}:${e.purpose || ""}`;
}
function Ge(e) {
  const t = e.originID ? `${e.refType}:${e.refId}:${e.origin || ""}:${e.originID}` : `${e.refType}:${e.refId}`;
  return e.contentSelection ? `${t}:${e.versionId || 0}:${te(e.contentSelection)}` : t;
}
function B(e) {
  return `${String(e.originID || "")}:${Number(e.refId || 0)}`;
}
function Ye(e, t) {
  e.push({
    type: "reference",
    ref_type: t.refType,
    ref_id: t.refId,
    label: R(t.label),
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
function He(e, t, r) {
  Ye(e, t), zr(e, r);
}
function zr(e, t) {
  t?.type === "text" && /^\s/.test(t.text) || P(e, " ");
}
function Je(e) {
  return {
    asset_cate_id: Number(e.assetCateId || 0),
    next_node_no: Math.max(1, Number(e.nextNodeNo || 1)),
    nodes: e.nodes.map(Dr),
    edges: e.edges.map((t) => ({
      id: t.id,
      from: t.from,
      to: t.to,
      ...t.logicalFrom ? { logical_from: t.logicalFrom } : {},
      ...t.logicalTo ? { logical_to: t.logicalTo } : {},
      ...t.purpose ? { purpose: t.purpose } : {},
      ...t.executionMode === "manual" ? { execution_mode: "manual" } : {},
      ...t.mediaUsage ? { media_usage: t.mediaUsage } : {}
    })),
    viewport: {
      ...e.viewport.x == null ? {} : { x: e.viewport.x },
      ...e.viewport.y == null ? {} : { y: e.viewport.y },
      ...e.viewport.zoom == null ? {} : { zoom: e.viewport.zoom }
    }
  };
}
function Dr(e) {
  const t = {
    id: e.id,
    type: e.type,
    title: e.title,
    subtitle: e.subtitle,
    description: e.description,
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height
  };
  if (D(t, "node_no", e.nodeNo), e.titleMode && (t.title_mode = e.titleMode), e.sizeMode && (t.size_mode = e.sizeMode), S(t, "group_id", e.groupId), e.group) {
    const o = {};
    S(o, "origin", e.group.origin), S(o, "source_node_id", e.group.sourceNodeId), S(o, "sync_key", e.group.syncKey), S(o, "layout_key", e.group.layoutKey), S(o, "visual_mode", e.group.visualMode), S(o, "style_prompt", e.group.stylePrompt), S(o, "aspect_ratio", e.group.aspectRatio), Object.keys(o).length > 0 && (t.group = o);
  }
  if (e.storyboardItem) {
    const o = e.storyboardItem, c = Re(o.shotImageMode), u = xe(o.frameRole), p = Ne(
      o.frameMediaItems
    ), m = Ce(
      o.imageSequenceFrames
    ), _ = ke(
      o.requiredDurationValues
    );
    t.storyboard_item = {
      source_node_id: o.sourceNodeId,
      item_type: o.itemType,
      item_id: o.itemId,
      ...o.generatedPrompt ? { generated_prompt: o.generatedPrompt } : {},
      ...o.generatedInputs ? {
        generated_inputs: {
          reference_content: o.generatedInputs.referenceContent,
          visual_context: o.generatedInputs.visualContext,
          voice: o.generatedInputs.voice
        }
      } : {},
      dependency_node_ids: o.dependencyNodeIds || [],
      reference_node_ids: o.referenceNodeIds || [],
      external_reference_asset_ids: o.externalReferenceAssetIds || [],
      ...o.shotId ? { shot_id: o.shotId } : {},
      ...c ? { shot_image_mode: c } : {},
      ...u ? { frame_role: u } : {},
      ...p.length ? {
        frame_media_items: p.map((h) => ({
          frame_role: h.frameRole,
          media_index: h.mediaIndex
        }))
      } : {},
      ...m.length ? { image_sequence_frames: m } : {},
      ...o.speechId ? { speech_id: o.speechId } : {},
      ...o.speechIds?.length ? { speech_ids: o.speechIds } : {},
      ...o.characterId ? { character_id: o.characterId } : {},
      ...o.speechKind ? { speech_kind: o.speechKind } : {},
      ...o.speakerMode ? { speaker_mode: o.speakerMode } : {},
      ...Number.isFinite(o.startTime) ? { start_time: o.startTime } : {},
      ...Number.isFinite(o.shotDuration) ? { shot_duration: o.shotDuration } : {},
      ..._.length > 0 ? { required_duration_values: _ } : {},
      ...o.sharedEndShotId ? { shared_end_shot_id: o.sharedEndShotId } : {},
      ...o.sharedStartShotId ? { shared_start_shot_id: o.sharedStartShotId } : {},
      ...o.continuityAnchor ? { continuity_anchor: o.continuityAnchor } : {},
      ...o.optional ? { optional: !0 } : {}
    };
  }
  S(
    t,
    "storyboard_materialized_signature",
    e.storyboardMaterializedSignature
  ), D(
    t,
    "storyboard_frame_plan_version",
    ve(e.storyboardFramePlanVersion)
  ), D(t, "asset_cate_id", e.assetCateId), S(t, "kind", e.kind), S(t, "output_type", e.outputType), S(t, "cardinality", e.cardinality), D(t, "count", e.count), e.flow && (t.flow = {
    id: e.flow.id,
    key: e.flow.key,
    name: e.flow.name,
    goal: e.flow.goal
  }), e.role && (t.role = {
    id: e.role.id,
    name: e.role.name,
    role_type: e.role.role_type,
    agent_id: e.role.agent_id
  }), e.asset && (t.asset = {
    id: e.asset.id,
    name: e.asset.name,
    kind: e.asset.kind,
    role: e.asset.role,
    asset_cate_id: e.asset.asset_cate_id,
    version_id: e.asset.version_id
  }), e.power && (t.power = {
    id: e.power.id,
    key: e.power.key,
    name: e.power.name,
    kind: e.power.kind,
    icon: e.power.icon,
    output_type: e.power.outputType,
    output: Pr(e.power.output)
  }), e.functionOption && (t.function_option = {
    key: e.functionOption.key,
    label: e.functionOption.label,
    description: e.functionOption.description
  });
  const r = Or(e.composerDraft);
  r && (t.composer_draft = r);
  const n = Wr(e.resultRef);
  n && (t.result_ref = n), e.runTiming?.startedAt && e.runTiming.finishedAt && (t.run_timing = {
    started_at: e.runTiming.startedAt,
    finished_at: e.runTiming.finishedAt
  }), !(Number(n?.asset_id || 0) > 0 && Number(n?.version_id || 0) > 0) && e.resultOutput != null && x(e.resultOutput) && (t.result_output = e.resultOutput);
  const s = Er(e.resultView);
  return s && (t.result_view = s), Me(e.runError) || S(t, "run_error", e.runError), e.local != null && (t.local = e.local), t;
}
function Er(e) {
  if (!e)
    return;
  const t = v(e.width), r = v(e.height);
  if (t == null || r == null || t <= 0 || r <= 0)
    return;
  const n = { width: t, height: r }, i = v(e.offsetX), s = v(e.offsetY);
  return i != null && (n.offset_x = i), s != null && (n.offset_y = s), n;
}
function Or(e) {
  if (!f(e))
    return null;
  const t = {};
  S(t, "prompt", e.prompt), S(t, "storyboard_prompt_override", e.storyboardPromptOverride);
  const r = qr(e.promptContent);
  r && x(r) && (t.prompt_content = r), D(t, "selected_target_id", e.selectedTargetId);
  const n = $r(e.paramValues);
  n && (t.param_values = n);
  const i = _t(e.paramBindings);
  i && (t.param_bindings = i);
  const s = Ae(e.videoComposition);
  s && x(s) && (t.video_composition = s);
  const o = Se(
    e.storyboardReferences
  );
  o.length > 0 && x(o) && (t.storyboard_references = o), X(e.storyboardWorkType) && (t.storyboard_work_type = e.storyboardWorkType), S(
    t,
    "storyboard_lyrics_source_node_id",
    e.storyboardLyricsSourceNodeId
  );
  const c = Ie(e.minShotDuration);
  c != null && (t.min_shot_duration = c);
  const u = v(e.storyboardRangeStartMs);
  u != null && Number.isInteger(u) && u >= 0 && (t.storyboard_range_start_ms = u);
  const p = v(e.storyboardRangeEndMs);
  return p != null && Number.isInteger(p) && p > 0 && (t.storyboard_range_end_ms = p), e.storyboardGridLayout && (t.storyboard_grid_layout = be(
    e.storyboardGridLayout
  )), (e.multiImageMode === "per_image" || e.multiImageMode === "shared_reference") && (t.multi_image_mode = e.multiImageMode), e.mediaSelections && Object.keys(e.mediaSelections).length && (t.media_selections = e.mediaSelections), Object.keys(t).length ? t : null;
}
function Pr(e) {
  if (e)
    return {
      key: e.key,
      name: e.name,
      allowed_kinds: e.allowedKinds,
      view_mode: e.viewMode,
      default_width: e.defaultWidth,
      default_height: e.defaultHeight,
      structured: e.structured,
      sort: e.sort
    };
}
function qr(e) {
  if (!(!f(e) || Number(e.version || 0) !== 1 || !Array.isArray(e.parts)))
    return e;
}
function $r(e) {
  if (!f(e))
    return null;
  const t = {};
  for (const [r, n] of Object.entries(e))
    Br(n) || x(n) && (t[r] = n);
  return Object.keys(t).length ? t : null;
}
function Br(e) {
  return f(e) ? !!(e.file || e.blob || e.preview || e.progress != null || e.uploading != null) : !1;
}
function Wr(e) {
  if (!f(e))
    return null;
  const t = {};
  for (const r of [
    "run_id",
    "request_id",
    "flow_run_id",
    "node_run_id",
    "asset_id",
    "version_id",
    "release_id",
    "role",
    "status",
    "updated_at"
  ]) {
    const n = e[r];
    n != null && x(n) && (t[r] = n);
  }
  return Object.keys(t).length ? t : null;
}
function S(e, t, r) {
  typeof r == "string" && r.trim() && (e[t] = r);
}
function D(e, t, r) {
  const n = Number(r || 0);
  n > 0 && (e[t] = n);
}
function x(e) {
  return e == null || ["string", "number", "boolean"].includes(typeof e) ? !0 : Array.isArray(e) ? e.every(x) : f(e) ? Object.values(e).every(x) : !1;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const V = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!V || Object.keys(V).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const y = V.joinSiteApi, g = V.request;
async function Zn(e, t = 0, r = 0) {
  const n = await g(y("workspace/bootstrap"), "get", {
    project_id: e,
    canvas_id: t,
    asset_cate_id: r
  });
  return Ft(
    T(n, "加载创作空间失败")
  );
}
async function Xn(e) {
  const t = await g(y("workspace/story_setting_image"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    node_id: e.nodeId,
    asset_id: e.assetId,
    version_id: e.versionId,
    request_id: e.requestId
  });
  return j(t, "替换设定形象失败", "替换结果为空");
}
async function Qn(e) {
  const t = await g(y("workspace/canvas"), "get", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    asset_cate_id: e.assetCateId || 0
  }), r = b(t, "加载分类画布失败"), n = r.assets || {}, i = Array.isArray(n.items) ? n.items : Array.isArray(n) ? n : [];
  return {
    canvas: re(r.canvas, e.assetCateId || 0),
    assets: i.map(ne),
    canvasList: Array.isArray(r.canvas_list) ? r.canvas_list.map(L) : []
  };
}
function $(e) {
  const t = f(e) ? e : {}, r = f(t.canvas) ? t.canvas : null;
  return {
    canvas: r && Array.isArray(r.nodes) ? re(r) : void 0,
    canvasList: Array.isArray(t.canvas_list) ? t.canvas_list.map(L) : [],
    activeCanvasId: Number(t.active_canvas_id || 0) || void 0
  };
}
async function ei(e) {
  const t = await g(y("workspace/canvas_create"), "post", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId,
    name: e.name || ""
  });
  return $(
    b(t, "创建画布失败")
  );
}
async function ti(e) {
  const t = await g(y("workspace/canvas_rename"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    name: e.name
  });
  return $(
    b(t, "重命名画布失败")
  );
}
async function ri(e) {
  const t = await g(
    y("workspace/canvas_reorder"),
    "post",
    {
      project_id: e.projectId,
      asset_cate_id: e.assetCateId,
      canvas_ids: e.canvasIds
    }
  );
  return $(
    b(t, "调整画布顺序失败")
  );
}
async function ni(e) {
  const t = await g(y("workspace/canvas_delete"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId
  });
  return $(
    b(t, "删除画布失败")
  );
}
async function ii(e) {
  const t = await g(y("workspace/canvas_deleted"), "get", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId
  }), r = b(t, "加载已删除画布失败");
  return Array.isArray(r.items) ? r.items.map(L) : [];
}
async function oi(e) {
  const t = await g(
    y("workspace/canvas_restore"),
    "post",
    {
      project_id: e.projectId,
      canvas_id: e.canvasId
    }
  );
  return $(
    b(t, "恢复画布失败")
  );
}
async function si(e) {
  const t = await g(y("project/canvas_config"), "get", {
    project_id: e
  });
  return Gt(
    T(t, "加载能力列表失败")
  );
}
async function ai(e) {
  const t = await g(
    y("project/canvas_power_form"),
    "get",
    {
      project_id: e.projectId,
      flow_id: e.flowId || 0,
      power_id: e.powerId,
      power_key: e.powerKey,
      target_id: e.targetId || 0
    }
  );
  return Vr(
    T(t, "加载能力参数失败")
  );
}
async function di(e) {
  const t = Je(e.canvas), r = e.canvas.nodes.find(
    (u) => u.id === e.startNodeId
  ), n = r?.group?.origin === "script" ? r.group : e.canvas.nodes.find((u) => u.id === r?.groupId)?.group, i = e.executionScope === "storyboard_frame" ? r?.id : r?.storyboardItem?.sourceNodeId || (n?.origin === "script" ? n.sourceNodeId : void 0), s = e.canvas.nodes.find(
    (u) => u.id === i
  ), o = [
    s?.asset?.version?.content,
    s?.resultOutput
  ].find((u) => {
    const p = it(u);
    return p && ot(p);
  });
  if (o != null) {
    const u = t.nodes.find((p) => p.id === i);
    u && (u.result_output = o);
  }
  const c = await g(
    y("workspace/canvas_execute"),
    "post",
    {
      project_id: e.projectId,
      canvas_id: e.canvasId,
      asset_cate_id: e.assetCateId,
      start_node_id: e.startNodeId,
      request_id: e.requestId || "",
      single_node: !!e.singleNode,
      target_node_ids: e.targetNodeIds || [],
      execution_scope: e.executionScope || "",
      canvas: t,
      input: e.runInput || {}
    }
  );
  return b(c, "画布运行失败");
}
async function ci(e) {
  const t = await g(
    y("workspace/canvas_node_title"),
    "post",
    {
      project_id: e.projectId,
      node_key: e.nodeKey,
      version_id: e.versionId,
      prompt: e.prompt || ""
    },
    { reportError: !1 }
  ), r = b(t, "生成节点标题失败");
  return {
    nodeKey: String(r.node_key || e.nodeKey),
    versionId: Number(r.version_id || e.versionId || 0),
    title: String(r.title || "").trim()
  };
}
function j(e, t, r) {
  const n = b(e, t).asset;
  if (!n)
    throw new Error(r);
  return ne(n);
}
async function ye(e) {
  const t = await g(
    y("workspace/canvas_execution_list"),
    "get",
    {
      project_id: e.projectId,
      canvas_id: e.canvasId || 0,
      scope: e.scope,
      asset_cate_id: e.assetCateId || 0,
      run_ids: (e.runIds || []).filter((n) => n > 0).join(","),
      before_id: e.beforeId || 0,
      limit: e.limit || 20,
      summary_only: e.summaryOnly ? 1 : 0
    },
    // 恢复观察自行重试，历史列表在画布面板显示错误。
    { reportError: !1 }
  ), r = b(t, "读取画布运行记录失败");
  return {
    count: Number(r.count || 0),
    items: Array.isArray(r.items) ? r.items : [],
    hasMore: !!r.has_more,
    beforeId: Number(r.before_id || 0)
  };
}
async function ui(e, t) {
  const r = [...new Set((e.runIds || []).filter((o) => o > 0))], n = [], i = 50;
  if (r.length > 0) {
    for (let o = 0; o < r.length; o += i) {
      t?.throwIfAborted();
      const c = await ye({
        ...e,
        runIds: r.slice(o, o + i),
        limit: i
      });
      t?.throwIfAborted(), n.push(...c.items);
    }
    return n;
  }
  let s = e.beforeId || 0;
  for (; ; ) {
    t?.throwIfAborted();
    const o = await ye({ ...e, beforeId: s, limit: i });
    if (t?.throwIfAborted(), n.push(...o.items), !o.hasMore) return n;
    if (o.beforeId <= 0 || s > 0 && o.beforeId >= s)
      throw new Error("读取画布运行记录的分页位置无效");
    s = o.beforeId;
  }
}
async function _i(e) {
  const t = Number(e.executionId || 0), r = String(e.requestId || "").trim(), n = Number(e.runId || 0), i = await g(
    y("workspace/canvas_execution"),
    "get",
    {
      project_id: e.projectId,
      execution_id: t,
      request_id: t > 0 ? "" : r,
      run_id: t > 0 || r ? 0 : n
    },
    { reportError: !1 }
  );
  return b(i, "读取画布运行详情失败");
}
async function pi(e) {
  const t = await g(y("run/approval"), "post", {
    project_id: e.projectId,
    run_id: e.runId,
    request_id: e.requestId,
    node_key: e.nodeKey,
    approval_id: e.approvalId || 0,
    data: e.feedback || {},
    decision: e.decision || "approved",
    comment: e.comment || ""
  });
  return T(t, "继续画布运行失败");
}
async function fi(e) {
  const t = await g(
    y("run/status"),
    "get",
    {
      project_id: e.projectId,
      run_id: e.runId || 0,
      request_id: e.requestId || "",
      view: "summary"
    },
    { reportError: e.reportError }
  );
  return T(t, "读取流程状态失败");
}
async function li(e) {
  const t = await g(
    y("run/stop"),
    "post",
    {
      project_id: e.projectId,
      run_id: e.runId || 0,
      request_id: e.requestId || ""
    },
    { reportError: e.reportError }
  );
  return b(t, "停止画布运行失败");
}
async function mi(e, t) {
  const r = await g(
    y("workspace/canvas_stop_all"),
    "post",
    { project_id: e, canvas_id: t }
  ), n = b(r, "停止全部画布运行失败");
  return {
    count: Number(n.count || 0),
    stoppedCount: Number(n.stopped_count || 0),
    failedCount: Number(n.failed_count || 0),
    items: Array.isArray(n.items) ? n.items : []
  };
}
async function yi(e) {
  const t = await g(y("run/interaction"), "post", {
    project_id: e.projectId,
    run_id: e.runId,
    node_run_id: e.nodeRunId || 0,
    interaction_id: e.interactionId,
    data: e.data
  });
  return T(t, "提交信息失败");
}
async function gi(e) {
  const t = await g(
    y("project/update_asset_version"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      expected_updated_at: e.expectedUpdatedAt || "",
      request_id: e.requestId || "",
      save_mode: e.saveMode || "",
      content: e.content
    }
  );
  return j(
    t,
    "保存资产版本失败",
    "资产版本保存结果为空"
  );
}
async function hi(e) {
  const t = await g(
    y("project/restore_asset_version"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      request_id: e.requestId,
      node_key: e.nodeKey
    }
  );
  return j(
    t,
    "恢复资产版本失败",
    "资产版本恢复结果为空"
  );
}
async function wi(e) {
  const t = await g(
    y("project/confirm_storyboard"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      expected_updated_at: e.expectedUpdatedAt,
      production_plan: e.productionPlan
    }
  );
  return j(t, "确认分镜失败", "确认分镜结果为空");
}
async function bi(e) {
  const t = await g(
    y("project/create_storyboard_revision"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      expected_current_version_id: e.expectedCurrentVersionId,
      request_id: e.requestId,
      node_key: e.nodeKey
    }
  );
  return j(
    t,
    "创建分镜修订稿失败",
    "创建分镜修订稿结果为空"
  );
}
async function Ii(e) {
  const t = await g(
    y("project/asset_detail"),
    "get",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      current_only: e.currentOnly ? 1 : 0
    },
    { reportError: e.reportError }
  ), r = b(t, "读取资产详情失败"), n = r.asset;
  if (!n)
    throw new Error("资产详情为空");
  const i = oe(r.versions);
  return {
    asset: ne(n),
    versions: i,
    versionTotal: Number(r.version_total || i.length),
    hasMore: !!r.has_more
  };
}
async function Si(e) {
  const t = await g(
    y("project/asset_versions"),
    "get",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      page: e.page,
      page_size: e.pageSize || 20
    },
    { reportError: e.reportError }
  ), r = b(t, "读取资产版本失败"), n = oe(r.items);
  return {
    items: n,
    page: Number(r.page || e.page || 1),
    pageSize: Number(r.page_size || e.pageSize || 20),
    total: Number(r.total || n.length),
    hasMore: !!r.has_more
  };
}
async function vi(e) {
  const t = await g(
    y("project/asset_version_detail"),
    "get",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId
    },
    { reportError: e.reportError }
  ), r = b(t, "读取历史版本失败").version, n = ie(
    r && typeof r == "object" && !Array.isArray(r) ? r : {}
  );
  if (!n?.id)
    throw new Error("历史版本内容为空");
  return n;
}
function Fr(e) {
  const t = {
    project_id: e.projectId,
    canvas_id: e.canvasId || 0,
    asset_cate_id: e.assetCateId,
    name: e.name,
    kind: e.kind,
    content: e.content,
    request_id: e.requestId || ""
  };
  if (e.runId && (t.run_id = e.runId), e.nodeRunId && (t.node_run_id = e.nodeRunId), e.releaseId && (t.release_id = e.releaseId), e.nodeKey && (t.node_key = e.nodeKey), e.source) {
    const r = e.source;
    r.sourceKey && (t.source_key = r.sourceKey), r.sourceRunId && (t.source_run_id = r.sourceRunId), r.sourceNodeRunId && (t.source_node_run_id = r.sourceNodeRunId), r.sourceAssetId && (t.source_asset_id = r.sourceAssetId), r.sourceVersionId && (t.source_version_id = r.sourceVersionId), r.sourceReleaseId && (t.source_release_id = r.sourceReleaseId), r.sourceRequestId && (t.source_request_id = r.sourceRequestId), r.sourceNodeKey && (t.source_node_key = r.sourceNodeKey), r.sourceNodeType && (t.source_node_type = r.sourceNodeType), r.sourceStatus && (t.source_status = r.sourceStatus);
  }
  return t;
}
async function Ze(e, t) {
  const r = await g(y("project/save_asset"), "post", {
    ...Fr(t),
    role: e
  });
  return j(r, "保存资产失败", "保存资产结果为空");
}
function ki(e) {
  return Ze("work", e);
}
function Ci(e) {
  return Ze("material", e);
}
async function Ni(e) {
  const t = await g(
    y("workspace/canvas"),
    "post",
    {
      project_id: e.projectId,
      canvas_id: e.canvasId,
      asset_cate_id: e.assetCateId,
      canvas_baseline: e.baseline,
      canvas: Je(e.canvas)
    },
    // 保存状态、首次失败和重试由 useCanvasAutosave 统一处理。
    { reportError: !1 }
  ), r = b(t, "保存画布失败"), n = r.canvas_baseline;
  if (typeof n != "string" || !n)
    throw new Error("保存画布响应缺少版本信息");
  return {
    canvasId: Number(r.canvas_id || e.canvasId || 0),
    assetCateId: Number(r.asset_cate_id || e.assetCateId || 0),
    updatedAt: String(r.updated_at || e.canvas.updatedAt || ""),
    baseline: n
  };
}
function Vr(e) {
  const t = f(e) ? e : {}, r = f(t.power) ? t.power : {}, n = f(r.output) ? r.output : {}, i = Gr(
    t.storyboard_work_types
  ), s = Yr(
    t.storyboard_reference_purposes,
    i
  ), o = st(
    t.storyboard_min_shot_durations
  ), c = String(r.output_type || r.outputType || "").trim(), u = String(
    n.view_mode || n.viewMode || ""
  ).trim();
  if ((c === "storyboard" || u === "storyboard") && (i.length === 0 || s.length === 0 || o.length === 0))
    throw new Error("分镜作品类型、参考用途或最短时长注册信息缺失");
  const p = new Set(
    s.map((m) => m.key)
  );
  if (i.some(
    (m) => m.required_reference_purposes.some(
      (_) => !p.has(_)
    )
  ))
    throw new Error("分镜作品类型引用了未知的参考用途");
  return {
    ...t,
    sources: Kr(t.sources),
    params: Array.isArray(t.params) ? t.params : [],
    selected_target_id: Number(t.selected_target_id || 0),
    source_rule: Number(t.source_rule || 0),
    primary_param_key: String(t.primary_param_key || ""),
    storyboard_work_types: i,
    storyboard_reference_purposes: s,
    storyboard_min_shot_durations: o
  };
}
function Kr(e) {
  return Array.isArray(e) ? e.map((t) => {
    const r = f(t) ? t : {}, n = f(r.supported_options) ? Object.fromEntries(
      Object.entries(r.supported_options).map(([i, s]) => [i.trim(), E(s)]).filter(([i, s]) => i !== "" && s.length > 0)
    ) : void 0;
    return {
      ...r,
      supported_options: n && Object.keys(n).length > 0 ? n : void 0
    };
  }) : [];
}
const Lr = /* @__PURE__ */ new Set(["image", "video", "audio"]), Ur = /* @__PURE__ */ new Set([
  "global",
  "material",
  "shot",
  "composition",
  "context"
]);
function Gr(e) {
  if (!Array.isArray(e))
    return [];
  const t = /* @__PURE__ */ new Set();
  return e.map((r) => {
    const n = f(r) ? r : {}, i = String(n.key || "").trim().toLowerCase();
    if (!X(i) || t.has(i))
      throw new Error("分镜作品类型注册信息无效");
    const s = Number(n.sort || 0);
    if (!Number.isInteger(s))
      throw new Error("分镜作品类型注册信息无效");
    return t.add(i), {
      key: i,
      name: String(n.name || "").trim() || i,
      sort: s,
      required_reference_purposes: E(
        n.required_reference_purposes
      )
    };
  }).sort((r, n) => r.sort - n.sort);
}
function Yr(e, t) {
  if (!Array.isArray(e))
    return [];
  const r = new Set(t.map((i) => i.key)), n = /* @__PURE__ */ new Set();
  return e.map((i) => {
    const s = f(i) ? i : {}, o = String(s.key || "").trim(), c = E(s.media_kinds), u = String(
      s.scope || ""
    ).trim(), p = E(
      s.work_types
    ), m = E(
      s.default_media_kinds
    ), _ = String(s.material_type || "").trim(), h = Number(s.max_count || 0), I = Number(s.sort || 0);
    if (!o || n.has(o) || c.length === 0 || c.some(
      (k) => !Lr.has(k)
    ) || !Ur.has(u) || p.some((k) => !r.has(k)) || m.some((k) => !c.includes(k)) || u === "material" && _ !== "character" && _ !== "scene" && _ !== "prop" || u !== "material" && _ || !Number.isInteger(h) || h < 0 || !Number.isInteger(I))
      throw new Error("分镜参考用途注册信息无效");
    return n.add(o), {
      key: o,
      name: String(s.name || "").trim() || o,
      media_kinds: c,
      work_types: p,
      scope: u,
      material_type: _,
      default_media_kinds: m,
      max_count: h,
      sort: I
    };
  }).sort((i, s) => i.sort - s.sort);
}
function E(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
function xi(e) {
  const t = N(e.output);
  if (!t) return [e];
  const r = [
    ...Q.map((n) => ({
      kind: "section",
      id: n.id,
      title: n.label
    })),
    ...t.units.filter((n) => n.has_body).map((n) => ({
      kind: "unit",
      id: n.id,
      title: `${De(t.units, n.id)} ${n.title}`
    }))
  ];
  return [
    e,
    ...r.map((n) => ({
      ...e,
      id: `${e.id}:${n.kind}:${n.id}`,
      title: `${e.title} · ${n.title}`,
      contentSelection: { kind: n.kind, ids: [n.id] },
      preview: { ...e.preview, text: n.title },
      output: void 0
    }))
  ];
}
function Ri(e, t) {
  const r = (t?.parts || []).flatMap(
    (n) => n.type === "reference" && n.ref_content_selection && n.ref_version_id ? [
      {
        key: `writing-pinned:${n.ref_id}:${n.ref_version_id}:${te(n.ref_content_selection)}`,
        refType: n.ref_type,
        refId: n.ref_id,
        label: n.label,
        versionID: n.ref_version_id,
        origin: n.ref_origin,
        originID: n.ref_origin_id,
        contentSelection: n.ref_content_selection
      }
    ] : []
  );
  return [...e, ...r];
}
function Ai(e, t, r) {
  return {
    ...e,
    parts: e.parts.map((n) => {
      if (n.type !== "reference" || n.ref_content_selection) return n;
      const i = t?.parts.find(
        (c) => c.type === "reference" && c.ref_type === n.ref_type && c.ref_id === n.ref_id && c.ref_version_id === n.ref_version_id && c.ref_origin_id === n.ref_origin_id && c.label === n.label
      ), s = r.find(
        (c) => c.refType === n.ref_type && c.refId === n.ref_id && c.versionID === n.ref_version_id && c.label === n.label
      ), o = i?.type === "reference" ? i.ref_content_selection : s?.contentSelection;
      return o ? { ...n, ref_content_selection: o } : n;
    })
  };
}
function Mi(e) {
  return `writing:${te(e)}`;
}
export {
  _e as $,
  se as A,
  Vn as B,
  fr as C,
  Kn as D,
  ne as E,
  gn as F,
  q as G,
  zn as H,
  yn as I,
  N as J,
  O as K,
  Rt as L,
  Mn as M,
  In as N,
  wn as O,
  kt as P,
  z as Q,
  _n as R,
  Sn as S,
  bt as T,
  It as U,
  St as V,
  cn as W,
  Q as X,
  bn as Y,
  gt as Z,
  fn as _,
  fi as a,
  Cn as a$,
  ln as a0,
  pn as a1,
  ue as a2,
  ht as a3,
  U as a4,
  un as a5,
  dn as a6,
  vn as a7,
  xn as a8,
  vr as a9,
  yi as aA,
  pi as aB,
  di as aC,
  sn as aD,
  on as aE,
  an as aF,
  ye as aG,
  oi as aH,
  ni as aI,
  ri as aJ,
  ti as aK,
  ei as aL,
  Ci as aM,
  wi as aN,
  ui as aO,
  Kt as aP,
  Ee as aQ,
  ki as aR,
  xr as aS,
  kr as aT,
  ft as aU,
  Nr as aV,
  mi as aW,
  li as aX,
  Xn as aY,
  Pt as aZ,
  Nn as a_,
  Lt as aa,
  Wn as ab,
  Rr as ac,
  mt as ad,
  Ni as ae,
  rn as af,
  nn as ag,
  tn as ah,
  en as ai,
  si as aj,
  Zn as ak,
  On as al,
  Yt as am,
  Pn as an,
  qn as ao,
  $n as ap,
  Bn as aq,
  Dn as ar,
  ii as as,
  Qn as at,
  Fn as au,
  Rn as av,
  Un as aw,
  Ht as ax,
  ci as ay,
  En as az,
  Gn as b,
  vt as b0,
  K as b1,
  mn as b2,
  jt as b3,
  Tt as b4,
  An as b5,
  Ut as b6,
  xi as b7,
  _i as b8,
  bi as c,
  Tn as d,
  jn as e,
  Ii as f,
  qt as g,
  hn as h,
  $t as i,
  xt as j,
  Hn as k,
  kn as l,
  ai as m,
  R as n,
  vi as o,
  Ri as p,
  Si as q,
  Ai as r,
  gi as s,
  hi as t,
  Jn as u,
  Ln as v,
  Mi as w,
  Le as x,
  Yn as y,
  Ar as z
};
