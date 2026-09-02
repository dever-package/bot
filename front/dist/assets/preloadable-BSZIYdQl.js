import { d as m, e as u, b as g, l as w } from "./_commonjsHelpers-C76sftkf.js";
const s = window.ReactDOM || {}, k = s.createPortal, L = s.flushSync;
s.preconnect;
s.prefetchDNS;
s.preinit;
s.preinitModule;
s.preload;
s.preloadModule;
s.requestFormReset;
s.unstable_batchedUpdates;
s.useFormState;
s.useFormStatus;
s.version;
function O() {
  const e = /* @__PURE__ */ new Map();
  return (t, n) => {
    const o = e.get(t);
    if (o)
      return o;
    let r;
    return r = Promise.resolve().then(n).finally(() => {
      e.get(t) === r && e.delete(t);
    }), e.set(t, r), r;
  };
}
const h = 2;
function y(e) {
  return Number(e) === h;
}
function F(e, t, n) {
  const o = String(e ?? "").trim(), r = String(t ?? "").trim();
  return o || r || n;
}
function q(e) {
  return x(e);
}
function x(e) {
  const t = v(e), n = t.lastIndexOf("/");
  return n > 0 ? t.slice(0, n) : "/";
}
function v(e) {
  const t = String(e || "").trim().replace(/\\/g, "/").replace(/\/+/g, "/");
  return !t || t === "." ? "/" : t.replace(/^\/+/, "") || "/";
}
function _(e, t, n, o = /* @__PURE__ */ new Set()) {
  const r = p(n) || "附件", c = new Set(
    e.filter((a) => a.parent_id === t && a.type === "file").map((a) => String(a.name || "").toLowerCase())
  );
  for (const a of o)
    c.add(a.toLowerCase());
  if (!c.has(r.toLowerCase()))
    return r;
  const i = r.lastIndexOf("."), l = i > 0 ? r.slice(0, i) : r, d = i > 0 ? r.slice(i) : "";
  for (let a = 1; a < 1e3; a += 1) {
    const f = `${l} ${a}${d}`;
    if (!c.has(f.toLowerCase()))
      return f;
  }
  return `${l} ${Date.now()}${d}`;
}
function W(e, t) {
  const n = p(e);
  if (!n)
    return "";
  const o = S(n), r = b(n);
  return t === "image" ? `![${r}](<${o}>)` : `[${r}](<${o}>)`;
}
function U(e) {
  return /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i.test(e);
}
function p(e) {
  return String(e || "").trim().replace(/\\/g, "-").replace(/\//g, "-").replace(/[\u0000-\u001f]/g, "");
}
function S(e) {
  return e.split("/").map((t) => encodeURIComponent(t)).join("/");
}
function b(e) {
  return e.replace(/([\\\]])/g, "\\$1");
}
const E = /* @__PURE__ */ new Set(["md", "markdown", "mdown", "mkd"]), R = /* @__PURE__ */ new Set(["txt", "log"]), z = /* @__PURE__ */ new Set([
  "css",
  "csv",
  "go",
  "graphql",
  "ini",
  "java",
  "js",
  "json",
  "jsx",
  "less",
  "php",
  "py",
  "rb",
  "rs",
  "scss",
  "sql",
  "toml",
  "ts",
  "tsx",
  "vue",
  "xml",
  "yaml",
  "yml"
]), C = /* @__PURE__ */ new Set(["avif", "bmp", "gif", "jpeg", "jpg", "png", "svg", "webp"]), $ = /* @__PURE__ */ new Set(["avi", "m4v", "mkv", "mov", "mp4", "mpeg", "mpg", "webm"]), I = /* @__PURE__ */ new Set(["aac", "flac", "m4a", "mp3", "ogg", "wav", "weba"]), M = /* @__PURE__ */ new Set([
  "doc",
  "docx",
  "odp",
  "ods",
  "odt",
  "ppt",
  "pptx",
  "xls",
  "xlsx"
]), N = /* @__PURE__ */ new Set(["7z", "gz", "rar", "tar", "zip"]);
function T(e) {
  const t = P(e.name), n = String(e.mime_type || "").toLowerCase();
  return E.has(t) ? "markdown" : t === "html" || t === "htm" || n.includes("text/html") ? "html" : z.has(t) ? "code" : R.has(t) || n.startsWith("text/") ? "text" : t === "pdf" || n.includes("pdf") ? "pdf" : C.has(t) || n.startsWith("image/") ? "image" : $.has(t) || n.startsWith("video/") ? "video" : I.has(t) || n.startsWith("audio/") ? "audio" : M.has(t) || D(n) ? "office" : N.has(t) ? "archive" : "unknown";
}
function P(e) {
  const t = String(e || "").trim().toLowerCase(), n = t.lastIndexOf(".");
  return n >= 0 ? t.slice(n + 1) : "";
}
function D(e) {
  return e.includes("msword") || e.includes("ms-excel") || e.includes("ms-powerpoint") || e.includes("officedocument") || e.includes("opendocument");
}
function A(e) {
  let t;
  const n = () => (t || (t = e().catch((o) => {
    throw t = void 0, o;
  })), t);
  return {
    load: n,
    preload: () => n().then(
      () => {
      },
      () => {
      }
    )
  };
}
function K(e, t) {
  return {
    Component: w(
      () => e.load().then((n) => ({ default: t(n) }))
    ),
    preload: e.preload
  };
}
function B(e, t = 140) {
  const n = m(0), o = m(e);
  o.current = e;
  const r = u(() => {
    n.current && (window.clearTimeout(n.current), n.current = 0);
  }, []), c = u(() => {
    r(), o.current?.();
  }, [r]), i = u(() => {
    r(), o.current && (n.current = window.setTimeout(() => {
      n.current = 0, o.current?.();
    }, t));
  }, [r, t]);
  return g(() => r, [r]), { schedule: i, cancel: r, preloadNow: c };
}
export {
  s as R,
  W as a,
  q as b,
  A as c,
  k as d,
  O as e,
  P as f,
  y as g,
  K as h,
  U as i,
  T as j,
  L as k,
  B as l,
  F as r,
  _ as u
};
