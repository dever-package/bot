import { m as Q, c as Et } from "./in-flight-request-DlB1DJg0.js";
import { s as C, k as tt, a as z, c as b, r as y, h as jt, m as we } from "./site-config-BVY1isir.js";
import { m as _e } from "./upload-5FgQdFzM.js";
import { a as o, j as d, F as xe } from "./_commonjsHelpers-CTFd9u1x.js";
import { F as lt, ai as Ne, az as Se, b7 as Ie, b8 as Ce, N as $t, D as Ae, L as at, j as Pt, c as Ut, X as De, a6 as Me, a4 as ke, b9 as Oe, o as Te, p as ze, Q as P, z as Re } from "./vendor-icons-Cc7Kl3It.js";
import { m as et } from "./content-view-DKqPlRti.js";
import { r as Le, m as Ee, V as Bt, a as _t, R as je, M as $e } from "./media-inspector-gallery-nBFOIame.js";
import { u as Ft, l as k, o as L, d as Pe } from "./react-C7Xtl8sB.js";
import { c as Ue } from "./preloadable-PCKj9Z7v.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./storyboard-grid-view-BixG-Q6z.css", import.meta.url).href]);
const A = Q.joinSiteApi, D = Q.request, Be = Et(), Fe = Et();
function Ar(t, e, n = "") {
  const r = JSON.stringify({
    requestScopeKey: n,
    teamID: t,
    catalogOptions: e || null
  });
  return Be(r, async () => {
    const i = D(
      A("workbench/asset_filters"),
      "get",
      { team_id: t }
    ), [s, a] = e ? [null, await i] : await Promise.all([
      D(A("workbench/catalog"), "get", {
        team_id: t
      }),
      i
    ]), c = e ? {
      powers: e.tools,
      roles: e.dialogues,
      asset_cates: e.assetCates
    } : C(s, "加载团队资产配置失败"), u = C(a, "加载资产筛选项失败");
    return {
      projects: z(u.projects).map(dt).filter(B),
      tools: xt(c.powers, u.tools),
      dialogues: xt(c.roles, u.dialogues),
      assetCates: z(c.asset_cates).map(Je).filter(B)
    };
  });
}
function Dr(t) {
  const e = {
    ...t,
    pageSize: t.pageSize || 24,
    view: t.view || "assets",
    contentMode: t.contentMode || "preview"
  };
  return Fe(JSON.stringify(e), async () => {
    const n = await D(A("workbench/assets"), "get", {
      team_id: e.teamID,
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
    }), r = C(n, "加载资产失败");
    return {
      items: z(r.items).map(F).filter(B),
      page: b(r.page, e.page),
      pageSize: b(r.page_size, e.pageSize),
      total: tt(r.total),
      hasMore: !!r.has_more
    };
  });
}
async function Mr(t, e) {
  const n = await D(A("workbench/asset_detail"), "get", {
    team_id: t,
    asset_id: e
  });
  return Ve(C(n, "加载资产详情失败"));
}
async function kr(t) {
  const e = await D(A("workbench/asset_versions"), "get", {
    team_id: t.teamID,
    asset_id: t.assetID,
    page: t.page,
    page_size: t.pageSize || 20
  }), n = C(e, "加载资产版本失败");
  return {
    items: z(n.items).map(nt).filter(B),
    total: tt(n.total),
    hasMore: !!n.has_more
  };
}
async function Or(t) {
  const e = await D(A("workbench/asset_version"), "get", {
    team_id: t.teamID,
    asset_id: t.assetID,
    version_id: t.versionID
  }), n = C(e, "加载资产版本失败");
  return nt(n.version);
}
async function Tr(t) {
  const e = await D(
    A("workbench/asset_set_current"),
    "post",
    {
      team_id: t.teamID,
      asset_id: t.assetID,
      version_id: t.versionID
    }
  ), n = C(e, "设置当前版本失败");
  return F(n.asset);
}
async function zr(t) {
  const e = await D(A("workbench/asset_rename"), "post", {
    team_id: t.teamID,
    asset_id: t.assetID,
    name: t.name
  }), n = C(e, "修改资产标题失败");
  return F(n.asset);
}
async function Rr(t) {
  const e = await D(A("workbench/asset_delete"), "post", {
    team_id: t.teamID,
    asset_id: t.assetID
  });
  C(e, "删除资产失败");
}
async function Lr(t) {
  const e = await D(A("workbench/asset_restore"), "post", {
    team_id: t.teamID,
    asset_id: t.assetID
  }), n = C(e, "恢复资产失败");
  return F(n.asset);
}
function Ve(t) {
  return {
    asset: F(t.asset),
    versions: z(t.versions).map(nt).filter(B),
    versionTotal: tt(t.version_total),
    hasMore: !!t.has_more
  };
}
function F(t) {
  const e = jt(t?.version) ? nt(t.version) : null;
  return {
    id: b(t?.id),
    projectID: b(t?.project_id),
    bodyID: b(t?.body_id),
    teamID: b(t?.team_id),
    flowID: b(t?.flow_id),
    assetCateID: b(t?.asset_cate_id),
    collectionID: b(t?.collection_id),
    nodeKey: y(t?.node_key),
    sourceType: y(t?.source_type),
    sourceID: b(t?.source_id),
    sourceName: y(t?.source_name),
    name: y(t?.name) || "未命名资产",
    nameMode: y(t?.name_mode) === "manual" ? "manual" : "auto",
    kind: y(t?.kind) || "text",
    role: y(t?.role) || "material",
    versionID: b(t?.version_id),
    status: y(t?.status),
    summary: y(t?.summary || e?.summary),
    collectionCount: tt(t?.collection_count),
    collectionPreviews: z(t?.collection_previews).map(Ge).filter((n) => !!n),
    createdAt: y(t?.created_at),
    deletedAt: y(t?.deleted_at),
    version: e
  };
}
function Ge(t) {
  const e = y(t?.kind);
  return e !== "image" && e !== "video" || !t?.content ? null : {
    id: b(t?.id),
    kind: e,
    content: t.content
  };
}
function nt(t) {
  return {
    id: b(t?.id),
    assetID: b(t?.asset_id),
    runID: b(t?.run_id),
    nodeRunID: b(t?.node_run_id),
    releaseID: b(t?.release_id),
    requestID: y(t?.request_id),
    nodeKey: y(t?.node_key),
    source: jt(t?.source) ? t.source : {},
    version: b(t?.version, 1),
    content: t?.content,
    summary: y(t?.summary),
    createdAt: y(t?.created_at),
    updatedAt: y(t?.updated_at || t?.created_at)
  };
}
function dt(t) {
  return {
    id: b(t?.id),
    name: y(t?.name) || "未命名"
  };
}
function xt(...t) {
  const e = [], n = /* @__PURE__ */ new Set();
  for (const r of t)
    for (const i of z(r)) {
      const s = dt(i);
      s.id <= 0 || n.has(s.id) || (n.add(s.id), e.push(s));
    }
  return e;
}
function Je(t) {
  return {
    ...dt(t),
    kind: y(t?.kind) || "text",
    cardinality: y(t?.cardinality) || "single"
  };
}
function B(t) {
  return t.id > 0;
}
const Ke = [
  { key: "project", label: "创作" },
  { key: "tool", label: "工具" },
  { key: "dialogue", label: "对话" },
  { key: "upload", label: "上传" }
], We = [
  { key: "work", label: "作品" },
  { key: "material", label: "素材" }
], ve = [
  { key: "collection", label: "集合" },
  { key: "text", label: "文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "richtext", label: "富文本" },
  { key: "file", label: "文件" }
];
function Er(t, e = {}) {
  const n = e.fallback || "资产", r = ut(Ke, t, n);
  return e[t] || r;
}
function jr(t) {
  return ut(We, t, "素材");
}
function Vt(t) {
  return ut(ve, t, "资产");
}
function $r(t) {
  if (t.length === 0 || t.some((r) => ["text", "richtext", "file"].includes(r)))
    return;
  const e = {
    image: "image/*",
    audio: "audio/*",
    video: "video/*"
  }, n = t.map((r) => e[r]).filter((r) => !!r);
  return n.length > 0 ? Array.from(new Set(n)).join(",") : void 0;
}
function ut(t, e, n) {
  return t.find((r) => r.key === e)?.label || n;
}
function He(t) {
  if (typeof t != "string")
    return t;
  const e = t.trim();
  if (!ft(e))
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
function Pr(t) {
  return w(t) ? t : {};
}
function Ur(t) {
  return typeof t == "string" ? t.trim() : "";
}
function Br(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) ? e : 0;
}
function Fr(t) {
  if (t == null || t === "")
    return;
  const e = Number(t);
  return Number.isFinite(e) ? e : void 0;
}
function Gt(t) {
  const e = String(t || "").trim(), n = qe(e), r = tn(n);
  for (const i of Kt([e, n, r])) {
    const s = He(i);
    if (s !== i)
      return s;
    const a = Xe(i);
    if (a !== i)
      return a;
  }
  return t;
}
function Vr(t) {
  const e = String(t || "").trim();
  for (const n of Jt(e)) {
    const r = Gt(n);
    if (r !== n)
      return r;
  }
  return t;
}
function rt(t) {
  const e = [];
  for (const n of Jt(
    String(t || "").trim()
  )) {
    const r = Gt(n);
    r !== n && e.push(r);
  }
  return e;
}
function qe(t) {
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
      e += Qe(i);
      continue;
    }
    e += i;
  }
  return e;
}
function Jt(t) {
  const e = [t];
  for (const n of t.matchAll(/```(?:json|storyboard)?\s*([\s\S]*?)```/gi))
    e.push(String(n[1] || "").trim());
  return e.push(...Ye(t)), Kt(e);
}
function Ye(t) {
  const e = [];
  for (let n = 0; n < t.length; n += 1) {
    const r = t[n];
    if (r !== "{" && r !== "[")
      continue;
    const i = Ze(t, n);
    i && (e.push(i), n += i.length - 1);
  }
  return e;
}
function Ze(t, e) {
  const n = [];
  let r = !1, i = !1;
  for (let s = e; s < t.length; s += 1) {
    const a = t[s];
    if (i) {
      i = !1;
      continue;
    }
    if (r && a === "\\") {
      i = !0;
      continue;
    }
    if (a === '"') {
      r = !r;
      continue;
    }
    if (r)
      continue;
    if (a === "{" || a === "[") {
      n.push(a);
      continue;
    }
    if (a !== "}" && a !== "]")
      continue;
    const c = a === "}" ? "{" : "[";
    if (n.pop() !== c)
      return "";
    if (n.length === 0)
      return t.slice(e, s + 1).trim();
  }
  return "";
}
function ft(t) {
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function Xe(t) {
  if (!t.startsWith('"') || !t.endsWith('"'))
    return t;
  try {
    const e = JSON.parse(t);
    return typeof e == "string" ? e : t;
  } catch {
    return t;
  }
}
function Qe(t) {
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
function tn(t) {
  const e = t.trim();
  return !e.includes('\\"') || !e.startsWith("{") && !e.startsWith("[") ? t : e.replace(/\\"/g, '"');
}
function Kt(t) {
  const e = /* @__PURE__ */ new Set();
  return t.filter((n) => {
    const r = String(n || "").trim();
    return !r || e.has(r) ? !1 : (e.add(r), !0);
  });
}
function Gr(...t) {
  return t.find(
    (e) => e != null
  );
}
function Jr(t) {
  try {
    return JSON.stringify(t);
  } catch {
    return "";
  }
}
const en = {
  audio: "editorMediaAudio",
  image: "editorMediaImage",
  mediaAudio: "editorMediaAudio",
  mediaImage: "editorMediaImage",
  mediaVideo: "editorMediaVideo",
  video: "editorMediaVideo"
}, Wt = [
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
function Kr(t) {
  const e = vt(t);
  return e.length > 120 ? `${e.slice(0, 120)}...` : e;
}
function vt(t) {
  return V(t).replace(/\s+/g, " ").trim();
}
function nn(t) {
  if (typeof t != "string")
    return "";
  const e = t.trim();
  if (!an(e))
    return "";
  const n = e.search(/"rich"\s*:/), r = n >= 0 ? e.slice(n) : e, i = [], s = /"text"\s*:\s*"((?:\\.|[^"\\])*)"/g;
  let a = null;
  for (; (a = s.exec(r)) !== null; ) {
    const c = cn(a[1]).trim();
    c && i.push(c);
  }
  return i.join(" ").replace(/\s+/g, " ").trim();
}
function mt(t) {
  const e = $(t, /* @__PURE__ */ new Set());
  return pt(e) ? e : null;
}
function Wr(t) {
  try {
    return vt(t);
  } catch {
    return "";
  }
}
function vr(t) {
  try {
    return mt(t);
  } catch {
    return null;
  }
}
function V(t) {
  if (typeof t == "string") {
    const r = t.trim();
    if (ft(r)) {
      const i = Zt(r);
      if (i !== void 0)
        return V(i).trim();
    }
    return nn(r) || t;
  }
  if (Array.isArray(t))
    return t.map(V).filter(Boolean).join(" ");
  if (!w(t))
    return "";
  const e = mt(t);
  if (e)
    return Yt(e);
  const n = [
    typeof t.text == "string" ? t.text : "",
    typeof t.markdown == "string" ? t.markdown : ""
  ];
  for (const r of Wt)
    t[r] != null && n.push(V(t[r]));
  return n.filter(Boolean).join(" ");
}
function $(t, e) {
  if (typeof t == "string") {
    const r = t.trim();
    if (!ft(r))
      return null;
    const i = Zt(r);
    return i === void 0 ? null : $(i, e);
  }
  if (Array.isArray(t)) {
    const r = Nt({ type: "doc", content: t });
    if (pt(r))
      return r;
    for (const i of t) {
      const s = $(i, e);
      if (s)
        return s;
    }
    return null;
  }
  if (!w(t) || e.has(t))
    return null;
  e.add(t);
  const n = Nt(t);
  if (n)
    return n;
  if (String(t.format || "").toLowerCase() === "rich_json" && t.rich != null) {
    const r = $(t.rich, e);
    if (r)
      return r;
  }
  for (const r of Wt) {
    if (t[r] == null)
      continue;
    const i = $(t[r], e);
    if (i)
      return i;
  }
  return null;
}
function Nt(t) {
  return !w(t) || qt(t.type) !== "doc" ? null : {
    type: "doc",
    attrs: w(t.attrs) ? t.attrs : void 0,
    content: Ht(t.content)
  };
}
function Ht(t) {
  return Array.isArray(t) ? t.map(rn).filter((e) => !!e) : [];
}
function rn(t) {
  if (!w(t))
    return null;
  const e = qt(t.type) || sn(t);
  if (!e)
    return null;
  const n = { type: e }, r = w(t.attrs) ? { ...t.attrs } : {};
  if (e === "heading" && v(r.level) <= 0) {
    const a = v(t.level);
    a > 0 && (r.level = a);
  }
  Object.keys(r).length > 0 && (n.attrs = r);
  const i = on(t.marks);
  if (i.length > 0 && (n.marks = i), e === "text") {
    const a = E(t.text);
    return a ? (n.text = a, n) : null;
  }
  const s = Ht(t.content);
  return s.length > 0 && (n.content = s), n;
}
function sn(t) {
  if (typeof t.text == "string")
    return "text";
  const e = w(t.attrs) ? t.attrs : {};
  return v(e.level) > 0 || v(t.level) > 0 ? "heading" : "";
}
function on(t) {
  return Array.isArray(t) ? t.map((e) => {
    if (!w(e))
      return null;
    const n = E(e.type);
    return n ? {
      type: n,
      attrs: w(e.attrs) ? e.attrs : void 0
    } : null;
  }).filter(
    (e) => !!e
  ) : [];
}
function qt(t) {
  const e = E(t);
  return en[e] || e;
}
function Yt(t) {
  return t ? t.type === "text" ? t.text || "" : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? E(t.attrs?.alt || t.attrs?.title || t.attrs?.src) : (t.content || []).map(Yt).filter(Boolean).join(" ") : "";
}
function pt(t) {
  return t ? t.type === "text" ? !!E(t.text) : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? !!E(t.attrs?.src) : (t.content || []).some(pt) : !1;
}
function Zt(t) {
  try {
    return JSON.parse(t);
  } catch {
    return;
  }
}
function an(t) {
  return t.includes("rich_json") || t.includes('"rich"') || t.includes("agent_run_id") || t.includes("node_run_id");
}
function cn(t) {
  try {
    return JSON.parse(`"${t}"`);
  } catch {
    return t.replace(/\\"/g, '"').replace(/\\n/g, `
`).replace(/\\t/g, "	").replace(/\\\\/g, "\\");
  }
}
function v(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) ? e : 0;
}
function E(t) {
  return t == null ? "" : String(t).trim();
}
const H = [
  { value: "auto", label: "自动", columns: 0, rows: 0, capacity: 9 },
  { value: "2x2", label: "2×2", columns: 2, rows: 2, capacity: 4 },
  { value: "3x2", label: "3×2", columns: 3, rows: 2, capacity: 6 },
  { value: "3x3", label: "3×3", columns: 3, rows: 3, capacity: 9 }
], ln = new Set(
  H.map((t) => t.value)
);
function gt(t) {
  const e = String(t || "").trim().toLowerCase();
  return ln.has(e) ? e : "auto";
}
function Xt(t) {
  const e = gt(t);
  return H.find((n) => n.value === e) || H[0];
}
function dn(t, e) {
  const n = Xt(t), r = Math.max(0, Math.trunc(Number(e) || 0));
  return n.value !== "auto" ? n : r === 0 || r > 6 ? { columns: 3, rows: 3, capacity: 9 } : r > 4 ? { columns: 3, rows: 2, capacity: 6 } : r > 2 ? { columns: 2, rows: 2, capacity: 4 } : { columns: 2, rows: 1, capacity: 2 };
}
const un = 50, fn = {
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
}, mn = [
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
function ht(t) {
  return Object.fromEntries(
    t.map((e) => [e, /* @__PURE__ */ new Map()])
  );
}
function q(t, e, n = {}) {
  const r = {
    media: t,
    enabledKinds: Object.keys(t),
    seen: n.seen || /* @__PURE__ */ new Set(),
    requestedKind: n.kind
  };
  M(e, r, 0, n.kind);
}
function pn(t, e) {
  const n = ht([e]);
  return q(n, t, { kind: e }), Array.from(n[e].values());
}
function M(t, e, n, r, i = "") {
  if (t == null || n > 12)
    return;
  if (Array.isArray(t)) {
    const f = t.length > 1 ? "" : i;
    t.forEach(
      (l) => M(
        l,
        e,
        n + 1,
        r,
        f
      )
    );
    return;
  }
  if (typeof t == "string") {
    const f = rt(t);
    if (f.length > 0) {
      f.forEach(
        (h) => M(
          h,
          e,
          n + 1,
          r,
          i
        )
      );
      return;
    }
    const l = r || e.requestedKind || bn(t);
    l && e.media[l] && Qt(t) && gn(
      e.media,
      l,
      t.trim(),
      i
    );
    return;
  }
  if (typeof t != "object" || e.seen.has(t))
    return;
  e.seen.add(t);
  const s = t, a = w(s.attrs) ? s.attrs : void 0, c = yn(
    s.type,
    s.kind,
    s.media_type,
    s.mediaType,
    s.mime
  ), u = hn(
    s,
    a,
    i
  ), m = r || e.requestedKind;
  if (m && e.media[m] && (!c || c === m))
    for (const f of St(s, m))
      M(
        f,
        e,
        n + 1,
        m,
        u
      );
  for (const f of e.enabledKinds) {
    const l = fn[f];
    for (const h of l.direct)
      M(
        s[h],
        e,
        n + 1,
        f,
        u
      );
    for (const h of l.collections)
      M(
        s[h],
        e,
        n + 1,
        f,
        u
      );
  }
  if (c && e.media[c]) {
    for (const f of St(s, c))
      M(
        f,
        e,
        n + 1,
        c,
        u
      );
    M(
      s.attrs,
      e,
      n + 1,
      c,
      u
    );
  }
  for (const f of mn)
    M(
      s[f],
      e,
      n + 1
    );
}
function St(t, e) {
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
function gn(t, e, n, r) {
  const i = t[e];
  if (!i)
    return;
  const s = i.get(n);
  if (s?.thumbnail || !r) {
    s || i.set(n, { url: n });
    return;
  }
  i.set(n, { url: n, thumbnail: r });
}
function hn(t, e, n) {
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
    if (typeof r == "string" && Qt(r))
      return r.trim();
  return "";
}
function yn(...t) {
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
function bn(t) {
  const e = t.trim();
  if (/^data:image\//i.test(e) || /\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i.test(e))
    return "image";
  if (/^data:video\//i.test(e) || /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(e))
    return "video";
  if (/^data:audio\//i.test(e) || /\.(mp3|wav|ogg|m4a|aac)(?:[?#].*)?$/i.test(e))
    return "audio";
}
function Qt(t) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(t.trim());
}
const yt = ["image", "video", "audio"], wn = 64, _n = 128 * 1024, Y = /* @__PURE__ */ Symbol("content-output-cache-miss"), It = ee(), Ct = ee(), xn = et, Nn = xn.normalizeEnergonOutput;
function T(...t) {
  for (const e of t)
    if (typeof e == "string" && e.trim())
      return e.trim();
  return "";
}
function Sn(t) {
  const e = U(
    t,
    ["lyrics", "lyric", "lrc", "song_lyrics", "songLyrics"],
    /* @__PURE__ */ new Set(),
    0
  );
  if (e)
    return { label: "歌词", text: e };
  const n = U(
    t,
    ["text"],
    /* @__PURE__ */ new Set(),
    0
  );
  return n ? { label: "创作内容", text: n } : null;
}
function U(t, e, n, r) {
  if (t == null || r > 12)
    return "";
  if (typeof t == "string") {
    for (const i of rt(t)) {
      const s = U(i, e, n, r + 1);
      if (s)
        return s;
    }
    return "";
  }
  if (Array.isArray(t)) {
    for (const i of t) {
      const s = U(i, e, n, r + 1);
      if (s)
        return s;
    }
    return "";
  }
  if (!w(t) || n.has(t))
    return "";
  n.add(t);
  for (const i of e) {
    const s = G(t[i], r + 1);
    if (s)
      return s;
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
    const s = U(t[i], e, n, r + 1);
    if (s)
      return s;
  }
  return "";
}
function G(t, e) {
  if (t == null || e > 12)
    return "";
  if (typeof t == "string") {
    const n = t.trim();
    if (!n || /^(https?:\/\/|\/|data:|blob:)/i.test(n))
      return "";
    const r = rt(n);
    return r.length > 0 ? r.map((i) => G(i, e + 1)).filter(Boolean).join(`
`) : n;
  }
  if (Array.isArray(t))
    return t.map((n) => G(n, e + 1)).filter(Boolean).join(`
`);
  if (!w(t))
    return "";
  for (const n of ["text", "content", "line", "lines", "value"]) {
    const r = G(t[n], e + 1);
    if (r)
      return r;
  }
  return "";
}
function Hr(t) {
  const e = te(t);
  return !e || e.hasMedia ? "" : e.markdown;
}
function te(t) {
  const e = Ln(t);
  return !e || !se(e) ? null : {
    markdown: e.content.map(oe).join(`

`).trim(),
    plainText: e.content.map(ae).join(`

`).trim(),
    hasMedia: ce(e)
  };
}
function In(t) {
  return /(^|\n)\s*(#{1,6}\s|[-*+]\s|>\s|\d+\.\s|```)/m.test(t) || /(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|`[^`]+`)/.test(t);
}
function qr(t) {
  return Cn(t).length > 0;
}
function Cn(t) {
  const e = it(t);
  return yt.filter((n) => e[n].size > 0);
}
function An(t) {
  const e = it(t);
  return yt.reduce(
    (n, r) => n + e[r].size,
    0
  );
}
function Yr(t, e) {
  return Array.from(it(t)[e].keys());
}
function Zr(t, e) {
  return Array.from(it(t)[e].values());
}
function Dn(t) {
  const e = Mn(t);
  return e ? Array.from(
    new Set(e.frames.map((n) => n.image.trim()).filter(Boolean))
  ) : [];
}
function Mn(t) {
  const e = ne(Ct, t);
  return e !== Y ? e : re(
    Ct,
    t,
    K(t, /* @__PURE__ */ new Set(), 0)
  );
}
function kn(t, e) {
  const n = e.trim().toLowerCase();
  return n ? J(t, n, /* @__PURE__ */ new Set(), 0) : !1;
}
function Xr(...t) {
  let e, n, r = 0;
  for (const i of t) {
    if (!bt(i))
      continue;
    e === void 0 && (e = i);
    const s = An(i);
    s > r && (n = i, r = s);
  }
  return r > 0 ? n : e;
}
function bt(t) {
  return t == null || t === "" ? !1 : Array.isArray(t) ? t.length > 0 : typeof t == "object" ? Object.keys(t).length > 0 : !0;
}
function it(t) {
  const e = ne(It, t);
  if (e !== Y)
    return e;
  const n = ht(yt), r = Dn(t), i = /* @__PURE__ */ new Set();
  for (const s of On(t))
    q(n, s, { seen: i });
  return q(n, t), r.length > 0 && (n.image = new Map(
    r.map((s) => [s, { url: s, thumbnail: s }])
  )), re(It, t, n);
}
function ee() {
  return {
    objects: /* @__PURE__ */ new WeakMap(),
    strings: /* @__PURE__ */ new Map()
  };
}
function ne(t, e) {
  if (e && typeof e == "object")
    return t.objects.has(e) ? t.objects.get(e) : Y;
  if (!ie(e) || !t.strings.has(e))
    return Y;
  const n = t.strings.get(e);
  return t.strings.delete(e), t.strings.set(e, n), n;
}
function re(t, e, n) {
  if (e && typeof e == "object")
    return t.objects.set(e, n), n;
  if (!ie(e))
    return n;
  for (t.strings.delete(e), t.strings.set(e, n); t.strings.size > wn; ) {
    const r = t.strings.keys().next().value;
    if (typeof r != "string")
      break;
    t.strings.delete(r);
  }
  return n;
}
function ie(t) {
  return typeof t == "string" && t.length <= _n;
}
function On(t) {
  if (!bt(t))
    return [];
  const e = Nn?.(t);
  return Array.isArray(e) && e.length > 0 ? e : Array.isArray(t) ? t : [t];
}
function J(t, e, n, r) {
  return t == null || r > 12 ? !1 : typeof t == "string" ? rt(t).some(
    (i) => J(i, e, n, r + 1)
  ) : Array.isArray(t) ? t.some(
    (i) => J(i, e, n, r + 1)
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
    (i) => J(i, e, n, r + 1)
  ));
}
function K(t, e, n) {
  if (t == null || n > 12)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    if (!i || !i.startsWith("{") && !i.startsWith("["))
      return null;
    try {
      return K(JSON.parse(i), e, n + 1);
    } catch {
      return null;
    }
  }
  if (Array.isArray(t)) {
    for (const i of t) {
      const s = K(i, e, n + 1);
      if (s)
        return s;
    }
    return null;
  }
  if (!w(t) || e.has(t))
    return null;
  e.add(t);
  const r = Tn(t);
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
    const s = K(t[i], e, n + 1);
    if (s)
      return s;
  }
  return null;
}
function Tn(t) {
  if (String(t.type || "").trim().toLowerCase() !== "storyboard_grid" || !Array.isArray(t.frames))
    return null;
  const e = t.frames.map(zn).filter((n) => !!n).sort((n, r) => n.order - r.order);
  return e.length < 2 || e.length > un ? null : {
    type: "storyboard_grid",
    version: Math.max(1, Math.trunc(Number(t.version) || 1)),
    title: T(t.title, "宫格图片"),
    summary: T(t.summary),
    frames: e
  };
}
function zn(t, e) {
  if (!w(t))
    return null;
  const n = Math.max(1, Math.trunc(Number(t.order) || e + 1));
  return {
    id: T(t.id, `frame-${String(n).padStart(2, "0")}`),
    order: n,
    title: T(
      t.title,
      `画面 ${String(n).padStart(2, "0")}`
    ),
    description: T(t.description),
    prompt: T(t.prompt),
    status: T(t.status),
    image: Rn(
      t.image,
      t.image_url,
      t.imageUrl
    ),
    error: T(t.error),
    assetID: At(t.asset_id, t.assetId, t.assetID),
    assetVersionID: At(
      t.asset_version_id,
      t.assetVersionId,
      t.assetVersionID
    )
  };
}
function Rn(...t) {
  for (const e of t) {
    const n = ht(["image"]);
    q(n, e, { kind: "image" });
    const r = n.image.values().next().value;
    if (r?.url)
      return r.url;
  }
  return "";
}
function At(...t) {
  for (const e of t) {
    const n = Math.trunc(Number(e) || 0);
    if (n > 0)
      return n;
  }
  return 0;
}
function Ln(t) {
  return w(t) ? t.type === "doc" && Array.isArray(t.content) ? t : w(t.rich) && t.rich.type === "doc" && Array.isArray(t.rich.content) ? t.rich : null : null;
}
function se(t) {
  return w(t) ? t.type === "text" ? !Array.isArray(t.marks) || t.marks.length === 0 : t.type === "hardBreak" ? !0 : st(t) ? !!le(t) : t.type !== "doc" && t.type !== "paragraph" ? !1 : Array.isArray(t.content) && t.content.every(se) : !1;
}
function oe(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : st(t) ? `![${En(
    String(t.attrs?.alt || t.attrs?.caption || "图片")
  )}](<${jn(le(t))}>)` : Array.isArray(t.content) ? t.content.map(oe).join("") : "";
}
function ae(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : st(t) ? "" : Array.isArray(t.content) ? t.content.map(ae).join("") : "";
}
function ce(t) {
  return st(t) || !!t.content?.some((e) => ce(e));
}
function st(t) {
  return ["image", "mediaImage", "editorMediaImage"].includes(
    String(t.type || "")
  );
}
function le(t) {
  return String(t.attrs?.src || "").trim();
}
function En(t) {
  return t.replace(/([\\\[\]])/g, "\\$1");
}
function jn(t) {
  return t.replace(/</g, "%3C").replace(/>/g, "%3E");
}
const de = {
  image: "images",
  audio: "audios",
  video: "videos",
  file: "files"
};
function ue(t, e) {
  const n = de[t], r = n ? wt(e, t) : [];
  if (n && r.length > 0)
    return { [n]: r };
  const i = mt(e);
  if (!i)
    return e;
  const s = te(i);
  return s && (t === "text" || In(s.plainText)) ? { text: s.markdown } : { rich: i };
}
function $n(t, e) {
  return wt(t, e)[0] || "";
}
function wt(t, e) {
  return fe(t, e).map((n) => n.url);
}
function fe(t, e) {
  return Pn(e) ? pn(t, e) : [];
}
function Qr(t, e) {
  if (!de[e])
    return 0;
  const n = wt(t, e).length;
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
function Pn(t) {
  return t === "image" || t === "video" || t === "audio" || t === "file";
}
function Z(t, e = 0) {
  if (e > 8 || t == null) return "";
  if (typeof t == "string") return me(t) ? "" : t.trim();
  if (Array.isArray(t))
    return t.map((r) => Z(r, e + 1)).filter(Boolean)[0] || "";
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
    const i = Z(n[r], e + 1);
    if (i) return i;
  }
  return "";
}
function ti(t) {
  const e = t?.source?.prompt;
  return typeof e == "string" ? e.trim() : "";
}
function Un(t) {
  const e = $n(t, "file"), n = W(t) || Le(e), r = n.match(/\.([a-z0-9]{1,10})$/i)?.[1] || "";
  return { url: e, name: n, extension: r };
}
function W(t, e = 0) {
  if (t == null || e > 8) return "";
  if (typeof t == "string") {
    const r = t.trim();
    return me(r) ? "" : r;
  }
  if (Array.isArray(t)) {
    for (const r of t) {
      const i = W(r, e + 1);
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
    const i = W(n[r], e + 1);
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
    const i = W(n[r], e + 1);
    if (i) return i;
  }
  return "";
}
function me(t) {
  return /^(https?:\/\/|\/|data:|blob:)/.test(t.trim());
}
const Bn = Q.joinSiteApi, Fn = Q.request, Vn = "bot_work", Gn = "神创工作台", Jn = /* @__PURE__ */ new Set([
  "txt",
  "md",
  "markdown",
  "mdown",
  "mkd"
]), { uploadFileByRule: Dt } = _e;
async function ei(t) {
  if (!Dt)
    throw new Error("当前页面缺少上传能力");
  const e = [];
  for (const n of t.files) {
    const r = vn(t.kind) || Wn(n), i = Number(t.ruleID || 0) || Hn(r), s = r === "text" ? await n.text() : void 0, a = await Dt(i, n, {
      kind: r,
      bizKey: Vn,
      bizName: Gn,
      reportError: !1
    }), c = Number(a.id || 0), [u] = await Kn({
      teamID: t.teamID,
      projectID: t.projectID,
      files: [a],
      textContents: s === void 0 ? void 0 : /* @__PURE__ */ new Map([[c, s]])
    });
    if (!u)
      throw new Error(`${n.name} 保存到资产库失败`);
    e.push({ sourceFile: n, uploadedFile: a, asset: u });
  }
  return e;
}
async function Kn(t) {
  const e = [], n = /* @__PURE__ */ new Set();
  for (const r of t.files) {
    const i = Number(r.id || 0);
    if (!Number.isFinite(i) || i <= 0)
      throw new Error("上传文件标识无效");
    if (n.has(i))
      continue;
    const s = await Fn(
      Bn("workbench/upload_save_asset"),
      "post",
      {
        team_id: t.teamID,
        project_id: t.projectID || void 0,
        file_id: i,
        text_content: t.textContents?.get(i)
      },
      { reportError: !1 }
    );
    if (!we(s))
      throw new Error(
        String(s?.message || s?.msg || "保存上传资产失败")
      );
    const a = s?.data?.asset;
    if (!a || typeof a != "object" || Array.isArray(a))
      throw new Error("保存上传资产结果为空");
    n.add(i), e.push(a);
  }
  return e;
}
function Wn(t) {
  const e = String(t.type || "").toLowerCase();
  return e.startsWith("image/") ? "image" : e.startsWith("video/") ? "video" : e.startsWith("audio/") ? "audio" : ["text/plain", "text/markdown", "text/x-markdown"].includes(e) || Jn.has(qn(t.name)) ? "text" : "file";
}
function vn(t) {
  const e = String(t || "").toLowerCase();
  return ["image", "video", "audio", "text", "file"].includes(e) ? e : "";
}
function Hn(t) {
  return t === "image" ? 1 : t === "video" ? 2 : t === "audio" ? 3 : 7;
}
function qn(t) {
  const e = String(t || "").trim().toLowerCase(), n = e.lastIndexOf(".");
  return n >= 0 ? e.slice(n + 1) : "";
}
const Yn = Ee.HoverTip, Zn = 12e3;
function X({
  label: t,
  side: e = "top",
  sideOffset: n = 7,
  className: r = "",
  children: i
}) {
  return /* @__PURE__ */ o(
    Yn,
    {
      content: t,
      side: e,
      sideOffset: n,
      layerZIndex: Zn,
      className: `max-w-80 whitespace-normal break-words ${r}`.trim(),
      children: i
    }
  );
}
const Mt = et, kt = Mt.ContentView || Mt.EnergonContentView;
function pe({
  output: t,
  fallback: e = "",
  streaming: n = !1,
  emptyText: r = "暂无内容",
  className: i,
  markdownClassName: s,
  richClassName: a,
  mediaLayout: c = "default"
}) {
  const u = Xn(t, e);
  return kt ? /* @__PURE__ */ o(Qn, { className: i, children: /* @__PURE__ */ o(
    kt,
    {
      output: u,
      streaming: n,
      emptyText: r,
      markdownClassName: s,
      richClassName: a,
      mediaLayout: c
    }
  ) }) : e ? /* @__PURE__ */ o("div", { className: i, children: e }) : null;
}
function Xn(t, e = "") {
  return bt(t) ? t : e ? { text: e } : t;
}
function Qn({
  className: t,
  children: e
}) {
  const n = (r) => {
    tr(r.target) && r.stopPropagation();
  };
  return /* @__PURE__ */ o(
    "div",
    {
      className: t,
      onPointerDown: n,
      onClick: n,
      children: e
    }
  );
}
function tr(t) {
  return t instanceof Element && !!t.closest(
    "a, button, input, textarea, select, audio, video, [role='button']"
  );
}
const er = et.EnergonAudioPlayer;
function Ot({
  src: t,
  prompt: e = "",
  detailed: n = !1,
  autoPlay: r = !1
}) {
  const i = /* @__PURE__ */ o(
    "div",
    {
      className: [
        "wb-asset-audio-preview",
        n ? "is-detail" : ""
      ].filter(Boolean).join(" "),
      children: /* @__PURE__ */ o(
        er,
        {
          src: t,
          detailed: n,
          autoPlay: r,
          className: "h-full min-h-0 border-0 bg-transparent p-0 shadow-none"
        }
      )
    }
  );
  return n ? /* @__PURE__ */ d("div", { className: "wb-asset-audio-detail", children: [
    i,
    e ? /* @__PURE__ */ d("section", { className: "wb-asset-audio-prompt", children: [
      /* @__PURE__ */ d("header", { children: [
        /* @__PURE__ */ o(lt, { "aria-hidden": "true" }),
        /* @__PURE__ */ o("strong", { children: "语音文本" })
      ] }),
      /* @__PURE__ */ o("p", { children: e })
    ] }) : null
  ] }) : i;
}
function Tt({
  content: t,
  summary: e,
  compact: n = !1
}) {
  const r = Un(t), i = r.name || e || "文件", s = r.extension ? r.extension.toUpperCase() : "FILE", a = r.extension ? `${r.extension.toUpperCase()} 文件` : "文件";
  return n ? /* @__PURE__ */ d("div", { className: "wb-asset-file-card-preview", children: [
    /* @__PURE__ */ o("strong", { children: s }),
    /* @__PURE__ */ o(X, { label: i, children: /* @__PURE__ */ o("p", { children: i }) }),
    /* @__PURE__ */ o("span", { children: "文件" })
  ] }) : /* @__PURE__ */ d("section", { className: "wb-asset-file-preview", children: [
    /* @__PURE__ */ o("span", { className: "wb-asset-file-icon", children: /* @__PURE__ */ o(lt, { "aria-hidden": "true" }) }),
    /* @__PURE__ */ d("div", { className: "wb-asset-file-copy", children: [
      /* @__PURE__ */ o(X, { label: i, children: /* @__PURE__ */ o("strong", { children: i }) }),
      /* @__PURE__ */ o("span", { children: a })
    ] }),
    r.url ? /* @__PURE__ */ d("a", { href: r.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ o(Ne, { "aria-hidden": "true" }),
      /* @__PURE__ */ o("span", { children: "打开文件" })
    ] }) : /* @__PURE__ */ o("span", { className: "wb-asset-file-unavailable", children: "文件暂不可用" })
  ] });
}
function ct({
  kind: t,
  src: e,
  poster: n
}) {
  const r = Ft(null), [i, s] = k(""), [a, c] = k(""), [u, m] = k(""), f = i === e, l = a === e, h = u === e;
  L(() => {
    const x = r.current;
    if (!e || !x || typeof IntersectionObserver > "u") {
      s(e);
      return;
    }
    const g = new IntersectionObserver(
      (_) => {
        _.some((R) => R.isIntersecting) && (s(e), g.disconnect());
      },
      { rootMargin: "320px 0px" }
    );
    return g.observe(x), () => g.disconnect();
  }, [e]);
  function N() {
    c(e), m("");
  }
  function I() {
    c(""), m(e);
  }
  return /* @__PURE__ */ d(
    "div",
    {
      ref: r,
      className: [
        "wb-asset-lazy-cover",
        `is-${t}`,
        l ? "is-loaded" : "is-pending",
        h ? "is-failed" : ""
      ].filter(Boolean).join(" "),
      children: [
        f && !h ? t === "image" ? /* @__PURE__ */ o(
          "img",
          {
            src: e,
            alt: "",
            loading: "lazy",
            decoding: "async",
            onLoad: N,
            onError: I
          }
        ) : /* @__PURE__ */ o(
          Bt,
          {
            src: e,
            poster: n,
            ariaHidden: !0,
            onLoad: N,
            onError: I
          }
        ) : null,
        h ? /* @__PURE__ */ o("span", { children: "封面加载失败" }) : null
      ]
    }
  );
}
function nr({
  kind: t,
  content: e,
  summary: n
}) {
  const r = ue(t, e), i = n || Z(e) || Vt(t), s = kn(r, "storyboard") ? { text: i } : r;
  return /* @__PURE__ */ o("div", { className: `wb-asset-card-text-preview is-${t}`, children: /* @__PURE__ */ o(
    pe,
    {
      output: s,
      fallback: i,
      emptyText: i,
      className: "wb-asset-card-text-content",
      markdownClassName: "wb-asset-card-prose",
      richClassName: "wb-asset-card-prose"
    }
  ) });
}
function ni({
  kind: t,
  content: e,
  summary: n,
  prompt: r,
  compact: i = !1
}) {
  const s = fe(e, t), a = s.map((u) => u.url), c = a[0] || "";
  if (!i) {
    const u = t === "audio" ? Sn(e) : null;
    if ((t === "image" || t === "video") && a.length > 0)
      return /* @__PURE__ */ o(
        _t,
        {
          kind: t,
          mediaItems: s,
          downloadable: !0,
          className: "wb-asset-media-gallery"
        }
      );
    if (t === "audio")
      return s.length > 0 && (s.length > 1 || s[0]?.thumbnail) ? /* @__PURE__ */ o(
        _t,
        {
          kind: "audio",
          mediaItems: s,
          downloadable: !0,
          className: "wb-asset-media-gallery",
          supplementalText: u
        }
      ) : /* @__PURE__ */ o(Ot, { src: c, prompt: r, detailed: !0 });
    if (t === "file")
      return /* @__PURE__ */ o(Tt, { content: e, summary: n });
    const m = ue(t, e);
    return /* @__PURE__ */ o(
      pe,
      {
        output: m,
        fallback: n || "",
        emptyText: "该版本暂无可预览内容",
        className: "wb-asset-preview-content",
        markdownClassName: "wb-asset-detail-prose",
        richClassName: "wb-asset-detail-prose",
        mediaLayout: "detail"
      }
    );
  }
  return t === "image" && c ? /* @__PURE__ */ o(ct, { kind: "image", src: c }) : t === "video" && c ? /* @__PURE__ */ o(
    ct,
    {
      kind: "video",
      src: c,
      poster: s[0]?.thumbnail
    }
  ) : t === "audio" ? s[0]?.thumbnail ? /* @__PURE__ */ o(ct, { kind: "image", src: s[0].thumbnail }) : /* @__PURE__ */ o(Ot, { src: c }) : t === "file" ? /* @__PURE__ */ o(Tt, { content: e, summary: n, compact: !0 }) : t === "text" || t === "richtext" ? /* @__PURE__ */ o(nr, { kind: t, content: e, summary: n }) : /* @__PURE__ */ o("div", { className: "wb-asset-card-fallback", children: /* @__PURE__ */ o("p", { children: n || Z(e) || Vt(t) }) });
}
function ri({ kind: t }) {
  switch (t) {
    case "collection":
      return /* @__PURE__ */ o(Ae, { "aria-hidden": "true" });
    case "image":
      return /* @__PURE__ */ o($t, { "aria-hidden": "true" });
    case "audio":
      return /* @__PURE__ */ o(Ce, { "aria-hidden": "true" });
    case "video":
      return /* @__PURE__ */ o(Ie, { "aria-hidden": "true" });
    case "file":
      return /* @__PURE__ */ o(Se, { "aria-hidden": "true" });
    default:
      return /* @__PURE__ */ o(lt, { "aria-hidden": "true" });
  }
}
function rr({
  ariaLabel: t,
  header: e,
  children: n,
  onRequestClose: r,
  layer: i = "default"
}) {
  const s = /* @__PURE__ */ o(
    "div",
    {
      className: `wb-detail-backdrop ${i === "nested" ? "is-nested" : ""}`.trim(),
      role: "presentation",
      onMouseDown: () => {
        r();
      },
      children: /* @__PURE__ */ d(
        "section",
        {
          className: "wb-detail-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": t,
          onMouseDown: (a) => a.stopPropagation(),
          children: [
            e,
            n
          ]
        }
      )
    }
  );
  return typeof document > "u" ? null : Ue(s, document.body);
}
function ir({
  icon: t,
  title: e,
  subtitle: n,
  versionSelect: r,
  state: i,
  updatedAt: s,
  actions: a,
  downloadUrl: c,
  onClose: u
}) {
  return /* @__PURE__ */ d("header", { className: "wb-detail-head", children: [
    /* @__PURE__ */ d("div", { className: "wb-detail-heading", children: [
      /* @__PURE__ */ o("span", { className: "wb-detail-kind-icon", "aria-hidden": "true", children: t }),
      /* @__PURE__ */ d("div", { children: [
        /* @__PURE__ */ o("strong", { children: e || "详情" }),
        n ? /* @__PURE__ */ o("span", { children: n }) : null
      ] })
    ] }),
    /* @__PURE__ */ d("div", { className: "wb-detail-meta", children: [
      r,
      i,
      s ? /* @__PURE__ */ o("time", { children: s }) : null
    ] }),
    /* @__PURE__ */ d("div", { className: "wb-detail-actions", children: [
      a,
      c ? /* @__PURE__ */ o(X, { label: "下载内容", children: /* @__PURE__ */ o(
        je,
        {
          url: c,
          name: e,
          className: "wb-detail-icon-button"
        }
      ) }) : null,
      /* @__PURE__ */ o(X, { label: "关闭", children: /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          className: "wb-detail-icon-button",
          onClick: u,
          "aria-label": "关闭详情",
          children: /* @__PURE__ */ o(De, { size: 18 })
        }
      ) })
    ] })
  ] });
}
function ii({
  options: t,
  currentVersionId: e,
  selectedVersionId: n,
  total: r,
  hasMore: i,
  loading: s,
  loadingMore: a,
  error: c,
  disabled: u = !1,
  onSelect: m,
  onLoadMore: f,
  onRetry: l
}) {
  const [h, N] = k(!1), I = Ft(null), x = t.find((g) => g.id === n) || t.find((g) => g.id === e);
  return L(() => {
    if (!h) return;
    const g = (_) => {
      I.current?.contains(_.target) || N(!1);
    };
    return document.addEventListener("mousedown", g), () => document.removeEventListener("mousedown", g);
  }, [h]), !n && !s ? null : /* @__PURE__ */ d("div", { className: "wb-detail-version-select", ref: I, children: [
    /* @__PURE__ */ d(
      "button",
      {
        type: "button",
        className: "wb-detail-version-trigger",
        "aria-haspopup": "listbox",
        "aria-expanded": h,
        disabled: u || s && t.length === 0,
        onClick: () => N((g) => !g),
        children: [
          s && t.length === 0 ? /* @__PURE__ */ o(at, { size: 12, className: "wb-detail-spin" }) : null,
          /* @__PURE__ */ o("span", { children: Rt(x?.version) }),
          r > 0 ? /* @__PURE__ */ d("small", { children: [
            r,
            " 个版本"
          ] }) : null,
          /* @__PURE__ */ o(Pt, { size: 13 })
        ]
      }
    ),
    h ? /* @__PURE__ */ o("div", { className: "wb-detail-version-menu", role: "listbox", children: /* @__PURE__ */ d(
      "div",
      {
        className: "wb-detail-version-options",
        onScroll: (g) => {
          const _ = g.currentTarget;
          i && !a && _.scrollHeight - _.scrollTop - _.clientHeight < 36 && f();
        },
        children: [
          t.length > 0 ? t.map((g) => {
            const _ = g.id === n, R = g.id === e;
            return /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": _,
                className: _ ? "is-selected" : "",
                onClick: () => {
                  N(!1), m(g.value);
                },
                children: [
                  /* @__PURE__ */ d("span", { children: [
                    /* @__PURE__ */ o("strong", { children: Rt(g.version) }),
                    R ? /* @__PURE__ */ o("small", { children: "当前" }) : null
                  ] }),
                  /* @__PURE__ */ o("time", { children: sr(g.updatedAt) }),
                  _ ? /* @__PURE__ */ o(Ut, { size: 13 }) : /* @__PURE__ */ o("i", { "aria-hidden": "true" })
                ]
              },
              g.id
            );
          }) : c ? /* @__PURE__ */ o(zt, { error: c, onRetry: l }) : /* @__PURE__ */ d("div", { className: "wb-detail-version-message", children: [
            s ? /* @__PURE__ */ o(at, { size: 14, className: "wb-detail-spin" }) : null,
            /* @__PURE__ */ o("span", { children: s ? "正在读取版本" : "暂无版本" })
          ] }),
          c && t.length > 0 ? /* @__PURE__ */ o(zt, { error: c, onRetry: l }) : null,
          a ? /* @__PURE__ */ d("div", { className: "wb-detail-version-loading", children: [
            /* @__PURE__ */ o(at, { size: 13, className: "wb-detail-spin" }),
            "正在加载更多"
          ] }) : null
        ]
      }
    ) }) : null
  ] });
}
function zt({
  error: t,
  onRetry: e
}) {
  return /* @__PURE__ */ d("div", { className: "wb-detail-version-message is-error", children: [
    /* @__PURE__ */ o("span", { children: t }),
    /* @__PURE__ */ d("button", { type: "button", onClick: e, children: [
      /* @__PURE__ */ o(Me, { size: 12 }),
      "重试"
    ] })
  ] });
}
function Rt(t) {
  const e = Number(t || 0);
  return e > 0 ? `第${e}版` : "版本";
}
function sr(t) {
  const e = String(t || "").trim();
  return e ? e.replace("T", " ").replace(/\.\d+(Z)?$/, "").replace(/Z$/, "") : "";
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/dropdown-menu"]);
const j = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dropdown-menu");
if (!j || Object.keys(j).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const or = j.DropdownMenu, ar = j.DropdownMenuContent, cr = j.DropdownMenuItem, lr = j.DropdownMenuTrigger, dr = et.EnergonAudioPlayer, ur = {
  image: "图片",
  video: "视频",
  audio: "音频"
}, fr = {
  image: "张",
  video: "个",
  audio: "个"
};
function ge(t, e) {
  const n = dn(e, t), r = Math.max(1, Math.ceil(t / n.capacity)), [i, s] = k(0);
  L(() => {
    s((c) => Math.min(c, r - 1));
  }, [r]);
  const a = Math.min(i, r - 1);
  return {
    shape: n,
    pageCount: r,
    pageIndex: a,
    pageOffset: a * n.capacity,
    setPageIndex: s
  };
}
function he({
  layout: t,
  countLabel: e,
  pageIndex: n,
  pageCount: r,
  disabled: i = !1,
  leading: s,
  actions: a,
  onLayoutChange: c,
  onPageChange: u
}) {
  const m = gt(t), f = Xt(m);
  return /* @__PURE__ */ d("header", { className: "ws-media-grid-toolbar", children: [
    /* @__PURE__ */ d("div", { className: "ws-media-grid-toolbar-main", children: [
      s,
      /* @__PURE__ */ d(or, { modal: !1, children: [
        /* @__PURE__ */ o(lr, { asChild: !0, children: /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            className: "ws-media-grid-layout-trigger nodrag nopan",
            disabled: i || !c,
            "aria-label": "选择每页宫格布局",
            onClick: (l) => l.stopPropagation(),
            children: [
              /* @__PURE__ */ o(Oe, { size: 14 }),
              f.label,
              /* @__PURE__ */ o(Pt, { size: 12 })
            ]
          }
        ) }),
        /* @__PURE__ */ o(
          ar,
          {
            align: "start",
            className: "ws-media-grid-layout-menu",
            onClick: (l) => l.stopPropagation(),
            children: H.map((l) => /* @__PURE__ */ d(
              cr,
              {
                className: "ws-media-grid-layout-item",
                onSelect: () => {
                  u(0), c?.(l.value);
                },
                children: [
                  /* @__PURE__ */ o("span", { children: l.label }),
                  /* @__PURE__ */ o("small", { children: l.value === "auto" ? "按结果排版" : `每页 ${l.capacity} 格` }),
                  l.value === m ? /* @__PURE__ */ o(Ut, { size: 13 }) : null
                ]
              },
              l.value
            ))
          }
        )
      ] }),
      /* @__PURE__ */ o("span", { className: "ws-media-grid-count", children: e }),
      r > 1 ? /* @__PURE__ */ d("div", { className: "ws-media-grid-page-controls", "aria-label": "宫格分页", children: [
        /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: n <= 0,
            title: "上一页",
            "aria-label": "上一页",
            onClick: (l) => {
              l.stopPropagation(), u(Math.max(0, n - 1));
            },
            children: /* @__PURE__ */ o(Te, { size: 14 })
          }
        ),
        /* @__PURE__ */ d("span", { children: [
          n + 1,
          "/",
          r
        ] }),
        /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: n >= r - 1,
            title: "下一页",
            "aria-label": "下一页",
            onClick: (l) => {
              l.stopPropagation(), u(Math.min(r - 1, n + 1));
            },
            children: /* @__PURE__ */ o(ze, { size: 14 })
          }
        )
      ] }) : null
    ] }),
    a ? /* @__PURE__ */ o("div", { className: "ws-media-grid-toolbar-actions", children: a }) : null
  ] });
}
function si({
  kind: t,
  items: e,
  label: n
}) {
  const [r, i] = k("auto"), s = ge(e.length, r), a = e.slice(
    s.pageOffset,
    s.pageOffset + s.shape.capacity
  ), c = Array.from(
    { length: s.shape.capacity },
    (m, f) => a[f]
  ), u = ur[t];
  return /* @__PURE__ */ d("section", { className: `ws-media-grid-view is-${t}`, children: [
    /* @__PURE__ */ o(
      he,
      {
        layout: r,
        countLabel: `${e.length} ${fr[t]}`,
        pageIndex: s.pageIndex,
        pageCount: s.pageCount,
        onLayoutChange: i,
        onPageChange: s.setPageIndex
      }
    ),
    /* @__PURE__ */ o("div", { className: "ws-media-grid-body nowheel", children: /* @__PURE__ */ o(
      "div",
      {
        className: "ws-media-grid-list",
        style: {
          gridTemplateColumns: `repeat(${s.shape.columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${s.shape.rows}, minmax(0, 1fr))`
        },
        children: c.map((m, f) => {
          const l = s.pageOffset + f, h = `${n || u} ${l + 1}`;
          return m ? /* @__PURE__ */ d(
            "figure",
            {
              className: t === "audio" ? "is-audio" : void 0,
              "aria-label": t === "audio" ? h : void 0,
              children: [
                /* @__PURE__ */ o(mr, { kind: t, item: m, label: h }),
                t === "video" ? /* @__PURE__ */ o("span", { className: "ws-media-grid-play", "aria-hidden": "true", children: /* @__PURE__ */ o(ke, { size: 12, fill: "currentColor" }) }) : null
              ]
            },
            `${m.url}-${l}`
          ) : /* @__PURE__ */ o("figure", { className: "is-empty" }, `empty-${l}`);
        })
      }
    ) })
  ] });
}
function mr({
  kind: t,
  item: e,
  label: n
}) {
  const { url: r } = e;
  return t === "image" ? /* @__PURE__ */ o(
    "img",
    {
      src: r,
      alt: n,
      loading: "lazy",
      decoding: "async",
      draggable: !1
    }
  ) : t === "video" ? /* @__PURE__ */ o(
    Bt,
    {
      src: r,
      poster: e.thumbnail,
      draggable: !1,
      ariaLabel: n
    },
    r
  ) : /* @__PURE__ */ d(
    "div",
    {
      className: `ws-media-grid-audio-card${e.thumbnail ? " has-cover" : ""}`,
      children: [
        e.thumbnail ? /* @__PURE__ */ o("img", { src: e.thumbnail, alt: "", loading: "lazy", decoding: "async" }) : null,
        /* @__PURE__ */ o(
          dr,
          {
            src: r,
            compact: !0,
            preload: "none",
            className: "ws-media-grid-audio-player nodrag nopan"
          }
        )
      ]
    }
  );
}
function pr({
  items: t,
  initialItemID: e,
  onClose: n
}) {
  const r = Lt(t, e), [i, s] = k(r), a = t.map((m) => `${String(m.id)}:${m.url}`).join(`
`);
  L(() => {
    s(Lt(t, e));
  }, [e, a]), L(() => {
    const m = (f) => {
      f.key === "Escape" && n();
    };
    return document.addEventListener("keydown", m), () => document.removeEventListener("keydown", m);
  }, [n]);
  const c = Math.min(
    Math.max(0, i),
    Math.max(0, t.length - 1)
  ), u = t[c];
  return u ? /* @__PURE__ */ o(
    rr,
    {
      ariaLabel: "图片预览",
      layer: "nested",
      onRequestClose: n,
      header: /* @__PURE__ */ o(
        ir,
        {
          icon: /* @__PURE__ */ o($t, { size: 16 }),
          title: u.name || "图片预览",
          subtitle: `图片 ${c + 1}/${t.length}`,
          downloadUrl: u.url,
          onClose: n
        }
      ),
      children: /* @__PURE__ */ o("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ o(
        $e,
        {
          kind: "image",
          items: t,
          activeIndex: c,
          onSelect: s
        }
      ) })
    }
  ) : null;
}
function Lt(t, e) {
  const n = t.findIndex((r) => String(r.id) === String(e));
  return n >= 0 ? n : 0;
}
function ye({
  grid: t,
  variant: e = "compact",
  readonly: n = !0,
  renderFrameAction: r,
  onFrameChange: i,
  onFrameImport: s,
  onEmptyFrameImport: a,
  capacity: c,
  showHeader: u = !0,
  showCaptions: m = !0,
  columns: f,
  rows: l,
  frameOffset: h = 0,
  previewFrames: N
}) {
  const [I, x] = k(
    null
  ), g = Pe(
    () => (N || t.frames).filter((p) => !!p.image).map((p) => ({
      id: p.id || p.order,
      name: p.title || `画面 ${p.order}`,
      url: p.image,
      thumbnail: p.image
    })),
    [t.frames, N]
  ), _ = Math.max(
    t.frames.length,
    Math.trunc(Number(c) || 0)
  ), R = Array.from(
    { length: _ },
    (p, ot) => t.frames[ot]
  ), be = {
    ...f ? { gridTemplateColumns: `repeat(${f}, minmax(0, 1fr))` } : {},
    ...l ? { gridTemplateRows: `repeat(${l}, minmax(0, 1fr))` } : {}
  };
  return /* @__PURE__ */ d("section", { className: `ws-storyboard-grid-output is-${e}`, children: [
    u ? /* @__PURE__ */ d("header", { children: [
      /* @__PURE__ */ o("strong", { children: t.title }),
      t.summary ? /* @__PURE__ */ o("p", { children: t.summary }) : null
    ] }) : null,
    /* @__PURE__ */ o(
      "div",
      {
        className: "ws-storyboard-grid-output-list",
        "data-count": R.length,
        style: be,
        children: R.map((p, ot) => {
          const O = h + ot;
          return p ? /* @__PURE__ */ d("figure", { className: p.image ? "" : "is-empty", children: [
            p.image ? /* @__PURE__ */ o(
              gr,
              {
                frame: p,
                onPreview: () => x(p.id || p.order)
              }
            ) : s ? /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-empty nodrag nopan",
                title: "导入图片",
                "aria-label": `向第 ${p.order} 格导入图片`,
                onClick: (S) => {
                  S.preventDefault(), S.stopPropagation(), s(p, O);
                },
                children: /* @__PURE__ */ o(P, { size: 18 })
              }
            ) : /* @__PURE__ */ o("div", { className: "ws-storyboard-grid-output-error", children: p.error || "暂无图片" }),
            p.image && s ? /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-import nodrag nopan",
                title: "替换图片",
                "aria-label": `替换第 ${p.order} 格图片`,
                onClick: (S) => {
                  S.preventDefault(), S.stopPropagation(), s(p, O);
                },
                children: /* @__PURE__ */ o(P, { size: 14 })
              }
            ) : null,
            m ? /* @__PURE__ */ d("figcaption", { children: [
              /* @__PURE__ */ o("span", { children: String(p.order).padStart(2, "0") }),
              e === "detail" && !n && i ? /* @__PURE__ */ o(
                "input",
                {
                  value: p.title,
                  "aria-label": `第 ${p.order} 格标题`,
                  onChange: (S) => i(O, { title: S.target.value })
                }
              ) : /* @__PURE__ */ o("strong", { children: p.title })
            ] }) : null,
            e === "detail" ? /* @__PURE__ */ d("div", { className: "ws-storyboard-grid-output-details", children: [
              n || !i ? /* @__PURE__ */ o("p", { children: p.description || "暂无画面说明" }) : /* @__PURE__ */ o(
                "textarea",
                {
                  value: p.description,
                  rows: 3,
                  "aria-label": `第 ${p.order} 格说明`,
                  placeholder: "画面说明",
                  onChange: (S) => i(O, {
                    description: S.target.value
                  })
                }
              ),
              r ? /* @__PURE__ */ o("div", { className: "ws-storyboard-grid-output-actions", children: r(p, O) }) : null
            ] }) : null
          ] }, p.id) : /* @__PURE__ */ o("figure", { className: "is-empty", children: a ? /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              className: "ws-storyboard-grid-frame-empty nodrag nopan",
              title: "导入图片",
              "aria-label": `向第 ${O + 1} 格导入图片`,
              onClick: (S) => {
                S.preventDefault(), S.stopPropagation(), a(O);
              },
              children: /* @__PURE__ */ o(P, { size: 18 })
            }
          ) : null }, `empty-${O}`);
        })
      }
    ),
    I != null && g.length > 0 ? /* @__PURE__ */ o(
      pr,
      {
        items: g,
        initialItemID: I,
        onClose: () => x(null)
      }
    ) : null
  ] });
}
function gr({
  frame: t,
  onPreview: e
}) {
  const [n, r] = k(!1);
  return L(() => {
    r(!1);
  }, [t.image]), n ? /* @__PURE__ */ o("div", { className: "ws-storyboard-grid-output-error", children: t.error || "图片加载失败" }) : /* @__PURE__ */ o(
    "button",
    {
      type: "button",
      className: "ws-storyboard-grid-image nodrag nopan",
      title: "预览图片",
      "aria-label": `预览第 ${t.order} 格图片`,
      onClick: (i) => {
        i.preventDefault(), i.stopPropagation(), e();
      },
      children: /* @__PURE__ */ o(
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
function hr({
  grid: t,
  aspectRatio: e,
  running: n = !1,
  onImport: r,
  onFrameImport: i,
  onSlotImport: s,
  onEdit: a,
  layout: c = "auto",
  onLayoutChange: u
}) {
  const m = gt(c), f = t?.frames.length || 0, l = ge(f, m), h = t ? {
    ...t,
    frames: t.frames.slice(
      l.pageOffset,
      l.pageOffset + l.shape.capacity
    )
  } : null, N = t?.frames.filter((x) => x.image).length || 0, I = f > 0 && N !== f ? `${N}/${f} 张` : `${f} 张`;
  return /* @__PURE__ */ d(
    "section",
    {
      className: `ws-storyboard-grid-canvas ${n ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ o(
          he,
          {
            layout: m,
            countLabel: I,
            pageIndex: l.pageIndex,
            pageCount: l.pageCount,
            disabled: n || !u,
            leading: /* @__PURE__ */ d("span", { children: [
              "比例 ",
              e || "自动"
            ] }),
            actions: r || t && a ? /* @__PURE__ */ d(xe, { children: [
              r ? /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: n,
                  onClick: (x) => {
                    x.stopPropagation(), r();
                  },
                  children: [
                    /* @__PURE__ */ o(P, { size: 14 }),
                    /* @__PURE__ */ o("span", { children: t ? "批量导入" : "导入图片" })
                  ]
                }
              ) : null,
              t && a ? /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: n,
                  onClick: (x) => {
                    x.stopPropagation(), a();
                  },
                  children: [
                    /* @__PURE__ */ o(Re, { size: 14 }),
                    /* @__PURE__ */ o("span", { children: "编辑" })
                  ]
                }
              ) : null
            ] }) : void 0,
            onLayoutChange: u,
            onPageChange: l.setPageIndex
          }
        ),
        /* @__PURE__ */ o("div", { className: "ws-storyboard-grid-canvas-body nowheel", children: h ? /* @__PURE__ */ o(
          ye,
          {
            grid: h,
            previewFrames: t?.frames,
            capacity: l.shape.capacity,
            columns: l.shape.columns,
            rows: l.shape.rows,
            frameOffset: l.pageOffset,
            showHeader: !1,
            showCaptions: !1,
            onFrameImport: n ? void 0 : i,
            onEmptyFrameImport: n ? void 0 : s
          }
        ) : /* @__PURE__ */ o(
          "div",
          {
            className: "ws-storyboard-grid-placeholder",
            "aria-busy": n,
            style: {
              gridTemplateColumns: `repeat(${l.shape.columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${l.shape.rows}, minmax(0, 1fr))`
            },
            children: Array.from({ length: l.shape.capacity }, (x, g) => /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                className: "nodrag nopan",
                disabled: n || !s,
                title: "导入图片",
                "aria-label": `向宫格导入图片，第 ${g + 1} 格`,
                onClick: (_) => {
                  _.stopPropagation(), s?.(g);
                },
                children: /* @__PURE__ */ o(P, { size: 18 })
              },
              g
            ))
          }
        ) })
      ]
    }
  );
}
const oi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StoryboardGridCanvasView: hr,
  StoryboardGridView: ye
}, Symbol.toStringTag, { value: "Module" }));
export {
  Wr as $,
  Ot as A,
  X as B,
  Er as C,
  ir as D,
  Dn as E,
  fe as F,
  bt as G,
  F as H,
  $n as I,
  ei as J,
  Pr as K,
  Br as L,
  gt as M,
  Gr as N,
  w as O,
  Kr as P,
  Fr as Q,
  Hr as R,
  ye as S,
  mt as T,
  T as U,
  Ur as V,
  un as W,
  Xr as X,
  Jr as Y,
  He as Z,
  vr as _,
  Yr as a,
  nn as a0,
  Vr as a1,
  qr as a2,
  Nn as a3,
  qe as a4,
  Kt as a5,
  Qr as a6,
  Ke as a7,
  ve as a8,
  We as a9,
  Ar as aa,
  Dr as ab,
  Lr as ac,
  Rr as ad,
  rt as ae,
  Xn as af,
  Qn as ag,
  si as ah,
  pe as ai,
  An as aj,
  On as ak,
  te as al,
  In as am,
  vt as an,
  oi as ao,
  Sn as b,
  Zr as c,
  ue as d,
  $r as e,
  wt as f,
  Cn as g,
  Gn as h,
  Vn as i,
  kn as j,
  ni as k,
  Mr as l,
  j as m,
  ti as n,
  sr as o,
  Mn as p,
  ii as q,
  zr as r,
  Kn as s,
  Vt as t,
  jr as u,
  ri as v,
  rr as w,
  Tr as x,
  Or as y,
  kr as z
};
