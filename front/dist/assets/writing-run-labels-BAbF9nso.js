import { a as X, b as O, h as V, d as K } from "./file-kind-Cq3pESGF.js";
import { n as Qe } from "./power-icon-cYmAJUbk.js";
import { ai as d, M as E, w as ge, $ as et, ab as Ne, k as j, a2 as z } from "./asset-audio-preview-Cezm24us.js";
import { a4 as Ae, a5 as Re, T as Ee, a6 as pe, a7 as je, a8 as xe, V as Te, a9 as ze, W as Me, p as tt, i as rt, aa as st, ab as ot } from "./asset-preview-Bb3VoJnt.js";
import { F as nt, n as De, a5 as it, a6 as at, y as Oe, $ as qe, a7 as ct, E as dt } from "./node-detail-header-Cn59agL3.js";
import { r as Pe, k as $e, j as ut, l as _t } from "./space-assistant-layout-Drz4je9C.js";
import { i as pt, $ as he, aa as lt, ab as ft, a6 as we, k as Ie, a7 as mt, A as yt, B as ae, ac as gt, G as ht, S as wt, T as It, x as bt, I as St, P as kt, O as vt, ad as Ct, ae as Nt } from "./writing-reference-Bgk4pNta.js";
import { v as W, s as R } from "./site-config-CGpZr2qF.js";
import { h as At } from "./interaction-DQ3mGSoD.js";
const Rt = { width: 720, height: 420 }, Jr = { width: 360, height: 240 }, Qr = { width: 2400, height: 1600 }, Fe = 48, G = 16;
function Et(e, t) {
  return e.filter((r) => r.groupId === t);
}
function es(e, t) {
  const r = e.find((s) => s.id === t);
  return r ? r.type === "group" ? Et(e, r.id) : [r] : [];
}
function ts(e, t) {
  return !(!e || !t || e.id === t.id || e.type === "group" && t.groupId === e.id || t.type === "group" && e.groupId === t.id || e.groupId !== t.groupId && t.type !== "group" && t.groupId);
}
function rs(e, t, r) {
  const s = e.find((n) => n.id === t);
  if (!s || s.x === r.x && s.y === r.y)
    return e;
  const o = r.x - s.x, i = r.y - s.y;
  return e.map((n) => n.id === t ? { ...n, ...r } : s.type === "group" && n.groupId === s.id ? {
    ...n,
    x: n.x + o,
    y: n.y + i
  } : n);
}
function ss(e, t, r) {
  const s = e.find((_) => _.id === t), o = s ? Ve(e, s) : void 0;
  if (!s || !o)
    return r;
  const i = be(
    r.x,
    o.x + G,
    o.x + o.width - G - s.width
  ), n = be(
    r.y,
    o.y + Fe,
    o.y + o.height - G - s.height
  );
  return i === r.x && n === r.y ? r : { x: i, y: n };
}
function os(e, t, r) {
  const s = e.find((n) => n.id === t);
  if (!s || s.type === "group" || Ve(e, s))
    return e;
  const o = { ...s, ...r }, i = Tt(e, o);
  return (s.groupId || "") === i ? e : e.map(
    (n) => n.id === t ? { ...n, groupId: i || void 0 } : n
  );
}
function jt(e) {
  const t = /* @__PURE__ */ new Map();
  for (const o of e)
    o.type === "group" && o.group?.origin === "script" && t.set(o.id, o.group.sourceNodeId || "");
  if (t.size === 0) return e;
  let r = !1;
  const s = e.map((o) => {
    const i = t.get(o.groupId || "");
    return i === void 0 || o.storyboardItem?.sourceNodeId === i ? o : (r = !0, { ...o, groupId: void 0 });
  });
  return r ? s : e;
}
function xt(e, t) {
  const r = new Map(e.map((i) => [i.id, i])), s = /* @__PURE__ */ new Set(), o = [];
  for (const i of t) {
    const n = i.logicalFrom || i.from, _ = i.logicalTo || i.to, c = r.get(n), u = r.get(_);
    if (!c || !u)
      continue;
    const l = c.groupId !== u.groupId, f = l && c.type !== "group" && c.groupId ? c.groupId : c.id, g = l && u.type !== "group" && u.groupId ? u.groupId : u.id;
    if (!f || !g || f === g)
      continue;
    const k = `${n}\0${_}\0${nt(i)}`;
    s.has(k) || (s.add(k), o.push({ ...i, from: f, to: g, logicalFrom: n, logicalTo: _ }));
  }
  return o;
}
function Tt(e, t) {
  const r = t.x + t.width / 2, s = t.y + t.height / 2;
  return e.filter(
    (i) => i.type === "group" && i.group?.origin !== "script" && i.id !== t.id && r >= i.x + G && r <= i.x + i.width - G && s >= i.y + Fe && s <= i.y + i.height - G
  ).sort(
    (i, n) => i.width * i.height - n.width * n.height
  )[0]?.id || "";
}
function Ve(e, t) {
  if (!(!t.groupId || t.type === "group"))
    return e.find(
      (r) => r.id === t.groupId && r.type === "group" && r.group?.origin === "script"
    );
}
function be(e, t, r) {
  return Math.min(Math.max(e, t), Math.max(t, r));
}
const ce = {
  id: 0,
  team_id: 0,
  name: "自由",
  kind: "richtext",
  cardinality: "multiple",
  status: 1,
  sort: 0,
  virtual: !0
}, zt = { width: 180, height: 180 }, Mt = { width: 240, height: 160 }, Se = { width: 620, height: 360 }, de = { width: 800, height: 460 }, ke = { width: 560, height: 520 };
function Dt(e) {
  const t = h(e);
  return {
    project: Kt(t.project),
    team: Gt(t.team),
    release: Wt(t.release),
    assetCates: M(t.asset_cates).map(Lt),
    flows: M(t.flows).map(Yt),
    canvasList: M(t.canvas_list).map(oe),
    canvases: Ht(t.canvas),
    assets: M(h(t.assets).items).map(Ue),
    assistant: Ot(t.assistant),
    initialCanvasId: d(t.active_canvas_id),
    initialAssetCateId: d(t.active_asset_cate_id)
  };
}
function oe(e) {
  const t = h(e);
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
function Ot(e) {
  const t = h(e);
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
function ns(e, t = 0, r = "第一幕") {
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
function le(e, t = 0) {
  const r = h(e), s = d(
    E(r.asset_cate_id, t)
  ), o = M(r.nodes).map(Jt).filter((_) => !!_), i = jt(o), n = M(r.edges).map(pr).filter((_) => !!_);
  return qt({
    id: d(r.id),
    name: a(r.name) || "第一幕",
    sort: d(r.sort),
    status: d(r.status) || 1,
    assetCateId: s,
    nextNodeNo: Math.max(1, d(r.next_node_no)),
    nodes: i,
    edges: i === o ? n : xt(i, n),
    viewport: lr(r.viewport),
    updatedAt: a(r.updated_at)
  });
}
function qt(e) {
  let t = Pt(e.nodes, e.nextNodeNo), r = t !== e.nextNodeNo;
  const s = e.nodes.map((o) => {
    if (!$t(o) || Number(o.nodeNo || 0) > 0)
      return o;
    const i = t++, n = o.titleMode || "manual";
    return r = !0, {
      ...o,
      nodeNo: i,
      titleMode: n,
      ...n === "auto" && !o.storyboardItem ? { title: Be(o, i) } : {}
    };
  });
  return r ? { ...e, nextNodeNo: t, nodes: s } : e;
}
function Pt(e, t = 1) {
  return Math.max(
    1,
    Number(t || 1),
    ...e.map((r) => Number(r.nodeNo || 0) + 1)
  );
}
function $t(e) {
  return e.type === "power" || e.type === "agent" || e.type === "flow";
}
function Be(e, t) {
  let r = "节点";
  return e.type === "power" ? r = e.power?.name.trim() || Ke(e) : e.type === "agent" ? r = String(e.role?.name || "智能体").trim() || "智能体" : e.type === "flow" && (r = String(e.flow?.name || "流程").trim() || "流程"), `${r}-${t}`;
}
function is(e) {
  const t = Number(e.nodeNo || 0);
  if (t <= 0)
    return !1;
  const r = e.title.trim();
  return r === Be(e, t).trim() ? !0 : e.type === "power" && r === `${Ke(e)}-${t}`.trim();
}
function Ke(e) {
  const t = Pe(
    e.power,
    e.kind,
    e.outputType
  );
  return t.outputType !== "general" && t.outputName || t.kindName;
}
function Ft(e) {
  const t = h(e);
  return {
    roles: M(t.roles).map(Ut),
    powers: M(t.powers).map(Ge),
    powerCategories: M(t.power_cates).map(Qe),
    powerKinds: M(t.power_kinds).map(Zt),
    outputTypes: M(t.output_types).map(Le)
  };
}
function fe(e) {
  return Ue(h(e));
}
function Vt(e) {
  return e.assetCates.length > 0 ? e.assetCates : [ce];
}
function as(e) {
  return Vt(e)[0]?.id ?? 0;
}
function Bt(e, t) {
  const r = e.length > 0 ? e : [ce];
  return r.find((s) => s.id === t) || r[0] || ce;
}
function cs(e, t) {
  return Bt(e.assetCates, t);
}
function ds(e, t) {
  return t === 0 ? e.flows.slice(0, 4) : e.flows.filter((r) => fr(r).has(t)).slice(0, 4);
}
function us(e) {
  return e.create_status !== 2;
}
function _s(e) {
  return e.createStatus !== 2;
}
function ps(e, t, r, s, o) {
  const i = s?.x ?? 420 + r % 3 * 190, n = s?.y ?? 610 + Math.floor(r / 3) * 170, _ = o?.asset, c = o?.flow, u = o?.functionOption, l = o?.power, f = o?.role, g = l ? Pe(l) : null, k = Number(_?.asset_cate_id || t.id), S = {
    asset: [
      _?.name || "资产引用",
      _ ? ge(_.kind) : ge(t.kind),
      _ && et(_.version?.content) || "引用已有资产，作为其他节点的上下文。"
    ],
    power: [
      l?.name || mr(t.kind),
      g?.outputName || g?.kindName || "能力节点",
      l ? `调用 ${l.name} 能力，按参数生成内容。` : "输入提示词和参数，直接生成文本、图片、视频或音频。"
    ],
    agent: [
      f?.name || "智能体节点",
      f?.role_type || "角色执行",
      f?.assignment || "调用团队角色或指定智能体完成一段任务。"
    ],
    flow: [
      c?.name || "流程节点",
      "团队流程",
      c?.goal || "执行一组团队预设流程。"
    ],
    function: [
      u?.label || "保存节点",
      "功能",
      u?.description || "开始、引用、保存、展示等功能节点。"
    ],
    group: [
      "未命名分组",
      "分组",
      "拖入节点后，可统一接收上下文并执行组内节点。"
    ]
  }, [T, p, y] = S[e], A = Ze(e, l);
  return {
    id: `local-${e}-${Date.now()}-${r}`,
    type: e,
    title: T,
    titleMode: e === "power" || e === "agent" || e === "flow" ? "auto" : void 0,
    subtitle: p,
    description: y,
    x: i,
    y: n,
    width: A.width,
    height: A.height,
    assetCateId: k,
    kind: _?.kind || l?.kind || t.kind,
    outputType: l?.outputType,
    cardinality: t.cardinality,
    asset: _,
    flow: c,
    functionOption: u,
    power: l,
    role: f,
    group: e === "group" ? { origin: "manual" } : void 0,
    local: !0
  };
}
function Kt(e) {
  const t = h(e), r = h(t.team);
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
function Gt(e) {
  const t = h(e);
  return {
    id: d(t.id),
    name: a(t.name) || "自由团队",
    description: a(t.description)
  };
}
function Wt(e) {
  const t = h(e);
  return {
    id: d(t.id),
    team_id: d(t.team_id),
    version: d(t.version),
    status: a(t.status)
  };
}
function Lt(e) {
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
function Ut(e) {
  return {
    id: d(e.id),
    team_id: d(e.team_id),
    role_type: a(e.role_type),
    role_key: a(e.role_key),
    name: a(e.name),
    agent_id: d(e.agent_id),
    assignment: a(e.assignment),
    create_status: We(e.create_status)
  };
}
function Yt(e) {
  return {
    id: d(e.id),
    name: a(e.name),
    key: a(e.key),
    goal: a(e.goal),
    config: h(e.config),
    status: d(e.status),
    sort: d(e.sort),
    output_asset_cate_ids: He(e.output_asset_cate_ids)
  };
}
function Ge(e) {
  const t = a(e.kind) || "text", r = Le(h(e.output)), s = a(e.output_type) || "general";
  return {
    id: d(e.id),
    cate_id: d(e.cate_id),
    name: a(e.name) || a(e.key) || "未命名能力",
    key: a(e.key),
    icon: a(e.icon),
    description: a(e.description),
    outputType: s,
    output: r.key ? r : void 0,
    kind: t,
    createStatus: We(e.create_status)
  };
}
function We(e) {
  return Number(e) === 2 ? 2 : 1;
}
function Le(e) {
  return {
    key: a(e.key),
    name: a(e.name),
    allowedKinds: re(e.allowed_kinds),
    viewMode: a(e.view_mode),
    defaultWidth: d(e.default_width),
    defaultHeight: d(e.default_height),
    structured: !!e.structured,
    sort: d(e.sort)
  };
}
function Zt(e) {
  return {
    id: a(e.id),
    value: a(e.value) || a(e.name) || a(e.id)
  };
}
function Ue(e) {
  const t = me(h(e.version)), r = ye(e.versions);
  return {
    id: d(e.id),
    project_id: d(E(e.project_id, e.projectID)),
    body_id: d(E(e.body_id, e.bodyID)),
    team_id: d(E(e.team_id, e.teamID)),
    flow_id: d(E(e.flow_id, e.flowID)),
    canvas_id: d(E(e.canvas_id, e.canvasID)),
    asset_cate_id: d(
      E(e.asset_cate_id, e.assetCateID)
    ),
    node_key: a(E(e.node_key, e.nodeKey)),
    name: a(e.name),
    kind: a(e.kind) || "text",
    role: a(e.role),
    version_id: d(E(e.version_id, e.versionID)),
    status: a(e.status),
    sort: d(e.sort),
    created_at: a(E(e.created_at, e.createdAt)),
    version: t,
    versions: r.length ? r : void 0
  };
}
function me(e) {
  const t = d(e.id);
  if (!(!t && e.content == null))
    return {
      id: t,
      asset_id: d(E(e.asset_id, e.assetID)),
      run_id: d(E(e.run_id, e.runID)),
      node_run_id: d(E(e.node_run_id, e.nodeRunID)),
      release_id: d(E(e.release_id, e.releaseID)),
      request_id: a(E(e.request_id, e.requestID)),
      node_key: a(E(e.node_key, e.nodeKey)),
      source: h(e.source),
      version: d(e.version),
      summary: a(e.summary),
      content: e.content,
      created_at: a(E(e.created_at, e.createdAt)),
      updated_at: a(E(e.updated_at, e.updatedAt))
    };
}
function ye(e) {
  return M(e).map(me).filter((t) => !!t);
}
function Ht(e) {
  const t = h(e), r = {};
  for (const [s, o] of Object.entries(t)) {
    const i = le(o), n = i.id || d(s);
    n > 0 && (r[String(n)] = { ...i, id: n });
  }
  return r;
}
function Xt(e, t) {
  const r = new Map(
    t.filter((o) => o.id > 0).map((o) => [o.id, o])
  ), s = new Map(
    t.filter((o) => o.key).map((o) => [o.key, o])
  );
  for (const o of Object.values(e))
    o.nodes = o.nodes.map((i) => {
      if (i.type !== "power" || !i.power)
        return i;
      const n = r.get(Number(i.power.id || 0)) || s.get(i.power.key);
      if (!n)
        return i;
      const _ = i.outputType || i.power.outputType || n.outputType;
      return {
        ...i,
        outputType: _,
        power: {
          ...n,
          outputType: _,
          output: n.outputType === _ ? n.output : i.power.output
        }
      };
    });
  return e;
}
function ls(e, t) {
  const r = String(e.id);
  return Xt({ [r]: e }, t)[r];
}
function Jt(e) {
  const t = a(e.id), r = a(e.type);
  if (!t || !r)
    return null;
  const s = a(e.run_error), o = a(e.title), i = at(
    e.function_option,
    o
  ), n = a(e.description), _ = i?.key === "import", c = {
    id: t,
    nodeNo: d(e.node_no) || void 0,
    type: r,
    title: _ && o === "导入" ? "引用" : o,
    titleMode: a(e.title_mode) === "manual" ? "manual" : a(e.title_mode) === "auto" ? "auto" : void 0,
    subtitle: a(e.subtitle),
    description: _ && (!n || n === "导入资产并连接到当前节点。") ? "选择资产并引用到当前节点。" : n,
    x: d(e.x),
    y: d(e.y),
    width: d(e.width),
    height: d(e.height),
    groupId: a(e.group_id),
    group: er(e.group),
    storyboardItem: tr(e.storyboard_item),
    storyboardMaterializedSignature: a(
      e.storyboard_materialized_signature
    ),
    storyboardFramePlanVersion: Ee(
      e.storyboard_frame_plan_version
    ),
    assetCateId: d(e.asset_cate_id),
    outputType: a(e.output_type),
    count: e.count == null ? void 0 : d(e.count),
    functionOption: i,
    composerDraft: dr(e.composer_draft),
    resultRef: _r(e.result_ref),
    runTiming: qe(e.run_timing),
    resultOutput: e.result_output,
    resultView: Qt(e.result_view),
    runError: Oe(s) ? "" : s,
    local: e.local !== !1
  }, u = a(e.kind), l = a(
    e.cardinality
  ), f = rr(e.flow), g = sr(e.role), k = or(e.asset), S = nr(e.power);
  return u && (c.kind = u), l && (c.cardinality = l), f && (c.flow = f), g && (c.role = g), k && (c.asset = k), S && (c.power = S, c.outputType = c.outputType || S.outputType, $e(S) && c.width === Se.width && c.height === Se.height && (c.width = de.width, c.height = de.height)), c;
}
function Qt(e) {
  const t = h(e), r = z(t.width), s = z(t.height);
  if (r == null || s == null || r <= 0 || s <= 0)
    return;
  const o = z(t.offset_x), i = z(t.offset_y);
  return {
    width: r,
    height: s,
    ...o == null ? {} : { offsetX: o },
    ...i == null ? {} : { offsetY: i }
  };
}
function er(e) {
  const t = h(e);
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
function tr(e) {
  const t = h(e), r = a(t.source_node_id), s = a(t.item_type), o = a(t.item_id);
  if (!r || !o || ![
    "character",
    "scene",
    "prop",
    "shot_image",
    "shot",
    "speech",
    "subtitle",
    "video_compose"
  ].includes(s))
    return;
  const i = j(t.generated_inputs) ? {
    referenceContent: ue(
      t.generated_inputs.reference_content
    ),
    visualContext: typeof t.generated_inputs.visual_context == "string" ? t.generated_inputs.visual_context : void 0,
    voice: typeof t.generated_inputs.voice == "string" ? t.generated_inputs.voice : void 0
  } : void 0;
  return {
    sourceNodeId: r,
    itemType: s,
    itemId: o,
    generatedPrompt: a(t.generated_prompt),
    generatedInputs: i,
    dependencyNodeIds: re(t.dependency_node_ids),
    referenceNodeIds: re(t.reference_node_ids),
    externalReferenceAssetIds: He(t.external_reference_asset_ids),
    shotId: a(t.shot_id),
    shotImageMode: Me(t.shot_image_mode),
    frameRole: ze(t.frame_role),
    frameMediaItems: Te(t.frame_media_items),
    imageSequenceFrames: xe(
      t.image_sequence_frames
    ),
    speechId: a(t.speech_id),
    speechIds: re(t.speech_ids),
    characterId: a(t.character_id),
    speechKind: a(t.speech_kind),
    speakerMode: a(t.speaker_mode),
    startTime: z(t.start_time),
    shotDuration: z(t.shot_duration),
    requiredDurationValues: je(
      t.required_duration_values
    ),
    continuityAnchor: a(t.continuity_anchor),
    sharedEndShotId: a(t.shared_end_shot_id),
    sharedStartShotId: a(t.shared_start_shot_id),
    optional: t.optional === !0 || t.optional === 1 || String(t.optional || "").toLowerCase() === "true"
  };
}
function rr(e) {
  const t = h(e), r = d(t.id), s = a(t.key), o = a(t.name);
  if (!(!r && !s && !o))
    return {
      id: r,
      key: s,
      name: o,
      goal: a(t.goal)
    };
}
function sr(e) {
  const t = h(e), r = d(t.id), s = a(t.name);
  if (!(!r && !s))
    return {
      id: r,
      name: s,
      role_type: a(t.role_type),
      agent_id: d(t.agent_id)
    };
}
function or(e) {
  const t = h(e), r = d(t.id);
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
function nr(e) {
  const t = h(e), r = d(t.id), s = a(t.key);
  if (!(!r && !s))
    return Ge({
      ...t,
      id: r,
      key: s,
      name: a(t.name)
    });
}
function Ye(e) {
  const t = h(e);
  if (!Object.keys(t).length)
    return;
  const r = a(t.storyboardGridLayout);
  return {
    prompt: a(t.prompt),
    promptContent: ue(t.promptContent),
    paramValues: h(t.paramValues),
    paramBindings: it(t.paramBindings),
    selectedTargetId: d(t.selectedTargetId),
    videoComposition: De(t.videoComposition),
    storyboardReferences: Re(
      t.storyboardReferences
    ),
    storyboardWorkType: ur(t.storyboardWorkType),
    storyboardLyricsSourceNodeId: a(t.storyboardLyricsSourceNodeId),
    minShotDuration: Ae(t.minShotDuration),
    storyboardRangeStartMs: ve(
      t.storyboardRangeStartMs,
      !0
    ),
    storyboardRangeEndMs: ve(
      t.storyboardRangeEndMs,
      !1
    ),
    storyboardGridLayout: r ? Ne(r) : void 0,
    multiImageMode: cr(t.multiImageMode),
    mediaSelections: Object.fromEntries(
      Object.entries(h(t.mediaSelections)).flatMap(([s, o]) => {
        const i = ue(o);
        return i ? [[s, i]] : [];
      })
    )
  };
}
function ir(e) {
  return Ye(e) || {
    prompt: "",
    paramValues: {},
    selectedTargetId: 0
  };
}
function fs(e) {
  const t = ir(e), r = ar(t.promptContent);
  return r ? { ...t, prompt: r } : t;
}
function ms(e) {
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
function ys(e) {
  return JSON.stringify(
    (e?.parts || []).filter((t) => t.type === "reference")
  );
}
function ar(e) {
  return e?.parts?.some((t) => t.type === "reference") ? e.parts.map((t) => {
    if (t.type === "text")
      return t.text;
    const r = String(t.label || "").trim();
    return r.startsWith("@") ? r : `@${r}`;
  }).join("") : "";
}
function cr(e) {
  const t = a(e);
  return t === "per_image" || t === "shared_reference" ? t : void 0;
}
function dr(e) {
  const t = h(e);
  if (Object.keys(t).length)
    return Ye({
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
function ur(e) {
  const t = a(e);
  return pe(t) ? t : void 0;
}
function ve(e, t) {
  const r = z(e);
  if (!(r == null || !Number.isInteger(r) || r < (t ? 0 : 1)))
    return r;
}
function ue(e) {
  const t = h(e), r = Array.isArray(t.parts) ? t.parts.filter((s) => {
    const o = h(s);
    return o.type === "text" || o.type === "reference";
  }) : [];
  if (!(Number(t.version) !== 1 || r.length === 0))
    return { version: 1, parts: r };
}
function _r(e) {
  const t = h(e);
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
function pr(e) {
  const t = a(e.from), r = a(e.to);
  if (!t || !r)
    return null;
  const s = a(e.purpose);
  return {
    id: a(e.id) || `edge-${t}-${r}`,
    from: t,
    to: r,
    logicalFrom: a(e.logical_from) || void 0,
    logicalTo: a(e.logical_to) || void 0,
    purpose: s === "media" || s === "structure" || s === "dependency" ? s : void 0,
    executionMode: a(e.execution_mode) === "manual" ? "manual" : void 0,
    mediaUsage: a(e.media_usage) || void 0
  };
}
function lr(e) {
  const t = h(e), r = {};
  return t.x != null && (r.x = d(t.x)), t.y != null && (r.y = d(t.y)), t.zoom != null && (r.zoom = d(t.zoom)), r;
}
function fr(e) {
  return new Set(e.output_asset_cate_ids);
}
function mr(e) {
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
function Ze(e, t) {
  switch (e) {
    case "agent":
      return { width: 154, height: 154 };
    case "flow":
      return { width: 210, height: 160 };
    case "function":
      return { width: 128, height: 46 };
    case "group":
      return { ...Rt };
    case "power":
      return yr(t);
    default:
      return { width: 250, height: 170 };
  }
}
function yr(e) {
  if (ut(e))
    return gr();
  if (_t(e))
    return { ...Mt };
  if ($e(e))
    return { ...de };
  const t = hr(e);
  return t || { ...zt };
}
function gr(e) {
  return {
    ...ke,
    height: pt(e) ? 210 : ke.height
  };
}
function hr(e) {
  const t = Number(e?.output?.defaultWidth || 0), r = Number(e?.output?.defaultHeight || 0);
  return t > 0 && r > 0 ? { width: t, height: r } : null;
}
function gs(e) {
  const t = Ze(
    e.type,
    e.power || {
      kind: String(e.kind || ""),
      outputType: e.outputType || ""
    }
  );
  return e.width === t.width && e.height === t.height;
}
function re(e) {
  return Array.isArray(e) ? e.map(a).filter(Boolean) : [];
}
function He(e) {
  if (!Array.isArray(e))
    return [];
  const t = [], r = /* @__PURE__ */ new Set();
  for (const s of e) {
    const o = d(s);
    !o || o <= 0 || r.has(o) || (r.add(o), t.push(o));
  }
  return t;
}
function M(e) {
  return Array.isArray(e) ? e.filter(j) : [];
}
function h(e) {
  return j(e) ? e : {};
}
function a(e) {
  return e == null ? "" : String(e).trim();
}
function Xe(e) {
  return {
    asset_cate_id: Number(e.assetCateId || 0),
    next_node_no: Math.max(1, Number(e.nextNodeNo || 1)),
    nodes: e.nodes.map(wr),
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
function wr(e) {
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
  if (H(t, "node_no", e.nodeNo), e.titleMode && (t.title_mode = e.titleMode), x(t, "group_id", e.groupId), e.group) {
    const n = {};
    x(n, "origin", e.group.origin), x(n, "source_node_id", e.group.sourceNodeId), x(n, "sync_key", e.group.syncKey), x(n, "layout_key", e.group.layoutKey), x(n, "visual_mode", e.group.visualMode), x(n, "style_prompt", e.group.stylePrompt), x(n, "aspect_ratio", e.group.aspectRatio), Object.keys(n).length > 0 && (t.group = n);
  }
  if (e.storyboardItem) {
    const n = e.storyboardItem, _ = Me(n.shotImageMode), c = ze(n.frameRole), u = Te(
      n.frameMediaItems
    ), l = xe(
      n.imageSequenceFrames
    ), f = je(
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
          visual_context: n.generatedInputs.visualContext,
          voice: n.generatedInputs.voice
        }
      } : {},
      dependency_node_ids: n.dependencyNodeIds || [],
      reference_node_ids: n.referenceNodeIds || [],
      external_reference_asset_ids: n.externalReferenceAssetIds || [],
      ...n.shotId ? { shot_id: n.shotId } : {},
      ..._ ? { shot_image_mode: _ } : {},
      ...c ? { frame_role: c } : {},
      ...u.length ? {
        frame_media_items: u.map((g) => ({
          frame_role: g.frameRole,
          media_index: g.mediaIndex
        }))
      } : {},
      ...l.length ? { image_sequence_frames: l } : {},
      ...n.speechId ? { speech_id: n.speechId } : {},
      ...n.speechIds?.length ? { speech_ids: n.speechIds } : {},
      ...n.characterId ? { character_id: n.characterId } : {},
      ...n.speechKind ? { speech_kind: n.speechKind } : {},
      ...n.speakerMode ? { speaker_mode: n.speakerMode } : {},
      ...Number.isFinite(n.startTime) ? { start_time: n.startTime } : {},
      ...Number.isFinite(n.shotDuration) ? { shot_duration: n.shotDuration } : {},
      ...f.length > 0 ? { required_duration_values: f } : {},
      ...n.sharedEndShotId ? { shared_end_shot_id: n.sharedEndShotId } : {},
      ...n.sharedStartShotId ? { shared_start_shot_id: n.sharedStartShotId } : {},
      ...n.continuityAnchor ? { continuity_anchor: n.continuityAnchor } : {},
      ...n.optional ? { optional: !0 } : {}
    };
  }
  x(
    t,
    "storyboard_materialized_signature",
    e.storyboardMaterializedSignature
  ), H(
    t,
    "storyboard_frame_plan_version",
    Ee(e.storyboardFramePlanVersion)
  ), H(t, "asset_cate_id", e.assetCateId), x(t, "kind", e.kind), x(t, "output_type", e.outputType), x(t, "cardinality", e.cardinality), H(t, "count", e.count), e.flow && (t.flow = {
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
    output: Sr(e.power.output)
  }), e.functionOption && (t.function_option = {
    key: e.functionOption.key,
    label: e.functionOption.label,
    description: e.functionOption.description
  });
  const r = br(e.composerDraft);
  r && (t.composer_draft = r);
  const s = Nr(e.resultRef);
  s && (t.result_ref = s), e.runTiming?.startedAt && e.runTiming.finishedAt && (t.run_timing = {
    started_at: e.runTiming.startedAt,
    finished_at: e.runTiming.finishedAt
  }), !(Number(s?.asset_id || 0) > 0 && Number(s?.version_id || 0) > 0) && e.resultOutput != null && $(e.resultOutput) && (t.result_output = e.resultOutput);
  const i = Ir(e.resultView);
  return i && (t.result_view = i), Oe(e.runError) || x(t, "run_error", e.runError), e.local != null && (t.local = e.local), t;
}
function Ir(e) {
  if (!e)
    return;
  const t = z(e.width), r = z(e.height);
  if (t == null || r == null || t <= 0 || r <= 0)
    return;
  const s = { width: t, height: r }, o = z(e.offsetX), i = z(e.offsetY);
  return o != null && (s.offset_x = o), i != null && (s.offset_y = i), s;
}
function br(e) {
  if (!j(e))
    return null;
  const t = {};
  x(t, "prompt", e.prompt);
  const r = kr(e.promptContent);
  r && $(r) && (t.prompt_content = r), H(t, "selected_target_id", e.selectedTargetId);
  const s = vr(e.paramValues);
  s && (t.param_values = s);
  const o = ct(e.paramBindings);
  o && (t.param_bindings = o);
  const i = De(e.videoComposition);
  i && $(i) && (t.video_composition = i);
  const n = Re(
    e.storyboardReferences
  );
  n.length > 0 && $(n) && (t.storyboard_references = n), pe(e.storyboardWorkType) && (t.storyboard_work_type = e.storyboardWorkType), x(
    t,
    "storyboard_lyrics_source_node_id",
    e.storyboardLyricsSourceNodeId
  );
  const _ = Ae(e.minShotDuration);
  _ != null && (t.min_shot_duration = _);
  const c = z(e.storyboardRangeStartMs);
  c != null && Number.isInteger(c) && c >= 0 && (t.storyboard_range_start_ms = c);
  const u = z(e.storyboardRangeEndMs);
  return u != null && Number.isInteger(u) && u > 0 && (t.storyboard_range_end_ms = u), e.storyboardGridLayout && (t.storyboard_grid_layout = Ne(
    e.storyboardGridLayout
  )), (e.multiImageMode === "per_image" || e.multiImageMode === "shared_reference") && (t.multi_image_mode = e.multiImageMode), e.mediaSelections && Object.keys(e.mediaSelections).length && (t.media_selections = e.mediaSelections), Object.keys(t).length ? t : null;
}
function Sr(e) {
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
function kr(e) {
  if (!(!j(e) || Number(e.version || 0) !== 1 || !Array.isArray(e.parts)))
    return e;
}
function vr(e) {
  if (!j(e))
    return null;
  const t = {};
  for (const [r, s] of Object.entries(e))
    Cr(s) || $(s) && (t[r] = s);
  return Object.keys(t).length ? t : null;
}
function Cr(e) {
  return j(e) ? !!(e.file || e.blob || e.preview || e.progress != null || e.uploading != null) : !1;
}
function Nr(e) {
  if (!j(e))
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
    const s = e[r];
    s != null && $(s) && (t[r] = s);
  }
  return Object.keys(t).length ? t : null;
}
function x(e, t, r) {
  typeof r == "string" && r.trim() && (e[t] = r);
}
function H(e, t, r) {
  const s = Number(r || 0);
  s > 0 && (e[t] = s);
}
function $(e) {
  return e == null || ["string", "number", "boolean"].includes(typeof e) ? !0 : Array.isArray(e) ? e.every($) : j(e) ? Object.values(e).every($) : !1;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const se = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!se || Object.keys(se).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const w = se.joinSiteApi, I = se.request;
async function hs(e, t = 0, r = 0) {
  const s = await I(w("workspace/bootstrap"), "get", {
    project_id: e,
    canvas_id: t,
    asset_cate_id: r
  });
  return Dt(
    W(s, "加载创作空间失败")
  );
}
async function ws(e) {
  const t = await I(w("workspace/story_setting_image"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    node_id: e.nodeId,
    asset_id: e.assetId,
    version_id: e.versionId,
    request_id: e.requestId
  });
  return L(t, "替换设定形象失败", "替换结果为空");
}
async function Is(e) {
  const t = await I(w("workspace/canvas"), "get", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    asset_cate_id: e.assetCateId || 0
  }), r = R(t, "加载分类画布失败"), s = r.assets || {}, o = Array.isArray(s.items) ? s.items : Array.isArray(s) ? s : [];
  return {
    canvas: le(r.canvas, e.assetCateId || 0),
    assets: o.map(fe),
    canvasList: Array.isArray(r.canvas_list) ? r.canvas_list.map(oe) : []
  };
}
function Q(e) {
  const t = j(e) ? e : {}, r = j(t.canvas) ? t.canvas : null;
  return {
    canvas: r && Array.isArray(r.nodes) ? le(r) : void 0,
    canvasList: Array.isArray(t.canvas_list) ? t.canvas_list.map(oe) : [],
    activeCanvasId: Number(t.active_canvas_id || 0) || void 0
  };
}
async function bs(e) {
  const t = await I(w("workspace/canvas_create"), "post", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId,
    name: e.name || ""
  });
  return Q(
    R(t, "创建画布失败")
  );
}
async function Ss(e) {
  const t = await I(w("workspace/canvas_rename"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    name: e.name
  });
  return Q(
    R(t, "重命名画布失败")
  );
}
async function ks(e) {
  const t = await I(
    w("workspace/canvas_reorder"),
    "post",
    {
      project_id: e.projectId,
      asset_cate_id: e.assetCateId,
      canvas_ids: e.canvasIds
    }
  );
  return Q(
    R(t, "调整画布顺序失败")
  );
}
async function vs(e) {
  const t = await I(w("workspace/canvas_delete"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId
  });
  return Q(
    R(t, "删除画布失败")
  );
}
async function Cs(e) {
  const t = await I(w("workspace/canvas_deleted"), "get", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId
  }), r = R(t, "加载已删除画布失败");
  return Array.isArray(r.items) ? r.items.map(oe) : [];
}
async function Ns(e) {
  const t = await I(
    w("workspace/canvas_restore"),
    "post",
    {
      project_id: e.projectId,
      canvas_id: e.canvasId
    }
  );
  return Q(
    R(t, "恢复画布失败")
  );
}
async function As(e) {
  const t = await I(w("project/canvas_config"), "get", {
    project_id: e
  });
  return Ft(
    W(t, "加载能力列表失败")
  );
}
async function Rs(e) {
  const t = await I(
    w("project/canvas_power_form"),
    "get",
    {
      project_id: e.projectId,
      flow_id: e.flowId || 0,
      power_id: e.powerId,
      power_key: e.powerKey,
      target_id: e.targetId || 0
    }
  );
  return xr(
    W(t, "加载能力参数失败")
  );
}
async function Es(e) {
  const t = Xe(e.canvas), r = e.canvas.nodes.find(
    (c) => c.id === e.startNodeId
  ), s = r?.group?.origin === "script" ? r.group : e.canvas.nodes.find((c) => c.id === r?.groupId)?.group, o = e.executionScope === "storyboard_frame" ? r?.id : r?.storyboardItem?.sourceNodeId || (s?.origin === "script" ? s.sourceNodeId : void 0), i = e.canvas.nodes.find(
    (c) => c.id === o
  ), n = [
    i?.asset?.version?.content,
    i?.resultOutput
  ].find((c) => {
    const u = tt(c);
    return u && rt(u);
  });
  if (n != null) {
    const c = t.nodes.find((u) => u.id === o);
    c && (c.result_output = n);
  }
  const _ = await I(
    w("workspace/canvas_execute"),
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
  return R(_, "画布运行失败");
}
async function js(e) {
  const t = await I(
    w("workspace/canvas_node_title"),
    "post",
    {
      project_id: e.projectId,
      node_key: e.nodeKey,
      version_id: e.versionId,
      prompt: e.prompt || ""
    },
    { reportError: !1 }
  ), r = R(t, "生成节点标题失败");
  return {
    nodeKey: String(r.node_key || e.nodeKey),
    versionId: Number(r.version_id || e.versionId || 0),
    title: String(r.title || "").trim()
  };
}
function L(e, t, r) {
  const s = R(e, t).asset;
  if (!s)
    throw new Error(r);
  return fe(s);
}
async function Ce(e) {
  const t = await I(
    w("workspace/canvas_execution_list"),
    "get",
    {
      project_id: e.projectId,
      canvas_id: e.canvasId || 0,
      scope: e.scope,
      asset_cate_id: e.assetCateId || 0,
      run_ids: (e.runIds || []).filter((s) => s > 0).join(","),
      before_id: e.beforeId || 0,
      limit: e.limit || 20,
      summary_only: e.summaryOnly ? 1 : 0
    },
    // 恢复观察自行重试，历史列表在画布面板显示错误。
    { reportError: !1 }
  ), r = R(t, "读取画布运行记录失败");
  return {
    count: Number(r.count || 0),
    items: Array.isArray(r.items) ? r.items : [],
    hasMore: !!r.has_more,
    beforeId: Number(r.before_id || 0)
  };
}
async function xs(e, t) {
  const r = [...new Set((e.runIds || []).filter((n) => n > 0))], s = [], o = 50;
  if (r.length > 0) {
    for (let n = 0; n < r.length; n += o) {
      t?.throwIfAborted();
      const _ = await Ce({
        ...e,
        runIds: r.slice(n, n + o),
        limit: o
      });
      t?.throwIfAborted(), s.push(..._.items);
    }
    return s;
  }
  let i = e.beforeId || 0;
  for (; ; ) {
    t?.throwIfAborted();
    const n = await Ce({ ...e, beforeId: i, limit: o });
    if (t?.throwIfAborted(), s.push(...n.items), !n.hasMore) return s;
    if (n.beforeId <= 0 || i > 0 && n.beforeId >= i)
      throw new Error("读取画布运行记录的分页位置无效");
    i = n.beforeId;
  }
}
async function Ts(e) {
  const t = Number(e.executionId || 0), r = String(e.requestId || "").trim(), s = Number(e.runId || 0), o = await I(
    w("workspace/canvas_execution"),
    "get",
    {
      project_id: e.projectId,
      execution_id: t,
      request_id: t > 0 ? "" : r,
      run_id: t > 0 || r ? 0 : s
    },
    { reportError: !1 }
  );
  return R(o, "读取画布运行详情失败");
}
async function zs(e) {
  const t = await I(w("run/approval"), "post", {
    project_id: e.projectId,
    run_id: e.runId,
    request_id: e.requestId,
    node_key: e.nodeKey,
    approval_id: e.approvalId || 0,
    data: e.feedback || {},
    decision: e.decision || "approved",
    comment: e.comment || ""
  });
  return W(t, "继续画布运行失败");
}
async function Ar(e) {
  const t = await I(
    w("run/status"),
    "get",
    {
      project_id: e.projectId,
      run_id: e.runId || 0,
      request_id: e.requestId || "",
      view: "summary"
    },
    { reportError: e.reportError }
  );
  return W(t, "读取流程状态失败");
}
async function Rr(e) {
  const t = await I(
    w("run/stop"),
    "post",
    {
      project_id: e.projectId,
      run_id: e.runId || 0,
      request_id: e.requestId || ""
    },
    { reportError: e.reportError }
  );
  return R(t, "停止画布运行失败");
}
async function Ms(e, t) {
  const r = await I(
    w("workspace/canvas_stop_all"),
    "post",
    { project_id: e, canvas_id: t }
  ), s = R(r, "停止全部画布运行失败");
  return {
    count: Number(s.count || 0),
    stoppedCount: Number(s.stopped_count || 0),
    failedCount: Number(s.failed_count || 0),
    items: Array.isArray(s.items) ? s.items : []
  };
}
async function Ds(e) {
  const t = await I(w("run/interaction"), "post", {
    project_id: e.projectId,
    run_id: e.runId,
    node_run_id: e.nodeRunId || 0,
    interaction_id: e.interactionId,
    data: e.data
  });
  return W(t, "提交信息失败");
}
async function Os(e) {
  const t = await I(
    w("project/update_asset_version"),
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
  return L(
    t,
    "保存资产版本失败",
    "资产版本保存结果为空"
  );
}
async function qs(e) {
  const t = await I(
    w("project/restore_asset_version"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      request_id: e.requestId,
      node_key: e.nodeKey
    }
  );
  return L(
    t,
    "恢复资产版本失败",
    "资产版本恢复结果为空"
  );
}
async function Ps(e) {
  const t = await I(
    w("project/confirm_storyboard"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      production_plan: e.productionPlan
    }
  );
  return L(t, "确认分镜失败", "确认分镜结果为空");
}
async function $s(e) {
  const t = await I(
    w("project/create_storyboard_revision"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      request_id: e.requestId,
      node_key: e.nodeKey
    }
  );
  return L(
    t,
    "创建分镜修订稿失败",
    "创建分镜修订稿结果为空"
  );
}
async function Fs(e) {
  const t = e.storyboard.shots.findIndex(
    (i) => i.id === e.shotId
  );
  if (t < 0)
    throw new Error("目标镜头不存在");
  const r = await I(
    w("project/generate_storyboard_shot"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      flow_id: e.flowId,
      canvas_id: e.canvasId,
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
  ), s = R(r, "生成镜头失败"), o = ot(s, t);
  if (!o || o.shot.id !== e.shotId)
    throw new Error("生成镜头结果格式无效");
  return o;
}
async function Er(e) {
  const t = await I(
    w("project/asset_detail"),
    "get",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      current_only: e.currentOnly ? 1 : 0
    },
    { reportError: e.reportError }
  ), r = R(t, "读取资产详情失败"), s = r.asset;
  if (!s)
    throw new Error("资产详情为空");
  const o = ye(r.versions);
  return {
    asset: fe(s),
    versions: o,
    versionTotal: Number(r.version_total || o.length),
    hasMore: !!r.has_more
  };
}
async function Vs(e) {
  const t = await I(
    w("project/asset_versions"),
    "get",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      page: e.page,
      page_size: e.pageSize || 20
    },
    { reportError: e.reportError }
  ), r = R(t, "读取资产版本失败"), s = ye(r.items);
  return {
    items: s,
    page: Number(r.page || e.page || 1),
    pageSize: Number(r.page_size || e.pageSize || 20),
    total: Number(r.total || s.length),
    hasMore: !!r.has_more
  };
}
async function Bs(e) {
  const t = await I(
    w("project/asset_version_detail"),
    "get",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId
    },
    { reportError: e.reportError }
  ), r = R(t, "读取历史版本失败").version, s = me(
    r && typeof r == "object" && !Array.isArray(r) ? r : {}
  );
  if (!s?.id)
    throw new Error("历史版本内容为空");
  return s;
}
function jr(e) {
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
async function Je(e, t) {
  const r = await I(w("project/save_asset"), "post", {
    ...jr(t),
    role: e
  });
  return L(r, "保存资产失败", "保存资产结果为空");
}
function Ks(e) {
  return Je("work", e);
}
function Gs(e) {
  return Je("material", e);
}
async function Ws(e) {
  const t = await I(
    w("workspace/canvas"),
    "post",
    {
      project_id: e.projectId,
      canvas_id: e.canvasId,
      asset_cate_id: e.assetCateId,
      canvas: Xe(e.canvas)
    },
    // 保存状态、首次失败和重试由 useCanvasAutosave 统一处理。
    { reportError: !1 }
  ), r = R(t, "保存画布失败");
  return {
    canvasId: Number(r.canvas_id || e.canvasId || 0),
    assetCateId: Number(r.asset_cate_id || e.assetCateId || 0),
    updatedAt: String(r.updated_at || e.canvas.updatedAt || "")
  };
}
function xr(e) {
  const t = j(e) ? e : {}, r = j(t.power) ? t.power : {}, s = j(r.output) ? r.output : {}, o = Dr(
    t.storyboard_work_types
  ), i = Or(
    t.storyboard_reference_purposes,
    o
  ), n = st(
    t.storyboard_min_shot_durations
  ), _ = String(r.output_type || r.outputType || "").trim(), c = String(
    s.view_mode || s.viewMode || ""
  ).trim();
  if ((_ === "storyboard" || c === "storyboard") && (o.length === 0 || i.length === 0 || n.length === 0))
    throw new Error("分镜作品类型、参考用途或最短时长注册信息缺失");
  const u = new Set(
    i.map((l) => l.key)
  );
  if (o.some(
    (l) => l.required_reference_purposes.some(
      (f) => !u.has(f)
    )
  ))
    throw new Error("分镜作品类型引用了未知的参考用途");
  return {
    ...t,
    sources: Tr(t.sources),
    params: Array.isArray(t.params) ? t.params : [],
    selected_target_id: Number(t.selected_target_id || 0),
    source_rule: Number(t.source_rule || 0),
    primary_param_key: String(t.primary_param_key || ""),
    storyboard_work_types: o,
    storyboard_reference_purposes: i,
    storyboard_min_shot_durations: n
  };
}
function Tr(e) {
  return Array.isArray(e) ? e.map((t) => {
    const r = j(t) ? t : {}, s = j(r.supported_options) ? Object.fromEntries(
      Object.entries(r.supported_options).map(([o, i]) => [o.trim(), J(i)]).filter(([o, i]) => o !== "" && i.length > 0)
    ) : void 0;
    return {
      ...r,
      supported_options: s && Object.keys(s).length > 0 ? s : void 0
    };
  }) : [];
}
const zr = /* @__PURE__ */ new Set(["image", "video", "audio"]), Mr = /* @__PURE__ */ new Set([
  "global",
  "material",
  "shot",
  "composition",
  "context"
]);
function Dr(e) {
  if (!Array.isArray(e))
    return [];
  const t = /* @__PURE__ */ new Set();
  return e.map((r) => {
    const s = j(r) ? r : {}, o = String(s.key || "").trim().toLowerCase();
    if (!pe(o) || t.has(o))
      throw new Error("分镜作品类型注册信息无效");
    const i = Number(s.sort || 0);
    if (!Number.isInteger(i))
      throw new Error("分镜作品类型注册信息无效");
    return t.add(o), {
      key: o,
      name: String(s.name || "").trim() || o,
      sort: i,
      required_reference_purposes: J(
        s.required_reference_purposes
      )
    };
  }).sort((r, s) => r.sort - s.sort);
}
function Or(e, t) {
  if (!Array.isArray(e))
    return [];
  const r = new Set(t.map((o) => o.key)), s = /* @__PURE__ */ new Set();
  return e.map((o) => {
    const i = j(o) ? o : {}, n = String(i.key || "").trim(), _ = J(i.media_kinds), c = String(
      i.scope || ""
    ).trim(), u = J(
      i.work_types
    ), l = J(
      i.default_media_kinds
    ), f = String(i.material_type || "").trim(), g = Number(i.max_count || 0), k = Number(i.sort || 0);
    if (!n || s.has(n) || _.length === 0 || _.some(
      (S) => !zr.has(S)
    ) || !Mr.has(c) || u.some((S) => !r.has(S)) || l.some((S) => !_.includes(S)) || c === "material" && f !== "character" && f !== "scene" && f !== "prop" || c !== "material" && f || !Number.isInteger(g) || g < 0 || !Number.isInteger(k))
      throw new Error("分镜参考用途注册信息无效");
    return s.add(n), {
      key: n,
      name: String(i.name || "").trim() || n,
      media_kinds: _,
      work_types: u,
      scope: c,
      material_type: f,
      default_media_kinds: l,
      max_count: g,
      sort: k
    };
  }).sort((o, i) => o.sort - i.sort);
}
function J(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
const te = /* @__PURE__ */ new Map(), qr = 15e3;
function Pr(e, t) {
  const r = JSON.stringify([
    e.projectId,
    e.workAssetId,
    e.runId,
    e.requestId
  ]);
  let s = te.get(r);
  s || (s = $r(e), te.set(r, s));
  const o = s.subscribe(t);
  return () => {
    o(), s.size || (s.dispose(), te.get(r) === s && te.delete(r));
  };
}
function $r(e) {
  const t = new AbortController(), r = /* @__PURE__ */ new Set();
  let s, o = !1, i = !1, n = !1, _ = !1, c, u, l;
  const f = () => !t.signal.aborted && !i, g = () => {
    clearTimeout(s), t.abort();
  }, k = (p) => {
    if (f()) {
      i = !0, l = p, g();
      for (const y of r)
        p ? y.onError(p) : y.onEnd();
    }
  }, S = async () => {
    if (f()) {
      if (clearTimeout(s), n) {
        _ = !0;
        return;
      }
      n = !0;
      try {
        const p = await Ar({
          projectId: e.projectId,
          runId: e.runId,
          requestId: e.requestId,
          reportError: !1
        });
        if (!f()) return;
        const y = p?.run;
        if (!y || Number(y.id) !== e.runId || String(y.request_id) !== e.requestId) {
          k(new Error("运行状态与当前故事不匹配"));
          return;
        }
        u = y;
        for (const A of r) A.onStatus(y);
        (At(y.status) || !e.running) && k();
      } catch (p) {
        if (!f()) return;
        const y = Number(p?.code);
        (y === 401 || y === 403 || !e.running) && k(p);
      } finally {
        n = !1, f() && _ ? (_ = !1, S()) : f() && (s = setTimeout(S, qr));
      }
    }
  }, T = () => {
    o || (o = !0, S(), !(!e.running || !f()) && dt({
      projectId: e.projectId,
      requestId: e.requestId,
      signal: t.signal,
      recoverOnError: !0,
      onFrame: (p) => {
        if (f()) {
          c = p;
          for (const y of r) y.onFrame(p);
        }
      }
    }).then(() => {
      f() && S();
    }).catch((p) => k(p)));
  };
  return {
    get size() {
      return r.size;
    },
    subscribe(p) {
      return r.add(p), u && p.onStatus(u), c && p.onFrame(c), i && (l ? p.onError(l) : p.onEnd()), T(), () => r.delete(p);
    },
    dispose: g
  };
}
function Fr({
  projectId: e,
  snapshot: t,
  snapshotRef: r,
  workAssetIdRef: s,
  scopeRef: o,
  scope: i,
  mounted: n,
  acceptSnapshot: _,
  loadWork: c,
  reportError: u,
  observeCompletedRuns: l = !0
}) {
  const [f, g] = X(""), [k, S] = X(null), [T, p] = X(null), y = O(""), A = O(/* @__PURE__ */ new Set()), q = V(() => {
    p(null), y.current = "", A.current.clear();
  }, []), P = V(() => g(""), []);
  return K(() => {
    const v = r.current;
    if (!v?.run_id || !v.request_id || !l && v.document.status !== "running" || s.current && v.work_asset_id !== s.current)
      return;
    const ne = o.current;
    let ee = !1;
    const U = (m) => !!(m && m.work_asset_id === v.work_asset_id && m.run_id === v.run_id && m.request_id === v.request_id), F = () => !ee && n.current && o.current === ne && U(r.current), Y = {
      workAssetId: v.work_asset_id,
      runId: v.run_id,
      requestId: v.request_id
    }, ie = Date.now(), Z = () => S((m) => {
      const b = m?.runId === v.run_id && m?.requestId === v.request_id && m?.workAssetId === v.work_asset_id ? m : { ...Y, startedAt: ie, source: "observed" };
      return r.current?.document.status === "running" ? b : { ...b, finishedAt: b.finishedAt || Date.now() };
    });
    y.current = "", A.current.clear(), Z();
    const C = Pr(
      {
        ...Y,
        projectId: e,
        running: v.document.status === "running"
      },
      {
        onStatus: (m) => {
          if (!F()) return;
          const N = we(m.output);
          N && U(N) && _(N);
          const b = qe(m);
          b ? S((D) => ({
            ...Y,
            ...b,
            source: "server",
            ...r.current?.document.status !== "running" ? {
              finishedAt: b.finishedAt || D?.finishedAt || Date.now()
            } : {}
          })) : Z(), (m.status === "fail" || r.current?.document.status === "failed") && g(
            String(m.error || "生成失败，已完成内容已保留")
          );
        },
        onFrame: (m) => {
          if (!F()) return;
          const N = ft(m.output);
          if (he(N, r.current)) {
            if (A.current.has(N.step_request_id)) return;
            y.current !== N.step_request_id && y.current && A.current.add(y.current), y.current = N.step_request_id, p(N);
          }
          const b = we(m.output);
          b && U(b) && _(b), m.type === "result" && Number(m.status) === 2 && g(m.msg || "生成中断，已完成内容已保留");
        },
        onEnd: () => {
          F() && c().catch((m) => {
            F() && u(m);
          });
        },
        onError: (m) => {
          F() && (Z(), u(m));
        }
      }
    );
    return () => {
      ee = !0, C();
    };
  }, [
    _,
    n,
    o,
    r,
    s,
    c,
    e,
    u,
    i,
    l,
    t?.work_asset_id,
    t?.run_id,
    t?.request_id
  ]), {
    generationError: t?.document.status === "running" || t?.document.status === "ready" ? "" : f,
    generationTiming: k,
    preview: he(T, t) ? T : lt(t),
    clearPreview: q,
    clearGenerationError: P
  };
}
function Ls({
  projectId: e,
  canvasId: t,
  node: r,
  output: s,
  onAssetUpdated: o,
  readOnMount: i = !0
}) {
  const [n, _] = X(
    () => Ie(r, s)
  ), c = O(n), u = r.asset?.id || r.resultRef?.asset_id, l = `${e}:${t}:${r.id}:${u || 0}`, f = O(l), g = O(u), k = O(r.asset), S = O(o), T = O(0), p = O(!0), [y, A] = X(""), q = V(
    (C) => A(C instanceof Error ? C.message : "创作操作失败"),
    []
  );
  K(() => {
    f.current = l, g.current = u, k.current = r.asset, S.current = o;
  }, [l, u, r.asset, o]), K(() => (p.current = !0, () => {
    p.current = !1;
  }), []);
  const P = V((C) => {
    if (!p.current || g.current && C.work_asset_id !== g.current)
      return C;
    const m = mt(c.current, C);
    if (c.current = m, _(m), k.current?.id === m.work_asset_id && m === C) {
      const N = k.current, b = {
        ...N,
        name: m.document.title,
        version_id: m.work_version_id,
        version: {
          ...N.version,
          id: m.work_version_id,
          asset_id: m.work_asset_id,
          version: m.work_version || N.version?.version || 1,
          updated_at: m.work_updated_at,
          content: {
            json: m.document,
            writing_revision: m.work_revision
          }
        }
      };
      k.current = b, S.current?.(b);
    }
    return m;
  }, []), v = V(async () => {
    const C = f.current, m = r.asset?.id || r.resultRef?.asset_id || c.current?.work_asset_id;
    if (!m) return;
    const N = ++T.current, b = await Er({
      projectId: e,
      assetId: m,
      currentOnly: !0,
      reportError: !1
    });
    if (!p.current || N !== T.current || f.current !== C)
      return;
    const D = yt(b.asset.version?.content);
    if (!D) throw new Error("作品内容格式不正确");
    k.current = b.asset;
    const B = c.current;
    P({
      work_asset_id: m,
      work_version_id: b.asset.version_id,
      work_revision: ae(b.asset.version),
      work_version: b.asset.version?.version,
      work_updated_at: b.asset.version?.updated_at || b.asset.version?.created_at,
      document: D,
      run_id: D.active_run_id,
      request_id: D.active_request_id,
      status: D.status,
      checkpoint: B?.run_id === D.active_run_id && B.work_revision === ae(b.asset.version) ? B.checkpoint : void 0,
      proposal: B?.run_id === D.active_run_id && B.work_revision === ae(b.asset.version) ? B.proposal : void 0
    });
  }, [P, r.asset?.id, r.resultRef?.asset_id, e]);
  K(() => {
    i && v().catch(q);
  }, [v, i, q]), K(() => {
    const C = r.asset?.id || r.resultRef?.asset_id, m = r.asset?.version_id || r.resultRef?.version_id, N = c.current;
    i && N && N.work_asset_id === C && m && m > N.work_version_id && v().catch(q);
  }, [
    v,
    i,
    r.asset?.id,
    r.asset?.version_id,
    r.resultRef?.asset_id,
    r.resultRef?.version_id,
    q
  ]), K(() => {
    const C = Ie(r, s, c.current);
    C && P(C);
  }, [P, r, s]);
  const {
    generationTiming: ne,
    generationError: ee,
    preview: U,
    clearPreview: F,
    clearGenerationError: Y
  } = Fr({
    projectId: e,
    snapshot: n,
    snapshotRef: c,
    workAssetIdRef: g,
    scopeRef: f,
    scope: l,
    mounted: p,
    acceptSnapshot: P,
    loadWork: v,
    reportError: q,
    observeCompletedRuns: i
  }), ie = V(
    (C, m = {}, N) => {
      const b = c.current;
      if (!b) throw new Error("请等待作品加载完成");
      return {
        project_id: e,
        canvas_id: t,
        work_asset_id: b.work_asset_id,
        expected_work_version_id: N ?? b.work_version_id,
        expected_work_revision: b.work_revision,
        action: C,
        ...m
      };
    },
    [t, e]
  ), Z = V(async () => {
    const C = c.current;
    !C?.run_id || C.document.status !== "running" || (await Rr({
      projectId: e,
      runId: C.run_id,
      requestId: C.request_id,
      reportError: !1
    }), await v());
  }, [v, e]);
  return {
    snapshot: n,
    snapshotRef: c,
    mounted: p,
    acceptSnapshot: P,
    loadWork: v,
    command: ie,
    stopRun: Z,
    reportError: q,
    setError: A,
    error: y || ee || (!n && r.asset?.version?.content != null ? "作品内容格式不正确" : ""),
    generationTiming: ne,
    preview: U,
    clearPreview: F,
    clearGenerationError: Y
  };
}
function Us(e, t, r, s) {
  if (!t || !Object.keys(t.fields).length) return e;
  const o = { ...e }, i = (c, u, l) => {
    o.outline === e.outline && (o.outline = { ...e.outline }), o.outline[c] === e.outline[c] && (o.outline[c] = [...e.outline[c]]);
    const f = o.outline[c];
    return f[u] ? f[u] === e.outline[c][u] && (f[u] = { ...f[u] }) : f[u] = { id: l, name: "", description: "" }, f[u];
  }, n = (c) => (o.units === e.units && (o.units = [...e.units]), o.units[c] ? o.units[c] === e.units[c] && (o.units[c] = { ...o.units[c] }) : o.units[c] = {
    id: "",
    title: "",
    plan: "",
    unit_type: "chapter",
    children: [],
    asset_id: 0,
    version_id: 0,
    has_body: !1,
    continuity_valid: !1,
    dependency_stale: !1
  }, o.units[c]), _ = t.values || {};
  for (const c of ["characters", "locations", "props"])
    for (let u = 0; ; u++) {
      const l = _[`outline.${c}.${u}.id`];
      if (typeof l != "string") break;
      i(c, u, l).id = l;
    }
  for (const [c, u] of Object.entries(t.fields)) {
    const l = c.replace(/\[(\d+)\]/g, ".$1"), f = /^preferences\.(genre|style|style_instructions|pov|mode|chapter_words|planned_chapters)$/.exec(
      l
    );
    if (f) {
      const p = f[1];
      if (e.preferences[p]) continue;
      const y = p === "chapter_words" || p === "planned_chapters" ? _[l] : u, A = { ...o.preferences, [p]: y };
      gt(A) && (o.preferences = A);
      continue;
    }
    const g = /^inspirations\.(\d+)\.(title|content)$/.exec(l), k = /^units\.(\d+)\.(title|plan)$/.exec(l), S = /^(?:outline\.(characters|locations|props)|entities)\.(\d+)\.(name|description)$/.exec(
      l
    ), T = l.startsWith("outline.") ? l.slice(8) : l === "content" ? t.section_id : void 0;
    if (T && ht(T))
      o.outline === e.outline && (o.outline = { ...e.outline }), o.outline[T] = u;
    else if (g) {
      const p = t.inspiration_id ? o.inspirations.findIndex(
        (y) => y.id === t.inspiration_id
      ) : Number(g[1]);
      if (p < 0) continue;
      o.inspirations === e.inspirations && (o.inspirations = [...e.inspirations]), o.inspirations[p] && o.inspirations[p] === e.inspirations[p] && (o.inspirations[p] = { ...o.inspirations[p] }), o.inspirations[p] ||= { id: "", title: "", content: "" }, o.inspirations[p][g[2]] = u;
    } else if (k) {
      const p = Number(k[1]), y = r === "generate_chapters" && s?.length ? o.units.findIndex(
        (A) => A.id === s[p]
      ) : p + (r === "append" ? e.units.length : 0);
      if (y < 0 || s?.length && r === "generate_chapters" && !s[p])
        continue;
      n(y)[k[2]] = u;
    } else if (S) {
      const p = S[1] || t.section_id;
      if (p !== "characters" && p !== "locations" && p !== "props")
        continue;
      const y = t.entity_id ? o.outline[p].findIndex(
        (A) => A.id === t.entity_id
      ) : Number(S[2]);
      if (y < 0) continue;
      i(p, y, `preview:${p}:${y}`)[S[3]] = u;
    } else if (t.section_id === "chapter_plan" && t.unit_id && l === "plan") {
      const p = o.units.findIndex(
        (y) => y.id === t.unit_id
      );
      p >= 0 && (n(p).plan = u);
    }
  }
  return o;
}
const Vr = {
  generate_inspirations: "生成灵感",
  select_inspiration: "选定灵感",
  generate_outline: "生成大纲",
  generate_chapters: "规划剧情",
  retry_continuity: "整理剧情衔接",
  propose_edit: "生成修改建议",
  generate_section: "生成内容",
  generate_units: "生成正文",
  append: "追加规划"
};
function Br(e) {
  return Vr[e] || "创作任务";
}
const _e = [
  { id: "preferences", label: "生成写作设定" },
  { id: "direction", label: "生成故事总纲" },
  { id: "characters", label: "生成人物" },
  { id: "background", label: "生成背景" },
  { id: "chapters", label: "规划章节剧情" }
];
function Ys(e) {
  if (e?.checkpoint?.action !== "generate_outline") return "";
  const t = _e.findIndex(
    ({ id: r }) => r === e.checkpoint?.phase
  );
  return t >= 0 ? `第${t + 1}/${_e.length}步` : "";
}
function Zs(e) {
  const t = e?.checkpoint;
  if (!e) return "正在准备创作";
  if (!t) return "创作任务";
  const { document: r } = e;
  if (t.phase) {
    const n = _e.find(({ id: l }) => l === t.phase), _ = t.phase === "continuity" ? t.continuity_unit_id || t.unit_id : t.unit_id || t.unit_ids?.[t.completed], c = _ ? r.units.findIndex((l) => l.id === _) : -1, u = t.phase === "continuity" && t.history_total ? `正在整理前文 ${t.history_completed || 0}/${t.history_total}` : n ? `${r.status === "running" ? "正在" : ""}${n.label}` : t.phase === "body" ? "正在写正文" : "正文已保存，整理剧情衔接";
    if (t.phase === "chapters") {
      const l = Math.min(
        wt,
        t.count || r.preferences.planned_chapters || (r.preferences.mode === "serial" ? 10 : 5)
      );
      return `${u} · 第 1—${l} 章`;
    }
    return `${u}${c >= 0 ? ` · 第 ${c + 1} 章` : ""}`;
  }
  const s = Br(t.action);
  if (t.action === "append") {
    const n = It(
      r.units,
      r.preferences.planned_chapters,
      t.count
    );
    return `${s} · 第 ${n.start}—${n.end} 章`;
  }
  if (t.action === "generate_chapters" && t.unit_ids.length) {
    const n = bt(r.units), _ = t.unit_ids.flatMap((c) => {
      const u = n.byId.get(c);
      return u ? [u] : [];
    });
    return `${s} · ${St(_)}`;
  }
  const o = t.unit_ids?.[t.completed] || t.unit_id, i = r.units.find((n) => n.id === o);
  if (i)
    return `${s} · ${kt(r, { kind: "unit", id: i.id })}${t.section_id === "chapter_plan" ? " · 章纲" : ""}`;
  if (t.action === "generate_section" || t.action === "propose_edit") {
    const n = [...vt, ...Ct].find(
      (c) => c.id === t.section_id
    ), _ = Nt.flatMap(({ id: c }) => r.outline[c]).find((c) => c.id === t.entity_id);
    return `${s}${n ? ` · ${n.label}` : ""}${_ ? ` · ${_.name}` : ""}`;
  }
  return s;
}
export {
  Gs as $,
  as as A,
  Vt as B,
  cs as C,
  ds as D,
  us as E,
  _s as F,
  ns as G,
  Cs as H,
  Is as I,
  ls as J,
  Bt as K,
  js as L,
  Qr as M,
  is as N,
  Ds as O,
  zs as P,
  Es as Q,
  ss as R,
  es as S,
  rs as T,
  os as U,
  Ce as V,
  Ns as W,
  vs as X,
  ks as Y,
  Ss as Z,
  bs as _,
  Rs as a,
  Ps as a0,
  xs as a1,
  qt as a2,
  Ks as a3,
  Et as a4,
  ts as a5,
  Ms as a6,
  Rr as a7,
  ws as a8,
  gs as a9,
  gr as aa,
  $t as ab,
  Ts as ac,
  Fs as b,
  $s as c,
  Bs as d,
  Vs as e,
  Er as f,
  Zs as g,
  ys as h,
  fs as i,
  ms as j,
  fe as k,
  Br as l,
  yr as m,
  ir as n,
  Pt as o,
  Us as p,
  ps as q,
  qs as r,
  Os as s,
  xt as t,
  Ls as u,
  Ws as v,
  Ys as w,
  Jr as x,
  As as y,
  hs as z
};
