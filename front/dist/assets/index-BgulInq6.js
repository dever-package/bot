import { j as m, a as N, F as $e } from "./preloadable-B6QZqbLd.js";
import { R as es, u as Ge, b as ne, v as Ml, h as B, w as kl, x as Dl, f as $o, C as ci, y as Mn, z as Rs, F as Pl, A as Bo, l as Ol, a as G, d as le, m as ls } from "./file-kind-Cq3pESGF.js";
import { q as Nl, h as $l, o as Bl, A as Fo, P as Lo, r as Ut, a_ as Fl, p as Ll, c as Vo, aQ as Vl, aA as jl, ag as ql, n as jo, ab as li, b3 as Ul, R as Hl, ah as zl, b4 as Gl, a4 as Wl, X as Yl } from "./vendor-icons-IZIW7U43.js";
import { t as qo, f as Ql, h as Uo, g as Jl, l as Xl, i as Kl, j as Zl, k as eu, m as Bt, n as ui, r as tu, o as su, p as nu, q as ru, s as un, c as iu, A as ou, a as au, u as cu, v as lu, d as uu, w as du, x as hu, y as fu, e as mu, z as pu, B as gu } from "./interaction-view-FcI3wmyX.js";
import { x as bu, c as _u, i as Tr, d as vu } from "./space-assistant-layout-B9KyeCM0.js";
import { A as Ho, a as Cs, c as yu, b as wu, d as Su } from "./clipboard-huYfixzw.js";
import { e as zo, f as xu, m as Iu, l as Tu, o as Hs, p as Cu, q as Go, s as Eu, t as Au, u as di, n as Ru, v as Mu, i as Ms, r as Wo, a as ku, w as Du, x as Pu, y as Ou, z as Nu, c as Yo, d as $u, k as Bu } from "./runtime-DQ2rFFvP.js";
import { P as Fu } from "./power-icon-CM-9ejD_.js";
import { P as Lu } from "./power-picker-menu-CSlRVCfz.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./index-iPUNjXsT.css", import.meta.url).href]);
let It = null;
function Vu(t, e) {
  t.currentIndex = 0, t.wipContextDeps = null, t.wipCommitCallbacks = [];
  const s = It;
  It = t;
  try {
    if (e(), t.isFirstRender = !1, t.cells.length !== t.currentIndex) throw new Error(`Rendered ${t.currentIndex} hooks but expected ${t.cells.length}. Hooks must be called in the exact same order in every render.`);
  } finally {
    It = s;
  }
}
function Ae() {
  if (!It) throw new Error("No resource fiber available");
  return It;
}
function Be() {
  return It;
}
const ju = (t, e) => ({
  onError: e,
  version: 0,
  committedVersion: 0,
  dispatchUpdate: t,
  changelog: [],
  committedLog: [],
  unsettledCount: 0,
  rollbackCallbacks: []
}), Qo = (t) => {
  t.committedVersion = t.version;
  for (const e of t.changelog)
    e.logged = !1, e.settled || (e.settled = !0, t.unsettledCount--), t.committedLog.push(e);
  t.changelog.length = 0, t.unsettledCount === 0 && (t.committedLog.length = 0), t.rollbackCallbacks.length = 0;
}, hi = (t, e) => {
  const s = t.version > e;
  if (t.version = e, s) {
    for (let n = 0; n < t.rollbackCallbacks.length; n++) t.rollbackCallbacks[n]();
    if (t.rollbackCallbacks.length = 0, e <= t.committedVersion) {
      const n = [];
      for (; t.committedVersion - n.length > e; ) {
        const r = t.committedLog.pop();
        if (r === void 0)
          break;
        Cr(r.fiber, r.cell), r.cell.workInProgress = r.prevState, n.push({
          record: r,
          prevState: r.prevState,
          eagerState: r.eagerState,
          hasEagerState: r.hasEagerState
        });
      }
      if (n.length > 0) {
        const r = t.committedVersion;
        zs(t, () => {
          for (let i = n.length - 1; i >= 0; i--) {
            const o = n[i];
            o.record.prevState = o.prevState, o.record.eagerState = o.eagerState, o.record.hasEagerState = o.hasEagerState, t.committedLog.push(o.record);
          }
          t.committedVersion = r;
        });
      }
      t.committedVersion = e;
      for (const r of t.changelog) r.logged = !1;
      t.changelog.length = 0;
    } else {
      for (; t.committedVersion + t.changelog.length > e; ) t.changelog.pop().logged = !1;
      for (let n = 0; n < t.changelog.length; n++) Jo(t.changelog[n]);
      Qo(t);
    }
  }
}, Jo = (t) => {
  Cr(t.fiber, t.cell), t.queued || (t.queued = !0, (t.cell.queue ??= []).push(t));
}, ts = (t, e) => {
  t.wipCommitCallbacks.push(e);
}, zs = (t, e) => {
  t.rollbackCallbacks.push(e);
}, Cr = (t, e) => {
  e.isDirty || (e.isDirty = !0, t.markDirty?.(), zs(t.root, () => {
    if (e.queue !== null) {
      for (const s of e.queue) s.queued = !1;
      e.queue = null;
    }
    e.workInProgress = e.current, e.isDirty = !1;
  }));
}, Xo = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), kn = (t) => new Array(t).fill(Xo), qu = (t, e) => {
  const s = t.memoCache;
  let n = s.workInProgress;
  if (n === null) {
    const o = s.current;
    n = o === null ? [] : o.map((a) => a.slice()), s.workInProgress = n, zs(t.root, () => {
      s.workInProgress = null, s.refreshedIndices = null;
    });
  }
  const r = s.index++;
  let i = n[r];
  return s.refreshedIndices?.has(r) && !t.isRefreshing && (s.refreshedIndices.delete(r), i = s.current?.[r]?.slice() ?? kn(e), n[r] = i), (i === void 0 || t.isRefreshing) && (i = kn(e), n[r] = i, t.isRefreshing && (s.refreshedIndices ??= /* @__PURE__ */ new Set()).add(r)), i;
}, Ko = (t) => qu(Ae(), t), Uu = es, Hu = (t) => Ge(() => {
  const e = kn(t);
  return e[Xo] = !0, e;
}, []), zu = Uu.__COMPILER_RUNTIME?.c ?? Hu, Gu = () => Be() !== null, x = (t) => Gu() ? Ko(t) : zu(t), ss = () => {
  throw new Error("Rendered more hooks than during the previous render. Hooks must be called in the exact same order in every render.");
}, ns = () => {
  throw new Error("Hook order changed between renders");
}, Wu = (t) => ({
  type: t,
  setup: void 0,
  setupDeps: void 0,
  cleanup: void 0,
  deps: null,
  generation: 0
});
function Zo(t, e, s) {
  const n = Ae(), r = n.currentIndex++, i = n.cells[r], o = i === void 0 ? Wu(s) : i.type === s ? i : ns();
  if (i === void 0 && (n.isFirstRender || ss(), n.cells[r] = o, s === "insertion" ? (n.insertionCells ??= []).push(o) : n.effectCells.push(o)), o.deps !== null && !!e != !!o.deps) throw new Error("useEffect called with and without dependencies across re-renders");
  const a = n.isRefreshing;
  ts(n, () => {
    o.setup = t, o.setupDeps = e, a && (o.deps = null), o.generation++;
  });
}
function Le(t, e) {
  Zo(t, e, "effect");
}
function ot(t) {
  const e = Ae(), s = e.currentIndex++, n = e.cells[s];
  if (n === void 0) {
    e.isFirstRender || ss();
    const r = { current: t };
    return e.cells[s] = {
      type: "ref",
      ref: r
    }, r;
  }
  return n.type !== "ref" ? ns() : n.ref;
}
const Er = /* @__PURE__ */ Symbol("tap.Context.defaultValue"), Yu = (t) => t;
let xt = /* @__PURE__ */ new Map();
const nt = /* @__PURE__ */ new Set(), ea = (t, e) => {
  t[Er] = e;
}, ta = (t) => typeof t == "object" && t !== null && Er in t, sa = (t) => typeof t == "object" && t !== null && "$$typeof" in t && t.$$typeof === /* @__PURE__ */ Symbol.for("react.context"), Dn = (t) => ta(t) || sa(t), na = (t) => {
  if (!ta(t)) {
    if (sa(t)) {
      ea(t, t._currentValue ?? t._currentValue2);
      return;
    }
    throw new Error("A tap resource's `use()` only accepts a tap context.");
  }
}, Gs = (t, e, s) => {
  if (typeof t != "object" || t === null) throw new Error("useContextProvider only accepts a React context.");
  na(t);
  const n = t, r = Ae(), i = ot(void 0), o = i.current === void 0 || !Object.is(i.current.value, e);
  Le(() => {
    i.current = { value: e };
  }, [e]);
  const a = xt.get(n), c = a !== void 0 || xt.has(n);
  xt.set(n, {
    value: e,
    source: r
  });
  try {
    return Qu(n, o, s);
  } finally {
    c ? xt.set(n, a) : xt.delete(n);
  }
}, Qu = (t, e, s) => {
  const n = nt.has(t);
  e ? nt.add(t) : nt.delete(t);
  try {
    return s();
  } finally {
    n ? nt.add(t) : nt.delete(t);
  }
}, ra = (t) => {
  na(t);
  const e = t, s = Ju(e, t), n = Ae();
  return (n.wipContextDeps ??= /* @__PURE__ */ new Map()).set(e, s.source), s.value;
}, Ju = (t, e) => xt.get(t) ?? {
  value: Yu(e)[Er],
  source: null
}, Xu = (t, e, s, n) => {
  if (!n) return s;
  let r = s;
  for (const [i, o] of n)
    o === e || o === t || (r ??= /* @__PURE__ */ new Map()).set(i, o);
  return r;
}, ia = (t, e = t.wipContextDeps) => {
  const s = Be();
  !s || !e || (s.wipContextDeps = Xu(s, t, s.wipContextDeps, e));
}, oa = () => nt.size > 0, Ar = (t) => {
  if (!t.contextDeps || !oa()) return !1;
  for (const e of nt.keys()) if (t.contextDeps.has(e)) return !0;
  return !1;
}, Ku = (t, e, s) => {
  if (t.isNeverMounted) throw new Error("Resource updated before mount");
  let n = !1, r = !0;
  t.root.unsettledCount++, t.root.dispatchUpdate(() => (n || (n = !0, s && t.root.changelog.length === 0 && !e.cell.isDirty && !e.hasEagerState && (e.prevState = e.cell.workInProgress, e.eagerState = s(e.cell.workInProgress, e.action), e.hasEagerState = !0, r = !Object.is(e.cell.current, e.eagerState), !r && !e.settled && (e.settled = !0, t.root.unsettledCount--))), r), () => (n = !0, r = !0, Jo(e), e.logged || (e.logged = !0, t.root.changelog.push(e)), !0));
}, Zu = (t, e, s, n, r) => {
  const i = n ? n(s) : s, o = {
    type: "reducer",
    workInProgress: i,
    current: i,
    isDirty: !1,
    queue: null,
    renderQueue: null,
    reducer: e,
    dispatch: (a) => {
      const c = Be();
      if (c !== null) {
        if (c !== t) throw new Error("Cannot update a resource while rendering a different resource.");
        (t.renderPendingCells ??= /* @__PURE__ */ new Set()).add(o), (o.renderQueue ??= []).push(a);
      } else {
        const l = {
          fiber: t,
          cell: o,
          action: a,
          hasEagerState: !1,
          eagerState: void 0,
          prevState: o.current,
          settled: !1,
          queued: !1,
          logged: !1
        };
        Ku(t, l, r ? e : void 0);
      }
    }
  };
  return o;
};
function aa(t, e, s, n) {
  const r = Ae(), i = r.currentIndex++, o = r.cells[i], a = (() => {
    if (o !== void 0) return o.type === "reducer" ? o : ns();
    r.isFirstRender || ss();
    const l = Zu(r, t, e, s, n);
    return r.cells[i] = l, l;
  })(), c = a.queue;
  if (c !== null) {
    const l = t === a.reducer;
    for (let u = 0; u < c.length; u++) {
      const f = c[u];
      (!f.hasEagerState || !l || !Object.is(f.prevState, a.workInProgress)) && (f.prevState = a.workInProgress, f.eagerState = t(a.workInProgress, f.action), f.hasEagerState = !0), f.queued = !1, a.workInProgress = f.eagerState;
    }
    a.queue = null;
  }
  if (a.reducer = t, a.renderQueue !== null) {
    let l = a.workInProgress;
    for (const u of a.renderQueue) l = t(l, u);
    a.renderQueue = null, r.renderPendingCells?.delete(a), Object.is(l, a.workInProgress) || (Cr(r, a), a.workInProgress = l);
  }
  return a.isDirty && ts(r, () => {
    a.current = a.workInProgress, a.isDirty = !1;
  }), [a.workInProgress, a.dispatch];
}
function Rr(t, e, s) {
  return aa(t, e, s, !1);
}
const ed = (t, e) => typeof e == "function" ? e(t) : e, td = (t) => t === void 0 ? void 0 : typeof t == "function" ? t() : t;
function ca(t) {
  return aa(ed, t, td, !0);
}
const rs = (t, e) => {
  for (let s = 0; s < t.length && s < e.length; s++) if (!Object.is(t[s], e[s])) return !1;
  return !0;
}, fi = (t, e) => {
  ts(t, () => {
    e.current = e.wip, e.currentDeps = e.wipDeps, e.wipIsRefreshing = !1, e.isDirty = !1;
  });
}, Mr = (t, e) => {
  const s = Ae(), n = s.currentIndex++;
  let r = s.cells[n];
  if (r === void 0) {
    s.isFirstRender || ss();
    const a = t();
    return r = {
      type: "memo",
      current: a,
      currentDeps: e,
      wip: a,
      wipDeps: e,
      wipIsRefreshing: !1,
      isDirty: !1
    }, s.cells[n] = r, a;
  }
  r.type !== "memo" && ns();
  const i = r;
  if (i.wipIsRefreshing && !s.isRefreshing && (i.wip = i.current, i.wipDeps = i.currentDeps, i.wipIsRefreshing = !1, i.isDirty = !1), !s.isRefreshing && rs(i.wipDeps, e))
    return i.isDirty && fi(s, i), i.wip;
  const o = t();
  return i.wip = o, i.wipDeps = e, i.wipIsRefreshing = s.isRefreshing, i.isDirty || (i.isDirty = !0, zs(s.root, () => {
    i.wip = i.current, i.wipDeps = i.currentDeps, i.wipIsRefreshing = !1, i.isDirty = !1;
  })), fi(s, i), o;
}, la = (t, e) => Mr(() => t, e);
function ua(t, e) {
  Zo(t, e, "insertion");
}
function kr(t) {
  const e = Ae(), s = ot(t);
  return s.current !== t && ts(e, () => {
    s.current = t;
  }), ot(((...n) => s.current(...n))).current;
}
const sd = (t) => t !== null && typeof t == "object" && typeof t.then == "function", mi = () => {
}, nd = (t) => {
  const e = t;
  switch (typeof e.status != "string" ? (e.status = "pending", t.then((s) => {
    e.status === "pending" && (e.status = "fulfilled", e.value = s);
  }, (s) => {
    e.status === "pending" && (e.status = "rejected", e.reason = s);
  })) : e.status !== "fulfilled" && e.status !== "rejected" && t.then(mi, mi), e.status) {
    case "fulfilled":
      return e.value;
    case "rejected":
      throw e.reason;
    default:
      throw t;
  }
}, Dr = (t) => sd(t) ? nd(t) : ra(t), da = (t, e, s = e) => {
  const r = Ae().isNeverMounted ? s() : e(), [, i] = Rr((c) => c + 1, 0), o = ot(0), a = kr(() => {
    try {
      if (Object.is(r, e()))
        return o.current = 0, !1;
    } catch {
    }
    return !0;
  });
  return Le(() => t(() => {
    a() && i();
  }), [t]), Le(() => {
    if (a()) {
      if (++o.current > 50)
        throw o.current = 0, new Error("Maximum update depth exceeded. The result of getSnapshot should be cached to avoid an infinite loop.");
      i();
    }
  }, [
    t,
    r,
    e
  ]), r;
}, ha = (t, e) => {
};
let rd = 0;
const id = () => {
  const t = ot(null);
  return t.current ??= `:tap${rd++}:`, t.current;
}, fa = (t, e, s) => {
  const n = () => {
    if (!t) return;
    const r = e();
    if (typeof t == "function") {
      const i = t(r);
      return typeof i == "function" ? i : () => t(null);
    }
    return t.current = r, () => {
      t.current = null;
    };
  };
  s == null ? Le(n) : Le(n, [...s, t]);
}, od = es;
function ad(t) {
  const e = ne(t);
  return Ml(() => {
    e.current = t;
  }), B(((...s) => e.current(...s)), []);
}
const cd = od.useEffectEvent ?? ad, xe = () => Be() !== null, ae = es, ue = (t) => xe() ? ca(t) : ae.useState(t), ld = (t, e, s) => xe() ? Rr(t, e, s) : ae.useReducer(t, e, s), oe = (t) => xe() ? ot(t) : ae.useRef(t), fe = (t, e) => xe() ? Mr(t, e) : ae.useMemo(t, e), jt = (t, e) => xe() ? la(t, e) : ae.useCallback(t, e), K = (t, e) => xe() ? Le(t, e) : ae.useEffect(t, e), kt = (t, e) => xe() ? Le(t, e) : ae.useLayoutEffect(t, e), ma = (t) => xe() ? kr(t) : cd(t), Ws = (t, e, s) => xe() ? da(t, e, s) : ae.useSyncExternalStore(t, e, s), ud = (t, e) => xe() ? ha() : ae.useDebugValue(t, e), Ys = (t, e) => xe() ? ua(t, e) : ae.useInsertionEffect(t, e), dd = (t, e, s) => xe() ? fa(t, e, s) : ae.useImperativeHandle(t, e, s), ge = (t) => ae.forwardRef(t), ve = (t, e) => ae.memo(t, e), hd = ae.Fragment, fd = (...t) => ae.createElement(...t), md = (...t) => ae.cloneElement(...t), pd = (t) => ae.isValidElement(t);
ae.Children;
ae.Suspense;
const Ye = (t) => {
  const e = ae.createContext(t);
  return ea(e, t), e;
}, is = (t) => {
  if (xe() && Dn(t)) return Dr(t);
  if (ae.use) return ae.use(t);
  if (Dn(t)) return ae.useContext(t);
  throw new Error("React.use() requires React 19 outside a tap resource.");
}, Qs = (t) => xe() && Dn(t) ? Dr(t) : ae.useContext(t), os = (t, e) => {
  if (t.length !== 0) {
    if (t.length === 1) throw t[0];
    for (const s of t) console.error(s);
    throw new AggregateError(t, e);
  }
};
function gd(t) {
  if (t.length === 0) return;
  let e;
  for (let s = 0; s < t.length; s++) try {
    t[s]();
  } catch (n) {
    (e ??= []).push(n);
  }
  e !== void 0 && os(e, "Errors during commit");
}
function bd(t) {
  const e = t.setup, s = t.setupDeps, n = t.generation;
  let r;
  try {
    const i = e();
    if (i !== void 0 && typeof i != "function") throw new Error(`An effect function must either return a cleanup function or nothing. Received: ${typeof i}`);
    r = i;
  } finally {
    t.generation === n ? (t.cleanup = r, t.deps = s) : r?.();
  }
}
const _d = (t) => t.setup === void 0 ? !1 : t.deps === null || t.setupDeps === void 0 ? !0 : !rs(t.deps, t.setupDeps);
function pi(t, e) {
  let s;
  for (const n of t) _d(n) && (s ??= []).push(n);
  if (s === void 0) return e;
  for (const n of s)
    if (n.deps = null, n.cleanup !== void 0)
      try {
        n.cleanup();
      } catch (r) {
        (e ??= []).push(r);
      } finally {
        n.cleanup = void 0;
      }
  for (const n of s) try {
    bd(n);
  } catch (r) {
    (e ??= []).push(r);
  }
  return e;
}
function vd(t, e = !0) {
  let s;
  t.insertionCells !== null && e && (s = pi(t.insertionCells, s)), s = pi(t.effectCells, s), s !== void 0 && os(s, "Errors during commit");
}
function gi(t) {
  let e;
  for (const s of t)
    if (s.deps = null, s.cleanup) try {
      s.cleanup?.();
    } catch (n) {
      (e ??= []).push(n);
    } finally {
      s.cleanup = void 0;
    }
  e !== void 0 && os(e, "Errors during cleanup");
}
const yd = {
  useState: ca,
  useReducer: Rr,
  useRef: ot,
  useMemo: Mr,
  useCallback: la,
  useEffect: Le,
  useLayoutEffect: Le,
  useInsertionEffect: ua,
  useEffectEvent: kr,
  useContext: ra,
  use: Dr,
  useSyncExternalStore: da,
  useDebugValue: ha,
  useId: id,
  useImperativeHandle: fa,
  useMemoCache: Ko
}, bi = es, Ze = bi.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ?? bi.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, us = Ze == null ? null : "H" in Ze ? {
  get current() {
    return Ze.H;
  },
  set current(t) {
    Ze.H = t;
  }
} : "ReactCurrentDispatcher" in Ze ? {
  get current() {
    return Ze.ReactCurrentDispatcher.current;
  },
  set current(t) {
    Ze.ReactCurrentDispatcher.current = t;
  }
} : null;
function wd(t) {
  if (!us) return t();
  const e = us.current;
  us.current = yd;
  try {
    return t();
  } finally {
    us.current = e;
  }
}
function Sd(t, e, s = void 0, n) {
  return {
    hook: t,
    root: e,
    markDirty: s,
    devStrictMode: n,
    cells: [],
    effectCells: [],
    insertionCells: null,
    hostCells: null,
    contextDeps: null,
    wipContextDeps: null,
    wipCommitCallbacks: null,
    memoCache: {
      current: null,
      workInProgress: null,
      refreshedIndices: null,
      index: 0
    },
    renderPendingCells: null,
    currentIndex: 0,
    isRefreshing: !1,
    isFirstRender: !0,
    isMounted: !1,
    isReleased: !1,
    isNeverMounted: !0
  };
}
function pa(t) {
  t.wipCommitCallbacks = null, t.wipContextDeps = null, t.memoCache.workInProgress = null, t.memoCache.refreshedIndices = null;
}
function Dt(t, e, s) {
  try {
    e ? (t.isReleased = !0, t.insertionCells !== null && gi(t.insertionCells)) : t.isMounted && (t.isMounted = !1, gi(t.effectCells));
  } catch (n) {
    (s ??= []).push(n);
  }
  if (t.hostCells !== null) {
    for (const n of t.hostCells)
      if (n.fiber !== null && (s = Dt(n.fiber, e, s)), n.fibers !== null) for (const { fiber: r } of n.fibers.values()) s = Dt(r, e, s);
  }
  return s;
}
function ga(t, e = !0) {
  let s;
  e && (s = Dt(t, !0, s)), s = Dt(t, !1, s), s !== void 0 && os(s, "Errors during cleanup");
}
function ba(t) {
  let e;
  for (const s of t) s.isReleased && (e = Dt(s, !0, e));
  for (const s of t) e = Dt(s, !1, e);
  e !== void 0 && os(e, "Errors during cleanup");
}
function Ht(t, e) {
  if (t.renderPendingCells !== null) {
    for (const i of t.renderPendingCells) i.renderQueue = null;
    t.renderPendingCells.clear();
  }
  let s = 0, n;
  const r = t.isRefreshing;
  t.isRefreshing = r || (Be()?.isRefreshing ?? !1);
  try {
    do {
      if (++s > 25) throw new Error("Too many re-renders. tap limits the number of renders to prevent an infinite loop.");
      t.memoCache.index = 0, Vu(t, () => {
        n = wd(() => t.hook(...e));
      });
    } while ((t.renderPendingCells?.size ?? 0) > 0);
  } catch (i) {
    throw pa(t), i;
  } finally {
    t.isRefreshing = r;
  }
  return ia(t), n;
}
function ks(t) {
  const e = t.wipCommitCallbacks;
  t.wipCommitCallbacks = null, t.isMounted = !0, t.isNeverMounted = !1, e !== null && (t.contextDeps = t.wipContextDeps, Qo(t.root), t.memoCache.workInProgress !== null && (t.memoCache.current = t.memoCache.workInProgress, t.memoCache.workInProgress = null, t.memoCache.refreshedIndices = null), gd(e)), vd(t, e !== null);
}
const xd = () => {
  const t = Ae();
  return t.devStrictMode ? t.isFirstRender ? "child" : "root" : null;
}, Id = () => null, Td = () => Id, Cd = () => Be() ? xd : Td(), Ed = (t) => {
  const e = Ae(), s = e.currentIndex++, n = e.cells[s];
  let r;
  if (n === void 0) {
    e.isFirstRender || ss();
    const i = t instanceof Map;
    r = {
      type: "host",
      fiber: i ? null : t,
      fibers: i ? t : null
    }, e.cells[s] = r, (e.hostCells ??= []).push(r);
  } else
    n.type !== "host" && ns(), r = n;
  return r.fibers === null && r.fiber !== t && ts(e, () => {
    r.fiber = t;
  }), r;
}, _i = (t, e) => {
  if (!(t instanceof Map)) return e(t);
  for (const { fiber: s } of t.values()) e(s);
}, Ad = (t) => {
  t.isReleased = !1;
}, Rd = (t) => {
  t.isReleased = !0, t.isMounted || queueMicrotask(() => {
    t.isReleased && ga(t, !0);
  });
}, Md = (t) => {
  Ys(() => (_i(t, Ad), () => _i(t, Rd)), [t]), K(() => () => {
    ba(t instanceof Map ? Array.from(t.values(), ({ fiber: e }) => e) : [t]);
  }, [t]);
}, Pr = (t) => Be() ? Ed(t) : (Md(t), null), kd = () => {
  const t = oe(0), e = t.current, s = Ae();
  return {
    version: e,
    markDirty: fe(() => () => {
      t.current++, s.markDirty?.();
    }, [s]),
    root: s.root
  };
}, Dd = () => {
  const [t] = ue(() => ju((r, i) => {
    let o = !1;
    n((a) => (o = !r(), o ? a : a + 1)), o || s(() => r() && i());
  })), [e, s] = ld((r, i) => (hi(t, r), r + (i() ? 1 : 0)), 0), [, n] = ue(0);
  return hi(t, e), {
    root: t,
    version: e,
    markDirty: void 0
  };
}, Or = () => {
  const t = Cd(), e = Be() === null, s = e ? t() : null, { root: n, version: r, markDirty: i } = e ? Dd() : kd();
  return {
    version: r,
    createFiber: jt((o, a, c) => Sd(o, n, c ? () => {
      c(), i?.();
    } : i, e ? s : t()), [])
  };
};
function ce(t) {
  return (...e) => ({
    hook: t,
    args: e
  });
}
function De(t, e, s) {
  return typeof e == "function" ? (...n) => De(t, e(...n)) : s ? {
    ...e,
    key: t,
    deps: s
  } : {
    ...e,
    key: t
  };
}
const Pd = (t, e) => ({
  fiber: t,
  key: e,
  currentDeps: null,
  current: null,
  wipDeps: null,
  wip: null
});
function Qe(t) {
  const { version: e, createFiber: s } = Or(), n = oe(null), r = n.current ??= Pd(s(t.hook, t.key), t.key), i = fe(() => r.fiber.hook === t.hook && r.key === t.key && !r.fiber.isReleased ? r.fiber : s(t.hook, t.key), [
    r,
    t.hook,
    t.key,
    s
  ]);
  r.wipDeps = r.currentDeps, r.wip = r.current;
  const o = [
    i,
    e,
    t.args
  ];
  (Be()?.isRefreshing || Ar(i) || r.currentDeps === null || !rs(r.currentDeps, o)) && (r.wipDeps = o, r.wip = { value: Ht(i, t.args) });
  const a = r.wip, c = Pr(i);
  return K(() => {
    if (r.currentDeps = r.wipDeps, r.current = r.wip, r.fiber = i, r.key = t.key, ks(i), c !== null) return () => {
      c.fiber !== i && ga(i, !0);
    };
  }, [
    r,
    c,
    i,
    t.key,
    a
  ]), a.value;
}
const Od = (t, e, s) => {
  const n = oe(null), r = n.current ?? (n.current = {
    currentDeps: null,
    current: null
  }), i = !s && r.currentDeps && rs(r.currentDeps, e) ? r.current : t();
  return K(() => {
    r.currentDeps = e, r.current = i;
  }), i;
}, vi = (t, e) => {
  const s = t.get(e);
  s && (s.isDirty = !0);
}, Nd = (t, e) => !t.isDirty && !Ar(t.fiber) && (t.committedElement === e || e.deps !== void 0 && t.committedDeps !== void 0 && rs(t.committedDeps, e.deps)), $d = (t) => {
  if (!oa()) return !1;
  for (const { fiber: e } of t.values()) if (Ar(e)) return !0;
  return !1;
};
function Nr(t) {
  const [e] = ue(() => /* @__PURE__ */ new Map()), { version: s, createFiber: n } = Or(), r = Be()?.isRefreshing ?? !1, i = $d(e);
  let o = !1;
  const a = Od(() => {
    const c = /* @__PURE__ */ new Set(), l = [];
    let u = 0;
    for (let f = 0; f < t.length; f++) {
      const h = t[f], d = h.key;
      if (d === void 0) throw new Error(`useResources did not provide a key for array at index ${f}`);
      if (c.has(d)) throw new Error(`Duplicate key ${d} in useResources`);
      c.add(d);
      let p = e.get(d);
      if (p)
        if (p.fiber.hook !== h.hook) {
          const _ = n(h.hook, h.key, () => vi(e, d)), v = Ht(_, h.args);
          p.next = {
            value: v,
            deps: h.deps,
            element: h,
            remount: _
          }, o = !0;
        } else if (!r && Nd(p, h))
          typeof p.next == "object" && pa(p.fiber), p.fiber.contextDeps && ia(p.fiber, p.fiber.contextDeps), p.next = "skip";
        else {
          const _ = Ht(p.fiber, h.args);
          p.next = {
            value: _,
            deps: h.deps,
            element: h
          };
        }
      else {
        const _ = n(h.hook, h.key, () => vi(e, d));
        p = {
          fiber: _,
          next: {
            value: Ht(_, h.args),
            deps: h.deps,
            element: h
          },
          isDirty: !1,
          committedDeps: void 0,
          committedElement: void 0,
          committedValue: void 0
        }, u++, e.set(d, p);
      }
      l.push(typeof p.next == "object" ? p.next.value : p.committedValue);
    }
    if (e.size > l.length - u)
      for (const f of e.keys()) c.has(f) || (e.get(f).next = "delete", o = !0);
    return l;
  }, [
    t,
    e,
    n,
    s
  ], r || i);
  return Pr(e), K(() => {
    if (o) {
      const c = [];
      for (const [l, u] of e.entries()) {
        const f = u.next;
        f === "delete" ? (c.push(u.fiber), e.delete(l)) : f !== "skip" && f.remount && (c.push(u.fiber), u.fiber = f.remount);
      }
      for (const l of c) l.isReleased = !0;
      ba(c);
    }
    for (const c of e.values()) {
      const l = c.next;
      l === "skip" ? !c.fiber.isNeverMounted && !c.fiber.isMounted && ks(c.fiber) : l !== "delete" && (ks(c.fiber), c.committedDeps = l.deps, c.committedElement = l.element, c.committedValue = l.value, c.isDirty = !1, c.next = "skip");
    }
  }, [
    a,
    e,
    o
  ]), r ? a.slice() : a;
}
const Bd = (t) => t(), Fd = (t) => {
  const { createFiber: e } = Or(), [s] = ue(() => e(Bd, void 0)), n = Ht(s, [t]);
  Pr(s);
  let r = !1;
  const i = () => {
    r && s.isMounted || (r = !0, ks(s));
  };
  return K(i), {
    value: n,
    effects: i
  };
}, Ld = () => {
  const t = x(4), [e, s] = ue(jd);
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
        [c]: u.renderers[c]?.filter((f) => f !== l) ?? []
      }
    }));
  }), t[0] = n) : n = t[0];
  const r = n;
  let i;
  t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (i = (c) => (s((l) => ({
    ...l,
    fallbacks: [...l.fallbacks, c]
  })), () => {
    s((l) => ({
      ...l,
      fallbacks: l.fallbacks.filter((u) => u !== c)
    }));
  }), t[1] = i) : i = t[1];
  const o = i;
  let a;
  return t[2] !== e ? (a = {
    getState: () => e,
    setDataUI: r,
    setFallbackDataUI: o
  }, t[2] = e, t[3] = a) : a = t[3], a;
}, Vd = ce(Ld);
function jd() {
  return {
    renderers: {},
    fallbacks: []
  };
}
const dn = (t) => {
  if (!t.overwrite) return t;
  const { overwrite: e, ...s } = t;
  return s;
}, qd = (t) => {
  const e = Array.from(t).map((n) => n.getModelContext()).sort((n, r) => (r.priority ?? 0) - (n.priority ?? 0)), s = {};
  return e.reduce((n, r) => {
    const i = r.priority ?? 0;
    if (r.system && (n.system ? n.system += `

${r.system}` : n.system = r.system), r.tools) for (const [o, a] of Object.entries(r.tools)) {
      const c = n.tools?.[o];
      if (c && c !== a) {
        const l = s[o];
        if (l === i) {
          if (!a.overwrite) throw new Error(`You tried to define a tool with the name ${o}, but it already exists.`);
          n.tools[o] = dn(a);
          continue;
        }
        const u = l > i ? c : a, f = l > i ? a : c;
        n.tools[o] = dn({
          ...f,
          ...u
        }), s[o] = Math.max(l, i);
        continue;
      }
      n.tools || (n.tools = {}), n.tools[o] = dn(a), s[o] ??= i;
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
}, Tt = (t, e, s) => {
  const n = (r) => {
    console.error(`[assistant-ui] ${s} listener threw an error`, r);
  };
  for (const r of t) try {
    const i = r(typeof e == "function" ? e() : e);
    i !== null && (typeof i == "object" || typeof i == "function") && "then" in i && typeof i.then == "function" && Promise.resolve(i).catch(n);
  } catch (i) {
    n(i);
  }
}, Pe = /* @__PURE__ */ Symbol("skip-update"), Js = (t, ...e) => {
  const s = [];
  for (const n of t) try {
    n(...e);
  } catch (r) {
    s.push(r);
  }
  if (s.length === 1) throw s[0];
  if (s.length > 1) {
    for (const n of s) console.error(n);
    throw new AggregateError(s);
  }
};
function _a(t, e) {
  if (t === void 0 && e === void 0) return !0;
  if (t === void 0 || e === void 0) return !1;
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length) return !1;
  for (const n of s) {
    const r = t[n], i = e[n];
    if (!Object.is(r, i)) return !1;
  }
  return !0;
}
var Ud = class {
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
    Js(this._subscribers);
  }
}, Xs = class {
  _subscriptions = /* @__PURE__ */ new Set();
  _connection;
  get isConnected() {
    return !!this._connection;
  }
  notifySubscribers(t, e) {
    if (e) {
      Tt(this._subscriptions, t, e);
      return;
    }
    Js(this._subscriptions, t);
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
}, Me = class extends Xs {
  get path() {
    return this.binding.path;
  }
  binding;
  constructor(t) {
    super(), this.binding = t;
    const e = t.getState();
    if (e === Pe) throw new Error("Entry not available in the store");
    this._previousState = e;
  }
  _previousState;
  getState = () => (this.isConnected || this._syncState(), this._previousState);
  _syncState() {
    const t = this.binding.getState();
    return t === Pe || _a(t, this._previousState) ? !1 : (this._previousState = t, !0);
  }
  _connect() {
    const t = () => {
      this._syncState() && this.notifySubscribers();
    }, e = this.binding.subscribe(t);
    return this._syncState(), e;
  }
}, $r = class extends Xs {
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
      t !== Pe && (this._previousState === void 0 || !_a(t, this._previousState)) && (this._previousState = t), this._previousStateDirty = !1;
    }
    if (this._previousState === void 0) throw new Error("Entry not available in the store");
    return this._previousState;
  };
  _connect() {
    const t = () => {
      this._previousStateDirty = !0, this.notifySubscribers();
    }, e = this.binding.subscribe(t);
    return this._previousStateDirty = !0, e;
  }
}, Ds = class extends Xs {
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
      const i = this.binding.getState();
      i !== e && (e = i, s?.(), s = i?.subscribe(t), t());
    }, r = this.outerSubscribe(n);
    return () => {
      r?.(), s?.();
    };
  }
}, va = class extends Xs {
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
    let s = this.config.binding.getState(), n = s?.unstable_on(this.config.event, e);
    const r = () => {
      const o = this.config.binding.getState();
      o !== s && (s = o, n?.(), n = o?.unstable_on(this.config.event, e));
    }, i = this.outerSubscribe(r);
    return () => {
      i?.(), n?.();
    };
  }
}, ya = class {
  _providers = /* @__PURE__ */ new Map();
  _providerUnsubscribes = /* @__PURE__ */ new Map();
  getModelContext() {
    return qd(new Set(this._providers.values()));
  }
  registerModelContextProvider(t) {
    const e = /* @__PURE__ */ Symbol();
    this._providers.set(e, t);
    let s;
    try {
      s = t.subscribe?.(() => {
        this.notifySubscribers();
      });
    } catch (n) {
      this._providers.delete(e);
      try {
        this.notifySubscribers();
      } catch (r) {
        console.error(r);
      }
      throw n;
    }
    return this._providerUnsubscribes.set(e, s), this.notifySubscribers(), () => {
      this._providers.delete(e), this._providerUnsubscribes.get(e)?.(), this._providerUnsubscribes.delete(e), this.notifySubscribers();
    };
  }
  _subscribers = /* @__PURE__ */ new Set();
  notifySubscribers() {
    Js(this._subscribers);
  }
  subscribe(t) {
    return this._subscribers.add(t), () => {
      this._subscribers.delete(t);
    };
  }
};
const Pn = [], Hd = {
  modelName: void 0,
  toolNames: Pn
}, zd = (t, e) => t === e || t.length === e.length && t.every((s, n) => s === e[n]), ds = (t, e) => {
  const s = t.getModelContext(), n = s.config?.modelName, r = s.tools ? Object.keys(s.tools).sort() : Pn, i = r.length ? r : Pn;
  return n === e.modelName && zd(i, e.toolNames) ? e : {
    modelName: n,
    toolNames: i
  };
}, Gd = () => {
  const t = x(11);
  let e;
  t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (e = new ya(), t[0] = e) : e = t[0];
  const s = e;
  let n;
  t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (n = () => ds(s, Hd), t[1] = n) : n = t[1];
  const [r, i] = ue(n);
  let o, a;
  t[2] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (o = () => (i((d) => ds(s, d)), s.subscribe(() => {
    i((d) => ds(s, d));
  })), a = [s], t[2] = o, t[3] = a) : (o = t[2], a = t[3]), K(o, a);
  let c;
  t[4] !== r ? (c = () => ds(s, r), t[4] = r, t[5] = c) : c = t[5];
  let l, u, f;
  t[6] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (l = () => s.getModelContext(), u = (d) => s.subscribe(d), f = (d) => s.registerModelContextProvider(d), t[6] = l, t[7] = u, t[8] = f) : (l = t[6], u = t[7], f = t[8]);
  let h;
  return t[9] !== c ? (h = {
    getState: c,
    getModelContext: l,
    subscribe: u,
    register: f
  }, t[9] = c, t[10] = h) : h = t[10], h;
}, wa = ce(Gd), Wd = (t) => t.display !== void 0 ? t.display === "standalone" : t.type === "human", Yd = (t, e) => {
  if (!(e.status?.type === "running" || e.status?.type === "requires-action")) {
    const n = t.complete;
    return typeof n != "function" ? n ?? null : n({
      args: e.args,
      result: e.result
    });
  }
  const s = t.running;
  return typeof s != "function" ? s ?? null : s({ args: e.args });
}, Qd = (t) => function(s) {
  return Yd(t, s);
}, Ve = (t) => t, Jd = /* @__PURE__ */ new Set([
  "$$typeof",
  "nodeType",
  "then",
  "__v_raw",
  "__v_isRef",
  "__v_isReactive",
  "__v_isReadonly",
  "__v_isShallow",
  "__v_skip"
]), at = (t, e) => {
  if (t === Symbol.toStringTag) return e;
  if (typeof t != "symbol") {
    if (t === "toJSON") return () => e;
    if (!Jd.has(t))
      return !1;
  }
};
var Yt = class {
  getOwnPropertyDescriptor(t, e) {
    const s = this.get(t, e);
    if (s !== void 0)
      return {
        value: s,
        writable: !1,
        enumerable: !0,
        configurable: !0
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
const ct = /* @__PURE__ */ Symbol("assistant-ui.store.clientId"), On = /* @__PURE__ */ Symbol("assistant-ui.store.instanceTag"), Br = /* @__PURE__ */ new WeakSet(), Sa = /* @__PURE__ */ new Set([
  "call",
  "apply",
  "bind"
]), xa = (t, e) => {
  const s = new Proxy((() => {
  }), {
    apply: () => (e(), s),
    get: (n, r) => Sa.has(r) ? Reflect.get(n, r) : r === "source" ? t.source : r === "query" ? t.query : r === "name" ? t.name : r === ct ? Fr(e()) : e()[r],
    has: (n, r) => r === "source" || r === "query" || r === "name" || r === ct || r in e(),
    ownKeys: () => Reflect.ownKeys(e()),
    getOwnPropertyDescriptor: (n, r) => {
      if (!(typeof r == "symbol" || !(r in e())))
        return {
          value: e()[r],
          writable: !1,
          enumerable: !0,
          configurable: !0
        };
    }
  });
  return Br.add(s), s;
}, Ia = (t, e) => {
  const s = () => {
    throw new Error(t);
  }, n = new Proxy((() => {
  }), {
    apply: s,
    get: (r, i) => {
      if (Sa.has(i)) return Reflect.get(r, i);
      if (i === "source" || i === "query") return null;
      if (i === "name") return e;
      if (i === ct) return s();
      const o = at(i, "AssistantClientAccessor");
      return o !== !1 ? o : s();
    },
    has: (r, i) => i === "source" || i === "query" || i === "name",
    ownKeys: () => [],
    getOwnPropertyDescriptor: () => {
    }
  });
  return Br.add(n), n;
}, Xd = (t) => {
  if (Br.has(t)) return !1;
  const e = t[ct];
  return e !== void 0 && e !== t;
}, Ks = (t) => t?.source != null, Nn = (t) => t?.source === null, Fr = (t) => t[ct] ?? t, Kd = (t) => t[On] ?? Fr(t), it = (t) => t === "optional" || t === "subscribe" || t === "on" || t === "__proto__" || typeof t == "symbol", $n = (t) => {
  const e = [];
  for (const s in t) it(s) || e.push(s);
  return e;
};
var Zd = class extends Yt {
  #e;
  constructor(t) {
    super(), this.#e = t;
  }
  get(t, e) {
    const s = at(e, "OptionalAssistantClient");
    if (s !== !1) return s;
    if (it(e)) return;
    const n = this.#e[e];
    return Ks(n) ? n : void 0;
  }
  ownKeys() {
    return $n(this.#e);
  }
  has(t, e) {
    return !it(e) && e in this.#e;
  }
};
const Ta = (t) => new Proxy({}, new Zd(t)), yi = () => () => {
}, eh = "You are using a component or hook that requires an AuiProvider. Wrap your component in an <AuiProvider> component.";
var th = class extends Yt {
  #e;
  #t;
  #s;
  #n;
  constructor(t, e, s) {
    super(), this.#e = t, this.#t = e, this.#s = s;
  }
  get(t, e) {
    if (e === "subscribe" || e === "on") return yi;
    if (e === "optional") return this.#n ??= Ta(this.#s());
    const s = at(e, this.#e);
    return s !== !1 ? s : Ia(this.#t(String(e)), String(e));
  }
  ownKeys() {
    return [
      "subscribe",
      "on",
      "optional"
    ];
  }
  getOwnPropertyDescriptor(t, e) {
    if (e !== "optional") return super.getOwnPropertyDescriptor(t, e);
    const s = this.get(t, e);
    if (s !== void 0)
      return {
        value: s,
        writable: !1,
        enumerable: !1,
        configurable: !0
      };
  }
  has(t, e) {
    return e === "subscribe" || e === "on" || e === "optional";
  }
};
const sh = (t, e) => {
  const s = new Proxy({}, new th(t, e, () => s));
  return s;
}, Ct = sh("DefaultAssistantClient", () => eh), nh = () => new Proxy({}, { get(t, e) {
  const s = at(e, "AssistantClient");
  return s !== !1 ? s : Ia(`The current scope does not have a "${String(e)}" property.`, String(e));
} }), Lr = Ye(Ct), rh = () => {
}, ih = /* @__PURE__ */ new WeakMap(), oh = (t) => ih.get(t) ?? rh, Vr = () => Qs(Lr), ah = (t, e) => Gs(Lr, t, e), Bn = /* @__PURE__ */ Symbol("assistant-ui.transform-scopes");
function Ca(t, e) {
  const s = t;
  if (s[Bn]) throw new Error("transformScopes is already attached to this resource");
  s[Bn] = e;
}
function ch(t) {
  return t[Bn];
}
const jr = (t) => typeof t == "string" ? {
  scope: t.split(".")[0],
  event: t
} : {
  scope: t.scope,
  event: t.event
}, Fn = /* @__PURE__ */ Symbol("assistant-ui.store.clientIndex"), lh = (t) => t[Fn], Ea = Ye([]), qr = () => is(Ea), uh = (t, e) => {
  const s = x(3), n = qr();
  let r;
  return s[0] !== t || s[1] !== n ? (r = [...n, t], s[0] = t, s[1] = n, s[2] = r) : r = s[2], Gs(Ea, r, e);
}, Zs = Ye(null), wi = /* @__PURE__ */ Symbol("aui.scope-effect-unapplied"), dh = (t, e) => Gs(Zs, t, e), Ur = () => {
  const t = is(Zs);
  if (!t) throw new Error("AssistantTapContext is not available");
  return t;
}, Aa = () => Ur().clientRef, hh = () => is(Zs) !== null, fh = () => {
  const t = x(5), e = is(Zs)?.markChanged;
  let s;
  t[0] !== e ? (s = e ? {
    readers: /* @__PURE__ */ new Set(),
    version: 0
  } : void 0, t[0] = e, t[1] = s) : s = t[1];
  const n = s;
  let r;
  return t[2] !== e || t[3] !== n ? (r = {
    signal: n,
    markChanged: e
  }, t[2] = e, t[3] = n, t[4] = r) : r = t[4], r;
}, mh = (t, e, s, n) => {
  const r = x(8);
  let i;
  r[0] !== t || r[1] !== s || r[2] !== e ? (i = () => {
    if (t === void 0) return;
    const a = t.current;
    if (a === null) throw new Error("useAssistantScopeEffect ran before the client was committed. This is likely an internal bug in assistant-ui.");
    const c = () => {
      const d = t.current?.[e];
      return d !== void 0 && Ks(d) ? Kd(d) : void 0;
    };
    let l = wi, u;
    const f = (d) => {
      if (u?.(), u = void 0, l = wi, d !== void 0) {
        const p = s();
        u = typeof p == "function" ? p : void 0;
      }
      l = d;
    };
    f(c());
    const h = a.subscribe(() => {
      const d = c();
      d !== l && f(d);
    });
    return () => {
      h(), u?.();
    };
  }, r[0] = t, r[1] = s, r[2] = e, r[3] = i) : i = r[3];
  let o;
  r[4] !== t || r[5] !== n || r[6] !== e ? (o = [
    t,
    e,
    ...n
  ], r[4] = t, r[5] = n, r[6] = e, r[7] = o) : o = r[7], K(i, o);
}, Ra = (t, e, s) => {
  const { clientRef: n } = Ur();
  mh(n, t, e, s);
}, en = () => {
  const t = x(3), { emit: e } = Ur(), s = qr();
  let n;
  return t[0] !== s || t[1] !== e ? (n = (r, i) => {
    e(r, i, s);
  }, t[0] = s, t[1] = e, t[2] = n) : n = t[2], ma(n);
}, Ma = [];
let Et = -1, Re = null;
const lt = (t) => {
  Re && (t ? Re.signals.includes(t) || (Re.signals.push(t), Re.versions.push(t.version)) : Re.untracked = !0);
}, ph = (t) => {
  Et++;
  const e = Ma[Et] ??= {
    signals: [],
    versions: [],
    untracked: !1
  };
  e.signals.length = 0, e.versions.length = 0, e.untracked = !1;
  const s = Re;
  Re = e;
  try {
    return {
      value: t(),
      signals: [...e.signals],
      untracked: e.untracked
    };
  } finally {
    Re = s, Et--, s && (s.untracked ||= e.untracked, e.signals.forEach(lt));
  }
}, ka = (t, e) => t.length === e.length && t.every((s) => e.includes(s)), gh = (t, e) => {
  Et++;
  const s = Ma[Et] ??= {
    signals: [],
    versions: [],
    untracked: !1
  };
  s.signals.length = 0, s.versions.length = 0, s.untracked = !1;
  const n = Re;
  Re = s;
  try {
    const r = t(), i = e.current;
    if (s.untracked || s.signals.length === 0) e.current = null;
    else if (i && ka(i.signals, s.signals)) for (let o = 0; o < i.signals.length; o++) i.versions[o] = i.signals[o].version;
    else e.current = {
      signals: [...s.signals],
      versions: [...s.versions]
    };
    return r;
  } finally {
    Re = n, Et--, n && (n.untracked ||= s.untracked, s.signals.forEach(lt));
  }
}, Da = (t, e) => {
  const s = oe(null), n = oe(null), r = hh(), i = fe(() => (a) => {
    let c, l, u = !1;
    const f = () => {
      const p = s.current, _ = p?.signals ?? null;
      if (c !== void 0 && (c === null || _ === null ? c === _ : ka(c, _))) return !1;
      let v = !1;
      if (c)
        for (const C of c) _?.includes(C) || C.readers.delete(h);
      return p === null ? l ??= t(h) : (l?.(), l = void 0, p.signals.forEach((C, b) => {
        c?.includes(C) || (v ||= C.version !== p.versions[b], C.readers.add(h));
      })), c = _ && [..._], v;
    };
    function h() {
      u || (a(), f());
    }
    f();
    const d = () => {
      f() && a();
    };
    return n.current = d, () => {
      if (u = !0, l?.(), c) for (const p of c) p.readers.delete(h);
      n.current === d && (n.current = null);
    };
  }, [t]), o = Ws(i, r ? e : () => gh(e, s), e);
  return K(() => {
    n.current?.();
  }), o;
}, Ps = /* @__PURE__ */ Symbol("assistant-ui.store.getValue"), Os = /* @__PURE__ */ Symbol("assistant-ui.store.signal"), bh = (t) => t[Os], Si = (t) => {
  const e = t[Ps];
  if (!e) throw new Error("Client scope contains a non-client resource. Ensure your Derived get() returns a client created with useClientResource(), not a plain resource.");
  return lt(bh(t)), e.getState?.();
}, xi = /* @__PURE__ */ new Map();
function _h(t) {
  let e = xi.get(t);
  return e || (e = function(...s) {
    if (!this || typeof this != "object") throw new Error(`Method "${String(t)}" called without proper context. This may indicate the function was called incorrectly.`);
    const n = this[Ps];
    if (!n) throw new Error(`Method "${String(t)}" called on invalid client proxy. Ensure you are calling this method on a valid client instance.`);
    const r = n[t];
    if (!r) throw new Error(`Method "${String(t)}" is not implemented.`);
    if (typeof r != "function") throw new Error(`"${String(t)}" is not a function.`);
    return lt(this[Os]), r(...s);
  }, xi.set(t, e)), e;
}
var vh = class extends Yt {
  boundFns;
  cachedReceiver;
  outputRef;
  tagRef;
  index;
  signal;
  self;
  constructor(t, e, s, n) {
    super(), this.outputRef = t, this.tagRef = e, this.index = s, this.signal = n;
  }
  get(t, e, s) {
    if (e === Ps) return this.outputRef.current;
    if (e === Os) return this.signal;
    if (e === Fn) return this.index;
    if (e === ct) return this.self;
    if (e === On) return this.tagRef.current;
    const n = at(e, "ClientProxy");
    if (n !== !1) return n;
    const r = this.outputRef.current[e];
    if (typeof r == "function") {
      if (s === void 0) return r;
      (!this.boundFns || this.cachedReceiver !== s) && (this.boundFns = /* @__PURE__ */ new Map(), this.cachedReceiver = s);
      let i = this.boundFns.get(e);
      return i || (i = _h(e).bind(s), this.boundFns.set(e, i)), i;
    }
    return r;
  }
  ownKeys() {
    return Object.keys(this.outputRef.current);
  }
  has(t, e) {
    return e === Ps || e === Os || e === Fn || e === ct || e === On ? !0 : e in this.outputRef.current;
  }
};
const Qt = (t) => {
  const e = oe(null), s = oe(null), n = fe(() => ({}), [t.hook, t.key]), r = qr().length, { signal: i, markChanged: o } = fh(), a = fe(() => {
    const l = new vh(e, s, r, i), u = new Proxy({}, l);
    return l.self = u, u;
  }, [r, i]), c = uh(a, function() {
    return Qe(t);
  });
  return e.current || (e.current = c, s.current = n), K(() => {
    const l = e.current !== c || s.current !== n;
    e.current = c, s.current = n, l && i && o(i);
  }), {
    methods: a,
    state: c.getState?.(),
    key: t.key
  };
}, Pa = ce(Qt);
let Ns = 0, Ln = 0;
const Ii = (t) => {
  Ns++, Ln++;
  try {
    return t();
  } finally {
    Ln--, Ns++;
  }
}, yh = (t) => {
  let e;
  const s = /* @__PURE__ */ new Map();
  let n = -1;
  const r = (a) => {
    if (Ln === 0) return Si(t[a]());
    if (n !== Ns)
      s.clear(), n = Ns;
    else {
      const f = s.get(a);
      if (f)
        return f.signals.forEach(lt), f.untracked && lt(void 0), f.state;
    }
    const { value: c, signals: l, untracked: u } = ph(() => Si(t[a]()));
    return s.set(a, {
      state: c,
      signals: l,
      untracked: u
    }), c;
  };
  class i extends Yt {
    get(c, l) {
      const u = at(l, "OptionalAssistantState");
      if (u !== !1) return u;
      const f = l;
      if (!it(f) && Ks(t[f]))
        return r(f);
    }
    ownKeys() {
      return $n(t);
    }
    has(c, l) {
      return !it(l) && l in t;
    }
  }
  class o extends Yt {
    get(c, l) {
      const u = at(l, "AssistantState");
      if (u !== !1) return u;
      if (l === "optional") return e ??= new Proxy({}, new i());
      const f = l;
      if (!it(f))
        return r(f);
    }
    ownKeys() {
      return [...$n(t), "optional"];
    }
    has(c, l) {
      return l === "optional" || !it(l) && l in t;
    }
  }
  return new Proxy({}, new o());
}, Ti = /* @__PURE__ */ new WeakMap(), wh = (t) => {
  let e = Ti.get(t);
  return e || (e = yh(t), Ti.set(t, e)), e;
}, Vn = Ye(void 0), Sh = (t, e) => {
  const s = is(Vn);
  return Gs(Vn, t ?? s, e);
}, xh = (t, e) => {
  if (Array.isArray(t) !== Array.isArray(e)) return !1;
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    for (let n = 0; n < t.length; n++) if (!Object.is(t[n], e[n])) return !1;
    return !0;
  }
  const s = Object.keys(t);
  return s.length === Object.keys(e).length && s.every((n) => Object.hasOwn(e, n) && Object.is(t[n], e[n]));
}, Oa = /* @__PURE__ */ Symbol("assistant-ui.derived-hook"), Ih = (t) => {
  t[Oa] = !0;
}, Th = (t) => t[Oa] === !0, hn = (t) => {
  try {
    t();
  } catch (e) {
    console.error("NotificationManager: subscriber callback error", e);
  }
}, Ci = (t) => {
  console.error("NotificationManager: event listener error", t);
}, Ei = (t, e, s) => {
  try {
    const n = t(e, s);
    n !== null && (typeof n == "object" || typeof n == "function") && typeof n.then == "function" && Promise.resolve(n).catch(Ci);
  } catch (n) {
    Ci(n);
  }
}, Ch = () => {
  const t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
  return {
    on(r, i) {
      const o = i;
      if (r === "*")
        return e.add(o), () => e.delete(o);
      let a = t.get(r);
      return a || (a = /* @__PURE__ */ new Set(), t.set(r, a)), a.add(o), () => {
        a.delete(o), a.size === 0 && t.get(r) === a && t.delete(r);
      };
    },
    emit(r, i, o) {
      !t.has(r) && e.size === 0 || queueMicrotask(() => {
        const a = t.get(r);
        if (a) for (const c of a) Ei(c, i, o);
        if (e.size > 0) {
          const c = {
            event: r,
            payload: i
          };
          for (const l of e) Ei(l, c, o);
        }
      });
    },
    subscribe(r) {
      return s.add(r), () => s.delete(r);
    },
    markChanged(r) {
      r.version++, n.add(r);
    },
    invalidate(r) {
      r.version++, Ii(() => {
        for (const i of [...r.readers]) hn(i);
      });
    },
    notifySubscribers() {
      Ii(() => {
        for (const i of s) hn(i);
        if (n.size === 0) return;
        const r = /* @__PURE__ */ new Set();
        for (const i of n) for (const o of i.readers) r.add(o);
        n.clear();
        for (const i of r) hn(i);
      });
    }
  };
}, Eh = () => ue(Ch)[0], Ah = () => {
  const [t] = ue(() => ({
    controller: new AbortController(),
    generation: 0
  }));
  return Ys(() => {
    const e = ++t.generation;
    return () => queueMicrotask(() => {
      t.generation === e && t.controller.abort();
    });
  }, [t]), t.controller.signal;
}, jn = (t) => {
  const e = fe(() => ({}), []);
  return e.v !== void 0 && xh(e.v, t) ? e.v : (e.v = t, t);
}, Na = (() => {
  try {
    return !1;
  } catch {
    return !1;
  }
})(), Rh = (t, e) => {
  const s = { ...t }, n = /* @__PURE__ */ new Set();
  let r = !0;
  for (; r; ) {
    r = !1;
    for (const i of Object.values(s)) {
      if (n.has(i.hook)) continue;
      n.add(i.hook);
      const o = ch(i.hook);
      if (o) {
        o(s, e), r = !0;
        break;
      }
    }
  }
  return s;
}, tn = (t) => Th(t.hook), Mh = (t) => {
  if (!tn(t)) return {
    source: "root",
    query: {}
  };
  const e = t.args[0];
  return {
    source: e.source,
    query: e.query ?? {}
  };
}, qn = /* @__PURE__ */ Symbol.for("aui.event-receiver-ref"), $a = (t, e) => {
  const s = t === Ct ? nh() : t, n = Object.create(s);
  Object.assign(n, e);
  let r;
  return Object.defineProperty(n, "optional", {
    get: () => r ??= Ta(n),
    enumerable: !1
  }), n;
}, kh = ({ notifications: t, clientRef: e }) => fe(() => ({
  subscribe: t.subscribe,
  on: function(s, n) {
    if (!this) throw new Error("const { on } = useAui() is not supported. Use aui.on() instead.");
    const { scope: r, event: i } = jr(s), o = s[qn];
    if (r !== "*" && !o && Nn(this[r]))
      throw new Error(`Scope "${r}" is not available. Use { scope: "*", event: "${i}" } to listen globally.`);
    const a = t.on(i, (l, u) => {
      if (r === "*") return n(l);
      const f = ((o ?? e).current ?? this)[r];
      if (!Ks(f)) return;
      const h = Fr(f);
      if (h === u[lh(h)]) return n(l);
    });
    if (r !== "*") {
      if (o) {
        if (e.parent === Ct) return a;
      } else if (Nn(e.parent[r])) return a;
    }
    const c = e.parent.on(s, n);
    return () => {
      a(), c();
    };
  }
}), [t, e]), Ba = (t) => {
  const e = x(5);
  let s;
  e[0] !== t ? (s = Mh(t), e[0] = t, e[1] = s) : s = e[1];
  const { source: n, query: r } = s, i = jn(r);
  let o;
  return e[2] !== n || e[3] !== i ? (o = {
    source: n,
    query: i
  }, e[2] = n, e[3] = i, e[4] = o) : o = e[4], jn(o);
}, Fa = (t) => Xd(t) ? () => (lt(void 0), t) : () => t, Dh = (t, e) => {
  const s = x(3);
  let n;
  return s[0] !== e || s[1] !== t ? (n = e ? t : Pa(t), s[0] = e, s[1] = t, s[2] = n) : n = s[2], Qe(n);
}, Ph = (t, e) => {
  const s = Vr(), n = tn(e), r = Dh(e, n), i = n ? r : r.methods, o = Ba(e), a = fe(() => xa({
    name: t,
    ...o
  }, Fa(i)), [
    t,
    o,
    i
  ]);
  return s[t] = a, a;
}, Oh = ce(Ph), Nh = (t) => {
  const e = x(2);
  let s;
  return e[0] !== t ? (s = t.map(Uh), e[0] = t, e[1] = s) : s = e[1], Nr(s);
}, La = (t, e) => {
  const s = jn(e), n = fe(() => ({}), []);
  return n.deps !== s && (n.deps = s, n.client = t), n.client;
}, $h = ({ parent: t, entries: e, clientRef: s, notifications: n }) => {
  const r = kh({
    notifications: n,
    clientRef: s
  }), i = $a(t, r), o = fe(() => ({
    clientRef: s,
    emit: n.emit,
    markChanged: n.markChanged,
    invalidate: n.invalidate
  }), [
    s,
    n.emit,
    n.markChanged,
    n.invalidate
  ]), a = dh(o, function() {
    return ah(i, function() {
      return Nh(e);
    });
  });
  return { client: La(i, [t, ...a]) };
}, Bh = ({ parent: t, entries: e, destroySignal: s }) => {
  const n = oe({
    parent: t,
    current: null
  }).current, { value: r, effects: i } = Fd(function() {
    const a = Eh(), { client: c } = Sh(s, function() {
      return $h({
        parent: t,
        entries: e,
        clientRef: n,
        notifications: a
      });
    });
    return K(() => t.subscribe(a.notifySubscribers), [t, a]), K(() => a.notifySubscribers()), c;
  });
  return Ys(() => {
    n.parent = t, n.current = r;
  }, [
    r,
    t,
    n
  ]), {
    client: r,
    effects: i
  };
}, Fh = (t, e, s, n) => {
  const { get: r } = n.args[0], i = Da(t.subscribe, () => r(t)), o = Ba(n), a = fe(() => xa({
    name: s,
    ...o
  }, Fa(i)), [
    s,
    o,
    i
  ]);
  return e[s] = a, a;
}, Lh = (t, e) => {
  if (Na) {
    const [a] = ue(() => e.map(([u]) => u).join(",")), c = e.find(([, u]) => !tn(u));
    if (c) throw new Error(`Scope "${c[0]}" is a root scope but this useAui mounted derived-only; remount with a new key to change scope kinds.`);
    const l = e.map(([u]) => u).join(",");
    if (l !== a) throw new Error(`A derived-only config mounted scopes [${a}] but now has [${l}]; remount with a new key to change the scope set.`);
  }
  const s = oe({
    parent: t,
    current: null
  }).current, n = function(a, c) {
    if (!this) throw new Error("const { on } = useAui() is not supported. Use aui.on() instead.");
    const { scope: l, event: u } = jr(a);
    if (l === "*") return t.on(a, c);
    const f = a[qn];
    if (!f && Nn(this[l]))
      throw new Error(`Scope "${l}" is not available. Use { scope: "*", event: "${u}" } to listen globally.`);
    return t.on({
      scope: l,
      event: u,
      [qn]: f ?? s
    }, c);
  }, r = $a(t, {
    subscribe: t.subscribe,
    on: n
  }), i = e.map(([a, c]) => Fh(t, r, a, c)), o = La(r, [t, ...i]);
  return Ys(() => {
    s.parent = t, s.current = o;
  }, [
    o,
    t,
    s
  ]), o;
}, Vh = (t, e) => {
  const s = x(8);
  let n;
  s[0] !== e || s[1] !== t ? (n = Object.entries(Rh(e, t)), s[0] = e, s[1] = t, s[2] = n) : n = s[2];
  const r = n;
  let i;
  s[3] !== r ? (i = () => r.length === 0 || r.some(Hh), s[3] = r, s[4] = i) : i = s[4];
  const [o] = ue(i);
  let a;
  return s[5] !== r || s[6] !== o ? (a = {
    entries: r,
    rooted: o
  }, s[5] = r, s[6] = o, s[7] = a) : a = s[7], a;
}, jh = (t, e, s, n) => {
  const { entries: r, rooted: i } = Vh(t, e);
  return i ? s({
    parent: t,
    entries: r,
    destroySignal: n
  }) : { client: Lh(t, r) };
}, qh = (t, e, s) => jh(t, e, Bh, s);
function re(t) {
  return Vr();
}
function Uh(t) {
  const [e, s] = t;
  return De(e, Oh(e, s));
}
function Hh(t) {
  const [, e] = t;
  return !tn(e);
}
const D = (t) => {
  const e = x(5), s = re();
  let n;
  e[0] !== s ? (n = wh(s), e[0] = s, e[1] = n) : n = e[1];
  const r = n;
  let i;
  e[2] !== r || e[3] !== t ? (i = () => t(r), e[2] = r, e[3] = t, e[4] = i) : i = e[4];
  const o = Da(s.subscribe, i);
  if (typeof o == "object" && o !== null && (o === r || o === r.optional)) throw new Error("You tried to return the entire AssistantState. This is not supported due to technical limitations.");
  return ud(o), o;
}, Va = (t) => {
  const e = x(3), { get: s } = t, n = re();
  let r;
  return e[0] !== n || e[1] !== s ? (r = () => s(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2], D(r);
};
Ih(Va);
const ke = ce(Va), ja = (t) => {
  if (t.key === void 0) throw new Error("useClientLookup: Element has no key");
  return t.key;
};
function ut(t) {
  const e = x(12);
  let s;
  e[0] !== t ? (s = t.map(Wh), e[0] = t, e[1] = s) : s = e[1];
  const n = Nr(s);
  let r;
  e[2] !== t ? (r = t.reduce(Gh, /* @__PURE__ */ Object.create(null)), e[2] = t, e[3] = r) : r = e[3];
  const i = r;
  let o;
  e[4] !== n ? (o = n.map(zh), e[4] = n, e[5] = o) : o = e[5];
  const a = o;
  let c;
  e[6] !== i || e[7] !== n ? (c = (u) => {
    if ("index" in u) {
      if (u.index < 0 || u.index >= n.length) throw new Error(`useClientLookup: index ${u.index} out of bounds (length: ${n.length}) (ignore if recovered)`);
      return n[u.index].methods;
    }
    const f = i[u.key];
    if (f === void 0) throw new Error(`useClientLookup: key "${u.key}" not found (ignore if recovered)`);
    return n[f].methods;
  }, e[6] = i, e[7] = n, e[8] = c) : c = e[8];
  let l;
  return e[9] !== a || e[10] !== c ? (l = {
    state: a,
    get: c
  }, e[9] = a, e[10] = c, e[11] = l) : l = e[11], l;
}
function zh(t) {
  return t.state;
}
function Gh(t, e, s) {
  return t[ja(e)] = s, t;
}
function Wh(t) {
  return De(ja(t), Pa(t), t.deps);
}
const Yh = (t, e) => t.scrollTop > e.scrollTop && t.scrollHeight === e.scrollHeight, qa = (t) => {
  const e = x(16), { toolkit: s, mcpApp: n } = t;
  let r;
  e[0] !== n ? (r = n ? [De("mcpApp", n)] : [], e[0] = n, e[1] = r) : r = e[1];
  const i = Nr(r)[0], [o, a] = ue(Jh);
  let c;
  e[2] !== i || e[3] !== o ? (c = {
    toolUIs: o,
    mcpApp: i
  }, e[2] = i, e[3] = o, e[4] = c) : c = e[4];
  const l = c, u = Aa();
  let f;
  e[5] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (f = (b, S, I) => {
    const T = {
      render: S,
      standalone: I?.standalone ?? !1
    };
    return a((E) => ({
      ...E,
      [b]: [...E[b] ?? [], T]
    })), () => {
      a((E) => {
        const g = E[b]?.filter((A) => A !== T) ?? [];
        if (g.length > 0) return {
          ...E,
          [b]: g
        };
        const w = { ...E };
        return delete w[b], w;
      });
    };
  }, e[5] = f) : f = e[5];
  const h = f;
  let d, p;
  e[6] !== s ? (d = () => {
    if (!s) return;
    const b = [];
    for (const [S, I] of Object.entries(s)) {
      const T = "render" in I ? I.render : void 0, E = "renderText" in I ? I.renderText : void 0, g = T ?? (E ? Qd(E) : void 0);
      g && b.push(h(S, g, { standalone: Wd(I) }));
    }
    return () => {
      b.forEach(Xh);
    };
  }, p = [s, h], e[6] = s, e[7] = d, e[8] = p) : (d = e[7], p = e[8]), K(d, p);
  let _;
  e[9] !== u || e[10] !== s ? (_ = () => {
    if (!s) return;
    const b = Object.entries(s).reduce(Kh, {});
    return u.current.modelContext().register({ getModelContext: () => ({ tools: b }) });
  }, e[9] = u, e[10] = s, e[11] = _) : _ = e[11];
  let v;
  e[12] !== s ? (v = [s], e[12] = s, e[13] = v) : v = e[13], Ra("modelContext", _, v);
  let C;
  return e[14] !== l ? (C = {
    getState: () => l,
    setToolUI: h
  }, e[14] = l, e[15] = C) : C = e[15], C;
}, Qh = ce(qa);
Ca(qa, (t, e) => {
  !t.modelContext && e.modelContext.source === null && (t.modelContext = wa());
});
function Jh() {
  return {};
}
function Xh(t) {
  return t();
}
function Kh(t, e) {
  const [s, n] = e;
  if (n.type === "mcp") return t;
  const { display: r, render: i, renderText: o, ...a } = n;
  return t[s] = a, t;
}
const gt = (t) => Ws(t.subscribe, t.getState), Ua = (t, e) => {
  const s = e();
  return s.catch((n) => {
    console.error(`[assistant-ui] ${t} failed:`, n);
  }), s;
}, Zh = (t) => {
  const e = x(9), { runtime: s } = t, n = gt(s);
  let r;
  e[0] !== n ? (r = () => n, e[0] = n, e[1] = r) : r = e[1];
  let i, o;
  e[2] !== s ? (i = () => Ua("attachment remove", s.remove), o = () => s, e[2] = s, e[3] = i, e[4] = o) : (i = e[3], o = e[4]);
  let a;
  return e[5] !== r || e[6] !== i || e[7] !== o ? (a = {
    getState: r,
    remove: i,
    __internal_getRuntime: o
  }, e[5] = r, e[6] = i, e[7] = o, e[8] = a) : a = e[8], a;
}, Ha = ce(Zh), ef = (t) => {
  const e = x(5), { runtime: s, index: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getAttachmentByIndex(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const i = r;
  let o;
  return e[3] !== i ? (o = Ha({ runtime: i }), e[3] = i, e[4] = o) : o = e[4], Qe(o);
}, tf = ce(ef), sf = ({ item: t, onMove: e, onRemove: s }) => ({
  getState: () => t,
  steer: () => e({
    lane: "steer",
    insertAfter: null
  }),
  move: e,
  remove: s
}), nf = ce(sf), rf = (t) => {
  const e = x(55), { threadIdRef: s, messageIdRef: n, runtime: r } = t, i = gt(r), o = en();
  let a, c;
  e[0] !== o || e[1] !== n || e[2] !== r || e[3] !== s ? (a = () => {
    const g = [];
    for (const w of ["send", "attachmentAdd"]) {
      const A = r.unstable_on(w, () => {
        o(`composer.${w}`, {
          threadId: s.current,
          ...n && { messageId: n.current }
        });
      });
      g.push(A);
    }
    return g.push(r.unstable_on("attachmentAddError", (w) => {
      o("composer.attachmentAddError", {
        threadId: s.current,
        ...n && { messageId: n.current },
        ...w.attachmentId && { attachmentId: w.attachmentId },
        reason: w.reason,
        message: w.message
      });
    })), () => {
      for (const w of g) w();
    };
  }, c = [
    r,
    o,
    s,
    n
  ], e[0] = o, e[1] = n, e[2] = r, e[3] = s, e[4] = a, e[5] = c) : (a = e[4], c = e[5]), K(a, c);
  let l;
  if (e[6] !== r || e[7] !== i.attachments) {
    let g;
    e[9] !== r ? (g = (w, A) => De(w.id, tf({
      runtime: r,
      index: A
    }), [r, A]), e[9] = r, e[10] = g) : g = e[10], l = i.attachments.map(g), e[6] = r, e[7] = i.attachments, e[8] = l;
  } else l = e[8];
  const u = ut(l), f = i.queue;
  let h;
  if (e[11] !== f || e[12] !== r) {
    let g;
    e[14] !== r ? (g = (w) => De(w.id, nf({
      item: w,
      onMove: (A) => r.moveQueueItem(w.id, A),
      onRemove: () => r.removeQueueItem(w.id)
    })), e[14] = r, e[15] = g) : g = e[15], h = f.map(g), e[11] = f, e[12] = r, e[13] = h;
  } else h = e[13];
  const d = ut(h), p = i.type ?? "thread";
  let _;
  e[16] !== u.state || e[17] !== f || e[18] !== i.attachmentAccept || e[19] !== i.canCancel || e[20] !== i.canSend || e[21] !== i.dictation || e[22] !== i.isEditing || e[23] !== i.isEmpty || e[24] !== i.quote || e[25] !== i.role || e[26] !== i.runConfig || e[27] !== i.text || e[28] !== p ? (_ = {
    text: i.text,
    role: i.role,
    attachments: u.state,
    runConfig: i.runConfig,
    isEditing: i.isEditing,
    canCancel: i.canCancel,
    canSend: i.canSend,
    attachmentAccept: i.attachmentAccept,
    isEmpty: i.isEmpty,
    type: p,
    dictation: i.dictation,
    quote: i.quote,
    queue: f
  }, e[16] = u.state, e[17] = f, e[18] = i.attachmentAccept, e[19] = i.canCancel, e[20] = i.canSend, e[21] = i.dictation, e[22] = i.isEditing, e[23] = i.isEmpty, e[24] = i.quote, e[25] = i.role, e[26] = i.runConfig, e[27] = i.text, e[28] = p, e[29] = _) : _ = e[29];
  const v = _;
  let C;
  e[30] !== v ? (C = () => v, e[30] = v, e[31] = C) : C = e[31];
  const b = r.beginEdit ?? of;
  let S;
  e[32] !== u ? (S = (g) => "id" in g ? u.get({ key: g.id }) : u.get(g), e[32] = u, e[33] = S) : S = e[33];
  let I;
  e[34] !== d ? (I = (g) => "id" in g ? d.get({ key: g.id }) : d.get(g), e[34] = d, e[35] = I) : I = e[35];
  let T;
  e[36] !== r ? (T = () => r, e[36] = r, e[37] = T) : T = e[37];
  let E;
  return e[38] !== r.addAttachment || e[39] !== r.cancel || e[40] !== r.clearAttachments || e[41] !== r.reset || e[42] !== r.send || e[43] !== r.setQuote || e[44] !== r.setRole || e[45] !== r.setRunConfig || e[46] !== r.setText || e[47] !== r.startDictation || e[48] !== r.stopDictation || e[49] !== I || e[50] !== T || e[51] !== C || e[52] !== b || e[53] !== S ? (E = {
    getState: C,
    setText: r.setText,
    setRole: r.setRole,
    setRunConfig: r.setRunConfig,
    addAttachment: r.addAttachment,
    reset: r.reset,
    clearAttachments: r.clearAttachments,
    send: r.send,
    cancel: r.cancel,
    beginEdit: b,
    startDictation: r.startDictation,
    stopDictation: r.stopDictation,
    setQuote: r.setQuote,
    attachment: S,
    queueItem: I,
    __internal_getRuntime: T
  }, e[38] = r.addAttachment, e[39] = r.cancel, e[40] = r.clearAttachments, e[41] = r.reset, e[42] = r.send, e[43] = r.setQuote, e[44] = r.setRole, e[45] = r.setRunConfig, e[46] = r.setText, e[47] = r.startDictation, e[48] = r.stopDictation, e[49] = I, e[50] = T, e[51] = C, e[52] = b, e[53] = S, e[54] = E) : E = e[54], E;
}, za = ce(rf);
function of() {
  throw new Error("beginEdit is not supported in this runtime");
}
const Ga = (t) => ({ get current() {
  return t();
} }), af = (t) => {
  const e = x(13), { runtime: s } = t, n = gt(s);
  let r;
  e[0] !== n ? (r = () => n, e[0] = n, e[1] = r) : r = e[1];
  let i, o, a, c;
  e[2] !== s ? (i = (u) => s.addToolResult(u), o = (u) => s.resumeToolCall(u), a = (u) => s.respondToToolApproval(u), c = () => s, e[2] = s, e[3] = i, e[4] = o, e[5] = a, e[6] = c) : (i = e[3], o = e[4], a = e[5], c = e[6]);
  let l;
  return e[7] !== r || e[8] !== i || e[9] !== o || e[10] !== a || e[11] !== c ? (l = {
    getState: r,
    addToolResult: i,
    resumeToolCall: o,
    respondToToolApproval: a,
    __internal_getRuntime: c
  }, e[7] = r, e[8] = i, e[9] = o, e[10] = a, e[11] = c, e[12] = l) : l = e[12], l;
}, cf = ce(af), lf = (t) => {
  const e = x(5), { runtime: s, index: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getAttachmentByIndex(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const i = r;
  let o;
  return e[3] !== i ? (o = Ha({ runtime: i }), e[3] = i, e[4] = o) : o = e[4], Qe(o);
}, uf = ce(lf), df = (t) => {
  const e = x(5), { runtime: s, index: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getMessagePartByIndex(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const i = r;
  let o;
  return e[3] !== i ? (o = cf({ runtime: i }), e[3] = i, e[4] = o) : o = e[4], Qe(o);
}, hf = ce(df), ff = (t) => {
  const e = x(55), { runtime: s, threadIdRef: n } = t, r = gt(s), [i, o] = ue(!1), [a, c] = ue(!1);
  let l;
  e[0] !== s ? (l = Ga(() => s.getState().id), e[0] = s, e[1] = l) : l = e[1];
  const u = l;
  let f;
  e[2] !== u || e[3] !== s.composer || e[4] !== n ? (f = za({
    runtime: s.composer,
    threadIdRef: n,
    messageIdRef: u
  }), e[2] = u, e[3] = s.composer, e[4] = n, e[5] = f) : f = e[5];
  const h = Qt(f);
  let d;
  if (e[6] !== s || e[7] !== r.content) {
    let H;
    e[9] !== s ? (H = (ee, L) => De("toolCallId" in ee && ee.toolCallId != null ? `toolCallId-${ee.toolCallId}` : `index-${L}`, hf({
      runtime: s,
      index: L
    }), [s, L]), e[9] = s, e[10] = H) : H = e[10], d = r.content.map(H), e[6] = s, e[7] = r.content, e[8] = d;
  } else d = e[8];
  const p = ut(d);
  let _;
  e[11] !== r.attachments ? (_ = r.attachments ?? [], e[11] = r.attachments, e[12] = _) : _ = e[12];
  let v;
  if (e[13] !== s || e[14] !== _) {
    let H;
    e[16] !== s ? (H = (ee, L) => De(ee.id, uf({
      runtime: s,
      index: L
    }), [s, L]), e[16] = s, e[17] = H) : H = e[17], v = _.map(H), e[13] = s, e[14] = _, e[15] = v;
  } else v = e[15];
  const C = ut(v), b = r;
  let S;
  e[18] !== h.state || e[19] !== i || e[20] !== a || e[21] !== p.state || e[22] !== b ? (S = {
    ...b,
    parts: p.state,
    composer: h.state,
    isCopied: i,
    isHovering: a
  }, e[18] = h.state, e[19] = i, e[20] = a, e[21] = p.state, e[22] = b, e[23] = S) : S = e[23];
  const I = S;
  let T;
  e[24] !== I ? (T = () => I, e[24] = I, e[25] = T) : T = e[25];
  let E;
  e[26] !== h.methods ? (E = () => h.methods, e[26] = h.methods, e[27] = E) : E = e[27];
  let g, w, A, P, W, X, q;
  e[28] !== s ? (g = () => s.delete(), w = (H) => s.reload(H), A = () => s.speak(), P = () => s.stopSpeaking(), W = (H) => s.submitFeedback(H), X = (H) => s.switchToBranch(H), q = () => s.unstable_getCopyText(), e[28] = s, e[29] = g, e[30] = w, e[31] = A, e[32] = P, e[33] = W, e[34] = X, e[35] = q) : (g = e[29], w = e[30], A = e[31], P = e[32], W = e[33], X = e[34], q = e[35]);
  let U;
  e[36] !== p ? (U = (H) => "index" in H ? p.get({ index: H.index }) : p.get({ key: `toolCallId-${H.toolCallId}` }), e[36] = p, e[37] = U) : U = e[37];
  let he;
  e[38] !== C ? (he = (H) => "id" in H ? C.get({ key: H.id }) : C.get(H), e[38] = C, e[39] = he) : he = e[39];
  let de;
  e[40] !== s ? (de = () => s, e[40] = s, e[41] = de) : de = e[41];
  let Z;
  return e[42] !== g || e[43] !== w || e[44] !== A || e[45] !== P || e[46] !== W || e[47] !== X || e[48] !== q || e[49] !== U || e[50] !== he || e[51] !== de || e[52] !== T || e[53] !== E ? (Z = {
    getState: T,
    composer: E,
    delete: g,
    reload: w,
    speak: A,
    stopSpeaking: P,
    submitFeedback: W,
    switchToBranch: X,
    getCopyText: q,
    part: U,
    attachment: he,
    setIsCopied: o,
    setIsHovering: c,
    __internal_getRuntime: de
  }, e[42] = g, e[43] = w, e[44] = A, e[45] = P, e[46] = W, e[47] = X, e[48] = q, e[49] = U, e[50] = he, e[51] = de, e[52] = T, e[53] = E, e[54] = Z) : Z = e[54], Z;
}, mf = ce(ff), pf = (t) => ({ getState: () => t }), gf = ce(pf), bf = (t) => {
  const e = x(9);
  let s;
  e[0] !== t.suggestions ? (s = t.suggestions.map(yf), e[0] = t.suggestions, e[1] = s) : s = e[1];
  const n = ut(s);
  let r;
  e[2] !== t ? (r = () => t, e[2] = t, e[3] = r) : r = e[3];
  let i;
  e[4] !== n ? (i = (a) => {
    const { index: c } = a;
    return n.get({ index: c });
  }, e[4] = n, e[5] = i) : i = e[5];
  let o;
  return e[6] !== r || e[7] !== i ? (o = {
    getState: r,
    suggestion: i
  }, e[6] = r, e[7] = i, e[8] = o) : o = e[8], o;
}, _f = (t) => {
  const e = x(4);
  let s;
  e[0] !== t ? (s = t.map(wf), e[0] = t, e[1] = s) : s = e[1];
  let n;
  return e[2] !== s ? (n = { suggestions: s }, e[2] = s, e[3] = n) : n = e[3], bf(n);
}, vf = ce(_f);
function yf(t, e) {
  return De(e, gf(t), [t]);
}
function wf(t) {
  return {
    title: t.title ?? t.prompt,
    label: t.label ?? "",
    prompt: t.prompt
  };
}
const Sf = (t) => {
  const e = x(6), { runtime: s, id: n, threadIdRef: r } = t;
  let i;
  e[0] !== n || e[1] !== s ? (i = s.getMessageById(n), e[0] = n, e[1] = s, e[2] = i) : i = e[2];
  const o = i;
  let a;
  return e[3] !== o || e[4] !== r ? (a = mf({
    runtime: o,
    threadIdRef: r
  }), e[3] = o, e[4] = r, e[5] = a) : a = e[5], Qe(a);
}, xf = ce(Sf), If = (t) => {
  const e = x(64), { runtime: s } = t, n = gt(s), r = en();
  let i, o;
  e[0] !== r || e[1] !== s ? (i = () => {
    const w = [];
    for (const A of [
      "runStart",
      "runEnd",
      "initialize",
      "modelContextUpdate"
    ]) {
      const P = s.unstable_on(A, () => {
        const W = s.getState()?.threadId || "unknown";
        r(`thread.${A}`, { threadId: W });
      });
      w.push(P);
    }
    return () => {
      for (const A of w) A();
    };
  }, o = [s, r], e[0] = r, e[1] = s, e[2] = i, e[3] = o) : (i = e[2], o = e[3]), K(i, o);
  let a;
  e[4] !== s ? (a = Ga(() => s.getState().threadId), e[4] = s, e[5] = a) : a = e[5];
  const c = a;
  let l;
  e[6] !== s.composer || e[7] !== c ? (l = za({
    runtime: s.composer,
    threadIdRef: c
  }), e[6] = s.composer, e[7] = c, e[8] = l) : l = e[8];
  const u = Qt(l);
  let f;
  e[9] !== n.suggestions ? (f = vf(n.suggestions), e[9] = n.suggestions, e[10] = f) : f = e[10];
  const h = Qt(f);
  let d;
  if (e[11] !== s || e[12] !== n.messages || e[13] !== c) {
    let w;
    e[15] !== s || e[16] !== c ? (w = (A) => De(A.id, xf({
      runtime: s,
      id: A.id,
      threadIdRef: c
    }), [
      s,
      A.id,
      c
    ]), e[15] = s, e[16] = c, e[17] = w) : w = e[17], d = n.messages.map(w), e[11] = s, e[12] = n.messages, e[13] = c, e[14] = d;
  } else d = e[14];
  const p = ut(d), _ = p.state.length === 0 && !n.isLoading;
  let v;
  e[18] !== u.state || e[19] !== p.state || e[20] !== n.capabilities || e[21] !== n.extras || e[22] !== n.isDisabled || e[23] !== n.isLoading || e[24] !== n.isRunning || e[25] !== n.speech || e[26] !== n.state || e[27] !== n.suggestions || e[28] !== n.voice || e[29] !== _ ? (v = {
    isEmpty: _,
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
    messages: p.state
  }, e[18] = u.state, e[19] = p.state, e[20] = n.capabilities, e[21] = n.extras, e[22] = n.isDisabled, e[23] = n.isLoading, e[24] = n.isRunning, e[25] = n.speech, e[26] = n.state, e[27] = n.suggestions, e[28] = n.voice, e[29] = _, e[30] = v) : v = e[30];
  const C = v;
  let b;
  e[31] !== C ? (b = () => C, e[31] = C, e[32] = b) : b = e[32];
  let S;
  e[33] !== u.methods ? (S = () => u.methods, e[33] = u.methods, e[34] = S) : S = e[34];
  let I;
  e[35] !== h ? (I = () => h.methods, e[35] = h, e[36] = I) : I = e[36];
  let T;
  e[37] !== p ? (T = (w) => "id" in w ? p.get({ key: w.id }) : p.get(w), e[37] = p, e[38] = T) : T = e[38];
  let E;
  e[39] !== s ? (E = () => s, e[39] = s, e[40] = E) : E = e[40];
  let g;
  return e[41] !== s.append || e[42] !== s.cancelRun || e[43] !== s.connectVoice || e[44] !== s.deleteMessage || e[45] !== s.disconnectVoice || e[46] !== s.export || e[47] !== s.getModelContext || e[48] !== s.getVoiceVolume || e[49] !== s.import || e[50] !== s.importExternalState || e[51] !== s.muteVoice || e[52] !== s.reset || e[53] !== s.resumeRun || e[54] !== s.startRun || e[55] !== s.stopSpeaking || e[56] !== s.subscribeVoiceVolume || e[57] !== s.unmuteVoice || e[58] !== S || e[59] !== I || e[60] !== T || e[61] !== E || e[62] !== b ? (g = {
    getState: b,
    composer: S,
    suggestions: I,
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
    message: T,
    __internal_getRuntime: E
  }, e[41] = s.append, e[42] = s.cancelRun, e[43] = s.connectVoice, e[44] = s.deleteMessage, e[45] = s.disconnectVoice, e[46] = s.export, e[47] = s.getModelContext, e[48] = s.getVoiceVolume, e[49] = s.import, e[50] = s.importExternalState, e[51] = s.muteVoice, e[52] = s.reset, e[53] = s.resumeRun, e[54] = s.startRun, e[55] = s.stopSpeaking, e[56] = s.subscribeVoiceVolume, e[57] = s.unmuteVoice, e[58] = S, e[59] = I, e[60] = T, e[61] = E, e[62] = b, e[63] = g) : g = e[63], g;
}, Tf = ce(If), Fe = (t, e) => Ua(`thread list ${t}`, e), Cf = (t) => {
  const e = x(35), { runtime: s, mainThreadIsRunning: n } = t, r = n === void 0 ? !1 : n, i = gt(s);
  let o;
  e: {
    const A = i.isRunning || i.isMain && r;
    if (A === i.isRunning) {
      o = i;
      break e;
    }
    let P;
    e[0] !== A || e[1] !== i ? (P = {
      ...i,
      isRunning: A
    }, e[0] = A, e[1] = i, e[2] = P) : P = e[2], o = P;
  }
  const a = o, c = en(), { isMain: l, id: u } = i;
  let f;
  e[3] !== l || e[4] !== u ? (f = {
    isMain: l,
    threadId: u
  }, e[3] = l, e[4] = u, e[5] = f) : f = e[5];
  const h = oe(f);
  let d, p;
  e[6] !== c || e[7] !== l || e[8] !== u ? (d = () => {
    const A = h.current;
    A.isMain === l && A.threadId === u || (h.current = {
      isMain: l,
      threadId: u
    }, c(l ? "threadListItem.switchedTo" : "threadListItem.switchedAway", { threadId: u }));
  }, p = [
    l,
    u,
    c
  ], e[6] = c, e[7] = l, e[8] = u, e[9] = d, e[10] = p) : (d = e[9], p = e[10]), K(d, p);
  let _;
  e[11] !== a ? (_ = () => a, e[11] = a, e[12] = _) : _ = e[12];
  let v, C, b, S, I, T, E;
  e[13] !== s ? (I = (A) => Fe("switch", () => s.switchTo(A)), T = (A) => Fe("rename", () => s.rename(A)), E = (A) => Fe("update custom metadata", () => s.updateCustom(A)), v = () => Fe("archive", () => s.archive()), C = () => Fe("unarchive", () => s.unarchive()), b = () => Fe("delete", () => s.delete()), S = () => Fe("generate title", () => s.generateTitle()), e[13] = s, e[14] = v, e[15] = C, e[16] = b, e[17] = S, e[18] = I, e[19] = T, e[20] = E) : (v = e[14], C = e[15], b = e[16], S = e[17], I = e[18], T = e[19], E = e[20]);
  let g;
  e[21] !== s ? (g = () => s, e[21] = s, e[22] = g) : g = e[22];
  let w;
  return e[23] !== s.detach || e[24] !== s.initialize || e[25] !== v || e[26] !== C || e[27] !== b || e[28] !== S || e[29] !== g || e[30] !== _ || e[31] !== I || e[32] !== T || e[33] !== E ? (w = {
    getState: _,
    switchTo: I,
    rename: T,
    updateCustom: E,
    archive: v,
    unarchive: C,
    delete: b,
    generateTitle: S,
    initialize: s.initialize,
    detach: s.detach,
    __internal_getRuntime: g
  }, e[23] = s.detach, e[24] = s.initialize, e[25] = v, e[26] = C, e[27] = b, e[28] = S, e[29] = g, e[30] = _, e[31] = I, e[32] = T, e[33] = E, e[34] = w) : w = e[34], w;
}, Ef = ce(Cf), Af = (t) => {
  const e = x(4), s = en(), n = oe(t);
  let r, i;
  e[0] !== s || e[1] !== t ? (r = () => {
    const o = n.current;
    o !== t && (n.current = t, s("threads.selectionChanged", {
      threadId: t,
      previousThreadId: o
    }));
  }, i = [t, s], e[0] = s, e[1] = t, e[2] = r, e[3] = i) : (r = e[2], i = e[3]), K(r, i);
}, Rf = (t) => {
  const e = x(6), { runtime: s, id: n, mainThreadIsRunning: r } = t;
  let i;
  e[0] !== n || e[1] !== s ? (i = s.getItemById(n), e[0] = n, e[1] = s, e[2] = i) : i = e[2];
  const o = i;
  let a;
  return e[3] !== r || e[4] !== o ? (a = Ef({
    runtime: o,
    mainThreadIsRunning: r
  }), e[3] = r, e[4] = o, e[5] = a) : a = e[5], Qe(a);
}, Mf = ce(Rf), kf = (t) => {
  const e = x(43), { runtime: s, __internal_assistantRuntime: n } = t, r = gt(s);
  Af(r.mainThreadId);
  let i;
  e[0] !== s.main ? (i = Tf({ runtime: s.main }), e[0] = s.main, e[1] = i) : i = e[1];
  const o = Qt(i);
  let a;
  e[2] !== o.state || e[3] !== s || e[4] !== r.threadItems ? (a = Object.keys(r.threadItems).map((g) => De(g, Mf({
    runtime: s,
    id: g,
    mainThreadIsRunning: o.state.isRunning
  }), [
    s,
    g,
    o.state.isRunning
  ])), e[2] = o.state, e[3] = s, e[4] = r.threadItems, e[5] = a) : a = e[5];
  const c = ut(a), l = r.newThreadId ?? null;
  let u;
  e[6] !== o.state || e[7] !== r.archivedThreadIds || e[8] !== r.hasMore || e[9] !== r.isLoading || e[10] !== r.isLoadingMore || e[11] !== r.mainThreadId || e[12] !== r.threadIds || e[13] !== l || e[14] !== c.state ? (u = {
    mainThreadId: r.mainThreadId,
    newThreadId: l,
    isLoading: r.isLoading,
    isLoadingMore: r.isLoadingMore,
    hasMore: r.hasMore,
    threadIds: r.threadIds,
    archivedThreadIds: r.archivedThreadIds,
    threadItems: c.state,
    main: o.state
  }, e[6] = o.state, e[7] = r.archivedThreadIds, e[8] = r.hasMore, e[9] = r.isLoading, e[10] = r.isLoadingMore, e[11] = r.mainThreadId, e[12] = r.threadIds, e[13] = l, e[14] = c.state, e[15] = u) : u = e[15];
  const f = u;
  let h;
  e[16] !== f ? (h = () => f, e[16] = f, e[17] = h) : h = e[17];
  let d;
  e[18] !== o.methods ? (d = () => o.methods, e[18] = o.methods, e[19] = d) : d = e[19];
  let p;
  e[20] !== f || e[21] !== c ? (p = (g) => {
    if (g === "main") return c.get({ key: f.mainThreadId });
    if ("id" in g) return c.get({ key: g.id });
    const { index: w, archived: A } = g, P = A !== void 0 && A ? f.archivedThreadIds[w] : f.threadIds[w];
    return c.get({ key: P });
  }, e[20] = f, e[21] = c, e[22] = p) : p = e[22];
  let _, v, C, b, S, I;
  e[23] !== s ? (S = (g, w) => Fe("switch", () => s.switchToThread(g, w)), I = () => Fe("create", () => s.switchToNewThread()), _ = () => s.getLoadThreadsPromise(), v = () => s.reload(), C = () => s.reloadMainThread(), b = () => s.loadMore(), e[23] = s, e[24] = _, e[25] = v, e[26] = C, e[27] = b, e[28] = S, e[29] = I) : (_ = e[24], v = e[25], C = e[26], b = e[27], S = e[28], I = e[29]);
  let T;
  e[30] !== n ? (T = () => n, e[30] = n, e[31] = T) : T = e[31];
  let E;
  return e[32] !== _ || e[33] !== v || e[34] !== C || e[35] !== b || e[36] !== T || e[37] !== h || e[38] !== d || e[39] !== p || e[40] !== S || e[41] !== I ? (E = {
    getState: h,
    thread: d,
    item: p,
    switchToThread: S,
    switchToNewThread: I,
    getLoadThreadsPromise: _,
    reload: v,
    reloadMainThread: C,
    loadMore: b,
    __internal_getAssistantRuntime: T
  }, e[32] = _, e[33] = v, e[34] = C, e[35] = b, e[36] = T, e[37] = h, e[38] = d, e[39] = p, e[40] = S, e[41] = I, e[42] = E) : E = e[42], E;
}, Df = ce(kf), Pf = (t, e) => {
  t.thread ??= ke({
    source: "threads",
    query: { type: "main" },
    get: (s) => s.threads.thread("main")
  }), t.threadListItem ??= ke({
    source: "threads",
    query: { type: "main" },
    get: (s) => s.threads.item("main")
  }), t.composer ??= ke({
    source: "thread",
    query: {},
    get: (s) => s.threads.thread("main").composer()
  }), !t.modelContext && e.modelContext.source === null && (t.modelContext = wa()), !t.suggestions && e.suggestions.source === null && (t.suggestions = ke({
    source: "thread",
    query: {},
    get: (s) => s.thread.suggestions()
  }));
}, Wa = (t) => {
  const e = x(7), s = Aa();
  let n;
  e[0] !== s || e[1] !== t ? (n = () => t.registerModelContextProvider(s.current.modelContext()), e[0] = s, e[1] = t, e[2] = n) : n = e[2];
  let r;
  e[3] !== t ? (r = [t], e[3] = t, e[4] = r) : r = e[4], Ra("modelContext", n, r);
  let i;
  return e[5] !== t ? (i = Df({
    runtime: t.threads,
    __internal_assistantRuntime: t
  }), e[5] = t, e[6] = i) : i = e[6], Qe(i);
}, Of = ce(Wa), Nf = (t, e) => {
  Pf(t, e), !t.tools && e.tools.source === null && (t.tools = Qh({})), !t.dataRenderers && e.dataRenderers.source === null && (t.dataRenderers = Vd());
};
Ca(Wa, Nf);
const $f = () => () => {
}, Bf = () => Ws($f, Lf, Vf), Ff = (t, e) => {
  (Bf() ? K : kt)(t, e);
};
function Lf() {
  return !1;
}
function Vf() {
  return typeof document > "u";
}
const jf = Ve({}), Ai = ({ effects: t }) => {
  "use no memo";
  return Ff(t), null;
}, Je = ge(function(e, s) {
  "use no memo";
  const { config: n, children: r } = e, i = "extends" in e, o = "value" in e, a = Vr();
  if (Na) {
    if (i && o) throw new Error("AuiProvider: pass either `extends` or `value`, not both.");
    if (i && e.extends === void 0) throw new Error("AuiProvider: `extends` must be a client or null, not undefined.");
    if (i && !n) throw new Error("AuiProvider: `extends` requires a `config`.");
    if (o && n) throw new Error("AuiProvider: pass either `value` or `config`, not both.");
    if (!o && !n) throw new Error("AuiProvider: a `config` is required.");
    if (!i && !o && a !== Ct) throw new Error("A parent AuiProvider exists — pass extends={aui} to inherit it or extends={null} to isolate.");
  }
  const c = i ? e.extends ?? Ct : o ? e.value ?? Ct : a, l = Ah(), { client: u, effects: f } = qh(c, n ?? jf, l);
  return dd(s, () => u, [u]), /* @__PURE__ */ m(Vn.Provider, {
    value: l,
    children: /* @__PURE__ */ N(Lr.Provider, {
      value: u,
      children: [
        /* @__PURE__ */ m(Ai, { effects: oh(c) }),
        f && /* @__PURE__ */ m(Ai, { effects: f }),
        r
      ]
    })
  });
}), qf = (t) => {
  const e = re(), s = oe(!1), n = s.current ? null : t(e);
  return D(() => s.current ? t(e) : n), () => (s.current = !0, t(e));
}, Uf = Object.freeze({});
function sn(t) {
  const e = x(3), { getItemState: s, children: n } = t, r = qf(s);
  let i;
  return e[0] !== n || e[1] !== r ? (i = n(r), e[0] = n, e[1] = r, e[2] = i) : i = e[2], Hf(i);
}
const Hf = (t) => {
  const e = typeof t == "object" && t != null && "type" in t ? t : null, s = e?.type, n = e?.key, r = typeof e?.props == "object" && e.props != null && Object.entries(e.props).length === 0 ? Uf : e?.props;
  return fe(() => e, [
    s,
    n,
    r
  ]) ?? t;
}, Ri = (t, e) => {
  const s = x(11), n = re(), r = ma(e);
  let i;
  s[0] !== t ? (i = jr(t), s[0] = t, s[1] = i) : i = s[1];
  const { scope: o, event: a } = i;
  let c;
  s[2] !== n || s[3] !== r || s[4] !== a || s[5] !== o ? (c = () => n.on({
    scope: o,
    event: a
  }, r), s[2] = n, s[3] = r, s[4] = a, s[5] = o, s[6] = c) : c = s[6];
  let l;
  s[7] !== n || s[8] !== a || s[9] !== o ? (l = [
    n,
    o,
    a
  ], s[7] = n, s[8] = a, s[9] = o, s[10] = l) : l = s[10], K(c, l);
}, zf = (t) => t._core?.RenderComponent, Gf = ({ runtime: t, aui: e, config: s, children: n }) => {
  "use no memo";
  const r = zf(t), i = Ve({
    ...s,
    threads: Of(t)
  });
  return /* @__PURE__ */ N(Je, {
    extends: e,
    config: i,
    children: [r && /* @__PURE__ */ m(r, {}), n]
  });
}, Wf = ve((t) => {
  const e = x(5), { runtime: s, aui: n, config: r, children: i } = t, o = n === void 0 ? null : n;
  let a;
  return e[0] !== o || e[1] !== i || e[2] !== r || e[3] !== s ? (a = /* @__PURE__ */ m(Gf, {
    runtime: s,
    aui: o,
    config: r,
    children: i
  }), e[0] = o, e[1] = i, e[2] = r, e[3] = s, e[4] = a) : a = e[4], a;
});
function pe(t) {
  return t != null && typeof t == "object" && !Array.isArray(t);
}
function $s(t, e = 0) {
  return e > 100 ? !1 : t === null || typeof t == "string" || typeof t == "boolean" ? !0 : typeof t == "number" ? !Number.isNaN(t) && Number.isFinite(t) : Array.isArray(t) ? t.every((s) => $s(s, e + 1)) : pe(t) ? Object.entries(t).every(([s, n]) => typeof s == "string" && $s(n, e + 1)) : !1;
}
const Yf = 100, Un = (t, e, s) => {
  if (t === e) return !0;
  if (s > Yf || t == null || e == null) return !1;
  if (Array.isArray(t))
    return !Array.isArray(e) || t.length !== e.length ? !1 : t.every((i, o) => Un(i, e[o], s + 1));
  if (Array.isArray(e) || !pe(t) || !pe(e)) return !1;
  const n = Object.keys(t), r = Object.keys(e);
  return n.length !== r.length ? !1 : n.every((i) => Object.hasOwn(e, i) && Un(t[i], e[i], s + 1));
}, Hr = (t, e) => !$s(t) || !$s(e) ? !1 : Un(t, e, 0);
function Qf(t) {
  const e = t.metadata;
  if (!e || typeof e != "object") return;
  const s = e.custom;
  if (!s || typeof s != "object") return;
  const n = s.interactables;
  return Array.isArray(n) ? n : void 0;
}
function Jf(t) {
  return `update_${t.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}
const Mi = (t) => {
  if (!pe(t)) return;
  const e = t.id;
  return typeof e == "string" || typeof e == "number" ? e : void 0;
};
function Xf(t, e, s) {
  let n = Array.isArray(e.set) ? [...e.set] : [...t];
  if (e.clear === !0 && (n = []), Array.isArray(e.remove) && e.remove.length > 0) {
    const i = new Set(e.remove);
    n = n.filter((o) => {
      const a = Mi(o);
      return a !== void 0 ? !i.has(a) : !i.has(o);
    });
  }
  const r = e.update;
  if (Array.isArray(r) && r.length > 0 && (n = n.map((i) => {
    const o = Mi(i);
    if (o === void 0 || !pe(i)) return i;
    const a = r.find((c) => pe(c) && c.id === o);
    return a ? {
      ...i,
      ...a
    } : i;
  })), Array.isArray(e.add) && e.add.length > 0) {
    const i = s ? e.add.map((o) => {
      if (!pe(o) || o.id !== void 0) return o;
      const a = s();
      return a === void 0 ? o : {
        ...o,
        id: a
      };
    }) : e.add;
    n = [...n, ...i];
  }
  return n;
}
function fn(t, e, s) {
  if (!pe(t) || !pe(e)) return e;
  const n = pe(s?.arrayBaseline) ? s.arrayBaseline : t, r = { ...t };
  for (const [i, o] of Object.entries(e)) {
    const a = n[i];
    Array.isArray(a) && pe(o) ? r[i] = Xf(a, o, s?.idFactory && (s.idKeyedFields === void 0 || s.idKeyedFields.has(i)) ? () => s.idFactory?.(i) : void 0) : r[i] = o;
  }
  return r;
}
function Kf(t, e) {
  if (!pe(t) || !pe(e)) return;
  for (const r of Object.keys(t)) if (!(r in e)) return;
  const s = {};
  for (const [r, i] of Object.entries(e)) (!(r in t) || !Hr(t[r], i)) && (s[r] = i);
  const n = Object.keys(s).length;
  if (!(n === 0 || n === Object.keys(e).length))
    return s;
}
const Zf = (t) => {
  if (!t || typeof t != "object") return;
  const e = t;
  return e.type === "tool-call" ? e : void 0;
}, em = (t, e) => {
  if (!t.args || typeof t.args != "object") return !1;
  const s = pe(t.result) ? t.result : void 0;
  if (s?.success === !1) return !1;
  if (typeof s?.id == "string") return s.id === e;
  const n = t.args.id;
  return n === e || n === void 0;
}, tm = (t) => {
  const e = pe(t) ? t.addedItemIds : void 0;
  if (!pe(e)) return;
  const s = /* @__PURE__ */ new Map();
  for (const [n, r] of Object.entries(e)) {
    if (!Array.isArray(r)) continue;
    const i = r.filter((o) => typeof o == "string");
    i.length > 0 && s.set(n, i);
  }
  if (s.size !== 0)
    return (n) => s.get(n)?.shift();
}, ki = /* @__PURE__ */ new WeakMap();
function sm(t, e, s) {
  let n = ki.get(t);
  n || (n = /* @__PURE__ */ new Map(), ki.set(t, n));
  let r = n.get(s);
  r || (r = /* @__PURE__ */ new Map(), n.set(s, r));
  const i = r.get(e);
  if (i) return i;
  const o = Jf(s), a = [], c = () => a[a.length - 1];
  for (const l of t) {
    if (l.role === "user") {
      const u = Qf(l)?.find((f) => f.id === e);
      if (!u) continue;
      if (u.partial) {
        const f = c();
        f && a.push({
          state: fn(f.state, u.state),
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
        const f = Zf(u);
        if (f) {
          if (f.toolCallId === e && f.toolName === s)
            f.args && typeof f.args == "object" && a.push({
              state: f.args,
              origin: "create",
              toolCallId: e
            });
          else if (f.toolName === o && em(f, e)) {
            const h = c();
            if (h) {
              const { id: d, ...p } = f.args, _ = tm(f.result);
              a.push({
                state: _ ? fn(h.state, p, { idFactory: _ }) : fn(h.state, p),
                origin: "update",
                toolCallId: f.toolCallId
              });
            }
          }
        }
      }
  }
  return r.set(e, a), a;
}
function nm(t, e, s) {
  const n = sm(t, e, s), r = n[n.length - 1];
  return r ? { state: r.state } : void 0;
}
function rm(t, e) {
  if (!t) return;
  const { interactables: s, ...n } = t, r = { ...n };
  if (Array.isArray(s)) {
    const i = [];
    for (const o of s) {
      const a = nm(e, o.id, o.name);
      if (!a) {
        i.push({
          id: o.id,
          name: o.name,
          state: o.state
        });
        continue;
      }
      if (Hr(o.state, a.state)) continue;
      const c = Kf(a.state, o.state);
      i.push(c ? {
        id: o.id,
        name: o.name,
        state: c,
        partial: !0
      } : {
        id: o.id,
        name: o.name,
        state: o.state
      });
    }
    i.length && (r.interactables = i);
  }
  return Object.keys(r).length ? r : void 0;
}
function im() {
  const t = this.getReader();
  let e = !1, s = Promise.resolve();
  const n = (a) => {
    const c = s.then(a);
    return s = c.then(() => {
    }, () => {
    }), c;
  }, r = async (a) => {
    if (!e) {
      e = !0;
      try {
        return t.cancel(a);
      } finally {
        t.releaseLock();
      }
    }
  }, i = {
    next: () => n(async () => {
      if (e) return {
        done: !0,
        value: void 0
      };
      try {
        const a = await t.read();
        return a.done && (e = !0, t.releaseLock()), a;
      } catch (a) {
        throw e = !0, t.releaseLock(), a;
      }
    }),
    return: (a) => n(async () => (await r(a), {
      done: !0,
      value: a
    })),
    throw: (a) => n(async () => {
      throw await r(void 0), a;
    }),
    [Symbol.asyncIterator]() {
      return this;
    }
  }, o = Symbol.asyncDispose;
  return o && Object.defineProperty(i, o, {
    value: async () => {
      await i.return();
    },
    writable: !0,
    configurable: !0
  }), i;
}
function mn(t) {
  return t[Symbol.asyncIterator] ??= im, t;
}
const om = /[0-9a-fA-F]/;
function am(t) {
  const e = ["ROOT"];
  let s = -1, n = null, r = 0;
  const i = [];
  let o;
  function a() {
    o !== void 0 && (i.push(JSON.parse(`"${o}"`)), o = void 0);
  }
  function c(h, d, p) {
    switch (h) {
      case '"':
        s = d, e.pop(), e.push(p), e.push("INSIDE_STRING"), a();
        break;
      case "f":
      case "t":
      case "n":
        s = d, n = d, e.pop(), e.push(p), e.push("INSIDE_LITERAL");
        break;
      case "-":
        e.pop(), e.push(p), e.push("INSIDE_NUMBER"), a();
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
        s = d, e.pop(), e.push(p), e.push("INSIDE_NUMBER"), a();
        break;
      case "{":
        s = d, e.pop(), e.push(p), e.push("INSIDE_OBJECT_START"), a();
        break;
      case "[":
        s = d, e.pop(), e.push(p), e.push("INSIDE_ARRAY_START"), a();
    }
  }
  function l(h, d) {
    switch (h) {
      case ",":
        e.pop(), e.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      case "}":
        s = d, e.pop(), o = i.pop();
    }
  }
  function u(h, d) {
    switch (h) {
      case ",":
        e.pop(), e.push("INSIDE_ARRAY_AFTER_COMMA"), o = (Number(o) + 1).toString();
        break;
      case "]":
        s = d, e.pop(), o = i.pop();
    }
  }
  for (let h = 0; h < t.length; h++) {
    const d = t[h];
    switch (e[e.length - 1]) {
      case "ROOT":
        c(d, h, "FINISH");
        break;
      case "INSIDE_OBJECT_START":
        switch (d) {
          case '"':
            e.pop(), e.push("INSIDE_OBJECT_KEY"), o = "";
            break;
          case "}":
            s = h, e.pop(), o = i.pop();
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
        c(d, h, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      case "INSIDE_OBJECT_AFTER_VALUE":
        l(d, h);
        break;
      case "INSIDE_STRING":
        switch (d) {
          case '"':
            e.pop(), s = h, o = i.pop();
            break;
          case "\\":
            e.push("INSIDE_STRING_ESCAPE");
            break;
          default:
            s = h;
        }
        break;
      case "INSIDE_ARRAY_START":
        d === "]" ? (s = h, e.pop(), o = i.pop()) : (o = "0", c(d, h, "INSIDE_ARRAY_AFTER_VALUE"));
        break;
      case "INSIDE_ARRAY_AFTER_VALUE":
        switch (d) {
          case ",":
            e.pop(), e.push("INSIDE_ARRAY_AFTER_COMMA"), o = (Number(o) + 1).toString();
            break;
          case "]":
            s = h, e.pop(), o = i.pop();
            break;
          default:
            s = h;
        }
        break;
      case "INSIDE_ARRAY_AFTER_COMMA":
        c(d, h, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      case "INSIDE_STRING_ESCAPE": {
        e.pop();
        const p = e[e.length - 1];
        d === "u" ? (e.push("INSIDE_STRING_UNICODE_ESCAPE"), r = 0) : p === "INSIDE_STRING" && (s = h), p === "INSIDE_OBJECT_KEY" && (o += d);
        break;
      }
      case "INSIDE_STRING_UNICODE_ESCAPE": {
        const p = e[e.length - 2];
        if (!om.test(d)) {
          e.pop(), h--;
          break;
        }
        r++, r === 4 && (e.pop(), p === "INSIDE_STRING" && (s = h)), p === "INSIDE_OBJECT_KEY" && (o += d);
        break;
      }
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
          case "+":
          case ".":
            break;
          case ",":
            e.pop(), o = i.pop(), e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && u(d, h), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && l(d, h);
            break;
          case "}":
            e.pop(), o = i.pop(), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && l(d, h);
            break;
          case "]":
            e.pop(), o = i.pop(), e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && u(d, h);
            break;
          default:
            e.pop(), o = i.pop();
        }
        break;
      case "INSIDE_LITERAL": {
        const p = t.substring(n, h + 1);
        !"false".startsWith(p) && !"true".startsWith(p) && !"null".startsWith(p) ? (e.pop(), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" ? l(d, h) : e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && u(d, h)) : s = h;
        break;
      }
    }
  }
  let f = t.slice(0, s + 1);
  for (let h = e.length - 1; h >= 0; h--) switch (e[h]) {
    case "INSIDE_STRING":
      f += '"';
      break;
    case "INSIDE_OBJECT_KEY":
    case "INSIDE_OBJECT_AFTER_KEY":
    case "INSIDE_OBJECT_AFTER_COMMA":
    case "INSIDE_OBJECT_START":
    case "INSIDE_OBJECT_BEFORE_VALUE":
    case "INSIDE_OBJECT_AFTER_VALUE":
      f += "}";
      break;
    case "INSIDE_ARRAY_START":
    case "INSIDE_ARRAY_AFTER_COMMA":
    case "INSIDE_ARRAY_AFTER_VALUE":
      f += "]";
      break;
    case "INSIDE_LITERAL": {
      const d = t.substring(n, t.length);
      "true".startsWith(d) ? f += "true".slice(d.length) : "false".startsWith(d) ? f += "false".slice(d.length) : "null".startsWith(d) && (f += "null".slice(d.length));
    }
  }
  return [f, i];
}
var et = { exports: {} }, Di;
function cm() {
  if (Di) return et.exports;
  Di = 1;
  const t = typeof Buffer < "u", e = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/, s = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
  function n(a, c, l) {
    l == null && c !== null && typeof c == "object" && (l = c, c = void 0), t && Buffer.isBuffer(a) && (a = a.toString()), a && a.charCodeAt(0) === 65279 && (a = a.slice(1));
    const u = JSON.parse(a, c);
    if (u === null || typeof u != "object")
      return u;
    const f = l && l.protoAction || "error", h = l && l.constructorAction || "error";
    if (f === "ignore" && h === "ignore")
      return u;
    if (f !== "ignore" && h !== "ignore") {
      if (e.test(a) === !1 && s.test(a) === !1)
        return u;
    } else if (f !== "ignore" && h === "ignore") {
      if (e.test(a) === !1)
        return u;
    } else if (s.test(a) === !1)
      return u;
    return r(u, { protoAction: f, constructorAction: h, safe: l && l.safe });
  }
  function r(a, { protoAction: c = "error", constructorAction: l = "error", safe: u } = {}) {
    let f = [a];
    for (; f.length; ) {
      const h = f;
      f = [];
      for (const d of h) {
        if (c !== "ignore" && Object.prototype.hasOwnProperty.call(d, "__proto__")) {
          if (u === !0)
            return null;
          if (c === "error")
            throw new SyntaxError("Object contains forbidden prototype property");
          delete d.__proto__;
        }
        if (l !== "ignore" && Object.prototype.hasOwnProperty.call(d, "constructor") && d.constructor !== null && typeof d.constructor == "object" && Object.prototype.hasOwnProperty.call(d.constructor, "prototype")) {
          if (u === !0)
            return null;
          if (l === "error")
            throw new SyntaxError("Object contains forbidden prototype property");
          delete d.constructor;
        }
        for (const p in d) {
          const _ = d[p];
          _ && typeof _ == "object" && f.push(_);
        }
      }
    }
    return a;
  }
  function i(a, c, l) {
    const { stackTraceLimit: u } = Error;
    Error.stackTraceLimit = 0;
    try {
      return n(a, c, l);
    } finally {
      Error.stackTraceLimit = u;
    }
  }
  function o(a, c) {
    const { stackTraceLimit: l } = Error;
    Error.stackTraceLimit = 0;
    let u;
    try {
      u = n(a, c, { safe: !0 });
    } catch {
      u = void 0;
    } finally {
      Error.stackTraceLimit = l;
    }
    return u;
  }
  return et.exports = i, et.exports.default = i, et.exports.parse = i, et.exports.safeParse = o, et.exports.scan = r, et.exports;
}
var lm = cm();
const Hn = /* @__PURE__ */ kl(lm), Es = /* @__PURE__ */ Symbol("aui.parse-partial-json-object.meta"), zr = (t) => t?.[Es], zt = (t) => {
  if (t.length === 0) return { [Es]: {
    state: "partial",
    partialPath: []
  } };
  try {
    const e = Hn.parse(t);
    if (typeof e != "object" || e === null) throw new Error("argsText is expected to be an object");
    return e[Es] = {
      state: "complete",
      partialPath: []
    }, e;
  } catch {
    try {
      const [e, s] = am(t), n = Hn.parse(e);
      if (typeof n != "object" || n === null) throw new Error("argsText is expected to be an object");
      return n[Es] = {
        state: "partial",
        partialPath: s
      }, n;
    } catch {
      return;
    }
  }
}, Ya = (t, e, s) => {
  if (typeof t != "object" || t === null) return e.state;
  if (e.state === "complete") return "complete";
  if (s.length === 0) return e.state;
  const [n, ...r] = s;
  if (!Object.hasOwn(t, n)) return "partial";
  const [i, ...o] = e.partialPath;
  if (n !== i) return "complete";
  const a = t[n];
  return Ya(a, {
    state: "partial",
    partialPath: o
  }, r);
}, Jt = (t, e) => {
  const s = zr(t);
  if (!s) throw new Error("unable to determine object state");
  return Ya(t, s, e.map(String));
}, hs = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/, um = /^-?$|^-?(?:0|[1-9]\d*)(?:\.\d*)?$|^-?(?:0|[1-9]\d*)(?:\.\d+)?[eE][+-]?\d*$/, fs = /^[\t\n\r ]$/, dm = /^[0-9a-fA-F]$/, hm = {
  '"': '"',
  "\\": "\\",
  "/": "/",
  b: "\b",
  f: "\f",
  n: `
`,
  r: "\r",
  t: "	"
}, zn = (t) => typeof t == "object" && t !== null, Bs = (t, e, s) => {
  t[e] = s;
}, Qa = (t) => {
  if (Array.isArray(t)) return [...t];
  const e = {};
  for (const s of Object.keys(t)) e[s] = t[s];
  return e;
}, fm = (t, e, s, n) => {
  const r = (i, o) => {
    const a = n.has(i) ? i : Qa(i);
    n.add(a);
    const c = e[o];
    if (o === e.length - 1)
      return Bs(a, c, s), zn(s) && n.add(s), a;
    const l = a[c];
    if (!zn(l)) throw new Error("Invalid incremental JSON path");
    return Bs(a, c, r(l, o + 1)), a;
  };
  return r(t, 0);
}, mm = (t, e, s) => {
  const n = zt("");
  for (const i of Object.keys(t)) Bs(n, i, t[i]);
  const r = zr(n);
  return r.state = e, r.partialPath = s.map(String), n;
}, pm = (t) => {
  const e = [t];
  for (; e.length > 0; ) {
    const s = e.pop();
    for (const n of Object.keys(s)) {
      const r = s[n];
      if (!zn(r)) continue;
      const i = Qa(r);
      Bs(s, n, i), e.push(i);
    }
  }
  return t;
};
var Pi = class qt {
  text;
  mode = "start";
  root = {};
  frames = [];
  token;
  args;
  publishedArgs;
  ownedContainers;
  constructor(e) {
    this.args = e, this.publishedArgs = e;
  }
  static from(e = "", s = zt("")) {
    const n = new qt(s);
    e.length !== 0 && (n.text = {
      length: e.length,
      previous: void 0,
      value: e
    });
    const r = e.trimEnd().endsWith("}") ? zt(e) : void 0;
    return r && zr(r)?.state === "complete" ? (n.args = r, n.publishedArgs = r, n.mode = "complete", n) : (n.consumeDelta(e, !0), n.args = n.snapshot(s), n.args !== s && (n.publishedArgs = n.mode === "fallback" ? n.args : void 0), n);
  }
  get currentTextLength() {
    return this.text?.length ?? 0;
  }
  get currentArgs() {
    return this.publishedArgs ??= pm(this.args);
  }
  append(e) {
    if (e.length === 0) return this;
    if (this.currentTextLength === 0) return qt.from(e, this.args);
    if (this.mode === "complete") {
      const r = qt.from(this.accumulatedText() + e, this.args);
      return r.args === this.args && (r.publishedArgs = this.currentArgs), r;
    }
    const s = this.clone(), n = this.args;
    return s.consumeDelta(e), s.text = {
      length: (this.text?.length ?? 0) + e.length,
      previous: this.text,
      value: e
    }, s.args = s.snapshot(n), s.publishedArgs = s.args === n ? this.currentArgs : s.mode === "fallback" ? s.args : void 0, s;
  }
  clone() {
    const e = new qt(this.args);
    return e.text = this.text, e.mode = this.mode, e.root = this.root, e.frames = this.frames.map((s) => ({
      ...s,
      path: [...s.path]
    })), e.token = this.token ? {
      ...this.token,
      ..."path" in this.token && this.token.path ? { path: [...this.token.path] } : void 0
    } : void 0, e;
  }
  snapshot(e) {
    return this.mode === "fallback" ? zt(this.accumulatedText()) ?? e : this.mode === "start" ? e : mm(this.root, this.mode === "complete" ? "complete" : "partial", this.partialPath());
  }
  accumulatedText() {
    const e = [];
    for (let s = this.text; s; s = s.previous) e.push(s.value);
    return e.reverse().join("");
  }
  partialPath() {
    return this.mode === "complete" ? [] : this.token && (this.token.kind === "number" || this.token.kind === "string" && this.token.role === "value") ? this.token.path : this.frames.at(-1)?.path ?? [];
  }
  isFallback() {
    return this.mode === "fallback";
  }
  consumeDelta(e, s = !1) {
    if (!this.isFallback()) {
      this.ownedContainers = s ? /* @__PURE__ */ new Set([this.root]) : /* @__PURE__ */ new Set();
      for (const n of e)
        if (this.consumeCharacter(n), this.isFallback()) break;
      !this.isFallback() && this.token?.kind === "string" && this.token.role === "value" ? this.writeValue(this.token.path, this.token.value) : !this.isFallback() && this.token?.kind === "number" && hs.test(this.token.value) && this.writeValue(this.token.path, Number(this.token.value)), this.ownedContainers = void 0;
    }
  }
  consumeCharacter(e) {
    let s = !0;
    for (; s && this.mode !== "fallback"; ) {
      if (s = !1, this.token) {
        s = this.consumeToken(e);
        continue;
      }
      if (this.mode === "complete") {
        fs.test(e) || (this.mode = "fallback");
        continue;
      }
      if (this.mode === "start") {
        if (fs.test(e)) continue;
        if (e !== "{") {
          this.mode = "fallback";
          continue;
        }
        this.mode = "parsing", this.frames.push({
          kind: "object",
          path: [],
          state: "first-key-or-end"
        });
        continue;
      }
      const n = this.frames.at(-1);
      if (!n) {
        this.mode = "fallback";
        continue;
      }
      n.kind === "object" ? this.consumeObjectCharacter(n, e) : this.consumeArrayCharacter(n, e);
    }
  }
  consumeObjectCharacter(e, s) {
    if (!fs.test(s))
      switch (e.state) {
        case "first-key-or-end":
          s === "}" ? this.closeContainer() : s === '"' ? (e.state = "key", this.startKeyString()) : this.mode = "fallback";
          break;
        case "key":
          s === '"' ? this.startKeyString() : this.mode = "fallback";
          break;
        case "colon":
          s === ":" ? e.state = "value" : this.mode = "fallback";
          break;
        case "value":
          this.startValue(s, [...e.path, e.key]);
          break;
        case "comma-or-end":
          s === "," ? (e.state = "key", e.key = void 0) : s === "}" ? this.closeContainer() : this.mode = "fallback";
      }
  }
  consumeArrayCharacter(e, s) {
    if (!fs.test(s))
      switch (e.state) {
        case "first-value-or-end":
          s === "]" ? this.closeContainer() : (e.state = "value", this.startValue(s, [...e.path, e.index]));
          break;
        case "value":
          this.startValue(s, [...e.path, e.index]);
          break;
        case "comma-or-end":
          s === "," ? (e.index += 1, e.state = "value") : s === "]" ? this.closeContainer() : this.mode = "fallback";
      }
  }
  startValue(e, s) {
    if (e === "{")
      this.writeValue(s, {}), this.frames.push({
        kind: "object",
        path: s,
        state: "first-key-or-end"
      });
    else if (e === "[")
      this.writeValue(s, []), this.frames.push({
        kind: "array",
        path: s,
        state: "first-value-or-end",
        index: 0
      });
    else if (e === '"')
      this.writeValue(s, ""), this.startValueString(s);
    else if (e === "t" || e === "f" || e === "n") {
      const n = e === "t" ? "true" : e === "f" ? "false" : "null";
      this.writeValue(s, n === "true" ? !0 : n === "false" ? !1 : null), this.token = {
        kind: "literal",
        value: n,
        offset: 1
      };
    } else e === "-" || e >= "0" && e <= "9" ? (this.token = {
      kind: "number",
      path: s,
      value: e
    }, hs.test(e) && this.writeValue(s, Number(e))) : this.mode = "fallback";
  }
  startKeyString() {
    this.token = {
      kind: "string",
      role: "key",
      value: "",
      escape: "none",
      unicode: ""
    };
  }
  startValueString(e) {
    this.token = {
      kind: "string",
      role: "value",
      path: e,
      value: "",
      escape: "none",
      unicode: ""
    };
  }
  consumeToken(e) {
    const s = this.token;
    return s.kind === "string" ? this.consumeString(s, e) : s.kind === "number" ? this.consumeNumber(s, e) : this.consumeLiteral(s, e);
  }
  consumeString(e, s) {
    if (e.escape === "unicode")
      return dm.test(s) ? (e.unicode += s, e.unicode.length === 4 && (e.value += String.fromCharCode(Number.parseInt(e.unicode, 16)), e.escape = "none", e.unicode = ""), !1) : (this.mode = "fallback", !1);
    if (e.escape === "single") {
      if (s === "u")
        return e.escape = "unicode", !1;
      const n = hm[s];
      return n === void 0 ? this.mode = "fallback" : (e.value += n, e.escape = "none"), !1;
    }
    if (s === "\\")
      return e.escape = "single", !1;
    if (s.charCodeAt(0) < 32)
      return this.mode = "fallback", !1;
    if (s !== '"')
      return e.value += s, !1;
    if (this.token = void 0, e.role === "key") {
      const n = this.frames.at(-1);
      if (!n || n.kind !== "object")
        return this.mode = "fallback", !1;
      if (e.value === "__proto__" || e.value === "prototype" && n.path.at(-1) === "constructor")
        return this.mode = "fallback", !1;
      n.key = e.value, n.state = "colon";
    } else
      this.writeValue(e.path, e.value), this.finishValue();
    return !1;
  }
  consumeNumber(e, s) {
    if (s >= "0" && s <= "9" || s === "e" || s === "E" || s === "+" || s === "-" || s === ".") {
      const n = e.value + s;
      return um.test(n) ? (e.value = n, hs.test(e.value) && this.writeValue(e.path, Number(e.value)), !1) : (this.mode = "fallback", !1);
    }
    return hs.test(e.value) ? (this.token = void 0, this.finishValue(), !0) : (this.mode = "fallback", !1);
  }
  consumeLiteral(e, s) {
    return s !== e.value[e.offset] ? (this.mode = "fallback", !1) : (e.offset += 1, e.offset === e.value.length && (this.token = void 0, this.finishValue()), !1);
  }
  finishValue() {
    const e = this.frames.at(-1);
    if (!e || e.state !== "value") {
      this.mode = "fallback";
      return;
    }
    e.state = "comma-or-end";
  }
  closeContainer() {
    this.frames.pop(), this.frames.length === 0 ? this.mode = "complete" : this.finishValue();
  }
  writeValue(e, s) {
    try {
      this.root = fm(this.root, e, s, this.ownedContainers ?? /* @__PURE__ */ new Set());
    } catch {
      this.mode = "fallback";
    }
  }
};
let Ja = (t, e = 21) => (s = e) => {
  let n = "", r = s | 0;
  for (; r-- > 0; )
    n += t[Math.random() * t.length | 0];
  return n;
};
const gm = Ja("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7), bm = (t, e) => new ReadableStream({
  start(s) {
    return t.start?.(e(s));
  },
  pull(s) {
    return t.pull?.(e(s));
  },
  cancel(s) {
    return t.cancel?.(s);
  }
}), _m = (t, e) => {
  let s;
  return [bm({
    start(n) {
      s = n;
    },
    cancel(n) {
      return e?.(s, n);
    }
  }, t), s];
}, At = () => {
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
}, vm = () => {
  const t = [];
  let e = !1, s = !1, n = !1, r, i, o, a = 0, c, l;
  const u = (b) => {
    for (const S of b.holds) S.reached.resolve();
    b.holds = [];
  }, f = () => {
    if (i = void 0, !l) {
      const b = t.splice(0);
      for (const S of b)
        S.orderedFinish?.delivered.resolve(), u(S);
      l = Promise.all(b.map(async (S) => {
        try {
          await S.reader.cancel().catch(() => {
          }), await S.pipeTask;
        } finally {
          S.reader.releaseLock();
        }
      })).then(() => {
      });
    }
    return l;
  }, h = (b) => {
    s || n || (n = !0, console.error(b), f(), r.error(b), c?.reject(b), c = void 0);
  }, d = (b) => {
    b.promise || (b.promise = b.reader.read().then(async ({ done: S, value: I }) => {
      if (!(s || n)) {
        if (S)
          b.orderedFinish?.delivered.resolve(), t.splice(t.indexOf(b), 1), b.reader.releaseLock(), u(b), e && t.length === 0 && a === 0 && r.close();
        else {
          if (b.gate && (await b.gate, b.gate = void 0, s || n))
            return;
          for (; b.holds[0] && b.delivered >= b.holds[0].writtenBefore; )
            if (await b.holds[0].flushed, b.holds.shift(), s || n) return;
          if (I.type === "part-finish" && b.orderedFinish && (await b.orderedFinish.previous(), s || n))
            return;
          r.enqueue(I), b.delivered++;
          for (const T of b.holds) b.delivered >= T.writtenBefore && T.reached.resolve();
          I.type === "part-finish" && b.orderedFinish?.delivered.resolve();
        }
        b.promise = void 0, c?.resolve(), c = void 0;
      }
    }).catch((S) => {
      b.promise = void 0, h(S);
    }));
  }, p = new ReadableStream({
    start(b) {
      r = b;
    },
    pull() {
      return c = At(), t.forEach((b) => {
        d(b);
      }), c.promise;
    },
    async cancel() {
      s = !0;
      const b = f();
      c?.resolve(), c = void 0, await b;
    }
  }), _ = (b, S) => {
    const I = {
      writtenBefore: b.written(),
      reached: At(),
      flushed: S
    };
    return b.delivered >= I.writtenBefore && I.reached.resolve(), b.holds.push(I), I.reached.promise;
  }, v = (b) => {
    const S = b.type === "step-finish" || b.type === "message-finish" || b.type === "error";
    if ((t.length > 0 || S) && (i = void 0), !i) {
      const I = [];
      i = I, a++;
      const T = o, E = S ? t.filter((A) => A.written) : [], g = T || E.length > 0 ? At() : void 0, w = g ? E.map((A) => _(A, g.promise)) : [];
      g && (o = g.promise), Promise.resolve().then(async () => {
        if (T && await T, w.length > 0 && await Promise.all(w), a--, i === I && (i = void 0), !(s || n)) {
          for (const A of I) r.enqueue(A);
          e && t.length === 0 && a === 0 && r.close(), c?.resolve(), c = void 0;
        }
      }).catch(h).finally(() => {
        g && (g.resolve(), o === g.promise && (o = void 0));
      });
    }
    i.push(b), S && (i = void 0);
  };
  return {
    readable: p,
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
      e || s || n || (e = !0, t.length === 0 && a === 0 && r.close());
    },
    addStream: (b, S, I) => {
      const T = S?.catch(() => {
      });
      if (s || n) {
        b.cancel().catch(() => {
        });
        return;
      }
      if (e)
        throw b.cancel().catch(() => {
        }), new Error("Cannot add streams after the run callback has settled.");
      i = void 0;
      const E = {
        reader: b.getReader(),
        pipeTask: T,
        orderedFinish: I?.orderedFinish,
        written: I?.written,
        delivered: 0,
        gate: o,
        holds: []
      };
      t.push(E), d(E);
    },
    enqueue(b) {
      if (!(s || n)) {
        if (e) throw new Error("Cannot add streams after the run callback has settled.");
        v(b);
      }
    }
  };
}, Xa = (t) => t instanceof TypeError, Ne = (t, e, s) => {
  try {
    t.enqueue(e);
  } catch (n) {
    if (!Xa(n)) throw n;
    s?.(n);
  }
}, Fs = (t) => {
  try {
    t.close();
  } catch (e) {
    if (!Xa(e)) throw e;
  }
};
var Gn = class {
  _controller;
  _strict;
  _isClosed = !1;
  _ignoreAppends = !1;
  _warnedDropped = !1;
  constructor(t, e = {}) {
    this._controller = t, this._strict = e.strict ?? !0;
  }
  append(t, e) {
    if (this._ignoreAppends) return this;
    const s = {
      type: "text-delta",
      path: [],
      textDelta: t,
      ...e != null && { providerMetadata: e }
    };
    if (this._isClosed) {
      if (this._strict) throw new TypeError("Cannot append to a closed TextStreamController");
      return Ne(this._controller, s, this._warnDroppedAfterClose), this;
    }
    return Ne(this._controller, s), this;
  }
  _warnDroppedAfterClose = (t) => {
    this._warnedDropped || (this._warnedDropped = !0, console.error(`Dropped text delta for closed stream: ${String(t)}`));
  };
  close(t) {
    this._isClosed || (this._isClosed = !0, Ne(this._controller, {
      type: "part-finish",
      path: [],
      ...t != null && { providerMetadata: t }
    }), Fs(this._controller));
  }
  __internal_close() {
    this._isClosed || (this._ignoreAppends = !0, this.close());
  }
  __internal_truncate() {
    this._isClosed || (this._ignoreAppends = !0, this._isClosed = !0, Fs(this._controller));
  }
};
const Oi = /* @__PURE__ */ Symbol.for("aui.tool-response"), Wn = "<no result>";
var ze = class Yn {
  get [Oi]() {
    return !0;
  }
  artifact;
  result;
  isError;
  isPreliminary;
  modelContent;
  messages;
  constructor(e) {
    e.artifact !== void 0 && (this.artifact = e.artifact);
    const s = e.result;
    this.result = s === void 0 ? Wn : s, this.isError = e.isError ?? !1, e.isPreliminary && (this.isPreliminary = !0), e.modelContent !== void 0 && (this.modelContent = e.modelContent), e.messages !== void 0 && (this.messages = e.messages);
  }
  static [Symbol.hasInstance](e) {
    return typeof e == "object" && e !== null && Oi in e;
  }
  /**
  * Converts a plain tool return value into a {@link ToolResponse}.
  *
  * Existing `ToolResponse` instances are returned unchanged. `undefined`
  * becomes the string `"<no result>"` so downstream protocol chunks always
  * carry a concrete result.
  */
  static toResponse(e) {
    return e instanceof Yn ? e : new Yn({ result: e === void 0 ? Wn : e });
  }
}, ym = class {
  _isClosed = !1;
  _hasArgsText = !1;
  _argsTextState = "open";
  _controller;
  _argsTextController;
  _options;
  constructor(t, e = {}) {
    this._controller = t, this._options = e, this._argsTextController = new Gn({
      enqueue: (s) => {
        if (this._argsTextState !== "open") throw new TypeError("Cannot append to finished tool-call args");
        if (s.type === "text-delta") {
          this._hasArgsText = !0, this._controller.enqueue(s);
          return;
        }
        this._argsTextState = "finishing", queueMicrotask(() => this._finishArgsText());
      },
      close: () => {
      }
    }, { strict: this._options.strict });
  }
  _finishArgsText() {
    this._argsTextState === "finishing" && (this._argsTextState = "finished", this._hasArgsText || Ne(this._controller, {
      type: "text-delta",
      textDelta: "{}",
      path: []
    }), Ne(this._controller, {
      type: "tool-call-args-text-finish",
      path: []
    }));
  }
  get argsText() {
    return this._argsTextController;
  }
  async setResponse(t) {
    if (this._isClosed) return;
    const e = t.result;
    Ne(this._controller, {
      type: "result",
      path: [],
      ...t.artifact !== void 0 ? { artifact: t.artifact } : {},
      result: e === void 0 ? Wn : e,
      isError: t.isError ?? !1,
      ...t.isPreliminary ? { isPreliminary: !0 } : {},
      ...t.modelContent !== void 0 ? { modelContent: t.modelContent } : {},
      ...t.messages !== void 0 ? { messages: t.messages } : {}
    }), t.isPreliminary ? (this._argsTextController.close(), this._finishArgsText()) : await this.close();
  }
  async close() {
    this._isClosed || (this._isClosed = !0, this._options.onClose?.(), this._argsTextController.close(), this._finishArgsText(), Ne(this._controller, {
      type: "part-finish",
      path: []
    }), Fs(this._controller));
  }
  __internal_truncate() {
    this._isClosed || (this._isClosed = !0, this._finishArgsText(), this._argsTextController.__internal_truncate(), this._argsTextState = "finished", Fs(this._controller));
  }
}, Ka = class {
  value = -1;
  up() {
    return ++this.value;
  }
}, wm = class extends TransformStream {
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
var Sm = class extends TransformStream {
  constructor(t) {
    const e = new Ka(), s = /* @__PURE__ */ new Map();
    super({ transform(n, r) {
      n.type === "part-start" && n.path.length === 0 && s.set(e.up(), t.up());
      const [i, ...o] = n.path;
      if (i === void 0) {
        r.enqueue(n);
        return;
      }
      const a = s.get(i);
      if (a === void 0) throw new Error("Path not found");
      r.enqueue({
        ...n,
        path: [a, ...o]
      });
    } });
  }
};
const pn = (t) => {
  let e = 0;
  const [s, n] = _m((r) => t({
    get desiredSize() {
      return r.desiredSize;
    },
    enqueue(i) {
      r.enqueue(i), e++;
    },
    close() {
      r.close();
    },
    error(i) {
      r.error(i);
    }
  }));
  return [
    s,
    n,
    () => e
  ];
};
var xm = class Za {
  _state;
  _parentId;
  constructor(e, s = {}) {
    this._state = e || {
      strict: s.strict ?? !0,
      merger: vm(),
      contentCounter: new Ka(),
      openInputs: /* @__PURE__ */ new Set(),
      lastToolCallFinish: Promise.resolve()
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
  __internal_endOpenInputs() {
    this._state.append = void 0;
    for (const e of this._state.openInputs) e();
    this._state.openInputs.clear();
  }
  __internal_subscribeToClose(e) {
    this._state.closeSubscriber = e;
  }
  _addTransformedStream(e, s, n) {
    if (e.locked) throw new TypeError("Cannot merge a stream that is already locked to a reader.");
    const r = e.pipeTo(s.writable).catch(async (i) => {
      throw await s.writable.abort(i).catch(() => {
      }), i;
    });
    return this._state.merger.addStream(s.readable, r, n), r;
  }
  _trackOpenInput(e, s) {
    const { openInputs: n } = this._state;
    n.add(s);
    const r = () => n.delete(s);
    e.then(r, r);
  }
  _addPart(e, s, n, r, i) {
    this._state.append && (this._state.append.controller.close(), this._state.append = void 0), this.enqueue({
      type: "part-start",
      part: e,
      path: []
    });
    const o = this._addTransformedStream(s, new wm(this._state.contentCounter.value), {
      orderedFinish: i,
      written: n
    });
    r && this._trackOpenInput(o, r);
  }
  merge(e) {
    this._addTransformedStream(e, new Sm(this._state.contentCounter));
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
  addTextPart(e) {
    const [s, n, r] = pn((i) => new Gn(i, { strict: this._state.strict }));
    return this._addPart(this._withParentIdOption({
      type: "text",
      ...e
    }), s, r, () => n.__internal_close()), n;
  }
  addReasoningPart(e) {
    const [s, n, r] = pn((i) => new Gn(i, { strict: this._state.strict }));
    return this._addPart(this._withParentIdOption({
      type: "reasoning",
      ...e
    }), s, r, () => n.__internal_close()), n;
  }
  addToolCallPart(e) {
    const s = typeof e == "string" ? { toolName: e } : e, n = s.toolName, r = s.toolCallId ?? gm(), i = At();
    let o = Promise.resolve();
    const [a, c, l] = pn((u) => new ym(u, {
      strict: this._state.strict,
      onClose: () => {
        o = this._state.lastToolCallFinish, this._state.lastToolCallFinish = i.promise;
      }
    }));
    return this._addPart({
      type: "tool-call",
      toolName: n,
      toolCallId: r,
      ...this._parentId && { parentId: this._parentId }
    }, a, l, () => c.__internal_truncate(), {
      previous: () => o,
      delivered: i
    }), s.argsText !== void 0 && (c.argsText.append(s.argsText), c.argsText.close()), s.args !== void 0 && (c.argsText.append(JSON.stringify(s.args)), c.argsText.close()), s.response !== void 0 && c.setResponse(s.response), c;
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
    this._addPart(this._withParentIdOption(e), this._finishedPartStream(), () => 1);
  }
  appendFile(e) {
    this._addPart(this._withParentIdOption(e), this._finishedPartStream(), () => 1);
  }
  appendData(e) {
    this._addPart(this._withParentIdOption(e), this._finishedPartStream(), () => 1);
  }
  enqueue(e) {
    this._state.merger.enqueue(e), e.type === "part-start" && e.path.length === 0 && this._state.contentCounter.up();
  }
  withParentId(e) {
    const s = new Za(this._state);
    return s._parentId = e, s;
  }
  close() {
    this._state.append?.controller?.close(), this._state.merger.seal(), this._state.closeSubscriber?.();
  }
};
function Im(t, e = {}) {
  const s = new xm(void 0, e);
  return (async () => {
    try {
      await t(s);
    } catch (r) {
      s.__internal_isClosed ? s.__internal_isCancelled || console.error(r) : (s.enqueue({
        type: "error",
        path: [],
        error: String(r)
      }), s.__internal_endOpenInputs());
    } finally {
      s.__internal_isClosed || s.close();
    }
  })(), s.__internal_getReadable();
}
function Tm(t = {}) {
  const { resolve: e, promise: s } = At();
  let n;
  return [Im((r) => (n = r, n.__internal_subscribeToClose(e), s), t), n];
}
var ec = class extends TransformStream {
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
const Cm = Ye(null), Em = () => Qs(Cm), dt = Ja("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);
function Am(t) {
  const e = t.match(/^data:([^;,]+)(?:;[^;,]+)*;base64,(.*)$/i);
  return e ? {
    mimeType: e[1].toLowerCase(),
    data: e[2]
  } : null;
}
const gn = (t, e) => {
  if (t.startsWith("data-"))
    return {
      type: "data",
      name: t.substring(5),
      data: e
    };
}, Ls = (t, e, s) => {
  const { role: n, id: r, createdAt: i, attachments: o, status: a, metadata: c } = t, l = {
    id: r ?? e,
    createdAt: i ?? /* @__PURE__ */ new Date()
  }, u = typeof t.content == "string" ? [{
    type: "text",
    text: t.content
  }] : t.content, f = ({ image: h, ...d }) => typeof h != "string" ? null : Am(h)?.mimeType.startsWith("image/") ? {
    ...d,
    image: h
  } : /^(https:\/\/|blob:)/i.test(h) ? {
    ...d,
    image: h
  } : (console.warn("Invalid image data format detected"), null);
  if (n !== "user" && o?.length) throw new Error("attachments are only supported for user messages");
  if (n !== "assistant" && a) throw new Error("status is only supported for assistant messages");
  if (n !== "assistant" && c?.steps) throw new Error("metadata.steps is only supported for assistant messages");
  switch (n) {
    case "assistant":
      return {
        ...l,
        role: n,
        content: u.map((h) => {
          const d = h.type;
          switch (d) {
            case "text":
              return h.text?.trim() ? h : null;
            case "reasoning":
              return !h.text?.trim() && !h.unstable_summary?.trim() ? null : h;
            case "file":
            case "source":
              return h;
            case "image":
              return f(h);
            case "data":
              return h;
            case "generative-ui":
              return h;
            case "tool-call": {
              const { parentId: p, messages: _, ...v } = h, C = {
                ...v,
                toolCallId: h.toolCallId ?? `tool-${dt()}`,
                ...p !== void 0 && { parentId: p },
                ..._ !== void 0 && { messages: _ }
              };
              return h.args ? {
                ...C,
                args: h.args,
                argsText: h.argsText ?? JSON.stringify(h.args)
              } : {
                ...C,
                args: zt(h.argsText ?? "") ?? {},
                argsText: h.argsText ?? ""
              };
            }
            default: {
              const p = gn(d, h.data);
              if (p) return p;
              throw new Error(`Unsupported assistant message part type: ${d}`);
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
          const d = h.type;
          switch (d) {
            case "text":
            case "image":
            case "audio":
            case "file":
            case "data":
              return h;
            default: {
              const p = gn(d, h.data);
              if (p) return p;
              throw new Error(`Unsupported user message part type: ${d}`);
            }
          }
        }),
        attachments: (o ?? []).map((h) => ({
          ...h,
          content: h.content.map((d) => gn(d.type, d.data) ?? d)
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
}, ht = /* @__PURE__ */ Symbol("innerMessage"), bn = /* @__PURE__ */ Symbol("innerMessages"), Rm = [], Mm = (t, e) => {
  ht in t || (t[ht] = e);
}, km = (t) => {
  const e = "messages" in t ? t.messages : t, s = e[bn] || e[ht];
  return s ? Array.isArray(s) ? s : (e[bn] = [s], e[bn]) : Rm;
}, Pt = /* @__PURE__ */ Symbol("autoStatus"), Dm = Object.freeze(Object.assign({ type: "running" }, { [Pt]: !0 })), Pm = Object.freeze(Object.assign({
  type: "complete",
  reason: "unknown"
}, { [Pt]: !0 }));
Object.freeze(Object.assign({
  type: "requires-action",
  reason: "tool-calls"
}, { [Pt]: !0 }));
Object.freeze(Object.assign({
  type: "requires-action",
  reason: "interrupt"
}, { [Pt]: !0 }));
const Om = (t) => t[Pt] === !0, Qn = (t, e, s, n, r) => t && r ? Object.assign({
  type: "incomplete",
  reason: "error",
  error: r
}, { [Pt]: !0 }) : t && e ? Dm : Pm;
var Ni = class {
  cache = /* @__PURE__ */ new WeakMap();
  convertMessages(t, e) {
    return t.map((s, n) => {
      const r = e(this.cache.get(s), s, n);
      return this.cache.set(s, r), r;
    });
  }
}, Nm = class extends TransformStream {
  constructor(t) {
    super();
    const e = t(super.readable);
    Object.defineProperty(this, "readable", {
      value: e,
      writable: !1
    });
  }
};
function $m(t, e, s) {
  try {
    const n = t();
    if (typeof n == "object" && n !== null && "then" in n) return n.then(e, s);
    e(n);
  } catch (n) {
    s(n);
  }
}
function Xt(t, e) {
  let s = t;
  for (const n of e) {
    if (s == null || !Object.hasOwn(s, n)) return;
    s = s[n];
  }
  return s;
}
var Bm = class {
  resolve;
  reject;
  disposed = !1;
  fieldPath;
  get isDisposed() {
    return this.disposed;
  }
  constructor(t, e, s) {
    this.resolve = t, this.reject = e, this.fieldPath = s;
  }
  update(t) {
    if (!this.disposed)
      try {
        if (Jt(t, this.fieldPath) === "complete") {
          const e = Xt(t, this.fieldPath);
          e !== void 0 && (this.resolve(e), this.dispose());
        }
      } catch (e) {
        this.reject(e), this.dispose();
      }
  }
  end(t) {
    if (!this.disposed)
      try {
        const e = Xt(t, this.fieldPath);
        this.resolve(e);
      } catch (e) {
        this.reject(e);
      } finally {
        this.dispose();
      }
  }
  error(t) {
    this.disposed || (this.reject(t), this.dispose());
  }
  dispose() {
    this.disposed = !0;
  }
}, Fm = class {
  controller;
  disposed = !1;
  fieldPath;
  get isDisposed() {
    return this.disposed;
  }
  constructor(t, e) {
    this.controller = t, this.fieldPath = e;
  }
  update(t) {
    if (!this.disposed)
      try {
        const e = Xt(t, this.fieldPath);
        e !== void 0 && this.controller.enqueue(e), Jt(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
      } catch (e) {
        this.controller.error(e), this.dispose();
      }
  }
  end() {
    this.disposed || (this.controller.close(), this.dispose());
  }
  error(t) {
    this.disposed || (this.controller.error(t), this.dispose());
  }
  dispose() {
    this.disposed = !0;
  }
}, Lm = class {
  controller;
  disposed = !1;
  fieldPath;
  lastValue = void 0;
  get isDisposed() {
    return this.disposed;
  }
  constructor(t, e) {
    this.controller = t, this.fieldPath = e;
  }
  update(t) {
    if (!this.disposed)
      try {
        const e = Xt(t, this.fieldPath);
        if (e !== void 0 && typeof e == "string") {
          const s = e.substring(this.lastValue?.length || 0);
          this.lastValue = e, this.controller.enqueue(s);
        }
        Jt(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
      } catch (e) {
        this.controller.error(e), this.dispose();
      }
  }
  end() {
    this.disposed || (this.controller.close(), this.dispose());
  }
  error(t) {
    this.disposed || (this.controller.error(t), this.dispose());
  }
  dispose() {
    this.disposed = !0;
  }
}, Vm = class {
  controller;
  disposed = !1;
  fieldPath;
  nextIndex = 0;
  get isDisposed() {
    return this.disposed;
  }
  constructor(t, e) {
    this.controller = t, this.fieldPath = e;
  }
  update(t) {
    if (!this.disposed)
      try {
        const e = Xt(t, this.fieldPath);
        if (!Array.isArray(e)) return;
        for (; this.nextIndex < e.length; this.nextIndex++) {
          const s = [...this.fieldPath, this.nextIndex];
          if (Jt(t, s) !== "complete") break;
          this.controller.enqueue(e[this.nextIndex]);
        }
        Jt(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
      } catch (e) {
        this.controller.error(e), this.dispose();
      }
  }
  end() {
    this.disposed || (this.controller.close(), this.dispose());
  }
  error(t) {
    this.disposed || (this.controller.error(t), this.dispose());
  }
  dispose() {
    this.disposed = !0;
  }
}, jm = class {
  argTextDeltas;
  handles = /* @__PURE__ */ new Set();
  accumulatedText = "";
  parser;
  args = void 0;
  finished = !1;
  failure = void 0;
  constructor(t) {
    this.argTextDeltas = t, this.processStream();
  }
  async processStream() {
    try {
      const t = this.argTextDeltas.getReader();
      for (; ; ) {
        const { value: e, done: s } = await t.read();
        if (s) break;
        this.accumulatedText += e, this.handles.size !== 0 && this.parseCurrentArgs(e) && this.updateHandles();
      }
    } catch (t) {
      this.failure = { reason: t };
    } finally {
      this.finished = !0;
      for (const t of this.handles) this.settleHandle(t);
      this.handles.clear();
    }
  }
  settleHandle(t) {
    this.failure ? t.error(this.failure.reason) : t.end(this.args);
  }
  parseCurrentArgs(t) {
    if (this.parser?.currentTextLength === this.accumulatedText.length) return !1;
    const e = this.args;
    return this.parser ? t !== void 0 && this.parser.currentTextLength + t.length === this.accumulatedText.length ? this.parser = this.parser.append(t) : this.parser = Pi.from(this.accumulatedText, this.args) : this.parser = Pi.from(this.accumulatedText, this.args), this.args = this.parser.currentArgs, this.args !== e;
  }
  updateHandles() {
    for (const t of this.handles)
      t.update(this.args), t.isDisposed && this.handles.delete(t);
  }
  activateHandle(t) {
    if (this.parseCurrentArgs(), t.update(this.args), !t.isDisposed) {
      if (this.finished) {
        this.settleHandle(t);
        return;
      }
      this.handles.add(t);
    }
  }
  get(...t) {
    return new Promise((e, s) => {
      const n = new Bm(e, s, t);
      this.activateHandle(n);
    });
  }
  streamValues(...t) {
    const e = t;
    let s;
    const n = new ReadableStream({
      start: (r) => {
        s = new Fm(r, e), this.activateHandle(s);
      },
      cancel: () => {
        s && (s.dispose(), this.handles.delete(s));
      }
    });
    return mn(n);
  }
  streamText(...t) {
    const e = t;
    let s;
    const n = new ReadableStream({
      start: (r) => {
        s = new Lm(r, e), this.activateHandle(s);
      },
      cancel: () => {
        s && (s.dispose(), this.handles.delete(s));
      }
    });
    return mn(n);
  }
  forEach(...t) {
    const e = t;
    let s;
    const n = new ReadableStream({
      start: (r) => {
        s = new Vm(r, e), this.activateHandle(s);
      },
      cancel: () => {
        s && (s.dispose(), this.handles.delete(s));
      }
    });
    return mn(n);
  }
}, qm = class {
  promise;
  constructor(t) {
    this.promise = t;
  }
  get() {
    return this.promise;
  }
}, Um = class {
  args;
  response;
  writable;
  resolve;
  argsText = "";
  constructor() {
    const t = new TransformStream();
    this.writable = t.writable, this.args = new jm(t.readable);
    const { promise: e, resolve: s } = At();
    this.resolve = s, this.response = new qm(e);
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
const Hm = /* @__PURE__ */ Symbol.for("assistant-stream.tool-execution-id"), _n = (t, e, s, n, r) => {
  try {
    const i = e?.(s, n, r);
    Promise.resolve(i).catch((o) => {
      console.error(`[assistant-stream] ${t} callback threw an error`, o);
    });
  } catch (i) {
    console.error(`[assistant-stream] ${t} callback threw an error`, i);
  }
}, St = (t) => t.join(","), vn = (t, e) => {
  const s = { ...t };
  return Object.defineProperty(s, Hm, {
    value: e,
    enumerable: !0
  }), s;
};
var zm = class extends Nm {
  constructor(t) {
    const e = t, s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map();
    let o = 0;
    super((a) => {
      const c = new TransformStream({
        async transform(l, u) {
          const f = i.get(St(l.path));
          switch ((l.type !== "part-finish" || l.meta.type !== "tool-call") && u.enqueue(f ? vn(l, f) : l), l.type) {
            case "part-start": {
              const h = o;
              if (o += 1, l.part.type === "tool-call") {
                const d = new Um(), p = /* @__PURE__ */ Symbol();
                i.set(String(h), p), n.set(p, d);
                const _ = e.streamCall({
                  reader: d,
                  toolCallId: l.part.toolCallId,
                  toolName: l.part.toolName,
                  executionId: p
                });
                _ && Promise.resolve(_).catch((v) => {
                  console.error("[assistant-stream] streamCall callback threw an error", v);
                });
              }
              break;
            }
            case "text-delta":
              if (l.meta.type === "tool-call") {
                const h = i.get(St(l.path)), d = h ? n.get(h) : void 0;
                if (!d) throw new Error("No controller found for tool call");
                await d.appendArgsTextDelta(l.textDelta);
              }
              break;
            case "result": {
              if (l.meta.type !== "tool-call") break;
              const h = i.get(St(l.path)), d = h ? n.get(h) : void 0;
              if (!d) throw new Error("No controller found for tool call");
              if (r.add(h), l.isPreliminary) break;
              d.setResponse(new ze({
                result: l.result,
                artifact: l.artifact,
                isError: l.isError,
                modelContent: l.modelContent,
                messages: l.messages
              }));
              break;
            }
            case "tool-call-args-text-finish": {
              if (l.meta.type !== "tool-call") break;
              const { toolCallId: h, toolName: d } = l.meta, p = i.get(St(l.path)), _ = p ? n.get(p) : void 0;
              if (!_) throw new Error("No controller found for tool call");
              if (await _.finishArgsText(), r.has(p)) break;
              let v = !1;
              const C = $m(() => {
                let b;
                try {
                  b = Hn.parse(_.argsText);
                } catch (I) {
                  throw new Error(`Function parameter parsing failed. ${JSON.stringify(I.message)}`);
                }
                const S = e.execute({
                  toolCallId: h,
                  toolName: d,
                  args: b,
                  executionId: p
                });
                return S !== void 0 && (v = !0, _n("onExecutionStart", e.onExecutionStart, h, d, p)), S;
              }, (b) => {
                if (v && _n("onExecutionEnd", e.onExecutionEnd, h, d, p), b === void 0) return;
                const S = new ze({
                  artifact: b.artifact,
                  result: b.result,
                  isError: b.isError,
                  messages: b.messages,
                  modelContent: b.modelContent
                });
                _.setResponse(S), Ne(u, vn({
                  type: "result",
                  path: l.path,
                  ...S
                }, p));
              }, (b) => {
                v && _n("onExecutionEnd", e.onExecutionEnd, h, d, p);
                const S = new ze({
                  result: String(b),
                  isError: !0
                });
                _.setResponse(S), Ne(u, vn({
                  type: "result",
                  path: l.path,
                  ...S
                }, p));
              });
              C && s.set(p, C);
              break;
            }
            case "part-finish": {
              if (l.meta.type !== "tool-call") break;
              const h = i.get(St(l.path)), d = h ? s.get(h) : void 0, p = () => {
                h && (s.delete(h), n.delete(h), r.delete(h), i.delete(St(l.path)));
              };
              d ? d.then(() => {
                p(), Ne(u, l);
              }) : (p(), u.enqueue(l));
            }
          }
        },
        async flush() {
          await Promise.all(s.values());
        }
      });
      return a.pipeThrough(new ec()).pipeThrough(c);
    });
  }
};
const tc = /* @__PURE__ */ Symbol.for("assistant-stream.tool-execution-id"), Vs = /* @__PURE__ */ Symbol("assistant-stream.tool-aborted"), Gm = (t) => typeof t == "object" && t !== null && "~standard" in t && t["~standard"].version === 1, Wm = (t) => typeof t?.then == "function", $i = async (t, e, s = !1) => {
  let n;
  const r = new Promise((i) => {
    n = () => {
      s ? queueMicrotask(() => queueMicrotask(() => i(Vs))) : i(Vs);
    }, e.aborted ? n() : e.addEventListener("abort", n, { once: !0 });
  });
  try {
    return await Promise.race([t, r]);
  } finally {
    e.removeEventListener("abort", n);
  }
}, ms = () => new ze({
  result: "Tool execution was cancelled.",
  isError: !0
});
function Ym(t, e, s, n) {
  const r = t?.[s.toolName];
  return r?.execute ? (async (o) => {
    if (e.aborted) return ms();
    let a = o, c = s.args;
    if (Gm(r.parameters)) {
      const f = r.parameters["~standard"].validate(s.args), h = Wm(f) ? await $i(f, e) : f;
      if (h === Vs) return ms();
      h.issues ? a = r.experimental_onSchemaValidationError ?? (() => {
        throw new Error(`Function parameter validation failed. ${JSON.stringify(h.issues)}`);
      }) : c = h.value;
    }
    if (e.aborted) return ms();
    const l = (async () => {
      const f = {
        toolCallId: s.toolCallId,
        abortSignal: e,
        human: (p) => n(s.toolCallId, p, s.executionId),
        [tc]: s.executionId
      }, h = await a(c, f), d = ze.toResponse(h);
      if (r.toModelOutput && !d.isError && d.modelContent === void 0) try {
        const p = await r.toModelOutput({
          toolCallId: s.toolCallId,
          input: c,
          output: d.result
        });
        return new ze({
          result: d.result,
          artifact: d.artifact,
          isError: d.isError,
          messages: d.messages,
          modelContent: p
        });
      } catch (p) {
        console.warn(`[assistant-stream] tool "${s.toolName}" toModelOutput threw; falling back to default projection.`, p);
      }
      return d;
    })(), u = await $i(l, e, !0);
    return u === Vs ? ms() : u;
  })(r.execute) : void 0;
}
function Qm(t, e, s, n, r) {
  const i = {
    toolCallId: n.toolCallId,
    abortSignal: e,
    human: (o) => r(n.toolCallId, o, n.executionId),
    [tc]: n.executionId
  };
  return t?.[n.toolName]?.streamCall?.(s, i);
}
function Jm(t, e, s, n) {
  const r = typeof t == "function" ? t : () => t, i = typeof e == "function" ? e : () => e, o = n, a = s, c = {
    execute: (l) => Ym(r(), i(), l, a),
    streamCall: ({ reader: l, ...u }) => Qm(r(), i(), l, u, a),
    onExecutionStart: o?.onExecutionStart,
    onExecutionEnd: o?.onExecutionEnd
  };
  return new zm(c);
}
const sc = (t) => {
  const e = x(6), { index: s, children: n } = t, r = re();
  let i;
  e[0] !== s ? (i = Ve({ attachment: ke({
    source: "message",
    query: {
      type: "index",
      index: s
    },
    get: (c) => c.message.attachment({ index: s })
  }) }), e[0] = s, e[1] = i) : i = e[1];
  const o = i;
  let a;
  return e[2] !== r || e[3] !== n || e[4] !== o ? (a = /* @__PURE__ */ m(Je, {
    extends: r,
    config: o,
    children: n
  }), e[2] = r, e[3] = n, e[4] = o, e[5] = a) : a = e[5], a;
}, nc = (t) => {
  const e = x(6), { index: s, children: n } = t, r = re();
  let i;
  e[0] !== s ? (i = Ve({
    message: ke({
      source: "thread",
      query: {
        type: "index",
        index: s
      },
      get: (c) => c.thread.message({ index: s })
    }),
    composer: ke({
      source: "message",
      query: {},
      get: (c) => c.thread.message({ index: s }).composer()
    })
  }), e[0] = s, e[1] = i) : i = e[1];
  const o = i;
  let a;
  return e[2] !== r || e[3] !== n || e[4] !== o ? (a = /* @__PURE__ */ m(Je, {
    extends: r,
    config: o,
    children: n
  }), e[2] = r, e[3] = n, e[4] = o, e[5] = a) : a = e[5], a;
}, Gr = (t) => {
  const e = x(6), { index: s, children: n } = t, r = re();
  let i;
  e[0] !== s ? (i = Ve({ part: ke({
    source: "message",
    query: {
      type: "index",
      index: s
    },
    get: (c) => c.message.part({ index: s })
  }) }), e[0] = s, e[1] = i) : i = e[1];
  const o = i;
  let a;
  return e[2] !== r || e[3] !== n || e[4] !== o ? (a = /* @__PURE__ */ m(Je, {
    extends: r,
    config: o,
    children: n
  }), e[2] = r, e[3] = n, e[4] = o, e[5] = a) : a = e[5], a;
}, Xm = (t) => {
  const e = x(7), { text: s, isRunning: n } = t;
  let r;
  e[0] !== n ? (r = n ? { type: "running" } : { type: "complete" }, e[0] = n, e[1] = r) : r = e[1];
  let i;
  e[2] !== r || e[3] !== s ? (i = {
    type: "text",
    text: s,
    status: r
  }, e[2] = r, e[3] = s, e[4] = i) : i = e[4];
  const o = i;
  let a;
  return e[5] !== o ? (a = {
    getState: () => o,
    addToolResult: Zm,
    resumeToolCall: ep,
    respondToToolApproval: tp
  }, e[5] = o, e[6] = a) : a = e[6], a;
}, Km = ce(Xm), Wr = (t) => {
  const e = x(7), { text: s, isRunning: n, children: r } = t, i = n === void 0 ? !1 : n, o = re();
  let a;
  e[0] !== i || e[1] !== s ? (a = Ve({ part: Km({
    text: s,
    isRunning: i
  }) }), e[0] = i, e[1] = s, e[2] = a) : a = e[2];
  const c = a;
  let l;
  return e[3] !== o || e[4] !== r || e[5] !== c ? (l = /* @__PURE__ */ m(Je, {
    extends: o,
    config: c,
    children: r
  }), e[3] = o, e[4] = r, e[5] = c, e[6] = l) : l = e[6], l;
};
function Zm() {
  throw new Error("Not supported");
}
function ep() {
  throw new Error("Not supported");
}
function tp() {
  throw new Error("Not supported");
}
const He = Object.freeze({ type: "complete" }), Jn = Object.freeze({ type: "running" }), sp = Object.freeze({
  cancelled: Object.freeze({
    type: "incomplete",
    reason: "cancelled"
  }),
  length: Object.freeze({
    type: "incomplete",
    reason: "length"
  }),
  "content-filter": Object.freeze({
    type: "incomplete",
    reason: "content-filter"
  }),
  other: Object.freeze({
    type: "incomplete",
    reason: "other"
  }),
  error: Object.freeze({
    type: "incomplete",
    reason: "error"
  })
}), np = (t) => {
  const e = t.status;
  if (!e || typeof e != "object") return;
  const { type: s } = e;
  if (s === "running") return Jn;
  if (s === "complete") return He;
  if (s !== "incomplete") return;
  const { reason: n } = e;
  return sp[n === "cancelled" || n === "length" || n === "content-filter" || n === "other" || n === "error" ? n : "other"];
}, rp = (t, e, s) => {
  if (t.role !== "assistant") return He;
  if (s.type === "tool-call")
    return s.result === void 0 ? t.status : He;
  if (t.status.type === "running") {
    const r = np(s);
    if (r) return r;
  }
  const n = e === Math.max(0, t.content.length - 1);
  return t.status.type === "requires-action" ? He : n ? t.status : He;
}, rc = (t, e) => {
  if (e) {
    for (const n of e) if (t[n]?.status.type === "running") return Jn;
    const s = e.at(-1);
    return s === void 0 ? He : t[s]?.status ?? He;
  }
  for (const s of t) if (s?.status.type === "running") return Jn;
  return t.at(-1)?.status ?? He;
}, ip = (t) => {
  const e = x(11), { parts: s, getMessagePart: n } = t, [r, i] = ue(!0);
  let o;
  e[0] !== s ? (o = rc(s), e[0] = s, e[1] = o) : o = e[1];
  const a = o;
  let c;
  e[2] !== r || e[3] !== s || e[4] !== a ? (c = {
    parts: s,
    collapsed: r,
    status: a
  }, e[2] = r, e[3] = s, e[4] = a, e[5] = c) : c = e[5];
  const l = c;
  let u;
  e[6] !== l ? (u = () => l, e[6] = l, e[7] = u) : u = e[7];
  let f;
  return e[8] !== n || e[9] !== u ? (f = {
    getState: u,
    setCollapsed: i,
    part: n
  }, e[8] = n, e[9] = u, e[10] = f) : f = e[10], f;
}, op = ce(ip), ap = (t) => {
  const e = x(4), { startIndex: s, endIndex: n, children: r } = t, i = D(cp).slice(s, n + 1), o = re(), a = Ve({ chainOfThought: op({
    parts: i,
    getMessagePart: (l) => {
      const { index: u } = l;
      if (u < 0 || u >= i.length) throw new Error(`ChainOfThought part index ${u} is out of bounds (0..${i.length - 1})`);
      return o.message.part({ index: s + u });
    }
  }) });
  let c;
  return e[0] !== r || e[1] !== a || e[2] !== o ? (c = /* @__PURE__ */ m(Je, {
    extends: o,
    config: a,
    children: r
  }), e[0] = r, e[1] = a, e[2] = o, e[3] = c) : c = e[3], c;
};
function cp(t) {
  return t.message.parts;
}
const ic = (t) => {
  const e = x(6), { index: s, children: n } = t, r = re();
  let i;
  e[0] !== s ? (i = Ve({ suggestion: ke({
    source: "suggestions",
    query: { index: s },
    get: (c) => c.suggestions.suggestion({ index: s })
  }) }), e[0] = s, e[1] = i) : i = e[1];
  const o = i;
  let a;
  return e[2] !== r || e[3] !== n || e[4] !== o ? (a = /* @__PURE__ */ m(Je, {
    extends: r,
    config: o,
    children: n
  }), e[2] = r, e[3] = n, e[4] = o, e[5] = a) : a = e[5], a;
}, lp = /* @__PURE__ */ Symbol.for("assistant-ui.message-not-sent"), oc = (t) => typeof t == "object" && t !== null && lp in t;
var ac = class {
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
}, cc = class extends ac {
  _composerApi;
  constructor(t, e) {
    super(t), this._composerApi = e;
  }
  remove() {
    const t = this._composerApi.getState();
    if (!t) throw new Error("Composer is not available");
    return t.removeAttachment(this.getState().id);
  }
}, up = class extends cc {
  get source() {
    return "thread-composer";
  }
}, dp = class extends cc {
  get source() {
    return "edit-composer";
  }
}, hp = class extends ac {
  get source() {
    return "message";
  }
  remove() {
    throw new Error("Message attachments cannot be removed");
  }
};
const js = Object.freeze([]), lc = Object.freeze({}), fp = (t) => Object.freeze({
  type: "thread",
  isEditing: t?.isEditing ?? !1,
  canCancel: t?.canCancel ?? !1,
  canSend: t?.canSend ?? !1,
  isEmpty: t?.isEmpty ?? !0,
  attachments: t?.attachments ?? js,
  text: t?.text ?? "",
  role: t?.role ?? "user",
  runConfig: t?.runConfig ?? lc,
  attachmentAccept: t?.attachmentAccept ?? "",
  dictation: t?.dictation,
  quote: t?.quote,
  queue: t?.queue ?? js,
  value: t?.text ?? ""
}), mp = (t) => Object.freeze({
  type: "edit",
  isEditing: t?.isEditing ?? !1,
  canCancel: t?.canCancel ?? !1,
  canSend: t?.canSend ?? !1,
  isEmpty: t?.isEmpty ?? !0,
  text: t?.text ?? "",
  role: t?.role ?? "user",
  attachments: t?.attachments ?? js,
  runConfig: t?.runConfig ?? lc,
  attachmentAccept: t?.attachmentAccept ?? "",
  dictation: t?.dictation,
  quote: t?.quote,
  queue: t?.queue ?? js,
  parentId: t?.parentId ?? null,
  sourceId: t?.sourceId ?? null,
  value: t?.text ?? ""
});
var uc = class {
  get path() {
    return this._core.path;
  }
  _core;
  constructor(t) {
    this._core = t;
  }
  __internal_bindMethods() {
    this.setText = this.setText.bind(this), this.setRunConfig = this.setRunConfig.bind(this), this.getState = this.getState.bind(this), this.subscribe = this.subscribe.bind(this), this.addAttachment = this.addAttachment.bind(this), this.reset = this.reset.bind(this), this.clearAttachments = this.clearAttachments.bind(this), this.send = this.send.bind(this), this.cancel = this.cancel.bind(this), this.steerQueueItem = this.steerQueueItem.bind(this), this.moveQueueItem = this.moveQueueItem.bind(this), this.removeQueueItem = this.removeQueueItem.bind(this), this.setRole = this.setRole.bind(this), this.getAttachmentByIndex = this.getAttachmentByIndex.bind(this), this.startDictation = this.startDictation.bind(this), this.stopDictation = this.stopDictation.bind(this), this.setQuote = this.setQuote.bind(this), this.unstable_on = this.unstable_on.bind(this);
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
    this.moveQueueItem(t, {
      lane: "steer",
      insertAfter: null
    });
  }
  moveQueueItem(t, e) {
    const s = this._core.getState();
    if (!s) throw new Error("Composer is not available");
    s.moveQueueItem(t, e);
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
    return s || (s = new va({
      event: t,
      binding: this._core
    }), this._eventSubscriptionSubjects.set(t, s)), s.subscribe(e);
  }
}, pp = class extends uc {
  get path() {
    return this._core.path;
  }
  get type() {
    return "thread";
  }
  _getState;
  constructor(t) {
    const e = new $r({
      path: t.path,
      getState: () => fp(t.getState()),
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
    return new up(new Me({
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
        } : Pe;
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
}, gp = class extends uc {
  get path() {
    return this._core.path;
  }
  get type() {
    return "edit";
  }
  _getState;
  _beginEdit;
  constructor(t, e) {
    const s = new $r({
      path: t.path,
      getState: () => mp(t.getState()),
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
    return new dp(new Me({
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
        } : Pe;
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
};
const nn = (t) => t.content.filter((e) => e.type === "text").map((e) => e.text).join(`

`), Bi = {
  "allow-once": !0,
  "allow-always": !0,
  "reject-once": !1,
  "reject-always": !1
}, bp = (t, e) => {
  let s, n;
  if ("optionId" in e) {
    const r = t.options?.find((i) => i.id === e.optionId);
    if (!r) throw new Error(`Tool approval has no option with id "${e.optionId}"`);
    if ("approved" in e) s = e.approved;
    else {
      if (!Object.hasOwn(Bi, r.kind)) throw new Error(`Tool approval option "${r.id}" has a custom kind "${r.kind}"; respond with an explicit approved value instead`);
      s = Bi[r.kind];
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
var Fi = class {
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
    const n = e.toolName, r = e.toolCallId, i = ze.toResponse(t);
    this.threadApi.getState().addToolResult({
      messageId: s.id,
      toolName: n,
      toolCallId: r,
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
    this.threadApi.getState().respondToToolApproval(bp(e.approval, t));
  }
  subscribe(t) {
    return this.contentBinding.subscribe(t);
  }
};
const Li = (t, e) => {
  const s = t.content[e];
  if (!s) return Pe;
  const n = rp(t, e, s);
  return Object.freeze({
    ...s,
    [ht]: s[ht],
    status: n
  });
};
var _p = class {
  get path() {
    return this._core.path;
  }
  _core;
  _threadBinding;
  constructor(t, e) {
    this._core = t, this._threadBinding = e, this.composer = new gp(new Ds({
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
    const e = this._getEditComposerRuntimeCore(), s = e ?? this._threadBinding.getState().composer, n = e ?? s, { runConfig: r = n.runConfig } = t, i = this._core.getState();
    if (i.role !== "assistant") throw new Error("Can only reload assistant messages");
    this._threadBinding.getState().startRun({
      parentId: i.parentId,
      sourceId: i.id,
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
    return nn(this.getState());
  }
  subscribe(t) {
    return this._core.subscribe(t);
  }
  getMessagePartByIndex(t) {
    if (t < 0) throw new Error("Message part index must be >= 0");
    return new Fi(new Me({
      path: {
        ...this.path,
        ref: `${this.path.ref}.content[${t}]`,
        messagePartSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => Li(this.getState(), t),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core, this._threadBinding);
  }
  getMessagePartByToolCallId(t) {
    return new Fi(new Me({
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
        return s === -1 ? Pe : Li(e, s);
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core, this._threadBinding);
  }
  getAttachmentByIndex(t) {
    return new hp(new Me({
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
        } : Pe;
      },
      subscribe: (e) => this._core.subscribe(e)
    }));
  }
};
const vp = (t) => ({
  parentId: t.parentId ?? null,
  sourceId: t.sourceId ?? null,
  runConfig: t.runConfig ?? {},
  ...t.stream ? { stream: t.stream } : {}
}), yp = (t) => ({
  parentId: t.parentId ?? null,
  sourceId: t.sourceId ?? null,
  runConfig: t.runConfig ?? {}
}), wp = (t, e) => typeof e == "string" ? {
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
}, dc = (t) => {
  if (t.isRunning !== void 0) return t.isRunning;
  const e = t.messages.at(-1);
  return e?.role === "assistant" && e.status.type === "running";
}, Sp = (t, e) => Object.freeze({
  threadId: e.id,
  metadata: e,
  capabilities: t.capabilities,
  isDisabled: t.isDisabled,
  isLoading: t.isLoading,
  isRunning: dc(t),
  messages: t.messages,
  state: t.state,
  suggestions: t.suggestions,
  extras: t.extras,
  speech: t.speech,
  voice: t.voice
});
var xp = class {
  get path() {
    return this._threadBinding.path;
  }
  get __internal_threadBinding() {
    return this._threadBinding;
  }
  _threadBinding;
  _stateBinding;
  constructor(t, e) {
    const s = new Me({
      path: t.path,
      getState: () => Sp(t.getState(), e.getState()),
      subscribe: (n) => {
        const r = t.subscribe(n), i = e.subscribe(n);
        return () => {
          r(), i();
        };
      }
    });
    this._stateBinding = s, this._threadBinding = {
      path: t.path,
      getState: () => t.getState(),
      getStateState: () => s.getState(),
      outerSubscribe: (n) => t.outerSubscribe(n),
      subscribe: (n) => t.subscribe(n)
    }, this.composer = new pp(new Ds({
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
    this.append = this.append.bind(this), this.deleteMessage = this.deleteMessage.bind(this), this.resumeRun = this.resumeRun.bind(this), this.importExternalState = this.importExternalState.bind(this), this.exportExternalState = this.exportExternalState.bind(this), this.startRun = this.startRun.bind(this), this.cancelRun = this.cancelRun.bind(this), this.unstable_notifySessionReset = this.unstable_notifySessionReset.bind(this), this.stopSpeaking = this.stopSpeaking.bind(this), this.connectVoice = this.connectVoice.bind(this), this.disconnectVoice = this.disconnectVoice.bind(this), this.muteVoice = this.muteVoice.bind(this), this.unmuteVoice = this.unmuteVoice.bind(this), this.getVoiceVolume = this.getVoiceVolume.bind(this), this.subscribeVoiceVolume = this.subscribeVoiceVolume.bind(this), this.export = this.export.bind(this), this.import = this.import.bind(this), this.reset = this.reset.bind(this), this.getMessageByIndex = this.getMessageByIndex.bind(this), this.getMessageById = this.getMessageById.bind(this), this.subscribe = this.subscribe.bind(this), this.unstable_on = this.unstable_on.bind(this), this.getModelContext = this.getModelContext.bind(this), this.getState = this.getState.bind(this);
  }
  composer;
  getState() {
    return this._threadBinding.getStateState();
  }
  append(t) {
    const e = this._threadBinding.getState().append(wp(this._threadBinding.getState().messages, t));
    Promise.resolve(e).catch((s) => {
      if (!oc(s)) throw s;
    });
  }
  deleteMessage(t) {
    return this._threadBinding.getState().deleteMessage(t);
  }
  subscribe(t) {
    return this._stateBinding.subscribe(t);
  }
  getModelContext() {
    return this._threadBinding.getState().getModelContext();
  }
  startRun(t) {
    return this._threadBinding.getState().startRun(yp(t));
  }
  resumeRun(t) {
    return this._threadBinding.getState().resumeRun(vp(t));
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
  unstable_notifySessionReset() {
    this._threadBinding.getState().unstable_notifySessionReset();
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
    return new _p(new Me({
      path: t,
      getState: () => {
        const { message: s, parentId: n, index: r } = e() ?? {}, { messages: i, speech: o } = this._threadBinding.getState();
        if (!s || n === void 0 || r === void 0) return Pe;
        const a = this._threadBinding.getState().getBranches(s.id);
        return {
          ...s,
          [ht]: s[ht],
          index: r,
          isLast: i.at(-1)?.id === s.id,
          parentId: n,
          branchNumber: a.indexOf(s.id) + 1,
          branchCount: a.length,
          speech: o?.messageId === s.id ? o : void 0
        };
      },
      subscribe: (s) => this._threadBinding.subscribe(s)
    }), this._threadBinding);
  }
  _eventSubscriptionSubjects = /* @__PURE__ */ new Map();
  unstable_on(t, e) {
    let s = this._eventSubscriptionSubjects.get(t);
    return s || (s = new va({
      event: t,
      binding: this._threadBinding
    }), this._eventSubscriptionSubjects.set(t, s)), s.subscribe(e);
  }
}, ps = class {
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
      const r = this._core.getState(), i = r.isMain, o = r.id;
      s === i && n === o || (s = i, n = o, !(t === "switchedTo" && !i) && (t === "switchedAway" && i || Tt([e], {}, `Thread list item "${t}"`)));
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
const yn = Promise.resolve(), Ip = (t) => ({
  mainThreadId: t.mainThreadId,
  newThreadId: t.newThreadId,
  threadIds: t.threadIds,
  archivedThreadIds: t.archivedThreadIds,
  isLoading: t.isLoading,
  isLoadingMore: t.isLoadingMore ?? !1,
  hasMore: t.hasMore ?? !1,
  threadItems: t.threadItems
}), gs = (t, e) => {
  if (e === void 0) return Pe;
  const s = t.getItemById(e);
  return s ? {
    id: s.id,
    remoteId: s.remoteId,
    externalId: s.externalId,
    title: s.title,
    status: s.status,
    lastMessageAt: s.lastMessageAt,
    custom: s.custom,
    isMain: s.id === t.mainThreadId,
    isRunning: t.unstable_isThreadRunning?.(s.id) ?? !1
  } : Pe;
};
var Tp = class {
  _getState;
  _stateBinding;
  _core;
  _runtimeFactory;
  constructor(t, e = xp) {
    this._core = t, this._runtimeFactory = e;
    const s = new $r({
      path: {},
      getState: () => Ip(t),
      subscribe: (n) => t.subscribe(n)
    });
    this._getState = s.getState.bind(s), this._stateBinding = s, this._mainThreadListItemRuntime = new ps(new Me({
      path: {
        ref: "threadItems[main]",
        threadSelector: { type: "main" }
      },
      getState: () => gs(this._core, this._core.mainThreadId),
      subscribe: (n) => this._core.subscribe(n)
    }), this._core), this.main = new e(new Ds({
      path: {
        ref: "threads.main",
        threadSelector: { type: "main" }
      },
      getState: () => t.getMainThreadRuntimeCore(),
      subscribe: (n) => t.subscribe(n)
    }), this._mainThreadListItemRuntime), this.__internal_bindMethods();
  }
  __internal_bindMethods() {
    this.switchToThread = this.switchToThread.bind(this), this.switchToNewThread = this.switchToNewThread.bind(this), this.getLoadThreadsPromise = this.getLoadThreadsPromise.bind(this), this.reload = this.reload.bind(this), this.reloadMainThread = this.reloadMainThread.bind(this), this.loadMore = this.loadMore.bind(this), this.getState = this.getState.bind(this), this.subscribe = this.subscribe.bind(this), this.getById = this.getById.bind(this), this.getItemById = this.getItemById.bind(this), this.getItemByIndex = this.getItemByIndex.bind(this), this.getArchivedItemByIndex = this.getArchivedItemByIndex.bind(this);
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
    return this._core.reload?.() ?? yn;
  }
  reloadMainThread() {
    return this._core.reloadMainThread?.() ?? yn;
  }
  loadMore() {
    return this._core.loadMore?.() ?? yn;
  }
  getState() {
    return this._getState();
  }
  subscribe(t) {
    return this._stateBinding.subscribe(t);
  }
  _mainThreadListItemRuntime;
  main;
  get mainItem() {
    return this._mainThreadListItemRuntime;
  }
  getById(t) {
    return new this._runtimeFactory(new Ds({
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
    return new ps(new Me({
      path: {
        ref: `threadItems[${t}]`,
        threadSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => gs(this._core, this._core.threadIds[t]),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
  getArchivedItemByIndex(t) {
    return new ps(new Me({
      path: {
        ref: `archivedThreadItems[${t}]`,
        threadSelector: {
          type: "archiveIndex",
          index: t
        }
      },
      getState: () => gs(this._core, this._core.archivedThreadIds[t]),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
  getItemById(t) {
    return new ps(new Me({
      path: {
        ref: `threadItems[threadId=${t}]`,
        threadSelector: {
          type: "threadId",
          threadId: t
        }
      },
      getState: () => gs(this._core, t),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
}, Cp = class {
  threads;
  _thread;
  _core;
  constructor(t) {
    this._core = t, this.threads = new Tp(t.threads), this._thread = this.threads.main, this.__internal_bindMethods();
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
};
const hc = /* @__PURE__ */ new WeakMap(), Yr = (t) => hc.get(t) ?? 0, Vi = (t, e) => Yr(t) === e, fc = (t) => {
  hc.set(t, Yr(t) + 1);
};
var Ep = class {
  _contextProvider = new ya();
  registerModelContextProvider(t) {
    return this._contextProvider.registerModelContextProvider(t);
  }
  getModelContextProvider() {
    return this._contextProvider;
  }
};
const tt = Object.freeze([]), Rt = "DEFAULT_THREAD_ID", Ap = Object.freeze([Rt]), Rp = Object.freeze({
  id: Rt,
  remoteId: void 0,
  externalId: void 0,
  status: "regular"
}), Mp = Promise.resolve(), ji = Object.freeze({ [Rt]: Rp });
var kp = class {
  _mainThreadId = Rt;
  _threads = Ap;
  _archivedThreads = tt;
  _threadData = ji;
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
    return Mp;
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
    const n = t.threadId ?? Rt, r = t.threads ?? tt, i = t.archivedThreads ?? tt, o = s.threadId ?? Rt, a = s.threads ?? tt, c = s.archivedThreads ?? tt;
    !e && o === n && a === r && c === i || ((a !== r || c !== i || o !== n) && (this._threadData = {
      ...ji,
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
    }), a !== r && (this._threads = this.adapter.threads?.map((l) => l.id) ?? tt), c !== i && (this._archivedThreads = this.adapter.archivedThreads?.map((l) => l.id) ?? tt), (e || o !== n) && (e || fc(this._mainThread), this._mainThreadId = n, this._mainThread = this.threadFactory()), this._threadData[this._mainThreadId] || (this._threadData = {
      ...this._threadData,
      [this._mainThreadId]: {
        id: this._mainThreadId,
        remoteId: void 0,
        externalId: void 0,
        status: "regular"
      }
    }), this._notifySubscribers());
  }
  async reloadMainThread() {
    this._mainThread.unstable_refetchThread && await this._mainThread.unstable_refetchThread();
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
    Js(this._subscriptions);
  }
};
const mc = {
  fromArray: (t) => {
    const e = t.map((s) => Ls(s, dt(), Qn(!1, !1, !1, !1, void 0)));
    return { messages: e.map((s, n) => ({
      parentId: n > 0 ? e[n - 1].id : null,
      message: s
    })) };
  },
  fromBranchableArray: (t, e) => {
    const s = Qn(!1, !1, !1, !1, void 0);
    return {
      ...e?.headId !== void 0 ? { headId: e.headId } : void 0,
      messages: t.map(({ message: n, parentId: r }) => {
        if (!n.id) throw new Error("ExportedMessageRepository.fromBranchableArray: Each message must have an 'id' field set.");
        return {
          parentId: r,
          message: Ls(n, n.id, s)
        };
      })
    };
  }
}, As = (t) => t.next ? As(t.next) : "current" in t ? t : null;
var Dp = class {
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
}, pc = class {
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
        for (let i = t; i; i = i.prev) if (i.current.id === e.current.id) throw new Error("MessageRepository(performOp/link): A message with the same id already exists in the parent tree. This error occurs if the same message id is found multiple times. This is likely an internal bug in assistant-ui.");
      }
      if (s !== "link" && (n.children = n.children.filter((i) => i !== e.current.id), n.next === e)) {
        const i = n.children.at(-1), o = i ? this.messages.get(i) : null;
        if (o === void 0) throw new Error("MessageRepository(performOp/cut): Fallback sibling message not found. This is likely an internal bug in assistant-ui.");
        n.next = o;
      }
      if (s !== "cut") {
        r.children = [...r.children, e.current.id], (As(e) === this.head || r.next === null) && (r.next = e), e.prev = t;
        const i = t ? t.level + 1 : 0;
        this.updateLevels(e, i);
      }
    }
  }
  _messages = new Dp(() => {
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
      const i = this.messages.get(r);
      if (!i) throw new Error("MessageRepository(deleteMessage): Child message not found. This is likely an internal bug in assistant-ui.");
      this.performOp(n, i, "relink");
    }
    this.performOp(null, s, "cut"), this.messages.delete(t), this.head === s && (this.head = As(n ?? this.root)), this._messages.dirty();
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
    n.next = e, this.head = As(e), this.evictOffBranchOptimisticMessages(s, this.head), this._messages.dirty();
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
        for (const i of r.children) {
          const o = this.messages.get(i);
          o && (n(o), this.messages.delete(i));
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
const Kt = Object.freeze([]);
function qi(t, e) {
  if (e === "*") return !0;
  const s = e.split(",").map((i) => i.trim().toLowerCase()), n = `.${t.name.split(".").pop().toLowerCase()}`, r = t.type.split(";", 1)[0].trim().toLowerCase();
  for (const i of s) {
    if (i.startsWith(".") && i === n || i.includes("/") && i === r) return !0;
    if (i.endsWith("/*")) {
      const o = i.split("/")[0];
      if (r.startsWith(`${o}/`)) return !0;
    }
  }
  return !1;
}
function Pp(t) {
  const e = dt();
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
function Op(t) {
  const e = [];
  for (const s of t) s.type !== "text" && e.push(Pp(s));
  return e;
}
const Np = (t) => "content" in t && !("lastModified" in t), bs = (t) => t.status.type === "complete";
var gc = class extends Ud {
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
    this._text !== t && (this._text = t, this._rebaseDictation(t), this._notifySubscribers());
  }
  _rebaseDictation(t) {
    if (!this._dictation) return;
    this._dictationBaseText = t, this._currentInterimText = "";
    const { status: e, inputDisabled: s } = this._dictation;
    this._dictation = s ? {
      status: e,
      inputDisabled: s
    } : { status: e };
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
  _attachmentAddOperations = /* @__PURE__ */ new Set();
  _cancelAttachmentAdd(t) {
    for (const e of [...this._attachmentAddOperations])
      e.attachmentIds.has(t) && (e.cancelled = !0, this._attachmentAddOperations.delete(e));
  }
  _cancelAllAttachmentAdds() {
    for (const t of this._attachmentAddOperations) t.cancelled = !0;
    this._attachmentAddOperations.clear();
  }
  _emptyTextAndAttachments() {
    this._attachments = [], this._text = "", this._notifySubscribers();
  }
  async _onClearAttachments() {
    const t = this.getAttachmentAdapter();
    if (t) {
      const e = this._attachments.filter((s) => !bs(s));
      await Promise.all(e.map((s) => t.remove(s)));
    }
  }
  async reset() {
    if (this._cancelAllAttachmentAdds(), this._sendGeneration++, this._isSending = !1, this._removedDuringSend.clear(), this._attachments.length === 0 && this._text === "" && this._role === "user" && Object.keys(this._runConfig).length === 0 && this._quote === void 0) return;
    this._role = "user", this._runConfig = {}, this._quote = void 0;
    const t = this._onClearAttachments();
    this._emptyTextAndAttachments(), await t;
  }
  async clearAttachments() {
    this._cancelAllAttachmentAdds();
    const t = this._onClearAttachments();
    this.setAttachments([]), await t;
  }
  async send(t) {
    if (!this.canSend || this._isSending) return;
    this._dictationSession && (this._dictationSession.cancel(), this._cleanupDictation());
    const e = this.getAttachmentAdapter(), s = this.attachments.map(async (_) => {
      if (bs(_)) return _;
      if (!e) throw new Error("Attachments are not supported");
      return await e.send(_);
    }), n = this.attachments, r = this.text, i = this._quote, o = this.role, a = this.runConfig;
    this._quote = void 0, this._text = "", this._isSending = !0;
    const c = ++this._sendGeneration;
    this._notifySubscribers();
    let l;
    try {
      l = await Promise.all(s);
    } catch (_) {
      throw c === this._sendGeneration && (!this.text.trim() && this._quote === void 0 && (this._text = r, this._rebaseDictation(r), this._quote = i, this._notifySubscribers()), Promise.allSettled(s).then(() => {
        c === this._sendGeneration && (this._removedDuringSend.clear(), this._isSending = !1, this._notifySubscribers());
      })), _;
    }
    if (c !== this._sendGeneration) return;
    const u = new Set(n.map((_) => _.id));
    this._attachments = this._attachments.filter((_) => !u.has(_.id)), this._isSending = !1, this._notifySubscribers();
    const f = l.filter((_) => !this._removedDuringSend.has(_.id));
    this._removedDuringSend.clear();
    const h = {
      createdAt: /* @__PURE__ */ new Date(),
      role: o,
      content: r ? [{
        type: "text",
        text: r
      }] : [],
      attachments: f,
      runConfig: a,
      metadata: { custom: { ...i ? { quote: i } : {} } }
    }, d = {
      text: r,
      quote: i,
      attachments: f
    };
    let p;
    try {
      p = this.handleSend(h, t);
    } catch (_) {
      throw this._restoreUnsentDraft(_, c, d), _;
    }
    p && p.catch((_) => {
      this._restoreUnsentDraft(_, c, d);
    }), this._notifyEventSubscribers("send", {});
  }
  /**
  * Take a message back into the composer when it has nowhere else to live:
  * a send the runtime never dispatched, or a message a cancelled run is
  * removing from the thread. Reports whether the composer accepted it, so a
  * caller that is also removing the message can keep it instead of dropping
  * it. Refused, and left untouched, while the composer holds anything of its
  * own.
  */
  restoreDraft(t) {
    return this._text.trim() || this._quote !== void 0 || this._attachments.length > 0 ? !1 : (this._text = t.text, this._rebaseDictation(t.text), this._quote = t.quote, this._attachments = t.attachments ?? [], this._notifySubscribers(), !0);
  }
  /**
  * Inverse of `restoreDraft`: clears the composer while it still holds
  * exactly the given draft. A draft the user has edited since is left
  * untouched.
  */
  retractDraft(t) {
    const e = t.attachments !== void 0 ? this._attachments === t.attachments : this._attachments.length === 0;
    this._text !== t.text || this._quote !== t.quote || !e || (this._text = "", this._rebaseDictation(""), this._quote = void 0, this._attachments = [], this._notifySubscribers());
  }
  _restoreUnsentDraft(t, e, s) {
    oc(t) && e === this._sendGeneration && this.restoreDraft(s);
  }
  cancel() {
    this.handleCancel();
  }
  get queue() {
    return Kt;
  }
  moveQueueItem(t, e) {
  }
  removeQueueItem(t) {
  }
  async addAttachment(t) {
    if (Np(t)) {
      const o = this.getAttachmentAdapter();
      if (o && !qi({
        name: t.name,
        type: t.contentType ?? ""
      }, o.accept)) {
        const c = `File type ${t.contentType || "unknown"} is not accepted. Accepted types: ${o.accept}`, l = new Error(c);
        throw this._safeEmitAttachmentAddError("not-accepted", c, void 0, l), l;
      }
      const a = {
        id: t.id ?? dt(),
        type: t.type ?? "document",
        name: t.name,
        contentType: t.contentType,
        content: t.content,
        status: { type: "complete" }
      };
      this._attachments = [...this._attachments, a], this._notifySubscribers(), this._notifyEventSubscribers("attachmentAdd", {});
      return;
    }
    const e = this.getAttachmentAdapter();
    if (!e) {
      const o = "Attachments are not supported", a = /* @__PURE__ */ new Error(o);
      throw this._safeEmitAttachmentAddError("no-adapter", o, void 0, a), a;
    }
    if (!qi({
      name: t.name,
      type: t.type
    }, e.accept)) {
      const o = `File type ${t.type || "unknown"} is not accepted. Accepted types: ${e.accept}`, a = new Error(o);
      throw this._safeEmitAttachmentAddError("not-accepted", o, void 0, a), a;
    }
    const s = {
      cancelled: !1,
      attachmentIds: /* @__PURE__ */ new Set()
    }, n = this._attachmentAddOperations;
    n.add(s);
    const r = (o) => {
      if (s.cancelled) return !1;
      s.attachmentIds.add(o.id);
      const a = this._attachments.findIndex((c) => c.id === o.id);
      return a !== -1 ? this._attachments = [
        ...this._attachments.slice(0, a),
        o,
        ...this._attachments.slice(a + 1)
      ] : this._attachments = [...this._attachments, o], this._notifySubscribers(), !0;
    };
    let i;
    try {
      const o = e.add({ file: t });
      if (Symbol.asyncIterator in o) {
        for await (const a of o)
          if (i = a, !r(a)) break;
      } else
        i = await o, r(i);
    } catch (o) {
      if (s.cancelled) return;
      throw i && r({
        ...i,
        status: {
          type: "incomplete",
          reason: "error",
          message: o instanceof Error ? o.message : String(o)
        }
      }), this._safeEmitAttachmentAddError("adapter-error", o instanceof Error ? o.message : String(o), i?.id, o instanceof Error ? o : void 0), o;
    } finally {
      n.delete(s);
    }
    s.cancelled || (i?.status.type === "incomplete" && i.status.reason === "error" ? this._safeEmitAttachmentAddError("adapter-error", i.status.message ?? "Attachment upload did not complete successfully.", i.id) : this._notifyEventSubscribers("attachmentAdd", {}));
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
    if (this._cancelAttachmentAdd(t), this._isSending && this._removedDuringSend.add(t), !bs(s)) {
      const n = this.getAttachmentAdapter();
      if (!n) throw new Error("Attachments are not supported");
      try {
        await n.remove(s);
      } catch (r) {
        const i = r instanceof Error ? r.message : String(r);
        throw this._attachments = this._attachments.map((o) => o.id === t && !bs(o) ? {
          ...o,
          status: {
            type: "incomplete",
            reason: "error",
            message: i
          }
        } : o), this._notifySubscribers(), r;
      }
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
          const { transcript: f, ...h } = this._dictation;
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
    const i = s.onSpeechStart(() => {
      this._isActiveSession(n, s) && (this._dictation = {
        status: { type: "running" },
        inputDisabled: e,
        ...this._dictation?.transcript && { transcript: this._dictation.transcript }
      }, this._notifySubscribers());
    });
    this._dictationUnsubscribes.push(i);
    const o = s.onSpeechEnd(() => {
      this._cleanupDictation({ sessionId: n });
    });
    this._dictationUnsubscribes.push(o);
    const a = setInterval(() => {
      this._isActiveSession(n, s) && s.status.type === "ended" && this._cleanupDictation({ sessionId: n });
    }, 100);
    this._dictationUnsubscribes.push(() => clearInterval(a));
  }
  stopDictation() {
    if (!this._dictationSession) return;
    const t = this._dictationSession, e = this._activeDictationSessionId, s = () => this._cleanupDictation({ sessionId: e });
    t.stop().then(s, s);
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
    s && Tt(s, e, `Composer runtime "${t}"`);
  }
  unstable_on(t, e) {
    const s = e;
    let n = this._eventSubscribers.get(t);
    return n || (n = /* @__PURE__ */ new Set(), this._eventSubscribers.set(t, n)), n.add(s), () => {
      this._eventSubscribers.get(t)?.delete(s);
    };
  }
};
const $p = (t) => t.capabilities?.cancel ? dc(t) : !1;
var Bp = class extends gc {
  get canCancel() {
    return $p(this.runtime);
  }
  get canSend() {
    return !this.isEmpty && !this.runtime.isSendDisabled && !this._isSending;
  }
  _queueCache;
  get queue() {
    const t = this.runtime.getSteerQueueItems?.() ?? Kt, e = this.runtime.getQueueItems?.() ?? Kt, s = this._queueCache;
    if (s && s.steer === t && s.queue === e) return s.flat;
    const n = t.length === 0 ? e : e.length === 0 ? t : [...t, ...e];
    return this._queueCache = {
      steer: t,
      queue: e,
      flat: n
    }, n;
  }
  moveQueueItem(t, e) {
    this.runtime.moveQueueItem?.(t, e);
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
    let t = !1, e = this.runtime.isSendDisabled, s = this.queue;
    return this.runtime.subscribe(() => {
      let n = !1;
      const r = this.canCancel;
      t !== r && (t = r, n = !0), e !== this.runtime.isSendDisabled && (e = this.runtime.isSendDisabled, n = !0), s !== this.queue && (s = this.queue, n = !0), n && this._notifySubscribers();
    });
  }
  async handleSend(t, e) {
    return this.runtime.append({
      ...t,
      parentId: this.runtime.messages.at(-1)?.id ?? null,
      sourceId: null,
      startRun: e?.startRun,
      steer: e?.steer
    });
  }
  async handleCancel() {
    this.runtime.cancelRun();
  }
}, Fp = class extends gc {
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
  _nonTextPassthrough;
  _parentId;
  _sourceId;
  runtime;
  endEditCallback;
  constructor(t, e, { parentId: s, message: n }) {
    super(), this.runtime = t, this.endEditCallback = e, this._parentId = s, this._sourceId = n.id, this.setText(nn(n)), this.setRole(n.role);
    let r;
    n.role === "user" ? (r = [...n.attachments ?? [], ...Op(n.content)], this._nonTextPassthrough = []) : (r = n.attachments ?? [], this._nonTextPassthrough = n.content.filter((i) => i.type !== "text")), this.setAttachments(r), this.setRunConfig({ ...t.composer.runConfig });
  }
  get parentId() {
    return this._parentId;
  }
  get sourceId() {
    return this._sourceId;
  }
  async handleSend(t, e) {
    const s = this._nonTextPassthrough.length > 0 ? [...t.content, ...this._nonTextPassthrough] : t.content, n = this.runtime.append({
      ...t,
      content: s,
      parentId: this._parentId,
      sourceId: this._sourceId,
      startRun: e?.startRun
    });
    return this.handleCancel(), n;
  }
  handleCancel() {
    this.endEditCallback(), this._notifySubscribers();
  }
}, Lp = class {
  _subscriptions = /* @__PURE__ */ new Set();
  _isInitialized = !1;
  repository = new pc();
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
  composer = new Bp(this);
  _contextProvider;
  constructor(t) {
    this._contextProvider = t;
  }
  getModelContext() {
    return this._contextProvider.getModelContext();
  }
  /**
  * Stamps provider-contributed composer metadata onto an outgoing message.
  * Called at dispatch rather than in the composer, so programmatic sends are
  * covered too, and exactly once per message: a queued send is stamped when
  * it leaves the lane, never when it enters.
  *
  * Only user messages are stamped, matching the readers: both the version
  * fold and the model injection skip every other role.
  *
  * @param anchorId Message the gated branch prefix ends at. A queued send
  * passes the current tail, having waited through a run that grew the prefix
  * past the parent it was created with.
  */
  enrichAppendMetadata(t, e = t.parentId) {
    if (t.role !== "user") return t;
    const s = this.messages, n = e === null ? -1 : s.findIndex((i) => i.id === e), r = rm(this.getModelContext().unstable_composerMetadata, s.slice(0, n + 1));
    return r ? {
      ...t,
      metadata: {
        ...t.metadata,
        custom: {
          ...t.metadata?.custom,
          ...r
        }
      }
    } : t;
  }
  _editComposers = /* @__PURE__ */ new Map();
  getEditComposer(t) {
    return this._editComposers.get(t);
  }
  beginEdit(t) {
    if (this._editComposers.has(t)) throw new Error("Edit already in progress");
    this._editComposers.set(t, new Fp(this, () => this._editComposers.delete(t), this.repository.getMessage(t))), this._notifySubscribers();
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
    s && Tt(s, e, `Thread runtime "${t}"`);
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
      const i = {
        ...n,
        metadata: {
          ...n.metadata,
          submittedFeedback: { type: e }
        }
      };
      this.repository.addOrUpdateMessage(r, i);
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
    const n = e.speak(nn(s)), r = n.subscribe(() => {
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
      this._voiceVolume = r, Tt(this._voiceVolumeSubscribers, void 0, "Voice volume");
    })), s.push(e.onTranscript((r) => {
      this._handleVoiceTranscript(r);
    })), this._voiceUnsubs = s;
  }
  _currentAssistantMsg = null;
  _handleVoiceTranscript(t) {
    if (this.ensureInitialized(), t.role === "user")
      this._finishVoiceAssistantMessage(), this._currentAssistantMsg = null, t.isFinal && (this._voiceMessages.push({
        id: dt(),
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
          id: dt(),
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
    this._voiceUnsubs = [], this._voiceSession?.disconnect(), this._voiceSession = void 0, this.voice = void 0, this._voiceVolume = 0, Tt(this._voiceVolumeSubscribers, void 0, "Voice volume"), this._voiceMessages = [], this._markVoiceMessagesDirty(), this._notifySubscribers();
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
    this.import(mc.fromArray(t ?? []));
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
};
const Vp = /* @__PURE__ */ Symbol.for("assistant-stream.tool-execution-id"), _s = (t) => {
  try {
    return JSON.parse(t), !0;
  } catch {
    return !1;
  }
}, Ui = (t) => {
  try {
    return JSON.parse(t);
  } catch {
    return;
  }
}, Hi = (t, e) => {
  const s = Ui(t), n = Ui(e);
  return s === void 0 || n === void 0 ? !1 : Hr(s, n);
}, wn = (t) => t[Vp];
var jp = class {
  _getTools;
  _callbacks;
  _entries = /* @__PURE__ */ new Map();
  _humanInput = /* @__PURE__ */ new Map();
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
    const [t, e] = Tm();
    this._controller = e;
    const n = Jm(() => this._getWrappedTools(), () => this._ac.signal, (r, i, o) => this._onHumanInput(r, i, o), {
      onExecutionStart: (r, i, o) => this._onExecutionStart(r, o),
      onExecutionEnd: (r, i, o) => this._onExecutionEnd(r, o)
    });
    t.pipeThrough(n).pipeThrough(new ec()).pipeTo(new WritableStream({ write: (r) => {
      try {
        if (r.type !== "result") return;
        this._handleResultChunk(r);
      } catch (i) {
        console.error("[ToolInvocationTracker] result chunk handling failed", i);
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
      this._pendingRestore = !0, this._entries.clear(), this._lastSnapshot = null, this.abort(), this._statuses.size > 0 && (this._statuses = /* @__PURE__ */ new Map(), this._invokeOnStatusesChange());
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
      if (this._humanInput.forEach(({ reject: e }) => {
        try {
          e(/* @__PURE__ */ new Error("Tool execution aborted"));
        } catch {
        }
      }), this._humanInput.clear(), this._ac.abort(), this._ac = new AbortController(), this._executing.size === 0) return Promise.resolve();
      const t = new Set(this._executing);
      return new Promise((e) => {
        this._settledResolvers.push({
          executionIds: t,
          resolve: e
        });
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
        const n = s.execute, r = s.streamCall;
        return n === void 0 && r === void 0 ? [e, s] : [e, {
          ...s,
          ...n !== void 0 && { execute: (...[i, o]) => {
            const a = wn(o), c = this._captureExecution(o.toolCallId, a);
            return !c || c.skipExecute ? new Promise(() => {
            }) : n(i, o);
          } },
          ...r !== void 0 && { streamCall: (...[i, o]) => {
            const a = wn(o);
            if (this._captureExecution(o.toolCallId, a))
              return r(i, o);
          } }
        }];
      }));
  }
  _captureExecution(t, e) {
    if (e === void 0) return;
    const s = this._entries.get(t);
    if (s?.controller)
      return s.executionId === void 0 && (s.executionId = e), s.executionId === e ? s : void 0;
  }
  _onHumanInput(t, e, s) {
    return new Promise((n, r) => {
      const i = this._entries.get(t);
      if (!i?.controller || i.executionId !== s) {
        r(/* @__PURE__ */ new Error("Tool execution aborted"));
        return;
      }
      const o = this._humanInput.get(t);
      if (o) try {
        o.reject(/* @__PURE__ */ new Error("Human input request was superseded by a new request"));
      } catch {
      }
      this._humanInput.set(t, {
        executionId: s,
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
  _onExecutionStart(t, e) {
    this._captureExecution(t, e) && (this._entries.get(t).skipExecute || (this._executing.add(e), this._setStatus(t, { type: "executing" })));
  }
  _onExecutionEnd(t, e) {
    if (e === void 0 || !this._executing.delete(e)) return;
    this._entries.get(t)?.executionId === e && this._deleteStatus(t);
    const s = [];
    this._settledResolvers.forEach(({ executionIds: n, resolve: r }) => {
      if ([...n].some((i) => this._executing.has(i))) {
        s.push({
          executionIds: n,
          resolve: r
        });
        return;
      }
      try {
        r();
      } catch {
      }
    }), this._settledResolvers.length = 0, this._settledResolvers.push(...s);
  }
  _handleResultChunk(t) {
    const e = t.meta.toolCallId, s = wn(t), n = this._entries.get(e);
    !n || n.executionId !== s || n?.hasResult || this._invokeOnResult({
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
    return s ? !0 : (this._hasExecutableTool(t) || !this._isRunning) && _s(e);
  }
  _startActiveEntry(t, e, s) {
    const n = {
      toolName: e,
      controller: this._controller.addToolCallPart({
        toolName: e,
        toolCallId: t
      }),
      argsText: "",
      hasResult: !1,
      skipExecute: s,
      argsComplete: !1
    };
    return this._entries.set(t, n), n;
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
      if (t.argsComplete)
        Hi(t.argsText, e.argsText) && (t.argsText = e.argsText), n = !1;
      else if (!e.argsText.startsWith(t.argsText))
        if (_s(t.argsText) && _s(e.argsText) && Hi(t.argsText, e.argsText)) {
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
        const i = this._shouldCloseArgsStream({
          toolName: e.toolName,
          argsText: e.argsText,
          hasResult: s
        });
        i && t.controller.argsText.close(), t.argsText = e.argsText, t.argsComplete = i;
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
          let i = r;
          if (i && !i.controller) {
            if (!(n.argsText !== i.argsText || n.result !== void 0 !== i.hasResult)) {
              n.messages && this._processMessages(n.messages);
              continue;
            }
            this._entries.delete(n.toolCallId), i = void 0;
          }
          if (i || (i = this._startActiveEntry(n.toolCallId, n.toolName, n.result !== void 0)), this._processArgsText(i, n), n.result !== void 0 && !i.hasResult) {
            const { controller: o } = i;
            if (!o) continue;
            i.hasResult = !0, i.argsComplete = !0, o.setResponse(new ze({
              result: n.result,
              artifact: n.artifact,
              isError: n.isError,
              ...n.modelContent !== void 0 ? { modelContent: n.modelContent } : {}
            })), o.close();
          }
          n.messages && this._processMessages(n.messages);
        }
  }
};
const qp = Object.freeze([]), vs = (t, e) => {
  Promise.resolve(e).catch((s) => {
    console.error(`[ExternalStoreThreadRuntimeCore] ${t} callback rejected`, s);
  });
}, zi = (t, e) => {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length) return !1;
  for (const n of s) if (t[n] !== e[n]) return !1;
  return !0;
}, Up = (t, e) => t && e[e.length - 1]?.role !== "assistant";
var Hp = class extends Lp {
  _capabilities = {
    switchToBranch: !1,
    switchBranchDuringRun: !1,
    edit: !1,
    delete: !1,
    reload: !1,
    refetchThread: !1,
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
  get unstable_refetchThread() {
    if (this._store.onRefetchThread)
      return () => this._store.onRefetchThread();
  }
  suggestions = [];
  extras = void 0;
  _converter = new Ni();
  _store;
  _getInitializePromise;
  __internal_setGetInitializePromise(t) {
    this._getInitializePromise = t;
  }
  _transformedQueue;
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
    this._store = t, s?.queue !== t.queue && (this._transformedQueue = void 0, t.queue?.__internal_setDispatchTransform?.((a) => {
      const c = this.messages.at(-1)?.id ?? null;
      return this.enrichAppendMetadata({
        ...a,
        parentId: c
      }, c);
    }), t.queue?.__internal_setDispatchTransform && (this._transformedQueue = t.queue)), this.extras !== t.extras && (this.extras = t.extras);
    const n = t.suggestions ?? qp;
    zi(this.suggestions, n) || (this.suggestions = n);
    const r = {
      switchToBranch: this._store.setMessages !== void 0,
      switchBranchDuringRun: !1,
      edit: this._store.onEdit !== void 0,
      delete: this._store.onDelete !== void 0 || this._store.setMessages !== void 0,
      reload: this._store.onReload !== void 0,
      refetchThread: this._store.onRefetchThread !== void 0,
      cancel: this._store.onCancel !== void 0,
      speech: this._store.adapters?.speech !== void 0,
      dictation: this._store.adapters?.dictation !== void 0,
      voice: this._store.adapters?.voice !== void 0,
      unstable_copy: this._store.unstable_capabilities?.copy !== !1,
      attachments: !!this._store.adapters?.attachments,
      feedback: !!this._store.adapters?.feedback,
      queue: this._store.queue !== void 0
    };
    zi(this._capabilities, r) || (this._capabilities = r);
    let i;
    if (t.messageRepository) {
      if (s && s.isRunning === t.isRunning && s.messageRepository === t.messageRepository) {
        this._notifySubscribers();
        return;
      }
      const a = t.messageRepository.messages, c = t.messageRepository.headId ?? a.at(-1)?.message.id ?? null;
      if (s && s.messageRepository === t.messageRepository)
        this.repository.resetHead(c), i = this.repository.getMessages();
      else {
        const l = new Set(a.map(({ message: u }) => u.id));
        for (const { message: u, parentId: f } of a) this.repository.addOrUpdateMessage(f, u);
        for (const { message: u } of this.repository.export().messages) l.has(u.id) || this.repository.deleteMessage(u.id);
        this.repository.resetHead(c), i = this.repository.getMessages();
      }
    } else if (t.messages) {
      if (s) {
        if (s.convertMessage !== t.convertMessage) this._converter = new Ni();
        else if (s.isRunning === t.isRunning && s.messages === t.messages) {
          this._notifySubscribers();
          return;
        }
      }
      i = t.convertMessage ? this._converter.convertMessages(t.messages, (l, u, f) => {
        if (!t.convertMessage) return u;
        const h = f === (t.messages?.length ?? 0) - 1, d = Qn(h, e, !1, !1, void 0);
        if (l && (l.role !== "assistant" || !Om(l.status) || l.status === d)) return l;
        const p = t.convertMessage(u, f), _ = Ls(p, f.toString(), d);
        return Mm(_, u), _;
      }) : t.messages;
      const a = /* @__PURE__ */ new Set(), c = [];
      for (let l = i.length - 1; l >= 0; l--) {
        const u = i[l];
        if (a.has(u.id)) {
          console.warn(`ExternalStoreThreadRuntimeCore: duplicate message id "${u.id}" in the provided messages array; keeping the last occurrence.`);
          continue;
        }
        a.add(u.id), c.push(u);
      }
      c.length !== i.length && (i = c.reverse());
      for (let l = 0; l < i.length; l++) {
        const u = i[l], f = i[l - 1];
        this.repository.addOrUpdateMessage(f?.id ?? null, u);
      }
    } else throw new Error("ExternalStoreAdapter must provide either 'messages' or 'messageRepository'");
    i.length > 0 && this.ensureInitialized(), (s?.isRunning ?? !1) !== (t.isRunning ?? !1) && (t.isRunning ? this._notifyEventSubscribers("runStart", {}) : this._notifyEventSubscribers("runEnd", {}));
    let o = null;
    Up(e, i) && (o = dt(), this.repository.addOrUpdateMessage(i.at(-1)?.id ?? null, Ls({
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
    this._toolInvocations || (this._toolInvocations = new jp(() => this.getModelContext().tools, {
      onResult: (t) => {
        try {
          const e = this._findMessageIdForToolCall(t.toolCallId);
          if (e === void 0) return;
          vs("onAddToolResult", this._store.onAddToolResult?.({
            messageId: e,
            toolCallId: t.toolCallId,
            toolName: t.toolName,
            result: t.result,
            isError: t.isError,
            ...t.artifact !== void 0 && { artifact: t.artifact },
            ...t.modelContent !== void 0 && { modelContent: t.modelContent }
          }));
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
    const e = t.sourceId != null || t.parentId !== (this.messages.at(-1)?.id ?? null), s = !e && this._store.queue && this._store.queue === this._transformedQueue ? t : this.enrichAppendMetadata(t), n = Yr(this);
    this.ensureInitialized();
    const r = this._getInitializePromise?.();
    if (!e && this._store.queue) {
      if (r && await r, !Vi(this, n)) return;
      s.steer ?? this._store.isRunning ?? !1 ? this._store.queue.steer(s) : this._store.queue.enqueue(s);
      return;
    }
    if (r?.catch(() => {
    }), (s.startRun ?? s.role === "user") && await this._toolInvocations?.abort(), !!Vi(this, n))
      if (e) {
        if (!this._store.onEdit) throw new Error("Runtime does not support editing messages.");
        await this._store.onEdit(s);
      } else await this._store.onNew(s);
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
    return this._store?.queue?.items ?? Kt;
  }
  getSteerQueueItems() {
    return this._store?.queue?.steerItems ?? Kt;
  }
  moveQueueItem(t, e) {
    this._store?.queue?.move(t, e);
  }
  removeQueueItem(t) {
    this._store?.queue?.remove(t);
  }
  async startRun(t) {
    if (!this._store.onReload) throw new Error("Runtime does not support reloading messages.");
    await this._toolInvocations?.abort(), await this._store.onReload(t.parentId, t);
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
    this._toolInvocations?.reset(), this._store.onLoadExternalState(t);
  }
  /**
  * Adapter-facing notification that the backing session was discarded.
  * Clears session-scoped tool-invocation state and parks queued work,
  * without run-cancel semantics (`onCancel`, composer draft restoration).
  */
  unstable_notifySessionReset() {
    this._toolInvocations?.reset(), this._store.queue?.__internal_notifyCancelled?.();
  }
  cancelRun() {
    if (!this._store.onCancel) throw new Error("Runtime does not support cancelling runs.");
    this._toolInvocations?.abort(), this._store.queue?.__internal_notifyCancelled?.(), vs("onCancel", this._store.onCancel()), this.dropEmptyOptimisticHead();
    const t = this.repository.getMessages(), e = t[t.length - 1], s = this._store.setMessages !== void 0 && e?.role === "user" && e.id === t.at(-1)?.id && e.content.every((r) => r.type === "text") ? e : void 0;
    let n;
    if (s) {
      const r = {
        text: nn(s),
        attachments: s.attachments,
        quote: s.metadata.custom.quote
      };
      this.composer.restoreDraft(r) && (this.repository.deleteMessage(s.id), n = {
        id: s.id,
        draft: r
      });
    }
    n || this._notifySubscribers(), setTimeout(() => {
      if (this.dropEmptyOptimisticHead(), n) {
        const r = this.repository.getMessages();
        r.at(-1)?.id === n.id ? this.repository.deleteMessage(n.id) : r.some((i) => i.id === n.id) && this.composer.retractDraft(n.draft);
      }
      this.updateMessages(this.repository.getMessages());
    }, 0);
  }
  dropEmptyOptimisticHead() {
    const t = this.repository.getMessages().at(-1);
    t && t.metadata.isOptimistic && t.content.length === 0 && this.repository.deleteMessage(t.id);
  }
  addToolResult(t) {
    if (!this._store.onAddToolResult) throw new Error("Runtime does not support tool results.");
    vs("onAddToolResult", this._store.onAddToolResult(t));
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
    vs("onRespondToToolApproval", this._store.onRespondToToolApproval(t));
  }
  reset(t) {
    const e = new pc();
    e.import(mc.fromArray(t ?? [])), this.updateMessages(e.getMessages());
  }
  import(t) {
    super.import(t), this._store.onImport && this._store.onImport(this.repository.getMessages());
  }
  updateMessages = (t) => {
    this._store.convertMessage !== void 0 ? this._store.setMessages?.(t.flatMap(km)) : this._store.setMessages?.(t);
  };
};
const Gi = (t) => t.adapters?.threadList ?? {};
var zp = class extends Ep {
  threads;
  constructor(t) {
    super(), this.threads = new kp(Gi(t), () => new Hp(this._contextProvider, t));
  }
  setAdapter(t) {
    this.threads.__internal_setAdapter(Gi(t)), this.threads.getMainThreadRuntimeCore().__internal_setAdapter(t);
  }
};
const Gp = (t) => {
  const e = x(15);
  let s;
  e[0] !== t ? (s = () => new zp(t), e[0] = t, e[1] = s) : s = e[1];
  const [n] = ue(s);
  let r;
  e[2] !== n.threads ? (r = () => () => {
    fc(n.threads.getMainThreadRuntimeCore());
  }, e[2] = n.threads, e[3] = r) : r = e[3];
  let i;
  e[4] !== n ? (i = [n], e[4] = n, e[5] = i) : i = e[5], K(r, i);
  let o;
  e[6] !== n || e[7] !== t ? (o = () => {
    n.setAdapter(t);
  }, e[6] = n, e[7] = t, e[8] = o) : o = e[8], K(o);
  const { modelContext: a } = Em() ?? {};
  let c, l;
  e[9] !== a || e[10] !== n ? (c = () => {
    if (a)
      return n.registerModelContextProvider(a);
  }, l = [a, n], e[9] = a, e[10] = n, e[11] = c, e[12] = l) : (c = e[11], l = e[12]), K(c, l);
  let u;
  return e[13] !== n ? (u = new Cp(n), e[13] = n, e[14] = u) : u = e[14], u;
}, Wp = (t) => {
  const e = x(6), { id: s, children: n } = t, r = re();
  let i;
  e[0] !== s ? (i = Ve({
    message: ke({
      source: "thread",
      query: {
        type: "id",
        id: s
      },
      get: (c) => c.thread.message({ id: s })
    }),
    composer: ke({
      source: "message",
      query: {},
      get: (c) => c.thread.message({ id: s }).composer()
    })
  }), e[0] = s, e[1] = i) : i = e[1];
  const o = i;
  let a;
  return e[2] !== r || e[3] !== n || e[4] !== o ? (a = /* @__PURE__ */ m(Je, {
    extends: r,
    config: o,
    children: n
  }), e[2] = r, e[3] = n, e[4] = o, e[5] = a) : a = e[5], a;
}, Qr = (t, e) => t.Message === e.Message && t.EditComposer === e.EditComposer && t.UserEditComposer === e.UserEditComposer && t.AssistantEditComposer === e.AssistantEditComposer && t.SystemEditComposer === e.SystemEditComposer && t.UserMessage === e.UserMessage && t.AssistantMessage === e.AssistantMessage && t.SystemMessage === e.SystemMessage, Wi = () => null, Yi = /* @__PURE__ */ new WeakMap(), Yp = (t, e) => {
  let s = Yi.get(t);
  return s || (s = new Set(t.map((n) => n.id)), Yi.set(t, s)), s.has(e);
}, Qp = (t, e, s) => {
  switch (e) {
    case "user":
      return s ? t.UserEditComposer ?? t.EditComposer ?? t.UserMessage ?? t.Message : t.UserMessage ?? t.Message;
    case "assistant":
      return s ? t.AssistantEditComposer ?? t.EditComposer ?? t.AssistantMessage ?? t.Message : t.AssistantMessage ?? t.Message;
    case "system":
      return s ? t.SystemEditComposer ?? t.EditComposer ?? t.SystemMessage ?? t.Message ?? Wi : t.SystemMessage ?? t.Message ?? Wi;
    default:
      throw new Error(`Unknown message role: ${e}`);
  }
}, Jr = (t) => {
  const e = x(6), { components: s } = t, n = D(Xp), r = D(Kp);
  let i;
  e[0] !== s || e[1] !== r || e[2] !== n ? (i = Qp(s, n, r), e[0] = s, e[1] = r, e[2] = n, e[3] = i) : i = e[3];
  const o = i;
  let a;
  return e[4] !== o ? (a = /* @__PURE__ */ m(o, {}), e[4] = o, e[5] = a) : a = e[5], a;
}, bc = ve((t) => {
  const e = x(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(Jr, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let i;
  return e[2] !== s || e[3] !== r ? (i = /* @__PURE__ */ m(nc, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = i) : i = e[4], i;
}, (t, e) => t.index === e.index && Qr(t.components, e.components));
bc.displayName = "ThreadPrimitive.MessageByIndex";
const _c = ve((t) => {
  const e = x(7), { messageId: s, components: n } = t;
  let r;
  if (e[0] !== s ? (r = (a) => Yp(a.thread.messages, s), e[0] = s, e[1] = r) : r = e[1], !D(r)) return null;
  let i;
  e[2] !== n ? (i = /* @__PURE__ */ m(Jr, { components: n }), e[2] = n, e[3] = i) : i = e[3];
  let o;
  return e[4] !== s || e[5] !== i ? (o = /* @__PURE__ */ m(Wp, {
    id: s,
    children: i
  }), e[4] = s, e[5] = i, e[6] = o) : o = e[6], o;
}, (t, e) => t.messageId === e.messageId && Qr(t.components, e.components));
_c.displayName = "ThreadPrimitive.Unstable_MessageById";
const Qi = ({ children: t }) => {
  const e = D((s) => s.thread.messages.length);
  return fe(() => e === 0 ? null : Array.from({ length: e }, (s, n) => /* @__PURE__ */ m(nc, {
    index: n,
    children: /* @__PURE__ */ m(sn, {
      getItemState: (r) => r.thread.message({ index: n }).getState(),
      children: (r) => t({ get message() {
        return r();
      } })
    })
  }, n)), [e, t]);
}, vc = (t) => {
  const e = x(4), { components: s, children: n } = t;
  if (s) {
    let i;
    return e[0] !== s ? (i = /* @__PURE__ */ m(Qi, { children: () => /* @__PURE__ */ m(Jr, { components: s }) }), e[0] = s, e[1] = i) : i = e[1], i;
  }
  let r;
  return e[2] !== n ? (r = /* @__PURE__ */ m(Qi, { children: n }), e[2] = n, e[3] = r) : r = e[3], r;
};
vc.displayName = "ThreadPrimitive.Messages";
const Jp = ve(vc, (t, e) => t.children || e.children ? t.children === e.children : Qr(t.components, e.components));
function Xp(t) {
  return t.message.role;
}
function Kp(t) {
  return t.message.composer.isEditing;
}
const yc = (t) => {
  const e = t.message.metadata;
  if (!(!e || typeof e != "object"))
    return e.custom?.quote;
};
var Zp = class extends Error {
  componentName;
  constructor(t, e = `Component "${t}" is not in the generative-ui allowlist.`) {
    super(e), this.name = "GenerativeUIRenderError", this.componentName = t;
  }
};
const eg = (t) => typeof t == "object" && t !== null, wc = (t, e, s, n) => {
  if (t == null) return null;
  if (typeof t == "string") return t;
  if (!eg(t) || !("component" in t) || typeof t.component != "string")
    return null;
  const { component: r, props: i, children: o, key: a } = t, c = e[r];
  if (!c) {
    if (s) return /* @__PURE__ */ m(s, {
      component: r,
      props: i
    }, a ?? n);
    throw new Zp(r);
  }
  const l = o?.length ? o.map((u, f) => wc(u, e, s, `${n}/${f}`)) : void 0;
  return fd(c, {
    ...i ?? {},
    key: a ?? n
  }, ...l ?? []);
}, tg = (t) => {
  if (!t || t.root === void 0 || t.root === null) return [];
  const e = t.root;
  return Array.isArray(e) ? e : [e];
}, Xr = (t) => {
  const e = x(11), { spec: s, components: n, Fallback: r } = t;
  let i;
  e[0] !== s ? (i = tg(s), e[0] = s, e[1] = i) : i = e[1];
  const o = i;
  let a;
  if (e[2] !== r || e[3] !== n || e[4] !== o) {
    let l;
    e[6] !== r || e[7] !== n ? (l = (u, f) => wc(u, n, r, `${f}`), e[6] = r, e[7] = n, e[8] = l) : l = e[8], a = o.map(l), e[2] = r, e[3] = n, e[4] = o, e[5] = a;
  } else a = e[5];
  let c;
  return e[9] !== a ? (c = /* @__PURE__ */ m($e, { children: a }), e[9] = a, e[10] = c) : c = e[10], c;
};
Xr.displayName = "GenerativeUIRender";
const Sc = (t) => {
  const e = x(4), { components: s, spec: n, Fallback: r } = t, i = D(sg), o = n ?? i;
  if (!o) return null;
  let a;
  return e[0] !== r || e[1] !== s || e[2] !== o ? (a = /* @__PURE__ */ m(Xr, {
    spec: o,
    components: s,
    Fallback: r
  }), e[0] = r, e[1] = s, e[2] = o, e[3] = a) : a = e[3], a;
};
Sc.displayName = "MessagePrimitive.GenerativeUI";
function sg(t) {
  const e = t.part;
  return e?.type === "generative-ui" ? e.spec : void 0;
}
const ng = "ui://", rg = (t) => !!t?.startsWith(ng), Ji = (t) => Symbol.iterator in t, Xi = (t) => (
  // HACK: avoid checking entries type
  "entries" in t
), Ki = (t, e) => {
  const s = t instanceof Map ? t : new Map(t.entries()), n = e instanceof Map ? e : new Map(e.entries());
  if (s.size !== n.size)
    return !1;
  for (const [r, i] of s)
    if (!n.has(r) || !Object.is(i, n.get(r)))
      return !1;
  return !0;
}, ig = (t, e) => {
  const s = t[Symbol.iterator](), n = e[Symbol.iterator]();
  let r = s.next(), i = n.next();
  for (; !r.done && !i.done; ) {
    if (!Object.is(r.value, i.value))
      return !1;
    r = s.next(), i = n.next();
  }
  return !!r.done && !!i.done;
};
function og(t, e) {
  return Object.is(t, e) ? !0 : typeof t != "object" || t === null || typeof e != "object" || e === null || Object.getPrototypeOf(t) !== Object.getPrototypeOf(e) ? !1 : Ji(t) && Ji(e) ? Xi(t) && Xi(e) ? Ki(t, e) : ig(t, e) : Ki(
    { entries: () => Object.entries(t) },
    { entries: () => Object.entries(e) }
  );
}
function Xn(t) {
  const e = es.useRef(void 0);
  return (s) => {
    const n = t(s);
    return og(e.current, n) ? e.current : e.current = n;
  };
}
const Sn = (t) => {
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
}, ag = (t, e, s) => {
  const n = [];
  if (e) {
    const r = Sn("chainOfThoughtGroup");
    for (let i = 0; i < t.length; i++) {
      const o = t[i];
      o === "tool-call" || o === "reasoning" ? r.startGroup(i) : (r.endGroup(i - 1, n), n.push({
        type: "single",
        index: i
      }));
    }
    r.finalize(t.length - 1, n);
  } else {
    const r = Sn("toolGroup"), i = Sn("reasoningGroup");
    for (let o = 0; o < t.length; o++) {
      const a = t[o];
      a === "tool-call" ? (i.endGroup(o - 1, n), r.startGroup(o)) : a === "reasoning" ? (r.endGroup(o - 1, n), i.startGroup(o)) : (r.endGroup(o - 1, n), i.endGroup(o - 1, n), n.push({
        type: "single",
        index: o
      }));
    }
    r.finalize(t.length - 1, n), i.finalize(t.length - 1, n);
  }
  if (s) {
    const r = /* @__PURE__ */ new Set();
    for (const i of n) {
      if (i.type === "single") continue;
      const o = s[i.startIndex];
      o !== void 0 && !r.has(o) && (r.add(o), i.idKey = `id:${o}`);
    }
  }
  return n;
}, cg = (t) => {
  const e = x(10), s = D(Xn(Cg)), n = D(Xn(Ag));
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
    let i;
    e[3] !== s || e[4] !== n || e[5] !== t ? (i = ag(s, t, n), e[3] = s, e[4] = n, e[5] = t, e[6] = i) : i = e[6];
    let o;
    e[7] !== n || e[8] !== i ? (o = {
      ranges: i,
      partIds: n
    }, e[7] = n, e[8] = i, e[9] = o) : o = e[9], r = o;
  }
  return r;
}, lg = (t) => {
  const e = x(9);
  let s, n;
  e[0] !== t ? ({ Fallback: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  e[3] !== s || e[4] !== n.toolName ? (r = (a) => a.tools.toolUIs[n.toolName]?.[0]?.render ?? s, e[3] = s, e[4] = n.toolName, e[5] = r) : r = e[5];
  const i = D(r);
  if (!i) return null;
  let o;
  return e[6] !== i || e[7] !== n ? (o = /* @__PURE__ */ m(i, { ...n }), e[6] = i, e[7] = n, e[8] = o) : o = e[8], o;
}, Kr = (t, e, s) => {
  const n = t.renderers[e]?.[0];
  return n || (t.fallbacks[0] ?? s);
}, ug = (t) => {
  const e = x(9);
  let s, n;
  e[0] !== t ? ({ Fallback: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  e[3] !== s || e[4] !== n.name ? (r = (a) => Kr(a.dataRenderers, n.name, s), e[3] = s, e[4] = n.name, e[5] = r) : r = e[5];
  const i = D(r);
  if (!i) return null;
  let o;
  return e[6] !== i || e[7] !== n ? (o = /* @__PURE__ */ m(i, { ...n }), e[6] = i, e[7] = n, e[8] = o) : o = e[8], o;
}, me = {
  Text: () => null,
  Reasoning: () => null,
  Source: () => null,
  Image: () => null,
  File: () => null,
  Unstable_Audio: () => null,
  ToolGroup: ({ children: t }) => t,
  ReasoningGroup: ({ children: t }) => t
}, dg = (t) => {
  const e = x(41), { components: s } = t;
  let n;
  e[0] !== s ? (n = s === void 0 ? {} : s, e[0] = s, e[1] = n) : n = e[1];
  const { Text: r, Reasoning: i, Image: o, Source: a, File: c, Unstable_Audio: l, tools: u, data: f, generativeUI: h } = n, d = r === void 0 ? me.Text : r, p = i === void 0 ? me.Reasoning : i, _ = o === void 0 ? me.Image : o, v = a === void 0 ? me.Source : a, C = c === void 0 ? me.File : c, b = l === void 0 ? me.Unstable_Audio : l;
  let S;
  e[2] !== u ? (S = u === void 0 ? {} : u, e[2] = u, e[3] = S) : S = e[3];
  const I = S, T = re(), E = D(Rg), g = E.type;
  if (g === "tool-call") {
    const w = T.part.addToolResult, A = T.part.resumeToolCall, P = T.part.respondToToolApproval;
    if ("Override" in I) {
      let q;
      return e[4] !== w || e[5] !== E || e[6] !== P || e[7] !== A || e[8] !== I.Override ? (q = /* @__PURE__ */ m(I.Override, {
        ...E,
        addResult: w,
        resume: A,
        respondToApproval: P
      }), e[4] = w, e[5] = E, e[6] = P, e[7] = A, e[8] = I.Override, e[9] = q) : q = e[9], q;
    }
    const W = I.by_name?.[E.toolName] ?? I.Fallback;
    let X;
    return e[10] !== W || e[11] !== w || e[12] !== E || e[13] !== P || e[14] !== A ? (X = /* @__PURE__ */ m(lg, {
      ...E,
      Fallback: W,
      addResult: w,
      resume: A,
      respondToApproval: P
    }), e[10] = W, e[11] = w, e[12] = E, e[13] = P, e[14] = A, e[15] = X) : X = e[15], X;
  }
  if (E.status?.type === "requires-action") throw new Error("Encountered unexpected requires-action status");
  switch (g) {
    case "text": {
      let w;
      return e[16] !== d || e[17] !== E ? (w = /* @__PURE__ */ m(d, { ...E }), e[16] = d, e[17] = E, e[18] = w) : w = e[18], w;
    }
    case "reasoning": {
      let w;
      return e[19] !== p || e[20] !== E ? (w = /* @__PURE__ */ m(p, { ...E }), e[19] = p, e[20] = E, e[21] = w) : w = e[21], w;
    }
    case "source": {
      let w;
      return e[22] !== v || e[23] !== E ? (w = /* @__PURE__ */ m(v, { ...E }), e[22] = v, e[23] = E, e[24] = w) : w = e[24], w;
    }
    case "image": {
      let w;
      return e[25] !== _ || e[26] !== E ? (w = /* @__PURE__ */ m(_, { ...E }), e[25] = _, e[26] = E, e[27] = w) : w = e[27], w;
    }
    case "file": {
      let w;
      return e[28] !== C || e[29] !== E ? (w = /* @__PURE__ */ m(C, { ...E }), e[28] = C, e[29] = E, e[30] = w) : w = e[30], w;
    }
    case "audio": {
      let w;
      return e[31] !== b || e[32] !== E ? (w = /* @__PURE__ */ m(b, { ...E }), e[31] = b, e[32] = E, e[33] = w) : w = e[33], w;
    }
    case "data": {
      const w = f?.by_name?.[E.name] ?? f?.Fallback;
      let A;
      return e[34] !== w || e[35] !== E ? (A = /* @__PURE__ */ m(ug, {
        ...E,
        Fallback: w
      }), e[34] = w, e[35] = E, e[36] = A) : A = e[36], A;
    }
    case "generative-ui": {
      if (!h?.components)
        return null;
      const w = E;
      let A;
      return e[37] !== h.Fallback || e[38] !== h.components || e[39] !== w.spec ? (A = /* @__PURE__ */ m(Xr, {
        spec: w.spec,
        components: h.components,
        Fallback: h.Fallback
      }), e[37] = h.Fallback, e[38] = h.components, e[39] = w.spec, e[40] = A) : A = e[40], A;
    }
    default:
      return console.warn(`Unknown message part type: ${g}`), null;
  }
}, Gt = ve((t) => {
  const e = x(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(dg, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let i;
  return e[2] !== s || e[3] !== r ? (i = /* @__PURE__ */ m(Gr, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = i) : i = e[4], i;
}, (t, e) => t.index === e.index && t.components?.Text === e.components?.Text && t.components?.Reasoning === e.components?.Reasoning && t.components?.Source === e.components?.Source && t.components?.Image === e.components?.Image && t.components?.File === e.components?.File && t.components?.Unstable_Audio === e.components?.Unstable_Audio && t.components?.tools === e.components?.tools && t.components?.data === e.components?.data && t.components?.generativeUI === e.components?.generativeUI && t.components?.ToolGroup === e.components?.ToolGroup && t.components?.ReasoningGroup === e.components?.ReasoningGroup);
Gt.displayName = "MessagePrimitive.PartByIndex";
const hg = (t) => {
  const e = x(6), { status: s, component: n } = t, r = s.type === "running";
  let i;
  e[0] !== n || e[1] !== s ? (i = /* @__PURE__ */ m(n, {
    type: "text",
    text: "",
    status: s
  }), e[0] = n, e[1] = s, e[2] = i) : i = e[2];
  let o;
  return e[3] !== r || e[4] !== i ? (o = /* @__PURE__ */ m(Wr, {
    text: "",
    isRunning: r,
    children: i
  }), e[3] = r, e[4] = i, e[5] = o) : o = e[5], o;
}, fg = Object.freeze({ type: "complete" }), mg = Object.freeze({ type: "running" }), pg = (t) => {
  const e = x(6), { components: s } = t, n = D(Mg);
  if (s?.Empty) {
    let o;
    return e[0] !== s.Empty || e[1] !== n ? (o = /* @__PURE__ */ m(s.Empty, { status: n }), e[0] = s.Empty, e[1] = n, e[2] = o) : o = e[2], o;
  }
  if (n.type !== "running") return null;
  const r = s?.Text ?? me.Text;
  let i;
  return e[3] !== n || e[4] !== r ? (i = /* @__PURE__ */ m(hg, {
    status: n,
    component: r
  }), e[3] = n, e[4] = r, e[5] = i) : i = e[5], i;
}, xc = ve(pg, (t, e) => t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), gg = (t) => {
  const e = x(4), { components: s, enabled: n } = t;
  let r;
  if (e[0] !== n ? (r = (o) => {
    if (!n || o.message.parts.length === 0) return !1;
    const a = o.message.parts[o.message.parts.length - 1];
    return a?.type !== "text" && a?.type !== "reasoning";
  }, e[0] = n, e[1] = r) : r = e[1], !D(r)) return null;
  let i;
  return e[2] !== s ? (i = /* @__PURE__ */ m(xc, { components: s }), e[2] = s, e[3] = i) : i = e[3], i;
}, bg = ve(gg, (t, e) => t.enabled === e.enabled && t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), _g = (t) => {
  const e = x(4), { Quote: s } = t, n = D(yc);
  if (!n) return null;
  let r;
  return e[0] !== s || e[1] !== n.messageId || e[2] !== n.text ? (r = /* @__PURE__ */ m(s, {
    text: n.text,
    messageId: n.messageId
  }), e[0] = s, e[1] = n.messageId, e[2] = n.text, e[3] = r) : r = e[3], r;
}, vg = ve(_g);
function Ic(t, e) {
  const s = t.toolUIs[e.toolName]?.[0]?.render ?? null;
  return s || (rg(e.mcp?.app?.resourceUri) && t.mcpApp ? t.mcpApp.render : null);
}
const Tc = () => {
  const t = x(6), e = re(), s = D(kg), n = D(Dg);
  if (!n || s.type !== "tool-call") return null;
  let r;
  return t[0] !== n || t[1] !== e.part.addToolResult || t[2] !== e.part.respondToToolApproval || t[3] !== e.part.resumeToolCall || t[4] !== s ? (r = /* @__PURE__ */ m(n, {
    ...s,
    addResult: e.part.addToolResult,
    resume: e.part.resumeToolCall,
    respondToApproval: e.part.respondToToolApproval
  }), t[0] = n, t[1] = e.part.addToolResult, t[2] = e.part.respondToToolApproval, t[3] = e.part.resumeToolCall, t[4] = s, t[5] = r) : r = t[5], r;
}, Cc = () => {
  const t = x(3), e = D(Pg), s = D(Og);
  if (!s || e.type !== "data") return null;
  const n = e;
  let r;
  return t[0] !== s || t[1] !== n ? (r = /* @__PURE__ */ m(s, { ...n }), t[0] = s, t[1] = n, t[2] = r) : r = t[2], r;
}, yg = () => {
  const t = x(2), e = D(Ng);
  if (e === "tool-call") {
    let s;
    return t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = /* @__PURE__ */ m(Tc, {}), t[0] = s) : s = t[0], s;
  }
  if (e === "data") {
    let s;
    return t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = /* @__PURE__ */ m(Cc, {}), t[1] = s) : s = t[1], s;
  }
  return null;
}, wg = Object.freeze({
  type: "text",
  text: "",
  status: mg
}), Sg = ({ children: t }) => {
  const e = re(), s = D((n) => n.dataRenderers);
  return /* @__PURE__ */ m(sn, {
    getItemState: (n) => n.part.getState(),
    children: (n) => t({ get part() {
      const r = n();
      if (r.type === "tool-call") {
        const i = Ic(e.tools.getState(), r) !== null, o = e.part;
        return {
          ...r,
          toolUI: i ? /* @__PURE__ */ m(Tc, {}) : null,
          addResult: o.addToolResult,
          resume: o.resumeToolCall,
          respondToApproval: o.respondToToolApproval
        };
      }
      if (r.type === "data") {
        const i = Kr(s, r.name, void 0) !== void 0;
        return {
          ...r,
          dataRendererUI: i ? /* @__PURE__ */ m(Cc, {}) : null
        };
      }
      return r;
    } })
  });
}, Ec = (t) => {
  const e = x(5), { index: s, children: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(Sg, { children: n }), e[0] = n, e[1] = r) : r = e[1];
  let i;
  return e[2] !== s || e[3] !== r ? (i = /* @__PURE__ */ m(Gr, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = i) : i = e[4], i;
}, xg = (t) => {
  const e = x(9), { children: s } = t, n = D($g), r = D(Bg), i = n === 0 && r;
  if (n === 0) {
    if (!i) return null;
    let a;
    e[0] !== s ? (a = s({ part: wg }), e[0] = s, e[1] = a) : a = e[1];
    let c;
    return e[2] !== a ? (c = /* @__PURE__ */ m(Wr, {
      text: "",
      isRunning: !0,
      children: a
    }), e[2] = a, e[3] = c) : c = e[3], c;
  }
  let o;
  if (e[4] !== s || e[5] !== n) {
    let a;
    e[7] !== s ? (a = (c, l) => /* @__PURE__ */ m(Ec, {
      index: l,
      children: (u) => s(u) ?? /* @__PURE__ */ m(yg, {})
    }, l), e[7] = s, e[8] = a) : a = e[8], o = /* @__PURE__ */ m($e, { children: Array.from({ length: n }, a) }), e[4] = s, e[5] = n, e[6] = o;
  } else o = e[6];
  return o;
}, Kn = (t) => {
  const e = x(5), { components: s, unstable_showEmptyOnNonTextEnd: n, children: r } = t, i = n === void 0 ? !0 : n;
  if (r) {
    let a;
    return e[0] !== r ? (a = /* @__PURE__ */ m(xg, { children: r }), e[0] = r, e[1] = a) : a = e[1], a;
  }
  let o;
  return e[2] !== s || e[3] !== i ? (o = /* @__PURE__ */ m(Ig, {
    components: s,
    unstable_showEmptyOnNonTextEnd: i
  }), e[2] = s, e[3] = i, e[4] = o) : o = e[4], o;
};
Kn.displayName = "MessagePrimitive.Parts";
const Ig = (t) => {
  const e = x(15), { components: s, unstable_showEmptyOnNonTextEnd: n } = t, r = D(Fg), i = !!s?.ChainOfThought, { ranges: o, partIds: a } = cg(i);
  let c;
  e: {
    if (r === 0) {
      let p;
      e[0] !== s ? (p = /* @__PURE__ */ m(xc, { components: s }), e[0] = s, e[1] = p) : p = e[1], c = p;
      break e;
    }
    let d;
    if (e[2] !== s || e[3] !== o || e[4] !== a) {
      const p = /* @__PURE__ */ new Set(), _ = (v) => {
        const C = a[v];
        return C !== void 0 && !p.has(C) ? (p.add(C), `part-id:${C}`) : `part-${v}`;
      };
      d = o.map((v) => {
        if (v.type === "single") return /* @__PURE__ */ m(Gt, {
          index: v.index,
          components: s
        }, v.index);
        if (v.type === "chainOfThoughtGroup") {
          const C = s?.ChainOfThought;
          return C ? /* @__PURE__ */ m(ap, {
            startIndex: v.startIndex,
            endIndex: v.endIndex,
            children: /* @__PURE__ */ m(C, {})
          }, `chainOfThought-${v.idKey ?? v.startIndex}`) : null;
        } else if (v.type === "toolGroup") {
          const C = s?.ToolGroup ?? me.ToolGroup;
          return /* @__PURE__ */ m(C, {
            startIndex: v.startIndex,
            endIndex: v.endIndex,
            children: Array.from({ length: v.endIndex - v.startIndex + 1 }, (b, S) => {
              const I = v.startIndex + S;
              return /* @__PURE__ */ m(Gt, {
                index: I,
                components: s
              }, _(I));
            })
          }, `tool-${v.idKey ?? v.startIndex}`);
        } else {
          const C = s?.ReasoningGroup ?? me.ReasoningGroup;
          return /* @__PURE__ */ m(C, {
            startIndex: v.startIndex,
            endIndex: v.endIndex,
            children: Array.from({ length: v.endIndex - v.startIndex + 1 }, (b, S) => {
              const I = v.startIndex + S;
              return /* @__PURE__ */ m(Gt, {
                index: I,
                components: s
              }, `part-${I}`);
            })
          }, `reasoning-${v.startIndex}`);
        }
      }), e[2] = s, e[3] = o, e[4] = a, e[5] = d;
    } else d = e[5];
    c = d;
  }
  const l = c;
  let u;
  e[6] !== s ? (u = s?.Quote && /* @__PURE__ */ m(vg, { Quote: s.Quote }), e[6] = s, e[7] = u) : u = e[7];
  let f;
  e[8] !== s || e[9] !== n ? (f = /* @__PURE__ */ m(bg, {
    components: s,
    enabled: n
  }), e[8] = s, e[9] = n, e[10] = f) : f = e[10];
  let h;
  return e[11] !== l || e[12] !== u || e[13] !== f ? (h = /* @__PURE__ */ N($e, { children: [
    u,
    l,
    f
  ] }), e[11] = l, e[12] = u, e[13] = f, e[14] = h) : h = e[14], h;
};
function Tg(t) {
  return t.type;
}
function Cg(t) {
  return t.message.parts.map(Tg);
}
function Eg(t) {
  return t.type === "tool-call" ? t.toolCallId : void 0;
}
function Ag(t) {
  return t.message.parts.map(Eg);
}
function Rg(t) {
  return t.part;
}
function Mg(t) {
  return t.message.status ?? fg;
}
function kg(t) {
  return t.part;
}
function Dg(t) {
  return t.part.type === "tool-call" ? Ic(t.tools, t.part) : null;
}
function Pg(t) {
  return t.part;
}
function Og(t) {
  return t.part.type === "data" ? Kr(t.dataRenderers, t.part.name, void 0) ?? null : null;
}
function Ng(t) {
  return t.part.type;
}
function $g(t) {
  return t.message.parts.length;
}
function Bg(t) {
  return (t.message.status?.type ?? "complete") === "running";
}
function Fg(t) {
  return t.message.parts.length;
}
const Lg = /* @__PURE__ */ Symbol.for("@assistant-ui/groupBy.memoKey"), Zi = (t) => {
  const e = t.nextChildIdx++;
  return t.nodeKey === "" ? String(e) : `${t.nodeKey}.${e}`;
}, eo = (t, e) => {
  if (!(e === void 0 || t.claimed.has(e)))
    return t.claimed.add(e), `id:${e}`;
}, Vg = (t, e) => {
  const s = {
    key: "",
    nodeKey: "",
    indices: [],
    children: [],
    nextChildIdx: 0,
    claimed: /* @__PURE__ */ new Set()
  }, n = [s], r = () => {
    const i = n.pop(), o = n[n.length - 1];
    o.children.push({
      type: "group",
      key: i.key,
      nodeKey: i.nodeKey,
      idKey: eo(o, e?.[i.indices[0]]),
      indices: i.indices,
      children: i.children
    });
  };
  for (let i = 0; i < t.length; i++) {
    const o = t[i];
    let a = 0;
    for (; a < n.length - 1 && a < o.length && n[a + 1].key === o[a]; ) a++;
    for (; n.length - 1 > a; ) r();
    for (; n.length - 1 < o.length; ) {
      const l = n[n.length - 1];
      n.push({
        key: o[n.length - 1],
        nodeKey: Zi(l),
        indices: [],
        children: [],
        nextChildIdx: 0,
        claimed: /* @__PURE__ */ new Set()
      });
    }
    const c = n[n.length - 1];
    c.children.push({
      type: "part",
      index: i,
      nodeKey: Zi(c),
      idKey: eo(c, e?.[i])
    });
    for (let l = 1; l < n.length; l++) n[l].indices.push(i);
  }
  for (; n.length > 1; ) r();
  return s.children;
}, jg = (t, e, s) => {
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
}, Ac = () => {
  throw new Error("MessagePrimitive.GroupedParts: rendered `children` under a leaf part. `children` is only meaningful for `group-…` cases — add a matching case for the part type or return `null` to skip it.");
}, Rc = (t, e, s) => {
  if (t.type === "part") return /* @__PURE__ */ m(Ec, {
    index: t.index,
    children: ({ part: i }) => s({
      part: i,
      children: /* @__PURE__ */ m(Ac, {})
    })
  }, t.idKey ? `part-${t.idKey}` : `part-${t.index}`);
  const n = rc(e, t.indices), r = {
    type: t.key,
    status: n,
    indices: t.indices
  };
  return /* @__PURE__ */ m(hd, { children: s({
    part: r,
    children: /* @__PURE__ */ m($e, { children: t.children.map((i) => Rc(i, e, s)) })
  }) }, t.idKey ?? t.nodeKey);
}, Mc = ({ groupBy: t, indicator: e = "no-text", children: s }) => {
  const n = D(Xn((c) => c.message.parts)), r = D((c) => c.tools.toolUIs), i = D((c) => e === "never" ? !1 : c.message.status?.type === "running"), o = t[Lg] ?? t, a = fe(() => {
    const c = { toolUIs: r };
    return Vg(n.map((l) => t(l, c) ?? []), n.map((l) => l.type === "tool-call" ? l.toolCallId : void 0));
  }, [
    n,
    o,
    r
  ]);
  return /* @__PURE__ */ N($e, { children: [a.map((c) => Rc(c, n, s)), jg(e, n, i) && s({
    part: { type: "indicator" },
    children: /* @__PURE__ */ m(Ac, {})
  })] });
};
Mc.displayName = "MessagePrimitive.GroupedParts";
const qg = (t) => {
  const e = x(5), { children: s } = t, n = D(yc);
  if (!n) return null;
  let r;
  e[0] !== s || e[1] !== n ? (r = s(n), e[0] = s, e[1] = n, e[2] = r) : r = e[2];
  let i;
  return e[3] !== r ? (i = /* @__PURE__ */ m($e, { children: r }), e[3] = r, e[4] = i) : i = e[4], i;
}, kc = ve(qg);
kc.displayName = "MessagePrimitive.Quote";
const Dc = (t, e) => {
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
}, Ug = (t) => {
  const e = x(5), { components: s } = t, n = D(Hg);
  if (!n) return null;
  const r = n;
  let i;
  e[0] !== s || e[1] !== r ? (i = Dc(s, r), e[0] = s, e[1] = r, e[2] = i) : i = e[2];
  const o = i;
  if (!o) return null;
  let a;
  return e[3] !== o ? (a = /* @__PURE__ */ m(o, {}), e[3] = o, e[4] = a) : a = e[4], a;
}, Pc = ve((t) => {
  const e = x(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(Ug, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let i;
  return e[2] !== s || e[3] !== r ? (i = /* @__PURE__ */ m(sc, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = i) : i = e[4], i;
}, (t, e) => t.index === e.index && t.components?.Image === e.components?.Image && t.components?.Document === e.components?.Document && t.components?.File === e.components?.File && t.components?.Attachment === e.components?.Attachment);
Pc.displayName = "MessagePrimitive.AttachmentByIndex";
const to = ({ children: t }) => {
  const e = D((s) => s.message.role !== "user" ? 0 : (s.message.attachments ?? []).length);
  return fe(() => Array.from({ length: e }, (s, n) => /* @__PURE__ */ m(sc, {
    index: n,
    children: /* @__PURE__ */ m(sn, {
      getItemState: (r) => r.message.attachment({ index: n }).getState(),
      children: (r) => t({ get attachment() {
        return r();
      } })
    })
  }, n)), [e, t]);
}, Oc = (t) => {
  const e = x(4), { components: s, children: n } = t;
  if (s) {
    let i;
    return e[0] !== s ? (i = /* @__PURE__ */ m(to, { children: (o) => {
      const { attachment: a } = o, c = Dc(s, a);
      return c ? /* @__PURE__ */ m(c, {}) : null;
    } }), e[0] = s, e[1] = i) : i = e[1], i;
  }
  let r;
  return e[2] !== n ? (r = /* @__PURE__ */ m(to, { children: n }), e[2] = n, e[3] = r) : r = e[3], r;
};
Oc.displayName = "MessagePrimitive.Attachments";
function Hg(t) {
  return t.attachment;
}
const Zr = (t) => {
  const { children: e } = t;
  return D(zg) ? e : null;
};
Zr.displayName = "MessagePartPrimitive.InProgress";
function zg(t) {
  return t.part.status.type === "running";
}
const Nc = (t) => {
  const e = x(2), { components: s } = t, n = s.Suggestion;
  let r;
  return e[0] !== n ? (r = /* @__PURE__ */ m(n, {}), e[0] = n, e[1] = r) : r = e[1], r;
}, $c = ve((t) => {
  const e = x(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(Nc, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let i;
  return e[2] !== s || e[3] !== r ? (i = /* @__PURE__ */ m(ic, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = i) : i = e[4], i;
}, (t, e) => t.index === e.index && t.components.Suggestion === e.components.Suggestion);
$c.displayName = "ThreadPrimitive.SuggestionByIndex";
const so = ({ children: t }) => {
  const e = D((s) => s.suggestions.suggestions.length);
  return fe(() => e === 0 ? null : Array.from({ length: e }, (s, n) => /* @__PURE__ */ m(ic, {
    index: n,
    children: /* @__PURE__ */ m(sn, {
      getItemState: (r) => r.suggestions.suggestion({ index: n }).getState(),
      children: (r) => t({ get suggestion() {
        return r();
      } })
    })
  }, n)), [e, t]);
}, Bc = (t) => {
  const e = x(4), { components: s, children: n } = t;
  if (s) {
    let i;
    return e[0] !== s ? (i = /* @__PURE__ */ m(so, { children: () => /* @__PURE__ */ m(Nc, { components: s }) }), e[0] = s, e[1] = i) : i = e[1], i;
  }
  let r;
  return e[2] !== n ? (r = /* @__PURE__ */ m(so, { children: n }), e[2] = n, e[3] = r) : r = e[3], r;
};
Bc.displayName = "ThreadPrimitive.Suggestions";
const Gg = ve(Bc, (t, e) => t.children || e.children ? t.children === e.children : t.components.Suggestion === e.components.Suggestion), Wg = (t) => t.composer.isEditing, Yg = (t) => t.thread.isRunning || t.thread.isDisabled || t.message.role !== "assistant", Qg = (t) => !((t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some((e) => e.type === "text" && e.text.length > 0)), Jg = (t, e) => t.thread.isDisabled || e && t.thread.isRunning && !t.thread.capabilities.queue, Xg = (t) => {
  const e = x(15);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { copiedDuration: n, copyToClipboard: r } = s, i = n === void 0 ? 3e3 : n, o = re(), a = D(Qg), c = D(Kg), l = D(Zg), u = D(eb), f = oe(void 0), h = oe(0);
  let d, p;
  e[2] !== o ? (d = () => () => {
    h.current = h.current + 1, f.current !== void 0 && (clearTimeout(f.current), f.current = void 0, o.message.setIsCopied(!1));
  }, p = [o], e[2] = o, e[3] = d, e[4] = p) : (d = e[3], p = e[4]), K(d, p);
  let _;
  e[5] !== o || e[6] !== u || e[7] !== i || e[8] !== r || e[9] !== l ? (_ = () => {
    if (!r) return;
    const S = l ? u : o.message.getCopyText();
    if (!S) return;
    const I = h.current;
    Promise.resolve(r(S)).then(() => {
      I === h.current && (f.current !== void 0 && clearTimeout(f.current), o.message.setIsCopied(!0), f.current = setTimeout(() => {
        f.current = void 0, o.message.setIsCopied(!1);
      }, i));
    }, tb);
  }, e[5] = o, e[6] = u, e[7] = i, e[8] = r, e[9] = l, e[10] = _) : _ = e[10];
  const v = _, C = a || !r;
  let b;
  return e[11] !== v || e[12] !== c || e[13] !== C ? (b = {
    copy: v,
    disabled: C,
    isCopied: c
  }, e[11] = v, e[12] = c, e[13] = C, e[14] = b) : b = e[14], b;
};
function Kg(t) {
  return t.message.isCopied;
}
function Zg(t) {
  return t.composer.isEditing;
}
function eb(t) {
  return t.composer.text;
}
function tb() {
}
const sb = () => {
  const t = x(5), e = re(), s = D(Wg);
  let n;
  t[0] !== e ? (n = () => {
    e.composer.beginEdit();
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let i;
  return t[2] !== s || t[3] !== r ? (i = {
    edit: r,
    disabled: s
  }, t[2] = s, t[3] = r, t[4] = i) : i = t[4], i;
}, nb = () => {
  const t = x(5), e = re(), s = D(Yg);
  let n;
  t[0] !== e ? (n = () => {
    e.message.reload();
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let i;
  return t[2] !== s || t[3] !== r ? (i = {
    reload: r,
    disabled: s
  }, t[2] = s, t[3] = r, t[4] = i) : i = t[4], i;
}, rb = () => {
  const t = x(5), e = re(), s = D(ob);
  let n;
  t[0] !== e ? (n = () => {
    e.message.submitFeedback({ type: "positive" });
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let i;
  return t[2] !== s || t[3] !== r ? (i = {
    submit: r,
    isSubmitted: s
  }, t[2] = s, t[3] = r, t[4] = i) : i = t[4], i;
}, ib = () => {
  const t = x(5), e = re(), s = D(ab);
  let n;
  t[0] !== e ? (n = () => {
    e.message.submitFeedback({ type: "negative" });
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let i;
  return t[2] !== s || t[3] !== r ? (i = {
    submit: r,
    isSubmitted: s
  }, t[2] = s, t[3] = r, t[4] = i) : i = t[4], i;
};
function ob(t) {
  return t.message.metadata.submittedFeedback?.type === "positive";
}
function ab(t) {
  return t.message.metadata.submittedFeedback?.type === "negative";
}
const cb = () => {
  const t = x(5), e = re(), s = D(ub);
  let n;
  t[0] !== e ? (n = async () => {
    e.message.speak();
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let i;
  return t[2] !== s || t[3] !== r ? (i = {
    speak: r,
    disabled: s
  }, t[2] = s, t[3] = r, t[4] = i) : i = t[4], i;
};
function lb(t) {
  return t.type === "text" && t.text.length > 0;
}
function ub(t) {
  return !((t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some(lb));
}
const db = () => {
  const t = x(5), e = re(), s = D(hb);
  let n;
  t[0] !== e ? (n = () => {
    e.message.stopSpeaking();
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let i;
  return t[2] !== s || t[3] !== r ? (i = {
    stopSpeaking: r,
    disabled: s
  }, t[2] = s, t[3] = r, t[4] = i) : i = t[4], i;
};
function hb(t) {
  return t.message.speech == null;
}
const fb = (t) => {
  const e = x(10), { prompt: s, send: n, clearComposer: r } = t, i = r === void 0 ? !0 : r, o = re(), a = n ?? !1;
  let c;
  e[0] !== a ? (c = (d) => Jg(d, a), e[0] = a, e[1] = c) : c = e[1];
  const l = D(c);
  let u;
  e[2] !== o || e[3] !== i || e[4] !== s || e[5] !== a ? (u = () => {
    if (a) {
      const { isRunning: d, capabilities: p } = o.thread.getState();
      if (d && !p.queue) return;
      o.thread.append({
        content: [{
          type: "text",
          text: s
        }],
        runConfig: o.composer.getState().runConfig
      }), i && !d && o.composer.setText("");
    } else if (i) o.composer.setText(s);
    else {
      const d = o.composer.getState().text;
      o.composer.setText([d, s].filter(mb).join(" "));
    }
  }, e[2] = o, e[3] = i, e[4] = s, e[5] = a, e[6] = u) : u = e[6];
  const f = u;
  let h;
  return e[7] !== l || e[8] !== f ? (h = {
    trigger: f,
    disabled: l
  }, e[7] = l, e[8] = f, e[9] = h) : h = e[9], h;
};
function mb(t) {
  return t.trim();
}
const pb = () => D(gb);
function gb(t) {
  if (t.message.status?.type !== "incomplete" || t.message.status.reason !== "error") return;
  const e = t.message.status.error;
  return typeof e == "string" ? e : typeof e == "object" && e !== null && "message" in e && typeof e.message == "string" ? e.message : e ?? "An error occurred";
}
function bb(t, e) {
  function s(n) {
    const r = Qs(t);
    if (!n?.optional && !r) throw new Error(`This component must be used within ${e}.`);
    return r;
  }
  return s;
}
function Fc(t, e) {
  function s(r) {
    const i = t(r);
    return i ? i[e] : null;
  }
  function n(r) {
    let i = !1, o;
    typeof r == "function" ? o = r : r && typeof r == "object" && (i = !!r.optional, o = r.selector);
    const a = s({ optional: i });
    return a ? o ? a(o) : a() : null;
  }
  return {
    [e]: n,
    [`${e}Store`]: s
  };
}
const Lc = Ye(null), _b = bb(Lc, "ThreadPrimitive.Viewport"), { useThreadViewport: Xe, useThreadViewportStore: bt } = Fc(_b, "useThreadViewport"), no = (t) => {
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
}, vb = (t = {}) => {
  const e = /* @__PURE__ */ new Set(), s = no((o) => {
    i.setState({ height: {
      ...i.getState().height,
      viewport: o
    } });
  }), n = no((o) => {
    i.setState({ height: {
      ...i.getState().height,
      inset: o
    } });
  }), r = (o, a) => (i.setState({ element: {
    ...i.getState().element,
    [o]: a
  } }), () => {
    i.getState().element[o] === a && i.setState({ element: {
      ...i.getState().element,
      [o]: null
    } });
  }), i = Dl(() => ({
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
    registerViewport: s.register,
    registerContentInset: n.register,
    registerViewportElement: (o) => r("viewport", o),
    registerAnchorElement: (o) => r("anchor", o),
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
}, qs = (t) => t, yb = (t) => {
  const e = x(11);
  let s;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = { optional: !0 }, e[0] = s) : s = e[0];
  const n = bt(s);
  let r;
  e[1] !== t ? (r = () => vb(t), e[1] = t, e[2] = r) : r = e[2];
  const [i] = ue(r);
  let o, a;
  e[3] !== n || e[4] !== i ? (o = () => n?.getState().onScrollToBottom(() => {
    i.getState().scrollToBottom();
  }), a = [n, i], e[3] = n, e[4] = i, e[5] = o, e[6] = a) : (o = e[5], a = e[6]), K(o, a);
  let c, l;
  return e[7] !== n || e[8] !== i ? (c = () => {
    if (n)
      return i.subscribe((u) => {
        n.getState().isAtBottom !== u.isAtBottom && qs(n).setState({ isAtBottom: u.isAtBottom });
      });
  }, l = [i, n], e[7] = n, e[8] = i, e[9] = c, e[10] = l) : (c = e[9], l = e[10]), K(c, l), i;
}, ei = (t) => {
  const e = x(7), { children: s, options: n } = t;
  let r;
  e[0] !== n ? (r = n === void 0 ? {} : n, e[0] = n, e[1] = r) : r = e[1];
  const i = yb(r);
  let o;
  e[2] !== i ? (o = () => ({ useThreadViewport: i }), e[2] = i, e[3] = o) : o = e[3];
  const [a] = ue(o);
  let c;
  return e[4] !== s || e[5] !== a ? (c = /* @__PURE__ */ m(Lc.Provider, {
    value: a,
    children: s
  }), e[4] = s, e[5] = a, e[6] = c) : c = e[6], c;
}, wb = () => {
  const t = x(3), e = re();
  let s, n;
  return t[0] !== e ? (s = () => {
  }, n = [e], t[0] = e, t[1] = s, t[2] = n) : (s = t[1], n = t[2]), K(s, n), null;
}, Sb = (t) => {
  const e = x(8), { children: s, aui: n, config: r, runtime: i } = t, o = n ?? null;
  let a;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (a = /* @__PURE__ */ m(wb, {}), e[0] = a) : a = e[0];
  let c;
  e[1] !== s ? (c = /* @__PURE__ */ m(ei, { children: s }), e[1] = s, e[2] = c) : c = e[2];
  let l;
  return e[3] !== r || e[4] !== i || e[5] !== o || e[6] !== c ? (l = /* @__PURE__ */ N(Wf, {
    runtime: i,
    aui: o,
    config: r,
    children: [a, c]
  }), e[3] = r, e[4] = i, e[5] = o, e[6] = c, e[7] = l) : l = e[7], l;
}, xb = ve(Sb);
var Ib = Object.defineProperty, ti = (t, e) => Ib(t, "name", { value: e, configurable: !0 });
function Zn(t, e) {
  if (typeof t == "function")
    return t(e);
  t != null && (t.current = e);
}
ti(Zn, "setRef");
function Vc(...t) {
  return (e) => {
    let s = !1;
    const n = t.map((r) => {
      const i = Zn(r, e);
      return !s && typeof i == "function" && (s = !0), i;
    });
    if (s)
      return () => {
        for (let r = 0; r < n.length; r++) {
          const i = n[r];
          typeof i == "function" ? i() : Zn(t[r], null);
        }
      };
  };
}
ti(Vc, "composeRefs");
function _t(...t) {
  return B(Vc(...t), t);
}
ti(_t, "useComposedRefs");
var ro = Object.defineProperty, si = (t, e) => {
  let s = {};
  for (var n in t) ro(s, n, {
    get: t[n],
    enumerable: !0
  });
  return ro(s, Symbol.toStringTag, { value: "Module" }), s;
}, Tb = Object.defineProperty, Ie = (t, e) => Tb(t, "name", { value: e, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function jc(t) {
  const e = $o((s, n) => {
    let { children: r, ...i } = s, o = null, a = !1;
    const c = [];
    r = Wc(r), ci.forEach(r, (h) => {
      if (zc(h)) {
        a = !0;
        const d = h;
        let p = "child" in d.props ? d.props.child : d.props.children;
        for (; ni(p) && typeof Us == "function"; )
          p = Us(p._payload);
        o = Eb(d, p), c.push(o?.props?.children);
      } else
        c.push(h);
    }), o ? o = Mn(o, void 0, c) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && ci.count(r) === 1 && Rs(r) && (o = r)
    );
    const l = o ? Hc(o) : void 0, u = _t(n, l);
    if (!o) {
      if (r || r === 0)
        throw new Error(
          a ? Mb(t) : Rb(t)
        );
      return r;
    }
    const f = Uc(i, o.props ?? {});
    return o.type !== Pl && (f.ref = n ? u : l), Mn(o, f);
  });
  return e.displayName = `${t}.Slot`, e;
}
Ie(jc, "createSlot");
var qc = /* @__PURE__ */ Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function Cb(t) {
  const e = /* @__PURE__ */ Ie((s) => "child" in s ? s.children(s.child) : s.children, "Slottable");
  return e.displayName = `${t}.Slottable`, e.__radixId = qc, e;
}
Ie(Cb, "createSlottable");
var Eb = /* @__PURE__ */ Ie((t, e) => "child" in t.props ? Rs(e) ? Mn(e, void 0, t.props.children(e.props.children)) : null : Rs(e) ? e : null, "getSlottableElementFromSlottable");
function Uc(t, e) {
  const s = { ...e };
  for (const n in e) {
    const r = t[n], i = e[n];
    /^on[A-Z]/.test(n) ? r && i ? s[n] = (...a) => {
      const c = i(...a);
      return r(...a), c;
    } : r && (s[n] = r) : n === "style" ? s[n] = { ...r, ...i } : n === "className" ? s[n] = [r, i].filter(Boolean).join(" ") : n === "aria-describedby" && (s[n] = Yc(i, r));
  }
  return { ...t, ...s };
}
Ie(Uc, "mergeProps");
function Hc(t) {
  let e = Object.getOwnPropertyDescriptor(t.props, "ref")?.get, s = e && "isReactWarning" in e && e.isReactWarning;
  return s ? t.ref : (e = Object.getOwnPropertyDescriptor(t, "ref")?.get, s = e && "isReactWarning" in e && e.isReactWarning, s ? t.props.ref : t.props.ref || t.ref);
}
Ie(Hc, "getElementRef");
function zc(t) {
  return Rs(t) && typeof t.type == "function" && "__radixId" in t.type && t.type.__radixId === qc;
}
Ie(zc, "isSlottable");
var Ab = /* @__PURE__ */ Symbol.for("react.lazy");
function ni(t) {
  return t != null && typeof t == "object" && "$$typeof" in t && t.$$typeof === Ab && "_payload" in t && Gc(t._payload);
}
Ie(ni, "isLazyComponent");
function Gc(t) {
  return typeof t == "object" && t !== null && "then" in t;
}
Ie(Gc, "isPromiseLike");
function Wc(t) {
  let e = t;
  for (; ni(e) && typeof Us == "function"; )
    e = Us(e._payload);
  return e;
}
Ie(Wc, "useUnwrappedLazy");
function Yc(...t) {
  const e = /* @__PURE__ */ new Set();
  for (const s of t)
    if (typeof s == "string")
      for (const n of String(s).trim().split(/\s+/))
        n && e.add(n);
  return e.size > 0 ? Array.from(e).join(" ") : void 0;
}
Ie(Yc, "concatAriaDescribedby");
var Rb = /* @__PURE__ */ Ie((t) => `${t} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), Mb = /* @__PURE__ */ Ie((t) => `${t} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), Us = Bo[" use ".trim().toString()], kb = Object.defineProperty, Db = (t, e) => kb(t, "name", { value: e, configurable: !0 }), Pb = [
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
], Ob = Pb.reduce((t, e) => {
  const s = /* @__PURE__ */ jc(`Primitive.${e}`), n = $o((r, i) => {
    const { asChild: o, ...a } = r, c = o ? s : e;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ m(c, { ...a, ref: i });
  });
  return n.displayName = `Primitive.${e}`, { ...t, [e]: n };
}, {});
function Nb(t, e) {
  t && bu(() => t.dispatchEvent(e));
}
Db(Nb, "dispatchDiscreteCustomEvent");
const $b = [
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
function Bb(t) {
  const e = ge((s, n) => {
    const r = x(17);
    let i, o, a, c;
    r[0] !== s ? ({ render: a, asChild: i, children: o, ...c } = s, r[0] = s, r[1] = i, r[2] = o, r[3] = a, r[4] = c) : (i = r[1], o = r[2], a = r[3], c = r[4]);
    const l = t;
    if (a && pd(a)) {
      const h = o !== void 0 ? o : a.props.children, d = c;
      let p;
      r[5] !== a || r[6] !== h ? (p = md(a, void 0, h), r[5] = a, r[6] = h, r[7] = p) : p = r[7];
      let _;
      return r[8] !== n || r[9] !== d || r[10] !== p ? (_ = /* @__PURE__ */ m(l, {
        ...d,
        asChild: !0,
        ref: n,
        children: p
      }), r[8] = n, r[9] = d, r[10] = p, r[11] = _) : _ = r[11], _;
    }
    const u = c;
    let f;
    return r[12] !== i || r[13] !== o || r[14] !== n || r[15] !== u ? (f = /* @__PURE__ */ m(l, {
      ...u,
      asChild: i,
      ref: n,
      children: o
    }), r[12] = i, r[13] = o, r[14] = n, r[15] = u, r[16] = f) : f = r[16], f;
  });
  return e.displayName = typeof t == "string" ? t : t.displayName ?? t.name ?? "Component", e;
}
function Fb(t) {
  const e = Ob[t], s = Bb(e);
  return s.displayName = `Primitive.${t}`, s;
}
const Te = $b.reduce((t, e) => (t[e] = Fb(e), t), {}), rt = {
  Hidden: "hidden",
  Floating: "floating",
  Normal: "normal"
}, Lb = (t) => {
  const e = x(5), { hideWhenRunning: s, autohide: n, autohideFloat: r, forceVisible: i } = t;
  let o;
  return e[0] !== n || e[1] !== r || e[2] !== i || e[3] !== s ? (o = (a) => {
    if (s && a.thread.isRunning) return rt.Hidden;
    const c = n === "always" || n === "not-last" && !a.message.isLast, l = i || a.message.isHovering;
    return c ? l ? r === "always" || r === "single-branch" && a.message.branchCount <= 1 ? rt.Floating : rt.Normal : rt.Hidden : rt.Normal;
  }, e[0] = n, e[1] = r, e[2] = i, e[3] = s, e[4] = o) : o = e[4], D(o);
}, Vb = Ye(null), Qc = ge((t, e) => {
  const s = x(18);
  let n, r, i, o;
  s[0] !== t ? ({ hideWhenRunning: i, autohide: n, autohideFloat: r, ...o } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = i, s[4] = o) : (n = s[1], r = s[2], i = s[3], o = s[4]);
  const [a, c] = ue(0);
  let l;
  s[5] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (l = () => {
    let b = !1;
    return c(jb), () => {
      b || (b = !0, c(qb));
    };
  }, s[5] = l) : l = s[5];
  const u = l;
  let f;
  s[6] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (f = { acquireInteractionLock: u }, s[6] = f) : f = s[6];
  const h = f, d = a > 0;
  let p;
  s[7] !== n || s[8] !== r || s[9] !== i || s[10] !== d ? (p = {
    hideWhenRunning: i,
    autohide: n,
    autohideFloat: r,
    forceVisible: d
  }, s[7] = n, s[8] = r, s[9] = i, s[10] = d, s[11] = p) : p = s[11];
  const _ = Lb(p);
  if (_ === rt.Hidden) return null;
  let v;
  s[12] !== _ ? (v = _ === rt.Floating ? { "data-floating": "true" } : null, s[12] = _, s[13] = v) : v = s[13];
  let C;
  return s[14] !== e || s[15] !== o || s[16] !== v ? (C = /* @__PURE__ */ m(Vb.Provider, {
    value: h,
    children: /* @__PURE__ */ m(Te.div, {
      ...v,
      ...o,
      ref: e
    })
  }), s[14] = e, s[15] = o, s[16] = v, s[17] = C) : C = s[17], C;
});
Qc.displayName = "ActionBarPrimitive.Root";
function jb(t) {
  return t + 1;
}
function qb(t) {
  return Math.max(0, t - 1);
}
var Ub = Object.defineProperty, Ot = (t, e) => Ub(t, "name", { value: e, configurable: !0 }), Jc = !!(typeof window < "u" && window.document && window.document.createElement);
function vt(t, e, { checkForDefaultPrevented: s = !0 } = {}) {
  return /* @__PURE__ */ Ot(function(r) {
    if (t?.(r), s === !1 || !r || !r.defaultPrevented)
      return e?.(r);
  }, "handleEvent");
}
Ot(vt, "composeEventHandlers");
function Hb(t) {
  if (!Jc)
    throw new Error("Cannot access window outside of the DOM");
  return t?.ownerDocument?.defaultView ?? window;
}
Ot(Hb, "getOwnerWindow");
function er(t) {
  if (!Jc)
    throw new Error("Cannot access document outside of the DOM");
  return t?.ownerDocument ?? document;
}
Ot(er, "getOwnerDocument");
function Xc(t, e = !1) {
  const { activeElement: s } = er(t);
  if (!s?.nodeName)
    return null;
  if (Kc(s) && s.contentDocument)
    return Xc(s.contentDocument.body, e);
  if (e) {
    const n = s.getAttribute("aria-activedescendant");
    if (n) {
      const r = er(s).getElementById(n);
      if (r)
        return r;
    }
  }
  return s;
}
Ot(Xc, "getActiveElement");
function Kc(t) {
  return t.tagName === "IFRAME";
}
Ot(Kc, "isFrame");
const zb = (t) => {
  const e = x(4);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { copiedDuration: n } = s, r = n === void 0 ? 3e3 : n;
  let i;
  e[2] !== r ? (i = {
    copiedDuration: r,
    copyToClipboard: Gb
  }, e[2] = r, e[3] = i) : i = e[3];
  const { copy: o, disabled: a } = Xg(i);
  return a ? null : o;
}, Zc = ge((t, e) => {
  const s = x(20);
  let n, r, i, o;
  s[0] !== t ? ({ copiedDuration: n, onClick: i, disabled: r, ...o } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = i, s[4] = o) : (n = s[1], r = s[2], i = s[3], o = s[4]);
  const a = D(Wb);
  let c;
  s[5] !== n ? (c = { copiedDuration: n }, s[5] = n, s[6] = c) : c = s[6];
  const l = zb(c);
  let u;
  s[7] !== a ? (u = a ? { "data-copied": "true" } : {}, s[7] = a, s[8] = u) : u = s[8];
  const f = r || !l;
  let h;
  s[9] !== l ? (h = () => {
    l?.();
  }, s[9] = l, s[10] = h) : h = s[10];
  let d;
  s[11] !== i || s[12] !== h ? (d = vt(i, h), s[11] = i, s[12] = h, s[13] = d) : d = s[13];
  let p;
  return s[14] !== e || s[15] !== o || s[16] !== u || s[17] !== f || s[18] !== d ? (p = /* @__PURE__ */ m(Te.button, {
    type: "button",
    ...u,
    ...o,
    ref: e,
    disabled: f,
    onClick: d
  }), s[14] = e, s[15] = o, s[16] = u, s[17] = f, s[18] = d, s[19] = p) : p = s[19], p;
});
Zc.displayName = "ActionBarPrimitive.Copy";
function Gb(t) {
  return typeof navigator > "u" || !navigator.clipboard ? Promise.reject(/* @__PURE__ */ new Error("Clipboard API is unavailable")) : navigator.clipboard.writeText(t);
}
function Wb(t) {
  return t.message.isCopied;
}
const as = (t, e, s = []) => {
  const n = ge((r, i) => {
    const o = x(6), a = {}, c = {};
    Object.keys(r).forEach((_) => {
      s.includes(_) ? a[_] = r[_] : c[_] = r[_];
    });
    const l = e(a) ?? void 0, u = Te, f = "button", h = c.disabled || !l, d = vt(c.onClick, l);
    let p;
    return o[0] !== i || o[1] !== c || o[2] !== u.button || o[3] !== h || o[4] !== d ? (p = /* @__PURE__ */ m(u.button, {
      type: f,
      ...c,
      ref: i,
      disabled: h,
      onClick: d
    }), o[0] = i, o[1] = c, o[2] = u.button, o[3] = h, o[4] = d, o[5] = p) : p = o[5], p;
  });
  return n.displayName = t, n;
}, Yb = () => {
  const { disabled: t, reload: e } = nb();
  return t ? null : e;
}, Qb = as("ActionBarPrimitive.Reload", Yb), Jb = () => {
  const { disabled: t, edit: e } = sb();
  return t ? null : e;
}, Xb = as("ActionBarPrimitive.Edit", Jb), Kb = () => {
  const { disabled: t, speak: e } = cb();
  return t ? null : e;
}, Zb = as("ActionBarPrimitive.Speak", Kb), e_ = () => {
  const { disabled: t, stopSpeaking: e } = db();
  return t ? null : e;
}, el = ge((t, e) => {
  const s = x(10), n = e_(), r = !n;
  let i;
  s[0] !== n ? (i = () => {
    n?.();
  }, s[0] = n, s[1] = i) : i = s[1];
  let o;
  s[2] !== t.onClick || s[3] !== i ? (o = vt(t.onClick, i), s[2] = t.onClick, s[3] = i, s[4] = o) : o = s[4];
  let a;
  return s[5] !== t || s[6] !== e || s[7] !== r || s[8] !== o ? (a = /* @__PURE__ */ m(Te.button, {
    type: "button",
    disabled: r,
    ...t,
    ref: e,
    onClick: o
  }), s[5] = t, s[6] = e, s[7] = r, s[8] = o, s[9] = a) : a = s[9], a;
});
el.displayName = "ActionBarPrimitive.StopSpeaking";
const t_ = () => {
  const { submit: t } = rb();
  return t;
}, tl = ge((t, e) => {
  const s = x(17);
  let n, r, i;
  s[0] !== t ? ({ onClick: r, disabled: n, ...i } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = i) : (n = s[1], r = s[2], i = s[3]);
  const o = D(s_), a = t_();
  let c;
  s[4] !== o ? (c = o ? { "data-submitted": "true" } : {}, s[4] = o, s[5] = c) : c = s[5];
  const l = n || !a;
  let u;
  s[6] !== a ? (u = () => {
    a?.();
  }, s[6] = a, s[7] = u) : u = s[7];
  let f;
  s[8] !== r || s[9] !== u ? (f = vt(r, u), s[8] = r, s[9] = u, s[10] = f) : f = s[10];
  let h;
  return s[11] !== e || s[12] !== i || s[13] !== c || s[14] !== l || s[15] !== f ? (h = /* @__PURE__ */ m(Te.button, {
    type: "button",
    ...c,
    ...i,
    ref: e,
    disabled: l,
    onClick: f
  }), s[11] = e, s[12] = i, s[13] = c, s[14] = l, s[15] = f, s[16] = h) : h = s[16], h;
});
tl.displayName = "ActionBarPrimitive.FeedbackPositive";
function s_(t) {
  return t.message.metadata.submittedFeedback?.type === "positive";
}
const n_ = () => {
  const { submit: t } = ib();
  return t;
}, sl = ge((t, e) => {
  const s = x(17);
  let n, r, i;
  s[0] !== t ? ({ onClick: r, disabled: n, ...i } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = i) : (n = s[1], r = s[2], i = s[3]);
  const o = D(r_), a = n_();
  let c;
  s[4] !== o ? (c = o ? { "data-submitted": "true" } : {}, s[4] = o, s[5] = c) : c = s[5];
  const l = n || !a;
  let u;
  s[6] !== a ? (u = () => {
    a?.();
  }, s[6] = a, s[7] = u) : u = s[7];
  let f;
  s[8] !== r || s[9] !== u ? (f = vt(r, u), s[8] = r, s[9] = u, s[10] = f) : f = s[10];
  let h;
  return s[11] !== e || s[12] !== i || s[13] !== c || s[14] !== l || s[15] !== f ? (h = /* @__PURE__ */ m(Te.button, {
    type: "button",
    ...c,
    ...i,
    ref: e,
    disabled: l,
    onClick: f
  }), s[11] = e, s[12] = i, s[13] = c, s[14] = l, s[15] = f, s[16] = h) : h = s[16], h;
});
sl.displayName = "ActionBarPrimitive.FeedbackNegative";
function r_(t) {
  return t.message.metadata.submittedFeedback?.type === "negative";
}
const i_ = (t) => {
  const e = x(6);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { filename: n, onExport: r } = s, i = re(), o = D(a_);
  let a;
  e[2] !== i.message || e[3] !== n || e[4] !== r ? (a = async () => {
    const l = i.message.getCopyText();
    if (!l) return;
    if (r) {
      await r(l);
      return;
    }
    const u = new Blob([l], { type: "text/markdown" }), f = URL.createObjectURL(u), h = document.createElement("a");
    h.href = f, h.download = n ?? `message-${Date.now()}.md`, h.click(), setTimeout(() => URL.revokeObjectURL(f), 4e4);
  }, e[2] = i.message, e[3] = n, e[4] = r, e[5] = a) : a = e[5];
  const c = a;
  return o ? c : null;
}, nl = ge((t, e) => {
  const s = x(19);
  let n, r, i, o, a;
  s[0] !== t ? ({ filename: r, onExport: o, onClick: i, disabled: n, ...a } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = i, s[4] = o, s[5] = a) : (n = s[1], r = s[2], i = s[3], o = s[4], a = s[5]);
  let c;
  s[6] !== r || s[7] !== o ? (c = {
    filename: r,
    onExport: o
  }, s[6] = r, s[7] = o, s[8] = c) : c = s[8];
  const l = i_(c), u = n || !l;
  let f;
  s[9] !== l ? (f = () => {
    l?.();
  }, s[9] = l, s[10] = f) : f = s[10];
  let h;
  s[11] !== i || s[12] !== f ? (h = vt(i, f), s[11] = i, s[12] = f, s[13] = h) : h = s[13];
  let d;
  return s[14] !== e || s[15] !== a || s[16] !== u || s[17] !== h ? (d = /* @__PURE__ */ m(Te.button, {
    type: "button",
    ...a,
    ref: e,
    disabled: u,
    onClick: h
  }), s[14] = e, s[15] = a, s[16] = u, s[17] = h, s[18] = d) : d = s[18], d;
});
nl.displayName = "ActionBarPrimitive.ExportMarkdown";
function o_(t) {
  return t.type === "text" && t.text.length > 0;
}
function a_(t) {
  return (t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some(o_);
}
var c_ = /* @__PURE__ */ si({
  Copy: () => Zc,
  Edit: () => Xb,
  ExportMarkdown: () => nl,
  FeedbackNegative: () => sl,
  FeedbackPositive: () => tl,
  Reload: () => Qb,
  Root: () => Qc,
  Speak: () => Zb,
  StopSpeaking: () => el
}), l_ = globalThis?.document ? Ol : () => {
}, u_ = Object.defineProperty, d_ = (t, e) => u_(t, "name", { value: e, configurable: !0 }), io = Bo[" useInsertionEffect ".trim().toString()];
function rn(t) {
  const e = ne(t);
  return typeof io == "function" ? io(() => {
    e.current = t;
  }) : l_(() => {
    e.current = t;
  }), Ge(() => ((...s) => e.current?.(...s)), []);
}
d_(rn, "useCallbackRef");
const h_ = (t) => {
  const e = x(12);
  let s;
  return e[0] !== t.assistant || e[1] !== t.copied || e[2] !== t.hasAttachments || e[3] !== t.hasBranches || e[4] !== t.hasContent || e[5] !== t.last || e[6] !== t.lastOrHover || e[7] !== t.speaking || e[8] !== t.submittedFeedback || e[9] !== t.system || e[10] !== t.user ? (s = (n) => {
    const { role: r, attachments: i, parts: o, branchCount: a, isLast: c, speech: l, isCopied: u, isHovering: f } = n.message;
    return !(t.hasBranches === !0 && a < 2 || t.user && r !== "user" || t.assistant && r !== "assistant" || t.system && r !== "system" || t.lastOrHover === !0 && !f && !c || t.last !== void 0 && t.last !== c || t.copied === !0 && !u || t.copied === !1 && u || t.speaking === !0 && l == null || t.speaking === !1 && l != null || t.hasAttachments === !0 && (r !== "user" || !i?.length) || t.hasAttachments === !1 && r === "user" && i?.length || t.hasContent === !0 && o.length === 0 || t.hasContent === !1 && o.length > 0 || t.submittedFeedback !== void 0 && (n.message.metadata.submittedFeedback?.type ?? null) !== t.submittedFeedback);
  }, e[0] = t.assistant, e[1] = t.copied, e[2] = t.hasAttachments, e[3] = t.hasBranches, e[4] = t.hasContent, e[5] = t.last, e[6] = t.lastOrHover, e[7] = t.speaking, e[8] = t.submittedFeedback, e[9] = t.system, e[10] = t.user, e[11] = s) : s = e[11], D(s);
}, rl = (t) => {
  const e = x(3);
  let s, n;
  return e[0] !== t ? ({ children: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]), h_(n) ? s : null;
};
rl.displayName = "MessagePrimitive.If";
const f_ = (t) => {
  const e = x(4), s = rn(t), n = Xe(m_);
  let r, i;
  e[0] !== s || e[1] !== n ? (r = () => n(s), i = [n, s], e[0] = s, e[1] = n, e[2] = r, e[3] = i) : (r = e[2], i = e[3]), K(r, i);
};
function m_(t) {
  return t.onScrollToBottom;
}
const p_ = () => !1, g_ = () => {
}, b_ = (t) => {
  const e = x(4);
  let s;
  e[0] !== t ? (s = (i) => {
    if (typeof window > "u" || t === null || !window.matchMedia) return g_;
    const o = window.matchMedia(t);
    return o.addEventListener("change", i), () => o.removeEventListener("change", i);
  }, e[0] = t, e[1] = s) : s = e[1];
  const n = s;
  let r;
  return e[2] !== t ? (r = () => typeof window > "u" || t === null || !window.matchMedia ? !1 : window.matchMedia(t).matches, e[2] = t, e[3] = r) : r = e[3], Ws(n, r, p_);
}, __ = Object.freeze({ type: "complete" }), v_ = Object.freeze({
  type: "text",
  text: "",
  status: __
}), y_ = () => D(w_);
function w_(t) {
  return t.part.type !== "text" && t.part.type !== "reasoning" ? v_ : t.part;
}
const S_ = Ye(null);
function x_(t) {
  const e = Qs(S_);
  if (!t?.optional && !e) throw new Error("This component must be used within a SmoothContextProvider.");
  return e;
}
const { useSmoothStatus: pw, useSmoothStatusStore: I_ } = Fc(x_, "useSmoothStatus"), il = 250, ol = 5;
var T_ = class {
  animationFrameId = null;
  lastUpdateTime = Date.now();
  lastCommitTime = 0;
  targetText = "";
  drainMs = il;
  maxCharIntervalMs = ol;
  maxCharsPerFrame = 1 / 0;
  minCommitMs = 0;
  currentText;
  setText;
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
    let i = 0;
    for (; e >= n && i < r; )
      i++, e -= n;
    i === r && r === this.maxCharsPerFrame && (e = 0), i !== s ? this.animationFrameId = requestAnimationFrame(this.animate) : this.animationFrameId = null, i !== 0 && (this.currentText = this.targetText.slice(0, this.currentText.length + i), this.lastUpdateTime = t - e, (i === s || t - this.lastCommitTime >= this.minCommitMs) && (this.lastCommitTime = t, this.setText(this.currentText)));
  };
};
const xn = Object.freeze({ type: "running" }), ys = (t, e) => t !== void 0 && t > 0 ? t : e, C_ = (t, e = !1) => {
  const { text: s } = t, n = b_("(prefers-reduced-motion: reduce)"), r = typeof e == "object" && e !== null ? e : void 0, i = e !== !1 && e !== null && !n, o = ys(r?.drainMs, il), a = ys(r?.maxCharIntervalMs, ol), c = ys(r?.maxCharsPerFrame, 1 / 0), l = ys(r?.minCommitMs, 0), [u, f] = ue(t.status.type === "running" ? "" : s), h = re(), d = D(() => h.part), [p, _] = ue(d);
  (d !== p || !s.startsWith(u)) && (_(d), f(t.status.type === "running" ? "" : s));
  const v = I_({ optional: !0 }), C = rn((I) => {
    if (f(I), v) {
      const T = u !== I || t.status.type === "running" ? xn : t.status;
      qs(v).setState(T, !0);
    }
  });
  K(() => {
    if (v) {
      const I = i && (u !== s || t.status.type === "running") ? xn : t.status;
      qs(v).setState(I, !0);
    }
  }, [
    v,
    i,
    s,
    u,
    t.status
  ]);
  const [b] = ue(new T_(u, C));
  K(() => {
    b.drainMs = o, b.maxCharIntervalMs = a, b.maxCharsPerFrame = c, b.minCommitMs = l;
  }, [
    b,
    o,
    a,
    c,
    l
  ]);
  const S = oe(d);
  return K(() => {
    if (!i) {
      b.stop();
      return;
    }
    const I = S.current !== d;
    if (S.current = d, I || !s.startsWith(b.targetText)) {
      t.status.type === "running" ? (b.currentText = "", b.targetText = s, b.lastCommitTime = 0, b.start()) : (b.currentText = s, b.targetText = s, b.stop());
      return;
    }
    b.targetText = s, b.start();
  }, [
    b,
    i,
    s,
    t.status.type,
    d
  ]), K(() => () => {
    b.stop();
  }, [b]), fe(() => i ? {
    ...t,
    text: u,
    status: s === u ? t.status : xn
  } : t, [
    i,
    u,
    t,
    s
  ]);
}, E_ = Object.freeze({ type: "complete" }), A_ = Object.freeze({
  type: "image",
  image: "",
  status: E_
}), R_ = () => D(M_);
function M_(t) {
  return t.part.type !== "image" ? A_ : t.part;
}
const ri = ge((t, e) => {
  const s = x(10);
  let n, r, i;
  s[0] !== t ? ({ smooth: r, component: i, ...n } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = i) : (n = s[1], r = s[2], i = s[3]);
  const o = r === void 0 ? !0 : r, a = i === void 0 ? "span" : i, { text: c, status: l } = C_(y_(), o);
  let u;
  return s[4] !== a || s[5] !== e || s[6] !== n || s[7] !== l.type || s[8] !== c ? (u = /* @__PURE__ */ m(a, {
    "data-status": l.type,
    ...n,
    ref: e,
    children: c
  }), s[4] = a, s[5] = e, s[6] = n, s[7] = l.type, s[8] = c, s[9] = u) : u = s[9], u;
});
ri.displayName = "MessagePartPrimitive.Text";
const ii = ge((t, e) => {
  const s = x(4), { image: n } = R_();
  let r;
  return s[0] !== e || s[1] !== n || s[2] !== t ? (r = /* @__PURE__ */ m(Te.img, {
    src: n,
    ...t,
    ref: e
  }), s[0] = e, s[1] = n, s[2] = t, s[3] = r) : r = s[3], r;
});
ii.displayName = "MessagePartPrimitive.Image";
const yt = (t) => {
  const e = x(2), s = oe(void 0);
  let n;
  return e[0] !== t ? (n = (r) => {
    s.current && (s.current(), s.current = void 0), r && (s.current = t(r));
  }, e[0] = t, e[1] = n) : n = e[1], n;
}, oo = (t, e) => {
  const s = t.trim().match(/^(\d+(?:\.\d+)?|\.\d+)(em|px|rem)$/);
  if (!s) return Number.POSITIVE_INFINITY;
  const n = Number(s[1]), r = s[2];
  return r === "px" ? n : r === "em" ? n * (parseFloat(getComputedStyle(e).fontSize) || 16) : r === "rem" ? n * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) : Number.POSITIVE_INFINITY;
}, k_ = (t) => t.dataset.messageId, D_ = () => {
  const t = document.createElement("div");
  return t.dataset.auiTopAnchorReserve = "", t.style.height = "0px", t.style.flexShrink = "0", t.style.pointerEvents = "none", t.setAttribute("aria-hidden", "true"), t;
}, In = (t, e) => {
  const s = `${e}px`;
  return t.style.height !== s ? (t.style.height = s, !0) : !1;
}, P_ = (t) => {
  const e = window.devicePixelRatio || 1;
  return Math.round(t * e) / e;
}, al = () => {
  const t = x(4), e = re();
  let s;
  t[0] !== e.message ? (s = () => e.message, t[0] = e.message, t[1] = s) : s = t[1];
  const n = D(s);
  let r;
  return t[2] !== n ? (r = (i) => {
    const o = () => {
      n.setIsHovering(!0);
    }, a = () => {
      n.setIsHovering(!1);
    };
    return i.addEventListener("mouseenter", o), i.addEventListener("mouseleave", a), i.matches(":hover") && queueMicrotask(() => n.setIsHovering(!0)), () => {
      i.removeEventListener("mouseenter", o), i.removeEventListener("mouseleave", a), n.setIsHovering(!1);
    };
  }, t[2] = n, t[3] = r) : r = t[3], yt(r);
}, O_ = () => {
  const t = x(2), e = Xe(V_);
  let s;
  return t[0] !== e ? (s = (n) => n.message.role === "user" && n.message.index > 0 && n.message.index === n.thread.messages.length - 2 && n.thread.messages.at(-1)?.role === "assistant" && (n.message.id === e || n.thread.isRunning), t[0] = e, t[1] = s) : s = t[1], D(s);
}, N_ = () => {
  const t = x(2), e = Xe(j_);
  let s;
  return t[0] !== e ? (s = (n) => n.message.isLast && n.message.role === "assistant" && n.message.index >= 1 && n.thread.messages.at(n.message.index - 1)?.role === "user" && (n.message.id === e || n.thread.isRunning), t[0] = e, t[1] = s) : s = t[1], D(s);
}, $_ = (t, e) => {
  const s = x(3);
  let n;
  return s[0] !== t || s[1] !== e ? (n = (r) => {
    if (t)
      return e.getState().registerAnchorElement(r);
  }, s[0] = t, s[1] = e, s[2] = n) : n = s[2], yt(n);
}, B_ = (t) => {
  const e = x(3), { active: s, threadViewportStore: n } = t;
  let r;
  return e[0] !== s || e[1] !== n ? (r = (i) => {
    if (!s) return;
    const o = n.getState(), a = o.topAnchorMessageClamp;
    return o.registerAnchorTargetElement(i, {
      tallerThan: oo(a.tallerThan, i),
      visibleHeight: oo(a.visibleHeight, i)
    });
  }, e[0] = s, e[1] = n, e[2] = r) : r = e[2], yt(r);
}, F_ = (t) => {
  const e = x(7);
  let s, n;
  e[0] !== t ? ({ forwardedRef: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  const r = al(), i = _t(s, r), o = D(q_);
  let a;
  return e[3] !== o || e[4] !== n || e[5] !== i ? (a = /* @__PURE__ */ m(Te.div, {
    ...n,
    ref: i,
    "data-message-id": o
  }), e[3] = o, e[4] = n, e[5] = i, e[6] = a) : a = e[6], a;
}, L_ = (t) => {
  const e = x(13);
  let s, n, r;
  e[0] !== t ? ({ forwardedRef: s, threadViewportStore: r, ...n } = t, e[0] = t, e[1] = s, e[2] = n, e[3] = r) : (s = e[1], n = e[2], r = e[3]);
  const i = al(), o = O_(), a = N_(), c = $_(o, r);
  let l;
  e[4] !== a || e[5] !== r ? (l = {
    active: a,
    threadViewportStore: r
  }, e[4] = a, e[5] = r, e[6] = l) : l = e[6];
  const u = B_(l), f = _t(s, i, c, u), h = D(U_), d = o ? "" : void 0, p = a ? "" : void 0;
  let _;
  return e[7] !== h || e[8] !== n || e[9] !== f || e[10] !== d || e[11] !== p ? (_ = /* @__PURE__ */ m(Te.div, {
    ...n,
    ref: f,
    "data-message-id": h,
    "data-aui-top-anchor-user": d,
    "data-aui-top-anchor-target": p
  }), e[7] = h, e[8] = n, e[9] = f, e[10] = d, e[11] = p, e[12] = _) : _ = e[12], _;
}, cl = ge((t, e) => {
  const s = x(7), n = bt();
  if (n.getState().turnAnchor === "top") {
    let i;
    return s[0] !== e || s[1] !== t || s[2] !== n ? (i = /* @__PURE__ */ m(L_, {
      ...t,
      forwardedRef: e,
      threadViewportStore: n
    }), s[0] = e, s[1] = t, s[2] = n, s[3] = i) : i = s[3], i;
  }
  let r;
  return s[4] !== e || s[5] !== t ? (r = /* @__PURE__ */ m(F_, {
    ...t,
    forwardedRef: e
  }), s[4] = e, s[5] = t, s[6] = r) : r = s[6], r;
});
cl.displayName = "MessagePrimitive.Root";
function V_(t) {
  return t.topAnchorTurn?.anchorId;
}
function j_(t) {
  return t.topAnchorTurn?.targetId;
}
function q_(t) {
  return t.message.id;
}
function U_(t) {
  return t.message.id;
}
const Tn = {
  ...me,
  Text: () => /* @__PURE__ */ N("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ m(ri, {}), /* @__PURE__ */ m(Zr, { children: /* @__PURE__ */ m("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Image: () => /* @__PURE__ */ m(ii, {})
}, tr = (t) => {
  const e = x(10);
  if ("children" in t) {
    let a;
    return e[0] !== t.children ? (a = /* @__PURE__ */ m(Kn, { children: t.children }), e[0] = t.children, e[1] = a) : a = e[1], a;
  }
  let s, n;
  e[2] !== t ? ({ components: s, ...n } = t, e[2] = t, e[3] = s, e[4] = n) : (s = e[3], n = e[4]);
  let r;
  e[5] !== s ? (r = s ? {
    Text: s.Text ?? Tn.Text,
    Image: s.Image ?? Tn.Image,
    Reasoning: s.Reasoning ?? me.Reasoning,
    Source: s.Source ?? me.Source,
    File: s.File ?? me.File,
    Unstable_Audio: s.Unstable_Audio ?? me.Unstable_Audio,
    ..."ChainOfThought" in s ? { ChainOfThought: s.ChainOfThought } : {
      tools: s.tools,
      data: s.data,
      ToolGroup: s.ToolGroup ?? me.ToolGroup,
      ReasoningGroup: s.ReasoningGroup ?? me.ReasoningGroup
    },
    Empty: s.Empty,
    Quote: s.Quote,
    generativeUI: s.generativeUI
  } : Tn, e[5] = s, e[6] = r) : r = e[6];
  const i = r;
  let o;
  return e[7] !== n || e[8] !== i ? (o = /* @__PURE__ */ m(Kn, {
    components: i,
    ...n
  }), e[7] = n, e[8] = i, e[9] = o) : o = e[9], o;
};
tr.displayName = "MessagePrimitive.Parts";
const ll = (t) => {
  const { children: e } = t;
  return pb() !== void 0 ? e : null;
};
ll.displayName = "MessagePrimitive.Error";
const H_ = (t) => {
  const e = /* @__PURE__ */ new Map();
  for (let n = 0; n < t.length; n++) {
    const r = t[n]?.parentId ?? `__ungrouped_${n}`, i = e.get(r) ?? [];
    i.push(n), e.set(r, i);
  }
  const s = [];
  for (const [n, r] of e) {
    const i = n.startsWith("__ungrouped_") ? void 0 : n;
    s.push({
      groupKey: i,
      indices: r
    });
  }
  return s;
}, z_ = (t) => {
  const e = x(4), s = D(tv);
  let n;
  e: {
    if (s.length === 0) {
      let i;
      e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (i = [], e[0] = i) : i = e[0], n = i;
      break e;
    }
    let r;
    e[1] !== t || e[2] !== s ? (r = t(s), e[1] = t, e[2] = s, e[3] = r) : r = e[3], n = r;
  }
  return n;
}, G_ = (t) => {
  const e = x(9);
  let s, n;
  e[0] !== t ? ({ Fallback: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  e[3] !== s || e[4] !== n.toolName ? (r = (a) => a.tools.toolUIs[n.toolName]?.[0]?.render ?? s, e[3] = s, e[4] = n.toolName, e[5] = r) : r = e[5];
  const i = D(r);
  if (!i) return null;
  let o;
  return e[6] !== i || e[7] !== n ? (o = /* @__PURE__ */ m(i, { ...n }), e[6] = i, e[7] = n, e[8] = o) : o = e[8], o;
}, W_ = (t) => {
  const e = x(9);
  let s, n;
  e[0] !== t ? ({ Fallback: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  e[3] !== s || e[4] !== n.name ? (r = (a) => {
    const c = a.dataRenderers.renderers[n.name] ?? s;
    return Array.isArray(c) ? c[0] ?? s : c;
  }, e[3] = s, e[4] = n.name, e[5] = r) : r = e[5];
  const i = D(r);
  if (!i) return null;
  let o;
  return e[6] !== i || e[7] !== n ? (o = /* @__PURE__ */ m(i, { ...n }), e[6] = i, e[7] = n, e[8] = o) : o = e[8], o;
}, Ue = {
  Text: () => /* @__PURE__ */ N("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ m(ri, {}), /* @__PURE__ */ m(Zr, { children: /* @__PURE__ */ m("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Reasoning: () => null,
  Source: () => null,
  Image: () => /* @__PURE__ */ m(ii, {}),
  File: () => null,
  Unstable_Audio: () => null,
  Group: ({ children: t }) => t
}, Y_ = (t) => {
  const e = x(37), { components: s } = t;
  let n;
  e[0] !== s ? (n = s === void 0 ? {} : s, e[0] = s, e[1] = n) : n = e[1];
  const { Text: r, Reasoning: i, Image: o, Source: a, File: c, Unstable_Audio: l, tools: u, data: f } = n, h = r === void 0 ? Ue.Text : r, d = i === void 0 ? Ue.Reasoning : i, p = o === void 0 ? Ue.Image : o, _ = a === void 0 ? Ue.Source : a, v = c === void 0 ? Ue.File : c, C = l === void 0 ? Ue.Unstable_Audio : l;
  let b;
  e[2] !== u ? (b = u === void 0 ? {} : u, e[2] = u, e[3] = b) : b = e[3];
  const S = b, I = re(), T = D(sv), E = T.type;
  if (E === "tool-call") {
    const g = I.part.addToolResult, w = I.part.resumeToolCall, A = I.part.respondToToolApproval;
    if ("Override" in S) {
      let X;
      return e[4] !== g || e[5] !== T || e[6] !== A || e[7] !== w || e[8] !== S.Override ? (X = /* @__PURE__ */ m(S.Override, {
        ...T,
        addResult: g,
        resume: w,
        respondToApproval: A
      }), e[4] = g, e[5] = T, e[6] = A, e[7] = w, e[8] = S.Override, e[9] = X) : X = e[9], X;
    }
    const P = S.by_name?.[T.toolName] ?? S.Fallback;
    let W;
    return e[10] !== P || e[11] !== g || e[12] !== T || e[13] !== A || e[14] !== w ? (W = /* @__PURE__ */ m(G_, {
      ...T,
      Fallback: P,
      addResult: g,
      resume: w,
      respondToApproval: A
    }), e[10] = P, e[11] = g, e[12] = T, e[13] = A, e[14] = w, e[15] = W) : W = e[15], W;
  }
  if (T.status?.type === "requires-action") throw new Error("Encountered unexpected requires-action status");
  switch (E) {
    case "text": {
      let g;
      return e[16] !== h || e[17] !== T ? (g = /* @__PURE__ */ m(h, { ...T }), e[16] = h, e[17] = T, e[18] = g) : g = e[18], g;
    }
    case "reasoning": {
      let g;
      return e[19] !== d || e[20] !== T ? (g = /* @__PURE__ */ m(d, { ...T }), e[19] = d, e[20] = T, e[21] = g) : g = e[21], g;
    }
    case "source": {
      let g;
      return e[22] !== _ || e[23] !== T ? (g = /* @__PURE__ */ m(_, { ...T }), e[22] = _, e[23] = T, e[24] = g) : g = e[24], g;
    }
    case "image": {
      let g;
      return e[25] !== p || e[26] !== T ? (g = /* @__PURE__ */ m(p, { ...T }), e[25] = p, e[26] = T, e[27] = g) : g = e[27], g;
    }
    case "file": {
      let g;
      return e[28] !== v || e[29] !== T ? (g = /* @__PURE__ */ m(v, { ...T }), e[28] = v, e[29] = T, e[30] = g) : g = e[30], g;
    }
    case "audio": {
      let g;
      return e[31] !== C || e[32] !== T ? (g = /* @__PURE__ */ m(C, { ...T }), e[31] = C, e[32] = T, e[33] = g) : g = e[33], g;
    }
    case "data": {
      const g = f?.by_name?.[T.name] ?? f?.Fallback;
      let w;
      return e[34] !== g || e[35] !== T ? (w = /* @__PURE__ */ m(W_, {
        ...T,
        Fallback: g
      }), e[34] = g, e[35] = T, e[36] = w) : w = e[36], w;
    }
    default:
      return console.warn(`Unknown message part type: ${E}`), null;
  }
}, Q_ = (t) => {
  const e = x(5), { partIndex: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(Y_, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let i;
  return e[2] !== s || e[3] !== r ? (i = /* @__PURE__ */ m(Gr, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = i) : i = e[4], i;
}, J_ = ve(Q_, (t, e) => t.partIndex === e.partIndex && t.components?.Text === e.components?.Text && t.components?.Reasoning === e.components?.Reasoning && t.components?.Source === e.components?.Source && t.components?.Image === e.components?.Image && t.components?.File === e.components?.File && t.components?.Unstable_Audio === e.components?.Unstable_Audio && t.components?.tools === e.components?.tools && t.components?.data === e.components?.data && t.components?.Group === e.components?.Group), X_ = (t) => {
  const e = x(6), { status: s, component: n } = t, r = s.type === "running";
  let i;
  e[0] !== n || e[1] !== s ? (i = /* @__PURE__ */ m(n, {
    type: "text",
    text: "",
    status: s
  }), e[0] = n, e[1] = s, e[2] = i) : i = e[2];
  let o;
  return e[3] !== r || e[4] !== i ? (o = /* @__PURE__ */ m(Wr, {
    text: "",
    isRunning: r,
    children: i
  }), e[3] = r, e[4] = i, e[5] = o) : o = e[5], o;
}, K_ = Object.freeze({ type: "complete" }), Z_ = (t) => {
  const e = x(6), { components: s } = t, n = D(nv);
  if (s?.Empty) {
    let o;
    return e[0] !== s.Empty || e[1] !== n ? (o = /* @__PURE__ */ m(s.Empty, { status: n }), e[0] = s.Empty, e[1] = n, e[2] = o) : o = e[2], o;
  }
  const r = s?.Text ?? Ue.Text;
  let i;
  return e[3] !== n || e[4] !== r ? (i = /* @__PURE__ */ m(X_, {
    status: n,
    component: r
  }), e[3] = n, e[4] = r, e[5] = i) : i = e[5], i;
}, ev = ve(Z_, (t, e) => t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), oi = (t) => {
  const e = x(9), { groupingFunction: s, components: n } = t, r = D(rv), i = z_(s);
  let o;
  e: {
    if (r === 0) {
      let u;
      e[0] !== n ? (u = /* @__PURE__ */ m(ev, { components: n }), e[0] = n, e[1] = u) : u = e[1], o = u;
      break e;
    }
    let l;
    if (e[2] !== n || e[3] !== i) {
      let u;
      e[5] !== n ? (u = (f, h) => {
        const d = n?.Group ?? Ue.Group;
        return /* @__PURE__ */ m(d, {
          groupKey: f.groupKey,
          indices: f.indices,
          children: f.indices.map((p) => /* @__PURE__ */ m(J_, {
            partIndex: p,
            components: n
          }, p))
        }, `group-${h}-${f.groupKey ?? "ungrouped"}`);
      }, e[5] = n, e[6] = u) : u = e[6], l = i.map(u), e[2] = n, e[3] = i, e[4] = l;
    } else l = e[4];
    o = l;
  }
  const a = o;
  let c;
  return e[7] !== a ? (c = /* @__PURE__ */ m($e, { children: a }), e[7] = a, e[8] = c) : c = e[8], c;
};
oi.displayName = "MessagePrimitive.Unstable_PartsGrouped";
const ul = (t) => {
  const e = x(6);
  let s, n;
  e[0] !== t ? ({ components: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  return e[3] !== s || e[4] !== n ? (r = /* @__PURE__ */ m(oi, {
    ...n,
    components: s,
    groupingFunction: H_
  }), e[3] = s, e[4] = n, e[5] = r) : r = e[5], r;
};
ul.displayName = "MessagePrimitive.Unstable_PartsGroupedByParentId";
function tv(t) {
  return t.message.parts;
}
function sv(t) {
  return t.part;
}
function nv(t) {
  return t.message.status ?? K_;
}
function rv(t) {
  return t.message.parts.length;
}
var sr = /* @__PURE__ */ si({
  AttachmentByIndex: () => Pc,
  Attachments: () => Oc,
  Content: () => tr,
  Error: () => ll,
  GenerativeUI: () => Sc,
  GroupedParts: () => Mc,
  If: () => rl,
  PartByIndex: () => Gt,
  Parts: () => tr,
  Quote: () => kc,
  Root: () => cl,
  Unstable_PartsGrouped: () => oi,
  Unstable_PartsGroupedByParentId: () => ul
});
const iv = (t) => {
  const e = x(2), s = rn(t);
  let n;
  return e[0] !== s ? (n = (r) => {
    const i = new ResizeObserver(() => {
      s();
    }), o = new MutationObserver((a) => {
      a.some(ov) && s();
    });
    return i.observe(r), o.observe(r, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      characterData: !0
    }), () => {
      i.disconnect(), o.disconnect();
    };
  }, e[0] = s, e[1] = n) : n = e[1], yt(n);
};
function ov(t) {
  return t.type !== "attributes" || t.attributeName !== "style";
}
const av = ({ autoScroll: t, scrollToBottomOnRunStart: e = !0, scrollToBottomOnInitialize: s = !0, scrollToBottomOnThreadSwitch: n = !0 }) => {
  const r = oe(null), i = D((g) => g.thread.messages.length > 0), o = D((g) => g.thread.isRunning), a = oe(!1), c = oe(null), l = bt();
  t === void 0 && (t = l.getState().turnAnchor !== "top");
  const u = oe(0), f = oe(0), h = oe(0), d = oe(0), p = oe(null), _ = oe(t), v = jt((g) => {
    const w = r.current;
    w && (_.current = !0, p.current = g, w.scrollTo({
      top: w.scrollHeight,
      behavior: g
    }));
  }, []), C = jt(() => {
    c.current !== null && (cancelAnimationFrame(c.current), c.current = null);
  }, []), b = jt((g) => {
    p.current = g, C(), c.current = requestAnimationFrame(() => {
      c.current = null, v(g);
    });
  }, [C, v]);
  kt(() => () => C(), [C]);
  const S = jt(() => {
    const g = l.getState();
    return g.turnAnchor === "top" && g.element.viewport === r.current && g.element.anchor !== null;
  }, [l]), I = () => {
    const g = r.current;
    if (!g) return;
    const w = l.getState().isAtBottom, A = Math.abs(g.scrollHeight - g.scrollTop - g.clientHeight) <= 1 || g.scrollHeight <= g.clientHeight;
    if (!(!A && u.current < g.scrollTop)) {
      const P = Yh({
        scrollTop: u.current,
        scrollHeight: f.current
      }, g);
      A ? (g.scrollHeight > g.clientHeight + 1 && (p.current = null), t && (_.current = !0)) : P && (C(), p.current = null, _.current = !1), (A || p.current === null) && A !== w && qs(l).setState({ isAtBottom: A });
    }
    u.current = g.scrollTop, f.current = g.scrollHeight;
  }, T = iv(() => {
    const g = r.current;
    if (!g) return;
    const { scrollHeight: w, clientHeight: A } = g;
    if (w === h.current && A === d.current) return;
    h.current = w, d.current = A;
    const P = p.current;
    P && S() ? p.current = null : P ? v(P) : t && !(o && S()) && _.current && v("instant"), I();
  }), E = yt((g) => {
    const w = () => {
      p.current = null;
    };
    return g.addEventListener("scroll", I), g.addEventListener("pointerdown", w), () => {
      g.removeEventListener("scroll", I), g.removeEventListener("pointerdown", w);
    };
  });
  return kt(() => {
    if (s) {
      if (!i) {
        a.current = !1;
        return;
      }
      a.current || (a.current = !0, p.current === null && b("instant"));
    }
  }, [
    i,
    b,
    s
  ]), f_(({ behavior: g }) => {
    v(g);
  }), Ri("thread.runStart", () => {
    e && l.getState().turnAnchor !== "top" && b("auto");
  }), Ri("threads.selectionChanged", () => {
    n && b("instant");
  }), _t(T, E, r);
}, dl = ge((t, e) => {
  const s = x(6), n = re();
  let r, i;
  s[0] !== n ? (r = () => {
    const a = (c) => {
      if (c.key === "Escape" && !(c.defaultPrevented || n.thread.source === null) && n.thread.getState().speech != null) {
        c.preventDefault();
        try {
          n.thread.stopSpeaking();
        } catch (l) {
          const u = l;
          if (!(u instanceof Error) || u.message !== "No message is being spoken") throw u;
        }
      }
    };
    return document.addEventListener("keydown", a), () => {
      document.removeEventListener("keydown", a);
    };
  }, i = [n], s[0] = n, s[1] = r, s[2] = i) : (r = s[1], i = s[2]), K(r, i);
  let o;
  return s[3] !== t || s[4] !== e ? (o = /* @__PURE__ */ m(Te.div, {
    ...t,
    ref: e
  }), s[3] = t, s[4] = e, s[5] = o) : o = s[5], o;
});
dl.displayName = "ThreadPrimitive.Root";
const hl = (t) => {
  const { children: e } = t;
  return D(cv) ? e : null;
};
hl.displayName = "ThreadPrimitive.Empty";
function cv(t) {
  return t.thread.isEmpty;
}
const lv = (t) => {
  const e = x(4);
  let s;
  return e[0] !== t.disabled || e[1] !== t.empty || e[2] !== t.running ? (s = (n) => !(t.empty === !0 && !n.thread.isEmpty || t.empty === !1 && n.thread.isEmpty || t.running === !0 && !n.thread.isRunning || t.running === !1 && n.thread.isRunning || t.disabled === !0 && !n.thread.isDisabled || t.disabled === !1 && n.thread.isDisabled), e[0] = t.disabled, e[1] = t.empty, e[2] = t.running, e[3] = s) : s = e[3], D(s);
}, fl = (t) => {
  const e = x(3);
  let s, n;
  return e[0] !== t ? ({ children: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]), lv(n) ? s : null;
};
fl.displayName = "ThreadPrimitive.If";
const ml = (t, e) => {
  const s = x(3);
  let n;
  return s[0] !== e || s[1] !== t ? (n = (r) => {
    if (!t) return;
    const i = t(), o = () => {
      const c = e ? e(r) : r.offsetHeight;
      i.setHeight(c);
    }, a = new ResizeObserver(o);
    return a.observe(r), o(), () => {
      a.disconnect(), i.unregister();
    };
  }, s[0] = e, s[1] = t, s[2] = n) : n = s[2], yt(n);
}, ao = (t) => {
  let e = 0, s = t;
  for (; s; )
    e += s.offsetTop, s = s.offsetParent;
  return e;
}, uv = (t, e) => {
  let s = 0, n = t;
  for (; n && n !== e; )
    s += n.offsetTop, n = n.offsetParent;
  return n === e ? s : ao(t) - ao(e);
}, pl = ({ viewport: t, anchor: e, tallerThan: s, visibleHeight: n }) => {
  const r = uv(e, t), i = e.offsetHeight;
  return r + Math.max(0, i - (i <= s ? i : n));
}, dv = ({ scrollHeight: t, ...e }) => {
  const { viewport: s } = e, n = pl(e) + s.clientHeight;
  return Math.max(0, n - t);
}, hv = ({ viewport: t, reserve: e, ...s }) => dv({
  viewport: t,
  ...s,
  scrollHeight: t.scrollHeight - e.offsetHeight
}), fv = (t) => {
  const e = new ResizeObserver(t), s = new MutationObserver(t);
  let n = null, r = null, i = null;
  const o = () => {
    e.disconnect(), s.disconnect(), n = null, r = null, i = null;
  };
  return {
    target: (a, c, l) => {
      n === a && r === c && i === l || (o(), e.observe(a), e.observe(c), e.observe(l), s.observe(l, {
        childList: !0,
        subtree: !0,
        characterData: !0
      }), n = a, r = c, i = l);
    },
    disconnect: o
  };
}, mv = (t) => {
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
}, pv = (t) => {
  let e = null, s;
  function n() {
    const a = t.getState(), { viewport: c, anchor: l, target: u } = a.element, f = a.targetConfig;
    if (a.turnAnchor !== "top" || !c) {
      i.disconnect(), e && (In(e, 0), e.remove());
      return;
    }
    if (!l && !u && !f && a.topAnchorTurn) {
      i.disconnect(), e?.parentElement && e.parentElement.lastElementChild !== e && e.parentElement.append(e);
      return;
    }
    if (!l || !u || !f) {
      i.disconnect(), e && (In(e, 0), e.remove());
      return;
    }
    if (e ??= D_(), (e.parentElement !== u.parentElement || e.previousElementSibling !== u) && u.after(e), i.target(c, l, u), In(e, hv({
      viewport: c,
      anchor: l,
      reserve: e,
      ...f
    }))) {
      r.schedule();
      return;
    }
    const h = k_(l);
    if (h !== void 0 && s === h) return;
    const d = P_(pl({
      viewport: c,
      anchor: l,
      ...f
    }));
    Math.abs(c.scrollTop - d) > 1 && c.scrollTo({
      top: d,
      behavior: "smooth"
    }), h !== void 0 && (s = h);
  }
  const r = mv(n), i = fv(r.schedule);
  r.schedule();
  const o = t.subscribe(r.schedule);
  return () => {
    r.cancel(), o(), i.disconnect(), e?.remove();
  };
}, gv = (t) => {
  const e = x(4), s = bt();
  let n, r;
  e[0] !== t || e[1] !== s ? (n = () => {
    if (t)
      return pv(s);
  }, r = [t, s], e[0] = t, e[1] = s, e[2] = n, e[3] = r) : (n = e[2], r = e[3]), kt(n, r);
}, bv = (t, e) => {
  if (!t) return !1;
  const s = e.findIndex((n) => n.id === t.targetId);
  return s < 1 ? !1 : e[s - 1]?.id === t.anchorId && e.slice(s + 1).every((n) => n.role === "user");
}, gl = ({ isRunning: t, messages: e }) => {
  if (!t) return null;
  const s = e.at(-1), n = e.at(-2);
  return n?.role !== "user" || s?.role !== "assistant" ? null : {
    anchorId: n.id,
    targetId: s.id
  };
}, _v = (t) => gl(t)?.anchorId, vv = (t) => gl(t)?.targetId, yv = () => {
  const t = Xe(xv);
  return ml(t, Iv);
}, wv = () => {
  const t = Xe(Tv);
  return yt(t);
}, Sv = (t) => {
  const e = x(19), s = bt();
  let n;
  e[0] !== t ? (n = (v) => {
    if (t)
      return _v(v.thread);
  }, e[0] = t, e[1] = n) : n = e[1];
  const r = D(n);
  let i;
  e[2] !== t ? (i = (v) => {
    if (t)
      return vv(v.thread);
  }, e[2] = t, e[3] = i) : i = e[3];
  const o = D(i), a = Xe(Cv);
  let c;
  e: {
    if (!r || !o) {
      c = null;
      break e;
    }
    let v;
    e[4] !== r || e[5] !== o ? (v = {
      anchorId: r,
      targetId: o
    }, e[4] = r, e[5] = o, e[6] = v) : v = e[6], c = v;
  }
  const l = c;
  let u;
  e[7] !== t || e[8] !== a ? (u = (v) => t && !!a && bv(a, v.thread.messages), e[7] = t, e[8] = a, e[9] = u) : u = e[9];
  const f = D(u);
  let h, d;
  e[10] !== s || e[11] !== a || e[12] !== f ? (h = () => {
    !a || f || s.getState().setTopAnchorTurn(null);
  }, d = [
    s,
    a,
    f
  ], e[10] = s, e[11] = a, e[12] = f, e[13] = h, e[14] = d) : (h = e[13], d = e[14]), kt(h, d);
  let p, _;
  e[15] !== l || e[16] !== s ? (p = () => {
    if (!l) return;
    const v = s.getState(), C = v.topAnchorTurn;
    C?.anchorId === l.anchorId && C.targetId === l.targetId || v.setTopAnchorTurn(l);
  }, _ = [l, s], e[15] = l, e[16] = s, e[17] = p, e[18] = _) : (p = e[17], _ = e[18]), kt(p, _);
}, bl = ge((t, e) => {
  const s = x(18);
  let n, r, i, o, a, c;
  s[0] !== t ? ({ autoScroll: n, scrollToBottomOnRunStart: a, scrollToBottomOnInitialize: o, scrollToBottomOnThreadSwitch: c, children: r, ...i } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = i, s[4] = o, s[5] = a, s[6] = c) : (n = s[1], r = s[2], i = s[3], o = s[4], a = s[5], c = s[6]);
  let l;
  s[7] !== n || s[8] !== o || s[9] !== a || s[10] !== c ? (l = {
    autoScroll: n,
    scrollToBottomOnRunStart: a,
    scrollToBottomOnInitialize: o,
    scrollToBottomOnThreadSwitch: c
  }, s[7] = n, s[8] = o, s[9] = a, s[10] = c, s[11] = l) : l = s[11];
  const u = av(l), f = yv(), h = wv(), d = bt();
  let p;
  s[12] !== d ? (p = d.getState(), s[12] = d, s[13] = p) : p = s[13];
  const _ = p.turnAnchor === "top";
  Sv(_), gv(_);
  const v = _t(e, u, f, h);
  let C;
  return s[14] !== r || s[15] !== v || s[16] !== i ? (C = /* @__PURE__ */ m(Te.div, {
    ...i,
    ref: v,
    children: r
  }), s[14] = r, s[15] = v, s[16] = i, s[17] = C) : C = s[17], C;
});
bl.displayName = "ThreadPrimitive.ViewportScrollable";
const _l = ge((t, e) => {
  const s = x(13);
  let n, r, i;
  s[0] !== t ? ({ turnAnchor: i, topAnchorMessageClamp: r, ...n } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = i) : (n = s[1], r = s[2], i = s[3]);
  let o;
  s[4] !== r || s[5] !== i ? (o = {
    turnAnchor: i,
    topAnchorMessageClamp: r
  }, s[4] = r, s[5] = i, s[6] = o) : o = s[6];
  let a;
  s[7] !== n || s[8] !== e ? (a = /* @__PURE__ */ m(bl, {
    ...n,
    ref: e
  }), s[7] = n, s[8] = e, s[9] = a) : a = s[9];
  let c;
  return s[10] !== o || s[11] !== a ? (c = /* @__PURE__ */ m(ei, {
    options: o,
    children: a
  }), s[10] = o, s[11] = a, s[12] = c) : c = s[12], c;
});
_l.displayName = "ThreadPrimitive.Viewport";
function xv(t) {
  return t.registerViewport;
}
function Iv(t) {
  return t.clientHeight;
}
function Tv(t) {
  return t.registerViewportElement;
}
function Cv(t) {
  return t.topAnchorTurn;
}
const vl = ge((t, e) => {
  const s = x(3), n = Xe(Ev), r = ml(n, Av), i = _t(e, r);
  let o;
  return s[0] !== t || s[1] !== i ? (o = /* @__PURE__ */ m(Te.div, {
    ...t,
    ref: i
  }), s[0] = t, s[1] = i, s[2] = o) : o = s[2], o;
});
vl.displayName = "ThreadPrimitive.ViewportFooter";
function Ev(t) {
  return t.registerContentInset;
}
function Av(t) {
  const e = parseFloat(getComputedStyle(t).marginTop) || 0;
  return t.offsetHeight + e;
}
const Rv = (t) => {
  const e = x(5);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { behavior: n } = s, r = Xe(kv), i = bt();
  let o;
  e[2] !== n || e[3] !== i ? (o = () => {
    i.getState().scrollToBottom({ behavior: n });
  }, e[2] = n, e[3] = i, e[4] = o) : o = e[4];
  const a = o;
  return r ? null : a;
}, Mv = as("ThreadPrimitive.ScrollToBottom", Rv, ["behavior"]);
function kv(t) {
  return t.isAtBottom;
}
const Dv = (t) => {
  const e = x(4), { prompt: s, send: n, clearComposer: r, autoSend: i } = t, o = n ?? i ?? !1;
  let a;
  e[0] !== r || e[1] !== s || e[2] !== o ? (a = {
    prompt: s,
    send: o,
    clearComposer: r
  }, e[0] = r, e[1] = s, e[2] = o, e[3] = a) : a = e[3];
  const { disabled: c, trigger: l } = fb(a);
  return c ? null : l;
}, Pv = as("ThreadPrimitive.Suggestion", Dv, [
  "prompt",
  "send",
  "clearComposer",
  "autoSend",
  "method"
]);
var Ft = /* @__PURE__ */ si({
  Empty: () => hl,
  If: () => fl,
  MessageByIndex: () => bc,
  Messages: () => Jp,
  Root: () => dl,
  ScrollToBottom: () => Mv,
  Suggestion: () => Pv,
  SuggestionByIndex: () => $c,
  Suggestions: () => Gg,
  Unstable_MessageById: () => _c,
  Viewport: () => _l,
  ViewportFooter: () => vl,
  ViewportProvider: () => ei
});
function Ov({
  controller: t,
  children: e
}) {
  const s = B(
    async (i) => {
      const o = i.content.filter((a) => a.type === "text").map((a) => a.text).join("").trim();
      o && await t.send(qo(o));
    },
    [t.send]
  ), n = B(() => t.stop(), [t.stop]), r = Gp({
    messages: t.messages,
    isRunning: t.running,
    isLoading: t.sessionLoading,
    isDisabled: t.sessionLoading,
    isSendDisabled: t.sendDisabled,
    convertMessage: Nv,
    onNew: s,
    onCancel: n
  });
  return /* @__PURE__ */ m(xb, { runtime: r, children: e });
}
function Nv(t) {
  return t.role === "user" ? {
    id: t.id,
    role: "user",
    content: t.text ? [{ type: "text", text: t.text }] : [],
    metadata: {
      custom: co(t)
    }
  } : {
    id: t.id,
    role: "assistant",
    content: Ql(t),
    status: t.running ? { type: "running" } : t.error ? {
      type: "incomplete",
      reason: "error",
      error: t.failureMessage || t.text
    } : { type: "complete", reason: "stop" },
    metadata: {
      custom: co(t)
    }
  };
}
function co(t) {
  return {
    recordID: t.recordID || 0,
    requestID: t.requestID || "",
    output: t.output,
    activities: t.activities || [],
    sourceText: t.text,
    failureMessage: t.failureMessage,
    createdAt: t.createdAt,
    content: t.content,
    document: t.document
  };
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/components/ui/dialog", "@/components/ui/input", "@/lib/utils"]);
const nr = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!nr || Object.keys(nr).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const Lt = nr.Button, We = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!We || Object.keys(We).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const lo = We.Dialog, uo = We.DialogContent, ho = We.DialogDescription, fo = We.DialogFooter, mo = We.DialogHeader, po = We.DialogTitle, rr = window.DeverFront?.sdk?.getCompatModule("@/components/ui/input");
if (!rr || Object.keys(rr).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/input");
const $v = rr.Input, ir = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!ir || Object.keys(ir).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const Bv = ir.cn, or = 152, go = 76, bo = 6, Vt = 8;
function Fv({
  session: t,
  active: e,
  controller: s
}) {
  const [n, r] = G(!1), [i, o] = G(!1), [a, c] = G(t.title), [l, u] = G(""), [f, h] = G(!1), [d, p] = G(!1), [_, v] = G(!1), [C, b] = G({
    top: 0,
    left: 0
  }), S = ne(null), I = ne(null);
  le(() => {
    if (!_)
      return;
    const P = (q) => {
      const U = q.target;
      U instanceof Node && (S.current?.contains(U) || I.current?.contains(U) || v(!1));
    }, W = (q) => {
      q.key === "Escape" && v(!1);
    }, X = () => v(!1);
    return document.addEventListener("pointerdown", P, !0), document.addEventListener("keydown", W), document.addEventListener("scroll", X, !0), window.addEventListener("resize", X), () => {
      document.removeEventListener("pointerdown", P, !0), document.removeEventListener("keydown", W), document.removeEventListener("scroll", X, !0), window.removeEventListener("resize", X);
    };
  }, [_]);
  const T = () => {
    v(!1), c(t.title), u(""), r(!0);
  }, E = async (P) => {
    P.preventDefault();
    const W = a.trim();
    if (!W) {
      u("请输入会话标题");
      return;
    }
    h(!0), u("");
    try {
      await s.renameSession(t.id, W), r(!1);
    } catch (X) {
      u(_o(X, "编辑标题失败"));
    } finally {
      h(!1);
    }
  }, g = async () => {
    p(!0), u("");
    try {
      await s.deleteSession(t.id), o(!1);
    } catch (P) {
      u(_o(P, "删除会话失败"));
    } finally {
      p(!1);
    }
  }, w = (P) => {
    if (P.stopPropagation(), _) {
      v(!1);
      return;
    }
    S.current && (b(Lv(S.current)), v(!0));
  }, A = _ && typeof document < "u" ? _u(
    /* @__PURE__ */ N(
      "div",
      {
        ref: I,
        role: "menu",
        "aria-label": `管理会话：${t.title}`,
        "data-assistant-layer": "true",
        className: "rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        style: {
          position: "fixed",
          top: C.top,
          left: C.left,
          width: or,
          zIndex: Cs,
          pointerEvents: "auto"
        },
        onClick: (P) => P.stopPropagation(),
        children: [
          /* @__PURE__ */ N(
            "button",
            {
              type: "button",
              role: "menuitem",
              className: "flex w-full items-center gap-2 rounded-sm border-0 bg-transparent px-2 py-1.5 text-left text-sm outline-none hover:bg-accent focus-visible:bg-accent",
              onClick: T,
              children: [
                /* @__PURE__ */ m(Nl, { className: "size-4 shrink-0" }),
                "编辑标题"
              ]
            }
          ),
          /* @__PURE__ */ N(
            "button",
            {
              type: "button",
              role: "menuitem",
              disabled: !!t.running,
              className: "flex w-full items-center gap-2 rounded-sm border-0 bg-transparent px-2 py-1.5 text-left text-sm text-destructive outline-none hover:bg-destructive/10 focus-visible:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50",
              onClick: () => {
                v(!1), u(""), o(!0);
              },
              children: [
                /* @__PURE__ */ m($l, { className: "size-4 shrink-0" }),
                "删除"
              ]
            }
          )
        ]
      }
    ),
    Vv(S.current)
  ) : null;
  return /* @__PURE__ */ N($e, { children: [
    /* @__PURE__ */ m("span", { ref: S, className: "flex shrink-0", children: /* @__PURE__ */ m(Ho, { label: "会话操作", children: /* @__PURE__ */ m(
      Lt,
      {
        type: "button",
        variant: "ghost",
        size: "icon",
        className: Bv(
          "size-7 shrink-0 text-muted-foreground transition-opacity hover:text-foreground",
          e ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
        ),
        "aria-label": `管理会话：${t.title}`,
        "aria-haspopup": "menu",
        "aria-expanded": _,
        onClick: w,
        children: /* @__PURE__ */ m(Bl, { className: "size-4" })
      }
    ) }) }),
    A,
    /* @__PURE__ */ m(
      lo,
      {
        open: n,
        onOpenChange: (P) => {
          f || r(P);
        },
        children: /* @__PURE__ */ N(
          uo,
          {
            "data-assistant-layer": "true",
            layerZIndex: Cs,
            showCloseButton: !f,
            className: "sm:max-w-md",
            children: [
              /* @__PURE__ */ N(mo, { children: [
                /* @__PURE__ */ m(po, { children: "编辑标题" }),
                /* @__PURE__ */ m(ho, { children: "修改左侧显示的会话标题。" })
              ] }),
              /* @__PURE__ */ N("form", { className: "space-y-4", onSubmit: E, children: [
                /* @__PURE__ */ m(
                  $v,
                  {
                    autoFocus: !0,
                    value: a,
                    maxLength: 255,
                    disabled: f,
                    "aria-label": "会话标题",
                    onChange: (P) => c(P.target.value)
                  }
                ),
                l ? /* @__PURE__ */ m("p", { className: "text-sm text-destructive", children: l }) : null,
                /* @__PURE__ */ N(fo, { children: [
                  /* @__PURE__ */ m(
                    Lt,
                    {
                      type: "button",
                      variant: "outline",
                      disabled: f,
                      onClick: () => r(!1),
                      children: "取消"
                    }
                  ),
                  /* @__PURE__ */ m(Lt, { type: "submit", disabled: f || !a.trim(), children: f ? "保存中..." : "保存" })
                ] })
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ m(
      lo,
      {
        open: i,
        onOpenChange: (P) => {
          d || o(P);
        },
        children: /* @__PURE__ */ N(
          uo,
          {
            "data-assistant-layer": "true",
            layerZIndex: Cs,
            showCloseButton: !d,
            className: "sm:max-w-md",
            children: [
              /* @__PURE__ */ N(mo, { children: [
                /* @__PURE__ */ m(po, { children: "删除对话？" }),
                /* @__PURE__ */ N(ho, { children: [
                  "删除后，“",
                  t.title,
                  "”将从历史会话中移除。"
                ] })
              ] }),
              l ? /* @__PURE__ */ m("p", { className: "text-sm text-destructive", children: l }) : null,
              /* @__PURE__ */ N(fo, { children: [
                /* @__PURE__ */ m(
                  Lt,
                  {
                    type: "button",
                    variant: "outline",
                    disabled: d,
                    onClick: () => o(!1),
                    children: "取消"
                  }
                ),
                /* @__PURE__ */ m(
                  Lt,
                  {
                    type: "button",
                    variant: "destructive",
                    disabled: d,
                    onClick: () => {
                      g();
                    },
                    children: d ? "删除中..." : "删除"
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
function _o(t, e) {
  return t instanceof Error && t.message.trim() ? t.message.trim() : e;
}
function Lv(t) {
  const e = t.getBoundingClientRect(), s = Math.max(
    Vt,
    window.innerWidth - or - Vt
  ), n = Math.min(
    s,
    Math.max(Vt, e.right - or)
  ), r = e.bottom + bo;
  return { top: r + go <= window.innerHeight - Vt ? r : Math.max(Vt, e.top - go - bo), left: n };
}
function Vv(t) {
  return t?.closest('[data-agent-chat-layer="true"]') || document.body;
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/lib/utils"]);
const ar = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!ar || Object.keys(ar).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const vo = ar.Button, cr = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!cr || Object.keys(cr).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const yo = cr.cn;
function wo({
  agentName: t,
  title: e,
  agentReady: s,
  controller: n,
  collapsed: r = !1,
  mobile: i = !1,
  embedded: o = !1,
  onBack: a,
  onOpenSession: c,
  onStartNewSession: l
}) {
  return /* @__PURE__ */ N(
    "aside",
    {
      className: yo(
        "agent-chat-sidebar h-full shrink-0 flex-col bg-muted/25",
        o ? "flex w-full" : i ? "flex w-full md:hidden" : "hidden border-r",
        !o && !i && !r && "md:flex"
      ),
      style: i || o ? void 0 : {
        width: "var(--agent-chat-sidebar-width, 300px)",
        minWidth: "var(--agent-chat-sidebar-width, 300px)",
        flexBasis: "var(--agent-chat-sidebar-width, 300px)"
      },
      children: [
        /* @__PURE__ */ m("div", { className: "agent-chat-sidebar-header shrink-0 border-b p-3", children: /* @__PURE__ */ N("div", { className: "agent-chat-sidebar-controls flex min-w-0 items-center gap-2", children: [
          o ? /* @__PURE__ */ N(
            vo,
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
          /* @__PURE__ */ N(
            vo,
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
        /* @__PURE__ */ N("div", { className: "agent-chat-session-section flex min-h-0 flex-1 flex-col", children: [
          /* @__PURE__ */ m("div", { className: "agent-chat-session-heading shrink-0 px-4 pb-2 pt-4 text-xs font-medium text-muted-foreground", children: "历史会话" }),
          /* @__PURE__ */ m(
            "div",
            {
              ref: n.sessionListRef,
              className: "agent-chat-session-list min-h-0 flex-1 overflow-y-auto px-2 pb-3",
              onScroll: (u) => n.handleSessionListScroll(u.currentTarget),
              children: n.sessionsLoading && n.sessions.length === 0 ? /* @__PURE__ */ m("div", { className: "flex h-24 items-center justify-center text-muted-foreground", children: /* @__PURE__ */ m(Ut, { className: "size-4 animate-spin" }) }) : n.sessions.length === 0 ? /* @__PURE__ */ m("div", { className: "px-2 py-6 text-center text-xs leading-5 text-muted-foreground", children: "暂无历史会话" }) : /* @__PURE__ */ N("div", { className: "space-y-1", children: [
                n.sessions.map((u) => /* @__PURE__ */ N(
                  "div",
                  {
                    className: yo(
                      "agent-chat-session-item group flex min-h-10 w-full items-center rounded-md px-1 transition-colors",
                      u.id === n.sessionID ? "bg-background font-medium text-foreground shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                    ),
                    children: [
                      /* @__PURE__ */ N(
                        "button",
                        {
                          type: "button",
                          className: "agent-chat-session-trigger flex min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left text-sm",
                          onClick: () => {
                            c ? c(u.id) : n.openSession(u.id);
                          },
                          children: [
                            u.running ? /* @__PURE__ */ m(Ut, { className: "size-3.5 shrink-0 animate-spin" }) : /* @__PURE__ */ m(Fl, { className: "size-3.5 shrink-0" }),
                            /* @__PURE__ */ m("span", { className: "min-w-0 flex-1 truncate", children: u.title })
                          ]
                        }
                      ),
                      /* @__PURE__ */ m(
                        Fv,
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
                n.sessionsLoadingMore ? /* @__PURE__ */ m("div", { className: "flex h-10 items-center justify-center text-muted-foreground", children: /* @__PURE__ */ m(Ut, { className: "size-4 animate-spin" }) }) : null
              ] })
            }
          )
        ] })
      ]
    }
  );
}
const jv = 32;
function qv(t, e, s = jv) {
  let n = t, r = null, i = !0, o = 0;
  const a = () => {
    r != null && (clearTimeout(r), r = null);
  }, c = () => {
    a(), o = So(), e(n);
  }, l = () => {
    if (r != null)
      return;
    const u = So() - o, f = Math.max(0, s - u);
    r = setTimeout(c, f);
  };
  return {
    get text() {
      return n;
    },
    append(u) {
      if (u) {
        if (n += u, i) {
          i = !1, c();
          return;
        }
        l();
      }
    },
    reset(u = "") {
      a(), n = u, i = !0, o = 0;
    },
    flush: c,
    dispose() {
      a();
    }
  };
}
function So() {
  return typeof performance > "u" ? Date.now() : performance.now();
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-runner", "@/lib/runtime-stream-output", "@/lib/stream"]);
const Zt = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-runner");
if (!Zt || Object.keys(Zt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-runner");
const Uv = Zt.runRuntimeStream, Hv = Zt.stopRuntimeStream, zv = Zt.watchRuntimeStream, lr = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!lr || Object.keys(lr).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const Cn = lr.runtimeErrorMessage, ur = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!ur || Object.keys(ur).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const xo = ur.streamValueText;
function Gv({
  agentKey: t,
  contextKey: e,
  modalOpen: s,
  sessionLoading: n,
  sessionID: r,
  messages: i,
  blockMs: o,
  runtimeApi: a,
  requestScope: c,
  getActiveSessionID: l,
  getSessionTitle: u,
  getSessionMessages: f,
  updateSessionMessages: h,
  updateSessionTitle: d,
  syncSessionTitle: p,
  setSessionRunning: _,
  setError: v
}) {
  const [C, b] = G({}), S = ne(/* @__PURE__ */ new Map()), I = B(
    (y) => {
      y.detached || (b((M) => ({
        ...M,
        [y.sessionID]: {
          requestID: y.requestID,
          cancelable: y.cancelable,
          stopping: y.stopping
        }
      })), _(y.sessionID, !0));
    },
    [_]
  ), T = B(
    (y) => {
      const M = S.current.get(y.sessionID);
      return M && M !== y ? !1 : (S.current.set(y.sessionID, y), I(y), !0);
    },
    [I]
  ), E = B(
    (y) => {
      S.current.get(y.sessionID) === y && (y.buffer.dispose(), S.current.delete(y.sessionID), b((M) => {
        const k = { ...M };
        return delete k[y.sessionID], k;
      }), _(y.sessionID, !1));
    },
    [_]
  ), g = B(
    (y, M) => {
      y.detached || h(
        y.sessionID,
        (k) => k.map(
          (F) => dr(F, y) ? {
            ...F,
            ...typeof M == "function" ? M(F) : M
          } : F
        )
      );
    },
    [h]
  ), w = B(
    (y, M) => {
      S.current.get(y.sessionID) === y && (y.buffer.flush(), g(y, (k) => {
        const F = zo(M.output), j = xu(
          M.output?.document
        ), Q = {
          text: M.text,
          requestID: M.requestID || y.requestID || void 0,
          running: !1,
          error: !!M.error,
          // 运行失败由所属消息展示，输入区只承载尚未完成的操作错误。
          failureMessage: M.error ? M.failureMessage?.trim() || "智能体运行失败。" : void 0,
          activities: Iu(
            k.activities,
            F
          )
        };
        return Tu(M.output) && (Q.output = M.output), Q.document = Hs(
          k.document,
          j
        ), j && k.document?.id !== j.id && (Q.autoOpenDocument = !0), Q;
      }), E(y), y.kind !== "opening" && p(y.sessionID));
    },
    [E, p, g]
  ), A = B(
    (y, M) => {
      if (y.detached || S.current.get(y.sessionID) !== y)
        return !1;
      const k = Cu(M);
      if (k.requestID && !y.requestID && (y.requestID = k.requestID), k.streamID && (y.lastStreamID = k.streamID), k.runVersion > 0) {
        if (y.runVersion > k.runVersion)
          return !0;
        y.runVersion = k.runVersion;
      }
      k.assistantMessageID > 0 && g(y, { recordID: k.assistantMessageID }), k.cancelable != null && k.cancelable !== y.cancelable && (y.cancelable = k.cancelable, I(y)), Wv(k.event, k.output) && g(y, (j) => {
        const Q = Go(
          j.document,
          k.output
        );
        return {
          document: Q,
          autoOpenDocument: j.autoOpenDocument || k.event === "document_start" && !!Q && j.document?.id !== Q?.id,
          requestID: k.requestID || y.requestID || void 0,
          running: !0
        };
      }), k.event === "reset" && (y.replayPending = !1, y.buffer.reset(xo(k.output.text)), y.buffer.flush()), (k.runtimeStatus || k.event === "reset") && g(y, (j) => ({
        output: {
          ...j.output,
          runtime_status: k.runtimeStatus
        }
      })), k.delta && (y.replayPending && (y.replayPending = !1, y.buffer.reset()), y.buffer.append(k.delta));
      const F = k.activity;
      if (F) {
        y.buffer.flush();
        const j = F.anchorText ? F : { ...F, anchorText: y.buffer.text };
        g(y, (Q) => ({
          activities: Eu(
            Q.activities,
            j
          ),
          requestID: k.requestID || y.requestID || void 0,
          running: !0
        }));
      }
      return y.kind === "opening" && k.finished && k.event === "opening_skipped" ? (h(
        y.sessionID,
        (j) => j.filter((Q) => !dr(Q, y))
      ), E(y), !1) : k.finished ? (w(y, {
        text: Io({
          text: k.finalText,
          streamedText: y.buffer.text,
          error: k.error,
          failed: k.failed
        }),
        error: k.failed,
        failureMessage: k.error,
        requestID: k.requestID,
        output: k.output
      }), !1) : !0;
    },
    [w, I, E, g, h]
  ), P = B(
    (y) => {
      const M = {
        kind: y.kind || "chat",
        sessionID: y.sessionID,
        requestID: y.requestID || "",
        userMessageID: y.userMessageID,
        assistantMessageID: y.assistantMessageID,
        createdAt: y.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        input: y.prompt || "",
        content: y.content,
        buffer: qv(y.text || "", (k) => {
          g(M, {
            text: k,
            requestID: M.requestID || void 0,
            running: !0,
            error: !1
          });
        }),
        lastStreamID: "0-0",
        cancelable: !1,
        stopping: !1,
        stopped: !1,
        detached: !1,
        replayPending: !!y.replayPending,
        runVersion: 0,
        controller: new AbortController()
      };
      return M;
    },
    [g]
  ), W = B(
    (y, M) => {
      if (!Au(M.status))
        return !1;
      const k = M.status === "fail", F = M.status === "canceled", j = Io({
        text: M.text,
        streamedText: y.buffer.text,
        error: M.error,
        failed: k,
        canceled: F
      });
      return w(y, {
        text: j,
        error: k,
        failureMessage: M.error,
        requestID: M.requestID,
        output: M.output
      }), !0;
    },
    [w]
  ), X = B(
    async (y, M) => {
      const k = M.requestID || "";
      if (!k || !y || S.current.has(y))
        return;
      const F = P({
        kind: M.kind === "opening" ? "opening" : "chat",
        sessionID: y,
        requestID: k,
        userMessageID: "",
        assistantMessageID: M.id,
        createdAt: M.createdAt,
        text: M.text,
        replayPending: !!M.text
      });
      if (!T(F)) {
        F.buffer.dispose();
        return;
      }
      try {
        const j = await di(
          a.status,
          k
        );
        if (F.detached || S.current.get(y) !== F || (F.runVersion = Math.max(F.runVersion, j.runVersion), W(F, j)) || (await zv({
          streamApi: a.stream,
          requestID: k,
          lastID: F.lastStreamID,
          blockMs: o,
          signal: F.controller.signal,
          // applyFrame only returns false for the current run version. Old
          // terminal frames from an interrupted attempt must not stop replay.
          stopOnResult: !1,
          recoverOnError: !0,
          fallbackToPoll: !1,
          onFrame: (ie) => A(F, ie) ? void 0 : !1
        }), F.detached || F.controller.signal.aborted || S.current.get(y) !== F))
          return;
        const Q = await di(
          a.status,
          k
        );
        W(F, Q);
      } catch (j) {
        if (F.detached || F.controller.signal.aborted || S.current.get(y) !== F)
          return;
        const Q = Cn(
          j,
          "恢复智能体运行失败。"
        );
        w(F, {
          text: F.buffer.text.trim() || Q,
          error: !0,
          failureMessage: Q,
          requestID: k
        });
      }
    },
    [
      A,
      o,
      P,
      w,
      W,
      T,
      a.status,
      a.stream
    ]
  );
  le(() => {
    if (!s || n || !r)
      return;
    const y = i.find(
      (k) => k.role === "assistant" && k.running && !!k.requestID
    );
    if (!y)
      return;
    let M = !1;
    return window.queueMicrotask(() => {
      M || X(r, y);
    }), () => {
      M = !0;
    };
  }, [i, s, X, r, n]);
  const q = B(
    async (y, M, k) => {
      v("");
      try {
        const F = await Uv({
          requestApi: M,
          streamApi: a.stream,
          stopApi: a.stop,
          stopOnAbort: !1,
          fallbackToPoll: !1,
          blockMs: o,
          signal: y.controller.signal,
          body: k,
          onRequestID: (ie) => {
            y.detached || (y.requestID = ie, I(y), g(y, { requestID: ie }));
          },
          onFrame: (ie) => {
            A(y, ie);
          }
        });
        if (y.detached || y.stopped || S.current.get(y.sessionID) !== y)
          return;
        const j = Ru(F.finalOutput), Q = xo(
          F.finalOutput?.text || F.textOutput || y.buffer.text
        ).trim();
        w(y, {
          text: Q,
          output: j,
          requestID: F.requestID
        });
      } catch (F) {
        if (y.detached || y.stopped || S.current.get(y.sessionID) !== y)
          return;
        const j = Cn(
          F,
          y.kind === "opening" ? "智能体开场失败。" : "智能体运行失败。"
        );
        w(y, {
          text: y.buffer.text.trim() || j,
          error: !0,
          failureMessage: j,
          requestID: y.requestID
        });
      }
    },
    [
      A,
      o,
      w,
      I,
      a.stop,
      a.stream,
      v,
      g
    ]
  ), U = B(
    async (y) => {
      const M = y.text.trim(), k = l();
      if (!Uo(y) || !t || !k || S.current.has(k))
        return;
      const F = Date.now(), j = new Date(F).toISOString(), Q = {
        id: `${k}-user-${F}`,
        role: "user",
        text: M,
        createdAt: j,
        content: y.content
      }, ie = `${k}-assistant-${F}`, be = P({
        sessionID: k,
        userMessageID: Q.id,
        assistantMessageID: ie,
        createdAt: j,
        prompt: M,
        content: y.content
      });
      if (!T(be)) {
        be.buffer.dispose();
        return;
      }
      d(
        k,
        Qv(u(k), M)
      ), h(k, (Oe) => [
        ...Oe,
        Q,
        {
          id: ie,
          role: "assistant",
          text: "",
          createdAt: j,
          running: !0
        }
      ]), await q(be, a.request, {
        ...c,
        agent: t,
        session_id: k,
        context_key: e,
        input: {
          text: M,
          content: y.content,
          params: y.params,
          canvas_context: y.canvas_context
        }
      });
    },
    [
      t,
      e,
      P,
      q,
      l,
      u,
      T,
      c,
      a.request,
      h,
      d
    ]
  ), he = B(
    async (y) => {
      const M = a.opening?.trim() || "";
      if (!M || !t || !y || S.current.has(y))
        return;
      const k = Date.now(), F = new Date(k).toISOString(), j = f(y).find(
        (be) => be.role === "assistant" && be.kind === "opening" && !!be.requestID
      ), Q = j?.id || `${y}-opening-${k}`, ie = P({
        kind: "opening",
        sessionID: y,
        requestID: j?.requestID,
        userMessageID: "",
        assistantMessageID: Q,
        createdAt: j?.createdAt || F,
        text: j?.text,
        replayPending: !!(j?.running && j.text)
      });
      if (!T(ie)) {
        ie.buffer.dispose();
        return;
      }
      j || h(y, (be) => [
        ...be,
        {
          id: Q,
          role: "assistant",
          kind: "opening",
          text: "",
          createdAt: F,
          running: !0
        }
      ]), await q(ie, M, {
        ...c,
        agent: t,
        session_id: y,
        context_key: e
      });
    },
    [
      t,
      e,
      P,
      q,
      f,
      T,
      c,
      a.opening,
      h
    ]
  ), de = B(async () => {
    const y = l(), M = S.current.get(y);
    if (!(!M?.requestID || !M.cancelable || M.stopping)) {
      M.stopping = !0, I(M), v("");
      try {
        if (await Hv(M.requestID, a.stop), S.current.get(y) !== M)
          return;
        M.stopped = !0, M.controller.abort(), w(M, {
          text: M.buffer.text.trim() || "已停止生成",
          requestID: M.requestID
        });
      } catch (k) {
        if (S.current.get(y) !== M)
          return;
        M.stopping = !1, I(M), l() === y && v(Cn(k, "停止生成失败。"));
      }
    }
  }, [w, l, I, a.stop, v]), Z = B(
    (y) => S.current.has(y),
    []
  ), H = B(
    (y, M) => Yv(M, S.current.get(y)),
    []
  ), ee = B(() => {
    for (const y of S.current.values())
      y.detached = !0, y.buffer.dispose(), y.controller.abort(), _(y.sessionID, !1);
    S.current.clear(), b({});
  }, [_]);
  le(() => {
    const y = S.current;
    return () => {
      for (const M of y.values())
        M.detached = !0, M.buffer.dispose(), M.controller.abort();
      y.clear();
    };
  }, []);
  const L = C[r];
  return {
    running: !!(L || i.some(
      (y) => y.role === "assistant" && y.running
    )),
    stopping: !!L?.stopping,
    cancelable: !!L?.cancelable,
    hasRun: Z,
    mergeMessages: H,
    reset: ee,
    send: U,
    startOpening: he,
    stop: de
  };
}
function dr(t, e) {
  return t.id === e.assistantMessageID || !!(e.requestID && t.requestID === e.requestID);
}
function Wv(t, e) {
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
function Yv(t, e) {
  if (!e)
    return t;
  let s = !1;
  const n = t.map((r) => dr(r, e) ? (s = !0, {
    ...r,
    requestID: e.requestID || r.requestID,
    text: e.buffer.text || r.text,
    running: !0,
    error: !1
  }) : r);
  return s ? n : [
    ...n,
    ...e.input || Jl(e.content) ? [
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
function Qv(t, e) {
  return t.trim() && t.trim() !== "新会话" ? t : Array.from(e.trim().replace(/\s+/g, " ")).slice(0, 40).join("") || "新会话";
}
function Io(t) {
  const e = t.text?.trim() || t.streamedText?.trim() || "";
  return e || (t.canceled ? "已停止生成" : t.failed ? t.error?.trim() || "智能体运行失败。" : "");
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-runner", "@/lib/runtime-stream-output"]);
const hr = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-runner");
if (!hr || Object.keys(hr).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-runner");
const Jv = hr.watchRuntimeStream, fr = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!fr || Object.keys(fr).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const Xv = fr.normalizeRuntimeFrameOutput;
function Kv({
  modalOpen: t,
  sessionID: e,
  messages: s,
  blockMs: n,
  runtimeApi: r,
  updateDocument: i
}) {
  const o = ne(/* @__PURE__ */ new Map());
  le(() => {
    const a = o.current;
    if (!t || !e) {
      To(a);
      return;
    }
    const c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
    for (const u of s)
      u.document && (c.set(u.document.id, u.document), Mu(u.document) && l.set(u.document.id, u.document));
    for (const [u, f] of a) {
      const h = c.get(u);
      if (!h || f.sessionID !== e) {
        f.controller.abort(), a.delete(u);
        continue;
      }
      f.document = Hs(f.document, h) || h;
    }
    for (const u of l.values()) {
      if (a.has(u.id))
        continue;
      const f = {
        sessionID: e,
        controller: new AbortController(),
        document: u
      };
      a.set(u.id, f), Zv({
        watch: f,
        watches: a,
        blockMs: n,
        runtimeApi: r,
        updateDocument: i
      });
    }
  }, [n, s, t, r, e, i]), le(() => {
    const a = o.current;
    return () => To(a);
  }, []);
}
async function Zv(t) {
  const { watch: e, watches: s, blockMs: n, runtimeApi: r, updateDocument: i } = t, o = e.document.id;
  let a = null, c = 0, l = 0;
  const u = (d) => {
    !d || e.controller.signal.aborted || (e.document = d, i(e.sessionID, o, d));
  }, f = async () => {
    const d = await Xl(
      r.document,
      o
    );
    return u(Hs(e.document, d)), d;
  }, h = () => {
    if (a || e.controller.signal.aborted)
      return;
    const d = new AbortController(), p = () => d.abort();
    a = d, c = Date.now(), e.controller.signal.addEventListener("abort", p, { once: !0 }), Jv({
      streamApi: r.documentStream,
      requestID: `document:${o}`,
      blockMs: n,
      signal: d.signal,
      stopOnResult: !1,
      recoverOnError: !0,
      fallbackToPoll: !1,
      onFrame: (_) => {
        c = Date.now();
        const v = sy(_);
        u(Go(e.document, v)), ny(v) === "document_complete" && f().catch(() => {
        });
      }
    }).catch(() => {
    }).finally(() => {
      e.controller.signal.removeEventListener("abort", p), a === d && (a = null);
    });
  };
  try {
    h();
    try {
      const d = await f();
      if (!Ms(d))
        return;
    } catch {
      if (e.controller.signal.aborted)
        return;
      l = 1;
    }
    for (; !e.controller.signal.aborted; ) {
      if (await ty(
        e.controller.signal,
        ey(l)
      ), e.controller.signal.aborted)
        return;
      if (!(a !== null && Date.now() - c < Math.max(6e3, n * 3)))
        try {
          const p = await f();
          if (!Ms(p))
            return;
          l = Math.min(l + 1, 3), h();
        } catch {
          if (e.controller.signal.aborted)
            return;
          l = Math.min(l + 1, 3);
        }
    }
  } finally {
    a?.abort(), s.get(o) === e && s.delete(o);
  }
}
function ey(t) {
  const e = [2e3, 4e3, 8e3, 12e3];
  return e[Math.min(t, e.length - 1)] ?? e[e.length - 1];
}
function ty(t, e) {
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
function sy(t) {
  return Xv(t.output, t);
}
function ny(t) {
  return String(t.event || t.semantic_event || "").trim().toLowerCase();
}
function To(t) {
  for (const e of t.values())
    e.controller.abort();
  t.clear();
}
const ws = [800, 1500, 3e3, 5e3, 8e3];
function ry({
  modalOpen: t,
  sessionID: e,
  messages: s,
  refreshSession: n
}) {
  const r = oy(s);
  le(() => {
    if (!t || !e || !r)
      return;
    const i = new AbortController();
    return iy(e, i.signal, n), () => i.abort();
  }, [t, r, n, e]);
}
async function iy(t, e, s) {
  let n = 0;
  for (; !e.aborted; ) {
    const r = ws[Math.min(n, ws.length - 1)] ?? ws[ws.length - 1];
    if (await ay(e, r), e.aborted)
      return;
    try {
      await s(t);
    } catch {
    }
    n += 1;
  }
}
function oy(t) {
  return t.filter((e) => !e.document).flatMap(
    (e) => Wo(e.output).filter((s) => s.status === "generating").map((s) => s.id)
  ).sort((e, s) => e - s).join(":");
}
function ay(t, e) {
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
function Co(t, e, s) {
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
function cy(t, e) {
  const s = new Set(t.map((n) => n.id));
  return [
    ...t,
    ...e.filter((n) => !s.has(n.id))
  ];
}
function ly(t, e) {
  const s = new Set(
    t.map((r) => r.recordID).filter((r) => !!r)
  );
  return [...e.filter(
    (r) => !r.recordID || !s.has(r.recordID)
  ), ...t];
}
function Eo(t, e) {
  const s = new Map(
    t.filter((i) => !!i.recordID).map((i) => [i.recordID, i])
  ), n = new Set(
    e.map((i) => i.recordID).filter((i) => !!i)
  );
  return [
    ...t.filter(
      (i) => !!i.recordID && !n.has(i.recordID)
    ),
    ...e.map((i) => ({
      ...i,
      autoOpenDocument: i.autoOpenDocument || s.get(i.recordID || 0)?.autoOpenDocument
    }))
  ];
}
function En(t) {
  return t.map((e, s) => ({
    id: e.id ? `saved-${e.id}` : `saved-${s}`,
    recordID: e.id || void 0,
    role: e.role,
    kind: e.kind,
    text: e.text,
    createdAt: e.createdAt,
    content: e.content,
    output: e.output,
    activities: zo(e.output),
    requestID: e.requestID || void 0,
    running: e.status === 3,
    error: e.status === 2,
    failureMessage: e.status === 2 && typeof e.output.error == "string" ? e.output.error : void 0,
    document: e.document
  }));
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output"]);
const mr = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!mr || Object.keys(mr).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const st = mr.runtimeErrorMessage, Ao = 20, Ss = 20, Ro = 10, An = 48, uy = [500, 1e3, 2e3, 4e3, 8e3, 8e3];
function dy({
  agentKey: t,
  contextKey: e,
  modalOpen: s,
  blockMs: n,
  lazySession: r = !1,
  proactiveOpening: i = !1,
  assistantApi: o,
  runtimeApi: a,
  requestScope: c,
  prepareInput: l
}) {
  const u = e?.trim() || (t ? `agent-runtime:${t}` : ""), [f, h] = G([]), [d, p] = G(0), [_, v] = G("新会话"), [C, b] = G([]), [S, I] = G(!1), [T, E] = G(!1), [g, w] = G(!1), [A, P] = G(""), [W, X] = G([]), q = ne(0), U = ne(/* @__PURE__ */ new Map()), he = ne(
    /* @__PURE__ */ new Map()
  ), de = ne(""), Z = ne(0), H = ne(0), ee = ne(0), L = ne(!1), y = ne(!1), M = ne(!1), k = ne(0), F = ne(null), j = ne(null), Q = B(
    (R, $) => {
      q.current = R, p(R), v($.title), b($.messages), k.current = 0;
    },
    []
  ), ie = B(
    (R, $) => {
      U.current.set(R, $), q.current === R && (v($.title), b($.messages));
    },
    []
  ), be = B(() => q.current, []), Oe = B((R) => U.current.get(R)?.title || "新会话", []), ye = B((R) => U.current.get(R)?.messages || [], []), Ce = B(
    (R, $) => {
      const O = U.current.get(R);
      O && ie(R, {
        ...O,
        messages: $(O.messages)
      });
    },
    [ie]
  ), z = B(
    (R, $, O) => {
      Ce(
        R,
        (V) => V.map(
          (Y) => Y.document?.id === $ || O.messageID > 0 && Y.recordID === O.messageID ? {
            ...Y,
            document: Hs(Y.document, O) || O
          } : Y
        )
      );
    },
    [Ce]
  ), J = B(
    (R, $) => {
      const O = U.current.get(R);
      O && ie(R, { ...O, title: $ }), h(
        (V) => V.map(
          (Y) => Y.id === R ? { ...Y, title: $ } : Y
        )
      );
    },
    [ie]
  ), te = B(
    async (R) => {
      const $ = `${t}:${u}`;
      for (const O of uy) {
        if (await hy(O), de.current !== $)
          return;
        try {
          const V = await Kl(o, {
            agentKey: t,
            contextKey: u,
            sessionID: R
          });
          if (!V)
            return;
          if (V.titleSource === "llm" || V.titleSource === "manual") {
            J(R, V.title);
            return;
          }
        } catch {
        }
      }
    },
    [t, o, u, J]
  ), we = B(
    (R, $) => {
      h((O) => {
        const V = O.find(
          (Y) => Y.id === R
        );
        return V ? Co(O, { ...V, running: $ }, $) : O;
      });
    },
    []
  ), on = B(
    (R) => Zl(
      {
        api: o,
        agentKey: t,
        contextKey: u,
        sessionID: q.current
      },
      R
    ),
    [t, o, u]
  ), an = B(
    (R) => {
      const $ = q.current;
      if (!$ || !t)
        return Promise.reject(new Error("当前会话不可用"));
      const O = `${$}:${R.refType}:${R.refId}`, V = he.current.get(O);
      if (V)
        return V;
      const Y = eu(
        a.referencePreview,
        { agentKey: t, sessionID: $ },
        R
      );
      return he.current.set(O, Y), Y.catch(() => {
        he.current.get(O) === Y && he.current.delete(O);
      }), Y;
    },
    [t, a.referencePreview]
  ), se = Gv({
    agentKey: t,
    contextKey: u,
    modalOpen: s,
    sessionLoading: g,
    sessionID: d,
    messages: C,
    blockMs: n,
    runtimeApi: a,
    requestScope: c,
    getActiveSessionID: be,
    getSessionTitle: Oe,
    getSessionMessages: ye,
    updateSessionMessages: Ce,
    updateSessionTitle: J,
    syncSessionTitle: te,
    setSessionRunning: we,
    setError: P
  });
  Kv({
    modalOpen: s,
    sessionID: d,
    messages: C,
    blockMs: n,
    runtimeApi: a,
    updateDocument: z
  });
  const cs = B(
    async (R) => {
      if (!t || !u || q.current !== R)
        return;
      const $ = await Bt(o, {
        agentKey: t,
        contextKey: u,
        sessionID: R,
        limit: Ss
      });
      if (q.current !== R)
        return;
      const O = se.mergeMessages(
        R,
        En($.messages)
      );
      Ce(
        R,
        (V) => Eo(V, O)
      );
    },
    [
      t,
      o,
      u,
      se.mergeMessages,
      Ce
    ]
  );
  ry({
    modalOpen: s,
    sessionID: d,
    messages: C,
    refreshSession: cs
  });
  const _e = B(
    (R, $ = !1) => {
      const O = R.session?.id || 0;
      if (!O)
        return;
      const V = se.mergeMessages(
        O,
        En(R.messages)
      ), Y = U.current.get(O), Se = Y ? Eo(Y.messages, V) : V, Ee = {
        title: R.session?.title || "新会话",
        messages: Se,
        oldestMessageID: Y?.oldestMessageID || R.messages[0]?.id || 0,
        canLoadOlder: Y?.canLoadOlder ?? R.messages.length > 0
      };
      if (U.current.set(O, Ee), Q(O, Ee), R.session) {
        const Ke = {
          ...R.session,
          running: se.hasRun(O) || Se.some((qe) => qe.running)
        };
        h(
          (qe) => Co(qe, Ke, $)
        );
      }
    },
    [se.hasRun, se.mergeMessages, Q]
  ), wt = B(async () => {
    if (!t || !u)
      return;
    const R = ++Z.current, $ = ++H.current;
    y.current = !0, I(!0), E(!1), q.current || w(!0), P("");
    try {
      const O = await ui(o, {
        agentKey: t,
        contextKey: u,
        limit: Ao
      });
      if (Z.current !== R || H.current !== $)
        return;
      h(
        O.sessions.map((Ee) => ({
          ...Ee,
          running: !!Ee.running || se.hasRun(Ee.id)
        }))
      ), ee.current = O.sessions[O.sessions.length - 1]?.id || 0, L.current = O.hasMore, I(!1);
      const V = O.sessions[0], Y = V ? U.current.get(V.id) : void 0;
      if (V && Y && (Q(V.id, Y), w(!1)), !V && r && !i) {
        q.current = 0, p(0), v("新会话"), b([]);
        return;
      }
      const Se = await Bt(o, {
        agentKey: t,
        contextKey: u,
        sessionID: V?.id,
        create: !V && !i,
        title: "新会话",
        limit: Ss
      });
      Z.current === R && (_e(Se, !V), !V && i && Se.session?.id && se.startOpening(Se.session.id));
    } catch (O) {
      Z.current === R && H.current === $ && P(st(O, "加载会话失败。"));
    } finally {
      Z.current === R && H.current === $ && (y.current = !1, I(!1), w(!1));
    }
  }, [
    t,
    _e,
    o,
    u,
    r,
    i,
    se.hasRun,
    se.startOpening,
    Q
  ]), je = B(
    async (R, $ = !1) => {
      if (!t || !u)
        return;
      const O = ++Z.current;
      M.current = !1;
      const V = $ ? void 0 : U.current.get(R);
      V ? (Q(R, V), w(!1)) : ($ && (q.current = 0, p(0), v("新会话"), b([])), w(!0)), P("");
      try {
        const Y = await Bt(o, {
          agentKey: t,
          contextKey: u,
          sessionID: R || void 0,
          create: $,
          title: "新会话",
          limit: $ ? Ss : Ro
        });
        Z.current === O && (_e(Y, $), $ && i && Y.session?.id && se.startOpening(Y.session.id));
      } catch (Y) {
        Z.current === O && P(st(Y, "加载会话失败。"));
      } finally {
        Z.current === O && w(!1);
      }
    },
    [
      t,
      _e,
      o,
      u,
      i,
      se.startOpening,
      Q
    ]
  ), Nt = B(() => {
    Z.current += 1, M.current = !1, q.current = 0, p(0), v("新会话"), b([]), w(!1), P("");
  }, []), cn = B(
    async () => {
      if (r && !i) {
        Nt();
        return;
      }
      await je(0, !0);
    },
    [r, Nt, je, i]
  ), Il = B(
    async (R, $) => {
      try {
        const O = await tu(
          o,
          R,
          $
        );
        J(R, O.title), P("");
      } catch (O) {
        const V = st(O, "编辑标题失败。");
        throw P(V), new Error(V);
      }
    },
    [o, J]
  ), Tl = B(
    async (R) => {
      if (se.hasRun(R))
        throw new Error("当前会话正在生成，暂时不能删除。");
      const $ = f.findIndex(
        (V) => V.id === R
      ), O = f.filter(
        (V) => V.id !== R
      );
      try {
        if (await su(o, R), U.current.delete(R), h(O), P(""), q.current !== R)
          return;
        const V = Math.min(
          Math.max(0, $),
          Math.max(0, O.length - 1)
        ), Y = O[V];
        Y ? await je(Y.id, !1) : await cn();
      } catch (V) {
        const Y = st(V, "删除会话失败。");
        throw P(Y), new Error(Y);
      }
    },
    [o, je, se.hasRun, f, cn]
  ), ln = B(async () => {
    if (!t || !u || !L.current || y.current)
      return;
    const R = H.current, $ = ee.current;
    y.current = !0, E(!0);
    try {
      const O = await ui(o, {
        agentKey: t,
        contextKey: u,
        limit: Ao,
        lastSessionID: ee.current
      });
      if (H.current !== R)
        return;
      if (O.sessions.length === 0) {
        L.current = !1;
        return;
      }
      const V = O.sessions[O.sessions.length - 1]?.id || 0;
      h(
        (Y) => cy(
          Y,
          O.sessions.map((Se) => ({
            ...Se,
            running: !!Se.running || se.hasRun(Se.id)
          }))
        )
      ), ee.current = V, L.current = O.hasMore && V > 0 && V !== $;
    } catch (O) {
      H.current === R && P(st(O, "加载更多会话失败。"));
    } finally {
      H.current === R && (y.current = !1, E(!1));
    }
  }, [t, o, u, se.hasRun]), $t = B(async () => {
    const R = q.current, $ = U.current.get(R);
    if (!R || !$?.canLoadOlder || !$.oldestMessageID || !t || !u || M.current)
      return;
    const O = j.current, V = O?.scrollHeight || 0, Y = O?.scrollTop || 0, Se = Z.current;
    M.current = !0;
    try {
      const Ee = await Bt(o, {
        agentKey: t,
        contextKey: u,
        sessionID: R,
        limit: Ro,
        lastMessageID: $.oldestMessageID
      });
      if (Z.current !== Se || q.current !== R)
        return;
      const Ke = U.current.get(R);
      if (!Ke)
        return;
      if (Ee.messages.length === 0) {
        ie(R, {
          ...Ke,
          canLoadOlder: !1
        });
        return;
      }
      ie(R, {
        ...Ke,
        messages: ly(
          Ke.messages,
          En(Ee.messages)
        ),
        oldestMessageID: Ee.messages[0]?.id || Ke.oldestMessageID,
        canLoadOlder: !0
      }), window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const qe = j.current;
          !qe || q.current !== R || (qe.scrollTop = Y + qe.scrollHeight - V, k.current = qe.scrollTop);
        });
      });
    } catch (Ee) {
      Z.current === Se && q.current === R && P(st(Ee, "加载历史消息失败。"));
    } finally {
      Z.current === Se && q.current === R && (M.current = !1);
    }
  }, [t, o, u, ie]), Cl = B((R) => {
    const $ = R || F.current;
    $ && $.scrollHeight - $.scrollTop - $.clientHeight <= An && ln();
  }, [ln]), El = B(() => {
    const R = j.current;
    if (!R)
      return;
    const $ = k.current, O = R.scrollTop;
    k.current = O, O < $ && O <= An && $t();
  }, [$t]), Al = B(
    (R) => {
      R.deltaY < 0 && R.currentTarget.scrollTop <= An && $t();
    },
    [$t]
  );
  le(() => {
    if (!s || !t)
      return;
    const R = `${t}:${u}`;
    return de.current !== R && (de.current = R, se.reset(), U.current.clear(), he.current.clear(), h([]), q.current = 0, p(0), v("新会话"), b([]), ee.current = 0, L.current = !1, k.current = 0), wt(), () => {
      Z.current += 1, H.current += 1, y.current = !1, M.current = !1;
    };
  }, [t, u, wt, s, se.reset]), le(() => {
    if (!s || !t) {
      X([]);
      return;
    }
    X([]);
    let R = !0;
    return nu(a.inputConfig, t).then(($) => {
      R && X($);
    }).catch(() => {
      R && X([]);
    }), () => {
      R = !1;
    };
  }, [t, s, a.inputConfig]);
  const Rl = B(
    async (R) => {
      const $ = l ? await l(R) : R;
      if (!(!Uo($) || !t)) {
        if (!q.current && r) {
          w(!0), P("");
          try {
            const O = await Bt(o, {
              agentKey: t,
              contextKey: u,
              create: !0,
              title: "新会话",
              limit: Ss
            });
            _e(O, !0);
          } catch (O) {
            P(st(O, "创建会话失败。"));
            return;
          } finally {
            w(!1);
          }
        }
        await se.send($);
      }
    },
    [
      t,
      _e,
      o,
      u,
      r,
      l,
      se.send
    ]
  );
  return {
    sessionID: d,
    sessionTitle: _,
    sessions: f,
    messages: C,
    sessionsLoading: S,
    sessionsLoadingMore: T,
    sessionLoading: g,
    running: se.running,
    stopping: se.stopping,
    cancelable: se.cancelable,
    sendDisabled: !t || !d && !r || g || se.running,
    error: A,
    inputParams: W,
    sessionListRef: F,
    messageListRef: j,
    openSession: (R) => je(R, !1),
    startNewSession: cn,
    renameSession: Il,
    deleteSession: Tl,
    loadMoreSessions: ln,
    loadOlderMessages: $t,
    handleSessionListScroll: Cl,
    handleMessageListScroll: El,
    handleMessageListWheel: Al,
    loadReferences: on,
    loadReferencePreview: an,
    send: Rl,
    stop: se.stop
  };
}
function hy(t) {
  return new Promise((e) => window.setTimeout(e, t));
}
const Wt = 10;
function fy({
  controller: t
}) {
  const e = Ge(
    () => t.messages.filter(my),
    [t.messages]
  ), s = JSON.stringify(
    e.map((d) => d.id)
  ), [n, r] = G(""), [i, o] = G(0), a = ne(null);
  le(() => {
    const d = t.messageListRef.current, p = JSON.parse(s);
    if (!d || p.length === 0) {
      r("");
      return;
    }
    let _ = 0;
    const v = () => {
      _ = 0;
      const b = py(d, p);
      r(
        (S) => S === b ? S : b
      );
    }, C = () => {
      _ || (_ = window.requestAnimationFrame(v));
    };
    return d.addEventListener("scroll", C, { passive: !0 }), window.addEventListener("resize", C), C(), () => {
      d.removeEventListener("scroll", C), window.removeEventListener("resize", C), _ && window.cancelAnimationFrame(_);
    };
  }, [t.messageListRef, s]), le(() => {
    const d = JSON.parse(s), p = d.indexOf(n);
    o((_) => p < 0 ? pr(_, d.length) : by(p, d.length));
  }, [n, s]), le(() => {
    a.current && n && _y(a.current, n);
  }, [n, s]);
  const c = B(
    (d) => {
      const p = t.messageListRef.current, _ = p ? gy(p, d) : null;
      if (!p || !_)
        return;
      const v = p.getBoundingClientRect(), C = _.getBoundingClientRect();
      r(d), p.scrollTo({
        top: Math.max(
          0,
          p.scrollTop + C.top - v.top - 24
        ),
        behavior: "smooth"
      });
    },
    [t.messageListRef]
  ), l = B(
    (d) => {
      o(
        (p) => pr(
          p + d * Wt,
          e.length
        )
      );
    },
    [e.length]
  );
  if (e.length < 2)
    return null;
  const u = e.slice(
    i,
    i + Wt
  ), f = i > 0, h = i + Wt < e.length;
  return /* @__PURE__ */ N("nav", { className: "agent-chat-message-navigator", "aria-label": "用户消息快速跳转", children: [
    /* @__PURE__ */ m("style", { children: vy }),
    /* @__PURE__ */ N("div", { className: "agent-chat-message-navigator-controls", children: [
      /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: "agent-chat-message-navigator-page",
          title: "显示上一组消息",
          "aria-label": "显示上一组用户消息",
          disabled: !f,
          onClick: () => l(-1),
          children: /* @__PURE__ */ m(Ll, {})
        }
      ),
      /* @__PURE__ */ m("div", { className: "agent-chat-message-navigator-rail", children: u.map((d, p) => /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: "agent-chat-message-navigator-mark",
          "data-active": d.id === n ? "true" : void 0,
          title: `跳转到：${Mo(d.text)}`,
          "aria-label": `跳转到第 ${i + p + 1} 条用户消息`,
          "aria-current": d.id === n ? "location" : void 0,
          onClick: () => c(d.id)
        },
        d.id
      )) }),
      /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: "agent-chat-message-navigator-page",
          title: "显示下一组消息",
          "aria-label": "显示下一组用户消息",
          disabled: !h,
          onClick: () => l(1),
          children: /* @__PURE__ */ m(Vo, {})
        }
      )
    ] }),
    /* @__PURE__ */ m("div", { ref: a, className: "agent-chat-message-navigator-panel", children: u.map((d) => /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: "agent-chat-message-navigator-item",
        "data-navigator-message-id": d.id,
        "data-active": d.id === n ? "true" : void 0,
        onClick: () => c(d.id),
        children: Mo(d.text)
      },
      d.id
    )) })
  ] });
}
function my(t) {
  return t.role === "user";
}
function py(t, e) {
  const s = t.getBoundingClientRect(), n = s.top + Math.min(s.height * 0.28, 220), r = yl(t);
  let i = e[0] || "";
  for (const o of e) {
    const a = r.get(o);
    if (a) {
      if (a.getBoundingClientRect().top > n)
        break;
      i = o;
    }
  }
  return i;
}
function gy(t, e) {
  return yl(t).get(e);
}
function yl(t) {
  return new Map(
    Array.from(
      t.querySelectorAll("[data-message-id]")
    ).map((e) => [e.dataset.messageId || "", e])
  );
}
function Mo(t) {
  const e = String(t || "").replace(/\s+/g, " ").trim();
  if (!e)
    return "空消息";
  const s = Array.from(e);
  return s.length > 46 ? `${s.slice(0, 46).join("")}...` : e;
}
function by(t, e) {
  return pr(
    t - Math.floor(Wt / 2),
    e
  );
}
function pr(t, e) {
  return Math.min(
    Math.max(0, e - Wt),
    Math.max(0, t)
  );
}
function _y(t, e) {
  const s = Array.from(
    t.querySelectorAll("[data-navigator-message-id]")
  ).find((a) => a.dataset.navigatorMessageId === e);
  if (!s)
    return;
  const n = s.offsetTop, r = n + s.offsetHeight, i = t.scrollTop + 8, o = t.scrollTop + t.clientHeight - 8;
  n < i ? t.scrollTop = Math.max(0, n - 8) : r > o && (t.scrollTop = r - t.clientHeight + 8);
}
const vy = `
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
const gr = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!gr || Object.keys(gr).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const ai = gr.cn, br = window.DeverFront?.sdk?.getCompatModule("@/components/reference-composer");
if (!br || Object.keys(br).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/reference-composer");
const wl = br, yy = wl.ReferenceComposer, wy = wl.ReferenceContentView, ko = "agent-chat-column", Sy = {
  "@": "hidden",
  "#": "hidden"
};
function xy({
  controller: t,
  clipboardImageUploadRuleId: e,
  uploadBizKey: s,
  uploadBizName: n,
  allowResourceLibrary: r,
  composerDisabled: i,
  composerToolbar: o,
  composerParameters: a,
  composerParameterScopeKey: c,
  renderFileLibrary: l,
  onUploadedFiles: u,
  renderMessageActions: f,
  renderArtifactActions: h,
  onOpenDocument: d,
  referenceProviders: p = []
}) {
  const _ = [
    ...p,
    {
      trigger: "#",
      referenceTypes: ["message", "artifact", "upload_file", "session"],
      loadReferences: t.loadReferences,
      loadPreview: t.loadReferencePreview,
      availableScopes: ["current", "history"],
      searchPlaceholder: "搜索消息或会话"
    }
  ], v = Ay(
    _,
    t.loadReferencePreview
  );
  return /* @__PURE__ */ N(Ft.Root, { className: "agent-chat-thread relative flex min-h-0 flex-1 flex-col bg-background", children: [
    /* @__PURE__ */ m("style", { children: ky }),
    /* @__PURE__ */ N(Ft.ViewportProvider, { children: [
      /* @__PURE__ */ m(
        Ft.Viewport,
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
              className: ai(
                ko,
                "agent-chat-message-column flex min-h-full flex-col"
              ),
              children: t.sessionLoading && t.messages.length === 0 ? /* @__PURE__ */ m("div", { className: "agent-chat-empty-state text-muted-foreground", children: /* @__PURE__ */ m(Ut, { className: "size-5 animate-spin" }) }) : t.messages.length === 0 ? /* @__PURE__ */ N("div", { className: "agent-chat-empty-state", children: [
                /* @__PURE__ */ m("span", { className: "flex size-10 items-center justify-center rounded-md border bg-muted/30 text-muted-foreground", children: /* @__PURE__ */ m(Vl, { className: "size-5" }) }),
                /* @__PURE__ */ m("span", { className: "text-sm text-muted-foreground", children: "开始一段新对话" })
              ] }) : /* @__PURE__ */ m("div", { className: "agent-chat-message-stack flex flex-col", children: /* @__PURE__ */ m(Ft.Messages, { children: () => /* @__PURE__ */ m(
                Iy,
                {
                  controller: t,
                  loadPreview: v,
                  renderMessageActions: f,
                  renderArtifactActions: h,
                  onOpenDocument: d
                }
              ) }) })
            }
          )
        }
      ),
      /* @__PURE__ */ m(fy, { controller: t }),
      /* @__PURE__ */ N(
        "footer",
        {
          className: "agent-chat-footer shrink-0",
          style: {
            paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))"
          },
          children: [
            /* @__PURE__ */ m(
              Ft.ScrollToBottom,
              {
                behavior: "smooth",
                className: "agent-chat-scroll-to-bottom",
                title: "回到底部",
                "aria-label": "回到底部",
                children: /* @__PURE__ */ m(jl, {})
              }
            ),
            /* @__PURE__ */ N("div", { className: ko, children: [
              t.error ? /* @__PURE__ */ m("div", { className: "mb-2 text-sm text-destructive", children: t.error }) : null,
              /* @__PURE__ */ m(
                Ey,
                {
                  controller: t,
                  referenceProviders: _,
                  clipboardImageUploadRuleId: e,
                  uploadBizKey: s,
                  uploadBizName: n,
                  allowResourceLibrary: r,
                  disabled: i,
                  toolbar: o,
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
function Iy({
  controller: t,
  loadPreview: e,
  renderMessageActions: s,
  renderArtifactActions: n,
  onOpenDocument: r
}) {
  return D((o) => o.message.role) === "user" ? /* @__PURE__ */ m(
    Ty,
    {
      controller: t,
      loadPreview: e,
      renderMessageActions: s
    }
  ) : /* @__PURE__ */ m(
    Cy,
    {
      controller: t,
      loadPreview: e,
      renderMessageActions: s,
      renderArtifactActions: n,
      onOpenDocument: r
    }
  );
}
function Ty({
  controller: t,
  loadPreview: e,
  renderMessageActions: s
}) {
  const n = D(
    (i) => i.message.metadata.custom?.content
  ), r = D(
    (i) => i.message.metadata.custom?.sourceText
  );
  return /* @__PURE__ */ N(sr.Root, { className: "agent-chat-message agent-chat-user-message relative flex flex-col items-end pl-6 md:pl-20", children: [
    /* @__PURE__ */ m("div", { className: "agent-chat-user-bubble max-w-[88%] whitespace-pre-wrap break-words rounded-lg bg-muted px-3.5 py-2.5 text-base leading-7 text-foreground [overflow-wrap:anywhere] md:max-w-full", children: /* @__PURE__ */ m(
      wy,
      {
        content: n,
        fallback: typeof r == "string" ? r : "",
        loadPreview: e
      }
    ) }),
    /* @__PURE__ */ m(
      Sl,
      {
        role: "user",
        sessionTitle: t.sessionTitle,
        renderMessageActions: s
      }
    )
  ] });
}
function Cy({
  controller: t,
  loadPreview: e,
  renderMessageActions: s,
  renderArtifactActions: n,
  onOpenDocument: r
}) {
  const i = D((g) => g.message.status), o = D((g) => g.message.metadata.custom?.output), a = D(
    (g) => g.message.metadata.custom?.activities
  ), c = D(
    (g) => g.message.metadata.custom?.sourceText
  ), l = D(
    (g) => g.message.metadata.custom?.document
  ), u = ku(l), f = D(
    (g) => g.message.metadata.custom?.failureMessage
  ), h = Number(
    D((g) => g.message.metadata.custom?.recordID) || 0
  ), d = Array.isArray(a) ? a : [], p = i?.type === "running" && !l && !d.some(
    (g) => ["image", "video", "audio", "file"].includes(g.kind)
  ) ? Du(o) : void 0, _ = Pu(o), v = _?.id ? Ou(t.messages, _.id) : void 0, C = Nu(o), b = Yo(
    l,
    $u(o)
  ), S = i?.type === "incomplete" && i.reason === "error", I = S && typeof f == "string" && f.trim() && (l || f.trim() !== String(c || "").trim()) ? f : "", T = !!(l && i?.type === "running" && !Ms(l) && !b), E = My(
    i?.type === "running",
    d,
    c
  );
  return /* @__PURE__ */ m(
    sr.Root,
    {
      className: ai(
        "agent-chat-message relative min-w-0 [contain-intrinsic-size:auto_180px] [content-visibility:auto]",
        S && "text-destructive"
      ),
      children: /* @__PURE__ */ N(
        ru,
        {
          messageID: h,
          render: n,
          children: [
            p ? /* @__PURE__ */ m("div", { role: "status", className: "mb-3 text-xs text-muted-foreground", children: p.text }) : null,
            l ? /* @__PURE__ */ N($e, { children: [
              u ? /* @__PURE__ */ m(un, { text: u, error: S }) : null,
              /* @__PURE__ */ m(
                iu,
                {
                  document: l,
                  onOpen: r
                }
              ),
              T ? /* @__PURE__ */ m(Do, {}) : null,
              b ? /* @__PURE__ */ m(
                un,
                {
                  text: b,
                  error: S,
                  className: "mt-4"
                }
              ) : null
            ] }) : /* @__PURE__ */ N($e, { children: [
              /* @__PURE__ */ m(sr.Parts, { children: ({ part: g }) => {
                if (g.type === "text") {
                  const w = g.status.type === "running";
                  return w && !g.text && d.length === 0 ? /* @__PURE__ */ m(Ry, {}) : g.text ? /* @__PURE__ */ m(
                    un,
                    {
                      text: g.text,
                      streaming: w,
                      error: S
                    }
                  ) : null;
                }
                if (g.type === "tool-call") {
                  const w = d.find(
                    (A) => A.id === g.toolCallId
                  );
                  return /* @__PURE__ */ m(ou, { activity: w });
                }
                return null;
              } }),
              E ? /* @__PURE__ */ m(Do, {}) : null,
              /* @__PURE__ */ m(
                au,
                {
                  output: o,
                  excludeOutputs: d.map(
                    (g) => g.output
                  ),
                  excludeText: typeof c == "string" ? c : ""
                }
              )
            ] }),
            I ? /* @__PURE__ */ m("div", { role: "alert", className: "mt-3 text-sm text-destructive", children: I }) : null,
            _ ? /* @__PURE__ */ m(
              cu,
              {
                interaction: _,
                response: v,
                disabled: t.sendDisabled,
                onSubmit: (g) => {
                  t.send(
                    lu(
                      _.id || "",
                      g.text,
                      g.data
                    )
                  );
                }
              }
            ) : null,
            /* @__PURE__ */ m(
              uu,
              {
                suggestions: C,
                disabled: t.sendDisabled,
                onSelect: (g) => {
                  t.send(qo(g.prompt));
                }
              }
            ),
            /* @__PURE__ */ m(
              Sl,
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
function Sl({
  role: t,
  sessionTitle: e,
  renderMessageActions: s
}) {
  const n = D((T) => T.message.status), r = Number(
    D((T) => T.message.metadata.custom?.recordID) || 0
  ), i = String(
    D((T) => T.message.metadata.custom?.requestID) || ""
  ), o = String(
    D((T) => T.message.metadata.custom?.createdAt) || ""
  ), a = D(
    (T) => T.message.metadata.custom?.sourceText
  ), c = D(
    (T) => T.message.metadata.custom?.document
  ), l = D((T) => T.message.metadata.custom?.output), u = D(
    (T) => T.message.parts.filter((E) => E.type === "text").map((E) => E.text).join(`
`)
  ), f = c?.hydrated ? Bu(c) : typeof a == "string" && a.trim() ? Yo(c, a) : u, [h, d] = G(!1), [p, _] = G(!1), v = ne(null);
  le(
    () => () => {
      v.current != null && window.clearTimeout(v.current);
    },
    []
  );
  const C = () => {
    v.current != null && window.clearTimeout(v.current), v.current = window.setTimeout(() => {
      d(!1), _(!1), v.current = null;
    }, 1800);
  }, b = async () => {
    if (f.trim()) {
      _(!1);
      try {
        await yu(f), d(!0);
      } catch {
        d(!1), _(!0);
      }
      C();
    }
  }, S = !f.trim() || t === "assistant" && n?.type === "running", I = Wo(l).some(
    (T) => T.status === "generating"
  ) || !!(c && Ms(c));
  return /* @__PURE__ */ N(
    c_.Root,
    {
      className: ai(
        "agent-chat-message-actions",
        t === "user" && "justify-end"
      ),
      "data-message-role": t,
      children: [
        /* @__PURE__ */ m(
          Ho,
          {
            label: p ? "复制失败，请手动选择消息文本" : h ? "已复制" : "复制",
            children: /* @__PURE__ */ N(
              "button",
              {
                type: "button",
                className: "agent-chat-message-action agent-chat-copy-action",
                "aria-label": h ? "消息已复制" : "复制消息",
                "data-copied": h ? "true" : void 0,
                "data-copy-failed": p ? "true" : void 0,
                disabled: S,
                onClick: () => {
                  b();
                },
                children: [
                  /* @__PURE__ */ m(ql, { className: "agent-chat-copy-icon", "aria-hidden": "true" }),
                  /* @__PURE__ */ m(jo, { className: "agent-chat-copied-icon", "aria-hidden": "true" })
                ]
              }
            )
          }
        ),
        s?.({
          role: t,
          recordID: r,
          requestID: i,
          sessionTitle: e,
          createdAt: o,
          running: n?.type === "running",
          error: n?.type === "incomplete",
          hasPendingArtifacts: I,
          document: c
        })
      ]
    }
  );
}
function Ey({
  controller: t,
  clipboardImageUploadRuleId: e,
  uploadBizKey: s,
  uploadBizName: n,
  allowResourceLibrary: r,
  disabled: i,
  toolbar: o,
  parameters: a,
  parameterScopeKey: c,
  renderFileLibrary: l,
  onUploadedFiles: u,
  referenceProviders: f
}) {
  return /* @__PURE__ */ m(
    yy,
    {
      placeholder: "请输入消息，输入 @ 引用资产，输入 # 引用会话信息",
      disabled: i || t.sendDisabled && !t.running,
      running: t.running,
      stopping: t.stopping,
      cancelable: t.cancelable,
      layerZIndex: Cs,
      clipboardImageUploadRuleId: e,
      uploadBizKey: s,
      uploadBizName: n,
      allowResourceLibrary: r,
      renderFileLibrary: l,
      fileLibraryIncludesUpload: !0,
      referenceActionPlacements: Sy,
      toolbar: o,
      parameterScopeKey: c,
      onUploadedFiles: u,
      parameters: a ?? t.inputParams,
      providers: f,
      showMediaAliases: !0,
      allowMultiMediaSelection: !0,
      loadReferences: t.loadReferences,
      loadPreview: t.loadReferencePreview,
      onSubmit: t.send,
      onCancel: t.stop
    }
  );
}
function Ay(t, e) {
  return (s) => {
    const n = t.find(
      (r) => r.referenceTypes.includes(s.refType)
    );
    return n?.loadPreview ? n.loadPreview(s) : e(s);
  };
}
function Ry() {
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
function Do() {
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
function My(t, e, s) {
  if (!t)
    return !1;
  const n = e.at(-1);
  return !n || n.kind !== "knowledge" && n.kind !== "skill" || n.status === "running" ? !1 : String(s || "").trimEnd() === n.anchorText.trimEnd();
}
const ky = `
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
const ft = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dropdown-menu");
if (!ft || Object.keys(ft).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const Dy = ft.DropdownMenu, Py = ft.DropdownMenuContent, Oy = ft.DropdownMenuItem, Ny = ft.DropdownMenuSeparator, $y = ft.DropdownMenuTrigger, mt = window.DeverFront?.sdk?.getCompatModule("@/components/ui/select");
if (!mt || Object.keys(mt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/select");
const By = mt.Select, Fy = mt.SelectContent, Ly = mt.SelectItem, Vy = mt.SelectTrigger, jy = mt.SelectValue, _r = window.DeverFront?.sdk?.getCompatModule("@/lib/floating-layer");
if (!_r || Object.keys(_r).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/floating-layer");
const xl = _r.findFloatingLayerContainer;
function qy({
  value: t,
  powers: e,
  categories: s,
  onValueChange: n
}) {
  const r = ne(null), [i, o] = G(
    null
  ), [a, c] = G(!1), l = e.find(
    (h) => typeof t == "number" && h.id === t
  ), u = t === "auto" ? "自动选择" : l?.name || "选择", f = t === "auto" ? "自动" : u;
  return /* @__PURE__ */ N(
    Dy,
    {
      modal: !1,
      open: a,
      onOpenChange: (h) => {
        h && o(xl(r.current)), c(h);
      },
      children: [
        /* @__PURE__ */ m($y, { asChild: !0, children: /* @__PURE__ */ N(
          "button",
          {
            ref: r,
            type: "button",
            className: "agent-chat-execution-trigger",
            "aria-label": `选择工具，当前${u}`,
            title: u,
            children: [
              /* @__PURE__ */ N("span", { className: "agent-chat-execution-trigger-content", children: [
                t === "auto" ? /* @__PURE__ */ m(li, { "aria-hidden": "true" }) : l ? /* @__PURE__ */ m(Fu, { power: l, size: 15 }) : null,
                /* @__PURE__ */ m("span", { children: f })
              ] }),
              /* @__PURE__ */ m(Vo, { className: "agent-chat-execution-chevron" })
            ]
          }
        ) }),
        /* @__PURE__ */ N(
          Py,
          {
            align: "start",
            container: i,
            className: "agent-chat-execution-menu",
            children: [
              /* @__PURE__ */ N(
                Oy,
                {
                  className: `agent-chat-execution-menu-item agent-chat-execution-power-item${t === "auto" ? " is-selected" : ""}`,
                  onSelect: () => n("auto"),
                  children: [
                    /* @__PURE__ */ m(li, { "aria-hidden": "true" }),
                    /* @__PURE__ */ m("span", { className: "min-w-0 flex-1 truncate", children: "自动选择" }),
                    t === "auto" ? /* @__PURE__ */ m(jo, { "aria-hidden": "true" }) : null
                  ]
                }
              ),
              e.length > 0 ? /* @__PURE__ */ m(Ny, {}) : null,
              /* @__PURE__ */ m(
                Lu,
                {
                  open: a,
                  value: typeof t == "number" ? t : null,
                  powers: e,
                  categories: s,
                  appearance: "agent",
                  portalContainer: i,
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
function Po({
  value: t,
  options: e,
  ariaLabel: s,
  onValueChange: n
}) {
  const r = ne(null), [i, o] = G(
    null
  ), c = e.find((u) => u.id === t)?.name || "未命名模型";
  return (e.length === 1 && e[0]?.id === t ? e[0] : null) ? /* @__PURE__ */ m(
    "span",
    {
      className: "agent-chat-execution-trigger agent-chat-execution-source-trigger agent-chat-execution-source-static",
      "aria-label": `${s}：${c}`,
      title: c,
      children: /* @__PURE__ */ m("span", { children: c })
    }
  ) : /* @__PURE__ */ N(
    By,
    {
      value: String(t),
      onValueChange: (u) => n(Number(u)),
      onOpenChange: (u) => {
        u && o(xl(r.current));
      },
      children: [
        /* @__PURE__ */ m(
          Vy,
          {
            ref: r,
            "aria-label": s,
            title: c,
            className: "agent-chat-execution-trigger agent-chat-execution-source-trigger",
            children: /* @__PURE__ */ m(jy, {})
          }
        ),
        /* @__PURE__ */ m(
          Fy,
          {
            align: "start",
            container: i,
            className: "agent-chat-execution-menu",
            children: e.map((u) => /* @__PURE__ */ m(
              Ly,
              {
                className: "agent-chat-execution-menu-item",
                value: String(u.id),
                children: u.name
              },
              u.id
            ))
          }
        )
      ]
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/agent/stream-request-params"]);
const vr = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!vr || Object.keys(vr).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const Uy = vr.isPromptParam;
function Hy({
  enabled: t,
  scopeKey: e,
  toolIDField: s,
  loadConfig: n,
  loadToolForm: r,
  renderFileLibrary: i
}) {
  const [o, a] = G(null), [c, l] = G(""), [u, f] = G(0), [h, d] = G(t), [p, _] = G(""), [v, C] = G(0), [b, S] = G("auto"), [I, T] = G(0), [E, g] = G(null), [w, A] = G(!1), [P, W] = G(""), [X, q] = G(0), [U, he] = G({
    scopeKey: "",
    sessionID: 0,
    messageIdentity: ""
  }), de = ne(""), Z = ne(null), H = ne(null), ee = c === e ? o : null, L = !!ee?.toolsEnabled, y = L && typeof b == "number" && E?.toolID === b ? E.config : null, M = Oo(
    ee?.modelSourceRule,
    v
  ), k = L && typeof b == "number" && Oo(y?.sourceRule, I);
  le(() => {
    let z = !0;
    return a(null), l(""), d(t), _(""), g(null), W(""), S("auto"), T(0), Z.current = null, H.current = null, de.current = "", t ? (n().then((J) => {
      z && (a(J), l(e), C(J.selectedModelTargetID));
    }).catch((J) => {
      z && _(No(J, "加载对话配置失败"));
    }).finally(() => {
      z && d(!1);
    }), () => {
      z = !1;
    }) : () => {
      z = !1;
    };
  }, [u, t, n, e]), le(() => {
    if (!t || !ee || U.scopeKey !== e)
      return;
    const z = `${e}:${U.sessionID}:${U.messageIdentity || "empty"}`;
    if (de.current === z) return;
    const J = Z.current;
    if (!U.messageIdentity && J && J.scopeKey === e && (J.sessionID === 0 || J.sessionID === U.sessionID))
      return;
    J && (Z.current = null), de.current = z;
    const te = U.execution;
    H.current = te ? { ...te } : null, C(Yy(ee, te));
    const we = Qy(
      ee,
      te,
      s
    );
    S(we.selection), T(we.targetID), g(null), W("");
  }, [
    ee,
    U.execution,
    U.messageIdentity,
    U.scopeKey,
    U.sessionID,
    t,
    e,
    s
  ]);
  const F = B(
    (z) => {
      if (!t) return;
      const J = Gy(
        z.messages,
        s
      ), te = {
        scopeKey: e,
        sessionID: z.sessionID,
        messageIdentity: J?.messageIdentity || "",
        execution: J?.execution
      };
      he(
        (we) => we.scopeKey === te.scopeKey && we.sessionID === te.sessionID && we.messageIdentity === te.messageIdentity ? we : te
      );
    },
    [t, e, s]
  );
  le(() => {
    if (!t || !L || typeof b != "number") {
      g(null), A(!1), W("");
      return;
    }
    if (E?.toolID === b && Number(E.config.selectedSourceID) === I)
      return;
    let z = !0;
    return A(!0), W(""), (async () => {
      try {
        return await r(b, I);
      } catch (te) {
        if (!I) throw te;
        return r(b, 0);
      }
    })().then((te) => {
      z && (g({ toolID: b, config: te }), T(Number(te.selectedSourceID || 0)));
    }).catch((te) => {
      z && (g(null), W(No(te, "加载工具参数失败")));
    }).finally(() => {
      z && A(!1);
    }), () => {
      z = !1;
    };
  }, [
    t,
    r,
    E,
    X,
    b,
    I,
    L
  ]);
  const j = Ge(() => {
    if (!(!t || !L || typeof b != "number"))
      return y ? Jy(
        y.params.filter((z) => !Uy(z)),
        U.execution,
        b,
        s,
        I
      ) : [];
  }, [
    y,
    U.execution,
    t,
    s,
    b,
    I,
    L
  ]), Q = B(
    (z) => {
      z !== b && (S(z), T(0), g(null), W(""), q((J) => J + 1));
    },
    [b]
  ), ie = B(
    (z) => {
      z !== I && (T(z), W(""), q((J) => J + 1));
    },
    [I]
  ), be = B(() => {
    if (p) {
      f((z) => z + 1);
      return;
    }
    g(null), W(""), q((z) => z + 1);
  }, [p]), Oe = B(
    (z) => {
      if (!t) return z;
      const J = { ...z.content };
      if (Mt(J.interaction_response)) {
        const we = H.current ? { ...H.current } : null;
        return we ? J.execution = we : delete J.execution, delete J.params, Z.current = {
          scopeKey: e,
          sessionID: U.sessionID
        }, { ...z, content: J, params: void 0 };
      }
      if (M)
        throw new Error("当前对话没有可用模型");
      const te = {
        model_target_id: v,
        tool_mode: L ? Ky(b) : "none"
      };
      if (L && typeof b == "number") {
        if (!y || w || P)
          throw new Error(P || "工具参数尚未加载完成");
        if (te[s] = b, k)
          throw new Error("当前工具没有可用模型");
        te.tool_target_id = I, te.tool_params = { ...z.params || {} }, delete J.params;
      }
      return J.execution = te, Z.current = {
        scopeKey: e,
        sessionID: U.sessionID
      }, H.current = te, L && typeof b == "number" ? { ...z, content: J, params: void 0 } : { ...z, content: J };
    },
    [
      y,
      U.sessionID,
      t,
      M,
      k,
      v,
      e,
      P,
      w,
      s,
      b,
      I,
      L
    ]
  ), ye = U.scopeKey === e ? `${e}:session:${U.sessionID}` : `${e}:session:pending`, Ce = h || !!p || !!ee?.readiness?.warnings.length || L || yr(
    ee?.modelSourceRule,
    ee?.modelSources
  );
  return {
    disabled: t && (h || !!p || !ee || M || L && typeof b == "number" && (w || !!P || !y || k)),
    toolbar: t && Ce ? /* @__PURE__ */ m(
      zy,
      {
        config: ee,
        configLoading: h,
        configError: p,
        modelTargetID: v,
        toolSelection: b,
        toolTargetID: I,
        toolForm: y,
        toolFormLoading: w,
        toolFormError: P,
        onModelChange: C,
        onToolChange: Q,
        onToolTargetChange: ie,
        onRetry: be
      }
    ) : null,
    parameters: j,
    // Parameter controls belong to the unsent conversation draft. Switching
    // tools or model sources must not discard values already entered there.
    parameterScopeKey: ye,
    prepareInput: Oe,
    renderFileLibrary: i,
    onConversationStateChange: F
  };
}
function zy({
  config: t,
  configLoading: e,
  configError: s,
  modelTargetID: n,
  toolSelection: r,
  toolTargetID: i,
  toolForm: o,
  toolFormLoading: a,
  toolFormError: c,
  onModelChange: l,
  onToolChange: u,
  onToolTargetChange: f,
  onRetry: h
}) {
  const d = Ge(
    () => (o?.sources || []).map((I) => ({
      id: Number(I.id),
      name: vu(
        I.service_name,
        I.name,
        "未命名模型"
      )
    })).filter((I) => I.id > 0),
    [o?.sources]
  ), p = !!t?.toolsEnabled, _ = s || (p ? c : ""), v = t?.readiness?.warnings || [], C = (!p || typeof r != "number") && yr(t?.modelSourceRule, t?.modelSources), b = p && typeof r == "number" && yr(o?.sourceRule, d);
  return /* @__PURE__ */ N("div", { className: "agent-chat-execution-controls", children: [
    p || C || b ? /* @__PURE__ */ N("div", { className: "agent-chat-execution-choice-group", children: [
      p ? /* @__PURE__ */ m("div", { className: "agent-chat-execution-picker is-tool", children: /* @__PURE__ */ m(
        qy,
        {
          value: r,
          powers: t?.tools || [],
          categories: t?.categories || [],
          onValueChange: u
        }
      ) }) : null,
      C ? /* @__PURE__ */ m("div", { className: "agent-chat-execution-picker is-model", children: /* @__PURE__ */ m(
        Po,
        {
          value: n,
          options: t?.modelSources || [],
          ariaLabel: "选择智能体模型",
          onValueChange: l
        }
      ) }) : null,
      b ? /* @__PURE__ */ m("div", { className: "agent-chat-execution-picker is-model", children: /* @__PURE__ */ m(
        Po,
        {
          value: i,
          options: d,
          ariaLabel: "选择工具模型",
          onValueChange: f
        }
      ) }) : null
    ] }) : null,
    e || p && a ? /* @__PURE__ */ m(
      Ut,
      {
        className: "agent-chat-execution-loading animate-spin",
        "aria-label": "正在加载执行配置"
      }
    ) : null,
    _ ? /* @__PURE__ */ m("span", { className: "agent-chat-execution-error", title: _, children: _ }) : null,
    !_ && v.length > 0 ? /* @__PURE__ */ N(
      "span",
      {
        className: "agent-chat-execution-warning",
        title: v.join(`
`),
        children: [
          /* @__PURE__ */ m(Ul, { "aria-hidden": "true" }),
          /* @__PURE__ */ N("span", { children: [
            v[0],
            v.length > 1 ? `（另有 ${v.length - 1} 项）` : ""
          ] })
        ]
      }
    ) : null,
    _ ? /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: "agent-chat-execution-retry",
        "aria-label": "重新加载执行配置",
        title: "重新加载",
        onClick: h,
        children: /* @__PURE__ */ m(Hl, {})
      }
    ) : null
  ] });
}
function Gy(t, e) {
  for (let s = t.length - 1; s >= 0; s -= 1) {
    const n = t[s];
    if (n.role !== "user") continue;
    const r = Mt(n.content?.execution) ? n.content.execution : void 0, i = r && n.content?.interaction_response ? Wy(
      t,
      s,
      r,
      e
    ) : r;
    return {
      messageIdentity: String(n.recordID || n.id),
      execution: i
    };
  }
  return null;
}
function Wy(t, e, s, n) {
  if (String(s.tool_mode || "").trim() !== "specific" || Mt(s.tool_params))
    return s;
  const r = Number(s[n] || 0), i = Number(s.tool_target_id || 0);
  if (!r) return s;
  for (let o = e - 1; o >= 0; o -= 1) {
    const a = t[o];
    if (a.role !== "user") continue;
    const c = a.content?.execution;
    if (!(!Mt(c) || String(c.tool_mode || "").trim() !== "specific" || Number(c[n] || 0) !== r || Number(c.tool_target_id || 0) !== i || !Mt(c.tool_params)))
      return { ...s, tool_params: c.tool_params };
  }
  return s;
}
function Yy(t, e) {
  if (!Tr(t.modelSourceRule)) return 0;
  const s = Number(e?.model_target_id || 0);
  return t.modelSources.some((n) => n.id === s) ? s : t.selectedModelTargetID;
}
function Qy(t, e, s) {
  if (t.toolsEnabled === !1)
    return { selection: "auto", targetID: 0 };
  if (String(e?.tool_mode || "auto").trim() === "specific") {
    const r = Number(e?.[s] || 0);
    if (t.tools.some((i) => i.id === r))
      return {
        selection: r,
        targetID: Number(e?.tool_target_id || 0)
      };
  }
  return { selection: "auto", targetID: 0 };
}
function Jy(t, e, s, n, r) {
  if (String(e?.tool_mode || "").trim() !== "specific" || Number(e?.[n] || 0) !== s)
    return t;
  const i = Number(e?.tool_target_id || 0);
  if (i > 0 && r > 0 && i !== r)
    return t;
  const o = e?.tool_params;
  if (!Mt(o)) return t;
  let a = !1;
  const c = t.map((l) => {
    const u = String(l.key || "").trim();
    return !u || !Object.prototype.hasOwnProperty.call(o, u) ? l : (a = !0, {
      ...l,
      default_value: Xy(o[u])
    });
  });
  return a ? c : t;
}
function Xy(t) {
  if (t == null) return "";
  if (typeof t == "string") return t;
  if (typeof t != "object") return String(t);
  try {
    return JSON.stringify(t);
  } catch {
    return "";
  }
}
function Ky(t) {
  return typeof t == "number" ? "specific" : "auto";
}
function Oo(t, e) {
  return Tr(t) && e <= 0;
}
function yr(t, e) {
  return Tr(t) && (e?.length || 0) > 0;
}
function Mt(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function No(t, e) {
  return t instanceof Error && t.message ? t.message : e;
}
function Zy({
  agentKey: t,
  configApi: e,
  toolFormApi: s
}) {
  const n = !!(t && e && s), r = B(
    () => du(e, t),
    [t, e]
  ), i = B(
    (o, a) => hu(s, {
      agentKey: t,
      powerID: o,
      sourceTargetID: a
    }),
    [t, s]
  );
  return Hy({
    enabled: n,
    scopeKey: `admin-agent-runtime:${t}`,
    toolIDField: "power_id",
    loadConfig: r,
    loadToolForm: i
  });
}
await window.DeverFront?.ensureCompat?.(["@/lib/store", "@/lib/stream", "@/lib/utils", "@/components/ui/button", "@/components/ui/dialog"]);
const wr = window.DeverFront?.sdk?.getCompatModule("@/lib/store");
if (!wr || Object.keys(wr).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/store");
const xs = wr.getStoreValueByPath, Sr = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!Sr || Object.keys(Sr).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const Rn = Sr.streamValueText, xr = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!xr || Object.keys(xr).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const Is = xr.cn, Ir = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!Ir || Object.keys(Ir).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const Ts = Ir.Button, pt = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!pt || Object.keys(pt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const ew = pt.Dialog, tw = pt.DialogContent, sw = pt.DialogDescription, nw = pt.DialogHeader, rw = pt.DialogTitle;
function gw({ item: t, store: e }) {
  const s = ls(
    e,
    () => Rn(xs(e, String(t.meta?.agentPath || "")))
  ), n = ls(
    e,
    () => Rn(
      xs(e, String(t.meta?.agentNamePath || ""))
    )
  ), r = String(t.meta?.openPath || ""), i = ls(
    e,
    () => r ? !!xs(e, r) : !0
  ), o = String(t.meta?.openingEnabledPath || ""), a = ls(
    e,
    () => o ? !!xs(e, o) : !!t.meta?.proactiveOpening
  ), c = String(t.meta?.executionConfigApi || ""), l = String(t.meta?.toolFormApi || ""), u = Zy({
    agentKey: s,
    configApi: c,
    toolFormApi: l
  }), f = Ge(
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
  ), h = Ge(
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
  ), d = B(() => {
    r && e.getState().setValueByPath(r, !1);
  }, [r, e]);
  return /* @__PURE__ */ m(
    iw,
    {
      agentKey: s,
      agentName: n,
      open: i,
      fullScreen: !!r,
      height: Rn(t.meta?.height || t.meta?.containerHeight) || "min(78dvh, 720px)",
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
      assistantApi: f,
      runtimeApi: h,
      onClose: d
    }
  );
}
function iw({
  agentKey: t,
  agentName: e = "",
  contextKey: s,
  open: n = !0,
  height: r = "min(78dvh, 720px)",
  minHeight: i = "min(420px, 78dvh)",
  fullScreen: o = !1,
  lazySession: a = !1,
  proactiveOpening: c = !1,
  mobileSessionNavigation: l = !1,
  navigationMode: u = "sidebar",
  appearance: f = "default",
  expanded: h = !1,
  sidebarTitle: d,
  clipboardImageUploadRuleId: p = 0,
  uploadBizKey: _,
  uploadBizName: v,
  allowResourceLibrary: C = !0,
  composerDisabled: b = !1,
  composerToolbar: S,
  composerParameters: I,
  composerParameterScopeKey: T,
  renderFileLibrary: E,
  prepareInput: g,
  onConversationStateChange: w,
  onUploadedFiles: A,
  blockMs: P = 1e3,
  assistantApi: W,
  runtimeApi: X,
  requestScope: q,
  referenceProviders: U,
  renderMessageActions: he,
  renderArtifactActions: de,
  renderDocumentActions: Z,
  onToggleExpanded: H,
  onClose: ee
}) {
  const L = dy({
    agentKey: t,
    contextKey: s,
    modalOpen: n,
    blockMs: P,
    lazySession: a,
    proactiveOpening: c,
    assistantApi: W,
    runtimeApi: X,
    requestScope: q,
    prepareInput: g
  }), y = fu(), M = y.open && y.request?.kind !== "audio" && y.request?.kind !== "file", [k, F] = G("chat"), j = ne(null), [Q, ie] = G(0), [be, Oe] = G(!1), ye = u === "internal", Ce = ye || l, z = ne(/* @__PURE__ */ new Set()), J = Ge(
    () => L.messages.find(
      (_e) => _e.document?.id === Q
    ),
    [Q, L.messages]
  ), te = J?.document, we = !!(be && te && !M);
  le(() => {
    y.closePreview();
  }, [t, L.sessionID, y.closePreview, n]), le(() => {
    w?.({
      sessionID: L.sessionID,
      messages: L.messages
    });
  }, [L.messages, L.sessionID, w]), le(() => {
    F("chat");
  }, [t, s, Ce]), le(() => {
    ie(0), Oe(!1);
  }, [t, s, L.sessionID]), le(() => {
    z.current.clear();
  }, [t, s]), le(() => {
    const wt = [...L.messages].reverse().find((Nt) => Nt.autoOpenDocument && Nt.document)?.document?.id || 0, je = `${L.sessionID}:${wt}`;
    !wt || z.current.has(je) || (z.current.add(je), ie(wt), Oe(!0));
  }, [L.messages, L.sessionID]);
  const on = B((_e) => {
    ie(_e.id), Oe(!0);
  }, []), an = B(
    async (_e) => {
      await L.openSession(_e), F("chat");
    },
    [L.openSession]
  ), se = B(async () => {
    await L.startNewSession(), F("chat");
  }, [L.startNewSession]);
  if (!n)
    return null;
  const cs = /* @__PURE__ */ m(gu, { controller: y, children: /* @__PURE__ */ N(
    "div",
    {
      ref: j,
      "data-agent-chat-layer": "true",
      "data-agent-chat-appearance": f,
      "data-agent-chat-navigation": u,
      "data-media-inspector-open": M ? "true" : void 0,
      className: Is(
        "relative flex min-h-0 w-full flex-col overflow-hidden bg-background md:flex-row",
        o ? "h-full flex-1" : f === "canvas" ? "" : "border-y"
      ),
      style: o ? void 0 : { height: r, minHeight: i },
      children: [
        ye ? null : /* @__PURE__ */ m(
          wo,
          {
            agentName: e,
            title: d,
            agentReady: !!t,
            controller: L,
            collapsed: M
          }
        ),
        Ce && k === "sessions" ? /* @__PURE__ */ m(
          wo,
          {
            mobile: !ye,
            embedded: ye,
            agentName: e,
            title: d,
            agentReady: !!t,
            controller: L,
            onOpenSession: an,
            onStartNewSession: se,
            onBack: () => F("chat")
          }
        ) : null,
        /* @__PURE__ */ N(
          "section",
          {
            className: Is(
              "min-h-0 min-w-0 flex-1 flex-col bg-background",
              Ce && k === "sessions" ? ye ? "hidden" : "hidden md:flex" : "flex",
              M && "md:w-[38vw] md:min-w-[360px] md:max-w-[640px] md:flex-none"
            ),
            children: [
              /* @__PURE__ */ N("header", { className: "agent-chat-header flex h-12 shrink-0 items-center gap-2 px-3 md:h-14 md:px-6", children: [
                Ce ? /* @__PURE__ */ N(
                  Ts,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: Is(
                      "size-10 shrink-0",
                      !ye && "md:hidden"
                    ),
                    title: "历史会话",
                    onClick: () => F("sessions"),
                    children: [
                      ye ? /* @__PURE__ */ m(zl, { className: "size-4" }) : /* @__PURE__ */ m(Fo, { className: "size-4" }),
                      /* @__PURE__ */ m("span", { className: "sr-only", children: "历史会话" })
                    ]
                  }
                ) : null,
                /* @__PURE__ */ N("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ m("div", { className: "truncate text-sm font-semibold text-foreground", children: ye ? e || "画布助手" : L.sessionTitle || "新会话" }),
                  ye ? /* @__PURE__ */ m("div", { className: "truncate text-[11px] leading-4 text-muted-foreground", children: L.sessionTitle || "新会话" }) : null
                ] }),
                /* @__PURE__ */ N(
                  Ts,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: Is(
                      "size-10 shrink-0",
                      !ye && "md:hidden"
                    ),
                    title: "新对话",
                    disabled: L.sessionLoading || !t,
                    onClick: () => {
                      se();
                    },
                    children: [
                      /* @__PURE__ */ m(Lo, { className: "size-4" }),
                      /* @__PURE__ */ m("span", { className: "sr-only", children: "新对话" })
                    ]
                  }
                ),
                H && !y.open ? /* @__PURE__ */ N(
                  Ts,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: "size-10 shrink-0 md:size-8",
                    title: h ? "退出全屏" : "展开对话",
                    onClick: H,
                    children: [
                      h ? /* @__PURE__ */ m(Gl, { className: "size-4" }) : /* @__PURE__ */ m(Wl, { className: "size-4" }),
                      /* @__PURE__ */ m("span", { className: "sr-only", children: h ? "退出全屏" : "展开对话" })
                    ]
                  }
                ) : null,
                (o || f === "canvas") && ee && !y.open ? /* @__PURE__ */ N(
                  Ts,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: "size-10 shrink-0 md:size-8",
                    title: "关闭对话",
                    onClick: ee,
                    children: [
                      /* @__PURE__ */ m(Yl, { className: "size-4" }),
                      /* @__PURE__ */ m("span", { className: "sr-only", children: "关闭对话" })
                    ]
                  }
                ) : null
              ] }),
              /* @__PURE__ */ m(
                Ov,
                {
                  controller: L,
                  children: /* @__PURE__ */ m(
                    xy,
                    {
                      controller: L,
                      clipboardImageUploadRuleId: p,
                      uploadBizKey: _,
                      uploadBizName: v,
                      allowResourceLibrary: C,
                      composerDisabled: b,
                      composerToolbar: S,
                      composerParameters: I,
                      composerParameterScopeKey: T,
                      renderFileLibrary: E,
                      onUploadedFiles: A,
                      referenceProviders: U,
                      renderMessageActions: he,
                      renderArtifactActions: de,
                      onOpenDocument: on
                    }
                  )
                },
                `${t}:${s || "default"}:${L.sessionID || "draft"}`
              )
            ]
          }
        ),
        te ? /* @__PURE__ */ m(
          mu,
          {
            open: we,
            portalContainer: j.current,
            document: te,
            messageID: J?.recordID || 0,
            renderArtifactActions: de,
            renderDocumentActions: Z,
            onClose: () => Oe(!1)
          }
        ) : null,
        /* @__PURE__ */ m(
          pu,
          {
            controller: y,
            renderArtifactActions: de
          }
        )
      ]
    }
  ) });
  return o ? /* @__PURE__ */ m(
    ew,
    {
      open: n,
      onOpenChange: (_e) => {
        _e || ee?.();
      },
      children: /* @__PURE__ */ N(
        tw,
        {
          layerClassName: Su,
          layerZIndex: wu,
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
            /* @__PURE__ */ N(nw, { className: "sr-only", children: [
              /* @__PURE__ */ m(rw, { children: "运行智能体" }),
              /* @__PURE__ */ m(sw, { children: e || t || "智能体对话" })
            ] }),
            cs
          ]
        }
      )
    }
  ) : cs;
}
export {
  iw as A,
  gw as S,
  Hy as u
};
