import { j as K, r as n, a as _, h as I, c as o, s as c } from "./site-config-cvPYHSmK.js";
import { b as P } from "./preloadable-B6OSmL0f.js";
const M = {
  prompt: "text",
  image: "image",
  audio: "audio",
  video: "video"
}, L = {
  text: "prompt",
  image: "image",
  audio: "audio",
  video: "video"
};
function V(e) {
  const t = S(e?.kinds).flatMap((a) => {
    const r = A(a?.id);
    return r ? [
      {
        id: r,
        name: m(a?.name) || $(r),
        assetKind: M[r]
      }
    ] : [];
  }), s = new Set(t.map((a) => a.id)), i = S(e?.categories).flatMap((a) => {
    const r = y(a?.id), u = A(a?.kind);
    return !r || !u || !s.has(u) ? [] : [{ id: r, name: m(a?.name) || "未命名分类", kind: u }];
  });
  return {
    enabled: !!e?.enabled && t.length > 0,
    pack: {
      id: y(e?.pack?.id),
      name: m(e?.pack?.name),
      description: m(e?.pack?.description)
    },
    kinds: t,
    categories: i
  };
}
function se(e, t) {
  const s = new Set(t), i = e.kinds.map((a) => a.assetKind).filter((a) => s.size === 0 || s.has(a));
  return i.includes("text") ? "text" : i[0] || "";
}
function oe(e, t) {
  const s = R(t);
  return s ? e.categories.filter((i) => i.kind === s) : [];
}
function R(e) {
  return L[e] || "";
}
function F(e) {
  const t = y(e?.id), s = A(e?.kind) || "prompt", i = M[s], a = m(e?.resource_url), r = s === "prompt" ? { text: m(e?.content) } : { [`${s}s`]: a ? [a] : [] }, u = m(e?.description), g = m(e?.created_at);
  return {
    libraryType: "material",
    id: t,
    projectID: 0,
    bodyID: 0,
    teamID: 0,
    flowID: 0,
    canvasID: 0,
    assetCateID: 0,
    collectionID: 0,
    nodeKey: "",
    sourceType: "official",
    sourceID: 0,
    sourceName: "素材库",
    materialCateID: y(e?.cate_id),
    materialCateName: m(e?.cate_name),
    materialKind: s,
    name: m(e?.name) || "未命名素材",
    nameMode: "manual",
    kind: i,
    role: "material",
    versionID: 0,
    status: "current",
    summary: u,
    collectionCount: 0,
    collectionPreviews: [],
    createdAt: g,
    deletedAt: "",
    version: {
      id: 0,
      assetID: t,
      runID: 0,
      nodeRunID: 0,
      releaseID: 0,
      requestID: "",
      nodeKey: "",
      source: { material_kind: s },
      version: 1,
      content: r,
      summary: u,
      createdAt: g,
      updatedAt: g
    }
  };
}
function ae(e) {
  return `${e.libraryType === "material" ? "material" : "asset"}:${e.id}`;
}
function A(e) {
  const t = m(e);
  return Object.prototype.hasOwnProperty.call(M, t) ? t : "";
}
function $(e) {
  return { prompt: "提示词", image: "图片", audio: "音频", video: "视频" }[e];
}
function S(e) {
  return Array.isArray(e) ? e : [];
}
function m(e) {
  return typeof e == "string" ? e.trim() : "";
}
function y(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? Math.trunc(t) : 0;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const k = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!k || Object.keys(k).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const d = k.joinSiteApi, l = k.request, E = P(), J = P(), p = /* @__PURE__ */ new Map(), U = 3e4, G = 32;
let z = 0;
function ne(e) {
  if (z += 1, !e?.teamID && e?.requestScopeKey === void 0) {
    p.clear();
    return;
  }
  for (const [t, s] of p)
    e.teamID && s.teamID !== e.teamID || e.requestScopeKey !== void 0 && s.requestScopeKey !== e.requestScopeKey || p.delete(t);
}
function ie(e, t, s = "") {
  const i = Date.now();
  j(i);
  const a = JSON.stringify({
    requestScopeKey: s,
    teamID: e,
    catalogOptions: t || null
  }), r = p.get(a);
  if (r && r.expiresAt > i)
    return Promise.resolve(r.value);
  p.delete(a);
  const u = z;
  return E(`${u}:${a}`, async () => {
    const g = l(
      d("workbench/asset_filters"),
      "get",
      {
        team_id: e,
        request_scope: s || void 0
      }
    ), x = l(
      d("workbench/material_catalog"),
      "get",
      {
        team_id: e,
        request_scope: s || void 0
      }
    ), [N, T, B] = t ? await Promise.all([
      Promise.resolve(null),
      g,
      x
    ]) : await Promise.all([
      l(d("workbench/catalog"), "get", {
        team_id: e,
        request_scope: s || void 0
      }),
      g,
      x
    ]), C = t ? {
      powers: t.tools,
      roles: t.dialogues,
      asset_cates: t.assetCates
    } : c(N, "加载团队资产配置失败"), f = c(T, "加载资产筛选项失败"), q = {
      projects: _(f.projects).map(h).filter(D),
      canvases: _(f.canvases).map(Y).filter(D),
      tools: O(C.powers, f.tools),
      dialogues: O(C.roles, f.dialogues),
      assetCates: _(C.asset_cates).map(X).filter(D),
      webContentImportEnabled: !!f.web_content_import_enabled,
      webContentImportPlatforms: _(f.web_content_import_platforms).map(Z).filter((v) => v.key && v.name),
      webContentImportMaxItems: o(
        f.web_content_import_max_items,
        1
      ),
      materialLibrary: V(
        c(B, "加载官方素材配置失败")
      )
    };
    return u === z && (p.set(a, {
      expiresAt: Date.now() + U,
      teamID: e,
      requestScopeKey: s,
      value: q
    }), j(Date.now())), q;
  });
}
function j(e) {
  for (const [t, s] of p)
    s.expiresAt <= e && p.delete(t);
  for (; p.size > G; ) {
    const t = p.keys().next().value;
    if (t === void 0)
      return;
    p.delete(t);
  }
}
function re(e) {
  const t = {
    ...e,
    pageSize: e.pageSize || 24,
    view: e.view || "assets",
    contentMode: e.contentMode || "preview"
  };
  return J(JSON.stringify(t), async () => {
    if (t.filters.sourceType === "official")
      return W(t);
    const s = await l(d("workbench/assets"), "get", {
      team_id: t.teamID,
      request_scope: t.requestScopeKey || void 0,
      source_type: t.filters.sourceType || void 0,
      source_id: t.filters.sourceID || void 0,
      project_id: t.filters.projectID || void 0,
      scope_project_id: t.scopeProjectID || void 0,
      canvas_id: t.filters.canvasID || void 0,
      asset_cate_id: t.filters.assetCateID || void 0,
      collection_id: t.collectionID || void 0,
      node_key: t.filters.nodeKey || void 0,
      role: t.filters.role || void 0,
      kind: t.filters.kind || void 0,
      exclude_collections: t.excludeCollections ? 1 : void 0,
      view: t.view,
      content_mode: t.contentMode,
      page: t.page,
      page_size: t.pageSize
    }), i = c(s, "加载资产失败");
    return {
      items: _(i.items).map(w).filter(D),
      page: o(i.page, t.page),
      pageSize: o(i.page_size, t.pageSize),
      total: I(i.total),
      hasMore: !!i.has_more
    };
  });
}
async function W(e) {
  const t = await l(d("workbench/materials"), "get", {
    team_id: e.teamID,
    request_scope: e.requestScopeKey || void 0,
    kind: R(e.filters.kind) || void 0,
    cate_id: e.filters.materialCateID || void 0,
    page: e.page,
    page_size: e.pageSize
  }), s = c(t, "加载官方素材失败");
  return {
    items: _(s.items).map(F).filter(D),
    page: o(s.page, e.page),
    pageSize: o(s.page_size, e.pageSize),
    total: I(s.total),
    hasMore: !!s.has_more
  };
}
async function ce(e, t) {
  const s = await l(
    d("workbench/material_detail"),
    "get",
    { team_id: e, material_id: t }
  ), i = c(s, "加载官方素材详情失败");
  return F(i.material);
}
async function de(e, t) {
  const s = await l(d("workbench/asset_detail"), "get", {
    team_id: e,
    asset_id: t
  });
  return H(c(s, "加载资产详情失败"));
}
async function le(e) {
  const t = await l(d("workbench/asset_versions"), "get", {
    team_id: e.teamID,
    asset_id: e.assetID,
    page: e.page,
    page_size: e.pageSize || 20
  }), s = c(t, "加载资产版本失败");
  return {
    items: _(s.items).map(b).filter(D),
    total: I(s.total),
    hasMore: !!s.has_more
  };
}
async function me(e) {
  const t = await l(d("workbench/asset_version"), "get", {
    team_id: e.teamID,
    asset_id: e.assetID,
    version_id: e.versionID
  }), s = c(t, "加载资产版本失败");
  return b(s.version);
}
async function pe(e) {
  const t = await l(
    d("workbench/asset_set_current"),
    "post",
    {
      team_id: e.teamID,
      asset_id: e.assetID,
      version_id: e.versionID
    }
  ), s = c(t, "设置当前版本失败");
  return w(s.asset);
}
async function _e(e) {
  const t = await l(
    d("workbench/asset_save_content"),
    "post",
    {
      team_id: e.teamID,
      asset_id: e.assetID,
      expected_version_id: e.expectedVersionID,
      expected_updated_at: e.expectedUpdatedAt,
      request_id: e.requestID || "",
      save_mode: e.saveMode,
      content: e.content
    }
  ), s = c(t, "保存资产正文失败");
  return w(s.asset);
}
async function ue(e) {
  const t = await l(d("workbench/asset_rename"), "post", {
    team_id: e.teamID,
    asset_id: e.assetID,
    name: e.name
  }), s = c(t, "修改资产标题失败");
  return w(s.asset);
}
async function fe(e) {
  const t = await l(d("workbench/asset_delete"), "post", {
    team_id: e.teamID,
    asset_id: e.assetID
  });
  c(t, "删除资产失败");
}
async function De(e) {
  const t = await l(d("workbench/asset_restore"), "post", {
    team_id: e.teamID,
    asset_id: e.assetID
  }), s = c(t, "恢复资产失败");
  return w(s.asset);
}
function H(e) {
  return {
    asset: w(e.asset),
    versions: _(e.versions).map(b).filter(D),
    versionTotal: I(e.version_total),
    hasMore: !!e.has_more
  };
}
function w(e) {
  const t = K(e?.version) ? b(e.version) : null;
  return {
    libraryType: "asset",
    id: o(e?.id),
    projectID: o(e?.project_id),
    bodyID: o(e?.body_id),
    teamID: o(e?.team_id),
    flowID: o(e?.flow_id),
    canvasID: o(e?.canvas_id),
    assetCateID: o(e?.asset_cate_id),
    collectionID: o(e?.collection_id),
    nodeKey: n(e?.node_key),
    sourceType: n(e?.source_type),
    sourceID: o(e?.source_id),
    sourceName: n(e?.source_name),
    materialCateID: 0,
    materialCateName: "",
    materialKind: "",
    name: n(e?.name) || "未命名资产",
    nameMode: n(e?.name_mode) === "manual" ? "manual" : "auto",
    kind: n(e?.kind) || "text",
    role: n(e?.role) || "material",
    versionID: o(e?.version_id),
    status: n(e?.status),
    summary: n(e?.summary || t?.summary),
    collectionCount: I(e?.collection_count),
    collectionPreviews: _(e?.collection_previews).map(Q).filter(
      (s) => !!s
    ),
    createdAt: n(e?.created_at),
    deletedAt: n(e?.deleted_at),
    version: t
  };
}
function Q(e) {
  const t = n(e?.kind);
  return t !== "image" && t !== "video" || !e?.content ? null : {
    id: o(e?.id),
    kind: t,
    content: e.content
  };
}
function b(e) {
  return {
    id: o(e?.id),
    assetID: o(e?.asset_id),
    runID: o(e?.run_id),
    nodeRunID: o(e?.node_run_id),
    releaseID: o(e?.release_id),
    requestID: n(e?.request_id),
    nodeKey: n(e?.node_key),
    source: K(e?.source) ? e.source : {},
    version: o(e?.version, 1),
    content: e?.content,
    summary: n(e?.summary),
    createdAt: n(e?.created_at),
    updatedAt: n(e?.updated_at || e?.created_at)
  };
}
function h(e) {
  return {
    id: o(e?.id),
    name: n(e?.name) || "未命名"
  };
}
function O(...e) {
  const t = [], s = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const a of _(i)) {
      const r = h(a);
      r.id <= 0 || s.has(r.id) || (s.add(r.id), t.push(r));
    }
  return t;
}
function X(e) {
  return {
    ...h(e),
    kind: n(e?.kind) || "text",
    cardinality: n(e?.cardinality) || "single"
  };
}
function Y(e) {
  return {
    ...h(e),
    projectID: o(e?.project_id),
    assetCateID: o(e?.asset_cate_id),
    sort: o(e?.sort)
  };
}
function Z(e) {
  const t = K(e) ? e : {};
  return {
    key: n(t.key),
    name: n(t.name)
  };
}
function D(e) {
  return e.id > 0;
}
export {
  ae as a,
  pe as b,
  me as c,
  le as d,
  ce as e,
  se as f,
  ie as g,
  re as h,
  ne as i,
  De as j,
  de as l,
  fe as m,
  w as n,
  oe as o,
  ue as r,
  _e as s
};
