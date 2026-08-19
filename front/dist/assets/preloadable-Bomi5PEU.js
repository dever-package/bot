import { d as a, e as c, b as l, l as d } from "./_commonjsHelpers-61wyk6v6.js";
const u = window.React, v = u.Fragment;
function f(r, e) {
  return e == null ? r || {} : Object.assign({}, r || {}, { key: e });
}
function m(r, e, t) {
  return u.createElement(r, f(e, t));
}
const P = m, w = 2;
function b(r) {
  return Number(r) === w;
}
function p(r, e, t) {
  const o = String(r ?? "").trim(), n = String(e ?? "").trim();
  return o || n || t;
}
function S(r) {
  let e;
  const t = () => (e || (e = r().catch((o) => {
    throw e = void 0, o;
  })), e);
  return {
    load: t,
    preload: () => t().then(
      () => {
      },
      () => {
      }
    )
  };
}
function h(r, e) {
  return {
    Component: d(
      () => r.load().then((t) => ({ default: e(t) }))
    ),
    preload: r.preload
  };
}
function g(r, e = 140) {
  const t = a(0), o = a(r);
  o.current = r;
  const n = c(() => {
    t.current && (window.clearTimeout(t.current), t.current = 0);
  }, []), s = c(() => {
    n(), o.current?.();
  }, [n]), i = c(() => {
    n(), o.current && (t.current = window.setTimeout(() => {
      t.current = 0, o.current?.();
    }, e));
  }, [n, e]);
  return l(() => n, [n]), { schedule: i, cancel: n, preloadNow: s };
}
export {
  v as F,
  P as a,
  h as b,
  S as c,
  b as i,
  m as j,
  p as r,
  g as u
};
