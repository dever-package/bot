import { s as m, a as i, d as r, r as t } from "./site-config-C63CM9jT.js";
import { d as w } from "./file-kind-CYMG3EzQ.js";
import { n as S, f as C, b as T } from "./power-icon-DzGqVPMs.js";
import { r as A, i as R } from "./preloadable-Bomi5PEU.js";
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/components/agent/stream-request-params"]);
const _ = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!_ || Object.keys(_).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const f = _.joinSiteApi, l = _.request, p = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!p || Object.keys(p).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const j = p.normalizePowerParamConfig, M = w(), $ = w(), z = w();
function U(e = 0, a = "") {
  const n = JSON.stringify({ requestScopeKey: a, teamID: e });
  return M(n, async () => {
    const s = await l(f("workbench/catalog"), "get", {
      team_id: e || void 0
    }), o = m(s, "加载团队工作区失败"), g = i(o.teams).map(y).filter(c), u = y(o.team), d = u.id ? {
      ...u,
      projectEnabled: !!o.project_enabled
    } : null, b = i(o.power_cates).map(S).filter(c), P = i(o.powers).map(k).filter(c);
    return {
      teams: g,
      team: d,
      releaseID: r(o.release?.id),
      workspaceBodyID: r(o.workspace?.body_id),
      projectEnabled: !!o.project_enabled,
      powers: C(
        T(P, b, (q) => q.cateID)
      ),
      powerCategories: b,
      roles: i(o.roles).map(K).filter(c),
      assetCates: i(o.asset_cates).map(N).filter(c)
    };
  });
}
async function G(e = 20) {
  const a = await l(f("system_message/list"), "get", {
    limit: e
  }), n = m(a, "加载系统消息失败");
  return i(n.items).map(x).filter(c);
}
function H(e) {
  return E({
    api: F("chat_config", e),
    cacheKey: `workbench:${e.teamID}:${e.roleID}`
  });
}
function E(e) {
  const a = e.cacheKey;
  return $(a, async () => {
    const n = await l(e.api, "get"), s = m(n, "加载对话配置失败"), o = i(s.model_sources).map((d) => ({
      id: r(d?.target_id || d?.id),
      name: A(
        d?.service_name,
        d?.name,
        "未命名模型"
      )
    })).filter(c), g = r(s.model_source_rule, 1), u = R(g) ? r(s.selected_model_target_id, o[0]?.id || 0) : 0;
    return {
      modelSourceRule: g,
      modelSources: o,
      selectedModelTargetID: u,
      toolsEnabled: h(s.tools_enabled),
      tools: i(s.tools).map(B).filter(c)
    };
  });
}
function Q(e) {
  return W({
    api: D("power_form"),
    cacheKey: `workbench:${e.teamID}`,
    teamPowerID: e.teamPowerID,
    sourceTargetID: e.sourceTargetID,
    requestScope: { team_id: e.teamID }
  });
}
function W(e) {
  const a = `${e.cacheKey}:${e.teamPowerID}:${e.sourceTargetID || 0}`;
  return z(a, async () => {
    const n = await l(e.api, "get", {
      ...e.requestScope || {},
      team_power_id: e.teamPowerID,
      source_target_id: e.sourceTargetID || void 0
    });
    return j(m(n, "加载工具参数失败"));
  });
}
function D(e) {
  return f(`workbench/${e}`);
}
function F(e, a) {
  const n = new URLSearchParams({ team_id: String(a.teamID) });
  a.roleID && n.set("role_id", String(a.roleID));
  const s = D(e);
  return `${s}${s.includes("?") ? "&" : "?"}${n.toString()}`;
}
async function X(e) {
  return I("chat_save_asset", {
    team_id: e.teamID,
    role_id: e.roleID,
    message_id: e.messageID,
    artifact_id: e.artifactID || void 0,
    document_id: e.documentID || void 0,
    target_asset_id: e.targetAssetID || void 0,
    name: e.name?.trim() || void 0
  });
}
async function Y(e) {
  return I("power_save_asset", {
    team_id: e.teamID,
    team_power_id: e.teamPowerID,
    request_id: e.requestID,
    target_asset_id: e.targetAssetID || void 0,
    name: e.name?.trim() || void 0
  });
}
async function I(e, a) {
  const n = await l(D(e), "post", a), s = m(n, "保存资产失败"), o = r(s.asset?.id);
  if (!o)
    throw new Error("保存资产结果为空");
  return o;
}
function y(e) {
  return {
    id: r(e?.id),
    name: t(e?.name) || "未命名团队",
    description: t(e?.description),
    projectEnabled: h(e?.project_enabled)
  };
}
function k(e) {
  return {
    id: r(e?.id),
    powerID: r(e?.power_id),
    cateID: r(e?.cate_id),
    name: t(e?.name || e?.key) || "未命名能力",
    key: t(e?.key),
    icon: t(e?.icon),
    kind: t(e?.kind),
    outputType: t(e?.output_type || e?.output)
  };
}
function B(e) {
  return k({
    ...e,
    id: e?.team_power_id
  });
}
function K(e) {
  return {
    id: r(e?.id),
    name: t(e?.name) || "未命名角色",
    roleType: t(e?.role_type),
    assignment: t(e?.assignment),
    agentID: r(e?.agent_id),
    agentKey: t(e?.agent_key),
    agentName: t(e?.agent_name),
    openingEnabled: !!e?.opening_enabled
  };
}
function N(e) {
  return {
    id: r(e?.id),
    name: t(e?.name) || "未命名分类",
    kind: t(e?.kind) || "text",
    cardinality: t(e?.cardinality) || "single"
  };
}
function x(e) {
  return {
    id: r(e?.id),
    title: t(e?.title) || "系统消息",
    content: t(e?.content),
    url: t(e?.url),
    pinned: !!e?.pinned,
    publishedAt: t(e?.published_at)
  };
}
function c(e) {
  return e.id > 0;
}
function h(e) {
  return e !== !1 && Number(e || 1) !== 2;
}
export {
  Y as a,
  W as b,
  H as c,
  Q as d,
  X as e,
  G as f,
  U as g,
  E as l,
  F as s,
  D as w
};
