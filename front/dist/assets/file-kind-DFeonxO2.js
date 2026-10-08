const t = window.React, m = t.Children, p = t.Component, g = t.Fragment, w = t.Profiler, h = t.PureComponent, x = t.StrictMode, v = t.Suspense, y = t.cloneElement, S = t.createContext, b = t.createElement, E = t.createRef, C = t.forwardRef, j = t.isValidElement, O = t.lazy, I = t.memo, R = t.startTransition, z = t.use, k = t.useCallback, M = t.useContext, _ = t.useDebugValue, $ = t.useDeferredValue, D = t.useEffect, L = t.useId, P = t.useImperativeHandle, F = t.useInsertionEffect, N = t.useLayoutEffect, T = t.useMemo, V = t.useOptimistic, q = t.useReducer, A = t.useRef, W = t.useState, H = t.useSyncExternalStore, K = t.useTransition, U = t.version, ce = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Children: m,
  Component: p,
  Fragment: g,
  Profiler: w,
  PureComponent: h,
  StrictMode: x,
  Suspense: v,
  cloneElement: y,
  createContext: S,
  createElement: b,
  createRef: E,
  default: t,
  forwardRef: C,
  isValidElement: j,
  lazy: O,
  memo: I,
  startTransition: R,
  use: z,
  useCallback: k,
  useContext: M,
  useDebugValue: _,
  useDeferredValue: $,
  useEffect: D,
  useId: L,
  useImperativeHandle: P,
  useInsertionEffect: F,
  useLayoutEffect: N,
  useMemo: T,
  useOptimistic: V,
  useReducer: q,
  useRef: A,
  useState: W,
  useSyncExternalStore: H,
  useTransition: K,
  version: U
}, Symbol.toStringTag, { value: "Module" }));
function ie(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function ue(e) {
  if (Object.prototype.hasOwnProperty.call(e, "__esModule")) return e;
  var n = e.default;
  if (typeof n == "function") {
    var s = function r() {
      var o = !1;
      try {
        o = this instanceof r;
      } catch {
      }
      return o ? Reflect.construct(n, arguments, this.constructor) : n.apply(this, arguments);
    };
    s.prototype = n.prototype;
  } else s = {};
  return Object.defineProperty(s, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var o = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(s, r, o.get ? o : {
      enumerable: !0,
      get: function() {
        return e[r];
      }
    });
  }), s;
}
function le(e) {
  return B(e);
}
function B(e) {
  const n = G(e), s = n.lastIndexOf("/");
  return s > 0 ? n.slice(0, s) : "/";
}
function G(e) {
  const n = String(e || "").trim().replace(/\\/g, "/").replace(/\/+/g, "/");
  return !n || n === "." ? "/" : n.replace(/^\/+/, "") || "/";
}
function fe(e, n, s, r = /* @__PURE__ */ new Set()) {
  const o = d(s) || "附件", i = new Set(
    e.filter((a) => a.parent_id === n && a.type === "file").map((a) => String(a.name || "").toLowerCase())
  );
  for (const a of r)
    i.add(a.toLowerCase());
  if (!i.has(o.toLowerCase()))
    return o;
  const c = o.lastIndexOf("."), u = c > 0 ? o.slice(0, c) : o, l = c > 0 ? o.slice(c) : "";
  for (let a = 1; a < 1e3; a += 1) {
    const f = `${u} ${a}${l}`;
    if (!i.has(f.toLowerCase()))
      return f;
  }
  return `${u} ${Date.now()}${l}`;
}
function de(e, n) {
  const s = d(e);
  if (!s)
    return "";
  const r = J(s), o = Q(s);
  return n === "image" ? `![${o}](<${r}>)` : `[${o}](<${r}>)`;
}
function me(e) {
  return /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i.test(e);
}
function d(e) {
  return String(e || "").trim().replace(/\\/g, "-").replace(/\//g, "-").replace(/[\u0000-\u001f]/g, "");
}
function J(e) {
  return e.split("/").map((n) => encodeURIComponent(n)).join("/");
}
function Q(e) {
  return e.replace(/([\\\]])/g, "\\$1");
}
const X = /* @__PURE__ */ new Set(["md", "markdown", "mdown", "mkd"]), Y = /* @__PURE__ */ new Set(["txt", "log"]), Z = /* @__PURE__ */ new Set([
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
]), ee = /* @__PURE__ */ new Set(["avif", "bmp", "gif", "jpeg", "jpg", "png", "svg", "webp"]), te = /* @__PURE__ */ new Set(["avi", "m4v", "mkv", "mov", "mp4", "mpeg", "mpg", "webm"]), ne = /* @__PURE__ */ new Set(["aac", "flac", "m4a", "mp3", "ogg", "wav", "weba"]), se = /* @__PURE__ */ new Set([
  "doc",
  "docx",
  "odp",
  "ods",
  "odt",
  "ppt",
  "pptx",
  "xls",
  "xlsx"
]), oe = /* @__PURE__ */ new Set(["7z", "gz", "rar", "tar", "zip"]);
function pe(e) {
  const n = re(e.name), s = String(e.mime_type || "").toLowerCase();
  return X.has(n) ? "markdown" : n === "html" || n === "htm" || s.includes("text/html") ? "html" : Z.has(n) ? "code" : Y.has(n) || s.startsWith("text/") ? "text" : n === "pdf" || s.includes("pdf") ? "pdf" : ee.has(n) || s.startsWith("image/") ? "image" : te.has(n) || s.startsWith("video/") ? "video" : ne.has(n) || s.startsWith("audio/") ? "audio" : se.has(n) || ae(s) ? "office" : oe.has(n) ? "archive" : "unknown";
}
function re(e) {
  const n = String(e || "").trim().toLowerCase(), s = n.lastIndexOf(".");
  return s >= 0 ? n.slice(s + 1) : "";
}
function ae(e) {
  return e.includes("msword") || e.includes("ms-excel") || e.includes("ms-powerpoint") || e.includes("officedocument") || e.includes("opendocument");
}
export {
  H as A,
  m as C,
  g as F,
  t as R,
  v as S,
  W as a,
  D as b,
  b as c,
  re as d,
  A as e,
  C as f,
  de as g,
  k as h,
  me as i,
  le as j,
  fe as k,
  N as l,
  L as m,
  M as n,
  S as o,
  O as p,
  I as q,
  P as r,
  pe as s,
  ue as t,
  T as u,
  ce as v,
  ie as w,
  F as x,
  y,
  j as z
};
