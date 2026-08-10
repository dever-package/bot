const e = window.React, b = e.Children, E = e.Component, g = e.Fragment, C = e.Profiler, p = e.PureComponent, y = e.StrictMode, I = e.Suspense, R = e.cloneElement, x = e.createContext, j = e.createElement, v = e.createRef, O = e.forwardRef, V = e.isValidElement, k = e.lazy, w = e.memo, D = e.startTransition, M = e.use, P = e.useCallback, T = e.useContext, h = e.useDebugValue, _ = e.useDeferredValue, z = e.useEffect, F = e.useId, H = e.useImperativeHandle, L = e.useInsertionEffect, q = e.useLayoutEffect, B = e.useMemo, A = e.useOptimistic, G = e.useReducer, J = e.useRef, K = e.useState, N = e.useSyncExternalStore, Q = e.useTransition, U = e.version, ee = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Children: b,
  Component: E,
  Fragment: g,
  Profiler: C,
  PureComponent: p,
  StrictMode: y,
  Suspense: I,
  cloneElement: R,
  createContext: x,
  createElement: j,
  createRef: v,
  default: e,
  forwardRef: O,
  isValidElement: V,
  lazy: k,
  memo: w,
  startTransition: D,
  use: M,
  useCallback: P,
  useContext: T,
  useDebugValue: h,
  useDeferredValue: _,
  useEffect: z,
  useId: F,
  useImperativeHandle: H,
  useInsertionEffect: L,
  useLayoutEffect: q,
  useMemo: B,
  useOptimistic: A,
  useReducer: G,
  useRef: J,
  useState: K,
  useSyncExternalStore: N,
  useTransition: Q,
  version: U
}, Symbol.toStringTag, { value: "Module" })), l = (t) => {
  let s;
  const n = /* @__PURE__ */ new Set(), a = (o, i) => {
    const c = typeof o == "function" ? o(s) : o;
    if (!Object.is(c, s)) {
      const d = s;
      s = i ?? (typeof c != "object" || c === null) ? c : Object.assign({}, s, c), n.forEach((m) => m(s, d));
    }
  }, u = () => s, r = { setState: a, getState: u, getInitialState: () => S, subscribe: (o) => (n.add(o), () => n.delete(o)) }, S = s = t(a, u, r);
  return r;
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
  const s = W(t), n = (a) => Y(s, a);
  return Object.assign(n, s), n;
}, te = ((t) => t ? f(t) : f);
export {
  b as C,
  g as F,
  e as R,
  I as S,
  L as a,
  P as b,
  j as c,
  B as d,
  te as e,
  O as f,
  R as g,
  x as h,
  V as i,
  T as j,
  _ as k,
  K as l,
  w as m,
  q as n,
  z as o,
  k as p,
  Y as q,
  F as r,
  ee as s,
  W as t,
  J as u,
  H as v
};
