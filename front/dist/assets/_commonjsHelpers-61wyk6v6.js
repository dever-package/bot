const e = window.React, c = e.Children, a = e.Component, u = e.Fragment, l = e.Profiler, i = e.PureComponent, f = e.StrictMode, p = e.Suspense, d = e.cloneElement, m = e.createContext, y = e.createElement, E = e.createRef, b = e.forwardRef, g = e.isValidElement, C = e.lazy, O = e.memo, S = e.startTransition, R = e.use, h = e.useCallback, j = e.useContext, v = e.useDebugValue, P = e.useDeferredValue, _ = e.useEffect, M = e.useId, w = e.useImperativeHandle, I = e.useInsertionEffect, D = e.useLayoutEffect, V = e.useMemo, T = e.useOptimistic, x = e.useReducer, F = e.useRef, z = e.useState, k = e.useSyncExternalStore, H = e.useTransition, L = e.version, q = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Children: c,
  Component: a,
  Fragment: u,
  Profiler: l,
  PureComponent: i,
  StrictMode: f,
  Suspense: p,
  cloneElement: d,
  createContext: m,
  createElement: y,
  createRef: E,
  default: e,
  forwardRef: b,
  isValidElement: g,
  lazy: C,
  memo: O,
  startTransition: S,
  use: R,
  useCallback: h,
  useContext: j,
  useDebugValue: v,
  useDeferredValue: P,
  useEffect: _,
  useId: M,
  useImperativeHandle: w,
  useInsertionEffect: I,
  useLayoutEffect: D,
  useMemo: V,
  useOptimistic: T,
  useReducer: x,
  useRef: F,
  useState: z,
  useSyncExternalStore: k,
  useTransition: H,
  version: L
}, Symbol.toStringTag, { value: "Module" }));
function A(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function N(t) {
  if (Object.prototype.hasOwnProperty.call(t, "__esModule")) return t;
  var r = t.default;
  if (typeof r == "function") {
    var s = function n() {
      var o = !1;
      try {
        o = this instanceof n;
      } catch {
      }
      return o ? Reflect.construct(r, arguments, this.constructor) : r.apply(this, arguments);
    };
    s.prototype = r.prototype;
  } else s = {};
  return Object.defineProperty(s, "__esModule", { value: !0 }), Object.keys(t).forEach(function(n) {
    var o = Object.getOwnPropertyDescriptor(t, n);
    Object.defineProperty(s, n, o.get ? o : {
      enumerable: !0,
      get: function() {
        return t[n];
      }
    });
  }), s;
}
export {
  c as C,
  u as F,
  e as R,
  p as S,
  z as a,
  _ as b,
  y as c,
  F as d,
  h as e,
  b as f,
  D as g,
  M as h,
  j as i,
  m as j,
  w as k,
  C as l,
  O as m,
  N as n,
  A as o,
  I as p,
  d as q,
  q as r,
  g as s,
  V as u
};
