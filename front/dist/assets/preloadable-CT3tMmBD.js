import { q as l, b as s, h as c, d } from "./file-kind-D6bMOzYN.js";
const o = window.ReactDOM || {}, p = o.createPortal, h = o.flushSync;
o.preconnect;
o.prefetchDNS;
o.preinit;
o.preinitModule;
o.preload;
o.preloadModule;
o.requestFormReset;
o.unstable_batchedUpdates;
o.useFormState;
o.useFormStatus;
o.version;
function R() {
  const e = /* @__PURE__ */ new Map();
  return (r, t) => {
    const a = e.get(r);
    if (a)
      return a;
    let n;
    return n = Promise.resolve().then(t).finally(() => {
      e.get(r) === n && e.delete(r);
    }), e.set(r, n), n;
  };
}
const f = 2;
function S(e) {
  return Number(e) === f;
}
function w(e, r, t) {
  const a = String(e ?? "").trim(), n = String(r ?? "").trim();
  return a || n || t;
}
function P(e) {
  let r;
  const t = () => (r || (r = e().catch((a) => {
    throw r = void 0, a;
  })), r);
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
function v(e, r) {
  return {
    Component: l(
      () => e.load().then((t) => ({ default: r(t) }))
    ),
    preload: e.preload
  };
}
function b(e, r = 140) {
  const t = s(0), a = s(e);
  a.current = e;
  const n = c(() => {
    t.current && (window.clearTimeout(t.current), t.current = 0);
  }, []), u = c(() => {
    n(), a.current?.();
  }, [n]), i = c(() => {
    n(), a.current && (t.current = window.setTimeout(() => {
      t.current = 0, a.current?.();
    }, r));
  }, [n, r]);
  return d(() => n, [n]), { schedule: i, cancel: n, preloadNow: u };
}
export {
  o as R,
  P as a,
  R as b,
  p as c,
  v as d,
  h as f,
  S as i,
  w as r,
  b as u
};
