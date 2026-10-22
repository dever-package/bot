import { k as p, p as h, F as X, V as mt, W as pt, X as gt, j as _t, Y as yt, Z as Ae, l as ht, _ as Fe, $ as Ie, h as fe, a0 as bt, s as F, g as Te, a1 as wt, a2 as N, a3 as vt, a4 as kt, a5 as St, a6 as It, e as De } from "./asset-preview-qznc7rjG.js";
import { i as Mt } from "./preloadable-CT3tMmBD.js";
import { c as Rt } from "./react-D9GkiX5b.js";
const U = 30, Me = 20, te = 74, Re = /* @__PURE__ */ new WeakMap();
function xt(e) {
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
function E(e) {
  let t = Re.get(e);
  return t || (t = xt(e), Re.set(e, t)), t;
}
function Bn(e, t) {
  const n = t.trim().toLocaleLowerCase();
  return n ? e.reversed.filter((r) => r.searchTitle.includes(n)) : e.reversed;
}
function Ln(e, t) {
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
function Kn(e, t, n) {
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
function Vn(e) {
  if (!e.length) return "";
  const t = e.map((n) => n.ordinal);
  return e.length === 1 ? `第 ${t[0]} 章` : `第 ${Math.min(...t)}—${Math.max(...t)} 章 · ${e.length} 章`;
}
function En(e, t = 10) {
  const n = E(e), r = n.firstUnwritten;
  if (r < 0) return [];
  const i = [], s = Math.min(10, Math.max(1, t));
  for (let o = r; o < n.canonical.length && i.length < s; o += 1) {
    const d = n.canonical[o];
    if (d.unit.has_body) break;
    i.push(d);
  }
  return i;
}
function qn(e) {
  return E(e).pendingPlans;
}
function jn(e, t, n) {
  const r = t > 0 ? Math.max(0, t - e.length) : Me, i = n === void 0 ? Math.min(r, Me) : n;
  return { start: e.length + 1, end: e.length + i, count: i };
}
const Be = [
  { value: "natural", label: "自然流畅" },
  { value: "restrained", label: "冷峻克制" },
  { value: "vivid", label: "细腻沉浸" },
  { value: "humorous", label: "轻松诙谐" }
], Le = [
  { value: "first", label: "第一人称" },
  { value: "third_limited", label: "第三人称限定" },
  { value: "omniscient", label: "全知视角" }
], Ke = [
  { value: "complete", label: "完整故事" },
  { value: "serial", label: "连载小说" }
];
function Pt(e) {
  return p(e) ? typeof e.genre == "string" && typeof e.style_instructions == "string" && [
    ["style", Be],
    ["pov", Le],
    ["mode", Ke]
  ].every(
    ([t, n]) => e[t] === "" || n.some((r) => r.value === e[t])
  ) && [e.chapter_words, e.planned_chapters].every(
    (t) => typeof t == "number" && Number.isSafeInteger(t) && t >= 0
  ) : !1;
}
function Wn(e) {
  return [
    e.genre.trim(),
    Be.find((t) => t.value === e.style)?.label,
    !e.style && e.style_instructions.trim() ? "自定文风" : "",
    Le.find((t) => t.value === e.pov)?.label,
    Ke.find((t) => t.value === e.mode)?.label,
    e.chapter_words ? `每章约 ${e.chapter_words} 字` : "",
    e.planned_chapters ? `计划 ${e.planned_chapters} 章` : ""
  ].filter(Boolean).join(" · ") || "沿用创作要求";
}
const Z = [
  { id: "overview", label: "故事走向" },
  { id: "world", label: "环境与规则" }
];
function Ct(e) {
  return Z.some((t) => t.id === e);
}
function $t(e) {
  return Z.every(({ id: t }) => !!e[t].trim()) && e.characters.length > 0 && e.locations.length > 0 && [e.characters, e.locations, e.props].every(
    (t) => t.every(
      (n) => !!(n.name.trim() && n.description.trim())
    )
  );
}
function Nt(e) {
  return $t(e.outline);
}
const Ot = {
  title: "故事",
  unit: "章",
  directory: "章节",
  append: "章节"
}, le = [
  { id: "inspiration", label: "灵感" },
  { id: "outline", label: "大纲" },
  { id: "characters", label: "角色" },
  { id: "locations", label: "场景" },
  { id: "props", label: "道具" }
], zn = le.filter(
  (e) => e.id === "characters" || e.id === "locations" || e.id === "props"
);
function Ut(e) {
  if (e.kind === "entity") return e.section;
  if (e.kind === "section")
    return e.id === "characters" || e.id === "locations" || e.id === "props" ? e.id : void 0;
}
function Jn(e, t) {
  return t.kind === "section" ? !0 : t.kind === "entity" ? e.outline[t.section].some(
    (n) => n.id === t.id
  ) : e.units.some((n) => n.id === t.id);
}
function Ve(e) {
  const t = h(e);
  if (!p(t)) return null;
  const n = h(t.json ?? t);
  return p(n) ? n : null;
}
function me(e, t) {
  return Object.keys(e).every((n) => t.includes(n));
}
function xe(e) {
  return !p(e) || !me(e, ["id", "unit_type", "title", "plan", "children", "asset_id", "version_id", "has_body", "continuity_valid", "continuity_index", "continuity_status", "continuity_findings", "dependency_stale", "plan_stale"]) ? !1 : typeof e.id == "string" && typeof e.title == "string" && typeof e.plan == "string" && typeof e.has_body == "boolean" && (e.plan_stale === void 0 || typeof e.plan_stale == "boolean") && e.unit_type === "chapter" && Array.isArray(e.children) && e.children.length === 0;
}
function At(e) {
  return !p(e) || !me(e, ["overview", "world", "characters", "locations", "props"]) ? !1 : Z.every(({ id: t }) => typeof e[t] == "string") && ["characters", "locations", "props"].every(
    (t) => Array.isArray(e[t]) && e[t].every(
      (n) => p(n) && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string"
    )
  );
}
function S(e) {
  const t = Ve(e);
  return !t || t.type !== "story" || t.schema_version !== 1 || typeof t.title != "string" || !me(t, ["type", "schema_version", "title", "preferences", "inspirations", "selected_inspiration_id", "outline", "units", "archived_units", "status", "active_run_id", "active_request_id"]) || !Pt(t.preferences) || typeof t.selected_inspiration_id != "string" || !Array.isArray(t.inspirations) || !t.inspirations.every(
    (n) => p(n) && typeof n.id == "string" && typeof n.title == "string" && typeof n.content == "string"
  ) || !At(t.outline) || !Array.isArray(t.units) || !t.units.every(xe) || !Array.isArray(t.archived_units) || !t.archived_units.every(xe) ? null : t;
}
function Gn(e) {
  const t = Ve(e);
  return t?.type === "writing_unit" && t.schema_version === 1 && typeof t.body == "string" ? t : null;
}
function Hn(e) {
  return qe(e.resultOutput) ? !0 : Number(e.asset?.id || e.resultRef?.asset_id) > 0 && !!(S(e.asset?.version?.content) || Rt(e.power, e.kind, e.outputType));
}
function Ee(e, t) {
  return E(e).byId.get(t)?.label || "";
}
function Yn(e, t, n) {
  return e.map((r) => r.id === t ? { ...r, ...n } : r);
}
function Xn(e, t) {
  if (t.kind === "unit") {
    const n = E(e.units).byId.get(
      t.id
    )?.unit;
    return n ? `${Ee(e.units, n.id)} · ${n.title}` : "正文";
  }
  return t.kind === "entity" ? e.outline[t.section].find(
    (n) => n.id === t.id
  )?.name || "素材" : [...le, ...Z].find(
    (n) => n.id === t.id
  )?.label || Ot.directory;
}
function Zn(e, t, n = "") {
  return t.kind === "unit" ? t.tab === "plan" ? E(e.units).byId.get(t.id)?.unit.plan || "" : n : t.kind === "entity" ? e.outline[t.section].find(
    (r) => r.id === t.id
  )?.description || "" : Ct(t.id) ? e.outline[t.id] : "";
}
function Qn(e) {
  return e.has_body ? e.continuity_status === "pending" || e.dependency_stale ? "衔接待整理" : "已写" : e.plan_stale ? "剧情待同步" : "待写";
}
function pe(e) {
  return e ? JSON.stringify([e.kind, e.ids]) : "";
}
function Ft(e) {
  if (!p(e)) return;
  const t = e.unit_ids;
  if (!(typeof e.action != "string" || !["generate_inspirations", "generate_outline", "generate_chapters", "generate_units", "generate_section", "propose_edit", "append", "retry_continuity"].includes(e.action) || e.action === "generate_outline" && !["preferences", "direction", "characters", "background", "chapters"].includes(String(e.phase)) || e.action === "generate_units" && e.phase !== "body" && e.phase !== "continuity" || e.action === "retry_continuity" && e.phase !== "continuity" || typeof e.unit_id != "string" || !Array.isArray(t) || !t.every((n) => typeof n == "string" && !!n.trim()) || new Set(t).size !== t.length || !Number.isSafeInteger(e.completed) || Number(e.completed) < 0 || !Number.isSafeInteger(e.target) || Number(e.target) < 0 || typeof e.issued != "boolean" || e.phase !== void 0 && !["preferences", "direction", "characters", "background", "chapters", "body", "continuity"].includes(String(e.phase)) || e.continuity_unit_id !== void 0 && typeof e.continuity_unit_id != "string" || ["history_completed", "history_total"].some((n) => e[n] !== void 0 && (!Number.isSafeInteger(e[n]) || Number(e[n]) < 0)) || e.draft !== void 0 && (!p(e.draft) || !["body", "unit_id", "request_id", "updated_at"].every((n) => typeof e.draft[n] == "string") || !Number.isSafeInteger(e.draft.run_id)) || e.section_id !== void 0 && e.section_id !== "" && !["inspiration", "overview", "world", "characters", "locations", "props", "chapter_plan"].includes(String(e.section_id)) || [
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
function Tt(e) {
  const t = h(e);
  if (!p(t)) return null;
  const n = t, r = S(n.document);
  return r && Number(n.work_asset_id) > 0 && Number(n.work_version_id) > 0 && Number.isSafeInteger(n.work_revision) && Number(n.work_revision) >= 0 ? {
    ...n,
    document: r,
    checkpoint: Ft(n.checkpoint),
    proposal: Dt(n.proposal)
  } : null;
}
function qe(e) {
  const t = h(e);
  return p(t) ? Tt(t.writing) : null;
}
function er(e, t, n) {
  const r = qe(t), i = e.resultRef?.asset_id || e.asset?.id, s = Math.max(
    e.asset?.id === i && e.asset?.version_id || 0,
    e.resultRef?.asset_id === i && e.resultRef?.version_id || 0
  ), o = e.asset?.version, d = (e.asset?.id === i && o && o.id === s ? S(o.content) : null) || S(t);
  if (!d || !i || !s) return r;
  const a = B(o), f = {
    work_asset_id: i,
    work_version_id: s,
    work_revision: a,
    work_version: o?.version,
    work_updated_at: o?.updated_at || o?.created_at,
    document: d,
    run_id: d.active_run_id,
    request_id: d.active_request_id,
    status: d.status,
    ...n?.work_asset_id === i && n.work_version_id === s && n.work_revision === a && n.run_id === d.active_run_id && n.request_id === d.active_request_id ? { checkpoint: n.checkpoint, proposal: n.proposal } : {}
  };
  return r && r.work_asset_id === i && r.work_version_id === s && r.work_revision >= a ? r : Lt(r, f);
}
function Dt(e) {
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
function Bt(e) {
  return p(e) ? Object.entries(e).every(([t, n]) => /^preferences\.(chapter_words|planned_chapters)$/.test(t) ? typeof n == "number" && Number.isSafeInteger(n) && n >= 0 : /^outline\.(characters|locations|props)\.\d+\.id$/.test(t) && typeof n == "string") : !1;
}
function tr(e) {
  const t = h(e);
  if (!p(t) || !p(t.writing_preview))
    return null;
  const n = t.writing_preview;
  return typeof n.work_asset_id != "number" || typeof n.run_id != "number" || typeof n.request_id != "string" || typeof n.step_request_id != "string" || typeof n.active_field != "string" || n.phase !== void 0 && n.phase !== "" && !["preferences", "direction", "characters", "background", "chapters", "body", "continuity"].includes(String(n.phase)) || !p(n.fields) || !Object.values(n.fields).every((r) => typeof r == "string") || n.values !== void 0 && !Bt(n.values) || (n.active_field === "" ? Object.keys(n.fields).length > 0 : !Object.prototype.hasOwnProperty.call(n.fields, n.active_field)) || ["unit_id", "section_id", "entity_id", "inspiration_id"].some(
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
    unit_id: n.unit_id,
    section_id: n.section_id,
    entity_id: n.entity_id,
    inspiration_id: n.inspiration_id
  };
}
function nr(e, t) {
  if (!e || !t || t.document.status !== "running" || e.work_asset_id !== t.work_asset_id || e.run_id !== t.run_id || e.request_id !== t.request_id)
    return !1;
  const n = t.checkpoint;
  if (!n || !n.issued || (e.phase || "") !== (n.phase || "") || n.request_id && e.step_request_id !== n.request_id) return !1;
  const r = n.phase === "continuity" && n.continuity_unit_id || n.unit_id;
  return !r || e.unit_id === r;
}
function Lt(e, t) {
  return !e || e.work_asset_id !== t.work_asset_id ? t : t.work_version_id < e.work_version_id || t.work_version_id === e.work_version_id && (t.work_revision < e.work_revision || t.work_revision === e.work_revision && e.run_id > t.run_id) || JSON.stringify(e) === JSON.stringify(t) ? e : t;
}
function rr(e, t) {
  if (!e || !((e.outputType || e.power?.outputType) === "story" || S(e.asset?.version?.content)))
    return !1;
  const n = e.asset?.id || e.resultRef?.asset_id, r = t.asset?.id || t.resultRef?.asset_id, i = e.asset?.version_id || e.resultRef?.version_id || 0, s = t.asset?.version_id || t.resultRef?.version_id || 0;
  return !!(n && n === r && s > 0 && (s < i || s === i && S(t.asset?.version?.content) && B(t.asset?.version) < B(e.asset?.version)));
}
function ir(e, t) {
  return e.id === t.id && (e.version_id > t.version_id || e.version_id === t.version_id && !!S(t.version?.content) && B(e.version) > B(t.version)) && !!S(e.version?.content);
}
function B(e) {
  const t = h(e?.content);
  return p(t) ? Number(t.writing_revision || 0) : 0;
}
function or(e, t, n) {
  const r = Ut(t);
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
function Kt(e) {
  return e.inspirations.find(
    (t) => t.id === e.selected_inspiration_id
  );
}
function sr(e, t) {
  const n = e.inspirations.find((r) => r.id === t);
  return !!(n?.title.trim() && n.content.trim() && !e.selected_inspiration_id);
}
function ar(e) {
  return Kt(e) ? Nt(e) ? e.units.length ? "body" : "chapters" : "outline" : "inspiration";
}
function cr(e) {
  return { kind: "section", id: "overview" };
}
function dr(e) {
  const t = S(e.output);
  if (!t) return [e];
  const n = [
    ...le.map((r) => ({
      kind: "section",
      id: r.id,
      title: r.label
    })),
    ...t.units.filter((r) => r.has_body).map((r) => ({
      kind: "unit",
      id: r.id,
      title: `${Ee(t.units, r.id)} ${r.title}`
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
function ur(e, t) {
  const n = (t?.parts || []).flatMap(
    (r) => r.type === "reference" && r.ref_content_selection && r.ref_version_id ? [
      {
        key: `writing-pinned:${r.ref_id}:${r.ref_version_id}:${pe(r.ref_content_selection)}`,
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
function fr(e, t, n) {
  return {
    ...e,
    parts: e.parts.map((r) => {
      if (r.type !== "reference" || r.ref_content_selection) return r;
      const i = t?.parts.find(
        (d) => d.type === "reference" && d.ref_type === r.ref_type && d.ref_id === r.ref_id && d.ref_version_id === r.ref_version_id && d.ref_origin_id === r.ref_origin_id && d.label === r.label
      ), s = n.find(
        (d) => d.refType === r.ref_type && d.refId === r.ref_id && d.versionID === r.ref_version_id && d.label === r.label
      ), o = i?.type === "reference" ? i.ref_content_selection : s?.contentSelection;
      return o ? { ...r, ref_content_selection: o } : r;
    })
  };
}
function lr(e) {
  return `writing:${pe(e)}`;
}
const je = /* @__PURE__ */ new Set([
  "image",
  "video",
  "audio",
  "file"
]);
function mr(e) {
  return e.type === "file" || e.type === "files";
}
function Vt(e) {
  return e.type === "prompt";
}
function pr(e) {
  return ![
    "hidden",
    "description",
    "prompt",
    "file",
    "files"
  ].includes(e.type);
}
function gr(e) {
  const t = Array.from(
    new Set(
      (e.accepted_kinds || e.asset_kinds || []).map(ge).filter((n) => !!n)
    )
  );
  return t.length > 0 ? t : [];
}
function Et(e) {
  return (e.accepted_kinds || []).map(ge).filter(
    (t) => !!t && je.has(t)
  );
}
function q(e) {
  const t = ge(e);
  return t && je.has(t) ? t : void 0;
}
function qt(e) {
  return e.type !== "files" ? 1 : Math.max(0, Number(e.max_files || 0));
}
function ge(e) {
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
function jt(e, t) {
  return !!(e && Mt(e.source_rule) && t > 0 && !e.sources.some(
    (n) => n.target_id === t || n.id === t
  ));
}
function _r(e, t) {
  return jt(e, t.selectedTargetId || 0) ? t.paramValues || {} : zt(e.params || [], t);
}
function Wt(e) {
  const t = e.default_value ?? "";
  if (e.type === "switch")
    return Gt(t);
  if (e.type === "multi_option")
    return _e(e, Pe(t));
  if (e.type === "files")
    return ye(Pe(t));
  if (e.type === "option" || e.type === "select") {
    const n = R(e.options || [], t) || e.options?.[0];
    return T(
      e,
      $(n) || t
    );
  }
  return T(e, t);
}
function We(e) {
  const t = {};
  for (const n of e)
    !n.key || n.type === "description" || (t[n.key] = Wt(n));
  return t;
}
function yr(e, t, n) {
  const r = We(e), i = new Map(
    n.map((s) => [s.key, s])
  );
  for (const s of e) {
    const o = i.get(s.key);
    s.key && o && Object.prototype.hasOwnProperty.call(t, s.key) && Jt(s, o, t[s.key]) && (r[s.key] = _e(s, t[s.key]));
  }
  return r;
}
function zt(e, t) {
  const n = We(e), r = t.paramValues || {};
  for (const s of e)
    s.key && Object.prototype.hasOwnProperty.call(r, s.key) && (n[s.key] = _e(
      s,
      r[s.key]
    ));
  const i = e.find(Vt);
  return i?.key && t.prompt.trim() && (n[i.key] = t.prompt), n;
}
function T(e, t) {
  if (e.value_type !== "number" || t === "")
    return t;
  const n = Number(t);
  return Number.isFinite(n) ? n : t;
}
function _e(e, t) {
  if (e.type === "option" || e.type === "select") {
    const n = R(e.options || [], t) || e.options?.[0];
    return T(
      e,
      $(n) || t
    );
  }
  return e.type === "multi_option" ? ye(t).map((n) => {
    const r = R(e.options || [], n);
    return T(
      e,
      $(r) || n
    );
  }) : T(e, t);
}
function Jt(e, t, n) {
  if (e.type !== t.type || e.value_type !== t.value_type)
    return !1;
  if (e.type === "option" || e.type === "select") {
    const r = e.options || [];
    return r.length === 0 || !!R(r, n);
  }
  if (e.type === "multi_option") {
    const r = e.options || [];
    return r.length === 0 || ye(n).every(
      (i) => !!R(r, i)
    );
  }
  return e.value_type === "number" ? n === "" || Number.isFinite(Number(n)) : !0;
}
function $(e) {
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
function hr(e, t, n = [e]) {
  return t.some(
    (r) => R(n, r) === e
  );
}
function Pe(e) {
  if (typeof e != "string")
    return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
function ye(e) {
  return Array.isArray(e) ? e.map((t) => String(t)).filter(Boolean) : typeof e == "string" ? e ? [e] : [] : e ? [String(e)] : [];
}
function Gt(e) {
  if (typeof e == "boolean")
    return e;
  const t = String(e ?? "").trim().toLowerCase();
  return t === "1" || t === "true" || t === "yes" || t === "on";
}
await window.DeverFront?.ensureCompat?.(["@/components/agent/stream-request-params"]);
const re = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!re || Object.keys(re).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const j = re, Ht = j.filterActivePowerParams || ((e) => e), br = j.isPowerParamConditionController || (() => !1), wr = j.shouldDisplayPowerParam || (() => !0), vr = j.PowerParamOptionDialog, kr = j.normalizeParamPreviewType, Yt = "referencemode", Xt = "references";
function Sr({
  node: e,
  content: t,
  items: n,
  connections: r,
  params: i,
  values: s,
  requestedMode: o,
  additionalSources: d = []
}) {
  const a = nn(
    Ht(i, s)
  );
  return rn({
    targetKind: v(e) || e.power?.kind || e.kind,
    content: t,
    items: n,
    connections: r,
    mediaOptions: a,
    requestedMode: o,
    additionalSources: d
  });
}
function Ir(e, t) {
  return e.flatMap(({ edge: n, source: r }) => {
    const i = Xe(t, r), s = Number(
      i?.refId || r.asset?.id || r.resultRef?.asset_id || 0
    );
    return s <= 0 ? [] : [
      {
        refType: "asset",
        refId: s,
        versionId: Number(
          i?.versionID || r.asset?.version?.id || r.asset?.version_id || r.resultRef?.version_id || 0
        ),
        label: Ye(r, i),
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
  if (X(n)?.frames.some((s) => !!s.image))
    return "image";
  let i = !1;
  for (const s of t) {
    const o = q(s);
    if (o === "file") {
      i = !0;
      continue;
    }
    if (o)
      return o;
  }
  return i && Qt(n) ? "file" : void 0;
}
function Zt(e) {
  return !!v(e);
}
function Qt(e) {
  return e.some(
    (t) => ie(t, /* @__PURE__ */ new Set(), 0)
  );
}
function ie(e, t, n) {
  if (e == null || n > 10)
    return !1;
  if (typeof e == "string")
    return /^(?:https?:\/\/|\/|data:)/i.test(e.trim());
  if (Array.isArray(e))
    return e.some((i) => ie(i, t, n + 1));
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
  ].some((i) => ie(i, t, n + 1));
}
function Mr(e, t, n) {
  return n.some((i) => {
    const s = v(i);
    return s === "video" || s === "audio";
  }) && tn(
    e,
    t,
    Xt
  ) || t;
}
function en(e) {
  return W(e.key) === Yt;
}
function tn(e, t, n) {
  const r = e.find(en);
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
  return $(s) === $(i) ? t : {
    ...t,
    [r.key]: $(i)
  };
}
function nn(e) {
  const t = e.flatMap((n) => {
    if (n.type !== "file" && n.type !== "files")
      return [];
    const r = String(n.key || "").trim(), i = Et(n);
    return !r || i.length === 0 ? [] : [
      {
        key: r,
        label: String(n.name || r),
        maxFiles: qt(n),
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
function Rr(e) {
  return e.find((t) => Q(t.key))?.key || "firstFrame";
}
function rn({
  targetKind: e,
  content: t,
  items: n,
  connections: r,
  mediaOptions: i,
  requestedMode: s,
  additionalSources: o = []
}) {
  const d = on(
    t,
    n,
    r,
    o
  ), a = d.reduce(
    (y, lt) => y + lt.amount,
    0
  ), f = d.some((y) => Q(y.usage)) && d.some((y) => ze(y.usage)), m = q(e) === "video" && a > 1, c = O(
    i,
    "image",
    "per_image"
  ), u = O(
    i,
    "image",
    "shared_reference"
  ), l = c.length > 0, g = u.some(
    ee
  ), _ = (!g || d.every((y) => y.amount === 1)) && dn(u, a), k = [
    {
      value: "per_image",
      label: "逐图生成",
      enabled: l,
      reason: l ? void 0 : "当前能力没有可逐张接收图片的参数"
    },
    {
      value: "shared_reference",
      label: g ? "首尾帧生成" : "共同参考",
      enabled: _,
      reason: _ ? void 0 : g ? "当前能力不能将这些图片作为同一次首尾帧输入" : "当前能力不能在一次请求中接收这些参考图片"
    }
  ];
  if (!m)
    return {
      active: !1,
      imageCount: a,
      structured: d.some((y) => y.structured),
      explicitFramePair: f,
      options: k,
      error: ""
    };
  const b = d.some((y) => y.structured), x = f && _ ? "shared_reference" : b && l ? "per_image" : _ ? "shared_reference" : "per_image", ft = k.find(
    (y) => y.value === s && y.enabled
  )?.value || x, Se = k.some((y) => y.enabled);
  return {
    active: m,
    imageCount: a,
    structured: b,
    explicitFramePair: f,
    mode: Se ? ft : void 0,
    defaultMode: x,
    options: k,
    error: Se ? "" : "当前能力无法接收这组图片素材"
  };
}
function on(e, t, n, r) {
  const i = new Map(
    n.map(
      (a) => [
        w(
          a.edge.id,
          M(a)
        ),
        a
      ]
    )
  ), s = /* @__PURE__ */ new Set(), o = [];
  for (const a of e?.parts || []) {
    if (a.type !== "reference" || !he(a.ref_type))
      continue;
    const f = a.ref_type === "asset" && a.ref_origin_id ? i.get(
      w(a.ref_origin_id, a.ref_id)
    ) : void 0, m = f ? Xe(t, f.source) : be(t, a);
    if ((f ? v(f.source) : q(m?.kind)) !== "image")
      continue;
    f && s.add(
      w(
        f.edge.id,
        M(f)
      )
    );
    const u = f ? I(f.source) : Y(m, "image", a.ref_media_count);
    o.push({
      amount: L(a, u),
      usage: String(a.usage || f?.edge.mediaUsage || ""),
      structured: ne(f?.source, m)
    });
  }
  for (const a of n) {
    const f = w(
      a.edge.id,
      M(a)
    );
    s.has(f) || v(a.source) !== "image" || o.push({
      amount: I(a.source),
      usage: String(a.edge.mediaUsage || ""),
      structured: ne(a.source)
    });
  }
  const d = new Set(
    n.map((a) => a.source.id)
  );
  for (const a of r)
    d.has(a.id) || v(a) !== "image" || o.push({
      amount: I(a),
      usage: "",
      structured: ne(a)
    });
  return o;
}
function ne(e, t) {
  return !!(e?.storyboardItem?.itemType === "shot_image" || X([
    e?.asset?.version?.content,
    e?.resultOutput,
    t?.output,
    t?.asset
  ]));
}
function sn(e, t) {
  return e.find((n) => n.key === t);
}
function Q(e) {
  const t = W(e);
  return t === "firstframe" || t === "startframe";
}
function ze(e) {
  const t = W(e);
  return t === "lastframe" || t === "endframe";
}
function an(e) {
  const t = W(e);
  return t === "firstframe" || t === "startframe" || t === "lastframe" || t === "endframe";
}
function cn(e) {
  if (!e.acceptedKinds.includes("image"))
    return !1;
  const t = W(e.key);
  return ["images", "reference", "referenceimage", "referenceimages"].includes(
    t
  );
}
function D(e) {
  return e.map((t, n) => ({ option: t, index: n })).sort(
    (t, n) => Ce(t.option) - Ce(n.option) || t.index - n.index
  ).map(({ option: t }) => t);
}
function Ce(e) {
  return cn(e) ? 0 : Q(e.key) ? 1 : ze(e.key) ? 2 : 3;
}
function ee(e) {
  return an(e.key);
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
    (o) => Q(o.key)
  );
  return s.length > 0 ? D(s) : D(i);
}
function xr(e, t) {
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
function dn(e, t) {
  let n = t;
  for (const r of e) {
    const i = C(r);
    if (i <= 0 || (n -= i, n <= 0))
      return !0;
  }
  return !1;
}
function W(e) {
  return String(e || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}
function Pr(e, t, n, r, i = {}, s = !1, o) {
  const d = new Map(
    (t?.parts || []).flatMap(
      (c) => c.type === "reference" && c.ref_type === "asset" && c.ref_origin === "edge" && c.ref_origin_id ? [
        [
          w(c.ref_origin_id, c.ref_id),
          c
        ]
      ] : []
    )
  ), a = e.flatMap(
    (c) => {
      const u = v(c.source);
      if (!u)
        return [];
      const l = I(c.source), g = d.get(
        w(
          c.edge.id,
          M(c)
        )
      );
      return [
        {
          referenceKey: pn(c),
          label: mn(c),
          kind: u,
          amount: L(g, l),
          mediaCount: l,
          mediaSelected: ae(g),
          usage: fn(c, i),
          required: !0
        }
      ];
    }
  );
  for (const [c, u] of (t?.parts || []).entries()) {
    if (u.type !== "reference" || !he(u.ref_type) || u.ref_origin === "edge")
      continue;
    const l = be(n, u), g = q(l?.kind);
    g && a.push({
      referenceKey: `${u.ref_type}:${u.ref_id}:${c}`,
      label: String(u.label || l?.title || "引用素材"),
      kind: g,
      amount: L(
        u,
        Y(l, g, u.ref_media_count)
      ),
      mediaCount: Y(
        l,
        g,
        u.ref_media_count
      ),
      mediaSelected: ae(u),
      usage: String(u.usage || ""),
      required: s
    });
  }
  const f = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Set();
  for (const c of a) {
    const u = `${c.referenceKey}:${c.usage}`;
    if (m.has(u))
      continue;
    m.add(u);
    const l = O(
      r,
      c.kind,
      o
    );
    if (l.length === 0) {
      if (c.required)
        return `当前能力未配置可接收${He(c.kind)}素材的参数`;
      continue;
    }
    const g = sn(l, c.usage);
    if (c.usage && !g)
      return `「${c.label}」的素材用途与当前能力参数不兼容`;
    const _ = g || (l.length === 1 ? l[0] : void 0);
    if (!_)
      return `请为「${c.label}」选择素材用途`;
    const k = c.kind === "image" && o === "per_image", b = k ? 1 : c.amount, x = C(_) > 0 ? Math.max(
      C(_) - (f.get(_.key) || 0),
      0
    ) : 0;
    if (!k && !c.mediaSelected && c.mediaCount > 1 && C(_) > 0 && c.mediaCount > x)
      return `「${c.label}」包含 ${c.mediaCount} 项素材，请从引用中选择具体素材`;
    if (!se(_, f, b))
      return `${_.label}参数最多接收 ${C(_)} 个素材`;
    k || H(f, _.key, b);
  }
  return "";
}
function Cr(e, t, n, r, i = [], s) {
  const o = n.filter(Zt), d = o.flatMap((u) => {
    const l = v(u);
    return l ? [l] : [];
  }), a = D(
    t.filter(
      (u) => d.every(
        (l) => O([u], l, s).includes(
          u
        )
      )
    )
  );
  if (d.length === 0 || a.length === 0) {
    const u = d[0];
    return {
      usage: void 0,
      error: d.length > 1 ? "当前能力未配置可同时接收该分组媒体素材的参数" : `当前能力未配置可接收${He(u || "file")}素材的参数`
    };
  }
  const f = un(
    e,
    t,
    r,
    i,
    s
  ), m = s === "per_image" && d.every((u) => u === "image") ? 1 : o.reduce(
    (u, l) => u + I(l),
    0
  ), c = Je(
    a,
    f,
    m
  );
  return c ? {
    usage: c.key,
    error: ""
  } : {
    usage: void 0,
    error: `${a[0].label}参数已达到素材数量上限`
  };
}
function $r(e, t, n, r, i, s) {
  if (!t || r.length === 0)
    return { content: t, assignments: {} };
  const o = new Map(
    oe(
      e,
      n,
      i,
      s
    ).map((u) => [u.key, u])
  ), a = [...oe(
    t,
    n,
    i,
    s
  )].sort((u, l) => {
    const g = $e(
      u,
      o.get(u.key)
    ), _ = $e(
      l,
      o.get(l.key)
    );
    return g - _ || u.partIndex - l.partIndex;
  }), f = t.parts.map((u) => ({ ...u })), m = {}, c = /* @__PURE__ */ new Map();
  for (const u of a) {
    const l = o.get(u.key), g = O(
      r,
      u.kind,
      s
    ), _ = u.usage && u.usage !== l?.usage ? u.usage : "", b = Je(
      g,
      c,
      u.kind === "image" && s === "per_image" ? 1 : u.amount,
      _,
      l?.usage || u.usage
    )?.key || "";
    b && (u.kind === "image" && s === "per_image" || H(c, b, u.amount));
    const x = f[u.partIndex];
    x?.type === "reference" && (x.usage = b || void 0), u.connection && b !== String(u.connection.edge.mediaUsage || "") && (m[u.connection.edge.id] = b || void 0);
  }
  return { content: { ...t, parts: f }, assignments: m };
}
function un(e, t, n, r = [], i) {
  const s = /* @__PURE__ */ new Map(), o = oe(
    n,
    r,
    e,
    i
  ), d = /* @__PURE__ */ new Set();
  for (const a of o) {
    const f = t.find((m) => m.key === a.usage);
    f && !(a.kind === "image" && i === "per_image") && H(s, f.key, a.amount), a.connection && d.add(
      w(
        a.connection.edge.id,
        M(a.connection)
      )
    );
  }
  for (const a of e) {
    const f = w(
      a.edge.id,
      M(a)
    );
    if (d.has(f))
      continue;
    const m = String(a.edge.mediaUsage || ""), c = t.find((u) => u.key === m);
    c && !(v(a.source) === "image" && i === "per_image") && H(
      s,
      c.key,
      I(a.source)
    );
  }
  return s;
}
function fn(e, t) {
  return String(
    Object.prototype.hasOwnProperty.call(t, e.edge.id) ? t[e.edge.id] || "" : e.edge.mediaUsage || ""
  );
}
function oe(e, t, n, r) {
  if (!e)
    return [];
  const i = new Map(
    n.map((o) => [
      w(
        o.edge.id,
        M(o)
      ),
      o
    ])
  ), s = /* @__PURE__ */ new Map();
  return e.parts.flatMap((o, d) => {
    if (o.type !== "reference" || !he(o.ref_type))
      return [];
    const a = o.ref_type === "asset" && o.ref_origin_id ? i.get(
      w(o.ref_origin_id, o.ref_id)
    ) : void 0, f = be(t, o), m = a ? v(a.source) : q(f?.kind);
    if (!m)
      return [];
    const c = a ? `edge:${w(
      a.edge.id,
      M(a)
    )}` : `${o.ref_type}:${o.ref_id}:${o.ref_version_id || 0}`, u = s.get(c) || 0;
    return s.set(c, u + 1), [
      {
        key: a ? c : `${c}:${u}`,
        partIndex: d,
        kind: m,
        amount: m === "image" && r === "per_image" ? 1 : a ? L(
          o,
          I(a.source)
        ) : L(
          o,
          Y(
            f,
            m,
            o.ref_media_count
          )
        ),
        usage: String(o.usage || ""),
        connection: a
      }
    ];
  });
}
function $e(e, t) {
  return e.usage && e.usage !== t?.usage ? 0 : t ? 1 : 2;
}
function Je(e, t, n, ...r) {
  for (const i of r) {
    const s = e.find((o) => o.key === i);
    if (s && se(s, t, n))
      return s;
  }
  return e.find(
    (i) => se(i, t, n)
  );
}
function C(e) {
  return ee(e) ? 1 : e.maxFiles;
}
function se(e, t, n = 1) {
  const r = C(e);
  return r <= 0 || (t.get(e.key) || 0) + n <= r;
}
function H(e, t, n = 1) {
  e.set(t, (e.get(t) || 0) + n);
}
function Ge(e, t) {
  return ln(e, t).map((n) => n.url);
}
function ln(e, t) {
  if (t === "image") {
    const n = mt(e);
    if (n.length > 0)
      return n.map((r) => ({ url: r, thumbnail: r }));
  }
  return pt(e, t);
}
function I(e) {
  const t = v(e);
  return !e || !t || t === "file" ? 1 : Math.max(
    1,
    Ge(
      [e.asset?.version?.content, e.resultOutput],
      t
    ).length
  );
}
function Y(e, t, n = 0) {
  return !e || t === "file" ? Math.max(1, n) : Math.max(
    1,
    n,
    Ge(e.output, t).length
  );
}
function ae(e) {
  return !!((e?.ref_media_items?.length || 0) > 0 || String(e?.ref_media_url || "").trim() || Number(e?.ref_media_index || 0) > 0);
}
function L(e, t) {
  return (e?.ref_media_items?.length || 0) > 0 ? e?.ref_media_items?.length || 0 : ae(e) ? 1 : Math.max(1, t);
}
function w(e, t) {
  return `${String(e || "")}:${Number(t || 0)}`;
}
function he(e) {
  return e === "asset" || e === "material";
}
function be(e, t) {
  return e.find(
    (n) => (n.refType || "asset") === t.ref_type && Number(n.refId || 0) === Number(t.ref_id || 0) && (!t.ref_version_id || Number(n.versionID || 0) === Number(t.ref_version_id))
  );
}
function M(e) {
  return Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
}
function He(e) {
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
function mn(e) {
  return Ye(e.source);
}
function Ye(e, t) {
  for (const n of [e.asset?.name, t?.title, e.title]) {
    const r = String(n || "").trim();
    if (r)
      return r;
  }
  return "媒体素材";
}
function pn(e) {
  const t = Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
  return t > 0 ? `asset:${t}` : `node:${e.source.id}`;
}
function Xe(e, t) {
  const n = Number(t.asset?.id || t.resultRef?.asset_id || 0), r = Number(
    t.asset?.version?.id || t.asset?.version_id || t.resultRef?.version_id || 0
  );
  return e.find(
    (i) => (i.refType || "asset") === "asset" && Number(i.refId || 0) === n && (!r || Number(i.versionID || 0) === r)
  ) || e.find((i) => i.id === t.id);
}
function Nr(e, t, n) {
  const r = _n(e, t), i = n || e.kind, s = X(r);
  if (s)
    return {
      mode: "storyboard_grid",
      value: s,
      format: "json",
      summary: Qe(s),
      downloadUrl: ""
    };
  const o = ht(r);
  if (o)
    return {
      mode: "storyboard",
      value: o,
      format: "json",
      summary: Fe(o),
      downloadUrl: ""
    };
  const d = tt(r);
  if (d) {
    if (i === "text") {
      const l = Ie(d);
      return z(l?.markdown || fe(d));
    }
    const u = Sn(r) ? null : Ie(d);
    return u && bt(u.plainText) ? z(u.markdown) : Oe(d);
  }
  const a = de(r);
  if (a)
    return {
      mode: "file",
      value: a,
      format: "json",
      summary: a.description || a.name || "文件内容",
      downloadUrl: a.url
    };
  const f = vn(r);
  if (f)
    return z(f);
  const m = yn(r);
  if (m)
    return Oe(m);
  const c = ue(r) || e.description || "";
  return z(c);
}
function Ne(e, t, n = {}) {
  const r = n.includeNodeResult === !1 ? t?.content : gt(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    nt(e, "result", "output")
  ), i = h(r);
  if (X(i))
    return;
  const s = _t(i);
  for (const d of [i, h(s)])
    if (yt(d))
      return gn(d);
  const o = wn(e.kind, i);
  if (o)
    return o;
}
function gn(e) {
  const n = Ae(e).map((r) => {
    if (!p(r) || r.json === void 0)
      return r;
    const i = { ...r };
    return delete i.json, i;
  });
  return n.length === 1 ? n[0] : n;
}
function _n(e, t) {
  return wt(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    nt(e, "result", "output"),
    e.description
  );
}
function Ze(e) {
  if (e.mode === "storyboard" || e.mode === "storyboard_grid")
    return e.value;
  if (e.mode === "file")
    return bn(e.value);
  const t = String(e.value || "");
  return e.format === "markdown" ? { format: "markdown", text: t } : F(h(t)) || kn(t);
}
function Or(e) {
  return Te(Ze(e));
}
function Ur(e, t) {
  const n = { ...e, value: t };
  if (n.mode === "storyboard")
    n.summary = Fe(t);
  else if (n.mode === "storyboard_grid")
    n.summary = Qe(t);
  else if (n.mode === "file") {
    const r = t;
    n.summary = r.description || r.name || "文件内容", n.downloadUrl = r.url;
  } else
    n.summary = we(fe(Ze(n)));
  return n;
}
function Qe(e) {
  return N(
    e.summary,
    `${e.title || "宫格图片"} · ${e.frames.length} 张`
  );
}
function Oe(e) {
  const t = fe(e);
  return {
    mode: "rich",
    value: Te(e),
    format: "json",
    summary: we(t),
    downloadUrl: et(e)
  };
}
function z(e) {
  return {
    mode: "rich",
    value: e,
    format: "markdown",
    summary: we(e),
    downloadUrl: ""
  };
}
function yn(e) {
  if (typeof e == "string" && h(e) === e)
    return null;
  const t = Ae(e), n = [];
  return ce(
    t,
    n,
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    0
  ), n.length === 0 ? null : F({ type: "doc", content: n });
}
function ce(e, t, n, r, i, s) {
  if (e == null || s > 12)
    return;
  const o = h(e);
  if (typeof o == "string") {
    Ue(t, o, r);
    return;
  }
  if (Array.isArray(o)) {
    o.forEach(
      (a) => ce(
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
  const d = tt(o);
  if (d) {
    for (const a of d.content || [])
      t.push(a);
    return;
  }
  Ue(
    t,
    N(o.title, o.text),
    r
  ), hn(o, t, i);
  for (const a of [
    "rich",
    "content",
    "output",
    "result",
    "data",
    "body",
    "value"
  ])
    o[a] !== void 0 && ce(
      o[a],
      t,
      n,
      r,
      i,
      s + 1
    );
}
function hn(e, t, n) {
  const r = [
    { kind: "image", values: [e.image, e.image_url, e.imageUrl, e.images] },
    { kind: "video", values: [e.video, e.video_url, e.videoUrl, e.videos] },
    { kind: "audio", values: [e.audio, e.audio_url, e.audioUrl, e.audios] }
  ];
  for (const i of r)
    for (const s of i.values)
      for (const o of K(s)) {
        const d = `${i.kind}:${o}`;
        n.has(d) || (n.add(d), t.push({
          type: In(i.kind),
          attrs: { src: o }
        }));
      }
}
function Ue(e, t, n) {
  const r = String(t || "").trim();
  !r || it(r) || ve(r) || n.has(r) || (n.add(r), e.push({
    type: "paragraph",
    content: [{ type: "text", text: r }]
  }));
}
function K(e) {
  return Array.isArray(e) ? e.flatMap(K) : typeof e == "string" ? it(e.trim()) ? [e.trim()] : [] : p(e) ? [
    e.url,
    e.src,
    e.path,
    e.download_url,
    e.downloadUrl
  ].flatMap(K) : [];
}
function de(e) {
  const t = h(e);
  if (Array.isArray(t)) {
    for (const r of t) {
      const i = de(r);
      if (i)
        return i;
    }
    return null;
  }
  if (!p(t))
    return null;
  const n = Mn(
    t.file,
    t.file_url,
    t.fileUrl,
    t.files
  );
  if (n)
    return {
      url: n,
      name: N(t.name, t.filename, t.title) || rt(n),
      description: N(
        t.description,
        t.text,
        t.summary
      )
    };
  for (const r of ["content", "output", "result", "data", "body", "value"])
    if (t[r] !== void 0) {
      const i = de(t[r]);
      if (i)
        return i;
    }
  return null;
}
function bn(e) {
  return {
    type: "file",
    file_url: e.url,
    name: e.name || rt(e.url),
    description: e.description.trim()
  };
}
function wn(e, t) {
  if (e !== "image" && e !== "video" && e !== "audio")
    return;
  const n = K(t);
  if (n.length !== 0)
    return {
      [`${e}s`]: n
    };
}
function ue(e) {
  const t = h(e);
  if (typeof t == "string")
    return ve(t) ? "" : t;
  if (Array.isArray(t))
    return t.map(ue).filter(Boolean).join(`

`);
  if (!p(t))
    return "";
  const n = N(
    t.text,
    t.summary,
    t.description
  );
  if (n)
    return n;
  for (const r of ["content", "output", "result", "data", "body", "value"])
    if (t[r] !== void 0) {
      const i = ue(t[r]);
      if (i)
        return i;
    }
  return "";
}
function vn(e) {
  const t = h(e);
  return typeof t == "string" ? ve(t) ? "" : t : p(t) && String(t.format || "").trim().toLowerCase() === "markdown" ? N(t.text, t.markdown) : "";
}
function kn(e) {
  const t = e.split(/\n{2,}/).map((n) => n.trim());
  return {
    type: "doc",
    content: (t.length ? t : [""]).map((n) => ({
      type: "paragraph",
      content: n ? [{ type: "text", text: n }] : []
    }))
  };
}
function et(e) {
  if (!e || typeof e != "object")
    return "";
  if (["editorMediaImage", "editorMediaVideo", "editorMediaAudio"].includes(
    String(e.type || "")
  ))
    return String(e.attrs?.src || "").trim();
  for (const t of Array.isArray(e.content) ? e.content : []) {
    const n = et(t);
    if (n)
      return n;
  }
  return "";
}
function tt(e) {
  const t = h(e);
  if (!p(t))
    return null;
  if (String(t.type || "") === "doc")
    return F(t);
  const n = Object.keys(t).filter((r) => r !== "format");
  return n.length === 1 && n[0] === "rich" ? F(t.rich) : String(t.format || "").trim().toLowerCase() === "rich_json" ? F(t.rich ?? t.content) : null;
}
function Sn(e) {
  const t = h(e);
  return p(t) && String(t.format || "").trim().toLowerCase() === "rich_json";
}
function In(e) {
  return {
    image: "editorMediaImage",
    video: "editorMediaVideo",
    audio: "editorMediaAudio"
  }[e];
}
function Mn(...e) {
  for (const t of e) {
    const n = K(t)[0];
    if (n)
      return n;
  }
  return "";
}
function nt(e, ...t) {
  let n = e;
  for (const r of t) {
    if (!p(n))
      return;
    n = n[r];
  }
  return n;
}
function rt(e) {
  const n = (e.split(/[?#]/)[0] || "").split("/").pop() || "";
  try {
    return decodeURIComponent(n) || "文件";
  } catch {
    return n || "文件";
  }
}
function we(e) {
  const t = String(e || "").replace(/\s+/g, " ").trim();
  return t.length > 120 ? `${t.slice(0, 120)}…` : t || "暂无内容";
}
function it(e) {
  return /^(https?:\/\/|\/|data:)/i.test(e);
}
function ve(e) {
  const t = e.trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function Ar(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const i of n) {
    const s = i.storyboardItem;
    if (s?.sourceNodeId === t && s.itemType === "shot_image" && s.shotId) {
      const o = r.get(s.shotId) || {};
      if (vt(s.shotImageMode) === "references") {
        o.referenceNode = i, r.set(s.shotId, o);
        continue;
      }
      const d = kt(
        s.frameMediaItems
      );
      if (d.length)
        for (const a of d)
          o[a.frameRole] = {
            node: i,
            mediaIndex: a.mediaIndex
          };
      else
        o[St(s.frameRole)] = {
          node: i,
          mediaIndex: 1
        };
      r.set(s.shotId, o);
    }
  }
  return e.shots.map((i) => {
    const s = r.get(i.id), o = It(i);
    return o.nodeMode === "references" ? {
      shot: i,
      start: A(),
      references: Rn(s?.referenceNode)
    } : o.nodeMode === "last_frame" ? {
      shot: i,
      start: A(s?.end)
    } : o.nodeMode === "none" ? {
      shot: i,
      start: A()
    } : {
      shot: i,
      start: A(s?.start),
      ...s?.end ? { end: A(s.end) } : {}
    };
  });
}
function Rn(e) {
  const t = e ? ot(e) : void 0;
  return (t ? De(t, "image") : []).slice(0, 4).map((r) => ({ node: e, imageURL: r }));
}
function A(e) {
  const t = e ? ot(e.node) : void 0;
  return {
    node: e?.node,
    imageURL: t ? xn(t, e?.mediaIndex || 1) : ""
  };
}
function xn(e, t) {
  const n = e && typeof e == "object" && !Array.isArray(e) ? e : void 0, r = n?.meta && typeof n.meta == "object" && !Array.isArray(n.meta) ? n.meta : void 0, s = (Array.isArray(r?.items) ? r.items : []).find((d) => !d || typeof d != "object" || Array.isArray(d) ? !1 : Number(d.order) === t);
  return String(s?.image || "").trim() || De(e, "image")[t - 1] || "";
}
function ot(e) {
  const t = e.resultRef?.asset_id ?? e.asset?.id, n = e.resultRef?.version_id ?? e.asset?.version?.id ?? e.asset?.version_id, i = [e.asset?.version, ...e.asset?.versions || []].find(
    (s) => s && s.id === n && s.asset_id === t
  );
  return i ? Ne(e, i, {
    includeNodeResult: !1
  }) : Ne({
    ...e,
    asset: void 0,
    result: void 0,
    resultOutput: e.resultOutput
  });
}
function ke(e, t) {
  const n = String(e || ""), r = $n(t);
  if (!n || r.length === 0)
    return {
      version: 1,
      parts: n ? [{ type: "text", text: n }] : []
    };
  const i = [];
  let s = 0;
  for (; s < n.length; ) {
    const o = Nn(n, s, r);
    if (!o) {
      V(i, n.slice(s));
      break;
    }
    o.index > s && V(i, n.slice(s, o.index)), i.push({
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
function Fr(e, t) {
  return ke(
    e,
    On(t)
  );
}
function Tr(e, t) {
  const n = at(
    t,
    G
  ), r = ke(e, n), i = new Set(
    st(r).map(
      G
    )
  ), s = n.filter(
    (d) => !i.has(G(d))
  );
  if (!s.length)
    return r;
  const o = [];
  for (let d = 0; d < s.length; d += 1)
    ut(
      o,
      s[d],
      d === s.length - 1 ? r.parts[0] : void 0
    );
  return { version: 1, parts: [...o, ...r.parts] };
}
function Pn(e) {
  return !!e?.parts.some((t) => t.type === "reference");
}
function Dr(e, t, n) {
  if (!t || !e.includes("@") && !e.includes("#"))
    return t;
  const r = ke(e, [
    ...st(t),
    ...n
  ]);
  return Pn(r) ? r : t;
}
function st(e) {
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
function Cn(e) {
  return e ? e.parts.map(
    (t) => t.type === "text" ? t.text : `${t.ref_trigger === "#" ? "#" : "@"}${P(t.label)}`
  ).join("") : "";
}
function Br(e, t, n) {
  const r = at(
    n.filter(
      (c) => c.origin === "edge" && !!c.originID
    ),
    J
  ), i = new Map(
    r.map((c) => [
      J(c),
      c
    ])
  ), s = t?.version === 1 ? t.parts : e ? [{ type: "text", text: e }] : [], o = [], d = /* @__PURE__ */ new Set();
  let a = !1;
  for (const c of s) {
    if (c.type === "reference" && c.ref_origin === "edge" && c.ref_origin_id) {
      const u = J({
        refId: c.ref_id,
        originID: c.ref_origin_id
      }), l = i.get(u);
      if (!l) {
        a = !0;
        continue;
      }
      dt(o, {
        ...l,
        purpose: c.purpose,
        mediaURL: c.ref_media_url,
        mediaIndex: c.ref_media_index,
        mediaCount: c.ref_media_count,
        mediaItems: c.ref_media_items,
        contentSelection: c.ref_content_selection,
        ...c.ref_content_selection ? { versionId: c.ref_version_id, label: c.label } : {}
      }), d.add(u), a = !1;
      continue;
    }
    if (c.type === "text") {
      let u = c.text;
      if (a && /^\s/.test(u)) {
        const l = o[o.length - 1];
        (!l || l.type === "text" && /\s$/.test(l.text)) && (u = u.slice(1));
      }
      V(o, u), a = !1;
      continue;
    }
    o.push({ ...c }), a = !1;
  }
  const f = r.filter(
    (c) => !d.has(J(c))
  );
  if (f.length > 0) {
    const c = o[o.length - 1];
    c && (c.type !== "text" || !/\s$/.test(c.text)) && V(o, " ");
    for (const u of f)
      ut(o, u);
  }
  const m = { version: 1, parts: o };
  return {
    value: Cn(m),
    content: m
  };
}
function P(e) {
  return e.trim().replace(/^[@#]+/, "").trim();
}
function $n(e) {
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
function Nn(e, t, n) {
  let r;
  for (const i of n) {
    const s = e.indexOf(i.mention, t);
    s < 0 || (!r || s < r.index || s === r.index && i.mention.length > r.target.mention.length) && (r = { index: s, target: i });
  }
  return r;
}
function V(e, t) {
  if (!t)
    return;
  const n = e[e.length - 1];
  if (n?.type === "text") {
    n.text += t;
    return;
  }
  e.push({ type: "text", text: t });
}
function at(e, t = ct) {
  const n = [], r = /* @__PURE__ */ new Set();
  for (const i of e) {
    if (i.refId <= 0 || !P(i.label))
      continue;
    const s = t(i);
    r.has(s) || (r.add(s), n.push(i));
  }
  return n;
}
function On(e) {
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
  return `${ct(e)}:${e.usage || ""}:${e.purpose || ""}`;
}
function ct(e) {
  const t = e.originID ? `${e.refType}:${e.refId}:${e.origin || ""}:${e.originID}` : `${e.refType}:${e.refId}`;
  return e.contentSelection ? `${t}:${e.versionId || 0}:${pe(e.contentSelection)}` : t;
}
function J(e) {
  return `${String(e.originID || "")}:${Number(e.refId || 0)}`;
}
function dt(e, t) {
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
function ut(e, t, n) {
  dt(e, t), Un(e, n);
}
function Un(e, t) {
  t?.type === "text" && /^\s/.test(t.text) || V(e, " ");
}
function Lr(e, t, n, r, i) {
  if (!t || !n || t === n)
    return e;
  const s = e.findIndex((f) => i(f) === t);
  if (s < 0)
    return e;
  const o = [...e], [d] = o.splice(s, 1), a = o.findIndex((f) => i(f) === n);
  return a < 0 ? e : (o.splice(a + (r === "after" ? 1 : 0), 0, d), o);
}
function Kr(e, t, n) {
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
function Vr(e, t) {
  return e.length === t.length && e.every((n, r) => n === t[r]);
}
export {
  E as $,
  pr as A,
  br as B,
  en as C,
  Br as D,
  Ir as E,
  $r as F,
  L as G,
  kr as H,
  _e as I,
  Gt as J,
  R as K,
  hr as L,
  $ as M,
  Vt as N,
  _r as O,
  vr as P,
  jt as Q,
  Mr as R,
  Sr as S,
  Ht as T,
  nn as U,
  xr as V,
  wr as W,
  Pr as X,
  Rr as Y,
  yr as Z,
  Dr as _,
  Ge as a,
  Gn as a0,
  cr as a1,
  Jn as a2,
  S as a3,
  B as a4,
  Ut as a5,
  or as a6,
  Zn as a7,
  Yn as a8,
  Ct as a9,
  Pn as aA,
  ot as aB,
  rr as aC,
  Zt as aD,
  zt as aE,
  Cr as aF,
  qe as aG,
  Lt as aH,
  nr as aI,
  tr as aJ,
  Pt as aK,
  Z as aL,
  zn as aM,
  U as aa,
  Vn as ab,
  Qn as ac,
  Wn as ad,
  Ln as ae,
  Be as af,
  Le as ag,
  Ke as ah,
  le as ai,
  Xn as aj,
  qn as ak,
  Me as al,
  jn as am,
  En as an,
  te as ao,
  Kn as ap,
  Nt as aq,
  Bn as ar,
  Tt as as,
  Ft as at,
  ir as au,
  dr as av,
  We as aw,
  Cn as ax,
  Tr as ay,
  st as az,
  sr as b,
  Fr as c,
  ar as d,
  Kt as e,
  Ot as f,
  Ur as g,
  Hn as h,
  er as i,
  Nr as j,
  Ne as k,
  Ze as l,
  Or as m,
  P as n,
  Kr as o,
  ur as p,
  v as q,
  fr as r,
  Ar as s,
  Xe as t,
  Vr as u,
  Lr as v,
  lr as w,
  ln as x,
  mr as y,
  gr as z
};
