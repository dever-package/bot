import { s as D, h as ht, a as L, d as N, r as A, j as ye, l as wn } from "./site-config-C63CM9jT.js";
import { b as ge, d as Sn } from "./file-kind-UfTAlHnR.js";
import { r as kn, R as xn, V as An, a as Cn } from "./media-inspector-gallery-ho9rlZcO.js";
import { j as a, a as g, F as he } from "./preloadable-Bomi5PEU.js";
import { b as Nn, L as v, c as _e, o as be, X as In, ab as Mn, j as Dn, aC as On, G as Tn, d as Rn, a3 as En, a5 as H, O as Pn } from "./vendor-icons-B3DKX3la.js";
import { a as M, d as we, b as j, u as $n, l as zn, S as Ln } from "./_commonjsHelpers-61wyk6v6.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./upload-asset-api-BKKxOhDW.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const lt = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!lt || Object.keys(lt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const O = lt.joinSiteApi, T = lt.request, jn = ge(), Bn = ge();
function so(t, e, n = "") {
  const r = JSON.stringify({
    requestScopeKey: n,
    teamID: t,
    catalogOptions: e || null
  });
  return jn(r, async () => {
    const i = T(
      O("workbench/asset_filters"),
      "get",
      {
        team_id: t,
        request_scope: n || void 0
      }
    ), [o, s] = e ? [null, await i] : await Promise.all([
      T(O("workbench/catalog"), "get", {
        team_id: t,
        request_scope: n || void 0
      }),
      i
    ]), c = e ? {
      powers: e.tools,
      roles: e.dialogues,
      asset_cates: e.assetCates
    } : D(o, "加载团队资产配置失败"), f = D(s, "加载资产筛选项失败");
    return {
      projects: L(f.projects).map(Lt).filter(tt),
      tools: Zt(c.powers, f.tools),
      dialogues: Zt(c.roles, f.dialogues),
      assetCates: L(c.asset_cates).map(Vn).filter(tt)
    };
  });
}
function ao(t) {
  const e = {
    ...t,
    pageSize: t.pageSize || 24,
    view: t.view || "assets",
    contentMode: t.contentMode || "preview"
  };
  return Bn(JSON.stringify(e), async () => {
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
    }), r = D(n, "加载资产失败");
    return {
      items: L(r.items).map(et).filter(tt),
      page: N(r.page, e.page),
      pageSize: N(r.page_size, e.pageSize),
      total: ht(r.total),
      hasMore: !!r.has_more
    };
  });
}
async function co(t, e) {
  const n = await T(O("workbench/asset_detail"), "get", {
    team_id: t,
    asset_id: e
  });
  return Fn(D(n, "加载资产详情失败"));
}
async function uo(t) {
  const e = await T(O("workbench/asset_versions"), "get", {
    team_id: t.teamID,
    asset_id: t.assetID,
    page: t.page,
    page_size: t.pageSize || 20
  }), n = D(e, "加载资产版本失败");
  return {
    items: L(n.items).map(_t).filter(tt),
    total: ht(n.total),
    hasMore: !!n.has_more
  };
}
async function lo(t) {
  const e = await T(O("workbench/asset_version"), "get", {
    team_id: t.teamID,
    asset_id: t.assetID,
    version_id: t.versionID
  }), n = D(e, "加载资产版本失败");
  return _t(n.version);
}
async function fo(t) {
  const e = await T(
    O("workbench/asset_set_current"),
    "post",
    {
      team_id: t.teamID,
      asset_id: t.assetID,
      version_id: t.versionID
    }
  ), n = D(e, "设置当前版本失败");
  return et(n.asset);
}
async function mo(t) {
  const e = await T(O("workbench/asset_rename"), "post", {
    team_id: t.teamID,
    asset_id: t.assetID,
    name: t.name
  }), n = D(e, "修改资产标题失败");
  return et(n.asset);
}
async function po(t) {
  const e = await T(O("workbench/asset_delete"), "post", {
    team_id: t.teamID,
    asset_id: t.assetID
  });
  D(e, "删除资产失败");
}
async function yo(t) {
  const e = await T(O("workbench/asset_restore"), "post", {
    team_id: t.teamID,
    asset_id: t.assetID
  }), n = D(e, "恢复资产失败");
  return et(n.asset);
}
function Fn(t) {
  return {
    asset: et(t.asset),
    versions: L(t.versions).map(_t).filter(tt),
    versionTotal: ht(t.version_total),
    hasMore: !!t.has_more
  };
}
function et(t) {
  const e = ye(t?.version) ? _t(t.version) : null;
  return {
    id: N(t?.id),
    projectID: N(t?.project_id),
    bodyID: N(t?.body_id),
    teamID: N(t?.team_id),
    flowID: N(t?.flow_id),
    assetCateID: N(t?.asset_cate_id),
    collectionID: N(t?.collection_id),
    nodeKey: A(t?.node_key),
    sourceType: A(t?.source_type),
    sourceID: N(t?.source_id),
    sourceName: A(t?.source_name),
    name: A(t?.name) || "未命名资产",
    nameMode: A(t?.name_mode) === "manual" ? "manual" : "auto",
    kind: A(t?.kind) || "text",
    role: A(t?.role) || "material",
    versionID: N(t?.version_id),
    status: A(t?.status),
    summary: A(t?.summary || e?.summary),
    collectionCount: ht(t?.collection_count),
    collectionPreviews: L(t?.collection_previews).map(Un).filter((n) => !!n),
    createdAt: A(t?.created_at),
    deletedAt: A(t?.deleted_at),
    version: e
  };
}
function Un(t) {
  const e = A(t?.kind);
  return e !== "image" && e !== "video" || !t?.content ? null : {
    id: N(t?.id),
    kind: e,
    content: t.content
  };
}
function _t(t) {
  return {
    id: N(t?.id),
    assetID: N(t?.asset_id),
    runID: N(t?.run_id),
    nodeRunID: N(t?.node_run_id),
    releaseID: N(t?.release_id),
    requestID: A(t?.request_id),
    nodeKey: A(t?.node_key),
    source: ye(t?.source) ? t.source : {},
    version: N(t?.version, 1),
    content: t?.content,
    summary: A(t?.summary),
    createdAt: A(t?.created_at),
    updatedAt: A(t?.updated_at || t?.created_at)
  };
}
function Lt(t) {
  return {
    id: N(t?.id),
    name: A(t?.name) || "未命名"
  };
}
function Zt(...t) {
  const e = [], n = /* @__PURE__ */ new Set();
  for (const r of t)
    for (const i of L(r)) {
      const o = Lt(i);
      o.id <= 0 || n.has(o.id) || (n.add(o.id), e.push(o));
    }
  return e;
}
function Vn(t) {
  return {
    ...Lt(t),
    kind: A(t?.kind) || "text",
    cardinality: A(t?.cardinality) || "single"
  };
}
function tt(t) {
  return t.id > 0;
}
const Gn = [
  { key: "project", label: "创作" },
  { key: "tool", label: "工具" },
  { key: "dialogue", label: "对话" },
  { key: "upload", label: "上传" }
], Kn = [
  { key: "work", label: "作品" },
  { key: "material", label: "素材" }
], Wn = [
  { key: "collection", label: "集合" },
  { key: "text", label: "文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "richtext", label: "富文本" },
  { key: "file", label: "文件" }
];
function go(t, e = {}) {
  const n = e.fallback || "资产", r = jt(Gn, t, n);
  return e[t] || r;
}
function ho(t) {
  return jt(Kn, t, "素材");
}
function _o(t) {
  return jt(Wn, t, "资产");
}
function bo(t) {
  if (t.length === 0 || t.some((r) => ["text", "richtext", "file"].includes(r)))
    return;
  const e = {
    image: "image/*",
    audio: "audio/*",
    video: "video/*"
  }, n = t.map((r) => e[r]).filter((r) => !!r);
  return n.length > 0 ? Array.from(new Set(n)).join(",") : void 0;
}
function jt(t, e, n) {
  return t.find((r) => r.key === e)?.label || n;
}
function qn(t) {
  if (typeof t != "string")
    return t;
  const e = t.trim();
  if (!Bt(e))
    return t;
  try {
    return JSON.parse(e);
  } catch {
    return t;
  }
}
function b(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function wo(t) {
  return b(t) ? t : {};
}
function k(t) {
  return typeof t == "string" ? t.trim() : "";
}
function So(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) ? e : 0;
}
function ko(t) {
  if (t == null || t === "")
    return;
  const e = Number(t);
  return Number.isFinite(e) ? e : void 0;
}
function Se(t) {
  const e = String(t || "").trim(), n = Yn(e), r = Xn(n);
  for (const i of xe([e, n, r])) {
    const o = qn(i);
    if (o !== i)
      return o;
    const s = Jn(i);
    if (s !== i)
      return s;
  }
  return t;
}
function xo(t) {
  const e = String(t || "").trim();
  for (const n of ke(e)) {
    const r = Se(n);
    if (r !== n)
      return r;
  }
  return t;
}
function nt(t) {
  const e = [];
  for (const n of ke(
    String(t || "").trim()
  )) {
    const r = Se(n);
    r !== n && e.push(r);
  }
  return e;
}
function Yn(t) {
  let e = "", n = !1, r = !1;
  for (const i of t) {
    if (r) {
      e += i, r = !1;
      continue;
    }
    if (i === "\\") {
      e += i, r = n;
      continue;
    }
    if (i === '"') {
      n = !n, e += i;
      continue;
    }
    if (n && i.charCodeAt(0) < 32) {
      e += Zn(i);
      continue;
    }
    e += i;
  }
  return e;
}
function ke(t) {
  const e = [t];
  for (const n of t.matchAll(/```(?:json|storyboard)?\s*([\s\S]*?)```/gi))
    e.push(String(n[1] || "").trim());
  return e.push(...vn(t)), xe(e);
}
function vn(t) {
  const e = [];
  for (let n = 0; n < t.length; n += 1) {
    const r = t[n];
    if (r !== "{" && r !== "[")
      continue;
    const i = Hn(t, n);
    i && (e.push(i), n += i.length - 1);
  }
  return e;
}
function Hn(t, e) {
  const n = [];
  let r = !1, i = !1;
  for (let o = e; o < t.length; o += 1) {
    const s = t[o];
    if (i) {
      i = !1;
      continue;
    }
    if (r && s === "\\") {
      i = !0;
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
      return t.slice(e, o + 1).trim();
  }
  return "";
}
function Bt(t) {
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function Jn(t) {
  if (!t.startsWith('"') || !t.endsWith('"'))
    return t;
  try {
    const e = JSON.parse(t);
    return typeof e == "string" ? e : t;
  } catch {
    return t;
  }
}
function Zn(t) {
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
function Xn(t) {
  const e = t.trim();
  return !e.includes('\\"') || !e.startsWith("{") && !e.startsWith("[") ? t : e.replace(/\\"/g, '"');
}
function xe(t) {
  const e = /* @__PURE__ */ new Set();
  return t.filter((n) => {
    const r = String(n || "").trim();
    return !r || e.has(r) ? !1 : (e.add(r), !0);
  });
}
function Ao(...t) {
  return t.find(
    (e) => e != null
  );
}
function Co(t) {
  try {
    return JSON.stringify(t);
  } catch {
    return "";
  }
}
const Qn = {
  audio: "editorMediaAudio",
  image: "editorMediaImage",
  mediaAudio: "editorMediaAudio",
  mediaImage: "editorMediaImage",
  mediaVideo: "editorMediaVideo",
  video: "editorMediaVideo"
}, Ae = [
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
function No(t) {
  const e = Ce(t);
  return e.length > 120 ? `${e.slice(0, 120)}...` : e;
}
function Ce(t) {
  return rt(t).replace(/\s+/g, " ").trim();
}
function tr(t) {
  if (typeof t != "string")
    return "";
  const e = t.trim();
  if (!ir(e))
    return "";
  const n = e.search(/"rich"\s*:/), r = n >= 0 ? e.slice(n) : e, i = [], o = /"text"\s*:\s*"((?:\\.|[^"\\])*)"/g;
  let s = null;
  for (; (s = o.exec(r)) !== null; ) {
    const c = or(s[1]).trim();
    c && i.push(c);
  }
  return i.join(" ").replace(/\s+/g, " ").trim();
}
function Ft(t) {
  const e = q(t, /* @__PURE__ */ new Set());
  return Ut(e) ? e : null;
}
function Io(t) {
  try {
    return Ce(t);
  } catch {
    return "";
  }
}
function Mo(t) {
  try {
    return Ft(t);
  } catch {
    return null;
  }
}
function rt(t) {
  if (typeof t == "string") {
    const r = t.trim();
    if (Bt(r)) {
      const i = De(r);
      if (i !== void 0)
        return rt(i).trim();
    }
    return tr(r) || t;
  }
  if (Array.isArray(t))
    return t.map(rt).filter(Boolean).join(" ");
  if (!b(t))
    return "";
  const e = Ft(t);
  if (e)
    return Me(e);
  const n = [
    typeof t.text == "string" ? t.text : "",
    typeof t.markdown == "string" ? t.markdown : ""
  ];
  for (const r of Ae)
    t[r] != null && n.push(rt(t[r]));
  return n.filter(Boolean).join(" ");
}
function q(t, e) {
  if (typeof t == "string") {
    const r = t.trim();
    if (!Bt(r))
      return null;
    const i = De(r);
    return i === void 0 ? null : q(i, e);
  }
  if (Array.isArray(t)) {
    const r = Xt({ type: "doc", content: t });
    if (Ut(r))
      return r;
    for (const i of t) {
      const o = q(i, e);
      if (o)
        return o;
    }
    return null;
  }
  if (!b(t) || e.has(t))
    return null;
  e.add(t);
  const n = Xt(t);
  if (n)
    return n;
  if (String(t.format || "").toLowerCase() === "rich_json" && t.rich != null) {
    const r = q(t.rich, e);
    if (r)
      return r;
  }
  for (const r of Ae) {
    if (t[r] == null)
      continue;
    const i = q(t[r], e);
    if (i)
      return i;
  }
  return null;
}
function Xt(t) {
  return !b(t) || Ie(t.type) !== "doc" ? null : {
    type: "doc",
    attrs: b(t.attrs) ? t.attrs : void 0,
    content: Ne(t.content)
  };
}
function Ne(t) {
  return Array.isArray(t) ? t.map(er).filter((e) => !!e) : [];
}
function er(t) {
  if (!b(t))
    return null;
  const e = Ie(t.type) || nr(t);
  if (!e)
    return null;
  const n = { type: e }, r = b(t.attrs) ? { ...t.attrs } : {};
  if (e === "heading" && ft(r.level) <= 0) {
    const s = ft(t.level);
    s > 0 && (r.level = s);
  }
  Object.keys(r).length > 0 && (n.attrs = r);
  const i = rr(t.marks);
  if (i.length > 0 && (n.marks = i), e === "text") {
    const s = B(t.text);
    return s ? (n.text = s, n) : null;
  }
  const o = Ne(t.content);
  return o.length > 0 && (n.content = o), n;
}
function nr(t) {
  if (typeof t.text == "string")
    return "text";
  const e = b(t.attrs) ? t.attrs : {};
  return ft(e.level) > 0 || ft(t.level) > 0 ? "heading" : "";
}
function rr(t) {
  return Array.isArray(t) ? t.map((e) => {
    if (!b(e))
      return null;
    const n = B(e.type);
    return n ? {
      type: n,
      attrs: b(e.attrs) ? e.attrs : void 0
    } : null;
  }).filter(
    (e) => !!e
  ) : [];
}
function Ie(t) {
  const e = B(t);
  return Qn[e] || e;
}
function Me(t) {
  return t ? t.type === "text" ? t.text || "" : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? B(t.attrs?.alt || t.attrs?.title || t.attrs?.src) : (t.content || []).map(Me).filter(Boolean).join(" ") : "";
}
function Ut(t) {
  return t ? t.type === "text" ? !!B(t.text) : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? !!B(t.attrs?.src) : (t.content || []).some(Ut) : !1;
}
function De(t) {
  try {
    return JSON.parse(t);
  } catch {
    return;
  }
}
function ir(t) {
  return t.includes("rich_json") || t.includes('"rich"') || t.includes("agent_run_id") || t.includes("node_run_id");
}
function or(t) {
  try {
    return JSON.parse(`"${t}"`);
  } catch {
    return t.replace(/\\"/g, '"').replace(/\\n/g, `
`).replace(/\\t/g, "	").replace(/\\\\/g, "\\");
  }
}
function ft(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) ? e : 0;
}
function B(t) {
  return t == null ? "" : String(t).trim();
}
const mt = [
  { value: "auto", label: "自动", columns: 0, rows: 0, capacity: 9 },
  { value: "2x2", label: "2×2", columns: 2, rows: 2, capacity: 4 },
  { value: "3x2", label: "3×2", columns: 3, rows: 2, capacity: 6 },
  { value: "3x3", label: "3×3", columns: 3, rows: 3, capacity: 9 }
], sr = new Set(
  mt.map((t) => t.value)
);
function Vt(t) {
  const e = String(t || "").trim().toLowerCase();
  return sr.has(e) ? e : "auto";
}
function Oe(t) {
  const e = Vt(t);
  return mt.find((n) => n.value === e) || mt[0];
}
function ar(t, e) {
  const n = Oe(t), r = Math.max(0, Math.trunc(Number(e) || 0));
  return n.value !== "auto" ? n : r === 0 || r > 6 ? { columns: 3, rows: 3, capacity: 9 } : r > 4 ? { columns: 3, rows: 2, capacity: 6 } : r > 2 ? { columns: 2, rows: 2, capacity: 4 } : { columns: 2, rows: 1, capacity: 2 };
}
const cr = 50, ur = {
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
}, dr = [
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
function Gt(t) {
  return Object.fromEntries(
    t.map((e) => [e, /* @__PURE__ */ new Map()])
  );
}
function pt(t, e, n = {}) {
  const r = {
    media: t,
    enabledKinds: Object.keys(t),
    seen: n.seen || /* @__PURE__ */ new Set(),
    requestedKind: n.kind
  };
  E(e, r, 0, n.kind);
}
function lr(t, e) {
  const r = Gt(e === "audio" ? ["audio", "image"] : [e]);
  return pt(r, t, { kind: e }), Te(r), Array.from(r[e].values());
}
function Te(t) {
  const e = t.audio, n = t.image;
  if (!e || !n || e.size === 0 || e.size !== n.size)
    return;
  const r = Array.from(n.values());
  Array.from(e.values()).forEach((i, o) => {
    if (i.thumbnail)
      return;
    const s = Re(
      "audio",
      i.url,
      r[o]?.url || ""
    );
    s && e.set(i.url, { ...i, thumbnail: s });
  });
}
function E(t, e, n, r, i = "") {
  if (t == null || n > 12)
    return;
  if (Array.isArray(t)) {
    const l = t.length > 1 ? "" : i;
    t.forEach(
      (u) => E(
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
        (m) => E(
          m,
          e,
          n + 1,
          r,
          i
        )
      );
      return;
    }
    const u = r || e.requestedKind || yr(t);
    u && e.media[u] && Ee(t) && fr(
      e.media,
      u,
      t.trim(),
      i
    );
    return;
  }
  if (typeof t != "object" || e.seen.has(t))
    return;
  e.seen.add(t);
  const o = t, s = b(o.attrs) ? o.attrs : void 0, c = pr(
    o.type,
    o.kind,
    o.media_type,
    o.mediaType,
    o.mime
  ), f = mr(
    o,
    s,
    i
  ), d = r || e.requestedKind;
  if (d && e.media[d] && (!c || c === d))
    for (const l of Qt(o, d))
      E(
        l,
        e,
        n + 1,
        d,
        f
      );
  for (const l of e.enabledKinds) {
    const u = ur[l];
    for (const m of u.direct)
      E(
        o[m],
        e,
        n + 1,
        l,
        f
      );
    for (const m of u.collections)
      E(
        o[m],
        e,
        n + 1,
        l,
        f
      );
  }
  if (c && e.media[c]) {
    for (const l of Qt(o, c))
      E(
        l,
        e,
        n + 1,
        c,
        f
      );
    E(
      o.attrs,
      e,
      n + 1,
      c,
      f
    );
  }
  for (const l of dr)
    E(
      o[l],
      e,
      n + 1
    );
}
function Qt(t, e) {
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
function fr(t, e, n, r) {
  const i = t[e];
  if (!i)
    return;
  const o = Re(
    e,
    n,
    r
  ), s = i.get(n);
  if (s?.thumbnail || !o) {
    s || i.set(n, { url: n });
    return;
  }
  i.set(n, { url: n, thumbnail: o });
}
function Re(t, e, n) {
  const r = n.trim();
  return !r || t !== "image" && r === e.trim() ? "" : r;
}
function mr(t, e, n) {
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
    if (typeof r == "string" && Ee(r))
      return r.trim();
  return "";
}
function pr(...t) {
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
function yr(t) {
  const e = t.trim();
  if (/^data:image\//i.test(e) || /\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i.test(e))
    return "image";
  if (/^data:video\//i.test(e) || /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(e))
    return "video";
  if (/^data:audio\//i.test(e) || /\.(mp3|wav|ogg|m4a|aac)(?:[?#].*)?$/i.test(e))
    return "audio";
}
function Ee(t) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(t.trim());
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const At = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!At || Object.keys(At).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const Kt = ["image", "video", "audio"], gr = 64, hr = 128 * 1024, yt = /* @__PURE__ */ Symbol("content-output-cache-miss"), te = je(), ee = je(), _r = At, br = _r.normalizeEnergonOutput;
function P(...t) {
  for (const e of t)
    if (typeof e == "string" && e.trim())
      return e.trim();
  return "";
}
function Do(t) {
  const e = J(
    t,
    ["lyrics", "lyric", "lrc", "song_lyrics", "songLyrics"],
    /* @__PURE__ */ new Set(),
    0
  );
  if (e)
    return { label: "歌词", text: e };
  const n = J(
    t,
    ["text"],
    /* @__PURE__ */ new Set(),
    0
  );
  return n ? { label: "创作内容", text: n } : null;
}
function J(t, e, n, r) {
  if (t == null || r > 12)
    return "";
  if (typeof t == "string") {
    for (const i of nt(t)) {
      const o = J(i, e, n, r + 1);
      if (o)
        return o;
    }
    return "";
  }
  if (Array.isArray(t)) {
    for (const i of t) {
      const o = J(i, e, n, r + 1);
      if (o)
        return o;
    }
    return "";
  }
  if (!b(t) || n.has(t))
    return "";
  n.add(t);
  for (const i of e) {
    const o = it(t[i], r + 1);
    if (o)
      return o;
  }
  for (const i of [
    "output",
    "result",
    "data",
    "body",
    "value",
    "json",
    "rich",
    "content"
  ]) {
    const o = J(t[i], e, n, r + 1);
    if (o)
      return o;
  }
  return "";
}
function it(t, e) {
  if (t == null || e > 12)
    return "";
  if (typeof t == "string") {
    const n = t.trim();
    if (!n || /^(https?:\/\/|\/|data:|blob:)/i.test(n))
      return "";
    const r = nt(n);
    return r.length > 0 ? r.map((i) => it(i, e + 1)).filter(Boolean).join(`
`) : n;
  }
  if (Array.isArray(t))
    return t.map((n) => it(n, e + 1)).filter(Boolean).join(`
`);
  if (!b(t))
    return "";
  for (const n of ["text", "content", "line", "lines", "value"]) {
    const r = it(t[n], e + 1);
    if (r)
      return r;
  }
  return "";
}
function wr(t) {
  const e = Pe(t);
  return !e || e.hasMedia ? "" : e.markdown;
}
function Pe(t) {
  const e = Ir(t);
  return !e || !Ge(e) ? null : {
    markdown: e.content.map(Ke).join(`

`).trim(),
    plainText: e.content.map(We).join(`

`).trim(),
    hasMedia: qe(e)
  };
}
function Sr(t) {
  return /(^|\n)\s*(#{1,6}\s|[-*+]\s|>\s|\d+\.\s|```)/m.test(t) || /(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|`[^`]+`)/.test(t);
}
function Oo(t) {
  return kr(t).length > 0;
}
function kr(t) {
  const e = wt(t);
  return Kt.filter((n) => e[n].size > 0);
}
function $e(t) {
  const e = wt(t);
  return Kt.reduce(
    (n, r) => n + e[r].size,
    0
  );
}
function To(t, e) {
  return Array.from(wt(t)[e].keys());
}
function ze(t, e) {
  return Array.from(wt(t)[e].values());
}
function xr(t) {
  const e = Le(t);
  return e ? Array.from(
    new Set(e.frames.map((n) => n.image.trim()).filter(Boolean))
  ) : [];
}
function Le(t) {
  const e = Be(ee, t);
  return e !== yt ? e : Fe(
    ee,
    t,
    st(t, /* @__PURE__ */ new Set(), 0)
  );
}
function Ro(t, e) {
  const n = e.trim().toLowerCase();
  return n ? ot(t, n, /* @__PURE__ */ new Set(), 0) : !1;
}
function Eo(...t) {
  let e, n, r = 0;
  for (const i of t) {
    if (!bt(i))
      continue;
    e === void 0 && (e = i);
    const o = $e(i);
    o > r && (n = i, r = o);
  }
  return r > 0 ? n : e;
}
function bt(t) {
  return t == null || t === "" ? !1 : Array.isArray(t) ? t.length > 0 : typeof t == "object" ? Object.keys(t).length > 0 : !0;
}
function wt(t) {
  const e = Be(te, t);
  if (e !== yt)
    return e;
  const n = Gt(Kt), r = xr(t), i = /* @__PURE__ */ new Set();
  for (const o of Ve(t))
    pt(n, o, { seen: i });
  return pt(n, t), Te(n), r.length > 0 && (n.image = new Map(
    r.map((o) => [o, { url: o, thumbnail: o }])
  )), Fe(te, t, n);
}
function je() {
  return {
    objects: /* @__PURE__ */ new WeakMap(),
    strings: /* @__PURE__ */ new Map()
  };
}
function Be(t, e) {
  if (e && typeof e == "object")
    return t.objects.has(e) ? t.objects.get(e) : yt;
  if (!Ue(e) || !t.strings.has(e))
    return yt;
  const n = t.strings.get(e);
  return t.strings.delete(e), t.strings.set(e, n), n;
}
function Fe(t, e, n) {
  if (e && typeof e == "object")
    return t.objects.set(e, n), n;
  if (!Ue(e))
    return n;
  for (t.strings.delete(e), t.strings.set(e, n); t.strings.size > gr; ) {
    const r = t.strings.keys().next().value;
    if (typeof r != "string")
      break;
    t.strings.delete(r);
  }
  return n;
}
function Ue(t) {
  return typeof t == "string" && t.length <= hr;
}
function Ve(t) {
  if (!bt(t))
    return [];
  const e = br?.(t);
  return Array.isArray(e) && e.length > 0 ? e : Array.isArray(t) ? t : [t];
}
function ot(t, e, n, r) {
  return t == null || r > 12 ? !1 : typeof t == "string" ? nt(t).some(
    (i) => ot(i, e, n, r + 1)
  ) : Array.isArray(t) ? t.some(
    (i) => ot(i, e, n, r + 1)
  ) : !b(t) || n.has(t) ? !1 : (n.add(t), String(t.type || "").trim().toLowerCase() === e ? !0 : [
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
    (i) => ot(i, e, n, r + 1)
  ));
}
function st(t, e, n) {
  if (t == null || n > 12)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    if (!i || !i.startsWith("{") && !i.startsWith("["))
      return null;
    try {
      return st(JSON.parse(i), e, n + 1);
    } catch {
      return null;
    }
  }
  if (Array.isArray(t)) {
    for (const i of t) {
      const o = st(i, e, n + 1);
      if (o)
        return o;
    }
    return null;
  }
  if (!b(t) || e.has(t))
    return null;
  e.add(t);
  const r = Ar(t);
  if (r)
    return r;
  for (const i of [
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
    const o = st(t[i], e, n + 1);
    if (o)
      return o;
  }
  return null;
}
function Ar(t) {
  if (String(t.type || "").trim().toLowerCase() !== "storyboard_grid" || !Array.isArray(t.frames))
    return null;
  const e = t.frames.map(Cr).filter((n) => !!n).sort((n, r) => n.order - r.order);
  return e.length < 2 || e.length > cr ? null : {
    type: "storyboard_grid",
    version: Math.max(1, Math.trunc(Number(t.version) || 1)),
    title: P(t.title, "宫格图片"),
    summary: P(t.summary),
    frames: e
  };
}
function Cr(t, e) {
  if (!b(t))
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
    image: Nr(
      t.image,
      t.image_url,
      t.imageUrl
    ),
    error: P(t.error),
    assetID: ne(t.asset_id, t.assetId, t.assetID),
    assetVersionID: ne(
      t.asset_version_id,
      t.assetVersionId,
      t.assetVersionID
    )
  };
}
function Nr(...t) {
  for (const e of t) {
    const n = Gt(["image"]);
    pt(n, e, { kind: "image" });
    const r = n.image.values().next().value;
    if (r?.url)
      return r.url;
  }
  return "";
}
function ne(...t) {
  for (const e of t) {
    const n = Math.trunc(Number(e) || 0);
    if (n > 0)
      return n;
  }
  return 0;
}
function Ir(t) {
  return b(t) ? t.type === "doc" && Array.isArray(t.content) ? t : b(t.rich) && t.rich.type === "doc" && Array.isArray(t.rich.content) ? t.rich : null : null;
}
function Ge(t) {
  return b(t) ? t.type === "text" ? !Array.isArray(t.marks) || t.marks.length === 0 : t.type === "hardBreak" ? !0 : St(t) ? !!Ye(t) : t.type !== "doc" && t.type !== "paragraph" ? !1 : Array.isArray(t.content) && t.content.every(Ge) : !1;
}
function Ke(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : St(t) ? `![${Mr(
    String(t.attrs?.alt || t.attrs?.caption || "图片")
  )}](<${Dr(Ye(t))}>)` : Array.isArray(t.content) ? t.content.map(Ke).join("") : "";
}
function We(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : St(t) ? "" : Array.isArray(t.content) ? t.content.map(We).join("") : "";
}
function qe(t) {
  return St(t) || !!t.content?.some((e) => qe(e));
}
function St(t) {
  return ["image", "mediaImage", "editorMediaImage"].includes(
    String(t.type || "")
  );
}
function Ye(t) {
  return String(t.attrs?.src || "").trim();
}
function Mr(t) {
  return t.replace(/([\\\[\]])/g, "\\$1");
}
function Dr(t) {
  return t.replace(/</g, "%3C").replace(/>/g, "%3E");
}
const ve = {
  image: "images",
  audio: "audios",
  video: "videos",
  file: "files"
};
function Po(t, e) {
  const n = ve[t], r = n ? Wt(e, t) : [];
  if (n && r.length > 0)
    return { [n]: r };
  const i = Ft(e);
  if (!i)
    return e;
  const o = Pe(i);
  return o && (t === "text" || Sr(o.plainText)) ? { text: o.markdown } : { rich: i };
}
function Or(t, e) {
  return Wt(t, e)[0] || "";
}
function Wt(t, e) {
  return Tr(t, e).map((n) => n.url);
}
function Tr(t, e) {
  return Rr(e) ? lr(t, e) : [];
}
function $o(t, e) {
  if (!ve[e])
    return 0;
  const n = Wt(t, e).length;
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
function Rr(t) {
  return t === "image" || t === "video" || t === "audio" || t === "file";
}
function re(t, e = 0) {
  if (e > 8 || t == null) return "";
  if (typeof t == "string") return He(t) ? "" : t.trim();
  if (Array.isArray(t))
    return t.map((r) => re(r, e + 1)).filter(Boolean)[0] || "";
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
    const i = re(n[r], e + 1);
    if (i) return i;
  }
  return "";
}
function zo(t) {
  const e = t?.source?.prompt;
  return typeof e == "string" ? e.trim() : "";
}
function Lo(t) {
  const e = Or(t, "file"), n = at(t) || kn(e), r = n.match(/\.([a-z0-9]{1,10})$/i)?.[1] || "";
  return { url: e, name: n, extension: r };
}
function at(t, e = 0) {
  if (t == null || e > 8) return "";
  if (typeof t == "string") {
    const r = t.trim();
    return He(r) ? "" : r;
  }
  if (Array.isArray(t)) {
    for (const r of t) {
      const i = at(r, e + 1);
      if (i) return i;
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
    const i = at(n[r], e + 1);
    if (i) return i;
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
    const i = at(n[r], e + 1);
    if (i) return i;
  }
  return "";
}
function He(t) {
  return /^(https?:\/\/|\/|data:|blob:)/.test(t.trim());
}
await window.DeverFront?.ensureCompat?.(["@/page/nodes/show/tooltip"]);
const Ct = window.DeverFront?.sdk?.getCompatModule("@/page/nodes/show/tooltip");
if (!Ct || Object.keys(Ct).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/page/nodes/show/tooltip");
const Er = Ct.HoverTip, Pr = 12e3;
function ie({
  label: t,
  side: e = "top",
  sideOffset: n = 7,
  className: r = "",
  children: i
}) {
  return /* @__PURE__ */ a(
    Er,
    {
      content: t,
      side: e,
      sideOffset: n,
      layerZIndex: Pr,
      className: `max-w-80 whitespace-normal break-words ${r}`.trim(),
      children: i
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const Nt = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!Nt || Object.keys(Nt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const oe = Nt, se = oe.ContentView || oe.EnergonContentView;
function $r({
  output: t,
  fallback: e = "",
  streaming: n = !1,
  emptyText: r = "暂无内容",
  className: i,
  markdownClassName: o,
  richClassName: s,
  mediaLayout: c = "default"
}) {
  const f = Je(t, e);
  return se ? /* @__PURE__ */ a(ct, { className: i, children: /* @__PURE__ */ a(
    se,
    {
      output: f,
      streaming: n,
      emptyText: r,
      markdownClassName: o,
      richClassName: s,
      mediaLayout: c
    }
  ) }) : e ? /* @__PURE__ */ a("div", { className: i, children: e }) : null;
}
function Je(t, e = "") {
  return bt(t) ? t : e ? { text: e } : t;
}
function ct({
  className: t,
  children: e
}) {
  const n = (r) => {
    zr(r.target) && r.stopPropagation();
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
function zr(t) {
  return t instanceof Element && !!t.closest(
    "a, button, input, textarea, select, audio, video, [role='button']"
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const It = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!It || Object.keys(It).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const Lr = It.EnergonAudioPlayer;
function jo({
  src: t,
  prompt: e = "",
  detailed: n = !1,
  autoPlay: r = !1
}) {
  const i = /* @__PURE__ */ a(
    "div",
    {
      className: [
        "wb-asset-audio-preview",
        n ? "is-detail" : ""
      ].filter(Boolean).join(" "),
      children: /* @__PURE__ */ a(
        Lr,
        {
          src: t,
          detailed: n,
          autoPlay: r,
          className: "h-full min-h-0 border-0 bg-transparent p-0 shadow-none"
        }
      )
    }
  );
  return n ? /* @__PURE__ */ g("div", { className: "wb-asset-audio-detail", children: [
    i,
    e ? /* @__PURE__ */ g("section", { className: "wb-asset-audio-prompt", children: [
      /* @__PURE__ */ g("header", { children: [
        /* @__PURE__ */ a(Nn, { "aria-hidden": "true" }),
        /* @__PURE__ */ a("strong", { children: "语音文本" })
      ] }),
      /* @__PURE__ */ a("p", { children: e })
    ] }) : null
  ] }) : i;
}
function jr({
  ariaLabel: t,
  header: e,
  children: n,
  onRequestClose: r,
  layer: i = "default"
}) {
  const o = /* @__PURE__ */ a(
    "div",
    {
      className: `wb-detail-backdrop ${i === "nested" ? "is-nested" : ""}`.trim(),
      role: "presentation",
      onMouseDown: () => {
        r();
      },
      children: /* @__PURE__ */ g(
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
  return typeof document > "u" ? null : Sn(o, document.body);
}
function Br({
  icon: t,
  title: e,
  subtitle: n,
  versionSelect: r,
  state: i,
  updatedAt: o,
  actions: s,
  downloadUrl: c,
  onClose: f
}) {
  return /* @__PURE__ */ g("header", { className: "wb-detail-head", children: [
    /* @__PURE__ */ g("div", { className: "wb-detail-heading", children: [
      /* @__PURE__ */ a("span", { className: "wb-detail-kind-icon", "aria-hidden": "true", children: t }),
      /* @__PURE__ */ g("div", { children: [
        /* @__PURE__ */ a("strong", { children: e || "详情" }),
        n ? /* @__PURE__ */ a("span", { children: n }) : null
      ] })
    ] }),
    /* @__PURE__ */ g("div", { className: "wb-detail-meta", children: [
      r,
      i,
      o ? /* @__PURE__ */ a("time", { children: o }) : null
    ] }),
    /* @__PURE__ */ g("div", { className: "wb-detail-actions", children: [
      s,
      c ? /* @__PURE__ */ a(ie, { label: "下载内容", children: /* @__PURE__ */ a(
        xn,
        {
          url: c,
          name: e,
          className: "wb-detail-icon-button"
        }
      ) }) : null,
      /* @__PURE__ */ a(ie, { label: "关闭", children: /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "wb-detail-icon-button",
          onClick: f,
          "aria-label": "关闭详情",
          children: /* @__PURE__ */ a(In, { size: 18 })
        }
      ) })
    ] })
  ] });
}
function Bo({
  options: t,
  currentVersionId: e,
  selectedVersionId: n,
  total: r,
  hasMore: i,
  loading: o,
  loadingMore: s,
  error: c,
  disabled: f = !1,
  onSelect: d,
  onLoadMore: l,
  onRetry: u
}) {
  const [m, y] = M(!1), _ = we(null), w = t.find((p) => p.id === n) || t.find((p) => p.id === e);
  return j(() => {
    if (!m) return;
    const p = (S) => {
      _.current?.contains(S.target) || y(!1);
    };
    return document.addEventListener("mousedown", p), () => document.removeEventListener("mousedown", p);
  }, [m]), !n && !o ? null : /* @__PURE__ */ g("div", { className: "wb-detail-version-select", ref: _, children: [
    /* @__PURE__ */ g(
      "button",
      {
        type: "button",
        className: "wb-detail-version-trigger",
        "aria-haspopup": "listbox",
        "aria-expanded": m,
        disabled: f || o && t.length === 0,
        onClick: () => y((p) => !p),
        children: [
          o && t.length === 0 ? /* @__PURE__ */ a(v, { size: 12, className: "wb-detail-spin" }) : null,
          /* @__PURE__ */ a("span", { children: ce(w?.version) }),
          r > 0 ? /* @__PURE__ */ g("small", { children: [
            r,
            " 个版本"
          ] }) : null,
          /* @__PURE__ */ a(_e, { size: 13 })
        ]
      }
    ),
    m ? /* @__PURE__ */ a("div", { className: "wb-detail-version-menu", role: "listbox", children: /* @__PURE__ */ g(
      "div",
      {
        className: "wb-detail-version-options",
        onScroll: (p) => {
          const S = p.currentTarget;
          i && !s && S.scrollHeight - S.scrollTop - S.clientHeight < 36 && l();
        },
        children: [
          t.length > 0 ? t.map((p) => {
            const S = p.id === n, R = p.id === e;
            return /* @__PURE__ */ g(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": S,
                className: S ? "is-selected" : "",
                onClick: () => {
                  y(!1), d(p.value);
                },
                children: [
                  /* @__PURE__ */ g("span", { children: [
                    /* @__PURE__ */ a("strong", { children: ce(p.version) }),
                    R ? /* @__PURE__ */ a("small", { children: "当前" }) : null
                  ] }),
                  /* @__PURE__ */ a("time", { children: Fr(p.updatedAt) }),
                  S ? /* @__PURE__ */ a(be, { size: 13 }) : /* @__PURE__ */ a("i", { "aria-hidden": "true" })
                ]
              },
              p.id
            );
          }) : c ? /* @__PURE__ */ a(ae, { error: c, onRetry: u }) : /* @__PURE__ */ g("div", { className: "wb-detail-version-message", children: [
            o ? /* @__PURE__ */ a(v, { size: 14, className: "wb-detail-spin" }) : null,
            /* @__PURE__ */ a("span", { children: o ? "正在读取版本" : "暂无版本" })
          ] }),
          c && t.length > 0 ? /* @__PURE__ */ a(ae, { error: c, onRetry: u }) : null,
          s ? /* @__PURE__ */ g("div", { className: "wb-detail-version-loading", children: [
            /* @__PURE__ */ a(v, { size: 13, className: "wb-detail-spin" }),
            "正在加载更多"
          ] }) : null
        ]
      }
    ) }) : null
  ] });
}
function ae({
  error: t,
  onRetry: e
}) {
  return /* @__PURE__ */ g("div", { className: "wb-detail-version-message is-error", children: [
    /* @__PURE__ */ a("span", { children: t }),
    /* @__PURE__ */ g("button", { type: "button", onClick: e, children: [
      /* @__PURE__ */ a(Mn, { size: 12 }),
      "重试"
    ] })
  ] });
}
function ce(t) {
  const e = Number(t || 0);
  return e > 0 ? `第${e}版` : "版本";
}
function Fr(t) {
  const e = String(t || "").trim();
  return e ? e.replace("T", " ").replace(/\.\d+(Z)?$/, "").replace(/Z$/, "") : "";
}
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const Mt = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!Mt || Object.keys(Mt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const Ur = Mt.FirstFrameVideo, Vr = 56;
function ue(t, e) {
  const n = t.getBoundingClientRect(), r = Math.min(
    Vr,
    n.height * 0.25
  );
  return e >= n.bottom - r;
}
function Gr({
  src: t,
  poster: e = "",
  alt: n = "",
  className: r,
  style: i,
  title: o,
  draggable: s = !1,
  ariaLabel: c,
  onLoad: f,
  onError: d,
  onMediaSize: l,
  objectFit: u = "cover",
  allowDragFromVideo: m = !1
}) {
  const y = we(null), [_, w] = M(""), [p, S] = M(""), [R, U] = M(""), [h, z] = M(""), I = _ === t, C = p === t, kt = R !== t && h !== t;
  j(() => {
    const x = y.current;
    if (!x || !m) return;
    const G = (K) => {
      ue(x, K.clientY) && K.stopPropagation();
    }, Ht = (K) => {
      const Jt = K.touches[0];
      Jt && ue(x, Jt.clientY) && K.stopPropagation();
    };
    return x.addEventListener("mousedown", G), x.addEventListener("touchstart", Ht, {
      passive: !0
    }), () => {
      x.removeEventListener("mousedown", G), x.removeEventListener("touchstart", Ht);
    };
  }, [m]);
  function V(x) {
    x.stopPropagation();
  }
  function vt() {
    w((x) => x === t ? "" : x), S((x) => x === t ? "" : x);
  }
  function bn(x) {
    x.preventDefault(), x.stopPropagation();
    const G = y.current;
    G && (w(t), S(""), G.play().catch(() => {
      vt(), d?.();
    }));
  }
  return /* @__PURE__ */ g(
    "div",
    {
      className: [
        "relative isolate block h-full w-full overflow-hidden bg-muted",
        r
      ].filter(Boolean).join(" "),
      style: i,
      title: o,
      draggable: s,
      children: [
        /* @__PURE__ */ a(
          Ur,
          {
            videoRef: y,
            src: t,
            poster: e || void 0,
            controls: I,
            playsInline: !0,
            preload: "none",
            draggable: s,
            "aria-hidden": C ? void 0 : !0,
            className: [
              m ? "" : "nodrag",
              "nopan nowheel absolute inset-0 block h-full w-full",
              C ? "opacity-100" : "pointer-events-none opacity-0"
            ].join(" "),
            style: { objectFit: u },
            onPointerDown: m ? void 0 : V,
            onClick: V,
            onLoadedMetadata: (x) => l?.(
              x.currentTarget.videoWidth,
              x.currentTarget.videoHeight
            ),
            onPlaying: () => S(t),
            onError: () => {
              vt(), d?.();
            }
          }
        ),
        C ? null : /* @__PURE__ */ g(he, { children: [
          /* @__PURE__ */ a(
            An,
            {
              src: t,
              poster: e,
              alt: n,
              className: "pointer-events-none absolute inset-0 z-[1] block h-full w-full",
              style: { objectFit: u },
              draggable: s,
              ariaHidden: !0,
              onLoad: () => {
                U(t), f?.();
              },
              onError: () => {
                z(t), d?.();
              },
              onMediaSize: l
            }
          ),
          I ? /* @__PURE__ */ a(
            "span",
            {
              className: "pointer-events-none absolute left-1/2 top-1/2 z-[2] inline-flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white shadow-lg backdrop-blur-sm",
              role: "status",
              "aria-label": "正在加载视频",
              children: /* @__PURE__ */ a(
                v,
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
              onPointerDown: V,
              onClick: bn,
              children: kt ? /* @__PURE__ */ a(
                v,
                {
                  size: 16,
                  className: "animate-spin",
                  "aria-hidden": "true"
                }
              ) : /* @__PURE__ */ a(
                Dn,
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
const F = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dropdown-menu");
if (!F || Object.keys(F).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const Kr = F.DropdownMenu, Wr = F.DropdownMenuContent, qr = F.DropdownMenuItem, Yr = F.DropdownMenuTrigger, Dt = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!Dt || Object.keys(Dt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const vr = Dt.EnergonAudioPlayer, Hr = {
  image: "图片",
  video: "视频",
  audio: "音频"
}, Jr = {
  image: "张",
  video: "个",
  audio: "个"
};
function Ze(t, e) {
  const n = ar(e, t), r = Math.max(1, Math.ceil(t / n.capacity)), [i, o] = M(0);
  j(() => {
    o((c) => Math.min(c, r - 1));
  }, [r]);
  const s = Math.min(i, r - 1);
  return {
    shape: n,
    pageCount: r,
    pageIndex: s,
    pageOffset: s * n.capacity,
    setPageIndex: o
  };
}
function Xe({
  layout: t,
  countLabel: e,
  pageIndex: n,
  pageCount: r,
  disabled: i = !1,
  leading: o,
  actions: s,
  onLayoutChange: c,
  onPageChange: f
}) {
  const d = Vt(t), l = Oe(d);
  return /* @__PURE__ */ g("header", { className: "ws-media-grid-toolbar", children: [
    /* @__PURE__ */ g("div", { className: "ws-media-grid-toolbar-main", children: [
      o,
      /* @__PURE__ */ g(Kr, { modal: !1, children: [
        /* @__PURE__ */ a(Yr, { asChild: !0, children: /* @__PURE__ */ g(
          "button",
          {
            type: "button",
            className: "ws-media-grid-layout-trigger nodrag nopan",
            disabled: i || !c,
            "aria-label": "选择每页宫格布局",
            onClick: (u) => u.stopPropagation(),
            children: [
              /* @__PURE__ */ a(On, { size: 14 }),
              l.label,
              /* @__PURE__ */ a(_e, { size: 12 })
            ]
          }
        ) }),
        /* @__PURE__ */ a(
          Wr,
          {
            align: "start",
            className: "ws-media-grid-layout-menu",
            onClick: (u) => u.stopPropagation(),
            children: mt.map((u) => /* @__PURE__ */ g(
              qr,
              {
                className: "ws-media-grid-layout-item",
                onSelect: () => {
                  f(0), c?.(u.value);
                },
                children: [
                  /* @__PURE__ */ a("span", { children: u.label }),
                  /* @__PURE__ */ a("small", { children: u.value === "auto" ? "按结果排版" : `每页 ${u.capacity} 格` }),
                  u.value === d ? /* @__PURE__ */ a(be, { size: 13 }) : null
                ]
              },
              u.value
            ))
          }
        )
      ] }),
      /* @__PURE__ */ a("span", { className: "ws-media-grid-count", children: e }),
      r > 1 ? /* @__PURE__ */ g("div", { className: "ws-media-grid-page-controls", "aria-label": "宫格分页", children: [
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: n <= 0,
            title: "上一页",
            "aria-label": "上一页",
            onClick: (u) => {
              u.stopPropagation(), f(Math.max(0, n - 1));
            },
            children: /* @__PURE__ */ a(Tn, { size: 14 })
          }
        ),
        /* @__PURE__ */ g("span", { children: [
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
              u.stopPropagation(), f(Math.min(r - 1, n + 1));
            },
            children: /* @__PURE__ */ a(Rn, { size: 14 })
          }
        )
      ] }) : null
    ] }),
    s ? /* @__PURE__ */ a("div", { className: "ws-media-grid-toolbar-actions", children: s }) : null
  ] });
}
function Zr({
  kind: t,
  items: e,
  label: n
}) {
  const [r, i] = M("auto"), o = Ze(e.length, r), s = e.slice(
    o.pageOffset,
    o.pageOffset + o.shape.capacity
  ), c = Array.from(
    { length: o.shape.capacity },
    (d, l) => s[l]
  ), f = Hr[t];
  return /* @__PURE__ */ g("section", { className: `ws-media-grid-view is-${t}`, children: [
    /* @__PURE__ */ a(
      Xe,
      {
        layout: r,
        countLabel: `${e.length} ${Jr[t]}`,
        pageIndex: o.pageIndex,
        pageCount: o.pageCount,
        onLayoutChange: i,
        onPageChange: o.setPageIndex
      }
    ),
    /* @__PURE__ */ a("div", { className: "ws-media-grid-body nowheel", children: /* @__PURE__ */ a(
      "div",
      {
        className: "ws-media-grid-list",
        style: {
          gridTemplateColumns: `repeat(${o.shape.columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${o.shape.rows}, minmax(0, 1fr))`
        },
        children: c.map((d, l) => {
          const u = o.pageOffset + l, m = `${n || f} ${u + 1}`;
          return d ? /* @__PURE__ */ a(
            "figure",
            {
              className: t === "audio" ? "is-audio" : void 0,
              "aria-label": t === "audio" ? m : void 0,
              children: /* @__PURE__ */ a(Xr, { kind: t, item: d, label: m })
            },
            `${d.url}-${u}`
          ) : /* @__PURE__ */ a("figure", { className: "is-empty" }, `empty-${u}`);
        })
      }
    ) })
  ] });
}
function Xr({
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
    Gr,
    {
      src: r,
      poster: e.thumbnail,
      draggable: !1,
      ariaLabel: n,
      objectFit: "cover"
    },
    r
  ) : /* @__PURE__ */ g(
    "div",
    {
      className: `ws-media-grid-audio-card${e.thumbnail ? " has-cover" : ""}`,
      children: [
        e.thumbnail ? /* @__PURE__ */ a("img", { src: e.thumbnail, alt: "", loading: "lazy", decoding: "async" }) : null,
        /* @__PURE__ */ a(
          vr,
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
function Qr({
  items: t,
  initialItemID: e,
  onClose: n
}) {
  const r = de(t, e), [i, o] = M(r), s = t.map((d) => `${String(d.id)}:${d.url}`).join(`
`);
  j(() => {
    o(de(t, e));
  }, [e, s]), j(() => {
    const d = (l) => {
      l.key === "Escape" && n();
    };
    return document.addEventListener("keydown", d), () => document.removeEventListener("keydown", d);
  }, [n]);
  const c = Math.min(
    Math.max(0, i),
    Math.max(0, t.length - 1)
  ), f = t[c];
  return f ? /* @__PURE__ */ a(
    jr,
    {
      ariaLabel: "图片预览",
      layer: "nested",
      onRequestClose: n,
      header: /* @__PURE__ */ a(
        Br,
        {
          icon: /* @__PURE__ */ a(En, { size: 16 }),
          title: f.name || "图片预览",
          subtitle: `图片 ${c + 1}/${t.length}`,
          downloadUrl: f.url,
          onClose: n
        }
      ),
      children: /* @__PURE__ */ a("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ a(
        Cn,
        {
          kind: "image",
          items: t,
          activeIndex: c,
          onSelect: o
        }
      ) })
    }
  ) : null;
}
function de(t, e) {
  const n = t.findIndex((r) => String(r.id) === String(e));
  return n >= 0 ? n : 0;
}
function Qe({
  grid: t,
  variant: e = "compact",
  readonly: n = !0,
  renderFrameAction: r,
  onFrameChange: i,
  onFrameImport: o,
  onEmptyFrameImport: s,
  capacity: c,
  showHeader: f = !0,
  showCaptions: d = !0,
  columns: l,
  rows: u,
  frameOffset: m = 0,
  previewFrames: y
}) {
  const [_, w] = M(
    null
  ), p = $n(
    () => (y || t.frames).filter((h) => !!h.image).map((h) => ({
      id: h.id || h.order,
      name: h.title || `画面 ${h.order}`,
      url: h.image,
      thumbnail: h.image
    })),
    [t.frames, y]
  ), S = Math.max(
    t.frames.length,
    Math.trunc(Number(c) || 0)
  ), R = Array.from(
    { length: S },
    (h, z) => t.frames[z]
  ), U = {
    ...l ? { gridTemplateColumns: `repeat(${l}, minmax(0, 1fr))` } : {},
    ...u ? { gridTemplateRows: `repeat(${u}, minmax(0, 1fr))` } : {}
  };
  return /* @__PURE__ */ g("section", { className: `ws-storyboard-grid-output is-${e}`, children: [
    f ? /* @__PURE__ */ g("header", { children: [
      /* @__PURE__ */ a("strong", { children: t.title }),
      t.summary ? /* @__PURE__ */ a("p", { children: t.summary }) : null
    ] }) : null,
    /* @__PURE__ */ a(
      "div",
      {
        className: "ws-storyboard-grid-output-list",
        "data-count": R.length,
        style: U,
        children: R.map((h, z) => {
          const I = m + z;
          return h ? /* @__PURE__ */ g("figure", { className: h.image ? "" : "is-empty", children: [
            h.image ? /* @__PURE__ */ a(
              ti,
              {
                frame: h,
                onPreview: () => w(h.id || h.order)
              }
            ) : o ? /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-empty nodrag nopan",
                title: "导入图片",
                "aria-label": `向第 ${h.order} 格导入图片`,
                onClick: (C) => {
                  C.preventDefault(), C.stopPropagation(), o(h, I);
                },
                children: /* @__PURE__ */ a(H, { size: 18 })
              }
            ) : /* @__PURE__ */ a("div", { className: "ws-storyboard-grid-output-error", children: h.error || "暂无图片" }),
            h.image && o ? /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-import nodrag nopan",
                title: "替换图片",
                "aria-label": `替换第 ${h.order} 格图片`,
                onClick: (C) => {
                  C.preventDefault(), C.stopPropagation(), o(h, I);
                },
                children: /* @__PURE__ */ a(H, { size: 14 })
              }
            ) : null,
            d ? /* @__PURE__ */ g("figcaption", { children: [
              /* @__PURE__ */ a("span", { children: String(h.order).padStart(2, "0") }),
              e === "detail" && !n && i ? /* @__PURE__ */ a(
                "input",
                {
                  value: h.title,
                  "aria-label": `第 ${h.order} 格标题`,
                  onChange: (C) => i(I, { title: C.target.value })
                }
              ) : /* @__PURE__ */ a("strong", { children: h.title })
            ] }) : null,
            e === "detail" ? /* @__PURE__ */ g("div", { className: "ws-storyboard-grid-output-details", children: [
              n || !i ? /* @__PURE__ */ a("p", { children: h.description || "暂无画面说明" }) : /* @__PURE__ */ a(
                "textarea",
                {
                  value: h.description,
                  rows: 3,
                  "aria-label": `第 ${h.order} 格说明`,
                  placeholder: "画面说明",
                  onChange: (C) => i(I, {
                    description: C.target.value
                  })
                }
              ),
              r ? /* @__PURE__ */ a("div", { className: "ws-storyboard-grid-output-actions", children: r(h, I) }) : null
            ] }) : null
          ] }, h.id) : /* @__PURE__ */ a("figure", { className: "is-empty", children: s ? /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "ws-storyboard-grid-frame-empty nodrag nopan",
              title: "导入图片",
              "aria-label": `向第 ${I + 1} 格导入图片`,
              onClick: (C) => {
                C.preventDefault(), C.stopPropagation(), s(I);
              },
              children: /* @__PURE__ */ a(H, { size: 18 })
            }
          ) : null }, `empty-${I}`);
        })
      }
    ),
    _ != null && p.length > 0 ? /* @__PURE__ */ a(
      Qr,
      {
        items: p,
        initialItemID: _,
        onClose: () => w(null)
      }
    ) : null
  ] });
}
function ti({
  frame: t,
  onPreview: e
}) {
  const [n, r] = M(!1);
  return j(() => {
    r(!1);
  }, [t.image]), n ? /* @__PURE__ */ a("div", { className: "ws-storyboard-grid-output-error", children: t.error || "图片加载失败" }) : /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      className: "ws-storyboard-grid-image nodrag nopan",
      title: "预览图片",
      "aria-label": `预览第 ${t.order} 格图片`,
      onClick: (i) => {
        i.preventDefault(), i.stopPropagation(), e();
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
function Fo({
  grid: t,
  aspectRatio: e,
  running: n = !1,
  onImport: r,
  onFrameImport: i,
  onSlotImport: o,
  onEdit: s,
  layout: c = "auto",
  onLayoutChange: f
}) {
  const d = Vt(c), l = t?.frames.length || 0, u = Ze(l, d), m = t ? {
    ...t,
    frames: t.frames.slice(
      u.pageOffset,
      u.pageOffset + u.shape.capacity
    )
  } : null, y = t?.frames.filter((w) => w.image).length || 0, _ = l > 0 && y !== l ? `${y}/${l} 张` : `${l} 张`;
  return /* @__PURE__ */ g(
    "section",
    {
      className: `ws-storyboard-grid-canvas ${n ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ a(
          Xe,
          {
            layout: d,
            countLabel: _,
            pageIndex: u.pageIndex,
            pageCount: u.pageCount,
            disabled: n || !f,
            leading: /* @__PURE__ */ g("span", { children: [
              "比例 ",
              e || "自动"
            ] }),
            actions: r || t && s ? /* @__PURE__ */ g(he, { children: [
              r ? /* @__PURE__ */ g(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: n,
                  onClick: (w) => {
                    w.stopPropagation(), r();
                  },
                  children: [
                    /* @__PURE__ */ a(H, { size: 14 }),
                    /* @__PURE__ */ a("span", { children: t ? "批量导入" : "导入图片" })
                  ]
                }
              ) : null,
              t && s ? /* @__PURE__ */ g(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: n,
                  onClick: (w) => {
                    w.stopPropagation(), s();
                  },
                  children: [
                    /* @__PURE__ */ a(Pn, { size: 14 }),
                    /* @__PURE__ */ a("span", { children: "编辑" })
                  ]
                }
              ) : null
            ] }) : void 0,
            onLayoutChange: f,
            onPageChange: u.setPageIndex
          }
        ),
        /* @__PURE__ */ a("div", { className: "ws-storyboard-grid-canvas-body nowheel", children: m ? /* @__PURE__ */ a(
          Qe,
          {
            grid: m,
            previewFrames: t?.frames,
            capacity: u.shape.capacity,
            columns: u.shape.columns,
            rows: u.shape.rows,
            frameOffset: u.pageOffset,
            showHeader: !1,
            showCaptions: !1,
            onFrameImport: n ? void 0 : i,
            onEmptyFrameImport: n ? void 0 : o
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
            children: Array.from({ length: u.shape.capacity }, (w, p) => /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "nodrag nopan",
                disabled: n || !o,
                title: "导入图片",
                "aria-label": `向宫格导入图片，第 ${p + 1} 格`,
                onClick: (S) => {
                  S.stopPropagation(), o?.(p);
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
function qt(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  for (const i of t) {
    if (!b(i))
      continue;
    const o = Z(i.asset_id ?? i.assetId), s = nn(i.kind), c = Tt(i.purpose);
    if (!o || !s || !c || r.has(o))
      continue;
    let f = String(i.key || "").trim() || Ot(o);
    if (n.has(f) && (f = Ot(o)), n.has(f))
      continue;
    const d = Z(i.version_id ?? i.versionId), l = String(i.label || "").trim() || `参考素材 ${e.length + 1}`;
    e.push({
      key: f,
      asset_id: o,
      ...d ? { version_id: d } : {},
      label: l,
      kind: s,
      purpose: c
    }), n.add(f), r.add(o);
  }
  return e;
}
function Uo(t, e, n, r, i, o) {
  const s = new Map(
    qt(e).map((u) => [
      u.asset_id,
      u
    ])
  ), c = new Map(
    n.flatMap((u) => {
      const m = Z(u.refId);
      return m ? [[m, u]] : [];
    })
  ), f = [], d = (t?.parts || []).map((u) => ({ ...u })), l = /* @__PURE__ */ new Set();
  for (const [u, m] of (t?.parts || []).entries()) {
    if (m.type !== "reference" || m.ref_type !== "asset")
      continue;
    const y = Z(m.ref_id);
    if (!y || l.has(y))
      continue;
    const _ = s.get(y), w = c.get(y), p = nn(w?.kind) || _?.kind;
    if (!p)
      continue;
    const S = Z(w?.versionID || m.ref_version_id), R = String(w?.title || m.label || _?.label || "").trim() || `参考素材 ${f.length + 1}`, U = tn(
      p,
      i,
      o
    ), h = Tt(m.purpose), z = Tt(
      _?.purpose
    ), I = [h, z].find(
      (kt) => U.some((V) => V.value === kt)
    ) || ni(
      r,
      R,
      p,
      i,
      o
    ), C = d[u];
    C?.type === "reference" && (C.purpose = I || void 0), f.push({
      key: _?.key || Ot(y),
      asset_id: y,
      ...S ? { version_id: S } : {},
      label: R,
      kind: p,
      purpose: I
    }), l.add(y);
  }
  return {
    content: t ? { ...t, parts: d } : void 0,
    references: f
  };
}
function Vo(t, e) {
  return e.filter(
    (n) => n.work_types.length === 0 || n.work_types.includes(t)
  ).map((n) => ({
    key: n.key,
    label: n.name,
    acceptedKinds: [...n.media_kinds]
  }));
}
function tn(t, e, n) {
  return n.filter(
    (r) => r.media_kinds.includes(t) && (r.work_types.length === 0 || r.work_types.includes(e))
  ).map((r) => ({ value: r.key, label: r.name }));
}
function en(t, e) {
  return e.find((n) => n.key === t);
}
function ei(t, e) {
  return en(t, e)?.name || t;
}
function Go(t, e, n, r) {
  const i = n.find((s) => s.key === e);
  if (!i || r.length === 0)
    return "分镜作品类型或参考用途配置无效";
  const o = /* @__PURE__ */ new Map();
  for (const s of t) {
    const c = en(
      s.purpose,
      r
    );
    if (!c)
      return `参考素材“${s.label}”的用途无效`;
    if (!c.media_kinds.includes(s.kind))
      return `参考素材“${s.label}”的类型不支持用途“${c.name}”`;
    if (c.work_types.length > 0 && !c.work_types.includes(e))
      return `当前作品类型不支持“${s.label}”的用途“${c.name}”`;
    const f = (o.get(s.purpose) || 0) + 1;
    if (o.set(s.purpose, f), c.max_count > 0 && f > c.max_count)
      return `用途“${c.name}”最多只能选择 ${c.max_count} 个素材`;
  }
  for (const s of i.required_reference_purposes)
    if (!o.get(s))
      return `${i.name}必须添加“${ei(
        s,
        r
      )}”`;
  return "";
}
function Ot(t) {
  return `ref-${t}`;
}
function Tt(t) {
  const e = String(t || "").trim();
  return e || void 0;
}
function ni(t, e, n, r, i) {
  const o = ri(t, e), s = [];
  /角色|人物|主角|外貌|长相|形象/.test(o) && n === "image" && s.push("character"), /场景|环境|地点|空间/.test(o) && n === "image" && s.push("scene"), /产品|商品/.test(o) && n === "image" && r === "ad" && s.push("product"), /道具|产品|商品|物品/.test(o) && n === "image" && s.push("prop"), /镜头|构图|画面/.test(o) && n !== "audio" && s.push("shot"), /运镜|节奏|动作|转场|剪辑/.test(o) && n === "video" && s.push("motion_style"), /风格|画风|色调|光线|质感|视觉/.test(o) && n !== "audio" && s.push("visual_style");
  const c = tn(n, r, i), f = s.find(
    (l) => c.some((u) => u.value === l)
  );
  return f || i.find(
    (l) => l.default_media_kinds.includes(n) && (l.work_types.length === 0 || l.work_types.includes(r))
  )?.key || c[0]?.value || "";
}
function ri(t, e) {
  const n = `@${String(e || "").replace(/^@+/, "")}`, r = t.indexOf(n);
  return r < 0 ? t : t.slice(Math.max(0, r - 24), r + n.length + 32);
}
function nn(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "image" || e === "video" || e === "audio" ? e : void 0;
}
function Z(t) {
  const e = Number(t || 0);
  return Number.isInteger(e) && e > 0 ? e : 0;
}
function ii(t) {
  return typeof t == "string" && t.length > 0 && t.trim() === t;
}
const Rt = 9, Yt = 4, oi = 50, le = /* @__PURE__ */ new Set([
  "未命名",
  "未命名分镜",
  "分镜",
  "分镜脚本",
  "暂无内容简介",
  "围绕当前主题展开并完成一个连贯事件"
]), si = [
  "none",
  "fade",
  "crossfade",
  "fadeblack",
  "fadewhite",
  "wipeleft",
  "wiperight"
], Ko = {
  none: "硬切",
  fade: "淡化",
  crossfade: "交叉溶解",
  fadeblack: "黑场淡化",
  fadewhite: "白场淡化",
  wipeleft: "向左擦除",
  wiperight: "向右擦除"
}, ai = ["photoreal", "stylized"], Wo = {
  photoreal: "写实影像",
  stylized: "非写实影像"
}, ci = [
  "16:9",
  "9:16",
  "1:1",
  "4:3",
  "3:4",
  "21:9"
], ui = "16:9", qo = {
  character: "角色",
  scene: "场景",
  prop: "道具"
}, di = {
  character: "画面类型：写实影像，人物五官、身体比例、光线和材质保持真实自然",
  scene: "画面类型：写实影像，空间透视、尺度关系、光线和环境材质保持真实自然",
  prop: "画面类型：写实影像，道具比例、结构、光线和材质保持真实自然",
  shot: "画面类型：写实影像，人物五官、身体比例、光线和材质保持真实自然"
}, li = [
  "shot_images",
  "final_video",
  "shot_videos",
  "storyboard_only"
], W = {
  output_target: "shot_images",
  voice_mode: "auto",
  subtitle_mode: "auto",
  lip_sync_mode: "off",
  shot_visual_strategy: "auto"
};
function rn(t, e) {
  return e > 0 && (t.match_previous || t.continue_previous);
}
const fi = [
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
function mi(t) {
  return Y(t, /* @__PURE__ */ new Set(), 0);
}
function Yo(t, e) {
  if (!b(t) || !Array.isArray(t.materials))
    return null;
  const n = t.materials.map(mn);
  if (n.some((s) => !s))
    return null;
  const r = n, i = new Set(
    r.map((s) => s.id)
  );
  if (i.size !== r.length)
    return null;
  const o = pn(t.shot, e, i);
  return o ? { shot: o, materials: r } : null;
}
function vo(t) {
  return on(t.shots);
}
function on(t) {
  return t.reduce(
    (e, n) => e + Math.max(0, Number(n.duration) || 0),
    0
  );
}
function pi(t) {
  return Number.isInteger(t) && t >= Yt;
}
function Ho(t, e) {
  const n = new Map(
    t.materials.map((r) => [r.id, r])
  );
  return e.material_ids.map((r) => n.get(r)).filter((r) => !!r);
}
function Jo(t) {
  return {
    id: `shot-${t + 1}`,
    order: t + 1,
    duration: Yt,
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
function Zo(t, e) {
  const n = new Set(t.map((o) => o.id));
  let r = t.filter((o) => o.type === e).length + 1, i = `${e}-${r}`;
  for (; n.has(i); )
    r += 1, i = `${e}-${r}`;
  return {
    id: i,
    type: e,
    name: "",
    prompt: "",
    voice: "",
    reference_keys: []
  };
}
function Xo(t, e) {
  const n = [], r = [];
  for (const i of t.shots) {
    i.material_ids.includes(e) && n.push(i.id);
    for (const o of i.speech)
      o.character_id === e && r.push(o.id);
  }
  return { shotIds: n, speechIds: r };
}
function Qo(t, e = "dialogue") {
  const n = new Set(t.speech.map((o) => o.id));
  let r = t.speech.length + 1, i = `${t.id}-speech-${r}`;
  for (; n.has(i); )
    r += 1, i = `${t.id}-speech-${r}`;
  return {
    id: i,
    kind: e,
    text: "",
    start_time: 0,
    subtitle_enabled: !0,
    subtitle_text: "",
    ...e === "dialogue" ? { character_id: "", speaker_mode: "offscreen" } : {}
  };
}
function ts(t) {
  const e = new Set(t.captions.map((i) => i.id));
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
function yi(t) {
  const e = yn(t.workflow), n = qt(t.references), r = new Set(n.map((s) => s.key)), i = new Set(
    t.materials.map((s) => s.id)
  ), o = t.shots.map((s, c) => {
    const f = c > 0 ? ln(s.transition_type) : "none", d = Math.round(
      Number(s.transition_duration_ms)
    );
    return {
      ...s,
      id: s.id || `shot-${c + 1}`,
      order: c + 1,
      transition: c > 0 ? s.transition.trim() : "",
      transition_type: f,
      transition_duration_ms: f !== "none" ? Math.min(
        5e3,
        Math.max(
          100,
          Number.isFinite(d) ? d : 100
        )
      ) : 0,
      material_ids: X(s.material_ids).filter(
        (l) => i.has(l)
      ),
      reference_keys: X(s.reference_keys).filter(
        (l) => r.has(l)
      ),
      match_previous: c > 0 && !s.continue_previous && !!s.match_previous,
      continue_previous: c > 0 && !!s.continue_previous,
      continuity_anchor: c > 0 && s.continue_previous ? s.continuity_anchor.trim() : "",
      continuity_state: sn(
        s.continuity_state
      )
    };
  });
  return o.forEach((s, c) => {
    rn(s, c) && (s.continuity_state.entry = o[c - 1].continuity_state.exit);
  }), {
    ...t,
    version: Rt,
    workflow: e,
    production_plan: an(
      t.production_plan
    ),
    target_duration: on(o),
    target_shot_count: o.length,
    narrator_voice: t.narrator_voice.trim(),
    aspect_ratio: dn(t.aspect_ratio),
    references: n,
    materials: t.materials.map((s) => ({
      ...s,
      voice: s.type === "character" ? s.voice.trim() : "",
      reference_keys: X(s.reference_keys).filter(
        (c) => r.has(c)
      )
    })),
    shots: o
  };
}
function sn(t) {
  const e = b(t) ? t : {};
  return {
    entry: k(e.entry).trim(),
    exit: k(e.exit).trim()
  };
}
function es(t, e) {
  const n = /* @__PURE__ */ new Map();
  return t.shots.forEach((r, i) => {
    i > 0 && n.set(r.id, t.shots[i - 1].id);
  }), {
    ...e,
    shots: e.shots.map((r, i) => {
      const o = i > 0 ? e.shots[i - 1].id : "", s = i === 0 || n.get(r.id) !== o;
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
function ns(t) {
  return t.workflow.status === "confirmed";
}
function an(t) {
  if (!b(t))
    return { ...W };
  const e = k(t.output_target).toLowerCase();
  return {
    output_target: li.includes(
      e
    ) ? e : W.output_target,
    voice_mode: xt(
      t.voice_mode,
      W.voice_mode
    ),
    subtitle_mode: xt(
      t.subtitle_mode,
      W.subtitle_mode
    ),
    lip_sync_mode: xt(
      t.lip_sync_mode,
      W.lip_sync_mode
    ),
    shot_visual_strategy: "auto"
  };
}
function rs(t) {
  return t.production_plan.output_target !== "storyboard_only";
}
function cn(t) {
  return ["shot_videos", "final_video"].includes(
    t.production_plan.output_target
  );
}
function is(t) {
  return t.production_plan.output_target === "final_video";
}
function gi(t) {
  return cn(t) && t.production_plan.voice_mode === "auto" && hi(t) > 0;
}
function os(t) {
  return cn(t) && t.production_plan.subtitle_mode === "auto" && _i(t) > 0;
}
function ss(t) {
  return gi(t) && t.production_plan.lip_sync_mode === "auto" && t.shots.some(Si);
}
function hi(t) {
  return t.shots.reduce(
    (e, n) => e + n.speech.filter(hn).length,
    0
  );
}
function _i(t) {
  return t.shots.reduce(
    (e, n) => e + bi(n).length,
    0
  );
}
function bi(t) {
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
    (r, i) => r.start_time - i.start_time
  );
}
function wi(t) {
  return t.kind === "narration" ? "旁白" : t.speaker_mode === "visible" ? "出镜对白" : "画外音";
}
function un(t) {
  return t.kind === "dialogue" && t.speaker_mode === "visible" && !!t.text.trim();
}
function Si(t) {
  return t.speech.some(un);
}
function as(t) {
  return new Set(
    t.speech.filter(un).map((e) => e.character_id?.trim()).filter((e) => !!e)
  );
}
function cs(t) {
  return `${t.title.trim() || "分镜脚本"} · ${t.shots.length} 个镜头`;
}
function us(t) {
  return t.summary.trim() || fn("", t.shots);
}
function ds(t, e) {
  const n = t.style_prompt.trim(), r = { ...t, style_prompt: e };
  return !n || n === e.trim() ? r : {
    ...r,
    materials: t.materials.map((i) => ({
      ...i,
      prompt: fe(
        i.prompt,
        n
      )
    })),
    shots: t.shots.map((i) => ({
      ...i,
      video_prompt: fe(
        i.video_prompt,
        n
      )
    }))
  };
}
function ls(t, e, n = "shot") {
  const r = t.visual_mode === "photoreal" ? di[n] : "画面类型：非写实影像，保持统一造型语言，不得漂移为真人摄影";
  let i = me(e.trim(), r);
  const o = t.style_prompt.trim();
  if (!o)
    return i;
  const s = `统一视觉风格：${o}`;
  return i = me(i, s), i;
}
function fe(t, e) {
  const n = `统一视觉风格：${e}`, r = t.trimEnd().replace(/[。！？!?；;，,\s]+$/g, "");
  return r.endsWith(n) ? r.slice(0, -n.length).replace(/[。！？!?；;，,：:\s]+$/g, "").trimEnd() : t;
}
function me(t, e) {
  if (!e || t.includes(e))
    return t;
  if (!t)
    return e;
  const n = /[。！？!?；;，,：:]$/.test(t) ? "" : "。";
  return `${t}${n}${e}`;
}
function dn(t) {
  const e = k(t);
  return ci.includes(e) ? e : ui;
}
function ln(t) {
  const e = k(t);
  return si.includes(e) ? e : "none";
}
function fs(t) {
  const e = t.speech.filter(hn).map((r) => `${wi(r)}：${r.text.trim()}`).join("；");
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
  const r = t, i = ki(r);
  if (i)
    return i;
  const o = Di(r);
  if (o) {
    const s = Y(o, e, n + 1);
    if (s)
      return s;
  }
  for (const s of fi) {
    const c = r[s];
    if (c == null || c === t)
      continue;
    const f = Y(c, e, n + 1);
    if (f)
      return f;
  }
  return null;
}
function ki(t) {
  const e = k(t.visual_mode).toLowerCase(), n = xi(t.work_type);
  if (k(t.type).toLowerCase() !== "storyboard" || $(t.version) !== Rt || typeof t.title != "string" || typeof t.narrator_voice != "string" || typeof t.style_prompt != "string" || !Ni(e) || !n || !Array.isArray(t.references) || !Array.isArray(t.materials) || !Array.isArray(t.shots))
    return null;
  const r = Ai(t.storyline);
  if (!r)
    return null;
  const i = qt(t.references);
  if (i.length !== t.references.length)
    return null;
  const o = t.materials.map(mn);
  if (o.some((p) => !p))
    return null;
  const s = o, c = /* @__PURE__ */ new Set();
  for (const p of s) {
    if (c.has(p.id))
      return null;
    c.add(p.id);
  }
  const f = /* @__PURE__ */ new Set(), d = t.shots.map(
    (p, S) => pn(p, S, c)
  );
  if (d.some((p) => !p))
    return null;
  const l = d;
  for (const [p, S] of l.entries()) {
    if (f.has(S.id) || rn(S, p) && S.continuity_state.entry !== l[p - 1].continuity_state.exit)
      return null;
    f.add(S.id);
  }
  const u = $(t.target_duration), m = $(t.target_shot_count);
  if (u == null || !Number.isInteger(u) || u < Yt || m == null || !Number.isInteger(m) || m < 1 || m > oi)
    return null;
  const y = yn(t.workflow), _ = fn(
    k(t.summary),
    l
  ), w = {
    ...t,
    type: "storyboard",
    version: Rt,
    work_type: n,
    workflow: y,
    production_plan: an(t.production_plan),
    title: Ci(t.title, _, l),
    summary: _,
    target_duration: u,
    target_shot_count: m,
    narrator_voice: t.narrator_voice.trim(),
    storyline: r,
    style_prompt: t.style_prompt,
    visual_mode: e,
    aspect_ratio: dn(t.aspect_ratio),
    references: i,
    materials: s,
    shots: l
  };
  return yi(w);
}
function xi(t) {
  const e = k(t).toLowerCase();
  return e ? ii(e) ? e : null : "short";
}
function Ai(t) {
  if (!b(t))
    return null;
  const e = k(t.setup), n = k(t.development), r = k(t.payoff);
  return { setup: e, development: n, payoff: r };
}
function fn(t, e) {
  const n = t.trim();
  if (n)
    return n;
  const r = e.map((i) => i.description.trim()).filter(Boolean);
  return r.length > 0 ? r.join("；") : "暂无内容简介";
}
function Ci(t, e, n) {
  const r = t.trim();
  if (r && !le.has(r))
    return r;
  const i = [e, n[0]?.beat, n[0]?.description].map((s) => String(s || "").trim()).find((s) => s && !le.has(s));
  if (!i)
    return "分镜脚本";
  const o = i.split(/[\r\n。！？!?；;]/, 1)[0].trim();
  return Array.from(o).slice(0, 24).join("") || "分镜脚本";
}
function Ni(t) {
  return ai.includes(t);
}
function mn(t) {
  if (!b(t))
    return null;
  const e = k(t.type).toLowerCase();
  return !Oi(e) || typeof t.id != "string" || !t.id.trim() || typeof t.name != "string" || typeof t.prompt != "string" || typeof t.voice != "string" || !Array.isArray(t.reference_keys) ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    name: t.name.trim().replace(/^[@#]+/, ""),
    prompt: t.prompt.trim(),
    voice: e === "character" ? t.voice.trim() : "",
    reference_keys: X(t.reference_keys.map(k))
  };
}
function pn(t, e, n) {
  if (!b(t) || typeof t.id != "string" || !t.id.trim() || typeof t.beat != "string" || !t.beat.trim() || typeof t.transition != "string" || typeof t.transition_type != "string" || typeof t.match_previous != "boolean" || typeof t.description != "string" || typeof t.camera_instruction != "string" || typeof t.video_prompt != "string" || typeof t.continue_previous != "boolean" || typeof t.continuity_anchor != "string" || !b(t.continuity_state) || !Array.isArray(t.material_ids) || !Array.isArray(t.reference_keys) || !Array.isArray(t.speech) || !Array.isArray(t.captions))
    return null;
  const r = $(t.duration);
  if (r == null || !pi(r))
    return null;
  const i = t.material_ids.map(k);
  if (i.some((_) => !_ || !n.has(_)) || new Set(i).size !== i.length)
    return null;
  const o = t.speech.map(Ii);
  if (o.some((_) => !_))
    return null;
  const s = t.captions.map(Mi);
  if (s.some(
    (_) => !_ || _.end_time > r
  ))
    return null;
  const c = e > 0 && t.continue_previous;
  if (e === 0 && (t.match_previous || t.continue_previous) || t.match_previous && t.continue_previous)
    return null;
  const f = e > 0 && !c && t.match_previous, d = t.transition.trim();
  if (e > 0 && !d)
    return null;
  const l = t.continuity_anchor.trim();
  if (c && !l)
    return null;
  const u = sn(
    t.continuity_state
  );
  if (!u.entry || !u.exit)
    return null;
  const m = ln(
    t.transition_type
  ), y = $(t.transition_duration_ms);
  return m !== t.transition_type || y == null || !Number.isInteger(y) || y < 0 || y > 5e3 || e === 0 && (m !== "none" || y !== 0) || e > 0 && m === "none" && y !== 0 || e > 0 && m !== "none" && y < 100 ? null : {
    ...t,
    id: t.id.trim(),
    order: e + 1,
    duration: r,
    beat: t.beat.trim(),
    transition: e > 0 ? d : "",
    transition_type: e > 0 ? m : "none",
    transition_duration_ms: e > 0 && m !== "none" ? y : 0,
    description: t.description,
    camera_instruction: t.camera_instruction,
    video_prompt: t.video_prompt,
    material_ids: i,
    reference_keys: X(t.reference_keys.map(k)),
    match_previous: f,
    continue_previous: c,
    continuity_anchor: c ? l : "",
    continuity_state: u,
    speech: o,
    captions: s
  };
}
function Ii(t) {
  if (!b(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string" || typeof t.subtitle_enabled != "boolean" || typeof t.subtitle_text != "string")
    return null;
  const e = k(t.kind).toLowerCase(), n = $(t.start_time);
  if (e !== "dialogue" && e !== "narration" || n == null || n < 0)
    return null;
  if (e === "narration") {
    const i = {
      ...t,
      id: t.id.trim(),
      kind: e,
      text: t.text,
      start_time: n,
      subtitle_enabled: t.subtitle_enabled,
      subtitle_text: t.subtitle_text
    };
    return delete i.character_id, delete i.speaker_mode, i;
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
function Mi(t) {
  if (!b(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string")
    return null;
  const e = k(t.type).toLowerCase(), n = $(t.start_time), r = $(t.end_time);
  return !Ti(e) || n == null || r == null || n < 0 || r <= n ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    text: t.text,
    start_time: n,
    end_time: r
  };
}
function yn(t) {
  const e = b(t) ? t : {}, n = k(e.status).toLowerCase() === "confirmed" ? "confirmed" : "draft";
  return {
    status: n,
    confirmed_at: n === "confirmed" ? k(e.confirmed_at) : ""
  };
}
function xt(t, e) {
  const n = k(t).toLowerCase();
  return n === "auto" || n === "off" ? n : e;
}
function Di(t) {
  const e = wr(t);
  if (e)
    return e;
  if (!b(t))
    return "";
  const n = t.type === "doc" ? t : b(t.rich) && t.rich.type === "doc" ? t.rich : null;
  return n ? gn(n).trim() : "";
}
function gn(t) {
  if (!b(t))
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
  return t.content.map(gn).join(e);
}
function Oi(t) {
  return t === "character" || t === "scene" || t === "prop";
}
function Ti(t) {
  return t === "caption" || t === "title" || t === "highlight";
}
function hn(t) {
  return t.text.trim().length > 0;
}
function X(t) {
  return [...new Set(t.map((e) => e.trim()).filter(Boolean))];
}
function $(t) {
  const e = typeof t == "number" ? t : Number.NaN;
  return Number.isFinite(e) ? e : null;
}
const Ri = [
  "title",
  "text",
  "reasoning",
  "progress",
  "error",
  "json"
], Ei = /* @__PURE__ */ new Set([
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
]), Pi = /* @__PURE__ */ new Set([
  "agentabilityplaceholder",
  "agenttaskplaceholder",
  "horizontalrule"
]);
function $i({
  items: t,
  mediaCount: e,
  previewMediaURL: n,
  outputMediaURLs: r = []
}) {
  if (t.length > 1 || e > 1)
    return !0;
  const i = e === 1 && Q(n) !== "" && r.length === 1 && Q(r[0]) === Q(n);
  return t.some(
    (o) => zi(o, i)
  );
}
function zi(t, e) {
  return Et(t) ? Ri.some((n) => dt(t[n])) ? !0 : dt(t.rich) ? !e || ut(t.rich, /* @__PURE__ */ new Set(), 0) : !1 : dt(t);
}
function ut(t, e, n) {
  if (t == null || t === "")
    return !1;
  if (n > 32)
    return !0;
  if (typeof t == "string") {
    const i = t.trim();
    if (!i)
      return !1;
    try {
      return ut(
        JSON.parse(i),
        e,
        n + 1
      );
    } catch {
      return !0;
    }
  }
  if (Array.isArray(t))
    return t.some(
      (i) => ut(i, e, n + 1)
    );
  if (!Et(t) || e.has(t))
    return !0;
  e.add(t);
  const r = Li(t.type);
  if (r === "text")
    return Q(t.text) !== "";
  if (Ei.has(r)) {
    const i = Et(t.attrs) ? t.attrs : void 0;
    return dt(i?.caption);
  }
  return Pi.has(r) ? !0 : Array.isArray(t.content) ? t.content.some(
    (i) => ut(i, e, n + 1)
  ) : !1;
}
function dt(t) {
  return t == null ? !1 : typeof t == "string" ? t.trim() !== "" : Array.isArray(t) ? t.length > 0 : typeof t == "object" ? Object.keys(t).length > 0 : !0;
}
function Et(t) {
  return t != null && typeof t == "object" && !Array.isArray(t);
}
function Li(t) {
  return Q(t).toLowerCase().replace(/[\s_-]+/g, "");
}
function Q(t) {
  return typeof t == "string" ? t.trim() : "";
}
const ji = zn(
  () => import("./space-storyboard-view-G8gQJtr6.js").then((t) => ({
    default: t.StoryboardView
  }))
);
function ms({
  output: t,
  fallback: e = "",
  streaming: n = !1,
  emptyText: r = "暂无内容",
  className: i,
  markdownClassName: o,
  richClassName: s,
  mediaLayout: c = "default",
  mediaGridKind: f,
  storyboardEditable: d = !1,
  storyboardDisabled: l = !1,
  onStoryboardSave: u
}) {
  const m = Je(t, e), y = mi(m), _ = Le(m);
  if (_)
    return /* @__PURE__ */ a(ct, { className: i, children: /* @__PURE__ */ a(Qe, { grid: _ }) });
  if (y)
    return /* @__PURE__ */ a(ct, { className: i, children: /* @__PURE__ */ a(Ln, { fallback: /* @__PURE__ */ a("div", { className: "min-h-24", "aria-busy": "true" }), children: /* @__PURE__ */ a(
      ji,
      {
        storyboard: y,
        editable: d,
        disabled: l,
        onSave: u
      }
    ) }) });
  const w = Bi(m, f);
  return w ? /* @__PURE__ */ a(
    ct,
    {
      className: [i, "ws-media-grid-content"].filter(Boolean).join(" "),
      children: /* @__PURE__ */ a(
        Zr,
        {
          kind: w.kind,
          items: w.items,
          label: e
        }
      )
    }
  ) : /* @__PURE__ */ a(
    $r,
    {
      output: m,
      fallback: e,
      streaming: n,
      emptyText: r,
      className: i,
      markdownClassName: o,
      richClassName: s,
      mediaLayout: c
    }
  );
}
function ps(t, e) {
  if (Fi(t, e))
    return !1;
  const n = $e(t), r = Ve(t), i = _n(e);
  return $i({
    items: r,
    mediaCount: n,
    previewMediaURL: i?.url,
    outputMediaURLs: i ? ze(t, i.kind).map(
      (o) => o.url
    ) : []
  });
}
function Bi(t, e) {
  if (!e)
    return null;
  const n = ze(t, e);
  return n.length > 1 ? { kind: e, items: n } : null;
}
function ys(t) {
  return _n(t)?.kind;
}
function _n(t) {
  if (t?.videoUrl)
    return { kind: "video", url: t.videoUrl };
  if (t?.imageUrl)
    return { kind: "image", url: t.imageUrl };
  if (t?.audioUrl)
    return { kind: "audio", url: t.audioUrl };
}
function Fi(t, e) {
  const n = Pt(t, /* @__PURE__ */ new Set(), 0);
  return !n || !e ? !1 : [
    e.imageUrl,
    e.videoUrl,
    e.audioUrl,
    e.fileUrl
  ].some((r) => String(r || "").trim() === n);
}
function Pt(t, e, n) {
  if (t == null || n > 12)
    return "";
  if (typeof t == "string")
    return t.trim();
  if (Array.isArray(t))
    return t.length === 1 ? Pt(t[0], e, n + 1) : "";
  if (typeof t != "object" || e.has(t))
    return "";
  e.add(t);
  const i = Object.entries(t).filter(
    ([o, s]) => !["type", "kind", "format", "version"].includes(o) && bt(s)
  ).map(([, o]) => o);
  return i.length === 1 ? Pt(i[0], e, n + 1) : "";
}
function Ui(t, e) {
  const n = t.map((d) => ({
    name: String(d.name || ""),
    size: $t(d.size)
  })), r = n.reduce((d, l) => d + l.size, 0), i = n.map((d) => Math.max(d.size, 1)), o = i.reduce((d, l) => d + l, 0), s = n.map(() => 0);
  function c(d, l) {
    const u = n[d];
    if (!u || !e) return;
    const m = n.reduce(
      (_, w, p) => _ + w.size * s[p],
      0
    ), y = i.reduce(
      (_, w, p) => _ + w * s[p],
      0
    );
    e({
      phase: l,
      fileName: u.name,
      fileIndex: d + 1,
      fileCount: n.length,
      loaded: Math.round(m),
      total: r,
      percent: o > 0 ? Math.round(Math.min(1, y / o) * 100) : 100
    });
  }
  function f(d, l, u) {
    n[d] && (s[d] = Math.max(s[d], Gi(l)), c(d, u));
  }
  return {
    start(d) {
      f(d, 0, "preparing");
    },
    report(d, l, u, m = "uploading") {
      const y = n[d];
      if (!y) return;
      const _ = m === "saving" || m === "complete" ? 1 : Vi(l, u, y.size);
      f(d, _, m);
    },
    saving(d) {
      f(d, 1, "saving");
    },
    complete(d) {
      f(d, 1, "complete");
    }
  };
}
function Vi(t, e, n) {
  const r = $t(t), i = $t(e);
  return i > 0 ? r / i : n > 0 ? r / n : 0;
}
function $t(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) && e > 0 ? e : 0;
}
function Gi(t) {
  return Math.max(0, Math.min(Number.isFinite(t) ? t : 0, 1));
}
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/lib/upload"]);
const gt = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!gt || Object.keys(gt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Ki = gt.joinSiteApi, Wi = gt.request, zt = window.DeverFront?.sdk?.getCompatModule("@/lib/upload");
if (!zt || Object.keys(zt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/upload");
const qi = "bot_work", Yi = "神创工作台", vi = /* @__PURE__ */ new Set([
  "txt",
  "md",
  "markdown",
  "mdown",
  "mkd"
]), { uploadFileByRule: pe } = zt;
async function gs(t) {
  if (!pe)
    throw new Error("当前页面缺少上传能力");
  const e = [], n = Ui(
    t.files,
    t.onProgress
  );
  for (const [r, i] of t.files.entries()) {
    n.start(r);
    const o = Zi(t.kind) || Ji(i), s = Number(t.ruleID || 0) || Xi(o), c = o === "text" ? await i.text() : void 0, f = await pe(s, i, {
      kind: o,
      bizKey: qi,
      bizName: Yi,
      reportError: !1,
      onProgress: (u, m) => n.report(r, u, m)
    });
    n.saving(r);
    const d = Number(f.id || 0), [l] = await Hi({
      teamID: t.teamID,
      projectID: t.projectID,
      files: [f],
      textContents: c === void 0 ? void 0 : /* @__PURE__ */ new Map([[d, c]])
    });
    if (!l)
      throw new Error(`${i.name} 保存到资产库失败`);
    e.push({ sourceFile: i, uploadedFile: f, asset: l }), n.complete(r);
  }
  return e;
}
async function Hi(t) {
  const e = [], n = /* @__PURE__ */ new Set();
  for (const r of t.files) {
    const i = Number(r.id || 0);
    if (!Number.isFinite(i) || i <= 0)
      throw new Error("上传文件标识无效");
    if (n.has(i))
      continue;
    const o = await Wi(
      Ki("workbench/upload_save_asset"),
      "post",
      {
        team_id: t.teamID,
        project_id: t.projectID || void 0,
        file_id: i,
        text_content: t.textContents?.get(i)
      },
      { reportError: !1 }
    );
    if (!wn(o))
      throw new Error(
        String(o?.message || o?.msg || "保存上传资产失败")
      );
    const s = o?.data?.asset;
    if (!s || typeof s != "object" || Array.isArray(s))
      throw new Error("保存上传资产结果为空");
    n.add(i), e.push(s);
  }
  return e;
}
function Ji(t) {
  const e = String(t.type || "").toLowerCase();
  return e.startsWith("image/") ? "image" : e.startsWith("video/") ? "video" : e.startsWith("audio/") ? "audio" : ["text/plain", "text/markdown", "text/x-markdown"].includes(e) || vi.has(Qi(t.name)) ? "text" : "file";
}
function Zi(t) {
  const e = String(t || "").toLowerCase();
  return ["image", "video", "audio", "text", "file"].includes(e) ? e : "";
}
function Xi(t) {
  return t === "image" ? 1 : t === "video" ? 2 : t === "audio" ? 3 : 7;
}
function Qi(t) {
  const e = String(t || "").trim().toLowerCase(), n = e.lastIndexOf(".");
  return n >= 0 ? e.slice(n + 1) : "";
}
export {
  es as $,
  jo as A,
  ie as B,
  ms as C,
  Br as D,
  en as E,
  pi as F,
  rn as G,
  si as H,
  ss as I,
  os as J,
  gi as K,
  cn as L,
  oi as M,
  rs as N,
  as as O,
  _i as P,
  an as Q,
  is as R,
  qo as S,
  tn as T,
  ei as U,
  Xo as V,
  us as W,
  ai as X,
  Wo as Y,
  ci as Z,
  yi as _,
  hi as a,
  ao as a$,
  Zo as a0,
  Yt as a1,
  Ko as a2,
  Qo as a3,
  ts as a4,
  Jo as a5,
  ds as a6,
  wo as a7,
  So as a8,
  Vt as a9,
  tr as aA,
  Bi as aB,
  Fo as aC,
  xo as aD,
  Oo as aE,
  br as aF,
  Yn as aG,
  xe as aH,
  Lo as aI,
  Po as aJ,
  re as aK,
  Ro as aL,
  $r as aM,
  Tr as aN,
  $o as aO,
  go as aP,
  mo as aQ,
  co as aR,
  zo as aS,
  ho as aT,
  fo as aU,
  lo as aV,
  uo as aW,
  Gn as aX,
  Wn as aY,
  Kn as aZ,
  so as a_,
  qt as aa,
  Ao as ab,
  b as ac,
  _o as ad,
  No as ae,
  ko as af,
  Yo as ag,
  wr as ah,
  Ft as ai,
  P as aj,
  gs as ak,
  un as al,
  ls as am,
  fs as an,
  k as ao,
  ps as ap,
  ys as aq,
  Gr as ar,
  ue as as,
  cr as at,
  Le as au,
  Eo as av,
  Co as aw,
  qn as ax,
  Mo as ay,
  Io as az,
  To as b,
  yo as b0,
  po as b1,
  xr as b2,
  Ui as b3,
  bo as b4,
  Wt as b5,
  Or as b6,
  Ve as b7,
  cs as b8,
  Pe as b9,
  Sr as ba,
  Ce as bb,
  ze as c,
  Do as d,
  wi as e,
  bi as f,
  Si as g,
  Ho as h,
  ns as i,
  Hi as j,
  Yi as k,
  qi as l,
  Qe as m,
  Fr as n,
  Bo as o,
  mi as p,
  kr as q,
  jr as r,
  vo as s,
  bt as t,
  et as u,
  ii as v,
  Vo as w,
  Go as x,
  Uo as y,
  on as z
};
