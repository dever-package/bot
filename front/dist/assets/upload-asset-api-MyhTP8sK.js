import { s as M, h as yt, a as z, d as I, r as A, j as de, l as mn } from "./site-config-C63CM9jT.js";
import { b as le, d as pn } from "./file-kind-UfTAlHnR.js";
import { r as yn, R as gn, V as hn, a as _n } from "./media-inspector-gallery-ho9rlZcO.js";
import { j as a, a as y, F as fe } from "./preloadable-Bomi5PEU.js";
import { b as bn, L as J, c as me, o as pe, X as wn, ab as Sn, j as kn, aC as xn, G as An, d as Cn, a3 as In, a5 as H, O as Nn } from "./vendor-icons-B3DKX3la.js";
import { a as D, d as ye, b as j, u as Dn, l as Mn, S as On } from "./_commonjsHelpers-61wyk6v6.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./upload-asset-api-BKKxOhDW.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const ut = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!ut || Object.keys(ut).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const O = ut.joinSiteApi, T = ut.request, Tn = le(), Rn = le();
function qo(t, e, n = "") {
  const r = JSON.stringify({
    requestScopeKey: n,
    teamID: t,
    catalogOptions: e || null
  });
  return Tn(r, async () => {
    const o = T(
      O("workbench/asset_filters"),
      "get",
      {
        team_id: t,
        request_scope: n || void 0
      }
    ), [i, s] = e ? [null, await o] : await Promise.all([
      T(O("workbench/catalog"), "get", {
        team_id: t,
        request_scope: n || void 0
      }),
      o
    ]), c = e ? {
      powers: e.tools,
      roles: e.dialogues,
      asset_cates: e.assetCates
    } : M(i, "加载团队资产配置失败"), d = M(s, "加载资产筛选项失败");
    return {
      projects: z(d.projects).map(Rt).filter(tt),
      tools: qt(c.powers, d.tools),
      dialogues: qt(c.roles, d.dialogues),
      assetCates: z(c.asset_cates).map(En).filter(tt)
    };
  });
}
function Wo(t) {
  const e = {
    ...t,
    pageSize: t.pageSize || 24,
    view: t.view || "assets",
    contentMode: t.contentMode || "preview"
  };
  return Rn(JSON.stringify(e), async () => {
    const n = await T(O("workbench/assets"), "get", {
      team_id: e.teamID,
      request_scope: e.requestScopeKey || void 0,
      source_type: e.filters.sourceType || void 0,
      source_id: e.filters.sourceID || void 0,
      project_id: e.filters.projectID || void 0,
      scope_project_id: e.scopeProjectID || void 0,
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
    }), r = M(n, "加载资产失败");
    return {
      items: z(r.items).map(et).filter(tt),
      page: I(r.page, e.page),
      pageSize: I(r.page_size, e.pageSize),
      total: yt(r.total),
      hasMore: !!r.has_more
    };
  });
}
async function Yo(t, e) {
  const n = await T(O("workbench/asset_detail"), "get", {
    team_id: t,
    asset_id: e
  });
  return $n(M(n, "加载资产详情失败"));
}
async function Jo(t) {
  const e = await T(O("workbench/asset_versions"), "get", {
    team_id: t.teamID,
    asset_id: t.assetID,
    page: t.page,
    page_size: t.pageSize || 20
  }), n = M(e, "加载资产版本失败");
  return {
    items: z(n.items).map(gt).filter(tt),
    total: yt(n.total),
    hasMore: !!n.has_more
  };
}
async function Ho(t) {
  const e = await T(O("workbench/asset_version"), "get", {
    team_id: t.teamID,
    asset_id: t.assetID,
    version_id: t.versionID
  }), n = M(e, "加载资产版本失败");
  return gt(n.version);
}
async function Zo(t) {
  const e = await T(
    O("workbench/asset_set_current"),
    "post",
    {
      team_id: t.teamID,
      asset_id: t.assetID,
      version_id: t.versionID
    }
  ), n = M(e, "设置当前版本失败");
  return et(n.asset);
}
async function Xo(t) {
  const e = await T(O("workbench/asset_rename"), "post", {
    team_id: t.teamID,
    asset_id: t.assetID,
    name: t.name
  }), n = M(e, "修改资产标题失败");
  return et(n.asset);
}
async function Qo(t) {
  const e = await T(O("workbench/asset_delete"), "post", {
    team_id: t.teamID,
    asset_id: t.assetID
  });
  M(e, "删除资产失败");
}
async function ti(t) {
  const e = await T(O("workbench/asset_restore"), "post", {
    team_id: t.teamID,
    asset_id: t.assetID
  }), n = M(e, "恢复资产失败");
  return et(n.asset);
}
function $n(t) {
  return {
    asset: et(t.asset),
    versions: z(t.versions).map(gt).filter(tt),
    versionTotal: yt(t.version_total),
    hasMore: !!t.has_more
  };
}
function et(t) {
  const e = de(t?.version) ? gt(t.version) : null;
  return {
    id: I(t?.id),
    projectID: I(t?.project_id),
    bodyID: I(t?.body_id),
    teamID: I(t?.team_id),
    flowID: I(t?.flow_id),
    assetCateID: I(t?.asset_cate_id),
    collectionID: I(t?.collection_id),
    nodeKey: A(t?.node_key),
    sourceType: A(t?.source_type),
    sourceID: I(t?.source_id),
    sourceName: A(t?.source_name),
    name: A(t?.name) || "未命名资产",
    nameMode: A(t?.name_mode) === "manual" ? "manual" : "auto",
    kind: A(t?.kind) || "text",
    role: A(t?.role) || "material",
    versionID: I(t?.version_id),
    status: A(t?.status),
    summary: A(t?.summary || e?.summary),
    collectionCount: yt(t?.collection_count),
    collectionPreviews: z(t?.collection_previews).map(Pn).filter((n) => !!n),
    createdAt: A(t?.created_at),
    deletedAt: A(t?.deleted_at),
    version: e
  };
}
function Pn(t) {
  const e = A(t?.kind);
  return e !== "image" && e !== "video" || !t?.content ? null : {
    id: I(t?.id),
    kind: e,
    content: t.content
  };
}
function gt(t) {
  return {
    id: I(t?.id),
    assetID: I(t?.asset_id),
    runID: I(t?.run_id),
    nodeRunID: I(t?.node_run_id),
    releaseID: I(t?.release_id),
    requestID: A(t?.request_id),
    nodeKey: A(t?.node_key),
    source: de(t?.source) ? t.source : {},
    version: I(t?.version, 1),
    content: t?.content,
    summary: A(t?.summary),
    createdAt: A(t?.created_at),
    updatedAt: A(t?.updated_at || t?.created_at)
  };
}
function Rt(t) {
  return {
    id: I(t?.id),
    name: A(t?.name) || "未命名"
  };
}
function qt(...t) {
  const e = [], n = /* @__PURE__ */ new Set();
  for (const r of t)
    for (const o of z(r)) {
      const i = Rt(o);
      i.id <= 0 || n.has(i.id) || (n.add(i.id), e.push(i));
    }
  return e;
}
function En(t) {
  return {
    ...Rt(t),
    kind: A(t?.kind) || "text",
    cardinality: A(t?.cardinality) || "single"
  };
}
function tt(t) {
  return t.id > 0;
}
const Ln = [
  { key: "project", label: "创作" },
  { key: "tool", label: "工具" },
  { key: "dialogue", label: "对话" },
  { key: "upload", label: "上传" }
], zn = [
  { key: "work", label: "作品" },
  { key: "material", label: "素材" }
], jn = [
  { key: "collection", label: "集合" },
  { key: "text", label: "文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "richtext", label: "富文本" },
  { key: "file", label: "文件" }
];
function ei(t, e = {}) {
  const n = e.fallback || "资产", r = $t(Ln, t, n);
  return e[t] || r;
}
function ni(t) {
  return $t(zn, t, "素材");
}
function ri(t) {
  return $t(jn, t, "资产");
}
function oi(t) {
  if (t.length === 0 || t.some((r) => ["text", "richtext", "file"].includes(r)))
    return;
  const e = {
    image: "image/*",
    audio: "audio/*",
    video: "video/*"
  }, n = t.map((r) => e[r]).filter((r) => !!r);
  return n.length > 0 ? Array.from(new Set(n)).join(",") : void 0;
}
function $t(t, e, n) {
  return t.find((r) => r.key === e)?.label || n;
}
function Bn(t) {
  if (typeof t != "string")
    return t;
  const e = t.trim();
  if (!Pt(e))
    return t;
  try {
    return JSON.parse(e);
  } catch {
    return t;
  }
}
function _(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function ii(t) {
  return _(t) ? t : {};
}
function k(t) {
  return typeof t == "string" ? t.trim() : "";
}
function si(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) ? e : 0;
}
function ai(t) {
  if (t == null || t === "")
    return;
  const e = Number(t);
  return Number.isFinite(e) ? e : void 0;
}
function ge(t) {
  const e = String(t || "").trim(), n = Fn(e), r = Kn(n);
  for (const o of _e([e, n, r])) {
    const i = Bn(o);
    if (i !== o)
      return i;
    const s = vn(o);
    if (s !== o)
      return s;
  }
  return t;
}
function ci(t) {
  const e = String(t || "").trim();
  for (const n of he(e)) {
    const r = ge(n);
    if (r !== n)
      return r;
  }
  return t;
}
function nt(t) {
  const e = [];
  for (const n of he(
    String(t || "").trim()
  )) {
    const r = ge(n);
    r !== n && e.push(r);
  }
  return e;
}
function Fn(t) {
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
      e += Gn(o);
      continue;
    }
    e += o;
  }
  return e;
}
function he(t) {
  const e = [t];
  for (const n of t.matchAll(/```(?:json|storyboard)?\s*([\s\S]*?)```/gi))
    e.push(String(n[1] || "").trim());
  return e.push(...Un(t)), _e(e);
}
function Un(t) {
  const e = [];
  for (let n = 0; n < t.length; n += 1) {
    const r = t[n];
    if (r !== "{" && r !== "[")
      continue;
    const o = Vn(t, n);
    o && (e.push(o), n += o.length - 1);
  }
  return e;
}
function Vn(t, e) {
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
    const c = s === "}" ? "{" : "[";
    if (n.pop() !== c)
      return "";
    if (n.length === 0)
      return t.slice(e, i + 1).trim();
  }
  return "";
}
function Pt(t) {
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function vn(t) {
  if (!t.startsWith('"') || !t.endsWith('"'))
    return t;
  try {
    const e = JSON.parse(t);
    return typeof e == "string" ? e : t;
  } catch {
    return t;
  }
}
function Gn(t) {
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
function Kn(t) {
  const e = t.trim();
  return !e.includes('\\"') || !e.startsWith("{") && !e.startsWith("[") ? t : e.replace(/\\"/g, '"');
}
function _e(t) {
  const e = /* @__PURE__ */ new Set();
  return t.filter((n) => {
    const r = String(n || "").trim();
    return !r || e.has(r) ? !1 : (e.add(r), !0);
  });
}
function ui(...t) {
  return t.find(
    (e) => e != null
  );
}
function di(t) {
  try {
    return JSON.stringify(t);
  } catch {
    return "";
  }
}
const qn = {
  audio: "editorMediaAudio",
  image: "editorMediaImage",
  mediaAudio: "editorMediaAudio",
  mediaImage: "editorMediaImage",
  mediaVideo: "editorMediaVideo",
  video: "editorMediaVideo"
}, be = [
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
function li(t) {
  const e = we(t);
  return e.length > 120 ? `${e.slice(0, 120)}...` : e;
}
function we(t) {
  return rt(t).replace(/\s+/g, " ").trim();
}
function Wn(t) {
  if (typeof t != "string")
    return "";
  const e = t.trim();
  if (!Zn(e))
    return "";
  const n = e.search(/"rich"\s*:/), r = n >= 0 ? e.slice(n) : e, o = [], i = /"text"\s*:\s*"((?:\\.|[^"\\])*)"/g;
  let s = null;
  for (; (s = i.exec(r)) !== null; ) {
    const c = Xn(s[1]).trim();
    c && o.push(c);
  }
  return o.join(" ").replace(/\s+/g, " ").trim();
}
function Et(t) {
  const e = W(t, /* @__PURE__ */ new Set());
  return Lt(e) ? e : null;
}
function fi(t) {
  try {
    return we(t);
  } catch {
    return "";
  }
}
function mi(t) {
  try {
    return Et(t);
  } catch {
    return null;
  }
}
function rt(t) {
  if (typeof t == "string") {
    const r = t.trim();
    if (Pt(r)) {
      const o = Ae(r);
      if (o !== void 0)
        return rt(o).trim();
    }
    return Wn(r) || t;
  }
  if (Array.isArray(t))
    return t.map(rt).filter(Boolean).join(" ");
  if (!_(t))
    return "";
  const e = Et(t);
  if (e)
    return xe(e);
  const n = [
    typeof t.text == "string" ? t.text : "",
    typeof t.markdown == "string" ? t.markdown : ""
  ];
  for (const r of be)
    t[r] != null && n.push(rt(t[r]));
  return n.filter(Boolean).join(" ");
}
function W(t, e) {
  if (typeof t == "string") {
    const r = t.trim();
    if (!Pt(r))
      return null;
    const o = Ae(r);
    return o === void 0 ? null : W(o, e);
  }
  if (Array.isArray(t)) {
    const r = Wt({ type: "doc", content: t });
    if (Lt(r))
      return r;
    for (const o of t) {
      const i = W(o, e);
      if (i)
        return i;
    }
    return null;
  }
  if (!_(t) || e.has(t))
    return null;
  e.add(t);
  const n = Wt(t);
  if (n)
    return n;
  if (String(t.format || "").toLowerCase() === "rich_json" && t.rich != null) {
    const r = W(t.rich, e);
    if (r)
      return r;
  }
  for (const r of be) {
    if (t[r] == null)
      continue;
    const o = W(t[r], e);
    if (o)
      return o;
  }
  return null;
}
function Wt(t) {
  return !_(t) || ke(t.type) !== "doc" ? null : {
    type: "doc",
    attrs: _(t.attrs) ? t.attrs : void 0,
    content: Se(t.content)
  };
}
function Se(t) {
  return Array.isArray(t) ? t.map(Yn).filter((e) => !!e) : [];
}
function Yn(t) {
  if (!_(t))
    return null;
  const e = ke(t.type) || Jn(t);
  if (!e)
    return null;
  const n = { type: e }, r = _(t.attrs) ? { ...t.attrs } : {};
  if (e === "heading" && dt(r.level) <= 0) {
    const s = dt(t.level);
    s > 0 && (r.level = s);
  }
  Object.keys(r).length > 0 && (n.attrs = r);
  const o = Hn(t.marks);
  if (o.length > 0 && (n.marks = o), e === "text") {
    const s = B(t.text);
    return s ? (n.text = s, n) : null;
  }
  const i = Se(t.content);
  return i.length > 0 && (n.content = i), n;
}
function Jn(t) {
  if (typeof t.text == "string")
    return "text";
  const e = _(t.attrs) ? t.attrs : {};
  return dt(e.level) > 0 || dt(t.level) > 0 ? "heading" : "";
}
function Hn(t) {
  return Array.isArray(t) ? t.map((e) => {
    if (!_(e))
      return null;
    const n = B(e.type);
    return n ? {
      type: n,
      attrs: _(e.attrs) ? e.attrs : void 0
    } : null;
  }).filter(
    (e) => !!e
  ) : [];
}
function ke(t) {
  const e = B(t);
  return qn[e] || e;
}
function xe(t) {
  return t ? t.type === "text" ? t.text || "" : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? B(t.attrs?.alt || t.attrs?.title || t.attrs?.src) : (t.content || []).map(xe).filter(Boolean).join(" ") : "";
}
function Lt(t) {
  return t ? t.type === "text" ? !!B(t.text) : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? !!B(t.attrs?.src) : (t.content || []).some(Lt) : !1;
}
function Ae(t) {
  try {
    return JSON.parse(t);
  } catch {
    return;
  }
}
function Zn(t) {
  return t.includes("rich_json") || t.includes('"rich"') || t.includes("agent_run_id") || t.includes("node_run_id");
}
function Xn(t) {
  try {
    return JSON.parse(`"${t}"`);
  } catch {
    return t.replace(/\\"/g, '"').replace(/\\n/g, `
`).replace(/\\t/g, "	").replace(/\\\\/g, "\\");
  }
}
function dt(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) ? e : 0;
}
function B(t) {
  return t == null ? "" : String(t).trim();
}
const lt = [
  { value: "auto", label: "自动", columns: 0, rows: 0, capacity: 9 },
  { value: "2x2", label: "2×2", columns: 2, rows: 2, capacity: 4 },
  { value: "3x2", label: "3×2", columns: 3, rows: 2, capacity: 6 },
  { value: "3x3", label: "3×3", columns: 3, rows: 3, capacity: 9 }
], Qn = new Set(
  lt.map((t) => t.value)
);
function zt(t) {
  const e = String(t || "").trim().toLowerCase();
  return Qn.has(e) ? e : "auto";
}
function Ce(t) {
  const e = zt(t);
  return lt.find((n) => n.value === e) || lt[0];
}
function tr(t, e) {
  const n = Ce(t), r = Math.max(0, Math.trunc(Number(e) || 0));
  return n.value !== "auto" ? n : r === 0 || r > 6 ? { columns: 3, rows: 3, capacity: 9 } : r > 4 ? { columns: 3, rows: 2, capacity: 6 } : r > 2 ? { columns: 2, rows: 2, capacity: 4 } : { columns: 2, rows: 1, capacity: 2 };
}
const er = 50, nr = {
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
}, rr = [
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
function jt(t) {
  return Object.fromEntries(
    t.map((e) => [e, /* @__PURE__ */ new Map()])
  );
}
function ft(t, e, n = {}) {
  const r = {
    media: t,
    enabledKinds: Object.keys(t),
    seen: n.seen || /* @__PURE__ */ new Set(),
    requestedKind: n.kind
  };
  $(e, r, 0, n.kind);
}
function or(t, e) {
  const r = jt(e === "audio" ? ["audio", "image"] : [e]);
  return ft(r, t, { kind: e }), Ie(r), Array.from(r[e].values());
}
function Ie(t) {
  const e = t.audio, n = t.image;
  if (!e || !n || e.size === 0 || e.size !== n.size)
    return;
  const r = Array.from(n.values());
  Array.from(e.values()).forEach((o, i) => {
    if (o.thumbnail)
      return;
    const s = Ne(
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
      (u) => $(
        u,
        e,
        n + 1,
        r,
        l
      )
    );
    return;
  }
  if (typeof t == "string") {
    const l = nt(t);
    if (l.length > 0) {
      l.forEach(
        (f) => $(
          f,
          e,
          n + 1,
          r,
          o
        )
      );
      return;
    }
    const u = r || e.requestedKind || cr(t);
    u && e.media[u] && De(t) && ir(
      e.media,
      u,
      t.trim(),
      o
    );
    return;
  }
  if (typeof t != "object" || e.seen.has(t))
    return;
  e.seen.add(t);
  const i = t, s = _(i.attrs) ? i.attrs : void 0, c = ar(
    i.type,
    i.kind,
    i.media_type,
    i.mediaType,
    i.mime
  ), d = sr(
    i,
    s,
    o
  ), m = r || e.requestedKind;
  if (m && e.media[m] && (!c || c === m))
    for (const l of Yt(i, m))
      $(
        l,
        e,
        n + 1,
        m,
        d
      );
  for (const l of e.enabledKinds) {
    const u = nr[l];
    for (const f of u.direct)
      $(
        i[f],
        e,
        n + 1,
        l,
        d
      );
    for (const f of u.collections)
      $(
        i[f],
        e,
        n + 1,
        l,
        d
      );
  }
  if (c && e.media[c]) {
    for (const l of Yt(i, c))
      $(
        l,
        e,
        n + 1,
        c,
        d
      );
    $(
      i.attrs,
      e,
      n + 1,
      c,
      d
    );
  }
  for (const l of rr)
    $(
      i[l],
      e,
      n + 1
    );
}
function Yt(t, e) {
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
function ir(t, e, n, r) {
  const o = t[e];
  if (!o)
    return;
  const i = Ne(
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
function Ne(t, e, n) {
  const r = n.trim();
  return !r || t !== "image" && r === e.trim() ? "" : r;
}
function sr(t, e, n) {
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
    if (typeof r == "string" && De(r))
      return r.trim();
  return "";
}
function ar(...t) {
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
function cr(t) {
  const e = t.trim();
  if (/^data:image\//i.test(e) || /\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i.test(e))
    return "image";
  if (/^data:video\//i.test(e) || /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(e))
    return "video";
  if (/^data:audio\//i.test(e) || /\.(mp3|wav|ogg|m4a|aac)(?:[?#].*)?$/i.test(e))
    return "audio";
}
function De(t) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(t.trim());
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const St = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!St || Object.keys(St).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const Bt = ["image", "video", "audio"], ur = 64, dr = 128 * 1024, mt = /* @__PURE__ */ Symbol("content-output-cache-miss"), Jt = Re(), Ht = Re(), lr = St, fr = lr.normalizeEnergonOutput;
function P(...t) {
  for (const e of t)
    if (typeof e == "string" && e.trim())
      return e.trim();
  return "";
}
function pi(t) {
  const e = Z(
    t,
    ["lyrics", "lyric", "lrc", "song_lyrics", "songLyrics"],
    /* @__PURE__ */ new Set(),
    0
  );
  if (e)
    return { label: "歌词", text: e };
  const n = Z(
    t,
    ["text"],
    /* @__PURE__ */ new Set(),
    0
  );
  return n ? { label: "创作内容", text: n } : null;
}
function Z(t, e, n, r) {
  if (t == null || r > 12)
    return "";
  if (typeof t == "string") {
    for (const o of nt(t)) {
      const i = Z(o, e, n, r + 1);
      if (i)
        return i;
    }
    return "";
  }
  if (Array.isArray(t)) {
    for (const o of t) {
      const i = Z(o, e, n, r + 1);
      if (i)
        return i;
    }
    return "";
  }
  if (!_(t) || n.has(t))
    return "";
  n.add(t);
  for (const o of e) {
    const i = ot(t[o], r + 1);
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
    const i = Z(t[o], e, n, r + 1);
    if (i)
      return i;
  }
  return "";
}
function ot(t, e) {
  if (t == null || e > 12)
    return "";
  if (typeof t == "string") {
    const n = t.trim();
    if (!n || /^(https?:\/\/|\/|data:|blob:)/i.test(n))
      return "";
    const r = nt(n);
    return r.length > 0 ? r.map((o) => ot(o, e + 1)).filter(Boolean).join(`
`) : n;
  }
  if (Array.isArray(t))
    return t.map((n) => ot(n, e + 1)).filter(Boolean).join(`
`);
  if (!_(t))
    return "";
  for (const n of ["text", "content", "line", "lines", "value"]) {
    const r = ot(t[n], e + 1);
    if (r)
      return r;
  }
  return "";
}
function mr(t) {
  const e = Me(t);
  return !e || e.hasMedia ? "" : e.markdown;
}
function Me(t) {
  const e = Sr(t);
  return !e || !ze(e) ? null : {
    markdown: e.content.map(je).join(`

`).trim(),
    plainText: e.content.map(Be).join(`

`).trim(),
    hasMedia: Fe(e)
  };
}
function pr(t) {
  return /(^|\n)\s*(#{1,6}\s|[-*+]\s|>\s|\d+\.\s|```)/m.test(t) || /(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|`[^`]+`)/.test(t);
}
function yi(t) {
  return yr(t).length > 0;
}
function yr(t) {
  const e = ht(t);
  return Bt.filter((n) => e[n].size > 0);
}
function Oe(t) {
  const e = ht(t);
  return Bt.reduce(
    (n, r) => n + e[r].size,
    0
  );
}
function gi(t, e) {
  return Array.from(ht(t)[e].keys());
}
function gr(t, e) {
  return Array.from(ht(t)[e].values());
}
function hr(t) {
  const e = Te(t);
  return e ? Array.from(
    new Set(e.frames.map((n) => n.image.trim()).filter(Boolean))
  ) : [];
}
function Te(t) {
  const e = $e(Ht, t);
  return e !== mt ? e : Pe(
    Ht,
    t,
    st(t, /* @__PURE__ */ new Set(), 0)
  );
}
function hi(t, e) {
  const n = e.trim().toLowerCase();
  return n ? it(t, n, /* @__PURE__ */ new Set(), 0) : !1;
}
function _i(...t) {
  let e, n, r = 0;
  for (const o of t) {
    if (!F(o))
      continue;
    e === void 0 && (e = o);
    const i = Oe(o);
    i > r && (n = o, r = i);
  }
  return r > 0 ? n : e;
}
function F(t) {
  return t == null || t === "" ? !1 : Array.isArray(t) ? t.length > 0 : typeof t == "object" ? Object.keys(t).length > 0 : !0;
}
function ht(t) {
  const e = $e(Jt, t);
  if (e !== mt)
    return e;
  const n = jt(Bt), r = hr(t), o = /* @__PURE__ */ new Set();
  for (const i of Le(t))
    ft(n, i, { seen: o });
  return ft(n, t), Ie(n), r.length > 0 && (n.image = new Map(
    r.map((i) => [i, { url: i, thumbnail: i }])
  )), Pe(Jt, t, n);
}
function Re() {
  return {
    objects: /* @__PURE__ */ new WeakMap(),
    strings: /* @__PURE__ */ new Map()
  };
}
function $e(t, e) {
  if (e && typeof e == "object")
    return t.objects.has(e) ? t.objects.get(e) : mt;
  if (!Ee(e) || !t.strings.has(e))
    return mt;
  const n = t.strings.get(e);
  return t.strings.delete(e), t.strings.set(e, n), n;
}
function Pe(t, e, n) {
  if (e && typeof e == "object")
    return t.objects.set(e, n), n;
  if (!Ee(e))
    return n;
  for (t.strings.delete(e), t.strings.set(e, n); t.strings.size > ur; ) {
    const r = t.strings.keys().next().value;
    if (typeof r != "string")
      break;
    t.strings.delete(r);
  }
  return n;
}
function Ee(t) {
  return typeof t == "string" && t.length <= dr;
}
function Le(t) {
  if (!F(t))
    return [];
  const e = fr?.(t);
  return Array.isArray(e) && e.length > 0 ? e : Array.isArray(t) ? t : [t];
}
function it(t, e, n, r) {
  return t == null || r > 12 ? !1 : typeof t == "string" ? nt(t).some(
    (o) => it(o, e, n, r + 1)
  ) : Array.isArray(t) ? t.some(
    (o) => it(o, e, n, r + 1)
  ) : !_(t) || n.has(t) ? !1 : (n.add(t), String(t.type || "").trim().toLowerCase() === e ? !0 : [
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
    (o) => it(o, e, n, r + 1)
  ));
}
function st(t, e, n) {
  if (t == null || n > 12)
    return null;
  if (typeof t == "string") {
    const o = t.trim();
    if (!o || !o.startsWith("{") && !o.startsWith("["))
      return null;
    try {
      return st(JSON.parse(o), e, n + 1);
    } catch {
      return null;
    }
  }
  if (Array.isArray(t)) {
    for (const o of t) {
      const i = st(o, e, n + 1);
      if (i)
        return i;
    }
    return null;
  }
  if (!_(t) || e.has(t))
    return null;
  e.add(t);
  const r = _r(t);
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
    const i = st(t[o], e, n + 1);
    if (i)
      return i;
  }
  return null;
}
function _r(t) {
  if (String(t.type || "").trim().toLowerCase() !== "storyboard_grid" || !Array.isArray(t.frames))
    return null;
  const e = t.frames.map(br).filter((n) => !!n).sort((n, r) => n.order - r.order);
  return e.length < 2 || e.length > er ? null : {
    type: "storyboard_grid",
    version: Math.max(1, Math.trunc(Number(t.version) || 1)),
    title: P(t.title, "宫格图片"),
    summary: P(t.summary),
    frames: e
  };
}
function br(t, e) {
  if (!_(t))
    return null;
  const n = Math.max(1, Math.trunc(Number(t.order) || e + 1));
  return {
    id: P(t.id, `frame-${String(n).padStart(2, "0")}`),
    order: n,
    title: P(
      t.title,
      `画面 ${String(n).padStart(2, "0")}`
    ),
    description: P(t.description),
    prompt: P(t.prompt),
    status: P(t.status),
    image: wr(
      t.image,
      t.image_url,
      t.imageUrl
    ),
    error: P(t.error),
    assetID: Zt(t.asset_id, t.assetId, t.assetID),
    assetVersionID: Zt(
      t.asset_version_id,
      t.assetVersionId,
      t.assetVersionID
    )
  };
}
function wr(...t) {
  for (const e of t) {
    const n = jt(["image"]);
    ft(n, e, { kind: "image" });
    const r = n.image.values().next().value;
    if (r?.url)
      return r.url;
  }
  return "";
}
function Zt(...t) {
  for (const e of t) {
    const n = Math.trunc(Number(e) || 0);
    if (n > 0)
      return n;
  }
  return 0;
}
function Sr(t) {
  return _(t) ? t.type === "doc" && Array.isArray(t.content) ? t : _(t.rich) && t.rich.type === "doc" && Array.isArray(t.rich.content) ? t.rich : null : null;
}
function ze(t) {
  return _(t) ? t.type === "text" ? !Array.isArray(t.marks) || t.marks.length === 0 : t.type === "hardBreak" ? !0 : _t(t) ? !!Ue(t) : t.type !== "doc" && t.type !== "paragraph" ? !1 : Array.isArray(t.content) && t.content.every(ze) : !1;
}
function je(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : _t(t) ? `![${kr(
    String(t.attrs?.alt || t.attrs?.caption || "图片")
  )}](<${xr(Ue(t))}>)` : Array.isArray(t.content) ? t.content.map(je).join("") : "";
}
function Be(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : _t(t) ? "" : Array.isArray(t.content) ? t.content.map(Be).join("") : "";
}
function Fe(t) {
  return _t(t) || !!t.content?.some((e) => Fe(e));
}
function _t(t) {
  return ["image", "mediaImage", "editorMediaImage"].includes(
    String(t.type || "")
  );
}
function Ue(t) {
  return String(t.attrs?.src || "").trim();
}
function kr(t) {
  return t.replace(/([\\\[\]])/g, "\\$1");
}
function xr(t) {
  return t.replace(/</g, "%3C").replace(/>/g, "%3E");
}
const Ve = {
  image: "images",
  audio: "audios",
  video: "videos",
  file: "files"
};
function bi(t, e) {
  const n = Ve[t], r = n ? Ft(e, t) : [];
  if (n && r.length > 0)
    return { [n]: r };
  const o = Et(e);
  if (!o)
    return e;
  const i = Me(o);
  return i && (t === "text" || pr(i.plainText)) ? { text: i.markdown } : { rich: o };
}
function Ar(t, e) {
  return Ft(t, e)[0] || "";
}
function Ft(t, e) {
  return Cr(t, e).map((n) => n.url);
}
function Cr(t, e) {
  return Ir(e) ? or(t, e) : [];
}
function wi(t, e) {
  if (!Ve[e])
    return 0;
  const n = Ft(t, e).length;
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
function Ir(t) {
  return t === "image" || t === "video" || t === "audio" || t === "file";
}
function Xt(t, e = 0) {
  if (e > 8 || t == null) return "";
  if (typeof t == "string") return ve(t) ? "" : t.trim();
  if (Array.isArray(t))
    return t.map((r) => Xt(r, e + 1)).filter(Boolean)[0] || "";
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
    const o = Xt(n[r], e + 1);
    if (o) return o;
  }
  return "";
}
function Si(t) {
  const e = t?.source?.prompt;
  return typeof e == "string" ? e.trim() : "";
}
function ki(t) {
  const e = Ar(t, "file"), n = at(t) || yn(e), r = n.match(/\.([a-z0-9]{1,10})$/i)?.[1] || "";
  return { url: e, name: n, extension: r };
}
function at(t, e = 0) {
  if (t == null || e > 8) return "";
  if (typeof t == "string") {
    const r = t.trim();
    return ve(r) ? "" : r;
  }
  if (Array.isArray(t)) {
    for (const r of t) {
      const o = at(r, e + 1);
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
    const o = at(n[r], e + 1);
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
    const o = at(n[r], e + 1);
    if (o) return o;
  }
  return "";
}
function ve(t) {
  return /^(https?:\/\/|\/|data:|blob:)/.test(t.trim());
}
await window.DeverFront?.ensureCompat?.(["@/page/nodes/show/tooltip"]);
const kt = window.DeverFront?.sdk?.getCompatModule("@/page/nodes/show/tooltip");
if (!kt || Object.keys(kt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/page/nodes/show/tooltip");
const Nr = kt.HoverTip, Dr = 12e3;
function Qt({
  label: t,
  side: e = "top",
  sideOffset: n = 7,
  className: r = "",
  children: o
}) {
  return /* @__PURE__ */ a(
    Nr,
    {
      content: t,
      side: e,
      sideOffset: n,
      layerZIndex: Dr,
      className: `max-w-80 whitespace-normal break-words ${r}`.trim(),
      children: o
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const xt = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!xt || Object.keys(xt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const te = xt, ee = te.ContentView || te.EnergonContentView;
function Mr({
  output: t,
  fallback: e = "",
  streaming: n = !1,
  emptyText: r = "暂无内容",
  className: o,
  markdownClassName: i,
  richClassName: s,
  mediaLayout: c = "default"
}) {
  const d = Ge(t, e);
  return ee ? /* @__PURE__ */ a(ct, { className: o, children: /* @__PURE__ */ a(
    ee,
    {
      output: d,
      streaming: n,
      emptyText: r,
      markdownClassName: i,
      richClassName: s,
      mediaLayout: c
    }
  ) }) : e ? /* @__PURE__ */ a("div", { className: o, children: e }) : null;
}
function Ge(t, e = "") {
  return F(t) ? t : e ? { text: e } : t;
}
function ct({
  className: t,
  children: e
}) {
  const n = (r) => {
    Or(r.target) && r.stopPropagation();
  };
  return /* @__PURE__ */ a(
    "div",
    {
      className: t,
      onPointerDown: n,
      onClick: n,
      children: e
    }
  );
}
function Or(t) {
  return t instanceof Element && !!t.closest(
    "a, button, input, textarea, select, audio, video, [role='button']"
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const At = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!At || Object.keys(At).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const Tr = At.EnergonAudioPlayer;
function xi({
  src: t,
  prompt: e = "",
  detailed: n = !1,
  autoPlay: r = !1
}) {
  const o = /* @__PURE__ */ a(
    "div",
    {
      className: [
        "wb-asset-audio-preview",
        n ? "is-detail" : ""
      ].filter(Boolean).join(" "),
      children: /* @__PURE__ */ a(
        Tr,
        {
          src: t,
          detailed: n,
          autoPlay: r,
          className: "h-full min-h-0 border-0 bg-transparent p-0 shadow-none"
        }
      )
    }
  );
  return n ? /* @__PURE__ */ y("div", { className: "wb-asset-audio-detail", children: [
    o,
    e ? /* @__PURE__ */ y("section", { className: "wb-asset-audio-prompt", children: [
      /* @__PURE__ */ y("header", { children: [
        /* @__PURE__ */ a(bn, { "aria-hidden": "true" }),
        /* @__PURE__ */ a("strong", { children: "语音文本" })
      ] }),
      /* @__PURE__ */ a("p", { children: e })
    ] }) : null
  ] }) : o;
}
function Rr({
  ariaLabel: t,
  header: e,
  children: n,
  onRequestClose: r,
  layer: o = "default"
}) {
  const i = /* @__PURE__ */ a(
    "div",
    {
      className: `wb-detail-backdrop ${o === "nested" ? "is-nested" : ""}`.trim(),
      role: "presentation",
      onMouseDown: () => {
        r();
      },
      children: /* @__PURE__ */ y(
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
  return typeof document > "u" ? null : pn(i, document.body);
}
function $r({
  icon: t,
  title: e,
  subtitle: n,
  versionSelect: r,
  state: o,
  updatedAt: i,
  actions: s,
  downloadUrl: c,
  onClose: d
}) {
  return /* @__PURE__ */ y("header", { className: "wb-detail-head", children: [
    /* @__PURE__ */ y("div", { className: "wb-detail-heading", children: [
      /* @__PURE__ */ a("span", { className: "wb-detail-kind-icon", "aria-hidden": "true", children: t }),
      /* @__PURE__ */ y("div", { children: [
        /* @__PURE__ */ a("strong", { children: e || "详情" }),
        n ? /* @__PURE__ */ a("span", { children: n }) : null
      ] })
    ] }),
    /* @__PURE__ */ y("div", { className: "wb-detail-meta", children: [
      r,
      o,
      i ? /* @__PURE__ */ a("time", { children: i }) : null
    ] }),
    /* @__PURE__ */ y("div", { className: "wb-detail-actions", children: [
      s,
      c ? /* @__PURE__ */ a(Qt, { label: "下载内容", children: /* @__PURE__ */ a(
        gn,
        {
          url: c,
          name: e,
          className: "wb-detail-icon-button"
        }
      ) }) : null,
      /* @__PURE__ */ a(Qt, { label: "关闭", children: /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "wb-detail-icon-button",
          onClick: d,
          "aria-label": "关闭详情",
          children: /* @__PURE__ */ a(wn, { size: 18 })
        }
      ) })
    ] })
  ] });
}
function Ai({
  options: t,
  currentVersionId: e,
  selectedVersionId: n,
  total: r,
  hasMore: o,
  loading: i,
  loadingMore: s,
  error: c,
  disabled: d = !1,
  onSelect: m,
  onLoadMore: l,
  onRetry: u
}) {
  const [f, g] = D(!1), b = ye(null), S = t.find((p) => p.id === n) || t.find((p) => p.id === e);
  return j(() => {
    if (!f) return;
    const p = (w) => {
      b.current?.contains(w.target) || g(!1);
    };
    return document.addEventListener("mousedown", p), () => document.removeEventListener("mousedown", p);
  }, [f]), !n && !i ? null : /* @__PURE__ */ y("div", { className: "wb-detail-version-select", ref: b, children: [
    /* @__PURE__ */ y(
      "button",
      {
        type: "button",
        className: "wb-detail-version-trigger",
        "aria-haspopup": "listbox",
        "aria-expanded": f,
        disabled: d || i && t.length === 0,
        onClick: () => g((p) => !p),
        children: [
          i && t.length === 0 ? /* @__PURE__ */ a(J, { size: 12, className: "wb-detail-spin" }) : null,
          /* @__PURE__ */ a("span", { children: re(S?.version) }),
          r > 0 ? /* @__PURE__ */ y("small", { children: [
            r,
            " 个版本"
          ] }) : null,
          /* @__PURE__ */ a(me, { size: 13 })
        ]
      }
    ),
    f ? /* @__PURE__ */ a("div", { className: "wb-detail-version-menu", role: "listbox", children: /* @__PURE__ */ y(
      "div",
      {
        className: "wb-detail-version-options",
        onScroll: (p) => {
          const w = p.currentTarget;
          o && !s && w.scrollHeight - w.scrollTop - w.clientHeight < 36 && l();
        },
        children: [
          t.length > 0 ? t.map((p) => {
            const w = p.id === n, R = p.id === e;
            return /* @__PURE__ */ y(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": w,
                className: w ? "is-selected" : "",
                onClick: () => {
                  g(!1), m(p.value);
                },
                children: [
                  /* @__PURE__ */ y("span", { children: [
                    /* @__PURE__ */ a("strong", { children: re(p.version) }),
                    R ? /* @__PURE__ */ a("small", { children: "当前" }) : null
                  ] }),
                  /* @__PURE__ */ a("time", { children: Pr(p.updatedAt) }),
                  w ? /* @__PURE__ */ a(pe, { size: 13 }) : /* @__PURE__ */ a("i", { "aria-hidden": "true" })
                ]
              },
              p.id
            );
          }) : c ? /* @__PURE__ */ a(ne, { error: c, onRetry: u }) : /* @__PURE__ */ y("div", { className: "wb-detail-version-message", children: [
            i ? /* @__PURE__ */ a(J, { size: 14, className: "wb-detail-spin" }) : null,
            /* @__PURE__ */ a("span", { children: i ? "正在读取版本" : "暂无版本" })
          ] }),
          c && t.length > 0 ? /* @__PURE__ */ a(ne, { error: c, onRetry: u }) : null,
          s ? /* @__PURE__ */ y("div", { className: "wb-detail-version-loading", children: [
            /* @__PURE__ */ a(J, { size: 13, className: "wb-detail-spin" }),
            "正在加载更多"
          ] }) : null
        ]
      }
    ) }) : null
  ] });
}
function ne({
  error: t,
  onRetry: e
}) {
  return /* @__PURE__ */ y("div", { className: "wb-detail-version-message is-error", children: [
    /* @__PURE__ */ a("span", { children: t }),
    /* @__PURE__ */ y("button", { type: "button", onClick: e, children: [
      /* @__PURE__ */ a(Sn, { size: 12 }),
      "重试"
    ] })
  ] });
}
function re(t) {
  const e = Number(t || 0);
  return e > 0 ? `第${e}版` : "版本";
}
function Pr(t) {
  const e = String(t || "").trim();
  return e ? e.replace("T", " ").replace(/\.\d+(Z)?$/, "").replace(/Z$/, "") : "";
}
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const Ct = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!Ct || Object.keys(Ct).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const Er = Ct.FirstFrameVideo, Lr = 56;
function oe(t, e) {
  const n = t.getBoundingClientRect(), r = Math.min(
    Lr,
    n.height * 0.25
  );
  return e >= n.bottom - r;
}
function zr({
  src: t,
  poster: e = "",
  alt: n = "",
  className: r,
  style: o,
  title: i,
  draggable: s = !1,
  ariaLabel: c,
  onLoad: d,
  onError: m,
  onMediaSize: l,
  objectFit: u = "cover",
  allowDragFromVideo: f = !1
}) {
  const g = ye(null), [b, S] = D(""), [p, w] = D(""), [R, V] = D(""), [h, L] = D(""), N = b === t, C = p === t, bt = R !== t && h !== t;
  j(() => {
    const x = g.current;
    if (!x || !f) return;
    const G = (K) => {
      oe(x, K.clientY) && K.stopPropagation();
    }, Gt = (K) => {
      const Kt = K.touches[0];
      Kt && oe(x, Kt.clientY) && K.stopPropagation();
    };
    return x.addEventListener("mousedown", G), x.addEventListener("touchstart", Gt, {
      passive: !0
    }), () => {
      x.removeEventListener("mousedown", G), x.removeEventListener("touchstart", Gt);
    };
  }, [f]);
  function v(x) {
    x.stopPropagation();
  }
  function vt() {
    S((x) => x === t ? "" : x), w((x) => x === t ? "" : x);
  }
  function fn(x) {
    x.preventDefault(), x.stopPropagation();
    const G = g.current;
    G && (S(t), w(""), G.play().catch(() => {
      vt(), m?.();
    }));
  }
  return /* @__PURE__ */ y(
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
        /* @__PURE__ */ a(
          Er,
          {
            videoRef: g,
            src: t,
            poster: e || void 0,
            controls: N,
            playsInline: !0,
            preload: "none",
            draggable: s,
            "aria-hidden": C ? void 0 : !0,
            className: [
              f ? "" : "nodrag",
              "nopan nowheel absolute inset-0 block h-full w-full",
              C ? "opacity-100" : "pointer-events-none opacity-0"
            ].join(" "),
            style: { objectFit: u },
            onPointerDown: f ? void 0 : v,
            onClick: v,
            onLoadedMetadata: (x) => l?.(
              x.currentTarget.videoWidth,
              x.currentTarget.videoHeight
            ),
            onPlaying: () => w(t),
            onError: () => {
              vt(), m?.();
            }
          }
        ),
        C ? null : /* @__PURE__ */ y(fe, { children: [
          /* @__PURE__ */ a(
            hn,
            {
              src: t,
              poster: e,
              alt: n,
              className: "pointer-events-none absolute inset-0 z-[1] block h-full w-full",
              style: { objectFit: u },
              draggable: s,
              ariaHidden: !0,
              onLoad: () => {
                V(t), d?.();
              },
              onError: () => {
                L(t), m?.();
              },
              onMediaSize: l
            }
          ),
          N ? /* @__PURE__ */ a(
            "span",
            {
              className: "pointer-events-none absolute left-1/2 top-1/2 z-[2] inline-flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white shadow-lg backdrop-blur-sm",
              role: "status",
              "aria-label": "正在加载视频",
              children: /* @__PURE__ */ a(
                J,
                {
                  size: 16,
                  className: "animate-spin",
                  "aria-hidden": "true"
                }
              )
            }
          ) : /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "nodrag nopan nowheel absolute left-1/2 top-1/2 z-[2] inline-flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/65 p-0 text-white shadow-lg backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80",
              "aria-label": c ? `播放${c}` : "播放视频",
              onPointerDown: v,
              onClick: fn,
              children: bt ? /* @__PURE__ */ a(
                J,
                {
                  size: 16,
                  className: "animate-spin",
                  "aria-hidden": "true"
                }
              ) : /* @__PURE__ */ a(
                kn,
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
await window.DeverFront?.ensureCompat?.(["@/components/ui/dropdown-menu", "@/components/energon/content-view"]);
const U = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dropdown-menu");
if (!U || Object.keys(U).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const jr = U.DropdownMenu, Br = U.DropdownMenuContent, Fr = U.DropdownMenuItem, Ur = U.DropdownMenuTrigger, It = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!It || Object.keys(It).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const Vr = It.EnergonAudioPlayer, vr = {
  image: "图片",
  video: "视频",
  audio: "音频"
}, Gr = {
  image: "张",
  video: "个",
  audio: "个"
};
function Ke(t, e) {
  const n = tr(e, t), r = Math.max(1, Math.ceil(t / n.capacity)), [o, i] = D(0);
  j(() => {
    i((c) => Math.min(c, r - 1));
  }, [r]);
  const s = Math.min(o, r - 1);
  return {
    shape: n,
    pageCount: r,
    pageIndex: s,
    pageOffset: s * n.capacity,
    setPageIndex: i
  };
}
function qe({
  layout: t,
  countLabel: e,
  pageIndex: n,
  pageCount: r,
  disabled: o = !1,
  leading: i,
  actions: s,
  onLayoutChange: c,
  onPageChange: d
}) {
  const m = zt(t), l = Ce(m);
  return /* @__PURE__ */ y("header", { className: "ws-media-grid-toolbar", children: [
    /* @__PURE__ */ y("div", { className: "ws-media-grid-toolbar-main", children: [
      i,
      /* @__PURE__ */ y(jr, { modal: !1, children: [
        /* @__PURE__ */ a(Ur, { asChild: !0, children: /* @__PURE__ */ y(
          "button",
          {
            type: "button",
            className: "ws-media-grid-layout-trigger nodrag nopan",
            disabled: o || !c,
            "aria-label": "选择每页宫格布局",
            onClick: (u) => u.stopPropagation(),
            children: [
              /* @__PURE__ */ a(xn, { size: 14 }),
              l.label,
              /* @__PURE__ */ a(me, { size: 12 })
            ]
          }
        ) }),
        /* @__PURE__ */ a(
          Br,
          {
            align: "start",
            className: "ws-media-grid-layout-menu",
            onClick: (u) => u.stopPropagation(),
            children: lt.map((u) => /* @__PURE__ */ y(
              Fr,
              {
                className: "ws-media-grid-layout-item",
                onSelect: () => {
                  d(0), c?.(u.value);
                },
                children: [
                  /* @__PURE__ */ a("span", { children: u.label }),
                  /* @__PURE__ */ a("small", { children: u.value === "auto" ? "按结果排版" : `每页 ${u.capacity} 格` }),
                  u.value === m ? /* @__PURE__ */ a(pe, { size: 13 }) : null
                ]
              },
              u.value
            ))
          }
        )
      ] }),
      /* @__PURE__ */ a("span", { className: "ws-media-grid-count", children: e }),
      r > 1 ? /* @__PURE__ */ y("div", { className: "ws-media-grid-page-controls", "aria-label": "宫格分页", children: [
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: n <= 0,
            title: "上一页",
            "aria-label": "上一页",
            onClick: (u) => {
              u.stopPropagation(), d(Math.max(0, n - 1));
            },
            children: /* @__PURE__ */ a(An, { size: 14 })
          }
        ),
        /* @__PURE__ */ y("span", { children: [
          n + 1,
          "/",
          r
        ] }),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: n >= r - 1,
            title: "下一页",
            "aria-label": "下一页",
            onClick: (u) => {
              u.stopPropagation(), d(Math.min(r - 1, n + 1));
            },
            children: /* @__PURE__ */ a(Cn, { size: 14 })
          }
        )
      ] }) : null
    ] }),
    s ? /* @__PURE__ */ a("div", { className: "ws-media-grid-toolbar-actions", children: s }) : null
  ] });
}
function Kr({
  kind: t,
  items: e,
  label: n
}) {
  const [r, o] = D("auto"), i = Ke(e.length, r), s = e.slice(
    i.pageOffset,
    i.pageOffset + i.shape.capacity
  ), c = Array.from(
    { length: i.shape.capacity },
    (m, l) => s[l]
  ), d = vr[t];
  return /* @__PURE__ */ y("section", { className: `ws-media-grid-view is-${t}`, children: [
    /* @__PURE__ */ a(
      qe,
      {
        layout: r,
        countLabel: `${e.length} ${Gr[t]}`,
        pageIndex: i.pageIndex,
        pageCount: i.pageCount,
        onLayoutChange: o,
        onPageChange: i.setPageIndex
      }
    ),
    /* @__PURE__ */ a("div", { className: "ws-media-grid-body nowheel", children: /* @__PURE__ */ a(
      "div",
      {
        className: "ws-media-grid-list",
        style: {
          gridTemplateColumns: `repeat(${i.shape.columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${i.shape.rows}, minmax(0, 1fr))`
        },
        children: c.map((m, l) => {
          const u = i.pageOffset + l, f = `${n || d} ${u + 1}`;
          return m ? /* @__PURE__ */ a(
            "figure",
            {
              className: t === "audio" ? "is-audio" : void 0,
              "aria-label": t === "audio" ? f : void 0,
              children: /* @__PURE__ */ a(qr, { kind: t, item: m, label: f })
            },
            `${m.url}-${u}`
          ) : /* @__PURE__ */ a("figure", { className: "is-empty" }, `empty-${u}`);
        })
      }
    ) })
  ] });
}
function qr({
  kind: t,
  item: e,
  label: n
}) {
  const { url: r } = e;
  return t === "image" ? /* @__PURE__ */ a(
    "img",
    {
      src: r,
      alt: n,
      loading: "lazy",
      decoding: "async",
      draggable: !1
    }
  ) : t === "video" ? /* @__PURE__ */ a(
    zr,
    {
      src: r,
      poster: e.thumbnail,
      draggable: !1,
      ariaLabel: n,
      objectFit: "cover"
    },
    r
  ) : /* @__PURE__ */ y(
    "div",
    {
      className: `ws-media-grid-audio-card${e.thumbnail ? " has-cover" : ""}`,
      children: [
        e.thumbnail ? /* @__PURE__ */ a("img", { src: e.thumbnail, alt: "", loading: "lazy", decoding: "async" }) : null,
        /* @__PURE__ */ a(
          Vr,
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
function Wr({
  items: t,
  initialItemID: e,
  onClose: n
}) {
  const r = ie(t, e), [o, i] = D(r), s = t.map((m) => `${String(m.id)}:${m.url}`).join(`
`);
  j(() => {
    i(ie(t, e));
  }, [e, s]), j(() => {
    const m = (l) => {
      l.key === "Escape" && n();
    };
    return document.addEventListener("keydown", m), () => document.removeEventListener("keydown", m);
  }, [n]);
  const c = Math.min(
    Math.max(0, o),
    Math.max(0, t.length - 1)
  ), d = t[c];
  return d ? /* @__PURE__ */ a(
    Rr,
    {
      ariaLabel: "图片预览",
      layer: "nested",
      onRequestClose: n,
      header: /* @__PURE__ */ a(
        $r,
        {
          icon: /* @__PURE__ */ a(In, { size: 16 }),
          title: d.name || "图片预览",
          subtitle: `图片 ${c + 1}/${t.length}`,
          downloadUrl: d.url,
          onClose: n
        }
      ),
      children: /* @__PURE__ */ a("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ a(
        _n,
        {
          kind: "image",
          items: t,
          activeIndex: c,
          onSelect: i
        }
      ) })
    }
  ) : null;
}
function ie(t, e) {
  const n = t.findIndex((r) => String(r.id) === String(e));
  return n >= 0 ? n : 0;
}
function We({
  grid: t,
  variant: e = "compact",
  readonly: n = !0,
  renderFrameAction: r,
  onFrameChange: o,
  onFrameImport: i,
  onEmptyFrameImport: s,
  capacity: c,
  showHeader: d = !0,
  showCaptions: m = !0,
  columns: l,
  rows: u,
  frameOffset: f = 0,
  previewFrames: g
}) {
  const [b, S] = D(
    null
  ), p = Dn(
    () => (g || t.frames).filter((h) => !!h.image).map((h) => ({
      id: h.id || h.order,
      name: h.title || `画面 ${h.order}`,
      url: h.image,
      thumbnail: h.image
    })),
    [t.frames, g]
  ), w = Math.max(
    t.frames.length,
    Math.trunc(Number(c) || 0)
  ), R = Array.from(
    { length: w },
    (h, L) => t.frames[L]
  ), V = {
    ...l ? { gridTemplateColumns: `repeat(${l}, minmax(0, 1fr))` } : {},
    ...u ? { gridTemplateRows: `repeat(${u}, minmax(0, 1fr))` } : {}
  };
  return /* @__PURE__ */ y("section", { className: `ws-storyboard-grid-output is-${e}`, children: [
    d ? /* @__PURE__ */ y("header", { children: [
      /* @__PURE__ */ a("strong", { children: t.title }),
      t.summary ? /* @__PURE__ */ a("p", { children: t.summary }) : null
    ] }) : null,
    /* @__PURE__ */ a(
      "div",
      {
        className: "ws-storyboard-grid-output-list",
        "data-count": R.length,
        style: V,
        children: R.map((h, L) => {
          const N = f + L;
          return h ? /* @__PURE__ */ y("figure", { className: h.image ? "" : "is-empty", children: [
            h.image ? /* @__PURE__ */ a(
              Yr,
              {
                frame: h,
                onPreview: () => S(h.id || h.order)
              }
            ) : i ? /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-empty nodrag nopan",
                title: "导入图片",
                "aria-label": `向第 ${h.order} 格导入图片`,
                onClick: (C) => {
                  C.preventDefault(), C.stopPropagation(), i(h, N);
                },
                children: /* @__PURE__ */ a(H, { size: 18 })
              }
            ) : /* @__PURE__ */ a("div", { className: "ws-storyboard-grid-output-error", children: h.error || "暂无图片" }),
            h.image && i ? /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-import nodrag nopan",
                title: "替换图片",
                "aria-label": `替换第 ${h.order} 格图片`,
                onClick: (C) => {
                  C.preventDefault(), C.stopPropagation(), i(h, N);
                },
                children: /* @__PURE__ */ a(H, { size: 14 })
              }
            ) : null,
            m ? /* @__PURE__ */ y("figcaption", { children: [
              /* @__PURE__ */ a("span", { children: String(h.order).padStart(2, "0") }),
              e === "detail" && !n && o ? /* @__PURE__ */ a(
                "input",
                {
                  value: h.title,
                  "aria-label": `第 ${h.order} 格标题`,
                  onChange: (C) => o(N, { title: C.target.value })
                }
              ) : /* @__PURE__ */ a("strong", { children: h.title })
            ] }) : null,
            e === "detail" ? /* @__PURE__ */ y("div", { className: "ws-storyboard-grid-output-details", children: [
              n || !o ? /* @__PURE__ */ a("p", { children: h.description || "暂无画面说明" }) : /* @__PURE__ */ a(
                "textarea",
                {
                  value: h.description,
                  rows: 3,
                  "aria-label": `第 ${h.order} 格说明`,
                  placeholder: "画面说明",
                  onChange: (C) => o(N, {
                    description: C.target.value
                  })
                }
              ),
              r ? /* @__PURE__ */ a("div", { className: "ws-storyboard-grid-output-actions", children: r(h, N) }) : null
            ] }) : null
          ] }, h.id) : /* @__PURE__ */ a("figure", { className: "is-empty", children: s ? /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "ws-storyboard-grid-frame-empty nodrag nopan",
              title: "导入图片",
              "aria-label": `向第 ${N + 1} 格导入图片`,
              onClick: (C) => {
                C.preventDefault(), C.stopPropagation(), s(N);
              },
              children: /* @__PURE__ */ a(H, { size: 18 })
            }
          ) : null }, `empty-${N}`);
        })
      }
    ),
    b != null && p.length > 0 ? /* @__PURE__ */ a(
      Wr,
      {
        items: p,
        initialItemID: b,
        onClose: () => S(null)
      }
    ) : null
  ] });
}
function Yr({
  frame: t,
  onPreview: e
}) {
  const [n, r] = D(!1);
  return j(() => {
    r(!1);
  }, [t.image]), n ? /* @__PURE__ */ a("div", { className: "ws-storyboard-grid-output-error", children: t.error || "图片加载失败" }) : /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      className: "ws-storyboard-grid-image nodrag nopan",
      title: "预览图片",
      "aria-label": `预览第 ${t.order} 格图片`,
      onClick: (o) => {
        o.preventDefault(), o.stopPropagation(), e();
      },
      children: /* @__PURE__ */ a(
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
function Ci({
  grid: t,
  aspectRatio: e,
  running: n = !1,
  onImport: r,
  onFrameImport: o,
  onSlotImport: i,
  onEdit: s,
  layout: c = "auto",
  onLayoutChange: d
}) {
  const m = zt(c), l = t?.frames.length || 0, u = Ke(l, m), f = t ? {
    ...t,
    frames: t.frames.slice(
      u.pageOffset,
      u.pageOffset + u.shape.capacity
    )
  } : null, g = t?.frames.filter((S) => S.image).length || 0, b = l > 0 && g !== l ? `${g}/${l} 张` : `${l} 张`;
  return /* @__PURE__ */ y(
    "section",
    {
      className: `ws-storyboard-grid-canvas ${n ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ a(
          qe,
          {
            layout: m,
            countLabel: b,
            pageIndex: u.pageIndex,
            pageCount: u.pageCount,
            disabled: n || !d,
            leading: /* @__PURE__ */ y("span", { children: [
              "比例 ",
              e || "自动"
            ] }),
            actions: r || t && s ? /* @__PURE__ */ y(fe, { children: [
              r ? /* @__PURE__ */ y(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: n,
                  onClick: (S) => {
                    S.stopPropagation(), r();
                  },
                  children: [
                    /* @__PURE__ */ a(H, { size: 14 }),
                    /* @__PURE__ */ a("span", { children: t ? "批量导入" : "导入图片" })
                  ]
                }
              ) : null,
              t && s ? /* @__PURE__ */ y(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: n,
                  onClick: (S) => {
                    S.stopPropagation(), s();
                  },
                  children: [
                    /* @__PURE__ */ a(Nn, { size: 14 }),
                    /* @__PURE__ */ a("span", { children: "编辑" })
                  ]
                }
              ) : null
            ] }) : void 0,
            onLayoutChange: d,
            onPageChange: u.setPageIndex
          }
        ),
        /* @__PURE__ */ a("div", { className: "ws-storyboard-grid-canvas-body nowheel", children: f ? /* @__PURE__ */ a(
          We,
          {
            grid: f,
            previewFrames: t?.frames,
            capacity: u.shape.capacity,
            columns: u.shape.columns,
            rows: u.shape.rows,
            frameOffset: u.pageOffset,
            showHeader: !1,
            showCaptions: !1,
            onFrameImport: n ? void 0 : o,
            onEmptyFrameImport: n ? void 0 : i
          }
        ) : /* @__PURE__ */ a(
          "div",
          {
            className: "ws-storyboard-grid-placeholder",
            "aria-busy": n,
            style: {
              gridTemplateColumns: `repeat(${u.shape.columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${u.shape.rows}, minmax(0, 1fr))`
            },
            children: Array.from({ length: u.shape.capacity }, (S, p) => /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "nodrag nopan",
                disabled: n || !i,
                title: "导入图片",
                "aria-label": `向宫格导入图片，第 ${p + 1} 格`,
                onClick: (w) => {
                  w.stopPropagation(), i?.(p);
                },
                children: /* @__PURE__ */ a(H, { size: 18 })
              },
              p
            ))
          }
        ) })
      ]
    }
  );
}
function Ut(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  for (const o of t) {
    if (!_(o))
      continue;
    const i = X(o.asset_id ?? o.assetId), s = He(o.kind), c = Dt(o.purpose);
    if (!i || !s || !c || r.has(i))
      continue;
    let d = String(o.key || "").trim() || Nt(i);
    if (n.has(d) && (d = Nt(i)), n.has(d))
      continue;
    const m = X(o.version_id ?? o.versionId), l = String(o.label || "").trim() || `参考素材 ${e.length + 1}`;
    e.push({
      key: d,
      asset_id: i,
      ...m ? { version_id: m } : {},
      label: l,
      kind: s,
      purpose: c
    }), n.add(d), r.add(i);
  }
  return e;
}
function Ii(t, e, n, r, o, i) {
  const s = new Map(
    Ut(e).map((u) => [
      u.asset_id,
      u
    ])
  ), c = new Map(
    n.flatMap((u) => {
      const f = X(u.refId);
      return f ? [[f, u]] : [];
    })
  ), d = [], m = (t?.parts || []).map((u) => ({ ...u })), l = /* @__PURE__ */ new Set();
  for (const [u, f] of (t?.parts || []).entries()) {
    if (f.type !== "reference" || f.ref_type !== "asset")
      continue;
    const g = X(f.ref_id);
    if (!g || l.has(g))
      continue;
    const b = s.get(g), S = c.get(g), p = He(S?.kind) || b?.kind;
    if (!p)
      continue;
    const w = X(S?.versionID || f.ref_version_id), R = String(S?.title || f.label || b?.label || "").trim() || `参考素材 ${d.length + 1}`, V = Ye(
      p,
      o,
      i
    ), h = Dt(f.purpose), L = Dt(
      b?.purpose
    ), N = [h, L].find(
      (bt) => V.some((v) => v.value === bt)
    ) || Hr(
      r,
      R,
      p,
      o,
      i
    ), C = m[u];
    C?.type === "reference" && (C.purpose = N || void 0), d.push({
      key: b?.key || Nt(g),
      asset_id: g,
      ...w ? { version_id: w } : {},
      label: R,
      kind: p,
      purpose: N
    }), l.add(g);
  }
  return {
    content: t ? { ...t, parts: m } : void 0,
    references: d
  };
}
function Ni(t, e) {
  return e.filter(
    (n) => n.work_types.length === 0 || n.work_types.includes(t)
  ).map((n) => ({
    key: n.key,
    label: n.name,
    acceptedKinds: [...n.media_kinds]
  }));
}
function Ye(t, e, n) {
  return n.filter(
    (r) => r.media_kinds.includes(t) && (r.work_types.length === 0 || r.work_types.includes(e))
  ).map((r) => ({ value: r.key, label: r.name }));
}
function Je(t, e) {
  return e.find((n) => n.key === t);
}
function Jr(t, e) {
  return Je(t, e)?.name || t;
}
function Di(t, e, n, r) {
  const o = n.find((s) => s.key === e);
  if (!o || r.length === 0)
    return "分镜作品类型或参考用途配置无效";
  const i = /* @__PURE__ */ new Map();
  for (const s of t) {
    const c = Je(
      s.purpose,
      r
    );
    if (!c)
      return `参考素材“${s.label}”的用途无效`;
    if (!c.media_kinds.includes(s.kind))
      return `参考素材“${s.label}”的类型不支持用途“${c.name}”`;
    if (c.work_types.length > 0 && !c.work_types.includes(e))
      return `当前作品类型不支持“${s.label}”的用途“${c.name}”`;
    const d = (i.get(s.purpose) || 0) + 1;
    if (i.set(s.purpose, d), c.max_count > 0 && d > c.max_count)
      return `用途“${c.name}”最多只能选择 ${c.max_count} 个素材`;
  }
  for (const s of o.required_reference_purposes)
    if (!i.get(s))
      return `${o.name}必须添加“${Jr(
        s,
        r
      )}”`;
  return "";
}
function Nt(t) {
  return `ref-${t}`;
}
function Dt(t) {
  const e = String(t || "").trim();
  return e || void 0;
}
function Hr(t, e, n, r, o) {
  const i = Zr(t, e), s = [];
  /角色|人物|主角|外貌|长相|形象/.test(i) && n === "image" && s.push("character"), /场景|环境|地点|空间/.test(i) && n === "image" && s.push("scene"), /产品|商品/.test(i) && n === "image" && r === "ad" && s.push("product"), /道具|产品|商品|物品/.test(i) && n === "image" && s.push("prop"), /镜头|构图|画面/.test(i) && n !== "audio" && s.push("shot"), /运镜|节奏|动作|转场|剪辑/.test(i) && n === "video" && s.push("motion_style"), /风格|画风|色调|光线|质感|视觉/.test(i) && n !== "audio" && s.push("visual_style");
  const c = Ye(n, r, o), d = s.find(
    (l) => c.some((u) => u.value === l)
  );
  return d || o.find(
    (l) => l.default_media_kinds.includes(n) && (l.work_types.length === 0 || l.work_types.includes(r))
  )?.key || c[0]?.value || "";
}
function Zr(t, e) {
  const n = `@${String(e || "").replace(/^@+/, "")}`, r = t.indexOf(n);
  return r < 0 ? t : t.slice(Math.max(0, r - 24), r + n.length + 32);
}
function He(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "image" || e === "video" || e === "audio" ? e : void 0;
}
function X(t) {
  const e = Number(t || 0);
  return Number.isInteger(e) && e > 0 ? e : 0;
}
function Xr(t) {
  return typeof t == "string" && t.length > 0 && t.trim() === t;
}
const Mt = 9, Vt = 4, Qr = 50, se = /* @__PURE__ */ new Set([
  "未命名",
  "未命名分镜",
  "分镜",
  "分镜脚本",
  "暂无内容简介",
  "围绕当前主题展开并完成一个连贯事件"
]), to = [
  "none",
  "fade",
  "crossfade",
  "fadeblack",
  "fadewhite",
  "wipeleft",
  "wiperight"
], Mi = {
  none: "硬切",
  fade: "淡化",
  crossfade: "交叉溶解",
  fadeblack: "黑场淡化",
  fadewhite: "白场淡化",
  wipeleft: "向左擦除",
  wiperight: "向右擦除"
}, eo = ["photoreal", "stylized"], Oi = {
  photoreal: "写实影像",
  stylized: "非写实影像"
}, no = [
  "16:9",
  "9:16",
  "1:1",
  "4:3",
  "3:4",
  "21:9"
], ro = "16:9", Ti = {
  character: "角色",
  scene: "场景",
  prop: "道具"
}, oo = {
  character: "画面类型：写实影像，人物五官、身体比例、光线和材质保持真实自然",
  scene: "画面类型：写实影像，空间透视、尺度关系、光线和环境材质保持真实自然",
  prop: "画面类型：写实影像，道具比例、结构、光线和材质保持真实自然",
  shot: "画面类型：写实影像，人物五官、身体比例、光线和材质保持真实自然"
}, io = [
  "shot_images",
  "final_video",
  "shot_videos",
  "storyboard_only"
], q = {
  output_target: "shot_images",
  voice_mode: "auto",
  subtitle_mode: "auto",
  lip_sync_mode: "off",
  shot_visual_strategy: "auto"
};
function Ze(t, e) {
  return e > 0 && (t.match_previous || t.continue_previous);
}
const so = [
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
function ao(t) {
  return Y(t, /* @__PURE__ */ new Set(), 0);
}
function Ri(t, e) {
  if (!_(t) || !Array.isArray(t.materials))
    return null;
  const n = t.materials.map(an);
  if (n.some((s) => !s))
    return null;
  const r = n, o = new Set(
    r.map((s) => s.id)
  );
  if (o.size !== r.length)
    return null;
  const i = cn(t.shot, e, o);
  return i ? { shot: i, materials: r } : null;
}
function $i(t) {
  return Xe(t.shots);
}
function Xe(t) {
  return t.reduce(
    (e, n) => e + Math.max(0, Number(n.duration) || 0),
    0
  );
}
function co(t) {
  return Number.isInteger(t) && t >= Vt;
}
function Pi(t, e) {
  const n = new Map(
    t.materials.map((r) => [r.id, r])
  );
  return e.material_ids.map((r) => n.get(r)).filter((r) => !!r);
}
function Ei(t) {
  return {
    id: `shot-${t + 1}`,
    order: t + 1,
    duration: Vt,
    beat: "",
    transition: "",
    transition_type: "none",
    transition_duration_ms: 0,
    description: "",
    camera_instruction: "",
    video_prompt: "",
    material_ids: [],
    reference_keys: [],
    match_previous: !1,
    continue_previous: !1,
    continuity_anchor: "",
    continuity_state: { entry: "", exit: "" },
    speech: [],
    captions: []
  };
}
function Li(t, e) {
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
function zi(t, e) {
  const n = [], r = [];
  for (const o of t.shots) {
    o.material_ids.includes(e) && n.push(o.id);
    for (const i of o.speech)
      i.character_id === e && r.push(i.id);
  }
  return { shotIds: n, speechIds: r };
}
function ji(t, e = "dialogue") {
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
function Bi(t) {
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
function uo(t) {
  const e = un(t.workflow), n = Ut(t.references), r = new Set(n.map((s) => s.key)), o = new Set(
    t.materials.map((s) => s.id)
  ), i = t.shots.map((s, c) => {
    const d = c > 0 ? on(s.transition_type) : "none", m = Math.round(
      Number(s.transition_duration_ms)
    );
    return {
      ...s,
      id: s.id || `shot-${c + 1}`,
      order: c + 1,
      transition: c > 0 ? s.transition.trim() : "",
      transition_type: d,
      transition_duration_ms: d !== "none" ? Math.min(
        5e3,
        Math.max(
          100,
          Number.isFinite(m) ? m : 100
        )
      ) : 0,
      material_ids: Q(s.material_ids).filter(
        (l) => o.has(l)
      ),
      reference_keys: Q(s.reference_keys).filter(
        (l) => r.has(l)
      ),
      match_previous: c > 0 && !s.continue_previous && !!s.match_previous,
      continue_previous: c > 0 && !!s.continue_previous,
      continuity_anchor: c > 0 && s.continue_previous ? s.continuity_anchor.trim() : "",
      continuity_state: Qe(
        s.continuity_state
      )
    };
  });
  return i.forEach((s, c) => {
    Ze(s, c) && (s.continuity_state.entry = i[c - 1].continuity_state.exit);
  }), {
    ...t,
    version: Mt,
    workflow: e,
    production_plan: tn(
      t.production_plan
    ),
    target_duration: Xe(i),
    target_shot_count: i.length,
    narrator_voice: t.narrator_voice.trim(),
    aspect_ratio: rn(t.aspect_ratio),
    references: n,
    materials: t.materials.map((s) => ({
      ...s,
      voice: s.type === "character" ? s.voice.trim() : "",
      reference_keys: Q(s.reference_keys).filter(
        (c) => r.has(c)
      )
    })),
    shots: i
  };
}
function Qe(t) {
  const e = _(t) ? t : {};
  return {
    entry: k(e.entry).trim(),
    exit: k(e.exit).trim()
  };
}
function Fi(t, e) {
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
function Ui(t) {
  return t.workflow.status === "confirmed";
}
function tn(t) {
  if (!_(t))
    return { ...q };
  const e = k(t.output_target).toLowerCase();
  return {
    output_target: io.includes(
      e
    ) ? e : q.output_target,
    voice_mode: wt(
      t.voice_mode,
      q.voice_mode
    ),
    subtitle_mode: wt(
      t.subtitle_mode,
      q.subtitle_mode
    ),
    lip_sync_mode: wt(
      t.lip_sync_mode,
      q.lip_sync_mode
    ),
    shot_visual_strategy: "auto"
  };
}
function Vi(t) {
  return t.production_plan.output_target !== "storyboard_only";
}
function en(t) {
  return ["shot_videos", "final_video"].includes(
    t.production_plan.output_target
  );
}
function vi(t) {
  return t.production_plan.output_target === "final_video";
}
function lo(t) {
  return en(t) && t.production_plan.voice_mode === "auto" && fo(t) > 0;
}
function Gi(t) {
  return en(t) && t.production_plan.subtitle_mode === "auto" && mo(t) > 0;
}
function Ki(t) {
  return lo(t) && t.production_plan.lip_sync_mode === "auto" && t.shots.some(go);
}
function fo(t) {
  return t.shots.reduce(
    (e, n) => e + n.speech.filter(ln).length,
    0
  );
}
function mo(t) {
  return t.shots.reduce(
    (e, n) => e + po(n).length,
    0
  );
}
function po(t) {
  const e = t.speech.filter(
    (r) => r.subtitle_enabled && !!r.text.trim()
  ).map((r) => ({
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
function yo(t) {
  return t.kind === "narration" ? "旁白" : t.speaker_mode === "visible" ? "出镜对白" : "画外音";
}
function nn(t) {
  return t.kind === "dialogue" && t.speaker_mode === "visible" && !!t.text.trim();
}
function go(t) {
  return t.speech.some(nn);
}
function qi(t) {
  return new Set(
    t.speech.filter(nn).map((e) => e.character_id?.trim()).filter((e) => !!e)
  );
}
function Wi(t) {
  return `${t.title.trim() || "分镜脚本"} · ${t.shots.length} 个镜头`;
}
function Yi(t) {
  return t.summary.trim() || sn("", t.shots);
}
function Ji(t, e) {
  const n = t.style_prompt.trim(), r = { ...t, style_prompt: e };
  return !n || n === e.trim() ? r : {
    ...r,
    materials: t.materials.map((o) => ({
      ...o,
      prompt: ae(
        o.prompt,
        n
      )
    })),
    shots: t.shots.map((o) => ({
      ...o,
      video_prompt: ae(
        o.video_prompt,
        n
      )
    }))
  };
}
function Hi(t, e, n = "shot") {
  const r = t.visual_mode === "photoreal" ? oo[n] : "画面类型：非写实影像，保持统一造型语言，不得漂移为真人摄影";
  let o = ce(e.trim(), r);
  const i = t.style_prompt.trim();
  if (!i)
    return o;
  const s = `统一视觉风格：${i}`;
  return o = ce(o, s), o;
}
function ae(t, e) {
  const n = `统一视觉风格：${e}`, r = t.trimEnd().replace(/[。！？!?；;，,\s]+$/g, "");
  return r.endsWith(n) ? r.slice(0, -n.length).replace(/[。！？!?；;，,：:\s]+$/g, "").trimEnd() : t;
}
function ce(t, e) {
  if (!e || t.includes(e))
    return t;
  if (!t)
    return e;
  const n = /[。！？!?；;，,：:]$/.test(t) ? "" : "。";
  return `${t}${n}${e}`;
}
function rn(t) {
  const e = k(t);
  return no.includes(e) ? e : ro;
}
function on(t) {
  const e = k(t);
  return to.includes(e) ? e : "none";
}
function Zi(t) {
  const e = t.speech.filter(ln).map((r) => `${yo(r)}：${r.text.trim()}`).join("；");
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
function Y(t, e, n) {
  if (t == null || n > 10)
    return null;
  if (typeof t == "string") {
    for (const s of nt(t)) {
      const c = Y(s, e, n + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object" || e.has(t))
    return null;
  if (e.add(t), Array.isArray(t)) {
    for (const s of t) {
      const c = Y(s, e, n + 1);
      if (c)
        return c;
    }
    return null;
  }
  const r = t, o = ho(r);
  if (o)
    return o;
  const i = Ao(r);
  if (i) {
    const s = Y(i, e, n + 1);
    if (s)
      return s;
  }
  for (const s of so) {
    const c = r[s];
    if (c == null || c === t)
      continue;
    const d = Y(c, e, n + 1);
    if (d)
      return d;
  }
  return null;
}
function ho(t) {
  const e = k(t.visual_mode).toLowerCase(), n = _o(t.work_type);
  if (k(t.type).toLowerCase() !== "storyboard" || E(t.version) !== Mt || typeof t.title != "string" || typeof t.narrator_voice != "string" || typeof t.style_prompt != "string" || !So(e) || !n || !Array.isArray(t.references) || !Array.isArray(t.materials) || !Array.isArray(t.shots))
    return null;
  const r = bo(t.storyline);
  if (!r)
    return null;
  const o = Ut(t.references);
  if (o.length !== t.references.length)
    return null;
  const i = t.materials.map(an);
  if (i.some((p) => !p))
    return null;
  const s = i, c = /* @__PURE__ */ new Set();
  for (const p of s) {
    if (c.has(p.id))
      return null;
    c.add(p.id);
  }
  const d = /* @__PURE__ */ new Set(), m = t.shots.map(
    (p, w) => cn(p, w, c)
  );
  if (m.some((p) => !p))
    return null;
  const l = m;
  for (const [p, w] of l.entries()) {
    if (d.has(w.id) || Ze(w, p) && w.continuity_state.entry !== l[p - 1].continuity_state.exit)
      return null;
    d.add(w.id);
  }
  const u = E(t.target_duration), f = E(t.target_shot_count);
  if (u == null || !Number.isInteger(u) || u < Vt || f == null || !Number.isInteger(f) || f < 1 || f > Qr)
    return null;
  const g = un(t.workflow), b = sn(
    k(t.summary),
    l
  ), S = {
    ...t,
    type: "storyboard",
    version: Mt,
    work_type: n,
    workflow: g,
    production_plan: tn(t.production_plan),
    title: wo(t.title, b, l),
    summary: b,
    target_duration: u,
    target_shot_count: f,
    narrator_voice: t.narrator_voice.trim(),
    storyline: r,
    style_prompt: t.style_prompt,
    visual_mode: e,
    aspect_ratio: rn(t.aspect_ratio),
    references: o,
    materials: s,
    shots: l
  };
  return uo(S);
}
function _o(t) {
  const e = k(t).toLowerCase();
  return e ? Xr(e) ? e : null : "short";
}
function bo(t) {
  if (!_(t))
    return null;
  const e = k(t.setup), n = k(t.development), r = k(t.payoff);
  return { setup: e, development: n, payoff: r };
}
function sn(t, e) {
  const n = t.trim();
  if (n)
    return n;
  const r = e.map((o) => o.description.trim()).filter(Boolean);
  return r.length > 0 ? r.join("；") : "暂无内容简介";
}
function wo(t, e, n) {
  const r = t.trim();
  if (r && !se.has(r))
    return r;
  const o = [e, n[0]?.beat, n[0]?.description].map((s) => String(s || "").trim()).find((s) => s && !se.has(s));
  if (!o)
    return "分镜脚本";
  const i = o.split(/[\r\n。！？!?；;]/, 1)[0].trim();
  return Array.from(i).slice(0, 24).join("") || "分镜脚本";
}
function So(t) {
  return eo.includes(t);
}
function an(t) {
  if (!_(t))
    return null;
  const e = k(t.type).toLowerCase();
  return !Co(e) || typeof t.id != "string" || !t.id.trim() || typeof t.name != "string" || typeof t.prompt != "string" || typeof t.voice != "string" || !Array.isArray(t.reference_keys) ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    name: t.name.trim().replace(/^[@#]+/, ""),
    prompt: t.prompt.trim(),
    voice: e === "character" ? t.voice.trim() : "",
    reference_keys: Q(t.reference_keys.map(k))
  };
}
function cn(t, e, n) {
  if (!_(t) || typeof t.id != "string" || !t.id.trim() || typeof t.beat != "string" || !t.beat.trim() || typeof t.transition != "string" || typeof t.transition_type != "string" || typeof t.match_previous != "boolean" || typeof t.description != "string" || typeof t.camera_instruction != "string" || typeof t.video_prompt != "string" || typeof t.continue_previous != "boolean" || typeof t.continuity_anchor != "string" || !_(t.continuity_state) || !Array.isArray(t.material_ids) || !Array.isArray(t.reference_keys) || !Array.isArray(t.speech) || !Array.isArray(t.captions))
    return null;
  const r = E(t.duration);
  if (r == null || !co(r))
    return null;
  const o = t.material_ids.map(k);
  if (o.some((b) => !b || !n.has(b)) || new Set(o).size !== o.length)
    return null;
  const i = t.speech.map(ko);
  if (i.some((b) => !b))
    return null;
  const s = t.captions.map(xo);
  if (s.some(
    (b) => !b || b.end_time > r
  ))
    return null;
  const c = e > 0 && t.continue_previous;
  if (e === 0 && (t.match_previous || t.continue_previous) || t.match_previous && t.continue_previous)
    return null;
  const d = e > 0 && !c && t.match_previous, m = t.transition.trim();
  if (e > 0 && !m)
    return null;
  const l = t.continuity_anchor.trim();
  if (c && !l)
    return null;
  const u = Qe(
    t.continuity_state
  );
  if (!u.entry || !u.exit)
    return null;
  const f = on(
    t.transition_type
  ), g = E(t.transition_duration_ms);
  return f !== t.transition_type || g == null || !Number.isInteger(g) || g < 0 || g > 5e3 || e === 0 && (f !== "none" || g !== 0) || e > 0 && f === "none" && g !== 0 || e > 0 && f !== "none" && g < 100 ? null : {
    ...t,
    id: t.id.trim(),
    order: e + 1,
    duration: r,
    beat: t.beat.trim(),
    transition: e > 0 ? m : "",
    transition_type: e > 0 ? f : "none",
    transition_duration_ms: e > 0 && f !== "none" ? g : 0,
    description: t.description,
    camera_instruction: t.camera_instruction,
    video_prompt: t.video_prompt,
    material_ids: o,
    reference_keys: Q(t.reference_keys.map(k)),
    match_previous: d,
    continue_previous: c,
    continuity_anchor: c ? l : "",
    continuity_state: u,
    speech: i,
    captions: s
  };
}
function ko(t) {
  if (!_(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string" || typeof t.subtitle_enabled != "boolean" || typeof t.subtitle_text != "string")
    return null;
  const e = k(t.kind).toLowerCase(), n = E(t.start_time);
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
  const r = k(t.speaker_mode).toLowerCase();
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
function xo(t) {
  if (!_(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string")
    return null;
  const e = k(t.type).toLowerCase(), n = E(t.start_time), r = E(t.end_time);
  return !Io(e) || n == null || r == null || n < 0 || r <= n ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    text: t.text,
    start_time: n,
    end_time: r
  };
}
function un(t) {
  const e = _(t) ? t : {}, n = k(e.status).toLowerCase() === "confirmed" ? "confirmed" : "draft";
  return {
    status: n,
    confirmed_at: n === "confirmed" ? k(e.confirmed_at) : ""
  };
}
function wt(t, e) {
  const n = k(t).toLowerCase();
  return n === "auto" || n === "off" ? n : e;
}
function Ao(t) {
  const e = mr(t);
  if (e)
    return e;
  if (!_(t))
    return "";
  const n = t.type === "doc" ? t : _(t.rich) && t.rich.type === "doc" ? t.rich : null;
  return n ? dn(n).trim() : "";
}
function dn(t) {
  if (!_(t))
    return "";
  if (t.type === "text")
    return k(t.text);
  if (t.type === "hardBreak")
    return `
`;
  if (!Array.isArray(t.content))
    return "";
  const e = t.type === "doc" || t.type === "paragraph" || t.type === "codeBlock" ? `
` : "";
  return t.content.map(dn).join(e);
}
function Co(t) {
  return t === "character" || t === "scene" || t === "prop";
}
function Io(t) {
  return t === "caption" || t === "title" || t === "highlight";
}
function ln(t) {
  return t.text.trim().length > 0;
}
function Q(t) {
  return [...new Set(t.map((e) => e.trim()).filter(Boolean))];
}
function E(t) {
  const e = typeof t == "number" ? t : Number.NaN;
  return Number.isFinite(e) ? e : null;
}
const No = Mn(
  () => import("./space-storyboard-view-Bh_FCY7Y.js").then((t) => ({
    default: t.StoryboardView
  }))
);
function Xi({
  output: t,
  fallback: e = "",
  streaming: n = !1,
  emptyText: r = "暂无内容",
  className: o,
  markdownClassName: i,
  richClassName: s,
  mediaLayout: c = "default",
  mediaGridKind: d,
  storyboardEditable: m = !1,
  storyboardDisabled: l = !1,
  onStoryboardSave: u
}) {
  const f = Ge(t, e), g = ao(f), b = Te(f);
  if (b)
    return /* @__PURE__ */ a(ct, { className: o, children: /* @__PURE__ */ a(We, { grid: b }) });
  if (g)
    return /* @__PURE__ */ a(ct, { className: o, children: /* @__PURE__ */ a(On, { fallback: /* @__PURE__ */ a("div", { className: "min-h-24", "aria-busy": "true" }), children: /* @__PURE__ */ a(
      No,
      {
        storyboard: g,
        editable: m,
        disabled: l,
        onSave: u
      }
    ) }) });
  const S = Do(f, d);
  return S ? /* @__PURE__ */ a(
    ct,
    {
      className: [o, "ws-media-grid-content"].filter(Boolean).join(" "),
      children: /* @__PURE__ */ a(
        Kr,
        {
          kind: S.kind,
          items: S.items,
          label: e
        }
      )
    }
  ) : /* @__PURE__ */ a(
    Mr,
    {
      output: f,
      fallback: e,
      streaming: n,
      emptyText: r,
      className: o,
      markdownClassName: i,
      richClassName: s,
      mediaLayout: c
    }
  );
}
function Qi(t, e) {
  if (Mo(t, e))
    return !1;
  const n = Oe(t), r = Le(t);
  return r.length > 1 || n > 1 ? !0 : r.some((o) => !o || typeof o != "object" || Array.isArray(o) ? F(o) : [
    o.title,
    o.text,
    o.reasoning,
    o.rich,
    o.progress,
    o.error,
    o.json
  ].some(F));
}
function Do(t, e) {
  if (!e)
    return null;
  const n = gr(t, e);
  return n.length > 1 ? { kind: e, items: n } : null;
}
function ts(t) {
  if (t?.videoUrl)
    return "video";
  if (t?.imageUrl)
    return "image";
  if (t?.audioUrl)
    return "audio";
}
function Mo(t, e) {
  const n = Ot(t, /* @__PURE__ */ new Set(), 0);
  return !n || !e ? !1 : [
    e.imageUrl,
    e.videoUrl,
    e.audioUrl,
    e.fileUrl
  ].some((r) => String(r || "").trim() === n);
}
function Ot(t, e, n) {
  if (t == null || n > 12)
    return "";
  if (typeof t == "string")
    return t.trim();
  if (Array.isArray(t))
    return t.length === 1 ? Ot(t[0], e, n + 1) : "";
  if (typeof t != "object" || e.has(t))
    return "";
  e.add(t);
  const o = Object.entries(t).filter(
    ([i, s]) => !["type", "kind", "format", "version"].includes(i) && F(s)
  ).map(([, i]) => i);
  return o.length === 1 ? Ot(o[0], e, n + 1) : "";
}
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/lib/upload"]);
const pt = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!pt || Object.keys(pt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Oo = pt.joinSiteApi, To = pt.request, Tt = window.DeverFront?.sdk?.getCompatModule("@/lib/upload");
if (!Tt || Object.keys(Tt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/upload");
const Ro = "bot_work", $o = "神创工作台", Po = /* @__PURE__ */ new Set([
  "txt",
  "md",
  "markdown",
  "mdown",
  "mkd"
]), { uploadFileByRule: ue } = Tt;
async function es(t) {
  if (!ue)
    throw new Error("当前页面缺少上传能力");
  const e = [];
  for (const n of t.files) {
    const r = zo(t.kind) || Lo(n), o = Number(t.ruleID || 0) || jo(r), i = r === "text" ? await n.text() : void 0, s = await ue(o, n, {
      kind: r,
      bizKey: Ro,
      bizName: $o,
      reportError: !1
    }), c = Number(s.id || 0), [d] = await Eo({
      teamID: t.teamID,
      projectID: t.projectID,
      files: [s],
      textContents: i === void 0 ? void 0 : /* @__PURE__ */ new Map([[c, i]])
    });
    if (!d)
      throw new Error(`${n.name} 保存到资产库失败`);
    e.push({ sourceFile: n, uploadedFile: s, asset: d });
  }
  return e;
}
async function Eo(t) {
  const e = [], n = /* @__PURE__ */ new Set();
  for (const r of t.files) {
    const o = Number(r.id || 0);
    if (!Number.isFinite(o) || o <= 0)
      throw new Error("上传文件标识无效");
    if (n.has(o))
      continue;
    const i = await To(
      Oo("workbench/upload_save_asset"),
      "post",
      {
        team_id: t.teamID,
        project_id: t.projectID || void 0,
        file_id: o,
        text_content: t.textContents?.get(o)
      },
      { reportError: !1 }
    );
    if (!mn(i))
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
function Lo(t) {
  const e = String(t.type || "").toLowerCase();
  return e.startsWith("image/") ? "image" : e.startsWith("video/") ? "video" : e.startsWith("audio/") ? "audio" : ["text/plain", "text/markdown", "text/x-markdown"].includes(e) || Po.has(Bo(t.name)) ? "text" : "file";
}
function zo(t) {
  const e = String(t || "").toLowerCase();
  return ["image", "video", "audio", "text", "file"].includes(e) ? e : "";
}
function jo(t) {
  return t === "image" ? 1 : t === "video" ? 2 : t === "audio" ? 3 : 7;
}
function Bo(t) {
  const e = String(t || "").trim().toLowerCase(), n = e.lastIndexOf(".");
  return n >= 0 ? e.slice(n + 1) : "";
}
export {
  Fi as $,
  xi as A,
  Qt as B,
  Xi as C,
  $r as D,
  Je as E,
  co as F,
  Ze as G,
  to as H,
  Ki as I,
  Gi as J,
  lo as K,
  en as L,
  Qr as M,
  Vi as N,
  qi as O,
  mo as P,
  tn as Q,
  vi as R,
  Ti as S,
  Ye as T,
  Jr as U,
  zi as V,
  Yi as W,
  eo as X,
  Oi as Y,
  no as Z,
  uo as _,
  fo as a,
  Wo as a$,
  Li as a0,
  Vt as a1,
  Mi as a2,
  ji as a3,
  Bi as a4,
  Ei as a5,
  Ji as a6,
  ii as a7,
  si as a8,
  zt as a9,
  Wn as aA,
  Do as aB,
  Ci as aC,
  ci as aD,
  yi as aE,
  fr as aF,
  Fn as aG,
  _e as aH,
  ki as aI,
  bi as aJ,
  Xt as aK,
  hi as aL,
  Mr as aM,
  Cr as aN,
  wi as aO,
  ei as aP,
  Xo as aQ,
  Yo as aR,
  Si as aS,
  ni as aT,
  Zo as aU,
  Ho as aV,
  Jo as aW,
  Ln as aX,
  jn as aY,
  zn as aZ,
  qo as a_,
  Ut as aa,
  ui as ab,
  _ as ac,
  ri as ad,
  li as ae,
  ai as af,
  Ri as ag,
  mr as ah,
  Et as ai,
  P as aj,
  es as ak,
  nn as al,
  Hi as am,
  Zi as an,
  k as ao,
  Qi as ap,
  ts as aq,
  zr as ar,
  oe as as,
  er as at,
  Te as au,
  _i as av,
  di as aw,
  Bn as ax,
  mi as ay,
  fi as az,
  gi as b,
  ti as b0,
  Qo as b1,
  hr as b2,
  oi as b3,
  Ft as b4,
  Ar as b5,
  Le as b6,
  Wi as b7,
  Me as b8,
  pr as b9,
  we as ba,
  gr as c,
  pi as d,
  yo as e,
  po as f,
  go as g,
  Pi as h,
  Ui as i,
  Eo as j,
  $o as k,
  Ro as l,
  We as m,
  Pr as n,
  Ai as o,
  ao as p,
  yr as q,
  Rr as r,
  $i as s,
  F as t,
  et as u,
  Xr as v,
  Ni as w,
  Di as x,
  Ii as y,
  Xe as z
};
