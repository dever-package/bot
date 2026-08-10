import { a as i, j as p, F as Ht } from "./_commonjsHelpers-CTFd9u1x.js";
import { l as P, u as Pt, d as Te, o as We, b as G } from "./react-C7Xtl8sB.js";
import { aJ as st, T as Ln, $ as at, a7 as Ur, aK as Wr, Z as Yr, F as Xr, aD as Vr, aL as Zr, aM as Jr, a0 as fn, aN as mn, aO as Qr, a1 as eo, aP as to, X as lt, aQ as no, C as ro, L as Ee, aR as gn, x as _n, S as oo, c as io } from "./vendor-icons-Cc7Kl3It.js";
import { t as $ } from "./index-BxqXLJC9.js";
import { m as jn } from "./in-flight-request-DlB1DJg0.js";
import { m as bt } from "./utils-B_fxI2dk.js";
import { m as Ut } from "./button-CpfaQlDK.js";
import { m as so } from "./confirm-dialog-D2pOx0vH.js";
import { m as ao } from "./task-popover-BTaCg3wP.js";
import { R as lo, u as co, P as dt, a as uo, i as fo, C as mo, H as pn, g as go, B as It, E as _o } from "./vendor-canvas-DEiNGL9h.js";
import { m as Mn } from "./interaction-panel-Cd_uLE-L.js";
import { m as J } from "./dialog-Oss_U0H4.js";
import { m as Xe } from "./select-BbBjJoqJ.js";
import { m as be } from "./stream-timing-B0L-jg0F.js";
import { m as po } from "./reference-CNJf8KLT.js";
import { n as bo, a as yo, w as ho, m as wo, b as yt, r as ko } from "./agent-result-protocol-B6k77Bh9.js";
import { m as Gn } from "./textarea-FN7P8RjV.js";
import { m as xo } from "./content-view-DKqPlRti.js";
import { m as vo } from "./input-DLnnH2-7.js";
import { m as No } from "./searchable-option-picker-ruTkZ6EF.js";
const ht = [
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
], So = new Set(ht.map((e) => e.id)), qn = [
  { id: "chat", value: "沟通" },
  { id: "planner", value: "规划" },
  { id: "worker", value: "执行" },
  { id: "reviewer", value: "审核" }
], Kn = [
  { id: "always", value: "总是" },
  { id: "completed", value: "完成" },
  { id: "passed", value: "通过" },
  { id: "failed", value: "不通过" },
  { id: "approved", value: "确认" },
  { id: "rejected", value: "驳回" }
], Hn = [
  { id: "exists", value: "有内容" },
  { id: "contains", value: "包含" },
  { id: "equals", value: "等于" },
  { id: "truthy", value: "为真" },
  { id: "falsy", value: "为假" }
], Le = 64, ve = 64, bn = {
  width: 24,
  height: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  lineHeight: 0
}, yn = {
  display: "block",
  flex: "0 0 auto"
}, Do = "draft", ct = "published", $t = "editing", de = "running", Se = "waiting", Ne = "success", wt = "fail", Un = "canceled", Wt = "pending", Ao = 15e3, xe = "_client_started_at", zt = "_stream_last_id", Co = [
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
function Yt({
  currentTeamID: e,
  currentTeamName: t,
  flows: n,
  roles: r,
  teams: o
}) {
  const s = /* @__PURE__ */ new Map();
  return e && s.set(e, {
    id: e,
    name: t || "当前团队",
    flows: n,
    roles: r.map((a) => ({
      ...a,
      team_id: Number(a.team_id || e)
    }))
  }), o.forEach((a) => {
    if (!a?.id)
      return;
    const c = s.get(a.id), l = a.id === e && !!c, m = l ? c?.flows : a.flows ?? c?.flows ?? [], f = l ? c?.roles : a.roles ?? c?.roles ?? [];
    s.set(a.id, {
      ...c,
      ...a,
      name: l ? c?.name || a.name || "" : a.name || c?.name || "",
      flows: (m ?? []).map(Xn),
      roles: (f ?? []).map((g) => ({
        ...g,
        team_id: Number(g.team_id || a.id)
      }))
    });
  }), Array.from(s.values());
}
function ut(e, t) {
  return e.find((n) => Number(n.id) === Number(t));
}
function To(e, t) {
  if (t)
    for (const n of e) {
      const r = (n.roles ?? []).find(
        (o) => Number(o.id) === Number(t)
      );
      if (r)
        return r;
    }
}
function Eo(e) {
  return Array.from(
    new Set(
      Vt(e).map((n) => Number(n.cate_id || 0)).filter(Boolean)
    )
  ).map((n) => ({
    id: n,
    value: `分类${n}`
  }));
}
function Ro(e) {
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
    new Set(e.map((r) => r.kind).filter(Boolean))
  ).map((r) => ({ id: r, value: t[r] || r }));
}
function Xt(e) {
  const t = String(e || "exists").trim().toLowerCase();
  return Hn.some((n) => n.id === t) ? t : "exists";
}
function Wn(e, t, n) {
  const r = t.find((o) => o.node_key === e.from_key);
  return r ? r.type === "condition" ? hn(n, ["passed", "failed"]) : r.type === "human_approval" ? hn(n, ["approved", "rejected"]) : [] : [];
}
function hn(e, t) {
  const n = new Map(e.map((r) => [r.id, r]));
  return t.map((r) => n.get(r)).filter((r) => !!r);
}
function Yn(e) {
  return {
    team: Io(e?.team),
    asset_cates: Array.isArray(e?.asset_cates) ? e.asset_cates : [],
    flows: Array.isArray(e?.flows) ? e.flows.map(Xn) : [],
    flow_edges: Array.isArray(e?.flow_edges) ? e.flow_edges : [],
    nodes_by_flow: e?.nodes_by_flow ?? {},
    edges_by_flow: e?.edges_by_flow ?? e?.node_edges_by_flow ?? {},
    roles: Array.isArray(e?.roles) ? e.roles : [],
    agents: Array.isArray(e?.agents) ? Vt(e.agents) : [],
    agent_cates: Array.isArray(e?.agent_cates) ? Vn(e.agent_cates) : [],
    knowledge_cates: Array.isArray(e?.knowledge_cates) ? $o(e.knowledge_cates) : [],
    knowledge_bases: Array.isArray(e?.knowledge_bases) ? Oo(e.knowledge_bases) : [],
    teams: Array.isArray(e?.teams) ? e.teams : [],
    role_types: Array.isArray(e?.role_types) ? e.role_types : qn,
    powers: Array.isArray(e?.powers) ? e.powers : [],
    power_kinds: Array.isArray(e?.power_kinds) ? e.power_kinds : [],
    node_types: Array.isArray(e?.node_types) ? e.node_types : ht,
    edge_conditions: Array.isArray(e?.edge_conditions) ? e.edge_conditions : Kn
  };
}
function Po(e, t) {
  if (!t || typeof t != "object")
    return e;
  const n = { ...e, ...t };
  return Object.prototype.hasOwnProperty.call(t, "node_edges_by_flow") && !Object.prototype.hasOwnProperty.call(t, "edges_by_flow") && (n.edges_by_flow = t.node_edges_by_flow), Yn(n);
}
function Io(e) {
  const t = e && typeof e == "object" ? { ...e } : {};
  return t.publish_status = Zt(
    t.publish_status
  ), t.current_release_id = Number(t.current_release_id || 0), t.release_version = Number(t.release_version || 0), t.readonly = !!t.readonly || Zn(t), t;
}
function Xn(e) {
  return { ...e };
}
function Vt(e) {
  return [...e].sort(kt);
}
function Vn(e) {
  return [...e].sort(kt);
}
function Oo(e) {
  return [...e].sort(kt);
}
function $o(e) {
  return [...e].sort(kt);
}
function kt(e, t) {
  const n = Number(e.sort || 0), r = Number(t.sort || 0);
  return n !== r ? n - r : Number(e.id || 0) - Number(t.id || 0);
}
function Zt(e) {
  const t = String(e ?? "").trim().toLowerCase();
  return t === ct || t === "已发布" || t === "发布" ? ct : t === $t || t === "编辑草稿" || t === "editing_draft" ? $t : Do;
}
function Zn(e) {
  return !!e?.readonly || Zt(e?.publish_status) === ct;
}
function zo(e) {
  return e === ct ? "已发布" : e === $t ? "编辑草稿" : "草稿";
}
function wn(e, t, n) {
  return e === "node" ? t === n.key : !1;
}
function Fo(e, t) {
  const n = String(e || "agent");
  return n === "role" ? "团队角色" : n === "team" ? "团队工作流" : t.find((r) => r.id === n)?.value || ht.find((r) => r.id === n)?.value || n;
}
function Bo(e) {
  return e.filter((t) => So.has(t.id));
}
function Lo(e) {
  return e.map((t) => ({
    ...t,
    role_id: t.type === "role" ? Number(t.role_id || t.config?.role_id || 0) : 0,
    role_key: t.type === "role" ? String(t.role_key || t.config?.role_key || "") : "",
    agent_id: t.type === "agent" ? t.agent_id : 0,
    power_id: t.type === "power" ? Number(t.power_id || t.config?.power_id || 0) : 0,
    sub_team_id: t.type === "team" ? Number(t.sub_team_id || t.config?.sub_team_id || 0) : 0,
    asset_cate_id: t.type === "context" || t.type === "save" ? Number(t.asset_cate_id || t.config?.asset_cate_id || 0) : 0,
    config: jo(t)
  }));
}
function jo(e) {
  const t = z(e.config, [
    "task",
    "input_keys",
    "output_key",
    "knowledge_cate_id",
    "knowledge_base_id",
    "query",
    "retrieve_limit"
  ]);
  return e.type === "agent" ? z(t, [
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
  ]) : e.type === "role" ? z(t, [
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
  ]) : e.type === "power" ? z(t, [
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
  ]) : e.type === "team" ? z(t, [
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
    ...z(t, [
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
    ...z(t, [
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
    operator: Xt(t.operator)
  } : e.type === "save" ? z(t, [
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
  ]) : e.type === "context" ? z(t, [
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
  ]) : z(t, [
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
function z(e, t) {
  const n = { ...e ?? {} };
  return t.forEach((r) => {
    delete n[r];
  }), n;
}
function Mo(e, t) {
  if (!e) {
    $.error("请先选择一个工作流");
    return;
  }
  const n = `node_${Date.now()}`;
  t((r) => {
    const o = r.nodes_by_flow?.[e] ?? [];
    return {
      ...r,
      nodes_by_flow: {
        ...r.nodes_by_flow ?? {},
        [e]: [
          ...o,
          Qn(o, n, Go(o))
        ]
      }
    };
  });
}
function Jn(e, t, n) {
  return {
    key: t,
    name: er("工作流", e, (r) => r.name),
    goal: "",
    position: n ?? xt(e.length),
    status: 1,
    sort: (e.length + 1) * 10
  };
}
function Qn(e, t, n) {
  return {
    node_key: t,
    name: er("节点", e, (r) => r.name),
    type: "agent",
    role_id: 0,
    role_key: "",
    agent_id: 0,
    power_id: 0,
    sub_team_id: 0,
    asset_cate_id: 0,
    config: {},
    position: n ?? xt(e.length),
    status: 1,
    sort: (e.length + 1) * 10
  };
}
function xt(e) {
  return {
    x: 90 + e % 4 * 180,
    y: 90 + Math.floor(e / 4) * 140
  };
}
function Go(e) {
  const t = [...e].filter((n) => n.position).sort((n, r) => Number(n.sort || 0) - Number(r.sort || 0)).at(-1);
  return t?.position ? {
    x: Number(t.position.x || 0) + 160,
    y: Number(t.position.y || 0)
  } : xt(e.length);
}
function er(e, t, n) {
  const r = /* @__PURE__ */ new Set(), o = new RegExp(`^${qo(e)}(\\d+)$`);
  t.forEach((a) => {
    const c = String(n(a) || "").trim().match(o);
    c && r.add(Number(c[1]));
  });
  let s = 1;
  for (; r.has(s); )
    s += 1;
  return `${e}${s}`;
}
function qo(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function tr(e, t, n) {
  return t === n || (e.flow_edges ?? []).some(
    (r) => r.from_key === t && r.to_key === n
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
function Ko(e, t, n, r) {
  const o = e.flows ?? [];
  return o.some((s) => s.key === n) ? e : tr(
    {
      ...e,
      flows: [...o, Jn(o, n, r)]
    },
    t,
    n
  );
}
function nr(e, t, n, r) {
  const o = e.edges_by_flow?.[t] ?? [];
  if (n === r || o.some((c) => c.from_key === n && c.to_key === r))
    return e;
  const a = (e.nodes_by_flow?.[t] ?? []).find((c) => c.node_key === n);
  return {
    ...e,
    edges_by_flow: {
      ...e.edges_by_flow ?? {},
      [t]: [
        ...o,
        {
          from_key: n,
          to_key: r,
          condition: Uo(a?.type, o, n),
          status: 1,
          sort: (o.length + 1) * 10
        }
      ]
    }
  };
}
function Ho(e, t, n, r, o) {
  const s = e.nodes_by_flow?.[t] ?? [];
  return s.some((a) => a.node_key === r) ? e : nr(
    {
      ...e,
      nodes_by_flow: {
        ...e.nodes_by_flow ?? {},
        [t]: [...s, Qn(s, r, o)]
      }
    },
    t,
    n,
    r
  );
}
function Uo(e, t, n) {
  const r = new Set(
    t.filter((o) => o.from_key === n).map((o) => String(o.condition || ""))
  );
  return e === "condition" ? r.has("passed") ? "failed" : "passed" : e === "human_approval" ? r.has("approved") ? "rejected" : "approved" : "always";
}
function kn(e, t, n) {
  return {
    ...e,
    flows: (e.flows ?? []).map(
      (r) => r.key === t ? { ...r, ...n } : r
    )
  };
}
function Wo(e, t, n) {
  const r = [...e.flows ?? []], o = r.findIndex((c) => c.key === t), s = r.findIndex((c) => c.key === n);
  if (o < 0 || s < 0 || o === s)
    return e;
  const [a] = r.splice(o, 1);
  return r.splice(s, 0, a), {
    ...e,
    flows: r.map((c, l) => ({
      ...c,
      sort: (l + 1) * 10
    }))
  };
}
function xn(e, t, n, r) {
  const o = e.nodes_by_flow?.[t] ?? [];
  return {
    ...e,
    nodes_by_flow: {
      ...e.nodes_by_flow ?? {},
      [t]: o.map(
        (s) => s.node_key === n ? { ...s, ...r } : s
      )
    }
  };
}
function Yo(e, t, n, r) {
  const o = e.edges_by_flow?.[t] ?? [];
  return {
    ...e,
    edges_by_flow: {
      ...e.edges_by_flow ?? {},
      [t]: o.map(
        (s, a) => a === n ? { ...s, ...r } : s
      )
    }
  };
}
function Xo(e, t, n) {
  if (t.kind === "flow") {
    const o = { ...e.nodes_by_flow ?? {} }, s = { ...e.edges_by_flow ?? {} };
    return delete o[t.key], delete s[t.key], {
      ...e,
      flows: (e.flows ?? []).filter(
        (a) => a.key !== t.key
      ),
      flow_edges: (e.flow_edges ?? []).filter(
        (a) => a.from_key !== t.key && a.to_key !== t.key
      ),
      nodes_by_flow: o,
      edges_by_flow: s
    };
  }
  if (t.kind === "flow_edge")
    return {
      ...e,
      flow_edges: (e.flow_edges ?? []).filter(
        (o, s) => s !== t.index
      )
    };
  if (t.kind === "node") {
    const o = e.nodes_by_flow?.[n] ?? [], s = e.edges_by_flow?.[n] ?? [];
    return {
      ...e,
      nodes_by_flow: {
        ...e.nodes_by_flow ?? {},
        [n]: o.filter((a) => a.node_key !== t.key)
      },
      edges_by_flow: {
        ...e.edges_by_flow ?? {},
        [n]: s.filter(
          (a) => a.from_key !== t.key && a.to_key !== t.key
        )
      }
    };
  }
  const r = e.edges_by_flow?.[n] ?? [];
  return {
    ...e,
    edges_by_flow: {
      ...e.edges_by_flow ?? {},
      [n]: r.filter((o, s) => s !== t.index)
    }
  };
}
const Vo = po.assistantReferencePayload, Zo = be.createRuntimeStreamTiming, Jo = be.formatStreamDuration, Qo = be.isStreamTimingRunning, ei = be.streamTimingPercentFromOutput, ti = jn.request, ni = yt.agentResultPayloadTitle, ri = yt.extractAgentResultPayload, oi = yt.isAgentResultProtocolText, ii = yt.normalizeAgentResultOutputValue;
function si(e, t = []) {
  const n = Vo(t);
  return {
    goal: e,
    requirement: e,
    prompt: e,
    user_input: e,
    reference_files: n ?? []
  };
}
function ai(e) {
  return {
    run: {
      id: 0,
      request_id: "",
      status: de,
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
function li(e, t) {
  return {
    run: {
      id: Number(e?.run_id || 0),
      request_id: String(e?.request_id || ""),
      status: String(e?.status || de),
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
async function vn(e, t, n, r, o) {
  const s = String(n?.run?.request_id || "");
  if (!s)
    return n;
  let a = n;
  const c = await ho({
    streamApi: e,
    requestID: s,
    lastID: String(n?.[zt] || "0-0"),
    blockMs: Ao,
    signal: o,
    acceptErrorResult: !0,
    initialState: n,
    reduceFrame: (l, m) => ci(ui(l, m), m),
    fetchSnapshot: t ? () => di(t, n) : void 0,
    mergeSnapshot: (l, m) => rr(l, m),
    onUpdate: (l) => {
      a = l, r?.(l);
    }
  });
  return c.lastID && (a = {
    ...c.state,
    [zt]: c.lastID
  }), a;
}
async function di(e, t) {
  const n = await ti(e, "get", {
    run_id: Number(t?.run?.id || 0),
    request_id: String(t?.run?.request_id || ""),
    view: "summary"
  });
  if (n.code !== 0)
    throw new Error(n.message || "读取运行状态失败");
  return n.data;
}
function ci(e, t) {
  const n = String(t?.stream_id || "");
  return n ? {
    ...e,
    [zt]: n
  } : e;
}
function ui(e, t) {
  const n = t?.output;
  return t?.type === "result" && fi(n) ? rr(e, n) : C(n) ? mi(e, n) : e;
}
function rr(e, t) {
  const n = wo(e, t);
  return {
    ...e,
    ...t,
    run: n.run,
    node_runs: Nn(
      E(e?.node_runs),
      E(n?.node_runs),
      ["id", "node_key", "node_id"]
    ),
    flow_runs: Nn(
      E(e?.flow_runs),
      E(n?.flow_runs),
      ["id", "flow_id", "flow_key"]
    ),
    interactions: n.interactions,
    approvals: n.approvals
  };
}
function Nn(e, t, n) {
  return t.map((r) => {
    const o = e.find(
      (s) => n.some(
        (a) => ne(r?.[a]) && String(s?.[a]) === String(r?.[a])
      )
    );
    return o ? ir(o, r) : sr(r);
  });
}
function fi(e) {
  return !!(C(e) && (C(e.run) || Array.isArray(e.flow_runs) || Array.isArray(e.node_runs)));
}
function mi(e, t) {
  const n = Jt(e), r = String(t.scope || "");
  return (r === "run" || gi(t.event)) && (n.run = _i(n.run, t)), r === "flow" && (n.flow_runs = Sn(
    n.flow_runs,
    pi(t),
    ["id", "flow_id", "flow_key"]
  )), r === "node" && (n.node_runs = Sn(
    n.node_runs,
    bi(t),
    ["id", "node_key", "node_id"]
  )), t.error && (n.error = String(t.error)), n;
}
function Jt(e) {
  return {
    ...e,
    run: { ...e?.run || {} },
    flow_runs: E(e?.flow_runs).map((t) => ({ ...t })),
    node_runs: E(e?.node_runs).map((t) => ({ ...t })),
    agent_runs: E(e?.agent_runs),
    blackboard: E(e?.blackboard),
    approvals: E(e?.approvals),
    interactions: E(e?.interactions),
    messages: E(e?.messages)
  };
}
function gi(e) {
  return ["run_started", "run_finished", "waiting"].includes(
    String(e || "")
  );
}
function _i(e, t) {
  const n = { ...e || {} };
  return pe(n, "id", t.run_id), pe(n, "team_id", t.team_id), pe(n, "release_id", t.release_id), pe(n, "status", Qt(t, t.status || t.run_status)), pe(n, "input", t.input), pe(n, "output", t.output), pe(n, "error", t.error), pe(n, "started_at", t.started_at), pe(n, "finished_at", t.finished_at), n;
}
function pi(e) {
  return or({
    id: e.flow_run_id,
    run_id: e.run_id,
    flow_id: e.flow_id,
    flow_key: e.flow_key,
    flow_name: e.flow_name,
    name: e.flow_name,
    status: Qt(e, e.status),
    input: e.input,
    output: e.output,
    error: e.error,
    started_at: e.started_at,
    finished_at: e.finished_at
  });
}
function bi(e) {
  return or({
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
    status: Qt(e, e.status || e.node_status),
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
function Qt(e, t) {
  return ko(e, t);
}
function or(e) {
  const t = {};
  return Object.entries(e).forEach(([n, r]) => {
    ne(r) && (t[n] = r);
  }), t;
}
function Sn(e, t, n) {
  if (!Object.keys(t).length)
    return e;
  const r = sr(t), o = e.findIndex(
    (a) => n.some(
      (c) => ne(r[c]) && String(a?.[c]) === String(r[c])
    )
  );
  if (o < 0)
    return [...e, r];
  const s = [...e];
  return s[o] = ir(s[o], r), s;
}
function ir(e, t) {
  const n = {
    ...e,
    ...t
  };
  return ne(e?.[xe]) ? n[xe] = e[xe] : ar(n) && (n[xe] = t[xe] || Date.now()), ne(e?.started_at) && ne(t.started_at) && !ne(t.finished_at) && (n.started_at = e.started_at), n;
}
function sr(e) {
  return !ar(e) || ne(e[xe]) ? e : {
    ...e,
    [xe]: Date.now()
  };
}
function ar(e) {
  const t = je(e?.status);
  return t === de || t === Se || ne(e?.started_at);
}
function pe(e, t, n) {
  ne(n) && (e[t] = n);
}
function ne(e) {
  return e == null || e === "" ? !1 : Array.isArray(e) ? e.length > 0 : !0;
}
function yi(e, t = /* @__PURE__ */ new Set()) {
  const n = {}, r = /* @__PURE__ */ new Map();
  for (const o of E(e?.node_runs)) {
    const s = String(o?.id || ""), a = String(o?.node_key || "");
    s && a && r.set(s, a);
  }
  for (const o of E(e?.approvals)) {
    const s = hi(o);
    if (!s || t.has(String(s.id)))
      continue;
    const a = R(
      s.nodeKey,
      o?.node_key,
      r.get(
        String(s.nodeRunID || o?.node_run_id || "")
      )
    );
    a && (n[a] = {
      ...s,
      nodeKey: a
    });
  }
  for (const o of E(e?.interactions)) {
    const s = lr(o);
    if (!s || t.has(String(s.id)))
      continue;
    const a = R(
      s.nodeKey,
      o?.node_key,
      r.get(String(s.nodeRunID || ""))
    );
    a && (n[a] = { ...s, nodeKey: a });
  }
  for (const o of E(e?.node_runs)) {
    const s = wi(o);
    if (s && t.has(String(s.id)))
      continue;
    const a = String(o?.node_key || s?.nodeKey || "");
    s && a && !n[a] && (n[a] = {
      ...s,
      nodeKey: a
    });
  }
  return n;
}
function lr(e) {
  const t = bo(e), n = t.interaction, r = R(n.id);
  return !r || !R(n.type) ? null : {
    id: r,
    title: R(n.title, t.nodeName, "补充信息"),
    runID: t.runId,
    nodeRunID: t.nodeRunId,
    nodeKey: t.nodeKey,
    kind: "interaction",
    interaction: n
  };
}
function hi(e) {
  if (String(e?.status || "") !== Wt || !e?.id)
    return null;
  const t = le(e?.content), n = dr(
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
function wi(e) {
  if (String(e?.status || "") !== Se)
    return null;
  const t = le(e?.interaction);
  if (R(t.id) && R(t.type))
    return lr({
      run_id: e?.run_id,
      node_run_id: e?.id,
      node_key: e?.node_key,
      node_name: e?.node_name,
      interaction: t
    });
  const n = le(e?.output), r = n.approval_id || n.approvalId;
  if (!r)
    return null;
  const o = dr(
    n.interaction,
    e?.node_name || e?.name,
    r
  );
  return {
    id: r,
    title: R(e?.node_name, e?.name, o.title),
    nodeRunID: e.id,
    nodeKey: String(e?.node_key || ""),
    kind: "human_approval",
    interaction: o
  };
}
function dr(e, t, n) {
  return C(e) && R(e.type) ? e : {
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
function ki(e, t, n) {
  const r = Jt(e);
  return t.kind === "interaction" && (r.interactions = E(r.interactions).filter(
    (o) => String(o?.interaction?.id || "") !== String(t.id)
  )), r.approvals = E(r.approvals).map(
    (o) => String(o?.id || "") === String(t.id) ? {
      ...o,
      status: Ne,
      decision: n.data.decision || "approved",
      comment: n.data.comment || n.text
    } : o
  ), r.node_runs = E(r.node_runs).map((o) => {
    const s = t.nodeRunID && String(o?.id || "") === String(t.nodeRunID), a = t.nodeKey && String(o?.node_key || "") === String(t.nodeKey);
    return !s && !a ? o : t.kind === "interaction" ? {
      ...o,
      status: de,
      interaction: {},
      output: {
        text: "已提交反馈，继续执行当前节点。"
      }
    } : {
      ...o,
      status: Ne,
      output: {
        approval_id: t.id,
        decision: n.data.decision || "approved",
        comment: n.data.comment || n.text,
        text: n.text,
        data: n.data
      }
    };
  }), r;
}
function xi(e, t) {
  const n = Jt(e);
  return n.run = {
    ...n.run || {},
    id: Number(t?.run_id || n.run?.id || 0),
    request_id: String(t?.request_id || n.run?.request_id || ""),
    status: String(t?.status || de)
  }, n;
}
function le(e) {
  return C(e) ? e : {};
}
function cr(e) {
  return {
    [de]: "运行中",
    [Se]: "等待反馈",
    [Ne]: "成功",
    [wt]: "失败",
    [Un]: "已取消",
    [Wt]: "等待中"
  }[e] || e || "未知";
}
function ur(e) {
  return !e?.error || String(e?.status || "") === Ne ? "" : String(e.error);
}
function vi(e) {
  switch (e) {
    case Ne:
      return "bg-emerald-50 text-emerald-700";
    case wt:
      return "bg-destructive/10 text-destructive";
    case de:
      return "bg-blue-50 text-blue-700";
    case Se:
      return "bg-amber-50 text-amber-700";
    case Un:
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted/60 text-muted-foreground";
  }
}
function Ni(e, t, n, r, o = {}) {
  const s = {}, a = nn(E(e?.agent_runs)), c = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), m = en(E(e?.node_runs));
  m.forEach((_) => {
    const h = String(_?.node_key || "");
    if (!h)
      return;
    const w = je(_?.status || _?.state || _?.run_status);
    s[h] = { status: w, run: _ }, w === Ne && c.add(h), Ve(w) && l.add(h);
  });
  const f = new Set(t.map((_) => _.node_key)), g = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set();
  return n.forEach((_, h) => {
    if (!f.has(_.from_key) || !f.has(_.to_key))
      return;
    const w = fr(_, h);
    c.has(_.from_key) && l.has(_.to_key) && g.add(w), c.has(_.from_key) && c.has(_.to_key) && u.add(w);
  }), {
    active: r || !!e?.run,
    running: r,
    nodeRuns: m,
    nodeRunsByKey: s,
    agentRunsByID: a,
    pendingApprovalsByNodeKey: o,
    activeEdgeKeys: g,
    completedEdgeKeys: u
  };
}
function fr(e, t) {
  return `${e.from_key}->${e.to_key}:${t}`;
}
function Si(e) {
  if (Ve(e))
    return {
      animation: "team-node-running 1.4s ease-in-out infinite",
      borderColor: "#2563eb"
    };
  if (e === Ne)
    return {
      borderColor: "#86efac",
      boxShadow: "0 0 0 3px rgb(16 185 129 / 0.12), 0 4px 12px rgb(15 23 42 / 0.08)"
    };
  if (e === wt)
    return {
      borderColor: "#f87171",
      boxShadow: "0 0 0 3px rgb(239 68 68 / 0.12), 0 4px 12px rgb(15 23 42 / 0.08)"
    };
  if (e === Se)
    return {
      borderColor: "#f59e0b",
      boxShadow: "0 0 0 3px rgb(245 158 11 / 0.14), 0 4px 12px rgb(15 23 42 / 0.08)"
    };
}
function Di(e, t) {
  return e === Se && String(t || "") === "human_approval" ? "等待人工确认" : cr(e);
}
function en(e) {
  return [...e].sort(Ai);
}
function Ai(e, t) {
  const n = rt(e?.started_at), r = rt(t?.started_at);
  if (n !== r)
    return n - r;
  const o = rt(e?.created_at), s = rt(t?.created_at);
  return o !== s ? o - s : Number(e?.id || 0) - Number(t?.id || 0);
}
function rt(e) {
  return Lt(e)?.getTime() ?? Number.MAX_SAFE_INTEGER;
}
function Ve(e) {
  return je(e) === de;
}
function je(e) {
  return yo(e);
}
function vt(e) {
  return e === "agent" || e === "role" || e === "power" || e === "knowledge" || e === "team";
}
function mr(e, t) {
  const n = vt(String(e?.node_type || "")) ? Nt(e, t) : void 0;
  return Qo(n) || Ve(e?.status);
}
function Nt(e, t, n) {
  const r = t || e, o = je(e?.status || r?.status), s = e?.[xe] || e?.started_at || r?.started_at || e?.created_at;
  return Zo({
    status: o,
    startedAt: s,
    finishedAt: r?.finished_at || e?.finished_at,
    label: Ci(e, t, n),
    percent: ei(
      gr(t),
      r?.output,
      e?.output
    )
  });
}
function Ci(e, t, n) {
  const r = gr(t), o = Ti(e, n);
  return Mi(
    r?.text,
    r?.message,
    t?.output?.text,
    e?.output?.text
  ) || o || `${mt(e?.node_type)}：${e?.node_name || e?.node_key || "节点"}`;
}
function Ti(e, t) {
  if (String(e?.node_type || "") !== "team")
    return "";
  const n = Ei(t?.node);
  if (!n)
    return `${mt(e?.node_type)}：${e?.node_name || e?.node_key || "节点"}`;
  const r = E(t?.nodeRuns).filter((o) => {
    if (Number(o?.flow_id || 0) !== n)
      return !1;
    const s = je(o?.status);
    return s === de || s === Se;
  }).slice(0, 2).map((o) => `${o?.node_name || o?.node_key || "节点"}正在执行`);
  return r.length === 0 ? `${mt(e?.node_type)}：${e?.node_name || e?.node_key || "节点"}` : r.join("、");
}
function Ei(e) {
  return Number(e?.config?.sub_flow_id || e?.config?.flow_id || 0);
}
function gr(e) {
  const t = E(e?.stream);
  for (let n = t.length - 1; n >= 0; n -= 1) {
    const r = t[n]?.payload?.output;
    if (K(r))
      return r;
  }
}
function _r(e, t) {
  const n = String(e?.node_type || ""), r = Re(e?.output), o = Re(t?.output), s = $i(r);
  if (K(s))
    return s;
  if (n === "agent" || n === "role") {
    const a = C(r) ? r.output : void 0;
    return re(
      o,
      a,
      C(a) ? a.output : void 0,
      C(a) ? a.content : void 0,
      C(r) && r.summary ? { text: r.summary } : void 0,
      r
    );
  }
  return n === "power" ? re(
    C(r) ? r.output : void 0,
    C(r) ? r.data?.output : void 0,
    r
  ) : n === "merge" ? Ri(r) : n === "team" ? re(
    C(r) ? Oi(r.output) : void 0,
    C(r) ? r.result?.run?.output : void 0,
    C(r) ? r.result?.output : void 0,
    r
  ) : re(
    C(r) ? r.output : void 0,
    C(r) ? r.result : void 0,
    r
  );
}
function Ri(e) {
  const t = le(e);
  if (!Object.keys(t).length)
    return re(e);
  const n = E(t.sources).map(Pi).filter(K);
  if (n.length > 0) {
    const o = Ii(t.meta);
    return o ? [{ text: o }, ...n] : n;
  }
  const r = Object.entries(le(t.merged)).map(([o, s]) => pr(o, o, s)).filter(K);
  return r.length > 0 ? r : re(
    t.text ? { text: t.text } : void 0,
    t.output,
    t.result,
    t.content,
    t.data,
    e
  );
}
function Pi(e) {
  const t = le(e);
  return Object.keys(t).length ? pr(
    R(t.title, t.key, "上游节点"),
    R(t.key),
    t.text || t.content
  ) : re(e);
}
function pr(e, t, n) {
  const r = re(
    n,
    C(n) ? n.output : void 0,
    C(n) ? n.result : void 0,
    C(n) ? n.content : void 0,
    C(n) && n.text ? { text: n.text } : void 0
  );
  if (!K(r))
    return;
  const o = R(e, t, "上游节点");
  return typeof r == "string" ? { title: o, text: r } : C(r) ? { ...r, title: o } : { title: o, json: r };
}
function Ii(e) {
  const t = le(e), n = Number(t.incoming_count || 0), r = Number(
    t.incoming_source_count || t.source_count || 0
  ), o = Number(t.source_count || 0), s = Number(t.missing_source_count || 0);
  if (!n && !o && !s)
    return "";
  const a = [`合并上游：${r}/${n}`];
  return o > r && a.push(`展示条目：${o}`), s > 0 && a.push(`缺少输出：${s}`), a.join("，");
}
function Oi(e) {
  const t = le(Re(e));
  if (!Object.keys(t).length)
    return e;
  const n = re(
    t.output,
    t.result,
    t.content,
    t.data,
    t.text ? { text: t.text } : void 0
  );
  if (K(n))
    return n;
  const r = Object.keys(t).filter(
    (o) => !o.startsWith("_") && !["input", "user_input"].includes(o)
  ).reverse();
  for (const o of r) {
    const s = Re(t[o]), a = C(s) ? re(
      s.output,
      s.result,
      s.content,
      s.data,
      s.text ? { text: s.text } : void 0
    ) : re(s);
    if (K(a))
      return a;
  }
}
function $i(e) {
  if (!C(e) || !ne(e.approval_id) && !ne(e.approvalId))
    return;
  const t = le(e.content), n = zi(e);
  if (n)
    return { text: n };
  const r = le(e.data), o = Object.keys(r).length ? r : le(t.data), s = R(e.text, o.text, e.comment);
  return re(
    o.output,
    o.params,
    s ? { text: s } : void 0,
    Fi(o)
  );
}
function zi(e) {
  const t = String(e.decision || "").toLowerCase();
  if (!t)
    return "";
  const n = t === "approved" ? "人工确认：已通过" : t === "rejected" ? "人工确认：已驳回" : `人工确认：${t}`, r = R(e.comment);
  return r ? `${n}

${r}` : n;
}
function Fi(e) {
  const t = {};
  return Object.entries(e).forEach(([n, r]) => {
    ["interaction", "output", "params", "text"].includes(n) || (t[n] = r);
  }), t;
}
function re(...e) {
  for (const t of e) {
    const n = tn(Re(t));
    if (K(n))
      return n;
  }
}
function tn(e) {
  const t = ii(e);
  if (t !== e && K(t))
    return t;
  if (typeof e == "string") {
    const o = Bt(e);
    if (o)
      return ot(
        o.payload,
        o.cleanText
      );
    const s = ft(e);
    return s ? ot(s) : e;
  }
  if (Array.isArray(e))
    return e.map(tn).filter(K);
  if (!C(e))
    return e;
  const n = Bt(
    R(e.text)
  );
  if (n)
    return ot(
      n.payload,
      n.cleanText
    );
  if (br(e))
    return ot(e);
  const r = Bi(e);
  return r !== void 0 ? r : e;
}
function Bi(e) {
  for (const t of ["output", "result", "data", "content", "json", "value"]) {
    const n = tn(
      Re(e[t])
    );
    if (K(n))
      return n;
  }
}
function ot(e, t = "") {
  const n = {}, r = Li(e.content);
  r && Dn(n, r), Dn(n, e);
  const o = ji(e) || t;
  return o && (n.text = o), !K(n) && r ? r : n;
}
function Li(e) {
  return C(e) ? e : typeof e == "string" && e.trim() ? {
    format: "markdown",
    text: e.trim()
  } : null;
}
function Dn(e, t) {
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
  ].forEach((r) => {
    Ft(t[r]) && (e[r] = t[r]);
  }), !Ft(e.rich) && C(t.value) && (e.rich = t.value);
}
function Ft(e) {
  return e == null || e === "" ? !1 : Array.isArray(e) ? e.length > 0 : C(e) ? Object.keys(e).length > 0 : !0;
}
function ji(e) {
  if (!C(e))
    return typeof e == "string" ? e.trim() : "";
  const t = R(e.text);
  if (t)
    return t;
  const n = e.content;
  return typeof n == "string" ? n.trim() : C(n) ? R(n.text) : "";
}
function Mi(...e) {
  for (const t of e) {
    const n = R(t);
    if (!n)
      continue;
    const r = ri(n) || Bt(n);
    if (r) {
      const o = R(
        r.cleanText,
        ni(r.payload),
        Gi(r.payload)
      );
      if (o)
        return o;
      continue;
    }
    if (!oi(n))
      return n;
  }
  return "";
}
function Gi(e) {
  if (!C(e))
    return "";
  const t = C(e.content) ? e.content : {};
  return R(e.title, t.title);
}
function Bt(e) {
  for (const n of ["agent-result", "agent-output", "json"]) {
    const r = qi(e, n);
    if (r)
      return r;
  }
  const t = ft(e);
  return t ? { cleanText: "", payload: t } : void 0;
}
function qi(e, t) {
  const n = `\`\`\`${t}`, r = e.indexOf(n);
  if (r < 0)
    return;
  let o = r + n.length;
  for (; o < e.length && Ui(e[o]); )
    o += 1;
  let s = o;
  for (; s < e.length; ) {
    const a = e.indexOf("```", s);
    if (a < 0) {
      const l = ft(e.slice(o));
      return l ? {
        cleanText: e.slice(0, r).trim(),
        payload: l
      } : void 0;
    }
    const c = ft(e.slice(o, a));
    if (c)
      return {
        cleanText: `${e.slice(0, r)}${e.slice(a + 3)}`.trim(),
        payload: c
      };
    s = a + 3;
  }
}
function ft(e) {
  const t = e.trim(), n = Ki(t), r = n === t ? [t] : [t, n];
  for (const o of r)
    try {
      const s = JSON.parse(o);
      if (br(s))
        return s;
    } catch {
    }
}
function br(e) {
  if (!C(e))
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
  ].some((n) => Ft(e[n]));
}
function Ki(e) {
  let t = "", n = !1, r = !1;
  for (const o of e) {
    if (r) {
      t += o, r = !1;
      continue;
    }
    if (o === "\\") {
      t += o, r = n;
      continue;
    }
    if (o === '"') {
      n = !n, t += o;
      continue;
    }
    if (n && o.charCodeAt(0) < 32) {
      t += Hi(o);
      continue;
    }
    t += o;
  }
  return t;
}
function Hi(e) {
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
function Ui(e) {
  return e === " " || e === "	" || e === "\r" || e === `
`;
}
function Re(e) {
  if (Array.isArray(e))
    return e.map(Re).filter(K);
  if (!C(e))
    return e;
  const t = {};
  return Object.entries(e).forEach(([n, r]) => {
    n !== "_debug_asset" && (t[n] = r);
  }), t;
}
function K(e) {
  return e == null || e === "" ? !1 : typeof e == "string" ? e.trim().length > 0 : typeof e == "number" || typeof e == "boolean" ? !0 : Array.isArray(e) ? e.some(K) : C(e) ? Object.keys(e).some(
    (t) => t !== "_debug_asset" && K(e[t])
  ) : !1;
}
function yr(e) {
  const t = C(e?._debug_asset) ? e._debug_asset : null, n = R(t?.name, t?.title);
  return `调试模式不会真正保存；正式运行会保存为${n ? `素材「${n}」的新版本` : "素材版本"}，并写入团队记忆。`;
}
function C(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function mt(e) {
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
function Wi(e, t) {
  const n = Lt(e), r = Lt(t);
  if (!n)
    return "等待开始";
  const o = [`开始 ${An(n)}`];
  return r ? (o.push(`结束 ${An(r)}`), o.push(
    `耗时 ${Jo(r.getTime() - n.getTime())}`
  )) : o.push("运行中"), o.join(" · ");
}
function Lt(e) {
  if (!e)
    return null;
  const t = new Date(String(e));
  return Number.isNaN(t.getTime()) ? null : t;
}
function An(e) {
  return e.toLocaleTimeString("zh-CN", {
    hour12: !1,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
function E(e) {
  return Array.isArray(e) ? e : [];
}
function nn(e) {
  const t = {};
  return e.forEach((n) => {
    n?.id && (t[String(n.id)] = n);
  }), t;
}
function Yi(e, t) {
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
const hr = bt.cn, Xi = Mn.AgentInteractionPanel, Vi = J.Dialog, Zi = J.DialogContent, Ji = J.DialogDescription, Qi = J.DialogTitle, es = Xe.Select, ts = Xe.SelectContent, ns = Xe.SelectItem, rs = Xe.SelectTrigger, os = Xe.SelectValue, is = be.formatStreamDuration, ss = be.useStreamClock, as = 220, Cn = 170, ls = 150;
function ds({
  view: e,
  flows: t,
  flowEdges: n,
  nodes: r,
  nodeEdges: o,
  edgeConditions: s,
  selected: a,
  connect: c,
  readonly: l,
  nodeTypes: m,
  executionState: f,
  paramApi: g,
  onSelect: u,
  onConnect: _,
  onOpenNodeResult: h,
  onSubmitApproval: w,
  onEdit: x,
  onDelete: I,
  onFlowConnect: A,
  onFlowConnectNew: v,
  onNodeConnect: T,
  onNodeConnectNew: F,
  onMove: H,
  onChangeNodeEdge: B
}) {
  return /* @__PURE__ */ i(lo, { children: /* @__PURE__ */ i(
    cs,
    {
      view: e,
      flows: t,
      flowEdges: n,
      nodes: r,
      nodeEdges: o,
      edgeConditions: s,
      selected: a,
      connect: c,
      readonly: l,
      nodeTypes: m,
      executionState: f,
      paramApi: g,
      onSelect: u,
      onConnect: _,
      onOpenNodeResult: h,
      onSubmitApproval: w,
      onEdit: x,
      onDelete: I,
      onFlowConnect: A,
      onFlowConnectNew: v,
      onNodeConnect: T,
      onNodeConnectNew: F,
      onMove: H,
      onChangeNodeEdge: B
    }
  ) });
}
function cs({
  view: e,
  flows: t,
  flowEdges: n,
  nodes: r,
  nodeEdges: o,
  edgeConditions: s,
  selected: a,
  connect: c,
  readonly: l,
  nodeTypes: m,
  executionState: f,
  paramApi: g,
  onSelect: u,
  onConnect: _,
  onOpenNodeResult: h,
  onSubmitApproval: w,
  onEdit: x,
  onDelete: I,
  onFlowConnect: A,
  onFlowConnectNew: v,
  onNodeConnect: T,
  onNodeConnectNew: F,
  onMove: H,
  onChangeNodeEdge: B
}) {
  const [N, O] = P(null), Q = Pt(null), Pe = Pt(e), Ie = Pt(!1), { fitView: Me, screenToFlowPosition: Oe } = co(), ie = ss(!!f?.active), fe = e === "flow" ? t : r, U = e === "flow" ? n : o, W = Te(
    () => fe.map((b) => jt(e, b)).join("|"),
    [fe, e]
  ), se = Te(
    () => fe.map((b, k) => {
      const D = jt(e, b), M = xt(k);
      return {
        id: D,
        type: "teamGraphNode",
        position: {
          x: Number(b.position?.x ?? M.x),
          y: Number(b.position?.y ?? M.y)
        },
        sourcePosition: dt.Right,
        targetPosition: dt.Left,
        selected: a?.kind === e && a.key === D,
        zIndex: a?.kind === e && a.key === D ? 100 : 1,
        draggable: !l,
        connectable: !l,
        style: {
          width: Le,
          height: ve
        },
        data: {
          kind: e,
          item: b,
          connect: c,
          nodeTypes: m,
          readonly: l,
          executionState: f,
          paramApi: g,
          now: ie,
          onOpenNodeResult: h,
          onSubmitApproval: w,
          onEdit: x,
          onDelete: I
        }
      };
    }),
    [
      f,
      c,
      fe,
      m,
      ie,
      I,
      x,
      h,
      w,
      g,
      l,
      a,
      e
    ]
  ), [te, $e] = P(se), [ee, ze] = P(null), [Fe, Ze] = P(""), St = Te(() => {
    const b = U.map((k, D) => {
      const M = e === "flow" ? "flow_edge" : "node_edge", V = a?.kind === M && a.index === D, ae = fr(k, D), ue = f?.activeEdgeKeys.has(ae), Ke = f?.completedEdgeKeys.has(ae), me = Cs(k, Fe), et = ue || Ke, Et = V ? "#2563eb" : me || et ? "#6366f1" : "#d4d4d8";
      return {
        id: Is(e, k, D),
        source: k.from_key,
        target: k.to_key,
        type: "teamGraphEdge",
        animated: !!(et || me),
        selected: V,
        selectable: !0,
        reconnectable: !1,
        zIndex: V || ue || me ? 20 : 1,
        style: {
          stroke: Et,
          strokeWidth: V || ue || me ? 2 : 1.5,
          strokeDasharray: V || me ? "8 7" : "7 9",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          filter: ue || me ? "drop-shadow(0 0 5px rgb(37 99 235 / 0.45))" : void 0
        },
        data: {
          view: e,
          edge: k,
          index: D,
          highlighted: me,
          nodes: r,
          edgeConditions: s,
          readonly: l,
          onSelect: u,
          onDelete: I,
          onChangeNodeEdge: B
        }
      };
    });
    return ee && b.push({
      id: Rs(ee),
      source: ee.source,
      target: ee.target,
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
          from_key: ee.source,
          to_key: ee.target,
          condition: ""
        },
        index: -1,
        preview: !0,
        nodes: r,
        edgeConditions: s,
        readonly: !0,
        onSelect: u,
        onDelete: I,
        onChangeNodeEdge: B
      }
    }), b;
  }, [
    s,
    U,
    f,
    Fe,
    r,
    B,
    I,
    u,
    ee,
    l,
    a,
    e
  ]);
  We(() => {
    window.requestAnimationFrame(() => {
      Me({ padding: 0.24, maxZoom: 1.15, duration: 160 });
    });
  }, [Me, W, e]), We(() => {
    $e((b) => Ie.current ? b : Pe.current !== e ? (Pe.current = e, se) : Rn(b, se));
  }, [se, e]), We(() => {
    if (!N)
      return;
    const b = () => O(null), k = (D) => {
      D.key === "Escape" && b();
    };
    return window.addEventListener("click", b), window.addEventListener("contextmenu", b), window.addEventListener("keydown", k), () => {
      window.removeEventListener("click", b), window.removeEventListener("contextmenu", b), window.removeEventListener("keydown", k);
    };
  }, [N]), We(() => {
    const b = (k) => {
      l || !a || k.defaultPrevented || k.key !== "Delete" && k.key !== "Backspace" || xr(k.target) || (k.preventDefault(), I(a));
    };
    return window.addEventListener("keydown", b), () => window.removeEventListener("keydown", b);
  }, [I, l, a]);
  const Dt = G(
    (b) => {
      l || $e((k) => uo(b, k));
    },
    [l]
  ), Je = G(() => {
    Ie.current = !0, ze(null);
  }, []), Qe = G(
    (b, k) => {
      if (l)
        return;
      const D = En(
        k,
        te,
        U
      );
      ze(
        (M) => Es(M, D) ? M : D
      );
    },
    [U, te, l]
  ), At = G(
    (b, k) => {
      Ie.current = !1;
      const D = En(
        k,
        te,
        U
      );
      if (ze(null), l)
        return;
      const M = wr(k.position);
      $e(
        (V) => Rn(V, se).map(
          (ae) => ae.id === k.id ? { ...ae, position: M } : ae
        )
      ), H(e, k.id, M), D && (e === "flow" ? A(D.source, D.target) : T(D.source, D.target));
    },
    [
      se,
      U,
      te,
      A,
      H,
      T,
      l,
      e
    ]
  ), Ct = G(
    (b) => {
      l || !b.source || !b.target || (e === "flow" ? A(b.source, b.target) : T(b.source, b.target));
    },
    [A, T, l, e]
  ), Ge = G(
    (b, k) => {
      Q.current = k.nodeId, k.nodeId && _({ kind: e, fromKey: k.nodeId });
    },
    [_, e]
  ), Tt = G(
    (b, k) => {
      const D = Q.current;
      if (Q.current = null, _(null), l || !D || k.toNode)
        return;
      const M = $s(b);
      if (!M)
        return;
      const V = Oe(M), ae = te.find((Ke) => Ke.id === D);
      if (!Fs(ae?.position, V))
        return;
      const ue = Ds(ae?.position, V);
      e === "flow" ? v(D, ue) : F(D, ue);
    },
    [
      te,
      _,
      v,
      F,
      l,
      Oe,
      e
    ]
  ), De = G(
    (b, k) => {
      if (!zs(b)) {
        if (vs(k)) {
          b.stopPropagation(), k.data.onOpenNodeResult?.(k.id);
          return;
        }
        u(Mt(e, k.id));
      }
    },
    [u, e]
  ), ce = G(
    (b, k) => {
      b.preventDefault();
      const D = Mt(e, k.id);
      u(D), l || O({ x: b.clientX, y: b.clientY, target: D });
    },
    [u, l, e]
  ), qe = G(
    (b, k) => {
      Ze(k.id);
    },
    []
  ), ye = G(() => {
    Ze("");
  }, []), he = G(
    (b, k) => {
      b.stopPropagation();
      const D = On(k), M = a?.kind === D.kind && a.index === D.index, V = Os(k);
      if (M && !l && !V) {
        I(D);
        return;
      }
      u(D);
    },
    [I, u, l, a]
  ), Be = G(
    (b, k) => {
      b.preventDefault();
      const D = On(k);
      u(D), l || O({ x: b.clientX, y: b.clientY, target: D });
    },
    [u, l]
  );
  return /* @__PURE__ */ p(
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
          width: ${Le}px;
          height: ${ve}px;
          align-items: center;
          justify-content: center;
          user-select: none;
        }
        .team-graph-node-circle {
          position: relative;
          display: flex;
          width: ${Le}px;
          height: ${ve}px;
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
          top: ${ve + 8}px;
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
          fo,
          {
            className: "team-workflow-react-flow",
            nodes: te,
            edges: St,
            nodeTypes: ks,
            edgeTypes: xs,
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
            onNodesChange: Dt,
            onConnect: Ct,
            onConnectStart: Ge,
            onConnectEnd: Tt,
            onNodeDragStart: Je,
            onNodeDrag: Qe,
            onNodeDragStop: At,
            onNodeClick: De,
            onNodeContextMenu: ce,
            onNodeMouseEnter: qe,
            onNodeMouseLeave: ye,
            onEdgeClick: he,
            onEdgeContextMenu: Be,
            onPaneClick: () => {
              O(null), u(null);
            },
            onPaneContextMenu: (b) => {
              b.preventDefault(), O(null);
            },
            children: /* @__PURE__ */ i(mo, { showInteractive: !1, position: "top-right" })
          }
        ),
        /* @__PURE__ */ i(
          Ss,
          {
            menu: N,
            onEdit: (b) => {
              O(null), x(b);
            },
            onDelete: (b) => {
              O(null), I(b);
            }
          }
        )
      ]
    }
  );
}
function us({ data: e, selected: t }) {
  const n = jt(e.kind, e.item), r = Mt(e.kind, n), o = In(e.item), s = e.executionState?.nodeRunsByKey[n], a = s?.run, c = a?.agent_run_id ? e.executionState?.agentRunsByID[String(a.agent_run_id)] : void 0, l = e.kind === "node" && a && vt(
    String(a.node_type || In(e.item) || "")
  ) ? Nt(a, c, {
    node: e.item,
    nodeRuns: e.executionState?.nodeRuns || []
  }) : void 0, m = je(s?.status), f = Si(m), g = e.kind === "node" ? e.executionState?.pendingApprovalsByNodeKey[n] : void 0, u = fs(m), _ = ms(l?.percent), h = e.connect?.kind === e.kind && e.connect.fromKey === n;
  return /* @__PURE__ */ p(
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
          pn,
          {
            type: "target",
            position: dt.Left,
            style: Tn(u, "target")
          }
        ),
        /* @__PURE__ */ i(
          pn,
          {
            type: "source",
            position: dt.Right,
            style: Tn(u, "source")
          }
        ),
        /* @__PURE__ */ p(
          "div",
          {
            className: "team-graph-node-circle",
            style: {
              ...gs(u, t, h),
              ...f
            },
            children: [
              u === "running" ? /* @__PURE__ */ p(
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
                        className: _ == null ? "team-graph-progress-indeterminate" : "",
                        style: _ != null ? {
                          strokeDasharray: "188.5",
                          strokeDashoffset: `${188.5 * (1 - _ / 100)}`
                        } : {
                          strokeDasharray: "45 143.5",
                          strokeDashoffset: "0"
                        }
                      }
                    )
                  ]
                }
              ) : null,
              hs(Pn(e.item), o, e.kind),
              /* @__PURE__ */ i(_s, { status: u })
            ]
          }
        ),
        g && e.onSubmitApproval ? /* @__PURE__ */ i(
          Ns,
          {
            approval: g,
            paramApi: e.paramApi,
            onSubmit: e.onSubmitApproval
          }
        ) : null,
        /* @__PURE__ */ p("div", { className: "team-graph-node-label", children: [
          /* @__PURE__ */ i("span", { className: "team-graph-node-title", children: Pn(e.item) || n }),
          /* @__PURE__ */ i("span", { className: "team-graph-node-subtitle", children: bs({
            status: u,
            timing: l,
            now: e.now,
            idleText: e.kind === "flow" ? Ps(e.item) || n : Fo(o, e.nodeTypes)
          }) }),
          e.readonly ? null : /* @__PURE__ */ p("div", { className: "team-graph-actions", children: [
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                className: "nodrag nopan team-graph-action-button",
                style: bn,
                title: "编辑",
                onClick: (w) => {
                  w.stopPropagation(), e.onEdit(r);
                },
                onMouseDown: (w) => w.stopPropagation(),
                children: /* @__PURE__ */ i(st, { size: 13, style: yn })
              }
            ),
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                className: "nodrag nopan team-graph-action-button team-graph-action-button-danger",
                style: {
                  ...bn,
                  color: "hsl(var(--destructive))"
                },
                title: "删除",
                onClick: (w) => {
                  w.stopPropagation(), e.onDelete(r);
                },
                onMouseDown: (w) => w.stopPropagation(),
                children: /* @__PURE__ */ i(Ln, { size: 13, style: yn })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function fs(e) {
  return e === de ? "running" : e === Se ? "waiting" : e === Ne ? "done" : e === wt ? "error" : "idle";
}
function ms(e) {
  if (e == null || e === "")
    return null;
  const t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? null : Math.max(0, Math.min(100, Math.round(t)));
}
function gs(e, t, n) {
  const r = {};
  return t && (r.borderColor = "#6366f1", r.boxShadow = "0 0 15px rgb(99 102 241 / 0.35), 0 0 0 4px rgb(99 102 241 / 0.12)"), n && (r.borderColor = "#f59e0b", r.boxShadow = "0 0 0 4px rgb(251 191 36 / 0.18), 0 4px 12px rgb(15 23 42 / 0.12)"), e === "running" && (r.borderColor = "#3b82f6", r.boxShadow = "0 0 0 4px rgb(59 130 246 / 0.08), 0 0 18px rgb(59 130 246 / 0.16)"), e === "waiting" && (r.borderColor = "#f59e0b", r.boxShadow = "0 0 0 4px rgb(245 158 11 / 0.10), 0 0 20px rgb(245 158 11 / 0.28)"), e === "done" && (r.borderColor = "#10b981", r.boxShadow = "0 4px 12px rgb(16 185 129 / 0.15)"), e === "error" && (r.borderColor = "hsl(var(--destructive))", r.boxShadow = "0 4px 12px rgb(239 68 68 / 0.16)"), r;
}
function Tn(e, t) {
  let n = "rgb(15 23 42 / 0.34)";
  e === "done" && t === "source" && (n = "rgb(16 185 129 / 0.55)"), e === "running" && (n = "rgb(59 130 246 / 0.6)"), e === "waiting" && (n = "rgb(245 158 11 / 0.6)"), e === "error" && (n = "rgb(239 68 68 / 0.62)");
  const r = {
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
  return t === "target" ? r.left = 0 : r.right = 0, r;
}
function _s({ status: e }) {
  if (e === "running" || e === "idle")
    return null;
  const t = e === "done" ? /* @__PURE__ */ i(no, { size: 10 }) : /* @__PURE__ */ i(ro, { size: 10 });
  return /* @__PURE__ */ i("span", { className: "team-graph-node-badge", style: ps(e), children: t });
}
function ps(e) {
  return e === "done" ? { background: "#10b981", color: "#fff" } : e === "waiting" ? { background: "#f59e0b", color: "#fff" } : e === "error" ? {
    background: "hsl(var(--destructive))",
    color: "hsl(var(--destructive-foreground))"
  } : { background: "hsl(var(--background))" };
}
function bs({
  status: e,
  timing: t,
  now: n,
  idleText: r
}) {
  const o = ys(t, n);
  return e === "running" ? `进行中${o}` : e === "waiting" ? "待决策" : e === "done" ? `已完成${o}` : e === "error" ? "已失败" : r || "待激活";
}
function ys(e, t) {
  if (!e?.startedAt)
    return "";
  const n = e.finishedAt || t || Date.now();
  return `（${is(n - e.startedAt)}）`;
}
function hs(e, t, n) {
  const r = String(t || "").toLowerCase(), o = String(e || "").toLowerCase();
  return n === "flow" ? /* @__PURE__ */ i(at, { size: 20, color: "#6366f1" }) : r === "agent" ? /* @__PURE__ */ i(Ur, { size: 20, color: "#3b82f6" }) : r === "role" ? /* @__PURE__ */ i(Wr, { size: 20, color: "#6366f1" }) : r === "power" ? /* @__PURE__ */ i(Yr, { size: 20, color: "#f59e0b" }) : r === "team" ? /* @__PURE__ */ i(at, { size: 20, color: "#14b8a6" }) : r === "context" ? /* @__PURE__ */ i(Xr, { size: 20, color: "#0ea5e9" }) : r === "knowledge" ? /* @__PURE__ */ i(Vr, { size: 20, color: "#22c55e" }) : r === "condition" ? /* @__PURE__ */ i(Zr, { size: 20, color: "#f97316" }) : r === "merge" ? /* @__PURE__ */ i(Jr, { size: 20, color: "#f43f5e" }) : r === "human_approval" ? /* @__PURE__ */ i(fn, { size: 20, color: "#8b5cf6" }) : r === "save" ? /* @__PURE__ */ i(mn, { size: 20, color: "#10b981" }) : o.includes("收集") || o.includes("输入") || o.includes("反馈") || o.includes("审批") ? /* @__PURE__ */ i(fn, { size: 20, color: "#8b5cf6" }) : o.includes("保存") || o.includes("存储") || o.includes("入库") ? /* @__PURE__ */ i(mn, { size: 20, color: "#10b981" }) : o.includes("写") || o.includes("剧本") || o.includes("故事") || o.includes("设计") || o.includes("创作") ? /* @__PURE__ */ i(Qr, { size: 20, color: "#a855f7" }) : o.includes("背景") || o.includes("世界") || o.includes("元素") || o.includes("灵感") ? /* @__PURE__ */ i(eo, { size: 20, color: "#f59e0b" }) : /* @__PURE__ */ i(to, { size: 20, color: "#71717a" });
}
function ws(e) {
  const { data: t, selected: n, style: r, animated: o } = e, [s, a, c] = go({
    sourceX: e.sourceX,
    sourceY: e.sourceY,
    sourcePosition: e.sourcePosition,
    targetX: e.targetX,
    targetY: e.targetY,
    targetPosition: e.targetPosition
  });
  if (!t)
    return /* @__PURE__ */ i(It, { path: s, style: r });
  if (t.preview)
    return /* @__PURE__ */ i(It, { path: s, style: r, interactionWidth: 0 });
  const l = kr(t.view, t.index), m = t.view === "flow" ? [] : Wn(
    t.edge,
    t.nodes,
    t.edgeConditions
  ), f = m.length > 0, g = m[0]?.id ?? "", u = m.some(
    (x) => x.id === t.edge.condition
  ) && t.edge.condition || g, _ = f || n, h = !!t.highlighted, w = {
    ...r,
    opacity: n ? 1 : h ? 0.95 : o ? 0.72 : 0.42,
    transition: "stroke 0.25s ease, stroke-width 0.25s ease, opacity 0.25s ease"
  };
  return /* @__PURE__ */ p(Ht, { children: [
    /* @__PURE__ */ i(It, { path: s, style: w, interactionWidth: 32 }),
    o ? /* @__PURE__ */ p("g", { style: { opacity: n || h ? 0.9 : 0.45 }, children: [
      /* @__PURE__ */ i("circle", { r: "2.5", fill: "#6366f1", opacity: "0.25", children: /* @__PURE__ */ i("animateMotion", { dur: "3s", repeatCount: "indefinite", path: s }) }),
      /* @__PURE__ */ i("circle", { r: "1.5", fill: "#818cf8", children: /* @__PURE__ */ i("animateMotion", { dur: "3s", repeatCount: "indefinite", path: s }) })
    ] }) : null,
    _ ? /* @__PURE__ */ i(_o, { children: /* @__PURE__ */ i(
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
        children: f ? /* @__PURE__ */ p("div", { className: "relative w-24", children: [
          n && !t.readonly ? /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "absolute -right-2 -top-2 z-20 flex size-5 items-center justify-center rounded-full border border-destructive bg-background text-destructive shadow-sm hover:bg-destructive/10",
              title: "删除关系",
              onClick: (x) => {
                x.stopPropagation(), t.onDelete(l);
              },
              children: /* @__PURE__ */ i(lt, { className: "size-3" })
            }
          ) : null,
          /* @__PURE__ */ p(
            es,
            {
              value: u,
              disabled: t.readonly,
              onValueChange: (x) => t.onChangeNodeEdge(t.index, { condition: x }),
              children: [
                /* @__PURE__ */ i(rs, { className: "h-7 justify-center rounded-full bg-background px-3 pr-3 text-xs shadow-sm [&_.select-trigger-chevron]:hidden", children: /* @__PURE__ */ i(os, {}) }),
                /* @__PURE__ */ i(ts, { children: m.map((x) => /* @__PURE__ */ i(ns, { value: x.id, children: x.value }, x.id)) })
              ]
            }
          )
        ] }) : /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: hr(
              "flex items-center justify-center rounded-full border bg-background text-xs text-foreground shadow-sm",
              n && !t.readonly ? "size-6 border-destructive text-destructive hover:bg-destructive/10" : "size-5 border-blue-300 text-blue-600"
            ),
            title: n && !t.readonly ? "删除关系" : "点击选中关系，Delete 删除",
            onClick: (x) => {
              x.stopPropagation(), n && !t.readonly ? t.onDelete(l) : t.onSelect(l);
            },
            children: n && !t.readonly ? /* @__PURE__ */ i(lt, { className: "size-3.5" }) : null
          }
        )
      }
    ) }) : null
  ] });
}
const ks = {
  teamGraphNode: us
}, xs = {
  teamGraphEdge: ws
};
function vs(e) {
  const t = e.data;
  if (t.kind !== "node" || !t.onOpenNodeResult)
    return !1;
  const n = t.executionState?.nodeRunsByKey[e.id]?.status, r = t.executionState?.pendingApprovalsByNodeKey[e.id];
  return !!(n && !r);
}
function Ns({
  approval: e,
  paramApi: t,
  onSubmit: n
}) {
  return /* @__PURE__ */ i(Vi, { open: !0, children: /* @__PURE__ */ p(
    Zi,
    {
      "data-assistant-layer": "true",
      "data-stop-card-click": "true",
      className: hr(
        "flex max-h-[86vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl",
        "[&_*]:max-w-full [&_label]:min-w-0 [&_span]:break-words"
      ),
      showCloseButton: !1,
      onEscapeKeyDown: (r) => r.preventDefault(),
      onPointerDownOutside: (r) => r.preventDefault(),
      onInteractOutside: (r) => r.preventDefault(),
      onClick: (r) => r.stopPropagation(),
      onMouseDown: (r) => r.stopPropagation(),
      onPointerDown: (r) => r.stopPropagation(),
      onWheel: (r) => r.stopPropagation(),
      children: [
        /* @__PURE__ */ i(Qi, { className: "sr-only", children: e.title || "需要补充信息" }),
        /* @__PURE__ */ i(Ji, { className: "sr-only", children: "填写并提交后，团队工作流会从当前节点继续执行。" }),
        /* @__PURE__ */ i(
          Xi,
          {
            interaction: e.interaction,
            paramApi: t,
            layout: "dialog",
            onSubmit: (r) => n(e, r)
          }
        )
      ]
    }
  ) });
}
function Ss({
  menu: e,
  onEdit: t,
  onDelete: n
}) {
  return e ? /* @__PURE__ */ p(
    "div",
    {
      className: "fixed z-50 min-w-32 rounded-md border bg-popover p-1 text-sm text-popover-foreground shadow-lg",
      style: { left: e.x, top: e.y },
      onClick: (r) => r.stopPropagation(),
      onContextMenu: (r) => r.preventDefault(),
      children: [
        e.target.kind === "flow" || e.target.kind === "node" ? /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            className: "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left hover:bg-accent hover:text-accent-foreground",
            onClick: () => t(e.target),
            children: [
              /* @__PURE__ */ i(st, { className: "size-4" }),
              "编辑"
            ]
          }
        ) : null,
        /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            className: "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-destructive hover:bg-destructive/10",
            onClick: () => n(e.target),
            children: [
              /* @__PURE__ */ i(Ln, { className: "size-4" }),
              "删除"
            ]
          }
        )
      ]
    }
  ) : null;
}
function jt(e, t) {
  return e === "flow" ? t.key : t.node_key;
}
function wr(e, t = 0) {
  const n = Number(e.x), r = Number(e.y) + t;
  return {
    x: Number.isFinite(n) ? n : 0,
    y: Number.isFinite(r) ? r : 0
  };
}
function Ds(e, t) {
  const n = wr(t, -ve / 2);
  if (!e)
    return n;
  const r = gt(e), o = gt(n), s = o.x - r.x, a = o.y - r.y, c = Math.hypot(s, a);
  if (c > 0 && c <= as)
    return n;
  const l = c > 0 ? s / c : 1, m = c > 0 ? a / c : 0;
  return {
    x: r.x + l * Cn - Le / 2,
    y: r.y + m * Cn - ve / 2
  };
}
function En(e, t, n) {
  if (!As(e.id, n))
    return null;
  const r = gt(e.position);
  let o = null, s = Number.MAX_VALUE;
  if (t.forEach((l) => {
    if (l.id === e.id)
      return;
    const m = gt(l.position), f = Math.hypot(
      m.x - r.x,
      m.y - r.y
    );
    f < s && f < ls && (o = l, s = f);
  }), !o)
    return null;
  const a = o.position.x < e.position.x, c = {
    source: a ? o.id : e.id,
    target: a ? e.id : o.id
  };
  return Ts(n, c) ? null : c;
}
function gt(e) {
  return {
    x: e.x + Le / 2,
    y: e.y + ve / 2
  };
}
function As(e, t) {
  return !t.some((n) => n.from_key === e || n.to_key === e);
}
function Cs(e, t) {
  return t ? e.from_key === t || e.to_key === t : !1;
}
function Ts(e, t) {
  return e.some(
    (n) => n.from_key === t.source && n.to_key === t.target
  );
}
function Es(e, t) {
  return e?.source === t?.source && e?.target === t?.target;
}
function Rs(e) {
  return `proximity:${e.source}:${e.target}`;
}
function Rn(e, t) {
  if (!e.length)
    return t;
  const n = new Map(e.map((r) => [r.id, r]));
  return t.map((r) => {
    const o = n.get(r.id);
    return o ? { ...o, ...r, position: o.position } : r;
  });
}
function Pn(e) {
  return e.name;
}
function Ps(e) {
  return "node_key" in e ? "" : e.goal || "";
}
function In(e) {
  return "node_key" in e && e.type || "";
}
function Mt(e, t) {
  return e === "flow" ? { kind: "flow", key: t } : { kind: "node", key: t };
}
function Is(e, t, n) {
  return `${e}:${t.from_key}->${t.to_key}:${n}`;
}
function On(e) {
  const t = e.data;
  return kr(t.view, t.index);
}
function kr(e, t) {
  return e === "flow" ? { kind: "flow_edge", index: t } : { kind: "node_edge", index: t };
}
function Os(e) {
  const t = e.data;
  return t.view === "flow" ? !1 : Wn(
    t.edge,
    t.nodes,
    t.edgeConditions
  ).length > 0;
}
function $s(e) {
  if ("clientX" in e)
    return { x: e.clientX, y: e.clientY };
  const t = e.changedTouches[0] ?? e.touches[0];
  return t ? { x: t.clientX, y: t.clientY } : null;
}
function xr(e) {
  const t = e;
  if (!t)
    return !1;
  const n = t.tagName.toLowerCase();
  return n === "input" || n === "textarea" || n === "select" || t.isContentEditable || !!t.closest('[contenteditable="true"]');
}
function zs(e) {
  const t = e.target;
  if (!t)
    return !1;
  if (xr(t))
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
function Fs(e, t) {
  if (!e)
    return !1;
  const n = {
    x: e.x + Le,
    y: e.y + ve / 2
  };
  return Math.hypot(t.x - n.x, t.y - n.y) > 48;
}
const Bs = bt.cn, Ls = Ut.Button, vr = J.Dialog, Nr = J.DialogContent, Sr = J.DialogDescription, Dr = J.DialogHeader, Ar = J.DialogTitle, js = Gn.Textarea, Cr = Mn.AgentInteractionPanel, Tr = xo.EnergonContentView, Ms = be.isStreamTimingRunning, Er = be.StreamTimingBadge, Rr = be.useStreamClock;
function Gs({
  open: e,
  target: t,
  prompt: n,
  running: r,
  result: o,
  paramApi: s,
  pendingApprovalsByNodeKey: a,
  onOpenChange: c,
  onPromptChange: l,
  onRun: m,
  onSubmitApproval: f
}) {
  const g = t === "team" ? "调试" : "调试工作流", u = String(o?.run?.status || o?.status || ""), _ = u ? `当前状态：${cr(u)}` : "调试会先自动保存，并使用当前保存内容运行", h = "输入目标后会先自动保存当前编辑内容，并使用保存后的内容执行；每个节点的执行状态和输出会显示在这里。", w = t === "team" ? "会先保存当前团队工作流编排，再按保存后的内容逐个执行。" : "会先保存当前工作流节点流程，再按节点顺序执行。";
  return /* @__PURE__ */ i(vr, { open: e, onOpenChange: c, children: /* @__PURE__ */ p(
    Nr,
    {
      className: "flex flex-col overflow-hidden sm:max-w-4xl",
      style: {
        height: "min(82vh, 48rem)",
        maxHeight: "min(82vh, 48rem)"
      },
      children: [
        /* @__PURE__ */ p(Dr, { children: [
          /* @__PURE__ */ i(Ar, { children: g }),
          /* @__PURE__ */ i(Sr, { className: "sr-only", children: w })
        ] }),
        /* @__PURE__ */ p("div", { className: "flex min-h-0 flex-1 flex-col gap-4", children: [
          /* @__PURE__ */ p("div", { className: "flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border bg-muted/20", children: [
            /* @__PURE__ */ p("div", { className: "flex items-center justify-between gap-3 border-b px-3 py-2", children: [
              /* @__PURE__ */ i("div", { className: "text-sm font-medium", children: "运行展示" }),
              /* @__PURE__ */ i("div", { className: "text-xs text-muted-foreground", children: _ })
            ] }),
            /* @__PURE__ */ i("div", { className: "relative min-h-0 flex-1", children: o ? /* @__PURE__ */ i("div", { className: "absolute inset-0 overflow-hidden", children: /* @__PURE__ */ i(
              qs,
              {
                result: o,
                paramApi: s,
                pendingApprovalsByNodeKey: a,
                onSubmitApproval: f
              }
            ) }) : /* @__PURE__ */ i("div", { className: "absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted-foreground", children: /* @__PURE__ */ i("span", { className: "max-w-3xl", children: h }) }) })
          ] }),
          /* @__PURE__ */ p("div", { className: "shrink-0 rounded-md border bg-background p-3 shadow-sm", children: [
            /* @__PURE__ */ i(
              js,
              {
                value: n,
                disabled: r,
                className: "min-h-24 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0",
                placeholder: "输入这次调试要完成的目标、输入材料或约束...",
                onChange: (x) => l(x.target.value)
              }
            ),
            /* @__PURE__ */ p("div", { className: "mt-3 flex items-center justify-between gap-3 border-t pt-3", children: [
              /* @__PURE__ */ i("div", { className: "text-xs text-muted-foreground", children: w }),
              /* @__PURE__ */ p(Ls, { disabled: r, onClick: m, children: [
                r ? /* @__PURE__ */ i(Ee, { className: "size-4 animate-spin" }) : /* @__PURE__ */ i(at, { className: "size-4" }),
                r ? "调试中" : "开始调试"
              ] })
            ] })
          ] })
        ] })
      ]
    }
  ) });
}
function qs({
  result: e,
  paramApi: t,
  pendingApprovalsByNodeKey: n,
  onSubmitApproval: r
}) {
  const o = e?.run || {}, s = en(E(e?.node_runs)), a = nn(E(e?.agent_runs)), c = Ve(o.status) || s.some(
    (m) => mr(m, a[String(m.agent_run_id)])
  ), l = Rr(c);
  return e?.error && !e?.run ? /* @__PURE__ */ i("div", { className: "h-full overflow-auto p-4 text-sm text-destructive", children: String(e.error) }) : /* @__PURE__ */ p(
    "div",
    {
      className: "h-full space-y-3 overflow-auto p-4 text-sm",
      style: { maxHeight: "calc(min(82vh, 48rem) - 14rem)" },
      children: [
        s.length > 0 ? /* @__PURE__ */ i("div", { className: "space-y-3", children: s.map((m, f) => /* @__PURE__ */ i(
          Ks,
          {
            row: m,
            index: f,
            agentTrace: a[String(m.agent_run_id)],
            approval: n[String(m?.node_key || "")],
            paramApi: t,
            now: l,
            onSubmitApproval: r
          },
          Yi(m, f)
        )) }) : /* @__PURE__ */ i("div", { className: "flex h-full min-h-72 items-center justify-center text-center text-sm text-muted-foreground", children: /* @__PURE__ */ p("div", { className: "inline-flex items-center gap-2", children: [
          /* @__PURE__ */ i(Ee, { className: "size-3 animate-spin" }),
          "正在等待节点开始执行..."
        ] }) }),
        o.error ? /* @__PURE__ */ i("div", { className: "rounded-md bg-destructive/10 p-3 text-xs text-destructive", children: o.error }) : null
      ]
    }
  );
}
function Ks({
  row: e,
  index: t,
  agentTrace: n,
  approval: r,
  paramApi: o,
  now: s,
  onSubmitApproval: a
}) {
  const c = e.node_name || e.node_key || `节点 ${t + 1}`, l = String(e.node_type || ""), m = _r(e, n), f = vt(l) ? Nt(e, n) : void 0, g = mr(e, n), u = l === "save" ? yr(e.output) : "", _ = ur(e);
  return /* @__PURE__ */ p("article", { className: "rounded-md border bg-background p-3", children: [
    /* @__PURE__ */ p("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ p("div", { className: "min-w-0", children: [
        /* @__PURE__ */ p("div", { className: "font-medium", children: [
          t + 1,
          ". ",
          c
        ] }),
        /* @__PURE__ */ p("div", { className: "mt-1 text-xs text-muted-foreground", children: [
          mt(l),
          " ·",
          " ",
          Wi(e.started_at, e.finished_at)
        ] })
      ] }),
      f ? /* @__PURE__ */ i(Er, { timing: f, now: s, className: "max-w-full" }) : /* @__PURE__ */ i(Pr, { status: e.status, nodeType: l }),
      _ ? /* @__PURE__ */ i("div", { className: "basis-full rounded bg-destructive/10 p-2 text-xs text-destructive", children: _ }) : null
    ] }),
    u ? /* @__PURE__ */ i("div", { className: "mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800", children: u }) : null,
    r ? /* @__PURE__ */ i("div", { className: "mt-3 overflow-hidden rounded-md border border-amber-200 bg-amber-50/45", children: /* @__PURE__ */ i(
      Cr,
      {
        interaction: r.interaction,
        paramApi: o,
        layout: "inline",
        onSubmit: (h) => a(r, h)
      }
    ) }) : null,
    /* @__PURE__ */ i("div", { className: "mt-3 rounded-md border bg-muted/15 p-3", children: K(m) ? /* @__PURE__ */ i(Tr, { output: m, emptyText: "暂无节点输出。" }) : g ? /* @__PURE__ */ p("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ i(Ee, { className: "size-3 animate-spin" }),
      "正在等待节点输出..."
    ] }) : /* @__PURE__ */ i("div", { className: "text-xs text-muted-foreground", children: "暂无节点输出。" }) })
  ] });
}
function Pr({
  status: e,
  nodeType: t
}) {
  const n = String(e || Wt);
  return /* @__PURE__ */ p(
    "span",
    {
      className: Bs(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs",
        vi(n)
      ),
      children: [
        n === de ? /* @__PURE__ */ i(Ee, { className: "size-3 animate-spin" }) : null,
        Di(n, t)
      ]
    }
  );
}
function Hs({
  open: e,
  nodeKey: t,
  nodes: n,
  result: r,
  approval: o,
  paramApi: s,
  onOpenChange: a,
  onSubmitApproval: c
}) {
  const l = n.find((T) => T.node_key === t), m = en(E(r?.node_runs)), f = m.find(
    (T) => String(T?.node_key || "") === t
  ), g = nn(E(r?.agent_runs)), u = f?.agent_run_id ? g[String(f.agent_run_id)] : void 0, _ = String(f?.node_type || l?.type || ""), h = f && !o ? _r(f, u) : void 0, w = _ === "save" && f ? yr(f.output) : "", x = f && vt(_) ? Nt(f, u, { node: l, nodeRuns: m }) : void 0, I = Ms(x) || !!(f && Ve(f.status)), A = Rr(I), v = ur(f);
  return /* @__PURE__ */ i(vr, { open: e, onOpenChange: a, children: /* @__PURE__ */ p(
    Nr,
    {
      className: "flex max-w-none flex-col gap-0 overflow-hidden p-0",
      style: {
        width: "min(56rem, calc(100vw - 2rem))",
        height: "min(82vh, 48rem)"
      },
      children: [
        /* @__PURE__ */ p(Dr, { className: "shrink-0 border-b px-6 py-4", children: [
          /* @__PURE__ */ i(Ar, { className: "min-w-0 truncate pr-7", children: l?.name || f?.node_name || t || "节点结果" }),
          /* @__PURE__ */ i(Sr, { className: "sr-only", children: "查看当前节点的执行状态和输出结果。" })
        ] }),
        /* @__PURE__ */ p("div", { className: "min-h-0 min-w-0 flex-1 overflow-y-auto bg-background px-6 py-4", children: [
          x || f ? /* @__PURE__ */ p("div", { className: "mb-3 flex flex-wrap items-center gap-2 rounded-md border bg-muted/15 px-3 py-2", children: [
            /* @__PURE__ */ i("span", { className: "text-xs text-muted-foreground", children: "执行状态" }),
            x ? /* @__PURE__ */ i(
              Er,
              {
                timing: x,
                now: A,
                className: "max-w-full"
              }
            ) : /* @__PURE__ */ i(Pr, { status: f?.status, nodeType: _ })
          ] }) : null,
          v ? /* @__PURE__ */ i("div", { className: "mb-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive", children: v }) : null,
          w ? /* @__PURE__ */ i("div", { className: "mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800", children: w }) : null,
          o ? /* @__PURE__ */ i("div", { className: "mb-3 overflow-hidden rounded-md border border-amber-200 bg-amber-50/45", children: /* @__PURE__ */ i(
            Cr,
            {
              interaction: o.interaction,
              paramApi: s,
              layout: "inline",
              onSubmit: (T) => c(o, T)
            }
          ) }) : null,
          o ? null : K(h) ? /* @__PURE__ */ i(
            Tr,
            {
              output: h,
              emptyText: "暂无节点输出。",
              className: "min-w-0"
            }
          ) : I ? /* @__PURE__ */ p("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ i(Ee, { className: "size-4 animate-spin" }),
            "节点正在执行，等待输出..."
          ] }) : /* @__PURE__ */ i("div", { className: "text-sm text-muted-foreground", children: "这个节点还没有输出。" })
        ] })
      ]
    }
  ) });
}
await window.DeverFront?.ensureCompat?.(["@/components/assistant/form-actions"]);
const Gt = window.DeverFront?.sdk?.getCompatModule("@/components/assistant/form-actions");
if (!Gt || Object.keys(Gt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/assistant/form-actions");
await window.DeverFront?.ensureCompat?.(["@/components/ui/radio-group"]);
const _t = window.DeverFront?.sdk?.getCompatModule("@/components/ui/radio-group");
if (!_t || Object.keys(_t).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/radio-group");
function Us(e) {
  return {
    scope: "modal",
    route: "bot/team/flow",
    page: {
      name: "编辑工作流",
      title: e.name || e.key
    },
    form: {
      fields: Ws(),
      values: Ys(e)
    }
  };
}
function Ws() {
  return Co;
}
function Ys(e) {
  const t = {};
  return e.name && (t["form.name"] = e.name), e.goal && (t["form.goal"] = e.goal), t;
}
function Xs(e, t, n) {
  const r = {}, o = $n(t, "form.name"), s = $n(t, "form.goal");
  o !== void 0 && (r.name = o), s !== void 0 && (r.goal = s), Object.keys(r).length > 0 && n(e, r);
}
function $n(e, t) {
  const n = t.replace(/^form\./, ""), r = e[t] ?? e[n];
  if (r != null)
    return typeof r == "string" ? r : JSON.stringify(r);
}
const Vs = bt.cn, Zs = Ut.Button, Js = Gt.AssistantContextFormFillButton, Qs = J.Dialog, ea = J.DialogClose, ta = J.DialogContent, na = J.DialogHeader, ra = J.DialogTitle, pt = vo.Input, qt = Gn.Textarea, oa = _t.RadioGroup, ia = _t.RadioGroupItem, oe = No.SearchableOptionPicker;
function sa({
  open: e,
  onOpenChange: t,
  selected: n,
  flows: r,
  nodes: o,
  currentTeamID: s,
  currentTeamName: a,
  roles: c,
  roleTypes: l,
  agents: m,
  agentCates: f,
  assetCates: g,
  knowledgeCates: u,
  knowledgeBases: _,
  teamBindingOptions: h,
  powers: w,
  powerKinds: x,
  nodeTypes: I,
  readonly: A,
  onChangeFlow: v,
  onChangeNode: T
}) {
  if (!n)
    return null;
  const F = _a(n);
  let H = null, B = null;
  if (n.kind === "flow") {
    const N = r.find((O) => O.key === n.key);
    if (N) {
      const O = Us(N);
      B = A ? null : /* @__PURE__ */ i(
        Js,
        {
          context: O,
          className: "mt-[-0.125rem]",
          variant: "outline",
          size: "sm",
          onApplyValues: (Q) => Xs(N.key, Q, v)
        }
      ), H = /* @__PURE__ */ p("div", { className: "space-y-1", children: [
        /* @__PURE__ */ i(X, { label: "名称", children: /* @__PURE__ */ i(
          pt,
          {
            value: N.name || "",
            disabled: A,
            onChange: (Q) => v(N.key, { name: Q.target.value })
          }
        ) }),
        /* @__PURE__ */ i(X, { label: "目标", children: /* @__PURE__ */ i(
          qt,
          {
            value: N.goal || "",
            disabled: A,
            onChange: (Q) => v(N.key, { goal: Q.target.value })
          }
        ) })
      ] });
    }
  } else if (n.kind === "node") {
    const N = o.find((O) => O.node_key === n.key);
    H = N ? /* @__PURE__ */ p("div", { className: "space-y-1", children: [
      /* @__PURE__ */ i(X, { label: "名称", children: /* @__PURE__ */ i(
        pt,
        {
          value: N.name || "",
          disabled: A,
          onChange: (O) => T(N.node_key, { name: O.target.value })
        }
      ) }),
      /* @__PURE__ */ i(X, { label: "类型", children: /* @__PURE__ */ i(
        Ir,
        {
          options: I,
          value: N.type || "agent",
          onValueChange: (O) => T(
            N.node_key,
            ya(N, O, g)
          ),
          disabled: A
        }
      ) }),
      N.type === "role" ? /* @__PURE__ */ i(
        aa,
        {
          node: N,
          roles: c,
          roleTypes: l,
          currentTeamID: s,
          currentTeamName: a,
          teams: h,
          readonly: A,
          onChangeNode: T
        }
      ) : null,
      N.type === "agent" ? /* @__PURE__ */ i(
        la,
        {
          node: N,
          agents: m,
          agentCates: f,
          readonly: A,
          onChangeNode: T
        }
      ) : null,
      N.type === "power" ? /* @__PURE__ */ i(
        da,
        {
          node: N,
          powers: w,
          powerKinds: x,
          readonly: A,
          onChangeNode: T
        }
      ) : null,
      N.type === "team" ? /* @__PURE__ */ i(
        ca,
        {
          node: N,
          currentTeamID: s,
          currentTeamName: a,
          teams: h,
          readonly: A,
          onChangeNode: T
        }
      ) : null,
      N.type === "condition" ? /* @__PURE__ */ i(
        ua,
        {
          node: N,
          readonly: A,
          onChangeNode: T
        }
      ) : null,
      N.type === "knowledge" ? /* @__PURE__ */ i(
        fa,
        {
          node: N,
          knowledgeCates: u,
          knowledgeBases: _,
          readonly: A,
          onChangeNode: T
        }
      ) : null,
      N.type === "context" || N.type === "save" ? /* @__PURE__ */ i(
        ma,
        {
          node: N,
          assetCates: g,
          readonly: A,
          onChangeNode: T
        }
      ) : null,
      N.type === "agent" || N.type === "role" ? /* @__PURE__ */ i(X, { label: "目标", children: /* @__PURE__ */ i(
        qt,
        {
          value: String(N.config?.goal ?? ""),
          disabled: A,
          placeholder: "填写给智能体的详细任务目标；留空时使用名称作为目标",
          onChange: (O) => T(N.node_key, {
            config: {
              ...N.config ?? {},
              goal: O.target.value
            }
          })
        }
      ) }) : null
    ] }) : null;
  }
  return /* @__PURE__ */ i(Qs, { open: e, onOpenChange: t, children: /* @__PURE__ */ p(
    ta,
    {
      showCloseButton: !1,
      className: "flex flex-col gap-0 overflow-visible p-0 sm:max-w-2xl",
      style: { maxHeight: "min(82vh, 48rem)" },
      children: [
        /* @__PURE__ */ i(na, { className: "shrink-0 px-6 py-4 text-start", children: /* @__PURE__ */ p("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ i(ra, { className: "min-w-0 pt-1", children: F }),
          /* @__PURE__ */ p("div", { className: "flex shrink-0 items-start gap-2", children: [
            B,
            /* @__PURE__ */ i(ea, { asChild: !0, children: /* @__PURE__ */ p(
              Zs,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                className: "-mr-3 -mt-2 size-8 shrink-0 self-start",
                children: [
                  /* @__PURE__ */ i("span", { className: "sr-only", children: "关闭" }),
                  /* @__PURE__ */ i(lt, { className: "size-4" })
                ]
              }
            ) })
          ] })
        ] }) }),
        /* @__PURE__ */ i("div", { className: "min-h-0 overflow-y-auto px-6 pb-6 pt-2", children: H })
      ]
    }
  ) });
}
function Ir({
  options: e,
  value: t,
  disabled: n,
  onValueChange: r
}) {
  return /* @__PURE__ */ i(
    oa,
    {
      value: t,
      onValueChange: r,
      className: "grid gap-2 sm:grid-cols-2",
      disabled: n,
      children: e.map((o) => /* @__PURE__ */ p(
        "label",
        {
          className: Vs(
            "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm",
            t === o.id && "border-primary bg-primary/5 text-primary",
            n && "cursor-not-allowed opacity-60"
          ),
          children: [
            /* @__PURE__ */ i(ia, { value: o.id, disabled: n }),
            /* @__PURE__ */ i("span", { children: o.value })
          ]
        },
        o.id
      ))
    }
  );
}
function aa({
  node: e,
  roles: t,
  roleTypes: n,
  currentTeamID: r,
  currentTeamName: o,
  teams: s,
  readonly: a,
  onChangeNode: c
}) {
  const l = Number(e.role_id || e.config?.role_id || 0), m = s.length ? s : Yt({
    currentTeamID: r,
    currentTeamName: o,
    flows: [],
    roles: t,
    teams: s
  }), f = To(m, l), g = Number(
    e.config?.role_team_id || f?.team_id || r || m[0]?.id || 0
  ), _ = ut(m, g)?.roles ?? [], h = _[0]?.role_type || n[0]?.id || "", w = String(
    e.config?.role_type || f?.role_type || h
  ), x = w ? _.filter((v) => v.role_type === w) : _, I = x.some((v) => v.id === l) ? String(l) : void 0, A = f?.name || "";
  return /* @__PURE__ */ i(X, { label: "绑定角色", children: /* @__PURE__ */ p("div", { className: "grid gap-2 sm:grid-cols-3", children: [
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
          const T = Array.isArray(v) ? v[0] ?? "" : v, F = Number(T || r || 0), B = ut(m, F)?.roles?.[0]?.role_type || w;
          c(
            e.node_key,
            q(
              e,
              {
                role_id: 0,
                role_key: "",
                config: {
                  ...e.config ?? {},
                  role_team_id: F,
                  role_id: 0,
                  role_key: "",
                  role_type: B
                }
              },
              "团队角色",
              [A]
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
          const T = Array.isArray(v) ? v[0] ?? "" : v;
          c(
            e.node_key,
            q(
              e,
              {
                role_id: 0,
                role_key: "",
                config: {
                  ...e.config ?? {},
                  role_team_id: g,
                  role_id: 0,
                  role_key: "",
                  role_type: T
                }
              },
              "团队角色",
              [A]
            )
          );
        }
      }
    ),
    /* @__PURE__ */ i(
      oe,
      {
        value: I,
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
          q(
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
            [A]
          )
        ),
        onChange: (v) => {
          const T = Array.isArray(v) ? v[0] ?? "" : v, F = x.find(
            (H) => String(H.id) === String(T)
          );
          c(
            e.node_key,
            q(
              e,
              {
                role_id: F?.id || 0,
                role_key: F?.role_key || "",
                config: {
                  ...e.config ?? {},
                  role_team_id: g,
                  role_id: F?.id || 0,
                  role_key: F?.role_key || "",
                  role_type: F?.role_type || w
                }
              },
              F?.name || "团队角色",
              [A]
            )
          );
        }
      }
    )
  ] }) });
}
function la({
  node: e,
  agents: t,
  agentCates: n,
  readonly: r,
  onChangeNode: o
}) {
  const s = Number(e.agent_id || e.config?.agent_id || 0), a = t.find((c) => c.id === s);
  return /* @__PURE__ */ i(X, { label: "绑定智能体", children: /* @__PURE__ */ i(
    ga,
    {
      agentID: s,
      cateID: Number(e.config?.agent_cate_id || 0),
      agents: t,
      agentCates: n,
      disabled: r,
      onChange: ({ agentID: c, cateID: l }) => {
        const m = t.find((f) => f.id === c);
        o(
          e.node_key,
          q(
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
function da({
  node: e,
  powers: t,
  powerKinds: n,
  readonly: r,
  onChangeNode: o
}) {
  const s = Number(e.power_id || e.config?.power_id || 0), a = t.find((f) => f.id === s), c = n.length ? n : Ro(t), l = String(
    e.config?.power_kind || a?.kind || c[0]?.id || t[0]?.kind || ""
  ), m = l ? t.filter((f) => f.kind === l) : t;
  return /* @__PURE__ */ i(X, { label: "绑定能力", children: /* @__PURE__ */ p("div", { className: "grid gap-2 sm:grid-cols-2", children: [
    /* @__PURE__ */ i(
      oe,
      {
        value: l || void 0,
        options: c.map((f) => ({ id: f.id, value: f.value })),
        disabled: r,
        clearable: !1,
        placeholder: "选择能力类型",
        searchPlaceholder: "输入能力类型筛选...",
        onChange: (f) => {
          const g = Array.isArray(f) ? f[0] ?? "" : f, u = t.find((_) => _.kind === g);
          o(
            e.node_key,
            q(
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
        disabled: r,
        placeholder: "选择能力",
        searchPlaceholder: "输入能力筛选...",
        emptyText: "未找到匹配能力",
        onClear: () => o(
          e.node_key,
          q(
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
            (_) => String(_.id) === String(g)
          );
          o(
            e.node_key,
            q(
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
function ca({
  node: e,
  currentTeamID: t,
  currentTeamName: n,
  teams: r,
  readonly: o,
  onChangeNode: s
}) {
  const a = Number(
    e.sub_team_id || e.config?.sub_team_id || t || r[0]?.id || 0
  ), c = r.length ? r : Yt({
    currentTeamID: t,
    currentTeamName: n,
    flows: [],
    roles: [],
    teams: r
  }), l = ut(c, a), m = (l?.flows ?? []).filter(
    (_) => !!_.id
  ), f = Number(
    e.config?.sub_flow_id || e.config?.flow_id || 0
  ), g = m.find(
    (_) => Number(_.id || 0) === f
  ), u = it(l, g);
  return /* @__PURE__ */ i(X, { label: "工作流", children: /* @__PURE__ */ p("div", { className: "grid gap-2 sm:grid-cols-2", children: [
    /* @__PURE__ */ i(
      oe,
      {
        value: a ? String(a) : void 0,
        options: c.map((_) => ({
          id: _.id,
          value: _.name || "未命名团队"
        })),
        disabled: o,
        clearable: !1,
        placeholder: "选择团队",
        searchPlaceholder: "输入团队筛选...",
        emptyText: "未找到团队",
        onChange: (_) => {
          const h = Array.isArray(_) ? _[0] ?? "" : _, w = ut(c, Number(h)), x = w?.id || t || 0;
          s(
            e.node_key,
            q(
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
              it(w),
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
        options: m.map((_) => ({
          id: _.id || 0,
          value: _.name || _.key || "未命名工作流"
        })),
        disabled: o,
        placeholder: "团队总工作流",
        searchPlaceholder: "输入工作流筛选...",
        emptyText: "未找到工作流",
        onClear: () => s(
          e.node_key,
          q(
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
            it(l),
            [u]
          )
        ),
        onChange: (_) => {
          const h = Array.isArray(_) ? _[0] ?? "" : _, w = m.find(
            (x) => String(x.id || "") === String(h)
          );
          s(
            e.node_key,
            q(
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
              it(l, w),
              [u]
            )
          );
        }
      }
    )
  ] }) });
}
function ua({
  node: e,
  readonly: t,
  onChangeNode: n
}) {
  const r = Xt(e.config?.operator), o = r === "contains" || r === "equals", s = (a) => n(e.node_key, {
    config: {
      ...e.config ?? {},
      ...a
    }
  });
  return /* @__PURE__ */ p(Ht, { children: [
    /* @__PURE__ */ i(X, { label: "判断方式", children: /* @__PURE__ */ i(
      Ir,
      {
        options: Hn,
        value: r,
        disabled: t,
        onValueChange: (a) => s({ operator: a })
      }
    ) }),
    o ? /* @__PURE__ */ i(X, { label: "判断值", children: /* @__PURE__ */ i(
      pt,
      {
        value: String(e.config?.value ?? ""),
        disabled: t,
        placeholder: r === "contains" ? "输入要包含的内容" : "输入要完全等于的内容",
        onChange: (a) => s({ value: a.target.value })
      }
    ) }) : null
  ] });
}
function fa({
  node: e,
  knowledgeCates: t,
  knowledgeBases: n,
  readonly: r,
  onChangeNode: o
}) {
  const s = Number(e.config?.knowledge_base_id || 0), a = zn(n, s), c = t.length ? t : va(n), l = Number(
    a?.cate_id || e.config?.knowledge_cate_id || c[0]?.id || n[0]?.cate_id || 0
  ), m = l ? n.filter(
    (u) => Number(u.cate_id || 0) === l
  ) : n, f = Fn(a), g = (u) => o(e.node_key, {
    config: {
      ...z(e.config, ["goal"]),
      ...u
    }
  });
  return /* @__PURE__ */ p(Ht, { children: [
    /* @__PURE__ */ i(X, { label: "知识库", children: /* @__PURE__ */ p("div", { className: "grid gap-2 sm:grid-cols-2", children: [
      /* @__PURE__ */ i(
        oe,
        {
          value: l ? String(l) : void 0,
          options: c.map((u) => ({
            id: u.id,
            value: Aa(u)
          })),
          disabled: r,
          clearable: !1,
          placeholder: "选择分类",
          searchPlaceholder: "输入分类筛选...",
          emptyText: "未找到知识库分类",
          onChange: (u) => {
            const _ = Array.isArray(u) ? u[0] ?? "" : u, h = Number(_ || 0), w = a && Number(a.cate_id || 0) === h;
            o(
              e.node_key,
              q(
                e,
                {
                  config: {
                    ...z(e.config, ["goal"]),
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
            value: Da(u)
          })),
          disabled: r,
          placeholder: "选择知识库",
          searchPlaceholder: "输入知识库筛选...",
          emptyText: "未找到知识库",
          onClear: () => o(
            e.node_key,
            q(
              e,
              {
                config: {
                  ...z(e.config, ["goal"]),
                  knowledge_cate_id: l,
                  knowledge_base_id: 0
                }
              },
              "知识库",
              [f]
            )
          ),
          onChange: (u) => {
            const _ = Array.isArray(u) ? u[0] ?? "" : u, h = Number(_ || 0), w = zn(n, h);
            o(
              e.node_key,
              q(
                e,
                {
                  config: {
                    ...z(e.config, ["goal"]),
                    knowledge_cate_id: Number(
                      w?.cate_id || l || 0
                    ),
                    knowledge_base_id: h
                  }
                },
                Fn(w),
                [f]
              )
            );
          }
        }
      )
    ] }) }),
    /* @__PURE__ */ i(X, { label: "查询内容", children: /* @__PURE__ */ i(
      qt,
      {
        value: String(e.config?.query ?? e.config?.goal ?? ""),
        disabled: r,
        placeholder: "填写从知识库获取内容的提示词；留空时使用节点名称",
        onChange: (u) => g({ query: u.target.value })
      }
    ) }),
    /* @__PURE__ */ i(X, { label: "召回数量", children: /* @__PURE__ */ p("div", { className: "space-y-1", children: [
      /* @__PURE__ */ i(
        pt,
        {
          type: "number",
          min: 0,
          value: Number(e.config?.retrieve_limit || 0) || "",
          disabled: r,
          placeholder: "使用知识库默认值",
          onChange: (u) => g({ retrieve_limit: Number(u.target.value || 0) })
        }
      ),
      /* @__PURE__ */ i("div", { className: "text-xs text-muted-foreground", children: "每次检索从知识库取回的候选内容条数；留空使用知识库默认值，数量越大上下文越全，也会占用更多上下文。" })
    ] }) })
  ] });
}
function ma({
  node: e,
  assetCates: t,
  readonly: n,
  onChangeNode: r
}) {
  const o = Number(
    e.asset_cate_id || e.config?.asset_cate_id || 0
  ), s = Kt(t, o);
  return /* @__PURE__ */ i(X, { label: "资产类型", children: /* @__PURE__ */ i(
    oe,
    {
      value: o ? String(o) : void 0,
      options: t.map((a) => ({
        id: a.id,
        value: Sa(a)
      })),
      disabled: n,
      placeholder: "选择资产类型",
      searchPlaceholder: "输入资产类型筛选...",
      emptyText: "未找到资产类型",
      onClear: () => r(
        e.node_key,
        q(
          e,
          {
            asset_cate_id: 0,
            config: {
              ...e.config ?? {},
              asset_cate_id: 0
            }
          },
          Ye(e.type),
          [Ye(e.type, s)]
        )
      ),
      onChange: (a) => {
        const c = Array.isArray(a) ? a[0] ?? "" : a, l = Number(c || 0), m = Kt(t, l);
        r(
          e.node_key,
          q(
            e,
            {
              asset_cate_id: l,
              config: {
                ...e.config ?? {},
                asset_cate_id: l
              }
            },
            Ye(e.type, m),
            [Ye(e.type, s)]
          )
        );
      }
    }
  ) });
}
function ga({
  agentID: e,
  cateID: t,
  agents: n,
  agentCates: r,
  disabled: o = !1,
  onChange: s
}) {
  const a = Vt(n), c = a.find((g) => g.id === e), l = r.length ? Vn(r) : Eo(a), m = String(
    c?.cate_id || t || l[0]?.id || ""
  ), f = m ? a.filter(
    (g) => String(g.cate_id || "") === m
  ) : a;
  return /* @__PURE__ */ p("div", { className: "grid grid-cols-2 gap-2", children: [
    /* @__PURE__ */ i(
      oe,
      {
        value: m || void 0,
        options: l.map((g) => ({
          id: g.id,
          value: Na(g)
        })),
        disabled: o,
        clearable: !1,
        placeholder: "选择分类",
        searchPlaceholder: "输入分类筛选...",
        emptyText: "未找到智能体分类",
        onChange: (g) => {
          const u = Array.isArray(g) ? g[0] ?? "" : g, _ = a.find(
            (w) => w.id === e
          ), h = _ && String(_.cate_id || "") === String(u);
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
        disabled: o,
        clearable: !1,
        placeholder: "选择智能体",
        searchPlaceholder: "输入智能体筛选...",
        emptyText: "未找到智能体",
        onChange: (g) => {
          const u = Array.isArray(g) ? g[0] ?? "" : g, _ = a.find((h) => String(h.id) === u);
          s({
            agentID: Number(u),
            cateID: Number(_?.cate_id || m || 0)
          });
        }
      }
    )
  ] });
}
function _a(e) {
  return e.kind === "flow" ? "编辑工作流" : e.kind === "node" ? "编辑节点" : e.kind === "flow_edge" ? "编辑工作流关系" : "编辑节点关系";
}
function pa(e) {
  return e?.kind === "flow" ? "删除工作流" : e?.kind === "flow_edge" || e?.kind === "node_edge" ? "删除关系" : "删除图中项目";
}
function ba(e) {
  return e?.kind === "flow" ? "保存后该工作流会被停用，不做物理删除，已发布或历史运行数据不会被直接清掉。" : e?.kind === "flow_edge" || e?.kind === "node_edge" ? "删除后会移除这条关系线。保存前仍只在当前编辑状态中生效。" : "删除后会同时移除关联连线。保存前仍只在当前编辑状态中生效。";
}
function ya(e, t, n = []) {
  const r = z(e.config, [
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
  ]), o = {
    role_id: 0,
    role_key: "",
    agent_id: 0,
    power_id: 0,
    sub_team_id: 0
  }, s = Number(
    e.asset_cate_id || e.config?.asset_cate_id || 0
  ), a = Kt(n, s), c = (l, m = xa(t, a)) => q(e, l, m);
  return t === "agent" ? c({
    type: t,
    ...o,
    asset_cate_id: 0,
    config: z(e.config, [
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
    ...o,
    asset_cate_id: 0,
    config: z(e.config, [
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
    ...o,
    asset_cate_id: 0,
    config: z(e.config, [
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
    ...o,
    asset_cate_id: 0,
    config: z(e.config, [
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
    ...o,
    asset_cate_id: 0,
    config: {
      ...z(e.config, [
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
      operator: Xt(e.config?.operator)
    }
  }) : t === "knowledge" ? c(
    {
      type: t,
      ...o,
      asset_cate_id: 0,
      config: {
        ...r,
        knowledge_cate_id: Number(e.config?.knowledge_cate_id || 0),
        knowledge_base_id: Number(e.config?.knowledge_base_id || 0),
        query: String(e.config?.query ?? e.config?.goal ?? ""),
        retrieve_limit: Number(e.config?.retrieve_limit || 0)
      }
    },
    "知识库"
  ) : c(t === "save" ? {
    type: t,
    ...o,
    asset_cate_id: s,
    config: r
  } : t === "context" ? {
    type: t,
    ...o,
    asset_cate_id: s,
    config: r
  } : {
    type: t,
    ...o,
    asset_cate_id: 0,
    config: r
  });
}
const ha = /* @__PURE__ */ new Set([
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
function q(e, t, n, r = []) {
  const o = String(n || "").trim();
  return !o || !wa(e.name, r) ? t : { ...t, name: o };
}
function wa(e, t = []) {
  const n = String(e || "").trim();
  return ka(n) || ha.has(n) || n.startsWith("读取：") || n.startsWith("保存：") || n.startsWith("知识库：") ? !0 : t.some(
    (r) => String(r || "").trim() !== "" && String(r || "").trim() === n
  );
}
function ka(e) {
  const t = String(e || "").trim();
  if (!t || t === "节点")
    return !0;
  if (!t.startsWith("节点"))
    return !1;
  const n = t.slice(2);
  return n !== "" && /^\d+$/.test(n);
}
function xa(e, t) {
  return e === "context" || e === "save" ? Ye(e, t) : e === "agent" ? "智能体" : e === "role" ? "团队角色" : e === "power" ? "能力" : e === "team" ? "团队工作流" : e === "knowledge" ? "知识库" : e === "condition" ? "条件判断" : e === "merge" ? "合并结果" : e === "human_approval" ? "人工确认" : String(e || "").trim();
}
function Ye(e, t) {
  const n = String(t?.name || "").trim();
  return e === "context" ? n ? `读取：${n}` : "读取上下文" : n ? `保存：${n}` : "保存结果";
}
function Kt(e, t) {
  return e.find((n) => Number(n.id) === Number(t));
}
function zn(e, t) {
  return e.find(
    (n) => Number(n.id) === Number(t)
  );
}
function va(e) {
  return Array.from(
    new Set(
      e.map((n) => Number(n.cate_id || 0)).filter(Boolean)
    )
  ).map((n) => ({
    id: n,
    value: `分类${n}`
  }));
}
function it(e, t) {
  const n = String(e?.name || "").trim(), r = String(t?.name || t?.key || "").trim();
  return n && r ? `${n} / ${r}` : n || "团队工作流";
}
function Na(e) {
  return String(e.value || e.name || e.id);
}
function Sa(e) {
  return String(e.name || e.id);
}
function Da(e) {
  return String(e.name || e.id);
}
function Aa(e) {
  return String(e.value || e.name || e.id);
}
function Fn(e) {
  const t = String(e?.name || "").trim();
  return t ? `知识库：${t}` : "知识库";
}
function X({ label: e, children: t }) {
  return /* @__PURE__ */ p("div", { className: "mb-4 space-y-2 text-sm", children: [
    /* @__PURE__ */ i("div", { className: "font-medium", children: e }),
    t
  ] });
}
const Ce = jn.request, Ot = bt.cn, ke = Ut.Button, Bn = so.ConfirmDialog, Ca = ao.AssistantTaskPopover;
function Va({ item: e }) {
  const t = e.meta ?? {}, n = Te(() => Ta(), []), [r, o] = P({}), [s, a] = P(!1), [c, l] = P(!1), [m, f] = P("flow"), [g, u] = P(""), [_, h] = P(null), [w, x] = P(null), [I, A] = P(!1), [v, T] = P(null), [F, H] = P(!1), [B, N] = P(""), [O, Q] = P(!1), [Pe, Ie] = P("team"), [Me, Oe] = P(""), [ie, fe] = P(!1), [U, W] = P(null), [se, te] = P(""), [$e, ee] = P(() => /* @__PURE__ */ new Set()), ze = String(t.workspaceApi || "/bot/admin/team/workspace_data"), Fe = String(t.saveFlowApi || "/bot/admin/team/save_flow_graph"), Ze = String(t.saveNodeApi || "/bot/admin/team/save_node_graph"), St = String(t.runTeamApi || "/bot/admin/team/run_team"), Dt = String(t.runFlowApi || "/bot/admin/team/run_flow"), Je = String(
    t.runStatusApi || "/bot/admin/team/run_status"
  ), Qe = String(t.streamApi || "/bot/admin/team/stream"), At = String(t.approvalApi || "/bot/admin/team/submit_approval"), Ct = String(
    t.interactionApi || "/bot/admin/team/submit_interaction"
  ), Ge = String(t.paramApi || "/bot/admin/energon/power_params"), Tt = Zt(
    r.team?.publish_status
  ), De = Zn(r.team), ce = r.flows ?? [], qe = r.flow_edges ?? [], ye = ce.find((d) => d.key === g), he = g ? r.nodes_by_flow?.[g] ?? [] : [], Be = g ? r.edges_by_flow?.[g] ?? [] : [], b = r.roles ?? [], k = r.agents ?? [], D = r.agent_cates ?? [], M = r.asset_cates ?? [], V = r.knowledge_cates ?? [], ae = r.knowledge_bases ?? [], ue = r.teams ?? [], Ke = r.role_types?.length ? r.role_types : qn, me = Te(
    () => Yt({
      currentTeamID: n,
      currentTeamName: String(r.team?.name || "当前团队"),
      flows: ce,
      roles: b,
      teams: ue
    }),
    [ce, b, n, ue, r.team?.name]
  ), et = r.powers ?? [], Et = r.power_kinds ?? [], rn = Bo(
    r.node_types?.length ? r.node_types : ht
  ), Or = r.edge_conditions?.length ? r.edge_conditions : Kn, we = m === "node" && Pe === "flow" && !!(ie || U), L = De || we, tt = Te(
    () => yi(U, $e),
    [U, $e]
  ), $r = Te(
    () => we ? Ni(
      U,
      he,
      Be,
      ie,
      tt
    ) : null,
    [
      Be,
      he,
      U,
      ie,
      we,
      tt
    ]
  ), on = G((d) => {
    const y = Yn(d);
    o(y), u(
      (S) => y.flows?.some((j) => j.key === S) ? S : y.flows?.[0]?.key || ""
    );
  }, []), nt = G((d) => {
    if (o((S) => Po(S, d)), !Array.isArray(d?.flows))
      return;
    const y = d.flows;
    u(
      (S) => y.some((j) => j.key === S) ? S : y[0]?.key || ""
    );
  }, []), ge = G(() => De ? ($.info("团队已发布，请先进入编辑草稿后再修改"), !1) : !0, [De]), sn = G(async () => {
    if (n) {
      a(!0);
      try {
        const d = await Ce(ze, "get", { team_id: n });
        if (d.code !== 0)
          throw new Error(d.message || "加载团队失败");
        on(d.data);
      } catch (d) {
        $.error(d instanceof Error ? d.message : "加载团队失败");
      } finally {
        a(!1);
      }
    }
  }, [on, n, ze]);
  We(() => {
    sn();
  }, [sn]);
  const an = async () => {
    if (!n || !ge())
      return !1;
    l(!0);
    try {
      const d = await Ce(Fe, "post", {
        team_id: n,
        compact_response: !0,
        flows: ce,
        edges: qe
      });
      if (d.code !== 0)
        throw new Error(d.message || "保存工作流图失败");
      return nt(d.data), $.success("工作流配置已保存"), !0;
    } catch (d) {
      return $.error(d instanceof Error ? d.message : "保存工作流图失败"), !1;
    } finally {
      l(!1);
    }
  }, ln = async () => {
    if (!n || !g || !ge())
      return !1;
    l(!0);
    try {
      const d = await Ce(Ze, "post", {
        team_id: n,
        compact_response: !0,
        flow_id: ye?.id || 0,
        flow_key: g,
        flows: ce,
        flow_edges: qe,
        nodes: Lo(he),
        edges: Be
      });
      if (d.code !== 0)
        throw new Error(d.message || "保存节点图失败");
      return nt(d.data), $.success("节点视图已保存"), !0;
    } catch (d) {
      return $.error(d instanceof Error ? d.message : "保存节点图失败"), !1;
    } finally {
      l(!1);
    }
  }, zr = async () => {
    if (!(!n || c)) {
      l(!0);
      try {
        const d = await Ce(Fe, "post", {
          team_id: n,
          compact_response: !0,
          action: "publish"
        });
        if (d.code !== 0)
          throw new Error(d.message || "发布失败");
        nt(d.data), f("flow"), h(null), x(null), A(!1), $.success("团队已发布");
      } catch (d) {
        $.error(d instanceof Error ? d.message : "发布失败");
      } finally {
        l(!1);
      }
    }
  }, Fr = async () => {
    if (!(!n || c)) {
      l(!0);
      try {
        const d = await Ce(Fe, "post", {
          team_id: n,
          compact_response: !0,
          action: "edit_draft"
        });
        if (d.code !== 0)
          throw new Error(d.message || "进入编辑草稿失败");
        nt(d.data), $.success("已进入编辑草稿");
      } catch (d) {
        $.error(d instanceof Error ? d.message : "进入编辑草稿失败");
      } finally {
        l(!1);
      }
    }
  }, Br = (d) => {
    Ie(d), Oe(""), W(null), ee(/* @__PURE__ */ new Set()), Q(!0);
  }, dn = async (d, y, S = [], j) => {
    const He = y.trim();
    if (!He) {
      $.error("请输入调试要求或目标");
      return;
    }
    if (d === "flow" && !ye?.id) {
      $.error("请先选择一个已保存的工作流");
      return;
    }
    const Ue = si(He, S);
    Ie(d), Oe(He), Q(d === "team"), A(!1), T(null), x(null), te(""), ee(/* @__PURE__ */ new Set()), fe(!0), W(ai(Ue));
    try {
      if (!De && !(d === "flow" ? await ln() : await an())) {
        W(null);
        return;
      }
      if (j?.aborted)
        return;
      const _e = {
        team_id: n,
        release_id: 0,
        debug_current_graph: !0,
        input: Ue
      };
      d === "flow" && (_e.flow_id = ye?.id);
      const Y = await Ce(
        d === "team" ? St : Dt,
        "post",
        _e
      );
      if (Y.code !== 0)
        throw new Error(Y.message || "启动调试失败");
      const Z = li(Y.data, _e.input);
      W(Z);
      const Ae = await vn(
        Qe,
        Je,
        Z,
        W,
        j
      );
      if (j?.aborted)
        return;
      W(Ae);
    } catch (_e) {
      const Y = _e instanceof Error ? _e.message : "调试失败";
      W(
        (Z) => Z ? { ...Z, error: Y } : { error: Y }
      ), $.error(Y);
    } finally {
      fe(!1);
    }
  }, Lr = async () => {
    await dn(Pe, Me);
  }, Rt = async (d, y) => {
    if (!d?.id)
      return;
    const S = String(d.id), j = String(y.data.decision || "approved"), He = String(y.data.comment || y.text || ""), Ue = U, _e = ki(
      Ue,
      d,
      y
    );
    ee((Y) => {
      const Z = new Set(Y);
      return Z.add(S), Z;
    }), W(_e), fe(!0);
    try {
      const Y = d.kind === "interaction", Z = await Ce(
        Y ? Ct : At,
        "post",
        Y ? {
          run_id: d.runID,
          node_run_id: d.nodeRunID,
          interaction_id: d.id,
          data: y.data
        } : {
          approval_id: d.id,
          decision: j,
          comment: He,
          data: y.data
        }
      );
      if (Z.code !== 0)
        throw new Error(Z.message || "提交反馈失败");
      const Ae = xi(
        _e,
        Z.data
      );
      W(Ae), $.success("已提交反馈，流程继续执行");
      const un = await vn(
        Qe,
        Je,
        Ae,
        W
      );
      W(un);
    } catch (Y) {
      ee((Z) => {
        const Ae = new Set(Z);
        return Ae.delete(S), Ae;
      }), W(Ue), $.error(Y instanceof Error ? Y.message : "提交反馈失败");
    } finally {
      fe(!1);
    }
  }, jr = () => {
    if (ie) {
      $.info("调试执行中，完成后再退出查看模式");
      return;
    }
    W(null), te(""), ee(/* @__PURE__ */ new Set()), h(null);
  }, Mr = m === "flow" ? an : ln, Gr = (d) => {
    ge() && (h(d), A(!0));
  }, qr = (d) => {
    u(d.key), h(null), f("node");
  }, cn = () => {
    if (!ge())
      return;
    const d = `flow_${Date.now()}`;
    o((y) => ({
      ...y,
      flows: [
        ...y.flows ?? [],
        Jn(y.flows ?? [], d)
      ]
    })), u(d), f("flow"), h({ kind: "flow", key: d }), A(!0);
  }, Kr = (d) => {
    ge() && (h(d), T(d));
  }, Hr = () => {
    if (!ge() || !v)
      return;
    const d = v.kind === "flow" && v.key === g, y = d ? (r.flows ?? []).find((S) => S.key !== v.key) : null;
    o(
      (S) => Xo(S, v, g)
    ), d && (u(y?.key ?? ""), y || f("flow")), h(null), T(null), A(!1), $.success(
      v.kind === "flow" ? "已删除，保存后生效" : "已从画布移除，保存后生效"
    );
  };
  return n ? /* @__PURE__ */ p(
    "div",
    {
      className: "grid overflow-hidden rounded-md border bg-background",
      style: {
        gridTemplateColumns: "16rem minmax(0, 1fr)",
        height: "min(76vh, 48rem)",
        minHeight: "34rem"
      },
      children: [
        /* @__PURE__ */ p("aside", { className: "flex min-h-0 min-w-0 flex-col border-r bg-muted/20", children: [
          /* @__PURE__ */ p("div", { className: "border-b p-4", children: [
            /* @__PURE__ */ i("div", { className: "text-xs text-muted-foreground", children: "当前团队" }),
            /* @__PURE__ */ i("div", { className: "mt-1 truncate text-base font-semibold", children: r.team?.name || "团队" }),
            /* @__PURE__ */ i("div", { className: "mt-2 inline-flex rounded bg-background px-2 py-0.5 text-xs text-muted-foreground", children: zo(Tt) })
          ] }),
          /* @__PURE__ */ i("div", { className: "border-b p-2", children: /* @__PURE__ */ p(
            "button",
            {
              type: "button",
              className: Ot(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm",
                m === "flow" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              ),
              onClick: () => {
                f("flow"), h(null), x(null);
              },
              children: [
                /* @__PURE__ */ i(gn, { className: "size-4 shrink-0" }),
                /* @__PURE__ */ i("span", { className: "min-w-0 flex-1 truncate", children: "工作流视图" })
              ]
            }
          ) }),
          /* @__PURE__ */ p("div", { className: "flex items-center justify-between px-3 py-2", children: [
            /* @__PURE__ */ i("span", { className: "text-sm font-medium", children: "工作流列表" }),
            /* @__PURE__ */ i(
              ke,
              {
                size: "icon",
                variant: "ghost",
                disabled: L,
                onClick: cn,
                children: /* @__PURE__ */ i(_n, { className: "size-4" })
              }
            )
          ] }),
          /* @__PURE__ */ i(
            "div",
            {
              className: "min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-2 pb-3 pr-1",
              style: { scrollbarGutter: "stable" },
              children: ce.map((d) => /* @__PURE__ */ p(
                "div",
                {
                  draggable: !L,
                  "aria-grabbed": B === d.key,
                  className: Ot(
                    "mb-1 flex w-full select-none items-center gap-1 rounded-md",
                    wn(m, g, d) ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    B === d.key && "opacity-60",
                    we && "cursor-not-allowed opacity-60"
                  ),
                  onDragStart: (y) => {
                    if (L) {
                      y.preventDefault();
                      return;
                    }
                    N(d.key), y.dataTransfer.effectAllowed = "move", y.dataTransfer.setData("text/plain", d.key);
                  },
                  onDragOver: (y) => {
                    !L && B && B !== d.key && (y.preventDefault(), y.dataTransfer.dropEffect = "move");
                  },
                  onDrop: (y) => {
                    y.preventDefault(), !(L || !B || B === d.key) && (o(
                      (S) => Wo(S, B, d.key)
                    ), N(""));
                  },
                  onDragEnd: () => N(""),
                  children: [
                    /* @__PURE__ */ p(
                      "button",
                      {
                        type: "button",
                        disabled: we,
                        className: "flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left text-sm",
                        onClick: () => qr(d),
                        children: [
                          /* @__PURE__ */ i(at, { className: "size-4 shrink-0" }),
                          /* @__PURE__ */ i("span", { className: "min-w-0 flex-1 truncate", children: d.name || d.key })
                        ]
                      }
                    ),
                    /* @__PURE__ */ i(
                      "button",
                      {
                        type: "button",
                        disabled: L,
                        className: Ot(
                          "mr-2 inline-flex size-6 items-center justify-center rounded hover:bg-background/70",
                          wn(m, g, d) && "hover:bg-primary-foreground/15",
                          L && "cursor-not-allowed opacity-60"
                        ),
                        onClick: (y) => {
                          y.preventDefault(), y.stopPropagation(), ge() && (u(d.key), h({ kind: "flow", key: d.key }), A(!0));
                        },
                        children: /* @__PURE__ */ i(st, { className: "size-3.5" })
                      }
                    )
                  ]
                },
                d.key
              ))
            }
          )
        ] }),
        /* @__PURE__ */ p(
          "section",
          {
            className: "grid min-h-0 min-w-0",
            style: { gridTemplateRows: "auto minmax(0, 1fr) auto" },
            children: [
              /* @__PURE__ */ p("div", { className: "flex flex-wrap items-center gap-2 border-b px-4 py-3", children: [
                /* @__PURE__ */ p(
                  ke,
                  {
                    size: "sm",
                    variant: "outline",
                    disabled: L,
                    onClick: () => {
                      if (m === "flow") {
                        cn();
                        return;
                      }
                      if (!ye?.id) {
                        $.info("请先保存工作流，再新增节点");
                        return;
                      }
                      Mo(g, o);
                    },
                    children: [
                      /* @__PURE__ */ i(_n, { className: "size-4" }),
                      m === "flow" ? "新增工作流" : "新增节点"
                    ]
                  }
                ),
                w ? /* @__PURE__ */ p(
                  ke,
                  {
                    size: "sm",
                    variant: "default",
                    onClick: () => x(null),
                    children: [
                      /* @__PURE__ */ i(lt, { className: "size-4" }),
                      "取消连线"
                    ]
                  }
                ) : null,
                /* @__PURE__ */ p(
                  ke,
                  {
                    size: "sm",
                    variant: "outline",
                    disabled: c || L,
                    onClick: Mr,
                    children: [
                      c ? /* @__PURE__ */ i(Ee, { className: "size-4 animate-spin" }) : /* @__PURE__ */ i(oo, { className: "size-4" }),
                      "保存"
                    ]
                  }
                ),
                De ? /* @__PURE__ */ p(
                  ke,
                  {
                    size: "sm",
                    variant: "outline",
                    disabled: c,
                    onClick: () => {
                      Fr();
                    },
                    children: [
                      /* @__PURE__ */ i(st, { className: "size-4" }),
                      "编辑草稿"
                    ]
                  }
                ) : /* @__PURE__ */ p(
                  ke,
                  {
                    size: "sm",
                    variant: "outline",
                    disabled: c || L,
                    onClick: () => H(!0),
                    children: [
                      c ? /* @__PURE__ */ i(Ee, { className: "size-4 animate-spin" }) : /* @__PURE__ */ i(io, { className: "size-4" }),
                      "发布"
                    ]
                  }
                ),
                m === "flow" ? /* @__PURE__ */ p(
                  ke,
                  {
                    size: "sm",
                    variant: "outline",
                    disabled: ie,
                    onClick: () => Br("team"),
                    children: [
                      /* @__PURE__ */ i(gn, { className: "size-4" }),
                      "调试"
                    ]
                  }
                ) : null,
                m === "node" && ye ? /* @__PURE__ */ i(
                  Ca,
                  {
                    title: we ? "重新调试工作流" : "调试工作流",
                    description: "输入本次调试目标，可添加参考资源；开始后会锁定画布并按节点顺序展示执行路径。",
                    triggerLabel: we ? "重新调试" : "调试工作流",
                    triggerVariant: "outline",
                    triggerSize: "sm",
                    submitLabel: "开始调试",
                    loadingText: "启动调试",
                    disabled: ie || !ye?.id,
                    textareaPlaceholder: "输入这次调试要完成的目标、输入材料或约束...",
                    onSubmit: async ({
                      instruction: d,
                      references: y,
                      signal: S,
                      setStatus: j
                    }) => d.trim() ? (j("正在启动工作流调试"), dn("flow", d, y, S), !0) : ($.error("请输入调试要求或目标"), !1)
                  }
                ) : null,
                we ? /* @__PURE__ */ i(
                  ke,
                  {
                    size: "sm",
                    variant: "ghost",
                    disabled: ie,
                    onClick: jr,
                    children: "退出调试"
                  }
                ) : null,
                s ? /* @__PURE__ */ i("span", { className: "text-sm text-muted-foreground", children: "加载中..." }) : null
              ] }),
              /* @__PURE__ */ i(
                ds,
                {
                  view: m,
                  flows: ce,
                  flowEdges: qe,
                  nodes: he,
                  nodeEdges: Be,
                  edgeConditions: Or,
                  selected: _,
                  connect: w,
                  readonly: L,
                  nodeTypes: rn,
                  executionState: $r,
                  paramApi: Ge,
                  onSelect: h,
                  onConnect: x,
                  onOpenNodeResult: (d) => te(d),
                  onSubmitApproval: (d, y) => {
                    Rt(d, y);
                  },
                  onEdit: Gr,
                  onDelete: Kr,
                  onFlowConnect: (d, y) => L ? void 0 : o((S) => tr(S, d, y)),
                  onFlowConnectNew: (d, y) => {
                    if (!ge())
                      return;
                    const S = `flow_${Date.now()}`;
                    o(
                      (j) => Ko(j, d, S, y)
                    ), h({ kind: "flow", key: S });
                  },
                  onNodeConnect: (d, y) => L ? void 0 : o(
                    (S) => nr(S, g, d, y)
                  ),
                  onNodeConnectNew: (d, y) => {
                    if (!ge() || !g)
                      return;
                    const S = `node_${Date.now()}`;
                    o(
                      (j) => Ho(
                        j,
                        g,
                        d,
                        S,
                        y
                      )
                    ), h({ kind: "node", key: S });
                  },
                  onMove: (d, y, S) => L ? void 0 : o(
                    (j) => d === "flow" ? kn(j, y, { position: S }) : xn(j, g, y, { position: S })
                  ),
                  onChangeNodeEdge: (d, y) => L ? void 0 : o(
                    (S) => Yo(S, g, d, y)
                  )
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ i(
          sa,
          {
            open: I,
            onOpenChange: A,
            selected: _,
            flows: ce,
            nodes: he,
            agents: k,
            agentCates: D,
            assetCates: M,
            knowledgeCates: V,
            knowledgeBases: ae,
            currentTeamID: n,
            currentTeamName: String(r.team?.name || "当前团队"),
            roles: b,
            roleTypes: Ke,
            teamBindingOptions: me,
            powers: et,
            powerKinds: Et,
            nodeTypes: rn,
            readonly: L,
            onChangeFlow: (d, y) => L ? void 0 : o((S) => kn(S, d, y)),
            onChangeNode: (d, y) => L ? void 0 : o(
              (S) => xn(S, g, d, y)
            )
          }
        ),
        /* @__PURE__ */ i(
          Hs,
          {
            open: !!se,
            nodeKey: se,
            nodes: he,
            result: U,
            approval: se ? tt[se] : void 0,
            paramApi: Ge,
            onOpenChange: (d) => !d && te(""),
            onSubmitApproval: (d, y) => {
              Rt(d, y);
            }
          }
        ),
        /* @__PURE__ */ i(
          Gs,
          {
            open: O,
            target: Pe,
            prompt: Me,
            running: ie,
            result: U,
            paramApi: Ge,
            pendingApprovalsByNodeKey: tt,
            onOpenChange: Q,
            onPromptChange: Oe,
            onRun: Lr,
            onSubmitApproval: (d, y) => {
              Rt(d, y);
            }
          }
        ),
        /* @__PURE__ */ i(
          Bn,
          {
            open: F,
            onOpenChange: H,
            title: "发布",
            desc: "确定要发布吗？系统会校验工作流编排并生成可运行版本。",
            confirmText: "发布",
            disabled: c,
            isLoading: c,
            handleConfirm: () => {
              H(!1), zr();
            }
          }
        ),
        /* @__PURE__ */ i(
          Bn,
          {
            open: !!v,
            onOpenChange: (d) => !d && T(null),
            title: pa(v),
            desc: ba(v),
            confirmText: "删除",
            destructive: !0,
            handleConfirm: Hr
          }
        )
      ]
    }
  ) : /* @__PURE__ */ i("div", { className: "rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive", children: "缺少 team_id，无法进入团队工作流配置。" });
}
function Ta() {
  if (typeof window > "u") return 0;
  const e = new URLSearchParams(window.location.search);
  return Number(e.get("team_id") || e.get("id") || 0);
}
export {
  Va as ShowTeamWorkspace
};
