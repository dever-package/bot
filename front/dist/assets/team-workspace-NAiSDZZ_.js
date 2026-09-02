import { j as i, a as _, F as pn } from "./runtime-entry-9YhLBCWA.js";
import { a as O, d as Ft, u as Ce, b as Ze, e as q } from "./_commonjsHelpers-C76sftkf.js";
import { aP as ct, h as ao, W as ut, ai as fr, aQ as mr, Z as gr, b as pr, aB as _r, aN as br, aR as yr, l as In, aS as Fn, aT as hr, ae as wr, aU as kr, X as ft, aV as xr, v as vr, r as Ae, N as Mn, P as $n, e as Nr, n as Sr } from "./vendor-icons-DgDZMD4Q.js";
import { t as F } from "./index-GiccNT9P.js";
import { n as Dr, a as Cr, w as Ar, m as Er, r as Tr, R as Rr, u as Or, P as mt, b as Pr, i as Ir, C as Fr, H as zn, g as Mr, B as Mt, E as $r } from "./normalize-BPDqImdR.js";
const xt = [
  { id: "agent", value: "智能体" },
  { id: "role", value: "团队角色" },
  { id: "power", value: "能力" },
  { id: "team", value: "团队工作流" },
  { id: "context", value: "上下文" },
  { id: "knowledge", value: "知识库" },
  { id: "condition", value: "条件" },
  { id: "merge", value: "合并" },
  { id: "human_approval", value: "人工确认" },
  { id: "save", value: "保存" }
], zr = new Set(xt.map((e) => e.id)), lo = [
  { id: "chat", value: "沟通" },
  { id: "planner", value: "规划" },
  { id: "worker", value: "执行" },
  { id: "reviewer", value: "审核" }
], co = [
  { id: "always", value: "总是" },
  { id: "completed", value: "完成" },
  { id: "passed", value: "通过" },
  { id: "failed", value: "不通过" },
  { id: "approved", value: "确认" },
  { id: "rejected", value: "驳回" }
], uo = [
  { id: "exists", value: "有内容" },
  { id: "contains", value: "包含" },
  { id: "equals", value: "等于" },
  { id: "truthy", value: "为真" },
  { id: "falsy", value: "为假" }
], je = 64, ke = 64, Bn = {
  width: 24,
  height: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  lineHeight: 0
}, jn = {
  display: "block",
  flex: "0 0 auto"
}, Br = "draft", gt = "published", zt = "editing", le = "running", ve = "waiting", xe = "success", vt = "fail", fo = "canceled", _n = "pending", jr = 15e3, we = "_client_started_at", Bt = "_stream_last_id", Lr = [
  {
    path: "form.name",
    name: "名称",
    type: "form-input"
  },
  {
    path: "form.goal",
    name: "目标",
    type: "form-textarea"
  }
];
function bn({
  currentTeamID: e,
  currentTeamName: t,
  flows: n,
  roles: o,
  teams: r
}) {
  const s = /* @__PURE__ */ new Map();
  return e && s.set(e, {
    id: e,
    name: t || "当前团队",
    flows: n,
    roles: o.map((a) => ({
      ...a,
      team_id: Number(a.team_id || e)
    }))
  }), r.forEach((a) => {
    if (!a?.id)
      return;
    const c = s.get(a.id), l = a.id === e && !!c, m = l ? c?.flows : a.flows ?? c?.flows ?? [], f = l ? c?.roles : a.roles ?? c?.roles ?? [];
    s.set(a.id, {
      ...c,
      ...a,
      name: l ? c?.name || a.name || "" : a.name || c?.name || "",
      flows: (m ?? []).map(po),
      roles: (f ?? []).map((g) => ({
        ...g,
        team_id: Number(g.team_id || a.id)
      }))
    });
  }), Array.from(s.values());
}
function pt(e, t) {
  return e.find((n) => Number(n.id) === Number(t));
}
function qr(e, t) {
  if (t)
    for (const n of e) {
      const o = (n.roles ?? []).find(
        (r) => Number(r.id) === Number(t)
      );
      if (o)
        return o;
    }
}
function Gr(e) {
  return Array.from(
    new Set(
      hn(e).map((n) => Number(n.cate_id || 0)).filter(Boolean)
    )
  ).map((n) => ({
    id: n,
    value: `分类${n}`
  }));
}
function Kr(e) {
  const t = {
    text: "文本",
    storyboard: "分镜脚本",
    image: "图片",
    video: "视频",
    audio: "音频",
    role: "角色",
    multi: "多模态",
    embeddings: "向量",
    workflow: "工作流"
  };
  return Array.from(
    new Set(e.map((o) => o.kind).filter(Boolean))
  ).map((o) => ({ id: o, value: t[o] || o }));
}
function yn(e) {
  const t = String(e || "exists").trim().toLowerCase();
  return uo.some((n) => n.id === t) ? t : "exists";
}
function mo(e, t, n) {
  const o = t.find((r) => r.node_key === e.from_key);
  return o ? o.type === "condition" ? Ln(n, ["passed", "failed"]) : o.type === "human_approval" ? Ln(n, ["approved", "rejected"]) : [] : [];
}
function Ln(e, t) {
  const n = new Map(e.map((o) => [o.id, o]));
  return t.map((o) => n.get(o)).filter((o) => !!o);
}
function go(e) {
  return {
    team: Ur(e?.team),
    asset_cates: Array.isArray(e?.asset_cates) ? e.asset_cates : [],
    flows: Array.isArray(e?.flows) ? e.flows.map(po) : [],
    flow_edges: Array.isArray(e?.flow_edges) ? e.flow_edges : [],
    nodes_by_flow: e?.nodes_by_flow ?? {},
    edges_by_flow: e?.edges_by_flow ?? e?.node_edges_by_flow ?? {},
    roles: Array.isArray(e?.roles) ? e.roles : [],
    agents: Array.isArray(e?.agents) ? hn(e.agents) : [],
    agent_cates: Array.isArray(e?.agent_cates) ? _o(e.agent_cates) : [],
    knowledge_cates: Array.isArray(e?.knowledge_cates) ? Yr(e.knowledge_cates) : [],
    knowledge_bases: Array.isArray(e?.knowledge_bases) ? Wr(e.knowledge_bases) : [],
    teams: Array.isArray(e?.teams) ? e.teams : [],
    role_types: Array.isArray(e?.role_types) ? e.role_types : lo,
    powers: Array.isArray(e?.powers) ? e.powers : [],
    power_kinds: Array.isArray(e?.power_kinds) ? e.power_kinds : [],
    node_types: Array.isArray(e?.node_types) ? e.node_types : xt,
    edge_conditions: Array.isArray(e?.edge_conditions) ? e.edge_conditions : co
  };
}
function Hr(e, t) {
  if (!t || typeof t != "object")
    return e;
  const n = { ...e, ...t };
  return Object.prototype.hasOwnProperty.call(t, "node_edges_by_flow") && !Object.prototype.hasOwnProperty.call(t, "edges_by_flow") && (n.edges_by_flow = t.node_edges_by_flow), go(n);
}
function Ur(e) {
  const t = e && typeof e == "object" ? { ...e } : {};
  return t.publish_status = wn(
    t.publish_status
  ), t.current_release_id = Number(t.current_release_id || 0), t.release_version = Number(t.release_version || 0), t.readonly = !!t.readonly || bo(t), t;
}
function po(e) {
  return { ...e };
}
function hn(e) {
  return [...e].sort(Nt);
}
function _o(e) {
  return [...e].sort(Nt);
}
function Wr(e) {
  return [...e].sort(Nt);
}
function Yr(e) {
  return [...e].sort(Nt);
}
function Nt(e, t) {
  const n = Number(e.sort || 0), o = Number(t.sort || 0);
  return n !== o ? n - o : Number(e.id || 0) - Number(t.id || 0);
}
function wn(e) {
  const t = String(e ?? "").trim().toLowerCase();
  return t === gt || t === "已发布" || t === "发布" ? gt : t === zt || t === "编辑草稿" || t === "editing_draft" ? zt : Br;
}
function bo(e) {
  return !!e?.readonly || wn(e?.publish_status) === gt;
}
function Xr(e) {
  return e === gt ? "已发布" : e === zt ? "编辑草稿" : "草稿";
}
function qn(e, t, n) {
  return e === "node" ? t === n.key : !1;
}
function Vr(e, t) {
  const n = String(e || "agent");
  return n === "role" ? "团队角色" : n === "team" ? "团队工作流" : t.find((o) => o.id === n)?.value || xt.find((o) => o.id === n)?.value || n;
}
function Zr(e) {
  return e.filter((t) => zr.has(t.id));
}
function Jr(e) {
  return e.map((t) => ({
    ...t,
    role_id: t.type === "role" ? Number(t.role_id || t.config?.role_id || 0) : 0,
    role_key: t.type === "role" ? String(t.role_key || t.config?.role_key || "") : "",
    agent_id: t.type === "agent" ? t.agent_id : 0,
    power_id: t.type === "power" ? Number(t.power_id || t.config?.power_id || 0) : 0,
    sub_team_id: t.type === "team" ? Number(t.sub_team_id || t.config?.sub_team_id || 0) : 0,
    asset_cate_id: t.type === "context" || t.type === "save" ? Number(t.asset_cate_id || t.config?.asset_cate_id || 0) : 0,
    config: Qr(t)
  }));
}
function Qr(e) {
  const t = M(e.config, [
    "task",
    "input_keys",
    "output_key",
    "knowledge_cate_id",
    "knowledge_base_id",
    "query",
    "retrieve_limit"
  ]);
  return e.type === "agent" ? M(t, [
    "role_id",
    "role_key",
    "role_team_id",
    "role_type",
    "power_id",
    "power_key",
    "power_kind",
    "sub_team_id",
    "sub_flow_id",
    "sub_flow_key",
    "release_id",
    "asset_cate_id",
    "operator",
    "source_key",
    "input_key",
    "value",
    "body_key",
    "content_key"
  ]) : e.type === "role" ? M(t, [
    "agent_cate_id",
    "power_id",
    "power_key",
    "power_kind",
    "sub_team_id",
    "sub_flow_id",
    "sub_flow_key",
    "release_id",
    "asset_cate_id",
    "operator",
    "source_key",
    "input_key",
    "value",
    "body_key",
    "content_key"
  ]) : e.type === "power" ? M(t, [
    "goal",
    "agent_cate_id",
    "role_id",
    "role_key",
    "role_team_id",
    "role_type",
    "sub_team_id",
    "sub_flow_id",
    "sub_flow_key",
    "release_id",
    "asset_cate_id",
    "operator",
    "source_key",
    "input_key",
    "value",
    "body_key",
    "content_key"
  ]) : e.type === "team" ? M(t, [
    "goal",
    "agent_cate_id",
    "role_id",
    "role_key",
    "role_team_id",
    "role_type",
    "power_id",
    "power_key",
    "power_kind",
    "asset_cate_id",
    "operator",
    "source_key",
    "input_key",
    "value",
    "body_key",
    "content_key"
  ]) : e.type === "knowledge" ? {
    ...M(t, [
      "goal",
      "agent_cate_id",
      "role_id",
      "role_key",
      "role_team_id",
      "role_type",
      "power_id",
      "power_key",
      "power_kind",
      "sub_team_id",
      "sub_flow_id",
      "sub_flow_key",
      "release_id",
      "asset_cate_id",
      "operator",
      "source_key",
      "input_key",
      "value",
      "body_key",
      "content_key"
    ]),
    knowledge_base_id: Number(e.config?.knowledge_base_id || 0),
    knowledge_cate_id: Number(e.config?.knowledge_cate_id || 0),
    query: String(e.config?.query ?? e.config?.goal ?? ""),
    retrieve_limit: Number(e.config?.retrieve_limit || 0)
  } : e.type === "condition" ? {
    ...M(t, [
      "goal",
      "agent_cate_id",
      "role_id",
      "role_key",
      "role_team_id",
      "role_type",
      "power_id",
      "power_key",
      "power_kind",
      "sub_team_id",
      "sub_flow_id",
      "sub_flow_key",
      "release_id",
      "asset_cate_id",
      "operator",
      "source_key",
      "input_key",
      "value",
      "body_key",
      "content_key"
    ]),
    operator: yn(t.operator)
  } : e.type === "save" ? M(t, [
    "goal",
    "agent_cate_id",
    "role_id",
    "role_key",
    "role_team_id",
    "role_type",
    "power_id",
    "power_key",
    "power_kind",
    "sub_team_id",
    "sub_flow_id",
    "sub_flow_key",
    "release_id",
    "operator",
    "source_key",
    "input_key",
    "value",
    "body_key",
    "content_key"
  ]) : e.type === "context" ? M(t, [
    "goal",
    "agent_cate_id",
    "role_id",
    "role_key",
    "role_team_id",
    "role_type",
    "power_id",
    "power_key",
    "power_kind",
    "sub_team_id",
    "sub_flow_id",
    "sub_flow_key",
    "release_id",
    "operator",
    "source_key",
    "input_key",
    "value",
    "body_key",
    "content_key"
  ]) : M(t, [
    "goal",
    "agent_cate_id",
    "role_id",
    "role_key",
    "role_team_id",
    "role_type",
    "power_id",
    "power_key",
    "power_kind",
    "sub_team_id",
    "sub_flow_id",
    "sub_flow_key",
    "release_id",
    "asset_cate_id",
    "operator",
    "source_key",
    "input_key",
    "value",
    "body_key",
    "content_key"
  ]);
}
function M(e, t) {
  const n = { ...e ?? {} };
  return t.forEach((o) => {
    delete n[o];
  }), n;
}
function ei(e, t) {
  if (!e) {
    F.error("请先选择一个工作流");
    return;
  }
  const n = `node_${Date.now()}`;
  t((o) => {
    const r = o.nodes_by_flow?.[e] ?? [];
    return {
      ...o,
      nodes_by_flow: {
        ...o.nodes_by_flow ?? {},
        [e]: [
          ...r,
          ho(r, n, ti(r))
        ]
      }
    };
  });
}
function yo(e, t, n) {
  return {
    key: t,
    name: wo("工作流", e, (o) => o.name),
    goal: "",
    position: n ?? St(e.length),
    status: 1,
    sort: (e.length + 1) * 10
  };
}
function ho(e, t, n) {
  return {
    node_key: t,
    name: wo("节点", e, (o) => o.name),
    type: "agent",
    role_id: 0,
    role_key: "",
    agent_id: 0,
    power_id: 0,
    sub_team_id: 0,
    asset_cate_id: 0,
    config: {},
    position: n ?? St(e.length),
    status: 1,
    sort: (e.length + 1) * 10
  };
}
function St(e) {
  return {
    x: 90 + e % 4 * 180,
    y: 90 + Math.floor(e / 4) * 140
  };
}
function ti(e) {
  const t = [...e].filter((n) => n.position).sort((n, o) => Number(n.sort || 0) - Number(o.sort || 0)).at(-1);
  return t?.position ? {
    x: Number(t.position.x || 0) + 160,
    y: Number(t.position.y || 0)
  } : St(e.length);
}
function wo(e, t, n) {
  const o = /* @__PURE__ */ new Set(), r = new RegExp(`^${ni(e)}(\\d+)$`);
  t.forEach((a) => {
    const c = String(n(a) || "").trim().match(r);
    c && o.add(Number(c[1]));
  });
  let s = 1;
  for (; o.has(s); )
    s += 1;
  return `${e}${s}`;
}
function ni(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function ko(e, t, n) {
  return t === n || (e.flow_edges ?? []).some(
    (o) => o.from_key === t && o.to_key === n
  ) ? e : {
    ...e,
    flow_edges: [
      ...e.flow_edges ?? [],
      {
        from_key: t,
        to_key: n,
        condition: "completed",
        status: 1,
        sort: ((e.flow_edges?.length ?? 0) + 1) * 10
      }
    ]
  };
}
function oi(e, t, n, o) {
  const r = e.flows ?? [];
  return r.some((s) => s.key === n) ? e : ko(
    {
      ...e,
      flows: [...r, yo(r, n, o)]
    },
    t,
    n
  );
}
function xo(e, t, n, o) {
  const r = e.edges_by_flow?.[t] ?? [];
  if (n === o || r.some((c) => c.from_key === n && c.to_key === o))
    return e;
  const a = (e.nodes_by_flow?.[t] ?? []).find((c) => c.node_key === n);
  return {
    ...e,
    edges_by_flow: {
      ...e.edges_by_flow ?? {},
      [t]: [
        ...r,
        {
          from_key: n,
          to_key: o,
          condition: ii(a?.type, r, n),
          status: 1,
          sort: (r.length + 1) * 10
        }
      ]
    }
  };
}
function ri(e, t, n, o, r) {
  const s = e.nodes_by_flow?.[t] ?? [];
  return s.some((a) => a.node_key === o) ? e : xo(
    {
      ...e,
      nodes_by_flow: {
        ...e.nodes_by_flow ?? {},
        [t]: [...s, ho(s, o, r)]
      }
    },
    t,
    n,
    o
  );
}
function ii(e, t, n) {
  const o = new Set(
    t.filter((r) => r.from_key === n).map((r) => String(r.condition || ""))
  );
  return e === "condition" ? o.has("passed") ? "failed" : "passed" : e === "human_approval" ? o.has("approved") ? "rejected" : "approved" : "always";
}
function Gn(e, t, n) {
  return {
    ...e,
    flows: (e.flows ?? []).map(
      (o) => o.key === t ? { ...o, ...n } : o
    )
  };
}
function si(e, t, n) {
  const o = [...e.flows ?? []], r = o.findIndex((c) => c.key === t), s = o.findIndex((c) => c.key === n);
  if (r < 0 || s < 0 || r === s)
    return e;
  const [a] = o.splice(r, 1);
  return o.splice(s, 0, a), {
    ...e,
    flows: o.map((c, l) => ({
      ...c,
      sort: (l + 1) * 10
    }))
  };
}
function Kn(e, t, n, o) {
  const r = e.nodes_by_flow?.[t] ?? [];
  return {
    ...e,
    nodes_by_flow: {
      ...e.nodes_by_flow ?? {},
      [t]: r.map(
        (s) => s.node_key === n ? { ...s, ...o } : s
      )
    }
  };
}
function ai(e, t, n, o) {
  const r = e.edges_by_flow?.[t] ?? [];
  return {
    ...e,
    edges_by_flow: {
      ...e.edges_by_flow ?? {},
      [t]: r.map(
        (s, a) => a === n ? { ...s, ...o } : s
      )
    }
  };
}
function li(e, t, n) {
  if (t.kind === "flow") {
    const r = { ...e.nodes_by_flow ?? {} }, s = { ...e.edges_by_flow ?? {} };
    return delete r[t.key], delete s[t.key], {
      ...e,
      flows: (e.flows ?? []).filter(
        (a) => a.key !== t.key
      ),
      flow_edges: (e.flow_edges ?? []).filter(
        (a) => a.from_key !== t.key && a.to_key !== t.key
      ),
      nodes_by_flow: r,
      edges_by_flow: s
    };
  }
  if (t.kind === "flow_edge")
    return {
      ...e,
      flow_edges: (e.flow_edges ?? []).filter(
        (r, s) => s !== t.index
      )
    };
  if (t.kind === "node") {
    const r = e.nodes_by_flow?.[n] ?? [], s = e.edges_by_flow?.[n] ?? [];
    return {
      ...e,
      nodes_by_flow: {
        ...e.nodes_by_flow ?? {},
        [n]: r.filter((a) => a.node_key !== t.key)
      },
      edges_by_flow: {
        ...e.edges_by_flow ?? {},
        [n]: s.filter(
          (a) => a.from_key !== t.key && a.to_key !== t.key
        )
      }
    };
  }
  const o = e.edges_by_flow?.[n] ?? [];
  return {
    ...e,
    edges_by_flow: {
      ...e.edges_by_flow ?? {},
      [n]: o.filter((r, s) => s !== t.index)
    }
  };
}
await window.DeverFront?.ensureCompat?.(["@/lib/assistant/reference", "@/components/stream-timing", "@/lib/request", "@/lib/agent-result-protocol"]);
const jt = window.DeverFront?.sdk?.getCompatModule("@/lib/assistant/reference");
if (!jt || Object.keys(jt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/assistant/reference");
const di = jt.assistantReferencePayload, Le = window.DeverFront?.sdk?.getCompatModule("@/components/stream-timing");
if (!Le || Object.keys(Le).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/stream-timing");
const ci = Le.createRuntimeStreamTiming, ui = Le.formatStreamDuration, fi = Le.isStreamTimingRunning, mi = Le.streamTimingPercentFromOutput, Lt = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Lt || Object.keys(Lt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const gi = Lt.request, qe = window.DeverFront?.sdk?.getCompatModule("@/lib/agent-result-protocol");
if (!qe || Object.keys(qe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/agent-result-protocol");
const pi = qe.agentResultPayloadTitle, _i = qe.extractAgentResultPayload, bi = qe.isAgentResultProtocolText, yi = qe.normalizeAgentResultOutputValue;
function hi(e, t = []) {
  const n = di(t);
  return {
    goal: e,
    requirement: e,
    prompt: e,
    user_input: e,
    reference_files: n ?? []
  };
}
function wi(e) {
  return {
    run: {
      id: 0,
      request_id: "",
      status: le,
      input: e,
      output: {},
      error: ""
    },
    flow_runs: [],
    node_runs: [],
    agent_runs: [],
    blackboard: [],
    approvals: [],
    interactions: []
  };
}
function ki(e, t) {
  return {
    run: {
      id: Number(e?.run_id || 0),
      request_id: String(e?.request_id || ""),
      status: String(e?.status || le),
      release_id: Number(e?.release_id || 0),
      input: t,
      output: {},
      error: ""
    },
    flow_runs: [],
    node_runs: [],
    agent_runs: [],
    blackboard: [],
    approvals: [],
    interactions: []
  };
}
async function Hn(e, t, n, o, r) {
  const s = String(n?.run?.request_id || "");
  if (!s)
    return n;
  let a = n;
  const c = await Ar({
    streamApi: e,
    requestID: s,
    lastID: String(n?.[Bt] || "0-0"),
    blockMs: jr,
    signal: r,
    acceptErrorResult: !0,
    initialState: n,
    reduceFrame: (l, m) => vi(Ni(l, m), m),
    fetchSnapshot: t ? () => xi(t, n) : void 0,
    mergeSnapshot: (l, m) => vo(l, m),
    onUpdate: (l) => {
      a = l, o?.(l);
    }
  });
  return c.lastID && (a = {
    ...c.state,
    [Bt]: c.lastID
  }), a;
}
async function xi(e, t) {
  const n = await gi(e, "get", {
    run_id: Number(t?.run?.id || 0),
    request_id: String(t?.run?.request_id || ""),
    view: "summary"
  });
  if (n.code !== 0)
    throw new Error(n.message || "读取运行状态失败");
  return n.data;
}
function vi(e, t) {
  const n = String(t?.stream_id || "");
  return n ? {
    ...e,
    [Bt]: n
  } : e;
}
function Ni(e, t) {
  const n = t?.output;
  return t?.type === "result" && Si(n) ? vo(e, n) : A(n) ? Di(e, n) : e;
}
function vo(e, t) {
  const n = Er(e, t);
  return {
    ...e,
    ...t,
    run: n.run,
    node_runs: Un(
      T(e?.node_runs),
      T(n?.node_runs),
      ["id", "node_key", "node_id"]
    ),
    flow_runs: Un(
      T(e?.flow_runs),
      T(n?.flow_runs),
      ["id", "flow_id", "flow_key"]
    ),
    interactions: n.interactions,
    approvals: n.approvals
  };
}
function Un(e, t, n) {
  return t.map((o) => {
    const r = e.find(
      (s) => n.some(
        (a) => te(o?.[a]) && String(s?.[a]) === String(o?.[a])
      )
    );
    return r ? So(r, o) : Do(o);
  });
}
function Si(e) {
  return !!(A(e) && (A(e.run) || Array.isArray(e.flow_runs) || Array.isArray(e.node_runs)));
}
function Di(e, t) {
  const n = kn(e), o = String(t.scope || "");
  return (o === "run" || Ci(t.event)) && (n.run = Ai(n.run, t)), o === "flow" && (n.flow_runs = Wn(
    n.flow_runs,
    Ei(t),
    ["id", "flow_id", "flow_key"]
  )), o === "node" && (n.node_runs = Wn(
    n.node_runs,
    Ti(t),
    ["id", "node_key", "node_id"]
  )), t.error && (n.error = String(t.error)), n;
}
function kn(e) {
  return {
    ...e,
    run: { ...e?.run || {} },
    flow_runs: T(e?.flow_runs).map((t) => ({ ...t })),
    node_runs: T(e?.node_runs).map((t) => ({ ...t })),
    agent_runs: T(e?.agent_runs),
    blackboard: T(e?.blackboard),
    approvals: T(e?.approvals),
    interactions: T(e?.interactions),
    messages: T(e?.messages)
  };
}
function Ci(e) {
  return ["run_started", "run_finished", "waiting"].includes(
    String(e || "")
  );
}
function Ai(e, t) {
  const n = { ...e || {} };
  return pe(n, "id", t.run_id), pe(n, "team_id", t.team_id), pe(n, "release_id", t.release_id), pe(n, "status", xn(t, t.status || t.run_status)), pe(n, "input", t.input), pe(n, "output", t.output), pe(n, "error", t.error), pe(n, "started_at", t.started_at), pe(n, "finished_at", t.finished_at), n;
}
function Ei(e) {
  return No({
    id: e.flow_run_id,
    run_id: e.run_id,
    flow_id: e.flow_id,
    flow_key: e.flow_key,
    flow_name: e.flow_name,
    name: e.flow_name,
    status: xn(e, e.status),
    input: e.input,
    output: e.output,
    error: e.error,
    started_at: e.started_at,
    finished_at: e.finished_at
  });
}
function Ti(e) {
  return No({
    id: e.node_run_id,
    run_id: e.run_id,
    flow_run_id: e.flow_run_id,
    flow_id: e.flow_id,
    flow_key: e.flow_key,
    flow_name: e.flow_name,
    node_id: e.node_id,
    node_key: e.node_key,
    node_name: e.node_name,
    name: e.node_name,
    node_type: e.node_type,
    status: xn(e, e.status || e.node_status),
    input: e.input,
    output: e.output,
    agent_run_id: e.agent_run_id,
    agent_request_id: e.agent_request_id,
    agent_stream_type: e.agent_stream_type,
    error: e.error,
    started_at: e.started_at,
    finished_at: e.finished_at
  });
}
function xn(e, t) {
  return Tr(e, t);
}
function No(e) {
  const t = {};
  return Object.entries(e).forEach(([n, o]) => {
    te(o) && (t[n] = o);
  }), t;
}
function Wn(e, t, n) {
  if (!Object.keys(t).length)
    return e;
  const o = Do(t), r = e.findIndex(
    (a) => n.some(
      (c) => te(o[c]) && String(a?.[c]) === String(o[c])
    )
  );
  if (r < 0)
    return [...e, o];
  const s = [...e];
  return s[r] = So(s[r], o), s;
}
function So(e, t) {
  const n = {
    ...e,
    ...t
  };
  return te(e?.[we]) ? n[we] = e[we] : Co(n) && (n[we] = t[we] || Date.now()), te(e?.started_at) && te(t.started_at) && !te(t.finished_at) && (n.started_at = e.started_at), n;
}
function Do(e) {
  return !Co(e) || te(e[we]) ? e : {
    ...e,
    [we]: Date.now()
  };
}
function Co(e) {
  const t = Ke(e?.status);
  return t === le || t === ve || te(e?.started_at);
}
function pe(e, t, n) {
  te(n) && (e[t] = n);
}
function te(e) {
  return e == null || e === "" ? !1 : Array.isArray(e) ? e.length > 0 : !0;
}
function Ri(e, t = /* @__PURE__ */ new Set()) {
  const n = {}, o = /* @__PURE__ */ new Map();
  for (const r of T(e?.node_runs)) {
    const s = String(r?.id || ""), a = String(r?.node_key || "");
    s && a && o.set(s, a);
  }
  for (const r of T(e?.approvals)) {
    const s = Oi(r);
    if (!s || t.has(String(s.id)))
      continue;
    const a = R(
      s.nodeKey,
      r?.node_key,
      o.get(
        String(s.nodeRunID || r?.node_run_id || "")
      )
    );
    a && (n[a] = {
      ...s,
      nodeKey: a
    });
  }
  for (const r of T(e?.interactions)) {
    const s = Ao(r);
    if (!s || t.has(String(s.id)))
      continue;
    const a = R(
      s.nodeKey,
      r?.node_key,
      o.get(String(s.nodeRunID || ""))
    );
    a && (n[a] = { ...s, nodeKey: a });
  }
  for (const r of T(e?.node_runs)) {
    const s = Pi(r);
    if (s && t.has(String(s.id)))
      continue;
    const a = String(r?.node_key || s?.nodeKey || "");
    s && a && !n[a] && (n[a] = {
      ...s,
      nodeKey: a
    });
  }
  return n;
}
function Ao(e) {
  const t = Dr(e), n = t.interaction, o = R(n.id);
  return !o || !R(n.type) ? null : {
    id: o,
    title: R(n.title, t.nodeName, "补充信息"),
    runID: t.runId,
    nodeRunID: t.nodeRunId,
    nodeKey: t.nodeKey,
    kind: "interaction",
    interaction: n
  };
}
function Oi(e) {
  if (String(e?.status || "") !== _n || !e?.id)
    return null;
  const t = ae(e?.content), n = Eo(
    t.interaction,
    e?.title,
    e?.id
  );
  return {
    id: e.id,
    title: R(e?.title, n.title),
    nodeRunID: e.node_run_id,
    nodeKey: R(e?.node_key),
    kind: "human_approval",
    interaction: n
  };
}
function Pi(e) {
  if (String(e?.status || "") !== ve)
    return null;
  const t = ae(e?.interaction);
  if (R(t.id) && R(t.type))
    return Ao({
      run_id: e?.run_id,
      node_run_id: e?.id,
      node_key: e?.node_key,
      node_name: e?.node_name,
      interaction: t
    });
  const n = ae(e?.output), o = n.approval_id || n.approvalId;
  if (!o)
    return null;
  const r = Eo(
    n.interaction,
    e?.node_name || e?.name,
    o
  );
  return {
    id: o,
    title: R(e?.node_name, e?.name, r.title),
    nodeRunID: e.id,
    nodeKey: String(e?.node_key || ""),
    kind: "human_approval",
    interaction: r
  };
}
function Eo(e, t, n) {
  return A(e) && R(e.type) ? e : {
    id: `team-approval-${n || Date.now()}`,
    type: "form",
    title: R(t) || "等待用户反馈",
    description: "补充反馈后，团队工作流会继续执行。",
    fields: [
      {
        key: "decision",
        name: "处理结果",
        type: "select",
        required: !0,
        default_value: "approved",
        options: [
          { label: "通过", value: "approved" },
          { label: "驳回", value: "rejected" }
        ]
      },
      {
        key: "comment",
        name: "反馈说明",
        type: "textarea",
        placeholder: "填写补充信息、选择原因或修改建议。"
      }
    ],
    values: {
      decision: "approved"
    }
  };
}
function Ii(e, t, n) {
  const o = kn(e);
  return t.kind === "interaction" && (o.interactions = T(o.interactions).filter(
    (r) => String(r?.interaction?.id || "") !== String(t.id)
  )), o.approvals = T(o.approvals).map(
    (r) => String(r?.id || "") === String(t.id) ? {
      ...r,
      status: xe,
      decision: n.data.decision || "approved",
      comment: n.data.comment || n.text
    } : r
  ), o.node_runs = T(o.node_runs).map((r) => {
    const s = t.nodeRunID && String(r?.id || "") === String(t.nodeRunID), a = t.nodeKey && String(r?.node_key || "") === String(t.nodeKey);
    return !s && !a ? r : t.kind === "interaction" ? {
      ...r,
      status: le,
      interaction: {},
      output: {
        text: "已提交反馈，继续执行当前节点。"
      }
    } : {
      ...r,
      status: xe,
      output: {
        approval_id: t.id,
        decision: n.data.decision || "approved",
        comment: n.data.comment || n.text,
        text: n.text,
        data: n.data
      }
    };
  }), o;
}
function Fi(e, t) {
  const n = kn(e);
  return n.run = {
    ...n.run || {},
    id: Number(t?.run_id || n.run?.id || 0),
    request_id: String(t?.request_id || n.run?.request_id || ""),
    status: String(t?.status || le)
  }, n;
}
function ae(e) {
  return A(e) ? e : {};
}
function To(e) {
  return {
    [le]: "运行中",
    [ve]: "等待反馈",
    [xe]: "成功",
    [vt]: "失败",
    [fo]: "已取消",
    [_n]: "等待中"
  }[e] || e || "未知";
}
function Ro(e) {
  return !e?.error || String(e?.status || "") === xe ? "" : String(e.error);
}
function Mi(e) {
  switch (e) {
    case xe:
      return "bg-emerald-50 text-emerald-700";
    case vt:
      return "bg-destructive/10 text-destructive";
    case le:
      return "bg-blue-50 text-blue-700";
    case ve:
      return "bg-amber-50 text-amber-700";
    case fo:
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted/60 text-muted-foreground";
  }
}
function $i(e, t, n, o, r = {}) {
  const s = {}, a = Sn(T(e?.agent_runs)), c = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), m = vn(T(e?.node_runs));
  m.forEach((p) => {
    const h = String(p?.node_key || "");
    if (!h)
      return;
    const w = Ke(p?.status || p?.state || p?.run_status);
    s[h] = { status: w, run: p }, w === xe && c.add(h), et(w) && l.add(h);
  });
  const f = new Set(t.map((p) => p.node_key)), g = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set();
  return n.forEach((p, h) => {
    if (!f.has(p.from_key) || !f.has(p.to_key))
      return;
    const w = Oo(p, h);
    c.has(p.from_key) && l.has(p.to_key) && g.add(w), c.has(p.from_key) && c.has(p.to_key) && u.add(w);
  }), {
    active: o || !!e?.run,
    running: o,
    nodeRuns: m,
    nodeRunsByKey: s,
    agentRunsByID: a,
    pendingApprovalsByNodeKey: r,
    activeEdgeKeys: g,
    completedEdgeKeys: u
  };
}
function Oo(e, t) {
  return `${e.from_key}->${e.to_key}:${t}`;
}
function zi(e) {
  if (et(e))
    return {
      animation: "team-node-running 1.4s ease-in-out infinite",
      borderColor: "#2563eb"
    };
  if (e === xe)
    return {
      borderColor: "#86efac",
      boxShadow: "0 0 0 3px rgb(16 185 129 / 0.12), 0 4px 12px rgb(15 23 42 / 0.08)"
    };
  if (e === vt)
    return {
      borderColor: "#f87171",
      boxShadow: "0 0 0 3px rgb(239 68 68 / 0.12), 0 4px 12px rgb(15 23 42 / 0.08)"
    };
  if (e === ve)
    return {
      borderColor: "#f59e0b",
      boxShadow: "0 0 0 3px rgb(245 158 11 / 0.14), 0 4px 12px rgb(15 23 42 / 0.08)"
    };
}
function Bi(e, t) {
  return e === ve && String(t || "") === "human_approval" ? "等待人工确认" : To(e);
}
function vn(e) {
  return [...e].sort(ji);
}
function ji(e, t) {
  const n = at(e?.started_at), o = at(t?.started_at);
  if (n !== o)
    return n - o;
  const r = at(e?.created_at), s = at(t?.created_at);
  return r !== s ? r - s : Number(e?.id || 0) - Number(t?.id || 0);
}
function at(e) {
  return Kt(e)?.getTime() ?? Number.MAX_SAFE_INTEGER;
}
function et(e) {
  return Ke(e) === le;
}
function Ke(e) {
  return Cr(e);
}
function Dt(e) {
  return e === "agent" || e === "role" || e === "power" || e === "knowledge" || e === "team";
}
function Po(e, t) {
  const n = Dt(String(e?.node_type || "")) ? Ct(e, t) : void 0;
  return fi(n) || et(e?.status);
}
function Ct(e, t, n) {
  const o = t || e, r = Ke(e?.status || o?.status), s = e?.[we] || e?.started_at || o?.started_at || e?.created_at;
  return ci({
    status: r,
    startedAt: s,
    finishedAt: o?.finished_at || e?.finished_at,
    label: Li(e, t, n),
    percent: mi(
      Io(t),
      o?.output,
      e?.output
    )
  });
}
function Li(e, t, n) {
  const o = Io(t), r = qi(e, n);
  return es(
    o?.text,
    o?.message,
    t?.output?.text,
    e?.output?.text
  ) || r || `${bt(e?.node_type)}：${e?.node_name || e?.node_key || "节点"}`;
}
function qi(e, t) {
  if (String(e?.node_type || "") !== "team")
    return "";
  const n = Gi(t?.node);
  if (!n)
    return `${bt(e?.node_type)}：${e?.node_name || e?.node_key || "节点"}`;
  const o = T(t?.nodeRuns).filter((r) => {
    if (Number(r?.flow_id || 0) !== n)
      return !1;
    const s = Ke(r?.status);
    return s === le || s === ve;
  }).slice(0, 2).map((r) => `${r?.node_name || r?.node_key || "节点"}正在执行`);
  return o.length === 0 ? `${bt(e?.node_type)}：${e?.node_name || e?.node_key || "节点"}` : o.join("、");
}
function Gi(e) {
  return Number(e?.config?.sub_flow_id || e?.config?.flow_id || 0);
}
function Io(e) {
  const t = T(e?.stream);
  for (let n = t.length - 1; n >= 0; n -= 1) {
    const o = t[n]?.payload?.output;
    if (K(o))
      return o;
  }
}
function Fo(e, t) {
  const n = String(e?.node_type || ""), o = Ee(e?.output), r = Ee(t?.output), s = Yi(o);
  if (K(s))
    return s;
  if (n === "agent" || n === "role") {
    const a = A(o) ? o.output : void 0;
    return ne(
      r,
      a,
      A(a) ? a.output : void 0,
      A(a) ? a.content : void 0,
      A(o) && o.summary ? { text: o.summary } : void 0,
      o
    );
  }
  return n === "power" ? ne(
    A(o) ? o.output : void 0,
    A(o) ? o.data?.output : void 0,
    o
  ) : n === "merge" ? Ki(o) : n === "team" ? ne(
    A(o) ? Wi(o.output) : void 0,
    A(o) ? o.result?.run?.output : void 0,
    A(o) ? o.result?.output : void 0,
    o
  ) : ne(
    A(o) ? o.output : void 0,
    A(o) ? o.result : void 0,
    o
  );
}
function Ki(e) {
  const t = ae(e);
  if (!Object.keys(t).length)
    return ne(e);
  const n = T(t.sources).map(Hi).filter(K);
  if (n.length > 0) {
    const r = Ui(t.meta);
    return r ? [{ text: r }, ...n] : n;
  }
  const o = Object.entries(ae(t.merged)).map(([r, s]) => Mo(r, r, s)).filter(K);
  return o.length > 0 ? o : ne(
    t.text ? { text: t.text } : void 0,
    t.output,
    t.result,
    t.content,
    t.data,
    e
  );
}
function Hi(e) {
  const t = ae(e);
  return Object.keys(t).length ? Mo(
    R(t.title, t.key, "上游节点"),
    R(t.key),
    t.text || t.content
  ) : ne(e);
}
function Mo(e, t, n) {
  const o = ne(
    n,
    A(n) ? n.output : void 0,
    A(n) ? n.result : void 0,
    A(n) ? n.content : void 0,
    A(n) && n.text ? { text: n.text } : void 0
  );
  if (!K(o))
    return;
  const r = R(e, t, "上游节点");
  return typeof o == "string" ? { title: r, text: o } : A(o) ? { ...o, title: r } : { title: r, json: o };
}
function Ui(e) {
  const t = ae(e), n = Number(t.incoming_count || 0), o = Number(
    t.incoming_source_count || t.source_count || 0
  ), r = Number(t.source_count || 0), s = Number(t.missing_source_count || 0);
  if (!n && !r && !s)
    return "";
  const a = [`合并上游：${o}/${n}`];
  return r > o && a.push(`展示条目：${r}`), s > 0 && a.push(`缺少输出：${s}`), a.join("，");
}
function Wi(e) {
  const t = ae(Ee(e));
  if (!Object.keys(t).length)
    return e;
  const n = ne(
    t.output,
    t.result,
    t.content,
    t.data,
    t.text ? { text: t.text } : void 0
  );
  if (K(n))
    return n;
  const o = Object.keys(t).filter(
    (r) => !r.startsWith("_") && !["input", "user_input"].includes(r)
  ).reverse();
  for (const r of o) {
    const s = Ee(t[r]), a = A(s) ? ne(
      s.output,
      s.result,
      s.content,
      s.data,
      s.text ? { text: s.text } : void 0
    ) : ne(s);
    if (K(a))
      return a;
  }
}
function Yi(e) {
  if (!A(e) || !te(e.approval_id) && !te(e.approvalId))
    return;
  const t = ae(e.content), n = Xi(e);
  if (n)
    return { text: n };
  const o = ae(e.data), r = Object.keys(o).length ? o : ae(t.data), s = R(e.text, r.text, e.comment);
  return ne(
    r.output,
    r.params,
    s ? { text: s } : void 0,
    Vi(r)
  );
}
function Xi(e) {
  const t = String(e.decision || "").toLowerCase();
  if (!t)
    return "";
  const n = t === "approved" ? "人工确认：已通过" : t === "rejected" ? "人工确认：已驳回" : `人工确认：${t}`, o = R(e.comment);
  return o ? `${n}

${o}` : n;
}
function Vi(e) {
  const t = {};
  return Object.entries(e).forEach(([n, o]) => {
    ["interaction", "output", "params", "text"].includes(n) || (t[n] = o);
  }), t;
}
function ne(...e) {
  for (const t of e) {
    const n = Nn(Ee(t));
    if (K(n))
      return n;
  }
}
function Nn(e) {
  const t = yi(e);
  if (t !== e && K(t))
    return t;
  if (typeof e == "string") {
    const r = Gt(e);
    if (r)
      return lt(
        r.payload,
        r.cleanText
      );
    const s = _t(e);
    return s ? lt(s) : e;
  }
  if (Array.isArray(e))
    return e.map(Nn).filter(K);
  if (!A(e))
    return e;
  const n = Gt(
    R(e.text)
  );
  if (n)
    return lt(
      n.payload,
      n.cleanText
    );
  if ($o(e))
    return lt(e);
  const o = Zi(e);
  return o !== void 0 ? o : e;
}
function Zi(e) {
  for (const t of ["output", "result", "data", "content", "json", "value"]) {
    const n = Nn(
      Ee(e[t])
    );
    if (K(n))
      return n;
  }
}
function lt(e, t = "") {
  const n = {}, o = Ji(e.content);
  o && Yn(n, o), Yn(n, e);
  const r = Qi(e) || t;
  return r && (n.text = r), !K(n) && o ? o : n;
}
function Ji(e) {
  return A(e) ? e : typeof e == "string" && e.trim() ? {
    format: "markdown",
    text: e.trim()
  } : null;
}
function Yn(e, t) {
  [
    "title",
    "text",
    "reasoning",
    "rich",
    "images",
    "videos",
    "audios",
    "files",
    "json",
    "error",
    "progress",
    "meta"
  ].forEach((o) => {
    qt(t[o]) && (e[o] = t[o]);
  }), !qt(e.rich) && A(t.value) && (e.rich = t.value);
}
function qt(e) {
  return e == null || e === "" ? !1 : Array.isArray(e) ? e.length > 0 : A(e) ? Object.keys(e).length > 0 : !0;
}
function Qi(e) {
  if (!A(e))
    return typeof e == "string" ? e.trim() : "";
  const t = R(e.text);
  if (t)
    return t;
  const n = e.content;
  return typeof n == "string" ? n.trim() : A(n) ? R(n.text) : "";
}
function es(...e) {
  for (const t of e) {
    const n = R(t);
    if (!n)
      continue;
    const o = _i(n) || Gt(n);
    if (o) {
      const r = R(
        o.cleanText,
        pi(o.payload),
        ts(o.payload)
      );
      if (r)
        return r;
      continue;
    }
    if (!bi(n))
      return n;
  }
  return "";
}
function ts(e) {
  if (!A(e))
    return "";
  const t = A(e.content) ? e.content : {};
  return R(e.title, t.title);
}
function Gt(e) {
  for (const n of ["agent-result", "agent-output", "json"]) {
    const o = ns(e, n);
    if (o)
      return o;
  }
  const t = _t(e);
  return t ? { cleanText: "", payload: t } : void 0;
}
function ns(e, t) {
  const n = `\`\`\`${t}`, o = e.indexOf(n);
  if (o < 0)
    return;
  let r = o + n.length;
  for (; r < e.length && is(e[r]); )
    r += 1;
  let s = r;
  for (; s < e.length; ) {
    const a = e.indexOf("```", s);
    if (a < 0) {
      const l = _t(e.slice(r));
      return l ? {
        cleanText: e.slice(0, o).trim(),
        payload: l
      } : void 0;
    }
    const c = _t(e.slice(r, a));
    if (c)
      return {
        cleanText: `${e.slice(0, o)}${e.slice(a + 3)}`.trim(),
        payload: c
      };
    s = a + 3;
  }
}
function _t(e) {
  const t = e.trim(), n = os(t), o = n === t ? [t] : [t, n];
  for (const r of o)
    try {
      const s = JSON.parse(r);
      if ($o(s))
        return s;
    } catch {
    }
}
function $o(e) {
  if (!A(e))
    return !1;
  const t = String(e.kind || e.type || e.event || "").toLowerCase().trim();
  return [
    "final",
    "result",
    "final_result",
    "answer",
    "tool",
    "tool_result",
    "power_result"
  ].includes(t) || "content" in e || "tasks" in e || "suggestions" in e || [
    "title",
    "text",
    "rich",
    "images",
    "videos",
    "audios",
    "files",
    "json"
  ].some((n) => qt(e[n]));
}
function os(e) {
  let t = "", n = !1, o = !1;
  for (const r of e) {
    if (o) {
      t += r, o = !1;
      continue;
    }
    if (r === "\\") {
      t += r, o = n;
      continue;
    }
    if (r === '"') {
      n = !n, t += r;
      continue;
    }
    if (n && r.charCodeAt(0) < 32) {
      t += rs(r);
      continue;
    }
    t += r;
  }
  return t;
}
function rs(e) {
  switch (e) {
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    default:
      return `\\u${e.charCodeAt(0).toString(16).padStart(4, "0")}`;
  }
}
function is(e) {
  return e === " " || e === "	" || e === "\r" || e === `
`;
}
function Ee(e) {
  if (Array.isArray(e))
    return e.map(Ee).filter(K);
  if (!A(e))
    return e;
  const t = {};
  return Object.entries(e).forEach(([n, o]) => {
    n !== "_debug_asset" && (t[n] = o);
  }), t;
}
function K(e) {
  return e == null || e === "" ? !1 : typeof e == "string" ? e.trim().length > 0 : typeof e == "number" || typeof e == "boolean" ? !0 : Array.isArray(e) ? e.some(K) : A(e) ? Object.keys(e).some(
    (t) => t !== "_debug_asset" && K(e[t])
  ) : !1;
}
function zo(e) {
  const t = A(e?._debug_asset) ? e._debug_asset : null, n = R(t?.name, t?.title);
  return `调试模式不会真正保存；正式运行会保存为${n ? `素材「${n}」的新版本` : "素材版本"}，并写入团队记忆。`;
}
function A(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function bt(e) {
  const t = {
    agent: "智能体节点",
    role: "团队角色",
    power: "能力节点",
    team: "团队工作流",
    context: "上下文节点",
    knowledge: "知识库节点",
    condition: "条件节点",
    merge: "合并节点",
    human_approval: "人工确认",
    save: "保存节点"
  }, n = String(e || "");
  return t[n] || n;
}
function ss(e, t) {
  const n = Kt(e), o = Kt(t);
  if (!n)
    return "等待开始";
  const r = [`开始 ${Xn(n)}`];
  return o ? (r.push(`结束 ${Xn(o)}`), r.push(
    `耗时 ${ui(o.getTime() - n.getTime())}`
  )) : r.push("运行中"), r.join(" · ");
}
function Kt(e) {
  if (!e)
    return null;
  const t = new Date(String(e));
  return Number.isNaN(t.getTime()) ? null : t;
}
function Xn(e) {
  return e.toLocaleTimeString("zh-CN", {
    hour12: !1,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
function T(e) {
  return Array.isArray(e) ? e : [];
}
function Sn(e) {
  const t = {};
  return e.forEach((n) => {
    n?.id && (t[String(n.id)] = n);
  }), t;
}
function as(e, t) {
  return String(
    e?.id || e?.request_id || e?.key || e?.node_key || t
  );
}
function R(...e) {
  for (const t of e)
    if (typeof t == "string" && t.trim())
      return t.trim();
  return "";
}
await window.DeverFront?.ensureCompat?.(["@/lib/utils", "@/components/agent/interaction-panel", "@/components/ui/dialog", "@/components/ui/select", "@/components/stream-timing"]);
const Ht = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!Ht || Object.keys(Ht).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const Bo = Ht.cn, Ut = window.DeverFront?.sdk?.getCompatModule("@/components/agent/interaction-panel");
if (!Ut || Object.keys(Ut).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/interaction-panel");
const ls = Ut.AgentInteractionPanel, Ge = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!Ge || Object.keys(Ge).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const ds = Ge.Dialog, cs = Ge.DialogContent, us = Ge.DialogDescription, fs = Ge.DialogTitle, Te = window.DeverFront?.sdk?.getCompatModule("@/components/ui/select");
if (!Te || Object.keys(Te).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/select");
const ms = Te.Select, gs = Te.SelectContent, ps = Te.SelectItem, _s = Te.SelectTrigger, bs = Te.SelectValue, yt = window.DeverFront?.sdk?.getCompatModule("@/components/stream-timing");
if (!yt || Object.keys(yt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/stream-timing");
const ys = yt.formatStreamDuration, hs = yt.useStreamClock, ws = 220, Vn = 170, ks = 150;
function xs({
  view: e,
  flows: t,
  flowEdges: n,
  nodes: o,
  nodeEdges: r,
  edgeConditions: s,
  selected: a,
  connect: c,
  readonly: l,
  nodeTypes: m,
  executionState: f,
  paramApi: g,
  onSelect: u,
  onConnect: p,
  onOpenNodeResult: h,
  onSubmitApproval: w,
  onEdit: x,
  onDelete: P,
  onFlowConnect: C,
  onFlowConnectNew: v,
  onNodeConnect: E,
  onNodeConnectNew: $,
  onMove: U,
  onChangeNodeEdge: z
}) {
  return /* @__PURE__ */ i(Rr, { children: /* @__PURE__ */ i(
    vs,
    {
      view: e,
      flows: t,
      flowEdges: n,
      nodes: o,
      nodeEdges: r,
      edgeConditions: s,
      selected: a,
      connect: c,
      readonly: l,
      nodeTypes: m,
      executionState: f,
      paramApi: g,
      onSelect: u,
      onConnect: p,
      onOpenNodeResult: h,
      onSubmitApproval: w,
      onEdit: x,
      onDelete: P,
      onFlowConnect: C,
      onFlowConnectNew: v,
      onNodeConnect: E,
      onNodeConnectNew: $,
      onMove: U,
      onChangeNodeEdge: z
    }
  ) });
}
function vs({
  view: e,
  flows: t,
  flowEdges: n,
  nodes: o,
  nodeEdges: r,
  edgeConditions: s,
  selected: a,
  connect: c,
  readonly: l,
  nodeTypes: m,
  executionState: f,
  paramApi: g,
  onSelect: u,
  onConnect: p,
  onOpenNodeResult: h,
  onSubmitApproval: w,
  onEdit: x,
  onDelete: P,
  onFlowConnect: C,
  onFlowConnectNew: v,
  onNodeConnect: E,
  onNodeConnectNew: $,
  onMove: U,
  onChangeNodeEdge: z
}) {
  const [N, I] = O(null), W = Ft(null), Pe = Ft(e), Ie = Ft(!1), { fitView: He, screenToFlowPosition: Fe } = Or(), re = hs(!!f?.active), ue = e === "flow" ? t : o, Y = e === "flow" ? n : r, X = Ce(
    () => ue.map((b) => Wt(e, b)).join("|"),
    [ue, e]
  ), ie = Ce(
    () => ue.map((b, k) => {
      const D = Wt(e, b), L = St(k);
      return {
        id: D,
        type: "teamGraphNode",
        position: {
          x: Number(b.position?.x ?? L.x),
          y: Number(b.position?.y ?? L.y)
        },
        sourcePosition: mt.Right,
        targetPosition: mt.Left,
        selected: a?.kind === e && a.key === D,
        zIndex: a?.kind === e && a.key === D ? 100 : 1,
        draggable: !l,
        connectable: !l,
        style: {
          width: je,
          height: ke
        },
        data: {
          kind: e,
          item: b,
          connect: c,
          nodeTypes: m,
          readonly: l,
          executionState: f,
          paramApi: g,
          now: re,
          onOpenNodeResult: h,
          onSubmitApproval: w,
          onEdit: x,
          onDelete: P
        }
      };
    }),
    [
      f,
      c,
      ue,
      m,
      re,
      P,
      x,
      h,
      w,
      g,
      l,
      a,
      e
    ]
  ), [ee, Me] = O(ie), [Q, $e] = O(null), [ze, tt] = O(""), At = Ce(() => {
    const b = Y.map((k, D) => {
      const L = e === "flow" ? "flow_edge" : "node_edge", Z = a?.kind === L && a.index === D, se = Oo(k, D), ce = f?.activeEdgeKeys.has(se), Ye = f?.completedEdgeKeys.has(se), fe = Ls(k, ze), rt = ce || Ye, Pt = Z ? "#2563eb" : fe || rt ? "#6366f1" : "#d4d4d8";
      return {
        id: Us(e, k, D),
        source: k.from_key,
        target: k.to_key,
        type: "teamGraphEdge",
        animated: !!(rt || fe),
        selected: Z,
        selectable: !0,
        reconnectable: !1,
        zIndex: Z || ce || fe ? 20 : 1,
        style: {
          stroke: Pt,
          strokeWidth: Z || ce || fe ? 2 : 1.5,
          strokeDasharray: Z || fe ? "8 7" : "7 9",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          filter: ce || fe ? "drop-shadow(0 0 5px rgb(37 99 235 / 0.45))" : void 0
        },
        data: {
          view: e,
          edge: k,
          index: D,
          highlighted: fe,
          nodes: o,
          edgeConditions: s,
          readonly: l,
          onSelect: u,
          onDelete: P,
          onChangeNodeEdge: z
        }
      };
    });
    return Q && b.push({
      id: Ks(Q),
      source: Q.source,
      target: Q.target,
      type: "teamGraphEdge",
      animated: !1,
      selectable: !1,
      reconnectable: !1,
      zIndex: 0,
      style: {
        stroke: "#6366f1",
        strokeWidth: 1.8,
        strokeDasharray: "5 7",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        opacity: 0.8
      },
      data: {
        view: e,
        edge: {
          from_key: Q.source,
          to_key: Q.target,
          condition: ""
        },
        index: -1,
        preview: !0,
        nodes: o,
        edgeConditions: s,
        readonly: !0,
        onSelect: u,
        onDelete: P,
        onChangeNodeEdge: z
      }
    }), b;
  }, [
    s,
    Y,
    f,
    ze,
    o,
    z,
    P,
    u,
    Q,
    l,
    a,
    e
  ]);
  Ze(() => {
    window.requestAnimationFrame(() => {
      He({ padding: 0.24, maxZoom: 1.15, duration: 160 });
    });
  }, [He, X, e]), Ze(() => {
    Me((b) => Ie.current ? b : Pe.current !== e ? (Pe.current = e, ie) : Qn(b, ie));
  }, [ie, e]), Ze(() => {
    if (!N)
      return;
    const b = () => I(null), k = (D) => {
      D.key === "Escape" && b();
    };
    return window.addEventListener("click", b), window.addEventListener("contextmenu", b), window.addEventListener("keydown", k), () => {
      window.removeEventListener("click", b), window.removeEventListener("contextmenu", b), window.removeEventListener("keydown", k);
    };
  }, [N]), Ze(() => {
    const b = (k) => {
      l || !a || k.defaultPrevented || k.key !== "Delete" && k.key !== "Backspace" || qo(k.target) || (k.preventDefault(), P(a));
    };
    return window.addEventListener("keydown", b), () => window.removeEventListener("keydown", b);
  }, [P, l, a]);
  const Et = q(
    (b) => {
      l || Me((k) => Pr(b, k));
    },
    [l]
  ), nt = q(() => {
    Ie.current = !0, $e(null);
  }, []), ot = q(
    (b, k) => {
      if (l)
        return;
      const D = Jn(
        k,
        ee,
        Y
      );
      $e(
        (L) => Gs(L, D) ? L : D
      );
    },
    [Y, ee, l]
  ), Tt = q(
    (b, k) => {
      Ie.current = !1;
      const D = Jn(
        k,
        ee,
        Y
      );
      if ($e(null), l)
        return;
      const L = jo(k.position);
      Me(
        (Z) => Qn(Z, ie).map(
          (se) => se.id === k.id ? { ...se, position: L } : se
        )
      ), U(e, k.id, L), D && (e === "flow" ? C(D.source, D.target) : E(D.source, D.target));
    },
    [
      ie,
      Y,
      ee,
      C,
      U,
      E,
      l,
      e
    ]
  ), Rt = q(
    (b) => {
      l || !b.source || !b.target || (e === "flow" ? C(b.source, b.target) : E(b.source, b.target));
    },
    [C, E, l, e]
  ), Ue = q(
    (b, k) => {
      W.current = k.nodeId, k.nodeId && p({ kind: e, fromKey: k.nodeId });
    },
    [p, e]
  ), Ot = q(
    (b, k) => {
      const D = W.current;
      if (W.current = null, p(null), l || !D || k.toNode)
        return;
      const L = Ys(b);
      if (!L)
        return;
      const Z = Fe(L), se = ee.find((Ye) => Ye.id === D);
      if (!Vs(se?.position, Z))
        return;
      const ce = Bs(se?.position, Z);
      e === "flow" ? v(D, ce) : $(D, ce);
    },
    [
      ee,
      p,
      v,
      $,
      l,
      Fe,
      e
    ]
  ), Ne = q(
    (b, k) => {
      if (!Xs(b)) {
        if (Ms(k)) {
          b.stopPropagation(), k.data.onOpenNodeResult?.(k.id);
          return;
        }
        u(Yt(e, k.id));
      }
    },
    [u, e]
  ), de = q(
    (b, k) => {
      b.preventDefault();
      const D = Yt(e, k.id);
      u(D), l || I({ x: b.clientX, y: b.clientY, target: D });
    },
    [u, l, e]
  ), We = q(
    (b, k) => {
      tt(k.id);
    },
    []
  ), _e = q(() => {
    tt("");
  }, []), be = q(
    (b, k) => {
      b.stopPropagation();
      const D = no(k), L = a?.kind === D.kind && a.index === D.index, Z = Ws(k);
      if (L && !l && !Z) {
        P(D);
        return;
      }
      u(D);
    },
    [P, u, l, a]
  ), Be = q(
    (b, k) => {
      b.preventDefault();
      const D = no(k);
      u(D), l || I({ x: b.clientX, y: b.clientY, target: D });
    },
    [u, l]
  );
  return /* @__PURE__ */ _(
    "div",
    {
      className: "relative min-h-0 min-w-0 overflow-hidden",
      style: { background: "#fff" },
      children: [
        /* @__PURE__ */ i("style", { children: `
        .team-workflow-react-flow .react-flow__node {
          background: transparent;
          border: 0;
          box-shadow: none;
          opacity: 1;
          overflow: visible;
        }
        .team-workflow-react-flow .react-flow__node.dragging,
        .team-workflow-react-flow .react-flow__node.selected {
          z-index: 1000 !important;
          opacity: 1 !important;
        }
        .team-workflow-react-flow .react-flow__node.dragging .team-graph-node-circle {
          box-shadow: 0 14px 34px rgb(15 23 42 / 0.18);
        }
        .team-workflow-react-flow .react-flow__node:focus,
        .team-workflow-react-flow .react-flow__node:focus-visible {
          outline: none;
        }
        .team-workflow-react-flow .react-flow__edge-path {
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: stroke 0.25s ease, stroke-width 0.25s ease, opacity 0.25s ease, stroke-dasharray 0.25s ease;
        }
        .team-graph-node .react-flow__handle {
          opacity: 0.38;
          transition: opacity 150ms ease, border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
        }
        .team-graph-node:hover .react-flow__handle,
        .team-graph-node[data-selected="true"] .react-flow__handle {
          opacity: 0.75;
        }
        .team-graph-node {
          position: relative;
          display: flex;
          width: ${je}px;
          height: ${ke}px;
          align-items: center;
          justify-content: center;
          user-select: none;
        }
        .team-graph-node-circle {
          position: relative;
          display: flex;
          width: ${je}px;
          height: ${ke}px;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          border: 2px solid hsl(var(--border));
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          box-shadow: 0 4px 12px rgb(15 23 42 / 0.12);
          transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
        }
        .team-graph-node:hover .team-graph-node-circle {
          box-shadow: 0 8px 20px rgb(15 23 42 / 0.15);
        }
        .team-graph-node-label {
          position: absolute;
          top: ${ke + 8}px;
          left: 50%;
          width: 150px;
          transform: translateX(-50%);
          pointer-events: auto;
          user-select: none;
          text-align: center;
        }
        .team-graph-node-title {
          display: block;
          pointer-events: none;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: hsl(var(--foreground));
          font-size: 11px;
          font-weight: 700;
          line-height: 1.1;
        }
        .team-graph-node-subtitle {
          display: block;
          pointer-events: none;
          margin-top: 2px;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: hsl(var(--muted-foreground));
          font-size: 9px;
          line-height: 1;
          opacity: 0.7;
        }
        .team-graph-node-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          display: flex;
          width: 16px;
          height: 16px;
          align-items: center;
          justify-content: center;
          border: 1px solid hsl(var(--background));
          border-radius: 9999px;
          box-shadow: 0 1px 3px rgb(15 23 42 / 0.18);
        }
        .team-graph-actions {
          position: relative;
          z-index: 30;
          display: flex;
          height: 24px;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 6px;
          opacity: 0;
          transform: translateY(-3px);
          pointer-events: none;
          transition: opacity 150ms ease, transform 150ms ease;
        }
        .team-graph-node:hover .team-graph-actions,
        .team-graph-node[data-selected="true"] .team-graph-actions {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .team-graph-action-button {
          pointer-events: auto;
          border: 1px solid hsl(var(--border));
          border-radius: 9999px;
          background: hsl(var(--background));
          color: hsl(var(--muted-foreground));
          box-shadow: 0 3px 10px rgb(15 23 42 / 0.10);
          transition: border-color 150ms ease, color 150ms ease, background 150ms ease, transform 150ms ease;
        }
        .team-graph-action-button:hover {
          border-color: rgb(99 102 241 / 0.55);
          color: hsl(var(--foreground));
          transform: translateY(-1px);
        }
        .team-graph-action-button-danger:hover {
          border-color: hsl(var(--destructive) / 0.45);
          color: hsl(var(--destructive));
        }
        .team-graph-progress-indeterminate {
          animation: team-graph-spin 1s linear infinite;
          transform-origin: center;
        }
        @keyframes team-graph-spin {
          to { transform: rotate(360deg); }
        }
        .team-workflow-react-flow .react-flow__edge.animated .react-flow__edge-path {
          stroke-dasharray: 8 10;
          animation-duration: 0.9s;
        }
        .team-workflow-react-flow .react-flow__controls {
          border-color: hsl(var(--border));
          box-shadow: 0 8px 24px rgb(15 23 42 / 0.08);
        }
        .team-workflow-react-flow .react-flow__controls-button {
          border-color: hsl(var(--border));
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        @keyframes team-node-running {
          0%, 100% { box-shadow: 0 0 0 3px rgb(37 99 235 / 0.16), 0 8px 18px rgb(37 99 235 / 0.10); }
          50% { box-shadow: 0 0 0 6px rgb(37 99 235 / 0.08), 0 8px 22px rgb(37 99 235 / 0.16); }
        }
      ` }),
        /* @__PURE__ */ i(
          Ir,
          {
            className: "team-workflow-react-flow",
            nodes: ee,
            edges: At,
            nodeTypes: Is,
            edgeTypes: Fs,
            nodesDraggable: !l,
            nodesConnectable: !l,
            nodesFocusable: !0,
            edgesFocusable: !0,
            elementsSelectable: !0,
            connectOnClick: !1,
            deleteKeyCode: null,
            fitView: !0,
            fitViewOptions: { padding: 0.24, maxZoom: 1.15 },
            minZoom: 0.35,
            maxZoom: 1.8,
            nodeDragThreshold: 4,
            connectionRadius: 48,
            defaultEdgeOptions: { type: "teamGraphEdge" },
            proOptions: { hideAttribution: !0 },
            onNodesChange: Et,
            onConnect: Rt,
            onConnectStart: Ue,
            onConnectEnd: Ot,
            onNodeDragStart: nt,
            onNodeDrag: ot,
            onNodeDragStop: Tt,
            onNodeClick: Ne,
            onNodeContextMenu: de,
            onNodeMouseEnter: We,
            onNodeMouseLeave: _e,
            onEdgeClick: be,
            onEdgeContextMenu: Be,
            onPaneClick: () => {
              I(null), u(null);
            },
            onPaneContextMenu: (b) => {
              b.preventDefault(), I(null);
            },
            children: /* @__PURE__ */ i(Fr, { showInteractive: !1, position: "top-right" })
          }
        ),
        /* @__PURE__ */ i(
          zs,
          {
            menu: N,
            onEdit: (b) => {
              I(null), x(b);
            },
            onDelete: (b) => {
              I(null), P(b);
            }
          }
        )
      ]
    }
  );
}
function Ns({ data: e, selected: t }) {
  const n = Wt(e.kind, e.item), o = Yt(e.kind, n), r = to(e.item), s = e.executionState?.nodeRunsByKey[n], a = s?.run, c = a?.agent_run_id ? e.executionState?.agentRunsByID[String(a.agent_run_id)] : void 0, l = e.kind === "node" && a && Dt(
    String(a.node_type || to(e.item) || "")
  ) ? Ct(a, c, {
    node: e.item,
    nodeRuns: e.executionState?.nodeRuns || []
  }) : void 0, m = Ke(s?.status), f = zi(m), g = e.kind === "node" ? e.executionState?.pendingApprovalsByNodeKey[n] : void 0, u = Ss(m), p = Ds(l?.percent), h = e.connect?.kind === e.kind && e.connect.fromKey === n;
  return /* @__PURE__ */ _(
    "div",
    {
      "data-graph-interactive": "true",
      "data-selected": t ? "true" : void 0,
      className: "team-graph-node",
      style: {
        cursor: e.readonly ? "pointer" : "move",
        zIndex: g ? 50 : l ? 40 : void 0
      },
      children: [
        /* @__PURE__ */ i(
          zn,
          {
            type: "target",
            position: mt.Left,
            style: Zn(u, "target")
          }
        ),
        /* @__PURE__ */ i(
          zn,
          {
            type: "source",
            position: mt.Right,
            style: Zn(u, "source")
          }
        ),
        /* @__PURE__ */ _(
          "div",
          {
            className: "team-graph-node-circle",
            style: {
              ...Cs(u, t, h),
              ...f
            },
            children: [
              u === "running" ? /* @__PURE__ */ _(
                "svg",
                {
                  style: {
                    position: "absolute",
                    inset: 0,
                    zIndex: 10,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    transform: "rotate(-90deg)"
                  },
                  viewBox: "0 0 64 64",
                  children: [
                    /* @__PURE__ */ i(
                      "circle",
                      {
                        cx: "32",
                        cy: "32",
                        r: "30",
                        fill: "transparent",
                        stroke: "rgb(59 130 246 / 0.15)",
                        strokeWidth: "2"
                      }
                    ),
                    /* @__PURE__ */ i(
                      "circle",
                      {
                        cx: "32",
                        cy: "32",
                        r: "30",
                        fill: "transparent",
                        stroke: "#3b82f6",
                        strokeWidth: "2.5",
                        strokeLinecap: "round",
                        className: p == null ? "team-graph-progress-indeterminate" : "",
                        style: p != null ? {
                          strokeDasharray: "188.5",
                          strokeDashoffset: `${188.5 * (1 - p / 100)}`
                        } : {
                          strokeDasharray: "45 143.5",
                          strokeDashoffset: "0"
                        }
                      }
                    )
                  ]
                }
              ) : null,
              Os(eo(e.item), r, e.kind),
              /* @__PURE__ */ i(As, { status: u })
            ]
          }
        ),
        g && e.onSubmitApproval ? /* @__PURE__ */ i(
          $s,
          {
            approval: g,
            paramApi: e.paramApi,
            onSubmit: e.onSubmitApproval
          }
        ) : null,
        /* @__PURE__ */ _("div", { className: "team-graph-node-label", children: [
          /* @__PURE__ */ i("span", { className: "team-graph-node-title", children: eo(e.item) || n }),
          /* @__PURE__ */ i("span", { className: "team-graph-node-subtitle", children: Ts({
            status: u,
            timing: l,
            now: e.now,
            idleText: e.kind === "flow" ? Hs(e.item) || n : Vr(r, e.nodeTypes)
          }) }),
          e.readonly ? null : /* @__PURE__ */ _("div", { className: "team-graph-actions", children: [
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                className: "nodrag nopan team-graph-action-button",
                style: Bn,
                title: "编辑",
                onClick: (w) => {
                  w.stopPropagation(), e.onEdit(o);
                },
                onMouseDown: (w) => w.stopPropagation(),
                children: /* @__PURE__ */ i(ct, { size: 13, style: jn })
              }
            ),
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                className: "nodrag nopan team-graph-action-button team-graph-action-button-danger",
                style: {
                  ...Bn,
                  color: "hsl(var(--destructive))"
                },
                title: "删除",
                onClick: (w) => {
                  w.stopPropagation(), e.onDelete(o);
                },
                onMouseDown: (w) => w.stopPropagation(),
                children: /* @__PURE__ */ i(ao, { size: 13, style: jn })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function Ss(e) {
  return e === le ? "running" : e === ve ? "waiting" : e === xe ? "done" : e === vt ? "error" : "idle";
}
function Ds(e) {
  if (e == null || e === "")
    return null;
  const t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? null : Math.max(0, Math.min(100, Math.round(t)));
}
function Cs(e, t, n) {
  const o = {};
  return t && (o.borderColor = "#6366f1", o.boxShadow = "0 0 15px rgb(99 102 241 / 0.35), 0 0 0 4px rgb(99 102 241 / 0.12)"), n && (o.borderColor = "#f59e0b", o.boxShadow = "0 0 0 4px rgb(251 191 36 / 0.18), 0 4px 12px rgb(15 23 42 / 0.12)"), e === "running" && (o.borderColor = "#3b82f6", o.boxShadow = "0 0 0 4px rgb(59 130 246 / 0.08), 0 0 18px rgb(59 130 246 / 0.16)"), e === "waiting" && (o.borderColor = "#f59e0b", o.boxShadow = "0 0 0 4px rgb(245 158 11 / 0.10), 0 0 20px rgb(245 158 11 / 0.28)"), e === "done" && (o.borderColor = "#10b981", o.boxShadow = "0 4px 12px rgb(16 185 129 / 0.15)"), e === "error" && (o.borderColor = "hsl(var(--destructive))", o.boxShadow = "0 4px 12px rgb(239 68 68 / 0.16)"), o;
}
function Zn(e, t) {
  let n = "rgb(15 23 42 / 0.34)";
  e === "done" && t === "source" && (n = "rgb(16 185 129 / 0.55)"), e === "running" && (n = "rgb(59 130 246 / 0.6)"), e === "waiting" && (n = "rgb(245 158 11 / 0.6)"), e === "error" && (n = "rgb(239 68 68 / 0.62)");
  const o = {
    width: 7,
    height: 7,
    top: "50%",
    transform: t === "target" ? "translate(-50%, -50%)" : "translate(50%, -50%)",
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: n,
    background: "hsl(var(--background))",
    boxShadow: "0 0 0 2px rgb(255 255 255 / 0.9)"
  };
  return t === "target" ? o.left = 0 : o.right = 0, o;
}
function As({ status: e }) {
  if (e === "running" || e === "idle")
    return null;
  const t = e === "done" ? /* @__PURE__ */ i(xr, { size: 10 }) : /* @__PURE__ */ i(vr, { size: 10 });
  return /* @__PURE__ */ i("span", { className: "team-graph-node-badge", style: Es(e), children: t });
}
function Es(e) {
  return e === "done" ? { background: "#10b981", color: "#fff" } : e === "waiting" ? { background: "#f59e0b", color: "#fff" } : e === "error" ? {
    background: "hsl(var(--destructive))",
    color: "hsl(var(--destructive-foreground))"
  } : { background: "hsl(var(--background))" };
}
function Ts({
  status: e,
  timing: t,
  now: n,
  idleText: o
}) {
  const r = Rs(t, n);
  return e === "running" ? `进行中${r}` : e === "waiting" ? "待决策" : e === "done" ? `已完成${r}` : e === "error" ? "已失败" : o || "待激活";
}
function Rs(e, t) {
  if (!e?.startedAt)
    return "";
  const n = e.finishedAt || t || Date.now();
  return `（${ys(n - e.startedAt)}）`;
}
function Os(e, t, n) {
  const o = String(t || "").toLowerCase(), r = String(e || "").toLowerCase();
  return n === "flow" ? /* @__PURE__ */ i(ut, { size: 20, color: "#6366f1" }) : o === "agent" ? /* @__PURE__ */ i(fr, { size: 20, color: "#3b82f6" }) : o === "role" ? /* @__PURE__ */ i(mr, { size: 20, color: "#6366f1" }) : o === "power" ? /* @__PURE__ */ i(gr, { size: 20, color: "#f59e0b" }) : o === "team" ? /* @__PURE__ */ i(ut, { size: 20, color: "#14b8a6" }) : o === "context" ? /* @__PURE__ */ i(pr, { size: 20, color: "#0ea5e9" }) : o === "knowledge" ? /* @__PURE__ */ i(_r, { size: 20, color: "#22c55e" }) : o === "condition" ? /* @__PURE__ */ i(br, { size: 20, color: "#f97316" }) : o === "merge" ? /* @__PURE__ */ i(yr, { size: 20, color: "#f43f5e" }) : o === "human_approval" ? /* @__PURE__ */ i(In, { size: 20, color: "#8b5cf6" }) : o === "save" ? /* @__PURE__ */ i(Fn, { size: 20, color: "#10b981" }) : r.includes("收集") || r.includes("输入") || r.includes("反馈") || r.includes("审批") ? /* @__PURE__ */ i(In, { size: 20, color: "#8b5cf6" }) : r.includes("保存") || r.includes("存储") || r.includes("入库") ? /* @__PURE__ */ i(Fn, { size: 20, color: "#10b981" }) : r.includes("写") || r.includes("剧本") || r.includes("故事") || r.includes("设计") || r.includes("创作") ? /* @__PURE__ */ i(hr, { size: 20, color: "#a855f7" }) : r.includes("背景") || r.includes("世界") || r.includes("元素") || r.includes("灵感") ? /* @__PURE__ */ i(wr, { size: 20, color: "#f59e0b" }) : /* @__PURE__ */ i(kr, { size: 20, color: "#71717a" });
}
function Ps(e) {
  const { data: t, selected: n, style: o, animated: r } = e, [s, a, c] = Mr({
    sourceX: e.sourceX,
    sourceY: e.sourceY,
    sourcePosition: e.sourcePosition,
    targetX: e.targetX,
    targetY: e.targetY,
    targetPosition: e.targetPosition
  });
  if (!t)
    return /* @__PURE__ */ i(Mt, { path: s, style: o });
  if (t.preview)
    return /* @__PURE__ */ i(Mt, { path: s, style: o, interactionWidth: 0 });
  const l = Lo(t.view, t.index), m = t.view === "flow" ? [] : mo(
    t.edge,
    t.nodes,
    t.edgeConditions
  ), f = m.length > 0, g = m[0]?.id ?? "", u = m.some(
    (x) => x.id === t.edge.condition
  ) && t.edge.condition || g, p = f || n, h = !!t.highlighted, w = {
    ...o,
    opacity: n ? 1 : h ? 0.95 : r ? 0.72 : 0.42,
    transition: "stroke 0.25s ease, stroke-width 0.25s ease, opacity 0.25s ease"
  };
  return /* @__PURE__ */ _(pn, { children: [
    /* @__PURE__ */ i(Mt, { path: s, style: w, interactionWidth: 32 }),
    r ? /* @__PURE__ */ _("g", { style: { opacity: n || h ? 0.9 : 0.45 }, children: [
      /* @__PURE__ */ i("circle", { r: "2.5", fill: "#6366f1", opacity: "0.25", children: /* @__PURE__ */ i("animateMotion", { dur: "3s", repeatCount: "indefinite", path: s }) }),
      /* @__PURE__ */ i("circle", { r: "1.5", fill: "#818cf8", children: /* @__PURE__ */ i("animateMotion", { dur: "3s", repeatCount: "indefinite", path: s }) })
    ] }) : null,
    p ? /* @__PURE__ */ i($r, { children: /* @__PURE__ */ i(
      "div",
      {
        className: "nodrag nopan nowheel absolute z-10 -translate-x-1/2 -translate-y-1/2",
        style: {
          transform: `translate(-50%, -50%) translate(${a}px, ${c}px)`,
          pointerEvents: "all"
        },
        onClick: (x) => {
          x.stopPropagation(), t.onSelect(l);
        },
        onContextMenu: (x) => {
          x.preventDefault(), x.stopPropagation(), t.onSelect(l);
        },
        children: f ? /* @__PURE__ */ _("div", { className: "relative w-24", children: [
          n && !t.readonly ? /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "absolute -right-2 -top-2 z-20 flex size-5 items-center justify-center rounded-full border border-destructive bg-background text-destructive shadow-sm hover:bg-destructive/10",
              title: "删除关系",
              onClick: (x) => {
                x.stopPropagation(), t.onDelete(l);
              },
              children: /* @__PURE__ */ i(ft, { className: "size-3" })
            }
          ) : null,
          /* @__PURE__ */ _(
            ms,
            {
              value: u,
              disabled: t.readonly,
              onValueChange: (x) => t.onChangeNodeEdge(t.index, { condition: x }),
              children: [
                /* @__PURE__ */ i(_s, { className: "h-7 justify-center rounded-full bg-background px-3 pr-3 text-xs shadow-sm [&_.select-trigger-chevron]:hidden", children: /* @__PURE__ */ i(bs, {}) }),
                /* @__PURE__ */ i(gs, { children: m.map((x) => /* @__PURE__ */ i(ps, { value: x.id, children: x.value }, x.id)) })
              ]
            }
          )
        ] }) : /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: Bo(
              "flex items-center justify-center rounded-full border bg-background text-xs text-foreground shadow-sm",
              n && !t.readonly ? "size-6 border-destructive text-destructive hover:bg-destructive/10" : "size-5 border-blue-300 text-blue-600"
            ),
            title: n && !t.readonly ? "删除关系" : "点击选中关系，Delete 删除",
            onClick: (x) => {
              x.stopPropagation(), n && !t.readonly ? t.onDelete(l) : t.onSelect(l);
            },
            children: n && !t.readonly ? /* @__PURE__ */ i(ft, { className: "size-3.5" }) : null
          }
        )
      }
    ) }) : null
  ] });
}
const Is = {
  teamGraphNode: Ns
}, Fs = {
  teamGraphEdge: Ps
};
function Ms(e) {
  const t = e.data;
  if (t.kind !== "node" || !t.onOpenNodeResult)
    return !1;
  const n = t.executionState?.nodeRunsByKey[e.id]?.status, o = t.executionState?.pendingApprovalsByNodeKey[e.id];
  return !!(n && !o);
}
function $s({
  approval: e,
  paramApi: t,
  onSubmit: n
}) {
  return /* @__PURE__ */ i(ds, { open: !0, children: /* @__PURE__ */ _(
    cs,
    {
      "data-assistant-layer": "true",
      "data-stop-card-click": "true",
      className: Bo(
        "flex max-h-[86vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl",
        "[&_*]:max-w-full [&_label]:min-w-0 [&_span]:break-words"
      ),
      showCloseButton: !1,
      onEscapeKeyDown: (o) => o.preventDefault(),
      onPointerDownOutside: (o) => o.preventDefault(),
      onInteractOutside: (o) => o.preventDefault(),
      onClick: (o) => o.stopPropagation(),
      onMouseDown: (o) => o.stopPropagation(),
      onPointerDown: (o) => o.stopPropagation(),
      onWheel: (o) => o.stopPropagation(),
      children: [
        /* @__PURE__ */ i(fs, { className: "sr-only", children: e.title || "需要补充信息" }),
        /* @__PURE__ */ i(us, { className: "sr-only", children: "填写并提交后，团队工作流会从当前节点继续执行。" }),
        /* @__PURE__ */ i(
          ls,
          {
            interaction: e.interaction,
            paramApi: t,
            layout: "dialog",
            onSubmit: (o) => n(e, o)
          }
        )
      ]
    }
  ) });
}
function zs({
  menu: e,
  onEdit: t,
  onDelete: n
}) {
  return e ? /* @__PURE__ */ _(
    "div",
    {
      className: "fixed z-50 min-w-32 rounded-md border bg-popover p-1 text-sm text-popover-foreground shadow-lg",
      style: { left: e.x, top: e.y },
      onClick: (o) => o.stopPropagation(),
      onContextMenu: (o) => o.preventDefault(),
      children: [
        e.target.kind === "flow" || e.target.kind === "node" ? /* @__PURE__ */ _(
          "button",
          {
            type: "button",
            className: "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left hover:bg-accent hover:text-accent-foreground",
            onClick: () => t(e.target),
            children: [
              /* @__PURE__ */ i(ct, { className: "size-4" }),
              "编辑"
            ]
          }
        ) : null,
        /* @__PURE__ */ _(
          "button",
          {
            type: "button",
            className: "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-destructive hover:bg-destructive/10",
            onClick: () => n(e.target),
            children: [
              /* @__PURE__ */ i(ao, { className: "size-4" }),
              "删除"
            ]
          }
        )
      ]
    }
  ) : null;
}
function Wt(e, t) {
  return e === "flow" ? t.key : t.node_key;
}
function jo(e, t = 0) {
  const n = Number(e.x), o = Number(e.y) + t;
  return {
    x: Number.isFinite(n) ? n : 0,
    y: Number.isFinite(o) ? o : 0
  };
}
function Bs(e, t) {
  const n = jo(t, -ke / 2);
  if (!e)
    return n;
  const o = ht(e), r = ht(n), s = r.x - o.x, a = r.y - o.y, c = Math.hypot(s, a);
  if (c > 0 && c <= ws)
    return n;
  const l = c > 0 ? s / c : 1, m = c > 0 ? a / c : 0;
  return {
    x: o.x + l * Vn - je / 2,
    y: o.y + m * Vn - ke / 2
  };
}
function Jn(e, t, n) {
  if (!js(e.id, n))
    return null;
  const o = ht(e.position);
  let r = null, s = Number.MAX_VALUE;
  if (t.forEach((l) => {
    if (l.id === e.id)
      return;
    const m = ht(l.position), f = Math.hypot(
      m.x - o.x,
      m.y - o.y
    );
    f < s && f < ks && (r = l, s = f);
  }), !r)
    return null;
  const a = r.position.x < e.position.x, c = {
    source: a ? r.id : e.id,
    target: a ? e.id : r.id
  };
  return qs(n, c) ? null : c;
}
function ht(e) {
  return {
    x: e.x + je / 2,
    y: e.y + ke / 2
  };
}
function js(e, t) {
  return !t.some((n) => n.from_key === e || n.to_key === e);
}
function Ls(e, t) {
  return t ? e.from_key === t || e.to_key === t : !1;
}
function qs(e, t) {
  return e.some(
    (n) => n.from_key === t.source && n.to_key === t.target
  );
}
function Gs(e, t) {
  return e?.source === t?.source && e?.target === t?.target;
}
function Ks(e) {
  return `proximity:${e.source}:${e.target}`;
}
function Qn(e, t) {
  if (!e.length)
    return t;
  const n = new Map(e.map((o) => [o.id, o]));
  return t.map((o) => {
    const r = n.get(o.id);
    return r ? { ...r, ...o, position: r.position } : o;
  });
}
function eo(e) {
  return e.name;
}
function Hs(e) {
  return "node_key" in e ? "" : e.goal || "";
}
function to(e) {
  return "node_key" in e && e.type || "";
}
function Yt(e, t) {
  return e === "flow" ? { kind: "flow", key: t } : { kind: "node", key: t };
}
function Us(e, t, n) {
  return `${e}:${t.from_key}->${t.to_key}:${n}`;
}
function no(e) {
  const t = e.data;
  return Lo(t.view, t.index);
}
function Lo(e, t) {
  return e === "flow" ? { kind: "flow_edge", index: t } : { kind: "node_edge", index: t };
}
function Ws(e) {
  const t = e.data;
  return t.view === "flow" ? !1 : mo(
    t.edge,
    t.nodes,
    t.edgeConditions
  ).length > 0;
}
function Ys(e) {
  if ("clientX" in e)
    return { x: e.clientX, y: e.clientY };
  const t = e.changedTouches[0] ?? e.touches[0];
  return t ? { x: t.clientX, y: t.clientY } : null;
}
function qo(e) {
  const t = e;
  if (!t)
    return !1;
  const n = t.tagName.toLowerCase();
  return n === "input" || n === "textarea" || n === "select" || t.isContentEditable || !!t.closest('[contenteditable="true"]');
}
function Xs(e) {
  const t = e.target;
  if (!t)
    return !1;
  if (qo(t))
    return !0;
  const n = t.closest(
    [
      "button",
      "a",
      "input",
      "textarea",
      "select",
      '[role="button"]',
      '[role="menuitem"]',
      '[role="option"]',
      '[data-assistant-layer="true"]',
      '[data-stop-card-click="true"]'
    ].join(",")
  );
  return !!(n && e.currentTarget.contains(n));
}
function Vs(e, t) {
  if (!e)
    return !1;
  const n = {
    x: e.x + je,
    y: e.y + ke / 2
  };
  return Math.hypot(t.x - n.x, t.y - n.y) > 48;
}
await window.DeverFront?.ensureCompat?.(["@/lib/utils", "@/components/ui/button", "@/components/ui/dialog", "@/components/ui/textarea", "@/components/agent/interaction-panel", "@/components/energon/content-view", "@/components/stream-timing"]);
const Xt = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!Xt || Object.keys(Xt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const Zs = Xt.cn, Vt = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!Vt || Object.keys(Vt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const Js = Vt.Button, Re = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!Re || Object.keys(Re).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const Go = Re.Dialog, Ko = Re.DialogContent, Ho = Re.DialogDescription, Uo = Re.DialogHeader, Wo = Re.DialogTitle, Zt = window.DeverFront?.sdk?.getCompatModule("@/components/ui/textarea");
if (!Zt || Object.keys(Zt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/textarea");
const Qs = Zt.Textarea, Jt = window.DeverFront?.sdk?.getCompatModule("@/components/agent/interaction-panel");
if (!Jt || Object.keys(Jt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/interaction-panel");
const Yo = Jt.AgentInteractionPanel, Qt = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!Qt || Object.keys(Qt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const Xo = Qt.EnergonContentView, Qe = window.DeverFront?.sdk?.getCompatModule("@/components/stream-timing");
if (!Qe || Object.keys(Qe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/stream-timing");
const ea = Qe.isStreamTimingRunning, Vo = Qe.StreamTimingBadge, Zo = Qe.useStreamClock;
function ta({
  open: e,
  target: t,
  prompt: n,
  running: o,
  result: r,
  paramApi: s,
  pendingApprovalsByNodeKey: a,
  onOpenChange: c,
  onPromptChange: l,
  onRun: m,
  onSubmitApproval: f
}) {
  const g = t === "team" ? "调试" : "调试工作流", u = String(r?.run?.status || r?.status || ""), p = u ? `当前状态：${To(u)}` : "调试会先自动保存，并使用当前保存内容运行", h = "输入目标后会先自动保存当前编辑内容，并使用保存后的内容执行；每个节点的执行状态和输出会显示在这里。", w = t === "team" ? "会先保存当前团队工作流编排，再按保存后的内容逐个执行。" : "会先保存当前工作流节点流程，再按节点顺序执行。";
  return /* @__PURE__ */ i(Go, { open: e, onOpenChange: c, children: /* @__PURE__ */ _(
    Ko,
    {
      className: "flex flex-col overflow-hidden sm:max-w-4xl",
      style: {
        height: "min(82vh, 48rem)",
        maxHeight: "min(82vh, 48rem)"
      },
      children: [
        /* @__PURE__ */ _(Uo, { children: [
          /* @__PURE__ */ i(Wo, { children: g }),
          /* @__PURE__ */ i(Ho, { className: "sr-only", children: w })
        ] }),
        /* @__PURE__ */ _("div", { className: "flex min-h-0 flex-1 flex-col gap-4", children: [
          /* @__PURE__ */ _("div", { className: "flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border bg-muted/20", children: [
            /* @__PURE__ */ _("div", { className: "flex items-center justify-between gap-3 border-b px-3 py-2", children: [
              /* @__PURE__ */ i("div", { className: "text-sm font-medium", children: "运行展示" }),
              /* @__PURE__ */ i("div", { className: "text-xs text-muted-foreground", children: p })
            ] }),
            /* @__PURE__ */ i("div", { className: "relative min-h-0 flex-1", children: r ? /* @__PURE__ */ i("div", { className: "absolute inset-0 overflow-hidden", children: /* @__PURE__ */ i(
              na,
              {
                result: r,
                paramApi: s,
                pendingApprovalsByNodeKey: a,
                onSubmitApproval: f
              }
            ) }) : /* @__PURE__ */ i("div", { className: "absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted-foreground", children: /* @__PURE__ */ i("span", { className: "max-w-3xl", children: h }) }) })
          ] }),
          /* @__PURE__ */ _("div", { className: "shrink-0 rounded-md border bg-background p-3 shadow-sm", children: [
            /* @__PURE__ */ i(
              Qs,
              {
                value: n,
                disabled: o,
                className: "min-h-24 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0",
                placeholder: "输入这次调试要完成的目标、输入材料或约束...",
                onChange: (x) => l(x.target.value)
              }
            ),
            /* @__PURE__ */ _("div", { className: "mt-3 flex items-center justify-between gap-3 border-t pt-3", children: [
              /* @__PURE__ */ i("div", { className: "text-xs text-muted-foreground", children: w }),
              /* @__PURE__ */ _(Js, { disabled: o, onClick: m, children: [
                o ? /* @__PURE__ */ i(Ae, { className: "size-4 animate-spin" }) : /* @__PURE__ */ i(ut, { className: "size-4" }),
                o ? "调试中" : "开始调试"
              ] })
            ] })
          ] })
        ] })
      ]
    }
  ) });
}
function na({
  result: e,
  paramApi: t,
  pendingApprovalsByNodeKey: n,
  onSubmitApproval: o
}) {
  const r = e?.run || {}, s = vn(T(e?.node_runs)), a = Sn(T(e?.agent_runs)), c = et(r.status) || s.some(
    (m) => Po(m, a[String(m.agent_run_id)])
  ), l = Zo(c);
  return e?.error && !e?.run ? /* @__PURE__ */ i("div", { className: "h-full overflow-auto p-4 text-sm text-destructive", children: String(e.error) }) : /* @__PURE__ */ _(
    "div",
    {
      className: "h-full space-y-3 overflow-auto p-4 text-sm",
      style: { maxHeight: "calc(min(82vh, 48rem) - 14rem)" },
      children: [
        s.length > 0 ? /* @__PURE__ */ i("div", { className: "space-y-3", children: s.map((m, f) => /* @__PURE__ */ i(
          oa,
          {
            row: m,
            index: f,
            agentTrace: a[String(m.agent_run_id)],
            approval: n[String(m?.node_key || "")],
            paramApi: t,
            now: l,
            onSubmitApproval: o
          },
          as(m, f)
        )) }) : /* @__PURE__ */ i("div", { className: "flex h-full min-h-72 items-center justify-center text-center text-sm text-muted-foreground", children: /* @__PURE__ */ _("div", { className: "inline-flex items-center gap-2", children: [
          /* @__PURE__ */ i(Ae, { className: "size-3 animate-spin" }),
          "正在等待节点开始执行..."
        ] }) }),
        r.error ? /* @__PURE__ */ i("div", { className: "rounded-md bg-destructive/10 p-3 text-xs text-destructive", children: r.error }) : null
      ]
    }
  );
}
function oa({
  row: e,
  index: t,
  agentTrace: n,
  approval: o,
  paramApi: r,
  now: s,
  onSubmitApproval: a
}) {
  const c = e.node_name || e.node_key || `节点 ${t + 1}`, l = String(e.node_type || ""), m = Fo(e, n), f = Dt(l) ? Ct(e, n) : void 0, g = Po(e, n), u = l === "save" ? zo(e.output) : "", p = Ro(e);
  return /* @__PURE__ */ _("article", { className: "rounded-md border bg-background p-3", children: [
    /* @__PURE__ */ _("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ _("div", { className: "min-w-0", children: [
        /* @__PURE__ */ _("div", { className: "font-medium", children: [
          t + 1,
          ". ",
          c
        ] }),
        /* @__PURE__ */ _("div", { className: "mt-1 text-xs text-muted-foreground", children: [
          bt(l),
          " ·",
          " ",
          ss(e.started_at, e.finished_at)
        ] })
      ] }),
      f ? /* @__PURE__ */ i(Vo, { timing: f, now: s, className: "max-w-full" }) : /* @__PURE__ */ i(Jo, { status: e.status, nodeType: l }),
      p ? /* @__PURE__ */ i("div", { className: "basis-full rounded bg-destructive/10 p-2 text-xs text-destructive", children: p }) : null
    ] }),
    u ? /* @__PURE__ */ i("div", { className: "mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800", children: u }) : null,
    o ? /* @__PURE__ */ i("div", { className: "mt-3 overflow-hidden rounded-md border border-amber-200 bg-amber-50/45", children: /* @__PURE__ */ i(
      Yo,
      {
        interaction: o.interaction,
        paramApi: r,
        layout: "inline",
        onSubmit: (h) => a(o, h)
      }
    ) }) : null,
    /* @__PURE__ */ i("div", { className: "mt-3 rounded-md border bg-muted/15 p-3", children: K(m) ? /* @__PURE__ */ i(Xo, { output: m, emptyText: "暂无节点输出。" }) : g ? /* @__PURE__ */ _("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ i(Ae, { className: "size-3 animate-spin" }),
      "正在等待节点输出..."
    ] }) : /* @__PURE__ */ i("div", { className: "text-xs text-muted-foreground", children: "暂无节点输出。" }) })
  ] });
}
function Jo({
  status: e,
  nodeType: t
}) {
  const n = String(e || _n);
  return /* @__PURE__ */ _(
    "span",
    {
      className: Zs(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs",
        Mi(n)
      ),
      children: [
        n === le ? /* @__PURE__ */ i(Ae, { className: "size-3 animate-spin" }) : null,
        Bi(n, t)
      ]
    }
  );
}
function ra({
  open: e,
  nodeKey: t,
  nodes: n,
  result: o,
  approval: r,
  paramApi: s,
  onOpenChange: a,
  onSubmitApproval: c
}) {
  const l = n.find((E) => E.node_key === t), m = vn(T(o?.node_runs)), f = m.find(
    (E) => String(E?.node_key || "") === t
  ), g = Sn(T(o?.agent_runs)), u = f?.agent_run_id ? g[String(f.agent_run_id)] : void 0, p = String(f?.node_type || l?.type || ""), h = f && !r ? Fo(f, u) : void 0, w = p === "save" && f ? zo(f.output) : "", x = f && Dt(p) ? Ct(f, u, { node: l, nodeRuns: m }) : void 0, P = ea(x) || !!(f && et(f.status)), C = Zo(P), v = Ro(f);
  return /* @__PURE__ */ i(Go, { open: e, onOpenChange: a, children: /* @__PURE__ */ _(
    Ko,
    {
      className: "flex max-w-none flex-col gap-0 overflow-hidden p-0",
      style: {
        width: "min(56rem, calc(100vw - 2rem))",
        height: "min(82vh, 48rem)"
      },
      children: [
        /* @__PURE__ */ _(Uo, { className: "shrink-0 border-b px-6 py-4", children: [
          /* @__PURE__ */ i(Wo, { className: "min-w-0 truncate pr-7", children: l?.name || f?.node_name || t || "节点结果" }),
          /* @__PURE__ */ i(Ho, { className: "sr-only", children: "查看当前节点的执行状态和输出结果。" })
        ] }),
        /* @__PURE__ */ _("div", { className: "min-h-0 min-w-0 flex-1 overflow-y-auto bg-background px-6 py-4", children: [
          x || f ? /* @__PURE__ */ _("div", { className: "mb-3 flex flex-wrap items-center gap-2 rounded-md border bg-muted/15 px-3 py-2", children: [
            /* @__PURE__ */ i("span", { className: "text-xs text-muted-foreground", children: "执行状态" }),
            x ? /* @__PURE__ */ i(
              Vo,
              {
                timing: x,
                now: C,
                className: "max-w-full"
              }
            ) : /* @__PURE__ */ i(Jo, { status: f?.status, nodeType: p })
          ] }) : null,
          v ? /* @__PURE__ */ i("div", { className: "mb-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive", children: v }) : null,
          w ? /* @__PURE__ */ i("div", { className: "mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800", children: w }) : null,
          r ? /* @__PURE__ */ i("div", { className: "mb-3 overflow-hidden rounded-md border border-amber-200 bg-amber-50/45", children: /* @__PURE__ */ i(
            Yo,
            {
              interaction: r.interaction,
              paramApi: s,
              layout: "inline",
              onSubmit: (E) => c(r, E)
            }
          ) }) : null,
          r ? null : K(h) ? /* @__PURE__ */ i(
            Xo,
            {
              output: h,
              emptyText: "暂无节点输出。",
              className: "min-w-0"
            }
          ) : P ? /* @__PURE__ */ _("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ i(Ae, { className: "size-4 animate-spin" }),
            "节点正在执行，等待输出..."
          ] }) : /* @__PURE__ */ i("div", { className: "text-sm text-muted-foreground", children: "这个节点还没有输出。" })
        ] })
      ]
    }
  ) });
}
function ia(e) {
  return {
    scope: "modal",
    route: "bot/team/flow",
    page: {
      name: "编辑工作流",
      title: e.name || e.key
    },
    form: {
      fields: sa(),
      values: aa(e)
    }
  };
}
function sa() {
  return Lr;
}
function aa(e) {
  const t = {};
  return e.name && (t["form.name"] = e.name), e.goal && (t["form.goal"] = e.goal), t;
}
function la(e, t, n) {
  const o = {}, r = oo(t, "form.name"), s = oo(t, "form.goal");
  r !== void 0 && (o.name = r), s !== void 0 && (o.goal = s), Object.keys(o).length > 0 && n(e, o);
}
function oo(e, t) {
  const n = t.replace(/^form\./, ""), o = e[t] ?? e[n];
  if (o != null)
    return typeof o == "string" ? o : JSON.stringify(o);
}
await window.DeverFront?.ensureCompat?.(["@/lib/utils", "@/components/ui/button", "@/components/assistant/form-actions", "@/components/ui/dialog", "@/components/ui/input", "@/components/ui/switch", "@/components/ui/textarea", "@/components/ui/radio-group", "@/components/searchable-option-picker"]);
const en = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!en || Object.keys(en).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const da = en.cn, tn = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!tn || Object.keys(tn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const ca = tn.Button, nn = window.DeverFront?.sdk?.getCompatModule("@/components/assistant/form-actions");
if (!nn || Object.keys(nn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/assistant/form-actions");
const ua = nn.AssistantContextFormFillButton, Oe = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!Oe || Object.keys(Oe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const fa = Oe.Dialog, ma = Oe.DialogClose, ga = Oe.DialogContent, pa = Oe.DialogHeader, _a = Oe.DialogTitle, on = window.DeverFront?.sdk?.getCompatModule("@/components/ui/input");
if (!on || Object.keys(on).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/input");
const wt = on.Input, rn = window.DeverFront?.sdk?.getCompatModule("@/components/ui/switch");
if (!rn || Object.keys(rn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/switch");
const ba = rn.Switch, sn = window.DeverFront?.sdk?.getCompatModule("@/components/ui/textarea");
if (!sn || Object.keys(sn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/textarea");
const an = sn.Textarea, kt = window.DeverFront?.sdk?.getCompatModule("@/components/ui/radio-group");
if (!kt || Object.keys(kt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/radio-group");
const ya = kt.RadioGroup, ha = kt.RadioGroupItem, ln = window.DeverFront?.sdk?.getCompatModule("@/components/searchable-option-picker");
if (!ln || Object.keys(ln).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/searchable-option-picker");
const oe = ln.SearchableOptionPicker;
function wa({
  open: e,
  onOpenChange: t,
  selected: n,
  flows: o,
  nodes: r,
  currentTeamID: s,
  currentTeamName: a,
  roles: c,
  roleTypes: l,
  agents: m,
  agentCates: f,
  assetCates: g,
  knowledgeCates: u,
  knowledgeBases: p,
  teamBindingOptions: h,
  powers: w,
  powerKinds: x,
  nodeTypes: P,
  readonly: C,
  onChangeFlow: v,
  onChangeNode: E
}) {
  if (!n)
    return null;
  const $ = Ea(n);
  let U = null, z = null;
  if (n.kind === "flow") {
    const N = o.find((I) => I.key === n.key);
    if (N) {
      const I = ia(N);
      z = C ? null : /* @__PURE__ */ i(
        ua,
        {
          context: I,
          className: "mt-[-0.125rem]",
          variant: "outline",
          size: "sm",
          onApplyValues: (W) => la(N.key, W, v)
        }
      ), U = /* @__PURE__ */ _("div", { className: "space-y-1", children: [
        /* @__PURE__ */ i(H, { label: "名称", children: /* @__PURE__ */ i(
          wt,
          {
            value: N.name || "",
            disabled: C,
            onChange: (W) => v(N.key, { name: W.target.value })
          }
        ) }),
        /* @__PURE__ */ i(H, { label: "目标", children: /* @__PURE__ */ i(
          an,
          {
            value: N.goal || "",
            disabled: C,
            onChange: (W) => v(N.key, { goal: W.target.value })
          }
        ) }),
        /* @__PURE__ */ i(H, { label: "画布助手调用", children: /* @__PURE__ */ _("div", { className: "flex items-center justify-between gap-4 rounded-md border px-3 py-2.5", children: [
          /* @__PURE__ */ i("span", { className: "text-sm text-muted-foreground", children: "允许画布助手启动此流程" }),
          /* @__PURE__ */ i(
            ba,
            {
              checked: !!N.config?.assistant_callable,
              disabled: C,
              "aria-label": "允许画布助手调用",
              onCheckedChange: (W) => v(N.key, {
                config: {
                  ...N.config ?? {},
                  assistant_callable: W
                }
              })
            }
          )
        ] }) })
      ] });
    }
  } else if (n.kind === "node") {
    const N = r.find((I) => I.node_key === n.key);
    U = N ? /* @__PURE__ */ _("div", { className: "space-y-1", children: [
      /* @__PURE__ */ i(H, { label: "名称", children: /* @__PURE__ */ i(
        wt,
        {
          value: N.name || "",
          disabled: C,
          onChange: (I) => E(N.node_key, { name: I.target.value })
        }
      ) }),
      /* @__PURE__ */ i(H, { label: "类型", children: /* @__PURE__ */ i(
        Qo,
        {
          options: P,
          value: N.type || "agent",
          onValueChange: (I) => E(
            N.node_key,
            Oa(N, I, g)
          ),
          disabled: C
        }
      ) }),
      N.type === "role" ? /* @__PURE__ */ i(
        ka,
        {
          node: N,
          roles: c,
          roleTypes: l,
          currentTeamID: s,
          currentTeamName: a,
          teams: h,
          readonly: C,
          onChangeNode: E
        }
      ) : null,
      N.type === "agent" ? /* @__PURE__ */ i(
        xa,
        {
          node: N,
          agents: m,
          agentCates: f,
          readonly: C,
          onChangeNode: E
        }
      ) : null,
      N.type === "power" ? /* @__PURE__ */ i(
        va,
        {
          node: N,
          powers: w,
          powerKinds: x,
          readonly: C,
          onChangeNode: E
        }
      ) : null,
      N.type === "team" ? /* @__PURE__ */ i(
        Na,
        {
          node: N,
          currentTeamID: s,
          currentTeamName: a,
          teams: h,
          readonly: C,
          onChangeNode: E
        }
      ) : null,
      N.type === "condition" ? /* @__PURE__ */ i(
        Sa,
        {
          node: N,
          readonly: C,
          onChangeNode: E
        }
      ) : null,
      N.type === "knowledge" ? /* @__PURE__ */ i(
        Da,
        {
          node: N,
          knowledgeCates: u,
          knowledgeBases: p,
          readonly: C,
          onChangeNode: E
        }
      ) : null,
      N.type === "context" || N.type === "save" ? /* @__PURE__ */ i(
        Ca,
        {
          node: N,
          assetCates: g,
          readonly: C,
          onChangeNode: E
        }
      ) : null,
      N.type === "agent" || N.type === "role" ? /* @__PURE__ */ i(H, { label: "目标", children: /* @__PURE__ */ i(
        an,
        {
          value: String(N.config?.goal ?? ""),
          disabled: C,
          placeholder: "填写给智能体的详细任务目标；留空时使用名称作为目标",
          onChange: (I) => E(N.node_key, {
            config: {
              ...N.config ?? {},
              goal: I.target.value
            }
          })
        }
      ) }) : null
    ] }) : null;
  }
  return /* @__PURE__ */ i(fa, { open: e, onOpenChange: t, children: /* @__PURE__ */ _(
    ga,
    {
      showCloseButton: !1,
      className: "flex flex-col gap-0 overflow-visible p-0 sm:max-w-2xl",
      style: { maxHeight: "min(82vh, 48rem)" },
      children: [
        /* @__PURE__ */ i(pa, { className: "shrink-0 px-6 py-4 text-start", children: /* @__PURE__ */ _("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ i(_a, { className: "min-w-0 pt-1", children: $ }),
          /* @__PURE__ */ _("div", { className: "flex shrink-0 items-start gap-2", children: [
            z,
            /* @__PURE__ */ i(ma, { asChild: !0, children: /* @__PURE__ */ _(
              ca,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                className: "-mr-3 -mt-2 size-8 shrink-0 self-start",
                children: [
                  /* @__PURE__ */ i("span", { className: "sr-only", children: "关闭" }),
                  /* @__PURE__ */ i(ft, { className: "size-4" })
                ]
              }
            ) })
          ] })
        ] }) }),
        /* @__PURE__ */ i("div", { className: "min-h-0 overflow-y-auto px-6 pb-6 pt-2", children: U })
      ]
    }
  ) });
}
function Qo({
  options: e,
  value: t,
  disabled: n,
  onValueChange: o
}) {
  return /* @__PURE__ */ i(
    ya,
    {
      value: t,
      onValueChange: o,
      className: "grid gap-2 sm:grid-cols-2",
      disabled: n,
      children: e.map((r) => /* @__PURE__ */ _(
        "label",
        {
          className: da(
            "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm",
            t === r.id && "border-primary bg-primary/5 text-primary",
            n && "cursor-not-allowed opacity-60"
          ),
          children: [
            /* @__PURE__ */ i(ha, { value: r.id, disabled: n }),
            /* @__PURE__ */ i("span", { children: r.value })
          ]
        },
        r.id
      ))
    }
  );
}
function ka({
  node: e,
  roles: t,
  roleTypes: n,
  currentTeamID: o,
  currentTeamName: r,
  teams: s,
  readonly: a,
  onChangeNode: c
}) {
  const l = Number(e.role_id || e.config?.role_id || 0), m = s.length ? s : bn({
    currentTeamID: o,
    currentTeamName: r,
    flows: [],
    roles: t,
    teams: s
  }), f = qr(m, l), g = Number(
    e.config?.role_team_id || f?.team_id || o || m[0]?.id || 0
  ), p = pt(m, g)?.roles ?? [], h = p[0]?.role_type || n[0]?.id || "", w = String(
    e.config?.role_type || f?.role_type || h
  ), x = w ? p.filter((v) => v.role_type === w) : p, P = x.some((v) => v.id === l) ? String(l) : void 0, C = f?.name || "";
  return /* @__PURE__ */ i(H, { label: "绑定角色", children: /* @__PURE__ */ _("div", { className: "grid gap-2 sm:grid-cols-3", children: [
    /* @__PURE__ */ i(
      oe,
      {
        value: g ? String(g) : void 0,
        options: m.map((v) => ({
          id: v.id,
          value: v.name || "未命名团队"
        })),
        disabled: a,
        clearable: !1,
        placeholder: "选择团队",
        searchPlaceholder: "输入团队筛选...",
        emptyText: "未找到团队",
        onChange: (v) => {
          const E = Array.isArray(v) ? v[0] ?? "" : v, $ = Number(E || o || 0), z = pt(m, $)?.roles?.[0]?.role_type || w;
          c(
            e.node_key,
            G(
              e,
              {
                role_id: 0,
                role_key: "",
                config: {
                  ...e.config ?? {},
                  role_team_id: $,
                  role_id: 0,
                  role_key: "",
                  role_type: z
                }
              },
              "团队角色",
              [C]
            )
          );
        }
      }
    ),
    /* @__PURE__ */ i(
      oe,
      {
        value: w || void 0,
        options: n,
        disabled: a,
        clearable: !1,
        placeholder: "选择角色类型",
        searchPlaceholder: "输入角色类型筛选...",
        onChange: (v) => {
          const E = Array.isArray(v) ? v[0] ?? "" : v;
          c(
            e.node_key,
            G(
              e,
              {
                role_id: 0,
                role_key: "",
                config: {
                  ...e.config ?? {},
                  role_team_id: g,
                  role_id: 0,
                  role_key: "",
                  role_type: E
                }
              },
              "团队角色",
              [C]
            )
          );
        }
      }
    ),
    /* @__PURE__ */ i(
      oe,
      {
        value: P,
        options: x.map((v) => ({
          id: v.id,
          value: v.name || v.role_key || "未命名角色"
        })),
        disabled: a,
        placeholder: "选择角色",
        searchPlaceholder: "输入角色筛选...",
        emptyText: "未找到团队角色",
        onClear: () => c(
          e.node_key,
          G(
            e,
            {
              role_id: 0,
              role_key: "",
              config: {
                ...e.config ?? {},
                role_team_id: g,
                role_id: 0,
                role_key: "",
                role_type: w
              }
            },
            "团队角色",
            [C]
          )
        ),
        onChange: (v) => {
          const E = Array.isArray(v) ? v[0] ?? "" : v, $ = x.find(
            (U) => String(U.id) === String(E)
          );
          c(
            e.node_key,
            G(
              e,
              {
                role_id: $?.id || 0,
                role_key: $?.role_key || "",
                config: {
                  ...e.config ?? {},
                  role_team_id: g,
                  role_id: $?.id || 0,
                  role_key: $?.role_key || "",
                  role_type: $?.role_type || w
                }
              },
              $?.name || "团队角色",
              [C]
            )
          );
        }
      }
    )
  ] }) });
}
function xa({
  node: e,
  agents: t,
  agentCates: n,
  readonly: o,
  onChangeNode: r
}) {
  const s = Number(e.agent_id || e.config?.agent_id || 0), a = t.find((c) => c.id === s);
  return /* @__PURE__ */ i(H, { label: "绑定智能体", children: /* @__PURE__ */ i(
    Aa,
    {
      agentID: s,
      cateID: Number(e.config?.agent_cate_id || 0),
      agents: t,
      agentCates: n,
      disabled: o,
      onChange: ({ agentID: c, cateID: l }) => {
        const m = t.find((f) => f.id === c);
        r(
          e.node_key,
          G(
            e,
            {
              agent_id: c,
              config: {
                ...e.config ?? {},
                agent_cate_id: l
              }
            },
            m?.name || "智能体",
            [a?.name]
          )
        );
      }
    }
  ) });
}
function va({
  node: e,
  powers: t,
  powerKinds: n,
  readonly: o,
  onChangeNode: r
}) {
  const s = Number(e.power_id || e.config?.power_id || 0), a = t.find((f) => f.id === s), c = n.length ? n : Kr(t), l = String(
    e.config?.power_kind || a?.kind || c[0]?.id || t[0]?.kind || ""
  ), m = l ? t.filter((f) => f.kind === l) : t;
  return /* @__PURE__ */ i(H, { label: "绑定能力", children: /* @__PURE__ */ _("div", { className: "grid gap-2 sm:grid-cols-2", children: [
    /* @__PURE__ */ i(
      oe,
      {
        value: l || void 0,
        options: c.map((f) => ({ id: f.id, value: f.value })),
        disabled: o,
        clearable: !1,
        placeholder: "选择能力类型",
        searchPlaceholder: "输入能力类型筛选...",
        onChange: (f) => {
          const g = Array.isArray(f) ? f[0] ?? "" : f, u = t.find((p) => p.kind === g);
          r(
            e.node_key,
            G(
              e,
              {
                power_id: u?.id || 0,
                config: {
                  ...e.config ?? {},
                  power_kind: g,
                  power_id: u?.id || 0,
                  power_key: u?.key || ""
                }
              },
              u?.name || "能力",
              [a?.name]
            )
          );
        }
      }
    ),
    /* @__PURE__ */ i(
      oe,
      {
        value: s ? String(s) : void 0,
        options: m.map((f) => ({
          id: f.id,
          value: f.name || "未命名能力"
        })),
        disabled: o,
        placeholder: "选择能力",
        searchPlaceholder: "输入能力筛选...",
        emptyText: "未找到匹配能力",
        onClear: () => r(
          e.node_key,
          G(
            e,
            {
              power_id: 0,
              config: {
                ...e.config ?? {},
                power_id: 0,
                power_key: ""
              }
            },
            "能力",
            [a?.name]
          )
        ),
        onChange: (f) => {
          const g = Array.isArray(f) ? f[0] ?? "" : f, u = t.find(
            (p) => String(p.id) === String(g)
          );
          r(
            e.node_key,
            G(
              e,
              {
                power_id: u?.id || 0,
                config: {
                  ...e.config ?? {},
                  power_kind: u?.kind || l,
                  power_id: u?.id || 0,
                  power_key: u?.key || ""
                }
              },
              u?.name || "能力",
              [a?.name]
            )
          );
        }
      }
    )
  ] }) });
}
function Na({
  node: e,
  currentTeamID: t,
  currentTeamName: n,
  teams: o,
  readonly: r,
  onChangeNode: s
}) {
  const a = Number(
    e.sub_team_id || e.config?.sub_team_id || t || o[0]?.id || 0
  ), c = o.length ? o : bn({
    currentTeamID: t,
    currentTeamName: n,
    flows: [],
    roles: [],
    teams: o
  }), l = pt(c, a), m = (l?.flows ?? []).filter(
    (p) => !!p.id
  ), f = Number(
    e.config?.sub_flow_id || e.config?.flow_id || 0
  ), g = m.find(
    (p) => Number(p.id || 0) === f
  ), u = dt(l, g);
  return /* @__PURE__ */ i(H, { label: "工作流", children: /* @__PURE__ */ _("div", { className: "grid gap-2 sm:grid-cols-2", children: [
    /* @__PURE__ */ i(
      oe,
      {
        value: a ? String(a) : void 0,
        options: c.map((p) => ({
          id: p.id,
          value: p.name || "未命名团队"
        })),
        disabled: r,
        clearable: !1,
        placeholder: "选择团队",
        searchPlaceholder: "输入团队筛选...",
        emptyText: "未找到团队",
        onChange: (p) => {
          const h = Array.isArray(p) ? p[0] ?? "" : p, w = pt(c, Number(h)), x = w?.id || t || 0;
          s(
            e.node_key,
            G(
              e,
              {
                sub_team_id: x,
                config: {
                  ...e.config ?? {},
                  sub_team_id: x,
                  release_id: w?.release_id || 0,
                  sub_flow_id: 0,
                  sub_flow_key: ""
                }
              },
              dt(w),
              [u]
            )
          );
        }
      }
    ),
    /* @__PURE__ */ i(
      oe,
      {
        value: f ? String(f) : void 0,
        options: m.map((p) => ({
          id: p.id || 0,
          value: p.name || p.key || "未命名工作流"
        })),
        disabled: r,
        placeholder: "团队总工作流",
        searchPlaceholder: "输入工作流筛选...",
        emptyText: "未找到工作流",
        onClear: () => s(
          e.node_key,
          G(
            e,
            {
              config: {
                ...e.config ?? {},
                sub_team_id: a,
                release_id: l?.release_id || 0,
                sub_flow_id: 0,
                sub_flow_key: ""
              }
            },
            dt(l),
            [u]
          )
        ),
        onChange: (p) => {
          const h = Array.isArray(p) ? p[0] ?? "" : p, w = m.find(
            (x) => String(x.id || "") === String(h)
          );
          s(
            e.node_key,
            G(
              e,
              {
                sub_team_id: a,
                config: {
                  ...e.config ?? {},
                  sub_team_id: a,
                  release_id: l?.release_id || 0,
                  sub_flow_id: w?.id || 0,
                  sub_flow_key: w?.key || ""
                }
              },
              dt(l, w),
              [u]
            )
          );
        }
      }
    )
  ] }) });
}
function Sa({
  node: e,
  readonly: t,
  onChangeNode: n
}) {
  const o = yn(e.config?.operator), r = o === "contains" || o === "equals", s = (a) => n(e.node_key, {
    config: {
      ...e.config ?? {},
      ...a
    }
  });
  return /* @__PURE__ */ _(pn, { children: [
    /* @__PURE__ */ i(H, { label: "判断方式", children: /* @__PURE__ */ i(
      Qo,
      {
        options: uo,
        value: o,
        disabled: t,
        onValueChange: (a) => s({ operator: a })
      }
    ) }),
    r ? /* @__PURE__ */ i(H, { label: "判断值", children: /* @__PURE__ */ i(
      wt,
      {
        value: String(e.config?.value ?? ""),
        disabled: t,
        placeholder: o === "contains" ? "输入要包含的内容" : "输入要完全等于的内容",
        onChange: (a) => s({ value: a.target.value })
      }
    ) }) : null
  ] });
}
function Da({
  node: e,
  knowledgeCates: t,
  knowledgeBases: n,
  readonly: o,
  onChangeNode: r
}) {
  const s = Number(e.config?.knowledge_base_id || 0), a = ro(n, s), c = t.length ? t : $a(n), l = Number(
    a?.cate_id || e.config?.knowledge_cate_id || c[0]?.id || n[0]?.cate_id || 0
  ), m = l ? n.filter(
    (u) => Number(u.cate_id || 0) === l
  ) : n, f = io(a), g = (u) => r(e.node_key, {
    config: {
      ...M(e.config, ["goal"]),
      ...u
    }
  });
  return /* @__PURE__ */ _(pn, { children: [
    /* @__PURE__ */ i(H, { label: "知识库", children: /* @__PURE__ */ _("div", { className: "grid gap-2 sm:grid-cols-2", children: [
      /* @__PURE__ */ i(
        oe,
        {
          value: l ? String(l) : void 0,
          options: c.map((u) => ({
            id: u.id,
            value: La(u)
          })),
          disabled: o,
          clearable: !1,
          placeholder: "选择分类",
          searchPlaceholder: "输入分类筛选...",
          emptyText: "未找到知识库分类",
          onChange: (u) => {
            const p = Array.isArray(u) ? u[0] ?? "" : u, h = Number(p || 0), w = a && Number(a.cate_id || 0) === h;
            r(
              e.node_key,
              G(
                e,
                {
                  config: {
                    ...M(e.config, ["goal"]),
                    knowledge_cate_id: h,
                    knowledge_base_id: w ? s : 0
                  }
                },
                w ? f : "知识库",
                [f]
              )
            );
          }
        }
      ),
      /* @__PURE__ */ i(
        oe,
        {
          value: m.some((u) => Number(u.id) === s) ? String(s) : void 0,
          options: m.map((u) => ({
            id: u.id,
            value: ja(u)
          })),
          disabled: o,
          placeholder: "选择知识库",
          searchPlaceholder: "输入知识库筛选...",
          emptyText: "未找到知识库",
          onClear: () => r(
            e.node_key,
            G(
              e,
              {
                config: {
                  ...M(e.config, ["goal"]),
                  knowledge_cate_id: l,
                  knowledge_base_id: 0
                }
              },
              "知识库",
              [f]
            )
          ),
          onChange: (u) => {
            const p = Array.isArray(u) ? u[0] ?? "" : u, h = Number(p || 0), w = ro(n, h);
            r(
              e.node_key,
              G(
                e,
                {
                  config: {
                    ...M(e.config, ["goal"]),
                    knowledge_cate_id: Number(
                      w?.cate_id || l || 0
                    ),
                    knowledge_base_id: h
                  }
                },
                io(w),
                [f]
              )
            );
          }
        }
      )
    ] }) }),
    /* @__PURE__ */ i(H, { label: "查询内容", children: /* @__PURE__ */ i(
      an,
      {
        value: String(e.config?.query ?? e.config?.goal ?? ""),
        disabled: o,
        placeholder: "填写从知识库获取内容的提示词；留空时使用节点名称",
        onChange: (u) => g({ query: u.target.value })
      }
    ) }),
    /* @__PURE__ */ i(H, { label: "召回数量", children: /* @__PURE__ */ _("div", { className: "space-y-1", children: [
      /* @__PURE__ */ i(
        wt,
        {
          type: "number",
          min: 0,
          value: Number(e.config?.retrieve_limit || 0) || "",
          disabled: o,
          placeholder: "使用知识库默认值",
          onChange: (u) => g({ retrieve_limit: Number(u.target.value || 0) })
        }
      ),
      /* @__PURE__ */ i("div", { className: "text-xs text-muted-foreground", children: "每次检索从知识库取回的候选内容条数；留空使用知识库默认值，数量越大上下文越全，也会占用更多上下文。" })
    ] }) })
  ] });
}
function Ca({
  node: e,
  assetCates: t,
  readonly: n,
  onChangeNode: o
}) {
  const r = Number(
    e.asset_cate_id || e.config?.asset_cate_id || 0
  ), s = dn(t, r);
  return /* @__PURE__ */ i(H, { label: "资产类型", children: /* @__PURE__ */ i(
    oe,
    {
      value: r ? String(r) : void 0,
      options: t.map((a) => ({
        id: a.id,
        value: Ba(a)
      })),
      disabled: n,
      placeholder: "选择资产类型",
      searchPlaceholder: "输入资产类型筛选...",
      emptyText: "未找到资产类型",
      onClear: () => o(
        e.node_key,
        G(
          e,
          {
            asset_cate_id: 0,
            config: {
              ...e.config ?? {},
              asset_cate_id: 0
            }
          },
          Je(e.type),
          [Je(e.type, s)]
        )
      ),
      onChange: (a) => {
        const c = Array.isArray(a) ? a[0] ?? "" : a, l = Number(c || 0), m = dn(t, l);
        o(
          e.node_key,
          G(
            e,
            {
              asset_cate_id: l,
              config: {
                ...e.config ?? {},
                asset_cate_id: l
              }
            },
            Je(e.type, m),
            [Je(e.type, s)]
          )
        );
      }
    }
  ) });
}
function Aa({
  agentID: e,
  cateID: t,
  agents: n,
  agentCates: o,
  disabled: r = !1,
  onChange: s
}) {
  const a = hn(n), c = a.find((g) => g.id === e), l = o.length ? _o(o) : Gr(a), m = String(
    c?.cate_id || t || l[0]?.id || ""
  ), f = m ? a.filter(
    (g) => String(g.cate_id || "") === m
  ) : a;
  return /* @__PURE__ */ _("div", { className: "grid grid-cols-2 gap-2", children: [
    /* @__PURE__ */ i(
      oe,
      {
        value: m || void 0,
        options: l.map((g) => ({
          id: g.id,
          value: za(g)
        })),
        disabled: r,
        clearable: !1,
        placeholder: "选择分类",
        searchPlaceholder: "输入分类筛选...",
        emptyText: "未找到智能体分类",
        onChange: (g) => {
          const u = Array.isArray(g) ? g[0] ?? "" : g, p = a.find(
            (w) => w.id === e
          ), h = p && String(p.cate_id || "") === String(u);
          s({
            agentID: h ? Number(e || 0) : 0,
            cateID: Number(u)
          });
        }
      }
    ),
    /* @__PURE__ */ i(
      oe,
      {
        value: e ? String(e) : void 0,
        options: f.map((g) => ({
          id: g.id,
          value: g.name || "未命名智能体"
        })),
        disabled: r,
        clearable: !1,
        placeholder: "选择智能体",
        searchPlaceholder: "输入智能体筛选...",
        emptyText: "未找到智能体",
        onChange: (g) => {
          const u = Array.isArray(g) ? g[0] ?? "" : g, p = a.find((h) => String(h.id) === u);
          s({
            agentID: Number(u),
            cateID: Number(p?.cate_id || m || 0)
          });
        }
      }
    )
  ] });
}
function Ea(e) {
  return e.kind === "flow" ? "编辑工作流" : e.kind === "node" ? "编辑节点" : e.kind === "flow_edge" ? "编辑工作流关系" : "编辑节点关系";
}
function Ta(e) {
  return e?.kind === "flow" ? "删除工作流" : e?.kind === "flow_edge" || e?.kind === "node_edge" ? "删除关系" : "删除图中项目";
}
function Ra(e) {
  return e?.kind === "flow" ? "保存后该工作流会被停用，不做物理删除，已发布或历史运行数据不会被直接清掉。" : e?.kind === "flow_edge" || e?.kind === "node_edge" ? "删除后会移除这条关系线。保存前仍只在当前编辑状态中生效。" : "删除后会同时移除关联连线。保存前仍只在当前编辑状态中生效。";
}
function Oa(e, t, n = []) {
  const o = M(e.config, [
    "goal",
    "agent_cate_id",
    "knowledge_cate_id",
    "knowledge_base_id",
    "query",
    "retrieve_limit",
    "role_id",
    "role_key",
    "role_team_id",
    "role_type",
    "power_id",
    "power_key",
    "power_kind",
    "sub_team_id",
    "sub_flow_id",
    "sub_flow_key",
    "release_id",
    "asset_cate_id",
    "operator",
    "source_key",
    "input_key",
    "value",
    "body_key",
    "content_key"
  ]), r = {
    role_id: 0,
    role_key: "",
    agent_id: 0,
    power_id: 0,
    sub_team_id: 0
  }, s = Number(
    e.asset_cate_id || e.config?.asset_cate_id || 0
  ), a = dn(n, s), c = (l, m = Ma(t, a)) => G(e, l, m);
  return t === "agent" ? c({
    type: t,
    ...r,
    asset_cate_id: 0,
    config: M(e.config, [
      "role_id",
      "role_key",
      "role_team_id",
      "role_type",
      "knowledge_cate_id",
      "knowledge_base_id",
      "query",
      "retrieve_limit",
      "power_id",
      "power_key",
      "power_kind",
      "sub_team_id",
      "sub_flow_id",
      "sub_flow_key",
      "release_id",
      "asset_cate_id",
      "operator",
      "source_key",
      "input_key",
      "value",
      "body_key",
      "content_key"
    ])
  }) : t === "role" ? c({
    type: t,
    ...r,
    asset_cate_id: 0,
    config: M(e.config, [
      "agent_cate_id",
      "knowledge_cate_id",
      "knowledge_base_id",
      "query",
      "retrieve_limit",
      "power_id",
      "power_key",
      "power_kind",
      "sub_team_id",
      "sub_flow_id",
      "sub_flow_key",
      "release_id",
      "asset_cate_id",
      "operator",
      "source_key",
      "input_key",
      "value",
      "body_key",
      "content_key"
    ])
  }) : t === "power" ? c({
    type: t,
    ...r,
    asset_cate_id: 0,
    config: M(e.config, [
      "goal",
      "agent_cate_id",
      "knowledge_cate_id",
      "knowledge_base_id",
      "query",
      "retrieve_limit",
      "role_id",
      "role_key",
      "role_team_id",
      "role_type",
      "sub_team_id",
      "sub_flow_id",
      "sub_flow_key",
      "release_id",
      "asset_cate_id",
      "operator",
      "source_key",
      "input_key",
      "value",
      "body_key",
      "content_key"
    ])
  }) : t === "team" ? c({
    type: t,
    ...r,
    asset_cate_id: 0,
    config: M(e.config, [
      "goal",
      "agent_cate_id",
      "knowledge_cate_id",
      "knowledge_base_id",
      "query",
      "retrieve_limit",
      "role_id",
      "role_key",
      "role_team_id",
      "role_type",
      "power_id",
      "power_key",
      "power_kind",
      "asset_cate_id",
      "operator",
      "source_key",
      "input_key",
      "value",
      "body_key",
      "content_key"
    ])
  }) : t === "condition" ? c({
    type: t,
    ...r,
    asset_cate_id: 0,
    config: {
      ...M(e.config, [
        "goal",
        "agent_cate_id",
        "knowledge_cate_id",
        "knowledge_base_id",
        "query",
        "retrieve_limit",
        "role_id",
        "role_key",
        "role_team_id",
        "role_type",
        "power_id",
        "power_key",
        "power_kind",
        "sub_team_id",
        "sub_flow_id",
        "sub_flow_key",
        "release_id",
        "asset_cate_id",
        "body_key",
        "content_key"
      ]),
      operator: yn(e.config?.operator)
    }
  }) : t === "knowledge" ? c(
    {
      type: t,
      ...r,
      asset_cate_id: 0,
      config: {
        ...o,
        knowledge_cate_id: Number(e.config?.knowledge_cate_id || 0),
        knowledge_base_id: Number(e.config?.knowledge_base_id || 0),
        query: String(e.config?.query ?? e.config?.goal ?? ""),
        retrieve_limit: Number(e.config?.retrieve_limit || 0)
      }
    },
    "知识库"
  ) : c(t === "save" ? {
    type: t,
    ...r,
    asset_cate_id: s,
    config: o
  } : t === "context" ? {
    type: t,
    ...r,
    asset_cate_id: s,
    config: o
  } : {
    type: t,
    ...r,
    asset_cate_id: 0,
    config: o
  });
}
const Pa = /* @__PURE__ */ new Set([
  "智能体",
  "团队角色",
  "能力",
  "团队工作流",
  "读取上下文",
  "保存结果",
  "知识库",
  "条件判断",
  "合并结果",
  "人工确认"
]);
function G(e, t, n, o = []) {
  const r = String(n || "").trim();
  return !r || !Ia(e.name, o) ? t : { ...t, name: r };
}
function Ia(e, t = []) {
  const n = String(e || "").trim();
  return Fa(n) || Pa.has(n) || n.startsWith("读取：") || n.startsWith("保存：") || n.startsWith("知识库：") ? !0 : t.some(
    (o) => String(o || "").trim() !== "" && String(o || "").trim() === n
  );
}
function Fa(e) {
  const t = String(e || "").trim();
  if (!t || t === "节点")
    return !0;
  if (!t.startsWith("节点"))
    return !1;
  const n = t.slice(2);
  return n !== "" && /^\d+$/.test(n);
}
function Ma(e, t) {
  return e === "context" || e === "save" ? Je(e, t) : e === "agent" ? "智能体" : e === "role" ? "团队角色" : e === "power" ? "能力" : e === "team" ? "团队工作流" : e === "knowledge" ? "知识库" : e === "condition" ? "条件判断" : e === "merge" ? "合并结果" : e === "human_approval" ? "人工确认" : String(e || "").trim();
}
function Je(e, t) {
  const n = String(t?.name || "").trim();
  return e === "context" ? n ? `读取：${n}` : "读取上下文" : n ? `保存：${n}` : "保存结果";
}
function dn(e, t) {
  return e.find((n) => Number(n.id) === Number(t));
}
function ro(e, t) {
  return e.find(
    (n) => Number(n.id) === Number(t)
  );
}
function $a(e) {
  return Array.from(
    new Set(
      e.map((n) => Number(n.cate_id || 0)).filter(Boolean)
    )
  ).map((n) => ({
    id: n,
    value: `分类${n}`
  }));
}
function dt(e, t) {
  const n = String(e?.name || "").trim(), o = String(t?.name || t?.key || "").trim();
  return n && o ? `${n} / ${o}` : n || "团队工作流";
}
function za(e) {
  return String(e.value || e.name || e.id);
}
function Ba(e) {
  return String(e.name || e.id);
}
function ja(e) {
  return String(e.name || e.id);
}
function La(e) {
  return String(e.value || e.name || e.id);
}
function io(e) {
  const t = String(e?.name || "").trim();
  return t ? `知识库：${t}` : "知识库";
}
function H({ label: e, children: t }) {
  return /* @__PURE__ */ _("div", { className: "mb-4 space-y-2 text-sm", children: [
    /* @__PURE__ */ i("div", { className: "font-medium", children: e }),
    t
  ] });
}
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/lib/utils", "@/components/ui/button", "@/components/confirm-dialog", "@/components/assistant/task-popover"]);
const cn = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!cn || Object.keys(cn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const De = cn.request, un = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!un || Object.keys(un).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const $t = un.cn, fn = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!fn || Object.keys(fn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const he = fn.Button, mn = window.DeverFront?.sdk?.getCompatModule("@/components/confirm-dialog");
if (!mn || Object.keys(mn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/confirm-dialog");
const so = mn.ConfirmDialog, gn = window.DeverFront?.sdk?.getCompatModule("@/components/assistant/task-popover");
if (!gn || Object.keys(gn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/assistant/task-popover");
const qa = gn.AssistantTaskPopover;
function Xa({ item: e }) {
  const t = e.meta ?? {}, n = Ce(() => Ga(), []), [o, r] = O({}), [s, a] = O(!1), [c, l] = O(!1), [m, f] = O("flow"), [g, u] = O(""), [p, h] = O(null), [w, x] = O(null), [P, C] = O(!1), [v, E] = O(null), [$, U] = O(!1), [z, N] = O(""), [I, W] = O(!1), [Pe, Ie] = O("team"), [He, Fe] = O(""), [re, ue] = O(!1), [Y, X] = O(null), [ie, ee] = O(""), [Me, Q] = O(() => /* @__PURE__ */ new Set()), $e = String(t.workspaceApi || "/bot/admin/team/workspace_data"), ze = String(t.saveFlowApi || "/bot/admin/team/save_flow_graph"), tt = String(t.saveNodeApi || "/bot/admin/team/save_node_graph"), At = String(t.runTeamApi || "/bot/admin/team/run_team"), Et = String(t.runFlowApi || "/bot/admin/team/run_flow"), nt = String(
    t.runStatusApi || "/bot/admin/team/run_status"
  ), ot = String(t.streamApi || "/bot/admin/team/stream"), Tt = String(t.approvalApi || "/bot/admin/team/submit_approval"), Rt = String(
    t.interactionApi || "/bot/admin/team/submit_interaction"
  ), Ue = String(t.paramApi || "/bot/admin/energon/power_params"), Ot = wn(
    o.team?.publish_status
  ), Ne = bo(o.team), de = o.flows ?? [], We = o.flow_edges ?? [], _e = de.find((d) => d.key === g), be = g ? o.nodes_by_flow?.[g] ?? [] : [], Be = g ? o.edges_by_flow?.[g] ?? [] : [], b = o.roles ?? [], k = o.agents ?? [], D = o.agent_cates ?? [], L = o.asset_cates ?? [], Z = o.knowledge_cates ?? [], se = o.knowledge_bases ?? [], ce = o.teams ?? [], Ye = o.role_types?.length ? o.role_types : lo, fe = Ce(
    () => bn({
      currentTeamID: n,
      currentTeamName: String(o.team?.name || "当前团队"),
      flows: de,
      roles: b,
      teams: ce
    }),
    [de, b, n, ce, o.team?.name]
  ), rt = o.powers ?? [], Pt = o.power_kinds ?? [], Dn = Zr(
    o.node_types?.length ? o.node_types : xt
  ), er = o.edge_conditions?.length ? o.edge_conditions : co, ye = m === "node" && Pe === "flow" && !!(re || Y), B = Ne || ye, it = Ce(
    () => Ri(Y, Me),
    [Y, Me]
  ), tr = Ce(
    () => ye ? $i(
      Y,
      be,
      Be,
      re,
      it
    ) : null,
    [
      Be,
      be,
      Y,
      re,
      ye,
      it
    ]
  ), Cn = q((d) => {
    const y = go(d);
    r(y), u(
      (S) => y.flows?.some((j) => j.key === S) ? S : y.flows?.[0]?.key || ""
    );
  }, []), st = q((d) => {
    if (r((S) => Hr(S, d)), !Array.isArray(d?.flows))
      return;
    const y = d.flows;
    u(
      (S) => y.some((j) => j.key === S) ? S : y[0]?.key || ""
    );
  }, []), me = q(() => Ne ? (F.info("团队已发布，请先进入编辑草稿后再修改"), !1) : !0, [Ne]), An = q(async () => {
    if (n) {
      a(!0);
      try {
        const d = await De($e, "get", { team_id: n });
        if (d.code !== 0)
          throw new Error(d.message || "加载团队失败");
        Cn(d.data);
      } catch (d) {
        F.error(d instanceof Error ? d.message : "加载团队失败");
      } finally {
        a(!1);
      }
    }
  }, [Cn, n, $e]);
  Ze(() => {
    An();
  }, [An]);
  const En = async () => {
    if (!n || !me())
      return !1;
    l(!0);
    try {
      const d = await De(ze, "post", {
        team_id: n,
        compact_response: !0,
        flows: de,
        edges: We
      });
      if (d.code !== 0)
        throw new Error(d.message || "保存工作流图失败");
      return st(d.data), F.success("工作流配置已保存"), !0;
    } catch (d) {
      return F.error(d instanceof Error ? d.message : "保存工作流图失败"), !1;
    } finally {
      l(!1);
    }
  }, Tn = async () => {
    if (!n || !g || !me())
      return !1;
    l(!0);
    try {
      const d = await De(tt, "post", {
        team_id: n,
        compact_response: !0,
        flow_id: _e?.id || 0,
        flow_key: g,
        flows: de,
        flow_edges: We,
        nodes: Jr(be),
        edges: Be
      });
      if (d.code !== 0)
        throw new Error(d.message || "保存节点图失败");
      return st(d.data), F.success("节点视图已保存"), !0;
    } catch (d) {
      return F.error(d instanceof Error ? d.message : "保存节点图失败"), !1;
    } finally {
      l(!1);
    }
  }, nr = async () => {
    if (!(!n || c)) {
      l(!0);
      try {
        const d = await De(ze, "post", {
          team_id: n,
          compact_response: !0,
          action: "publish"
        });
        if (d.code !== 0)
          throw new Error(d.message || "发布失败");
        st(d.data), f("flow"), h(null), x(null), C(!1), F.success("团队已发布");
      } catch (d) {
        F.error(d instanceof Error ? d.message : "发布失败");
      } finally {
        l(!1);
      }
    }
  }, or = async () => {
    if (!(!n || c)) {
      l(!0);
      try {
        const d = await De(ze, "post", {
          team_id: n,
          compact_response: !0,
          action: "edit_draft"
        });
        if (d.code !== 0)
          throw new Error(d.message || "进入编辑草稿失败");
        st(d.data), F.success("已进入编辑草稿");
      } catch (d) {
        F.error(d instanceof Error ? d.message : "进入编辑草稿失败");
      } finally {
        l(!1);
      }
    }
  }, rr = (d) => {
    Ie(d), Fe(""), X(null), Q(/* @__PURE__ */ new Set()), W(!0);
  }, Rn = async (d, y, S = [], j) => {
    const Xe = y.trim();
    if (!Xe) {
      F.error("请输入调试要求或目标");
      return;
    }
    if (d === "flow" && !_e?.id) {
      F.error("请先选择一个已保存的工作流");
      return;
    }
    const Ve = hi(Xe, S);
    Ie(d), Fe(Xe), W(d === "team"), C(!1), E(null), x(null), ee(""), Q(/* @__PURE__ */ new Set()), ue(!0), X(wi(Ve));
    try {
      if (!Ne && !(d === "flow" ? await Tn() : await En())) {
        X(null);
        return;
      }
      if (j?.aborted)
        return;
      const ge = {
        team_id: n,
        release_id: 0,
        debug_current_graph: !0,
        input: Ve
      };
      d === "flow" && (ge.flow_id = _e?.id);
      const V = await De(
        d === "team" ? At : Et,
        "post",
        ge
      );
      if (V.code !== 0)
        throw new Error(V.message || "启动调试失败");
      const J = ki(V.data, ge.input);
      X(J);
      const Se = await Hn(
        ot,
        nt,
        J,
        X,
        j
      );
      if (j?.aborted)
        return;
      X(Se);
    } catch (ge) {
      const V = ge instanceof Error ? ge.message : "调试失败";
      X(
        (J) => J ? { ...J, error: V } : { error: V }
      ), F.error(V);
    } finally {
      ue(!1);
    }
  }, ir = async () => {
    await Rn(Pe, He);
  }, It = async (d, y) => {
    if (!d?.id)
      return;
    const S = String(d.id), j = String(y.data.decision || "approved"), Xe = String(y.data.comment || y.text || ""), Ve = Y, ge = Ii(
      Ve,
      d,
      y
    );
    Q((V) => {
      const J = new Set(V);
      return J.add(S), J;
    }), X(ge), ue(!0);
    try {
      const V = d.kind === "interaction", J = await De(
        V ? Rt : Tt,
        "post",
        V ? {
          run_id: d.runID,
          node_run_id: d.nodeRunID,
          interaction_id: d.id,
          data: y.data
        } : {
          approval_id: d.id,
          decision: j,
          comment: Xe,
          data: y.data
        }
      );
      if (J.code !== 0)
        throw new Error(J.message || "提交反馈失败");
      const Se = Fi(
        ge,
        J.data
      );
      X(Se), F.success("已提交反馈，流程继续执行");
      const Pn = await Hn(
        ot,
        nt,
        Se,
        X
      );
      X(Pn);
    } catch (V) {
      Q((J) => {
        const Se = new Set(J);
        return Se.delete(S), Se;
      }), X(Ve), F.error(V instanceof Error ? V.message : "提交反馈失败");
    } finally {
      ue(!1);
    }
  }, sr = () => {
    if (re) {
      F.info("调试执行中，完成后再退出查看模式");
      return;
    }
    X(null), ee(""), Q(/* @__PURE__ */ new Set()), h(null);
  }, ar = m === "flow" ? En : Tn, lr = (d) => {
    me() && (h(d), C(!0));
  }, dr = (d) => {
    u(d.key), h(null), f("node");
  }, On = () => {
    if (!me())
      return;
    const d = `flow_${Date.now()}`;
    r((y) => ({
      ...y,
      flows: [
        ...y.flows ?? [],
        yo(y.flows ?? [], d)
      ]
    })), u(d), f("flow"), h({ kind: "flow", key: d }), C(!0);
  }, cr = (d) => {
    me() && (h(d), E(d));
  }, ur = () => {
    if (!me() || !v)
      return;
    const d = v.kind === "flow" && v.key === g, y = d ? (o.flows ?? []).find((S) => S.key !== v.key) : null;
    r(
      (S) => li(S, v, g)
    ), d && (u(y?.key ?? ""), y || f("flow")), h(null), E(null), C(!1), F.success(
      v.kind === "flow" ? "已删除，保存后生效" : "已从画布移除，保存后生效"
    );
  };
  return n ? /* @__PURE__ */ _(
    "div",
    {
      className: "grid overflow-hidden rounded-md border bg-background",
      style: {
        gridTemplateColumns: "16rem minmax(0, 1fr)",
        height: "min(76vh, 48rem)",
        minHeight: "34rem"
      },
      children: [
        /* @__PURE__ */ _("aside", { className: "flex min-h-0 min-w-0 flex-col border-r bg-muted/20", children: [
          /* @__PURE__ */ _("div", { className: "border-b p-4", children: [
            /* @__PURE__ */ i("div", { className: "text-xs text-muted-foreground", children: "当前团队" }),
            /* @__PURE__ */ i("div", { className: "mt-1 truncate text-base font-semibold", children: o.team?.name || "团队" }),
            /* @__PURE__ */ i("div", { className: "mt-2 inline-flex rounded bg-background px-2 py-0.5 text-xs text-muted-foreground", children: Xr(Ot) })
          ] }),
          /* @__PURE__ */ i("div", { className: "border-b p-2", children: /* @__PURE__ */ _(
            "button",
            {
              type: "button",
              className: $t(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm",
                m === "flow" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              ),
              onClick: () => {
                f("flow"), h(null), x(null);
              },
              children: [
                /* @__PURE__ */ i(Mn, { className: "size-4 shrink-0" }),
                /* @__PURE__ */ i("span", { className: "min-w-0 flex-1 truncate", children: "工作流视图" })
              ]
            }
          ) }),
          /* @__PURE__ */ _("div", { className: "flex items-center justify-between px-3 py-2", children: [
            /* @__PURE__ */ i("span", { className: "text-sm font-medium", children: "工作流列表" }),
            /* @__PURE__ */ i(
              he,
              {
                size: "icon",
                variant: "ghost",
                disabled: B,
                onClick: On,
                children: /* @__PURE__ */ i($n, { className: "size-4" })
              }
            )
          ] }),
          /* @__PURE__ */ i(
            "div",
            {
              className: "min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-2 pb-3 pr-1",
              style: { scrollbarGutter: "stable" },
              children: de.map((d) => /* @__PURE__ */ _(
                "div",
                {
                  draggable: !B,
                  "aria-grabbed": z === d.key,
                  className: $t(
                    "mb-1 flex w-full select-none items-center gap-1 rounded-md",
                    qn(m, g, d) ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    z === d.key && "opacity-60",
                    ye && "cursor-not-allowed opacity-60"
                  ),
                  onDragStart: (y) => {
                    if (B) {
                      y.preventDefault();
                      return;
                    }
                    N(d.key), y.dataTransfer.effectAllowed = "move", y.dataTransfer.setData("text/plain", d.key);
                  },
                  onDragOver: (y) => {
                    !B && z && z !== d.key && (y.preventDefault(), y.dataTransfer.dropEffect = "move");
                  },
                  onDrop: (y) => {
                    y.preventDefault(), !(B || !z || z === d.key) && (r(
                      (S) => si(S, z, d.key)
                    ), N(""));
                  },
                  onDragEnd: () => N(""),
                  children: [
                    /* @__PURE__ */ _(
                      "button",
                      {
                        type: "button",
                        disabled: ye,
                        className: "flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left text-sm",
                        onClick: () => dr(d),
                        children: [
                          /* @__PURE__ */ i(ut, { className: "size-4 shrink-0" }),
                          /* @__PURE__ */ i("span", { className: "min-w-0 flex-1 truncate", children: d.name || d.key })
                        ]
                      }
                    ),
                    /* @__PURE__ */ i(
                      "button",
                      {
                        type: "button",
                        disabled: B,
                        className: $t(
                          "mr-2 inline-flex size-6 items-center justify-center rounded hover:bg-background/70",
                          qn(m, g, d) && "hover:bg-primary-foreground/15",
                          B && "cursor-not-allowed opacity-60"
                        ),
                        onClick: (y) => {
                          y.preventDefault(), y.stopPropagation(), me() && (u(d.key), h({ kind: "flow", key: d.key }), C(!0));
                        },
                        children: /* @__PURE__ */ i(ct, { className: "size-3.5" })
                      }
                    )
                  ]
                },
                d.key
              ))
            }
          )
        ] }),
        /* @__PURE__ */ _(
          "section",
          {
            className: "grid min-h-0 min-w-0",
            style: { gridTemplateRows: "auto minmax(0, 1fr) auto" },
            children: [
              /* @__PURE__ */ _("div", { className: "flex flex-wrap items-center gap-2 border-b px-4 py-3", children: [
                /* @__PURE__ */ _(
                  he,
                  {
                    size: "sm",
                    variant: "outline",
                    disabled: B,
                    onClick: () => {
                      if (m === "flow") {
                        On();
                        return;
                      }
                      if (!_e?.id) {
                        F.info("请先保存工作流，再新增节点");
                        return;
                      }
                      ei(g, r);
                    },
                    children: [
                      /* @__PURE__ */ i($n, { className: "size-4" }),
                      m === "flow" ? "新增工作流" : "新增节点"
                    ]
                  }
                ),
                w ? /* @__PURE__ */ _(
                  he,
                  {
                    size: "sm",
                    variant: "default",
                    onClick: () => x(null),
                    children: [
                      /* @__PURE__ */ i(ft, { className: "size-4" }),
                      "取消连线"
                    ]
                  }
                ) : null,
                /* @__PURE__ */ _(
                  he,
                  {
                    size: "sm",
                    variant: "outline",
                    disabled: c || B,
                    onClick: ar,
                    children: [
                      c ? /* @__PURE__ */ i(Ae, { className: "size-4 animate-spin" }) : /* @__PURE__ */ i(Nr, { className: "size-4" }),
                      "保存"
                    ]
                  }
                ),
                Ne ? /* @__PURE__ */ _(
                  he,
                  {
                    size: "sm",
                    variant: "outline",
                    disabled: c,
                    onClick: () => {
                      or();
                    },
                    children: [
                      /* @__PURE__ */ i(ct, { className: "size-4" }),
                      "编辑草稿"
                    ]
                  }
                ) : /* @__PURE__ */ _(
                  he,
                  {
                    size: "sm",
                    variant: "outline",
                    disabled: c || B,
                    onClick: () => U(!0),
                    children: [
                      c ? /* @__PURE__ */ i(Ae, { className: "size-4 animate-spin" }) : /* @__PURE__ */ i(Sr, { className: "size-4" }),
                      "发布"
                    ]
                  }
                ),
                m === "flow" ? /* @__PURE__ */ _(
                  he,
                  {
                    size: "sm",
                    variant: "outline",
                    disabled: re,
                    onClick: () => rr("team"),
                    children: [
                      /* @__PURE__ */ i(Mn, { className: "size-4" }),
                      "调试"
                    ]
                  }
                ) : null,
                m === "node" && _e ? /* @__PURE__ */ i(
                  qa,
                  {
                    title: ye ? "重新调试工作流" : "调试工作流",
                    description: "输入本次调试目标，可添加参考资源；开始后会锁定画布并按节点顺序展示执行路径。",
                    triggerLabel: ye ? "重新调试" : "调试工作流",
                    triggerVariant: "outline",
                    triggerSize: "sm",
                    submitLabel: "开始调试",
                    loadingText: "启动调试",
                    disabled: re || !_e?.id,
                    textareaPlaceholder: "输入这次调试要完成的目标、输入材料或约束...",
                    onSubmit: async ({
                      instruction: d,
                      references: y,
                      signal: S,
                      setStatus: j
                    }) => d.trim() ? (j("正在启动工作流调试"), Rn("flow", d, y, S), !0) : (F.error("请输入调试要求或目标"), !1)
                  }
                ) : null,
                ye ? /* @__PURE__ */ i(
                  he,
                  {
                    size: "sm",
                    variant: "ghost",
                    disabled: re,
                    onClick: sr,
                    children: "退出调试"
                  }
                ) : null,
                s ? /* @__PURE__ */ i("span", { className: "text-sm text-muted-foreground", children: "加载中..." }) : null
              ] }),
              /* @__PURE__ */ i(
                xs,
                {
                  view: m,
                  flows: de,
                  flowEdges: We,
                  nodes: be,
                  nodeEdges: Be,
                  edgeConditions: er,
                  selected: p,
                  connect: w,
                  readonly: B,
                  nodeTypes: Dn,
                  executionState: tr,
                  paramApi: Ue,
                  onSelect: h,
                  onConnect: x,
                  onOpenNodeResult: (d) => ee(d),
                  onSubmitApproval: (d, y) => {
                    It(d, y);
                  },
                  onEdit: lr,
                  onDelete: cr,
                  onFlowConnect: (d, y) => B ? void 0 : r((S) => ko(S, d, y)),
                  onFlowConnectNew: (d, y) => {
                    if (!me())
                      return;
                    const S = `flow_${Date.now()}`;
                    r(
                      (j) => oi(j, d, S, y)
                    ), h({ kind: "flow", key: S });
                  },
                  onNodeConnect: (d, y) => B ? void 0 : r(
                    (S) => xo(S, g, d, y)
                  ),
                  onNodeConnectNew: (d, y) => {
                    if (!me() || !g)
                      return;
                    const S = `node_${Date.now()}`;
                    r(
                      (j) => ri(
                        j,
                        g,
                        d,
                        S,
                        y
                      )
                    ), h({ kind: "node", key: S });
                  },
                  onMove: (d, y, S) => B ? void 0 : r(
                    (j) => d === "flow" ? Gn(j, y, { position: S }) : Kn(j, g, y, { position: S })
                  ),
                  onChangeNodeEdge: (d, y) => B ? void 0 : r(
                    (S) => ai(S, g, d, y)
                  )
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ i(
          wa,
          {
            open: P,
            onOpenChange: C,
            selected: p,
            flows: de,
            nodes: be,
            agents: k,
            agentCates: D,
            assetCates: L,
            knowledgeCates: Z,
            knowledgeBases: se,
            currentTeamID: n,
            currentTeamName: String(o.team?.name || "当前团队"),
            roles: b,
            roleTypes: Ye,
            teamBindingOptions: fe,
            powers: rt,
            powerKinds: Pt,
            nodeTypes: Dn,
            readonly: B,
            onChangeFlow: (d, y) => B ? void 0 : r((S) => Gn(S, d, y)),
            onChangeNode: (d, y) => B ? void 0 : r(
              (S) => Kn(S, g, d, y)
            )
          }
        ),
        /* @__PURE__ */ i(
          ra,
          {
            open: !!ie,
            nodeKey: ie,
            nodes: be,
            result: Y,
            approval: ie ? it[ie] : void 0,
            paramApi: Ue,
            onOpenChange: (d) => !d && ee(""),
            onSubmitApproval: (d, y) => {
              It(d, y);
            }
          }
        ),
        /* @__PURE__ */ i(
          ta,
          {
            open: I,
            target: Pe,
            prompt: He,
            running: re,
            result: Y,
            paramApi: Ue,
            pendingApprovalsByNodeKey: it,
            onOpenChange: W,
            onPromptChange: Fe,
            onRun: ir,
            onSubmitApproval: (d, y) => {
              It(d, y);
            }
          }
        ),
        /* @__PURE__ */ i(
          so,
          {
            open: $,
            onOpenChange: U,
            title: "发布",
            desc: "确定要发布吗？系统会校验工作流编排并生成可运行版本。",
            confirmText: "发布",
            disabled: c,
            isLoading: c,
            handleConfirm: () => {
              U(!1), nr();
            }
          }
        ),
        /* @__PURE__ */ i(
          so,
          {
            open: !!v,
            onOpenChange: (d) => !d && E(null),
            title: Ta(v),
            desc: Ra(v),
            confirmText: "删除",
            destructive: !0,
            handleConfirm: ur
          }
        )
      ]
    }
  ) : /* @__PURE__ */ i("div", { className: "rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive", children: "缺少 team_id，无法进入团队工作流配置。" });
}
function Ga() {
  if (typeof window > "u") return 0;
  const e = new URLSearchParams(window.location.search);
  return Number(e.get("team_id") || e.get("id") || 0);
}
export {
  Xa as ShowTeamWorkspace
};
