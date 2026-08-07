import { r as k, n as I, g as Z, e as Ae, b as C, c as $, i as it } from "./runtime-entry-ClkZDmNs.js";
import { s as A, d as L, q as X, f as y, r as g, j as Ce, m as ot, c as st } from "./site-config-DrnclGFw.js";
import { c as De, X as at } from "./in-flight-request-CXY2yBH9.js";
import { c as j, j as o, a as f, F as ct } from "./createLucideIcon-fWv1XcFy.js";
import { F as oe } from "./file-text-GWInsYzS.js";
import { F as lt, C as dt } from "./folder-open-ypoXJW1v.js";
import { F as Oe, I as ze, D as ut } from "./first-frame-video-DlIx6mwp.js";
import { m as ft, M as mt, a as pt } from "./media-inspector-gallery-TNes-xFo.js";
import { m as ht } from "./content-view-BXwDWBA5.js";
import { E as gt } from "./external-link-CBYzs7jk.js";
import { P as yt } from "./pencil-DsS_UhAq.js";
import { C as Re } from "./check-B_RB4H2g.js";
import { C as Le } from "./chevron-down-e5qsfp_F.js";
import { C as bt } from "./chevron-right-DDWuhzEV.js";
import { P as wt } from "./play-Cgnd9XVW.js";
import { L as ie } from "./vanilla-BSPxkY5-.js";
const _t = [
  [
    "path",
    {
      d: "M4 6.835V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2h-.343",
      key: "1vfytu"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  [
    "path",
    {
      d: "M2 19a2 2 0 0 1 4 0v1a2 2 0 0 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 0 1-4 0v-1a2 2 0 0 1 4 0",
      key: "1etmh7"
    }
  ]
], xt = j("file-headphone", _t);
const Nt = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M7 3v18", key: "bbkbws" }],
  ["path", { d: "M3 7.5h4", key: "zfgn84" }],
  ["path", { d: "M3 12h18", key: "1i2n21" }],
  ["path", { d: "M3 16.5h4", key: "1230mu" }],
  ["path", { d: "M17 3v18", key: "in4fa5" }],
  ["path", { d: "M17 7.5h4", key: "myr1c1" }],
  ["path", { d: "M17 16.5h4", key: "go4c1d" }]
], St = j("film", Nt);
const kt = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M3 15h18", key: "5xshup" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }]
], It = j("grid-3x3", kt);
const Mt = [
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }],
  ["path", { d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5", key: "1ue2ih" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }]
], v = j("image-plus", Mt);
const At = [
  [
    "path",
    {
      d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",
      key: "1miecu"
    }
  ]
], Ct = j("paperclip", At);
const Dt = [
  ["path", { d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8", key: "1p45f6" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }]
], Ot = j("rotate-cw", Dt), zt = De(), Rt = De();
function pn(e, t, r = "") {
  const n = JSON.stringify({
    requestScopeKey: r,
    teamID: e,
    catalogOptions: t || null
  });
  return zt(n, async () => {
    const i = k(
      I("workbench/asset_filters"),
      "get",
      { team_id: e }
    ), [s, a] = t ? [null, await i] : await Promise.all([
      k(I("workbench/catalog"), "get", {
        team_id: e
      }),
      i
    ]), d = t ? {
      powers: t.tools,
      roles: t.dialogues,
      asset_cates: t.assetCates
    } : A(s, "加载团队资产配置失败"), c = A(a, "加载资产筛选项失败");
    return {
      projects: L(c.projects).map(se).filter(F),
      tools: he(d.powers, c.tools),
      dialogues: he(d.roles, c.dialogues),
      assetCates: L(d.asset_cates).map(Tt).filter(F)
    };
  });
}
function hn(e) {
  const t = {
    ...e,
    pageSize: e.pageSize || 24,
    view: e.view || "assets",
    contentMode: e.contentMode || "preview"
  };
  return Rt(JSON.stringify(t), async () => {
    const r = await k(I("workbench/assets"), "get", {
      team_id: t.teamID,
      source_type: t.filters.sourceType || void 0,
      source_id: t.filters.sourceID || void 0,
      project_id: t.filters.projectID || void 0,
      scope_project_id: t.scopeProjectID || void 0,
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
    }), n = A(r, "加载资产失败");
    return {
      items: L(n.items).map(B).filter(F),
      page: y(n.page, t.page),
      pageSize: y(n.page_size, t.pageSize),
      total: X(n.total),
      hasMore: !!n.has_more
    };
  });
}
async function gn(e, t) {
  const r = await k(I("workbench/asset_detail"), "get", {
    team_id: e,
    asset_id: t
  });
  return Lt(A(r, "加载资产详情失败"));
}
async function yn(e) {
  const t = await k(I("workbench/asset_versions"), "get", {
    team_id: e.teamID,
    asset_id: e.assetID,
    page: e.page,
    page_size: e.pageSize || 20
  }), r = A(t, "加载资产版本失败");
  return {
    items: L(r.items).map(Q).filter(F),
    total: X(r.total),
    hasMore: !!r.has_more
  };
}
async function bn(e) {
  const t = await k(I("workbench/asset_version"), "get", {
    team_id: e.teamID,
    asset_id: e.assetID,
    version_id: e.versionID
  }), r = A(t, "加载资产版本失败");
  return Q(r.version);
}
async function wn(e) {
  const t = await k(
    I("workbench/asset_set_current"),
    "post",
    {
      team_id: e.teamID,
      asset_id: e.assetID,
      version_id: e.versionID
    }
  ), r = A(t, "设置当前版本失败");
  return B(r.asset);
}
async function _n(e) {
  const t = await k(I("workbench/asset_rename"), "post", {
    team_id: e.teamID,
    asset_id: e.assetID,
    name: e.name
  }), r = A(t, "修改资产标题失败");
  return B(r.asset);
}
async function xn(e) {
  const t = await k(I("workbench/asset_delete"), "post", {
    team_id: e.teamID,
    asset_id: e.assetID
  });
  A(t, "删除资产失败");
}
async function Nn(e) {
  const t = await k(I("workbench/asset_restore"), "post", {
    team_id: e.teamID,
    asset_id: e.assetID
  }), r = A(t, "恢复资产失败");
  return B(r.asset);
}
function Lt(e) {
  return {
    asset: B(e.asset),
    versions: L(e.versions).map(Q).filter(F),
    versionTotal: X(e.version_total),
    hasMore: !!e.has_more
  };
}
function B(e) {
  const t = Ce(e?.version) ? Q(e.version) : null;
  return {
    id: y(e?.id),
    projectID: y(e?.project_id),
    bodyID: y(e?.body_id),
    teamID: y(e?.team_id),
    flowID: y(e?.flow_id),
    assetCateID: y(e?.asset_cate_id),
    collectionID: y(e?.collection_id),
    nodeKey: g(e?.node_key),
    sourceType: g(e?.source_type),
    sourceID: y(e?.source_id),
    sourceName: g(e?.source_name),
    name: g(e?.name) || "未命名资产",
    nameMode: g(e?.name_mode) === "manual" ? "manual" : "auto",
    kind: g(e?.kind) || "text",
    role: g(e?.role) || "material",
    versionID: y(e?.version_id),
    status: g(e?.status),
    summary: g(e?.summary || t?.summary),
    collectionCount: X(e?.collection_count),
    collectionPreviews: L(e?.collection_previews).map($t).filter((r) => !!r),
    createdAt: g(e?.created_at),
    deletedAt: g(e?.deleted_at),
    version: t
  };
}
function $t(e) {
  const t = g(e?.kind);
  return t !== "image" && t !== "video" || !e?.content ? null : {
    id: y(e?.id),
    kind: t,
    content: e.content
  };
}
function Q(e) {
  return {
    id: y(e?.id),
    assetID: y(e?.asset_id),
    runID: y(e?.run_id),
    nodeRunID: y(e?.node_run_id),
    releaseID: y(e?.release_id),
    requestID: g(e?.request_id),
    nodeKey: g(e?.node_key),
    source: Ce(e?.source) ? e.source : {},
    version: y(e?.version, 1),
    content: e?.content,
    summary: g(e?.summary),
    createdAt: g(e?.created_at),
    updatedAt: g(e?.updated_at || e?.created_at)
  };
}
function se(e) {
  return {
    id: y(e?.id),
    name: g(e?.name) || "未命名"
  };
}
function he(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const n of e)
    for (const i of L(n)) {
      const s = se(i);
      s.id <= 0 || r.has(s.id) || (r.add(s.id), t.push(s));
    }
  return t;
}
function Tt(e) {
  return {
    ...se(e),
    kind: g(e?.kind) || "text",
    cardinality: g(e?.cardinality) || "single"
  };
}
function F(e) {
  return e.id > 0;
}
const Pt = [
  { key: "project", label: "创作" },
  { key: "tool", label: "工具" },
  { key: "dialogue", label: "对话" },
  { key: "upload", label: "上传" }
], jt = [
  { key: "work", label: "作品" },
  { key: "material", label: "素材" }
], Et = [
  { key: "collection", label: "集合" },
  { key: "text", label: "文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "richtext", label: "富文本" },
  { key: "file", label: "文件" }
];
function Sn(e, t = {}) {
  const r = t.fallback || "资产", n = ae(Pt, e, r);
  return t[e] || n;
}
function kn(e) {
  return ae(jt, e, "素材");
}
function $e(e) {
  return ae(Et, e, "资产");
}
function In(e) {
  if (e.length === 0 || e.some((n) => ["text", "richtext", "file"].includes(n)))
    return;
  const t = {
    image: "image/*",
    audio: "audio/*",
    video: "video/*"
  }, r = e.map((n) => t[n]).filter((n) => !!n);
  return r.length > 0 ? Array.from(new Set(r)).join(",") : void 0;
}
function ae(e, t, r) {
  return e.find((n) => n.key === t)?.label || r;
}
function vt(e) {
  if (typeof e != "string")
    return e;
  const t = e.trim();
  if (!ce(t))
    return e;
  try {
    return JSON.parse(t);
  } catch {
    return e;
  }
}
function b(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function Mn(e) {
  return b(e) ? e : {};
}
function An(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Cn(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) ? t : 0;
}
function Dn(e) {
  if (e == null || e === "")
    return;
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}
function Te(e) {
  const t = String(e || "").trim(), r = Ft(t), n = Gt(r);
  for (const i of Ee([t, r, n])) {
    const s = vt(i);
    if (s !== i)
      return s;
    const a = Vt(i);
    if (a !== i)
      return a;
  }
  return e;
}
function On(e) {
  const t = String(e || "").trim();
  for (const r of je(t)) {
    const n = Te(r);
    if (n !== r)
      return n;
  }
  return e;
}
function Pe(e) {
  const t = [];
  for (const r of je(
    String(e || "").trim()
  )) {
    const n = Te(r);
    n !== r && t.push(n);
  }
  return t;
}
function Ft(e) {
  let t = "", r = !1, n = !1;
  for (const i of e) {
    if (n) {
      t += i, n = !1;
      continue;
    }
    if (i === "\\") {
      t += i, n = r;
      continue;
    }
    if (i === '"') {
      r = !r, t += i;
      continue;
    }
    if (r && i.charCodeAt(0) < 32) {
      t += Jt(i);
      continue;
    }
    t += i;
  }
  return t;
}
function je(e) {
  const t = [e];
  for (const r of e.matchAll(/```(?:json|storyboard)?\s*([\s\S]*?)```/gi))
    t.push(String(r[1] || "").trim());
  return t.push(...Bt(e)), Ee(t);
}
function Bt(e) {
  const t = [];
  for (let r = 0; r < e.length; r += 1) {
    const n = e[r];
    if (n !== "{" && n !== "[")
      continue;
    const i = Ut(e, r);
    i && (t.push(i), r += i.length - 1);
  }
  return t;
}
function Ut(e, t) {
  const r = [];
  let n = !1, i = !1;
  for (let s = t; s < e.length; s += 1) {
    const a = e[s];
    if (i) {
      i = !1;
      continue;
    }
    if (n && a === "\\") {
      i = !0;
      continue;
    }
    if (a === '"') {
      n = !n;
      continue;
    }
    if (n)
      continue;
    if (a === "{" || a === "[") {
      r.push(a);
      continue;
    }
    if (a !== "}" && a !== "]")
      continue;
    const d = a === "}" ? "{" : "[";
    if (r.pop() !== d)
      return "";
    if (r.length === 0)
      return e.slice(t, s + 1).trim();
  }
  return "";
}
function ce(e) {
  return e.startsWith("{") && e.endsWith("}") || e.startsWith("[") && e.endsWith("]");
}
function Vt(e) {
  if (!e.startsWith('"') || !e.endsWith('"'))
    return e;
  try {
    const t = JSON.parse(e);
    return typeof t == "string" ? t : e;
  } catch {
    return e;
  }
}
function Jt(e) {
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
function Gt(e) {
  const t = e.trim();
  return !t.includes('\\"') || !t.startsWith("{") && !t.startsWith("[") ? e : t.replace(/\\"/g, '"');
}
function Ee(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((r) => {
    const n = String(r || "").trim();
    return !n || t.has(n) ? !1 : (t.add(n), !0);
  });
}
function zn(...e) {
  return e.find(
    (t) => t != null
  );
}
function Rn(e) {
  try {
    return JSON.stringify(e);
  } catch {
    return "";
  }
}
const Wt = {
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
function Ln(e) {
  const t = Fe(e);
  return t.length > 120 ? `${t.slice(0, 120)}...` : t;
}
function Fe(e) {
  return V(e).replace(/\s+/g, " ").trim();
}
function Kt(e) {
  if (typeof e != "string")
    return "";
  const t = e.trim();
  if (!Zt(t))
    return "";
  const r = t.search(/"rich"\s*:/), n = r >= 0 ? t.slice(r) : t, i = [], s = /"text"\s*:\s*"((?:\\.|[^"\\])*)"/g;
  let a = null;
  for (; (a = s.exec(n)) !== null; ) {
    const d = Xt(a[1]).trim();
    d && i.push(d);
  }
  return i.join(" ").replace(/\s+/g, " ").trim();
}
function le(e) {
  const t = E(e, /* @__PURE__ */ new Set());
  return de(t) ? t : null;
}
function $n(e) {
  try {
    return Fe(e);
  } catch {
    return "";
  }
}
function Tn(e) {
  try {
    return le(e);
  } catch {
    return null;
  }
}
function V(e) {
  if (typeof e == "string") {
    const n = e.trim();
    if (ce(n)) {
      const i = Je(n);
      if (i !== void 0)
        return V(i).trim();
    }
    return Kt(n) || e;
  }
  if (Array.isArray(e))
    return e.map(V).filter(Boolean).join(" ");
  if (!b(e))
    return "";
  const t = le(e);
  if (t)
    return Ve(t);
  const r = [
    typeof e.text == "string" ? e.text : "",
    typeof e.markdown == "string" ? e.markdown : ""
  ];
  for (const n of ve)
    e[n] != null && r.push(V(e[n]));
  return r.filter(Boolean).join(" ");
}
function E(e, t) {
  if (typeof e == "string") {
    const n = e.trim();
    if (!ce(n))
      return null;
    const i = Je(n);
    return i === void 0 ? null : E(i, t);
  }
  if (Array.isArray(e)) {
    const n = ge({ type: "doc", content: e });
    if (de(n))
      return n;
    for (const i of e) {
      const s = E(i, t);
      if (s)
        return s;
    }
    return null;
  }
  if (!b(e) || t.has(e))
    return null;
  t.add(e);
  const r = ge(e);
  if (r)
    return r;
  if (String(e.format || "").toLowerCase() === "rich_json" && e.rich != null) {
    const n = E(e.rich, t);
    if (n)
      return n;
  }
  for (const n of ve) {
    if (e[n] == null)
      continue;
    const i = E(e[n], t);
    if (i)
      return i;
  }
  return null;
}
function ge(e) {
  return !b(e) || Ue(e.type) !== "doc" ? null : {
    type: "doc",
    attrs: b(e.attrs) ? e.attrs : void 0,
    content: Be(e.content)
  };
}
function Be(e) {
  return Array.isArray(e) ? e.map(Ht).filter((t) => !!t) : [];
}
function Ht(e) {
  if (!b(e))
    return null;
  const t = Ue(e.type) || qt(e);
  if (!t)
    return null;
  const r = { type: t }, n = b(e.attrs) ? { ...e.attrs } : {};
  if (t === "heading" && K(n.level) <= 0) {
    const a = K(e.level);
    a > 0 && (n.level = a);
  }
  Object.keys(n).length > 0 && (r.attrs = n);
  const i = Yt(e.marks);
  if (i.length > 0 && (r.marks = i), t === "text") {
    const a = T(e.text);
    return a ? (r.text = a, r) : null;
  }
  const s = Be(e.content);
  return s.length > 0 && (r.content = s), r;
}
function qt(e) {
  if (typeof e.text == "string")
    return "text";
  const t = b(e.attrs) ? e.attrs : {};
  return K(t.level) > 0 || K(e.level) > 0 ? "heading" : "";
}
function Yt(e) {
  return Array.isArray(e) ? e.map((t) => {
    if (!b(t))
      return null;
    const r = T(t.type);
    return r ? {
      type: r,
      attrs: b(t.attrs) ? t.attrs : void 0
    } : null;
  }).filter(
    (t) => !!t
  ) : [];
}
function Ue(e) {
  const t = T(e);
  return Wt[t] || t;
}
function Ve(e) {
  return e ? e.type === "text" ? e.text || "" : e.type === "editorMediaImage" || e.type === "editorMediaVideo" || e.type === "editorMediaAudio" ? T(e.attrs?.alt || e.attrs?.title || e.attrs?.src) : (e.content || []).map(Ve).filter(Boolean).join(" ") : "";
}
function de(e) {
  return e ? e.type === "text" ? !!T(e.text) : e.type === "editorMediaImage" || e.type === "editorMediaVideo" || e.type === "editorMediaAudio" ? !!T(e.attrs?.src) : (e.content || []).some(de) : !1;
}
function Je(e) {
  try {
    return JSON.parse(e);
  } catch {
    return;
  }
}
function Zt(e) {
  return e.includes("rich_json") || e.includes('"rich"') || e.includes("agent_run_id") || e.includes("node_run_id");
}
function Xt(e) {
  try {
    return JSON.parse(`"${e}"`);
  } catch {
    return e.replace(/\\"/g, '"').replace(/\\n/g, `
`).replace(/\\t/g, "	").replace(/\\\\/g, "\\");
  }
}
function K(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) ? t : 0;
}
function T(e) {
  return e == null ? "" : String(e).trim();
}
const H = [
  { value: "auto", label: "自动", columns: 0, rows: 0, capacity: 9 },
  { value: "2x2", label: "2×2", columns: 2, rows: 2, capacity: 4 },
  { value: "3x2", label: "3×2", columns: 3, rows: 2, capacity: 6 },
  { value: "3x3", label: "3×3", columns: 3, rows: 3, capacity: 9 }
], Qt = new Set(
  H.map((e) => e.value)
);
function ue(e) {
  const t = String(e || "").trim().toLowerCase();
  return Qt.has(t) ? t : "auto";
}
function Ge(e) {
  const t = ue(e);
  return H.find((r) => r.value === t) || H[0];
}
function er(e, t) {
  const r = Ge(e), n = Math.max(0, Math.trunc(Number(t) || 0));
  return r.value !== "auto" ? r : n === 0 || n > 6 ? { columns: 3, rows: 3, capacity: 9 } : n > 4 ? { columns: 3, rows: 2, capacity: 6 } : n > 2 ? { columns: 2, rows: 2, capacity: 4 } : { columns: 2, rows: 1, capacity: 2 };
}
const tr = 50, fe = ["image", "video", "audio"], rr = {
  image: ["image", "image_url", "imageUrl", "images", "imageUrls"],
  video: ["video", "video_url", "videoUrl", "videos", "videoUrls"],
  audio: ["audio", "audio_url", "audioUrl", "audios", "audioUrls"]
}, nr = Z(
  "@/components/energon/content-view"
), ir = nr.normalizeEnergonOutput;
function O(...e) {
  for (const t of e)
    if (typeof t == "string" && t.trim())
      return t.trim();
  return "";
}
function Pn(e) {
  const t = We(e);
  return !t || t.hasMedia ? "" : t.markdown;
}
function We(e) {
  const t = br(e);
  return !t || !Ke(t) ? null : {
    markdown: t.content.map(He).join(`

`).trim(),
    plainText: t.content.map(qe).join(`

`).trim(),
    hasMedia: Ye(t)
  };
}
function or(e) {
  return /(^|\n)\s*(#{1,6}\s|[-*+]\s|>\s|\d+\.\s|```)/m.test(e) || /(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|`[^`]+`)/.test(e);
}
function jn(e) {
  return sr(e).length > 0;
}
function sr(e) {
  const t = me(e);
  return fe.filter((r) => t[r].size > 0);
}
function ar(e) {
  const t = me(e);
  return fe.reduce(
    (r, n) => r + t[n].size,
    0
  );
}
function En(e, t) {
  return Array.from(me(e)[t]);
}
function cr(e) {
  const t = lr(e);
  return t ? Array.from(
    new Set(
      t.frames.map((r) => r.image.trim()).filter(Boolean)
    )
  ) : [];
}
function lr(e) {
  return G(e, /* @__PURE__ */ new Set(), 0);
}
function dr(e, t) {
  const r = t.trim().toLowerCase();
  return r ? J(e, r, /* @__PURE__ */ new Set(), 0) : !1;
}
function vn(...e) {
  let t, r, n = 0;
  for (const i of e) {
    if (!ee(i))
      continue;
    t === void 0 && (t = i);
    const s = ar(i);
    s > n && (r = i, n = s);
  }
  return n > 0 ? r : t;
}
function ee(e) {
  return e == null || e === "" ? !1 : Array.isArray(e) ? e.length > 0 : typeof e == "object" ? Object.keys(e).length > 0 : !0;
}
function me(e) {
  const t = {
    image: /* @__PURE__ */ new Set(),
    video: /* @__PURE__ */ new Set(),
    audio: /* @__PURE__ */ new Set()
  }, r = cr(e), n = /* @__PURE__ */ new Set();
  for (const i of ur(e))
    z(i, t, n, 0);
  return r.length > 0 && (t.image = new Set(r)), t;
}
function ur(e) {
  if (!ee(e))
    return [];
  const t = ir?.(e);
  return Array.isArray(t) && t.length > 0 ? t : Array.isArray(e) ? e : [e];
}
function J(e, t, r, n) {
  return e == null || n > 12 ? !1 : typeof e == "string" ? Pe(e).some(
    (i) => J(i, t, r, n + 1)
  ) : Array.isArray(e) ? e.some(
    (i) => J(i, t, r, n + 1)
  ) : !b(e) || r.has(e) ? !1 : (r.add(e), String(e.type || "").trim().toLowerCase() === t ? !0 : [
    e.json,
    e.output,
    e.result,
    e.data,
    e.content,
    e.body,
    e.value,
    e.text,
    e.finalOutput,
    e.final_output,
    e.rich
  ].some(
    (i) => J(i, t, r, n + 1)
  ));
}
function G(e, t, r) {
  if (e == null || r > 12)
    return null;
  if (typeof e == "string") {
    const i = e.trim();
    if (!i || !i.startsWith("{") && !i.startsWith("["))
      return null;
    try {
      return G(JSON.parse(i), t, r + 1);
    } catch {
      return null;
    }
  }
  if (Array.isArray(e)) {
    for (const i of e) {
      const s = G(i, t, r + 1);
      if (s)
        return s;
    }
    return null;
  }
  if (!b(e) || t.has(e))
    return null;
  t.add(e);
  const n = fr(e);
  if (n)
    return n;
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
    const s = G(e[i], t, r + 1);
    if (s)
      return s;
  }
  return null;
}
function fr(e) {
  if (String(e.type || "").trim().toLowerCase() !== "storyboard_grid" || !Array.isArray(e.frames))
    return null;
  const t = e.frames.map(mr).filter((r) => !!r).sort((r, n) => r.order - n.order);
  return t.length < 2 || t.length > tr ? null : {
    type: "storyboard_grid",
    version: Math.max(1, Math.trunc(Number(e.version) || 1)),
    title: O(e.title, "宫格图片"),
    summary: O(e.summary),
    frames: t
  };
}
function mr(e, t) {
  if (!b(e))
    return null;
  const r = Math.max(1, Math.trunc(Number(e.order) || t + 1));
  return {
    id: O(e.id, `frame-${String(r).padStart(2, "0")}`),
    order: r,
    title: O(
      e.title,
      `画面 ${String(r).padStart(2, "0")}`
    ),
    description: O(e.description),
    prompt: O(e.prompt),
    status: O(e.status),
    image: pr(
      e.image,
      e.image_url,
      e.imageUrl
    ),
    error: O(e.error),
    assetID: ye(e.asset_id, e.assetId, e.assetID),
    assetVersionID: ye(
      e.asset_version_id,
      e.assetVersionId,
      e.assetVersionID
    )
  };
}
function pr(...e) {
  for (const t of e) {
    const r = {
      image: /* @__PURE__ */ new Set(),
      video: /* @__PURE__ */ new Set(),
      audio: /* @__PURE__ */ new Set()
    };
    z(t, r, /* @__PURE__ */ new Set(), 0, "image");
    const n = r.image.values().next().value;
    if (typeof n == "string" && n.trim())
      return n.trim();
  }
  return "";
}
function ye(...e) {
  for (const t of e) {
    const r = Math.trunc(Number(t) || 0);
    if (r > 0)
      return r;
  }
  return 0;
}
function z(e, t, r, n, i) {
  if (e == null || n > 12)
    return;
  if (Array.isArray(e)) {
    e.forEach(
      (c) => z(c, t, r, n + 1, i)
    );
    return;
  }
  if (typeof e == "string") {
    const c = Pe(e);
    if (c.length > 0) {
      c.forEach(
        (h) => z(h, t, r, n + 1, i)
      );
      return;
    }
    const l = i || yr(e);
    if (l) {
      const h = e.trim();
      h && t[l].add(h);
    }
    return;
  }
  if (typeof e != "object" || r.has(e))
    return;
  r.add(e);
  const s = e;
  if (i)
    for (const c of [
      s.url,
      s.src,
      s.thumbnail,
      s.download_url,
      s.downloadUrl
    ])
      z(c, t, r, n + 1, i);
  for (const c of fe)
    for (const l of hr(s, c))
      z(l, t, r, n + 1, c);
  const a = gr(s.type), d = b(s.attrs) ? s.attrs : void 0;
  if (a && [s.url, s.src, d?.src, d?.url].some(ee))
    for (const c of [s.url, s.src, d?.src, d?.url])
      z(c, t, r, n + 1, a);
  for (const c of [
    s.rich,
    s.content,
    s.output,
    s.result,
    s.data,
    s.body,
    s.value,
    s.json,
    s.media_files,
    s.mediaFiles
  ])
    z(c, t, r, n + 1);
}
function hr(e, t) {
  return rr[t].map((r) => e[r]);
}
function gr(e) {
  const t = String(e || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
  if (["image", "mediaimage", "editormediaimage"].includes(t))
    return "image";
  if (["video", "mediavideo", "editormediavideo"].includes(t))
    return "video";
  if (["audio", "music", "voice", "mediaaudio", "editormediaaudio"].includes(
    t
  ))
    return "audio";
}
function yr(e) {
  const t = e.trim();
  if (/\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i.test(t))
    return "image";
  if (/\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(t))
    return "video";
  if (/\.(mp3|wav|ogg|m4a|aac)(?:[?#].*)?$/i.test(t))
    return "audio";
}
function br(e) {
  return b(e) ? e.type === "doc" && Array.isArray(e.content) ? e : b(e.rich) && e.rich.type === "doc" && Array.isArray(e.rich.content) ? e.rich : null : null;
}
function Ke(e) {
  return b(e) ? e.type === "text" ? !Array.isArray(e.marks) || e.marks.length === 0 : e.type === "hardBreak" ? !0 : te(e) ? !!Ze(e) : e.type !== "doc" && e.type !== "paragraph" ? !1 : Array.isArray(e.content) && e.content.every(Ke) : !1;
}
function He(e) {
  return e.type === "text" ? String(e.text || "") : e.type === "hardBreak" ? `
` : te(e) ? `![${wr(
    String(e.attrs?.alt || e.attrs?.caption || "图片")
  )}](<${_r(Ze(e))}>)` : Array.isArray(e.content) ? e.content.map(He).join("") : "";
}
function qe(e) {
  return e.type === "text" ? String(e.text || "") : e.type === "hardBreak" ? `
` : te(e) ? "" : Array.isArray(e.content) ? e.content.map(qe).join("") : "";
}
function Ye(e) {
  return te(e) || !!e.content?.some((t) => Ye(t));
}
function te(e) {
  return ["image", "mediaImage", "editorMediaImage"].includes(
    String(e.type || "")
  );
}
function Ze(e) {
  return String(e.attrs?.src || "").trim();
}
function wr(e) {
  return e.replace(/([\\\[\]])/g, "\\$1");
}
function _r(e) {
  return e.replace(/</g, "%3C").replace(/>/g, "%3E");
}
const Xe = {
  image: "images",
  audio: "audios",
  video: "videos",
  file: "files"
}, xr = {
  image: ["images", "image_urls", "imageUrls"],
  audio: ["audios", "audio_urls", "audioUrls"],
  video: ["videos", "video_urls", "videoUrls"],
  file: ["files", "file_urls", "fileUrls"]
};
function Qe(e, t) {
  const r = Xe[e], n = r ? re(t, e) : [];
  if (r && n.length > 0)
    return { [r]: n };
  const i = le(t);
  if (!i)
    return t;
  const s = We(i);
  return s && (e === "text" || or(s.plainText)) ? { text: s.markdown } : { rich: i };
}
function Nr(e, t) {
  return re(e, t)[0] || "";
}
function re(e, t) {
  const r = [];
  return R(e, t, 0, r, /* @__PURE__ */ new Set()), r;
}
function Fn(e, t) {
  if (!Xe[t])
    return 0;
  const r = re(e, t).length;
  if (!e || typeof e != "object" || Array.isArray(e))
    return r;
  const n = Number(
    e.media_count || 0
  );
  return Math.max(
    r,
    Number.isFinite(n) ? Math.trunc(n) : 0
  );
}
function R(e, t, r, n, i) {
  if (r > 12 || e == null) return;
  if (typeof e == "string") {
    const l = e.trim();
    if ((l.startsWith("{") || l.startsWith("[") || l.startsWith('"')) && l.length > 1)
      try {
        R(
          JSON.parse(l),
          t,
          r + 1,
          n,
          i
        );
        return;
      } catch {
      }
    pe(l) && !i.has(l) && (i.add(l), n.push(l));
    return;
  }
  if (Array.isArray(e)) {
    for (const l of e)
      R(l, t, r + 1, n, i);
    return;
  }
  if (typeof e != "object") return;
  const s = e, a = Sr(s), d = {
    collection: [],
    text: [],
    image: [
      "src",
      "url",
      "image",
      "image_url",
      "imageUrl",
      "file_url",
      "fileUrl"
    ],
    audio: [
      "src",
      "url",
      "audio",
      "audio_url",
      "audioUrl",
      "file_url",
      "fileUrl"
    ],
    video: [
      "src",
      "url",
      "video",
      "video_url",
      "videoUrl",
      "file_url",
      "fileUrl"
    ],
    richtext: ["src", "url"],
    file: [
      "src",
      "url",
      "file",
      "file_url",
      "fileUrl",
      "download",
      "open_url",
      "path"
    ]
  };
  if (!a || a === t)
    for (const l of d[t])
      R(s[l], t, r + 1, n, i);
  for (const l of xr[t] || [])
    R(s[l], t, r + 1, n, i);
  a === t && R(s.attrs, t, r + 1, n, i);
  const c = [
    "content",
    "output",
    "result",
    "data",
    "body",
    "value",
    "json",
    "rich",
    "media_files",
    "mediaFiles",
    "text"
  ];
  for (const l of c)
    R(s[l], t, r + 1, n, i);
}
function Sr(e) {
  const t = [e.type, e.kind, e.media_type, e.mime].map((r) => String(r || "").trim().toLowerCase()).find(Boolean);
  return t ? t.includes("image") ? "image" : t.includes("video") ? "video" : t.includes("audio") || t.includes("music") ? "audio" : t.includes("file") ? "file" : "" : "";
}
function q(e, t = 0) {
  if (t > 8 || e == null) return "";
  if (typeof e == "string") return pe(e) ? "" : e.trim();
  if (Array.isArray(e))
    return e.map((n) => q(n, t + 1)).filter(Boolean)[0] || "";
  if (typeof e != "object") return "";
  const r = e;
  for (const n of [
    "summary",
    "title",
    "text",
    "caption",
    "content",
    "output",
    "result"
  ]) {
    const i = q(r[n], t + 1);
    if (i) return i;
  }
  return "";
}
function Bn(e) {
  const t = e?.source?.prompt;
  return typeof t == "string" ? t.trim() : "";
}
function kr(e) {
  const t = Nr(e, "file"), r = W(e) || Ir(t), n = r.match(/\.([a-z0-9]{1,10})$/i)?.[1] || "";
  return { url: t, name: r, extension: n };
}
function W(e, t = 0) {
  if (e == null || t > 8) return "";
  if (typeof e == "string") {
    const n = e.trim();
    return pe(n) ? "" : n;
  }
  if (Array.isArray(e)) {
    for (const n of e) {
      const i = W(n, t + 1);
      if (i) return i;
    }
    return "";
  }
  if (typeof e != "object") return "";
  const r = e;
  for (const n of [
    "name",
    "file_name",
    "fileName",
    "filename",
    "label",
    "title"
  ]) {
    const i = W(r[n], t + 1);
    if (i) return i;
  }
  for (const n of [
    "file",
    "files",
    "attrs",
    "data",
    "content",
    "output",
    "result"
  ]) {
    const i = W(r[n], t + 1);
    if (i) return i;
  }
  return "";
}
function Ir(e) {
  if (!e || /^(data|blob):/.test(e)) return "";
  const t = e.split(/[?#]/, 1)[0], r = t.slice(t.lastIndexOf("/") + 1);
  if (!r) return "";
  try {
    return decodeURIComponent(r);
  } catch {
    return r;
  }
}
function pe(e) {
  return /^(https?:\/\/|\/|data:|blob:)/.test(e.trim());
}
const Mr = "bot_work", Ar = "神创工作台", Cr = /* @__PURE__ */ new Set([
  "txt",
  "md",
  "markdown",
  "mdown",
  "mkd"
]), { uploadFileByRule: be } = Z("@/lib/upload");
async function Un(e) {
  if (!be)
    throw new Error("当前页面缺少上传能力");
  const t = [];
  for (const r of e.files) {
    const n = zr(e.kind) || Or(r), i = Number(e.ruleID || 0) || Rr(n), s = n === "text" ? await r.text() : void 0, a = await be(i, r, {
      kind: n,
      bizKey: Mr,
      bizName: Ar,
      reportError: !1
    }), d = Number(a.id || 0), [c] = await Dr({
      teamID: e.teamID,
      projectID: e.projectID,
      files: [a],
      textContents: s === void 0 ? void 0 : /* @__PURE__ */ new Map([[d, s]])
    });
    if (!c)
      throw new Error(`${r.name} 保存到资产库失败`);
    t.push({ sourceFile: r, uploadedFile: a, asset: c });
  }
  return t;
}
async function Dr(e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const n of e.files) {
    const i = Number(n.id || 0);
    if (!Number.isFinite(i) || i <= 0)
      throw new Error("上传文件标识无效");
    if (r.has(i))
      continue;
    const s = await k(
      I("workbench/upload_save_asset"),
      "post",
      {
        team_id: e.teamID,
        project_id: e.projectID || void 0,
        file_id: i,
        text_content: e.textContents?.get(i)
      },
      { reportError: !1 }
    );
    if (!ot(s))
      throw new Error(
        String(s?.message || s?.msg || "保存上传资产失败")
      );
    const a = s?.data?.asset;
    if (!a || typeof a != "object" || Array.isArray(a))
      throw new Error("保存上传资产结果为空");
    r.add(i), t.push(a);
  }
  return t;
}
function Or(e) {
  const t = String(e.type || "").toLowerCase();
  return t.startsWith("image/") ? "image" : t.startsWith("video/") ? "video" : t.startsWith("audio/") ? "audio" : ["text/plain", "text/markdown", "text/x-markdown"].includes(t) || Cr.has(Lr(e.name)) ? "text" : "file";
}
function zr(e) {
  const t = String(e || "").toLowerCase();
  return ["image", "video", "audio", "text", "file"].includes(t) ? t : "";
}
function Rr(e) {
  return e === "image" ? 1 : e === "video" ? 2 : e === "audio" ? 3 : 7;
}
function Lr(e) {
  const t = String(e || "").trim().toLowerCase(), r = t.lastIndexOf(".");
  return r >= 0 ? t.slice(r + 1) : "";
}
const $r = ft.HoverTip, Tr = 12e3;
function Y({
  label: e,
  side: t = "top",
  sideOffset: r = 7,
  className: n = "",
  children: i
}) {
  return /* @__PURE__ */ o(
    $r,
    {
      content: e,
      side: t,
      sideOffset: r,
      layerZIndex: Tr,
      className: `max-w-80 whitespace-normal break-words ${n}`.trim(),
      children: i
    }
  );
}
const we = Z(
  "@/components/energon/content-view"
), _e = we.ContentView || we.EnergonContentView;
function et({
  output: e,
  fallback: t = "",
  streaming: r = !1,
  emptyText: n = "暂无内容",
  className: i,
  markdownClassName: s,
  richClassName: a,
  mediaLayout: d = "default"
}) {
  const c = Pr(e, t);
  return _e ? /* @__PURE__ */ o(jr, { className: i, children: /* @__PURE__ */ o(
    _e,
    {
      output: c,
      streaming: r,
      emptyText: n,
      markdownClassName: s,
      richClassName: a,
      mediaLayout: d
    }
  ) }) : t ? /* @__PURE__ */ o("div", { className: i, children: t }) : null;
}
function Pr(e, t = "") {
  return ee(e) ? e : t ? { text: t } : e;
}
function jr({
  className: e,
  children: t
}) {
  const r = (n) => {
    Er(n.target) && n.stopPropagation();
  };
  return /* @__PURE__ */ o(
    "div",
    {
      className: e,
      onPointerDown: r,
      onClick: r,
      children: t
    }
  );
}
function Er(e) {
  return e instanceof Element && !!e.closest(
    "a, button, input, textarea, select, audio, video, [role='button']"
  );
}
const vr = ht.EnergonAudioPlayer;
function xe({
  src: e,
  prompt: t = "",
  detailed: r = !1,
  autoPlay: n = !1
}) {
  const i = /* @__PURE__ */ o(
    "div",
    {
      className: [
        "wb-asset-audio-preview",
        r ? "is-detail" : ""
      ].filter(Boolean).join(" "),
      children: /* @__PURE__ */ o(
        vr,
        {
          src: e,
          detailed: r,
          autoPlay: n,
          className: "h-full min-h-0 border-0 bg-transparent p-0 shadow-none"
        }
      )
    }
  );
  return r ? /* @__PURE__ */ f("div", { className: "wb-asset-audio-detail", children: [
    i,
    t ? /* @__PURE__ */ f("section", { className: "wb-asset-audio-prompt", children: [
      /* @__PURE__ */ f("header", { children: [
        /* @__PURE__ */ o(oe, { "aria-hidden": "true" }),
        /* @__PURE__ */ o("strong", { children: "语音文本" })
      ] }),
      /* @__PURE__ */ o("p", { children: t })
    ] }) : null
  ] }) : i;
}
function Ne({
  content: e,
  summary: t,
  compact: r = !1
}) {
  const n = kr(e), i = n.name || t || "文件", s = n.extension ? n.extension.toUpperCase() : "FILE", a = n.extension ? `${n.extension.toUpperCase()} 文件` : "文件";
  return r ? /* @__PURE__ */ f("div", { className: "wb-asset-file-card-preview", children: [
    /* @__PURE__ */ o("strong", { children: s }),
    /* @__PURE__ */ o(Y, { label: i, children: /* @__PURE__ */ o("p", { children: i }) }),
    /* @__PURE__ */ o("span", { children: "文件" })
  ] }) : /* @__PURE__ */ f("section", { className: "wb-asset-file-preview", children: [
    /* @__PURE__ */ o("span", { className: "wb-asset-file-icon", children: /* @__PURE__ */ o(oe, { "aria-hidden": "true" }) }),
    /* @__PURE__ */ f("div", { className: "wb-asset-file-copy", children: [
      /* @__PURE__ */ o(Y, { label: i, children: /* @__PURE__ */ o("strong", { children: i }) }),
      /* @__PURE__ */ o("span", { children: a })
    ] }),
    n.url ? /* @__PURE__ */ f("a", { href: n.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ o(gt, { "aria-hidden": "true" }),
      /* @__PURE__ */ o("span", { children: "打开文件" })
    ] }) : /* @__PURE__ */ o("span", { className: "wb-asset-file-unavailable", children: "文件暂不可用" })
  ] });
}
function Se({
  kind: e,
  src: t
}) {
  const r = Ae(null), [n, i] = C(""), [s, a] = C(""), [d, c] = C(""), l = n === t, h = s === t, u = d === t;
  $(() => {
    const M = r.current;
    if (!t || !M || typeof IntersectionObserver > "u") {
      i(t);
      return;
    }
    const w = new IntersectionObserver(
      (p) => {
        p.some((_) => _.isIntersecting) && (i(t), w.disconnect());
      },
      { rootMargin: "320px 0px" }
    );
    return w.observe(M), () => w.disconnect();
  }, [t]);
  function x() {
    a(t), c("");
  }
  function N() {
    a(""), c(t);
  }
  return /* @__PURE__ */ f(
    "div",
    {
      ref: r,
      className: [
        "wb-asset-lazy-cover",
        `is-${e}`,
        h ? "is-loaded" : "is-pending",
        u ? "is-failed" : ""
      ].filter(Boolean).join(" "),
      children: [
        l && !u ? e === "image" ? /* @__PURE__ */ o(
          "img",
          {
            src: t,
            alt: "",
            loading: "lazy",
            decoding: "async",
            onLoad: x,
            onError: N
          }
        ) : /* @__PURE__ */ o(
          Oe,
          {
            src: t,
            muted: !0,
            playsInline: !0,
            preload: "metadata",
            "aria-hidden": "true",
            onFirstFrameReady: x,
            onError: N
          }
        ) : null,
        u ? /* @__PURE__ */ o("span", { children: "封面加载失败" }) : null
      ]
    }
  );
}
function Fr({
  kind: e,
  content: t,
  summary: r
}) {
  const n = Qe(e, t), i = r || q(t) || $e(e), s = dr(n, "storyboard") ? { text: i } : n;
  return /* @__PURE__ */ o("div", { className: `wb-asset-card-text-preview is-${e}`, children: /* @__PURE__ */ o(
    et,
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
function Vn({
  kind: e,
  content: t,
  summary: r,
  prompt: n,
  compact: i = !1
}) {
  const s = re(t, e), a = s[0] || "";
  if (!i) {
    if ((e === "image" || e === "video") && s.length > 0)
      return /* @__PURE__ */ o(
        mt,
        {
          kind: e,
          urls: s,
          downloadable: !0,
          className: "wb-asset-media-gallery"
        }
      );
    if (e === "audio")
      return /* @__PURE__ */ o(xe, { src: a, prompt: n, detailed: !0 });
    if (e === "file")
      return /* @__PURE__ */ o(Ne, { content: t, summary: r });
    const d = Qe(e, t);
    return /* @__PURE__ */ o(
      et,
      {
        output: d,
        fallback: r || "",
        emptyText: "该版本暂无可预览内容",
        className: "wb-asset-preview-content",
        markdownClassName: "wb-asset-detail-prose",
        richClassName: "wb-asset-detail-prose",
        mediaLayout: "detail"
      }
    );
  }
  return e === "image" && a ? /* @__PURE__ */ o(Se, { kind: "image", src: a }) : e === "video" && a ? /* @__PURE__ */ o(Se, { kind: "video", src: a }) : e === "audio" ? /* @__PURE__ */ o(xe, { src: a }) : e === "file" ? /* @__PURE__ */ o(Ne, { content: t, summary: r, compact: !0 }) : e === "text" || e === "richtext" ? /* @__PURE__ */ o(
    Fr,
    {
      kind: e,
      content: t,
      summary: r
    }
  ) : /* @__PURE__ */ o("div", { className: "wb-asset-card-fallback", children: /* @__PURE__ */ o("p", { children: r || q(t) || $e(e) }) });
}
function Jn({ kind: e }) {
  switch (e) {
    case "collection":
      return /* @__PURE__ */ o(lt, { "aria-hidden": "true" });
    case "image":
      return /* @__PURE__ */ o(ze, { "aria-hidden": "true" });
    case "audio":
      return /* @__PURE__ */ o(xt, { "aria-hidden": "true" });
    case "video":
      return /* @__PURE__ */ o(St, { "aria-hidden": "true" });
    case "file":
      return /* @__PURE__ */ o(Ct, { "aria-hidden": "true" });
    default:
      return /* @__PURE__ */ o(oe, { "aria-hidden": "true" });
  }
}
function Br({
  ariaLabel: e,
  header: t,
  children: r,
  onRequestClose: n,
  layer: i = "default"
}) {
  const s = /* @__PURE__ */ o(
    "div",
    {
      className: `wb-detail-backdrop ${i === "nested" ? "is-nested" : ""}`.trim(),
      role: "presentation",
      onMouseDown: () => {
        n();
      },
      children: /* @__PURE__ */ f(
        "section",
        {
          className: "wb-detail-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": e,
          onMouseDown: (a) => a.stopPropagation(),
          children: [
            t,
            r
          ]
        }
      )
    }
  );
  return typeof document > "u" ? null : st(s, document.body);
}
function Ur({
  icon: e,
  title: t,
  subtitle: r,
  versionSelect: n,
  state: i,
  updatedAt: s,
  actions: a,
  downloadUrl: d,
  onClose: c
}) {
  return /* @__PURE__ */ f("header", { className: "wb-detail-head", children: [
    /* @__PURE__ */ f("div", { className: "wb-detail-heading", children: [
      /* @__PURE__ */ o("span", { className: "wb-detail-kind-icon", "aria-hidden": "true", children: e }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ o("strong", { children: t || "详情" }),
        r ? /* @__PURE__ */ o("span", { children: r }) : null
      ] })
    ] }),
    /* @__PURE__ */ f("div", { className: "wb-detail-meta", children: [
      n,
      i,
      s ? /* @__PURE__ */ o("time", { children: s }) : null
    ] }),
    /* @__PURE__ */ f("div", { className: "wb-detail-actions", children: [
      a,
      d ? /* @__PURE__ */ o(Y, { label: "下载内容", children: /* @__PURE__ */ o(
        "a",
        {
          href: d,
          download: !0,
          className: "wb-detail-icon-button",
          "aria-label": "下载内容",
          children: /* @__PURE__ */ o(ut, { size: 17 })
        }
      ) }) : null,
      /* @__PURE__ */ o(Y, { label: "关闭", children: /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          className: "wb-detail-icon-button",
          onClick: c,
          "aria-label": "关闭详情",
          children: /* @__PURE__ */ o(at, { size: 18 })
        }
      ) })
    ] })
  ] });
}
function Gn({
  options: e,
  currentVersionId: t,
  selectedVersionId: r,
  total: n,
  hasMore: i,
  loading: s,
  loadingMore: a,
  error: d,
  disabled: c = !1,
  onSelect: l,
  onLoadMore: h,
  onRetry: u
}) {
  const [x, N] = C(!1), M = Ae(null), w = e.find((p) => p.id === r) || e.find((p) => p.id === t);
  return $(() => {
    if (!x) return;
    const p = (_) => {
      M.current?.contains(_.target) || N(!1);
    };
    return document.addEventListener("mousedown", p), () => document.removeEventListener("mousedown", p);
  }, [x]), !r && !s ? null : /* @__PURE__ */ f("div", { className: "wb-detail-version-select", ref: M, children: [
    /* @__PURE__ */ f(
      "button",
      {
        type: "button",
        className: "wb-detail-version-trigger",
        "aria-haspopup": "listbox",
        "aria-expanded": x,
        disabled: c || s && e.length === 0,
        onClick: () => N((p) => !p),
        children: [
          s && e.length === 0 ? /* @__PURE__ */ o(ie, { size: 12, className: "wb-detail-spin" }) : null,
          /* @__PURE__ */ o("span", { children: Ie(w?.version) }),
          n > 0 ? /* @__PURE__ */ f("small", { children: [
            n,
            " 个版本"
          ] }) : null,
          /* @__PURE__ */ o(Le, { size: 13 })
        ]
      }
    ),
    x ? /* @__PURE__ */ o("div", { className: "wb-detail-version-menu", role: "listbox", children: /* @__PURE__ */ f(
      "div",
      {
        className: "wb-detail-version-options",
        onScroll: (p) => {
          const _ = p.currentTarget;
          i && !a && _.scrollHeight - _.scrollTop - _.clientHeight < 36 && h();
        },
        children: [
          e.length > 0 ? e.map((p) => {
            const _ = p.id === r, U = p.id === t;
            return /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": _,
                className: _ ? "is-selected" : "",
                onClick: () => {
                  N(!1), l(p.value);
                },
                children: [
                  /* @__PURE__ */ f("span", { children: [
                    /* @__PURE__ */ o("strong", { children: Ie(p.version) }),
                    U ? /* @__PURE__ */ o("small", { children: "当前" }) : null
                  ] }),
                  /* @__PURE__ */ o("time", { children: Vr(p.updatedAt) }),
                  _ ? /* @__PURE__ */ o(Re, { size: 13 }) : /* @__PURE__ */ o("i", { "aria-hidden": "true" })
                ]
              },
              p.id
            );
          }) : d ? /* @__PURE__ */ o(ke, { error: d, onRetry: u }) : /* @__PURE__ */ f("div", { className: "wb-detail-version-message", children: [
            s ? /* @__PURE__ */ o(ie, { size: 14, className: "wb-detail-spin" }) : null,
            /* @__PURE__ */ o("span", { children: s ? "正在读取版本" : "暂无版本" })
          ] }),
          d && e.length > 0 ? /* @__PURE__ */ o(ke, { error: d, onRetry: u }) : null,
          a ? /* @__PURE__ */ f("div", { className: "wb-detail-version-loading", children: [
            /* @__PURE__ */ o(ie, { size: 13, className: "wb-detail-spin" }),
            "正在加载更多"
          ] }) : null
        ]
      }
    ) }) : null
  ] });
}
function ke({
  error: e,
  onRetry: t
}) {
  return /* @__PURE__ */ f("div", { className: "wb-detail-version-message is-error", children: [
    /* @__PURE__ */ o("span", { children: e }),
    /* @__PURE__ */ f("button", { type: "button", onClick: t, children: [
      /* @__PURE__ */ o(Ot, { size: 12 }),
      "重试"
    ] })
  ] });
}
function Ie(e) {
  const t = Number(e || 0);
  return t > 0 ? `第${t}版` : "版本";
}
function Vr(e) {
  const t = String(e || "").trim();
  return t ? t.replace("T", " ").replace(/\.\d+(Z)?$/, "").replace(/Z$/, "") : "";
}
const P = Z("@/components/ui/dropdown-menu");
if (!P || Object.keys(P).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const Jr = P.DropdownMenu, Gr = P.DropdownMenuContent, Wr = P.DropdownMenuItem, Kr = P.DropdownMenuTrigger;
function tt(e, t) {
  const r = er(t, e), n = Math.max(1, Math.ceil(e / r.capacity)), [i, s] = C(0);
  $(() => {
    s((d) => Math.min(d, n - 1));
  }, [n]);
  const a = Math.min(i, n - 1);
  return {
    shape: r,
    pageCount: n,
    pageIndex: a,
    pageOffset: a * r.capacity,
    setPageIndex: s
  };
}
function rt({
  layout: e,
  countLabel: t,
  pageIndex: r,
  pageCount: n,
  disabled: i = !1,
  leading: s,
  actions: a,
  onLayoutChange: d,
  onPageChange: c
}) {
  const l = ue(e), h = Ge(l);
  return /* @__PURE__ */ f("header", { className: "ws-media-grid-toolbar", children: [
    /* @__PURE__ */ f("div", { className: "ws-media-grid-toolbar-main", children: [
      s,
      /* @__PURE__ */ f(Jr, { modal: !1, children: [
        /* @__PURE__ */ o(Kr, { asChild: !0, children: /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            className: "ws-media-grid-layout-trigger nodrag nopan",
            disabled: i || !d,
            "aria-label": "选择每页宫格布局",
            onClick: (u) => u.stopPropagation(),
            children: [
              /* @__PURE__ */ o(It, { size: 14 }),
              h.label,
              /* @__PURE__ */ o(Le, { size: 12 })
            ]
          }
        ) }),
        /* @__PURE__ */ o(
          Gr,
          {
            align: "start",
            className: "ws-media-grid-layout-menu",
            onClick: (u) => u.stopPropagation(),
            children: H.map((u) => /* @__PURE__ */ f(
              Wr,
              {
                className: "ws-media-grid-layout-item",
                onSelect: () => {
                  c(0), d?.(u.value);
                },
                children: [
                  /* @__PURE__ */ o("span", { children: u.label }),
                  /* @__PURE__ */ o("small", { children: u.value === "auto" ? "按结果排版" : `每页 ${u.capacity} 格` }),
                  u.value === l ? /* @__PURE__ */ o(Re, { size: 13 }) : null
                ]
              },
              u.value
            ))
          }
        )
      ] }),
      /* @__PURE__ */ o("span", { className: "ws-media-grid-count", children: t }),
      n > 1 ? /* @__PURE__ */ f("div", { className: "ws-media-grid-page-controls", "aria-label": "宫格分页", children: [
        /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: r <= 0,
            title: "上一页",
            "aria-label": "上一页",
            onClick: (u) => {
              u.stopPropagation(), c(Math.max(0, r - 1));
            },
            children: /* @__PURE__ */ o(dt, { size: 14 })
          }
        ),
        /* @__PURE__ */ f("span", { children: [
          r + 1,
          "/",
          n
        ] }),
        /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: r >= n - 1,
            title: "下一页",
            "aria-label": "下一页",
            onClick: (u) => {
              u.stopPropagation(), c(Math.min(n - 1, r + 1));
            },
            children: /* @__PURE__ */ o(bt, { size: 14 })
          }
        )
      ] }) : null
    ] }),
    a ? /* @__PURE__ */ o("div", { className: "ws-media-grid-toolbar-actions", children: a }) : null
  ] });
}
function Wn({
  kind: e,
  urls: t,
  label: r
}) {
  const [n, i] = C("auto"), s = tt(t.length, n), a = t.slice(
    s.pageOffset,
    s.pageOffset + s.shape.capacity
  ), d = Array.from(
    { length: s.shape.capacity },
    (l, h) => a[h]
  ), c = e === "image" ? "图片" : "视频";
  return /* @__PURE__ */ f("section", { className: `ws-media-grid-view is-${e}`, children: [
    /* @__PURE__ */ o(
      rt,
      {
        layout: n,
        countLabel: `${t.length} ${e === "image" ? "张" : "个"}`,
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
        children: d.map((l, h) => {
          const u = s.pageOffset + h;
          return l ? /* @__PURE__ */ f("figure", { children: [
            e === "image" ? /* @__PURE__ */ o(
              "img",
              {
                src: l,
                alt: `${r || c} ${u + 1}`,
                loading: "lazy",
                decoding: "async",
                draggable: !1
              }
            ) : /* @__PURE__ */ o(
              Oe,
              {
                src: l,
                muted: !0,
                playsInline: !0,
                preload: "metadata",
                draggable: !1,
                "aria-label": `${r || c} ${u + 1}`
              },
              l
            ),
            e === "video" ? /* @__PURE__ */ o("span", { className: "ws-media-grid-play", "aria-hidden": "true", children: /* @__PURE__ */ o(wt, { size: 12, fill: "currentColor" }) }) : null
          ] }, `${l}-${u}`) : /* @__PURE__ */ o("figure", { className: "is-empty" }, `empty-${u}`);
        })
      }
    ) })
  ] });
}
function Hr({
  items: e,
  initialItemID: t,
  onClose: r
}) {
  const n = Me(e, t), [i, s] = C(n), a = e.map((l) => `${String(l.id)}:${l.url}`).join(`
`);
  $(() => {
    s(Me(e, t));
  }, [t, a]), $(() => {
    const l = (h) => {
      h.key === "Escape" && r();
    };
    return document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l);
  }, [r]);
  const d = Math.min(
    Math.max(0, i),
    Math.max(0, e.length - 1)
  ), c = e[d];
  return c ? /* @__PURE__ */ o(
    Br,
    {
      ariaLabel: "图片预览",
      layer: "nested",
      onRequestClose: r,
      header: /* @__PURE__ */ o(
        Ur,
        {
          icon: /* @__PURE__ */ o(ze, { size: 16 }),
          title: c.name || "图片预览",
          subtitle: `图片 ${d + 1}/${e.length}`,
          downloadUrl: c.url,
          onClose: r
        }
      ),
      children: /* @__PURE__ */ o("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ o(
        pt,
        {
          kind: "image",
          items: e,
          activeIndex: d,
          onSelect: s
        }
      ) })
    }
  ) : null;
}
function Me(e, t) {
  const r = e.findIndex((n) => String(n.id) === String(t));
  return r >= 0 ? r : 0;
}
function qr({
  grid: e,
  variant: t = "compact",
  readonly: r = !0,
  renderFrameAction: n,
  onFrameChange: i,
  onFrameImport: s,
  onEmptyFrameImport: a,
  capacity: d,
  showHeader: c = !0,
  showCaptions: l = !0,
  columns: h,
  rows: u,
  frameOffset: x = 0,
  previewFrames: N
}) {
  const [M, w] = C(
    null
  ), p = it(
    () => (N || e.frames).filter((m) => !!m.image).map((m) => ({
      id: m.id || m.order,
      name: m.title || `画面 ${m.order}`,
      url: m.image,
      thumbnail: m.image
    })),
    [e.frames, N]
  ), _ = Math.max(
    e.frames.length,
    Math.trunc(Number(d) || 0)
  ), U = Array.from(
    { length: _ },
    (m, ne) => e.frames[ne]
  ), nt = {
    ...h ? { gridTemplateColumns: `repeat(${h}, minmax(0, 1fr))` } : {},
    ...u ? { gridTemplateRows: `repeat(${u}, minmax(0, 1fr))` } : {}
  };
  return /* @__PURE__ */ f("section", { className: `ws-storyboard-grid-output is-${t}`, children: [
    c ? /* @__PURE__ */ f("header", { children: [
      /* @__PURE__ */ o("strong", { children: e.title }),
      e.summary ? /* @__PURE__ */ o("p", { children: e.summary }) : null
    ] }) : null,
    /* @__PURE__ */ o(
      "div",
      {
        className: "ws-storyboard-grid-output-list",
        "data-count": U.length,
        style: nt,
        children: U.map((m, ne) => {
          const D = x + ne;
          return m ? /* @__PURE__ */ f("figure", { className: m.image ? "" : "is-empty", children: [
            m.image ? /* @__PURE__ */ o(
              Yr,
              {
                frame: m,
                onPreview: () => w(m.id || m.order)
              }
            ) : s ? /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-empty nodrag nopan",
                title: "导入图片",
                "aria-label": `向第 ${m.order} 格导入图片`,
                onClick: (S) => {
                  S.preventDefault(), S.stopPropagation(), s(m, D);
                },
                children: /* @__PURE__ */ o(v, { size: 18 })
              }
            ) : /* @__PURE__ */ o("div", { className: "ws-storyboard-grid-output-error", children: m.error || "暂无图片" }),
            m.image && s ? /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-import nodrag nopan",
                title: "替换图片",
                "aria-label": `替换第 ${m.order} 格图片`,
                onClick: (S) => {
                  S.preventDefault(), S.stopPropagation(), s(m, D);
                },
                children: /* @__PURE__ */ o(v, { size: 14 })
              }
            ) : null,
            l ? /* @__PURE__ */ f("figcaption", { children: [
              /* @__PURE__ */ o("span", { children: String(m.order).padStart(2, "0") }),
              t === "detail" && !r && i ? /* @__PURE__ */ o(
                "input",
                {
                  value: m.title,
                  "aria-label": `第 ${m.order} 格标题`,
                  onChange: (S) => i(D, { title: S.target.value })
                }
              ) : /* @__PURE__ */ o("strong", { children: m.title })
            ] }) : null,
            t === "detail" ? /* @__PURE__ */ f("div", { className: "ws-storyboard-grid-output-details", children: [
              r || !i ? /* @__PURE__ */ o("p", { children: m.description || "暂无画面说明" }) : /* @__PURE__ */ o(
                "textarea",
                {
                  value: m.description,
                  rows: 3,
                  "aria-label": `第 ${m.order} 格说明`,
                  placeholder: "画面说明",
                  onChange: (S) => i(D, {
                    description: S.target.value
                  })
                }
              ),
              n ? /* @__PURE__ */ o("div", { className: "ws-storyboard-grid-output-actions", children: n(m, D) }) : null
            ] }) : null
          ] }, m.id) : /* @__PURE__ */ o("figure", { className: "is-empty", children: a ? /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              className: "ws-storyboard-grid-frame-empty nodrag nopan",
              title: "导入图片",
              "aria-label": `向第 ${D + 1} 格导入图片`,
              onClick: (S) => {
                S.preventDefault(), S.stopPropagation(), a(D);
              },
              children: /* @__PURE__ */ o(v, { size: 18 })
            }
          ) : null }, `empty-${D}`);
        })
      }
    ),
    M != null && p.length > 0 ? /* @__PURE__ */ o(
      Hr,
      {
        items: p,
        initialItemID: M,
        onClose: () => w(null)
      }
    ) : null
  ] });
}
function Yr({
  frame: e,
  onPreview: t
}) {
  const [r, n] = C(!1);
  return $(() => {
    n(!1);
  }, [e.image]), r ? /* @__PURE__ */ o("div", { className: "ws-storyboard-grid-output-error", children: e.error || "图片加载失败" }) : /* @__PURE__ */ o(
    "button",
    {
      type: "button",
      className: "ws-storyboard-grid-image nodrag nopan",
      title: "预览图片",
      "aria-label": `预览第 ${e.order} 格图片`,
      onClick: (i) => {
        i.preventDefault(), i.stopPropagation(), t();
      },
      children: /* @__PURE__ */ o(
        "img",
        {
          src: e.image,
          alt: e.title,
          loading: "lazy",
          decoding: "async",
          onError: () => n(!0)
        }
      )
    }
  );
}
function Kn({
  grid: e,
  aspectRatio: t,
  running: r = !1,
  onImport: n,
  onFrameImport: i,
  onSlotImport: s,
  onEdit: a,
  layout: d = "auto",
  onLayoutChange: c
}) {
  const l = ue(d), h = e?.frames.length || 0, u = tt(h, l), x = e ? {
    ...e,
    frames: e.frames.slice(
      u.pageOffset,
      u.pageOffset + u.shape.capacity
    )
  } : null, N = e?.frames.filter((w) => w.image).length || 0, M = h > 0 && N !== h ? `${N}/${h} 张` : `${h} 张`;
  return /* @__PURE__ */ f(
    "section",
    {
      className: `ws-storyboard-grid-canvas ${r ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ o(
          rt,
          {
            layout: l,
            countLabel: M,
            pageIndex: u.pageIndex,
            pageCount: u.pageCount,
            disabled: r || !c,
            leading: /* @__PURE__ */ f("span", { children: [
              "比例 ",
              t || "自动"
            ] }),
            actions: n || e && a ? /* @__PURE__ */ f(ct, { children: [
              n ? /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: r,
                  onClick: (w) => {
                    w.stopPropagation(), n();
                  },
                  children: [
                    /* @__PURE__ */ o(v, { size: 14 }),
                    /* @__PURE__ */ o("span", { children: e ? "批量导入" : "导入图片" })
                  ]
                }
              ) : null,
              e && a ? /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: r,
                  onClick: (w) => {
                    w.stopPropagation(), a();
                  },
                  children: [
                    /* @__PURE__ */ o(yt, { size: 14 }),
                    /* @__PURE__ */ o("span", { children: "编辑" })
                  ]
                }
              ) : null
            ] }) : void 0,
            onLayoutChange: c,
            onPageChange: u.setPageIndex
          }
        ),
        /* @__PURE__ */ o("div", { className: "ws-storyboard-grid-canvas-body nowheel", children: x ? /* @__PURE__ */ o(
          qr,
          {
            grid: x,
            previewFrames: e?.frames,
            capacity: u.shape.capacity,
            columns: u.shape.columns,
            rows: u.shape.rows,
            frameOffset: u.pageOffset,
            showHeader: !1,
            showCaptions: !1,
            onFrameImport: r ? void 0 : i,
            onEmptyFrameImport: r ? void 0 : s
          }
        ) : /* @__PURE__ */ o(
          "div",
          {
            className: "ws-storyboard-grid-placeholder",
            "aria-busy": r,
            style: {
              gridTemplateColumns: `repeat(${u.shape.columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${u.shape.rows}, minmax(0, 1fr))`
            },
            children: Array.from({ length: u.shape.capacity }, (w, p) => /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                className: "nodrag nopan",
                disabled: r || !s,
                title: "导入图片",
                "aria-label": `向宫格导入图片，第 ${p + 1} 格`,
                onClick: (_) => {
                  _.stopPropagation(), s?.(p);
                },
                children: /* @__PURE__ */ o(v, { size: 18 })
              },
              p
            ))
          }
        ) })
      ]
    }
  );
}
export {
  O as $,
  Vn as A,
  Ar as B,
  Pe as C,
  Ur as D,
  An as E,
  Pn as F,
  Pr as G,
  jr as H,
  et as I,
  ar as J,
  ur as K,
  ee as L,
  Wn as M,
  v as N,
  cr as O,
  Ct as P,
  Nr as Q,
  Ot as R,
  qr as S,
  Un as T,
  vn as U,
  vt as V,
  jn as W,
  We as X,
  or as Y,
  Tn as Z,
  zn as _,
  Qe as a,
  Fe as a0,
  Rn as a1,
  Mn as a2,
  Cn as a3,
  ue as a4,
  Ln as a5,
  Dn as a6,
  le as a7,
  tr as a8,
  xe as a9,
  Kn as aa,
  $n as ab,
  Kt as ac,
  On as ad,
  ir as ae,
  Ft as af,
  Ee as ag,
  Fn as ah,
  Pt as ai,
  Et as aj,
  jt as ak,
  pn as al,
  hn as am,
  Nn as an,
  xn as ao,
  In as b,
  sr as c,
  En as d,
  Mr as e,
  re as f,
  Y as g,
  dr as h,
  Bn as i,
  Vr as j,
  Gn as k,
  gn as l,
  P as m,
  $e as n,
  kn as o,
  lr as p,
  Jn as q,
  _n as r,
  Dr as s,
  Br as t,
  wn as u,
  bn as v,
  yn as w,
  Sn as x,
  B as y,
  b as z
};
