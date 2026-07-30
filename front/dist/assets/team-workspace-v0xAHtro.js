import { c as Ge, j as i, a as p, F as Xt } from "./createLucideIcon-Gw0gLVQ5.js";
import { g as ht, u as I, a as $t, c as Te, b as Xe, e as K } from "./runtime-entry-CkPHMDB1.js";
import { L as Ee } from "./loader-circle-3ZsHTZm7.js";
import { C as Wr } from "./check-_lGX5Mgn.js";
import { N as gn } from "./network-DCINEjrN.js";
import { P as _n } from "./plus-rAwvnIn1.js";
import { S as Yr } from "./save-C3QU3I8o.js";
import { W as dt, U as pn } from "./workflow-D5P6WNac.js";
import { X as ct } from "./x-CDJG94MJ.js";
import { t as $ } from "./index-wo12HRHg.js";
import { m as jn } from "./request-DpEDwvYb.js";
import { m as kt } from "./utils-DDwUJ6_F.js";
import { m as Vt } from "./button-DF4roUfC.js";
import { m as Xr } from "./confirm-dialog-BTqZnhxN.js";
import { n as Vr, a as Zr, w as Jr, m as Qr, r as eo, R as to, u as no, P as lt, b as ro, i as oo, C as io, H as bn, c as so, g as ao, B as zt, E as co } from "./normalize-BRM25J5V.js";
import { C as lo } from "./circle-alert-CvRrJNY4.js";
import { S as uo } from "./sparkles-nyM36U54.js";
import { B as fo, a as mo } from "./bot-D8R22pEh.js";
import { F as go } from "./file-text-Cka6tQvG.js";
import { G as _o } from "./git-branch-CAlYJ-oB.js";
import { T as Gn } from "./trash-2-Cga0ORNu.js";
import { Z as po } from "./zap-rj1Ce1G-.js";
import { m as qn } from "./interaction-panel-Cle1Og4M.js";
import { m as J } from "./dialog-C65rQcQf.js";
import { m as Ze } from "./select-DUl9RxVl.js";
import { m as ye } from "./stream-timing-BGlT8cN-.js";
import { m as bo } from "./reference-DfEQ4AD9.js";
import { m as Kn } from "./textarea-SZl8yDfD.js";
import { m as yo } from "./content-view-BWYCBIVh.js";
import { m as ho } from "./input-CELCGXqo.js";
import { m as ko } from "./searchable-option-picker-CNFrI5hh.js";
const wo = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
], xo = Ge("circle-check-big", wo);
const vo = [
  ["path", { d: "M14 3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1", key: "1l7d7l" }],
  ["path", { d: "M19 3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1", key: "9955pe" }],
  ["path", { d: "m7 15 3 3", key: "4hkfgk" }],
  ["path", { d: "m7 21 3-3H5a2 2 0 0 1-2-2v-2", key: "1xljwe" }],
  ["rect", { x: "14", y: "14", width: "7", height: "7", rx: "1", key: "1cdgtw" }],
  ["rect", { x: "3", y: "3", width: "7", height: "7", rx: "1", key: "zi3rio" }]
], No = Ge("combine", vo);
const So = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
], yn = Ge("database", So);
const Do = [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "1m0v6g" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
], ut = Ge("square-pen", Do);
const Ao = [
  ["path", { d: "M12 19h8", key: "baeox8" }],
  ["path", { d: "m4 17 6-6-6-6", key: "1yngyt" }]
], Co = Ge("terminal", Ao);
const To = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
], Eo = Ge("user", To), Ft = ht("@/components/assistant/task-popover");
if (!Ft || Object.keys(Ft).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/assistant/task-popover");
const wt = [
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
], Ro = new Set(wt.map((e) => e.id)), Hn = [
  { id: "chat", value: "沟通" },
  { id: "planner", value: "规划" },
  { id: "worker", value: "执行" },
  { id: "reviewer", value: "审核" }
], Un = [
  { id: "always", value: "总是" },
  { id: "completed", value: "完成" },
  { id: "passed", value: "通过" },
  { id: "failed", value: "不通过" },
  { id: "approved", value: "确认" },
  { id: "rejected", value: "驳回" }
], Wn = [
  { id: "exists", value: "有内容" },
  { id: "contains", value: "包含" },
  { id: "equals", value: "等于" },
  { id: "truthy", value: "为真" },
  { id: "falsy", value: "为假" }
], Me = 64, ve = 64, hn = {
  width: 24,
  height: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  lineHeight: 0
}, kn = {
  display: "block",
  flex: "0 0 auto"
}, Io = "draft", ft = "published", Lt = "editing", ce = "running", Se = "waiting", Ne = "success", xt = "fail", Yn = "canceled", Zt = "pending", Po = 15e3, xe = "_client_started_at", Mt = "_stream_last_id", Oo = [
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
function Jt({
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
    const c = s.get(a.id), d = a.id === e && !!c, m = d ? c?.flows : a.flows ?? c?.flows ?? [], u = d ? c?.roles : a.roles ?? c?.roles ?? [];
    s.set(a.id, {
      ...c,
      ...a,
      name: d ? c?.name || a.name || "" : a.name || c?.name || "",
      flows: (m ?? []).map(Vn),
      roles: (u ?? []).map((g) => ({
        ...g,
        team_id: Number(g.team_id || a.id)
      }))
    });
  }), Array.from(s.values());
}
function mt(e, t) {
  return e.find((n) => Number(n.id) === Number(t));
}
function $o(e, t) {
  if (t)
    for (const n of e) {
      const r = (n.roles ?? []).find(
        (o) => Number(o.id) === Number(t)
      );
      if (r)
        return r;
    }
}
function zo(e) {
  return Array.from(
    new Set(
      en(e).map((n) => Number(n.cate_id || 0)).filter(Boolean)
    )
  ).map((n) => ({
    id: n,
    value: `分类${n}`
  }));
}
function Bo(e) {
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
function Qt(e) {
  const t = String(e || "exists").trim().toLowerCase();
  return Wn.some((n) => n.id === t) ? t : "exists";
}
function Xn(e, t, n) {
  const r = t.find((o) => o.node_key === e.from_key);
  return r ? r.type === "condition" ? wn(n, ["passed", "failed"]) : r.type === "human_approval" ? wn(n, ["approved", "rejected"]) : [] : [];
}
function wn(e, t) {
  const n = new Map(e.map((r) => [r.id, r]));
  return t.map((r) => n.get(r)).filter((r) => !!r);
}
function Fo(e) {
  return {
    team: Lo(e?.team),
    asset_cates: Array.isArray(e?.asset_cates) ? e.asset_cates : [],
    flows: Array.isArray(e?.flows) ? e.flows.map(Vn) : [],
    flow_edges: Array.isArray(e?.flow_edges) ? e.flow_edges : [],
    nodes_by_flow: e?.nodes_by_flow ?? {},
    edges_by_flow: e?.edges_by_flow ?? e?.node_edges_by_flow ?? {},
    roles: Array.isArray(e?.roles) ? e.roles : [],
    agents: Array.isArray(e?.agents) ? en(e.agents) : [],
    agent_cates: Array.isArray(e?.agent_cates) ? Zn(e.agent_cates) : [],
    knowledge_cates: Array.isArray(e?.knowledge_cates) ? jo(e.knowledge_cates) : [],
    knowledge_bases: Array.isArray(e?.knowledge_bases) ? Mo(e.knowledge_bases) : [],
    teams: Array.isArray(e?.teams) ? e.teams : [],
    role_types: Array.isArray(e?.role_types) ? e.role_types : Hn,
    powers: Array.isArray(e?.powers) ? e.powers : [],
    power_kinds: Array.isArray(e?.power_kinds) ? e.power_kinds : [],
    node_types: Array.isArray(e?.node_types) ? e.node_types : wt,
    edge_conditions: Array.isArray(e?.edge_conditions) ? e.edge_conditions : Un
  };
}
function Lo(e) {
  const t = e && typeof e == "object" ? { ...e } : {};
  return t.publish_status = tn(
    t.publish_status
  ), t.current_release_id = Number(t.current_release_id || 0), t.release_version = Number(t.release_version || 0), t.readonly = !!t.readonly || Jn(t), t;
}
function Vn(e) {
  return { ...e };
}
function en(e) {
  return [...e].sort(vt);
}
function Zn(e) {
  return [...e].sort(vt);
}
function Mo(e) {
  return [...e].sort(vt);
}
function jo(e) {
  return [...e].sort(vt);
}
function vt(e, t) {
  const n = Number(e.sort || 0), r = Number(t.sort || 0);
  return n !== r ? n - r : Number(e.id || 0) - Number(t.id || 0);
}
function tn(e) {
  const t = String(e ?? "").trim().toLowerCase();
  return t === ft || t === "已发布" || t === "发布" ? ft : t === Lt || t === "编辑草稿" || t === "editing_draft" ? Lt : Io;
}
function Jn(e) {
  return !!e?.readonly || tn(e?.publish_status) === ft;
}
function Go(e) {
  return e === ft ? "已发布" : e === Lt ? "编辑草稿" : "草稿";
}
function xn(e, t, n) {
  return e === "node" ? t === n.key : !1;
}
function qo(e, t) {
  const n = String(e || "agent");
  return n === "role" ? "团队角色" : n === "team" ? "团队工作流" : t.find((r) => r.id === n)?.value || wt.find((r) => r.id === n)?.value || n;
}
function Ko(e) {
  return e.filter((t) => Ro.has(t.id));
}
function Ho(e) {
  return e.map((t) => ({
    ...t,
    role_id: t.type === "role" ? Number(t.role_id || t.config?.role_id || 0) : 0,
    role_key: t.type === "role" ? String(t.role_key || t.config?.role_key || "") : "",
    agent_id: t.type === "agent" ? t.agent_id : 0,
    power_id: t.type === "power" ? Number(t.power_id || t.config?.power_id || 0) : 0,
    sub_team_id: t.type === "team" ? Number(t.sub_team_id || t.config?.sub_team_id || 0) : 0,
    asset_cate_id: t.type === "context" || t.type === "save" ? Number(t.asset_cate_id || t.config?.asset_cate_id || 0) : 0,
    config: Uo(t)
  }));
}
function Uo(e) {
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
    operator: Qt(t.operator)
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
function Wo(e, t) {
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
          er(o, n, Yo(o))
        ]
      }
    };
  });
}
function Qn(e, t, n) {
  return {
    key: t,
    name: tr("工作流", e, (r) => r.name),
    goal: "",
    position: n ?? Nt(e.length),
    status: 1,
    sort: (e.length + 1) * 10
  };
}
function er(e, t, n) {
  return {
    node_key: t,
    name: tr("节点", e, (r) => r.name),
    type: "agent",
    role_id: 0,
    role_key: "",
    agent_id: 0,
    power_id: 0,
    sub_team_id: 0,
    asset_cate_id: 0,
    config: {},
    position: n ?? Nt(e.length),
    status: 1,
    sort: (e.length + 1) * 10
  };
}
function Nt(e) {
  return {
    x: 90 + e % 4 * 180,
    y: 90 + Math.floor(e / 4) * 140
  };
}
function Yo(e) {
  const t = [...e].filter((n) => n.position).sort((n, r) => Number(n.sort || 0) - Number(r.sort || 0)).at(-1);
  return t?.position ? {
    x: Number(t.position.x || 0) + 160,
    y: Number(t.position.y || 0)
  } : Nt(e.length);
}
function tr(e, t, n) {
  const r = /* @__PURE__ */ new Set(), o = new RegExp(`^${Xo(e)}(\\d+)$`);
  t.forEach((a) => {
    const c = String(n(a) || "").trim().match(o);
    c && r.add(Number(c[1]));
  });
  let s = 1;
  for (; r.has(s); )
    s += 1;
  return `${e}${s}`;
}
function Xo(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function nr(e, t, n) {
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
function Vo(e, t, n, r) {
  const o = e.flows ?? [];
  return o.some((s) => s.key === n) ? e : nr(
    {
      ...e,
      flows: [...o, Qn(o, n, r)]
    },
    t,
    n
  );
}
function rr(e, t, n, r) {
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
          condition: Jo(a?.type, o, n),
          status: 1,
          sort: (o.length + 1) * 10
        }
      ]
    }
  };
}
function Zo(e, t, n, r, o) {
  const s = e.nodes_by_flow?.[t] ?? [];
  return s.some((a) => a.node_key === r) ? e : rr(
    {
      ...e,
      nodes_by_flow: {
        ...e.nodes_by_flow ?? {},
        [t]: [...s, er(s, r, o)]
      }
    },
    t,
    n,
    r
  );
}
function Jo(e, t, n) {
  const r = new Set(
    t.filter((o) => o.from_key === n).map((o) => String(o.condition || ""))
  );
  return e === "condition" ? r.has("passed") ? "failed" : "passed" : e === "human_approval" ? r.has("approved") ? "rejected" : "approved" : "always";
}
function vn(e, t, n) {
  return {
    ...e,
    flows: (e.flows ?? []).map(
      (r) => r.key === t ? { ...r, ...n } : r
    )
  };
}
function Qo(e, t, n) {
  const r = [...e.flows ?? []], o = r.findIndex((c) => c.key === t), s = r.findIndex((c) => c.key === n);
  if (o < 0 || s < 0 || o === s)
    return e;
  const [a] = r.splice(o, 1);
  return r.splice(s, 0, a), {
    ...e,
    flows: r.map((c, d) => ({
      ...c,
      sort: (d + 1) * 10
    }))
  };
}
function Nn(e, t, n, r) {
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
function ei(e, t, n, r) {
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
function ti(e, t, n) {
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
const je = ht("@/lib/agent-result-protocol");
if (!je || Object.keys(je).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/agent-result-protocol");
const ni = bo.assistantReferencePayload, ri = ye.createRuntimeStreamTiming, oi = ye.formatStreamDuration, ii = ye.isStreamTimingRunning, si = ye.streamTimingPercentFromOutput, ai = jn.request, di = je.agentResultPayloadTitle, ci = je.extractAgentResultPayload, li = je.isAgentResultProtocolText, ui = je.normalizeAgentResultOutputValue;
function fi(e, t = []) {
  const n = ni(t);
  return {
    goal: e,
    requirement: e,
    prompt: e,
    user_input: e,
    reference_files: n ?? []
  };
}
function mi(e) {
  return {
    run: {
      id: 0,
      request_id: "",
      status: ce,
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
function gi(e, t) {
  return {
    run: {
      id: Number(e?.run_id || 0),
      request_id: String(e?.request_id || ""),
      status: String(e?.status || ce),
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
async function Sn(e, t, n, r, o) {
  const s = String(n?.run?.request_id || "");
  if (!s)
    return n;
  let a = n;
  const c = await Jr({
    streamApi: e,
    requestID: s,
    lastID: String(n?.[Mt] || "0-0"),
    blockMs: Po,
    signal: o,
    acceptErrorResult: !0,
    initialState: n,
    reduceFrame: (d, m) => pi(bi(d, m), m),
    fetchSnapshot: t ? () => _i(t, n) : void 0,
    mergeSnapshot: (d, m) => or(d, m),
    onUpdate: (d) => {
      a = d, r?.(d);
    }
  });
  return c.lastID && (a = {
    ...c.state,
    [Mt]: c.lastID
  }), a;
}
async function _i(e, t) {
  const n = await ai(e, "get", {
    run_id: Number(t?.run?.id || 0),
    request_id: String(t?.run?.request_id || ""),
    view: "summary"
  });
  if (n.code !== 0)
    throw new Error(n.message || "读取运行状态失败");
  return n.data;
}
function pi(e, t) {
  const n = String(t?.stream_id || "");
  return n ? {
    ...e,
    [Mt]: n
  } : e;
}
function bi(e, t) {
  const n = t?.output;
  return t?.type === "result" && yi(n) ? or(e, n) : A(n) ? hi(e, n) : e;
}
function or(e, t) {
  const n = Qr(e, t);
  return {
    ...e,
    ...t,
    run: n.run,
    node_runs: Dn(
      E(e?.node_runs),
      E(n?.node_runs),
      ["id", "node_key", "node_id"]
    ),
    flow_runs: Dn(
      E(e?.flow_runs),
      E(n?.flow_runs),
      ["id", "flow_id", "flow_key"]
    ),
    interactions: n.interactions,
    approvals: n.approvals
  };
}
function Dn(e, t, n) {
  return t.map((r) => {
    const o = e.find(
      (s) => n.some(
        (a) => ne(r?.[a]) && String(s?.[a]) === String(r?.[a])
      )
    );
    return o ? sr(o, r) : ar(r);
  });
}
function yi(e) {
  return !!(A(e) && (A(e.run) || Array.isArray(e.flow_runs) || Array.isArray(e.node_runs)));
}
function hi(e, t) {
  const n = nn(e), r = String(t.scope || "");
  return (r === "run" || ki(t.event)) && (n.run = wi(n.run, t)), r === "flow" && (n.flow_runs = An(
    n.flow_runs,
    xi(t),
    ["id", "flow_id", "flow_key"]
  )), r === "node" && (n.node_runs = An(
    n.node_runs,
    vi(t),
    ["id", "node_key", "node_id"]
  )), t.error && (n.error = String(t.error)), n;
}
function nn(e) {
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
function ki(e) {
  return ["run_started", "run_finished", "waiting"].includes(
    String(e || "")
  );
}
function wi(e, t) {
  const n = { ...e || {} };
  return be(n, "id", t.run_id), be(n, "team_id", t.team_id), be(n, "release_id", t.release_id), be(n, "status", rn(t, t.status || t.run_status)), be(n, "input", t.input), be(n, "output", t.output), be(n, "error", t.error), be(n, "started_at", t.started_at), be(n, "finished_at", t.finished_at), n;
}
function xi(e) {
  return ir({
    id: e.flow_run_id,
    run_id: e.run_id,
    flow_id: e.flow_id,
    flow_key: e.flow_key,
    flow_name: e.flow_name,
    name: e.flow_name,
    status: rn(e, e.status),
    input: e.input,
    output: e.output,
    error: e.error,
    started_at: e.started_at,
    finished_at: e.finished_at
  });
}
function vi(e) {
  return ir({
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
    status: rn(e, e.status || e.node_status),
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
function rn(e, t) {
  return eo(e, t);
}
function ir(e) {
  const t = {};
  return Object.entries(e).forEach(([n, r]) => {
    ne(r) && (t[n] = r);
  }), t;
}
function An(e, t, n) {
  if (!Object.keys(t).length)
    return e;
  const r = ar(t), o = e.findIndex(
    (a) => n.some(
      (c) => ne(r[c]) && String(a?.[c]) === String(r[c])
    )
  );
  if (o < 0)
    return [...e, r];
  const s = [...e];
  return s[o] = sr(s[o], r), s;
}
function sr(e, t) {
  const n = {
    ...e,
    ...t
  };
  return ne(e?.[xe]) ? n[xe] = e[xe] : dr(n) && (n[xe] = t[xe] || Date.now()), ne(e?.started_at) && ne(t.started_at) && !ne(t.finished_at) && (n.started_at = e.started_at), n;
}
function ar(e) {
  return !dr(e) || ne(e[xe]) ? e : {
    ...e,
    [xe]: Date.now()
  };
}
function dr(e) {
  const t = qe(e?.status);
  return t === ce || t === Se || ne(e?.started_at);
}
function be(e, t, n) {
  ne(n) && (e[t] = n);
}
function ne(e) {
  return e == null || e === "" ? !1 : Array.isArray(e) ? e.length > 0 : !0;
}
function Ni(e, t = /* @__PURE__ */ new Set()) {
  const n = {}, r = /* @__PURE__ */ new Map();
  for (const o of E(e?.node_runs)) {
    const s = String(o?.id || ""), a = String(o?.node_key || "");
    s && a && r.set(s, a);
  }
  for (const o of E(e?.approvals)) {
    const s = Si(o);
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
    const s = cr(o);
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
    const s = Di(o);
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
function cr(e) {
  const t = Vr(e), n = t.interaction, r = R(n.id);
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
function Si(e) {
  if (String(e?.status || "") !== Zt || !e?.id)
    return null;
  const t = de(e?.content), n = lr(
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
function Di(e) {
  if (String(e?.status || "") !== Se)
    return null;
  const t = de(e?.interaction);
  if (R(t.id) && R(t.type))
    return cr({
      run_id: e?.run_id,
      node_run_id: e?.id,
      node_key: e?.node_key,
      node_name: e?.node_name,
      interaction: t
    });
  const n = de(e?.output), r = n.approval_id || n.approvalId;
  if (!r)
    return null;
  const o = lr(
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
function lr(e, t, n) {
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
function Ai(e, t, n) {
  const r = nn(e);
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
      status: ce,
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
function Ci(e, t) {
  const n = nn(e);
  return n.run = {
    ...n.run || {},
    id: Number(t?.run_id || n.run?.id || 0),
    request_id: String(t?.request_id || n.run?.request_id || ""),
    status: String(t?.status || ce)
  }, n;
}
function de(e) {
  return A(e) ? e : {};
}
function ur(e) {
  return {
    [ce]: "运行中",
    [Se]: "等待反馈",
    [Ne]: "成功",
    [xt]: "失败",
    [Yn]: "已取消",
    [Zt]: "等待中"
  }[e] || e || "未知";
}
function fr(e) {
  return !e?.error || String(e?.status || "") === Ne ? "" : String(e.error);
}
function Ti(e) {
  switch (e) {
    case Ne:
      return "bg-emerald-50 text-emerald-700";
    case xt:
      return "bg-destructive/10 text-destructive";
    case ce:
      return "bg-blue-50 text-blue-700";
    case Se:
      return "bg-amber-50 text-amber-700";
    case Yn:
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted/60 text-muted-foreground";
  }
}
function Ei(e, t, n, r, o = {}) {
  const s = {}, a = an(E(e?.agent_runs)), c = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), m = on(E(e?.node_runs));
  m.forEach((_) => {
    const h = String(_?.node_key || "");
    if (!h)
      return;
    const k = qe(_?.status || _?.state || _?.run_status);
    s[h] = { status: k, run: _ }, k === Ne && c.add(h), Je(k) && d.add(h);
  });
  const u = new Set(t.map((_) => _.node_key)), g = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set();
  return n.forEach((_, h) => {
    if (!u.has(_.from_key) || !u.has(_.to_key))
      return;
    const k = mr(_, h);
    c.has(_.from_key) && d.has(_.to_key) && g.add(k), c.has(_.from_key) && c.has(_.to_key) && f.add(k);
  }), {
    active: r || !!e?.run,
    running: r,
    nodeRuns: m,
    nodeRunsByKey: s,
    agentRunsByID: a,
    pendingApprovalsByNodeKey: o,
    activeEdgeKeys: g,
    completedEdgeKeys: f
  };
}
function mr(e, t) {
  return `${e.from_key}->${e.to_key}:${t}`;
}
function Ri(e) {
  if (Je(e))
    return {
      animation: "team-node-running 1.4s ease-in-out infinite",
      borderColor: "#2563eb"
    };
  if (e === Ne)
    return {
      borderColor: "#86efac",
      boxShadow: "0 0 0 3px rgb(16 185 129 / 0.12), 0 4px 12px rgb(15 23 42 / 0.08)"
    };
  if (e === xt)
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
function Ii(e, t) {
  return e === Se && String(t || "") === "human_approval" ? "等待人工确认" : ur(e);
}
function on(e) {
  return [...e].sort(Pi);
}
function Pi(e, t) {
  const n = it(e?.started_at), r = it(t?.started_at);
  if (n !== r)
    return n - r;
  const o = it(e?.created_at), s = it(t?.created_at);
  return o !== s ? o - s : Number(e?.id || 0) - Number(t?.id || 0);
}
function it(e) {
  return qt(e)?.getTime() ?? Number.MAX_SAFE_INTEGER;
}
function Je(e) {
  return qe(e) === ce;
}
function qe(e) {
  return Zr(e);
}
function St(e) {
  return e === "agent" || e === "role" || e === "power" || e === "knowledge" || e === "team";
}
function gr(e, t) {
  const n = St(String(e?.node_type || "")) ? Dt(e, t) : void 0;
  return ii(n) || Je(e?.status);
}
function Dt(e, t, n) {
  const r = t || e, o = qe(e?.status || r?.status), s = e?.[xe] || e?.started_at || r?.started_at || e?.created_at;
  return ri({
    status: o,
    startedAt: s,
    finishedAt: r?.finished_at || e?.finished_at,
    label: Oi(e, t, n),
    percent: si(
      _r(t),
      r?.output,
      e?.output
    )
  });
}
function Oi(e, t, n) {
  const r = _r(t), o = $i(e, n);
  return Wi(
    r?.text,
    r?.message,
    t?.output?.text,
    e?.output?.text
  ) || o || `${_t(e?.node_type)}：${e?.node_name || e?.node_key || "节点"}`;
}
function $i(e, t) {
  if (String(e?.node_type || "") !== "team")
    return "";
  const n = zi(t?.node);
  if (!n)
    return `${_t(e?.node_type)}：${e?.node_name || e?.node_key || "节点"}`;
  const r = E(t?.nodeRuns).filter((o) => {
    if (Number(o?.flow_id || 0) !== n)
      return !1;
    const s = qe(o?.status);
    return s === ce || s === Se;
  }).slice(0, 2).map((o) => `${o?.node_name || o?.node_key || "节点"}正在执行`);
  return r.length === 0 ? `${_t(e?.node_type)}：${e?.node_name || e?.node_key || "节点"}` : r.join("、");
}
function zi(e) {
  return Number(e?.config?.sub_flow_id || e?.config?.flow_id || 0);
}
function _r(e) {
  const t = E(e?.stream);
  for (let n = t.length - 1; n >= 0; n -= 1) {
    const r = t[n]?.payload?.output;
    if (G(r))
      return r;
  }
}
function pr(e, t) {
  const n = String(e?.node_type || ""), r = Re(e?.output), o = Re(t?.output), s = ji(r);
  if (G(s))
    return s;
  if (n === "agent" || n === "role") {
    const a = A(r) ? r.output : void 0;
    return re(
      o,
      a,
      A(a) ? a.output : void 0,
      A(a) ? a.content : void 0,
      A(r) && r.summary ? { text: r.summary } : void 0,
      r
    );
  }
  return n === "power" ? re(
    A(r) ? r.output : void 0,
    A(r) ? r.data?.output : void 0,
    r
  ) : n === "merge" ? Bi(r) : n === "team" ? re(
    A(r) ? Mi(r.output) : void 0,
    A(r) ? r.result?.run?.output : void 0,
    A(r) ? r.result?.output : void 0,
    r
  ) : re(
    A(r) ? r.output : void 0,
    A(r) ? r.result : void 0,
    r
  );
}
function Bi(e) {
  const t = de(e);
  if (!Object.keys(t).length)
    return re(e);
  const n = E(t.sources).map(Fi).filter(G);
  if (n.length > 0) {
    const o = Li(t.meta);
    return o ? [{ text: o }, ...n] : n;
  }
  const r = Object.entries(de(t.merged)).map(([o, s]) => br(o, o, s)).filter(G);
  return r.length > 0 ? r : re(
    t.text ? { text: t.text } : void 0,
    t.output,
    t.result,
    t.content,
    t.data,
    e
  );
}
function Fi(e) {
  const t = de(e);
  return Object.keys(t).length ? br(
    R(t.title, t.key, "上游节点"),
    R(t.key),
    t.text || t.content
  ) : re(e);
}
function br(e, t, n) {
  const r = re(
    n,
    A(n) ? n.output : void 0,
    A(n) ? n.result : void 0,
    A(n) ? n.content : void 0,
    A(n) && n.text ? { text: n.text } : void 0
  );
  if (!G(r))
    return;
  const o = R(e, t, "上游节点");
  return typeof r == "string" ? { title: o, text: r } : A(r) ? { ...r, title: o } : { title: o, json: r };
}
function Li(e) {
  const t = de(e), n = Number(t.incoming_count || 0), r = Number(
    t.incoming_source_count || t.source_count || 0
  ), o = Number(t.source_count || 0), s = Number(t.missing_source_count || 0);
  if (!n && !o && !s)
    return "";
  const a = [`合并上游：${r}/${n}`];
  return o > r && a.push(`展示条目：${o}`), s > 0 && a.push(`缺少输出：${s}`), a.join("，");
}
function Mi(e) {
  const t = de(Re(e));
  if (!Object.keys(t).length)
    return e;
  const n = re(
    t.output,
    t.result,
    t.content,
    t.data,
    t.text ? { text: t.text } : void 0
  );
  if (G(n))
    return n;
  const r = Object.keys(t).filter(
    (o) => !o.startsWith("_") && !["input", "user_input"].includes(o)
  ).reverse();
  for (const o of r) {
    const s = Re(t[o]), a = A(s) ? re(
      s.output,
      s.result,
      s.content,
      s.data,
      s.text ? { text: s.text } : void 0
    ) : re(s);
    if (G(a))
      return a;
  }
}
function ji(e) {
  if (!A(e) || !ne(e.approval_id) && !ne(e.approvalId))
    return;
  const t = de(e.content), n = Gi(e);
  if (n)
    return { text: n };
  const r = de(e.data), o = Object.keys(r).length ? r : de(t.data), s = R(e.text, o.text, e.comment);
  return re(
    o.output,
    o.params,
    s ? { text: s } : void 0,
    qi(o)
  );
}
function Gi(e) {
  const t = String(e.decision || "").toLowerCase();
  if (!t)
    return "";
  const n = t === "approved" ? "人工确认：已通过" : t === "rejected" ? "人工确认：已驳回" : `人工确认：${t}`, r = R(e.comment);
  return r ? `${n}

${r}` : n;
}
function qi(e) {
  const t = {};
  return Object.entries(e).forEach(([n, r]) => {
    ["interaction", "output", "params", "text"].includes(n) || (t[n] = r);
  }), t;
}
function re(...e) {
  for (const t of e) {
    const n = sn(Re(t));
    if (G(n))
      return n;
  }
}
function sn(e) {
  const t = ui(e);
  if (t !== e && G(t))
    return t;
  if (typeof e == "string") {
    const o = Gt(e);
    if (o)
      return st(
        o.payload,
        o.cleanText
      );
    const s = gt(e);
    return s ? st(s) : e;
  }
  if (Array.isArray(e))
    return e.map(sn).filter(G);
  if (!A(e))
    return e;
  const n = Gt(
    R(e.text)
  );
  if (n)
    return st(
      n.payload,
      n.cleanText
    );
  if (yr(e))
    return st(e);
  const r = Ki(e);
  return r !== void 0 ? r : e;
}
function Ki(e) {
  for (const t of ["output", "result", "data", "content", "json", "value"]) {
    const n = sn(
      Re(e[t])
    );
    if (G(n))
      return n;
  }
}
function st(e, t = "") {
  const n = {}, r = Hi(e.content);
  r && Cn(n, r), Cn(n, e);
  const o = Ui(e) || t;
  return o && (n.text = o), !G(n) && r ? r : n;
}
function Hi(e) {
  return A(e) ? e : typeof e == "string" && e.trim() ? {
    format: "markdown",
    text: e.trim()
  } : null;
}
function Cn(e, t) {
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
    jt(t[r]) && (e[r] = t[r]);
  }), !jt(e.rich) && A(t.value) && (e.rich = t.value);
}
function jt(e) {
  return e == null || e === "" ? !1 : Array.isArray(e) ? e.length > 0 : A(e) ? Object.keys(e).length > 0 : !0;
}
function Ui(e) {
  if (!A(e))
    return typeof e == "string" ? e.trim() : "";
  const t = R(e.text);
  if (t)
    return t;
  const n = e.content;
  return typeof n == "string" ? n.trim() : A(n) ? R(n.text) : "";
}
function Wi(...e) {
  for (const t of e) {
    const n = R(t);
    if (!n)
      continue;
    const r = ci(n) || Gt(n);
    if (r) {
      const o = R(
        r.cleanText,
        di(r.payload),
        Yi(r.payload)
      );
      if (o)
        return o;
      continue;
    }
    if (!li(n))
      return n;
  }
  return "";
}
function Yi(e) {
  if (!A(e))
    return "";
  const t = A(e.content) ? e.content : {};
  return R(e.title, t.title);
}
function Gt(e) {
  for (const n of ["agent-result", "agent-output", "json"]) {
    const r = Xi(e, n);
    if (r)
      return r;
  }
  const t = gt(e);
  return t ? { cleanText: "", payload: t } : void 0;
}
function Xi(e, t) {
  const n = `\`\`\`${t}`, r = e.indexOf(n);
  if (r < 0)
    return;
  let o = r + n.length;
  for (; o < e.length && Ji(e[o]); )
    o += 1;
  let s = o;
  for (; s < e.length; ) {
    const a = e.indexOf("```", s);
    if (a < 0) {
      const d = gt(e.slice(o));
      return d ? {
        cleanText: e.slice(0, r).trim(),
        payload: d
      } : void 0;
    }
    const c = gt(e.slice(o, a));
    if (c)
      return {
        cleanText: `${e.slice(0, r)}${e.slice(a + 3)}`.trim(),
        payload: c
      };
    s = a + 3;
  }
}
function gt(e) {
  const t = e.trim(), n = Vi(t), r = n === t ? [t] : [t, n];
  for (const o of r)
    try {
      const s = JSON.parse(o);
      if (yr(s))
        return s;
    } catch {
    }
}
function yr(e) {
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
  ].some((n) => jt(e[n]));
}
function Vi(e) {
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
      t += Zi(o);
      continue;
    }
    t += o;
  }
  return t;
}
function Zi(e) {
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
function Ji(e) {
  return e === " " || e === "	" || e === "\r" || e === `
`;
}
function Re(e) {
  if (Array.isArray(e))
    return e.map(Re).filter(G);
  if (!A(e))
    return e;
  const t = {};
  return Object.entries(e).forEach(([n, r]) => {
    n !== "_debug_asset" && (t[n] = r);
  }), t;
}
function G(e) {
  return e == null || e === "" ? !1 : typeof e == "string" ? e.trim().length > 0 : typeof e == "number" || typeof e == "boolean" ? !0 : Array.isArray(e) ? e.some(G) : A(e) ? Object.keys(e).some(
    (t) => t !== "_debug_asset" && G(e[t])
  ) : !1;
}
function hr(e) {
  const t = A(e?._debug_asset) ? e._debug_asset : null, n = R(t?.name, t?.title);
  return `调试模式不会真正保存；正式运行会保存为${n ? `素材「${n}」的新版本` : "素材版本"}，并写入团队记忆。`;
}
function A(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function _t(e) {
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
function Qi(e, t) {
  const n = qt(e), r = qt(t);
  if (!n)
    return "等待开始";
  const o = [`开始 ${Tn(n)}`];
  return r ? (o.push(`结束 ${Tn(r)}`), o.push(
    `耗时 ${oi(r.getTime() - n.getTime())}`
  )) : o.push("运行中"), o.join(" · ");
}
function qt(e) {
  if (!e)
    return null;
  const t = new Date(String(e));
  return Number.isNaN(t.getTime()) ? null : t;
}
function Tn(e) {
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
function an(e) {
  const t = {};
  return e.forEach((n) => {
    n?.id && (t[String(n.id)] = n);
  }), t;
}
function es(e, t) {
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
const kr = kt.cn, ts = qn.AgentInteractionPanel, ns = J.Dialog, rs = J.DialogContent, os = J.DialogDescription, is = J.DialogTitle, ss = Ze.Select, as = Ze.SelectContent, ds = Ze.SelectItem, cs = Ze.SelectTrigger, ls = Ze.SelectValue, us = ye.formatStreamDuration, fs = ye.useStreamClock, ms = 220, En = 170, gs = 150;
function _s({
  view: e,
  flows: t,
  flowEdges: n,
  nodes: r,
  nodeEdges: o,
  edgeConditions: s,
  selected: a,
  connect: c,
  readonly: d,
  nodeTypes: m,
  executionState: u,
  paramApi: g,
  onSelect: f,
  onConnect: _,
  onOpenNodeResult: h,
  onSubmitApproval: k,
  onEdit: x,
  onDelete: P,
  onFlowConnect: D,
  onFlowConnectNew: v,
  onNodeConnect: C,
  onNodeConnectNew: B,
  onMove: H,
  onChangeNodeEdge: F
}) {
  return /* @__PURE__ */ i(to, { children: /* @__PURE__ */ i(
    ps,
    {
      view: e,
      flows: t,
      flowEdges: n,
      nodes: r,
      nodeEdges: o,
      edgeConditions: s,
      selected: a,
      connect: c,
      readonly: d,
      nodeTypes: m,
      executionState: u,
      paramApi: g,
      onSelect: f,
      onConnect: _,
      onOpenNodeResult: h,
      onSubmitApproval: k,
      onEdit: x,
      onDelete: P,
      onFlowConnect: D,
      onFlowConnectNew: v,
      onNodeConnect: C,
      onNodeConnectNew: B,
      onMove: H,
      onChangeNodeEdge: F
    }
  ) });
}
function ps({
  view: e,
  flows: t,
  flowEdges: n,
  nodes: r,
  nodeEdges: o,
  edgeConditions: s,
  selected: a,
  connect: c,
  readonly: d,
  nodeTypes: m,
  executionState: u,
  paramApi: g,
  onSelect: f,
  onConnect: _,
  onOpenNodeResult: h,
  onSubmitApproval: k,
  onEdit: x,
  onDelete: P,
  onFlowConnect: D,
  onFlowConnectNew: v,
  onNodeConnect: C,
  onNodeConnectNew: B,
  onMove: H,
  onChangeNodeEdge: F
}) {
  const [N, O] = I(null), Q = $t(null), Ie = $t(e), Pe = $t(!1), { fitView: Ke, screenToFlowPosition: Oe } = no(), ie = fs(!!u?.active), ue = e === "flow" ? t : r, U = e === "flow" ? n : o, W = Te(
    () => ue.map((y) => Kt(e, y)).join("|"),
    [ue, e]
  ), se = Te(
    () => ue.map((y, w) => {
      const S = Kt(e, y), M = Nt(w);
      return {
        id: S,
        type: "teamGraphNode",
        position: {
          x: Number(y.position?.x ?? M.x),
          y: Number(y.position?.y ?? M.y)
        },
        sourcePosition: lt.Right,
        targetPosition: lt.Left,
        selected: a?.kind === e && a.key === S,
        zIndex: a?.kind === e && a.key === S ? 100 : 1,
        draggable: !d,
        connectable: !d,
        style: {
          width: Me,
          height: ve
        },
        data: {
          kind: e,
          item: y,
          connect: c,
          nodeTypes: m,
          readonly: d,
          executionState: u,
          paramApi: g,
          now: ie,
          onOpenNodeResult: h,
          onSubmitApproval: k,
          onEdit: x,
          onDelete: P
        }
      };
    }),
    [
      u,
      c,
      ue,
      m,
      ie,
      P,
      x,
      h,
      k,
      g,
      d,
      a,
      e
    ]
  ), [te, $e] = I(se), [ee, ze] = I(null), [Be, Qe] = I(""), At = Te(() => {
    const y = U.map((w, S) => {
      const M = e === "flow" ? "flow_edge" : "node_edge", V = a?.kind === M && a.index === S, ae = mr(w, S), le = u?.activeEdgeKeys.has(ae), Ue = u?.completedEdgeKeys.has(ae), ge = Os(w, Be), rt = le || Ue, It = V ? "#2563eb" : ge || rt ? "#6366f1" : "#d4d4d8";
      return {
        id: Ls(e, w, S),
        source: w.from_key,
        target: w.to_key,
        type: "teamGraphEdge",
        animated: !!(rt || ge),
        selected: V,
        selectable: !0,
        reconnectable: !1,
        zIndex: V || le || ge ? 20 : 1,
        style: {
          stroke: It,
          strokeWidth: V || le || ge ? 2 : 1.5,
          strokeDasharray: V || ge ? "8 7" : "7 9",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          filter: le || ge ? "drop-shadow(0 0 5px rgb(37 99 235 / 0.45))" : void 0
        },
        data: {
          view: e,
          edge: w,
          index: S,
          highlighted: ge,
          nodes: r,
          edgeConditions: s,
          readonly: d,
          onSelect: f,
          onDelete: P,
          onChangeNodeEdge: F
        }
      };
    });
    return ee && y.push({
      id: Bs(ee),
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
        onSelect: f,
        onDelete: P,
        onChangeNodeEdge: F
      }
    }), y;
  }, [
    s,
    U,
    u,
    Be,
    r,
    F,
    P,
    f,
    ee,
    d,
    a,
    e
  ]);
  Xe(() => {
    window.requestAnimationFrame(() => {
      Ke({ padding: 0.24, maxZoom: 1.15, duration: 160 });
    });
  }, [Ke, W, e]), Xe(() => {
    $e((y) => Pe.current ? y : Ie.current !== e ? (Ie.current = e, se) : Pn(y, se));
  }, [se, e]), Xe(() => {
    if (!N)
      return;
    const y = () => O(null), w = (S) => {
      S.key === "Escape" && y();
    };
    return window.addEventListener("click", y), window.addEventListener("contextmenu", y), window.addEventListener("keydown", w), () => {
      window.removeEventListener("click", y), window.removeEventListener("contextmenu", y), window.removeEventListener("keydown", w);
    };
  }, [N]), Xe(() => {
    const y = (w) => {
      d || !a || w.defaultPrevented || w.key !== "Delete" && w.key !== "Backspace" || vr(w.target) || (w.preventDefault(), P(a));
    };
    return window.addEventListener("keydown", y), () => window.removeEventListener("keydown", y);
  }, [P, d, a]);
  const Ct = K(
    (y) => {
      d || $e((w) => ro(y, w));
    },
    [d]
  ), et = K(() => {
    Pe.current = !0, ze(null);
  }, []), tt = K(
    (y, w) => {
      if (d)
        return;
      const S = In(
        w,
        te,
        U
      );
      ze(
        (M) => zs(M, S) ? M : S
      );
    },
    [U, te, d]
  ), Tt = K(
    (y, w) => {
      Pe.current = !1;
      const S = In(
        w,
        te,
        U
      );
      if (ze(null), d)
        return;
      const M = wr(w.position);
      $e(
        (V) => Pn(V, se).map(
          (ae) => ae.id === w.id ? { ...ae, position: M } : ae
        )
      ), H(e, w.id, M), S && (e === "flow" ? D(S.source, S.target) : C(S.source, S.target));
    },
    [
      se,
      U,
      te,
      D,
      H,
      C,
      d,
      e
    ]
  ), Et = K(
    (y) => {
      d || !y.source || !y.target || (e === "flow" ? D(y.source, y.target) : C(y.source, y.target));
    },
    [D, C, d, e]
  ), He = K(
    (y, w) => {
      Q.current = w.nodeId, w.nodeId && _({ kind: e, fromKey: w.nodeId });
    },
    [_, e]
  ), Rt = K(
    (y, w) => {
      const S = Q.current;
      if (Q.current = null, _(null), d || !S || w.toNode)
        return;
      const M = js(y);
      if (!M)
        return;
      const V = Oe(M), ae = te.find((Ue) => Ue.id === S);
      if (!qs(ae?.position, V))
        return;
      const le = Is(ae?.position, V);
      e === "flow" ? v(S, le) : B(S, le);
    },
    [
      te,
      _,
      v,
      B,
      d,
      Oe,
      e
    ]
  ), De = K(
    (y, w) => {
      if (!Gs(y)) {
        if (Ts(w)) {
          y.stopPropagation(), w.data.onOpenNodeResult?.(w.id);
          return;
        }
        f(Ht(e, w.id));
      }
    },
    [f, e]
  ), fe = K(
    (y, w) => {
      y.preventDefault();
      const S = Ht(e, w.id);
      f(S), d || O({ x: y.clientX, y: y.clientY, target: S });
    },
    [f, d, e]
  ), nt = K(
    (y, w) => {
      Qe(w.id);
    },
    []
  ), me = K(() => {
    Qe("");
  }, []), he = K(
    (y, w) => {
      y.stopPropagation();
      const S = zn(w), M = a?.kind === S.kind && a.index === S.index, V = Ms(w);
      if (M && !d && !V) {
        P(S);
        return;
      }
      f(S);
    },
    [P, f, d, a]
  ), Fe = K(
    (y, w) => {
      y.preventDefault();
      const S = zn(w);
      f(S), d || O({ x: y.clientX, y: y.clientY, target: S });
    },
    [f, d]
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
          width: ${Me}px;
          height: ${ve}px;
          align-items: center;
          justify-content: center;
          user-select: none;
        }
        .team-graph-node-circle {
          position: relative;
          display: flex;
          width: ${Me}px;
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
          oo,
          {
            className: "team-workflow-react-flow",
            nodes: te,
            edges: At,
            nodeTypes: As,
            edgeTypes: Cs,
            nodesDraggable: !d,
            nodesConnectable: !d,
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
            onNodesChange: Ct,
            onConnect: Et,
            onConnectStart: He,
            onConnectEnd: Rt,
            onNodeDragStart: et,
            onNodeDrag: tt,
            onNodeDragStop: Tt,
            onNodeClick: De,
            onNodeContextMenu: fe,
            onNodeMouseEnter: nt,
            onNodeMouseLeave: me,
            onEdgeClick: he,
            onEdgeContextMenu: Fe,
            onPaneClick: () => {
              O(null), f(null);
            },
            onPaneContextMenu: (y) => {
              y.preventDefault(), O(null);
            },
            children: /* @__PURE__ */ i(io, { showInteractive: !1, position: "top-right" })
          }
        ),
        /* @__PURE__ */ i(
          Rs,
          {
            menu: N,
            onEdit: (y) => {
              O(null), x(y);
            },
            onDelete: (y) => {
              O(null), P(y);
            }
          }
        )
      ]
    }
  );
}
function bs({ data: e, selected: t }) {
  const n = Kt(e.kind, e.item), r = Ht(e.kind, n), o = $n(e.item), s = e.executionState?.nodeRunsByKey[n], a = s?.run, c = a?.agent_run_id ? e.executionState?.agentRunsByID[String(a.agent_run_id)] : void 0, d = e.kind === "node" && a && St(
    String(a.node_type || $n(e.item) || "")
  ) ? Dt(a, c, {
    node: e.item,
    nodeRuns: e.executionState?.nodeRuns || []
  }) : void 0, m = qe(s?.status), u = Ri(m), g = e.kind === "node" ? e.executionState?.pendingApprovalsByNodeKey[n] : void 0, f = ys(m), _ = hs(d?.percent), h = e.connect?.kind === e.kind && e.connect.fromKey === n;
  return /* @__PURE__ */ p(
    "div",
    {
      "data-graph-interactive": "true",
      "data-selected": t ? "true" : void 0,
      className: "team-graph-node",
      style: {
        cursor: e.readonly ? "pointer" : "move",
        zIndex: g ? 50 : d ? 40 : void 0
      },
      children: [
        /* @__PURE__ */ i(
          bn,
          {
            type: "target",
            position: lt.Left,
            style: Rn(f, "target")
          }
        ),
        /* @__PURE__ */ i(
          bn,
          {
            type: "source",
            position: lt.Right,
            style: Rn(f, "source")
          }
        ),
        /* @__PURE__ */ p(
          "div",
          {
            className: "team-graph-node-circle",
            style: {
              ...ks(f, t, h),
              ...u
            },
            children: [
              f === "running" ? /* @__PURE__ */ p(
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
              Ss(On(e.item), o, e.kind),
              /* @__PURE__ */ i(ws, { status: f })
            ]
          }
        ),
        g && e.onSubmitApproval ? /* @__PURE__ */ i(
          Es,
          {
            approval: g,
            paramApi: e.paramApi,
            onSubmit: e.onSubmitApproval
          }
        ) : null,
        /* @__PURE__ */ p("div", { className: "team-graph-node-label", children: [
          /* @__PURE__ */ i("span", { className: "team-graph-node-title", children: On(e.item) || n }),
          /* @__PURE__ */ i("span", { className: "team-graph-node-subtitle", children: vs({
            status: f,
            timing: d,
            now: e.now,
            idleText: e.kind === "flow" ? Fs(e.item) || n : qo(o, e.nodeTypes)
          }) }),
          e.readonly ? null : /* @__PURE__ */ p("div", { className: "team-graph-actions", children: [
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                className: "nodrag nopan team-graph-action-button",
                style: hn,
                title: "编辑",
                onClick: (k) => {
                  k.stopPropagation(), e.onEdit(r);
                },
                onMouseDown: (k) => k.stopPropagation(),
                children: /* @__PURE__ */ i(ut, { size: 13, style: kn })
              }
            ),
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                className: "nodrag nopan team-graph-action-button team-graph-action-button-danger",
                style: {
                  ...hn,
                  color: "hsl(var(--destructive))"
                },
                title: "删除",
                onClick: (k) => {
                  k.stopPropagation(), e.onDelete(r);
                },
                onMouseDown: (k) => k.stopPropagation(),
                children: /* @__PURE__ */ i(Gn, { size: 13, style: kn })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function ys(e) {
  return e === ce ? "running" : e === Se ? "waiting" : e === Ne ? "done" : e === xt ? "error" : "idle";
}
function hs(e) {
  if (e == null || e === "")
    return null;
  const t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? null : Math.max(0, Math.min(100, Math.round(t)));
}
function ks(e, t, n) {
  const r = {};
  return t && (r.borderColor = "#6366f1", r.boxShadow = "0 0 15px rgb(99 102 241 / 0.35), 0 0 0 4px rgb(99 102 241 / 0.12)"), n && (r.borderColor = "#f59e0b", r.boxShadow = "0 0 0 4px rgb(251 191 36 / 0.18), 0 4px 12px rgb(15 23 42 / 0.12)"), e === "running" && (r.borderColor = "#3b82f6", r.boxShadow = "0 0 0 4px rgb(59 130 246 / 0.08), 0 0 18px rgb(59 130 246 / 0.16)"), e === "waiting" && (r.borderColor = "#f59e0b", r.boxShadow = "0 0 0 4px rgb(245 158 11 / 0.10), 0 0 20px rgb(245 158 11 / 0.28)"), e === "done" && (r.borderColor = "#10b981", r.boxShadow = "0 4px 12px rgb(16 185 129 / 0.15)"), e === "error" && (r.borderColor = "hsl(var(--destructive))", r.boxShadow = "0 4px 12px rgb(239 68 68 / 0.16)"), r;
}
function Rn(e, t) {
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
function ws({ status: e }) {
  if (e === "running" || e === "idle")
    return null;
  const t = e === "done" ? /* @__PURE__ */ i(xo, { size: 10 }) : /* @__PURE__ */ i(lo, { size: 10 });
  return /* @__PURE__ */ i("span", { className: "team-graph-node-badge", style: xs(e), children: t });
}
function xs(e) {
  return e === "done" ? { background: "#10b981", color: "#fff" } : e === "waiting" ? { background: "#f59e0b", color: "#fff" } : e === "error" ? {
    background: "hsl(var(--destructive))",
    color: "hsl(var(--destructive-foreground))"
  } : { background: "hsl(var(--background))" };
}
function vs({
  status: e,
  timing: t,
  now: n,
  idleText: r
}) {
  const o = Ns(t, n);
  return e === "running" ? `进行中${o}` : e === "waiting" ? "待决策" : e === "done" ? `已完成${o}` : e === "error" ? "已失败" : r || "待激活";
}
function Ns(e, t) {
  if (!e?.startedAt)
    return "";
  const n = e.finishedAt || t || Date.now();
  return `（${us(n - e.startedAt)}）`;
}
function Ss(e, t, n) {
  const r = String(t || "").toLowerCase(), o = String(e || "").toLowerCase();
  return n === "flow" ? /* @__PURE__ */ i(dt, { size: 20, color: "#6366f1" }) : r === "agent" ? /* @__PURE__ */ i(fo, { size: 20, color: "#3b82f6" }) : r === "role" ? /* @__PURE__ */ i(Eo, { size: 20, color: "#6366f1" }) : r === "power" ? /* @__PURE__ */ i(po, { size: 20, color: "#f59e0b" }) : r === "team" ? /* @__PURE__ */ i(dt, { size: 20, color: "#14b8a6" }) : r === "context" ? /* @__PURE__ */ i(go, { size: 20, color: "#0ea5e9" }) : r === "knowledge" ? /* @__PURE__ */ i(mo, { size: 20, color: "#22c55e" }) : r === "condition" ? /* @__PURE__ */ i(_o, { size: 20, color: "#f97316" }) : r === "merge" ? /* @__PURE__ */ i(No, { size: 20, color: "#f43f5e" }) : r === "human_approval" ? /* @__PURE__ */ i(pn, { size: 20, color: "#8b5cf6" }) : r === "save" ? /* @__PURE__ */ i(yn, { size: 20, color: "#10b981" }) : o.includes("收集") || o.includes("输入") || o.includes("反馈") || o.includes("审批") ? /* @__PURE__ */ i(pn, { size: 20, color: "#8b5cf6" }) : o.includes("保存") || o.includes("存储") || o.includes("入库") ? /* @__PURE__ */ i(yn, { size: 20, color: "#10b981" }) : o.includes("写") || o.includes("剧本") || o.includes("故事") || o.includes("设计") || o.includes("创作") ? /* @__PURE__ */ i(so, { size: 20, color: "#a855f7" }) : o.includes("背景") || o.includes("世界") || o.includes("元素") || o.includes("灵感") ? /* @__PURE__ */ i(uo, { size: 20, color: "#f59e0b" }) : /* @__PURE__ */ i(Co, { size: 20, color: "#71717a" });
}
function Ds(e) {
  const { data: t, selected: n, style: r, animated: o } = e, [s, a, c] = ao({
    sourceX: e.sourceX,
    sourceY: e.sourceY,
    sourcePosition: e.sourcePosition,
    targetX: e.targetX,
    targetY: e.targetY,
    targetPosition: e.targetPosition
  });
  if (!t)
    return /* @__PURE__ */ i(zt, { path: s, style: r });
  if (t.preview)
    return /* @__PURE__ */ i(zt, { path: s, style: r, interactionWidth: 0 });
  const d = xr(t.view, t.index), m = t.view === "flow" ? [] : Xn(
    t.edge,
    t.nodes,
    t.edgeConditions
  ), u = m.length > 0, g = m[0]?.id ?? "", f = m.some(
    (x) => x.id === t.edge.condition
  ) && t.edge.condition || g, _ = u || n, h = !!t.highlighted, k = {
    ...r,
    opacity: n ? 1 : h ? 0.95 : o ? 0.72 : 0.42,
    transition: "stroke 0.25s ease, stroke-width 0.25s ease, opacity 0.25s ease"
  };
  return /* @__PURE__ */ p(Xt, { children: [
    /* @__PURE__ */ i(zt, { path: s, style: k, interactionWidth: 32 }),
    o ? /* @__PURE__ */ p("g", { style: { opacity: n || h ? 0.9 : 0.45 }, children: [
      /* @__PURE__ */ i("circle", { r: "2.5", fill: "#6366f1", opacity: "0.25", children: /* @__PURE__ */ i("animateMotion", { dur: "3s", repeatCount: "indefinite", path: s }) }),
      /* @__PURE__ */ i("circle", { r: "1.5", fill: "#818cf8", children: /* @__PURE__ */ i("animateMotion", { dur: "3s", repeatCount: "indefinite", path: s }) })
    ] }) : null,
    _ ? /* @__PURE__ */ i(co, { children: /* @__PURE__ */ i(
      "div",
      {
        className: "nodrag nopan nowheel absolute z-10 -translate-x-1/2 -translate-y-1/2",
        style: {
          transform: `translate(-50%, -50%) translate(${a}px, ${c}px)`,
          pointerEvents: "all"
        },
        onClick: (x) => {
          x.stopPropagation(), t.onSelect(d);
        },
        onContextMenu: (x) => {
          x.preventDefault(), x.stopPropagation(), t.onSelect(d);
        },
        children: u ? /* @__PURE__ */ p("div", { className: "relative w-24", children: [
          n && !t.readonly ? /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "absolute -right-2 -top-2 z-20 flex size-5 items-center justify-center rounded-full border border-destructive bg-background text-destructive shadow-sm hover:bg-destructive/10",
              title: "删除关系",
              onClick: (x) => {
                x.stopPropagation(), t.onDelete(d);
              },
              children: /* @__PURE__ */ i(ct, { className: "size-3" })
            }
          ) : null,
          /* @__PURE__ */ p(
            ss,
            {
              value: f,
              disabled: t.readonly,
              onValueChange: (x) => t.onChangeNodeEdge(t.index, { condition: x }),
              children: [
                /* @__PURE__ */ i(cs, { className: "h-7 justify-center rounded-full bg-background px-3 pr-3 text-xs shadow-sm [&_.select-trigger-chevron]:hidden", children: /* @__PURE__ */ i(ls, {}) }),
                /* @__PURE__ */ i(as, { children: m.map((x) => /* @__PURE__ */ i(ds, { value: x.id, children: x.value }, x.id)) })
              ]
            }
          )
        ] }) : /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: kr(
              "flex items-center justify-center rounded-full border bg-background text-xs text-foreground shadow-sm",
              n && !t.readonly ? "size-6 border-destructive text-destructive hover:bg-destructive/10" : "size-5 border-blue-300 text-blue-600"
            ),
            title: n && !t.readonly ? "删除关系" : "点击选中关系，Delete 删除",
            onClick: (x) => {
              x.stopPropagation(), n && !t.readonly ? t.onDelete(d) : t.onSelect(d);
            },
            children: n && !t.readonly ? /* @__PURE__ */ i(ct, { className: "size-3.5" }) : null
          }
        )
      }
    ) }) : null
  ] });
}
const As = {
  teamGraphNode: bs
}, Cs = {
  teamGraphEdge: Ds
};
function Ts(e) {
  const t = e.data;
  if (t.kind !== "node" || !t.onOpenNodeResult)
    return !1;
  const n = t.executionState?.nodeRunsByKey[e.id]?.status, r = t.executionState?.pendingApprovalsByNodeKey[e.id];
  return !!(n && !r);
}
function Es({
  approval: e,
  paramApi: t,
  onSubmit: n
}) {
  return /* @__PURE__ */ i(ns, { open: !0, children: /* @__PURE__ */ p(
    rs,
    {
      "data-assistant-layer": "true",
      "data-stop-card-click": "true",
      className: kr(
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
        /* @__PURE__ */ i(is, { className: "sr-only", children: e.title || "需要补充信息" }),
        /* @__PURE__ */ i(os, { className: "sr-only", children: "填写并提交后，团队工作流会从当前节点继续执行。" }),
        /* @__PURE__ */ i(
          ts,
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
function Rs({
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
              /* @__PURE__ */ i(ut, { className: "size-4" }),
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
              /* @__PURE__ */ i(Gn, { className: "size-4" }),
              "删除"
            ]
          }
        )
      ]
    }
  ) : null;
}
function Kt(e, t) {
  return e === "flow" ? t.key : t.node_key;
}
function wr(e, t = 0) {
  const n = Number(e.x), r = Number(e.y) + t;
  return {
    x: Number.isFinite(n) ? n : 0,
    y: Number.isFinite(r) ? r : 0
  };
}
function Is(e, t) {
  const n = wr(t, -ve / 2);
  if (!e)
    return n;
  const r = pt(e), o = pt(n), s = o.x - r.x, a = o.y - r.y, c = Math.hypot(s, a);
  if (c > 0 && c <= ms)
    return n;
  const d = c > 0 ? s / c : 1, m = c > 0 ? a / c : 0;
  return {
    x: r.x + d * En - Me / 2,
    y: r.y + m * En - ve / 2
  };
}
function In(e, t, n) {
  if (!Ps(e.id, n))
    return null;
  const r = pt(e.position);
  let o = null, s = Number.MAX_VALUE;
  if (t.forEach((d) => {
    if (d.id === e.id)
      return;
    const m = pt(d.position), u = Math.hypot(
      m.x - r.x,
      m.y - r.y
    );
    u < s && u < gs && (o = d, s = u);
  }), !o)
    return null;
  const a = o.position.x < e.position.x, c = {
    source: a ? o.id : e.id,
    target: a ? e.id : o.id
  };
  return $s(n, c) ? null : c;
}
function pt(e) {
  return {
    x: e.x + Me / 2,
    y: e.y + ve / 2
  };
}
function Ps(e, t) {
  return !t.some((n) => n.from_key === e || n.to_key === e);
}
function Os(e, t) {
  return t ? e.from_key === t || e.to_key === t : !1;
}
function $s(e, t) {
  return e.some(
    (n) => n.from_key === t.source && n.to_key === t.target
  );
}
function zs(e, t) {
  return e?.source === t?.source && e?.target === t?.target;
}
function Bs(e) {
  return `proximity:${e.source}:${e.target}`;
}
function Pn(e, t) {
  if (!e.length)
    return t;
  const n = new Map(e.map((r) => [r.id, r]));
  return t.map((r) => {
    const o = n.get(r.id);
    return o ? { ...o, ...r, position: o.position } : r;
  });
}
function On(e) {
  return e.name;
}
function Fs(e) {
  return "node_key" in e ? "" : e.goal || "";
}
function $n(e) {
  return "node_key" in e && e.type || "";
}
function Ht(e, t) {
  return e === "flow" ? { kind: "flow", key: t } : { kind: "node", key: t };
}
function Ls(e, t, n) {
  return `${e}:${t.from_key}->${t.to_key}:${n}`;
}
function zn(e) {
  const t = e.data;
  return xr(t.view, t.index);
}
function xr(e, t) {
  return e === "flow" ? { kind: "flow_edge", index: t } : { kind: "node_edge", index: t };
}
function Ms(e) {
  const t = e.data;
  return t.view === "flow" ? !1 : Xn(
    t.edge,
    t.nodes,
    t.edgeConditions
  ).length > 0;
}
function js(e) {
  if ("clientX" in e)
    return { x: e.clientX, y: e.clientY };
  const t = e.changedTouches[0] ?? e.touches[0];
  return t ? { x: t.clientX, y: t.clientY } : null;
}
function vr(e) {
  const t = e;
  if (!t)
    return !1;
  const n = t.tagName.toLowerCase();
  return n === "input" || n === "textarea" || n === "select" || t.isContentEditable || !!t.closest('[contenteditable="true"]');
}
function Gs(e) {
  const t = e.target;
  if (!t)
    return !1;
  if (vr(t))
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
function qs(e, t) {
  if (!e)
    return !1;
  const n = {
    x: e.x + Me,
    y: e.y + ve / 2
  };
  return Math.hypot(t.x - n.x, t.y - n.y) > 48;
}
const Ks = kt.cn, Hs = Vt.Button, Nr = J.Dialog, Sr = J.DialogContent, Dr = J.DialogDescription, Ar = J.DialogHeader, Cr = J.DialogTitle, Us = Kn.Textarea, Tr = qn.AgentInteractionPanel, Er = yo.EnergonContentView, Ws = ye.isStreamTimingRunning, Rr = ye.StreamTimingBadge, Ir = ye.useStreamClock;
function Ys({
  open: e,
  target: t,
  prompt: n,
  running: r,
  result: o,
  paramApi: s,
  pendingApprovalsByNodeKey: a,
  onOpenChange: c,
  onPromptChange: d,
  onRun: m,
  onSubmitApproval: u
}) {
  const g = t === "team" ? "调试" : "调试工作流", f = String(o?.run?.status || o?.status || ""), _ = f ? `当前状态：${ur(f)}` : "调试会先自动保存，并使用当前保存内容运行", h = "输入目标后会先自动保存当前编辑内容，并使用保存后的内容执行；每个节点的执行状态和输出会显示在这里。", k = t === "team" ? "会先保存当前团队工作流编排，再按保存后的内容逐个执行。" : "会先保存当前工作流节点流程，再按节点顺序执行。";
  return /* @__PURE__ */ i(Nr, { open: e, onOpenChange: c, children: /* @__PURE__ */ p(
    Sr,
    {
      className: "flex flex-col overflow-hidden sm:max-w-4xl",
      style: {
        height: "min(82vh, 48rem)",
        maxHeight: "min(82vh, 48rem)"
      },
      children: [
        /* @__PURE__ */ p(Ar, { children: [
          /* @__PURE__ */ i(Cr, { children: g }),
          /* @__PURE__ */ i(Dr, { className: "sr-only", children: k })
        ] }),
        /* @__PURE__ */ p("div", { className: "flex min-h-0 flex-1 flex-col gap-4", children: [
          /* @__PURE__ */ p("div", { className: "flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border bg-muted/20", children: [
            /* @__PURE__ */ p("div", { className: "flex items-center justify-between gap-3 border-b px-3 py-2", children: [
              /* @__PURE__ */ i("div", { className: "text-sm font-medium", children: "运行展示" }),
              /* @__PURE__ */ i("div", { className: "text-xs text-muted-foreground", children: _ })
            ] }),
            /* @__PURE__ */ i("div", { className: "relative min-h-0 flex-1", children: o ? /* @__PURE__ */ i("div", { className: "absolute inset-0 overflow-hidden", children: /* @__PURE__ */ i(
              Xs,
              {
                result: o,
                paramApi: s,
                pendingApprovalsByNodeKey: a,
                onSubmitApproval: u
              }
            ) }) : /* @__PURE__ */ i("div", { className: "absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted-foreground", children: /* @__PURE__ */ i("span", { className: "max-w-3xl", children: h }) }) })
          ] }),
          /* @__PURE__ */ p("div", { className: "shrink-0 rounded-md border bg-background p-3 shadow-sm", children: [
            /* @__PURE__ */ i(
              Us,
              {
                value: n,
                disabled: r,
                className: "min-h-24 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0",
                placeholder: "输入这次调试要完成的目标、输入材料或约束...",
                onChange: (x) => d(x.target.value)
              }
            ),
            /* @__PURE__ */ p("div", { className: "mt-3 flex items-center justify-between gap-3 border-t pt-3", children: [
              /* @__PURE__ */ i("div", { className: "text-xs text-muted-foreground", children: k }),
              /* @__PURE__ */ p(Hs, { disabled: r, onClick: m, children: [
                r ? /* @__PURE__ */ i(Ee, { className: "size-4 animate-spin" }) : /* @__PURE__ */ i(dt, { className: "size-4" }),
                r ? "调试中" : "开始调试"
              ] })
            ] })
          ] })
        ] })
      ]
    }
  ) });
}
function Xs({
  result: e,
  paramApi: t,
  pendingApprovalsByNodeKey: n,
  onSubmitApproval: r
}) {
  const o = e?.run || {}, s = on(E(e?.node_runs)), a = an(E(e?.agent_runs)), c = Je(o.status) || s.some(
    (m) => gr(m, a[String(m.agent_run_id)])
  ), d = Ir(c);
  return e?.error && !e?.run ? /* @__PURE__ */ i("div", { className: "h-full overflow-auto p-4 text-sm text-destructive", children: String(e.error) }) : /* @__PURE__ */ p(
    "div",
    {
      className: "h-full space-y-3 overflow-auto p-4 text-sm",
      style: { maxHeight: "calc(min(82vh, 48rem) - 14rem)" },
      children: [
        s.length > 0 ? /* @__PURE__ */ i("div", { className: "space-y-3", children: s.map((m, u) => /* @__PURE__ */ i(
          Vs,
          {
            row: m,
            index: u,
            agentTrace: a[String(m.agent_run_id)],
            approval: n[String(m?.node_key || "")],
            paramApi: t,
            now: d,
            onSubmitApproval: r
          },
          es(m, u)
        )) }) : /* @__PURE__ */ i("div", { className: "flex h-full min-h-72 items-center justify-center text-center text-sm text-muted-foreground", children: /* @__PURE__ */ p("div", { className: "inline-flex items-center gap-2", children: [
          /* @__PURE__ */ i(Ee, { className: "size-3 animate-spin" }),
          "正在等待节点开始执行..."
        ] }) }),
        o.error ? /* @__PURE__ */ i("div", { className: "rounded-md bg-destructive/10 p-3 text-xs text-destructive", children: o.error }) : null
      ]
    }
  );
}
function Vs({
  row: e,
  index: t,
  agentTrace: n,
  approval: r,
  paramApi: o,
  now: s,
  onSubmitApproval: a
}) {
  const c = e.node_name || e.node_key || `节点 ${t + 1}`, d = String(e.node_type || ""), m = pr(e, n), u = St(d) ? Dt(e, n) : void 0, g = gr(e, n), f = d === "save" ? hr(e.output) : "", _ = fr(e);
  return /* @__PURE__ */ p("article", { className: "rounded-md border bg-background p-3", children: [
    /* @__PURE__ */ p("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ p("div", { className: "min-w-0", children: [
        /* @__PURE__ */ p("div", { className: "font-medium", children: [
          t + 1,
          ". ",
          c
        ] }),
        /* @__PURE__ */ p("div", { className: "mt-1 text-xs text-muted-foreground", children: [
          _t(d),
          " ·",
          " ",
          Qi(e.started_at, e.finished_at)
        ] })
      ] }),
      u ? /* @__PURE__ */ i(Rr, { timing: u, now: s, className: "max-w-full" }) : /* @__PURE__ */ i(Pr, { status: e.status, nodeType: d }),
      _ ? /* @__PURE__ */ i("div", { className: "basis-full rounded bg-destructive/10 p-2 text-xs text-destructive", children: _ }) : null
    ] }),
    f ? /* @__PURE__ */ i("div", { className: "mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800", children: f }) : null,
    r ? /* @__PURE__ */ i("div", { className: "mt-3 overflow-hidden rounded-md border border-amber-200 bg-amber-50/45", children: /* @__PURE__ */ i(
      Tr,
      {
        interaction: r.interaction,
        paramApi: o,
        layout: "inline",
        onSubmit: (h) => a(r, h)
      }
    ) }) : null,
    /* @__PURE__ */ i("div", { className: "mt-3 rounded-md border bg-muted/15 p-3", children: G(m) ? /* @__PURE__ */ i(Er, { output: m, emptyText: "暂无节点输出。" }) : g ? /* @__PURE__ */ p("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ i(Ee, { className: "size-3 animate-spin" }),
      "正在等待节点输出..."
    ] }) : /* @__PURE__ */ i("div", { className: "text-xs text-muted-foreground", children: "暂无节点输出。" }) })
  ] });
}
function Pr({
  status: e,
  nodeType: t
}) {
  const n = String(e || Zt);
  return /* @__PURE__ */ p(
    "span",
    {
      className: Ks(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs",
        Ti(n)
      ),
      children: [
        n === ce ? /* @__PURE__ */ i(Ee, { className: "size-3 animate-spin" }) : null,
        Ii(n, t)
      ]
    }
  );
}
function Zs({
  open: e,
  nodeKey: t,
  nodes: n,
  result: r,
  approval: o,
  paramApi: s,
  onOpenChange: a,
  onSubmitApproval: c
}) {
  const d = n.find((C) => C.node_key === t), m = on(E(r?.node_runs)), u = m.find(
    (C) => String(C?.node_key || "") === t
  ), g = an(E(r?.agent_runs)), f = u?.agent_run_id ? g[String(u.agent_run_id)] : void 0, _ = String(u?.node_type || d?.type || ""), h = u && !o ? pr(u, f) : void 0, k = _ === "save" && u ? hr(u.output) : "", x = u && St(_) ? Dt(u, f, { node: d, nodeRuns: m }) : void 0, P = Ws(x) || !!(u && Je(u.status)), D = Ir(P), v = fr(u);
  return /* @__PURE__ */ i(Nr, { open: e, onOpenChange: a, children: /* @__PURE__ */ p(
    Sr,
    {
      className: "flex max-w-none flex-col gap-0 overflow-hidden p-0",
      style: {
        width: "min(56rem, calc(100vw - 2rem))",
        height: "min(82vh, 48rem)"
      },
      children: [
        /* @__PURE__ */ p(Ar, { className: "shrink-0 border-b px-6 py-4", children: [
          /* @__PURE__ */ i(Cr, { className: "min-w-0 truncate pr-7", children: d?.name || u?.node_name || t || "节点结果" }),
          /* @__PURE__ */ i(Dr, { className: "sr-only", children: "查看当前节点的执行状态和输出结果。" })
        ] }),
        /* @__PURE__ */ p("div", { className: "min-h-0 min-w-0 flex-1 overflow-y-auto bg-background px-6 py-4", children: [
          x || u ? /* @__PURE__ */ p("div", { className: "mb-3 flex flex-wrap items-center gap-2 rounded-md border bg-muted/15 px-3 py-2", children: [
            /* @__PURE__ */ i("span", { className: "text-xs text-muted-foreground", children: "执行状态" }),
            x ? /* @__PURE__ */ i(
              Rr,
              {
                timing: x,
                now: D,
                className: "max-w-full"
              }
            ) : /* @__PURE__ */ i(Pr, { status: u?.status, nodeType: _ })
          ] }) : null,
          v ? /* @__PURE__ */ i("div", { className: "mb-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive", children: v }) : null,
          k ? /* @__PURE__ */ i("div", { className: "mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800", children: k }) : null,
          o ? /* @__PURE__ */ i("div", { className: "mb-3 overflow-hidden rounded-md border border-amber-200 bg-amber-50/45", children: /* @__PURE__ */ i(
            Tr,
            {
              interaction: o.interaction,
              paramApi: s,
              layout: "inline",
              onSubmit: (C) => c(o, C)
            }
          ) }) : null,
          o ? null : G(h) ? /* @__PURE__ */ i(
            Er,
            {
              output: h,
              emptyText: "暂无节点输出。",
              className: "min-w-0"
            }
          ) : P ? /* @__PURE__ */ p("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ i(Ee, { className: "size-4 animate-spin" }),
            "节点正在执行，等待输出..."
          ] }) : /* @__PURE__ */ i("div", { className: "text-sm text-muted-foreground", children: "这个节点还没有输出。" })
        ] })
      ]
    }
  ) });
}
const Ut = ht("@/components/assistant/form-actions");
if (!Ut || Object.keys(Ut).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/assistant/form-actions");
const bt = ht("@/components/ui/radio-group");
if (!bt || Object.keys(bt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/radio-group");
function Js(e) {
  return {
    scope: "modal",
    route: "bot/team/flow",
    page: {
      name: "编辑工作流",
      title: e.name || e.key
    },
    form: {
      fields: Qs(),
      values: ea(e)
    }
  };
}
function Qs() {
  return Oo;
}
function ea(e) {
  const t = {};
  return e.name && (t["form.name"] = e.name), e.goal && (t["form.goal"] = e.goal), t;
}
function ta(e, t, n) {
  const r = {}, o = Bn(t, "form.name"), s = Bn(t, "form.goal");
  o !== void 0 && (r.name = o), s !== void 0 && (r.goal = s), Object.keys(r).length > 0 && n(e, r);
}
function Bn(e, t) {
  const n = t.replace(/^form\./, ""), r = e[t] ?? e[n];
  if (r != null)
    return typeof r == "string" ? r : JSON.stringify(r);
}
const na = kt.cn, ra = Vt.Button, oa = Ut.AssistantContextFormFillButton, ia = J.Dialog, sa = J.DialogClose, aa = J.DialogContent, da = J.DialogHeader, ca = J.DialogTitle, yt = ho.Input, Wt = Kn.Textarea, la = bt.RadioGroup, ua = bt.RadioGroupItem, oe = ko.SearchableOptionPicker;
function fa({
  open: e,
  onOpenChange: t,
  selected: n,
  flows: r,
  nodes: o,
  currentTeamID: s,
  currentTeamName: a,
  roles: c,
  roleTypes: d,
  agents: m,
  agentCates: u,
  assetCates: g,
  knowledgeCates: f,
  knowledgeBases: _,
  teamBindingOptions: h,
  powers: k,
  powerKinds: x,
  nodeTypes: P,
  readonly: D,
  onChangeFlow: v,
  onChangeNode: C
}) {
  if (!n)
    return null;
  const B = wa(n);
  let H = null, F = null;
  if (n.kind === "flow") {
    const N = r.find((O) => O.key === n.key);
    if (N) {
      const O = Js(N);
      F = D ? null : /* @__PURE__ */ i(
        oa,
        {
          context: O,
          className: "mt-[-0.125rem]",
          variant: "outline",
          size: "sm",
          onApplyValues: (Q) => ta(N.key, Q, v)
        }
      ), H = /* @__PURE__ */ p("div", { className: "space-y-1", children: [
        /* @__PURE__ */ i(X, { label: "名称", children: /* @__PURE__ */ i(
          yt,
          {
            value: N.name || "",
            disabled: D,
            onChange: (Q) => v(N.key, { name: Q.target.value })
          }
        ) }),
        /* @__PURE__ */ i(X, { label: "目标", children: /* @__PURE__ */ i(
          Wt,
          {
            value: N.goal || "",
            disabled: D,
            onChange: (Q) => v(N.key, { goal: Q.target.value })
          }
        ) })
      ] });
    }
  } else if (n.kind === "node") {
    const N = o.find((O) => O.node_key === n.key);
    H = N ? /* @__PURE__ */ p("div", { className: "space-y-1", children: [
      /* @__PURE__ */ i(X, { label: "名称", children: /* @__PURE__ */ i(
        yt,
        {
          value: N.name || "",
          disabled: D,
          onChange: (O) => C(N.node_key, { name: O.target.value })
        }
      ) }),
      /* @__PURE__ */ i(X, { label: "类型", children: /* @__PURE__ */ i(
        Or,
        {
          options: P,
          value: N.type || "agent",
          onValueChange: (O) => C(
            N.node_key,
            Na(N, O, g)
          ),
          disabled: D
        }
      ) }),
      N.type === "role" ? /* @__PURE__ */ i(
        ma,
        {
          node: N,
          roles: c,
          roleTypes: d,
          currentTeamID: s,
          currentTeamName: a,
          teams: h,
          readonly: D,
          onChangeNode: C
        }
      ) : null,
      N.type === "agent" ? /* @__PURE__ */ i(
        ga,
        {
          node: N,
          agents: m,
          agentCates: u,
          readonly: D,
          onChangeNode: C
        }
      ) : null,
      N.type === "power" ? /* @__PURE__ */ i(
        _a,
        {
          node: N,
          powers: k,
          powerKinds: x,
          readonly: D,
          onChangeNode: C
        }
      ) : null,
      N.type === "team" ? /* @__PURE__ */ i(
        pa,
        {
          node: N,
          currentTeamID: s,
          currentTeamName: a,
          teams: h,
          readonly: D,
          onChangeNode: C
        }
      ) : null,
      N.type === "condition" ? /* @__PURE__ */ i(
        ba,
        {
          node: N,
          readonly: D,
          onChangeNode: C
        }
      ) : null,
      N.type === "knowledge" ? /* @__PURE__ */ i(
        ya,
        {
          node: N,
          knowledgeCates: f,
          knowledgeBases: _,
          readonly: D,
          onChangeNode: C
        }
      ) : null,
      N.type === "context" || N.type === "save" ? /* @__PURE__ */ i(
        ha,
        {
          node: N,
          assetCates: g,
          readonly: D,
          onChangeNode: C
        }
      ) : null,
      N.type === "agent" || N.type === "role" ? /* @__PURE__ */ i(X, { label: "目标", children: /* @__PURE__ */ i(
        Wt,
        {
          value: String(N.config?.goal ?? ""),
          disabled: D,
          placeholder: "填写给智能体的详细任务目标；留空时使用名称作为目标",
          onChange: (O) => C(N.node_key, {
            config: {
              ...N.config ?? {},
              goal: O.target.value
            }
          })
        }
      ) }) : null
    ] }) : null;
  }
  return /* @__PURE__ */ i(ia, { open: e, onOpenChange: t, children: /* @__PURE__ */ p(
    aa,
    {
      showCloseButton: !1,
      className: "flex flex-col gap-0 overflow-visible p-0 sm:max-w-2xl",
      style: { maxHeight: "min(82vh, 48rem)" },
      children: [
        /* @__PURE__ */ i(da, { className: "shrink-0 px-6 py-4 text-start", children: /* @__PURE__ */ p("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ i(ca, { className: "min-w-0 pt-1", children: B }),
          /* @__PURE__ */ p("div", { className: "flex shrink-0 items-start gap-2", children: [
            F,
            /* @__PURE__ */ i(sa, { asChild: !0, children: /* @__PURE__ */ p(
              ra,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                className: "-mr-3 -mt-2 size-8 shrink-0 self-start",
                children: [
                  /* @__PURE__ */ i("span", { className: "sr-only", children: "关闭" }),
                  /* @__PURE__ */ i(ct, { className: "size-4" })
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
function Or({
  options: e,
  value: t,
  disabled: n,
  onValueChange: r
}) {
  return /* @__PURE__ */ i(
    la,
    {
      value: t,
      onValueChange: r,
      className: "grid gap-2 sm:grid-cols-2",
      disabled: n,
      children: e.map((o) => /* @__PURE__ */ p(
        "label",
        {
          className: na(
            "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm",
            t === o.id && "border-primary bg-primary/5 text-primary",
            n && "cursor-not-allowed opacity-60"
          ),
          children: [
            /* @__PURE__ */ i(ua, { value: o.id, disabled: n }),
            /* @__PURE__ */ i("span", { children: o.value })
          ]
        },
        o.id
      ))
    }
  );
}
function ma({
  node: e,
  roles: t,
  roleTypes: n,
  currentTeamID: r,
  currentTeamName: o,
  teams: s,
  readonly: a,
  onChangeNode: c
}) {
  const d = Number(e.role_id || e.config?.role_id || 0), m = s.length ? s : Jt({
    currentTeamID: r,
    currentTeamName: o,
    flows: [],
    roles: t,
    teams: s
  }), u = $o(m, d), g = Number(
    e.config?.role_team_id || u?.team_id || r || m[0]?.id || 0
  ), _ = mt(m, g)?.roles ?? [], h = _[0]?.role_type || n[0]?.id || "", k = String(
    e.config?.role_type || u?.role_type || h
  ), x = k ? _.filter((v) => v.role_type === k) : _, P = x.some((v) => v.id === d) ? String(d) : void 0, D = u?.name || "";
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
          const C = Array.isArray(v) ? v[0] ?? "" : v, B = Number(C || r || 0), F = mt(m, B)?.roles?.[0]?.role_type || k;
          c(
            e.node_key,
            j(
              e,
              {
                role_id: 0,
                role_key: "",
                config: {
                  ...e.config ?? {},
                  role_team_id: B,
                  role_id: 0,
                  role_key: "",
                  role_type: F
                }
              },
              "团队角色",
              [D]
            )
          );
        }
      }
    ),
    /* @__PURE__ */ i(
      oe,
      {
        value: k || void 0,
        options: n,
        disabled: a,
        clearable: !1,
        placeholder: "选择角色类型",
        searchPlaceholder: "输入角色类型筛选...",
        onChange: (v) => {
          const C = Array.isArray(v) ? v[0] ?? "" : v;
          c(
            e.node_key,
            j(
              e,
              {
                role_id: 0,
                role_key: "",
                config: {
                  ...e.config ?? {},
                  role_team_id: g,
                  role_id: 0,
                  role_key: "",
                  role_type: C
                }
              },
              "团队角色",
              [D]
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
          j(
            e,
            {
              role_id: 0,
              role_key: "",
              config: {
                ...e.config ?? {},
                role_team_id: g,
                role_id: 0,
                role_key: "",
                role_type: k
              }
            },
            "团队角色",
            [D]
          )
        ),
        onChange: (v) => {
          const C = Array.isArray(v) ? v[0] ?? "" : v, B = x.find(
            (H) => String(H.id) === String(C)
          );
          c(
            e.node_key,
            j(
              e,
              {
                role_id: B?.id || 0,
                role_key: B?.role_key || "",
                config: {
                  ...e.config ?? {},
                  role_team_id: g,
                  role_id: B?.id || 0,
                  role_key: B?.role_key || "",
                  role_type: B?.role_type || k
                }
              },
              B?.name || "团队角色",
              [D]
            )
          );
        }
      }
    )
  ] }) });
}
function ga({
  node: e,
  agents: t,
  agentCates: n,
  readonly: r,
  onChangeNode: o
}) {
  const s = Number(e.agent_id || e.config?.agent_id || 0), a = t.find((c) => c.id === s);
  return /* @__PURE__ */ i(X, { label: "绑定智能体", children: /* @__PURE__ */ i(
    ka,
    {
      agentID: s,
      cateID: Number(e.config?.agent_cate_id || 0),
      agents: t,
      agentCates: n,
      disabled: r,
      onChange: ({ agentID: c, cateID: d }) => {
        const m = t.find((u) => u.id === c);
        o(
          e.node_key,
          j(
            e,
            {
              agent_id: c,
              config: {
                ...e.config ?? {},
                agent_cate_id: d
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
function _a({
  node: e,
  powers: t,
  powerKinds: n,
  readonly: r,
  onChangeNode: o
}) {
  const s = Number(e.power_id || e.config?.power_id || 0), a = t.find((u) => u.id === s), c = n.length ? n : Bo(t), d = String(
    e.config?.power_kind || a?.kind || c[0]?.id || t[0]?.kind || ""
  ), m = d ? t.filter((u) => u.kind === d) : t;
  return /* @__PURE__ */ i(X, { label: "绑定能力", children: /* @__PURE__ */ p("div", { className: "grid gap-2 sm:grid-cols-2", children: [
    /* @__PURE__ */ i(
      oe,
      {
        value: d || void 0,
        options: c.map((u) => ({ id: u.id, value: u.value })),
        disabled: r,
        clearable: !1,
        placeholder: "选择能力类型",
        searchPlaceholder: "输入能力类型筛选...",
        onChange: (u) => {
          const g = Array.isArray(u) ? u[0] ?? "" : u, f = t.find((_) => _.kind === g);
          o(
            e.node_key,
            j(
              e,
              {
                power_id: f?.id || 0,
                config: {
                  ...e.config ?? {},
                  power_kind: g,
                  power_id: f?.id || 0,
                  power_key: f?.key || ""
                }
              },
              f?.name || "能力",
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
        options: m.map((u) => ({
          id: u.id,
          value: u.name || "未命名能力"
        })),
        disabled: r,
        placeholder: "选择能力",
        searchPlaceholder: "输入能力筛选...",
        emptyText: "未找到匹配能力",
        onClear: () => o(
          e.node_key,
          j(
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
        onChange: (u) => {
          const g = Array.isArray(u) ? u[0] ?? "" : u, f = t.find(
            (_) => String(_.id) === String(g)
          );
          o(
            e.node_key,
            j(
              e,
              {
                power_id: f?.id || 0,
                config: {
                  ...e.config ?? {},
                  power_kind: f?.kind || d,
                  power_id: f?.id || 0,
                  power_key: f?.key || ""
                }
              },
              f?.name || "能力",
              [a?.name]
            )
          );
        }
      }
    )
  ] }) });
}
function pa({
  node: e,
  currentTeamID: t,
  currentTeamName: n,
  teams: r,
  readonly: o,
  onChangeNode: s
}) {
  const a = Number(
    e.sub_team_id || e.config?.sub_team_id || t || r[0]?.id || 0
  ), c = r.length ? r : Jt({
    currentTeamID: t,
    currentTeamName: n,
    flows: [],
    roles: [],
    teams: r
  }), d = mt(c, a), m = (d?.flows ?? []).filter(
    (_) => !!_.id
  ), u = Number(
    e.config?.sub_flow_id || e.config?.flow_id || 0
  ), g = m.find(
    (_) => Number(_.id || 0) === u
  ), f = at(d, g);
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
          const h = Array.isArray(_) ? _[0] ?? "" : _, k = mt(c, Number(h)), x = k?.id || t || 0;
          s(
            e.node_key,
            j(
              e,
              {
                sub_team_id: x,
                config: {
                  ...e.config ?? {},
                  sub_team_id: x,
                  release_id: k?.release_id || 0,
                  sub_flow_id: 0,
                  sub_flow_key: ""
                }
              },
              at(k),
              [f]
            )
          );
        }
      }
    ),
    /* @__PURE__ */ i(
      oe,
      {
        value: u ? String(u) : void 0,
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
          j(
            e,
            {
              config: {
                ...e.config ?? {},
                sub_team_id: a,
                release_id: d?.release_id || 0,
                sub_flow_id: 0,
                sub_flow_key: ""
              }
            },
            at(d),
            [f]
          )
        ),
        onChange: (_) => {
          const h = Array.isArray(_) ? _[0] ?? "" : _, k = m.find(
            (x) => String(x.id || "") === String(h)
          );
          s(
            e.node_key,
            j(
              e,
              {
                sub_team_id: a,
                config: {
                  ...e.config ?? {},
                  sub_team_id: a,
                  release_id: d?.release_id || 0,
                  sub_flow_id: k?.id || 0,
                  sub_flow_key: k?.key || ""
                }
              },
              at(d, k),
              [f]
            )
          );
        }
      }
    )
  ] }) });
}
function ba({
  node: e,
  readonly: t,
  onChangeNode: n
}) {
  const r = Qt(e.config?.operator), o = r === "contains" || r === "equals", s = (a) => n(e.node_key, {
    config: {
      ...e.config ?? {},
      ...a
    }
  });
  return /* @__PURE__ */ p(Xt, { children: [
    /* @__PURE__ */ i(X, { label: "判断方式", children: /* @__PURE__ */ i(
      Or,
      {
        options: Wn,
        value: r,
        disabled: t,
        onValueChange: (a) => s({ operator: a })
      }
    ) }),
    o ? /* @__PURE__ */ i(X, { label: "判断值", children: /* @__PURE__ */ i(
      yt,
      {
        value: String(e.config?.value ?? ""),
        disabled: t,
        placeholder: r === "contains" ? "输入要包含的内容" : "输入要完全等于的内容",
        onChange: (a) => s({ value: a.target.value })
      }
    ) }) : null
  ] });
}
function ya({
  node: e,
  knowledgeCates: t,
  knowledgeBases: n,
  readonly: r,
  onChangeNode: o
}) {
  const s = Number(e.config?.knowledge_base_id || 0), a = Fn(n, s), c = t.length ? t : Ta(n), d = Number(
    a?.cate_id || e.config?.knowledge_cate_id || c[0]?.id || n[0]?.cate_id || 0
  ), m = d ? n.filter(
    (f) => Number(f.cate_id || 0) === d
  ) : n, u = Ln(a), g = (f) => o(e.node_key, {
    config: {
      ...z(e.config, ["goal"]),
      ...f
    }
  });
  return /* @__PURE__ */ p(Xt, { children: [
    /* @__PURE__ */ i(X, { label: "知识库", children: /* @__PURE__ */ p("div", { className: "grid gap-2 sm:grid-cols-2", children: [
      /* @__PURE__ */ i(
        oe,
        {
          value: d ? String(d) : void 0,
          options: c.map((f) => ({
            id: f.id,
            value: Pa(f)
          })),
          disabled: r,
          clearable: !1,
          placeholder: "选择分类",
          searchPlaceholder: "输入分类筛选...",
          emptyText: "未找到知识库分类",
          onChange: (f) => {
            const _ = Array.isArray(f) ? f[0] ?? "" : f, h = Number(_ || 0), k = a && Number(a.cate_id || 0) === h;
            o(
              e.node_key,
              j(
                e,
                {
                  config: {
                    ...z(e.config, ["goal"]),
                    knowledge_cate_id: h,
                    knowledge_base_id: k ? s : 0
                  }
                },
                k ? u : "知识库",
                [u]
              )
            );
          }
        }
      ),
      /* @__PURE__ */ i(
        oe,
        {
          value: m.some((f) => Number(f.id) === s) ? String(s) : void 0,
          options: m.map((f) => ({
            id: f.id,
            value: Ia(f)
          })),
          disabled: r,
          placeholder: "选择知识库",
          searchPlaceholder: "输入知识库筛选...",
          emptyText: "未找到知识库",
          onClear: () => o(
            e.node_key,
            j(
              e,
              {
                config: {
                  ...z(e.config, ["goal"]),
                  knowledge_cate_id: d,
                  knowledge_base_id: 0
                }
              },
              "知识库",
              [u]
            )
          ),
          onChange: (f) => {
            const _ = Array.isArray(f) ? f[0] ?? "" : f, h = Number(_ || 0), k = Fn(n, h);
            o(
              e.node_key,
              j(
                e,
                {
                  config: {
                    ...z(e.config, ["goal"]),
                    knowledge_cate_id: Number(
                      k?.cate_id || d || 0
                    ),
                    knowledge_base_id: h
                  }
                },
                Ln(k),
                [u]
              )
            );
          }
        }
      )
    ] }) }),
    /* @__PURE__ */ i(X, { label: "查询内容", children: /* @__PURE__ */ i(
      Wt,
      {
        value: String(e.config?.query ?? e.config?.goal ?? ""),
        disabled: r,
        placeholder: "填写从知识库获取内容的提示词；留空时使用节点名称",
        onChange: (f) => g({ query: f.target.value })
      }
    ) }),
    /* @__PURE__ */ i(X, { label: "召回数量", children: /* @__PURE__ */ p("div", { className: "space-y-1", children: [
      /* @__PURE__ */ i(
        yt,
        {
          type: "number",
          min: 0,
          value: Number(e.config?.retrieve_limit || 0) || "",
          disabled: r,
          placeholder: "使用知识库默认值",
          onChange: (f) => g({ retrieve_limit: Number(f.target.value || 0) })
        }
      ),
      /* @__PURE__ */ i("div", { className: "text-xs text-muted-foreground", children: "每次检索从知识库取回的候选内容条数；留空使用知识库默认值，数量越大上下文越全，也会占用更多上下文。" })
    ] }) })
  ] });
}
function ha({
  node: e,
  assetCates: t,
  readonly: n,
  onChangeNode: r
}) {
  const o = Number(
    e.asset_cate_id || e.config?.asset_cate_id || 0
  ), s = Yt(t, o);
  return /* @__PURE__ */ i(X, { label: "资产类型", children: /* @__PURE__ */ i(
    oe,
    {
      value: o ? String(o) : void 0,
      options: t.map((a) => ({
        id: a.id,
        value: Ra(a)
      })),
      disabled: n,
      placeholder: "选择资产类型",
      searchPlaceholder: "输入资产类型筛选...",
      emptyText: "未找到资产类型",
      onClear: () => r(
        e.node_key,
        j(
          e,
          {
            asset_cate_id: 0,
            config: {
              ...e.config ?? {},
              asset_cate_id: 0
            }
          },
          Ve(e.type),
          [Ve(e.type, s)]
        )
      ),
      onChange: (a) => {
        const c = Array.isArray(a) ? a[0] ?? "" : a, d = Number(c || 0), m = Yt(t, d);
        r(
          e.node_key,
          j(
            e,
            {
              asset_cate_id: d,
              config: {
                ...e.config ?? {},
                asset_cate_id: d
              }
            },
            Ve(e.type, m),
            [Ve(e.type, s)]
          )
        );
      }
    }
  ) });
}
function ka({
  agentID: e,
  cateID: t,
  agents: n,
  agentCates: r,
  disabled: o = !1,
  onChange: s
}) {
  const a = en(n), c = a.find((g) => g.id === e), d = r.length ? Zn(r) : zo(a), m = String(
    c?.cate_id || t || d[0]?.id || ""
  ), u = m ? a.filter(
    (g) => String(g.cate_id || "") === m
  ) : a;
  return /* @__PURE__ */ p("div", { className: "grid grid-cols-2 gap-2", children: [
    /* @__PURE__ */ i(
      oe,
      {
        value: m || void 0,
        options: d.map((g) => ({
          id: g.id,
          value: Ea(g)
        })),
        disabled: o,
        clearable: !1,
        placeholder: "选择分类",
        searchPlaceholder: "输入分类筛选...",
        emptyText: "未找到智能体分类",
        onChange: (g) => {
          const f = Array.isArray(g) ? g[0] ?? "" : g, _ = a.find(
            (k) => k.id === e
          ), h = _ && String(_.cate_id || "") === String(f);
          s({
            agentID: h ? Number(e || 0) : 0,
            cateID: Number(f)
          });
        }
      }
    ),
    /* @__PURE__ */ i(
      oe,
      {
        value: e ? String(e) : void 0,
        options: u.map((g) => ({
          id: g.id,
          value: g.name || "未命名智能体"
        })),
        disabled: o,
        clearable: !1,
        placeholder: "选择智能体",
        searchPlaceholder: "输入智能体筛选...",
        emptyText: "未找到智能体",
        onChange: (g) => {
          const f = Array.isArray(g) ? g[0] ?? "" : g, _ = a.find((h) => String(h.id) === f);
          s({
            agentID: Number(f),
            cateID: Number(_?.cate_id || m || 0)
          });
        }
      }
    )
  ] });
}
function wa(e) {
  return e.kind === "flow" ? "编辑工作流" : e.kind === "node" ? "编辑节点" : e.kind === "flow_edge" ? "编辑工作流关系" : "编辑节点关系";
}
function xa(e) {
  return e?.kind === "flow" ? "删除工作流" : e?.kind === "flow_edge" || e?.kind === "node_edge" ? "删除关系" : "删除图中项目";
}
function va(e) {
  return e?.kind === "flow" ? "保存后该工作流会被停用，不做物理删除，已发布或历史运行数据不会被直接清掉。" : e?.kind === "flow_edge" || e?.kind === "node_edge" ? "删除后会移除这条关系线。保存前仍只在当前编辑状态中生效。" : "删除后会同时移除关联连线。保存前仍只在当前编辑状态中生效。";
}
function Na(e, t, n = []) {
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
  ), a = Yt(n, s), c = (d, m = Ca(t, a)) => j(e, d, m);
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
      operator: Qt(e.config?.operator)
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
const Sa = /* @__PURE__ */ new Set([
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
function j(e, t, n, r = []) {
  const o = String(n || "").trim();
  return !o || !Da(e.name, r) ? t : { ...t, name: o };
}
function Da(e, t = []) {
  const n = String(e || "").trim();
  return Aa(n) || Sa.has(n) || n.startsWith("读取：") || n.startsWith("保存：") || n.startsWith("知识库：") ? !0 : t.some(
    (r) => String(r || "").trim() !== "" && String(r || "").trim() === n
  );
}
function Aa(e) {
  const t = String(e || "").trim();
  if (!t || t === "节点")
    return !0;
  if (!t.startsWith("节点"))
    return !1;
  const n = t.slice(2);
  return n !== "" && /^\d+$/.test(n);
}
function Ca(e, t) {
  return e === "context" || e === "save" ? Ve(e, t) : e === "agent" ? "智能体" : e === "role" ? "团队角色" : e === "power" ? "能力" : e === "team" ? "团队工作流" : e === "knowledge" ? "知识库" : e === "condition" ? "条件判断" : e === "merge" ? "合并结果" : e === "human_approval" ? "人工确认" : String(e || "").trim();
}
function Ve(e, t) {
  const n = String(t?.name || "").trim();
  return e === "context" ? n ? `读取：${n}` : "读取上下文" : n ? `保存：${n}` : "保存结果";
}
function Yt(e, t) {
  return e.find((n) => Number(n.id) === Number(t));
}
function Fn(e, t) {
  return e.find(
    (n) => Number(n.id) === Number(t)
  );
}
function Ta(e) {
  return Array.from(
    new Set(
      e.map((n) => Number(n.cate_id || 0)).filter(Boolean)
    )
  ).map((n) => ({
    id: n,
    value: `分类${n}`
  }));
}
function at(e, t) {
  const n = String(e?.name || "").trim(), r = String(t?.name || t?.key || "").trim();
  return n && r ? `${n} / ${r}` : n || "团队工作流";
}
function Ea(e) {
  return String(e.value || e.name || e.id);
}
function Ra(e) {
  return String(e.name || e.id);
}
function Ia(e) {
  return String(e.name || e.id);
}
function Pa(e) {
  return String(e.value || e.name || e.id);
}
function Ln(e) {
  const t = String(e?.name || "").trim();
  return t ? `知识库：${t}` : "知识库";
}
function X({ label: e, children: t }) {
  return /* @__PURE__ */ p("div", { className: "mb-4 space-y-2 text-sm", children: [
    /* @__PURE__ */ i("div", { className: "font-medium", children: e }),
    t
  ] });
}
const Ce = jn.request, Bt = kt.cn, we = Vt.Button, Mn = Xr.ConfirmDialog, Oa = Ft.AssistantTaskPopover;
function md({ item: e }) {
  const t = e.meta ?? {}, n = Te(() => $a(), []), [r, o] = I({}), [s, a] = I(!1), [c, d] = I(!1), [m, u] = I("flow"), [g, f] = I(""), [_, h] = I(null), [k, x] = I(null), [P, D] = I(!1), [v, C] = I(null), [B, H] = I(!1), [F, N] = I(""), [O, Q] = I(!1), [Ie, Pe] = I("team"), [Ke, Oe] = I(""), [ie, ue] = I(!1), [U, W] = I(null), [se, te] = I(""), [$e, ee] = I(() => /* @__PURE__ */ new Set()), ze = String(t.workspaceApi || "/bot/admin/team/workspace_data"), Be = String(t.saveFlowApi || "/bot/admin/team/save_flow_graph"), Qe = String(t.saveNodeApi || "/bot/admin/team/save_node_graph"), At = String(t.runTeamApi || "/bot/admin/team/run_team"), Ct = String(t.runFlowApi || "/bot/admin/team/run_flow"), et = String(
    t.runStatusApi || "/bot/admin/team/run_status"
  ), tt = String(t.streamApi || "/bot/admin/team/stream"), Tt = String(t.approvalApi || "/bot/admin/team/submit_approval"), Et = String(
    t.interactionApi || "/bot/admin/team/submit_interaction"
  ), He = String(t.paramApi || "/bot/admin/energon/power_params"), Rt = tn(
    r.team?.publish_status
  ), De = Jn(r.team), fe = r.flows ?? [], nt = r.flow_edges ?? [], me = fe.find((l) => l.key === g), he = g ? r.nodes_by_flow?.[g] ?? [] : [], Fe = g ? r.edges_by_flow?.[g] ?? [] : [], y = r.roles ?? [], w = r.agents ?? [], S = r.agent_cates ?? [], M = r.asset_cates ?? [], V = r.knowledge_cates ?? [], ae = r.knowledge_bases ?? [], le = r.teams ?? [], Ue = r.role_types?.length ? r.role_types : Hn, ge = Te(
    () => Jt({
      currentTeamID: n,
      currentTeamName: String(r.team?.name || "当前团队"),
      flows: fe,
      roles: y,
      teams: le
    }),
    [fe, y, n, le, r.team?.name]
  ), rt = r.powers ?? [], It = r.power_kinds ?? [], dn = Ko(
    r.node_types?.length ? r.node_types : wt
  ), $r = r.edge_conditions?.length ? r.edge_conditions : Un, ke = m === "node" && Ie === "flow" && !!(ie || U), L = De || ke, ot = Te(
    () => Ni(U, $e),
    [U, $e]
  ), zr = Te(
    () => ke ? Ei(
      U,
      he,
      Fe,
      ie,
      ot
    ) : null,
    [
      Fe,
      he,
      U,
      ie,
      ke,
      ot
    ]
  ), Le = K((l) => {
    const b = Fo(l);
    o(b), f(
      (T) => b.flows?.some((q) => q.key === T) ? T : b.flows?.[0]?.key || ""
    );
  }, []), _e = K(() => De ? ($.info("团队已发布，请先进入编辑草稿后再修改"), !1) : !0, [De]), cn = K(async () => {
    if (n) {
      a(!0);
      try {
        const l = await Ce(ze, "get", { team_id: n });
        if (l.code !== 0)
          throw new Error(l.message || "加载团队失败");
        Le(l.data);
      } catch (l) {
        $.error(l instanceof Error ? l.message : "加载团队失败");
      } finally {
        a(!1);
      }
    }
  }, [Le, n, ze]);
  Xe(() => {
    cn();
  }, [cn]);
  const Pt = async () => {
    if (!n || !_e())
      return !1;
    d(!0);
    try {
      const l = await Ce(Be, "post", {
        team_id: n,
        flows: fe,
        edges: nt
      });
      if (l.code !== 0)
        throw new Error(l.message || "保存工作流图失败");
      return Le(l.data), $.success("工作流配置已保存"), !0;
    } catch (l) {
      return $.error(l instanceof Error ? l.message : "保存工作流图失败"), !1;
    } finally {
      d(!1);
    }
  }, ln = async () => {
    if (!_e() || !await Pt())
      return !1;
    if (!me?.id)
      return !0;
    d(!0);
    try {
      const b = await Ce(Qe, "post", {
        flow_id: me.id,
        nodes: Ho(he),
        edges: Fe
      });
      if (b.code !== 0)
        throw new Error(b.message || "保存节点图失败");
      return Le(b.data), $.success("节点视图已保存"), !0;
    } catch (b) {
      return $.error(b instanceof Error ? b.message : "保存节点图失败"), !1;
    } finally {
      d(!1);
    }
  }, Br = async () => {
    if (!(!n || c)) {
      d(!0);
      try {
        const l = await Ce(Be, "post", {
          team_id: n,
          action: "publish"
        });
        if (l.code !== 0)
          throw new Error(l.message || "发布失败");
        Le(l.data), u("flow"), h(null), x(null), D(!1), $.success("团队已发布");
      } catch (l) {
        $.error(l instanceof Error ? l.message : "发布失败");
      } finally {
        d(!1);
      }
    }
  }, Fr = async () => {
    if (!(!n || c)) {
      d(!0);
      try {
        const l = await Ce(Be, "post", {
          team_id: n,
          action: "edit_draft"
        });
        if (l.code !== 0)
          throw new Error(l.message || "进入编辑草稿失败");
        Le(l.data), $.success("已进入编辑草稿");
      } catch (l) {
        $.error(l instanceof Error ? l.message : "进入编辑草稿失败");
      } finally {
        d(!1);
      }
    }
  }, Lr = (l) => {
    Pe(l), Oe(""), W(null), ee(/* @__PURE__ */ new Set()), Q(!0);
  }, un = async (l, b, T = [], q) => {
    const We = b.trim();
    if (!We) {
      $.error("请输入调试要求或目标");
      return;
    }
    if (l === "flow" && !me?.id) {
      $.error("请先选择一个已保存的工作流");
      return;
    }
    const Ye = fi(We, T);
    Pe(l), Oe(We), Q(l === "team"), D(!1), C(null), x(null), te(""), ee(/* @__PURE__ */ new Set()), ue(!0), W(mi(Ye));
    try {
      if (!De && !(l === "flow" ? await ln() : await Pt())) {
        W(null);
        return;
      }
      if (q?.aborted)
        return;
      const pe = {
        team_id: n,
        release_id: 0,
        debug_current_graph: !0,
        input: Ye
      };
      l === "flow" && (pe.flow_id = me?.id);
      const Y = await Ce(
        l === "team" ? At : Ct,
        "post",
        pe
      );
      if (Y.code !== 0)
        throw new Error(Y.message || "启动调试失败");
      const Z = gi(Y.data, pe.input);
      W(Z);
      const Ae = await Sn(
        tt,
        et,
        Z,
        W,
        q
      );
      if (q?.aborted)
        return;
      W(Ae);
    } catch (pe) {
      const Y = pe instanceof Error ? pe.message : "调试失败";
      W(
        (Z) => Z ? { ...Z, error: Y } : { error: Y }
      ), $.error(Y);
    } finally {
      ue(!1);
    }
  }, Mr = async () => {
    await un(Ie, Ke);
  }, Ot = async (l, b) => {
    if (!l?.id)
      return;
    const T = String(l.id), q = String(b.data.decision || "approved"), We = String(b.data.comment || b.text || ""), Ye = U, pe = Ai(
      Ye,
      l,
      b
    );
    ee((Y) => {
      const Z = new Set(Y);
      return Z.add(T), Z;
    }), W(pe), ue(!0);
    try {
      const Y = l.kind === "interaction", Z = await Ce(
        Y ? Et : Tt,
        "post",
        Y ? {
          run_id: l.runID,
          node_run_id: l.nodeRunID,
          interaction_id: l.id,
          data: b.data
        } : {
          approval_id: l.id,
          decision: q,
          comment: We,
          data: b.data
        }
      );
      if (Z.code !== 0)
        throw new Error(Z.message || "提交反馈失败");
      const Ae = Ci(
        pe,
        Z.data
      );
      W(Ae), $.success("已提交反馈，流程继续执行");
      const mn = await Sn(
        tt,
        et,
        Ae,
        W
      );
      W(mn);
    } catch (Y) {
      ee((Z) => {
        const Ae = new Set(Z);
        return Ae.delete(T), Ae;
      }), W(Ye), $.error(Y instanceof Error ? Y.message : "提交反馈失败");
    } finally {
      ue(!1);
    }
  }, jr = () => {
    if (ie) {
      $.info("调试执行中，完成后再退出查看模式");
      return;
    }
    W(null), te(""), ee(/* @__PURE__ */ new Set()), h(null);
  }, Gr = m === "flow" ? Pt : ln, qr = (l) => {
    _e() && (h(l), D(!0));
  }, Kr = (l) => {
    f(l.key), h(null), u("node");
  }, fn = () => {
    if (!_e())
      return;
    const l = `flow_${Date.now()}`;
    o((b) => ({
      ...b,
      flows: [
        ...b.flows ?? [],
        Qn(b.flows ?? [], l)
      ]
    })), f(l), u("flow"), h({ kind: "flow", key: l }), D(!0);
  }, Hr = (l) => {
    _e() && (h(l), C(l));
  }, Ur = () => {
    if (!_e() || !v)
      return;
    const l = v.kind === "flow" && v.key === g, b = l ? (r.flows ?? []).find((T) => T.key !== v.key) : null;
    o(
      (T) => ti(T, v, g)
    ), l && (f(b?.key ?? ""), b || u("flow")), h(null), C(null), D(!1), $.success(
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
            /* @__PURE__ */ i("div", { className: "mt-2 inline-flex rounded bg-background px-2 py-0.5 text-xs text-muted-foreground", children: Go(Rt) })
          ] }),
          /* @__PURE__ */ i("div", { className: "border-b p-2", children: /* @__PURE__ */ p(
            "button",
            {
              type: "button",
              className: Bt(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm",
                m === "flow" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              ),
              onClick: () => {
                u("flow"), h(null), x(null);
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
              we,
              {
                size: "icon",
                variant: "ghost",
                disabled: L,
                onClick: fn,
                children: /* @__PURE__ */ i(_n, { className: "size-4" })
              }
            )
          ] }),
          /* @__PURE__ */ i(
            "div",
            {
              className: "min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-2 pb-3 pr-1",
              style: { scrollbarGutter: "stable" },
              children: fe.map((l) => /* @__PURE__ */ p(
                "div",
                {
                  draggable: !L,
                  "aria-grabbed": F === l.key,
                  className: Bt(
                    "mb-1 flex w-full select-none items-center gap-1 rounded-md",
                    xn(m, g, l) ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    F === l.key && "opacity-60",
                    ke && "cursor-not-allowed opacity-60"
                  ),
                  onDragStart: (b) => {
                    if (L) {
                      b.preventDefault();
                      return;
                    }
                    N(l.key), b.dataTransfer.effectAllowed = "move", b.dataTransfer.setData("text/plain", l.key);
                  },
                  onDragOver: (b) => {
                    !L && F && F !== l.key && (b.preventDefault(), b.dataTransfer.dropEffect = "move");
                  },
                  onDrop: (b) => {
                    b.preventDefault(), !(L || !F || F === l.key) && (o(
                      (T) => Qo(T, F, l.key)
                    ), N(""));
                  },
                  onDragEnd: () => N(""),
                  children: [
                    /* @__PURE__ */ p(
                      "button",
                      {
                        type: "button",
                        disabled: ke,
                        className: "flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left text-sm",
                        onClick: () => Kr(l),
                        children: [
                          /* @__PURE__ */ i(dt, { className: "size-4 shrink-0" }),
                          /* @__PURE__ */ i("span", { className: "min-w-0 flex-1 truncate", children: l.name || l.key })
                        ]
                      }
                    ),
                    /* @__PURE__ */ i(
                      "button",
                      {
                        type: "button",
                        disabled: L,
                        className: Bt(
                          "mr-2 inline-flex size-6 items-center justify-center rounded hover:bg-background/70",
                          xn(m, g, l) && "hover:bg-primary-foreground/15",
                          L && "cursor-not-allowed opacity-60"
                        ),
                        onClick: (b) => {
                          b.preventDefault(), b.stopPropagation(), _e() && (f(l.key), h({ kind: "flow", key: l.key }), D(!0));
                        },
                        children: /* @__PURE__ */ i(ut, { className: "size-3.5" })
                      }
                    )
                  ]
                },
                l.key
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
                  we,
                  {
                    size: "sm",
                    variant: "outline",
                    disabled: L,
                    onClick: () => {
                      if (m === "flow") {
                        fn();
                        return;
                      }
                      if (!me?.id) {
                        $.info("请先保存工作流，再新增节点");
                        return;
                      }
                      Wo(g, o);
                    },
                    children: [
                      /* @__PURE__ */ i(_n, { className: "size-4" }),
                      m === "flow" ? "新增工作流" : "新增节点"
                    ]
                  }
                ),
                k ? /* @__PURE__ */ p(
                  we,
                  {
                    size: "sm",
                    variant: "default",
                    onClick: () => x(null),
                    children: [
                      /* @__PURE__ */ i(ct, { className: "size-4" }),
                      "取消连线"
                    ]
                  }
                ) : null,
                /* @__PURE__ */ p(
                  we,
                  {
                    size: "sm",
                    variant: "outline",
                    disabled: c || L,
                    onClick: Gr,
                    children: [
                      c ? /* @__PURE__ */ i(Ee, { className: "size-4 animate-spin" }) : /* @__PURE__ */ i(Yr, { className: "size-4" }),
                      "保存"
                    ]
                  }
                ),
                De ? /* @__PURE__ */ p(
                  we,
                  {
                    size: "sm",
                    variant: "outline",
                    disabled: c,
                    onClick: () => {
                      Fr();
                    },
                    children: [
                      /* @__PURE__ */ i(ut, { className: "size-4" }),
                      "编辑草稿"
                    ]
                  }
                ) : /* @__PURE__ */ p(
                  we,
                  {
                    size: "sm",
                    variant: "outline",
                    disabled: c || L,
                    onClick: () => H(!0),
                    children: [
                      c ? /* @__PURE__ */ i(Ee, { className: "size-4 animate-spin" }) : /* @__PURE__ */ i(Wr, { className: "size-4" }),
                      "发布"
                    ]
                  }
                ),
                m === "flow" ? /* @__PURE__ */ p(
                  we,
                  {
                    size: "sm",
                    variant: "outline",
                    disabled: ie,
                    onClick: () => Lr("team"),
                    children: [
                      /* @__PURE__ */ i(gn, { className: "size-4" }),
                      "调试"
                    ]
                  }
                ) : null,
                m === "node" && me ? /* @__PURE__ */ i(
                  Oa,
                  {
                    title: ke ? "重新调试工作流" : "调试工作流",
                    description: "输入本次调试目标，可添加参考资源；开始后会锁定画布并按节点顺序展示执行路径。",
                    triggerLabel: ke ? "重新调试" : "调试工作流",
                    triggerVariant: "outline",
                    triggerSize: "sm",
                    submitLabel: "开始调试",
                    loadingText: "启动调试",
                    disabled: ie || !me?.id,
                    textareaPlaceholder: "输入这次调试要完成的目标、输入材料或约束...",
                    onSubmit: async ({
                      instruction: l,
                      references: b,
                      signal: T,
                      setStatus: q
                    }) => l.trim() ? (q("正在启动工作流调试"), un("flow", l, b, T), !0) : ($.error("请输入调试要求或目标"), !1)
                  }
                ) : null,
                ke ? /* @__PURE__ */ i(
                  we,
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
                _s,
                {
                  view: m,
                  flows: fe,
                  flowEdges: nt,
                  nodes: he,
                  nodeEdges: Fe,
                  edgeConditions: $r,
                  selected: _,
                  connect: k,
                  readonly: L,
                  nodeTypes: dn,
                  executionState: zr,
                  paramApi: He,
                  onSelect: h,
                  onConnect: x,
                  onOpenNodeResult: (l) => te(l),
                  onSubmitApproval: (l, b) => {
                    Ot(l, b);
                  },
                  onEdit: qr,
                  onDelete: Hr,
                  onFlowConnect: (l, b) => L ? void 0 : o((T) => nr(T, l, b)),
                  onFlowConnectNew: (l, b) => {
                    if (!_e())
                      return;
                    const T = `flow_${Date.now()}`;
                    o(
                      (q) => Vo(q, l, T, b)
                    ), h({ kind: "flow", key: T });
                  },
                  onNodeConnect: (l, b) => L ? void 0 : o(
                    (T) => rr(T, g, l, b)
                  ),
                  onNodeConnectNew: (l, b) => {
                    if (!_e() || !g)
                      return;
                    const T = `node_${Date.now()}`;
                    o(
                      (q) => Zo(
                        q,
                        g,
                        l,
                        T,
                        b
                      )
                    ), h({ kind: "node", key: T });
                  },
                  onMove: (l, b, T) => L ? void 0 : o(
                    (q) => l === "flow" ? vn(q, b, { position: T }) : Nn(q, g, b, { position: T })
                  ),
                  onChangeNodeEdge: (l, b) => L ? void 0 : o(
                    (T) => ei(T, g, l, b)
                  )
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ i(
          fa,
          {
            open: P,
            onOpenChange: D,
            selected: _,
            flows: fe,
            nodes: he,
            agents: w,
            agentCates: S,
            assetCates: M,
            knowledgeCates: V,
            knowledgeBases: ae,
            currentTeamID: n,
            currentTeamName: String(r.team?.name || "当前团队"),
            roles: y,
            roleTypes: Ue,
            teamBindingOptions: ge,
            powers: rt,
            powerKinds: It,
            nodeTypes: dn,
            readonly: L,
            onChangeFlow: (l, b) => L ? void 0 : o((T) => vn(T, l, b)),
            onChangeNode: (l, b) => L ? void 0 : o(
              (T) => Nn(T, g, l, b)
            )
          }
        ),
        /* @__PURE__ */ i(
          Zs,
          {
            open: !!se,
            nodeKey: se,
            nodes: he,
            result: U,
            approval: se ? ot[se] : void 0,
            paramApi: He,
            onOpenChange: (l) => !l && te(""),
            onSubmitApproval: (l, b) => {
              Ot(l, b);
            }
          }
        ),
        /* @__PURE__ */ i(
          Ys,
          {
            open: O,
            target: Ie,
            prompt: Ke,
            running: ie,
            result: U,
            paramApi: He,
            pendingApprovalsByNodeKey: ot,
            onOpenChange: Q,
            onPromptChange: Oe,
            onRun: Mr,
            onSubmitApproval: (l, b) => {
              Ot(l, b);
            }
          }
        ),
        /* @__PURE__ */ i(
          Mn,
          {
            open: B,
            onOpenChange: H,
            title: "发布",
            desc: "确定要发布吗？系统会校验工作流编排并生成可运行版本。",
            confirmText: "发布",
            disabled: c,
            isLoading: c,
            handleConfirm: () => {
              H(!1), Br();
            }
          }
        ),
        /* @__PURE__ */ i(
          Mn,
          {
            open: !!v,
            onOpenChange: (l) => !l && C(null),
            title: xa(v),
            desc: va(v),
            confirmText: "删除",
            destructive: !0,
            handleConfirm: Ur
          }
        )
      ]
    }
  ) : /* @__PURE__ */ i("div", { className: "rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive", children: "缺少 team_id，无法进入团队工作流配置。" });
}
function $a() {
  if (typeof window > "u") return 0;
  const e = new URLSearchParams(window.location.search);
  return Number(e.get("team_id") || e.get("id") || 0);
}
export {
  md as ShowTeamWorkspace
};
