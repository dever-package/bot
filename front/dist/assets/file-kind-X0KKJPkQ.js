const n = window.React, x = n.Children, b = n.Component, h = n.Fragment, v = n.Profiler, y = n.PureComponent, E = n.StrictMode, j = n.Suspense, C = n.cloneElement, O = n.createContext, I = n.createElement, R = n.createRef, k = n.forwardRef, z = n.isValidElement, D = n.lazy, $ = n.memo, M = n.startTransition, _ = n.use, L = n.useCallback, P = n.useContext, F = n.useDebugValue, V = n.useDeferredValue, N = n.useEffect, T = n.useId, q = n.useImperativeHandle, A = n.useInsertionEffect, W = n.useLayoutEffect, B = n.useMemo, H = n.useOptimistic, G = n.useReducer, K = n.useRef, U = n.useState, J = n.useSyncExternalStore, Q = n.useTransition, X = n.version, ge = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Children: x,
  Component: b,
  Fragment: h,
  Profiler: v,
  PureComponent: y,
  StrictMode: E,
  Suspense: j,
  cloneElement: C,
  createContext: O,
  createElement: I,
  createRef: R,
  default: n,
  forwardRef: k,
  isValidElement: z,
  lazy: D,
  memo: $,
  startTransition: M,
  use: _,
  useCallback: L,
  useContext: P,
  useDebugValue: F,
  useDeferredValue: V,
  useEffect: N,
  useId: T,
  useImperativeHandle: q,
  useInsertionEffect: A,
  useLayoutEffect: W,
  useMemo: B,
  useOptimistic: H,
  useReducer: G,
  useRef: K,
  useState: U,
  useSyncExternalStore: J,
  useTransition: Q,
  version: X
}, Symbol.toStringTag, { value: "Module" }));
function Se(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function we(e) {
  if (Object.prototype.hasOwnProperty.call(e, "__esModule")) return e;
  var t = e.default;
  if (typeof t == "function") {
    var s = function a() {
      var o = !1;
      try {
        o = this instanceof a;
      } catch {
      }
      return o ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    s.prototype = t.prototype;
  } else s = {};
  return Object.defineProperty(s, "__esModule", { value: !0 }), Object.keys(e).forEach(function(a) {
    var o = Object.getOwnPropertyDescriptor(e, a);
    Object.defineProperty(s, a, o.get ? o : {
      enumerable: !0,
      get: function() {
        return e[a];
      }
    });
  }), s;
}
const m = (e) => {
  let t;
  const s = /* @__PURE__ */ new Set(), a = (r, u) => {
    const l = typeof r == "function" ? r(t) : r;
    if (!Object.is(l, t)) {
      const S = t;
      t = u ?? (typeof l != "object" || l === null) ? l : Object.assign({}, t, l), s.forEach((w) => w(t, S));
    }
  }, o = () => t, i = { setState: a, getState: o, getInitialState: () => d, subscribe: (r) => (s.add(r), () => s.delete(r)) }, d = t = e(a, o, i);
  return i;
}, Y = ((e) => e ? m(e) : m), Z = (e) => e;
function ee(e, t = Z) {
  const s = n.useSyncExternalStore(
    e.subscribe,
    n.useCallback(() => t(e.getState()), [e, t]),
    () => t(e.getInitialState())
  );
  return n.useDebugValue(s), s;
}
const p = (e) => {
  const t = Y(e), s = (a) => ee(t, a);
  return Object.assign(s, t), s;
}, xe = ((e) => e ? p(e) : p);
function be(e) {
  return te(e);
}
function te(e) {
  const t = ne(e), s = t.lastIndexOf("/");
  return s > 0 ? t.slice(0, s) : "/";
}
function ne(e) {
  const t = String(e || "").trim().replace(/\\/g, "/").replace(/\/+/g, "/");
  return !t || t === "." ? "/" : t.replace(/^\/+/, "") || "/";
}
function he(e, t, s, a = /* @__PURE__ */ new Set()) {
  const o = g(s) || "附件", f = new Set(
    e.filter((r) => r.parent_id === t && r.type === "file").map((r) => String(r.name || "").toLowerCase())
  );
  for (const r of a)
    f.add(r.toLowerCase());
  if (!f.has(o.toLowerCase()))
    return o;
  const c = o.lastIndexOf("."), i = c > 0 ? o.slice(0, c) : o, d = c > 0 ? o.slice(c) : "";
  for (let r = 1; r < 1e3; r += 1) {
    const u = `${i} ${r}${d}`;
    if (!f.has(u.toLowerCase()))
      return u;
  }
  return `${i} ${Date.now()}${d}`;
}
function ve(e, t) {
  const s = g(e);
  if (!s)
    return "";
  const a = se(s), o = oe(s);
  return t === "image" ? `![${o}](<${a}>)` : `[${o}](<${a}>)`;
}
function ye(e) {
  return /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i.test(e);
}
function g(e) {
  return String(e || "").trim().replace(/\\/g, "-").replace(/\//g, "-").replace(/[\u0000-\u001f]/g, "");
}
function se(e) {
  return e.split("/").map((t) => encodeURIComponent(t)).join("/");
}
function oe(e) {
  return e.replace(/([\\\]])/g, "\\$1");
}
const re = /* @__PURE__ */ new Set(["md", "markdown", "mdown", "mkd"]), ae = /* @__PURE__ */ new Set(["txt", "log"]), ce = /* @__PURE__ */ new Set([
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
]), ie = /* @__PURE__ */ new Set(["avif", "bmp", "gif", "jpeg", "jpg", "png", "svg", "webp"]), ue = /* @__PURE__ */ new Set(["avi", "m4v", "mkv", "mov", "mp4", "mpeg", "mpg", "webm"]), le = /* @__PURE__ */ new Set(["aac", "flac", "m4a", "mp3", "ogg", "wav", "weba"]), fe = /* @__PURE__ */ new Set([
  "doc",
  "docx",
  "odp",
  "ods",
  "odt",
  "ppt",
  "pptx",
  "xls",
  "xlsx"
]), de = /* @__PURE__ */ new Set(["7z", "gz", "rar", "tar", "zip"]);
function Ee(e) {
  const t = me(e.name), s = String(e.mime_type || "").toLowerCase();
  return re.has(t) ? "markdown" : t === "html" || t === "htm" || s.includes("text/html") ? "html" : ce.has(t) ? "code" : ae.has(t) || s.startsWith("text/") ? "text" : t === "pdf" || s.includes("pdf") ? "pdf" : ie.has(t) || s.startsWith("image/") ? "image" : ue.has(t) || s.startsWith("video/") ? "video" : le.has(t) || s.startsWith("audio/") ? "audio" : fe.has(t) || pe(s) ? "office" : de.has(t) ? "archive" : "unknown";
}
function me(e) {
  const t = String(e || "").trim().toLowerCase(), s = t.lastIndexOf(".");
  return s >= 0 ? t.slice(s + 1) : "";
}
function pe(e) {
  return e.includes("msword") || e.includes("ms-excel") || e.includes("ms-powerpoint") || e.includes("officedocument") || e.includes("opendocument");
}
export {
  ge as A,
  we as B,
  x as C,
  Y as D,
  J as E,
  h as F,
  b as G,
  n as R,
  j as S,
  U as a,
  K as b,
  I as c,
  N as d,
  me as e,
  k as f,
  ve as g,
  L as h,
  ye as i,
  be as j,
  he as k,
  W as l,
  ee as m,
  T as n,
  P as o,
  O as p,
  D as q,
  $ as r,
  q as s,
  Ee as t,
  B as u,
  A as v,
  Se as w,
  xe as x,
  C as y,
  z
};
