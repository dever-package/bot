import { j as S } from "./preloadable-BrN58FXf.js";
function lt(t) {
  if (typeof t != "string")
    return t;
  const n = t.trim();
  if (!D(n))
    return t;
  try {
    return JSON.parse(n);
  } catch {
    return t;
  }
}
function c(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function en(t) {
  return c(t) ? t : {};
}
function on(t) {
  return typeof t == "string" ? t.trim() : "";
}
function sn(t) {
  const n = Number(t || 0);
  return Number.isFinite(n) ? n : 0;
}
function cn(t) {
  if (t == null || t === "")
    return;
  const n = Number(t);
  return Number.isFinite(n) ? n : void 0;
}
function K(t) {
  const n = String(t || "").trim(), r = pt(n), e = St(r);
  for (const i of q([n, r, e])) {
    const o = lt(i);
    if (o !== i)
      return o;
    const s = ht(i);
    if (s !== i)
      return s;
  }
  return t;
}
function an(t) {
  const n = String(t || "").trim();
  for (const r of H(n)) {
    const e = K(r);
    if (e !== r)
      return e;
  }
  return t;
}
function N(t) {
  const n = [];
  for (const r of H(
    String(t || "").trim()
  )) {
    const e = K(r);
    e !== r && n.push(e);
  }
  return n;
}
function pt(t) {
  let n = "", r = !1, e = !1;
  for (const i of t) {
    if (e) {
      n += i, e = !1;
      continue;
    }
    if (i === "\\") {
      n += i, e = r;
      continue;
    }
    if (i === '"') {
      r = !r, n += i;
      continue;
    }
    if (r && i.charCodeAt(0) < 32) {
      n += bt(i);
      continue;
    }
    n += i;
  }
  return n;
}
function H(t) {
  const n = [t];
  for (const r of t.matchAll(/```(?:json|storyboard)?\s*([\s\S]*?)```/gi))
    n.push(String(r[1] || "").trim());
  return n.push(...gt(t)), q(n);
}
function gt(t) {
  const n = [];
  for (let r = 0; r < t.length; r += 1) {
    const e = t[r];
    if (e !== "{" && e !== "[")
      continue;
    const i = yt(t, r);
    i && (n.push(i), r += i.length - 1);
  }
  return n;
}
function yt(t, n) {
  const r = [];
  let e = !1, i = !1;
  for (let o = n; o < t.length; o += 1) {
    const s = t[o];
    if (i) {
      i = !1;
      continue;
    }
    if (e && s === "\\") {
      i = !0;
      continue;
    }
    if (s === '"') {
      e = !e;
      continue;
    }
    if (e)
      continue;
    if (s === "{" || s === "[") {
      r.push(s);
      continue;
    }
    if (s !== "}" && s !== "]")
      continue;
    const a = s === "}" ? "{" : "[";
    if (r.pop() !== a)
      return "";
    if (r.length === 0)
      return t.slice(n, o + 1).trim();
  }
  return "";
}
function D(t) {
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function ht(t) {
  if (!t.startsWith('"') || !t.endsWith('"'))
    return t;
  try {
    const n = JSON.parse(t);
    return typeof n == "string" ? n : t;
  } catch {
    return t;
  }
}
function bt(t) {
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
function St(t) {
  const n = t.trim();
  return !n.includes('\\"') || !n.startsWith("{") && !n.startsWith("[") ? t : n.replace(/\\"/g, '"');
}
function q(t) {
  const n = /* @__PURE__ */ new Set();
  return t.filter((r) => {
    const e = String(r || "").trim();
    return !e || n.has(e) ? !1 : (n.add(e), !0);
  });
}
function un(...t) {
  return t.find(
    (n) => n != null
  );
}
function fn(t) {
  try {
    return JSON.stringify(t);
  } catch {
    return "";
  }
}
const xt = {
  audio: "editorMediaAudio",
  image: "editorMediaImage",
  mediaAudio: "editorMediaAudio",
  mediaImage: "editorMediaImage",
  mediaVideo: "editorMediaVideo",
  video: "editorMediaVideo"
}, X = [
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
function dn(t) {
  const n = Y(t);
  return n.length > 120 ? `${n.slice(0, 120)}...` : n;
}
function Y(t) {
  return x(t).replace(/\s+/g, " ").trim();
}
function wt(t) {
  if (typeof t != "string")
    return "";
  const n = t.trim();
  if (!Ot(n))
    return "";
  const r = n.search(/"rich"\s*:/), e = r >= 0 ? n.slice(r) : n, i = [], o = /"text"\s*:\s*"((?:\\.|[^"\\])*)"/g;
  let s = null;
  for (; (s = o.exec(e)) !== null; ) {
    const a = _t(s[1]).trim();
    a && i.push(a);
  }
  return i.join(" ").replace(/\s+/g, " ").trim();
}
function Q(t) {
  const n = h(t, /* @__PURE__ */ new Set());
  return R(n) ? n : null;
}
function mn(t) {
  try {
    return Y(t);
  } catch {
    return "";
  }
}
function ln(t) {
  try {
    return Q(t);
  } catch {
    return null;
  }
}
function x(t) {
  if (typeof t == "string") {
    const e = t.trim();
    if (D(e)) {
      const i = nt(e);
      if (i !== void 0)
        return x(i).trim();
    }
    return wt(e) || t;
  }
  if (Array.isArray(t))
    return t.map(x).filter(Boolean).join(" ");
  if (!c(t))
    return "";
  const n = Q(t);
  if (n)
    return tt(n);
  const r = [
    typeof t.text == "string" ? t.text : "",
    typeof t.markdown == "string" ? t.markdown : ""
  ];
  for (const e of X)
    t[e] != null && r.push(x(t[e]));
  return r.filter(Boolean).join(" ");
}
function h(t, n) {
  if (typeof t == "string") {
    const e = t.trim();
    if (!D(e))
      return null;
    const i = nt(e);
    return i === void 0 ? null : h(i, n);
  }
  if (Array.isArray(t)) {
    const e = L({ type: "doc", content: t });
    if (R(e))
      return e;
    for (const i of t) {
      const o = h(i, n);
      if (o)
        return o;
    }
    return null;
  }
  if (!c(t) || n.has(t))
    return null;
  n.add(t);
  const r = L(t);
  if (r)
    return r;
  if (String(t.format || "").toLowerCase() === "rich_json" && t.rich != null) {
    const e = h(t.rich, n);
    if (e)
      return e;
  }
  for (const e of X) {
    if (t[e] == null)
      continue;
    const i = h(t[e], n);
    if (i)
      return i;
  }
  return null;
}
function L(t) {
  return !c(t) || v(t.type) !== "doc" ? null : {
    type: "doc",
    attrs: c(t.attrs) ? t.attrs : void 0,
    content: Z(t.content)
  };
}
function Z(t) {
  return Array.isArray(t) ? t.map(Mt).filter((n) => !!n) : [];
}
function Mt(t) {
  if (!c(t))
    return null;
  const n = v(t.type) || Ct(t);
  if (!n)
    return null;
  const r = { type: n }, e = c(t.attrs) ? { ...t.attrs } : {};
  if (n === "heading" && A(e.level) <= 0) {
    const s = A(t.level);
    s > 0 && (e.level = s);
  }
  Object.keys(e).length > 0 && (r.attrs = e);
  const i = At(t.marks);
  if (i.length > 0 && (r.marks = i), n === "text") {
    const s = p(t.text);
    return s ? (r.text = s, r) : null;
  }
  const o = Z(t.content);
  return o.length > 0 && (r.content = o), r;
}
function Ct(t) {
  if (typeof t.text == "string")
    return "text";
  const n = c(t.attrs) ? t.attrs : {};
  return A(n.level) > 0 || A(t.level) > 0 ? "heading" : "";
}
function At(t) {
  return Array.isArray(t) ? t.map((n) => {
    if (!c(n))
      return null;
    const r = p(n.type);
    return r ? {
      type: r,
      attrs: c(n.attrs) ? n.attrs : void 0
    } : null;
  }).filter(
    (n) => !!n
  ) : [];
}
function v(t) {
  const n = p(t);
  return xt[n] || n;
}
function tt(t) {
  return t ? t.type === "text" ? t.text || "" : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? p(t.attrs?.alt || t.attrs?.title || t.attrs?.src) : (t.content || []).map(tt).filter(Boolean).join(" ") : "";
}
function R(t) {
  return t ? t.type === "text" ? !!p(t.text) : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? !!p(t.attrs?.src) : (t.content || []).some(R) : !1;
}
function nt(t) {
  try {
    return JSON.parse(t);
  } catch {
    return;
  }
}
function Ot(t) {
  return t.includes("rich_json") || t.includes('"rich"') || t.includes("agent_run_id") || t.includes("node_run_id");
}
function _t(t) {
  try {
    return JSON.parse(`"${t}"`);
  } catch {
    return t.replace(/\\"/g, '"').replace(/\\n/g, `
`).replace(/\\t/g, "	").replace(/\\\\/g, "\\");
  }
}
function A(t) {
  const n = Number(t || 0);
  return Number.isFinite(n) ? n : 0;
}
function p(t) {
  return t == null ? "" : String(t).trim();
}
const k = [
  { value: "auto", label: "自动", columns: 0, rows: 0, capacity: 9 },
  { value: "2x2", label: "2×2", columns: 2, rows: 2, capacity: 4 },
  { value: "3x2", label: "3×2", columns: 3, rows: 2, capacity: 6 },
  { value: "3x3", label: "3×3", columns: 3, rows: 3, capacity: 9 }
], Nt = new Set(
  k.map((t) => t.value)
);
function It(t) {
  const n = String(t || "").trim().toLowerCase();
  return Nt.has(n) ? n : "auto";
}
function Tt(t) {
  const n = It(t);
  return k.find((r) => r.value === n) || k[0];
}
function pn(t, n) {
  const r = Tt(t), e = Math.max(0, Math.trunc(Number(n) || 0));
  return r.value !== "auto" ? r : e === 0 || e > 6 ? { columns: 3, rows: 3, capacity: 9 } : e > 4 ? { columns: 3, rows: 2, capacity: 6 } : e > 2 ? { columns: 2, rows: 2, capacity: 4 } : { columns: 2, rows: 1, capacity: 2 };
}
function gn(t) {
  const n = Math.max(0, Math.trunc(Number(t) || 0));
  return n <= 1 ? { columns: 1, rows: 1, capacity: 1 } : n === 2 ? { columns: 2, rows: 1, capacity: 2 } : { columns: 2, rows: 2, capacity: 4 };
}
function yn(t, n) {
  const r = Math.max(0, Math.trunc(Number(n) || 0) - 1);
  return Math.min(
    r,
    Math.max(0, Math.trunc(Number(t) || 0))
  );
}
const kt = 50, Et = {
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
}, jt = [
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
function U(t) {
  return Object.fromEntries(
    t.map((n) => [n, /* @__PURE__ */ new Map()])
  );
}
function O(t, n, r = {}) {
  const e = {
    media: t,
    enabledKinds: Object.keys(t),
    seen: r.seen || /* @__PURE__ */ new Set(),
    requestedKind: r.kind
  };
  f(n, e, 0, r.kind);
}
function hn(t, n) {
  const e = U(n === "audio" ? ["audio", "image"] : [n]);
  return O(e, t, { kind: n }), rt(e), Array.from(e[n].values());
}
function rt(t) {
  const n = t.audio, r = t.image;
  if (!n || !r || n.size === 0 || n.size !== r.size)
    return;
  const e = Array.from(r.values());
  Array.from(n.values()).forEach((i, o) => {
    if (i.thumbnail)
      return;
    const s = et(
      "audio",
      i.url,
      e[o]?.url || ""
    );
    s && n.set(i.url, { ...i, thumbnail: s });
  });
}
function f(t, n, r, e, i = "") {
  if (t == null || r > 12)
    return;
  if (Array.isArray(t)) {
    const u = t.length > 1 ? "" : i;
    t.forEach(
      (d) => f(
        d,
        n,
        r + 1,
        e,
        u
      )
    );
    return;
  }
  if (typeof t == "string") {
    const u = N(t);
    if (u.length > 0) {
      u.forEach(
        (y) => f(
          y,
          n,
          r + 1,
          e,
          i
        )
      );
      return;
    }
    const d = e || n.requestedKind || zt(t);
    d && n.media[d] && z(t) && Dt(
      n.media,
      d,
      t.trim(),
      i
    );
    return;
  }
  if (typeof t != "object" || n.seen.has(t))
    return;
  n.seen.add(t);
  const o = t, s = c(o.attrs) ? o.attrs : void 0, a = Ut(
    o.type,
    o.kind,
    o.media_type,
    o.mediaType,
    o.mime
  ), l = Rt(
    o,
    s,
    i
  ), g = e || n.requestedKind;
  if (g && n.media[g] && (!a || a === g))
    for (const u of V(o, g))
      f(
        u,
        n,
        r + 1,
        g,
        l
      );
  for (const u of n.enabledKinds) {
    const d = Et[u];
    for (const y of d.direct)
      f(
        o[y],
        n,
        r + 1,
        u,
        l
      );
    for (const y of d.collections)
      f(
        o[y],
        n,
        r + 1,
        u,
        l
      );
  }
  if (a && n.media[a]) {
    for (const u of V(o, a))
      f(
        u,
        n,
        r + 1,
        a,
        l
      );
    f(
      o.attrs,
      n,
      r + 1,
      a,
      l
    );
  }
  for (const u of jt)
    f(
      o[u],
      n,
      r + 1
    );
}
function V(t, n) {
  const r = [
    t.url,
    t.src,
    t.file_url,
    t.fileUrl,
    t.download_url,
    t.downloadUrl
  ];
  return n === "file" ? (r.push(t.download, t.open_url, t.openUrl, t.path), [
    r.find(
      (e) => typeof e == "string" && z(e)
    )
  ]) : r;
}
function Dt(t, n, r, e) {
  const i = t[n];
  if (!i)
    return;
  const o = et(
    n,
    r,
    e
  ), s = i.get(r);
  if (s?.thumbnail || !o) {
    s || i.set(r, { url: r });
    return;
  }
  i.set(r, { url: r, thumbnail: o });
}
function et(t, n, r) {
  const e = r.trim();
  return !e || t !== "image" && e === n.trim() ? "" : e;
}
function Rt(t, n, r) {
  for (const e of [
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
    r
  ])
    if (typeof e == "string" && z(e))
      return e.trim();
  return "";
}
function Ut(...t) {
  for (const n of t) {
    const r = String(n || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
    if (["image", "mediaimage", "editormediaimage"].includes(r) || r.startsWith("image/"))
      return "image";
    if (["video", "mediavideo", "editormediavideo"].includes(r) || r.startsWith("video/"))
      return "video";
    if (["audio", "music", "voice", "mediaaudio", "editormediaaudio"].includes(
      r
    ) || r.startsWith("audio/"))
      return "audio";
    if (["file", "mediafile", "editormediafile"].includes(r) || r.startsWith("application/") || r.startsWith("text/"))
      return "file";
  }
}
function zt(t) {
  const n = t.trim();
  if (/^data:image\//i.test(n) || /\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i.test(n))
    return "image";
  if (/^data:video\//i.test(n) || /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(n))
    return "video";
  if (/^data:audio\//i.test(n) || /\.(mp3|wav|ogg|m4a|aac)(?:[?#].*)?$/i.test(n))
    return "audio";
}
function z(t) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(t.trim());
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const E = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!E || Object.keys(E).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const B = ["image", "video", "audio"], Bt = 64, Jt = 128 * 1024, _ = /* @__PURE__ */ Symbol("content-output-cache-miss"), G = it(), F = it(), Lt = E, Vt = Lt.normalizeEnergonOutput;
function m(...t) {
  for (const n of t)
    if (typeof n == "string" && n.trim())
      return n.trim();
  return "";
}
function bn(t) {
  const n = b(
    t,
    ["lyrics", "lyric", "lrc", "song_lyrics", "songLyrics"],
    /* @__PURE__ */ new Set(),
    0
  );
  if (n)
    return { label: "歌词", text: n };
  const r = b(
    t,
    ["text"],
    /* @__PURE__ */ new Set(),
    0
  );
  return r ? { label: "创作内容", text: r } : null;
}
function b(t, n, r, e) {
  if (t == null || e > 12)
    return "";
  if (typeof t == "string") {
    for (const i of N(t)) {
      const o = b(i, n, r, e + 1);
      if (o)
        return o;
    }
    return "";
  }
  if (Array.isArray(t)) {
    for (const i of t) {
      const o = b(i, n, r, e + 1);
      if (o)
        return o;
    }
    return "";
  }
  if (!c(t) || r.has(t))
    return "";
  r.add(t);
  for (const i of n) {
    const o = w(t[i], e + 1);
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
    const o = b(t[i], n, r, e + 1);
    if (o)
      return o;
  }
  return "";
}
function w(t, n) {
  if (t == null || n > 12)
    return "";
  if (typeof t == "string") {
    const r = t.trim();
    if (!r || /^(https?:\/\/|\/|data:|blob:)/i.test(r))
      return "";
    const e = N(r);
    return e.length > 0 ? e.map((i) => w(i, n + 1)).filter(Boolean).join(`
`) : r;
  }
  if (Array.isArray(t))
    return t.map((r) => w(r, n + 1)).filter(Boolean).join(`
`);
  if (!c(t))
    return "";
  for (const r of ["text", "content", "line", "lines", "value"]) {
    const e = w(t[r], n + 1);
    if (e)
      return e;
  }
  return "";
}
function Sn(t) {
  const n = Gt(t);
  return !n || n.hasMedia ? "" : n.markdown;
}
function Gt(t) {
  const n = Yt(t);
  return !n || !at(n) ? null : {
    markdown: n.content.map(ut).join(`

`).trim(),
    plainText: n.content.map(ft).join(`

`).trim(),
    hasMedia: dt(n)
  };
}
function xn(t) {
  return /(^|\n)\s*(#{1,6}\s|[-*+]\s|>\s|\d+\.\s|```)/m.test(t) || /(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|`[^`]+`)/.test(t);
}
function wn(t) {
  return Ft(t).length > 0;
}
function Ft(t) {
  const n = I(t);
  return B.filter((r) => n[r].size > 0);
}
function Wt(t) {
  const n = I(t);
  return B.reduce(
    (r, e) => r + n[e].size,
    0
  );
}
function Mn(t, n) {
  return Array.from(I(t)[n].keys());
}
function Cn(t, n) {
  return Array.from(I(t)[n].values());
}
function Pt(t) {
  const n = $t(t);
  return n ? Array.from(
    new Set(n.frames.map((r) => r.image.trim()).filter(Boolean))
  ) : [];
}
function $t(t) {
  const n = ot(F, t);
  return n !== _ ? n : st(
    F,
    t,
    C(t, /* @__PURE__ */ new Set(), 0)
  );
}
function An(t, n) {
  const r = n.trim().toLowerCase();
  return r ? M(t, r, /* @__PURE__ */ new Set(), 0) : !1;
}
function On(...t) {
  let n, r, e = 0;
  for (const i of t) {
    if (!J(i))
      continue;
    n === void 0 && (n = i);
    const o = Wt(i);
    o > e && (r = i, e = o);
  }
  return e > 0 ? r : n;
}
function J(t) {
  return t == null || t === "" ? !1 : Array.isArray(t) ? t.length > 0 : typeof t == "object" ? Object.keys(t).length > 0 : !0;
}
function I(t) {
  const n = ot(G, t);
  if (n !== _)
    return n;
  const r = U(B), e = Pt(t), i = /* @__PURE__ */ new Set();
  for (const o of Kt(t))
    O(r, o, { seen: i });
  return O(r, t), rt(r), e.length > 0 && (r.image = new Map(
    e.map((o) => [o, { url: o, thumbnail: o }])
  )), st(G, t, r);
}
function it() {
  return {
    objects: /* @__PURE__ */ new WeakMap(),
    strings: /* @__PURE__ */ new Map()
  };
}
function ot(t, n) {
  if (n && typeof n == "object")
    return t.objects.has(n) ? t.objects.get(n) : _;
  if (!ct(n) || !t.strings.has(n))
    return _;
  const r = t.strings.get(n);
  return t.strings.delete(n), t.strings.set(n, r), r;
}
function st(t, n, r) {
  if (n && typeof n == "object")
    return t.objects.set(n, r), r;
  if (!ct(n))
    return r;
  for (t.strings.delete(n), t.strings.set(n, r); t.strings.size > Bt; ) {
    const e = t.strings.keys().next().value;
    if (typeof e != "string")
      break;
    t.strings.delete(e);
  }
  return r;
}
function ct(t) {
  return typeof t == "string" && t.length <= Jt;
}
function Kt(t) {
  if (!J(t))
    return [];
  const n = Vt?.(t);
  return Array.isArray(n) && n.length > 0 ? n : Array.isArray(t) ? t : [t];
}
function M(t, n, r, e) {
  return t == null || e > 12 ? !1 : typeof t == "string" ? N(t).some(
    (i) => M(i, n, r, e + 1)
  ) : Array.isArray(t) ? t.some(
    (i) => M(i, n, r, e + 1)
  ) : !c(t) || r.has(t) ? !1 : (r.add(t), String(t.type || "").trim().toLowerCase() === n ? !0 : [
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
    (i) => M(i, n, r, e + 1)
  ));
}
function C(t, n, r) {
  if (t == null || r > 12)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    if (!i || !i.startsWith("{") && !i.startsWith("["))
      return null;
    try {
      return C(JSON.parse(i), n, r + 1);
    } catch {
      return null;
    }
  }
  if (Array.isArray(t)) {
    for (const i of t) {
      const o = C(i, n, r + 1);
      if (o)
        return o;
    }
    return null;
  }
  if (!c(t) || n.has(t))
    return null;
  n.add(t);
  const e = Ht(t);
  if (e)
    return e;
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
    const o = C(t[i], n, r + 1);
    if (o)
      return o;
  }
  return null;
}
function Ht(t) {
  if (String(t.type || "").trim().toLowerCase() !== "storyboard_grid" || !Array.isArray(t.frames))
    return null;
  const n = t.frames.map(qt).filter((r) => !!r).sort((r, e) => r.order - e.order);
  return n.length < 2 || n.length > kt ? null : {
    type: "storyboard_grid",
    version: Math.max(1, Math.trunc(Number(t.version) || 1)),
    title: m(t.title, "宫格图片"),
    summary: m(t.summary),
    frames: n
  };
}
function qt(t, n) {
  if (!c(t))
    return null;
  const r = Math.max(1, Math.trunc(Number(t.order) || n + 1));
  return {
    id: m(t.id, `frame-${String(r).padStart(2, "0")}`),
    order: r,
    title: m(
      t.title,
      `画面 ${String(r).padStart(2, "0")}`
    ),
    description: m(t.description),
    prompt: m(t.prompt),
    status: m(t.status),
    image: Xt(
      t.image,
      t.image_url,
      t.imageUrl
    ),
    error: m(t.error),
    assetID: W(t.asset_id, t.assetId, t.assetID),
    assetVersionID: W(
      t.asset_version_id,
      t.assetVersionId,
      t.assetVersionID
    )
  };
}
function Xt(...t) {
  for (const n of t) {
    const r = U(["image"]);
    O(r, n, { kind: "image" });
    const e = r.image.values().next().value;
    if (e?.url)
      return e.url;
  }
  return "";
}
function W(...t) {
  for (const n of t) {
    const r = Math.trunc(Number(n) || 0);
    if (r > 0)
      return r;
  }
  return 0;
}
function Yt(t) {
  return c(t) ? t.type === "doc" && Array.isArray(t.content) ? t : c(t.rich) && t.rich.type === "doc" && Array.isArray(t.rich.content) ? t.rich : null : null;
}
function at(t) {
  return c(t) ? t.type === "text" ? !Array.isArray(t.marks) || t.marks.length === 0 : t.type === "hardBreak" ? !0 : T(t) ? !!mt(t) : t.type !== "doc" && t.type !== "paragraph" ? !1 : Array.isArray(t.content) && t.content.every(at) : !1;
}
function ut(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : T(t) ? `![${Qt(
    String(t.attrs?.alt || t.attrs?.caption || "图片")
  )}](<${Zt(mt(t))}>)` : Array.isArray(t.content) ? t.content.map(ut).join("") : "";
}
function ft(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : T(t) ? "" : Array.isArray(t.content) ? t.content.map(ft).join("") : "";
}
function dt(t) {
  return T(t) || !!t.content?.some((n) => dt(n));
}
function T(t) {
  return ["image", "mediaImage", "editorMediaImage"].includes(
    String(t.type || "")
  );
}
function mt(t) {
  return String(t.attrs?.src || "").trim();
}
function Qt(t) {
  return t.replace(/([\\\[\]])/g, "\\$1");
}
function Zt(t) {
  return t.replace(/</g, "%3C").replace(/>/g, "%3E");
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const j = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!j || Object.keys(j).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const P = j, $ = P.ContentView || P.EnergonContentView;
function _n({
  output: t,
  fallback: n = "",
  streaming: r = !1,
  emptyText: e = "暂无内容",
  className: i,
  markdownClassName: o,
  richClassName: s,
  mediaLayout: a = "default"
}) {
  const l = vt(t, n);
  return $ ? /* @__PURE__ */ S(tn, { className: i, children: /* @__PURE__ */ S(
    $,
    {
      output: l,
      streaming: r,
      emptyText: e,
      markdownClassName: o,
      richClassName: s,
      mediaLayout: a
    }
  ) }) : n ? /* @__PURE__ */ S("div", { className: i, children: n }) : null;
}
function vt(t, n = "") {
  return J(t) ? t : n ? { text: n } : t;
}
function tn({
  className: t,
  children: n
}) {
  const r = (e) => {
    nn(e.target) && e.stopPropagation();
  };
  return /* @__PURE__ */ S(
    "div",
    {
      className: t,
      onPointerDown: r,
      onClick: r,
      children: n
    }
  );
}
function nn(t) {
  return t instanceof Element && !!t.closest(
    "a, button, input, textarea, select, audio, video, [role='button']"
  );
}
export {
  Vt as A,
  _n as B,
  _ as C,
  pt as D,
  q as E,
  dn as F,
  Kt as G,
  Gt as H,
  xn as I,
  Pt as J,
  sn as K,
  It as L,
  cn as M,
  Wt as N,
  pn as O,
  yn as P,
  gn as Q,
  Tt as R,
  kt as S,
  k as T,
  vt as U,
  tn as V,
  N as W,
  Q as X,
  Mn as a,
  bn as b,
  Ft as c,
  Cn as d,
  hn as e,
  fn as f,
  Y as g,
  Sn as h,
  c as i,
  J as j,
  $t as k,
  An as l,
  m,
  un as n,
  en as o,
  lt as p,
  wn as q,
  On as r,
  ln as s,
  on as t,
  ot as u,
  wt as v,
  st as w,
  mn as x,
  it as y,
  an as z
};
