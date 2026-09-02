const e = window.React, b = e.Children, S = e.Component, y = e.Fragment, g = e.Profiler, E = e.PureComponent, C = e.StrictMode, O = e.Suspense, j = e.cloneElement, v = e.createContext, I = e.createElement, R = e.createRef, h = e.forwardRef, P = e.isValidElement, _ = e.lazy, w = e.memo, M = e.startTransition, D = e.use, V = e.useCallback, x = e.useContext, T = e.useDebugValue, k = e.useDeferredValue, F = e.useEffect, z = e.useId, H = e.useImperativeHandle, L = e.useInsertionEffect, q = e.useLayoutEffect, A = e.useMemo, B = e.useOptimistic, N = e.useReducer, G = e.useRef, J = e.useState, K = e.useSyncExternalStore, Q = e.useTransition, U = e.version, ee = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Children: b,
  Component: S,
  Fragment: y,
  Profiler: g,
  PureComponent: E,
  StrictMode: C,
  Suspense: O,
  cloneElement: j,
  createContext: v,
  createElement: I,
  createRef: R,
  default: e,
  forwardRef: h,
  isValidElement: P,
  lazy: _,
  memo: w,
  startTransition: M,
  use: D,
  useCallback: V,
  useContext: x,
  useDebugValue: T,
  useDeferredValue: k,
  useEffect: F,
  useId: z,
  useImperativeHandle: H,
  useInsertionEffect: L,
  useLayoutEffect: q,
  useMemo: A,
  useOptimistic: B,
  useReducer: N,
  useRef: G,
  useState: J,
  useSyncExternalStore: K,
  useTransition: Q,
  version: U
}, Symbol.toStringTag, { value: "Module" })), l = (t) => {
  let s;
  const n = /* @__PURE__ */ new Set(), o = (r, i) => {
    const a = typeof r == "function" ? r(s) : r;
    if (!Object.is(a, s)) {
      const p = s;
      s = i ?? (typeof a != "object" || a === null) ? a : Object.assign({}, s, a), n.forEach((m) => m(s, p));
    }
  }, c = () => s, u = { setState: o, getState: c, getInitialState: () => d, subscribe: (r) => (n.add(r), () => n.delete(r)) }, d = s = t(o, c, u);
  return u;
}, W = ((t) => t ? l(t) : l), X = (t) => t;
function Y(t, s = X) {
  const n = e.useSyncExternalStore(
    t.subscribe,
    e.useCallback(() => s(t.getState()), [t, s]),
    e.useCallback(() => s(t.getInitialState()), [t, s])
  );
  return e.useDebugValue(n), n;
}
const f = (t) => {
  const s = W(t), n = (o) => Y(s, o);
  return Object.assign(n, s), n;
}, te = ((t) => t ? f(t) : f);
function se(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function ne(t) {
  if (Object.prototype.hasOwnProperty.call(t, "__esModule")) return t;
  var s = t.default;
  if (typeof s == "function") {
    var n = function o() {
      var c = !1;
      try {
        c = this instanceof o;
      } catch {
      }
      return c ? Reflect.construct(s, arguments, this.constructor) : s.apply(this, arguments);
    };
    n.prototype = s.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(t).forEach(function(o) {
    var c = Object.getOwnPropertyDescriptor(t, o);
    Object.defineProperty(n, o, c.get ? c : {
      enumerable: !0,
      get: function() {
        return t[o];
      }
    });
  }), n;
}
export {
  b as C,
  y as F,
  e as R,
  O as S,
  J as a,
  F as b,
  I as c,
  G as d,
  V as e,
  h as f,
  q as g,
  Y as h,
  z as i,
  x as j,
  v as k,
  _ as l,
  w as m,
  H as n,
  ne as o,
  se as p,
  W as q,
  ee as r,
  L as s,
  te as t,
  A as u,
  j as v,
  P as w
};
