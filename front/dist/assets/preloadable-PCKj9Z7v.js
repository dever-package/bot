import { u, b as c, o as d, p as i } from "./react-C7Xtl8sB.js";
const e = window.ReactDOM || {}, p = e.createPortal, m = e.flushSync;
e.preconnect;
e.prefetchDNS;
e.preinit;
e.preinitModule;
e.preload;
e.preloadModule;
e.requestFormReset;
e.unstable_batchedUpdates;
e.useFormState;
e.useFormStatus;
e.version;
function h(o) {
  let r;
  const t = () => (r || (r = o().catch((a) => {
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
function w(o, r) {
  return {
    Component: i(
      () => o.load().then((t) => ({ default: r(t) }))
    ),
    preload: o.preload
  };
}
function b(o, r = 140) {
  const t = u(0), a = u(o);
  a.current = o;
  const n = c(() => {
    t.current && (window.clearTimeout(t.current), t.current = 0);
  }, []), s = c(() => {
    n(), a.current?.();
  }, [n]), l = c(() => {
    n(), a.current && (t.current = window.setTimeout(() => {
      t.current = 0, a.current?.();
    }, r));
  }, [n, r]);
  return d(() => n, [n]), { schedule: l, cancel: n, preloadNow: s };
}
export {
  e as R,
  w as a,
  h as b,
  p as c,
  m as f,
  b as u
};
