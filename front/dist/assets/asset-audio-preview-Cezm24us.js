import { r as jt, R as Ut } from "./media-inspector-gallery-BR6rzcOx.js";
import { j as a, a as m } from "./space-storyboard-material-ECvLpyk_.js";
import { r as j, c as zt, n as Ft, X as Bt, ah as Pt } from "./vendor-icons-BZHLe0mm.js";
import { b as ct, d as ut, a as Vt } from "./file-kind-Cq3pESGF.js";
import { c as Jt } from "./space-assistant-layout-Drz4je9C.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./asset-audio-preview-DrQ4NEW7.css", import.meta.url).href]);
function Gt(t) {
  if (typeof t != "string")
    return t;
  const n = t.trim();
  if (!V(n))
    return t;
  try {
    return JSON.parse(n);
  } catch {
    return t;
  }
}
function f(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function qn(t) {
  return f(t) ? t : {};
}
function Qn(t) {
  return typeof t == "string" ? t.trim() : "";
}
function vn(t) {
  const n = Number(t || 0);
  return Number.isFinite(n) ? n : 0;
}
function te(t) {
  if (t == null || t === "")
    return;
  const n = Number(t);
  return Number.isFinite(n) ? n : void 0;
}
function ft(t) {
  const n = String(t || "").trim(), e = Wt(n), r = Zt(e);
  for (const i of lt([n, e, r])) {
    const o = Gt(i);
    if (o !== i)
      return o;
    const s = Kt(i);
    if (s !== i)
      return s;
  }
  return t;
}
function ne(t) {
  const n = String(t || "").trim();
  for (const e of dt(n)) {
    const r = ft(e);
    if (r !== e)
      return r;
  }
  return t;
}
function I(t) {
  const n = [];
  for (const e of dt(
    String(t || "").trim()
  )) {
    const r = ft(e);
    r !== e && n.push(r);
  }
  return n;
}
function Wt(t) {
  let n = "", e = !1, r = !1;
  for (const i of t) {
    if (r) {
      n += i, r = !1;
      continue;
    }
    if (i === "\\") {
      n += i, r = e;
      continue;
    }
    if (i === '"') {
      e = !e, n += i;
      continue;
    }
    if (e && i.charCodeAt(0) < 32) {
      n += Yt(i);
      continue;
    }
    n += i;
  }
  return n;
}
function dt(t) {
  const n = [t];
  for (const e of t.matchAll(/```(?:json|storyboard)?\s*([\s\S]*?)```/gi))
    n.push(String(e[1] || "").trim());
  return n.push(...$t(t)), lt(n);
}
function $t(t) {
  const n = [];
  for (let e = 0; e < t.length; e += 1) {
    const r = t[e];
    if (r !== "{" && r !== "[")
      continue;
    const i = Ht(t, e);
    i && (n.push(i), e += i.length - 1);
  }
  return n;
}
function Ht(t, n) {
  const e = [];
  let r = !1, i = !1;
  for (let o = n; o < t.length; o += 1) {
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
      e.push(s);
      continue;
    }
    if (s !== "}" && s !== "]")
      continue;
    const c = s === "}" ? "{" : "[";
    if (e.pop() !== c)
      return "";
    if (e.length === 0)
      return t.slice(n, o + 1).trim();
  }
  return "";
}
function V(t) {
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function Kt(t) {
  if (!t.startsWith('"') || !t.endsWith('"'))
    return t;
  try {
    const n = JSON.parse(t);
    return typeof n == "string" ? n : t;
  } catch {
    return t;
  }
}
function Yt(t) {
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
function Zt(t) {
  const n = t.trim();
  return !n.includes('\\"') || !n.startsWith("{") && !n.startsWith("[") ? t : n.replace(/\\"/g, '"');
}
function lt(t) {
  const n = /* @__PURE__ */ new Set();
  return t.filter((e) => {
    const r = String(e || "").trim();
    return !r || n.has(r) ? !1 : (n.add(r), !0);
  });
}
function ee(...t) {
  return t.find(
    (n) => n != null
  );
}
function re(t) {
  try {
    return JSON.stringify(t);
  } catch {
    return "";
  }
}
const Xt = {
  audio: "editorMediaAudio",
  image: "editorMediaImage",
  mediaAudio: "editorMediaAudio",
  mediaImage: "editorMediaImage",
  mediaVideo: "editorMediaVideo",
  video: "editorMediaVideo"
}, mt = [
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
function ie(t) {
  const n = pt(t);
  return n.length > 120 ? `${n.slice(0, 120)}...` : n;
}
function pt(t) {
  return C(t).replace(/\s+/g, " ").trim();
}
function qt(t) {
  if (typeof t != "string")
    return "";
  const n = t.trim();
  if (!nn(n))
    return "";
  const e = n.search(/"rich"\s*:/), r = e >= 0 ? n.slice(e) : n, i = [], o = /"text"\s*:\s*"((?:\\.|[^"\\])*)"/g;
  let s = null;
  for (; (s = o.exec(r)) !== null; ) {
    const c = en(s[1]).trim();
    c && i.push(c);
  }
  return i.join(" ").replace(/\s+/g, " ").trim();
}
function J(t) {
  const n = x(t, /* @__PURE__ */ new Set());
  return G(n) ? n : null;
}
function oe(t) {
  try {
    return pt(t);
  } catch {
    return "";
  }
}
function se(t) {
  try {
    return J(t);
  } catch {
    return null;
  }
}
function C(t) {
  if (typeof t == "string") {
    const r = t.trim();
    if (V(r)) {
      const i = bt(r);
      if (i !== void 0)
        return C(i).trim();
    }
    return qt(r) || t;
  }
  if (Array.isArray(t))
    return t.map(C).filter(Boolean).join(" ");
  if (!f(t))
    return "";
  const n = J(t);
  if (n)
    return ht(n);
  const e = [
    typeof t.text == "string" ? t.text : "",
    typeof t.markdown == "string" ? t.markdown : ""
  ];
  for (const r of mt)
    t[r] != null && e.push(C(t[r]));
  return e.filter(Boolean).join(" ");
}
function x(t, n) {
  if (typeof t == "string") {
    const r = t.trim();
    if (!V(r))
      return null;
    const i = bt(r);
    return i === void 0 ? null : x(i, n);
  }
  if (Array.isArray(t)) {
    const r = q({ type: "doc", content: t });
    if (G(r))
      return r;
    for (const i of t) {
      const o = x(i, n);
      if (o)
        return o;
    }
    return null;
  }
  if (!f(t) || n.has(t))
    return null;
  n.add(t);
  const e = q(t);
  if (e)
    return e;
  if (String(t.format || "").toLowerCase() === "rich_json" && t.rich != null) {
    const r = x(t.rich, n);
    if (r)
      return r;
  }
  for (const r of mt) {
    if (t[r] == null)
      continue;
    const i = x(t[r], n);
    if (i)
      return i;
  }
  return null;
}
function q(t) {
  return !f(t) || yt(t.type) !== "doc" ? null : {
    type: "doc",
    attrs: f(t.attrs) ? t.attrs : void 0,
    content: gt(t.content)
  };
}
function gt(t) {
  return Array.isArray(t) ? t.map(Qt).filter((n) => !!n) : [];
}
function Qt(t) {
  if (!f(t))
    return null;
  const n = yt(t.type) || vt(t);
  if (!n)
    return null;
  const e = { type: n }, r = f(t.attrs) ? { ...t.attrs } : {};
  if (n === "heading" && k(r.level) <= 0) {
    const s = k(t.level);
    s > 0 && (r.level = s);
  }
  Object.keys(r).length > 0 && (e.attrs = r);
  const i = tn(t.marks);
  if (i.length > 0 && (e.marks = i), n === "text") {
    const s = S(t.text);
    return s ? (e.text = s, e) : null;
  }
  const o = gt(t.content);
  return o.length > 0 && (e.content = o), e;
}
function vt(t) {
  if (typeof t.text == "string")
    return "text";
  const n = f(t.attrs) ? t.attrs : {};
  return k(n.level) > 0 || k(t.level) > 0 ? "heading" : "";
}
function tn(t) {
  return Array.isArray(t) ? t.map((n) => {
    if (!f(n))
      return null;
    const e = S(n.type);
    return e ? {
      type: e,
      attrs: f(n.attrs) ? n.attrs : void 0
    } : null;
  }).filter(
    (n) => !!n
  ) : [];
}
function yt(t) {
  const n = S(t);
  return Xt[n] || n;
}
function ht(t) {
  return t ? t.type === "text" ? t.text || "" : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? S(t.attrs?.alt || t.attrs?.title || t.attrs?.src) : (t.content || []).map(ht).filter(Boolean).join(" ") : "";
}
function G(t) {
  return t ? t.type === "text" ? !!S(t.text) : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? !!S(t.attrs?.src) : (t.content || []).some(G) : !1;
}
function bt(t) {
  try {
    return JSON.parse(t);
  } catch {
    return;
  }
}
function nn(t) {
  return t.includes("rich_json") || t.includes('"rich"') || t.includes("agent_run_id") || t.includes("node_run_id");
}
function en(t) {
  try {
    return JSON.parse(`"${t}"`);
  } catch {
    return t.replace(/\\"/g, '"').replace(/\\n/g, `
`).replace(/\\t/g, "	").replace(/\\\\/g, "\\");
  }
}
function k(t) {
  const n = Number(t || 0);
  return Number.isFinite(n) ? n : 0;
}
function S(t) {
  return t == null ? "" : String(t).trim();
}
const rn = "素材库", on = [
  { key: "project", label: "创作" },
  { key: "tool", label: "工具" },
  { key: "dialogue", label: "对话" },
  { key: "upload", label: "上传" },
  { key: "import", label: "导入" },
  { key: "official", label: rn }
], sn = [
  { key: "work", label: "作品" },
  { key: "material", label: "素材" }
], an = [
  { key: "collection", label: "集合" },
  { key: "text", label: "文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "richtext", label: "富文本" },
  { key: "file", label: "文件" }
];
function ae(t, n = {}) {
  const e = n.fallback || "资产", r = W(on, t, e);
  return n[t] || r;
}
function ce(t) {
  return W(sn, t, "素材");
}
function ue(t) {
  return W(an, t, "资产");
}
function fe(t) {
  if (t.length === 0 || t.some((r) => ["text", "richtext", "file"].includes(r)))
    return;
  const n = {
    image: "image/*",
    audio: "audio/*",
    video: "video/*"
  }, e = t.map((r) => n[r]).filter((r) => !!r);
  return e.length > 0 ? Array.from(new Set(e)).join(",") : void 0;
}
function de(t, n) {
  return t && (n.length === 0 || n.some((e) => ["richtext", "video"].includes(e)));
}
function le(t) {
  return t.id <= 0 ? !1 : t.libraryType === "material" ? t.version?.content != null : t.versionID > 0;
}
function W(t, n, e) {
  return t.find((r) => r.key === n)?.label || e;
}
const U = [
  { value: "auto", label: "自动", columns: 0, rows: 0, capacity: 9 },
  { value: "2x2", label: "2×2", columns: 2, rows: 2, capacity: 4 },
  { value: "3x2", label: "3×2", columns: 3, rows: 2, capacity: 6 },
  { value: "3x3", label: "3×3", columns: 3, rows: 3, capacity: 9 }
], cn = new Set(
  U.map((t) => t.value)
);
function un(t) {
  const n = String(t || "").trim().toLowerCase();
  return cn.has(n) ? n : "auto";
}
function fn(t) {
  const n = un(t);
  return U.find((e) => e.value === n) || U[0];
}
function me(t, n) {
  const e = fn(t), r = Math.max(0, Math.trunc(Number(n) || 0));
  return e.value !== "auto" ? e : r === 0 || r > 6 ? { columns: 3, rows: 3, capacity: 9 } : r > 4 ? { columns: 3, rows: 2, capacity: 6 } : r > 2 ? { columns: 2, rows: 2, capacity: 4 } : { columns: 2, rows: 1, capacity: 2 };
}
function pe(t) {
  const n = Math.max(0, Math.trunc(Number(t) || 0));
  return n <= 1 ? { columns: 1, rows: 1, capacity: 1 } : n === 2 ? { columns: 2, rows: 1, capacity: 2 } : { columns: 2, rows: 2, capacity: 4 };
}
function ge(t, n) {
  const e = Math.max(0, Math.trunc(Number(n) || 0) - 1);
  return Math.min(
    e,
    Math.max(0, Math.trunc(Number(t) || 0))
  );
}
const dn = 50, ln = {
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
function $(t) {
  return Object.fromEntries(
    t.map((n) => [n, /* @__PURE__ */ new Map()])
  );
}
function T(t, n, e = {}) {
  const r = {
    media: t,
    enabledKinds: Object.keys(t),
    seen: e.seen || /* @__PURE__ */ new Set(),
    requestedKind: e.kind
  };
  b(n, r, 0, e.kind);
}
function pn(t, n) {
  const r = $(n === "audio" ? ["audio", "image"] : [n]);
  return T(r, t, { kind: n }), wt(r), Array.from(r[n].values());
}
function wt(t) {
  const n = t.audio, e = t.image;
  if (!n || !e || n.size === 0 || n.size !== e.size)
    return;
  const r = Array.from(e.values());
  Array.from(n.values()).forEach((i, o) => {
    if (i.thumbnail)
      return;
    const s = St(
      "audio",
      i.url,
      r[o]?.url || ""
    );
    s && n.set(i.url, { ...i, thumbnail: s });
  });
}
function b(t, n, e, r, i = "") {
  if (t == null || e > 12)
    return;
  if (Array.isArray(t)) {
    const l = t.length > 1 ? "" : i;
    t.forEach(
      (g) => b(
        g,
        n,
        e + 1,
        r,
        l
      )
    );
    return;
  }
  if (typeof t == "string") {
    const l = I(t);
    if (l.length > 0) {
      l.forEach(
        (y) => b(
          y,
          n,
          e + 1,
          r,
          i
        )
      );
      return;
    }
    const g = r || n.requestedKind || bn(t);
    g && n.media[g] && H(t) && gn(
      n.media,
      g,
      t.trim(),
      i
    );
    return;
  }
  if (typeof t != "object" || n.seen.has(t))
    return;
  n.seen.add(t);
  const o = t, s = f(o.attrs) ? o.attrs : void 0, c = hn(
    o.type,
    o.kind,
    o.media_type,
    o.mediaType,
    o.mime
  ), u = yn(
    o,
    s,
    i
  ), p = r || n.requestedKind;
  if (p && n.media[p] && (!c || c === p))
    for (const l of Q(o, p))
      b(
        l,
        n,
        e + 1,
        p,
        u
      );
  for (const l of n.enabledKinds) {
    const g = ln[l];
    for (const y of g.direct)
      b(
        o[y],
        n,
        e + 1,
        l,
        u
      );
    for (const y of g.collections)
      b(
        o[y],
        n,
        e + 1,
        l,
        u
      );
  }
  if (c && n.media[c]) {
    for (const l of Q(o, c))
      b(
        l,
        n,
        e + 1,
        c,
        u
      );
    b(
      o.attrs,
      n,
      e + 1,
      c,
      u
    );
  }
  for (const l of mn)
    b(
      o[l],
      n,
      e + 1
    );
}
function Q(t, n) {
  const e = [
    t.url,
    t.src,
    t.file_url,
    t.fileUrl,
    t.download_url,
    t.downloadUrl
  ];
  return n === "file" ? (e.push(t.download, t.open_url, t.openUrl, t.path), [
    e.find(
      (r) => typeof r == "string" && H(r)
    )
  ]) : e;
}
function gn(t, n, e, r) {
  const i = t[n];
  if (!i)
    return;
  const o = St(
    n,
    e,
    r
  ), s = i.get(e);
  if (s?.thumbnail || !o) {
    s || i.set(e, { url: e });
    return;
  }
  i.set(e, { url: e, thumbnail: o });
}
function St(t, n, e) {
  const r = e.trim();
  return !r || t !== "image" && r === n.trim() ? "" : r;
}
function yn(t, n, e) {
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
    n?.thumbnail,
    n?.thumbnail_url,
    n?.thumbnailUrl,
    n?.poster,
    n?.cover,
    e
  ])
    if (typeof r == "string" && H(r))
      return r.trim();
  return "";
}
function hn(...t) {
  for (const n of t) {
    const e = String(n || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
    if (["image", "mediaimage", "editormediaimage"].includes(e) || e.startsWith("image/"))
      return "image";
    if (["video", "mediavideo", "editormediavideo"].includes(e) || e.startsWith("video/"))
      return "video";
    if (["audio", "music", "voice", "mediaaudio", "editormediaaudio"].includes(
      e
    ) || e.startsWith("audio/"))
      return "audio";
    if (["file", "mediafile", "editormediafile"].includes(e) || e.startsWith("application/") || e.startsWith("text/"))
      return "file";
  }
}
function bn(t) {
  const n = t.trim();
  if (/^data:image\//i.test(n) || /\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i.test(n))
    return "image";
  if (/^data:video\//i.test(n) || /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(n))
    return "video";
  if (/^data:audio\//i.test(n) || /\.(mp3|wav|ogg|m4a|aac)(?:[?#].*)?$/i.test(n))
    return "audio";
}
function H(t) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(t.trim());
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const z = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!z || Object.keys(z).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const K = ["image", "video", "audio"], wn = 64, Sn = 128 * 1024, D = /* @__PURE__ */ Symbol("content-output-cache-miss"), v = Nt(), tt = Nt(), xn = z, Nn = xn.normalizeEnergonOutput;
function w(...t) {
  for (const n of t)
    if (typeof n == "string" && n.trim())
      return n.trim();
  return "";
}
function ye(t) {
  const n = N(
    t,
    ["lyrics", "lyric", "lrc", "song_lyrics", "songLyrics"],
    /* @__PURE__ */ new Set(),
    0
  );
  if (n)
    return { label: "歌词", text: n };
  const e = N(
    t,
    ["text"],
    /* @__PURE__ */ new Set(),
    0
  );
  return e ? { label: "创作内容", text: e } : null;
}
function N(t, n, e, r) {
  if (t == null || r > 12)
    return "";
  if (typeof t == "string") {
    for (const i of I(t)) {
      const o = N(i, n, e, r + 1);
      if (o)
        return o;
    }
    return "";
  }
  if (Array.isArray(t)) {
    for (const i of t) {
      const o = N(i, n, e, r + 1);
      if (o)
        return o;
    }
    return "";
  }
  if (!f(t) || e.has(t))
    return "";
  e.add(t);
  for (const i of n) {
    const o = A(t[i], r + 1);
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
    const o = N(t[i], n, e, r + 1);
    if (o)
      return o;
  }
  return "";
}
function A(t, n) {
  if (t == null || n > 12)
    return "";
  if (typeof t == "string") {
    const e = t.trim();
    if (!e || /^(https?:\/\/|\/|data:|blob:)/i.test(e))
      return "";
    const r = I(e);
    return r.length > 0 ? r.map((i) => A(i, n + 1)).filter(Boolean).join(`
`) : e;
  }
  if (Array.isArray(t))
    return t.map((e) => A(e, n + 1)).filter(Boolean).join(`
`);
  if (!f(t))
    return "";
  for (const e of ["text", "content", "line", "lines", "value"]) {
    const r = A(t[e], n + 1);
    if (r)
      return r;
  }
  return "";
}
function he(t) {
  const n = xt(t);
  return !n || n.hasMedia ? "" : n.markdown;
}
function xt(t) {
  const n = En(t);
  return !n || !_t(n) ? null : {
    markdown: n.content.map(Ot).join(`

`).trim(),
    plainText: n.content.map(kt).join(`

`).trim(),
    hasMedia: Tt(n)
  };
}
function Cn(t) {
  return /(^|\n)\s*(#{1,6}\s|[-*+]\s|>\s|\d+\.\s|```)/m.test(t) || /(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|`[^`]+`)/.test(t);
}
function be(t) {
  return An(t).length > 0;
}
function An(t) {
  const n = E(t);
  return K.filter((e) => n[e].size > 0);
}
function Mn(t) {
  const n = E(t);
  return K.reduce(
    (e, r) => e + n[r].size,
    0
  );
}
function we(t, n) {
  return Array.from(E(t)[n].keys());
}
function Se(t, n) {
  return Array.from(E(t)[n].values());
}
function _n(t) {
  const n = On(t);
  return n ? Array.from(
    new Set(n.frames.map((e) => e.image.trim()).filter(Boolean))
  ) : [];
}
function On(t) {
  const n = Ct(tt, t);
  return n !== D ? n : At(
    tt,
    t,
    _(t, /* @__PURE__ */ new Set(), 0)
  );
}
function xe(t, n) {
  const e = n.trim().toLowerCase();
  return e ? M(t, e, /* @__PURE__ */ new Set(), 0) : !1;
}
function Ne(...t) {
  let n, e, r = 0;
  for (const i of t) {
    if (!Y(i))
      continue;
    n === void 0 && (n = i);
    const o = Mn(i);
    o > r && (e = i, r = o);
  }
  return r > 0 ? e : n;
}
function Y(t) {
  return t == null || t === "" ? !1 : Array.isArray(t) ? t.length > 0 : typeof t == "object" ? Object.keys(t).length > 0 : !0;
}
function E(t) {
  const n = Ct(v, t);
  if (n !== D)
    return n;
  const e = $(K), r = _n(t), i = /* @__PURE__ */ new Set();
  for (const o of kn(t))
    T(e, o, { seen: i });
  return T(e, t), wt(e), r.length > 0 && (e.image = new Map(
    r.map((o) => [o, { url: o, thumbnail: o }])
  )), At(v, t, e);
}
function Nt() {
  return {
    objects: /* @__PURE__ */ new WeakMap(),
    strings: /* @__PURE__ */ new Map()
  };
}
function Ct(t, n) {
  if (n && typeof n == "object")
    return t.objects.has(n) ? t.objects.get(n) : D;
  if (!Mt(n) || !t.strings.has(n))
    return D;
  const e = t.strings.get(n);
  return t.strings.delete(n), t.strings.set(n, e), e;
}
function At(t, n, e) {
  if (n && typeof n == "object")
    return t.objects.set(n, e), e;
  if (!Mt(n))
    return e;
  for (t.strings.delete(n), t.strings.set(n, e); t.strings.size > wn; ) {
    const r = t.strings.keys().next().value;
    if (typeof r != "string")
      break;
    t.strings.delete(r);
  }
  return e;
}
function Mt(t) {
  return typeof t == "string" && t.length <= Sn;
}
function kn(t) {
  if (!Y(t))
    return [];
  const n = Nn?.(t);
  return Array.isArray(n) && n.length > 0 ? n : Array.isArray(t) ? t : [t];
}
function M(t, n, e, r) {
  return t == null || r > 12 ? !1 : typeof t == "string" ? I(t).some(
    (i) => M(i, n, e, r + 1)
  ) : Array.isArray(t) ? t.some(
    (i) => M(i, n, e, r + 1)
  ) : !f(t) || e.has(t) ? !1 : (e.add(t), String(t.type || "").trim().toLowerCase() === n ? !0 : [
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
    (i) => M(i, n, e, r + 1)
  ));
}
function _(t, n, e) {
  if (t == null || e > 12)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    if (!i || !i.startsWith("{") && !i.startsWith("["))
      return null;
    try {
      return _(JSON.parse(i), n, e + 1);
    } catch {
      return null;
    }
  }
  if (Array.isArray(t)) {
    for (const i of t) {
      const o = _(i, n, e + 1);
      if (o)
        return o;
    }
    return null;
  }
  if (!f(t) || n.has(t))
    return null;
  n.add(t);
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
    const o = _(t[i], n, e + 1);
    if (o)
      return o;
  }
  return null;
}
function Tn(t) {
  if (String(t.type || "").trim().toLowerCase() !== "storyboard_grid" || !Array.isArray(t.frames))
    return null;
  const n = t.frames.map(Dn).filter((e) => !!e).sort((e, r) => e.order - r.order);
  return n.length < 2 || n.length > dn ? null : {
    type: "storyboard_grid",
    version: Math.max(1, Math.trunc(Number(t.version) || 1)),
    title: w(t.title, "宫格图片"),
    summary: w(t.summary),
    frames: n
  };
}
function Dn(t, n) {
  if (!f(t))
    return null;
  const e = Math.max(1, Math.trunc(Number(t.order) || n + 1));
  return {
    id: w(t.id, `frame-${String(e).padStart(2, "0")}`),
    order: e,
    title: w(
      t.title,
      `画面 ${String(e).padStart(2, "0")}`
    ),
    description: w(t.description),
    prompt: w(t.prompt),
    status: w(t.status),
    image: In(
      t.image,
      t.image_url,
      t.imageUrl
    ),
    error: w(t.error),
    assetID: nt(t.asset_id, t.assetId, t.assetID),
    assetVersionID: nt(
      t.asset_version_id,
      t.assetVersionId,
      t.assetVersionID
    )
  };
}
function In(...t) {
  for (const n of t) {
    const e = $(["image"]);
    T(e, n, { kind: "image" });
    const r = e.image.values().next().value;
    if (r?.url)
      return r.url;
  }
  return "";
}
function nt(...t) {
  for (const n of t) {
    const e = Math.trunc(Number(n) || 0);
    if (e > 0)
      return e;
  }
  return 0;
}
function En(t) {
  return f(t) ? t.type === "doc" && Array.isArray(t.content) ? t : f(t.rich) && t.rich.type === "doc" && Array.isArray(t.rich.content) ? t.rich : null : null;
}
function _t(t) {
  return f(t) ? t.type === "text" ? !Array.isArray(t.marks) || t.marks.length === 0 : t.type === "hardBreak" ? !0 : L(t) ? !!Dt(t) : t.type !== "doc" && t.type !== "paragraph" ? !1 : Array.isArray(t.content) && t.content.every(_t) : !1;
}
function Ot(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : L(t) ? `![${Ln(
    String(t.attrs?.alt || t.attrs?.caption || "图片")
  )}](<${Rn(Dt(t))}>)` : Array.isArray(t.content) ? t.content.map(Ot).join("") : "";
}
function kt(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : L(t) ? "" : Array.isArray(t.content) ? t.content.map(kt).join("") : "";
}
function Tt(t) {
  return L(t) || !!t.content?.some((n) => Tt(n));
}
function L(t) {
  return ["image", "mediaImage", "editorMediaImage"].includes(
    String(t.type || "")
  );
}
function Dt(t) {
  return String(t.attrs?.src || "").trim();
}
function Ln(t) {
  return t.replace(/([\\\[\]])/g, "\\$1");
}
function Rn(t) {
  return t.replace(/</g, "%3C").replace(/>/g, "%3E");
}
await window.DeverFront?.ensureCompat?.(["@/page/nodes/show/tooltip"]);
const F = window.DeverFront?.sdk?.getCompatModule("@/page/nodes/show/tooltip");
if (!F || Object.keys(F).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/page/nodes/show/tooltip");
const jn = F.HoverTip, Un = 12e3;
function et({
  label: t,
  side: n = "top",
  sideOffset: e = 7,
  className: r = "",
  children: i
}) {
  return /* @__PURE__ */ a(
    jn,
    {
      content: t,
      side: n,
      sideOffset: e,
      layerZIndex: Un,
      className: `max-w-80 whitespace-normal break-words ${r}`.trim(),
      children: i
    }
  );
}
const It = {
  image: "images",
  audio: "audios",
  video: "videos",
  file: "files"
};
function Ce(t, n) {
  const e = It[t], r = e ? Z(n, t) : [];
  if (e && r.length > 0)
    return { [e]: r };
  const i = J(n);
  if (!i)
    return n;
  const o = xt(i);
  return o && (t === "text" || Cn(o.plainText)) ? { text: o.markdown } : { rich: i };
}
function zn(t, n) {
  return Z(t, n)[0] || "";
}
function Z(t, n) {
  return Fn(t, n).map((e) => e.url);
}
function Fn(t, n) {
  return Bn(n) ? pn(t, n) : [];
}
function Ae(t, n) {
  if (!It[n])
    return 0;
  const e = Z(t, n).length;
  if (!t || typeof t != "object" || Array.isArray(t))
    return e;
  const r = Number(
    t.media_count || 0
  );
  return Math.max(
    e,
    Number.isFinite(r) ? Math.trunc(r) : 0
  );
}
function Bn(t) {
  return t === "image" || t === "video" || t === "audio" || t === "file";
}
function rt(t, n = 0) {
  if (n > 8 || t == null) return "";
  if (typeof t == "string") return Et(t) ? "" : t.trim();
  if (Array.isArray(t))
    return t.map((r) => rt(r, n + 1)).filter(Boolean)[0] || "";
  if (typeof t != "object") return "";
  const e = t;
  for (const r of [
    "summary",
    "title",
    "text",
    "caption",
    "content",
    "output",
    "result"
  ]) {
    const i = rt(e[r], n + 1);
    if (i) return i;
  }
  return "";
}
function Me(t) {
  const n = t?.source?.prompt;
  return typeof n == "string" ? n.trim() : "";
}
function _e(t) {
  const n = zn(t, "file"), e = O(t) || jt(n), r = e.match(/\.([a-z0-9]{1,10})$/i)?.[1] || "";
  return { url: n, name: e, extension: r };
}
function O(t, n = 0) {
  if (t == null || n > 8) return "";
  if (typeof t == "string") {
    const r = t.trim();
    return Et(r) ? "" : r;
  }
  if (Array.isArray(t)) {
    for (const r of t) {
      const i = O(r, n + 1);
      if (i) return i;
    }
    return "";
  }
  if (typeof t != "object") return "";
  const e = t;
  for (const r of [
    "name",
    "file_name",
    "fileName",
    "filename",
    "label",
    "title"
  ]) {
    const i = O(e[r], n + 1);
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
    const i = O(e[r], n + 1);
    if (i) return i;
  }
  return "";
}
function Et(t) {
  return /^(https?:\/\/|\/|data:|blob:)/.test(t.trim());
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const B = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!B || Object.keys(B).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const it = B, ot = it.ContentView || it.EnergonContentView;
function Oe({
  output: t,
  fallback: n = "",
  streaming: e = !1,
  emptyText: r = "暂无内容",
  className: i,
  markdownClassName: o,
  richClassName: s,
  mediaLayout: c = "default"
}) {
  const u = Pn(t, n);
  return ot ? /* @__PURE__ */ a(Vn, { className: i, children: /* @__PURE__ */ a(
    ot,
    {
      output: u,
      streaming: e,
      emptyText: r,
      markdownClassName: o,
      richClassName: s,
      mediaLayout: c
    }
  ) }) : n ? /* @__PURE__ */ a("div", { className: i, children: n }) : null;
}
function Pn(t, n = "") {
  return Y(t) ? t : n ? { text: n } : t;
}
function Vn({
  className: t,
  children: n
}) {
  const e = (r) => {
    Jn(r.target) && r.stopPropagation();
  };
  return /* @__PURE__ */ a(
    "div",
    {
      className: t,
      onPointerDown: e,
      onClick: e,
      children: n
    }
  );
}
function Jn(t) {
  return t instanceof Element && !!t.closest(
    "a, button, input, textarea, select, audio, video, [role='button']"
  );
}
function Gn(t) {
  if (!t) return !1;
  const n = document.querySelectorAll('[data-slot="dialog-layer"]');
  return n.item(n.length - 1)?.contains(t) || !1;
}
const ke = 10040;
function Te({
  ariaLabel: t,
  header: n,
  children: e,
  onRequestClose: r,
  onEscape: i,
  layer: o = "default"
}) {
  const s = ct(null);
  ut(() => {
    const u = (p) => {
      p.key !== "Escape" || p.defaultPrevented || !Gn(s.current) || (p.preventDefault(), p.stopImmediatePropagation(), (i || r)());
    };
    return window.addEventListener("keydown", u), () => window.removeEventListener("keydown", u);
  }, [i, r]);
  const c = /* @__PURE__ */ a(
    "div",
    {
      ref: s,
      className: `wb-detail-backdrop ${o === "nested" ? "is-nested" : ""}`.trim(),
      "data-slot": "dialog-layer",
      role: "presentation",
      onMouseDown: (u) => {
        u.stopPropagation(), u.target === u.currentTarget && r();
      },
      children: /* @__PURE__ */ m(
        "section",
        {
          className: "wb-detail-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": t,
          onMouseDown: (u) => u.stopPropagation(),
          children: [
            n,
            e
          ]
        }
      )
    }
  );
  return typeof document > "u" ? null : Jt(c, document.body);
}
function De({
  icon: t,
  title: n,
  subtitle: e,
  titleStatus: r,
  versionSelect: i,
  state: o,
  updatedAt: s,
  actions: c,
  downloadUrl: u,
  onClose: p
}) {
  return /* @__PURE__ */ m("header", { className: "wb-detail-head", children: [
    /* @__PURE__ */ m("div", { className: "wb-detail-heading", children: [
      /* @__PURE__ */ a("span", { className: "wb-detail-kind-icon", "aria-hidden": "true", children: t }),
      /* @__PURE__ */ m("div", { children: [
        /* @__PURE__ */ a("strong", { children: n || "详情" }),
        e ? /* @__PURE__ */ a("span", { children: e }) : null
      ] })
    ] }),
    r && /* @__PURE__ */ a("div", { className: "wb-detail-title-status", children: r }),
    /* @__PURE__ */ m("div", { className: "wb-detail-meta", children: [
      i,
      o,
      s ? /* @__PURE__ */ a("time", { children: s }) : null
    ] }),
    /* @__PURE__ */ m("div", { className: "wb-detail-actions", children: [
      c,
      u ? /* @__PURE__ */ a(et, { label: "下载内容", children: /* @__PURE__ */ a(
        Ut,
        {
          url: u,
          name: n,
          className: "wb-detail-icon-button"
        }
      ) }) : null,
      /* @__PURE__ */ a(et, { label: "关闭", children: /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "wb-detail-icon-button",
          onClick: p,
          "aria-label": "关闭详情",
          children: /* @__PURE__ */ a(Bt, { size: 18 })
        }
      ) })
    ] })
  ] });
}
function Ie({
  options: t,
  currentVersionId: n,
  selectedVersionId: e,
  total: r,
  hasMore: i,
  loading: o,
  loadingMore: s,
  error: c,
  disabled: u = !1,
  onSelect: p,
  onLoadMore: l,
  onRetry: g
}) {
  const [y, R] = Vt(!1), X = ct(null), Lt = t.find((d) => d.id === e) || t.find((d) => d.id === n);
  return ut(() => {
    if (!y) return;
    const d = (h) => {
      X.current?.contains(h.target) || R(!1);
    };
    return document.addEventListener("mousedown", d), () => document.removeEventListener("mousedown", d);
  }, [y]), !e && !o ? null : /* @__PURE__ */ m("div", { className: "wb-detail-version-select", ref: X, children: [
    /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: "wb-detail-version-trigger",
        "aria-haspopup": "listbox",
        "aria-expanded": y,
        disabled: u || o && t.length === 0,
        onClick: () => R((d) => !d),
        children: [
          o && t.length === 0 ? /* @__PURE__ */ a(j, { size: 12, className: "wb-detail-spin" }) : null,
          /* @__PURE__ */ a("span", { children: at(Lt?.version) }),
          r > 0 ? /* @__PURE__ */ m("small", { children: [
            r,
            " 个版本"
          ] }) : null,
          /* @__PURE__ */ a(zt, { size: 13 })
        ]
      }
    ),
    y ? /* @__PURE__ */ a("div", { className: "wb-detail-version-menu", role: "listbox", children: /* @__PURE__ */ m(
      "div",
      {
        className: "wb-detail-version-options",
        onScroll: (d) => {
          const h = d.currentTarget;
          i && !s && h.scrollHeight - h.scrollTop - h.clientHeight < 36 && l();
        },
        children: [
          t.length > 0 ? t.map((d) => {
            const h = d.id === e, Rt = d.id === n;
            return /* @__PURE__ */ m(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": h,
                className: h ? "is-selected" : "",
                onClick: () => {
                  R(!1), p(d.value);
                },
                children: [
                  /* @__PURE__ */ m("span", { children: [
                    /* @__PURE__ */ a("strong", { children: at(d.version) }),
                    Rt ? /* @__PURE__ */ a("small", { children: "当前" }) : null
                  ] }),
                  /* @__PURE__ */ a("time", { children: Wn(d.updatedAt) }),
                  h ? /* @__PURE__ */ a(Ft, { size: 13 }) : /* @__PURE__ */ a("i", { "aria-hidden": "true" })
                ]
              },
              d.id
            );
          }) : c ? /* @__PURE__ */ a(st, { error: c, onRetry: g }) : /* @__PURE__ */ m("div", { className: "wb-detail-version-message", children: [
            o ? /* @__PURE__ */ a(j, { size: 14, className: "wb-detail-spin" }) : null,
            /* @__PURE__ */ a("span", { children: o ? "正在读取版本" : "暂无版本" })
          ] }),
          c && t.length > 0 ? /* @__PURE__ */ a(st, { error: c, onRetry: g }) : null,
          s ? /* @__PURE__ */ m("div", { className: "wb-detail-version-loading", children: [
            /* @__PURE__ */ a(j, { size: 13, className: "wb-detail-spin" }),
            "正在加载更多"
          ] }) : null
        ]
      }
    ) }) : null
  ] });
}
function st({
  error: t,
  onRetry: n
}) {
  return /* @__PURE__ */ m("div", { className: "wb-detail-version-message is-error", children: [
    /* @__PURE__ */ a("span", { children: t }),
    /* @__PURE__ */ m("button", { type: "button", onClick: n, children: [
      /* @__PURE__ */ a(Pt, { size: 12 }),
      "重试"
    ] })
  ] });
}
function at(t) {
  const n = Number(t || 0);
  return n > 0 ? `第${n}版` : "版本";
}
function Wn(t) {
  const n = String(t || "").trim();
  return n ? n.replace("T", " ").replace(/\.\d+(Z)?$/, "").replace(/Z$/, "") : "";
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const P = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!P || Object.keys(P).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const $n = P.EnergonAudioPlayer;
function Ee({
  src: t,
  autoPlay: n = !1
}) {
  return /* @__PURE__ */ a("div", { className: "wb-asset-audio-preview", children: /* @__PURE__ */ a(
    $n,
    {
      src: t,
      autoPlay: n,
      className: "h-full min-h-0 border-0 bg-transparent p-0 shadow-none"
    }
  ) });
}
export {
  ie as $,
  De as A,
  et as B,
  ce as C,
  ke as D,
  on as E,
  an as F,
  sn as G,
  de as H,
  Oe as I,
  qn as J,
  Qn as K,
  w as L,
  ee as M,
  be as N,
  Ne as O,
  Ct as P,
  At as Q,
  D as R,
  qt as S,
  oe as T,
  Nt as U,
  ne as V,
  Nn as W,
  Wt as X,
  lt as Y,
  le as Z,
  dn as _,
  Ce as a,
  Ee as a0,
  I as a1,
  te as a2,
  _e as a3,
  rt as a4,
  Fn as a5,
  Mn as a6,
  kn as a7,
  me as a8,
  ge as a9,
  pe as aa,
  un as ab,
  fn as ac,
  U as ad,
  Pn as ae,
  Vn as af,
  J as ag,
  _n as ah,
  vn as ai,
  xt as aj,
  Cn as ak,
  fe as b,
  ae as c,
  An as d,
  we as e,
  Z as f,
  re as g,
  pt as h,
  Gn as i,
  he as j,
  f as k,
  pn as l,
  ye as m,
  Se as n,
  zn as o,
  Gt as p,
  Wn as q,
  Ie as r,
  se as s,
  Te as t,
  Y as u,
  Ae as v,
  ue as w,
  On as x,
  xe as y,
  Me as z
};
