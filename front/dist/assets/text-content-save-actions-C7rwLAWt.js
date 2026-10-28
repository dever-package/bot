import { j as re, c as i, a as I, h as N, d as a, s as u } from "./site-config-kAiWSd_3.js";
import { b as pe } from "./preloadable-CT3tMmBD.js";
import { a as le, b as d, h as A, d as Z } from "./file-kind-D6bMOzYN.js";
import { a as V, F as be, j as x } from "./react-5Z-wsVEn.js";
import { s as ke, w as Ce, r as ve, e as Ae } from "./vendor-icons-fVDtJt66.js";
const ne = {
  prompt: "text",
  image: "image",
  audio: "audio",
  video: "video"
}, Re = {
  text: "prompt",
  image: "image",
  audio: "audio",
  video: "video"
};
function ze(e) {
  const t = ue(e?.kinds).flatMap((n) => {
    const o = ee(n?.id);
    return o ? [
      {
        id: o,
        name: w(n?.name) || Se(o),
        assetKind: ne[o]
      }
    ] : [];
  }), r = new Set(t.map((n) => n.id)), s = ue(e?.categories).flatMap((n) => {
    const o = J(n?.id), c = ee(n?.kind);
    return !o || !c || !r.has(c) ? [] : [{ id: o, name: w(n?.name) || "未命名分类", kind: c }];
  });
  return {
    enabled: !!e?.enabled && t.length > 0,
    pack: {
      id: J(e?.pack?.id),
      name: w(e?.pack?.name),
      description: w(e?.pack?.description)
    },
    kinds: t,
    categories: s
  };
}
function Je(e, t) {
  const r = new Set(t), s = e.kinds.map((n) => n.assetKind).filter((n) => r.size === 0 || r.has(n));
  return s.includes("text") ? "text" : s[0] || "";
}
function Ue(e, t) {
  const r = _e(t);
  return r ? e.categories.filter((s) => s.kind === r) : [];
}
function _e(e) {
  return Re[e] || "";
}
function we(e) {
  const t = J(e?.id), r = ee(e?.kind) || "prompt", s = ne[r], n = w(e?.resource_url), o = r === "prompt" ? { text: w(e?.content) } : { [`${r}s`]: n ? [n] : [] }, c = w(e?.description), k = w(e?.created_at);
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
    materialCateID: J(e?.cate_id),
    materialCateName: w(e?.cate_name),
    materialKind: r,
    name: w(e?.name) || "未命名素材",
    nameMode: "manual",
    kind: s,
    role: "material",
    versionID: 0,
    status: "current",
    summary: c,
    collectionCount: 0,
    collectionPreviews: [],
    createdAt: k,
    deletedAt: "",
    version: {
      id: 0,
      assetID: t,
      runID: 0,
      nodeRunID: 0,
      releaseID: 0,
      requestID: "",
      nodeKey: "",
      source: { material_kind: r },
      version: 1,
      content: o,
      summary: c,
      createdAt: k,
      updatedAt: k
    }
  };
}
function We(e) {
  return `${e.libraryType === "material" ? "material" : "asset"}:${e.id}`;
}
function ee(e) {
  const t = w(e);
  return Object.prototype.hasOwnProperty.call(ne, t) ? t : "";
}
function Se(e) {
  return { prompt: "提示词", image: "图片", audio: "音频", video: "视频" }[e];
}
function ue(e) {
  return Array.isArray(e) ? e : [];
}
function w(e) {
  return typeof e == "string" ? e.trim() : "";
}
function J(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? Math.trunc(t) : 0;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const U = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!U || Object.keys(U).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const m = U.joinSiteApi, f = U.request, xe = pe(), Ke = pe(), y = /* @__PURE__ */ new Map(), Me = 3e4, qe = 32;
let te = 0;
function Ge(e) {
  if (te += 1, !e?.teamID && e?.requestScopeKey === void 0) {
    y.clear();
    return;
  }
  for (const [t, r] of y)
    e.teamID && r.teamID !== e.teamID || e.requestScopeKey !== void 0 && r.requestScopeKey !== e.requestScopeKey || y.delete(t);
}
function He(e, t, r = "") {
  const s = Date.now();
  me(s);
  const n = JSON.stringify({
    requestScopeKey: r,
    teamID: e,
    catalogOptions: t || null
  }), o = y.get(n);
  if (o && o.expiresAt > s)
    return Promise.resolve(o.value);
  y.delete(n);
  const c = te;
  return xe(`${c}:${n}`, async () => {
    const k = f(
      m("workbench/asset_filters"),
      "get",
      {
        team_id: e,
        request_scope: r || void 0
      }
    ), T = f(
      m("workbench/material_catalog"),
      "get",
      {
        team_id: e,
        request_scope: r || void 0
      }
    ), [O, g, B] = t ? await Promise.all([
      Promise.resolve(null),
      k,
      T
    ]) : await Promise.all([
      f(m("workbench/catalog"), "get", {
        team_id: e,
        request_scope: r || void 0
      }),
      k,
      T
    ]), h = t ? {
      powers: t.tools,
      roles: t.dialogues,
      asset_cates: t.assetCates
    } : u(O, "加载团队资产配置失败"), p = u(g, "加载资产筛选项失败"), M = {
      projects: I(p.projects).map(G).filter(K),
      canvases: I(p.canvases).map(Ne).filter(K),
      tools: fe(h.powers, p.tools),
      dialogues: fe(h.roles, p.dialogues),
      assetCates: I(h.asset_cates).map(Pe).filter(K),
      webContentImportEnabled: !!p.web_content_import_enabled,
      webContentImportPlatforms: I(p.web_content_import_platforms).map(Oe).filter((P) => P.key && P.name),
      webContentImportMaxItems: a(
        p.web_content_import_max_items,
        1
      ),
      materialLibrary: ze(
        u(B, "加载官方素材配置失败")
      )
    };
    return c === te && (y.set(n, {
      expiresAt: Date.now() + Me,
      teamID: e,
      requestScopeKey: r,
      value: M
    }), me(Date.now())), M;
  });
}
function me(e) {
  for (const [t, r] of y)
    r.expiresAt <= e && y.delete(t);
  for (; y.size > qe; ) {
    const t = y.keys().next().value;
    if (t === void 0)
      return;
    y.delete(t);
  }
}
function Qe(e) {
  const t = {
    ...e,
    pageSize: e.pageSize || 24,
    view: e.view || "assets",
    contentMode: e.contentMode || "preview"
  };
  return Ke(JSON.stringify(t), async () => {
    if (t.filters.sourceType === "official")
      return Fe(t);
    const r = await f(m("workbench/assets"), "get", {
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
    }), s = u(r, "加载资产失败");
    return {
      items: I(s.items).map(j).filter(K),
      page: a(s.page, t.page),
      pageSize: a(s.page_size, t.pageSize),
      total: N(s.total),
      hasMore: !!s.has_more
    };
  });
}
async function Fe(e) {
  const t = await f(m("workbench/materials"), "get", {
    team_id: e.teamID,
    request_scope: e.requestScopeKey || void 0,
    kind: _e(e.filters.kind) || void 0,
    cate_id: e.filters.materialCateID || void 0,
    page: e.page,
    page_size: e.pageSize
  }), r = u(t, "加载官方素材失败");
  return {
    items: I(r.items).map(we).filter(K),
    page: a(r.page, e.page),
    pageSize: a(r.page_size, e.pageSize),
    total: N(r.total),
    hasMore: !!r.has_more
  };
}
async function Xe(e, t) {
  const r = await f(
    m("workbench/material_detail"),
    "get",
    { team_id: e, material_id: t }
  ), s = u(r, "加载官方素材详情失败");
  return we(s.material);
}
async function Ye(e, t) {
  const r = await f(m("workbench/asset_detail"), "get", {
    team_id: e,
    asset_id: t
  });
  return je(u(r, "加载资产详情失败"));
}
async function Ze(e) {
  const t = await f(m("workbench/asset_versions"), "get", {
    team_id: e.teamID,
    asset_id: e.assetID,
    page: e.page,
    page_size: e.pageSize || 20
  }), r = u(t, "加载资产版本失败");
  return {
    items: I(r.items).map(W).filter(K),
    total: N(r.total),
    hasMore: !!r.has_more
  };
}
async function et(e) {
  const t = await f(m("workbench/asset_version"), "get", {
    team_id: e.teamID,
    asset_id: e.assetID,
    version_id: e.versionID
  }), r = u(t, "加载资产版本失败");
  return W(r.version);
}
async function tt(e) {
  const t = await f(
    m("workbench/asset_set_current"),
    "post",
    {
      team_id: e.teamID,
      asset_id: e.assetID,
      version_id: e.versionID
    }
  ), r = u(t, "设置当前版本失败");
  return j(r.asset);
}
async function rt(e) {
  const t = await f(
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
  ), r = u(t, "保存资产正文失败");
  return j(r.asset);
}
async function nt(e) {
  const t = await f(m("workbench/asset_rename"), "post", {
    team_id: e.teamID,
    asset_id: e.assetID,
    name: e.name
  }), r = u(t, "修改资产标题失败");
  return j(r.asset);
}
async function st(e) {
  const t = await f(m("workbench/asset_delete"), "post", {
    team_id: e.teamID,
    asset_id: e.assetID
  });
  u(t, "删除资产失败");
}
async function ot(e) {
  const t = await f(m("workbench/asset_restore"), "post", {
    team_id: e.teamID,
    asset_id: e.assetID
  }), r = u(t, "恢复资产失败");
  return j(r.asset);
}
function je(e) {
  return {
    asset: j(e.asset),
    versions: I(e.versions).map(W).filter(K),
    versionTotal: N(e.version_total),
    hasMore: !!e.has_more
  };
}
function j(e) {
  const t = re(e?.version) ? W(e.version) : null;
  return {
    libraryType: "asset",
    id: a(e?.id),
    projectID: a(e?.project_id),
    bodyID: a(e?.body_id),
    teamID: a(e?.team_id),
    flowID: a(e?.flow_id),
    canvasID: a(e?.canvas_id),
    assetCateID: a(e?.asset_cate_id),
    collectionID: a(e?.collection_id),
    nodeKey: i(e?.node_key),
    sourceType: i(e?.source_type),
    sourceID: a(e?.source_id),
    sourceName: i(e?.source_name),
    materialCateID: 0,
    materialCateName: "",
    materialKind: "",
    name: i(e?.name) || "未命名资产",
    nameMode: i(e?.name_mode) === "manual" ? "manual" : "auto",
    kind: i(e?.kind) || "text",
    role: i(e?.role) || "material",
    versionID: a(e?.version_id),
    status: i(e?.status),
    summary: i(e?.summary || t?.summary),
    collectionCount: N(e?.collection_count),
    collectionPreviews: I(e?.collection_previews).map(Te).filter(
      (r) => !!r
    ),
    createdAt: i(e?.created_at),
    deletedAt: i(e?.deleted_at),
    version: t
  };
}
function Te(e) {
  const t = i(e?.kind);
  return t !== "image" && t !== "video" || !e?.content ? null : {
    id: a(e?.id),
    kind: t,
    content: e.content
  };
}
function W(e) {
  return {
    id: a(e?.id),
    assetID: a(e?.asset_id),
    runID: a(e?.run_id),
    nodeRunID: a(e?.node_run_id),
    releaseID: a(e?.release_id),
    requestID: i(e?.request_id),
    nodeKey: i(e?.node_key),
    source: re(e?.source) ? e.source : {},
    version: a(e?.version, 1),
    content: e?.content,
    summary: i(e?.summary),
    createdAt: i(e?.created_at),
    updatedAt: i(e?.updated_at || e?.created_at)
  };
}
function G(e) {
  return {
    id: a(e?.id),
    name: i(e?.name) || "未命名"
  };
}
function fe(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const s of e)
    for (const n of I(s)) {
      const o = G(n);
      o.id <= 0 || r.has(o.id) || (r.add(o.id), t.push(o));
    }
  return t;
}
function Pe(e) {
  return {
    ...G(e),
    kind: i(e?.kind) || "text",
    cardinality: i(e?.cardinality) || "single"
  };
}
function Ne(e) {
  return {
    ...G(e),
    projectID: a(e?.project_id),
    assetCateID: a(e?.asset_cate_id),
    sort: a(e?.sort)
  };
}
function Oe(e) {
  const t = re(e) ? e : {};
  return {
    key: i(t.key),
    name: i(t.name)
  };
}
function K(e) {
  return e.id > 0;
}
function at({
  value: e,
  resetKey: t,
  fingerprint: r,
  save: s,
  onError: n,
  autoSave: o = !0,
  debounceMs: c = 1200
}) {
  const [k, T] = le(e), [O, g] = le("saved"), B = d(e), h = d(e), p = d(r), M = d(s), P = d(n), se = d(o), $ = d(r(e)), C = d(0), R = d(0), v = d(null), q = d(null), oe = d(async () => !1), L = d(null), b = d(!1), z = d(!0), _ = A(() => {
    v.current !== null && (window.clearTimeout(v.current), v.current = null);
  }, []), D = A(
    async (l, S = !1, Q) => {
      _();
      const E = R.current;
      for (; z.current && E === R.current; ) {
        if (q.current && (!await q.current || E !== R.current))
          return !1;
        if (!S && l !== void 0 && l !== C.current)
          return !0;
        const ie = h.current, X = p.current(ie);
        if (X === $.current)
          return b.current = !1, z.current && g("saved"), !0;
        const ce = C.current;
        z.current && g("saving");
        const de = Q || M.current, Y = de(ie).then(() => {
          if (!z.current || E !== R.current)
            return !1;
          $.current = X, b.current = !1, L.current = null;
          const F = p.current(h.current);
          return g(
            F === X ? "saved" : "dirty"
          ), !0;
        }).catch((F) => (z.current && E === R.current && (_(), b.current = !0, L.current = de, g("error"), P.current?.(F)), !1));
        q.current = Y;
        const he = await Y;
        if (q.current === Y && (q.current = null), !he) return !1;
        if (!S && ce !== C.current && v.current === null && !b.current) {
          const F = C.current;
          v.current = window.setTimeout(() => {
            v.current = null, oe.current(F);
          }, c);
        }
        if (!S || ce === C.current)
          return !0;
      }
      return !1;
    },
    [_, c]
  ), ae = A(
    (l) => {
      _(), !(!se.current || b.current) && (v.current = window.setTimeout(() => {
        v.current = null, D(l);
      }, c));
    },
    [_, c, D]
  ), ye = A(
    (l) => {
      const S = typeof l == "function" ? l(h.current) : l, Q = p.current(S);
      if (h.current = S, T(S), C.current += 1, Q === $.current) {
        _(), b.current = !1, g("saved");
        return;
      }
      if (b.current) {
        g("error");
        return;
      }
      g("dirty"), ae(C.current);
    },
    [_, ae]
  ), H = A(() => {
    const l = B.current;
    R.current += 1, C.current = 0, h.current = l, $.current = p.current(l), b.current = !1, L.current = null, q.current = null, _(), T(l), g("saved");
  }, [_]), ge = A(() => D(void 0, !0), [D]), De = A(
    (l) => D(void 0, !0, l),
    [D]
  ), Ie = A(async () => (b.current = !1, D(void 0, !0, L.current || M.current)), [D]);
  return Z(() => {
    B.current = e, p.current = r, M.current = s, P.current = n, se.current = o, oe.current = D;
  }, [o, r, n, D, s, e]), Z(() => H(), [H, t]), Z(() => (z.current = !0, () => {
    z.current = !1, R.current += 1, _();
  }), [_]), {
    draft: k,
    status: O,
    setDraft: ye,
    reset: H,
    flush: ge,
    flushWith: De,
    retry: Ie,
    hasPendingChanges: O !== "saved"
  };
}
function it({
  status: e,
  hasPendingChanges: t,
  onReset: r,
  onSaveAsNewVersion: s,
  onSave: n
}) {
  const o = e === "saving", c = o || !t;
  return /* @__PURE__ */ V(be, { children: [
    /* @__PURE__ */ V(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        disabled: c,
        onClick: r,
        children: [
          /* @__PURE__ */ x(ke, { size: 13 }),
          /* @__PURE__ */ x("span", { children: "取消修改" })
        ]
      }
    ),
    /* @__PURE__ */ V(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        disabled: c,
        onClick: s,
        children: [
          /* @__PURE__ */ x(Ce, { size: 13 }),
          /* @__PURE__ */ x("span", { children: "保存为新版本" })
        ]
      }
    ),
    /* @__PURE__ */ V(
      "button",
      {
        type: "button",
        className: "wb-detail-command is-primary",
        disabled: c,
        onClick: n,
        children: [
          o ? /* @__PURE__ */ x(ve, { size: 13, className: "wb-detail-spin" }) : /* @__PURE__ */ x(Ae, { size: 13 }),
          /* @__PURE__ */ x("span", { children: o ? "保存中" : "保存" })
        ]
      }
    )
  ] });
}
export {
  it as T,
  We as a,
  Ye as b,
  tt as c,
  et as d,
  Ze as e,
  Je as f,
  He as g,
  Qe as h,
  Ge as i,
  ot as j,
  Xe as l,
  st as m,
  j as n,
  Ue as o,
  nt as r,
  rt as s,
  at as u
};
