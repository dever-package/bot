const s = window.ReactDOM || {}, M = s.createPortal, j = s.flushSync;
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
function D() {
  const e = /* @__PURE__ */ new Map();
  return (t, n) => {
    const a = e.get(t);
    if (a)
      return a;
    let r;
    return r = Promise.resolve().then(n).finally(() => {
      e.get(t) === r && e.delete(t);
    }), e.set(t, r), r;
  };
}
function k(e) {
  return m(e);
}
function m(e) {
  const t = p(e), n = t.lastIndexOf("/");
  return n > 0 ? t.slice(0, n) : "/";
}
function p(e) {
  const t = String(e || "").trim().replace(/\\/g, "/").replace(/\/+/g, "/");
  return !t || t === "." ? "/" : t.replace(/^\/+/, "") || "/";
}
function C(e, t, n, a = /* @__PURE__ */ new Set()) {
  const r = f(n) || "附件", c = new Set(
    e.filter((o) => o.parent_id === t && o.type === "file").map((o) => String(o.name || "").toLowerCase())
  );
  for (const o of a)
    c.add(o.toLowerCase());
  if (!c.has(r.toLowerCase()))
    return r;
  const i = r.lastIndexOf("."), u = i > 0 ? r.slice(0, i) : r, l = i > 0 ? r.slice(i) : "";
  for (let o = 1; o < 1e3; o += 1) {
    const d = `${u} ${o}${l}`;
    if (!c.has(d.toLowerCase()))
      return d;
  }
  return `${u} ${Date.now()}${l}`;
}
function F(e, t) {
  const n = f(e);
  if (!n)
    return "";
  const a = g(n), r = w(n);
  return t === "image" ? `![${r}](<${a}>)` : `[${r}](<${a}>)`;
}
function O(e) {
  return /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i.test(e);
}
function f(e) {
  return String(e || "").trim().replace(/\\/g, "-").replace(/\//g, "-").replace(/[\u0000-\u001f]/g, "");
}
function g(e) {
  return e.split("/").map((t) => encodeURIComponent(t)).join("/");
}
function w(e) {
  return e.replace(/([\\\]])/g, "\\$1");
}
const x = /* @__PURE__ */ new Set(["md", "markdown", "mdown", "mkd"]), h = /* @__PURE__ */ new Set(["txt", "log"]), v = /* @__PURE__ */ new Set([
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
]), S = /* @__PURE__ */ new Set(["avif", "bmp", "gif", "jpeg", "jpg", "png", "svg", "webp"]), b = /* @__PURE__ */ new Set(["avi", "m4v", "mkv", "mov", "mp4", "mpeg", "mpg", "webm"]), $ = /* @__PURE__ */ new Set(["aac", "flac", "m4a", "mp3", "ogg", "wav", "weba"]), z = /* @__PURE__ */ new Set([
  "doc",
  "docx",
  "odp",
  "ods",
  "odt",
  "ppt",
  "pptx",
  "xls",
  "xlsx"
]), E = /* @__PURE__ */ new Set(["7z", "gz", "rar", "tar", "zip"]);
function q(e) {
  const t = I(e.name), n = String(e.mime_type || "").toLowerCase();
  return x.has(t) ? "markdown" : t === "html" || t === "htm" || n.includes("text/html") ? "html" : v.has(t) ? "code" : h.has(t) || n.startsWith("text/") ? "text" : t === "pdf" || n.includes("pdf") ? "pdf" : S.has(t) || n.startsWith("image/") ? "image" : b.has(t) || n.startsWith("video/") ? "video" : $.has(t) || n.startsWith("audio/") ? "audio" : z.has(t) || L(n) ? "office" : E.has(t) ? "archive" : "unknown";
}
function I(e) {
  const t = String(e || "").trim().toLowerCase(), n = t.lastIndexOf(".");
  return n >= 0 ? t.slice(n + 1) : "";
}
function L(e) {
  return e.includes("msword") || e.includes("ms-excel") || e.includes("ms-powerpoint") || e.includes("officedocument") || e.includes("opendocument");
}
export {
  s as R,
  F as a,
  D as b,
  k as c,
  M as d,
  j as e,
  I as f,
  O as i,
  q as r,
  C as u
};
