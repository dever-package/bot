import { j as N, c as r, a as D, h as A, d as i, s as l } from "./site-config-CGpZr2qF.js";
import { b as B } from "./space-assistant-layout-Drz4je9C.js";
const O = {
  prompt: "text",
  image: "image",
  audio: "audio",
  video: "video"
}, $ = {
  text: "prompt",
  image: "image",
  audio: "audio",
  video: "video"
};
function E(e) {
  const t = P(e?.kinds).flatMap((o) => {
    const c = q(o?.id);
    return c ? [
      {
        id: c,
        name: _(o?.name) || U(c),
        assetKind: O[c]
      }
    ] : [];
  }), s = new Set(t.map((o) => o.id)), a = P(e?.categories).flatMap((o) => {
    const c = M(o?.id), d = q(o?.kind);
    return !c || !d || !s.has(d) ? [] : [{ id: c, name: _(o?.name) || "未命名分类", kind: d }];
  });
  return {
    enabled: !!e?.enabled && t.length > 0,
    pack: {
      id: M(e?.pack?.id),
      name: _(e?.pack?.name),
      description: _(e?.pack?.description)
    },
    kinds: t,
    categories: a
  };
}
function ie(e, t) {
  const s = new Set(t), a = e.kinds.map((o) => o.assetKind).filter((o) => s.size === 0 || s.has(o));
  return a.includes("text") ? "text" : a[0] || "";
}
function re(e, t) {
  const s = L(t);
  return s ? e.categories.filter((a) => a.kind === s) : [];
}
function L(e) {
  return $[e] || "";
}
function V(e) {
  const t = M(e?.id), s = q(e?.kind) || "prompt", a = O[s], o = _(e?.resource_url), c = s === "prompt" ? { text: _(e?.content) } : { [`${s}s`]: o ? [o] : [] }, d = _(e?.description), I = _(e?.created_at);
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
    materialCateID: M(e?.cate_id),
    materialCateName: _(e?.cate_name),
    materialKind: s,
    name: _(e?.name) || "未命名素材",
    nameMode: "manual",
    kind: a,
    role: "material",
    versionID: 0,
    status: "current",
    summary: d,
    collectionCount: 0,
    collectionPreviews: [],
    createdAt: I,
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
      content: c,
      summary: d,
      createdAt: I,
      updatedAt: I
    }
  };
}
function ce(e) {
  return `${e.libraryType === "material" ? "material" : "asset"}:${e.id}`;
}
function q(e) {
  const t = _(e);
  return Object.prototype.hasOwnProperty.call(O, t) ? t : "";
}
function U(e) {
  return { prompt: "提示词", image: "图片", audio: "音频", video: "视频" }[e];
}
function P(e) {
  return Array.isArray(e) ? e : [];
}
function _(e) {
  return typeof e == "string" ? e.trim() : "";
}
function M(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? Math.trunc(t) : 0;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const K = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!K || Object.keys(K).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const m = K.joinSiteApi, u = K.request, W = B(), J = B(), g = /* @__PURE__ */ new Map(), G = 3e4, H = 32;
let R = 0;
function de(e) {
  if (R += 1, !e?.teamID && e?.requestScopeKey === void 0) {
    g.clear();
    return;
  }
  for (const [t, s] of g)
    e.teamID && s.teamID !== e.teamID || e.requestScopeKey !== void 0 && s.requestScopeKey !== e.requestScopeKey || g.delete(t);
}
function le(e, t, s = "") {
  const a = Date.now();
  F(a);
  const o = JSON.stringify({
    requestScopeKey: s,
    teamID: e,
    catalogOptions: t || null
  }), c = g.get(o);
  if (c && c.expiresAt > a)
    return Promise.resolve(c.value);
  g.delete(o);
  const d = R;
  return W(`${d}:${o}`, async () => {
    const I = u(
      m("workbench/asset_filters"),
      "get",
      {
        team_id: e,
        request_scope: s || void 0
      }
    ), b = u(
      m("workbench/material_catalog"),
      "get",
      {
        team_id: e,
        request_scope: s || void 0
      }
    ), [n, f, y] = t ? await Promise.all([
      Promise.resolve(null),
      I,
      b
    ]) : await Promise.all([
      u(m("workbench/catalog"), "get", {
        team_id: e,
        request_scope: s || void 0
      }),
      I,
      b
    ]), w = t ? {
      powers: t.tools,
      roles: t.dialogues,
      asset_cates: t.assetCates
    } : l(n, "加载团队资产配置失败"), p = l(f, "加载资产筛选项失败"), h = {
      projects: D(p.projects).map(x).filter(k),
      canvases: D(p.canvases).map(ee).filter(k),
      tools: T(w.powers, p.tools),
      dialogues: T(w.roles, p.dialogues),
      assetCates: D(w.asset_cates).map(Z).filter(k),
      webContentImportEnabled: !!p.web_content_import_enabled,
      webContentImportPlatforms: D(p.web_content_import_platforms).map(te).filter((z) => z.key && z.name),
      webContentImportMaxItems: i(
        p.web_content_import_max_items,
        1
      ),
      materialLibrary: E(
        l(y, "加载官方素材配置失败")
      )
    };
    return d === R && (g.set(o, {
      expiresAt: Date.now() + G,
      teamID: e,
      requestScopeKey: s,
      value: h
    }), F(Date.now())), h;
  });
}
function F(e) {
  for (const [t, s] of g)
    s.expiresAt <= e && g.delete(t);
  for (; g.size > H; ) {
    const t = g.keys().next().value;
    if (t === void 0)
      return;
    g.delete(t);
  }
}
function me(e) {
  const t = {
    ...e,
    pageSize: e.pageSize || 24,
    view: e.view || "assets",
    contentMode: e.contentMode || "preview"
  };
  return J(JSON.stringify(t), async () => {
    if (t.filters.sourceType === "official")
      return Q(t);
    const s = await u(m("workbench/assets"), "get", {
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
    }), a = l(s, "加载资产失败");
    return {
      items: D(a.items).map(C).filter(k),
      page: i(a.page, t.page),
      pageSize: i(a.page_size, t.pageSize),
      total: A(a.total),
      hasMore: !!a.has_more
    };
  });
}
async function Q(e) {
  const t = await u(m("workbench/materials"), "get", {
    team_id: e.teamID,
    request_scope: e.requestScopeKey || void 0,
    kind: L(e.filters.kind) || void 0,
    cate_id: e.filters.materialCateID || void 0,
    page: e.page,
    page_size: e.pageSize
  }), s = l(t, "加载官方素材失败");
  return {
    items: D(s.items).map(V).filter(k),
    page: i(s.page, e.page),
    pageSize: i(s.page_size, e.pageSize),
    total: A(s.total),
    hasMore: !!s.has_more
  };
}
async function ue(e, t) {
  const s = await u(
    m("workbench/material_detail"),
    "get",
    { team_id: e, material_id: t }
  ), a = l(s, "加载官方素材详情失败");
  return V(a.material);
}
async function pe(e, t) {
  const s = await u(m("workbench/asset_detail"), "get", {
    team_id: e,
    asset_id: t
  });
  return X(l(s, "加载资产详情失败"));
}
async function fe(e) {
  const t = await u(m("workbench/asset_versions"), "get", {
    team_id: e.teamID,
    asset_id: e.assetID,
    page: e.page,
    page_size: e.pageSize || 20
  }), s = l(t, "加载资产版本失败");
  return {
    items: D(s.items).map(v).filter(k),
    total: A(s.total),
    hasMore: !!s.has_more
  };
}
async function _e(e) {
  const t = await u(m("workbench/asset_version"), "get", {
    team_id: e.teamID,
    asset_id: e.assetID,
    version_id: e.versionID
  }), s = l(t, "加载资产版本失败");
  return v(s.version);
}
async function ge(e) {
  const t = await u(
    m("workbench/asset_set_current"),
    "post",
    {
      team_id: e.teamID,
      asset_id: e.assetID,
      version_id: e.versionID
    }
  ), s = l(t, "设置当前版本失败");
  return C(s.asset);
}
async function De(e) {
  const t = await u(
    m("workbench/asset_save_content"),
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
  ), s = l(t, "保存资产正文失败");
  return C(s.asset);
}
async function we(e) {
  const t = await u(m("workbench/asset_rename"), "post", {
    team_id: e.teamID,
    asset_id: e.assetID,
    name: e.name
  }), s = l(t, "修改资产标题失败");
  return C(s.asset);
}
async function Ie(e) {
  const t = await u(m("workbench/asset_delete"), "post", {
    team_id: e.teamID,
    asset_id: e.assetID
  });
  l(t, "删除资产失败");
}
async function ye(e) {
  const t = await u(m("workbench/asset_restore"), "post", {
    team_id: e.teamID,
    asset_id: e.assetID
  }), s = l(t, "恢复资产失败");
  return C(s.asset);
}
function X(e) {
  return {
    asset: C(e.asset),
    versions: D(e.versions).map(v).filter(k),
    versionTotal: A(e.version_total),
    hasMore: !!e.has_more
  };
}
function C(e) {
  const t = N(e?.version) ? v(e.version) : null;
  return {
    libraryType: "asset",
    id: i(e?.id),
    projectID: i(e?.project_id),
    bodyID: i(e?.body_id),
    teamID: i(e?.team_id),
    flowID: i(e?.flow_id),
    canvasID: i(e?.canvas_id),
    assetCateID: i(e?.asset_cate_id),
    collectionID: i(e?.collection_id),
    nodeKey: r(e?.node_key),
    sourceType: r(e?.source_type),
    sourceID: i(e?.source_id),
    sourceName: r(e?.source_name),
    materialCateID: 0,
    materialCateName: "",
    materialKind: "",
    name: r(e?.name) || "未命名资产",
    nameMode: r(e?.name_mode) === "manual" ? "manual" : "auto",
    kind: r(e?.kind) || "text",
    role: r(e?.role) || "material",
    versionID: i(e?.version_id),
    status: r(e?.status),
    summary: r(e?.summary || t?.summary),
    collectionCount: A(e?.collection_count),
    collectionPreviews: D(e?.collection_previews).map(Y).filter(
      (s) => !!s
    ),
    createdAt: r(e?.created_at),
    deletedAt: r(e?.deleted_at),
    version: t
  };
}
function Y(e) {
  const t = r(e?.kind);
  return t !== "image" && t !== "video" || !e?.content ? null : {
    id: i(e?.id),
    kind: t,
    content: e.content
  };
}
function v(e) {
  return {
    id: i(e?.id),
    assetID: i(e?.asset_id),
    runID: i(e?.run_id),
    nodeRunID: i(e?.node_run_id),
    releaseID: i(e?.release_id),
    requestID: r(e?.request_id),
    nodeKey: r(e?.node_key),
    source: N(e?.source) ? e.source : {},
    version: i(e?.version, 1),
    content: e?.content,
    summary: r(e?.summary),
    createdAt: r(e?.created_at),
    updatedAt: r(e?.updated_at || e?.created_at)
  };
}
function x(e) {
  return {
    id: i(e?.id),
    name: r(e?.name) || "未命名"
  };
}
function T(...e) {
  const t = [], s = /* @__PURE__ */ new Set();
  for (const a of e)
    for (const o of D(a)) {
      const c = x(o);
      c.id <= 0 || s.has(c.id) || (s.add(c.id), t.push(c));
    }
  return t;
}
function Z(e) {
  return {
    ...x(e),
    kind: r(e?.kind) || "text",
    cardinality: r(e?.cardinality) || "single"
  };
}
function ee(e) {
  return {
    ...x(e),
    projectID: i(e?.project_id),
    assetCateID: i(e?.asset_cate_id),
    sort: i(e?.sort)
  };
}
function te(e) {
  const t = N(e) ? e : {};
  return {
    key: r(t.key),
    name: r(t.name)
  };
}
function k(e) {
  return e.id > 0;
}
function he(e, t) {
  const s = e.map((n) => ({
    name: String(n.name || ""),
    size: j(n.size)
  })), a = s.reduce((n, f) => n + f.size, 0), o = s.map((n) => Math.max(n.size, 1)), c = o.reduce((n, f) => n + f, 0), d = s.map(() => 0);
  function I(n, f) {
    const y = s[n];
    if (!y || !t) return;
    const w = s.reduce(
      (h, z, S) => h + z.size * d[S],
      0
    ), p = o.reduce(
      (h, z, S) => h + z * d[S],
      0
    );
    t({
      phase: f,
      fileName: y.name,
      fileIndex: n + 1,
      fileCount: s.length,
      loaded: Math.round(w),
      total: a,
      percent: c > 0 ? Math.round(Math.min(1, p / c) * 100) : 100
    });
  }
  function b(n, f, y) {
    s[n] && (d[n] = Math.max(d[n], oe(f)), I(n, y));
  }
  return {
    start(n) {
      b(n, 0, "preparing");
    },
    report(n, f, y, w = "uploading") {
      const p = s[n];
      if (!p) return;
      const h = w === "saving" || w === "complete" ? 1 : se(f, y, p.size);
      b(n, h, w);
    },
    saving(n) {
      b(n, 1, "saving");
    },
    complete(n) {
      b(n, 1, "complete");
    }
  };
}
function se(e, t, s) {
  const a = j(e), o = j(t);
  return o > 0 ? a / o : s > 0 ? a / s : 0;
}
function j(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? t : 0;
}
function oe(e) {
  return Math.max(0, Math.min(Number.isFinite(e) ? e : 0, 1));
}
export {
  ce as a,
  pe as b,
  he as c,
  ge as d,
  _e as e,
  fe as f,
  ie as g,
  le as h,
  de as i,
  me as j,
  ye as k,
  ue as l,
  Ie as m,
  C as n,
  re as o,
  we as r,
  De as s
};
