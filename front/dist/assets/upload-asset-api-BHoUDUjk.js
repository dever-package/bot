import { s as N, h as rt, a as P, d as S, r as k, j as Jt, l as Hn } from "./site-config-CnYw1vhW.js";
import { e as Re, d as Wn } from "./preloadable-BSZIYdQl.js";
import { r as Jn, R as Zn, V as Xn, a as Qn } from "./media-inspector-gallery-DkVtDPR_.js";
import { j as c, a as _, F as Te } from "./runtime-entry-9YhLBCWA.js";
import { b as tr, r as Z, c as Ee, n as Pe, X as er, ah as nr, j as rr, aJ as or, Y as ir, d as sr, a9 as ar, ab as X, q as cr } from "./vendor-icons-DgDZMD4Q.js";
import { a as z, d as ze, b as _t, u as dr, l as ur, S as lr } from "./_commonjsHelpers-C76sftkf.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./upload-asset-api-Dhl6QJt8.css", import.meta.url).href]);
const Zt = {
  prompt: "text",
  image: "image",
  audio: "audio",
  video: "video"
}, fr = {
  text: "prompt",
  image: "image",
  audio: "audio",
  video: "video"
};
function mr(t) {
  const e = le(t?.kinds).flatMap((o) => {
    const i = zt(o?.id);
    return i ? [
      {
        id: i,
        name: E(o?.name) || pr(i),
        assetKind: Zt[i]
      }
    ] : [];
  }), n = new Set(e.map((o) => o.id)), r = le(t?.categories).flatMap((o) => {
    const i = gt(o?.id), s = zt(o?.kind);
    return !i || !s || !n.has(s) ? [] : [{ id: i, name: E(o?.name) || "未命名分类", kind: s }];
  });
  return {
    enabled: !!t?.enabled && e.length > 0,
    pack: {
      id: gt(t?.pack?.id),
      name: E(t?.pack?.name),
      description: E(t?.pack?.description)
    },
    kinds: e,
    categories: r
  };
}
function ts(t, e) {
  const n = new Set(e), r = t.kinds.map((o) => o.assetKind).filter((o) => n.size === 0 || n.has(o));
  return r.includes("text") ? "text" : r[0] || "";
}
function es(t, e) {
  const n = $e(e);
  return n ? t.categories.filter((r) => r.kind === n) : [];
}
function $e(t) {
  return fr[t] || "";
}
function Le(t) {
  const e = gt(t?.id), n = zt(t?.kind) || "prompt", r = Zt[n], o = E(t?.resource_url), i = n === "prompt" ? { text: E(t?.content) } : { [`${n}s`]: o ? [o] : [] }, s = E(t?.description), a = E(t?.created_at);
  return {
    libraryType: "material",
    id: e,
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
    materialCateID: gt(t?.cate_id),
    materialCateName: E(t?.cate_name),
    materialKind: n,
    name: E(t?.name) || "未命名素材",
    nameMode: "manual",
    kind: r,
    role: "material",
    versionID: 0,
    status: "current",
    summary: s,
    collectionCount: 0,
    collectionPreviews: [],
    createdAt: a,
    deletedAt: "",
    version: {
      id: 0,
      assetID: e,
      runID: 0,
      nodeRunID: 0,
      releaseID: 0,
      requestID: "",
      nodeKey: "",
      source: { material_kind: n },
      version: 1,
      content: i,
      summary: s,
      createdAt: a,
      updatedAt: a
    }
  };
}
function ns(t) {
  return `${t.libraryType === "material" ? "material" : "asset"}:${t.id}`;
}
function zt(t) {
  const e = E(t);
  return Object.prototype.hasOwnProperty.call(Zt, e) ? e : "";
}
function pr(t) {
  return { prompt: "提示词", image: "图片", audio: "音频", video: "视频" }[t];
}
function le(t) {
  return Array.isArray(t) ? t : [];
}
function E(t) {
  return typeof t == "string" ? t.trim() : "";
}
function gt(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) && e > 0 ? Math.trunc(e) : 0;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const ht = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!ht || Object.keys(ht).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const O = ht.joinSiteApi, R = ht.request, yr = Re(), _r = Re();
function rs(t, e, n = "") {
  const r = JSON.stringify({
    requestScopeKey: n,
    teamID: t,
    catalogOptions: e || null
  });
  return yr(r, async () => {
    const o = R(
      O("workbench/asset_filters"),
      "get",
      {
        team_id: t,
        request_scope: n || void 0
      }
    ), i = R(
      O("workbench/material_catalog"),
      "get",
      {
        team_id: t,
        request_scope: n || void 0
      }
    ), [s, a, u] = e ? await Promise.all([
      Promise.resolve(null),
      o,
      i
    ]) : await Promise.all([
      R(O("workbench/catalog"), "get", {
        team_id: t,
        request_scope: n || void 0
      }),
      o,
      i
    ]), f = e ? {
      powers: e.tools,
      roles: e.dialogues,
      asset_cates: e.assetCates
    } : N(s, "加载团队资产配置失败"), l = N(a, "加载资产筛选项失败");
    return {
      projects: P(l.projects).map(Ct).filter(F),
      canvases: P(l.canvases).map(Sr).filter(F),
      tools: fe(f.powers, l.tools),
      dialogues: fe(f.roles, l.dialogues),
      assetCates: P(f.asset_cates).map(wr).filter(F),
      webContentImportEnabled: !!l.web_content_import_enabled,
      webContentImportPlatforms: P(l.web_content_import_platforms).map(Ir).filter((d) => d.key && d.name),
      webContentImportMaxItems: S(
        l.web_content_import_max_items,
        1
      ),
      materialLibrary: mr(
        N(u, "加载官方素材配置失败")
      )
    };
  });
}
function os(t) {
  const e = {
    ...t,
    pageSize: t.pageSize || 24,
    view: t.view || "assets",
    contentMode: t.contentMode || "preview"
  };
  return _r(JSON.stringify(e), async () => {
    if (e.filters.sourceType === "official")
      return gr(e);
    const n = await R(O("workbench/assets"), "get", {
      team_id: e.teamID,
      request_scope: e.requestScopeKey || void 0,
      source_type: e.filters.sourceType || void 0,
      source_id: e.filters.sourceID || void 0,
      project_id: e.filters.projectID || void 0,
      scope_project_id: e.scopeProjectID || void 0,
      canvas_id: e.filters.canvasID || void 0,
      asset_cate_id: e.filters.assetCateID || void 0,
      collection_id: e.collectionID || void 0,
      node_key: e.filters.nodeKey || void 0,
      role: e.filters.role || void 0,
      kind: e.filters.kind || void 0,
      exclude_collections: e.excludeCollections ? 1 : void 0,
      view: e.view,
      content_mode: e.contentMode,
      page: e.page,
      page_size: e.pageSize
    }), r = N(n, "加载资产失败");
    return {
      items: P(r.items).map(q).filter(F),
      page: S(r.page, e.page),
      pageSize: S(r.page_size, e.pageSize),
      total: rt(r.total),
      hasMore: !!r.has_more
    };
  });
}
async function gr(t) {
  const e = await R(O("workbench/materials"), "get", {
    team_id: t.teamID,
    request_scope: t.requestScopeKey || void 0,
    kind: $e(t.filters.kind) || void 0,
    cate_id: t.filters.materialCateID || void 0,
    page: t.page,
    page_size: t.pageSize
  }), n = N(e, "加载官方素材失败");
  return {
    items: P(n.items).map(Le).filter(F),
    page: S(n.page, t.page),
    pageSize: S(n.page_size, t.pageSize),
    total: rt(n.total),
    hasMore: !!n.has_more
  };
}
async function is(t, e) {
  const n = await R(
    O("workbench/material_detail"),
    "get",
    { team_id: t, material_id: e }
  ), r = N(n, "加载官方素材详情失败");
  return Le(r.material);
}
async function ss(t, e) {
  const n = await R(O("workbench/asset_detail"), "get", {
    team_id: t,
    asset_id: e
  });
  return hr(N(n, "加载资产详情失败"));
}
async function as(t) {
  const e = await R(O("workbench/asset_versions"), "get", {
    team_id: t.teamID,
    asset_id: t.assetID,
    page: t.page,
    page_size: t.pageSize || 20
  }), n = N(e, "加载资产版本失败");
  return {
    items: P(n.items).map(Mt).filter(F),
    total: rt(n.total),
    hasMore: !!n.has_more
  };
}
async function cs(t) {
  const e = await R(O("workbench/asset_version"), "get", {
    team_id: t.teamID,
    asset_id: t.assetID,
    version_id: t.versionID
  }), n = N(e, "加载资产版本失败");
  return Mt(n.version);
}
async function ds(t) {
  const e = await R(
    O("workbench/asset_set_current"),
    "post",
    {
      team_id: t.teamID,
      asset_id: t.assetID,
      version_id: t.versionID
    }
  ), n = N(e, "设置当前版本失败");
  return q(n.asset);
}
async function us(t) {
  const e = await R(
    O("workbench/asset_save_content"),
    "post",
    {
      team_id: t.teamID,
      asset_id: t.assetID,
      expected_version_id: t.expectedVersionID,
      expected_updated_at: t.expectedUpdatedAt,
      request_id: t.requestID || "",
      save_mode: t.saveMode,
      content: t.content
    }
  ), n = N(e, "保存资产正文失败");
  return q(n.asset);
}
async function ls(t) {
  const e = await R(O("workbench/asset_rename"), "post", {
    team_id: t.teamID,
    asset_id: t.assetID,
    name: t.name
  }), n = N(e, "修改资产标题失败");
  return q(n.asset);
}
async function fs(t) {
  const e = await R(O("workbench/asset_delete"), "post", {
    team_id: t.teamID,
    asset_id: t.assetID
  });
  N(e, "删除资产失败");
}
async function ms(t) {
  const e = await R(O("workbench/asset_restore"), "post", {
    team_id: t.teamID,
    asset_id: t.assetID
  }), n = N(e, "恢复资产失败");
  return q(n.asset);
}
function hr(t) {
  return {
    asset: q(t.asset),
    versions: P(t.versions).map(Mt).filter(F),
    versionTotal: rt(t.version_total),
    hasMore: !!t.has_more
  };
}
function q(t) {
  const e = Jt(t?.version) ? Mt(t.version) : null;
  return {
    libraryType: "asset",
    id: S(t?.id),
    projectID: S(t?.project_id),
    bodyID: S(t?.body_id),
    teamID: S(t?.team_id),
    flowID: S(t?.flow_id),
    canvasID: S(t?.canvas_id),
    assetCateID: S(t?.asset_cate_id),
    collectionID: S(t?.collection_id),
    nodeKey: k(t?.node_key),
    sourceType: k(t?.source_type),
    sourceID: S(t?.source_id),
    sourceName: k(t?.source_name),
    materialCateID: 0,
    materialCateName: "",
    materialKind: "",
    name: k(t?.name) || "未命名资产",
    nameMode: k(t?.name_mode) === "manual" ? "manual" : "auto",
    kind: k(t?.kind) || "text",
    role: k(t?.role) || "material",
    versionID: S(t?.version_id),
    status: k(t?.status),
    summary: k(t?.summary || e?.summary),
    collectionCount: rt(t?.collection_count),
    collectionPreviews: P(t?.collection_previews).map(br).filter(
      (n) => !!n
    ),
    createdAt: k(t?.created_at),
    deletedAt: k(t?.deleted_at),
    version: e
  };
}
function br(t) {
  const e = k(t?.kind);
  return e !== "image" && e !== "video" || !t?.content ? null : {
    id: S(t?.id),
    kind: e,
    content: t.content
  };
}
function Mt(t) {
  return {
    id: S(t?.id),
    assetID: S(t?.asset_id),
    runID: S(t?.run_id),
    nodeRunID: S(t?.node_run_id),
    releaseID: S(t?.release_id),
    requestID: k(t?.request_id),
    nodeKey: k(t?.node_key),
    source: Jt(t?.source) ? t.source : {},
    version: S(t?.version, 1),
    content: t?.content,
    summary: k(t?.summary),
    createdAt: k(t?.created_at),
    updatedAt: k(t?.updated_at || t?.created_at)
  };
}
function Ct(t) {
  return {
    id: S(t?.id),
    name: k(t?.name) || "未命名"
  };
}
function fe(...t) {
  const e = [], n = /* @__PURE__ */ new Set();
  for (const r of t)
    for (const o of P(r)) {
      const i = Ct(o);
      i.id <= 0 || n.has(i.id) || (n.add(i.id), e.push(i));
    }
  return e;
}
function wr(t) {
  return {
    ...Ct(t),
    kind: k(t?.kind) || "text",
    cardinality: k(t?.cardinality) || "single"
  };
}
function Sr(t) {
  return {
    ...Ct(t),
    projectID: S(t?.project_id),
    assetCateID: S(t?.asset_cate_id),
    sort: S(t?.sort)
  };
}
function Ir(t) {
  const e = Jt(t) ? t : {};
  return {
    key: k(e.key),
    name: k(e.name)
  };
}
function F(t) {
  return t.id > 0;
}
const Ar = "素材库", kr = [
  { key: "project", label: "创作" },
  { key: "tool", label: "工具" },
  { key: "dialogue", label: "对话" },
  { key: "upload", label: "上传" },
  { key: "import", label: "导入" },
  { key: "official", label: Ar }
], xr = [
  { key: "work", label: "作品" },
  { key: "material", label: "素材" }
], Dr = [
  { key: "collection", label: "集合" },
  { key: "text", label: "文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "richtext", label: "富文本" },
  { key: "file", label: "文件" }
];
function ps(t, e = {}) {
  const n = e.fallback || "资产", r = Xt(kr, t, n);
  return e[t] || r;
}
function ys(t) {
  return Xt(xr, t, "素材");
}
function _s(t) {
  return Xt(Dr, t, "资产");
}
function gs(t) {
  if (t.length === 0 || t.some((r) => ["text", "richtext", "file"].includes(r)))
    return;
  const e = {
    image: "image/*",
    audio: "audio/*",
    video: "video/*"
  }, n = t.map((r) => e[r]).filter((r) => !!r);
  return n.length > 0 ? Array.from(new Set(n)).join(",") : void 0;
}
function hs(t, e) {
  return t && (e.length === 0 || e.some((n) => ["richtext", "video"].includes(n)));
}
function bs(t) {
  return t.id <= 0 ? !1 : t.libraryType === "material" ? t.version?.content != null : t.versionID > 0;
}
function Xt(t, e, n) {
  return t.find((r) => r.key === e)?.label || n;
}
function Mr(t) {
  if (typeof t != "string")
    return t;
  const e = t.trim();
  if (!Qt(e))
    return t;
  try {
    return JSON.parse(e);
  } catch {
    return t;
  }
}
function w(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function ws(t) {
  return w(t) ? t : {};
}
function I(t) {
  return typeof t == "string" ? t.trim() : "";
}
function Ss(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) ? e : 0;
}
function it(t) {
  if (t == null || t === "")
    return;
  const e = Number(t);
  return Number.isFinite(e) ? e : void 0;
}
function Be(t) {
  const e = String(t || "").trim(), n = Cr(e), r = Er(n);
  for (const o of Fe([e, n, r])) {
    const i = Mr(o);
    if (i !== o)
      return i;
    const s = Rr(o);
    if (s !== o)
      return s;
  }
  return t;
}
function Is(t) {
  const e = String(t || "").trim();
  for (const n of je(e)) {
    const r = Be(n);
    if (r !== n)
      return r;
  }
  return t;
}
function ot(t) {
  const e = [];
  for (const n of je(
    String(t || "").trim()
  )) {
    const r = Be(n);
    r !== n && e.push(r);
  }
  return e;
}
function Cr(t) {
  let e = "", n = !1, r = !1;
  for (const o of t) {
    if (r) {
      e += o, r = !1;
      continue;
    }
    if (o === "\\") {
      e += o, r = n;
      continue;
    }
    if (o === '"') {
      n = !n, e += o;
      continue;
    }
    if (n && o.charCodeAt(0) < 32) {
      e += Tr(o);
      continue;
    }
    e += o;
  }
  return e;
}
function je(t) {
  const e = [t];
  for (const n of t.matchAll(/```(?:json|storyboard)?\s*([\s\S]*?)```/gi))
    e.push(String(n[1] || "").trim());
  return e.push(...Nr(t)), Fe(e);
}
function Nr(t) {
  const e = [];
  for (let n = 0; n < t.length; n += 1) {
    const r = t[n];
    if (r !== "{" && r !== "[")
      continue;
    const o = Or(t, n);
    o && (e.push(o), n += o.length - 1);
  }
  return e;
}
function Or(t, e) {
  const n = [];
  let r = !1, o = !1;
  for (let i = e; i < t.length; i += 1) {
    const s = t[i];
    if (o) {
      o = !1;
      continue;
    }
    if (r && s === "\\") {
      o = !0;
      continue;
    }
    if (s === '"') {
      r = !r;
      continue;
    }
    if (r)
      continue;
    if (s === "{" || s === "[") {
      n.push(s);
      continue;
    }
    if (s !== "}" && s !== "]")
      continue;
    const a = s === "}" ? "{" : "[";
    if (n.pop() !== a)
      return "";
    if (n.length === 0)
      return t.slice(e, i + 1).trim();
  }
  return "";
}
function Qt(t) {
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function Rr(t) {
  if (!t.startsWith('"') || !t.endsWith('"'))
    return t;
  try {
    const e = JSON.parse(t);
    return typeof e == "string" ? e : t;
  } catch {
    return t;
  }
}
function Tr(t) {
  switch (t) {
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    default:
      return `\\u${t.charCodeAt(0).toString(16).padStart(4, "0")}`;
  }
}
function Er(t) {
  const e = t.trim();
  return !e.includes('\\"') || !e.startsWith("{") && !e.startsWith("[") ? t : e.replace(/\\"/g, '"');
}
function Fe(t) {
  const e = /* @__PURE__ */ new Set();
  return t.filter((n) => {
    const r = String(n || "").trim();
    return !r || e.has(r) ? !1 : (e.add(r), !0);
  });
}
function As(...t) {
  return t.find(
    (e) => e != null
  );
}
function ks(t) {
  try {
    return JSON.stringify(t);
  } catch {
    return "";
  }
}
const Pr = {
  audio: "editorMediaAudio",
  image: "editorMediaImage",
  mediaAudio: "editorMediaAudio",
  mediaImage: "editorMediaImage",
  mediaVideo: "editorMediaVideo",
  video: "editorMediaVideo"
}, ve = [
  "rich",
  "value",
  "doc",
  "document",
  "content",
  "data",
  "output",
  "result",
  "body"
];
function xs(t) {
  const e = Ue(t);
  return e.length > 120 ? `${e.slice(0, 120)}...` : e;
}
function Ue(t) {
  return at(t).replace(/\s+/g, " ").trim();
}
function zr(t) {
  if (typeof t != "string")
    return "";
  const e = t.trim();
  if (!jr(e))
    return "";
  const n = e.search(/"rich"\s*:/), r = n >= 0 ? e.slice(n) : e, o = [], i = /"text"\s*:\s*"((?:\\.|[^"\\])*)"/g;
  let s = null;
  for (; (s = i.exec(r)) !== null; ) {
    const a = Fr(s[1]).trim();
    a && o.push(a);
  }
  return o.join(" ").replace(/\s+/g, " ").trim();
}
function te(t) {
  const e = W(t, /* @__PURE__ */ new Set());
  return ee(e) ? e : null;
}
function Ds(t) {
  try {
    return Ue(t);
  } catch {
    return "";
  }
}
function Ms(t) {
  try {
    return te(t);
  } catch {
    return null;
  }
}
function at(t) {
  if (typeof t == "string") {
    const r = t.trim();
    if (Qt(r)) {
      const o = Ge(r);
      if (o !== void 0)
        return at(o).trim();
    }
    return zr(r) || t;
  }
  if (Array.isArray(t))
    return t.map(at).filter(Boolean).join(" ");
  if (!w(t))
    return "";
  const e = te(t);
  if (e)
    return qe(e);
  const n = [
    typeof t.text == "string" ? t.text : "",
    typeof t.markdown == "string" ? t.markdown : ""
  ];
  for (const r of ve)
    t[r] != null && n.push(at(t[r]));
  return n.filter(Boolean).join(" ");
}
function W(t, e) {
  if (typeof t == "string") {
    const r = t.trim();
    if (!Qt(r))
      return null;
    const o = Ge(r);
    return o === void 0 ? null : W(o, e);
  }
  if (Array.isArray(t)) {
    const r = me({ type: "doc", content: t });
    if (ee(r))
      return r;
    for (const o of t) {
      const i = W(o, e);
      if (i)
        return i;
    }
    return null;
  }
  if (!w(t) || e.has(t))
    return null;
  e.add(t);
  const n = me(t);
  if (n)
    return n;
  if (String(t.format || "").toLowerCase() === "rich_json" && t.rich != null) {
    const r = W(t.rich, e);
    if (r)
      return r;
  }
  for (const r of ve) {
    if (t[r] == null)
      continue;
    const o = W(t[r], e);
    if (o)
      return o;
  }
  return null;
}
function me(t) {
  return !w(t) || Ke(t.type) !== "doc" ? null : {
    type: "doc",
    attrs: w(t.attrs) ? t.attrs : void 0,
    content: Ve(t.content)
  };
}
function Ve(t) {
  return Array.isArray(t) ? t.map($r).filter((e) => !!e) : [];
}
function $r(t) {
  if (!w(t))
    return null;
  const e = Ke(t.type) || Lr(t);
  if (!e)
    return null;
  const n = { type: e }, r = w(t.attrs) ? { ...t.attrs } : {};
  if (e === "heading" && bt(r.level) <= 0) {
    const s = bt(t.level);
    s > 0 && (r.level = s);
  }
  Object.keys(r).length > 0 && (n.attrs = r);
  const o = Br(t.marks);
  if (o.length > 0 && (n.marks = o), e === "text") {
    const s = U(t.text);
    return s ? (n.text = s, n) : null;
  }
  const i = Ve(t.content);
  return i.length > 0 && (n.content = i), n;
}
function Lr(t) {
  if (typeof t.text == "string")
    return "text";
  const e = w(t.attrs) ? t.attrs : {};
  return bt(e.level) > 0 || bt(t.level) > 0 ? "heading" : "";
}
function Br(t) {
  return Array.isArray(t) ? t.map((e) => {
    if (!w(e))
      return null;
    const n = U(e.type);
    return n ? {
      type: n,
      attrs: w(e.attrs) ? e.attrs : void 0
    } : null;
  }).filter(
    (e) => !!e
  ) : [];
}
function Ke(t) {
  const e = U(t);
  return Pr[e] || e;
}
function qe(t) {
  return t ? t.type === "text" ? t.text || "" : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? U(t.attrs?.alt || t.attrs?.title || t.attrs?.src) : (t.content || []).map(qe).filter(Boolean).join(" ") : "";
}
function ee(t) {
  return t ? t.type === "text" ? !!U(t.text) : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? !!U(t.attrs?.src) : (t.content || []).some(ee) : !1;
}
function Ge(t) {
  try {
    return JSON.parse(t);
  } catch {
    return;
  }
}
function jr(t) {
  return t.includes("rich_json") || t.includes('"rich"') || t.includes("agent_run_id") || t.includes("node_run_id");
}
function Fr(t) {
  try {
    return JSON.parse(`"${t}"`);
  } catch {
    return t.replace(/\\"/g, '"').replace(/\\n/g, `
`).replace(/\\t/g, "	").replace(/\\\\/g, "\\");
  }
}
function bt(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) ? e : 0;
}
function U(t) {
  return t == null ? "" : String(t).trim();
}
const wt = [
  { value: "auto", label: "自动", columns: 0, rows: 0, capacity: 9 },
  { value: "2x2", label: "2×2", columns: 2, rows: 2, capacity: 4 },
  { value: "3x2", label: "3×2", columns: 3, rows: 2, capacity: 6 },
  { value: "3x3", label: "3×3", columns: 3, rows: 3, capacity: 9 }
], vr = new Set(
  wt.map((t) => t.value)
);
function ne(t) {
  const e = String(t || "").trim().toLowerCase();
  return vr.has(e) ? e : "auto";
}
function Ye(t) {
  const e = ne(t);
  return wt.find((n) => n.value === e) || wt[0];
}
function Ur(t, e) {
  const n = Ye(t), r = Math.max(0, Math.trunc(Number(e) || 0));
  return n.value !== "auto" ? n : r === 0 || r > 6 ? { columns: 3, rows: 3, capacity: 9 } : r > 4 ? { columns: 3, rows: 2, capacity: 6 } : r > 2 ? { columns: 2, rows: 2, capacity: 4 } : { columns: 2, rows: 1, capacity: 2 };
}
function Vr(t) {
  const e = Math.max(0, Math.trunc(Number(t) || 0));
  return e <= 1 ? { columns: 1, rows: 1, capacity: 1 } : e === 2 ? { columns: 2, rows: 1, capacity: 2 } : { columns: 2, rows: 2, capacity: 4 };
}
function Kr(t, e) {
  const n = Math.max(0, Math.trunc(Number(e) || 0) - 1);
  return Math.min(
    n,
    Math.max(0, Math.trunc(Number(t) || 0))
  );
}
const qr = 50, Gr = {
  image: {
    direct: ["image", "image_url", "imageUrl"],
    collections: ["images", "image_urls", "imageUrls"]
  },
  video: {
    direct: ["video", "video_url", "videoUrl"],
    collections: ["videos", "video_urls", "videoUrls"]
  },
  audio: {
    direct: ["audio", "audio_url", "audioUrl"],
    collections: ["audios", "audio_urls", "audioUrls"]
  },
  file: {
    direct: ["file", "file_url", "fileUrl"],
    collections: ["files", "file_urls", "fileUrls"]
  }
}, Yr = [
  "rich",
  "content",
  "output",
  "result",
  "data",
  "body",
  "value",
  "json",
  "media_files",
  "mediaFiles",
  "text"
];
function re(t) {
  return Object.fromEntries(
    t.map((e) => [e, /* @__PURE__ */ new Map()])
  );
}
function St(t, e, n = {}) {
  const r = {
    media: t,
    enabledKinds: Object.keys(t),
    seen: n.seen || /* @__PURE__ */ new Set(),
    requestedKind: n.kind
  };
  $(e, r, 0, n.kind);
}
function Hr(t, e) {
  const r = re(e === "audio" ? ["audio", "image"] : [e]);
  return St(r, t, { kind: e }), He(r), Array.from(r[e].values());
}
function He(t) {
  const e = t.audio, n = t.image;
  if (!e || !n || e.size === 0 || e.size !== n.size)
    return;
  const r = Array.from(n.values());
  Array.from(e.values()).forEach((o, i) => {
    if (o.thumbnail)
      return;
    const s = We(
      "audio",
      o.url,
      r[i]?.url || ""
    );
    s && e.set(o.url, { ...o, thumbnail: s });
  });
}
function $(t, e, n, r, o = "") {
  if (t == null || n > 12)
    return;
  if (Array.isArray(t)) {
    const l = t.length > 1 ? "" : o;
    t.forEach(
      (d) => $(
        d,
        e,
        n + 1,
        r,
        l
      )
    );
    return;
  }
  if (typeof t == "string") {
    const l = ot(t);
    if (l.length > 0) {
      l.forEach(
        (m) => $(
          m,
          e,
          n + 1,
          r,
          o
        )
      );
      return;
    }
    const d = r || e.requestedKind || Xr(t);
    d && e.media[d] && Je(t) && Wr(
      e.media,
      d,
      t.trim(),
      o
    );
    return;
  }
  if (typeof t != "object" || e.seen.has(t))
    return;
  e.seen.add(t);
  const i = t, s = w(i.attrs) ? i.attrs : void 0, a = Zr(
    i.type,
    i.kind,
    i.media_type,
    i.mediaType,
    i.mime
  ), u = Jr(
    i,
    s,
    o
  ), f = r || e.requestedKind;
  if (f && e.media[f] && (!a || a === f))
    for (const l of pe(i, f))
      $(
        l,
        e,
        n + 1,
        f,
        u
      );
  for (const l of e.enabledKinds) {
    const d = Gr[l];
    for (const m of d.direct)
      $(
        i[m],
        e,
        n + 1,
        l,
        u
      );
    for (const m of d.collections)
      $(
        i[m],
        e,
        n + 1,
        l,
        u
      );
  }
  if (a && e.media[a]) {
    for (const l of pe(i, a))
      $(
        l,
        e,
        n + 1,
        a,
        u
      );
    $(
      i.attrs,
      e,
      n + 1,
      a,
      u
    );
  }
  for (const l of Yr)
    $(
      i[l],
      e,
      n + 1
    );
}
function pe(t, e) {
  const n = [
    t.url,
    t.src,
    t.file_url,
    t.fileUrl,
    t.download_url,
    t.downloadUrl
  ];
  return e === "file" && n.push(t.download, t.open_url, t.openUrl, t.path), n;
}
function Wr(t, e, n, r) {
  const o = t[e];
  if (!o)
    return;
  const i = We(
    e,
    n,
    r
  ), s = o.get(n);
  if (s?.thumbnail || !i) {
    s || o.set(n, { url: n });
    return;
  }
  o.set(n, { url: n, thumbnail: i });
}
function We(t, e, n) {
  const r = n.trim();
  return !r || t !== "image" && r === e.trim() ? "" : r;
}
function Jr(t, e, n) {
  for (const r of [
    t.thumbnail,
    t.thumbnail_url,
    t.thumbnailUrl,
    t.poster,
    t.poster_url,
    t.posterUrl,
    t.cover,
    t.cover_url,
    t.coverUrl,
    t.first_frame_url,
    t.firstFrameUrl,
    e?.thumbnail,
    e?.thumbnail_url,
    e?.thumbnailUrl,
    e?.poster,
    e?.cover,
    n
  ])
    if (typeof r == "string" && Je(r))
      return r.trim();
  return "";
}
function Zr(...t) {
  for (const e of t) {
    const n = String(e || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
    if (["image", "mediaimage", "editormediaimage"].includes(n) || n.startsWith("image/"))
      return "image";
    if (["video", "mediavideo", "editormediavideo"].includes(n) || n.startsWith("video/"))
      return "video";
    if (["audio", "music", "voice", "mediaaudio", "editormediaaudio"].includes(
      n
    ) || n.startsWith("audio/"))
      return "audio";
    if (["file", "mediafile", "editormediafile"].includes(n) || n.startsWith("application/") || n.startsWith("text/"))
      return "file";
  }
}
function Xr(t) {
  const e = t.trim();
  if (/^data:image\//i.test(e) || /\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i.test(e))
    return "image";
  if (/^data:video\//i.test(e) || /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(e))
    return "video";
  if (/^data:audio\//i.test(e) || /\.(mp3|wav|ogg|m4a|aac)(?:[?#].*)?$/i.test(e))
    return "audio";
}
function Je(t) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(t.trim());
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const $t = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!$t || Object.keys($t).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const oe = ["image", "video", "audio"], Qr = 64, to = 128 * 1024, It = /* @__PURE__ */ Symbol("content-output-cache-miss"), ye = en(), _e = en(), eo = $t, no = eo.normalizeEnergonOutput;
function L(...t) {
  for (const e of t)
    if (typeof e == "string" && e.trim())
      return e.trim();
  return "";
}
function Cs(t) {
  const e = Q(
    t,
    ["lyrics", "lyric", "lrc", "song_lyrics", "songLyrics"],
    /* @__PURE__ */ new Set(),
    0
  );
  if (e)
    return { label: "歌词", text: e };
  const n = Q(
    t,
    ["text"],
    /* @__PURE__ */ new Set(),
    0
  );
  return n ? { label: "创作内容", text: n } : null;
}
function Q(t, e, n, r) {
  if (t == null || r > 12)
    return "";
  if (typeof t == "string") {
    for (const o of ot(t)) {
      const i = Q(o, e, n, r + 1);
      if (i)
        return i;
    }
    return "";
  }
  if (Array.isArray(t)) {
    for (const o of t) {
      const i = Q(o, e, n, r + 1);
      if (i)
        return i;
    }
    return "";
  }
  if (!w(t) || n.has(t))
    return "";
  n.add(t);
  for (const o of e) {
    const i = ct(t[o], r + 1);
    if (i)
      return i;
  }
  for (const o of [
    "output",
    "result",
    "data",
    "body",
    "value",
    "json",
    "rich",
    "content"
  ]) {
    const i = Q(t[o], e, n, r + 1);
    if (i)
      return i;
  }
  return "";
}
function ct(t, e) {
  if (t == null || e > 12)
    return "";
  if (typeof t == "string") {
    const n = t.trim();
    if (!n || /^(https?:\/\/|\/|data:|blob:)/i.test(n))
      return "";
    const r = ot(n);
    return r.length > 0 ? r.map((o) => ct(o, e + 1)).filter(Boolean).join(`
`) : n;
  }
  if (Array.isArray(t))
    return t.map((n) => ct(n, e + 1)).filter(Boolean).join(`
`);
  if (!w(t))
    return "";
  for (const n of ["text", "content", "line", "lines", "value"]) {
    const r = ct(t[n], e + 1);
    if (r)
      return r;
  }
  return "";
}
function ro(t) {
  const e = Ze(t);
  return !e || e.hasMedia ? "" : e.markdown;
}
function Ze(t) {
  const e = lo(t);
  return !e || !an(e) ? null : {
    markdown: e.content.map(cn).join(`

`).trim(),
    plainText: e.content.map(dn).join(`

`).trim(),
    hasMedia: un(e)
  };
}
function oo(t) {
  return /(^|\n)\s*(#{1,6}\s|[-*+]\s|>\s|\d+\.\s|```)/m.test(t) || /(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|`[^`]+`)/.test(t);
}
function Ns(t) {
  return io(t).length > 0;
}
function io(t) {
  const e = Ot(t);
  return oe.filter((n) => e[n].size > 0);
}
function Xe(t) {
  const e = Ot(t);
  return oe.reduce(
    (n, r) => n + e[r].size,
    0
  );
}
function Os(t, e) {
  return Array.from(Ot(t)[e].keys());
}
function Qe(t, e) {
  return Array.from(Ot(t)[e].values());
}
function so(t) {
  const e = tn(t);
  return e ? Array.from(
    new Set(e.frames.map((n) => n.image.trim()).filter(Boolean))
  ) : [];
}
function tn(t) {
  const e = nn(_e, t);
  return e !== It ? e : rn(
    _e,
    t,
    ut(t, /* @__PURE__ */ new Set(), 0)
  );
}
function Rs(t, e) {
  const n = e.trim().toLowerCase();
  return n ? dt(t, n, /* @__PURE__ */ new Set(), 0) : !1;
}
function Ts(...t) {
  let e, n, r = 0;
  for (const o of t) {
    if (!Nt(o))
      continue;
    e === void 0 && (e = o);
    const i = Xe(o);
    i > r && (n = o, r = i);
  }
  return r > 0 ? n : e;
}
function Nt(t) {
  return t == null || t === "" ? !1 : Array.isArray(t) ? t.length > 0 : typeof t == "object" ? Object.keys(t).length > 0 : !0;
}
function Ot(t) {
  const e = nn(ye, t);
  if (e !== It)
    return e;
  const n = re(oe), r = so(t), o = /* @__PURE__ */ new Set();
  for (const i of sn(t))
    St(n, i, { seen: o });
  return St(n, t), He(n), r.length > 0 && (n.image = new Map(
    r.map((i) => [i, { url: i, thumbnail: i }])
  )), rn(ye, t, n);
}
function en() {
  return {
    objects: /* @__PURE__ */ new WeakMap(),
    strings: /* @__PURE__ */ new Map()
  };
}
function nn(t, e) {
  if (e && typeof e == "object")
    return t.objects.has(e) ? t.objects.get(e) : It;
  if (!on(e) || !t.strings.has(e))
    return It;
  const n = t.strings.get(e);
  return t.strings.delete(e), t.strings.set(e, n), n;
}
function rn(t, e, n) {
  if (e && typeof e == "object")
    return t.objects.set(e, n), n;
  if (!on(e))
    return n;
  for (t.strings.delete(e), t.strings.set(e, n); t.strings.size > Qr; ) {
    const r = t.strings.keys().next().value;
    if (typeof r != "string")
      break;
    t.strings.delete(r);
  }
  return n;
}
function on(t) {
  return typeof t == "string" && t.length <= to;
}
function sn(t) {
  if (!Nt(t))
    return [];
  const e = no?.(t);
  return Array.isArray(e) && e.length > 0 ? e : Array.isArray(t) ? t : [t];
}
function dt(t, e, n, r) {
  return t == null || r > 12 ? !1 : typeof t == "string" ? ot(t).some(
    (o) => dt(o, e, n, r + 1)
  ) : Array.isArray(t) ? t.some(
    (o) => dt(o, e, n, r + 1)
  ) : !w(t) || n.has(t) ? !1 : (n.add(t), String(t.type || "").trim().toLowerCase() === e ? !0 : [
    t.json,
    t.output,
    t.result,
    t.data,
    t.content,
    t.body,
    t.value,
    t.text,
    t.finalOutput,
    t.final_output,
    t.rich
  ].some(
    (o) => dt(o, e, n, r + 1)
  ));
}
function ut(t, e, n) {
  if (t == null || n > 12)
    return null;
  if (typeof t == "string") {
    const o = t.trim();
    if (!o || !o.startsWith("{") && !o.startsWith("["))
      return null;
    try {
      return ut(JSON.parse(o), e, n + 1);
    } catch {
      return null;
    }
  }
  if (Array.isArray(t)) {
    for (const o of t) {
      const i = ut(o, e, n + 1);
      if (i)
        return i;
    }
    return null;
  }
  if (!w(t) || e.has(t))
    return null;
  e.add(t);
  const r = ao(t);
  if (r)
    return r;
  for (const o of [
    "json",
    "storyboard_grid",
    "output",
    "result",
    "data",
    "content",
    "body",
    "value",
    "text",
    "rich"
  ]) {
    const i = ut(t[o], e, n + 1);
    if (i)
      return i;
  }
  return null;
}
function ao(t) {
  if (String(t.type || "").trim().toLowerCase() !== "storyboard_grid" || !Array.isArray(t.frames))
    return null;
  const e = t.frames.map(co).filter((n) => !!n).sort((n, r) => n.order - r.order);
  return e.length < 2 || e.length > qr ? null : {
    type: "storyboard_grid",
    version: Math.max(1, Math.trunc(Number(t.version) || 1)),
    title: L(t.title, "宫格图片"),
    summary: L(t.summary),
    frames: e
  };
}
function co(t, e) {
  if (!w(t))
    return null;
  const n = Math.max(1, Math.trunc(Number(t.order) || e + 1));
  return {
    id: L(t.id, `frame-${String(n).padStart(2, "0")}`),
    order: n,
    title: L(
      t.title,
      `画面 ${String(n).padStart(2, "0")}`
    ),
    description: L(t.description),
    prompt: L(t.prompt),
    status: L(t.status),
    image: uo(
      t.image,
      t.image_url,
      t.imageUrl
    ),
    error: L(t.error),
    assetID: ge(t.asset_id, t.assetId, t.assetID),
    assetVersionID: ge(
      t.asset_version_id,
      t.assetVersionId,
      t.assetVersionID
    )
  };
}
function uo(...t) {
  for (const e of t) {
    const n = re(["image"]);
    St(n, e, { kind: "image" });
    const r = n.image.values().next().value;
    if (r?.url)
      return r.url;
  }
  return "";
}
function ge(...t) {
  for (const e of t) {
    const n = Math.trunc(Number(e) || 0);
    if (n > 0)
      return n;
  }
  return 0;
}
function lo(t) {
  return w(t) ? t.type === "doc" && Array.isArray(t.content) ? t : w(t.rich) && t.rich.type === "doc" && Array.isArray(t.rich.content) ? t.rich : null : null;
}
function an(t) {
  return w(t) ? t.type === "text" ? !Array.isArray(t.marks) || t.marks.length === 0 : t.type === "hardBreak" ? !0 : Rt(t) ? !!ln(t) : t.type !== "doc" && t.type !== "paragraph" ? !1 : Array.isArray(t.content) && t.content.every(an) : !1;
}
function cn(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : Rt(t) ? `![${fo(
    String(t.attrs?.alt || t.attrs?.caption || "图片")
  )}](<${mo(ln(t))}>)` : Array.isArray(t.content) ? t.content.map(cn).join("") : "";
}
function dn(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : Rt(t) ? "" : Array.isArray(t.content) ? t.content.map(dn).join("") : "";
}
function un(t) {
  return Rt(t) || !!t.content?.some((e) => un(e));
}
function Rt(t) {
  return ["image", "mediaImage", "editorMediaImage"].includes(
    String(t.type || "")
  );
}
function ln(t) {
  return String(t.attrs?.src || "").trim();
}
function fo(t) {
  return t.replace(/([\\\[\]])/g, "\\$1");
}
function mo(t) {
  return t.replace(/</g, "%3C").replace(/>/g, "%3E");
}
const fn = {
  image: "images",
  audio: "audios",
  video: "videos",
  file: "files"
};
function Es(t, e) {
  const n = fn[t], r = n ? ie(e, t) : [];
  if (n && r.length > 0)
    return { [n]: r };
  const o = te(e);
  if (!o)
    return e;
  const i = Ze(o);
  return i && (t === "text" || oo(i.plainText)) ? { text: i.markdown } : { rich: o };
}
function po(t, e) {
  return ie(t, e)[0] || "";
}
function ie(t, e) {
  return yo(t, e).map((n) => n.url);
}
function yo(t, e) {
  return _o(e) ? Hr(t, e) : [];
}
function Ps(t, e) {
  if (!fn[e])
    return 0;
  const n = ie(t, e).length;
  if (!t || typeof t != "object" || Array.isArray(t))
    return n;
  const r = Number(
    t.media_count || 0
  );
  return Math.max(
    n,
    Number.isFinite(r) ? Math.trunc(r) : 0
  );
}
function _o(t) {
  return t === "image" || t === "video" || t === "audio" || t === "file";
}
function he(t, e = 0) {
  if (e > 8 || t == null) return "";
  if (typeof t == "string") return mn(t) ? "" : t.trim();
  if (Array.isArray(t))
    return t.map((r) => he(r, e + 1)).filter(Boolean)[0] || "";
  if (typeof t != "object") return "";
  const n = t;
  for (const r of [
    "summary",
    "title",
    "text",
    "caption",
    "content",
    "output",
    "result"
  ]) {
    const o = he(n[r], e + 1);
    if (o) return o;
  }
  return "";
}
function zs(t) {
  const e = t?.source?.prompt;
  return typeof e == "string" ? e.trim() : "";
}
function $s(t) {
  const e = po(t, "file"), n = lt(t) || Jn(e), r = n.match(/\.([a-z0-9]{1,10})$/i)?.[1] || "";
  return { url: e, name: n, extension: r };
}
function lt(t, e = 0) {
  if (t == null || e > 8) return "";
  if (typeof t == "string") {
    const r = t.trim();
    return mn(r) ? "" : r;
  }
  if (Array.isArray(t)) {
    for (const r of t) {
      const o = lt(r, e + 1);
      if (o) return o;
    }
    return "";
  }
  if (typeof t != "object") return "";
  const n = t;
  for (const r of [
    "name",
    "file_name",
    "fileName",
    "filename",
    "label",
    "title"
  ]) {
    const o = lt(n[r], e + 1);
    if (o) return o;
  }
  for (const r of [
    "file",
    "files",
    "attrs",
    "data",
    "content",
    "output",
    "result"
  ]) {
    const o = lt(n[r], e + 1);
    if (o) return o;
  }
  return "";
}
function mn(t) {
  return /^(https?:\/\/|\/|data:|blob:)/.test(t.trim());
}
await window.DeverFront?.ensureCompat?.(["@/page/nodes/show/tooltip"]);
const Lt = window.DeverFront?.sdk?.getCompatModule("@/page/nodes/show/tooltip");
if (!Lt || Object.keys(Lt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/page/nodes/show/tooltip");
const go = Lt.HoverTip, ho = 12e3;
function be({
  label: t,
  side: e = "top",
  sideOffset: n = 7,
  className: r = "",
  children: o
}) {
  return /* @__PURE__ */ c(
    go,
    {
      content: t,
      side: e,
      sideOffset: n,
      layerZIndex: ho,
      className: `max-w-80 whitespace-normal break-words ${r}`.trim(),
      children: o
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const Bt = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!Bt || Object.keys(Bt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const we = Bt, Se = we.ContentView || we.EnergonContentView;
function bo({
  output: t,
  fallback: e = "",
  streaming: n = !1,
  emptyText: r = "暂无内容",
  className: o,
  markdownClassName: i,
  richClassName: s,
  mediaLayout: a = "default"
}) {
  const u = pn(t, e);
  return Se ? /* @__PURE__ */ c(ft, { className: o, children: /* @__PURE__ */ c(
    Se,
    {
      output: u,
      streaming: n,
      emptyText: r,
      markdownClassName: i,
      richClassName: s,
      mediaLayout: a
    }
  ) }) : e ? /* @__PURE__ */ c("div", { className: o, children: e }) : null;
}
function pn(t, e = "") {
  return Nt(t) ? t : e ? { text: e } : t;
}
function ft({
  className: t,
  children: e
}) {
  const n = (r) => {
    wo(r.target) && r.stopPropagation();
  };
  return /* @__PURE__ */ c(
    "div",
    {
      className: t,
      onPointerDown: n,
      onClick: n,
      children: e
    }
  );
}
function wo(t) {
  return t instanceof Element && !!t.closest(
    "a, button, input, textarea, select, audio, video, [role='button']"
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const jt = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!jt || Object.keys(jt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const So = jt.EnergonAudioPlayer;
function Ls({
  src: t,
  prompt: e = "",
  detailed: n = !1,
  autoPlay: r = !1
}) {
  const o = /* @__PURE__ */ c(
    "div",
    {
      className: [
        "wb-asset-audio-preview",
        n ? "is-detail" : ""
      ].filter(Boolean).join(" "),
      children: /* @__PURE__ */ c(
        So,
        {
          src: t,
          detailed: n,
          autoPlay: r,
          className: "h-full min-h-0 border-0 bg-transparent p-0 shadow-none"
        }
      )
    }
  );
  return n ? /* @__PURE__ */ _("div", { className: "wb-asset-audio-detail", children: [
    o,
    e ? /* @__PURE__ */ _("section", { className: "wb-asset-audio-prompt", children: [
      /* @__PURE__ */ _("header", { children: [
        /* @__PURE__ */ c(tr, { "aria-hidden": "true" }),
        /* @__PURE__ */ c("strong", { children: "语音文本" })
      ] }),
      /* @__PURE__ */ c("p", { children: e })
    ] }) : null
  ] }) : o;
}
const Bs = 10040;
function Io({
  ariaLabel: t,
  header: e,
  children: n,
  onRequestClose: r,
  layer: o = "default"
}) {
  const i = /* @__PURE__ */ c(
    "div",
    {
      className: `wb-detail-backdrop ${o === "nested" ? "is-nested" : ""}`.trim(),
      "data-slot": "dialog-layer",
      role: "presentation",
      onMouseDown: () => {
        r();
      },
      children: /* @__PURE__ */ _(
        "section",
        {
          className: "wb-detail-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": t,
          onMouseDown: (s) => s.stopPropagation(),
          children: [
            e,
            n
          ]
        }
      )
    }
  );
  return typeof document > "u" ? null : Wn(i, document.body);
}
function Ao({
  icon: t,
  title: e,
  subtitle: n,
  versionSelect: r,
  state: o,
  updatedAt: i,
  actions: s,
  downloadUrl: a,
  onClose: u
}) {
  return /* @__PURE__ */ _("header", { className: "wb-detail-head", children: [
    /* @__PURE__ */ _("div", { className: "wb-detail-heading", children: [
      /* @__PURE__ */ c("span", { className: "wb-detail-kind-icon", "aria-hidden": "true", children: t }),
      /* @__PURE__ */ _("div", { children: [
        /* @__PURE__ */ c("strong", { children: e || "详情" }),
        n ? /* @__PURE__ */ c("span", { children: n }) : null
      ] })
    ] }),
    /* @__PURE__ */ _("div", { className: "wb-detail-meta", children: [
      r,
      o,
      i ? /* @__PURE__ */ c("time", { children: i }) : null
    ] }),
    /* @__PURE__ */ _("div", { className: "wb-detail-actions", children: [
      s,
      a ? /* @__PURE__ */ c(be, { label: "下载内容", children: /* @__PURE__ */ c(
        Zn,
        {
          url: a,
          name: e,
          className: "wb-detail-icon-button"
        }
      ) }) : null,
      /* @__PURE__ */ c(be, { label: "关闭", children: /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "wb-detail-icon-button",
          onClick: u,
          "aria-label": "关闭详情",
          children: /* @__PURE__ */ c(er, { size: 18 })
        }
      ) })
    ] })
  ] });
}
function js({
  options: t,
  currentVersionId: e,
  selectedVersionId: n,
  total: r,
  hasMore: o,
  loading: i,
  loadingMore: s,
  error: a,
  disabled: u = !1,
  onSelect: f,
  onLoadMore: l,
  onRetry: d
}) {
  const [m, p] = z(!1), g = ze(null), h = t.find((y) => y.id === n) || t.find((y) => y.id === e);
  return _t(() => {
    if (!m) return;
    const y = (A) => {
      g.current?.contains(A.target) || p(!1);
    };
    return document.addEventListener("mousedown", y), () => document.removeEventListener("mousedown", y);
  }, [m]), !n && !i ? null : /* @__PURE__ */ _("div", { className: "wb-detail-version-select", ref: g, children: [
    /* @__PURE__ */ _(
      "button",
      {
        type: "button",
        className: "wb-detail-version-trigger",
        "aria-haspopup": "listbox",
        "aria-expanded": m,
        disabled: u || i && t.length === 0,
        onClick: () => p((y) => !y),
        children: [
          i && t.length === 0 ? /* @__PURE__ */ c(Z, { size: 12, className: "wb-detail-spin" }) : null,
          /* @__PURE__ */ c("span", { children: Ae(h?.version) }),
          r > 0 ? /* @__PURE__ */ _("small", { children: [
            r,
            " 个版本"
          ] }) : null,
          /* @__PURE__ */ c(Ee, { size: 13 })
        ]
      }
    ),
    m ? /* @__PURE__ */ c("div", { className: "wb-detail-version-menu", role: "listbox", children: /* @__PURE__ */ _(
      "div",
      {
        className: "wb-detail-version-options",
        onScroll: (y) => {
          const A = y.currentTarget;
          o && !s && A.scrollHeight - A.scrollTop - A.clientHeight < 36 && l();
        },
        children: [
          t.length > 0 ? t.map((y) => {
            const A = y.id === n, x = y.id === e;
            return /* @__PURE__ */ _(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": A,
                className: A ? "is-selected" : "",
                onClick: () => {
                  p(!1), f(y.value);
                },
                children: [
                  /* @__PURE__ */ _("span", { children: [
                    /* @__PURE__ */ c("strong", { children: Ae(y.version) }),
                    x ? /* @__PURE__ */ c("small", { children: "当前" }) : null
                  ] }),
                  /* @__PURE__ */ c("time", { children: ko(y.updatedAt) }),
                  A ? /* @__PURE__ */ c(Pe, { size: 13 }) : /* @__PURE__ */ c("i", { "aria-hidden": "true" })
                ]
              },
              y.id
            );
          }) : a ? /* @__PURE__ */ c(Ie, { error: a, onRetry: d }) : /* @__PURE__ */ _("div", { className: "wb-detail-version-message", children: [
            i ? /* @__PURE__ */ c(Z, { size: 14, className: "wb-detail-spin" }) : null,
            /* @__PURE__ */ c("span", { children: i ? "正在读取版本" : "暂无版本" })
          ] }),
          a && t.length > 0 ? /* @__PURE__ */ c(Ie, { error: a, onRetry: d }) : null,
          s ? /* @__PURE__ */ _("div", { className: "wb-detail-version-loading", children: [
            /* @__PURE__ */ c(Z, { size: 13, className: "wb-detail-spin" }),
            "正在加载更多"
          ] }) : null
        ]
      }
    ) }) : null
  ] });
}
function Ie({
  error: t,
  onRetry: e
}) {
  return /* @__PURE__ */ _("div", { className: "wb-detail-version-message is-error", children: [
    /* @__PURE__ */ c("span", { children: t }),
    /* @__PURE__ */ _("button", { type: "button", onClick: e, children: [
      /* @__PURE__ */ c(nr, { size: 12 }),
      "重试"
    ] })
  ] });
}
function Ae(t) {
  const e = Number(t || 0);
  return e > 0 ? `第${e}版` : "版本";
}
function ko(t) {
  const e = String(t || "").trim();
  return e ? e.replace("T", " ").replace(/\.\d+(Z)?$/, "").replace(/Z$/, "") : "";
}
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const Ft = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!Ft || Object.keys(Ft).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const xo = Ft.FirstFrameVideo, Do = 56;
function ke(t, e) {
  const n = t.getBoundingClientRect(), r = Math.min(
    Do,
    n.height * 0.25
  );
  return e >= n.bottom - r;
}
function Mo({
  src: t,
  poster: e = "",
  alt: n = "",
  className: r,
  style: o,
  title: i,
  draggable: s = !1,
  ariaLabel: a,
  onLoad: u,
  onError: f,
  onMediaSize: l,
  objectFit: d = "cover",
  allowDragFromVideo: m = !1
}) {
  const p = ze(null), [g, h] = z(""), [y, A] = z(""), [x, T] = z(""), [b, j] = z(""), C = g === t, M = y === t, Et = x !== t && b !== t;
  _t(() => {
    const D = p.current;
    if (!D || !m) return;
    const Y = (H) => {
      ke(D, H.clientY) && H.stopPropagation();
    }, de = (H) => {
      const ue = H.touches[0];
      ue && ke(D, ue.clientY) && H.stopPropagation();
    };
    return D.addEventListener("mousedown", Y), D.addEventListener("touchstart", de, {
      passive: !0
    }), () => {
      D.removeEventListener("mousedown", Y), D.removeEventListener("touchstart", de);
    };
  }, [m]);
  function G(D) {
    D.stopPropagation();
  }
  function ce() {
    h((D) => D === t ? "" : D), A((D) => D === t ? "" : D);
  }
  function Yn(D) {
    D.preventDefault(), D.stopPropagation();
    const Y = p.current;
    Y && (h(t), A(""), Y.play().catch(() => {
      ce(), f?.();
    }));
  }
  return /* @__PURE__ */ _(
    "div",
    {
      className: [
        "relative isolate block h-full w-full overflow-hidden bg-muted",
        r
      ].filter(Boolean).join(" "),
      style: o,
      title: i,
      draggable: s,
      children: [
        /* @__PURE__ */ c(
          xo,
          {
            videoRef: p,
            src: t,
            poster: e || void 0,
            controls: C,
            playsInline: !0,
            preload: "none",
            draggable: s,
            "aria-hidden": M ? void 0 : !0,
            className: [
              m ? "" : "nodrag",
              "nopan nowheel absolute inset-0 block h-full w-full",
              M ? "opacity-100" : "pointer-events-none opacity-0"
            ].join(" "),
            style: { objectFit: d },
            onPointerDown: m ? void 0 : G,
            onClick: G,
            onLoadedMetadata: (D) => l?.(
              D.currentTarget.videoWidth,
              D.currentTarget.videoHeight
            ),
            onPlaying: () => A(t),
            onError: () => {
              ce(), f?.();
            }
          }
        ),
        M ? null : /* @__PURE__ */ _(Te, { children: [
          /* @__PURE__ */ c(
            Xn,
            {
              src: t,
              poster: e,
              alt: n,
              className: "pointer-events-none absolute inset-0 z-[1] block h-full w-full",
              style: { objectFit: d },
              draggable: s,
              ariaHidden: !0,
              onLoad: () => {
                T(t), u?.();
              },
              onError: () => {
                j(t), f?.();
              },
              onMediaSize: l
            }
          ),
          C ? /* @__PURE__ */ c(
            "span",
            {
              className: "pointer-events-none absolute left-1/2 top-1/2 z-[2] inline-flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white shadow-lg backdrop-blur-sm",
              role: "status",
              "aria-label": "正在加载视频",
              children: /* @__PURE__ */ c(
                Z,
                {
                  size: 16,
                  className: "animate-spin",
                  "aria-hidden": "true"
                }
              )
            }
          ) : /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "nodrag nopan nowheel absolute left-1/2 top-1/2 z-[2] inline-flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/65 p-0 text-white shadow-lg backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80",
              "aria-label": a ? `播放${a}` : "播放视频",
              onPointerDown: G,
              onClick: Yn,
              children: Et ? /* @__PURE__ */ c(
                Z,
                {
                  size: 16,
                  className: "animate-spin",
                  "aria-hidden": "true"
                }
              ) : /* @__PURE__ */ c(
                rr,
                {
                  size: 16,
                  className: "translate-x-px fill-current",
                  "aria-hidden": "true"
                }
              )
            }
          )
        ] })
      ]
    }
  );
}
function yn(t, e) {
  const n = Ur(e, t), r = Math.max(1, Math.ceil(t / n.capacity)), [o, i] = z(0), s = Kr(o, r);
  return {
    shape: n,
    pageCount: r,
    pageIndex: s,
    pageOffset: s * n.capacity,
    setPageIndex: i
  };
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/dropdown-menu", "@/components/energon/content-view"]);
const V = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dropdown-menu");
if (!V || Object.keys(V).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const Co = V.DropdownMenu, No = V.DropdownMenuContent, Oo = V.DropdownMenuItem, Ro = V.DropdownMenuTrigger, vt = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!vt || Object.keys(vt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const To = vt.EnergonAudioPlayer, Eo = {
  image: "图片",
  video: "视频",
  audio: "音频"
}, Po = {
  image: "张",
  video: "个",
  audio: "个"
};
function _n({
  layout: t,
  countLabel: e,
  pageIndex: n,
  pageCount: r,
  disabled: o = !1,
  leading: i,
  actions: s,
  onLayoutChange: a,
  onPageChange: u
}) {
  const f = ne(t), l = Ye(f);
  return /* @__PURE__ */ _("header", { className: "ws-media-grid-toolbar", children: [
    /* @__PURE__ */ _("div", { className: "ws-media-grid-toolbar-main", children: [
      i,
      /* @__PURE__ */ _(Co, { modal: !1, children: [
        /* @__PURE__ */ c(Ro, { asChild: !0, children: /* @__PURE__ */ _(
          "button",
          {
            type: "button",
            className: "ws-media-grid-layout-trigger nodrag nopan",
            disabled: o || !a,
            "aria-label": "选择每页宫格布局",
            onClick: (d) => d.stopPropagation(),
            children: [
              /* @__PURE__ */ c(or, { size: 14 }),
              l.label,
              /* @__PURE__ */ c(Ee, { size: 12 })
            ]
          }
        ) }),
        /* @__PURE__ */ c(
          No,
          {
            align: "start",
            className: "ws-media-grid-layout-menu",
            onClick: (d) => d.stopPropagation(),
            children: wt.map((d) => /* @__PURE__ */ _(
              Oo,
              {
                className: "ws-media-grid-layout-item",
                onSelect: () => {
                  u(0), a?.(d.value);
                },
                children: [
                  /* @__PURE__ */ c("span", { children: d.label }),
                  /* @__PURE__ */ c("small", { children: d.value === "auto" ? "按结果排版" : `每页 ${d.capacity} 格` }),
                  d.value === f ? /* @__PURE__ */ c(Pe, { size: 13 }) : null
                ]
              },
              d.value
            ))
          }
        )
      ] }),
      /* @__PURE__ */ c("span", { className: "ws-media-grid-count", children: e }),
      r > 1 ? /* @__PURE__ */ _("div", { className: "ws-media-grid-page-controls", "aria-label": "宫格分页", children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: n <= 0,
            title: "上一页",
            "aria-label": "上一页",
            onClick: (d) => {
              d.stopPropagation(), u(Math.max(0, n - 1));
            },
            children: /* @__PURE__ */ c(ir, { size: 14 })
          }
        ),
        /* @__PURE__ */ _("span", { children: [
          n + 1,
          "/",
          r
        ] }),
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: n >= r - 1,
            title: "下一页",
            "aria-label": "下一页",
            onClick: (d) => {
              d.stopPropagation(), u(Math.min(r - 1, n + 1));
            },
            children: /* @__PURE__ */ c(sr, { size: 14 })
          }
        )
      ] }) : null
    ] }),
    s ? /* @__PURE__ */ c("div", { className: "ws-media-grid-toolbar-actions", children: s }) : null
  ] });
}
function zo({
  kind: t,
  items: e,
  label: n,
  compact: r = !1
}) {
  const [o, i] = z("auto"), s = yn(e.length, o), a = r ? Vr(e.length) : s.shape, u = r ? 0 : s.pageOffset, f = e.slice(u, u + a.capacity), l = Array.from(
    { length: a.capacity },
    (p, g) => f[g]
  ), d = Eo[t], m = Po[t];
  return /* @__PURE__ */ _(
    "section",
    {
      className: `ws-media-grid-view is-${t}${r ? " is-compact" : ""}`,
      children: [
        r ? /* @__PURE__ */ c(
          "span",
          {
            className: "ws-media-grid-compact-count",
            "aria-label": `共 ${e.length} ${m}`,
            children: e.length > a.capacity ? `共${e.length}${m}` : `${e.length}${m}`
          }
        ) : /* @__PURE__ */ c(
          _n,
          {
            layout: o,
            countLabel: `${e.length} ${m}`,
            pageIndex: s.pageIndex,
            pageCount: s.pageCount,
            onLayoutChange: i,
            onPageChange: s.setPageIndex
          }
        ),
        /* @__PURE__ */ c("div", { className: "ws-media-grid-body nowheel", children: /* @__PURE__ */ c(
          "div",
          {
            className: "ws-media-grid-list",
            style: {
              gridTemplateColumns: `repeat(${a.columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${a.rows}, minmax(0, 1fr))`
            },
            children: l.map((p, g) => {
              const h = u + g, y = `${n || d} ${h + 1}`;
              return p ? /* @__PURE__ */ c(
                "figure",
                {
                  className: t === "audio" ? "is-audio" : void 0,
                  "aria-label": t === "audio" ? y : void 0,
                  children: /* @__PURE__ */ c($o, { kind: t, item: p, label: y })
                },
                `${p.url}-${h}`
              ) : /* @__PURE__ */ c("figure", { className: "is-empty" }, `empty-${h}`);
            })
          }
        ) })
      ]
    }
  );
}
function $o({
  kind: t,
  item: e,
  label: n
}) {
  const { url: r } = e;
  return t === "image" ? /* @__PURE__ */ c(
    "img",
    {
      src: r,
      alt: n,
      loading: "lazy",
      decoding: "async",
      draggable: !1
    }
  ) : t === "video" ? /* @__PURE__ */ c(
    Mo,
    {
      src: r,
      poster: e.thumbnail,
      draggable: !1,
      ariaLabel: n,
      objectFit: "cover"
    },
    r
  ) : /* @__PURE__ */ _(
    "div",
    {
      className: `ws-media-grid-audio-card${e.thumbnail ? " has-cover" : ""}`,
      children: [
        e.thumbnail ? /* @__PURE__ */ c("img", { src: e.thumbnail, alt: "", loading: "lazy", decoding: "async" }) : null,
        /* @__PURE__ */ c(
          To,
          {
            src: r,
            preload: "none",
            className: "ws-media-grid-audio-player nodrag nopan"
          }
        )
      ]
    }
  );
}
function Lo({
  items: t,
  initialItemID: e,
  onClose: n
}) {
  const r = xe(t, e), [o, i] = z(r), s = t.map((f) => `${String(f.id)}:${f.url}`).join(`
`);
  _t(() => {
    i(xe(t, e));
  }, [e, s]), _t(() => {
    const f = (l) => {
      l.key === "Escape" && n();
    };
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, [n]);
  const a = Math.min(
    Math.max(0, o),
    Math.max(0, t.length - 1)
  ), u = t[a];
  return u ? /* @__PURE__ */ c(
    Io,
    {
      ariaLabel: "图片预览",
      layer: "nested",
      onRequestClose: n,
      header: /* @__PURE__ */ c(
        Ao,
        {
          icon: /* @__PURE__ */ c(ar, { size: 16 }),
          title: u.name || "图片预览",
          subtitle: `图片 ${a + 1}/${t.length}`,
          downloadUrl: u.url,
          onClose: n
        }
      ),
      children: /* @__PURE__ */ c("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ c(
        Qn,
        {
          kind: "image",
          items: t,
          activeIndex: a,
          onSelect: i
        }
      ) })
    }
  ) : null;
}
function xe(t, e) {
  const n = t.findIndex((r) => String(r.id) === String(e));
  return n >= 0 ? n : 0;
}
function gn({
  grid: t,
  variant: e = "compact",
  readonly: n = !0,
  renderFrameAction: r,
  onFrameChange: o,
  onFrameImport: i,
  onEmptyFrameImport: s,
  capacity: a,
  showHeader: u = !0,
  showCaptions: f = !0,
  columns: l,
  rows: d,
  frameOffset: m = 0,
  previewFrames: p
}) {
  const [g, h] = z(
    null
  ), y = dr(
    () => (p || t.frames).filter((b) => !!b.image).map((b) => ({
      id: b.id || b.order,
      name: b.title || `画面 ${b.order}`,
      url: b.image,
      thumbnail: b.image
    })),
    [t.frames, p]
  ), A = Math.max(
    t.frames.length,
    Math.trunc(Number(a) || 0)
  ), x = Array.from(
    { length: A },
    (b, j) => t.frames[j]
  ), T = {
    ...l ? { gridTemplateColumns: `repeat(${l}, minmax(0, 1fr))` } : {},
    ...d ? { gridTemplateRows: `repeat(${d}, minmax(0, 1fr))` } : {}
  };
  return /* @__PURE__ */ _("section", { className: `ws-storyboard-grid-output is-${e}`, children: [
    u ? /* @__PURE__ */ _("header", { children: [
      /* @__PURE__ */ c("strong", { children: t.title }),
      t.summary ? /* @__PURE__ */ c("p", { children: t.summary }) : null
    ] }) : null,
    /* @__PURE__ */ c(
      "div",
      {
        className: "ws-storyboard-grid-output-list",
        "data-count": x.length,
        style: T,
        children: x.map((b, j) => {
          const C = m + j;
          return b ? /* @__PURE__ */ _("figure", { className: b.image ? "" : "is-empty", children: [
            b.image ? /* @__PURE__ */ c(
              Bo,
              {
                frame: b,
                onPreview: () => h(b.id || b.order)
              },
              `${b.id}:${b.image}`
            ) : i ? /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-empty nodrag nopan",
                title: "导入图片",
                "aria-label": `向第 ${b.order} 格导入图片`,
                onClick: (M) => {
                  M.preventDefault(), M.stopPropagation(), i(b, C);
                },
                children: /* @__PURE__ */ c(X, { size: 18 })
              }
            ) : /* @__PURE__ */ c("div", { className: "ws-storyboard-grid-output-error", children: b.error || "暂无图片" }),
            b.image && i ? /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-import nodrag nopan",
                title: "替换图片",
                "aria-label": `替换第 ${b.order} 格图片`,
                onClick: (M) => {
                  M.preventDefault(), M.stopPropagation(), i(b, C);
                },
                children: /* @__PURE__ */ c(X, { size: 14 })
              }
            ) : null,
            f ? /* @__PURE__ */ _("figcaption", { children: [
              /* @__PURE__ */ c("span", { children: String(b.order).padStart(2, "0") }),
              e === "detail" && !n && o ? /* @__PURE__ */ c(
                "input",
                {
                  value: b.title,
                  "aria-label": `第 ${b.order} 格标题`,
                  onChange: (M) => o(C, { title: M.target.value })
                }
              ) : /* @__PURE__ */ c("strong", { children: b.title })
            ] }) : null,
            e === "detail" ? /* @__PURE__ */ _("div", { className: "ws-storyboard-grid-output-details", children: [
              n || !o ? /* @__PURE__ */ c("p", { children: b.description || "暂无画面说明" }) : /* @__PURE__ */ c(
                "textarea",
                {
                  value: b.description,
                  rows: 3,
                  "aria-label": `第 ${b.order} 格说明`,
                  placeholder: "画面说明",
                  onChange: (M) => o(C, {
                    description: M.target.value
                  })
                }
              ),
              r ? /* @__PURE__ */ c("div", { className: "ws-storyboard-grid-output-actions", children: r(b, C) }) : null
            ] }) : null
          ] }, b.id) : /* @__PURE__ */ c("figure", { className: "is-empty", children: s ? /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "ws-storyboard-grid-frame-empty nodrag nopan",
              title: "导入图片",
              "aria-label": `向第 ${C + 1} 格导入图片`,
              onClick: (M) => {
                M.preventDefault(), M.stopPropagation(), s(C);
              },
              children: /* @__PURE__ */ c(X, { size: 18 })
            }
          ) : null }, `empty-${C}`);
        })
      }
    ),
    g != null && y.length > 0 ? /* @__PURE__ */ c(
      Lo,
      {
        items: y,
        initialItemID: g,
        onClose: () => h(null)
      }
    ) : null
  ] });
}
function Bo({
  frame: t,
  onPreview: e
}) {
  const [n, r] = z(!1);
  return n ? /* @__PURE__ */ c("div", { className: "ws-storyboard-grid-output-error", children: t.error || "图片加载失败" }) : /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      className: "ws-storyboard-grid-image nodrag nopan",
      title: "预览图片",
      "aria-label": `预览第 ${t.order} 格图片`,
      onClick: (o) => {
        o.preventDefault(), o.stopPropagation(), e();
      },
      children: /* @__PURE__ */ c(
        "img",
        {
          src: t.image,
          alt: t.title,
          loading: "lazy",
          decoding: "async",
          onError: () => r(!0)
        }
      )
    }
  );
}
function Fs({
  grid: t,
  aspectRatio: e,
  running: n = !1,
  onImport: r,
  onFrameImport: o,
  onSlotImport: i,
  onEdit: s,
  layout: a = "auto",
  onLayoutChange: u
}) {
  const f = ne(a), l = t?.frames.length || 0, d = yn(l, f), m = t ? {
    ...t,
    frames: t.frames.slice(
      d.pageOffset,
      d.pageOffset + d.shape.capacity
    )
  } : null, p = t?.frames.filter((h) => h.image).length || 0, g = l > 0 && p !== l ? `${p}/${l} 张` : `${l} 张`;
  return /* @__PURE__ */ _(
    "section",
    {
      className: `ws-storyboard-grid-canvas ${n ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ c(
          _n,
          {
            layout: f,
            countLabel: g,
            pageIndex: d.pageIndex,
            pageCount: d.pageCount,
            disabled: n || !u,
            leading: /* @__PURE__ */ _("span", { children: [
              "比例 ",
              e || "自动"
            ] }),
            actions: r || t && s ? /* @__PURE__ */ _(Te, { children: [
              r ? /* @__PURE__ */ _(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: n,
                  onClick: (h) => {
                    h.stopPropagation(), r();
                  },
                  children: [
                    /* @__PURE__ */ c(X, { size: 14 }),
                    /* @__PURE__ */ c("span", { children: t ? "批量导入" : "导入图片" })
                  ]
                }
              ) : null,
              t && s ? /* @__PURE__ */ _(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: n,
                  onClick: (h) => {
                    h.stopPropagation(), s();
                  },
                  children: [
                    /* @__PURE__ */ c(cr, { size: 14 }),
                    /* @__PURE__ */ c("span", { children: "编辑" })
                  ]
                }
              ) : null
            ] }) : void 0,
            onLayoutChange: u,
            onPageChange: d.setPageIndex
          }
        ),
        /* @__PURE__ */ c("div", { className: "ws-storyboard-grid-canvas-body nowheel", children: m ? /* @__PURE__ */ c(
          gn,
          {
            grid: m,
            previewFrames: t?.frames,
            capacity: d.shape.capacity,
            columns: d.shape.columns,
            rows: d.shape.rows,
            frameOffset: d.pageOffset,
            showHeader: !1,
            showCaptions: !1,
            onFrameImport: n ? void 0 : o,
            onEmptyFrameImport: n ? void 0 : i
          }
        ) : /* @__PURE__ */ c(
          "div",
          {
            className: "ws-storyboard-grid-placeholder",
            "aria-busy": n,
            style: {
              gridTemplateColumns: `repeat(${d.shape.columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${d.shape.rows}, minmax(0, 1fr))`
            },
            children: Array.from({ length: d.shape.capacity }, (h, y) => /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "nodrag nopan",
                disabled: n || !i,
                title: "导入图片",
                "aria-label": `向宫格导入图片，第 ${y + 1} 格`,
                onClick: (A) => {
                  A.stopPropagation(), i?.(y);
                },
                children: /* @__PURE__ */ c(X, { size: 18 })
              },
              y
            ))
          }
        ) })
      ]
    }
  );
}
function se(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  for (const o of t) {
    if (!w(o))
      continue;
    const i = tt(o.asset_id ?? o.assetId), s = wn(o.kind), a = Vt(o.purpose);
    if (!i || !s || !a || r.has(i))
      continue;
    let u = String(o.key || "").trim() || Ut(i);
    if (n.has(u) && (u = Ut(i)), n.has(u))
      continue;
    const f = tt(o.version_id ?? o.versionId), l = String(o.label || "").trim() || `参考素材 ${e.length + 1}`;
    e.push({
      key: u,
      asset_id: i,
      ...f ? { version_id: f } : {},
      label: l,
      kind: s,
      purpose: a
    }), n.add(u), r.add(i);
  }
  return e;
}
function vs(t, e, n, r, o, i) {
  const s = new Map(
    se(e).map((d) => [
      d.asset_id,
      d
    ])
  ), a = new Map(
    n.flatMap((d) => {
      const m = tt(d.refId);
      return m ? [[m, d]] : [];
    })
  ), u = [], f = (t?.parts || []).map((d) => ({ ...d })), l = /* @__PURE__ */ new Set();
  for (const [d, m] of (t?.parts || []).entries()) {
    if (m.type !== "reference" || m.ref_type !== "asset")
      continue;
    const p = tt(m.ref_id);
    if (!p || l.has(p))
      continue;
    const g = s.get(p), h = a.get(p), y = wn(h?.kind) || g?.kind;
    if (!y)
      continue;
    const A = tt(h?.versionID || m.ref_version_id), x = String(h?.title || m.label || g?.label || "").trim() || `参考素材 ${u.length + 1}`, T = hn(
      y,
      o,
      i
    ), b = Vt(m.purpose), j = Vt(
      g?.purpose
    ), C = [b, j].find(
      (Et) => T.some((G) => G.value === Et)
    ) || Fo(
      r,
      x,
      y,
      o,
      i
    ), M = f[d];
    M?.type === "reference" && (M.purpose = C || void 0), u.push({
      key: g?.key || Ut(p),
      asset_id: p,
      ...A ? { version_id: A } : {},
      label: x,
      kind: y,
      purpose: C
    }), l.add(p);
  }
  return {
    content: t ? { ...t, parts: f } : void 0,
    references: u
  };
}
function Us(t, e) {
  return e.filter(
    (n) => n.work_types.length === 0 || n.work_types.includes(t)
  ).map((n) => ({
    key: n.key,
    label: n.name,
    acceptedKinds: [...n.media_kinds]
  }));
}
function hn(t, e, n) {
  return n.filter(
    (r) => r.media_kinds.includes(t) && (r.work_types.length === 0 || r.work_types.includes(e))
  ).map((r) => ({ value: r.key, label: r.name }));
}
function bn(t, e) {
  return e.find((n) => n.key === t);
}
function jo(t, e) {
  return bn(t, e)?.name || t;
}
function Vs(t, e, n, r) {
  const o = n.find((s) => s.key === e);
  if (!o || r.length === 0)
    return "分镜作品类型或参考用途配置无效";
  const i = /* @__PURE__ */ new Map();
  for (const s of t) {
    const a = bn(
      s.purpose,
      r
    );
    if (!a)
      return `参考素材“${s.label}”的用途无效`;
    if (!a.media_kinds.includes(s.kind))
      return `参考素材“${s.label}”的类型不支持用途“${a.name}”`;
    if (a.work_types.length > 0 && !a.work_types.includes(e))
      return `当前作品类型不支持“${s.label}”的用途“${a.name}”`;
    const u = (i.get(s.purpose) || 0) + 1;
    if (i.set(s.purpose, u), a.max_count > 0 && u > a.max_count)
      return `用途“${a.name}”最多只能选择 ${a.max_count} 个素材`;
  }
  for (const s of o.required_reference_purposes)
    if (!i.get(s))
      return `${o.name}必须添加“${jo(
        s,
        r
      )}”`;
  return "";
}
function Ut(t) {
  return `ref-${t}`;
}
function Vt(t) {
  const e = String(t || "").trim();
  return e || void 0;
}
function Fo(t, e, n, r, o) {
  const i = vo(t, e), s = [];
  /角色|人物|主角|外貌|长相|形象/.test(i) && n === "image" && s.push("character"), /场景|环境|地点|空间/.test(i) && n === "image" && s.push("scene"), /产品|商品/.test(i) && n === "image" && r === "ad" && s.push("product"), /道具|产品|商品|物品/.test(i) && n === "image" && s.push("prop"), /镜头|构图|画面/.test(i) && n !== "audio" && s.push("shot"), /运镜|节奏|动作|转场|剪辑/.test(i) && n === "video" && s.push("motion_style"), /风格|画风|色调|光线|质感|视觉/.test(i) && n !== "audio" && s.push("visual_style");
  const a = hn(n, r, o), u = s.find(
    (l) => a.some((d) => d.value === l)
  );
  return u || o.find(
    (l) => l.default_media_kinds.includes(n) && (l.work_types.length === 0 || l.work_types.includes(r))
  )?.key || a[0]?.value || "";
}
function vo(t, e) {
  const n = `@${String(e || "").replace(/^@+/, "")}`, r = t.indexOf(n);
  return r < 0 ? t : t.slice(Math.max(0, r - 24), r + n.length + 32);
}
function wn(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "image" || e === "video" || e === "audio" ? e : void 0;
}
function tt(t) {
  const e = Number(t || 0);
  return Number.isInteger(e) && e > 0 ? e : 0;
}
function Uo(t) {
  return typeof t == "string" && t.length > 0 && t.trim() === t;
}
const Sn = 4, Kt = /* @__PURE__ */ new Set([2, 3, 4, 5]);
function Tt(t) {
  if (t == null || String(t).trim() === "")
    return Sn;
  const e = Number(t);
  if (!Number.isInteger(e) || !Kt.has(e))
    throw new Error("最短镜头时长必须是 2 到 5 秒");
  return e;
}
function Ks(t) {
  if (!(t == null || String(t).trim() === ""))
    try {
      return Tt(t);
    } catch {
      return;
    }
}
function qs(t) {
  if (!Array.isArray(t))
    return [];
  const e = /* @__PURE__ */ new Set(), n = t.map((r) => {
    const o = w(r) ? r : {}, i = Tt(o.seconds), s = Number(o.sort);
    if (e.has(i) || !Number.isInteger(s))
      throw new Error("分镜最短时长注册信息无效");
    return e.add(i), {
      seconds: i,
      name: String(o.name || "").trim() || `${i} 秒`,
      sort: s
    };
  });
  if (n.length !== Kt.size || [...Kt].some(
    (r) => !e.has(r)
  ))
    throw new Error("分镜最短时长注册信息无效");
  return n.sort((r, o) => r.sort - o.sort);
}
function Gs(t) {
  const e = [
    Tt(t.min_shot_duration),
    ...t.shots.map((n) => Number(n.duration))
  ];
  return [...new Set(e.filter(An))].sort(
    (n, r) => n - r
  );
}
function Ys(t, e) {
  const n = In(
    e
  );
  return n.length === 0 ? t : t.filter((r) => {
    const o = new Set(
      (r.supported_options?.duration || []).map(
        (i) => String(i).trim()
      )
    );
    return n.every((i) => o.has(String(i)));
  });
}
function Hs(t) {
  const e = In(
    t
  );
  return e.length > 0 ? `没有同时支持 ${e.join("、")} 秒的可用视频模型` : "";
}
function In(t) {
  const e = Array.isArray(t) ? t : [];
  return [
    ...new Set(e.map(Number).filter(An))
  ].sort((n, r) => n - r);
}
function An(t) {
  return Number.isInteger(t) && t >= 2;
}
const kn = 5, xn = [
  "first_frame",
  "last_frame",
  "first_last",
  "references",
  "none"
], At = "first_frame", Ws = {
  first_frame: "首帧",
  last_frame: "尾帧",
  first_last: "首尾帧",
  references: "参考图组",
  none: "无参考图"
};
function Dn(t) {
  const e = Number(t);
  return Number.isInteger(e) && e > 0 ? e : void 0;
}
function Js(t) {
  return (Dn(t) || 0) >= kn;
}
function Zs(t, e) {
  const n = Dn(t);
  return e ? Math.max(n || 0, kn) : n;
}
function Mn(t) {
  return t === "start" || t === "end" ? t : void 0;
}
function Vo(t) {
  return Mn(t) || "start";
}
function Xs(t) {
  return Vo(t) === "end" ? "lastFrame" : "firstFrame";
}
function Ko(t) {
  return qo(t) || At;
}
function qo(t) {
  return xn.includes(t) ? t : void 0;
}
function Go(t) {
  switch (t) {
    case "first_frame":
      return [{ frameRole: "start", mediaIndex: 1 }];
    case "last_frame":
      return [{ frameRole: "end", mediaIndex: 1 }];
    case "first_last":
      return Zo();
    default:
      return [];
  }
}
function K(t) {
  const e = Ko(t.shot_image_mode), n = !!t.continue_previous, r = !!t.match_previous, o = Wo(
    e,
    r,
    n
  );
  let i = o;
  return n && o === "first_frame" && (i = "none"), {
    mode: o,
    nodeMode: i,
    frameMediaItems: Go(i),
    referenceMode: o === "references" ? "references" : o === "none" ? "" : "frames"
  };
}
function Cn(t) {
  const e = t.map((n) => {
    const r = K(n);
    return !kt(n) && (r.mode === "first_last" || r.mode === "last_frame") ? K({ ...n, shot_image_mode: "first_frame" }) : r;
  });
  for (let n = e.length - 1; n > 0; n -= 1) {
    const r = t[n], o = e[n];
    Jo(r, o) && Yo(t, e, n - 1);
  }
  return e;
}
function kt(t) {
  const e = t.continuity_state && typeof t.continuity_state == "object" && !Array.isArray(t.continuity_state) ? t.continuity_state : {}, n = v(e.entry), r = v(e.exit);
  return !!n && !!r && n !== r || Ho(t.camera_instruction);
}
function Yo(t, e, n) {
  for (let r = n; r >= 0; r -= 1) {
    if (mt(e[r].frameMediaItems, "end"))
      return;
    const o = t[r], i = kt(o);
    if (e[r].nodeMode === "first_frame" && !o.continue_previous && !i)
      return;
    if (!(o.continue_previous && !i)) {
      e[r] = K({
        ...o,
        shot_image_mode: i ? o.continue_previous ? "last_frame" : "first_last" : "first_frame"
      });
      return;
    }
  }
}
function Ho(t) {
  const e = v(t).toLowerCase().replace(/\s+/g, "");
  return [
    "推近",
    "推进",
    "推远",
    "拉近",
    "拉远",
    "横移",
    "纵移",
    "平移",
    "跟拍",
    "跟随",
    "摇镜",
    "摇摄",
    "环绕",
    "变焦",
    "升起",
    "上升",
    "下降",
    "上移",
    "下移",
    "旋转",
    "甩镜",
    "手持晃动",
    "向前移动",
    "向后移动",
    "dolly",
    "pushin",
    "pullout",
    "pan",
    "tilt",
    "zoom",
    "tracking",
    "orbit",
    "crane"
  ].some((n) => e.includes(n));
}
function v(t) {
  return typeof t == "string" ? t.trim() : "";
}
function Qs(t) {
  return xn.filter(
    (e) => K({ ...t, shot_image_mode: e }).mode === e
  );
}
function Wo(t, e, n) {
  return n && t === "first_last" ? "last_frame" : t === "last_frame" && !n || n && (t === "references" || t === "none") || e && t === "none" ? At : t;
}
function Jo(t, e) {
  return !!t.match_previous || !!t.continue_previous && e.nodeMode === "last_frame";
}
function Zo() {
  return [
    { frameRole: "start", mediaIndex: 1 },
    { frameRole: "end", mediaIndex: 2 }
  ];
}
function ta(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  for (const o of t) {
    if (!o || typeof o != "object" || Array.isArray(o))
      continue;
    const i = o, s = Mn(i.frameRole ?? i.frame_role), a = Number(i.mediaIndex ?? i.media_index);
    !s || !Number.isInteger(a) || a <= 0 || n.has(s) || r.has(a) || (n.add(s), r.add(a), e.push({ frameRole: s, mediaIndex: a }));
  }
  return e.sort((o, i) => o.mediaIndex - i.mediaIndex);
}
function ea(t) {
  return Array.isArray(t) ? t.map((e) => {
    if (!e || typeof e != "object" || Array.isArray(e))
      return;
    const n = e, r = v(n.prompt);
    if (!r)
      return;
    const o = v(n.title);
    return {
      title: o || "画面",
      description: v(n.description) || o || r,
      prompt: r
    };
  }).filter(
    (e) => !!e
  ) : [];
}
function mt(t, e) {
  return t?.find((n) => n.frameRole === e)?.mediaIndex || 0;
}
function na(t, e, n) {
  const r = t[e], o = Xo(t, e, n);
  if (!r || !o)
    return {
      anchorID: "",
      anchorFrameRole: "",
      anchorShotIndex: -1,
      materialIDs: xt(r?.material_ids),
      referenceKeys: xt(r?.reference_keys),
      includeGlobalReferences: !0
    };
  const i = t[o.shotIndex];
  return {
    anchorID: o.id,
    anchorFrameRole: o.frameRole,
    anchorShotIndex: o.shotIndex,
    materialIDs: De(
      r.material_ids,
      i?.material_ids
    ),
    referenceKeys: De(
      r.reference_keys,
      i?.reference_keys
    ),
    includeGlobalReferences: !1
  };
}
function Xo(t, e, n) {
  const r = t[e];
  if (!r)
    return;
  const o = Cn(t);
  if (n === "end" && !r.continue_previous)
    return mt(o[e]?.frameMediaItems, "start") ? { id: r.id, shotIndex: e, frameRole: "start" } : void 0;
  if (!(n === "start" && !r.match_previous && !r.continue_previous || e <= 0))
    for (let i = e - 1; i >= 0; i -= 1) {
      const s = o[i];
      if (mt(s?.frameMediaItems, "end"))
        return {
          id: t[i].id,
          shotIndex: i,
          frameRole: "end"
        };
      if (mt(s?.frameMediaItems, "start") && !kt(t[i]))
        return {
          id: t[i].id,
          shotIndex: i,
          frameRole: "start"
        };
      if (!t[i].continue_previous || kt(t[i]))
        return;
    }
}
function De(t, e) {
  const n = new Set(xt(e));
  return xt(t).filter(
    (r) => !n.has(r)
  );
}
function xt(t) {
  return [
    ...new Set((t || []).map((e) => e.trim()).filter(Boolean))
  ];
}
const qt = 9, Nn = 2, Qo = 50, Me = /* @__PURE__ */ new Set([
  "未命名",
  "未命名分镜",
  "分镜",
  "分镜脚本",
  "暂无内容简介",
  "围绕当前主题展开并完成一个连贯事件"
]), ti = [
  "none",
  "fade",
  "crossfade",
  "fadeblack",
  "fadewhite",
  "wipeleft",
  "wiperight"
], ra = {
  none: "硬切",
  fade: "淡化",
  crossfade: "交叉溶解",
  fadeblack: "黑场淡化",
  fadewhite: "白场淡化",
  wipeleft: "向左擦除",
  wiperight: "向右擦除"
}, ei = ["photoreal", "stylized"], oa = {
  photoreal: "写实影像",
  stylized: "非写实影像"
}, ni = [
  "16:9",
  "9:16",
  "1:1",
  "4:3",
  "3:4",
  "21:9"
], ri = "16:9", ia = {
  character: "角色",
  scene: "场景",
  prop: "道具"
}, oi = {
  character: "画面类型：写实影像，人物五官、身体比例、光线和材质保持真实自然",
  scene: "画面类型：写实影像，空间透视、尺度关系、光线和环境材质保持真实自然",
  prop: "画面类型：写实影像，道具比例、结构、光线和材质保持真实自然",
  shot: "画面类型：写实影像，人物五官、身体比例、光线和材质保持真实自然"
}, ii = [
  "shot_images",
  "final_video",
  "shot_videos",
  "storyboard_only"
], st = {
  output_target: "shot_images",
  voice_mode: "auto",
  subtitle_mode: "auto",
  lip_sync_mode: "off"
};
function On(t, e) {
  return e > 0 && (t.match_previous || t.continue_previous);
}
const si = [
  "storyboard",
  "json",
  "output",
  "result",
  "data",
  "content",
  "body",
  "value",
  "text",
  "finalOutput",
  "final_output",
  "rich"
];
function ai(t) {
  return J(t, /* @__PURE__ */ new Set(), 0);
}
function sa(t, e) {
  if (!w(t) || !Array.isArray(t.materials))
    return null;
  const n = t.materials.map(Fn);
  if (n.some((s) => !s))
    return null;
  const r = n, o = new Set(
    r.map((s) => s.id)
  );
  if (o.size !== r.length)
    return null;
  const i = vn(t.shot, e, o);
  return i ? { shot: i, materials: r } : null;
}
function aa(t) {
  return t.timeline_duration_ms && t.timeline_duration_ms > 0 ? Math.round(t.timeline_duration_ms) / 1e3 : Rn(t.shots);
}
function Rn(t) {
  return t.reduce(
    (e, n) => e + Math.max(0, Number(n.duration) || 0),
    0
  );
}
function ci(t) {
  return Number.isInteger(t) && t >= Nn;
}
function ca(t, e) {
  const n = new Map(
    t.materials.map((r) => [r.id, r])
  );
  return e.material_ids.map((r) => n.get(r)).filter((r) => !!r);
}
function da(t) {
  return {
    id: `shot-${t + 1}`,
    order: t + 1,
    duration: Sn,
    beat: "",
    transition: "",
    transition_type: "none",
    transition_duration_ms: 0,
    description: "",
    camera_instruction: "",
    video_prompt: "",
    material_ids: [],
    reference_keys: [],
    shot_image_mode: At,
    match_previous: !1,
    continue_previous: !1,
    continuity_anchor: "",
    continuity_state: { entry: "", exit: "" },
    speech: [],
    captions: []
  };
}
function ua(t, e) {
  const n = new Set(t.map((i) => i.id));
  let r = t.filter((i) => i.type === e).length + 1, o = `${e}-${r}`;
  for (; n.has(o); )
    r += 1, o = `${e}-${r}`;
  return {
    id: o,
    type: e,
    name: "",
    prompt: "",
    voice: "",
    reference_keys: []
  };
}
function la(t, e) {
  const n = [], r = [];
  for (const o of t.shots) {
    o.material_ids.includes(e) && n.push(o.id);
    for (const i of o.speech)
      i.character_id === e && r.push(i.id);
  }
  return { shotIds: n, speechIds: r };
}
function fa(t, e = "dialogue") {
  const n = new Set(t.speech.map((i) => i.id));
  let r = t.speech.length + 1, o = `${t.id}-speech-${r}`;
  for (; n.has(o); )
    r += 1, o = `${t.id}-speech-${r}`;
  return {
    id: o,
    kind: e,
    text: "",
    start_time: 0,
    subtitle_enabled: !0,
    subtitle_text: "",
    ...e === "dialogue" ? { character_id: "", speaker_mode: "offscreen" } : {}
  };
}
function ma(t) {
  const e = new Set(t.captions.map((o) => o.id));
  let n = t.captions.length + 1, r = `${t.id}-caption-${n}`;
  for (; e.has(r); )
    n += 1, r = `${t.id}-caption-${n}`;
  return {
    id: r,
    type: "caption",
    text: "",
    start_time: 0,
    end_time: Math.min(t.duration, 2)
  };
}
function di(t) {
  const e = Vn(t.workflow), n = se(t.references), r = new Set(n.map((a) => a.key)), o = new Set(
    t.materials.map((a) => a.id)
  ), i = t.shots.map((a, u) => {
    const f = u > 0 ? Bn(a.transition_type) : "none", l = Math.round(
      Number(a.transition_duration_ms)
    ), d = u > 0 && !!a.continue_previous, m = u > 0 && !d && !!a.match_previous;
    return {
      ...a,
      id: a.id || `shot-${u + 1}`,
      order: u + 1,
      transition: u > 0 ? a.transition.trim() : "",
      transition_type: f,
      transition_duration_ms: f !== "none" ? Math.min(
        5e3,
        Math.max(
          100,
          Number.isFinite(l) ? l : 100
        )
      ) : 0,
      material_ids: et(a.material_ids).filter(
        (p) => o.has(p)
      ),
      reference_keys: et(a.reference_keys).filter(
        (p) => r.has(p)
      ),
      shot_image_mode: K({
        ...a,
        match_previous: m,
        continue_previous: d
      }).mode,
      match_previous: m,
      continue_previous: d,
      continuity_anchor: d ? a.continuity_anchor.trim() : "",
      continuity_state: Tn(
        a.continuity_state
      ),
      lyric_line_indexes: Un(
        a.lyric_line_indexes
      )
    };
  });
  i.forEach((a, u) => {
    On(a, u) && (a.continuity_state.entry = i[u - 1].continuity_state.exit);
  });
  const s = Cn(i);
  return i.forEach((a, u) => {
    a.shot_image_mode = s[u].mode;
  }), {
    ...t,
    version: qt,
    workflow: e,
    production_plan: ae(
      t.production_plan,
      t.work_type
    ),
    target_duration: Rn(i),
    target_shot_count: i.length,
    lyrics_lrc: t.work_type === "mv" ? String(t.lyrics_lrc || "") : "",
    narrator_voice: t.narrator_voice.trim(),
    aspect_ratio: Ln(t.aspect_ratio),
    references: n,
    materials: t.materials.map((a) => ({
      ...a,
      voice: a.type === "character" ? a.voice.trim() : "",
      reference_keys: et(a.reference_keys).filter(
        (u) => r.has(u)
      )
    })),
    shots: i
  };
}
function Tn(t) {
  const e = w(t) ? t : {};
  return {
    entry: I(e.entry).trim(),
    exit: I(e.exit).trim()
  };
}
function pa(t, e) {
  const n = /* @__PURE__ */ new Map();
  return t.shots.forEach((r, o) => {
    o > 0 && n.set(r.id, t.shots[o - 1].id);
  }), {
    ...e,
    shots: e.shots.map((r, o) => {
      const i = o > 0 ? e.shots[o - 1].id : "", s = o === 0 || n.get(r.id) !== i;
      return {
        ...r,
        transition: s ? "" : r.transition,
        transition_type: s ? "none" : r.transition_type,
        transition_duration_ms: s ? 0 : r.transition_duration_ms,
        match_previous: !s && !r.continue_previous ? r.match_previous : !1,
        continue_previous: !s && !!r.continue_previous,
        continuity_anchor: !s && r.continue_previous ? r.continuity_anchor : ""
      };
    })
  };
}
function ya(t) {
  return t.workflow.status === "confirmed";
}
function ae(t, e) {
  const n = w(t) ? t : {}, r = I(n.output_target).toLowerCase(), o = {
    output_target: ii.includes(
      r
    ) ? r : st.output_target,
    voice_mode: Pt(
      n.voice_mode,
      st.voice_mode
    ),
    subtitle_mode: Pt(
      n.subtitle_mode,
      st.subtitle_mode
    ),
    lip_sync_mode: Pt(
      n.lip_sync_mode,
      st.lip_sync_mode
    ),
    shot_visual_strategy: "auto"
  };
  return e === "mv" ? {
    ...o,
    voice_mode: "off",
    subtitle_mode: "off",
    lip_sync_mode: "off"
  } : o;
}
function _a(t, e) {
  const n = ae(
    t.production_plan,
    t.work_type
  );
  return {
    ...n,
    output_target: n.output_target === "storyboard_only" ? "shot_images" : n.output_target,
    lip_sync_mode: t.work_type !== "mv" && e && t.shots.some($n) ? "auto" : "off"
  };
}
function ga(t) {
  return t.production_plan.output_target !== "storyboard_only";
}
function En(t) {
  return ["shot_videos", "final_video"].includes(
    t.production_plan.output_target
  );
}
function ha(t) {
  return t.production_plan.output_target === "final_video";
}
function Pn(t) {
  return t.work_type === "mv";
}
function ui(t) {
  return !Pn(t) && En(t) && t.production_plan.voice_mode === "auto" && li(t) > 0;
}
function ba(t) {
  return !Pn(t) && En(t) && t.production_plan.subtitle_mode === "auto" && fi(t) > 0;
}
function wa(t) {
  return ui(t) && t.production_plan.lip_sync_mode === "auto" && t.shots.some($n);
}
function li(t) {
  return t.shots.reduce(
    (e, n) => e + n.speech.filter(qn).length,
    0
  );
}
function fi(t) {
  return t.shots.reduce(
    (e, n) => e + mi(n).length,
    0
  );
}
function mi(t) {
  const e = t.speech.filter((r) => r.subtitle_enabled && !!r.text.trim()).map((r) => ({
    id: `subtitle-${r.id}`,
    text: r.subtitle_text.trim() || r.text.trim(),
    start_time: r.start_time,
    speech_id: r.id,
    source: "speech"
  })), n = t.captions.filter((r) => !!r.text.trim()).map((r) => ({
    id: r.id,
    text: r.text.trim(),
    start_time: r.start_time,
    end_time: r.end_time,
    source: "caption"
  }));
  return [...e, ...n].sort(
    (r, o) => r.start_time - o.start_time
  );
}
function pi(t) {
  return t.kind === "narration" ? "旁白" : t.speaker_mode === "visible" ? "出镜对白" : "画外音";
}
function zn(t) {
  return t.kind === "dialogue" && t.speaker_mode === "visible" && !!t.text.trim();
}
function $n(t) {
  return t.speech.some(zn);
}
function Sa(t) {
  return new Set(
    t.speech.filter(zn).map((e) => e.character_id?.trim()).filter((e) => !!e)
  );
}
function Ia(t) {
  return `${t.title.trim() || "分镜脚本"} · ${t.shots.length} 个镜头`;
}
function Aa(t) {
  return t.summary.trim() || jn("", t.shots);
}
function ka(t, e) {
  const n = t.style_prompt.trim(), r = { ...t, style_prompt: e };
  return !n || n === e.trim() ? r : {
    ...r,
    materials: t.materials.map((o) => ({
      ...o,
      prompt: Ce(
        o.prompt,
        n
      )
    })),
    shots: t.shots.map((o) => ({
      ...o,
      video_prompt: Ce(
        o.video_prompt,
        n
      )
    }))
  };
}
function xa(t, e, n = "shot") {
  const r = t.visual_mode === "photoreal" ? oi[n] : "画面类型：非写实影像，保持统一造型语言，不得漂移为真人摄影";
  let o = Ne(
    e.trim(),
    r
  );
  const i = t.style_prompt.trim();
  if (!i)
    return o;
  const s = `统一视觉风格：${i}`;
  return o = Ne(o, s), o;
}
function Ce(t, e) {
  const n = `统一视觉风格：${e}`, r = t.trimEnd().replace(/[。！？!?；;，,\s]+$/g, "");
  return r.endsWith(n) ? r.slice(0, -n.length).replace(/[。！？!?；;，,：:\s]+$/g, "").trimEnd() : t;
}
function Ne(t, e) {
  if (!e || t.includes(e))
    return t;
  if (!t)
    return e;
  const n = /[。！？!?；;，,：:]$/.test(t) ? "" : "。";
  return `${t}${n}${e}`;
}
function Ln(t) {
  const e = I(t);
  return ni.includes(e) ? e : ri;
}
function Bn(t) {
  const e = I(t);
  return ti.includes(e) ? e : "none";
}
function Da(t) {
  const e = t.speech.filter(qn).map((r) => `${pi(r)}：${r.text.trim()}`).join("；");
  return [
    t.description,
    t.continuity_state.entry ? `入镜状态：${t.continuity_state.entry}` : "",
    t.continuity_state.exit ? `出镜状态：${t.continuity_state.exit}` : "",
    t.camera_instruction ? `镜头语言：${t.camera_instruction}` : "",
    t.continue_previous && t.continuity_anchor ? `连续性锚点：${t.continuity_anchor}` : "",
    e,
    t.duration > 0 ? `时长：${t.duration} 秒` : ""
  ].filter(Boolean).join("。") || `镜头 ${t.order} 视频生成提示词`;
}
function J(t, e, n) {
  if (t == null || n > 10)
    return null;
  if (typeof t == "string") {
    for (const s of ot(t)) {
      const a = J(s, e, n + 1);
      if (a)
        return a;
    }
    return null;
  }
  if (typeof t != "object" || e.has(t))
    return null;
  if (e.add(t), Array.isArray(t)) {
    for (const s of t) {
      const a = J(s, e, n + 1);
      if (a)
        return a;
    }
    return null;
  }
  const r = t, o = yi(r);
  if (o)
    return o;
  const i = Ai(r);
  if (i) {
    const s = J(i, e, n + 1);
    if (s)
      return s;
  }
  for (const s of si) {
    const a = r[s];
    if (a == null || a === t)
      continue;
    const u = J(a, e, n + 1);
    if (u)
      return u;
  }
  return null;
}
function yi(t) {
  const e = I(t.visual_mode).toLowerCase(), n = gi(t.work_type);
  let r;
  try {
    r = Tt(t.min_shot_duration);
  } catch {
    return null;
  }
  if (I(t.type).toLowerCase() !== "storyboard" || B(t.version) !== qt || typeof t.title != "string" || typeof t.narrator_voice != "string" || typeof t.style_prompt != "string" || !wi(e) || !n || !Array.isArray(t.references) || !Array.isArray(t.materials) || !Array.isArray(t.shots))
    return null;
  const o = hi(t.storyline);
  if (!o)
    return null;
  const i = se(t.references);
  if (i.length !== t.references.length)
    return null;
  const s = t.materials.map(Fn);
  if (s.some((x) => !x))
    return null;
  const a = s, u = /* @__PURE__ */ new Set();
  for (const x of a) {
    if (u.has(x.id))
      return null;
    u.add(x.id);
  }
  const f = /* @__PURE__ */ new Set(), l = t.shots.map(
    (x, T) => vn(x, T, u)
  );
  if (l.some((x) => !x))
    return null;
  const d = l;
  for (const [x, T] of d.entries()) {
    if (f.has(T.id) || On(T, x) && T.continuity_state.entry !== d[x - 1].continuity_state.exit)
      return null;
    f.add(T.id);
  }
  const m = B(t.target_duration), p = B(t.target_shot_count);
  if (m == null || !Number.isInteger(m) || m < Nn || p == null || !Number.isInteger(p) || p < 1 || p > Qo)
    return null;
  const g = _i(t, n);
  if (g === null)
    return null;
  const h = Vn(t.workflow), y = jn(
    I(t.summary),
    d
  ), A = {
    ...t,
    type: "storyboard",
    version: qt,
    work_type: n,
    workflow: h,
    production_plan: ae(
      t.production_plan,
      n
    ),
    title: bi(t.title, y, d),
    summary: y,
    target_duration: m,
    target_shot_count: p,
    min_shot_duration: r,
    ...g,
    lyrics_lrc: n === "mv" ? I(t.lyrics_lrc) : "",
    narrator_voice: t.narrator_voice.trim(),
    storyline: o,
    style_prompt: t.style_prompt,
    visual_mode: e,
    aspect_ratio: Ln(t.aspect_ratio),
    references: i,
    materials: a,
    shots: d
  };
  return di(A);
}
function _i(t, e) {
  if ([
    t.storyboard_range_start_ms,
    t.storyboard_range_end_ms,
    t.storyboard_soundtrack_duration_ms,
    t.timeline_duration_ms
  ].every((a) => a == null || a === ""))
    return {};
  const r = it(t.storyboard_range_start_ms), o = it(t.storyboard_range_end_ms), i = it(
    t.storyboard_soundtrack_duration_ms
  ), s = it(t.timeline_duration_ms);
  return e !== "mv" || r == null || o == null || i == null || s == null || ![r, o, i, s].every(
    Number.isInteger
  ) || r < 0 || o <= r || o > i || s !== o - r ? null : {
    storyboard_range_start_ms: r,
    storyboard_range_end_ms: o,
    storyboard_soundtrack_duration_ms: i,
    timeline_duration_ms: s
  };
}
function gi(t) {
  const e = I(t).toLowerCase();
  return e ? Uo(e) ? e : null : "short";
}
function hi(t) {
  if (!w(t))
    return null;
  const e = I(t.setup), n = I(t.development), r = I(t.payoff);
  return { setup: e, development: n, payoff: r };
}
function jn(t, e) {
  const n = t.trim();
  if (n)
    return n;
  const r = e.map((o) => o.description.trim()).filter(Boolean);
  return r.length > 0 ? r.join("；") : "暂无内容简介";
}
function bi(t, e, n) {
  const r = t.trim();
  if (r && !Me.has(r))
    return r;
  const o = [e, n[0]?.beat, n[0]?.description].map((s) => String(s || "").trim()).find((s) => s && !Me.has(s));
  if (!o)
    return "分镜脚本";
  const i = o.split(/[\r\n。！？!?；;]/, 1)[0].trim();
  return Array.from(i).slice(0, 24).join("") || "分镜脚本";
}
function wi(t) {
  return ei.includes(t);
}
function Fn(t) {
  if (!w(t))
    return null;
  const e = I(t.type).toLowerCase();
  return !ki(e) || typeof t.id != "string" || !t.id.trim() || typeof t.name != "string" || typeof t.prompt != "string" || typeof t.voice != "string" || !Array.isArray(t.reference_keys) ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    name: t.name.trim().replace(/^[@#]+/, ""),
    prompt: t.prompt.trim(),
    voice: e === "character" ? t.voice.trim() : "",
    reference_keys: et(t.reference_keys.map(I))
  };
}
function vn(t, e, n) {
  if (!w(t) || typeof t.id != "string" || !t.id.trim() || typeof t.beat != "string" || !t.beat.trim() || typeof t.transition != "string" || typeof t.transition_type != "string" || typeof t.match_previous != "boolean" || typeof t.description != "string" || typeof t.camera_instruction != "string" || typeof t.video_prompt != "string" || typeof t.continue_previous != "boolean" || typeof t.continuity_anchor != "string" || !w(t.continuity_state) || !Array.isArray(t.material_ids) || !Array.isArray(t.reference_keys) || !Array.isArray(t.speech) || !Array.isArray(t.captions))
    return null;
  const r = B(t.duration);
  if (r == null || !ci(r))
    return null;
  const o = t.material_ids.map(I);
  if (o.some((h) => !h || !n.has(h)) || new Set(o).size !== o.length)
    return null;
  const i = t.speech.map(Si);
  if (i.some((h) => !h))
    return null;
  const s = t.captions.map(Ii);
  if (s.some(
    (h) => !h || h.end_time > r
  ))
    return null;
  const a = e > 0 && t.continue_previous;
  if (e === 0 && (t.match_previous || t.continue_previous) || t.match_previous && t.continue_previous)
    return null;
  const u = e > 0 && !a && t.match_previous, f = K({
    shot_image_mode: t.shot_image_mode,
    match_previous: u,
    continue_previous: a
  }).mode, l = t.transition.trim();
  if (e > 0 && !l)
    return null;
  const d = t.continuity_anchor.trim();
  if (a && !d)
    return null;
  const m = Tn(
    t.continuity_state
  );
  if (!m.entry || !m.exit)
    return null;
  const p = Bn(
    t.transition_type
  ), g = B(t.transition_duration_ms);
  return p !== t.transition_type || g == null || !Number.isInteger(g) || g < 0 || g > 5e3 || e === 0 && (p !== "none" || g !== 0) || e > 0 && p === "none" && g !== 0 || e > 0 && p !== "none" && g < 100 ? null : {
    ...t,
    id: t.id.trim(),
    order: e + 1,
    duration: r,
    beat: t.beat.trim(),
    transition: e > 0 ? l : "",
    transition_type: e > 0 ? p : "none",
    transition_duration_ms: e > 0 && p !== "none" ? g : 0,
    description: t.description,
    camera_instruction: t.camera_instruction,
    video_prompt: t.video_prompt,
    material_ids: o,
    reference_keys: et(t.reference_keys.map(I)),
    shot_image_mode: f,
    match_previous: u,
    continue_previous: a,
    continuity_anchor: a ? d : "",
    continuity_state: m,
    lyric_line_indexes: Un(
      t.lyric_line_indexes
    ),
    speech: i,
    captions: s
  };
}
function Un(t) {
  return Array.isArray(t) ? [
    ...new Set(
      t.map(Number).filter((e) => Number.isInteger(e) && e > 0)
    )
  ].sort((e, n) => e - n) : [];
}
function Si(t) {
  if (!w(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string" || typeof t.subtitle_enabled != "boolean" || typeof t.subtitle_text != "string")
    return null;
  const e = I(t.kind).toLowerCase(), n = B(t.start_time);
  if (e !== "dialogue" && e !== "narration" || n == null || n < 0)
    return null;
  if (e === "narration") {
    const o = {
      ...t,
      id: t.id.trim(),
      kind: e,
      text: t.text,
      start_time: n,
      subtitle_enabled: t.subtitle_enabled,
      subtitle_text: t.subtitle_text
    };
    return delete o.character_id, delete o.speaker_mode, o;
  }
  const r = I(t.speaker_mode).toLowerCase();
  return typeof t.character_id != "string" || r !== "visible" && r !== "offscreen" ? null : {
    ...t,
    id: t.id.trim(),
    kind: e,
    text: t.text,
    start_time: n,
    character_id: t.character_id.trim(),
    speaker_mode: r,
    subtitle_enabled: t.subtitle_enabled,
    subtitle_text: t.subtitle_text
  };
}
function Ii(t) {
  if (!w(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string")
    return null;
  const e = I(t.type).toLowerCase(), n = B(t.start_time), r = B(t.end_time);
  return !xi(e) || n == null || r == null || n < 0 || r <= n ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    text: t.text,
    start_time: n,
    end_time: r
  };
}
function Vn(t) {
  const e = w(t) ? t : {}, n = I(e.status).toLowerCase() === "confirmed" ? "confirmed" : "draft";
  return {
    status: n,
    confirmed_at: n === "confirmed" ? I(e.confirmed_at) : ""
  };
}
function Pt(t, e) {
  const n = I(t).toLowerCase();
  return n === "auto" || n === "off" ? n : e;
}
function Ai(t) {
  const e = ro(t);
  if (e)
    return e;
  if (!w(t))
    return "";
  const n = t.type === "doc" ? t : w(t.rich) && t.rich.type === "doc" ? t.rich : null;
  return n ? Kn(n).trim() : "";
}
function Kn(t) {
  if (!w(t))
    return "";
  if (t.type === "text")
    return I(t.text);
  if (t.type === "hardBreak")
    return `
`;
  if (!Array.isArray(t.content))
    return "";
  const e = t.type === "doc" || t.type === "paragraph" || t.type === "codeBlock" ? `
` : "";
  return t.content.map(Kn).join(e);
}
function ki(t) {
  return t === "character" || t === "scene" || t === "prop";
}
function xi(t) {
  return t === "caption" || t === "title" || t === "highlight";
}
function qn(t) {
  return t.text.trim().length > 0;
}
function et(t) {
  return [...new Set(t.map((e) => e.trim()).filter(Boolean))];
}
function B(t) {
  const e = typeof t == "number" ? t : Number.NaN;
  return Number.isFinite(e) ? e : null;
}
const Di = [
  "title",
  "text",
  "reasoning",
  "progress",
  "error",
  "json"
], Mi = /* @__PURE__ */ new Set([
  "audio",
  "editormediaaudio",
  "editormediaembed",
  "editormediaexternal",
  "editormediaimage",
  "editormediavideo",
  "externalmedia",
  "image",
  "mediaaudio",
  "mediaembed",
  "mediaexternal",
  "mediaimage",
  "mediavideo",
  "video"
]), Ci = /* @__PURE__ */ new Set([
  "agentabilityplaceholder",
  "agenttaskplaceholder",
  "horizontalrule"
]);
function Ni({
  items: t,
  mediaCount: e,
  previewMediaURL: n,
  outputMediaURLs: r = []
}) {
  if (t.length > 1 || e > 1)
    return !0;
  const o = e === 1 && nt(n) !== "" && r.length === 1 && nt(r[0]) === nt(n);
  return t.some(
    (i) => Oi(i, o)
  );
}
function Oi(t, e) {
  return Gt(t) ? Di.some((n) => yt(t[n])) ? !0 : yt(t.rich) ? !e || pt(t.rich, /* @__PURE__ */ new Set(), 0) : !1 : yt(t);
}
function pt(t, e, n) {
  if (t == null || t === "")
    return !1;
  if (n > 32)
    return !0;
  if (typeof t == "string") {
    const o = t.trim();
    if (!o)
      return !1;
    try {
      return pt(
        JSON.parse(o),
        e,
        n + 1
      );
    } catch {
      return !0;
    }
  }
  if (Array.isArray(t))
    return t.some(
      (o) => pt(o, e, n + 1)
    );
  if (!Gt(t) || e.has(t))
    return !0;
  e.add(t);
  const r = Ri(t.type);
  if (r === "text")
    return nt(t.text) !== "";
  if (Mi.has(r)) {
    const o = Gt(t.attrs) ? t.attrs : void 0;
    return yt(o?.caption);
  }
  return Ci.has(r) ? !0 : Array.isArray(t.content) ? t.content.some(
    (o) => pt(o, e, n + 1)
  ) : !1;
}
function yt(t) {
  return t == null ? !1 : typeof t == "string" ? t.trim() !== "" : Array.isArray(t) ? t.length > 0 : typeof t == "object" ? Object.keys(t).length > 0 : !0;
}
function Gt(t) {
  return t != null && typeof t == "object" && !Array.isArray(t);
}
function Ri(t) {
  return nt(t).toLowerCase().replace(/[\s_-]+/g, "");
}
function nt(t) {
  return typeof t == "string" ? t.trim() : "";
}
function Ma(t, e) {
  if (Ei(t, e))
    return !1;
  const n = Xe(t), r = sn(t), o = Gn(e);
  return Ni({
    items: r,
    mediaCount: n,
    previewMediaURL: o?.url,
    outputMediaURLs: o ? Qe(t, o.kind).map(
      (i) => i.url
    ) : []
  });
}
function Ti(t, e) {
  if (!e)
    return null;
  const n = Qe(t, e);
  return n.length > 1 ? { kind: e, items: n } : null;
}
function Ca(t) {
  return Gn(t)?.kind;
}
function Gn(t) {
  if (t?.videoUrl)
    return { kind: "video", url: t.videoUrl };
  if (t?.imageUrl)
    return { kind: "image", url: t.imageUrl };
  if (t?.audioUrl)
    return { kind: "audio", url: t.audioUrl };
}
function Ei(t, e) {
  const n = Yt(t, /* @__PURE__ */ new Set(), 0);
  return !n || !e ? !1 : [
    e.imageUrl,
    e.videoUrl,
    e.audioUrl,
    e.fileUrl
  ].some((r) => String(r || "").trim() === n);
}
function Yt(t, e, n) {
  if (t == null || n > 12)
    return "";
  if (typeof t == "string")
    return t.trim();
  if (Array.isArray(t))
    return t.length === 1 ? Yt(t[0], e, n + 1) : "";
  if (typeof t != "object" || e.has(t))
    return "";
  e.add(t);
  const o = Object.entries(t).filter(
    ([i, s]) => !["type", "kind", "format", "version"].includes(i) && Nt(s)
  ).map(([, i]) => i);
  return o.length === 1 ? Yt(o[0], e, n + 1) : "";
}
const Pi = ur(
  () => import("./space-storyboard-view-BhstEW9O.js").then((t) => ({
    default: t.StoryboardView
  }))
);
function Na({
  output: t,
  fallback: e = "",
  streaming: n = !1,
  emptyText: r = "暂无内容",
  className: o,
  markdownClassName: i,
  richClassName: s,
  mediaLayout: a = "default",
  mediaGridKind: u,
  compactMediaGrid: f = !1,
  storyboardEditable: l = !1,
  storyboardDisabled: d = !1,
  onStoryboardSave: m
}) {
  const p = pn(t, e), g = ai(p), h = tn(p);
  if (h)
    return /* @__PURE__ */ c(ft, { className: o, children: /* @__PURE__ */ c(gn, { grid: h }) });
  if (g)
    return /* @__PURE__ */ c(ft, { className: o, children: /* @__PURE__ */ c(lr, { fallback: /* @__PURE__ */ c("div", { className: "min-h-24", "aria-busy": "true" }), children: /* @__PURE__ */ c(
      Pi,
      {
        storyboard: g,
        editable: l,
        disabled: d,
        onSave: m
      }
    ) }) });
  const y = Ti(p, u);
  return y ? /* @__PURE__ */ c(
    ft,
    {
      className: [o, "ws-media-grid-content"].filter(Boolean).join(" "),
      children: /* @__PURE__ */ c(
        zo,
        {
          kind: y.kind,
          items: y.items,
          label: e,
          compact: f
        }
      )
    }
  ) : /* @__PURE__ */ c(
    bo,
    {
      output: p,
      fallback: e,
      streaming: n,
      emptyText: r,
      className: o,
      markdownClassName: i,
      richClassName: s,
      mediaLayout: a
    }
  );
}
function zi(t, e) {
  const n = t.map((f) => ({
    name: String(f.name || ""),
    size: Ht(f.size)
  })), r = n.reduce((f, l) => f + l.size, 0), o = n.map((f) => Math.max(f.size, 1)), i = o.reduce((f, l) => f + l, 0), s = n.map(() => 0);
  function a(f, l) {
    const d = n[f];
    if (!d || !e) return;
    const m = n.reduce(
      (g, h, y) => g + h.size * s[y],
      0
    ), p = o.reduce(
      (g, h, y) => g + h * s[y],
      0
    );
    e({
      phase: l,
      fileName: d.name,
      fileIndex: f + 1,
      fileCount: n.length,
      loaded: Math.round(m),
      total: r,
      percent: i > 0 ? Math.round(Math.min(1, p / i) * 100) : 100
    });
  }
  function u(f, l, d) {
    n[f] && (s[f] = Math.max(s[f], Li(l)), a(f, d));
  }
  return {
    start(f) {
      u(f, 0, "preparing");
    },
    report(f, l, d, m = "uploading") {
      const p = n[f];
      if (!p) return;
      const g = m === "saving" || m === "complete" ? 1 : $i(l, d, p.size);
      u(f, g, m);
    },
    saving(f) {
      u(f, 1, "saving");
    },
    complete(f) {
      u(f, 1, "complete");
    }
  };
}
function $i(t, e, n) {
  const r = Ht(t), o = Ht(e);
  return o > 0 ? r / o : n > 0 ? r / n : 0;
}
function Ht(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) && e > 0 ? e : 0;
}
function Li(t) {
  return Math.max(0, Math.min(Number.isFinite(t) ? t : 0, 1));
}
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/lib/upload"]);
const Dt = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Dt || Object.keys(Dt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Bi = Dt.joinSiteApi, ji = Dt.request, Wt = window.DeverFront?.sdk?.getCompatModule("@/lib/upload");
if (!Wt || Object.keys(Wt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/upload");
const Fi = "bot_work", vi = "神创工作台", Ui = /* @__PURE__ */ new Set([
  "txt",
  "md",
  "markdown",
  "mdown",
  "mkd"
]), { uploadFileByRule: Oe } = Wt;
async function Oa(t) {
  if (!Oe)
    throw new Error("当前页面缺少上传能力");
  const e = [], n = zi(
    t.files,
    t.onProgress
  );
  for (const [r, o] of t.files.entries()) {
    n.start(r);
    const i = qi(t.kind) || Ki(o), s = Number(t.ruleID || 0) || Gi(i), a = i === "text" ? await o.text() : void 0, u = await Oe(s, o, {
      kind: i,
      bizKey: Fi,
      bizName: vi,
      reportError: !1,
      onProgress: (d, m) => n.report(r, d, m)
    });
    n.saving(r);
    const f = Number(u.id || 0), [l] = await Vi({
      teamID: t.teamID,
      projectID: t.projectID,
      canvasID: t.canvasID,
      files: [u],
      textContents: a === void 0 ? void 0 : /* @__PURE__ */ new Map([[f, a]])
    });
    if (!l)
      throw new Error(`${o.name} 保存到资产库失败`);
    e.push({ sourceFile: o, uploadedFile: u, asset: l }), n.complete(r);
  }
  return e;
}
async function Vi(t) {
  const e = [], n = /* @__PURE__ */ new Set();
  for (const r of t.files) {
    const o = Number(r.id || 0);
    if (!Number.isFinite(o) || o <= 0)
      throw new Error("上传文件标识无效");
    if (n.has(o))
      continue;
    const i = await ji(
      Bi("workbench/upload_save_asset"),
      "post",
      {
        team_id: t.teamID,
        project_id: t.projectID || void 0,
        canvas_id: t.canvasID || void 0,
        file_id: o,
        text_content: t.textContents?.get(o)
      },
      { reportError: !1 }
    );
    if (!Hn(i))
      throw new Error(
        String(i?.message || i?.msg || "保存上传资产失败")
      );
    const s = i?.data?.asset;
    if (!s || typeof s != "object" || Array.isArray(s))
      throw new Error("保存上传资产结果为空");
    n.add(o), e.push(s);
  }
  return e;
}
function Ki(t) {
  const e = String(t.type || "").toLowerCase();
  return e.startsWith("image/") ? "image" : e.startsWith("video/") ? "video" : e.startsWith("audio/") ? "audio" : ["text/plain", "text/markdown", "text/x-markdown"].includes(e) || Ui.has(Yi(t.name)) ? "text" : "file";
}
function qi(t) {
  const e = String(t || "").toLowerCase();
  return ["image", "video", "audio", "text", "file"].includes(e) ? e : "";
}
function Gi(t) {
  return t === "image" ? 1 : t === "video" ? 2 : t === "audio" ? 3 : 7;
}
function Yi(t) {
  const e = String(t || "").trim().toLowerCase(), n = e.lastIndexOf(".");
  return n >= 0 ? e.slice(n + 1) : "";
}
export {
  ta as $,
  Ls as A,
  be as B,
  Na as C,
  Ao as D,
  Ys as E,
  Hs as F,
  vs as G,
  Rn as H,
  Nn as I,
  bn as J,
  ci as K,
  On as L,
  Qo as M,
  ti as N,
  wa as O,
  ba as P,
  ui as Q,
  En as R,
  ia as S,
  ga as T,
  Sa as U,
  _a as V,
  fi as W,
  ha as X,
  hn as Y,
  jo as Z,
  qo as _,
  li as a,
  Fe as a$,
  Vo as a0,
  K as a1,
  la as a2,
  Aa as a3,
  ei as a4,
  oa as a5,
  ni as a6,
  di as a7,
  pa as a8,
  ua as a9,
  L as aA,
  Oa as aB,
  Js as aC,
  Gs as aD,
  Cn as aE,
  zn as aF,
  Da as aG,
  xa as aH,
  na as aI,
  Pn as aJ,
  I as aK,
  Zs as aL,
  kn as aM,
  Xs as aN,
  mt as aO,
  Ma as aP,
  Ca as aQ,
  Mo as aR,
  ke as aS,
  Ts as aT,
  Ms as aU,
  Ds as aV,
  zr as aW,
  Mr as aX,
  Is as aY,
  no as aZ,
  Cr as a_,
  Qs as aa,
  Ko as ab,
  ra as ac,
  fa as ad,
  ma as ae,
  da as af,
  ka as ag,
  ws as ah,
  Ss as ai,
  As as aj,
  ne as ak,
  Ks as al,
  se as am,
  w as an,
  Dn as ao,
  Uo as ap,
  _s as aq,
  xs as ar,
  it as as,
  In as at,
  ea as au,
  Mn as av,
  qs as aw,
  sa as ax,
  ro as ay,
  te as az,
  ca as b,
  bs as b0,
  qr as b1,
  tn as b2,
  ks as b3,
  Ti as b4,
  Fs as b5,
  Ns as b6,
  $s as b7,
  Es as b8,
  he as b9,
  ms as bA,
  fs as bB,
  so as bC,
  zi as bD,
  gs as bE,
  ie as bF,
  Ia as bG,
  Ze as bH,
  oo as bI,
  sn as bJ,
  Rs as ba,
  bo as bb,
  yo as bc,
  Ps as bd,
  ps as be,
  ls as bf,
  Ue as bg,
  Bs as bh,
  us as bi,
  ss as bj,
  zs as bk,
  ys as bl,
  ds as bm,
  cs as bn,
  as as bo,
  is as bp,
  po as bq,
  kr as br,
  ts as bs,
  Dr as bt,
  es as bu,
  xr as bv,
  hs as bw,
  rs as bx,
  os as by,
  ns as bz,
  pi as c,
  mi as d,
  $n as e,
  Ws as f,
  Vi as g,
  vi as h,
  ya as i,
  Fi as j,
  gn as k,
  Qe as l,
  Os as m,
  Cs as n,
  ko as o,
  ai as p,
  js as q,
  io as r,
  aa as s,
  Io as t,
  Nt as u,
  q as v,
  Tt as w,
  Sn as x,
  Us as y,
  Vs as z
};
