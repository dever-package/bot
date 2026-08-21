import { a as F, j as f, F as Me, i as On } from "./preloadable-Bomi5PEU.js";
import { R as De, d as ne, p as hc, e as O, u as qe, m as _e, o as mc, c as fc, F as Oo, f as fe, C as gr, q as as, s as Ot, r as pc, b as le, a as G } from "./_commonjsHelpers-61wyk6v6.js";
import { b as gc, u as zt } from "./react-CHwuTySH.js";
import { O as bc, h as _c, K as vc, P as No, L as Mt, aR as yc, aS as wc, c as Bo, ac as Sc, aq as xc, r as Ic, o as Fo, a8 as br, R as Tc, A as Cc, X as Ec } from "./vendor-icons-B3DKX3la.js";
import { t as Lo, f as Rc, h as Vo, g as Ac, l as Mc, i as Dc, j as kc, k as Pc, m as Ct, n as _r, r as $c, o as Oc, p as Nc, q as Bc, s as Ds, c as Fc, A as Lc, a as Vc, u as qc, v as jc, d as Uc, w as Hc, x as zc, y as Gc, e as Wc, z as Yc, B as Jc } from "./interaction-view-CsguGUpk.js";
import { e as Qc, d as Xc } from "./file-kind-UfTAlHnR.js";
import { A as qo, a as ns, c as Zc, b as Kc, d as el } from "./clipboard-BLzb9wLn.js";
import { c as jo, d as tl, m as sl, j as nl, k as vs, l as rl, o as Uo, p as ol, q as il, s as vr, n as al, t as cl, i as cs, r as Ho, a as ll, u as ul, v as dl, w as hl, x as ml, h as fl } from "./interaction-C1CfPuZM.js";
import { P as pl } from "./power-icon-HeeWAKmZ.js";
import { P as gl } from "./power-picker-menu-ac0E1ttz.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./index-DtqAvNhX.css", import.meta.url).href]);
let mt = null;
function bl(t, e) {
  t.currentIndex = 0, t.wipContextDeps = null, t.wipCommitCallbacks = [];
  const s = mt;
  mt = t;
  try {
    if (e(), t.isFirstRender = !1, t.cells.length !== t.currentIndex) throw new Error(`Rendered ${t.currentIndex} hooks but expected ${t.cells.length}. Hooks must be called in the exact same order in every render.`);
  } finally {
    mt = s;
  }
}
function Be() {
  if (!mt) throw new Error("No resource fiber available");
  return mt;
}
function vt() {
  return mt;
}
const Nn = (t, e) => {
  if (t.length !== 0) {
    if (t.length === 1) throw t[0];
    for (const s of t) console.error(s);
    throw new AggregateError(t, e);
  }
}, $e = {
  HookState: 0,
  EffectEvent: 1,
  PassiveEffectCleanup: 2,
  PassiveEffectSetup: 3
}, _l = [
  $e.HookState,
  $e.EffectEvent,
  $e.PassiveEffectCleanup,
  $e.PassiveEffectSetup
];
function vl(t) {
  const e = [];
  for (const s of _l) {
    const n = t[s];
    if (n !== void 0)
      for (let r = 0; r < n.length; r++) try {
        n[r]();
      } catch (o) {
        e.push(o);
      }
  }
  Nn(e, "Errors during commit");
}
function yl(t) {
  const e = [];
  for (const s of t.cells) if (s?.type === "effect" && (s.deps = null, s.cleanup))
    try {
      s.cleanup?.();
    } catch (n) {
      e.push(n);
    } finally {
      s.cleanup = void 0;
    }
  Nn(e, "Errors during cleanup");
}
const ys = (t, e) => {
  for (let s = 0; s < t.length && s < e.length; s++) if (!Object.is(t[s], e[s])) return !1;
  return !0;
}, Bn = () => {
  throw new Error("Rendered more hooks than during the previous render. Hooks must be called in the exact same order in every render.");
}, Fn = () => {
  throw new Error("Hook order changed between renders");
}, yr = (t, e) => {
  Nt(t, $e.HookState, () => {
    e.current = e.wip, e.currentDeps = e.wipDeps, e.isDirty = !1;
  });
}, ws = (t, e) => {
  const s = Be(), n = s.currentIndex++;
  let r = s.cells[n];
  if (r === void 0) {
    !s.isFirstRender && n >= s.cells.length && Bn();
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
  r.type !== "memo" && Fn();
  const o = r;
  if (ys(o.wipDeps, e))
    return o.isDirty && yr(s, o), o.wip;
  const i = t();
  return o.wip = i, o.wipDeps = e, o.isDirty || (o.isDirty = !0, ti(s.root, () => {
    o.wip = o.current, o.wipDeps = o.currentDeps, o.isDirty = !1;
  })), yr(s, o), i;
};
function Vt(t) {
  return ws(() => ({ current: t }), []);
}
const Ln = /* @__PURE__ */ Symbol("tap.Context.defaultValue"), wl = (t) => t;
let Re = /* @__PURE__ */ new Map();
const Ye = /* @__PURE__ */ new Set(), zo = () => new Map(Re), wr = (t, e) => {
  const s = Re;
  Re = t;
  try {
    return e();
  } finally {
    Re = s;
  }
}, Go = (t, e) => {
  t[Ln] = e;
}, Wo = (t) => typeof t == "object" && t !== null && Ln in t, Yo = (t) => typeof t == "object" && t !== null && "$$typeof" in t && t.$$typeof === /* @__PURE__ */ Symbol.for("react.context"), Vn = (t) => Wo(t) || Yo(t), Jo = (t) => {
  if (!Wo(t)) {
    if (Yo(t)) {
      Go(t, t._currentValue ?? t._currentValue2);
      return;
    }
    throw new Error("A tap resource's `use()` only accepts a tap context.");
  }
}, Qo = (t, e, s) => {
  if (typeof t != "object" || t === null) throw new Error("useContextProvider only accepts a React context.");
  Jo(t);
  const n = t, r = Be(), o = Vt(void 0), i = o.current === void 0 || !Object.is(o.current.value, e);
  Xe(() => {
    o.current = { value: e };
  }, [e]);
  const a = Re.get(n), c = a !== void 0 || Re.has(n);
  Re.set(n, {
    value: e,
    source: r
  });
  try {
    return Sl(n, i, s);
  } finally {
    c ? Re.set(n, a) : Re.delete(n);
  }
}, Sl = (t, e, s) => {
  const n = Ye.has(t);
  e ? Ye.add(t) : Ye.delete(t);
  try {
    return s();
  } finally {
    n ? Ye.add(t) : Ye.delete(t);
  }
}, xl = (t) => {
  Jo(t);
  const e = t, s = Il(e, t), n = Be();
  return (n.wipContextDeps ??= /* @__PURE__ */ new Map()).set(e, s.source), s.value;
}, Il = (t, e) => Re.get(t) ?? {
  value: wl(e)[Ln],
  source: null
}, Tl = (t, e, s, n) => {
  if (!n) return s;
  let r = s;
  for (const [o, i] of n)
    i === e || i === t || (r ??= /* @__PURE__ */ new Map()).set(o, i);
  return r;
}, Xo = (t, e = t.wipContextDeps) => {
  const s = vt();
  !s || !e || (s.wipContextDeps = Tl(s, t, s.wipContextDeps, e));
}, Zo = () => Ye.size > 0, qn = (t) => {
  if (!t.contextDeps || !Zo()) return !1;
  for (const e of Ye.keys()) if (t.contextDeps.has(e)) return !0;
  return !1;
}, Ko = (t) => ({
  version: 0,
  committedVersion: 0,
  context: zo(),
  dispatchUpdate: t,
  changelog: [],
  rollbackCallbacks: []
}), ls = (t) => {
  t.committedVersion = t.version, t.changelog.length = 0, t.rollbackCallbacks.length = 0;
}, Dt = (t, e) => {
  const s = t.version > e;
  if (t.version = e, s) {
    for (let n = 0; n < t.rollbackCallbacks.length; n++) t.rollbackCallbacks[n]();
    if (t.rollbackCallbacks.length = 0, e <= t.committedVersion)
      t.committedVersion = e, t.changelog.length = 0;
    else {
      for (; t.committedVersion + t.changelog.length > e; ) t.changelog.pop();
      for (let n = 0; n < t.changelog.length; n++) ei(t.changelog[n]);
      ls(t);
    }
  }
}, ei = (t) => {
  si(t.fiber, t.cell), t.queued || (t.queued = !0, (t.cell.queue ??= []).push(t));
}, Nt = (t, e, s) => {
  const n = t.wipCommitCallbacks;
  (n[e] ??= []).push(s);
}, ti = (t, e) => {
  t.rollbackCallbacks.push(e);
}, si = (t, e) => {
  e.isDirty || (e.isDirty = !0, t.markDirty?.(), ti(t.root, () => {
    if (e.queue !== null) {
      for (const s of e.queue) s.queued = !1;
      e.queue = null;
    }
    e.workInProgress = e.current, e.isDirty = !1;
  }));
}, Cl = () => ({
  type: "effect",
  cleanup: void 0,
  deps: null
});
function Xe(t, e) {
  const s = Be(), n = s.currentIndex++, r = s.cells[n], o = r === void 0 ? Cl() : r.type === "effect" ? r : Fn();
  if (r === void 0 && (!s.isFirstRender && n >= s.cells.length && Bn(), s.cells[n] = o), !(e && o.deps && ys(o.deps, e))) {
    if (o.deps !== null && !!e != !!o.deps) throw new Error("useEffect called with and without dependencies across re-renders");
    Nt(s, $e.PassiveEffectCleanup, () => {
      try {
        o.cleanup?.();
      } finally {
        o.cleanup = void 0;
      }
    }), Nt(s, $e.PassiveEffectSetup, () => {
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
const El = (t, e, s) => {
  if (t.isNeverMounted) throw new Error("Resource updated before mount");
  let n = !1, r = !0;
  t.root.dispatchUpdate(() => (n || (n = !0, s && t.root.changelog.length === 0 && !e.cell.isDirty && !e.hasEagerState && (e.eagerState = s(e.cell.workInProgress, e.action), e.hasEagerState = !0, r = !Object.is(e.cell.current, e.eagerState))), r), () => (n = !0, r = !0, ei(e), t.root.changelog.push(e), !0));
}, Rl = (t, e, s, n, r) => {
  const o = n ? n(s) : s, i = {
    type: "reducer",
    workInProgress: o,
    current: o,
    isDirty: !1,
    queue: null,
    renderQueue: null,
    reducer: e,
    dispatch: (a) => {
      const c = vt();
      if (c !== null) {
        if (c !== t) throw new Error("Cannot update a resource while rendering a different resource.");
        (t.renderPendingCells ??= /* @__PURE__ */ new Set()).add(i), (i.renderQueue ??= []).push(a);
      } else El(t, {
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
function ni(t, e, s, n) {
  const r = Be(), o = r.currentIndex++, i = r.cells[o], a = (() => {
    if (i !== void 0) return i.type === "reducer" ? i : Fn();
    !r.isFirstRender && o >= r.cells.length && Bn();
    const l = Rl(r, t, e, s, n);
    return r.cells[o] = l, l;
  })(), c = a.queue;
  if (c !== null) {
    const l = t === a.reducer;
    for (let u = 0; u < c.length; u++) {
      const d = c[u];
      (!d.hasEagerState || !l) && (d.eagerState = t(a.workInProgress, d.action), d.hasEagerState = !0), d.queued = !1, a.workInProgress = d.eagerState;
    }
    a.queue = null;
  }
  if (a.reducer = t, a.renderQueue !== null) {
    let l = a.workInProgress;
    for (const u of a.renderQueue) l = t(l, u);
    a.renderQueue = null, r.renderPendingCells?.delete(a), Object.is(l, a.workInProgress) || (si(r, a), a.workInProgress = l);
  }
  return a.isDirty && Nt(r, $e.HookState, () => {
    a.current = a.workInProgress, a.isDirty = !1;
  }), [a.workInProgress, a.dispatch];
}
function ri(t, e, s) {
  return ni(t, e, s, !1);
}
const Al = (t, e) => typeof e == "function" ? e(t) : e, Ml = (t) => t === void 0 ? void 0 : typeof t == "function" ? t() : t;
function jn(t) {
  return ni(Al, t, Ml, !0);
}
const Un = (t, e) => ws(() => t, e);
function Hn(t) {
  const e = Be(), s = Vt(t);
  return s.current !== t && Nt(e, $e.EffectEvent, () => {
    s.current = t;
  }), Un(((...n) => s.current(...n)), []);
}
const us = (t) => {
  if (!Vn(t)) throw new Error("A tap resource's `use()` only accepts a tap context.");
  return xl(t);
}, oi = (t, e, s = e) => {
  const n = Vt(!0), r = n.current ? s() : e();
  n.current = !1;
  const [, o] = jn(0), i = Hn(() => {
    try {
      if (Object.is(r, e())) return;
    } catch {
      return;
    }
    o((a) => a + 1);
  });
  return Xe(() => (i(), t(i)), [t]), r;
}, ii = (t, e) => {
}, Dl = De;
function kl(t) {
  const e = ne(t);
  return hc(() => {
    e.current = t;
  }), O(((...s) => e.current(...s)), []);
}
const Pl = Dl.useEffectEvent ?? kl, xe = () => vt() !== null, Ie = De, de = (t) => xe() ? jn(t) : Ie.useState(t), $l = (t, e, s) => xe() ? ri(t, e, s) : Ie.useReducer(t, e, s), he = (t) => xe() ? Vt(t) : Ie.useRef(t), me = (t, e) => xe() ? ws(t, e) : Ie.useMemo(t, e), rs = (t, e) => xe() ? Un(t, e) : Ie.useCallback(t, e), K = (t, e) => xe() ? Xe(t, e) : Ie.useEffect(t, e), ds = (t, e) => xe() ? Xe(t, e) : Ie.useLayoutEffect(t, e), ai = (t) => xe() ? Hn(t) : Pl(t), zn = (t, e, s) => xe() ? oi(t, e, s) : Ie.useSyncExternalStore(t, e, s), Ol = (t, e) => xe() ? ii() : Ie.useDebugValue(t, e), ot = (t) => {
  const e = Ie.createContext(t);
  return Go(e, t), e;
}, ci = (t) => xe() && Vn(t) ? us(t) : Ie.use(t), Ss = (t) => xe() && Vn(t) ? us(t) : Ie.useContext(t), li = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), ui = (t) => new Array(t).fill(li), Nl = (t, e) => {
  const s = t.memoCache;
  let n = s.workInProgress;
  if (n === null) {
    const i = s.current;
    n = i === null ? [] : i.map((a) => a.slice()), s.workInProgress = n;
  }
  const r = s.index++;
  let o = n[r];
  return o === void 0 && (o = ui(e), n[r] = o), o;
}, di = (t) => Nl(Be(), t), Bl = De, Fl = (t) => qe(() => {
  const e = ui(t);
  return e[li] = !0, e;
}, []), Ll = Bl.__COMPILER_RUNTIME?.c ?? Fl, Vl = () => vt() !== null, w = (t) => Vl() ? di(t) : Ll(t);
function oe(t) {
  return (...e) => ({
    hook: t,
    args: e
  });
}
function Se(t, e, s) {
  return typeof e == "function" ? (...n) => Se(t, e(...n)) : s ? {
    ...e,
    key: t,
    deps: s
  } : {
    ...e,
    key: t
  };
}
const ql = 50;
let Je = {
  schedulers: /* @__PURE__ */ new Set([]),
  isScheduled: !1
}, Qe = null;
var jl = class {
  _isDirty = !1;
  _task;
  constructor(t) {
    this._task = t;
  }
  get isDirty() {
    return this._isDirty;
  }
  markDirty() {
    if (Qe && (Qe.get(this) ?? 0) >= ql) throw new Error("Maximum update depth exceeded. This can happen when a resource repeatedly calls setState inside useEffect.");
    this._isDirty = !0, Je.schedulers.add(this), Ul();
  }
  runTask() {
    Qe?.set(this, (Qe.get(this) ?? 0) + 1), this._isDirty = !1, this._task();
  }
};
const Ul = () => {
  Je.isScheduled || (Je.isScheduled = !0, Hl());
}, Sr = () => {
  const t = Qe;
  Qe = /* @__PURE__ */ new Map();
  try {
    const e = [];
    for (const s of Je.schedulers)
      if (Je.schedulers.delete(s), !!s.isDirty)
        try {
          s.runTask();
        } catch (n) {
          e.push(n);
        }
    Nn(e, "Errors occurred during flushSync");
  } finally {
    Qe = t, Je.schedulers.clear(), Je.isScheduled = !1;
  }
}, Hl = (() => {
  if (typeof MessageChannel < "u") {
    let t = null, e;
    return () => {
      if (!t) {
        const s = new MessageChannel();
        s.port1.onmessage = () => {
          t?.unref?.(), Sr();
        }, t = s.port1, e = s.port2;
      }
      t.ref?.(), e.postMessage(null);
    };
  }
  return () => setTimeout(Sr, 0);
})(), zl = {
  useState: jn,
  useReducer: ri,
  useRef: Vt,
  useMemo: ws,
  useCallback: Un,
  useEffect: Xe,
  useLayoutEffect: Xe,
  useInsertionEffect: Xe,
  useEffectEvent: Hn,
  useContext: us,
  use: us,
  useSyncExternalStore: oi,
  useDebugValue: ii,
  useMemoCache: di
}, xr = De, He = xr.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ?? xr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Gt = He == null ? null : "H" in He ? {
  get current() {
    return He.H;
  },
  set current(t) {
    He.H = t;
  }
} : "ReactCurrentDispatcher" in He ? {
  get current() {
    return He.ReactCurrentDispatcher.current;
  },
  set current(t) {
    He.ReactCurrentDispatcher.current = t;
  }
} : null;
function Gl(t) {
  if (!Gt) return t();
  const e = Gt.current;
  Gt.current = zl;
  try {
    return t();
  } finally {
    Gt.current = e;
  }
}
function hi(t, e, s = void 0, n) {
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
function ft(t) {
  if (!t.isMounted) throw new Error("Tried to unmount a fiber that is already unmounted");
  t.isMounted = !1, yl(t);
}
function Ze(t, e) {
  if (t.memoCache.workInProgress = null, t.renderPendingCells !== null) {
    for (const r of t.renderPendingCells) r.renderQueue = null;
    t.renderPendingCells.clear();
  }
  let s = 0, n;
  do {
    if (++s > 25) throw new Error("Too many re-renders. tap limits the number of renders to prevent an infinite loop.");
    t.memoCache.index = 0, bl(t, () => {
      n = Gl(() => t.hook(...e));
    });
  } while ((t.renderPendingCells?.size ?? 0) > 0);
  return Xo(t), n;
}
function Bt(t) {
  const e = t.wipCommitCallbacks ?? t.commitCallbacks ?? [];
  t.wipCommitCallbacks = null, t.commitCallbacks = e, t.isMounted = !0, t.contextDeps = t.wipContextDeps, ls(t.root), t.memoCache.workInProgress !== null && (t.memoCache.current = t.memoCache.workInProgress, t.memoCache.workInProgress = null), t.isNeverMounted = !1, vl(e);
}
const Wl = () => {
  const t = Be();
  return t.devStrictMode ? t.isFirstRender ? "child" : "root" : null;
}, Yl = () => null, Jl = () => Yl, mi = () => vt() ? Wl : Jl(), Ql = (t) => t(), Xl = (t) => {
  const [e] = de(() => new jl(() => m())), [s] = de(() => []), n = mi(), [r] = de(() => {
    const p = Ko((v, _) => {
      if (!e.isDirty) {
        if (!v()) return;
        _();
      }
      Dt(p, p.committedVersion + p.changelog.length), s.push(_), e.markDirty();
    });
    return hi(Ql, p, void 0, n());
  }), o = zo(), i = r.root.version - r.root.committedVersion, a = wr(o, () => Ze(r, [t])), c = he(!1), l = he([t]), u = he(a), [d] = de(() => /* @__PURE__ */ new Set()), h = (p) => {
    e.isDirty || u.current === p || (u.current = p, d.forEach((v) => v()));
  }, m = ai(() => {
    Dt(r.root, r.root.committedVersion), s.forEach((v) => {
      v();
    }), Dt(r.root, r.root.committedVersion + r.root.changelog.length);
    const p = wr(r.root.context, () => Ze(r, l.current));
    if (e.isDirty) throw new Error("Scheduler is dirty, this should never happen");
    ls(r.root), s.length = 0, c.current && Bt(r), h(p);
  });
  return K(() => (c.current = !0, () => {
    c.current = !1, ft(r);
  }), [r]), K(() => {
    l.current = [t], ls(r.root), s.splice(0, i), r.root.context = o, Bt(r), h(a);
  }), me(() => ({
    getValue: () => u.current,
    subscribe: (p) => (d.add(p), () => d.delete(p))
  }), [d]);
}, Zl = () => {
  const t = he(0), e = t.current, s = Be();
  return {
    version: e,
    markDirty: me(() => () => {
      t.current++, s?.markDirty?.();
    }, [s]),
    root: s.root
  };
}, Kl = () => {
  const [t] = de(() => Ko((r, o) => {
    let i = !1;
    n((a) => (i = !r(), i ? a : a + 1)), i || s(o);
  })), [e, s] = $l((r, o) => (Dt(t, r), r + (o() ? 1 : 0)), 0), [, n] = de(0);
  return Dt(t, e), {
    root: t,
    version: e,
    markDirty: void 0
  };
}, Gn = () => {
  const t = mi(), { root: e, version: s, markDirty: n } = vt() ? Zl() : Kl();
  return {
    version: s,
    createFiber: rs((r, o, i) => hi(r, e, i ? () => {
      i(), n?.();
    } : n, t()), [])
  };
}, fi = (t, e, s) => {
  const n = he(null), r = n.current ?? (n.current = {
    wipDeps: null,
    wip: null,
    currentDeps: null,
    current: null
  });
  return r.wipDeps = r.currentDeps, r.wip = r.current, K(() => {
    r.currentDeps = r.wipDeps, r.current = r.wip;
  }), !s && r.currentDeps && ys(r.currentDeps, e) ? r.current : (r.wipDeps = e, r.wip = t(), r.wip);
};
function Fe(t) {
  const { version: e, createFiber: s } = Gn(), n = me(() => s(t.hook, t.key), [
    t.hook,
    t.key,
    s
  ]), r = fi(() => ({ value: Ze(n, t.args) }), [
    n,
    e,
    t.args
  ], qn(n));
  return K(() => () => ft(n), [n]), K(() => {
    Bt(n);
  }, [n, r]), r.value;
}
const Ir = (t, e) => {
  const s = t.get(e);
  s && (s.isDirty = !0);
}, eu = (t, e) => !t.isDirty && !qn(t.fiber) && e !== void 0 && t.committedDeps !== void 0 && ys(t.committedDeps, e), tu = (t) => {
  if (!Zo()) return !1;
  for (const { fiber: e } of t.values()) if (qn(e)) return !0;
  return !1;
};
function xs(t) {
  const [e] = de(() => /* @__PURE__ */ new Map()), { version: s, createFiber: n } = Gn(), r = tu(e), o = fi(() => {
    const i = /* @__PURE__ */ new Set(), a = [];
    let c = 0;
    for (let l = 0; l < t.length; l++) {
      const u = t[l], d = u.key;
      if (d === void 0) throw new Error(`useResources did not provide a key for array at index ${l}`);
      if (i.has(d)) throw new Error(`Duplicate key ${d} in useResources`);
      i.add(d);
      let h = e.get(d);
      if (h)
        if (h.fiber.hook !== u.hook) {
          const m = n(u.hook, u.key, () => Ir(e, d)), p = Ze(m, u.args);
          h.next = {
            value: p,
            deps: u.deps,
            remount: m
          };
        } else if (eu(h, u.deps))
          h.fiber.contextDeps && Xo(h.fiber, h.fiber.contextDeps), h.next = "skip";
        else {
          const m = Ze(h.fiber, u.args);
          h.next = {
            value: m,
            deps: u.deps
          };
        }
      else {
        const m = n(u.hook, u.key, () => Ir(e, d));
        h = {
          fiber: m,
          next: {
            value: Ze(m, u.args),
            deps: u.deps
          },
          isDirty: !1,
          committedDeps: void 0,
          committedValue: void 0
        }, c++, e.set(d, h);
      }
      a.push(typeof h.next == "object" ? h.next.value : h.committedValue);
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
  return K(() => () => {
    for (const i of e.keys()) {
      const a = e.get(i).fiber;
      ft(a);
    }
  }, [e]), K(() => {
    for (const [i, a] of e.entries()) {
      const c = a.next;
      c === "delete" ? (a.fiber.isMounted && ft(a.fiber), e.delete(i)) : c === "skip" || (c.remount && (ft(a.fiber), a.fiber = c.remount), Bt(a.fiber), a.committedDeps = c.deps, a.committedValue = c.value, a.isDirty = !1);
    }
  }, [o, e]), o;
}
const su = (t) => t(), nu = (t) => {
  const { createFiber: e } = Gn(), s = me(() => e(su, void 0), [e]), n = Ze(s, [t]);
  K(() => () => {
    ft(s);
  }, [s]);
  let r = !1;
  const o = () => {
    r && s.isMounted || (r = !0, Bt(s));
  };
  return K(o), {
    value: n,
    effects: o
  };
}, ru = () => {
  const t = w(4), [e, s] = de(iu);
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
        [c]: u.renderers[c]?.filter((d) => d !== l) ?? []
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
}, ou = oe(ru);
function iu() {
  return {
    renderers: {},
    fallbacks: []
  };
}
const ks = (t) => {
  if (!t.overwrite) return t;
  const { overwrite: e, ...s } = t;
  return s;
}, au = (t) => {
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
          n.tools[i] = ks(a);
          continue;
        }
        const u = l > o ? c : a, d = l > o ? a : c;
        n.tools[i] = ks({
          ...d,
          ...u
        }), s[i] = Math.max(l, o);
        continue;
      }
      n.tools || (n.tools = {}), n.tools[i] = ks(a), s[i] ??= o;
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
var pi = class {
  _providers = /* @__PURE__ */ new Set();
  getModelContext() {
    return au(this._providers);
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
const Js = [], cu = {
  modelName: void 0,
  toolNames: Js
}, lu = (t, e) => t === e || t.length === e.length && t.every((s, n) => s === e[n]), Wt = (t, e) => {
  const s = t.getModelContext(), n = s.config?.modelName, r = s.tools ? Object.keys(s.tools).sort() : Js, o = r.length ? r : Js;
  return n === e.modelName && lu(o, e.toolNames) ? e : {
    modelName: n,
    toolNames: o
  };
}, uu = () => {
  const t = w(11);
  let e;
  t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (e = new pi(), t[0] = e) : e = t[0];
  const s = e;
  let n;
  t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (n = () => Wt(s, cu), t[1] = n) : n = t[1];
  const [r, o] = de(n);
  let i, a;
  t[2] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (i = () => (o((m) => Wt(s, m)), s.subscribe(() => {
    o((m) => Wt(s, m));
  })), a = [s], t[2] = i, t[3] = a) : (i = t[2], a = t[3]), K(i, a);
  let c;
  t[4] !== r ? (c = () => Wt(s, r), t[4] = r, t[5] = c) : c = t[5];
  let l, u, d;
  t[6] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (l = () => s.getModelContext(), u = (m) => s.subscribe(m), d = (m) => s.registerModelContextProvider(m), t[6] = l, t[7] = u, t[8] = d) : (l = t[6], u = t[7], d = t[8]);
  let h;
  return t[9] !== c ? (h = {
    getState: c,
    getModelContext: l,
    subscribe: u,
    register: d
  }, t[9] = c, t[10] = h) : h = t[10], h;
}, gi = oe(uu), du = (t) => t.display !== void 0 ? t.display === "standalone" : t.type === "human", hu = (t, e) => {
  if (!(e.status?.type === "running" || e.status?.type === "requires-action")) {
    const n = t.complete;
    return typeof n != "function" ? n ?? null : n({
      args: e.args,
      result: e.result
    });
  }
  const s = t.running;
  return typeof s != "function" ? s ?? null : s({ args: e.args });
}, mu = (t) => function(s) {
  return hu(t, s);
}, Qs = /* @__PURE__ */ Symbol("assistant-ui.store.clientIndex"), fu = (t) => t[Qs], bi = ot([]), Wn = () => ci(bi), pu = (t, e) => {
  const s = w(3), n = Wn();
  let r;
  return s[0] !== t || s[1] !== n ? (r = [...n, t], s[0] = t, s[1] = n, s[2] = r) : r = s[2], Qo(bi, r, e);
}, gu = /* @__PURE__ */ new Set([
  "$$typeof",
  "nodeType",
  "then"
]), Is = (t, e) => {
  if (t === Symbol.toStringTag) return e;
  if (typeof t != "symbol") {
    if (t === "toJSON") return () => e;
    if (!gu.has(t))
      return !1;
  }
};
var Yn = class {
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
const hs = /* @__PURE__ */ Symbol("assistant-ui.store.getValue"), bu = (t) => {
  const e = t[hs];
  if (!e) throw new Error("Client scope contains a non-client resource. Ensure your Derived get() returns a client created with useClientResource(), not a plain resource.");
  return e.getState?.();
}, Tr = /* @__PURE__ */ new Map();
function _u(t) {
  let e = Tr.get(t);
  return e || (e = function(...s) {
    if (!this || typeof this != "object") throw new Error(`Method "${String(t)}" called without proper context. This may indicate the function was called incorrectly.`);
    const n = this[hs];
    if (!n) throw new Error(`Method "${String(t)}" called on invalid client proxy. Ensure you are calling this method on a valid client instance.`);
    const r = n[t];
    if (!r) throw new Error(`Method "${String(t)}" is not implemented.`);
    if (typeof r != "function") throw new Error(`"${String(t)}" is not a function.`);
    return r(...s);
  }, Tr.set(t, e)), e;
}
var vu = class extends Yn {
  boundFns;
  cachedReceiver;
  outputRef;
  index;
  constructor(t, e) {
    super(), this.outputRef = t, this.index = e;
  }
  get(t, e, s) {
    if (e === hs) return this.outputRef.current;
    if (e === Qs) return this.index;
    const n = Is(e, "ClientProxy");
    if (n !== !1) return n;
    const r = this.outputRef.current[e];
    if (typeof r == "function") {
      this.cachedReceiver !== s && (this.boundFns = /* @__PURE__ */ new Map(), this.cachedReceiver = s);
      let o = this.boundFns.get(e);
      return o || (o = _u(e).bind(s), this.boundFns.set(e, o)), o;
    }
    return r;
  }
  ownKeys() {
    return Object.keys(this.outputRef.current);
  }
  has(t, e) {
    return e === hs || e === Qs ? !0 : e in this.outputRef.current;
  }
};
const qt = (t) => {
  const e = he(null), s = Wn().length, n = me(() => new Proxy({}, new vu(e, s)), [s]), r = pu(n, function() {
    return Fe(t);
  });
  return e.current || (e.current = r), K(() => {
    e.current = r;
  }), {
    methods: n,
    state: r.getState?.(),
    key: t.key
  };
}, yu = oe(qt), kt = /* @__PURE__ */ Symbol("assistant-ui.store.proxiedAssistantState"), Ps = (t) => t === "on" || t === "subscribe" || typeof t == "symbol", _i = (t) => {
  class e extends Yn {
    get(n, r) {
      const o = Is(r, "AssistantState");
      if (o !== !1) return o;
      const i = r;
      if (!Ps(i))
        return bu(t[i]());
    }
    ownKeys() {
      return Object.keys(t).filter((n) => !Ps(n));
    }
    has(n, r) {
      return !Ps(r) && r in t;
    }
  }
  return new Proxy({}, new e());
}, wu = (t) => t[kt], Cr = () => () => {
}, vi = (t) => {
  const e = (() => {
    throw new Error(t);
  });
  return e.source = null, e.query = null, e;
};
var Su = class extends Yn {
  get(t, e) {
    if (e === "subscribe" || e === "on") return Cr;
    if (e === kt) return xu;
    const s = Is(e, "DefaultAssistantClient");
    return s !== !1 ? s : vi("You are using a component or hook that requires an AuiProvider. Wrap your component in an <AuiProvider> component.");
  }
  ownKeys() {
    return [
      "subscribe",
      "on",
      kt
    ];
  }
  has(t, e) {
    return e === "subscribe" || e === "on" || e === kt;
  }
};
const Ts = new Proxy({}, new Su()), xu = _i(Ts), Iu = () => new Proxy({}, { get(t, e) {
  const s = Is(e, "AssistantClient");
  return s !== !1 ? s : vi(`The current scope does not have a "${String(e)}" property.`);
} }), yi = ot(Ts), wi = /* @__PURE__ */ Symbol("assistant-ui.store.useEffects"), Tu = () => {
}, Cu = (t) => t[wi] ?? Tu, Eu = () => {
  "use no memo";
  const t = Si();
  return K(Cu(t)), null;
}, Si = () => Ss(yi), Ne = ({ value: t, children: e }) => {
  "use no memo";
  return /* @__PURE__ */ F(yi.Provider, {
    value: t,
    children: [/* @__PURE__ */ f(Eu, {}), e]
  });
}, Xs = (t) => {
  throw new Error("Derived elements are config-only and must not be mounted");
}, Ae = oe(Xs), Zs = /* @__PURE__ */ Symbol("assistant-ui.transform-scopes");
function xi(t, e) {
  const s = t;
  if (s[Zs]) throw new Error("transformScopes is already attached to this resource");
  s[Zs] = e;
}
function Ru(t) {
  return t[Zs];
}
const Ii = (t) => typeof t == "string" ? {
  scope: t.split(".")[0],
  event: t
} : {
  scope: t.scope,
  event: t.event
}, Ti = ot(null), Au = (t, e) => Qo(Ti, t, e), Ci = () => {
  const t = ci(Ti);
  if (!t) throw new Error("AssistantTapContext is not available");
  return t;
}, Ei = () => Ci().clientRef, Jn = () => {
  const t = w(3), { emit: e } = Ci(), s = Wn();
  let n;
  return t[0] !== s || t[1] !== e ? (n = (r, o) => {
    e(r, o, s);
  }, t[0] = s, t[1] = e, t[2] = n) : n = t[2], ai(n);
};
function Mu(t, e) {
  const s = { ...t }, n = /* @__PURE__ */ new Set();
  let r = !0;
  for (; r; ) {
    r = !1;
    for (const a of Object.values(s)) {
      if (a.hook === Xs || n.has(a.hook)) continue;
      n.add(a.hook);
      const c = Ru(a.hook);
      if (c) {
        c(s, e), r = !0;
        break;
      }
    }
  }
  const o = {}, i = {};
  for (const [a, c] of Object.entries(s)) c.hook === Xs ? i[a] = c : o[a] = c;
  return {
    rootClients: o,
    derivedClients: i
  };
}
const Er = (t) => me(() => t, [...Object.entries(t).flat()]), Du = (t, e) => {
  const s = w(6);
  let n;
  s[0] !== e || s[1] !== t ? (n = Mu(t, e), s[0] = e, s[1] = t, s[2] = n) : n = s[2];
  const { rootClients: r, derivedClients: o } = n, i = Er(r), a = Er(o);
  let c;
  return s[3] !== i || s[4] !== a ? (c = {
    rootClients: i,
    derivedClients: a
  }, s[3] = i, s[4] = a, s[5] = c) : c = s[5], c;
}, ku = () => {
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
          const d = [];
          if (u) for (const h of u) try {
            h(c, l);
          } catch (m) {
            const p = m;
            d.push(p);
          }
          if (r.size > 0) {
            const h = {
              event: a,
              payload: c
            };
            for (const m of r) try {
              m(h, l);
            } catch (p) {
              const v = p;
              d.push(v);
            }
          }
          if (d.length > 0) {
            if (d.length === 1) throw d[0];
            for (const h of d) console.error(h);
            throw new AggregateError(d, "Errors occurred during event emission");
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
}, Pu = oe(ku), Ri = (t) => me(() => t, t), $u = ({ element: t, emit: e, clientRef: s }) => {
  const { methods: n, state: r } = Au({
    clientRef: s,
    emit: e
  }, function() {
    return qt(t);
  });
  return me(() => ({
    state: r,
    methods: n
  }), [n, r]);
}, Ou = ({ element: t, notifications: e, clientRef: s, name: n }) => {
  const r = Xl(function() {
    return $u({
      element: t,
      emit: e.emit,
      clientRef: s
    });
  });
  return K(() => r.subscribe(e.notifySubscribers), [r, e]), me(() => {
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
}, Nu = oe(Ou), Bu = () => {
  const t = w(2);
  let e;
  t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (e = [], t[0] = e) : e = t[0];
  let s;
  return t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = {
    clients: e,
    subscribe: void 0,
    on: void 0
  }, t[1] = s) : s = t[1], s;
}, Fu = oe(Bu), Lu = (t) => {
  const e = w(14), { clients: s, clientRef: n } = t;
  let r;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (r = Pu(), e[0] = r) : r = e[0];
  const o = Fe(r);
  let i;
  e[1] !== n.parent || e[2] !== o.notifySubscribers ? (i = () => n.parent.subscribe(o.notifySubscribers), e[1] = n.parent, e[2] = o.notifySubscribers, e[3] = i) : i = e[3];
  let a;
  e[4] !== n || e[5] !== o ? (a = [n, o], e[4] = n, e[5] = o, e[6] = a) : a = e[6], K(i, a);
  let c;
  e[7] !== n || e[8] !== s || e[9] !== o ? (c = Object.keys(s).map((d) => Se(d, Nu({
    element: s[d],
    notifications: o,
    clientRef: n,
    name: d
  }))), e[7] = n, e[8] = s, e[9] = o, e[10] = c) : c = e[10];
  const l = Ri(xs(c));
  let u;
  return e[11] !== o || e[12] !== l ? (u = {
    notifications: o,
    results: l
  }, e[11] = o, e[12] = l, e[13] = u) : u = e[13], u;
}, Vu = (t) => {
  const { clientRef: e } = t, { notifications: s, results: n } = Lu(t);
  return me(() => ({
    clients: n,
    subscribe: s.subscribe,
    on: function(r, o) {
      if (!this) throw new Error("const { on } = useAui() is not supported. Use aui.on() instead.");
      const { scope: i, event: a } = Ii(r);
      if (i !== "*" && this[i].source === null)
        throw new Error(`Scope "${i}" is not available. Use { scope: "*", event: "${a}" } to listen globally.`);
      const c = s.on(a, (u, d) => {
        if (i === "*") {
          o(u);
          return;
        }
        const h = this[i]();
        h === d[fu(h)] && o(u);
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
}, qu = oe(Vu), ju = ({ element: t, clientRef: e, name: s }) => {
  const n = he(t.args[0]);
  return n.current = t.args[0], me(() => {
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
}, Uu = oe(ju), Hu = (t, e) => {
  let s;
  try {
    const n = {};
    for (const r of Object.keys(e.query).sort()) n[r] = e.query[r];
    s = JSON.stringify(n);
  } catch {
    s = String(e.query);
  }
  return `${t}::${e.source}::${s}`;
}, zu = (t) => {
  const e = w(3), { clients: s, clientRef: n } = t;
  let r;
  return e[0] !== n || e[1] !== s ? (r = Object.keys(s).map((o) => {
    const i = o, a = s[i];
    return Se(Hu(i, a.args[0]), Uu({
      element: a,
      clientRef: n,
      name: i
    }));
  }), e[0] = n, e[1] = s, e[2] = r) : r = e[2], Ri(xs(r));
}, Gu = (t) => {
  const e = w(3), { rootClients: s, clientRef: n } = t;
  let r;
  return e[0] !== n || e[1] !== s ? (r = Object.keys(s).length > 0 ? qu({
    clients: s,
    clientRef: n
  }) : Fu(), e[0] = n, e[1] = s, e[2] = r) : r = e[2], Fe(r);
}, Wu = ({ parent: t, clients: e }) => {
  const { rootClients: s, derivedClients: n } = Du(e, t), r = he({
    parent: t,
    current: null
  }).current;
  K(() => {
    r.current = a;
  });
  const o = Gu({
    rootClients: s,
    clientRef: r
  }), i = zu({
    clients: n,
    clientRef: r
  }), a = me(() => {
    const c = t === Ts ? Iu() : t, l = Object.create(c);
    Object.assign(l, {
      subscribe: o.subscribe ?? t.subscribe,
      on: o.on ?? t.on,
      [kt]: _i(l)
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
}, Yu = (t) => {
  const { value: e, effects: s } = nu(function() {
    return Wu(t);
  });
  return e[wi] = s, e;
};
function re(t, { parent: e } = { parent: Si() }) {
  if (t) return Yu({
    parent: e ?? Ts,
    clients: t
  });
  if (e === null) throw new Error("received null parent, this usage is not allowed");
  return e;
}
const M = (t) => {
  const e = w(6), s = re();
  let n;
  e[0] !== s ? (n = wu(s), e[0] = s, e[1] = n) : n = e[1];
  const r = n;
  let o, i;
  e[2] !== r || e[3] !== t ? (o = () => t(r), i = () => t(r), e[2] = r, e[3] = t, e[4] = o, e[5] = i) : (o = e[4], i = e[5]);
  const a = zn(s.subscribe, o, i);
  if (a === r) throw new Error("You tried to return the entire AssistantState. This is not supported due to technical limitations.");
  return Ol(a), a;
}, Ju = (t) => {
  const e = re(), s = he(!1), n = s.current ? null : t(e);
  return M(() => s.current ? t(e) : n), () => (s.current = !0, t(e));
}, Qu = Object.freeze({});
function Cs(t) {
  const e = w(3), { getItemState: s, children: n } = t, r = Ju(s);
  let o;
  return e[0] !== n || e[1] !== r ? (o = n(r), e[0] = n, e[1] = r, e[2] = o) : o = e[2], Xu(o);
}
const Xu = (t) => {
  const e = typeof t == "object" && t != null && "type" in t ? t : null, s = e?.type, n = e?.key;
  return me(() => e, [
    s,
    n,
    typeof e?.props == "object" && e.props != null && Object.entries(e.props).length === 0 ? Qu : e?.props
  ]) ?? t;
}, Zu = De.createContext(!0);
function Rr() {
  throw new Error("A function wrapped in useEffectEvent can't be called during rendering.");
}
const Ku = "use" in De ? () => {
  try {
    return De.use(Zu);
  } catch {
    return !1;
  }
} : () => !1;
function ed(t) {
  const e = De.useRef(Rr);
  return De.useInsertionEffect(() => {
    e.current = t;
  }, [t]), (...s) => {
    Ku() && Rr();
    const n = e.current;
    return n(...s);
  };
}
const ms = (t, e) => {
  const s = w(11), n = re(), r = ed(e);
  let o;
  s[0] !== t ? (o = Ii(t), s[0] = t, s[1] = o) : o = s[1];
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
  ], s[7] = n, s[8] = a, s[9] = i, s[10] = l) : l = s[10], K(c, l);
}, td = (t) => {
  if (t.key === void 0) throw new Error("useClientLookup: Element has no key");
  return t.key;
};
function Ke(t) {
  const e = w(15);
  let s;
  e[0] !== t ? (s = t.map(rd), e[0] = t, e[1] = s) : s = e[1];
  const n = xs(s);
  let r;
  e[2] !== n ? (r = Object.keys(n), e[2] = n, e[3] = r) : r = e[3];
  const o = r;
  let i;
  e[4] !== n ? (i = n.reduce(nd, {}), e[4] = n, e[5] = i) : i = e[5];
  const a = i;
  let c;
  e[6] !== n ? (c = n.map(sd), e[6] = n, e[7] = c) : c = e[7];
  const l = c;
  let u;
  e[8] !== a || e[9] !== o || e[10] !== n ? (u = (h) => {
    if ("index" in h) {
      if (h.index < 0 || o.length === 0) throw new Error(`useClientLookup: Index ${h.index} out of bounds (length: ${o.length})`);
      const p = Math.min(h.index, o.length - 1);
      return p !== h.index && console.warn(`useClientLookup: Clamped stale index ${h.index} to ${p} (length: ${o.length})`), n[p].methods;
    }
    const m = a[h.key];
    if (m === void 0) throw new Error(`useClientLookup: Key "${h.key}" not found`);
    return n[m].methods;
  }, e[8] = a, e[9] = o, e[10] = n, e[11] = u) : u = e[11];
  let d;
  return e[12] !== l || e[13] !== u ? (d = {
    state: l,
    get: u
  }, e[12] = l, e[13] = u, e[14] = d) : d = e[14], d;
}
function sd(t) {
  return t.state;
}
function nd(t, e, s) {
  return t[e.key] = s, t;
}
function rd(t) {
  return Se(td(t), yu(t), t.deps);
}
const Ai = (t) => {
  const e = w(15), { toolkit: s, mcpApp: n } = t;
  let r;
  e[0] !== n ? (r = n ? [Se("mcpApp", n)] : [], e[0] = n, e[1] = r) : r = e[1];
  const o = xs(r)[0], [i, a] = de(id);
  let c;
  e[2] !== i ? (c = Object.fromEntries(Object.entries(i).map(cd)), e[2] = i, e[3] = c) : c = e[3];
  let l;
  e[4] !== o || e[5] !== c || e[6] !== i ? (l = {
    toolUIs: i,
    mcpApp: o,
    tools: c
  }, e[4] = o, e[5] = c, e[6] = i, e[7] = l) : l = e[7];
  const u = l, d = Ei();
  let h;
  e[8] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (h = (C, I, E) => {
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
  }, e[8] = h) : h = e[8];
  const m = h;
  let p, v;
  e[9] !== d || e[10] !== s ? (p = () => {
    if (!s) return;
    const C = [];
    for (const [E, b] of Object.entries(s)) {
      const y = "render" in b ? b.render : void 0, T = "renderText" in b ? b.renderText : void 0, x = y ?? (T ? mu(T) : void 0);
      x && C.push(m(E, x, { standalone: du(b) }));
    }
    const I = Object.entries(s).reduce(ld, {});
    return C.push(d.current.modelContext().register({ getModelContext: () => ({ tools: I }) })), () => {
      C.forEach(ud);
    };
  }, v = [
    s,
    m,
    d
  ], e[9] = d, e[10] = s, e[11] = p, e[12] = v) : (p = e[11], v = e[12]), K(p, v);
  let _;
  return e[13] !== u ? (_ = {
    getState: () => u,
    setToolUI: m
  }, e[13] = u, e[14] = _) : _ = e[14], _;
}, od = oe(Ai);
xi(Ai, (t, e) => {
  !t.modelContext && e.modelContext.source === null && (t.modelContext = gi());
});
function id() {
  return {};
}
function ad(t) {
  return t.render;
}
function cd(t) {
  const [e, s] = t;
  return [e, s.map(ad)];
}
function ld(t, e) {
  const [s, n] = e;
  if (n.type === "mcp") return t;
  const { display: r, render: o, renderText: i, ...a } = n;
  return t[s] = a, t;
}
function ud(t) {
  return t();
}
const it = (t) => zn(t.subscribe, t.getState), dd = (t) => {
  const e = w(8), { runtime: s } = t, n = it(s);
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
}, Mi = oe(dd), hd = (t) => {
  const e = w(5), { runtime: s, index: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getAttachmentByIndex(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const o = r;
  let i;
  return e[3] !== o ? (i = Mi({ runtime: o }), e[3] = o, e[4] = i) : i = e[4], Fe(i);
}, md = oe(hd), fd = ({ item: t, onSteer: e, onRemove: s }) => ({
  getState: () => t,
  steer: e,
  remove: s
}), pd = oe(fd), gd = (t) => {
  const e = w(55), { threadIdRef: s, messageIdRef: n, runtime: r } = t, o = it(r), i = Jn();
  let a, c;
  e[0] !== i || e[1] !== n || e[2] !== r || e[3] !== s ? (a = () => {
    const x = [];
    for (const S of ["send", "attachmentAdd"]) {
      const q = r.unstable_on(S, () => {
        i(`composer.${S}`, {
          threadId: s.current,
          ...n && { messageId: n.current }
        });
      });
      x.push(q);
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
  ], e[0] = i, e[1] = n, e[2] = r, e[3] = s, e[4] = a, e[5] = c) : (a = e[4], c = e[5]), K(a, c);
  let l;
  if (e[6] !== r || e[7] !== o.attachments) {
    let x;
    e[9] !== r ? (x = (S, q) => Se(S.id, md({
      runtime: r,
      index: q
    }), [r, q]), e[9] = r, e[10] = x) : x = e[10], l = o.attachments.map(x), e[6] = r, e[7] = o.attachments, e[8] = l;
  } else l = e[8];
  const u = Ke(l), d = o.queue;
  let h;
  if (e[11] !== d || e[12] !== r) {
    let x;
    e[14] !== r ? (x = (S) => Se(S.id, pd({
      item: S,
      onSteer: () => r.steerQueueItem(S.id),
      onRemove: () => r.removeQueueItem(S.id)
    })), e[14] = r, e[15] = x) : x = e[15], h = d.map(x), e[11] = d, e[12] = r, e[13] = h;
  } else h = e[13];
  const m = Ke(h), p = o.type ?? "thread";
  let v;
  e[16] !== u.state || e[17] !== d || e[18] !== o.attachmentAccept || e[19] !== o.canCancel || e[20] !== o.canSend || e[21] !== o.dictation || e[22] !== o.isEditing || e[23] !== o.isEmpty || e[24] !== o.quote || e[25] !== o.role || e[26] !== o.runConfig || e[27] !== o.text || e[28] !== p ? (v = {
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
    queue: d
  }, e[16] = u.state, e[17] = d, e[18] = o.attachmentAccept, e[19] = o.canCancel, e[20] = o.canSend, e[21] = o.dictation, e[22] = o.isEditing, e[23] = o.isEmpty, e[24] = o.quote, e[25] = o.role, e[26] = o.runConfig, e[27] = o.text, e[28] = p, e[29] = v) : v = e[29];
  const _ = v;
  let C;
  e[30] !== _ ? (C = () => _, e[30] = _, e[31] = C) : C = e[31];
  const I = r.beginEdit ?? bd;
  let E;
  e[32] !== u ? (E = (x) => "id" in x ? u.get({ key: x.id }) : u.get(x), e[32] = u, e[33] = E) : E = e[33];
  let b;
  e[34] !== m ? (b = (x) => m.get(x), e[34] = m, e[35] = b) : b = e[35];
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
}, Di = oe(gd);
function bd() {
  throw new Error("beginEdit is not supported in this runtime");
}
const ki = (t) => ({ get current() {
  return t();
} }), _d = (t) => {
  const e = w(13), { runtime: s } = t, n = it(s);
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
}, vd = oe(_d), yd = (t) => {
  const e = w(5), { runtime: s, index: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getAttachmentByIndex(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const o = r;
  let i;
  return e[3] !== o ? (i = Mi({ runtime: o }), e[3] = o, e[4] = i) : i = e[4], Fe(i);
}, wd = oe(yd), Sd = (t) => {
  const e = w(5), { runtime: s, index: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getMessagePartByIndex(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const o = r;
  let i;
  return e[3] !== o ? (i = vd({ runtime: o }), e[3] = o, e[4] = i) : i = e[4], Fe(i);
}, xd = oe(Sd), Id = (t) => {
  const e = w(55), { runtime: s, threadIdRef: n } = t, r = it(s), [o, i] = de(!1), [a, c] = de(!1);
  let l;
  e[0] !== s ? (l = ki(() => s.getState().id), e[0] = s, e[1] = l) : l = e[1];
  const u = l;
  let d;
  e[2] !== u || e[3] !== s.composer || e[4] !== n ? (d = Di({
    runtime: s.composer,
    threadIdRef: n,
    messageIdRef: u
  }), e[2] = u, e[3] = s.composer, e[4] = n, e[5] = d) : d = e[5];
  const h = qt(d);
  let m;
  if (e[6] !== s || e[7] !== r.content) {
    let j;
    e[9] !== s ? (j = (ee, Z) => Se("toolCallId" in ee && ee.toolCallId != null ? `toolCallId-${ee.toolCallId}` : `index-${Z}`, xd({
      runtime: s,
      index: Z
    }), [s, Z]), e[9] = s, e[10] = j) : j = e[10], m = r.content.map(j), e[6] = s, e[7] = r.content, e[8] = m;
  } else m = e[8];
  const p = Ke(m);
  let v;
  e[11] !== r.attachments ? (v = r.attachments ?? [], e[11] = r.attachments, e[12] = v) : v = e[12];
  let _;
  if (e[13] !== s || e[14] !== v) {
    let j;
    e[16] !== s ? (j = (ee, Z) => Se(ee.id, wd({
      runtime: s,
      index: Z
    }), [s, Z]), e[16] = s, e[17] = j) : j = e[17], _ = v.map(j), e[13] = s, e[14] = v, e[15] = _;
  } else _ = e[15];
  const C = Ke(_), I = r;
  let E;
  e[18] !== h.state || e[19] !== o || e[20] !== a || e[21] !== p.state || e[22] !== I ? (E = {
    ...I,
    parts: p.state,
    composer: h.state,
    isCopied: o,
    isHovering: a
  }, e[18] = h.state, e[19] = o, e[20] = a, e[21] = p.state, e[22] = I, e[23] = E) : E = e[23];
  const b = E;
  let y;
  e[24] !== b ? (y = () => b, e[24] = b, e[25] = y) : y = e[25];
  let T;
  e[26] !== h.methods ? (T = () => h.methods, e[26] = h.methods, e[27] = T) : T = e[27];
  let x, S, q, P, z, Q, L;
  e[28] !== s ? (x = () => s.delete(), S = (j) => s.reload(j), q = () => s.speak(), P = () => s.stopSpeaking(), z = (j) => s.submitFeedback(j), Q = (j) => s.switchToBranch(j), L = () => s.unstable_getCopyText(), e[28] = s, e[29] = x, e[30] = S, e[31] = q, e[32] = P, e[33] = z, e[34] = Q, e[35] = L) : (x = e[29], S = e[30], q = e[31], P = e[32], z = e[33], Q = e[34], L = e[35]);
  let B;
  e[36] !== p ? (B = (j) => "index" in j ? p.get({ index: j.index }) : p.get({ key: `toolCallId-${j.toolCallId}` }), e[36] = p, e[37] = B) : B = e[37];
  let te;
  e[38] !== C ? (te = (j) => "id" in j ? C.get({ key: j.id }) : C.get(j), e[38] = C, e[39] = te) : te = e[39];
  let ce;
  e[40] !== s ? (ce = () => s, e[40] = s, e[41] = ce) : ce = e[41];
  let V;
  return e[42] !== x || e[43] !== S || e[44] !== q || e[45] !== P || e[46] !== z || e[47] !== Q || e[48] !== L || e[49] !== B || e[50] !== te || e[51] !== ce || e[52] !== y || e[53] !== T ? (V = {
    getState: y,
    composer: T,
    delete: x,
    reload: S,
    speak: q,
    stopSpeaking: P,
    submitFeedback: z,
    switchToBranch: Q,
    getCopyText: L,
    part: B,
    attachment: te,
    setIsCopied: i,
    setIsHovering: c,
    __internal_getRuntime: ce
  }, e[42] = x, e[43] = S, e[44] = q, e[45] = P, e[46] = z, e[47] = Q, e[48] = L, e[49] = B, e[50] = te, e[51] = ce, e[52] = y, e[53] = T, e[54] = V) : V = e[54], V;
}, Td = oe(Id), Cd = (t) => {
  const e = w(6), { runtime: s, id: n, threadIdRef: r } = t;
  let o;
  e[0] !== n || e[1] !== s ? (o = s.getMessageById(n), e[0] = n, e[1] = s, e[2] = o) : o = e[2];
  const i = o;
  let a;
  return e[3] !== i || e[4] !== r ? (a = Td({
    runtime: i,
    threadIdRef: r
  }), e[3] = i, e[4] = r, e[5] = a) : a = e[5], Fe(a);
}, Ed = oe(Cd), Rd = (t) => {
  const e = w(59), { runtime: s } = t, n = it(s), r = Jn();
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
  }, i = [s, r], e[0] = r, e[1] = s, e[2] = o, e[3] = i) : (o = e[2], i = e[3]), K(o, i);
  let a;
  e[4] !== s ? (a = ki(() => s.getState().threadId), e[4] = s, e[5] = a) : a = e[5];
  const c = a;
  let l;
  e[6] !== s.composer || e[7] !== c ? (l = Di({
    runtime: s.composer,
    threadIdRef: c
  }), e[6] = s.composer, e[7] = c, e[8] = l) : l = e[8];
  const u = qt(l);
  let d;
  if (e[9] !== s || e[10] !== n.messages || e[11] !== c) {
    let y;
    e[13] !== s || e[14] !== c ? (y = (T) => Se(T.id, Ed({
      runtime: s,
      id: T.id,
      threadIdRef: c
    }), [
      s,
      T.id,
      c
    ]), e[13] = s, e[14] = c, e[15] = y) : y = e[15], d = n.messages.map(y), e[9] = s, e[10] = n.messages, e[11] = c, e[12] = d;
  } else d = e[12];
  const h = Ke(d), m = h.state.length === 0 && !n.isLoading;
  let p;
  e[16] !== u.state || e[17] !== h.state || e[18] !== n.capabilities || e[19] !== n.extras || e[20] !== n.isDisabled || e[21] !== n.isLoading || e[22] !== n.isRunning || e[23] !== n.speech || e[24] !== n.state || e[25] !== n.suggestions || e[26] !== n.voice || e[27] !== m ? (p = {
    isEmpty: m,
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
    messages: h.state
  }, e[16] = u.state, e[17] = h.state, e[18] = n.capabilities, e[19] = n.extras, e[20] = n.isDisabled, e[21] = n.isLoading, e[22] = n.isRunning, e[23] = n.speech, e[24] = n.state, e[25] = n.suggestions, e[26] = n.voice, e[27] = m, e[28] = p) : p = e[28];
  const v = p;
  let _;
  e[29] !== v ? (_ = () => v, e[29] = v, e[30] = _) : _ = e[30];
  let C;
  e[31] !== u.methods ? (C = () => u.methods, e[31] = u.methods, e[32] = C) : C = e[32];
  let I;
  e[33] !== h ? (I = (y) => "id" in y ? h.get({ key: y.id }) : h.get(y), e[33] = h, e[34] = I) : I = e[34];
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
}, Ad = oe(Rd), Md = (t) => {
  const e = w(20), { runtime: s } = t, n = it(s), r = Jn();
  let o, i;
  e[0] !== r || e[1] !== s ? (o = () => {
    const u = [];
    for (const d of ["switchedTo", "switchedAway"]) {
      const h = s.unstable_on(d, () => {
        r(`threadListItem.${d}`, { threadId: s.getState().id });
      });
      u.push(h);
    }
    return () => {
      for (const d of u) d();
    };
  }, i = [s, r], e[0] = r, e[1] = s, e[2] = o, e[3] = i) : (o = e[2], i = e[3]), K(o, i);
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
}, Dd = oe(Md), kd = (t) => {
  const e = w(5), { runtime: s, id: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getItemById(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const o = r;
  let i;
  return e[3] !== o ? (i = Dd({ runtime: o }), e[3] = o, e[4] = i) : i = e[4], Fe(i);
}, Pd = oe(kd), $d = (t) => {
  const e = w(40), { runtime: s, __internal_assistantRuntime: n } = t, r = it(s);
  let o;
  e[0] !== s.main ? (o = Ad({ runtime: s.main }), e[0] = s.main, e[1] = o) : o = e[1];
  const i = qt(o);
  let a;
  e[2] !== s || e[3] !== r.threadItems ? (a = Object.keys(r.threadItems).map((T) => Se(T, Pd({
    runtime: s,
    id: T
  }), [s, T])), e[2] = s, e[3] = r.threadItems, e[4] = a) : a = e[4];
  const c = Ke(a), l = r.newThreadId ?? null;
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
  const d = u;
  let h;
  e[15] !== d ? (h = () => d, e[15] = d, e[16] = h) : h = e[16];
  let m;
  e[17] !== i.methods ? (m = () => i.methods, e[17] = i.methods, e[18] = m) : m = e[18];
  let p;
  e[19] !== d || e[20] !== c ? (p = (T) => {
    if (T === "main") return c.get({ key: d.mainThreadId });
    if ("id" in T) return c.get({ key: T.id });
    const { index: x, archived: S } = T, q = S !== void 0 && S ? d.archivedThreadIds[x] : d.threadIds[x];
    return c.get({ key: q });
  }, e[19] = d, e[20] = c, e[21] = p) : p = e[21];
  let v, _, C, I, E;
  e[22] !== s ? (I = async (T, x) => {
    await s.switchToThread(T, x);
  }, E = async () => {
    await s.switchToNewThread();
  }, v = () => s.getLoadThreadsPromise(), _ = () => s.reload(), C = () => s.loadMore(), e[22] = s, e[23] = v, e[24] = _, e[25] = C, e[26] = I, e[27] = E) : (v = e[23], _ = e[24], C = e[25], I = e[26], E = e[27]);
  let b;
  e[28] !== n ? (b = () => n, e[28] = n, e[29] = b) : b = e[29];
  let y;
  return e[30] !== v || e[31] !== _ || e[32] !== C || e[33] !== b || e[34] !== h || e[35] !== m || e[36] !== p || e[37] !== I || e[38] !== E ? (y = {
    getState: h,
    thread: m,
    item: p,
    switchToThread: I,
    switchToNewThread: E,
    getLoadThreadsPromise: v,
    reload: _,
    loadMore: C,
    __internal_getAssistantRuntime: b
  }, e[30] = v, e[31] = _, e[32] = C, e[33] = b, e[34] = h, e[35] = m, e[36] = p, e[37] = I, e[38] = E, e[39] = y) : y = e[39], y;
}, Od = oe($d), Nd = (t) => ({ getState: () => t }), Bd = oe(Nd), Fd = (t) => {
  const e = w(11);
  let s;
  e[0] !== t ? (s = () => ({ suggestions: (t ?? []).map(Vd) }), e[0] = t, e[1] = s) : s = e[1];
  const [n] = de(s);
  let r;
  e[2] !== n.suggestions ? (r = n.suggestions.map(qd), e[2] = n.suggestions, e[3] = r) : r = e[3];
  const o = Ke(r);
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
}, Ld = oe(Fd);
function Vd(t) {
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
function qd(t, e) {
  return Se(e, Bd(t), [t]);
}
const jd = (t, e) => {
  t.thread ??= Ae({
    source: "threads",
    query: { type: "main" },
    get: (s) => s.threads().thread("main")
  }), t.threadListItem ??= Ae({
    source: "threads",
    query: { type: "main" },
    get: (s) => s.threads().item("main")
  }), t.composer ??= Ae({
    source: "thread",
    query: {},
    get: (s) => s.threads().thread("main").composer()
  }), !t.modelContext && e.modelContext.source === null && (t.modelContext = gi()), !t.suggestions && e.suggestions.source === null && (t.suggestions = Ld());
}, Pi = (t) => {
  const e = w(6), s = Ei();
  let n, r;
  e[0] !== s || e[1] !== t ? (n = () => t.registerModelContextProvider(s.current.modelContext()), r = [t, s], e[0] = s, e[1] = t, e[2] = n, e[3] = r) : (n = e[2], r = e[3]), K(n, r);
  let o;
  return e[4] !== t ? (o = Od({
    runtime: t.threads,
    __internal_assistantRuntime: t
  }), e[4] = t, e[5] = o) : o = e[5], Fe(o);
}, Ud = oe(Pi);
xi(Pi, (t, e) => {
  jd(t, e), !t.tools && e.tools.source === null && (t.tools = od({})), !t.dataRenderers && e.dataRenderers.source === null && (t.dataRenderers = ou());
});
const Hd = (t) => t._core?.RenderComponent, zd = _e(({ runtime: t, aui: e = null, children: s }) => {
  "use no memo";
  const n = re({ threads: Ud(t) }, { parent: e }), r = Hd(t), o = /* @__PURE__ */ F(Ne, {
    value: n,
    children: [r && /* @__PURE__ */ f(r, {}), s]
  });
  return e ? /* @__PURE__ */ f(Ne, {
    value: e,
    children: o
  }) : o;
});
function be(t) {
  return t != null && typeof t == "object" && !Array.isArray(t);
}
function fs(t, e = 0) {
  return e > 100 ? !1 : t === null || typeof t == "string" || typeof t == "boolean" ? !0 : typeof t == "number" ? !Number.isNaN(t) && Number.isFinite(t) : Array.isArray(t) ? t.every((s) => fs(s, e + 1)) : be(t) ? Object.entries(t).every(([s, n]) => typeof s == "string" && fs(n, e + 1)) : !1;
}
const Gd = 100, Ks = (t, e, s) => {
  if (t === e) return !0;
  if (s > Gd || t == null || e == null) return !1;
  if (Array.isArray(t))
    return !Array.isArray(e) || t.length !== e.length ? !1 : t.every((o, i) => Ks(o, e[i], s + 1));
  if (Array.isArray(e) || !be(t) || !be(e)) return !1;
  const n = Object.keys(t), r = Object.keys(e);
  return n.length !== r.length ? !1 : n.every((o) => Object.hasOwn(e, o) && Ks(t[o], e[o], s + 1));
}, Qn = (t, e) => !fs(t) || !fs(e) ? !1 : Ks(t, e, 0);
function Wd(t) {
  const e = t.metadata;
  if (!e || typeof e != "object") return;
  const s = e.custom;
  if (!s || typeof s != "object") return;
  const n = s.interactables;
  return Array.isArray(n) ? n : void 0;
}
function Yd(t) {
  return `update_${t.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}
const Ar = (t) => {
  if (!be(t)) return;
  const e = t.id;
  return typeof e == "string" || typeof e == "number" ? e : void 0;
};
function Jd(t, e, s) {
  let n = Array.isArray(e.set) ? [...e.set] : [...t];
  if (e.clear === !0 && (n = []), Array.isArray(e.remove) && e.remove.length > 0) {
    const o = new Set(e.remove);
    n = n.filter((i) => {
      const a = Ar(i);
      return a !== void 0 ? !o.has(a) : !o.has(i);
    });
  }
  const r = e.update;
  if (Array.isArray(r) && r.length > 0 && (n = n.map((o) => {
    const i = Ar(o);
    if (i === void 0 || !be(o)) return o;
    const a = r.find((c) => be(c) && c.id === i);
    return a ? {
      ...o,
      ...a
    } : o;
  })), Array.isArray(e.add) && e.add.length > 0) {
    const o = s ? e.add.map((i) => {
      if (!be(i) || i.id !== void 0) return i;
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
function $s(t, e, s) {
  if (!be(t) || !be(e)) return e;
  const n = be(s?.arrayBaseline) ? s.arrayBaseline : t, r = { ...t };
  for (const [o, i] of Object.entries(e)) {
    const a = n[o];
    Array.isArray(a) && be(i) ? r[o] = Jd(a, i, s?.idFactory && (s.idKeyedFields === void 0 || s.idKeyedFields.has(o)) ? () => s.idFactory?.(o) : void 0) : r[o] = i;
  }
  return r;
}
function Qd(t, e) {
  if (!be(t) || !be(e)) return;
  for (const r of Object.keys(t)) if (!(r in e)) return;
  const s = {};
  for (const [r, o] of Object.entries(e)) (!(r in t) || !Qn(t[r], o)) && (s[r] = o);
  const n = Object.keys(s).length;
  if (!(n === 0 || n === Object.keys(e).length))
    return s;
}
const Xd = (t) => {
  if (!t || typeof t != "object") return;
  const e = t;
  return e.type === "tool-call" ? e : void 0;
}, Zd = (t, e) => {
  if (!t.args || typeof t.args != "object") return !1;
  const s = be(t.result) ? t.result : void 0;
  if (s?.success === !1) return !1;
  if (typeof s?.id == "string") return s.id === e;
  const n = t.args.id;
  return n === e || n === void 0;
}, Kd = (t) => {
  const e = be(t) ? t.addedItemIds : void 0;
  if (!be(e)) return;
  const s = /* @__PURE__ */ new Map();
  for (const [n, r] of Object.entries(e)) {
    if (!Array.isArray(r)) continue;
    const o = r.filter((i) => typeof i == "string");
    o.length > 0 && s.set(n, o);
  }
  if (s.size !== 0)
    return (n) => s.get(n)?.shift();
}, Mr = /* @__PURE__ */ new WeakMap();
function eh(t, e, s) {
  let n = Mr.get(t);
  n || (n = /* @__PURE__ */ new Map(), Mr.set(t, n));
  let r = n.get(s);
  r || (r = /* @__PURE__ */ new Map(), n.set(s, r));
  const o = r.get(e);
  if (o) return o;
  const i = Yd(s), a = [], c = () => a[a.length - 1];
  for (const l of t) {
    if (l.role === "user") {
      const u = Wd(l)?.find((d) => d.id === e);
      if (!u) continue;
      if (u.partial) {
        const d = c();
        d && a.push({
          state: $s(d.state, u.state),
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
        const d = Xd(u);
        if (d) {
          if (d.toolCallId === e && d.toolName === s)
            d.args && typeof d.args == "object" && a.push({
              state: d.args,
              origin: "create",
              toolCallId: e
            });
          else if (d.toolName === i && Zd(d, e)) {
            const h = c();
            if (h) {
              const { id: m, ...p } = d.args, v = Kd(d.result);
              a.push({
                state: v ? $s(h.state, p, { idFactory: v }) : $s(h.state, p),
                origin: "update",
                toolCallId: d.toolCallId
              });
            }
          }
        }
      }
  }
  return r.set(e, a), a;
}
function th(t, e, s) {
  const n = eh(t, e, s), r = n[n.length - 1];
  return r ? { state: r.state } : void 0;
}
function $i(t, e) {
  if (!t) return;
  const { interactables: s, ...n } = t, r = { ...n };
  if (Array.isArray(s)) {
    const o = [];
    for (const i of s) {
      const a = th(e, i.id, i.name);
      if (!a) {
        o.push({
          id: i.id,
          name: i.name,
          state: i.state
        });
        continue;
      }
      if (Qn(i.state, a.state)) continue;
      const c = Qd(a.state, i.state);
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
const Xn = () => {
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
}, sh = () => {
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
        return o = Xn(), t.forEach((c) => {
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
var Dr = class {
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
const Oi = (t, e = {}) => new ReadableStream({
  start(s) {
    return t.start?.(new Dr(s, e));
  },
  pull(s) {
    return t.pull?.(new Dr(s, e));
  },
  cancel(s) {
    return t.cancel?.(s);
  }
}), kr = (t = {}) => {
  let e;
  return [Oi({ start(s) {
    e = s;
  } }, t), e];
}, Pr = /* @__PURE__ */ Symbol.for("aui.tool-response"), en = "<no result>";
var Oe = class tn {
  get [Pr]() {
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
    this.result = s === void 0 ? en : s, this.isError = e.isError ?? !1, e.modelContent !== void 0 && (this.modelContent = e.modelContent), e.messages !== void 0 && (this.messages = e.messages);
  }
  static [Symbol.hasInstance](e) {
    return typeof e == "object" && e !== null && Pr in e;
  }
  /**
  * Converts a plain tool return value into a {@link ToolResponse}.
  *
  * Existing `ToolResponse` instances are returned unchanged. `undefined`
  * becomes the string `"<no result>"` so downstream protocol chunks always
  * carry a concrete result.
  */
  static toResponse(e) {
    return e instanceof tn ? e : new tn({ result: e === void 0 ? en : e });
  }
}, $r = class {
  _isClosed = !1;
  _mergeTask;
  _controller;
  constructor(t) {
    this._controller = t;
    const e = Oi({ start: (n) => {
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
      result: e === void 0 ? en : e,
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
const nh = (t) => new ReadableStream({
  start(e) {
    return t.start?.(new $r(e));
  },
  pull(e) {
    return t.pull?.(new $r(e));
  },
  cancel(e) {
    return t.cancel?.(e);
  }
}), rh = () => {
  let t;
  return [nh({ start(e) {
    t = e;
  } }), t];
};
var Ni = class {
  value = -1;
  up() {
    return ++this.value;
  }
}, oh = class extends TransformStream {
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
var ih = class extends TransformStream {
  constructor(t) {
    const e = new Ni(), s = /* @__PURE__ */ new Map();
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
}, ah = class extends TransformStream {
  constructor(t) {
    super();
    const e = t(super.readable);
    Object.defineProperty(this, "readable", {
      value: e,
      writable: !1
    });
  }
}, ze = { exports: {} }, Or;
function ch() {
  if (Or) return ze.exports;
  Or = 1;
  const t = typeof Buffer < "u", e = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/, s = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
  function n(a, c, l) {
    l == null && c !== null && typeof c == "object" && (l = c, c = void 0), t && Buffer.isBuffer(a) && (a = a.toString()), a && a.charCodeAt(0) === 65279 && (a = a.slice(1));
    const u = JSON.parse(a, c);
    if (u === null || typeof u != "object")
      return u;
    const d = l && l.protoAction || "error", h = l && l.constructorAction || "error";
    if (d === "ignore" && h === "ignore")
      return u;
    if (d !== "ignore" && h !== "ignore") {
      if (e.test(a) === !1 && s.test(a) === !1)
        return u;
    } else if (d !== "ignore" && h === "ignore") {
      if (e.test(a) === !1)
        return u;
    } else if (s.test(a) === !1)
      return u;
    return r(u, { protoAction: d, constructorAction: h, safe: l && l.safe });
  }
  function r(a, { protoAction: c = "error", constructorAction: l = "error", safe: u } = {}) {
    let d = [a];
    for (; d.length; ) {
      const h = d;
      d = [];
      for (const m of h) {
        if (c !== "ignore" && Object.prototype.hasOwnProperty.call(m, "__proto__")) {
          if (u === !0)
            return null;
          if (c === "error")
            throw new SyntaxError("Object contains forbidden prototype property");
          delete m.__proto__;
        }
        if (l !== "ignore" && Object.prototype.hasOwnProperty.call(m, "constructor") && m.constructor !== null && typeof m.constructor == "object" && Object.prototype.hasOwnProperty.call(m.constructor, "prototype")) {
          if (u === !0)
            return null;
          if (l === "error")
            throw new SyntaxError("Object contains forbidden prototype property");
          delete m.constructor;
        }
        for (const p in m) {
          const v = m[p];
          v && typeof v == "object" && d.push(v);
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
  return ze.exports = o, ze.exports.default = o, ze.exports.parse = o, ze.exports.safeParse = i, ze.exports.scan = r, ze.exports;
}
var lh = ch();
const sn = /* @__PURE__ */ mc(lh);
var Bi = class extends TransformStream {
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
let Fi = (t, e = 21) => (s = e) => {
  let n = "", r = s | 0;
  for (; r-- > 0; )
    n += t[Math.random() * t.length | 0];
  return n;
};
const uh = Fi("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);
var dh = class Li {
  _state;
  _parentId;
  constructor(e, s = {}) {
    this._state = e || {
      strict: s.strict ?? !0,
      merger: sh(),
      contentCounter: new Ni()
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
    }), this._state.merger.addStream(s.pipeThrough(new oh(this._state.contentCounter.value)));
  }
  merge(e) {
    this._state.merger.addStream(e.pipeThrough(new ih(this._state.contentCounter)));
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
    const [e, s] = kr({ strict: this._state.strict });
    return this._addPart(this._withParentIdOption({ type: "text" }), e), s;
  }
  addReasoningPart(e) {
    const [s, n] = kr({ strict: this._state.strict });
    return this._addPart(this._withParentIdOption({
      type: "reasoning",
      ...e
    }), s), n;
  }
  addToolCallPart(e) {
    const s = typeof e == "string" ? { toolName: e } : e, n = s.toolName, r = s.toolCallId ?? uh(), [o, i] = rh();
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
    const s = new Li(this._state);
    return s._parentId = e, s;
  }
  close() {
    this._state.append?.controller?.close(), this._state.merger.seal(), this._state.closeSubscriber?.();
  }
};
function hh(t, e = {}) {
  const s = new dh(void 0, e);
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
function mh(t = {}) {
  const { resolve: e, promise: s } = Xn();
  let n;
  return [hh((r) => (n = r, n.__internal_subscribeToClose(e), s), t), n];
}
function fh(t) {
  const e = ["ROOT"];
  let s = -1, n = null;
  const r = [];
  let o;
  function i() {
    o !== void 0 && (r.push(JSON.parse(`"${o}"`)), o = void 0);
  }
  function a(d, h, m) {
    switch (d) {
      case '"':
        s = h, e.pop(), e.push(m), e.push("INSIDE_STRING"), i();
        break;
      case "f":
      case "t":
      case "n":
        s = h, n = h, e.pop(), e.push(m), e.push("INSIDE_LITERAL");
        break;
      case "-":
        e.pop(), e.push(m), e.push("INSIDE_NUMBER"), i();
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
        s = h, e.pop(), e.push(m), e.push("INSIDE_NUMBER"), i();
        break;
      case "{":
        s = h, e.pop(), e.push(m), e.push("INSIDE_OBJECT_START"), i();
        break;
      case "[":
        s = h, e.pop(), e.push(m), e.push("INSIDE_ARRAY_START"), i();
    }
  }
  function c(d, h) {
    switch (d) {
      case ",":
        e.pop(), e.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      case "}":
        s = h, e.pop(), o = r.pop();
    }
  }
  function l(d, h) {
    switch (d) {
      case ",":
        e.pop(), e.push("INSIDE_ARRAY_AFTER_COMMA"), o = (Number(o) + 1).toString();
        break;
      case "]":
        s = h, e.pop(), o = r.pop();
    }
  }
  for (let d = 0; d < t.length; d++) {
    const h = t[d];
    switch (e[e.length - 1]) {
      case "ROOT":
        a(h, d, "FINISH");
        break;
      case "INSIDE_OBJECT_START":
        switch (h) {
          case '"':
            e.pop(), e.push("INSIDE_OBJECT_KEY"), o = "";
            break;
          case "}":
            s = d, e.pop(), o = r.pop();
        }
        break;
      case "INSIDE_OBJECT_AFTER_COMMA":
        h === '"' && (e.pop(), e.push("INSIDE_OBJECT_KEY"), o = "");
        break;
      case "INSIDE_OBJECT_KEY":
        switch (h) {
          case '"':
            e.pop(), e.push("INSIDE_OBJECT_AFTER_KEY");
            break;
          case "\\":
            e.push("INSIDE_STRING_ESCAPE"), o += h;
            break;
          default:
            o += h;
        }
        break;
      case "INSIDE_OBJECT_AFTER_KEY":
        h === ":" && (e.pop(), e.push("INSIDE_OBJECT_BEFORE_VALUE"));
        break;
      case "INSIDE_OBJECT_BEFORE_VALUE":
        a(h, d, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      case "INSIDE_OBJECT_AFTER_VALUE":
        c(h, d);
        break;
      case "INSIDE_STRING":
        switch (h) {
          case '"':
            e.pop(), s = d, o = r.pop();
            break;
          case "\\":
            e.push("INSIDE_STRING_ESCAPE");
            break;
          default:
            s = d;
        }
        break;
      case "INSIDE_ARRAY_START":
        h === "]" ? (s = d, e.pop(), o = r.pop()) : (s = d, o = "0", a(h, d, "INSIDE_ARRAY_AFTER_VALUE"));
        break;
      case "INSIDE_ARRAY_AFTER_VALUE":
        switch (h) {
          case ",":
            e.pop(), e.push("INSIDE_ARRAY_AFTER_COMMA"), o = (Number(o) + 1).toString();
            break;
          case "]":
            s = d, e.pop(), o = r.pop();
            break;
          default:
            s = d;
        }
        break;
      case "INSIDE_ARRAY_AFTER_COMMA":
        a(h, d, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      case "INSIDE_STRING_ESCAPE":
        e.pop(), e[e.length - 1] === "INSIDE_STRING" ? s = d : e[e.length - 1] === "INSIDE_OBJECT_KEY" && (o += h);
        break;
      case "INSIDE_NUMBER":
        switch (h) {
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
            s = d;
            break;
          case "e":
          case "E":
          case "-":
          case ".":
            break;
          case ",":
            e.pop(), o = r.pop(), e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && l(h, d), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && c(h, d);
            break;
          case "}":
            e.pop(), o = r.pop(), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && c(h, d);
            break;
          case "]":
            e.pop(), o = r.pop(), e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && l(h, d);
            break;
          default:
            e.pop(), o = r.pop();
        }
        break;
      case "INSIDE_LITERAL": {
        const m = t.substring(n, d + 1);
        !"false".startsWith(m) && !"true".startsWith(m) && !"null".startsWith(m) ? (e.pop(), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" ? c(h, d) : e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && l(h, d)) : s = d;
        break;
      }
    }
  }
  let u = t.slice(0, s + 1);
  for (let d = e.length - 1; d >= 0; d--) switch (e[d]) {
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
      const h = t.substring(n, t.length);
      "true".startsWith(h) ? u += "true".slice(h.length) : "false".startsWith(h) ? u += "false".slice(h.length) : "null".startsWith(h) && (u += "null".slice(h.length));
    }
  }
  return [u, r];
}
const os = /* @__PURE__ */ Symbol("aui.parse-partial-json-object.meta"), ph = (t) => t?.[os], nn = (t) => {
  if (t.length === 0) return { [os]: {
    state: "partial",
    partialPath: []
  } };
  try {
    const e = sn.parse(t);
    if (typeof e != "object" || e === null) throw new Error("argsText is expected to be an object");
    return e[os] = {
      state: "complete",
      partialPath: []
    }, e;
  } catch {
    try {
      const [e, s] = fh(t), n = sn.parse(e);
      if (typeof n != "object" || n === null) throw new Error("argsText is expected to be an object");
      return n[os] = {
        state: "partial",
        partialPath: s
      }, n;
    } catch {
      return;
    }
  }
}, Vi = (t, e, s) => {
  if (typeof t != "object" || t === null) return e.state;
  if (e.state === "complete") return "complete";
  if (s.length === 0) return e.state;
  const [n, ...r] = s;
  if (!Object.hasOwn(t, n)) return "partial";
  const [o, ...i] = e.partialPath;
  if (n !== o) return "complete";
  const a = t[n];
  return Vi(a, {
    state: "partial",
    partialPath: i
  }, r);
}, bt = (t, e) => {
  const s = ph(t);
  if (!s) throw new Error("unable to determine object state");
  return Vi(t, s, e.map(String));
};
async function* gh() {
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
function Os(t) {
  return t[Symbol.asyncIterator] ??= gh, t;
}
function bh(t, e, s) {
  try {
    const n = t();
    if (typeof n == "object" && n !== null && "then" in n) return n.then(e, s);
    e(n);
  } catch (n) {
    s(n);
  }
}
function _t(t, e) {
  let s = t;
  for (const n of e) {
    if (s == null) return;
    s = s[n];
  }
  return s;
}
var _h = class {
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
        if (bt(t, this.fieldPath) === "complete") {
          const e = _t(t, this.fieldPath);
          e !== void 0 && (this.resolve(e), this.dispose());
        }
      } catch (e) {
        this.reject(e), this.dispose();
      }
  }
  end(t) {
    if (!this.disposed)
      try {
        const e = _t(t, this.fieldPath);
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
}, vh = class {
  controller;
  disposed = !1;
  fieldPath;
  constructor(t, e) {
    this.controller = t, this.fieldPath = e;
  }
  update(t) {
    if (!this.disposed)
      try {
        const e = _t(t, this.fieldPath);
        e !== void 0 && this.controller.enqueue(e), bt(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
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
}, yh = class {
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
        const e = _t(t, this.fieldPath);
        if (e !== void 0 && typeof e == "string") {
          const s = e.substring(this.lastValue?.length || 0);
          this.lastValue = e, this.controller.enqueue(s);
        }
        bt(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
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
}, wh = class {
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
        const e = _t(t, this.fieldPath);
        if (!Array.isArray(e)) return;
        for (let s = 0; s < e.length; s++) if (!this.processedIndexes.has(s)) {
          const n = [...this.fieldPath, s];
          bt(t, n) === "complete" && (this.controller.enqueue(e[s]), this.processedIndexes.add(s));
        }
        bt(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
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
}, Sh = class {
  argTextDeltas;
  handles = /* @__PURE__ */ new Set();
  args = nn("");
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
        const r = nn(t);
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
      const n = new _h(e, s, t);
      if (this.args && bt(this.args, t) === "complete") {
        const r = _t(this.args, t);
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
        s = new vh(r, e), this.finished || this.handles.add(s), s.update(this.args), this.finished && s.end();
      },
      cancel: () => {
        s && (s.dispose(), this.handles.delete(s));
      }
    });
    return Os(n);
  }
  streamText(...t) {
    const e = t;
    let s;
    const n = new ReadableStream({
      start: (r) => {
        s = new yh(r, e), this.finished || this.handles.add(s), s.update(this.args), this.finished && s.end();
      },
      cancel: () => {
        s && (s.dispose(), this.handles.delete(s));
      }
    });
    return Os(n);
  }
  forEach(...t) {
    const e = t;
    let s;
    const n = new ReadableStream({
      start: (r) => {
        s = new wh(r, e), this.finished || this.handles.add(s), s.update(this.args), this.finished && s.end();
      },
      cancel: () => {
        s && (s.dispose(), this.handles.delete(s));
      }
    });
    return Os(n);
  }
}, xh = class {
  promise;
  constructor(t) {
    this.promise = t;
  }
  get() {
    return this.promise;
  }
}, Ih = class {
  args;
  response;
  writable;
  resolve;
  argsText = "";
  constructor() {
    const t = new TransformStream();
    this.writable = t.writable, this.args = new Sh(t.readable);
    const { promise: e, resolve: s } = Xn();
    this.resolve = s, this.response = new xh(e);
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
const Ns = (t, e, s, n) => {
  try {
    const r = e?.(s, n);
    Promise.resolve(r).catch((o) => {
      console.error(`[assistant-stream] ${t} callback threw an error`, o);
    });
  } catch (r) {
    console.error(`[assistant-stream] ${t} callback threw an error`, r);
  }
}, Bs = (t, e) => {
  try {
    t.enqueue(e);
  } catch (s) {
    if (!(s instanceof TypeError)) throw s;
  }
};
var Th = class extends ah {
  constructor(t) {
    const e = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
    super((r) => {
      const o = new TransformStream({
        async transform(i, a) {
          switch ((i.type !== "part-finish" || i.meta.type !== "tool-call") && a.enqueue(i), i.type) {
            case "part-start":
              if (i.part.type === "tool-call") {
                const c = new Ih();
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
              l.setResponse(new Oe({
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
              let d = !1;
              const h = bh(() => {
                let m;
                try {
                  m = sn.parse(u.argsText);
                } catch (v) {
                  throw new Error(`Function parameter parsing failed. ${JSON.stringify(v.message)}`);
                }
                const p = t.execute({
                  toolCallId: c,
                  toolName: l,
                  args: m
                });
                return p !== void 0 && (d = !0, Ns("onExecutionStart", t.onExecutionStart, c, l)), p;
              }, (m) => {
                if (d && Ns("onExecutionEnd", t.onExecutionEnd, c, l), m === void 0) return;
                const p = new Oe({
                  artifact: m.artifact,
                  result: m.result,
                  isError: m.isError,
                  messages: m.messages,
                  modelContent: m.modelContent
                });
                u.setResponse(p), Bs(a, {
                  type: "result",
                  path: i.path,
                  ...p
                });
              }, (m) => {
                d && Ns("onExecutionEnd", t.onExecutionEnd, c, l);
                const p = new Oe({
                  result: String(m),
                  isError: !0
                });
                u.setResponse(p), Bs(a, {
                  type: "result",
                  path: i.path,
                  ...p
                });
              });
              h && e.set(c, h);
              break;
            }
            case "part-finish": {
              if (i.meta.type !== "tool-call") break;
              const { toolCallId: c } = i.meta, l = e.get(c);
              l ? l.then(() => {
                e.delete(c), s.delete(c), n.delete(c), Bs(a, i);
              }) : (s.delete(c), n.delete(c), a.enqueue(i));
            }
          }
        },
        async flush() {
          await Promise.all(e.values());
        }
      });
      return r.pipeThrough(new Bi()).pipeThrough(o);
    });
  }
};
const Ch = (t) => typeof t == "object" && t !== null && "~standard" in t && t["~standard"].version === 1;
function Eh(t, e, s, n) {
  const r = t?.[s.toolName];
  return r?.execute ? (async (i) => {
    if (e.aborted) return new Oe({
      result: "Tool execution was cancelled.",
      isError: !0
    });
    let a = i;
    if (Ch(r.parameters)) {
      let d = r.parameters["~standard"].validate(s.args);
      d instanceof Promise && (d = await d), d.issues && (a = r.experimental_onSchemaValidationError ?? (() => {
        throw new Error(`Function parameter validation failed. ${JSON.stringify(d.issues)}`);
      }));
    }
    let c;
    const l = new Promise((d) => {
      c = () => {
        queueMicrotask(() => {
          queueMicrotask(() => {
            d(new Oe({
              result: "Tool execution was cancelled.",
              isError: !0
            }));
          });
        });
      }, e.aborted ? c() : e.addEventListener("abort", c, { once: !0 });
    }), u = (async () => {
      const d = await a(s.args, {
        toolCallId: s.toolCallId,
        abortSignal: e,
        human: (m) => n(s.toolCallId, m)
      }), h = Oe.toResponse(d);
      if (r.toModelOutput && !h.isError && h.modelContent === void 0) try {
        const m = await r.toModelOutput({
          toolCallId: s.toolCallId,
          input: s.args,
          output: h.result
        });
        return new Oe({
          result: h.result,
          artifact: h.artifact,
          isError: h.isError,
          messages: h.messages,
          modelContent: m
        });
      } catch (m) {
        console.warn(`[assistant-stream] tool "${s.toolName}" toModelOutput threw; falling back to default projection.`, m);
      }
      return h;
    })();
    try {
      return await Promise.race([u, l]);
    } finally {
      e.removeEventListener("abort", c);
    }
  })(r.execute) : void 0;
}
function Rh(t, e, s, n, r) {
  t?.[n.toolName]?.streamCall?.(s, {
    toolCallId: n.toolCallId,
    abortSignal: e,
    human: (o) => r(n.toolCallId, o)
  });
}
function Ah(t, e, s, n) {
  const r = typeof t == "function" ? t : () => t, o = typeof e == "function" ? e : () => e;
  return new Th({
    execute: (i) => Eh(r(), o(), i, s),
    streamCall: ({ reader: i, ...a }) => Rh(r(), o(), i, a, s),
    onExecutionStart: n?.onExecutionStart,
    onExecutionEnd: n?.onExecutionEnd
  });
}
const et = Fi("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7), qi = (t) => {
  const e = w(7), { index: s, children: n } = t;
  let r;
  e[0] !== s ? (r = Ae({
    source: "message",
    query: {
      type: "index",
      index: s
    },
    get: (c) => c.message().attachment({ index: s })
  }), e[0] = s, e[1] = r) : r = e[1];
  let o;
  e[2] !== r ? (o = { attachment: r }, e[2] = r, e[3] = o) : o = e[3];
  const i = re(o);
  let a;
  return e[4] !== i || e[5] !== n ? (a = /* @__PURE__ */ f(Ne, {
    value: i,
    children: n
  }), e[4] = i, e[5] = n, e[6] = a) : a = e[6], a;
}, ji = (t) => {
  const e = w(10), { index: s, children: n } = t;
  let r;
  e[0] !== s ? (r = Ae({
    source: "thread",
    query: {
      type: "index",
      index: s
    },
    get: (l) => l.thread().message({ index: s })
  }), e[0] = s, e[1] = r) : r = e[1];
  let o;
  e[2] !== s ? (o = Ae({
    source: "message",
    query: {},
    get: (l) => l.thread().message({ index: s }).composer()
  }), e[2] = s, e[3] = o) : o = e[3];
  let i;
  e[4] !== r || e[5] !== o ? (i = {
    message: r,
    composer: o
  }, e[4] = r, e[5] = o, e[6] = i) : i = e[6];
  const a = re(i);
  let c;
  return e[7] !== a || e[8] !== n ? (c = /* @__PURE__ */ f(Ne, {
    value: a,
    children: n
  }), e[7] = a, e[8] = n, e[9] = c) : c = e[9], c;
}, Zn = ({ index: t, children: e }) => {
  const s = me(() => ({
    index: t,
    current: null
  }), [t]);
  return /* @__PURE__ */ f(Ne, {
    value: re({ part: Ae({
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
}, Mh = (t) => {
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
    addToolResult: kh,
    resumeToolCall: Ph,
    respondToToolApproval: $h
  }, e[5] = i, e[6] = a) : a = e[6], a;
}, Dh = oe(Mh), Kn = (t) => {
  const e = w(8), { text: s, isRunning: n, children: r } = t, o = n === void 0 ? !1 : n;
  let i;
  e[0] !== o || e[1] !== s ? (i = Dh({
    text: s,
    isRunning: o
  }), e[0] = o, e[1] = s, e[2] = i) : i = e[2];
  let a;
  e[3] !== i ? (a = { part: i }, e[3] = i, e[4] = a) : a = e[4];
  const c = re(a);
  let l;
  return e[5] !== c || e[6] !== r ? (l = /* @__PURE__ */ f(Ne, {
    value: c,
    children: r
  }), e[5] = c, e[6] = r, e[7] = l) : l = e[7], l;
};
function kh() {
  throw new Error("Not supported");
}
function Ph() {
  throw new Error("Not supported");
}
function $h() {
  throw new Error("Not supported");
}
const Oh = Object.freeze({ type: "complete" }), Nh = (t) => {
  const e = w(9), { parts: s, getMessagePart: n } = t, [r, o] = de(!0), i = s[s.length - 1]?.status ?? Oh;
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
}, Bh = oe(Nh), Fh = (t) => {
  const e = w(5), { startIndex: s, endIndex: n, children: r } = t, o = M(Lh).slice(s, n + 1), i = re(), a = Bh({
    parts: o,
    getMessagePart: (d) => {
      const { index: h } = d;
      if (h < 0 || h >= o.length) throw new Error(`ChainOfThought part index ${h} is out of bounds (0..${o.length - 1})`);
      return i.message().part({ index: s + h });
    }
  });
  let c;
  e[0] !== a ? (c = { chainOfThought: a }, e[0] = a, e[1] = c) : c = e[1];
  const l = re(c);
  let u;
  return e[2] !== l || e[3] !== r ? (u = /* @__PURE__ */ f(Ne, {
    value: l,
    children: r
  }), e[2] = l, e[3] = r, e[4] = u) : u = e[4], u;
};
function Lh(t) {
  return t.message.parts;
}
const Ui = (t) => {
  const e = w(7), { index: s, children: n } = t;
  let r;
  e[0] !== s ? (r = Ae({
    source: "suggestions",
    query: { index: s },
    get: (c) => c.suggestions().suggestion({ index: s })
  }), e[0] = s, e[1] = r) : r = e[1];
  let o;
  e[2] !== r ? (o = { suggestion: r }, e[2] = r, e[3] = o) : o = e[3];
  const i = re(o);
  let a;
  return e[4] !== i || e[5] !== n ? (a = /* @__PURE__ */ f(Ne, {
    value: i,
    children: n
  }), e[4] = i, e[5] = n, e[6] = a) : a = e[6], a;
}, tt = /* @__PURE__ */ Symbol("innerMessage"), Fs = /* @__PURE__ */ Symbol("innerMessages"), Vh = [], qh = (t, e) => {
  tt in t || (t[tt] = e);
}, jh = (t) => {
  const e = "messages" in t ? t.messages : t, s = e[Fs] || e[tt];
  return s ? Array.isArray(s) ? s : (e[Fs] = [s], e[Fs]) : Vh;
}, Es = (t, e, s) => {
  const n = (r) => {
    console.error(`[assistant-ui] ${s} listener threw an error`, r);
  };
  for (const r of t) try {
    const o = r(e);
    o !== null && (typeof o == "object" || typeof o == "function") && "then" in o && typeof o.then == "function" && Promise.resolve(o).catch(n);
  } catch (o) {
    n(o);
  }
}, Ce = /* @__PURE__ */ Symbol("skip-update");
function Uh(t, e) {
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
var Hh = class {
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
}, Rs = class {
  _subscriptions = /* @__PURE__ */ new Set();
  _connection;
  get isConnected() {
    return !!this._connection;
  }
  notifySubscribers(t, e) {
    if (e) {
      Es(this._subscriptions, t, e);
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
}, Te = class extends Rs {
  get path() {
    return this.binding.path;
  }
  binding;
  constructor(t) {
    super(), this.binding = t;
    const e = t.getState();
    if (e === Ce) throw new Error("Entry not available in the store");
    this._previousState = e;
  }
  _previousState;
  getState = () => (this.isConnected || this._syncState(), this._previousState);
  _syncState() {
    const t = this.binding.getState();
    return t === Ce || Uh(t, this._previousState) ? !1 : (this._previousState = t, !0);
  }
  _connect() {
    const t = () => {
      this._syncState() && this.notifySubscribers();
    };
    return this.binding.subscribe(t);
  }
}, er = class extends Rs {
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
      t !== Ce && (this._previousState = t), this._previousStateDirty = !1;
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
}, ps = class extends Rs {
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
}, Hi = class extends Rs {
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
}, zi = class {
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
}, Gi = class extends zi {
  _composerApi;
  constructor(t, e) {
    super(t), this._composerApi = e;
  }
  remove() {
    const t = this._composerApi.getState();
    if (!t) throw new Error("Composer is not available");
    return t.removeAttachment(this.getState().id);
  }
}, zh = class extends Gi {
  get source() {
    return "thread-composer";
  }
}, Gh = class extends Gi {
  get source() {
    return "edit-composer";
  }
}, Wh = class extends zi {
  get source() {
    return "message";
  }
  remove() {
    throw new Error("Message attachments cannot be removed");
  }
};
const gs = Object.freeze([]), Wi = Object.freeze({}), Yh = (t) => Object.freeze({
  type: "thread",
  isEditing: t?.isEditing ?? !1,
  canCancel: t?.canCancel ?? !1,
  canSend: t?.canSend ?? !1,
  isEmpty: t?.isEmpty ?? !0,
  attachments: t?.attachments ?? gs,
  text: t?.text ?? "",
  role: t?.role ?? "user",
  runConfig: t?.runConfig ?? Wi,
  attachmentAccept: t?.attachmentAccept ?? "",
  dictation: t?.dictation,
  quote: t?.quote,
  queue: t?.queue ?? gs,
  value: t?.text ?? ""
}), Jh = (t) => Object.freeze({
  type: "edit",
  isEditing: t?.isEditing ?? !1,
  canCancel: t?.canCancel ?? !1,
  canSend: t?.canSend ?? !1,
  isEmpty: t?.isEmpty ?? !0,
  text: t?.text ?? "",
  role: t?.role ?? "user",
  attachments: t?.attachments ?? gs,
  runConfig: t?.runConfig ?? Wi,
  attachmentAccept: t?.attachmentAccept ?? "",
  dictation: t?.dictation,
  quote: t?.quote,
  queue: t?.queue ?? gs,
  parentId: t?.parentId ?? null,
  sourceId: t?.sourceId ?? null,
  value: t?.text ?? ""
});
var Yi = class {
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
    return s || (s = new Hi({
      event: t,
      binding: this._core
    }), this._eventSubscriptionSubjects.set(t, s)), s.subscribe(e);
  }
}, Qh = class extends Yi {
  get path() {
    return this._core.path;
  }
  get type() {
    return "thread";
  }
  _getState;
  constructor(t) {
    const e = new er({
      path: t.path,
      getState: () => Yh(t.getState()),
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
    return new zh(new Te({
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
        } : Ce;
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
}, Xh = class extends Yi {
  get path() {
    return this._core.path;
  }
  get type() {
    return "edit";
  }
  _getState;
  _beginEdit;
  constructor(t, e) {
    const s = new er({
      path: t.path,
      getState: () => Jh(t.getState()),
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
    return new Gh(new Te({
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
        } : Ce;
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
};
const Ft = (t) => t.content.filter((e) => e.type === "text").map((e) => e.text).join(`

`), Nr = {
  "allow-once": !0,
  "allow-always": !0,
  "reject-once": !1,
  "reject-always": !1
}, Zh = (t, e) => {
  let s, n;
  if ("optionId" in e) {
    const r = t.options?.find((o) => o.id === e.optionId);
    if (!r) throw new Error(`Tool approval has no option with id "${e.optionId}"`);
    if ("approved" in e) s = e.approved;
    else {
      if (!Object.hasOwn(Nr, r.kind)) throw new Error(`Tool approval option "${r.id}" has a custom kind "${r.kind}"; respond with an explicit approved value instead`);
      s = Nr[r.kind];
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
var Br = class {
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
    const n = e.toolName, r = e.toolCallId, o = Oe.toResponse(t);
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
    this.threadApi.getState().respondToToolApproval(Zh(e.approval, t));
  }
  subscribe(t) {
    return this.contentBinding.subscribe(t);
  }
};
const Yt = Object.freeze({ type: "complete" }), Kh = (t, e, s) => {
  if (t.role !== "assistant") return Yt;
  if (s.type === "tool-call") return s.result ? Yt : t.status;
  const n = e === Math.max(0, t.content.length - 1);
  return t.status.type === "requires-action" ? Yt : n ? t.status : Yt;
}, Fr = (t, e) => {
  const s = t.content[e];
  if (!s) return Ce;
  const n = Kh(t, e, s);
  return Object.freeze({
    ...s,
    [tt]: s[tt],
    status: n
  });
};
var em = class {
  get path() {
    return this._core.path;
  }
  _core;
  _threadBinding;
  constructor(t, e) {
    this._core = t, this._threadBinding = e, this.composer = new Xh(new ps({
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
    return Ft(this.getState());
  }
  subscribe(t) {
    return this._core.subscribe(t);
  }
  getMessagePartByIndex(t) {
    if (t < 0) throw new Error("Message part index must be >= 0");
    return new Br(new Te({
      path: {
        ...this.path,
        ref: `${this.path.ref}.content[${t}]`,
        messagePartSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => Fr(this.getState(), t),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core, this._threadBinding);
  }
  getMessagePartByToolCallId(t) {
    return new Br(new Te({
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
        return s === -1 ? Ce : Fr(e, s);
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core, this._threadBinding);
  }
  getAttachmentByIndex(t) {
    return new Wh(new Te({
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
        } : Ce;
      },
      subscribe: (e) => this._core.subscribe(e)
    }));
  }
};
const tm = (t) => ({
  parentId: t.parentId ?? null,
  sourceId: t.sourceId ?? null,
  runConfig: t.runConfig ?? {},
  ...t.stream ? { stream: t.stream } : {}
}), sm = (t) => ({
  parentId: t.parentId ?? null,
  sourceId: t.sourceId ?? null,
  runConfig: t.runConfig ?? {}
}), nm = (t, e) => typeof e == "string" ? {
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
}, rm = (t, e) => {
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
var om = class {
  get path() {
    return this._threadBinding.path;
  }
  get __internal_threadBinding() {
    return this._threadBinding;
  }
  _threadBinding;
  constructor(t, e) {
    const s = new Te({
      path: t.path,
      getState: () => rm(t.getState(), e.getState()),
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
    }, this.composer = new Qh(new ps({
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
    this._threadBinding.getState().append(nm(this._threadBinding.getState().messages, t));
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
    return this._threadBinding.getState().startRun(sm(t));
  }
  resumeRun(t) {
    return this._threadBinding.getState().resumeRun(tm(t));
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
    return new em(new Te({
      path: t,
      getState: () => {
        const { message: s, parentId: n, index: r } = e() ?? {}, { messages: o, speech: i } = this._threadBinding.getState();
        if (!s || n === void 0 || r === void 0) return Ce;
        const a = this._threadBinding.getState().getBranches(s.id);
        return {
          ...s,
          [tt]: s[tt],
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
    return s || (s = new Hi({
      event: t,
      binding: this._threadBinding
    }), this._eventSubscriptionSubjects.set(t, s)), s.subscribe(e);
  }
};
const im = ot(null), am = () => Ss(im);
var Jt = class {
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
      s === o && n === i || (s = o, n = i, !(t === "switchedTo" && !o) && (t === "switchedAway" && o || Es([e], {}, `Thread list item "${t}"`)));
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
const Lr = Promise.resolve(), cm = (t) => ({
  mainThreadId: t.mainThreadId,
  newThreadId: t.newThreadId,
  threadIds: t.threadIds,
  archivedThreadIds: t.archivedThreadIds,
  isLoading: t.isLoading,
  isLoadingMore: t.isLoadingMore ?? !1,
  hasMore: t.hasMore ?? !1,
  threadItems: t.threadItems
}), Qt = (t, e) => {
  if (e === void 0) return Ce;
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
  } : Ce;
};
var lm = class {
  _getState;
  _core;
  _runtimeFactory;
  constructor(t, e = om) {
    this._core = t, this._runtimeFactory = e;
    const s = new er({
      path: {},
      getState: () => cm(t),
      subscribe: (n) => t.subscribe(n)
    });
    this._getState = s.getState.bind(s), this._mainThreadListItemRuntime = new Jt(new Te({
      path: {
        ref: "threadItems[main]",
        threadSelector: { type: "main" }
      },
      getState: () => Qt(this._core, this._core.mainThreadId),
      subscribe: (n) => this._core.subscribe(n)
    }), this._core), this.main = new e(new ps({
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
    return this._core.reload?.() ?? Lr;
  }
  loadMore() {
    return this._core.loadMore?.() ?? Lr;
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
    return new this._runtimeFactory(new ps({
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
    return new Jt(new Te({
      path: {
        ref: `threadItems[${t}]`,
        threadSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => Qt(this._core, this._core.threadIds[t]),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
  getArchivedItemByIndex(t) {
    return new Jt(new Te({
      path: {
        ref: `archivedThreadItems[${t}]`,
        threadSelector: {
          type: "archiveIndex",
          index: t
        }
      },
      getState: () => Qt(this._core, this._core.archivedThreadIds[t]),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
  getItemById(t) {
    return new Jt(new Te({
      path: {
        ref: `threadItems[threadId=${t}]`,
        threadSelector: {
          type: "threadId",
          threadId: t
        }
      },
      getState: () => Qt(this._core, t),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
}, um = class {
  threads;
  _thread;
  _core;
  constructor(t) {
    this._core = t, this.threads = new lm(t.threads), this._thread = this.threads.main, this.__internal_bindMethods();
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
}, dm = class {
  _contextProvider = new pi();
  registerModelContextProvider(t) {
    return this._contextProvider.registerModelContextProvider(t);
  }
  getModelContextProvider() {
    return this._contextProvider;
  }
};
const Ge = Object.freeze([]), pt = "DEFAULT_THREAD_ID", hm = Object.freeze([pt]), mm = Object.freeze({
  id: pt,
  remoteId: void 0,
  externalId: void 0,
  status: "regular"
}), fm = Promise.resolve(), Vr = Object.freeze({ [pt]: mm });
var pm = class {
  _mainThreadId = pt;
  _threads = hm;
  _archivedThreads = Ge;
  _threadData = Vr;
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
    return fm;
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
    const n = t.threadId ?? pt, r = t.threads ?? Ge, o = t.archivedThreads ?? Ge, i = s.threadId ?? pt, a = s.threads ?? Ge, c = s.archivedThreads ?? Ge;
    !e && i === n && a === r && c === o || ((a !== r || c !== o || i !== n) && (this._threadData = {
      ...Vr,
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
    }), a !== r && (this._threads = this.adapter.threads?.map((l) => l.id) ?? Ge), c !== o && (this._archivedThreads = this.adapter.archivedThreads?.map((l) => l.id) ?? Ge), (e || i !== n) && (this._mainThreadId = n, this._mainThread = this.threadFactory()), this._threadData[this._mainThreadId] || (this._threadData = {
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
const Ls = (t, e) => {
  if (t.startsWith("data-"))
    return {
      type: "data",
      name: t.substring(5),
      data: e
    };
}, bs = (t, e, s) => {
  const { role: n, id: r, createdAt: o, attachments: i, status: a, metadata: c } = t, l = {
    id: r ?? e,
    createdAt: o ?? /* @__PURE__ */ new Date()
  }, u = typeof t.content == "string" ? [{
    type: "text",
    text: t.content
  }] : t.content, d = ({ image: h, ...m }) => typeof h != "string" ? null : h.match(/^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,(.*)$/) ? {
    ...m,
    image: h
  } : /^(https:\/\/|blob:)/.test(h) ? {
    ...m,
    image: h
  } : (console.warn("Invalid image data format detected"), null);
  if (n !== "user" && i?.length) throw new Error("attachments are only supported for user messages");
  if (n !== "assistant" && a) throw new Error("status is only supported for assistant messages");
  if (n !== "assistant" && c?.steps) throw new Error("metadata.steps is only supported for assistant messages");
  switch (n) {
    case "assistant":
      return {
        ...l,
        role: n,
        content: u.map((h) => {
          const m = h.type;
          switch (m) {
            case "text":
            case "reasoning":
              return h.text?.trim() ? h : null;
            case "file":
            case "source":
              return h;
            case "image":
              return d(h);
            case "data":
              return h;
            case "generative-ui":
              return h;
            case "tool-call": {
              const { parentId: p, messages: v, ..._ } = h, C = {
                ..._,
                toolCallId: h.toolCallId ?? `tool-${et()}`,
                ...p !== void 0 && { parentId: p },
                ...v !== void 0 && { messages: v }
              };
              return h.args ? {
                ...C,
                args: h.args,
                argsText: h.argsText ?? JSON.stringify(h.args)
              } : {
                ...C,
                args: nn(h.argsText ?? "") ?? {},
                argsText: h.argsText ?? ""
              };
            }
            default: {
              const p = Ls(m, h.data);
              if (p) return p;
              throw new Error(`Unsupported assistant message part type: ${m}`);
            }
          }
        }).filter((h) => !!h),
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
        content: u.map((h) => {
          const m = h.type;
          switch (m) {
            case "text":
            case "image":
            case "audio":
            case "file":
            case "data":
              return h;
            default: {
              const p = Ls(m, h.data);
              if (p) return p;
              throw new Error(`Unsupported user message part type: ${m}`);
            }
          }
        }),
        attachments: (i ?? []).map((h) => ({
          ...h,
          content: h.content.map((m) => Ls(m.type, m.data) ?? m)
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
}, yt = /* @__PURE__ */ Symbol("autoStatus"), gm = Object.freeze(Object.assign({ type: "running" }, { [yt]: !0 })), bm = Object.freeze(Object.assign({
  type: "complete",
  reason: "unknown"
}, { [yt]: !0 }));
Object.freeze(Object.assign({
  type: "requires-action",
  reason: "tool-calls"
}, { [yt]: !0 }));
Object.freeze(Object.assign({
  type: "requires-action",
  reason: "interrupt"
}, { [yt]: !0 }));
const _m = (t) => t[yt] === !0, rn = (t, e, s, n, r) => t && r ? Object.assign({
  type: "incomplete",
  reason: "error",
  error: r
}, { [yt]: !0 }) : t && e ? gm : bm, Ji = {
  fromArray: (t) => {
    const e = t.map((s) => bs(s, et(), rn(!1, !1, !1, !1, void 0)));
    return { messages: e.map((s, n) => ({
      parentId: n > 0 ? e[n - 1].id : null,
      message: s
    })) };
  },
  fromBranchableArray: (t, e) => {
    const s = rn(!1, !1, !1, !1, void 0);
    return {
      ...e?.headId !== void 0 ? { headId: e.headId } : void 0,
      messages: t.map(({ message: n, parentId: r }) => {
        if (!n.id) throw new Error("ExportedMessageRepository.fromBranchableArray: Each message must have an 'id' field set.");
        return {
          parentId: r,
          message: bs(n, n.id, s)
        };
      })
    };
  }
}, is = (t) => t.next ? is(t.next) : "current" in t ? t : null;
var vm = class {
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
}, Qi = class {
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
        r.children = [...r.children, e.current.id], (is(e) === this.head || r.next === null) && (r.next = e), e.prev = t;
        const o = t ? t.level + 1 : 0;
        this.updateLevels(e, o);
      }
    }
  }
  _messages = new vm(() => {
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
    this.performOp(null, s, "cut"), this.messages.delete(t), this.head === s && (this.head = is(n ?? this.root)), this._messages.dirty();
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
    n.next = e, this.head = is(e), this.evictOffBranchOptimisticMessages(s, this.head), this._messages.dirty();
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
const tr = Object.freeze([]);
function qr(t, e) {
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
function ym(t, e) {
  return t.length !== e.length ? !1 : t.every((s, n) => s.id === e[n].id);
}
function wm(t) {
  const e = et();
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
function Sm(t) {
  const e = [];
  for (const s of t) s.type !== "text" && e.push(wm(s));
  return e;
}
const xm = (t) => "content" in t && !("lastModified" in t), Vs = (t) => t.status.type === "complete";
var Xi = class extends Hh {
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
      const e = this._attachments.filter((s) => !Vs(s));
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
    const e = this.getAttachmentAdapter(), s = this.attachments.map(async (h) => {
      if (Vs(h)) return h;
      if (!e) throw new Error("Attachments are not supported");
      return await e.send(h);
    }), n = this.attachments, r = this.text, o = this._quote;
    this._quote = void 0, this._text = "", this._isSending = !0;
    const i = ++this._sendGeneration;
    this._notifySubscribers();
    let a;
    try {
      a = await Promise.all(s);
    } catch (h) {
      throw i === this._sendGeneration && (!this.text.trim() && this._quote === void 0 && (this._text = r, this._quote = o, this._notifySubscribers()), Promise.allSettled(s).then(() => {
        i === this._sendGeneration && (this._removedDuringSend.clear(), this._isSending = !1, this._notifySubscribers());
      })), h;
    }
    if (i !== this._sendGeneration) return;
    const c = new Set(n.map((h) => h.id));
    this._attachments = this._attachments.filter((h) => !c.has(h.id)), this._isSending = !1, this._notifySubscribers();
    const l = a.filter((h) => !this._removedDuringSend.has(h.id));
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
    }, d = this.handleSend(u, t);
    d && d.catch(() => {
    }), this._notifyEventSubscribers("send", {});
  }
  cancel() {
    this.handleCancel();
  }
  get queue() {
    return tr;
  }
  steerQueueItem(t) {
  }
  removeQueueItem(t) {
  }
  async addAttachment(t) {
    if (xm(t)) {
      const r = this.getAttachmentAdapter();
      if (r && !qr({
        name: t.name,
        type: t.contentType ?? ""
      }, r.accept)) {
        const i = `File type ${t.contentType || "unknown"} is not accepted. Accepted types: ${r.accept}`, a = new Error(i);
        throw this._safeEmitAttachmentAddError("not-accepted", i, void 0, a), a;
      }
      const o = {
        id: t.id ?? et(),
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
    if (!qr({
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
    if (this._isSending && this._removedDuringSend.add(t), !Vs(s)) {
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
          const { transcript: d, ...h } = this._dictation;
          this._dictation = h;
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
    s && Es(s, e, `Composer runtime "${t}"`);
  }
  unstable_on(t, e) {
    const s = e;
    let n = this._eventSubscribers.get(t);
    return n || (n = /* @__PURE__ */ new Set(), this._eventSubscribers.set(t, n)), n.add(s), () => {
      this._eventSubscribers.get(t)?.delete(s);
    };
  }
}, Im = class extends Xi {
  _canCancel = !1;
  get canCancel() {
    return this._canCancel;
  }
  get canSend() {
    return !this.isEmpty && !this.runtime.isSendDisabled && !this._isSending;
  }
  get queue() {
    return this.runtime.getQueueItems?.() ?? tr;
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
    const s = $i(this.runtime.getModelContext().unstable_composerMetadata, this.runtime.messages), n = this.enrichWithComposerMetadata(t, s);
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
}, Tm = class extends Xi {
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
    super(), this.runtime = t, this.endEditCallback = e, this._parentId = s, this._sourceId = n.id, this._previousText = Ft(n), this.setText(this._previousText), this.setRole(n.role), n.role === "user" ? (this._previousAttachments = [...n.attachments ?? [], ...Sm(n.content)], this._nonTextPassthrough = []) : (this._previousAttachments = n.attachments ?? [], this._nonTextPassthrough = n.content.filter((r) => r.type !== "text")), this.setAttachments(this._previousAttachments), this.setRunConfig({ ...t.composer.runConfig });
  }
  get parentId() {
    return this._parentId;
  }
  get sourceId() {
    return this._sourceId;
  }
  async handleSend(t, e) {
    let s;
    const n = Ft(t), r = !ym(t.attachments ?? [], this._previousAttachments);
    if (n !== this._previousText || r || e?.startRun) {
      const o = this._nonTextPassthrough.length > 0 ? [...t.content, ...this._nonTextPassthrough] : t.content, i = this.runtime.messages, a = this._parentId === null ? -1 : i.findIndex((u) => u.id === this._parentId), c = $i(this.runtime.getModelContext().unstable_composerMetadata, i.slice(0, a + 1)), l = this.enrichWithComposerMetadata(t, c);
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
}, Cm = class {
  _subscriptions = /* @__PURE__ */ new Set();
  _isInitialized = !1;
  repository = new Qi();
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
  composer = new Im(this);
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
    this._editComposers.set(t, new Tm(this, () => this._editComposers.delete(t), this.repository.getMessage(t))), this._notifySubscribers();
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
    s && Es(s, e, `Thread runtime "${t}"`);
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
    const n = e.speak(Ft(s)), r = n.subscribe(() => {
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
        id: et(),
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
          id: et(),
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
    this.import(Ji.fromArray(t ?? []));
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
}, jr = class {
  cache = /* @__PURE__ */ new WeakMap();
  convertMessages(t, e) {
    return t.map((s, n) => {
      const r = e(this.cache.get(s), s, n);
      return this.cache.set(s, r), r;
    });
  }
};
const Xt = (t) => {
  try {
    return JSON.parse(t), !0;
  } catch {
    return !1;
  }
}, Ur = (t) => {
  try {
    return JSON.parse(t);
  } catch {
    return;
  }
}, Hr = (t, e) => {
  const s = Ur(t), n = Ur(e);
  return s === void 0 || n === void 0 ? !1 : Qn(s, n);
};
var Em = class {
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
    const [t, e] = mh();
    this._controller = e;
    const s = Ah(() => this._getWrappedTools(), () => this._ac.signal, (n, r) => this._onHumanInput(n, r), {
      onExecutionStart: (n) => this._onExecutionStart(n),
      onExecutionEnd: (n) => this._onExecutionEnd(n)
    });
    t.pipeThrough(s).pipeThrough(new Bi()).pipeTo(new WritableStream({ write: (n) => {
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
    return s ? !0 : (this._hasExecutableTool(t) || !this._isRunning) && Xt(e);
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
      if (t.argsComplete) Hr(t.argsText, e.argsText) && (t.argsText = e.argsText), n = !1;
      else if (!e.argsText.startsWith(t.argsText)) if (Xt(t.argsText) && Xt(e.argsText) && Hr(t.argsText, e.argsText)) {
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
            o.hasResult = !0, o.argsComplete = !0, i.setResponse(new Oe({
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
const Rm = Object.freeze([]), zr = (t, e) => {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length) return !1;
  for (const n of s) if (t[n] !== e[n]) return !1;
  return !0;
}, Am = (t, e) => t && e[e.length - 1]?.role !== "assistant";
var Mm = class extends Cm {
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
  _converter = new jr();
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
    const n = t.suggestions ?? Rm;
    zr(this.suggestions, n) || (this.suggestions = n);
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
    zr(this._capabilities, r) || (this._capabilities = r);
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
        for (const { message: u, parentId: d } of a) this.repository.addOrUpdateMessage(d, u);
        for (const { message: u } of this.repository.export().messages) l.has(u.id) || this.repository.deleteMessage(u.id);
        this.repository.resetHead(c), o = this.repository.getMessages();
      }
    } else if (t.messages) {
      if (s) {
        if (s.convertMessage !== t.convertMessage) this._converter = new jr();
        else if (s.isRunning === t.isRunning && s.messages === t.messages) {
          this._notifySubscribers();
          return;
        }
      }
      o = t.convertMessage ? this._converter.convertMessages(t.messages, (l, u, d) => {
        if (!t.convertMessage) return u;
        const h = rn(d === (t.messages?.length ?? 0) - 1, e, !1, !1, void 0);
        if (l && (l.role !== "assistant" || !_m(l.status) || l.status === h)) return l;
        const m = bs(t.convertMessage(u, d), d.toString(), h);
        return qh(m, u), m;
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
        const u = o[l], d = o[l - 1];
        this.repository.addOrUpdateMessage(d?.id ?? null, u);
      }
    } else throw new Error("ExternalStoreAdapter must provide either 'messages' or 'messageRepository'");
    o.length > 0 && this.ensureInitialized(), (s?.isRunning ?? !1) !== (t.isRunning ?? !1) && (t.isRunning ? this._notifyEventSubscribers("runStart", {}) : this._notifyEventSubscribers("runEnd", {}));
    let i = null;
    Am(e, o) && (i = et(), this.repository.addOrUpdateMessage(o.at(-1)?.id ?? null, bs({
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
    this._toolInvocations || (this._toolInvocations = new Em(() => this.getModelContext().tools, {
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
    return this._store?.queue?.items ?? tr;
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
    s?.role === "user" && s.id === e.at(-1)?.id ? (this.repository.deleteMessage(s.id), this.composer.text.trim() || this.composer.setText(Ft(s)), e = this.repository.getMessages()) : this._notifySubscribers(), setTimeout(() => {
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
    const e = new Qi();
    e.import(Ji.fromArray(t ?? [])), this.updateMessages(e.getMessages());
  }
  import(t) {
    super.import(t), this._store.onImport && this._store.onImport(this.repository.getMessages());
  }
  updateMessages = (t) => {
    this._store.convertMessage !== void 0 ? this._store.setMessages?.(t.flatMap(jh)) : this._store.setMessages?.(t);
  };
};
const Gr = (t) => t.adapters?.threadList ?? {};
var Dm = class extends dm {
  threads;
  constructor(t) {
    super(), this.threads = new pm(Gr(t), () => new Mm(this._contextProvider, t));
  }
  setAdapter(t) {
    this.threads.__internal_setAdapter(Gr(t)), this.threads.getMainThreadRuntimeCore().__internal_setAdapter(t);
  }
};
const km = (t) => {
  const e = w(11);
  let s;
  e[0] !== t ? (s = () => new Dm(t), e[0] = t, e[1] = s) : s = e[1];
  const [n] = de(s);
  let r;
  e[2] !== n || e[3] !== t ? (r = () => {
    n.setAdapter(t);
  }, e[2] = n, e[3] = t, e[4] = r) : r = e[4], K(r);
  const { modelContext: o } = am() ?? {};
  let i, a;
  e[5] !== o || e[6] !== n ? (i = () => {
    if (o)
      return n.registerModelContextProvider(o);
  }, a = [o, n], e[5] = o, e[6] = n, e[7] = i, e[8] = a) : (i = e[7], a = e[8]), K(i, a);
  let c;
  return e[9] !== n ? (c = new um(n), e[9] = n, e[10] = c) : c = e[10], c;
}, Pm = (t) => {
  const e = w(10), { id: s, children: n } = t;
  let r;
  e[0] !== s ? (r = Ae({
    source: "thread",
    query: {
      type: "id",
      id: s
    },
    get: (l) => l.thread().message({ id: s })
  }), e[0] = s, e[1] = r) : r = e[1];
  let o;
  e[2] !== s ? (o = Ae({
    source: "message",
    query: {},
    get: (l) => l.thread().message({ id: s }).composer()
  }), e[2] = s, e[3] = o) : o = e[3];
  let i;
  e[4] !== r || e[5] !== o ? (i = {
    message: r,
    composer: o
  }, e[4] = r, e[5] = o, e[6] = i) : i = e[6];
  const a = re(i);
  let c;
  return e[7] !== a || e[8] !== n ? (c = /* @__PURE__ */ f(Ne, {
    value: a,
    children: n
  }), e[7] = a, e[8] = n, e[9] = c) : c = e[9], c;
}, sr = (t, e) => t.Message === e.Message && t.EditComposer === e.EditComposer && t.UserEditComposer === e.UserEditComposer && t.AssistantEditComposer === e.AssistantEditComposer && t.SystemEditComposer === e.SystemEditComposer && t.UserMessage === e.UserMessage && t.AssistantMessage === e.AssistantMessage && t.SystemMessage === e.SystemMessage, $m = () => null, Wr = /* @__PURE__ */ new WeakMap(), Om = (t, e) => {
  let s = Wr.get(t);
  return s || (s = new Set(t.map((n) => n.id)), Wr.set(t, s)), s.has(e);
}, Nm = (t, e, s) => {
  switch (e) {
    case "user":
      return s ? t.UserEditComposer ?? t.EditComposer ?? t.UserMessage ?? t.Message : t.UserMessage ?? t.Message;
    case "assistant":
      return s ? t.AssistantEditComposer ?? t.EditComposer ?? t.AssistantMessage ?? t.Message : t.AssistantMessage ?? t.Message;
    case "system":
      return s ? t.SystemEditComposer ?? t.EditComposer ?? t.SystemMessage ?? t.Message : t.SystemMessage ?? t.Message ?? $m;
    default:
      throw new Error(`Unknown message role: ${e}`);
  }
}, nr = (t) => {
  const e = w(6), { components: s } = t, n = M(Fm), r = M(Lm);
  let o;
  e[0] !== s || e[1] !== r || e[2] !== n ? (o = Nm(s, n, r), e[0] = s, e[1] = r, e[2] = n, e[3] = o) : o = e[3];
  const i = o;
  let a;
  return e[4] !== i ? (a = /* @__PURE__ */ f(i, {}), e[4] = i, e[5] = a) : a = e[5], a;
}, Zi = _e((t) => {
  const e = w(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ f(nr, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ f(ji, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && sr(t.components, e.components));
Zi.displayName = "ThreadPrimitive.MessageByIndex";
const Ki = _e((t) => {
  const e = w(7), { messageId: s, components: n } = t;
  let r;
  if (e[0] !== s ? (r = (a) => Om(a.thread.messages, s), e[0] = s, e[1] = r) : r = e[1], !M(r)) return null;
  let o;
  e[2] !== n ? (o = /* @__PURE__ */ f(nr, { components: n }), e[2] = n, e[3] = o) : o = e[3];
  let i;
  return e[4] !== s || e[5] !== o ? (i = /* @__PURE__ */ f(Pm, {
    id: s,
    children: o
  }), e[4] = s, e[5] = o, e[6] = i) : i = e[6], i;
}, (t, e) => t.messageId === e.messageId && sr(t.components, e.components));
Ki.displayName = "ThreadPrimitive.Unstable_MessageById";
const Yr = ({ children: t }) => {
  const e = M((s) => s.thread.messages.length);
  return me(() => e === 0 ? null : Array.from({ length: e }, (s, n) => /* @__PURE__ */ f(ji, {
    index: n,
    children: /* @__PURE__ */ f(Cs, {
      getItemState: (r) => r.thread().message({ index: n }).getState(),
      children: (r) => t({ get message() {
        return r();
      } })
    })
  }, n)), [e, t]);
}, ea = (t) => {
  const e = w(4), { components: s, children: n } = t;
  if (s) {
    let o;
    return e[0] !== s ? (o = /* @__PURE__ */ f(Yr, { children: () => /* @__PURE__ */ f(nr, { components: s }) }), e[0] = s, e[1] = o) : o = e[1], o;
  }
  let r;
  return e[2] !== n ? (r = /* @__PURE__ */ f(Yr, { children: n }), e[2] = n, e[3] = r) : r = e[3], r;
};
ea.displayName = "ThreadPrimitive.Messages";
const Bm = _e(ea, (t, e) => t.children || e.children ? t.children === e.children : sr(t.components, e.components));
function Fm(t) {
  return t.message.role;
}
function Lm(t) {
  return t.message.composer.isEditing;
}
const ta = (t) => {
  const e = t.message.metadata;
  if (!(!e || typeof e != "object"))
    return e.custom?.quote;
};
var Vm = class extends Error {
  componentName;
  constructor(t, e = `Component "${t}" is not in the generative-ui allowlist.`) {
    super(e), this.name = "GenerativeUIRenderError", this.componentName = t;
  }
};
const qm = (t) => typeof t == "object" && t !== null, sa = (t, e, s, n) => {
  if (t == null) return null;
  if (typeof t == "string") return t;
  if (!qm(t) || !("component" in t) || typeof t.component != "string")
    return null;
  const { component: r, props: o, children: i, key: a } = t, c = e[r];
  if (!c) {
    if (s) return /* @__PURE__ */ f(s, {
      component: r,
      props: o
    }, a ?? n);
    throw new Vm(r);
  }
  const l = i?.length ? i.map((u, d) => sa(u, e, s, `${n}/${d}`)) : void 0;
  return fc(c, {
    ...o ?? {},
    key: a ?? n
  }, ...l ?? []);
}, jm = (t) => {
  if (!t || t.root === void 0 || t.root === null) return [];
  const e = t.root;
  return Array.isArray(e) ? e : [e];
}, rr = (t) => {
  const e = w(11), { spec: s, components: n, Fallback: r } = t;
  let o;
  e[0] !== s ? (o = jm(s), e[0] = s, e[1] = o) : o = e[1];
  const i = o;
  let a;
  if (e[2] !== r || e[3] !== n || e[4] !== i) {
    let l;
    e[6] !== r || e[7] !== n ? (l = (u, d) => sa(u, n, r, `${d}`), e[6] = r, e[7] = n, e[8] = l) : l = e[8], a = i.map(l), e[2] = r, e[3] = n, e[4] = i, e[5] = a;
  } else a = e[5];
  let c;
  return e[9] !== a ? (c = /* @__PURE__ */ f(Me, { children: a }), e[9] = a, e[10] = c) : c = e[10], c;
};
rr.displayName = "GenerativeUIRender";
const na = (t) => {
  const e = w(4), { components: s, spec: n, Fallback: r } = t, o = M(Um), i = n ?? o;
  if (!i) return null;
  let a;
  return e[0] !== r || e[1] !== s || e[2] !== i ? (a = /* @__PURE__ */ f(rr, {
    spec: i,
    components: s,
    Fallback: r
  }), e[0] = r, e[1] = s, e[2] = i, e[3] = a) : a = e[3], a;
};
na.displayName = "MessagePrimitive.GenerativeUI";
function Um(t) {
  const e = t.part;
  return e?.type === "generative-ui" ? e.spec : void 0;
}
const Hm = "ui://", zm = (t) => !!t?.startsWith(Hm), Jr = (t) => Symbol.iterator in t, Qr = (t) => (
  // HACK: avoid checking entries type
  "entries" in t
), Xr = (t, e) => {
  const s = t instanceof Map ? t : new Map(t.entries()), n = e instanceof Map ? e : new Map(e.entries());
  if (s.size !== n.size)
    return !1;
  for (const [r, o] of s)
    if (!n.has(r) || !Object.is(o, n.get(r)))
      return !1;
  return !0;
}, Gm = (t, e) => {
  const s = t[Symbol.iterator](), n = e[Symbol.iterator]();
  let r = s.next(), o = n.next();
  for (; !r.done && !o.done; ) {
    if (!Object.is(r.value, o.value))
      return !1;
    r = s.next(), o = n.next();
  }
  return !!r.done && !!o.done;
};
function Wm(t, e) {
  return Object.is(t, e) ? !0 : typeof t != "object" || t === null || typeof e != "object" || e === null || Object.getPrototypeOf(t) !== Object.getPrototypeOf(e) ? !1 : Jr(t) && Jr(e) ? Qr(t) && Qr(e) ? Xr(t, e) : Gm(t, e) : Xr(
    { entries: () => Object.entries(t) },
    { entries: () => Object.entries(e) }
  );
}
function on(t) {
  const e = De.useRef(void 0);
  return (s) => {
    const n = t(s);
    return Wm(e.current, n) ? e.current : e.current = n;
  };
}
const qs = (t) => {
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
}, Ym = (t, e, s) => {
  const n = [];
  if (e) {
    const r = qs("chainOfThoughtGroup");
    for (let o = 0; o < t.length; o++) {
      const i = t[o];
      i === "tool-call" || i === "reasoning" ? r.startGroup(o) : (r.endGroup(o - 1, n), n.push({
        type: "single",
        index: o
      }));
    }
    r.finalize(t.length - 1, n);
  } else {
    const r = qs("toolGroup"), o = qs("reasoningGroup");
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
}, Jm = (t) => {
  const e = w(10), s = M(on(ff)), n = M(on(gf));
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
    e[3] !== s || e[4] !== n || e[5] !== t ? (o = Ym(s, t, n), e[3] = s, e[4] = n, e[5] = t, e[6] = o) : o = e[6];
    let i;
    e[7] !== n || e[8] !== o ? (i = {
      ranges: o,
      partIds: n
    }, e[7] = n, e[8] = o, e[9] = i) : i = e[9], r = i;
  }
  return r;
}, Qm = (t) => {
  const e = w(9);
  let s, n;
  e[0] !== t ? ({ Fallback: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  e[3] !== s || e[4] !== n.toolName ? (r = (a) => a.tools.toolUIs[n.toolName]?.[0]?.render ?? s, e[3] = s, e[4] = n.toolName, e[5] = r) : r = e[5];
  const o = M(r);
  if (!o) return null;
  let i;
  return e[6] !== o || e[7] !== n ? (i = /* @__PURE__ */ f(o, { ...n }), e[6] = o, e[7] = n, e[8] = i) : i = e[8], i;
}, or = (t, e, s) => {
  const n = t.renderers[e]?.[0];
  return n || (t.fallbacks[0] ?? s);
}, Xm = (t) => {
  const e = w(9);
  let s, n;
  e[0] !== t ? ({ Fallback: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  e[3] !== s || e[4] !== n.name ? (r = (a) => or(a.dataRenderers, n.name, s), e[3] = s, e[4] = n.name, e[5] = r) : r = e[5];
  const o = M(r);
  if (!o) return null;
  let i;
  return e[6] !== o || e[7] !== n ? (i = /* @__PURE__ */ f(o, { ...n }), e[6] = o, e[7] = n, e[8] = i) : i = e[8], i;
}, ge = {
  Text: () => null,
  Reasoning: () => null,
  Source: () => null,
  Image: () => null,
  File: () => null,
  Unstable_Audio: () => null,
  ToolGroup: ({ children: t }) => t,
  ReasoningGroup: ({ children: t }) => t
}, Zm = (t) => {
  const e = w(47), { components: s } = t;
  let n;
  e[0] !== s ? (n = s === void 0 ? {} : s, e[0] = s, e[1] = n) : n = e[1];
  const { Text: r, Reasoning: o, Image: i, Source: a, File: c, Unstable_Audio: l, tools: u, data: d, generativeUI: h } = n, m = r === void 0 ? ge.Text : r, p = o === void 0 ? ge.Reasoning : o, v = i === void 0 ? ge.Image : i, _ = a === void 0 ? ge.Source : a, C = c === void 0 ? ge.File : c, I = l === void 0 ? ge.Unstable_Audio : l;
  let E;
  e[2] !== u ? (E = u === void 0 ? {} : u, e[2] = u, e[3] = E) : E = e[3];
  const b = E, y = re(), T = M(bf), x = T.type;
  if (x === "tool-call") {
    let S;
    e[4] !== y ? (S = y.part(), e[4] = y, e[5] = S) : S = e[5];
    const q = S.addToolResult;
    let P;
    e[6] !== y ? (P = y.part(), e[6] = y, e[7] = P) : P = e[7];
    const z = P.resumeToolCall;
    let Q;
    e[8] !== y ? (Q = y.part(), e[8] = y, e[9] = Q) : Q = e[9];
    const L = Q.respondToToolApproval;
    if ("Override" in b) {
      let ce;
      return e[10] !== q || e[11] !== T || e[12] !== L || e[13] !== z || e[14] !== b.Override ? (ce = /* @__PURE__ */ f(b.Override, {
        ...T,
        addResult: q,
        resume: z,
        respondToApproval: L
      }), e[10] = q, e[11] = T, e[12] = L, e[13] = z, e[14] = b.Override, e[15] = ce) : ce = e[15], ce;
    }
    const B = b.by_name?.[T.toolName] ?? b.Fallback;
    let te;
    return e[16] !== B || e[17] !== q || e[18] !== T || e[19] !== L || e[20] !== z ? (te = /* @__PURE__ */ f(Qm, {
      ...T,
      Fallback: B,
      addResult: q,
      resume: z,
      respondToApproval: L
    }), e[16] = B, e[17] = q, e[18] = T, e[19] = L, e[20] = z, e[21] = te) : te = e[21], te;
  }
  if (T.status?.type === "requires-action") throw new Error("Encountered unexpected requires-action status");
  switch (x) {
    case "text": {
      let S;
      return e[22] !== m || e[23] !== T ? (S = /* @__PURE__ */ f(m, { ...T }), e[22] = m, e[23] = T, e[24] = S) : S = e[24], S;
    }
    case "reasoning": {
      let S;
      return e[25] !== p || e[26] !== T ? (S = /* @__PURE__ */ f(p, { ...T }), e[25] = p, e[26] = T, e[27] = S) : S = e[27], S;
    }
    case "source": {
      let S;
      return e[28] !== _ || e[29] !== T ? (S = /* @__PURE__ */ f(_, { ...T }), e[28] = _, e[29] = T, e[30] = S) : S = e[30], S;
    }
    case "image": {
      let S;
      return e[31] !== v || e[32] !== T ? (S = /* @__PURE__ */ f(v, { ...T }), e[31] = v, e[32] = T, e[33] = S) : S = e[33], S;
    }
    case "file": {
      let S;
      return e[34] !== C || e[35] !== T ? (S = /* @__PURE__ */ f(C, { ...T }), e[34] = C, e[35] = T, e[36] = S) : S = e[36], S;
    }
    case "audio": {
      let S;
      return e[37] !== I || e[38] !== T ? (S = /* @__PURE__ */ f(I, { ...T }), e[37] = I, e[38] = T, e[39] = S) : S = e[39], S;
    }
    case "data": {
      const S = d?.by_name?.[T.name] ?? d?.Fallback;
      let q;
      return e[40] !== S || e[41] !== T ? (q = /* @__PURE__ */ f(Xm, {
        ...T,
        Fallback: S
      }), e[40] = S, e[41] = T, e[42] = q) : q = e[42], q;
    }
    case "generative-ui": {
      if (!h?.components)
        return null;
      const S = T;
      let q;
      return e[43] !== h.Fallback || e[44] !== h.components || e[45] !== S.spec ? (q = /* @__PURE__ */ f(rr, {
        spec: S.spec,
        components: h.components,
        Fallback: h.Fallback
      }), e[43] = h.Fallback, e[44] = h.components, e[45] = S.spec, e[46] = q) : q = e[46], q;
    }
    default:
      return console.warn(`Unknown message part type: ${x}`), null;
  }
}, Pt = _e((t) => {
  const e = w(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ f(Zm, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ f(Zn, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && t.components?.Text === e.components?.Text && t.components?.Reasoning === e.components?.Reasoning && t.components?.Source === e.components?.Source && t.components?.Image === e.components?.Image && t.components?.File === e.components?.File && t.components?.Unstable_Audio === e.components?.Unstable_Audio && t.components?.tools === e.components?.tools && t.components?.data === e.components?.data && t.components?.generativeUI === e.components?.generativeUI && t.components?.ToolGroup === e.components?.ToolGroup && t.components?.ReasoningGroup === e.components?.ReasoningGroup);
Pt.displayName = "MessagePrimitive.PartByIndex";
const Km = (t) => {
  const e = w(6), { status: s, component: n } = t, r = s.type === "running";
  let o;
  e[0] !== n || e[1] !== s ? (o = /* @__PURE__ */ f(n, {
    type: "text",
    text: "",
    status: s
  }), e[0] = n, e[1] = s, e[2] = o) : o = e[2];
  let i;
  return e[3] !== r || e[4] !== o ? (i = /* @__PURE__ */ f(Kn, {
    text: "",
    isRunning: r,
    children: o
  }), e[3] = r, e[4] = o, e[5] = i) : i = e[5], i;
}, ef = Object.freeze({ type: "complete" }), tf = Object.freeze({ type: "running" }), sf = (t) => {
  const e = w(6), { components: s } = t, n = M(_f);
  if (s?.Empty) {
    let i;
    return e[0] !== s.Empty || e[1] !== n ? (i = /* @__PURE__ */ f(s.Empty, { status: n }), e[0] = s.Empty, e[1] = n, e[2] = i) : i = e[2], i;
  }
  if (n.type !== "running") return null;
  const r = s?.Text ?? ge.Text;
  let o;
  return e[3] !== n || e[4] !== r ? (o = /* @__PURE__ */ f(Km, {
    status: n,
    component: r
  }), e[3] = n, e[4] = r, e[5] = o) : o = e[5], o;
}, ra = _e(sf, (t, e) => t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), nf = (t) => {
  const e = w(4), { components: s, enabled: n } = t;
  let r;
  if (e[0] !== n ? (r = (i) => {
    if (!n || i.message.parts.length === 0) return !1;
    const a = i.message.parts[i.message.parts.length - 1];
    return a?.type !== "text" && a?.type !== "reasoning";
  }, e[0] = n, e[1] = r) : r = e[1], !M(r)) return null;
  let o;
  return e[2] !== s ? (o = /* @__PURE__ */ f(ra, { components: s }), e[2] = s, e[3] = o) : o = e[3], o;
}, rf = _e(nf, (t, e) => t.enabled === e.enabled && t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), of = (t) => {
  const e = w(4), { Quote: s } = t, n = M(ta);
  if (!n) return null;
  let r;
  return e[0] !== s || e[1] !== n.messageId || e[2] !== n.text ? (r = /* @__PURE__ */ f(s, {
    text: n.text,
    messageId: n.messageId
  }), e[0] = s, e[1] = n.messageId, e[2] = n.text, e[3] = r) : r = e[3], r;
}, af = _e(of);
function oa(t, e) {
  const s = t.toolUIs[e.toolName]?.[0]?.render ?? null;
  return s || (zm(e.mcp?.app?.resourceUri) && t.mcpApp ? t.mcpApp.render : null);
}
const ia = () => {
  const t = w(12), e = re(), s = M(vf), n = M(yf);
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
  return t[6] !== n || t[7] !== s || t[8] !== r.addToolResult || t[9] !== i.resumeToolCall || t[10] !== c.respondToToolApproval ? (l = /* @__PURE__ */ f(n, {
    ...s,
    addResult: o,
    resume: a,
    respondToApproval: c.respondToToolApproval
  }), t[6] = n, t[7] = s, t[8] = r.addToolResult, t[9] = i.resumeToolCall, t[10] = c.respondToToolApproval, t[11] = l) : l = t[11], l;
}, aa = () => {
  const t = w(3), e = M(wf), s = M(Sf);
  if (!s || e.type !== "data") return null;
  const n = e;
  let r;
  return t[0] !== s || t[1] !== n ? (r = /* @__PURE__ */ f(s, { ...n }), t[0] = s, t[1] = n, t[2] = r) : r = t[2], r;
}, cf = () => {
  const t = w(2), e = M(xf);
  if (e === "tool-call") {
    let s;
    return t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = /* @__PURE__ */ f(ia, {}), t[0] = s) : s = t[0], s;
  }
  if (e === "data") {
    let s;
    return t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = /* @__PURE__ */ f(aa, {}), t[1] = s) : s = t[1], s;
  }
  return null;
}, lf = Object.freeze({
  type: "text",
  text: "",
  status: tf
}), uf = ({ children: t }) => {
  const e = re(), s = M((n) => n.dataRenderers);
  return /* @__PURE__ */ f(Cs, {
    getItemState: (n) => n.part().getState(),
    children: (n) => t({ get part() {
      const r = n();
      if (r.type === "tool-call") {
        const o = oa(e.tools().getState(), r) !== null, i = e.part();
        return {
          ...r,
          toolUI: o ? /* @__PURE__ */ f(ia, {}) : null,
          addResult: i.addToolResult,
          resume: i.resumeToolCall,
          respondToApproval: i.respondToToolApproval
        };
      }
      if (r.type === "data") {
        const o = or(s, r.name, void 0) !== void 0;
        return {
          ...r,
          dataRendererUI: o ? /* @__PURE__ */ f(aa, {}) : null
        };
      }
      return r;
    } })
  });
}, ca = (t) => {
  const e = w(5), { index: s, children: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ f(uf, { children: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ f(Zn, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, df = (t) => {
  const e = w(9), { children: s } = t, n = M(If), r = M(Tf), o = n === 0 && r;
  if (n === 0) {
    if (!o) return null;
    let a;
    e[0] !== s ? (a = s({ part: lf }), e[0] = s, e[1] = a) : a = e[1];
    let c;
    return e[2] !== a ? (c = /* @__PURE__ */ f(Kn, {
      text: "",
      isRunning: !0,
      children: a
    }), e[2] = a, e[3] = c) : c = e[3], c;
  }
  let i;
  if (e[4] !== s || e[5] !== n) {
    let a;
    e[7] !== s ? (a = (c, l) => /* @__PURE__ */ f(ca, {
      index: l,
      children: (u) => s(u) ?? /* @__PURE__ */ f(cf, {})
    }, l), e[7] = s, e[8] = a) : a = e[8], i = /* @__PURE__ */ f(Me, { children: Array.from({ length: n }, a) }), e[4] = s, e[5] = n, e[6] = i;
  } else i = e[6];
  return i;
}, an = (t) => {
  const e = w(5), { components: s, unstable_showEmptyOnNonTextEnd: n, children: r } = t, o = n === void 0 ? !0 : n;
  if (r) {
    let a;
    return e[0] !== r ? (a = /* @__PURE__ */ f(df, { children: r }), e[0] = r, e[1] = a) : a = e[1], a;
  }
  let i;
  return e[2] !== s || e[3] !== o ? (i = /* @__PURE__ */ f(hf, {
    components: s,
    unstable_showEmptyOnNonTextEnd: o
  }), e[2] = s, e[3] = o, e[4] = i) : i = e[4], i;
};
an.displayName = "MessagePrimitive.Parts";
const hf = (t) => {
  const e = w(15), { components: s, unstable_showEmptyOnNonTextEnd: n } = t, r = M(Cf), o = !!s?.ChainOfThought, { ranges: i, partIds: a } = Jm(o);
  let c;
  e: {
    if (r === 0) {
      let p;
      e[0] !== s ? (p = /* @__PURE__ */ f(ra, { components: s }), e[0] = s, e[1] = p) : p = e[1], c = p;
      break e;
    }
    let m;
    if (e[2] !== s || e[3] !== i || e[4] !== a) {
      const p = /* @__PURE__ */ new Set(), v = (_) => {
        const C = a[_];
        return C !== void 0 && !p.has(C) ? (p.add(C), `part-id:${C}`) : `part-${_}`;
      };
      m = i.map((_) => {
        if (_.type === "single") return /* @__PURE__ */ f(Pt, {
          index: _.index,
          components: s
        }, _.index);
        if (_.type === "chainOfThoughtGroup") {
          const C = s?.ChainOfThought;
          return C ? /* @__PURE__ */ f(Fh, {
            startIndex: _.startIndex,
            endIndex: _.endIndex,
            children: /* @__PURE__ */ f(C, {})
          }, `chainOfThought-${_.idKey ?? _.startIndex}`) : null;
        } else return _.type === "toolGroup" ? /* @__PURE__ */ f(s?.ToolGroup ?? ge.ToolGroup, {
          startIndex: _.startIndex,
          endIndex: _.endIndex,
          children: Array.from({ length: _.endIndex - _.startIndex + 1 }, (C, I) => {
            const E = _.startIndex + I;
            return /* @__PURE__ */ f(Pt, {
              index: E,
              components: s
            }, v(E));
          })
        }, `tool-${_.idKey ?? _.startIndex}`) : /* @__PURE__ */ f(s?.ReasoningGroup ?? ge.ReasoningGroup, {
          startIndex: _.startIndex,
          endIndex: _.endIndex,
          children: Array.from({ length: _.endIndex - _.startIndex + 1 }, (C, I) => {
            const E = _.startIndex + I;
            return /* @__PURE__ */ f(Pt, {
              index: E,
              components: s
            }, `part-${E}`);
          })
        }, `reasoning-${_.startIndex}`);
      }), e[2] = s, e[3] = i, e[4] = a, e[5] = m;
    } else m = e[5];
    c = m;
  }
  const l = c;
  let u;
  e[6] !== s ? (u = s?.Quote && /* @__PURE__ */ f(af, { Quote: s.Quote }), e[6] = s, e[7] = u) : u = e[7];
  let d;
  e[8] !== s || e[9] !== n ? (d = /* @__PURE__ */ f(rf, {
    components: s,
    enabled: n
  }), e[8] = s, e[9] = n, e[10] = d) : d = e[10];
  let h;
  return e[11] !== l || e[12] !== u || e[13] !== d ? (h = /* @__PURE__ */ F(Me, { children: [
    u,
    l,
    d
  ] }), e[11] = l, e[12] = u, e[13] = d, e[14] = h) : h = e[14], h;
};
function mf(t) {
  return t.type;
}
function ff(t) {
  return t.message.parts.map(mf);
}
function pf(t) {
  return t.type === "tool-call" ? t.toolCallId : void 0;
}
function gf(t) {
  return t.message.parts.map(pf);
}
function bf(t) {
  return t.part;
}
function _f(t) {
  return t.message.status ?? ef;
}
function vf(t) {
  return t.part;
}
function yf(t) {
  return t.part.type === "tool-call" ? oa(t.tools, t.part) : null;
}
function wf(t) {
  return t.part;
}
function Sf(t) {
  return t.part.type === "data" ? or(t.dataRenderers, t.part.name, void 0) ?? null : null;
}
function xf(t) {
  return t.part.type;
}
function If(t) {
  return t.message.parts.length;
}
function Tf(t) {
  return (t.message.status?.type ?? "complete") === "running";
}
function Cf(t) {
  return t.message.parts.length;
}
const Ef = /* @__PURE__ */ Symbol.for("@assistant-ui/groupBy.memoKey"), Zr = (t) => {
  const e = t.nextChildIdx++;
  return t.nodeKey === "" ? String(e) : `${t.nodeKey}.${e}`;
}, Kr = (t, e) => {
  if (!(e === void 0 || t.claimed.has(e)))
    return t.claimed.add(e), `id:${e}`;
}, Rf = (t, e) => {
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
      idKey: Kr(i, e?.[o.indices[0]]),
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
        nodeKey: Zr(l),
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
      nodeKey: Zr(c),
      idKey: Kr(c, e?.[o])
    });
    for (let l = 1; l < n.length; l++) n[l].indices.push(o);
  }
  for (; n.length > 1; ) r();
  return s.children;
}, Af = Object.freeze({ type: "complete" }), Mf = (t, e, s) => {
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
}, la = () => {
  throw new Error("MessagePrimitive.GroupedParts: rendered `children` under a leaf part. `children` is only meaningful for `group-…` cases — add a matching case for the part type or return `null` to skip it.");
}, ua = (t, e, s) => {
  if (t.type === "part") return /* @__PURE__ */ f(ca, {
    index: t.index,
    children: ({ part: r }) => s({
      part: r,
      children: /* @__PURE__ */ f(la, {})
    })
  }, t.idKey ? `part-${t.idKey}` : `part-${t.index}`);
  const n = e[t.indices.at(-1)]?.status ?? Af;
  return /* @__PURE__ */ f(Oo, { children: s({
    part: {
      type: t.key,
      status: n,
      indices: t.indices
    },
    children: /* @__PURE__ */ f(Me, { children: t.children.map((r) => ua(r, e, s)) })
  }) }, t.idKey ?? t.nodeKey);
}, da = ({ groupBy: t, indicator: e = "no-text", children: s }) => {
  const n = M(on((i) => i.message.parts)), r = M((i) => i.tools.toolUIs), o = M((i) => e === "never" ? !1 : i.message.status?.type === "running");
  return /* @__PURE__ */ F(Me, { children: [me(() => {
    const i = { toolUIs: r };
    return Rf(n.map((a) => t(a, i) ?? []), n.map((a) => a.type === "tool-call" ? a.toolCallId : void 0));
  }, [
    n,
    t[Ef] ?? t,
    r
  ]).map((i) => ua(i, n, s)), Mf(e, n, o) && s({
    part: { type: "indicator" },
    children: /* @__PURE__ */ f(la, {})
  })] });
};
da.displayName = "MessagePrimitive.GroupedParts";
const Df = (t) => {
  const e = w(5), { children: s } = t, n = M(ta);
  if (!n) return null;
  let r;
  e[0] !== s || e[1] !== n ? (r = s(n), e[0] = s, e[1] = n, e[2] = r) : r = e[2];
  let o;
  return e[3] !== r ? (o = /* @__PURE__ */ f(Me, { children: r }), e[3] = r, e[4] = o) : o = e[4], o;
}, ha = _e(Df);
ha.displayName = "MessagePrimitive.Quote";
const ma = (t, e) => {
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
}, kf = (t) => {
  const e = w(5), { components: s } = t, n = M(Pf);
  if (!n) return null;
  const r = n;
  let o;
  e[0] !== s || e[1] !== r ? (o = ma(s, r), e[0] = s, e[1] = r, e[2] = o) : o = e[2];
  const i = o;
  if (!i) return null;
  let a;
  return e[3] !== i ? (a = /* @__PURE__ */ f(i, {}), e[3] = i, e[4] = a) : a = e[4], a;
}, fa = _e((t) => {
  const e = w(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ f(kf, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ f(qi, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && t.components?.Image === e.components?.Image && t.components?.Document === e.components?.Document && t.components?.File === e.components?.File && t.components?.Attachment === e.components?.Attachment);
fa.displayName = "MessagePrimitive.AttachmentByIndex";
const eo = ({ children: t }) => {
  const e = M((s) => s.message.role !== "user" ? 0 : (s.message.attachments ?? []).length);
  return me(() => Array.from({ length: e }, (s, n) => /* @__PURE__ */ f(qi, {
    index: n,
    children: /* @__PURE__ */ f(Cs, {
      getItemState: (r) => r.message().attachment({ index: n }).getState(),
      children: (r) => t({ get attachment() {
        return r();
      } })
    })
  }, n)), [e, t]);
}, pa = (t) => {
  const e = w(4), { components: s, children: n } = t;
  if (s) {
    let o;
    return e[0] !== s ? (o = /* @__PURE__ */ f(eo, { children: (i) => {
      const { attachment: a } = i, c = ma(s, a);
      return c ? /* @__PURE__ */ f(c, {}) : null;
    } }), e[0] = s, e[1] = o) : o = e[1], o;
  }
  let r;
  return e[2] !== n ? (r = /* @__PURE__ */ f(eo, { children: n }), e[2] = n, e[3] = r) : r = e[3], r;
};
pa.displayName = "MessagePrimitive.Attachments";
function Pf(t) {
  return t.attachment;
}
const ir = (t) => {
  const { children: e } = t;
  return M($f) ? e : null;
};
ir.displayName = "MessagePartPrimitive.InProgress";
function $f(t) {
  return t.part.status.type === "running";
}
const ga = (t) => {
  const e = w(2), { components: s } = t, n = s.Suggestion;
  let r;
  return e[0] !== n ? (r = /* @__PURE__ */ f(n, {}), e[0] = n, e[1] = r) : r = e[1], r;
}, ba = _e((t) => {
  const e = w(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ f(ga, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ f(Ui, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && t.components.Suggestion === e.components.Suggestion);
ba.displayName = "ThreadPrimitive.SuggestionByIndex";
const to = ({ children: t }) => {
  const e = M((s) => s.suggestions.suggestions.length);
  return me(() => e === 0 ? null : Array.from({ length: e }, (s, n) => /* @__PURE__ */ f(Ui, {
    index: n,
    children: /* @__PURE__ */ f(Cs, {
      getItemState: (r) => r.suggestions().suggestion({ index: n }).getState(),
      children: (r) => t({ get suggestion() {
        return r();
      } })
    })
  }, n)), [e, t]);
}, _a = (t) => {
  const e = w(4), { components: s, children: n } = t;
  if (s) {
    let o;
    return e[0] !== s ? (o = /* @__PURE__ */ f(to, { children: () => /* @__PURE__ */ f(ga, { components: s }) }), e[0] = s, e[1] = o) : o = e[1], o;
  }
  let r;
  return e[2] !== n ? (r = /* @__PURE__ */ f(to, { children: n }), e[2] = n, e[3] = r) : r = e[3], r;
};
_a.displayName = "ThreadPrimitive.Suggestions";
const Of = _e(_a, (t, e) => t.children || e.children ? t.children === e.children : t.components.Suggestion === e.components.Suggestion), Nf = (t) => {
  const e = w(12);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { copiedDuration: n, copyToClipboard: r } = s, o = n === void 0 ? 3e3 : n, i = re(), a = M(Ff), c = M(Lf), l = M(Vf), u = M(qf);
  let d;
  e[2] !== i || e[3] !== u || e[4] !== o || e[5] !== r || e[6] !== l ? (d = () => {
    if (!r) return;
    const v = l ? u : i.message().getCopyText();
    v && Promise.resolve(r(v)).then(() => {
      i.message().setIsCopied(!0), setTimeout(() => i.message().setIsCopied(!1), o);
    }, jf);
  }, e[2] = i, e[3] = u, e[4] = o, e[5] = r, e[6] = l, e[7] = d) : d = e[7];
  const h = d, m = a || !r;
  let p;
  return e[8] !== h || e[9] !== c || e[10] !== m ? (p = {
    copy: h,
    disabled: m,
    isCopied: c
  }, e[8] = h, e[9] = c, e[10] = m, e[11] = p) : p = e[11], p;
};
function Bf(t) {
  return t.type === "text" && t.text.length > 0;
}
function Ff(t) {
  return !((t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some(Bf));
}
function Lf(t) {
  return t.message.isCopied;
}
function Vf(t) {
  return t.composer.isEditing;
}
function qf(t) {
  return t.composer.text;
}
function jf() {
}
const Uf = () => {
  const t = w(5), e = re(), s = M(Hf);
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
function Hf(t) {
  return t.composer.isEditing;
}
const zf = () => {
  const t = w(5), e = re(), s = M(Gf);
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
function Gf(t) {
  return t.thread.isRunning || t.thread.isDisabled || t.message.role !== "assistant";
}
const Wf = () => {
  const t = w(5), e = re(), s = M(Jf);
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
}, Yf = () => {
  const t = w(5), e = re(), s = M(Qf);
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
function Jf(t) {
  return t.message.metadata.submittedFeedback?.type === "positive";
}
function Qf(t) {
  return t.message.metadata.submittedFeedback?.type === "negative";
}
const Xf = () => {
  const t = w(5), e = re(), s = M(Kf);
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
function Zf(t) {
  return t.type === "text" && t.text.length > 0;
}
function Kf(t) {
  return !((t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some(Zf));
}
const ep = () => {
  const t = w(5), e = re(), s = M(tp);
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
function tp(t) {
  return t.message.speech == null;
}
const sp = (t) => {
  const e = w(8), { prompt: s, send: n, clearComposer: r } = t, o = r === void 0 ? !0 : r, i = re(), a = M(np), c = n ?? !1;
  let l;
  e[0] !== i || e[1] !== o || e[2] !== s || e[3] !== c ? (l = () => {
    const h = i.thread().getState().isRunning;
    if (c && !h)
      i.thread().append({
        content: [{
          type: "text",
          text: s
        }],
        runConfig: i.composer().getState().runConfig
      }), o && i.composer().setText("");
    else if (o) i.composer().setText(s);
    else {
      const m = i.composer().getState().text;
      i.composer().setText(m.trim() ? `${m} ${s}` : s);
    }
  }, e[0] = i, e[1] = o, e[2] = s, e[3] = c, e[4] = l) : l = e[4];
  const u = l;
  let d;
  return e[5] !== a || e[6] !== u ? (d = {
    trigger: u,
    disabled: a
  }, e[5] = a, e[6] = u, e[7] = d) : d = e[7], d;
};
function np(t) {
  return t.thread.isDisabled;
}
const rp = () => M(op);
function op(t) {
  if (t.message.status?.type !== "incomplete" || t.message.status.reason !== "error") return;
  const e = t.message.status.error;
  return typeof e == "string" ? e : typeof e == "object" && e !== null && "message" in e && typeof e.message == "string" ? e.message : e ?? "An error occurred";
}
function ip(t, e) {
  function s(n) {
    const r = Ss(t);
    if (!n?.optional && !r) throw new Error(`This component must be used within ${e}.`);
    return r;
  }
  return s;
}
function va(t, e) {
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
const ya = ot(null), { useThreadViewport: at, useThreadViewportStore: ct } = va(ip(ya, "ThreadPrimitive.Viewport"), "useThreadViewport"), so = (t) => {
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
}, ap = (t = {}) => {
  const e = /* @__PURE__ */ new Set(), s = so((i) => {
    o.setState({ height: {
      ...o.getState().height,
      viewport: i
    } });
  }), n = so((i) => {
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
  }), o = gc(() => ({
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
}, _s = (t) => t, cp = (t) => {
  const e = w(11);
  let s;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = { optional: !0 }, e[0] = s) : s = e[0];
  const n = ct(s);
  let r;
  e[1] !== t ? (r = () => ap(t), e[1] = t, e[2] = r) : r = e[2];
  const [o] = de(r);
  let i, a;
  e[3] !== n || e[4] !== o ? (i = () => n?.getState().onScrollToBottom(() => {
    o.getState().scrollToBottom();
  }), a = [n, o], e[3] = n, e[4] = o, e[5] = i, e[6] = a) : (i = e[5], a = e[6]), K(i, a);
  let c, l;
  return e[7] !== n || e[8] !== o ? (c = () => {
    if (n)
      return o.subscribe((u) => {
        n.getState().isAtBottom !== u.isAtBottom && _s(n).setState({ isAtBottom: u.isAtBottom });
      });
  }, l = [o, n], e[7] = n, e[8] = o, e[9] = c, e[10] = l) : (c = e[9], l = e[10]), K(c, l), o;
}, ar = (t) => {
  const e = w(7), { children: s, options: n } = t;
  let r;
  e[0] !== n ? (r = n === void 0 ? {} : n, e[0] = n, e[1] = r) : r = e[1];
  const o = cp(r);
  let i;
  e[2] !== o ? (i = () => ({ useThreadViewport: o }), e[2] = o, e[3] = i) : i = e[3];
  const [a] = de(i);
  let c;
  return e[4] !== s || e[5] !== a ? (c = /* @__PURE__ */ f(ya.Provider, {
    value: a,
    children: s
  }), e[4] = s, e[5] = a, e[6] = c) : c = e[6], c;
}, lp = () => {
  const t = w(3), e = re();
  let s, n;
  return t[0] !== e ? (s = () => {
  }, n = [e], t[0] = e, t[1] = s, t[2] = n) : (s = t[1], n = t[2]), K(s, n), null;
}, up = (t) => {
  const e = w(7), { children: s, aui: n, runtime: r } = t, o = n ?? null;
  let i;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (i = /* @__PURE__ */ f(lp, {}), e[0] = i) : i = e[0];
  let a;
  e[1] !== s ? (a = /* @__PURE__ */ f(ar, { children: s }), e[1] = s, e[2] = a) : a = e[2];
  let c;
  return e[3] !== r || e[4] !== o || e[5] !== a ? (c = /* @__PURE__ */ F(zd, {
    runtime: r,
    aui: o,
    children: [i, a]
  }), e[3] = r, e[4] = o, e[5] = a, e[6] = c) : c = e[6], c;
}, dp = _e(up);
var hp = Object.defineProperty, cr = (t, e) => hp(t, "name", { value: e, configurable: !0 });
function cn(t, e) {
  if (typeof t == "function")
    return t(e);
  t != null && (t.current = e);
}
cr(cn, "setRef");
function wa(...t) {
  return (e) => {
    let s = !1;
    const n = t.map((r) => {
      const o = cn(r, e);
      return !s && typeof o == "function" && (s = !0), o;
    });
    if (s)
      return () => {
        for (let r = 0; r < n.length; r++) {
          const o = n[r];
          typeof o == "function" ? o() : cn(t[r], null);
        }
      };
  };
}
cr(wa, "composeRefs");
function lt(...t) {
  return O(wa(...t), t);
}
cr(lt, "useComposedRefs");
var no = Object.defineProperty, lr = (t, e) => {
  let s = {};
  for (var n in t) no(s, n, {
    get: t[n],
    enumerable: !0
  });
  return no(s, Symbol.toStringTag, { value: "Module" }), s;
}, mp = Object.defineProperty, Ee = (t, e) => mp(t, "name", { value: e, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Sa(t) {
  const e = fe((s, n) => {
    let { children: r, ...o } = s, i = null, a = !1;
    const c = [];
    ln(r) && typeof Zt == "function" && (r = Zt(r._payload)), gr.forEach(r, (h) => {
      if (Ca(h)) {
        a = !0;
        const m = h;
        let p = "child" in m.props ? m.props.child : m.props.children;
        ln(p) && typeof Zt == "function" && (p = Zt(p._payload)), i = pp(m, p), c.push(i?.props?.children);
      } else
        c.push(h);
    }), i ? i = as(i, void 0, c) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && gr.count(r) === 1 && Ot(r) && (i = r)
    );
    const l = i ? Ta(i) : void 0, u = lt(n, l);
    if (!i) {
      if (r || r === 0)
        throw new Error(
          a ? _p(t) : bp(t)
        );
      return r;
    }
    const d = Ia(o, i.props ?? {});
    return i.type !== Oo && (d.ref = n ? u : l), as(i, d);
  });
  return e.displayName = `${t}.Slot`, e;
}
Ee(Sa, "createSlot");
var xa = /* @__PURE__ */ Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function fp(t) {
  const e = /* @__PURE__ */ Ee((s) => "child" in s ? s.children(s.child) : s.children, "Slottable");
  return e.displayName = `${t}.Slottable`, e.__radixId = xa, e;
}
Ee(fp, "createSlottable");
var pp = /* @__PURE__ */ Ee((t, e) => {
  if ("child" in t.props) {
    const s = t.props.child;
    return Ot(s) ? as(s, void 0, t.props.children(s.props.children)) : null;
  }
  return Ot(e) ? e : null;
}, "getSlottableElementFromSlottable");
function Ia(t, e) {
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
Ee(Ia, "mergeProps");
function Ta(t) {
  let e = Object.getOwnPropertyDescriptor(t.props, "ref")?.get, s = e && "isReactWarning" in e && e.isReactWarning;
  return s ? t.ref : (e = Object.getOwnPropertyDescriptor(t, "ref")?.get, s = e && "isReactWarning" in e && e.isReactWarning, s ? t.props.ref : t.props.ref || t.ref);
}
Ee(Ta, "getElementRef");
function Ca(t) {
  return Ot(t) && typeof t.type == "function" && "__radixId" in t.type && t.type.__radixId === xa;
}
Ee(Ca, "isSlottable");
var gp = /* @__PURE__ */ Symbol.for("react.lazy");
function ln(t) {
  return t != null && typeof t == "object" && "$$typeof" in t && t.$$typeof === gp && "_payload" in t && Ea(t._payload);
}
Ee(ln, "isLazyComponent");
function Ea(t) {
  return typeof t == "object" && t !== null && "then" in t;
}
Ee(Ea, "isPromiseLike");
var bp = /* @__PURE__ */ Ee((t) => `${t} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), _p = /* @__PURE__ */ Ee((t) => `${t} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), Zt = pc[" use ".trim().toString()], vp = Object.defineProperty, yp = (t, e) => vp(t, "name", { value: e, configurable: !0 }), wp = [
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
], Sp = wp.reduce((t, e) => {
  const s = /* @__PURE__ */ Sa(`Primitive.${e}`), n = fe((r, o) => {
    const { asChild: i, ...a } = r, c = i ? s : e;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ f(c, { ...a, ref: o });
  });
  return n.displayName = `Primitive.${e}`, { ...t, [e]: n };
}, {});
function xp(t, e) {
  t && Qc(() => t.dispatchEvent(e));
}
yp(xp, "dispatchDiscreteCustomEvent");
const Ip = [
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
function Tp(t) {
  const e = fe((s, n) => {
    const r = w(17);
    let o, i, a, c;
    r[0] !== s ? ({ render: a, asChild: o, children: i, ...c } = s, r[0] = s, r[1] = o, r[2] = i, r[3] = a, r[4] = c) : (o = r[1], i = r[2], a = r[3], c = r[4]);
    const l = t;
    if (a && Ot(a)) {
      const h = i !== void 0 ? i : a.props.children, m = c;
      let p;
      r[5] !== a || r[6] !== h ? (p = as(a, void 0, h), r[5] = a, r[6] = h, r[7] = p) : p = r[7];
      let v;
      return r[8] !== n || r[9] !== m || r[10] !== p ? (v = /* @__PURE__ */ f(l, {
        ...m,
        asChild: !0,
        ref: n,
        children: p
      }), r[8] = n, r[9] = m, r[10] = p, r[11] = v) : v = r[11], v;
    }
    const u = c;
    let d;
    return r[12] !== o || r[13] !== i || r[14] !== n || r[15] !== u ? (d = /* @__PURE__ */ f(l, {
      ...u,
      asChild: o,
      ref: n,
      children: i
    }), r[12] = o, r[13] = i, r[14] = n, r[15] = u, r[16] = d) : d = r[16], d;
  });
  return e.displayName = typeof t == "string" ? t : t.displayName ?? t.name ?? "Component", e;
}
function Cp(t) {
  const e = Sp[t], s = Tp(e);
  return s.displayName = `Primitive.${t}`, s;
}
const ye = Ip.reduce((t, e) => (t[e] = Cp(e), t), {}), Ep = (t) => {
  const e = w(5), { hideWhenRunning: s, autohide: n, autohideFloat: r, forceVisible: o } = t;
  let i;
  return e[0] !== n || e[1] !== r || e[2] !== o || e[3] !== s ? (i = (a) => {
    if (s && a.thread.isRunning) return "hidden";
    const c = n === "always" || n === "not-last" && !a.message.isLast, l = o || a.message.isHovering;
    return c ? l ? r === "always" || r === "single-branch" && a.message.branchCount <= 1 ? "floating" : "normal" : "hidden" : "normal";
  }, e[0] = n, e[1] = r, e[2] = o, e[3] = s, e[4] = i) : i = e[4], M(i);
}, Rp = ot(null), Ra = fe((t, e) => {
  const s = w(18);
  let n, r, o, i;
  s[0] !== t ? ({ hideWhenRunning: o, autohide: n, autohideFloat: r, ...i } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o, s[4] = i) : (n = s[1], r = s[2], o = s[3], i = s[4]);
  const [a, c] = de(0);
  let l;
  s[5] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (l = () => {
    let I = !1;
    return c(Ap), () => {
      I || (I = !0, c(Mp));
    };
  }, s[5] = l) : l = s[5];
  const u = l;
  let d;
  s[6] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (d = { acquireInteractionLock: u }, s[6] = d) : d = s[6];
  const h = d, m = a > 0;
  let p;
  s[7] !== n || s[8] !== r || s[9] !== o || s[10] !== m ? (p = {
    hideWhenRunning: o,
    autohide: n,
    autohideFloat: r,
    forceVisible: m
  }, s[7] = n, s[8] = r, s[9] = o, s[10] = m, s[11] = p) : p = s[11];
  const v = Ep(p);
  if (v === "hidden") return null;
  let _;
  s[12] !== v ? (_ = v === "floating" ? { "data-floating": "true" } : null, s[12] = v, s[13] = _) : _ = s[13];
  let C;
  return s[14] !== e || s[15] !== i || s[16] !== _ ? (C = /* @__PURE__ */ f(Rp.Provider, {
    value: h,
    children: /* @__PURE__ */ f(ye.div, {
      ..._,
      ...i,
      ref: e
    })
  }), s[14] = e, s[15] = i, s[16] = _, s[17] = C) : C = s[17], C;
});
Ra.displayName = "ActionBarPrimitive.Root";
function Ap(t) {
  return t + 1;
}
function Mp(t) {
  return Math.max(0, t - 1);
}
var Dp = Object.defineProperty, wt = (t, e) => Dp(t, "name", { value: e, configurable: !0 }), Aa = !!(typeof window < "u" && window.document && window.document.createElement);
function ut(t, e, { checkForDefaultPrevented: s = !0 } = {}) {
  return /* @__PURE__ */ wt(function(r) {
    if (t?.(r), s === !1 || !r || !r.defaultPrevented)
      return e?.(r);
  }, "handleEvent");
}
wt(ut, "composeEventHandlers");
function kp(t) {
  if (!Aa)
    throw new Error("Cannot access window outside of the DOM");
  return t?.ownerDocument?.defaultView ?? window;
}
wt(kp, "getOwnerWindow");
function un(t) {
  if (!Aa)
    throw new Error("Cannot access document outside of the DOM");
  return t?.ownerDocument ?? document;
}
wt(un, "getOwnerDocument");
function Ma(t, e = !1) {
  const { activeElement: s } = un(t);
  if (!s?.nodeName)
    return null;
  if (Da(s) && s.contentDocument)
    return Ma(s.contentDocument.body, e);
  if (e) {
    const n = s.getAttribute("aria-activedescendant");
    if (n) {
      const r = un(s).getElementById(n);
      if (r)
        return r;
    }
  }
  return s;
}
wt(Ma, "getActiveElement");
function Da(t) {
  return t.tagName === "IFRAME";
}
wt(Da, "isFrame");
const Pp = (t) => {
  const e = w(4);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { copiedDuration: n } = s, r = n === void 0 ? 3e3 : n;
  let o;
  e[2] !== r ? (o = {
    copiedDuration: r,
    copyToClipboard: $p
  }, e[2] = r, e[3] = o) : o = e[3];
  const { copy: i, disabled: a } = Nf(o);
  return a ? null : i;
}, ka = fe((t, e) => {
  const s = w(20);
  let n, r, o, i;
  s[0] !== t ? ({ copiedDuration: n, onClick: o, disabled: r, ...i } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o, s[4] = i) : (n = s[1], r = s[2], o = s[3], i = s[4]);
  const a = M(Op);
  let c;
  s[5] !== n ? (c = { copiedDuration: n }, s[5] = n, s[6] = c) : c = s[6];
  const l = Pp(c);
  let u;
  s[7] !== a ? (u = a ? { "data-copied": "true" } : {}, s[7] = a, s[8] = u) : u = s[8];
  const d = r || !l;
  let h;
  s[9] !== l ? (h = () => {
    l?.();
  }, s[9] = l, s[10] = h) : h = s[10];
  let m;
  s[11] !== o || s[12] !== h ? (m = ut(o, h), s[11] = o, s[12] = h, s[13] = m) : m = s[13];
  let p;
  return s[14] !== e || s[15] !== i || s[16] !== u || s[17] !== d || s[18] !== m ? (p = /* @__PURE__ */ f(ye.button, {
    type: "button",
    ...u,
    ...i,
    ref: e,
    disabled: d,
    onClick: m
  }), s[14] = e, s[15] = i, s[16] = u, s[17] = d, s[18] = m, s[19] = p) : p = s[19], p;
});
ka.displayName = "ActionBarPrimitive.Copy";
function $p(t) {
  return typeof navigator > "u" || !navigator.clipboard ? Promise.reject(/* @__PURE__ */ new Error("Clipboard API is unavailable")) : navigator.clipboard.writeText(t);
}
function Op(t) {
  return t.message.isCopied;
}
const jt = (t, e, s = []) => {
  const n = fe((r, o) => {
    const i = w(6), a = {}, c = {};
    Object.keys(r).forEach((v) => {
      s.includes(v) ? a[v] = r[v] : c[v] = r[v];
    });
    const l = e(a) ?? void 0, u = ye, d = "button", h = c.disabled || !l, m = ut(c.onClick, l);
    let p;
    return i[0] !== o || i[1] !== c || i[2] !== u.button || i[3] !== h || i[4] !== m ? (p = /* @__PURE__ */ f(u.button, {
      ...c,
      type: d,
      ref: o,
      disabled: h,
      onClick: m
    }), i[0] = o, i[1] = c, i[2] = u.button, i[3] = h, i[4] = m, i[5] = p) : p = i[5], p;
  });
  return n.displayName = t, n;
}, Np = () => {
  const { disabled: t, reload: e } = zf();
  return t ? null : e;
}, Bp = jt("ActionBarPrimitive.Reload", Np), Fp = () => {
  const { disabled: t, edit: e } = Uf();
  return t ? null : e;
}, Lp = jt("ActionBarPrimitive.Edit", Fp), Vp = () => {
  const { disabled: t, speak: e } = Xf();
  return t ? null : e;
}, qp = jt("ActionBarPrimitive.Speak", Vp);
var jp = Object.defineProperty, Up = (t, e) => jp(t, "name", { value: e, configurable: !0 });
function Ut(t) {
  const e = ne(t);
  return le(() => {
    e.current = t;
  }), qe(() => ((...s) => e.current?.(...s)), []);
}
Up(Ut, "useCallbackRef");
var Hp = Object.defineProperty, Pa = (t, e) => Hp(t, "name", { value: e, configurable: !0 });
function $a(t, e = globalThis?.document) {
  const s = Ut(t);
  le(() => {
    const n = /* @__PURE__ */ Pa((r) => {
      r.key === "Escape" && s(r);
    }, "handleKeyDown");
    return e.addEventListener("keydown", n, { capture: !0 }), () => e.removeEventListener("keydown", n, { capture: !0 });
  }, [s, e]);
}
Pa($a, "useEscapeKeydown");
const zp = () => {
  const { disabled: t, stopSpeaking: e } = ep();
  return t ? null : e;
}, Oa = fe((t, e) => {
  const s = w(12), n = zp();
  let r;
  s[0] !== n ? (r = (l) => {
    n && (l.preventDefault(), n());
  }, s[0] = n, s[1] = r) : r = s[1], $a(r);
  const o = !n;
  let i;
  s[2] !== n ? (i = () => {
    n?.();
  }, s[2] = n, s[3] = i) : i = s[3];
  let a;
  s[4] !== t.onClick || s[5] !== i ? (a = ut(t.onClick, i), s[4] = t.onClick, s[5] = i, s[6] = a) : a = s[6];
  let c;
  return s[7] !== t || s[8] !== e || s[9] !== o || s[10] !== a ? (c = /* @__PURE__ */ f(ye.button, {
    type: "button",
    disabled: o,
    ...t,
    ref: e,
    onClick: a
  }), s[7] = t, s[8] = e, s[9] = o, s[10] = a, s[11] = c) : c = s[11], c;
});
Oa.displayName = "ActionBarPrimitive.StopSpeaking";
const Gp = () => {
  const { submit: t } = Wf();
  return t;
}, Na = fe((t, e) => {
  const s = w(17);
  let n, r, o;
  s[0] !== t ? ({ onClick: r, disabled: n, ...o } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o) : (n = s[1], r = s[2], o = s[3]);
  const i = M(Wp), a = Gp();
  let c;
  s[4] !== i ? (c = i ? { "data-submitted": "true" } : {}, s[4] = i, s[5] = c) : c = s[5];
  const l = n || !a;
  let u;
  s[6] !== a ? (u = () => {
    a?.();
  }, s[6] = a, s[7] = u) : u = s[7];
  let d;
  s[8] !== r || s[9] !== u ? (d = ut(r, u), s[8] = r, s[9] = u, s[10] = d) : d = s[10];
  let h;
  return s[11] !== e || s[12] !== o || s[13] !== c || s[14] !== l || s[15] !== d ? (h = /* @__PURE__ */ f(ye.button, {
    type: "button",
    ...c,
    ...o,
    ref: e,
    disabled: l,
    onClick: d
  }), s[11] = e, s[12] = o, s[13] = c, s[14] = l, s[15] = d, s[16] = h) : h = s[16], h;
});
Na.displayName = "ActionBarPrimitive.FeedbackPositive";
function Wp(t) {
  return t.message.metadata.submittedFeedback?.type === "positive";
}
const Yp = () => {
  const { submit: t } = Yf();
  return t;
}, Ba = fe((t, e) => {
  const s = w(17);
  let n, r, o;
  s[0] !== t ? ({ onClick: r, disabled: n, ...o } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o) : (n = s[1], r = s[2], o = s[3]);
  const i = M(Jp), a = Yp();
  let c;
  s[4] !== i ? (c = i ? { "data-submitted": "true" } : {}, s[4] = i, s[5] = c) : c = s[5];
  const l = n || !a;
  let u;
  s[6] !== a ? (u = () => {
    a?.();
  }, s[6] = a, s[7] = u) : u = s[7];
  let d;
  s[8] !== r || s[9] !== u ? (d = ut(r, u), s[8] = r, s[9] = u, s[10] = d) : d = s[10];
  let h;
  return s[11] !== e || s[12] !== o || s[13] !== c || s[14] !== l || s[15] !== d ? (h = /* @__PURE__ */ f(ye.button, {
    type: "button",
    ...c,
    ...o,
    ref: e,
    disabled: l,
    onClick: d
  }), s[11] = e, s[12] = o, s[13] = c, s[14] = l, s[15] = d, s[16] = h) : h = s[16], h;
});
Ba.displayName = "ActionBarPrimitive.FeedbackNegative";
function Jp(t) {
  return t.message.metadata.submittedFeedback?.type === "negative";
}
const Qp = (t) => {
  const e = w(6);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { filename: n, onExport: r } = s, o = re(), i = M(Zp);
  let a;
  e[2] !== o || e[3] !== n || e[4] !== r ? (a = async () => {
    const l = o.message().getCopyText();
    if (!l) return;
    if (r) {
      await r(l);
      return;
    }
    const u = new Blob([l], { type: "text/markdown" }), d = URL.createObjectURL(u), h = document.createElement("a");
    h.href = d, h.download = n ?? `message-${Date.now()}.md`, h.click(), URL.revokeObjectURL(d);
  }, e[2] = o, e[3] = n, e[4] = r, e[5] = a) : a = e[5];
  const c = a;
  return i ? c : null;
}, Fa = fe((t, e) => {
  const s = w(19);
  let n, r, o, i, a;
  s[0] !== t ? ({ filename: r, onExport: i, onClick: o, disabled: n, ...a } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o, s[4] = i, s[5] = a) : (n = s[1], r = s[2], o = s[3], i = s[4], a = s[5]);
  let c;
  s[6] !== r || s[7] !== i ? (c = {
    filename: r,
    onExport: i
  }, s[6] = r, s[7] = i, s[8] = c) : c = s[8];
  const l = Qp(c), u = n || !l;
  let d;
  s[9] !== l ? (d = () => {
    l?.();
  }, s[9] = l, s[10] = d) : d = s[10];
  let h;
  s[11] !== o || s[12] !== d ? (h = ut(o, d), s[11] = o, s[12] = d, s[13] = h) : h = s[13];
  let m;
  return s[14] !== e || s[15] !== a || s[16] !== u || s[17] !== h ? (m = /* @__PURE__ */ f(ye.button, {
    type: "button",
    ...a,
    ref: e,
    disabled: u,
    onClick: h
  }), s[14] = e, s[15] = a, s[16] = u, s[17] = h, s[18] = m) : m = s[18], m;
});
Fa.displayName = "ActionBarPrimitive.ExportMarkdown";
function Xp(t) {
  return t.type === "text" && t.text.length > 0;
}
function Zp(t) {
  return (t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some(Xp);
}
var Kp = /* @__PURE__ */ lr({
  Copy: () => ka,
  Edit: () => Lp,
  ExportMarkdown: () => Fa,
  FeedbackNegative: () => Ba,
  FeedbackPositive: () => Na,
  Reload: () => Bp,
  Root: () => Ra,
  Speak: () => qp,
  StopSpeaking: () => Oa
});
const eg = (t) => {
  const e = w(12);
  let s;
  return e[0] !== t.assistant || e[1] !== t.copied || e[2] !== t.hasAttachments || e[3] !== t.hasBranches || e[4] !== t.hasContent || e[5] !== t.last || e[6] !== t.lastOrHover || e[7] !== t.speaking || e[8] !== t.submittedFeedback || e[9] !== t.system || e[10] !== t.user ? (s = (n) => {
    const { role: r, attachments: o, parts: i, branchCount: a, isLast: c, speech: l, isCopied: u, isHovering: d } = n.message;
    return !(t.hasBranches === !0 && a < 2 || t.user && r !== "user" || t.assistant && r !== "assistant" || t.system && r !== "system" || t.lastOrHover === !0 && !d && !c || t.last !== void 0 && t.last !== c || t.copied === !0 && !u || t.copied === !1 && u || t.speaking === !0 && l == null || t.speaking === !1 && l != null || t.hasAttachments === !0 && (r !== "user" || !o?.length) || t.hasAttachments === !1 && r === "user" && o?.length || t.hasContent === !0 && i.length === 0 || t.hasContent === !1 && i.length > 0 || t.submittedFeedback !== void 0 && (n.message.metadata.submittedFeedback?.type ?? null) !== t.submittedFeedback);
  }, e[0] = t.assistant, e[1] = t.copied, e[2] = t.hasAttachments, e[3] = t.hasBranches, e[4] = t.hasContent, e[5] = t.last, e[6] = t.lastOrHover, e[7] = t.speaking, e[8] = t.submittedFeedback, e[9] = t.system, e[10] = t.user, e[11] = s) : s = e[11], M(s);
}, La = (t) => {
  const e = w(3);
  let s, n;
  return e[0] !== t ? ({ children: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]), eg(n) ? s : null;
};
La.displayName = "MessagePrimitive.If";
const tg = (t) => {
  const e = w(4), s = Ut(t), n = at(sg);
  let r, o;
  e[0] !== s || e[1] !== n ? (r = () => n(s), o = [n, s], e[0] = s, e[1] = n, e[2] = r, e[3] = o) : (r = e[2], o = e[3]), K(r, o);
};
function sg(t) {
  return t.onScrollToBottom;
}
const ng = () => !1, rg = () => {
}, og = (t) => {
  const e = w(4);
  let s;
  e[0] !== t ? (s = (o) => {
    if (typeof window > "u" || t === null || !window.matchMedia) return rg;
    const i = window.matchMedia(t);
    return i.addEventListener("change", o), () => i.removeEventListener("change", o);
  }, e[0] = t, e[1] = s) : s = e[1];
  const n = s;
  let r;
  return e[2] !== t ? (r = () => typeof window > "u" || t === null || !window.matchMedia ? !1 : window.matchMedia(t).matches, e[2] = t, e[3] = r) : r = e[3], zn(n, r, ng);
}, ig = () => M(ag);
function ag(t) {
  if (t.part.type !== "text" && t.part.type !== "reasoning") throw new Error("MessagePartText can only be used inside text or reasoning message parts.");
  return t.part;
}
const cg = ot(null);
function lg(t) {
  const e = Ss(cg);
  if (!t?.optional && !e) throw new Error("This component must be used within a SmoothContextProvider.");
  return e;
}
const { useSmoothStatus: K_, useSmoothStatusStore: ug } = va(lg, "useSmoothStatus"), Va = 250, qa = 5;
var dg = class {
  currentText;
  setText;
  animationFrameId = null;
  lastUpdateTime = Date.now();
  lastCommitTime = 0;
  targetText = "";
  drainMs = Va;
  maxCharIntervalMs = qa;
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
const js = Object.freeze({ type: "running" }), Kt = (t, e) => t !== void 0 && t > 0 ? t : e, hg = (t, e = !1) => {
  const { text: s } = t, n = og("(prefers-reduced-motion: reduce)"), r = typeof e == "object" && e !== null ? e : void 0, o = e !== !1 && e !== null && !n, i = Kt(r?.drainMs, Va), a = Kt(r?.maxCharIntervalMs, qa), c = Kt(r?.maxCharsPerFrame, 1 / 0), l = Kt(r?.minCommitMs, 0), [u, d] = de(t.status.type === "running" ? "" : s), h = re(), m = M(() => h.part()), [p, v] = de(m);
  (m !== p || !s.startsWith(u)) && (v(m), d(t.status.type === "running" ? "" : s));
  const _ = ug({ optional: !0 }), C = Ut((b) => {
    if (d(b), _) {
      const y = u !== b || t.status.type === "running" ? js : t.status;
      _s(_).setState(y, !0);
    }
  });
  K(() => {
    if (_) {
      const b = o && (u !== s || t.status.type === "running") ? js : t.status;
      _s(_).setState(b, !0);
    }
  }, [
    _,
    o,
    s,
    u,
    t.status
  ]);
  const [I] = de(new dg(u, C));
  K(() => {
    I.drainMs = i, I.maxCharIntervalMs = a, I.maxCharsPerFrame = c, I.minCommitMs = l;
  }, [
    I,
    i,
    a,
    c,
    l
  ]);
  const E = he(m);
  return K(() => {
    if (!o) {
      I.stop();
      return;
    }
    const b = E.current !== m;
    if (E.current = m, b || !s.startsWith(I.targetText)) {
      t.status.type === "running" ? (I.currentText = "", I.targetText = s, I.lastCommitTime = 0, I.start()) : (I.currentText = s, I.targetText = s, I.stop());
      return;
    }
    I.targetText = s, I.start();
  }, [
    I,
    o,
    s,
    t.status.type,
    m
  ]), K(() => () => {
    I.stop();
  }, [I]), me(() => o ? {
    ...t,
    text: u,
    status: s === u ? t.status : js
  } : t, [
    o,
    u,
    t,
    s
  ]);
}, mg = () => M(fg);
function fg(t) {
  if (t.part.type !== "image") throw new Error("MessagePartImage can only be used inside image message parts.");
  return t.part;
}
const ur = fe((t, e) => {
  const s = w(10);
  let n, r, o;
  s[0] !== t ? ({ smooth: r, component: o, ...n } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o) : (n = s[1], r = s[2], o = s[3]);
  const i = r === void 0 ? !0 : r, a = o === void 0 ? "span" : o, { text: c, status: l } = hg(ig(), i);
  let u;
  return s[4] !== a || s[5] !== e || s[6] !== n || s[7] !== l.type || s[8] !== c ? (u = /* @__PURE__ */ f(a, {
    "data-status": l.type,
    ...n,
    ref: e,
    children: c
  }), s[4] = a, s[5] = e, s[6] = n, s[7] = l.type, s[8] = c, s[9] = u) : u = s[9], u;
});
ur.displayName = "MessagePartPrimitive.Text";
const dr = fe((t, e) => {
  const s = w(4), { image: n } = mg();
  let r;
  return s[0] !== e || s[1] !== n || s[2] !== t ? (r = /* @__PURE__ */ f(ye.img, {
    src: n,
    ...t,
    ref: e
  }), s[0] = e, s[1] = n, s[2] = t, s[3] = r) : r = s[3], r;
});
dr.displayName = "MessagePartPrimitive.Image";
const dt = (t) => {
  const e = w(2), s = he(void 0);
  let n;
  return e[0] !== t ? (n = (r) => {
    s.current && (s.current(), s.current = void 0), r && (s.current = t(r));
  }, e[0] = t, e[1] = n) : n = e[1], n;
}, ro = (t, e) => {
  const s = t.trim().match(/^(\d+(?:\.\d+)?|\.\d+)(em|px|rem)$/);
  if (!s) return Number.POSITIVE_INFINITY;
  const n = Number(s[1]), r = s[2];
  return r === "px" ? n : r === "em" ? n * (parseFloat(getComputedStyle(e).fontSize) || 16) : r === "rem" ? n * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) : Number.POSITIVE_INFINITY;
}, pg = (t) => t.dataset.messageId, gg = () => {
  const t = document.createElement("div");
  return t.dataset.auiTopAnchorReserve = "", t.style.height = "0px", t.style.flexShrink = "0", t.style.pointerEvents = "none", t.setAttribute("aria-hidden", "true"), t;
}, oo = (t, e) => {
  const s = `${e}px`;
  return t.style.height !== s ? (t.style.height = s, !0) : !1;
}, bg = (t) => {
  const e = window.devicePixelRatio || 1;
  return Math.round(t * e) / e;
}, ja = () => {
  const t = w(4), e = re();
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
  }, t[2] = n, t[3] = r) : r = t[3], dt(r);
}, _g = () => {
  const t = w(2), e = at(Ig);
  let s;
  return t[0] !== e ? (s = (n) => n.message.role === "user" && n.message.index > 0 && n.message.index === n.thread.messages.length - 2 && n.thread.messages.at(-1)?.role === "assistant" && (n.message.id === e || n.thread.isRunning), t[0] = e, t[1] = s) : s = t[1], M(s);
}, vg = () => {
  const t = w(2), e = at(Tg);
  let s;
  return t[0] !== e ? (s = (n) => n.message.isLast && n.message.role === "assistant" && n.message.index >= 1 && n.thread.messages.at(n.message.index - 1)?.role === "user" && (n.message.id === e || n.thread.isRunning), t[0] = e, t[1] = s) : s = t[1], M(s);
}, yg = (t, e) => {
  const s = w(3);
  let n;
  return s[0] !== t || s[1] !== e ? (n = (r) => {
    if (t)
      return e.getState().registerAnchorElement(r);
  }, s[0] = t, s[1] = e, s[2] = n) : n = s[2], dt(n);
}, wg = (t) => {
  const e = w(3), { active: s, threadViewportStore: n } = t;
  let r;
  return e[0] !== s || e[1] !== n ? (r = (o) => {
    if (!s) return;
    const i = n.getState(), a = i.topAnchorMessageClamp;
    return i.registerAnchorTargetElement(o, {
      tallerThan: ro(a.tallerThan, o),
      visibleHeight: ro(a.visibleHeight, o)
    });
  }, e[0] = s, e[1] = n, e[2] = r) : r = e[2], dt(r);
}, Sg = (t) => {
  const e = w(7);
  let s, n;
  e[0] !== t ? ({ forwardedRef: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  const r = ja(), o = lt(s, r), i = M(Cg);
  let a;
  return e[3] !== i || e[4] !== n || e[5] !== o ? (a = /* @__PURE__ */ f(ye.div, {
    ...n,
    ref: o,
    "data-message-id": i
  }), e[3] = i, e[4] = n, e[5] = o, e[6] = a) : a = e[6], a;
}, xg = (t) => {
  const e = w(13);
  let s, n, r;
  e[0] !== t ? ({ forwardedRef: s, threadViewportStore: r, ...n } = t, e[0] = t, e[1] = s, e[2] = n, e[3] = r) : (s = e[1], n = e[2], r = e[3]);
  const o = ja(), i = _g(), a = vg(), c = yg(i, r);
  let l;
  e[4] !== a || e[5] !== r ? (l = {
    active: a,
    threadViewportStore: r
  }, e[4] = a, e[5] = r, e[6] = l) : l = e[6];
  const u = wg(l), d = lt(s, o, c, u), h = M(Eg), m = i ? "" : void 0, p = a ? "" : void 0;
  let v;
  return e[7] !== h || e[8] !== n || e[9] !== d || e[10] !== m || e[11] !== p ? (v = /* @__PURE__ */ f(ye.div, {
    ...n,
    ref: d,
    "data-message-id": h,
    "data-aui-top-anchor-user": m,
    "data-aui-top-anchor-target": p
  }), e[7] = h, e[8] = n, e[9] = d, e[10] = m, e[11] = p, e[12] = v) : v = e[12], v;
}, Ua = fe((t, e) => {
  const s = w(7), n = ct();
  if (n.getState().turnAnchor === "top") {
    let o;
    return s[0] !== e || s[1] !== t || s[2] !== n ? (o = /* @__PURE__ */ f(xg, {
      ...t,
      forwardedRef: e,
      threadViewportStore: n
    }), s[0] = e, s[1] = t, s[2] = n, s[3] = o) : o = s[3], o;
  }
  let r;
  return s[4] !== e || s[5] !== t ? (r = /* @__PURE__ */ f(Sg, {
    ...t,
    forwardedRef: e
  }), s[4] = e, s[5] = t, s[6] = r) : r = s[6], r;
});
Ua.displayName = "MessagePrimitive.Root";
function Ig(t) {
  return t.topAnchorTurn?.anchorId;
}
function Tg(t) {
  return t.topAnchorTurn?.targetId;
}
function Cg(t) {
  return t.message.id;
}
function Eg(t) {
  return t.message.id;
}
const Us = {
  ...ge,
  Text: () => /* @__PURE__ */ F("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ f(ur, {}), /* @__PURE__ */ f(ir, { children: /* @__PURE__ */ f("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Image: () => /* @__PURE__ */ f(dr, {})
}, dn = (t) => {
  const e = w(10);
  if ("children" in t) {
    let a;
    return e[0] !== t.children ? (a = /* @__PURE__ */ f(an, { children: t.children }), e[0] = t.children, e[1] = a) : a = e[1], a;
  }
  let s, n;
  e[2] !== t ? ({ components: s, ...n } = t, e[2] = t, e[3] = s, e[4] = n) : (s = e[3], n = e[4]);
  let r;
  e[5] !== s ? (r = s ? {
    Text: s.Text ?? Us.Text,
    Image: s.Image ?? Us.Image,
    Reasoning: s.Reasoning ?? ge.Reasoning,
    Source: s.Source ?? ge.Source,
    File: s.File ?? ge.File,
    Unstable_Audio: s.Unstable_Audio ?? ge.Unstable_Audio,
    ..."ChainOfThought" in s ? { ChainOfThought: s.ChainOfThought } : {
      tools: s.tools,
      data: s.data,
      ToolGroup: s.ToolGroup ?? ge.ToolGroup,
      ReasoningGroup: s.ReasoningGroup ?? ge.ReasoningGroup
    },
    Empty: s.Empty,
    Quote: s.Quote,
    generativeUI: s.generativeUI
  } : Us, e[5] = s, e[6] = r) : r = e[6];
  const o = r;
  let i;
  return e[7] !== n || e[8] !== o ? (i = /* @__PURE__ */ f(an, {
    components: o,
    ...n
  }), e[7] = n, e[8] = o, e[9] = i) : i = e[9], i;
};
dn.displayName = "MessagePrimitive.Parts";
const Ha = (t) => {
  const { children: e } = t;
  return rp() !== void 0 ? e : null;
};
Ha.displayName = "MessagePrimitive.Error";
const Rg = (t) => {
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
}, Ag = (t) => {
  const e = w(4), s = M(Lg);
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
}, Mg = (t) => {
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
  return e[6] !== o || e[7] !== n ? (i = /* @__PURE__ */ f(o, { ...n }), e[6] = o, e[7] = n, e[8] = i) : i = e[8], i;
}, Dg = (t) => {
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
  return e[6] !== o || e[7] !== n ? (i = /* @__PURE__ */ f(o, { ...n }), e[6] = o, e[7] = n, e[8] = i) : i = e[8], i;
}, Ve = {
  Text: () => /* @__PURE__ */ F("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ f(ur, {}), /* @__PURE__ */ f(ir, { children: /* @__PURE__ */ f("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Reasoning: () => null,
  Source: () => null,
  Image: () => /* @__PURE__ */ f(dr, {}),
  File: () => null,
  Unstable_Audio: () => null,
  Group: ({ children: t }) => t
}, kg = (t) => {
  const e = w(43), { components: s } = t;
  let n;
  e[0] !== s ? (n = s === void 0 ? {} : s, e[0] = s, e[1] = n) : n = e[1];
  const { Text: r, Reasoning: o, Image: i, Source: a, File: c, Unstable_Audio: l, tools: u, data: d } = n, h = r === void 0 ? Ve.Text : r, m = o === void 0 ? Ve.Reasoning : o, p = i === void 0 ? Ve.Image : i, v = a === void 0 ? Ve.Source : a, _ = c === void 0 ? Ve.File : c, C = l === void 0 ? Ve.Unstable_Audio : l;
  let I;
  e[2] !== u ? (I = u === void 0 ? {} : u, e[2] = u, e[3] = I) : I = e[3];
  const E = I, b = re(), y = M(Vg), T = y.type;
  if (T === "tool-call") {
    let x;
    e[4] !== b ? (x = b.part(), e[4] = b, e[5] = x) : x = e[5];
    const S = x.addToolResult;
    let q;
    e[6] !== b ? (q = b.part(), e[6] = b, e[7] = q) : q = e[7];
    const P = q.resumeToolCall;
    let z;
    e[8] !== b ? (z = b.part(), e[8] = b, e[9] = z) : z = e[9];
    const Q = z.respondToToolApproval;
    if ("Override" in E) {
      let te;
      return e[10] !== S || e[11] !== y || e[12] !== Q || e[13] !== P || e[14] !== E.Override ? (te = /* @__PURE__ */ f(E.Override, {
        ...y,
        addResult: S,
        resume: P,
        respondToApproval: Q
      }), e[10] = S, e[11] = y, e[12] = Q, e[13] = P, e[14] = E.Override, e[15] = te) : te = e[15], te;
    }
    const L = E.by_name?.[y.toolName] ?? E.Fallback;
    let B;
    return e[16] !== L || e[17] !== S || e[18] !== y || e[19] !== Q || e[20] !== P ? (B = /* @__PURE__ */ f(Mg, {
      ...y,
      Fallback: L,
      addResult: S,
      resume: P,
      respondToApproval: Q
    }), e[16] = L, e[17] = S, e[18] = y, e[19] = Q, e[20] = P, e[21] = B) : B = e[21], B;
  }
  if (y.status?.type === "requires-action") throw new Error("Encountered unexpected requires-action status");
  switch (T) {
    case "text": {
      let x;
      return e[22] !== h || e[23] !== y ? (x = /* @__PURE__ */ f(h, { ...y }), e[22] = h, e[23] = y, e[24] = x) : x = e[24], x;
    }
    case "reasoning": {
      let x;
      return e[25] !== m || e[26] !== y ? (x = /* @__PURE__ */ f(m, { ...y }), e[25] = m, e[26] = y, e[27] = x) : x = e[27], x;
    }
    case "source": {
      let x;
      return e[28] !== v || e[29] !== y ? (x = /* @__PURE__ */ f(v, { ...y }), e[28] = v, e[29] = y, e[30] = x) : x = e[30], x;
    }
    case "image": {
      let x;
      return e[31] !== p || e[32] !== y ? (x = /* @__PURE__ */ f(p, { ...y }), e[31] = p, e[32] = y, e[33] = x) : x = e[33], x;
    }
    case "file": {
      let x;
      return e[34] !== _ || e[35] !== y ? (x = /* @__PURE__ */ f(_, { ...y }), e[34] = _, e[35] = y, e[36] = x) : x = e[36], x;
    }
    case "audio": {
      let x;
      return e[37] !== C || e[38] !== y ? (x = /* @__PURE__ */ f(C, { ...y }), e[37] = C, e[38] = y, e[39] = x) : x = e[39], x;
    }
    case "data": {
      const x = d?.by_name?.[y.name] ?? d?.Fallback;
      let S;
      return e[40] !== x || e[41] !== y ? (S = /* @__PURE__ */ f(Dg, {
        ...y,
        Fallback: x
      }), e[40] = x, e[41] = y, e[42] = S) : S = e[42], S;
    }
    default:
      return console.warn(`Unknown message part type: ${T}`), null;
  }
}, Pg = (t) => {
  const e = w(5), { partIndex: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ f(kg, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ f(Zn, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, $g = _e(Pg, (t, e) => t.partIndex === e.partIndex && t.components?.Text === e.components?.Text && t.components?.Reasoning === e.components?.Reasoning && t.components?.Source === e.components?.Source && t.components?.Image === e.components?.Image && t.components?.File === e.components?.File && t.components?.Unstable_Audio === e.components?.Unstable_Audio && t.components?.tools === e.components?.tools && t.components?.data === e.components?.data && t.components?.Group === e.components?.Group), Og = (t) => {
  const e = w(6), { status: s, component: n } = t, r = s.type === "running";
  let o;
  e[0] !== n || e[1] !== s ? (o = /* @__PURE__ */ f(n, {
    type: "text",
    text: "",
    status: s
  }), e[0] = n, e[1] = s, e[2] = o) : o = e[2];
  let i;
  return e[3] !== r || e[4] !== o ? (i = /* @__PURE__ */ f(Kn, {
    text: "",
    isRunning: r,
    children: o
  }), e[3] = r, e[4] = o, e[5] = i) : i = e[5], i;
}, Ng = Object.freeze({ type: "complete" }), Bg = (t) => {
  const e = w(6), { components: s } = t, n = M(qg);
  if (s?.Empty) {
    let i;
    return e[0] !== s.Empty || e[1] !== n ? (i = /* @__PURE__ */ f(s.Empty, { status: n }), e[0] = s.Empty, e[1] = n, e[2] = i) : i = e[2], i;
  }
  const r = s?.Text ?? Ve.Text;
  let o;
  return e[3] !== n || e[4] !== r ? (o = /* @__PURE__ */ f(Og, {
    status: n,
    component: r
  }), e[3] = n, e[4] = r, e[5] = o) : o = e[5], o;
}, Fg = _e(Bg, (t, e) => t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), hr = (t) => {
  const e = w(9), { groupingFunction: s, components: n } = t, r = M(jg), o = Ag(s);
  let i;
  e: {
    if (r === 0) {
      let u;
      e[0] !== n ? (u = /* @__PURE__ */ f(Fg, { components: n }), e[0] = n, e[1] = u) : u = e[1], i = u;
      break e;
    }
    let l;
    if (e[2] !== n || e[3] !== o) {
      let u;
      e[5] !== n ? (u = (d, h) => /* @__PURE__ */ f(n?.Group ?? Ve.Group, {
        groupKey: d.groupKey,
        indices: d.indices,
        children: d.indices.map((m) => /* @__PURE__ */ f($g, {
          partIndex: m,
          components: n
        }, m))
      }, `group-${h}-${d.groupKey ?? "ungrouped"}`), e[5] = n, e[6] = u) : u = e[6], l = o.map(u), e[2] = n, e[3] = o, e[4] = l;
    } else l = e[4];
    i = l;
  }
  const a = i;
  let c;
  return e[7] !== a ? (c = /* @__PURE__ */ f(Me, { children: a }), e[7] = a, e[8] = c) : c = e[8], c;
};
hr.displayName = "MessagePrimitive.Unstable_PartsGrouped";
const za = (t) => {
  const e = w(6);
  let s, n;
  e[0] !== t ? ({ components: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  return e[3] !== s || e[4] !== n ? (r = /* @__PURE__ */ f(hr, {
    ...n,
    components: s,
    groupingFunction: Rg
  }), e[3] = s, e[4] = n, e[5] = r) : r = e[5], r;
};
za.displayName = "MessagePrimitive.Unstable_PartsGroupedByParentId";
function Lg(t) {
  return t.message.parts;
}
function Vg(t) {
  return t.part;
}
function qg(t) {
  return t.message.status ?? Ng;
}
function jg(t) {
  return t.message.parts.length;
}
var hn = /* @__PURE__ */ lr({
  AttachmentByIndex: () => fa,
  Attachments: () => pa,
  Content: () => dn,
  Error: () => Ha,
  GenerativeUI: () => na,
  GroupedParts: () => da,
  If: () => La,
  PartByIndex: () => Pt,
  Parts: () => dn,
  Quote: () => ha,
  Root: () => Ua,
  Unstable_PartsGrouped: () => hr,
  Unstable_PartsGroupedByParentId: () => za
});
const Ug = (t) => {
  const e = w(2), s = Ut(t);
  let n;
  return e[0] !== s ? (n = (r) => {
    const o = new ResizeObserver(() => {
      s();
    }), i = new MutationObserver((a) => {
      a.some(Hg) && s();
    });
    return o.observe(r), i.observe(r, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      characterData: !0
    }), () => {
      o.disconnect(), i.disconnect();
    };
  }, e[0] = s, e[1] = n) : n = e[1], dt(n);
};
function Hg(t) {
  return t.type !== "attributes" || t.attributeName !== "style";
}
const zg = ({ autoScroll: t, scrollToBottomOnRunStart: e = !0, scrollToBottomOnInitialize: s = !0, scrollToBottomOnThreadSwitch: n = !0 }) => {
  const r = he(null), o = M((b) => b.thread.messages.length > 0), i = he(!1), a = he(null), c = ct();
  t === void 0 && (t = c.getState().turnAnchor !== "top");
  const l = he(0), u = he(0), d = he(0), h = he(0), m = he(null), p = rs((b) => {
    const y = r.current;
    y && (m.current = b, y.scrollTo({
      top: y.scrollHeight,
      behavior: b
    }));
  }, []), v = rs((b) => {
    m.current = b, a.current !== null && cancelAnimationFrame(a.current), a.current = requestAnimationFrame(() => {
      a.current = null, p(b);
    });
  }, [p]);
  ds(() => () => {
    a.current !== null && cancelAnimationFrame(a.current);
  }, []);
  const _ = rs(() => {
    const b = c.getState();
    return b.turnAnchor === "top" && b.element.viewport === r.current && b.element.anchor !== null;
  }, [c]), C = () => {
    const b = r.current;
    if (!b) return;
    const y = c.getState().isAtBottom, T = Math.abs(b.scrollHeight - b.scrollTop - b.clientHeight) <= 1 || b.scrollHeight <= b.clientHeight;
    !T && l.current < b.scrollTop || (T ? b.scrollHeight > b.clientHeight + 1 && (m.current = null) : l.current > b.scrollTop && u.current === b.scrollHeight && (m.current = null), (T || m.current === null) && T !== y && _s(c).setState({ isAtBottom: T })), l.current = b.scrollTop, u.current = b.scrollHeight;
  }, I = Ug(() => {
    const b = r.current;
    if (!b) return;
    const { scrollHeight: y, clientHeight: T } = b;
    if (y === d.current && T === h.current) return;
    d.current = y, h.current = T;
    const x = m.current;
    x && _() ? m.current = null : x ? p(x) : t && c.getState().isAtBottom && p("instant"), C();
  }), E = dt((b) => {
    const y = () => {
      m.current = null;
    };
    return b.addEventListener("scroll", C), b.addEventListener("pointerdown", y), () => {
      b.removeEventListener("scroll", C), b.removeEventListener("pointerdown", y);
    };
  });
  return ds(() => {
    if (s) {
      if (!o) {
        i.current = !1;
        return;
      }
      i.current || (i.current = !0, m.current === null && v("instant"));
    }
  }, [
    o,
    v,
    s
  ]), tg(({ behavior: b }) => {
    p(b);
  }), ms("thread.runStart", () => {
    e && c.getState().turnAnchor !== "top" && v("auto");
  }), ms("threadListItem.switchedTo", () => {
    n && v("instant");
  }), lt(I, E, r);
}, Ga = fe((t, e) => {
  const s = w(3);
  let n;
  return s[0] !== t || s[1] !== e ? (n = /* @__PURE__ */ f(ye.div, {
    ...t,
    ref: e
  }), s[0] = t, s[1] = e, s[2] = n) : n = s[2], n;
});
Ga.displayName = "ThreadPrimitive.Root";
const Wa = (t) => {
  const { children: e } = t;
  return M(Gg) ? e : null;
};
Wa.displayName = "ThreadPrimitive.Empty";
function Gg(t) {
  return t.thread.isEmpty;
}
const Wg = (t) => {
  const e = w(4);
  let s;
  return e[0] !== t.disabled || e[1] !== t.empty || e[2] !== t.running ? (s = (n) => !(t.empty === !0 && !n.thread.isEmpty || t.empty === !1 && n.thread.isEmpty || t.running === !0 && !n.thread.isRunning || t.running === !1 && n.thread.isRunning || t.disabled === !0 && !n.thread.isDisabled || t.disabled === !1 && n.thread.isDisabled), e[0] = t.disabled, e[1] = t.empty, e[2] = t.running, e[3] = s) : s = e[3], M(s);
}, Ya = (t) => {
  const e = w(3);
  let s, n;
  return e[0] !== t ? ({ children: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]), Wg(n) ? s : null;
};
Ya.displayName = "ThreadPrimitive.If";
const Ja = (t, e) => {
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
  }, s[0] = e, s[1] = t, s[2] = n) : n = s[2], dt(n);
}, io = (t) => {
  let e = 0, s = t;
  for (; s; )
    e += s.offsetTop, s = s.offsetParent;
  return e;
}, Yg = (t, e) => {
  let s = 0, n = t;
  for (; n && n !== e; )
    s += n.offsetTop, n = n.offsetParent;
  return n === e ? s : io(t) - io(e);
}, Qa = ({ viewport: t, anchor: e, tallerThan: s, visibleHeight: n }) => {
  const r = Yg(e, t), o = e.offsetHeight;
  return r + Math.max(0, o - (o <= s ? o : n));
}, Jg = ({ scrollHeight: t, ...e }) => {
  const { viewport: s } = e, n = Qa(e) + s.clientHeight;
  return Math.max(0, n - t);
}, Qg = ({ viewport: t, reserve: e, ...s }) => Jg({
  viewport: t,
  ...s,
  scrollHeight: t.scrollHeight - e.offsetHeight
}), Xg = (t) => {
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
}, Zg = (t) => {
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
}, Kg = (t) => {
  let e = null, s;
  function n() {
    const a = t.getState(), { viewport: c, anchor: l, target: u } = a.element, d = a.targetConfig;
    if (a.turnAnchor !== "top" || !c || !l || !u || !d) {
      o.disconnect(), e && (oo(e, 0), e.remove());
      return;
    }
    if (e ??= gg(), (e.parentElement !== u.parentElement || e.previousElementSibling !== u) && u.after(e), o.target(c, l, u), oo(e, Qg({
      viewport: c,
      anchor: l,
      reserve: e,
      ...d
    }))) {
      r.schedule();
      return;
    }
    const h = pg(l);
    if (h !== void 0 && s === h) return;
    const m = bg(Qa({
      viewport: c,
      anchor: l,
      ...d
    }));
    Math.abs(c.scrollTop - m) > 1 && c.scrollTo({
      top: m,
      behavior: "smooth"
    }), h !== void 0 && (s = h);
  }
  const r = Zg(n), o = Xg(r.schedule);
  r.schedule();
  const i = t.subscribe(r.schedule);
  return () => {
    r.cancel(), i(), o.disconnect(), e?.remove();
  };
}, eb = (t) => {
  const e = w(4), s = ct();
  let n, r;
  e[0] !== t || e[1] !== s ? (n = () => {
    if (t)
      return Kg(s);
  }, r = [t, s], e[0] = t, e[1] = s, e[2] = n, e[3] = r) : (n = e[2], r = e[3]), ds(n, r);
}, Xa = ({ isRunning: t, messages: e }) => {
  if (!t) return null;
  const s = e.at(-1), n = e.at(-2);
  return n?.role !== "user" || s?.role !== "assistant" ? null : {
    anchorId: n.id,
    targetId: s.id
  };
}, tb = (t) => Xa(t)?.anchorId, sb = (t) => Xa(t)?.targetId, nb = () => Ja(at(ib), ab), rb = () => dt(at(cb)), ob = (t) => {
  const e = w(13), s = ct();
  let n;
  e[0] !== t ? (n = (m) => {
    if (t)
      return tb(m.thread);
  }, e[0] = t, e[1] = n) : n = e[1];
  const r = M(n);
  let o;
  e[2] !== t ? (o = (m) => {
    if (t)
      return sb(m.thread);
  }, e[2] = t, e[3] = o) : o = e[3];
  const i = M(o);
  let a;
  e: {
    if (!r || !i) {
      a = null;
      break e;
    }
    let m;
    e[4] !== r || e[5] !== i ? (m = {
      anchorId: r,
      targetId: i
    }, e[4] = r, e[5] = i, e[6] = m) : m = e[6], a = m;
  }
  const c = a;
  let l, u;
  e[7] !== c || e[8] !== s ? (l = () => {
    if (!c) return;
    const m = s.getState(), p = m.topAnchorTurn;
    p?.anchorId === c.anchorId && p.targetId === c.targetId || m.setTopAnchorTurn(c);
  }, u = [c, s], e[7] = c, e[8] = s, e[9] = l, e[10] = u) : (l = e[9], u = e[10]), ds(l, u);
  let d;
  e[11] !== s ? (d = () => {
    s.getState().setTopAnchorTurn(null);
  }, e[11] = s, e[12] = d) : d = e[12];
  const h = d;
  ms("thread.initialize", h), ms("threadListItem.switchedTo", h);
}, Za = fe((t, e) => {
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
  const u = zg(l), d = nb(), h = rb(), m = ct();
  let p;
  s[12] !== m ? (p = m.getState(), s[12] = m, s[13] = p) : p = s[13];
  const v = p.turnAnchor === "top";
  ob(v), eb(v);
  const _ = lt(e, u, d, h);
  let C;
  return s[14] !== r || s[15] !== _ || s[16] !== o ? (C = /* @__PURE__ */ f(ye.div, {
    ...o,
    ref: _,
    children: r
  }), s[14] = r, s[15] = _, s[16] = o, s[17] = C) : C = s[17], C;
});
Za.displayName = "ThreadPrimitive.ViewportScrollable";
const Ka = fe((t, e) => {
  const s = w(13);
  let n, r, o;
  s[0] !== t ? ({ turnAnchor: o, topAnchorMessageClamp: r, ...n } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o) : (n = s[1], r = s[2], o = s[3]);
  let i;
  s[4] !== r || s[5] !== o ? (i = {
    turnAnchor: o,
    topAnchorMessageClamp: r
  }, s[4] = r, s[5] = o, s[6] = i) : i = s[6];
  let a;
  s[7] !== n || s[8] !== e ? (a = /* @__PURE__ */ f(Za, {
    ...n,
    ref: e
  }), s[7] = n, s[8] = e, s[9] = a) : a = s[9];
  let c;
  return s[10] !== i || s[11] !== a ? (c = /* @__PURE__ */ f(ar, {
    options: i,
    children: a
  }), s[10] = i, s[11] = a, s[12] = c) : c = s[12], c;
});
Ka.displayName = "ThreadPrimitive.Viewport";
function ib(t) {
  return t.registerViewport;
}
function ab(t) {
  return t.clientHeight;
}
function cb(t) {
  return t.registerViewportElement;
}
const ec = fe((t, e) => {
  const s = w(3), n = lt(e, Ja(at(lb), ub));
  let r;
  return s[0] !== t || s[1] !== n ? (r = /* @__PURE__ */ f(ye.div, {
    ...t,
    ref: n
  }), s[0] = t, s[1] = n, s[2] = r) : r = s[2], r;
});
ec.displayName = "ThreadPrimitive.ViewportFooter";
function lb(t) {
  return t.registerContentInset;
}
function ub(t) {
  const e = parseFloat(getComputedStyle(t).marginTop) || 0;
  return t.offsetHeight + e;
}
const db = (t) => {
  const e = w(5);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { behavior: n } = s, r = at(mb), o = ct();
  let i;
  e[2] !== n || e[3] !== o ? (i = () => {
    o.getState().scrollToBottom({ behavior: n });
  }, e[2] = n, e[3] = o, e[4] = i) : i = e[4];
  const a = i;
  return r ? null : a;
}, hb = jt("ThreadPrimitive.ScrollToBottom", db, ["behavior"]);
function mb(t) {
  return t.isAtBottom;
}
const fb = (t) => {
  const e = w(4), { prompt: s, send: n, clearComposer: r, autoSend: o } = t, i = n ?? o ?? !1;
  let a;
  e[0] !== r || e[1] !== s || e[2] !== i ? (a = {
    prompt: s,
    send: i,
    clearComposer: r
  }, e[0] = r, e[1] = s, e[2] = i, e[3] = a) : a = e[3];
  const { disabled: c, trigger: l } = sp(a);
  return c ? null : l;
}, pb = jt("ThreadPrimitive.Suggestion", fb, [
  "prompt",
  "send",
  "clearComposer",
  "autoSend",
  "method"
]);
var Et = /* @__PURE__ */ lr({
  Empty: () => Wa,
  If: () => Ya,
  MessageByIndex: () => Zi,
  Messages: () => Bm,
  Root: () => Ga,
  ScrollToBottom: () => hb,
  Suggestion: () => pb,
  SuggestionByIndex: () => ba,
  Suggestions: () => Of,
  Unstable_MessageById: () => Ki,
  Viewport: () => Ka,
  ViewportFooter: () => ec,
  ViewportProvider: () => ar
});
function gb({
  controller: t,
  children: e
}) {
  const s = O(
    async (o) => {
      const i = o.content.filter((a) => a.type === "text").map((a) => a.text).join("").trim();
      i && await t.send(Lo(i));
    },
    [t.send]
  ), n = O(() => t.stop(), [t.stop]), r = km({
    messages: t.messages,
    isRunning: t.running,
    isLoading: t.sessionLoading,
    isDisabled: t.sessionLoading,
    isSendDisabled: t.sendDisabled,
    convertMessage: bb,
    onNew: s,
    onCancel: n
  });
  return /* @__PURE__ */ f(dp, { runtime: r, children: e });
}
function bb(t) {
  return t.role === "user" ? {
    id: t.id,
    role: "user",
    content: t.text ? [{ type: "text", text: t.text }] : [],
    metadata: {
      custom: ao(t)
    }
  } : {
    id: t.id,
    role: "assistant",
    content: Rc(t),
    status: t.running ? { type: "running" } : t.error ? { type: "incomplete", reason: "error", error: t.text } : { type: "complete", reason: "stop" },
    metadata: {
      custom: ao(t)
    }
  };
}
function ao(t) {
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
const mn = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!mn || Object.keys(mn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const Rt = mn.Button, je = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!je || Object.keys(je).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const co = je.Dialog, lo = je.DialogContent, uo = je.DialogDescription, ho = je.DialogFooter, mo = je.DialogHeader, fo = je.DialogTitle, fn = window.DeverFront?.sdk?.getCompatModule("@/components/ui/input");
if (!fn || Object.keys(fn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/input");
const _b = fn.Input, pn = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!pn || Object.keys(pn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const vb = pn.cn, gn = 152, po = 76, go = 6, At = 8;
function yb({
  session: t,
  active: e,
  controller: s
}) {
  const [n, r] = G(!1), [o, i] = G(!1), [a, c] = G(t.title), [l, u] = G(""), [d, h] = G(!1), [m, p] = G(!1), [v, _] = G(!1), [C, I] = G({
    top: 0,
    left: 0
  }), E = ne(null), b = ne(null);
  le(() => {
    if (!v)
      return;
    const P = (L) => {
      const B = L.target;
      B instanceof Node && (E.current?.contains(B) || b.current?.contains(B) || _(!1));
    }, z = (L) => {
      L.key === "Escape" && _(!1);
    }, Q = () => _(!1);
    return document.addEventListener("pointerdown", P, !0), document.addEventListener("keydown", z), document.addEventListener("scroll", Q, !0), window.addEventListener("resize", Q), () => {
      document.removeEventListener("pointerdown", P, !0), document.removeEventListener("keydown", z), document.removeEventListener("scroll", Q, !0), window.removeEventListener("resize", Q);
    };
  }, [v]);
  const y = () => {
    _(!1), c(t.title), u(""), r(!0);
  }, T = async (P) => {
    P.preventDefault();
    const z = a.trim();
    if (!z) {
      u("请输入会话标题");
      return;
    }
    h(!0), u("");
    try {
      await s.renameSession(t.id, z), r(!1);
    } catch (Q) {
      u(bo(Q, "编辑标题失败"));
    } finally {
      h(!1);
    }
  }, x = async () => {
    p(!0), u("");
    try {
      await s.deleteSession(t.id), i(!1);
    } catch (P) {
      u(bo(P, "删除会话失败"));
    } finally {
      p(!1);
    }
  }, S = (P) => {
    if (P.stopPropagation(), v) {
      _(!1);
      return;
    }
    E.current && (I(wb(E.current)), _(!0));
  }, q = v && typeof document < "u" ? Xc(
    /* @__PURE__ */ F(
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
          width: gn,
          zIndex: ns,
          pointerEvents: "auto"
        },
        onClick: (P) => P.stopPropagation(),
        children: [
          /* @__PURE__ */ F(
            "button",
            {
              type: "button",
              role: "menuitem",
              className: "flex w-full items-center gap-2 rounded-sm border-0 bg-transparent px-2 py-1.5 text-left text-sm outline-none hover:bg-accent focus-visible:bg-accent",
              onClick: y,
              children: [
                /* @__PURE__ */ f(bc, { className: "size-4 shrink-0" }),
                "编辑标题"
              ]
            }
          ),
          /* @__PURE__ */ F(
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
                /* @__PURE__ */ f(_c, { className: "size-4 shrink-0" }),
                "删除"
              ]
            }
          )
        ]
      }
    ),
    Sb(E.current)
  ) : null;
  return /* @__PURE__ */ F(Me, { children: [
    /* @__PURE__ */ f("span", { ref: E, className: "flex shrink-0", children: /* @__PURE__ */ f(qo, { label: "会话操作", children: /* @__PURE__ */ f(
      Rt,
      {
        type: "button",
        variant: "ghost",
        size: "icon",
        className: vb(
          "size-7 shrink-0 text-muted-foreground transition-opacity hover:text-foreground",
          e ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
        ),
        "aria-label": `管理会话：${t.title}`,
        "aria-haspopup": "menu",
        "aria-expanded": v,
        onClick: S,
        children: /* @__PURE__ */ f(vc, { className: "size-4" })
      }
    ) }) }),
    q,
    /* @__PURE__ */ f(
      co,
      {
        open: n,
        onOpenChange: (P) => {
          d || r(P);
        },
        children: /* @__PURE__ */ F(
          lo,
          {
            "data-assistant-layer": "true",
            layerZIndex: ns,
            showCloseButton: !d,
            className: "sm:max-w-md",
            children: [
              /* @__PURE__ */ F(mo, { children: [
                /* @__PURE__ */ f(fo, { children: "编辑标题" }),
                /* @__PURE__ */ f(uo, { children: "修改左侧显示的会话标题。" })
              ] }),
              /* @__PURE__ */ F("form", { className: "space-y-4", onSubmit: T, children: [
                /* @__PURE__ */ f(
                  _b,
                  {
                    autoFocus: !0,
                    value: a,
                    maxLength: 255,
                    disabled: d,
                    "aria-label": "会话标题",
                    onChange: (P) => c(P.target.value)
                  }
                ),
                l ? /* @__PURE__ */ f("p", { className: "text-sm text-destructive", children: l }) : null,
                /* @__PURE__ */ F(ho, { children: [
                  /* @__PURE__ */ f(
                    Rt,
                    {
                      type: "button",
                      variant: "outline",
                      disabled: d,
                      onClick: () => r(!1),
                      children: "取消"
                    }
                  ),
                  /* @__PURE__ */ f(Rt, { type: "submit", disabled: d || !a.trim(), children: d ? "保存中..." : "保存" })
                ] })
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ f(
      co,
      {
        open: o,
        onOpenChange: (P) => {
          m || i(P);
        },
        children: /* @__PURE__ */ F(
          lo,
          {
            "data-assistant-layer": "true",
            layerZIndex: ns,
            showCloseButton: !m,
            className: "sm:max-w-md",
            children: [
              /* @__PURE__ */ F(mo, { children: [
                /* @__PURE__ */ f(fo, { children: "删除对话？" }),
                /* @__PURE__ */ F(uo, { children: [
                  "删除后，“",
                  t.title,
                  "”将从历史会话中移除。"
                ] })
              ] }),
              l ? /* @__PURE__ */ f("p", { className: "text-sm text-destructive", children: l }) : null,
              /* @__PURE__ */ F(ho, { children: [
                /* @__PURE__ */ f(
                  Rt,
                  {
                    type: "button",
                    variant: "outline",
                    disabled: m,
                    onClick: () => i(!1),
                    children: "取消"
                  }
                ),
                /* @__PURE__ */ f(
                  Rt,
                  {
                    type: "button",
                    variant: "destructive",
                    disabled: m,
                    onClick: () => {
                      x();
                    },
                    children: m ? "删除中..." : "删除"
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
function bo(t, e) {
  return t instanceof Error && t.message.trim() ? t.message.trim() : e;
}
function wb(t) {
  const e = t.getBoundingClientRect(), s = Math.max(
    At,
    window.innerWidth - gn - At
  ), n = Math.min(
    s,
    Math.max(At, e.right - gn)
  ), r = e.bottom + go;
  return { top: r + po <= window.innerHeight - At ? r : Math.max(At, e.top - po - go), left: n };
}
function Sb(t) {
  return t?.closest('[data-agent-chat-layer="true"]') || document.body;
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/lib/utils"]);
const bn = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!bn || Object.keys(bn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const xb = bn.Button, _n = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!_n || Object.keys(_n).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const _o = _n.cn;
function vo({
  agentName: t,
  title: e,
  agentReady: s,
  controller: n,
  collapsed: r = !1,
  mobile: o = !1,
  onOpenSession: i,
  onStartNewSession: a
}) {
  return /* @__PURE__ */ F(
    "aside",
    {
      className: _o(
        "agent-chat-sidebar h-full shrink-0 flex-col bg-muted/25",
        o ? "flex w-full md:hidden" : "hidden border-r",
        !o && !r && "md:flex"
      ),
      style: o ? void 0 : {
        width: "var(--agent-chat-sidebar-width, 300px)",
        minWidth: "var(--agent-chat-sidebar-width, 300px)",
        flexBasis: "var(--agent-chat-sidebar-width, 300px)"
      },
      children: [
        /* @__PURE__ */ f("div", { className: "agent-chat-sidebar-header shrink-0 border-b p-3", children: /* @__PURE__ */ F("div", { className: "agent-chat-sidebar-controls flex min-w-0 items-center gap-2", children: [
          /* @__PURE__ */ f("div", { className: "agent-chat-sidebar-name min-w-0 flex-1 truncate px-2 py-1 text-left text-sm font-semibold text-foreground", children: e ?? (t || "智能体") }),
          /* @__PURE__ */ F(
            xb,
            {
              type: "button",
              variant: "outline",
              className: "agent-chat-new-session h-10 shrink-0 justify-start gap-2 bg-background px-3",
              disabled: n.sessionLoading || !s,
              onClick: () => {
                a ? a() : n.startNewSession();
              },
              children: [
                /* @__PURE__ */ f("span", { className: "agent-chat-new-session-icon contents", children: /* @__PURE__ */ f(No, { className: "size-4" }) }),
                /* @__PURE__ */ f("span", { children: "新对话" })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ F("div", { className: "agent-chat-session-section flex min-h-0 flex-1 flex-col", children: [
          /* @__PURE__ */ f("div", { className: "agent-chat-session-heading shrink-0 px-4 pb-2 pt-4 text-xs font-medium text-muted-foreground", children: "历史会话" }),
          /* @__PURE__ */ f(
            "div",
            {
              ref: n.sessionListRef,
              className: "agent-chat-session-list min-h-0 flex-1 overflow-y-auto px-2 pb-3",
              onScroll: (c) => n.handleSessionListScroll(c.currentTarget),
              children: n.sessionsLoading && n.sessions.length === 0 ? /* @__PURE__ */ f("div", { className: "flex h-24 items-center justify-center text-muted-foreground", children: /* @__PURE__ */ f(Mt, { className: "size-4 animate-spin" }) }) : n.sessions.length === 0 ? /* @__PURE__ */ f("div", { className: "px-2 py-6 text-center text-xs leading-5 text-muted-foreground", children: "暂无历史会话" }) : /* @__PURE__ */ F("div", { className: "space-y-1", children: [
                n.sessions.map((c) => /* @__PURE__ */ F(
                  "div",
                  {
                    className: _o(
                      "agent-chat-session-item group flex min-h-10 w-full items-center rounded-md px-1 transition-colors",
                      c.id === n.sessionID ? "bg-background font-medium text-foreground shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                    ),
                    children: [
                      /* @__PURE__ */ F(
                        "button",
                        {
                          type: "button",
                          className: "agent-chat-session-trigger flex min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left text-sm",
                          onClick: () => {
                            i ? i(c.id) : n.openSession(c.id);
                          },
                          children: [
                            c.running ? /* @__PURE__ */ f(Mt, { className: "size-3.5 shrink-0 animate-spin" }) : /* @__PURE__ */ f(yc, { className: "size-3.5 shrink-0" }),
                            /* @__PURE__ */ f("span", { className: "min-w-0 flex-1 truncate", children: c.title })
                          ]
                        }
                      ),
                      /* @__PURE__ */ f(
                        yb,
                        {
                          session: c,
                          active: c.id === n.sessionID,
                          controller: n
                        }
                      )
                    ]
                  },
                  c.id
                )),
                n.sessionsLoadingMore ? /* @__PURE__ */ f("div", { className: "flex h-10 items-center justify-center text-muted-foreground", children: /* @__PURE__ */ f(Mt, { className: "size-4 animate-spin" }) }) : null
              ] })
            }
          )
        ] })
      ]
    }
  );
}
const Ib = 32;
function Tb(t, e, s = Ib) {
  let n = t, r = null, o = !0, i = 0;
  const a = () => {
    r != null && (clearTimeout(r), r = null);
  }, c = () => {
    a(), i = yo(), e(n);
  }, l = () => {
    if (r != null)
      return;
    const u = yo() - i, d = Math.max(0, s - u);
    r = setTimeout(c, d);
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
function yo() {
  return typeof performance > "u" ? Date.now() : performance.now();
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-runner", "@/lib/runtime-stream-output", "@/lib/stream"]);
const Lt = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-runner");
if (!Lt || Object.keys(Lt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-runner");
const Cb = Lt.runRuntimeStream, Eb = Lt.stopRuntimeStream, Rb = Lt.watchRuntimeStream, vn = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!vn || Object.keys(vn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const Hs = vn.runtimeErrorMessage, yn = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!yn || Object.keys(yn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const wo = yn.streamValueText;
function Ab({
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
  getSessionMessages: d,
  updateSessionMessages: h,
  updateSessionTitle: m,
  syncSessionTitle: p,
  setSessionRunning: v,
  setError: _
}) {
  const [C, I] = G({}), E = ne(/* @__PURE__ */ new Map()), b = O(
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
      g.detached || h(
        g.sessionID,
        (D) => D.map(
          (N) => wn(N, g) ? {
            ...N,
            ...typeof A == "function" ? A(N) : A
          } : N
        )
      );
    },
    [h]
  ), S = O(
    (g, A) => {
      E.current.get(g.sessionID) === g && (g.buffer.flush(), x(g, (D) => {
        const N = jo(A.output), H = tl(
          A.output?.document
        ), Y = {
          text: A.text,
          requestID: A.requestID || g.requestID || void 0,
          running: !1,
          error: !!A.error,
          activities: sl(
            D.activities,
            N
          )
        };
        return nl(A.output) && (Y.output = A.output), Y.document = vs(
          D.document,
          H
        ), H && D.document?.id !== H.id && (Y.autoOpenDocument = !0), Y;
      }), T(g), g.kind !== "opening" && p(g.sessionID));
    },
    [T, p, x]
  ), q = O(
    (g, A) => {
      if (g.detached || E.current.get(g.sessionID) !== g)
        return !1;
      const D = rl(A);
      if (D.requestID && !g.requestID && (g.requestID = D.requestID), D.streamID && (g.lastStreamID = D.streamID), D.runVersion > 0) {
        if (g.runVersion > D.runVersion)
          return !0;
        g.runVersion = D.runVersion;
      }
      D.assistantMessageID > 0 && x(g, { recordID: D.assistantMessageID }), D.cancelable != null && D.cancelable !== g.cancelable && (g.cancelable = D.cancelable, b(g)), Mb(D.event, D.output) && x(g, (H) => {
        const Y = Uo(
          H.document,
          D.output
        );
        return {
          document: Y,
          autoOpenDocument: H.autoOpenDocument || D.event === "document_start" && !!Y && H.document?.id !== Y?.id,
          requestID: D.requestID || g.requestID || void 0,
          running: !0
        };
      }), D.event === "reset" && (g.replayPending = !1, g.buffer.reset(wo(D.output.text)), g.buffer.flush()), D.delta && (g.replayPending && (g.replayPending = !1, g.buffer.reset()), g.buffer.append(D.delta));
      const N = D.activity;
      if (N) {
        g.buffer.flush();
        const H = N.anchorText ? N : { ...N, anchorText: g.buffer.text };
        x(g, (Y) => ({
          activities: ol(
            Y.activities,
            H
          ),
          requestID: D.requestID || g.requestID || void 0,
          running: !0
        }));
      }
      return g.kind === "opening" && D.finished && D.event === "opening_skipped" ? (h(
        g.sessionID,
        (H) => H.filter((Y) => !wn(Y, g))
      ), T(g), !1) : D.finished ? (S(g, {
        text: So({
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
    [S, b, T, x, h]
  ), P = O(
    (g) => {
      let A;
      const D = Tb(g.text || "", (N) => {
        x(A, {
          text: N,
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
  ), z = O(
    (g, A) => {
      if (!il(A.status))
        return !1;
      const D = A.status === "fail", N = A.status === "canceled", H = So({
        text: A.text,
        streamedText: g.buffer.text,
        error: A.error,
        failed: D,
        canceled: N
      });
      return S(g, {
        text: H,
        error: D,
        requestID: A.requestID,
        output: A.output
      }), D && l() === g.sessionID && _(A.error.trim() || H), !0;
    },
    [S, l, _]
  ), Q = O(
    async (g, A) => {
      const D = A.requestID || "";
      if (!D || !g || E.current.has(g))
        return;
      const N = P({
        kind: A.kind === "opening" ? "opening" : "chat",
        sessionID: g,
        requestID: D,
        userMessageID: "",
        assistantMessageID: A.id,
        createdAt: A.createdAt,
        text: A.text,
        replayPending: !!A.text
      });
      if (!y(N)) {
        N.buffer.dispose();
        return;
      }
      try {
        const H = await vr(
          a.status,
          D
        );
        if (N.detached || E.current.get(g) !== N || (N.runVersion = Math.max(N.runVersion, H.runVersion), z(N, H)) || (await Rb({
          streamApi: a.stream,
          requestID: D,
          lastID: N.lastStreamID,
          blockMs: i,
          signal: N.controller.signal,
          // applyFrame only returns false for the current run version. Old
          // terminal frames from an interrupted attempt must not stop replay.
          stopOnResult: !1,
          recoverOnError: !0,
          fallbackToPoll: !1,
          onFrame: (ie) => q(N, ie) ? void 0 : !1
        }), N.detached || N.controller.signal.aborted || E.current.get(g) !== N))
          return;
        const Y = await vr(
          a.status,
          D
        );
        z(N, Y);
      } catch (H) {
        if (N.detached || N.controller.signal.aborted || E.current.get(g) !== N)
          return;
        const Y = Hs(
          H,
          "恢复智能体运行失败。"
        );
        S(N, {
          text: N.buffer.text.trim() || Y,
          error: !0,
          requestID: D
        }), l() === g && _(Y);
      }
    },
    [
      q,
      i,
      P,
      S,
      z,
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
    g && Q(r, g);
  }, [o, s, Q, r, n]);
  const L = O(
    async (g, A, D) => {
      _("");
      try {
        const N = await Cb({
          requestApi: A,
          streamApi: a.stream,
          stopApi: a.stop,
          stopOnAbort: !1,
          fallbackToPoll: !1,
          blockMs: i,
          signal: g.controller.signal,
          body: D,
          onRequestID: (ie) => {
            g.detached || (g.requestID = ie, b(g), x(g, { requestID: ie }));
          },
          onFrame: (ie) => {
            q(g, ie);
          }
        });
        if (g.detached || g.stopped || E.current.get(g.sessionID) !== g)
          return;
        const H = al(N.finalOutput), Y = wo(
          N.finalOutput?.text || N.textOutput || g.buffer.text
        ).trim();
        S(g, {
          text: Y,
          output: H,
          requestID: N.requestID
        });
      } catch (N) {
        if (g.detached || g.stopped || E.current.get(g.sessionID) !== g)
          return;
        const H = Hs(
          N,
          g.kind === "opening" ? "智能体开场失败。" : "智能体运行失败。"
        );
        S(g, {
          text: g.buffer.text.trim() || H,
          error: !0,
          requestID: g.requestID
        }), l() === g.sessionID && _(H);
      }
    },
    [
      q,
      i,
      S,
      l,
      b,
      a.stop,
      a.stream,
      _,
      x
    ]
  ), B = O(
    async (g) => {
      const A = g.text.trim(), D = l();
      if (!Vo(g) || !t || !D || E.current.has(D))
        return;
      const N = Date.now(), H = new Date(N).toISOString(), Y = {
        id: `${D}-user-${N}`,
        role: "user",
        text: A,
        createdAt: H,
        content: g.content
      }, ie = `${D}-assistant-${N}`, pe = P({
        sessionID: D,
        userMessageID: Y.id,
        assistantMessageID: ie,
        createdAt: H,
        prompt: A,
        content: g.content
      });
      if (!y(pe)) {
        pe.buffer.dispose();
        return;
      }
      m(
        D,
        kb(u(D), A)
      ), h(D, (ke) => [
        ...ke,
        Y,
        {
          id: ie,
          role: "assistant",
          text: "",
          createdAt: H,
          running: !0
        }
      ]), await L(pe, a.request, {
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
      L,
      l,
      u,
      y,
      c,
      a.request,
      h,
      m
    ]
  ), te = O(
    async (g) => {
      const A = a.opening?.trim() || "";
      if (!A || !t || !g || E.current.has(g))
        return;
      const D = Date.now(), N = new Date(D).toISOString(), H = d(g).find(
        (pe) => pe.role === "assistant" && pe.kind === "opening" && !!pe.requestID
      ), Y = H?.id || `${g}-opening-${D}`, ie = P({
        kind: "opening",
        sessionID: g,
        requestID: H?.requestID,
        userMessageID: "",
        assistantMessageID: Y,
        createdAt: H?.createdAt || N,
        text: H?.text,
        replayPending: !!(H?.running && H.text)
      });
      if (!y(ie)) {
        ie.buffer.dispose();
        return;
      }
      H || h(g, (pe) => [
        ...pe,
        {
          id: Y,
          role: "assistant",
          kind: "opening",
          text: "",
          createdAt: N,
          running: !0
        }
      ]), await L(ie, A, {
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
      L,
      d,
      y,
      c,
      a.opening,
      h
    ]
  ), ce = O(async () => {
    const g = l(), A = E.current.get(g);
    if (!(!A?.requestID || !A.cancelable || A.stopping)) {
      A.stopping = !0, b(A), _("");
      try {
        if (await Eb(A.requestID, a.stop), E.current.get(g) !== A)
          return;
        A.stopped = !0, A.controller.abort(), S(A, {
          text: A.buffer.text.trim() || "已停止生成",
          requestID: A.requestID
        });
      } catch (D) {
        if (E.current.get(g) !== A)
          return;
        A.stopping = !1, b(A), l() === g && _(Hs(D, "停止生成失败。"));
      }
    }
  }, [S, l, b, a.stop, _]), V = O(
    (g) => E.current.has(g),
    []
  ), j = O(
    (g, A) => Db(A, E.current.get(g)),
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
  const Z = C[r];
  return {
    running: !!(Z || o.some(
      (g) => g.role === "assistant" && g.running
    )),
    stopping: !!Z?.stopping,
    cancelable: !!Z?.cancelable,
    hasRun: V,
    mergeMessages: j,
    reset: ee,
    send: B,
    startOpening: te,
    stop: ce
  };
}
function wn(t, e) {
  return t.id === e.assistantMessageID || !!(e.requestID && t.requestID === e.requestID);
}
function Mb(t, e) {
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
function Db(t, e) {
  if (!e)
    return t;
  let s = !1;
  const n = t.map((r) => wn(r, e) ? (s = !0, {
    ...r,
    requestID: e.requestID || r.requestID,
    text: e.buffer.text || r.text,
    running: !0,
    error: !1
  }) : r);
  return s ? n : [
    ...n,
    ...e.input || Ac(e.content) ? [
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
function kb(t, e) {
  return t.trim() && t.trim() !== "新会话" ? t : Array.from(e.trim().replace(/\s+/g, " ")).slice(0, 40).join("") || "新会话";
}
function So(t) {
  const e = t.text?.trim() || t.streamedText?.trim() || "";
  return e || (t.canceled ? "已停止生成" : t.failed ? t.error?.trim() || "智能体运行失败。" : "");
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-runner", "@/lib/runtime-stream-output"]);
const Sn = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-runner");
if (!Sn || Object.keys(Sn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-runner");
const Pb = Sn.watchRuntimeStream, xn = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!xn || Object.keys(xn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const $b = xn.normalizeRuntimeFrameOutput;
function Ob({
  modalOpen: t,
  sessionID: e,
  messages: s,
  blockMs: n,
  runtimeApi: r,
  updateDocument: o
}) {
  const i = ne(/* @__PURE__ */ new Map());
  le(() => {
    const a = i.current;
    if (!t || !e) {
      xo(a);
      return;
    }
    const c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
    for (const u of s)
      u.document && (c.set(u.document.id, u.document), cl(u.document) && l.set(u.document.id, u.document));
    for (const [u, d] of a) {
      const h = c.get(u);
      if (!h || d.sessionID !== e) {
        d.controller.abort(), a.delete(u);
        continue;
      }
      d.document = vs(d.document, h) || h;
    }
    for (const u of l.values()) {
      if (a.has(u.id))
        continue;
      const d = {
        sessionID: e,
        controller: new AbortController(),
        document: u
      };
      a.set(u.id, d), Nb({
        watch: d,
        watches: a,
        blockMs: n,
        runtimeApi: r,
        updateDocument: o
      });
    }
  }, [n, s, t, r, e, o]), le(() => {
    const a = i.current;
    return () => xo(a);
  }, []);
}
async function Nb(t) {
  const { watch: e, watches: s, blockMs: n, runtimeApi: r, updateDocument: o } = t, i = e.document.id;
  let a = null, c = 0, l = 0;
  const u = (m) => {
    !m || e.controller.signal.aborted || (e.document = m, o(e.sessionID, i, m));
  }, d = async () => {
    const m = await Mc(
      r.document,
      i
    );
    return u(vs(e.document, m)), m;
  }, h = () => {
    if (a || e.controller.signal.aborted)
      return;
    const m = new AbortController(), p = () => m.abort();
    a = m, c = Date.now(), e.controller.signal.addEventListener("abort", p, { once: !0 }), Pb({
      streamApi: r.documentStream,
      requestID: `document:${i}`,
      blockMs: n,
      signal: m.signal,
      stopOnResult: !1,
      recoverOnError: !0,
      fallbackToPoll: !1,
      onFrame: (v) => {
        c = Date.now();
        const _ = Lb(v);
        u(Uo(e.document, _)), Vb(_) === "document_complete" && d().catch(() => {
        });
      }
    }).catch(() => {
    }).finally(() => {
      e.controller.signal.removeEventListener("abort", p), a === m && (a = null);
    });
  };
  try {
    h();
    try {
      const m = await d();
      if (!cs(m))
        return;
    } catch {
      if (e.controller.signal.aborted)
        return;
      l = 1;
    }
    for (; !e.controller.signal.aborted; ) {
      if (await Fb(
        e.controller.signal,
        Bb(l)
      ), e.controller.signal.aborted)
        return;
      if (!(a !== null && Date.now() - c < Math.max(6e3, n * 3)))
        try {
          const p = await d();
          if (!cs(p))
            return;
          l = Math.min(l + 1, 3), h();
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
function Bb(t) {
  const e = [2e3, 4e3, 8e3, 12e3];
  return e[Math.min(t, e.length - 1)] ?? e[e.length - 1];
}
function Fb(t, e) {
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
function Lb(t) {
  return $b(t.output, t);
}
function Vb(t) {
  return String(t.event || t.semantic_event || "").trim().toLowerCase();
}
function xo(t) {
  for (const e of t.values())
    e.controller.abort();
  t.clear();
}
const es = [800, 1500, 3e3, 5e3, 8e3];
function qb({
  modalOpen: t,
  sessionID: e,
  messages: s,
  refreshSession: n
}) {
  const r = Ub(s);
  le(() => {
    if (!t || !e || !r)
      return;
    const o = new AbortController();
    return jb(e, o.signal, n), () => o.abort();
  }, [t, r, n, e]);
}
async function jb(t, e, s) {
  let n = 0;
  for (; !e.aborted; ) {
    const r = es[Math.min(n, es.length - 1)] ?? es[es.length - 1];
    if (await Hb(e, r), e.aborted)
      return;
    try {
      await s(t);
    } catch {
    }
    n += 1;
  }
}
function Ub(t) {
  return t.filter((e) => !e.document).flatMap(
    (e) => Ho(e.output).filter((s) => s.status === "generating").map((s) => s.id)
  ).sort((e, s) => e - s).join(":");
}
function Hb(t, e) {
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
function Io(t, e, s) {
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
function zb(t, e) {
  const s = new Set(t.map((n) => n.id));
  return [
    ...t,
    ...e.filter((n) => !s.has(n.id))
  ];
}
function Gb(t, e) {
  const s = new Set(
    t.map((r) => r.recordID).filter((r) => !!r)
  );
  return [...e.filter(
    (r) => !r.recordID || !s.has(r.recordID)
  ), ...t];
}
function To(t, e) {
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
function zs(t) {
  return t.map((e, s) => ({
    id: e.id ? `saved-${e.id}` : `saved-${s}`,
    recordID: e.id || void 0,
    role: e.role,
    kind: e.kind,
    text: e.text,
    createdAt: e.createdAt,
    content: e.content,
    output: e.output,
    activities: jo(e.output),
    requestID: e.requestID || void 0,
    running: e.status === 3,
    error: e.status === 2,
    document: e.document
  }));
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output"]);
const In = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!In || Object.keys(In).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const We = In.runtimeErrorMessage, Co = 20, ts = 20, Eo = 10, Gs = 48, Wb = [500, 1e3, 2e3, 4e3, 8e3, 8e3];
function Yb({
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
  const u = e?.trim() || (t ? `agent-runtime:${t}` : ""), [d, h] = G([]), [m, p] = G(0), [v, _] = G("新会话"), [C, I] = G([]), [E, b] = G(!1), [y, T] = G(!1), [x, S] = G(!1), [q, P] = G(""), [z, Q] = G([]), L = ne(0), B = ne(/* @__PURE__ */ new Map()), te = ne(
    /* @__PURE__ */ new Map()
  ), ce = ne(""), V = ne(0), j = ne(0), ee = ne(0), Z = ne(!1), g = ne(!1), A = ne(!1), D = ne(0), N = ne(null), H = ne(null), Y = O(
    (R, $) => {
      L.current = R, p(R), _($.title), I($.messages), D.current = 0;
    },
    []
  ), ie = O(
    (R, $) => {
      B.current.set(R, $), L.current === R && (_($.title), I($.messages));
    },
    []
  ), pe = O(() => L.current, []), ke = O((R) => B.current.get(R)?.title || "新会话", []), St = O((R) => B.current.get(R)?.messages || [], []), Pe = O(
    (R, $) => {
      const k = B.current.get(R);
      k && ie(R, {
        ...k,
        messages: $(k.messages)
      });
    },
    [ie]
  ), J = O(
    (R, $, k) => {
      Pe(
        R,
        (U) => U.map(
          (W) => W.document?.id === $ || k.messageID > 0 && W.recordID === k.messageID ? {
            ...W,
            document: vs(W.document, k) || k
          } : W
        )
      );
    },
    [Pe]
  ), X = O(
    (R, $) => {
      const k = B.current.get(R);
      k && ie(R, { ...k, title: $ }), h(
        (U) => U.map(
          (W) => W.id === R ? { ...W, title: $ } : W
        )
      );
    },
    [ie]
  ), ae = O(
    async (R) => {
      const $ = `${t}:${u}`;
      for (const k of Wb) {
        if (await Jb(k), ce.current !== $)
          return;
        try {
          const U = await Dc(i, {
            agentKey: t,
            contextKey: u,
            sessionID: R
          });
          if (!U)
            return;
          if (U.titleSource === "llm" || U.titleSource === "manual") {
            X(R, U.title);
            return;
          }
        } catch {
        }
      }
    },
    [t, i, u, X]
  ), ue = O(
    (R, $) => {
      h((k) => {
        const U = k.find(
          (W) => W.id === R
        );
        return U ? Io(k, { ...U, running: $ }, $) : k;
      });
    },
    []
  ), xt = O(
    (R) => kc(
      {
        api: i,
        agentKey: t,
        contextKey: u,
        sessionID: L.current
      },
      R
    ),
    [t, i, u]
  ), Ht = O(
    (R) => {
      const $ = L.current;
      if (!$ || !t)
        return Promise.reject(new Error("当前会话不可用"));
      const k = `${$}:${R.refType}:${R.refId}`, U = te.current.get(k);
      if (U)
        return U;
      const W = Pc(
        a.referencePreview,
        { agentKey: t, sessionID: $ },
        R
      );
      return te.current.set(k, W), W.catch(() => {
        te.current.get(k) === W && te.current.delete(k);
      }), W;
    },
    [t, a.referencePreview]
  ), se = Ab({
    agentKey: t,
    contextKey: u,
    modalOpen: s,
    sessionLoading: x,
    sessionID: m,
    messages: C,
    blockMs: n,
    runtimeApi: a,
    requestScope: c,
    getActiveSessionID: pe,
    getSessionTitle: ke,
    getSessionMessages: St,
    updateSessionMessages: Pe,
    updateSessionTitle: X,
    syncSessionTitle: ae,
    setSessionRunning: ue,
    setError: P
  });
  Ob({
    modalOpen: s,
    sessionID: m,
    messages: C,
    blockMs: n,
    runtimeApi: a,
    updateDocument: J
  });
  const oc = O(
    async (R) => {
      if (!t || !u || L.current !== R)
        return;
      const $ = await Ct(i, {
        agentKey: t,
        contextKey: u,
        sessionID: R,
        limit: ts
      });
      if (L.current !== R)
        return;
      const k = se.mergeMessages(
        R,
        zs($.messages)
      );
      Pe(
        R,
        (U) => To(U, k)
      );
    },
    [
      t,
      i,
      u,
      se.mergeMessages,
      Pe
    ]
  );
  qb({
    modalOpen: s,
    sessionID: m,
    messages: C,
    refreshSession: oc
  });
  const ht = O(
    (R, $ = !1) => {
      const k = R.session?.id || 0;
      if (!k)
        return;
      const U = se.mergeMessages(
        k,
        zs(R.messages)
      ), W = B.current.get(k), ve = W ? To(W.messages, U) : U, we = {
        title: R.session?.title || "新会话",
        messages: ve,
        oldestMessageID: W?.oldestMessageID || R.messages[0]?.id || 0,
        canLoadOlder: W?.canLoadOlder ?? R.messages.length > 0
      };
      if (B.current.set(k, we), Y(k, we), R.session) {
        const Ue = {
          ...R.session,
          running: se.hasRun(k) || ve.some((Le) => Le.running)
        };
        h(
          (Le) => Io(Le, Ue, $)
        );
      }
    },
    [se.hasRun, se.mergeMessages, Y]
  ), fr = O(async () => {
    if (!t || !u)
      return;
    const R = ++V.current, $ = ++j.current;
    g.current = !0, b(!0), T(!1), L.current || S(!0), P("");
    try {
      const k = await _r(i, {
        agentKey: t,
        contextKey: u,
        limit: Co
      });
      if (V.current !== R || j.current !== $)
        return;
      h(
        k.sessions.map((we) => ({
          ...we,
          running: !!we.running || se.hasRun(we.id)
        }))
      ), ee.current = k.sessions[k.sessions.length - 1]?.id || 0, Z.current = k.hasMore, b(!1);
      const U = k.sessions[0], W = U ? B.current.get(U.id) : void 0;
      if (U && W && (Y(U.id, W), S(!1)), !U && r && !o) {
        L.current = 0, p(0), _("新会话"), I([]);
        return;
      }
      const ve = await Ct(i, {
        agentKey: t,
        contextKey: u,
        sessionID: U?.id,
        create: !U && !o,
        title: "新会话",
        limit: ts
      });
      V.current === R && (ht(ve, !U), !U && o && ve.session?.id && se.startOpening(ve.session.id));
    } catch (k) {
      V.current === R && j.current === $ && P(We(k, "加载会话失败。"));
    } finally {
      V.current === R && j.current === $ && (g.current = !1, b(!1), S(!1));
    }
  }, [
    t,
    ht,
    i,
    u,
    r,
    o,
    se.hasRun,
    se.startOpening,
    Y
  ]), It = O(
    async (R, $ = !1) => {
      if (!t || !u)
        return;
      const k = ++V.current;
      A.current = !1;
      const U = $ ? void 0 : B.current.get(R);
      U ? (Y(R, U), S(!1)) : ($ && (L.current = 0, p(0), _("新会话"), I([])), S(!0)), P("");
      try {
        const W = await Ct(i, {
          agentKey: t,
          contextKey: u,
          sessionID: R || void 0,
          create: $,
          title: "新会话",
          limit: $ ? ts : Eo
        });
        V.current === k && (ht(W, $), $ && o && W.session?.id && se.startOpening(W.session.id));
      } catch (W) {
        V.current === k && P(We(W, "加载会话失败。"));
      } finally {
        V.current === k && S(!1);
      }
    },
    [
      t,
      ht,
      i,
      u,
      o,
      se.startOpening,
      Y
    ]
  ), pr = O(() => {
    V.current += 1, A.current = !1, L.current = 0, p(0), _("新会话"), I([]), S(!1), P("");
  }, []), As = O(
    async () => {
      if (r && !o) {
        pr();
        return;
      }
      await It(0, !0);
    },
    [r, pr, It, o]
  ), ic = O(
    async (R, $) => {
      try {
        const k = await $c(
          i,
          R,
          $
        );
        X(R, k.title), P("");
      } catch (k) {
        const U = We(k, "编辑标题失败。");
        throw P(U), new Error(U);
      }
    },
    [i, X]
  ), ac = O(
    async (R) => {
      if (se.hasRun(R))
        throw new Error("当前会话正在生成，暂时不能删除。");
      const $ = d.findIndex(
        (U) => U.id === R
      ), k = d.filter(
        (U) => U.id !== R
      );
      try {
        if (await Oc(i, R), B.current.delete(R), h(k), P(""), L.current !== R)
          return;
        const U = Math.min(
          Math.max(0, $),
          Math.max(0, k.length - 1)
        ), W = k[U];
        W ? await It(W.id, !1) : await As();
      } catch (U) {
        const W = We(U, "删除会话失败。");
        throw P(W), new Error(W);
      }
    },
    [i, It, se.hasRun, d, As]
  ), Ms = O(async () => {
    if (!t || !u || !Z.current || g.current)
      return;
    const R = j.current, $ = ee.current;
    g.current = !0, T(!0);
    try {
      const k = await _r(i, {
        agentKey: t,
        contextKey: u,
        limit: Co,
        lastSessionID: ee.current
      });
      if (j.current !== R)
        return;
      if (k.sessions.length === 0) {
        Z.current = !1;
        return;
      }
      const U = k.sessions[k.sessions.length - 1]?.id || 0;
      h(
        (W) => zb(
          W,
          k.sessions.map((ve) => ({
            ...ve,
            running: !!ve.running || se.hasRun(ve.id)
          }))
        )
      ), ee.current = U, Z.current = k.hasMore && U > 0 && U !== $;
    } catch (k) {
      j.current === R && P(We(k, "加载更多会话失败。"));
    } finally {
      j.current === R && (g.current = !1, T(!1));
    }
  }, [t, i, u, se.hasRun]), Tt = O(async () => {
    const R = L.current, $ = B.current.get(R);
    if (!R || !$?.canLoadOlder || !$.oldestMessageID || !t || !u || A.current)
      return;
    const k = H.current, U = k?.scrollHeight || 0, W = k?.scrollTop || 0, ve = V.current;
    A.current = !0;
    try {
      const we = await Ct(i, {
        agentKey: t,
        contextKey: u,
        sessionID: R,
        limit: Eo,
        lastMessageID: $.oldestMessageID
      });
      if (V.current !== ve || L.current !== R)
        return;
      const Ue = B.current.get(R);
      if (!Ue)
        return;
      if (we.messages.length === 0) {
        ie(R, {
          ...Ue,
          canLoadOlder: !1
        });
        return;
      }
      ie(R, {
        ...Ue,
        messages: Gb(
          Ue.messages,
          zs(we.messages)
        ),
        oldestMessageID: we.messages[0]?.id || Ue.oldestMessageID,
        canLoadOlder: !0
      }), window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const Le = H.current;
          !Le || L.current !== R || (Le.scrollTop = W + Le.scrollHeight - U, D.current = Le.scrollTop);
        });
      });
    } catch (we) {
      V.current === ve && L.current === R && P(We(we, "加载历史消息失败。"));
    } finally {
      V.current === ve && L.current === R && (A.current = !1);
    }
  }, [t, i, u, ie]), cc = O((R) => {
    const $ = R || N.current;
    $ && $.scrollHeight - $.scrollTop - $.clientHeight <= Gs && Ms();
  }, [Ms]), lc = O(() => {
    const R = H.current;
    if (!R)
      return;
    const $ = D.current, k = R.scrollTop;
    D.current = k, k < $ && k <= Gs && Tt();
  }, [Tt]), uc = O(
    (R) => {
      R.deltaY < 0 && R.currentTarget.scrollTop <= Gs && Tt();
    },
    [Tt]
  );
  le(() => {
    if (!s || !t)
      return;
    const R = `${t}:${u}`;
    return ce.current !== R && (ce.current = R, se.reset(), B.current.clear(), te.current.clear(), h([]), L.current = 0, p(0), _("新会话"), I([]), ee.current = 0, Z.current = !1, D.current = 0), fr(), () => {
      V.current += 1, j.current += 1, g.current = !1, A.current = !1;
    };
  }, [t, u, fr, s, se.reset]), le(() => {
    if (!s || !t) {
      Q([]);
      return;
    }
    Q([]);
    let R = !0;
    return Nc(a.inputConfig, t).then(($) => {
      R && Q($);
    }).catch(() => {
      R && Q([]);
    }), () => {
      R = !1;
    };
  }, [t, s, a.inputConfig]);
  const dc = O(
    async (R) => {
      const $ = l ? await l(R) : R;
      if (!(!Vo($) || !t)) {
        if (!L.current && r) {
          S(!0), P("");
          try {
            const k = await Ct(i, {
              agentKey: t,
              contextKey: u,
              create: !0,
              title: "新会话",
              limit: ts
            });
            ht(k, !0);
          } catch (k) {
            P(We(k, "创建会话失败。"));
            return;
          } finally {
            S(!1);
          }
        }
        await se.send($);
      }
    },
    [
      t,
      ht,
      i,
      u,
      r,
      l,
      se.send
    ]
  );
  return {
    sessionID: m,
    sessionTitle: v,
    sessions: d,
    messages: C,
    sessionsLoading: E,
    sessionsLoadingMore: y,
    sessionLoading: x,
    running: se.running,
    stopping: se.stopping,
    cancelable: se.cancelable,
    sendDisabled: !t || !m && !r || x || se.running,
    error: q,
    inputParams: z,
    sessionListRef: N,
    messageListRef: H,
    openSession: (R) => It(R, !1),
    startNewSession: As,
    renameSession: ic,
    deleteSession: ac,
    loadMoreSessions: Ms,
    loadOlderMessages: Tt,
    handleSessionListScroll: cc,
    handleMessageListScroll: lc,
    handleMessageListWheel: uc,
    loadReferences: xt,
    loadReferencePreview: Ht,
    send: dc,
    stop: se.stop
  };
}
function Jb(t) {
  return new Promise((e) => window.setTimeout(e, t));
}
const $t = 10;
function Qb({
  controller: t
}) {
  const e = qe(
    () => t.messages.filter(Xb),
    [t.messages]
  ), s = JSON.stringify(
    e.map((m) => m.id)
  ), [n, r] = G(""), [o, i] = G(0), a = ne(null);
  le(() => {
    const m = t.messageListRef.current, p = JSON.parse(s);
    if (!m || p.length === 0) {
      r("");
      return;
    }
    let v = 0;
    const _ = () => {
      v = 0;
      const I = Zb(m, p);
      r(
        (E) => E === I ? E : I
      );
    }, C = () => {
      v || (v = window.requestAnimationFrame(_));
    };
    return m.addEventListener("scroll", C, { passive: !0 }), window.addEventListener("resize", C), C(), () => {
      m.removeEventListener("scroll", C), window.removeEventListener("resize", C), v && window.cancelAnimationFrame(v);
    };
  }, [t.messageListRef, s]), le(() => {
    const m = JSON.parse(s), p = m.indexOf(n);
    i((v) => p < 0 ? Tn(v, m.length) : e_(p, m.length));
  }, [n, s]), le(() => {
    a.current && n && t_(a.current, n);
  }, [n, s]);
  const c = O(
    (m) => {
      const p = t.messageListRef.current, v = p ? Kb(p, m) : null;
      if (!p || !v)
        return;
      const _ = p.getBoundingClientRect(), C = v.getBoundingClientRect();
      r(m), p.scrollTo({
        top: Math.max(
          0,
          p.scrollTop + C.top - _.top - 24
        ),
        behavior: "smooth"
      });
    },
    [t.messageListRef]
  ), l = O(
    (m) => {
      i(
        (p) => Tn(
          p + m * $t,
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
    o + $t
  ), d = o > 0, h = o + $t < e.length;
  return /* @__PURE__ */ F("nav", { className: "agent-chat-message-navigator", "aria-label": "用户消息快速跳转", children: [
    /* @__PURE__ */ f("style", { children: s_ }),
    /* @__PURE__ */ F("div", { className: "agent-chat-message-navigator-controls", children: [
      /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: "agent-chat-message-navigator-page",
          title: "显示上一组消息",
          "aria-label": "显示上一组用户消息",
          disabled: !d,
          onClick: () => l(-1),
          children: /* @__PURE__ */ f(wc, {})
        }
      ),
      /* @__PURE__ */ f("div", { className: "agent-chat-message-navigator-rail", children: u.map((m, p) => /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: "agent-chat-message-navigator-mark",
          "data-active": m.id === n ? "true" : void 0,
          title: `跳转到：${Ro(m.text)}`,
          "aria-label": `跳转到第 ${o + p + 1} 条用户消息`,
          "aria-current": m.id === n ? "location" : void 0,
          onClick: () => c(m.id)
        },
        m.id
      )) }),
      /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: "agent-chat-message-navigator-page",
          title: "显示下一组消息",
          "aria-label": "显示下一组用户消息",
          disabled: !h,
          onClick: () => l(1),
          children: /* @__PURE__ */ f(Bo, {})
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { ref: a, className: "agent-chat-message-navigator-panel", children: u.map((m) => /* @__PURE__ */ f(
      "button",
      {
        type: "button",
        className: "agent-chat-message-navigator-item",
        "data-navigator-message-id": m.id,
        "data-active": m.id === n ? "true" : void 0,
        onClick: () => c(m.id),
        children: Ro(m.text)
      },
      m.id
    )) })
  ] });
}
function Xb(t) {
  return t.role === "user";
}
function Zb(t, e) {
  const s = t.getBoundingClientRect(), n = s.top + Math.min(s.height * 0.28, 220), r = tc(t);
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
function Kb(t, e) {
  return tc(t).get(e);
}
function tc(t) {
  return new Map(
    Array.from(
      t.querySelectorAll("[data-message-id]")
    ).map((e) => [e.dataset.messageId || "", e])
  );
}
function Ro(t) {
  const e = String(t || "").replace(/\s+/g, " ").trim();
  if (!e)
    return "空消息";
  const s = Array.from(e);
  return s.length > 46 ? `${s.slice(0, 46).join("")}...` : e;
}
function e_(t, e) {
  return Tn(
    t - Math.floor($t / 2),
    e
  );
}
function Tn(t, e) {
  return Math.min(
    Math.max(0, e - $t),
    Math.max(0, t)
  );
}
function t_(t, e) {
  const s = Array.from(
    t.querySelectorAll("[data-navigator-message-id]")
  ).find((a) => a.dataset.navigatorMessageId === e);
  if (!s)
    return;
  const n = s.offsetTop, r = n + s.offsetHeight, o = t.scrollTop + 8, i = t.scrollTop + t.clientHeight - 8;
  n < o ? t.scrollTop = Math.max(0, n - 8) : r > i && (t.scrollTop = r - t.clientHeight + 8);
}
const s_ = `
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
const Cn = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!Cn || Object.keys(Cn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const mr = Cn.cn, En = window.DeverFront?.sdk?.getCompatModule("@/components/reference-composer");
if (!En || Object.keys(En).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/reference-composer");
const sc = En, n_ = sc.ReferenceComposer, r_ = sc.ReferenceContentView, Ao = "agent-chat-column", o_ = {
  "@": "hidden",
  "#": "hidden"
};
function i_({
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
  renderMessageActions: d,
  renderArtifactActions: h,
  onOpenDocument: m,
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
  ], _ = d_(
    v,
    t.loadReferencePreview
  );
  return /* @__PURE__ */ F(Et.Root, { className: "agent-chat-thread relative flex min-h-0 flex-1 flex-col bg-background", children: [
    /* @__PURE__ */ f("style", { children: f_ }),
    /* @__PURE__ */ F(Et.ViewportProvider, { children: [
      /* @__PURE__ */ f(
        Et.Viewport,
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
          children: /* @__PURE__ */ f(
            "div",
            {
              className: mr(
                Ao,
                "agent-chat-message-column flex min-h-full flex-col"
              ),
              children: t.sessionLoading && t.messages.length === 0 ? /* @__PURE__ */ f("div", { className: "agent-chat-empty-state text-muted-foreground", children: /* @__PURE__ */ f(Mt, { className: "size-5 animate-spin" }) }) : t.messages.length === 0 ? /* @__PURE__ */ F("div", { className: "agent-chat-empty-state", children: [
                /* @__PURE__ */ f("span", { className: "flex size-10 items-center justify-center rounded-md border bg-muted/30 text-muted-foreground", children: /* @__PURE__ */ f(Sc, { className: "size-5" }) }),
                /* @__PURE__ */ f("span", { className: "text-sm text-muted-foreground", children: "开始一段新对话" })
              ] }) : /* @__PURE__ */ f("div", { className: "agent-chat-message-stack flex flex-col", children: /* @__PURE__ */ f(Et.Messages, { children: () => /* @__PURE__ */ f(
                a_,
                {
                  controller: t,
                  loadPreview: _,
                  renderMessageActions: d,
                  renderArtifactActions: h,
                  onOpenDocument: m
                }
              ) }) })
            }
          )
        }
      ),
      /* @__PURE__ */ f(Qb, { controller: t }),
      /* @__PURE__ */ F(
        "footer",
        {
          className: "agent-chat-footer shrink-0",
          style: {
            paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))"
          },
          children: [
            /* @__PURE__ */ f(
              Et.ScrollToBottom,
              {
                behavior: "smooth",
                className: "agent-chat-scroll-to-bottom",
                title: "回到底部",
                "aria-label": "回到底部",
                children: /* @__PURE__ */ f(xc, {})
              }
            ),
            /* @__PURE__ */ F("div", { className: Ao, children: [
              t.error ? /* @__PURE__ */ f("div", { className: "mb-2 text-sm text-destructive", children: t.error }) : null,
              /* @__PURE__ */ f(
                u_,
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
function a_({
  controller: t,
  loadPreview: e,
  renderMessageActions: s,
  renderArtifactActions: n,
  onOpenDocument: r
}) {
  return M((i) => i.message.role) === "user" ? /* @__PURE__ */ f(
    c_,
    {
      controller: t,
      loadPreview: e,
      renderMessageActions: s
    }
  ) : /* @__PURE__ */ f(
    l_,
    {
      controller: t,
      loadPreview: e,
      renderMessageActions: s,
      renderArtifactActions: n,
      onOpenDocument: r
    }
  );
}
function c_({
  controller: t,
  loadPreview: e,
  renderMessageActions: s
}) {
  const n = M(
    (o) => o.message.metadata.custom?.content
  ), r = M(
    (o) => o.message.metadata.custom?.sourceText
  );
  return /* @__PURE__ */ F(hn.Root, { className: "agent-chat-message agent-chat-user-message relative flex flex-col items-end pl-6 md:pl-20", children: [
    /* @__PURE__ */ f("div", { className: "agent-chat-user-bubble max-w-[88%] whitespace-pre-wrap break-words rounded-lg bg-muted px-3.5 py-2.5 text-base leading-7 text-foreground [overflow-wrap:anywhere] md:max-w-full", children: /* @__PURE__ */ f(
      r_,
      {
        content: n,
        fallback: typeof r == "string" ? r : "",
        loadPreview: e
      }
    ) }),
    /* @__PURE__ */ f(
      nc,
      {
        role: "user",
        sessionTitle: t.sessionTitle,
        renderMessageActions: s
      }
    )
  ] });
}
function l_({
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
  ), u = ll(l), d = Number(
    M((b) => b.message.metadata.custom?.recordID) || 0
  ), h = Array.isArray(a) ? a : [], m = ul(i), p = m?.id ? dl(t.messages, m.id) : void 0, v = hl(i), _ = ml(i), C = o?.type === "incomplete" && o.reason === "error", I = !!(l && o?.type === "running" && !cs(l) && !_), E = m_(
    o?.type === "running",
    h,
    c
  );
  return /* @__PURE__ */ f(
    hn.Root,
    {
      className: mr(
        "agent-chat-message relative min-w-0 [contain-intrinsic-size:auto_180px] [content-visibility:auto]",
        C && "text-destructive"
      ),
      children: /* @__PURE__ */ F(
        Bc,
        {
          messageID: d,
          render: n,
          children: [
            l ? /* @__PURE__ */ F(Me, { children: [
              u ? /* @__PURE__ */ f(Ds, { text: u, error: C }) : null,
              /* @__PURE__ */ f(
                Fc,
                {
                  document: l,
                  onOpen: r
                }
              ),
              I ? /* @__PURE__ */ f(Mo, {}) : null,
              _ ? /* @__PURE__ */ f(
                Ds,
                {
                  text: _,
                  error: C,
                  className: "mt-4"
                }
              ) : null
            ] }) : /* @__PURE__ */ F(Me, { children: [
              /* @__PURE__ */ f(hn.Parts, { children: ({ part: b }) => {
                if (b.type === "text") {
                  const y = b.status.type === "running";
                  return y && !b.text && h.length === 0 ? /* @__PURE__ */ f(h_, {}) : b.text ? /* @__PURE__ */ f(
                    Ds,
                    {
                      text: b.text,
                      streaming: y,
                      error: C
                    }
                  ) : null;
                }
                if (b.type === "tool-call") {
                  const y = h.find(
                    (T) => T.id === b.toolCallId
                  );
                  return /* @__PURE__ */ f(Lc, { activity: y });
                }
                return null;
              } }),
              E ? /* @__PURE__ */ f(Mo, {}) : null,
              /* @__PURE__ */ f(
                Vc,
                {
                  output: i,
                  excludeOutputs: h.map(
                    (b) => b.output
                  ),
                  excludeText: typeof c == "string" ? c : ""
                }
              )
            ] }),
            m ? /* @__PURE__ */ f(
              qc,
              {
                interaction: m,
                response: p,
                disabled: t.sendDisabled,
                onSubmit: (b) => {
                  t.send(
                    jc(
                      m.id || "",
                      b.text,
                      b.data
                    )
                  );
                }
              }
            ) : null,
            /* @__PURE__ */ f(
              Uc,
              {
                suggestions: v,
                disabled: t.sendDisabled,
                onSelect: (b) => {
                  t.send(Lo(b.prompt));
                }
              }
            ),
            /* @__PURE__ */ f(
              nc,
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
function nc({
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
  ), d = c?.hydrated ? fl(c) : typeof a == "string" && a.trim() ? a : u, [h, m] = G(!1), [p, v] = G(!1), _ = ne(null);
  le(
    () => () => {
      _.current != null && window.clearTimeout(_.current);
    },
    []
  );
  const C = () => {
    _.current != null && window.clearTimeout(_.current), _.current = window.setTimeout(() => {
      m(!1), v(!1), _.current = null;
    }, 1800);
  }, I = async () => {
    if (d.trim()) {
      v(!1);
      try {
        await Zc(d), m(!0);
      } catch {
        m(!1), v(!0);
      }
      C();
    }
  }, E = !d.trim() || t === "assistant" && n?.type === "running", b = Ho(l).some(
    (y) => y.status === "generating"
  ) || !!(c && cs(c));
  return /* @__PURE__ */ F(
    Kp.Root,
    {
      className: mr(
        "agent-chat-message-actions",
        t === "user" && "justify-end"
      ),
      "data-message-role": t,
      children: [
        /* @__PURE__ */ f(
          qo,
          {
            label: p ? "复制失败，请手动选择消息文本" : h ? "已复制" : "复制",
            children: /* @__PURE__ */ F(
              "button",
              {
                type: "button",
                className: "agent-chat-message-action agent-chat-copy-action",
                "aria-label": h ? "消息已复制" : "复制消息",
                "data-copied": h ? "true" : void 0,
                "data-copy-failed": p ? "true" : void 0,
                disabled: E,
                onClick: () => {
                  I();
                },
                children: [
                  /* @__PURE__ */ f(Ic, { className: "agent-chat-copy-icon", "aria-hidden": "true" }),
                  /* @__PURE__ */ f(Fo, { className: "agent-chat-copied-icon", "aria-hidden": "true" })
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
function u_({
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
  referenceProviders: d
}) {
  return /* @__PURE__ */ f(
    n_,
    {
      placeholder: "请输入消息，输入 @ 引用资产，输入 # 引用会话信息",
      disabled: o || t.sendDisabled && !t.running,
      running: t.running,
      stopping: t.stopping,
      cancelable: t.cancelable,
      layerZIndex: ns,
      clipboardImageUploadRuleId: e,
      uploadBizKey: s,
      uploadBizName: n,
      allowResourceLibrary: r,
      renderFileLibrary: l,
      fileLibraryIncludesUpload: !0,
      referenceActionPlacements: o_,
      toolbar: i,
      parameterScopeKey: c,
      onUploadedFiles: u,
      parameters: a ?? t.inputParams,
      providers: d,
      showMediaAliases: !0,
      allowMultiMediaSelection: !0,
      loadReferences: t.loadReferences,
      loadPreview: t.loadReferencePreview,
      onSubmit: t.send,
      onCancel: t.stop
    }
  );
}
function d_(t, e) {
  return (s) => {
    const n = t.find(
      (r) => r.referenceTypes.includes(s.refType)
    );
    return n?.loadPreview ? n.loadPreview(s) : e(s);
  };
}
function h_() {
  return /* @__PURE__ */ f(
    "div",
    {
      role: "status",
      "aria-label": "智能体正在生成",
      className: "agent-chat-waiting-indicator",
      children: [0, 1, 2].map((t) => /* @__PURE__ */ f(
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
function Mo() {
  return /* @__PURE__ */ f(
    "div",
    {
      role: "status",
      "aria-label": "智能体正在执行下一步",
      className: "agent-chat-next-step-indicator",
      children: /* @__PURE__ */ f("span", { className: "agent-chat-pulse-dot" })
    }
  );
}
function m_(t, e, s) {
  if (!t)
    return !1;
  const n = e.at(-1);
  return !n || n.kind !== "knowledge" && n.kind !== "skill" || n.status === "running" ? !1 : String(s || "").trimEnd() === n.anchorText.trimEnd();
}
const f_ = `
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
const st = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dropdown-menu");
if (!st || Object.keys(st).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const p_ = st.DropdownMenu, g_ = st.DropdownMenuContent, b_ = st.DropdownMenuItem, __ = st.DropdownMenuSeparator, v_ = st.DropdownMenuTrigger, nt = window.DeverFront?.sdk?.getCompatModule("@/components/ui/select");
if (!nt || Object.keys(nt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/select");
const y_ = nt.Select, w_ = nt.SelectContent, S_ = nt.SelectItem, x_ = nt.SelectTrigger, I_ = nt.SelectValue, Rn = window.DeverFront?.sdk?.getCompatModule("@/lib/floating-layer");
if (!Rn || Object.keys(Rn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/floating-layer");
const rc = Rn.findFloatingLayerContainer;
function T_({
  value: t,
  powers: e,
  categories: s,
  onValueChange: n
}) {
  const r = ne(null), [o, i] = G(
    null
  ), [a, c] = G(!1), l = e.find(
    (d) => typeof t == "number" && d.id === t
  ), u = t === "auto" ? "自动选择" : l?.name || "选择";
  return /* @__PURE__ */ F(
    p_,
    {
      modal: !1,
      open: a,
      onOpenChange: (d) => {
        d && i(rc(r.current)), c(d);
      },
      children: [
        /* @__PURE__ */ f(v_, { asChild: !0, children: /* @__PURE__ */ F(
          "button",
          {
            ref: r,
            type: "button",
            className: "agent-chat-execution-trigger",
            "aria-label": "选择工具",
            children: [
              /* @__PURE__ */ F("span", { className: "agent-chat-execution-trigger-content", children: [
                t === "auto" ? /* @__PURE__ */ f(br, { "aria-hidden": "true" }) : l ? /* @__PURE__ */ f(pl, { power: l, size: 15 }) : null,
                /* @__PURE__ */ f("span", { children: u })
              ] }),
              /* @__PURE__ */ f(Bo, { className: "agent-chat-execution-chevron" })
            ]
          }
        ) }),
        /* @__PURE__ */ F(
          g_,
          {
            align: "start",
            container: o,
            className: "agent-chat-execution-menu",
            children: [
              /* @__PURE__ */ F(
                b_,
                {
                  className: `agent-chat-execution-menu-item agent-chat-execution-power-item${t === "auto" ? " is-selected" : ""}`,
                  onSelect: () => n("auto"),
                  children: [
                    /* @__PURE__ */ f(br, { "aria-hidden": "true" }),
                    /* @__PURE__ */ f("span", { className: "min-w-0 flex-1 truncate", children: "自动选择" }),
                    t === "auto" ? /* @__PURE__ */ f(Fo, { "aria-hidden": "true" }) : null
                  ]
                }
              ),
              e.length > 0 ? /* @__PURE__ */ f(__, {}) : null,
              /* @__PURE__ */ f(
                gl,
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
function Do({
  value: t,
  options: e,
  ariaLabel: s,
  onValueChange: n
}) {
  const r = ne(null), [o, i] = G(
    null
  );
  return /* @__PURE__ */ F(
    y_,
    {
      value: String(t),
      onValueChange: (a) => n(Number(a)),
      onOpenChange: (a) => {
        a && i(rc(r.current));
      },
      children: [
        /* @__PURE__ */ f(
          x_,
          {
            ref: r,
            "aria-label": s,
            className: "agent-chat-execution-trigger agent-chat-execution-source-trigger",
            children: /* @__PURE__ */ f(I_, {})
          }
        ),
        /* @__PURE__ */ f(
          w_,
          {
            align: "start",
            container: o,
            className: "agent-chat-execution-menu",
            children: e.map((a) => /* @__PURE__ */ f(
              S_,
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
const An = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!An || Object.keys(An).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const C_ = An.isPromptParam;
function E_({
  enabled: t,
  scopeKey: e,
  toolIDField: s,
  loadConfig: n,
  loadToolForm: r,
  renderFileLibrary: o
}) {
  const [i, a] = G(null), [c, l] = G(""), [u, d] = G(0), [h, m] = G(t), [p, v] = G(""), [_, C] = G(0), [I, E] = G("auto"), [b, y] = G(0), [T, x] = G(null), [S, q] = G(!1), [P, z] = G(""), [Q, L] = G(0), [B, te] = G({
    scopeKey: "",
    sessionID: 0,
    messageIdentity: ""
  }), ce = ne(""), V = ne(null), j = ne(null), ee = c === e ? i : null, Z = !!ee?.toolsEnabled, g = Z && typeof I == "number" && T?.toolID === I ? T.config : null, A = ko(
    ee?.modelSourceRule,
    _
  ), D = Z && typeof I == "number" && ko(g?.sourceRule, b);
  le(() => {
    let J = !0;
    return a(null), l(""), m(t), v(""), x(null), z(""), E("auto"), y(0), V.current = null, j.current = null, ce.current = "", t ? (n().then((X) => {
      J && (a(X), l(e), C(X.selectedModelTargetID));
    }).catch((X) => {
      J && v(Po(X, "加载对话配置失败"));
    }).finally(() => {
      J && m(!1);
    }), () => {
      J = !1;
    }) : () => {
      J = !1;
    };
  }, [u, t, n, e]), le(() => {
    if (!t || !ee || B.scopeKey !== e)
      return;
    const J = `${e}:${B.sessionID}:${B.messageIdentity || "empty"}`;
    if (ce.current === J) return;
    const X = V.current;
    if (!B.messageIdentity && X && X.scopeKey === e && (X.sessionID === 0 || X.sessionID === B.sessionID))
      return;
    X && (V.current = null), ce.current = J;
    const ae = B.execution;
    j.current = ae ? { ...ae } : null, C(D_(ee, ae));
    const ue = k_(
      ee,
      ae,
      s
    );
    E(ue.selection), y(ue.targetID), x(null), z("");
  }, [
    ee,
    B.execution,
    B.messageIdentity,
    B.scopeKey,
    B.sessionID,
    t,
    e,
    s
  ]);
  const N = O(
    (J) => {
      if (!t) return;
      const X = A_(
        J.messages,
        s
      ), ae = {
        scopeKey: e,
        sessionID: J.sessionID,
        messageIdentity: X?.messageIdentity || "",
        execution: X?.execution
      };
      te(
        (ue) => ue.scopeKey === ae.scopeKey && ue.sessionID === ae.sessionID && ue.messageIdentity === ae.messageIdentity ? ue : ae
      );
    },
    [t, e, s]
  );
  le(() => {
    if (!t || !Z || typeof I != "number") {
      x(null), q(!1), z("");
      return;
    }
    if (T?.toolID === I && Number(T.config.selectedSourceID) === b)
      return;
    let J = !0;
    return q(!0), z(""), (async () => {
      try {
        return await r(I, b);
      } catch (ae) {
        if (!b) throw ae;
        return r(I, 0);
      }
    })().then((ae) => {
      J && (x({ toolID: I, config: ae }), y(Number(ae.selectedSourceID || 0)));
    }).catch((ae) => {
      J && (x(null), z(Po(ae, "加载工具参数失败")));
    }).finally(() => {
      J && q(!1);
    }), () => {
      J = !1;
    };
  }, [
    t,
    r,
    T,
    Q,
    I,
    b,
    Z
  ]);
  const H = qe(() => {
    if (!(!t || !Z || typeof I != "number"))
      return g ? P_(
        g.params.filter((J) => !C_(J)),
        B.execution,
        I,
        s,
        b
      ) : [];
  }, [
    g,
    B.execution,
    t,
    s,
    I,
    b,
    Z
  ]), Y = O(
    (J) => {
      J !== I && (E(J), y(0), x(null), z(""), L((X) => X + 1));
    },
    [I]
  ), ie = O(
    (J) => {
      J !== b && (y(J), z(""), L((X) => X + 1));
    },
    [b]
  ), pe = O(() => {
    if (p) {
      d((J) => J + 1);
      return;
    }
    x(null), z(""), L((J) => J + 1);
  }, [p]), ke = O(
    (J) => {
      if (!t) return J;
      const X = { ...J.content };
      if (gt(X.interaction_response)) {
        const ue = j.current ? { ...j.current } : null;
        return ue ? X.execution = ue : delete X.execution, delete X.params, V.current = {
          scopeKey: e,
          sessionID: B.sessionID
        }, { ...J, content: X, params: void 0 };
      }
      if (A)
        throw new Error("当前对话没有可用模型");
      const ae = {
        model_target_id: _,
        tool_mode: Z ? O_(I) : "none"
      };
      if (Z && typeof I == "number") {
        if (!g || S || P)
          throw new Error(P || "工具参数尚未加载完成");
        if (ae[s] = I, D)
          throw new Error("当前工具没有可用模型");
        ae.tool_target_id = b, ae.tool_params = { ...J.params || {} }, delete X.params;
      }
      return X.execution = ae, V.current = {
        scopeKey: e,
        sessionID: B.sessionID
      }, j.current = ae, Z && typeof I == "number" ? { ...J, content: X, params: void 0 } : { ...J, content: X };
    },
    [
      g,
      B.sessionID,
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
      Z
    ]
  ), St = B.scopeKey === e ? `${e}:session:${B.sessionID}` : `${e}:session:pending`, Pe = h || !!p || Z || Mn(
    ee?.modelSourceRule,
    ee?.modelSources
  );
  return {
    disabled: t && (h || !!p || !ee || A || Z && typeof I == "number" && (S || !!P || !g || D)),
    toolbar: t && Pe ? /* @__PURE__ */ f(
      R_,
      {
        config: ee,
        configLoading: h,
        configError: p,
        modelTargetID: _,
        toolSelection: I,
        toolTargetID: b,
        toolForm: g,
        toolFormLoading: S,
        toolFormError: P,
        onModelChange: C,
        onToolChange: Y,
        onToolTargetChange: ie,
        onRetry: pe
      }
    ) : null,
    parameters: H,
    // Parameter controls belong to the unsent conversation draft. Switching
    // tools or model sources must not discard values already entered there.
    parameterScopeKey: St,
    prepareInput: ke,
    renderFileLibrary: o,
    onConversationStateChange: N
  };
}
function R_({
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
  onToolTargetChange: d,
  onRetry: h
}) {
  const m = qe(
    () => (i?.sources || []).map((I) => ({ id: Number(I.id), name: I.name })).filter((I) => I.id > 0),
    [i?.sources]
  ), p = !!t?.toolsEnabled, v = s || (p ? c : ""), _ = (!p || typeof r != "number") && Mn(t?.modelSourceRule, t?.modelSources), C = p && typeof r == "number" && Mn(i?.sourceRule, m);
  return /* @__PURE__ */ F("div", { className: "agent-chat-execution-controls", children: [
    p ? /* @__PURE__ */ f("div", { className: "agent-chat-execution-picker", children: /* @__PURE__ */ f(
      T_,
      {
        value: r,
        powers: t?.tools || [],
        categories: t?.categories || [],
        onValueChange: u
      }
    ) }) : null,
    _ ? /* @__PURE__ */ f("div", { className: "agent-chat-execution-picker", children: /* @__PURE__ */ f(
      Do,
      {
        value: n,
        options: t?.modelSources || [],
        ariaLabel: "选择智能体模型",
        onValueChange: l
      }
    ) }) : null,
    C ? /* @__PURE__ */ f("div", { className: "agent-chat-execution-picker", children: /* @__PURE__ */ f(
      Do,
      {
        value: o,
        options: m,
        ariaLabel: "选择工具模型",
        onValueChange: d
      }
    ) }) : null,
    e || p && a ? /* @__PURE__ */ f(
      Mt,
      {
        className: "agent-chat-execution-loading animate-spin",
        "aria-label": "正在加载执行配置"
      }
    ) : null,
    v ? /* @__PURE__ */ f("span", { className: "agent-chat-execution-error", title: v, children: v }) : null,
    v ? /* @__PURE__ */ f(
      "button",
      {
        type: "button",
        className: "agent-chat-execution-retry",
        "aria-label": "重新加载执行配置",
        title: "重新加载",
        onClick: h,
        children: /* @__PURE__ */ f(Tc, {})
      }
    ) : null
  ] });
}
function A_(t, e) {
  for (let s = t.length - 1; s >= 0; s -= 1) {
    const n = t[s];
    if (n.role !== "user") continue;
    const r = gt(n.content?.execution) ? n.content.execution : void 0, o = r && n.content?.interaction_response ? M_(
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
function M_(t, e, s, n) {
  if (String(s.tool_mode || "").trim() !== "specific" || gt(s.tool_params))
    return s;
  const r = Number(s[n] || 0), o = Number(s.tool_target_id || 0);
  if (!r) return s;
  for (let i = e - 1; i >= 0; i -= 1) {
    const a = t[i];
    if (a.role !== "user") continue;
    const c = a.content?.execution;
    if (!(!gt(c) || String(c.tool_mode || "").trim() !== "specific" || Number(c[n] || 0) !== r || Number(c.tool_target_id || 0) !== o || !gt(c.tool_params)))
      return { ...s, tool_params: c.tool_params };
  }
  return s;
}
function D_(t, e) {
  if (!On(t.modelSourceRule)) return 0;
  const s = Number(e?.model_target_id || 0);
  return t.modelSources.some((n) => n.id === s) ? s : t.selectedModelTargetID;
}
function k_(t, e, s) {
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
function P_(t, e, s, n, r) {
  if (String(e?.tool_mode || "").trim() !== "specific" || Number(e?.[n] || 0) !== s)
    return t;
  const o = Number(e?.tool_target_id || 0);
  if (o > 0 && r > 0 && o !== r)
    return t;
  const i = e?.tool_params;
  if (!gt(i)) return t;
  let a = !1;
  const c = t.map((l) => {
    const u = String(l.key || "").trim();
    return !u || !Object.prototype.hasOwnProperty.call(i, u) ? l : (a = !0, {
      ...l,
      default_value: $_(i[u])
    });
  });
  return a ? c : t;
}
function $_(t) {
  if (t == null) return "";
  if (typeof t == "string") return t;
  if (typeof t != "object") return String(t);
  try {
    return JSON.stringify(t);
  } catch {
    return "";
  }
}
function O_(t) {
  return typeof t == "number" ? "specific" : "auto";
}
function ko(t, e) {
  return On(t) && e <= 0;
}
function Mn(t, e) {
  return On(t) && (e?.length || 0) > 0;
}
function gt(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function Po(t, e) {
  return t instanceof Error && t.message ? t.message : e;
}
function N_({
  agentKey: t,
  configApi: e,
  toolFormApi: s
}) {
  const n = !!(t && e && s), r = O(
    () => Hc(e, t),
    [t, e]
  ), o = O(
    (i, a) => zc(s, {
      agentKey: t,
      powerID: i,
      sourceTargetID: a
    }),
    [t, s]
  );
  return E_({
    enabled: n,
    scopeKey: `admin-agent-runtime:${t}`,
    toolIDField: "power_id",
    loadConfig: r,
    loadToolForm: o
  });
}
await window.DeverFront?.ensureCompat?.(["@/lib/store", "@/lib/stream", "@/lib/utils", "@/components/ui/button", "@/components/ui/dialog"]);
const Dn = window.DeverFront?.sdk?.getCompatModule("@/lib/store");
if (!Dn || Object.keys(Dn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/store");
const ss = Dn.getStoreValueByPath, kn = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!kn || Object.keys(kn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const Ws = kn.streamValueText, Pn = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!Pn || Object.keys(Pn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const $o = Pn.cn, $n = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!$n || Object.keys($n).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const Ys = $n.Button, rt = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!rt || Object.keys(rt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const B_ = rt.Dialog, F_ = rt.DialogContent, L_ = rt.DialogDescription, V_ = rt.DialogHeader, q_ = rt.DialogTitle;
function ev({ item: t, store: e }) {
  const s = zt(
    e,
    () => Ws(ss(e, String(t.meta?.agentPath || "")))
  ), n = zt(
    e,
    () => Ws(
      ss(e, String(t.meta?.agentNamePath || ""))
    )
  ), r = String(t.meta?.openPath || ""), o = zt(
    e,
    () => r ? !!ss(e, r) : !0
  ), i = String(t.meta?.openingEnabledPath || ""), a = zt(
    e,
    () => i ? !!ss(e, i) : !!t.meta?.proactiveOpening
  ), c = String(t.meta?.executionConfigApi || ""), l = String(t.meta?.toolFormApi || ""), u = N_({
    agentKey: s,
    configApi: c,
    toolFormApi: l
  }), d = qe(
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
  ), h = qe(
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
  ), m = O(() => {
    r && e.getState().setValueByPath(r, !1);
  }, [r, e]);
  return /* @__PURE__ */ f(
    j_,
    {
      agentKey: s,
      agentName: n,
      open: o,
      fullScreen: !!r,
      height: Ws(t.meta?.height || t.meta?.containerHeight) || "min(78dvh, 720px)",
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
      assistantApi: d,
      runtimeApi: h,
      onClose: m
    }
  );
}
function j_({
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
  appearance: u = "default",
  sidebarTitle: d,
  clipboardImageUploadRuleId: h = 0,
  uploadBizKey: m,
  uploadBizName: p,
  allowResourceLibrary: v = !0,
  composerDisabled: _ = !1,
  composerToolbar: C,
  composerParameters: I,
  composerParameterScopeKey: E,
  renderFileLibrary: b,
  prepareInput: y,
  onConversationStateChange: T,
  onUploadedFiles: x,
  blockMs: S = 1e3,
  assistantApi: q,
  runtimeApi: P,
  requestScope: z,
  referenceProviders: Q,
  renderMessageActions: L,
  renderArtifactActions: B,
  renderDocumentActions: te,
  onClose: ce
}) {
  const V = Yb({
    agentKey: t,
    contextKey: s,
    modalOpen: n,
    blockMs: S,
    lazySession: a,
    proactiveOpening: c,
    assistantApi: q,
    runtimeApi: P,
    requestScope: z,
    prepareInput: y
  }), j = Gc(), ee = j.open && j.request?.kind !== "audio" && j.request?.kind !== "file", [Z, g] = G("chat"), A = ne(null), [D, N] = G(0), [H, Y] = G(!1), ie = ne(/* @__PURE__ */ new Set()), pe = qe(
    () => V.messages.find(
      (ue) => ue.document?.id === D
    ),
    [D, V.messages]
  ), ke = pe?.document, St = !!(H && ke && !ee);
  le(() => {
    j.closePreview();
  }, [t, V.sessionID, j.closePreview, n]), le(() => {
    T?.({
      sessionID: V.sessionID,
      messages: V.messages
    });
  }, [V.messages, V.sessionID, T]), le(() => {
    g("chat");
  }, [t, s, l]), le(() => {
    N(0), Y(!1);
  }, [t, s, V.sessionID]), le(() => {
    ie.current.clear();
  }, [t, s]), le(() => {
    const xt = [...V.messages].reverse().find((se) => se.autoOpenDocument && se.document)?.document?.id || 0, Ht = `${V.sessionID}:${xt}`;
    !xt || ie.current.has(Ht) || (ie.current.add(Ht), N(xt), Y(!0));
  }, [V.messages, V.sessionID]);
  const Pe = O((ue) => {
    N(ue.id), Y(!0);
  }, []), J = O(
    async (ue) => {
      await V.openSession(ue), g("chat");
    },
    [V.openSession]
  ), X = O(async () => {
    await V.startNewSession(), g("chat");
  }, [V.startNewSession]);
  if (!n)
    return null;
  const ae = /* @__PURE__ */ f(Jc, { controller: j, children: /* @__PURE__ */ F(
    "div",
    {
      ref: A,
      "data-agent-chat-layer": "true",
      "data-agent-chat-appearance": u,
      "data-media-inspector-open": ee ? "true" : void 0,
      className: $o(
        "relative flex min-h-0 w-full flex-col overflow-hidden bg-background md:flex-row",
        i ? "h-full flex-1" : "border-y"
      ),
      style: i ? void 0 : { height: r, minHeight: o },
      children: [
        /* @__PURE__ */ f(
          vo,
          {
            agentName: e,
            title: d,
            agentReady: !!t,
            controller: V,
            collapsed: ee
          }
        ),
        l && Z === "sessions" ? /* @__PURE__ */ f(
          vo,
          {
            mobile: !0,
            agentName: e,
            title: d,
            agentReady: !!t,
            controller: V,
            onOpenSession: J,
            onStartNewSession: X
          }
        ) : null,
        /* @__PURE__ */ F(
          "section",
          {
            className: $o(
              "min-h-0 min-w-0 flex-1 flex-col bg-background",
              l && Z === "sessions" ? "hidden md:flex" : "flex",
              ee && "md:w-[38vw] md:min-w-[360px] md:max-w-[640px] md:flex-none"
            ),
            children: [
              /* @__PURE__ */ F("header", { className: "agent-chat-header flex h-12 shrink-0 items-center gap-2 px-3 md:h-14 md:px-6", children: [
                l ? /* @__PURE__ */ F(
                  Ys,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: "size-10 shrink-0 md:hidden",
                    title: "返回会话列表",
                    onClick: () => g("sessions"),
                    children: [
                      /* @__PURE__ */ f(Cc, { className: "size-4" }),
                      /* @__PURE__ */ f("span", { className: "sr-only", children: "返回会话列表" })
                    ]
                  }
                ) : null,
                /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ f("div", { className: "truncate text-sm font-semibold text-foreground", children: V.sessionTitle || "新会话" }) }),
                /* @__PURE__ */ F(
                  Ys,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: "size-10 shrink-0 md:hidden",
                    title: "新对话",
                    disabled: V.sessionLoading || !t,
                    onClick: () => {
                      X();
                    },
                    children: [
                      /* @__PURE__ */ f(No, { className: "size-4" }),
                      /* @__PURE__ */ f("span", { className: "sr-only", children: "新对话" })
                    ]
                  }
                ),
                i && !j.open ? /* @__PURE__ */ F(
                  Ys,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: "size-10 shrink-0 md:size-8",
                    title: "关闭运行智能体",
                    onClick: ce,
                    children: [
                      /* @__PURE__ */ f(Ec, { className: "size-4" }),
                      /* @__PURE__ */ f("span", { className: "sr-only", children: "关闭运行智能体" })
                    ]
                  }
                ) : null
              ] }),
              /* @__PURE__ */ f(
                gb,
                {
                  controller: V,
                  children: /* @__PURE__ */ f(
                    i_,
                    {
                      controller: V,
                      clipboardImageUploadRuleId: h,
                      uploadBizKey: m,
                      uploadBizName: p,
                      allowResourceLibrary: v,
                      composerDisabled: _,
                      composerToolbar: C,
                      composerParameters: I,
                      composerParameterScopeKey: E,
                      renderFileLibrary: b,
                      onUploadedFiles: x,
                      referenceProviders: Q,
                      renderMessageActions: L,
                      renderArtifactActions: B,
                      onOpenDocument: Pe
                    }
                  )
                },
                `${t}:${s || "default"}:${V.sessionID || "draft"}`
              )
            ]
          }
        ),
        ke ? /* @__PURE__ */ f(
          Wc,
          {
            open: St,
            portalContainer: A.current,
            document: ke,
            messageID: pe?.recordID || 0,
            renderArtifactActions: B,
            renderDocumentActions: te,
            onClose: () => Y(!1)
          }
        ) : null,
        /* @__PURE__ */ f(
          Yc,
          {
            controller: j,
            renderArtifactActions: B
          }
        )
      ]
    }
  ) });
  return i ? /* @__PURE__ */ f(
    B_,
    {
      open: n,
      onOpenChange: (ue) => {
        ue || ce?.();
      },
      children: /* @__PURE__ */ F(
        F_,
        {
          layerClassName: el,
          layerZIndex: Kc,
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
            /* @__PURE__ */ F(V_, { className: "sr-only", children: [
              /* @__PURE__ */ f(q_, { children: "运行智能体" }),
              /* @__PURE__ */ f(L_, { children: e || t || "智能体对话" })
            ] }),
            ae
          ]
        }
      )
    }
  ) : ae;
}
export {
  j_ as A,
  ev as S,
  E_ as u
};
