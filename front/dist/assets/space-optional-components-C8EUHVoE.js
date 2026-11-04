import { s as Ye, m as G, j as Ze, d as x, J as V, C as R, B as Xe, A as Je, G as Q, F as ee, E as Qe, o as et, y as tt } from "./writing-document-YwPtpDvk.js";
import { n as rt } from "./power-icon-C4gLuaR6.js";
import { K as d, n as w, L as ae, i as I, F as ot, M as S } from "./content-view-0gIO2Kkv.js";
import { as as de, at as ce, a8 as ue, au as $, av as pe, aw as _e, ac as le, ax as me, ad as fe, p as st, b as nt, ay as it, az as at } from "./asset-preview-D6nljO8_.js";
import { f as te, j as dt, e as C, c as v } from "./preloadable-BrN58FXf.js";
import { r as ye, f as ge, e as ct, g as ut } from "./space-loading-FH4pJ97O.js";
import { n as he, P as pt, Q as _t, r as we, O as lt, R as mt } from "./node-detail-header-CD6P0SMz.js";
import { v as M, s as g } from "./site-config-D0c23URW.js";
import { b as F, u as ft, l as Ie, r as yt, o as gt, a as ht } from "./file-kind-BSFhe2vU.js";
import "./text-content-save-actions-DF1L6Tn3.js";
import "./media-inspector-gallery-CQ7C4itZ.js";
function be(e) {
  const t = e && Ye(e);
  return !!(t?.title.trim() && t.content.trim());
}
function $r(e, t) {
  if (!be(e)) return "请先在画布选用一个灵感";
  if (t.kind === "section" && G(t.id) || Ze(t)) return "";
  if (t.kind === "unit") {
    const r = x(e.units).byId.get(
      t.id
    )?.unit;
    if (!r) return "该章节已移出目录";
    if (t.tab === "body" || !t.tab)
      return r.has_body || r.title.trim() && r.plan.trim() ? "" : "请先保存本章标题与剧情";
    if (r.plan.trim() || r.has_body || V(e))
      return "";
  } else if (e.units.length || V(e))
    return "";
  return "请先完成大纲规划";
}
function Ur(e, t, r = {}) {
  if ([
    "save_document",
    "save_unit",
    "create_version",
    "restore_document"
  ].includes(t))
    return "";
  if (t === "generate_inspirations" || t === "select_inspiration")
    return e.selected_inspiration_id ? "选定灵感后不能更换或修改方向" : "";
  if (t === "retry_generation") return "";
  if (!be(e)) return "请先选用一个灵感";
  if (t === "generate_outline") return "";
  if (t === "retry_continuity")
    return x(e.units).byId.get(r.unit_id || "")?.unit?.has_body ? "" : "请先保存本章正文";
  if ((t === "generate_section" || t === "propose_edit") && r.section_id && (G(r.section_id) || ["characters", "locations", "props"].includes(r.section_id)))
    return "";
  if (!V(e))
    return "请先保存完整大纲";
  if (t === "generate_chapters") {
    if (r.unit_ids && !r.unit_ids.length)
      return "当前页没有可更新的章节";
    if (r.unit_ids?.length) {
      if (r.unit_ids.length > R) return `每批最多更新 ${R} 章章纲`;
      if (r.unit_ids.some(
        (s) => !x(e.units).byId.has(s)
      ))
        return "部分章节已移出目录";
    } else if (e.units.length > R)
      return `请选定最多 ${R} 章章纲`;
    return "";
  }
  const o = Xe(e.units);
  if (t === "append" && o.length)
    return "请先同步后续剧情，再继续创作";
  if (t === "append") {
    const s = e.preferences.planned_chapters;
    if (s > 0 && e.units.length >= s)
      return "已规划到计划总章数，可在写作设定中调整";
    if (r.count !== void 0) {
      if (!Number.isInteger(r.count) || r.count < 1 || r.count > R)
        return `本批剧情章数须为 1 到 ${R} 的整数`;
      if (s > 0 && e.units.length + r.count > s)
        return `本批最多规划剩余 ${s - e.units.length} 章，请调整数量`;
    }
    return "";
  }
  if (t === "generate_units") {
    const s = r.count ?? Je;
    if (r.mode === "continue" && Q(s))
      return Q(s);
    if (r.mode === "range" && (r.unit_ids?.length || 0) > ee)
      return `一次最多生成 ${ee} 章正文`;
    const i = r.mode === "continue" ? Qe(e.units, s).map(
      (c) => c.unit
    ) : e.units.filter(
      (c) => r.unit_ids?.includes(c.id) || c.id === r.unit_id
    );
    if (!i.length) return "请先完成章节剧情规划";
    if (i.some((c) => !c.has_body && c.plan_stale))
      return "请先同步本批后续剧情，再生成正文";
    if (i.some((c) => !c.title.trim() || !c.plan.trim()))
      return "请先保存章节标题与剧情";
    const n = i.find((c) => !c.has_body);
    if (!n) return "正文已完成，请使用修改建议";
    const u = e.units.indexOf(n);
    if (u > 0 && !e.units[u - 1].has_body)
      return `请先完成上一章「${e.units[u - 1].title}」正文，或继续未完成正文`;
  }
  return "";
}
function Hr(e, t, r = {}) {
  if (t === "generate_chapters" && e.units.length) {
    const o = x(e.units), s = r.unit_ids?.flatMap((i) => {
      const n = o.byId.get(i);
      return n ? [n] : [];
    });
    return r.unit_ids?.length ? `将更新${et(s || [])}的剧情，覆盖这些章纲的手动修改。人物、背景与已写正文保留。` : "将更新全部章纲，覆盖其中的手动修改。大纲资料和正文保留，后续章节需检查衔接。";
  }
  if (t === "generate_section" && r.section_id) {
    const o = r.section_id;
    if ((o === "characters" || o === "locations" || o === "props") && e.outline[o].length)
      return `将更新当前${tt.find(
        (i) => i.id === o
      ).label}，覆盖其中的手动描述。已有身份、其他设定、章纲和正文保留。`;
  }
  return "";
}
function Yr(e) {
  return e.unit_id ? {
    kind: "unit",
    id: e.unit_id,
    tab: e.section_id === "chapter_plan" ? "plan" : "body"
  } : e.entity_id && (e.section_id === "characters" || e.section_id === "locations" || e.section_id === "props") ? { kind: "entity", section: e.section_id, id: e.entity_id } : {
    kind: "section",
    id: e.section_id && G(e.section_id) ? e.section_id : "overview"
  };
}
function Zr(e) {
  if (!e || !["failed", "stopped"].includes(e.document.status))
    return null;
  const t = e.checkpoint;
  if (!t || t.completed >= t.target) return null;
  if ([
    "generate_inspirations",
    "generate_outline",
    "generate_chapters",
    "generate_units",
    "generate_section",
    "append",
    "retry_continuity"
  ].includes(t.action))
    return { action: "retry_generation", extra: {} };
  if (t.action !== "propose_edit") return null;
  const r = {
    instruction: t.instruction
  };
  return t.count && (r.count = t.count), t.selected_text && (r.selected_text = t.selected_text), t.section_id && (r.section_id = t.section_id), t.entity_id && (r.entity_id = t.entity_id), t.inspiration_id && (r.inspiration_id = t.inspiration_id), t.unit_id && (r.unit_id = t.unit_id), { action: "propose_edit", extra: r };
}
function Ce(e) {
  return e.purpose ? e.purpose : e.id.startsWith("script-item-edge-") || e.id.startsWith("script-compose-edge-") ? "dependency" : e.id.startsWith("script-edge-") ? "structure" : "media";
}
function Xr(e) {
  return Ce(e) === "media";
}
function Jr(e, t, r) {
  const o = new Map(r.map((i) => [i.id, i])), s = new Set(e.map((i) => i.id));
  return [
    ...e.flatMap((i) => {
      if (!t.has(i.id))
        return [i];
      const n = o.get(i.id);
      return n ? [n] : [];
    }),
    ...r.filter((i) => !s.has(i.id))
  ];
}
const wt = { width: 720, height: 420 }, Qr = { width: 360, height: 240 }, eo = { width: 2400, height: 1600 }, Se = 48, j = 16;
function It(e, t) {
  return e.filter((r) => r.groupId === t);
}
function to(e, t) {
  const r = e.find((o) => o.id === t);
  return r ? r.type === "group" ? It(e, r.id) : [r] : [];
}
function ro(e, t) {
  return !(!e || !t || e.id === t.id || e.type === "group" && t.groupId === e.id || t.type === "group" && e.groupId === t.id || e.groupId !== t.groupId && t.type !== "group" && t.groupId);
}
function oo(e, t, r) {
  const o = e.find((n) => n.id === t);
  if (!o || o.x === r.x && o.y === r.y)
    return e;
  const s = r.x - o.x, i = r.y - o.y;
  return e.map((n) => n.id === t ? { ...n, ...r } : o.type === "group" && n.groupId === o.id ? {
    ...n,
    x: n.x + s,
    y: n.y + i
  } : n);
}
function so(e, t, r) {
  const o = e.find((u) => u.id === t), s = o ? ve(e, o) : void 0;
  if (!o || !s)
    return r;
  const i = re(
    r.x,
    s.x + j,
    s.x + s.width - j - o.width
  ), n = re(
    r.y,
    s.y + Se,
    s.y + s.height - j - o.height
  );
  return i === r.x && n === r.y ? r : { x: i, y: n };
}
function no(e, t, r) {
  const o = e.find((n) => n.id === t);
  if (!o || o.type === "group" || ve(e, o))
    return e;
  const s = { ...o, ...r }, i = St(e, s);
  return (o.groupId || "") === i ? e : e.map(
    (n) => n.id === t ? { ...n, groupId: i || void 0 } : n
  );
}
function bt(e) {
  const t = /* @__PURE__ */ new Map();
  for (const s of e)
    s.type === "group" && s.group?.origin === "script" && t.set(s.id, s.group.sourceNodeId || "");
  if (t.size === 0) return e;
  let r = !1;
  const o = e.map((s) => {
    const i = t.get(s.groupId || "");
    return i === void 0 || s.storyboardItem?.sourceNodeId === i ? s : (r = !0, { ...s, groupId: void 0 });
  });
  return r ? o : e;
}
function Ct(e, t) {
  const r = new Map(e.map((i) => [i.id, i])), o = /* @__PURE__ */ new Set(), s = [];
  for (const i of t) {
    const n = i.logicalFrom || i.from, u = i.logicalTo || i.to, c = r.get(n), p = r.get(u);
    if (!c || !p)
      continue;
    const f = c.groupId !== p.groupId, y = f && c.type !== "group" && c.groupId ? c.groupId : c.id, h = f && p.type !== "group" && p.groupId ? p.groupId : p.id;
    if (!y || !h || y === h)
      continue;
    const b = `${n}\0${u}\0${Ce(i)}`;
    o.has(b) || (o.add(b), s.push({ ...i, from: y, to: h, logicalFrom: n, logicalTo: u }));
  }
  return s;
}
function St(e, t) {
  const r = t.x + t.width / 2, o = t.y + t.height / 2;
  return e.filter(
    (i) => i.type === "group" && i.group?.origin !== "script" && i.id !== t.id && r >= i.x + j && r <= i.x + i.width - j && o >= i.y + Se && o <= i.y + i.height - j
  ).sort(
    (i, n) => i.width * i.height - n.width * n.height
  )[0]?.id || "";
}
function ve(e, t) {
  if (!(!t.groupId || t.type === "group"))
    return e.find(
      (r) => r.id === t.groupId && r.type === "group" && r.group?.origin === "script"
    );
}
function re(e, t, r) {
  return Math.min(Math.max(e, t), Math.max(t, r));
}
const K = {
  id: 0,
  team_id: 0,
  name: "自由",
  kind: "richtext",
  cardinality: "multiple",
  status: 1,
  sort: 0,
  virtual: !0
}, vt = { width: 180, height: 180 }, kt = { width: 240, height: 160 }, oe = { width: 620, height: 360 }, L = { width: 800, height: 460 }, se = { width: 560, height: 520 };
function Nt(e) {
  const t = _(e);
  return {
    project: zt(t.project),
    team: Pt(t.team),
    release: Ot(t.release),
    assetCates: A(t.asset_cates).map(xt),
    flows: A(t.flows).map(qt),
    canvasList: A(t.canvas_list).map(q),
    canvases: Ft(t.canvas),
    assets: A(_(t.assets).items).map(je),
    assistant: At(t.assistant),
    initialCanvasId: d(t.active_canvas_id),
    initialAssetCateId: d(t.active_asset_cate_id)
  };
}
function q(e) {
  const t = _(e);
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
function At(e) {
  const t = _(e);
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
function io(e, t = 0, r = "第一幕") {
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
function U(e, t = 0) {
  const r = _(e), o = d(
    w(r.asset_cate_id, t)
  ), s = A(r.nodes).map(Lt).filter((u) => !!u), i = bt(s), n = A(r.edges).map(or).filter((u) => !!u);
  return Dt({
    id: d(r.id),
    name: a(r.name) || "第一幕",
    sort: d(r.sort),
    status: d(r.status) || 1,
    assetCateId: o,
    nextNodeNo: Math.max(1, d(r.next_node_no)),
    nodes: i,
    edges: i === s ? n : Ct(i, n),
    viewport: sr(r.viewport),
    updatedAt: a(r.updated_at)
  });
}
function Dt(e) {
  let t = Rt(e.nodes, e.nextNodeNo), r = t !== e.nextNodeNo;
  const o = e.nodes.map((s) => {
    if (!jt(s) || Number(s.nodeNo || 0) > 0)
      return s;
    const i = t++, n = s.titleMode || "manual";
    return r = !0, {
      ...s,
      nodeNo: i,
      titleMode: n,
      ...n === "auto" && !s.storyboardItem ? { title: ke(s, i) } : {}
    };
  });
  return r ? { ...e, nextNodeNo: t, nodes: o } : e;
}
function Rt(e, t = 1) {
  return Math.max(
    1,
    Number(t || 1),
    ...e.map((r) => Number(r.nodeNo || 0) + 1)
  );
}
function jt(e) {
  return e.type === "power" || e.type === "agent" || e.type === "flow";
}
function ke(e, t) {
  let r = "节点";
  return e.type === "power" ? r = e.power?.name.trim() || Ne(e) : e.type === "agent" ? r = String(e.role?.name || "智能体").trim() || "智能体" : e.type === "flow" && (r = String(e.flow?.name || "流程").trim() || "流程"), `${r}-${t}`;
}
function ao(e) {
  const t = Number(e.nodeNo || 0);
  if (t <= 0)
    return !1;
  const r = e.title.trim();
  return r === ke(e, t).trim() ? !0 : e.type === "power" && r === `${Ne(e)}-${t}`.trim();
}
function Ne(e) {
  const t = ye(
    e.power,
    e.kind,
    e.outputType
  );
  return t.outputType !== "general" && t.outputName || t.kindName;
}
function Mt(e) {
  const t = _(e);
  return {
    roles: A(t.roles).map(Bt),
    powers: A(t.powers).map(Ae),
    powerCategories: A(t.power_cates).map(rt),
    powerKinds: A(t.power_kinds).map(Vt),
    outputTypes: A(t.output_types).map(Re)
  };
}
function H(e) {
  return je(_(e));
}
function Et(e) {
  return e.assetCates.length > 0 ? e.assetCates : [K];
}
function co(e) {
  return Et(e)[0]?.id ?? 0;
}
function Tt(e, t) {
  const r = e.length > 0 ? e : [K];
  return r.find((o) => o.id === t) || r[0] || K;
}
function uo(e, t) {
  return Tt(e.assetCates, t);
}
function po(e, t) {
  return t === 0 ? e.flows.slice(0, 4) : e.flows.filter((r) => nr(r).has(t)).slice(0, 4);
}
function _o(e) {
  return e.create_status !== 2;
}
function lo(e) {
  return e.createStatus !== 2;
}
function mo(e, t, r, o, s) {
  const i = o?.x ?? 420 + r % 3 * 190, n = o?.y ?? 610 + Math.floor(r / 3) * 170, u = s?.asset, c = s?.flow, p = s?.functionOption, f = s?.power, y = s?.role, h = f ? ye(f) : null, b = Number(u?.asset_cate_id || t.id), k = {
    asset: [
      u?.name || "资产引用",
      u ? te(u.kind) : te(t.kind),
      u && ot(u.version?.content) || "引用已有资产，作为其他节点的上下文。"
    ],
    power: [
      f?.name || ir(t.kind),
      h?.outputName || h?.kindName || "能力节点",
      f ? `调用 ${f.name} 能力，按参数生成内容。` : "输入提示词和参数，直接生成文本、图片、视频或音频。"
    ],
    agent: [
      y?.name || "智能体节点",
      y?.role_type || "角色执行",
      y?.assignment || "调用团队角色或指定智能体完成一段任务。"
    ],
    flow: [
      c?.name || "流程节点",
      "团队流程",
      c?.goal || "执行一组团队预设流程。"
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
  }, [$e, Ue, He] = k[e], J = Ee(e, f);
  return {
    id: `local-${e}-${Date.now()}-${r}`,
    type: e,
    title: $e,
    titleMode: e === "power" || e === "agent" || e === "flow" ? "auto" : void 0,
    subtitle: Ue,
    description: He,
    x: i,
    y: n,
    width: J.width,
    height: J.height,
    assetCateId: b,
    kind: u?.kind || f?.kind || t.kind,
    outputType: f?.outputType,
    cardinality: t.cardinality,
    asset: u,
    flow: c,
    functionOption: p,
    power: f,
    role: y,
    group: e === "group" ? { origin: "manual" } : void 0,
    local: !0
  };
}
function zt(e) {
  const t = _(e), r = _(t.team);
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
function Pt(e) {
  const t = _(e);
  return {
    id: d(t.id),
    name: a(t.name) || "自由团队",
    description: a(t.description)
  };
}
function Ot(e) {
  const t = _(e);
  return {
    id: d(t.id),
    team_id: d(t.team_id),
    version: d(t.version),
    status: a(t.status)
  };
}
function xt(e) {
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
function Bt(e) {
  return {
    id: d(e.id),
    team_id: d(e.team_id),
    role_type: a(e.role_type),
    role_key: a(e.role_key),
    name: a(e.name),
    agent_id: d(e.agent_id),
    assignment: a(e.assignment),
    create_status: De(e.create_status)
  };
}
function qt(e) {
  return {
    id: d(e.id),
    name: a(e.name),
    key: a(e.key),
    goal: a(e.goal),
    config: _(e.config),
    status: d(e.status),
    sort: d(e.sort),
    output_asset_cate_ids: Te(e.output_asset_cate_ids)
  };
}
function Ae(e) {
  const t = a(e.kind) || "text", r = Re(_(e.output)), o = a(e.output_type) || "general";
  return {
    id: d(e.id),
    cate_id: d(e.cate_id),
    name: a(e.name) || a(e.key) || "未命名能力",
    key: a(e.key),
    icon: a(e.icon),
    description: a(e.description),
    outputType: o,
    output: r.key ? r : void 0,
    kind: t,
    createStatus: De(e.create_status)
  };
}
function De(e) {
  return Number(e) === 2 ? 2 : 1;
}
function Re(e) {
  return {
    key: a(e.key),
    name: a(e.name),
    allowedKinds: O(e.allowed_kinds),
    viewMode: a(e.view_mode),
    defaultWidth: d(e.default_width),
    defaultHeight: d(e.default_height),
    structured: !!e.structured,
    sort: d(e.sort)
  };
}
function Vt(e) {
  return {
    id: a(e.id),
    value: a(e.value) || a(e.name) || a(e.id)
  };
}
function je(e) {
  const t = Y(_(e.version)), r = Z(e.versions);
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
function Y(e) {
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
      source: _(e.source),
      version: d(e.version),
      summary: a(e.summary),
      content: e.content,
      created_at: a(w(e.created_at, e.createdAt)),
      updated_at: a(w(e.updated_at, e.updatedAt))
    };
}
function Z(e) {
  return A(e).map(Y).filter((t) => !!t);
}
function Ft(e) {
  const t = _(e), r = {};
  for (const [o, s] of Object.entries(t)) {
    const i = U(s), n = i.id || d(o);
    n > 0 && (r[String(n)] = { ...i, id: n });
  }
  return r;
}
function Kt(e, t) {
  const r = new Map(
    t.filter((s) => s.id > 0).map((s) => [s.id, s])
  ), o = new Map(
    t.filter((s) => s.key).map((s) => [s.key, s])
  );
  for (const s of Object.values(e))
    s.nodes = s.nodes.map((i) => {
      if (i.type !== "power" || !i.power)
        return i;
      const n = r.get(Number(i.power.id || 0)) || o.get(i.power.key);
      if (!n)
        return i;
      const u = i.outputType || i.power.outputType || n.outputType;
      return {
        ...i,
        outputType: u,
        power: {
          ...n,
          outputType: u,
          output: n.outputType === u ? n.output : i.power.output
        }
      };
    });
  return e;
}
function fo(e, t) {
  const r = String(e.id);
  return Kt({ [r]: e }, t)[r];
}
function Lt(e) {
  const t = a(e.id), r = a(e.type);
  if (!t || !r)
    return null;
  const o = a(e.run_error), s = a(e.title), i = _t(
    e.function_option,
    s
  ), n = a(e.description), u = i?.key === "import", c = {
    id: t,
    nodeNo: d(e.node_no) || void 0,
    type: r,
    title: u && s === "导入" ? "引用" : s,
    titleMode: a(e.title_mode) === "manual" ? "manual" : a(e.title_mode) === "auto" ? "auto" : void 0,
    subtitle: a(e.subtitle),
    description: u && (!n || n === "导入资产并连接到当前节点。") ? "选择资产并引用到当前节点。" : n,
    x: d(e.x),
    y: d(e.y),
    width: d(e.width),
    height: d(e.height),
    groupId: a(e.group_id),
    group: Gt(e.group),
    storyboardItem: $t(e.storyboard_item),
    storyboardMaterializedSignature: a(
      e.storyboard_materialized_signature
    ),
    storyboardFramePlanVersion: ue(
      e.storyboard_frame_plan_version
    ),
    assetCateId: d(e.asset_cate_id),
    outputType: a(e.output_type),
    count: e.count == null ? void 0 : d(e.count),
    functionOption: i,
    composerDraft: er(e.composer_draft),
    resultRef: rr(e.result_ref),
    runTiming: lt(e.run_timing),
    resultOutput: e.result_output,
    resultView: Wt(e.result_view),
    runError: we(o) ? "" : o,
    local: e.local !== !1
  }, p = a(e.kind), f = a(
    e.cardinality
  ), y = Ut(e.flow), h = Ht(e.role), b = Yt(e.asset), k = Zt(e.power);
  return p && (c.kind = p), f && (c.cardinality = f), y && (c.flow = y), h && (c.role = h), b && (c.asset = b), k && (c.power = k, c.outputType = c.outputType || k.outputType, ge(k) && c.width === oe.width && c.height === oe.height && (c.width = L.width, c.height = L.height)), c;
}
function Wt(e) {
  const t = _(e), r = S(t.width), o = S(t.height);
  if (r == null || o == null || r <= 0 || o <= 0)
    return;
  const s = S(t.offset_x), i = S(t.offset_y);
  return {
    width: r,
    height: o,
    ...s == null ? {} : { offsetX: s },
    ...i == null ? {} : { offsetY: i }
  };
}
function Gt(e) {
  const t = _(e);
  if (Object.keys(t).length)
    return {
      origin: a(t.origin),
      sourceNodeId: a(t.source_node_id),
      syncKey: a(t.sync_key),
      layoutKey: a(t.layout_key)
    };
}
function $t(e) {
  const t = _(e), r = a(t.source_node_id), o = a(t.item_type), s = a(t.item_id);
  if (!r || !s || ![
    "character",
    "scene",
    "prop",
    "shot_image",
    "shot",
    "speech",
    "subtitle",
    "lip_sync",
    "video_compose"
  ].includes(o))
    return;
  const i = I(t.generated_inputs) ? {
    referenceContent: W(
      t.generated_inputs.reference_content
    ),
    voice: typeof t.generated_inputs.voice == "string" ? t.generated_inputs.voice : void 0
  } : void 0;
  return {
    sourceNodeId: r,
    itemType: o,
    itemId: s,
    generatedPrompt: a(t.generated_prompt),
    generatedInputs: i,
    dependencyNodeIds: O(t.dependency_node_ids),
    referenceNodeIds: O(t.reference_node_ids),
    externalReferenceAssetIds: Te(t.external_reference_asset_ids),
    shotId: a(t.shot_id),
    shotImageMode: fe(t.shot_image_mode),
    frameRole: me(t.frame_role),
    frameMediaItems: le(t.frame_media_items),
    imageSequenceFrames: _e(
      t.image_sequence_frames
    ),
    speechId: a(t.speech_id),
    speechIds: O(t.speech_ids),
    characterId: a(t.character_id),
    speechKind: a(t.speech_kind),
    speakerMode: a(t.speaker_mode),
    startTime: S(t.start_time),
    shotDuration: S(t.shot_duration),
    requiredDurationValues: pe(
      t.required_duration_values
    ),
    continuityAnchor: a(t.continuity_anchor),
    sharedEndShotId: a(t.shared_end_shot_id),
    optional: t.optional === !0 || t.optional === 1 || String(t.optional || "").toLowerCase() === "true"
  };
}
function Ut(e) {
  const t = _(e), r = d(t.id), o = a(t.key), s = a(t.name);
  if (!(!r && !o && !s))
    return {
      id: r,
      key: o,
      name: s,
      goal: a(t.goal)
    };
}
function Ht(e) {
  const t = _(e), r = d(t.id), o = a(t.name);
  if (!(!r && !o))
    return {
      id: r,
      name: o,
      role_type: a(t.role_type),
      agent_id: d(t.agent_id)
    };
}
function Yt(e) {
  const t = _(e), r = d(t.id);
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
function Zt(e) {
  const t = _(e), r = d(t.id), o = a(t.key);
  if (!(!r && !o))
    return Ae({
      ...t,
      id: r,
      key: o,
      name: a(t.name)
    });
}
function Me(e) {
  const t = _(e);
  if (!Object.keys(t).length)
    return;
  const r = a(t.storyboardGridLayout);
  return {
    prompt: a(t.prompt),
    promptContent: W(t.promptContent),
    paramValues: _(t.paramValues),
    paramBindings: pt(t.paramBindings),
    selectedTargetId: d(t.selectedTargetId),
    videoComposition: he(t.videoComposition),
    storyboardReferences: ce(
      t.storyboardReferences
    ),
    storyboardWorkType: tr(t.storyboardWorkType),
    storyboardLyricsSourceNodeId: a(t.storyboardLyricsSourceNodeId),
    minShotDuration: de(t.minShotDuration),
    storyboardRangeStartMs: ne(
      t.storyboardRangeStartMs,
      !0
    ),
    storyboardRangeEndMs: ne(
      t.storyboardRangeEndMs,
      !1
    ),
    storyboardGridLayout: r ? ae(r) : void 0,
    multiImageMode: Qt(t.multiImageMode),
    mediaSelections: Object.fromEntries(
      Object.entries(_(t.mediaSelections)).flatMap(([o, s]) => {
        const i = W(s);
        return i ? [[o, i]] : [];
      })
    )
  };
}
function Xt(e) {
  return Me(e) || {
    prompt: "",
    paramValues: {},
    selectedTargetId: 0
  };
}
function yo(e) {
  const t = Xt(e), r = Jt(t.promptContent);
  return r ? { ...t, prompt: r } : t;
}
function go(e) {
  return JSON.stringify([
    e.prompt,
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
function ho(e) {
  return JSON.stringify(
    (e?.parts || []).filter((t) => t.type === "reference")
  );
}
function Jt(e) {
  return e?.parts?.some((t) => t.type === "reference") ? e.parts.map((t) => {
    if (t.type === "text")
      return t.text;
    const r = String(t.label || "").trim();
    return r.startsWith("@") ? r : `@${r}`;
  }).join("") : "";
}
function Qt(e) {
  const t = a(e);
  return t === "per_image" || t === "shared_reference" ? t : void 0;
}
function er(e) {
  const t = _(e);
  if (Object.keys(t).length)
    return Me({
      prompt: t.prompt,
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
function tr(e) {
  const t = a(e);
  return $(t) ? t : void 0;
}
function ne(e, t) {
  const r = S(e);
  if (!(r == null || !Number.isInteger(r) || r < (t ? 0 : 1)))
    return r;
}
function W(e) {
  const t = _(e), r = Array.isArray(t.parts) ? t.parts.filter((o) => {
    const s = _(o);
    return s.type === "text" || s.type === "reference";
  }) : [];
  if (!(Number(t.version) !== 1 || r.length === 0))
    return { version: 1, parts: r };
}
function rr(e) {
  const t = _(e);
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
function or(e) {
  const t = a(e.from), r = a(e.to);
  if (!t || !r)
    return null;
  const o = a(e.purpose);
  return {
    id: a(e.id) || `edge-${t}-${r}`,
    from: t,
    to: r,
    logicalFrom: a(e.logical_from) || void 0,
    logicalTo: a(e.logical_to) || void 0,
    purpose: o === "media" || o === "structure" || o === "dependency" ? o : void 0,
    executionMode: a(e.execution_mode) === "manual" ? "manual" : void 0,
    mediaUsage: a(e.media_usage) || void 0
  };
}
function sr(e) {
  const t = _(e), r = {};
  return t.x != null && (r.x = d(t.x)), t.y != null && (r.y = d(t.y)), t.zoom != null && (r.zoom = d(t.zoom)), r;
}
function nr(e) {
  return new Set(e.output_asset_cate_ids);
}
function ir(e) {
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
function Ee(e, t) {
  switch (e) {
    case "agent":
      return { width: 154, height: 154 };
    case "flow":
      return { width: 210, height: 160 };
    case "function":
      return { width: 128, height: 46 };
    case "group":
      return { ...wt };
    case "power":
      return ar(t);
    default:
      return { width: 250, height: 170 };
  }
}
function ar(e) {
  if (ct(e))
    return dr();
  if (ut(e))
    return { ...kt };
  if (ge(e))
    return { ...L };
  const t = cr(e);
  return t || { ...vt };
}
function dr(e) {
  return {
    ...se,
    height: e?.selected_inspiration_id ? 210 : se.height
  };
}
function cr(e) {
  const t = Number(e?.output?.defaultWidth || 0), r = Number(e?.output?.defaultHeight || 0);
  return t > 0 && r > 0 ? { width: t, height: r } : null;
}
function wo(e) {
  const t = Ee(
    e.type,
    e.power || {
      kind: String(e.kind || ""),
      outputType: e.outputType || ""
    }
  );
  return e.width === t.width && e.height === t.height;
}
function O(e) {
  return Array.isArray(e) ? e.map(a).filter(Boolean) : [];
}
function Te(e) {
  if (!Array.isArray(e))
    return [];
  const t = [], r = /* @__PURE__ */ new Set();
  for (const o of e) {
    const s = d(o);
    !s || s <= 0 || r.has(s) || (r.add(s), t.push(s));
  }
  return t;
}
function A(e) {
  return Array.isArray(e) ? e.filter(I) : [];
}
function _(e) {
  return I(e) ? e : {};
}
function a(e) {
  return e == null ? "" : String(e).trim();
}
function ur(e) {
  const t = new Map(e.nodes.map((s) => [s.id, s]));
  let r = !1;
  const o = e.nodes.map((s) => {
    const i = s.storyboardItem?.dependencyNodeIds || [];
    if (s.storyboardItem?.itemType !== "shot" || !s.storyboardItem.continuityAnchor || i.length !== 1)
      return s;
    const n = i[0], u = pr(t.get(n)), c = (s.storyboardItem.referenceNodeIds || []).filter(
      (b) => b !== n
    ), p = s.composerDraft?.promptContent, f = p && {
      ...p,
      parts: p.parts.filter(
        (b) => b.type !== "reference" || b.ref_type !== "asset" || !u || Number(b.ref_id || 0) !== u
      )
    }, y = c.length !== (s.storyboardItem.referenceNodeIds || []).length, h = f?.parts.length !== p?.parts.length;
    return !y && !h ? s : (r = !0, {
      ...s,
      storyboardItem: {
        ...s.storyboardItem,
        referenceNodeIds: c
      },
      composerDraft: s.composerDraft ? { ...s.composerDraft, promptContent: f } : s.composerDraft
    });
  });
  return r ? { ...e, nodes: o } : e;
}
function pr(e) {
  return Number(e?.asset?.id || e?.resultRef?.asset_id || 0);
}
function ze(e) {
  return {
    asset_cate_id: Number(e.assetCateId || 0),
    next_node_no: Math.max(1, Number(e.nextNodeNo || 1)),
    nodes: e.nodes.map(_r),
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
function _r(e) {
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
  if (E(t, "node_no", e.nodeNo), e.titleMode && (t.title_mode = e.titleMode), N(t, "group_id", e.groupId), e.group) {
    const n = {};
    N(n, "origin", e.group.origin), N(n, "source_node_id", e.group.sourceNodeId), N(n, "sync_key", e.group.syncKey), N(n, "layout_key", e.group.layoutKey), Object.keys(n).length > 0 && (t.group = n);
  }
  if (e.storyboardItem) {
    const n = e.storyboardItem, u = fe(n.shotImageMode), c = me(n.frameRole), p = le(
      n.frameMediaItems
    ), f = _e(
      n.imageSequenceFrames
    ), y = pe(
      n.requiredDurationValues
    );
    t.storyboard_item = {
      source_node_id: n.sourceNodeId,
      item_type: n.itemType,
      item_id: n.itemId,
      ...n.generatedPrompt ? { generated_prompt: n.generatedPrompt } : {},
      ...n.generatedInputs ? {
        generated_inputs: {
          reference_content: n.generatedInputs.referenceContent,
          voice: n.generatedInputs.voice
        }
      } : {},
      dependency_node_ids: n.dependencyNodeIds || [],
      reference_node_ids: n.referenceNodeIds || [],
      external_reference_asset_ids: n.externalReferenceAssetIds || [],
      ...n.shotId ? { shot_id: n.shotId } : {},
      ...u ? { shot_image_mode: u } : {},
      ...c ? { frame_role: c } : {},
      ...p.length ? {
        frame_media_items: p.map((h) => ({
          frame_role: h.frameRole,
          media_index: h.mediaIndex
        }))
      } : {},
      ...f.length ? { image_sequence_frames: f } : {},
      ...n.speechId ? { speech_id: n.speechId } : {},
      ...n.speechIds?.length ? { speech_ids: n.speechIds } : {},
      ...n.characterId ? { character_id: n.characterId } : {},
      ...n.speechKind ? { speech_kind: n.speechKind } : {},
      ...n.speakerMode ? { speaker_mode: n.speakerMode } : {},
      ...Number.isFinite(n.startTime) ? { start_time: n.startTime } : {},
      ...Number.isFinite(n.shotDuration) ? { shot_duration: n.shotDuration } : {},
      ...y.length > 0 ? { required_duration_values: y } : {},
      ...n.sharedEndShotId ? { shared_end_shot_id: n.sharedEndShotId } : {},
      ...n.continuityAnchor ? { continuity_anchor: n.continuityAnchor } : {},
      ...n.optional ? { optional: !0 } : {}
    };
  }
  N(
    t,
    "storyboard_materialized_signature",
    e.storyboardMaterializedSignature
  ), E(
    t,
    "storyboard_frame_plan_version",
    ue(e.storyboardFramePlanVersion)
  ), E(t, "asset_cate_id", e.assetCateId), N(t, "kind", e.kind), N(t, "output_type", e.outputType), N(t, "cardinality", e.cardinality), E(t, "count", e.count), e.flow && (t.flow = {
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
    output: fr(e.power.output)
  }), e.functionOption && (t.function_option = {
    key: e.functionOption.key,
    label: e.functionOption.label,
    description: e.functionOption.description
  });
  const r = mr(e.composerDraft);
  r && (t.composer_draft = r);
  const o = wr(e.resultRef);
  o && (t.result_ref = o), e.runTiming?.startedAt && e.runTiming.finishedAt && (t.run_timing = {
    started_at: e.runTiming.startedAt,
    finished_at: e.runTiming.finishedAt
  }), !(Number(o?.asset_id || 0) > 0 && Number(o?.version_id || 0) > 0) && e.resultOutput != null && D(e.resultOutput) && (t.result_output = e.resultOutput);
  const i = lr(e.resultView);
  return i && (t.result_view = i), we(e.runError) || N(t, "run_error", e.runError), e.local != null && (t.local = e.local), t;
}
function lr(e) {
  if (!e)
    return;
  const t = S(e.width), r = S(e.height);
  if (t == null || r == null || t <= 0 || r <= 0)
    return;
  const o = { width: t, height: r }, s = S(e.offsetX), i = S(e.offsetY);
  return s != null && (o.offset_x = s), i != null && (o.offset_y = i), o;
}
function mr(e) {
  if (!I(e))
    return null;
  const t = {};
  N(t, "prompt", e.prompt);
  const r = yr(e.promptContent);
  r && D(r) && (t.prompt_content = r), E(t, "selected_target_id", e.selectedTargetId);
  const o = gr(e.paramValues);
  o && (t.param_values = o);
  const s = mt(e.paramBindings);
  s && (t.param_bindings = s);
  const i = he(e.videoComposition);
  i && D(i) && (t.video_composition = i);
  const n = ce(
    e.storyboardReferences
  );
  n.length > 0 && D(n) && (t.storyboard_references = n), $(e.storyboardWorkType) && (t.storyboard_work_type = e.storyboardWorkType), N(
    t,
    "storyboard_lyrics_source_node_id",
    e.storyboardLyricsSourceNodeId
  );
  const u = de(e.minShotDuration);
  u != null && (t.min_shot_duration = u);
  const c = S(e.storyboardRangeStartMs);
  c != null && Number.isInteger(c) && c >= 0 && (t.storyboard_range_start_ms = c);
  const p = S(e.storyboardRangeEndMs);
  return p != null && Number.isInteger(p) && p > 0 && (t.storyboard_range_end_ms = p), e.storyboardGridLayout && (t.storyboard_grid_layout = ae(
    e.storyboardGridLayout
  )), (e.multiImageMode === "per_image" || e.multiImageMode === "shared_reference") && (t.multi_image_mode = e.multiImageMode), e.mediaSelections && Object.keys(e.mediaSelections).length && (t.media_selections = e.mediaSelections), Object.keys(t).length ? t : null;
}
function fr(e) {
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
function yr(e) {
  if (!(!I(e) || Number(e.version || 0) !== 1 || !Array.isArray(e.parts)))
    return e;
}
function gr(e) {
  if (!I(e))
    return null;
  const t = {};
  for (const [r, o] of Object.entries(e))
    hr(o) || D(o) && (t[r] = o);
  return Object.keys(t).length ? t : null;
}
function hr(e) {
  return I(e) ? !!(e.file || e.blob || e.preview || e.progress != null || e.uploading != null) : !1;
}
function wr(e) {
  if (!I(e))
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
    const o = e[r];
    o != null && D(o) && (t[r] = o);
  }
  return Object.keys(t).length ? t : null;
}
function N(e, t, r) {
  typeof r == "string" && r.trim() && (e[t] = r);
}
function E(e, t, r) {
  const o = Number(r || 0);
  o > 0 && (e[t] = o);
}
function D(e) {
  return e == null || ["string", "number", "boolean"].includes(typeof e) ? !0 : Array.isArray(e) ? e.every(D) : I(e) ? Object.values(e).every(D) : !1;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const B = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!B || Object.keys(B).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const l = B.joinSiteApi, m = B.request;
async function Io(e, t = 0, r = 0) {
  const o = await m(l("workspace/bootstrap"), "get", {
    project_id: e,
    canvas_id: t,
    asset_cate_id: r
  });
  return Nt(
    M(o, "加载创作空间失败")
  );
}
async function bo(e) {
  const t = await m(l("workspace/canvas"), "get", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    asset_cate_id: e.assetCateId || 0
  }), r = g(t, "加载分类画布失败"), o = r.assets || {}, s = Array.isArray(o.items) ? o.items : Array.isArray(o) ? o : [];
  return {
    canvas: U(r.canvas, e.assetCateId || 0),
    assets: s.map(H),
    canvasList: Array.isArray(r.canvas_list) ? r.canvas_list.map(q) : []
  };
}
function z(e) {
  const t = I(e) ? e : {}, r = I(t.canvas) ? t.canvas : null;
  return {
    canvas: r && Array.isArray(r.nodes) ? U(r) : void 0,
    canvasList: Array.isArray(t.canvas_list) ? t.canvas_list.map(q) : [],
    activeCanvasId: Number(t.active_canvas_id || 0) || void 0
  };
}
async function Co(e) {
  const t = await m(l("workspace/canvas_create"), "post", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId,
    name: e.name || ""
  });
  return z(
    g(t, "创建画布失败")
  );
}
async function So(e) {
  const t = await m(l("workspace/canvas_rename"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    name: e.name
  });
  return z(
    g(t, "重命名画布失败")
  );
}
async function vo(e) {
  const t = await m(
    l("workspace/canvas_reorder"),
    "post",
    {
      project_id: e.projectId,
      asset_cate_id: e.assetCateId,
      canvas_ids: e.canvasIds
    }
  );
  return z(
    g(t, "调整画布顺序失败")
  );
}
async function ko(e) {
  const t = await m(l("workspace/canvas_delete"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId
  });
  return z(
    g(t, "删除画布失败")
  );
}
async function No(e) {
  const t = await m(l("workspace/canvas_deleted"), "get", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId
  }), r = g(t, "加载已删除画布失败");
  return Array.isArray(r.items) ? r.items.map(q) : [];
}
async function Ao(e) {
  const t = await m(
    l("workspace/canvas_restore"),
    "post",
    {
      project_id: e.projectId,
      canvas_id: e.canvasId
    }
  );
  return z(
    g(t, "恢复画布失败")
  );
}
async function Do(e) {
  const t = await m(l("project/canvas_config"), "get", {
    project_id: e
  });
  return Mt(
    M(t, "加载能力列表失败")
  );
}
async function Ro(e) {
  const t = await m(
    l("project/canvas_power_form"),
    "get",
    {
      project_id: e.projectId,
      flow_id: e.flowId || 0,
      power_id: e.powerId,
      power_key: e.powerKey,
      target_id: e.targetId || 0
    }
  );
  return br(
    M(t, "加载能力参数失败")
  );
}
async function jo(e) {
  const t = ze(ur(e.canvas)), r = e.canvas.nodes.find(
    (c) => c.id === e.startNodeId
  ), o = r?.group?.origin === "script" ? r.group : e.canvas.nodes.find((c) => c.id === r?.groupId)?.group, s = e.executionScope === "storyboard_frame" ? r?.id : r?.storyboardItem?.sourceNodeId || (o?.origin === "script" ? o.sourceNodeId : void 0), i = e.canvas.nodes.find(
    (c) => c.id === s
  ), n = [
    i?.asset?.version?.content,
    i?.resultOutput
  ].find((c) => {
    const p = st(c);
    return p && nt(p);
  });
  if (n != null) {
    const c = t.nodes.find((p) => p.id === s);
    c && (c.result_output = n);
  }
  const u = await m(
    l("workspace/canvas_execute"),
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
  return g(u, "画布运行失败");
}
async function Mo(e) {
  const t = await m(
    l("workspace/canvas_node_title"),
    "post",
    {
      project_id: e.projectId,
      node_key: e.nodeKey,
      version_id: e.versionId,
      prompt: e.prompt || ""
    },
    { reportError: !1 }
  ), r = g(t, "生成节点标题失败");
  return {
    nodeKey: String(r.node_key || e.nodeKey),
    versionId: Number(r.version_id || e.versionId || 0),
    title: String(r.title || "").trim()
  };
}
function P(e, t, r) {
  const o = g(e, t).asset;
  if (!o)
    throw new Error(r);
  return H(o);
}
async function ie(e) {
  const t = await m(
    l("workspace/canvas_execution_list"),
    "get",
    {
      project_id: e.projectId,
      canvas_id: e.canvasId || 0,
      scope: e.scope,
      asset_cate_id: e.assetCateId || 0,
      run_ids: (e.runIds || []).filter((o) => o > 0).join(","),
      before_id: e.beforeId || 0,
      limit: e.limit || 20,
      summary_only: e.summaryOnly ? 1 : 0
    },
    // 恢复观察自行重试，历史列表在画布面板显示错误。
    { reportError: !1 }
  ), r = g(t, "读取画布运行记录失败");
  return {
    count: Number(r.count || 0),
    items: Array.isArray(r.items) ? r.items : [],
    hasMore: !!r.has_more,
    beforeId: Number(r.before_id || 0)
  };
}
async function Eo(e, t) {
  const r = [...new Set((e.runIds || []).filter((n) => n > 0))], o = [], s = 50;
  if (r.length > 0) {
    for (let n = 0; n < r.length; n += s) {
      t?.throwIfAborted();
      const u = await ie({
        ...e,
        runIds: r.slice(n, n + s),
        limit: s
      });
      t?.throwIfAborted(), o.push(...u.items);
    }
    return o;
  }
  let i = e.beforeId || 0;
  for (; ; ) {
    t?.throwIfAborted();
    const n = await ie({ ...e, beforeId: i, limit: s });
    if (t?.throwIfAborted(), o.push(...n.items), !n.hasMore) return o;
    if (n.beforeId <= 0 || i > 0 && n.beforeId >= i)
      throw new Error("读取画布运行记录的分页位置无效");
    i = n.beforeId;
  }
}
async function To(e) {
  const t = Number(e.executionId || 0), r = String(e.requestId || "").trim(), o = Number(e.runId || 0), s = await m(
    l("workspace/canvas_execution"),
    "get",
    {
      project_id: e.projectId,
      execution_id: t,
      request_id: t > 0 ? "" : r,
      run_id: t > 0 || r ? 0 : o
    },
    { reportError: !1 }
  );
  return g(s, "读取画布运行详情失败");
}
async function zo(e) {
  const t = await m(l("run/approval"), "post", {
    project_id: e.projectId,
    run_id: e.runId,
    request_id: e.requestId,
    node_key: e.nodeKey,
    approval_id: e.approvalId || 0,
    data: e.feedback || {},
    decision: e.decision || "approved",
    comment: e.comment || ""
  });
  return M(t, "继续画布运行失败");
}
async function Po(e) {
  const t = await m(
    l("run/status"),
    "get",
    {
      project_id: e.projectId,
      run_id: e.runId || 0,
      request_id: e.requestId || "",
      view: "summary"
    },
    { reportError: e.reportError }
  );
  return M(t, "读取流程状态失败");
}
async function Oo(e) {
  const t = await m(
    l("run/stop"),
    "post",
    {
      project_id: e.projectId,
      run_id: e.runId || 0,
      request_id: e.requestId || ""
    },
    { reportError: e.reportError }
  );
  return g(t, "停止画布运行失败");
}
async function xo(e, t) {
  const r = await m(
    l("workspace/canvas_stop_all"),
    "post",
    { project_id: e, canvas_id: t }
  ), o = g(r, "停止全部画布运行失败");
  return {
    count: Number(o.count || 0),
    stoppedCount: Number(o.stopped_count || 0),
    failedCount: Number(o.failed_count || 0),
    items: Array.isArray(o.items) ? o.items : []
  };
}
async function Bo(e) {
  const t = await m(l("run/interaction"), "post", {
    project_id: e.projectId,
    run_id: e.runId,
    node_run_id: e.nodeRunId || 0,
    interaction_id: e.interactionId,
    data: e.data
  });
  return M(t, "提交信息失败");
}
async function qo(e) {
  const t = await m(
    l("project/update_asset_version"),
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
  return P(
    t,
    "保存资产版本失败",
    "资产版本保存结果为空"
  );
}
async function Vo(e) {
  const t = await m(
    l("project/restore_asset_version"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      request_id: e.requestId,
      node_key: e.nodeKey
    }
  );
  return P(
    t,
    "恢复资产版本失败",
    "资产版本恢复结果为空"
  );
}
async function Fo(e) {
  const t = await m(
    l("project/confirm_storyboard"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      production_plan: e.productionPlan
    }
  );
  return P(t, "确认分镜失败", "确认分镜结果为空");
}
async function Ko(e) {
  const t = await m(
    l("project/create_storyboard_revision"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      request_id: e.requestId,
      node_key: e.nodeKey
    }
  );
  return P(
    t,
    "创建分镜修订稿失败",
    "创建分镜修订稿结果为空"
  );
}
async function Lo(e) {
  const t = e.storyboard.shots.findIndex(
    (i) => i.id === e.shotId
  );
  if (t < 0)
    throw new Error("目标镜头不存在");
  const r = await m(
    l("project/generate_storyboard_shot"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      flow_id: e.flowId,
      asset_cate_id: e.assetCateId,
      request_id: e.requestId,
      node_key: e.nodeKey,
      node_name: e.nodeName,
      power_id: e.powerId,
      power_key: e.powerKey,
      source_target_id: e.sourceTargetId,
      params: e.params,
      storyboard: e.storyboard,
      shot_id: e.shotId,
      instruction: e.instruction
    }
  ), o = g(r, "生成镜头失败"), s = at(o, t);
  if (!s || s.shot.id !== e.shotId)
    throw new Error("生成镜头结果格式无效");
  return s;
}
async function Wo(e) {
  const t = await m(
    l("project/asset_detail"),
    "get",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      current_only: e.currentOnly ? 1 : 0
    },
    { reportError: e.reportError }
  ), r = g(t, "读取资产详情失败"), o = r.asset;
  if (!o)
    throw new Error("资产详情为空");
  const s = Z(r.versions);
  return {
    asset: H(o),
    versions: s,
    versionTotal: Number(r.version_total || s.length),
    hasMore: !!r.has_more
  };
}
async function Go(e) {
  const t = await m(
    l("project/asset_versions"),
    "get",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      page: e.page,
      page_size: e.pageSize || 20
    },
    { reportError: e.reportError }
  ), r = g(t, "读取资产版本失败"), o = Z(r.items);
  return {
    items: o,
    page: Number(r.page || e.page || 1),
    pageSize: Number(r.page_size || e.pageSize || 20),
    total: Number(r.total || o.length),
    hasMore: !!r.has_more
  };
}
async function $o(e) {
  const t = await m(
    l("project/asset_version_detail"),
    "get",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId
    },
    { reportError: e.reportError }
  ), r = g(t, "读取历史版本失败").version, o = Y(
    r && typeof r == "object" && !Array.isArray(r) ? r : {}
  );
  if (!o?.id)
    throw new Error("历史版本内容为空");
  return o;
}
function Ir(e) {
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
async function Pe(e, t) {
  const r = await m(l("project/save_asset"), "post", {
    ...Ir(t),
    role: e
  });
  return P(r, "保存资产失败", "保存资产结果为空");
}
function Uo(e) {
  return Pe("work", e);
}
function Ho(e) {
  return Pe("material", e);
}
async function Yo(e) {
  const t = await m(
    l("workspace/canvas"),
    "post",
    {
      project_id: e.projectId,
      canvas_id: e.canvasId,
      asset_cate_id: e.assetCateId,
      canvas: ze(e.canvas)
    },
    // 保存状态、首次失败和重试由 useCanvasAutosave 统一处理。
    { reportError: !1 }
  ), r = g(t, "保存画布失败");
  return {
    canvasId: Number(r.canvas_id || e.canvasId || 0),
    assetCateId: Number(r.asset_cate_id || e.assetCateId || 0),
    updatedAt: String(r.updated_at || e.canvas.updatedAt || "")
  };
}
function br(e) {
  const t = I(e) ? e : {}, r = I(t.power) ? t.power : {}, o = I(r.output) ? r.output : {}, s = kr(
    t.storyboard_work_types
  ), i = Nr(
    t.storyboard_reference_purposes,
    s
  ), n = it(
    t.storyboard_min_shot_durations
  ), u = String(r.output_type || r.outputType || "").trim(), c = String(
    o.view_mode || o.viewMode || ""
  ).trim();
  if ((u === "storyboard" || c === "storyboard") && (s.length === 0 || i.length === 0 || n.length === 0))
    throw new Error("分镜作品类型、参考用途或最短时长注册信息缺失");
  const p = new Set(
    i.map((f) => f.key)
  );
  if (s.some(
    (f) => f.required_reference_purposes.some(
      (y) => !p.has(y)
    )
  ))
    throw new Error("分镜作品类型引用了未知的参考用途");
  return {
    ...t,
    sources: Cr(t.sources),
    params: Array.isArray(t.params) ? t.params : [],
    selected_target_id: Number(t.selected_target_id || 0),
    source_rule: Number(t.source_rule || 0),
    primary_param_key: String(t.primary_param_key || ""),
    storyboard_work_types: s,
    storyboard_reference_purposes: i,
    storyboard_min_shot_durations: n
  };
}
function Cr(e) {
  return Array.isArray(e) ? e.map((t) => {
    const r = I(t) ? t : {}, o = I(r.supported_options) ? Object.fromEntries(
      Object.entries(r.supported_options).map(([s, i]) => [s.trim(), T(i)]).filter(([s, i]) => s !== "" && i.length > 0)
    ) : void 0;
    return {
      ...r,
      supported_options: o && Object.keys(o).length > 0 ? o : void 0
    };
  }) : [];
}
const Sr = /* @__PURE__ */ new Set(["image", "video", "audio"]), vr = /* @__PURE__ */ new Set([
  "global",
  "material",
  "shot",
  "composition",
  "context"
]);
function kr(e) {
  if (!Array.isArray(e))
    return [];
  const t = /* @__PURE__ */ new Set();
  return e.map((r) => {
    const o = I(r) ? r : {}, s = String(o.key || "").trim().toLowerCase();
    if (!$(s) || t.has(s))
      throw new Error("分镜作品类型注册信息无效");
    const i = Number(o.sort || 0);
    if (!Number.isInteger(i))
      throw new Error("分镜作品类型注册信息无效");
    return t.add(s), {
      key: s,
      name: String(o.name || "").trim() || s,
      sort: i,
      required_reference_purposes: T(
        o.required_reference_purposes
      )
    };
  }).sort((r, o) => r.sort - o.sort);
}
function Nr(e, t) {
  if (!Array.isArray(e))
    return [];
  const r = new Set(t.map((s) => s.key)), o = /* @__PURE__ */ new Set();
  return e.map((s) => {
    const i = I(s) ? s : {}, n = String(i.key || "").trim(), u = T(i.media_kinds), c = String(
      i.scope || ""
    ).trim(), p = T(
      i.work_types
    ), f = T(
      i.default_media_kinds
    ), y = String(i.material_type || "").trim(), h = Number(i.max_count || 0), b = Number(i.sort || 0);
    if (!n || o.has(n) || u.length === 0 || u.some(
      (k) => !Sr.has(k)
    ) || !vr.has(c) || p.some((k) => !r.has(k)) || f.some((k) => !u.includes(k)) || c === "material" && y !== "character" && y !== "scene" && y !== "prop" || c !== "material" && y || !Number.isInteger(h) || h < 0 || !Number.isInteger(b))
      throw new Error("分镜参考用途注册信息无效");
    return o.add(n), {
      key: n,
      name: String(i.name || "").trim() || n,
      media_kinds: u,
      work_types: p,
      scope: c,
      material_type: y,
      default_media_kinds: f,
      max_count: h,
      sort: b
    };
  }).sort((s, i) => s.sort - i.sort);
}
function T(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
const Oe = yt(
  null
);
function Zo({
  root: e,
  children: t,
  rootMargin: r = "0px"
}) {
  const o = F(/* @__PURE__ */ new Map()), s = F(null), i = ft(
    () => ({
      observe(n, u) {
        return o.current.set(n, u), s.current?.observe(n), () => {
          s.current?.unobserve(n), o.current.delete(n);
        };
      }
    }),
    []
  );
  return Ie(() => {
    const n = new IntersectionObserver(
      (u) => {
        for (const c of u)
          o.current.get(c.target)?.(
            c.isIntersecting && c.intersectionRatio > 0
          );
      },
      { root: e.current, rootMargin: r }
    );
    s.current = n;
    for (const u of o.current.keys())
      n.observe(u);
    return () => {
      n.disconnect(), s.current = null;
    };
  }, [e, r]), /* @__PURE__ */ dt(Oe.Provider, { value: i, children: t });
}
function Xo(e = !0) {
  const t = gt(Oe), r = F(null), [o, s] = ht(!1);
  return Ie(() => {
    if (!(!r.current || !t))
      return t.observe(r.current, (i) => {
        (i || !e) && s(i);
      });
  }, [t, e]), { ref: r, visible: o };
}
const xe = v(() => import("./space-agent-tools-jTTDJr3I.js")), X = v(() => import("./space-asset-tools-B7H5tZg6.js")), Ar = C(
  xe,
  (e) => e.AgentInteractionPanel
), Jo = Ar.Component, Be = C(
  v(() => import("./protected-6-nodes-body-work-space-space-add-node-menu-tsx-BMOUWaRh.js")),
  (e) => e.AddNodeMenu
), Qo = Be.Component, es = Be.preload, qe = C(
  X,
  (e) => e.AssetBrowser
), ts = qe.Component, rs = qe.preload, Ve = C(
  X,
  (e) => e.AssetDetailDialog
), os = Ve.Component, ss = Ve.preload, Fe = C(
  X,
  (e) => e.AssetPickerDialog
), ns = Fe.Component, is = Fe.preload, Ke = C(
  v(() => import("./space-run-history-DWn1urmD.js")),
  (e) => e.CanvasRunHistoryDrawer
), as = Ke.Component, ds = Ke.preload, Dr = C(
  v(() => import("./protected-4-nodes-body-work-space-space-canvas-switcher-tsx-yUY8Lz0g.js")),
  (e) => e.SpaceCanvasManagerDialog
), cs = Dr.Component, Rr = C(
  v(() => import("./protected-2-nodes-body-work-space-space-param-binding-dialog-tsx-CIoFyW4n.js")),
  (e) => e.CanvasParamBindingDialog
), us = Rr.Component, Le = C(
  v(() => import("./space-assistant-BRJjTrqj.js")),
  (e) => e.SpaceAssistant
), ps = Le.Component, _s = Le.preload, jr = C(
  xe,
  (e) => e.CanvasAgentResultContent
), ls = jr.Component, We = C(
  v(() => import("./node-detail-dialog-BWKh5RNE.js")),
  (e) => e.NodeDetailDialog
), ms = We.Component, fs = We.preload, Ge = C(
  v(() => import("./space-node-settings-kGcAqvc9.js")),
  (e) => e.CanvasNodeSettings
), ys = Ge.Component, gs = Ge.preload, Mr = C(
  v(() => import("./space-storyboard-node-DlsMMZZ0.js")),
  (e) => e.StoryboardNodeContent
), hs = Mr.Component, Er = C(
  v(() => import("./space-storyboard-confirm-dialog-BCK332X_.js").then((e) => e.a)),
  (e) => e.StoryboardConfirmDialog
), ws = Er.Component, Tr = C(
  v(() => import("./space-video-compose-view-CPjlzUmQ.js")),
  (e) => e.VideoComposeView
), Is = Tr.Component, zr = C(
  v(() => import("./writing-preview-D7N53DW3.js")),
  (e) => e.WritingPreview
), bs = zr.Component;
export {
  ts as $,
  mo as A,
  Ct as B,
  ys as C,
  Do as D,
  Io as E,
  co as F,
  Et as G,
  uo as H,
  po as I,
  _o as J,
  lo as K,
  io as L,
  eo as M,
  No as N,
  bo as O,
  fo as P,
  is as Q,
  Tt as R,
  Mo as S,
  ao as T,
  ds as U,
  cs as V,
  ps as W,
  _s as X,
  as as Y,
  rs as Z,
  ns as _,
  Zo as a,
  ws as a0,
  Qo as a1,
  ms as a2,
  os as a3,
  Bo as a4,
  zo as a5,
  jo as a6,
  ss as a7,
  fs as a8,
  Ce as a9,
  bs as aA,
  Is as aB,
  hs as aC,
  ls as aD,
  jt as aE,
  To as aF,
  Po as aG,
  so as aa,
  Jr as ab,
  to as ac,
  oo as ad,
  no as ae,
  us as af,
  ie as ag,
  Ao as ah,
  ko as ai,
  vo as aj,
  So as ak,
  Co as al,
  Ho as am,
  Jo as an,
  Fo as ao,
  Xr as ap,
  Eo as aq,
  Dt as ar,
  Uo as as,
  It as at,
  ro as au,
  xo as av,
  Oo as aw,
  es as ax,
  wo as ay,
  dr as az,
  Wo as b,
  be as c,
  Ko as d,
  $o as e,
  Ro as f,
  Lo as g,
  Go as h,
  ho as i,
  yo as j,
  go as k,
  H as l,
  $r as m,
  Xt as n,
  Ur as o,
  gs as p,
  Hr as q,
  Vo as r,
  qo as s,
  Yr as t,
  Xo as u,
  Yo as v,
  Zr as w,
  Qr as x,
  ar as y,
  Rt as z
};
