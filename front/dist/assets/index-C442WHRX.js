import { a as B, j as m, F as $e, i as Ln } from "./preloadable-Bomi5PEU.js";
import { R as Ne, d as re, p as fc, e as O, u as ze, m as _e, o as pc, c as gc, F as Bo, f as me, C as _r, q as us, s as Ot, r as bc, b as le, a as W } from "./_commonjsHelpers-61wyk6v6.js";
import { b as _c, u as Gt } from "./react-DXzVgfWS.js";
import { q as vc, h as yc, o as wc, A as Fo, P as Lo, r as Dt, aW as Sc, p as xc, c as Vo, ai as Ic, av as Tc, z as Cc, n as jo, ae as vr, aX as Ec, R as Rc, aj as Ac, aY as Mc, x as Dc, X as kc } from "./vendor-icons-DwjYEojZ.js";
import { t as qo, f as Pc, h as Uo, g as $c, l as Nc, i as Oc, j as Bc, k as Fc, m as Et, n as yr, r as Lc, o as Vc, p as jc, q as qc, s as Os, c as Uc, A as zc, a as Hc, u as Gc, v as Wc, d as Yc, w as Jc, x as Qc, y as Xc, e as Zc, z as Kc, B as el } from "./interaction-view-BNLEbgcn.js";
import { e as tl, b as sl } from "./file-kind-CYMG3EzQ.js";
import { A as zo, a as is, c as nl, b as rl, d as ol } from "./clipboard-BLzb9wLn.js";
import { c as Ho, d as il, m as al, j as cl, k as Ss, l as ll, o as Go, p as ul, q as dl, s as wr, n as hl, t as ml, i as ds, r as Wo, a as fl, u as pl, v as gl, w as bl, x as _l, h as vl } from "./interaction-BSPeVZBK.js";
import { P as yl } from "./power-icon-DzGqVPMs.js";
import { P as wl } from "./power-picker-menu-BEj6_iph.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./index-BnWQQT27.css", import.meta.url).href]);
let gt = null;
function Sl(t, e) {
  t.currentIndex = 0, t.wipContextDeps = null, t.wipCommitCallbacks = [];
  const s = gt;
  gt = t;
  try {
    if (e(), t.isFirstRender = !1, t.cells.length !== t.currentIndex) throw new Error(`Rendered ${t.currentIndex} hooks but expected ${t.cells.length}. Hooks must be called in the exact same order in every render.`);
  } finally {
    gt = s;
  }
}
function Le() {
  if (!gt) throw new Error("No resource fiber available");
  return gt;
}
function St() {
  return gt;
}
const Vn = (t, e) => {
  if (t.length !== 0) {
    if (t.length === 1) throw t[0];
    for (const s of t) console.error(s);
    throw new AggregateError(t, e);
  }
}, Oe = {
  HookState: 0,
  EffectEvent: 1,
  PassiveEffectCleanup: 2,
  PassiveEffectSetup: 3
}, xl = [
  Oe.HookState,
  Oe.EffectEvent,
  Oe.PassiveEffectCleanup,
  Oe.PassiveEffectSetup
];
function Il(t) {
  const e = [];
  for (const s of xl) {
    const n = t[s];
    if (n !== void 0)
      for (let r = 0; r < n.length; r++) try {
        n[r]();
      } catch (o) {
        e.push(o);
      }
  }
  Vn(e, "Errors during commit");
}
function Tl(t) {
  const e = [];
  for (const s of t.cells) if (s?.type === "effect" && (s.deps = null, s.cleanup))
    try {
      s.cleanup?.();
    } catch (n) {
      e.push(n);
    } finally {
      s.cleanup = void 0;
    }
  Vn(e, "Errors during cleanup");
}
const xs = (t, e) => {
  for (let s = 0; s < t.length && s < e.length; s++) if (!Object.is(t[s], e[s])) return !1;
  return !0;
}, jn = () => {
  throw new Error("Rendered more hooks than during the previous render. Hooks must be called in the exact same order in every render.");
}, qn = () => {
  throw new Error("Hook order changed between renders");
}, Sr = (t, e) => {
  Bt(t, Oe.HookState, () => {
    e.current = e.wip, e.currentDeps = e.wipDeps, e.isDirty = !1;
  });
}, Is = (t, e) => {
  const s = Le(), n = s.currentIndex++;
  let r = s.cells[n];
  if (r === void 0) {
    !s.isFirstRender && n >= s.cells.length && jn();
    const a = t();
    return r = {
      type: "memo",
      current: a,
      currentDeps: e,
      wip: a,
      wipDeps: e,
      isDirty: !1
    }, s.cells[n] = r, a;
  }
  r.type !== "memo" && qn();
  const o = r;
  if (xs(o.wipDeps, e))
    return o.isDirty && Sr(s, o), o.wip;
  const i = t();
  return o.wip = i, o.wipDeps = e, o.isDirty || (o.isDirty = !0, ri(s.root, () => {
    o.wip = o.current, o.wipDeps = o.currentDeps, o.isDirty = !1;
  })), Sr(s, o), i;
};
function jt(t) {
  return Is(() => ({ current: t }), []);
}
const Un = /* @__PURE__ */ Symbol("tap.Context.defaultValue"), Cl = (t) => t;
let ke = /* @__PURE__ */ new Map();
const Xe = /* @__PURE__ */ new Set(), Yo = () => new Map(ke), xr = (t, e) => {
  const s = ke;
  ke = t;
  try {
    return e();
  } finally {
    ke = s;
  }
}, Jo = (t, e) => {
  t[Un] = e;
}, Qo = (t) => typeof t == "object" && t !== null && Un in t, Xo = (t) => typeof t == "object" && t !== null && "$$typeof" in t && t.$$typeof === /* @__PURE__ */ Symbol.for("react.context"), zn = (t) => Qo(t) || Xo(t), Zo = (t) => {
  if (!Qo(t)) {
    if (Xo(t)) {
      Jo(t, t._currentValue ?? t._currentValue2);
      return;
    }
    throw new Error("A tap resource's `use()` only accepts a tap context.");
  }
}, Ko = (t, e, s) => {
  if (typeof t != "object" || t === null) throw new Error("useContextProvider only accepts a React context.");
  Zo(t);
  const n = t, r = Le(), o = jt(void 0), i = o.current === void 0 || !Object.is(o.current.value, e);
  et(() => {
    o.current = { value: e };
  }, [e]);
  const a = ke.get(n), c = a !== void 0 || ke.has(n);
  ke.set(n, {
    value: e,
    source: r
  });
  try {
    return El(n, i, s);
  } finally {
    c ? ke.set(n, a) : ke.delete(n);
  }
}, El = (t, e, s) => {
  const n = Xe.has(t);
  e ? Xe.add(t) : Xe.delete(t);
  try {
    return s();
  } finally {
    n ? Xe.add(t) : Xe.delete(t);
  }
}, Rl = (t) => {
  Zo(t);
  const e = t, s = Al(e, t), n = Le();
  return (n.wipContextDeps ??= /* @__PURE__ */ new Map()).set(e, s.source), s.value;
}, Al = (t, e) => ke.get(t) ?? {
  value: Cl(e)[Un],
  source: null
}, Ml = (t, e, s, n) => {
  if (!n) return s;
  let r = s;
  for (const [o, i] of n)
    i === e || i === t || (r ??= /* @__PURE__ */ new Map()).set(o, i);
  return r;
}, ei = (t, e = t.wipContextDeps) => {
  const s = St();
  !s || !e || (s.wipContextDeps = Ml(s, t, s.wipContextDeps, e));
}, ti = () => Xe.size > 0, Hn = (t) => {
  if (!t.contextDeps || !ti()) return !1;
  for (const e of Xe.keys()) if (t.contextDeps.has(e)) return !0;
  return !1;
}, si = (t) => ({
  version: 0,
  committedVersion: 0,
  context: Yo(),
  dispatchUpdate: t,
  changelog: [],
  rollbackCallbacks: []
}), hs = (t) => {
  t.committedVersion = t.version, t.changelog.length = 0, t.rollbackCallbacks.length = 0;
}, kt = (t, e) => {
  const s = t.version > e;
  if (t.version = e, s) {
    for (let n = 0; n < t.rollbackCallbacks.length; n++) t.rollbackCallbacks[n]();
    if (t.rollbackCallbacks.length = 0, e <= t.committedVersion)
      t.committedVersion = e, t.changelog.length = 0;
    else {
      for (; t.committedVersion + t.changelog.length > e; ) t.changelog.pop();
      for (let n = 0; n < t.changelog.length; n++) ni(t.changelog[n]);
      hs(t);
    }
  }
}, ni = (t) => {
  oi(t.fiber, t.cell), t.queued || (t.queued = !0, (t.cell.queue ??= []).push(t));
}, Bt = (t, e, s) => {
  const n = t.wipCommitCallbacks;
  (n[e] ??= []).push(s);
}, ri = (t, e) => {
  t.rollbackCallbacks.push(e);
}, oi = (t, e) => {
  e.isDirty || (e.isDirty = !0, t.markDirty?.(), ri(t.root, () => {
    if (e.queue !== null) {
      for (const s of e.queue) s.queued = !1;
      e.queue = null;
    }
    e.workInProgress = e.current, e.isDirty = !1;
  }));
}, Dl = () => ({
  type: "effect",
  cleanup: void 0,
  deps: null
});
function et(t, e) {
  const s = Le(), n = s.currentIndex++, r = s.cells[n], o = r === void 0 ? Dl() : r.type === "effect" ? r : qn();
  if (r === void 0 && (!s.isFirstRender && n >= s.cells.length && jn(), s.cells[n] = o), !(e && o.deps && xs(o.deps, e))) {
    if (o.deps !== null && !!e != !!o.deps) throw new Error("useEffect called with and without dependencies across re-renders");
    Bt(s, Oe.PassiveEffectCleanup, () => {
      try {
        o.cleanup?.();
      } finally {
        o.cleanup = void 0;
      }
    }), Bt(s, Oe.PassiveEffectSetup, () => {
      try {
        const i = t();
        if (i !== void 0 && typeof i != "function") throw new Error(`An effect function must either return a cleanup function or nothing. Received: ${typeof i}`);
        o.cleanup = i;
      } finally {
        o.deps = e;
      }
    });
  }
}
const kl = (t, e, s) => {
  if (t.isNeverMounted) throw new Error("Resource updated before mount");
  let n = !1, r = !0;
  t.root.dispatchUpdate(() => (n || (n = !0, s && t.root.changelog.length === 0 && !e.cell.isDirty && !e.hasEagerState && (e.eagerState = s(e.cell.workInProgress, e.action), e.hasEagerState = !0, r = !Object.is(e.cell.current, e.eagerState))), r), () => (n = !0, r = !0, ni(e), t.root.changelog.push(e), !0));
}, Pl = (t, e, s, n, r) => {
  const o = n ? n(s) : s, i = {
    type: "reducer",
    workInProgress: o,
    current: o,
    isDirty: !1,
    queue: null,
    renderQueue: null,
    reducer: e,
    dispatch: (a) => {
      const c = St();
      if (c !== null) {
        if (c !== t) throw new Error("Cannot update a resource while rendering a different resource.");
        (t.renderPendingCells ??= /* @__PURE__ */ new Set()).add(i), (i.renderQueue ??= []).push(a);
      } else kl(t, {
        fiber: t,
        cell: i,
        action: a,
        hasEagerState: !1,
        eagerState: void 0,
        queued: !1
      }, r ? e : void 0);
    }
  };
  return i;
};
function ii(t, e, s, n) {
  const r = Le(), o = r.currentIndex++, i = r.cells[o], a = (() => {
    if (i !== void 0) return i.type === "reducer" ? i : qn();
    !r.isFirstRender && o >= r.cells.length && jn();
    const l = Pl(r, t, e, s, n);
    return r.cells[o] = l, l;
  })(), c = a.queue;
  if (c !== null) {
    const l = t === a.reducer;
    for (let u = 0; u < c.length; u++) {
      const h = c[u];
      (!h.hasEagerState || !l) && (h.eagerState = t(a.workInProgress, h.action), h.hasEagerState = !0), h.queued = !1, a.workInProgress = h.eagerState;
    }
    a.queue = null;
  }
  if (a.reducer = t, a.renderQueue !== null) {
    let l = a.workInProgress;
    for (const u of a.renderQueue) l = t(l, u);
    a.renderQueue = null, r.renderPendingCells?.delete(a), Object.is(l, a.workInProgress) || (oi(r, a), a.workInProgress = l);
  }
  return a.isDirty && Bt(r, Oe.HookState, () => {
    a.current = a.workInProgress, a.isDirty = !1;
  }), [a.workInProgress, a.dispatch];
}
function ai(t, e, s) {
  return ii(t, e, s, !1);
}
const $l = (t, e) => typeof e == "function" ? e(t) : e, Nl = (t) => t === void 0 ? void 0 : typeof t == "function" ? t() : t;
function Gn(t) {
  return ii($l, t, Nl, !0);
}
const Wn = (t, e) => Is(() => t, e);
function Yn(t) {
  const e = Le(), s = jt(t);
  return s.current !== t && Bt(e, Oe.EffectEvent, () => {
    s.current = t;
  }), Wn(((...n) => s.current(...n)), []);
}
const ms = (t) => {
  if (!zn(t)) throw new Error("A tap resource's `use()` only accepts a tap context.");
  return Rl(t);
}, ci = (t, e, s = e) => {
  const n = jt(!0), r = n.current ? s() : e();
  n.current = !1;
  const [, o] = Gn(0), i = Yn(() => {
    try {
      if (Object.is(r, e())) return;
    } catch {
      return;
    }
    o((a) => a + 1);
  });
  return et(() => (i(), t(i)), [t]), r;
}, li = (t, e) => {
}, Ol = Ne;
function Bl(t) {
  const e = re(t);
  return fc(() => {
    e.current = t;
  }), O(((...s) => e.current(...s)), []);
}
const Fl = Ol.useEffectEvent ?? Bl, Ce = () => St() !== null, Ee = Ne, ue = (t) => Ce() ? Gn(t) : Ee.useState(t), Ll = (t, e, s) => Ce() ? ai(t, e, s) : Ee.useReducer(t, e, s), de = (t) => Ce() ? jt(t) : Ee.useRef(t), he = (t, e) => Ce() ? Is(t, e) : Ee.useMemo(t, e), as = (t, e) => Ce() ? Wn(t, e) : Ee.useCallback(t, e), Z = (t, e) => Ce() ? et(t, e) : Ee.useEffect(t, e), fs = (t, e) => Ce() ? et(t, e) : Ee.useLayoutEffect(t, e), ui = (t) => Ce() ? Yn(t) : Fl(t), Jn = (t, e, s) => Ce() ? ci(t, e, s) : Ee.useSyncExternalStore(t, e, s), Vl = (t, e) => Ce() ? li() : Ee.useDebugValue(t, e), ct = (t) => {
  const e = Ee.createContext(t);
  return Jo(e, t), e;
}, di = (t) => Ce() && zn(t) ? ms(t) : Ee.use(t), Ts = (t) => Ce() && zn(t) ? ms(t) : Ee.useContext(t), hi = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), mi = (t) => new Array(t).fill(hi), jl = (t, e) => {
  const s = t.memoCache;
  let n = s.workInProgress;
  if (n === null) {
    const i = s.current;
    n = i === null ? [] : i.map((a) => a.slice()), s.workInProgress = n;
  }
  const r = s.index++;
  let o = n[r];
  return o === void 0 && (o = mi(e), n[r] = o), o;
}, fi = (t) => jl(Le(), t), ql = Ne, Ul = (t) => ze(() => {
  const e = mi(t);
  return e[hi] = !0, e;
}, []), zl = ql.__COMPILER_RUNTIME?.c ?? Ul, Hl = () => St() !== null, w = (t) => Hl() ? fi(t) : zl(t);
function ie(t) {
  return (...e) => ({
    hook: t,
    args: e
  });
}
function Te(t, e, s) {
  return typeof e == "function" ? (...n) => Te(t, e(...n)) : s ? {
    ...e,
    key: t,
    deps: s
  } : {
    ...e,
    key: t
  };
}
const Gl = 50;
let Ze = {
  schedulers: /* @__PURE__ */ new Set([]),
  isScheduled: !1
}, Ke = null;
var Wl = class {
  _isDirty = !1;
  _task;
  constructor(t) {
    this._task = t;
  }
  get isDirty() {
    return this._isDirty;
  }
  markDirty() {
    if (Ke && (Ke.get(this) ?? 0) >= Gl) throw new Error("Maximum update depth exceeded. This can happen when a resource repeatedly calls setState inside useEffect.");
    this._isDirty = !0, Ze.schedulers.add(this), Yl();
  }
  runTask() {
    Ke?.set(this, (Ke.get(this) ?? 0) + 1), this._isDirty = !1, this._task();
  }
};
const Yl = () => {
  Ze.isScheduled || (Ze.isScheduled = !0, Jl());
}, Ir = () => {
  const t = Ke;
  Ke = /* @__PURE__ */ new Map();
  try {
    const e = [];
    for (const s of Ze.schedulers)
      if (Ze.schedulers.delete(s), !!s.isDirty)
        try {
          s.runTask();
        } catch (n) {
          e.push(n);
        }
    Vn(e, "Errors occurred during flushSync");
  } finally {
    Ke = t, Ze.schedulers.clear(), Ze.isScheduled = !1;
  }
}, Jl = (() => {
  if (typeof MessageChannel < "u") {
    let t = null, e;
    return () => {
      if (!t) {
        const s = new MessageChannel();
        s.port1.onmessage = () => {
          t?.unref?.(), Ir();
        }, t = s.port1, e = s.port2;
      }
      t.ref?.(), e.postMessage(null);
    };
  }
  return () => setTimeout(Ir, 0);
})(), Ql = {
  useState: Gn,
  useReducer: ai,
  useRef: jt,
  useMemo: Is,
  useCallback: Wn,
  useEffect: et,
  useLayoutEffect: et,
  useInsertionEffect: et,
  useEffectEvent: Yn,
  useContext: ms,
  use: ms,
  useSyncExternalStore: ci,
  useDebugValue: li,
  useMemoCache: fi
}, Tr = Ne, We = Tr.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ?? Tr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Wt = We == null ? null : "H" in We ? {
  get current() {
    return We.H;
  },
  set current(t) {
    We.H = t;
  }
} : "ReactCurrentDispatcher" in We ? {
  get current() {
    return We.ReactCurrentDispatcher.current;
  },
  set current(t) {
    We.ReactCurrentDispatcher.current = t;
  }
} : null;
function Xl(t) {
  if (!Wt) return t();
  const e = Wt.current;
  Wt.current = Ql;
  try {
    return t();
  } finally {
    Wt.current = e;
  }
}
function pi(t, e, s = void 0, n) {
  return {
    hook: t,
    root: e,
    markDirty: s,
    devStrictMode: n,
    cells: [],
    contextDeps: null,
    wipContextDeps: null,
    commitCallbacks: null,
    wipCommitCallbacks: null,
    memoCache: {
      current: null,
      workInProgress: null,
      index: 0
    },
    renderPendingCells: null,
    currentIndex: 0,
    isFirstRender: !0,
    isMounted: !1,
    isNeverMounted: !0
  };
}
function bt(t) {
  if (!t.isMounted) throw new Error("Tried to unmount a fiber that is already unmounted");
  t.isMounted = !1, Tl(t);
}
function tt(t, e) {
  if (t.memoCache.workInProgress = null, t.renderPendingCells !== null) {
    for (const r of t.renderPendingCells) r.renderQueue = null;
    t.renderPendingCells.clear();
  }
  let s = 0, n;
  do {
    if (++s > 25) throw new Error("Too many re-renders. tap limits the number of renders to prevent an infinite loop.");
    t.memoCache.index = 0, Sl(t, () => {
      n = Xl(() => t.hook(...e));
    });
  } while ((t.renderPendingCells?.size ?? 0) > 0);
  return ei(t), n;
}
function Ft(t) {
  const e = t.wipCommitCallbacks ?? t.commitCallbacks ?? [];
  t.wipCommitCallbacks = null, t.commitCallbacks = e, t.isMounted = !0, t.contextDeps = t.wipContextDeps, hs(t.root), t.memoCache.workInProgress !== null && (t.memoCache.current = t.memoCache.workInProgress, t.memoCache.workInProgress = null), t.isNeverMounted = !1, Il(e);
}
const Zl = () => {
  const t = Le();
  return t.devStrictMode ? t.isFirstRender ? "child" : "root" : null;
}, Kl = () => null, eu = () => Kl, gi = () => St() ? Zl : eu(), tu = (t) => t(), su = (t) => {
  const [e] = ue(() => new Wl(() => f())), [s] = ue(() => []), n = gi(), [r] = ue(() => {
    const p = si((v, _) => {
      if (!e.isDirty) {
        if (!v()) return;
        _();
      }
      kt(p, p.committedVersion + p.changelog.length), s.push(_), e.markDirty();
    });
    return pi(tu, p, void 0, n());
  }), o = Yo(), i = r.root.version - r.root.committedVersion, a = xr(o, () => tt(r, [t])), c = de(!1), l = de([t]), u = de(a), [h] = ue(() => /* @__PURE__ */ new Set()), d = (p) => {
    e.isDirty || u.current === p || (u.current = p, h.forEach((v) => v()));
  }, f = ui(() => {
    kt(r.root, r.root.committedVersion), s.forEach((v) => {
      v();
    }), kt(r.root, r.root.committedVersion + r.root.changelog.length);
    const p = xr(r.root.context, () => tt(r, l.current));
    if (e.isDirty) throw new Error("Scheduler is dirty, this should never happen");
    hs(r.root), s.length = 0, c.current && Ft(r), d(p);
  });
  return Z(() => (c.current = !0, () => {
    c.current = !1, bt(r);
  }), [r]), Z(() => {
    l.current = [t], hs(r.root), s.splice(0, i), r.root.context = o, Ft(r), d(a);
  }), he(() => ({
    getValue: () => u.current,
    subscribe: (p) => (h.add(p), () => h.delete(p))
  }), [h]);
}, nu = () => {
  const t = de(0), e = t.current, s = Le();
  return {
    version: e,
    markDirty: he(() => () => {
      t.current++, s?.markDirty?.();
    }, [s]),
    root: s.root
  };
}, ru = () => {
  const [t] = ue(() => si((r, o) => {
    let i = !1;
    n((a) => (i = !r(), i ? a : a + 1)), i || s(o);
  })), [e, s] = Ll((r, o) => (kt(t, r), r + (o() ? 1 : 0)), 0), [, n] = ue(0);
  return kt(t, e), {
    root: t,
    version: e,
    markDirty: void 0
  };
}, Qn = () => {
  const t = gi(), { root: e, version: s, markDirty: n } = St() ? nu() : ru();
  return {
    version: s,
    createFiber: as((r, o, i) => pi(r, e, i ? () => {
      i(), n?.();
    } : n, t()), [])
  };
}, bi = (t, e, s) => {
  const n = de(null), r = n.current ?? (n.current = {
    wipDeps: null,
    wip: null,
    currentDeps: null,
    current: null
  });
  return r.wipDeps = r.currentDeps, r.wip = r.current, Z(() => {
    r.currentDeps = r.wipDeps, r.current = r.wip;
  }), !s && r.currentDeps && xs(r.currentDeps, e) ? r.current : (r.wipDeps = e, r.wip = t(), r.wip);
};
function Ve(t) {
  const { version: e, createFiber: s } = Qn(), n = he(() => s(t.hook, t.key), [
    t.hook,
    t.key,
    s
  ]), r = bi(() => ({ value: tt(n, t.args) }), [
    n,
    e,
    t.args
  ], Hn(n));
  return Z(() => () => bt(n), [n]), Z(() => {
    Ft(n);
  }, [n, r]), r.value;
}
const Cr = (t, e) => {
  const s = t.get(e);
  s && (s.isDirty = !0);
}, ou = (t, e) => !t.isDirty && !Hn(t.fiber) && e !== void 0 && t.committedDeps !== void 0 && xs(t.committedDeps, e), iu = (t) => {
  if (!ti()) return !1;
  for (const { fiber: e } of t.values()) if (Hn(e)) return !0;
  return !1;
};
function Cs(t) {
  const [e] = ue(() => /* @__PURE__ */ new Map()), { version: s, createFiber: n } = Qn(), r = iu(e), o = bi(() => {
    const i = /* @__PURE__ */ new Set(), a = [];
    let c = 0;
    for (let l = 0; l < t.length; l++) {
      const u = t[l], h = u.key;
      if (h === void 0) throw new Error(`useResources did not provide a key for array at index ${l}`);
      if (i.has(h)) throw new Error(`Duplicate key ${h} in useResources`);
      i.add(h);
      let d = e.get(h);
      if (d)
        if (d.fiber.hook !== u.hook) {
          const f = n(u.hook, u.key, () => Cr(e, h)), p = tt(f, u.args);
          d.next = {
            value: p,
            deps: u.deps,
            remount: f
          };
        } else if (ou(d, u.deps))
          d.fiber.contextDeps && ei(d.fiber, d.fiber.contextDeps), d.next = "skip";
        else {
          const f = tt(d.fiber, u.args);
          d.next = {
            value: f,
            deps: u.deps
          };
        }
      else {
        const f = n(u.hook, u.key, () => Cr(e, h));
        d = {
          fiber: f,
          next: {
            value: tt(f, u.args),
            deps: u.deps
          },
          isDirty: !1,
          committedDeps: void 0,
          committedValue: void 0
        }, c++, e.set(h, d);
      }
      a.push(typeof d.next == "object" ? d.next.value : d.committedValue);
    }
    if (e.size > a.length - c)
      for (const l of e.keys()) i.has(l) || (e.get(l).next = "delete");
    return a;
  }, [
    t,
    e,
    n,
    s
  ], r);
  return Z(() => () => {
    for (const i of e.keys()) {
      const a = e.get(i).fiber;
      bt(a);
    }
  }, [e]), Z(() => {
    for (const [i, a] of e.entries()) {
      const c = a.next;
      c === "delete" ? (a.fiber.isMounted && bt(a.fiber), e.delete(i)) : c === "skip" || (c.remount && (bt(a.fiber), a.fiber = c.remount), Ft(a.fiber), a.committedDeps = c.deps, a.committedValue = c.value, a.isDirty = !1);
    }
  }, [o, e]), o;
}
const au = (t) => t(), cu = (t) => {
  const { createFiber: e } = Qn(), s = he(() => e(au, void 0), [e]), n = tt(s, [t]);
  Z(() => () => {
    bt(s);
  }, [s]);
  let r = !1;
  const o = () => {
    r && s.isMounted || (r = !0, Ft(s));
  };
  return Z(o), {
    value: n,
    effects: o
  };
}, lu = () => {
  const t = w(4), [e, s] = ue(du);
  let n;
  t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (n = (c, l) => (s((u) => ({
    ...u,
    renderers: {
      ...u.renderers,
      [c]: [...u.renderers[c] ?? [], l]
    }
  })), () => {
    s((u) => ({
      ...u,
      renderers: {
        ...u.renderers,
        [c]: u.renderers[c]?.filter((h) => h !== l) ?? []
      }
    }));
  }), t[0] = n) : n = t[0];
  const r = n;
  let o;
  t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (o = (c) => (s((l) => ({
    ...l,
    fallbacks: [...l.fallbacks, c]
  })), () => {
    s((l) => ({
      ...l,
      fallbacks: l.fallbacks.filter((u) => u !== c)
    }));
  }), t[1] = o) : o = t[1];
  const i = o;
  let a;
  return t[2] !== e ? (a = {
    getState: () => e,
    setDataUI: r,
    setFallbackDataUI: i
  }, t[2] = e, t[3] = a) : a = t[3], a;
}, uu = ie(lu);
function du() {
  return {
    renderers: {},
    fallbacks: []
  };
}
const Bs = (t) => {
  if (!t.overwrite) return t;
  const { overwrite: e, ...s } = t;
  return s;
}, hu = (t) => {
  const e = Array.from(t).map((n) => n.getModelContext()).sort((n, r) => (r.priority ?? 0) - (n.priority ?? 0)), s = {};
  return e.reduce((n, r) => {
    const o = r.priority ?? 0;
    if (r.system && (n.system ? n.system += `

${r.system}` : n.system = r.system), r.tools) for (const [i, a] of Object.entries(r.tools)) {
      const c = n.tools?.[i];
      if (c && c !== a) {
        const l = s[i];
        if (l === o) {
          if (!a.overwrite) throw new Error(`You tried to define a tool with the name ${i}, but it already exists.`);
          n.tools[i] = Bs(a);
          continue;
        }
        const u = l > o ? c : a, h = l > o ? a : c;
        n.tools[i] = Bs({
          ...h,
          ...u
        }), s[i] = Math.max(l, o);
        continue;
      }
      n.tools || (n.tools = {}), n.tools[i] = Bs(a), s[i] ??= o;
    }
    return r.config && (n.config = {
      ...n.config,
      ...r.config
    }), r.callSettings && (n.callSettings = {
      ...n.callSettings,
      ...r.callSettings
    }), r.unstable_composerMetadata && (n.unstable_composerMetadata = {
      ...n.unstable_composerMetadata,
      ...r.unstable_composerMetadata
    }), n;
  }, {});
};
var _i = class {
  _providers = /* @__PURE__ */ new Set();
  getModelContext() {
    return hu(this._providers);
  }
  registerModelContextProvider(t) {
    this._providers.add(t);
    const e = t.subscribe?.(() => {
      this.notifySubscribers();
    });
    return this.notifySubscribers(), () => {
      this._providers.delete(t), e?.(), this.notifySubscribers();
    };
  }
  _subscribers = /* @__PURE__ */ new Set();
  notifySubscribers() {
    for (const t of this._subscribers) t();
  }
  subscribe(t) {
    return this._subscribers.add(t), () => {
      this._subscribers.delete(t);
    };
  }
};
const Ks = [], mu = {
  modelName: void 0,
  toolNames: Ks
}, fu = (t, e) => t === e || t.length === e.length && t.every((s, n) => s === e[n]), Yt = (t, e) => {
  const s = t.getModelContext(), n = s.config?.modelName, r = s.tools ? Object.keys(s.tools).sort() : Ks, o = r.length ? r : Ks;
  return n === e.modelName && fu(o, e.toolNames) ? e : {
    modelName: n,
    toolNames: o
  };
}, pu = () => {
  const t = w(11);
  let e;
  t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (e = new _i(), t[0] = e) : e = t[0];
  const s = e;
  let n;
  t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (n = () => Yt(s, mu), t[1] = n) : n = t[1];
  const [r, o] = ue(n);
  let i, a;
  t[2] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (i = () => (o((f) => Yt(s, f)), s.subscribe(() => {
    o((f) => Yt(s, f));
  })), a = [s], t[2] = i, t[3] = a) : (i = t[2], a = t[3]), Z(i, a);
  let c;
  t[4] !== r ? (c = () => Yt(s, r), t[4] = r, t[5] = c) : c = t[5];
  let l, u, h;
  t[6] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (l = () => s.getModelContext(), u = (f) => s.subscribe(f), h = (f) => s.registerModelContextProvider(f), t[6] = l, t[7] = u, t[8] = h) : (l = t[6], u = t[7], h = t[8]);
  let d;
  return t[9] !== c ? (d = {
    getState: c,
    getModelContext: l,
    subscribe: u,
    register: h
  }, t[9] = c, t[10] = d) : d = t[10], d;
}, vi = ie(pu), gu = (t) => t.display !== void 0 ? t.display === "standalone" : t.type === "human", bu = (t, e) => {
  if (!(e.status?.type === "running" || e.status?.type === "requires-action")) {
    const n = t.complete;
    return typeof n != "function" ? n ?? null : n({
      args: e.args,
      result: e.result
    });
  }
  const s = t.running;
  return typeof s != "function" ? s ?? null : s({ args: e.args });
}, _u = (t) => function(s) {
  return bu(t, s);
}, en = /* @__PURE__ */ Symbol("assistant-ui.store.clientIndex"), vu = (t) => t[en], yi = ct([]), Xn = () => di(yi), yu = (t, e) => {
  const s = w(3), n = Xn();
  let r;
  return s[0] !== t || s[1] !== n ? (r = [...n, t], s[0] = t, s[1] = n, s[2] = r) : r = s[2], Ko(yi, r, e);
}, wu = /* @__PURE__ */ new Set([
  "$$typeof",
  "nodeType",
  "then"
]), Es = (t, e) => {
  if (t === Symbol.toStringTag) return e;
  if (typeof t != "symbol") {
    if (t === "toJSON") return () => e;
    if (!wu.has(t))
      return !1;
  }
};
var Zn = class {
  getOwnPropertyDescriptor(t, e) {
    const s = this.get(t, e);
    if (s !== void 0)
      return {
        value: s,
        writable: !1,
        enumerable: !0,
        configurable: !1
      };
  }
  set() {
    return !1;
  }
  setPrototypeOf() {
    return !1;
  }
  defineProperty() {
    return !1;
  }
  deleteProperty() {
    return !1;
  }
  preventExtensions() {
    return !1;
  }
};
const ps = /* @__PURE__ */ Symbol("assistant-ui.store.getValue"), Su = (t) => {
  const e = t[ps];
  if (!e) throw new Error("Client scope contains a non-client resource. Ensure your Derived get() returns a client created with useClientResource(), not a plain resource.");
  return e.getState?.();
}, Er = /* @__PURE__ */ new Map();
function xu(t) {
  let e = Er.get(t);
  return e || (e = function(...s) {
    if (!this || typeof this != "object") throw new Error(`Method "${String(t)}" called without proper context. This may indicate the function was called incorrectly.`);
    const n = this[ps];
    if (!n) throw new Error(`Method "${String(t)}" called on invalid client proxy. Ensure you are calling this method on a valid client instance.`);
    const r = n[t];
    if (!r) throw new Error(`Method "${String(t)}" is not implemented.`);
    if (typeof r != "function") throw new Error(`"${String(t)}" is not a function.`);
    return r(...s);
  }, Er.set(t, e)), e;
}
var Iu = class extends Zn {
  boundFns;
  cachedReceiver;
  outputRef;
  index;
  constructor(t, e) {
    super(), this.outputRef = t, this.index = e;
  }
  get(t, e, s) {
    if (e === ps) return this.outputRef.current;
    if (e === en) return this.index;
    const n = Es(e, "ClientProxy");
    if (n !== !1) return n;
    const r = this.outputRef.current[e];
    if (typeof r == "function") {
      this.cachedReceiver !== s && (this.boundFns = /* @__PURE__ */ new Map(), this.cachedReceiver = s);
      let o = this.boundFns.get(e);
      return o || (o = xu(e).bind(s), this.boundFns.set(e, o)), o;
    }
    return r;
  }
  ownKeys() {
    return Object.keys(this.outputRef.current);
  }
  has(t, e) {
    return e === ps || e === en ? !0 : e in this.outputRef.current;
  }
};
const qt = (t) => {
  const e = de(null), s = Xn().length, n = he(() => new Proxy({}, new Iu(e, s)), [s]), r = yu(n, function() {
    return Ve(t);
  });
  return e.current || (e.current = r), Z(() => {
    e.current = r;
  }), {
    methods: n,
    state: r.getState?.(),
    key: t.key
  };
}, Tu = ie(qt), Pt = /* @__PURE__ */ Symbol("assistant-ui.store.proxiedAssistantState"), Fs = (t) => t === "on" || t === "subscribe" || typeof t == "symbol", wi = (t) => {
  class e extends Zn {
    get(n, r) {
      const o = Es(r, "AssistantState");
      if (o !== !1) return o;
      const i = r;
      if (!Fs(i))
        return Su(t[i]());
    }
    ownKeys() {
      return Object.keys(t).filter((n) => !Fs(n));
    }
    has(n, r) {
      return !Fs(r) && r in t;
    }
  }
  return new Proxy({}, new e());
}, Cu = (t) => t[Pt], Rr = () => () => {
}, Si = (t) => {
  const e = (() => {
    throw new Error(t);
  });
  return e.source = null, e.query = null, e;
};
var Eu = class extends Zn {
  get(t, e) {
    if (e === "subscribe" || e === "on") return Rr;
    if (e === Pt) return Ru;
    const s = Es(e, "DefaultAssistantClient");
    return s !== !1 ? s : Si("You are using a component or hook that requires an AuiProvider. Wrap your component in an <AuiProvider> component.");
  }
  ownKeys() {
    return [
      "subscribe",
      "on",
      Pt
    ];
  }
  has(t, e) {
    return e === "subscribe" || e === "on" || e === Pt;
  }
};
const Rs = new Proxy({}, new Eu()), Ru = wi(Rs), Au = () => new Proxy({}, { get(t, e) {
  const s = Es(e, "AssistantClient");
  return s !== !1 ? s : Si(`The current scope does not have a "${String(e)}" property.`);
} }), xi = ct(Rs), Ii = /* @__PURE__ */ Symbol("assistant-ui.store.useEffects"), Mu = () => {
}, Du = (t) => t[Ii] ?? Mu, ku = () => {
  "use no memo";
  const t = Ti();
  return Z(Du(t)), null;
}, Ti = () => Ts(xi), Fe = ({ value: t, children: e }) => {
  "use no memo";
  return /* @__PURE__ */ B(xi.Provider, {
    value: t,
    children: [/* @__PURE__ */ m(ku, {}), e]
  });
}, tn = (t) => {
  throw new Error("Derived elements are config-only and must not be mounted");
}, Pe = ie(tn), sn = /* @__PURE__ */ Symbol("assistant-ui.transform-scopes");
function Ci(t, e) {
  const s = t;
  if (s[sn]) throw new Error("transformScopes is already attached to this resource");
  s[sn] = e;
}
function Pu(t) {
  return t[sn];
}
const Ei = (t) => typeof t == "string" ? {
  scope: t.split(".")[0],
  event: t
} : {
  scope: t.scope,
  event: t.event
}, Ri = ct(null), $u = (t, e) => Ko(Ri, t, e), Ai = () => {
  const t = di(Ri);
  if (!t) throw new Error("AssistantTapContext is not available");
  return t;
}, Mi = () => Ai().clientRef, Kn = () => {
  const t = w(3), { emit: e } = Ai(), s = Xn();
  let n;
  return t[0] !== s || t[1] !== e ? (n = (r, o) => {
    e(r, o, s);
  }, t[0] = s, t[1] = e, t[2] = n) : n = t[2], ui(n);
};
function Nu(t, e) {
  const s = { ...t }, n = /* @__PURE__ */ new Set();
  let r = !0;
  for (; r; ) {
    r = !1;
    for (const a of Object.values(s)) {
      if (a.hook === tn || n.has(a.hook)) continue;
      n.add(a.hook);
      const c = Pu(a.hook);
      if (c) {
        c(s, e), r = !0;
        break;
      }
    }
  }
  const o = {}, i = {};
  for (const [a, c] of Object.entries(s)) c.hook === tn ? i[a] = c : o[a] = c;
  return {
    rootClients: o,
    derivedClients: i
  };
}
const Ar = (t) => he(() => t, [...Object.entries(t).flat()]), Ou = (t, e) => {
  const s = w(6);
  let n;
  s[0] !== e || s[1] !== t ? (n = Nu(t, e), s[0] = e, s[1] = t, s[2] = n) : n = s[2];
  const { rootClients: r, derivedClients: o } = n, i = Ar(r), a = Ar(o);
  let c;
  return s[3] !== i || s[4] !== a ? (c = {
    rootClients: i,
    derivedClients: a
  }, s[3] = i, s[4] = a, s[5] = c) : c = s[5], c;
}, Bu = () => {
  const t = w(3);
  let e;
  t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (e = /* @__PURE__ */ new Map(), t[0] = e) : e = t[0];
  const s = e;
  let n;
  t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (n = /* @__PURE__ */ new Set(), t[1] = n) : n = t[1];
  const r = n;
  let o;
  if (t[2] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel")) {
    const i = /* @__PURE__ */ new Set();
    o = {
      on(a, c) {
        const l = c;
        if (a === "*")
          return r.add(l), () => r.delete(l);
        let u = s.get(a);
        return u || (u = /* @__PURE__ */ new Set(), s.set(a, u)), u.add(l), () => {
          u.delete(l), u.size === 0 && s.delete(a);
        };
      },
      emit(a, c, l) {
        const u = s.get(a);
        !u && r.size === 0 || queueMicrotask(() => {
          const h = [];
          if (u) for (const d of u) try {
            d(c, l);
          } catch (f) {
            const p = f;
            h.push(p);
          }
          if (r.size > 0) {
            const d = {
              event: a,
              payload: c
            };
            for (const f of r) try {
              f(d, l);
            } catch (p) {
              const v = p;
              h.push(v);
            }
          }
          if (h.length > 0) {
            if (h.length === 1) throw h[0];
            for (const d of h) console.error(d);
            throw new AggregateError(h, "Errors occurred during event emission");
          }
        });
      },
      subscribe(a) {
        return i.add(a), () => i.delete(a);
      },
      notifySubscribers() {
        for (const a of i) try {
          a();
        } catch (c) {
          console.error("NotificationManager: subscriber callback error", c);
        }
      }
    }, t[2] = o;
  } else o = t[2];
  return o;
}, Fu = ie(Bu), Di = (t) => he(() => t, t), Lu = ({ element: t, emit: e, clientRef: s }) => {
  const { methods: n, state: r } = $u({
    clientRef: s,
    emit: e
  }, function() {
    return qt(t);
  });
  return he(() => ({
    state: r,
    methods: n
  }), [n, r]);
}, Vu = ({ element: t, notifications: e, clientRef: s, name: n }) => {
  const r = su(function() {
    return Lu({
      element: t,
      emit: e.emit,
      clientRef: s
    });
  });
  return Z(() => r.subscribe(e.notifySubscribers), [r, e]), he(() => {
    const o = () => r.getValue().methods;
    return Object.defineProperties(o, {
      source: {
        value: "root",
        writable: !1
      },
      query: {
        value: {},
        writable: !1
      },
      name: {
        value: n,
        configurable: !0
      }
    }), o;
  }, [r, n]);
}, ju = ie(Vu), qu = () => {
  const t = w(2);
  let e;
  t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (e = [], t[0] = e) : e = t[0];
  let s;
  return t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = {
    clients: e,
    subscribe: void 0,
    on: void 0
  }, t[1] = s) : s = t[1], s;
}, Uu = ie(qu), zu = (t) => {
  const e = w(14), { clients: s, clientRef: n } = t;
  let r;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (r = Fu(), e[0] = r) : r = e[0];
  const o = Ve(r);
  let i;
  e[1] !== n.parent || e[2] !== o.notifySubscribers ? (i = () => n.parent.subscribe(o.notifySubscribers), e[1] = n.parent, e[2] = o.notifySubscribers, e[3] = i) : i = e[3];
  let a;
  e[4] !== n || e[5] !== o ? (a = [n, o], e[4] = n, e[5] = o, e[6] = a) : a = e[6], Z(i, a);
  let c;
  e[7] !== n || e[8] !== s || e[9] !== o ? (c = Object.keys(s).map((h) => Te(h, ju({
    element: s[h],
    notifications: o,
    clientRef: n,
    name: h
  }))), e[7] = n, e[8] = s, e[9] = o, e[10] = c) : c = e[10];
  const l = Di(Cs(c));
  let u;
  return e[11] !== o || e[12] !== l ? (u = {
    notifications: o,
    results: l
  }, e[11] = o, e[12] = l, e[13] = u) : u = e[13], u;
}, Hu = (t) => {
  const { clientRef: e } = t, { notifications: s, results: n } = zu(t);
  return he(() => ({
    clients: n,
    subscribe: s.subscribe,
    on: function(r, o) {
      if (!this) throw new Error("const { on } = useAui() is not supported. Use aui.on() instead.");
      const { scope: i, event: a } = Ei(r);
      if (i !== "*" && this[i].source === null)
        throw new Error(`Scope "${i}" is not available. Use { scope: "*", event: "${a}" } to listen globally.`);
      const c = s.on(a, (u, h) => {
        if (i === "*") {
          o(u);
          return;
        }
        const d = this[i]();
        d === h[vu(d)] && o(u);
      });
      if (i !== "*" && e.parent[i].source === null) return c;
      const l = e.parent.on(r, o);
      return () => {
        c(), l();
      };
    }
  }), [
    n,
    s,
    e
  ]);
}, Gu = ie(Hu), Wu = ({ element: t, clientRef: e, name: s }) => {
  const n = de(t.args[0]);
  return n.current = t.args[0], he(() => {
    const r = () => n.current.get(e.current);
    return Object.defineProperties(r, {
      source: { value: n.current.source },
      query: { value: n.current.query },
      name: {
        value: s,
        configurable: !0
      }
    }), r;
  }, [e, s]);
}, Yu = ie(Wu), Ju = (t, e) => {
  let s;
  try {
    const n = {};
    for (const r of Object.keys(e.query).sort()) n[r] = e.query[r];
    s = JSON.stringify(n);
  } catch {
    s = String(e.query);
  }
  return `${t}::${e.source}::${s}`;
}, Qu = (t) => {
  const e = w(3), { clients: s, clientRef: n } = t;
  let r;
  return e[0] !== n || e[1] !== s ? (r = Object.keys(s).map((o) => {
    const i = o, a = s[i];
    return Te(Ju(i, a.args[0]), Yu({
      element: a,
      clientRef: n,
      name: i
    }));
  }), e[0] = n, e[1] = s, e[2] = r) : r = e[2], Di(Cs(r));
}, Xu = (t) => {
  const e = w(3), { rootClients: s, clientRef: n } = t;
  let r;
  return e[0] !== n || e[1] !== s ? (r = Object.keys(s).length > 0 ? Gu({
    clients: s,
    clientRef: n
  }) : Uu(), e[0] = n, e[1] = s, e[2] = r) : r = e[2], Ve(r);
}, Zu = ({ parent: t, clients: e }) => {
  const { rootClients: s, derivedClients: n } = Ou(e, t), r = de({
    parent: t,
    current: null
  }).current;
  Z(() => {
    r.current = a;
  });
  const o = Xu({
    rootClients: s,
    clientRef: r
  }), i = Qu({
    clients: n,
    clientRef: r
  }), a = he(() => {
    const c = t === Rs ? Au() : t, l = Object.create(c);
    Object.assign(l, {
      subscribe: o.subscribe ?? t.subscribe,
      on: o.on ?? t.on,
      [Pt]: wi(l)
    });
    for (const u of o.clients) l[u.name] = u;
    for (const u of i) l[u.name] = u;
    return l;
  }, [
    t,
    o,
    i
  ]);
  return r.current === null && (r.current = a), a;
}, Ku = (t) => {
  const { value: e, effects: s } = cu(function() {
    return Zu(t);
  });
  return e[Ii] = s, e;
};
function oe(t, { parent: e } = { parent: Ti() }) {
  if (t) return Ku({
    parent: e ?? Rs,
    clients: t
  });
  if (e === null) throw new Error("received null parent, this usage is not allowed");
  return e;
}
const M = (t) => {
  const e = w(6), s = oe();
  let n;
  e[0] !== s ? (n = Cu(s), e[0] = s, e[1] = n) : n = e[1];
  const r = n;
  let o, i;
  e[2] !== r || e[3] !== t ? (o = () => t(r), i = () => t(r), e[2] = r, e[3] = t, e[4] = o, e[5] = i) : (o = e[4], i = e[5]);
  const a = Jn(s.subscribe, o, i);
  if (a === r) throw new Error("You tried to return the entire AssistantState. This is not supported due to technical limitations.");
  return Vl(a), a;
}, ed = (t) => {
  const e = oe(), s = de(!1), n = s.current ? null : t(e);
  return M(() => s.current ? t(e) : n), () => (s.current = !0, t(e));
}, td = Object.freeze({});
function As(t) {
  const e = w(3), { getItemState: s, children: n } = t, r = ed(s);
  let o;
  return e[0] !== n || e[1] !== r ? (o = n(r), e[0] = n, e[1] = r, e[2] = o) : o = e[2], sd(o);
}
const sd = (t) => {
  const e = typeof t == "object" && t != null && "type" in t ? t : null, s = e?.type, n = e?.key;
  return he(() => e, [
    s,
    n,
    typeof e?.props == "object" && e.props != null && Object.entries(e.props).length === 0 ? td : e?.props
  ]) ?? t;
}, nd = Ne.createContext(!0);
function Mr() {
  throw new Error("A function wrapped in useEffectEvent can't be called during rendering.");
}
const rd = "use" in Ne ? () => {
  try {
    return Ne.use(nd);
  } catch {
    return !1;
  }
} : () => !1;
function od(t) {
  const e = Ne.useRef(Mr);
  return Ne.useInsertionEffect(() => {
    e.current = t;
  }, [t]), (...s) => {
    rd() && Mr();
    const n = e.current;
    return n(...s);
  };
}
const gs = (t, e) => {
  const s = w(11), n = oe(), r = od(e);
  let o;
  s[0] !== t ? (o = Ei(t), s[0] = t, s[1] = o) : o = s[1];
  const { scope: i, event: a } = o;
  let c;
  s[2] !== n || s[3] !== r || s[4] !== a || s[5] !== i ? (c = () => n.on({
    scope: i,
    event: a
  }, r), s[2] = n, s[3] = r, s[4] = a, s[5] = i, s[6] = c) : c = s[6];
  let l;
  s[7] !== n || s[8] !== a || s[9] !== i ? (l = [
    n,
    i,
    a
  ], s[7] = n, s[8] = a, s[9] = i, s[10] = l) : l = s[10], Z(c, l);
}, id = (t) => {
  if (t.key === void 0) throw new Error("useClientLookup: Element has no key");
  return t.key;
};
function st(t) {
  const e = w(15);
  let s;
  e[0] !== t ? (s = t.map(ld), e[0] = t, e[1] = s) : s = e[1];
  const n = Cs(s);
  let r;
  e[2] !== n ? (r = Object.keys(n), e[2] = n, e[3] = r) : r = e[3];
  const o = r;
  let i;
  e[4] !== n ? (i = n.reduce(cd, {}), e[4] = n, e[5] = i) : i = e[5];
  const a = i;
  let c;
  e[6] !== n ? (c = n.map(ad), e[6] = n, e[7] = c) : c = e[7];
  const l = c;
  let u;
  e[8] !== a || e[9] !== o || e[10] !== n ? (u = (d) => {
    if ("index" in d) {
      if (d.index < 0 || o.length === 0) throw new Error(`useClientLookup: Index ${d.index} out of bounds (length: ${o.length})`);
      const p = Math.min(d.index, o.length - 1);
      return p !== d.index && console.warn(`useClientLookup: Clamped stale index ${d.index} to ${p} (length: ${o.length})`), n[p].methods;
    }
    const f = a[d.key];
    if (f === void 0) throw new Error(`useClientLookup: Key "${d.key}" not found`);
    return n[f].methods;
  }, e[8] = a, e[9] = o, e[10] = n, e[11] = u) : u = e[11];
  let h;
  return e[12] !== l || e[13] !== u ? (h = {
    state: l,
    get: u
  }, e[12] = l, e[13] = u, e[14] = h) : h = e[14], h;
}
function ad(t) {
  return t.state;
}
function cd(t, e, s) {
  return t[e.key] = s, t;
}
function ld(t) {
  return Te(id(t), Tu(t), t.deps);
}
const ki = (t) => {
  const e = w(15), { toolkit: s, mcpApp: n } = t;
  let r;
  e[0] !== n ? (r = n ? [Te("mcpApp", n)] : [], e[0] = n, e[1] = r) : r = e[1];
  const o = Cs(r)[0], [i, a] = ue(dd);
  let c;
  e[2] !== i ? (c = Object.fromEntries(Object.entries(i).map(md)), e[2] = i, e[3] = c) : c = e[3];
  let l;
  e[4] !== o || e[5] !== c || e[6] !== i ? (l = {
    toolUIs: i,
    mcpApp: o,
    tools: c
  }, e[4] = o, e[5] = c, e[6] = i, e[7] = l) : l = e[7];
  const u = l, h = Mi();
  let d;
  e[8] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (d = (C, I, E) => {
    const b = {
      render: I,
      standalone: E?.standalone ?? !1
    };
    return a((y) => ({
      ...y,
      [C]: [...y[C] ?? [], b]
    })), () => {
      a((y) => {
        const T = y[C]?.filter((S) => S !== b) ?? [];
        if (T.length > 0) return {
          ...y,
          [C]: T
        };
        const x = { ...y };
        return delete x[C], x;
      });
    };
  }, e[8] = d) : d = e[8];
  const f = d;
  let p, v;
  e[9] !== h || e[10] !== s ? (p = () => {
    if (!s) return;
    const C = [];
    for (const [E, b] of Object.entries(s)) {
      const y = "render" in b ? b.render : void 0, T = "renderText" in b ? b.renderText : void 0, x = y ?? (T ? _u(T) : void 0);
      x && C.push(f(E, x, { standalone: gu(b) }));
    }
    const I = Object.entries(s).reduce(fd, {});
    return C.push(h.current.modelContext().register({ getModelContext: () => ({ tools: I }) })), () => {
      C.forEach(pd);
    };
  }, v = [
    s,
    f,
    h
  ], e[9] = h, e[10] = s, e[11] = p, e[12] = v) : (p = e[11], v = e[12]), Z(p, v);
  let _;
  return e[13] !== u ? (_ = {
    getState: () => u,
    setToolUI: f
  }, e[13] = u, e[14] = _) : _ = e[14], _;
}, ud = ie(ki);
Ci(ki, (t, e) => {
  !t.modelContext && e.modelContext.source === null && (t.modelContext = vi());
});
function dd() {
  return {};
}
function hd(t) {
  return t.render;
}
function md(t) {
  const [e, s] = t;
  return [e, s.map(hd)];
}
function fd(t, e) {
  const [s, n] = e;
  if (n.type === "mcp") return t;
  const { display: r, render: o, renderText: i, ...a } = n;
  return t[s] = a, t;
}
function pd(t) {
  return t();
}
const lt = (t) => Jn(t.subscribe, t.getState), gd = (t) => {
  const e = w(8), { runtime: s } = t, n = lt(s);
  let r;
  e[0] !== n ? (r = () => n, e[0] = n, e[1] = r) : r = e[1];
  let o;
  e[2] !== s ? (o = () => s, e[2] = s, e[3] = o) : o = e[3];
  let i;
  return e[4] !== s.remove || e[5] !== r || e[6] !== o ? (i = {
    getState: r,
    remove: s.remove,
    __internal_getRuntime: o
  }, e[4] = s.remove, e[5] = r, e[6] = o, e[7] = i) : i = e[7], i;
}, Pi = ie(gd), bd = (t) => {
  const e = w(5), { runtime: s, index: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getAttachmentByIndex(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const o = r;
  let i;
  return e[3] !== o ? (i = Pi({ runtime: o }), e[3] = o, e[4] = i) : i = e[4], Ve(i);
}, _d = ie(bd), vd = ({ item: t, onSteer: e, onRemove: s }) => ({
  getState: () => t,
  steer: e,
  remove: s
}), yd = ie(vd), wd = (t) => {
  const e = w(55), { threadIdRef: s, messageIdRef: n, runtime: r } = t, o = lt(r), i = Kn();
  let a, c;
  e[0] !== i || e[1] !== n || e[2] !== r || e[3] !== s ? (a = () => {
    const x = [];
    for (const S of ["send", "attachmentAdd"]) {
      const j = r.unstable_on(S, () => {
        i(`composer.${S}`, {
          threadId: s.current,
          ...n && { messageId: n.current }
        });
      });
      x.push(j);
    }
    return x.push(r.unstable_on("attachmentAddError", (S) => {
      i("composer.attachmentAddError", {
        threadId: s.current,
        ...n && { messageId: n.current },
        ...S.attachmentId && { attachmentId: S.attachmentId },
        reason: S.reason,
        message: S.message
      });
    })), () => {
      for (const S of x) S();
    };
  }, c = [
    r,
    i,
    s,
    n
  ], e[0] = i, e[1] = n, e[2] = r, e[3] = s, e[4] = a, e[5] = c) : (a = e[4], c = e[5]), Z(a, c);
  let l;
  if (e[6] !== r || e[7] !== o.attachments) {
    let x;
    e[9] !== r ? (x = (S, j) => Te(S.id, _d({
      runtime: r,
      index: j
    }), [r, j]), e[9] = r, e[10] = x) : x = e[10], l = o.attachments.map(x), e[6] = r, e[7] = o.attachments, e[8] = l;
  } else l = e[8];
  const u = st(l), h = o.queue;
  let d;
  if (e[11] !== h || e[12] !== r) {
    let x;
    e[14] !== r ? (x = (S) => Te(S.id, yd({
      item: S,
      onSteer: () => r.steerQueueItem(S.id),
      onRemove: () => r.removeQueueItem(S.id)
    })), e[14] = r, e[15] = x) : x = e[15], d = h.map(x), e[11] = h, e[12] = r, e[13] = d;
  } else d = e[13];
  const f = st(d), p = o.type ?? "thread";
  let v;
  e[16] !== u.state || e[17] !== h || e[18] !== o.attachmentAccept || e[19] !== o.canCancel || e[20] !== o.canSend || e[21] !== o.dictation || e[22] !== o.isEditing || e[23] !== o.isEmpty || e[24] !== o.quote || e[25] !== o.role || e[26] !== o.runConfig || e[27] !== o.text || e[28] !== p ? (v = {
    text: o.text,
    role: o.role,
    attachments: u.state,
    runConfig: o.runConfig,
    isEditing: o.isEditing,
    canCancel: o.canCancel,
    canSend: o.canSend,
    attachmentAccept: o.attachmentAccept,
    isEmpty: o.isEmpty,
    type: p,
    dictation: o.dictation,
    quote: o.quote,
    queue: h
  }, e[16] = u.state, e[17] = h, e[18] = o.attachmentAccept, e[19] = o.canCancel, e[20] = o.canSend, e[21] = o.dictation, e[22] = o.isEditing, e[23] = o.isEmpty, e[24] = o.quote, e[25] = o.role, e[26] = o.runConfig, e[27] = o.text, e[28] = p, e[29] = v) : v = e[29];
  const _ = v;
  let C;
  e[30] !== _ ? (C = () => _, e[30] = _, e[31] = C) : C = e[31];
  const I = r.beginEdit ?? Sd;
  let E;
  e[32] !== u ? (E = (x) => "id" in x ? u.get({ key: x.id }) : u.get(x), e[32] = u, e[33] = E) : E = e[33];
  let b;
  e[34] !== f ? (b = (x) => f.get(x), e[34] = f, e[35] = b) : b = e[35];
  let y;
  e[36] !== r ? (y = () => r, e[36] = r, e[37] = y) : y = e[37];
  let T;
  return e[38] !== r.addAttachment || e[39] !== r.cancel || e[40] !== r.clearAttachments || e[41] !== r.reset || e[42] !== r.send || e[43] !== r.setQuote || e[44] !== r.setRole || e[45] !== r.setRunConfig || e[46] !== r.setText || e[47] !== r.startDictation || e[48] !== r.stopDictation || e[49] !== b || e[50] !== y || e[51] !== C || e[52] !== I || e[53] !== E ? (T = {
    getState: C,
    setText: r.setText,
    setRole: r.setRole,
    setRunConfig: r.setRunConfig,
    addAttachment: r.addAttachment,
    reset: r.reset,
    clearAttachments: r.clearAttachments,
    send: r.send,
    cancel: r.cancel,
    beginEdit: I,
    startDictation: r.startDictation,
    stopDictation: r.stopDictation,
    setQuote: r.setQuote,
    attachment: E,
    queueItem: b,
    __internal_getRuntime: y
  }, e[38] = r.addAttachment, e[39] = r.cancel, e[40] = r.clearAttachments, e[41] = r.reset, e[42] = r.send, e[43] = r.setQuote, e[44] = r.setRole, e[45] = r.setRunConfig, e[46] = r.setText, e[47] = r.startDictation, e[48] = r.stopDictation, e[49] = b, e[50] = y, e[51] = C, e[52] = I, e[53] = E, e[54] = T) : T = e[54], T;
}, $i = ie(wd);
function Sd() {
  throw new Error("beginEdit is not supported in this runtime");
}
const Ni = (t) => ({ get current() {
  return t();
} }), xd = (t) => {
  const e = w(13), { runtime: s } = t, n = lt(s);
  let r;
  e[0] !== n ? (r = () => n, e[0] = n, e[1] = r) : r = e[1];
  let o, i, a, c;
  e[2] !== s ? (o = (u) => s.addToolResult(u), i = (u) => s.resumeToolCall(u), a = (u) => s.respondToToolApproval(u), c = () => s, e[2] = s, e[3] = o, e[4] = i, e[5] = a, e[6] = c) : (o = e[3], i = e[4], a = e[5], c = e[6]);
  let l;
  return e[7] !== r || e[8] !== o || e[9] !== i || e[10] !== a || e[11] !== c ? (l = {
    getState: r,
    addToolResult: o,
    resumeToolCall: i,
    respondToToolApproval: a,
    __internal_getRuntime: c
  }, e[7] = r, e[8] = o, e[9] = i, e[10] = a, e[11] = c, e[12] = l) : l = e[12], l;
}, Id = ie(xd), Td = (t) => {
  const e = w(5), { runtime: s, index: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getAttachmentByIndex(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const o = r;
  let i;
  return e[3] !== o ? (i = Pi({ runtime: o }), e[3] = o, e[4] = i) : i = e[4], Ve(i);
}, Cd = ie(Td), Ed = (t) => {
  const e = w(5), { runtime: s, index: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getMessagePartByIndex(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const o = r;
  let i;
  return e[3] !== o ? (i = Id({ runtime: o }), e[3] = o, e[4] = i) : i = e[4], Ve(i);
}, Rd = ie(Ed), Ad = (t) => {
  const e = w(55), { runtime: s, threadIdRef: n } = t, r = lt(s), [o, i] = ue(!1), [a, c] = ue(!1);
  let l;
  e[0] !== s ? (l = Ni(() => s.getState().id), e[0] = s, e[1] = l) : l = e[1];
  const u = l;
  let h;
  e[2] !== u || e[3] !== s.composer || e[4] !== n ? (h = $i({
    runtime: s.composer,
    threadIdRef: n,
    messageIdRef: u
  }), e[2] = u, e[3] = s.composer, e[4] = n, e[5] = h) : h = e[5];
  const d = qt(h);
  let f;
  if (e[6] !== s || e[7] !== r.content) {
    let z;
    e[9] !== s ? (z = (ee, L) => Te("toolCallId" in ee && ee.toolCallId != null ? `toolCallId-${ee.toolCallId}` : `index-${L}`, Rd({
      runtime: s,
      index: L
    }), [s, L]), e[9] = s, e[10] = z) : z = e[10], f = r.content.map(z), e[6] = s, e[7] = r.content, e[8] = f;
  } else f = e[8];
  const p = st(f);
  let v;
  e[11] !== r.attachments ? (v = r.attachments ?? [], e[11] = r.attachments, e[12] = v) : v = e[12];
  let _;
  if (e[13] !== s || e[14] !== v) {
    let z;
    e[16] !== s ? (z = (ee, L) => Te(ee.id, Cd({
      runtime: s,
      index: L
    }), [s, L]), e[16] = s, e[17] = z) : z = e[17], _ = v.map(z), e[13] = s, e[14] = v, e[15] = _;
  } else _ = e[15];
  const C = st(_), I = r;
  let E;
  e[18] !== d.state || e[19] !== o || e[20] !== a || e[21] !== p.state || e[22] !== I ? (E = {
    ...I,
    parts: p.state,
    composer: d.state,
    isCopied: o,
    isHovering: a
  }, e[18] = d.state, e[19] = o, e[20] = a, e[21] = p.state, e[22] = I, e[23] = E) : E = e[23];
  const b = E;
  let y;
  e[24] !== b ? (y = () => b, e[24] = b, e[25] = y) : y = e[25];
  let T;
  e[26] !== d.methods ? (T = () => d.methods, e[26] = d.methods, e[27] = T) : T = e[27];
  let x, S, j, P, H, J, V;
  e[28] !== s ? (x = () => s.delete(), S = (z) => s.reload(z), j = () => s.speak(), P = () => s.stopSpeaking(), H = (z) => s.submitFeedback(z), J = (z) => s.switchToBranch(z), V = () => s.unstable_getCopyText(), e[28] = s, e[29] = x, e[30] = S, e[31] = j, e[32] = P, e[33] = H, e[34] = J, e[35] = V) : (x = e[29], S = e[30], j = e[31], P = e[32], H = e[33], J = e[34], V = e[35]);
  let F;
  e[36] !== p ? (F = (z) => "index" in z ? p.get({ index: z.index }) : p.get({ key: `toolCallId-${z.toolCallId}` }), e[36] = p, e[37] = F) : F = e[37];
  let te;
  e[38] !== C ? (te = (z) => "id" in z ? C.get({ key: z.id }) : C.get(z), e[38] = C, e[39] = te) : te = e[39];
  let ce;
  e[40] !== s ? (ce = () => s, e[40] = s, e[41] = ce) : ce = e[41];
  let K;
  return e[42] !== x || e[43] !== S || e[44] !== j || e[45] !== P || e[46] !== H || e[47] !== J || e[48] !== V || e[49] !== F || e[50] !== te || e[51] !== ce || e[52] !== y || e[53] !== T ? (K = {
    getState: y,
    composer: T,
    delete: x,
    reload: S,
    speak: j,
    stopSpeaking: P,
    submitFeedback: H,
    switchToBranch: J,
    getCopyText: V,
    part: F,
    attachment: te,
    setIsCopied: i,
    setIsHovering: c,
    __internal_getRuntime: ce
  }, e[42] = x, e[43] = S, e[44] = j, e[45] = P, e[46] = H, e[47] = J, e[48] = V, e[49] = F, e[50] = te, e[51] = ce, e[52] = y, e[53] = T, e[54] = K) : K = e[54], K;
}, Md = ie(Ad), Dd = (t) => {
  const e = w(6), { runtime: s, id: n, threadIdRef: r } = t;
  let o;
  e[0] !== n || e[1] !== s ? (o = s.getMessageById(n), e[0] = n, e[1] = s, e[2] = o) : o = e[2];
  const i = o;
  let a;
  return e[3] !== i || e[4] !== r ? (a = Md({
    runtime: i,
    threadIdRef: r
  }), e[3] = i, e[4] = r, e[5] = a) : a = e[5], Ve(a);
}, kd = ie(Dd), Pd = (t) => {
  const e = w(59), { runtime: s } = t, n = lt(s), r = Kn();
  let o, i;
  e[0] !== r || e[1] !== s ? (o = () => {
    const y = [];
    for (const T of [
      "runStart",
      "runEnd",
      "initialize",
      "modelContextUpdate"
    ]) {
      const x = s.unstable_on(T, () => {
        const S = s.getState()?.threadId || "unknown";
        r(`thread.${T}`, { threadId: S });
      });
      y.push(x);
    }
    return () => {
      for (const T of y) T();
    };
  }, i = [s, r], e[0] = r, e[1] = s, e[2] = o, e[3] = i) : (o = e[2], i = e[3]), Z(o, i);
  let a;
  e[4] !== s ? (a = Ni(() => s.getState().threadId), e[4] = s, e[5] = a) : a = e[5];
  const c = a;
  let l;
  e[6] !== s.composer || e[7] !== c ? (l = $i({
    runtime: s.composer,
    threadIdRef: c
  }), e[6] = s.composer, e[7] = c, e[8] = l) : l = e[8];
  const u = qt(l);
  let h;
  if (e[9] !== s || e[10] !== n.messages || e[11] !== c) {
    let y;
    e[13] !== s || e[14] !== c ? (y = (T) => Te(T.id, kd({
      runtime: s,
      id: T.id,
      threadIdRef: c
    }), [
      s,
      T.id,
      c
    ]), e[13] = s, e[14] = c, e[15] = y) : y = e[15], h = n.messages.map(y), e[9] = s, e[10] = n.messages, e[11] = c, e[12] = h;
  } else h = e[12];
  const d = st(h), f = d.state.length === 0 && !n.isLoading;
  let p;
  e[16] !== u.state || e[17] !== d.state || e[18] !== n.capabilities || e[19] !== n.extras || e[20] !== n.isDisabled || e[21] !== n.isLoading || e[22] !== n.isRunning || e[23] !== n.speech || e[24] !== n.state || e[25] !== n.suggestions || e[26] !== n.voice || e[27] !== f ? (p = {
    isEmpty: f,
    isDisabled: n.isDisabled,
    isLoading: n.isLoading,
    isRunning: n.isRunning,
    capabilities: n.capabilities,
    state: n.state,
    suggestions: n.suggestions,
    extras: n.extras,
    speech: n.speech,
    voice: n.voice,
    composer: u.state,
    messages: d.state
  }, e[16] = u.state, e[17] = d.state, e[18] = n.capabilities, e[19] = n.extras, e[20] = n.isDisabled, e[21] = n.isLoading, e[22] = n.isRunning, e[23] = n.speech, e[24] = n.state, e[25] = n.suggestions, e[26] = n.voice, e[27] = f, e[28] = p) : p = e[28];
  const v = p;
  let _;
  e[29] !== v ? (_ = () => v, e[29] = v, e[30] = _) : _ = e[30];
  let C;
  e[31] !== u.methods ? (C = () => u.methods, e[31] = u.methods, e[32] = C) : C = e[32];
  let I;
  e[33] !== d ? (I = (y) => "id" in y ? d.get({ key: y.id }) : d.get(y), e[33] = d, e[34] = I) : I = e[34];
  let E;
  e[35] !== s ? (E = () => s, e[35] = s, e[36] = E) : E = e[36];
  let b;
  return e[37] !== s.append || e[38] !== s.cancelRun || e[39] !== s.connectVoice || e[40] !== s.deleteMessage || e[41] !== s.disconnectVoice || e[42] !== s.export || e[43] !== s.getModelContext || e[44] !== s.getVoiceVolume || e[45] !== s.import || e[46] !== s.importExternalState || e[47] !== s.muteVoice || e[48] !== s.reset || e[49] !== s.resumeRun || e[50] !== s.startRun || e[51] !== s.stopSpeaking || e[52] !== s.subscribeVoiceVolume || e[53] !== s.unmuteVoice || e[54] !== I || e[55] !== E || e[56] !== _ || e[57] !== C ? (b = {
    getState: _,
    composer: C,
    append: s.append,
    deleteMessage: s.deleteMessage,
    startRun: s.startRun,
    resumeRun: s.resumeRun,
    importExternalState: s.importExternalState,
    cancelRun: s.cancelRun,
    getModelContext: s.getModelContext,
    export: s.export,
    import: s.import,
    reset: s.reset,
    stopSpeaking: s.stopSpeaking,
    connectVoice: s.connectVoice,
    disconnectVoice: s.disconnectVoice,
    getVoiceVolume: s.getVoiceVolume,
    subscribeVoiceVolume: s.subscribeVoiceVolume,
    muteVoice: s.muteVoice,
    unmuteVoice: s.unmuteVoice,
    message: I,
    __internal_getRuntime: E
  }, e[37] = s.append, e[38] = s.cancelRun, e[39] = s.connectVoice, e[40] = s.deleteMessage, e[41] = s.disconnectVoice, e[42] = s.export, e[43] = s.getModelContext, e[44] = s.getVoiceVolume, e[45] = s.import, e[46] = s.importExternalState, e[47] = s.muteVoice, e[48] = s.reset, e[49] = s.resumeRun, e[50] = s.startRun, e[51] = s.stopSpeaking, e[52] = s.subscribeVoiceVolume, e[53] = s.unmuteVoice, e[54] = I, e[55] = E, e[56] = _, e[57] = C, e[58] = b) : b = e[58], b;
}, $d = ie(Pd), Nd = (t) => {
  const e = w(20), { runtime: s } = t, n = lt(s), r = Kn();
  let o, i;
  e[0] !== r || e[1] !== s ? (o = () => {
    const u = [];
    for (const h of ["switchedTo", "switchedAway"]) {
      const d = s.unstable_on(h, () => {
        r(`threadListItem.${h}`, { threadId: s.getState().id });
      });
      u.push(d);
    }
    return () => {
      for (const h of u) h();
    };
  }, i = [s, r], e[0] = r, e[1] = s, e[2] = o, e[3] = i) : (o = e[2], i = e[3]), Z(o, i);
  let a;
  e[4] !== n ? (a = () => n, e[4] = n, e[5] = a) : a = e[5];
  let c;
  e[6] !== s ? (c = () => s, e[6] = s, e[7] = c) : c = e[7];
  let l;
  return e[8] !== s.archive || e[9] !== s.delete || e[10] !== s.detach || e[11] !== s.generateTitle || e[12] !== s.initialize || e[13] !== s.rename || e[14] !== s.switchTo || e[15] !== s.unarchive || e[16] !== s.updateCustom || e[17] !== a || e[18] !== c ? (l = {
    getState: a,
    switchTo: s.switchTo,
    rename: s.rename,
    updateCustom: s.updateCustom,
    archive: s.archive,
    unarchive: s.unarchive,
    delete: s.delete,
    generateTitle: s.generateTitle,
    initialize: s.initialize,
    detach: s.detach,
    __internal_getRuntime: c
  }, e[8] = s.archive, e[9] = s.delete, e[10] = s.detach, e[11] = s.generateTitle, e[12] = s.initialize, e[13] = s.rename, e[14] = s.switchTo, e[15] = s.unarchive, e[16] = s.updateCustom, e[17] = a, e[18] = c, e[19] = l) : l = e[19], l;
}, Od = ie(Nd), Bd = (t) => {
  const e = w(5), { runtime: s, id: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getItemById(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const o = r;
  let i;
  return e[3] !== o ? (i = Od({ runtime: o }), e[3] = o, e[4] = i) : i = e[4], Ve(i);
}, Fd = ie(Bd), Ld = (t) => {
  const e = w(40), { runtime: s, __internal_assistantRuntime: n } = t, r = lt(s);
  let o;
  e[0] !== s.main ? (o = $d({ runtime: s.main }), e[0] = s.main, e[1] = o) : o = e[1];
  const i = qt(o);
  let a;
  e[2] !== s || e[3] !== r.threadItems ? (a = Object.keys(r.threadItems).map((T) => Te(T, Fd({
    runtime: s,
    id: T
  }), [s, T])), e[2] = s, e[3] = r.threadItems, e[4] = a) : a = e[4];
  const c = st(a), l = r.newThreadId ?? null;
  let u;
  e[5] !== i.state || e[6] !== r.archivedThreadIds || e[7] !== r.hasMore || e[8] !== r.isLoading || e[9] !== r.isLoadingMore || e[10] !== r.mainThreadId || e[11] !== r.threadIds || e[12] !== l || e[13] !== c.state ? (u = {
    mainThreadId: r.mainThreadId,
    newThreadId: l,
    isLoading: r.isLoading,
    isLoadingMore: r.isLoadingMore,
    hasMore: r.hasMore,
    threadIds: r.threadIds,
    archivedThreadIds: r.archivedThreadIds,
    threadItems: c.state,
    main: i.state
  }, e[5] = i.state, e[6] = r.archivedThreadIds, e[7] = r.hasMore, e[8] = r.isLoading, e[9] = r.isLoadingMore, e[10] = r.mainThreadId, e[11] = r.threadIds, e[12] = l, e[13] = c.state, e[14] = u) : u = e[14];
  const h = u;
  let d;
  e[15] !== h ? (d = () => h, e[15] = h, e[16] = d) : d = e[16];
  let f;
  e[17] !== i.methods ? (f = () => i.methods, e[17] = i.methods, e[18] = f) : f = e[18];
  let p;
  e[19] !== h || e[20] !== c ? (p = (T) => {
    if (T === "main") return c.get({ key: h.mainThreadId });
    if ("id" in T) return c.get({ key: T.id });
    const { index: x, archived: S } = T, j = S !== void 0 && S ? h.archivedThreadIds[x] : h.threadIds[x];
    return c.get({ key: j });
  }, e[19] = h, e[20] = c, e[21] = p) : p = e[21];
  let v, _, C, I, E;
  e[22] !== s ? (I = async (T, x) => {
    await s.switchToThread(T, x);
  }, E = async () => {
    await s.switchToNewThread();
  }, v = () => s.getLoadThreadsPromise(), _ = () => s.reload(), C = () => s.loadMore(), e[22] = s, e[23] = v, e[24] = _, e[25] = C, e[26] = I, e[27] = E) : (v = e[23], _ = e[24], C = e[25], I = e[26], E = e[27]);
  let b;
  e[28] !== n ? (b = () => n, e[28] = n, e[29] = b) : b = e[29];
  let y;
  return e[30] !== v || e[31] !== _ || e[32] !== C || e[33] !== b || e[34] !== d || e[35] !== f || e[36] !== p || e[37] !== I || e[38] !== E ? (y = {
    getState: d,
    thread: f,
    item: p,
    switchToThread: I,
    switchToNewThread: E,
    getLoadThreadsPromise: v,
    reload: _,
    loadMore: C,
    __internal_getAssistantRuntime: b
  }, e[30] = v, e[31] = _, e[32] = C, e[33] = b, e[34] = d, e[35] = f, e[36] = p, e[37] = I, e[38] = E, e[39] = y) : y = e[39], y;
}, Vd = ie(Ld), jd = (t) => ({ getState: () => t }), qd = ie(jd), Ud = (t) => {
  const e = w(11);
  let s;
  e[0] !== t ? (s = () => ({ suggestions: (t ?? []).map(Hd) }), e[0] = t, e[1] = s) : s = e[1];
  const [n] = ue(s);
  let r;
  e[2] !== n.suggestions ? (r = n.suggestions.map(Gd), e[2] = n.suggestions, e[3] = r) : r = e[3];
  const o = st(r);
  let i;
  e[4] !== n ? (i = () => n, e[4] = n, e[5] = i) : i = e[5];
  let a;
  e[6] !== o ? (a = (l) => {
    const { index: u } = l;
    return o.get({ index: u });
  }, e[6] = o, e[7] = a) : a = e[7];
  let c;
  return e[8] !== i || e[9] !== a ? (c = {
    getState: i,
    suggestion: a
  }, e[8] = i, e[9] = a, e[10] = c) : c = e[10], c;
}, zd = ie(Ud);
function Hd(t) {
  return typeof t == "string" ? {
    title: t,
    label: "",
    prompt: t
  } : {
    title: t.title,
    label: t.label,
    prompt: t.prompt
  };
}
function Gd(t, e) {
  return Te(e, qd(t), [t]);
}
const Wd = (t, e) => {
  t.thread ??= Pe({
    source: "threads",
    query: { type: "main" },
    get: (s) => s.threads().thread("main")
  }), t.threadListItem ??= Pe({
    source: "threads",
    query: { type: "main" },
    get: (s) => s.threads().item("main")
  }), t.composer ??= Pe({
    source: "thread",
    query: {},
    get: (s) => s.threads().thread("main").composer()
  }), !t.modelContext && e.modelContext.source === null && (t.modelContext = vi()), !t.suggestions && e.suggestions.source === null && (t.suggestions = zd());
}, Oi = (t) => {
  const e = w(6), s = Mi();
  let n, r;
  e[0] !== s || e[1] !== t ? (n = () => t.registerModelContextProvider(s.current.modelContext()), r = [t, s], e[0] = s, e[1] = t, e[2] = n, e[3] = r) : (n = e[2], r = e[3]), Z(n, r);
  let o;
  return e[4] !== t ? (o = Vd({
    runtime: t.threads,
    __internal_assistantRuntime: t
  }), e[4] = t, e[5] = o) : o = e[5], Ve(o);
}, Yd = ie(Oi);
Ci(Oi, (t, e) => {
  Wd(t, e), !t.tools && e.tools.source === null && (t.tools = ud({})), !t.dataRenderers && e.dataRenderers.source === null && (t.dataRenderers = uu());
});
const Jd = (t) => t._core?.RenderComponent, Qd = _e(({ runtime: t, aui: e = null, children: s }) => {
  "use no memo";
  const n = oe({ threads: Yd(t) }, { parent: e }), r = Jd(t), o = /* @__PURE__ */ B(Fe, {
    value: n,
    children: [r && /* @__PURE__ */ m(r, {}), s]
  });
  return e ? /* @__PURE__ */ m(Fe, {
    value: e,
    children: o
  }) : o;
});
function pe(t) {
  return t != null && typeof t == "object" && !Array.isArray(t);
}
function bs(t, e = 0) {
  return e > 100 ? !1 : t === null || typeof t == "string" || typeof t == "boolean" ? !0 : typeof t == "number" ? !Number.isNaN(t) && Number.isFinite(t) : Array.isArray(t) ? t.every((s) => bs(s, e + 1)) : pe(t) ? Object.entries(t).every(([s, n]) => typeof s == "string" && bs(n, e + 1)) : !1;
}
const Xd = 100, nn = (t, e, s) => {
  if (t === e) return !0;
  if (s > Xd || t == null || e == null) return !1;
  if (Array.isArray(t))
    return !Array.isArray(e) || t.length !== e.length ? !1 : t.every((o, i) => nn(o, e[i], s + 1));
  if (Array.isArray(e) || !pe(t) || !pe(e)) return !1;
  const n = Object.keys(t), r = Object.keys(e);
  return n.length !== r.length ? !1 : n.every((o) => Object.hasOwn(e, o) && nn(t[o], e[o], s + 1));
}, er = (t, e) => !bs(t) || !bs(e) ? !1 : nn(t, e, 0);
function Zd(t) {
  const e = t.metadata;
  if (!e || typeof e != "object") return;
  const s = e.custom;
  if (!s || typeof s != "object") return;
  const n = s.interactables;
  return Array.isArray(n) ? n : void 0;
}
function Kd(t) {
  return `update_${t.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}
const Dr = (t) => {
  if (!pe(t)) return;
  const e = t.id;
  return typeof e == "string" || typeof e == "number" ? e : void 0;
};
function eh(t, e, s) {
  let n = Array.isArray(e.set) ? [...e.set] : [...t];
  if (e.clear === !0 && (n = []), Array.isArray(e.remove) && e.remove.length > 0) {
    const o = new Set(e.remove);
    n = n.filter((i) => {
      const a = Dr(i);
      return a !== void 0 ? !o.has(a) : !o.has(i);
    });
  }
  const r = e.update;
  if (Array.isArray(r) && r.length > 0 && (n = n.map((o) => {
    const i = Dr(o);
    if (i === void 0 || !pe(o)) return o;
    const a = r.find((c) => pe(c) && c.id === i);
    return a ? {
      ...o,
      ...a
    } : o;
  })), Array.isArray(e.add) && e.add.length > 0) {
    const o = s ? e.add.map((i) => {
      if (!pe(i) || i.id !== void 0) return i;
      const a = s();
      return a === void 0 ? i : {
        ...i,
        id: a
      };
    }) : e.add;
    n = [...n, ...o];
  }
  return n;
}
function Ls(t, e, s) {
  if (!pe(t) || !pe(e)) return e;
  const n = pe(s?.arrayBaseline) ? s.arrayBaseline : t, r = { ...t };
  for (const [o, i] of Object.entries(e)) {
    const a = n[o];
    Array.isArray(a) && pe(i) ? r[o] = eh(a, i, s?.idFactory && (s.idKeyedFields === void 0 || s.idKeyedFields.has(o)) ? () => s.idFactory?.(o) : void 0) : r[o] = i;
  }
  return r;
}
function th(t, e) {
  if (!pe(t) || !pe(e)) return;
  for (const r of Object.keys(t)) if (!(r in e)) return;
  const s = {};
  for (const [r, o] of Object.entries(e)) (!(r in t) || !er(t[r], o)) && (s[r] = o);
  const n = Object.keys(s).length;
  if (!(n === 0 || n === Object.keys(e).length))
    return s;
}
const sh = (t) => {
  if (!t || typeof t != "object") return;
  const e = t;
  return e.type === "tool-call" ? e : void 0;
}, nh = (t, e) => {
  if (!t.args || typeof t.args != "object") return !1;
  const s = pe(t.result) ? t.result : void 0;
  if (s?.success === !1) return !1;
  if (typeof s?.id == "string") return s.id === e;
  const n = t.args.id;
  return n === e || n === void 0;
}, rh = (t) => {
  const e = pe(t) ? t.addedItemIds : void 0;
  if (!pe(e)) return;
  const s = /* @__PURE__ */ new Map();
  for (const [n, r] of Object.entries(e)) {
    if (!Array.isArray(r)) continue;
    const o = r.filter((i) => typeof i == "string");
    o.length > 0 && s.set(n, o);
  }
  if (s.size !== 0)
    return (n) => s.get(n)?.shift();
}, kr = /* @__PURE__ */ new WeakMap();
function oh(t, e, s) {
  let n = kr.get(t);
  n || (n = /* @__PURE__ */ new Map(), kr.set(t, n));
  let r = n.get(s);
  r || (r = /* @__PURE__ */ new Map(), n.set(s, r));
  const o = r.get(e);
  if (o) return o;
  const i = Kd(s), a = [], c = () => a[a.length - 1];
  for (const l of t) {
    if (l.role === "user") {
      const u = Zd(l)?.find((h) => h.id === e);
      if (!u) continue;
      if (u.partial) {
        const h = c();
        h && a.push({
          state: Ls(h.state, u.state),
          origin: "user-edit"
        });
      } else a.push({
        state: u.state,
        origin: "user-edit"
      });
      continue;
    }
    if (l.role === "assistant")
      for (const u of l.content ?? []) {
        const h = sh(u);
        if (h) {
          if (h.toolCallId === e && h.toolName === s)
            h.args && typeof h.args == "object" && a.push({
              state: h.args,
              origin: "create",
              toolCallId: e
            });
          else if (h.toolName === i && nh(h, e)) {
            const d = c();
            if (d) {
              const { id: f, ...p } = h.args, v = rh(h.result);
              a.push({
                state: v ? Ls(d.state, p, { idFactory: v }) : Ls(d.state, p),
                origin: "update",
                toolCallId: h.toolCallId
              });
            }
          }
        }
      }
  }
  return r.set(e, a), a;
}
function ih(t, e, s) {
  const n = oh(t, e, s), r = n[n.length - 1];
  return r ? { state: r.state } : void 0;
}
function Bi(t, e) {
  if (!t) return;
  const { interactables: s, ...n } = t, r = { ...n };
  if (Array.isArray(s)) {
    const o = [];
    for (const i of s) {
      const a = ih(e, i.id, i.name);
      if (!a) {
        o.push({
          id: i.id,
          name: i.name,
          state: i.state
        });
        continue;
      }
      if (er(i.state, a.state)) continue;
      const c = th(a.state, i.state);
      o.push(c ? {
        id: i.id,
        name: i.name,
        state: c,
        partial: !0
      } : {
        id: i.id,
        name: i.name,
        state: i.state
      });
    }
    o.length && (r.interactables = o);
  }
  return Object.keys(r).length ? r : void 0;
}
const tr = () => {
  let t, e;
  const s = new Promise((n, r) => {
    t = n, e = r;
  });
  if (!t || !e) throw new Error("Failed to create promise");
  return {
    promise: s,
    resolve: t,
    reject: e
  };
}, ah = () => {
  const t = [];
  let e = !1, s = !1, n = !1, r, o;
  const i = () => {
    t.forEach((c) => {
      c.reader.cancel().catch(() => {
      });
    }), t.length = 0;
  }, a = (c) => {
    c.promise || (c.promise = c.reader.read().then(({ done: l, value: u }) => {
      c.promise = void 0, !(s || n) && (l ? (t.splice(t.indexOf(c), 1), e && t.length === 0 && r.close()) : r.enqueue(u), o?.resolve(), o = void 0);
    }).catch((l) => {
      s || n || (n = !0, console.error(l), i(), r.error(l), o?.reject(l), o = void 0);
    }));
  };
  return {
    readable: new ReadableStream({
      start(c) {
        r = c;
      },
      pull() {
        return o = tr(), t.forEach((c) => {
          a(c);
        }), o.promise;
      },
      cancel() {
        s = !0, i(), o?.resolve(), o = void 0;
      }
    }),
    isSealed() {
      return e;
    },
    isCancelled() {
      return s;
    },
    isErrored() {
      return n;
    },
    seal() {
      s || n || (e = !0, t.length === 0 && r.close());
    },
    addStream(c) {
      if (s || n) {
        c.cancel().catch(() => {
        });
        return;
      }
      if (e) throw new Error("Cannot add streams after the run callback has settled.");
      const l = { reader: c.getReader() };
      t.push(l), a(l);
    },
    enqueue(c) {
      this.addStream(new ReadableStream({ start(l) {
        l.enqueue(c), l.close();
      } }));
    }
  };
};
var Pr = class {
  _controller;
  _strict;
  _isClosed = !1;
  _warnedDropped = !1;
  constructor(t, e = {}) {
    this._controller = t, this._strict = e.strict ?? !0;
  }
  append(t) {
    const e = {
      type: "text-delta",
      path: [],
      textDelta: t
    };
    if (this._strict)
      return this._controller.enqueue(e), this;
    try {
      this._controller.enqueue(e);
    } catch (s) {
      this._warnedDropped || (this._warnedDropped = !0, console.error(`Dropped text delta for closed stream: ${String(s)}`));
    }
    return this;
  }
  close() {
    this._isClosed || (this._isClosed = !0, this._controller.enqueue({
      type: "part-finish",
      path: []
    }), this._controller.close());
  }
};
const Fi = (t, e = {}) => new ReadableStream({
  start(s) {
    return t.start?.(new Pr(s, e));
  },
  pull(s) {
    return t.pull?.(new Pr(s, e));
  },
  cancel(s) {
    return t.cancel?.(s);
  }
}), $r = (t = {}) => {
  let e;
  return [Fi({ start(s) {
    e = s;
  } }, t), e];
}, Nr = /* @__PURE__ */ Symbol.for("aui.tool-response"), rn = "<no result>";
var Be = class on {
  get [Nr]() {
    return !0;
  }
  artifact;
  result;
  isError;
  modelContent;
  messages;
  constructor(e) {
    e.artifact !== void 0 && (this.artifact = e.artifact);
    const s = e.result;
    this.result = s === void 0 ? rn : s, this.isError = e.isError ?? !1, e.modelContent !== void 0 && (this.modelContent = e.modelContent), e.messages !== void 0 && (this.messages = e.messages);
  }
  static [Symbol.hasInstance](e) {
    return typeof e == "object" && e !== null && Nr in e;
  }
  /**
  * Converts a plain tool return value into a {@link ToolResponse}.
  *
  * Existing `ToolResponse` instances are returned unchanged. `undefined`
  * becomes the string `"<no result>"` so downstream protocol chunks always
  * carry a concrete result.
  */
  static toResponse(e) {
    return e instanceof on ? e : new on({ result: e === void 0 ? rn : e });
  }
}, Or = class {
  _isClosed = !1;
  _mergeTask;
  _controller;
  constructor(t) {
    this._controller = t;
    const e = Fi({ start: (n) => {
      this._argsTextController = n;
    } });
    let s = !1;
    this._mergeTask = e.pipeTo(new WritableStream({ write: (n) => {
      switch (n.type) {
        case "text-delta":
          s = !0, this._controller.enqueue(n);
          break;
        case "part-finish":
          s || this._controller.enqueue({
            type: "text-delta",
            textDelta: "{}",
            path: []
          }), this._controller.enqueue({
            type: "tool-call-args-text-finish",
            path: []
          });
          break;
        default:
          throw new Error(`Unexpected chunk type: ${n.type}`);
      }
    } }));
  }
  get argsText() {
    return this._argsTextController;
  }
  _argsTextController;
  async setResponse(t) {
    if (this._isClosed) return;
    const e = t.result;
    this._controller.enqueue({
      type: "result",
      path: [],
      ...t.artifact !== void 0 ? { artifact: t.artifact } : {},
      result: e === void 0 ? rn : e,
      isError: t.isError ?? !1,
      ...t.modelContent !== void 0 ? { modelContent: t.modelContent } : {},
      ...t.messages !== void 0 ? { messages: t.messages } : {}
    }), await this.close();
  }
  async close() {
    this._isClosed || (this._isClosed = !0, this._argsTextController.close(), await this._mergeTask, this._controller.enqueue({
      type: "part-finish",
      path: []
    }), this._controller.close());
  }
};
const ch = (t) => new ReadableStream({
  start(e) {
    return t.start?.(new Or(e));
  },
  pull(e) {
    return t.pull?.(new Or(e));
  },
  cancel(e) {
    return t.cancel?.(e);
  }
}), lh = () => {
  let t;
  return [ch({ start(e) {
    t = e;
  } }), t];
};
var Li = class {
  value = -1;
  up() {
    return ++this.value;
  }
}, uh = class extends TransformStream {
  constructor(t) {
    super({ transform(e, s) {
      s.enqueue({
        ...e,
        path: [t, ...e.path]
      });
    } });
  }
};
(class extends TransformStream {
  constructor(t) {
    super({ transform(e, s) {
      const { path: [n, ...r] } = e;
      if (t !== n) throw new Error(`Path mismatch: expected ${t}, got ${n}`);
      s.enqueue({
        ...e,
        path: r
      });
    } });
  }
});
var dh = class extends TransformStream {
  constructor(t) {
    const e = new Li(), s = /* @__PURE__ */ new Map();
    super({ transform(n, r) {
      n.type === "part-start" && n.path.length === 0 && s.set(e.up(), t.up());
      const [o, ...i] = n.path;
      if (o === void 0) {
        r.enqueue(n);
        return;
      }
      const a = s.get(o);
      if (a === void 0) throw new Error("Path not found");
      r.enqueue({
        ...n,
        path: [a, ...i]
      });
    } });
  }
}, hh = class extends TransformStream {
  constructor(t) {
    super();
    const e = t(super.readable);
    Object.defineProperty(this, "readable", {
      value: e,
      writable: !1
    });
  }
}, Ye = { exports: {} }, Br;
function mh() {
  if (Br) return Ye.exports;
  Br = 1;
  const t = typeof Buffer < "u", e = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/, s = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
  function n(a, c, l) {
    l == null && c !== null && typeof c == "object" && (l = c, c = void 0), t && Buffer.isBuffer(a) && (a = a.toString()), a && a.charCodeAt(0) === 65279 && (a = a.slice(1));
    const u = JSON.parse(a, c);
    if (u === null || typeof u != "object")
      return u;
    const h = l && l.protoAction || "error", d = l && l.constructorAction || "error";
    if (h === "ignore" && d === "ignore")
      return u;
    if (h !== "ignore" && d !== "ignore") {
      if (e.test(a) === !1 && s.test(a) === !1)
        return u;
    } else if (h !== "ignore" && d === "ignore") {
      if (e.test(a) === !1)
        return u;
    } else if (s.test(a) === !1)
      return u;
    return r(u, { protoAction: h, constructorAction: d, safe: l && l.safe });
  }
  function r(a, { protoAction: c = "error", constructorAction: l = "error", safe: u } = {}) {
    let h = [a];
    for (; h.length; ) {
      const d = h;
      h = [];
      for (const f of d) {
        if (c !== "ignore" && Object.prototype.hasOwnProperty.call(f, "__proto__")) {
          if (u === !0)
            return null;
          if (c === "error")
            throw new SyntaxError("Object contains forbidden prototype property");
          delete f.__proto__;
        }
        if (l !== "ignore" && Object.prototype.hasOwnProperty.call(f, "constructor") && f.constructor !== null && typeof f.constructor == "object" && Object.prototype.hasOwnProperty.call(f.constructor, "prototype")) {
          if (u === !0)
            return null;
          if (l === "error")
            throw new SyntaxError("Object contains forbidden prototype property");
          delete f.constructor;
        }
        for (const p in f) {
          const v = f[p];
          v && typeof v == "object" && h.push(v);
        }
      }
    }
    return a;
  }
  function o(a, c, l) {
    const { stackTraceLimit: u } = Error;
    Error.stackTraceLimit = 0;
    try {
      return n(a, c, l);
    } finally {
      Error.stackTraceLimit = u;
    }
  }
  function i(a, c) {
    const { stackTraceLimit: l } = Error;
    Error.stackTraceLimit = 0;
    try {
      return n(a, c, { safe: !0 });
    } catch {
      return;
    } finally {
      Error.stackTraceLimit = l;
    }
  }
  return Ye.exports = o, Ye.exports.default = o, Ye.exports.parse = o, Ye.exports.safeParse = i, Ye.exports.scan = r, Ye.exports;
}
var fh = mh();
const an = /* @__PURE__ */ pc(fh);
var Vi = class extends TransformStream {
  constructor() {
    const t = [];
    super({ transform(e, s) {
      if (e.type === "part-start") {
        if (e.path.length !== 0) {
          s.error(/* @__PURE__ */ new Error("Nested parts are not supported"));
          return;
        }
        t.push(e.part), s.enqueue(e);
        return;
      }
      if (e.type === "text-delta" || e.type === "result" || e.type === "part-finish" || e.type === "tool-call-args-text-finish") {
        if (e.path.length !== 1) {
          s.error(/* @__PURE__ */ new Error(`${e.type} chunks must have a path of length 1`));
          return;
        }
        const n = e.path[0];
        if (n < 0 || n >= t.length) {
          s.error(/* @__PURE__ */ new Error(`Invalid path index: ${n}`));
          return;
        }
        const r = t[n];
        s.enqueue({
          ...e,
          meta: r
        });
        return;
      }
      s.enqueue(e);
    } });
  }
};
let ji = (t, e = 21) => (s = e) => {
  let n = "", r = s | 0;
  for (; r-- > 0; )
    n += t[Math.random() * t.length | 0];
  return n;
};
const ph = ji("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);
var gh = class qi {
  _state;
  _parentId;
  constructor(e, s = {}) {
    this._state = e || {
      strict: s.strict ?? !0,
      merger: ah(),
      contentCounter: new Li()
    };
  }
  get __internal_isClosed() {
    return this._state.merger.isSealed() || this._state.merger.isCancelled() || this._state.merger.isErrored();
  }
  get __internal_isCancelled() {
    return this._state.merger.isCancelled();
  }
  __internal_getReadable() {
    return this._state.merger.readable;
  }
  __internal_subscribeToClose(e) {
    this._state.closeSubscriber = e;
  }
  _addPart(e, s) {
    this._state.append && (this._state.append.controller.close(), this._state.append = void 0), this.enqueue({
      type: "part-start",
      part: e,
      path: []
    }), this._state.merger.addStream(s.pipeThrough(new uh(this._state.contentCounter.value)));
  }
  merge(e) {
    this._state.merger.addStream(e.pipeThrough(new dh(this._state.contentCounter)));
  }
  appendText(e) {
    (this._state.append?.kind !== "text" || this._state.append.parentId !== this._parentId) && (this._state.append = {
      kind: "text",
      parentId: this._parentId,
      controller: this.addTextPart()
    }), this._state.append.controller.append(e);
  }
  appendReasoning(e, s) {
    (s !== void 0 || this._state.append?.kind !== "reasoning" || this._state.append.parentId !== this._parentId) && (this._state.append = {
      kind: "reasoning",
      parentId: this._parentId,
      controller: this.addReasoningPart(s)
    }), !(s !== void 0 && e.length === 0) && this._state.append.controller.append(e);
  }
  addTextPart() {
    const [e, s] = $r({ strict: this._state.strict });
    return this._addPart(this._withParentIdOption({ type: "text" }), e), s;
  }
  addReasoningPart(e) {
    const [s, n] = $r({ strict: this._state.strict });
    return this._addPart(this._withParentIdOption({
      type: "reasoning",
      ...e
    }), s), n;
  }
  addToolCallPart(e) {
    const s = typeof e == "string" ? { toolName: e } : e, n = s.toolName, r = s.toolCallId ?? ph(), [o, i] = lh();
    return this._addPart({
      type: "tool-call",
      toolName: n,
      toolCallId: r,
      ...this._parentId && { parentId: this._parentId }
    }, o), s.argsText !== void 0 && (i.argsText.append(s.argsText), i.argsText.close()), s.args !== void 0 && (i.argsText.append(JSON.stringify(s.args)), i.argsText.close()), s.response !== void 0 && i.setResponse(s.response), i;
  }
  _finishedPartStream() {
    return new ReadableStream({ start(e) {
      e.enqueue({
        type: "part-finish",
        path: []
      }), e.close();
    } });
  }
  _withParentIdOption(e) {
    return this._parentId ? {
      ...e,
      parentId: this._parentId
    } : e;
  }
  appendSource(e) {
    this._addPart(this._withParentIdOption(e), this._finishedPartStream());
  }
  appendFile(e) {
    this._addPart(this._withParentIdOption(e), this._finishedPartStream());
  }
  appendData(e) {
    this._addPart(this._withParentIdOption(e), this._finishedPartStream());
  }
  enqueue(e) {
    this._state.merger.enqueue(e), e.type === "part-start" && e.path.length === 0 && this._state.contentCounter.up();
  }
  withParentId(e) {
    const s = new qi(this._state);
    return s._parentId = e, s;
  }
  close() {
    this._state.append?.controller?.close(), this._state.merger.seal(), this._state.closeSubscriber?.();
  }
};
function bh(t, e = {}) {
  const s = new gh(void 0, e);
  return (async () => {
    try {
      await t(s);
    } catch (r) {
      s.__internal_isClosed ? s.__internal_isCancelled || console.error(r) : s.enqueue({
        type: "error",
        path: [],
        error: String(r)
      });
    } finally {
      s.__internal_isClosed || s.close();
    }
  })(), s.__internal_getReadable();
}
function _h(t = {}) {
  const { resolve: e, promise: s } = tr();
  let n;
  return [bh((r) => (n = r, n.__internal_subscribeToClose(e), s), t), n];
}
function vh(t) {
  const e = ["ROOT"];
  let s = -1, n = null;
  const r = [];
  let o;
  function i() {
    o !== void 0 && (r.push(JSON.parse(`"${o}"`)), o = void 0);
  }
  function a(h, d, f) {
    switch (h) {
      case '"':
        s = d, e.pop(), e.push(f), e.push("INSIDE_STRING"), i();
        break;
      case "f":
      case "t":
      case "n":
        s = d, n = d, e.pop(), e.push(f), e.push("INSIDE_LITERAL");
        break;
      case "-":
        e.pop(), e.push(f), e.push("INSIDE_NUMBER"), i();
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        s = d, e.pop(), e.push(f), e.push("INSIDE_NUMBER"), i();
        break;
      case "{":
        s = d, e.pop(), e.push(f), e.push("INSIDE_OBJECT_START"), i();
        break;
      case "[":
        s = d, e.pop(), e.push(f), e.push("INSIDE_ARRAY_START"), i();
    }
  }
  function c(h, d) {
    switch (h) {
      case ",":
        e.pop(), e.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      case "}":
        s = d, e.pop(), o = r.pop();
    }
  }
  function l(h, d) {
    switch (h) {
      case ",":
        e.pop(), e.push("INSIDE_ARRAY_AFTER_COMMA"), o = (Number(o) + 1).toString();
        break;
      case "]":
        s = d, e.pop(), o = r.pop();
    }
  }
  for (let h = 0; h < t.length; h++) {
    const d = t[h];
    switch (e[e.length - 1]) {
      case "ROOT":
        a(d, h, "FINISH");
        break;
      case "INSIDE_OBJECT_START":
        switch (d) {
          case '"':
            e.pop(), e.push("INSIDE_OBJECT_KEY"), o = "";
            break;
          case "}":
            s = h, e.pop(), o = r.pop();
        }
        break;
      case "INSIDE_OBJECT_AFTER_COMMA":
        d === '"' && (e.pop(), e.push("INSIDE_OBJECT_KEY"), o = "");
        break;
      case "INSIDE_OBJECT_KEY":
        switch (d) {
          case '"':
            e.pop(), e.push("INSIDE_OBJECT_AFTER_KEY");
            break;
          case "\\":
            e.push("INSIDE_STRING_ESCAPE"), o += d;
            break;
          default:
            o += d;
        }
        break;
      case "INSIDE_OBJECT_AFTER_KEY":
        d === ":" && (e.pop(), e.push("INSIDE_OBJECT_BEFORE_VALUE"));
        break;
      case "INSIDE_OBJECT_BEFORE_VALUE":
        a(d, h, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      case "INSIDE_OBJECT_AFTER_VALUE":
        c(d, h);
        break;
      case "INSIDE_STRING":
        switch (d) {
          case '"':
            e.pop(), s = h, o = r.pop();
            break;
          case "\\":
            e.push("INSIDE_STRING_ESCAPE");
            break;
          default:
            s = h;
        }
        break;
      case "INSIDE_ARRAY_START":
        d === "]" ? (s = h, e.pop(), o = r.pop()) : (s = h, o = "0", a(d, h, "INSIDE_ARRAY_AFTER_VALUE"));
        break;
      case "INSIDE_ARRAY_AFTER_VALUE":
        switch (d) {
          case ",":
            e.pop(), e.push("INSIDE_ARRAY_AFTER_COMMA"), o = (Number(o) + 1).toString();
            break;
          case "]":
            s = h, e.pop(), o = r.pop();
            break;
          default:
            s = h;
        }
        break;
      case "INSIDE_ARRAY_AFTER_COMMA":
        a(d, h, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      case "INSIDE_STRING_ESCAPE":
        e.pop(), e[e.length - 1] === "INSIDE_STRING" ? s = h : e[e.length - 1] === "INSIDE_OBJECT_KEY" && (o += d);
        break;
      case "INSIDE_NUMBER":
        switch (d) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            s = h;
            break;
          case "e":
          case "E":
          case "-":
          case ".":
            break;
          case ",":
            e.pop(), o = r.pop(), e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && l(d, h), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && c(d, h);
            break;
          case "}":
            e.pop(), o = r.pop(), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && c(d, h);
            break;
          case "]":
            e.pop(), o = r.pop(), e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && l(d, h);
            break;
          default:
            e.pop(), o = r.pop();
        }
        break;
      case "INSIDE_LITERAL": {
        const f = t.substring(n, h + 1);
        !"false".startsWith(f) && !"true".startsWith(f) && !"null".startsWith(f) ? (e.pop(), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" ? c(d, h) : e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && l(d, h)) : s = h;
        break;
      }
    }
  }
  let u = t.slice(0, s + 1);
  for (let h = e.length - 1; h >= 0; h--) switch (e[h]) {
    case "INSIDE_STRING":
      u += '"';
      break;
    case "INSIDE_OBJECT_KEY":
    case "INSIDE_OBJECT_AFTER_KEY":
    case "INSIDE_OBJECT_AFTER_COMMA":
    case "INSIDE_OBJECT_START":
    case "INSIDE_OBJECT_BEFORE_VALUE":
    case "INSIDE_OBJECT_AFTER_VALUE":
      u += "}";
      break;
    case "INSIDE_ARRAY_START":
    case "INSIDE_ARRAY_AFTER_COMMA":
    case "INSIDE_ARRAY_AFTER_VALUE":
      u += "]";
      break;
    case "INSIDE_LITERAL": {
      const d = t.substring(n, t.length);
      "true".startsWith(d) ? u += "true".slice(d.length) : "false".startsWith(d) ? u += "false".slice(d.length) : "null".startsWith(d) && (u += "null".slice(d.length));
    }
  }
  return [u, r];
}
const cs = /* @__PURE__ */ Symbol("aui.parse-partial-json-object.meta"), yh = (t) => t?.[cs], cn = (t) => {
  if (t.length === 0) return { [cs]: {
    state: "partial",
    partialPath: []
  } };
  try {
    const e = an.parse(t);
    if (typeof e != "object" || e === null) throw new Error("argsText is expected to be an object");
    return e[cs] = {
      state: "complete",
      partialPath: []
    }, e;
  } catch {
    try {
      const [e, s] = vh(t), n = an.parse(e);
      if (typeof n != "object" || n === null) throw new Error("argsText is expected to be an object");
      return n[cs] = {
        state: "partial",
        partialPath: s
      }, n;
    } catch {
      return;
    }
  }
}, Ui = (t, e, s) => {
  if (typeof t != "object" || t === null) return e.state;
  if (e.state === "complete") return "complete";
  if (s.length === 0) return e.state;
  const [n, ...r] = s;
  if (!Object.hasOwn(t, n)) return "partial";
  const [o, ...i] = e.partialPath;
  if (n !== o) return "complete";
  const a = t[n];
  return Ui(a, {
    state: "partial",
    partialPath: i
  }, r);
}, yt = (t, e) => {
  const s = yh(t);
  if (!s) throw new Error("unable to determine object state");
  return Ui(t, s, e.map(String));
};
async function* wh() {
  const t = this.getReader();
  let e = !0;
  try {
    for (; ; ) {
      let s;
      try {
        s = await t.read();
      } catch (r) {
        throw e = !1, r;
      }
      if (s.done) {
        e = !1;
        break;
      }
      const { value: n } = s;
      yield n;
    }
  } finally {
    try {
      e && await t.cancel();
    } finally {
      t.releaseLock();
    }
  }
}
function Vs(t) {
  return t[Symbol.asyncIterator] ??= wh, t;
}
function Sh(t, e, s) {
  try {
    const n = t();
    if (typeof n == "object" && n !== null && "then" in n) return n.then(e, s);
    e(n);
  } catch (n) {
    s(n);
  }
}
function wt(t, e) {
  let s = t;
  for (const n of e) {
    if (s == null) return;
    s = s[n];
  }
  return s;
}
var xh = class {
  resolve;
  reject;
  disposed = !1;
  fieldPath;
  constructor(t, e, s) {
    this.resolve = t, this.reject = e, this.fieldPath = s;
  }
  update(t) {
    if (!this.disposed)
      try {
        if (yt(t, this.fieldPath) === "complete") {
          const e = wt(t, this.fieldPath);
          e !== void 0 && (this.resolve(e), this.dispose());
        }
      } catch (e) {
        this.reject(e), this.dispose();
      }
  }
  end(t) {
    if (!this.disposed)
      try {
        const e = wt(t, this.fieldPath);
        this.resolve(e);
      } catch (e) {
        this.reject(e);
      } finally {
        this.dispose();
      }
  }
  dispose() {
    this.disposed = !0;
  }
}, Ih = class {
  controller;
  disposed = !1;
  fieldPath;
  constructor(t, e) {
    this.controller = t, this.fieldPath = e;
  }
  update(t) {
    if (!this.disposed)
      try {
        const e = wt(t, this.fieldPath);
        e !== void 0 && this.controller.enqueue(e), yt(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
      } catch (e) {
        this.controller.error(e), this.dispose();
      }
  }
  end() {
    this.disposed || (this.controller.close(), this.dispose());
  }
  dispose() {
    this.disposed = !0;
  }
}, Th = class {
  controller;
  disposed = !1;
  fieldPath;
  lastValue = void 0;
  constructor(t, e) {
    this.controller = t, this.fieldPath = e;
  }
  update(t) {
    if (!this.disposed)
      try {
        const e = wt(t, this.fieldPath);
        if (e !== void 0 && typeof e == "string") {
          const s = e.substring(this.lastValue?.length || 0);
          this.lastValue = e, this.controller.enqueue(s);
        }
        yt(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
      } catch (e) {
        this.controller.error(e), this.dispose();
      }
  }
  end() {
    this.disposed || (this.controller.close(), this.dispose());
  }
  dispose() {
    this.disposed = !0;
  }
}, Ch = class {
  controller;
  disposed = !1;
  fieldPath;
  processedIndexes = /* @__PURE__ */ new Set();
  constructor(t, e) {
    this.controller = t, this.fieldPath = e;
  }
  update(t) {
    if (!this.disposed)
      try {
        const e = wt(t, this.fieldPath);
        if (!Array.isArray(e)) return;
        for (let s = 0; s < e.length; s++) if (!this.processedIndexes.has(s)) {
          const n = [...this.fieldPath, s];
          yt(t, n) === "complete" && (this.controller.enqueue(e[s]), this.processedIndexes.add(s));
        }
        yt(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
      } catch (e) {
        this.controller.error(e), this.dispose();
      }
  }
  end() {
    this.disposed || (this.controller.close(), this.dispose());
  }
  dispose() {
    this.disposed = !0;
  }
}, Eh = class {
  argTextDeltas;
  handles = /* @__PURE__ */ new Set();
  args = cn("");
  finished = !1;
  constructor(t) {
    this.argTextDeltas = t, this.processStream();
  }
  async processStream() {
    try {
      let t = "";
      const e = this.argTextDeltas.getReader();
      for (; ; ) {
        const { value: s, done: n } = await e.read();
        if (n) break;
        t += s;
        const r = cn(t);
        if (r !== void 0) {
          this.args = r;
          for (const o of this.handles) o.update(r);
        }
      }
    } catch (t) {
      console.error("Error processing argument stream:", t);
    } finally {
      this.finished = !0;
      for (const t of this.handles) t.end(this.args);
      this.handles.clear();
    }
  }
  get(...t) {
    return new Promise((e, s) => {
      const n = new xh(e, s, t);
      if (this.args && yt(this.args, t) === "complete") {
        const r = wt(this.args, t);
        if (r !== void 0) {
          e(r);
          return;
        }
      }
      if (this.finished) {
        n.end(this.args);
        return;
      }
      this.handles.add(n), n.update(this.args);
    });
  }
  streamValues(...t) {
    const e = t;
    let s;
    const n = new ReadableStream({
      start: (r) => {
        s = new Ih(r, e), this.finished || this.handles.add(s), s.update(this.args), this.finished && s.end();
      },
      cancel: () => {
        s && (s.dispose(), this.handles.delete(s));
      }
    });
    return Vs(n);
  }
  streamText(...t) {
    const e = t;
    let s;
    const n = new ReadableStream({
      start: (r) => {
        s = new Th(r, e), this.finished || this.handles.add(s), s.update(this.args), this.finished && s.end();
      },
      cancel: () => {
        s && (s.dispose(), this.handles.delete(s));
      }
    });
    return Vs(n);
  }
  forEach(...t) {
    const e = t;
    let s;
    const n = new ReadableStream({
      start: (r) => {
        s = new Ch(r, e), this.finished || this.handles.add(s), s.update(this.args), this.finished && s.end();
      },
      cancel: () => {
        s && (s.dispose(), this.handles.delete(s));
      }
    });
    return Vs(n);
  }
}, Rh = class {
  promise;
  constructor(t) {
    this.promise = t;
  }
  get() {
    return this.promise;
  }
}, Ah = class {
  args;
  response;
  writable;
  resolve;
  argsText = "";
  constructor() {
    const t = new TransformStream();
    this.writable = t.writable, this.args = new Eh(t.readable);
    const { promise: e, resolve: s } = tr();
    this.resolve = s, this.response = new Rh(e);
  }
  async appendArgsTextDelta(t) {
    const e = this.writable.getWriter();
    try {
      await e.write(t);
    } catch (s) {
      console.warn(s);
    } finally {
      e.releaseLock();
    }
    this.argsText += t;
  }
  async finishArgsText() {
    const t = this.writable.getWriter();
    try {
      await t.close();
    } catch (e) {
      console.warn(e);
    } finally {
      t.releaseLock();
    }
  }
  setResponse(t) {
    this.resolve(t);
  }
  result = { get: async () => (await this.response.get()).result };
};
const js = (t, e, s, n) => {
  try {
    const r = e?.(s, n);
    Promise.resolve(r).catch((o) => {
      console.error(`[assistant-stream] ${t} callback threw an error`, o);
    });
  } catch (r) {
    console.error(`[assistant-stream] ${t} callback threw an error`, r);
  }
}, qs = (t, e) => {
  try {
    t.enqueue(e);
  } catch (s) {
    if (!(s instanceof TypeError)) throw s;
  }
};
var Mh = class extends hh {
  constructor(t) {
    const e = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
    super((r) => {
      const o = new TransformStream({
        async transform(i, a) {
          switch ((i.type !== "part-finish" || i.meta.type !== "tool-call") && a.enqueue(i), i.type) {
            case "part-start":
              if (i.part.type === "tool-call") {
                const c = new Ah();
                s.set(i.part.toolCallId, c), t.streamCall({
                  reader: c,
                  toolCallId: i.part.toolCallId,
                  toolName: i.part.toolName
                });
              }
              break;
            case "text-delta":
              if (i.meta.type === "tool-call") {
                const c = i.meta.toolCallId, l = s.get(c);
                if (!l) throw new Error("No controller found for tool call");
                await l.appendArgsTextDelta(i.textDelta);
              }
              break;
            case "result": {
              if (i.meta.type !== "tool-call") break;
              const { toolCallId: c } = i.meta, l = s.get(c);
              if (!l) throw new Error("No controller found for tool call");
              l.setResponse(new Be({
                result: i.result,
                artifact: i.artifact,
                isError: i.isError,
                modelContent: i.modelContent
              })), n.add(c);
              break;
            }
            case "tool-call-args-text-finish": {
              if (i.meta.type !== "tool-call") break;
              const { toolCallId: c, toolName: l } = i.meta, u = s.get(c);
              if (!u) throw new Error("No controller found for tool call");
              if (await u.finishArgsText(), n.has(c)) break;
              let h = !1;
              const d = Sh(() => {
                let f;
                try {
                  f = an.parse(u.argsText);
                } catch (v) {
                  throw new Error(`Function parameter parsing failed. ${JSON.stringify(v.message)}`);
                }
                const p = t.execute({
                  toolCallId: c,
                  toolName: l,
                  args: f
                });
                return p !== void 0 && (h = !0, js("onExecutionStart", t.onExecutionStart, c, l)), p;
              }, (f) => {
                if (h && js("onExecutionEnd", t.onExecutionEnd, c, l), f === void 0) return;
                const p = new Be({
                  artifact: f.artifact,
                  result: f.result,
                  isError: f.isError,
                  messages: f.messages,
                  modelContent: f.modelContent
                });
                u.setResponse(p), qs(a, {
                  type: "result",
                  path: i.path,
                  ...p
                });
              }, (f) => {
                h && js("onExecutionEnd", t.onExecutionEnd, c, l);
                const p = new Be({
                  result: String(f),
                  isError: !0
                });
                u.setResponse(p), qs(a, {
                  type: "result",
                  path: i.path,
                  ...p
                });
              });
              d && e.set(c, d);
              break;
            }
            case "part-finish": {
              if (i.meta.type !== "tool-call") break;
              const { toolCallId: c } = i.meta, l = e.get(c);
              l ? l.then(() => {
                e.delete(c), s.delete(c), n.delete(c), qs(a, i);
              }) : (s.delete(c), n.delete(c), a.enqueue(i));
            }
          }
        },
        async flush() {
          await Promise.all(e.values());
        }
      });
      return r.pipeThrough(new Vi()).pipeThrough(o);
    });
  }
};
const Dh = (t) => typeof t == "object" && t !== null && "~standard" in t && t["~standard"].version === 1;
function kh(t, e, s, n) {
  const r = t?.[s.toolName];
  return r?.execute ? (async (i) => {
    if (e.aborted) return new Be({
      result: "Tool execution was cancelled.",
      isError: !0
    });
    let a = i;
    if (Dh(r.parameters)) {
      let h = r.parameters["~standard"].validate(s.args);
      h instanceof Promise && (h = await h), h.issues && (a = r.experimental_onSchemaValidationError ?? (() => {
        throw new Error(`Function parameter validation failed. ${JSON.stringify(h.issues)}`);
      }));
    }
    let c;
    const l = new Promise((h) => {
      c = () => {
        queueMicrotask(() => {
          queueMicrotask(() => {
            h(new Be({
              result: "Tool execution was cancelled.",
              isError: !0
            }));
          });
        });
      }, e.aborted ? c() : e.addEventListener("abort", c, { once: !0 });
    }), u = (async () => {
      const h = await a(s.args, {
        toolCallId: s.toolCallId,
        abortSignal: e,
        human: (f) => n(s.toolCallId, f)
      }), d = Be.toResponse(h);
      if (r.toModelOutput && !d.isError && d.modelContent === void 0) try {
        const f = await r.toModelOutput({
          toolCallId: s.toolCallId,
          input: s.args,
          output: d.result
        });
        return new Be({
          result: d.result,
          artifact: d.artifact,
          isError: d.isError,
          messages: d.messages,
          modelContent: f
        });
      } catch (f) {
        console.warn(`[assistant-stream] tool "${s.toolName}" toModelOutput threw; falling back to default projection.`, f);
      }
      return d;
    })();
    try {
      return await Promise.race([u, l]);
    } finally {
      e.removeEventListener("abort", c);
    }
  })(r.execute) : void 0;
}
function Ph(t, e, s, n, r) {
  t?.[n.toolName]?.streamCall?.(s, {
    toolCallId: n.toolCallId,
    abortSignal: e,
    human: (o) => r(n.toolCallId, o)
  });
}
function $h(t, e, s, n) {
  const r = typeof t == "function" ? t : () => t, o = typeof e == "function" ? e : () => e;
  return new Mh({
    execute: (i) => kh(r(), o(), i, s),
    streamCall: ({ reader: i, ...a }) => Ph(r(), o(), i, a, s),
    onExecutionStart: n?.onExecutionStart,
    onExecutionEnd: n?.onExecutionEnd
  });
}
const nt = ji("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7), zi = (t) => {
  const e = w(7), { index: s, children: n } = t;
  let r;
  e[0] !== s ? (r = Pe({
    source: "message",
    query: {
      type: "index",
      index: s
    },
    get: (c) => c.message().attachment({ index: s })
  }), e[0] = s, e[1] = r) : r = e[1];
  let o;
  e[2] !== r ? (o = { attachment: r }, e[2] = r, e[3] = o) : o = e[3];
  const i = oe(o);
  let a;
  return e[4] !== i || e[5] !== n ? (a = /* @__PURE__ */ m(Fe, {
    value: i,
    children: n
  }), e[4] = i, e[5] = n, e[6] = a) : a = e[6], a;
}, Hi = (t) => {
  const e = w(10), { index: s, children: n } = t;
  let r;
  e[0] !== s ? (r = Pe({
    source: "thread",
    query: {
      type: "index",
      index: s
    },
    get: (l) => l.thread().message({ index: s })
  }), e[0] = s, e[1] = r) : r = e[1];
  let o;
  e[2] !== s ? (o = Pe({
    source: "message",
    query: {},
    get: (l) => l.thread().message({ index: s }).composer()
  }), e[2] = s, e[3] = o) : o = e[3];
  let i;
  e[4] !== r || e[5] !== o ? (i = {
    message: r,
    composer: o
  }, e[4] = r, e[5] = o, e[6] = i) : i = e[6];
  const a = oe(i);
  let c;
  return e[7] !== a || e[8] !== n ? (c = /* @__PURE__ */ m(Fe, {
    value: a,
    children: n
  }), e[7] = a, e[8] = n, e[9] = c) : c = e[9], c;
}, sr = ({ index: t, children: e }) => {
  const s = he(() => ({
    index: t,
    current: null
  }), [t]);
  return /* @__PURE__ */ m(Fe, {
    value: oe({ part: Pe({
      source: "message",
      query: {
        type: "index",
        index: t
      },
      get: (n) => {
        const r = n.message();
        if (t >= r.getState().parts.length && s.current) return s.current;
        const o = r.part({ index: t });
        return s.current = o, o;
      }
    }) }),
    children: e
  });
}, Nh = (t) => {
  const e = w(7), { text: s, isRunning: n } = t;
  let r;
  e[0] !== n ? (r = n ? { type: "running" } : { type: "complete" }, e[0] = n, e[1] = r) : r = e[1];
  let o;
  e[2] !== r || e[3] !== s ? (o = {
    type: "text",
    text: s,
    status: r
  }, e[2] = r, e[3] = s, e[4] = o) : o = e[4];
  const i = o;
  let a;
  return e[5] !== i ? (a = {
    getState: () => i,
    addToolResult: Bh,
    resumeToolCall: Fh,
    respondToToolApproval: Lh
  }, e[5] = i, e[6] = a) : a = e[6], a;
}, Oh = ie(Nh), nr = (t) => {
  const e = w(8), { text: s, isRunning: n, children: r } = t, o = n === void 0 ? !1 : n;
  let i;
  e[0] !== o || e[1] !== s ? (i = Oh({
    text: s,
    isRunning: o
  }), e[0] = o, e[1] = s, e[2] = i) : i = e[2];
  let a;
  e[3] !== i ? (a = { part: i }, e[3] = i, e[4] = a) : a = e[4];
  const c = oe(a);
  let l;
  return e[5] !== c || e[6] !== r ? (l = /* @__PURE__ */ m(Fe, {
    value: c,
    children: r
  }), e[5] = c, e[6] = r, e[7] = l) : l = e[7], l;
};
function Bh() {
  throw new Error("Not supported");
}
function Fh() {
  throw new Error("Not supported");
}
function Lh() {
  throw new Error("Not supported");
}
const Vh = Object.freeze({ type: "complete" }), jh = (t) => {
  const e = w(9), { parts: s, getMessagePart: n } = t, [r, o] = ue(!0), i = s[s.length - 1]?.status ?? Vh;
  let a;
  e[0] !== r || e[1] !== s || e[2] !== i ? (a = {
    parts: s,
    collapsed: r,
    status: i
  }, e[0] = r, e[1] = s, e[2] = i, e[3] = a) : a = e[3];
  const c = a;
  let l;
  e[4] !== c ? (l = () => c, e[4] = c, e[5] = l) : l = e[5];
  let u;
  return e[6] !== n || e[7] !== l ? (u = {
    getState: l,
    setCollapsed: o,
    part: n
  }, e[6] = n, e[7] = l, e[8] = u) : u = e[8], u;
}, qh = ie(jh), Uh = (t) => {
  const e = w(5), { startIndex: s, endIndex: n, children: r } = t, o = M(zh).slice(s, n + 1), i = oe(), a = qh({
    parts: o,
    getMessagePart: (h) => {
      const { index: d } = h;
      if (d < 0 || d >= o.length) throw new Error(`ChainOfThought part index ${d} is out of bounds (0..${o.length - 1})`);
      return i.message().part({ index: s + d });
    }
  });
  let c;
  e[0] !== a ? (c = { chainOfThought: a }, e[0] = a, e[1] = c) : c = e[1];
  const l = oe(c);
  let u;
  return e[2] !== l || e[3] !== r ? (u = /* @__PURE__ */ m(Fe, {
    value: l,
    children: r
  }), e[2] = l, e[3] = r, e[4] = u) : u = e[4], u;
};
function zh(t) {
  return t.message.parts;
}
const Gi = (t) => {
  const e = w(7), { index: s, children: n } = t;
  let r;
  e[0] !== s ? (r = Pe({
    source: "suggestions",
    query: { index: s },
    get: (c) => c.suggestions().suggestion({ index: s })
  }), e[0] = s, e[1] = r) : r = e[1];
  let o;
  e[2] !== r ? (o = { suggestion: r }, e[2] = r, e[3] = o) : o = e[3];
  const i = oe(o);
  let a;
  return e[4] !== i || e[5] !== n ? (a = /* @__PURE__ */ m(Fe, {
    value: i,
    children: n
  }), e[4] = i, e[5] = n, e[6] = a) : a = e[6], a;
}, rt = /* @__PURE__ */ Symbol("innerMessage"), Us = /* @__PURE__ */ Symbol("innerMessages"), Hh = [], Gh = (t, e) => {
  rt in t || (t[rt] = e);
}, Wh = (t) => {
  const e = "messages" in t ? t.messages : t, s = e[Us] || e[rt];
  return s ? Array.isArray(s) ? s : (e[Us] = [s], e[Us]) : Hh;
}, Ms = (t, e, s) => {
  const n = (r) => {
    console.error(`[assistant-ui] ${s} listener threw an error`, r);
  };
  for (const r of t) try {
    const o = r(e);
    o !== null && (typeof o == "object" || typeof o == "function") && "then" in o && typeof o.then == "function" && Promise.resolve(o).catch(n);
  } catch (o) {
    n(o);
  }
}, Ae = /* @__PURE__ */ Symbol("skip-update");
function Yh(t, e) {
  if (t === void 0 && e === void 0) return !0;
  if (t === void 0 || e === void 0) return !1;
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length) return !1;
  for (const n of s) {
    const r = t[n], o = e[n];
    if (!Object.is(r, o)) return !1;
  }
  return !0;
}
var Jh = class {
  _subscribers = /* @__PURE__ */ new Set();
  subscribe(t) {
    return this._subscribers.add(t), () => this._subscribers.delete(t);
  }
  waitForUpdate() {
    return new Promise((t) => {
      const e = this.subscribe(() => {
        e(), t();
      });
    });
  }
  _notifySubscribers() {
    const t = [];
    for (const e of this._subscribers) try {
      e();
    } catch (s) {
      t.push(s);
    }
    if (t.length > 0) {
      if (t.length === 1) throw t[0];
      for (const e of t) console.error(e);
      throw new AggregateError(t);
    }
  }
}, Ds = class {
  _subscriptions = /* @__PURE__ */ new Set();
  _connection;
  get isConnected() {
    return !!this._connection;
  }
  notifySubscribers(t, e) {
    if (e) {
      Ms(this._subscriptions, t, e);
      return;
    }
    for (const s of this._subscriptions) s(t);
  }
  _updateConnection() {
    if (this._subscriptions.size > 0) {
      if (this._connection) return;
      this._connection = this._connect();
    } else
      this._connection?.(), this._connection = void 0;
  }
  subscribe(t) {
    return this._subscriptions.add(t), this._updateConnection(), () => {
      this._subscriptions.delete(t), this._updateConnection();
    };
  }
}, Re = class extends Ds {
  get path() {
    return this.binding.path;
  }
  binding;
  constructor(t) {
    super(), this.binding = t;
    const e = t.getState();
    if (e === Ae) throw new Error("Entry not available in the store");
    this._previousState = e;
  }
  _previousState;
  getState = () => (this.isConnected || this._syncState(), this._previousState);
  _syncState() {
    const t = this.binding.getState();
    return t === Ae || Yh(t, this._previousState) ? !1 : (this._previousState = t, !0);
  }
  _connect() {
    const t = () => {
      this._syncState() && this.notifySubscribers();
    };
    return this.binding.subscribe(t);
  }
}, rr = class extends Ds {
  get path() {
    return this.binding.path;
  }
  binding;
  constructor(t) {
    super(), this.binding = t;
  }
  _previousStateDirty = !0;
  _previousState;
  getState = () => {
    if (!this.isConnected || this._previousStateDirty) {
      const t = this.binding.getState();
      t !== Ae && (this._previousState = t), this._previousStateDirty = !1;
    }
    if (this._previousState === void 0) throw new Error("Entry not available in the store");
    return this._previousState;
  };
  _connect() {
    const t = () => {
      this._previousStateDirty = !0, this.notifySubscribers();
    };
    return this.binding.subscribe(t);
  }
}, _s = class extends Ds {
  get path() {
    return this.binding.path;
  }
  binding;
  constructor(t) {
    super(), this.binding = t;
  }
  getState() {
    return this.binding.getState();
  }
  outerSubscribe(t) {
    return this.binding.subscribe(t);
  }
  _connect() {
    const t = () => {
      this.notifySubscribers();
    };
    let e = this.binding.getState(), s = e?.subscribe(t);
    const n = () => {
      const o = this.binding.getState();
      o !== e && (e = o, s?.(), s = o?.subscribe(t), t());
    }, r = this.outerSubscribe(n);
    return () => {
      r?.(), s?.();
    };
  }
}, Wi = class extends Ds {
  config;
  constructor(t) {
    super(), this.config = t;
  }
  getState() {
    return this.config.binding.getState();
  }
  outerSubscribe(t) {
    return this.config.binding.subscribe(t);
  }
  _connect() {
    const t = `Runtime event "${this.config.event}"`, e = (i) => {
      this.notifySubscribers(i, t);
    };
    let s = this.config.binding.getState(), n = s?.unstable_on(this.config.event, e);
    const r = () => {
      const i = this.config.binding.getState();
      i !== s && (s = i, n?.(), n = i?.unstable_on(this.config.event, e));
    }, o = this.outerSubscribe(r);
    return () => {
      o?.(), n?.();
    };
  }
}, Yi = class {
  get path() {
    return this._core.path;
  }
  _core;
  constructor(t) {
    this._core = t, this.__internal_bindMethods();
  }
  __internal_bindMethods() {
    this.getState = this.getState.bind(this), this.remove = this.remove.bind(this), this.subscribe = this.subscribe.bind(this);
  }
  getState() {
    return this._core.getState();
  }
  subscribe(t) {
    return this._core.subscribe(t);
  }
}, Ji = class extends Yi {
  _composerApi;
  constructor(t, e) {
    super(t), this._composerApi = e;
  }
  remove() {
    const t = this._composerApi.getState();
    if (!t) throw new Error("Composer is not available");
    return t.removeAttachment(this.getState().id);
  }
}, Qh = class extends Ji {
  get source() {
    return "thread-composer";
  }
}, Xh = class extends Ji {
  get source() {
    return "edit-composer";
  }
}, Zh = class extends Yi {
  get source() {
    return "message";
  }
  remove() {
    throw new Error("Message attachments cannot be removed");
  }
};
const vs = Object.freeze([]), Qi = Object.freeze({}), Kh = (t) => Object.freeze({
  type: "thread",
  isEditing: t?.isEditing ?? !1,
  canCancel: t?.canCancel ?? !1,
  canSend: t?.canSend ?? !1,
  isEmpty: t?.isEmpty ?? !0,
  attachments: t?.attachments ?? vs,
  text: t?.text ?? "",
  role: t?.role ?? "user",
  runConfig: t?.runConfig ?? Qi,
  attachmentAccept: t?.attachmentAccept ?? "",
  dictation: t?.dictation,
  quote: t?.quote,
  queue: t?.queue ?? vs,
  value: t?.text ?? ""
}), em = (t) => Object.freeze({
  type: "edit",
  isEditing: t?.isEditing ?? !1,
  canCancel: t?.canCancel ?? !1,
  canSend: t?.canSend ?? !1,
  isEmpty: t?.isEmpty ?? !0,
  text: t?.text ?? "",
  role: t?.role ?? "user",
  attachments: t?.attachments ?? vs,
  runConfig: t?.runConfig ?? Qi,
  attachmentAccept: t?.attachmentAccept ?? "",
  dictation: t?.dictation,
  quote: t?.quote,
  queue: t?.queue ?? vs,
  parentId: t?.parentId ?? null,
  sourceId: t?.sourceId ?? null,
  value: t?.text ?? ""
});
var Xi = class {
  get path() {
    return this._core.path;
  }
  _core;
  constructor(t) {
    this._core = t;
  }
  __internal_bindMethods() {
    this.setText = this.setText.bind(this), this.setRunConfig = this.setRunConfig.bind(this), this.getState = this.getState.bind(this), this.subscribe = this.subscribe.bind(this), this.addAttachment = this.addAttachment.bind(this), this.reset = this.reset.bind(this), this.clearAttachments = this.clearAttachments.bind(this), this.send = this.send.bind(this), this.cancel = this.cancel.bind(this), this.steerQueueItem = this.steerQueueItem.bind(this), this.removeQueueItem = this.removeQueueItem.bind(this), this.setRole = this.setRole.bind(this), this.getAttachmentByIndex = this.getAttachmentByIndex.bind(this), this.startDictation = this.startDictation.bind(this), this.stopDictation = this.stopDictation.bind(this), this.setQuote = this.setQuote.bind(this), this.unstable_on = this.unstable_on.bind(this);
  }
  setText(t) {
    const e = this._core.getState();
    if (!e) throw new Error("Composer is not available");
    e.setText(t);
  }
  setRunConfig(t) {
    const e = this._core.getState();
    if (!e) throw new Error("Composer is not available");
    e.setRunConfig(t);
  }
  addAttachment(t) {
    const e = this._core.getState();
    if (!e) throw new Error("Composer is not available");
    return e.addAttachment(t);
  }
  reset() {
    const t = this._core.getState();
    if (!t) throw new Error("Composer is not available");
    return t.reset();
  }
  clearAttachments() {
    const t = this._core.getState();
    if (!t) throw new Error("Composer is not available");
    return t.clearAttachments();
  }
  send(t) {
    const e = this._core.getState();
    if (!e) throw new Error("Composer is not available");
    e.send(t);
  }
  cancel() {
    const t = this._core.getState();
    if (!t) throw new Error("Composer is not available");
    t.cancel();
  }
  steerQueueItem(t) {
    const e = this._core.getState();
    if (!e) throw new Error("Composer is not available");
    e.steerQueueItem(t);
  }
  removeQueueItem(t) {
    const e = this._core.getState();
    if (!e) throw new Error("Composer is not available");
    e.removeQueueItem(t);
  }
  setRole(t) {
    const e = this._core.getState();
    if (!e) throw new Error("Composer is not available");
    e.setRole(t);
  }
  startDictation() {
    const t = this._core.getState();
    if (!t) throw new Error("Composer is not available");
    t.startDictation();
  }
  stopDictation() {
    const t = this._core.getState();
    if (!t) throw new Error("Composer is not available");
    t.stopDictation();
  }
  setQuote(t) {
    const e = this._core.getState();
    if (!e) throw new Error("Composer is not available");
    e.setQuote(t);
  }
  subscribe(t) {
    return this._core.subscribe(t);
  }
  _eventSubscriptionSubjects = /* @__PURE__ */ new Map();
  unstable_on(t, e) {
    let s = this._eventSubscriptionSubjects.get(t);
    return s || (s = new Wi({
      event: t,
      binding: this._core
    }), this._eventSubscriptionSubjects.set(t, s)), s.subscribe(e);
  }
}, tm = class extends Xi {
  get path() {
    return this._core.path;
  }
  get type() {
    return "thread";
  }
  _getState;
  constructor(t) {
    const e = new rr({
      path: t.path,
      getState: () => Kh(t.getState()),
      subscribe: (s) => t.subscribe(s)
    });
    super({
      path: t.path,
      getState: () => t.getState(),
      subscribe: (s) => e.subscribe(s)
    }), this._getState = e.getState.bind(e), this.__internal_bindMethods();
  }
  getState() {
    return this._getState();
  }
  getAttachmentByIndex(t) {
    return new Qh(new Re({
      path: {
        ...this.path,
        attachmentSource: "thread-composer",
        attachmentSelector: {
          type: "index",
          index: t
        },
        ref: `${this.path.ref}.attachments[${t}]`
      },
      getState: () => {
        const e = this.getState().attachments[t];
        return e ? {
          ...e,
          source: "thread-composer"
        } : Ae;
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
}, sm = class extends Xi {
  get path() {
    return this._core.path;
  }
  get type() {
    return "edit";
  }
  _getState;
  _beginEdit;
  constructor(t, e) {
    const s = new rr({
      path: t.path,
      getState: () => em(t.getState()),
      subscribe: (n) => t.subscribe(n)
    });
    super({
      path: t.path,
      getState: () => t.getState(),
      subscribe: (n) => s.subscribe(n)
    }), this._beginEdit = e, this._getState = s.getState.bind(s), this.__internal_bindMethods();
  }
  __internal_bindMethods() {
    super.__internal_bindMethods(), this.beginEdit = this.beginEdit.bind(this);
  }
  getState() {
    return this._getState();
  }
  beginEdit() {
    this._beginEdit();
  }
  getAttachmentByIndex(t) {
    return new Xh(new Re({
      path: {
        ...this.path,
        attachmentSource: "edit-composer",
        attachmentSelector: {
          type: "index",
          index: t
        },
        ref: `${this.path.ref}.attachments[${t}]`
      },
      getState: () => {
        const e = this.getState().attachments[t];
        return e ? {
          ...e,
          source: "edit-composer"
        } : Ae;
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
};
const Lt = (t) => t.content.filter((e) => e.type === "text").map((e) => e.text).join(`

`), Fr = {
  "allow-once": !0,
  "allow-always": !0,
  "reject-once": !1,
  "reject-always": !1
}, nm = (t, e) => {
  let s, n;
  if ("optionId" in e) {
    const r = t.options?.find((o) => o.id === e.optionId);
    if (!r) throw new Error(`Tool approval has no option with id "${e.optionId}"`);
    if ("approved" in e) s = e.approved;
    else {
      if (!Object.hasOwn(Fr, r.kind)) throw new Error(`Tool approval option "${r.id}" has a custom kind "${r.kind}"; respond with an explicit approved value instead`);
      s = Fr[r.kind];
    }
    n = r.id;
  } else s = e.approved;
  return {
    approvalId: t.id,
    approved: s,
    ...n !== void 0 && { optionId: n },
    ...e.reason != null && { reason: e.reason }
  };
};
var Lr = class {
  get path() {
    return this.contentBinding.path;
  }
  contentBinding;
  messageApi;
  threadApi;
  constructor(t, e, s) {
    this.contentBinding = t, this.messageApi = e, this.threadApi = s, this.__internal_bindMethods();
  }
  __internal_bindMethods() {
    this.addToolResult = this.addToolResult.bind(this), this.resumeToolCall = this.resumeToolCall.bind(this), this.respondToToolApproval = this.respondToToolApproval.bind(this), this.getState = this.getState.bind(this), this.subscribe = this.subscribe.bind(this);
  }
  getState() {
    return this.contentBinding.getState();
  }
  addToolResult(t) {
    const e = this.contentBinding.getState();
    if (!e) throw new Error("Message part is not available");
    if (e.type !== "tool-call") throw new Error("Tried to add tool result to non-tool message part");
    if (!this.messageApi) throw new Error("Message API is not available. This is likely a bug in assistant-ui.");
    if (!this.threadApi) throw new Error("Thread API is not available");
    const s = this.messageApi.getState();
    if (!s) throw new Error("Message is not available");
    const n = e.toolName, r = e.toolCallId, o = Be.toResponse(t);
    this.threadApi.getState().addToolResult({
      messageId: s.id,
      toolName: n,
      toolCallId: r,
      result: o.result,
      artifact: o.artifact,
      isError: o.isError
    });
  }
  resumeToolCall(t) {
    const e = this.contentBinding.getState();
    if (!e) throw new Error("Message part is not available");
    if (e.type !== "tool-call") throw new Error("Tried to resume tool call on non-tool message part");
    if (!this.threadApi) throw new Error("Thread API is not available");
    const s = e.toolCallId;
    this.threadApi.getState().resumeToolCall({
      toolCallId: s,
      payload: t
    });
  }
  respondToToolApproval(t) {
    const e = this.contentBinding.getState();
    if (!e) throw new Error("Message part is not available");
    if (e.type !== "tool-call") throw new Error("Tried to respond to tool approval on non-tool message part");
    if (!e.approval || e.approval.approved !== void 0 || e.approval.resolution !== void 0) throw new Error("Tool call has no pending approval");
    if (!this.threadApi) throw new Error("Thread API is not available");
    this.threadApi.getState().respondToToolApproval(nm(e.approval, t));
  }
  subscribe(t) {
    return this.contentBinding.subscribe(t);
  }
};
const Jt = Object.freeze({ type: "complete" }), rm = (t, e, s) => {
  if (t.role !== "assistant") return Jt;
  if (s.type === "tool-call") return s.result ? Jt : t.status;
  const n = e === Math.max(0, t.content.length - 1);
  return t.status.type === "requires-action" ? Jt : n ? t.status : Jt;
}, Vr = (t, e) => {
  const s = t.content[e];
  if (!s) return Ae;
  const n = rm(t, e, s);
  return Object.freeze({
    ...s,
    [rt]: s[rt],
    status: n
  });
};
var om = class {
  get path() {
    return this._core.path;
  }
  _core;
  _threadBinding;
  constructor(t, e) {
    this._core = t, this._threadBinding = e, this.composer = new sm(new _s({
      path: {
        ...this.path,
        ref: `${this.path.ref}.composer`,
        composerSource: "edit"
      },
      getState: this._getEditComposerRuntimeCore,
      subscribe: (s) => this._threadBinding.subscribe(s)
    }), () => this._threadBinding.getState().beginEdit(this._core.getState().id)), this.__internal_bindMethods();
  }
  __internal_bindMethods() {
    this.reload = this.reload.bind(this), this.delete = this.delete.bind(this), this.getState = this.getState.bind(this), this.subscribe = this.subscribe.bind(this), this.getMessagePartByIndex = this.getMessagePartByIndex.bind(this), this.getMessagePartByToolCallId = this.getMessagePartByToolCallId.bind(this), this.getAttachmentByIndex = this.getAttachmentByIndex.bind(this), this.unstable_getCopyText = this.unstable_getCopyText.bind(this), this.speak = this.speak.bind(this), this.stopSpeaking = this.stopSpeaking.bind(this), this.submitFeedback = this.submitFeedback.bind(this), this.switchToBranch = this.switchToBranch.bind(this);
  }
  composer;
  _getEditComposerRuntimeCore = () => this._threadBinding.getState().getEditComposer(this._core.getState().id);
  getState() {
    return this._core.getState();
  }
  delete() {
    const t = this._core.getState();
    return this._threadBinding.getState().deleteMessage(t.id);
  }
  reload(t = {}) {
    const e = this._getEditComposerRuntimeCore(), s = e ?? this._threadBinding.getState().composer, n = e ?? s, { runConfig: r = n.runConfig } = t, o = this._core.getState();
    if (o.role !== "assistant") throw new Error("Can only reload assistant messages");
    this._threadBinding.getState().startRun({
      parentId: o.parentId,
      sourceId: o.id,
      runConfig: r
    });
  }
  speak() {
    const t = this._core.getState();
    return this._threadBinding.getState().speak(t.id);
  }
  stopSpeaking() {
    const t = this._core.getState();
    if (this._threadBinding.getState().speech?.messageId === t.id) this._threadBinding.getState().stopSpeaking();
    else throw new Error("Message is not being spoken");
  }
  submitFeedback({ type: t }) {
    const e = this._core.getState();
    this._threadBinding.getState().submitFeedback({
      messageId: e.id,
      type: t
    });
  }
  switchToBranch({ position: t, branchId: e }) {
    const s = this._core.getState();
    if (e && t) throw new Error("May not specify both branchId and position");
    if (!e && !t) throw new Error("Must specify either branchId or position");
    const n = this._threadBinding.getState().getBranches(s.id);
    let r = e;
    if (t === "previous" ? r = n[s.branchNumber - 2] : t === "next" && (r = n[s.branchNumber]), !r) throw new Error("Branch not found");
    this._threadBinding.getState().switchToBranch(r);
  }
  unstable_getCopyText() {
    return Lt(this.getState());
  }
  subscribe(t) {
    return this._core.subscribe(t);
  }
  getMessagePartByIndex(t) {
    if (t < 0) throw new Error("Message part index must be >= 0");
    return new Lr(new Re({
      path: {
        ...this.path,
        ref: `${this.path.ref}.content[${t}]`,
        messagePartSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => Vr(this.getState(), t),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core, this._threadBinding);
  }
  getMessagePartByToolCallId(t) {
    return new Lr(new Re({
      path: {
        ...this.path,
        ref: `${this.path.ref}.content[toolCallId=${JSON.stringify(t)}]`,
        messagePartSelector: {
          type: "toolCallId",
          toolCallId: t
        }
      },
      getState: () => {
        const e = this._core.getState(), s = e.content.findIndex((n) => n.type === "tool-call" && n.toolCallId === t);
        return s === -1 ? Ae : Vr(e, s);
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core, this._threadBinding);
  }
  getAttachmentByIndex(t) {
    return new Zh(new Re({
      path: {
        ...this.path,
        ref: `${this.path.ref}.attachments[${t}]`,
        attachmentSource: "message",
        attachmentSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => {
        const e = this.getState().attachments?.[t];
        return e ? {
          ...e,
          source: "message"
        } : Ae;
      },
      subscribe: (e) => this._core.subscribe(e)
    }));
  }
};
const im = (t) => ({
  parentId: t.parentId ?? null,
  sourceId: t.sourceId ?? null,
  runConfig: t.runConfig ?? {},
  ...t.stream ? { stream: t.stream } : {}
}), am = (t) => ({
  parentId: t.parentId ?? null,
  sourceId: t.sourceId ?? null,
  runConfig: t.runConfig ?? {}
}), cm = (t, e) => typeof e == "string" ? {
  createdAt: /* @__PURE__ */ new Date(),
  parentId: t.at(-1)?.id ?? null,
  sourceId: null,
  runConfig: {},
  role: "user",
  content: [{
    type: "text",
    text: e
  }],
  attachments: [],
  metadata: { custom: {} }
} : {
  createdAt: e.createdAt ?? /* @__PURE__ */ new Date(),
  parentId: e.parentId ?? t.at(-1)?.id ?? null,
  sourceId: e.sourceId ?? null,
  role: e.role ?? "user",
  content: e.content,
  attachments: e.attachments ?? [],
  metadata: e.metadata ?? { custom: {} },
  runConfig: e.runConfig ?? {},
  startRun: e.startRun
}, lm = (t, e) => {
  const s = t.messages.at(-1);
  return Object.freeze({
    threadId: e.id,
    metadata: e,
    capabilities: t.capabilities,
    isDisabled: t.isDisabled,
    isLoading: t.isLoading,
    isRunning: t.isRunning ?? (s?.role !== "assistant" ? !1 : s.status.type === "running"),
    messages: t.messages,
    state: t.state,
    suggestions: t.suggestions,
    extras: t.extras,
    speech: t.speech,
    voice: t.voice
  });
};
var um = class {
  get path() {
    return this._threadBinding.path;
  }
  get __internal_threadBinding() {
    return this._threadBinding;
  }
  _threadBinding;
  constructor(t, e) {
    const s = new Re({
      path: t.path,
      getState: () => lm(t.getState(), e.getState()),
      subscribe: (n) => {
        const r = t.subscribe(n), o = e.subscribe(n);
        return () => {
          r(), o();
        };
      }
    });
    this._threadBinding = {
      path: t.path,
      getState: () => t.getState(),
      getStateState: () => s.getState(),
      outerSubscribe: (n) => t.outerSubscribe(n),
      subscribe: (n) => t.subscribe(n)
    }, this.composer = new tm(new _s({
      path: {
        ...this.path,
        ref: `${this.path.ref}.composer`,
        composerSource: "thread"
      },
      getState: () => this._threadBinding.getState().composer,
      subscribe: (n) => this._threadBinding.subscribe(n)
    })), this.__internal_bindMethods();
  }
  __internal_bindMethods() {
    this.append = this.append.bind(this), this.deleteMessage = this.deleteMessage.bind(this), this.resumeRun = this.resumeRun.bind(this), this.importExternalState = this.importExternalState.bind(this), this.exportExternalState = this.exportExternalState.bind(this), this.startRun = this.startRun.bind(this), this.cancelRun = this.cancelRun.bind(this), this.stopSpeaking = this.stopSpeaking.bind(this), this.connectVoice = this.connectVoice.bind(this), this.disconnectVoice = this.disconnectVoice.bind(this), this.muteVoice = this.muteVoice.bind(this), this.unmuteVoice = this.unmuteVoice.bind(this), this.getVoiceVolume = this.getVoiceVolume.bind(this), this.subscribeVoiceVolume = this.subscribeVoiceVolume.bind(this), this.export = this.export.bind(this), this.import = this.import.bind(this), this.reset = this.reset.bind(this), this.getMessageByIndex = this.getMessageByIndex.bind(this), this.getMessageById = this.getMessageById.bind(this), this.subscribe = this.subscribe.bind(this), this.unstable_on = this.unstable_on.bind(this), this.getModelContext = this.getModelContext.bind(this), this.getState = this.getState.bind(this);
  }
  composer;
  getState() {
    return this._threadBinding.getStateState();
  }
  append(t) {
    this._threadBinding.getState().append(cm(this._threadBinding.getState().messages, t));
  }
  deleteMessage(t) {
    return this._threadBinding.getState().deleteMessage(t);
  }
  subscribe(t) {
    return this._threadBinding.subscribe(t);
  }
  getModelContext() {
    return this._threadBinding.getState().getModelContext();
  }
  startRun(t) {
    return this._threadBinding.getState().startRun(am(t));
  }
  resumeRun(t) {
    return this._threadBinding.getState().resumeRun(im(t));
  }
  exportExternalState() {
    return this._threadBinding.getState().exportExternalState();
  }
  importExternalState(t) {
    this._threadBinding.getState().importExternalState(t);
  }
  cancelRun() {
    this._threadBinding.getState().cancelRun();
  }
  stopSpeaking() {
    return this._threadBinding.getState().stopSpeaking();
  }
  connectVoice() {
    this._threadBinding.getState().connectVoice();
  }
  disconnectVoice() {
    this._threadBinding.getState().disconnectVoice();
  }
  getVoiceVolume() {
    return this._threadBinding.getState().getVoiceVolume();
  }
  subscribeVoiceVolume(t) {
    return this._threadBinding.getState().subscribeVoiceVolume(t);
  }
  muteVoice() {
    this._threadBinding.getState().muteVoice();
  }
  unmuteVoice() {
    this._threadBinding.getState().unmuteVoice();
  }
  export() {
    return this._threadBinding.getState().export();
  }
  import(t) {
    this._threadBinding.getState().import(t);
  }
  reset(t) {
    this._threadBinding.getState().reset(t);
  }
  getMessageByIndex(t) {
    if (t < 0) throw new Error("Message index must be >= 0");
    return this._getMessageRuntime({
      ...this.path,
      ref: `${this.path.ref}.messages[${t}]`,
      messageSelector: {
        type: "index",
        index: t
      }
    }, () => {
      const e = this._threadBinding.getState().messages, s = e[t];
      if (s)
        return {
          message: s,
          parentId: e[t - 1]?.id ?? null,
          index: t
        };
    });
  }
  getMessageById(t) {
    return this._getMessageRuntime({
      ...this.path,
      ref: `${this.path.ref}.messages[messageId=${JSON.stringify(t)}]`,
      messageSelector: {
        type: "messageId",
        messageId: t
      }
    }, () => this._threadBinding.getState().getMessageById(t));
  }
  _getMessageRuntime(t, e) {
    return new om(new Re({
      path: t,
      getState: () => {
        const { message: s, parentId: n, index: r } = e() ?? {}, { messages: o, speech: i } = this._threadBinding.getState();
        if (!s || n === void 0 || r === void 0) return Ae;
        const a = this._threadBinding.getState().getBranches(s.id);
        return {
          ...s,
          [rt]: s[rt],
          index: r,
          isLast: o.at(-1)?.id === s.id,
          parentId: n,
          branchNumber: a.indexOf(s.id) + 1,
          branchCount: a.length,
          speech: i?.messageId === s.id ? i : void 0
        };
      },
      subscribe: (s) => this._threadBinding.subscribe(s)
    }), this._threadBinding);
  }
  _eventSubscriptionSubjects = /* @__PURE__ */ new Map();
  unstable_on(t, e) {
    let s = this._eventSubscriptionSubjects.get(t);
    return s || (s = new Wi({
      event: t,
      binding: this._threadBinding
    }), this._eventSubscriptionSubjects.set(t, s)), s.subscribe(e);
  }
};
const dm = ct(null), hm = () => Ts(dm);
var Qt = class {
  get path() {
    return this._core.path;
  }
  _core;
  _threadListBinding;
  constructor(t, e) {
    this._core = t, this._threadListBinding = e, this.__internal_bindMethods();
  }
  __internal_bindMethods() {
    this.switchTo = this.switchTo.bind(this), this.rename = this.rename.bind(this), this.updateCustom = this.updateCustom.bind(this), this.archive = this.archive.bind(this), this.unarchive = this.unarchive.bind(this), this.delete = this.delete.bind(this), this.initialize = this.initialize.bind(this), this.generateTitle = this.generateTitle.bind(this), this.subscribe = this.subscribe.bind(this), this.unstable_on = this.unstable_on.bind(this), this.getState = this.getState.bind(this), this.detach = this.detach.bind(this);
  }
  getState() {
    return this._core.getState();
  }
  switchTo(t) {
    const e = this._core.getState();
    return this._threadListBinding.switchToThread(e.id, t);
  }
  rename(t) {
    const e = this._core.getState();
    return this._threadListBinding.rename(e.id, t);
  }
  updateCustom(t) {
    const e = this._core.getState();
    if (!this._threadListBinding.updateCustom) throw new Error("Thread list runtime does not support updating custom metadata");
    return this._threadListBinding.updateCustom(e.id, t);
  }
  archive() {
    const t = this._core.getState();
    return this._threadListBinding.archive(t.id);
  }
  unarchive() {
    const t = this._core.getState();
    return this._threadListBinding.unarchive(t.id);
  }
  delete() {
    const t = this._core.getState();
    return this._threadListBinding.delete(t.id);
  }
  initialize() {
    const t = this._core.getState();
    return this._threadListBinding.initialize(t.id);
  }
  generateTitle() {
    const t = this._core.getState();
    return this._threadListBinding.generateTitle(t.id);
  }
  unstable_on(t, e) {
    let s = this._core.getState().isMain, n = this._core.getState().id;
    return this.subscribe(() => {
      const r = this._core.getState(), o = r.isMain, i = r.id;
      s === o && n === i || (s = o, n = i, !(t === "switchedTo" && !o) && (t === "switchedAway" && o || Ms([e], {}, `Thread list item "${t}"`)));
    });
  }
  subscribe(t) {
    return this._core.subscribe(t);
  }
  detach() {
    const t = this._core.getState();
    this._threadListBinding.detach(t.id);
  }
  __internal_getRuntime() {
    return this;
  }
};
const jr = Promise.resolve(), mm = (t) => ({
  mainThreadId: t.mainThreadId,
  newThreadId: t.newThreadId,
  threadIds: t.threadIds,
  archivedThreadIds: t.archivedThreadIds,
  isLoading: t.isLoading,
  isLoadingMore: t.isLoadingMore ?? !1,
  hasMore: t.hasMore ?? !1,
  threadItems: t.threadItems
}), Xt = (t, e) => {
  if (e === void 0) return Ae;
  const s = t.getItemById(e);
  return s ? {
    id: s.id,
    remoteId: s.remoteId,
    externalId: s.externalId,
    title: s.title,
    status: s.status,
    lastMessageAt: s.lastMessageAt,
    custom: s.custom,
    isMain: s.id === t.mainThreadId
  } : Ae;
};
var fm = class {
  _getState;
  _core;
  _runtimeFactory;
  constructor(t, e = um) {
    this._core = t, this._runtimeFactory = e;
    const s = new rr({
      path: {},
      getState: () => mm(t),
      subscribe: (n) => t.subscribe(n)
    });
    this._getState = s.getState.bind(s), this._mainThreadListItemRuntime = new Qt(new Re({
      path: {
        ref: "threadItems[main]",
        threadSelector: { type: "main" }
      },
      getState: () => Xt(this._core, this._core.mainThreadId),
      subscribe: (n) => this._core.subscribe(n)
    }), this._core), this.main = new e(new _s({
      path: {
        ref: "threads.main",
        threadSelector: { type: "main" }
      },
      getState: () => t.getMainThreadRuntimeCore(),
      subscribe: (n) => t.subscribe(n)
    }), this._mainThreadListItemRuntime), this.__internal_bindMethods();
  }
  __internal_bindMethods() {
    this.switchToThread = this.switchToThread.bind(this), this.switchToNewThread = this.switchToNewThread.bind(this), this.getLoadThreadsPromise = this.getLoadThreadsPromise.bind(this), this.reload = this.reload.bind(this), this.loadMore = this.loadMore.bind(this), this.getState = this.getState.bind(this), this.subscribe = this.subscribe.bind(this), this.getById = this.getById.bind(this), this.getItemById = this.getItemById.bind(this), this.getItemByIndex = this.getItemByIndex.bind(this), this.getArchivedItemByIndex = this.getArchivedItemByIndex.bind(this);
  }
  switchToThread(t, e) {
    return this._core.switchToThread(t, e);
  }
  switchToNewThread() {
    return this._core.switchToNewThread();
  }
  getLoadThreadsPromise() {
    return this._core.getLoadThreadsPromise();
  }
  reload() {
    return this._core.reload?.() ?? jr;
  }
  loadMore() {
    return this._core.loadMore?.() ?? jr;
  }
  getState() {
    return this._getState();
  }
  subscribe(t) {
    return this._core.subscribe(t);
  }
  _mainThreadListItemRuntime;
  main;
  get mainItem() {
    return this._mainThreadListItemRuntime;
  }
  getById(t) {
    return new this._runtimeFactory(new _s({
      path: {
        ref: `threads[threadId=${JSON.stringify(t)}]`,
        threadSelector: {
          type: "threadId",
          threadId: t
        }
      },
      getState: () => this._core.getThreadRuntimeCore(t),
      subscribe: (e) => this._core.subscribe(e)
    }), this.mainItem);
  }
  getItemByIndex(t) {
    return new Qt(new Re({
      path: {
        ref: `threadItems[${t}]`,
        threadSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => Xt(this._core, this._core.threadIds[t]),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
  getArchivedItemByIndex(t) {
    return new Qt(new Re({
      path: {
        ref: `archivedThreadItems[${t}]`,
        threadSelector: {
          type: "archiveIndex",
          index: t
        }
      },
      getState: () => Xt(this._core, this._core.archivedThreadIds[t]),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
  getItemById(t) {
    return new Qt(new Re({
      path: {
        ref: `threadItems[threadId=${t}]`,
        threadSelector: {
          type: "threadId",
          threadId: t
        }
      },
      getState: () => Xt(this._core, t),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
}, pm = class {
  threads;
  _thread;
  _core;
  constructor(t) {
    this._core = t, this.threads = new fm(t.threads), this._thread = this.threads.main, this.__internal_bindMethods();
  }
  __internal_bindMethods() {
    this.registerModelContextProvider = this.registerModelContextProvider.bind(this);
  }
  get thread() {
    return this._thread;
  }
  registerModelContextProvider(t) {
    return this._core.registerModelContextProvider(t);
  }
}, gm = class {
  _contextProvider = new _i();
  registerModelContextProvider(t) {
    return this._contextProvider.registerModelContextProvider(t);
  }
  getModelContextProvider() {
    return this._contextProvider;
  }
};
const Je = Object.freeze([]), _t = "DEFAULT_THREAD_ID", bm = Object.freeze([_t]), _m = Object.freeze({
  id: _t,
  remoteId: void 0,
  externalId: void 0,
  status: "regular"
}), vm = Promise.resolve(), qr = Object.freeze({ [_t]: _m });
var ym = class {
  _mainThreadId = _t;
  _threads = bm;
  _archivedThreads = Je;
  _threadData = qr;
  adapter = {};
  get isLoading() {
    return this.adapter.isLoading ?? !1;
  }
  get newThreadId() {
  }
  get threadIds() {
    return this._threads;
  }
  get archivedThreadIds() {
    return this._archivedThreads;
  }
  get threadItems() {
    return this._threadData;
  }
  getLoadThreadsPromise() {
    return vm;
  }
  _mainThread;
  get mainThreadId() {
    return this._mainThreadId;
  }
  threadFactory;
  constructor(t = {}, e) {
    this.threadFactory = e, this.__internal_setAdapter(t, !0);
  }
  getMainThreadRuntimeCore() {
    return this._mainThread;
  }
  getThreadRuntimeCore() {
    throw new Error("Method not implemented.");
  }
  getItemById(t) {
    return this._threadData[t];
  }
  __internal_setAdapter(t, e = !1) {
    const s = this.adapter;
    this.adapter = t;
    const n = t.threadId ?? _t, r = t.threads ?? Je, o = t.archivedThreads ?? Je, i = s.threadId ?? _t, a = s.threads ?? Je, c = s.archivedThreads ?? Je;
    !e && i === n && a === r && c === o || ((a !== r || c !== o || i !== n) && (this._threadData = {
      ...qr,
      ...Object.fromEntries(t.threads?.map((l) => [l.id, {
        ...l,
        remoteId: l.remoteId,
        externalId: l.externalId,
        status: "regular"
      }]) ?? []),
      ...Object.fromEntries(t.archivedThreads?.map((l) => [l.id, {
        ...l,
        remoteId: l.remoteId,
        externalId: l.externalId,
        status: "archived"
      }]) ?? [])
    }), a !== r && (this._threads = this.adapter.threads?.map((l) => l.id) ?? Je), c !== o && (this._archivedThreads = this.adapter.archivedThreads?.map((l) => l.id) ?? Je), (e || i !== n) && (this._mainThreadId = n, this._mainThread = this.threadFactory()), this._threadData[this._mainThreadId] || (this._threadData = {
      ...this._threadData,
      [this._mainThreadId]: {
        id: this._mainThreadId,
        remoteId: void 0,
        externalId: void 0,
        status: "regular"
      }
    }), this._notifySubscribers());
  }
  async switchToThread(t, e) {
    if (this._mainThreadId === t) return;
    const s = this.adapter.onSwitchToThread;
    if (!s) throw new Error("External store adapter does not support switching to thread");
    await s(t);
  }
  async switchToNewThread() {
    const t = this.adapter.onSwitchToNewThread;
    if (!t) throw new Error("External store adapter does not support switching to new thread");
    await t();
  }
  async rename(t, e) {
    const s = this.adapter.onRename;
    if (!s) throw new Error("External store adapter does not support renaming");
    await s(t, e);
  }
  async updateCustom(t, e) {
    const s = this.adapter.onUpdateCustom;
    if (!s) throw new Error("External store adapter does not support updating custom metadata");
    await s(t, e);
  }
  async detach() {
  }
  async archive(t) {
    const e = this.adapter.onArchive;
    if (!e) throw new Error("External store adapter does not support archiving");
    await e(t);
  }
  async unarchive(t) {
    const e = this.adapter.onUnarchive;
    if (!e) throw new Error("External store adapter does not support unarchiving");
    await e(t);
  }
  async delete(t) {
    const e = this.adapter.onDelete;
    if (!e) throw new Error("External store adapter does not support deleting");
    await e(t);
  }
  initialize(t) {
    return Promise.resolve({
      remoteId: t,
      externalId: void 0
    });
  }
  generateTitle() {
    throw new Error("Method not implemented.");
  }
  _subscriptions = /* @__PURE__ */ new Set();
  subscribe(t) {
    return this._subscriptions.add(t), () => this._subscriptions.delete(t);
  }
  _notifySubscribers() {
    for (const t of this._subscriptions) t();
  }
};
const zs = (t, e) => {
  if (t.startsWith("data-"))
    return {
      type: "data",
      name: t.substring(5),
      data: e
    };
}, ys = (t, e, s) => {
  const { role: n, id: r, createdAt: o, attachments: i, status: a, metadata: c } = t, l = {
    id: r ?? e,
    createdAt: o ?? /* @__PURE__ */ new Date()
  }, u = typeof t.content == "string" ? [{
    type: "text",
    text: t.content
  }] : t.content, h = ({ image: d, ...f }) => typeof d != "string" ? null : d.match(/^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,(.*)$/) ? {
    ...f,
    image: d
  } : /^(https:\/\/|blob:)/.test(d) ? {
    ...f,
    image: d
  } : (console.warn("Invalid image data format detected"), null);
  if (n !== "user" && i?.length) throw new Error("attachments are only supported for user messages");
  if (n !== "assistant" && a) throw new Error("status is only supported for assistant messages");
  if (n !== "assistant" && c?.steps) throw new Error("metadata.steps is only supported for assistant messages");
  switch (n) {
    case "assistant":
      return {
        ...l,
        role: n,
        content: u.map((d) => {
          const f = d.type;
          switch (f) {
            case "text":
            case "reasoning":
              return d.text?.trim() ? d : null;
            case "file":
            case "source":
              return d;
            case "image":
              return h(d);
            case "data":
              return d;
            case "generative-ui":
              return d;
            case "tool-call": {
              const { parentId: p, messages: v, ..._ } = d, C = {
                ..._,
                toolCallId: d.toolCallId ?? `tool-${nt()}`,
                ...p !== void 0 && { parentId: p },
                ...v !== void 0 && { messages: v }
              };
              return d.args ? {
                ...C,
                args: d.args,
                argsText: d.argsText ?? JSON.stringify(d.args)
              } : {
                ...C,
                args: cn(d.argsText ?? "") ?? {},
                argsText: d.argsText ?? ""
              };
            }
            default: {
              const p = zs(f, d.data);
              if (p) return p;
              throw new Error(`Unsupported assistant message part type: ${f}`);
            }
          }
        }).filter((d) => !!d),
        status: a ?? s,
        metadata: {
          unstable_state: c?.unstable_state ?? null,
          unstable_annotations: c?.unstable_annotations ?? [],
          unstable_data: c?.unstable_data ?? [],
          custom: c?.custom ?? {},
          steps: c?.steps ?? [],
          ...c?.timing && { timing: c.timing },
          ...c?.submittedFeedback && { submittedFeedback: c.submittedFeedback },
          ...c?.isOptimistic && { isOptimistic: !0 }
        }
      };
    case "user":
      return {
        ...l,
        role: n,
        content: u.map((d) => {
          const f = d.type;
          switch (f) {
            case "text":
            case "image":
            case "audio":
            case "file":
            case "data":
              return d;
            default: {
              const p = zs(f, d.data);
              if (p) return p;
              throw new Error(`Unsupported user message part type: ${f}`);
            }
          }
        }),
        attachments: (i ?? []).map((d) => ({
          ...d,
          content: d.content.map((f) => zs(f.type, f.data) ?? f)
        })),
        metadata: {
          custom: c?.custom ?? {},
          ...c?.isOptimistic && { isOptimistic: !0 }
        }
      };
    case "system":
      if (u.length !== 1 || u[0].type !== "text") throw new Error("System messages must have exactly one text message part.");
      return {
        ...l,
        role: n,
        content: u,
        metadata: { custom: c?.custom ?? {} }
      };
    default:
      throw new Error(`Unknown message role: ${n}`);
  }
}, xt = /* @__PURE__ */ Symbol("autoStatus"), wm = Object.freeze(Object.assign({ type: "running" }, { [xt]: !0 })), Sm = Object.freeze(Object.assign({
  type: "complete",
  reason: "unknown"
}, { [xt]: !0 }));
Object.freeze(Object.assign({
  type: "requires-action",
  reason: "tool-calls"
}, { [xt]: !0 }));
Object.freeze(Object.assign({
  type: "requires-action",
  reason: "interrupt"
}, { [xt]: !0 }));
const xm = (t) => t[xt] === !0, ln = (t, e, s, n, r) => t && r ? Object.assign({
  type: "incomplete",
  reason: "error",
  error: r
}, { [xt]: !0 }) : t && e ? wm : Sm, Zi = {
  fromArray: (t) => {
    const e = t.map((s) => ys(s, nt(), ln(!1, !1, !1, !1, void 0)));
    return { messages: e.map((s, n) => ({
      parentId: n > 0 ? e[n - 1].id : null,
      message: s
    })) };
  },
  fromBranchableArray: (t, e) => {
    const s = ln(!1, !1, !1, !1, void 0);
    return {
      ...e?.headId !== void 0 ? { headId: e.headId } : void 0,
      messages: t.map(({ message: n, parentId: r }) => {
        if (!n.id) throw new Error("ExportedMessageRepository.fromBranchableArray: Each message must have an 'id' field set.");
        return {
          parentId: r,
          message: ys(n, n.id, s)
        };
      })
    };
  }
}, ls = (t) => t.next ? ls(t.next) : "current" in t ? t : null;
var Im = class {
  _value = null;
  func;
  constructor(t) {
    this.func = t;
  }
  get value() {
    return this._value === null && (this._value = this.func()), this._value;
  }
  dirty() {
    this._value = null;
  }
}, Ki = class {
  messages = /* @__PURE__ */ new Map();
  head = null;
  root = {
    children: [],
    next: null
  };
  updateLevels(t, e) {
    t.level = e;
    for (const s of t.children) {
      const n = this.messages.get(s);
      n && this.updateLevels(n, e + 1);
    }
  }
  performOp(t, e, s) {
    const n = e.prev ?? this.root, r = t ?? this.root;
    if (!(s === "relink" && n === r)) {
      if (s !== "cut") {
        for (let o = t; o; o = o.prev) if (o.current.id === e.current.id) throw new Error("MessageRepository(performOp/link): A message with the same id already exists in the parent tree. This error occurs if the same message id is found multiple times. This is likely an internal bug in assistant-ui.");
      }
      if (s !== "link" && (n.children = n.children.filter((o) => o !== e.current.id), n.next === e)) {
        const o = n.children.at(-1), i = o ? this.messages.get(o) : null;
        if (i === void 0) throw new Error("MessageRepository(performOp/cut): Fallback sibling message not found. This is likely an internal bug in assistant-ui.");
        n.next = i;
      }
      if (s !== "cut") {
        r.children = [...r.children, e.current.id], (ls(e) === this.head || r.next === null) && (r.next = e), e.prev = t;
        const o = t ? t.level + 1 : 0;
        this.updateLevels(e, o);
      }
    }
  }
  _messages = new Im(() => {
    const t = new Array((this.head?.level ?? -1) + 1);
    for (let e = this.head; e; e = e.prev) t[e.level] = e.current;
    return t;
  });
  get headId() {
    return this.head?.current.id ?? null;
  }
  get canonicalHeadId() {
    let t = this.head;
    for (; t?.current.metadata?.isOptimistic; ) t = t.prev;
    return t?.current.id ?? null;
  }
  getMessages(t) {
    if (t === void 0 || t === this.head?.current.id) return this._messages.value;
    const e = this.messages.get(t);
    if (!e) throw new Error("MessageRepository(getMessages): Head message not found. This is likely an internal bug in assistant-ui.");
    const s = new Array(e.level + 1);
    for (let n = e; n; n = n.prev) s[n.level] = n.current;
    return s;
  }
  addOrUpdateMessage(t, e) {
    const s = this.messages.get(e.id), n = t ? this.messages.get(t) : null;
    if (n === void 0) throw new Error("MessageRepository(addOrUpdateMessage): Parent message not found. This is likely an internal bug in assistant-ui.");
    if (s) {
      s.current = e, this.performOp(n, s, "relink"), this._messages.dirty();
      return;
    }
    const r = {
      prev: n,
      current: e,
      next: null,
      children: [],
      level: n ? n.level + 1 : 0
    };
    this.messages.set(e.id, r), this.performOp(n, r, "link"), this.head === n && (this.head = r), this._messages.dirty();
  }
  getMessage(t) {
    const e = this.messages.get(t);
    if (!e) throw new Error("MessageRepository(updateMessage): Message not found. This is likely an internal bug in assistant-ui.");
    return {
      parentId: e.prev?.current.id ?? null,
      message: e.current,
      index: e.level
    };
  }
  deleteMessage(t, e) {
    const s = this.messages.get(t);
    if (!s) throw new Error("MessageRepository(deleteMessage): Message not found. This is likely an internal bug in assistant-ui.");
    const n = e === void 0 ? s.prev : e === null ? null : this.messages.get(e);
    if (n === void 0) throw new Error("MessageRepository(deleteMessage): Replacement not found. This is likely an internal bug in assistant-ui.");
    for (const r of s.children) {
      const o = this.messages.get(r);
      if (!o) throw new Error("MessageRepository(deleteMessage): Child message not found. This is likely an internal bug in assistant-ui.");
      this.performOp(n, o, "relink");
    }
    this.performOp(null, s, "cut"), this.messages.delete(t), this.head === s && (this.head = ls(n ?? this.root)), this._messages.dirty();
  }
  getBranches(t) {
    const e = this.messages.get(t);
    if (!e) throw new Error("MessageRepository(getBranches): Message not found. This is likely an internal bug in assistant-ui.");
    const { children: s } = e.prev ?? this.root;
    return s;
  }
  /**
  * Evicts optimistic messages (`metadata.isOptimistic`) the head just moved
  * away from. Since eviction runs on every head move, the only optimistic
  * messages in the repository live on the branch the head previously pointed
  * at — so we walk just that branch rather than the whole repository. Keeps a
  * client→server id swap from leaving a phantom sibling, and drops off-branch
  * placeholders.
  */
  evictOffBranchOptimisticMessages(t, e) {
    if (!t) return;
    const s = /* @__PURE__ */ new Set();
    for (let r = e; r; r = r.prev) s.add(r.current.id);
    const n = [];
    for (let r = t; r && !s.has(r.current.id); r = r.prev)
      r.current.metadata?.isOptimistic && n.push(r.current.id);
    for (const r of n) this.messages.has(r) && this.deleteMessage(r);
  }
  switchToBranch(t) {
    const e = this.messages.get(t);
    if (!e) throw new Error("MessageRepository(switchToBranch): Branch not found. This is likely an internal bug in assistant-ui.");
    const s = this.head, n = e.prev ?? this.root;
    n.next = e, this.head = ls(e), this.evictOffBranchOptimisticMessages(s, this.head), this._messages.dirty();
  }
  resetHead(t) {
    if (t === null) {
      this.clear();
      return;
    }
    const e = this.messages.get(t);
    if (!e) throw new Error("MessageRepository(resetHead): Branch not found. This is likely an internal bug in assistant-ui.");
    const s = this.head;
    if (e.children.length > 0) {
      const n = (r) => {
        for (const o of r.children) {
          const i = this.messages.get(o);
          i && (n(i), this.messages.delete(o));
        }
      };
      n(e), e.children = [], e.next = null;
    }
    this.head = e;
    for (let n = e; n; n = n.prev) n.prev ? n.prev.next = n : this.root.next = n;
    this.evictOffBranchOptimisticMessages(s, this.head), this._messages.dirty();
  }
  clear() {
    this.messages.clear(), this.head = null, this.root = {
      children: [],
      next: null
    }, this._messages.dirty();
  }
  export() {
    const t = [];
    for (const [, e] of this.messages) {
      if (e.current.metadata?.isOptimistic) continue;
      let s = e.prev;
      for (; s && s.current.metadata?.isOptimistic; ) s = s.prev;
      t.push({
        message: e.current,
        parentId: s?.current.id ?? null
      });
    }
    return {
      headId: this.canonicalHeadId,
      messages: t
    };
  }
  import({ headId: t, messages: e }) {
    for (const { message: s, parentId: n } of e) this.addOrUpdateMessage(n, s);
    this.resetHead(t ?? e.at(-1)?.message.id ?? null);
  }
};
const or = Object.freeze([]);
function Ur(t, e) {
  if (e === "*") return !0;
  const s = e.split(",").map((o) => o.trim().toLowerCase()), n = `.${t.name.split(".").pop().toLowerCase()}`, r = t.type.split(";", 1)[0].trim().toLowerCase();
  for (const o of s) {
    if (o.startsWith(".") && o === n || o.includes("/") && o === r) return !0;
    if (o.endsWith("/*")) {
      const i = o.split("/")[0];
      if (r.startsWith(`${i}/`)) return !0;
    }
  }
  return !1;
}
function Tm(t, e) {
  return t.length !== e.length ? !1 : t.every((s, n) => s.id === e[n].id);
}
function Cm(t) {
  const e = nt();
  return t.type === "image" ? {
    id: e,
    type: "image",
    name: t.filename ?? "image",
    content: [t],
    status: { type: "complete" }
  } : t.type === "file" ? {
    id: e,
    type: "document",
    name: t.filename ?? "document",
    contentType: t.mimeType,
    content: [t],
    status: { type: "complete" }
  } : t.type === "audio" ? {
    id: e,
    type: "audio",
    name: `audio.${t.audio.format}`,
    contentType: `audio/${t.audio.format}`,
    content: [t],
    status: { type: "complete" }
  } : {
    id: e,
    type: "data",
    name: t.name,
    content: [t],
    status: { type: "complete" }
  };
}
function Em(t) {
  const e = [];
  for (const s of t) s.type !== "text" && e.push(Cm(s));
  return e;
}
const Rm = (t) => "content" in t && !("lastModified" in t), Hs = (t) => t.status.type === "complete";
var ea = class extends Jh {
  isEditing = !0;
  enrichWithComposerMetadata(t, e) {
    return e ? {
      ...t,
      metadata: {
        ...t.metadata,
        custom: {
          ...t.metadata?.custom,
          ...e
        }
      }
    } : t;
  }
  get attachmentAccept() {
    return this.getAttachmentAdapter()?.accept ?? "*";
  }
  _attachments = [];
  get attachments() {
    return this._attachments;
  }
  setAttachments(t) {
    this._attachments = t, this._notifySubscribers();
  }
  get isEmpty() {
    return !this.text.trim() && !this.attachments.length;
  }
  _text = "";
  get text() {
    return this._text;
  }
  _role = "user";
  get role() {
    return this._role;
  }
  _runConfig = {};
  get runConfig() {
    return this._runConfig;
  }
  _quote = void 0;
  get quote() {
    return this._quote;
  }
  setQuote(t) {
    this._quote !== t && (this._quote = t, this._notifySubscribers());
  }
  setText(t) {
    if (this._text !== t) {
      if (this._text = t, this._dictation) {
        this._dictationBaseText = t, this._currentInterimText = "";
        const { status: e, inputDisabled: s } = this._dictation;
        this._dictation = s ? {
          status: e,
          inputDisabled: s
        } : { status: e };
      }
      this._notifySubscribers();
    }
  }
  setRole(t) {
    this._role !== t && (this._role = t, this._notifySubscribers());
  }
  setRunConfig(t) {
    this._runConfig !== t && (this._runConfig = t, this._notifySubscribers());
  }
  _isSending = !1;
  _removedDuringSend = /* @__PURE__ */ new Set();
  _sendGeneration = 0;
  _emptyTextAndAttachments() {
    this._attachments = [], this._text = "", this._notifySubscribers();
  }
  async _onClearAttachments() {
    const t = this.getAttachmentAdapter();
    if (t) {
      const e = this._attachments.filter((s) => !Hs(s));
      await Promise.all(e.map((s) => t.remove(s)));
    }
  }
  async reset() {
    if (this._sendGeneration++, this._isSending = !1, this._removedDuringSend.clear(), this._attachments.length === 0 && this._text === "" && this._role === "user" && Object.keys(this._runConfig).length === 0 && this._quote === void 0) return;
    this._role = "user", this._runConfig = {}, this._quote = void 0;
    const t = this._onClearAttachments();
    this._emptyTextAndAttachments(), await t;
  }
  async clearAttachments() {
    const t = this._onClearAttachments();
    this.setAttachments([]), await t;
  }
  async send(t) {
    if (!this.canSend || this._isSending) return;
    this._dictationSession && (this._dictationSession.cancel(), this._cleanupDictation());
    const e = this.getAttachmentAdapter(), s = this.attachments.map(async (d) => {
      if (Hs(d)) return d;
      if (!e) throw new Error("Attachments are not supported");
      return await e.send(d);
    }), n = this.attachments, r = this.text, o = this._quote;
    this._quote = void 0, this._text = "", this._isSending = !0;
    const i = ++this._sendGeneration;
    this._notifySubscribers();
    let a;
    try {
      a = await Promise.all(s);
    } catch (d) {
      throw i === this._sendGeneration && (!this.text.trim() && this._quote === void 0 && (this._text = r, this._quote = o, this._notifySubscribers()), Promise.allSettled(s).then(() => {
        i === this._sendGeneration && (this._removedDuringSend.clear(), this._isSending = !1, this._notifySubscribers());
      })), d;
    }
    if (i !== this._sendGeneration) return;
    const c = new Set(n.map((d) => d.id));
    this._attachments = this._attachments.filter((d) => !c.has(d.id)), this._isSending = !1, this._notifySubscribers();
    const l = a.filter((d) => !this._removedDuringSend.has(d.id));
    this._removedDuringSend.clear();
    const u = {
      createdAt: /* @__PURE__ */ new Date(),
      role: this.role,
      content: r ? [{
        type: "text",
        text: r
      }] : [],
      attachments: l,
      runConfig: this.runConfig,
      metadata: { custom: { ...o ? { quote: o } : {} } }
    }, h = this.handleSend(u, t);
    h && h.catch(() => {
    }), this._notifyEventSubscribers("send", {});
  }
  cancel() {
    this.handleCancel();
  }
  get queue() {
    return or;
  }
  steerQueueItem(t) {
  }
  removeQueueItem(t) {
  }
  async addAttachment(t) {
    if (Rm(t)) {
      const r = this.getAttachmentAdapter();
      if (r && !Ur({
        name: t.name,
        type: t.contentType ?? ""
      }, r.accept)) {
        const i = `File type ${t.contentType || "unknown"} is not accepted. Accepted types: ${r.accept}`, a = new Error(i);
        throw this._safeEmitAttachmentAddError("not-accepted", i, void 0, a), a;
      }
      const o = {
        id: t.id ?? nt(),
        type: t.type ?? "document",
        name: t.name,
        contentType: t.contentType,
        content: t.content,
        status: { type: "complete" }
      };
      this._attachments = [...this._attachments, o], this._notifySubscribers(), this._notifyEventSubscribers("attachmentAdd", {});
      return;
    }
    const e = (r) => {
      const o = this._attachments.findIndex((i) => i.id === r.id);
      o !== -1 ? this._attachments = [
        ...this._attachments.slice(0, o),
        r,
        ...this._attachments.slice(o + 1)
      ] : this._attachments = [...this._attachments, r], this._notifySubscribers();
    }, s = this.getAttachmentAdapter();
    if (!s) {
      const r = "Attachments are not supported", o = /* @__PURE__ */ new Error(r);
      throw this._safeEmitAttachmentAddError("no-adapter", r, void 0, o), o;
    }
    if (!Ur({
      name: t.name,
      type: t.type
    }, s.accept)) {
      const r = `File type ${t.type || "unknown"} is not accepted. Accepted types: ${s.accept}`, o = new Error(r);
      throw this._safeEmitAttachmentAddError("not-accepted", r, void 0, o), o;
    }
    let n;
    try {
      const r = s.add({ file: t });
      if (Symbol.asyncIterator in r) for await (const o of r)
        n = o, e(o);
      else
        n = await r, e(n);
    } catch (r) {
      throw n && e({
        ...n,
        status: {
          type: "incomplete",
          reason: "error",
          message: r instanceof Error ? r.message : String(r)
        }
      }), this._safeEmitAttachmentAddError("adapter-error", r instanceof Error ? r.message : String(r), n?.id, r instanceof Error ? r : void 0), r;
    }
    n?.status.type === "incomplete" && n.status.reason === "error" ? this._safeEmitAttachmentAddError("adapter-error", n.status.message ?? "Attachment upload did not complete successfully.", n.id) : this._notifyEventSubscribers("attachmentAdd", {});
  }
  _safeEmitAttachmentAddError(t, e, s, n) {
    try {
      this._notifyEventSubscribers("attachmentAddError", {
        reason: t,
        message: e,
        ...s !== void 0 && { attachmentId: s },
        ...n !== void 0 && { error: n }
      });
    } catch (r) {
      console.error("[assistant-ui] attachmentAddError subscriber threw:", r);
    }
  }
  async removeAttachment(t) {
    const e = this._attachments.findIndex((n) => n.id === t);
    if (e === -1) throw new Error("Attachment not found");
    const s = this._attachments[e];
    if (this._isSending && this._removedDuringSend.add(t), !Hs(s)) {
      const n = this.getAttachmentAdapter();
      if (!n) throw new Error("Attachments are not supported");
      await n.remove(s);
    }
    this._attachments = this._attachments.filter((n) => n.id !== t), this._notifySubscribers();
  }
  _dictation;
  _dictationSession;
  _dictationUnsubscribes = [];
  _dictationBaseText = "";
  _currentInterimText = "";
  _dictationSessionIdCounter = 0;
  _activeDictationSessionId;
  _isCleaningDictation = !1;
  get dictation() {
    return this._dictation;
  }
  _isActiveSession(t, e) {
    return this._activeDictationSessionId === t && this._dictationSession === e;
  }
  startDictation() {
    const t = this.getDictationAdapter();
    if (!t) throw new Error("Dictation adapter not configured");
    if (this._dictationSession) {
      for (const c of this._dictationUnsubscribes) c();
      this._dictationUnsubscribes = [], this._dictationSession.stop().catch(() => {
      }), this._dictationSession = void 0;
    }
    const e = t.disableInputDuringDictation ?? !1;
    this._dictationBaseText = this._text, this._currentInterimText = "";
    const s = t.listen();
    this._dictationSession = s;
    const n = ++this._dictationSessionIdCounter;
    this._activeDictationSessionId = n, this._dictation = {
      status: s.status,
      inputDisabled: e
    }, this._notifySubscribers();
    const r = s.onSpeech((c) => {
      if (!this._isActiveSession(n, s)) return;
      const l = c.isFinal !== !1, u = this._dictationBaseText && !this._dictationBaseText.endsWith(" ") && c.transcript ? " " : "";
      if (l) {
        if (this._dictationBaseText = this._dictationBaseText + u + c.transcript, this._currentInterimText = "", this._text = this._dictationBaseText, this._dictation) {
          const { transcript: h, ...d } = this._dictation;
          this._dictation = d;
        }
        this._notifySubscribers();
      } else
        this._currentInterimText = u + c.transcript, this._text = this._dictationBaseText + this._currentInterimText, this._dictation && (this._dictation = {
          ...this._dictation,
          transcript: c.transcript
        }), this._notifySubscribers();
    });
    this._dictationUnsubscribes.push(r);
    const o = s.onSpeechStart(() => {
      this._isActiveSession(n, s) && (this._dictation = {
        status: { type: "running" },
        inputDisabled: e,
        ...this._dictation?.transcript && { transcript: this._dictation.transcript }
      }, this._notifySubscribers());
    });
    this._dictationUnsubscribes.push(o);
    const i = s.onSpeechEnd(() => {
      this._cleanupDictation({ sessionId: n });
    });
    this._dictationUnsubscribes.push(i);
    const a = setInterval(() => {
      this._isActiveSession(n, s) && s.status.type === "ended" && this._cleanupDictation({ sessionId: n });
    }, 100);
    this._dictationUnsubscribes.push(() => clearInterval(a));
  }
  stopDictation() {
    if (!this._dictationSession) return;
    const t = this._dictationSession, e = this._activeDictationSessionId;
    t.stop().finally(() => {
      this._cleanupDictation({ sessionId: e });
    });
  }
  _cleanupDictation(t) {
    if (!(t?.sessionId !== void 0 && t.sessionId !== this._activeDictationSessionId || this._isCleaningDictation)) {
      this._isCleaningDictation = !0;
      try {
        for (const e of this._dictationUnsubscribes) e();
        this._dictationUnsubscribes = [], this._dictationSession = void 0, this._activeDictationSessionId = void 0, this._dictation = void 0, this._dictationBaseText = "", this._currentInterimText = "", this._notifySubscribers();
      } finally {
        this._isCleaningDictation = !1;
      }
    }
  }
  _eventSubscribers = /* @__PURE__ */ new Map();
  _notifyEventSubscribers(t, e) {
    const s = this._eventSubscribers.get(t);
    s && Ms(s, e, `Composer runtime "${t}"`);
  }
  unstable_on(t, e) {
    const s = e;
    let n = this._eventSubscribers.get(t);
    return n || (n = /* @__PURE__ */ new Set(), this._eventSubscribers.set(t, n)), n.add(s), () => {
      this._eventSubscribers.get(t)?.delete(s);
    };
  }
}, Am = class extends ea {
  _canCancel = !1;
  get canCancel() {
    return this._canCancel;
  }
  get canSend() {
    return !this.isEmpty && !this.runtime.isSendDisabled && !this._isSending;
  }
  get queue() {
    return this.runtime.getQueueItems?.() ?? or;
  }
  steerQueueItem(t) {
    this.runtime.steerQueueItem?.(t);
  }
  removeQueueItem(t) {
    this.runtime.removeQueueItem?.(t);
  }
  getAttachmentAdapter() {
    return this.runtime.adapters?.attachments;
  }
  getDictationAdapter() {
    return this.runtime.adapters?.dictation;
  }
  runtime;
  constructor(t) {
    super(), this.runtime = t, this.connect();
  }
  connect() {
    let t = this.runtime.isSendDisabled, e = this.queue;
    return this.runtime.subscribe(() => {
      let s = !1;
      this.canCancel !== this.runtime.capabilities.cancel && (this._canCancel = this.runtime.capabilities.cancel, s = !0), t !== this.runtime.isSendDisabled && (t = this.runtime.isSendDisabled, s = !0), e !== this.queue && (e = this.queue, s = !0), s && this._notifySubscribers();
    });
  }
  async handleSend(t, e) {
    const s = Bi(this.runtime.getModelContext().unstable_composerMetadata, this.runtime.messages), n = this.enrichWithComposerMetadata(t, s);
    return this.runtime.append({
      ...n,
      parentId: this.runtime.messages.at(-1)?.id ?? null,
      sourceId: null,
      startRun: e?.startRun,
      steer: e?.steer
    });
  }
  async handleCancel() {
    this.runtime.cancelRun();
  }
}, Mm = class extends ea {
  get canCancel() {
    return !0;
  }
  get canSend() {
    return !this.isEmpty && !this._isSending;
  }
  getAttachmentAdapter() {
    return this.runtime.adapters?.attachments;
  }
  getDictationAdapter() {
    return this.runtime.adapters?.dictation;
  }
  _previousText;
  _previousAttachments;
  _nonTextPassthrough;
  _parentId;
  _sourceId;
  runtime;
  endEditCallback;
  constructor(t, e, { parentId: s, message: n }) {
    super(), this.runtime = t, this.endEditCallback = e, this._parentId = s, this._sourceId = n.id, this._previousText = Lt(n), this.setText(this._previousText), this.setRole(n.role), n.role === "user" ? (this._previousAttachments = [...n.attachments ?? [], ...Em(n.content)], this._nonTextPassthrough = []) : (this._previousAttachments = n.attachments ?? [], this._nonTextPassthrough = n.content.filter((r) => r.type !== "text")), this.setAttachments(this._previousAttachments), this.setRunConfig({ ...t.composer.runConfig });
  }
  get parentId() {
    return this._parentId;
  }
  get sourceId() {
    return this._sourceId;
  }
  async handleSend(t, e) {
    let s;
    const n = Lt(t), r = !Tm(t.attachments ?? [], this._previousAttachments);
    if (n !== this._previousText || r || e?.startRun) {
      const o = this._nonTextPassthrough.length > 0 ? [...t.content, ...this._nonTextPassthrough] : t.content, i = this.runtime.messages, a = this._parentId === null ? -1 : i.findIndex((u) => u.id === this._parentId), c = Bi(this.runtime.getModelContext().unstable_composerMetadata, i.slice(0, a + 1)), l = this.enrichWithComposerMetadata(t, c);
      s = this.runtime.append({
        ...l,
        content: o,
        parentId: this._parentId,
        sourceId: this._sourceId,
        startRun: e?.startRun
      });
    }
    return this.handleCancel(), s;
  }
  handleCancel() {
    this.endEditCallback(), this._notifySubscribers();
  }
}, Dm = class {
  _subscriptions = /* @__PURE__ */ new Set();
  _isInitialized = !1;
  repository = new Ki();
  _voiceMessages = [];
  _voiceGeneration = 0;
  _cachedMergedMessages = null;
  _cachedVoiceGeneration = -1;
  _cachedMergedBase = null;
  _markVoiceMessagesDirty() {
    this._voiceGeneration++, this._cachedMergedMessages = null;
  }
  _getBaseMessages() {
    return this.repository.getMessages();
  }
  get messages() {
    if (this._voiceMessages.length === 0) return this._getBaseMessages();
    const t = this._getBaseMessages();
    return (this._cachedVoiceGeneration !== this._voiceGeneration || this._cachedMergedBase !== t) && (this._cachedMergedMessages = [...t, ...this._voiceMessages], this._cachedVoiceGeneration = this._voiceGeneration, this._cachedMergedBase = t), this._cachedMergedMessages;
  }
  get state() {
    let t;
    for (const e of this.messages) e.role === "assistant" && (t = e);
    return t?.metadata.unstable_state ?? null;
  }
  composer = new Am(this);
  _contextProvider;
  constructor(t) {
    this._contextProvider = t;
  }
  getModelContext() {
    return this._contextProvider.getModelContext();
  }
  _editComposers = /* @__PURE__ */ new Map();
  getEditComposer(t) {
    return this._editComposers.get(t);
  }
  beginEdit(t) {
    if (this._editComposers.has(t)) throw new Error("Edit already in progress");
    this._editComposers.set(t, new Mm(this, () => this._editComposers.delete(t), this.repository.getMessage(t))), this._notifySubscribers();
  }
  getMessageById(t) {
    try {
      return this.repository.getMessage(t);
    } catch {
      const e = this.repository.getMessages(), s = this._voiceMessages.findIndex((n) => n.id === t);
      return s !== -1 ? {
        parentId: s > 0 ? this._voiceMessages[s - 1].id : e.at(-1)?.id ?? null,
        message: this._voiceMessages[s],
        index: e.length + s
      } : void 0;
    }
  }
  getBranches(t) {
    return this._voiceMessages.some((e) => e.id === t) ? [] : this.repository.getBranches(t);
  }
  switchToBranch(t) {
    this.repository.switchToBranch(t), this._notifySubscribers();
  }
  _notifySubscribers() {
    for (const t of this._subscriptions) t();
  }
  _notifyEventSubscribers(t, e) {
    const s = this._eventSubscribers.get(t);
    s && Ms(s, e, `Thread runtime "${t}"`);
  }
  subscribe(t) {
    return this._subscriptions.add(t), () => this._subscriptions.delete(t);
  }
  submitFeedback({ messageId: t, type: e }) {
    const s = this.adapters?.feedback;
    if (!s) throw new Error("Feedback adapter not configured");
    const { message: n, parentId: r } = this.repository.getMessage(t);
    if (s.submit({
      message: n,
      type: e
    }), n.role === "assistant") {
      const o = {
        ...n,
        metadata: {
          ...n.metadata,
          submittedFeedback: { type: e }
        }
      };
      this.repository.addOrUpdateMessage(r, o);
    }
    this._notifySubscribers();
  }
  _stopSpeaking;
  speech;
  speak(t) {
    const e = this.adapters?.speech;
    if (!e) throw new Error("Speech adapter not configured");
    const { message: s } = this.repository.getMessage(t);
    this._stopSpeaking?.();
    const n = e.speak(Lt(s)), r = n.subscribe(() => {
      n.status.type === "ended" ? (this._stopSpeaking = void 0, this.speech = void 0) : this.speech = {
        messageId: t,
        status: n.status
      }, this._notifySubscribers();
    });
    this.speech = {
      messageId: t,
      status: n.status
    }, this._notifySubscribers(), this._stopSpeaking = () => {
      n.cancel(), r(), this.speech = void 0, this._stopSpeaking = void 0;
    };
  }
  stopSpeaking() {
    if (!this._stopSpeaking) throw new Error("No message is being spoken");
    this._stopSpeaking(), this._notifySubscribers();
  }
  _voiceSession;
  _voiceUnsubs = [];
  voice;
  _voiceVolume = 0;
  _voiceVolumeSubscribers = /* @__PURE__ */ new Set();
  getVoiceVolume = () => this._voiceVolume;
  subscribeVoiceVolume = (t) => (this._voiceVolumeSubscribers.add(t), () => this._voiceVolumeSubscribers.delete(t));
  connectVoice() {
    const t = this.adapters?.voice;
    if (!t) throw new Error("Voice adapter not configured");
    this.disconnectVoice();
    const e = t.connect({});
    this._voiceSession = e;
    const s = [];
    let n = "listening";
    this.voice = {
      status: e.status,
      isMuted: e.isMuted,
      mode: n
    }, this._voiceVolume = 0, this._notifySubscribers(), s.push(e.onStatusChange((r) => {
      r.type === "ended" ? (this._finishVoiceAssistantMessage(), this._voiceSession = void 0, this.voice = void 0) : this.voice = {
        status: r,
        isMuted: e.isMuted,
        mode: n
      }, this._notifySubscribers();
    })), s.push(e.onModeChange((r) => {
      n = r, this.voice && (this.voice = {
        ...this.voice,
        mode: r
      }, this._notifySubscribers());
    })), s.push(e.onVolumeChange((r) => {
      this._voiceVolume = r;
      for (const o of this._voiceVolumeSubscribers) o();
    })), s.push(e.onTranscript((r) => {
      this._handleVoiceTranscript(r);
    })), this._voiceUnsubs = s;
  }
  _currentAssistantMsg = null;
  _handleVoiceTranscript(t) {
    if (this.ensureInitialized(), t.role === "user")
      this._finishVoiceAssistantMessage(), this._currentAssistantMsg = null, t.isFinal && (this._voiceMessages.push({
        id: nt(),
        role: "user",
        content: [{
          type: "text",
          text: t.text
        }],
        metadata: { custom: {} },
        createdAt: /* @__PURE__ */ new Date(),
        status: {
          type: "complete",
          reason: "unknown"
        },
        attachments: []
      }), this._markVoiceMessagesDirty(), this._notifySubscribers());
    else {
      if (!this._currentAssistantMsg)
        this._currentAssistantMsg = {
          id: nt(),
          role: "assistant",
          content: [{
            type: "text",
            text: t.text
          }],
          metadata: {
            unstable_state: this.state,
            unstable_annotations: [],
            unstable_data: [],
            steps: [],
            custom: {}
          },
          status: { type: "running" },
          createdAt: /* @__PURE__ */ new Date()
        }, this._voiceMessages.push(this._currentAssistantMsg);
      else {
        const e = this._voiceMessages.indexOf(this._currentAssistantMsg);
        if (e === -1) return;
        const s = {
          ...this._currentAssistantMsg,
          content: [{
            type: "text",
            text: t.text
          }],
          ...t.isFinal ? { status: {
            type: "complete",
            reason: "stop"
          } } : {}
        };
        this._voiceMessages[e] = s, this._currentAssistantMsg = s;
      }
      t.isFinal && (this._currentAssistantMsg = null), this._markVoiceMessagesDirty(), this._notifySubscribers();
    }
  }
  _finishVoiceAssistantMessage() {
    const t = this._voiceMessages.at(-1);
    if (t?.role === "assistant" && t.status.type === "running") {
      const e = this._voiceMessages.length - 1;
      this._voiceMessages[e] = {
        ...t,
        status: {
          type: "complete",
          reason: "stop"
        }
      }, this._markVoiceMessagesDirty(), this._notifySubscribers();
    }
  }
  disconnectVoice() {
    this._finishVoiceAssistantMessage(), this._currentAssistantMsg = null;
    for (const t of this._voiceUnsubs) t();
    this._voiceUnsubs = [], this._voiceSession?.disconnect(), this._voiceSession = void 0, this.voice = void 0, this._voiceVolume = 0;
    for (const t of this._voiceVolumeSubscribers) t();
    this._voiceMessages = [], this._markVoiceMessagesDirty(), this._notifySubscribers();
  }
  muteVoice() {
    if (!this._voiceSession) throw new Error("No active voice session");
    this._voiceSession.mute(), this.voice = {
      ...this.voice,
      isMuted: !0
    }, this._notifySubscribers();
  }
  unmuteVoice() {
    if (!this._voiceSession) throw new Error("No active voice session");
    this._voiceSession.unmute(), this.voice = {
      ...this.voice,
      isMuted: !1
    }, this._notifySubscribers();
  }
  ensureInitialized() {
    this._isInitialized || (this._isInitialized = !0, this._notifyEventSubscribers("initialize", {}));
  }
  export() {
    return this.repository.export();
  }
  import(t) {
    this.ensureInitialized(), this.repository.clear(), this.repository.import(t), this._notifySubscribers();
  }
  reset(t) {
    this.import(Zi.fromArray(t ?? []));
  }
  _eventSubscribers = /* @__PURE__ */ new Map();
  unstable_on(t, e) {
    const s = e;
    if (t === "modelContextUpdate") return this._contextProvider.subscribe?.(() => s({})) ?? (() => {
    });
    let n = this._eventSubscribers.get(t);
    return n || (n = /* @__PURE__ */ new Set(), this._eventSubscribers.set(t, n)), n.add(s), t === "initialize" && this._isInitialized && queueMicrotask(() => {
      n.has(s) && s({});
    }), () => {
      this._eventSubscribers.get(t)?.delete(s);
    };
  }
}, zr = class {
  cache = /* @__PURE__ */ new WeakMap();
  convertMessages(t, e) {
    return t.map((s, n) => {
      const r = e(this.cache.get(s), s, n);
      return this.cache.set(s, r), r;
    });
  }
};
const Zt = (t) => {
  try {
    return JSON.parse(t), !0;
  } catch {
    return !1;
  }
}, Hr = (t) => {
  try {
    return JSON.parse(t);
  } catch {
    return;
  }
}, Gr = (t, e) => {
  const s = Hr(t), n = Hr(e);
  return s === void 0 || n === void 0 ? !1 : er(s, n);
};
var km = class {
  _getTools;
  _callbacks;
  _entries = /* @__PURE__ */ new Map();
  /**
  * Tool call ids whose `execute` should be short-circuited in the wrapper.
  * Populated when an entry is created with a result already attached
  * (history reload, mid-run resume, etc.) — `execute` is suppressed so
  * client-side side effects don't double-run. Membership outlives the
  * entry: `reset()` deliberately does *not* clear this so post-abort
  * cancellation `result` chunks for pre-resolved entries can still be
  * recognized and dropped. Growth is bounded by the number of pre-resolved
  * tool calls observed in the session.
  */
  _skipExecuteStreamIds = /* @__PURE__ */ new Set();
  _humanInput = /* @__PURE__ */ new Map();
  /** In-flight `execute` invocations keyed by tool call id. */
  _executing = /* @__PURE__ */ new Set();
  _settledResolvers = [];
  _statuses = /* @__PURE__ */ new Map();
  _ac = new AbortController();
  _pendingRestore = !0;
  /** Cached last snapshot, used to skip processing on identical re-renders. */
  _lastSnapshot = null;
  _isRunning = !1;
  _controller;
  /**
  * Set when the assistant-stream pipeline has died (errored out via
  * `.pipeTo(...).catch(...)`). The next `setState` re-initializes the
  * pipeline and demotes all active entries to restored so they survive
  * across the restart without re-firing `streamCall` (preserves the
  * "exactly once" contract). Capped at a single auto-restart per session
  * — repeated failures keep the tracker dead with a more visible error.
  */
  _pipelineDead = !1;
  _pipelineRestartUsed = !1;
  constructor(t, e) {
    this._getTools = t, this._callbacks = e, this._initPipeline();
  }
  /**
  * Build the assistant-stream pipeline. Called once from the constructor
  * and at most once again if `_pipelineDead` is set (see F.4 in
  * EDGE_CASES.md).
  */
  _initPipeline() {
    const [t, e] = _h();
    this._controller = e;
    const s = $h(() => this._getWrappedTools(), () => this._ac.signal, (n, r) => this._onHumanInput(n, r), {
      onExecutionStart: (n) => this._onExecutionStart(n),
      onExecutionEnd: (n) => this._onExecutionEnd(n)
    });
    t.pipeThrough(s).pipeThrough(new Vi()).pipeTo(new WritableStream({ write: (n) => {
      try {
        if (n.type !== "result") return;
        this._handleResultChunk(n);
      } catch (r) {
        console.error("[ToolInvocationTracker] result chunk handling failed", r);
      }
    } })).catch((n) => {
      console.error("[ToolInvocationTracker] stream pipeline failed; will attempt single restart on next setState", n), this._pipelineDead = !0;
    });
  }
  /**
  * Feed the next observed snapshot into the tracker. Called from the host
  * runtime whenever its message list / running state changes.
  */
  setState(t) {
    try {
      if (this._pipelineDead) {
        if (this._pipelineRestartUsed) return;
        this._pipelineRestartUsed = !0, this._pipelineDead = !1, this._demoteEntriesToRestored(), this._executing.clear(), this._ac = new AbortController(), this._initPipeline();
      }
      if (this._lastSnapshot && this._lastSnapshot.messages === t.messages && this._lastSnapshot.isRunning === t.isRunning && this._lastSnapshot.isLoading === t.isLoading) return;
      t.isLoading === !0 && (this._pendingRestore = !0);
      const e = this._isRunning;
      this._isRunning = t.isRunning;
      try {
        this._processMessages(t.messages);
      } catch (s) {
        throw this._isRunning = e, s;
      }
      this._lastSnapshot = t, this._pendingRestore = !1;
    } catch (e) {
      console.error("[ToolInvocationTracker] setState failed; snapshot dropped", e);
    }
  }
  /**
  * Reset the tracker so the next observed snapshot is treated as historical.
  * Clears entries and aborts any in-flight executions. Used by callers like
  * `importExternalState` to mark a freshly loaded state as restored.
  */
  reset() {
    try {
      this._pendingRestore = !0, this._entries.clear(), this._lastSnapshot = null, this.abort().finally(() => {
        this._executing.clear();
      });
    } catch (t) {
      console.error("[ToolInvocationTracker] reset failed", t);
    }
  }
  /**
  * Abort any in-flight `execute()` invocations. Resolves once all of them
  * have settled (or immediately if none are running).
  */
  abort() {
    try {
      return this._humanInput.forEach(({ reject: t }) => {
        try {
          t(/* @__PURE__ */ new Error("Tool execution aborted"));
        } catch {
        }
      }), this._humanInput.clear(), this._ac.abort(), this._ac = new AbortController(), this._executing.size === 0 ? Promise.resolve() : new Promise((t) => {
        this._settledResolvers.push(t);
      });
    } catch (t) {
      return console.error("[ToolInvocationTracker] abort failed", t), Promise.resolve();
    }
  }
  /**
  * Resolve a pending human-input request for the given tool call. Returns
  * `true` if a pending request was resumed, `false` if the tracker has no
  * outstanding request for that id (the caller should fall back to its own
  * dispatch path).
  */
  resume(t, e) {
    try {
      const s = this._humanInput.get(t);
      return s ? (this._humanInput.delete(t), this._setStatus(t, { type: "executing" }), s.resolve(e), !0) : !1;
    } catch (s) {
      return console.error("[ToolInvocationTracker] resume failed", s), !1;
    }
  }
  /**
  * Returns the current tool execution status map. The returned `Map` is
  * the tracker's internal store — do not mutate it. Treat the reference
  * as a snapshot that may be replaced wholesale on the next status
  * transition.
  */
  getStatuses() {
    return this._statuses;
  }
  _getWrappedTools() {
    const t = this._getTools();
    if (t)
      return Object.fromEntries(Object.entries(t).map(([e, s]) => {
        const n = s.execute;
        return n === void 0 ? [e, s] : [e, {
          ...s,
          execute: (...[r, o]) => this._skipExecuteStreamIds.has(o.toolCallId) ? new Promise(() => {
          }) : n(r, o)
        }];
      }));
  }
  _onHumanInput(t, e) {
    return new Promise((s, n) => {
      const r = this._humanInput.get(t);
      if (r) try {
        r.reject(/* @__PURE__ */ new Error("Human input request was superseded by a new request"));
      } catch {
      }
      this._humanInput.set(t, {
        resolve: s,
        reject: n
      }), this._setStatus(t, {
        type: "interrupt",
        payload: {
          type: "human",
          payload: e
        }
      });
    });
  }
  _onExecutionStart(t) {
    this._skipExecuteStreamIds.has(t) || (this._executing.add(t), this._setStatus(t, { type: "executing" }));
  }
  _onExecutionEnd(t) {
    this._executing.delete(t) && (this._deleteStatus(t), this._executing.size === 0 && this._settledResolvers.splice(0).forEach((e) => {
      try {
        e();
      } catch {
      }
    }));
  }
  _handleResultChunk(t) {
    const e = t.meta.toolCallId, s = this._entries.get(e);
    !s && this._skipExecuteStreamIds.has(e) || s?.hasResult || this._invokeOnResult({
      type: "add-tool-result",
      toolCallId: e,
      toolName: t.meta.toolName,
      result: t.result,
      isError: t.isError,
      ...t.artifact !== void 0 && { artifact: t.artifact },
      ...t.modelContent !== void 0 && { modelContent: t.modelContent }
    });
  }
  _invokeOnResult(t) {
    try {
      this._callbacks.onResult(t);
    } catch (e) {
      console.error("[ToolInvocationTracker] onResult callback threw; result dropped", e);
    }
  }
  _invokeOnStatusesChange() {
    try {
      this._callbacks.onStatusesChange(this._statuses);
    } catch (t) {
      console.error("[ToolInvocationTracker] onStatusesChange callback threw; status change not propagated", t);
    }
  }
  _setStatus(t, e) {
    const s = new Map(this._statuses);
    s.set(t, e), this._statuses = s, this._invokeOnStatusesChange();
  }
  _deleteStatus(t) {
    if (!this._statuses.has(t)) return;
    const e = new Map(this._statuses);
    e.delete(t), this._statuses = e, this._invokeOnStatusesChange();
  }
  _hasExecutableTool(t) {
    const e = this._getTools()?.[t];
    return e?.execute !== void 0 || e?.streamCall !== void 0;
  }
  _shouldCloseArgsStream({ toolName: t, argsText: e, hasResult: s }) {
    return s ? !0 : (this._hasExecutableTool(t) || !this._isRunning) && Zt(e);
  }
  _startActiveEntry(t, e, s) {
    const n = this._controller.addToolCallPart({
      toolName: e,
      toolCallId: t
    });
    s && this._skipExecuteStreamIds.add(t);
    const r = {
      toolName: e,
      controller: n,
      argsText: "",
      hasResult: !1,
      argsComplete: !1
    };
    return this._entries.set(t, r), r;
  }
  /**
  * Demote every active entry back to the restored phase. Used by the
  * pipeline-restart path so that, after a fresh pipeline is built, the
  * next observed snapshot does not re-fire `streamCall` for tool calls
  * that already fired pre-death. Args / hasResult tracking is preserved
  * so signature comparisons still work.
  */
  _demoteEntriesToRestored() {
    for (const [t, e] of this._entries)
      e.controller && this._entries.set(t, {
        toolName: e.toolName,
        argsText: e.argsText,
        hasResult: e.hasResult
      });
  }
  _processArgsText(t, e) {
    if (!t.controller) return;
    const s = e.result !== void 0;
    if (e.argsText !== t.argsText) {
      let n = !0;
      if (t.argsComplete) Gr(t.argsText, e.argsText) && (t.argsText = e.argsText), n = !1;
      else if (!e.argsText.startsWith(t.argsText)) if (Zt(t.argsText) && Zt(e.argsText) && Gr(t.argsText, e.argsText)) {
        const r = this._shouldCloseArgsStream({
          toolName: e.toolName,
          argsText: e.argsText,
          hasResult: s
        });
        r && t.controller.argsText.close(), t.argsText = e.argsText, t.argsComplete = r, n = !1;
      } else
        n = !1;
      if (n && t.controller) {
        const r = e.argsText.slice(t.argsText.length);
        t.controller.argsText.append(r);
        const o = this._shouldCloseArgsStream({
          toolName: e.toolName,
          argsText: e.argsText,
          hasResult: s
        });
        o && t.controller.argsText.close(), t.argsText = e.argsText, t.argsComplete = o;
      }
    }
    !t.argsComplete && t.controller && this._shouldCloseArgsStream({
      toolName: e.toolName,
      argsText: t.argsText,
      hasResult: s
    }) && (t.controller.argsText.close(), t.argsComplete = !0);
  }
  _processMessages(t) {
    const e = this._pendingRestore;
    for (const s of t)
      if (!(!s || !Array.isArray(s.content)))
        for (const n of s.content) {
          if (!n || n.type !== "tool-call") continue;
          const r = this._entries.get(n.toolCallId);
          if (e) {
            r?.controller || this._entries.set(n.toolCallId, {
              toolName: n.toolName,
              argsText: n.argsText,
              hasResult: n.result !== void 0
            }), n.messages && this._processMessages(n.messages);
            continue;
          }
          let o = r;
          if (o && !o.controller) {
            if (!(n.argsText !== o.argsText || n.result !== void 0 !== o.hasResult)) {
              n.messages && this._processMessages(n.messages);
              continue;
            }
            this._entries.delete(n.toolCallId), o = void 0;
          }
          if (o || (o = this._startActiveEntry(n.toolCallId, n.toolName, n.result !== void 0)), this._processArgsText(o, n), n.result !== void 0 && !o.hasResult) {
            const { controller: i } = o;
            if (!i) continue;
            o.hasResult = !0, o.argsComplete = !0, i.setResponse(new Be({
              result: n.result,
              artifact: n.artifact,
              isError: n.isError,
              ...n.modelContent !== void 0 ? { modelContent: n.modelContent } : {}
            })), i.close();
          }
          n.messages && this._processMessages(n.messages);
        }
  }
};
const Pm = Object.freeze([]), Wr = (t, e) => {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length) return !1;
  for (const n of s) if (t[n] !== e[n]) return !1;
  return !0;
}, $m = (t, e) => t && e[e.length - 1]?.role !== "assistant";
var Nm = class extends Dm {
  _capabilities = {
    switchToBranch: !1,
    switchBranchDuringRun: !1,
    edit: !1,
    delete: !1,
    reload: !1,
    cancel: !1,
    unstable_copy: !1,
    speech: !1,
    dictation: !1,
    voice: !1,
    attachments: !1,
    feedback: !1,
    queue: !1
  };
  get capabilities() {
    return this._capabilities;
  }
  _messages;
  isDisabled;
  isSendDisabled;
  get isLoading() {
    return this._store.isLoading ?? !1;
  }
  get isRunning() {
    return this._store.isRunning;
  }
  _getBaseMessages() {
    return this._messages;
  }
  get state() {
    return this._store.state ?? super.state;
  }
  get adapters() {
    return this._store.adapters;
  }
  suggestions = [];
  extras = void 0;
  _converter = new zr();
  _store;
  /**
  * Client-side tool-invocations pipeline. Constructed lazily on first
  * snapshot — only when `adapter.unstable_enableToolInvocations === true`.
  */
  _toolInvocations = null;
  beginEdit(t) {
    if (!this._store.onEdit) throw new Error("Runtime does not support editing.");
    super.beginEdit(t);
  }
  constructor(t, e) {
    super(t), this.__internal_setAdapter(e);
  }
  __internal_setAdapter(t) {
    if (this._store === t) return;
    const e = t.isRunning ?? !1;
    this.isDisabled = t.isDisabled ?? !1, this.isSendDisabled = t.isSendDisabled ?? !1;
    const s = this._store;
    this._store = t, this.extras !== t.extras && (this.extras = t.extras);
    const n = t.suggestions ?? Pm;
    Wr(this.suggestions, n) || (this.suggestions = n);
    const r = {
      switchToBranch: this._store.setMessages !== void 0,
      switchBranchDuringRun: !1,
      edit: this._store.onEdit !== void 0,
      delete: this._store.onDelete !== void 0 || this._store.setMessages !== void 0,
      reload: this._store.onReload !== void 0,
      cancel: this._store.onCancel !== void 0,
      speech: this._store.adapters?.speech !== void 0,
      dictation: this._store.adapters?.dictation !== void 0,
      voice: this._store.adapters?.voice !== void 0,
      unstable_copy: this._store.unstable_capabilities?.copy !== !1,
      attachments: !!this._store.adapters?.attachments,
      feedback: !!this._store.adapters?.feedback,
      queue: this._store.queue !== void 0
    };
    Wr(this._capabilities, r) || (this._capabilities = r);
    let o;
    if (t.messageRepository) {
      if (s && s.isRunning === t.isRunning && s.messageRepository === t.messageRepository) {
        this._notifySubscribers();
        return;
      }
      const a = t.messageRepository.messages, c = t.messageRepository.headId ?? a.at(-1)?.message.id ?? null;
      if (s && s.messageRepository === t.messageRepository)
        this.repository.resetHead(c), o = this.repository.getMessages();
      else {
        const l = new Set(a.map(({ message: u }) => u.id));
        for (const { message: u, parentId: h } of a) this.repository.addOrUpdateMessage(h, u);
        for (const { message: u } of this.repository.export().messages) l.has(u.id) || this.repository.deleteMessage(u.id);
        this.repository.resetHead(c), o = this.repository.getMessages();
      }
    } else if (t.messages) {
      if (s) {
        if (s.convertMessage !== t.convertMessage) this._converter = new zr();
        else if (s.isRunning === t.isRunning && s.messages === t.messages) {
          this._notifySubscribers();
          return;
        }
      }
      o = t.convertMessage ? this._converter.convertMessages(t.messages, (l, u, h) => {
        if (!t.convertMessage) return u;
        const d = ln(h === (t.messages?.length ?? 0) - 1, e, !1, !1, void 0);
        if (l && (l.role !== "assistant" || !xm(l.status) || l.status === d)) return l;
        const f = ys(t.convertMessage(u, h), h.toString(), d);
        return Gh(f, u), f;
      }) : t.messages;
      const a = /* @__PURE__ */ new Set(), c = [];
      for (let l = o.length - 1; l >= 0; l--) {
        const u = o[l];
        if (a.has(u.id)) {
          console.warn(`ExternalStoreThreadRuntimeCore: duplicate message id "${u.id}" in the provided messages array; keeping the last occurrence.`);
          continue;
        }
        a.add(u.id), c.push(u);
      }
      c.length !== o.length && (o = c.reverse());
      for (let l = 0; l < o.length; l++) {
        const u = o[l], h = o[l - 1];
        this.repository.addOrUpdateMessage(h?.id ?? null, u);
      }
    } else throw new Error("ExternalStoreAdapter must provide either 'messages' or 'messageRepository'");
    o.length > 0 && this.ensureInitialized(), (s?.isRunning ?? !1) !== (t.isRunning ?? !1) && (t.isRunning ? this._notifyEventSubscribers("runStart", {}) : this._notifyEventSubscribers("runEnd", {}));
    let i = null;
    $m(e, o) && (i = nt(), this.repository.addOrUpdateMessage(o.at(-1)?.id ?? null, ys({
      role: "assistant",
      content: [],
      metadata: { isOptimistic: !0 }
    }, i, { type: "running" }))), this.repository.resetHead(i ?? o.at(-1)?.id ?? null), this._messages = this.repository.getMessages(), this._driveToolInvocations(), this._notifySubscribers();
  }
  /**
  * Feed the current message snapshot into the tool-invocations tracker.
  * Opt-in via `adapter.unstable_enableToolInvocations: true`. The tracker
  * itself is fail-silent — see ToolInvocationTracker for the
  * state-transition contract.
  */
  _driveToolInvocations() {
    if (!this._store.unstable_enableToolInvocations) {
      this._toolInvocations && (this._toolInvocations.reset(), this._toolInvocations = null, this._store.setToolStatuses?.({}));
      return;
    }
    this._toolInvocations || (this._toolInvocations = new km(() => this.getModelContext().tools, {
      onResult: (t) => {
        try {
          const e = this._findMessageIdForToolCall(t.toolCallId);
          if (e === void 0) return;
          this._store.onAddToolResult?.({
            messageId: e,
            toolCallId: t.toolCallId,
            toolName: t.toolName,
            result: t.result,
            isError: t.isError,
            ...t.artifact !== void 0 && { artifact: t.artifact },
            ...t.modelContent !== void 0 && { modelContent: t.modelContent }
          });
        } catch (e) {
          console.error("[ExternalStoreThreadRuntimeCore] onAddToolResult dispatch failed", e);
        }
      },
      onStatusesChange: (t) => {
        this._store.setToolStatuses?.(Object.fromEntries(t));
      }
    })), this._toolInvocations.setState({
      messages: this._messages,
      isRunning: this._store.isRunning ?? !1,
      ...this._store.isLoading !== void 0 && { isLoading: this._store.isLoading }
    });
  }
  /**
  * Lookup table from `toolCallId` to the owning assistant message's `id`,
  * rebuilt lazily when `_messages` changes (see `_messagesForToolCallIndex`).
  */
  _toolCallToMessageId = /* @__PURE__ */ new Map();
  _messagesForToolCallIndex = null;
  /**
  * Look up the assistant message that owns a tool-call part. Lazily builds
  * (and caches) a `toolCallId → messageId` map keyed off the current
  * `_messages` reference, so onResult dispatches stay O(1) instead of
  * walking the full thread on every result.
  */
  _findMessageIdForToolCall(t) {
    if (this._messagesForToolCallIndex !== this._messages) {
      this._toolCallToMessageId.clear();
      const e = (s) => {
        for (const n of s)
          if (Array.isArray(n.content))
            for (const r of n.content)
              !r || r.type !== "tool-call" || (this._toolCallToMessageId.set(r.toolCallId, n.id), r.messages && e(r.messages));
      };
      e(this._messages), this._messagesForToolCallIndex = this._messages;
    }
    return this._toolCallToMessageId.get(t);
  }
  switchToBranch(t) {
    if (!this._store.setMessages) throw new Error("Runtime does not support switching branches.");
    if (this._store.isRunning) return;
    const e = this._store.unstable_onBranchChange, s = e ? this.repository.canonicalHeadId : null;
    this.repository.switchToBranch(t), this.updateMessages(this.repository.getMessages()), e && this._notifyBranchChange(s, e);
  }
  /**
  * Emit `unstable_onBranchChange` for an explicit branch switch. Reads the
  * canonical head from the repository (which skips optimistic/transient
  * messages) and de-dupes switches that leave the canonical head unchanged.
  * Comparing against the head observed just before the switch — rather than the
  * last emitted head — keeps a switch firing after an adapter resync moved the
  * head elsewhere in the meantime.
  */
  _notifyBranchChange(t, e) {
    const s = this.repository.canonicalHeadId;
    s !== t && e({
      headId: s,
      visibleMessageIds: this.repository.getMessages().map((n) => n.id)
    });
  }
  async append(t) {
    const e = t.parentId !== (this.messages.at(-1)?.id ?? null);
    if (!e && this._store.queue) {
      this._store.queue.enqueue(t, { steer: t.steer ?? !1 });
      return;
    }
    if ((t.startRun ?? t.role === "user") && await this._toolInvocations?.abort(), e) {
      if (!this._store.onEdit) throw new Error("Runtime does not support editing messages.");
      this._store.queue?.clear("edit"), await this._store.onEdit(t);
    } else await this._store.onNew(t);
  }
  async deleteMessage(t) {
    if (this._store.onDelete) {
      await this._store.onDelete(t);
      return;
    }
    if (!this._store.setMessages) throw new Error("Runtime does not support deleting messages.");
    this._store.isRunning && await this._toolInvocations?.abort();
    const e = this.repository.getMessages();
    if (e.findIndex((s) => s.id === t) === -1) throw new Error("Message not found.");
    this.updateMessages(e.filter((s) => s.id !== t));
  }
  getQueueItems() {
    return this._store?.queue?.items ?? or;
  }
  steerQueueItem(t) {
    this._store?.queue?.steer(t);
  }
  removeQueueItem(t) {
    this._store?.queue?.remove(t);
  }
  async startRun(t) {
    if (!this._store.onReload) throw new Error("Runtime does not support reloading messages.");
    this._store.queue?.clear("reload"), await this._toolInvocations?.abort(), await this._store.onReload(t.parentId, t);
  }
  async resumeRun(t) {
    if (!this._store.onResume) throw new Error("Runtime does not support resuming runs.");
    await this._store.onResume(t);
  }
  exportExternalState() {
    if (!this._store.onExportExternalState) throw new Error("Runtime does not support exporting external states.");
    return this._store.onExportExternalState();
  }
  importExternalState(t) {
    if (!this._store.onLoadExternalState) throw new Error("Runtime does not support importing external states.");
    this._toolInvocations && (this._toolInvocations.reset(), this._store.setToolStatuses?.({})), this._store.onLoadExternalState(t);
  }
  cancelRun() {
    if (!this._store.onCancel) throw new Error("Runtime does not support cancelling runs.");
    this._store.queue?.clear("cancel-run"), this._toolInvocations?.abort(), this._store.onCancel();
    const t = this.repository.getMessages().at(-1);
    t && t.metadata.isOptimistic && t.content.length === 0 && this.repository.deleteMessage(t.id);
    let e = this.repository.getMessages();
    const s = e[e.length - 1];
    s?.role === "user" && s.id === e.at(-1)?.id ? (this.repository.deleteMessage(s.id), this.composer.text.trim() || this.composer.setText(Lt(s)), e = this.repository.getMessages()) : this._notifySubscribers(), setTimeout(() => {
      this.updateMessages(e);
    }, 0);
  }
  addToolResult(t) {
    if (!this._store.onAddToolResult) throw new Error("Runtime does not support tool results.");
    this._store.onAddToolResult?.(t);
  }
  resumeToolCall(t) {
    if (!(this._toolInvocations?.resume(t.toolCallId, t.payload) ?? !1)) {
      if (this._store.onResumeToolCall) {
        this._store.onResumeToolCall(t);
        return;
      }
      throw new Error(`Tool call ${t.toolCallId} is not waiting for resume.`);
    }
  }
  respondToToolApproval(t) {
    if (!this._store.onRespondToToolApproval) throw new Error("Runtime does not support tool approvals.");
    this._store.onRespondToToolApproval(t);
  }
  reset(t) {
    const e = new Ki();
    e.import(Zi.fromArray(t ?? [])), this.updateMessages(e.getMessages());
  }
  import(t) {
    super.import(t), this._store.onImport && this._store.onImport(this.repository.getMessages());
  }
  updateMessages = (t) => {
    this._store.convertMessage !== void 0 ? this._store.setMessages?.(t.flatMap(Wh)) : this._store.setMessages?.(t);
  };
};
const Yr = (t) => t.adapters?.threadList ?? {};
var Om = class extends gm {
  threads;
  constructor(t) {
    super(), this.threads = new ym(Yr(t), () => new Nm(this._contextProvider, t));
  }
  setAdapter(t) {
    this.threads.__internal_setAdapter(Yr(t)), this.threads.getMainThreadRuntimeCore().__internal_setAdapter(t);
  }
};
const Bm = (t) => {
  const e = w(11);
  let s;
  e[0] !== t ? (s = () => new Om(t), e[0] = t, e[1] = s) : s = e[1];
  const [n] = ue(s);
  let r;
  e[2] !== n || e[3] !== t ? (r = () => {
    n.setAdapter(t);
  }, e[2] = n, e[3] = t, e[4] = r) : r = e[4], Z(r);
  const { modelContext: o } = hm() ?? {};
  let i, a;
  e[5] !== o || e[6] !== n ? (i = () => {
    if (o)
      return n.registerModelContextProvider(o);
  }, a = [o, n], e[5] = o, e[6] = n, e[7] = i, e[8] = a) : (i = e[7], a = e[8]), Z(i, a);
  let c;
  return e[9] !== n ? (c = new pm(n), e[9] = n, e[10] = c) : c = e[10], c;
}, Fm = (t) => {
  const e = w(10), { id: s, children: n } = t;
  let r;
  e[0] !== s ? (r = Pe({
    source: "thread",
    query: {
      type: "id",
      id: s
    },
    get: (l) => l.thread().message({ id: s })
  }), e[0] = s, e[1] = r) : r = e[1];
  let o;
  e[2] !== s ? (o = Pe({
    source: "message",
    query: {},
    get: (l) => l.thread().message({ id: s }).composer()
  }), e[2] = s, e[3] = o) : o = e[3];
  let i;
  e[4] !== r || e[5] !== o ? (i = {
    message: r,
    composer: o
  }, e[4] = r, e[5] = o, e[6] = i) : i = e[6];
  const a = oe(i);
  let c;
  return e[7] !== a || e[8] !== n ? (c = /* @__PURE__ */ m(Fe, {
    value: a,
    children: n
  }), e[7] = a, e[8] = n, e[9] = c) : c = e[9], c;
}, ir = (t, e) => t.Message === e.Message && t.EditComposer === e.EditComposer && t.UserEditComposer === e.UserEditComposer && t.AssistantEditComposer === e.AssistantEditComposer && t.SystemEditComposer === e.SystemEditComposer && t.UserMessage === e.UserMessage && t.AssistantMessage === e.AssistantMessage && t.SystemMessage === e.SystemMessage, Lm = () => null, Jr = /* @__PURE__ */ new WeakMap(), Vm = (t, e) => {
  let s = Jr.get(t);
  return s || (s = new Set(t.map((n) => n.id)), Jr.set(t, s)), s.has(e);
}, jm = (t, e, s) => {
  switch (e) {
    case "user":
      return s ? t.UserEditComposer ?? t.EditComposer ?? t.UserMessage ?? t.Message : t.UserMessage ?? t.Message;
    case "assistant":
      return s ? t.AssistantEditComposer ?? t.EditComposer ?? t.AssistantMessage ?? t.Message : t.AssistantMessage ?? t.Message;
    case "system":
      return s ? t.SystemEditComposer ?? t.EditComposer ?? t.SystemMessage ?? t.Message : t.SystemMessage ?? t.Message ?? Lm;
    default:
      throw new Error(`Unknown message role: ${e}`);
  }
}, ar = (t) => {
  const e = w(6), { components: s } = t, n = M(Um), r = M(zm);
  let o;
  e[0] !== s || e[1] !== r || e[2] !== n ? (o = jm(s, n, r), e[0] = s, e[1] = r, e[2] = n, e[3] = o) : o = e[3];
  const i = o;
  let a;
  return e[4] !== i ? (a = /* @__PURE__ */ m(i, {}), e[4] = i, e[5] = a) : a = e[5], a;
}, ta = _e((t) => {
  const e = w(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(ar, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ m(Hi, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && ir(t.components, e.components));
ta.displayName = "ThreadPrimitive.MessageByIndex";
const sa = _e((t) => {
  const e = w(7), { messageId: s, components: n } = t;
  let r;
  if (e[0] !== s ? (r = (a) => Vm(a.thread.messages, s), e[0] = s, e[1] = r) : r = e[1], !M(r)) return null;
  let o;
  e[2] !== n ? (o = /* @__PURE__ */ m(ar, { components: n }), e[2] = n, e[3] = o) : o = e[3];
  let i;
  return e[4] !== s || e[5] !== o ? (i = /* @__PURE__ */ m(Fm, {
    id: s,
    children: o
  }), e[4] = s, e[5] = o, e[6] = i) : i = e[6], i;
}, (t, e) => t.messageId === e.messageId && ir(t.components, e.components));
sa.displayName = "ThreadPrimitive.Unstable_MessageById";
const Qr = ({ children: t }) => {
  const e = M((s) => s.thread.messages.length);
  return he(() => e === 0 ? null : Array.from({ length: e }, (s, n) => /* @__PURE__ */ m(Hi, {
    index: n,
    children: /* @__PURE__ */ m(As, {
      getItemState: (r) => r.thread().message({ index: n }).getState(),
      children: (r) => t({ get message() {
        return r();
      } })
    })
  }, n)), [e, t]);
}, na = (t) => {
  const e = w(4), { components: s, children: n } = t;
  if (s) {
    let o;
    return e[0] !== s ? (o = /* @__PURE__ */ m(Qr, { children: () => /* @__PURE__ */ m(ar, { components: s }) }), e[0] = s, e[1] = o) : o = e[1], o;
  }
  let r;
  return e[2] !== n ? (r = /* @__PURE__ */ m(Qr, { children: n }), e[2] = n, e[3] = r) : r = e[3], r;
};
na.displayName = "ThreadPrimitive.Messages";
const qm = _e(na, (t, e) => t.children || e.children ? t.children === e.children : ir(t.components, e.components));
function Um(t) {
  return t.message.role;
}
function zm(t) {
  return t.message.composer.isEditing;
}
const ra = (t) => {
  const e = t.message.metadata;
  if (!(!e || typeof e != "object"))
    return e.custom?.quote;
};
var Hm = class extends Error {
  componentName;
  constructor(t, e = `Component "${t}" is not in the generative-ui allowlist.`) {
    super(e), this.name = "GenerativeUIRenderError", this.componentName = t;
  }
};
const Gm = (t) => typeof t == "object" && t !== null, oa = (t, e, s, n) => {
  if (t == null) return null;
  if (typeof t == "string") return t;
  if (!Gm(t) || !("component" in t) || typeof t.component != "string")
    return null;
  const { component: r, props: o, children: i, key: a } = t, c = e[r];
  if (!c) {
    if (s) return /* @__PURE__ */ m(s, {
      component: r,
      props: o
    }, a ?? n);
    throw new Hm(r);
  }
  const l = i?.length ? i.map((u, h) => oa(u, e, s, `${n}/${h}`)) : void 0;
  return gc(c, {
    ...o ?? {},
    key: a ?? n
  }, ...l ?? []);
}, Wm = (t) => {
  if (!t || t.root === void 0 || t.root === null) return [];
  const e = t.root;
  return Array.isArray(e) ? e : [e];
}, cr = (t) => {
  const e = w(11), { spec: s, components: n, Fallback: r } = t;
  let o;
  e[0] !== s ? (o = Wm(s), e[0] = s, e[1] = o) : o = e[1];
  const i = o;
  let a;
  if (e[2] !== r || e[3] !== n || e[4] !== i) {
    let l;
    e[6] !== r || e[7] !== n ? (l = (u, h) => oa(u, n, r, `${h}`), e[6] = r, e[7] = n, e[8] = l) : l = e[8], a = i.map(l), e[2] = r, e[3] = n, e[4] = i, e[5] = a;
  } else a = e[5];
  let c;
  return e[9] !== a ? (c = /* @__PURE__ */ m($e, { children: a }), e[9] = a, e[10] = c) : c = e[10], c;
};
cr.displayName = "GenerativeUIRender";
const ia = (t) => {
  const e = w(4), { components: s, spec: n, Fallback: r } = t, o = M(Ym), i = n ?? o;
  if (!i) return null;
  let a;
  return e[0] !== r || e[1] !== s || e[2] !== i ? (a = /* @__PURE__ */ m(cr, {
    spec: i,
    components: s,
    Fallback: r
  }), e[0] = r, e[1] = s, e[2] = i, e[3] = a) : a = e[3], a;
};
ia.displayName = "MessagePrimitive.GenerativeUI";
function Ym(t) {
  const e = t.part;
  return e?.type === "generative-ui" ? e.spec : void 0;
}
const Jm = "ui://", Qm = (t) => !!t?.startsWith(Jm), Xr = (t) => Symbol.iterator in t, Zr = (t) => (
  // HACK: avoid checking entries type
  "entries" in t
), Kr = (t, e) => {
  const s = t instanceof Map ? t : new Map(t.entries()), n = e instanceof Map ? e : new Map(e.entries());
  if (s.size !== n.size)
    return !1;
  for (const [r, o] of s)
    if (!n.has(r) || !Object.is(o, n.get(r)))
      return !1;
  return !0;
}, Xm = (t, e) => {
  const s = t[Symbol.iterator](), n = e[Symbol.iterator]();
  let r = s.next(), o = n.next();
  for (; !r.done && !o.done; ) {
    if (!Object.is(r.value, o.value))
      return !1;
    r = s.next(), o = n.next();
  }
  return !!r.done && !!o.done;
};
function Zm(t, e) {
  return Object.is(t, e) ? !0 : typeof t != "object" || t === null || typeof e != "object" || e === null || Object.getPrototypeOf(t) !== Object.getPrototypeOf(e) ? !1 : Xr(t) && Xr(e) ? Zr(t) && Zr(e) ? Kr(t, e) : Xm(t, e) : Kr(
    { entries: () => Object.entries(t) },
    { entries: () => Object.entries(e) }
  );
}
function un(t) {
  const e = Ne.useRef(void 0);
  return (s) => {
    const n = t(s);
    return Zm(e.current, n) ? e.current : e.current = n;
  };
}
const Gs = (t) => {
  let e = -1;
  return {
    startGroup: (s) => {
      e === -1 && (e = s);
    },
    endGroup: (s, n) => {
      e !== -1 && (n.push({
        type: t,
        startIndex: e,
        endIndex: s
      }), e = -1);
    },
    finalize: (s, n) => {
      e !== -1 && n.push({
        type: t,
        startIndex: e,
        endIndex: s
      });
    }
  };
}, Km = (t, e, s) => {
  const n = [];
  if (e) {
    const r = Gs("chainOfThoughtGroup");
    for (let o = 0; o < t.length; o++) {
      const i = t[o];
      i === "tool-call" || i === "reasoning" ? r.startGroup(o) : (r.endGroup(o - 1, n), n.push({
        type: "single",
        index: o
      }));
    }
    r.finalize(t.length - 1, n);
  } else {
    const r = Gs("toolGroup"), o = Gs("reasoningGroup");
    for (let i = 0; i < t.length; i++) {
      const a = t[i];
      a === "tool-call" ? (o.endGroup(i - 1, n), r.startGroup(i)) : a === "reasoning" ? (r.endGroup(i - 1, n), o.startGroup(i)) : (r.endGroup(i - 1, n), o.endGroup(i - 1, n), n.push({
        type: "single",
        index: i
      }));
    }
    r.finalize(t.length - 1, n), o.finalize(t.length - 1, n);
  }
  if (s) {
    const r = /* @__PURE__ */ new Set();
    for (const o of n) {
      if (o.type === "single") continue;
      const i = s[o.startIndex];
      i !== void 0 && !r.has(i) && (r.add(i), o.idKey = `id:${i}`);
    }
  }
  return n;
}, ef = (t) => {
  const e = w(10), s = M(un(vf)), n = M(un(wf));
  let r;
  e: {
    if (s.length === 0) {
      let a;
      e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (a = [], e[0] = a) : a = e[0];
      let c;
      e[1] !== n ? (c = {
        ranges: a,
        partIds: n
      }, e[1] = n, e[2] = c) : c = e[2], r = c;
      break e;
    }
    let o;
    e[3] !== s || e[4] !== n || e[5] !== t ? (o = Km(s, t, n), e[3] = s, e[4] = n, e[5] = t, e[6] = o) : o = e[6];
    let i;
    e[7] !== n || e[8] !== o ? (i = {
      ranges: o,
      partIds: n
    }, e[7] = n, e[8] = o, e[9] = i) : i = e[9], r = i;
  }
  return r;
}, tf = (t) => {
  const e = w(9);
  let s, n;
  e[0] !== t ? ({ Fallback: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  e[3] !== s || e[4] !== n.toolName ? (r = (a) => a.tools.toolUIs[n.toolName]?.[0]?.render ?? s, e[3] = s, e[4] = n.toolName, e[5] = r) : r = e[5];
  const o = M(r);
  if (!o) return null;
  let i;
  return e[6] !== o || e[7] !== n ? (i = /* @__PURE__ */ m(o, { ...n }), e[6] = o, e[7] = n, e[8] = i) : i = e[8], i;
}, lr = (t, e, s) => {
  const n = t.renderers[e]?.[0];
  return n || (t.fallbacks[0] ?? s);
}, sf = (t) => {
  const e = w(9);
  let s, n;
  e[0] !== t ? ({ Fallback: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  e[3] !== s || e[4] !== n.name ? (r = (a) => lr(a.dataRenderers, n.name, s), e[3] = s, e[4] = n.name, e[5] = r) : r = e[5];
  const o = M(r);
  if (!o) return null;
  let i;
  return e[6] !== o || e[7] !== n ? (i = /* @__PURE__ */ m(o, { ...n }), e[6] = o, e[7] = n, e[8] = i) : i = e[8], i;
}, fe = {
  Text: () => null,
  Reasoning: () => null,
  Source: () => null,
  Image: () => null,
  File: () => null,
  Unstable_Audio: () => null,
  ToolGroup: ({ children: t }) => t,
  ReasoningGroup: ({ children: t }) => t
}, nf = (t) => {
  const e = w(47), { components: s } = t;
  let n;
  e[0] !== s ? (n = s === void 0 ? {} : s, e[0] = s, e[1] = n) : n = e[1];
  const { Text: r, Reasoning: o, Image: i, Source: a, File: c, Unstable_Audio: l, tools: u, data: h, generativeUI: d } = n, f = r === void 0 ? fe.Text : r, p = o === void 0 ? fe.Reasoning : o, v = i === void 0 ? fe.Image : i, _ = a === void 0 ? fe.Source : a, C = c === void 0 ? fe.File : c, I = l === void 0 ? fe.Unstable_Audio : l;
  let E;
  e[2] !== u ? (E = u === void 0 ? {} : u, e[2] = u, e[3] = E) : E = e[3];
  const b = E, y = oe(), T = M(Sf), x = T.type;
  if (x === "tool-call") {
    let S;
    e[4] !== y ? (S = y.part(), e[4] = y, e[5] = S) : S = e[5];
    const j = S.addToolResult;
    let P;
    e[6] !== y ? (P = y.part(), e[6] = y, e[7] = P) : P = e[7];
    const H = P.resumeToolCall;
    let J;
    e[8] !== y ? (J = y.part(), e[8] = y, e[9] = J) : J = e[9];
    const V = J.respondToToolApproval;
    if ("Override" in b) {
      let ce;
      return e[10] !== j || e[11] !== T || e[12] !== V || e[13] !== H || e[14] !== b.Override ? (ce = /* @__PURE__ */ m(b.Override, {
        ...T,
        addResult: j,
        resume: H,
        respondToApproval: V
      }), e[10] = j, e[11] = T, e[12] = V, e[13] = H, e[14] = b.Override, e[15] = ce) : ce = e[15], ce;
    }
    const F = b.by_name?.[T.toolName] ?? b.Fallback;
    let te;
    return e[16] !== F || e[17] !== j || e[18] !== T || e[19] !== V || e[20] !== H ? (te = /* @__PURE__ */ m(tf, {
      ...T,
      Fallback: F,
      addResult: j,
      resume: H,
      respondToApproval: V
    }), e[16] = F, e[17] = j, e[18] = T, e[19] = V, e[20] = H, e[21] = te) : te = e[21], te;
  }
  if (T.status?.type === "requires-action") throw new Error("Encountered unexpected requires-action status");
  switch (x) {
    case "text": {
      let S;
      return e[22] !== f || e[23] !== T ? (S = /* @__PURE__ */ m(f, { ...T }), e[22] = f, e[23] = T, e[24] = S) : S = e[24], S;
    }
    case "reasoning": {
      let S;
      return e[25] !== p || e[26] !== T ? (S = /* @__PURE__ */ m(p, { ...T }), e[25] = p, e[26] = T, e[27] = S) : S = e[27], S;
    }
    case "source": {
      let S;
      return e[28] !== _ || e[29] !== T ? (S = /* @__PURE__ */ m(_, { ...T }), e[28] = _, e[29] = T, e[30] = S) : S = e[30], S;
    }
    case "image": {
      let S;
      return e[31] !== v || e[32] !== T ? (S = /* @__PURE__ */ m(v, { ...T }), e[31] = v, e[32] = T, e[33] = S) : S = e[33], S;
    }
    case "file": {
      let S;
      return e[34] !== C || e[35] !== T ? (S = /* @__PURE__ */ m(C, { ...T }), e[34] = C, e[35] = T, e[36] = S) : S = e[36], S;
    }
    case "audio": {
      let S;
      return e[37] !== I || e[38] !== T ? (S = /* @__PURE__ */ m(I, { ...T }), e[37] = I, e[38] = T, e[39] = S) : S = e[39], S;
    }
    case "data": {
      const S = h?.by_name?.[T.name] ?? h?.Fallback;
      let j;
      return e[40] !== S || e[41] !== T ? (j = /* @__PURE__ */ m(sf, {
        ...T,
        Fallback: S
      }), e[40] = S, e[41] = T, e[42] = j) : j = e[42], j;
    }
    case "generative-ui": {
      if (!d?.components)
        return null;
      const S = T;
      let j;
      return e[43] !== d.Fallback || e[44] !== d.components || e[45] !== S.spec ? (j = /* @__PURE__ */ m(cr, {
        spec: S.spec,
        components: d.components,
        Fallback: d.Fallback
      }), e[43] = d.Fallback, e[44] = d.components, e[45] = S.spec, e[46] = j) : j = e[46], j;
    }
    default:
      return console.warn(`Unknown message part type: ${x}`), null;
  }
}, $t = _e((t) => {
  const e = w(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(nf, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ m(sr, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && t.components?.Text === e.components?.Text && t.components?.Reasoning === e.components?.Reasoning && t.components?.Source === e.components?.Source && t.components?.Image === e.components?.Image && t.components?.File === e.components?.File && t.components?.Unstable_Audio === e.components?.Unstable_Audio && t.components?.tools === e.components?.tools && t.components?.data === e.components?.data && t.components?.generativeUI === e.components?.generativeUI && t.components?.ToolGroup === e.components?.ToolGroup && t.components?.ReasoningGroup === e.components?.ReasoningGroup);
$t.displayName = "MessagePrimitive.PartByIndex";
const rf = (t) => {
  const e = w(6), { status: s, component: n } = t, r = s.type === "running";
  let o;
  e[0] !== n || e[1] !== s ? (o = /* @__PURE__ */ m(n, {
    type: "text",
    text: "",
    status: s
  }), e[0] = n, e[1] = s, e[2] = o) : o = e[2];
  let i;
  return e[3] !== r || e[4] !== o ? (i = /* @__PURE__ */ m(nr, {
    text: "",
    isRunning: r,
    children: o
  }), e[3] = r, e[4] = o, e[5] = i) : i = e[5], i;
}, of = Object.freeze({ type: "complete" }), af = Object.freeze({ type: "running" }), cf = (t) => {
  const e = w(6), { components: s } = t, n = M(xf);
  if (s?.Empty) {
    let i;
    return e[0] !== s.Empty || e[1] !== n ? (i = /* @__PURE__ */ m(s.Empty, { status: n }), e[0] = s.Empty, e[1] = n, e[2] = i) : i = e[2], i;
  }
  if (n.type !== "running") return null;
  const r = s?.Text ?? fe.Text;
  let o;
  return e[3] !== n || e[4] !== r ? (o = /* @__PURE__ */ m(rf, {
    status: n,
    component: r
  }), e[3] = n, e[4] = r, e[5] = o) : o = e[5], o;
}, aa = _e(cf, (t, e) => t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), lf = (t) => {
  const e = w(4), { components: s, enabled: n } = t;
  let r;
  if (e[0] !== n ? (r = (i) => {
    if (!n || i.message.parts.length === 0) return !1;
    const a = i.message.parts[i.message.parts.length - 1];
    return a?.type !== "text" && a?.type !== "reasoning";
  }, e[0] = n, e[1] = r) : r = e[1], !M(r)) return null;
  let o;
  return e[2] !== s ? (o = /* @__PURE__ */ m(aa, { components: s }), e[2] = s, e[3] = o) : o = e[3], o;
}, uf = _e(lf, (t, e) => t.enabled === e.enabled && t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), df = (t) => {
  const e = w(4), { Quote: s } = t, n = M(ra);
  if (!n) return null;
  let r;
  return e[0] !== s || e[1] !== n.messageId || e[2] !== n.text ? (r = /* @__PURE__ */ m(s, {
    text: n.text,
    messageId: n.messageId
  }), e[0] = s, e[1] = n.messageId, e[2] = n.text, e[3] = r) : r = e[3], r;
}, hf = _e(df);
function ca(t, e) {
  const s = t.toolUIs[e.toolName]?.[0]?.render ?? null;
  return s || (Qm(e.mcp?.app?.resourceUri) && t.mcpApp ? t.mcpApp.render : null);
}
const la = () => {
  const t = w(12), e = oe(), s = M(If), n = M(Tf);
  if (!n || s.type !== "tool-call") return null;
  let r;
  t[0] !== e ? (r = e.part(), t[0] = e, t[1] = r) : r = t[1];
  const o = r.addToolResult;
  let i;
  t[2] !== e ? (i = e.part(), t[2] = e, t[3] = i) : i = t[3];
  const a = i.resumeToolCall;
  let c;
  t[4] !== e ? (c = e.part(), t[4] = e, t[5] = c) : c = t[5];
  let l;
  return t[6] !== n || t[7] !== s || t[8] !== r.addToolResult || t[9] !== i.resumeToolCall || t[10] !== c.respondToToolApproval ? (l = /* @__PURE__ */ m(n, {
    ...s,
    addResult: o,
    resume: a,
    respondToApproval: c.respondToToolApproval
  }), t[6] = n, t[7] = s, t[8] = r.addToolResult, t[9] = i.resumeToolCall, t[10] = c.respondToToolApproval, t[11] = l) : l = t[11], l;
}, ua = () => {
  const t = w(3), e = M(Cf), s = M(Ef);
  if (!s || e.type !== "data") return null;
  const n = e;
  let r;
  return t[0] !== s || t[1] !== n ? (r = /* @__PURE__ */ m(s, { ...n }), t[0] = s, t[1] = n, t[2] = r) : r = t[2], r;
}, mf = () => {
  const t = w(2), e = M(Rf);
  if (e === "tool-call") {
    let s;
    return t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = /* @__PURE__ */ m(la, {}), t[0] = s) : s = t[0], s;
  }
  if (e === "data") {
    let s;
    return t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = /* @__PURE__ */ m(ua, {}), t[1] = s) : s = t[1], s;
  }
  return null;
}, ff = Object.freeze({
  type: "text",
  text: "",
  status: af
}), pf = ({ children: t }) => {
  const e = oe(), s = M((n) => n.dataRenderers);
  return /* @__PURE__ */ m(As, {
    getItemState: (n) => n.part().getState(),
    children: (n) => t({ get part() {
      const r = n();
      if (r.type === "tool-call") {
        const o = ca(e.tools().getState(), r) !== null, i = e.part();
        return {
          ...r,
          toolUI: o ? /* @__PURE__ */ m(la, {}) : null,
          addResult: i.addToolResult,
          resume: i.resumeToolCall,
          respondToApproval: i.respondToToolApproval
        };
      }
      if (r.type === "data") {
        const o = lr(s, r.name, void 0) !== void 0;
        return {
          ...r,
          dataRendererUI: o ? /* @__PURE__ */ m(ua, {}) : null
        };
      }
      return r;
    } })
  });
}, da = (t) => {
  const e = w(5), { index: s, children: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(pf, { children: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ m(sr, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, gf = (t) => {
  const e = w(9), { children: s } = t, n = M(Af), r = M(Mf), o = n === 0 && r;
  if (n === 0) {
    if (!o) return null;
    let a;
    e[0] !== s ? (a = s({ part: ff }), e[0] = s, e[1] = a) : a = e[1];
    let c;
    return e[2] !== a ? (c = /* @__PURE__ */ m(nr, {
      text: "",
      isRunning: !0,
      children: a
    }), e[2] = a, e[3] = c) : c = e[3], c;
  }
  let i;
  if (e[4] !== s || e[5] !== n) {
    let a;
    e[7] !== s ? (a = (c, l) => /* @__PURE__ */ m(da, {
      index: l,
      children: (u) => s(u) ?? /* @__PURE__ */ m(mf, {})
    }, l), e[7] = s, e[8] = a) : a = e[8], i = /* @__PURE__ */ m($e, { children: Array.from({ length: n }, a) }), e[4] = s, e[5] = n, e[6] = i;
  } else i = e[6];
  return i;
}, dn = (t) => {
  const e = w(5), { components: s, unstable_showEmptyOnNonTextEnd: n, children: r } = t, o = n === void 0 ? !0 : n;
  if (r) {
    let a;
    return e[0] !== r ? (a = /* @__PURE__ */ m(gf, { children: r }), e[0] = r, e[1] = a) : a = e[1], a;
  }
  let i;
  return e[2] !== s || e[3] !== o ? (i = /* @__PURE__ */ m(bf, {
    components: s,
    unstable_showEmptyOnNonTextEnd: o
  }), e[2] = s, e[3] = o, e[4] = i) : i = e[4], i;
};
dn.displayName = "MessagePrimitive.Parts";
const bf = (t) => {
  const e = w(15), { components: s, unstable_showEmptyOnNonTextEnd: n } = t, r = M(Df), o = !!s?.ChainOfThought, { ranges: i, partIds: a } = ef(o);
  let c;
  e: {
    if (r === 0) {
      let p;
      e[0] !== s ? (p = /* @__PURE__ */ m(aa, { components: s }), e[0] = s, e[1] = p) : p = e[1], c = p;
      break e;
    }
    let f;
    if (e[2] !== s || e[3] !== i || e[4] !== a) {
      const p = /* @__PURE__ */ new Set(), v = (_) => {
        const C = a[_];
        return C !== void 0 && !p.has(C) ? (p.add(C), `part-id:${C}`) : `part-${_}`;
      };
      f = i.map((_) => {
        if (_.type === "single") return /* @__PURE__ */ m($t, {
          index: _.index,
          components: s
        }, _.index);
        if (_.type === "chainOfThoughtGroup") {
          const C = s?.ChainOfThought;
          return C ? /* @__PURE__ */ m(Uh, {
            startIndex: _.startIndex,
            endIndex: _.endIndex,
            children: /* @__PURE__ */ m(C, {})
          }, `chainOfThought-${_.idKey ?? _.startIndex}`) : null;
        } else return _.type === "toolGroup" ? /* @__PURE__ */ m(s?.ToolGroup ?? fe.ToolGroup, {
          startIndex: _.startIndex,
          endIndex: _.endIndex,
          children: Array.from({ length: _.endIndex - _.startIndex + 1 }, (C, I) => {
            const E = _.startIndex + I;
            return /* @__PURE__ */ m($t, {
              index: E,
              components: s
            }, v(E));
          })
        }, `tool-${_.idKey ?? _.startIndex}`) : /* @__PURE__ */ m(s?.ReasoningGroup ?? fe.ReasoningGroup, {
          startIndex: _.startIndex,
          endIndex: _.endIndex,
          children: Array.from({ length: _.endIndex - _.startIndex + 1 }, (C, I) => {
            const E = _.startIndex + I;
            return /* @__PURE__ */ m($t, {
              index: E,
              components: s
            }, `part-${E}`);
          })
        }, `reasoning-${_.startIndex}`);
      }), e[2] = s, e[3] = i, e[4] = a, e[5] = f;
    } else f = e[5];
    c = f;
  }
  const l = c;
  let u;
  e[6] !== s ? (u = s?.Quote && /* @__PURE__ */ m(hf, { Quote: s.Quote }), e[6] = s, e[7] = u) : u = e[7];
  let h;
  e[8] !== s || e[9] !== n ? (h = /* @__PURE__ */ m(uf, {
    components: s,
    enabled: n
  }), e[8] = s, e[9] = n, e[10] = h) : h = e[10];
  let d;
  return e[11] !== l || e[12] !== u || e[13] !== h ? (d = /* @__PURE__ */ B($e, { children: [
    u,
    l,
    h
  ] }), e[11] = l, e[12] = u, e[13] = h, e[14] = d) : d = e[14], d;
};
function _f(t) {
  return t.type;
}
function vf(t) {
  return t.message.parts.map(_f);
}
function yf(t) {
  return t.type === "tool-call" ? t.toolCallId : void 0;
}
function wf(t) {
  return t.message.parts.map(yf);
}
function Sf(t) {
  return t.part;
}
function xf(t) {
  return t.message.status ?? of;
}
function If(t) {
  return t.part;
}
function Tf(t) {
  return t.part.type === "tool-call" ? ca(t.tools, t.part) : null;
}
function Cf(t) {
  return t.part;
}
function Ef(t) {
  return t.part.type === "data" ? lr(t.dataRenderers, t.part.name, void 0) ?? null : null;
}
function Rf(t) {
  return t.part.type;
}
function Af(t) {
  return t.message.parts.length;
}
function Mf(t) {
  return (t.message.status?.type ?? "complete") === "running";
}
function Df(t) {
  return t.message.parts.length;
}
const kf = /* @__PURE__ */ Symbol.for("@assistant-ui/groupBy.memoKey"), eo = (t) => {
  const e = t.nextChildIdx++;
  return t.nodeKey === "" ? String(e) : `${t.nodeKey}.${e}`;
}, to = (t, e) => {
  if (!(e === void 0 || t.claimed.has(e)))
    return t.claimed.add(e), `id:${e}`;
}, Pf = (t, e) => {
  const s = {
    key: "",
    nodeKey: "",
    indices: [],
    children: [],
    nextChildIdx: 0,
    claimed: /* @__PURE__ */ new Set()
  }, n = [s], r = () => {
    const o = n.pop(), i = n[n.length - 1];
    i.children.push({
      type: "group",
      key: o.key,
      nodeKey: o.nodeKey,
      idKey: to(i, e?.[o.indices[0]]),
      indices: o.indices,
      children: o.children
    });
  };
  for (let o = 0; o < t.length; o++) {
    const i = t[o];
    let a = 0;
    for (; a < n.length - 1 && a < i.length && n[a + 1].key === i[a]; ) a++;
    for (; n.length - 1 > a; ) r();
    for (; n.length - 1 < i.length; ) {
      const l = n[n.length - 1];
      n.push({
        key: i[n.length - 1],
        nodeKey: eo(l),
        indices: [],
        children: [],
        nextChildIdx: 0,
        claimed: /* @__PURE__ */ new Set()
      });
    }
    const c = n[n.length - 1];
    c.children.push({
      type: "part",
      index: o,
      nodeKey: eo(c),
      idKey: to(c, e?.[o])
    });
    for (let l = 1; l < n.length; l++) n[l].indices.push(o);
  }
  for (; n.length > 1; ) r();
  return s.children;
}, $f = Object.freeze({ type: "complete" }), Nf = (t, e, s) => {
  if (!s) return !1;
  switch (t) {
    case "never":
      return !1;
    case "always":
      return !0;
    case "empty":
      return e.length === 0;
    case "no-text": {
      const n = e[e.length - 1];
      return n === void 0 || n.type !== "text" && n.type !== "reasoning";
    }
  }
}, ha = () => {
  throw new Error("MessagePrimitive.GroupedParts: rendered `children` under a leaf part. `children` is only meaningful for `group-…` cases — add a matching case for the part type or return `null` to skip it.");
}, ma = (t, e, s) => {
  if (t.type === "part") return /* @__PURE__ */ m(da, {
    index: t.index,
    children: ({ part: r }) => s({
      part: r,
      children: /* @__PURE__ */ m(ha, {})
    })
  }, t.idKey ? `part-${t.idKey}` : `part-${t.index}`);
  const n = e[t.indices.at(-1)]?.status ?? $f;
  return /* @__PURE__ */ m(Bo, { children: s({
    part: {
      type: t.key,
      status: n,
      indices: t.indices
    },
    children: /* @__PURE__ */ m($e, { children: t.children.map((r) => ma(r, e, s)) })
  }) }, t.idKey ?? t.nodeKey);
}, fa = ({ groupBy: t, indicator: e = "no-text", children: s }) => {
  const n = M(un((i) => i.message.parts)), r = M((i) => i.tools.toolUIs), o = M((i) => e === "never" ? !1 : i.message.status?.type === "running");
  return /* @__PURE__ */ B($e, { children: [he(() => {
    const i = { toolUIs: r };
    return Pf(n.map((a) => t(a, i) ?? []), n.map((a) => a.type === "tool-call" ? a.toolCallId : void 0));
  }, [
    n,
    t[kf] ?? t,
    r
  ]).map((i) => ma(i, n, s)), Nf(e, n, o) && s({
    part: { type: "indicator" },
    children: /* @__PURE__ */ m(ha, {})
  })] });
};
fa.displayName = "MessagePrimitive.GroupedParts";
const Of = (t) => {
  const e = w(5), { children: s } = t, n = M(ra);
  if (!n) return null;
  let r;
  e[0] !== s || e[1] !== n ? (r = s(n), e[0] = s, e[1] = n, e[2] = r) : r = e[2];
  let o;
  return e[3] !== r ? (o = /* @__PURE__ */ m($e, { children: r }), e[3] = r, e[4] = o) : o = e[4], o;
}, pa = _e(Of);
pa.displayName = "MessagePrimitive.Quote";
const ga = (t, e) => {
  switch (e.type) {
    case "image":
      return t?.Image ?? t?.Attachment;
    case "document":
      return t?.Document ?? t?.Attachment;
    case "file":
      return t?.File ?? t?.Attachment;
    default:
      return t?.Attachment;
  }
}, Bf = (t) => {
  const e = w(5), { components: s } = t, n = M(Ff);
  if (!n) return null;
  const r = n;
  let o;
  e[0] !== s || e[1] !== r ? (o = ga(s, r), e[0] = s, e[1] = r, e[2] = o) : o = e[2];
  const i = o;
  if (!i) return null;
  let a;
  return e[3] !== i ? (a = /* @__PURE__ */ m(i, {}), e[3] = i, e[4] = a) : a = e[4], a;
}, ba = _e((t) => {
  const e = w(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(Bf, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ m(zi, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && t.components?.Image === e.components?.Image && t.components?.Document === e.components?.Document && t.components?.File === e.components?.File && t.components?.Attachment === e.components?.Attachment);
ba.displayName = "MessagePrimitive.AttachmentByIndex";
const so = ({ children: t }) => {
  const e = M((s) => s.message.role !== "user" ? 0 : (s.message.attachments ?? []).length);
  return he(() => Array.from({ length: e }, (s, n) => /* @__PURE__ */ m(zi, {
    index: n,
    children: /* @__PURE__ */ m(As, {
      getItemState: (r) => r.message().attachment({ index: n }).getState(),
      children: (r) => t({ get attachment() {
        return r();
      } })
    })
  }, n)), [e, t]);
}, _a = (t) => {
  const e = w(4), { components: s, children: n } = t;
  if (s) {
    let o;
    return e[0] !== s ? (o = /* @__PURE__ */ m(so, { children: (i) => {
      const { attachment: a } = i, c = ga(s, a);
      return c ? /* @__PURE__ */ m(c, {}) : null;
    } }), e[0] = s, e[1] = o) : o = e[1], o;
  }
  let r;
  return e[2] !== n ? (r = /* @__PURE__ */ m(so, { children: n }), e[2] = n, e[3] = r) : r = e[3], r;
};
_a.displayName = "MessagePrimitive.Attachments";
function Ff(t) {
  return t.attachment;
}
const ur = (t) => {
  const { children: e } = t;
  return M(Lf) ? e : null;
};
ur.displayName = "MessagePartPrimitive.InProgress";
function Lf(t) {
  return t.part.status.type === "running";
}
const va = (t) => {
  const e = w(2), { components: s } = t, n = s.Suggestion;
  let r;
  return e[0] !== n ? (r = /* @__PURE__ */ m(n, {}), e[0] = n, e[1] = r) : r = e[1], r;
}, ya = _e((t) => {
  const e = w(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(va, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ m(Gi, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && t.components.Suggestion === e.components.Suggestion);
ya.displayName = "ThreadPrimitive.SuggestionByIndex";
const no = ({ children: t }) => {
  const e = M((s) => s.suggestions.suggestions.length);
  return he(() => e === 0 ? null : Array.from({ length: e }, (s, n) => /* @__PURE__ */ m(Gi, {
    index: n,
    children: /* @__PURE__ */ m(As, {
      getItemState: (r) => r.suggestions().suggestion({ index: n }).getState(),
      children: (r) => t({ get suggestion() {
        return r();
      } })
    })
  }, n)), [e, t]);
}, wa = (t) => {
  const e = w(4), { components: s, children: n } = t;
  if (s) {
    let o;
    return e[0] !== s ? (o = /* @__PURE__ */ m(no, { children: () => /* @__PURE__ */ m(va, { components: s }) }), e[0] = s, e[1] = o) : o = e[1], o;
  }
  let r;
  return e[2] !== n ? (r = /* @__PURE__ */ m(no, { children: n }), e[2] = n, e[3] = r) : r = e[3], r;
};
wa.displayName = "ThreadPrimitive.Suggestions";
const Vf = _e(wa, (t, e) => t.children || e.children ? t.children === e.children : t.components.Suggestion === e.components.Suggestion), jf = (t) => {
  const e = w(12);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { copiedDuration: n, copyToClipboard: r } = s, o = n === void 0 ? 3e3 : n, i = oe(), a = M(Uf), c = M(zf), l = M(Hf), u = M(Gf);
  let h;
  e[2] !== i || e[3] !== u || e[4] !== o || e[5] !== r || e[6] !== l ? (h = () => {
    if (!r) return;
    const v = l ? u : i.message().getCopyText();
    v && Promise.resolve(r(v)).then(() => {
      i.message().setIsCopied(!0), setTimeout(() => i.message().setIsCopied(!1), o);
    }, Wf);
  }, e[2] = i, e[3] = u, e[4] = o, e[5] = r, e[6] = l, e[7] = h) : h = e[7];
  const d = h, f = a || !r;
  let p;
  return e[8] !== d || e[9] !== c || e[10] !== f ? (p = {
    copy: d,
    disabled: f,
    isCopied: c
  }, e[8] = d, e[9] = c, e[10] = f, e[11] = p) : p = e[11], p;
};
function qf(t) {
  return t.type === "text" && t.text.length > 0;
}
function Uf(t) {
  return !((t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some(qf));
}
function zf(t) {
  return t.message.isCopied;
}
function Hf(t) {
  return t.composer.isEditing;
}
function Gf(t) {
  return t.composer.text;
}
function Wf() {
}
const Yf = () => {
  const t = w(5), e = oe(), s = M(Jf);
  let n;
  t[0] !== e ? (n = () => {
    e.composer().beginEdit();
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let o;
  return t[2] !== s || t[3] !== r ? (o = {
    edit: r,
    disabled: s
  }, t[2] = s, t[3] = r, t[4] = o) : o = t[4], o;
};
function Jf(t) {
  return t.composer.isEditing;
}
const Qf = () => {
  const t = w(5), e = oe(), s = M(Xf);
  let n;
  t[0] !== e ? (n = () => {
    e.message().reload();
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let o;
  return t[2] !== s || t[3] !== r ? (o = {
    reload: r,
    disabled: s
  }, t[2] = s, t[3] = r, t[4] = o) : o = t[4], o;
};
function Xf(t) {
  return t.thread.isRunning || t.thread.isDisabled || t.message.role !== "assistant";
}
const Zf = () => {
  const t = w(5), e = oe(), s = M(ep);
  let n;
  t[0] !== e ? (n = () => {
    e.message().submitFeedback({ type: "positive" });
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let o;
  return t[2] !== s || t[3] !== r ? (o = {
    submit: r,
    isSubmitted: s
  }, t[2] = s, t[3] = r, t[4] = o) : o = t[4], o;
}, Kf = () => {
  const t = w(5), e = oe(), s = M(tp);
  let n;
  t[0] !== e ? (n = () => {
    e.message().submitFeedback({ type: "negative" });
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let o;
  return t[2] !== s || t[3] !== r ? (o = {
    submit: r,
    isSubmitted: s
  }, t[2] = s, t[3] = r, t[4] = o) : o = t[4], o;
};
function ep(t) {
  return t.message.metadata.submittedFeedback?.type === "positive";
}
function tp(t) {
  return t.message.metadata.submittedFeedback?.type === "negative";
}
const sp = () => {
  const t = w(5), e = oe(), s = M(rp);
  let n;
  t[0] !== e ? (n = async () => {
    e.message().speak();
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let o;
  return t[2] !== s || t[3] !== r ? (o = {
    speak: r,
    disabled: s
  }, t[2] = s, t[3] = r, t[4] = o) : o = t[4], o;
};
function np(t) {
  return t.type === "text" && t.text.length > 0;
}
function rp(t) {
  return !((t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some(np));
}
const op = () => {
  const t = w(5), e = oe(), s = M(ip);
  let n;
  t[0] !== e ? (n = () => {
    e.message().stopSpeaking();
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let o;
  return t[2] !== s || t[3] !== r ? (o = {
    stopSpeaking: r,
    disabled: s
  }, t[2] = s, t[3] = r, t[4] = o) : o = t[4], o;
};
function ip(t) {
  return t.message.speech == null;
}
const ap = (t) => {
  const e = w(8), { prompt: s, send: n, clearComposer: r } = t, o = r === void 0 ? !0 : r, i = oe(), a = M(cp), c = n ?? !1;
  let l;
  e[0] !== i || e[1] !== o || e[2] !== s || e[3] !== c ? (l = () => {
    const d = i.thread().getState().isRunning;
    if (c && !d)
      i.thread().append({
        content: [{
          type: "text",
          text: s
        }],
        runConfig: i.composer().getState().runConfig
      }), o && i.composer().setText("");
    else if (o) i.composer().setText(s);
    else {
      const f = i.composer().getState().text;
      i.composer().setText(f.trim() ? `${f} ${s}` : s);
    }
  }, e[0] = i, e[1] = o, e[2] = s, e[3] = c, e[4] = l) : l = e[4];
  const u = l;
  let h;
  return e[5] !== a || e[6] !== u ? (h = {
    trigger: u,
    disabled: a
  }, e[5] = a, e[6] = u, e[7] = h) : h = e[7], h;
};
function cp(t) {
  return t.thread.isDisabled;
}
const lp = () => M(up);
function up(t) {
  if (t.message.status?.type !== "incomplete" || t.message.status.reason !== "error") return;
  const e = t.message.status.error;
  return typeof e == "string" ? e : typeof e == "object" && e !== null && "message" in e && typeof e.message == "string" ? e.message : e ?? "An error occurred";
}
function dp(t, e) {
  function s(n) {
    const r = Ts(t);
    if (!n?.optional && !r) throw new Error(`This component must be used within ${e}.`);
    return r;
  }
  return s;
}
function Sa(t, e) {
  function s(r) {
    const o = t(r);
    return o ? o[e] : null;
  }
  function n(r) {
    let o = !1, i;
    typeof r == "function" ? i = r : r && typeof r == "object" && (o = !!r.optional, i = r.selector);
    const a = s({ optional: o });
    return a ? i ? a(i) : a() : null;
  }
  return {
    [e]: n,
    [`${e}Store`]: s
  };
}
const xa = ct(null), { useThreadViewport: ut, useThreadViewportStore: dt } = Sa(dp(xa, "ThreadPrimitive.Viewport"), "useThreadViewport"), ro = (t) => {
  const e = /* @__PURE__ */ new Map(), s = () => {
    let n = 0;
    for (const r of e.values()) n += r;
    t(n);
  };
  return { register: () => {
    const n = /* @__PURE__ */ Symbol();
    return e.set(n, 0), {
      setHeight: (r) => {
        e.get(n) !== r && (e.set(n, r), s());
      },
      unregister: () => {
        e.delete(n), s();
      }
    };
  } };
}, hp = (t = {}) => {
  const e = /* @__PURE__ */ new Set(), s = ro((i) => {
    o.setState({ height: {
      ...o.getState().height,
      viewport: i
    } });
  }), n = ro((i) => {
    o.setState({ height: {
      ...o.getState().height,
      inset: i
    } });
  }), r = (i, a) => (o.setState({ element: {
    ...o.getState().element,
    [i]: a
  } }), () => {
    o.getState().element[i] === a && o.setState({ element: {
      ...o.getState().element,
      [i]: null
    } });
  }), o = _c(() => ({
    isAtBottom: !0,
    scrollToBottom: ({ behavior: i = "auto" } = {}) => {
      for (const a of e) a({ behavior: i });
    },
    onScrollToBottom: (i) => (e.add(i), () => {
      e.delete(i);
    }),
    turnAnchor: t.turnAnchor ?? "bottom",
    topAnchorMessageClamp: {
      tallerThan: t.topAnchorMessageClamp?.tallerThan ?? "10em",
      visibleHeight: t.topAnchorMessageClamp?.visibleHeight ?? "6em"
    },
    height: {
      viewport: 0,
      inset: 0
    },
    element: {
      viewport: null,
      anchor: null,
      target: null
    },
    targetConfig: null,
    topAnchorTurn: null,
    registerViewport: s.register,
    registerContentInset: n.register,
    registerViewportElement: (i) => r("viewport", i),
    registerAnchorElement: (i) => r("anchor", i),
    registerAnchorTargetElement: (i, a) => (o.setState({
      element: {
        ...o.getState().element,
        target: i
      },
      targetConfig: i && a ? a : null
    }), () => {
      o.getState().element.target === i && o.setState({
        element: {
          ...o.getState().element,
          target: null
        },
        targetConfig: null
      });
    }),
    setTopAnchorTurn: (i) => {
      o.setState({ topAnchorTurn: i });
    }
  }));
  return o;
}, ws = (t) => t, mp = (t) => {
  const e = w(11);
  let s;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = { optional: !0 }, e[0] = s) : s = e[0];
  const n = dt(s);
  let r;
  e[1] !== t ? (r = () => hp(t), e[1] = t, e[2] = r) : r = e[2];
  const [o] = ue(r);
  let i, a;
  e[3] !== n || e[4] !== o ? (i = () => n?.getState().onScrollToBottom(() => {
    o.getState().scrollToBottom();
  }), a = [n, o], e[3] = n, e[4] = o, e[5] = i, e[6] = a) : (i = e[5], a = e[6]), Z(i, a);
  let c, l;
  return e[7] !== n || e[8] !== o ? (c = () => {
    if (n)
      return o.subscribe((u) => {
        n.getState().isAtBottom !== u.isAtBottom && ws(n).setState({ isAtBottom: u.isAtBottom });
      });
  }, l = [o, n], e[7] = n, e[8] = o, e[9] = c, e[10] = l) : (c = e[9], l = e[10]), Z(c, l), o;
}, dr = (t) => {
  const e = w(7), { children: s, options: n } = t;
  let r;
  e[0] !== n ? (r = n === void 0 ? {} : n, e[0] = n, e[1] = r) : r = e[1];
  const o = mp(r);
  let i;
  e[2] !== o ? (i = () => ({ useThreadViewport: o }), e[2] = o, e[3] = i) : i = e[3];
  const [a] = ue(i);
  let c;
  return e[4] !== s || e[5] !== a ? (c = /* @__PURE__ */ m(xa.Provider, {
    value: a,
    children: s
  }), e[4] = s, e[5] = a, e[6] = c) : c = e[6], c;
}, fp = () => {
  const t = w(3), e = oe();
  let s, n;
  return t[0] !== e ? (s = () => {
  }, n = [e], t[0] = e, t[1] = s, t[2] = n) : (s = t[1], n = t[2]), Z(s, n), null;
}, pp = (t) => {
  const e = w(7), { children: s, aui: n, runtime: r } = t, o = n ?? null;
  let i;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (i = /* @__PURE__ */ m(fp, {}), e[0] = i) : i = e[0];
  let a;
  e[1] !== s ? (a = /* @__PURE__ */ m(dr, { children: s }), e[1] = s, e[2] = a) : a = e[2];
  let c;
  return e[3] !== r || e[4] !== o || e[5] !== a ? (c = /* @__PURE__ */ B(Qd, {
    runtime: r,
    aui: o,
    children: [i, a]
  }), e[3] = r, e[4] = o, e[5] = a, e[6] = c) : c = e[6], c;
}, gp = _e(pp);
var bp = Object.defineProperty, hr = (t, e) => bp(t, "name", { value: e, configurable: !0 });
function hn(t, e) {
  if (typeof t == "function")
    return t(e);
  t != null && (t.current = e);
}
hr(hn, "setRef");
function Ia(...t) {
  return (e) => {
    let s = !1;
    const n = t.map((r) => {
      const o = hn(r, e);
      return !s && typeof o == "function" && (s = !0), o;
    });
    if (s)
      return () => {
        for (let r = 0; r < n.length; r++) {
          const o = n[r];
          typeof o == "function" ? o() : hn(t[r], null);
        }
      };
  };
}
hr(Ia, "composeRefs");
function ht(...t) {
  return O(Ia(...t), t);
}
hr(ht, "useComposedRefs");
var oo = Object.defineProperty, mr = (t, e) => {
  let s = {};
  for (var n in t) oo(s, n, {
    get: t[n],
    enumerable: !0
  });
  return oo(s, Symbol.toStringTag, { value: "Module" }), s;
}, _p = Object.defineProperty, Me = (t, e) => _p(t, "name", { value: e, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Ta(t) {
  const e = me((s, n) => {
    let { children: r, ...o } = s, i = null, a = !1;
    const c = [];
    mn(r) && typeof Kt == "function" && (r = Kt(r._payload)), _r.forEach(r, (d) => {
      if (Aa(d)) {
        a = !0;
        const f = d;
        let p = "child" in f.props ? f.props.child : f.props.children;
        mn(p) && typeof Kt == "function" && (p = Kt(p._payload)), i = yp(f, p), c.push(i?.props?.children);
      } else
        c.push(d);
    }), i ? i = us(i, void 0, c) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && _r.count(r) === 1 && Ot(r) && (i = r)
    );
    const l = i ? Ra(i) : void 0, u = ht(n, l);
    if (!i) {
      if (r || r === 0)
        throw new Error(
          a ? xp(t) : Sp(t)
        );
      return r;
    }
    const h = Ea(o, i.props ?? {});
    return i.type !== Bo && (h.ref = n ? u : l), us(i, h);
  });
  return e.displayName = `${t}.Slot`, e;
}
Me(Ta, "createSlot");
var Ca = /* @__PURE__ */ Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function vp(t) {
  const e = /* @__PURE__ */ Me((s) => "child" in s ? s.children(s.child) : s.children, "Slottable");
  return e.displayName = `${t}.Slottable`, e.__radixId = Ca, e;
}
Me(vp, "createSlottable");
var yp = /* @__PURE__ */ Me((t, e) => {
  if ("child" in t.props) {
    const s = t.props.child;
    return Ot(s) ? us(s, void 0, t.props.children(s.props.children)) : null;
  }
  return Ot(e) ? e : null;
}, "getSlottableElementFromSlottable");
function Ea(t, e) {
  const s = { ...e };
  for (const n in e) {
    const r = t[n], o = e[n];
    /^on[A-Z]/.test(n) ? r && o ? s[n] = (...a) => {
      const c = o(...a);
      return r(...a), c;
    } : r && (s[n] = r) : n === "style" ? s[n] = { ...r, ...o } : n === "className" && (s[n] = [r, o].filter(Boolean).join(" "));
  }
  return { ...t, ...s };
}
Me(Ea, "mergeProps");
function Ra(t) {
  let e = Object.getOwnPropertyDescriptor(t.props, "ref")?.get, s = e && "isReactWarning" in e && e.isReactWarning;
  return s ? t.ref : (e = Object.getOwnPropertyDescriptor(t, "ref")?.get, s = e && "isReactWarning" in e && e.isReactWarning, s ? t.props.ref : t.props.ref || t.ref);
}
Me(Ra, "getElementRef");
function Aa(t) {
  return Ot(t) && typeof t.type == "function" && "__radixId" in t.type && t.type.__radixId === Ca;
}
Me(Aa, "isSlottable");
var wp = /* @__PURE__ */ Symbol.for("react.lazy");
function mn(t) {
  return t != null && typeof t == "object" && "$$typeof" in t && t.$$typeof === wp && "_payload" in t && Ma(t._payload);
}
Me(mn, "isLazyComponent");
function Ma(t) {
  return typeof t == "object" && t !== null && "then" in t;
}
Me(Ma, "isPromiseLike");
var Sp = /* @__PURE__ */ Me((t) => `${t} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), xp = /* @__PURE__ */ Me((t) => `${t} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), Kt = bc[" use ".trim().toString()], Ip = Object.defineProperty, Tp = (t, e) => Ip(t, "name", { value: e, configurable: !0 }), Cp = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], Ep = Cp.reduce((t, e) => {
  const s = /* @__PURE__ */ Ta(`Primitive.${e}`), n = me((r, o) => {
    const { asChild: i, ...a } = r, c = i ? s : e;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ m(c, { ...a, ref: o });
  });
  return n.displayName = `Primitive.${e}`, { ...t, [e]: n };
}, {});
function Rp(t, e) {
  t && tl(() => t.dispatchEvent(e));
}
Tp(Rp, "dispatchDiscreteCustomEvent");
const Ap = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
function Mp(t) {
  const e = me((s, n) => {
    const r = w(17);
    let o, i, a, c;
    r[0] !== s ? ({ render: a, asChild: o, children: i, ...c } = s, r[0] = s, r[1] = o, r[2] = i, r[3] = a, r[4] = c) : (o = r[1], i = r[2], a = r[3], c = r[4]);
    const l = t;
    if (a && Ot(a)) {
      const d = i !== void 0 ? i : a.props.children, f = c;
      let p;
      r[5] !== a || r[6] !== d ? (p = us(a, void 0, d), r[5] = a, r[6] = d, r[7] = p) : p = r[7];
      let v;
      return r[8] !== n || r[9] !== f || r[10] !== p ? (v = /* @__PURE__ */ m(l, {
        ...f,
        asChild: !0,
        ref: n,
        children: p
      }), r[8] = n, r[9] = f, r[10] = p, r[11] = v) : v = r[11], v;
    }
    const u = c;
    let h;
    return r[12] !== o || r[13] !== i || r[14] !== n || r[15] !== u ? (h = /* @__PURE__ */ m(l, {
      ...u,
      asChild: o,
      ref: n,
      children: i
    }), r[12] = o, r[13] = i, r[14] = n, r[15] = u, r[16] = h) : h = r[16], h;
  });
  return e.displayName = typeof t == "string" ? t : t.displayName ?? t.name ?? "Component", e;
}
function Dp(t) {
  const e = Ep[t], s = Mp(e);
  return s.displayName = `Primitive.${t}`, s;
}
const Se = Ap.reduce((t, e) => (t[e] = Dp(e), t), {}), kp = (t) => {
  const e = w(5), { hideWhenRunning: s, autohide: n, autohideFloat: r, forceVisible: o } = t;
  let i;
  return e[0] !== n || e[1] !== r || e[2] !== o || e[3] !== s ? (i = (a) => {
    if (s && a.thread.isRunning) return "hidden";
    const c = n === "always" || n === "not-last" && !a.message.isLast, l = o || a.message.isHovering;
    return c ? l ? r === "always" || r === "single-branch" && a.message.branchCount <= 1 ? "floating" : "normal" : "hidden" : "normal";
  }, e[0] = n, e[1] = r, e[2] = o, e[3] = s, e[4] = i) : i = e[4], M(i);
}, Pp = ct(null), Da = me((t, e) => {
  const s = w(18);
  let n, r, o, i;
  s[0] !== t ? ({ hideWhenRunning: o, autohide: n, autohideFloat: r, ...i } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o, s[4] = i) : (n = s[1], r = s[2], o = s[3], i = s[4]);
  const [a, c] = ue(0);
  let l;
  s[5] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (l = () => {
    let I = !1;
    return c($p), () => {
      I || (I = !0, c(Np));
    };
  }, s[5] = l) : l = s[5];
  const u = l;
  let h;
  s[6] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (h = { acquireInteractionLock: u }, s[6] = h) : h = s[6];
  const d = h, f = a > 0;
  let p;
  s[7] !== n || s[8] !== r || s[9] !== o || s[10] !== f ? (p = {
    hideWhenRunning: o,
    autohide: n,
    autohideFloat: r,
    forceVisible: f
  }, s[7] = n, s[8] = r, s[9] = o, s[10] = f, s[11] = p) : p = s[11];
  const v = kp(p);
  if (v === "hidden") return null;
  let _;
  s[12] !== v ? (_ = v === "floating" ? { "data-floating": "true" } : null, s[12] = v, s[13] = _) : _ = s[13];
  let C;
  return s[14] !== e || s[15] !== i || s[16] !== _ ? (C = /* @__PURE__ */ m(Pp.Provider, {
    value: d,
    children: /* @__PURE__ */ m(Se.div, {
      ..._,
      ...i,
      ref: e
    })
  }), s[14] = e, s[15] = i, s[16] = _, s[17] = C) : C = s[17], C;
});
Da.displayName = "ActionBarPrimitive.Root";
function $p(t) {
  return t + 1;
}
function Np(t) {
  return Math.max(0, t - 1);
}
var Op = Object.defineProperty, It = (t, e) => Op(t, "name", { value: e, configurable: !0 }), ka = !!(typeof window < "u" && window.document && window.document.createElement);
function mt(t, e, { checkForDefaultPrevented: s = !0 } = {}) {
  return /* @__PURE__ */ It(function(r) {
    if (t?.(r), s === !1 || !r || !r.defaultPrevented)
      return e?.(r);
  }, "handleEvent");
}
It(mt, "composeEventHandlers");
function Bp(t) {
  if (!ka)
    throw new Error("Cannot access window outside of the DOM");
  return t?.ownerDocument?.defaultView ?? window;
}
It(Bp, "getOwnerWindow");
function fn(t) {
  if (!ka)
    throw new Error("Cannot access document outside of the DOM");
  return t?.ownerDocument ?? document;
}
It(fn, "getOwnerDocument");
function Pa(t, e = !1) {
  const { activeElement: s } = fn(t);
  if (!s?.nodeName)
    return null;
  if ($a(s) && s.contentDocument)
    return Pa(s.contentDocument.body, e);
  if (e) {
    const n = s.getAttribute("aria-activedescendant");
    if (n) {
      const r = fn(s).getElementById(n);
      if (r)
        return r;
    }
  }
  return s;
}
It(Pa, "getActiveElement");
function $a(t) {
  return t.tagName === "IFRAME";
}
It($a, "isFrame");
const Fp = (t) => {
  const e = w(4);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { copiedDuration: n } = s, r = n === void 0 ? 3e3 : n;
  let o;
  e[2] !== r ? (o = {
    copiedDuration: r,
    copyToClipboard: Lp
  }, e[2] = r, e[3] = o) : o = e[3];
  const { copy: i, disabled: a } = jf(o);
  return a ? null : i;
}, Na = me((t, e) => {
  const s = w(20);
  let n, r, o, i;
  s[0] !== t ? ({ copiedDuration: n, onClick: o, disabled: r, ...i } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o, s[4] = i) : (n = s[1], r = s[2], o = s[3], i = s[4]);
  const a = M(Vp);
  let c;
  s[5] !== n ? (c = { copiedDuration: n }, s[5] = n, s[6] = c) : c = s[6];
  const l = Fp(c);
  let u;
  s[7] !== a ? (u = a ? { "data-copied": "true" } : {}, s[7] = a, s[8] = u) : u = s[8];
  const h = r || !l;
  let d;
  s[9] !== l ? (d = () => {
    l?.();
  }, s[9] = l, s[10] = d) : d = s[10];
  let f;
  s[11] !== o || s[12] !== d ? (f = mt(o, d), s[11] = o, s[12] = d, s[13] = f) : f = s[13];
  let p;
  return s[14] !== e || s[15] !== i || s[16] !== u || s[17] !== h || s[18] !== f ? (p = /* @__PURE__ */ m(Se.button, {
    type: "button",
    ...u,
    ...i,
    ref: e,
    disabled: h,
    onClick: f
  }), s[14] = e, s[15] = i, s[16] = u, s[17] = h, s[18] = f, s[19] = p) : p = s[19], p;
});
Na.displayName = "ActionBarPrimitive.Copy";
function Lp(t) {
  return typeof navigator > "u" || !navigator.clipboard ? Promise.reject(/* @__PURE__ */ new Error("Clipboard API is unavailable")) : navigator.clipboard.writeText(t);
}
function Vp(t) {
  return t.message.isCopied;
}
const Ut = (t, e, s = []) => {
  const n = me((r, o) => {
    const i = w(6), a = {}, c = {};
    Object.keys(r).forEach((v) => {
      s.includes(v) ? a[v] = r[v] : c[v] = r[v];
    });
    const l = e(a) ?? void 0, u = Se, h = "button", d = c.disabled || !l, f = mt(c.onClick, l);
    let p;
    return i[0] !== o || i[1] !== c || i[2] !== u.button || i[3] !== d || i[4] !== f ? (p = /* @__PURE__ */ m(u.button, {
      ...c,
      type: h,
      ref: o,
      disabled: d,
      onClick: f
    }), i[0] = o, i[1] = c, i[2] = u.button, i[3] = d, i[4] = f, i[5] = p) : p = i[5], p;
  });
  return n.displayName = t, n;
}, jp = () => {
  const { disabled: t, reload: e } = Qf();
  return t ? null : e;
}, qp = Ut("ActionBarPrimitive.Reload", jp), Up = () => {
  const { disabled: t, edit: e } = Yf();
  return t ? null : e;
}, zp = Ut("ActionBarPrimitive.Edit", Up), Hp = () => {
  const { disabled: t, speak: e } = sp();
  return t ? null : e;
}, Gp = Ut("ActionBarPrimitive.Speak", Hp);
var Wp = Object.defineProperty, Yp = (t, e) => Wp(t, "name", { value: e, configurable: !0 });
function zt(t) {
  const e = re(t);
  return le(() => {
    e.current = t;
  }), ze(() => ((...s) => e.current?.(...s)), []);
}
Yp(zt, "useCallbackRef");
var Jp = Object.defineProperty, Oa = (t, e) => Jp(t, "name", { value: e, configurable: !0 });
function Ba(t, e = globalThis?.document) {
  const s = zt(t);
  le(() => {
    const n = /* @__PURE__ */ Oa((r) => {
      r.key === "Escape" && s(r);
    }, "handleKeyDown");
    return e.addEventListener("keydown", n, { capture: !0 }), () => e.removeEventListener("keydown", n, { capture: !0 });
  }, [s, e]);
}
Oa(Ba, "useEscapeKeydown");
const Qp = () => {
  const { disabled: t, stopSpeaking: e } = op();
  return t ? null : e;
}, Fa = me((t, e) => {
  const s = w(12), n = Qp();
  let r;
  s[0] !== n ? (r = (l) => {
    n && (l.preventDefault(), n());
  }, s[0] = n, s[1] = r) : r = s[1], Ba(r);
  const o = !n;
  let i;
  s[2] !== n ? (i = () => {
    n?.();
  }, s[2] = n, s[3] = i) : i = s[3];
  let a;
  s[4] !== t.onClick || s[5] !== i ? (a = mt(t.onClick, i), s[4] = t.onClick, s[5] = i, s[6] = a) : a = s[6];
  let c;
  return s[7] !== t || s[8] !== e || s[9] !== o || s[10] !== a ? (c = /* @__PURE__ */ m(Se.button, {
    type: "button",
    disabled: o,
    ...t,
    ref: e,
    onClick: a
  }), s[7] = t, s[8] = e, s[9] = o, s[10] = a, s[11] = c) : c = s[11], c;
});
Fa.displayName = "ActionBarPrimitive.StopSpeaking";
const Xp = () => {
  const { submit: t } = Zf();
  return t;
}, La = me((t, e) => {
  const s = w(17);
  let n, r, o;
  s[0] !== t ? ({ onClick: r, disabled: n, ...o } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o) : (n = s[1], r = s[2], o = s[3]);
  const i = M(Zp), a = Xp();
  let c;
  s[4] !== i ? (c = i ? { "data-submitted": "true" } : {}, s[4] = i, s[5] = c) : c = s[5];
  const l = n || !a;
  let u;
  s[6] !== a ? (u = () => {
    a?.();
  }, s[6] = a, s[7] = u) : u = s[7];
  let h;
  s[8] !== r || s[9] !== u ? (h = mt(r, u), s[8] = r, s[9] = u, s[10] = h) : h = s[10];
  let d;
  return s[11] !== e || s[12] !== o || s[13] !== c || s[14] !== l || s[15] !== h ? (d = /* @__PURE__ */ m(Se.button, {
    type: "button",
    ...c,
    ...o,
    ref: e,
    disabled: l,
    onClick: h
  }), s[11] = e, s[12] = o, s[13] = c, s[14] = l, s[15] = h, s[16] = d) : d = s[16], d;
});
La.displayName = "ActionBarPrimitive.FeedbackPositive";
function Zp(t) {
  return t.message.metadata.submittedFeedback?.type === "positive";
}
const Kp = () => {
  const { submit: t } = Kf();
  return t;
}, Va = me((t, e) => {
  const s = w(17);
  let n, r, o;
  s[0] !== t ? ({ onClick: r, disabled: n, ...o } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o) : (n = s[1], r = s[2], o = s[3]);
  const i = M(eg), a = Kp();
  let c;
  s[4] !== i ? (c = i ? { "data-submitted": "true" } : {}, s[4] = i, s[5] = c) : c = s[5];
  const l = n || !a;
  let u;
  s[6] !== a ? (u = () => {
    a?.();
  }, s[6] = a, s[7] = u) : u = s[7];
  let h;
  s[8] !== r || s[9] !== u ? (h = mt(r, u), s[8] = r, s[9] = u, s[10] = h) : h = s[10];
  let d;
  return s[11] !== e || s[12] !== o || s[13] !== c || s[14] !== l || s[15] !== h ? (d = /* @__PURE__ */ m(Se.button, {
    type: "button",
    ...c,
    ...o,
    ref: e,
    disabled: l,
    onClick: h
  }), s[11] = e, s[12] = o, s[13] = c, s[14] = l, s[15] = h, s[16] = d) : d = s[16], d;
});
Va.displayName = "ActionBarPrimitive.FeedbackNegative";
function eg(t) {
  return t.message.metadata.submittedFeedback?.type === "negative";
}
const tg = (t) => {
  const e = w(6);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { filename: n, onExport: r } = s, o = oe(), i = M(ng);
  let a;
  e[2] !== o || e[3] !== n || e[4] !== r ? (a = async () => {
    const l = o.message().getCopyText();
    if (!l) return;
    if (r) {
      await r(l);
      return;
    }
    const u = new Blob([l], { type: "text/markdown" }), h = URL.createObjectURL(u), d = document.createElement("a");
    d.href = h, d.download = n ?? `message-${Date.now()}.md`, d.click(), URL.revokeObjectURL(h);
  }, e[2] = o, e[3] = n, e[4] = r, e[5] = a) : a = e[5];
  const c = a;
  return i ? c : null;
}, ja = me((t, e) => {
  const s = w(19);
  let n, r, o, i, a;
  s[0] !== t ? ({ filename: r, onExport: i, onClick: o, disabled: n, ...a } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o, s[4] = i, s[5] = a) : (n = s[1], r = s[2], o = s[3], i = s[4], a = s[5]);
  let c;
  s[6] !== r || s[7] !== i ? (c = {
    filename: r,
    onExport: i
  }, s[6] = r, s[7] = i, s[8] = c) : c = s[8];
  const l = tg(c), u = n || !l;
  let h;
  s[9] !== l ? (h = () => {
    l?.();
  }, s[9] = l, s[10] = h) : h = s[10];
  let d;
  s[11] !== o || s[12] !== h ? (d = mt(o, h), s[11] = o, s[12] = h, s[13] = d) : d = s[13];
  let f;
  return s[14] !== e || s[15] !== a || s[16] !== u || s[17] !== d ? (f = /* @__PURE__ */ m(Se.button, {
    type: "button",
    ...a,
    ref: e,
    disabled: u,
    onClick: d
  }), s[14] = e, s[15] = a, s[16] = u, s[17] = d, s[18] = f) : f = s[18], f;
});
ja.displayName = "ActionBarPrimitive.ExportMarkdown";
function sg(t) {
  return t.type === "text" && t.text.length > 0;
}
function ng(t) {
  return (t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some(sg);
}
var rg = /* @__PURE__ */ mr({
  Copy: () => Na,
  Edit: () => zp,
  ExportMarkdown: () => ja,
  FeedbackNegative: () => Va,
  FeedbackPositive: () => La,
  Reload: () => qp,
  Root: () => Da,
  Speak: () => Gp,
  StopSpeaking: () => Fa
});
const og = (t) => {
  const e = w(12);
  let s;
  return e[0] !== t.assistant || e[1] !== t.copied || e[2] !== t.hasAttachments || e[3] !== t.hasBranches || e[4] !== t.hasContent || e[5] !== t.last || e[6] !== t.lastOrHover || e[7] !== t.speaking || e[8] !== t.submittedFeedback || e[9] !== t.system || e[10] !== t.user ? (s = (n) => {
    const { role: r, attachments: o, parts: i, branchCount: a, isLast: c, speech: l, isCopied: u, isHovering: h } = n.message;
    return !(t.hasBranches === !0 && a < 2 || t.user && r !== "user" || t.assistant && r !== "assistant" || t.system && r !== "system" || t.lastOrHover === !0 && !h && !c || t.last !== void 0 && t.last !== c || t.copied === !0 && !u || t.copied === !1 && u || t.speaking === !0 && l == null || t.speaking === !1 && l != null || t.hasAttachments === !0 && (r !== "user" || !o?.length) || t.hasAttachments === !1 && r === "user" && o?.length || t.hasContent === !0 && i.length === 0 || t.hasContent === !1 && i.length > 0 || t.submittedFeedback !== void 0 && (n.message.metadata.submittedFeedback?.type ?? null) !== t.submittedFeedback);
  }, e[0] = t.assistant, e[1] = t.copied, e[2] = t.hasAttachments, e[3] = t.hasBranches, e[4] = t.hasContent, e[5] = t.last, e[6] = t.lastOrHover, e[7] = t.speaking, e[8] = t.submittedFeedback, e[9] = t.system, e[10] = t.user, e[11] = s) : s = e[11], M(s);
}, qa = (t) => {
  const e = w(3);
  let s, n;
  return e[0] !== t ? ({ children: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]), og(n) ? s : null;
};
qa.displayName = "MessagePrimitive.If";
const ig = (t) => {
  const e = w(4), s = zt(t), n = ut(ag);
  let r, o;
  e[0] !== s || e[1] !== n ? (r = () => n(s), o = [n, s], e[0] = s, e[1] = n, e[2] = r, e[3] = o) : (r = e[2], o = e[3]), Z(r, o);
};
function ag(t) {
  return t.onScrollToBottom;
}
const cg = () => !1, lg = () => {
}, ug = (t) => {
  const e = w(4);
  let s;
  e[0] !== t ? (s = (o) => {
    if (typeof window > "u" || t === null || !window.matchMedia) return lg;
    const i = window.matchMedia(t);
    return i.addEventListener("change", o), () => i.removeEventListener("change", o);
  }, e[0] = t, e[1] = s) : s = e[1];
  const n = s;
  let r;
  return e[2] !== t ? (r = () => typeof window > "u" || t === null || !window.matchMedia ? !1 : window.matchMedia(t).matches, e[2] = t, e[3] = r) : r = e[3], Jn(n, r, cg);
}, dg = () => M(hg);
function hg(t) {
  if (t.part.type !== "text" && t.part.type !== "reasoning") throw new Error("MessagePartText can only be used inside text or reasoning message parts.");
  return t.part;
}
const mg = ct(null);
function fg(t) {
  const e = Ts(mg);
  if (!t?.optional && !e) throw new Error("This component must be used within a SmoothContextProvider.");
  return e;
}
const { useSmoothStatus: nv, useSmoothStatusStore: pg } = Sa(fg, "useSmoothStatus"), Ua = 250, za = 5;
var gg = class {
  currentText;
  setText;
  animationFrameId = null;
  lastUpdateTime = Date.now();
  lastCommitTime = 0;
  targetText = "";
  drainMs = Ua;
  maxCharIntervalMs = za;
  maxCharsPerFrame = 1 / 0;
  minCommitMs = 0;
  constructor(t, e) {
    this.currentText = t, this.setText = e;
  }
  start() {
    this.animationFrameId === null && (this.lastUpdateTime = Date.now(), this.animate());
  }
  stop() {
    this.animationFrameId !== null && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null);
  }
  animate = () => {
    const t = Date.now();
    let e = t - this.lastUpdateTime;
    const s = this.targetText.length - this.currentText.length, n = Math.min(this.maxCharIntervalMs, this.drainMs / s), r = Math.min(s, this.maxCharsPerFrame);
    let o = 0;
    for (; e >= n && o < r; )
      o++, e -= n;
    o === r && r === this.maxCharsPerFrame && (e = 0), o !== s ? this.animationFrameId = requestAnimationFrame(this.animate) : this.animationFrameId = null, o !== 0 && (this.currentText = this.targetText.slice(0, this.currentText.length + o), this.lastUpdateTime = t - e, (o === s || t - this.lastCommitTime >= this.minCommitMs) && (this.lastCommitTime = t, this.setText(this.currentText)));
  };
};
const Ws = Object.freeze({ type: "running" }), es = (t, e) => t !== void 0 && t > 0 ? t : e, bg = (t, e = !1) => {
  const { text: s } = t, n = ug("(prefers-reduced-motion: reduce)"), r = typeof e == "object" && e !== null ? e : void 0, o = e !== !1 && e !== null && !n, i = es(r?.drainMs, Ua), a = es(r?.maxCharIntervalMs, za), c = es(r?.maxCharsPerFrame, 1 / 0), l = es(r?.minCommitMs, 0), [u, h] = ue(t.status.type === "running" ? "" : s), d = oe(), f = M(() => d.part()), [p, v] = ue(f);
  (f !== p || !s.startsWith(u)) && (v(f), h(t.status.type === "running" ? "" : s));
  const _ = pg({ optional: !0 }), C = zt((b) => {
    if (h(b), _) {
      const y = u !== b || t.status.type === "running" ? Ws : t.status;
      ws(_).setState(y, !0);
    }
  });
  Z(() => {
    if (_) {
      const b = o && (u !== s || t.status.type === "running") ? Ws : t.status;
      ws(_).setState(b, !0);
    }
  }, [
    _,
    o,
    s,
    u,
    t.status
  ]);
  const [I] = ue(new gg(u, C));
  Z(() => {
    I.drainMs = i, I.maxCharIntervalMs = a, I.maxCharsPerFrame = c, I.minCommitMs = l;
  }, [
    I,
    i,
    a,
    c,
    l
  ]);
  const E = de(f);
  return Z(() => {
    if (!o) {
      I.stop();
      return;
    }
    const b = E.current !== f;
    if (E.current = f, b || !s.startsWith(I.targetText)) {
      t.status.type === "running" ? (I.currentText = "", I.targetText = s, I.lastCommitTime = 0, I.start()) : (I.currentText = s, I.targetText = s, I.stop());
      return;
    }
    I.targetText = s, I.start();
  }, [
    I,
    o,
    s,
    t.status.type,
    f
  ]), Z(() => () => {
    I.stop();
  }, [I]), he(() => o ? {
    ...t,
    text: u,
    status: s === u ? t.status : Ws
  } : t, [
    o,
    u,
    t,
    s
  ]);
}, _g = () => M(vg);
function vg(t) {
  if (t.part.type !== "image") throw new Error("MessagePartImage can only be used inside image message parts.");
  return t.part;
}
const fr = me((t, e) => {
  const s = w(10);
  let n, r, o;
  s[0] !== t ? ({ smooth: r, component: o, ...n } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o) : (n = s[1], r = s[2], o = s[3]);
  const i = r === void 0 ? !0 : r, a = o === void 0 ? "span" : o, { text: c, status: l } = bg(dg(), i);
  let u;
  return s[4] !== a || s[5] !== e || s[6] !== n || s[7] !== l.type || s[8] !== c ? (u = /* @__PURE__ */ m(a, {
    "data-status": l.type,
    ...n,
    ref: e,
    children: c
  }), s[4] = a, s[5] = e, s[6] = n, s[7] = l.type, s[8] = c, s[9] = u) : u = s[9], u;
});
fr.displayName = "MessagePartPrimitive.Text";
const pr = me((t, e) => {
  const s = w(4), { image: n } = _g();
  let r;
  return s[0] !== e || s[1] !== n || s[2] !== t ? (r = /* @__PURE__ */ m(Se.img, {
    src: n,
    ...t,
    ref: e
  }), s[0] = e, s[1] = n, s[2] = t, s[3] = r) : r = s[3], r;
});
pr.displayName = "MessagePartPrimitive.Image";
const ft = (t) => {
  const e = w(2), s = de(void 0);
  let n;
  return e[0] !== t ? (n = (r) => {
    s.current && (s.current(), s.current = void 0), r && (s.current = t(r));
  }, e[0] = t, e[1] = n) : n = e[1], n;
}, io = (t, e) => {
  const s = t.trim().match(/^(\d+(?:\.\d+)?|\.\d+)(em|px|rem)$/);
  if (!s) return Number.POSITIVE_INFINITY;
  const n = Number(s[1]), r = s[2];
  return r === "px" ? n : r === "em" ? n * (parseFloat(getComputedStyle(e).fontSize) || 16) : r === "rem" ? n * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) : Number.POSITIVE_INFINITY;
}, yg = (t) => t.dataset.messageId, wg = () => {
  const t = document.createElement("div");
  return t.dataset.auiTopAnchorReserve = "", t.style.height = "0px", t.style.flexShrink = "0", t.style.pointerEvents = "none", t.setAttribute("aria-hidden", "true"), t;
}, ao = (t, e) => {
  const s = `${e}px`;
  return t.style.height !== s ? (t.style.height = s, !0) : !1;
}, Sg = (t) => {
  const e = window.devicePixelRatio || 1;
  return Math.round(t * e) / e;
}, Ha = () => {
  const t = w(4), e = oe();
  let s;
  t[0] !== e ? (s = () => e.message(), t[0] = e, t[1] = s) : s = t[1];
  const n = M(s);
  let r;
  return t[2] !== n ? (r = (o) => {
    const i = () => {
      n.setIsHovering(!0);
    }, a = () => {
      n.setIsHovering(!1);
    };
    return o.addEventListener("mouseenter", i), o.addEventListener("mouseleave", a), o.matches(":hover") && queueMicrotask(() => n.setIsHovering(!0)), () => {
      o.removeEventListener("mouseenter", i), o.removeEventListener("mouseleave", a), n.setIsHovering(!1);
    };
  }, t[2] = n, t[3] = r) : r = t[3], ft(r);
}, xg = () => {
  const t = w(2), e = ut(Ag);
  let s;
  return t[0] !== e ? (s = (n) => n.message.role === "user" && n.message.index > 0 && n.message.index === n.thread.messages.length - 2 && n.thread.messages.at(-1)?.role === "assistant" && (n.message.id === e || n.thread.isRunning), t[0] = e, t[1] = s) : s = t[1], M(s);
}, Ig = () => {
  const t = w(2), e = ut(Mg);
  let s;
  return t[0] !== e ? (s = (n) => n.message.isLast && n.message.role === "assistant" && n.message.index >= 1 && n.thread.messages.at(n.message.index - 1)?.role === "user" && (n.message.id === e || n.thread.isRunning), t[0] = e, t[1] = s) : s = t[1], M(s);
}, Tg = (t, e) => {
  const s = w(3);
  let n;
  return s[0] !== t || s[1] !== e ? (n = (r) => {
    if (t)
      return e.getState().registerAnchorElement(r);
  }, s[0] = t, s[1] = e, s[2] = n) : n = s[2], ft(n);
}, Cg = (t) => {
  const e = w(3), { active: s, threadViewportStore: n } = t;
  let r;
  return e[0] !== s || e[1] !== n ? (r = (o) => {
    if (!s) return;
    const i = n.getState(), a = i.topAnchorMessageClamp;
    return i.registerAnchorTargetElement(o, {
      tallerThan: io(a.tallerThan, o),
      visibleHeight: io(a.visibleHeight, o)
    });
  }, e[0] = s, e[1] = n, e[2] = r) : r = e[2], ft(r);
}, Eg = (t) => {
  const e = w(7);
  let s, n;
  e[0] !== t ? ({ forwardedRef: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  const r = Ha(), o = ht(s, r), i = M(Dg);
  let a;
  return e[3] !== i || e[4] !== n || e[5] !== o ? (a = /* @__PURE__ */ m(Se.div, {
    ...n,
    ref: o,
    "data-message-id": i
  }), e[3] = i, e[4] = n, e[5] = o, e[6] = a) : a = e[6], a;
}, Rg = (t) => {
  const e = w(13);
  let s, n, r;
  e[0] !== t ? ({ forwardedRef: s, threadViewportStore: r, ...n } = t, e[0] = t, e[1] = s, e[2] = n, e[3] = r) : (s = e[1], n = e[2], r = e[3]);
  const o = Ha(), i = xg(), a = Ig(), c = Tg(i, r);
  let l;
  e[4] !== a || e[5] !== r ? (l = {
    active: a,
    threadViewportStore: r
  }, e[4] = a, e[5] = r, e[6] = l) : l = e[6];
  const u = Cg(l), h = ht(s, o, c, u), d = M(kg), f = i ? "" : void 0, p = a ? "" : void 0;
  let v;
  return e[7] !== d || e[8] !== n || e[9] !== h || e[10] !== f || e[11] !== p ? (v = /* @__PURE__ */ m(Se.div, {
    ...n,
    ref: h,
    "data-message-id": d,
    "data-aui-top-anchor-user": f,
    "data-aui-top-anchor-target": p
  }), e[7] = d, e[8] = n, e[9] = h, e[10] = f, e[11] = p, e[12] = v) : v = e[12], v;
}, Ga = me((t, e) => {
  const s = w(7), n = dt();
  if (n.getState().turnAnchor === "top") {
    let o;
    return s[0] !== e || s[1] !== t || s[2] !== n ? (o = /* @__PURE__ */ m(Rg, {
      ...t,
      forwardedRef: e,
      threadViewportStore: n
    }), s[0] = e, s[1] = t, s[2] = n, s[3] = o) : o = s[3], o;
  }
  let r;
  return s[4] !== e || s[5] !== t ? (r = /* @__PURE__ */ m(Eg, {
    ...t,
    forwardedRef: e
  }), s[4] = e, s[5] = t, s[6] = r) : r = s[6], r;
});
Ga.displayName = "MessagePrimitive.Root";
function Ag(t) {
  return t.topAnchorTurn?.anchorId;
}
function Mg(t) {
  return t.topAnchorTurn?.targetId;
}
function Dg(t) {
  return t.message.id;
}
function kg(t) {
  return t.message.id;
}
const Ys = {
  ...fe,
  Text: () => /* @__PURE__ */ B("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ m(fr, {}), /* @__PURE__ */ m(ur, { children: /* @__PURE__ */ m("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Image: () => /* @__PURE__ */ m(pr, {})
}, pn = (t) => {
  const e = w(10);
  if ("children" in t) {
    let a;
    return e[0] !== t.children ? (a = /* @__PURE__ */ m(dn, { children: t.children }), e[0] = t.children, e[1] = a) : a = e[1], a;
  }
  let s, n;
  e[2] !== t ? ({ components: s, ...n } = t, e[2] = t, e[3] = s, e[4] = n) : (s = e[3], n = e[4]);
  let r;
  e[5] !== s ? (r = s ? {
    Text: s.Text ?? Ys.Text,
    Image: s.Image ?? Ys.Image,
    Reasoning: s.Reasoning ?? fe.Reasoning,
    Source: s.Source ?? fe.Source,
    File: s.File ?? fe.File,
    Unstable_Audio: s.Unstable_Audio ?? fe.Unstable_Audio,
    ..."ChainOfThought" in s ? { ChainOfThought: s.ChainOfThought } : {
      tools: s.tools,
      data: s.data,
      ToolGroup: s.ToolGroup ?? fe.ToolGroup,
      ReasoningGroup: s.ReasoningGroup ?? fe.ReasoningGroup
    },
    Empty: s.Empty,
    Quote: s.Quote,
    generativeUI: s.generativeUI
  } : Ys, e[5] = s, e[6] = r) : r = e[6];
  const o = r;
  let i;
  return e[7] !== n || e[8] !== o ? (i = /* @__PURE__ */ m(dn, {
    components: o,
    ...n
  }), e[7] = n, e[8] = o, e[9] = i) : i = e[9], i;
};
pn.displayName = "MessagePrimitive.Parts";
const Wa = (t) => {
  const { children: e } = t;
  return lp() !== void 0 ? e : null;
};
Wa.displayName = "MessagePrimitive.Error";
const Pg = (t) => {
  const e = /* @__PURE__ */ new Map();
  for (let n = 0; n < t.length; n++) {
    const r = t[n]?.parentId ?? `__ungrouped_${n}`, o = e.get(r) ?? [];
    o.push(n), e.set(r, o);
  }
  const s = [];
  for (const [n, r] of e) {
    const o = n.startsWith("__ungrouped_") ? void 0 : n;
    s.push({
      groupKey: o,
      indices: r
    });
  }
  return s;
}, $g = (t) => {
  const e = w(4), s = M(zg);
  let n;
  e: {
    if (s.length === 0) {
      let o;
      e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (o = [], e[0] = o) : o = e[0], n = o;
      break e;
    }
    let r;
    e[1] !== t || e[2] !== s ? (r = t(s), e[1] = t, e[2] = s, e[3] = r) : r = e[3], n = r;
  }
  return n;
}, Ng = (t) => {
  const e = w(9);
  let s, n;
  e[0] !== t ? ({ Fallback: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  e[3] !== s || e[4] !== n.toolName ? (r = (a) => {
    const c = a.tools.tools[n.toolName] ?? s;
    return Array.isArray(c) ? c[0] ?? s : c;
  }, e[3] = s, e[4] = n.toolName, e[5] = r) : r = e[5];
  const o = M(r);
  if (!o) return null;
  let i;
  return e[6] !== o || e[7] !== n ? (i = /* @__PURE__ */ m(o, { ...n }), e[6] = o, e[7] = n, e[8] = i) : i = e[8], i;
}, Og = (t) => {
  const e = w(9);
  let s, n;
  e[0] !== t ? ({ Fallback: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  e[3] !== s || e[4] !== n.name ? (r = (a) => {
    const c = a.dataRenderers.renderers[n.name] ?? s;
    return Array.isArray(c) ? c[0] ?? s : c;
  }, e[3] = s, e[4] = n.name, e[5] = r) : r = e[5];
  const o = M(r);
  if (!o) return null;
  let i;
  return e[6] !== o || e[7] !== n ? (i = /* @__PURE__ */ m(o, { ...n }), e[6] = o, e[7] = n, e[8] = i) : i = e[8], i;
}, Ue = {
  Text: () => /* @__PURE__ */ B("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ m(fr, {}), /* @__PURE__ */ m(ur, { children: /* @__PURE__ */ m("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Reasoning: () => null,
  Source: () => null,
  Image: () => /* @__PURE__ */ m(pr, {}),
  File: () => null,
  Unstable_Audio: () => null,
  Group: ({ children: t }) => t
}, Bg = (t) => {
  const e = w(43), { components: s } = t;
  let n;
  e[0] !== s ? (n = s === void 0 ? {} : s, e[0] = s, e[1] = n) : n = e[1];
  const { Text: r, Reasoning: o, Image: i, Source: a, File: c, Unstable_Audio: l, tools: u, data: h } = n, d = r === void 0 ? Ue.Text : r, f = o === void 0 ? Ue.Reasoning : o, p = i === void 0 ? Ue.Image : i, v = a === void 0 ? Ue.Source : a, _ = c === void 0 ? Ue.File : c, C = l === void 0 ? Ue.Unstable_Audio : l;
  let I;
  e[2] !== u ? (I = u === void 0 ? {} : u, e[2] = u, e[3] = I) : I = e[3];
  const E = I, b = oe(), y = M(Hg), T = y.type;
  if (T === "tool-call") {
    let x;
    e[4] !== b ? (x = b.part(), e[4] = b, e[5] = x) : x = e[5];
    const S = x.addToolResult;
    let j;
    e[6] !== b ? (j = b.part(), e[6] = b, e[7] = j) : j = e[7];
    const P = j.resumeToolCall;
    let H;
    e[8] !== b ? (H = b.part(), e[8] = b, e[9] = H) : H = e[9];
    const J = H.respondToToolApproval;
    if ("Override" in E) {
      let te;
      return e[10] !== S || e[11] !== y || e[12] !== J || e[13] !== P || e[14] !== E.Override ? (te = /* @__PURE__ */ m(E.Override, {
        ...y,
        addResult: S,
        resume: P,
        respondToApproval: J
      }), e[10] = S, e[11] = y, e[12] = J, e[13] = P, e[14] = E.Override, e[15] = te) : te = e[15], te;
    }
    const V = E.by_name?.[y.toolName] ?? E.Fallback;
    let F;
    return e[16] !== V || e[17] !== S || e[18] !== y || e[19] !== J || e[20] !== P ? (F = /* @__PURE__ */ m(Ng, {
      ...y,
      Fallback: V,
      addResult: S,
      resume: P,
      respondToApproval: J
    }), e[16] = V, e[17] = S, e[18] = y, e[19] = J, e[20] = P, e[21] = F) : F = e[21], F;
  }
  if (y.status?.type === "requires-action") throw new Error("Encountered unexpected requires-action status");
  switch (T) {
    case "text": {
      let x;
      return e[22] !== d || e[23] !== y ? (x = /* @__PURE__ */ m(d, { ...y }), e[22] = d, e[23] = y, e[24] = x) : x = e[24], x;
    }
    case "reasoning": {
      let x;
      return e[25] !== f || e[26] !== y ? (x = /* @__PURE__ */ m(f, { ...y }), e[25] = f, e[26] = y, e[27] = x) : x = e[27], x;
    }
    case "source": {
      let x;
      return e[28] !== v || e[29] !== y ? (x = /* @__PURE__ */ m(v, { ...y }), e[28] = v, e[29] = y, e[30] = x) : x = e[30], x;
    }
    case "image": {
      let x;
      return e[31] !== p || e[32] !== y ? (x = /* @__PURE__ */ m(p, { ...y }), e[31] = p, e[32] = y, e[33] = x) : x = e[33], x;
    }
    case "file": {
      let x;
      return e[34] !== _ || e[35] !== y ? (x = /* @__PURE__ */ m(_, { ...y }), e[34] = _, e[35] = y, e[36] = x) : x = e[36], x;
    }
    case "audio": {
      let x;
      return e[37] !== C || e[38] !== y ? (x = /* @__PURE__ */ m(C, { ...y }), e[37] = C, e[38] = y, e[39] = x) : x = e[39], x;
    }
    case "data": {
      const x = h?.by_name?.[y.name] ?? h?.Fallback;
      let S;
      return e[40] !== x || e[41] !== y ? (S = /* @__PURE__ */ m(Og, {
        ...y,
        Fallback: x
      }), e[40] = x, e[41] = y, e[42] = S) : S = e[42], S;
    }
    default:
      return console.warn(`Unknown message part type: ${T}`), null;
  }
}, Fg = (t) => {
  const e = w(5), { partIndex: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(Bg, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ m(sr, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, Lg = _e(Fg, (t, e) => t.partIndex === e.partIndex && t.components?.Text === e.components?.Text && t.components?.Reasoning === e.components?.Reasoning && t.components?.Source === e.components?.Source && t.components?.Image === e.components?.Image && t.components?.File === e.components?.File && t.components?.Unstable_Audio === e.components?.Unstable_Audio && t.components?.tools === e.components?.tools && t.components?.data === e.components?.data && t.components?.Group === e.components?.Group), Vg = (t) => {
  const e = w(6), { status: s, component: n } = t, r = s.type === "running";
  let o;
  e[0] !== n || e[1] !== s ? (o = /* @__PURE__ */ m(n, {
    type: "text",
    text: "",
    status: s
  }), e[0] = n, e[1] = s, e[2] = o) : o = e[2];
  let i;
  return e[3] !== r || e[4] !== o ? (i = /* @__PURE__ */ m(nr, {
    text: "",
    isRunning: r,
    children: o
  }), e[3] = r, e[4] = o, e[5] = i) : i = e[5], i;
}, jg = Object.freeze({ type: "complete" }), qg = (t) => {
  const e = w(6), { components: s } = t, n = M(Gg);
  if (s?.Empty) {
    let i;
    return e[0] !== s.Empty || e[1] !== n ? (i = /* @__PURE__ */ m(s.Empty, { status: n }), e[0] = s.Empty, e[1] = n, e[2] = i) : i = e[2], i;
  }
  const r = s?.Text ?? Ue.Text;
  let o;
  return e[3] !== n || e[4] !== r ? (o = /* @__PURE__ */ m(Vg, {
    status: n,
    component: r
  }), e[3] = n, e[4] = r, e[5] = o) : o = e[5], o;
}, Ug = _e(qg, (t, e) => t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), gr = (t) => {
  const e = w(9), { groupingFunction: s, components: n } = t, r = M(Wg), o = $g(s);
  let i;
  e: {
    if (r === 0) {
      let u;
      e[0] !== n ? (u = /* @__PURE__ */ m(Ug, { components: n }), e[0] = n, e[1] = u) : u = e[1], i = u;
      break e;
    }
    let l;
    if (e[2] !== n || e[3] !== o) {
      let u;
      e[5] !== n ? (u = (h, d) => /* @__PURE__ */ m(n?.Group ?? Ue.Group, {
        groupKey: h.groupKey,
        indices: h.indices,
        children: h.indices.map((f) => /* @__PURE__ */ m(Lg, {
          partIndex: f,
          components: n
        }, f))
      }, `group-${d}-${h.groupKey ?? "ungrouped"}`), e[5] = n, e[6] = u) : u = e[6], l = o.map(u), e[2] = n, e[3] = o, e[4] = l;
    } else l = e[4];
    i = l;
  }
  const a = i;
  let c;
  return e[7] !== a ? (c = /* @__PURE__ */ m($e, { children: a }), e[7] = a, e[8] = c) : c = e[8], c;
};
gr.displayName = "MessagePrimitive.Unstable_PartsGrouped";
const Ya = (t) => {
  const e = w(6);
  let s, n;
  e[0] !== t ? ({ components: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  return e[3] !== s || e[4] !== n ? (r = /* @__PURE__ */ m(gr, {
    ...n,
    components: s,
    groupingFunction: Pg
  }), e[3] = s, e[4] = n, e[5] = r) : r = e[5], r;
};
Ya.displayName = "MessagePrimitive.Unstable_PartsGroupedByParentId";
function zg(t) {
  return t.message.parts;
}
function Hg(t) {
  return t.part;
}
function Gg(t) {
  return t.message.status ?? jg;
}
function Wg(t) {
  return t.message.parts.length;
}
var gn = /* @__PURE__ */ mr({
  AttachmentByIndex: () => ba,
  Attachments: () => _a,
  Content: () => pn,
  Error: () => Wa,
  GenerativeUI: () => ia,
  GroupedParts: () => fa,
  If: () => qa,
  PartByIndex: () => $t,
  Parts: () => pn,
  Quote: () => pa,
  Root: () => Ga,
  Unstable_PartsGrouped: () => gr,
  Unstable_PartsGroupedByParentId: () => Ya
});
const Yg = (t) => {
  const e = w(2), s = zt(t);
  let n;
  return e[0] !== s ? (n = (r) => {
    const o = new ResizeObserver(() => {
      s();
    }), i = new MutationObserver((a) => {
      a.some(Jg) && s();
    });
    return o.observe(r), i.observe(r, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      characterData: !0
    }), () => {
      o.disconnect(), i.disconnect();
    };
  }, e[0] = s, e[1] = n) : n = e[1], ft(n);
};
function Jg(t) {
  return t.type !== "attributes" || t.attributeName !== "style";
}
const Qg = ({ autoScroll: t, scrollToBottomOnRunStart: e = !0, scrollToBottomOnInitialize: s = !0, scrollToBottomOnThreadSwitch: n = !0 }) => {
  const r = de(null), o = M((b) => b.thread.messages.length > 0), i = de(!1), a = de(null), c = dt();
  t === void 0 && (t = c.getState().turnAnchor !== "top");
  const l = de(0), u = de(0), h = de(0), d = de(0), f = de(null), p = as((b) => {
    const y = r.current;
    y && (f.current = b, y.scrollTo({
      top: y.scrollHeight,
      behavior: b
    }));
  }, []), v = as((b) => {
    f.current = b, a.current !== null && cancelAnimationFrame(a.current), a.current = requestAnimationFrame(() => {
      a.current = null, p(b);
    });
  }, [p]);
  fs(() => () => {
    a.current !== null && cancelAnimationFrame(a.current);
  }, []);
  const _ = as(() => {
    const b = c.getState();
    return b.turnAnchor === "top" && b.element.viewport === r.current && b.element.anchor !== null;
  }, [c]), C = () => {
    const b = r.current;
    if (!b) return;
    const y = c.getState().isAtBottom, T = Math.abs(b.scrollHeight - b.scrollTop - b.clientHeight) <= 1 || b.scrollHeight <= b.clientHeight;
    !T && l.current < b.scrollTop || (T ? b.scrollHeight > b.clientHeight + 1 && (f.current = null) : l.current > b.scrollTop && u.current === b.scrollHeight && (f.current = null), (T || f.current === null) && T !== y && ws(c).setState({ isAtBottom: T })), l.current = b.scrollTop, u.current = b.scrollHeight;
  }, I = Yg(() => {
    const b = r.current;
    if (!b) return;
    const { scrollHeight: y, clientHeight: T } = b;
    if (y === h.current && T === d.current) return;
    h.current = y, d.current = T;
    const x = f.current;
    x && _() ? f.current = null : x ? p(x) : t && c.getState().isAtBottom && p("instant"), C();
  }), E = ft((b) => {
    const y = () => {
      f.current = null;
    };
    return b.addEventListener("scroll", C), b.addEventListener("pointerdown", y), () => {
      b.removeEventListener("scroll", C), b.removeEventListener("pointerdown", y);
    };
  });
  return fs(() => {
    if (s) {
      if (!o) {
        i.current = !1;
        return;
      }
      i.current || (i.current = !0, f.current === null && v("instant"));
    }
  }, [
    o,
    v,
    s
  ]), ig(({ behavior: b }) => {
    p(b);
  }), gs("thread.runStart", () => {
    e && c.getState().turnAnchor !== "top" && v("auto");
  }), gs("threadListItem.switchedTo", () => {
    n && v("instant");
  }), ht(I, E, r);
}, Ja = me((t, e) => {
  const s = w(3);
  let n;
  return s[0] !== t || s[1] !== e ? (n = /* @__PURE__ */ m(Se.div, {
    ...t,
    ref: e
  }), s[0] = t, s[1] = e, s[2] = n) : n = s[2], n;
});
Ja.displayName = "ThreadPrimitive.Root";
const Qa = (t) => {
  const { children: e } = t;
  return M(Xg) ? e : null;
};
Qa.displayName = "ThreadPrimitive.Empty";
function Xg(t) {
  return t.thread.isEmpty;
}
const Zg = (t) => {
  const e = w(4);
  let s;
  return e[0] !== t.disabled || e[1] !== t.empty || e[2] !== t.running ? (s = (n) => !(t.empty === !0 && !n.thread.isEmpty || t.empty === !1 && n.thread.isEmpty || t.running === !0 && !n.thread.isRunning || t.running === !1 && n.thread.isRunning || t.disabled === !0 && !n.thread.isDisabled || t.disabled === !1 && n.thread.isDisabled), e[0] = t.disabled, e[1] = t.empty, e[2] = t.running, e[3] = s) : s = e[3], M(s);
}, Xa = (t) => {
  const e = w(3);
  let s, n;
  return e[0] !== t ? ({ children: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]), Zg(n) ? s : null;
};
Xa.displayName = "ThreadPrimitive.If";
const Za = (t, e) => {
  const s = w(3);
  let n;
  return s[0] !== e || s[1] !== t ? (n = (r) => {
    if (!t) return;
    const o = t(), i = () => {
      const c = e ? e(r) : r.offsetHeight;
      o.setHeight(c);
    }, a = new ResizeObserver(i);
    return a.observe(r), i(), () => {
      a.disconnect(), o.unregister();
    };
  }, s[0] = e, s[1] = t, s[2] = n) : n = s[2], ft(n);
}, co = (t) => {
  let e = 0, s = t;
  for (; s; )
    e += s.offsetTop, s = s.offsetParent;
  return e;
}, Kg = (t, e) => {
  let s = 0, n = t;
  for (; n && n !== e; )
    s += n.offsetTop, n = n.offsetParent;
  return n === e ? s : co(t) - co(e);
}, Ka = ({ viewport: t, anchor: e, tallerThan: s, visibleHeight: n }) => {
  const r = Kg(e, t), o = e.offsetHeight;
  return r + Math.max(0, o - (o <= s ? o : n));
}, eb = ({ scrollHeight: t, ...e }) => {
  const { viewport: s } = e, n = Ka(e) + s.clientHeight;
  return Math.max(0, n - t);
}, tb = ({ viewport: t, reserve: e, ...s }) => eb({
  viewport: t,
  ...s,
  scrollHeight: t.scrollHeight - e.offsetHeight
}), sb = (t) => {
  const e = new ResizeObserver(t), s = new MutationObserver(t);
  let n = null, r = null, o = null;
  const i = () => {
    e.disconnect(), s.disconnect(), n = null, r = null, o = null;
  };
  return {
    target: (a, c, l) => {
      n === a && r === c && o === l || (i(), e.observe(a), e.observe(c), e.observe(l), s.observe(l, {
        childList: !0,
        subtree: !0,
        characterData: !0
      }), n = a, r = c, o = l);
    },
    disconnect: i
  };
}, nb = (t) => {
  let e = null;
  return {
    schedule: () => {
      e === null && (e = requestAnimationFrame(() => {
        e = null, t();
      }));
    },
    cancel: () => {
      e !== null && (cancelAnimationFrame(e), e = null);
    }
  };
}, rb = (t) => {
  let e = null, s;
  function n() {
    const a = t.getState(), { viewport: c, anchor: l, target: u } = a.element, h = a.targetConfig;
    if (a.turnAnchor !== "top" || !c || !l || !u || !h) {
      o.disconnect(), e && (ao(e, 0), e.remove());
      return;
    }
    if (e ??= wg(), (e.parentElement !== u.parentElement || e.previousElementSibling !== u) && u.after(e), o.target(c, l, u), ao(e, tb({
      viewport: c,
      anchor: l,
      reserve: e,
      ...h
    }))) {
      r.schedule();
      return;
    }
    const d = yg(l);
    if (d !== void 0 && s === d) return;
    const f = Sg(Ka({
      viewport: c,
      anchor: l,
      ...h
    }));
    Math.abs(c.scrollTop - f) > 1 && c.scrollTo({
      top: f,
      behavior: "smooth"
    }), d !== void 0 && (s = d);
  }
  const r = nb(n), o = sb(r.schedule);
  r.schedule();
  const i = t.subscribe(r.schedule);
  return () => {
    r.cancel(), i(), o.disconnect(), e?.remove();
  };
}, ob = (t) => {
  const e = w(4), s = dt();
  let n, r;
  e[0] !== t || e[1] !== s ? (n = () => {
    if (t)
      return rb(s);
  }, r = [t, s], e[0] = t, e[1] = s, e[2] = n, e[3] = r) : (n = e[2], r = e[3]), fs(n, r);
}, ec = ({ isRunning: t, messages: e }) => {
  if (!t) return null;
  const s = e.at(-1), n = e.at(-2);
  return n?.role !== "user" || s?.role !== "assistant" ? null : {
    anchorId: n.id,
    targetId: s.id
  };
}, ib = (t) => ec(t)?.anchorId, ab = (t) => ec(t)?.targetId, cb = () => Za(ut(db), hb), lb = () => ft(ut(mb)), ub = (t) => {
  const e = w(13), s = dt();
  let n;
  e[0] !== t ? (n = (f) => {
    if (t)
      return ib(f.thread);
  }, e[0] = t, e[1] = n) : n = e[1];
  const r = M(n);
  let o;
  e[2] !== t ? (o = (f) => {
    if (t)
      return ab(f.thread);
  }, e[2] = t, e[3] = o) : o = e[3];
  const i = M(o);
  let a;
  e: {
    if (!r || !i) {
      a = null;
      break e;
    }
    let f;
    e[4] !== r || e[5] !== i ? (f = {
      anchorId: r,
      targetId: i
    }, e[4] = r, e[5] = i, e[6] = f) : f = e[6], a = f;
  }
  const c = a;
  let l, u;
  e[7] !== c || e[8] !== s ? (l = () => {
    if (!c) return;
    const f = s.getState(), p = f.topAnchorTurn;
    p?.anchorId === c.anchorId && p.targetId === c.targetId || f.setTopAnchorTurn(c);
  }, u = [c, s], e[7] = c, e[8] = s, e[9] = l, e[10] = u) : (l = e[9], u = e[10]), fs(l, u);
  let h;
  e[11] !== s ? (h = () => {
    s.getState().setTopAnchorTurn(null);
  }, e[11] = s, e[12] = h) : h = e[12];
  const d = h;
  gs("thread.initialize", d), gs("threadListItem.switchedTo", d);
}, tc = me((t, e) => {
  const s = w(18);
  let n, r, o, i, a, c;
  s[0] !== t ? ({ autoScroll: n, scrollToBottomOnRunStart: a, scrollToBottomOnInitialize: i, scrollToBottomOnThreadSwitch: c, children: r, ...o } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o, s[4] = i, s[5] = a, s[6] = c) : (n = s[1], r = s[2], o = s[3], i = s[4], a = s[5], c = s[6]);
  let l;
  s[7] !== n || s[8] !== i || s[9] !== a || s[10] !== c ? (l = {
    autoScroll: n,
    scrollToBottomOnRunStart: a,
    scrollToBottomOnInitialize: i,
    scrollToBottomOnThreadSwitch: c
  }, s[7] = n, s[8] = i, s[9] = a, s[10] = c, s[11] = l) : l = s[11];
  const u = Qg(l), h = cb(), d = lb(), f = dt();
  let p;
  s[12] !== f ? (p = f.getState(), s[12] = f, s[13] = p) : p = s[13];
  const v = p.turnAnchor === "top";
  ub(v), ob(v);
  const _ = ht(e, u, h, d);
  let C;
  return s[14] !== r || s[15] !== _ || s[16] !== o ? (C = /* @__PURE__ */ m(Se.div, {
    ...o,
    ref: _,
    children: r
  }), s[14] = r, s[15] = _, s[16] = o, s[17] = C) : C = s[17], C;
});
tc.displayName = "ThreadPrimitive.ViewportScrollable";
const sc = me((t, e) => {
  const s = w(13);
  let n, r, o;
  s[0] !== t ? ({ turnAnchor: o, topAnchorMessageClamp: r, ...n } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o) : (n = s[1], r = s[2], o = s[3]);
  let i;
  s[4] !== r || s[5] !== o ? (i = {
    turnAnchor: o,
    topAnchorMessageClamp: r
  }, s[4] = r, s[5] = o, s[6] = i) : i = s[6];
  let a;
  s[7] !== n || s[8] !== e ? (a = /* @__PURE__ */ m(tc, {
    ...n,
    ref: e
  }), s[7] = n, s[8] = e, s[9] = a) : a = s[9];
  let c;
  return s[10] !== i || s[11] !== a ? (c = /* @__PURE__ */ m(dr, {
    options: i,
    children: a
  }), s[10] = i, s[11] = a, s[12] = c) : c = s[12], c;
});
sc.displayName = "ThreadPrimitive.Viewport";
function db(t) {
  return t.registerViewport;
}
function hb(t) {
  return t.clientHeight;
}
function mb(t) {
  return t.registerViewportElement;
}
const nc = me((t, e) => {
  const s = w(3), n = ht(e, Za(ut(fb), pb));
  let r;
  return s[0] !== t || s[1] !== n ? (r = /* @__PURE__ */ m(Se.div, {
    ...t,
    ref: n
  }), s[0] = t, s[1] = n, s[2] = r) : r = s[2], r;
});
nc.displayName = "ThreadPrimitive.ViewportFooter";
function fb(t) {
  return t.registerContentInset;
}
function pb(t) {
  const e = parseFloat(getComputedStyle(t).marginTop) || 0;
  return t.offsetHeight + e;
}
const gb = (t) => {
  const e = w(5);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { behavior: n } = s, r = ut(_b), o = dt();
  let i;
  e[2] !== n || e[3] !== o ? (i = () => {
    o.getState().scrollToBottom({ behavior: n });
  }, e[2] = n, e[3] = o, e[4] = i) : i = e[4];
  const a = i;
  return r ? null : a;
}, bb = Ut("ThreadPrimitive.ScrollToBottom", gb, ["behavior"]);
function _b(t) {
  return t.isAtBottom;
}
const vb = (t) => {
  const e = w(4), { prompt: s, send: n, clearComposer: r, autoSend: o } = t, i = n ?? o ?? !1;
  let a;
  e[0] !== r || e[1] !== s || e[2] !== i ? (a = {
    prompt: s,
    send: i,
    clearComposer: r
  }, e[0] = r, e[1] = s, e[2] = i, e[3] = a) : a = e[3];
  const { disabled: c, trigger: l } = ap(a);
  return c ? null : l;
}, yb = Ut("ThreadPrimitive.Suggestion", vb, [
  "prompt",
  "send",
  "clearComposer",
  "autoSend",
  "method"
]);
var Rt = /* @__PURE__ */ mr({
  Empty: () => Qa,
  If: () => Xa,
  MessageByIndex: () => ta,
  Messages: () => qm,
  Root: () => Ja,
  ScrollToBottom: () => bb,
  Suggestion: () => yb,
  SuggestionByIndex: () => ya,
  Suggestions: () => Vf,
  Unstable_MessageById: () => sa,
  Viewport: () => sc,
  ViewportFooter: () => nc,
  ViewportProvider: () => dr
});
function wb({
  controller: t,
  children: e
}) {
  const s = O(
    async (o) => {
      const i = o.content.filter((a) => a.type === "text").map((a) => a.text).join("").trim();
      i && await t.send(qo(i));
    },
    [t.send]
  ), n = O(() => t.stop(), [t.stop]), r = Bm({
    messages: t.messages,
    isRunning: t.running,
    isLoading: t.sessionLoading,
    isDisabled: t.sessionLoading,
    isSendDisabled: t.sendDisabled,
    convertMessage: Sb,
    onNew: s,
    onCancel: n
  });
  return /* @__PURE__ */ m(gp, { runtime: r, children: e });
}
function Sb(t) {
  return t.role === "user" ? {
    id: t.id,
    role: "user",
    content: t.text ? [{ type: "text", text: t.text }] : [],
    metadata: {
      custom: lo(t)
    }
  } : {
    id: t.id,
    role: "assistant",
    content: Pc(t),
    status: t.running ? { type: "running" } : t.error ? { type: "incomplete", reason: "error", error: t.text } : { type: "complete", reason: "stop" },
    metadata: {
      custom: lo(t)
    }
  };
}
function lo(t) {
  return {
    recordID: t.recordID || 0,
    requestID: t.requestID || "",
    output: t.output,
    activities: t.activities || [],
    sourceText: t.text,
    createdAt: t.createdAt,
    content: t.content,
    document: t.document
  };
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/components/ui/dialog", "@/components/ui/input", "@/lib/utils"]);
const bn = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!bn || Object.keys(bn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const At = bn.Button, He = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!He || Object.keys(He).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const uo = He.Dialog, ho = He.DialogContent, mo = He.DialogDescription, fo = He.DialogFooter, po = He.DialogHeader, go = He.DialogTitle, _n = window.DeverFront?.sdk?.getCompatModule("@/components/ui/input");
if (!_n || Object.keys(_n).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/input");
const xb = _n.Input, vn = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!vn || Object.keys(vn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const Ib = vn.cn, yn = 152, bo = 76, _o = 6, Mt = 8;
function Tb({
  session: t,
  active: e,
  controller: s
}) {
  const [n, r] = W(!1), [o, i] = W(!1), [a, c] = W(t.title), [l, u] = W(""), [h, d] = W(!1), [f, p] = W(!1), [v, _] = W(!1), [C, I] = W({
    top: 0,
    left: 0
  }), E = re(null), b = re(null);
  le(() => {
    if (!v)
      return;
    const P = (V) => {
      const F = V.target;
      F instanceof Node && (E.current?.contains(F) || b.current?.contains(F) || _(!1));
    }, H = (V) => {
      V.key === "Escape" && _(!1);
    }, J = () => _(!1);
    return document.addEventListener("pointerdown", P, !0), document.addEventListener("keydown", H), document.addEventListener("scroll", J, !0), window.addEventListener("resize", J), () => {
      document.removeEventListener("pointerdown", P, !0), document.removeEventListener("keydown", H), document.removeEventListener("scroll", J, !0), window.removeEventListener("resize", J);
    };
  }, [v]);
  const y = () => {
    _(!1), c(t.title), u(""), r(!0);
  }, T = async (P) => {
    P.preventDefault();
    const H = a.trim();
    if (!H) {
      u("请输入会话标题");
      return;
    }
    d(!0), u("");
    try {
      await s.renameSession(t.id, H), r(!1);
    } catch (J) {
      u(vo(J, "编辑标题失败"));
    } finally {
      d(!1);
    }
  }, x = async () => {
    p(!0), u("");
    try {
      await s.deleteSession(t.id), i(!1);
    } catch (P) {
      u(vo(P, "删除会话失败"));
    } finally {
      p(!1);
    }
  }, S = (P) => {
    if (P.stopPropagation(), v) {
      _(!1);
      return;
    }
    E.current && (I(Cb(E.current)), _(!0));
  }, j = v && typeof document < "u" ? sl(
    /* @__PURE__ */ B(
      "div",
      {
        ref: b,
        role: "menu",
        "aria-label": `管理会话：${t.title}`,
        "data-assistant-layer": "true",
        className: "rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        style: {
          position: "fixed",
          top: C.top,
          left: C.left,
          width: yn,
          zIndex: is,
          pointerEvents: "auto"
        },
        onClick: (P) => P.stopPropagation(),
        children: [
          /* @__PURE__ */ B(
            "button",
            {
              type: "button",
              role: "menuitem",
              className: "flex w-full items-center gap-2 rounded-sm border-0 bg-transparent px-2 py-1.5 text-left text-sm outline-none hover:bg-accent focus-visible:bg-accent",
              onClick: y,
              children: [
                /* @__PURE__ */ m(vc, { className: "size-4 shrink-0" }),
                "编辑标题"
              ]
            }
          ),
          /* @__PURE__ */ B(
            "button",
            {
              type: "button",
              role: "menuitem",
              disabled: !!t.running,
              className: "flex w-full items-center gap-2 rounded-sm border-0 bg-transparent px-2 py-1.5 text-left text-sm text-destructive outline-none hover:bg-destructive/10 focus-visible:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50",
              onClick: () => {
                _(!1), u(""), i(!0);
              },
              children: [
                /* @__PURE__ */ m(yc, { className: "size-4 shrink-0" }),
                "删除"
              ]
            }
          )
        ]
      }
    ),
    Eb(E.current)
  ) : null;
  return /* @__PURE__ */ B($e, { children: [
    /* @__PURE__ */ m("span", { ref: E, className: "flex shrink-0", children: /* @__PURE__ */ m(zo, { label: "会话操作", children: /* @__PURE__ */ m(
      At,
      {
        type: "button",
        variant: "ghost",
        size: "icon",
        className: Ib(
          "size-7 shrink-0 text-muted-foreground transition-opacity hover:text-foreground",
          e ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
        ),
        "aria-label": `管理会话：${t.title}`,
        "aria-haspopup": "menu",
        "aria-expanded": v,
        onClick: S,
        children: /* @__PURE__ */ m(wc, { className: "size-4" })
      }
    ) }) }),
    j,
    /* @__PURE__ */ m(
      uo,
      {
        open: n,
        onOpenChange: (P) => {
          h || r(P);
        },
        children: /* @__PURE__ */ B(
          ho,
          {
            "data-assistant-layer": "true",
            layerZIndex: is,
            showCloseButton: !h,
            className: "sm:max-w-md",
            children: [
              /* @__PURE__ */ B(po, { children: [
                /* @__PURE__ */ m(go, { children: "编辑标题" }),
                /* @__PURE__ */ m(mo, { children: "修改左侧显示的会话标题。" })
              ] }),
              /* @__PURE__ */ B("form", { className: "space-y-4", onSubmit: T, children: [
                /* @__PURE__ */ m(
                  xb,
                  {
                    autoFocus: !0,
                    value: a,
                    maxLength: 255,
                    disabled: h,
                    "aria-label": "会话标题",
                    onChange: (P) => c(P.target.value)
                  }
                ),
                l ? /* @__PURE__ */ m("p", { className: "text-sm text-destructive", children: l }) : null,
                /* @__PURE__ */ B(fo, { children: [
                  /* @__PURE__ */ m(
                    At,
                    {
                      type: "button",
                      variant: "outline",
                      disabled: h,
                      onClick: () => r(!1),
                      children: "取消"
                    }
                  ),
                  /* @__PURE__ */ m(At, { type: "submit", disabled: h || !a.trim(), children: h ? "保存中..." : "保存" })
                ] })
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ m(
      uo,
      {
        open: o,
        onOpenChange: (P) => {
          f || i(P);
        },
        children: /* @__PURE__ */ B(
          ho,
          {
            "data-assistant-layer": "true",
            layerZIndex: is,
            showCloseButton: !f,
            className: "sm:max-w-md",
            children: [
              /* @__PURE__ */ B(po, { children: [
                /* @__PURE__ */ m(go, { children: "删除对话？" }),
                /* @__PURE__ */ B(mo, { children: [
                  "删除后，“",
                  t.title,
                  "”将从历史会话中移除。"
                ] })
              ] }),
              l ? /* @__PURE__ */ m("p", { className: "text-sm text-destructive", children: l }) : null,
              /* @__PURE__ */ B(fo, { children: [
                /* @__PURE__ */ m(
                  At,
                  {
                    type: "button",
                    variant: "outline",
                    disabled: f,
                    onClick: () => i(!1),
                    children: "取消"
                  }
                ),
                /* @__PURE__ */ m(
                  At,
                  {
                    type: "button",
                    variant: "destructive",
                    disabled: f,
                    onClick: () => {
                      x();
                    },
                    children: f ? "删除中..." : "删除"
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
}
function vo(t, e) {
  return t instanceof Error && t.message.trim() ? t.message.trim() : e;
}
function Cb(t) {
  const e = t.getBoundingClientRect(), s = Math.max(
    Mt,
    window.innerWidth - yn - Mt
  ), n = Math.min(
    s,
    Math.max(Mt, e.right - yn)
  ), r = e.bottom + _o;
  return { top: r + bo <= window.innerHeight - Mt ? r : Math.max(Mt, e.top - bo - _o), left: n };
}
function Eb(t) {
  return t?.closest('[data-agent-chat-layer="true"]') || document.body;
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/lib/utils"]);
const wn = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!wn || Object.keys(wn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const yo = wn.Button, Sn = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!Sn || Object.keys(Sn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const wo = Sn.cn;
function So({
  agentName: t,
  title: e,
  agentReady: s,
  controller: n,
  collapsed: r = !1,
  mobile: o = !1,
  embedded: i = !1,
  onBack: a,
  onOpenSession: c,
  onStartNewSession: l
}) {
  return /* @__PURE__ */ B(
    "aside",
    {
      className: wo(
        "agent-chat-sidebar h-full shrink-0 flex-col bg-muted/25",
        i ? "flex w-full" : o ? "flex w-full md:hidden" : "hidden border-r",
        !i && !o && !r && "md:flex"
      ),
      style: o || i ? void 0 : {
        width: "var(--agent-chat-sidebar-width, 300px)",
        minWidth: "var(--agent-chat-sidebar-width, 300px)",
        flexBasis: "var(--agent-chat-sidebar-width, 300px)"
      },
      children: [
        /* @__PURE__ */ m("div", { className: "agent-chat-sidebar-header shrink-0 border-b p-3", children: /* @__PURE__ */ B("div", { className: "agent-chat-sidebar-controls flex min-w-0 items-center gap-2", children: [
          i ? /* @__PURE__ */ B(
            yo,
            {
              type: "button",
              size: "icon",
              variant: "ghost",
              className: "size-9 shrink-0",
              title: "返回当前对话",
              onClick: a,
              children: [
                /* @__PURE__ */ m(Fo, { className: "size-4" }),
                /* @__PURE__ */ m("span", { className: "sr-only", children: "返回当前对话" })
              ]
            }
          ) : null,
          /* @__PURE__ */ m("div", { className: "agent-chat-sidebar-name min-w-0 flex-1 truncate px-2 py-1 text-left text-sm font-semibold text-foreground", children: e ?? (t || "智能体") }),
          /* @__PURE__ */ B(
            yo,
            {
              type: "button",
              variant: "outline",
              className: "agent-chat-new-session h-10 shrink-0 justify-start gap-2 bg-background px-3",
              disabled: n.sessionLoading || !s,
              onClick: () => {
                l ? l() : n.startNewSession();
              },
              children: [
                /* @__PURE__ */ m("span", { className: "agent-chat-new-session-icon contents", children: /* @__PURE__ */ m(Lo, { className: "size-4" }) }),
                /* @__PURE__ */ m("span", { children: "新对话" })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ B("div", { className: "agent-chat-session-section flex min-h-0 flex-1 flex-col", children: [
          /* @__PURE__ */ m("div", { className: "agent-chat-session-heading shrink-0 px-4 pb-2 pt-4 text-xs font-medium text-muted-foreground", children: "历史会话" }),
          /* @__PURE__ */ m(
            "div",
            {
              ref: n.sessionListRef,
              className: "agent-chat-session-list min-h-0 flex-1 overflow-y-auto px-2 pb-3",
              onScroll: (u) => n.handleSessionListScroll(u.currentTarget),
              children: n.sessionsLoading && n.sessions.length === 0 ? /* @__PURE__ */ m("div", { className: "flex h-24 items-center justify-center text-muted-foreground", children: /* @__PURE__ */ m(Dt, { className: "size-4 animate-spin" }) }) : n.sessions.length === 0 ? /* @__PURE__ */ m("div", { className: "px-2 py-6 text-center text-xs leading-5 text-muted-foreground", children: "暂无历史会话" }) : /* @__PURE__ */ B("div", { className: "space-y-1", children: [
                n.sessions.map((u) => /* @__PURE__ */ B(
                  "div",
                  {
                    className: wo(
                      "agent-chat-session-item group flex min-h-10 w-full items-center rounded-md px-1 transition-colors",
                      u.id === n.sessionID ? "bg-background font-medium text-foreground shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                    ),
                    children: [
                      /* @__PURE__ */ B(
                        "button",
                        {
                          type: "button",
                          className: "agent-chat-session-trigger flex min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left text-sm",
                          onClick: () => {
                            c ? c(u.id) : n.openSession(u.id);
                          },
                          children: [
                            u.running ? /* @__PURE__ */ m(Dt, { className: "size-3.5 shrink-0 animate-spin" }) : /* @__PURE__ */ m(Sc, { className: "size-3.5 shrink-0" }),
                            /* @__PURE__ */ m("span", { className: "min-w-0 flex-1 truncate", children: u.title })
                          ]
                        }
                      ),
                      /* @__PURE__ */ m(
                        Tb,
                        {
                          session: u,
                          active: u.id === n.sessionID,
                          controller: n
                        }
                      )
                    ]
                  },
                  u.id
                )),
                n.sessionsLoadingMore ? /* @__PURE__ */ m("div", { className: "flex h-10 items-center justify-center text-muted-foreground", children: /* @__PURE__ */ m(Dt, { className: "size-4 animate-spin" }) }) : null
              ] })
            }
          )
        ] })
      ]
    }
  );
}
const Rb = 32;
function Ab(t, e, s = Rb) {
  let n = t, r = null, o = !0, i = 0;
  const a = () => {
    r != null && (clearTimeout(r), r = null);
  }, c = () => {
    a(), i = xo(), e(n);
  }, l = () => {
    if (r != null)
      return;
    const u = xo() - i, h = Math.max(0, s - u);
    r = setTimeout(c, h);
  };
  return {
    get text() {
      return n;
    },
    append(u) {
      if (u) {
        if (n += u, o) {
          o = !1, c();
          return;
        }
        l();
      }
    },
    reset(u = "") {
      a(), n = u, o = !0, i = 0;
    },
    flush: c,
    dispose() {
      a();
    }
  };
}
function xo() {
  return typeof performance > "u" ? Date.now() : performance.now();
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-runner", "@/lib/runtime-stream-output", "@/lib/stream"]);
const Vt = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-runner");
if (!Vt || Object.keys(Vt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-runner");
const Mb = Vt.runRuntimeStream, Db = Vt.stopRuntimeStream, kb = Vt.watchRuntimeStream, xn = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!xn || Object.keys(xn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const Js = xn.runtimeErrorMessage, In = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!In || Object.keys(In).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const Io = In.streamValueText;
function Pb({
  agentKey: t,
  contextKey: e,
  modalOpen: s,
  sessionLoading: n,
  sessionID: r,
  messages: o,
  blockMs: i,
  runtimeApi: a,
  requestScope: c,
  getActiveSessionID: l,
  getSessionTitle: u,
  getSessionMessages: h,
  updateSessionMessages: d,
  updateSessionTitle: f,
  syncSessionTitle: p,
  setSessionRunning: v,
  setError: _
}) {
  const [C, I] = W({}), E = re(/* @__PURE__ */ new Map()), b = O(
    (g) => {
      g.detached || (I((A) => ({
        ...A,
        [g.sessionID]: {
          requestID: g.requestID,
          cancelable: g.cancelable,
          stopping: g.stopping
        }
      })), v(g.sessionID, !0));
    },
    [v]
  ), y = O(
    (g) => {
      const A = E.current.get(g.sessionID);
      return A && A !== g ? !1 : (E.current.set(g.sessionID, g), b(g), !0);
    },
    [b]
  ), T = O(
    (g) => {
      E.current.get(g.sessionID) === g && (g.buffer.dispose(), E.current.delete(g.sessionID), I((A) => {
        const D = { ...A };
        return delete D[g.sessionID], D;
      }), v(g.sessionID, !1));
    },
    [v]
  ), x = O(
    (g, A) => {
      g.detached || d(
        g.sessionID,
        (D) => D.map(
          ($) => Tn($, g) ? {
            ...$,
            ...typeof A == "function" ? A($) : A
          } : $
        )
      );
    },
    [d]
  ), S = O(
    (g, A) => {
      E.current.get(g.sessionID) === g && (g.buffer.flush(), x(g, (D) => {
        const $ = Ho(A.output), U = il(
          A.output?.document
        ), Q = {
          text: A.text,
          requestID: A.requestID || g.requestID || void 0,
          running: !1,
          error: !!A.error,
          activities: al(
            D.activities,
            $
          )
        };
        return cl(A.output) && (Q.output = A.output), Q.document = Ss(
          D.document,
          U
        ), U && D.document?.id !== U.id && (Q.autoOpenDocument = !0), Q;
      }), T(g), g.kind !== "opening" && p(g.sessionID));
    },
    [T, p, x]
  ), j = O(
    (g, A) => {
      if (g.detached || E.current.get(g.sessionID) !== g)
        return !1;
      const D = ll(A);
      if (D.requestID && !g.requestID && (g.requestID = D.requestID), D.streamID && (g.lastStreamID = D.streamID), D.runVersion > 0) {
        if (g.runVersion > D.runVersion)
          return !0;
        g.runVersion = D.runVersion;
      }
      D.assistantMessageID > 0 && x(g, { recordID: D.assistantMessageID }), D.cancelable != null && D.cancelable !== g.cancelable && (g.cancelable = D.cancelable, b(g)), $b(D.event, D.output) && x(g, (U) => {
        const Q = Go(
          U.document,
          D.output
        );
        return {
          document: Q,
          autoOpenDocument: U.autoOpenDocument || D.event === "document_start" && !!Q && U.document?.id !== Q?.id,
          requestID: D.requestID || g.requestID || void 0,
          running: !0
        };
      }), D.event === "reset" && (g.replayPending = !1, g.buffer.reset(Io(D.output.text)), g.buffer.flush()), D.delta && (g.replayPending && (g.replayPending = !1, g.buffer.reset()), g.buffer.append(D.delta));
      const $ = D.activity;
      if ($) {
        g.buffer.flush();
        const U = $.anchorText ? $ : { ...$, anchorText: g.buffer.text };
        x(g, (Q) => ({
          activities: ul(
            Q.activities,
            U
          ),
          requestID: D.requestID || g.requestID || void 0,
          running: !0
        }));
      }
      return g.kind === "opening" && D.finished && D.event === "opening_skipped" ? (d(
        g.sessionID,
        (U) => U.filter((Q) => !Tn(Q, g))
      ), T(g), !1) : D.finished ? (S(g, {
        text: To({
          text: D.finalText,
          streamedText: g.buffer.text,
          error: D.error,
          failed: D.failed
        }),
        error: D.failed,
        requestID: D.requestID,
        output: D.output
      }), !1) : !0;
    },
    [S, b, T, x, d]
  ), P = O(
    (g) => {
      let A;
      const D = Ab(g.text || "", ($) => {
        x(A, {
          text: $,
          requestID: A.requestID || void 0,
          running: !0,
          error: !1
        });
      });
      return A = {
        kind: g.kind || "chat",
        sessionID: g.sessionID,
        requestID: g.requestID || "",
        userMessageID: g.userMessageID,
        assistantMessageID: g.assistantMessageID,
        createdAt: g.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        input: g.prompt || "",
        content: g.content,
        buffer: D,
        lastStreamID: "0-0",
        cancelable: !1,
        stopping: !1,
        stopped: !1,
        detached: !1,
        replayPending: !!g.replayPending,
        runVersion: 0,
        controller: new AbortController()
      }, A;
    },
    [x]
  ), H = O(
    (g, A) => {
      if (!dl(A.status))
        return !1;
      const D = A.status === "fail", $ = A.status === "canceled", U = To({
        text: A.text,
        streamedText: g.buffer.text,
        error: A.error,
        failed: D,
        canceled: $
      });
      return S(g, {
        text: U,
        error: D,
        requestID: A.requestID,
        output: A.output
      }), D && l() === g.sessionID && _(A.error.trim() || U), !0;
    },
    [S, l, _]
  ), J = O(
    async (g, A) => {
      const D = A.requestID || "";
      if (!D || !g || E.current.has(g))
        return;
      const $ = P({
        kind: A.kind === "opening" ? "opening" : "chat",
        sessionID: g,
        requestID: D,
        userMessageID: "",
        assistantMessageID: A.id,
        createdAt: A.createdAt,
        text: A.text,
        replayPending: !!A.text
      });
      if (!y($)) {
        $.buffer.dispose();
        return;
      }
      try {
        const U = await wr(
          a.status,
          D
        );
        if ($.detached || E.current.get(g) !== $ || ($.runVersion = Math.max($.runVersion, U.runVersion), H($, U)) || (await kb({
          streamApi: a.stream,
          requestID: D,
          lastID: $.lastStreamID,
          blockMs: i,
          signal: $.controller.signal,
          // applyFrame only returns false for the current run version. Old
          // terminal frames from an interrupted attempt must not stop replay.
          stopOnResult: !1,
          recoverOnError: !0,
          fallbackToPoll: !1,
          onFrame: (ae) => j($, ae) ? void 0 : !1
        }), $.detached || $.controller.signal.aborted || E.current.get(g) !== $))
          return;
        const Q = await wr(
          a.status,
          D
        );
        H($, Q);
      } catch (U) {
        if ($.detached || $.controller.signal.aborted || E.current.get(g) !== $)
          return;
        const Q = Js(
          U,
          "恢复智能体运行失败。"
        );
        S($, {
          text: $.buffer.text.trim() || Q,
          error: !0,
          requestID: D
        }), l() === g && _(Q);
      }
    },
    [
      j,
      i,
      P,
      S,
      H,
      l,
      y,
      a.status,
      a.stream,
      _
    ]
  );
  le(() => {
    if (!s || n || !r)
      return;
    const g = o.find(
      (A) => A.role === "assistant" && A.running && !!A.requestID
    );
    g && J(r, g);
  }, [o, s, J, r, n]);
  const V = O(
    async (g, A, D) => {
      _("");
      try {
        const $ = await Mb({
          requestApi: A,
          streamApi: a.stream,
          stopApi: a.stop,
          stopOnAbort: !1,
          fallbackToPoll: !1,
          blockMs: i,
          signal: g.controller.signal,
          body: D,
          onRequestID: (ae) => {
            g.detached || (g.requestID = ae, b(g), x(g, { requestID: ae }));
          },
          onFrame: (ae) => {
            j(g, ae);
          }
        });
        if (g.detached || g.stopped || E.current.get(g.sessionID) !== g)
          return;
        const U = hl($.finalOutput), Q = Io(
          $.finalOutput?.text || $.textOutput || g.buffer.text
        ).trim();
        S(g, {
          text: Q,
          output: U,
          requestID: $.requestID
        });
      } catch ($) {
        if (g.detached || g.stopped || E.current.get(g.sessionID) !== g)
          return;
        const U = Js(
          $,
          g.kind === "opening" ? "智能体开场失败。" : "智能体运行失败。"
        );
        S(g, {
          text: g.buffer.text.trim() || U,
          error: !0,
          requestID: g.requestID
        }), l() === g.sessionID && _(U);
      }
    },
    [
      j,
      i,
      S,
      l,
      b,
      a.stop,
      a.stream,
      _,
      x
    ]
  ), F = O(
    async (g) => {
      const A = g.text.trim(), D = l();
      if (!Uo(g) || !t || !D || E.current.has(D))
        return;
      const $ = Date.now(), U = new Date($).toISOString(), Q = {
        id: `${D}-user-${$}`,
        role: "user",
        text: A,
        createdAt: U,
        content: g.content
      }, ae = `${D}-assistant-${$}`, ge = P({
        sessionID: D,
        userMessageID: Q.id,
        assistantMessageID: ae,
        createdAt: U,
        prompt: A,
        content: g.content
      });
      if (!y(ge)) {
        ge.buffer.dispose();
        return;
      }
      f(
        D,
        Ob(u(D), A)
      ), d(D, (De) => [
        ...De,
        Q,
        {
          id: ae,
          role: "assistant",
          text: "",
          createdAt: U,
          running: !0
        }
      ]), await V(ge, a.request, {
        ...c,
        agent: t,
        session_id: D,
        context_key: e,
        input: {
          text: A,
          content: g.content,
          params: g.params
        }
      });
    },
    [
      t,
      e,
      P,
      V,
      l,
      u,
      y,
      c,
      a.request,
      d,
      f
    ]
  ), te = O(
    async (g) => {
      const A = a.opening?.trim() || "";
      if (!A || !t || !g || E.current.has(g))
        return;
      const D = Date.now(), $ = new Date(D).toISOString(), U = h(g).find(
        (ge) => ge.role === "assistant" && ge.kind === "opening" && !!ge.requestID
      ), Q = U?.id || `${g}-opening-${D}`, ae = P({
        kind: "opening",
        sessionID: g,
        requestID: U?.requestID,
        userMessageID: "",
        assistantMessageID: Q,
        createdAt: U?.createdAt || $,
        text: U?.text,
        replayPending: !!(U?.running && U.text)
      });
      if (!y(ae)) {
        ae.buffer.dispose();
        return;
      }
      U || d(g, (ge) => [
        ...ge,
        {
          id: Q,
          role: "assistant",
          kind: "opening",
          text: "",
          createdAt: $,
          running: !0
        }
      ]), await V(ae, A, {
        ...c,
        agent: t,
        session_id: g,
        context_key: e
      });
    },
    [
      t,
      e,
      P,
      V,
      h,
      y,
      c,
      a.opening,
      d
    ]
  ), ce = O(async () => {
    const g = l(), A = E.current.get(g);
    if (!(!A?.requestID || !A.cancelable || A.stopping)) {
      A.stopping = !0, b(A), _("");
      try {
        if (await Db(A.requestID, a.stop), E.current.get(g) !== A)
          return;
        A.stopped = !0, A.controller.abort(), S(A, {
          text: A.buffer.text.trim() || "已停止生成",
          requestID: A.requestID
        });
      } catch (D) {
        if (E.current.get(g) !== A)
          return;
        A.stopping = !1, b(A), l() === g && _(Js(D, "停止生成失败。"));
      }
    }
  }, [S, l, b, a.stop, _]), K = O(
    (g) => E.current.has(g),
    []
  ), z = O(
    (g, A) => Nb(A, E.current.get(g)),
    []
  ), ee = O(() => {
    for (const g of E.current.values())
      g.detached = !0, g.buffer.dispose(), g.controller.abort(), v(g.sessionID, !1);
    E.current.clear(), I({});
  }, [v]);
  le(() => () => {
    for (const g of E.current.values())
      g.detached = !0, g.buffer.dispose(), g.controller.abort();
    E.current.clear();
  }, []);
  const L = C[r];
  return {
    running: !!(L || o.some(
      (g) => g.role === "assistant" && g.running
    )),
    stopping: !!L?.stopping,
    cancelable: !!L?.cancelable,
    hasRun: K,
    mergeMessages: z,
    reset: ee,
    send: F,
    startOpening: te,
    stop: ce
  };
}
function Tn(t, e) {
  return t.id === e.assistantMessageID || !!(e.requestID && t.requestID === e.requestID);
}
function $b(t, e) {
  return !!(e.document || e.document_id) || [
    "document_start",
    "block_commit",
    "text_delta",
    "media_block_append",
    "artifact_progress",
    "artifact_ready",
    "artifact_failed",
    "document_content_complete",
    "document_complete"
  ].includes(t);
}
function Nb(t, e) {
  if (!e)
    return t;
  let s = !1;
  const n = t.map((r) => Tn(r, e) ? (s = !0, {
    ...r,
    requestID: e.requestID || r.requestID,
    text: e.buffer.text || r.text,
    running: !0,
    error: !1
  }) : r);
  return s ? n : [
    ...n,
    ...e.input || $c(e.content) ? [
      {
        id: e.userMessageID,
        role: "user",
        text: e.input,
        createdAt: e.createdAt,
        content: e.content
      }
    ] : [],
    {
      id: e.assistantMessageID,
      role: "assistant",
      text: e.buffer.text,
      createdAt: e.createdAt,
      requestID: e.requestID || void 0,
      running: !0,
      error: !1
    }
  ];
}
function Ob(t, e) {
  return t.trim() && t.trim() !== "新会话" ? t : Array.from(e.trim().replace(/\s+/g, " ")).slice(0, 40).join("") || "新会话";
}
function To(t) {
  const e = t.text?.trim() || t.streamedText?.trim() || "";
  return e || (t.canceled ? "已停止生成" : t.failed ? t.error?.trim() || "智能体运行失败。" : "");
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-runner", "@/lib/runtime-stream-output"]);
const Cn = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-runner");
if (!Cn || Object.keys(Cn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-runner");
const Bb = Cn.watchRuntimeStream, En = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!En || Object.keys(En).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const Fb = En.normalizeRuntimeFrameOutput;
function Lb({
  modalOpen: t,
  sessionID: e,
  messages: s,
  blockMs: n,
  runtimeApi: r,
  updateDocument: o
}) {
  const i = re(/* @__PURE__ */ new Map());
  le(() => {
    const a = i.current;
    if (!t || !e) {
      Co(a);
      return;
    }
    const c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
    for (const u of s)
      u.document && (c.set(u.document.id, u.document), ml(u.document) && l.set(u.document.id, u.document));
    for (const [u, h] of a) {
      const d = c.get(u);
      if (!d || h.sessionID !== e) {
        h.controller.abort(), a.delete(u);
        continue;
      }
      h.document = Ss(h.document, d) || d;
    }
    for (const u of l.values()) {
      if (a.has(u.id))
        continue;
      const h = {
        sessionID: e,
        controller: new AbortController(),
        document: u
      };
      a.set(u.id, h), Vb({
        watch: h,
        watches: a,
        blockMs: n,
        runtimeApi: r,
        updateDocument: o
      });
    }
  }, [n, s, t, r, e, o]), le(() => {
    const a = i.current;
    return () => Co(a);
  }, []);
}
async function Vb(t) {
  const { watch: e, watches: s, blockMs: n, runtimeApi: r, updateDocument: o } = t, i = e.document.id;
  let a = null, c = 0, l = 0;
  const u = (f) => {
    !f || e.controller.signal.aborted || (e.document = f, o(e.sessionID, i, f));
  }, h = async () => {
    const f = await Nc(
      r.document,
      i
    );
    return u(Ss(e.document, f)), f;
  }, d = () => {
    if (a || e.controller.signal.aborted)
      return;
    const f = new AbortController(), p = () => f.abort();
    a = f, c = Date.now(), e.controller.signal.addEventListener("abort", p, { once: !0 }), Bb({
      streamApi: r.documentStream,
      requestID: `document:${i}`,
      blockMs: n,
      signal: f.signal,
      stopOnResult: !1,
      recoverOnError: !0,
      fallbackToPoll: !1,
      onFrame: (v) => {
        c = Date.now();
        const _ = Ub(v);
        u(Go(e.document, _)), zb(_) === "document_complete" && h().catch(() => {
        });
      }
    }).catch(() => {
    }).finally(() => {
      e.controller.signal.removeEventListener("abort", p), a === f && (a = null);
    });
  };
  try {
    d();
    try {
      const f = await h();
      if (!ds(f))
        return;
    } catch {
      if (e.controller.signal.aborted)
        return;
      l = 1;
    }
    for (; !e.controller.signal.aborted; ) {
      if (await qb(
        e.controller.signal,
        jb(l)
      ), e.controller.signal.aborted)
        return;
      if (!(a !== null && Date.now() - c < Math.max(6e3, n * 3)))
        try {
          const p = await h();
          if (!ds(p))
            return;
          l = Math.min(l + 1, 3), d();
        } catch {
          if (e.controller.signal.aborted)
            return;
          l = Math.min(l + 1, 3);
        }
    }
  } finally {
    a?.abort(), s.get(i) === e && s.delete(i);
  }
}
function jb(t) {
  const e = [2e3, 4e3, 8e3, 12e3];
  return e[Math.min(t, e.length - 1)] ?? e[e.length - 1];
}
function qb(t, e) {
  return new Promise((s) => {
    if (t.aborted) {
      s();
      return;
    }
    const n = window.setTimeout(r, e);
    t.addEventListener("abort", r, { once: !0 });
    function r() {
      window.clearTimeout(n), t.removeEventListener("abort", r), s();
    }
  });
}
function Ub(t) {
  return Fb(t.output, t);
}
function zb(t) {
  return String(t.event || t.semantic_event || "").trim().toLowerCase();
}
function Co(t) {
  for (const e of t.values())
    e.controller.abort();
  t.clear();
}
const ts = [800, 1500, 3e3, 5e3, 8e3];
function Hb({
  modalOpen: t,
  sessionID: e,
  messages: s,
  refreshSession: n
}) {
  const r = Wb(s);
  le(() => {
    if (!t || !e || !r)
      return;
    const o = new AbortController();
    return Gb(e, o.signal, n), () => o.abort();
  }, [t, r, n, e]);
}
async function Gb(t, e, s) {
  let n = 0;
  for (; !e.aborted; ) {
    const r = ts[Math.min(n, ts.length - 1)] ?? ts[ts.length - 1];
    if (await Yb(e, r), e.aborted)
      return;
    try {
      await s(t);
    } catch {
    }
    n += 1;
  }
}
function Wb(t) {
  return t.filter((e) => !e.document).flatMap(
    (e) => Wo(e.output).filter((s) => s.status === "generating").map((s) => s.id)
  ).sort((e, s) => e - s).join(":");
}
function Yb(t, e) {
  return new Promise((s) => {
    if (t.aborted) {
      s();
      return;
    }
    const n = window.setTimeout(r, e);
    t.addEventListener("abort", r, { once: !0 });
    function r() {
      window.clearTimeout(n), t.removeEventListener("abort", r), s();
    }
  });
}
function Eo(t, e, s) {
  const n = t.findIndex(
    (r) => r.id === e.id
  );
  return s || n < 0 ? [
    e,
    ...t.filter((r) => r.id !== e.id)
  ] : t.map(
    (r) => r.id === e.id ? e : r
  );
}
function Jb(t, e) {
  const s = new Set(t.map((n) => n.id));
  return [
    ...t,
    ...e.filter((n) => !s.has(n.id))
  ];
}
function Qb(t, e) {
  const s = new Set(
    t.map((r) => r.recordID).filter((r) => !!r)
  );
  return [...e.filter(
    (r) => !r.recordID || !s.has(r.recordID)
  ), ...t];
}
function Ro(t, e) {
  const s = new Map(
    t.filter((o) => !!o.recordID).map((o) => [o.recordID, o])
  ), n = new Set(
    e.map((o) => o.recordID).filter((o) => !!o)
  );
  return [
    ...t.filter(
      (o) => !!o.recordID && !n.has(o.recordID)
    ),
    ...e.map((o) => ({
      ...o,
      autoOpenDocument: o.autoOpenDocument || s.get(o.recordID || 0)?.autoOpenDocument
    }))
  ];
}
function Qs(t) {
  return t.map((e, s) => ({
    id: e.id ? `saved-${e.id}` : `saved-${s}`,
    recordID: e.id || void 0,
    role: e.role,
    kind: e.kind,
    text: e.text,
    createdAt: e.createdAt,
    content: e.content,
    output: e.output,
    activities: Ho(e.output),
    requestID: e.requestID || void 0,
    running: e.status === 3,
    error: e.status === 2,
    document: e.document
  }));
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output"]);
const Rn = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!Rn || Object.keys(Rn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const Qe = Rn.runtimeErrorMessage, Ao = 20, ss = 20, Mo = 10, Xs = 48, Xb = [500, 1e3, 2e3, 4e3, 8e3, 8e3];
function Zb({
  agentKey: t,
  contextKey: e,
  modalOpen: s,
  blockMs: n,
  lazySession: r = !1,
  proactiveOpening: o = !1,
  assistantApi: i,
  runtimeApi: a,
  requestScope: c,
  prepareInput: l
}) {
  const u = e?.trim() || (t ? `agent-runtime:${t}` : ""), [h, d] = W([]), [f, p] = W(0), [v, _] = W("新会话"), [C, I] = W([]), [E, b] = W(!1), [y, T] = W(!1), [x, S] = W(!1), [j, P] = W(""), [H, J] = W([]), V = re(0), F = re(/* @__PURE__ */ new Map()), te = re(
    /* @__PURE__ */ new Map()
  ), ce = re(""), K = re(0), z = re(0), ee = re(0), L = re(!1), g = re(!1), A = re(!1), D = re(0), $ = re(null), U = re(null), Q = O(
    (R, N) => {
      V.current = R, p(R), _(N.title), I(N.messages), D.current = 0;
    },
    []
  ), ae = O(
    (R, N) => {
      F.current.set(R, N), V.current === R && (_(N.title), I(N.messages));
    },
    []
  ), ge = O(() => V.current, []), De = O((R) => F.current.get(R)?.title || "新会话", []), ve = O((R) => F.current.get(R)?.messages || [], []), xe = O(
    (R, N) => {
      const k = F.current.get(R);
      k && ae(R, {
        ...k,
        messages: N(k.messages)
      });
    },
    [ae]
  ), G = O(
    (R, N, k) => {
      xe(
        R,
        (q) => q.map(
          (Y) => Y.document?.id === N || k.messageID > 0 && Y.recordID === k.messageID ? {
            ...Y,
            document: Ss(Y.document, k) || k
          } : Y
        )
      );
    },
    [xe]
  ), X = O(
    (R, N) => {
      const k = F.current.get(R);
      k && ae(R, { ...k, title: N }), d(
        (q) => q.map(
          (Y) => Y.id === R ? { ...Y, title: N } : Y
        )
      );
    },
    [ae]
  ), se = O(
    async (R) => {
      const N = `${t}:${u}`;
      for (const k of Xb) {
        if (await Kb(k), ce.current !== N)
          return;
        try {
          const q = await Oc(i, {
            agentKey: t,
            contextKey: u,
            sessionID: R
          });
          if (!q)
            return;
          if (q.titleSource === "llm" || q.titleSource === "manual") {
            X(R, q.title);
            return;
          }
        } catch {
        }
      }
    },
    [t, i, u, X]
  ), ye = O(
    (R, N) => {
      d((k) => {
        const q = k.find(
          (Y) => Y.id === R
        );
        return q ? Eo(k, { ...q, running: N }, N) : k;
      });
    },
    []
  ), ks = O(
    (R) => Bc(
      {
        api: i,
        agentKey: t,
        contextKey: u,
        sessionID: V.current
      },
      R
    ),
    [t, i, u]
  ), Ps = O(
    (R) => {
      const N = V.current;
      if (!N || !t)
        return Promise.reject(new Error("当前会话不可用"));
      const k = `${N}:${R.refType}:${R.refId}`, q = te.current.get(k);
      if (q)
        return q;
      const Y = Fc(
        a.referencePreview,
        { agentKey: t, sessionID: N },
        R
      );
      return te.current.set(k, Y), Y.catch(() => {
        te.current.get(k) === Y && te.current.delete(k);
      }), Y;
    },
    [t, a.referencePreview]
  ), ne = Pb({
    agentKey: t,
    contextKey: u,
    modalOpen: s,
    sessionLoading: x,
    sessionID: f,
    messages: C,
    blockMs: n,
    runtimeApi: a,
    requestScope: c,
    getActiveSessionID: ge,
    getSessionTitle: De,
    getSessionMessages: ve,
    updateSessionMessages: xe,
    updateSessionTitle: X,
    syncSessionTitle: se,
    setSessionRunning: ye,
    setError: P
  });
  Lb({
    modalOpen: s,
    sessionID: f,
    messages: C,
    blockMs: n,
    runtimeApi: a,
    updateDocument: G
  });
  const Ht = O(
    async (R) => {
      if (!t || !u || V.current !== R)
        return;
      const N = await Et(i, {
        agentKey: t,
        contextKey: u,
        sessionID: R,
        limit: ss
      });
      if (V.current !== R)
        return;
      const k = ne.mergeMessages(
        R,
        Qs(N.messages)
      );
      xe(
        R,
        (q) => Ro(q, k)
      );
    },
    [
      t,
      i,
      u,
      ne.mergeMessages,
      xe
    ]
  );
  Hb({
    modalOpen: s,
    sessionID: f,
    messages: C,
    refreshSession: Ht
  });
  const be = O(
    (R, N = !1) => {
      const k = R.session?.id || 0;
      if (!k)
        return;
      const q = ne.mergeMessages(
        k,
        Qs(R.messages)
      ), Y = F.current.get(k), we = Y ? Ro(Y.messages, q) : q, Ie = {
        title: R.session?.title || "新会话",
        messages: we,
        oldestMessageID: Y?.oldestMessageID || R.messages[0]?.id || 0,
        canLoadOlder: Y?.canLoadOlder ?? R.messages.length > 0
      };
      if (F.current.set(k, Ie), Q(k, Ie), R.session) {
        const Ge = {
          ...R.session,
          running: ne.hasRun(k) || we.some((qe) => qe.running)
        };
        d(
          (qe) => Eo(qe, Ge, N)
        );
      }
    },
    [ne.hasRun, ne.mergeMessages, Q]
  ), pt = O(async () => {
    if (!t || !u)
      return;
    const R = ++K.current, N = ++z.current;
    g.current = !0, b(!0), T(!1), V.current || S(!0), P("");
    try {
      const k = await yr(i, {
        agentKey: t,
        contextKey: u,
        limit: Ao
      });
      if (K.current !== R || z.current !== N)
        return;
      d(
        k.sessions.map((Ie) => ({
          ...Ie,
          running: !!Ie.running || ne.hasRun(Ie.id)
        }))
      ), ee.current = k.sessions[k.sessions.length - 1]?.id || 0, L.current = k.hasMore, b(!1);
      const q = k.sessions[0], Y = q ? F.current.get(q.id) : void 0;
      if (q && Y && (Q(q.id, Y), S(!1)), !q && r && !o) {
        V.current = 0, p(0), _("新会话"), I([]);
        return;
      }
      const we = await Et(i, {
        agentKey: t,
        contextKey: u,
        sessionID: q?.id,
        create: !q && !o,
        title: "新会话",
        limit: ss
      });
      K.current === R && (be(we, !q), !q && o && we.session?.id && ne.startOpening(we.session.id));
    } catch (k) {
      K.current === R && z.current === N && P(Qe(k, "加载会话失败。"));
    } finally {
      K.current === R && z.current === N && (g.current = !1, b(!1), S(!1));
    }
  }, [
    t,
    be,
    i,
    u,
    r,
    o,
    ne.hasRun,
    ne.startOpening,
    Q
  ]), je = O(
    async (R, N = !1) => {
      if (!t || !u)
        return;
      const k = ++K.current;
      A.current = !1;
      const q = N ? void 0 : F.current.get(R);
      q ? (Q(R, q), S(!1)) : (N && (V.current = 0, p(0), _("新会话"), I([])), S(!0)), P("");
      try {
        const Y = await Et(i, {
          agentKey: t,
          contextKey: u,
          sessionID: R || void 0,
          create: N,
          title: "新会话",
          limit: N ? ss : Mo
        });
        K.current === k && (be(Y, N), N && o && Y.session?.id && ne.startOpening(Y.session.id));
      } catch (Y) {
        K.current === k && P(Qe(Y, "加载会话失败。"));
      } finally {
        K.current === k && S(!1);
      }
    },
    [
      t,
      be,
      i,
      u,
      o,
      ne.startOpening,
      Q
    ]
  ), Tt = O(() => {
    K.current += 1, A.current = !1, V.current = 0, p(0), _("新会话"), I([]), S(!1), P("");
  }, []), $s = O(
    async () => {
      if (r && !o) {
        Tt();
        return;
      }
      await je(0, !0);
    },
    [r, Tt, je, o]
  ), cc = O(
    async (R, N) => {
      try {
        const k = await Lc(
          i,
          R,
          N
        );
        X(R, k.title), P("");
      } catch (k) {
        const q = Qe(k, "编辑标题失败。");
        throw P(q), new Error(q);
      }
    },
    [i, X]
  ), lc = O(
    async (R) => {
      if (ne.hasRun(R))
        throw new Error("当前会话正在生成，暂时不能删除。");
      const N = h.findIndex(
        (q) => q.id === R
      ), k = h.filter(
        (q) => q.id !== R
      );
      try {
        if (await Vc(i, R), F.current.delete(R), d(k), P(""), V.current !== R)
          return;
        const q = Math.min(
          Math.max(0, N),
          Math.max(0, k.length - 1)
        ), Y = k[q];
        Y ? await je(Y.id, !1) : await $s();
      } catch (q) {
        const Y = Qe(q, "删除会话失败。");
        throw P(Y), new Error(Y);
      }
    },
    [i, je, ne.hasRun, h, $s]
  ), Ns = O(async () => {
    if (!t || !u || !L.current || g.current)
      return;
    const R = z.current, N = ee.current;
    g.current = !0, T(!0);
    try {
      const k = await yr(i, {
        agentKey: t,
        contextKey: u,
        limit: Ao,
        lastSessionID: ee.current
      });
      if (z.current !== R)
        return;
      if (k.sessions.length === 0) {
        L.current = !1;
        return;
      }
      const q = k.sessions[k.sessions.length - 1]?.id || 0;
      d(
        (Y) => Jb(
          Y,
          k.sessions.map((we) => ({
            ...we,
            running: !!we.running || ne.hasRun(we.id)
          }))
        )
      ), ee.current = q, L.current = k.hasMore && q > 0 && q !== N;
    } catch (k) {
      z.current === R && P(Qe(k, "加载更多会话失败。"));
    } finally {
      z.current === R && (g.current = !1, T(!1));
    }
  }, [t, i, u, ne.hasRun]), Ct = O(async () => {
    const R = V.current, N = F.current.get(R);
    if (!R || !N?.canLoadOlder || !N.oldestMessageID || !t || !u || A.current)
      return;
    const k = U.current, q = k?.scrollHeight || 0, Y = k?.scrollTop || 0, we = K.current;
    A.current = !0;
    try {
      const Ie = await Et(i, {
        agentKey: t,
        contextKey: u,
        sessionID: R,
        limit: Mo,
        lastMessageID: N.oldestMessageID
      });
      if (K.current !== we || V.current !== R)
        return;
      const Ge = F.current.get(R);
      if (!Ge)
        return;
      if (Ie.messages.length === 0) {
        ae(R, {
          ...Ge,
          canLoadOlder: !1
        });
        return;
      }
      ae(R, {
        ...Ge,
        messages: Qb(
          Ge.messages,
          Qs(Ie.messages)
        ),
        oldestMessageID: Ie.messages[0]?.id || Ge.oldestMessageID,
        canLoadOlder: !0
      }), window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const qe = U.current;
          !qe || V.current !== R || (qe.scrollTop = Y + qe.scrollHeight - q, D.current = qe.scrollTop);
        });
      });
    } catch (Ie) {
      K.current === we && V.current === R && P(Qe(Ie, "加载历史消息失败。"));
    } finally {
      K.current === we && V.current === R && (A.current = !1);
    }
  }, [t, i, u, ae]), uc = O((R) => {
    const N = R || $.current;
    N && N.scrollHeight - N.scrollTop - N.clientHeight <= Xs && Ns();
  }, [Ns]), dc = O(() => {
    const R = U.current;
    if (!R)
      return;
    const N = D.current, k = R.scrollTop;
    D.current = k, k < N && k <= Xs && Ct();
  }, [Ct]), hc = O(
    (R) => {
      R.deltaY < 0 && R.currentTarget.scrollTop <= Xs && Ct();
    },
    [Ct]
  );
  le(() => {
    if (!s || !t)
      return;
    const R = `${t}:${u}`;
    return ce.current !== R && (ce.current = R, ne.reset(), F.current.clear(), te.current.clear(), d([]), V.current = 0, p(0), _("新会话"), I([]), ee.current = 0, L.current = !1, D.current = 0), pt(), () => {
      K.current += 1, z.current += 1, g.current = !1, A.current = !1;
    };
  }, [t, u, pt, s, ne.reset]), le(() => {
    if (!s || !t) {
      J([]);
      return;
    }
    J([]);
    let R = !0;
    return jc(a.inputConfig, t).then((N) => {
      R && J(N);
    }).catch(() => {
      R && J([]);
    }), () => {
      R = !1;
    };
  }, [t, s, a.inputConfig]);
  const mc = O(
    async (R) => {
      const N = l ? await l(R) : R;
      if (!(!Uo(N) || !t)) {
        if (!V.current && r) {
          S(!0), P("");
          try {
            const k = await Et(i, {
              agentKey: t,
              contextKey: u,
              create: !0,
              title: "新会话",
              limit: ss
            });
            be(k, !0);
          } catch (k) {
            P(Qe(k, "创建会话失败。"));
            return;
          } finally {
            S(!1);
          }
        }
        await ne.send(N);
      }
    },
    [
      t,
      be,
      i,
      u,
      r,
      l,
      ne.send
    ]
  );
  return {
    sessionID: f,
    sessionTitle: v,
    sessions: h,
    messages: C,
    sessionsLoading: E,
    sessionsLoadingMore: y,
    sessionLoading: x,
    running: ne.running,
    stopping: ne.stopping,
    cancelable: ne.cancelable,
    sendDisabled: !t || !f && !r || x || ne.running,
    error: j,
    inputParams: H,
    sessionListRef: $,
    messageListRef: U,
    openSession: (R) => je(R, !1),
    startNewSession: $s,
    renameSession: cc,
    deleteSession: lc,
    loadMoreSessions: Ns,
    loadOlderMessages: Ct,
    handleSessionListScroll: uc,
    handleMessageListScroll: dc,
    handleMessageListWheel: hc,
    loadReferences: ks,
    loadReferencePreview: Ps,
    send: mc,
    stop: ne.stop
  };
}
function Kb(t) {
  return new Promise((e) => window.setTimeout(e, t));
}
const Nt = 10;
function e_({
  controller: t
}) {
  const e = ze(
    () => t.messages.filter(t_),
    [t.messages]
  ), s = JSON.stringify(
    e.map((f) => f.id)
  ), [n, r] = W(""), [o, i] = W(0), a = re(null);
  le(() => {
    const f = t.messageListRef.current, p = JSON.parse(s);
    if (!f || p.length === 0) {
      r("");
      return;
    }
    let v = 0;
    const _ = () => {
      v = 0;
      const I = s_(f, p);
      r(
        (E) => E === I ? E : I
      );
    }, C = () => {
      v || (v = window.requestAnimationFrame(_));
    };
    return f.addEventListener("scroll", C, { passive: !0 }), window.addEventListener("resize", C), C(), () => {
      f.removeEventListener("scroll", C), window.removeEventListener("resize", C), v && window.cancelAnimationFrame(v);
    };
  }, [t.messageListRef, s]), le(() => {
    const f = JSON.parse(s), p = f.indexOf(n);
    i((v) => p < 0 ? An(v, f.length) : r_(p, f.length));
  }, [n, s]), le(() => {
    a.current && n && o_(a.current, n);
  }, [n, s]);
  const c = O(
    (f) => {
      const p = t.messageListRef.current, v = p ? n_(p, f) : null;
      if (!p || !v)
        return;
      const _ = p.getBoundingClientRect(), C = v.getBoundingClientRect();
      r(f), p.scrollTo({
        top: Math.max(
          0,
          p.scrollTop + C.top - _.top - 24
        ),
        behavior: "smooth"
      });
    },
    [t.messageListRef]
  ), l = O(
    (f) => {
      i(
        (p) => An(
          p + f * Nt,
          e.length
        )
      );
    },
    [e.length]
  );
  if (e.length < 2)
    return null;
  const u = e.slice(
    o,
    o + Nt
  ), h = o > 0, d = o + Nt < e.length;
  return /* @__PURE__ */ B("nav", { className: "agent-chat-message-navigator", "aria-label": "用户消息快速跳转", children: [
    /* @__PURE__ */ m("style", { children: i_ }),
    /* @__PURE__ */ B("div", { className: "agent-chat-message-navigator-controls", children: [
      /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: "agent-chat-message-navigator-page",
          title: "显示上一组消息",
          "aria-label": "显示上一组用户消息",
          disabled: !h,
          onClick: () => l(-1),
          children: /* @__PURE__ */ m(xc, {})
        }
      ),
      /* @__PURE__ */ m("div", { className: "agent-chat-message-navigator-rail", children: u.map((f, p) => /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: "agent-chat-message-navigator-mark",
          "data-active": f.id === n ? "true" : void 0,
          title: `跳转到：${Do(f.text)}`,
          "aria-label": `跳转到第 ${o + p + 1} 条用户消息`,
          "aria-current": f.id === n ? "location" : void 0,
          onClick: () => c(f.id)
        },
        f.id
      )) }),
      /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: "agent-chat-message-navigator-page",
          title: "显示下一组消息",
          "aria-label": "显示下一组用户消息",
          disabled: !d,
          onClick: () => l(1),
          children: /* @__PURE__ */ m(Vo, {})
        }
      )
    ] }),
    /* @__PURE__ */ m("div", { ref: a, className: "agent-chat-message-navigator-panel", children: u.map((f) => /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: "agent-chat-message-navigator-item",
        "data-navigator-message-id": f.id,
        "data-active": f.id === n ? "true" : void 0,
        onClick: () => c(f.id),
        children: Do(f.text)
      },
      f.id
    )) })
  ] });
}
function t_(t) {
  return t.role === "user";
}
function s_(t, e) {
  const s = t.getBoundingClientRect(), n = s.top + Math.min(s.height * 0.28, 220), r = rc(t);
  let o = e[0] || "";
  for (const i of e) {
    const a = r.get(i);
    if (a) {
      if (a.getBoundingClientRect().top > n)
        break;
      o = i;
    }
  }
  return o;
}
function n_(t, e) {
  return rc(t).get(e);
}
function rc(t) {
  return new Map(
    Array.from(
      t.querySelectorAll("[data-message-id]")
    ).map((e) => [e.dataset.messageId || "", e])
  );
}
function Do(t) {
  const e = String(t || "").replace(/\s+/g, " ").trim();
  if (!e)
    return "空消息";
  const s = Array.from(e);
  return s.length > 46 ? `${s.slice(0, 46).join("")}...` : e;
}
function r_(t, e) {
  return An(
    t - Math.floor(Nt / 2),
    e
  );
}
function An(t, e) {
  return Math.min(
    Math.max(0, e - Nt),
    Math.max(0, t)
  );
}
function o_(t, e) {
  const s = Array.from(
    t.querySelectorAll("[data-navigator-message-id]")
  ).find((a) => a.dataset.navigatorMessageId === e);
  if (!s)
    return;
  const n = s.offsetTop, r = n + s.offsetHeight, o = t.scrollTop + 8, i = t.scrollTop + t.clientHeight - 8;
  n < o ? t.scrollTop = Math.max(0, n - 8) : r > i && (t.scrollTop = r - t.clientHeight + 8);
}
const i_ = `
.agent-chat-message-navigator {
  position: absolute;
  top: 45%;
  right: 16px;
  z-index: 9;
  width: 26px;
  transform: translateY(-50%);
}

.agent-chat-message-navigator-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.agent-chat-message-navigator-page {
  display: flex;
  width: 26px;
  height: 22px;
  flex: 0 0 22px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 9999px;
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: color 140ms ease, background 140ms ease;
}

.agent-chat-message-navigator-page:hover,
.agent-chat-message-navigator-page:focus-visible {
  outline: none;
  background: var(--muted);
  color: var(--foreground);
}

.agent-chat-message-navigator-page:disabled {
  visibility: hidden;
  pointer-events: none;
}

.agent-chat-message-navigator-page svg {
  width: 15px;
  height: 15px;
}

.agent-chat-message-navigator-rail {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 7px;
  padding: 5px 2px;
}

.agent-chat-message-navigator-mark {
  display: block;
  width: 22px;
  height: 2px;
  flex: 0 0 2px;
  border: 0;
  border-radius: 9999px;
  background: color-mix(in oklab, var(--muted-foreground) 52%, transparent);
  cursor: pointer;
  transition: width 140ms ease, height 140ms ease, background 140ms ease;
}

.agent-chat-message-navigator-mark:hover,
.agent-chat-message-navigator-mark:focus-visible {
  width: 24px;
  height: 3px;
  flex-basis: 3px;
  outline: none;
  background: var(--foreground);
}

.agent-chat-message-navigator-mark[data-active="true"] {
  height: 3px;
  flex-basis: 3px;
  background: var(--foreground);
}

.agent-chat-message-navigator-panel {
  position: absolute;
  top: 50%;
  right: 26px;
  box-sizing: border-box;
  display: flex;
  width: min(360px, calc(100vw - 96px));
  max-height: 54vh;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  visibility: hidden;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--background);
  box-shadow:
    0 18px 48px rgba(15, 23, 42, 0.14),
    0 4px 14px rgba(15, 23, 42, 0.08);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%) translateX(8px) scale(0.98);
  transform-origin: right center;
  transition:
    opacity 140ms ease,
    transform 140ms ease,
    visibility 140ms ease;
  scrollbar-color: color-mix(in oklab, var(--muted-foreground) 42%, transparent) transparent;
  scrollbar-width: thin;
}

.agent-chat-message-navigator-panel::-webkit-scrollbar {
  width: 6px;
}

.agent-chat-message-navigator-panel::-webkit-scrollbar-thumb {
  border-radius: 9999px;
  background: color-mix(in oklab, var(--muted-foreground) 42%, transparent);
}

.agent-chat-message-navigator:hover .agent-chat-message-navigator-panel,
.agent-chat-message-navigator:focus-within .agent-chat-message-navigator-panel {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
  transform: translateY(-50%) translateX(0) scale(1);
}

.agent-chat-message-navigator-item {
  display: block;
  width: 100%;
  overflow: hidden;
  border: 0;
  border-radius: 12px;
  background: transparent;
  padding: 9px 12px;
  color: var(--foreground);
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.agent-chat-message-navigator-item:hover,
.agent-chat-message-navigator-item:focus-visible,
.agent-chat-message-navigator-item[data-active="true"] {
  outline: none;
  background: var(--muted);
}

@media (max-width: 767px) {
  .agent-chat-message-navigator {
    display: none;
  }
}
`;
await window.DeverFront?.ensureCompat?.(["@/lib/utils", "@/components/reference-composer"]);
const Mn = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!Mn || Object.keys(Mn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const br = Mn.cn, Dn = window.DeverFront?.sdk?.getCompatModule("@/components/reference-composer");
if (!Dn || Object.keys(Dn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/reference-composer");
const oc = Dn, a_ = oc.ReferenceComposer, c_ = oc.ReferenceContentView, ko = "agent-chat-column", l_ = {
  "@": "hidden",
  "#": "hidden"
};
function u_({
  controller: t,
  clipboardImageUploadRuleId: e,
  uploadBizKey: s,
  uploadBizName: n,
  allowResourceLibrary: r,
  composerDisabled: o,
  composerToolbar: i,
  composerParameters: a,
  composerParameterScopeKey: c,
  renderFileLibrary: l,
  onUploadedFiles: u,
  renderMessageActions: h,
  renderArtifactActions: d,
  onOpenDocument: f,
  referenceProviders: p = []
}) {
  const v = [
    ...p,
    {
      trigger: "#",
      referenceTypes: ["message", "artifact", "upload_file", "session"],
      loadReferences: t.loadReferences,
      loadPreview: t.loadReferencePreview,
      availableScopes: ["current", "history"],
      searchPlaceholder: "搜索消息或会话"
    }
  ], _ = p_(
    v,
    t.loadReferencePreview
  );
  return /* @__PURE__ */ B(Rt.Root, { className: "agent-chat-thread relative flex min-h-0 flex-1 flex-col bg-background", children: [
    /* @__PURE__ */ m("style", { children: __ }),
    /* @__PURE__ */ B(Rt.ViewportProvider, { children: [
      /* @__PURE__ */ m(
        Rt.Viewport,
        {
          ref: t.messageListRef,
          autoScroll: !0,
          turnAnchor: "bottom",
          scrollToBottomOnInitialize: !0,
          scrollToBottomOnRunStart: !0,
          className: "relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto",
          style: { scrollbarGutter: "stable" },
          onScroll: t.handleMessageListScroll,
          onWheel: t.handleMessageListWheel,
          children: /* @__PURE__ */ m(
            "div",
            {
              className: br(
                ko,
                "agent-chat-message-column flex min-h-full flex-col"
              ),
              children: t.sessionLoading && t.messages.length === 0 ? /* @__PURE__ */ m("div", { className: "agent-chat-empty-state text-muted-foreground", children: /* @__PURE__ */ m(Dt, { className: "size-5 animate-spin" }) }) : t.messages.length === 0 ? /* @__PURE__ */ B("div", { className: "agent-chat-empty-state", children: [
                /* @__PURE__ */ m("span", { className: "flex size-10 items-center justify-center rounded-md border bg-muted/30 text-muted-foreground", children: /* @__PURE__ */ m(Ic, { className: "size-5" }) }),
                /* @__PURE__ */ m("span", { className: "text-sm text-muted-foreground", children: "开始一段新对话" })
              ] }) : /* @__PURE__ */ m("div", { className: "agent-chat-message-stack flex flex-col", children: /* @__PURE__ */ m(Rt.Messages, { children: () => /* @__PURE__ */ m(
                d_,
                {
                  controller: t,
                  loadPreview: _,
                  renderMessageActions: h,
                  renderArtifactActions: d,
                  onOpenDocument: f
                }
              ) }) })
            }
          )
        }
      ),
      /* @__PURE__ */ m(e_, { controller: t }),
      /* @__PURE__ */ B(
        "footer",
        {
          className: "agent-chat-footer shrink-0",
          style: {
            paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))"
          },
          children: [
            /* @__PURE__ */ m(
              Rt.ScrollToBottom,
              {
                behavior: "smooth",
                className: "agent-chat-scroll-to-bottom",
                title: "回到底部",
                "aria-label": "回到底部",
                children: /* @__PURE__ */ m(Tc, {})
              }
            ),
            /* @__PURE__ */ B("div", { className: ko, children: [
              t.error ? /* @__PURE__ */ m("div", { className: "mb-2 text-sm text-destructive", children: t.error }) : null,
              /* @__PURE__ */ m(
                f_,
                {
                  controller: t,
                  referenceProviders: v,
                  clipboardImageUploadRuleId: e,
                  uploadBizKey: s,
                  uploadBizName: n,
                  allowResourceLibrary: r,
                  disabled: o,
                  toolbar: i,
                  parameters: a,
                  parameterScopeKey: c,
                  renderFileLibrary: l,
                  onUploadedFiles: u
                }
              )
            ] })
          ]
        }
      )
    ] })
  ] });
}
function d_({
  controller: t,
  loadPreview: e,
  renderMessageActions: s,
  renderArtifactActions: n,
  onOpenDocument: r
}) {
  return M((i) => i.message.role) === "user" ? /* @__PURE__ */ m(
    h_,
    {
      controller: t,
      loadPreview: e,
      renderMessageActions: s
    }
  ) : /* @__PURE__ */ m(
    m_,
    {
      controller: t,
      loadPreview: e,
      renderMessageActions: s,
      renderArtifactActions: n,
      onOpenDocument: r
    }
  );
}
function h_({
  controller: t,
  loadPreview: e,
  renderMessageActions: s
}) {
  const n = M(
    (o) => o.message.metadata.custom?.content
  ), r = M(
    (o) => o.message.metadata.custom?.sourceText
  );
  return /* @__PURE__ */ B(gn.Root, { className: "agent-chat-message agent-chat-user-message relative flex flex-col items-end pl-6 md:pl-20", children: [
    /* @__PURE__ */ m("div", { className: "agent-chat-user-bubble max-w-[88%] whitespace-pre-wrap break-words rounded-lg bg-muted px-3.5 py-2.5 text-base leading-7 text-foreground [overflow-wrap:anywhere] md:max-w-full", children: /* @__PURE__ */ m(
      c_,
      {
        content: n,
        fallback: typeof r == "string" ? r : "",
        loadPreview: e
      }
    ) }),
    /* @__PURE__ */ m(
      ic,
      {
        role: "user",
        sessionTitle: t.sessionTitle,
        renderMessageActions: s
      }
    )
  ] });
}
function m_({
  controller: t,
  loadPreview: e,
  renderMessageActions: s,
  renderArtifactActions: n,
  onOpenDocument: r
}) {
  const o = M((b) => b.message.status), i = M((b) => b.message.metadata.custom?.output), a = M(
    (b) => b.message.metadata.custom?.activities
  ), c = M(
    (b) => b.message.metadata.custom?.sourceText
  ), l = M(
    (b) => b.message.metadata.custom?.document
  ), u = fl(l), h = Number(
    M((b) => b.message.metadata.custom?.recordID) || 0
  ), d = Array.isArray(a) ? a : [], f = pl(i), p = f?.id ? gl(t.messages, f.id) : void 0, v = bl(i), _ = _l(i), C = o?.type === "incomplete" && o.reason === "error", I = !!(l && o?.type === "running" && !ds(l) && !_), E = b_(
    o?.type === "running",
    d,
    c
  );
  return /* @__PURE__ */ m(
    gn.Root,
    {
      className: br(
        "agent-chat-message relative min-w-0 [contain-intrinsic-size:auto_180px] [content-visibility:auto]",
        C && "text-destructive"
      ),
      children: /* @__PURE__ */ B(
        qc,
        {
          messageID: h,
          render: n,
          children: [
            l ? /* @__PURE__ */ B($e, { children: [
              u ? /* @__PURE__ */ m(Os, { text: u, error: C }) : null,
              /* @__PURE__ */ m(
                Uc,
                {
                  document: l,
                  onOpen: r
                }
              ),
              I ? /* @__PURE__ */ m(Po, {}) : null,
              _ ? /* @__PURE__ */ m(
                Os,
                {
                  text: _,
                  error: C,
                  className: "mt-4"
                }
              ) : null
            ] }) : /* @__PURE__ */ B($e, { children: [
              /* @__PURE__ */ m(gn.Parts, { children: ({ part: b }) => {
                if (b.type === "text") {
                  const y = b.status.type === "running";
                  return y && !b.text && d.length === 0 ? /* @__PURE__ */ m(g_, {}) : b.text ? /* @__PURE__ */ m(
                    Os,
                    {
                      text: b.text,
                      streaming: y,
                      error: C
                    }
                  ) : null;
                }
                if (b.type === "tool-call") {
                  const y = d.find(
                    (T) => T.id === b.toolCallId
                  );
                  return /* @__PURE__ */ m(zc, { activity: y });
                }
                return null;
              } }),
              E ? /* @__PURE__ */ m(Po, {}) : null,
              /* @__PURE__ */ m(
                Hc,
                {
                  output: i,
                  excludeOutputs: d.map(
                    (b) => b.output
                  ),
                  excludeText: typeof c == "string" ? c : ""
                }
              )
            ] }),
            f ? /* @__PURE__ */ m(
              Gc,
              {
                interaction: f,
                response: p,
                disabled: t.sendDisabled,
                onSubmit: (b) => {
                  t.send(
                    Wc(
                      f.id || "",
                      b.text,
                      b.data
                    )
                  );
                }
              }
            ) : null,
            /* @__PURE__ */ m(
              Yc,
              {
                suggestions: v,
                disabled: t.sendDisabled,
                onSelect: (b) => {
                  t.send(qo(b.prompt));
                }
              }
            ),
            /* @__PURE__ */ m(
              ic,
              {
                role: "assistant",
                sessionTitle: t.sessionTitle,
                renderMessageActions: s
              }
            )
          ]
        }
      )
    }
  );
}
function ic({
  role: t,
  sessionTitle: e,
  renderMessageActions: s
}) {
  const n = M((y) => y.message.status), r = Number(
    M((y) => y.message.metadata.custom?.recordID) || 0
  ), o = String(
    M((y) => y.message.metadata.custom?.requestID) || ""
  ), i = String(
    M((y) => y.message.metadata.custom?.createdAt) || ""
  ), a = M(
    (y) => y.message.metadata.custom?.sourceText
  ), c = M(
    (y) => y.message.metadata.custom?.document
  ), l = M((y) => y.message.metadata.custom?.output), u = M(
    (y) => y.message.parts.filter((T) => T.type === "text").map((T) => T.text).join(`
`)
  ), h = c?.hydrated ? vl(c) : typeof a == "string" && a.trim() ? a : u, [d, f] = W(!1), [p, v] = W(!1), _ = re(null);
  le(
    () => () => {
      _.current != null && window.clearTimeout(_.current);
    },
    []
  );
  const C = () => {
    _.current != null && window.clearTimeout(_.current), _.current = window.setTimeout(() => {
      f(!1), v(!1), _.current = null;
    }, 1800);
  }, I = async () => {
    if (h.trim()) {
      v(!1);
      try {
        await nl(h), f(!0);
      } catch {
        f(!1), v(!0);
      }
      C();
    }
  }, E = !h.trim() || t === "assistant" && n?.type === "running", b = Wo(l).some(
    (y) => y.status === "generating"
  ) || !!(c && ds(c));
  return /* @__PURE__ */ B(
    rg.Root,
    {
      className: br(
        "agent-chat-message-actions",
        t === "user" && "justify-end"
      ),
      "data-message-role": t,
      children: [
        /* @__PURE__ */ m(
          zo,
          {
            label: p ? "复制失败，请手动选择消息文本" : d ? "已复制" : "复制",
            children: /* @__PURE__ */ B(
              "button",
              {
                type: "button",
                className: "agent-chat-message-action agent-chat-copy-action",
                "aria-label": d ? "消息已复制" : "复制消息",
                "data-copied": d ? "true" : void 0,
                "data-copy-failed": p ? "true" : void 0,
                disabled: E,
                onClick: () => {
                  I();
                },
                children: [
                  /* @__PURE__ */ m(Cc, { className: "agent-chat-copy-icon", "aria-hidden": "true" }),
                  /* @__PURE__ */ m(jo, { className: "agent-chat-copied-icon", "aria-hidden": "true" })
                ]
              }
            )
          }
        ),
        s?.({
          role: t,
          recordID: r,
          requestID: o,
          sessionTitle: e,
          createdAt: i,
          running: n?.type === "running",
          error: n?.type === "incomplete",
          hasPendingArtifacts: b,
          document: c
        })
      ]
    }
  );
}
function f_({
  controller: t,
  clipboardImageUploadRuleId: e,
  uploadBizKey: s,
  uploadBizName: n,
  allowResourceLibrary: r,
  disabled: o,
  toolbar: i,
  parameters: a,
  parameterScopeKey: c,
  renderFileLibrary: l,
  onUploadedFiles: u,
  referenceProviders: h
}) {
  return /* @__PURE__ */ m(
    a_,
    {
      placeholder: "请输入消息，输入 @ 引用资产，输入 # 引用会话信息",
      disabled: o || t.sendDisabled && !t.running,
      running: t.running,
      stopping: t.stopping,
      cancelable: t.cancelable,
      layerZIndex: is,
      clipboardImageUploadRuleId: e,
      uploadBizKey: s,
      uploadBizName: n,
      allowResourceLibrary: r,
      renderFileLibrary: l,
      fileLibraryIncludesUpload: !0,
      referenceActionPlacements: l_,
      toolbar: i,
      parameterScopeKey: c,
      onUploadedFiles: u,
      parameters: a ?? t.inputParams,
      providers: h,
      showMediaAliases: !0,
      allowMultiMediaSelection: !0,
      loadReferences: t.loadReferences,
      loadPreview: t.loadReferencePreview,
      onSubmit: t.send,
      onCancel: t.stop
    }
  );
}
function p_(t, e) {
  return (s) => {
    const n = t.find(
      (r) => r.referenceTypes.includes(s.refType)
    );
    return n?.loadPreview ? n.loadPreview(s) : e(s);
  };
}
function g_() {
  return /* @__PURE__ */ m(
    "div",
    {
      role: "status",
      "aria-label": "智能体正在生成",
      className: "agent-chat-waiting-indicator",
      children: [0, 1, 2].map((t) => /* @__PURE__ */ m(
        "span",
        {
          className: "agent-chat-waiting-dot",
          style: { animationDelay: `${t * 140}ms` }
        },
        t
      ))
    }
  );
}
function Po() {
  return /* @__PURE__ */ m(
    "div",
    {
      role: "status",
      "aria-label": "智能体正在执行下一步",
      className: "agent-chat-next-step-indicator",
      children: /* @__PURE__ */ m("span", { className: "agent-chat-pulse-dot" })
    }
  );
}
function b_(t, e, s) {
  if (!t)
    return !1;
  const n = e.at(-1);
  return !n || n.kind !== "knowledge" && n.kind !== "skill" || n.status === "running" ? !1 : String(s || "").trimEnd() === n.anchorText.trimEnd();
}
const __ = `
.agent-chat-column {
  box-sizing: border-box;
  width: 100%;
  max-width: 1040px;
  margin-inline: auto;
  padding-inline: 24px;
}

.agent-chat-message-column {
  padding-top: 24px;
}

.agent-chat-empty-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
  pointer-events: none;
}

.agent-chat-message-stack {
  gap: 28px;
  padding-bottom: 88px;
}

.agent-chat-document {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.agent-chat-document .agent-chat-message-output,
.agent-chat-document .agent-chat-media-grid {
  margin-top: 0;
}

.agent-chat-interaction[data-presentation="stepper"] {
  width: min(52%, 560px);
  min-width: min(100%, 480px);
}

.agent-chat-media-grid {
  box-sizing: border-box;
  display: grid;
  width: 100%;
  max-width: 968px;
  gap: 8px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.agent-chat-media-grid[data-kind="audio"],
.agent-chat-media-grid[data-kind="file"] {
  max-width: 560px;
  grid-template-columns: minmax(0, 1fr);
}

.agent-chat-media-placeholder {
  isolation: isolate;
  background-color: color-mix(in oklab, var(--muted) 34%, transparent);
  animation: agent-chat-media-surface 1.65s ease-in-out infinite;
}

.agent-chat-media-placeholder::before {
  position: absolute;
  inset: 0;
  z-index: 1;
  content: '';
  background: linear-gradient(
    105deg,
    transparent 20%,
    color-mix(in oklab, var(--foreground) 3.5%, transparent) 40%,
    color-mix(in oklab, var(--background) 90%, transparent) 50%,
    color-mix(in oklab, var(--foreground) 3.5%, transparent) 60%,
    transparent 80%
  );
  transform: translateX(-110%);
  animation: agent-chat-media-shimmer 1.65s ease-in-out infinite;
  pointer-events: none;
}

.agent-chat-media-placeholder-icon {
  z-index: 2;
  animation: agent-chat-media-icon 1.65s ease-in-out infinite;
}

.agent-chat-media-spinner {
  animation: agent-chat-media-spinner 0.95s linear infinite;
}

.agent-chat-media-result[data-kind="image"] .agent-chat-activity-output .grid {
  box-sizing: border-box;
  width: 100% !important;
  max-width: 968px !important;
  gap: 8px !important;
  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
}

.agent-chat-media-result[data-kind="image"] .agent-chat-activity-output .grid > div {
  min-width: 0;
  overflow: visible !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  padding: 0 !important;
}

.agent-chat-media-result[data-kind="image"] .agent-chat-activity-output .grid > div > button {
  width: 100% !important;
  aspect-ratio: var(--agent-chat-media-aspect-ratio, 4 / 3) !important;
  border-radius: 8px !important;
  background: transparent !important;
}

.agent-chat-media-result[data-kind="image"] .agent-chat-activity-output .grid > div > button > img {
  width: 100% !important;
  height: 100% !important;
  border-radius: 8px !important;
  object-fit: cover !important;
}

.agent-chat-user-message {
  scroll-margin-top: 24px;
}

.agent-chat-message-actions {
  display: flex;
  width: 100%;
  min-height: 28px;
  margin-top: 4px;
  align-items: center;
  gap: 2px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 120ms ease;
}

.agent-chat-message:hover .agent-chat-message-actions,
.agent-chat-message:focus-within .agent-chat-message-actions,
.agent-chat-message-actions:hover {
  opacity: 1;
  pointer-events: auto;
}

.agent-chat-message-action {
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  transition:
    color 120ms ease,
    background-color 120ms ease;
}

.agent-chat-message-action:hover:not(:disabled),
.agent-chat-message-action:focus-visible {
  background: var(--muted);
  color: var(--foreground);
  outline: none;
}

.agent-chat-message-action:disabled {
  opacity: 0.38;
  cursor: default;
}

.agent-chat-message-action svg {
  width: 16px;
  height: 16px;
  stroke-width: 1.8;
}

.agent-chat-copied-icon,
.agent-chat-copy-action[data-copied="true"] .agent-chat-copy-icon {
  display: none;
}

.agent-chat-copy-action[data-copied="true"] .agent-chat-copied-icon {
  display: block;
}

.agent-chat-copy-action[data-copy-failed="true"] {
  color: var(--destructive);
}

.agent-chat-footer {
  position: relative;
  z-index: 5;
  padding-top: 12px;
  background: linear-gradient(to bottom, transparent, var(--background) 24px);
}

.agent-chat-scroll-to-bottom {
  position: absolute;
  top: -50px;
  left: 50%;
  z-index: 6;
  display: flex !important;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: 9999px;
  background: var(--background);
  color: var(--foreground);
  opacity: 1;
  box-shadow:
    0 8px 22px rgba(15, 23, 42, 0.12),
    0 2px 7px rgba(15, 23, 42, 0.08);
  cursor: pointer;
  transform: translateX(-50%);
  transition:
    opacity 140ms ease,
    transform 140ms ease,
    box-shadow 140ms ease;
}

.agent-chat-scroll-to-bottom:hover:not(:disabled) {
  box-shadow:
    0 10px 26px rgba(15, 23, 42, 0.16),
    0 3px 9px rgba(15, 23, 42, 0.1);
  transform: translateX(-50%) translateY(-1px);
}

.agent-chat-scroll-to-bottom:disabled {
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%) translateY(8px);
}

.agent-chat-scroll-to-bottom svg {
  width: 20px;
  height: 20px;
}

@keyframes agent-chat-waiting-dot {
  0%, 60%, 100% { opacity: 0.22; transform: translateY(0); }
  30% { opacity: 0.82; transform: translateY(-2px); }
}

@keyframes agent-chat-media-shimmer {
  0% { transform: translateX(-110%); }
  58%, 100% { transform: translateX(110%); }
}

@keyframes agent-chat-media-surface {
  0%, 100% {
    border-color: color-mix(in oklab, var(--border) 82%, transparent);
    background-color: color-mix(in oklab, var(--muted) 30%, transparent);
  }
  50% {
    border-color: color-mix(in oklab, var(--foreground) 14%, transparent);
    background-color: color-mix(in oklab, var(--muted) 50%, transparent);
  }
}

@keyframes agent-chat-media-icon {
  0%, 100% { opacity: 0.28; transform: scale(0.96); }
  50% { opacity: 0.58; transform: scale(1); }
}

@keyframes agent-chat-media-spinner {
  to { transform: rotate(360deg); }
}

@keyframes agent-chat-streaming-tail {
  0%, 100% { opacity: 0.24; transform: scale(0.78); }
  50% { opacity: 0.9; transform: scale(1); }
}

.agent-chat-waiting-indicator {
  display: flex;
  height: 18px;
  align-items: center;
  gap: 4px;
  color: var(--foreground);
}

.agent-chat-waiting-dot {
  display: block;
  width: 4px;
  height: 4px;
  flex: 0 0 4px;
  border-radius: 9999px;
  background-color: currentColor;
  animation: agent-chat-waiting-dot 1.05s ease-in-out infinite;
}

.agent-chat-next-step-indicator {
  display: flex;
  height: 18px;
  margin-top: 4px;
  align-items: center;
  color: var(--foreground);
}

.agent-chat-pulse-dot {
  display: block;
  width: 6px;
  height: 6px;
  flex: 0 0 6px;
  border-radius: 9999px;
  background-color: currentColor;
  animation: agent-chat-streaming-tail 0.9s ease-in-out infinite;
}

.agent-chat-markdown[data-status="running"] > :last-child:not(ul):not(ol)::after,
.agent-chat-markdown[data-status="running"] > :last-child:is(ul, ol) > li:last-child::after {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-left: 6px;
  border-radius: 9999px;
  vertical-align: 0.08em;
  pointer-events: none;
  background: currentColor;
  animation: agent-chat-streaming-tail 0.9s ease-in-out infinite;
}

[data-agent-chat-layer="true"][data-media-inspector-open="true"] .agent-chat-column {
  padding-inline: 20px;
}

[data-agent-chat-layer="true"][data-media-inspector-open="true"] .agent-chat-media-grid,
[data-agent-chat-layer="true"][data-media-inspector-open="true"]
  .agent-chat-media-result[data-kind="image"]
  .agent-chat-activity-output
  .grid {
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
}

[data-agent-chat-layer="true"][data-media-inspector-open="true"] .agent-chat-message-navigator {
  display: none;
}

@media (max-width: 767px) {
  .agent-chat-column {
    padding-inline: 14px;
  }

  .agent-chat-message-column {
    padding-top: 16px;
  }

  .agent-chat-message-stack {
    gap: 20px;
    padding-bottom: 56px;
  }

  .agent-chat-interaction[data-presentation="stepper"] {
    width: 100%;
    min-width: 0;
  }

  .agent-chat-media-grid {
    max-width: none;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .agent-chat-media-result[data-kind="image"] .agent-chat-activity-output .grid {
    max-width: none !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }

  .agent-chat-footer {
    padding-top: 8px;
  }

  .agent-chat-scroll-to-bottom {
    top: -44px;
    width: 36px;
    height: 36px;
  }

  .agent-chat-scroll-to-bottom svg {
    width: 18px;
    height: 18px;
  }

}

@media (hover: none) {
  .agent-chat-message-actions {
    opacity: 1;
    pointer-events: auto;
  }
}

`;
await window.DeverFront?.ensureCompat?.(["@/components/ui/dropdown-menu", "@/components/ui/select", "@/lib/floating-layer"]);
const ot = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dropdown-menu");
if (!ot || Object.keys(ot).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const v_ = ot.DropdownMenu, y_ = ot.DropdownMenuContent, w_ = ot.DropdownMenuItem, S_ = ot.DropdownMenuSeparator, x_ = ot.DropdownMenuTrigger, it = window.DeverFront?.sdk?.getCompatModule("@/components/ui/select");
if (!it || Object.keys(it).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/select");
const I_ = it.Select, T_ = it.SelectContent, C_ = it.SelectItem, E_ = it.SelectTrigger, R_ = it.SelectValue, kn = window.DeverFront?.sdk?.getCompatModule("@/lib/floating-layer");
if (!kn || Object.keys(kn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/floating-layer");
const ac = kn.findFloatingLayerContainer;
function A_({
  value: t,
  powers: e,
  categories: s,
  onValueChange: n
}) {
  const r = re(null), [o, i] = W(
    null
  ), [a, c] = W(!1), l = e.find(
    (h) => typeof t == "number" && h.id === t
  ), u = t === "auto" ? "自动选择" : l?.name || "选择";
  return /* @__PURE__ */ B(
    v_,
    {
      modal: !1,
      open: a,
      onOpenChange: (h) => {
        h && i(ac(r.current)), c(h);
      },
      children: [
        /* @__PURE__ */ m(x_, { asChild: !0, children: /* @__PURE__ */ B(
          "button",
          {
            ref: r,
            type: "button",
            className: "agent-chat-execution-trigger",
            "aria-label": "选择工具",
            children: [
              /* @__PURE__ */ B("span", { className: "agent-chat-execution-trigger-content", children: [
                t === "auto" ? /* @__PURE__ */ m(vr, { "aria-hidden": "true" }) : l ? /* @__PURE__ */ m(yl, { power: l, size: 15 }) : null,
                /* @__PURE__ */ m("span", { children: u })
              ] }),
              /* @__PURE__ */ m(Vo, { className: "agent-chat-execution-chevron" })
            ]
          }
        ) }),
        /* @__PURE__ */ B(
          y_,
          {
            align: "start",
            container: o,
            className: "agent-chat-execution-menu",
            children: [
              /* @__PURE__ */ B(
                w_,
                {
                  className: `agent-chat-execution-menu-item agent-chat-execution-power-item${t === "auto" ? " is-selected" : ""}`,
                  onSelect: () => n("auto"),
                  children: [
                    /* @__PURE__ */ m(vr, { "aria-hidden": "true" }),
                    /* @__PURE__ */ m("span", { className: "min-w-0 flex-1 truncate", children: "自动选择" }),
                    t === "auto" ? /* @__PURE__ */ m(jo, { "aria-hidden": "true" }) : null
                  ]
                }
              ),
              e.length > 0 ? /* @__PURE__ */ m(S_, {}) : null,
              /* @__PURE__ */ m(
                wl,
                {
                  open: a,
                  value: typeof t == "number" ? t : null,
                  powers: e,
                  categories: s,
                  appearance: "agent",
                  portalContainer: o,
                  onValueChange: n
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function $o({
  value: t,
  options: e,
  ariaLabel: s,
  onValueChange: n
}) {
  const r = re(null), [o, i] = W(
    null
  );
  return /* @__PURE__ */ B(
    I_,
    {
      value: String(t),
      onValueChange: (a) => n(Number(a)),
      onOpenChange: (a) => {
        a && i(ac(r.current));
      },
      children: [
        /* @__PURE__ */ m(
          E_,
          {
            ref: r,
            "aria-label": s,
            className: "agent-chat-execution-trigger agent-chat-execution-source-trigger",
            children: /* @__PURE__ */ m(R_, {})
          }
        ),
        /* @__PURE__ */ m(
          T_,
          {
            align: "start",
            container: o,
            className: "agent-chat-execution-menu",
            children: e.map((a) => /* @__PURE__ */ m(
              C_,
              {
                className: "agent-chat-execution-menu-item",
                value: String(a.id),
                children: a.name
              },
              a.id
            ))
          }
        )
      ]
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/agent/stream-request-params"]);
const Pn = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!Pn || Object.keys(Pn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const M_ = Pn.isPromptParam;
function D_({
  enabled: t,
  scopeKey: e,
  toolIDField: s,
  loadConfig: n,
  loadToolForm: r,
  renderFileLibrary: o
}) {
  const [i, a] = W(null), [c, l] = W(""), [u, h] = W(0), [d, f] = W(t), [p, v] = W(""), [_, C] = W(0), [I, E] = W("auto"), [b, y] = W(0), [T, x] = W(null), [S, j] = W(!1), [P, H] = W(""), [J, V] = W(0), [F, te] = W({
    scopeKey: "",
    sessionID: 0,
    messageIdentity: ""
  }), ce = re(""), K = re(null), z = re(null), ee = c === e ? i : null, L = !!ee?.toolsEnabled, g = L && typeof I == "number" && T?.toolID === I ? T.config : null, A = No(
    ee?.modelSourceRule,
    _
  ), D = L && typeof I == "number" && No(g?.sourceRule, b);
  le(() => {
    let G = !0;
    return a(null), l(""), f(t), v(""), x(null), H(""), E("auto"), y(0), K.current = null, z.current = null, ce.current = "", t ? (n().then((X) => {
      G && (a(X), l(e), C(X.selectedModelTargetID));
    }).catch((X) => {
      G && v(Oo(X, "加载对话配置失败"));
    }).finally(() => {
      G && f(!1);
    }), () => {
      G = !1;
    }) : () => {
      G = !1;
    };
  }, [u, t, n, e]), le(() => {
    if (!t || !ee || F.scopeKey !== e)
      return;
    const G = `${e}:${F.sessionID}:${F.messageIdentity || "empty"}`;
    if (ce.current === G) return;
    const X = K.current;
    if (!F.messageIdentity && X && X.scopeKey === e && (X.sessionID === 0 || X.sessionID === F.sessionID))
      return;
    X && (K.current = null), ce.current = G;
    const se = F.execution;
    z.current = se ? { ...se } : null, C(N_(ee, se));
    const ye = O_(
      ee,
      se,
      s
    );
    E(ye.selection), y(ye.targetID), x(null), H("");
  }, [
    ee,
    F.execution,
    F.messageIdentity,
    F.scopeKey,
    F.sessionID,
    t,
    e,
    s
  ]);
  const $ = O(
    (G) => {
      if (!t) return;
      const X = P_(
        G.messages,
        s
      ), se = {
        scopeKey: e,
        sessionID: G.sessionID,
        messageIdentity: X?.messageIdentity || "",
        execution: X?.execution
      };
      te(
        (ye) => ye.scopeKey === se.scopeKey && ye.sessionID === se.sessionID && ye.messageIdentity === se.messageIdentity ? ye : se
      );
    },
    [t, e, s]
  );
  le(() => {
    if (!t || !L || typeof I != "number") {
      x(null), j(!1), H("");
      return;
    }
    if (T?.toolID === I && Number(T.config.selectedSourceID) === b)
      return;
    let G = !0;
    return j(!0), H(""), (async () => {
      try {
        return await r(I, b);
      } catch (se) {
        if (!b) throw se;
        return r(I, 0);
      }
    })().then((se) => {
      G && (x({ toolID: I, config: se }), y(Number(se.selectedSourceID || 0)));
    }).catch((se) => {
      G && (x(null), H(Oo(se, "加载工具参数失败")));
    }).finally(() => {
      G && j(!1);
    }), () => {
      G = !1;
    };
  }, [
    t,
    r,
    T,
    J,
    I,
    b,
    L
  ]);
  const U = ze(() => {
    if (!(!t || !L || typeof I != "number"))
      return g ? B_(
        g.params.filter((G) => !M_(G)),
        F.execution,
        I,
        s,
        b
      ) : [];
  }, [
    g,
    F.execution,
    t,
    s,
    I,
    b,
    L
  ]), Q = O(
    (G) => {
      G !== I && (E(G), y(0), x(null), H(""), V((X) => X + 1));
    },
    [I]
  ), ae = O(
    (G) => {
      G !== b && (y(G), H(""), V((X) => X + 1));
    },
    [b]
  ), ge = O(() => {
    if (p) {
      h((G) => G + 1);
      return;
    }
    x(null), H(""), V((G) => G + 1);
  }, [p]), De = O(
    (G) => {
      if (!t) return G;
      const X = { ...G.content };
      if (vt(X.interaction_response)) {
        const ye = z.current ? { ...z.current } : null;
        return ye ? X.execution = ye : delete X.execution, delete X.params, K.current = {
          scopeKey: e,
          sessionID: F.sessionID
        }, { ...G, content: X, params: void 0 };
      }
      if (A)
        throw new Error("当前对话没有可用模型");
      const se = {
        model_target_id: _,
        tool_mode: L ? L_(I) : "none"
      };
      if (L && typeof I == "number") {
        if (!g || S || P)
          throw new Error(P || "工具参数尚未加载完成");
        if (se[s] = I, D)
          throw new Error("当前工具没有可用模型");
        se.tool_target_id = b, se.tool_params = { ...G.params || {} }, delete X.params;
      }
      return X.execution = se, K.current = {
        scopeKey: e,
        sessionID: F.sessionID
      }, z.current = se, L && typeof I == "number" ? { ...G, content: X, params: void 0 } : { ...G, content: X };
    },
    [
      g,
      F.sessionID,
      t,
      A,
      D,
      _,
      e,
      P,
      S,
      s,
      I,
      b,
      L
    ]
  ), ve = F.scopeKey === e ? `${e}:session:${F.sessionID}` : `${e}:session:pending`, xe = d || !!p || !!ee?.readiness?.warnings.length || L || $n(
    ee?.modelSourceRule,
    ee?.modelSources
  );
  return {
    disabled: t && (d || !!p || !ee || A || L && typeof I == "number" && (S || !!P || !g || D)),
    toolbar: t && xe ? /* @__PURE__ */ m(
      k_,
      {
        config: ee,
        configLoading: d,
        configError: p,
        modelTargetID: _,
        toolSelection: I,
        toolTargetID: b,
        toolForm: g,
        toolFormLoading: S,
        toolFormError: P,
        onModelChange: C,
        onToolChange: Q,
        onToolTargetChange: ae,
        onRetry: ge
      }
    ) : null,
    parameters: U,
    // Parameter controls belong to the unsent conversation draft. Switching
    // tools or model sources must not discard values already entered there.
    parameterScopeKey: ve,
    prepareInput: De,
    renderFileLibrary: o,
    onConversationStateChange: $
  };
}
function k_({
  config: t,
  configLoading: e,
  configError: s,
  modelTargetID: n,
  toolSelection: r,
  toolTargetID: o,
  toolForm: i,
  toolFormLoading: a,
  toolFormError: c,
  onModelChange: l,
  onToolChange: u,
  onToolTargetChange: h,
  onRetry: d
}) {
  const f = ze(
    () => (i?.sources || []).map((E) => ({ id: Number(E.id), name: E.name })).filter((E) => E.id > 0),
    [i?.sources]
  ), p = !!t?.toolsEnabled, v = s || (p ? c : ""), _ = t?.readiness?.warnings || [], C = (!p || typeof r != "number") && $n(t?.modelSourceRule, t?.modelSources), I = p && typeof r == "number" && $n(i?.sourceRule, f);
  return /* @__PURE__ */ B("div", { className: "agent-chat-execution-controls", children: [
    p ? /* @__PURE__ */ m("div", { className: "agent-chat-execution-picker", children: /* @__PURE__ */ m(
      A_,
      {
        value: r,
        powers: t?.tools || [],
        categories: t?.categories || [],
        onValueChange: u
      }
    ) }) : null,
    C ? /* @__PURE__ */ m("div", { className: "agent-chat-execution-picker", children: /* @__PURE__ */ m(
      $o,
      {
        value: n,
        options: t?.modelSources || [],
        ariaLabel: "选择智能体模型",
        onValueChange: l
      }
    ) }) : null,
    I ? /* @__PURE__ */ m("div", { className: "agent-chat-execution-picker", children: /* @__PURE__ */ m(
      $o,
      {
        value: o,
        options: f,
        ariaLabel: "选择工具模型",
        onValueChange: h
      }
    ) }) : null,
    e || p && a ? /* @__PURE__ */ m(
      Dt,
      {
        className: "agent-chat-execution-loading animate-spin",
        "aria-label": "正在加载执行配置"
      }
    ) : null,
    v ? /* @__PURE__ */ m("span", { className: "agent-chat-execution-error", title: v, children: v }) : null,
    !v && _.length > 0 ? /* @__PURE__ */ B(
      "span",
      {
        className: "agent-chat-execution-warning",
        title: _.join(`
`),
        children: [
          /* @__PURE__ */ m(Ec, { "aria-hidden": "true" }),
          /* @__PURE__ */ B("span", { children: [
            _[0],
            _.length > 1 ? `（另有 ${_.length - 1} 项）` : ""
          ] })
        ]
      }
    ) : null,
    v ? /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: "agent-chat-execution-retry",
        "aria-label": "重新加载执行配置",
        title: "重新加载",
        onClick: d,
        children: /* @__PURE__ */ m(Rc, {})
      }
    ) : null
  ] });
}
function P_(t, e) {
  for (let s = t.length - 1; s >= 0; s -= 1) {
    const n = t[s];
    if (n.role !== "user") continue;
    const r = vt(n.content?.execution) ? n.content.execution : void 0, o = r && n.content?.interaction_response ? $_(
      t,
      s,
      r,
      e
    ) : r;
    return {
      messageIdentity: String(n.recordID || n.id),
      execution: o
    };
  }
  return null;
}
function $_(t, e, s, n) {
  if (String(s.tool_mode || "").trim() !== "specific" || vt(s.tool_params))
    return s;
  const r = Number(s[n] || 0), o = Number(s.tool_target_id || 0);
  if (!r) return s;
  for (let i = e - 1; i >= 0; i -= 1) {
    const a = t[i];
    if (a.role !== "user") continue;
    const c = a.content?.execution;
    if (!(!vt(c) || String(c.tool_mode || "").trim() !== "specific" || Number(c[n] || 0) !== r || Number(c.tool_target_id || 0) !== o || !vt(c.tool_params)))
      return { ...s, tool_params: c.tool_params };
  }
  return s;
}
function N_(t, e) {
  if (!Ln(t.modelSourceRule)) return 0;
  const s = Number(e?.model_target_id || 0);
  return t.modelSources.some((n) => n.id === s) ? s : t.selectedModelTargetID;
}
function O_(t, e, s) {
  if (t.toolsEnabled === !1)
    return { selection: "auto", targetID: 0 };
  if (String(e?.tool_mode || "auto").trim() === "specific") {
    const r = Number(e?.[s] || 0);
    if (t.tools.some((o) => o.id === r))
      return {
        selection: r,
        targetID: Number(e?.tool_target_id || 0)
      };
  }
  return { selection: "auto", targetID: 0 };
}
function B_(t, e, s, n, r) {
  if (String(e?.tool_mode || "").trim() !== "specific" || Number(e?.[n] || 0) !== s)
    return t;
  const o = Number(e?.tool_target_id || 0);
  if (o > 0 && r > 0 && o !== r)
    return t;
  const i = e?.tool_params;
  if (!vt(i)) return t;
  let a = !1;
  const c = t.map((l) => {
    const u = String(l.key || "").trim();
    return !u || !Object.prototype.hasOwnProperty.call(i, u) ? l : (a = !0, {
      ...l,
      default_value: F_(i[u])
    });
  });
  return a ? c : t;
}
function F_(t) {
  if (t == null) return "";
  if (typeof t == "string") return t;
  if (typeof t != "object") return String(t);
  try {
    return JSON.stringify(t);
  } catch {
    return "";
  }
}
function L_(t) {
  return typeof t == "number" ? "specific" : "auto";
}
function No(t, e) {
  return Ln(t) && e <= 0;
}
function $n(t, e) {
  return Ln(t) && (e?.length || 0) > 0;
}
function vt(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function Oo(t, e) {
  return t instanceof Error && t.message ? t.message : e;
}
function V_({
  agentKey: t,
  configApi: e,
  toolFormApi: s
}) {
  const n = !!(t && e && s), r = O(
    () => Jc(e, t),
    [t, e]
  ), o = O(
    (i, a) => Qc(s, {
      agentKey: t,
      powerID: i,
      sourceTargetID: a
    }),
    [t, s]
  );
  return D_({
    enabled: n,
    scopeKey: `admin-agent-runtime:${t}`,
    toolIDField: "power_id",
    loadConfig: r,
    loadToolForm: o
  });
}
await window.DeverFront?.ensureCompat?.(["@/lib/store", "@/lib/stream", "@/lib/utils", "@/components/ui/button", "@/components/ui/dialog"]);
const Nn = window.DeverFront?.sdk?.getCompatModule("@/lib/store");
if (!Nn || Object.keys(Nn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/store");
const ns = Nn.getStoreValueByPath, On = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!On || Object.keys(On).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const Zs = On.streamValueText, Bn = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!Bn || Object.keys(Bn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const rs = Bn.cn, Fn = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!Fn || Object.keys(Fn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const os = Fn.Button, at = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!at || Object.keys(at).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const j_ = at.Dialog, q_ = at.DialogContent, U_ = at.DialogDescription, z_ = at.DialogHeader, H_ = at.DialogTitle;
function rv({ item: t, store: e }) {
  const s = Gt(
    e,
    () => Zs(ns(e, String(t.meta?.agentPath || "")))
  ), n = Gt(
    e,
    () => Zs(
      ns(e, String(t.meta?.agentNamePath || ""))
    )
  ), r = String(t.meta?.openPath || ""), o = Gt(
    e,
    () => r ? !!ns(e, r) : !0
  ), i = String(t.meta?.openingEnabledPath || ""), a = Gt(
    e,
    () => i ? !!ns(e, i) : !!t.meta?.proactiveOpening
  ), c = String(t.meta?.executionConfigApi || ""), l = String(t.meta?.toolFormApi || ""), u = V_({
    agentKey: s,
    configApi: c,
    toolFormApi: l
  }), h = ze(
    () => ({
      session: String(t.meta?.sessionApi || "/bot/admin/assistant/session"),
      sessions: String(
        t.meta?.sessionsApi || "/bot/admin/assistant/sessions"
      ),
      newSession: String(
        t.meta?.newSessionApi || "/bot/admin/assistant/new_session"
      ),
      renameSession: String(
        t.meta?.renameSessionApi || "/bot/admin/assistant/rename_session"
      ),
      archiveSession: String(
        t.meta?.archiveSessionApi || "/bot/admin/assistant/archive_session"
      )
    }),
    [
      t.meta?.archiveSessionApi,
      t.meta?.newSessionApi,
      t.meta?.renameSessionApi,
      t.meta?.sessionApi,
      t.meta?.sessionsApi
    ]
  ), d = ze(
    () => ({
      request: String(t.meta?.requestApi || "/bot/admin/agent_runtime/run"),
      opening: String(
        t.meta?.openingApi || "/bot/admin/agent_runtime/opening"
      ),
      stream: String(t.meta?.streamApi || "/bot/admin/agent_runtime/stream"),
      stop: String(t.meta?.stopApi || "/bot/admin/agent_runtime/stop"),
      status: String(t.meta?.statusApi || "/bot/admin/agent_runtime/status"),
      referencePreview: String(
        t.meta?.referencePreviewApi || "/bot/admin/agent_runtime/reference_preview"
      ),
      inputConfig: String(
        t.meta?.inputConfigApi || "/bot/admin/agent_runtime/input_config"
      ),
      document: String(
        t.meta?.documentApi || "/bot/admin/agent_runtime/document"
      ),
      documentStream: String(
        t.meta?.documentStreamApi || "/bot/admin/agent_runtime/document_stream"
      )
    }),
    [
      t.meta?.documentApi,
      t.meta?.documentStreamApi,
      t.meta?.inputConfigApi,
      t.meta?.openingApi,
      t.meta?.referencePreviewApi,
      t.meta?.requestApi,
      t.meta?.statusApi,
      t.meta?.stopApi,
      t.meta?.streamApi
    ]
  ), f = O(() => {
    r && e.getState().setValueByPath(r, !1);
  }, [r, e]);
  return /* @__PURE__ */ m(
    G_,
    {
      agentKey: s,
      agentName: n,
      open: o,
      fullScreen: !!r,
      height: Zs(t.meta?.height || t.meta?.containerHeight) || "min(78dvh, 720px)",
      clipboardImageUploadRuleId: Number(
        t.meta?.clipboardImageUploadRuleId || 0
      ),
      blockMs: Number(t.meta?.blockMs || 1e3),
      proactiveOpening: a,
      composerDisabled: u.disabled,
      composerToolbar: u.toolbar,
      composerParameters: u.parameters,
      composerParameterScopeKey: u.parameterScopeKey,
      prepareInput: u.prepareInput,
      onConversationStateChange: u.onConversationStateChange,
      assistantApi: h,
      runtimeApi: d,
      onClose: f
    }
  );
}
function G_({
  agentKey: t,
  agentName: e = "",
  contextKey: s,
  open: n = !0,
  height: r = "min(78dvh, 720px)",
  minHeight: o = "min(420px, 78dvh)",
  fullScreen: i = !1,
  lazySession: a = !1,
  proactiveOpening: c = !1,
  mobileSessionNavigation: l = !1,
  navigationMode: u = "sidebar",
  appearance: h = "default",
  expanded: d = !1,
  sidebarTitle: f,
  clipboardImageUploadRuleId: p = 0,
  uploadBizKey: v,
  uploadBizName: _,
  allowResourceLibrary: C = !0,
  composerDisabled: I = !1,
  composerToolbar: E,
  composerParameters: b,
  composerParameterScopeKey: y,
  renderFileLibrary: T,
  prepareInput: x,
  onConversationStateChange: S,
  onUploadedFiles: j,
  blockMs: P = 1e3,
  assistantApi: H,
  runtimeApi: J,
  requestScope: V,
  referenceProviders: F,
  renderMessageActions: te,
  renderArtifactActions: ce,
  renderDocumentActions: K,
  onToggleExpanded: z,
  onClose: ee
}) {
  const L = Zb({
    agentKey: t,
    contextKey: s,
    modalOpen: n,
    blockMs: P,
    lazySession: a,
    proactiveOpening: c,
    assistantApi: H,
    runtimeApi: J,
    requestScope: V,
    prepareInput: x
  }), g = Xc(), A = g.open && g.request?.kind !== "audio" && g.request?.kind !== "file", [D, $] = W("chat"), U = re(null), [Q, ae] = W(0), [ge, De] = W(!1), ve = u === "internal", xe = ve || l, G = re(/* @__PURE__ */ new Set()), X = ze(
    () => L.messages.find(
      (be) => be.document?.id === Q
    ),
    [Q, L.messages]
  ), se = X?.document, ye = !!(ge && se && !A);
  le(() => {
    g.closePreview();
  }, [t, L.sessionID, g.closePreview, n]), le(() => {
    S?.({
      sessionID: L.sessionID,
      messages: L.messages
    });
  }, [L.messages, L.sessionID, S]), le(() => {
    $("chat");
  }, [t, s, xe]), le(() => {
    ae(0), De(!1);
  }, [t, s, L.sessionID]), le(() => {
    G.current.clear();
  }, [t, s]), le(() => {
    const pt = [...L.messages].reverse().find((Tt) => Tt.autoOpenDocument && Tt.document)?.document?.id || 0, je = `${L.sessionID}:${pt}`;
    !pt || G.current.has(je) || (G.current.add(je), ae(pt), De(!0));
  }, [L.messages, L.sessionID]);
  const ks = O((be) => {
    ae(be.id), De(!0);
  }, []), Ps = O(
    async (be) => {
      await L.openSession(be), $("chat");
    },
    [L.openSession]
  ), ne = O(async () => {
    await L.startNewSession(), $("chat");
  }, [L.startNewSession]);
  if (!n)
    return null;
  const Ht = /* @__PURE__ */ m(el, { controller: g, children: /* @__PURE__ */ B(
    "div",
    {
      ref: U,
      "data-agent-chat-layer": "true",
      "data-agent-chat-appearance": h,
      "data-agent-chat-navigation": u,
      "data-media-inspector-open": A ? "true" : void 0,
      className: rs(
        "relative flex min-h-0 w-full flex-col overflow-hidden bg-background md:flex-row",
        i ? "h-full flex-1" : h === "canvas" ? "" : "border-y"
      ),
      style: i ? void 0 : { height: r, minHeight: o },
      children: [
        ve ? null : /* @__PURE__ */ m(
          So,
          {
            agentName: e,
            title: f,
            agentReady: !!t,
            controller: L,
            collapsed: A
          }
        ),
        xe && D === "sessions" ? /* @__PURE__ */ m(
          So,
          {
            mobile: !ve,
            embedded: ve,
            agentName: e,
            title: f,
            agentReady: !!t,
            controller: L,
            onOpenSession: Ps,
            onStartNewSession: ne,
            onBack: () => $("chat")
          }
        ) : null,
        /* @__PURE__ */ B(
          "section",
          {
            className: rs(
              "min-h-0 min-w-0 flex-1 flex-col bg-background",
              xe && D === "sessions" ? ve ? "hidden" : "hidden md:flex" : "flex",
              A && "md:w-[38vw] md:min-w-[360px] md:max-w-[640px] md:flex-none"
            ),
            children: [
              /* @__PURE__ */ B("header", { className: "agent-chat-header flex h-12 shrink-0 items-center gap-2 px-3 md:h-14 md:px-6", children: [
                xe ? /* @__PURE__ */ B(
                  os,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: rs(
                      "size-10 shrink-0",
                      !ve && "md:hidden"
                    ),
                    title: "历史会话",
                    onClick: () => $("sessions"),
                    children: [
                      ve ? /* @__PURE__ */ m(Ac, { className: "size-4" }) : /* @__PURE__ */ m(Fo, { className: "size-4" }),
                      /* @__PURE__ */ m("span", { className: "sr-only", children: "历史会话" })
                    ]
                  }
                ) : null,
                /* @__PURE__ */ B("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ m("div", { className: "truncate text-sm font-semibold text-foreground", children: ve ? e || "画布助手" : L.sessionTitle || "新会话" }),
                  ve ? /* @__PURE__ */ m("div", { className: "truncate text-[11px] leading-4 text-muted-foreground", children: L.sessionTitle || "新会话" }) : null
                ] }),
                /* @__PURE__ */ B(
                  os,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: rs(
                      "size-10 shrink-0",
                      !ve && "md:hidden"
                    ),
                    title: "新对话",
                    disabled: L.sessionLoading || !t,
                    onClick: () => {
                      ne();
                    },
                    children: [
                      /* @__PURE__ */ m(Lo, { className: "size-4" }),
                      /* @__PURE__ */ m("span", { className: "sr-only", children: "新对话" })
                    ]
                  }
                ),
                z && !g.open ? /* @__PURE__ */ B(
                  os,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: "size-10 shrink-0 md:size-8",
                    title: d ? "退出全屏" : "展开对话",
                    onClick: z,
                    children: [
                      d ? /* @__PURE__ */ m(Mc, { className: "size-4" }) : /* @__PURE__ */ m(Dc, { className: "size-4" }),
                      /* @__PURE__ */ m("span", { className: "sr-only", children: d ? "退出全屏" : "展开对话" })
                    ]
                  }
                ) : null,
                (i || h === "canvas") && ee && !g.open ? /* @__PURE__ */ B(
                  os,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: "size-10 shrink-0 md:size-8",
                    title: "关闭对话",
                    onClick: ee,
                    children: [
                      /* @__PURE__ */ m(kc, { className: "size-4" }),
                      /* @__PURE__ */ m("span", { className: "sr-only", children: "关闭对话" })
                    ]
                  }
                ) : null
              ] }),
              /* @__PURE__ */ m(
                wb,
                {
                  controller: L,
                  children: /* @__PURE__ */ m(
                    u_,
                    {
                      controller: L,
                      clipboardImageUploadRuleId: p,
                      uploadBizKey: v,
                      uploadBizName: _,
                      allowResourceLibrary: C,
                      composerDisabled: I,
                      composerToolbar: E,
                      composerParameters: b,
                      composerParameterScopeKey: y,
                      renderFileLibrary: T,
                      onUploadedFiles: j,
                      referenceProviders: F,
                      renderMessageActions: te,
                      renderArtifactActions: ce,
                      onOpenDocument: ks
                    }
                  )
                },
                `${t}:${s || "default"}:${L.sessionID || "draft"}`
              )
            ]
          }
        ),
        se ? /* @__PURE__ */ m(
          Zc,
          {
            open: ye,
            portalContainer: U.current,
            document: se,
            messageID: X?.recordID || 0,
            renderArtifactActions: ce,
            renderDocumentActions: K,
            onClose: () => De(!1)
          }
        ) : null,
        /* @__PURE__ */ m(
          Kc,
          {
            controller: g,
            renderArtifactActions: ce
          }
        )
      ]
    }
  ) });
  return i ? /* @__PURE__ */ m(
    j_,
    {
      open: n,
      onOpenChange: (be) => {
        be || ee?.();
      },
      children: /* @__PURE__ */ B(
        q_,
        {
          layerClassName: ol,
          layerZIndex: rl,
          showCloseButton: !1,
          className: "!fixed !left-0 !top-0 !flex !h-[100dvh] !max-h-[100dvh] !w-screen !max-w-none !translate-x-0 !translate-y-0 !flex-col !gap-0 !overflow-hidden !rounded-none !border-0 bg-background !p-0 text-foreground shadow-none sm:!max-w-none",
          style: {
            position: "fixed",
            inset: 0,
            left: 0,
            top: 0,
            width: "100vw",
            maxWidth: "none",
            height: "100dvh",
            maxHeight: "100dvh",
            transform: "none",
            translate: "0 0",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            padding: 0,
            border: 0,
            borderRadius: 0,
            boxSizing: "border-box",
            pointerEvents: "auto"
          },
          children: [
            /* @__PURE__ */ B(z_, { className: "sr-only", children: [
              /* @__PURE__ */ m(H_, { children: "运行智能体" }),
              /* @__PURE__ */ m(U_, { children: e || t || "智能体对话" })
            ] }),
            Ht
          ]
        }
      )
    }
  ) : Ht;
}
export {
  G_ as A,
  rv as S,
  D_ as u
};
