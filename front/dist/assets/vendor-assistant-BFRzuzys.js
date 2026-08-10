import { j as Ae, a as _, F as Re } from "./_commonjsHelpers-CTFd9u1x.js";
import { R as ln, u as nl, a as rl, b as sl, d as _t, m as te, c as il, F as ol, e as Ws, f as ne, i as al, g as ll, h as ul, j as Ys, k as cl } from "./react-C7Xtl8sB.js";
import { u as hl, c as Ks, s as Nn, a as Ln, P as dl, b as ct, d as fl, e as ot, f as Et, g as Js, h as tr, p as pl, i as ml, j as gl, t as bl, k as Qt, l as yl, V as _l, m as xl, n as Sl, o as wn, q as wl, r as ht, v as Qr, w as vl, x as kl } from "./index-CCdVL5_L.js";
import "./preloadable-PCKj9Z7v.js";
let rt = null;
function Tl(t, e) {
  t.currentIndex = 0, t.wipContextDeps = null, t.wipCommitCallbacks = [];
  const n = rt;
  rt = t;
  try {
    if (e(), t.isFirstRender = !1, t.cells.length !== t.currentIndex) throw new Error(`Rendered ${t.currentIndex} hooks but expected ${t.cells.length}. Hooks must be called in the exact same order in every render.`);
  } finally {
    rt = n;
  }
}
function Me() {
  if (!rt) throw new Error("No resource fiber available");
  return rt;
}
function dt() {
  return rt;
}
const nr = (t, e) => {
  if (t.length !== 0) {
    if (t.length === 1) throw t[0];
    for (const n of t) console.error(n);
    throw new AggregateError(t, e);
  }
}, Ce = {
  HookState: 0,
  EffectEvent: 1,
  PassiveEffectCleanup: 2,
  PassiveEffectSetup: 3
}, Cl = [
  Ce.HookState,
  Ce.EffectEvent,
  Ce.PassiveEffectCleanup,
  Ce.PassiveEffectSetup
];
function Il(t) {
  const e = [];
  for (const n of Cl) {
    const r = t[n];
    if (r !== void 0)
      for (let s = 0; s < r.length; s++) try {
        r[s]();
      } catch (i) {
        e.push(i);
      }
  }
  nr(e, "Errors during commit");
}
function El(t) {
  const e = [];
  for (const n of t.cells) if (n?.type === "effect" && (n.deps = null, n.cleanup))
    try {
      n.cleanup?.();
    } catch (r) {
      e.push(r);
    } finally {
      n.cleanup = void 0;
    }
  nr(e, "Errors during cleanup");
}
const un = (t, e) => {
  for (let n = 0; n < t.length && n < e.length; n++) if (!Object.is(t[n], e[n])) return !1;
  return !0;
}, rr = () => {
  throw new Error("Rendered more hooks than during the previous render. Hooks must be called in the exact same order in every render.");
}, sr = () => {
  throw new Error("Hook order changed between renders");
}, Wr = (t, e) => {
  kt(t, Ce.HookState, () => {
    e.current = e.wip, e.currentDeps = e.wipDeps, e.isDirty = !1;
  });
}, cn = (t, e) => {
  const n = Me(), r = n.currentIndex++;
  let s = n.cells[r];
  if (s === void 0) {
    !n.isFirstRender && r >= n.cells.length && rr();
    const a = t();
    return s = {
      type: "memo",
      current: a,
      currentDeps: e,
      wip: a,
      wipDeps: e,
      isDirty: !1
    }, n.cells[r] = s, a;
  }
  s.type !== "memo" && sr();
  const i = s;
  if (un(i.wipDeps, e))
    return i.isDirty && Wr(n, i), i.wip;
  const o = t();
  return i.wip = o, i.wipDeps = e, i.isDirty || (i.isDirty = !0, li(n.root, () => {
    i.wip = i.current, i.wipDeps = i.currentDeps, i.isDirty = !1;
  })), Wr(n, i), o;
};
function At(t) {
  return cn(() => ({ current: t }), []);
}
const ir = /* @__PURE__ */ Symbol("tap.Context.defaultValue"), Al = (t) => t;
let ye = /* @__PURE__ */ new Map();
const Ue = /* @__PURE__ */ new Set(), Xs = () => new Map(ye), Yr = (t, e) => {
  const n = ye;
  ye = t;
  try {
    return e();
  } finally {
    ye = n;
  }
}, Zs = (t, e) => {
  t[ir] = e;
}, ei = (t) => typeof t == "object" && t !== null && ir in t, ti = (t) => typeof t == "object" && t !== null && "$$typeof" in t && t.$$typeof === /* @__PURE__ */ Symbol.for("react.context"), or = (t) => ei(t) || ti(t), ni = (t) => {
  if (!ei(t)) {
    if (ti(t)) {
      Zs(t, t._currentValue ?? t._currentValue2);
      return;
    }
    throw new Error("A tap resource's `use()` only accepts a tap context.");
  }
}, ri = (t, e, n) => {
  if (typeof t != "object" || t === null) throw new Error("useContextProvider only accepts a React context.");
  ni(t);
  const r = t, s = Me(), i = At(void 0), o = i.current === void 0 || !Object.is(i.current.value, e);
  He(() => {
    i.current = { value: e };
  }, [e]);
  const a = ye.get(r), l = a !== void 0 || ye.has(r);
  ye.set(r, {
    value: e,
    source: s
  });
  try {
    return Rl(r, o, n);
  } finally {
    l ? ye.set(r, a) : ye.delete(r);
  }
}, Rl = (t, e, n) => {
  const r = Ue.has(t);
  e ? Ue.add(t) : Ue.delete(t);
  try {
    return n();
  } finally {
    r ? Ue.add(t) : Ue.delete(t);
  }
}, Ml = (t) => {
  ni(t);
  const e = t, n = Pl(e, t), r = Me();
  return (r.wipContextDeps ??= /* @__PURE__ */ new Map()).set(e, n.source), n.value;
}, Pl = (t, e) => ye.get(t) ?? {
  value: Al(e)[ir],
  source: null
}, Dl = (t, e, n, r) => {
  if (!r) return n;
  let s = n;
  for (const [i, o] of r)
    o === e || o === t || (s ??= /* @__PURE__ */ new Map()).set(i, o);
  return s;
}, si = (t, e = t.wipContextDeps) => {
  const n = dt();
  !n || !e || (n.wipContextDeps = Dl(n, t, n.wipContextDeps, e));
}, ii = () => Ue.size > 0, ar = (t) => {
  if (!t.contextDeps || !ii()) return !1;
  for (const e of Ue.keys()) if (t.contextDeps.has(e)) return !0;
  return !1;
}, oi = (t) => ({
  version: 0,
  committedVersion: 0,
  context: Xs(),
  dispatchUpdate: t,
  changelog: [],
  rollbackCallbacks: []
}), Wt = (t) => {
  t.committedVersion = t.version, t.changelog.length = 0, t.rollbackCallbacks.length = 0;
}, xt = (t, e) => {
  const n = t.version > e;
  if (t.version = e, n) {
    for (let r = 0; r < t.rollbackCallbacks.length; r++) t.rollbackCallbacks[r]();
    if (t.rollbackCallbacks.length = 0, e <= t.committedVersion)
      t.committedVersion = e, t.changelog.length = 0;
    else {
      for (; t.committedVersion + t.changelog.length > e; ) t.changelog.pop();
      for (let r = 0; r < t.changelog.length; r++) ai(t.changelog[r]);
      Wt(t);
    }
  }
}, ai = (t) => {
  ui(t.fiber, t.cell), t.queued || (t.queued = !0, (t.cell.queue ??= []).push(t));
}, kt = (t, e, n) => {
  const r = t.wipCommitCallbacks;
  (r[e] ??= []).push(n);
}, li = (t, e) => {
  t.rollbackCallbacks.push(e);
}, ui = (t, e) => {
  e.isDirty || (e.isDirty = !0, t.markDirty?.(), li(t.root, () => {
    if (e.queue !== null) {
      for (const n of e.queue) n.queued = !1;
      e.queue = null;
    }
    e.workInProgress = e.current, e.isDirty = !1;
  }));
}, Bl = () => ({
  type: "effect",
  cleanup: void 0,
  deps: null
});
function He(t, e) {
  const n = Me(), r = n.currentIndex++, s = n.cells[r], i = s === void 0 ? Bl() : s.type === "effect" ? s : sr();
  if (s === void 0 && (!n.isFirstRender && r >= n.cells.length && rr(), n.cells[r] = i), !(e && i.deps && un(i.deps, e))) {
    if (i.deps !== null && !!e != !!i.deps) throw new Error("useEffect called with and without dependencies across re-renders");
    kt(n, Ce.PassiveEffectCleanup, () => {
      try {
        i.cleanup?.();
      } finally {
        i.cleanup = void 0;
      }
    }), kt(n, Ce.PassiveEffectSetup, () => {
      try {
        const o = t();
        if (o !== void 0 && typeof o != "function") throw new Error(`An effect function must either return a cleanup function or nothing. Received: ${typeof o}`);
        i.cleanup = o;
      } finally {
        i.deps = e;
      }
    });
  }
}
const Ol = (t, e, n) => {
  if (t.isNeverMounted) throw new Error("Resource updated before mount");
  let r = !1, s = !0;
  t.root.dispatchUpdate(() => (r || (r = !0, n && t.root.changelog.length === 0 && !e.cell.isDirty && !e.hasEagerState && (e.eagerState = n(e.cell.workInProgress, e.action), e.hasEagerState = !0, s = !Object.is(e.cell.current, e.eagerState))), s), () => (r = !0, s = !0, ai(e), t.root.changelog.push(e), !0));
}, Fl = (t, e, n, r, s) => {
  const i = r ? r(n) : n, o = {
    type: "reducer",
    workInProgress: i,
    current: i,
    isDirty: !1,
    queue: null,
    renderQueue: null,
    reducer: e,
    dispatch: (a) => {
      const l = dt();
      if (l !== null) {
        if (l !== t) throw new Error("Cannot update a resource while rendering a different resource.");
        (t.renderPendingCells ??= /* @__PURE__ */ new Set()).add(o), (o.renderQueue ??= []).push(a);
      } else Ol(t, {
        fiber: t,
        cell: o,
        action: a,
        hasEagerState: !1,
        eagerState: void 0,
        queued: !1
      }, s ? e : void 0);
    }
  };
  return o;
};
function ci(t, e, n, r) {
  const s = Me(), i = s.currentIndex++, o = s.cells[i], a = (() => {
    if (o !== void 0) return o.type === "reducer" ? o : sr();
    !s.isFirstRender && i >= s.cells.length && rr();
    const u = Fl(s, t, e, n, r);
    return s.cells[i] = u, u;
  })(), l = a.queue;
  if (l !== null) {
    const u = t === a.reducer;
    for (let h = 0; h < l.length; h++) {
      const c = l[h];
      (!c.hasEagerState || !u) && (c.eagerState = t(a.workInProgress, c.action), c.hasEagerState = !0), c.queued = !1, a.workInProgress = c.eagerState;
    }
    a.queue = null;
  }
  if (a.reducer = t, a.renderQueue !== null) {
    let u = a.workInProgress;
    for (const h of a.renderQueue) u = t(u, h);
    a.renderQueue = null, s.renderPendingCells?.delete(a), Object.is(u, a.workInProgress) || (ui(s, a), a.workInProgress = u);
  }
  return a.isDirty && kt(s, Ce.HookState, () => {
    a.current = a.workInProgress, a.isDirty = !1;
  }), [a.workInProgress, a.dispatch];
}
function hi(t, e, n) {
  return ci(t, e, n, !1);
}
const $l = (t, e) => typeof e == "function" ? e(t) : e, Nl = (t) => t === void 0 ? void 0 : typeof t == "function" ? t() : t;
function lr(t) {
  return ci($l, t, Nl, !0);
}
const ur = (t, e) => cn(() => t, e);
function cr(t) {
  const e = Me(), n = At(t);
  return n.current !== t && kt(e, Ce.EffectEvent, () => {
    n.current = t;
  }), ur(((...r) => n.current(...r)), []);
}
const Yt = (t) => {
  if (!or(t)) throw new Error("A tap resource's `use()` only accepts a tap context.");
  return Ml(t);
}, di = (t, e, n = e) => {
  const r = At(!0), s = r.current ? n() : e();
  r.current = !1;
  const [, i] = lr(0), o = cr(() => {
    try {
      if (Object.is(s, e())) return;
    } catch {
      return;
    }
    i((a) => a + 1);
  });
  return He(() => (o(), t(o)), [t]), s;
}, fi = (t, e) => {
}, Ll = ln;
function zl(t) {
  const e = nl(t);
  return rl(() => {
    e.current = t;
  }), sl(((...n) => e.current(...n)), []);
}
const Vl = Ll.useEffectEvent ?? zl, he = () => dt() !== null, de = ln, J = (t) => he() ? lr(t) : de.useState(t), Ul = (t, e, n) => he() ? hi(t, e, n) : de.useReducer(t, e, n), X = (t) => he() ? At(t) : de.useRef(t), Z = (t, e) => he() ? cn(t, e) : de.useMemo(t, e), qt = (t, e) => he() ? ur(t, e) : de.useCallback(t, e), q = (t, e) => he() ? He(t, e) : de.useEffect(t, e), Kt = (t, e) => he() ? He(t, e) : de.useLayoutEffect(t, e), pi = (t) => he() ? cr(t) : Vl(t), hr = (t, e, n) => he() ? di(t, e, n) : de.useSyncExternalStore(t, e, n), ql = (t, e) => he() ? fi() : de.useDebugValue(t, e), Fe = (t) => {
  const e = de.createContext(t);
  return Zs(e, t), e;
}, mi = (t) => he() && or(t) ? Yt(t) : de.use(t), Rt = (t) => he() && or(t) ? Yt(t) : de.useContext(t), gi = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), bi = (t) => new Array(t).fill(gi), jl = (t, e) => {
  const n = t.memoCache;
  let r = n.workInProgress;
  if (r === null) {
    const o = n.current;
    r = o === null ? [] : o.map((a) => a.slice()), n.workInProgress = r;
  }
  const s = n.index++;
  let i = r[s];
  return i === void 0 && (i = bi(e), r[s] = i), i;
}, yi = (t) => jl(Me(), t), Hl = ln, Gl = (t) => _t(() => {
  const e = bi(t);
  return e[gi] = !0, e;
}, []), Ql = Hl.__COMPILER_RUNTIME?.c ?? Gl, Wl = () => dt() !== null, v = (t) => Wl() ? yi(t) : Ql(t);
function Q(t) {
  return (...e) => ({
    hook: t,
    args: e
  });
}
function ce(t, e, n) {
  return typeof e == "function" ? (...r) => ce(t, e(...r)) : n ? {
    ...e,
    key: t,
    deps: n
  } : {
    ...e,
    key: t
  };
}
const Yl = 50;
let qe = {
  schedulers: /* @__PURE__ */ new Set([]),
  isScheduled: !1
}, je = null;
var Kl = class {
  _isDirty = !1;
  _task;
  constructor(t) {
    this._task = t;
  }
  get isDirty() {
    return this._isDirty;
  }
  markDirty() {
    if (je && (je.get(this) ?? 0) >= Yl) throw new Error("Maximum update depth exceeded. This can happen when a resource repeatedly calls setState inside useEffect.");
    this._isDirty = !0, qe.schedulers.add(this), Jl();
  }
  runTask() {
    je?.set(this, (je.get(this) ?? 0) + 1), this._isDirty = !1, this._task();
  }
};
const Jl = () => {
  qe.isScheduled || (qe.isScheduled = !0, Xl());
}, Kr = () => {
  const t = je;
  je = /* @__PURE__ */ new Map();
  try {
    const e = [];
    for (const n of qe.schedulers)
      if (qe.schedulers.delete(n), !!n.isDirty)
        try {
          n.runTask();
        } catch (r) {
          e.push(r);
        }
    nr(e, "Errors occurred during flushSync");
  } finally {
    je = t, qe.schedulers.clear(), qe.isScheduled = !1;
  }
}, Xl = (() => {
  if (typeof MessageChannel < "u") {
    let t = null, e;
    return () => {
      if (!t) {
        const n = new MessageChannel();
        n.port1.onmessage = () => {
          t?.unref?.(), Kr();
        }, t = n.port1, e = n.port2;
      }
      t.ref?.(), e.postMessage(null);
    };
  }
  return () => setTimeout(Kr, 0);
})(), Zl = {
  useState: lr,
  useReducer: hi,
  useRef: At,
  useMemo: cn,
  useCallback: ur,
  useEffect: He,
  useLayoutEffect: He,
  useInsertionEffect: He,
  useEffectEvent: cr,
  useContext: Yt,
  use: Yt,
  useSyncExternalStore: di,
  useDebugValue: fi,
  useMemoCache: yi
}, Jr = ln, Le = Jr.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ?? Jr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Bt = Le == null ? null : "H" in Le ? {
  get current() {
    return Le.H;
  },
  set current(t) {
    Le.H = t;
  }
} : "ReactCurrentDispatcher" in Le ? {
  get current() {
    return Le.ReactCurrentDispatcher.current;
  },
  set current(t) {
    Le.ReactCurrentDispatcher.current = t;
  }
} : null;
function eu(t) {
  if (!Bt) return t();
  const e = Bt.current;
  Bt.current = Zl;
  try {
    return t();
  } finally {
    Bt.current = e;
  }
}
function _i(t, e, n = void 0, r) {
  return {
    hook: t,
    root: e,
    markDirty: n,
    devStrictMode: r,
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
function st(t) {
  if (!t.isMounted) throw new Error("Tried to unmount a fiber that is already unmounted");
  t.isMounted = !1, El(t);
}
function Ge(t, e) {
  if (t.memoCache.workInProgress = null, t.renderPendingCells !== null) {
    for (const s of t.renderPendingCells) s.renderQueue = null;
    t.renderPendingCells.clear();
  }
  let n = 0, r;
  do {
    if (++n > 25) throw new Error("Too many re-renders. tap limits the number of renders to prevent an infinite loop.");
    t.memoCache.index = 0, Tl(t, () => {
      r = eu(() => t.hook(...e));
    });
  } while ((t.renderPendingCells?.size ?? 0) > 0);
  return si(t), r;
}
function Tt(t) {
  const e = t.wipCommitCallbacks ?? t.commitCallbacks ?? [];
  t.wipCommitCallbacks = null, t.commitCallbacks = e, t.isMounted = !0, t.contextDeps = t.wipContextDeps, Wt(t.root), t.memoCache.workInProgress !== null && (t.memoCache.current = t.memoCache.workInProgress, t.memoCache.workInProgress = null), t.isNeverMounted = !1, Il(e);
}
const tu = () => {
  const t = Me();
  return t.devStrictMode ? t.isFirstRender ? "child" : "root" : null;
}, nu = () => null, ru = () => nu, xi = () => dt() ? tu : ru(), su = (t) => t(), iu = (t) => {
  const [e] = J(() => new Kl(() => f())), [n] = J(() => []), r = xi(), [s] = J(() => {
    const p = oi((x, S) => {
      if (!e.isDirty) {
        if (!x()) return;
        S();
      }
      xt(p, p.committedVersion + p.changelog.length), n.push(S), e.markDirty();
    });
    return _i(su, p, void 0, r());
  }), i = Xs(), o = s.root.version - s.root.committedVersion, a = Yr(i, () => Ge(s, [t])), l = X(!1), u = X([t]), h = X(a), [c] = J(() => /* @__PURE__ */ new Set()), d = (p) => {
    e.isDirty || h.current === p || (h.current = p, c.forEach((x) => x()));
  }, f = pi(() => {
    xt(s.root, s.root.committedVersion), n.forEach((x) => {
      x();
    }), xt(s.root, s.root.committedVersion + s.root.changelog.length);
    const p = Yr(s.root.context, () => Ge(s, u.current));
    if (e.isDirty) throw new Error("Scheduler is dirty, this should never happen");
    Wt(s.root), n.length = 0, l.current && Tt(s), d(p);
  });
  return q(() => (l.current = !0, () => {
    l.current = !1, st(s);
  }), [s]), q(() => {
    u.current = [t], Wt(s.root), n.splice(0, o), s.root.context = i, Tt(s), d(a);
  }), Z(() => ({
    getValue: () => h.current,
    subscribe: (p) => (c.add(p), () => c.delete(p))
  }), [c]);
}, ou = () => {
  const t = X(0), e = t.current, n = Me();
  return {
    version: e,
    markDirty: Z(() => () => {
      t.current++, n?.markDirty?.();
    }, [n]),
    root: n.root
  };
}, au = () => {
  const [t] = J(() => oi((s, i) => {
    let o = !1;
    r((a) => (o = !s(), o ? a : a + 1)), o || n(i);
  })), [e, n] = Ul((s, i) => (xt(t, s), s + (i() ? 1 : 0)), 0), [, r] = J(0);
  return xt(t, e), {
    root: t,
    version: e,
    markDirty: void 0
  };
}, dr = () => {
  const t = xi(), { root: e, version: n, markDirty: r } = dt() ? ou() : au();
  return {
    version: n,
    createFiber: qt((s, i, o) => _i(s, e, o ? () => {
      o(), r?.();
    } : r, t()), [])
  };
}, Si = (t, e, n) => {
  const r = X(null), s = r.current ?? (r.current = {
    wipDeps: null,
    wip: null,
    currentDeps: null,
    current: null
  });
  return s.wipDeps = s.currentDeps, s.wip = s.current, q(() => {
    s.currentDeps = s.wipDeps, s.current = s.wip;
  }), !n && s.currentDeps && un(s.currentDeps, e) ? s.current : (s.wipDeps = e, s.wip = t(), s.wip);
};
function Pe(t) {
  const { version: e, createFiber: n } = dr(), r = Z(() => n(t.hook, t.key), [
    t.hook,
    t.key,
    n
  ]), s = Si(() => ({ value: Ge(r, t.args) }), [
    r,
    e,
    t.args
  ], ar(r));
  return q(() => () => st(r), [r]), q(() => {
    Tt(r);
  }, [r, s]), s.value;
}
const Xr = (t, e) => {
  const n = t.get(e);
  n && (n.isDirty = !0);
}, lu = (t, e) => !t.isDirty && !ar(t.fiber) && e !== void 0 && t.committedDeps !== void 0 && un(t.committedDeps, e), uu = (t) => {
  if (!ii()) return !1;
  for (const { fiber: e } of t.values()) if (ar(e)) return !0;
  return !1;
};
function hn(t) {
  const [e] = J(() => /* @__PURE__ */ new Map()), { version: n, createFiber: r } = dr(), s = uu(e), i = Si(() => {
    const o = /* @__PURE__ */ new Set(), a = [];
    let l = 0;
    for (let u = 0; u < t.length; u++) {
      const h = t[u], c = h.key;
      if (c === void 0) throw new Error(`useResources did not provide a key for array at index ${u}`);
      if (o.has(c)) throw new Error(`Duplicate key ${c} in useResources`);
      o.add(c);
      let d = e.get(c);
      if (d)
        if (d.fiber.hook !== h.hook) {
          const f = r(h.hook, h.key, () => Xr(e, c)), p = Ge(f, h.args);
          d.next = {
            value: p,
            deps: h.deps,
            remount: f
          };
        } else if (lu(d, h.deps))
          d.fiber.contextDeps && si(d.fiber, d.fiber.contextDeps), d.next = "skip";
        else {
          const f = Ge(d.fiber, h.args);
          d.next = {
            value: f,
            deps: h.deps
          };
        }
      else {
        const f = r(h.hook, h.key, () => Xr(e, c));
        d = {
          fiber: f,
          next: {
            value: Ge(f, h.args),
            deps: h.deps
          },
          isDirty: !1,
          committedDeps: void 0,
          committedValue: void 0
        }, l++, e.set(c, d);
      }
      a.push(typeof d.next == "object" ? d.next.value : d.committedValue);
    }
    if (e.size > a.length - l)
      for (const u of e.keys()) o.has(u) || (e.get(u).next = "delete");
    return a;
  }, [
    t,
    e,
    r,
    n
  ], s);
  return q(() => () => {
    for (const o of e.keys()) {
      const a = e.get(o).fiber;
      st(a);
    }
  }, [e]), q(() => {
    for (const [o, a] of e.entries()) {
      const l = a.next;
      l === "delete" ? (a.fiber.isMounted && st(a.fiber), e.delete(o)) : l === "skip" || (l.remount && (st(a.fiber), a.fiber = l.remount), Tt(a.fiber), a.committedDeps = l.deps, a.committedValue = l.value, a.isDirty = !1);
    }
  }, [i, e]), i;
}
const cu = (t) => t(), hu = (t) => {
  const { createFiber: e } = dr(), n = Z(() => e(cu, void 0), [e]), r = Ge(n, [t]);
  q(() => () => {
    st(n);
  }, [n]);
  let s = !1;
  const i = () => {
    s && n.isMounted || (s = !0, Tt(n));
  };
  return q(i), {
    value: r,
    effects: i
  };
}, du = () => {
  const t = v(4), [e, n] = J(pu);
  let r;
  t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (r = (l, u) => (n((h) => ({
    ...h,
    renderers: {
      ...h.renderers,
      [l]: [...h.renderers[l] ?? [], u]
    }
  })), () => {
    n((h) => ({
      ...h,
      renderers: {
        ...h.renderers,
        [l]: h.renderers[l]?.filter((c) => c !== u) ?? []
      }
    }));
  }), t[0] = r) : r = t[0];
  const s = r;
  let i;
  t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (i = (l) => (n((u) => ({
    ...u,
    fallbacks: [...u.fallbacks, l]
  })), () => {
    n((u) => ({
      ...u,
      fallbacks: u.fallbacks.filter((h) => h !== l)
    }));
  }), t[1] = i) : i = t[1];
  const o = i;
  let a;
  return t[2] !== e ? (a = {
    getState: () => e,
    setDataUI: s,
    setFallbackDataUI: o
  }, t[2] = e, t[3] = a) : a = t[3], a;
}, fu = Q(du);
function pu() {
  return {
    renderers: {},
    fallbacks: []
  };
}
const vn = (t) => {
  if (!t.overwrite) return t;
  const { overwrite: e, ...n } = t;
  return n;
}, mu = (t) => {
  const e = Array.from(t).map((r) => r.getModelContext()).sort((r, s) => (s.priority ?? 0) - (r.priority ?? 0)), n = {};
  return e.reduce((r, s) => {
    const i = s.priority ?? 0;
    if (s.system && (r.system ? r.system += `

${s.system}` : r.system = s.system), s.tools) for (const [o, a] of Object.entries(s.tools)) {
      const l = r.tools?.[o];
      if (l && l !== a) {
        const u = n[o];
        if (u === i) {
          if (!a.overwrite) throw new Error(`You tried to define a tool with the name ${o}, but it already exists.`);
          r.tools[o] = vn(a);
          continue;
        }
        const h = u > i ? l : a, c = u > i ? a : l;
        r.tools[o] = vn({
          ...c,
          ...h
        }), n[o] = Math.max(u, i);
        continue;
      }
      r.tools || (r.tools = {}), r.tools[o] = vn(a), n[o] ??= i;
    }
    return s.config && (r.config = {
      ...r.config,
      ...s.config
    }), s.callSettings && (r.callSettings = {
      ...r.callSettings,
      ...s.callSettings
    }), s.unstable_composerMetadata && (r.unstable_composerMetadata = {
      ...r.unstable_composerMetadata,
      ...s.unstable_composerMetadata
    }), r;
  }, {});
};
var fr = class {
  _providers = /* @__PURE__ */ new Set();
  getModelContext() {
    return mu(this._providers);
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
const zn = [], gu = {
  modelName: void 0,
  toolNames: zn
}, bu = (t, e) => t === e || t.length === e.length && t.every((n, r) => n === e[r]), Ot = (t, e) => {
  const n = t.getModelContext(), r = n.config?.modelName, s = n.tools ? Object.keys(n.tools).sort() : zn, i = s.length ? s : zn;
  return r === e.modelName && bu(i, e.toolNames) ? e : {
    modelName: r,
    toolNames: i
  };
}, yu = () => {
  const t = v(11);
  let e;
  t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (e = new fr(), t[0] = e) : e = t[0];
  const n = e;
  let r;
  t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (r = () => Ot(n, gu), t[1] = r) : r = t[1];
  const [s, i] = J(r);
  let o, a;
  t[2] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (o = () => (i((f) => Ot(n, f)), n.subscribe(() => {
    i((f) => Ot(n, f));
  })), a = [n], t[2] = o, t[3] = a) : (o = t[2], a = t[3]), q(o, a);
  let l;
  t[4] !== s ? (l = () => Ot(n, s), t[4] = s, t[5] = l) : l = t[5];
  let u, h, c;
  t[6] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (u = () => n.getModelContext(), h = (f) => n.subscribe(f), c = (f) => n.registerModelContextProvider(f), t[6] = u, t[7] = h, t[8] = c) : (u = t[6], h = t[7], c = t[8]);
  let d;
  return t[9] !== l ? (d = {
    getState: l,
    getModelContext: u,
    subscribe: h,
    register: c
  }, t[9] = l, t[10] = d) : d = t[10], d;
}, wi = Q(yu), _u = (t) => t.display !== void 0 ? t.display === "standalone" : t.type === "human", xu = (t, e) => {
  if (!(e.status?.type === "running" || e.status?.type === "requires-action")) {
    const r = t.complete;
    return typeof r != "function" ? r ?? null : r({
      args: e.args,
      result: e.result
    });
  }
  const n = t.running;
  return typeof n != "function" ? n ?? null : n({ args: e.args });
}, Su = (t) => function(n) {
  return xu(t, n);
}, Vn = /* @__PURE__ */ Symbol("assistant-ui.store.clientIndex"), wu = (t) => t[Vn], vi = Fe([]), pr = () => mi(vi), vu = (t, e) => {
  const n = v(3), r = pr();
  let s;
  return n[0] !== t || n[1] !== r ? (s = [...r, t], n[0] = t, n[1] = r, n[2] = s) : s = n[2], ri(vi, s, e);
}, ku = /* @__PURE__ */ new Set([
  "$$typeof",
  "nodeType",
  "then"
]), dn = (t, e) => {
  if (t === Symbol.toStringTag) return e;
  if (typeof t != "symbol") {
    if (t === "toJSON") return () => e;
    if (!ku.has(t))
      return !1;
  }
};
var mr = class {
  getOwnPropertyDescriptor(t, e) {
    const n = this.get(t, e);
    if (n !== void 0)
      return {
        value: n,
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
const Jt = /* @__PURE__ */ Symbol("assistant-ui.store.getValue"), Tu = (t) => {
  const e = t[Jt];
  if (!e) throw new Error("Client scope contains a non-client resource. Ensure your Derived get() returns a client created with useClientResource(), not a plain resource.");
  return e.getState?.();
}, Zr = /* @__PURE__ */ new Map();
function Cu(t) {
  let e = Zr.get(t);
  return e || (e = function(...n) {
    if (!this || typeof this != "object") throw new Error(`Method "${String(t)}" called without proper context. This may indicate the function was called incorrectly.`);
    const r = this[Jt];
    if (!r) throw new Error(`Method "${String(t)}" called on invalid client proxy. Ensure you are calling this method on a valid client instance.`);
    const s = r[t];
    if (!s) throw new Error(`Method "${String(t)}" is not implemented.`);
    if (typeof s != "function") throw new Error(`"${String(t)}" is not a function.`);
    return s(...n);
  }, Zr.set(t, e)), e;
}
var Iu = class extends mr {
  boundFns;
  cachedReceiver;
  outputRef;
  index;
  constructor(t, e) {
    super(), this.outputRef = t, this.index = e;
  }
  get(t, e, n) {
    if (e === Jt) return this.outputRef.current;
    if (e === Vn) return this.index;
    const r = dn(e, "ClientProxy");
    if (r !== !1) return r;
    const s = this.outputRef.current[e];
    if (typeof s == "function") {
      this.cachedReceiver !== n && (this.boundFns = /* @__PURE__ */ new Map(), this.cachedReceiver = n);
      let i = this.boundFns.get(e);
      return i || (i = Cu(e).bind(n), this.boundFns.set(e, i)), i;
    }
    return s;
  }
  ownKeys() {
    return Object.keys(this.outputRef.current);
  }
  has(t, e) {
    return e === Jt || e === Vn ? !0 : e in this.outputRef.current;
  }
};
const Mt = (t) => {
  const e = X(null), n = pr().length, r = Z(() => new Proxy({}, new Iu(e, n)), [n]), s = vu(r, function() {
    return Pe(t);
  });
  return e.current || (e.current = s), q(() => {
    e.current = s;
  }), {
    methods: r,
    state: s.getState?.(),
    key: t.key
  };
}, Eu = Q(Mt), St = /* @__PURE__ */ Symbol("assistant-ui.store.proxiedAssistantState"), kn = (t) => t === "on" || t === "subscribe" || typeof t == "symbol", ki = (t) => {
  class e extends mr {
    get(r, s) {
      const i = dn(s, "AssistantState");
      if (i !== !1) return i;
      const o = s;
      if (!kn(o))
        return Tu(t[o]());
    }
    ownKeys() {
      return Object.keys(t).filter((r) => !kn(r));
    }
    has(r, s) {
      return !kn(s) && s in t;
    }
  }
  return new Proxy({}, new e());
}, Au = (t) => t[St], es = () => () => {
}, Ti = (t) => {
  const e = (() => {
    throw new Error(t);
  });
  return e.source = null, e.query = null, e;
};
var Ru = class extends mr {
  get(t, e) {
    if (e === "subscribe" || e === "on") return es;
    if (e === St) return Mu;
    const n = dn(e, "DefaultAssistantClient");
    return n !== !1 ? n : Ti("You are using a component or hook that requires an AuiProvider. Wrap your component in an <AuiProvider> component.");
  }
  ownKeys() {
    return [
      "subscribe",
      "on",
      St
    ];
  }
  has(t, e) {
    return e === "subscribe" || e === "on" || e === St;
  }
};
const fn = new Proxy({}, new Ru()), Mu = ki(fn), Pu = () => new Proxy({}, { get(t, e) {
  const n = dn(e, "AssistantClient");
  return n !== !1 ? n : Ti(`The current scope does not have a "${String(e)}" property.`);
} }), Ci = Fe(fn), Ii = /* @__PURE__ */ Symbol("assistant-ui.store.useEffects"), Du = () => {
}, Bu = (t) => t[Ii] ?? Du, Ou = () => {
  "use no memo";
  const t = Ei();
  return q(Bu(t)), null;
}, Ei = () => Rt(Ci), Ee = ({ value: t, children: e }) => {
  "use no memo";
  return /* @__PURE__ */ Ae(Ci.Provider, {
    value: t,
    children: [/* @__PURE__ */ _(Ou, {}), e]
  });
}, Un = (t) => {
  throw new Error("Derived elements are config-only and must not be mounted");
}, _e = Q(Un), qn = /* @__PURE__ */ Symbol("assistant-ui.transform-scopes");
function Ai(t, e) {
  const n = t;
  if (n[qn]) throw new Error("transformScopes is already attached to this resource");
  n[qn] = e;
}
function Fu(t) {
  return t[qn];
}
const Ri = (t) => typeof t == "string" ? {
  scope: t.split(".")[0],
  event: t
} : {
  scope: t.scope,
  event: t.event
}, Mi = Fe(null), $u = (t, e) => ri(Mi, t, e), Pi = () => {
  const t = mi(Mi);
  if (!t) throw new Error("AssistantTapContext is not available");
  return t;
}, Di = () => Pi().clientRef, gr = () => {
  const t = v(3), { emit: e } = Pi(), n = pr();
  let r;
  return t[0] !== n || t[1] !== e ? (r = (s, i) => {
    e(s, i, n);
  }, t[0] = n, t[1] = e, t[2] = r) : r = t[2], pi(r);
};
function Nu(t, e) {
  const n = { ...t }, r = /* @__PURE__ */ new Set();
  let s = !0;
  for (; s; ) {
    s = !1;
    for (const a of Object.values(n)) {
      if (a.hook === Un || r.has(a.hook)) continue;
      r.add(a.hook);
      const l = Fu(a.hook);
      if (l) {
        l(n, e), s = !0;
        break;
      }
    }
  }
  const i = {}, o = {};
  for (const [a, l] of Object.entries(n)) l.hook === Un ? o[a] = l : i[a] = l;
  return {
    rootClients: i,
    derivedClients: o
  };
}
const ts = (t) => Z(() => t, [...Object.entries(t).flat()]), Lu = (t, e) => {
  const n = v(6);
  let r;
  n[0] !== e || n[1] !== t ? (r = Nu(t, e), n[0] = e, n[1] = t, n[2] = r) : r = n[2];
  const { rootClients: s, derivedClients: i } = r, o = ts(s), a = ts(i);
  let l;
  return n[3] !== o || n[4] !== a ? (l = {
    rootClients: o,
    derivedClients: a
  }, n[3] = o, n[4] = a, n[5] = l) : l = n[5], l;
}, zu = () => {
  const t = v(3);
  let e;
  t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (e = /* @__PURE__ */ new Map(), t[0] = e) : e = t[0];
  const n = e;
  let r;
  t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (r = /* @__PURE__ */ new Set(), t[1] = r) : r = t[1];
  const s = r;
  let i;
  if (t[2] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel")) {
    const o = /* @__PURE__ */ new Set();
    i = {
      on(a, l) {
        const u = l;
        if (a === "*")
          return s.add(u), () => s.delete(u);
        let h = n.get(a);
        return h || (h = /* @__PURE__ */ new Set(), n.set(a, h)), h.add(u), () => {
          h.delete(u), h.size === 0 && n.delete(a);
        };
      },
      emit(a, l, u) {
        const h = n.get(a);
        !h && s.size === 0 || queueMicrotask(() => {
          const c = [];
          if (h) for (const d of h) try {
            d(l, u);
          } catch (f) {
            const p = f;
            c.push(p);
          }
          if (s.size > 0) {
            const d = {
              event: a,
              payload: l
            };
            for (const f of s) try {
              f(d, u);
            } catch (p) {
              const x = p;
              c.push(x);
            }
          }
          if (c.length > 0) {
            if (c.length === 1) throw c[0];
            for (const d of c) console.error(d);
            throw new AggregateError(c, "Errors occurred during event emission");
          }
        });
      },
      subscribe(a) {
        return o.add(a), () => o.delete(a);
      },
      notifySubscribers() {
        for (const a of o) try {
          a();
        } catch (l) {
          console.error("NotificationManager: subscriber callback error", l);
        }
      }
    }, t[2] = i;
  } else i = t[2];
  return i;
}, Vu = Q(zu), Bi = (t) => Z(() => t, t), Uu = ({ element: t, emit: e, clientRef: n }) => {
  const { methods: r, state: s } = $u({
    clientRef: n,
    emit: e
  }, function() {
    return Mt(t);
  });
  return Z(() => ({
    state: s,
    methods: r
  }), [r, s]);
}, qu = ({ element: t, notifications: e, clientRef: n, name: r }) => {
  const s = iu(function() {
    return Uu({
      element: t,
      emit: e.emit,
      clientRef: n
    });
  });
  return q(() => s.subscribe(e.notifySubscribers), [s, e]), Z(() => {
    const i = () => s.getValue().methods;
    return Object.defineProperties(i, {
      source: {
        value: "root",
        writable: !1
      },
      query: {
        value: {},
        writable: !1
      },
      name: {
        value: r,
        configurable: !0
      }
    }), i;
  }, [s, r]);
}, ju = Q(qu), Hu = () => {
  const t = v(2);
  let e;
  t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (e = [], t[0] = e) : e = t[0];
  let n;
  return t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (n = {
    clients: e,
    subscribe: void 0,
    on: void 0
  }, t[1] = n) : n = t[1], n;
}, Gu = Q(Hu), Qu = (t) => {
  const e = v(14), { clients: n, clientRef: r } = t;
  let s;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = Vu(), e[0] = s) : s = e[0];
  const i = Pe(s);
  let o;
  e[1] !== r.parent || e[2] !== i.notifySubscribers ? (o = () => r.parent.subscribe(i.notifySubscribers), e[1] = r.parent, e[2] = i.notifySubscribers, e[3] = o) : o = e[3];
  let a;
  e[4] !== r || e[5] !== i ? (a = [r, i], e[4] = r, e[5] = i, e[6] = a) : a = e[6], q(o, a);
  let l;
  e[7] !== r || e[8] !== n || e[9] !== i ? (l = Object.keys(n).map((c) => ce(c, ju({
    element: n[c],
    notifications: i,
    clientRef: r,
    name: c
  }))), e[7] = r, e[8] = n, e[9] = i, e[10] = l) : l = e[10];
  const u = Bi(hn(l));
  let h;
  return e[11] !== i || e[12] !== u ? (h = {
    notifications: i,
    results: u
  }, e[11] = i, e[12] = u, e[13] = h) : h = e[13], h;
}, Wu = (t) => {
  const { clientRef: e } = t, { notifications: n, results: r } = Qu(t);
  return Z(() => ({
    clients: r,
    subscribe: n.subscribe,
    on: function(s, i) {
      if (!this) throw new Error("const { on } = useAui() is not supported. Use aui.on() instead.");
      const { scope: o, event: a } = Ri(s);
      if (o !== "*" && this[o].source === null)
        throw new Error(`Scope "${o}" is not available. Use { scope: "*", event: "${a}" } to listen globally.`);
      const l = n.on(a, (h, c) => {
        if (o === "*") {
          i(h);
          return;
        }
        const d = this[o]();
        d === c[wu(d)] && i(h);
      });
      if (o !== "*" && e.parent[o].source === null) return l;
      const u = e.parent.on(s, i);
      return () => {
        l(), u();
      };
    }
  }), [
    r,
    n,
    e
  ]);
}, Yu = Q(Wu), Ku = ({ element: t, clientRef: e, name: n }) => {
  const r = X(t.args[0]);
  return r.current = t.args[0], Z(() => {
    const s = () => r.current.get(e.current);
    return Object.defineProperties(s, {
      source: { value: r.current.source },
      query: { value: r.current.query },
      name: {
        value: n,
        configurable: !0
      }
    }), s;
  }, [e, n]);
}, Ju = Q(Ku), Xu = (t, e) => {
  let n;
  try {
    const r = {};
    for (const s of Object.keys(e.query).sort()) r[s] = e.query[s];
    n = JSON.stringify(r);
  } catch {
    n = String(e.query);
  }
  return `${t}::${e.source}::${n}`;
}, Zu = (t) => {
  const e = v(3), { clients: n, clientRef: r } = t;
  let s;
  return e[0] !== r || e[1] !== n ? (s = Object.keys(n).map((i) => {
    const o = i, a = n[o];
    return ce(Xu(o, a.args[0]), Ju({
      element: a,
      clientRef: r,
      name: o
    }));
  }), e[0] = r, e[1] = n, e[2] = s) : s = e[2], Bi(hn(s));
}, ec = (t) => {
  const e = v(3), { rootClients: n, clientRef: r } = t;
  let s;
  return e[0] !== r || e[1] !== n ? (s = Object.keys(n).length > 0 ? Yu({
    clients: n,
    clientRef: r
  }) : Gu(), e[0] = r, e[1] = n, e[2] = s) : s = e[2], Pe(s);
}, tc = ({ parent: t, clients: e }) => {
  const { rootClients: n, derivedClients: r } = Lu(e, t), s = X({
    parent: t,
    current: null
  }).current;
  q(() => {
    s.current = a;
  });
  const i = ec({
    rootClients: n,
    clientRef: s
  }), o = Zu({
    clients: r,
    clientRef: s
  }), a = Z(() => {
    const l = t === fn ? Pu() : t, u = Object.create(l);
    Object.assign(u, {
      subscribe: i.subscribe ?? t.subscribe,
      on: i.on ?? t.on,
      [St]: ki(u)
    });
    for (const h of i.clients) u[h.name] = h;
    for (const h of o) u[h.name] = h;
    return u;
  }, [
    t,
    i,
    o
  ]);
  return s.current === null && (s.current = a), a;
}, nc = (t) => {
  const { value: e, effects: n } = hu(function() {
    return tc(t);
  });
  return e[Ii] = n, e;
};
function H(t, { parent: e } = { parent: Ei() }) {
  if (t) return nc({
    parent: e ?? fn,
    clients: t
  });
  if (e === null) throw new Error("received null parent, this usage is not allowed");
  return e;
}
const P = (t) => {
  const e = v(6), n = H();
  let r;
  e[0] !== n ? (r = Au(n), e[0] = n, e[1] = r) : r = e[1];
  const s = r;
  let i, o;
  e[2] !== s || e[3] !== t ? (i = () => t(s), o = () => t(s), e[2] = s, e[3] = t, e[4] = i, e[5] = o) : (i = e[4], o = e[5]);
  const a = hr(n.subscribe, i, o);
  if (a === s) throw new Error("You tried to return the entire AssistantState. This is not supported due to technical limitations.");
  return ql(a), a;
}, rc = (t) => {
  const e = H(), n = X(!1), r = n.current ? null : t(e);
  return P(() => n.current ? t(e) : r), () => (n.current = !0, t(e));
}, sc = Object.freeze({});
function pn(t) {
  const e = v(3), { getItemState: n, children: r } = t, s = rc(n);
  let i;
  return e[0] !== r || e[1] !== s ? (i = r(s), e[0] = r, e[1] = s, e[2] = i) : i = e[2], ic(i);
}
const ic = (t) => {
  const e = typeof t == "object" && t != null && "type" in t ? t : null, n = e?.type, r = e?.key;
  return Z(() => e, [
    n,
    r,
    typeof e?.props == "object" && e.props != null && Object.entries(e.props).length === 0 ? sc : e?.props
  ]) ?? t;
}, Xt = (t, e) => {
  const n = v(11), r = H(), s = hl(e);
  let i;
  n[0] !== t ? (i = Ri(t), n[0] = t, n[1] = i) : i = n[1];
  const { scope: o, event: a } = i;
  let l;
  n[2] !== r || n[3] !== s || n[4] !== a || n[5] !== o ? (l = () => r.on({
    scope: o,
    event: a
  }, s), n[2] = r, n[3] = s, n[4] = a, n[5] = o, n[6] = l) : l = n[6];
  let u;
  n[7] !== r || n[8] !== a || n[9] !== o ? (u = [
    r,
    o,
    a
  ], n[7] = r, n[8] = a, n[9] = o, n[10] = u) : u = n[10], q(l, u);
}, oc = (t) => {
  if (t.key === void 0) throw new Error("useClientLookup: Element has no key");
  return t.key;
};
function Qe(t) {
  const e = v(15);
  let n;
  e[0] !== t ? (n = t.map(uc), e[0] = t, e[1] = n) : n = e[1];
  const r = hn(n);
  let s;
  e[2] !== r ? (s = Object.keys(r), e[2] = r, e[3] = s) : s = e[3];
  const i = s;
  let o;
  e[4] !== r ? (o = r.reduce(lc, {}), e[4] = r, e[5] = o) : o = e[5];
  const a = o;
  let l;
  e[6] !== r ? (l = r.map(ac), e[6] = r, e[7] = l) : l = e[7];
  const u = l;
  let h;
  e[8] !== a || e[9] !== i || e[10] !== r ? (h = (d) => {
    if ("index" in d) {
      if (d.index < 0 || i.length === 0) throw new Error(`useClientLookup: Index ${d.index} out of bounds (length: ${i.length})`);
      const p = Math.min(d.index, i.length - 1);
      return p !== d.index && console.warn(`useClientLookup: Clamped stale index ${d.index} to ${p} (length: ${i.length})`), r[p].methods;
    }
    const f = a[d.key];
    if (f === void 0) throw new Error(`useClientLookup: Key "${d.key}" not found`);
    return r[f].methods;
  }, e[8] = a, e[9] = i, e[10] = r, e[11] = h) : h = e[11];
  let c;
  return e[12] !== u || e[13] !== h ? (c = {
    state: u,
    get: h
  }, e[12] = u, e[13] = h, e[14] = c) : c = e[14], c;
}
function ac(t) {
  return t.state;
}
function lc(t, e, n) {
  return t[e.key] = n, t;
}
function uc(t) {
  return ce(oc(t), Eu(t), t.deps);
}
const Oi = (t) => {
  const e = v(15), { toolkit: n, mcpApp: r } = t;
  let s;
  e[0] !== r ? (s = r ? [ce("mcpApp", r)] : [], e[0] = r, e[1] = s) : s = e[1];
  const i = hn(s)[0], [o, a] = J(hc);
  let l;
  e[2] !== o ? (l = Object.fromEntries(Object.entries(o).map(fc)), e[2] = o, e[3] = l) : l = e[3];
  let u;
  e[4] !== i || e[5] !== l || e[6] !== o ? (u = {
    toolUIs: o,
    mcpApp: i,
    tools: l
  }, e[4] = i, e[5] = l, e[6] = o, e[7] = u) : u = e[7];
  const h = u, c = Di();
  let d;
  e[8] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (d = (y, T, R) => {
    const C = {
      render: T,
      standalone: R?.standalone ?? !1
    };
    return a((I) => ({
      ...I,
      [y]: [...I[y] ?? [], C]
    })), () => {
      a((I) => {
        const b = I[y]?.filter((A) => A !== C) ?? [];
        if (b.length > 0) return {
          ...I,
          [y]: b
        };
        const E = { ...I };
        return delete E[y], E;
      });
    };
  }, e[8] = d) : d = e[8];
  const f = d;
  let p, x;
  e[9] !== c || e[10] !== n ? (p = () => {
    if (!n) return;
    const y = [];
    for (const [R, C] of Object.entries(n)) {
      const I = "render" in C ? C.render : void 0, b = "renderText" in C ? C.renderText : void 0, E = I ?? (b ? Su(b) : void 0);
      E && y.push(f(R, E, { standalone: _u(C) }));
    }
    const T = Object.entries(n).reduce(pc, {});
    return y.push(c.current.modelContext().register({ getModelContext: () => ({ tools: T }) })), () => {
      y.forEach(mc);
    };
  }, x = [
    n,
    f,
    c
  ], e[9] = c, e[10] = n, e[11] = p, e[12] = x) : (p = e[11], x = e[12]), q(p, x);
  let S;
  return e[13] !== h ? (S = {
    getState: () => h,
    setToolUI: f
  }, e[13] = h, e[14] = S) : S = e[14], S;
}, cc = Q(Oi);
Ai(Oi, (t, e) => {
  !t.modelContext && e.modelContext.source === null && (t.modelContext = wi());
});
function hc() {
  return {};
}
function dc(t) {
  return t.render;
}
function fc(t) {
  const [e, n] = t;
  return [e, n.map(dc)];
}
function pc(t, e) {
  const [n, r] = e;
  if (r.type === "mcp") return t;
  const { display: s, render: i, renderText: o, ...a } = r;
  return t[n] = a, t;
}
function mc(t) {
  return t();
}
const Je = (t) => hr(t.subscribe, t.getState), gc = (t) => {
  const e = v(8), { runtime: n } = t, r = Je(n);
  let s;
  e[0] !== r ? (s = () => r, e[0] = r, e[1] = s) : s = e[1];
  let i;
  e[2] !== n ? (i = () => n, e[2] = n, e[3] = i) : i = e[3];
  let o;
  return e[4] !== n.remove || e[5] !== s || e[6] !== i ? (o = {
    getState: s,
    remove: n.remove,
    __internal_getRuntime: i
  }, e[4] = n.remove, e[5] = s, e[6] = i, e[7] = o) : o = e[7], o;
}, Fi = Q(gc), bc = (t) => {
  const e = v(5), { runtime: n, index: r } = t;
  let s;
  e[0] !== r || e[1] !== n ? (s = n.getAttachmentByIndex(r), e[0] = r, e[1] = n, e[2] = s) : s = e[2];
  const i = s;
  let o;
  return e[3] !== i ? (o = Fi({ runtime: i }), e[3] = i, e[4] = o) : o = e[4], Pe(o);
}, yc = Q(bc), _c = ({ item: t, onSteer: e, onRemove: n }) => ({
  getState: () => t,
  steer: e,
  remove: n
}), xc = Q(_c), Sc = (t) => {
  const e = v(55), { threadIdRef: n, messageIdRef: r, runtime: s } = t, i = Je(s), o = gr();
  let a, l;
  e[0] !== o || e[1] !== r || e[2] !== s || e[3] !== n ? (a = () => {
    const E = [];
    for (const A of ["send", "attachmentAdd"]) {
      const D = s.unstable_on(A, () => {
        o(`composer.${A}`, {
          threadId: n.current,
          ...r && { messageId: r.current }
        });
      });
      E.push(D);
    }
    return E.push(s.unstable_on("attachmentAddError", (A) => {
      o("composer.attachmentAddError", {
        threadId: n.current,
        ...r && { messageId: r.current },
        ...A.attachmentId && { attachmentId: A.attachmentId },
        reason: A.reason,
        message: A.message
      });
    })), () => {
      for (const A of E) A();
    };
  }, l = [
    s,
    o,
    n,
    r
  ], e[0] = o, e[1] = r, e[2] = s, e[3] = n, e[4] = a, e[5] = l) : (a = e[4], l = e[5]), q(a, l);
  let u;
  if (e[6] !== s || e[7] !== i.attachments) {
    let E;
    e[9] !== s ? (E = (A, D) => ce(A.id, yc({
      runtime: s,
      index: D
    }), [s, D]), e[9] = s, e[10] = E) : E = e[10], u = i.attachments.map(E), e[6] = s, e[7] = i.attachments, e[8] = u;
  } else u = e[8];
  const h = Qe(u), c = i.queue;
  let d;
  if (e[11] !== c || e[12] !== s) {
    let E;
    e[14] !== s ? (E = (A) => ce(A.id, xc({
      item: A,
      onSteer: () => s.steerQueueItem(A.id),
      onRemove: () => s.removeQueueItem(A.id)
    })), e[14] = s, e[15] = E) : E = e[15], d = c.map(E), e[11] = c, e[12] = s, e[13] = d;
  } else d = e[13];
  const f = Qe(d), p = i.type ?? "thread";
  let x;
  e[16] !== h.state || e[17] !== c || e[18] !== i.attachmentAccept || e[19] !== i.canCancel || e[20] !== i.canSend || e[21] !== i.dictation || e[22] !== i.isEditing || e[23] !== i.isEmpty || e[24] !== i.quote || e[25] !== i.role || e[26] !== i.runConfig || e[27] !== i.text || e[28] !== p ? (x = {
    text: i.text,
    role: i.role,
    attachments: h.state,
    runConfig: i.runConfig,
    isEditing: i.isEditing,
    canCancel: i.canCancel,
    canSend: i.canSend,
    attachmentAccept: i.attachmentAccept,
    isEmpty: i.isEmpty,
    type: p,
    dictation: i.dictation,
    quote: i.quote,
    queue: c
  }, e[16] = h.state, e[17] = c, e[18] = i.attachmentAccept, e[19] = i.canCancel, e[20] = i.canSend, e[21] = i.dictation, e[22] = i.isEditing, e[23] = i.isEmpty, e[24] = i.quote, e[25] = i.role, e[26] = i.runConfig, e[27] = i.text, e[28] = p, e[29] = x) : x = e[29];
  const S = x;
  let y;
  e[30] !== S ? (y = () => S, e[30] = S, e[31] = y) : y = e[31];
  const T = s.beginEdit ?? wc;
  let R;
  e[32] !== h ? (R = (E) => "id" in E ? h.get({ key: E.id }) : h.get(E), e[32] = h, e[33] = R) : R = e[33];
  let C;
  e[34] !== f ? (C = (E) => f.get(E), e[34] = f, e[35] = C) : C = e[35];
  let I;
  e[36] !== s ? (I = () => s, e[36] = s, e[37] = I) : I = e[37];
  let b;
  return e[38] !== s.addAttachment || e[39] !== s.cancel || e[40] !== s.clearAttachments || e[41] !== s.reset || e[42] !== s.send || e[43] !== s.setQuote || e[44] !== s.setRole || e[45] !== s.setRunConfig || e[46] !== s.setText || e[47] !== s.startDictation || e[48] !== s.stopDictation || e[49] !== C || e[50] !== I || e[51] !== y || e[52] !== T || e[53] !== R ? (b = {
    getState: y,
    setText: s.setText,
    setRole: s.setRole,
    setRunConfig: s.setRunConfig,
    addAttachment: s.addAttachment,
    reset: s.reset,
    clearAttachments: s.clearAttachments,
    send: s.send,
    cancel: s.cancel,
    beginEdit: T,
    startDictation: s.startDictation,
    stopDictation: s.stopDictation,
    setQuote: s.setQuote,
    attachment: R,
    queueItem: C,
    __internal_getRuntime: I
  }, e[38] = s.addAttachment, e[39] = s.cancel, e[40] = s.clearAttachments, e[41] = s.reset, e[42] = s.send, e[43] = s.setQuote, e[44] = s.setRole, e[45] = s.setRunConfig, e[46] = s.setText, e[47] = s.startDictation, e[48] = s.stopDictation, e[49] = C, e[50] = I, e[51] = y, e[52] = T, e[53] = R, e[54] = b) : b = e[54], b;
}, $i = Q(Sc);
function wc() {
  throw new Error("beginEdit is not supported in this runtime");
}
const Ni = (t) => ({ get current() {
  return t();
} }), vc = (t) => {
  const e = v(13), { runtime: n } = t, r = Je(n);
  let s;
  e[0] !== r ? (s = () => r, e[0] = r, e[1] = s) : s = e[1];
  let i, o, a, l;
  e[2] !== n ? (i = (h) => n.addToolResult(h), o = (h) => n.resumeToolCall(h), a = (h) => n.respondToToolApproval(h), l = () => n, e[2] = n, e[3] = i, e[4] = o, e[5] = a, e[6] = l) : (i = e[3], o = e[4], a = e[5], l = e[6]);
  let u;
  return e[7] !== s || e[8] !== i || e[9] !== o || e[10] !== a || e[11] !== l ? (u = {
    getState: s,
    addToolResult: i,
    resumeToolCall: o,
    respondToToolApproval: a,
    __internal_getRuntime: l
  }, e[7] = s, e[8] = i, e[9] = o, e[10] = a, e[11] = l, e[12] = u) : u = e[12], u;
}, kc = Q(vc), Tc = (t) => {
  const e = v(5), { runtime: n, index: r } = t;
  let s;
  e[0] !== r || e[1] !== n ? (s = n.getAttachmentByIndex(r), e[0] = r, e[1] = n, e[2] = s) : s = e[2];
  const i = s;
  let o;
  return e[3] !== i ? (o = Fi({ runtime: i }), e[3] = i, e[4] = o) : o = e[4], Pe(o);
}, Cc = Q(Tc), Ic = (t) => {
  const e = v(5), { runtime: n, index: r } = t;
  let s;
  e[0] !== r || e[1] !== n ? (s = n.getMessagePartByIndex(r), e[0] = r, e[1] = n, e[2] = s) : s = e[2];
  const i = s;
  let o;
  return e[3] !== i ? (o = kc({ runtime: i }), e[3] = i, e[4] = o) : o = e[4], Pe(o);
}, Ec = Q(Ic), Ac = (t) => {
  const e = v(55), { runtime: n, threadIdRef: r } = t, s = Je(n), [i, o] = J(!1), [a, l] = J(!1);
  let u;
  e[0] !== n ? (u = Ni(() => n.getState().id), e[0] = n, e[1] = u) : u = e[1];
  const h = u;
  let c;
  e[2] !== h || e[3] !== n.composer || e[4] !== r ? (c = $i({
    runtime: n.composer,
    threadIdRef: r,
    messageIdRef: h
  }), e[2] = h, e[3] = n.composer, e[4] = r, e[5] = c) : c = e[5];
  const d = Mt(c);
  let f;
  if (e[6] !== n || e[7] !== s.content) {
    let j;
    e[9] !== n ? (j = (ue, m) => ce("toolCallId" in ue && ue.toolCallId != null ? `toolCallId-${ue.toolCallId}` : `index-${m}`, Ec({
      runtime: n,
      index: m
    }), [n, m]), e[9] = n, e[10] = j) : j = e[10], f = s.content.map(j), e[6] = n, e[7] = s.content, e[8] = f;
  } else f = e[8];
  const p = Qe(f);
  let x;
  e[11] !== s.attachments ? (x = s.attachments ?? [], e[11] = s.attachments, e[12] = x) : x = e[12];
  let S;
  if (e[13] !== n || e[14] !== x) {
    let j;
    e[16] !== n ? (j = (ue, m) => ce(ue.id, Cc({
      runtime: n,
      index: m
    }), [n, m]), e[16] = n, e[17] = j) : j = e[17], S = x.map(j), e[13] = n, e[14] = x, e[15] = S;
  } else S = e[15];
  const y = Qe(S), T = s;
  let R;
  e[18] !== d.state || e[19] !== i || e[20] !== a || e[21] !== p.state || e[22] !== T ? (R = {
    ...T,
    parts: p.state,
    composer: d.state,
    isCopied: i,
    isHovering: a
  }, e[18] = d.state, e[19] = i, e[20] = a, e[21] = p.state, e[22] = T, e[23] = R) : R = e[23];
  const C = R;
  let I;
  e[24] !== C ? (I = () => C, e[24] = C, e[25] = I) : I = e[25];
  let b;
  e[26] !== d.methods ? (b = () => d.methods, e[26] = d.methods, e[27] = b) : b = e[27];
  let E, A, D, w, L, O, V;
  e[28] !== n ? (E = () => n.delete(), A = (j) => n.reload(j), D = () => n.speak(), w = () => n.stopSpeaking(), L = (j) => n.submitFeedback(j), O = (j) => n.switchToBranch(j), V = () => n.unstable_getCopyText(), e[28] = n, e[29] = E, e[30] = A, e[31] = D, e[32] = w, e[33] = L, e[34] = O, e[35] = V) : (E = e[29], A = e[30], D = e[31], w = e[32], L = e[33], O = e[34], V = e[35]);
  let G;
  e[36] !== p ? (G = (j) => "index" in j ? p.get({ index: j.index }) : p.get({ key: `toolCallId-${j.toolCallId}` }), e[36] = p, e[37] = G) : G = e[37];
  let F;
  e[38] !== y ? (F = (j) => "id" in j ? y.get({ key: j.id }) : y.get(j), e[38] = y, e[39] = F) : F = e[39];
  let K;
  e[40] !== n ? (K = () => n, e[40] = n, e[41] = K) : K = e[41];
  let ee;
  return e[42] !== E || e[43] !== A || e[44] !== D || e[45] !== w || e[46] !== L || e[47] !== O || e[48] !== V || e[49] !== G || e[50] !== F || e[51] !== K || e[52] !== I || e[53] !== b ? (ee = {
    getState: I,
    composer: b,
    delete: E,
    reload: A,
    speak: D,
    stopSpeaking: w,
    submitFeedback: L,
    switchToBranch: O,
    getCopyText: V,
    part: G,
    attachment: F,
    setIsCopied: o,
    setIsHovering: l,
    __internal_getRuntime: K
  }, e[42] = E, e[43] = A, e[44] = D, e[45] = w, e[46] = L, e[47] = O, e[48] = V, e[49] = G, e[50] = F, e[51] = K, e[52] = I, e[53] = b, e[54] = ee) : ee = e[54], ee;
}, Rc = Q(Ac), Mc = (t) => {
  const e = v(6), { runtime: n, id: r, threadIdRef: s } = t;
  let i;
  e[0] !== r || e[1] !== n ? (i = n.getMessageById(r), e[0] = r, e[1] = n, e[2] = i) : i = e[2];
  const o = i;
  let a;
  return e[3] !== o || e[4] !== s ? (a = Rc({
    runtime: o,
    threadIdRef: s
  }), e[3] = o, e[4] = s, e[5] = a) : a = e[5], Pe(a);
}, Pc = Q(Mc), Dc = (t) => {
  const e = v(59), { runtime: n } = t, r = Je(n), s = gr();
  let i, o;
  e[0] !== s || e[1] !== n ? (i = () => {
    const I = [];
    for (const b of [
      "runStart",
      "runEnd",
      "initialize",
      "modelContextUpdate"
    ]) {
      const E = n.unstable_on(b, () => {
        const A = n.getState()?.threadId || "unknown";
        s(`thread.${b}`, { threadId: A });
      });
      I.push(E);
    }
    return () => {
      for (const b of I) b();
    };
  }, o = [n, s], e[0] = s, e[1] = n, e[2] = i, e[3] = o) : (i = e[2], o = e[3]), q(i, o);
  let a;
  e[4] !== n ? (a = Ni(() => n.getState().threadId), e[4] = n, e[5] = a) : a = e[5];
  const l = a;
  let u;
  e[6] !== n.composer || e[7] !== l ? (u = $i({
    runtime: n.composer,
    threadIdRef: l
  }), e[6] = n.composer, e[7] = l, e[8] = u) : u = e[8];
  const h = Mt(u);
  let c;
  if (e[9] !== n || e[10] !== r.messages || e[11] !== l) {
    let I;
    e[13] !== n || e[14] !== l ? (I = (b) => ce(b.id, Pc({
      runtime: n,
      id: b.id,
      threadIdRef: l
    }), [
      n,
      b.id,
      l
    ]), e[13] = n, e[14] = l, e[15] = I) : I = e[15], c = r.messages.map(I), e[9] = n, e[10] = r.messages, e[11] = l, e[12] = c;
  } else c = e[12];
  const d = Qe(c), f = d.state.length === 0 && !r.isLoading;
  let p;
  e[16] !== h.state || e[17] !== d.state || e[18] !== r.capabilities || e[19] !== r.extras || e[20] !== r.isDisabled || e[21] !== r.isLoading || e[22] !== r.isRunning || e[23] !== r.speech || e[24] !== r.state || e[25] !== r.suggestions || e[26] !== r.voice || e[27] !== f ? (p = {
    isEmpty: f,
    isDisabled: r.isDisabled,
    isLoading: r.isLoading,
    isRunning: r.isRunning,
    capabilities: r.capabilities,
    state: r.state,
    suggestions: r.suggestions,
    extras: r.extras,
    speech: r.speech,
    voice: r.voice,
    composer: h.state,
    messages: d.state
  }, e[16] = h.state, e[17] = d.state, e[18] = r.capabilities, e[19] = r.extras, e[20] = r.isDisabled, e[21] = r.isLoading, e[22] = r.isRunning, e[23] = r.speech, e[24] = r.state, e[25] = r.suggestions, e[26] = r.voice, e[27] = f, e[28] = p) : p = e[28];
  const x = p;
  let S;
  e[29] !== x ? (S = () => x, e[29] = x, e[30] = S) : S = e[30];
  let y;
  e[31] !== h.methods ? (y = () => h.methods, e[31] = h.methods, e[32] = y) : y = e[32];
  let T;
  e[33] !== d ? (T = (I) => "id" in I ? d.get({ key: I.id }) : d.get(I), e[33] = d, e[34] = T) : T = e[34];
  let R;
  e[35] !== n ? (R = () => n, e[35] = n, e[36] = R) : R = e[36];
  let C;
  return e[37] !== n.append || e[38] !== n.cancelRun || e[39] !== n.connectVoice || e[40] !== n.deleteMessage || e[41] !== n.disconnectVoice || e[42] !== n.export || e[43] !== n.getModelContext || e[44] !== n.getVoiceVolume || e[45] !== n.import || e[46] !== n.importExternalState || e[47] !== n.muteVoice || e[48] !== n.reset || e[49] !== n.resumeRun || e[50] !== n.startRun || e[51] !== n.stopSpeaking || e[52] !== n.subscribeVoiceVolume || e[53] !== n.unmuteVoice || e[54] !== T || e[55] !== R || e[56] !== S || e[57] !== y ? (C = {
    getState: S,
    composer: y,
    append: n.append,
    deleteMessage: n.deleteMessage,
    startRun: n.startRun,
    resumeRun: n.resumeRun,
    importExternalState: n.importExternalState,
    cancelRun: n.cancelRun,
    getModelContext: n.getModelContext,
    export: n.export,
    import: n.import,
    reset: n.reset,
    stopSpeaking: n.stopSpeaking,
    connectVoice: n.connectVoice,
    disconnectVoice: n.disconnectVoice,
    getVoiceVolume: n.getVoiceVolume,
    subscribeVoiceVolume: n.subscribeVoiceVolume,
    muteVoice: n.muteVoice,
    unmuteVoice: n.unmuteVoice,
    message: T,
    __internal_getRuntime: R
  }, e[37] = n.append, e[38] = n.cancelRun, e[39] = n.connectVoice, e[40] = n.deleteMessage, e[41] = n.disconnectVoice, e[42] = n.export, e[43] = n.getModelContext, e[44] = n.getVoiceVolume, e[45] = n.import, e[46] = n.importExternalState, e[47] = n.muteVoice, e[48] = n.reset, e[49] = n.resumeRun, e[50] = n.startRun, e[51] = n.stopSpeaking, e[52] = n.subscribeVoiceVolume, e[53] = n.unmuteVoice, e[54] = T, e[55] = R, e[56] = S, e[57] = y, e[58] = C) : C = e[58], C;
}, Bc = Q(Dc), Oc = (t) => {
  const e = v(20), { runtime: n } = t, r = Je(n), s = gr();
  let i, o;
  e[0] !== s || e[1] !== n ? (i = () => {
    const h = [];
    for (const c of ["switchedTo", "switchedAway"]) {
      const d = n.unstable_on(c, () => {
        s(`threadListItem.${c}`, { threadId: n.getState().id });
      });
      h.push(d);
    }
    return () => {
      for (const c of h) c();
    };
  }, o = [n, s], e[0] = s, e[1] = n, e[2] = i, e[3] = o) : (i = e[2], o = e[3]), q(i, o);
  let a;
  e[4] !== r ? (a = () => r, e[4] = r, e[5] = a) : a = e[5];
  let l;
  e[6] !== n ? (l = () => n, e[6] = n, e[7] = l) : l = e[7];
  let u;
  return e[8] !== n.archive || e[9] !== n.delete || e[10] !== n.detach || e[11] !== n.generateTitle || e[12] !== n.initialize || e[13] !== n.rename || e[14] !== n.switchTo || e[15] !== n.unarchive || e[16] !== n.updateCustom || e[17] !== a || e[18] !== l ? (u = {
    getState: a,
    switchTo: n.switchTo,
    rename: n.rename,
    updateCustom: n.updateCustom,
    archive: n.archive,
    unarchive: n.unarchive,
    delete: n.delete,
    generateTitle: n.generateTitle,
    initialize: n.initialize,
    detach: n.detach,
    __internal_getRuntime: l
  }, e[8] = n.archive, e[9] = n.delete, e[10] = n.detach, e[11] = n.generateTitle, e[12] = n.initialize, e[13] = n.rename, e[14] = n.switchTo, e[15] = n.unarchive, e[16] = n.updateCustom, e[17] = a, e[18] = l, e[19] = u) : u = e[19], u;
}, Fc = Q(Oc), $c = (t) => {
  const e = v(5), { runtime: n, id: r } = t;
  let s;
  e[0] !== r || e[1] !== n ? (s = n.getItemById(r), e[0] = r, e[1] = n, e[2] = s) : s = e[2];
  const i = s;
  let o;
  return e[3] !== i ? (o = Fc({ runtime: i }), e[3] = i, e[4] = o) : o = e[4], Pe(o);
}, Nc = Q($c), Lc = (t) => {
  const e = v(40), { runtime: n, __internal_assistantRuntime: r } = t, s = Je(n);
  let i;
  e[0] !== n.main ? (i = Bc({ runtime: n.main }), e[0] = n.main, e[1] = i) : i = e[1];
  const o = Mt(i);
  let a;
  e[2] !== n || e[3] !== s.threadItems ? (a = Object.keys(s.threadItems).map((b) => ce(b, Nc({
    runtime: n,
    id: b
  }), [n, b])), e[2] = n, e[3] = s.threadItems, e[4] = a) : a = e[4];
  const l = Qe(a), u = s.newThreadId ?? null;
  let h;
  e[5] !== o.state || e[6] !== s.archivedThreadIds || e[7] !== s.hasMore || e[8] !== s.isLoading || e[9] !== s.isLoadingMore || e[10] !== s.mainThreadId || e[11] !== s.threadIds || e[12] !== u || e[13] !== l.state ? (h = {
    mainThreadId: s.mainThreadId,
    newThreadId: u,
    isLoading: s.isLoading,
    isLoadingMore: s.isLoadingMore,
    hasMore: s.hasMore,
    threadIds: s.threadIds,
    archivedThreadIds: s.archivedThreadIds,
    threadItems: l.state,
    main: o.state
  }, e[5] = o.state, e[6] = s.archivedThreadIds, e[7] = s.hasMore, e[8] = s.isLoading, e[9] = s.isLoadingMore, e[10] = s.mainThreadId, e[11] = s.threadIds, e[12] = u, e[13] = l.state, e[14] = h) : h = e[14];
  const c = h;
  let d;
  e[15] !== c ? (d = () => c, e[15] = c, e[16] = d) : d = e[16];
  let f;
  e[17] !== o.methods ? (f = () => o.methods, e[17] = o.methods, e[18] = f) : f = e[18];
  let p;
  e[19] !== c || e[20] !== l ? (p = (b) => {
    if (b === "main") return l.get({ key: c.mainThreadId });
    if ("id" in b) return l.get({ key: b.id });
    const { index: E, archived: A } = b, D = A !== void 0 && A ? c.archivedThreadIds[E] : c.threadIds[E];
    return l.get({ key: D });
  }, e[19] = c, e[20] = l, e[21] = p) : p = e[21];
  let x, S, y, T, R;
  e[22] !== n ? (T = async (b, E) => {
    await n.switchToThread(b, E);
  }, R = async () => {
    await n.switchToNewThread();
  }, x = () => n.getLoadThreadsPromise(), S = () => n.reload(), y = () => n.loadMore(), e[22] = n, e[23] = x, e[24] = S, e[25] = y, e[26] = T, e[27] = R) : (x = e[23], S = e[24], y = e[25], T = e[26], R = e[27]);
  let C;
  e[28] !== r ? (C = () => r, e[28] = r, e[29] = C) : C = e[29];
  let I;
  return e[30] !== x || e[31] !== S || e[32] !== y || e[33] !== C || e[34] !== d || e[35] !== f || e[36] !== p || e[37] !== T || e[38] !== R ? (I = {
    getState: d,
    thread: f,
    item: p,
    switchToThread: T,
    switchToNewThread: R,
    getLoadThreadsPromise: x,
    reload: S,
    loadMore: y,
    __internal_getAssistantRuntime: C
  }, e[30] = x, e[31] = S, e[32] = y, e[33] = C, e[34] = d, e[35] = f, e[36] = p, e[37] = T, e[38] = R, e[39] = I) : I = e[39], I;
}, zc = Q(Lc), Vc = (t) => ({ getState: () => t }), Uc = Q(Vc), qc = (t) => {
  const e = v(11);
  let n;
  e[0] !== t ? (n = () => ({ suggestions: (t ?? []).map(Hc) }), e[0] = t, e[1] = n) : n = e[1];
  const [r] = J(n);
  let s;
  e[2] !== r.suggestions ? (s = r.suggestions.map(Gc), e[2] = r.suggestions, e[3] = s) : s = e[3];
  const i = Qe(s);
  let o;
  e[4] !== r ? (o = () => r, e[4] = r, e[5] = o) : o = e[5];
  let a;
  e[6] !== i ? (a = (u) => {
    const { index: h } = u;
    return i.get({ index: h });
  }, e[6] = i, e[7] = a) : a = e[7];
  let l;
  return e[8] !== o || e[9] !== a ? (l = {
    getState: o,
    suggestion: a
  }, e[8] = o, e[9] = a, e[10] = l) : l = e[10], l;
}, jc = Q(qc);
function Hc(t) {
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
function Gc(t, e) {
  return ce(e, Uc(t), [t]);
}
const Qc = (t, e) => {
  t.thread ??= _e({
    source: "threads",
    query: { type: "main" },
    get: (n) => n.threads().thread("main")
  }), t.threadListItem ??= _e({
    source: "threads",
    query: { type: "main" },
    get: (n) => n.threads().item("main")
  }), t.composer ??= _e({
    source: "thread",
    query: {},
    get: (n) => n.threads().thread("main").composer()
  }), !t.modelContext && e.modelContext.source === null && (t.modelContext = wi()), !t.suggestions && e.suggestions.source === null && (t.suggestions = jc());
}, Li = (t) => {
  const e = v(6), n = Di();
  let r, s;
  e[0] !== n || e[1] !== t ? (r = () => t.registerModelContextProvider(n.current.modelContext()), s = [t, n], e[0] = n, e[1] = t, e[2] = r, e[3] = s) : (r = e[2], s = e[3]), q(r, s);
  let i;
  return e[4] !== t ? (i = zc({
    runtime: t.threads,
    __internal_assistantRuntime: t
  }), e[4] = t, e[5] = i) : i = e[5], Pe(i);
}, Wc = Q(Li);
Ai(Li, (t, e) => {
  Qc(t, e), !t.tools && e.tools.source === null && (t.tools = cc({})), !t.dataRenderers && e.dataRenderers.source === null && (t.dataRenderers = fu());
});
const Yc = (t) => t._core?.RenderComponent, Kc = te(({ runtime: t, aui: e = null, children: n }) => {
  "use no memo";
  const r = H({ threads: Wc(t) }, { parent: e }), s = Yc(t), i = /* @__PURE__ */ Ae(Ee, {
    value: r,
    children: [s && /* @__PURE__ */ _(s, {}), n]
  });
  return e ? /* @__PURE__ */ _(Ee, {
    value: e,
    children: i
  }) : i;
});
function se(t) {
  return t != null && typeof t == "object" && !Array.isArray(t);
}
function Zt(t, e = 0) {
  return e > 100 ? !1 : t === null || typeof t == "string" || typeof t == "boolean" ? !0 : typeof t == "number" ? !Number.isNaN(t) && Number.isFinite(t) : Array.isArray(t) ? t.every((n) => Zt(n, e + 1)) : se(t) ? Object.entries(t).every(([n, r]) => typeof n == "string" && Zt(r, e + 1)) : !1;
}
const Jc = 100, jn = (t, e, n) => {
  if (t === e) return !0;
  if (n > Jc || t == null || e == null) return !1;
  if (Array.isArray(t))
    return !Array.isArray(e) || t.length !== e.length ? !1 : t.every((i, o) => jn(i, e[o], n + 1));
  if (Array.isArray(e) || !se(t) || !se(e)) return !1;
  const r = Object.keys(t), s = Object.keys(e);
  return r.length !== s.length ? !1 : r.every((i) => Object.hasOwn(e, i) && jn(t[i], e[i], n + 1));
}, br = (t, e) => !Zt(t) || !Zt(e) ? !1 : jn(t, e, 0);
function Xc(t) {
  const e = t.metadata;
  if (!e || typeof e != "object") return;
  const n = e.custom;
  if (!n || typeof n != "object") return;
  const r = n.interactables;
  return Array.isArray(r) ? r : void 0;
}
function Zc(t) {
  return `update_${t.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}
const ns = (t) => {
  if (!se(t)) return;
  const e = t.id;
  return typeof e == "string" || typeof e == "number" ? e : void 0;
};
function eh(t, e, n) {
  let r = Array.isArray(e.set) ? [...e.set] : [...t];
  if (e.clear === !0 && (r = []), Array.isArray(e.remove) && e.remove.length > 0) {
    const i = new Set(e.remove);
    r = r.filter((o) => {
      const a = ns(o);
      return a !== void 0 ? !i.has(a) : !i.has(o);
    });
  }
  const s = e.update;
  if (Array.isArray(s) && s.length > 0 && (r = r.map((i) => {
    const o = ns(i);
    if (o === void 0 || !se(i)) return i;
    const a = s.find((l) => se(l) && l.id === o);
    return a ? {
      ...i,
      ...a
    } : i;
  })), Array.isArray(e.add) && e.add.length > 0) {
    const i = n ? e.add.map((o) => {
      if (!se(o) || o.id !== void 0) return o;
      const a = n();
      return a === void 0 ? o : {
        ...o,
        id: a
      };
    }) : e.add;
    r = [...r, ...i];
  }
  return r;
}
function Tn(t, e, n) {
  if (!se(t) || !se(e)) return e;
  const r = se(n?.arrayBaseline) ? n.arrayBaseline : t, s = { ...t };
  for (const [i, o] of Object.entries(e)) {
    const a = r[i];
    Array.isArray(a) && se(o) ? s[i] = eh(a, o, n?.idFactory && (n.idKeyedFields === void 0 || n.idKeyedFields.has(i)) ? () => n.idFactory?.(i) : void 0) : s[i] = o;
  }
  return s;
}
function th(t, e) {
  if (!se(t) || !se(e)) return;
  for (const s of Object.keys(t)) if (!(s in e)) return;
  const n = {};
  for (const [s, i] of Object.entries(e)) (!(s in t) || !br(t[s], i)) && (n[s] = i);
  const r = Object.keys(n).length;
  if (!(r === 0 || r === Object.keys(e).length))
    return n;
}
const nh = (t) => {
  if (!t || typeof t != "object") return;
  const e = t;
  return e.type === "tool-call" ? e : void 0;
}, rh = (t, e) => {
  if (!t.args || typeof t.args != "object") return !1;
  const n = se(t.result) ? t.result : void 0;
  if (n?.success === !1) return !1;
  if (typeof n?.id == "string") return n.id === e;
  const r = t.args.id;
  return r === e || r === void 0;
}, sh = (t) => {
  const e = se(t) ? t.addedItemIds : void 0;
  if (!se(e)) return;
  const n = /* @__PURE__ */ new Map();
  for (const [r, s] of Object.entries(e)) {
    if (!Array.isArray(s)) continue;
    const i = s.filter((o) => typeof o == "string");
    i.length > 0 && n.set(r, i);
  }
  if (n.size !== 0)
    return (r) => n.get(r)?.shift();
}, rs = /* @__PURE__ */ new WeakMap();
function ih(t, e, n) {
  let r = rs.get(t);
  r || (r = /* @__PURE__ */ new Map(), rs.set(t, r));
  let s = r.get(n);
  s || (s = /* @__PURE__ */ new Map(), r.set(n, s));
  const i = s.get(e);
  if (i) return i;
  const o = Zc(n), a = [], l = () => a[a.length - 1];
  for (const u of t) {
    if (u.role === "user") {
      const h = Xc(u)?.find((c) => c.id === e);
      if (!h) continue;
      if (h.partial) {
        const c = l();
        c && a.push({
          state: Tn(c.state, h.state),
          origin: "user-edit"
        });
      } else a.push({
        state: h.state,
        origin: "user-edit"
      });
      continue;
    }
    if (u.role === "assistant")
      for (const h of u.content ?? []) {
        const c = nh(h);
        if (c) {
          if (c.toolCallId === e && c.toolName === n)
            c.args && typeof c.args == "object" && a.push({
              state: c.args,
              origin: "create",
              toolCallId: e
            });
          else if (c.toolName === o && rh(c, e)) {
            const d = l();
            if (d) {
              const { id: f, ...p } = c.args, x = sh(c.result);
              a.push({
                state: x ? Tn(d.state, p, { idFactory: x }) : Tn(d.state, p),
                origin: "update",
                toolCallId: c.toolCallId
              });
            }
          }
        }
      }
  }
  return s.set(e, a), a;
}
function oh(t, e, n) {
  const r = ih(t, e, n), s = r[r.length - 1];
  return s ? { state: s.state } : void 0;
}
function zi(t, e) {
  if (!t) return;
  const { interactables: n, ...r } = t, s = { ...r };
  if (Array.isArray(n)) {
    const i = [];
    for (const o of n) {
      const a = oh(e, o.id, o.name);
      if (!a) {
        i.push({
          id: o.id,
          name: o.name,
          state: o.state
        });
        continue;
      }
      if (br(o.state, a.state)) continue;
      const l = th(a.state, o.state);
      i.push(l ? {
        id: o.id,
        name: o.name,
        state: l,
        partial: !0
      } : {
        id: o.id,
        name: o.name,
        state: o.state
      });
    }
    i.length && (s.interactables = i);
  }
  return Object.keys(s).length ? s : void 0;
}
const yr = () => {
  let t, e;
  const n = new Promise((r, s) => {
    t = r, e = s;
  });
  if (!t || !e) throw new Error("Failed to create promise");
  return {
    promise: n,
    resolve: t,
    reject: e
  };
}, ah = () => {
  const t = [];
  let e = !1, n = !1, r = !1, s, i;
  const o = () => {
    t.forEach((l) => {
      l.reader.cancel().catch(() => {
      });
    }), t.length = 0;
  }, a = (l) => {
    l.promise || (l.promise = l.reader.read().then(({ done: u, value: h }) => {
      l.promise = void 0, !(n || r) && (u ? (t.splice(t.indexOf(l), 1), e && t.length === 0 && s.close()) : s.enqueue(h), i?.resolve(), i = void 0);
    }).catch((u) => {
      n || r || (r = !0, console.error(u), o(), s.error(u), i?.reject(u), i = void 0);
    }));
  };
  return {
    readable: new ReadableStream({
      start(l) {
        s = l;
      },
      pull() {
        return i = yr(), t.forEach((l) => {
          a(l);
        }), i.promise;
      },
      cancel() {
        n = !0, o(), i?.resolve(), i = void 0;
      }
    }),
    isSealed() {
      return e;
    },
    isCancelled() {
      return n;
    },
    isErrored() {
      return r;
    },
    seal() {
      n || r || (e = !0, t.length === 0 && s.close());
    },
    addStream(l) {
      if (n || r) {
        l.cancel().catch(() => {
        });
        return;
      }
      if (e) throw new Error("Cannot add streams after the run callback has settled.");
      const u = { reader: l.getReader() };
      t.push(u), a(u);
    },
    enqueue(l) {
      this.addStream(new ReadableStream({ start(u) {
        u.enqueue(l), u.close();
      } }));
    }
  };
};
var ss = class {
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
    } catch (n) {
      this._warnedDropped || (this._warnedDropped = !0, console.error(`Dropped text delta for closed stream: ${String(n)}`));
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
const Vi = (t, e = {}) => new ReadableStream({
  start(n) {
    return t.start?.(new ss(n, e));
  },
  pull(n) {
    return t.pull?.(new ss(n, e));
  },
  cancel(n) {
    return t.cancel?.(n);
  }
}), is = (t = {}) => {
  let e;
  return [Vi({ start(n) {
    e = n;
  } }, t), e];
}, os = /* @__PURE__ */ Symbol.for("aui.tool-response"), Hn = "<no result>";
var Ie = class Gn {
  get [os]() {
    return !0;
  }
  artifact;
  result;
  isError;
  modelContent;
  messages;
  constructor(e) {
    e.artifact !== void 0 && (this.artifact = e.artifact);
    const n = e.result;
    this.result = n === void 0 ? Hn : n, this.isError = e.isError ?? !1, e.modelContent !== void 0 && (this.modelContent = e.modelContent), e.messages !== void 0 && (this.messages = e.messages);
  }
  static [Symbol.hasInstance](e) {
    return typeof e == "object" && e !== null && os in e;
  }
  /**
  * Converts a plain tool return value into a {@link ToolResponse}.
  *
  * Existing `ToolResponse` instances are returned unchanged. `undefined`
  * becomes the string `"<no result>"` so downstream protocol chunks always
  * carry a concrete result.
  */
  static toResponse(e) {
    return e instanceof Gn ? e : new Gn({ result: e === void 0 ? Hn : e });
  }
}, as = class {
  _isClosed = !1;
  _mergeTask;
  _controller;
  constructor(t) {
    this._controller = t;
    const e = Vi({ start: (r) => {
      this._argsTextController = r;
    } });
    let n = !1;
    this._mergeTask = e.pipeTo(new WritableStream({ write: (r) => {
      switch (r.type) {
        case "text-delta":
          n = !0, this._controller.enqueue(r);
          break;
        case "part-finish":
          n || this._controller.enqueue({
            type: "text-delta",
            textDelta: "{}",
            path: []
          }), this._controller.enqueue({
            type: "tool-call-args-text-finish",
            path: []
          });
          break;
        default:
          throw new Error(`Unexpected chunk type: ${r.type}`);
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
      result: e === void 0 ? Hn : e,
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
const lh = (t) => new ReadableStream({
  start(e) {
    return t.start?.(new as(e));
  },
  pull(e) {
    return t.pull?.(new as(e));
  },
  cancel(e) {
    return t.cancel?.(e);
  }
}), uh = () => {
  let t;
  return [lh({ start(e) {
    t = e;
  } }), t];
};
var Ui = class {
  value = -1;
  up() {
    return ++this.value;
  }
}, ch = class extends TransformStream {
  constructor(t) {
    super({ transform(e, n) {
      n.enqueue({
        ...e,
        path: [t, ...e.path]
      });
    } });
  }
};
(class extends TransformStream {
  constructor(t) {
    super({ transform(e, n) {
      const { path: [r, ...s] } = e;
      if (t !== r) throw new Error(`Path mismatch: expected ${t}, got ${r}`);
      n.enqueue({
        ...e,
        path: s
      });
    } });
  }
});
var hh = class extends TransformStream {
  constructor(t) {
    const e = new Ui(), n = /* @__PURE__ */ new Map();
    super({ transform(r, s) {
      r.type === "part-start" && r.path.length === 0 && n.set(e.up(), t.up());
      const [i, ...o] = r.path;
      if (i === void 0) {
        s.enqueue(r);
        return;
      }
      const a = n.get(i);
      if (a === void 0) throw new Error("Path not found");
      s.enqueue({
        ...r,
        path: [a, ...o]
      });
    } });
  }
}, dh = class extends TransformStream {
  constructor(t) {
    super();
    const e = t(super.readable);
    Object.defineProperty(this, "readable", {
      value: e,
      writable: !1
    });
  }
}, qi = class extends TransformStream {
  constructor() {
    const t = [];
    super({ transform(e, n) {
      if (e.type === "part-start") {
        if (e.path.length !== 0) {
          n.error(/* @__PURE__ */ new Error("Nested parts are not supported"));
          return;
        }
        t.push(e.part), n.enqueue(e);
        return;
      }
      if (e.type === "text-delta" || e.type === "result" || e.type === "part-finish" || e.type === "tool-call-args-text-finish") {
        if (e.path.length !== 1) {
          n.error(/* @__PURE__ */ new Error(`${e.type} chunks must have a path of length 1`));
          return;
        }
        const r = e.path[0];
        if (r < 0 || r >= t.length) {
          n.error(/* @__PURE__ */ new Error(`Invalid path index: ${r}`));
          return;
        }
        const s = t[r];
        n.enqueue({
          ...e,
          meta: s
        });
        return;
      }
      n.enqueue(e);
    } });
  }
};
const fh = Ks("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);
var ph = class ji {
  _state;
  _parentId;
  constructor(e, n = {}) {
    this._state = e || {
      strict: n.strict ?? !0,
      merger: ah(),
      contentCounter: new Ui()
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
  _addPart(e, n) {
    this._state.append && (this._state.append.controller.close(), this._state.append = void 0), this.enqueue({
      type: "part-start",
      part: e,
      path: []
    }), this._state.merger.addStream(n.pipeThrough(new ch(this._state.contentCounter.value)));
  }
  merge(e) {
    this._state.merger.addStream(e.pipeThrough(new hh(this._state.contentCounter)));
  }
  appendText(e) {
    (this._state.append?.kind !== "text" || this._state.append.parentId !== this._parentId) && (this._state.append = {
      kind: "text",
      parentId: this._parentId,
      controller: this.addTextPart()
    }), this._state.append.controller.append(e);
  }
  appendReasoning(e, n) {
    (n !== void 0 || this._state.append?.kind !== "reasoning" || this._state.append.parentId !== this._parentId) && (this._state.append = {
      kind: "reasoning",
      parentId: this._parentId,
      controller: this.addReasoningPart(n)
    }), !(n !== void 0 && e.length === 0) && this._state.append.controller.append(e);
  }
  addTextPart() {
    const [e, n] = is({ strict: this._state.strict });
    return this._addPart(this._withParentIdOption({ type: "text" }), e), n;
  }
  addReasoningPart(e) {
    const [n, r] = is({ strict: this._state.strict });
    return this._addPart(this._withParentIdOption({
      type: "reasoning",
      ...e
    }), n), r;
  }
  addToolCallPart(e) {
    const n = typeof e == "string" ? { toolName: e } : e, r = n.toolName, s = n.toolCallId ?? fh(), [i, o] = uh();
    return this._addPart({
      type: "tool-call",
      toolName: r,
      toolCallId: s,
      ...this._parentId && { parentId: this._parentId }
    }, i), n.argsText !== void 0 && (o.argsText.append(n.argsText), o.argsText.close()), n.args !== void 0 && (o.argsText.append(JSON.stringify(n.args)), o.argsText.close()), n.response !== void 0 && o.setResponse(n.response), o;
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
    const n = new ji(this._state);
    return n._parentId = e, n;
  }
  close() {
    this._state.append?.controller?.close(), this._state.merger.seal(), this._state.closeSubscriber?.();
  }
};
function mh(t, e = {}) {
  const n = new ph(void 0, e);
  return (async () => {
    try {
      await t(n);
    } catch (s) {
      n.__internal_isClosed ? n.__internal_isCancelled || console.error(s) : n.enqueue({
        type: "error",
        path: [],
        error: String(s)
      });
    } finally {
      n.__internal_isClosed || n.close();
    }
  })(), n.__internal_getReadable();
}
function gh(t = {}) {
  const { resolve: e, promise: n } = yr();
  let r;
  return [mh((s) => (r = s, r.__internal_subscribeToClose(e), n), t), r];
}
function bh(t) {
  const e = ["ROOT"];
  let n = -1, r = null;
  const s = [];
  let i;
  function o() {
    i !== void 0 && (s.push(JSON.parse(`"${i}"`)), i = void 0);
  }
  function a(c, d, f) {
    switch (c) {
      case '"':
        n = d, e.pop(), e.push(f), e.push("INSIDE_STRING"), o();
        break;
      case "f":
      case "t":
      case "n":
        n = d, r = d, e.pop(), e.push(f), e.push("INSIDE_LITERAL");
        break;
      case "-":
        e.pop(), e.push(f), e.push("INSIDE_NUMBER"), o();
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
        n = d, e.pop(), e.push(f), e.push("INSIDE_NUMBER"), o();
        break;
      case "{":
        n = d, e.pop(), e.push(f), e.push("INSIDE_OBJECT_START"), o();
        break;
      case "[":
        n = d, e.pop(), e.push(f), e.push("INSIDE_ARRAY_START"), o();
    }
  }
  function l(c, d) {
    switch (c) {
      case ",":
        e.pop(), e.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      case "}":
        n = d, e.pop(), i = s.pop();
    }
  }
  function u(c, d) {
    switch (c) {
      case ",":
        e.pop(), e.push("INSIDE_ARRAY_AFTER_COMMA"), i = (Number(i) + 1).toString();
        break;
      case "]":
        n = d, e.pop(), i = s.pop();
    }
  }
  for (let c = 0; c < t.length; c++) {
    const d = t[c];
    switch (e[e.length - 1]) {
      case "ROOT":
        a(d, c, "FINISH");
        break;
      case "INSIDE_OBJECT_START":
        switch (d) {
          case '"':
            e.pop(), e.push("INSIDE_OBJECT_KEY"), i = "";
            break;
          case "}":
            n = c, e.pop(), i = s.pop();
        }
        break;
      case "INSIDE_OBJECT_AFTER_COMMA":
        d === '"' && (e.pop(), e.push("INSIDE_OBJECT_KEY"), i = "");
        break;
      case "INSIDE_OBJECT_KEY":
        switch (d) {
          case '"':
            e.pop(), e.push("INSIDE_OBJECT_AFTER_KEY");
            break;
          case "\\":
            e.push("INSIDE_STRING_ESCAPE"), i += d;
            break;
          default:
            i += d;
        }
        break;
      case "INSIDE_OBJECT_AFTER_KEY":
        d === ":" && (e.pop(), e.push("INSIDE_OBJECT_BEFORE_VALUE"));
        break;
      case "INSIDE_OBJECT_BEFORE_VALUE":
        a(d, c, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      case "INSIDE_OBJECT_AFTER_VALUE":
        l(d, c);
        break;
      case "INSIDE_STRING":
        switch (d) {
          case '"':
            e.pop(), n = c, i = s.pop();
            break;
          case "\\":
            e.push("INSIDE_STRING_ESCAPE");
            break;
          default:
            n = c;
        }
        break;
      case "INSIDE_ARRAY_START":
        d === "]" ? (n = c, e.pop(), i = s.pop()) : (n = c, i = "0", a(d, c, "INSIDE_ARRAY_AFTER_VALUE"));
        break;
      case "INSIDE_ARRAY_AFTER_VALUE":
        switch (d) {
          case ",":
            e.pop(), e.push("INSIDE_ARRAY_AFTER_COMMA"), i = (Number(i) + 1).toString();
            break;
          case "]":
            n = c, e.pop(), i = s.pop();
            break;
          default:
            n = c;
        }
        break;
      case "INSIDE_ARRAY_AFTER_COMMA":
        a(d, c, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      case "INSIDE_STRING_ESCAPE":
        e.pop(), e[e.length - 1] === "INSIDE_STRING" ? n = c : e[e.length - 1] === "INSIDE_OBJECT_KEY" && (i += d);
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
            n = c;
            break;
          case "e":
          case "E":
          case "-":
          case ".":
            break;
          case ",":
            e.pop(), i = s.pop(), e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && u(d, c), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && l(d, c);
            break;
          case "}":
            e.pop(), i = s.pop(), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && l(d, c);
            break;
          case "]":
            e.pop(), i = s.pop(), e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && u(d, c);
            break;
          default:
            e.pop(), i = s.pop();
        }
        break;
      case "INSIDE_LITERAL": {
        const f = t.substring(r, c + 1);
        !"false".startsWith(f) && !"true".startsWith(f) && !"null".startsWith(f) ? (e.pop(), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" ? l(d, c) : e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && u(d, c)) : n = c;
        break;
      }
    }
  }
  let h = t.slice(0, n + 1);
  for (let c = e.length - 1; c >= 0; c--) switch (e[c]) {
    case "INSIDE_STRING":
      h += '"';
      break;
    case "INSIDE_OBJECT_KEY":
    case "INSIDE_OBJECT_AFTER_KEY":
    case "INSIDE_OBJECT_AFTER_COMMA":
    case "INSIDE_OBJECT_START":
    case "INSIDE_OBJECT_BEFORE_VALUE":
    case "INSIDE_OBJECT_AFTER_VALUE":
      h += "}";
      break;
    case "INSIDE_ARRAY_START":
    case "INSIDE_ARRAY_AFTER_COMMA":
    case "INSIDE_ARRAY_AFTER_VALUE":
      h += "]";
      break;
    case "INSIDE_LITERAL": {
      const d = t.substring(r, t.length);
      "true".startsWith(d) ? h += "true".slice(d.length) : "false".startsWith(d) ? h += "false".slice(d.length) : "null".startsWith(d) && (h += "null".slice(d.length));
    }
  }
  return [h, s];
}
const jt = /* @__PURE__ */ Symbol("aui.parse-partial-json-object.meta"), yh = (t) => t?.[jt], Qn = (t) => {
  if (t.length === 0) return { [jt]: {
    state: "partial",
    partialPath: []
  } };
  try {
    const e = Nn.parse(t);
    if (typeof e != "object" || e === null) throw new Error("argsText is expected to be an object");
    return e[jt] = {
      state: "complete",
      partialPath: []
    }, e;
  } catch {
    try {
      const [e, n] = bh(t), r = Nn.parse(e);
      if (typeof r != "object" || r === null) throw new Error("argsText is expected to be an object");
      return r[jt] = {
        state: "partial",
        partialPath: n
      }, r;
    } catch {
      return;
    }
  }
}, Hi = (t, e, n) => {
  if (typeof t != "object" || t === null) return e.state;
  if (e.state === "complete") return "complete";
  if (n.length === 0) return e.state;
  const [r, ...s] = n;
  if (!Object.hasOwn(t, r)) return "partial";
  const [i, ...o] = e.partialPath;
  if (r !== i) return "complete";
  const a = t[r];
  return Hi(a, {
    state: "partial",
    partialPath: o
  }, s);
}, at = (t, e) => {
  const n = yh(t);
  if (!n) throw new Error("unable to determine object state");
  return Hi(t, n, e.map(String));
};
async function* _h() {
  const t = this.getReader();
  let e = !0;
  try {
    for (; ; ) {
      let n;
      try {
        n = await t.read();
      } catch (s) {
        throw e = !1, s;
      }
      if (n.done) {
        e = !1;
        break;
      }
      const { value: r } = n;
      yield r;
    }
  } finally {
    try {
      e && await t.cancel();
    } finally {
      t.releaseLock();
    }
  }
}
function Cn(t) {
  return t[Symbol.asyncIterator] ??= _h, t;
}
function xh(t, e, n) {
  try {
    const r = t();
    if (typeof r == "object" && r !== null && "then" in r) return r.then(e, n);
    e(r);
  } catch (r) {
    n(r);
  }
}
function lt(t, e) {
  let n = t;
  for (const r of e) {
    if (n == null) return;
    n = n[r];
  }
  return n;
}
var Sh = class {
  resolve;
  reject;
  disposed = !1;
  fieldPath;
  constructor(t, e, n) {
    this.resolve = t, this.reject = e, this.fieldPath = n;
  }
  update(t) {
    if (!this.disposed)
      try {
        if (at(t, this.fieldPath) === "complete") {
          const e = lt(t, this.fieldPath);
          e !== void 0 && (this.resolve(e), this.dispose());
        }
      } catch (e) {
        this.reject(e), this.dispose();
      }
  }
  end(t) {
    if (!this.disposed)
      try {
        const e = lt(t, this.fieldPath);
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
}, wh = class {
  controller;
  disposed = !1;
  fieldPath;
  constructor(t, e) {
    this.controller = t, this.fieldPath = e;
  }
  update(t) {
    if (!this.disposed)
      try {
        const e = lt(t, this.fieldPath);
        e !== void 0 && this.controller.enqueue(e), at(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
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
}, vh = class {
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
        const e = lt(t, this.fieldPath);
        if (e !== void 0 && typeof e == "string") {
          const n = e.substring(this.lastValue?.length || 0);
          this.lastValue = e, this.controller.enqueue(n);
        }
        at(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
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
}, kh = class {
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
        const e = lt(t, this.fieldPath);
        if (!Array.isArray(e)) return;
        for (let n = 0; n < e.length; n++) if (!this.processedIndexes.has(n)) {
          const r = [...this.fieldPath, n];
          at(t, r) === "complete" && (this.controller.enqueue(e[n]), this.processedIndexes.add(n));
        }
        at(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
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
  argTextDeltas;
  handles = /* @__PURE__ */ new Set();
  args = Qn("");
  finished = !1;
  constructor(t) {
    this.argTextDeltas = t, this.processStream();
  }
  async processStream() {
    try {
      let t = "";
      const e = this.argTextDeltas.getReader();
      for (; ; ) {
        const { value: n, done: r } = await e.read();
        if (r) break;
        t += n;
        const s = Qn(t);
        if (s !== void 0) {
          this.args = s;
          for (const i of this.handles) i.update(s);
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
    return new Promise((e, n) => {
      const r = new Sh(e, n, t);
      if (this.args && at(this.args, t) === "complete") {
        const s = lt(this.args, t);
        if (s !== void 0) {
          e(s);
          return;
        }
      }
      if (this.finished) {
        r.end(this.args);
        return;
      }
      this.handles.add(r), r.update(this.args);
    });
  }
  streamValues(...t) {
    const e = t;
    let n;
    const r = new ReadableStream({
      start: (s) => {
        n = new wh(s, e), this.finished || this.handles.add(n), n.update(this.args), this.finished && n.end();
      },
      cancel: () => {
        n && (n.dispose(), this.handles.delete(n));
      }
    });
    return Cn(r);
  }
  streamText(...t) {
    const e = t;
    let n;
    const r = new ReadableStream({
      start: (s) => {
        n = new vh(s, e), this.finished || this.handles.add(n), n.update(this.args), this.finished && n.end();
      },
      cancel: () => {
        n && (n.dispose(), this.handles.delete(n));
      }
    });
    return Cn(r);
  }
  forEach(...t) {
    const e = t;
    let n;
    const r = new ReadableStream({
      start: (s) => {
        n = new kh(s, e), this.finished || this.handles.add(n), n.update(this.args), this.finished && n.end();
      },
      cancel: () => {
        n && (n.dispose(), this.handles.delete(n));
      }
    });
    return Cn(r);
  }
}, Ch = class {
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
    this.writable = t.writable, this.args = new Th(t.readable);
    const { promise: e, resolve: n } = yr();
    this.resolve = n, this.response = new Ch(e);
  }
  async appendArgsTextDelta(t) {
    const e = this.writable.getWriter();
    try {
      await e.write(t);
    } catch (n) {
      console.warn(n);
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
const In = (t, e) => {
  try {
    t.enqueue(e);
  } catch (n) {
    if (!(n instanceof TypeError)) throw n;
  }
};
var Eh = class extends dh {
  constructor(t) {
    const e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
    super((s) => {
      const i = new TransformStream({
        async transform(o, a) {
          switch ((o.type !== "part-finish" || o.meta.type !== "tool-call") && a.enqueue(o), o.type) {
            case "part-start":
              if (o.part.type === "tool-call") {
                const l = new Ih();
                n.set(o.part.toolCallId, l), t.streamCall({
                  reader: l,
                  toolCallId: o.part.toolCallId,
                  toolName: o.part.toolName
                });
              }
              break;
            case "text-delta":
              if (o.meta.type === "tool-call") {
                const l = o.meta.toolCallId, u = n.get(l);
                if (!u) throw new Error("No controller found for tool call");
                await u.appendArgsTextDelta(o.textDelta);
              }
              break;
            case "result": {
              if (o.meta.type !== "tool-call") break;
              const { toolCallId: l } = o.meta, u = n.get(l);
              if (!u) throw new Error("No controller found for tool call");
              u.setResponse(new Ie({
                result: o.result,
                artifact: o.artifact,
                isError: o.isError,
                modelContent: o.modelContent
              })), r.add(l);
              break;
            }
            case "tool-call-args-text-finish": {
              if (o.meta.type !== "tool-call") break;
              const { toolCallId: l, toolName: u } = o.meta, h = n.get(l);
              if (!h) throw new Error("No controller found for tool call");
              if (await h.finishArgsText(), r.has(l)) break;
              let c = !1;
              const d = xh(() => {
                let f;
                try {
                  f = Nn.parse(h.argsText);
                } catch (x) {
                  throw new Error(`Function parameter parsing failed. ${JSON.stringify(x.message)}`);
                }
                const p = t.execute({
                  toolCallId: l,
                  toolName: u,
                  args: f
                });
                return p !== void 0 && (c = !0, t.onExecutionStart?.(l, u)), p;
              }, (f) => {
                if (c && t.onExecutionEnd?.(l, u), f === void 0) return;
                const p = new Ie({
                  artifact: f.artifact,
                  result: f.result,
                  isError: f.isError,
                  messages: f.messages,
                  modelContent: f.modelContent
                });
                h.setResponse(p), In(a, {
                  type: "result",
                  path: o.path,
                  ...p
                });
              }, (f) => {
                c && t.onExecutionEnd?.(l, u);
                const p = new Ie({
                  result: String(f),
                  isError: !0
                });
                h.setResponse(p), In(a, {
                  type: "result",
                  path: o.path,
                  ...p
                });
              });
              d && e.set(l, d);
              break;
            }
            case "part-finish": {
              if (o.meta.type !== "tool-call") break;
              const { toolCallId: l } = o.meta, u = e.get(l);
              u ? u.then(() => {
                e.delete(l), n.delete(l), r.delete(l), In(a, o);
              }) : (n.delete(l), r.delete(l), a.enqueue(o));
            }
          }
        },
        async flush() {
          await Promise.all(e.values());
        }
      });
      return s.pipeThrough(new qi()).pipeThrough(i);
    });
  }
};
const Ah = (t) => typeof t == "object" && t !== null && "~standard" in t && t["~standard"].version === 1;
function Rh(t, e, n, r) {
  const s = t?.[n.toolName];
  return s?.execute ? (async (o) => {
    if (e.aborted) return new Ie({
      result: "Tool execution was cancelled.",
      isError: !0
    });
    let a = o;
    if (Ah(s.parameters)) {
      let c = s.parameters["~standard"].validate(n.args);
      c instanceof Promise && (c = await c), c.issues && (a = s.experimental_onSchemaValidationError ?? (() => {
        throw new Error(`Function parameter validation failed. ${JSON.stringify(c.issues)}`);
      }));
    }
    let l;
    const u = new Promise((c) => {
      l = () => {
        queueMicrotask(() => {
          queueMicrotask(() => {
            c(new Ie({
              result: "Tool execution was cancelled.",
              isError: !0
            }));
          });
        });
      }, e.aborted ? l() : e.addEventListener("abort", l, { once: !0 });
    }), h = (async () => {
      const c = await a(n.args, {
        toolCallId: n.toolCallId,
        abortSignal: e,
        human: (f) => r(n.toolCallId, f)
      }), d = Ie.toResponse(c);
      if (s.toModelOutput && !d.isError && d.modelContent === void 0) try {
        const f = await s.toModelOutput({
          toolCallId: n.toolCallId,
          input: n.args,
          output: d.result
        });
        return new Ie({
          result: d.result,
          artifact: d.artifact,
          isError: d.isError,
          messages: d.messages,
          modelContent: f
        });
      } catch (f) {
        console.warn(`[assistant-stream] tool "${n.toolName}" toModelOutput threw; falling back to default projection.`, f);
      }
      return d;
    })();
    try {
      return await Promise.race([h, u]);
    } finally {
      e.removeEventListener("abort", l);
    }
  })(s.execute) : void 0;
}
function Mh(t, e, n, r, s) {
  t?.[r.toolName]?.streamCall?.(n, {
    toolCallId: r.toolCallId,
    abortSignal: e,
    human: (i) => s(r.toolCallId, i)
  });
}
function Ph(t, e, n, r) {
  const s = typeof t == "function" ? t : () => t, i = typeof e == "function" ? e : () => e;
  return new Eh({
    execute: (o) => Rh(s(), i(), o, n),
    streamCall: ({ reader: o, ...a }) => Mh(s(), i(), o, a, n),
    onExecutionStart: r?.onExecutionStart,
    onExecutionEnd: r?.onExecutionEnd
  });
}
const We = Ks("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7), Gi = (t) => {
  const e = v(7), { index: n, children: r } = t;
  let s;
  e[0] !== n ? (s = _e({
    source: "message",
    query: {
      type: "index",
      index: n
    },
    get: (l) => l.message().attachment({ index: n })
  }), e[0] = n, e[1] = s) : s = e[1];
  let i;
  e[2] !== s ? (i = { attachment: s }, e[2] = s, e[3] = i) : i = e[3];
  const o = H(i);
  let a;
  return e[4] !== o || e[5] !== r ? (a = /* @__PURE__ */ _(Ee, {
    value: o,
    children: r
  }), e[4] = o, e[5] = r, e[6] = a) : a = e[6], a;
}, Qi = (t) => {
  const e = v(10), { index: n, children: r } = t;
  let s;
  e[0] !== n ? (s = _e({
    source: "thread",
    query: {
      type: "index",
      index: n
    },
    get: (u) => u.thread().message({ index: n })
  }), e[0] = n, e[1] = s) : s = e[1];
  let i;
  e[2] !== n ? (i = _e({
    source: "message",
    query: {},
    get: (u) => u.thread().message({ index: n }).composer()
  }), e[2] = n, e[3] = i) : i = e[3];
  let o;
  e[4] !== s || e[5] !== i ? (o = {
    message: s,
    composer: i
  }, e[4] = s, e[5] = i, e[6] = o) : o = e[6];
  const a = H(o);
  let l;
  return e[7] !== a || e[8] !== r ? (l = /* @__PURE__ */ _(Ee, {
    value: a,
    children: r
  }), e[7] = a, e[8] = r, e[9] = l) : l = e[9], l;
}, _r = ({ index: t, children: e }) => {
  const n = Z(() => ({
    index: t,
    current: null
  }), [t]);
  return /* @__PURE__ */ _(Ee, {
    value: H({ part: _e({
      source: "message",
      query: {
        type: "index",
        index: t
      },
      get: (r) => {
        const s = r.message();
        if (t >= s.getState().parts.length && n.current) return n.current;
        const i = s.part({ index: t });
        return n.current = i, i;
      }
    }) }),
    children: e
  });
}, Dh = (t) => {
  const e = v(7), { text: n, isRunning: r } = t;
  let s;
  e[0] !== r ? (s = r ? { type: "running" } : { type: "complete" }, e[0] = r, e[1] = s) : s = e[1];
  let i;
  e[2] !== s || e[3] !== n ? (i = {
    type: "text",
    text: n,
    status: s
  }, e[2] = s, e[3] = n, e[4] = i) : i = e[4];
  const o = i;
  let a;
  return e[5] !== o ? (a = {
    getState: () => o,
    addToolResult: Oh,
    resumeToolCall: Fh,
    respondToToolApproval: $h
  }, e[5] = o, e[6] = a) : a = e[6], a;
}, Bh = Q(Dh), xr = (t) => {
  const e = v(8), { text: n, isRunning: r, children: s } = t, i = r === void 0 ? !1 : r;
  let o;
  e[0] !== i || e[1] !== n ? (o = Bh({
    text: n,
    isRunning: i
  }), e[0] = i, e[1] = n, e[2] = o) : o = e[2];
  let a;
  e[3] !== o ? (a = { part: o }, e[3] = o, e[4] = a) : a = e[4];
  const l = H(a);
  let u;
  return e[5] !== l || e[6] !== s ? (u = /* @__PURE__ */ _(Ee, {
    value: l,
    children: s
  }), e[5] = l, e[6] = s, e[7] = u) : u = e[7], u;
};
function Oh() {
  throw new Error("Not supported");
}
function Fh() {
  throw new Error("Not supported");
}
function $h() {
  throw new Error("Not supported");
}
const Nh = Object.freeze({ type: "complete" }), Lh = (t) => {
  const e = v(9), { parts: n, getMessagePart: r } = t, [s, i] = J(!0), o = n[n.length - 1]?.status ?? Nh;
  let a;
  e[0] !== s || e[1] !== n || e[2] !== o ? (a = {
    parts: n,
    collapsed: s,
    status: o
  }, e[0] = s, e[1] = n, e[2] = o, e[3] = a) : a = e[3];
  const l = a;
  let u;
  e[4] !== l ? (u = () => l, e[4] = l, e[5] = u) : u = e[5];
  let h;
  return e[6] !== r || e[7] !== u ? (h = {
    getState: u,
    setCollapsed: i,
    part: r
  }, e[6] = r, e[7] = u, e[8] = h) : h = e[8], h;
}, zh = Q(Lh), Vh = (t) => {
  const e = v(5), { startIndex: n, endIndex: r, children: s } = t, i = P(Uh).slice(n, r + 1), o = H(), a = zh({
    parts: i,
    getMessagePart: (c) => {
      const { index: d } = c;
      if (d < 0 || d >= i.length) throw new Error(`ChainOfThought part index ${d} is out of bounds (0..${i.length - 1})`);
      return o.message().part({ index: n + d });
    }
  });
  let l;
  e[0] !== a ? (l = { chainOfThought: a }, e[0] = a, e[1] = l) : l = e[1];
  const u = H(l);
  let h;
  return e[2] !== u || e[3] !== s ? (h = /* @__PURE__ */ _(Ee, {
    value: u,
    children: s
  }), e[2] = u, e[3] = s, e[4] = h) : h = e[4], h;
};
function Uh(t) {
  return t.message.parts;
}
const Wi = (t) => {
  const e = v(7), { index: n, children: r } = t;
  let s;
  e[0] !== n ? (s = _e({
    source: "suggestions",
    query: { index: n },
    get: (l) => l.suggestions().suggestion({ index: n })
  }), e[0] = n, e[1] = s) : s = e[1];
  let i;
  e[2] !== s ? (i = { suggestion: s }, e[2] = s, e[3] = i) : i = e[3];
  const o = H(i);
  let a;
  return e[4] !== o || e[5] !== r ? (a = /* @__PURE__ */ _(Ee, {
    value: o,
    children: r
  }), e[4] = o, e[5] = r, e[6] = a) : a = e[6], a;
}, Ye = /* @__PURE__ */ Symbol("innerMessage"), En = /* @__PURE__ */ Symbol("innerMessages"), qh = [], jh = (t, e) => {
  Ye in t || (t[Ye] = e);
}, Hh = (t) => {
  const e = "messages" in t ? t.messages : t, n = e[En] || e[Ye];
  return n ? Array.isArray(n) ? n : (e[En] = [n], e[En]) : qh;
}, mn = (t, e, n) => {
  const r = (s) => {
    console.error(`[assistant-ui] ${n} listener threw an error`, s);
  };
  for (const s of t) try {
    const i = s(e);
    i !== null && (typeof i == "object" || typeof i == "function") && "then" in i && typeof i.then == "function" && Promise.resolve(i).catch(r);
  } catch (i) {
    r(i);
  }
}, be = /* @__PURE__ */ Symbol("skip-update");
function Gh(t, e) {
  if (t === void 0 && e === void 0) return !0;
  if (t === void 0 || e === void 0) return !1;
  const n = Object.keys(t);
  if (n.length !== Object.keys(e).length) return !1;
  for (const r of n) {
    const s = t[r], i = e[r];
    if (!Object.is(s, i)) return !1;
  }
  return !0;
}
var Qh = class {
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
    } catch (n) {
      t.push(n);
    }
    if (t.length > 0) {
      if (t.length === 1) throw t[0];
      for (const e of t) console.error(e);
      throw new AggregateError(t);
    }
  }
}, gn = class {
  _subscriptions = /* @__PURE__ */ new Set();
  _connection;
  get isConnected() {
    return !!this._connection;
  }
  notifySubscribers(t, e) {
    if (e) {
      mn(this._subscriptions, t, e);
      return;
    }
    for (const n of this._subscriptions) n(t);
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
}, me = class extends gn {
  get path() {
    return this.binding.path;
  }
  binding;
  constructor(t) {
    super(), this.binding = t;
    const e = t.getState();
    if (e === be) throw new Error("Entry not available in the store");
    this._previousState = e;
  }
  _previousState;
  getState = () => (this.isConnected || this._syncState(), this._previousState);
  _syncState() {
    const t = this.binding.getState();
    return t === be || Gh(t, this._previousState) ? !1 : (this._previousState = t, !0);
  }
  _connect() {
    const t = () => {
      this._syncState() && this.notifySubscribers();
    };
    return this.binding.subscribe(t);
  }
}, Sr = class extends gn {
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
      t !== be && (this._previousState = t), this._previousStateDirty = !1;
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
}, en = class extends gn {
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
    let e = this.binding.getState(), n = e?.subscribe(t);
    const r = () => {
      const i = this.binding.getState();
      i !== e && (e = i, n?.(), n = i?.subscribe(t), t());
    }, s = this.outerSubscribe(r);
    return () => {
      s?.(), n?.();
    };
  }
}, Yi = class extends gn {
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
    const t = `Runtime event "${this.config.event}"`, e = (o) => {
      this.notifySubscribers(o, t);
    };
    let n = this.config.binding.getState(), r = n?.unstable_on(this.config.event, e);
    const s = () => {
      const o = this.config.binding.getState();
      o !== n && (n = o, r?.(), r = o?.unstable_on(this.config.event, e));
    }, i = this.outerSubscribe(s);
    return () => {
      i?.(), r?.();
    };
  }
}, Ki = class {
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
}, Ji = class extends Ki {
  _composerApi;
  constructor(t, e) {
    super(t), this._composerApi = e;
  }
  remove() {
    const t = this._composerApi.getState();
    if (!t) throw new Error("Composer is not available");
    return t.removeAttachment(this.getState().id);
  }
}, Wh = class extends Ji {
  get source() {
    return "thread-composer";
  }
}, Yh = class extends Ji {
  get source() {
    return "edit-composer";
  }
}, Kh = class extends Ki {
  get source() {
    return "message";
  }
  remove() {
    throw new Error("Message attachments cannot be removed");
  }
};
const tn = Object.freeze([]), Xi = Object.freeze({}), Jh = (t) => Object.freeze({
  type: "thread",
  isEditing: t?.isEditing ?? !1,
  canCancel: t?.canCancel ?? !1,
  canSend: t?.canSend ?? !1,
  isEmpty: t?.isEmpty ?? !0,
  attachments: t?.attachments ?? tn,
  text: t?.text ?? "",
  role: t?.role ?? "user",
  runConfig: t?.runConfig ?? Xi,
  attachmentAccept: t?.attachmentAccept ?? "",
  dictation: t?.dictation,
  quote: t?.quote,
  queue: t?.queue ?? tn,
  value: t?.text ?? ""
}), Xh = (t) => Object.freeze({
  type: "edit",
  isEditing: t?.isEditing ?? !1,
  canCancel: t?.canCancel ?? !1,
  canSend: t?.canSend ?? !1,
  isEmpty: t?.isEmpty ?? !0,
  text: t?.text ?? "",
  role: t?.role ?? "user",
  attachments: t?.attachments ?? tn,
  runConfig: t?.runConfig ?? Xi,
  attachmentAccept: t?.attachmentAccept ?? "",
  dictation: t?.dictation,
  quote: t?.quote,
  queue: t?.queue ?? tn,
  parentId: t?.parentId ?? null,
  sourceId: t?.sourceId ?? null,
  value: t?.text ?? ""
});
var Zi = class {
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
    let n = this._eventSubscriptionSubjects.get(t);
    return n || (n = new Yi({
      event: t,
      binding: this._core
    }), this._eventSubscriptionSubjects.set(t, n)), n.subscribe(e);
  }
}, Zh = class extends Zi {
  get path() {
    return this._core.path;
  }
  get type() {
    return "thread";
  }
  _getState;
  constructor(t) {
    const e = new Sr({
      path: t.path,
      getState: () => Jh(t.getState()),
      subscribe: (n) => t.subscribe(n)
    });
    super({
      path: t.path,
      getState: () => t.getState(),
      subscribe: (n) => e.subscribe(n)
    }), this._getState = e.getState.bind(e), this.__internal_bindMethods();
  }
  getState() {
    return this._getState();
  }
  getAttachmentByIndex(t) {
    return new Wh(new me({
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
        } : be;
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
}, ed = class extends Zi {
  get path() {
    return this._core.path;
  }
  get type() {
    return "edit";
  }
  _getState;
  _beginEdit;
  constructor(t, e) {
    const n = new Sr({
      path: t.path,
      getState: () => Xh(t.getState()),
      subscribe: (r) => t.subscribe(r)
    });
    super({
      path: t.path,
      getState: () => t.getState(),
      subscribe: (r) => n.subscribe(r)
    }), this._beginEdit = e, this._getState = n.getState.bind(n), this.__internal_bindMethods();
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
    return new Yh(new me({
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
        } : be;
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
};
const Ct = (t) => t.content.filter((e) => e.type === "text").map((e) => e.text).join(`

`), ls = {
  "allow-once": !0,
  "allow-always": !0,
  "reject-once": !1,
  "reject-always": !1
}, td = (t, e) => {
  let n, r;
  if ("optionId" in e) {
    const s = t.options?.find((i) => i.id === e.optionId);
    if (!s) throw new Error(`Tool approval has no option with id "${e.optionId}"`);
    if ("approved" in e) n = e.approved;
    else {
      if (!Object.hasOwn(ls, s.kind)) throw new Error(`Tool approval option "${s.id}" has a custom kind "${s.kind}"; respond with an explicit approved value instead`);
      n = ls[s.kind];
    }
    r = s.id;
  } else n = e.approved;
  return {
    approvalId: t.id,
    approved: n,
    ...r !== void 0 && { optionId: r },
    ...e.reason != null && { reason: e.reason }
  };
};
var us = class {
  get path() {
    return this.contentBinding.path;
  }
  contentBinding;
  messageApi;
  threadApi;
  constructor(t, e, n) {
    this.contentBinding = t, this.messageApi = e, this.threadApi = n, this.__internal_bindMethods();
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
    const n = this.messageApi.getState();
    if (!n) throw new Error("Message is not available");
    const r = e.toolName, s = e.toolCallId, i = Ie.toResponse(t);
    this.threadApi.getState().addToolResult({
      messageId: n.id,
      toolName: r,
      toolCallId: s,
      result: i.result,
      artifact: i.artifact,
      isError: i.isError
    });
  }
  resumeToolCall(t) {
    const e = this.contentBinding.getState();
    if (!e) throw new Error("Message part is not available");
    if (e.type !== "tool-call") throw new Error("Tried to resume tool call on non-tool message part");
    if (!this.threadApi) throw new Error("Thread API is not available");
    const n = e.toolCallId;
    this.threadApi.getState().resumeToolCall({
      toolCallId: n,
      payload: t
    });
  }
  respondToToolApproval(t) {
    const e = this.contentBinding.getState();
    if (!e) throw new Error("Message part is not available");
    if (e.type !== "tool-call") throw new Error("Tried to respond to tool approval on non-tool message part");
    if (!e.approval || e.approval.approved !== void 0 || e.approval.resolution !== void 0) throw new Error("Tool call has no pending approval");
    if (!this.threadApi) throw new Error("Thread API is not available");
    this.threadApi.getState().respondToToolApproval(td(e.approval, t));
  }
  subscribe(t) {
    return this.contentBinding.subscribe(t);
  }
};
const Ft = Object.freeze({ type: "complete" }), nd = (t, e, n) => {
  if (t.role !== "assistant") return Ft;
  if (n.type === "tool-call") return n.result ? Ft : t.status;
  const r = e === Math.max(0, t.content.length - 1);
  return t.status.type === "requires-action" ? Ft : r ? t.status : Ft;
}, cs = (t, e) => {
  const n = t.content[e];
  if (!n) return be;
  const r = nd(t, e, n);
  return Object.freeze({
    ...n,
    [Ye]: n[Ye],
    status: r
  });
};
var rd = class {
  get path() {
    return this._core.path;
  }
  _core;
  _threadBinding;
  constructor(t, e) {
    this._core = t, this._threadBinding = e, this.composer = new ed(new en({
      path: {
        ...this.path,
        ref: `${this.path.ref}.composer`,
        composerSource: "edit"
      },
      getState: this._getEditComposerRuntimeCore,
      subscribe: (n) => this._threadBinding.subscribe(n)
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
    const e = this._getEditComposerRuntimeCore(), n = e ?? this._threadBinding.getState().composer, r = e ?? n, { runConfig: s = r.runConfig } = t, i = this._core.getState();
    if (i.role !== "assistant") throw new Error("Can only reload assistant messages");
    this._threadBinding.getState().startRun({
      parentId: i.parentId,
      sourceId: i.id,
      runConfig: s
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
    const n = this._core.getState();
    if (e && t) throw new Error("May not specify both branchId and position");
    if (!e && !t) throw new Error("Must specify either branchId or position");
    const r = this._threadBinding.getState().getBranches(n.id);
    let s = e;
    if (t === "previous" ? s = r[n.branchNumber - 2] : t === "next" && (s = r[n.branchNumber]), !s) throw new Error("Branch not found");
    this._threadBinding.getState().switchToBranch(s);
  }
  unstable_getCopyText() {
    return Ct(this.getState());
  }
  subscribe(t) {
    return this._core.subscribe(t);
  }
  getMessagePartByIndex(t) {
    if (t < 0) throw new Error("Message part index must be >= 0");
    return new us(new me({
      path: {
        ...this.path,
        ref: `${this.path.ref}.content[${t}]`,
        messagePartSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => cs(this.getState(), t),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core, this._threadBinding);
  }
  getMessagePartByToolCallId(t) {
    return new us(new me({
      path: {
        ...this.path,
        ref: `${this.path.ref}.content[toolCallId=${JSON.stringify(t)}]`,
        messagePartSelector: {
          type: "toolCallId",
          toolCallId: t
        }
      },
      getState: () => {
        const e = this._core.getState(), n = e.content.findIndex((r) => r.type === "tool-call" && r.toolCallId === t);
        return n === -1 ? be : cs(e, n);
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core, this._threadBinding);
  }
  getAttachmentByIndex(t) {
    return new Kh(new me({
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
        } : be;
      },
      subscribe: (e) => this._core.subscribe(e)
    }));
  }
};
const sd = (t) => ({
  parentId: t.parentId ?? null,
  sourceId: t.sourceId ?? null,
  runConfig: t.runConfig ?? {},
  ...t.stream ? { stream: t.stream } : {}
}), id = (t) => ({
  parentId: t.parentId ?? null,
  sourceId: t.sourceId ?? null,
  runConfig: t.runConfig ?? {}
}), od = (t, e) => typeof e == "string" ? {
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
}, ad = (t, e) => {
  const n = t.messages.at(-1);
  return Object.freeze({
    threadId: e.id,
    metadata: e,
    capabilities: t.capabilities,
    isDisabled: t.isDisabled,
    isLoading: t.isLoading,
    isRunning: t.isRunning ?? (n?.role !== "assistant" ? !1 : n.status.type === "running"),
    messages: t.messages,
    state: t.state,
    suggestions: t.suggestions,
    extras: t.extras,
    speech: t.speech,
    voice: t.voice
  });
};
var eo = class {
  get path() {
    return this._threadBinding.path;
  }
  get __internal_threadBinding() {
    return this._threadBinding;
  }
  _threadBinding;
  constructor(t, e) {
    const n = new me({
      path: t.path,
      getState: () => ad(t.getState(), e.getState()),
      subscribe: (r) => {
        const s = t.subscribe(r), i = e.subscribe(r);
        return () => {
          s(), i();
        };
      }
    });
    this._threadBinding = {
      path: t.path,
      getState: () => t.getState(),
      getStateState: () => n.getState(),
      outerSubscribe: (r) => t.outerSubscribe(r),
      subscribe: (r) => t.subscribe(r)
    }, this.composer = new Zh(new en({
      path: {
        ...this.path,
        ref: `${this.path.ref}.composer`,
        composerSource: "thread"
      },
      getState: () => this._threadBinding.getState().composer,
      subscribe: (r) => this._threadBinding.subscribe(r)
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
    this._threadBinding.getState().append(od(this._threadBinding.getState().messages, t));
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
    return this._threadBinding.getState().startRun(id(t));
  }
  resumeRun(t) {
    return this._threadBinding.getState().resumeRun(sd(t));
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
      const e = this._threadBinding.getState().messages, n = e[t];
      if (n)
        return {
          message: n,
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
    return new rd(new me({
      path: t,
      getState: () => {
        const { message: n, parentId: r, index: s } = e() ?? {}, { messages: i, speech: o } = this._threadBinding.getState();
        if (!n || r === void 0 || s === void 0) return be;
        const a = this._threadBinding.getState().getBranches(n.id);
        return {
          ...n,
          [Ye]: n[Ye],
          index: s,
          isLast: i.at(-1)?.id === n.id,
          parentId: r,
          branchNumber: a.indexOf(n.id) + 1,
          branchCount: a.length,
          speech: o?.messageId === n.id ? o : void 0
        };
      },
      subscribe: (n) => this._threadBinding.subscribe(n)
    }), this._threadBinding);
  }
  _eventSubscriptionSubjects = /* @__PURE__ */ new Map();
  unstable_on(t, e) {
    let n = this._eventSubscriptionSubjects.get(t);
    return n || (n = new Yi({
      event: t,
      binding: this._threadBinding
    }), this._eventSubscriptionSubjects.set(t, n)), n.subscribe(e);
  }
};
const ld = Fe(null), ud = () => Rt(ld);
var $t = class {
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
    let n = this._core.getState().isMain, r = this._core.getState().id;
    return this.subscribe(() => {
      const s = this._core.getState(), i = s.isMain, o = s.id;
      n === i && r === o || (n = i, r = o, !(t === "switchedTo" && !i) && (t === "switchedAway" && i || mn([e], {}, `Thread list item "${t}"`)));
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
const hs = Promise.resolve(), cd = (t) => ({
  mainThreadId: t.mainThreadId,
  newThreadId: t.newThreadId,
  threadIds: t.threadIds,
  archivedThreadIds: t.archivedThreadIds,
  isLoading: t.isLoading,
  isLoadingMore: t.isLoadingMore ?? !1,
  hasMore: t.hasMore ?? !1,
  threadItems: t.threadItems
}), Nt = (t, e) => {
  if (e === void 0) return be;
  const n = t.getItemById(e);
  return n ? {
    id: n.id,
    remoteId: n.remoteId,
    externalId: n.externalId,
    title: n.title,
    status: n.status,
    lastMessageAt: n.lastMessageAt,
    custom: n.custom,
    isMain: n.id === t.mainThreadId
  } : be;
};
var hd = class {
  _getState;
  _core;
  _runtimeFactory;
  constructor(t, e = eo) {
    this._core = t, this._runtimeFactory = e;
    const n = new Sr({
      path: {},
      getState: () => cd(t),
      subscribe: (r) => t.subscribe(r)
    });
    this._getState = n.getState.bind(n), this._mainThreadListItemRuntime = new $t(new me({
      path: {
        ref: "threadItems[main]",
        threadSelector: { type: "main" }
      },
      getState: () => Nt(this._core, this._core.mainThreadId),
      subscribe: (r) => this._core.subscribe(r)
    }), this._core), this.main = new e(new en({
      path: {
        ref: "threads.main",
        threadSelector: { type: "main" }
      },
      getState: () => t.getMainThreadRuntimeCore(),
      subscribe: (r) => t.subscribe(r)
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
    return this._core.reload?.() ?? hs;
  }
  loadMore() {
    return this._core.loadMore?.() ?? hs;
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
    return new this._runtimeFactory(new en({
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
    return new $t(new me({
      path: {
        ref: `threadItems[${t}]`,
        threadSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => Nt(this._core, this._core.threadIds[t]),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
  getArchivedItemByIndex(t) {
    return new $t(new me({
      path: {
        ref: `archivedThreadItems[${t}]`,
        threadSelector: {
          type: "archiveIndex",
          index: t
        }
      },
      getState: () => Nt(this._core, this._core.archivedThreadIds[t]),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
  getItemById(t) {
    return new $t(new me({
      path: {
        ref: `threadItems[threadId=${t}]`,
        threadSelector: {
          type: "threadId",
          threadId: t
        }
      },
      getState: () => Nt(this._core, t),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
}, to = class {
  threads;
  _thread;
  _core;
  constructor(t) {
    this._core = t, this.threads = new hd(t.threads), this._thread = this.threads.main, this.__internal_bindMethods();
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
}, no = class {
  _contextProvider = new fr();
  registerModelContextProvider(t) {
    return this._contextProvider.registerModelContextProvider(t);
  }
  getModelContextProvider() {
    return this._contextProvider;
  }
};
const ze = Object.freeze([]), it = "DEFAULT_THREAD_ID", dd = Object.freeze([it]), fd = Object.freeze({
  id: it,
  remoteId: void 0,
  externalId: void 0,
  status: "regular"
}), pd = Promise.resolve(), ds = Object.freeze({ [it]: fd });
var md = class {
  _mainThreadId = it;
  _threads = dd;
  _archivedThreads = ze;
  _threadData = ds;
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
    return pd;
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
    const n = this.adapter;
    this.adapter = t;
    const r = t.threadId ?? it, s = t.threads ?? ze, i = t.archivedThreads ?? ze, o = n.threadId ?? it, a = n.threads ?? ze, l = n.archivedThreads ?? ze;
    !e && o === r && a === s && l === i || ((a !== s || l !== i || o !== r) && (this._threadData = {
      ...ds,
      ...Object.fromEntries(t.threads?.map((u) => [u.id, {
        ...u,
        remoteId: u.remoteId,
        externalId: u.externalId,
        status: "regular"
      }]) ?? []),
      ...Object.fromEntries(t.archivedThreads?.map((u) => [u.id, {
        ...u,
        remoteId: u.remoteId,
        externalId: u.externalId,
        status: "archived"
      }]) ?? [])
    }), a !== s && (this._threads = this.adapter.threads?.map((u) => u.id) ?? ze), l !== i && (this._archivedThreads = this.adapter.archivedThreads?.map((u) => u.id) ?? ze), (e || o !== r) && (this._mainThreadId = r, this._mainThread = this.threadFactory()), this._threadData[this._mainThreadId] || (this._threadData = {
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
    const n = this.adapter.onSwitchToThread;
    if (!n) throw new Error("External store adapter does not support switching to thread");
    await n(t);
  }
  async switchToNewThread() {
    const t = this.adapter.onSwitchToNewThread;
    if (!t) throw new Error("External store adapter does not support switching to new thread");
    await t();
  }
  async rename(t, e) {
    const n = this.adapter.onRename;
    if (!n) throw new Error("External store adapter does not support renaming");
    await n(t, e);
  }
  async updateCustom(t, e) {
    const n = this.adapter.onUpdateCustom;
    if (!n) throw new Error("External store adapter does not support updating custom metadata");
    await n(t, e);
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
const An = (t, e) => {
  if (t.startsWith("data-"))
    return {
      type: "data",
      name: t.substring(5),
      data: e
    };
}, nn = (t, e, n) => {
  const { role: r, id: s, createdAt: i, attachments: o, status: a, metadata: l } = t, u = {
    id: s ?? e,
    createdAt: i ?? /* @__PURE__ */ new Date()
  }, h = typeof t.content == "string" ? [{
    type: "text",
    text: t.content
  }] : t.content, c = ({ image: d, ...f }) => typeof d != "string" ? null : d.match(/^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,(.*)$/) ? {
    ...f,
    image: d
  } : /^(https:\/\/|blob:)/.test(d) ? {
    ...f,
    image: d
  } : (console.warn("Invalid image data format detected"), null);
  if (r !== "user" && o?.length) throw new Error("attachments are only supported for user messages");
  if (r !== "assistant" && a) throw new Error("status is only supported for assistant messages");
  if (r !== "assistant" && l?.steps) throw new Error("metadata.steps is only supported for assistant messages");
  switch (r) {
    case "assistant":
      return {
        ...u,
        role: r,
        content: h.map((d) => {
          const f = d.type;
          switch (f) {
            case "text":
            case "reasoning":
              return d.text?.trim() ? d : null;
            case "file":
            case "source":
              return d;
            case "image":
              return c(d);
            case "data":
              return d;
            case "generative-ui":
              return d;
            case "tool-call": {
              const { parentId: p, messages: x, ...S } = d, y = {
                ...S,
                toolCallId: d.toolCallId ?? `tool-${We()}`,
                ...p !== void 0 && { parentId: p },
                ...x !== void 0 && { messages: x }
              };
              return d.args ? {
                ...y,
                args: d.args,
                argsText: d.argsText ?? JSON.stringify(d.args)
              } : {
                ...y,
                args: Qn(d.argsText ?? "") ?? {},
                argsText: d.argsText ?? ""
              };
            }
            default: {
              const p = An(f, d.data);
              if (p) return p;
              throw new Error(`Unsupported assistant message part type: ${f}`);
            }
          }
        }).filter((d) => !!d),
        status: a ?? n,
        metadata: {
          unstable_state: l?.unstable_state ?? null,
          unstable_annotations: l?.unstable_annotations ?? [],
          unstable_data: l?.unstable_data ?? [],
          custom: l?.custom ?? {},
          steps: l?.steps ?? [],
          ...l?.timing && { timing: l.timing },
          ...l?.submittedFeedback && { submittedFeedback: l.submittedFeedback },
          ...l?.isOptimistic && { isOptimistic: !0 }
        }
      };
    case "user":
      return {
        ...u,
        role: r,
        content: h.map((d) => {
          const f = d.type;
          switch (f) {
            case "text":
            case "image":
            case "audio":
            case "file":
            case "data":
              return d;
            default: {
              const p = An(f, d.data);
              if (p) return p;
              throw new Error(`Unsupported user message part type: ${f}`);
            }
          }
        }),
        attachments: (o ?? []).map((d) => ({
          ...d,
          content: d.content.map((f) => An(f.type, f.data) ?? f)
        })),
        metadata: {
          custom: l?.custom ?? {},
          ...l?.isOptimistic && { isOptimistic: !0 }
        }
      };
    case "system":
      if (h.length !== 1 || h[0].type !== "text") throw new Error("System messages must have exactly one text message part.");
      return {
        ...u,
        role: r,
        content: h,
        metadata: { custom: l?.custom ?? {} }
      };
    default:
      throw new Error(`Unknown message role: ${r}`);
  }
}, ft = /* @__PURE__ */ Symbol("autoStatus"), gd = Object.freeze(Object.assign({ type: "running" }, { [ft]: !0 })), bd = Object.freeze(Object.assign({
  type: "complete",
  reason: "unknown"
}, { [ft]: !0 })), yd = Object.freeze(Object.assign({
  type: "requires-action",
  reason: "tool-calls"
}, { [ft]: !0 })), _d = Object.freeze(Object.assign({
  type: "requires-action",
  reason: "interrupt"
}, { [ft]: !0 })), xd = (t) => t[ft] === !0, rn = (t, e, n, r, s) => t && s ? Object.assign({
  type: "incomplete",
  reason: "error",
  error: s
}, { [ft]: !0 }) : t && e ? gd : n ? _d : r ? yd : bd, ro = {
  fromArray: (t) => {
    const e = t.map((n) => nn(n, We(), rn(!1, !1, !1, !1, void 0)));
    return { messages: e.map((n, r) => ({
      parentId: r > 0 ? e[r - 1].id : null,
      message: n
    })) };
  },
  fromBranchableArray: (t, e) => {
    const n = rn(!1, !1, !1, !1, void 0);
    return {
      ...e?.headId !== void 0 ? { headId: e.headId } : void 0,
      messages: t.map(({ message: r, parentId: s }) => {
        if (!r.id) throw new Error("ExportedMessageRepository.fromBranchableArray: Each message must have an 'id' field set.");
        return {
          parentId: s,
          message: nn(r, r.id, n)
        };
      })
    };
  }
}, Ht = (t) => t.next ? Ht(t.next) : "current" in t ? t : null;
var Sd = class {
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
}, wr = class {
  messages = /* @__PURE__ */ new Map();
  head = null;
  root = {
    children: [],
    next: null
  };
  updateLevels(t, e) {
    t.level = e;
    for (const n of t.children) {
      const r = this.messages.get(n);
      r && this.updateLevels(r, e + 1);
    }
  }
  performOp(t, e, n) {
    const r = e.prev ?? this.root, s = t ?? this.root;
    if (!(n === "relink" && r === s)) {
      if (n !== "cut") {
        for (let i = t; i; i = i.prev) if (i.current.id === e.current.id) throw new Error("MessageRepository(performOp/link): A message with the same id already exists in the parent tree. This error occurs if the same message id is found multiple times. This is likely an internal bug in assistant-ui.");
      }
      if (n !== "link" && (r.children = r.children.filter((i) => i !== e.current.id), r.next === e)) {
        const i = r.children.at(-1), o = i ? this.messages.get(i) : null;
        if (o === void 0) throw new Error("MessageRepository(performOp/cut): Fallback sibling message not found. This is likely an internal bug in assistant-ui.");
        r.next = o;
      }
      if (n !== "cut") {
        s.children = [...s.children, e.current.id], (Ht(e) === this.head || s.next === null) && (s.next = e), e.prev = t;
        const i = t ? t.level + 1 : 0;
        this.updateLevels(e, i);
      }
    }
  }
  _messages = new Sd(() => {
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
    const n = new Array(e.level + 1);
    for (let r = e; r; r = r.prev) n[r.level] = r.current;
    return n;
  }
  addOrUpdateMessage(t, e) {
    const n = this.messages.get(e.id), r = t ? this.messages.get(t) : null;
    if (r === void 0) throw new Error("MessageRepository(addOrUpdateMessage): Parent message not found. This is likely an internal bug in assistant-ui.");
    if (n) {
      n.current = e, this.performOp(r, n, "relink"), this._messages.dirty();
      return;
    }
    const s = {
      prev: r,
      current: e,
      next: null,
      children: [],
      level: r ? r.level + 1 : 0
    };
    this.messages.set(e.id, s), this.performOp(r, s, "link"), this.head === r && (this.head = s), this._messages.dirty();
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
    const n = this.messages.get(t);
    if (!n) throw new Error("MessageRepository(deleteMessage): Message not found. This is likely an internal bug in assistant-ui.");
    const r = e === void 0 ? n.prev : e === null ? null : this.messages.get(e);
    if (r === void 0) throw new Error("MessageRepository(deleteMessage): Replacement not found. This is likely an internal bug in assistant-ui.");
    for (const s of n.children) {
      const i = this.messages.get(s);
      if (!i) throw new Error("MessageRepository(deleteMessage): Child message not found. This is likely an internal bug in assistant-ui.");
      this.performOp(r, i, "relink");
    }
    this.performOp(null, n, "cut"), this.messages.delete(t), this.head === n && (this.head = Ht(r ?? this.root)), this._messages.dirty();
  }
  getBranches(t) {
    const e = this.messages.get(t);
    if (!e) throw new Error("MessageRepository(getBranches): Message not found. This is likely an internal bug in assistant-ui.");
    const { children: n } = e.prev ?? this.root;
    return n;
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
    const n = /* @__PURE__ */ new Set();
    for (let s = e; s; s = s.prev) n.add(s.current.id);
    const r = [];
    for (let s = t; s && !n.has(s.current.id); s = s.prev)
      s.current.metadata?.isOptimistic && r.push(s.current.id);
    for (const s of r) this.messages.has(s) && this.deleteMessage(s);
  }
  switchToBranch(t) {
    const e = this.messages.get(t);
    if (!e) throw new Error("MessageRepository(switchToBranch): Branch not found. This is likely an internal bug in assistant-ui.");
    const n = this.head, r = e.prev ?? this.root;
    r.next = e, this.head = Ht(e), this.evictOffBranchOptimisticMessages(n, this.head), this._messages.dirty();
  }
  resetHead(t) {
    if (t === null) {
      this.clear();
      return;
    }
    const e = this.messages.get(t);
    if (!e) throw new Error("MessageRepository(resetHead): Branch not found. This is likely an internal bug in assistant-ui.");
    const n = this.head;
    if (e.children.length > 0) {
      const r = (s) => {
        for (const i of s.children) {
          const o = this.messages.get(i);
          o && (r(o), this.messages.delete(i));
        }
      };
      r(e), e.children = [], e.next = null;
    }
    this.head = e;
    for (let r = e; r; r = r.prev) r.prev ? r.prev.next = r : this.root.next = r;
    this.evictOffBranchOptimisticMessages(n, this.head), this._messages.dirty();
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
      let n = e.prev;
      for (; n && n.current.metadata?.isOptimistic; ) n = n.prev;
      t.push({
        message: e.current,
        parentId: n?.current.id ?? null
      });
    }
    return {
      headId: this.canonicalHeadId,
      messages: t
    };
  }
  import({ headId: t, messages: e }) {
    for (const { message: n, parentId: r } of e) this.addOrUpdateMessage(r, n);
    this.resetHead(t ?? e.at(-1)?.message.id ?? null);
  }
};
const vr = Object.freeze([]);
function fs(t, e) {
  if (e === "*") return !0;
  const n = e.split(",").map((i) => i.trim().toLowerCase()), r = `.${t.name.split(".").pop().toLowerCase()}`, s = t.type.split(";", 1)[0].trim().toLowerCase();
  for (const i of n) {
    if (i.startsWith(".") && i === r || i.includes("/") && i === s) return !0;
    if (i.endsWith("/*")) {
      const o = i.split("/")[0];
      if (s.startsWith(`${o}/`)) return !0;
    }
  }
  return !1;
}
function wd(t, e) {
  return t.length !== e.length ? !1 : t.every((n, r) => n.id === e[r].id);
}
function vd(t) {
  const e = We();
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
function kd(t) {
  const e = [];
  for (const n of t) n.type !== "text" && e.push(vd(n));
  return e;
}
const Td = (t) => "content" in t && !("lastModified" in t), Rn = (t) => t.status.type === "complete";
var so = class extends Qh {
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
        const { status: e, inputDisabled: n } = this._dictation;
        this._dictation = n ? {
          status: e,
          inputDisabled: n
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
      const e = this._attachments.filter((n) => !Rn(n));
      await Promise.all(e.map((n) => t.remove(n)));
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
    const e = this.getAttachmentAdapter(), n = this.attachments.map(async (d) => {
      if (Rn(d)) return d;
      if (!e) throw new Error("Attachments are not supported");
      return await e.send(d);
    }), r = this.attachments, s = this.text, i = this._quote;
    this._quote = void 0, this._text = "", this._isSending = !0;
    const o = ++this._sendGeneration;
    this._notifySubscribers();
    let a;
    try {
      a = await Promise.all(n);
    } catch (d) {
      throw o === this._sendGeneration && (!this.text.trim() && this._quote === void 0 && (this._text = s, this._quote = i, this._notifySubscribers()), Promise.allSettled(n).then(() => {
        o === this._sendGeneration && (this._removedDuringSend.clear(), this._isSending = !1, this._notifySubscribers());
      })), d;
    }
    if (o !== this._sendGeneration) return;
    const l = new Set(r.map((d) => d.id));
    this._attachments = this._attachments.filter((d) => !l.has(d.id)), this._isSending = !1, this._notifySubscribers();
    const u = a.filter((d) => !this._removedDuringSend.has(d.id));
    this._removedDuringSend.clear();
    const h = {
      createdAt: /* @__PURE__ */ new Date(),
      role: this.role,
      content: s ? [{
        type: "text",
        text: s
      }] : [],
      attachments: u,
      runConfig: this.runConfig,
      metadata: { custom: { ...i ? { quote: i } : {} } }
    }, c = this.handleSend(h, t);
    c && c.catch(() => {
    }), this._notifyEventSubscribers("send", {});
  }
  cancel() {
    this.handleCancel();
  }
  get queue() {
    return vr;
  }
  steerQueueItem(t) {
  }
  removeQueueItem(t) {
  }
  async addAttachment(t) {
    if (Td(t)) {
      const s = this.getAttachmentAdapter();
      if (s && !fs({
        name: t.name,
        type: t.contentType ?? ""
      }, s.accept)) {
        const o = `File type ${t.contentType || "unknown"} is not accepted. Accepted types: ${s.accept}`, a = new Error(o);
        throw this._safeEmitAttachmentAddError("not-accepted", o, void 0, a), a;
      }
      const i = {
        id: t.id ?? We(),
        type: t.type ?? "document",
        name: t.name,
        contentType: t.contentType,
        content: t.content,
        status: { type: "complete" }
      };
      this._attachments = [...this._attachments, i], this._notifySubscribers(), this._notifyEventSubscribers("attachmentAdd", {});
      return;
    }
    const e = (s) => {
      const i = this._attachments.findIndex((o) => o.id === s.id);
      i !== -1 ? this._attachments = [
        ...this._attachments.slice(0, i),
        s,
        ...this._attachments.slice(i + 1)
      ] : this._attachments = [...this._attachments, s], this._notifySubscribers();
    }, n = this.getAttachmentAdapter();
    if (!n) {
      const s = "Attachments are not supported", i = /* @__PURE__ */ new Error(s);
      throw this._safeEmitAttachmentAddError("no-adapter", s, void 0, i), i;
    }
    if (!fs({
      name: t.name,
      type: t.type
    }, n.accept)) {
      const s = `File type ${t.type || "unknown"} is not accepted. Accepted types: ${n.accept}`, i = new Error(s);
      throw this._safeEmitAttachmentAddError("not-accepted", s, void 0, i), i;
    }
    let r;
    try {
      const s = n.add({ file: t });
      if (Symbol.asyncIterator in s) for await (const i of s)
        r = i, e(i);
      else
        r = await s, e(r);
    } catch (s) {
      throw r && e({
        ...r,
        status: {
          type: "incomplete",
          reason: "error",
          message: s instanceof Error ? s.message : String(s)
        }
      }), this._safeEmitAttachmentAddError("adapter-error", s instanceof Error ? s.message : String(s), r?.id, s instanceof Error ? s : void 0), s;
    }
    r?.status.type === "incomplete" && r.status.reason === "error" ? this._safeEmitAttachmentAddError("adapter-error", r.status.message ?? "Attachment upload did not complete successfully.", r.id) : this._notifyEventSubscribers("attachmentAdd", {});
  }
  _safeEmitAttachmentAddError(t, e, n, r) {
    try {
      this._notifyEventSubscribers("attachmentAddError", {
        reason: t,
        message: e,
        ...n !== void 0 && { attachmentId: n },
        ...r !== void 0 && { error: r }
      });
    } catch (s) {
      console.error("[assistant-ui] attachmentAddError subscriber threw:", s);
    }
  }
  async removeAttachment(t) {
    const e = this._attachments.findIndex((r) => r.id === t);
    if (e === -1) throw new Error("Attachment not found");
    const n = this._attachments[e];
    if (this._isSending && this._removedDuringSend.add(t), !Rn(n)) {
      const r = this.getAttachmentAdapter();
      if (!r) throw new Error("Attachments are not supported");
      await r.remove(n);
    }
    this._attachments = this._attachments.filter((r) => r.id !== t), this._notifySubscribers();
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
      for (const l of this._dictationUnsubscribes) l();
      this._dictationUnsubscribes = [], this._dictationSession.stop().catch(() => {
      }), this._dictationSession = void 0;
    }
    const e = t.disableInputDuringDictation ?? !1;
    this._dictationBaseText = this._text, this._currentInterimText = "";
    const n = t.listen();
    this._dictationSession = n;
    const r = ++this._dictationSessionIdCounter;
    this._activeDictationSessionId = r, this._dictation = {
      status: n.status,
      inputDisabled: e
    }, this._notifySubscribers();
    const s = n.onSpeech((l) => {
      if (!this._isActiveSession(r, n)) return;
      const u = l.isFinal !== !1, h = this._dictationBaseText && !this._dictationBaseText.endsWith(" ") && l.transcript ? " " : "";
      if (u) {
        if (this._dictationBaseText = this._dictationBaseText + h + l.transcript, this._currentInterimText = "", this._text = this._dictationBaseText, this._dictation) {
          const { transcript: c, ...d } = this._dictation;
          this._dictation = d;
        }
        this._notifySubscribers();
      } else
        this._currentInterimText = h + l.transcript, this._text = this._dictationBaseText + this._currentInterimText, this._dictation && (this._dictation = {
          ...this._dictation,
          transcript: l.transcript
        }), this._notifySubscribers();
    });
    this._dictationUnsubscribes.push(s);
    const i = n.onSpeechStart(() => {
      this._isActiveSession(r, n) && (this._dictation = {
        status: { type: "running" },
        inputDisabled: e,
        ...this._dictation?.transcript && { transcript: this._dictation.transcript }
      }, this._notifySubscribers());
    });
    this._dictationUnsubscribes.push(i);
    const o = n.onSpeechEnd(() => {
      this._cleanupDictation({ sessionId: r });
    });
    this._dictationUnsubscribes.push(o);
    const a = setInterval(() => {
      this._isActiveSession(r, n) && n.status.type === "ended" && this._cleanupDictation({ sessionId: r });
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
    const n = this._eventSubscribers.get(t);
    n && mn(n, e, `Composer runtime "${t}"`);
  }
  unstable_on(t, e) {
    const n = e;
    let r = this._eventSubscribers.get(t);
    return r || (r = /* @__PURE__ */ new Set(), this._eventSubscribers.set(t, r)), r.add(n), () => {
      this._eventSubscribers.get(t)?.delete(n);
    };
  }
}, io = class extends so {
  _canCancel = !1;
  get canCancel() {
    return this._canCancel;
  }
  get canSend() {
    return !this.isEmpty && !this.runtime.isSendDisabled && !this._isSending;
  }
  get queue() {
    return this.runtime.getQueueItems?.() ?? vr;
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
      let n = !1;
      this.canCancel !== this.runtime.capabilities.cancel && (this._canCancel = this.runtime.capabilities.cancel, n = !0), t !== this.runtime.isSendDisabled && (t = this.runtime.isSendDisabled, n = !0), e !== this.queue && (e = this.queue, n = !0), n && this._notifySubscribers();
    });
  }
  async handleSend(t, e) {
    const n = zi(this.runtime.getModelContext().unstable_composerMetadata, this.runtime.messages), r = this.enrichWithComposerMetadata(t, n);
    return this.runtime.append({
      ...r,
      parentId: this.runtime.messages.at(-1)?.id ?? null,
      sourceId: null,
      startRun: e?.startRun,
      steer: e?.steer
    });
  }
  async handleCancel() {
    this.runtime.cancelRun();
  }
}, Cd = class extends so {
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
  constructor(t, e, { parentId: n, message: r }) {
    super(), this.runtime = t, this.endEditCallback = e, this._parentId = n, this._sourceId = r.id, this._previousText = Ct(r), this.setText(this._previousText), this.setRole(r.role), r.role === "user" ? (this._previousAttachments = [...r.attachments ?? [], ...kd(r.content)], this._nonTextPassthrough = []) : (this._previousAttachments = r.attachments ?? [], this._nonTextPassthrough = r.content.filter((s) => s.type !== "text")), this.setAttachments(this._previousAttachments), this.setRunConfig({ ...t.composer.runConfig });
  }
  get parentId() {
    return this._parentId;
  }
  get sourceId() {
    return this._sourceId;
  }
  async handleSend(t, e) {
    let n;
    const r = Ct(t), s = !wd(t.attachments ?? [], this._previousAttachments);
    if (r !== this._previousText || s || e?.startRun) {
      const i = this._nonTextPassthrough.length > 0 ? [...t.content, ...this._nonTextPassthrough] : t.content, o = this.runtime.messages, a = this._parentId === null ? -1 : o.findIndex((h) => h.id === this._parentId), l = zi(this.runtime.getModelContext().unstable_composerMetadata, o.slice(0, a + 1)), u = this.enrichWithComposerMetadata(t, l);
      n = this.runtime.append({
        ...u,
        content: i,
        parentId: this._parentId,
        sourceId: this._sourceId,
        startRun: e?.startRun
      });
    }
    return this.handleCancel(), n;
  }
  handleCancel() {
    this.endEditCallback(), this._notifySubscribers();
  }
}, Id = class {
  _subscriptions = /* @__PURE__ */ new Set();
  _isInitialized = !1;
  repository = new wr();
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
  composer = new io(this);
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
    this._editComposers.set(t, new Cd(this, () => this._editComposers.delete(t), this.repository.getMessage(t))), this._notifySubscribers();
  }
  getMessageById(t) {
    try {
      return this.repository.getMessage(t);
    } catch {
      const e = this.repository.getMessages(), n = this._voiceMessages.findIndex((r) => r.id === t);
      return n !== -1 ? {
        parentId: n > 0 ? this._voiceMessages[n - 1].id : e.at(-1)?.id ?? null,
        message: this._voiceMessages[n],
        index: e.length + n
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
    const n = this._eventSubscribers.get(t);
    n && mn(n, e, `Thread runtime "${t}"`);
  }
  subscribe(t) {
    return this._subscriptions.add(t), () => this._subscriptions.delete(t);
  }
  submitFeedback({ messageId: t, type: e }) {
    const n = this.adapters?.feedback;
    if (!n) throw new Error("Feedback adapter not configured");
    const { message: r, parentId: s } = this.repository.getMessage(t);
    if (n.submit({
      message: r,
      type: e
    }), r.role === "assistant") {
      const i = {
        ...r,
        metadata: {
          ...r.metadata,
          submittedFeedback: { type: e }
        }
      };
      this.repository.addOrUpdateMessage(s, i);
    }
    this._notifySubscribers();
  }
  _stopSpeaking;
  speech;
  speak(t) {
    const e = this.adapters?.speech;
    if (!e) throw new Error("Speech adapter not configured");
    const { message: n } = this.repository.getMessage(t);
    this._stopSpeaking?.();
    const r = e.speak(Ct(n)), s = r.subscribe(() => {
      r.status.type === "ended" ? (this._stopSpeaking = void 0, this.speech = void 0) : this.speech = {
        messageId: t,
        status: r.status
      }, this._notifySubscribers();
    });
    this.speech = {
      messageId: t,
      status: r.status
    }, this._notifySubscribers(), this._stopSpeaking = () => {
      r.cancel(), s(), this.speech = void 0, this._stopSpeaking = void 0;
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
    const n = [];
    let r = "listening";
    this.voice = {
      status: e.status,
      isMuted: e.isMuted,
      mode: r
    }, this._voiceVolume = 0, this._notifySubscribers(), n.push(e.onStatusChange((s) => {
      s.type === "ended" ? (this._finishVoiceAssistantMessage(), this._voiceSession = void 0, this.voice = void 0) : this.voice = {
        status: s,
        isMuted: e.isMuted,
        mode: r
      }, this._notifySubscribers();
    })), n.push(e.onModeChange((s) => {
      r = s, this.voice && (this.voice = {
        ...this.voice,
        mode: s
      }, this._notifySubscribers());
    })), n.push(e.onVolumeChange((s) => {
      this._voiceVolume = s;
      for (const i of this._voiceVolumeSubscribers) i();
    })), n.push(e.onTranscript((s) => {
      this._handleVoiceTranscript(s);
    })), this._voiceUnsubs = n;
  }
  _currentAssistantMsg = null;
  _handleVoiceTranscript(t) {
    if (this.ensureInitialized(), t.role === "user")
      this._finishVoiceAssistantMessage(), this._currentAssistantMsg = null, t.isFinal && (this._voiceMessages.push({
        id: We(),
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
          id: We(),
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
        const n = {
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
        this._voiceMessages[e] = n, this._currentAssistantMsg = n;
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
    this.import(ro.fromArray(t ?? []));
  }
  _eventSubscribers = /* @__PURE__ */ new Map();
  unstable_on(t, e) {
    const n = e;
    if (t === "modelContextUpdate") return this._contextProvider.subscribe?.(() => n({})) ?? (() => {
    });
    let r = this._eventSubscribers.get(t);
    return r || (r = /* @__PURE__ */ new Set(), this._eventSubscribers.set(t, r)), r.add(n), t === "initialize" && this._isInitialized && queueMicrotask(() => {
      r.has(n) && n({});
    }), () => {
      this._eventSubscribers.get(t)?.delete(n);
    };
  }
}, ps = class {
  cache = /* @__PURE__ */ new WeakMap();
  convertMessages(t, e) {
    return t.map((n, r) => {
      const s = e(this.cache.get(n), n, r);
      return this.cache.set(n, s), s;
    });
  }
};
const Lt = (t) => {
  try {
    return JSON.parse(t), !0;
  } catch {
    return !1;
  }
}, ms = (t) => {
  try {
    return JSON.parse(t);
  } catch {
    return;
  }
}, gs = (t, e) => {
  const n = ms(t), r = ms(e);
  return n === void 0 || r === void 0 ? !1 : br(n, r);
};
var Ed = class {
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
    const [t, e] = gh();
    this._controller = e;
    const n = Ph(() => this._getWrappedTools(), () => this._ac.signal, (r, s) => this._onHumanInput(r, s), {
      onExecutionStart: (r) => this._onExecutionStart(r),
      onExecutionEnd: (r) => this._onExecutionEnd(r)
    });
    t.pipeThrough(n).pipeThrough(new qi()).pipeTo(new WritableStream({ write: (r) => {
      try {
        if (r.type !== "result") return;
        this._handleResultChunk(r);
      } catch (s) {
        console.error("[ToolInvocationTracker] result chunk handling failed", s);
      }
    } })).catch((r) => {
      console.error("[ToolInvocationTracker] stream pipeline failed; will attempt single restart on next setState", r), this._pipelineDead = !0;
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
      } catch (n) {
        throw this._isRunning = e, n;
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
      const n = this._humanInput.get(t);
      return n ? (this._humanInput.delete(t), this._setStatus(t, { type: "executing" }), n.resolve(e), !0) : !1;
    } catch (n) {
      return console.error("[ToolInvocationTracker] resume failed", n), !1;
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
      return Object.fromEntries(Object.entries(t).map(([e, n]) => {
        const r = n.execute;
        return r === void 0 ? [e, n] : [e, {
          ...n,
          execute: (...[s, i]) => this._skipExecuteStreamIds.has(i.toolCallId) ? new Promise(() => {
          }) : r(s, i)
        }];
      }));
  }
  _onHumanInput(t, e) {
    return new Promise((n, r) => {
      const s = this._humanInput.get(t);
      if (s) try {
        s.reject(/* @__PURE__ */ new Error("Human input request was superseded by a new request"));
      } catch {
      }
      this._humanInput.set(t, {
        resolve: n,
        reject: r
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
    const e = t.meta.toolCallId, n = this._entries.get(e);
    !n && this._skipExecuteStreamIds.has(e) || n?.hasResult || this._invokeOnResult({
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
    const n = new Map(this._statuses);
    n.set(t, e), this._statuses = n, this._invokeOnStatusesChange();
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
  _shouldCloseArgsStream({ toolName: t, argsText: e, hasResult: n }) {
    return n ? !0 : (this._hasExecutableTool(t) || !this._isRunning) && Lt(e);
  }
  _startActiveEntry(t, e, n) {
    const r = this._controller.addToolCallPart({
      toolName: e,
      toolCallId: t
    });
    n && this._skipExecuteStreamIds.add(t);
    const s = {
      toolName: e,
      controller: r,
      argsText: "",
      hasResult: !1,
      argsComplete: !1
    };
    return this._entries.set(t, s), s;
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
    const n = e.result !== void 0;
    if (e.argsText !== t.argsText) {
      let r = !0;
      if (t.argsComplete) gs(t.argsText, e.argsText) && (t.argsText = e.argsText), r = !1;
      else if (!e.argsText.startsWith(t.argsText)) if (Lt(t.argsText) && Lt(e.argsText) && gs(t.argsText, e.argsText)) {
        const s = this._shouldCloseArgsStream({
          toolName: e.toolName,
          argsText: e.argsText,
          hasResult: n
        });
        s && t.controller.argsText.close(), t.argsText = e.argsText, t.argsComplete = s, r = !1;
      } else
        r = !1;
      if (r && t.controller) {
        const s = e.argsText.slice(t.argsText.length);
        t.controller.argsText.append(s);
        const i = this._shouldCloseArgsStream({
          toolName: e.toolName,
          argsText: e.argsText,
          hasResult: n
        });
        i && t.controller.argsText.close(), t.argsText = e.argsText, t.argsComplete = i;
      }
    }
    !t.argsComplete && t.controller && this._shouldCloseArgsStream({
      toolName: e.toolName,
      argsText: t.argsText,
      hasResult: n
    }) && (t.controller.argsText.close(), t.argsComplete = !0);
  }
  _processMessages(t) {
    const e = this._pendingRestore;
    for (const n of t)
      if (!(!n || !Array.isArray(n.content)))
        for (const r of n.content) {
          if (!r || r.type !== "tool-call") continue;
          const s = this._entries.get(r.toolCallId);
          if (e) {
            s?.controller || this._entries.set(r.toolCallId, {
              toolName: r.toolName,
              argsText: r.argsText,
              hasResult: r.result !== void 0
            }), r.messages && this._processMessages(r.messages);
            continue;
          }
          let i = s;
          if (i && !i.controller) {
            if (!(r.argsText !== i.argsText || r.result !== void 0 !== i.hasResult)) {
              r.messages && this._processMessages(r.messages);
              continue;
            }
            this._entries.delete(r.toolCallId), i = void 0;
          }
          if (i || (i = this._startActiveEntry(r.toolCallId, r.toolName, r.result !== void 0)), this._processArgsText(i, r), r.result !== void 0 && !i.hasResult) {
            const { controller: o } = i;
            if (!o) continue;
            i.hasResult = !0, i.argsComplete = !0, o.setResponse(new Ie({
              result: r.result,
              artifact: r.artifact,
              isError: r.isError,
              ...r.modelContent !== void 0 ? { modelContent: r.modelContent } : {}
            })), o.close();
          }
          r.messages && this._processMessages(r.messages);
        }
  }
};
const Ad = Object.freeze([]), bs = (t, e) => {
  const n = Object.keys(t);
  if (n.length !== Object.keys(e).length) return !1;
  for (const r of n) if (t[r] !== e[r]) return !1;
  return !0;
}, Rd = (t, e) => t && e[e.length - 1]?.role !== "assistant";
var Md = class extends Id {
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
  _converter = new ps();
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
    const n = this._store;
    this._store = t, this.extras !== t.extras && (this.extras = t.extras);
    const r = t.suggestions ?? Ad;
    bs(this.suggestions, r) || (this.suggestions = r);
    const s = {
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
    bs(this._capabilities, s) || (this._capabilities = s);
    let i;
    if (t.messageRepository) {
      if (n && n.isRunning === t.isRunning && n.messageRepository === t.messageRepository) {
        this._notifySubscribers();
        return;
      }
      const a = t.messageRepository.messages, l = t.messageRepository.headId ?? a.at(-1)?.message.id ?? null;
      if (n && n.messageRepository === t.messageRepository)
        this.repository.resetHead(l), i = this.repository.getMessages();
      else {
        const u = new Set(a.map(({ message: h }) => h.id));
        for (const { message: h, parentId: c } of a) this.repository.addOrUpdateMessage(c, h);
        for (const { message: h } of this.repository.export().messages) u.has(h.id) || this.repository.deleteMessage(h.id);
        this.repository.resetHead(l), i = this.repository.getMessages();
      }
    } else if (t.messages) {
      if (n) {
        if (n.convertMessage !== t.convertMessage) this._converter = new ps();
        else if (n.isRunning === t.isRunning && n.messages === t.messages) {
          this._notifySubscribers();
          return;
        }
      }
      i = t.convertMessage ? this._converter.convertMessages(t.messages, (u, h, c) => {
        if (!t.convertMessage) return h;
        const d = rn(c === (t.messages?.length ?? 0) - 1, e, !1, !1, void 0);
        if (u && (u.role !== "assistant" || !xd(u.status) || u.status === d)) return u;
        const f = nn(t.convertMessage(h, c), c.toString(), d);
        return jh(f, h), f;
      }) : t.messages;
      const a = /* @__PURE__ */ new Set(), l = [];
      for (let u = i.length - 1; u >= 0; u--) {
        const h = i[u];
        if (a.has(h.id)) {
          console.warn(`ExternalStoreThreadRuntimeCore: duplicate message id "${h.id}" in the provided messages array; keeping the last occurrence.`);
          continue;
        }
        a.add(h.id), l.push(h);
      }
      l.length !== i.length && (i = l.reverse());
      for (let u = 0; u < i.length; u++) {
        const h = i[u], c = i[u - 1];
        this.repository.addOrUpdateMessage(c?.id ?? null, h);
      }
    } else throw new Error("ExternalStoreAdapter must provide either 'messages' or 'messageRepository'");
    i.length > 0 && this.ensureInitialized(), (n?.isRunning ?? !1) !== (t.isRunning ?? !1) && (t.isRunning ? this._notifyEventSubscribers("runStart", {}) : this._notifyEventSubscribers("runEnd", {}));
    let o = null;
    Rd(e, i) && (o = We(), this.repository.addOrUpdateMessage(i.at(-1)?.id ?? null, nn({
      role: "assistant",
      content: [],
      metadata: { isOptimistic: !0 }
    }, o, { type: "running" }))), this.repository.resetHead(o ?? i.at(-1)?.id ?? null), this._messages = this.repository.getMessages(), this._driveToolInvocations(), this._notifySubscribers();
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
    this._toolInvocations || (this._toolInvocations = new Ed(() => this.getModelContext().tools, {
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
      const e = (n) => {
        for (const r of n)
          if (Array.isArray(r.content))
            for (const s of r.content)
              !s || s.type !== "tool-call" || (this._toolCallToMessageId.set(s.toolCallId, r.id), s.messages && e(s.messages));
      };
      e(this._messages), this._messagesForToolCallIndex = this._messages;
    }
    return this._toolCallToMessageId.get(t);
  }
  switchToBranch(t) {
    if (!this._store.setMessages) throw new Error("Runtime does not support switching branches.");
    if (this._store.isRunning) return;
    const e = this._store.unstable_onBranchChange, n = e ? this.repository.canonicalHeadId : null;
    this.repository.switchToBranch(t), this.updateMessages(this.repository.getMessages()), e && this._notifyBranchChange(n, e);
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
    const n = this.repository.canonicalHeadId;
    n !== t && e({
      headId: n,
      visibleMessageIds: this.repository.getMessages().map((r) => r.id)
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
    if (e.findIndex((n) => n.id === t) === -1) throw new Error("Message not found.");
    this.updateMessages(e.filter((n) => n.id !== t));
  }
  getQueueItems() {
    return this._store?.queue?.items ?? vr;
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
    const n = e[e.length - 1];
    n?.role === "user" && n.id === e.at(-1)?.id ? (this.repository.deleteMessage(n.id), this.composer.text.trim() || this.composer.setText(Ct(n)), e = this.repository.getMessages()) : this._notifySubscribers(), setTimeout(() => {
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
    const e = new wr();
    e.import(ro.fromArray(t ?? [])), this.updateMessages(e.getMessages());
  }
  import(t) {
    super.import(t), this._store.onImport && this._store.onImport(this.repository.getMessages());
  }
  updateMessages = (t) => {
    this._store.convertMessage !== void 0 ? this._store.setMessages?.(t.flatMap(Hh)) : this._store.setMessages?.(t);
  };
};
const ys = (t) => t.adapters?.threadList ?? {};
var Pd = class extends no {
  threads;
  constructor(t) {
    super(), this.threads = new md(ys(t), () => new Md(this._contextProvider, t));
  }
  setAdapter(t) {
    this.threads.__internal_setAdapter(ys(t)), this.threads.getMainThreadRuntimeCore().__internal_setAdapter(t);
  }
};
const j_ = (t) => {
  const e = v(11);
  let n;
  e[0] !== t ? (n = () => new Pd(t), e[0] = t, e[1] = n) : n = e[1];
  const [r] = J(n);
  let s;
  e[2] !== r || e[3] !== t ? (s = () => {
    r.setAdapter(t);
  }, e[2] = r, e[3] = t, e[4] = s) : s = e[4], q(s);
  const { modelContext: i } = ud() ?? {};
  let o, a;
  e[5] !== i || e[6] !== r ? (o = () => {
    if (i)
      return r.registerModelContextProvider(i);
  }, a = [i, r], e[5] = i, e[6] = r, e[7] = o, e[8] = a) : (o = e[7], a = e[8]), q(o, a);
  let l;
  return e[9] !== r ? (l = new to(r), e[9] = r, e[10] = l) : l = e[10], l;
}, Dd = (t) => {
  const e = v(10), { id: n, children: r } = t;
  let s;
  e[0] !== n ? (s = _e({
    source: "thread",
    query: {
      type: "id",
      id: n
    },
    get: (u) => u.thread().message({ id: n })
  }), e[0] = n, e[1] = s) : s = e[1];
  let i;
  e[2] !== n ? (i = _e({
    source: "message",
    query: {},
    get: (u) => u.thread().message({ id: n }).composer()
  }), e[2] = n, e[3] = i) : i = e[3];
  let o;
  e[4] !== s || e[5] !== i ? (o = {
    message: s,
    composer: i
  }, e[4] = s, e[5] = i, e[6] = o) : o = e[6];
  const a = H(o);
  let l;
  return e[7] !== a || e[8] !== r ? (l = /* @__PURE__ */ _(Ee, {
    value: a,
    children: r
  }), e[7] = a, e[8] = r, e[9] = l) : l = e[9], l;
}, kr = (t, e) => t.Message === e.Message && t.EditComposer === e.EditComposer && t.UserEditComposer === e.UserEditComposer && t.AssistantEditComposer === e.AssistantEditComposer && t.SystemEditComposer === e.SystemEditComposer && t.UserMessage === e.UserMessage && t.AssistantMessage === e.AssistantMessage && t.SystemMessage === e.SystemMessage, Bd = () => null, _s = /* @__PURE__ */ new WeakMap(), Od = (t, e) => {
  let n = _s.get(t);
  return n || (n = new Set(t.map((r) => r.id)), _s.set(t, n)), n.has(e);
}, Fd = (t, e, n) => {
  switch (e) {
    case "user":
      return n ? t.UserEditComposer ?? t.EditComposer ?? t.UserMessage ?? t.Message : t.UserMessage ?? t.Message;
    case "assistant":
      return n ? t.AssistantEditComposer ?? t.EditComposer ?? t.AssistantMessage ?? t.Message : t.AssistantMessage ?? t.Message;
    case "system":
      return n ? t.SystemEditComposer ?? t.EditComposer ?? t.SystemMessage ?? t.Message : t.SystemMessage ?? t.Message ?? Bd;
    default:
      throw new Error(`Unknown message role: ${e}`);
  }
}, Tr = (t) => {
  const e = v(6), { components: n } = t, r = P(Nd), s = P(Ld);
  let i;
  e[0] !== n || e[1] !== s || e[2] !== r ? (i = Fd(n, r, s), e[0] = n, e[1] = s, e[2] = r, e[3] = i) : i = e[3];
  const o = i;
  let a;
  return e[4] !== o ? (a = /* @__PURE__ */ _(o, {}), e[4] = o, e[5] = a) : a = e[5], a;
}, oo = te((t) => {
  const e = v(5), { index: n, components: r } = t;
  let s;
  e[0] !== r ? (s = /* @__PURE__ */ _(Tr, { components: r }), e[0] = r, e[1] = s) : s = e[1];
  let i;
  return e[2] !== n || e[3] !== s ? (i = /* @__PURE__ */ _(Qi, {
    index: n,
    children: s
  }), e[2] = n, e[3] = s, e[4] = i) : i = e[4], i;
}, (t, e) => t.index === e.index && kr(t.components, e.components));
oo.displayName = "ThreadPrimitive.MessageByIndex";
const ao = te((t) => {
  const e = v(7), { messageId: n, components: r } = t;
  let s;
  if (e[0] !== n ? (s = (a) => Od(a.thread.messages, n), e[0] = n, e[1] = s) : s = e[1], !P(s)) return null;
  let i;
  e[2] !== r ? (i = /* @__PURE__ */ _(Tr, { components: r }), e[2] = r, e[3] = i) : i = e[3];
  let o;
  return e[4] !== n || e[5] !== i ? (o = /* @__PURE__ */ _(Dd, {
    id: n,
    children: i
  }), e[4] = n, e[5] = i, e[6] = o) : o = e[6], o;
}, (t, e) => t.messageId === e.messageId && kr(t.components, e.components));
ao.displayName = "ThreadPrimitive.Unstable_MessageById";
const xs = ({ children: t }) => {
  const e = P((n) => n.thread.messages.length);
  return Z(() => e === 0 ? null : Array.from({ length: e }, (n, r) => /* @__PURE__ */ _(Qi, {
    index: r,
    children: /* @__PURE__ */ _(pn, {
      getItemState: (s) => s.thread().message({ index: r }).getState(),
      children: (s) => t({ get message() {
        return s();
      } })
    })
  }, r)), [e, t]);
}, lo = (t) => {
  const e = v(4), { components: n, children: r } = t;
  if (n) {
    let i;
    return e[0] !== n ? (i = /* @__PURE__ */ _(xs, { children: () => /* @__PURE__ */ _(Tr, { components: n }) }), e[0] = n, e[1] = i) : i = e[1], i;
  }
  let s;
  return e[2] !== r ? (s = /* @__PURE__ */ _(xs, { children: r }), e[2] = r, e[3] = s) : s = e[3], s;
};
lo.displayName = "ThreadPrimitive.Messages";
const $d = te(lo, (t, e) => t.children || e.children ? t.children === e.children : kr(t.components, e.components));
function Nd(t) {
  return t.message.role;
}
function Ld(t) {
  return t.message.composer.isEditing;
}
const uo = (t) => {
  const e = t.message.metadata;
  if (!(!e || typeof e != "object"))
    return e.custom?.quote;
};
var zd = class extends Error {
  componentName;
  constructor(t, e = `Component "${t}" is not in the generative-ui allowlist.`) {
    super(e), this.name = "GenerativeUIRenderError", this.componentName = t;
  }
};
const Vd = (t) => typeof t == "object" && t !== null, co = (t, e, n, r) => {
  if (t == null) return null;
  if (typeof t == "string") return t;
  if (!Vd(t) || !("component" in t) || typeof t.component != "string")
    return null;
  const { component: s, props: i, children: o, key: a } = t, l = e[s];
  if (!l) {
    if (n) return /* @__PURE__ */ _(n, {
      component: s,
      props: i
    }, a ?? r);
    throw new zd(s);
  }
  const u = o?.length ? o.map((h, c) => co(h, e, n, `${r}/${c}`)) : void 0;
  return il(l, {
    ...i ?? {},
    key: a ?? r
  }, ...u ?? []);
}, Ud = (t) => {
  if (!t || t.root === void 0 || t.root === null) return [];
  const e = t.root;
  return Array.isArray(e) ? e : [e];
}, Cr = (t) => {
  const e = v(11), { spec: n, components: r, Fallback: s } = t;
  let i;
  e[0] !== n ? (i = Ud(n), e[0] = n, e[1] = i) : i = e[1];
  const o = i;
  let a;
  if (e[2] !== s || e[3] !== r || e[4] !== o) {
    let u;
    e[6] !== s || e[7] !== r ? (u = (h, c) => co(h, r, s, `${c}`), e[6] = s, e[7] = r, e[8] = u) : u = e[8], a = o.map(u), e[2] = s, e[3] = r, e[4] = o, e[5] = a;
  } else a = e[5];
  let l;
  return e[9] !== a ? (l = /* @__PURE__ */ _(Re, { children: a }), e[9] = a, e[10] = l) : l = e[10], l;
};
Cr.displayName = "GenerativeUIRender";
const ho = (t) => {
  const e = v(4), { components: n, spec: r, Fallback: s } = t, i = P(qd), o = r ?? i;
  if (!o) return null;
  let a;
  return e[0] !== s || e[1] !== n || e[2] !== o ? (a = /* @__PURE__ */ _(Cr, {
    spec: o,
    components: n,
    Fallback: s
  }), e[0] = s, e[1] = n, e[2] = o, e[3] = a) : a = e[3], a;
};
ho.displayName = "MessagePrimitive.GenerativeUI";
function qd(t) {
  const e = t.part;
  return e?.type === "generative-ui" ? e.spec : void 0;
}
const jd = "ui://", Hd = (t) => !!t?.startsWith(jd), Mn = (t) => {
  let e = -1;
  return {
    startGroup: (n) => {
      e === -1 && (e = n);
    },
    endGroup: (n, r) => {
      e !== -1 && (r.push({
        type: t,
        startIndex: e,
        endIndex: n
      }), e = -1);
    },
    finalize: (n, r) => {
      e !== -1 && r.push({
        type: t,
        startIndex: e,
        endIndex: n
      });
    }
  };
}, Gd = (t, e, n) => {
  const r = [];
  if (e) {
    const s = Mn("chainOfThoughtGroup");
    for (let i = 0; i < t.length; i++) {
      const o = t[i];
      o === "tool-call" || o === "reasoning" ? s.startGroup(i) : (s.endGroup(i - 1, r), r.push({
        type: "single",
        index: i
      }));
    }
    s.finalize(t.length - 1, r);
  } else {
    const s = Mn("toolGroup"), i = Mn("reasoningGroup");
    for (let o = 0; o < t.length; o++) {
      const a = t[o];
      a === "tool-call" ? (i.endGroup(o - 1, r), s.startGroup(o)) : a === "reasoning" ? (s.endGroup(o - 1, r), i.startGroup(o)) : (s.endGroup(o - 1, r), i.endGroup(o - 1, r), r.push({
        type: "single",
        index: o
      }));
    }
    s.finalize(t.length - 1, r), i.finalize(t.length - 1, r);
  }
  if (n) {
    const s = /* @__PURE__ */ new Set();
    for (const i of r) {
      if (i.type === "single") continue;
      const o = n[i.startIndex];
      o !== void 0 && !s.has(o) && (s.add(o), i.idKey = `id:${o}`);
    }
  }
  return r;
}, Qd = (t) => {
  const e = v(10), n = P(Ln(df)), r = P(Ln(pf));
  let s;
  e: {
    if (n.length === 0) {
      let a;
      e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (a = [], e[0] = a) : a = e[0];
      let l;
      e[1] !== r ? (l = {
        ranges: a,
        partIds: r
      }, e[1] = r, e[2] = l) : l = e[2], s = l;
      break e;
    }
    let i;
    e[3] !== n || e[4] !== r || e[5] !== t ? (i = Gd(n, t, r), e[3] = n, e[4] = r, e[5] = t, e[6] = i) : i = e[6];
    let o;
    e[7] !== r || e[8] !== i ? (o = {
      ranges: i,
      partIds: r
    }, e[7] = r, e[8] = i, e[9] = o) : o = e[9], s = o;
  }
  return s;
}, Wd = (t) => {
  const e = v(9);
  let n, r;
  e[0] !== t ? ({ Fallback: n, ...r } = t, e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]);
  let s;
  e[3] !== n || e[4] !== r.toolName ? (s = (a) => a.tools.toolUIs[r.toolName]?.[0]?.render ?? n, e[3] = n, e[4] = r.toolName, e[5] = s) : s = e[5];
  const i = P(s);
  if (!i) return null;
  let o;
  return e[6] !== i || e[7] !== r ? (o = /* @__PURE__ */ _(i, { ...r }), e[6] = i, e[7] = r, e[8] = o) : o = e[8], o;
}, Ir = (t, e, n) => {
  const r = t.renderers[e]?.[0];
  return r || (t.fallbacks[0] ?? n);
}, Yd = (t) => {
  const e = v(9);
  let n, r;
  e[0] !== t ? ({ Fallback: n, ...r } = t, e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]);
  let s;
  e[3] !== n || e[4] !== r.name ? (s = (a) => Ir(a.dataRenderers, r.name, n), e[3] = n, e[4] = r.name, e[5] = s) : s = e[5];
  const i = P(s);
  if (!i) return null;
  let o;
  return e[6] !== i || e[7] !== r ? (o = /* @__PURE__ */ _(i, { ...r }), e[6] = i, e[7] = r, e[8] = o) : o = e[8], o;
}, re = {
  Text: () => null,
  Reasoning: () => null,
  Source: () => null,
  Image: () => null,
  File: () => null,
  Unstable_Audio: () => null,
  ToolGroup: ({ children: t }) => t,
  ReasoningGroup: ({ children: t }) => t
}, Kd = (t) => {
  const e = v(47), { components: n } = t;
  let r;
  e[0] !== n ? (r = n === void 0 ? {} : n, e[0] = n, e[1] = r) : r = e[1];
  const { Text: s, Reasoning: i, Image: o, Source: a, File: l, Unstable_Audio: u, tools: h, data: c, generativeUI: d } = r, f = s === void 0 ? re.Text : s, p = i === void 0 ? re.Reasoning : i, x = o === void 0 ? re.Image : o, S = a === void 0 ? re.Source : a, y = l === void 0 ? re.File : l, T = u === void 0 ? re.Unstable_Audio : u;
  let R;
  e[2] !== h ? (R = h === void 0 ? {} : h, e[2] = h, e[3] = R) : R = e[3];
  const C = R, I = H(), b = P(mf), E = b.type;
  if (E === "tool-call") {
    let A;
    e[4] !== I ? (A = I.part(), e[4] = I, e[5] = A) : A = e[5];
    const D = A.addToolResult;
    let w;
    e[6] !== I ? (w = I.part(), e[6] = I, e[7] = w) : w = e[7];
    const L = w.resumeToolCall;
    let O;
    e[8] !== I ? (O = I.part(), e[8] = I, e[9] = O) : O = e[9];
    const V = O.respondToToolApproval;
    if ("Override" in C) {
      let K;
      return e[10] !== D || e[11] !== b || e[12] !== V || e[13] !== L || e[14] !== C.Override ? (K = /* @__PURE__ */ _(C.Override, {
        ...b,
        addResult: D,
        resume: L,
        respondToApproval: V
      }), e[10] = D, e[11] = b, e[12] = V, e[13] = L, e[14] = C.Override, e[15] = K) : K = e[15], K;
    }
    const G = C.by_name?.[b.toolName] ?? C.Fallback;
    let F;
    return e[16] !== G || e[17] !== D || e[18] !== b || e[19] !== V || e[20] !== L ? (F = /* @__PURE__ */ _(Wd, {
      ...b,
      Fallback: G,
      addResult: D,
      resume: L,
      respondToApproval: V
    }), e[16] = G, e[17] = D, e[18] = b, e[19] = V, e[20] = L, e[21] = F) : F = e[21], F;
  }
  if (b.status?.type === "requires-action") throw new Error("Encountered unexpected requires-action status");
  switch (E) {
    case "text": {
      let A;
      return e[22] !== f || e[23] !== b ? (A = /* @__PURE__ */ _(f, { ...b }), e[22] = f, e[23] = b, e[24] = A) : A = e[24], A;
    }
    case "reasoning": {
      let A;
      return e[25] !== p || e[26] !== b ? (A = /* @__PURE__ */ _(p, { ...b }), e[25] = p, e[26] = b, e[27] = A) : A = e[27], A;
    }
    case "source": {
      let A;
      return e[28] !== S || e[29] !== b ? (A = /* @__PURE__ */ _(S, { ...b }), e[28] = S, e[29] = b, e[30] = A) : A = e[30], A;
    }
    case "image": {
      let A;
      return e[31] !== x || e[32] !== b ? (A = /* @__PURE__ */ _(x, { ...b }), e[31] = x, e[32] = b, e[33] = A) : A = e[33], A;
    }
    case "file": {
      let A;
      return e[34] !== y || e[35] !== b ? (A = /* @__PURE__ */ _(y, { ...b }), e[34] = y, e[35] = b, e[36] = A) : A = e[36], A;
    }
    case "audio": {
      let A;
      return e[37] !== T || e[38] !== b ? (A = /* @__PURE__ */ _(T, { ...b }), e[37] = T, e[38] = b, e[39] = A) : A = e[39], A;
    }
    case "data": {
      const A = c?.by_name?.[b.name] ?? c?.Fallback;
      let D;
      return e[40] !== A || e[41] !== b ? (D = /* @__PURE__ */ _(Yd, {
        ...b,
        Fallback: A
      }), e[40] = A, e[41] = b, e[42] = D) : D = e[42], D;
    }
    case "generative-ui": {
      if (!d?.components)
        return null;
      const A = b;
      let D;
      return e[43] !== d.Fallback || e[44] !== d.components || e[45] !== A.spec ? (D = /* @__PURE__ */ _(Cr, {
        spec: A.spec,
        components: d.components,
        Fallback: d.Fallback
      }), e[43] = d.Fallback, e[44] = d.components, e[45] = A.spec, e[46] = D) : D = e[46], D;
    }
    default:
      return console.warn(`Unknown message part type: ${E}`), null;
  }
}, wt = te((t) => {
  const e = v(5), { index: n, components: r } = t;
  let s;
  e[0] !== r ? (s = /* @__PURE__ */ _(Kd, { components: r }), e[0] = r, e[1] = s) : s = e[1];
  let i;
  return e[2] !== n || e[3] !== s ? (i = /* @__PURE__ */ _(_r, {
    index: n,
    children: s
  }), e[2] = n, e[3] = s, e[4] = i) : i = e[4], i;
}, (t, e) => t.index === e.index && t.components?.Text === e.components?.Text && t.components?.Reasoning === e.components?.Reasoning && t.components?.Source === e.components?.Source && t.components?.Image === e.components?.Image && t.components?.File === e.components?.File && t.components?.Unstable_Audio === e.components?.Unstable_Audio && t.components?.tools === e.components?.tools && t.components?.data === e.components?.data && t.components?.generativeUI === e.components?.generativeUI && t.components?.ToolGroup === e.components?.ToolGroup && t.components?.ReasoningGroup === e.components?.ReasoningGroup);
wt.displayName = "MessagePrimitive.PartByIndex";
const Jd = (t) => {
  const e = v(6), { status: n, component: r } = t, s = n.type === "running";
  let i;
  e[0] !== r || e[1] !== n ? (i = /* @__PURE__ */ _(r, {
    type: "text",
    text: "",
    status: n
  }), e[0] = r, e[1] = n, e[2] = i) : i = e[2];
  let o;
  return e[3] !== s || e[4] !== i ? (o = /* @__PURE__ */ _(xr, {
    text: "",
    isRunning: s,
    children: i
  }), e[3] = s, e[4] = i, e[5] = o) : o = e[5], o;
}, Xd = Object.freeze({ type: "complete" }), Zd = Object.freeze({ type: "running" }), ef = (t) => {
  const e = v(6), { components: n } = t, r = P(gf);
  if (n?.Empty) {
    let o;
    return e[0] !== n.Empty || e[1] !== r ? (o = /* @__PURE__ */ _(n.Empty, { status: r }), e[0] = n.Empty, e[1] = r, e[2] = o) : o = e[2], o;
  }
  if (r.type !== "running") return null;
  const s = n?.Text ?? re.Text;
  let i;
  return e[3] !== r || e[4] !== s ? (i = /* @__PURE__ */ _(Jd, {
    status: r,
    component: s
  }), e[3] = r, e[4] = s, e[5] = i) : i = e[5], i;
}, fo = te(ef, (t, e) => t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), tf = (t) => {
  const e = v(4), { components: n, enabled: r } = t;
  let s;
  if (e[0] !== r ? (s = (o) => {
    if (!r || o.message.parts.length === 0) return !1;
    const a = o.message.parts[o.message.parts.length - 1];
    return a?.type !== "text" && a?.type !== "reasoning";
  }, e[0] = r, e[1] = s) : s = e[1], !P(s)) return null;
  let i;
  return e[2] !== n ? (i = /* @__PURE__ */ _(fo, { components: n }), e[2] = n, e[3] = i) : i = e[3], i;
}, nf = te(tf, (t, e) => t.enabled === e.enabled && t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), rf = (t) => {
  const e = v(4), { Quote: n } = t, r = P(uo);
  if (!r) return null;
  let s;
  return e[0] !== n || e[1] !== r.messageId || e[2] !== r.text ? (s = /* @__PURE__ */ _(n, {
    text: r.text,
    messageId: r.messageId
  }), e[0] = n, e[1] = r.messageId, e[2] = r.text, e[3] = s) : s = e[3], s;
}, sf = te(rf);
function po(t, e) {
  const n = t.toolUIs[e.toolName]?.[0]?.render ?? null;
  return n || (Hd(e.mcp?.app?.resourceUri) && t.mcpApp ? t.mcpApp.render : null);
}
const mo = () => {
  const t = v(12), e = H(), n = P(bf), r = P(yf);
  if (!r || n.type !== "tool-call") return null;
  let s;
  t[0] !== e ? (s = e.part(), t[0] = e, t[1] = s) : s = t[1];
  const i = s.addToolResult;
  let o;
  t[2] !== e ? (o = e.part(), t[2] = e, t[3] = o) : o = t[3];
  const a = o.resumeToolCall;
  let l;
  t[4] !== e ? (l = e.part(), t[4] = e, t[5] = l) : l = t[5];
  let u;
  return t[6] !== r || t[7] !== n || t[8] !== s.addToolResult || t[9] !== o.resumeToolCall || t[10] !== l.respondToToolApproval ? (u = /* @__PURE__ */ _(r, {
    ...n,
    addResult: i,
    resume: a,
    respondToApproval: l.respondToToolApproval
  }), t[6] = r, t[7] = n, t[8] = s.addToolResult, t[9] = o.resumeToolCall, t[10] = l.respondToToolApproval, t[11] = u) : u = t[11], u;
}, go = () => {
  const t = v(3), e = P(_f), n = P(xf);
  if (!n || e.type !== "data") return null;
  const r = e;
  let s;
  return t[0] !== n || t[1] !== r ? (s = /* @__PURE__ */ _(n, { ...r }), t[0] = n, t[1] = r, t[2] = s) : s = t[2], s;
}, of = () => {
  const t = v(2), e = P(Sf);
  if (e === "tool-call") {
    let n;
    return t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (n = /* @__PURE__ */ _(mo, {}), t[0] = n) : n = t[0], n;
  }
  if (e === "data") {
    let n;
    return t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (n = /* @__PURE__ */ _(go, {}), t[1] = n) : n = t[1], n;
  }
  return null;
}, af = Object.freeze({
  type: "text",
  text: "",
  status: Zd
}), lf = ({ children: t }) => {
  const e = H(), n = P((r) => r.dataRenderers);
  return /* @__PURE__ */ _(pn, {
    getItemState: (r) => r.part().getState(),
    children: (r) => t({ get part() {
      const s = r();
      if (s.type === "tool-call") {
        const i = po(e.tools().getState(), s) !== null, o = e.part();
        return {
          ...s,
          toolUI: i ? /* @__PURE__ */ _(mo, {}) : null,
          addResult: o.addToolResult,
          resume: o.resumeToolCall,
          respondToApproval: o.respondToToolApproval
        };
      }
      if (s.type === "data") {
        const i = Ir(n, s.name, void 0) !== void 0;
        return {
          ...s,
          dataRendererUI: i ? /* @__PURE__ */ _(go, {}) : null
        };
      }
      return s;
    } })
  });
}, bo = (t) => {
  const e = v(5), { index: n, children: r } = t;
  let s;
  e[0] !== r ? (s = /* @__PURE__ */ _(lf, { children: r }), e[0] = r, e[1] = s) : s = e[1];
  let i;
  return e[2] !== n || e[3] !== s ? (i = /* @__PURE__ */ _(_r, {
    index: n,
    children: s
  }), e[2] = n, e[3] = s, e[4] = i) : i = e[4], i;
}, uf = (t) => {
  const e = v(9), { children: n } = t, r = P(wf), s = P(vf), i = r === 0 && s;
  if (r === 0) {
    if (!i) return null;
    let a;
    e[0] !== n ? (a = n({ part: af }), e[0] = n, e[1] = a) : a = e[1];
    let l;
    return e[2] !== a ? (l = /* @__PURE__ */ _(xr, {
      text: "",
      isRunning: !0,
      children: a
    }), e[2] = a, e[3] = l) : l = e[3], l;
  }
  let o;
  if (e[4] !== n || e[5] !== r) {
    let a;
    e[7] !== n ? (a = (l, u) => /* @__PURE__ */ _(bo, {
      index: u,
      children: (h) => n(h) ?? /* @__PURE__ */ _(of, {})
    }, u), e[7] = n, e[8] = a) : a = e[8], o = /* @__PURE__ */ _(Re, { children: Array.from({ length: r }, a) }), e[4] = n, e[5] = r, e[6] = o;
  } else o = e[6];
  return o;
}, Wn = (t) => {
  const e = v(5), { components: n, unstable_showEmptyOnNonTextEnd: r, children: s } = t, i = r === void 0 ? !0 : r;
  if (s) {
    let a;
    return e[0] !== s ? (a = /* @__PURE__ */ _(uf, { children: s }), e[0] = s, e[1] = a) : a = e[1], a;
  }
  let o;
  return e[2] !== n || e[3] !== i ? (o = /* @__PURE__ */ _(cf, {
    components: n,
    unstable_showEmptyOnNonTextEnd: i
  }), e[2] = n, e[3] = i, e[4] = o) : o = e[4], o;
};
Wn.displayName = "MessagePrimitive.Parts";
const cf = (t) => {
  const e = v(15), { components: n, unstable_showEmptyOnNonTextEnd: r } = t, s = P(kf), i = !!n?.ChainOfThought, { ranges: o, partIds: a } = Qd(i);
  let l;
  e: {
    if (s === 0) {
      let p;
      e[0] !== n ? (p = /* @__PURE__ */ _(fo, { components: n }), e[0] = n, e[1] = p) : p = e[1], l = p;
      break e;
    }
    let f;
    if (e[2] !== n || e[3] !== o || e[4] !== a) {
      const p = /* @__PURE__ */ new Set(), x = (S) => {
        const y = a[S];
        return y !== void 0 && !p.has(y) ? (p.add(y), `part-id:${y}`) : `part-${S}`;
      };
      f = o.map((S) => {
        if (S.type === "single") return /* @__PURE__ */ _(wt, {
          index: S.index,
          components: n
        }, S.index);
        if (S.type === "chainOfThoughtGroup") {
          const y = n?.ChainOfThought;
          return y ? /* @__PURE__ */ _(Vh, {
            startIndex: S.startIndex,
            endIndex: S.endIndex,
            children: /* @__PURE__ */ _(y, {})
          }, `chainOfThought-${S.idKey ?? S.startIndex}`) : null;
        } else return S.type === "toolGroup" ? /* @__PURE__ */ _(n?.ToolGroup ?? re.ToolGroup, {
          startIndex: S.startIndex,
          endIndex: S.endIndex,
          children: Array.from({ length: S.endIndex - S.startIndex + 1 }, (y, T) => {
            const R = S.startIndex + T;
            return /* @__PURE__ */ _(wt, {
              index: R,
              components: n
            }, x(R));
          })
        }, `tool-${S.idKey ?? S.startIndex}`) : /* @__PURE__ */ _(n?.ReasoningGroup ?? re.ReasoningGroup, {
          startIndex: S.startIndex,
          endIndex: S.endIndex,
          children: Array.from({ length: S.endIndex - S.startIndex + 1 }, (y, T) => {
            const R = S.startIndex + T;
            return /* @__PURE__ */ _(wt, {
              index: R,
              components: n
            }, `part-${R}`);
          })
        }, `reasoning-${S.startIndex}`);
      }), e[2] = n, e[3] = o, e[4] = a, e[5] = f;
    } else f = e[5];
    l = f;
  }
  const u = l;
  let h;
  e[6] !== n ? (h = n?.Quote && /* @__PURE__ */ _(sf, { Quote: n.Quote }), e[6] = n, e[7] = h) : h = e[7];
  let c;
  e[8] !== n || e[9] !== r ? (c = /* @__PURE__ */ _(nf, {
    components: n,
    enabled: r
  }), e[8] = n, e[9] = r, e[10] = c) : c = e[10];
  let d;
  return e[11] !== u || e[12] !== h || e[13] !== c ? (d = /* @__PURE__ */ Ae(Re, { children: [
    h,
    u,
    c
  ] }), e[11] = u, e[12] = h, e[13] = c, e[14] = d) : d = e[14], d;
};
function hf(t) {
  return t.type;
}
function df(t) {
  return t.message.parts.map(hf);
}
function ff(t) {
  return t.type === "tool-call" ? t.toolCallId : void 0;
}
function pf(t) {
  return t.message.parts.map(ff);
}
function mf(t) {
  return t.part;
}
function gf(t) {
  return t.message.status ?? Xd;
}
function bf(t) {
  return t.part;
}
function yf(t) {
  return t.part.type === "tool-call" ? po(t.tools, t.part) : null;
}
function _f(t) {
  return t.part;
}
function xf(t) {
  return t.part.type === "data" ? Ir(t.dataRenderers, t.part.name, void 0) ?? null : null;
}
function Sf(t) {
  return t.part.type;
}
function wf(t) {
  return t.message.parts.length;
}
function vf(t) {
  return (t.message.status?.type ?? "complete") === "running";
}
function kf(t) {
  return t.message.parts.length;
}
const Tf = /* @__PURE__ */ Symbol.for("@assistant-ui/groupBy.memoKey"), Ss = (t) => {
  const e = t.nextChildIdx++;
  return t.nodeKey === "" ? String(e) : `${t.nodeKey}.${e}`;
}, ws = (t, e) => {
  if (!(e === void 0 || t.claimed.has(e)))
    return t.claimed.add(e), `id:${e}`;
}, Cf = (t, e) => {
  const n = {
    key: "",
    nodeKey: "",
    indices: [],
    children: [],
    nextChildIdx: 0,
    claimed: /* @__PURE__ */ new Set()
  }, r = [n], s = () => {
    const i = r.pop(), o = r[r.length - 1];
    o.children.push({
      type: "group",
      key: i.key,
      nodeKey: i.nodeKey,
      idKey: ws(o, e?.[i.indices[0]]),
      indices: i.indices,
      children: i.children
    });
  };
  for (let i = 0; i < t.length; i++) {
    const o = t[i];
    let a = 0;
    for (; a < r.length - 1 && a < o.length && r[a + 1].key === o[a]; ) a++;
    for (; r.length - 1 > a; ) s();
    for (; r.length - 1 < o.length; ) {
      const u = r[r.length - 1];
      r.push({
        key: o[r.length - 1],
        nodeKey: Ss(u),
        indices: [],
        children: [],
        nextChildIdx: 0,
        claimed: /* @__PURE__ */ new Set()
      });
    }
    const l = r[r.length - 1];
    l.children.push({
      type: "part",
      index: i,
      nodeKey: Ss(l),
      idKey: ws(l, e?.[i])
    });
    for (let u = 1; u < r.length; u++) r[u].indices.push(i);
  }
  for (; r.length > 1; ) s();
  return n.children;
}, If = Object.freeze({ type: "complete" }), Ef = (t, e, n) => {
  if (!n) return !1;
  switch (t) {
    case "never":
      return !1;
    case "always":
      return !0;
    case "empty":
      return e.length === 0;
    case "no-text": {
      const r = e[e.length - 1];
      return r === void 0 || r.type !== "text" && r.type !== "reasoning";
    }
  }
}, yo = () => {
  throw new Error("MessagePrimitive.GroupedParts: rendered `children` under a leaf part. `children` is only meaningful for `group-…` cases — add a matching case for the part type or return `null` to skip it.");
}, _o = (t, e, n) => {
  if (t.type === "part") return /* @__PURE__ */ _(bo, {
    index: t.index,
    children: ({ part: s }) => n({
      part: s,
      children: /* @__PURE__ */ _(yo, {})
    })
  }, t.idKey ? `part-${t.idKey}` : `part-${t.index}`);
  const r = e[t.indices.at(-1)]?.status ?? If;
  return /* @__PURE__ */ _(ol, { children: n({
    part: {
      type: t.key,
      status: r,
      indices: t.indices
    },
    children: /* @__PURE__ */ _(Re, { children: t.children.map((s) => _o(s, e, n)) })
  }) }, t.idKey ?? t.nodeKey);
}, xo = ({ groupBy: t, indicator: e = "no-text", children: n }) => {
  const r = P(Ln((o) => o.message.parts)), s = P((o) => o.tools.toolUIs), i = P((o) => e === "never" ? !1 : o.message.status?.type === "running");
  return /* @__PURE__ */ Ae(Re, { children: [Z(() => {
    const o = { toolUIs: s };
    return Cf(r.map((a) => t(a, o) ?? []), r.map((a) => a.type === "tool-call" ? a.toolCallId : void 0));
  }, [
    r,
    t[Tf] ?? t,
    s
  ]).map((o) => _o(o, r, n)), Ef(e, r, i) && n({
    part: { type: "indicator" },
    children: /* @__PURE__ */ _(yo, {})
  })] });
};
xo.displayName = "MessagePrimitive.GroupedParts";
const Af = (t) => {
  const e = v(5), { children: n } = t, r = P(uo);
  if (!r) return null;
  let s;
  e[0] !== n || e[1] !== r ? (s = n(r), e[0] = n, e[1] = r, e[2] = s) : s = e[2];
  let i;
  return e[3] !== s ? (i = /* @__PURE__ */ _(Re, { children: s }), e[3] = s, e[4] = i) : i = e[4], i;
}, So = te(Af);
So.displayName = "MessagePrimitive.Quote";
const wo = (t, e) => {
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
}, Rf = (t) => {
  const e = v(5), { components: n } = t, r = P(Mf);
  if (!r) return null;
  const s = r;
  let i;
  e[0] !== n || e[1] !== s ? (i = wo(n, s), e[0] = n, e[1] = s, e[2] = i) : i = e[2];
  const o = i;
  if (!o) return null;
  let a;
  return e[3] !== o ? (a = /* @__PURE__ */ _(o, {}), e[3] = o, e[4] = a) : a = e[4], a;
}, vo = te((t) => {
  const e = v(5), { index: n, components: r } = t;
  let s;
  e[0] !== r ? (s = /* @__PURE__ */ _(Rf, { components: r }), e[0] = r, e[1] = s) : s = e[1];
  let i;
  return e[2] !== n || e[3] !== s ? (i = /* @__PURE__ */ _(Gi, {
    index: n,
    children: s
  }), e[2] = n, e[3] = s, e[4] = i) : i = e[4], i;
}, (t, e) => t.index === e.index && t.components?.Image === e.components?.Image && t.components?.Document === e.components?.Document && t.components?.File === e.components?.File && t.components?.Attachment === e.components?.Attachment);
vo.displayName = "MessagePrimitive.AttachmentByIndex";
const vs = ({ children: t }) => {
  const e = P((n) => n.message.role !== "user" ? 0 : (n.message.attachments ?? []).length);
  return Z(() => Array.from({ length: e }, (n, r) => /* @__PURE__ */ _(Gi, {
    index: r,
    children: /* @__PURE__ */ _(pn, {
      getItemState: (s) => s.message().attachment({ index: r }).getState(),
      children: (s) => t({ get attachment() {
        return s();
      } })
    })
  }, r)), [e, t]);
}, ko = (t) => {
  const e = v(4), { components: n, children: r } = t;
  if (n) {
    let i;
    return e[0] !== n ? (i = /* @__PURE__ */ _(vs, { children: (o) => {
      const { attachment: a } = o, l = wo(n, a);
      return l ? /* @__PURE__ */ _(l, {}) : null;
    } }), e[0] = n, e[1] = i) : i = e[1], i;
  }
  let s;
  return e[2] !== r ? (s = /* @__PURE__ */ _(vs, { children: r }), e[2] = r, e[3] = s) : s = e[3], s;
};
ko.displayName = "MessagePrimitive.Attachments";
function Mf(t) {
  return t.attachment;
}
const Er = (t) => {
  const { children: e } = t;
  return P(Pf) ? e : null;
};
Er.displayName = "MessagePartPrimitive.InProgress";
function Pf(t) {
  return t.part.status.type === "running";
}
const To = (t) => {
  const e = v(2), { components: n } = t, r = n.Suggestion;
  let s;
  return e[0] !== r ? (s = /* @__PURE__ */ _(r, {}), e[0] = r, e[1] = s) : s = e[1], s;
}, Co = te((t) => {
  const e = v(5), { index: n, components: r } = t;
  let s;
  e[0] !== r ? (s = /* @__PURE__ */ _(To, { components: r }), e[0] = r, e[1] = s) : s = e[1];
  let i;
  return e[2] !== n || e[3] !== s ? (i = /* @__PURE__ */ _(Wi, {
    index: n,
    children: s
  }), e[2] = n, e[3] = s, e[4] = i) : i = e[4], i;
}, (t, e) => t.index === e.index && t.components.Suggestion === e.components.Suggestion);
Co.displayName = "ThreadPrimitive.SuggestionByIndex";
const ks = ({ children: t }) => {
  const e = P((n) => n.suggestions.suggestions.length);
  return Z(() => e === 0 ? null : Array.from({ length: e }, (n, r) => /* @__PURE__ */ _(Wi, {
    index: r,
    children: /* @__PURE__ */ _(pn, {
      getItemState: (s) => s.suggestions().suggestion({ index: r }).getState(),
      children: (s) => t({ get suggestion() {
        return s();
      } })
    })
  }, r)), [e, t]);
}, Io = (t) => {
  const e = v(4), { components: n, children: r } = t;
  if (n) {
    let i;
    return e[0] !== n ? (i = /* @__PURE__ */ _(ks, { children: () => /* @__PURE__ */ _(To, { components: n }) }), e[0] = n, e[1] = i) : i = e[1], i;
  }
  let s;
  return e[2] !== r ? (s = /* @__PURE__ */ _(ks, { children: r }), e[2] = r, e[3] = s) : s = e[3], s;
};
Io.displayName = "ThreadPrimitive.Suggestions";
const Df = te(Io, (t, e) => t.children || e.children ? t.children === e.children : t.components.Suggestion === e.components.Suggestion), Bf = (t) => {
  const e = v(12);
  let n;
  e[0] !== t ? (n = t === void 0 ? {} : t, e[0] = t, e[1] = n) : n = e[1];
  const { copiedDuration: r, copyToClipboard: s } = n, i = r === void 0 ? 3e3 : r, o = H(), a = P(Ff), l = P($f), u = P(Nf), h = P(Lf);
  let c;
  e[2] !== o || e[3] !== h || e[4] !== i || e[5] !== s || e[6] !== u ? (c = () => {
    if (!s) return;
    const x = u ? h : o.message().getCopyText();
    x && Promise.resolve(s(x)).then(() => {
      o.message().setIsCopied(!0), setTimeout(() => o.message().setIsCopied(!1), i);
    }, zf);
  }, e[2] = o, e[3] = h, e[4] = i, e[5] = s, e[6] = u, e[7] = c) : c = e[7];
  const d = c, f = a || !s;
  let p;
  return e[8] !== d || e[9] !== l || e[10] !== f ? (p = {
    copy: d,
    disabled: f,
    isCopied: l
  }, e[8] = d, e[9] = l, e[10] = f, e[11] = p) : p = e[11], p;
};
function Of(t) {
  return t.type === "text" && t.text.length > 0;
}
function Ff(t) {
  return !((t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some(Of));
}
function $f(t) {
  return t.message.isCopied;
}
function Nf(t) {
  return t.composer.isEditing;
}
function Lf(t) {
  return t.composer.text;
}
function zf() {
}
const Vf = () => {
  const t = v(5), e = H(), n = P(Uf);
  let r;
  t[0] !== e ? (r = () => {
    e.composer().beginEdit();
  }, t[0] = e, t[1] = r) : r = t[1];
  const s = r;
  let i;
  return t[2] !== n || t[3] !== s ? (i = {
    edit: s,
    disabled: n
  }, t[2] = n, t[3] = s, t[4] = i) : i = t[4], i;
};
function Uf(t) {
  return t.composer.isEditing;
}
const qf = () => {
  const t = v(5), e = H(), n = P(jf);
  let r;
  t[0] !== e ? (r = () => {
    e.message().reload();
  }, t[0] = e, t[1] = r) : r = t[1];
  const s = r;
  let i;
  return t[2] !== n || t[3] !== s ? (i = {
    reload: s,
    disabled: n
  }, t[2] = n, t[3] = s, t[4] = i) : i = t[4], i;
};
function jf(t) {
  return t.thread.isRunning || t.thread.isDisabled || t.message.role !== "assistant";
}
const Hf = () => {
  const t = v(5), e = H(), n = P(Qf);
  let r;
  t[0] !== e ? (r = () => {
    e.message().submitFeedback({ type: "positive" });
  }, t[0] = e, t[1] = r) : r = t[1];
  const s = r;
  let i;
  return t[2] !== n || t[3] !== s ? (i = {
    submit: s,
    isSubmitted: n
  }, t[2] = n, t[3] = s, t[4] = i) : i = t[4], i;
}, Gf = () => {
  const t = v(5), e = H(), n = P(Wf);
  let r;
  t[0] !== e ? (r = () => {
    e.message().submitFeedback({ type: "negative" });
  }, t[0] = e, t[1] = r) : r = t[1];
  const s = r;
  let i;
  return t[2] !== n || t[3] !== s ? (i = {
    submit: s,
    isSubmitted: n
  }, t[2] = n, t[3] = s, t[4] = i) : i = t[4], i;
};
function Qf(t) {
  return t.message.metadata.submittedFeedback?.type === "positive";
}
function Wf(t) {
  return t.message.metadata.submittedFeedback?.type === "negative";
}
const Yf = () => {
  const t = v(5), e = H(), n = P(Jf);
  let r;
  t[0] !== e ? (r = async () => {
    e.message().speak();
  }, t[0] = e, t[1] = r) : r = t[1];
  const s = r;
  let i;
  return t[2] !== n || t[3] !== s ? (i = {
    speak: s,
    disabled: n
  }, t[2] = n, t[3] = s, t[4] = i) : i = t[4], i;
};
function Kf(t) {
  return t.type === "text" && t.text.length > 0;
}
function Jf(t) {
  return !((t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some(Kf));
}
const Xf = () => {
  const t = v(5), e = H(), n = P(Zf);
  let r;
  t[0] !== e ? (r = () => {
    e.message().stopSpeaking();
  }, t[0] = e, t[1] = r) : r = t[1];
  const s = r;
  let i;
  return t[2] !== n || t[3] !== s ? (i = {
    stopSpeaking: s,
    disabled: n
  }, t[2] = n, t[3] = s, t[4] = i) : i = t[4], i;
};
function Zf(t) {
  return t.message.speech == null;
}
const ep = (t) => {
  const e = v(8), { prompt: n, send: r, clearComposer: s } = t, i = s === void 0 ? !0 : s, o = H(), a = P(tp), l = r ?? !1;
  let u;
  e[0] !== o || e[1] !== i || e[2] !== n || e[3] !== l ? (u = () => {
    const d = o.thread().getState().isRunning;
    if (l && !d)
      o.thread().append({
        content: [{
          type: "text",
          text: n
        }],
        runConfig: o.composer().getState().runConfig
      }), i && o.composer().setText("");
    else if (i) o.composer().setText(n);
    else {
      const f = o.composer().getState().text;
      o.composer().setText(f.trim() ? `${f} ${n}` : n);
    }
  }, e[0] = o, e[1] = i, e[2] = n, e[3] = l, e[4] = u) : u = e[4];
  const h = u;
  let c;
  return e[5] !== a || e[6] !== h ? (c = {
    trigger: h,
    disabled: a
  }, e[5] = a, e[6] = h, e[7] = c) : c = e[7], c;
};
function tp(t) {
  return t.thread.isDisabled;
}
const np = () => P(rp);
function rp(t) {
  if (t.message.status?.type !== "incomplete" || t.message.status.reason !== "error") return;
  const e = t.message.status.error;
  return typeof e == "string" ? e : typeof e == "object" && e !== null && "message" in e && typeof e.message == "string" ? e.message : e ?? "An error occurred";
}
const sp = (t) => {
  const { cloud: e, initialMessages: n, maxSteps: r, adapters: s, unstable_humanToolNames: i, unstable_enableMessageQueue: o, ...a } = t;
  return {
    localRuntimeOptions: {
      cloud: e,
      initialMessages: n,
      maxSteps: r,
      adapters: s,
      unstable_humanToolNames: i,
      unstable_enableMessageQueue: o
    },
    otherOptions: a
  };
};
function ip(t, e) {
  function n(r) {
    const s = Rt(t);
    if (!r?.optional && !s) throw new Error(`This component must be used within ${e}.`);
    return s;
  }
  return n;
}
function Eo(t, e) {
  function n(s) {
    const i = t(s);
    return i ? i[e] : null;
  }
  function r(s) {
    let i = !1, o;
    typeof s == "function" ? o = s : s && typeof s == "object" && (i = !!s.optional, o = s.selector);
    const a = n({ optional: i });
    return a ? o ? a(o) : a() : null;
  }
  return {
    [e]: r,
    [`${e}Store`]: n
  };
}
const Ao = Fe(null), { useThreadViewport: Xe, useThreadViewportStore: Ze } = Eo(ip(Ao, "ThreadPrimitive.Viewport"), "useThreadViewport"), Ts = (t) => {
  const e = /* @__PURE__ */ new Map(), n = () => {
    let r = 0;
    for (const s of e.values()) r += s;
    t(r);
  };
  return { register: () => {
    const r = /* @__PURE__ */ Symbol();
    return e.set(r, 0), {
      setHeight: (s) => {
        e.get(r) !== s && (e.set(r, s), n());
      },
      unregister: () => {
        e.delete(r), n();
      }
    };
  } };
}, op = (t = {}) => {
  const e = /* @__PURE__ */ new Set(), n = Ts((o) => {
    i.setState({ height: {
      ...i.getState().height,
      viewport: o
    } });
  }), r = Ts((o) => {
    i.setState({ height: {
      ...i.getState().height,
      inset: o
    } });
  }), s = (o, a) => (i.setState({ element: {
    ...i.getState().element,
    [o]: a
  } }), () => {
    i.getState().element[o] === a && i.setState({ element: {
      ...i.getState().element,
      [o]: null
    } });
  }), i = Ws(() => ({
    isAtBottom: !0,
    scrollToBottom: ({ behavior: o = "auto" } = {}) => {
      for (const a of e) a({ behavior: o });
    },
    onScrollToBottom: (o) => (e.add(o), () => {
      e.delete(o);
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
    registerViewport: n.register,
    registerContentInset: r.register,
    registerViewportElement: (o) => s("viewport", o),
    registerAnchorElement: (o) => s("anchor", o),
    registerAnchorTargetElement: (o, a) => (i.setState({
      element: {
        ...i.getState().element,
        target: o
      },
      targetConfig: o && a ? a : null
    }), () => {
      i.getState().element.target === o && i.setState({
        element: {
          ...i.getState().element,
          target: null
        },
        targetConfig: null
      });
    }),
    setTopAnchorTurn: (o) => {
      i.setState({ topAnchorTurn: o });
    }
  }));
  return i;
}, sn = (t) => t, ap = (t) => {
  const e = v(11);
  let n;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (n = { optional: !0 }, e[0] = n) : n = e[0];
  const r = Ze(n);
  let s;
  e[1] !== t ? (s = () => op(t), e[1] = t, e[2] = s) : s = e[2];
  const [i] = J(s);
  let o, a;
  e[3] !== r || e[4] !== i ? (o = () => r?.getState().onScrollToBottom(() => {
    i.getState().scrollToBottom();
  }), a = [r, i], e[3] = r, e[4] = i, e[5] = o, e[6] = a) : (o = e[5], a = e[6]), q(o, a);
  let l, u;
  return e[7] !== r || e[8] !== i ? (l = () => {
    if (r)
      return i.subscribe((h) => {
        r.getState().isAtBottom !== h.isAtBottom && sn(r).setState({ isAtBottom: h.isAtBottom });
      });
  }, u = [i, r], e[7] = r, e[8] = i, e[9] = l, e[10] = u) : (l = e[9], u = e[10]), q(l, u), i;
}, Ar = (t) => {
  const e = v(7), { children: n, options: r } = t;
  let s;
  e[0] !== r ? (s = r === void 0 ? {} : r, e[0] = r, e[1] = s) : s = e[1];
  const i = ap(s);
  let o;
  e[2] !== i ? (o = () => ({ useThreadViewport: i }), e[2] = i, e[3] = o) : o = e[3];
  const [a] = J(o);
  let l;
  return e[4] !== n || e[5] !== a ? (l = /* @__PURE__ */ _(Ao.Provider, {
    value: a,
    children: n
  }), e[4] = n, e[5] = a, e[6] = l) : l = e[6], l;
}, lp = () => {
  const t = v(3), e = H();
  let n, r;
  return t[0] !== e ? (n = () => {
  }, r = [e], t[0] = e, t[1] = n, t[2] = r) : (n = t[1], r = t[2]), q(n, r), null;
}, up = (t) => {
  const e = v(7), { children: n, aui: r, runtime: s } = t, i = r ?? null;
  let o;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (o = /* @__PURE__ */ _(lp, {}), e[0] = o) : o = e[0];
  let a;
  e[1] !== n ? (a = /* @__PURE__ */ _(Ar, { children: n }), e[1] = n, e[2] = a) : a = e[2];
  let l;
  return e[3] !== s || e[4] !== i || e[5] !== a ? (l = /* @__PURE__ */ Ae(Kc, {
    runtime: s,
    aui: i,
    children: [o, a]
  }), e[3] = s, e[4] = i, e[5] = a, e[6] = l) : l = e[6], l;
}, H_ = te(up);
var Cs = Object.defineProperty, bn = (t, e) => {
  let n = {};
  for (var r in t) Cs(n, r, {
    get: t[r],
    enumerable: !0
  });
  return Cs(n, Symbol.toStringTag, { value: "Module" }), n;
};
const cp = [
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
function hp(t) {
  const e = ne((n, r) => {
    const s = v(17);
    let i, o, a, l;
    s[0] !== n ? ({ render: a, asChild: i, children: o, ...l } = n, s[0] = n, s[1] = i, s[2] = o, s[3] = a, s[4] = l) : (i = s[1], o = s[2], a = s[3], l = s[4]);
    const u = t;
    if (a && al(a)) {
      const d = o !== void 0 ? o : a.props.children, f = l;
      let p;
      s[5] !== a || s[6] !== d ? (p = ll(a, void 0, d), s[5] = a, s[6] = d, s[7] = p) : p = s[7];
      let x;
      return s[8] !== r || s[9] !== f || s[10] !== p ? (x = /* @__PURE__ */ _(u, {
        ...f,
        asChild: !0,
        ref: r,
        children: p
      }), s[8] = r, s[9] = f, s[10] = p, s[11] = x) : x = s[11], x;
    }
    const h = l;
    let c;
    return s[12] !== i || s[13] !== o || s[14] !== r || s[15] !== h ? (c = /* @__PURE__ */ _(u, {
      ...h,
      asChild: i,
      ref: r,
      children: o
    }), s[12] = i, s[13] = o, s[14] = r, s[15] = h, s[16] = c) : c = s[16], c;
  });
  return e.displayName = typeof t == "string" ? t : t.displayName ?? t.name ?? "Component", e;
}
function dp(t) {
  const e = dl[t], n = hp(e);
  return n.displayName = `Primitive.${t}`, n;
}
const le = cp.reduce((t, e) => (t[e] = dp(e), t), {}), fp = (t) => {
  const e = v(5), { hideWhenRunning: n, autohide: r, autohideFloat: s, forceVisible: i } = t;
  let o;
  return e[0] !== r || e[1] !== s || e[2] !== i || e[3] !== n ? (o = (a) => {
    if (n && a.thread.isRunning) return "hidden";
    const l = r === "always" || r === "not-last" && !a.message.isLast, u = i || a.message.isHovering;
    return l ? u ? s === "always" || s === "single-branch" && a.message.branchCount <= 1 ? "floating" : "normal" : "hidden" : "normal";
  }, e[0] = r, e[1] = s, e[2] = i, e[3] = n, e[4] = o) : o = e[4], P(o);
}, pp = Fe(null), Ro = ne((t, e) => {
  const n = v(18);
  let r, s, i, o;
  n[0] !== t ? ({ hideWhenRunning: i, autohide: r, autohideFloat: s, ...o } = t, n[0] = t, n[1] = r, n[2] = s, n[3] = i, n[4] = o) : (r = n[1], s = n[2], i = n[3], o = n[4]);
  const [a, l] = J(0);
  let u;
  n[5] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (u = () => {
    let T = !1;
    return l(mp), () => {
      T || (T = !0, l(gp));
    };
  }, n[5] = u) : u = n[5];
  const h = u;
  let c;
  n[6] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (c = { acquireInteractionLock: h }, n[6] = c) : c = n[6];
  const d = c, f = a > 0;
  let p;
  n[7] !== r || n[8] !== s || n[9] !== i || n[10] !== f ? (p = {
    hideWhenRunning: i,
    autohide: r,
    autohideFloat: s,
    forceVisible: f
  }, n[7] = r, n[8] = s, n[9] = i, n[10] = f, n[11] = p) : p = n[11];
  const x = fp(p);
  if (x === "hidden") return null;
  let S;
  n[12] !== x ? (S = x === "floating" ? { "data-floating": "true" } : null, n[12] = x, n[13] = S) : S = n[13];
  let y;
  return n[14] !== e || n[15] !== o || n[16] !== S ? (y = /* @__PURE__ */ _(pp.Provider, {
    value: d,
    children: /* @__PURE__ */ _(le.div, {
      ...S,
      ...o,
      ref: e
    })
  }), n[14] = e, n[15] = o, n[16] = S, n[17] = y) : y = n[17], y;
});
Ro.displayName = "ActionBarPrimitive.Root";
function mp(t) {
  return t + 1;
}
function gp(t) {
  return Math.max(0, t - 1);
}
const bp = (t) => {
  const e = v(4);
  let n;
  e[0] !== t ? (n = t === void 0 ? {} : t, e[0] = t, e[1] = n) : n = e[1];
  const { copiedDuration: r } = n, s = r === void 0 ? 3e3 : r;
  let i;
  e[2] !== s ? (i = {
    copiedDuration: s,
    copyToClipboard: yp
  }, e[2] = s, e[3] = i) : i = e[3];
  const { copy: o, disabled: a } = Bf(i);
  return a ? null : o;
}, Mo = ne((t, e) => {
  const n = v(20);
  let r, s, i, o;
  n[0] !== t ? ({ copiedDuration: r, onClick: i, disabled: s, ...o } = t, n[0] = t, n[1] = r, n[2] = s, n[3] = i, n[4] = o) : (r = n[1], s = n[2], i = n[3], o = n[4]);
  const a = P(_p);
  let l;
  n[5] !== r ? (l = { copiedDuration: r }, n[5] = r, n[6] = l) : l = n[6];
  const u = bp(l);
  let h;
  n[7] !== a ? (h = a ? { "data-copied": "true" } : {}, n[7] = a, n[8] = h) : h = n[8];
  const c = s || !u;
  let d;
  n[9] !== u ? (d = () => {
    u?.();
  }, n[9] = u, n[10] = d) : d = n[10];
  let f;
  n[11] !== i || n[12] !== d ? (f = ct(i, d), n[11] = i, n[12] = d, n[13] = f) : f = n[13];
  let p;
  return n[14] !== e || n[15] !== o || n[16] !== h || n[17] !== c || n[18] !== f ? (p = /* @__PURE__ */ _(le.button, {
    type: "button",
    ...h,
    ...o,
    ref: e,
    disabled: c,
    onClick: f
  }), n[14] = e, n[15] = o, n[16] = h, n[17] = c, n[18] = f, n[19] = p) : p = n[19], p;
});
Mo.displayName = "ActionBarPrimitive.Copy";
function yp(t) {
  return typeof navigator > "u" || !navigator.clipboard ? Promise.reject(/* @__PURE__ */ new Error("Clipboard API is unavailable")) : navigator.clipboard.writeText(t);
}
function _p(t) {
  return t.message.isCopied;
}
const Pt = (t, e, n = []) => {
  const r = ne((s, i) => {
    const o = v(6), a = {}, l = {};
    Object.keys(s).forEach((x) => {
      n.includes(x) ? a[x] = s[x] : l[x] = s[x];
    });
    const u = e(a) ?? void 0, h = le, c = "button", d = l.disabled || !u, f = ct(l.onClick, u);
    let p;
    return o[0] !== i || o[1] !== l || o[2] !== h.button || o[3] !== d || o[4] !== f ? (p = /* @__PURE__ */ _(h.button, {
      ...l,
      type: c,
      ref: i,
      disabled: d,
      onClick: f
    }), o[0] = i, o[1] = l, o[2] = h.button, o[3] = d, o[4] = f, o[5] = p) : p = o[5], p;
  });
  return r.displayName = t, r;
}, xp = () => {
  const { disabled: t, reload: e } = qf();
  return t ? null : e;
}, Sp = Pt("ActionBarPrimitive.Reload", xp), wp = () => {
  const { disabled: t, edit: e } = Vf();
  return t ? null : e;
}, vp = Pt("ActionBarPrimitive.Edit", wp), kp = () => {
  const { disabled: t, speak: e } = Yf();
  return t ? null : e;
}, Tp = Pt("ActionBarPrimitive.Speak", kp), Cp = () => {
  const { disabled: t, stopSpeaking: e } = Xf();
  return t ? null : e;
}, Po = ne((t, e) => {
  const n = v(12), r = Cp();
  let s;
  n[0] !== r ? (s = (u) => {
    r && (u.preventDefault(), r());
  }, n[0] = r, n[1] = s) : s = n[1], fl(s);
  const i = !r;
  let o;
  n[2] !== r ? (o = () => {
    r?.();
  }, n[2] = r, n[3] = o) : o = n[3];
  let a;
  n[4] !== t.onClick || n[5] !== o ? (a = ct(t.onClick, o), n[4] = t.onClick, n[5] = o, n[6] = a) : a = n[6];
  let l;
  return n[7] !== t || n[8] !== e || n[9] !== i || n[10] !== a ? (l = /* @__PURE__ */ _(le.button, {
    type: "button",
    disabled: i,
    ...t,
    ref: e,
    onClick: a
  }), n[7] = t, n[8] = e, n[9] = i, n[10] = a, n[11] = l) : l = n[11], l;
});
Po.displayName = "ActionBarPrimitive.StopSpeaking";
const Ip = () => {
  const { submit: t } = Hf();
  return t;
}, Do = ne((t, e) => {
  const n = v(17);
  let r, s, i;
  n[0] !== t ? ({ onClick: s, disabled: r, ...i } = t, n[0] = t, n[1] = r, n[2] = s, n[3] = i) : (r = n[1], s = n[2], i = n[3]);
  const o = P(Ep), a = Ip();
  let l;
  n[4] !== o ? (l = o ? { "data-submitted": "true" } : {}, n[4] = o, n[5] = l) : l = n[5];
  const u = r || !a;
  let h;
  n[6] !== a ? (h = () => {
    a?.();
  }, n[6] = a, n[7] = h) : h = n[7];
  let c;
  n[8] !== s || n[9] !== h ? (c = ct(s, h), n[8] = s, n[9] = h, n[10] = c) : c = n[10];
  let d;
  return n[11] !== e || n[12] !== i || n[13] !== l || n[14] !== u || n[15] !== c ? (d = /* @__PURE__ */ _(le.button, {
    type: "button",
    ...l,
    ...i,
    ref: e,
    disabled: u,
    onClick: c
  }), n[11] = e, n[12] = i, n[13] = l, n[14] = u, n[15] = c, n[16] = d) : d = n[16], d;
});
Do.displayName = "ActionBarPrimitive.FeedbackPositive";
function Ep(t) {
  return t.message.metadata.submittedFeedback?.type === "positive";
}
const Ap = () => {
  const { submit: t } = Gf();
  return t;
}, Bo = ne((t, e) => {
  const n = v(17);
  let r, s, i;
  n[0] !== t ? ({ onClick: s, disabled: r, ...i } = t, n[0] = t, n[1] = r, n[2] = s, n[3] = i) : (r = n[1], s = n[2], i = n[3]);
  const o = P(Rp), a = Ap();
  let l;
  n[4] !== o ? (l = o ? { "data-submitted": "true" } : {}, n[4] = o, n[5] = l) : l = n[5];
  const u = r || !a;
  let h;
  n[6] !== a ? (h = () => {
    a?.();
  }, n[6] = a, n[7] = h) : h = n[7];
  let c;
  n[8] !== s || n[9] !== h ? (c = ct(s, h), n[8] = s, n[9] = h, n[10] = c) : c = n[10];
  let d;
  return n[11] !== e || n[12] !== i || n[13] !== l || n[14] !== u || n[15] !== c ? (d = /* @__PURE__ */ _(le.button, {
    type: "button",
    ...l,
    ...i,
    ref: e,
    disabled: u,
    onClick: c
  }), n[11] = e, n[12] = i, n[13] = l, n[14] = u, n[15] = c, n[16] = d) : d = n[16], d;
});
Bo.displayName = "ActionBarPrimitive.FeedbackNegative";
function Rp(t) {
  return t.message.metadata.submittedFeedback?.type === "negative";
}
const Mp = (t) => {
  const e = v(6);
  let n;
  e[0] !== t ? (n = t === void 0 ? {} : t, e[0] = t, e[1] = n) : n = e[1];
  const { filename: r, onExport: s } = n, i = H(), o = P(Dp);
  let a;
  e[2] !== i || e[3] !== r || e[4] !== s ? (a = async () => {
    const u = i.message().getCopyText();
    if (!u) return;
    if (s) {
      await s(u);
      return;
    }
    const h = new Blob([u], { type: "text/markdown" }), c = URL.createObjectURL(h), d = document.createElement("a");
    d.href = c, d.download = r ?? `message-${Date.now()}.md`, d.click(), URL.revokeObjectURL(c);
  }, e[2] = i, e[3] = r, e[4] = s, e[5] = a) : a = e[5];
  const l = a;
  return o ? l : null;
}, Oo = ne((t, e) => {
  const n = v(19);
  let r, s, i, o, a;
  n[0] !== t ? ({ filename: s, onExport: o, onClick: i, disabled: r, ...a } = t, n[0] = t, n[1] = r, n[2] = s, n[3] = i, n[4] = o, n[5] = a) : (r = n[1], s = n[2], i = n[3], o = n[4], a = n[5]);
  let l;
  n[6] !== s || n[7] !== o ? (l = {
    filename: s,
    onExport: o
  }, n[6] = s, n[7] = o, n[8] = l) : l = n[8];
  const u = Mp(l), h = r || !u;
  let c;
  n[9] !== u ? (c = () => {
    u?.();
  }, n[9] = u, n[10] = c) : c = n[10];
  let d;
  n[11] !== i || n[12] !== c ? (d = ct(i, c), n[11] = i, n[12] = c, n[13] = d) : d = n[13];
  let f;
  return n[14] !== e || n[15] !== a || n[16] !== h || n[17] !== d ? (f = /* @__PURE__ */ _(le.button, {
    type: "button",
    ...a,
    ref: e,
    disabled: h,
    onClick: d
  }), n[14] = e, n[15] = a, n[16] = h, n[17] = d, n[18] = f) : f = n[18], f;
});
Oo.displayName = "ActionBarPrimitive.ExportMarkdown";
function Pp(t) {
  return t.type === "text" && t.text.length > 0;
}
function Dp(t) {
  return (t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some(Pp);
}
var G_ = /* @__PURE__ */ bn({
  Copy: () => Mo,
  Edit: () => vp,
  ExportMarkdown: () => Oo,
  FeedbackNegative: () => Bo,
  FeedbackPositive: () => Do,
  Reload: () => Sp,
  Root: () => Ro,
  Speak: () => Tp,
  StopSpeaking: () => Po
});
const Bp = (t) => {
  const e = v(12);
  let n;
  return e[0] !== t.assistant || e[1] !== t.copied || e[2] !== t.hasAttachments || e[3] !== t.hasBranches || e[4] !== t.hasContent || e[5] !== t.last || e[6] !== t.lastOrHover || e[7] !== t.speaking || e[8] !== t.submittedFeedback || e[9] !== t.system || e[10] !== t.user ? (n = (r) => {
    const { role: s, attachments: i, parts: o, branchCount: a, isLast: l, speech: u, isCopied: h, isHovering: c } = r.message;
    return !(t.hasBranches === !0 && a < 2 || t.user && s !== "user" || t.assistant && s !== "assistant" || t.system && s !== "system" || t.lastOrHover === !0 && !c && !l || t.last !== void 0 && t.last !== l || t.copied === !0 && !h || t.copied === !1 && h || t.speaking === !0 && u == null || t.speaking === !1 && u != null || t.hasAttachments === !0 && (s !== "user" || !i?.length) || t.hasAttachments === !1 && s === "user" && i?.length || t.hasContent === !0 && o.length === 0 || t.hasContent === !1 && o.length > 0 || t.submittedFeedback !== void 0 && (r.message.metadata.submittedFeedback?.type ?? null) !== t.submittedFeedback);
  }, e[0] = t.assistant, e[1] = t.copied, e[2] = t.hasAttachments, e[3] = t.hasBranches, e[4] = t.hasContent, e[5] = t.last, e[6] = t.lastOrHover, e[7] = t.speaking, e[8] = t.submittedFeedback, e[9] = t.system, e[10] = t.user, e[11] = n) : n = e[11], P(n);
}, Fo = (t) => {
  const e = v(3);
  let n, r;
  return e[0] !== t ? ({ children: n, ...r } = t, e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]), Bp(r) ? n : null;
};
Fo.displayName = "MessagePrimitive.If";
const Op = Fe(null), Fp = () => Rt(Op), $p = (t) => {
  const e = v(4), n = ot(t), r = Xe(Np);
  let s, i;
  e[0] !== n || e[1] !== r ? (s = () => r(n), i = [r, n], e[0] = n, e[1] = r, e[2] = s, e[3] = i) : (s = e[2], i = e[3]), q(s, i);
};
function Np(t) {
  return t.onScrollToBottom;
}
const Lp = () => !1, zp = () => {
}, Vp = (t) => {
  const e = v(4);
  let n;
  e[0] !== t ? (n = (i) => {
    if (typeof window > "u" || t === null || !window.matchMedia) return zp;
    const o = window.matchMedia(t);
    return o.addEventListener("change", i), () => o.removeEventListener("change", i);
  }, e[0] = t, e[1] = n) : n = e[1];
  const r = n;
  let s;
  return e[2] !== t ? (s = () => typeof window > "u" || t === null || !window.matchMedia ? !1 : window.matchMedia(t).matches, e[2] = t, e[3] = s) : s = e[3], hr(r, s, Lp);
}, $o = () => P(Up);
function Up(t) {
  if (t.part.type !== "text" && t.part.type !== "reasoning") throw new Error("MessagePartText can only be used inside text or reasoning message parts.");
  return t.part;
}
const No = Fe(null), qp = (t) => ({ useSmoothStatus: Ws(() => t) }), jp = (t) => {
  const e = v(6), { children: n } = t;
  let r;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (r = { optional: !0 }, e[0] = r) : r = e[0];
  const s = Lo(r), i = H();
  let o;
  e[1] !== i ? (o = () => qp(i.part().getState().status), e[1] = i, e[2] = o) : o = e[2];
  const [a] = J(o);
  if (s) return n;
  let l;
  return e[3] !== n || e[4] !== a ? (l = /* @__PURE__ */ _(No.Provider, {
    value: a,
    children: n
  }), e[3] = n, e[4] = a, e[5] = l) : l = e[5], l;
}, Hp = (t) => {
  const e = ne((n, r) => {
    const s = v(3), i = n;
    let o;
    return s[0] !== r || s[1] !== i ? (o = /* @__PURE__ */ _(jp, { children: /* @__PURE__ */ _(t, {
      ...i,
      ref: r
    }) }), s[0] = r, s[1] = i, s[2] = o) : o = s[2], o;
  });
  return e.displayName = t.displayName, e;
};
function Lo(t) {
  const e = Rt(No);
  if (!t?.optional && !e) throw new Error("This component must be used within a SmoothContextProvider.");
  return e;
}
const { useSmoothStatus: Gp, useSmoothStatusStore: Qp } = Eo(Lo, "useSmoothStatus"), zo = 250, Vo = 5;
var Wp = class {
  currentText;
  setText;
  animationFrameId = null;
  lastUpdateTime = Date.now();
  lastCommitTime = 0;
  targetText = "";
  drainMs = zo;
  maxCharIntervalMs = Vo;
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
    const n = this.targetText.length - this.currentText.length, r = Math.min(this.maxCharIntervalMs, this.drainMs / n), s = Math.min(n, this.maxCharsPerFrame);
    let i = 0;
    for (; e >= r && i < s; )
      i++, e -= r;
    i === s && s === this.maxCharsPerFrame && (e = 0), i !== n ? this.animationFrameId = requestAnimationFrame(this.animate) : this.animationFrameId = null, i !== 0 && (this.currentText = this.targetText.slice(0, this.currentText.length + i), this.lastUpdateTime = t - e, (i === n || t - this.lastCommitTime >= this.minCommitMs) && (this.lastCommitTime = t, this.setText(this.currentText)));
  };
};
const Pn = Object.freeze({ type: "running" }), zt = (t, e) => t !== void 0 && t > 0 ? t : e, Uo = (t, e = !1) => {
  const { text: n } = t, r = Vp("(prefers-reduced-motion: reduce)"), s = typeof e == "object" && e !== null ? e : void 0, i = e !== !1 && e !== null && !r, o = zt(s?.drainMs, zo), a = zt(s?.maxCharIntervalMs, Vo), l = zt(s?.maxCharsPerFrame, 1 / 0), u = zt(s?.minCommitMs, 0), [h, c] = J(t.status.type === "running" ? "" : n), d = H(), f = P(() => d.part()), [p, x] = J(f);
  (f !== p || !n.startsWith(h)) && (x(f), c(t.status.type === "running" ? "" : n));
  const S = Qp({ optional: !0 }), y = ot((C) => {
    if (c(C), S) {
      const I = h !== C || t.status.type === "running" ? Pn : t.status;
      sn(S).setState(I, !0);
    }
  });
  q(() => {
    if (S) {
      const C = i && (h !== n || t.status.type === "running") ? Pn : t.status;
      sn(S).setState(C, !0);
    }
  }, [
    S,
    i,
    n,
    h,
    t.status
  ]);
  const [T] = J(new Wp(h, y));
  q(() => {
    T.drainMs = o, T.maxCharIntervalMs = a, T.maxCharsPerFrame = l, T.minCommitMs = u;
  }, [
    T,
    o,
    a,
    l,
    u
  ]);
  const R = X(f);
  return q(() => {
    if (!i) {
      T.stop();
      return;
    }
    const C = R.current !== f;
    if (R.current = f, C || !n.startsWith(T.targetText)) {
      t.status.type === "running" ? (T.currentText = "", T.targetText = n, T.lastCommitTime = 0, T.start()) : (T.currentText = n, T.targetText = n, T.stop());
      return;
    }
    T.targetText = n, T.start();
  }, [
    T,
    i,
    n,
    t.status.type,
    f
  ]), q(() => () => {
    T.stop();
  }, [T]), Z(() => i ? {
    ...t,
    text: h,
    status: n === h ? t.status : Pn
  } : t, [
    i,
    h,
    t,
    n
  ]);
}, Yp = () => P(Kp);
function Kp(t) {
  if (t.part.type !== "image") throw new Error("MessagePartImage can only be used inside image message parts.");
  return t.part;
}
const Rr = ne((t, e) => {
  const n = v(10);
  let r, s, i;
  n[0] !== t ? ({ smooth: s, component: i, ...r } = t, n[0] = t, n[1] = r, n[2] = s, n[3] = i) : (r = n[1], s = n[2], i = n[3]);
  const o = s === void 0 ? !0 : s, a = i === void 0 ? "span" : i, { text: l, status: u } = Uo($o(), o);
  let h;
  return n[4] !== a || n[5] !== e || n[6] !== r || n[7] !== u.type || n[8] !== l ? (h = /* @__PURE__ */ _(a, {
    "data-status": u.type,
    ...r,
    ref: e,
    children: l
  }), n[4] = a, n[5] = e, n[6] = r, n[7] = u.type, n[8] = l, n[9] = h) : h = n[9], h;
});
Rr.displayName = "MessagePartPrimitive.Text";
const Mr = ne((t, e) => {
  const n = v(4), { image: r } = Yp();
  let s;
  return n[0] !== e || n[1] !== r || n[2] !== t ? (s = /* @__PURE__ */ _(le.img, {
    src: r,
    ...t,
    ref: e
  }), n[0] = e, n[1] = r, n[2] = t, n[3] = s) : s = n[3], s;
});
Mr.displayName = "MessagePartPrimitive.Image";
const et = (t) => {
  const e = v(2), n = X(void 0);
  let r;
  return e[0] !== t ? (r = (s) => {
    n.current && (n.current(), n.current = void 0), s && (n.current = t(s));
  }, e[0] = t, e[1] = r) : r = e[1], r;
}, Is = (t, e) => {
  const n = t.trim().match(/^(\d+(?:\.\d+)?|\.\d+)(em|px|rem)$/);
  if (!n) return Number.POSITIVE_INFINITY;
  const r = Number(n[1]), s = n[2];
  return s === "px" ? r : s === "em" ? r * (parseFloat(getComputedStyle(e).fontSize) || 16) : s === "rem" ? r * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) : Number.POSITIVE_INFINITY;
}, Jp = (t) => t.dataset.messageId, Xp = () => {
  const t = document.createElement("div");
  return t.dataset.auiTopAnchorReserve = "", t.style.height = "0px", t.style.flexShrink = "0", t.style.pointerEvents = "none", t.setAttribute("aria-hidden", "true"), t;
}, Es = (t, e) => {
  const n = `${e}px`;
  return t.style.height !== n ? (t.style.height = n, !0) : !1;
}, Zp = (t) => {
  const e = window.devicePixelRatio || 1;
  return Math.round(t * e) / e;
}, qo = () => {
  const t = v(4), e = H();
  let n;
  t[0] !== e ? (n = () => e.message(), t[0] = e, t[1] = n) : n = t[1];
  const r = P(n);
  let s;
  return t[2] !== r ? (s = (i) => {
    const o = () => {
      r.setIsHovering(!0);
    }, a = () => {
      r.setIsHovering(!1);
    };
    return i.addEventListener("mouseenter", o), i.addEventListener("mouseleave", a), i.matches(":hover") && queueMicrotask(() => r.setIsHovering(!0)), () => {
      i.removeEventListener("mouseenter", o), i.removeEventListener("mouseleave", a), r.setIsHovering(!1);
    };
  }, t[2] = r, t[3] = s) : s = t[3], et(s);
}, em = () => {
  const t = v(2), e = Xe(om);
  let n;
  return t[0] !== e ? (n = (r) => r.message.role === "user" && r.message.index > 0 && r.message.index === r.thread.messages.length - 2 && r.thread.messages.at(-1)?.role === "assistant" && (r.message.id === e || r.thread.isRunning), t[0] = e, t[1] = n) : n = t[1], P(n);
}, tm = () => {
  const t = v(2), e = Xe(am);
  let n;
  return t[0] !== e ? (n = (r) => r.message.isLast && r.message.role === "assistant" && r.message.index >= 1 && r.thread.messages.at(r.message.index - 1)?.role === "user" && (r.message.id === e || r.thread.isRunning), t[0] = e, t[1] = n) : n = t[1], P(n);
}, nm = (t, e) => {
  const n = v(3);
  let r;
  return n[0] !== t || n[1] !== e ? (r = (s) => {
    if (t)
      return e.getState().registerAnchorElement(s);
  }, n[0] = t, n[1] = e, n[2] = r) : r = n[2], et(r);
}, rm = (t) => {
  const e = v(3), { active: n, threadViewportStore: r } = t;
  let s;
  return e[0] !== n || e[1] !== r ? (s = (i) => {
    if (!n) return;
    const o = r.getState(), a = o.topAnchorMessageClamp;
    return o.registerAnchorTargetElement(i, {
      tallerThan: Is(a.tallerThan, i),
      visibleHeight: Is(a.visibleHeight, i)
    });
  }, e[0] = n, e[1] = r, e[2] = s) : s = e[2], et(s);
}, sm = (t) => {
  const e = v(7);
  let n, r;
  e[0] !== t ? ({ forwardedRef: n, ...r } = t, e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]);
  const s = qo(), i = Et(n, s), o = P(lm);
  let a;
  return e[3] !== o || e[4] !== r || e[5] !== i ? (a = /* @__PURE__ */ _(le.div, {
    ...r,
    ref: i,
    "data-message-id": o
  }), e[3] = o, e[4] = r, e[5] = i, e[6] = a) : a = e[6], a;
}, im = (t) => {
  const e = v(13);
  let n, r, s;
  e[0] !== t ? ({ forwardedRef: n, threadViewportStore: s, ...r } = t, e[0] = t, e[1] = n, e[2] = r, e[3] = s) : (n = e[1], r = e[2], s = e[3]);
  const i = qo(), o = em(), a = tm(), l = nm(o, s);
  let u;
  e[4] !== a || e[5] !== s ? (u = {
    active: a,
    threadViewportStore: s
  }, e[4] = a, e[5] = s, e[6] = u) : u = e[6];
  const h = rm(u), c = Et(n, i, l, h), d = P(um), f = o ? "" : void 0, p = a ? "" : void 0;
  let x;
  return e[7] !== d || e[8] !== r || e[9] !== c || e[10] !== f || e[11] !== p ? (x = /* @__PURE__ */ _(le.div, {
    ...r,
    ref: c,
    "data-message-id": d,
    "data-aui-top-anchor-user": f,
    "data-aui-top-anchor-target": p
  }), e[7] = d, e[8] = r, e[9] = c, e[10] = f, e[11] = p, e[12] = x) : x = e[12], x;
}, jo = ne((t, e) => {
  const n = v(7), r = Ze();
  if (r.getState().turnAnchor === "top") {
    let i;
    return n[0] !== e || n[1] !== t || n[2] !== r ? (i = /* @__PURE__ */ _(im, {
      ...t,
      forwardedRef: e,
      threadViewportStore: r
    }), n[0] = e, n[1] = t, n[2] = r, n[3] = i) : i = n[3], i;
  }
  let s;
  return n[4] !== e || n[5] !== t ? (s = /* @__PURE__ */ _(sm, {
    ...t,
    forwardedRef: e
  }), n[4] = e, n[5] = t, n[6] = s) : s = n[6], s;
});
jo.displayName = "MessagePrimitive.Root";
function om(t) {
  return t.topAnchorTurn?.anchorId;
}
function am(t) {
  return t.topAnchorTurn?.targetId;
}
function lm(t) {
  return t.message.id;
}
function um(t) {
  return t.message.id;
}
const Dn = {
  ...re,
  Text: () => /* @__PURE__ */ Ae("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ _(Rr, {}), /* @__PURE__ */ _(Er, { children: /* @__PURE__ */ _("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Image: () => /* @__PURE__ */ _(Mr, {})
}, Yn = (t) => {
  const e = v(10);
  if ("children" in t) {
    let a;
    return e[0] !== t.children ? (a = /* @__PURE__ */ _(Wn, { children: t.children }), e[0] = t.children, e[1] = a) : a = e[1], a;
  }
  let n, r;
  e[2] !== t ? ({ components: n, ...r } = t, e[2] = t, e[3] = n, e[4] = r) : (n = e[3], r = e[4]);
  let s;
  e[5] !== n ? (s = n ? {
    Text: n.Text ?? Dn.Text,
    Image: n.Image ?? Dn.Image,
    Reasoning: n.Reasoning ?? re.Reasoning,
    Source: n.Source ?? re.Source,
    File: n.File ?? re.File,
    Unstable_Audio: n.Unstable_Audio ?? re.Unstable_Audio,
    ..."ChainOfThought" in n ? { ChainOfThought: n.ChainOfThought } : {
      tools: n.tools,
      data: n.data,
      ToolGroup: n.ToolGroup ?? re.ToolGroup,
      ReasoningGroup: n.ReasoningGroup ?? re.ReasoningGroup
    },
    Empty: n.Empty,
    Quote: n.Quote,
    generativeUI: n.generativeUI
  } : Dn, e[5] = n, e[6] = s) : s = e[6];
  const i = s;
  let o;
  return e[7] !== r || e[8] !== i ? (o = /* @__PURE__ */ _(Wn, {
    components: i,
    ...r
  }), e[7] = r, e[8] = i, e[9] = o) : o = e[9], o;
};
Yn.displayName = "MessagePrimitive.Parts";
const Ho = (t) => {
  const { children: e } = t;
  return np() !== void 0 ? e : null;
};
Ho.displayName = "MessagePrimitive.Error";
const cm = (t) => {
  const e = /* @__PURE__ */ new Map();
  for (let r = 0; r < t.length; r++) {
    const s = t[r]?.parentId ?? `__ungrouped_${r}`, i = e.get(s) ?? [];
    i.push(r), e.set(s, i);
  }
  const n = [];
  for (const [r, s] of e) {
    const i = r.startsWith("__ungrouped_") ? void 0 : r;
    n.push({
      groupKey: i,
      indices: s
    });
  }
  return n;
}, hm = (t) => {
  const e = v(4), n = P(Sm);
  let r;
  e: {
    if (n.length === 0) {
      let i;
      e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (i = [], e[0] = i) : i = e[0], r = i;
      break e;
    }
    let s;
    e[1] !== t || e[2] !== n ? (s = t(n), e[1] = t, e[2] = n, e[3] = s) : s = e[3], r = s;
  }
  return r;
}, dm = (t) => {
  const e = v(9);
  let n, r;
  e[0] !== t ? ({ Fallback: n, ...r } = t, e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]);
  let s;
  e[3] !== n || e[4] !== r.toolName ? (s = (a) => {
    const l = a.tools.tools[r.toolName] ?? n;
    return Array.isArray(l) ? l[0] ?? n : l;
  }, e[3] = n, e[4] = r.toolName, e[5] = s) : s = e[5];
  const i = P(s);
  if (!i) return null;
  let o;
  return e[6] !== i || e[7] !== r ? (o = /* @__PURE__ */ _(i, { ...r }), e[6] = i, e[7] = r, e[8] = o) : o = e[8], o;
}, fm = (t) => {
  const e = v(9);
  let n, r;
  e[0] !== t ? ({ Fallback: n, ...r } = t, e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]);
  let s;
  e[3] !== n || e[4] !== r.name ? (s = (a) => {
    const l = a.dataRenderers.renderers[r.name] ?? n;
    return Array.isArray(l) ? l[0] ?? n : l;
  }, e[3] = n, e[4] = r.name, e[5] = s) : s = e[5];
  const i = P(s);
  if (!i) return null;
  let o;
  return e[6] !== i || e[7] !== r ? (o = /* @__PURE__ */ _(i, { ...r }), e[6] = i, e[7] = r, e[8] = o) : o = e[8], o;
}, Oe = {
  Text: () => /* @__PURE__ */ Ae("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ _(Rr, {}), /* @__PURE__ */ _(Er, { children: /* @__PURE__ */ _("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Reasoning: () => null,
  Source: () => null,
  Image: () => /* @__PURE__ */ _(Mr, {}),
  File: () => null,
  Unstable_Audio: () => null,
  Group: ({ children: t }) => t
}, pm = (t) => {
  const e = v(43), { components: n } = t;
  let r;
  e[0] !== n ? (r = n === void 0 ? {} : n, e[0] = n, e[1] = r) : r = e[1];
  const { Text: s, Reasoning: i, Image: o, Source: a, File: l, Unstable_Audio: u, tools: h, data: c } = r, d = s === void 0 ? Oe.Text : s, f = i === void 0 ? Oe.Reasoning : i, p = o === void 0 ? Oe.Image : o, x = a === void 0 ? Oe.Source : a, S = l === void 0 ? Oe.File : l, y = u === void 0 ? Oe.Unstable_Audio : u;
  let T;
  e[2] !== h ? (T = h === void 0 ? {} : h, e[2] = h, e[3] = T) : T = e[3];
  const R = T, C = H(), I = P(wm), b = I.type;
  if (b === "tool-call") {
    let E;
    e[4] !== C ? (E = C.part(), e[4] = C, e[5] = E) : E = e[5];
    const A = E.addToolResult;
    let D;
    e[6] !== C ? (D = C.part(), e[6] = C, e[7] = D) : D = e[7];
    const w = D.resumeToolCall;
    let L;
    e[8] !== C ? (L = C.part(), e[8] = C, e[9] = L) : L = e[9];
    const O = L.respondToToolApproval;
    if ("Override" in R) {
      let F;
      return e[10] !== A || e[11] !== I || e[12] !== O || e[13] !== w || e[14] !== R.Override ? (F = /* @__PURE__ */ _(R.Override, {
        ...I,
        addResult: A,
        resume: w,
        respondToApproval: O
      }), e[10] = A, e[11] = I, e[12] = O, e[13] = w, e[14] = R.Override, e[15] = F) : F = e[15], F;
    }
    const V = R.by_name?.[I.toolName] ?? R.Fallback;
    let G;
    return e[16] !== V || e[17] !== A || e[18] !== I || e[19] !== O || e[20] !== w ? (G = /* @__PURE__ */ _(dm, {
      ...I,
      Fallback: V,
      addResult: A,
      resume: w,
      respondToApproval: O
    }), e[16] = V, e[17] = A, e[18] = I, e[19] = O, e[20] = w, e[21] = G) : G = e[21], G;
  }
  if (I.status?.type === "requires-action") throw new Error("Encountered unexpected requires-action status");
  switch (b) {
    case "text": {
      let E;
      return e[22] !== d || e[23] !== I ? (E = /* @__PURE__ */ _(d, { ...I }), e[22] = d, e[23] = I, e[24] = E) : E = e[24], E;
    }
    case "reasoning": {
      let E;
      return e[25] !== f || e[26] !== I ? (E = /* @__PURE__ */ _(f, { ...I }), e[25] = f, e[26] = I, e[27] = E) : E = e[27], E;
    }
    case "source": {
      let E;
      return e[28] !== x || e[29] !== I ? (E = /* @__PURE__ */ _(x, { ...I }), e[28] = x, e[29] = I, e[30] = E) : E = e[30], E;
    }
    case "image": {
      let E;
      return e[31] !== p || e[32] !== I ? (E = /* @__PURE__ */ _(p, { ...I }), e[31] = p, e[32] = I, e[33] = E) : E = e[33], E;
    }
    case "file": {
      let E;
      return e[34] !== S || e[35] !== I ? (E = /* @__PURE__ */ _(S, { ...I }), e[34] = S, e[35] = I, e[36] = E) : E = e[36], E;
    }
    case "audio": {
      let E;
      return e[37] !== y || e[38] !== I ? (E = /* @__PURE__ */ _(y, { ...I }), e[37] = y, e[38] = I, e[39] = E) : E = e[39], E;
    }
    case "data": {
      const E = c?.by_name?.[I.name] ?? c?.Fallback;
      let A;
      return e[40] !== E || e[41] !== I ? (A = /* @__PURE__ */ _(fm, {
        ...I,
        Fallback: E
      }), e[40] = E, e[41] = I, e[42] = A) : A = e[42], A;
    }
    default:
      return console.warn(`Unknown message part type: ${b}`), null;
  }
}, mm = (t) => {
  const e = v(5), { partIndex: n, components: r } = t;
  let s;
  e[0] !== r ? (s = /* @__PURE__ */ _(pm, { components: r }), e[0] = r, e[1] = s) : s = e[1];
  let i;
  return e[2] !== n || e[3] !== s ? (i = /* @__PURE__ */ _(_r, {
    index: n,
    children: s
  }), e[2] = n, e[3] = s, e[4] = i) : i = e[4], i;
}, gm = te(mm, (t, e) => t.partIndex === e.partIndex && t.components?.Text === e.components?.Text && t.components?.Reasoning === e.components?.Reasoning && t.components?.Source === e.components?.Source && t.components?.Image === e.components?.Image && t.components?.File === e.components?.File && t.components?.Unstable_Audio === e.components?.Unstable_Audio && t.components?.tools === e.components?.tools && t.components?.data === e.components?.data && t.components?.Group === e.components?.Group), bm = (t) => {
  const e = v(6), { status: n, component: r } = t, s = n.type === "running";
  let i;
  e[0] !== r || e[1] !== n ? (i = /* @__PURE__ */ _(r, {
    type: "text",
    text: "",
    status: n
  }), e[0] = r, e[1] = n, e[2] = i) : i = e[2];
  let o;
  return e[3] !== s || e[4] !== i ? (o = /* @__PURE__ */ _(xr, {
    text: "",
    isRunning: s,
    children: i
  }), e[3] = s, e[4] = i, e[5] = o) : o = e[5], o;
}, ym = Object.freeze({ type: "complete" }), _m = (t) => {
  const e = v(6), { components: n } = t, r = P(vm);
  if (n?.Empty) {
    let o;
    return e[0] !== n.Empty || e[1] !== r ? (o = /* @__PURE__ */ _(n.Empty, { status: r }), e[0] = n.Empty, e[1] = r, e[2] = o) : o = e[2], o;
  }
  const s = n?.Text ?? Oe.Text;
  let i;
  return e[3] !== r || e[4] !== s ? (i = /* @__PURE__ */ _(bm, {
    status: r,
    component: s
  }), e[3] = r, e[4] = s, e[5] = i) : i = e[5], i;
}, xm = te(_m, (t, e) => t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), Pr = (t) => {
  const e = v(9), { groupingFunction: n, components: r } = t, s = P(km), i = hm(n);
  let o;
  e: {
    if (s === 0) {
      let h;
      e[0] !== r ? (h = /* @__PURE__ */ _(xm, { components: r }), e[0] = r, e[1] = h) : h = e[1], o = h;
      break e;
    }
    let u;
    if (e[2] !== r || e[3] !== i) {
      let h;
      e[5] !== r ? (h = (c, d) => /* @__PURE__ */ _(r?.Group ?? Oe.Group, {
        groupKey: c.groupKey,
        indices: c.indices,
        children: c.indices.map((f) => /* @__PURE__ */ _(gm, {
          partIndex: f,
          components: r
        }, f))
      }, `group-${d}-${c.groupKey ?? "ungrouped"}`), e[5] = r, e[6] = h) : h = e[6], u = i.map(h), e[2] = r, e[3] = i, e[4] = u;
    } else u = e[4];
    o = u;
  }
  const a = o;
  let l;
  return e[7] !== a ? (l = /* @__PURE__ */ _(Re, { children: a }), e[7] = a, e[8] = l) : l = e[8], l;
};
Pr.displayName = "MessagePrimitive.Unstable_PartsGrouped";
const Go = (t) => {
  const e = v(6);
  let n, r;
  e[0] !== t ? ({ components: n, ...r } = t, e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]);
  let s;
  return e[3] !== n || e[4] !== r ? (s = /* @__PURE__ */ _(Pr, {
    ...r,
    components: n,
    groupingFunction: cm
  }), e[3] = n, e[4] = r, e[5] = s) : s = e[5], s;
};
Go.displayName = "MessagePrimitive.Unstable_PartsGroupedByParentId";
function Sm(t) {
  return t.message.parts;
}
function wm(t) {
  return t.part;
}
function vm(t) {
  return t.message.status ?? ym;
}
function km(t) {
  return t.message.parts.length;
}
var Q_ = /* @__PURE__ */ bn({
  AttachmentByIndex: () => vo,
  Attachments: () => ko,
  Content: () => Yn,
  Error: () => Ho,
  GenerativeUI: () => ho,
  GroupedParts: () => xo,
  If: () => Fo,
  PartByIndex: () => wt,
  Parts: () => Yn,
  Quote: () => So,
  Root: () => jo,
  Unstable_PartsGrouped: () => Pr,
  Unstable_PartsGroupedByParentId: () => Go
});
const Tm = (t) => {
  const e = v(2), n = ot(t);
  let r;
  return e[0] !== n ? (r = (s) => {
    const i = new ResizeObserver(() => {
      n();
    }), o = new MutationObserver((a) => {
      a.some(Cm) && n();
    });
    return i.observe(s), o.observe(s, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      characterData: !0
    }), () => {
      i.disconnect(), o.disconnect();
    };
  }, e[0] = n, e[1] = r) : r = e[1], et(r);
};
function Cm(t) {
  return t.type !== "attributes" || t.attributeName !== "style";
}
const Im = ({ autoScroll: t, scrollToBottomOnRunStart: e = !0, scrollToBottomOnInitialize: n = !0, scrollToBottomOnThreadSwitch: r = !0 }) => {
  const s = X(null), i = P((C) => C.thread.messages.length > 0), o = X(!1), a = X(null), l = Ze();
  t === void 0 && (t = l.getState().turnAnchor !== "top");
  const u = X(0), h = X(0), c = X(0), d = X(0), f = X(null), p = qt((C) => {
    const I = s.current;
    I && (f.current = C, I.scrollTo({
      top: I.scrollHeight,
      behavior: C
    }));
  }, []), x = qt((C) => {
    f.current = C, a.current !== null && cancelAnimationFrame(a.current), a.current = requestAnimationFrame(() => {
      a.current = null, p(C);
    });
  }, [p]);
  Kt(() => () => {
    a.current !== null && cancelAnimationFrame(a.current);
  }, []);
  const S = qt(() => {
    const C = l.getState();
    return C.turnAnchor === "top" && C.element.viewport === s.current && C.element.anchor !== null;
  }, [l]), y = () => {
    const C = s.current;
    if (!C) return;
    const I = l.getState().isAtBottom, b = Math.abs(C.scrollHeight - C.scrollTop - C.clientHeight) <= 1 || C.scrollHeight <= C.clientHeight;
    !b && u.current < C.scrollTop || (b ? C.scrollHeight > C.clientHeight + 1 && (f.current = null) : u.current > C.scrollTop && h.current === C.scrollHeight && (f.current = null), (b || f.current === null) && b !== I && sn(l).setState({ isAtBottom: b })), u.current = C.scrollTop, h.current = C.scrollHeight;
  }, T = Tm(() => {
    const C = s.current;
    if (!C) return;
    const { scrollHeight: I, clientHeight: b } = C;
    if (I === c.current && b === d.current) return;
    c.current = I, d.current = b;
    const E = f.current;
    E && S() ? f.current = null : E ? p(E) : t && l.getState().isAtBottom && p("instant"), y();
  }), R = et((C) => {
    const I = () => {
      f.current = null;
    };
    return C.addEventListener("scroll", y), C.addEventListener("pointerdown", I), () => {
      C.removeEventListener("scroll", y), C.removeEventListener("pointerdown", I);
    };
  });
  return Kt(() => {
    if (n) {
      if (!i) {
        o.current = !1;
        return;
      }
      o.current || (o.current = !0, f.current === null && x("instant"));
    }
  }, [
    i,
    x,
    n
  ]), $p(({ behavior: C }) => {
    p(C);
  }), Xt("thread.runStart", () => {
    e && l.getState().turnAnchor !== "top" && x("auto");
  }), Xt("threadListItem.switchedTo", () => {
    r && x("instant");
  }), Et(T, R, s);
}, Qo = ne((t, e) => {
  const n = v(3);
  let r;
  return n[0] !== t || n[1] !== e ? (r = /* @__PURE__ */ _(le.div, {
    ...t,
    ref: e
  }), n[0] = t, n[1] = e, n[2] = r) : r = n[2], r;
});
Qo.displayName = "ThreadPrimitive.Root";
const Wo = (t) => {
  const { children: e } = t;
  return P(Em) ? e : null;
};
Wo.displayName = "ThreadPrimitive.Empty";
function Em(t) {
  return t.thread.isEmpty;
}
const Am = (t) => {
  const e = v(4);
  let n;
  return e[0] !== t.disabled || e[1] !== t.empty || e[2] !== t.running ? (n = (r) => !(t.empty === !0 && !r.thread.isEmpty || t.empty === !1 && r.thread.isEmpty || t.running === !0 && !r.thread.isRunning || t.running === !1 && r.thread.isRunning || t.disabled === !0 && !r.thread.isDisabled || t.disabled === !1 && r.thread.isDisabled), e[0] = t.disabled, e[1] = t.empty, e[2] = t.running, e[3] = n) : n = e[3], P(n);
}, Yo = (t) => {
  const e = v(3);
  let n, r;
  return e[0] !== t ? ({ children: n, ...r } = t, e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]), Am(r) ? n : null;
};
Yo.displayName = "ThreadPrimitive.If";
const Ko = (t, e) => {
  const n = v(3);
  let r;
  return n[0] !== e || n[1] !== t ? (r = (s) => {
    if (!t) return;
    const i = t(), o = () => {
      const l = e ? e(s) : s.offsetHeight;
      i.setHeight(l);
    }, a = new ResizeObserver(o);
    return a.observe(s), o(), () => {
      a.disconnect(), i.unregister();
    };
  }, n[0] = e, n[1] = t, n[2] = r) : r = n[2], et(r);
}, As = (t) => {
  let e = 0, n = t;
  for (; n; )
    e += n.offsetTop, n = n.offsetParent;
  return e;
}, Rm = (t, e) => {
  let n = 0, r = t;
  for (; r && r !== e; )
    n += r.offsetTop, r = r.offsetParent;
  return r === e ? n : As(t) - As(e);
}, Jo = ({ viewport: t, anchor: e, tallerThan: n, visibleHeight: r }) => {
  const s = Rm(e, t), i = e.offsetHeight;
  return s + Math.max(0, i - (i <= n ? i : r));
}, Mm = ({ scrollHeight: t, ...e }) => {
  const { viewport: n } = e, r = Jo(e) + n.clientHeight;
  return Math.max(0, r - t);
}, Pm = ({ viewport: t, reserve: e, ...n }) => Mm({
  viewport: t,
  ...n,
  scrollHeight: t.scrollHeight - e.offsetHeight
}), Dm = (t) => {
  const e = new ResizeObserver(t), n = new MutationObserver(t);
  let r = null, s = null, i = null;
  const o = () => {
    e.disconnect(), n.disconnect(), r = null, s = null, i = null;
  };
  return {
    target: (a, l, u) => {
      r === a && s === l && i === u || (o(), e.observe(a), e.observe(l), e.observe(u), n.observe(u, {
        childList: !0,
        subtree: !0,
        characterData: !0
      }), r = a, s = l, i = u);
    },
    disconnect: o
  };
}, Bm = (t) => {
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
}, Om = (t) => {
  let e = null, n;
  function r() {
    const a = t.getState(), { viewport: l, anchor: u, target: h } = a.element, c = a.targetConfig;
    if (a.turnAnchor !== "top" || !l || !u || !h || !c) {
      i.disconnect(), e && (Es(e, 0), e.remove());
      return;
    }
    if (e ??= Xp(), (e.parentElement !== h.parentElement || e.previousElementSibling !== h) && h.after(e), i.target(l, u, h), Es(e, Pm({
      viewport: l,
      anchor: u,
      reserve: e,
      ...c
    }))) {
      s.schedule();
      return;
    }
    const d = Jp(u);
    if (d !== void 0 && n === d) return;
    const f = Zp(Jo({
      viewport: l,
      anchor: u,
      ...c
    }));
    Math.abs(l.scrollTop - f) > 1 && l.scrollTo({
      top: f,
      behavior: "smooth"
    }), d !== void 0 && (n = d);
  }
  const s = Bm(r), i = Dm(s.schedule);
  s.schedule();
  const o = t.subscribe(s.schedule);
  return () => {
    s.cancel(), o(), i.disconnect(), e?.remove();
  };
}, Fm = (t) => {
  const e = v(4), n = Ze();
  let r, s;
  e[0] !== t || e[1] !== n ? (r = () => {
    if (t)
      return Om(n);
  }, s = [t, n], e[0] = t, e[1] = n, e[2] = r, e[3] = s) : (r = e[2], s = e[3]), Kt(r, s);
}, Xo = ({ isRunning: t, messages: e }) => {
  if (!t) return null;
  const n = e.at(-1), r = e.at(-2);
  return r?.role !== "user" || n?.role !== "assistant" ? null : {
    anchorId: r.id,
    targetId: n.id
  };
}, $m = (t) => Xo(t)?.anchorId, Nm = (t) => Xo(t)?.targetId, Lm = () => Ko(Xe(Um), qm), zm = () => et(Xe(jm)), Vm = (t) => {
  const e = v(13), n = Ze();
  let r;
  e[0] !== t ? (r = (f) => {
    if (t)
      return $m(f.thread);
  }, e[0] = t, e[1] = r) : r = e[1];
  const s = P(r);
  let i;
  e[2] !== t ? (i = (f) => {
    if (t)
      return Nm(f.thread);
  }, e[2] = t, e[3] = i) : i = e[3];
  const o = P(i);
  let a;
  e: {
    if (!s || !o) {
      a = null;
      break e;
    }
    let f;
    e[4] !== s || e[5] !== o ? (f = {
      anchorId: s,
      targetId: o
    }, e[4] = s, e[5] = o, e[6] = f) : f = e[6], a = f;
  }
  const l = a;
  let u, h;
  e[7] !== l || e[8] !== n ? (u = () => {
    if (!l) return;
    const f = n.getState(), p = f.topAnchorTurn;
    p?.anchorId === l.anchorId && p.targetId === l.targetId || f.setTopAnchorTurn(l);
  }, h = [l, n], e[7] = l, e[8] = n, e[9] = u, e[10] = h) : (u = e[9], h = e[10]), Kt(u, h);
  let c;
  e[11] !== n ? (c = () => {
    n.getState().setTopAnchorTurn(null);
  }, e[11] = n, e[12] = c) : c = e[12];
  const d = c;
  Xt("thread.initialize", d), Xt("threadListItem.switchedTo", d);
}, Zo = ne((t, e) => {
  const n = v(18);
  let r, s, i, o, a, l;
  n[0] !== t ? ({ autoScroll: r, scrollToBottomOnRunStart: a, scrollToBottomOnInitialize: o, scrollToBottomOnThreadSwitch: l, children: s, ...i } = t, n[0] = t, n[1] = r, n[2] = s, n[3] = i, n[4] = o, n[5] = a, n[6] = l) : (r = n[1], s = n[2], i = n[3], o = n[4], a = n[5], l = n[6]);
  let u;
  n[7] !== r || n[8] !== o || n[9] !== a || n[10] !== l ? (u = {
    autoScroll: r,
    scrollToBottomOnRunStart: a,
    scrollToBottomOnInitialize: o,
    scrollToBottomOnThreadSwitch: l
  }, n[7] = r, n[8] = o, n[9] = a, n[10] = l, n[11] = u) : u = n[11];
  const h = Im(u), c = Lm(), d = zm(), f = Ze();
  let p;
  n[12] !== f ? (p = f.getState(), n[12] = f, n[13] = p) : p = n[13];
  const x = p.turnAnchor === "top";
  Vm(x), Fm(x);
  const S = Et(e, h, c, d);
  let y;
  return n[14] !== s || n[15] !== S || n[16] !== i ? (y = /* @__PURE__ */ _(le.div, {
    ...i,
    ref: S,
    children: s
  }), n[14] = s, n[15] = S, n[16] = i, n[17] = y) : y = n[17], y;
});
Zo.displayName = "ThreadPrimitive.ViewportScrollable";
const ea = ne((t, e) => {
  const n = v(13);
  let r, s, i;
  n[0] !== t ? ({ turnAnchor: i, topAnchorMessageClamp: s, ...r } = t, n[0] = t, n[1] = r, n[2] = s, n[3] = i) : (r = n[1], s = n[2], i = n[3]);
  let o;
  n[4] !== s || n[5] !== i ? (o = {
    turnAnchor: i,
    topAnchorMessageClamp: s
  }, n[4] = s, n[5] = i, n[6] = o) : o = n[6];
  let a;
  n[7] !== r || n[8] !== e ? (a = /* @__PURE__ */ _(Zo, {
    ...r,
    ref: e
  }), n[7] = r, n[8] = e, n[9] = a) : a = n[9];
  let l;
  return n[10] !== o || n[11] !== a ? (l = /* @__PURE__ */ _(Ar, {
    options: o,
    children: a
  }), n[10] = o, n[11] = a, n[12] = l) : l = n[12], l;
});
ea.displayName = "ThreadPrimitive.Viewport";
function Um(t) {
  return t.registerViewport;
}
function qm(t) {
  return t.clientHeight;
}
function jm(t) {
  return t.registerViewportElement;
}
const ta = ne((t, e) => {
  const n = v(3), r = Et(e, Ko(Xe(Hm), Gm));
  let s;
  return n[0] !== t || n[1] !== r ? (s = /* @__PURE__ */ _(le.div, {
    ...t,
    ref: r
  }), n[0] = t, n[1] = r, n[2] = s) : s = n[2], s;
});
ta.displayName = "ThreadPrimitive.ViewportFooter";
function Hm(t) {
  return t.registerContentInset;
}
function Gm(t) {
  const e = parseFloat(getComputedStyle(t).marginTop) || 0;
  return t.offsetHeight + e;
}
const Qm = (t) => {
  const e = v(5);
  let n;
  e[0] !== t ? (n = t === void 0 ? {} : t, e[0] = t, e[1] = n) : n = e[1];
  const { behavior: r } = n, s = Xe(Ym), i = Ze();
  let o;
  e[2] !== r || e[3] !== i ? (o = () => {
    i.getState().scrollToBottom({ behavior: r });
  }, e[2] = r, e[3] = i, e[4] = o) : o = e[4];
  const a = o;
  return s ? null : a;
}, Wm = Pt("ThreadPrimitive.ScrollToBottom", Qm, ["behavior"]);
function Ym(t) {
  return t.isAtBottom;
}
const Km = (t) => {
  const e = v(4), { prompt: n, send: r, clearComposer: s, autoSend: i } = t, o = r ?? i ?? !1;
  let a;
  e[0] !== s || e[1] !== n || e[2] !== o ? (a = {
    prompt: n,
    send: o,
    clearComposer: s
  }, e[0] = s, e[1] = n, e[2] = o, e[3] = a) : a = e[3];
  const { disabled: l, trigger: u } = ep(a);
  return l ? null : u;
}, Jm = Pt("ThreadPrimitive.Suggestion", Km, [
  "prompt",
  "send",
  "clearComposer",
  "autoSend",
  "method"
]);
var W_ = /* @__PURE__ */ bn({
  Empty: () => Wo,
  If: () => Yo,
  MessageByIndex: () => oo,
  Messages: () => $d,
  Root: () => Qo,
  ScrollToBottom: () => Wm,
  Suggestion: () => Jm,
  SuggestionByIndex: () => Co,
  Suggestions: () => Df,
  Unstable_MessageById: () => ao,
  Viewport: () => ea,
  ViewportFooter: () => ta,
  ViewportProvider: () => Ar
}), Xm = /* @__PURE__ */ bn({
  AssistantRuntimeImpl: () => to,
  BaseAssistantRuntimeCore: () => no,
  CompositeContextProvider: () => fr,
  DefaultThreadComposerRuntimeCore: () => io,
  MessageRepository: () => wr,
  ThreadRuntimeImpl: () => eo,
  getAutoStatus: () => rn,
  splitLocalRuntimeOptions: () => sp,
  useComposerInputPluginRegistryOptional: () => Fp,
  useSmooth: () => Uo,
  useSmoothStatus: () => Gp,
  withSmoothContextProvider: () => Hp
});
const Zm = (t, e) => typeof t == "string" ? t === e : JSON.stringify(t) === JSON.stringify(e), eg = (t, e) => {
  if (!t || !e) return !1;
  const n = (r) => {
    const { position: s, data: i, ...o } = r || {};
    return o;
  };
  return JSON.stringify(n(t.properties)) === JSON.stringify(n(e.properties)) && Zm(t.children, e.children);
}, na = (t, e) => eg(t.node, e.node), Dr = ul(null), tg = () => Ys(Dr) !== null, ng = ({ children: t, ...e }) => /* @__PURE__ */ _(Dr.Provider, {
  value: e,
  children: t
}), rg = te(ng, na), sg = ({ node: t, ...e }) => /* @__PURE__ */ _("pre", { ...e }), ig = ({ node: t, ...e }) => /* @__PURE__ */ _("code", { ...e }), Br = ({ node: t, components: { Pre: e, Code: n }, code: r }) => /* @__PURE__ */ _(e, { children: /* @__PURE__ */ _(n, {
  node: t,
  children: r
}) }), og = () => null, ag = ({ node: t, components: { Pre: e, Code: n, SyntaxHighlighter: r, CodeHeader: s }, language: i, code: o }) => {
  const a = _t(() => ({
    Pre: e,
    Code: n
  }), [e, n]);
  return /* @__PURE__ */ Ae(Re, { children: [/* @__PURE__ */ _(s, {
    node: t,
    language: i,
    code: o
  }), /* @__PURE__ */ _(i ? r : Br, {
    node: t,
    components: a,
    language: i ?? "unknown",
    code: o
  })] });
}, Rs = ({ className: t, ...e }) => ({ className: n, ...r }) => ({
  className: Js(t, n),
  ...e,
  ...r
}), lg = ({ node: t, components: { Pre: e, Code: n, SyntaxHighlighter: r, CodeHeader: s }, componentsByLanguage: i = {}, children: o, ...a }) => {
  const l = Rs(Ys(Dr)), u = ot((f) => /* @__PURE__ */ _(e, { ...l(f) })), h = Rs(a), c = ot((f) => /* @__PURE__ */ _(n, { ...h(f) })), d = /language-(\w+)/.exec(a.className || "")?.[1] ?? "";
  return typeof o != "string" ? /* @__PURE__ */ _(Br, {
    node: t,
    components: {
      Pre: u,
      Code: c
    },
    code: o
  }) : /* @__PURE__ */ _(ag, {
    node: t,
    components: {
      Pre: u,
      Code: c,
      SyntaxHighlighter: i[d]?.SyntaxHighlighter ?? r,
      CodeHeader: i[d]?.CodeHeader ?? s
    },
    language: d || "unknown",
    code: o
  });
}, ug = ({ node: t, components: e, componentsByLanguage: n, ...r }) => tg() ? /* @__PURE__ */ _(lg, {
  node: t,
  components: e,
  componentsByLanguage: n,
  ...r
}) : /* @__PURE__ */ _(e.Code, { ...r }), cg = te(ug, (t, e) => t.components === e.components && t.componentsByLanguage === e.componentsByLanguage && na(t, e)), ra = ia("end"), sa = ia("start");
function ia(t) {
  return e;
  function e(n) {
    const r = n && n.position && n.position[t] || {};
    if (typeof r.line == "number" && r.line > 0 && typeof r.column == "number" && r.column > 0)
      return {
        line: r.line,
        column: r.column,
        offset: typeof r.offset == "number" && r.offset > -1 ? r.offset : void 0
      };
  }
}
function hg(t) {
  const e = sa(t), n = ra(t);
  if (e && n)
    return { start: e, end: n };
}
function Gt(t) {
  return !t || typeof t != "object" ? "" : "position" in t || "type" in t ? Ms(t.position) : "start" in t || "end" in t ? Ms(t) : "line" in t || "column" in t ? Kn(t) : "";
}
function Kn(t) {
  return Ps(t && t.line) + ":" + Ps(t && t.column);
}
function Ms(t) {
  return Kn(t && t.start) + "-" + Kn(t && t.end);
}
function Ps(t) {
  return t && typeof t == "number" ? t : 1;
}
const dg = {};
function Or(t, e) {
  const n = dg, r = typeof n.includeImageAlt == "boolean" ? n.includeImageAlt : !0, s = typeof n.includeHtml == "boolean" ? n.includeHtml : !0;
  return oa(t, r, s);
}
function oa(t, e, n) {
  if (fg(t)) {
    if ("value" in t)
      return t.type === "html" && !n ? "" : t.value;
    if (e && "alt" in t && t.alt)
      return t.alt;
    if ("children" in t)
      return Ds(t.children, e, n);
  }
  return Array.isArray(t) ? Ds(t, e, n) : "";
}
function Ds(t, e, n) {
  const r = [];
  let s = -1;
  for (; ++s < t.length; )
    r[s] = oa(t[s], e, n);
  return r.join("");
}
function fg(t) {
  return !!(t && typeof t == "object");
}
function xe(t, e, n, r) {
  const s = t.length;
  let i = 0, o;
  if (e < 0 ? e = -e > s ? 0 : s + e : e = e > s ? s : e, n = n > 0 ? n : 0, r.length < 1e4)
    o = Array.from(r), o.unshift(e, n), t.splice(...o);
  else
    for (n && t.splice(e, n); i < r.length; )
      o = r.slice(i, i + 1e4), o.unshift(e, 0), t.splice(...o), i += 1e4, e += 1e4;
}
function pe(t, e) {
  return t.length > 0 ? (xe(t, t.length, 0, e), t) : e;
}
const Bs = {}.hasOwnProperty;
function pg(t) {
  const e = {};
  let n = -1;
  for (; ++n < t.length; )
    mg(e, t[n]);
  return e;
}
function mg(t, e) {
  let n;
  for (n in e) {
    const s = (Bs.call(t, n) ? t[n] : void 0) || (t[n] = {}), i = e[n];
    let o;
    if (i)
      for (o in i) {
        Bs.call(s, o) || (s[o] = []);
        const a = i[o];
        gg(
          // @ts-expect-error Looks like a list.
          s[o],
          Array.isArray(a) ? a : a ? [a] : []
        );
      }
  }
}
function gg(t, e) {
  let n = -1;
  const r = [];
  for (; ++n < e.length; )
    (e[n].add === "after" ? t : r).push(e[n]);
  xe(t, 0, 0, r);
}
function aa(t, e) {
  const n = Number.parseInt(t, e);
  return (
    // C0 except for HT, LF, FF, CR, space.
    n < 9 || n === 11 || n > 13 && n < 32 || // Control character (DEL) of C0, and C1 controls.
    n > 126 && n < 160 || // Lone high surrogates and low surrogates.
    n > 55295 && n < 57344 || // Noncharacters.
    n > 64975 && n < 65008 || /* eslint-disable no-bitwise */
    (n & 65535) === 65535 || (n & 65535) === 65534 || /* eslint-enable no-bitwise */
    // Out of range
    n > 1114111 ? "�" : String.fromCodePoint(n)
  );
}
function ge(t) {
  return t.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}
const oe = $e(/[A-Za-z]/), ie = $e(/[\dA-Za-z]/), bg = $e(/[#-'*+\--9=?A-Z^-~]/);
function on(t) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    t !== null && (t < 32 || t === 127)
  );
}
const Jn = $e(/\d/), yg = $e(/[\dA-Fa-f]/), _g = $e(/[!-/:-@[-`{-~]/);
function B(t) {
  return t !== null && t < -2;
}
function Y(t) {
  return t !== null && (t < 0 || t === 32);
}
function N(t) {
  return t === -2 || t === -1 || t === 32;
}
const yn = $e(new RegExp("\\p{P}|\\p{S}", "u")), Ke = $e(/\s/);
function $e(t) {
  return e;
  function e(n) {
    return n !== null && n > -1 && t.test(String.fromCharCode(n));
  }
}
function pt(t) {
  const e = [];
  let n = -1, r = 0, s = 0;
  for (; ++n < t.length; ) {
    const i = t.charCodeAt(n);
    let o = "";
    if (i === 37 && ie(t.charCodeAt(n + 1)) && ie(t.charCodeAt(n + 2)))
      s = 2;
    else if (i < 128)
      /[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(i)) || (o = String.fromCharCode(i));
    else if (i > 55295 && i < 57344) {
      const a = t.charCodeAt(n + 1);
      i < 56320 && a > 56319 && a < 57344 ? (o = String.fromCharCode(i, a), s = 1) : o = "�";
    } else
      o = String.fromCharCode(i);
    o && (e.push(t.slice(r, n), encodeURIComponent(o)), r = n + s + 1, o = ""), s && (n += s, s = 0);
  }
  return e.join("") + t.slice(r);
}
function U(t, e, n, r) {
  const s = r ? r - 1 : Number.POSITIVE_INFINITY;
  let i = 0;
  return o;
  function o(l) {
    return N(l) ? (t.enter(n), a(l)) : e(l);
  }
  function a(l) {
    return N(l) && i++ < s ? (t.consume(l), a) : (t.exit(n), e(l));
  }
}
function ut(t) {
  if (t === null || Y(t) || Ke(t))
    return 1;
  if (yn(t))
    return 2;
}
function Fr(t, e, n) {
  const r = [];
  let s = -1;
  for (; ++s < t.length; ) {
    const i = t[s].resolveAll;
    i && !r.includes(i) && (e = i(e, n), r.push(i));
  }
  return e;
}
const Y_ = {
  name: "attention",
  resolveAll: xg,
  tokenize: Sg
};
function xg(t, e) {
  let n = -1, r, s, i, o, a, l, u, h;
  for (; ++n < t.length; )
    if (t[n][0] === "enter" && t[n][1].type === "attentionSequence" && t[n][1]._close) {
      for (r = n; r--; )
        if (t[r][0] === "exit" && t[r][1].type === "attentionSequence" && t[r][1]._open && // If the markers are the same:
        e.sliceSerialize(t[r][1]).charCodeAt(0) === e.sliceSerialize(t[n][1]).charCodeAt(0)) {
          if ((t[r][1]._close || t[n][1]._open) && (t[n][1].end.offset - t[n][1].start.offset) % 3 && !((t[r][1].end.offset - t[r][1].start.offset + t[n][1].end.offset - t[n][1].start.offset) % 3))
            continue;
          l = t[r][1].end.offset - t[r][1].start.offset > 1 && t[n][1].end.offset - t[n][1].start.offset > 1 ? 2 : 1;
          const c = {
            ...t[r][1].end
          }, d = {
            ...t[n][1].start
          };
          Os(c, -l), Os(d, l), o = {
            type: l > 1 ? "strongSequence" : "emphasisSequence",
            start: c,
            end: {
              ...t[r][1].end
            }
          }, a = {
            type: l > 1 ? "strongSequence" : "emphasisSequence",
            start: {
              ...t[n][1].start
            },
            end: d
          }, i = {
            type: l > 1 ? "strongText" : "emphasisText",
            start: {
              ...t[r][1].end
            },
            end: {
              ...t[n][1].start
            }
          }, s = {
            type: l > 1 ? "strong" : "emphasis",
            start: {
              ...o.start
            },
            end: {
              ...a.end
            }
          }, t[r][1].end = {
            ...o.start
          }, t[n][1].start = {
            ...a.end
          }, u = [], t[r][1].end.offset - t[r][1].start.offset && (u = pe(u, [["enter", t[r][1], e], ["exit", t[r][1], e]])), u = pe(u, [["enter", s, e], ["enter", o, e], ["exit", o, e], ["enter", i, e]]), u = pe(u, Fr(e.parser.constructs.insideSpan.null, t.slice(r + 1, n), e)), u = pe(u, [["exit", i, e], ["enter", a, e], ["exit", a, e], ["exit", s, e]]), t[n][1].end.offset - t[n][1].start.offset ? (h = 2, u = pe(u, [["enter", t[n][1], e], ["exit", t[n][1], e]])) : h = 0, xe(t, r - 1, n - r + 3, u), n = r + u.length - h - 2;
          break;
        }
    }
  for (n = -1; ++n < t.length; )
    t[n][1].type === "attentionSequence" && (t[n][1].type = "data");
  return t;
}
function Sg(t, e) {
  const n = this.parser.constructs.attentionMarkers.null, r = this.previous, s = ut(r);
  let i;
  return o;
  function o(l) {
    return i = l, t.enter("attentionSequence"), a(l);
  }
  function a(l) {
    if (l === i)
      return t.consume(l), a;
    const u = t.exit("attentionSequence"), h = ut(l), c = !h || h === 2 && s || n.includes(l), d = !s || s === 2 && h || n.includes(r);
    return u._open = !!(i === 42 ? c : c && (s || !d)), u._close = !!(i === 42 ? d : d && (h || !c)), e(l);
  }
}
function Os(t, e) {
  t.column += e, t.offset += e, t._bufferIndex += e;
}
const K_ = {
  name: "autolink",
  tokenize: wg
};
function wg(t, e, n) {
  let r = 0;
  return s;
  function s(f) {
    return t.enter("autolink"), t.enter("autolinkMarker"), t.consume(f), t.exit("autolinkMarker"), t.enter("autolinkProtocol"), i;
  }
  function i(f) {
    return oe(f) ? (t.consume(f), o) : f === 64 ? n(f) : u(f);
  }
  function o(f) {
    return f === 43 || f === 45 || f === 46 || ie(f) ? (r = 1, a(f)) : u(f);
  }
  function a(f) {
    return f === 58 ? (t.consume(f), r = 0, l) : (f === 43 || f === 45 || f === 46 || ie(f)) && r++ < 32 ? (t.consume(f), a) : (r = 0, u(f));
  }
  function l(f) {
    return f === 62 ? (t.exit("autolinkProtocol"), t.enter("autolinkMarker"), t.consume(f), t.exit("autolinkMarker"), t.exit("autolink"), e) : f === null || f === 32 || f === 60 || on(f) ? n(f) : (t.consume(f), l);
  }
  function u(f) {
    return f === 64 ? (t.consume(f), h) : bg(f) ? (t.consume(f), u) : n(f);
  }
  function h(f) {
    return ie(f) ? c(f) : n(f);
  }
  function c(f) {
    return f === 46 ? (t.consume(f), r = 0, h) : f === 62 ? (t.exit("autolinkProtocol").type = "autolinkEmail", t.enter("autolinkMarker"), t.consume(f), t.exit("autolinkMarker"), t.exit("autolink"), e) : d(f);
  }
  function d(f) {
    if ((f === 45 || ie(f)) && r++ < 63) {
      const p = f === 45 ? d : c;
      return t.consume(f), p;
    }
    return n(f);
  }
}
const _n = {
  partial: !0,
  tokenize: vg
};
function vg(t, e, n) {
  return r;
  function r(i) {
    return N(i) ? U(t, s, "linePrefix")(i) : s(i);
  }
  function s(i) {
    return i === null || B(i) ? e(i) : n(i);
  }
}
const kg = {
  continuation: {
    tokenize: Cg
  },
  exit: Ig,
  name: "blockQuote",
  tokenize: Tg
};
function Tg(t, e, n) {
  const r = this;
  return s;
  function s(o) {
    if (o === 62) {
      const a = r.containerState;
      return a.open || (t.enter("blockQuote", {
        _container: !0
      }), a.open = !0), t.enter("blockQuotePrefix"), t.enter("blockQuoteMarker"), t.consume(o), t.exit("blockQuoteMarker"), i;
    }
    return n(o);
  }
  function i(o) {
    return N(o) ? (t.enter("blockQuotePrefixWhitespace"), t.consume(o), t.exit("blockQuotePrefixWhitespace"), t.exit("blockQuotePrefix"), e) : (t.exit("blockQuotePrefix"), e(o));
  }
}
function Cg(t, e, n) {
  const r = this;
  return s;
  function s(o) {
    return N(o) ? U(t, i, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(o) : i(o);
  }
  function i(o) {
    return t.attempt(kg, e, n)(o);
  }
}
function Ig(t) {
  t.exit("blockQuote");
}
const J_ = {
  name: "characterEscape",
  tokenize: Eg
};
function Eg(t, e, n) {
  return r;
  function r(i) {
    return t.enter("characterEscape"), t.enter("escapeMarker"), t.consume(i), t.exit("escapeMarker"), s;
  }
  function s(i) {
    return _g(i) ? (t.enter("characterEscapeValue"), t.consume(i), t.exit("characterEscapeValue"), t.exit("characterEscape"), e) : n(i);
  }
}
const X_ = {
  name: "characterReference",
  tokenize: Ag
};
function Ag(t, e, n) {
  const r = this;
  let s = 0, i, o;
  return a;
  function a(c) {
    return t.enter("characterReference"), t.enter("characterReferenceMarker"), t.consume(c), t.exit("characterReferenceMarker"), l;
  }
  function l(c) {
    return c === 35 ? (t.enter("characterReferenceMarkerNumeric"), t.consume(c), t.exit("characterReferenceMarkerNumeric"), u) : (t.enter("characterReferenceValue"), i = 31, o = ie, h(c));
  }
  function u(c) {
    return c === 88 || c === 120 ? (t.enter("characterReferenceMarkerHexadecimal"), t.consume(c), t.exit("characterReferenceMarkerHexadecimal"), t.enter("characterReferenceValue"), i = 6, o = yg, h) : (t.enter("characterReferenceValue"), i = 7, o = Jn, h(c));
  }
  function h(c) {
    if (c === 59 && s) {
      const d = t.exit("characterReferenceValue");
      return o === ie && !tr(r.sliceSerialize(d)) ? n(c) : (t.enter("characterReferenceMarker"), t.consume(c), t.exit("characterReferenceMarker"), t.exit("characterReference"), e);
    }
    return o(c) && s++ < i ? (t.consume(c), h) : n(c);
  }
}
const Fs = {
  partial: !0,
  tokenize: Mg
}, Z_ = {
  concrete: !0,
  name: "codeFenced",
  tokenize: Rg
};
function Rg(t, e, n) {
  const r = this, s = {
    partial: !0,
    tokenize: I
  };
  let i = 0, o = 0, a;
  return l;
  function l(b) {
    return u(b);
  }
  function u(b) {
    const E = r.events[r.events.length - 1];
    return i = E && E[1].type === "linePrefix" ? E[2].sliceSerialize(E[1], !0).length : 0, a = b, t.enter("codeFenced"), t.enter("codeFencedFence"), t.enter("codeFencedFenceSequence"), h(b);
  }
  function h(b) {
    return b === a ? (o++, t.consume(b), h) : o < 3 ? n(b) : (t.exit("codeFencedFenceSequence"), N(b) ? U(t, c, "whitespace")(b) : c(b));
  }
  function c(b) {
    return b === null || B(b) ? (t.exit("codeFencedFence"), r.interrupt ? e(b) : t.check(Fs, x, C)(b)) : (t.enter("codeFencedFenceInfo"), t.enter("chunkString", {
      contentType: "string"
    }), d(b));
  }
  function d(b) {
    return b === null || B(b) ? (t.exit("chunkString"), t.exit("codeFencedFenceInfo"), c(b)) : N(b) ? (t.exit("chunkString"), t.exit("codeFencedFenceInfo"), U(t, f, "whitespace")(b)) : b === 96 && b === a ? n(b) : (t.consume(b), d);
  }
  function f(b) {
    return b === null || B(b) ? c(b) : (t.enter("codeFencedFenceMeta"), t.enter("chunkString", {
      contentType: "string"
    }), p(b));
  }
  function p(b) {
    return b === null || B(b) ? (t.exit("chunkString"), t.exit("codeFencedFenceMeta"), c(b)) : b === 96 && b === a ? n(b) : (t.consume(b), p);
  }
  function x(b) {
    return t.attempt(s, C, S)(b);
  }
  function S(b) {
    return t.enter("lineEnding"), t.consume(b), t.exit("lineEnding"), y;
  }
  function y(b) {
    return i > 0 && N(b) ? U(t, T, "linePrefix", i + 1)(b) : T(b);
  }
  function T(b) {
    return b === null || B(b) ? t.check(Fs, x, C)(b) : (t.enter("codeFlowValue"), R(b));
  }
  function R(b) {
    return b === null || B(b) ? (t.exit("codeFlowValue"), T(b)) : (t.consume(b), R);
  }
  function C(b) {
    return t.exit("codeFenced"), e(b);
  }
  function I(b, E, A) {
    let D = 0;
    return w;
    function w(F) {
      return b.enter("lineEnding"), b.consume(F), b.exit("lineEnding"), L;
    }
    function L(F) {
      return b.enter("codeFencedFence"), N(F) ? U(b, O, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(F) : O(F);
    }
    function O(F) {
      return F === a ? (b.enter("codeFencedFenceSequence"), V(F)) : A(F);
    }
    function V(F) {
      return F === a ? (D++, b.consume(F), V) : D >= o ? (b.exit("codeFencedFenceSequence"), N(F) ? U(b, G, "whitespace")(F) : G(F)) : A(F);
    }
    function G(F) {
      return F === null || B(F) ? (b.exit("codeFencedFence"), E(F)) : A(F);
    }
  }
}
function Mg(t, e, n) {
  const r = this;
  return s;
  function s(o) {
    return o === null ? n(o) : (t.enter("lineEnding"), t.consume(o), t.exit("lineEnding"), i);
  }
  function i(o) {
    return r.parser.lazy[r.now().line] ? n(o) : e(o);
  }
}
const ex = {
  name: "codeIndented",
  tokenize: Dg
}, Pg = {
  partial: !0,
  tokenize: Bg
};
function Dg(t, e, n) {
  const r = this;
  return s;
  function s(u) {
    return t.enter("codeIndented"), U(t, i, "linePrefix", 5)(u);
  }
  function i(u) {
    const h = r.events[r.events.length - 1];
    return h && h[1].type === "linePrefix" && h[2].sliceSerialize(h[1], !0).length >= 4 ? o(u) : n(u);
  }
  function o(u) {
    return u === null ? l(u) : B(u) ? t.attempt(Pg, o, l)(u) : (t.enter("codeFlowValue"), a(u));
  }
  function a(u) {
    return u === null || B(u) ? (t.exit("codeFlowValue"), o(u)) : (t.consume(u), a);
  }
  function l(u) {
    return t.exit("codeIndented"), e(u);
  }
}
function Bg(t, e, n) {
  const r = this;
  return s;
  function s(o) {
    return r.parser.lazy[r.now().line] ? n(o) : B(o) ? (t.enter("lineEnding"), t.consume(o), t.exit("lineEnding"), s) : U(t, i, "linePrefix", 5)(o);
  }
  function i(o) {
    const a = r.events[r.events.length - 1];
    return a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? e(o) : B(o) ? s(o) : n(o);
  }
}
const tx = {
  name: "codeText",
  previous: Fg,
  resolve: Og,
  tokenize: $g
};
function Og(t) {
  let e = t.length - 4, n = 3, r, s;
  if ((t[n][1].type === "lineEnding" || t[n][1].type === "space") && (t[e][1].type === "lineEnding" || t[e][1].type === "space")) {
    for (r = n; ++r < e; )
      if (t[r][1].type === "codeTextData") {
        t[n][1].type = "codeTextPadding", t[e][1].type = "codeTextPadding", n += 2, e -= 2;
        break;
      }
  }
  for (r = n - 1, e++; ++r <= e; )
    s === void 0 ? r !== e && t[r][1].type !== "lineEnding" && (s = r) : (r === e || t[r][1].type === "lineEnding") && (t[s][1].type = "codeTextData", r !== s + 2 && (t[s][1].end = t[r - 1][1].end, t.splice(s + 2, r - s - 2), e -= r - s - 2, r = s + 2), s = void 0);
  return t;
}
function Fg(t) {
  return t !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function $g(t, e, n) {
  let r = 0, s, i;
  return o;
  function o(c) {
    return t.enter("codeText"), t.enter("codeTextSequence"), a(c);
  }
  function a(c) {
    return c === 96 ? (t.consume(c), r++, a) : (t.exit("codeTextSequence"), l(c));
  }
  function l(c) {
    return c === null ? n(c) : c === 32 ? (t.enter("space"), t.consume(c), t.exit("space"), l) : c === 96 ? (i = t.enter("codeTextSequence"), s = 0, h(c)) : B(c) ? (t.enter("lineEnding"), t.consume(c), t.exit("lineEnding"), l) : (t.enter("codeTextData"), u(c));
  }
  function u(c) {
    return c === null || c === 32 || c === 96 || B(c) ? (t.exit("codeTextData"), l(c)) : (t.consume(c), u);
  }
  function h(c) {
    return c === 96 ? (t.consume(c), s++, h) : s === r ? (t.exit("codeTextSequence"), t.exit("codeText"), e(c)) : (i.type = "codeTextData", u(c));
  }
}
class Ng {
  /**
   * @param {ReadonlyArray<T> | null | undefined} [initial]
   *   Initial items (optional).
   * @returns
   *   Splice buffer.
   */
  constructor(e) {
    this.left = e ? [...e] : [], this.right = [];
  }
  /**
   * Array access;
   * does not move the cursor.
   *
   * @param {number} index
   *   Index.
   * @return {T}
   *   Item.
   */
  get(e) {
    if (e < 0 || e >= this.left.length + this.right.length)
      throw new RangeError("Cannot access index `" + e + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
    return e < this.left.length ? this.left[e] : this.right[this.right.length - e + this.left.length - 1];
  }
  /**
   * The length of the splice buffer, one greater than the largest index in the
   * array.
   */
  get length() {
    return this.left.length + this.right.length;
  }
  /**
   * Remove and return `list[0]`;
   * moves the cursor to `0`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  shift() {
    return this.setCursor(0), this.right.pop();
  }
  /**
   * Slice the buffer to get an array;
   * does not move the cursor.
   *
   * @param {number} start
   *   Start.
   * @param {number | null | undefined} [end]
   *   End (optional).
   * @returns {Array<T>}
   *   Array of items.
   */
  slice(e, n) {
    const r = n ?? Number.POSITIVE_INFINITY;
    return r < this.left.length ? this.left.slice(e, r) : e > this.left.length ? this.right.slice(this.right.length - r + this.left.length, this.right.length - e + this.left.length).reverse() : this.left.slice(e).concat(this.right.slice(this.right.length - r + this.left.length).reverse());
  }
  /**
   * Mimics the behavior of Array.prototype.splice() except for the change of
   * interface necessary to avoid segfaults when patching in very large arrays.
   *
   * This operation moves cursor is moved to `start` and results in the cursor
   * placed after any inserted items.
   *
   * @param {number} start
   *   Start;
   *   zero-based index at which to start changing the array;
   *   negative numbers count backwards from the end of the array and values
   *   that are out-of bounds are clamped to the appropriate end of the array.
   * @param {number | null | undefined} [deleteCount=0]
   *   Delete count (default: `0`);
   *   maximum number of elements to delete, starting from start.
   * @param {Array<T> | null | undefined} [items=[]]
   *   Items to include in place of the deleted items (default: `[]`).
   * @return {Array<T>}
   *   Any removed items.
   */
  splice(e, n, r) {
    const s = n || 0;
    this.setCursor(Math.trunc(e));
    const i = this.right.splice(this.right.length - s, Number.POSITIVE_INFINITY);
    return r && yt(this.left, r), i.reverse();
  }
  /**
   * Remove and return the highest-numbered item in the array, so
   * `list[list.length - 1]`;
   * Moves the cursor to `length`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  pop() {
    return this.setCursor(Number.POSITIVE_INFINITY), this.left.pop();
  }
  /**
   * Inserts a single item to the high-numbered side of the array;
   * moves the cursor to `length`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  push(e) {
    this.setCursor(Number.POSITIVE_INFINITY), this.left.push(e);
  }
  /**
   * Inserts many items to the high-numbered side of the array.
   * Moves the cursor to `length`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  pushMany(e) {
    this.setCursor(Number.POSITIVE_INFINITY), yt(this.left, e);
  }
  /**
   * Inserts a single item to the low-numbered side of the array;
   * Moves the cursor to `0`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  unshift(e) {
    this.setCursor(0), this.right.push(e);
  }
  /**
   * Inserts many items to the low-numbered side of the array;
   * moves the cursor to `0`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  unshiftMany(e) {
    this.setCursor(0), yt(this.right, e.reverse());
  }
  /**
   * Move the cursor to a specific position in the array. Requires
   * time proportional to the distance moved.
   *
   * If `n < 0`, the cursor will end up at the beginning.
   * If `n > length`, the cursor will end up at the end.
   *
   * @param {number} n
   *   Position.
   * @return {undefined}
   *   Nothing.
   */
  setCursor(e) {
    if (!(e === this.left.length || e > this.left.length && this.right.length === 0 || e < 0 && this.left.length === 0))
      if (e < this.left.length) {
        const n = this.left.splice(e, Number.POSITIVE_INFINITY);
        yt(this.right, n.reverse());
      } else {
        const n = this.right.splice(this.left.length + this.right.length - e, Number.POSITIVE_INFINITY);
        yt(this.left, n.reverse());
      }
  }
}
function yt(t, e) {
  let n = 0;
  if (e.length < 1e4)
    t.push(...e);
  else
    for (; n < e.length; )
      t.push(...e.slice(n, n + 1e4)), n += 1e4;
}
function Lg(t) {
  const e = {};
  let n = -1, r, s, i, o, a, l, u;
  const h = new Ng(t);
  for (; ++n < h.length; ) {
    for (; n in e; )
      n = e[n];
    if (r = h.get(n), n && r[1].type === "chunkFlow" && h.get(n - 1)[1].type === "listItemPrefix" && (l = r[1]._tokenizer.events, i = 0, i < l.length && l[i][1].type === "lineEndingBlank" && (i += 2), i < l.length && l[i][1].type === "content"))
      for (; ++i < l.length && l[i][1].type !== "content"; )
        l[i][1].type === "chunkText" && (l[i][1]._isInFirstContentOfListItem = !0, i++);
    if (r[0] === "enter")
      r[1].contentType && (Object.assign(e, zg(h, n)), n = e[n], u = !0);
    else if (r[1]._container) {
      for (i = n, s = void 0; i--; )
        if (o = h.get(i), o[1].type === "lineEnding" || o[1].type === "lineEndingBlank")
          o[0] === "enter" && (s && (h.get(s)[1].type = "lineEndingBlank"), o[1].type = "lineEnding", s = i);
        else if (!(o[1].type === "linePrefix" || o[1].type === "listItemIndent")) break;
      s && (r[1].end = {
        ...h.get(s)[1].start
      }, a = h.slice(s, n), a.unshift(r), h.splice(s, n - s + 1, a));
    }
  }
  return xe(t, 0, Number.POSITIVE_INFINITY, h.slice(0)), !u;
}
function zg(t, e) {
  const n = t.get(e)[1], r = t.get(e)[2];
  let s = e - 1;
  const i = [];
  let o = n._tokenizer;
  o || (o = r.parser[n.contentType](n.start), n._contentTypeTextTrailing && (o._contentTypeTextTrailing = !0));
  const a = o.events, l = [], u = {};
  let h, c, d = -1, f = n, p = 0, x = 0;
  const S = [x];
  for (; f; ) {
    for (; t.get(++s)[1] !== f; )
      ;
    i.push(s), f._tokenizer || (h = r.sliceStream(f), f.next || h.push(null), c && o.defineSkip(f.start), f._isInFirstContentOfListItem && (o._gfmTasklistFirstContentOfListItem = !0), o.write(h), f._isInFirstContentOfListItem && (o._gfmTasklistFirstContentOfListItem = void 0)), c = f, f = f.next;
  }
  for (f = n; ++d < a.length; )
    // Find a void token that includes a break.
    a[d][0] === "exit" && a[d - 1][0] === "enter" && a[d][1].type === a[d - 1][1].type && a[d][1].start.line !== a[d][1].end.line && (x = d + 1, S.push(x), f._tokenizer = void 0, f.previous = void 0, f = f.next);
  for (o.events = [], f ? (f._tokenizer = void 0, f.previous = void 0) : S.pop(), d = S.length; d--; ) {
    const y = a.slice(S[d], S[d + 1]), T = i.pop();
    l.push([T, T + y.length - 1]), t.splice(T, 2, y);
  }
  for (l.reverse(), d = -1; ++d < l.length; )
    u[p + l[d][0]] = p + l[d][1], p += l[d][1] - l[d][0] - 1;
  return u;
}
const nx = {
  resolve: Ug,
  tokenize: qg
}, Vg = {
  partial: !0,
  tokenize: jg
};
function Ug(t) {
  return Lg(t), t;
}
function qg(t, e) {
  let n;
  return r;
  function r(a) {
    return t.enter("content"), n = t.enter("chunkContent", {
      contentType: "content"
    }), s(a);
  }
  function s(a) {
    return a === null ? i(a) : B(a) ? t.check(Vg, o, i)(a) : (t.consume(a), s);
  }
  function i(a) {
    return t.exit("chunkContent"), t.exit("content"), e(a);
  }
  function o(a) {
    return t.consume(a), t.exit("chunkContent"), n.next = t.enter("chunkContent", {
      contentType: "content",
      previous: n
    }), n = n.next, s;
  }
}
function jg(t, e, n) {
  const r = this;
  return s;
  function s(o) {
    return t.exit("chunkContent"), t.enter("lineEnding"), t.consume(o), t.exit("lineEnding"), U(t, i, "linePrefix");
  }
  function i(o) {
    if (o === null || B(o))
      return n(o);
    const a = r.events[r.events.length - 1];
    return !r.parser.constructs.disable.null.includes("codeIndented") && a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? e(o) : t.interrupt(r.parser.constructs.flow, n, e)(o);
  }
}
function la(t, e, n, r, s, i, o, a, l) {
  const u = l || Number.POSITIVE_INFINITY;
  let h = 0;
  return c;
  function c(y) {
    return y === 60 ? (t.enter(r), t.enter(s), t.enter(i), t.consume(y), t.exit(i), d) : y === null || y === 32 || y === 41 || on(y) ? n(y) : (t.enter(r), t.enter(o), t.enter(a), t.enter("chunkString", {
      contentType: "string"
    }), x(y));
  }
  function d(y) {
    return y === 62 ? (t.enter(i), t.consume(y), t.exit(i), t.exit(s), t.exit(r), e) : (t.enter(a), t.enter("chunkString", {
      contentType: "string"
    }), f(y));
  }
  function f(y) {
    return y === 62 ? (t.exit("chunkString"), t.exit(a), d(y)) : y === null || y === 60 || B(y) ? n(y) : (t.consume(y), y === 92 ? p : f);
  }
  function p(y) {
    return y === 60 || y === 62 || y === 92 ? (t.consume(y), f) : f(y);
  }
  function x(y) {
    return !h && (y === null || y === 41 || Y(y)) ? (t.exit("chunkString"), t.exit(a), t.exit(o), t.exit(r), e(y)) : h < u && y === 40 ? (t.consume(y), h++, x) : y === 41 ? (t.consume(y), h--, x) : y === null || y === 32 || y === 40 || on(y) ? n(y) : (t.consume(y), y === 92 ? S : x);
  }
  function S(y) {
    return y === 40 || y === 41 || y === 92 ? (t.consume(y), x) : x(y);
  }
}
function ua(t, e, n, r, s, i) {
  const o = this;
  let a = 0, l;
  return u;
  function u(f) {
    return t.enter(r), t.enter(s), t.consume(f), t.exit(s), t.enter(i), h;
  }
  function h(f) {
    return a > 999 || f === null || f === 91 || f === 93 && !l || // To do: remove in the future once we’ve switched from
    // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
    // which doesn’t need this.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    f === 94 && !a && "_hiddenFootnoteSupport" in o.parser.constructs ? n(f) : f === 93 ? (t.exit(i), t.enter(s), t.consume(f), t.exit(s), t.exit(r), e) : B(f) ? (t.enter("lineEnding"), t.consume(f), t.exit("lineEnding"), h) : (t.enter("chunkString", {
      contentType: "string"
    }), c(f));
  }
  function c(f) {
    return f === null || f === 91 || f === 93 || B(f) || a++ > 999 ? (t.exit("chunkString"), h(f)) : (t.consume(f), l || (l = !N(f)), f === 92 ? d : c);
  }
  function d(f) {
    return f === 91 || f === 92 || f === 93 ? (t.consume(f), a++, c) : c(f);
  }
}
function ca(t, e, n, r, s, i) {
  let o;
  return a;
  function a(d) {
    return d === 34 || d === 39 || d === 40 ? (t.enter(r), t.enter(s), t.consume(d), t.exit(s), o = d === 40 ? 41 : d, l) : n(d);
  }
  function l(d) {
    return d === o ? (t.enter(s), t.consume(d), t.exit(s), t.exit(r), e) : (t.enter(i), u(d));
  }
  function u(d) {
    return d === o ? (t.exit(i), l(o)) : d === null ? n(d) : B(d) ? (t.enter("lineEnding"), t.consume(d), t.exit("lineEnding"), U(t, u, "linePrefix")) : (t.enter("chunkString", {
      contentType: "string"
    }), h(d));
  }
  function h(d) {
    return d === o || d === null || B(d) ? (t.exit("chunkString"), u(d)) : (t.consume(d), d === 92 ? c : h);
  }
  function c(d) {
    return d === o || d === 92 ? (t.consume(d), h) : h(d);
  }
}
function vt(t, e) {
  let n;
  return r;
  function r(s) {
    return B(s) ? (t.enter("lineEnding"), t.consume(s), t.exit("lineEnding"), n = !0, r) : N(s) ? U(t, r, n ? "linePrefix" : "lineSuffix")(s) : e(s);
  }
}
const rx = {
  name: "definition",
  tokenize: Gg
}, Hg = {
  partial: !0,
  tokenize: Qg
};
function Gg(t, e, n) {
  const r = this;
  let s;
  return i;
  function i(f) {
    return t.enter("definition"), o(f);
  }
  function o(f) {
    return ua.call(
      r,
      t,
      a,
      // Note: we don’t need to reset the way `markdown-rs` does.
      n,
      "definitionLabel",
      "definitionLabelMarker",
      "definitionLabelString"
    )(f);
  }
  function a(f) {
    return s = ge(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1)), f === 58 ? (t.enter("definitionMarker"), t.consume(f), t.exit("definitionMarker"), l) : n(f);
  }
  function l(f) {
    return Y(f) ? vt(t, u)(f) : u(f);
  }
  function u(f) {
    return la(
      t,
      h,
      // Note: we don’t need to reset the way `markdown-rs` does.
      n,
      "definitionDestination",
      "definitionDestinationLiteral",
      "definitionDestinationLiteralMarker",
      "definitionDestinationRaw",
      "definitionDestinationString"
    )(f);
  }
  function h(f) {
    return t.attempt(Hg, c, c)(f);
  }
  function c(f) {
    return N(f) ? U(t, d, "whitespace")(f) : d(f);
  }
  function d(f) {
    return f === null || B(f) ? (t.exit("definition"), r.parser.defined.push(s), e(f)) : n(f);
  }
}
function Qg(t, e, n) {
  return r;
  function r(a) {
    return Y(a) ? vt(t, s)(a) : n(a);
  }
  function s(a) {
    return ca(t, i, n, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(a);
  }
  function i(a) {
    return N(a) ? U(t, o, "whitespace")(a) : o(a);
  }
  function o(a) {
    return a === null || B(a) ? e(a) : n(a);
  }
}
const sx = {
  name: "hardBreakEscape",
  tokenize: Wg
};
function Wg(t, e, n) {
  return r;
  function r(i) {
    return t.enter("hardBreakEscape"), t.consume(i), s;
  }
  function s(i) {
    return B(i) ? (t.exit("hardBreakEscape"), e(i)) : n(i);
  }
}
const ix = {
  name: "headingAtx",
  resolve: Yg,
  tokenize: Kg
};
function Yg(t, e) {
  let n = t.length - 2, r = 3, s, i;
  return t[r][1].type === "whitespace" && (r += 2), n - 2 > r && t[n][1].type === "whitespace" && (n -= 2), t[n][1].type === "atxHeadingSequence" && (r === n - 1 || n - 4 > r && t[n - 2][1].type === "whitespace") && (n -= r + 1 === n ? 2 : 4), n > r && (s = {
    type: "atxHeadingText",
    start: t[r][1].start,
    end: t[n][1].end
  }, i = {
    type: "chunkText",
    start: t[r][1].start,
    end: t[n][1].end,
    contentType: "text"
  }, xe(t, r, n - r + 1, [["enter", s, e], ["enter", i, e], ["exit", i, e], ["exit", s, e]])), t;
}
function Kg(t, e, n) {
  let r = 0;
  return s;
  function s(h) {
    return t.enter("atxHeading"), i(h);
  }
  function i(h) {
    return t.enter("atxHeadingSequence"), o(h);
  }
  function o(h) {
    return h === 35 && r++ < 6 ? (t.consume(h), o) : h === null || Y(h) ? (t.exit("atxHeadingSequence"), a(h)) : n(h);
  }
  function a(h) {
    return h === 35 ? (t.enter("atxHeadingSequence"), l(h)) : h === null || B(h) ? (t.exit("atxHeading"), e(h)) : N(h) ? U(t, a, "whitespace")(h) : (t.enter("atxHeadingText"), u(h));
  }
  function l(h) {
    return h === 35 ? (t.consume(h), l) : (t.exit("atxHeadingSequence"), a(h));
  }
  function u(h) {
    return h === null || h === 35 || Y(h) ? (t.exit("atxHeadingText"), a(h)) : (t.consume(h), u);
  }
}
const Jg = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
], $s = ["pre", "script", "style", "textarea"], ox = {
  concrete: !0,
  name: "htmlFlow",
  resolveTo: eb,
  tokenize: tb
}, Xg = {
  partial: !0,
  tokenize: rb
}, Zg = {
  partial: !0,
  tokenize: nb
};
function eb(t) {
  let e = t.length;
  for (; e-- && !(t[e][0] === "enter" && t[e][1].type === "htmlFlow"); )
    ;
  return e > 1 && t[e - 2][1].type === "linePrefix" && (t[e][1].start = t[e - 2][1].start, t[e + 1][1].start = t[e - 2][1].start, t.splice(e - 2, 2)), t;
}
function tb(t, e, n) {
  const r = this;
  let s, i, o, a, l;
  return u;
  function u(g) {
    return h(g);
  }
  function h(g) {
    return t.enter("htmlFlow"), t.enter("htmlFlowData"), t.consume(g), c;
  }
  function c(g) {
    return g === 33 ? (t.consume(g), d) : g === 47 ? (t.consume(g), i = !0, x) : g === 63 ? (t.consume(g), s = 3, r.interrupt ? e : m) : oe(g) ? (t.consume(g), o = String.fromCharCode(g), S) : n(g);
  }
  function d(g) {
    return g === 45 ? (t.consume(g), s = 2, f) : g === 91 ? (t.consume(g), s = 5, a = 0, p) : oe(g) ? (t.consume(g), s = 4, r.interrupt ? e : m) : n(g);
  }
  function f(g) {
    return g === 45 ? (t.consume(g), r.interrupt ? e : m) : n(g);
  }
  function p(g) {
    const ve = "CDATA[";
    return g === ve.charCodeAt(a++) ? (t.consume(g), a === ve.length ? r.interrupt ? e : O : p) : n(g);
  }
  function x(g) {
    return oe(g) ? (t.consume(g), o = String.fromCharCode(g), S) : n(g);
  }
  function S(g) {
    if (g === null || g === 47 || g === 62 || Y(g)) {
      const ve = g === 47, Dt = o.toLowerCase();
      return !ve && !i && $s.includes(Dt) ? (s = 1, r.interrupt ? e(g) : O(g)) : Jg.includes(o.toLowerCase()) ? (s = 6, ve ? (t.consume(g), y) : r.interrupt ? e(g) : O(g)) : (s = 7, r.interrupt && !r.parser.lazy[r.now().line] ? n(g) : i ? T(g) : R(g));
    }
    return g === 45 || ie(g) ? (t.consume(g), o += String.fromCharCode(g), S) : n(g);
  }
  function y(g) {
    return g === 62 ? (t.consume(g), r.interrupt ? e : O) : n(g);
  }
  function T(g) {
    return N(g) ? (t.consume(g), T) : w(g);
  }
  function R(g) {
    return g === 47 ? (t.consume(g), w) : g === 58 || g === 95 || oe(g) ? (t.consume(g), C) : N(g) ? (t.consume(g), R) : w(g);
  }
  function C(g) {
    return g === 45 || g === 46 || g === 58 || g === 95 || ie(g) ? (t.consume(g), C) : I(g);
  }
  function I(g) {
    return g === 61 ? (t.consume(g), b) : N(g) ? (t.consume(g), I) : R(g);
  }
  function b(g) {
    return g === null || g === 60 || g === 61 || g === 62 || g === 96 ? n(g) : g === 34 || g === 39 ? (t.consume(g), l = g, E) : N(g) ? (t.consume(g), b) : A(g);
  }
  function E(g) {
    return g === l ? (t.consume(g), l = null, D) : g === null || B(g) ? n(g) : (t.consume(g), E);
  }
  function A(g) {
    return g === null || g === 34 || g === 39 || g === 47 || g === 60 || g === 61 || g === 62 || g === 96 || Y(g) ? I(g) : (t.consume(g), A);
  }
  function D(g) {
    return g === 47 || g === 62 || N(g) ? R(g) : n(g);
  }
  function w(g) {
    return g === 62 ? (t.consume(g), L) : n(g);
  }
  function L(g) {
    return g === null || B(g) ? O(g) : N(g) ? (t.consume(g), L) : n(g);
  }
  function O(g) {
    return g === 45 && s === 2 ? (t.consume(g), K) : g === 60 && s === 1 ? (t.consume(g), ee) : g === 62 && s === 4 ? (t.consume(g), we) : g === 63 && s === 3 ? (t.consume(g), m) : g === 93 && s === 5 ? (t.consume(g), ue) : B(g) && (s === 6 || s === 7) ? (t.exit("htmlFlowData"), t.check(Xg, mt, V)(g)) : g === null || B(g) ? (t.exit("htmlFlowData"), V(g)) : (t.consume(g), O);
  }
  function V(g) {
    return t.check(Zg, G, mt)(g);
  }
  function G(g) {
    return t.enter("lineEnding"), t.consume(g), t.exit("lineEnding"), F;
  }
  function F(g) {
    return g === null || B(g) ? V(g) : (t.enter("htmlFlowData"), O(g));
  }
  function K(g) {
    return g === 45 ? (t.consume(g), m) : O(g);
  }
  function ee(g) {
    return g === 47 ? (t.consume(g), o = "", j) : O(g);
  }
  function j(g) {
    if (g === 62) {
      const ve = o.toLowerCase();
      return $s.includes(ve) ? (t.consume(g), we) : O(g);
    }
    return oe(g) && o.length < 8 ? (t.consume(g), o += String.fromCharCode(g), j) : O(g);
  }
  function ue(g) {
    return g === 93 ? (t.consume(g), m) : O(g);
  }
  function m(g) {
    return g === 62 ? (t.consume(g), we) : g === 45 && s === 2 ? (t.consume(g), m) : O(g);
  }
  function we(g) {
    return g === null || B(g) ? (t.exit("htmlFlowData"), mt(g)) : (t.consume(g), we);
  }
  function mt(g) {
    return t.exit("htmlFlow"), e(g);
  }
}
function nb(t, e, n) {
  const r = this;
  return s;
  function s(o) {
    return B(o) ? (t.enter("lineEnding"), t.consume(o), t.exit("lineEnding"), i) : n(o);
  }
  function i(o) {
    return r.parser.lazy[r.now().line] ? n(o) : e(o);
  }
}
function rb(t, e, n) {
  return r;
  function r(s) {
    return t.enter("lineEnding"), t.consume(s), t.exit("lineEnding"), t.attempt(_n, e, n);
  }
}
const ax = {
  name: "htmlText",
  tokenize: sb
};
function sb(t, e, n) {
  const r = this;
  let s, i, o;
  return a;
  function a(m) {
    return t.enter("htmlText"), t.enter("htmlTextData"), t.consume(m), l;
  }
  function l(m) {
    return m === 33 ? (t.consume(m), u) : m === 47 ? (t.consume(m), I) : m === 63 ? (t.consume(m), R) : oe(m) ? (t.consume(m), A) : n(m);
  }
  function u(m) {
    return m === 45 ? (t.consume(m), h) : m === 91 ? (t.consume(m), i = 0, p) : oe(m) ? (t.consume(m), T) : n(m);
  }
  function h(m) {
    return m === 45 ? (t.consume(m), f) : n(m);
  }
  function c(m) {
    return m === null ? n(m) : m === 45 ? (t.consume(m), d) : B(m) ? (o = c, ee(m)) : (t.consume(m), c);
  }
  function d(m) {
    return m === 45 ? (t.consume(m), f) : c(m);
  }
  function f(m) {
    return m === 62 ? K(m) : m === 45 ? d(m) : c(m);
  }
  function p(m) {
    const we = "CDATA[";
    return m === we.charCodeAt(i++) ? (t.consume(m), i === we.length ? x : p) : n(m);
  }
  function x(m) {
    return m === null ? n(m) : m === 93 ? (t.consume(m), S) : B(m) ? (o = x, ee(m)) : (t.consume(m), x);
  }
  function S(m) {
    return m === 93 ? (t.consume(m), y) : x(m);
  }
  function y(m) {
    return m === 62 ? K(m) : m === 93 ? (t.consume(m), y) : x(m);
  }
  function T(m) {
    return m === null || m === 62 ? K(m) : B(m) ? (o = T, ee(m)) : (t.consume(m), T);
  }
  function R(m) {
    return m === null ? n(m) : m === 63 ? (t.consume(m), C) : B(m) ? (o = R, ee(m)) : (t.consume(m), R);
  }
  function C(m) {
    return m === 62 ? K(m) : R(m);
  }
  function I(m) {
    return oe(m) ? (t.consume(m), b) : n(m);
  }
  function b(m) {
    return m === 45 || ie(m) ? (t.consume(m), b) : E(m);
  }
  function E(m) {
    return B(m) ? (o = E, ee(m)) : N(m) ? (t.consume(m), E) : K(m);
  }
  function A(m) {
    return m === 45 || ie(m) ? (t.consume(m), A) : m === 47 || m === 62 || Y(m) ? D(m) : n(m);
  }
  function D(m) {
    return m === 47 ? (t.consume(m), K) : m === 58 || m === 95 || oe(m) ? (t.consume(m), w) : B(m) ? (o = D, ee(m)) : N(m) ? (t.consume(m), D) : K(m);
  }
  function w(m) {
    return m === 45 || m === 46 || m === 58 || m === 95 || ie(m) ? (t.consume(m), w) : L(m);
  }
  function L(m) {
    return m === 61 ? (t.consume(m), O) : B(m) ? (o = L, ee(m)) : N(m) ? (t.consume(m), L) : D(m);
  }
  function O(m) {
    return m === null || m === 60 || m === 61 || m === 62 || m === 96 ? n(m) : m === 34 || m === 39 ? (t.consume(m), s = m, V) : B(m) ? (o = O, ee(m)) : N(m) ? (t.consume(m), O) : (t.consume(m), G);
  }
  function V(m) {
    return m === s ? (t.consume(m), s = void 0, F) : m === null ? n(m) : B(m) ? (o = V, ee(m)) : (t.consume(m), V);
  }
  function G(m) {
    return m === null || m === 34 || m === 39 || m === 60 || m === 61 || m === 96 ? n(m) : m === 47 || m === 62 || Y(m) ? D(m) : (t.consume(m), G);
  }
  function F(m) {
    return m === 47 || m === 62 || Y(m) ? D(m) : n(m);
  }
  function K(m) {
    return m === 62 ? (t.consume(m), t.exit("htmlTextData"), t.exit("htmlText"), e) : n(m);
  }
  function ee(m) {
    return t.exit("htmlTextData"), t.enter("lineEnding"), t.consume(m), t.exit("lineEnding"), j;
  }
  function j(m) {
    return N(m) ? U(t, ue, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(m) : ue(m);
  }
  function ue(m) {
    return t.enter("htmlTextData"), o(m);
  }
}
const ha = {
  name: "labelEnd",
  resolveAll: lb,
  resolveTo: ub,
  tokenize: cb
}, ib = {
  tokenize: hb
}, ob = {
  tokenize: db
}, ab = {
  tokenize: fb
};
function lb(t) {
  let e = -1;
  const n = [];
  for (; ++e < t.length; ) {
    const r = t[e][1];
    if (n.push(t[e]), r.type === "labelImage" || r.type === "labelLink" || r.type === "labelEnd") {
      const s = r.type === "labelImage" ? 4 : 2;
      r.type = "data", e += s;
    }
  }
  return t.length !== n.length && xe(t, 0, t.length, n), t;
}
function ub(t, e) {
  let n = t.length, r = 0, s, i, o, a;
  for (; n--; )
    if (s = t[n][1], i) {
      if (s.type === "link" || s.type === "labelLink" && s._inactive)
        break;
      t[n][0] === "enter" && s.type === "labelLink" && (s._inactive = !0);
    } else if (o) {
      if (t[n][0] === "enter" && (s.type === "labelImage" || s.type === "labelLink") && !s._balanced && (i = n, s.type !== "labelLink")) {
        r = 2;
        break;
      }
    } else s.type === "labelEnd" && (o = n);
  const l = {
    type: t[i][1].type === "labelLink" ? "link" : "image",
    start: {
      ...t[i][1].start
    },
    end: {
      ...t[t.length - 1][1].end
    }
  }, u = {
    type: "label",
    start: {
      ...t[i][1].start
    },
    end: {
      ...t[o][1].end
    }
  }, h = {
    type: "labelText",
    start: {
      ...t[i + r + 2][1].end
    },
    end: {
      ...t[o - 2][1].start
    }
  };
  return a = [["enter", l, e], ["enter", u, e]], a = pe(a, t.slice(i + 1, i + r + 3)), a = pe(a, [["enter", h, e]]), a = pe(a, Fr(e.parser.constructs.insideSpan.null, t.slice(i + r + 4, o - 3), e)), a = pe(a, [["exit", h, e], t[o - 2], t[o - 1], ["exit", u, e]]), a = pe(a, t.slice(o + 1)), a = pe(a, [["exit", l, e]]), xe(t, i, t.length, a), t;
}
function cb(t, e, n) {
  const r = this;
  let s = r.events.length, i, o;
  for (; s--; )
    if ((r.events[s][1].type === "labelImage" || r.events[s][1].type === "labelLink") && !r.events[s][1]._balanced) {
      i = r.events[s][1];
      break;
    }
  return a;
  function a(d) {
    return i ? i._inactive ? c(d) : (o = r.parser.defined.includes(ge(r.sliceSerialize({
      start: i.end,
      end: r.now()
    }))), t.enter("labelEnd"), t.enter("labelMarker"), t.consume(d), t.exit("labelMarker"), t.exit("labelEnd"), l) : n(d);
  }
  function l(d) {
    return d === 40 ? t.attempt(ib, h, o ? h : c)(d) : d === 91 ? t.attempt(ob, h, o ? u : c)(d) : o ? h(d) : c(d);
  }
  function u(d) {
    return t.attempt(ab, h, c)(d);
  }
  function h(d) {
    return e(d);
  }
  function c(d) {
    return i._balanced = !0, n(d);
  }
}
function hb(t, e, n) {
  return r;
  function r(c) {
    return t.enter("resource"), t.enter("resourceMarker"), t.consume(c), t.exit("resourceMarker"), s;
  }
  function s(c) {
    return Y(c) ? vt(t, i)(c) : i(c);
  }
  function i(c) {
    return c === 41 ? h(c) : la(t, o, a, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(c);
  }
  function o(c) {
    return Y(c) ? vt(t, l)(c) : h(c);
  }
  function a(c) {
    return n(c);
  }
  function l(c) {
    return c === 34 || c === 39 || c === 40 ? ca(t, u, n, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(c) : h(c);
  }
  function u(c) {
    return Y(c) ? vt(t, h)(c) : h(c);
  }
  function h(c) {
    return c === 41 ? (t.enter("resourceMarker"), t.consume(c), t.exit("resourceMarker"), t.exit("resource"), e) : n(c);
  }
}
function db(t, e, n) {
  const r = this;
  return s;
  function s(a) {
    return ua.call(r, t, i, o, "reference", "referenceMarker", "referenceString")(a);
  }
  function i(a) {
    return r.parser.defined.includes(ge(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1))) ? e(a) : n(a);
  }
  function o(a) {
    return n(a);
  }
}
function fb(t, e, n) {
  return r;
  function r(i) {
    return t.enter("reference"), t.enter("referenceMarker"), t.consume(i), t.exit("referenceMarker"), s;
  }
  function s(i) {
    return i === 93 ? (t.enter("referenceMarker"), t.consume(i), t.exit("referenceMarker"), t.exit("reference"), e) : n(i);
  }
}
const lx = {
  name: "labelStartImage",
  resolveAll: ha.resolveAll,
  tokenize: pb
};
function pb(t, e, n) {
  const r = this;
  return s;
  function s(a) {
    return t.enter("labelImage"), t.enter("labelImageMarker"), t.consume(a), t.exit("labelImageMarker"), i;
  }
  function i(a) {
    return a === 91 ? (t.enter("labelMarker"), t.consume(a), t.exit("labelMarker"), t.exit("labelImage"), o) : n(a);
  }
  function o(a) {
    return a === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(a) : e(a);
  }
}
const ux = {
  name: "labelStartLink",
  resolveAll: ha.resolveAll,
  tokenize: mb
};
function mb(t, e, n) {
  const r = this;
  return s;
  function s(o) {
    return t.enter("labelLink"), t.enter("labelMarker"), t.consume(o), t.exit("labelMarker"), t.exit("labelLink"), i;
  }
  function i(o) {
    return o === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(o) : e(o);
  }
}
const cx = {
  name: "lineEnding",
  tokenize: gb
};
function gb(t, e) {
  return n;
  function n(r) {
    return t.enter("lineEnding"), t.consume(r), t.exit("lineEnding"), U(t, e, "linePrefix");
  }
}
const bb = {
  name: "thematicBreak",
  tokenize: yb
};
function yb(t, e, n) {
  let r = 0, s;
  return i;
  function i(u) {
    return t.enter("thematicBreak"), o(u);
  }
  function o(u) {
    return s = u, a(u);
  }
  function a(u) {
    return u === s ? (t.enter("thematicBreakSequence"), l(u)) : r >= 3 && (u === null || B(u)) ? (t.exit("thematicBreak"), e(u)) : n(u);
  }
  function l(u) {
    return u === s ? (t.consume(u), r++, l) : (t.exit("thematicBreakSequence"), N(u) ? U(t, a, "whitespace")(u) : a(u));
  }
}
const _b = {
  continuation: {
    tokenize: vb
  },
  exit: Tb,
  name: "list",
  tokenize: wb
}, xb = {
  partial: !0,
  tokenize: Cb
}, Sb = {
  partial: !0,
  tokenize: kb
};
function wb(t, e, n) {
  const r = this, s = r.events[r.events.length - 1];
  let i = s && s[1].type === "linePrefix" ? s[2].sliceSerialize(s[1], !0).length : 0, o = 0;
  return a;
  function a(f) {
    const p = r.containerState.type || (f === 42 || f === 43 || f === 45 ? "listUnordered" : "listOrdered");
    if (p === "listUnordered" ? !r.containerState.marker || f === r.containerState.marker : Jn(f)) {
      if (r.containerState.type || (r.containerState.type = p, t.enter(p, {
        _container: !0
      })), p === "listUnordered")
        return t.enter("listItemPrefix"), f === 42 || f === 45 ? t.check(bb, n, u)(f) : u(f);
      if (!r.interrupt || f === 49)
        return t.enter("listItemPrefix"), t.enter("listItemValue"), l(f);
    }
    return n(f);
  }
  function l(f) {
    return Jn(f) && ++o < 10 ? (t.consume(f), l) : (!r.interrupt || o < 2) && (r.containerState.marker ? f === r.containerState.marker : f === 41 || f === 46) ? (t.exit("listItemValue"), u(f)) : n(f);
  }
  function u(f) {
    return t.enter("listItemMarker"), t.consume(f), t.exit("listItemMarker"), r.containerState.marker = r.containerState.marker || f, t.check(
      _n,
      // Can’t be empty when interrupting.
      r.interrupt ? n : h,
      t.attempt(xb, d, c)
    );
  }
  function h(f) {
    return r.containerState.initialBlankLine = !0, i++, d(f);
  }
  function c(f) {
    return N(f) ? (t.enter("listItemPrefixWhitespace"), t.consume(f), t.exit("listItemPrefixWhitespace"), d) : n(f);
  }
  function d(f) {
    return r.containerState.size = i + r.sliceSerialize(t.exit("listItemPrefix"), !0).length, e(f);
  }
}
function vb(t, e, n) {
  const r = this;
  return r.containerState._closeFlow = void 0, t.check(_n, s, i);
  function s(a) {
    return r.containerState.furtherBlankLines = r.containerState.furtherBlankLines || r.containerState.initialBlankLine, U(t, e, "listItemIndent", r.containerState.size + 1)(a);
  }
  function i(a) {
    return r.containerState.furtherBlankLines || !N(a) ? (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, o(a)) : (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, t.attempt(Sb, e, o)(a));
  }
  function o(a) {
    return r.containerState._closeFlow = !0, r.interrupt = void 0, U(t, t.attempt(_b, e, n), "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(a);
  }
}
function kb(t, e, n) {
  const r = this;
  return U(t, s, "listItemIndent", r.containerState.size + 1);
  function s(i) {
    const o = r.events[r.events.length - 1];
    return o && o[1].type === "listItemIndent" && o[2].sliceSerialize(o[1], !0).length === r.containerState.size ? e(i) : n(i);
  }
}
function Tb(t) {
  t.exit(this.containerState.type);
}
function Cb(t, e, n) {
  const r = this;
  return U(t, s, "listItemPrefixWhitespace", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5);
  function s(i) {
    const o = r.events[r.events.length - 1];
    return !N(i) && o && o[1].type === "listItemPrefixWhitespace" ? e(i) : n(i);
  }
}
const hx = {
  name: "setextUnderline",
  resolveTo: Ib,
  tokenize: Eb
};
function Ib(t, e) {
  let n = t.length, r, s, i;
  for (; n--; )
    if (t[n][0] === "enter") {
      if (t[n][1].type === "content") {
        r = n;
        break;
      }
      t[n][1].type === "paragraph" && (s = n);
    } else
      t[n][1].type === "content" && t.splice(n, 1), !i && t[n][1].type === "definition" && (i = n);
  const o = {
    type: "setextHeading",
    start: {
      ...t[r][1].start
    },
    end: {
      ...t[t.length - 1][1].end
    }
  };
  return t[s][1].type = "setextHeadingText", i ? (t.splice(s, 0, ["enter", o, e]), t.splice(i + 1, 0, ["exit", t[r][1], e]), t[r][1].end = {
    ...t[i][1].end
  }) : t[r][1] = o, t.push(["exit", o, e]), t;
}
function Eb(t, e, n) {
  const r = this;
  let s;
  return i;
  function i(u) {
    let h = r.events.length, c;
    for (; h--; )
      if (r.events[h][1].type !== "lineEnding" && r.events[h][1].type !== "linePrefix" && r.events[h][1].type !== "content") {
        c = r.events[h][1].type === "paragraph";
        break;
      }
    return !r.parser.lazy[r.now().line] && (r.interrupt || c) ? (t.enter("setextHeadingLine"), s = u, o(u)) : n(u);
  }
  function o(u) {
    return t.enter("setextHeadingLineSequence"), a(u);
  }
  function a(u) {
    return u === s ? (t.consume(u), a) : (t.exit("setextHeadingLineSequence"), N(u) ? U(t, l, "lineSuffix")(u) : l(u));
  }
  function l(u) {
    return u === null || B(u) ? (t.exit("setextHeadingLine"), e(u)) : n(u);
  }
}
const Ab = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function Rb(t) {
  return t.replace(Ab, Mb);
}
function Mb(t, e, n) {
  if (e)
    return e;
  if (n.charCodeAt(0) === 35) {
    const s = n.charCodeAt(1), i = s === 120 || s === 88;
    return aa(n.slice(i ? 2 : 1), i ? 16 : 10);
  }
  return tr(n) || t;
}
const da = {}.hasOwnProperty;
function Pb(t, e, n) {
  return e && typeof e == "object" && (n = e, e = void 0), Db(n)(pl(ml(n).document().write(gl()(t, e, !0))));
}
function Db(t) {
  const e = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: i(Hr),
      autolinkProtocol: D,
      autolinkEmail: D,
      atxHeading: i(Ur),
      blockQuote: i(Ga),
      characterEscape: D,
      characterReference: D,
      codeFenced: i(Vr),
      codeFencedFenceInfo: o,
      codeFencedFenceMeta: o,
      codeIndented: i(Vr, o),
      codeText: i(Qa, o),
      codeTextData: D,
      data: D,
      codeFlowValue: D,
      definition: i(Wa),
      definitionDestinationString: o,
      definitionLabelString: o,
      definitionTitleString: o,
      emphasis: i(Ya),
      hardBreakEscape: i(qr),
      hardBreakTrailing: i(qr),
      htmlFlow: i(jr, o),
      htmlFlowData: D,
      htmlText: i(jr, o),
      htmlTextData: D,
      image: i(Ka),
      label: o,
      link: i(Hr),
      listItem: i(Ja),
      listItemValue: d,
      listOrdered: i(Gr, c),
      listUnordered: i(Gr),
      paragraph: i(Xa),
      reference: g,
      referenceString: o,
      resourceDestinationString: o,
      resourceTitleString: o,
      setextHeading: i(Ur),
      strong: i(Za),
      thematicBreak: i(tl)
    },
    exit: {
      atxHeading: l(),
      atxHeadingSequence: I,
      autolink: l(),
      autolinkEmail: Ha,
      autolinkProtocol: ja,
      blockQuote: l(),
      characterEscapeValue: w,
      characterReferenceMarkerHexadecimal: Dt,
      characterReferenceMarkerNumeric: Dt,
      characterReferenceValue: Ua,
      characterReference: qa,
      codeFenced: l(S),
      codeFencedFence: x,
      codeFencedFenceInfo: f,
      codeFencedFenceMeta: p,
      codeFlowValue: w,
      codeIndented: l(y),
      codeText: l(F),
      codeTextData: w,
      data: w,
      definition: l(),
      definitionDestinationString: C,
      definitionLabelString: T,
      definitionTitleString: R,
      emphasis: l(),
      hardBreakEscape: l(O),
      hardBreakTrailing: l(O),
      htmlFlow: l(V),
      htmlFlowData: w,
      htmlText: l(G),
      htmlTextData: w,
      image: l(ee),
      label: ue,
      labelText: j,
      lineEnding: L,
      link: l(K),
      listItem: l(),
      listOrdered: l(),
      listUnordered: l(),
      paragraph: l(),
      referenceString: ve,
      resourceDestinationString: m,
      resourceTitleString: we,
      resource: mt,
      setextHeading: l(A),
      setextHeadingLineSequence: E,
      setextHeadingText: b,
      strong: l(),
      thematicBreak: l()
    }
  };
  fa(e, (t || {}).mdastExtensions || []);
  const n = {};
  return r;
  function r(k) {
    let M = {
      type: "root",
      children: []
    };
    const $ = {
      stack: [M],
      tokenStack: [],
      config: e,
      enter: a,
      exit: u,
      buffer: o,
      resume: h,
      data: n
    }, z = [];
    let W = -1;
    for (; ++W < k.length; )
      if (k[W][1].type === "listOrdered" || k[W][1].type === "listUnordered")
        if (k[W][0] === "enter")
          z.push(W);
        else {
          const fe = z.pop();
          W = s(k, fe, W);
        }
    for (W = -1; ++W < k.length; ) {
      const fe = e[k[W][0]];
      da.call(fe, k[W][1].type) && fe[k[W][1].type].call(Object.assign({
        sliceSerialize: k[W][2].sliceSerialize
      }, $), k[W][1]);
    }
    if ($.tokenStack.length > 0) {
      const fe = $.tokenStack[$.tokenStack.length - 1];
      (fe[1] || Ns).call($, void 0, fe[0]);
    }
    for (M.position = {
      start: Be(k.length > 0 ? k[0][1].start : {
        line: 1,
        column: 1,
        offset: 0
      }),
      end: Be(k.length > 0 ? k[k.length - 2][1].end : {
        line: 1,
        column: 1,
        offset: 0
      })
    }, W = -1; ++W < e.transforms.length; )
      M = e.transforms[W](M) || M;
    return M;
  }
  function s(k, M, $) {
    let z = M - 1, W = -1, fe = !1, Ne, ke, gt, bt;
    for (; ++z <= $; ) {
      const ae = k[z];
      switch (ae[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote": {
          ae[0] === "enter" ? W++ : W--, bt = void 0;
          break;
        }
        case "lineEndingBlank": {
          ae[0] === "enter" && (Ne && !bt && !W && !gt && (gt = z), bt = void 0);
          break;
        }
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace":
          break;
        default:
          bt = void 0;
      }
      if (!W && ae[0] === "enter" && ae[1].type === "listItemPrefix" || W === -1 && ae[0] === "exit" && (ae[1].type === "listUnordered" || ae[1].type === "listOrdered")) {
        if (Ne) {
          let tt = z;
          for (ke = void 0; tt--; ) {
            const Te = k[tt];
            if (Te[1].type === "lineEnding" || Te[1].type === "lineEndingBlank") {
              if (Te[0] === "exit") continue;
              ke && (k[ke][1].type = "lineEndingBlank", fe = !0), Te[1].type = "lineEnding", ke = tt;
            } else if (!(Te[1].type === "linePrefix" || Te[1].type === "blockQuotePrefix" || Te[1].type === "blockQuotePrefixWhitespace" || Te[1].type === "blockQuoteMarker" || Te[1].type === "listItemIndent")) break;
          }
          gt && (!ke || gt < ke) && (Ne._spread = !0), Ne.end = Object.assign({}, ke ? k[ke][1].start : ae[1].end), k.splice(ke || z, 0, ["exit", Ne, ae[2]]), z++, $++;
        }
        if (ae[1].type === "listItemPrefix") {
          const tt = {
            type: "listItem",
            _spread: !1,
            start: Object.assign({}, ae[1].start),
            // @ts-expect-error: we’ll add `end` in a second.
            end: void 0
          };
          Ne = tt, k.splice(z, 0, ["enter", tt, ae[2]]), z++, $++, gt = void 0, bt = !0;
        }
      }
    }
    return k[M][1]._spread = fe, $;
  }
  function i(k, M) {
    return $;
    function $(z) {
      a.call(this, k(z), z), M && M.call(this, z);
    }
  }
  function o() {
    this.stack.push({
      type: "fragment",
      children: []
    });
  }
  function a(k, M, $) {
    this.stack[this.stack.length - 1].children.push(k), this.stack.push(k), this.tokenStack.push([M, $ || void 0]), k.position = {
      start: Be(M.start),
      // @ts-expect-error: `end` will be patched later.
      end: void 0
    };
  }
  function l(k) {
    return M;
    function M($) {
      k && k.call(this, $), u.call(this, $);
    }
  }
  function u(k, M) {
    const $ = this.stack.pop(), z = this.tokenStack.pop();
    if (z)
      z[0].type !== k.type && (M ? M.call(this, k, z[0]) : (z[1] || Ns).call(this, k, z[0]));
    else throw new Error("Cannot close `" + k.type + "` (" + Gt({
      start: k.start,
      end: k.end
    }) + "): it’s not open");
    $.position.end = Be(k.end);
  }
  function h() {
    return Or(this.stack.pop());
  }
  function c() {
    this.data.expectingFirstListItemValue = !0;
  }
  function d(k) {
    if (this.data.expectingFirstListItemValue) {
      const M = this.stack[this.stack.length - 2];
      M.start = Number.parseInt(this.sliceSerialize(k), 10), this.data.expectingFirstListItemValue = void 0;
    }
  }
  function f() {
    const k = this.resume(), M = this.stack[this.stack.length - 1];
    M.lang = k;
  }
  function p() {
    const k = this.resume(), M = this.stack[this.stack.length - 1];
    M.meta = k;
  }
  function x() {
    this.data.flowCodeInside || (this.buffer(), this.data.flowCodeInside = !0);
  }
  function S() {
    const k = this.resume(), M = this.stack[this.stack.length - 1];
    M.value = k.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""), this.data.flowCodeInside = void 0;
  }
  function y() {
    const k = this.resume(), M = this.stack[this.stack.length - 1];
    M.value = k.replace(/(\r?\n|\r)$/g, "");
  }
  function T(k) {
    const M = this.resume(), $ = this.stack[this.stack.length - 1];
    $.label = M, $.identifier = ge(this.sliceSerialize(k)).toLowerCase();
  }
  function R() {
    const k = this.resume(), M = this.stack[this.stack.length - 1];
    M.title = k;
  }
  function C() {
    const k = this.resume(), M = this.stack[this.stack.length - 1];
    M.url = k;
  }
  function I(k) {
    const M = this.stack[this.stack.length - 1];
    if (!M.depth) {
      const $ = this.sliceSerialize(k).length;
      M.depth = $;
    }
  }
  function b() {
    this.data.setextHeadingSlurpLineEnding = !0;
  }
  function E(k) {
    const M = this.stack[this.stack.length - 1];
    M.depth = this.sliceSerialize(k).codePointAt(0) === 61 ? 1 : 2;
  }
  function A() {
    this.data.setextHeadingSlurpLineEnding = void 0;
  }
  function D(k) {
    const $ = this.stack[this.stack.length - 1].children;
    let z = $[$.length - 1];
    (!z || z.type !== "text") && (z = el(), z.position = {
      start: Be(k.start),
      // @ts-expect-error: we’ll add `end` later.
      end: void 0
    }, $.push(z)), this.stack.push(z);
  }
  function w(k) {
    const M = this.stack.pop();
    M.value += this.sliceSerialize(k), M.position.end = Be(k.end);
  }
  function L(k) {
    const M = this.stack[this.stack.length - 1];
    if (this.data.atHardBreak) {
      const $ = M.children[M.children.length - 1];
      $.position.end = Be(k.end), this.data.atHardBreak = void 0;
      return;
    }
    !this.data.setextHeadingSlurpLineEnding && e.canContainEols.includes(M.type) && (D.call(this, k), w.call(this, k));
  }
  function O() {
    this.data.atHardBreak = !0;
  }
  function V() {
    const k = this.resume(), M = this.stack[this.stack.length - 1];
    M.value = k;
  }
  function G() {
    const k = this.resume(), M = this.stack[this.stack.length - 1];
    M.value = k;
  }
  function F() {
    const k = this.resume(), M = this.stack[this.stack.length - 1];
    M.value = k;
  }
  function K() {
    const k = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const M = this.data.referenceType || "shortcut";
      k.type += "Reference", k.referenceType = M, delete k.url, delete k.title;
    } else
      delete k.identifier, delete k.label;
    this.data.referenceType = void 0;
  }
  function ee() {
    const k = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const M = this.data.referenceType || "shortcut";
      k.type += "Reference", k.referenceType = M, delete k.url, delete k.title;
    } else
      delete k.identifier, delete k.label;
    this.data.referenceType = void 0;
  }
  function j(k) {
    const M = this.sliceSerialize(k), $ = this.stack[this.stack.length - 2];
    $.label = Rb(M), $.identifier = ge(M).toLowerCase();
  }
  function ue() {
    const k = this.stack[this.stack.length - 1], M = this.resume(), $ = this.stack[this.stack.length - 1];
    if (this.data.inReference = !0, $.type === "link") {
      const z = k.children;
      $.children = z;
    } else
      $.alt = M;
  }
  function m() {
    const k = this.resume(), M = this.stack[this.stack.length - 1];
    M.url = k;
  }
  function we() {
    const k = this.resume(), M = this.stack[this.stack.length - 1];
    M.title = k;
  }
  function mt() {
    this.data.inReference = void 0;
  }
  function g() {
    this.data.referenceType = "collapsed";
  }
  function ve(k) {
    const M = this.resume(), $ = this.stack[this.stack.length - 1];
    $.label = M, $.identifier = ge(this.sliceSerialize(k)).toLowerCase(), this.data.referenceType = "full";
  }
  function Dt(k) {
    this.data.characterReferenceType = k.type;
  }
  function Ua(k) {
    const M = this.sliceSerialize(k), $ = this.data.characterReferenceType;
    let z;
    $ ? (z = aa(M, $ === "characterReferenceMarkerNumeric" ? 10 : 16), this.data.characterReferenceType = void 0) : z = tr(M);
    const W = this.stack[this.stack.length - 1];
    W.value += z;
  }
  function qa(k) {
    const M = this.stack.pop();
    M.position.end = Be(k.end);
  }
  function ja(k) {
    w.call(this, k);
    const M = this.stack[this.stack.length - 1];
    M.url = this.sliceSerialize(k);
  }
  function Ha(k) {
    w.call(this, k);
    const M = this.stack[this.stack.length - 1];
    M.url = "mailto:" + this.sliceSerialize(k);
  }
  function Ga() {
    return {
      type: "blockquote",
      children: []
    };
  }
  function Vr() {
    return {
      type: "code",
      lang: null,
      meta: null,
      value: ""
    };
  }
  function Qa() {
    return {
      type: "inlineCode",
      value: ""
    };
  }
  function Wa() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: ""
    };
  }
  function Ya() {
    return {
      type: "emphasis",
      children: []
    };
  }
  function Ur() {
    return {
      type: "heading",
      // @ts-expect-error `depth` will be set later.
      depth: 0,
      children: []
    };
  }
  function qr() {
    return {
      type: "break"
    };
  }
  function jr() {
    return {
      type: "html",
      value: ""
    };
  }
  function Ka() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null
    };
  }
  function Hr() {
    return {
      type: "link",
      title: null,
      url: "",
      children: []
    };
  }
  function Gr(k) {
    return {
      type: "list",
      ordered: k.type === "listOrdered",
      start: null,
      spread: k._spread,
      children: []
    };
  }
  function Ja(k) {
    return {
      type: "listItem",
      spread: k._spread,
      checked: null,
      children: []
    };
  }
  function Xa() {
    return {
      type: "paragraph",
      children: []
    };
  }
  function Za() {
    return {
      type: "strong",
      children: []
    };
  }
  function el() {
    return {
      type: "text",
      value: ""
    };
  }
  function tl() {
    return {
      type: "thematicBreak"
    };
  }
}
function Be(t) {
  return {
    line: t.line,
    column: t.column,
    offset: t.offset
  };
}
function fa(t, e) {
  let n = -1;
  for (; ++n < e.length; ) {
    const r = e[n];
    Array.isArray(r) ? fa(t, r) : Bb(t, r);
  }
}
function Bb(t, e) {
  let n;
  for (n in e)
    if (da.call(e, n))
      switch (n) {
        case "canContainEols": {
          const r = e[n];
          r && t[n].push(...r);
          break;
        }
        case "transforms": {
          const r = e[n];
          r && t[n].push(...r);
          break;
        }
        case "enter":
        case "exit": {
          const r = e[n];
          r && Object.assign(t[n], r);
          break;
        }
      }
}
function Ns(t, e) {
  throw t ? new Error("Cannot close `" + t.type + "` (" + Gt({
    start: t.start,
    end: t.end
  }) + "): a different token (`" + e.type + "`, " + Gt({
    start: e.start,
    end: e.end
  }) + ") is open") : new Error("Cannot close document, a token (`" + e.type + "`, " + Gt({
    start: e.start,
    end: e.end
  }) + ") is still open");
}
function Ob(t) {
  const e = this;
  e.parser = n;
  function n(r) {
    return Pb(r, {
      ...e.data("settings"),
      ...t,
      // Note: these options are not in the readme.
      // The goal is for them to be set by plugins on `data` instead of being
      // passed by users.
      extensions: e.data("micromarkExtensions") || [],
      mdastExtensions: e.data("fromMarkdownExtensions") || []
    });
  }
}
function Fb(t, e) {
  const n = {
    type: "element",
    tagName: "blockquote",
    properties: {},
    children: t.wrap(t.all(e), !0)
  };
  return t.patch(e, n), t.applyData(e, n);
}
function $b(t, e) {
  const n = { type: "element", tagName: "br", properties: {}, children: [] };
  return t.patch(e, n), [t.applyData(e, n), { type: "text", value: `
` }];
}
function Nb(t, e) {
  const n = e.value ? e.value + `
` : "", r = {}, s = e.lang ? e.lang.split(/\s+/) : [];
  s.length > 0 && (r.className = ["language-" + s[0]]);
  let i = {
    type: "element",
    tagName: "code",
    properties: r,
    children: [{ type: "text", value: n }]
  };
  return e.meta && (i.data = { meta: e.meta }), t.patch(e, i), i = t.applyData(e, i), i = { type: "element", tagName: "pre", properties: {}, children: [i] }, t.patch(e, i), i;
}
function Lb(t, e) {
  const n = {
    type: "element",
    tagName: "del",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, n), t.applyData(e, n);
}
function zb(t, e) {
  const n = {
    type: "element",
    tagName: "em",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, n), t.applyData(e, n);
}
function Vb(t, e) {
  const n = typeof t.options.clobberPrefix == "string" ? t.options.clobberPrefix : "user-content-", r = String(e.identifier).toUpperCase(), s = pt(r.toLowerCase()), i = t.footnoteOrder.indexOf(r);
  let o, a = t.footnoteCounts.get(r);
  a === void 0 ? (a = 0, t.footnoteOrder.push(r), o = t.footnoteOrder.length) : o = i + 1, a += 1, t.footnoteCounts.set(r, a);
  const l = {
    type: "element",
    tagName: "a",
    properties: {
      href: "#" + n + "fn-" + s,
      id: n + "fnref-" + s + (a > 1 ? "-" + a : ""),
      dataFootnoteRef: !0,
      ariaDescribedBy: ["footnote-label"]
    },
    children: [{ type: "text", value: String(o) }]
  };
  t.patch(e, l);
  const u = {
    type: "element",
    tagName: "sup",
    properties: {},
    children: [l]
  };
  return t.patch(e, u), t.applyData(e, u);
}
function Ub(t, e) {
  const n = {
    type: "element",
    tagName: "h" + e.depth,
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, n), t.applyData(e, n);
}
function qb(t, e) {
  if (t.options.allowDangerousHtml) {
    const n = { type: "raw", value: e.value };
    return t.patch(e, n), t.applyData(e, n);
  }
}
function pa(t, e) {
  const n = e.referenceType;
  let r = "]";
  if (n === "collapsed" ? r += "[]" : n === "full" && (r += "[" + (e.label || e.identifier) + "]"), e.type === "imageReference")
    return [{ type: "text", value: "![" + e.alt + r }];
  const s = t.all(e), i = s[0];
  i && i.type === "text" ? i.value = "[" + i.value : s.unshift({ type: "text", value: "[" });
  const o = s[s.length - 1];
  return o && o.type === "text" ? o.value += r : s.push({ type: "text", value: r }), s;
}
function jb(t, e) {
  const n = String(e.identifier).toUpperCase(), r = t.definitionById.get(n);
  if (!r)
    return pa(t, e);
  const s = { src: pt(r.url || ""), alt: e.alt };
  r.title !== null && r.title !== void 0 && (s.title = r.title);
  const i = { type: "element", tagName: "img", properties: s, children: [] };
  return t.patch(e, i), t.applyData(e, i);
}
function Hb(t, e) {
  const n = { src: pt(e.url) };
  e.alt !== null && e.alt !== void 0 && (n.alt = e.alt), e.title !== null && e.title !== void 0 && (n.title = e.title);
  const r = { type: "element", tagName: "img", properties: n, children: [] };
  return t.patch(e, r), t.applyData(e, r);
}
function Gb(t, e) {
  const n = { type: "text", value: e.value.replace(/\r?\n|\r/g, " ") };
  t.patch(e, n);
  const r = {
    type: "element",
    tagName: "code",
    properties: {},
    children: [n]
  };
  return t.patch(e, r), t.applyData(e, r);
}
function Qb(t, e) {
  const n = String(e.identifier).toUpperCase(), r = t.definitionById.get(n);
  if (!r)
    return pa(t, e);
  const s = { href: pt(r.url || "") };
  r.title !== null && r.title !== void 0 && (s.title = r.title);
  const i = {
    type: "element",
    tagName: "a",
    properties: s,
    children: t.all(e)
  };
  return t.patch(e, i), t.applyData(e, i);
}
function Wb(t, e) {
  const n = { href: pt(e.url) };
  e.title !== null && e.title !== void 0 && (n.title = e.title);
  const r = {
    type: "element",
    tagName: "a",
    properties: n,
    children: t.all(e)
  };
  return t.patch(e, r), t.applyData(e, r);
}
function Yb(t, e, n) {
  const r = t.all(e), s = n ? Kb(n) : ma(e), i = {}, o = [];
  if (typeof e.checked == "boolean") {
    const h = r[0];
    let c;
    h && h.type === "element" && h.tagName === "p" ? c = h : (c = { type: "element", tagName: "p", properties: {}, children: [] }, r.unshift(c)), c.children.length > 0 && c.children.unshift({ type: "text", value: " " }), c.children.unshift({
      type: "element",
      tagName: "input",
      properties: { type: "checkbox", checked: e.checked, disabled: !0 },
      children: []
    }), i.className = ["task-list-item"];
  }
  let a = -1;
  for (; ++a < r.length; ) {
    const h = r[a];
    (s || a !== 0 || h.type !== "element" || h.tagName !== "p") && o.push({ type: "text", value: `
` }), h.type === "element" && h.tagName === "p" && !s ? o.push(...h.children) : o.push(h);
  }
  const l = r[r.length - 1];
  l && (s || l.type !== "element" || l.tagName !== "p") && o.push({ type: "text", value: `
` });
  const u = { type: "element", tagName: "li", properties: i, children: o };
  return t.patch(e, u), t.applyData(e, u);
}
function Kb(t) {
  let e = !1;
  if (t.type === "list") {
    e = t.spread || !1;
    const n = t.children;
    let r = -1;
    for (; !e && ++r < n.length; )
      e = ma(n[r]);
  }
  return e;
}
function ma(t) {
  const e = t.spread;
  return e ?? t.children.length > 1;
}
function Jb(t, e) {
  const n = {}, r = t.all(e);
  let s = -1;
  for (typeof e.start == "number" && e.start !== 1 && (n.start = e.start); ++s < r.length; ) {
    const o = r[s];
    if (o.type === "element" && o.tagName === "li" && o.properties && Array.isArray(o.properties.className) && o.properties.className.includes("task-list-item")) {
      n.className = ["contains-task-list"];
      break;
    }
  }
  const i = {
    type: "element",
    tagName: e.ordered ? "ol" : "ul",
    properties: n,
    children: t.wrap(r, !0)
  };
  return t.patch(e, i), t.applyData(e, i);
}
function Xb(t, e) {
  const n = {
    type: "element",
    tagName: "p",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, n), t.applyData(e, n);
}
function Zb(t, e) {
  const n = { type: "root", children: t.wrap(t.all(e)) };
  return t.patch(e, n), t.applyData(e, n);
}
function ey(t, e) {
  const n = {
    type: "element",
    tagName: "strong",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, n), t.applyData(e, n);
}
function ty(t, e) {
  const n = t.all(e), r = n.shift(), s = [];
  if (r) {
    const o = {
      type: "element",
      tagName: "thead",
      properties: {},
      children: t.wrap([r], !0)
    };
    t.patch(e.children[0], o), s.push(o);
  }
  if (n.length > 0) {
    const o = {
      type: "element",
      tagName: "tbody",
      properties: {},
      children: t.wrap(n, !0)
    }, a = sa(e.children[1]), l = ra(e.children[e.children.length - 1]);
    a && l && (o.position = { start: a, end: l }), s.push(o);
  }
  const i = {
    type: "element",
    tagName: "table",
    properties: {},
    children: t.wrap(s, !0)
  };
  return t.patch(e, i), t.applyData(e, i);
}
function ny(t, e, n) {
  const r = n ? n.children : void 0, i = (r ? r.indexOf(e) : 1) === 0 ? "th" : "td", o = n && n.type === "table" ? n.align : void 0, a = o ? o.length : e.children.length;
  let l = -1;
  const u = [];
  for (; ++l < a; ) {
    const c = e.children[l], d = {}, f = o ? o[l] : void 0;
    f && (d.align = f);
    let p = { type: "element", tagName: i, properties: d, children: [] };
    c && (p.children = t.all(c), t.patch(c, p), p = t.applyData(c, p)), u.push(p);
  }
  const h = {
    type: "element",
    tagName: "tr",
    properties: {},
    children: t.wrap(u, !0)
  };
  return t.patch(e, h), t.applyData(e, h);
}
function ry(t, e) {
  const n = {
    type: "element",
    tagName: "td",
    // Assume body cell.
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, n), t.applyData(e, n);
}
function sy(t, e) {
  const n = { type: "text", value: bl(String(e.value)) };
  return t.patch(e, n), t.applyData(e, n);
}
function iy(t, e) {
  const n = {
    type: "element",
    tagName: "hr",
    properties: {},
    children: []
  };
  return t.patch(e, n), t.applyData(e, n);
}
const oy = {
  blockquote: Fb,
  break: $b,
  code: Nb,
  delete: Lb,
  emphasis: zb,
  footnoteReference: Vb,
  heading: Ub,
  html: qb,
  imageReference: jb,
  image: Hb,
  inlineCode: Gb,
  linkReference: Qb,
  link: Wb,
  listItem: Yb,
  list: Jb,
  paragraph: Xb,
  // @ts-expect-error: root is different, but hard to type.
  root: Zb,
  strong: ey,
  table: ty,
  tableCell: ry,
  tableRow: ny,
  text: sy,
  thematicBreak: iy,
  toml: Vt,
  yaml: Vt,
  definition: Vt,
  footnoteDefinition: Vt
};
function Vt() {
}
function ay(t, e) {
  const n = [{ type: "text", value: "↩" }];
  return e > 1 && n.push({
    type: "element",
    tagName: "sup",
    properties: {},
    children: [{ type: "text", value: String(e) }]
  }), n;
}
function ly(t, e) {
  return "Back to reference " + (t + 1) + (e > 1 ? "-" + e : "");
}
function uy(t) {
  const e = typeof t.options.clobberPrefix == "string" ? t.options.clobberPrefix : "user-content-", n = t.options.footnoteBackContent || ay, r = t.options.footnoteBackLabel || ly, s = t.options.footnoteLabel || "Footnotes", i = t.options.footnoteLabelTagName || "h2", o = t.options.footnoteLabelProperties || {
    className: ["sr-only"]
  }, a = [];
  let l = -1;
  for (; ++l < t.footnoteOrder.length; ) {
    const u = t.footnoteById.get(
      t.footnoteOrder[l]
    );
    if (!u)
      continue;
    const h = t.all(u), c = String(u.identifier).toUpperCase(), d = pt(c.toLowerCase());
    let f = 0;
    const p = [], x = t.footnoteCounts.get(c);
    for (; x !== void 0 && ++f <= x; ) {
      p.length > 0 && p.push({ type: "text", value: " " });
      let T = typeof n == "string" ? n : n(l, f);
      typeof T == "string" && (T = { type: "text", value: T }), p.push({
        type: "element",
        tagName: "a",
        properties: {
          href: "#" + e + "fnref-" + d + (f > 1 ? "-" + f : ""),
          dataFootnoteBackref: "",
          ariaLabel: typeof r == "string" ? r : r(l, f),
          className: ["data-footnote-backref"]
        },
        children: Array.isArray(T) ? T : [T]
      });
    }
    const S = h[h.length - 1];
    if (S && S.type === "element" && S.tagName === "p") {
      const T = S.children[S.children.length - 1];
      T && T.type === "text" ? T.value += " " : S.children.push({ type: "text", value: " " }), S.children.push(...p);
    } else
      h.push(...p);
    const y = {
      type: "element",
      tagName: "li",
      properties: { id: e + "fn-" + d },
      children: t.wrap(h, !0)
    };
    t.patch(u, y), a.push(y);
  }
  if (a.length !== 0)
    return {
      type: "element",
      tagName: "section",
      properties: { dataFootnotes: !0, className: ["footnotes"] },
      children: [
        {
          type: "element",
          tagName: i,
          properties: {
            ...Qt(o),
            id: "footnote-label"
          },
          children: [{ type: "text", value: s }]
        },
        { type: "text", value: `
` },
        {
          type: "element",
          tagName: "ol",
          properties: {},
          children: t.wrap(a, !0)
        },
        { type: "text", value: `
` }
      ]
    };
}
const xn = (
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((test?: Test) => Check)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {Check}
   */
  (function(t) {
    if (t == null)
      return fy;
    if (typeof t == "function")
      return Sn(t);
    if (typeof t == "object")
      return Array.isArray(t) ? cy(t) : (
        // Cast because `ReadonlyArray` goes into the above but `isArray`
        // narrows to `Array`.
        hy(
          /** @type {Props} */
          t
        )
      );
    if (typeof t == "string")
      return dy(t);
    throw new Error("Expected function, string, or object as test");
  })
);
function cy(t) {
  const e = [];
  let n = -1;
  for (; ++n < t.length; )
    e[n] = xn(t[n]);
  return Sn(r);
  function r(...s) {
    let i = -1;
    for (; ++i < e.length; )
      if (e[i].apply(this, s)) return !0;
    return !1;
  }
}
function hy(t) {
  const e = (
    /** @type {Record<string, unknown>} */
    t
  );
  return Sn(n);
  function n(r) {
    const s = (
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      r
    );
    let i;
    for (i in t)
      if (s[i] !== e[i]) return !1;
    return !0;
  }
}
function dy(t) {
  return Sn(e);
  function e(n) {
    return n && n.type === t;
  }
}
function Sn(t) {
  return e;
  function e(n, r, s) {
    return !!(py(n) && t.call(
      this,
      n,
      typeof r == "number" ? r : void 0,
      s || void 0
    ));
  }
}
function fy() {
  return !0;
}
function py(t) {
  return t !== null && typeof t == "object" && "type" in t;
}
const ga = [], my = !0, Xn = !1, gy = "skip";
function ba(t, e, n, r) {
  let s;
  typeof e == "function" && typeof n != "function" ? (r = n, n = e) : s = e;
  const i = xn(s), o = r ? -1 : 1;
  a(t, void 0, [])();
  function a(l, u, h) {
    const c = (
      /** @type {Record<string, unknown>} */
      l && typeof l == "object" ? l : {}
    );
    if (typeof c.type == "string") {
      const f = (
        // `hast`
        typeof c.tagName == "string" ? c.tagName : (
          // `xast`
          typeof c.name == "string" ? c.name : void 0
        )
      );
      Object.defineProperty(d, "name", {
        value: "node (" + (l.type + (f ? "<" + f + ">" : "")) + ")"
      });
    }
    return d;
    function d() {
      let f = ga, p, x, S;
      if ((!e || i(l, u, h[h.length - 1] || void 0)) && (f = by(n(l, h)), f[0] === Xn))
        return f;
      if ("children" in l && l.children) {
        const y = (
          /** @type {UnistParent} */
          l
        );
        if (y.children && f[0] !== gy)
          for (x = (r ? y.children.length : -1) + o, S = h.concat(y); x > -1 && x < y.children.length; ) {
            const T = y.children[x];
            if (p = a(T, x, S)(), p[0] === Xn)
              return p;
            x = typeof p[1] == "number" ? p[1] : x + o;
          }
      }
      return f;
    }
  }
}
function by(t) {
  return Array.isArray(t) ? t : typeof t == "number" ? [my, t] : t == null ? ga : [t];
}
function $r(t, e, n, r) {
  let s, i, o;
  typeof e == "function" && typeof n != "function" ? (i = void 0, o = e, s = n) : (i = e, o = n, s = r), ba(t, i, a, s);
  function a(l, u) {
    const h = u[u.length - 1], c = h ? h.children.indexOf(l) : void 0;
    return o(l, c, h);
  }
}
const Zn = {}.hasOwnProperty, yy = {};
function _y(t, e) {
  const n = e || yy, r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), o = { ...oy, ...n.handlers }, a = {
    all: u,
    applyData: Sy,
    definitionById: r,
    footnoteById: s,
    footnoteCounts: i,
    footnoteOrder: [],
    handlers: o,
    one: l,
    options: n,
    patch: xy,
    wrap: vy
  };
  return $r(t, function(h) {
    if (h.type === "definition" || h.type === "footnoteDefinition") {
      const c = h.type === "definition" ? r : s, d = String(h.identifier).toUpperCase();
      c.has(d) || c.set(d, h);
    }
  }), a;
  function l(h, c) {
    const d = h.type, f = a.handlers[d];
    if (Zn.call(a.handlers, d) && f)
      return f(a, h, c);
    if (a.options.passThrough && a.options.passThrough.includes(d)) {
      if ("children" in h) {
        const { children: x, ...S } = h, y = Qt(S);
        return y.children = a.all(h), y;
      }
      return Qt(h);
    }
    return (a.options.unknownHandler || wy)(a, h, c);
  }
  function u(h) {
    const c = [];
    if ("children" in h) {
      const d = h.children;
      let f = -1;
      for (; ++f < d.length; ) {
        const p = a.one(d[f], h);
        if (p) {
          if (f && d[f - 1].type === "break" && (!Array.isArray(p) && p.type === "text" && (p.value = Ls(p.value)), !Array.isArray(p) && p.type === "element")) {
            const x = p.children[0];
            x && x.type === "text" && (x.value = Ls(x.value));
          }
          Array.isArray(p) ? c.push(...p) : c.push(p);
        }
      }
    }
    return c;
  }
}
function xy(t, e) {
  t.position && (e.position = hg(t));
}
function Sy(t, e) {
  let n = e;
  if (t && t.data) {
    const r = t.data.hName, s = t.data.hChildren, i = t.data.hProperties;
    if (typeof r == "string")
      if (n.type === "element")
        n.tagName = r;
      else {
        const o = "children" in n ? n.children : [n];
        n = { type: "element", tagName: r, properties: {}, children: o };
      }
    n.type === "element" && i && Object.assign(n.properties, Qt(i)), "children" in n && n.children && s !== null && s !== void 0 && (n.children = s);
  }
  return n;
}
function wy(t, e) {
  const n = e.data || {}, r = "value" in e && !(Zn.call(n, "hProperties") || Zn.call(n, "hChildren")) ? { type: "text", value: e.value } : {
    type: "element",
    tagName: "div",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, r), t.applyData(e, r);
}
function vy(t, e) {
  const n = [];
  let r = -1;
  for (e && n.push({ type: "text", value: `
` }); ++r < t.length; )
    r && n.push({ type: "text", value: `
` }), n.push(t[r]);
  return e && t.length > 0 && n.push({ type: "text", value: `
` }), n;
}
function Ls(t) {
  let e = 0, n = t.charCodeAt(e);
  for (; n === 9 || n === 32; )
    e++, n = t.charCodeAt(e);
  return t.slice(e);
}
function zs(t, e) {
  const n = _y(t, e), r = n.one(t, void 0), s = uy(n), i = Array.isArray(r) ? { type: "root", children: r } : r || { type: "root", children: [] };
  return s && i.children.push({ type: "text", value: `
` }, s), i;
}
function ky(t, e) {
  return t && "run" in t ? async function(n, r) {
    const s = (
      /** @type {HastRoot} */
      zs(n, { file: r, ...e })
    );
    await t.run(s, r);
  } : function(n, r) {
    return (
      /** @type {HastRoot} */
      zs(n, { file: r, ...t || e })
    );
  };
}
const Ty = "https://github.com/remarkjs/react-markdown/blob/main/changelog.md", Vs = [], Us = { allowDangerousHtml: !0 }, Cy = /^(https?|ircs?|mailto|xmpp)$/i, Iy = [
  { from: "astPlugins", id: "remove-buggy-html-in-markdown-parser" },
  { from: "allowDangerousHtml", id: "remove-buggy-html-in-markdown-parser" },
  {
    from: "allowNode",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowElement"
  },
  {
    from: "allowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowedElements"
  },
  { from: "className", id: "remove-classname" },
  {
    from: "disallowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "disallowedElements"
  },
  { from: "escapeHtml", id: "remove-buggy-html-in-markdown-parser" },
  { from: "includeElementIndex", id: "#remove-includeelementindex" },
  {
    from: "includeNodeIndex",
    id: "change-includenodeindex-to-includeelementindex"
  },
  { from: "linkTarget", id: "remove-linktarget" },
  { from: "plugins", id: "change-plugins-to-remarkplugins", to: "remarkPlugins" },
  { from: "rawSourcePos", id: "#remove-rawsourcepos" },
  { from: "renderers", id: "change-renderers-to-components", to: "components" },
  { from: "source", id: "change-source-to-children", to: "children" },
  { from: "sourcePos", id: "#remove-sourcepos" },
  { from: "transformImageUri", id: "#add-urltransform", to: "urlTransform" },
  { from: "transformLinkUri", id: "#add-urltransform", to: "urlTransform" }
];
function Ey(t) {
  const e = Ay(t), n = Ry(t);
  return My(e.runSync(e.parse(n), n), t);
}
function Ay(t) {
  const e = t.rehypePlugins || Vs, n = t.remarkPlugins || Vs, r = t.remarkRehypeOptions ? { ...t.remarkRehypeOptions, ...Us } : Us;
  return yl().use(Ob).use(n).use(ky, r).use(e);
}
function Ry(t) {
  const e = t.children || "", n = new _l();
  return typeof e == "string" && (n.value = e), n;
}
function My(t, e) {
  const n = e.allowedElements, r = e.allowElement, s = e.components, i = e.disallowedElements, o = e.skipHtml, a = e.unwrapDisallowed, l = e.urlTransform || Py;
  for (const h of Iy)
    Object.hasOwn(e, h.from) && xl(
      "Unexpected `" + h.from + "` prop, " + (h.to ? "use `" + h.to + "` instead" : "remove it") + " (see <" + Ty + "#" + h.id + "> for more info)"
    );
  return $r(t, u), Sl(t, {
    Fragment: Re,
    components: s,
    ignoreInvalidStyle: !0,
    jsx: _,
    jsxs: Ae,
    passKeys: !0,
    passNode: !0
  });
  function u(h, c, d) {
    if (h.type === "raw" && d && typeof c == "number")
      return o ? d.children.splice(c, 1) : d.children[c] = { type: "text", value: h.value }, c;
    if (h.type === "element") {
      let f;
      for (f in wn)
        if (Object.hasOwn(wn, f) && Object.hasOwn(h.properties, f)) {
          const p = h.properties[f], x = wn[f];
          (x === null || x.includes(h.tagName)) && (h.properties[f] = l(String(p || ""), f, h));
        }
    }
    if (h.type === "element") {
      let f = n ? !n.includes(h.tagName) : i ? i.includes(h.tagName) : !1;
      if (!f && r && typeof c == "number" && (f = !r(h, c, d)), f && d && typeof c == "number")
        return a && h.children ? d.children.splice(c, 1, ...h.children) : d.children.splice(c, 1), c;
    }
  }
}
function Py(t) {
  const e = t.indexOf(":"), n = t.indexOf("?"), r = t.indexOf("#"), s = t.indexOf("/");
  return (
    // If there is no protocol, it’s relative.
    e === -1 || // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    s !== -1 && e > s || n !== -1 && e > n || r !== -1 && e > r || // It is a protocol, it should be allowed.
    Cy.test(t.slice(0, e)) ? t : ""
  );
}
const { useSmooth: Dy, useSmoothStatus: By, withSmoothContextProvider: Oy } = Xm, Fy = ({ components: t, componentsByLanguage: e, smooth: n = !0, defer: r = !1, preprocess: s, ...i }) => {
  const o = $o(), { text: a } = Dy(_t(() => s ? {
    ...o,
    text: s(o.text)
  } : o, [o, s]), n), l = cl(a), u = r ? l : a, { pre: h = sg, code: c = ig, SyntaxHighlighter: d = Br, CodeHeader: f = og } = t ?? {}, p = _t(() => ({
    Pre: h,
    Code: c,
    SyntaxHighlighter: d,
    CodeHeader: f
  }), [
    h,
    c,
    d,
    f
  ]), x = ot((S) => /* @__PURE__ */ _(cg, {
    components: p,
    componentsByLanguage: e,
    ...S
  }));
  return /* @__PURE__ */ _(Ey, {
    components: _t(() => {
      const { pre: S, code: y, SyntaxHighlighter: T, CodeHeader: R, ...C } = t ?? {};
      return {
        ...C,
        pre: rg,
        code: x
      };
    }, [x, t]),
    ...i,
    children: u
  });
}, ya = ne(({ className: t, containerProps: e, containerComponent: n = "div", ...r }, s) => /* @__PURE__ */ _(n, {
  "data-status": By().type,
  ...e,
  className: Js(t, e?.className),
  ref: s,
  children: /* @__PURE__ */ _(Fy, { ...r })
}));
ya.displayName = "MarkdownTextPrimitive";
const dx = Oy(ya);
function $y(t, e, n) {
  const s = xn((n || {}).ignore || []), i = Ny(e);
  let o = -1;
  for (; ++o < i.length; )
    ba(t, "text", a);
  function a(u, h) {
    let c = -1, d;
    for (; ++c < h.length; ) {
      const f = h[c], p = d ? d.children : void 0;
      if (s(
        f,
        p ? p.indexOf(f) : void 0,
        d
      ))
        return;
      d = f;
    }
    if (d)
      return l(u, h);
  }
  function l(u, h) {
    const c = h[h.length - 1], d = i[o][0], f = i[o][1];
    let p = 0;
    const S = c.children.indexOf(u);
    let y = !1, T = [];
    d.lastIndex = 0;
    let R = d.exec(u.value);
    for (; R; ) {
      const C = R.index, I = {
        index: R.index,
        input: R.input,
        stack: [...h, u]
      };
      let b = f(...R, I);
      if (typeof b == "string" && (b = b.length > 0 ? { type: "text", value: b } : void 0), b === !1 ? d.lastIndex = C + 1 : (p !== C && T.push({
        type: "text",
        value: u.value.slice(p, C)
      }), Array.isArray(b) ? T.push(...b) : b && T.push(b), p = C + R[0].length, y = !0), !d.global)
        break;
      R = d.exec(u.value);
    }
    return y ? (p < u.value.length && T.push({ type: "text", value: u.value.slice(p) }), c.children.splice(S, 1, ...T)) : T = [u], S + T.length;
  }
}
function Ny(t) {
  const e = [];
  if (!Array.isArray(t))
    throw new TypeError("Expected find and replace tuple or list of tuples");
  const n = !t[0] || Array.isArray(t[0]) ? t : [t];
  let r = -1;
  for (; ++r < n.length; ) {
    const s = n[r];
    e.push([Ly(s[0]), zy(s[1])]);
  }
  return e;
}
function Ly(t) {
  return typeof t == "string" ? new RegExp(wl(t), "g") : t;
}
function zy(t) {
  return typeof t == "function" ? t : function() {
    return t;
  };
}
const Bn = "phrasing", On = ["autolink", "link", "image", "label"];
function Vy() {
  return {
    transforms: [Wy],
    enter: {
      literalAutolink: qy,
      literalAutolinkEmail: Fn,
      literalAutolinkHttp: Fn,
      literalAutolinkWww: Fn
    },
    exit: {
      literalAutolink: Qy,
      literalAutolinkEmail: Gy,
      literalAutolinkHttp: jy,
      literalAutolinkWww: Hy
    }
  };
}
function Uy() {
  return {
    unsafe: [
      {
        character: "@",
        before: "[+\\-.\\w]",
        after: "[\\-.\\w]",
        inConstruct: Bn,
        notInConstruct: On
      },
      {
        character: ".",
        before: "[Ww]",
        after: "[\\-.\\w]",
        inConstruct: Bn,
        notInConstruct: On
      },
      {
        character: ":",
        before: "[ps]",
        after: "\\/",
        inConstruct: Bn,
        notInConstruct: On
      }
    ]
  };
}
function qy(t) {
  this.enter({ type: "link", title: null, url: "", children: [] }, t);
}
function Fn(t) {
  this.config.enter.autolinkProtocol.call(this, t);
}
function jy(t) {
  this.config.exit.autolinkProtocol.call(this, t);
}
function Hy(t) {
  this.config.exit.data.call(this, t);
  const e = this.stack[this.stack.length - 1];
  ht(e.type === "link"), e.url = "http://" + this.sliceSerialize(t);
}
function Gy(t) {
  this.config.exit.autolinkEmail.call(this, t);
}
function Qy(t) {
  this.exit(t);
}
function Wy(t) {
  $y(
    t,
    [
      [/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, Yy],
      [new RegExp("(?<=^|\\s|\\p{P}|\\p{S})([-.\\w+]+)@([-\\w]+(?:\\.[-\\w]+)+)", "gu"), Ky]
    ],
    { ignore: ["link", "linkReference"] }
  );
}
function Yy(t, e, n, r, s) {
  let i = "";
  if (!_a(s) || (/^w/i.test(e) && (n = e + n, e = "", i = "http://"), !Jy(n)))
    return !1;
  const o = Xy(n + r);
  if (!o[0]) return !1;
  const a = {
    type: "link",
    title: null,
    url: i + e + o[0],
    children: [{ type: "text", value: e + o[0] }]
  };
  return o[1] ? [a, { type: "text", value: o[1] }] : a;
}
function Ky(t, e, n, r) {
  return (
    // Not an expected previous character.
    !_a(r, !0) || // Label ends in not allowed character.
    /[-\d_]$/.test(n) ? !1 : {
      type: "link",
      title: null,
      url: "mailto:" + e + "@" + n,
      children: [{ type: "text", value: e + "@" + n }]
    }
  );
}
function Jy(t) {
  const e = t.split(".");
  return !(e.length < 2 || e[e.length - 1] && (/_/.test(e[e.length - 1]) || !/[a-zA-Z\d]/.test(e[e.length - 1])) || e[e.length - 2] && (/_/.test(e[e.length - 2]) || !/[a-zA-Z\d]/.test(e[e.length - 2])));
}
function Xy(t) {
  const e = /[!"&'),.:;<>?\]}]+$/.exec(t);
  if (!e)
    return [t, void 0];
  t = t.slice(0, e.index);
  let n = e[0], r = n.indexOf(")");
  const s = Qr(t, "(");
  let i = Qr(t, ")");
  for (; r !== -1 && s > i; )
    t += n.slice(0, r + 1), n = n.slice(r + 1), r = n.indexOf(")"), i++;
  return [t, n];
}
function _a(t, e) {
  const n = t.input.charCodeAt(t.index - 1);
  return (t.index === 0 || Ke(n) || yn(n)) && // If it’s an email, the previous character should not be a slash.
  (!e || n !== 47);
}
xa.peek = a1;
function Zy() {
  this.buffer();
}
function e1(t) {
  this.enter({ type: "footnoteReference", identifier: "", label: "" }, t);
}
function t1() {
  this.buffer();
}
function n1(t) {
  this.enter(
    { type: "footnoteDefinition", identifier: "", label: "", children: [] },
    t
  );
}
function r1(t) {
  const e = this.resume(), n = this.stack[this.stack.length - 1];
  ht(n.type === "footnoteReference"), n.identifier = ge(
    this.sliceSerialize(t)
  ).toLowerCase(), n.label = e;
}
function s1(t) {
  this.exit(t);
}
function i1(t) {
  const e = this.resume(), n = this.stack[this.stack.length - 1];
  ht(n.type === "footnoteDefinition"), n.identifier = ge(
    this.sliceSerialize(t)
  ).toLowerCase(), n.label = e;
}
function o1(t) {
  this.exit(t);
}
function a1() {
  return "[";
}
function xa(t, e, n, r) {
  const s = n.createTracker(r);
  let i = s.move("[^");
  const o = n.enter("footnoteReference"), a = n.enter("reference");
  return i += s.move(
    n.safe(n.associationId(t), { after: "]", before: i })
  ), a(), o(), i += s.move("]"), i;
}
function l1() {
  return {
    enter: {
      gfmFootnoteCallString: Zy,
      gfmFootnoteCall: e1,
      gfmFootnoteDefinitionLabelString: t1,
      gfmFootnoteDefinition: n1
    },
    exit: {
      gfmFootnoteCallString: r1,
      gfmFootnoteCall: s1,
      gfmFootnoteDefinitionLabelString: i1,
      gfmFootnoteDefinition: o1
    }
  };
}
function u1(t) {
  let e = !1;
  return t && t.firstLineBlank && (e = !0), {
    handlers: { footnoteDefinition: n, footnoteReference: xa },
    // This is on by default already.
    unsafe: [{ character: "[", inConstruct: ["label", "phrasing", "reference"] }]
  };
  function n(r, s, i, o) {
    const a = i.createTracker(o);
    let l = a.move("[^");
    const u = i.enter("footnoteDefinition"), h = i.enter("label");
    return l += a.move(
      i.safe(i.associationId(r), { before: l, after: "]" })
    ), h(), l += a.move("]:"), r.children && r.children.length > 0 && (a.shift(4), l += a.move(
      (e ? `
` : " ") + i.indentLines(
        i.containerFlow(r, a.current()),
        e ? Sa : c1
      )
    )), u(), l;
  }
}
function c1(t, e, n) {
  return e === 0 ? t : Sa(t, e, n);
}
function Sa(t, e, n) {
  return (n ? "" : "    ") + t;
}
const h1 = [
  "autolink",
  "destinationLiteral",
  "destinationRaw",
  "reference",
  "titleQuote",
  "titleApostrophe"
];
wa.peek = g1;
function d1() {
  return {
    canContainEols: ["delete"],
    enter: { strikethrough: p1 },
    exit: { strikethrough: m1 }
  };
}
function f1() {
  return {
    unsafe: [
      {
        character: "~",
        inConstruct: "phrasing",
        notInConstruct: h1
      }
    ],
    handlers: { delete: wa }
  };
}
function p1(t) {
  this.enter({ type: "delete", children: [] }, t);
}
function m1(t) {
  this.exit(t);
}
function wa(t, e, n, r) {
  const s = n.createTracker(r), i = n.enter("strikethrough");
  let o = s.move("~~");
  return o += n.containerPhrasing(t, {
    ...s.current(),
    before: o,
    after: "~"
  }), o += s.move("~~"), i(), o;
}
function g1() {
  return "~";
}
function b1(t, e, n, r) {
  const s = n.enter("blockquote"), i = n.createTracker(r);
  i.move("> "), i.shift(2);
  const o = n.indentLines(
    n.containerFlow(t, i.current()),
    y1
  );
  return s(), o;
}
function y1(t, e, n) {
  return ">" + (n ? "" : " ") + t;
}
function _1(t, e) {
  return qs(t, e.inConstruct, !0) && !qs(t, e.notInConstruct, !1);
}
function qs(t, e, n) {
  if (typeof e == "string" && (e = [e]), !e || e.length === 0)
    return n;
  let r = -1;
  for (; ++r < e.length; )
    if (t.includes(e[r]))
      return !0;
  return !1;
}
function js(t, e, n, r) {
  let s = -1;
  for (; ++s < n.unsafe.length; )
    if (n.unsafe[s].character === `
` && _1(n.stack, n.unsafe[s]))
      return /[ \t]/.test(r.before) ? "" : " ";
  return `\\
`;
}
function x1(t, e) {
  return !!(e.options.fences === !1 && t.value && // If there’s no info…
  !t.lang && // And there’s a non-whitespace character…
  /[^ \r\n]/.test(t.value) && // And the value doesn’t start or end in a blank…
  !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(t.value));
}
function S1(t) {
  const e = t.options.fence || "`";
  if (e !== "`" && e !== "~")
    throw new Error(
      "Cannot serialize code with `" + e + "` for `options.fence`, expected `` ` `` or `~`"
    );
  return e;
}
function w1(t, e, n, r) {
  const s = S1(n), i = t.value || "", o = s === "`" ? "GraveAccent" : "Tilde";
  if (x1(t, n)) {
    const c = n.enter("codeIndented"), d = n.indentLines(i, v1);
    return c(), d;
  }
  const a = n.createTracker(r), l = s.repeat(Math.max(vl(i, s) + 1, 3)), u = n.enter("codeFenced");
  let h = a.move(l);
  if (t.lang) {
    const c = n.enter(`codeFencedLang${o}`);
    h += a.move(
      n.safe(t.lang, {
        before: h,
        after: " ",
        encode: ["`"],
        ...a.current()
      })
    ), c();
  }
  if (t.lang && t.meta) {
    const c = n.enter(`codeFencedMeta${o}`);
    h += a.move(" "), h += a.move(
      n.safe(t.meta, {
        before: h,
        after: `
`,
        encode: ["`"],
        ...a.current()
      })
    ), c();
  }
  return h += a.move(`
`), i && (h += a.move(i + `
`)), h += a.move(l), u(), h;
}
function v1(t, e, n) {
  return (n ? "" : "    ") + t;
}
function Nr(t) {
  const e = t.options.quote || '"';
  if (e !== '"' && e !== "'")
    throw new Error(
      "Cannot serialize title with `" + e + "` for `options.quote`, expected `\"`, or `'`"
    );
  return e;
}
function k1(t, e, n, r) {
  const s = Nr(n), i = s === '"' ? "Quote" : "Apostrophe", o = n.enter("definition");
  let a = n.enter("label");
  const l = n.createTracker(r);
  let u = l.move("[");
  return u += l.move(
    n.safe(n.associationId(t), {
      before: u,
      after: "]",
      ...l.current()
    })
  ), u += l.move("]: "), a(), // If there’s no url, or…
  !t.url || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(t.url) ? (a = n.enter("destinationLiteral"), u += l.move("<"), u += l.move(
    n.safe(t.url, { before: u, after: ">", ...l.current() })
  ), u += l.move(">")) : (a = n.enter("destinationRaw"), u += l.move(
    n.safe(t.url, {
      before: u,
      after: t.title ? " " : `
`,
      ...l.current()
    })
  )), a(), t.title && (a = n.enter(`title${i}`), u += l.move(" " + s), u += l.move(
    n.safe(t.title, {
      before: u,
      after: s,
      ...l.current()
    })
  ), u += l.move(s), a()), o(), u;
}
function T1(t) {
  const e = t.options.emphasis || "*";
  if (e !== "*" && e !== "_")
    throw new Error(
      "Cannot serialize emphasis with `" + e + "` for `options.emphasis`, expected `*`, or `_`"
    );
  return e;
}
function It(t) {
  return "&#x" + t.toString(16).toUpperCase() + ";";
}
function an(t, e, n) {
  const r = ut(t), s = ut(e);
  return r === void 0 ? s === void 0 ? (
    // Letter inside:
    // we have to encode *both* letters for `_` as it is looser.
    // it already forms for `*` (and GFMs `~`).
    n === "_" ? { inside: !0, outside: !0 } : { inside: !1, outside: !1 }
  ) : s === 1 ? (
    // Whitespace inside: encode both (letter, whitespace).
    { inside: !0, outside: !0 }
  ) : (
    // Punctuation inside: encode outer (letter)
    { inside: !1, outside: !0 }
  ) : r === 1 ? s === void 0 ? (
    // Letter inside: already forms.
    { inside: !1, outside: !1 }
  ) : s === 1 ? (
    // Whitespace inside: encode both (whitespace).
    { inside: !0, outside: !0 }
  ) : (
    // Punctuation inside: already forms.
    { inside: !1, outside: !1 }
  ) : s === void 0 ? (
    // Letter inside: already forms.
    { inside: !1, outside: !1 }
  ) : s === 1 ? (
    // Whitespace inside: encode inner (whitespace).
    { inside: !0, outside: !1 }
  ) : (
    // Punctuation inside: already forms.
    { inside: !1, outside: !1 }
  );
}
va.peek = C1;
function va(t, e, n, r) {
  const s = T1(n), i = n.enter("emphasis"), o = n.createTracker(r), a = o.move(s);
  let l = o.move(
    n.containerPhrasing(t, {
      after: s,
      before: a,
      ...o.current()
    })
  );
  const u = l.charCodeAt(0), h = an(
    r.before.charCodeAt(r.before.length - 1),
    u,
    s
  );
  h.inside && (l = It(u) + l.slice(1));
  const c = l.charCodeAt(l.length - 1), d = an(r.after.charCodeAt(0), c, s);
  d.inside && (l = l.slice(0, -1) + It(c));
  const f = o.move(s);
  return i(), n.attentionEncodeSurroundingInfo = {
    after: d.outside,
    before: h.outside
  }, a + l + f;
}
function C1(t, e, n) {
  return n.options.emphasis || "*";
}
function I1(t, e) {
  let n = !1;
  return $r(t, function(r) {
    if ("value" in r && /\r?\n|\r/.test(r.value) || r.type === "break")
      return n = !0, Xn;
  }), !!((!t.depth || t.depth < 3) && Or(t) && (e.options.setext || n));
}
function E1(t, e, n, r) {
  const s = Math.max(Math.min(6, t.depth || 1), 1), i = n.createTracker(r);
  if (I1(t, n)) {
    const h = n.enter("headingSetext"), c = n.enter("phrasing"), d = n.containerPhrasing(t, {
      ...i.current(),
      before: `
`,
      after: `
`
    });
    return c(), h(), d + `
` + (s === 1 ? "=" : "-").repeat(
      // The whole size…
      d.length - // Minus the position of the character after the last EOL (or
      // 0 if there is none)…
      (Math.max(d.lastIndexOf("\r"), d.lastIndexOf(`
`)) + 1)
    );
  }
  const o = "#".repeat(s), a = n.enter("headingAtx"), l = n.enter("phrasing");
  i.move(o + " ");
  let u = n.containerPhrasing(t, {
    before: "# ",
    after: `
`,
    ...i.current()
  });
  return /^[\t ]/.test(u) && (u = It(u.charCodeAt(0)) + u.slice(1)), u = u ? o + " " + u : o, n.options.closeAtx && (u += " " + o), l(), a(), u;
}
ka.peek = A1;
function ka(t) {
  return t.value || "";
}
function A1() {
  return "<";
}
Ta.peek = R1;
function Ta(t, e, n, r) {
  const s = Nr(n), i = s === '"' ? "Quote" : "Apostrophe", o = n.enter("image");
  let a = n.enter("label");
  const l = n.createTracker(r);
  let u = l.move("![");
  return u += l.move(
    n.safe(t.alt, { before: u, after: "]", ...l.current() })
  ), u += l.move("]("), a(), // If there’s no url but there is a title…
  !t.url && t.title || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(t.url) ? (a = n.enter("destinationLiteral"), u += l.move("<"), u += l.move(
    n.safe(t.url, { before: u, after: ">", ...l.current() })
  ), u += l.move(">")) : (a = n.enter("destinationRaw"), u += l.move(
    n.safe(t.url, {
      before: u,
      after: t.title ? " " : ")",
      ...l.current()
    })
  )), a(), t.title && (a = n.enter(`title${i}`), u += l.move(" " + s), u += l.move(
    n.safe(t.title, {
      before: u,
      after: s,
      ...l.current()
    })
  ), u += l.move(s), a()), u += l.move(")"), o(), u;
}
function R1() {
  return "!";
}
Ca.peek = M1;
function Ca(t, e, n, r) {
  const s = t.referenceType, i = n.enter("imageReference");
  let o = n.enter("label");
  const a = n.createTracker(r);
  let l = a.move("![");
  const u = n.safe(t.alt, {
    before: l,
    after: "]",
    ...a.current()
  });
  l += a.move(u + "]["), o();
  const h = n.stack;
  n.stack = [], o = n.enter("reference");
  const c = n.safe(n.associationId(t), {
    before: l,
    after: "]",
    ...a.current()
  });
  return o(), n.stack = h, i(), s === "full" || !u || u !== c ? l += a.move(c + "]") : s === "shortcut" ? l = l.slice(0, -1) : l += a.move("]"), l;
}
function M1() {
  return "!";
}
Ia.peek = P1;
function Ia(t, e, n) {
  let r = t.value || "", s = "`", i = -1;
  for (; new RegExp("(^|[^`])" + s + "([^`]|$)").test(r); )
    s += "`";
  for (/[^ \r\n]/.test(r) && (/^[ \r\n]/.test(r) && /[ \r\n]$/.test(r) || /^`|`$/.test(r)) && (r = " " + r + " "); ++i < n.unsafe.length; ) {
    const o = n.unsafe[i], a = n.compilePattern(o);
    let l;
    if (o.atBreak)
      for (; l = a.exec(r); ) {
        let u = l.index;
        r.charCodeAt(u) === 10 && r.charCodeAt(u - 1) === 13 && u--, r = r.slice(0, u) + " " + r.slice(l.index + 1);
      }
  }
  return s + r + s;
}
function P1() {
  return "`";
}
function Ea(t, e) {
  const n = Or(t);
  return !!(!e.options.resourceLink && // If there’s a url…
  t.url && // And there’s a no title…
  !t.title && // And the content of `node` is a single text node…
  t.children && t.children.length === 1 && t.children[0].type === "text" && // And if the url is the same as the content…
  (n === t.url || "mailto:" + n === t.url) && // And that starts w/ a protocol…
  /^[a-z][a-z+.-]+:/i.test(t.url) && // And that doesn’t contain ASCII control codes (character escapes and
  // references don’t work), space, or angle brackets…
  !/[\0- <>\u007F]/.test(t.url));
}
Aa.peek = D1;
function Aa(t, e, n, r) {
  const s = Nr(n), i = s === '"' ? "Quote" : "Apostrophe", o = n.createTracker(r);
  let a, l;
  if (Ea(t, n)) {
    const h = n.stack;
    n.stack = [], a = n.enter("autolink");
    let c = o.move("<");
    return c += o.move(
      n.containerPhrasing(t, {
        before: c,
        after: ">",
        ...o.current()
      })
    ), c += o.move(">"), a(), n.stack = h, c;
  }
  a = n.enter("link"), l = n.enter("label");
  let u = o.move("[");
  return u += o.move(
    n.containerPhrasing(t, {
      before: u,
      after: "](",
      ...o.current()
    })
  ), u += o.move("]("), l(), // If there’s no url but there is a title…
  !t.url && t.title || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(t.url) ? (l = n.enter("destinationLiteral"), u += o.move("<"), u += o.move(
    n.safe(t.url, { before: u, after: ">", ...o.current() })
  ), u += o.move(">")) : (l = n.enter("destinationRaw"), u += o.move(
    n.safe(t.url, {
      before: u,
      after: t.title ? " " : ")",
      ...o.current()
    })
  )), l(), t.title && (l = n.enter(`title${i}`), u += o.move(" " + s), u += o.move(
    n.safe(t.title, {
      before: u,
      after: s,
      ...o.current()
    })
  ), u += o.move(s), l()), u += o.move(")"), a(), u;
}
function D1(t, e, n) {
  return Ea(t, n) ? "<" : "[";
}
Ra.peek = B1;
function Ra(t, e, n, r) {
  const s = t.referenceType, i = n.enter("linkReference");
  let o = n.enter("label");
  const a = n.createTracker(r);
  let l = a.move("[");
  const u = n.containerPhrasing(t, {
    before: l,
    after: "]",
    ...a.current()
  });
  l += a.move(u + "]["), o();
  const h = n.stack;
  n.stack = [], o = n.enter("reference");
  const c = n.safe(n.associationId(t), {
    before: l,
    after: "]",
    ...a.current()
  });
  return o(), n.stack = h, i(), s === "full" || !u || u !== c ? l += a.move(c + "]") : s === "shortcut" ? l = l.slice(0, -1) : l += a.move("]"), l;
}
function B1() {
  return "[";
}
function Lr(t) {
  const e = t.options.bullet || "*";
  if (e !== "*" && e !== "+" && e !== "-")
    throw new Error(
      "Cannot serialize items with `" + e + "` for `options.bullet`, expected `*`, `+`, or `-`"
    );
  return e;
}
function O1(t) {
  const e = Lr(t), n = t.options.bulletOther;
  if (!n)
    return e === "*" ? "-" : "*";
  if (n !== "*" && n !== "+" && n !== "-")
    throw new Error(
      "Cannot serialize items with `" + n + "` for `options.bulletOther`, expected `*`, `+`, or `-`"
    );
  if (n === e)
    throw new Error(
      "Expected `bullet` (`" + e + "`) and `bulletOther` (`" + n + "`) to be different"
    );
  return n;
}
function F1(t) {
  const e = t.options.bulletOrdered || ".";
  if (e !== "." && e !== ")")
    throw new Error(
      "Cannot serialize items with `" + e + "` for `options.bulletOrdered`, expected `.` or `)`"
    );
  return e;
}
function Ma(t) {
  const e = t.options.rule || "*";
  if (e !== "*" && e !== "-" && e !== "_")
    throw new Error(
      "Cannot serialize rules with `" + e + "` for `options.rule`, expected `*`, `-`, or `_`"
    );
  return e;
}
function $1(t, e, n, r) {
  const s = n.enter("list"), i = n.bulletCurrent;
  let o = t.ordered ? F1(n) : Lr(n);
  const a = t.ordered ? o === "." ? ")" : "." : O1(n);
  let l = e && n.bulletLastUsed ? o === n.bulletLastUsed : !1;
  if (!t.ordered) {
    const h = t.children ? t.children[0] : void 0;
    if (
      // Bullet could be used as a thematic break marker:
      (o === "*" || o === "-") && // Empty first list item:
      h && (!h.children || !h.children[0]) && // Directly in two other list items:
      n.stack[n.stack.length - 1] === "list" && n.stack[n.stack.length - 2] === "listItem" && n.stack[n.stack.length - 3] === "list" && n.stack[n.stack.length - 4] === "listItem" && // That are each the first child.
      n.indexStack[n.indexStack.length - 1] === 0 && n.indexStack[n.indexStack.length - 2] === 0 && n.indexStack[n.indexStack.length - 3] === 0 && (l = !0), Ma(n) === o && h
    ) {
      let c = -1;
      for (; ++c < t.children.length; ) {
        const d = t.children[c];
        if (d && d.type === "listItem" && d.children && d.children[0] && d.children[0].type === "thematicBreak") {
          l = !0;
          break;
        }
      }
    }
  }
  l && (o = a), n.bulletCurrent = o;
  const u = n.containerFlow(t, r);
  return n.bulletLastUsed = o, n.bulletCurrent = i, s(), u;
}
function N1(t) {
  const e = t.options.listItemIndent || "one";
  if (e !== "tab" && e !== "one" && e !== "mixed")
    throw new Error(
      "Cannot serialize items with `" + e + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`"
    );
  return e;
}
function L1(t, e, n, r) {
  const s = N1(n);
  let i = n.bulletCurrent || Lr(n);
  e && e.type === "list" && e.ordered && (i = (typeof e.start == "number" && e.start > -1 ? e.start : 1) + (n.options.incrementListMarker === !1 ? 0 : e.children.indexOf(t)) + i);
  let o = i.length + 1;
  (s === "tab" || s === "mixed" && (e && e.type === "list" && e.spread || t.spread)) && (o = Math.ceil(o / 4) * 4);
  const a = n.createTracker(r);
  a.move(i + " ".repeat(o - i.length)), a.shift(o);
  const l = n.enter("listItem"), u = n.indentLines(
    n.containerFlow(t, a.current()),
    h
  );
  return l(), u;
  function h(c, d, f) {
    return d ? (f ? "" : " ".repeat(o)) + c : (f ? i : i + " ".repeat(o - i.length)) + c;
  }
}
function z1(t, e, n, r) {
  const s = n.enter("paragraph"), i = n.enter("phrasing"), o = n.containerPhrasing(t, r);
  return i(), s(), o;
}
const V1 = (
  /** @type {(node?: unknown) => node is Exclude<PhrasingContent, Html>} */
  xn([
    "break",
    "delete",
    "emphasis",
    // To do: next major: removed since footnotes were added to GFM.
    "footnote",
    "footnoteReference",
    "image",
    "imageReference",
    "inlineCode",
    // Enabled by `mdast-util-math`:
    "inlineMath",
    "link",
    "linkReference",
    // Enabled by `mdast-util-mdx`:
    "mdxJsxTextElement",
    // Enabled by `mdast-util-mdx`:
    "mdxTextExpression",
    "strong",
    "text",
    // Enabled by `mdast-util-directive`:
    "textDirective"
  ])
);
function U1(t, e, n, r) {
  return (t.children.some(function(o) {
    return V1(o);
  }) ? n.containerPhrasing : n.containerFlow).call(n, t, r);
}
function q1(t) {
  const e = t.options.strong || "*";
  if (e !== "*" && e !== "_")
    throw new Error(
      "Cannot serialize strong with `" + e + "` for `options.strong`, expected `*`, or `_`"
    );
  return e;
}
Pa.peek = j1;
function Pa(t, e, n, r) {
  const s = q1(n), i = n.enter("strong"), o = n.createTracker(r), a = o.move(s + s);
  let l = o.move(
    n.containerPhrasing(t, {
      after: s,
      before: a,
      ...o.current()
    })
  );
  const u = l.charCodeAt(0), h = an(
    r.before.charCodeAt(r.before.length - 1),
    u,
    s
  );
  h.inside && (l = It(u) + l.slice(1));
  const c = l.charCodeAt(l.length - 1), d = an(r.after.charCodeAt(0), c, s);
  d.inside && (l = l.slice(0, -1) + It(c));
  const f = o.move(s + s);
  return i(), n.attentionEncodeSurroundingInfo = {
    after: d.outside,
    before: h.outside
  }, a + l + f;
}
function j1(t, e, n) {
  return n.options.strong || "*";
}
function H1(t, e, n, r) {
  return n.safe(t.value, r);
}
function G1(t) {
  const e = t.options.ruleRepetition || 3;
  if (e < 3)
    throw new Error(
      "Cannot serialize rules with repetition `" + e + "` for `options.ruleRepetition`, expected `3` or more"
    );
  return e;
}
function Q1(t, e, n) {
  const r = (Ma(n) + (n.options.ruleSpaces ? " " : "")).repeat(G1(n));
  return n.options.ruleSpaces ? r.slice(0, -1) : r;
}
const Da = {
  blockquote: b1,
  break: js,
  code: w1,
  definition: k1,
  emphasis: va,
  hardBreak: js,
  heading: E1,
  html: ka,
  image: Ta,
  imageReference: Ca,
  inlineCode: Ia,
  link: Aa,
  linkReference: Ra,
  list: $1,
  listItem: L1,
  paragraph: z1,
  root: U1,
  strong: Pa,
  text: H1,
  thematicBreak: Q1
};
function W1() {
  return {
    enter: {
      table: Y1,
      tableData: Hs,
      tableHeader: Hs,
      tableRow: J1
    },
    exit: {
      codeText: X1,
      table: K1,
      tableData: $n,
      tableHeader: $n,
      tableRow: $n
    }
  };
}
function Y1(t) {
  const e = t._align;
  this.enter(
    {
      type: "table",
      align: e.map(function(n) {
        return n === "none" ? null : n;
      }),
      children: []
    },
    t
  ), this.data.inTable = !0;
}
function K1(t) {
  this.exit(t), this.data.inTable = void 0;
}
function J1(t) {
  this.enter({ type: "tableRow", children: [] }, t);
}
function $n(t) {
  this.exit(t);
}
function Hs(t) {
  this.enter({ type: "tableCell", children: [] }, t);
}
function X1(t) {
  let e = this.resume();
  this.data.inTable && (e = e.replace(/\\([\\|])/g, Z1));
  const n = this.stack[this.stack.length - 1];
  ht(n.type === "inlineCode"), n.value = e, this.exit(t);
}
function Z1(t, e) {
  return e === "|" ? e : t;
}
function e_(t) {
  const e = t || {}, n = e.tableCellPadding, r = e.tablePipeAlign, s = e.stringLength, i = n ? " " : "|";
  return {
    unsafe: [
      { character: "\r", inConstruct: "tableCell" },
      { character: `
`, inConstruct: "tableCell" },
      // A pipe, when followed by a tab or space (padding), or a dash or colon
      // (unpadded delimiter row), could result in a table.
      { atBreak: !0, character: "|", after: "[	 :-]" },
      // A pipe in a cell must be encoded.
      { character: "|", inConstruct: "tableCell" },
      // A colon must be followed by a dash, in which case it could start a
      // delimiter row.
      { atBreak: !0, character: ":", after: "-" },
      // A delimiter row can also start with a dash, when followed by more
      // dashes, a colon, or a pipe.
      // This is a stricter version than the built in check for lists, thematic
      // breaks, and setex heading underlines though:
      // <https://github.com/syntax-tree/mdast-util-to-markdown/blob/51a2038/lib/unsafe.js#L57>
      { atBreak: !0, character: "-", after: "[:|-]" }
    ],
    handlers: {
      inlineCode: d,
      table: o,
      tableCell: l,
      tableRow: a
    }
  };
  function o(f, p, x, S) {
    return u(h(f, x, S), f.align);
  }
  function a(f, p, x, S) {
    const y = c(f, x, S), T = u([y]);
    return T.slice(0, T.indexOf(`
`));
  }
  function l(f, p, x, S) {
    const y = x.enter("tableCell"), T = x.enter("phrasing"), R = x.containerPhrasing(f, {
      ...S,
      before: i,
      after: i
    });
    return T(), y(), R;
  }
  function u(f, p) {
    return kl(f, {
      align: p,
      // @ts-expect-error: `markdown-table` types should support `null`.
      alignDelimiters: r,
      // @ts-expect-error: `markdown-table` types should support `null`.
      padding: n,
      // @ts-expect-error: `markdown-table` types should support `null`.
      stringLength: s
    });
  }
  function h(f, p, x) {
    const S = f.children;
    let y = -1;
    const T = [], R = p.enter("table");
    for (; ++y < S.length; )
      T[y] = c(S[y], p, x);
    return R(), T;
  }
  function c(f, p, x) {
    const S = f.children;
    let y = -1;
    const T = [], R = p.enter("tableRow");
    for (; ++y < S.length; )
      T[y] = l(S[y], f, p, x);
    return R(), T;
  }
  function d(f, p, x) {
    let S = Da.inlineCode(f, p, x);
    return x.stack.includes("tableCell") && (S = S.replace(/\|/g, "\\$&")), S;
  }
}
function t_() {
  return {
    exit: {
      taskListCheckValueChecked: Gs,
      taskListCheckValueUnchecked: Gs,
      paragraph: r_
    }
  };
}
function n_() {
  return {
    unsafe: [{ atBreak: !0, character: "-", after: "[:|-]" }],
    handlers: { listItem: s_ }
  };
}
function Gs(t) {
  const e = this.stack[this.stack.length - 2];
  ht(e.type === "listItem"), e.checked = t.type === "taskListCheckValueChecked";
}
function r_(t) {
  const e = this.stack[this.stack.length - 2];
  if (e && e.type === "listItem" && typeof e.checked == "boolean") {
    const n = this.stack[this.stack.length - 1];
    ht(n.type === "paragraph");
    const r = n.children[0];
    if (r && r.type === "text") {
      const s = e.children;
      let i = -1, o;
      for (; ++i < s.length; ) {
        const a = s[i];
        if (a.type === "paragraph") {
          o = a;
          break;
        }
      }
      o === n && (r.value = r.value.slice(1), r.value.length === 0 ? n.children.shift() : n.position && r.position && typeof r.position.start.offset == "number" && (r.position.start.column++, r.position.start.offset++, n.position.start = Object.assign({}, r.position.start)));
    }
  }
  this.exit(t);
}
function s_(t, e, n, r) {
  const s = t.children[0], i = typeof t.checked == "boolean" && s && s.type === "paragraph", o = "[" + (t.checked ? "x" : " ") + "] ", a = n.createTracker(r);
  i && a.move(o);
  let l = Da.listItem(t, e, n, {
    ...r,
    ...a.current()
  });
  return i && (l = l.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, u)), l;
  function u(h) {
    return h + o;
  }
}
function i_() {
  return [
    Vy(),
    l1(),
    d1(),
    W1(),
    t_()
  ];
}
function o_(t) {
  return {
    extensions: [
      Uy(),
      u1(t),
      f1(),
      e_(t),
      n_()
    ]
  };
}
const a_ = {
  tokenize: f_,
  partial: !0
}, Ba = {
  tokenize: p_,
  partial: !0
}, Oa = {
  tokenize: m_,
  partial: !0
}, Fa = {
  tokenize: g_,
  partial: !0
}, l_ = {
  tokenize: b_,
  partial: !0
}, $a = {
  name: "wwwAutolink",
  tokenize: h_,
  previous: La
}, Na = {
  name: "protocolAutolink",
  tokenize: d_,
  previous: za
}, De = {
  name: "emailAutolink",
  tokenize: c_,
  previous: Va
}, Se = {};
function u_() {
  return {
    text: Se
  };
}
let Ve = 48;
for (; Ve < 123; )
  Se[Ve] = De, Ve++, Ve === 58 ? Ve = 65 : Ve === 91 && (Ve = 97);
Se[43] = De;
Se[45] = De;
Se[46] = De;
Se[95] = De;
Se[72] = [De, Na];
Se[104] = [De, Na];
Se[87] = [De, $a];
Se[119] = [De, $a];
function c_(t, e, n) {
  const r = this;
  let s, i;
  return o;
  function o(c) {
    return !er(c) || !Va.call(r, r.previous) || zr(r.events) ? n(c) : (t.enter("literalAutolink"), t.enter("literalAutolinkEmail"), a(c));
  }
  function a(c) {
    return er(c) ? (t.consume(c), a) : c === 64 ? (t.consume(c), l) : n(c);
  }
  function l(c) {
    return c === 46 ? t.check(l_, h, u)(c) : c === 45 || c === 95 || ie(c) ? (i = !0, t.consume(c), l) : h(c);
  }
  function u(c) {
    return t.consume(c), s = !0, l;
  }
  function h(c) {
    return i && s && oe(r.previous) ? (t.exit("literalAutolinkEmail"), t.exit("literalAutolink"), e(c)) : n(c);
  }
}
function h_(t, e, n) {
  const r = this;
  return s;
  function s(o) {
    return o !== 87 && o !== 119 || !La.call(r, r.previous) || zr(r.events) ? n(o) : (t.enter("literalAutolink"), t.enter("literalAutolinkWww"), t.check(a_, t.attempt(Ba, t.attempt(Oa, i), n), n)(o));
  }
  function i(o) {
    return t.exit("literalAutolinkWww"), t.exit("literalAutolink"), e(o);
  }
}
function d_(t, e, n) {
  const r = this;
  let s = "", i = !1;
  return o;
  function o(c) {
    return (c === 72 || c === 104) && za.call(r, r.previous) && !zr(r.events) ? (t.enter("literalAutolink"), t.enter("literalAutolinkHttp"), s += String.fromCodePoint(c), t.consume(c), a) : n(c);
  }
  function a(c) {
    if (oe(c) && s.length < 5)
      return s += String.fromCodePoint(c), t.consume(c), a;
    if (c === 58) {
      const d = s.toLowerCase();
      if (d === "http" || d === "https")
        return t.consume(c), l;
    }
    return n(c);
  }
  function l(c) {
    return c === 47 ? (t.consume(c), i ? u : (i = !0, l)) : n(c);
  }
  function u(c) {
    return c === null || on(c) || Y(c) || Ke(c) || yn(c) ? n(c) : t.attempt(Ba, t.attempt(Oa, h), n)(c);
  }
  function h(c) {
    return t.exit("literalAutolinkHttp"), t.exit("literalAutolink"), e(c);
  }
}
function f_(t, e, n) {
  let r = 0;
  return s;
  function s(o) {
    return (o === 87 || o === 119) && r < 3 ? (r++, t.consume(o), s) : o === 46 && r === 3 ? (t.consume(o), i) : n(o);
  }
  function i(o) {
    return o === null ? n(o) : e(o);
  }
}
function p_(t, e, n) {
  let r, s, i;
  return o;
  function o(u) {
    return u === 46 || u === 95 ? t.check(Fa, l, a)(u) : u === null || Y(u) || Ke(u) || u !== 45 && yn(u) ? l(u) : (i = !0, t.consume(u), o);
  }
  function a(u) {
    return u === 95 ? r = !0 : (s = r, r = void 0), t.consume(u), o;
  }
  function l(u) {
    return s || r || !i ? n(u) : e(u);
  }
}
function m_(t, e) {
  let n = 0, r = 0;
  return s;
  function s(o) {
    return o === 40 ? (n++, t.consume(o), s) : o === 41 && r < n ? i(o) : o === 33 || o === 34 || o === 38 || o === 39 || o === 41 || o === 42 || o === 44 || o === 46 || o === 58 || o === 59 || o === 60 || o === 63 || o === 93 || o === 95 || o === 126 ? t.check(Fa, e, i)(o) : o === null || Y(o) || Ke(o) ? e(o) : (t.consume(o), s);
  }
  function i(o) {
    return o === 41 && r++, t.consume(o), s;
  }
}
function g_(t, e, n) {
  return r;
  function r(a) {
    return a === 33 || a === 34 || a === 39 || a === 41 || a === 42 || a === 44 || a === 46 || a === 58 || a === 59 || a === 63 || a === 95 || a === 126 ? (t.consume(a), r) : a === 38 ? (t.consume(a), i) : a === 93 ? (t.consume(a), s) : (
      // `<` is an end.
      a === 60 || // So is whitespace.
      a === null || Y(a) || Ke(a) ? e(a) : n(a)
    );
  }
  function s(a) {
    return a === null || a === 40 || a === 91 || Y(a) || Ke(a) ? e(a) : r(a);
  }
  function i(a) {
    return oe(a) ? o(a) : n(a);
  }
  function o(a) {
    return a === 59 ? (t.consume(a), r) : oe(a) ? (t.consume(a), o) : n(a);
  }
}
function b_(t, e, n) {
  return r;
  function r(i) {
    return t.consume(i), s;
  }
  function s(i) {
    return ie(i) ? n(i) : e(i);
  }
}
function La(t) {
  return t === null || t === 40 || t === 42 || t === 95 || t === 91 || t === 93 || t === 126 || Y(t);
}
function za(t) {
  return !oe(t);
}
function Va(t) {
  return !(t === 47 || er(t));
}
function er(t) {
  return t === 43 || t === 45 || t === 46 || t === 95 || ie(t);
}
function zr(t) {
  let e = t.length, n = !1;
  for (; e--; ) {
    const r = t[e][1];
    if ((r.type === "labelLink" || r.type === "labelImage") && !r._balanced) {
      n = !0;
      break;
    }
    if (r._gfmAutolinkLiteralWalkedInto) {
      n = !1;
      break;
    }
  }
  return t.length > 0 && !n && (t[t.length - 1][1]._gfmAutolinkLiteralWalkedInto = !0), n;
}
const y_ = {
  tokenize: C_,
  partial: !0
};
function __() {
  return {
    document: {
      91: {
        name: "gfmFootnoteDefinition",
        tokenize: v_,
        continuation: {
          tokenize: k_
        },
        exit: T_
      }
    },
    text: {
      91: {
        name: "gfmFootnoteCall",
        tokenize: w_
      },
      93: {
        name: "gfmPotentialFootnoteCall",
        add: "after",
        tokenize: x_,
        resolveTo: S_
      }
    }
  };
}
function x_(t, e, n) {
  const r = this;
  let s = r.events.length;
  const i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let o;
  for (; s--; ) {
    const l = r.events[s][1];
    if (l.type === "labelImage") {
      o = l;
      break;
    }
    if (l.type === "gfmFootnoteCall" || l.type === "labelLink" || l.type === "label" || l.type === "image" || l.type === "link")
      break;
  }
  return a;
  function a(l) {
    if (!o || !o._balanced)
      return n(l);
    const u = ge(r.sliceSerialize({
      start: o.end,
      end: r.now()
    }));
    return u.codePointAt(0) !== 94 || !i.includes(u.slice(1)) ? n(l) : (t.enter("gfmFootnoteCallLabelMarker"), t.consume(l), t.exit("gfmFootnoteCallLabelMarker"), e(l));
  }
}
function S_(t, e) {
  let n = t.length;
  for (; n--; )
    if (t[n][1].type === "labelImage" && t[n][0] === "enter") {
      t[n][1];
      break;
    }
  t[n + 1][1].type = "data", t[n + 3][1].type = "gfmFootnoteCallLabelMarker";
  const r = {
    type: "gfmFootnoteCall",
    start: Object.assign({}, t[n + 3][1].start),
    end: Object.assign({}, t[t.length - 1][1].end)
  }, s = {
    type: "gfmFootnoteCallMarker",
    start: Object.assign({}, t[n + 3][1].end),
    end: Object.assign({}, t[n + 3][1].end)
  };
  s.end.column++, s.end.offset++, s.end._bufferIndex++;
  const i = {
    type: "gfmFootnoteCallString",
    start: Object.assign({}, s.end),
    end: Object.assign({}, t[t.length - 1][1].start)
  }, o = {
    type: "chunkString",
    contentType: "string",
    start: Object.assign({}, i.start),
    end: Object.assign({}, i.end)
  }, a = [
    // Take the `labelImageMarker` (now `data`, the `!`)
    t[n + 1],
    t[n + 2],
    ["enter", r, e],
    // The `[`
    t[n + 3],
    t[n + 4],
    // The `^`.
    ["enter", s, e],
    ["exit", s, e],
    // Everything in between.
    ["enter", i, e],
    ["enter", o, e],
    ["exit", o, e],
    ["exit", i, e],
    // The ending (`]`, properly parsed and labelled).
    t[t.length - 2],
    t[t.length - 1],
    ["exit", r, e]
  ];
  return t.splice(n, t.length - n + 1, ...a), t;
}
function w_(t, e, n) {
  const r = this, s = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let i = 0, o;
  return a;
  function a(c) {
    return t.enter("gfmFootnoteCall"), t.enter("gfmFootnoteCallLabelMarker"), t.consume(c), t.exit("gfmFootnoteCallLabelMarker"), l;
  }
  function l(c) {
    return c !== 94 ? n(c) : (t.enter("gfmFootnoteCallMarker"), t.consume(c), t.exit("gfmFootnoteCallMarker"), t.enter("gfmFootnoteCallString"), t.enter("chunkString").contentType = "string", u);
  }
  function u(c) {
    if (
      // Too long.
      i > 999 || // Closing brace with nothing.
      c === 93 && !o || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      c === null || c === 91 || Y(c)
    )
      return n(c);
    if (c === 93) {
      t.exit("chunkString");
      const d = t.exit("gfmFootnoteCallString");
      return s.includes(ge(r.sliceSerialize(d))) ? (t.enter("gfmFootnoteCallLabelMarker"), t.consume(c), t.exit("gfmFootnoteCallLabelMarker"), t.exit("gfmFootnoteCall"), e) : n(c);
    }
    return Y(c) || (o = !0), i++, t.consume(c), c === 92 ? h : u;
  }
  function h(c) {
    return c === 91 || c === 92 || c === 93 ? (t.consume(c), i++, u) : u(c);
  }
}
function v_(t, e, n) {
  const r = this, s = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let i, o = 0, a;
  return l;
  function l(p) {
    return t.enter("gfmFootnoteDefinition")._container = !0, t.enter("gfmFootnoteDefinitionLabel"), t.enter("gfmFootnoteDefinitionLabelMarker"), t.consume(p), t.exit("gfmFootnoteDefinitionLabelMarker"), u;
  }
  function u(p) {
    return p === 94 ? (t.enter("gfmFootnoteDefinitionMarker"), t.consume(p), t.exit("gfmFootnoteDefinitionMarker"), t.enter("gfmFootnoteDefinitionLabelString"), t.enter("chunkString").contentType = "string", h) : n(p);
  }
  function h(p) {
    if (
      // Too long.
      o > 999 || // Closing brace with nothing.
      p === 93 && !a || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      p === null || p === 91 || Y(p)
    )
      return n(p);
    if (p === 93) {
      t.exit("chunkString");
      const x = t.exit("gfmFootnoteDefinitionLabelString");
      return i = ge(r.sliceSerialize(x)), t.enter("gfmFootnoteDefinitionLabelMarker"), t.consume(p), t.exit("gfmFootnoteDefinitionLabelMarker"), t.exit("gfmFootnoteDefinitionLabel"), d;
    }
    return Y(p) || (a = !0), o++, t.consume(p), p === 92 ? c : h;
  }
  function c(p) {
    return p === 91 || p === 92 || p === 93 ? (t.consume(p), o++, h) : h(p);
  }
  function d(p) {
    return p === 58 ? (t.enter("definitionMarker"), t.consume(p), t.exit("definitionMarker"), s.includes(i) || s.push(i), U(t, f, "gfmFootnoteDefinitionWhitespace")) : n(p);
  }
  function f(p) {
    return e(p);
  }
}
function k_(t, e, n) {
  return t.check(_n, e, t.attempt(y_, e, n));
}
function T_(t) {
  t.exit("gfmFootnoteDefinition");
}
function C_(t, e, n) {
  const r = this;
  return U(t, s, "gfmFootnoteDefinitionIndent", 5);
  function s(i) {
    const o = r.events[r.events.length - 1];
    return o && o[1].type === "gfmFootnoteDefinitionIndent" && o[2].sliceSerialize(o[1], !0).length === 4 ? e(i) : n(i);
  }
}
function I_(t) {
  let n = (t || {}).singleTilde;
  const r = {
    name: "strikethrough",
    tokenize: i,
    resolveAll: s
  };
  return n == null && (n = !0), {
    text: {
      126: r
    },
    insideSpan: {
      null: [r]
    },
    attentionMarkers: {
      null: [126]
    }
  };
  function s(o, a) {
    let l = -1;
    for (; ++l < o.length; )
      if (o[l][0] === "enter" && o[l][1].type === "strikethroughSequenceTemporary" && o[l][1]._close) {
        let u = l;
        for (; u--; )
          if (o[u][0] === "exit" && o[u][1].type === "strikethroughSequenceTemporary" && o[u][1]._open && // If the sizes are the same:
          o[l][1].end.offset - o[l][1].start.offset === o[u][1].end.offset - o[u][1].start.offset) {
            o[l][1].type = "strikethroughSequence", o[u][1].type = "strikethroughSequence";
            const h = {
              type: "strikethrough",
              start: Object.assign({}, o[u][1].start),
              end: Object.assign({}, o[l][1].end)
            }, c = {
              type: "strikethroughText",
              start: Object.assign({}, o[u][1].end),
              end: Object.assign({}, o[l][1].start)
            }, d = [["enter", h, a], ["enter", o[u][1], a], ["exit", o[u][1], a], ["enter", c, a]], f = a.parser.constructs.insideSpan.null;
            f && xe(d, d.length, 0, Fr(f, o.slice(u + 1, l), a)), xe(d, d.length, 0, [["exit", c, a], ["enter", o[l][1], a], ["exit", o[l][1], a], ["exit", h, a]]), xe(o, u - 1, l - u + 3, d), l = u + d.length - 2;
            break;
          }
      }
    for (l = -1; ++l < o.length; )
      o[l][1].type === "strikethroughSequenceTemporary" && (o[l][1].type = "data");
    return o;
  }
  function i(o, a, l) {
    const u = this.previous, h = this.events;
    let c = 0;
    return d;
    function d(p) {
      return u === 126 && h[h.length - 1][1].type !== "characterEscape" ? l(p) : (o.enter("strikethroughSequenceTemporary"), f(p));
    }
    function f(p) {
      const x = ut(u);
      if (p === 126)
        return c > 1 ? l(p) : (o.consume(p), c++, f);
      if (c < 2 && !n) return l(p);
      const S = o.exit("strikethroughSequenceTemporary"), y = ut(p);
      return S._open = !y || y === 2 && !!x, S._close = !x || x === 2 && !!y, a(p);
    }
  }
}
class E_ {
  /**
   * Create a new edit map.
   */
  constructor() {
    this.map = [];
  }
  /**
   * Create an edit: a remove and/or add at a certain place.
   *
   * @param {number} index
   * @param {number} remove
   * @param {Array<Event>} add
   * @returns {undefined}
   */
  add(e, n, r) {
    A_(this, e, n, r);
  }
  // To do: add this when moving to `micromark`.
  // /**
  //  * Create an edit: but insert `add` before existing additions.
  //  *
  //  * @param {number} index
  //  * @param {number} remove
  //  * @param {Array<Event>} add
  //  * @returns {undefined}
  //  */
  // addBefore(index, remove, add) {
  //   addImplementation(this, index, remove, add, true)
  // }
  /**
   * Done, change the events.
   *
   * @param {Array<Event>} events
   * @returns {undefined}
   */
  consume(e) {
    if (this.map.sort(function(i, o) {
      return i[0] - o[0];
    }), this.map.length === 0)
      return;
    let n = this.map.length;
    const r = [];
    for (; n > 0; )
      n -= 1, r.push(e.slice(this.map[n][0] + this.map[n][1]), this.map[n][2]), e.length = this.map[n][0];
    r.push(e.slice()), e.length = 0;
    let s = r.pop();
    for (; s; ) {
      for (const i of s)
        e.push(i);
      s = r.pop();
    }
    this.map.length = 0;
  }
}
function A_(t, e, n, r) {
  let s = 0;
  if (!(n === 0 && r.length === 0)) {
    for (; s < t.map.length; ) {
      if (t.map[s][0] === e) {
        t.map[s][1] += n, t.map[s][2].push(...r);
        return;
      }
      s += 1;
    }
    t.map.push([e, n, r]);
  }
}
function R_(t, e) {
  let n = !1;
  const r = [];
  for (; e < t.length; ) {
    const s = t[e];
    if (n) {
      if (s[0] === "enter")
        s[1].type === "tableContent" && r.push(t[e + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
      else if (s[1].type === "tableContent") {
        if (t[e - 1][1].type === "tableDelimiterMarker") {
          const i = r.length - 1;
          r[i] = r[i] === "left" ? "center" : "right";
        }
      } else if (s[1].type === "tableDelimiterRow")
        break;
    } else s[0] === "enter" && s[1].type === "tableDelimiterRow" && (n = !0);
    e += 1;
  }
  return r;
}
function M_() {
  return {
    flow: {
      null: {
        name: "table",
        tokenize: P_,
        resolveAll: D_
      }
    }
  };
}
function P_(t, e, n) {
  const r = this;
  let s = 0, i = 0, o;
  return a;
  function a(w) {
    let L = r.events.length - 1;
    for (; L > -1; ) {
      const G = r.events[L][1].type;
      if (G === "lineEnding" || // Note: markdown-rs uses `whitespace` instead of `linePrefix`
      G === "linePrefix") L--;
      else break;
    }
    const O = L > -1 ? r.events[L][1].type : null, V = O === "tableHead" || O === "tableRow" ? b : l;
    return V === b && r.parser.lazy[r.now().line] ? n(w) : V(w);
  }
  function l(w) {
    return t.enter("tableHead"), t.enter("tableRow"), u(w);
  }
  function u(w) {
    return w === 124 || (o = !0, i += 1), h(w);
  }
  function h(w) {
    return w === null ? n(w) : B(w) ? i > 1 ? (i = 0, r.interrupt = !0, t.exit("tableRow"), t.enter("lineEnding"), t.consume(w), t.exit("lineEnding"), f) : n(w) : N(w) ? U(t, h, "whitespace")(w) : (i += 1, o && (o = !1, s += 1), w === 124 ? (t.enter("tableCellDivider"), t.consume(w), t.exit("tableCellDivider"), o = !0, h) : (t.enter("data"), c(w)));
  }
  function c(w) {
    return w === null || w === 124 || Y(w) ? (t.exit("data"), h(w)) : (t.consume(w), w === 92 ? d : c);
  }
  function d(w) {
    return w === 92 || w === 124 ? (t.consume(w), c) : c(w);
  }
  function f(w) {
    return r.interrupt = !1, r.parser.lazy[r.now().line] ? n(w) : (t.enter("tableDelimiterRow"), o = !1, N(w) ? U(t, p, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(w) : p(w));
  }
  function p(w) {
    return w === 45 || w === 58 ? S(w) : w === 124 ? (o = !0, t.enter("tableCellDivider"), t.consume(w), t.exit("tableCellDivider"), x) : I(w);
  }
  function x(w) {
    return N(w) ? U(t, S, "whitespace")(w) : S(w);
  }
  function S(w) {
    return w === 58 ? (i += 1, o = !0, t.enter("tableDelimiterMarker"), t.consume(w), t.exit("tableDelimiterMarker"), y) : w === 45 ? (i += 1, y(w)) : w === null || B(w) ? C(w) : I(w);
  }
  function y(w) {
    return w === 45 ? (t.enter("tableDelimiterFiller"), T(w)) : I(w);
  }
  function T(w) {
    return w === 45 ? (t.consume(w), T) : w === 58 ? (o = !0, t.exit("tableDelimiterFiller"), t.enter("tableDelimiterMarker"), t.consume(w), t.exit("tableDelimiterMarker"), R) : (t.exit("tableDelimiterFiller"), R(w));
  }
  function R(w) {
    return N(w) ? U(t, C, "whitespace")(w) : C(w);
  }
  function C(w) {
    return w === 124 ? p(w) : w === null || B(w) ? !o || s !== i ? I(w) : (t.exit("tableDelimiterRow"), t.exit("tableHead"), e(w)) : I(w);
  }
  function I(w) {
    return n(w);
  }
  function b(w) {
    return t.enter("tableRow"), E(w);
  }
  function E(w) {
    return w === 124 ? (t.enter("tableCellDivider"), t.consume(w), t.exit("tableCellDivider"), E) : w === null || B(w) ? (t.exit("tableRow"), e(w)) : N(w) ? U(t, E, "whitespace")(w) : (t.enter("data"), A(w));
  }
  function A(w) {
    return w === null || w === 124 || Y(w) ? (t.exit("data"), E(w)) : (t.consume(w), w === 92 ? D : A);
  }
  function D(w) {
    return w === 92 || w === 124 ? (t.consume(w), A) : A(w);
  }
}
function D_(t, e) {
  let n = -1, r = !0, s = 0, i = [0, 0, 0, 0], o = [0, 0, 0, 0], a = !1, l = 0, u, h, c;
  const d = new E_();
  for (; ++n < t.length; ) {
    const f = t[n], p = f[1];
    f[0] === "enter" ? p.type === "tableHead" ? (a = !1, l !== 0 && (Qs(d, e, l, u, h), h = void 0, l = 0), u = {
      type: "table",
      start: Object.assign({}, p.start),
      // Note: correct end is set later.
      end: Object.assign({}, p.end)
    }, d.add(n, 0, [["enter", u, e]])) : p.type === "tableRow" || p.type === "tableDelimiterRow" ? (r = !0, c = void 0, i = [0, 0, 0, 0], o = [0, n + 1, 0, 0], a && (a = !1, h = {
      type: "tableBody",
      start: Object.assign({}, p.start),
      // Note: correct end is set later.
      end: Object.assign({}, p.end)
    }, d.add(n, 0, [["enter", h, e]])), s = p.type === "tableDelimiterRow" ? 2 : h ? 3 : 1) : s && (p.type === "data" || p.type === "tableDelimiterMarker" || p.type === "tableDelimiterFiller") ? (r = !1, o[2] === 0 && (i[1] !== 0 && (o[0] = o[1], c = Ut(d, e, i, s, void 0, c), i = [0, 0, 0, 0]), o[2] = n)) : p.type === "tableCellDivider" && (r ? r = !1 : (i[1] !== 0 && (o[0] = o[1], c = Ut(d, e, i, s, void 0, c)), i = o, o = [i[1], n, 0, 0])) : p.type === "tableHead" ? (a = !0, l = n) : p.type === "tableRow" || p.type === "tableDelimiterRow" ? (l = n, i[1] !== 0 ? (o[0] = o[1], c = Ut(d, e, i, s, n, c)) : o[1] !== 0 && (c = Ut(d, e, o, s, n, c)), s = 0) : s && (p.type === "data" || p.type === "tableDelimiterMarker" || p.type === "tableDelimiterFiller") && (o[3] = n);
  }
  for (l !== 0 && Qs(d, e, l, u, h), d.consume(e.events), n = -1; ++n < e.events.length; ) {
    const f = e.events[n];
    f[0] === "enter" && f[1].type === "table" && (f[1]._align = R_(e.events, n));
  }
  return t;
}
function Ut(t, e, n, r, s, i) {
  const o = r === 1 ? "tableHeader" : r === 2 ? "tableDelimiter" : "tableData", a = "tableContent";
  n[0] !== 0 && (i.end = Object.assign({}, nt(e.events, n[0])), t.add(n[0], 0, [["exit", i, e]]));
  const l = nt(e.events, n[1]);
  if (i = {
    type: o,
    start: Object.assign({}, l),
    // Note: correct end is set later.
    end: Object.assign({}, l)
  }, t.add(n[1], 0, [["enter", i, e]]), n[2] !== 0) {
    const u = nt(e.events, n[2]), h = nt(e.events, n[3]), c = {
      type: a,
      start: Object.assign({}, u),
      end: Object.assign({}, h)
    };
    if (t.add(n[2], 0, [["enter", c, e]]), r !== 2) {
      const d = e.events[n[2]], f = e.events[n[3]];
      if (d[1].end = Object.assign({}, f[1].end), d[1].type = "chunkText", d[1].contentType = "text", n[3] > n[2] + 1) {
        const p = n[2] + 1, x = n[3] - n[2] - 1;
        t.add(p, x, []);
      }
    }
    t.add(n[3] + 1, 0, [["exit", c, e]]);
  }
  return s !== void 0 && (i.end = Object.assign({}, nt(e.events, s)), t.add(s, 0, [["exit", i, e]]), i = void 0), i;
}
function Qs(t, e, n, r, s) {
  const i = [], o = nt(e.events, n);
  s && (s.end = Object.assign({}, o), i.push(["exit", s, e])), r.end = Object.assign({}, o), i.push(["exit", r, e]), t.add(n + 1, 0, i);
}
function nt(t, e) {
  const n = t[e], r = n[0] === "enter" ? "start" : "end";
  return n[1][r];
}
const B_ = {
  name: "tasklistCheck",
  tokenize: F_
};
function O_() {
  return {
    text: {
      91: B_
    }
  };
}
function F_(t, e, n) {
  const r = this;
  return s;
  function s(l) {
    return (
      // Exit if there’s stuff before.
      r.previous !== null || // Exit if not in the first content that is the first child of a list
      // item.
      !r._gfmTasklistFirstContentOfListItem ? n(l) : (t.enter("taskListCheck"), t.enter("taskListCheckMarker"), t.consume(l), t.exit("taskListCheckMarker"), i)
    );
  }
  function i(l) {
    return Y(l) ? (t.enter("taskListCheckValueUnchecked"), t.consume(l), t.exit("taskListCheckValueUnchecked"), o) : l === 88 || l === 120 ? (t.enter("taskListCheckValueChecked"), t.consume(l), t.exit("taskListCheckValueChecked"), o) : n(l);
  }
  function o(l) {
    return l === 93 ? (t.enter("taskListCheckMarker"), t.consume(l), t.exit("taskListCheckMarker"), t.exit("taskListCheck"), a) : n(l);
  }
  function a(l) {
    return B(l) ? e(l) : N(l) ? t.check({
      tokenize: $_
    }, e, n)(l) : n(l);
  }
}
function $_(t, e, n) {
  return U(t, r, "whitespace");
  function r(s) {
    return s === null ? n(s) : e(s);
  }
}
function N_(t) {
  return pg([
    u_(),
    __(),
    I_(t),
    M_(),
    O_()
  ]);
}
const L_ = {};
function fx(t) {
  const e = (
    /** @type {Processor<Root>} */
    this
  ), n = t || L_, r = e.data(), s = r.micromarkExtensions || (r.micromarkExtensions = []), i = r.fromMarkdownExtensions || (r.fromMarkdownExtensions = []), o = r.toMarkdownExtensions || (r.toMarkdownExtensions = []);
  s.push(N_(n)), i.push(i_()), o.push(o_(n));
}
export {
  lx as A,
  cx as B,
  pe as C,
  Fr as D,
  pg as E,
  Lg as F,
  j_ as G,
  H_ as H,
  W_ as I,
  P as J,
  Q_ as K,
  G_ as L,
  dx as M,
  xe as a,
  _n as b,
  nx as c,
  rx as d,
  kg as e,
  U as f,
  Z_ as g,
  hx as h,
  ox as i,
  ix as j,
  ex as k,
  _b as l,
  B as m,
  Y_ as n,
  J_ as o,
  sa as p,
  X_ as q,
  fx as r,
  Gt as s,
  bb as t,
  tx as u,
  ha as v,
  sx as w,
  ux as x,
  K_ as y,
  ax as z
};
