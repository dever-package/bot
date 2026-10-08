import { s as m, a as i, r as t, c as r } from "./site-config-cvPYHSmK.js";
import { b as f, r as q, i as S } from "./preloadable-B6OSmL0f.js";
import { n as C, f as T, b as A } from "./power-icon-Dfs_ppQs.js";
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/components/agent/stream-request-params"]);
const _ = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!_ || Object.keys(_).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const D = _.joinSiteApi, l = _.request, p = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!p || Object.keys(p).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const R = p.normalizePowerParamConfig, j = f(), M = f(), $ = f();
function J(e = 0, a = "") {
  const n = JSON.stringify({ requestScopeKey: a, teamID: e });
  return j(n, async () => {
    const s = await l(D("workbench/catalog"), "get", {
      team_id: e || void 0
    }), o = m(s, "加载团队工作区失败"), g = i(o.teams).map(y).filter(c), u = y(o.team), w = u.id ? {
      ...u,
      projectEnabled: !!o.project_enabled
    } : null, d = i(o.power_cates).map(C).filter(c), k = i(o.powers).map(h).filter(c);
    return {
      teams: g,
      team: w,
      releaseID: r(o.release?.id),
      workspaceBodyID: r(o.workspace?.body_id),
      projectEnabled: !!o.project_enabled,
      powers: T(
        A(k, d, (P) => P.cateID)
      ),
      powerCategories: d,
      roles: i(o.roles).map(B).filter(c),
      assetCates: i(o.asset_cates).map(K).filter(c)
    };
  });
}
async function U(e = 20) {
  const a = await l(D("system_message/list"), "get", {
    limit: e
  }), n = m(a, "加载系统消息失败");
  return i(n.items).map(N).filter(c);
}
function G(e) {
  return z({
    api: W("chat_config", e),
    cacheKey: `workbench:${e.teamID}:${e.roleID}`
  });
}
function z(e) {
  const a = e.cacheKey;
  return M(a, async () => {
    const n = await l(e.api, "get"), s = m(n, "加载对话配置失败"), o = i(s.model_sources).map((d) => ({
      id: r(d?.target_id || d?.id),
      name: q(
        d?.service_name,
        d?.name,
        "未命名模型"
      )
    })).filter(c), g = r(s.model_source_rule, 1), u = S(g) ? r(s.selected_model_target_id, o[0]?.id || 0) : 0, w = i(s.tools).map(F).filter(c);
    return {
      modelSourceRule: g,
      modelSources: o,
      selectedModelTargetID: u,
      toolsEnabled: w.length > 0,
      tools: w
    };
  });
}
function H(e) {
  return E({
    api: b("power_form"),
    cacheKey: `workbench:${e.teamID}`,
    teamPowerID: e.teamPowerID,
    sourceTargetID: e.sourceTargetID,
    requestScope: { team_id: e.teamID }
  });
}
function E(e) {
  const a = `${e.cacheKey}:${e.teamPowerID}:${e.sourceTargetID || 0}`;
  return $(a, async () => {
    const n = await l(e.api, "get", {
      ...e.requestScope || {},
      team_power_id: e.teamPowerID,
      source_target_id: e.sourceTargetID || void 0
    });
    return R(m(n, "加载工具参数失败"));
  });
}
function b(e) {
  return D(`workbench/${e}`);
}
function W(e, a) {
  const n = new URLSearchParams({ team_id: String(a.teamID) });
  a.roleID && n.set("role_id", String(a.roleID));
  const s = b(e);
  return `${s}${s.includes("?") ? "&" : "?"}${n.toString()}`;
}
async function Q(e) {
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
async function X(e) {
  return I("power_save_asset", {
    team_id: e.teamID,
    team_power_id: e.teamPowerID,
    request_id: e.requestID,
    target_asset_id: e.targetAssetID || void 0,
    name: e.name?.trim() || void 0
  });
}
async function I(e, a) {
  const n = await l(b(e), "post", a), s = m(n, "保存资产失败"), o = r(s.asset?.id);
  if (!o)
    throw new Error("保存资产结果为空");
  return o;
}
function y(e) {
  return {
    id: r(e?.id),
    name: t(e?.name) || "未命名团队",
    description: t(e?.description),
    projectEnabled: x(e?.project_enabled)
  };
}
function h(e) {
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
function F(e) {
  return h({
    ...e,
    id: e?.team_power_id
  });
}
function B(e) {
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
function K(e) {
  return {
    id: r(e?.id),
    name: t(e?.name) || "未命名分类",
    kind: t(e?.kind) || "text",
    cardinality: t(e?.cardinality) || "single"
  };
}
function N(e) {
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
function x(e) {
  return e !== !1 && Number(e || 1) !== 2;
}
export {
  X as a,
  E as b,
  G as c,
  H as d,
  Q as e,
  U as f,
  J as g,
  z as l,
  W as s,
  b as w
};
