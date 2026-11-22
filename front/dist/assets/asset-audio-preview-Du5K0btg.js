import { j as a, a as m } from "./preloadable-R-5sHdlM.js";
import { r as L, c as Ct, n as Ot, X as kt, af as Tt } from "./vendor-icons-IZIW7U43.js";
import { b as tt, d as nt, a as Dt } from "./file-kind-Cq3pESGF.js";
import { c as It } from "./space-assistant-layout-B9KyeCM0.js";
import { R as Et } from "./media-inspector-gallery-a93u-E1M.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./asset-audio-preview-DrQ4NEW7.css", import.meta.url).href]);
function Rt(t) {
  if (typeof t != "string")
    return t;
  const n = t.trim();
  if (!F(n))
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
function Ln(t) {
  return f(t) ? t : {};
}
function jn(t) {
  return typeof t == "string" ? t.trim() : "";
}
function Un(t) {
  const n = Number(t || 0);
  return Number.isFinite(n) ? n : 0;
}
function zn(t) {
  if (t == null || t === "")
    return;
  const n = Number(t);
  return Number.isFinite(n) ? n : void 0;
}
function et(t) {
  const n = String(t || "").trim(), e = Lt(n), r = Ft(e);
  for (const i of it([n, e, r])) {
    const o = Rt(i);
    if (o !== i)
      return o;
    const s = zt(i);
    if (s !== i)
      return s;
  }
  return t;
}
function Bn(t) {
  const n = String(t || "").trim();
  for (const e of rt(n)) {
    const r = et(e);
    if (r !== e)
      return r;
  }
  return t;
}
function D(t) {
  const n = [];
  for (const e of rt(
    String(t || "").trim()
  )) {
    const r = et(e);
    r !== e && n.push(r);
  }
  return n;
}
function Lt(t) {
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
      n += Bt(i);
      continue;
    }
    n += i;
  }
  return n;
}
function rt(t) {
  const n = [t];
  for (const e of t.matchAll(/```(?:json|storyboard)?\s*([\s\S]*?)```/gi))
    n.push(String(e[1] || "").trim());
  return n.push(...jt(t)), it(n);
}
function jt(t) {
  const n = [];
  for (let e = 0; e < t.length; e += 1) {
    const r = t[e];
    if (r !== "{" && r !== "[")
      continue;
    const i = Ut(t, e);
    i && (n.push(i), e += i.length - 1);
  }
  return n;
}
function Ut(t, n) {
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
function F(t) {
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function zt(t) {
  if (!t.startsWith('"') || !t.endsWith('"'))
    return t;
  try {
    const n = JSON.parse(t);
    return typeof n == "string" ? n : t;
  } catch {
    return t;
  }
}
function Bt(t) {
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
function Ft(t) {
  const n = t.trim();
  return !n.includes('\\"') || !n.startsWith("{") && !n.startsWith("[") ? t : n.replace(/\\"/g, '"');
}
function it(t) {
  const n = /* @__PURE__ */ new Set();
  return t.filter((e) => {
    const r = String(e || "").trim();
    return !r || n.has(r) ? !1 : (n.add(r), !0);
  });
}
function Fn(...t) {
  return t.find(
    (n) => n != null
  );
}
function Jn(t) {
  try {
    return JSON.stringify(t);
  } catch {
    return "";
  }
}
const Jt = {
  audio: "editorMediaAudio",
  image: "editorMediaImage",
  mediaAudio: "editorMediaAudio",
  mediaImage: "editorMediaImage",
  mediaVideo: "editorMediaVideo",
  video: "editorMediaVideo"
}, ot = [
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
function Gn(t) {
  const n = st(t);
  return n.length > 120 ? `${n.slice(0, 120)}...` : n;
}
function st(t) {
  return M(t).replace(/\s+/g, " ").trim();
}
function Gt(t) {
  if (typeof t != "string")
    return "";
  const n = t.trim();
  if (!$t(n))
    return "";
  const e = n.search(/"rich"\s*:/), r = e >= 0 ? n.slice(e) : n, i = [], o = /"text"\s*:\s*"((?:\\.|[^"\\])*)"/g;
  let s = null;
  for (; (s = o.exec(r)) !== null; ) {
    const c = Ht(s[1]).trim();
    c && i.push(c);
  }
  return i.join(" ").replace(/\s+/g, " ").trim();
}
function at(t) {
  const n = N(t, /* @__PURE__ */ new Set());
  return J(n) ? n : null;
}
function Wn(t) {
  try {
    return st(t);
  } catch {
    return "";
  }
}
function Pn(t) {
  try {
    return at(t);
  } catch {
    return null;
  }
}
function M(t) {
  if (typeof t == "string") {
    const r = t.trim();
    if (F(r)) {
      const i = lt(r);
      if (i !== void 0)
        return M(i).trim();
    }
    return Gt(r) || t;
  }
  if (Array.isArray(t))
    return t.map(M).filter(Boolean).join(" ");
  if (!f(t))
    return "";
  const n = at(t);
  if (n)
    return ft(n);
  const e = [
    typeof t.text == "string" ? t.text : "",
    typeof t.markdown == "string" ? t.markdown : ""
  ];
  for (const r of ot)
    t[r] != null && e.push(M(t[r]));
  return e.filter(Boolean).join(" ");
}
function N(t, n) {
  if (typeof t == "string") {
    const r = t.trim();
    if (!F(r))
      return null;
    const i = lt(r);
    return i === void 0 ? null : N(i, n);
  }
  if (Array.isArray(t)) {
    const r = H({ type: "doc", content: t });
    if (J(r))
      return r;
    for (const i of t) {
      const o = N(i, n);
      if (o)
        return o;
    }
    return null;
  }
  if (!f(t) || n.has(t))
    return null;
  n.add(t);
  const e = H(t);
  if (e)
    return e;
  if (String(t.format || "").toLowerCase() === "rich_json" && t.rich != null) {
    const r = N(t.rich, n);
    if (r)
      return r;
  }
  for (const r of ot) {
    if (t[r] == null)
      continue;
    const i = N(t[r], n);
    if (i)
      return i;
  }
  return null;
}
function H(t) {
  return !f(t) || ut(t.type) !== "doc" ? null : {
    type: "doc",
    attrs: f(t.attrs) ? t.attrs : void 0,
    content: ct(t.content)
  };
}
function ct(t) {
  return Array.isArray(t) ? t.map(Wt).filter((n) => !!n) : [];
}
function Wt(t) {
  if (!f(t))
    return null;
  const n = ut(t.type) || Pt(t);
  if (!n)
    return null;
  const e = { type: n }, r = f(t.attrs) ? { ...t.attrs } : {};
  if (n === "heading" && O(r.level) <= 0) {
    const s = O(t.level);
    s > 0 && (r.level = s);
  }
  Object.keys(r).length > 0 && (e.attrs = r);
  const i = Vt(t.marks);
  if (i.length > 0 && (e.marks = i), n === "text") {
    const s = S(t.text);
    return s ? (e.text = s, e) : null;
  }
  const o = ct(t.content);
  return o.length > 0 && (e.content = o), e;
}
function Pt(t) {
  if (typeof t.text == "string")
    return "text";
  const n = f(t.attrs) ? t.attrs : {};
  return O(n.level) > 0 || O(t.level) > 0 ? "heading" : "";
}
function Vt(t) {
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
function ut(t) {
  const n = S(t);
  return Jt[n] || n;
}
function ft(t) {
  return t ? t.type === "text" ? t.text || "" : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? S(t.attrs?.alt || t.attrs?.title || t.attrs?.src) : (t.content || []).map(ft).filter(Boolean).join(" ") : "";
}
function J(t) {
  return t ? t.type === "text" ? !!S(t.text) : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? !!S(t.attrs?.src) : (t.content || []).some(J) : !1;
}
function lt(t) {
  try {
    return JSON.parse(t);
  } catch {
    return;
  }
}
function $t(t) {
  return t.includes("rich_json") || t.includes('"rich"') || t.includes("agent_run_id") || t.includes("node_run_id");
}
function Ht(t) {
  try {
    return JSON.parse(`"${t}"`);
  } catch {
    return t.replace(/\\"/g, '"').replace(/\\n/g, `
`).replace(/\\t/g, "	").replace(/\\\\/g, "\\");
  }
}
function O(t) {
  const n = Number(t || 0);
  return Number.isFinite(n) ? n : 0;
}
function S(t) {
  return t == null ? "" : String(t).trim();
}
const Kt = "素材库", Yt = [
  { key: "project", label: "创作" },
  { key: "tool", label: "工具" },
  { key: "dialogue", label: "对话" },
  { key: "upload", label: "上传" },
  { key: "import", label: "导入" },
  { key: "official", label: Kt }
], Zt = [
  { key: "work", label: "作品" },
  { key: "material", label: "素材" }
], Xt = [
  { key: "collection", label: "集合" },
  { key: "text", label: "文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "richtext", label: "富文本" },
  { key: "file", label: "文件" }
];
function Vn(t, n = {}) {
  const e = n.fallback || "资产", r = G(Yt, t, e);
  return n[t] || r;
}
function $n(t) {
  return G(Zt, t, "素材");
}
function Hn(t) {
  return G(Xt, t, "资产");
}
function Kn(t) {
  if (t.length === 0 || t.some((r) => ["text", "richtext", "file"].includes(r)))
    return;
  const n = {
    image: "image/*",
    audio: "audio/*",
    video: "video/*"
  }, e = t.map((r) => n[r]).filter((r) => !!r);
  return e.length > 0 ? Array.from(new Set(e)).join(",") : void 0;
}
function Yn(t, n) {
  return t && (n.length === 0 || n.some((e) => ["richtext", "video"].includes(e)));
}
function Zn(t) {
  return t.id <= 0 ? !1 : t.libraryType === "material" ? t.version?.content != null : t.versionID > 0;
}
function G(t, n, e) {
  return t.find((r) => r.key === n)?.label || e;
}
const j = [
  { value: "auto", label: "自动", columns: 0, rows: 0, capacity: 9 },
  { value: "2x2", label: "2×2", columns: 2, rows: 2, capacity: 4 },
  { value: "3x2", label: "3×2", columns: 3, rows: 2, capacity: 6 },
  { value: "3x3", label: "3×3", columns: 3, rows: 3, capacity: 9 }
], qt = new Set(
  j.map((t) => t.value)
);
function Qt(t) {
  const n = String(t || "").trim().toLowerCase();
  return qt.has(n) ? n : "auto";
}
function vt(t) {
  const n = Qt(t);
  return j.find((e) => e.value === n) || j[0];
}
function Xn(t, n) {
  const e = vt(t), r = Math.max(0, Math.trunc(Number(n) || 0));
  return e.value !== "auto" ? e : r === 0 || r > 6 ? { columns: 3, rows: 3, capacity: 9 } : r > 4 ? { columns: 3, rows: 2, capacity: 6 } : r > 2 ? { columns: 2, rows: 2, capacity: 4 } : { columns: 2, rows: 1, capacity: 2 };
}
function qn(t) {
  const n = Math.max(0, Math.trunc(Number(t) || 0));
  return n <= 1 ? { columns: 1, rows: 1, capacity: 1 } : n === 2 ? { columns: 2, rows: 1, capacity: 2 } : { columns: 2, rows: 2, capacity: 4 };
}
function Qn(t, n) {
  const e = Math.max(0, Math.trunc(Number(n) || 0) - 1);
  return Math.min(
    e,
    Math.max(0, Math.trunc(Number(t) || 0))
  );
}
const tn = 50, nn = {
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
}, en = [
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
function W(t) {
  return Object.fromEntries(
    t.map((n) => [n, /* @__PURE__ */ new Map()])
  );
}
function k(t, n, e = {}) {
  const r = {
    media: t,
    enabledKinds: Object.keys(t),
    seen: e.seen || /* @__PURE__ */ new Set(),
    requestedKind: e.kind
  };
  b(n, r, 0, e.kind);
}
function vn(t, n) {
  const r = W(n === "audio" ? ["audio", "image"] : [n]);
  return k(r, t, { kind: n }), dt(r), Array.from(r[n].values());
}
function dt(t) {
  const n = t.audio, e = t.image;
  if (!n || !e || n.size === 0 || n.size !== e.size)
    return;
  const r = Array.from(e.values());
  Array.from(n.values()).forEach((i, o) => {
    if (i.thumbnail)
      return;
    const s = mt(
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
    const u = t.length > 1 ? "" : i;
    t.forEach(
      (g) => b(
        g,
        n,
        e + 1,
        r,
        u
      )
    );
    return;
  }
  if (typeof t == "string") {
    const u = D(t);
    if (u.length > 0) {
      u.forEach(
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
    const g = r || n.requestedKind || an(t);
    g && n.media[g] && P(t) && rn(
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
  const o = t, s = f(o.attrs) ? o.attrs : void 0, c = sn(
    o.type,
    o.kind,
    o.media_type,
    o.mediaType,
    o.mime
  ), p = on(
    o,
    s,
    i
  ), l = r || n.requestedKind;
  if (l && n.media[l] && (!c || c === l))
    for (const u of K(o, l))
      b(
        u,
        n,
        e + 1,
        l,
        p
      );
  for (const u of n.enabledKinds) {
    const g = nn[u];
    for (const y of g.direct)
      b(
        o[y],
        n,
        e + 1,
        u,
        p
      );
    for (const y of g.collections)
      b(
        o[y],
        n,
        e + 1,
        u,
        p
      );
  }
  if (c && n.media[c]) {
    for (const u of K(o, c))
      b(
        u,
        n,
        e + 1,
        c,
        p
      );
    b(
      o.attrs,
      n,
      e + 1,
      c,
      p
    );
  }
  for (const u of en)
    b(
      o[u],
      n,
      e + 1
    );
}
function K(t, n) {
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
      (r) => typeof r == "string" && P(r)
    )
  ]) : e;
}
function rn(t, n, e, r) {
  const i = t[n];
  if (!i)
    return;
  const o = mt(
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
function mt(t, n, e) {
  const r = e.trim();
  return !r || t !== "image" && r === n.trim() ? "" : r;
}
function on(t, n, e) {
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
    if (typeof r == "string" && P(r))
      return r.trim();
  return "";
}
function sn(...t) {
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
function an(t) {
  const n = t.trim();
  if (/^data:image\//i.test(n) || /\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i.test(n))
    return "image";
  if (/^data:video\//i.test(n) || /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(n))
    return "video";
  if (/^data:audio\//i.test(n) || /\.(mp3|wav|ogg|m4a|aac)(?:[?#].*)?$/i.test(n))
    return "audio";
}
function P(t) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(t.trim());
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const U = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!U || Object.keys(U).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const V = ["image", "video", "audio"], cn = 64, un = 128 * 1024, T = /* @__PURE__ */ Symbol("content-output-cache-miss"), Y = gt(), Z = gt(), fn = U, ln = fn.normalizeEnergonOutput;
function w(...t) {
  for (const n of t)
    if (typeof n == "string" && n.trim())
      return n.trim();
  return "";
}
function te(t) {
  const n = x(
    t,
    ["lyrics", "lyric", "lrc", "song_lyrics", "songLyrics"],
    /* @__PURE__ */ new Set(),
    0
  );
  if (n)
    return { label: "歌词", text: n };
  const e = x(
    t,
    ["text"],
    /* @__PURE__ */ new Set(),
    0
  );
  return e ? { label: "创作内容", text: e } : null;
}
function x(t, n, e, r) {
  if (t == null || r > 12)
    return "";
  if (typeof t == "string") {
    for (const i of D(t)) {
      const o = x(i, n, e, r + 1);
      if (o)
        return o;
    }
    return "";
  }
  if (Array.isArray(t)) {
    for (const i of t) {
      const o = x(i, n, e, r + 1);
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
    const o = x(t[i], n, e, r + 1);
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
    const r = D(e);
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
function ne(t) {
  const n = dn(t);
  return !n || n.hasMedia ? "" : n.markdown;
}
function dn(t) {
  const n = Nn(t);
  return !n || !wt(n) ? null : {
    markdown: n.content.map(St).join(`

`).trim(),
    plainText: n.content.map(Nt).join(`

`).trim(),
    hasMedia: xt(n)
  };
}
function ee(t) {
  return /(^|\n)\s*(#{1,6}\s|[-*+]\s|>\s|\d+\.\s|```)/m.test(t) || /(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|`[^`]+`)/.test(t);
}
function re(t) {
  return mn(t).length > 0;
}
function mn(t) {
  const n = I(t);
  return V.filter((e) => n[e].size > 0);
}
function pn(t) {
  const n = I(t);
  return V.reduce(
    (e, r) => e + n[r].size,
    0
  );
}
function ie(t, n) {
  return Array.from(I(t)[n].keys());
}
function oe(t, n) {
  return Array.from(I(t)[n].values());
}
function gn(t) {
  const n = yn(t);
  return n ? Array.from(
    new Set(n.frames.map((e) => e.image.trim()).filter(Boolean))
  ) : [];
}
function yn(t) {
  const n = yt(Z, t);
  return n !== T ? n : ht(
    Z,
    t,
    C(t, /* @__PURE__ */ new Set(), 0)
  );
}
function se(t, n) {
  const e = n.trim().toLowerCase();
  return e ? _(t, e, /* @__PURE__ */ new Set(), 0) : !1;
}
function ae(...t) {
  let n, e, r = 0;
  for (const i of t) {
    if (!pt(i))
      continue;
    n === void 0 && (n = i);
    const o = pn(i);
    o > r && (e = i, r = o);
  }
  return r > 0 ? e : n;
}
function pt(t) {
  return t == null || t === "" ? !1 : Array.isArray(t) ? t.length > 0 : typeof t == "object" ? Object.keys(t).length > 0 : !0;
}
function I(t) {
  const n = yt(Y, t);
  if (n !== T)
    return n;
  const e = W(V), r = gn(t), i = /* @__PURE__ */ new Set();
  for (const o of hn(t))
    k(e, o, { seen: i });
  return k(e, t), dt(e), r.length > 0 && (e.image = new Map(
    r.map((o) => [o, { url: o, thumbnail: o }])
  )), ht(Y, t, e);
}
function gt() {
  return {
    objects: /* @__PURE__ */ new WeakMap(),
    strings: /* @__PURE__ */ new Map()
  };
}
function yt(t, n) {
  if (n && typeof n == "object")
    return t.objects.has(n) ? t.objects.get(n) : T;
  if (!bt(n) || !t.strings.has(n))
    return T;
  const e = t.strings.get(n);
  return t.strings.delete(n), t.strings.set(n, e), e;
}
function ht(t, n, e) {
  if (n && typeof n == "object")
    return t.objects.set(n, e), e;
  if (!bt(n))
    return e;
  for (t.strings.delete(n), t.strings.set(n, e); t.strings.size > cn; ) {
    const r = t.strings.keys().next().value;
    if (typeof r != "string")
      break;
    t.strings.delete(r);
  }
  return e;
}
function bt(t) {
  return typeof t == "string" && t.length <= un;
}
function hn(t) {
  if (!pt(t))
    return [];
  const n = ln?.(t);
  return Array.isArray(n) && n.length > 0 ? n : Array.isArray(t) ? t : [t];
}
function _(t, n, e, r) {
  return t == null || r > 12 ? !1 : typeof t == "string" ? D(t).some(
    (i) => _(i, n, e, r + 1)
  ) : Array.isArray(t) ? t.some(
    (i) => _(i, n, e, r + 1)
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
    (i) => _(i, n, e, r + 1)
  ));
}
function C(t, n, e) {
  if (t == null || e > 12)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    if (!i || !i.startsWith("{") && !i.startsWith("["))
      return null;
    try {
      return C(JSON.parse(i), n, e + 1);
    } catch {
      return null;
    }
  }
  if (Array.isArray(t)) {
    for (const i of t) {
      const o = C(i, n, e + 1);
      if (o)
        return o;
    }
    return null;
  }
  if (!f(t) || n.has(t))
    return null;
  n.add(t);
  const r = bn(t);
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
    const o = C(t[i], n, e + 1);
    if (o)
      return o;
  }
  return null;
}
function bn(t) {
  if (String(t.type || "").trim().toLowerCase() !== "storyboard_grid" || !Array.isArray(t.frames))
    return null;
  const n = t.frames.map(wn).filter((e) => !!e).sort((e, r) => e.order - r.order);
  return n.length < 2 || n.length > tn ? null : {
    type: "storyboard_grid",
    version: Math.max(1, Math.trunc(Number(t.version) || 1)),
    title: w(t.title, "宫格图片"),
    summary: w(t.summary),
    frames: n
  };
}
function wn(t, n) {
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
    image: Sn(
      t.image,
      t.image_url,
      t.imageUrl
    ),
    error: w(t.error),
    assetID: X(t.asset_id, t.assetId, t.assetID),
    assetVersionID: X(
      t.asset_version_id,
      t.assetVersionId,
      t.assetVersionID
    )
  };
}
function Sn(...t) {
  for (const n of t) {
    const e = W(["image"]);
    k(e, n, { kind: "image" });
    const r = e.image.values().next().value;
    if (r?.url)
      return r.url;
  }
  return "";
}
function X(...t) {
  for (const n of t) {
    const e = Math.trunc(Number(n) || 0);
    if (e > 0)
      return e;
  }
  return 0;
}
function Nn(t) {
  return f(t) ? t.type === "doc" && Array.isArray(t.content) ? t : f(t.rich) && t.rich.type === "doc" && Array.isArray(t.rich.content) ? t.rich : null : null;
}
function wt(t) {
  return f(t) ? t.type === "text" ? !Array.isArray(t.marks) || t.marks.length === 0 : t.type === "hardBreak" ? !0 : E(t) ? !!Mt(t) : t.type !== "doc" && t.type !== "paragraph" ? !1 : Array.isArray(t.content) && t.content.every(wt) : !1;
}
function St(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : E(t) ? `![${xn(
    String(t.attrs?.alt || t.attrs?.caption || "图片")
  )}](<${Mn(Mt(t))}>)` : Array.isArray(t.content) ? t.content.map(St).join("") : "";
}
function Nt(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : E(t) ? "" : Array.isArray(t.content) ? t.content.map(Nt).join("") : "";
}
function xt(t) {
  return E(t) || !!t.content?.some((n) => xt(n));
}
function E(t) {
  return ["image", "mediaImage", "editorMediaImage"].includes(
    String(t.type || "")
  );
}
function Mt(t) {
  return String(t.attrs?.src || "").trim();
}
function xn(t) {
  return t.replace(/([\\\[\]])/g, "\\$1");
}
function Mn(t) {
  return t.replace(/</g, "%3C").replace(/>/g, "%3E");
}
await window.DeverFront?.ensureCompat?.(["@/page/nodes/show/tooltip"]);
const z = window.DeverFront?.sdk?.getCompatModule("@/page/nodes/show/tooltip");
if (!z || Object.keys(z).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/page/nodes/show/tooltip");
const An = z.HoverTip, _n = 12e3;
function q({
  label: t,
  side: n = "top",
  sideOffset: e = 7,
  className: r = "",
  children: i
}) {
  return /* @__PURE__ */ a(
    An,
    {
      content: t,
      side: n,
      sideOffset: e,
      layerZIndex: _n,
      className: `max-w-80 whitespace-normal break-words ${r}`.trim(),
      children: i
    }
  );
}
function Cn(t) {
  if (!t) return !1;
  const n = document.querySelectorAll('[data-slot="dialog-layer"]');
  return n.item(n.length - 1)?.contains(t) || !1;
}
const ce = 10040;
function ue({
  ariaLabel: t,
  header: n,
  children: e,
  onRequestClose: r,
  onEscape: i,
  layer: o = "default",
  className: s
}) {
  const c = tt(null);
  nt(() => {
    const l = (u) => {
      u.key !== "Escape" || u.defaultPrevented || !Cn(c.current) || (u.preventDefault(), u.stopImmediatePropagation(), (i || r)());
    };
    return window.addEventListener("keydown", l), () => window.removeEventListener("keydown", l);
  }, [i, r]);
  const p = /* @__PURE__ */ a(
    "div",
    {
      ref: c,
      className: ["wb-detail-backdrop", o === "nested" && "is-nested", s].filter(Boolean).join(" "),
      "data-slot": "dialog-layer",
      role: "presentation",
      onMouseDown: (l) => {
        l.stopPropagation(), l.target === l.currentTarget && r();
      },
      children: /* @__PURE__ */ m(
        "section",
        {
          className: "wb-detail-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": t,
          onMouseDown: (l) => l.stopPropagation(),
          children: [
            n,
            e
          ]
        }
      )
    }
  );
  return typeof document > "u" ? null : It(p, document.body);
}
function fe({
  icon: t,
  title: n,
  subtitle: e,
  titleStatus: r,
  versionSelect: i,
  state: o,
  updatedAt: s,
  actions: c,
  downloadUrl: p,
  onClose: l
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
      p ? /* @__PURE__ */ a(q, { label: "下载内容", children: /* @__PURE__ */ a(
        Et,
        {
          url: p,
          name: n,
          className: "wb-detail-icon-button"
        }
      ) }) : null,
      /* @__PURE__ */ a(q, { label: "关闭", children: /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "wb-detail-icon-button",
          onClick: l,
          "aria-label": "关闭详情",
          children: /* @__PURE__ */ a(kt, { size: 18 })
        }
      ) })
    ] })
  ] });
}
function le({
  options: t,
  currentVersionId: n,
  selectedVersionId: e,
  total: r,
  hasMore: i,
  loading: o,
  loadingMore: s,
  error: c,
  disabled: p = !1,
  onSelect: l,
  onLoadMore: u,
  onRetry: g
}) {
  const [y, R] = Dt(!1), $ = tt(null), At = t.find((d) => d.id === e) || t.find((d) => d.id === n);
  return nt(() => {
    if (!y) return;
    const d = (h) => {
      $.current?.contains(h.target) || R(!1);
    };
    return document.addEventListener("mousedown", d), () => document.removeEventListener("mousedown", d);
  }, [y]), !e && !o ? null : /* @__PURE__ */ m("div", { className: "wb-detail-version-select", ref: $, children: [
    /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: "wb-detail-version-trigger",
        "aria-haspopup": "listbox",
        "aria-expanded": y,
        disabled: p || o && t.length === 0,
        onClick: () => R((d) => !d),
        children: [
          o && t.length === 0 ? /* @__PURE__ */ a(L, { size: 12, className: "wb-detail-spin" }) : null,
          /* @__PURE__ */ a("span", { children: v(At?.version) }),
          r > 0 ? /* @__PURE__ */ m("small", { children: [
            r,
            " 个版本"
          ] }) : null,
          /* @__PURE__ */ a(Ct, { size: 13 })
        ]
      }
    ),
    y ? /* @__PURE__ */ a("div", { className: "wb-detail-version-menu", role: "listbox", children: /* @__PURE__ */ m(
      "div",
      {
        className: "wb-detail-version-options",
        onScroll: (d) => {
          const h = d.currentTarget;
          i && !s && h.scrollHeight - h.scrollTop - h.clientHeight < 36 && u();
        },
        children: [
          t.length > 0 ? t.map((d) => {
            const h = d.id === e, _t = d.id === n;
            return /* @__PURE__ */ m(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": h,
                className: h ? "is-selected" : "",
                onClick: () => {
                  R(!1), l(d.value);
                },
                children: [
                  /* @__PURE__ */ m("span", { children: [
                    /* @__PURE__ */ a("strong", { children: v(d.version) }),
                    _t ? /* @__PURE__ */ a("small", { children: "当前" }) : null
                  ] }),
                  /* @__PURE__ */ a("time", { children: On(d.updatedAt) }),
                  h ? /* @__PURE__ */ a(Ot, { size: 13 }) : /* @__PURE__ */ a("i", { "aria-hidden": "true" })
                ]
              },
              d.id
            );
          }) : c ? /* @__PURE__ */ a(Q, { error: c, onRetry: g }) : /* @__PURE__ */ m("div", { className: "wb-detail-version-message", children: [
            o ? /* @__PURE__ */ a(L, { size: 14, className: "wb-detail-spin" }) : null,
            /* @__PURE__ */ a("span", { children: o ? "正在读取版本" : "暂无版本" })
          ] }),
          c && t.length > 0 ? /* @__PURE__ */ a(Q, { error: c, onRetry: g }) : null,
          s ? /* @__PURE__ */ m("div", { className: "wb-detail-version-loading", children: [
            /* @__PURE__ */ a(L, { size: 13, className: "wb-detail-spin" }),
            "正在加载更多"
          ] }) : null
        ]
      }
    ) }) : null
  ] });
}
function Q({
  error: t,
  onRetry: n
}) {
  return /* @__PURE__ */ m("div", { className: "wb-detail-version-message is-error", children: [
    /* @__PURE__ */ a("span", { children: t }),
    /* @__PURE__ */ m("button", { type: "button", onClick: n, children: [
      /* @__PURE__ */ a(Tt, { size: 12 }),
      "重试"
    ] })
  ] });
}
function v(t) {
  const n = Number(t || 0);
  return n > 0 ? `第${n}版` : "版本";
}
function On(t) {
  const n = String(t || "").trim();
  return n ? n.replace("T", " ").replace(/\.\d+(Z)?$/, "").replace(/Z$/, "") : "";
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const B = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!B || Object.keys(B).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const kn = B.EnergonAudioPlayer;
function de({
  src: t,
  autoPlay: n = !1
}) {
  return /* @__PURE__ */ a("div", { className: "wb-asset-audio-preview", children: /* @__PURE__ */ a(
    kn,
    {
      src: t,
      autoPlay: n,
      className: "h-full min-h-0 border-0 bg-transparent p-0 shadow-none"
    }
  ) });
}
export {
  D as $,
  Zt as A,
  q as B,
  Yn as C,
  ce as D,
  Ln as E,
  jn as F,
  w as G,
  Fn as H,
  re as I,
  ae as J,
  yt as K,
  ht as L,
  T as M,
  Gt as N,
  Wn as O,
  gt as P,
  Bn as Q,
  ln as R,
  Lt as S,
  it as T,
  Zn as U,
  tn as V,
  Gn as W,
  de as X,
  Un as Y,
  Qt as Z,
  zn as _,
  Kn as a,
  at as a0,
  dn as a1,
  ee as a2,
  pn as a3,
  hn as a4,
  Xn as a5,
  Qn as a6,
  qn as a7,
  vt as a8,
  j as a9,
  Vn as b,
  mn as c,
  ie as d,
  f as e,
  Jn as f,
  st as g,
  ne as h,
  Cn as i,
  vn as j,
  te as k,
  oe as l,
  fe as m,
  ue as n,
  On as o,
  Rt as p,
  le as q,
  pt as r,
  Pn as s,
  yn as t,
  gn as u,
  Hn as v,
  se as w,
  $n as x,
  Yt as y,
  Xt as z
};
