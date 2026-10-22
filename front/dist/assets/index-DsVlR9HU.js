import { j as m, a as N, F as Ne, f as cl, u as ss } from "./react-D9GkiX5b.js";
import { R as Yt, u as ze, b as ne, x as ll, h as B, w as ul, f as bi, C as zr, y as pn, z as ws, F as dl, v as hl, d as ce, a as G } from "./file-kind-D6bMOzYN.js";
import { q as fl, h as ml, o as pl, A as _i, P as vi, r as Ft, aX as gl, p as bl, c as yi, ag as _l, at as vl, w as yl, n as wi, ab as Gr, aY as wl, R as Sl, ah as xl, aZ as Il, Q as Tl, X as Cl } from "./vendor-icons-fVDtJt66.js";
import { t as Si, f as El, h as xi, g as Rl, l as Al, i as Ml, j as Dl, k as kl, m as Pt, n as Wr, r as Pl, o as Ol, p as Nl, q as $l, s as Js, c as Bl, A as Fl, a as Ll, u as Vl, v as ql, d as jl, w as Ul, x as Hl, y as zl, e as Gl, z as Wl, B as Yl } from "./interaction-view-CnMylwnc.js";
import { f as Ql, c as Jl, i as lr, r as Xl } from "./preloadable-CT3tMmBD.js";
import { A as Ii, a as _s, c as Zl, b as Kl, d as eu } from "./clipboard-DzB3zYOw.js";
import { e as Ti, f as tu, m as su, l as nu, o as ks, p as ru, q as Ci, s as ou, t as iu, u as Yr, n as au, v as cu, i as Ss, r as Ei, a as lu, w as uu, x as du, y as hu, z as fu, c as Ri, d as mu, k as pu } from "./runtime-DQ2rFFvP.js";
import { P as gu } from "./power-icon-DJNs4aGY.js";
import { P as bu } from "./power-picker-menu-g8EfyBFB.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./index-iPUNjXsT.css", import.meta.url).href]);
let wt = null;
function _u(t, e) {
  t.currentIndex = 0, t.wipContextDeps = null, t.wipCommitCallbacks = [];
  const s = wt;
  wt = t;
  try {
    if (e(), t.isFirstRender = !1, t.cells.length !== t.currentIndex) throw new Error(`Rendered ${t.currentIndex} hooks but expected ${t.cells.length}. Hooks must be called in the exact same order in every render.`);
  } finally {
    wt = s;
  }
}
function Ee() {
  if (!wt) throw new Error("No resource fiber available");
  return wt;
}
function $e() {
  return wt;
}
const vu = (t) => ({
  version: 0,
  committedVersion: 0,
  dispatchUpdate: t,
  changelog: [],
  committedLog: [],
  unsettledCount: 0,
  rollbackCallbacks: []
}), Ai = (t) => {
  t.committedVersion = t.version;
  for (const e of t.changelog)
    e.logged = !1, e.settled || (e.settled = !0, t.unsettledCount--), t.committedLog.push(e);
  t.changelog.length = 0, t.unsettledCount === 0 && (t.committedLog.length = 0), t.rollbackCallbacks.length = 0;
}, Qr = (t, e) => {
  const s = t.version > e;
  if (t.version = e, s) {
    for (let n = 0; n < t.rollbackCallbacks.length; n++) t.rollbackCallbacks[n]();
    if (t.rollbackCallbacks.length = 0, e <= t.committedVersion) {
      const n = [];
      for (; t.committedVersion - n.length > e; ) {
        const r = t.committedLog.pop();
        if (r === void 0)
          break;
        ur(r.fiber, r.cell), r.cell.workInProgress = r.prevState, n.push({
          record: r,
          prevState: r.prevState,
          eagerState: r.eagerState,
          hasEagerState: r.hasEagerState
        });
      }
      if (n.length > 0) {
        const r = t.committedVersion;
        Ps(t, () => {
          for (let o = n.length - 1; o >= 0; o--) {
            const i = n[o];
            i.record.prevState = i.prevState, i.record.eagerState = i.eagerState, i.record.hasEagerState = i.hasEagerState, t.committedLog.push(i.record);
          }
          t.committedVersion = r;
        });
      }
      t.committedVersion = e;
      for (const r of t.changelog) r.logged = !1;
      t.changelog.length = 0;
    } else {
      for (; t.committedVersion + t.changelog.length > e; ) t.changelog.pop().logged = !1;
      for (let n = 0; n < t.changelog.length; n++) Mi(t.changelog[n]);
      Ai(t);
    }
  }
}, Mi = (t) => {
  ur(t.fiber, t.cell), t.queued || (t.queued = !0, (t.cell.queue ??= []).push(t));
}, Qt = (t, e) => {
  t.wipCommitCallbacks.push(e);
}, Ps = (t, e) => {
  t.rollbackCallbacks.push(e);
}, ur = (t, e) => {
  e.isDirty || (e.isDirty = !0, t.markDirty?.(), Ps(t.root, () => {
    if (e.queue !== null) {
      for (const s of e.queue) s.queued = !1;
      e.queue = null;
    }
    e.workInProgress = e.current, e.isDirty = !1;
  }));
}, Di = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), gn = (t) => new Array(t).fill(Di), yu = (t, e) => {
  const s = t.memoCache;
  let n = s.workInProgress;
  if (n === null) {
    const i = s.current;
    n = i === null ? [] : i.map((a) => a.slice()), s.workInProgress = n, Ps(t.root, () => {
      s.workInProgress = null, s.refreshedIndices = null;
    });
  }
  const r = s.index++;
  let o = n[r];
  return s.refreshedIndices?.has(r) && !t.isRefreshing && (s.refreshedIndices.delete(r), o = s.current?.[r]?.slice() ?? gn(e), n[r] = o), (o === void 0 || t.isRefreshing) && (o = gn(e), n[r] = o, t.isRefreshing && (s.refreshedIndices ??= /* @__PURE__ */ new Set()).add(r)), o;
}, ki = (t) => yu(Ee(), t), wu = Yt, Su = (t) => ze(() => {
  const e = gn(t);
  return e[Di] = !0, e;
}, []), xu = wu.__COMPILER_RUNTIME?.c ?? Su, Iu = () => $e() !== null, S = (t) => Iu() ? ki(t) : xu(t), Jt = () => {
  throw new Error("Rendered more hooks than during the previous render. Hooks must be called in the exact same order in every render.");
}, Xt = () => {
  throw new Error("Hook order changed between renders");
}, Tu = (t) => ({
  type: t,
  setup: void 0,
  setupDeps: void 0,
  cleanup: void 0,
  deps: null,
  generation: 0
});
function Pi(t, e, s) {
  const n = Ee(), r = n.currentIndex++, o = n.cells[r], i = o === void 0 ? Tu(s) : o.type === s ? o : Xt();
  if (o === void 0 && (n.isFirstRender || Jt(), n.cells[r] = i, s === "insertion" ? (n.insertionCells ??= []).push(i) : n.effectCells.push(i)), i.deps !== null && !!e != !!i.deps) throw new Error("useEffect called with and without dependencies across re-renders");
  const a = n.isRefreshing;
  Qt(n, () => {
    i.setup = t, i.setupDeps = e, a && (i.deps = null), i.generation++;
  });
}
function Fe(t, e) {
  Pi(t, e, "effect");
}
function ot(t) {
  const e = Ee(), s = e.currentIndex++, n = e.cells[s];
  if (n === void 0) {
    e.isFirstRender || Jt();
    const r = { current: t };
    return e.cells[s] = {
      type: "ref",
      ref: r
    }, r;
  }
  return n.type !== "ref" ? Xt() : n.ref;
}
const dr = /* @__PURE__ */ Symbol("tap.Context.defaultValue"), Cu = (t) => t;
let yt = /* @__PURE__ */ new Map();
const st = /* @__PURE__ */ new Set(), Oi = (t, e) => {
  t[dr] = e;
}, Ni = (t) => typeof t == "object" && t !== null && dr in t, $i = (t) => typeof t == "object" && t !== null && "$$typeof" in t && t.$$typeof === /* @__PURE__ */ Symbol.for("react.context"), Bi = (t) => Ni(t) || $i(t), Fi = (t) => {
  if (!Ni(t)) {
    if ($i(t)) {
      Oi(t, t._currentValue ?? t._currentValue2);
      return;
    }
    throw new Error("A tap resource's `use()` only accepts a tap context.");
  }
}, Os = (t, e, s) => {
  if (typeof t != "object" || t === null) throw new Error("useContextProvider only accepts a React context.");
  Fi(t);
  const n = t, r = Ee(), o = ot(void 0), i = o.current === void 0 || !Object.is(o.current.value, e);
  Fe(() => {
    o.current = { value: e };
  }, [e]);
  const a = yt.get(n), c = a !== void 0 || yt.has(n);
  yt.set(n, {
    value: e,
    source: r
  });
  try {
    return Eu(n, i, s);
  } finally {
    c ? yt.set(n, a) : yt.delete(n);
  }
}, Eu = (t, e, s) => {
  const n = st.has(t);
  e ? st.add(t) : st.delete(t);
  try {
    return s();
  } finally {
    n ? st.add(t) : st.delete(t);
  }
}, Li = (t) => {
  Fi(t);
  const e = t, s = Ru(e, t), n = Ee();
  return (n.wipContextDeps ??= /* @__PURE__ */ new Map()).set(e, s.source), s.value;
}, Ru = (t, e) => yt.get(t) ?? {
  value: Cu(e)[dr],
  source: null
}, Au = (t, e, s, n) => {
  if (!n) return s;
  let r = s;
  for (const [o, i] of n)
    i === e || i === t || (r ??= /* @__PURE__ */ new Map()).set(o, i);
  return r;
}, Vi = (t, e = t.wipContextDeps) => {
  const s = $e();
  !s || !e || (s.wipContextDeps = Au(s, t, s.wipContextDeps, e));
}, qi = () => st.size > 0, hr = (t) => {
  if (!t.contextDeps || !qi()) return !1;
  for (const e of st.keys()) if (t.contextDeps.has(e)) return !0;
  return !1;
}, Mu = (t, e, s) => {
  if (t.isNeverMounted) throw new Error("Resource updated before mount");
  let n = !1, r = !0;
  t.root.unsettledCount++, t.root.dispatchUpdate(() => (n || (n = !0, s && t.root.changelog.length === 0 && !e.cell.isDirty && !e.hasEagerState && (e.prevState = e.cell.workInProgress, e.eagerState = s(e.cell.workInProgress, e.action), e.hasEagerState = !0, r = !Object.is(e.cell.current, e.eagerState), !r && !e.settled && (e.settled = !0, t.root.unsettledCount--))), r), () => (n = !0, r = !0, Mi(e), e.logged || (e.logged = !0, t.root.changelog.push(e)), !0));
}, Du = (t, e, s, n, r) => {
  const o = n ? n(s) : s, i = {
    type: "reducer",
    workInProgress: o,
    current: o,
    isDirty: !1,
    queue: null,
    renderQueue: null,
    reducer: e,
    dispatch: (a) => {
      const c = $e();
      if (c !== null) {
        if (c !== t) throw new Error("Cannot update a resource while rendering a different resource.");
        (t.renderPendingCells ??= /* @__PURE__ */ new Set()).add(i), (i.renderQueue ??= []).push(a);
      } else {
        const l = {
          fiber: t,
          cell: i,
          action: a,
          hasEagerState: !1,
          eagerState: void 0,
          prevState: i.current,
          settled: !1,
          queued: !1,
          logged: !1
        };
        Mu(t, l, r ? e : void 0);
      }
    }
  };
  return i;
};
function ji(t, e, s, n) {
  const r = Ee(), o = r.currentIndex++, i = r.cells[o], a = (() => {
    if (i !== void 0) return i.type === "reducer" ? i : Xt();
    r.isFirstRender || Jt();
    const l = Du(r, t, e, s, n);
    return r.cells[o] = l, l;
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
    a.renderQueue = null, r.renderPendingCells?.delete(a), Object.is(l, a.workInProgress) || (ur(r, a), a.workInProgress = l);
  }
  return a.isDirty && Qt(r, () => {
    a.current = a.workInProgress, a.isDirty = !1;
  }), [a.workInProgress, a.dispatch];
}
function fr(t, e, s) {
  return ji(t, e, s, !1);
}
const ku = (t, e) => typeof e == "function" ? e(t) : e, Pu = (t) => t === void 0 ? void 0 : typeof t == "function" ? t() : t;
function Ui(t) {
  return ji(ku, t, Pu, !0);
}
const Zt = (t, e) => {
  for (let s = 0; s < t.length && s < e.length; s++) if (!Object.is(t[s], e[s])) return !1;
  return !0;
}, Jr = (t, e) => {
  Qt(t, () => {
    e.current = e.wip, e.currentDeps = e.wipDeps, e.wipIsRefreshing = !1, e.isDirty = !1;
  });
}, mr = (t, e) => {
  const s = Ee(), n = s.currentIndex++;
  let r = s.cells[n];
  if (r === void 0) {
    s.isFirstRender || Jt();
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
  r.type !== "memo" && Xt();
  const o = r;
  if (o.wipIsRefreshing && !s.isRefreshing && (o.wip = o.current, o.wipDeps = o.currentDeps, o.wipIsRefreshing = !1, o.isDirty = !1), !s.isRefreshing && Zt(o.wipDeps, e))
    return o.isDirty && Jr(s, o), o.wip;
  const i = t();
  return o.wip = i, o.wipDeps = e, o.wipIsRefreshing = s.isRefreshing, o.isDirty || (o.isDirty = !0, Ps(s.root, () => {
    o.wip = o.current, o.wipDeps = o.currentDeps, o.wipIsRefreshing = !1, o.isDirty = !1;
  })), Jr(s, o), i;
}, Hi = (t, e) => mr(() => t, e);
function zi(t, e) {
  Pi(t, e, "insertion");
}
function pr(t) {
  const e = Ee(), s = ot(t);
  return s.current !== t && Qt(e, () => {
    s.current = t;
  }), ot(((...n) => s.current(...n))).current;
}
const Ou = (t) => t !== null && typeof t == "object" && typeof t.then == "function", Xr = () => {
}, Nu = (t) => {
  const e = t;
  switch (typeof e.status != "string" ? (e.status = "pending", t.then((s) => {
    e.status === "pending" && (e.status = "fulfilled", e.value = s);
  }, (s) => {
    e.status === "pending" && (e.status = "rejected", e.reason = s);
  })) : e.status !== "fulfilled" && e.status !== "rejected" && t.then(Xr, Xr), e.status) {
    case "fulfilled":
      return e.value;
    case "rejected":
      throw e.reason;
    default:
      throw t;
  }
}, gr = (t) => Ou(t) ? Nu(t) : Li(t), Gi = (t, e, s = e) => {
  const r = Ee().isNeverMounted ? s() : e(), [, o] = fr((c) => c + 1, 0), i = ot(0), a = pr(() => {
    try {
      if (Object.is(r, e()))
        return i.current = 0, !1;
    } catch {
    }
    return !0;
  });
  return Fe(() => t(() => {
    a() && o();
  }), [t]), Fe(() => {
    if (a()) {
      if (++i.current > 50)
        throw i.current = 0, new Error("Maximum update depth exceeded. The result of getSnapshot should be cached to avoid an infinite loop.");
      o();
    }
  }, [
    t,
    r,
    e
  ]), r;
}, Wi = (t, e) => {
};
let $u = 0;
const Bu = () => {
  const t = ot(null);
  return t.current ??= `:tap${$u++}:`, t.current;
}, Yi = (t, e, s) => {
  const n = () => {
    if (!t) return;
    const r = e();
    if (typeof t == "function") {
      const o = t(r);
      return typeof o == "function" ? o : () => t(null);
    }
    return t.current = r, () => {
      t.current = null;
    };
  };
  s == null ? Fe(n) : Fe(n, [...s, t]);
}, Fu = Yt;
function Lu(t) {
  const e = ne(t);
  return ll(() => {
    e.current = t;
  }), B(((...s) => e.current(...s)), []);
}
const Vu = Fu.useEffectEvent ?? Lu, xe = () => $e() !== null, le = Yt, ue = (t) => xe() ? Ui(t) : le.useState(t), qu = (t, e, s) => xe() ? fr(t, e, s) : le.useReducer(t, e, s), ae = (t) => xe() ? ot(t) : le.useRef(t), pe = (t, e) => xe() ? mr(t, e) : le.useMemo(t, e), Bt = (t, e) => xe() ? Hi(t, e) : le.useCallback(t, e), ee = (t, e) => xe() ? Fe(t, e) : le.useEffect(t, e), Ct = (t, e) => xe() ? Fe(t, e) : le.useLayoutEffect(t, e), Qi = (t) => xe() ? pr(t) : Vu(t), Ns = (t, e, s) => xe() ? Gi(t, e, s) : le.useSyncExternalStore(t, e, s), ju = (t, e) => xe() ? Wi() : le.useDebugValue(t, e), $s = (t, e) => xe() ? zi(t, e) : le.useInsertionEffect(t, e), Uu = (t, e, s) => xe() ? Yi(t, e, s) : le.useImperativeHandle(t, e, s), ge = (t) => le.forwardRef(t), ve = (t, e) => le.memo(t, e), Hu = le.Fragment, zu = (...t) => le.createElement(...t), Gu = (...t) => le.cloneElement(...t), Wu = (t) => le.isValidElement(t);
le.Children;
le.Suspense;
const We = (t) => {
  const e = le.createContext(t);
  return Oi(e, t), e;
}, br = (t) => xe() && Bi(t) ? gr(t) : le.use(t), Bs = (t) => xe() && Bi(t) ? gr(t) : le.useContext(t), Kt = (t, e) => {
  if (t.length !== 0) {
    if (t.length === 1) throw t[0];
    for (const s of t) console.error(s);
    throw new AggregateError(t, e);
  }
};
function Yu(t) {
  if (t.length === 0) return;
  let e;
  for (let s = 0; s < t.length; s++) try {
    t[s]();
  } catch (n) {
    (e ??= []).push(n);
  }
  e !== void 0 && Kt(e, "Errors during commit");
}
function Qu(t) {
  const e = t.setup, s = t.setupDeps, n = t.generation;
  let r;
  try {
    const o = e();
    if (o !== void 0 && typeof o != "function") throw new Error(`An effect function must either return a cleanup function or nothing. Received: ${typeof o}`);
    r = o;
  } finally {
    t.generation === n ? (t.cleanup = r, t.deps = s) : r?.();
  }
}
const Ju = (t) => t.setup === void 0 ? !1 : t.deps === null || t.setupDeps === void 0 ? !0 : !Zt(t.deps, t.setupDeps);
function Zr(t, e) {
  let s;
  for (const n of t) Ju(n) && (s ??= []).push(n);
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
    Qu(n);
  } catch (r) {
    (e ??= []).push(r);
  }
  return e;
}
function Xu(t, e = !0) {
  let s;
  t.insertionCells !== null && e && (s = Zr(t.insertionCells, s)), s = Zr(t.effectCells, s), s !== void 0 && Kt(s, "Errors during commit");
}
function Kr(t) {
  let e;
  for (const s of t)
    if (s.deps = null, s.cleanup) try {
      s.cleanup?.();
    } catch (n) {
      (e ??= []).push(n);
    } finally {
      s.cleanup = void 0;
    }
  e !== void 0 && Kt(e, "Errors during cleanup");
}
const Zu = {
  useState: Ui,
  useReducer: fr,
  useRef: ot,
  useMemo: mr,
  useCallback: Hi,
  useEffect: Fe,
  useLayoutEffect: Fe,
  useInsertionEffect: zi,
  useEffectEvent: pr,
  useContext: Li,
  use: gr,
  useSyncExternalStore: Gi,
  useDebugValue: Wi,
  useId: Bu,
  useImperativeHandle: Yi,
  useMemoCache: ki
}, eo = Yt, Ze = eo.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ?? eo.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ns = Ze == null ? null : "H" in Ze ? {
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
function Ku(t) {
  if (!ns) return t();
  const e = ns.current;
  ns.current = Zu;
  try {
    return t();
  } finally {
    ns.current = e;
  }
}
function ed(t, e, s = void 0, n) {
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
function Ji(t) {
  t.wipCommitCallbacks = null, t.wipContextDeps = null, t.memoCache.workInProgress = null, t.memoCache.refreshedIndices = null;
}
function Et(t, e, s) {
  try {
    e ? (t.isReleased = !0, t.insertionCells !== null && Kr(t.insertionCells)) : t.isMounted && (t.isMounted = !1, Kr(t.effectCells));
  } catch (n) {
    (s ??= []).push(n);
  }
  if (t.hostCells !== null) {
    for (const n of t.hostCells)
      if (n.fiber !== null && (s = Et(n.fiber, e, s)), n.fibers !== null) for (const { fiber: r } of n.fibers.values()) s = Et(r, e, s);
  }
  return s;
}
function Xi(t, e = !0) {
  let s;
  e && (s = Et(t, !0, s)), s = Et(t, !1, s), s !== void 0 && Kt(s, "Errors during cleanup");
}
function Zi(t) {
  let e;
  for (const s of t) s.isReleased && (e = Et(s, !0, e));
  for (const s of t) e = Et(s, !1, e);
  e !== void 0 && Kt(e, "Errors during cleanup");
}
function Lt(t, e) {
  if (t.renderPendingCells !== null) {
    for (const o of t.renderPendingCells) o.renderQueue = null;
    t.renderPendingCells.clear();
  }
  let s = 0, n;
  const r = t.isRefreshing;
  t.isRefreshing = r || ($e()?.isRefreshing ?? !1);
  try {
    do {
      if (++s > 25) throw new Error("Too many re-renders. tap limits the number of renders to prevent an infinite loop.");
      t.memoCache.index = 0, _u(t, () => {
        n = Ku(() => t.hook(...e));
      });
    } while ((t.renderPendingCells?.size ?? 0) > 0);
  } catch (o) {
    throw Ji(t), o;
  } finally {
    t.isRefreshing = r;
  }
  return Vi(t), n;
}
function xs(t) {
  const e = t.wipCommitCallbacks;
  t.wipCommitCallbacks = null, t.isMounted = !0, t.isNeverMounted = !1, e !== null && (t.contextDeps = t.wipContextDeps, Ai(t.root), t.memoCache.workInProgress !== null && (t.memoCache.current = t.memoCache.workInProgress, t.memoCache.workInProgress = null, t.memoCache.refreshedIndices = null), Yu(e)), Xu(t, e !== null);
}
const td = () => {
  const t = Ee();
  return t.devStrictMode ? t.isFirstRender ? "child" : "root" : null;
}, sd = () => null, nd = () => sd, rd = () => $e() ? td : nd(), od = (t) => {
  const e = Ee(), s = e.currentIndex++, n = e.cells[s];
  let r;
  if (n === void 0) {
    e.isFirstRender || Jt();
    const o = t instanceof Map;
    r = {
      type: "host",
      fiber: o ? null : t,
      fibers: o ? t : null
    }, e.cells[s] = r, (e.hostCells ??= []).push(r);
  } else
    n.type !== "host" && Xt(), r = n;
  return r.fibers === null && r.fiber !== t && Qt(e, () => {
    r.fiber = t;
  }), r;
}, to = (t, e) => {
  if (!(t instanceof Map)) return e(t);
  for (const { fiber: s } of t.values()) e(s);
}, id = (t) => {
  t.isReleased = !1;
}, ad = (t) => {
  t.isReleased = !0, t.isMounted || queueMicrotask(() => {
    t.isReleased && Xi(t, !0);
  });
}, cd = (t) => {
  $s(() => (to(t, id), () => to(t, ad)), [t]), ee(() => () => {
    Zi(t instanceof Map ? Array.from(t.values(), ({ fiber: e }) => e) : [t]);
  }, [t]);
}, _r = (t) => $e() ? od(t) : (cd(t), null), ld = () => {
  const t = ae(0), e = t.current, s = Ee();
  return {
    version: e,
    markDirty: pe(() => () => {
      t.current++, s.markDirty?.();
    }, [s]),
    root: s.root
  };
}, ud = () => {
  const [t] = ue(() => vu((r, o) => {
    let i = !1;
    n((a) => (i = !r(), i ? a : a + 1)), i || s(() => r() && o());
  })), [e, s] = qu((r, o) => (Qr(t, r), r + (o() ? 1 : 0)), 0), [, n] = ue(0);
  return Qr(t, e), {
    root: t,
    version: e,
    markDirty: void 0
  };
}, vr = () => {
  const t = rd(), { root: e, version: s, markDirty: n } = $e() ? ld() : ud();
  return {
    version: s,
    createFiber: Bt((r, o, i) => ed(r, e, i ? () => {
      i(), n?.();
    } : n, t()), [])
  };
};
function ie(t) {
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
const dd = (t, e) => ({
  fiber: t,
  key: e,
  currentDeps: null,
  current: null,
  wipDeps: null,
  wip: null
});
function Ye(t) {
  const { version: e, createFiber: s } = vr(), n = ae(null), r = n.current ??= dd(s(t.hook, t.key), t.key), o = pe(() => r.fiber.hook === t.hook && r.key === t.key && !r.fiber.isReleased ? r.fiber : s(t.hook, t.key), [
    r,
    t.hook,
    t.key,
    s
  ]);
  r.wipDeps = r.currentDeps, r.wip = r.current;
  const i = [
    o,
    e,
    t.args
  ];
  ($e()?.isRefreshing || hr(o) || r.currentDeps === null || !Zt(r.currentDeps, i)) && (r.wipDeps = i, r.wip = { value: Lt(o, t.args) });
  const a = r.wip, c = _r(o);
  return ee(() => {
    if (r.currentDeps = r.wipDeps, r.current = r.wip, r.fiber = o, r.key = t.key, xs(o), c !== null) return () => {
      c.fiber !== o && Xi(o, !0);
    };
  }, [
    r,
    c,
    o,
    t.key,
    a
  ]), a.value;
}
const hd = (t, e, s) => {
  const n = ae(null), r = n.current ?? (n.current = {
    currentDeps: null,
    current: null
  }), o = !s && r.currentDeps && Zt(r.currentDeps, e) ? r.current : t();
  return ee(() => {
    r.currentDeps = e, r.current = o;
  }), o;
}, so = (t, e) => {
  const s = t.get(e);
  s && (s.isDirty = !0);
}, fd = (t, e) => !t.isDirty && !hr(t.fiber) && e !== void 0 && t.committedDeps !== void 0 && Zt(t.committedDeps, e), md = (t) => {
  if (!qi()) return !1;
  for (const { fiber: e } of t.values()) if (hr(e)) return !0;
  return !1;
};
function yr(t) {
  const [e] = ue(() => /* @__PURE__ */ new Map()), { version: s, createFiber: n } = vr(), r = $e()?.isRefreshing ?? !1, o = md(e);
  let i = !1;
  const a = hd(() => {
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
          const g = n(h.hook, h.key, () => so(e, d)), _ = Lt(g, h.args);
          p.next = {
            value: _,
            deps: h.deps,
            remount: g
          }, i = !0;
        } else if (!r && fd(p, h.deps))
          typeof p.next == "object" && Ji(p.fiber), p.fiber.contextDeps && Vi(p.fiber, p.fiber.contextDeps), p.next = "skip";
        else {
          const g = Lt(p.fiber, h.args);
          p.next = {
            value: g,
            deps: h.deps
          };
        }
      else {
        const g = n(h.hook, h.key, () => so(e, d));
        p = {
          fiber: g,
          next: {
            value: Lt(g, h.args),
            deps: h.deps
          },
          isDirty: !1,
          committedDeps: void 0,
          committedValue: void 0
        }, u++, e.set(d, p);
      }
      l.push(typeof p.next == "object" ? p.next.value : p.committedValue);
    }
    if (e.size > l.length - u)
      for (const f of e.keys()) c.has(f) || (e.get(f).next = "delete", i = !0);
    return l;
  }, [
    t,
    e,
    n,
    s
  ], r || o);
  return _r(e), ee(() => {
    if (i) {
      const c = [];
      for (const [l, u] of e.entries()) {
        const f = u.next;
        f === "delete" ? (c.push(u.fiber), e.delete(l)) : f !== "skip" && f.remount && (c.push(u.fiber), u.fiber = f.remount);
      }
      for (const l of c) l.isReleased = !0;
      Zi(c);
    }
    for (const c of e.values()) {
      const l = c.next;
      l === "skip" ? !c.fiber.isNeverMounted && !c.fiber.isMounted && xs(c.fiber) : l !== "delete" && (xs(c.fiber), c.committedDeps = l.deps, c.committedValue = l.value, c.isDirty = !1, c.next = "skip");
    }
  }, [
    a,
    e,
    i
  ]), r ? a.slice() : a;
}
const pd = (t) => t(), gd = (t) => {
  const { createFiber: e } = vr(), [s] = ue(() => e(pd, void 0)), n = Lt(s, [t]);
  _r(s);
  let r = !1;
  const o = () => {
    r && s.isMounted || (r = !0, xs(s));
  };
  return ee(o), {
    value: n,
    effects: o
  };
}, bd = () => {
  const t = S(4), [e, s] = ue(vd);
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
}, _d = ie(bd);
function vd() {
  return {
    renderers: {},
    fallbacks: []
  };
}
const Xs = (t) => {
  if (!t.overwrite) return t;
  const { overwrite: e, ...s } = t;
  return s;
}, yd = (t) => {
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
          n.tools[i] = Xs(a);
          continue;
        }
        const u = l > o ? c : a, f = l > o ? a : c;
        n.tools[i] = Xs({
          ...f,
          ...u
        }), s[i] = Math.max(l, o);
        continue;
      }
      n.tools || (n.tools = {}), n.tools[i] = Xs(a), s[i] ??= o;
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
}, St = (t, e, s) => {
  const n = (r) => {
    console.error(`[assistant-ui] ${s} listener threw an error`, r);
  };
  for (const r of t) try {
    const o = r(typeof e == "function" ? e() : e);
    o !== null && (typeof o == "object" || typeof o == "function") && "then" in o && typeof o.then == "function" && Promise.resolve(o).catch(n);
  } catch (o) {
    n(o);
  }
}, ke = /* @__PURE__ */ Symbol("skip-update"), Fs = (t, ...e) => {
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
function Ki(t, e) {
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
var wd = class {
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
    Fs(this._subscribers);
  }
}, Ls = class {
  _subscriptions = /* @__PURE__ */ new Set();
  _connection;
  get isConnected() {
    return !!this._connection;
  }
  notifySubscribers(t, e) {
    if (e) {
      St(this._subscriptions, t, e);
      return;
    }
    Fs(this._subscriptions, t);
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
}, Ae = class extends Ls {
  get path() {
    return this.binding.path;
  }
  binding;
  constructor(t) {
    super(), this.binding = t;
    const e = t.getState();
    if (e === ke) throw new Error("Entry not available in the store");
    this._previousState = e;
  }
  _previousState;
  getState = () => (this.isConnected || this._syncState(), this._previousState);
  _syncState() {
    const t = this.binding.getState();
    return t === ke || Ki(t, this._previousState) ? !1 : (this._previousState = t, !0);
  }
  _connect() {
    const t = () => {
      this._syncState() && this.notifySubscribers();
    }, e = this.binding.subscribe(t);
    return this._syncState(), e;
  }
}, wr = class extends Ls {
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
      t !== ke && (this._previousState === void 0 || !Ki(t, this._previousState)) && (this._previousState = t), this._previousStateDirty = !1;
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
}, Is = class extends Ls {
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
}, ea = class extends Ls {
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
}, ta = class {
  _providers = /* @__PURE__ */ new Map();
  _providerUnsubscribes = /* @__PURE__ */ new Map();
  getModelContext() {
    return yd(new Set(this._providers.values()));
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
    Fs(this._subscribers);
  }
  subscribe(t) {
    return this._subscribers.add(t), () => {
      this._subscribers.delete(t);
    };
  }
};
const bn = [], Sd = {
  modelName: void 0,
  toolNames: bn
}, xd = (t, e) => t === e || t.length === e.length && t.every((s, n) => s === e[n]), rs = (t, e) => {
  const s = t.getModelContext(), n = s.config?.modelName, r = s.tools ? Object.keys(s.tools).sort() : bn, o = r.length ? r : bn;
  return n === e.modelName && xd(o, e.toolNames) ? e : {
    modelName: n,
    toolNames: o
  };
}, Id = () => {
  const t = S(11);
  let e;
  t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (e = new ta(), t[0] = e) : e = t[0];
  const s = e;
  let n;
  t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (n = () => rs(s, Sd), t[1] = n) : n = t[1];
  const [r, o] = ue(n);
  let i, a;
  t[2] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (i = () => (o((d) => rs(s, d)), s.subscribe(() => {
    o((d) => rs(s, d));
  })), a = [s], t[2] = i, t[3] = a) : (i = t[2], a = t[3]), ee(i, a);
  let c;
  t[4] !== r ? (c = () => rs(s, r), t[4] = r, t[5] = c) : c = t[5];
  let l, u, f;
  t[6] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (l = () => s.getModelContext(), u = (d) => s.subscribe(d), f = (d) => s.registerModelContextProvider(d), t[6] = l, t[7] = u, t[8] = f) : (l = t[6], u = t[7], f = t[8]);
  let h;
  return t[9] !== c ? (h = {
    getState: c,
    getModelContext: l,
    subscribe: u,
    register: f
  }, t[9] = c, t[10] = h) : h = t[10], h;
}, sa = ie(Id), Td = (t) => t.display !== void 0 ? t.display === "standalone" : t.type === "human", Cd = (t, e) => {
  if (!(e.status?.type === "running" || e.status?.type === "requires-action")) {
    const n = t.complete;
    return typeof n != "function" ? n ?? null : n({
      args: e.args,
      result: e.result
    });
  }
  const s = t.running;
  return typeof s != "function" ? s ?? null : s({ args: e.args });
}, Ed = (t) => function(s) {
  return Cd(t, s);
}, Le = (t) => t, Rd = /* @__PURE__ */ new Set([
  "$$typeof",
  "nodeType",
  "then",
  "__v_raw",
  "__v_isRef",
  "__v_isReactive",
  "__v_isReadonly",
  "__v_isShallow",
  "__v_skip"
]), it = (t, e) => {
  if (t === Symbol.toStringTag) return e;
  if (typeof t != "symbol") {
    if (t === "toJSON") return () => e;
    if (!Rd.has(t))
      return !1;
  }
};
var jt = class {
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
const Rt = /* @__PURE__ */ Symbol("assistant-ui.store.clientId"), _n = /* @__PURE__ */ Symbol("assistant-ui.store.instanceTag"), na = (t, e) => {
  const s = new Proxy((() => {
  }), {
    apply: () => (e(), s),
    get: (n, r) => r === "source" ? t.source : r === "query" ? t.query : r === "name" ? t.name : r === Rt ? Sr(e()) : e()[r],
    has: (n, r) => r === "source" || r === "query" || r === "name" || r === Rt || r in e(),
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
  return s;
}, ra = (t, e) => {
  const s = () => {
    throw new Error(t);
  };
  return new Proxy((() => {
  }), {
    apply: s,
    get: (n, r) => {
      if (r === "source" || r === "query") return null;
      if (r === "name") return e;
      if (r === Rt) return s();
      const o = it(r, "AssistantClientAccessor");
      return o !== !1 ? o : s();
    },
    has: (n, r) => r === "source" || r === "query" || r === "name",
    ownKeys: () => [],
    getOwnPropertyDescriptor: () => {
    }
  });
}, Vs = (t) => t?.source != null, vn = (t) => t?.source === null, Sr = (t) => t[Rt] ?? t, Ad = (t) => t[_n] ?? Sr(t), rt = (t) => t === "optional" || t === "subscribe" || t === "on" || t === "__proto__" || typeof t == "symbol", yn = (t) => {
  const e = [];
  for (const s in t) rt(s) || e.push(s);
  return e;
};
var Md = class extends jt {
  #e;
  constructor(t) {
    super(), this.#e = t;
  }
  get(t, e) {
    const s = it(e, "OptionalAssistantClient");
    if (s !== !1) return s;
    if (rt(e)) return;
    const n = this.#e[e];
    return Vs(n) ? n : void 0;
  }
  ownKeys() {
    return yn(this.#e);
  }
  has(t, e) {
    return !rt(e) && e in this.#e;
  }
};
const oa = (t) => new Proxy({}, new Md(t)), no = () => () => {
}, Dd = "You are using a component or hook that requires an AuiProvider. Wrap your component in an <AuiProvider> component.";
var kd = class extends jt {
  #e;
  #t;
  #s;
  #n;
  constructor(t, e, s) {
    super(), this.#e = t, this.#t = e, this.#s = s;
  }
  get(t, e) {
    if (e === "subscribe" || e === "on") return no;
    if (e === "optional") return this.#n ??= oa(this.#s());
    const s = it(e, this.#e);
    return s !== !1 ? s : ra(this.#t(String(e)), String(e));
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
const Pd = (t, e) => {
  const s = new Proxy({}, new kd(t, e, () => s));
  return s;
}, xt = Pd("DefaultAssistantClient", () => Dd), Od = () => new Proxy({}, { get(t, e) {
  const s = it(e, "AssistantClient");
  return s !== !1 ? s : ra(`The current scope does not have a "${String(e)}" property.`, String(e));
} }), xr = We(xt), Nd = () => {
}, $d = /* @__PURE__ */ new WeakMap(), Bd = (t) => $d.get(t) ?? Nd, Ir = () => Bs(xr), Fd = (t, e) => Os(xr, t, e), wn = /* @__PURE__ */ Symbol("assistant-ui.transform-scopes");
function ia(t, e) {
  const s = t;
  if (s[wn]) throw new Error("transformScopes is already attached to this resource");
  s[wn] = e;
}
function Ld(t) {
  return t[wn];
}
const Tr = (t) => typeof t == "string" ? {
  scope: t.split(".")[0],
  event: t
} : {
  scope: t.scope,
  event: t.event
}, Sn = /* @__PURE__ */ Symbol("assistant-ui.store.clientIndex"), Vd = (t) => t[Sn], aa = We([]), Cr = () => br(aa), qd = (t, e) => {
  const s = S(3), n = Cr();
  let r;
  return s[0] !== t || s[1] !== n ? (r = [...n, t], s[0] = t, s[1] = n, s[2] = r) : r = s[2], Os(aa, r, e);
}, Ts = /* @__PURE__ */ Symbol("assistant-ui.store.getValue"), ro = (t) => {
  const e = t[Ts];
  if (!e) throw new Error("Client scope contains a non-client resource. Ensure your Derived get() returns a client created with useClientResource(), not a plain resource.");
  return e.getState?.();
}, oo = /* @__PURE__ */ new Map();
function jd(t) {
  let e = oo.get(t);
  return e || (e = function(...s) {
    if (!this || typeof this != "object") throw new Error(`Method "${String(t)}" called without proper context. This may indicate the function was called incorrectly.`);
    const n = this[Ts];
    if (!n) throw new Error(`Method "${String(t)}" called on invalid client proxy. Ensure you are calling this method on a valid client instance.`);
    const r = n[t];
    if (!r) throw new Error(`Method "${String(t)}" is not implemented.`);
    if (typeof r != "function") throw new Error(`"${String(t)}" is not a function.`);
    return r(...s);
  }, oo.set(t, e)), e;
}
var Ud = class extends jt {
  boundFns;
  cachedReceiver;
  outputRef;
  tagRef;
  index;
  self;
  constructor(t, e, s) {
    super(), this.outputRef = t, this.tagRef = e, this.index = s;
  }
  get(t, e, s) {
    if (e === Ts) return this.outputRef.current;
    if (e === Sn) return this.index;
    if (e === Rt) return this.self;
    if (e === _n) return this.tagRef.current;
    const n = it(e, "ClientProxy");
    if (n !== !1) return n;
    const r = this.outputRef.current[e];
    if (typeof r == "function") {
      if (s === void 0) return r;
      (!this.boundFns || this.cachedReceiver !== s) && (this.boundFns = /* @__PURE__ */ new Map(), this.cachedReceiver = s);
      let o = this.boundFns.get(e);
      return o || (o = jd(e).bind(s), this.boundFns.set(e, o)), o;
    }
    return r;
  }
  ownKeys() {
    return Object.keys(this.outputRef.current);
  }
  has(t, e) {
    return e === Ts || e === Sn || e === Rt || e === _n ? !0 : e in this.outputRef.current;
  }
};
const Ut = (t) => {
  const e = ae(null), s = ae(null), n = pe(() => ({}), [t.hook, t.key]), r = Cr().length, o = pe(() => {
    const a = new Ud(e, s, r), c = new Proxy({}, a);
    return a.self = c, c;
  }, [r]), i = qd(o, function() {
    return Ye(t);
  });
  return e.current || (e.current = i, s.current = n), ee(() => {
    e.current = i, s.current = n;
  }), {
    methods: o,
    state: i.getState?.(),
    key: t.key
  };
}, ca = ie(Ut);
let Cs = 0, xn = 0;
const Hd = (t) => {
  Cs++, xn++;
  try {
    return t();
  } finally {
    xn--, Cs++;
  }
}, zd = (t) => {
  let e;
  const s = /* @__PURE__ */ new Map();
  let n = -1;
  const r = (a) => {
    if (xn === 0) return ro(t[a]());
    if (n !== Cs)
      s.clear(), n = Cs;
    else if (s.has(a)) return s.get(a);
    const c = ro(t[a]());
    return s.set(a, c), c;
  };
  class o extends jt {
    get(c, l) {
      const u = it(l, "OptionalAssistantState");
      if (u !== !1) return u;
      const f = l;
      if (!rt(f) && Vs(t[f]))
        return r(f);
    }
    ownKeys() {
      return yn(t);
    }
    has(c, l) {
      return !rt(l) && l in t;
    }
  }
  class i extends jt {
    get(c, l) {
      const u = it(l, "AssistantState");
      if (u !== !1) return u;
      if (l === "optional") return e ??= new Proxy({}, new o());
      const f = l;
      if (!rt(f))
        return r(f);
    }
    ownKeys() {
      return [...yn(t), "optional"];
    }
    has(c, l) {
      return l === "optional" || !rt(l) && l in t;
    }
  }
  return new Proxy({}, new i());
}, io = /* @__PURE__ */ new WeakMap(), Gd = (t) => {
  let e = io.get(t);
  return e || (e = zd(t), io.set(t, e)), e;
}, la = We(null), ao = /* @__PURE__ */ Symbol("aui.scope-effect-unapplied"), Wd = (t, e) => Os(la, t, e), Er = () => {
  const t = br(la);
  if (!t) throw new Error("AssistantTapContext is not available");
  return t;
}, ua = () => Er().clientRef, da = (t, e, s) => {
  const n = S(8), { clientRef: r } = Er();
  let o;
  n[0] !== r || n[1] !== e || n[2] !== t ? (o = () => {
    const a = r.current;
    if (a === null) throw new Error("useAssistantScopeEffect ran before the client was committed. This is likely an internal bug in assistant-ui.");
    const c = () => {
      const d = r.current?.[t];
      return d !== void 0 && Vs(d) ? Ad(d) : void 0;
    };
    let l = ao, u;
    const f = (d) => {
      if (u?.(), u = void 0, l = ao, d !== void 0) {
        const p = e();
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
  }, n[0] = r, n[1] = e, n[2] = t, n[3] = o) : o = n[3];
  let i;
  n[4] !== r || n[5] !== s || n[6] !== t ? (i = [
    r,
    t,
    ...s
  ], n[4] = r, n[5] = s, n[6] = t, n[7] = i) : i = n[7], ee(o, i);
}, qs = () => {
  const t = S(3), { emit: e } = Er(), s = Cr();
  let n;
  return t[0] !== s || t[1] !== e ? (n = (r, o) => {
    e(r, o, s);
  }, t[0] = s, t[1] = e, t[2] = n) : n = t[2], Qi(n);
}, In = We(void 0), Yd = (t, e) => {
  const s = br(In);
  return Os(In, t ?? s, e);
}, Qd = (t, e) => {
  if (Array.isArray(t) !== Array.isArray(e)) return !1;
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    for (let n = 0; n < t.length; n++) if (!Object.is(t[n], e[n])) return !1;
    return !0;
  }
  const s = Object.keys(t);
  return s.length === Object.keys(e).length && s.every((n) => Object.hasOwn(e, n) && Object.is(t[n], e[n]));
}, ha = /* @__PURE__ */ Symbol("assistant-ui.derived-hook"), Jd = (t) => {
  t[ha] = !0;
}, Xd = (t) => t[ha] === !0, co = (t) => {
  console.error("NotificationManager: event listener error", t);
}, lo = (t, e, s) => {
  try {
    const n = t(e, s);
    n !== null && (typeof n == "object" || typeof n == "function") && typeof n.then == "function" && Promise.resolve(n).catch(co);
  } catch (n) {
    co(n);
  }
}, Zd = () => {
  const t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set();
  return {
    on(n, r) {
      const o = r;
      if (n === "*")
        return e.add(o), () => e.delete(o);
      let i = t.get(n);
      return i || (i = /* @__PURE__ */ new Set(), t.set(n, i)), i.add(o), () => {
        i.delete(o), i.size === 0 && t.get(n) === i && t.delete(n);
      };
    },
    emit(n, r, o) {
      !t.has(n) && e.size === 0 || queueMicrotask(() => {
        const i = t.get(n);
        if (i) for (const a of i) lo(a, r, o);
        if (e.size > 0) {
          const a = {
            event: n,
            payload: r
          };
          for (const c of e) lo(c, a, o);
        }
      });
    },
    subscribe(n) {
      return s.add(n), () => s.delete(n);
    },
    notifySubscribers() {
      Hd(() => {
        for (const n of s) try {
          n();
        } catch (r) {
          console.error("NotificationManager: subscriber callback error", r);
        }
      });
    }
  };
}, Kd = () => ue(Zd)[0], eh = () => {
  const [t] = ue(() => ({
    controller: new AbortController(),
    generation: 0
  }));
  return $s(() => {
    const e = ++t.generation;
    return () => queueMicrotask(() => {
      t.generation === e && t.controller.abort();
    });
  }, [t]), t.controller.signal;
}, Tn = (t) => {
  const e = pe(() => ({}), []);
  return e.v !== void 0 && Qd(e.v, t) ? e.v : (e.v = t, t);
}, fa = (() => {
  try {
    return !1;
  } catch {
    return !1;
  }
})(), th = (t, e) => {
  const s = { ...t }, n = /* @__PURE__ */ new Set();
  let r = !0;
  for (; r; ) {
    r = !1;
    for (const o of Object.values(s)) {
      if (n.has(o.hook)) continue;
      n.add(o.hook);
      const i = Ld(o.hook);
      if (i) {
        i(s, e), r = !0;
        break;
      }
    }
  }
  return s;
}, js = (t) => Xd(t.hook), sh = (t) => {
  if (!js(t)) return {
    source: "root",
    query: {}
  };
  const e = t.args[0];
  return {
    source: e.source,
    query: e.query ?? {}
  };
}, Cn = /* @__PURE__ */ Symbol.for("aui.event-receiver-ref"), ma = (t, e) => {
  const s = t === xt ? Od() : t, n = Object.create(s);
  Object.assign(n, e);
  let r;
  return Object.defineProperty(n, "optional", {
    get: () => r ??= oa(n),
    enumerable: !1
  }), n;
}, nh = ({ notifications: t, clientRef: e }) => pe(() => ({
  subscribe: t.subscribe,
  on: function(s, n) {
    if (!this) throw new Error("const { on } = useAui() is not supported. Use aui.on() instead.");
    const { scope: r, event: o } = Tr(s), i = s[Cn];
    if (r !== "*" && !i && vn(this[r]))
      throw new Error(`Scope "${r}" is not available. Use { scope: "*", event: "${o}" } to listen globally.`);
    const a = t.on(o, (l, u) => {
      if (r === "*") return n(l);
      const f = ((i ?? e).current ?? this)[r];
      if (!Vs(f)) return;
      const h = Sr(f);
      if (h === u[Vd(h)]) return n(l);
    });
    if (r !== "*") {
      if (i) {
        if (e.parent === xt) return a;
      } else if (vn(e.parent[r])) return a;
    }
    const c = e.parent.on(s, n);
    return () => {
      a(), c();
    };
  }
}), [t, e]), pa = (t) => {
  const e = S(5);
  let s;
  e[0] !== t ? (s = sh(t), e[0] = t, e[1] = s) : s = e[1];
  const { source: n, query: r } = s, o = Tn(r);
  let i;
  return e[2] !== n || e[3] !== o ? (i = {
    source: n,
    query: o
  }, e[2] = n, e[3] = o, e[4] = i) : i = e[4], Tn(i);
}, rh = (t, e) => {
  const s = S(3);
  let n;
  return s[0] !== e || s[1] !== t ? (n = e ? t : ca(t), s[0] = e, s[1] = t, s[2] = n) : n = s[2], Ye(n);
}, oh = (t, e) => {
  const s = Ir(), n = js(e), r = rh(e, n), o = n ? r : r.methods, i = pa(e), a = pe(() => na({
    name: t,
    ...i
  }, () => o), [
    t,
    i,
    o
  ]);
  return s[t] = a, a;
}, ih = ie(oh), ah = (t) => {
  const e = S(2);
  let s;
  return e[0] !== t ? (s = t.map(ph), e[0] = t, e[1] = s) : s = e[1], yr(s);
}, ga = (t, e) => {
  const s = Tn(e), n = pe(() => ({}), []);
  return n.deps !== s && (n.deps = s, n.client = t), n.client;
}, ch = ({ parent: t, entries: e, clientRef: s, notifications: n }) => {
  const r = nh({
    notifications: n,
    clientRef: s
  }), o = ma(t, r), i = pe(() => ({
    clientRef: s,
    emit: n.emit
  }), [s, n.emit]), a = Wd(i, function() {
    return Fd(o, function() {
      return ah(e);
    });
  });
  return { client: ga(o, [t, ...a]) };
}, lh = ({ parent: t, entries: e, destroySignal: s }) => {
  const n = ae({
    parent: t,
    current: null
  }).current, { value: r, effects: o } = gd(function() {
    const a = Kd(), { client: c } = Yd(s, function() {
      return ch({
        parent: t,
        entries: e,
        clientRef: n,
        notifications: a
      });
    });
    return ee(() => t.subscribe(a.notifySubscribers), [t, a]), ee(() => a.notifySubscribers()), c;
  });
  return $s(() => {
    n.parent = t, n.current = r;
  }, [
    r,
    t,
    n
  ]), {
    client: r,
    effects: o
  };
}, uh = (t, e, s, n) => {
  const { get: r } = n.args[0], o = Ns(t.subscribe, () => r(t), () => r(t)), i = pa(n), a = pe(() => na({
    name: s,
    ...i
  }, () => o), [
    s,
    i,
    o
  ]);
  return e[s] = a, a;
}, dh = (t, e) => {
  if (fa) {
    const [a] = ue(() => e.map(([u]) => u).join(",")), c = e.find(([, u]) => !js(u));
    if (c) throw new Error(`Scope "${c[0]}" is a root scope but this useAui mounted derived-only; remount with a new key to change scope kinds.`);
    const l = e.map(([u]) => u).join(",");
    if (l !== a) throw new Error(`A derived-only config mounted scopes [${a}] but now has [${l}]; remount with a new key to change the scope set.`);
  }
  const s = ae({
    parent: t,
    current: null
  }).current, n = function(a, c) {
    if (!this) throw new Error("const { on } = useAui() is not supported. Use aui.on() instead.");
    const { scope: l, event: u } = Tr(a);
    if (l === "*") return t.on(a, c);
    const f = a[Cn];
    if (!f && vn(this[l]))
      throw new Error(`Scope "${l}" is not available. Use { scope: "*", event: "${u}" } to listen globally.`);
    return t.on({
      scope: l,
      event: u,
      [Cn]: f ?? s
    }, c);
  }, r = ma(t, {
    subscribe: t.subscribe,
    on: n
  }), o = e.map(([a, c]) => uh(t, r, a, c)), i = ga(r, [t, ...o]);
  return $s(() => {
    s.parent = t, s.current = i;
  }, [
    i,
    t,
    s
  ]), i;
}, hh = (t, e) => {
  const s = S(8);
  let n;
  s[0] !== e || s[1] !== t ? (n = Object.entries(th(e, t)), s[0] = e, s[1] = t, s[2] = n) : n = s[2];
  const r = n;
  let o;
  s[3] !== r ? (o = () => r.length === 0 || r.some(gh), s[3] = r, s[4] = o) : o = s[4];
  const [i] = ue(o);
  let a;
  return s[5] !== r || s[6] !== i ? (a = {
    entries: r,
    rooted: i
  }, s[5] = r, s[6] = i, s[7] = a) : a = s[7], a;
}, fh = (t, e, s, n) => {
  const { entries: r, rooted: o } = hh(t, e);
  return o ? s({
    parent: t,
    entries: r,
    destroySignal: n
  }) : { client: dh(t, r) };
}, mh = (t, e, s) => fh(t, e, lh, s);
function re(t) {
  return Ir();
}
function ph(t) {
  const [e, s] = t;
  return De(e, ih(e, s));
}
function gh(t) {
  const [, e] = t;
  return !js(e);
}
const k = (t) => {
  const e = S(6), s = re();
  let n;
  e[0] !== s ? (n = Gd(s), e[0] = s, e[1] = n) : n = e[1];
  const r = n;
  let o, i;
  e[2] !== r || e[3] !== t ? (o = () => t(r), i = () => t(r), e[2] = r, e[3] = t, e[4] = o, e[5] = i) : (o = e[4], i = e[5]);
  const a = Ns(s.subscribe, o, i);
  if (typeof a == "object" && a !== null && (a === r || a === r.optional)) throw new Error("You tried to return the entire AssistantState. This is not supported due to technical limitations.");
  return ju(a), a;
}, ba = (t) => {
  const e = S(3), { get: s } = t, n = re();
  let r;
  return e[0] !== n || e[1] !== s ? (r = () => s(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2], k(r);
};
Jd(ba);
const Me = ie(ba), _a = (t) => {
  if (t.key === void 0) throw new Error("useClientLookup: Element has no key");
  return t.key;
};
function at(t) {
  const e = S(12);
  let s;
  e[0] !== t ? (s = t.map(vh), e[0] = t, e[1] = s) : s = e[1];
  const n = yr(s);
  let r;
  e[2] !== t ? (r = t.reduce(_h, /* @__PURE__ */ Object.create(null)), e[2] = t, e[3] = r) : r = e[3];
  const o = r;
  let i;
  e[4] !== n ? (i = n.map(bh), e[4] = n, e[5] = i) : i = e[5];
  const a = i;
  let c;
  e[6] !== o || e[7] !== n ? (c = (u) => {
    if ("index" in u) {
      if (u.index < 0 || u.index >= n.length) throw new Error(`useClientLookup: index ${u.index} out of bounds (length: ${n.length}) (ignore if recovered)`);
      return n[u.index].methods;
    }
    const f = o[u.key];
    if (f === void 0) throw new Error(`useClientLookup: key "${u.key}" not found (ignore if recovered)`);
    return n[f].methods;
  }, e[6] = o, e[7] = n, e[8] = c) : c = e[8];
  let l;
  return e[9] !== a || e[10] !== c ? (l = {
    state: a,
    get: c
  }, e[9] = a, e[10] = c, e[11] = l) : l = e[11], l;
}
function bh(t) {
  return t.state;
}
function _h(t, e, s) {
  return t[_a(e)] = s, t;
}
function vh(t) {
  return De(_a(t), ca(t), t.deps);
}
const yh = (t, e) => t.scrollTop > e.scrollTop && t.scrollHeight === e.scrollHeight, va = (t) => {
  const e = S(16), { toolkit: s, mcpApp: n } = t;
  let r;
  e[0] !== n ? (r = n ? [De("mcpApp", n)] : [], e[0] = n, e[1] = r) : r = e[1];
  const o = yr(r)[0], [i, a] = ue(Sh);
  let c;
  e[2] !== o || e[3] !== i ? (c = {
    toolUIs: i,
    mcpApp: o
  }, e[2] = o, e[3] = i, e[4] = c) : c = e[4];
  const l = c, u = ua();
  let f;
  e[5] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (f = (w, I, C) => {
    const T = {
      render: I,
      standalone: C?.standalone ?? !1
    };
    return a((E) => ({
      ...E,
      [w]: [...E[w] ?? [], T]
    })), () => {
      a((E) => {
        const b = E[w]?.filter((M) => M !== T) ?? [];
        if (b.length > 0) return {
          ...E,
          [w]: b
        };
        const y = { ...E };
        return delete y[w], y;
      });
    };
  }, e[5] = f) : f = e[5];
  const h = f;
  let d, p;
  e[6] !== s ? (d = () => {
    if (!s) return;
    const w = [];
    for (const [I, C] of Object.entries(s)) {
      const T = "render" in C ? C.render : void 0, E = "renderText" in C ? C.renderText : void 0, b = T ?? (E ? Ed(E) : void 0);
      b && w.push(h(I, b, { standalone: Td(C) }));
    }
    return () => {
      w.forEach(xh);
    };
  }, p = [s, h], e[6] = s, e[7] = d, e[8] = p) : (d = e[7], p = e[8]), ee(d, p);
  let g;
  e[9] !== u || e[10] !== s ? (g = () => {
    if (!s) return;
    const w = Object.entries(s).reduce(Ih, {});
    return u.current.modelContext().register({ getModelContext: () => ({ tools: w }) });
  }, e[9] = u, e[10] = s, e[11] = g) : g = e[11];
  let _;
  e[12] !== s ? (_ = [s], e[12] = s, e[13] = _) : _ = e[13], da("modelContext", g, _);
  let x;
  return e[14] !== l ? (x = {
    getState: () => l,
    setToolUI: h
  }, e[14] = l, e[15] = x) : x = e[15], x;
}, wh = ie(va);
ia(va, (t, e) => {
  !t.modelContext && e.modelContext.source === null && (t.modelContext = sa());
});
function Sh() {
  return {};
}
function xh(t) {
  return t();
}
function Ih(t, e) {
  const [s, n] = e;
  if (n.type === "mcp") return t;
  const { display: r, render: o, renderText: i, ...a } = n;
  return t[s] = a, t;
}
const ft = (t) => Ns(t.subscribe, t.getState), ya = (t, e) => {
  const s = e();
  return s.catch((n) => {
    console.error(`[assistant-ui] ${t} failed:`, n);
  }), s;
}, Th = (t) => {
  const e = S(9), { runtime: s } = t, n = ft(s);
  let r;
  e[0] !== n ? (r = () => n, e[0] = n, e[1] = r) : r = e[1];
  let o, i;
  e[2] !== s ? (o = () => ya("attachment remove", s.remove), i = () => s, e[2] = s, e[3] = o, e[4] = i) : (o = e[3], i = e[4]);
  let a;
  return e[5] !== r || e[6] !== o || e[7] !== i ? (a = {
    getState: r,
    remove: o,
    __internal_getRuntime: i
  }, e[5] = r, e[6] = o, e[7] = i, e[8] = a) : a = e[8], a;
}, wa = ie(Th), Ch = (t) => {
  const e = S(5), { runtime: s, index: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getAttachmentByIndex(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const o = r;
  let i;
  return e[3] !== o ? (i = wa({ runtime: o }), e[3] = o, e[4] = i) : i = e[4], Ye(i);
}, Eh = ie(Ch), Rh = ({ item: t, onMove: e, onRemove: s }) => ({
  getState: () => t,
  steer: () => e({
    lane: "steer",
    insertAfter: null
  }),
  move: e,
  remove: s
}), Ah = ie(Rh), Mh = (t) => {
  const e = S(55), { threadIdRef: s, messageIdRef: n, runtime: r } = t, o = ft(r), i = qs();
  let a, c;
  e[0] !== i || e[1] !== n || e[2] !== r || e[3] !== s ? (a = () => {
    const b = [];
    for (const y of ["send", "attachmentAdd"]) {
      const M = r.unstable_on(y, () => {
        i(`composer.${y}`, {
          threadId: s.current,
          ...n && { messageId: n.current }
        });
      });
      b.push(M);
    }
    return b.push(r.unstable_on("attachmentAddError", (y) => {
      i("composer.attachmentAddError", {
        threadId: s.current,
        ...n && { messageId: n.current },
        ...y.attachmentId && { attachmentId: y.attachmentId },
        reason: y.reason,
        message: y.message
      });
    })), () => {
      for (const y of b) y();
    };
  }, c = [
    r,
    i,
    s,
    n
  ], e[0] = i, e[1] = n, e[2] = r, e[3] = s, e[4] = a, e[5] = c) : (a = e[4], c = e[5]), ee(a, c);
  let l;
  if (e[6] !== r || e[7] !== o.attachments) {
    let b;
    e[9] !== r ? (b = (y, M) => De(y.id, Eh({
      runtime: r,
      index: M
    }), [r, M]), e[9] = r, e[10] = b) : b = e[10], l = o.attachments.map(b), e[6] = r, e[7] = o.attachments, e[8] = l;
  } else l = e[8];
  const u = at(l), f = o.queue;
  let h;
  if (e[11] !== f || e[12] !== r) {
    let b;
    e[14] !== r ? (b = (y) => De(y.id, Ah({
      item: y,
      onMove: (M) => r.moveQueueItem(y.id, M),
      onRemove: () => r.removeQueueItem(y.id)
    })), e[14] = r, e[15] = b) : b = e[15], h = f.map(b), e[11] = f, e[12] = r, e[13] = h;
  } else h = e[13];
  const d = at(h), p = o.type ?? "thread";
  let g;
  e[16] !== u.state || e[17] !== f || e[18] !== o.attachmentAccept || e[19] !== o.canCancel || e[20] !== o.canSend || e[21] !== o.dictation || e[22] !== o.isEditing || e[23] !== o.isEmpty || e[24] !== o.quote || e[25] !== o.role || e[26] !== o.runConfig || e[27] !== o.text || e[28] !== p ? (g = {
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
    queue: f
  }, e[16] = u.state, e[17] = f, e[18] = o.attachmentAccept, e[19] = o.canCancel, e[20] = o.canSend, e[21] = o.dictation, e[22] = o.isEditing, e[23] = o.isEmpty, e[24] = o.quote, e[25] = o.role, e[26] = o.runConfig, e[27] = o.text, e[28] = p, e[29] = g) : g = e[29];
  const _ = g;
  let x;
  e[30] !== _ ? (x = () => _, e[30] = _, e[31] = x) : x = e[31];
  const w = r.beginEdit ?? Dh;
  let I;
  e[32] !== u ? (I = (b) => "id" in b ? u.get({ key: b.id }) : u.get(b), e[32] = u, e[33] = I) : I = e[33];
  let C;
  e[34] !== d ? (C = (b) => "id" in b ? d.get({ key: b.id }) : d.get(b), e[34] = d, e[35] = C) : C = e[35];
  let T;
  e[36] !== r ? (T = () => r, e[36] = r, e[37] = T) : T = e[37];
  let E;
  return e[38] !== r.addAttachment || e[39] !== r.cancel || e[40] !== r.clearAttachments || e[41] !== r.reset || e[42] !== r.send || e[43] !== r.setQuote || e[44] !== r.setRole || e[45] !== r.setRunConfig || e[46] !== r.setText || e[47] !== r.startDictation || e[48] !== r.stopDictation || e[49] !== C || e[50] !== T || e[51] !== x || e[52] !== w || e[53] !== I ? (E = {
    getState: x,
    setText: r.setText,
    setRole: r.setRole,
    setRunConfig: r.setRunConfig,
    addAttachment: r.addAttachment,
    reset: r.reset,
    clearAttachments: r.clearAttachments,
    send: r.send,
    cancel: r.cancel,
    beginEdit: w,
    startDictation: r.startDictation,
    stopDictation: r.stopDictation,
    setQuote: r.setQuote,
    attachment: I,
    queueItem: C,
    __internal_getRuntime: T
  }, e[38] = r.addAttachment, e[39] = r.cancel, e[40] = r.clearAttachments, e[41] = r.reset, e[42] = r.send, e[43] = r.setQuote, e[44] = r.setRole, e[45] = r.setRunConfig, e[46] = r.setText, e[47] = r.startDictation, e[48] = r.stopDictation, e[49] = C, e[50] = T, e[51] = x, e[52] = w, e[53] = I, e[54] = E) : E = e[54], E;
}, Sa = ie(Mh);
function Dh() {
  throw new Error("beginEdit is not supported in this runtime");
}
const xa = (t) => ({ get current() {
  return t();
} }), kh = (t) => {
  const e = S(13), { runtime: s } = t, n = ft(s);
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
}, Ph = ie(kh), Oh = (t) => {
  const e = S(5), { runtime: s, index: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getAttachmentByIndex(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const o = r;
  let i;
  return e[3] !== o ? (i = wa({ runtime: o }), e[3] = o, e[4] = i) : i = e[4], Ye(i);
}, Nh = ie(Oh), $h = (t) => {
  const e = S(5), { runtime: s, index: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getMessagePartByIndex(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const o = r;
  let i;
  return e[3] !== o ? (i = Ph({ runtime: o }), e[3] = o, e[4] = i) : i = e[4], Ye(i);
}, Bh = ie($h), Fh = (t) => {
  const e = S(55), { runtime: s, threadIdRef: n } = t, r = ft(s), [o, i] = ue(!1), [a, c] = ue(!1);
  let l;
  e[0] !== s ? (l = xa(() => s.getState().id), e[0] = s, e[1] = l) : l = e[1];
  const u = l;
  let f;
  e[2] !== u || e[3] !== s.composer || e[4] !== n ? (f = Sa({
    runtime: s.composer,
    threadIdRef: n,
    messageIdRef: u
  }), e[2] = u, e[3] = s.composer, e[4] = n, e[5] = f) : f = e[5];
  const h = Ut(f);
  let d;
  if (e[6] !== s || e[7] !== r.content) {
    let H;
    e[9] !== s ? (H = (K, L) => De("toolCallId" in K && K.toolCallId != null ? `toolCallId-${K.toolCallId}` : `index-${L}`, Bh({
      runtime: s,
      index: L
    }), [s, L]), e[9] = s, e[10] = H) : H = e[10], d = r.content.map(H), e[6] = s, e[7] = r.content, e[8] = d;
  } else d = e[8];
  const p = at(d);
  let g;
  e[11] !== r.attachments ? (g = r.attachments ?? [], e[11] = r.attachments, e[12] = g) : g = e[12];
  let _;
  if (e[13] !== s || e[14] !== g) {
    let H;
    e[16] !== s ? (H = (K, L) => De(K.id, Nh({
      runtime: s,
      index: L
    }), [s, L]), e[16] = s, e[17] = H) : H = e[17], _ = g.map(H), e[13] = s, e[14] = g, e[15] = _;
  } else _ = e[15];
  const x = at(_), w = r;
  let I;
  e[18] !== h.state || e[19] !== o || e[20] !== a || e[21] !== p.state || e[22] !== w ? (I = {
    ...w,
    parts: p.state,
    composer: h.state,
    isCopied: o,
    isHovering: a
  }, e[18] = h.state, e[19] = o, e[20] = a, e[21] = p.state, e[22] = w, e[23] = I) : I = e[23];
  const C = I;
  let T;
  e[24] !== C ? (T = () => C, e[24] = C, e[25] = T) : T = e[25];
  let E;
  e[26] !== h.methods ? (E = () => h.methods, e[26] = h.methods, e[27] = E) : E = e[27];
  let b, y, M, P, W, X, j;
  e[28] !== s ? (b = () => s.delete(), y = (H) => s.reload(H), M = () => s.speak(), P = () => s.stopSpeaking(), W = (H) => s.submitFeedback(H), X = (H) => s.switchToBranch(H), j = () => s.unstable_getCopyText(), e[28] = s, e[29] = b, e[30] = y, e[31] = M, e[32] = P, e[33] = W, e[34] = X, e[35] = j) : (b = e[29], y = e[30], M = e[31], P = e[32], W = e[33], X = e[34], j = e[35]);
  let U;
  e[36] !== p ? (U = (H) => "index" in H ? p.get({ index: H.index }) : p.get({ key: `toolCallId-${H.toolCallId}` }), e[36] = p, e[37] = U) : U = e[37];
  let he;
  e[38] !== x ? (he = (H) => "id" in H ? x.get({ key: H.id }) : x.get(H), e[38] = x, e[39] = he) : he = e[39];
  let de;
  e[40] !== s ? (de = () => s, e[40] = s, e[41] = de) : de = e[41];
  let Z;
  return e[42] !== b || e[43] !== y || e[44] !== M || e[45] !== P || e[46] !== W || e[47] !== X || e[48] !== j || e[49] !== U || e[50] !== he || e[51] !== de || e[52] !== T || e[53] !== E ? (Z = {
    getState: T,
    composer: E,
    delete: b,
    reload: y,
    speak: M,
    stopSpeaking: P,
    submitFeedback: W,
    switchToBranch: X,
    getCopyText: j,
    part: U,
    attachment: he,
    setIsCopied: i,
    setIsHovering: c,
    __internal_getRuntime: de
  }, e[42] = b, e[43] = y, e[44] = M, e[45] = P, e[46] = W, e[47] = X, e[48] = j, e[49] = U, e[50] = he, e[51] = de, e[52] = T, e[53] = E, e[54] = Z) : Z = e[54], Z;
}, Lh = ie(Fh), Vh = (t) => ({ getState: () => t }), qh = ie(Vh), jh = (t) => {
  const e = S(9);
  let s;
  e[0] !== t.suggestions ? (s = t.suggestions.map(zh), e[0] = t.suggestions, e[1] = s) : s = e[1];
  const n = at(s);
  let r;
  e[2] !== t ? (r = () => t, e[2] = t, e[3] = r) : r = e[3];
  let o;
  e[4] !== n ? (o = (a) => {
    const { index: c } = a;
    return n.get({ index: c });
  }, e[4] = n, e[5] = o) : o = e[5];
  let i;
  return e[6] !== r || e[7] !== o ? (i = {
    getState: r,
    suggestion: o
  }, e[6] = r, e[7] = o, e[8] = i) : i = e[8], i;
}, Uh = (t) => {
  const e = S(4);
  let s;
  e[0] !== t ? (s = t.map(Gh), e[0] = t, e[1] = s) : s = e[1];
  let n;
  return e[2] !== s ? (n = { suggestions: s }, e[2] = s, e[3] = n) : n = e[3], jh(n);
}, Hh = ie(Uh);
function zh(t, e) {
  return De(e, qh(t), [t]);
}
function Gh(t) {
  return {
    title: t.title ?? t.prompt,
    label: t.label ?? "",
    prompt: t.prompt
  };
}
const Wh = (t) => {
  const e = S(6), { runtime: s, id: n, threadIdRef: r } = t;
  let o;
  e[0] !== n || e[1] !== s ? (o = s.getMessageById(n), e[0] = n, e[1] = s, e[2] = o) : o = e[2];
  const i = o;
  let a;
  return e[3] !== i || e[4] !== r ? (a = Lh({
    runtime: i,
    threadIdRef: r
  }), e[3] = i, e[4] = r, e[5] = a) : a = e[5], Ye(a);
}, Yh = ie(Wh), Qh = (t) => {
  const e = S(64), { runtime: s } = t, n = ft(s), r = qs();
  let o, i;
  e[0] !== r || e[1] !== s ? (o = () => {
    const y = [];
    for (const M of [
      "runStart",
      "runEnd",
      "initialize",
      "modelContextUpdate"
    ]) {
      const P = s.unstable_on(M, () => {
        const W = s.getState()?.threadId || "unknown";
        r(`thread.${M}`, { threadId: W });
      });
      y.push(P);
    }
    return () => {
      for (const M of y) M();
    };
  }, i = [s, r], e[0] = r, e[1] = s, e[2] = o, e[3] = i) : (o = e[2], i = e[3]), ee(o, i);
  let a;
  e[4] !== s ? (a = xa(() => s.getState().threadId), e[4] = s, e[5] = a) : a = e[5];
  const c = a;
  let l;
  e[6] !== s.composer || e[7] !== c ? (l = Sa({
    runtime: s.composer,
    threadIdRef: c
  }), e[6] = s.composer, e[7] = c, e[8] = l) : l = e[8];
  const u = Ut(l);
  let f;
  e[9] !== n.suggestions ? (f = Hh(n.suggestions), e[9] = n.suggestions, e[10] = f) : f = e[10];
  const h = Ut(f);
  let d;
  if (e[11] !== s || e[12] !== n.messages || e[13] !== c) {
    let y;
    e[15] !== s || e[16] !== c ? (y = (M) => De(M.id, Yh({
      runtime: s,
      id: M.id,
      threadIdRef: c
    }), [
      s,
      M.id,
      c
    ]), e[15] = s, e[16] = c, e[17] = y) : y = e[17], d = n.messages.map(y), e[11] = s, e[12] = n.messages, e[13] = c, e[14] = d;
  } else d = e[14];
  const p = at(d), g = p.state.length === 0 && !n.isLoading;
  let _;
  e[18] !== u.state || e[19] !== p.state || e[20] !== n.capabilities || e[21] !== n.extras || e[22] !== n.isDisabled || e[23] !== n.isLoading || e[24] !== n.isRunning || e[25] !== n.speech || e[26] !== n.state || e[27] !== n.suggestions || e[28] !== n.voice || e[29] !== g ? (_ = {
    isEmpty: g,
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
  }, e[18] = u.state, e[19] = p.state, e[20] = n.capabilities, e[21] = n.extras, e[22] = n.isDisabled, e[23] = n.isLoading, e[24] = n.isRunning, e[25] = n.speech, e[26] = n.state, e[27] = n.suggestions, e[28] = n.voice, e[29] = g, e[30] = _) : _ = e[30];
  const x = _;
  let w;
  e[31] !== x ? (w = () => x, e[31] = x, e[32] = w) : w = e[32];
  let I;
  e[33] !== u.methods ? (I = () => u.methods, e[33] = u.methods, e[34] = I) : I = e[34];
  let C;
  e[35] !== h ? (C = () => h.methods, e[35] = h, e[36] = C) : C = e[36];
  let T;
  e[37] !== p ? (T = (y) => "id" in y ? p.get({ key: y.id }) : p.get(y), e[37] = p, e[38] = T) : T = e[38];
  let E;
  e[39] !== s ? (E = () => s, e[39] = s, e[40] = E) : E = e[40];
  let b;
  return e[41] !== s.append || e[42] !== s.cancelRun || e[43] !== s.connectVoice || e[44] !== s.deleteMessage || e[45] !== s.disconnectVoice || e[46] !== s.export || e[47] !== s.getModelContext || e[48] !== s.getVoiceVolume || e[49] !== s.import || e[50] !== s.importExternalState || e[51] !== s.muteVoice || e[52] !== s.reset || e[53] !== s.resumeRun || e[54] !== s.startRun || e[55] !== s.stopSpeaking || e[56] !== s.subscribeVoiceVolume || e[57] !== s.unmuteVoice || e[58] !== I || e[59] !== C || e[60] !== T || e[61] !== E || e[62] !== w ? (b = {
    getState: w,
    composer: I,
    suggestions: C,
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
  }, e[41] = s.append, e[42] = s.cancelRun, e[43] = s.connectVoice, e[44] = s.deleteMessage, e[45] = s.disconnectVoice, e[46] = s.export, e[47] = s.getModelContext, e[48] = s.getVoiceVolume, e[49] = s.import, e[50] = s.importExternalState, e[51] = s.muteVoice, e[52] = s.reset, e[53] = s.resumeRun, e[54] = s.startRun, e[55] = s.stopSpeaking, e[56] = s.subscribeVoiceVolume, e[57] = s.unmuteVoice, e[58] = I, e[59] = C, e[60] = T, e[61] = E, e[62] = w, e[63] = b) : b = e[63], b;
}, Jh = ie(Qh), Be = (t, e) => ya(`thread list ${t}`, e), Xh = (t) => {
  const e = S(35), { runtime: s, mainThreadIsRunning: n } = t, r = n === void 0 ? !1 : n, o = ft(s);
  let i;
  e: {
    const M = o.isRunning || o.isMain && r;
    if (M === o.isRunning) {
      i = o;
      break e;
    }
    let P;
    e[0] !== M || e[1] !== o ? (P = {
      ...o,
      isRunning: M
    }, e[0] = M, e[1] = o, e[2] = P) : P = e[2], i = P;
  }
  const a = i, c = qs(), { isMain: l, id: u } = o;
  let f;
  e[3] !== l || e[4] !== u ? (f = {
    isMain: l,
    threadId: u
  }, e[3] = l, e[4] = u, e[5] = f) : f = e[5];
  const h = ae(f);
  let d, p;
  e[6] !== c || e[7] !== l || e[8] !== u ? (d = () => {
    const M = h.current;
    M.isMain === l && M.threadId === u || (h.current = {
      isMain: l,
      threadId: u
    }, c(l ? "threadListItem.switchedTo" : "threadListItem.switchedAway", { threadId: u }));
  }, p = [
    l,
    u,
    c
  ], e[6] = c, e[7] = l, e[8] = u, e[9] = d, e[10] = p) : (d = e[9], p = e[10]), ee(d, p);
  let g;
  e[11] !== a ? (g = () => a, e[11] = a, e[12] = g) : g = e[12];
  let _, x, w, I, C, T, E;
  e[13] !== s ? (C = (M) => Be("switch", () => s.switchTo(M)), T = (M) => Be("rename", () => s.rename(M)), E = (M) => Be("update custom metadata", () => s.updateCustom(M)), _ = () => Be("archive", () => s.archive()), x = () => Be("unarchive", () => s.unarchive()), w = () => Be("delete", () => s.delete()), I = () => Be("generate title", () => s.generateTitle()), e[13] = s, e[14] = _, e[15] = x, e[16] = w, e[17] = I, e[18] = C, e[19] = T, e[20] = E) : (_ = e[14], x = e[15], w = e[16], I = e[17], C = e[18], T = e[19], E = e[20]);
  let b;
  e[21] !== s ? (b = () => s, e[21] = s, e[22] = b) : b = e[22];
  let y;
  return e[23] !== s.detach || e[24] !== s.initialize || e[25] !== _ || e[26] !== x || e[27] !== w || e[28] !== I || e[29] !== b || e[30] !== g || e[31] !== C || e[32] !== T || e[33] !== E ? (y = {
    getState: g,
    switchTo: C,
    rename: T,
    updateCustom: E,
    archive: _,
    unarchive: x,
    delete: w,
    generateTitle: I,
    initialize: s.initialize,
    detach: s.detach,
    __internal_getRuntime: b
  }, e[23] = s.detach, e[24] = s.initialize, e[25] = _, e[26] = x, e[27] = w, e[28] = I, e[29] = b, e[30] = g, e[31] = C, e[32] = T, e[33] = E, e[34] = y) : y = e[34], y;
}, Zh = ie(Xh), Kh = (t) => {
  const e = S(4), s = qs(), n = ae(t);
  let r, o;
  e[0] !== s || e[1] !== t ? (r = () => {
    const i = n.current;
    i !== t && (n.current = t, s("threads.selectionChanged", {
      threadId: t,
      previousThreadId: i
    }));
  }, o = [t, s], e[0] = s, e[1] = t, e[2] = r, e[3] = o) : (r = e[2], o = e[3]), ee(r, o);
}, ef = (t) => {
  const e = S(6), { runtime: s, id: n, mainThreadIsRunning: r } = t;
  let o;
  e[0] !== n || e[1] !== s ? (o = s.getItemById(n), e[0] = n, e[1] = s, e[2] = o) : o = e[2];
  const i = o;
  let a;
  return e[3] !== r || e[4] !== i ? (a = Zh({
    runtime: i,
    mainThreadIsRunning: r
  }), e[3] = r, e[4] = i, e[5] = a) : a = e[5], Ye(a);
}, tf = ie(ef), sf = (t) => {
  const e = S(43), { runtime: s, __internal_assistantRuntime: n } = t, r = ft(s);
  Kh(r.mainThreadId);
  let o;
  e[0] !== s.main ? (o = Jh({ runtime: s.main }), e[0] = s.main, e[1] = o) : o = e[1];
  const i = Ut(o);
  let a;
  e[2] !== i.state || e[3] !== s || e[4] !== r.threadItems ? (a = Object.keys(r.threadItems).map((b) => De(b, tf({
    runtime: s,
    id: b,
    mainThreadIsRunning: i.state.isRunning
  }), [
    s,
    b,
    i.state.isRunning
  ])), e[2] = i.state, e[3] = s, e[4] = r.threadItems, e[5] = a) : a = e[5];
  const c = at(a), l = r.newThreadId ?? null;
  let u;
  e[6] !== i.state || e[7] !== r.archivedThreadIds || e[8] !== r.hasMore || e[9] !== r.isLoading || e[10] !== r.isLoadingMore || e[11] !== r.mainThreadId || e[12] !== r.threadIds || e[13] !== l || e[14] !== c.state ? (u = {
    mainThreadId: r.mainThreadId,
    newThreadId: l,
    isLoading: r.isLoading,
    isLoadingMore: r.isLoadingMore,
    hasMore: r.hasMore,
    threadIds: r.threadIds,
    archivedThreadIds: r.archivedThreadIds,
    threadItems: c.state,
    main: i.state
  }, e[6] = i.state, e[7] = r.archivedThreadIds, e[8] = r.hasMore, e[9] = r.isLoading, e[10] = r.isLoadingMore, e[11] = r.mainThreadId, e[12] = r.threadIds, e[13] = l, e[14] = c.state, e[15] = u) : u = e[15];
  const f = u;
  let h;
  e[16] !== f ? (h = () => f, e[16] = f, e[17] = h) : h = e[17];
  let d;
  e[18] !== i.methods ? (d = () => i.methods, e[18] = i.methods, e[19] = d) : d = e[19];
  let p;
  e[20] !== f || e[21] !== c ? (p = (b) => {
    if (b === "main") return c.get({ key: f.mainThreadId });
    if ("id" in b) return c.get({ key: b.id });
    const { index: y, archived: M } = b, P = M !== void 0 && M ? f.archivedThreadIds[y] : f.threadIds[y];
    return c.get({ key: P });
  }, e[20] = f, e[21] = c, e[22] = p) : p = e[22];
  let g, _, x, w, I, C;
  e[23] !== s ? (I = (b, y) => Be("switch", () => s.switchToThread(b, y)), C = () => Be("create", () => s.switchToNewThread()), g = () => s.getLoadThreadsPromise(), _ = () => s.reload(), x = () => s.reloadMainThread(), w = () => s.loadMore(), e[23] = s, e[24] = g, e[25] = _, e[26] = x, e[27] = w, e[28] = I, e[29] = C) : (g = e[24], _ = e[25], x = e[26], w = e[27], I = e[28], C = e[29]);
  let T;
  e[30] !== n ? (T = () => n, e[30] = n, e[31] = T) : T = e[31];
  let E;
  return e[32] !== g || e[33] !== _ || e[34] !== x || e[35] !== w || e[36] !== T || e[37] !== h || e[38] !== d || e[39] !== p || e[40] !== I || e[41] !== C ? (E = {
    getState: h,
    thread: d,
    item: p,
    switchToThread: I,
    switchToNewThread: C,
    getLoadThreadsPromise: g,
    reload: _,
    reloadMainThread: x,
    loadMore: w,
    __internal_getAssistantRuntime: T
  }, e[32] = g, e[33] = _, e[34] = x, e[35] = w, e[36] = T, e[37] = h, e[38] = d, e[39] = p, e[40] = I, e[41] = C, e[42] = E) : E = e[42], E;
}, nf = ie(sf), rf = (t, e) => {
  t.thread ??= Me({
    source: "threads",
    query: { type: "main" },
    get: (s) => s.threads.thread("main")
  }), t.threadListItem ??= Me({
    source: "threads",
    query: { type: "main" },
    get: (s) => s.threads.item("main")
  }), t.composer ??= Me({
    source: "thread",
    query: {},
    get: (s) => s.threads.thread("main").composer()
  }), !t.modelContext && e.modelContext.source === null && (t.modelContext = sa()), !t.suggestions && e.suggestions.source === null && (t.suggestions = Me({
    source: "thread",
    query: {},
    get: (s) => s.thread.suggestions()
  }));
}, Ia = (t) => {
  const e = S(7), s = ua();
  let n;
  e[0] !== s || e[1] !== t ? (n = () => t.registerModelContextProvider(s.current.modelContext()), e[0] = s, e[1] = t, e[2] = n) : n = e[2];
  let r;
  e[3] !== t ? (r = [t], e[3] = t, e[4] = r) : r = e[4], da("modelContext", n, r);
  let o;
  return e[5] !== t ? (o = nf({
    runtime: t.threads,
    __internal_assistantRuntime: t
  }), e[5] = t, e[6] = o) : o = e[6], Ye(o);
}, of = ie(Ia), af = (t, e) => {
  rf(t, e), !t.tools && e.tools.source === null && (t.tools = wh({})), !t.dataRenderers && e.dataRenderers.source === null && (t.dataRenderers = _d());
};
ia(Ia, af);
const cf = Le({}), uo = ({ effects: t }) => {
  "use no memo";
  return Ct(t), null;
}, Qe = ge(function(e, s) {
  "use no memo";
  const { config: n, children: r } = e, o = "extends" in e, i = "value" in e, a = Ir();
  if (fa) {
    if (o && i) throw new Error("AuiProvider: pass either `extends` or `value`, not both.");
    if (o && e.extends === void 0) throw new Error("AuiProvider: `extends` must be a client or null, not undefined.");
    if (o && !n) throw new Error("AuiProvider: `extends` requires a `config`.");
    if (i && n) throw new Error("AuiProvider: pass either `value` or `config`, not both.");
    if (!i && !n) throw new Error("AuiProvider: a `config` is required.");
    if (!o && !i && a !== xt) throw new Error("A parent AuiProvider exists — pass extends={aui} to inherit it or extends={null} to isolate.");
  }
  const c = o ? e.extends ?? xt : i ? e.value ?? xt : a, l = eh(), { client: u, effects: f } = mh(c, n ?? cf, l);
  return Uu(s, () => u, [u]), /* @__PURE__ */ m(In.Provider, {
    value: l,
    children: /* @__PURE__ */ N(xr.Provider, {
      value: u,
      children: [
        /* @__PURE__ */ m(uo, { effects: Bd(c) }),
        f && /* @__PURE__ */ m(uo, { effects: f }),
        r
      ]
    })
  });
}), lf = (t) => {
  const e = re(), s = ae(!1), n = s.current ? null : t(e);
  return k(() => s.current ? t(e) : n), () => (s.current = !0, t(e));
}, uf = Object.freeze({});
function Us(t) {
  const e = S(3), { getItemState: s, children: n } = t, r = lf(s);
  let o;
  return e[0] !== n || e[1] !== r ? (o = n(r), e[0] = n, e[1] = r, e[2] = o) : o = e[2], df(o);
}
const df = (t) => {
  const e = typeof t == "object" && t != null && "type" in t ? t : null, s = e?.type, n = e?.key, r = typeof e?.props == "object" && e.props != null && Object.entries(e.props).length === 0 ? uf : e?.props;
  return pe(() => e, [
    s,
    n,
    r
  ]) ?? t;
}, ho = (t, e) => {
  const s = S(11), n = re(), r = Qi(e);
  let o;
  s[0] !== t ? (o = Tr(t), s[0] = t, s[1] = o) : o = s[1];
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
  ], s[7] = n, s[8] = a, s[9] = i, s[10] = l) : l = s[10], ee(c, l);
}, hf = (t) => t._core?.RenderComponent, ff = ({ runtime: t, aui: e, config: s, children: n }) => {
  "use no memo";
  const r = hf(t), o = Le({
    ...s,
    threads: of(t)
  });
  return /* @__PURE__ */ N(Qe, {
    extends: e,
    config: o,
    children: [r && /* @__PURE__ */ m(r, {}), n]
  });
}, mf = ve((t) => {
  const e = S(5), { runtime: s, aui: n, config: r, children: o } = t, i = n === void 0 ? null : n;
  let a;
  return e[0] !== i || e[1] !== o || e[2] !== r || e[3] !== s ? (a = /* @__PURE__ */ m(ff, {
    runtime: s,
    aui: i,
    config: r,
    children: o
  }), e[0] = i, e[1] = o, e[2] = r, e[3] = s, e[4] = a) : a = e[4], a;
});
function me(t) {
  return t != null && typeof t == "object" && !Array.isArray(t);
}
function Es(t, e = 0) {
  return e > 100 ? !1 : t === null || typeof t == "string" || typeof t == "boolean" ? !0 : typeof t == "number" ? !Number.isNaN(t) && Number.isFinite(t) : Array.isArray(t) ? t.every((s) => Es(s, e + 1)) : me(t) ? Object.entries(t).every(([s, n]) => typeof s == "string" && Es(n, e + 1)) : !1;
}
const pf = 100, En = (t, e, s) => {
  if (t === e) return !0;
  if (s > pf || t == null || e == null) return !1;
  if (Array.isArray(t))
    return !Array.isArray(e) || t.length !== e.length ? !1 : t.every((o, i) => En(o, e[i], s + 1));
  if (Array.isArray(e) || !me(t) || !me(e)) return !1;
  const n = Object.keys(t), r = Object.keys(e);
  return n.length !== r.length ? !1 : n.every((o) => Object.hasOwn(e, o) && En(t[o], e[o], s + 1));
}, Rr = (t, e) => !Es(t) || !Es(e) ? !1 : En(t, e, 0);
function gf(t) {
  const e = t.metadata;
  if (!e || typeof e != "object") return;
  const s = e.custom;
  if (!s || typeof s != "object") return;
  const n = s.interactables;
  return Array.isArray(n) ? n : void 0;
}
function bf(t) {
  return `update_${t.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}
const fo = (t) => {
  if (!me(t)) return;
  const e = t.id;
  return typeof e == "string" || typeof e == "number" ? e : void 0;
};
function _f(t, e, s) {
  let n = Array.isArray(e.set) ? [...e.set] : [...t];
  if (e.clear === !0 && (n = []), Array.isArray(e.remove) && e.remove.length > 0) {
    const o = new Set(e.remove);
    n = n.filter((i) => {
      const a = fo(i);
      return a !== void 0 ? !o.has(a) : !o.has(i);
    });
  }
  const r = e.update;
  if (Array.isArray(r) && r.length > 0 && (n = n.map((o) => {
    const i = fo(o);
    if (i === void 0 || !me(o)) return o;
    const a = r.find((c) => me(c) && c.id === i);
    return a ? {
      ...o,
      ...a
    } : o;
  })), Array.isArray(e.add) && e.add.length > 0) {
    const o = s ? e.add.map((i) => {
      if (!me(i) || i.id !== void 0) return i;
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
function Zs(t, e, s) {
  if (!me(t) || !me(e)) return e;
  const n = me(s?.arrayBaseline) ? s.arrayBaseline : t, r = { ...t };
  for (const [o, i] of Object.entries(e)) {
    const a = n[o];
    Array.isArray(a) && me(i) ? r[o] = _f(a, i, s?.idFactory && (s.idKeyedFields === void 0 || s.idKeyedFields.has(o)) ? () => s.idFactory?.(o) : void 0) : r[o] = i;
  }
  return r;
}
function vf(t, e) {
  if (!me(t) || !me(e)) return;
  for (const r of Object.keys(t)) if (!(r in e)) return;
  const s = {};
  for (const [r, o] of Object.entries(e)) (!(r in t) || !Rr(t[r], o)) && (s[r] = o);
  const n = Object.keys(s).length;
  if (!(n === 0 || n === Object.keys(e).length))
    return s;
}
const yf = (t) => {
  if (!t || typeof t != "object") return;
  const e = t;
  return e.type === "tool-call" ? e : void 0;
}, wf = (t, e) => {
  if (!t.args || typeof t.args != "object") return !1;
  const s = me(t.result) ? t.result : void 0;
  if (s?.success === !1) return !1;
  if (typeof s?.id == "string") return s.id === e;
  const n = t.args.id;
  return n === e || n === void 0;
}, Sf = (t) => {
  const e = me(t) ? t.addedItemIds : void 0;
  if (!me(e)) return;
  const s = /* @__PURE__ */ new Map();
  for (const [n, r] of Object.entries(e)) {
    if (!Array.isArray(r)) continue;
    const o = r.filter((i) => typeof i == "string");
    o.length > 0 && s.set(n, o);
  }
  if (s.size !== 0)
    return (n) => s.get(n)?.shift();
}, mo = /* @__PURE__ */ new WeakMap();
function xf(t, e, s) {
  let n = mo.get(t);
  n || (n = /* @__PURE__ */ new Map(), mo.set(t, n));
  let r = n.get(s);
  r || (r = /* @__PURE__ */ new Map(), n.set(s, r));
  const o = r.get(e);
  if (o) return o;
  const i = bf(s), a = [], c = () => a[a.length - 1];
  for (const l of t) {
    if (l.role === "user") {
      const u = gf(l)?.find((f) => f.id === e);
      if (!u) continue;
      if (u.partial) {
        const f = c();
        f && a.push({
          state: Zs(f.state, u.state),
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
        const f = yf(u);
        if (f) {
          if (f.toolCallId === e && f.toolName === s)
            f.args && typeof f.args == "object" && a.push({
              state: f.args,
              origin: "create",
              toolCallId: e
            });
          else if (f.toolName === i && wf(f, e)) {
            const h = c();
            if (h) {
              const { id: d, ...p } = f.args, g = Sf(f.result);
              a.push({
                state: g ? Zs(h.state, p, { idFactory: g }) : Zs(h.state, p),
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
function If(t, e, s) {
  const n = xf(t, e, s), r = n[n.length - 1];
  return r ? { state: r.state } : void 0;
}
function Tf(t, e) {
  if (!t) return;
  const { interactables: s, ...n } = t, r = { ...n };
  if (Array.isArray(s)) {
    const o = [];
    for (const i of s) {
      const a = If(e, i.id, i.name);
      if (!a) {
        o.push({
          id: i.id,
          name: i.name,
          state: i.state
        });
        continue;
      }
      if (Rr(i.state, a.state)) continue;
      const c = vf(a.state, i.state);
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
async function* Cf() {
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
function Ks(t) {
  return t[Symbol.asyncIterator] ??= Cf, t;
}
const Ef = /[0-9a-fA-F]/;
function Rf(t) {
  const e = ["ROOT"];
  let s = -1, n = null, r = 0;
  const o = [];
  let i;
  function a() {
    i !== void 0 && (o.push(JSON.parse(`"${i}"`)), i = void 0);
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
        s = d, e.pop(), i = o.pop();
    }
  }
  function u(h, d) {
    switch (h) {
      case ",":
        e.pop(), e.push("INSIDE_ARRAY_AFTER_COMMA"), i = (Number(i) + 1).toString();
        break;
      case "]":
        s = d, e.pop(), i = o.pop();
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
            e.pop(), e.push("INSIDE_OBJECT_KEY"), i = "";
            break;
          case "}":
            s = h, e.pop(), i = o.pop();
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
        c(d, h, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      case "INSIDE_OBJECT_AFTER_VALUE":
        l(d, h);
        break;
      case "INSIDE_STRING":
        switch (d) {
          case '"':
            e.pop(), s = h, i = o.pop();
            break;
          case "\\":
            e.push("INSIDE_STRING_ESCAPE");
            break;
          default:
            s = h;
        }
        break;
      case "INSIDE_ARRAY_START":
        d === "]" ? (s = h, e.pop(), i = o.pop()) : (i = "0", c(d, h, "INSIDE_ARRAY_AFTER_VALUE"));
        break;
      case "INSIDE_ARRAY_AFTER_VALUE":
        switch (d) {
          case ",":
            e.pop(), e.push("INSIDE_ARRAY_AFTER_COMMA"), i = (Number(i) + 1).toString();
            break;
          case "]":
            s = h, e.pop(), i = o.pop();
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
        d === "u" ? (e.push("INSIDE_STRING_UNICODE_ESCAPE"), r = 0) : p === "INSIDE_STRING" && (s = h), p === "INSIDE_OBJECT_KEY" && (i += d);
        break;
      }
      case "INSIDE_STRING_UNICODE_ESCAPE": {
        const p = e[e.length - 2];
        if (!Ef.test(d)) {
          e.pop(), h--;
          break;
        }
        r++, r === 4 && (e.pop(), p === "INSIDE_STRING" && (s = h)), p === "INSIDE_OBJECT_KEY" && (i += d);
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
            e.pop(), i = o.pop(), e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && u(d, h), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && l(d, h);
            break;
          case "}":
            e.pop(), i = o.pop(), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && l(d, h);
            break;
          case "]":
            e.pop(), i = o.pop(), e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && u(d, h);
            break;
          default:
            e.pop(), i = o.pop();
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
  return [f, o];
}
var Ke = { exports: {} }, po;
function Af() {
  if (po) return Ke.exports;
  po = 1;
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
          const g = d[p];
          g && typeof g == "object" && f.push(g);
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
  return Ke.exports = o, Ke.exports.default = o, Ke.exports.parse = o, Ke.exports.safeParse = i, Ke.exports.scan = r, Ke.exports;
}
var Mf = Af();
const Rn = /* @__PURE__ */ ul(Mf), vs = /* @__PURE__ */ Symbol("aui.parse-partial-json-object.meta"), Df = (t) => t?.[vs], An = (t) => {
  if (t.length === 0) return { [vs]: {
    state: "partial",
    partialPath: []
  } };
  try {
    const e = Rn.parse(t);
    if (typeof e != "object" || e === null) throw new Error("argsText is expected to be an object");
    return e[vs] = {
      state: "complete",
      partialPath: []
    }, e;
  } catch {
    try {
      const [e, s] = Rf(t), n = Rn.parse(e);
      if (typeof n != "object" || n === null) throw new Error("argsText is expected to be an object");
      return n[vs] = {
        state: "partial",
        partialPath: s
      }, n;
    } catch {
      return;
    }
  }
}, Ta = (t, e, s) => {
  if (typeof t != "object" || t === null) return e.state;
  if (e.state === "complete") return "complete";
  if (s.length === 0) return e.state;
  const [n, ...r] = s;
  if (!Object.hasOwn(t, n)) return "partial";
  const [o, ...i] = e.partialPath;
  if (n !== o) return "complete";
  const a = t[n];
  return Ta(a, {
    state: "partial",
    partialPath: i
  }, r);
}, Ht = (t, e) => {
  const s = Df(t);
  if (!s) throw new Error("unable to determine object state");
  return Ta(t, s, e.map(String));
};
let Ca = (t, e = 21) => (s = e) => {
  let n = "", r = s | 0;
  for (; r-- > 0; )
    n += t[Math.random() * t.length | 0];
  return n;
};
const kf = Ca("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7), Ar = () => {
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
}, Pf = () => {
  const t = [];
  let e = !1, s = !1, n = !1, r, o, i = 0, a, c;
  const l = () => (o = void 0, c ??= Promise.all(t.splice(0).map(async (g) => {
    try {
      await g.reader.cancel().catch(() => {
      }), await g.pipeTask;
    } finally {
      g.reader.releaseLock();
    }
  })).then(() => {
  }), c), u = (g) => {
    s || n || (n = !0, console.error(g), l(), r.error(g), a?.reject(g), a = void 0);
  }, f = (g) => {
    g.promise || (g.promise = g.reader.read().then(({ done: _, value: x }) => {
      g.promise = void 0, !(s || n) && (_ ? (t.splice(t.indexOf(g), 1), g.reader.releaseLock(), e && t.length === 0 && i === 0 && r.close()) : r.enqueue(x), a?.resolve(), a = void 0);
    }).catch(u));
  }, h = new ReadableStream({
    start(g) {
      r = g;
    },
    pull() {
      return a = Ar(), t.forEach((g) => {
        f(g);
      }), a.promise;
    },
    async cancel() {
      s = !0;
      const g = l();
      a?.resolve(), a = void 0, await g;
    }
  }), d = (g) => {
    if (t.length > 0 && (o = void 0), !o) {
      const _ = [];
      o = _, i++, Promise.resolve().then(() => {
        if (i--, o === _ && (o = void 0), !(s || n)) {
          for (const x of _) r.enqueue(x);
          e && t.length === 0 && i === 0 && r.close(), a?.resolve(), a = void 0;
        }
      }).catch(u);
    }
    o.push(g);
  };
  return {
    readable: h,
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
      e || s || n || (e = !0, t.length === 0 && i === 0 && r.close());
    },
    addStream: (g, _) => {
      const x = _?.catch(() => {
      });
      if (s || n) {
        g.cancel().catch(() => {
        });
        return;
      }
      if (e)
        throw g.cancel().catch(() => {
        }), new Error("Cannot add streams after the run callback has settled.");
      o = void 0;
      const w = {
        reader: g.getReader(),
        pipeTask: x
      };
      t.push(w), f(w);
    },
    enqueue(g) {
      if (!(s || n)) {
        if (e) throw new Error("Cannot add streams after the run callback has settled.");
        d(g);
      }
    }
  };
}, Ea = (t, e) => new ReadableStream({
  start(s) {
    return t.start?.(e(s));
  },
  pull(s) {
    return t.pull?.(e(s));
  },
  cancel(s) {
    return t.cancel?.(s);
  }
}), Ra = (t, e) => {
  let s;
  return [Ea({
    start(n) {
      s = n;
    },
    cancel(n) {
      return e?.(s, n);
    }
  }, t), s];
}, Aa = (t) => t instanceof TypeError, Re = (t, e, s) => {
  try {
    t.enqueue(e);
  } catch (n) {
    if (!Aa(n)) throw n;
    s?.(n);
  }
}, Ma = (t) => {
  try {
    t.close();
  } catch (e) {
    if (!Aa(e)) throw e;
  }
};
var Da = class {
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
    if (this._isClosed) {
      if (this._strict) throw new TypeError("Cannot append to a closed TextStreamController");
      return Re(this._controller, e, this._warnDroppedAfterClose), this;
    }
    return Re(this._controller, e), this;
  }
  _warnDroppedAfterClose = (t) => {
    this._warnedDropped || (this._warnedDropped = !0, console.error(`Dropped text delta for closed stream: ${String(t)}`));
  };
  close() {
    this._isClosed || (this._isClosed = !0, Re(this._controller, {
      type: "part-finish",
      path: []
    }), Ma(this._controller));
  }
};
const Of = (t, e = {}) => Ea(t, (s) => new Da(s, e)), go = (t = {}) => Ra((e) => new Da(e, t)), bo = /* @__PURE__ */ Symbol.for("aui.tool-response"), Mn = "<no result>";
var He = class Dn {
  get [bo]() {
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
    this.result = s === void 0 ? Mn : s, this.isError = e.isError ?? !1, e.isPreliminary && (this.isPreliminary = !0), e.modelContent !== void 0 && (this.modelContent = e.modelContent), e.messages !== void 0 && (this.messages = e.messages);
  }
  static [Symbol.hasInstance](e) {
    return typeof e == "object" && e !== null && bo in e;
  }
  /**
  * Converts a plain tool return value into a {@link ToolResponse}.
  *
  * Existing `ToolResponse` instances are returned unchanged. `undefined`
  * becomes the string `"<no result>"` so downstream protocol chunks always
  * carry a concrete result.
  */
  static toResponse(e) {
    return e instanceof Dn ? e : new Dn({ result: e === void 0 ? Mn : e });
  }
}, Nf = class {
  _isClosed = !1;
  _mergeTask;
  _controller;
  constructor(t, e = {}) {
    this._controller = t;
    const s = Of({ start: (r) => {
      this._argsTextController = r;
    } }, e);
    let n = !1;
    this._mergeTask = s.pipeTo(new WritableStream({ write: (r) => {
      switch (r.type) {
        case "text-delta":
          n = !0, Re(this._controller, r);
          break;
        case "part-finish":
          n || Re(this._controller, {
            type: "text-delta",
            textDelta: "{}",
            path: []
          }), Re(this._controller, {
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
    Re(this._controller, {
      type: "result",
      path: [],
      ...t.artifact !== void 0 ? { artifact: t.artifact } : {},
      result: e === void 0 ? Mn : e,
      isError: t.isError ?? !1,
      ...t.isPreliminary ? { isPreliminary: !0 } : {},
      ...t.modelContent !== void 0 ? { modelContent: t.modelContent } : {},
      ...t.messages !== void 0 ? { messages: t.messages } : {}
    }), t.isPreliminary ? this._argsTextController.close() : await this.close();
  }
  async close() {
    this._isClosed || (this._isClosed = !0, this._argsTextController.close(), await this._mergeTask, Re(this._controller, {
      type: "part-finish",
      path: []
    }), Ma(this._controller));
  }
};
const $f = (t = {}) => Ra((e) => new Nf(e, t));
var ka = class {
  value = -1;
  up() {
    return ++this.value;
  }
}, Bf = class extends TransformStream {
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
var Ff = class extends TransformStream {
  constructor(t) {
    const e = new ka(), s = /* @__PURE__ */ new Map();
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
}, Lf = class Pa {
  _state;
  _parentId;
  constructor(e, s = {}) {
    this._state = e || {
      strict: s.strict ?? !0,
      merger: Pf(),
      contentCounter: new ka()
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
  _addTransformedStream(e, s) {
    if (e.locked) throw new TypeError("Cannot merge a stream that is already locked to a reader.");
    const n = e.pipeTo(s.writable).catch(async (r) => {
      throw await s.writable.abort(r).catch(() => {
      }), r;
    });
    this._state.merger.addStream(s.readable, n);
  }
  _addPart(e, s) {
    this._state.append && (this._state.append.controller.close(), this._state.append = void 0), this.enqueue({
      type: "part-start",
      part: e,
      path: []
    }), this._addTransformedStream(s, new Bf(this._state.contentCounter.value));
  }
  merge(e) {
    this._addTransformedStream(e, new Ff(this._state.contentCounter));
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
    const [e, s] = go({ strict: this._state.strict });
    return this._addPart(this._withParentIdOption({ type: "text" }), e), s;
  }
  addReasoningPart(e) {
    const [s, n] = go({ strict: this._state.strict });
    return this._addPart(this._withParentIdOption({
      type: "reasoning",
      ...e
    }), s), n;
  }
  addToolCallPart(e) {
    const s = typeof e == "string" ? { toolName: e } : e, n = s.toolName, r = s.toolCallId ?? kf(), [o, i] = $f({ strict: this._state.strict });
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
    const s = new Pa(this._state);
    return s._parentId = e, s;
  }
  close() {
    this._state.append?.controller?.close(), this._state.merger.seal(), this._state.closeSubscriber?.();
  }
};
function Vf(t, e = {}) {
  const s = new Lf(void 0, e);
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
function qf(t = {}) {
  const { resolve: e, promise: s } = Ar();
  let n;
  return [Vf((r) => (n = r, n.__internal_subscribeToClose(e), s), t), n];
}
var Oa = class extends TransformStream {
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
const jf = We(null), Uf = () => Bs(jf), ct = Ca("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);
function Hf(t) {
  const e = t.match(/^data:([^;,]+)(?:;[^;,]+)*;base64,(.*)$/i);
  return e ? {
    mimeType: e[1].toLowerCase(),
    data: e[2]
  } : null;
}
const en = (t, e) => {
  if (t.startsWith("data-"))
    return {
      type: "data",
      name: t.substring(5),
      data: e
    };
}, Rs = (t, e, s) => {
  const { role: n, id: r, createdAt: o, attachments: i, status: a, metadata: c } = t, l = {
    id: r ?? e,
    createdAt: o ?? /* @__PURE__ */ new Date()
  }, u = typeof t.content == "string" ? [{
    type: "text",
    text: t.content
  }] : t.content, f = ({ image: h, ...d }) => typeof h != "string" ? null : Hf(h)?.mimeType.startsWith("image/") ? {
    ...d,
    image: h
  } : /^(https:\/\/|blob:)/i.test(h) ? {
    ...d,
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
              const { parentId: p, messages: g, ..._ } = h, x = {
                ..._,
                toolCallId: h.toolCallId ?? `tool-${ct()}`,
                ...p !== void 0 && { parentId: p },
                ...g !== void 0 && { messages: g }
              };
              return h.args ? {
                ...x,
                args: h.args,
                argsText: h.argsText ?? JSON.stringify(h.args)
              } : {
                ...x,
                args: An(h.argsText ?? "") ?? {},
                argsText: h.argsText ?? ""
              };
            }
            default: {
              const p = en(d, h.data);
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
              const p = en(d, h.data);
              if (p) return p;
              throw new Error(`Unsupported user message part type: ${d}`);
            }
          }
        }),
        attachments: (i ?? []).map((h) => ({
          ...h,
          content: h.content.map((d) => en(d.type, d.data) ?? d)
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
}, lt = /* @__PURE__ */ Symbol("innerMessage"), tn = /* @__PURE__ */ Symbol("innerMessages"), zf = [], Gf = (t, e) => {
  lt in t || (t[lt] = e);
}, Wf = (t) => {
  const e = "messages" in t ? t.messages : t, s = e[tn] || e[lt];
  return s ? Array.isArray(s) ? s : (e[tn] = [s], e[tn]) : zf;
}, At = /* @__PURE__ */ Symbol("autoStatus"), Yf = Object.freeze(Object.assign({ type: "running" }, { [At]: !0 })), Qf = Object.freeze(Object.assign({
  type: "complete",
  reason: "unknown"
}, { [At]: !0 }));
Object.freeze(Object.assign({
  type: "requires-action",
  reason: "tool-calls"
}, { [At]: !0 }));
Object.freeze(Object.assign({
  type: "requires-action",
  reason: "interrupt"
}, { [At]: !0 }));
const Jf = (t) => t[At] === !0, kn = (t, e, s, n, r) => t && r ? Object.assign({
  type: "incomplete",
  reason: "error",
  error: r
}, { [At]: !0 }) : t && e ? Yf : Qf;
var _o = class {
  cache = /* @__PURE__ */ new WeakMap();
  convertMessages(t, e) {
    return t.map((s, n) => {
      const r = e(this.cache.get(s), s, n);
      return this.cache.set(s, r), r;
    });
  }
}, Xf = class extends TransformStream {
  constructor(t) {
    super();
    const e = t(super.readable);
    Object.defineProperty(this, "readable", {
      value: e,
      writable: !1
    });
  }
};
function Zf(t, e, s) {
  try {
    const n = t();
    if (typeof n == "object" && n !== null && "then" in n) return n.then(e, s);
    e(n);
  } catch (n) {
    s(n);
  }
}
function zt(t, e) {
  let s = t;
  for (const n of e) {
    if (s == null || !Object.hasOwn(s, n)) return;
    s = s[n];
  }
  return s;
}
var Kf = class {
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
        if (Ht(t, this.fieldPath) === "complete") {
          const e = zt(t, this.fieldPath);
          e !== void 0 && (this.resolve(e), this.dispose());
        }
      } catch (e) {
        this.reject(e), this.dispose();
      }
  }
  end(t) {
    if (!this.disposed)
      try {
        const e = zt(t, this.fieldPath);
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
}, em = class {
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
        const e = zt(t, this.fieldPath);
        e !== void 0 && this.controller.enqueue(e), Ht(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
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
}, tm = class {
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
        const e = zt(t, this.fieldPath);
        if (e !== void 0 && typeof e == "string") {
          const s = e.substring(this.lastValue?.length || 0);
          this.lastValue = e, this.controller.enqueue(s);
        }
        Ht(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
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
}, sm = class {
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
        const e = zt(t, this.fieldPath);
        if (!Array.isArray(e)) return;
        for (; this.nextIndex < e.length; this.nextIndex++) {
          const s = [...this.fieldPath, this.nextIndex];
          if (Ht(t, s) !== "complete") break;
          this.controller.enqueue(e[this.nextIndex]);
        }
        Ht(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
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
}, nm = class {
  argTextDeltas;
  handles = /* @__PURE__ */ new Set();
  accumulatedText = "";
  parsedTextLength = -1;
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
        this.accumulatedText += e, this.handles.size !== 0 && this.parseCurrentArgs() && this.updateHandles();
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
  parseCurrentArgs() {
    if (this.parsedTextLength === this.accumulatedText.length) return !1;
    const t = An(this.accumulatedText);
    return this.parsedTextLength = this.accumulatedText.length, t === void 0 ? (this.args ??= An(""), !1) : (this.args = t, !0);
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
      const n = new Kf(e, s, t);
      this.activateHandle(n);
    });
  }
  streamValues(...t) {
    const e = t;
    let s;
    const n = new ReadableStream({
      start: (r) => {
        s = new em(r, e), this.activateHandle(s);
      },
      cancel: () => {
        s && (s.dispose(), this.handles.delete(s));
      }
    });
    return Ks(n);
  }
  streamText(...t) {
    const e = t;
    let s;
    const n = new ReadableStream({
      start: (r) => {
        s = new tm(r, e), this.activateHandle(s);
      },
      cancel: () => {
        s && (s.dispose(), this.handles.delete(s));
      }
    });
    return Ks(n);
  }
  forEach(...t) {
    const e = t;
    let s;
    const n = new ReadableStream({
      start: (r) => {
        s = new sm(r, e), this.activateHandle(s);
      },
      cancel: () => {
        s && (s.dispose(), this.handles.delete(s));
      }
    });
    return Ks(n);
  }
}, rm = class {
  promise;
  constructor(t) {
    this.promise = t;
  }
  get() {
    return this.promise;
  }
}, om = class {
  args;
  response;
  writable;
  resolve;
  argsText = "";
  constructor() {
    const t = new TransformStream();
    this.writable = t.writable, this.args = new nm(t.readable);
    const { promise: e, resolve: s } = Ar();
    this.resolve = s, this.response = new rm(e);
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
const im = /* @__PURE__ */ Symbol.for("assistant-stream.tool-execution-id"), sn = (t, e, s, n, r) => {
  try {
    const o = e?.(s, n, r);
    Promise.resolve(o).catch((i) => {
      console.error(`[assistant-stream] ${t} callback threw an error`, i);
    });
  } catch (o) {
    console.error(`[assistant-stream] ${t} callback threw an error`, o);
  }
}, vt = (t) => t.join(","), nn = (t, e) => {
  const s = { ...t };
  return Object.defineProperty(s, im, {
    value: e,
    enumerable: !0
  }), s;
};
var am = class extends Xf {
  constructor(t) {
    const e = t, s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    let i = 0;
    super((a) => {
      const c = new TransformStream({
        async transform(l, u) {
          const f = o.get(vt(l.path));
          switch ((l.type !== "part-finish" || l.meta.type !== "tool-call") && u.enqueue(f ? nn(l, f) : l), l.type) {
            case "part-start": {
              const h = i;
              if (i += 1, l.part.type === "tool-call") {
                const d = new om(), p = /* @__PURE__ */ Symbol();
                o.set(String(h), p), n.set(p, d), e.streamCall({
                  reader: d,
                  toolCallId: l.part.toolCallId,
                  toolName: l.part.toolName,
                  executionId: p
                });
              }
              break;
            }
            case "text-delta":
              if (l.meta.type === "tool-call") {
                const h = o.get(vt(l.path)), d = h ? n.get(h) : void 0;
                if (!d) throw new Error("No controller found for tool call");
                await d.appendArgsTextDelta(l.textDelta);
              }
              break;
            case "result": {
              if (l.meta.type !== "tool-call") break;
              const h = o.get(vt(l.path)), d = h ? n.get(h) : void 0;
              if (!d) throw new Error("No controller found for tool call");
              if (r.add(h), l.isPreliminary) break;
              d.setResponse(new He({
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
              const { toolCallId: h, toolName: d } = l.meta, p = o.get(vt(l.path)), g = p ? n.get(p) : void 0;
              if (!g) throw new Error("No controller found for tool call");
              if (await g.finishArgsText(), r.has(p)) break;
              let _ = !1;
              const x = Zf(() => {
                let w;
                try {
                  w = Rn.parse(g.argsText);
                } catch (C) {
                  throw new Error(`Function parameter parsing failed. ${JSON.stringify(C.message)}`);
                }
                const I = e.execute({
                  toolCallId: h,
                  toolName: d,
                  args: w,
                  executionId: p
                });
                return I !== void 0 && (_ = !0, sn("onExecutionStart", e.onExecutionStart, h, d, p)), I;
              }, (w) => {
                if (_ && sn("onExecutionEnd", e.onExecutionEnd, h, d, p), w === void 0) return;
                const I = new He({
                  artifact: w.artifact,
                  result: w.result,
                  isError: w.isError,
                  messages: w.messages,
                  modelContent: w.modelContent
                });
                g.setResponse(I), Re(u, nn({
                  type: "result",
                  path: l.path,
                  ...I
                }, p));
              }, (w) => {
                _ && sn("onExecutionEnd", e.onExecutionEnd, h, d, p);
                const I = new He({
                  result: String(w),
                  isError: !0
                });
                g.setResponse(I), Re(u, nn({
                  type: "result",
                  path: l.path,
                  ...I
                }, p));
              });
              x && s.set(p, x);
              break;
            }
            case "part-finish": {
              if (l.meta.type !== "tool-call") break;
              const h = o.get(vt(l.path)), d = h ? s.get(h) : void 0, p = () => {
                h && (s.delete(h), n.delete(h), r.delete(h), o.delete(vt(l.path)));
              };
              d ? d.then(() => {
                p(), Re(u, l);
              }) : (p(), u.enqueue(l));
            }
          }
        },
        async flush() {
          await Promise.all(s.values());
        }
      });
      return a.pipeThrough(new Oa()).pipeThrough(c);
    });
  }
};
const Na = /* @__PURE__ */ Symbol.for("assistant-stream.tool-execution-id"), As = /* @__PURE__ */ Symbol("assistant-stream.tool-aborted"), cm = (t) => typeof t == "object" && t !== null && "~standard" in t && t["~standard"].version === 1, lm = (t) => typeof t?.then == "function", vo = async (t, e, s = !1) => {
  let n;
  const r = new Promise((o) => {
    n = () => {
      s ? queueMicrotask(() => queueMicrotask(() => o(As))) : o(As);
    }, e.aborted ? n() : e.addEventListener("abort", n, { once: !0 });
  });
  try {
    return await Promise.race([t, r]);
  } finally {
    e.removeEventListener("abort", n);
  }
}, os = () => new He({
  result: "Tool execution was cancelled.",
  isError: !0
});
function um(t, e, s, n) {
  const r = t?.[s.toolName];
  return r?.execute ? (async (i) => {
    if (e.aborted) return os();
    let a = i, c = s.args;
    if (cm(r.parameters)) {
      const f = r.parameters["~standard"].validate(s.args), h = lm(f) ? await vo(f, e) : f;
      if (h === As) return os();
      h.issues ? a = r.experimental_onSchemaValidationError ?? (() => {
        throw new Error(`Function parameter validation failed. ${JSON.stringify(h.issues)}`);
      }) : c = h.value;
    }
    if (e.aborted) return os();
    const l = (async () => {
      const f = {
        toolCallId: s.toolCallId,
        abortSignal: e,
        human: (p) => n(s.toolCallId, p, s.executionId),
        [Na]: s.executionId
      }, h = await a(c, f), d = He.toResponse(h);
      if (r.toModelOutput && !d.isError && d.modelContent === void 0) try {
        const p = await r.toModelOutput({
          toolCallId: s.toolCallId,
          input: c,
          output: d.result
        });
        return new He({
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
    })(), u = await vo(l, e, !0);
    return u === As ? os() : u;
  })(r.execute) : void 0;
}
function dm(t, e, s, n, r) {
  const o = {
    toolCallId: n.toolCallId,
    abortSignal: e,
    human: (i) => r(n.toolCallId, i, n.executionId),
    [Na]: n.executionId
  };
  t?.[n.toolName]?.streamCall?.(s, o);
}
function hm(t, e, s, n) {
  const r = typeof t == "function" ? t : () => t, o = typeof e == "function" ? e : () => e, i = n, a = s, c = {
    execute: (l) => um(r(), o(), l, a),
    streamCall: ({ reader: l, ...u }) => dm(r(), o(), l, u, a),
    onExecutionStart: i?.onExecutionStart,
    onExecutionEnd: i?.onExecutionEnd
  };
  return new am(c);
}
const $a = (t) => {
  const e = S(6), { index: s, children: n } = t, r = re();
  let o;
  e[0] !== s ? (o = Le({ attachment: Me({
    source: "message",
    query: {
      type: "index",
      index: s
    },
    get: (c) => c.message.attachment({ index: s })
  }) }), e[0] = s, e[1] = o) : o = e[1];
  const i = o;
  let a;
  return e[2] !== r || e[3] !== n || e[4] !== i ? (a = /* @__PURE__ */ m(Qe, {
    extends: r,
    config: i,
    children: n
  }), e[2] = r, e[3] = n, e[4] = i, e[5] = a) : a = e[5], a;
}, Ba = (t) => {
  const e = S(6), { index: s, children: n } = t, r = re();
  let o;
  e[0] !== s ? (o = Le({
    message: Me({
      source: "thread",
      query: {
        type: "index",
        index: s
      },
      get: (c) => c.thread.message({ index: s })
    }),
    composer: Me({
      source: "message",
      query: {},
      get: (c) => c.thread.message({ index: s }).composer()
    })
  }), e[0] = s, e[1] = o) : o = e[1];
  const i = o;
  let a;
  return e[2] !== r || e[3] !== n || e[4] !== i ? (a = /* @__PURE__ */ m(Qe, {
    extends: r,
    config: i,
    children: n
  }), e[2] = r, e[3] = n, e[4] = i, e[5] = a) : a = e[5], a;
}, Mr = (t) => {
  const e = S(6), { index: s, children: n } = t, r = re();
  let o;
  e[0] !== s ? (o = Le({ part: Me({
    source: "message",
    query: {
      type: "index",
      index: s
    },
    get: (c) => c.message.part({ index: s })
  }) }), e[0] = s, e[1] = o) : o = e[1];
  const i = o;
  let a;
  return e[2] !== r || e[3] !== n || e[4] !== i ? (a = /* @__PURE__ */ m(Qe, {
    extends: r,
    config: i,
    children: n
  }), e[2] = r, e[3] = n, e[4] = i, e[5] = a) : a = e[5], a;
}, fm = (t) => {
  const e = S(7), { text: s, isRunning: n } = t;
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
    addToolResult: pm,
    resumeToolCall: gm,
    respondToToolApproval: bm
  }, e[5] = i, e[6] = a) : a = e[6], a;
}, mm = ie(fm), Dr = (t) => {
  const e = S(7), { text: s, isRunning: n, children: r } = t, o = n === void 0 ? !1 : n, i = re();
  let a;
  e[0] !== o || e[1] !== s ? (a = Le({ part: mm({
    text: s,
    isRunning: o
  }) }), e[0] = o, e[1] = s, e[2] = a) : a = e[2];
  const c = a;
  let l;
  return e[3] !== i || e[4] !== r || e[5] !== c ? (l = /* @__PURE__ */ m(Qe, {
    extends: i,
    config: c,
    children: r
  }), e[3] = i, e[4] = r, e[5] = c, e[6] = l) : l = e[6], l;
};
function pm() {
  throw new Error("Not supported");
}
function gm() {
  throw new Error("Not supported");
}
function bm() {
  throw new Error("Not supported");
}
const Ue = Object.freeze({ type: "complete" }), Pn = Object.freeze({ type: "running" }), _m = Object.freeze({
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
}), vm = (t) => {
  const e = t.status;
  if (!e || typeof e != "object") return;
  const { type: s } = e;
  if (s === "running") return Pn;
  if (s === "complete") return Ue;
  if (s !== "incomplete") return;
  const { reason: n } = e;
  return _m[n === "cancelled" || n === "length" || n === "content-filter" || n === "other" || n === "error" ? n : "other"];
}, ym = (t, e, s) => {
  if (t.role !== "assistant") return Ue;
  if (s.type === "tool-call")
    return s.result === void 0 ? t.status : Ue;
  if (t.status.type === "running") {
    const r = vm(s);
    if (r) return r;
  }
  const n = e === Math.max(0, t.content.length - 1);
  return t.status.type === "requires-action" ? Ue : n ? t.status : Ue;
}, Fa = (t, e) => {
  if (e) {
    for (const n of e) if (t[n]?.status.type === "running") return Pn;
    const s = e.at(-1);
    return s === void 0 ? Ue : t[s]?.status ?? Ue;
  }
  for (const s of t) if (s?.status.type === "running") return Pn;
  return t.at(-1)?.status ?? Ue;
}, wm = (t) => {
  const e = S(11), { parts: s, getMessagePart: n } = t, [r, o] = ue(!0);
  let i;
  e[0] !== s ? (i = Fa(s), e[0] = s, e[1] = i) : i = e[1];
  const a = i;
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
    setCollapsed: o,
    part: n
  }, e[8] = n, e[9] = u, e[10] = f) : f = e[10], f;
}, Sm = ie(wm), xm = (t) => {
  const e = S(4), { startIndex: s, endIndex: n, children: r } = t, o = k(Im).slice(s, n + 1), i = re(), a = Le({ chainOfThought: Sm({
    parts: o,
    getMessagePart: (l) => {
      const { index: u } = l;
      if (u < 0 || u >= o.length) throw new Error(`ChainOfThought part index ${u} is out of bounds (0..${o.length - 1})`);
      return i.message.part({ index: s + u });
    }
  }) });
  let c;
  return e[0] !== r || e[1] !== a || e[2] !== i ? (c = /* @__PURE__ */ m(Qe, {
    extends: i,
    config: a,
    children: r
  }), e[0] = r, e[1] = a, e[2] = i, e[3] = c) : c = e[3], c;
};
function Im(t) {
  return t.message.parts;
}
const La = (t) => {
  const e = S(6), { index: s, children: n } = t, r = re();
  let o;
  e[0] !== s ? (o = Le({ suggestion: Me({
    source: "suggestions",
    query: { index: s },
    get: (c) => c.suggestions.suggestion({ index: s })
  }) }), e[0] = s, e[1] = o) : o = e[1];
  const i = o;
  let a;
  return e[2] !== r || e[3] !== n || e[4] !== i ? (a = /* @__PURE__ */ m(Qe, {
    extends: r,
    config: i,
    children: n
  }), e[2] = r, e[3] = n, e[4] = i, e[5] = a) : a = e[5], a;
}, Tm = /* @__PURE__ */ Symbol.for("assistant-ui.message-not-sent"), Va = (t) => typeof t == "object" && t !== null && Tm in t;
var qa = class {
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
}, ja = class extends qa {
  _composerApi;
  constructor(t, e) {
    super(t), this._composerApi = e;
  }
  remove() {
    const t = this._composerApi.getState();
    if (!t) throw new Error("Composer is not available");
    return t.removeAttachment(this.getState().id);
  }
}, Cm = class extends ja {
  get source() {
    return "thread-composer";
  }
}, Em = class extends ja {
  get source() {
    return "edit-composer";
  }
}, Rm = class extends qa {
  get source() {
    return "message";
  }
  remove() {
    throw new Error("Message attachments cannot be removed");
  }
};
const Ms = Object.freeze([]), Ua = Object.freeze({}), Am = (t) => Object.freeze({
  type: "thread",
  isEditing: t?.isEditing ?? !1,
  canCancel: t?.canCancel ?? !1,
  canSend: t?.canSend ?? !1,
  isEmpty: t?.isEmpty ?? !0,
  attachments: t?.attachments ?? Ms,
  text: t?.text ?? "",
  role: t?.role ?? "user",
  runConfig: t?.runConfig ?? Ua,
  attachmentAccept: t?.attachmentAccept ?? "",
  dictation: t?.dictation,
  quote: t?.quote,
  queue: t?.queue ?? Ms,
  value: t?.text ?? ""
}), Mm = (t) => Object.freeze({
  type: "edit",
  isEditing: t?.isEditing ?? !1,
  canCancel: t?.canCancel ?? !1,
  canSend: t?.canSend ?? !1,
  isEmpty: t?.isEmpty ?? !0,
  text: t?.text ?? "",
  role: t?.role ?? "user",
  attachments: t?.attachments ?? Ms,
  runConfig: t?.runConfig ?? Ua,
  attachmentAccept: t?.attachmentAccept ?? "",
  dictation: t?.dictation,
  quote: t?.quote,
  queue: t?.queue ?? Ms,
  parentId: t?.parentId ?? null,
  sourceId: t?.sourceId ?? null,
  value: t?.text ?? ""
});
var Ha = class {
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
    return s || (s = new ea({
      event: t,
      binding: this._core
    }), this._eventSubscriptionSubjects.set(t, s)), s.subscribe(e);
  }
}, Dm = class extends Ha {
  get path() {
    return this._core.path;
  }
  get type() {
    return "thread";
  }
  _getState;
  constructor(t) {
    const e = new wr({
      path: t.path,
      getState: () => Am(t.getState()),
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
    return new Cm(new Ae({
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
        } : ke;
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
}, km = class extends Ha {
  get path() {
    return this._core.path;
  }
  get type() {
    return "edit";
  }
  _getState;
  _beginEdit;
  constructor(t, e) {
    const s = new wr({
      path: t.path,
      getState: () => Mm(t.getState()),
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
    return new Em(new Ae({
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
        } : ke;
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
};
const Hs = (t) => t.content.filter((e) => e.type === "text").map((e) => e.text).join(`

`), yo = {
  "allow-once": !0,
  "allow-always": !0,
  "reject-once": !1,
  "reject-always": !1
}, Pm = (t, e) => {
  let s, n;
  if ("optionId" in e) {
    const r = t.options?.find((o) => o.id === e.optionId);
    if (!r) throw new Error(`Tool approval has no option with id "${e.optionId}"`);
    if ("approved" in e) s = e.approved;
    else {
      if (!Object.hasOwn(yo, r.kind)) throw new Error(`Tool approval option "${r.id}" has a custom kind "${r.kind}"; respond with an explicit approved value instead`);
      s = yo[r.kind];
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
var wo = class {
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
    const n = e.toolName, r = e.toolCallId, o = He.toResponse(t);
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
    this.threadApi.getState().respondToToolApproval(Pm(e.approval, t));
  }
  subscribe(t) {
    return this.contentBinding.subscribe(t);
  }
};
const So = (t, e) => {
  const s = t.content[e];
  if (!s) return ke;
  const n = ym(t, e, s);
  return Object.freeze({
    ...s,
    [lt]: s[lt],
    status: n
  });
};
var Om = class {
  get path() {
    return this._core.path;
  }
  _core;
  _threadBinding;
  constructor(t, e) {
    this._core = t, this._threadBinding = e, this.composer = new km(new Is({
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
    return Hs(this.getState());
  }
  subscribe(t) {
    return this._core.subscribe(t);
  }
  getMessagePartByIndex(t) {
    if (t < 0) throw new Error("Message part index must be >= 0");
    return new wo(new Ae({
      path: {
        ...this.path,
        ref: `${this.path.ref}.content[${t}]`,
        messagePartSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => So(this.getState(), t),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core, this._threadBinding);
  }
  getMessagePartByToolCallId(t) {
    return new wo(new Ae({
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
        return s === -1 ? ke : So(e, s);
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core, this._threadBinding);
  }
  getAttachmentByIndex(t) {
    return new Rm(new Ae({
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
        } : ke;
      },
      subscribe: (e) => this._core.subscribe(e)
    }));
  }
};
const Nm = (t) => ({
  parentId: t.parentId ?? null,
  sourceId: t.sourceId ?? null,
  runConfig: t.runConfig ?? {},
  ...t.stream ? { stream: t.stream } : {}
}), $m = (t) => ({
  parentId: t.parentId ?? null,
  sourceId: t.sourceId ?? null,
  runConfig: t.runConfig ?? {}
}), Bm = (t, e) => typeof e == "string" ? {
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
}, za = (t) => {
  if (t.isRunning !== void 0) return t.isRunning;
  const e = t.messages.at(-1);
  return e?.role === "assistant" && e.status.type === "running";
}, Fm = (t, e) => Object.freeze({
  threadId: e.id,
  metadata: e,
  capabilities: t.capabilities,
  isDisabled: t.isDisabled,
  isLoading: t.isLoading,
  isRunning: za(t),
  messages: t.messages,
  state: t.state,
  suggestions: t.suggestions,
  extras: t.extras,
  speech: t.speech,
  voice: t.voice
});
var Lm = class {
  get path() {
    return this._threadBinding.path;
  }
  get __internal_threadBinding() {
    return this._threadBinding;
  }
  _threadBinding;
  _stateBinding;
  constructor(t, e) {
    const s = new Ae({
      path: t.path,
      getState: () => Fm(t.getState(), e.getState()),
      subscribe: (n) => {
        const r = t.subscribe(n), o = e.subscribe(n);
        return () => {
          r(), o();
        };
      }
    });
    this._stateBinding = s, this._threadBinding = {
      path: t.path,
      getState: () => t.getState(),
      getStateState: () => s.getState(),
      outerSubscribe: (n) => t.outerSubscribe(n),
      subscribe: (n) => t.subscribe(n)
    }, this.composer = new Dm(new Is({
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
    const e = this._threadBinding.getState().append(Bm(this._threadBinding.getState().messages, t));
    Promise.resolve(e).catch((s) => {
      if (!Va(s)) throw s;
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
    return this._threadBinding.getState().startRun($m(t));
  }
  resumeRun(t) {
    return this._threadBinding.getState().resumeRun(Nm(t));
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
    return new Om(new Ae({
      path: t,
      getState: () => {
        const { message: s, parentId: n, index: r } = e() ?? {}, { messages: o, speech: i } = this._threadBinding.getState();
        if (!s || n === void 0 || r === void 0) return ke;
        const a = this._threadBinding.getState().getBranches(s.id);
        return {
          ...s,
          [lt]: s[lt],
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
    return s || (s = new ea({
      event: t,
      binding: this._threadBinding
    }), this._eventSubscriptionSubjects.set(t, s)), s.subscribe(e);
  }
}, is = class {
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
      s === o && n === i || (s = o, n = i, !(t === "switchedTo" && !o) && (t === "switchedAway" && o || St([e], {}, `Thread list item "${t}"`)));
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
const rn = Promise.resolve(), Vm = (t) => ({
  mainThreadId: t.mainThreadId,
  newThreadId: t.newThreadId,
  threadIds: t.threadIds,
  archivedThreadIds: t.archivedThreadIds,
  isLoading: t.isLoading,
  isLoadingMore: t.isLoadingMore ?? !1,
  hasMore: t.hasMore ?? !1,
  threadItems: t.threadItems
}), as = (t, e) => {
  if (e === void 0) return ke;
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
  } : ke;
};
var qm = class {
  _getState;
  _stateBinding;
  _core;
  _runtimeFactory;
  constructor(t, e = Lm) {
    this._core = t, this._runtimeFactory = e;
    const s = new wr({
      path: {},
      getState: () => Vm(t),
      subscribe: (n) => t.subscribe(n)
    });
    this._getState = s.getState.bind(s), this._stateBinding = s, this._mainThreadListItemRuntime = new is(new Ae({
      path: {
        ref: "threadItems[main]",
        threadSelector: { type: "main" }
      },
      getState: () => as(this._core, this._core.mainThreadId),
      subscribe: (n) => this._core.subscribe(n)
    }), this._core), this.main = new e(new Is({
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
    return this._core.reload?.() ?? rn;
  }
  reloadMainThread() {
    return this._core.reloadMainThread?.() ?? rn;
  }
  loadMore() {
    return this._core.loadMore?.() ?? rn;
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
    return new this._runtimeFactory(new Is({
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
    return new is(new Ae({
      path: {
        ref: `threadItems[${t}]`,
        threadSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => as(this._core, this._core.threadIds[t]),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
  getArchivedItemByIndex(t) {
    return new is(new Ae({
      path: {
        ref: `archivedThreadItems[${t}]`,
        threadSelector: {
          type: "archiveIndex",
          index: t
        }
      },
      getState: () => as(this._core, this._core.archivedThreadIds[t]),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
  getItemById(t) {
    return new is(new Ae({
      path: {
        ref: `threadItems[threadId=${t}]`,
        threadSelector: {
          type: "threadId",
          threadId: t
        }
      },
      getState: () => as(this._core, t),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
}, jm = class {
  threads;
  _thread;
  _core;
  constructor(t) {
    this._core = t, this.threads = new qm(t.threads), this._thread = this.threads.main, this.__internal_bindMethods();
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
const Ga = /* @__PURE__ */ new WeakMap(), kr = (t) => Ga.get(t) ?? 0, xo = (t, e) => kr(t) === e, Wa = (t) => {
  Ga.set(t, kr(t) + 1);
};
var Um = class {
  _contextProvider = new ta();
  registerModelContextProvider(t) {
    return this._contextProvider.registerModelContextProvider(t);
  }
  getModelContextProvider() {
    return this._contextProvider;
  }
};
const et = Object.freeze([]), It = "DEFAULT_THREAD_ID", Hm = Object.freeze([It]), zm = Object.freeze({
  id: It,
  remoteId: void 0,
  externalId: void 0,
  status: "regular"
}), Gm = Promise.resolve(), Io = Object.freeze({ [It]: zm });
var Wm = class {
  _mainThreadId = It;
  _threads = Hm;
  _archivedThreads = et;
  _threadData = Io;
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
    return Gm;
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
    const n = t.threadId ?? It, r = t.threads ?? et, o = t.archivedThreads ?? et, i = s.threadId ?? It, a = s.threads ?? et, c = s.archivedThreads ?? et;
    !e && i === n && a === r && c === o || ((a !== r || c !== o || i !== n) && (this._threadData = {
      ...Io,
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
    }), a !== r && (this._threads = this.adapter.threads?.map((l) => l.id) ?? et), c !== o && (this._archivedThreads = this.adapter.archivedThreads?.map((l) => l.id) ?? et), (e || i !== n) && (e || Wa(this._mainThread), this._mainThreadId = n, this._mainThread = this.threadFactory()), this._threadData[this._mainThreadId] || (this._threadData = {
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
    Fs(this._subscriptions);
  }
};
const Ya = {
  fromArray: (t) => {
    const e = t.map((s) => Rs(s, ct(), kn(!1, !1, !1, !1, void 0)));
    return { messages: e.map((s, n) => ({
      parentId: n > 0 ? e[n - 1].id : null,
      message: s
    })) };
  },
  fromBranchableArray: (t, e) => {
    const s = kn(!1, !1, !1, !1, void 0);
    return {
      ...e?.headId !== void 0 ? { headId: e.headId } : void 0,
      messages: t.map(({ message: n, parentId: r }) => {
        if (!n.id) throw new Error("ExportedMessageRepository.fromBranchableArray: Each message must have an 'id' field set.");
        return {
          parentId: r,
          message: Rs(n, n.id, s)
        };
      })
    };
  }
}, ys = (t) => t.next ? ys(t.next) : "current" in t ? t : null;
var Ym = class {
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
}, Qa = class {
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
        r.children = [...r.children, e.current.id], (ys(e) === this.head || r.next === null) && (r.next = e), e.prev = t;
        const o = t ? t.level + 1 : 0;
        this.updateLevels(e, o);
      }
    }
  }
  _messages = new Ym(() => {
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
    this.performOp(null, s, "cut"), this.messages.delete(t), this.head === s && (this.head = ys(n ?? this.root)), this._messages.dirty();
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
    n.next = e, this.head = ys(e), this.evictOffBranchOptimisticMessages(s, this.head), this._messages.dirty();
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
const Gt = Object.freeze([]);
function To(t, e) {
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
function Qm(t) {
  const e = ct();
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
function Jm(t) {
  const e = [];
  for (const s of t) s.type !== "text" && e.push(Qm(s));
  return e;
}
const Xm = (t) => "content" in t && !("lastModified" in t), cs = (t) => t.status.type === "complete";
var Ja = class extends wd {
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
      const e = this._attachments.filter((s) => !cs(s));
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
    const e = this.getAttachmentAdapter(), s = this.attachments.map(async (g) => {
      if (cs(g)) return g;
      if (!e) throw new Error("Attachments are not supported");
      return await e.send(g);
    }), n = this.attachments, r = this.text, o = this._quote, i = this.role, a = this.runConfig;
    this._quote = void 0, this._text = "", this._isSending = !0;
    const c = ++this._sendGeneration;
    this._notifySubscribers();
    let l;
    try {
      l = await Promise.all(s);
    } catch (g) {
      throw c === this._sendGeneration && (!this.text.trim() && this._quote === void 0 && (this._text = r, this._rebaseDictation(r), this._quote = o, this._notifySubscribers()), Promise.allSettled(s).then(() => {
        c === this._sendGeneration && (this._removedDuringSend.clear(), this._isSending = !1, this._notifySubscribers());
      })), g;
    }
    if (c !== this._sendGeneration) return;
    const u = new Set(n.map((g) => g.id));
    this._attachments = this._attachments.filter((g) => !u.has(g.id)), this._isSending = !1, this._notifySubscribers();
    const f = l.filter((g) => !this._removedDuringSend.has(g.id));
    this._removedDuringSend.clear();
    const h = {
      createdAt: /* @__PURE__ */ new Date(),
      role: i,
      content: r ? [{
        type: "text",
        text: r
      }] : [],
      attachments: f,
      runConfig: a,
      metadata: { custom: { ...o ? { quote: o } : {} } }
    }, d = {
      text: r,
      quote: o,
      attachments: f
    };
    let p;
    try {
      p = this.handleSend(h, t);
    } catch (g) {
      throw this._restoreUnsentDraft(g, c, d), g;
    }
    p && p.catch((g) => {
      this._restoreUnsentDraft(g, c, d);
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
    Va(t) && e === this._sendGeneration && this.restoreDraft(s);
  }
  cancel() {
    this.handleCancel();
  }
  get queue() {
    return Gt;
  }
  moveQueueItem(t, e) {
  }
  removeQueueItem(t) {
  }
  async addAttachment(t) {
    if (Xm(t)) {
      const i = this.getAttachmentAdapter();
      if (i && !To({
        name: t.name,
        type: t.contentType ?? ""
      }, i.accept)) {
        const c = `File type ${t.contentType || "unknown"} is not accepted. Accepted types: ${i.accept}`, l = new Error(c);
        throw this._safeEmitAttachmentAddError("not-accepted", c, void 0, l), l;
      }
      const a = {
        id: t.id ?? ct(),
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
      const i = "Attachments are not supported", a = /* @__PURE__ */ new Error(i);
      throw this._safeEmitAttachmentAddError("no-adapter", i, void 0, a), a;
    }
    if (!To({
      name: t.name,
      type: t.type
    }, e.accept)) {
      const i = `File type ${t.type || "unknown"} is not accepted. Accepted types: ${e.accept}`, a = new Error(i);
      throw this._safeEmitAttachmentAddError("not-accepted", i, void 0, a), a;
    }
    const s = {
      cancelled: !1,
      attachmentIds: /* @__PURE__ */ new Set()
    }, n = this._attachmentAddOperations;
    n.add(s);
    const r = (i) => {
      if (s.cancelled) return !1;
      s.attachmentIds.add(i.id);
      const a = this._attachments.findIndex((c) => c.id === i.id);
      return a !== -1 ? this._attachments = [
        ...this._attachments.slice(0, a),
        i,
        ...this._attachments.slice(a + 1)
      ] : this._attachments = [...this._attachments, i], this._notifySubscribers(), !0;
    };
    let o;
    try {
      const i = e.add({ file: t });
      if (Symbol.asyncIterator in i) {
        for await (const a of i)
          if (o = a, !r(a)) break;
      } else
        o = await i, r(o);
    } catch (i) {
      if (s.cancelled) return;
      throw o && r({
        ...o,
        status: {
          type: "incomplete",
          reason: "error",
          message: i instanceof Error ? i.message : String(i)
        }
      }), this._safeEmitAttachmentAddError("adapter-error", i instanceof Error ? i.message : String(i), o?.id, i instanceof Error ? i : void 0), i;
    } finally {
      n.delete(s);
    }
    s.cancelled || (o?.status.type === "incomplete" && o.status.reason === "error" ? this._safeEmitAttachmentAddError("adapter-error", o.status.message ?? "Attachment upload did not complete successfully.", o.id) : this._notifyEventSubscribers("attachmentAdd", {}));
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
    if (this._cancelAttachmentAdd(t), this._isSending && this._removedDuringSend.add(t), !cs(s)) {
      const n = this.getAttachmentAdapter();
      if (!n) throw new Error("Attachments are not supported");
      try {
        await n.remove(s);
      } catch (r) {
        const o = r instanceof Error ? r.message : String(r);
        throw this._attachments = this._attachments.map((i) => i.id === t && !cs(i) ? {
          ...i,
          status: {
            type: "incomplete",
            reason: "error",
            message: o
          }
        } : i), this._notifySubscribers(), r;
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
    s && St(s, e, `Composer runtime "${t}"`);
  }
  unstable_on(t, e) {
    const s = e;
    let n = this._eventSubscribers.get(t);
    return n || (n = /* @__PURE__ */ new Set(), this._eventSubscribers.set(t, n)), n.add(s), () => {
      this._eventSubscribers.get(t)?.delete(s);
    };
  }
};
const Zm = (t) => t.capabilities?.cancel ? za(t) : !1;
var Km = class extends Ja {
  get canCancel() {
    return Zm(this.runtime);
  }
  get canSend() {
    return !this.isEmpty && !this.runtime.isSendDisabled && !this._isSending;
  }
  _queueCache;
  get queue() {
    const t = this.runtime.getSteerQueueItems?.() ?? Gt, e = this.runtime.getQueueItems?.() ?? Gt, s = this._queueCache;
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
}, ep = class extends Ja {
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
    super(), this.runtime = t, this.endEditCallback = e, this._parentId = s, this._sourceId = n.id, this.setText(Hs(n)), this.setRole(n.role);
    let r;
    n.role === "user" ? (r = [...n.attachments ?? [], ...Jm(n.content)], this._nonTextPassthrough = []) : (r = n.attachments ?? [], this._nonTextPassthrough = n.content.filter((o) => o.type !== "text")), this.setAttachments(r), this.setRunConfig({ ...t.composer.runConfig });
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
}, tp = class {
  _subscriptions = /* @__PURE__ */ new Set();
  _isInitialized = !1;
  repository = new Qa();
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
  composer = new Km(this);
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
    const s = this.messages, n = e === null ? -1 : s.findIndex((o) => o.id === e), r = Tf(this.getModelContext().unstable_composerMetadata, s.slice(0, n + 1));
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
    this._editComposers.set(t, new ep(this, () => this._editComposers.delete(t), this.repository.getMessage(t))), this._notifySubscribers();
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
    s && St(s, e, `Thread runtime "${t}"`);
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
    const n = e.speak(Hs(s)), r = n.subscribe(() => {
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
      this._voiceVolume = r, St(this._voiceVolumeSubscribers, void 0, "Voice volume");
    })), s.push(e.onTranscript((r) => {
      this._handleVoiceTranscript(r);
    })), this._voiceUnsubs = s;
  }
  _currentAssistantMsg = null;
  _handleVoiceTranscript(t) {
    if (this.ensureInitialized(), t.role === "user")
      this._finishVoiceAssistantMessage(), this._currentAssistantMsg = null, t.isFinal && (this._voiceMessages.push({
        id: ct(),
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
          id: ct(),
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
    this._voiceUnsubs = [], this._voiceSession?.disconnect(), this._voiceSession = void 0, this.voice = void 0, this._voiceVolume = 0, St(this._voiceVolumeSubscribers, void 0, "Voice volume"), this._voiceMessages = [], this._markVoiceMessagesDirty(), this._notifySubscribers();
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
    this.import(Ya.fromArray(t ?? []));
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
const sp = /* @__PURE__ */ Symbol.for("assistant-stream.tool-execution-id"), ls = (t) => {
  try {
    return JSON.parse(t), !0;
  } catch {
    return !1;
  }
}, Co = (t) => {
  try {
    return JSON.parse(t);
  } catch {
    return;
  }
}, Eo = (t, e) => {
  const s = Co(t), n = Co(e);
  return s === void 0 || n === void 0 ? !1 : Rr(s, n);
}, on = (t) => t[sp];
var np = class {
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
    const [t, e] = qf();
    this._controller = e;
    const n = hm(() => this._getWrappedTools(), () => this._ac.signal, (r, o, i) => this._onHumanInput(r, o, i), {
      onExecutionStart: (r, o, i) => this._onExecutionStart(r, i),
      onExecutionEnd: (r, o, i) => this._onExecutionEnd(r, i)
    });
    t.pipeThrough(n).pipeThrough(new Oa()).pipeTo(new WritableStream({ write: (r) => {
      try {
        if (r.type !== "result") return;
        this._handleResultChunk(r);
      } catch (o) {
        console.error("[ToolInvocationTracker] result chunk handling failed", o);
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
          ...n !== void 0 && { execute: (...[o, i]) => {
            const a = on(i), c = this._captureExecution(i.toolCallId, a);
            return !c || c.skipExecute ? new Promise(() => {
            }) : n(o, i);
          } },
          ...r !== void 0 && { streamCall: (...[o, i]) => {
            const a = on(i);
            if (this._captureExecution(i.toolCallId, a))
              return r(o, i);
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
      const o = this._entries.get(t);
      if (!o?.controller || o.executionId !== s) {
        r(/* @__PURE__ */ new Error("Tool execution aborted"));
        return;
      }
      const i = this._humanInput.get(t);
      if (i) try {
        i.reject(/* @__PURE__ */ new Error("Human input request was superseded by a new request"));
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
      if ([...n].some((o) => this._executing.has(o))) {
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
    const e = t.meta.toolCallId, s = on(t), n = this._entries.get(e);
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
    return s ? !0 : (this._hasExecutableTool(t) || !this._isRunning) && ls(e);
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
        Eo(t.argsText, e.argsText) && (t.argsText = e.argsText), n = !1;
      else if (!e.argsText.startsWith(t.argsText))
        if (ls(t.argsText) && ls(e.argsText) && Eo(t.argsText, e.argsText)) {
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
            o.hasResult = !0, o.argsComplete = !0, i.setResponse(new He({
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
const rp = Object.freeze([]), us = (t, e) => {
  Promise.resolve(e).catch((s) => {
    console.error(`[ExternalStoreThreadRuntimeCore] ${t} callback rejected`, s);
  });
}, Ro = (t, e) => {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length) return !1;
  for (const n of s) if (t[n] !== e[n]) return !1;
  return !0;
}, op = (t, e) => t && e[e.length - 1]?.role !== "assistant";
var ip = class extends tp {
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
  _converter = new _o();
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
    const n = t.suggestions ?? rp;
    Ro(this.suggestions, n) || (this.suggestions = n);
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
    Ro(this._capabilities, r) || (this._capabilities = r);
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
        for (const { message: u, parentId: f } of a) this.repository.addOrUpdateMessage(f, u);
        for (const { message: u } of this.repository.export().messages) l.has(u.id) || this.repository.deleteMessage(u.id);
        this.repository.resetHead(c), o = this.repository.getMessages();
      }
    } else if (t.messages) {
      if (s) {
        if (s.convertMessage !== t.convertMessage) this._converter = new _o();
        else if (s.isRunning === t.isRunning && s.messages === t.messages) {
          this._notifySubscribers();
          return;
        }
      }
      o = t.convertMessage ? this._converter.convertMessages(t.messages, (l, u, f) => {
        if (!t.convertMessage) return u;
        const h = f === (t.messages?.length ?? 0) - 1, d = kn(h, e, !1, !1, void 0);
        if (l && (l.role !== "assistant" || !Jf(l.status) || l.status === d)) return l;
        const p = t.convertMessage(u, f), g = Rs(p, f.toString(), d);
        return Gf(g, u), g;
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
        const u = o[l], f = o[l - 1];
        this.repository.addOrUpdateMessage(f?.id ?? null, u);
      }
    } else throw new Error("ExternalStoreAdapter must provide either 'messages' or 'messageRepository'");
    o.length > 0 && this.ensureInitialized(), (s?.isRunning ?? !1) !== (t.isRunning ?? !1) && (t.isRunning ? this._notifyEventSubscribers("runStart", {}) : this._notifyEventSubscribers("runEnd", {}));
    let i = null;
    op(e, o) && (i = ct(), this.repository.addOrUpdateMessage(o.at(-1)?.id ?? null, Rs({
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
    this._toolInvocations || (this._toolInvocations = new np(() => this.getModelContext().tools, {
      onResult: (t) => {
        try {
          const e = this._findMessageIdForToolCall(t.toolCallId);
          if (e === void 0) return;
          us("onAddToolResult", this._store.onAddToolResult?.({
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
    const e = t.sourceId != null || t.parentId !== (this.messages.at(-1)?.id ?? null), s = !e && this._store.queue && this._store.queue === this._transformedQueue ? t : this.enrichAppendMetadata(t), n = kr(this);
    this.ensureInitialized();
    const r = this._getInitializePromise?.();
    if (!e && this._store.queue) {
      if (r && await r, !xo(this, n)) return;
      s.steer ?? this._store.isRunning ?? !1 ? this._store.queue.steer(s) : this._store.queue.enqueue(s);
      return;
    }
    if (r?.catch(() => {
    }), (s.startRun ?? s.role === "user") && await this._toolInvocations?.abort(), !!xo(this, n))
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
    return this._store?.queue?.items ?? Gt;
  }
  getSteerQueueItems() {
    return this._store?.queue?.steerItems ?? Gt;
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
    this._toolInvocations?.abort(), this._store.queue?.__internal_notifyCancelled?.(), us("onCancel", this._store.onCancel()), this.dropEmptyOptimisticHead();
    const t = this.repository.getMessages(), e = t[t.length - 1], s = this._store.setMessages !== void 0 && e?.role === "user" && e.id === t.at(-1)?.id && e.content.every((r) => r.type === "text") ? e : void 0;
    let n;
    if (s) {
      const r = {
        text: Hs(s),
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
        r.at(-1)?.id === n.id ? this.repository.deleteMessage(n.id) : r.some((o) => o.id === n.id) && this.composer.retractDraft(n.draft);
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
    us("onAddToolResult", this._store.onAddToolResult(t));
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
    us("onRespondToToolApproval", this._store.onRespondToToolApproval(t));
  }
  reset(t) {
    const e = new Qa();
    e.import(Ya.fromArray(t ?? [])), this.updateMessages(e.getMessages());
  }
  import(t) {
    super.import(t), this._store.onImport && this._store.onImport(this.repository.getMessages());
  }
  updateMessages = (t) => {
    this._store.convertMessage !== void 0 ? this._store.setMessages?.(t.flatMap(Wf)) : this._store.setMessages?.(t);
  };
};
const Ao = (t) => t.adapters?.threadList ?? {};
var ap = class extends Um {
  threads;
  constructor(t) {
    super(), this.threads = new Wm(Ao(t), () => new ip(this._contextProvider, t));
  }
  setAdapter(t) {
    this.threads.__internal_setAdapter(Ao(t)), this.threads.getMainThreadRuntimeCore().__internal_setAdapter(t);
  }
};
const cp = (t) => {
  const e = S(15);
  let s;
  e[0] !== t ? (s = () => new ap(t), e[0] = t, e[1] = s) : s = e[1];
  const [n] = ue(s);
  let r;
  e[2] !== n.threads ? (r = () => () => {
    Wa(n.threads.getMainThreadRuntimeCore());
  }, e[2] = n.threads, e[3] = r) : r = e[3];
  let o;
  e[4] !== n ? (o = [n], e[4] = n, e[5] = o) : o = e[5], ee(r, o);
  let i;
  e[6] !== n || e[7] !== t ? (i = () => {
    n.setAdapter(t);
  }, e[6] = n, e[7] = t, e[8] = i) : i = e[8], ee(i);
  const { modelContext: a } = Uf() ?? {};
  let c, l;
  e[9] !== a || e[10] !== n ? (c = () => {
    if (a)
      return n.registerModelContextProvider(a);
  }, l = [a, n], e[9] = a, e[10] = n, e[11] = c, e[12] = l) : (c = e[11], l = e[12]), ee(c, l);
  let u;
  return e[13] !== n ? (u = new jm(n), e[13] = n, e[14] = u) : u = e[14], u;
}, lp = (t) => {
  const e = S(6), { id: s, children: n } = t, r = re();
  let o;
  e[0] !== s ? (o = Le({
    message: Me({
      source: "thread",
      query: {
        type: "id",
        id: s
      },
      get: (c) => c.thread.message({ id: s })
    }),
    composer: Me({
      source: "message",
      query: {},
      get: (c) => c.thread.message({ id: s }).composer()
    })
  }), e[0] = s, e[1] = o) : o = e[1];
  const i = o;
  let a;
  return e[2] !== r || e[3] !== n || e[4] !== i ? (a = /* @__PURE__ */ m(Qe, {
    extends: r,
    config: i,
    children: n
  }), e[2] = r, e[3] = n, e[4] = i, e[5] = a) : a = e[5], a;
}, Pr = (t, e) => t.Message === e.Message && t.EditComposer === e.EditComposer && t.UserEditComposer === e.UserEditComposer && t.AssistantEditComposer === e.AssistantEditComposer && t.SystemEditComposer === e.SystemEditComposer && t.UserMessage === e.UserMessage && t.AssistantMessage === e.AssistantMessage && t.SystemMessage === e.SystemMessage, Mo = () => null, Do = /* @__PURE__ */ new WeakMap(), up = (t, e) => {
  let s = Do.get(t);
  return s || (s = new Set(t.map((n) => n.id)), Do.set(t, s)), s.has(e);
}, dp = (t, e, s) => {
  switch (e) {
    case "user":
      return s ? t.UserEditComposer ?? t.EditComposer ?? t.UserMessage ?? t.Message : t.UserMessage ?? t.Message;
    case "assistant":
      return s ? t.AssistantEditComposer ?? t.EditComposer ?? t.AssistantMessage ?? t.Message : t.AssistantMessage ?? t.Message;
    case "system":
      return s ? t.SystemEditComposer ?? t.EditComposer ?? t.SystemMessage ?? t.Message ?? Mo : t.SystemMessage ?? t.Message ?? Mo;
    default:
      throw new Error(`Unknown message role: ${e}`);
  }
}, Or = (t) => {
  const e = S(6), { components: s } = t, n = k(fp), r = k(mp);
  let o;
  e[0] !== s || e[1] !== r || e[2] !== n ? (o = dp(s, n, r), e[0] = s, e[1] = r, e[2] = n, e[3] = o) : o = e[3];
  const i = o;
  let a;
  return e[4] !== i ? (a = /* @__PURE__ */ m(i, {}), e[4] = i, e[5] = a) : a = e[5], a;
}, Xa = ve((t) => {
  const e = S(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(Or, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ m(Ba, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && Pr(t.components, e.components));
Xa.displayName = "ThreadPrimitive.MessageByIndex";
const Za = ve((t) => {
  const e = S(7), { messageId: s, components: n } = t;
  let r;
  if (e[0] !== s ? (r = (a) => up(a.thread.messages, s), e[0] = s, e[1] = r) : r = e[1], !k(r)) return null;
  let o;
  e[2] !== n ? (o = /* @__PURE__ */ m(Or, { components: n }), e[2] = n, e[3] = o) : o = e[3];
  let i;
  return e[4] !== s || e[5] !== o ? (i = /* @__PURE__ */ m(lp, {
    id: s,
    children: o
  }), e[4] = s, e[5] = o, e[6] = i) : i = e[6], i;
}, (t, e) => t.messageId === e.messageId && Pr(t.components, e.components));
Za.displayName = "ThreadPrimitive.Unstable_MessageById";
const ko = ({ children: t }) => {
  const e = k((s) => s.thread.messages.length);
  return pe(() => e === 0 ? null : Array.from({ length: e }, (s, n) => /* @__PURE__ */ m(Ba, {
    index: n,
    children: /* @__PURE__ */ m(Us, {
      getItemState: (r) => r.thread.message({ index: n }).getState(),
      children: (r) => t({ get message() {
        return r();
      } })
    })
  }, n)), [e, t]);
}, Ka = (t) => {
  const e = S(4), { components: s, children: n } = t;
  if (s) {
    let o;
    return e[0] !== s ? (o = /* @__PURE__ */ m(ko, { children: () => /* @__PURE__ */ m(Or, { components: s }) }), e[0] = s, e[1] = o) : o = e[1], o;
  }
  let r;
  return e[2] !== n ? (r = /* @__PURE__ */ m(ko, { children: n }), e[2] = n, e[3] = r) : r = e[3], r;
};
Ka.displayName = "ThreadPrimitive.Messages";
const hp = ve(Ka, (t, e) => t.children || e.children ? t.children === e.children : Pr(t.components, e.components));
function fp(t) {
  return t.message.role;
}
function mp(t) {
  return t.message.composer.isEditing;
}
const ec = (t) => {
  const e = t.message.metadata;
  if (!(!e || typeof e != "object"))
    return e.custom?.quote;
};
var pp = class extends Error {
  componentName;
  constructor(t, e = `Component "${t}" is not in the generative-ui allowlist.`) {
    super(e), this.name = "GenerativeUIRenderError", this.componentName = t;
  }
};
const gp = (t) => typeof t == "object" && t !== null, tc = (t, e, s, n) => {
  if (t == null) return null;
  if (typeof t == "string") return t;
  if (!gp(t) || !("component" in t) || typeof t.component != "string")
    return null;
  const { component: r, props: o, children: i, key: a } = t, c = e[r];
  if (!c) {
    if (s) return /* @__PURE__ */ m(s, {
      component: r,
      props: o
    }, a ?? n);
    throw new pp(r);
  }
  const l = i?.length ? i.map((u, f) => tc(u, e, s, `${n}/${f}`)) : void 0;
  return zu(c, {
    ...o ?? {},
    key: a ?? n
  }, ...l ?? []);
}, bp = (t) => {
  if (!t || t.root === void 0 || t.root === null) return [];
  const e = t.root;
  return Array.isArray(e) ? e : [e];
}, Nr = (t) => {
  const e = S(11), { spec: s, components: n, Fallback: r } = t;
  let o;
  e[0] !== s ? (o = bp(s), e[0] = s, e[1] = o) : o = e[1];
  const i = o;
  let a;
  if (e[2] !== r || e[3] !== n || e[4] !== i) {
    let l;
    e[6] !== r || e[7] !== n ? (l = (u, f) => tc(u, n, r, `${f}`), e[6] = r, e[7] = n, e[8] = l) : l = e[8], a = i.map(l), e[2] = r, e[3] = n, e[4] = i, e[5] = a;
  } else a = e[5];
  let c;
  return e[9] !== a ? (c = /* @__PURE__ */ m(Ne, { children: a }), e[9] = a, e[10] = c) : c = e[10], c;
};
Nr.displayName = "GenerativeUIRender";
const sc = (t) => {
  const e = S(4), { components: s, spec: n, Fallback: r } = t, o = k(_p), i = n ?? o;
  if (!i) return null;
  let a;
  return e[0] !== r || e[1] !== s || e[2] !== i ? (a = /* @__PURE__ */ m(Nr, {
    spec: i,
    components: s,
    Fallback: r
  }), e[0] = r, e[1] = s, e[2] = i, e[3] = a) : a = e[3], a;
};
sc.displayName = "MessagePrimitive.GenerativeUI";
function _p(t) {
  const e = t.part;
  return e?.type === "generative-ui" ? e.spec : void 0;
}
const vp = "ui://", yp = (t) => !!t?.startsWith(vp), Po = (t) => Symbol.iterator in t, Oo = (t) => (
  // HACK: avoid checking entries type
  "entries" in t
), No = (t, e) => {
  const s = t instanceof Map ? t : new Map(t.entries()), n = e instanceof Map ? e : new Map(e.entries());
  if (s.size !== n.size)
    return !1;
  for (const [r, o] of s)
    if (!n.has(r) || !Object.is(o, n.get(r)))
      return !1;
  return !0;
}, wp = (t, e) => {
  const s = t[Symbol.iterator](), n = e[Symbol.iterator]();
  let r = s.next(), o = n.next();
  for (; !r.done && !o.done; ) {
    if (!Object.is(r.value, o.value))
      return !1;
    r = s.next(), o = n.next();
  }
  return !!r.done && !!o.done;
};
function Sp(t, e) {
  return Object.is(t, e) ? !0 : typeof t != "object" || t === null || typeof e != "object" || e === null || Object.getPrototypeOf(t) !== Object.getPrototypeOf(e) ? !1 : Po(t) && Po(e) ? Oo(t) && Oo(e) ? No(t, e) : wp(t, e) : No(
    { entries: () => Object.entries(t) },
    { entries: () => Object.entries(e) }
  );
}
function On(t) {
  const e = Yt.useRef(void 0);
  return (s) => {
    const n = t(s);
    return Sp(e.current, n) ? e.current : e.current = n;
  };
}
const an = (t) => {
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
}, xp = (t, e, s) => {
  const n = [];
  if (e) {
    const r = an("chainOfThoughtGroup");
    for (let o = 0; o < t.length; o++) {
      const i = t[o];
      i === "tool-call" || i === "reasoning" ? r.startGroup(o) : (r.endGroup(o - 1, n), n.push({
        type: "single",
        index: o
      }));
    }
    r.finalize(t.length - 1, n);
  } else {
    const r = an("toolGroup"), o = an("reasoningGroup");
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
}, Ip = (t) => {
  const e = S(10), s = k(On(jp)), n = k(On(Hp));
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
    e[3] !== s || e[4] !== n || e[5] !== t ? (o = xp(s, t, n), e[3] = s, e[4] = n, e[5] = t, e[6] = o) : o = e[6];
    let i;
    e[7] !== n || e[8] !== o ? (i = {
      ranges: o,
      partIds: n
    }, e[7] = n, e[8] = o, e[9] = i) : i = e[9], r = i;
  }
  return r;
}, Tp = (t) => {
  const e = S(9);
  let s, n;
  e[0] !== t ? ({ Fallback: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  e[3] !== s || e[4] !== n.toolName ? (r = (a) => a.tools.toolUIs[n.toolName]?.[0]?.render ?? s, e[3] = s, e[4] = n.toolName, e[5] = r) : r = e[5];
  const o = k(r);
  if (!o) return null;
  let i;
  return e[6] !== o || e[7] !== n ? (i = /* @__PURE__ */ m(o, { ...n }), e[6] = o, e[7] = n, e[8] = i) : i = e[8], i;
}, $r = (t, e, s) => {
  const n = t.renderers[e]?.[0];
  return n || (t.fallbacks[0] ?? s);
}, Cp = (t) => {
  const e = S(9);
  let s, n;
  e[0] !== t ? ({ Fallback: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  e[3] !== s || e[4] !== n.name ? (r = (a) => $r(a.dataRenderers, n.name, s), e[3] = s, e[4] = n.name, e[5] = r) : r = e[5];
  const o = k(r);
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
}, Ep = (t) => {
  const e = S(41), { components: s } = t;
  let n;
  e[0] !== s ? (n = s === void 0 ? {} : s, e[0] = s, e[1] = n) : n = e[1];
  const { Text: r, Reasoning: o, Image: i, Source: a, File: c, Unstable_Audio: l, tools: u, data: f, generativeUI: h } = n, d = r === void 0 ? fe.Text : r, p = o === void 0 ? fe.Reasoning : o, g = i === void 0 ? fe.Image : i, _ = a === void 0 ? fe.Source : a, x = c === void 0 ? fe.File : c, w = l === void 0 ? fe.Unstable_Audio : l;
  let I;
  e[2] !== u ? (I = u === void 0 ? {} : u, e[2] = u, e[3] = I) : I = e[3];
  const C = I, T = re(), E = k(zp), b = E.type;
  if (b === "tool-call") {
    const y = T.part.addToolResult, M = T.part.resumeToolCall, P = T.part.respondToToolApproval;
    if ("Override" in C) {
      let j;
      return e[4] !== y || e[5] !== E || e[6] !== P || e[7] !== M || e[8] !== C.Override ? (j = /* @__PURE__ */ m(C.Override, {
        ...E,
        addResult: y,
        resume: M,
        respondToApproval: P
      }), e[4] = y, e[5] = E, e[6] = P, e[7] = M, e[8] = C.Override, e[9] = j) : j = e[9], j;
    }
    const W = C.by_name?.[E.toolName] ?? C.Fallback;
    let X;
    return e[10] !== W || e[11] !== y || e[12] !== E || e[13] !== P || e[14] !== M ? (X = /* @__PURE__ */ m(Tp, {
      ...E,
      Fallback: W,
      addResult: y,
      resume: M,
      respondToApproval: P
    }), e[10] = W, e[11] = y, e[12] = E, e[13] = P, e[14] = M, e[15] = X) : X = e[15], X;
  }
  if (E.status?.type === "requires-action") throw new Error("Encountered unexpected requires-action status");
  switch (b) {
    case "text": {
      let y;
      return e[16] !== d || e[17] !== E ? (y = /* @__PURE__ */ m(d, { ...E }), e[16] = d, e[17] = E, e[18] = y) : y = e[18], y;
    }
    case "reasoning": {
      let y;
      return e[19] !== p || e[20] !== E ? (y = /* @__PURE__ */ m(p, { ...E }), e[19] = p, e[20] = E, e[21] = y) : y = e[21], y;
    }
    case "source": {
      let y;
      return e[22] !== _ || e[23] !== E ? (y = /* @__PURE__ */ m(_, { ...E }), e[22] = _, e[23] = E, e[24] = y) : y = e[24], y;
    }
    case "image": {
      let y;
      return e[25] !== g || e[26] !== E ? (y = /* @__PURE__ */ m(g, { ...E }), e[25] = g, e[26] = E, e[27] = y) : y = e[27], y;
    }
    case "file": {
      let y;
      return e[28] !== x || e[29] !== E ? (y = /* @__PURE__ */ m(x, { ...E }), e[28] = x, e[29] = E, e[30] = y) : y = e[30], y;
    }
    case "audio": {
      let y;
      return e[31] !== w || e[32] !== E ? (y = /* @__PURE__ */ m(w, { ...E }), e[31] = w, e[32] = E, e[33] = y) : y = e[33], y;
    }
    case "data": {
      const y = f?.by_name?.[E.name] ?? f?.Fallback;
      let M;
      return e[34] !== y || e[35] !== E ? (M = /* @__PURE__ */ m(Cp, {
        ...E,
        Fallback: y
      }), e[34] = y, e[35] = E, e[36] = M) : M = e[36], M;
    }
    case "generative-ui": {
      if (!h?.components)
        return null;
      const y = E;
      let M;
      return e[37] !== h.Fallback || e[38] !== h.components || e[39] !== y.spec ? (M = /* @__PURE__ */ m(Nr, {
        spec: y.spec,
        components: h.components,
        Fallback: h.Fallback
      }), e[37] = h.Fallback, e[38] = h.components, e[39] = y.spec, e[40] = M) : M = e[40], M;
    }
    default:
      return console.warn(`Unknown message part type: ${b}`), null;
  }
}, Vt = ve((t) => {
  const e = S(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(Ep, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ m(Mr, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && t.components?.Text === e.components?.Text && t.components?.Reasoning === e.components?.Reasoning && t.components?.Source === e.components?.Source && t.components?.Image === e.components?.Image && t.components?.File === e.components?.File && t.components?.Unstable_Audio === e.components?.Unstable_Audio && t.components?.tools === e.components?.tools && t.components?.data === e.components?.data && t.components?.generativeUI === e.components?.generativeUI && t.components?.ToolGroup === e.components?.ToolGroup && t.components?.ReasoningGroup === e.components?.ReasoningGroup);
Vt.displayName = "MessagePrimitive.PartByIndex";
const Rp = (t) => {
  const e = S(6), { status: s, component: n } = t, r = s.type === "running";
  let o;
  e[0] !== n || e[1] !== s ? (o = /* @__PURE__ */ m(n, {
    type: "text",
    text: "",
    status: s
  }), e[0] = n, e[1] = s, e[2] = o) : o = e[2];
  let i;
  return e[3] !== r || e[4] !== o ? (i = /* @__PURE__ */ m(Dr, {
    text: "",
    isRunning: r,
    children: o
  }), e[3] = r, e[4] = o, e[5] = i) : i = e[5], i;
}, Ap = Object.freeze({ type: "complete" }), Mp = Object.freeze({ type: "running" }), Dp = (t) => {
  const e = S(6), { components: s } = t, n = k(Gp);
  if (s?.Empty) {
    let i;
    return e[0] !== s.Empty || e[1] !== n ? (i = /* @__PURE__ */ m(s.Empty, { status: n }), e[0] = s.Empty, e[1] = n, e[2] = i) : i = e[2], i;
  }
  if (n.type !== "running") return null;
  const r = s?.Text ?? fe.Text;
  let o;
  return e[3] !== n || e[4] !== r ? (o = /* @__PURE__ */ m(Rp, {
    status: n,
    component: r
  }), e[3] = n, e[4] = r, e[5] = o) : o = e[5], o;
}, nc = ve(Dp, (t, e) => t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), kp = (t) => {
  const e = S(4), { components: s, enabled: n } = t;
  let r;
  if (e[0] !== n ? (r = (i) => {
    if (!n || i.message.parts.length === 0) return !1;
    const a = i.message.parts[i.message.parts.length - 1];
    return a?.type !== "text" && a?.type !== "reasoning";
  }, e[0] = n, e[1] = r) : r = e[1], !k(r)) return null;
  let o;
  return e[2] !== s ? (o = /* @__PURE__ */ m(nc, { components: s }), e[2] = s, e[3] = o) : o = e[3], o;
}, Pp = ve(kp, (t, e) => t.enabled === e.enabled && t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), Op = (t) => {
  const e = S(4), { Quote: s } = t, n = k(ec);
  if (!n) return null;
  let r;
  return e[0] !== s || e[1] !== n.messageId || e[2] !== n.text ? (r = /* @__PURE__ */ m(s, {
    text: n.text,
    messageId: n.messageId
  }), e[0] = s, e[1] = n.messageId, e[2] = n.text, e[3] = r) : r = e[3], r;
}, Np = ve(Op);
function rc(t, e) {
  const s = t.toolUIs[e.toolName]?.[0]?.render ?? null;
  return s || (yp(e.mcp?.app?.resourceUri) && t.mcpApp ? t.mcpApp.render : null);
}
const oc = () => {
  const t = S(6), e = re(), s = k(Wp), n = k(Yp);
  if (!n || s.type !== "tool-call") return null;
  let r;
  return t[0] !== n || t[1] !== e.part.addToolResult || t[2] !== e.part.respondToToolApproval || t[3] !== e.part.resumeToolCall || t[4] !== s ? (r = /* @__PURE__ */ m(n, {
    ...s,
    addResult: e.part.addToolResult,
    resume: e.part.resumeToolCall,
    respondToApproval: e.part.respondToToolApproval
  }), t[0] = n, t[1] = e.part.addToolResult, t[2] = e.part.respondToToolApproval, t[3] = e.part.resumeToolCall, t[4] = s, t[5] = r) : r = t[5], r;
}, ic = () => {
  const t = S(3), e = k(Qp), s = k(Jp);
  if (!s || e.type !== "data") return null;
  const n = e;
  let r;
  return t[0] !== s || t[1] !== n ? (r = /* @__PURE__ */ m(s, { ...n }), t[0] = s, t[1] = n, t[2] = r) : r = t[2], r;
}, $p = () => {
  const t = S(2), e = k(Xp);
  if (e === "tool-call") {
    let s;
    return t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = /* @__PURE__ */ m(oc, {}), t[0] = s) : s = t[0], s;
  }
  if (e === "data") {
    let s;
    return t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = /* @__PURE__ */ m(ic, {}), t[1] = s) : s = t[1], s;
  }
  return null;
}, Bp = Object.freeze({
  type: "text",
  text: "",
  status: Mp
}), Fp = ({ children: t }) => {
  const e = re(), s = k((n) => n.dataRenderers);
  return /* @__PURE__ */ m(Us, {
    getItemState: (n) => n.part.getState(),
    children: (n) => t({ get part() {
      const r = n();
      if (r.type === "tool-call") {
        const o = rc(e.tools.getState(), r) !== null, i = e.part;
        return {
          ...r,
          toolUI: o ? /* @__PURE__ */ m(oc, {}) : null,
          addResult: i.addToolResult,
          resume: i.resumeToolCall,
          respondToApproval: i.respondToToolApproval
        };
      }
      if (r.type === "data") {
        const o = $r(s, r.name, void 0) !== void 0;
        return {
          ...r,
          dataRendererUI: o ? /* @__PURE__ */ m(ic, {}) : null
        };
      }
      return r;
    } })
  });
}, ac = (t) => {
  const e = S(5), { index: s, children: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(Fp, { children: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ m(Mr, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, Lp = (t) => {
  const e = S(9), { children: s } = t, n = k(Zp), r = k(Kp), o = n === 0 && r;
  if (n === 0) {
    if (!o) return null;
    let a;
    e[0] !== s ? (a = s({ part: Bp }), e[0] = s, e[1] = a) : a = e[1];
    let c;
    return e[2] !== a ? (c = /* @__PURE__ */ m(Dr, {
      text: "",
      isRunning: !0,
      children: a
    }), e[2] = a, e[3] = c) : c = e[3], c;
  }
  let i;
  if (e[4] !== s || e[5] !== n) {
    let a;
    e[7] !== s ? (a = (c, l) => /* @__PURE__ */ m(ac, {
      index: l,
      children: (u) => s(u) ?? /* @__PURE__ */ m($p, {})
    }, l), e[7] = s, e[8] = a) : a = e[8], i = /* @__PURE__ */ m(Ne, { children: Array.from({ length: n }, a) }), e[4] = s, e[5] = n, e[6] = i;
  } else i = e[6];
  return i;
}, Nn = (t) => {
  const e = S(5), { components: s, unstable_showEmptyOnNonTextEnd: n, children: r } = t, o = n === void 0 ? !0 : n;
  if (r) {
    let a;
    return e[0] !== r ? (a = /* @__PURE__ */ m(Lp, { children: r }), e[0] = r, e[1] = a) : a = e[1], a;
  }
  let i;
  return e[2] !== s || e[3] !== o ? (i = /* @__PURE__ */ m(Vp, {
    components: s,
    unstable_showEmptyOnNonTextEnd: o
  }), e[2] = s, e[3] = o, e[4] = i) : i = e[4], i;
};
Nn.displayName = "MessagePrimitive.Parts";
const Vp = (t) => {
  const e = S(15), { components: s, unstable_showEmptyOnNonTextEnd: n } = t, r = k(eg), o = !!s?.ChainOfThought, { ranges: i, partIds: a } = Ip(o);
  let c;
  e: {
    if (r === 0) {
      let p;
      e[0] !== s ? (p = /* @__PURE__ */ m(nc, { components: s }), e[0] = s, e[1] = p) : p = e[1], c = p;
      break e;
    }
    let d;
    if (e[2] !== s || e[3] !== i || e[4] !== a) {
      const p = /* @__PURE__ */ new Set(), g = (_) => {
        const x = a[_];
        return x !== void 0 && !p.has(x) ? (p.add(x), `part-id:${x}`) : `part-${_}`;
      };
      d = i.map((_) => {
        if (_.type === "single") return /* @__PURE__ */ m(Vt, {
          index: _.index,
          components: s
        }, _.index);
        if (_.type === "chainOfThoughtGroup") {
          const x = s?.ChainOfThought;
          return x ? /* @__PURE__ */ m(xm, {
            startIndex: _.startIndex,
            endIndex: _.endIndex,
            children: /* @__PURE__ */ m(x, {})
          }, `chainOfThought-${_.idKey ?? _.startIndex}`) : null;
        } else if (_.type === "toolGroup") {
          const x = s?.ToolGroup ?? fe.ToolGroup;
          return /* @__PURE__ */ m(x, {
            startIndex: _.startIndex,
            endIndex: _.endIndex,
            children: Array.from({ length: _.endIndex - _.startIndex + 1 }, (w, I) => {
              const C = _.startIndex + I;
              return /* @__PURE__ */ m(Vt, {
                index: C,
                components: s
              }, g(C));
            })
          }, `tool-${_.idKey ?? _.startIndex}`);
        } else {
          const x = s?.ReasoningGroup ?? fe.ReasoningGroup;
          return /* @__PURE__ */ m(x, {
            startIndex: _.startIndex,
            endIndex: _.endIndex,
            children: Array.from({ length: _.endIndex - _.startIndex + 1 }, (w, I) => {
              const C = _.startIndex + I;
              return /* @__PURE__ */ m(Vt, {
                index: C,
                components: s
              }, `part-${C}`);
            })
          }, `reasoning-${_.startIndex}`);
        }
      }), e[2] = s, e[3] = i, e[4] = a, e[5] = d;
    } else d = e[5];
    c = d;
  }
  const l = c;
  let u;
  e[6] !== s ? (u = s?.Quote && /* @__PURE__ */ m(Np, { Quote: s.Quote }), e[6] = s, e[7] = u) : u = e[7];
  let f;
  e[8] !== s || e[9] !== n ? (f = /* @__PURE__ */ m(Pp, {
    components: s,
    enabled: n
  }), e[8] = s, e[9] = n, e[10] = f) : f = e[10];
  let h;
  return e[11] !== l || e[12] !== u || e[13] !== f ? (h = /* @__PURE__ */ N(Ne, { children: [
    u,
    l,
    f
  ] }), e[11] = l, e[12] = u, e[13] = f, e[14] = h) : h = e[14], h;
};
function qp(t) {
  return t.type;
}
function jp(t) {
  return t.message.parts.map(qp);
}
function Up(t) {
  return t.type === "tool-call" ? t.toolCallId : void 0;
}
function Hp(t) {
  return t.message.parts.map(Up);
}
function zp(t) {
  return t.part;
}
function Gp(t) {
  return t.message.status ?? Ap;
}
function Wp(t) {
  return t.part;
}
function Yp(t) {
  return t.part.type === "tool-call" ? rc(t.tools, t.part) : null;
}
function Qp(t) {
  return t.part;
}
function Jp(t) {
  return t.part.type === "data" ? $r(t.dataRenderers, t.part.name, void 0) ?? null : null;
}
function Xp(t) {
  return t.part.type;
}
function Zp(t) {
  return t.message.parts.length;
}
function Kp(t) {
  return (t.message.status?.type ?? "complete") === "running";
}
function eg(t) {
  return t.message.parts.length;
}
const tg = /* @__PURE__ */ Symbol.for("@assistant-ui/groupBy.memoKey"), $o = (t) => {
  const e = t.nextChildIdx++;
  return t.nodeKey === "" ? String(e) : `${t.nodeKey}.${e}`;
}, Bo = (t, e) => {
  if (!(e === void 0 || t.claimed.has(e)))
    return t.claimed.add(e), `id:${e}`;
}, sg = (t, e) => {
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
      idKey: Bo(i, e?.[o.indices[0]]),
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
        nodeKey: $o(l),
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
      nodeKey: $o(c),
      idKey: Bo(c, e?.[o])
    });
    for (let l = 1; l < n.length; l++) n[l].indices.push(o);
  }
  for (; n.length > 1; ) r();
  return s.children;
}, ng = (t, e, s) => {
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
}, cc = () => {
  throw new Error("MessagePrimitive.GroupedParts: rendered `children` under a leaf part. `children` is only meaningful for `group-…` cases — add a matching case for the part type or return `null` to skip it.");
}, lc = (t, e, s) => {
  if (t.type === "part") return /* @__PURE__ */ m(ac, {
    index: t.index,
    children: ({ part: o }) => s({
      part: o,
      children: /* @__PURE__ */ m(cc, {})
    })
  }, t.idKey ? `part-${t.idKey}` : `part-${t.index}`);
  const n = Fa(e, t.indices), r = {
    type: t.key,
    status: n,
    indices: t.indices
  };
  return /* @__PURE__ */ m(Hu, { children: s({
    part: r,
    children: /* @__PURE__ */ m(Ne, { children: t.children.map((o) => lc(o, e, s)) })
  }) }, t.idKey ?? t.nodeKey);
}, uc = ({ groupBy: t, indicator: e = "no-text", children: s }) => {
  const n = k(On((c) => c.message.parts)), r = k((c) => c.tools.toolUIs), o = k((c) => e === "never" ? !1 : c.message.status?.type === "running"), i = t[tg] ?? t, a = pe(() => {
    const c = { toolUIs: r };
    return sg(n.map((l) => t(l, c) ?? []), n.map((l) => l.type === "tool-call" ? l.toolCallId : void 0));
  }, [
    n,
    i,
    r
  ]);
  return /* @__PURE__ */ N(Ne, { children: [a.map((c) => lc(c, n, s)), ng(e, n, o) && s({
    part: { type: "indicator" },
    children: /* @__PURE__ */ m(cc, {})
  })] });
};
uc.displayName = "MessagePrimitive.GroupedParts";
const rg = (t) => {
  const e = S(5), { children: s } = t, n = k(ec);
  if (!n) return null;
  let r;
  e[0] !== s || e[1] !== n ? (r = s(n), e[0] = s, e[1] = n, e[2] = r) : r = e[2];
  let o;
  return e[3] !== r ? (o = /* @__PURE__ */ m(Ne, { children: r }), e[3] = r, e[4] = o) : o = e[4], o;
}, dc = ve(rg);
dc.displayName = "MessagePrimitive.Quote";
const hc = (t, e) => {
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
}, og = (t) => {
  const e = S(5), { components: s } = t, n = k(ig);
  if (!n) return null;
  const r = n;
  let o;
  e[0] !== s || e[1] !== r ? (o = hc(s, r), e[0] = s, e[1] = r, e[2] = o) : o = e[2];
  const i = o;
  if (!i) return null;
  let a;
  return e[3] !== i ? (a = /* @__PURE__ */ m(i, {}), e[3] = i, e[4] = a) : a = e[4], a;
}, fc = ve((t) => {
  const e = S(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(og, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ m($a, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && t.components?.Image === e.components?.Image && t.components?.Document === e.components?.Document && t.components?.File === e.components?.File && t.components?.Attachment === e.components?.Attachment);
fc.displayName = "MessagePrimitive.AttachmentByIndex";
const Fo = ({ children: t }) => {
  const e = k((s) => s.message.role !== "user" ? 0 : (s.message.attachments ?? []).length);
  return pe(() => Array.from({ length: e }, (s, n) => /* @__PURE__ */ m($a, {
    index: n,
    children: /* @__PURE__ */ m(Us, {
      getItemState: (r) => r.message.attachment({ index: n }).getState(),
      children: (r) => t({ get attachment() {
        return r();
      } })
    })
  }, n)), [e, t]);
}, mc = (t) => {
  const e = S(4), { components: s, children: n } = t;
  if (s) {
    let o;
    return e[0] !== s ? (o = /* @__PURE__ */ m(Fo, { children: (i) => {
      const { attachment: a } = i, c = hc(s, a);
      return c ? /* @__PURE__ */ m(c, {}) : null;
    } }), e[0] = s, e[1] = o) : o = e[1], o;
  }
  let r;
  return e[2] !== n ? (r = /* @__PURE__ */ m(Fo, { children: n }), e[2] = n, e[3] = r) : r = e[3], r;
};
mc.displayName = "MessagePrimitive.Attachments";
function ig(t) {
  return t.attachment;
}
const Br = (t) => {
  const { children: e } = t;
  return k(ag) ? e : null;
};
Br.displayName = "MessagePartPrimitive.InProgress";
function ag(t) {
  return t.part.status.type === "running";
}
const pc = (t) => {
  const e = S(2), { components: s } = t, n = s.Suggestion;
  let r;
  return e[0] !== n ? (r = /* @__PURE__ */ m(n, {}), e[0] = n, e[1] = r) : r = e[1], r;
}, gc = ve((t) => {
  const e = S(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(pc, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ m(La, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && t.components.Suggestion === e.components.Suggestion);
gc.displayName = "ThreadPrimitive.SuggestionByIndex";
const Lo = ({ children: t }) => {
  const e = k((s) => s.suggestions.suggestions.length);
  return pe(() => e === 0 ? null : Array.from({ length: e }, (s, n) => /* @__PURE__ */ m(La, {
    index: n,
    children: /* @__PURE__ */ m(Us, {
      getItemState: (r) => r.suggestions.suggestion({ index: n }).getState(),
      children: (r) => t({ get suggestion() {
        return r();
      } })
    })
  }, n)), [e, t]);
}, bc = (t) => {
  const e = S(4), { components: s, children: n } = t;
  if (s) {
    let o;
    return e[0] !== s ? (o = /* @__PURE__ */ m(Lo, { children: () => /* @__PURE__ */ m(pc, { components: s }) }), e[0] = s, e[1] = o) : o = e[1], o;
  }
  let r;
  return e[2] !== n ? (r = /* @__PURE__ */ m(Lo, { children: n }), e[2] = n, e[3] = r) : r = e[3], r;
};
bc.displayName = "ThreadPrimitive.Suggestions";
const cg = ve(bc, (t, e) => t.children || e.children ? t.children === e.children : t.components.Suggestion === e.components.Suggestion), lg = (t) => t.composer.isEditing, ug = (t) => t.thread.isRunning || t.thread.isDisabled || t.message.role !== "assistant", dg = (t) => !((t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some((e) => e.type === "text" && e.text.length > 0)), hg = (t, e) => t.thread.isDisabled || e && t.thread.isRunning && !t.thread.capabilities.queue, fg = (t) => {
  const e = S(15);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { copiedDuration: n, copyToClipboard: r } = s, o = n === void 0 ? 3e3 : n, i = re(), a = k(dg), c = k(mg), l = k(pg), u = k(gg), f = ae(void 0), h = ae(0);
  let d, p;
  e[2] !== i ? (d = () => () => {
    h.current = h.current + 1, f.current !== void 0 && (clearTimeout(f.current), f.current = void 0, i.message.setIsCopied(!1));
  }, p = [i], e[2] = i, e[3] = d, e[4] = p) : (d = e[3], p = e[4]), ee(d, p);
  let g;
  e[5] !== i || e[6] !== u || e[7] !== o || e[8] !== r || e[9] !== l ? (g = () => {
    if (!r) return;
    const I = l ? u : i.message.getCopyText();
    if (!I) return;
    const C = h.current;
    Promise.resolve(r(I)).then(() => {
      C === h.current && (f.current !== void 0 && clearTimeout(f.current), i.message.setIsCopied(!0), f.current = setTimeout(() => {
        f.current = void 0, i.message.setIsCopied(!1);
      }, o));
    }, bg);
  }, e[5] = i, e[6] = u, e[7] = o, e[8] = r, e[9] = l, e[10] = g) : g = e[10];
  const _ = g, x = a || !r;
  let w;
  return e[11] !== _ || e[12] !== c || e[13] !== x ? (w = {
    copy: _,
    disabled: x,
    isCopied: c
  }, e[11] = _, e[12] = c, e[13] = x, e[14] = w) : w = e[14], w;
};
function mg(t) {
  return t.message.isCopied;
}
function pg(t) {
  return t.composer.isEditing;
}
function gg(t) {
  return t.composer.text;
}
function bg() {
}
const _g = () => {
  const t = S(5), e = re(), s = k(lg);
  let n;
  t[0] !== e ? (n = () => {
    e.composer.beginEdit();
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let o;
  return t[2] !== s || t[3] !== r ? (o = {
    edit: r,
    disabled: s
  }, t[2] = s, t[3] = r, t[4] = o) : o = t[4], o;
}, vg = () => {
  const t = S(5), e = re(), s = k(ug);
  let n;
  t[0] !== e ? (n = () => {
    e.message.reload();
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let o;
  return t[2] !== s || t[3] !== r ? (o = {
    reload: r,
    disabled: s
  }, t[2] = s, t[3] = r, t[4] = o) : o = t[4], o;
}, yg = () => {
  const t = S(5), e = re(), s = k(Sg);
  let n;
  t[0] !== e ? (n = () => {
    e.message.submitFeedback({ type: "positive" });
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let o;
  return t[2] !== s || t[3] !== r ? (o = {
    submit: r,
    isSubmitted: s
  }, t[2] = s, t[3] = r, t[4] = o) : o = t[4], o;
}, wg = () => {
  const t = S(5), e = re(), s = k(xg);
  let n;
  t[0] !== e ? (n = () => {
    e.message.submitFeedback({ type: "negative" });
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let o;
  return t[2] !== s || t[3] !== r ? (o = {
    submit: r,
    isSubmitted: s
  }, t[2] = s, t[3] = r, t[4] = o) : o = t[4], o;
};
function Sg(t) {
  return t.message.metadata.submittedFeedback?.type === "positive";
}
function xg(t) {
  return t.message.metadata.submittedFeedback?.type === "negative";
}
const Ig = () => {
  const t = S(5), e = re(), s = k(Cg);
  let n;
  t[0] !== e ? (n = async () => {
    e.message.speak();
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let o;
  return t[2] !== s || t[3] !== r ? (o = {
    speak: r,
    disabled: s
  }, t[2] = s, t[3] = r, t[4] = o) : o = t[4], o;
};
function Tg(t) {
  return t.type === "text" && t.text.length > 0;
}
function Cg(t) {
  return !((t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some(Tg));
}
const Eg = () => {
  const t = S(5), e = re(), s = k(Rg);
  let n;
  t[0] !== e ? (n = () => {
    e.message.stopSpeaking();
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let o;
  return t[2] !== s || t[3] !== r ? (o = {
    stopSpeaking: r,
    disabled: s
  }, t[2] = s, t[3] = r, t[4] = o) : o = t[4], o;
};
function Rg(t) {
  return t.message.speech == null;
}
const Ag = (t) => {
  const e = S(10), { prompt: s, send: n, clearComposer: r } = t, o = r === void 0 ? !0 : r, i = re(), a = n ?? !1;
  let c;
  e[0] !== a ? (c = (d) => hg(d, a), e[0] = a, e[1] = c) : c = e[1];
  const l = k(c);
  let u;
  e[2] !== i || e[3] !== o || e[4] !== s || e[5] !== a ? (u = () => {
    if (a) {
      const { isRunning: d, capabilities: p } = i.thread.getState();
      if (d && !p.queue) return;
      i.thread.append({
        content: [{
          type: "text",
          text: s
        }],
        runConfig: i.composer.getState().runConfig
      }), o && !d && i.composer.setText("");
    } else if (o) i.composer.setText(s);
    else {
      const d = i.composer.getState().text;
      i.composer.setText([d, s].filter(Mg).join(" "));
    }
  }, e[2] = i, e[3] = o, e[4] = s, e[5] = a, e[6] = u) : u = e[6];
  const f = u;
  let h;
  return e[7] !== l || e[8] !== f ? (h = {
    trigger: f,
    disabled: l
  }, e[7] = l, e[8] = f, e[9] = h) : h = e[9], h;
};
function Mg(t) {
  return t.trim();
}
const Dg = () => k(kg);
function kg(t) {
  if (t.message.status?.type !== "incomplete" || t.message.status.reason !== "error") return;
  const e = t.message.status.error;
  return typeof e == "string" ? e : typeof e == "object" && e !== null && "message" in e && typeof e.message == "string" ? e.message : e ?? "An error occurred";
}
function Pg(t, e) {
  function s(n) {
    const r = Bs(t);
    if (!n?.optional && !r) throw new Error(`This component must be used within ${e}.`);
    return r;
  }
  return s;
}
function _c(t, e) {
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
const vc = We(null), Og = Pg(vc, "ThreadPrimitive.Viewport"), { useThreadViewport: Je, useThreadViewportStore: mt } = _c(Og, "useThreadViewport"), Vo = (t) => {
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
}, Ng = (t = {}) => {
  const e = /* @__PURE__ */ new Set(), s = Vo((i) => {
    o.setState({ height: {
      ...o.getState().height,
      viewport: i
    } });
  }), n = Vo((i) => {
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
  }), o = cl(() => ({
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
}, Ds = (t) => t, $g = (t) => {
  const e = S(11);
  let s;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = { optional: !0 }, e[0] = s) : s = e[0];
  const n = mt(s);
  let r;
  e[1] !== t ? (r = () => Ng(t), e[1] = t, e[2] = r) : r = e[2];
  const [o] = ue(r);
  let i, a;
  e[3] !== n || e[4] !== o ? (i = () => n?.getState().onScrollToBottom(() => {
    o.getState().scrollToBottom();
  }), a = [n, o], e[3] = n, e[4] = o, e[5] = i, e[6] = a) : (i = e[5], a = e[6]), ee(i, a);
  let c, l;
  return e[7] !== n || e[8] !== o ? (c = () => {
    if (n)
      return o.subscribe((u) => {
        n.getState().isAtBottom !== u.isAtBottom && Ds(n).setState({ isAtBottom: u.isAtBottom });
      });
  }, l = [o, n], e[7] = n, e[8] = o, e[9] = c, e[10] = l) : (c = e[9], l = e[10]), ee(c, l), o;
}, Fr = (t) => {
  const e = S(7), { children: s, options: n } = t;
  let r;
  e[0] !== n ? (r = n === void 0 ? {} : n, e[0] = n, e[1] = r) : r = e[1];
  const o = $g(r);
  let i;
  e[2] !== o ? (i = () => ({ useThreadViewport: o }), e[2] = o, e[3] = i) : i = e[3];
  const [a] = ue(i);
  let c;
  return e[4] !== s || e[5] !== a ? (c = /* @__PURE__ */ m(vc.Provider, {
    value: a,
    children: s
  }), e[4] = s, e[5] = a, e[6] = c) : c = e[6], c;
}, Bg = () => {
  const t = S(3), e = re();
  let s, n;
  return t[0] !== e ? (s = () => {
  }, n = [e], t[0] = e, t[1] = s, t[2] = n) : (s = t[1], n = t[2]), ee(s, n), null;
}, Fg = (t) => {
  const e = S(8), { children: s, aui: n, config: r, runtime: o } = t, i = n ?? null;
  let a;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (a = /* @__PURE__ */ m(Bg, {}), e[0] = a) : a = e[0];
  let c;
  e[1] !== s ? (c = /* @__PURE__ */ m(Fr, { children: s }), e[1] = s, e[2] = c) : c = e[2];
  let l;
  return e[3] !== r || e[4] !== o || e[5] !== i || e[6] !== c ? (l = /* @__PURE__ */ N(mf, {
    runtime: o,
    aui: i,
    config: r,
    children: [a, c]
  }), e[3] = r, e[4] = o, e[5] = i, e[6] = c, e[7] = l) : l = e[7], l;
}, Lg = ve(Fg);
var Vg = Object.defineProperty, Lr = (t, e) => Vg(t, "name", { value: e, configurable: !0 });
function $n(t, e) {
  if (typeof t == "function")
    return t(e);
  t != null && (t.current = e);
}
Lr($n, "setRef");
function yc(...t) {
  return (e) => {
    let s = !1;
    const n = t.map((r) => {
      const o = $n(r, e);
      return !s && typeof o == "function" && (s = !0), o;
    });
    if (s)
      return () => {
        for (let r = 0; r < n.length; r++) {
          const o = n[r];
          typeof o == "function" ? o() : $n(t[r], null);
        }
      };
  };
}
Lr(yc, "composeRefs");
function pt(...t) {
  return B(yc(...t), t);
}
Lr(pt, "useComposedRefs");
var qo = Object.defineProperty, Vr = (t, e) => {
  let s = {};
  for (var n in t) qo(s, n, {
    get: t[n],
    enumerable: !0
  });
  return qo(s, Symbol.toStringTag, { value: "Module" }), s;
}, qg = Object.defineProperty, Pe = (t, e) => qg(t, "name", { value: e, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function wc(t) {
  const e = bi((s, n) => {
    let { children: r, ...o } = s, i = null, a = !1;
    const c = [];
    Bn(r) && typeof ds == "function" && (r = ds(r._payload)), zr.forEach(r, (h) => {
      if (Tc(h)) {
        a = !0;
        const d = h;
        let p = "child" in d.props ? d.props.child : d.props.children;
        Bn(p) && typeof ds == "function" && (p = ds(p._payload)), i = Ug(d, p), c.push(i?.props?.children);
      } else
        c.push(h);
    }), i ? i = pn(i, void 0, c) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && zr.count(r) === 1 && ws(r) && (i = r)
    );
    const l = i ? Ic(i) : void 0, u = pt(n, l);
    if (!i) {
      if (r || r === 0)
        throw new Error(
          a ? Gg(t) : zg(t)
        );
      return r;
    }
    const f = xc(o, i.props ?? {});
    return i.type !== dl && (f.ref = n ? u : l), pn(i, f);
  });
  return e.displayName = `${t}.Slot`, e;
}
Pe(wc, "createSlot");
var Sc = /* @__PURE__ */ Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function jg(t) {
  const e = /* @__PURE__ */ Pe((s) => "child" in s ? s.children(s.child) : s.children, "Slottable");
  return e.displayName = `${t}.Slottable`, e.__radixId = Sc, e;
}
Pe(jg, "createSlottable");
var Ug = /* @__PURE__ */ Pe((t, e) => {
  if ("child" in t.props) {
    const s = t.props.child;
    return ws(s) ? pn(s, void 0, t.props.children(s.props.children)) : null;
  }
  return ws(e) ? e : null;
}, "getSlottableElementFromSlottable");
function xc(t, e) {
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
Pe(xc, "mergeProps");
function Ic(t) {
  let e = Object.getOwnPropertyDescriptor(t.props, "ref")?.get, s = e && "isReactWarning" in e && e.isReactWarning;
  return s ? t.ref : (e = Object.getOwnPropertyDescriptor(t, "ref")?.get, s = e && "isReactWarning" in e && e.isReactWarning, s ? t.props.ref : t.props.ref || t.ref);
}
Pe(Ic, "getElementRef");
function Tc(t) {
  return ws(t) && typeof t.type == "function" && "__radixId" in t.type && t.type.__radixId === Sc;
}
Pe(Tc, "isSlottable");
var Hg = /* @__PURE__ */ Symbol.for("react.lazy");
function Bn(t) {
  return t != null && typeof t == "object" && "$$typeof" in t && t.$$typeof === Hg && "_payload" in t && Cc(t._payload);
}
Pe(Bn, "isLazyComponent");
function Cc(t) {
  return typeof t == "object" && t !== null && "then" in t;
}
Pe(Cc, "isPromiseLike");
var zg = /* @__PURE__ */ Pe((t) => `${t} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), Gg = /* @__PURE__ */ Pe((t) => `${t} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), ds = hl[" use ".trim().toString()], Wg = Object.defineProperty, Yg = (t, e) => Wg(t, "name", { value: e, configurable: !0 }), Qg = [
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
], Jg = Qg.reduce((t, e) => {
  const s = /* @__PURE__ */ wc(`Primitive.${e}`), n = bi((r, o) => {
    const { asChild: i, ...a } = r, c = i ? s : e;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ m(c, { ...a, ref: o });
  });
  return n.displayName = `Primitive.${e}`, { ...t, [e]: n };
}, {});
function Xg(t, e) {
  t && Ql(() => t.dispatchEvent(e));
}
Yg(Xg, "dispatchDiscreteCustomEvent");
const Zg = [
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
function Kg(t) {
  const e = ge((s, n) => {
    const r = S(17);
    let o, i, a, c;
    r[0] !== s ? ({ render: a, asChild: o, children: i, ...c } = s, r[0] = s, r[1] = o, r[2] = i, r[3] = a, r[4] = c) : (o = r[1], i = r[2], a = r[3], c = r[4]);
    const l = t;
    if (a && Wu(a)) {
      const h = i !== void 0 ? i : a.props.children, d = c;
      let p;
      r[5] !== a || r[6] !== h ? (p = Gu(a, void 0, h), r[5] = a, r[6] = h, r[7] = p) : p = r[7];
      let g;
      return r[8] !== n || r[9] !== d || r[10] !== p ? (g = /* @__PURE__ */ m(l, {
        ...d,
        asChild: !0,
        ref: n,
        children: p
      }), r[8] = n, r[9] = d, r[10] = p, r[11] = g) : g = r[11], g;
    }
    const u = c;
    let f;
    return r[12] !== o || r[13] !== i || r[14] !== n || r[15] !== u ? (f = /* @__PURE__ */ m(l, {
      ...u,
      asChild: o,
      ref: n,
      children: i
    }), r[12] = o, r[13] = i, r[14] = n, r[15] = u, r[16] = f) : f = r[16], f;
  });
  return e.displayName = typeof t == "string" ? t : t.displayName ?? t.name ?? "Component", e;
}
function eb(t) {
  const e = Jg[t], s = Kg(e);
  return s.displayName = `Primitive.${t}`, s;
}
const Ie = Zg.reduce((t, e) => (t[e] = eb(e), t), {}), nt = {
  Hidden: "hidden",
  Floating: "floating",
  Normal: "normal"
}, tb = (t) => {
  const e = S(5), { hideWhenRunning: s, autohide: n, autohideFloat: r, forceVisible: o } = t;
  let i;
  return e[0] !== n || e[1] !== r || e[2] !== o || e[3] !== s ? (i = (a) => {
    if (s && a.thread.isRunning) return nt.Hidden;
    const c = n === "always" || n === "not-last" && !a.message.isLast, l = o || a.message.isHovering;
    return c ? l ? r === "always" || r === "single-branch" && a.message.branchCount <= 1 ? nt.Floating : nt.Normal : nt.Hidden : nt.Normal;
  }, e[0] = n, e[1] = r, e[2] = o, e[3] = s, e[4] = i) : i = e[4], k(i);
}, sb = We(null), Ec = ge((t, e) => {
  const s = S(18);
  let n, r, o, i;
  s[0] !== t ? ({ hideWhenRunning: o, autohide: n, autohideFloat: r, ...i } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o, s[4] = i) : (n = s[1], r = s[2], o = s[3], i = s[4]);
  const [a, c] = ue(0);
  let l;
  s[5] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (l = () => {
    let w = !1;
    return c(nb), () => {
      w || (w = !0, c(rb));
    };
  }, s[5] = l) : l = s[5];
  const u = l;
  let f;
  s[6] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (f = { acquireInteractionLock: u }, s[6] = f) : f = s[6];
  const h = f, d = a > 0;
  let p;
  s[7] !== n || s[8] !== r || s[9] !== o || s[10] !== d ? (p = {
    hideWhenRunning: o,
    autohide: n,
    autohideFloat: r,
    forceVisible: d
  }, s[7] = n, s[8] = r, s[9] = o, s[10] = d, s[11] = p) : p = s[11];
  const g = tb(p);
  if (g === nt.Hidden) return null;
  let _;
  s[12] !== g ? (_ = g === nt.Floating ? { "data-floating": "true" } : null, s[12] = g, s[13] = _) : _ = s[13];
  let x;
  return s[14] !== e || s[15] !== i || s[16] !== _ ? (x = /* @__PURE__ */ m(sb.Provider, {
    value: h,
    children: /* @__PURE__ */ m(Ie.div, {
      ..._,
      ...i,
      ref: e
    })
  }), s[14] = e, s[15] = i, s[16] = _, s[17] = x) : x = s[17], x;
});
Ec.displayName = "ActionBarPrimitive.Root";
function nb(t) {
  return t + 1;
}
function rb(t) {
  return Math.max(0, t - 1);
}
var ob = Object.defineProperty, Mt = (t, e) => ob(t, "name", { value: e, configurable: !0 }), Rc = !!(typeof window < "u" && window.document && window.document.createElement);
function gt(t, e, { checkForDefaultPrevented: s = !0 } = {}) {
  return /* @__PURE__ */ Mt(function(r) {
    if (t?.(r), s === !1 || !r || !r.defaultPrevented)
      return e?.(r);
  }, "handleEvent");
}
Mt(gt, "composeEventHandlers");
function ib(t) {
  if (!Rc)
    throw new Error("Cannot access window outside of the DOM");
  return t?.ownerDocument?.defaultView ?? window;
}
Mt(ib, "getOwnerWindow");
function Fn(t) {
  if (!Rc)
    throw new Error("Cannot access document outside of the DOM");
  return t?.ownerDocument ?? document;
}
Mt(Fn, "getOwnerDocument");
function Ac(t, e = !1) {
  const { activeElement: s } = Fn(t);
  if (!s?.nodeName)
    return null;
  if (Mc(s) && s.contentDocument)
    return Ac(s.contentDocument.body, e);
  if (e) {
    const n = s.getAttribute("aria-activedescendant");
    if (n) {
      const r = Fn(s).getElementById(n);
      if (r)
        return r;
    }
  }
  return s;
}
Mt(Ac, "getActiveElement");
function Mc(t) {
  return t.tagName === "IFRAME";
}
Mt(Mc, "isFrame");
const ab = (t) => {
  const e = S(4);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { copiedDuration: n } = s, r = n === void 0 ? 3e3 : n;
  let o;
  e[2] !== r ? (o = {
    copiedDuration: r,
    copyToClipboard: cb
  }, e[2] = r, e[3] = o) : o = e[3];
  const { copy: i, disabled: a } = fg(o);
  return a ? null : i;
}, Dc = ge((t, e) => {
  const s = S(20);
  let n, r, o, i;
  s[0] !== t ? ({ copiedDuration: n, onClick: o, disabled: r, ...i } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o, s[4] = i) : (n = s[1], r = s[2], o = s[3], i = s[4]);
  const a = k(lb);
  let c;
  s[5] !== n ? (c = { copiedDuration: n }, s[5] = n, s[6] = c) : c = s[6];
  const l = ab(c);
  let u;
  s[7] !== a ? (u = a ? { "data-copied": "true" } : {}, s[7] = a, s[8] = u) : u = s[8];
  const f = r || !l;
  let h;
  s[9] !== l ? (h = () => {
    l?.();
  }, s[9] = l, s[10] = h) : h = s[10];
  let d;
  s[11] !== o || s[12] !== h ? (d = gt(o, h), s[11] = o, s[12] = h, s[13] = d) : d = s[13];
  let p;
  return s[14] !== e || s[15] !== i || s[16] !== u || s[17] !== f || s[18] !== d ? (p = /* @__PURE__ */ m(Ie.button, {
    type: "button",
    ...u,
    ...i,
    ref: e,
    disabled: f,
    onClick: d
  }), s[14] = e, s[15] = i, s[16] = u, s[17] = f, s[18] = d, s[19] = p) : p = s[19], p;
});
Dc.displayName = "ActionBarPrimitive.Copy";
function cb(t) {
  return typeof navigator > "u" || !navigator.clipboard ? Promise.reject(/* @__PURE__ */ new Error("Clipboard API is unavailable")) : navigator.clipboard.writeText(t);
}
function lb(t) {
  return t.message.isCopied;
}
const es = (t, e, s = []) => {
  const n = ge((r, o) => {
    const i = S(6), a = {}, c = {};
    Object.keys(r).forEach((g) => {
      s.includes(g) ? a[g] = r[g] : c[g] = r[g];
    });
    const l = e(a) ?? void 0, u = Ie, f = "button", h = c.disabled || !l, d = gt(c.onClick, l);
    let p;
    return i[0] !== o || i[1] !== c || i[2] !== u.button || i[3] !== h || i[4] !== d ? (p = /* @__PURE__ */ m(u.button, {
      type: f,
      ...c,
      ref: o,
      disabled: h,
      onClick: d
    }), i[0] = o, i[1] = c, i[2] = u.button, i[3] = h, i[4] = d, i[5] = p) : p = i[5], p;
  });
  return n.displayName = t, n;
}, ub = () => {
  const { disabled: t, reload: e } = vg();
  return t ? null : e;
}, db = es("ActionBarPrimitive.Reload", ub), hb = () => {
  const { disabled: t, edit: e } = _g();
  return t ? null : e;
}, fb = es("ActionBarPrimitive.Edit", hb), mb = () => {
  const { disabled: t, speak: e } = Ig();
  return t ? null : e;
}, pb = es("ActionBarPrimitive.Speak", mb), gb = () => {
  const { disabled: t, stopSpeaking: e } = Eg();
  return t ? null : e;
}, kc = ge((t, e) => {
  const s = S(10), n = gb(), r = !n;
  let o;
  s[0] !== n ? (o = () => {
    n?.();
  }, s[0] = n, s[1] = o) : o = s[1];
  let i;
  s[2] !== t.onClick || s[3] !== o ? (i = gt(t.onClick, o), s[2] = t.onClick, s[3] = o, s[4] = i) : i = s[4];
  let a;
  return s[5] !== t || s[6] !== e || s[7] !== r || s[8] !== i ? (a = /* @__PURE__ */ m(Ie.button, {
    type: "button",
    disabled: r,
    ...t,
    ref: e,
    onClick: i
  }), s[5] = t, s[6] = e, s[7] = r, s[8] = i, s[9] = a) : a = s[9], a;
});
kc.displayName = "ActionBarPrimitive.StopSpeaking";
const bb = () => {
  const { submit: t } = yg();
  return t;
}, Pc = ge((t, e) => {
  const s = S(17);
  let n, r, o;
  s[0] !== t ? ({ onClick: r, disabled: n, ...o } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o) : (n = s[1], r = s[2], o = s[3]);
  const i = k(_b), a = bb();
  let c;
  s[4] !== i ? (c = i ? { "data-submitted": "true" } : {}, s[4] = i, s[5] = c) : c = s[5];
  const l = n || !a;
  let u;
  s[6] !== a ? (u = () => {
    a?.();
  }, s[6] = a, s[7] = u) : u = s[7];
  let f;
  s[8] !== r || s[9] !== u ? (f = gt(r, u), s[8] = r, s[9] = u, s[10] = f) : f = s[10];
  let h;
  return s[11] !== e || s[12] !== o || s[13] !== c || s[14] !== l || s[15] !== f ? (h = /* @__PURE__ */ m(Ie.button, {
    type: "button",
    ...c,
    ...o,
    ref: e,
    disabled: l,
    onClick: f
  }), s[11] = e, s[12] = o, s[13] = c, s[14] = l, s[15] = f, s[16] = h) : h = s[16], h;
});
Pc.displayName = "ActionBarPrimitive.FeedbackPositive";
function _b(t) {
  return t.message.metadata.submittedFeedback?.type === "positive";
}
const vb = () => {
  const { submit: t } = wg();
  return t;
}, Oc = ge((t, e) => {
  const s = S(17);
  let n, r, o;
  s[0] !== t ? ({ onClick: r, disabled: n, ...o } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o) : (n = s[1], r = s[2], o = s[3]);
  const i = k(yb), a = vb();
  let c;
  s[4] !== i ? (c = i ? { "data-submitted": "true" } : {}, s[4] = i, s[5] = c) : c = s[5];
  const l = n || !a;
  let u;
  s[6] !== a ? (u = () => {
    a?.();
  }, s[6] = a, s[7] = u) : u = s[7];
  let f;
  s[8] !== r || s[9] !== u ? (f = gt(r, u), s[8] = r, s[9] = u, s[10] = f) : f = s[10];
  let h;
  return s[11] !== e || s[12] !== o || s[13] !== c || s[14] !== l || s[15] !== f ? (h = /* @__PURE__ */ m(Ie.button, {
    type: "button",
    ...c,
    ...o,
    ref: e,
    disabled: l,
    onClick: f
  }), s[11] = e, s[12] = o, s[13] = c, s[14] = l, s[15] = f, s[16] = h) : h = s[16], h;
});
Oc.displayName = "ActionBarPrimitive.FeedbackNegative";
function yb(t) {
  return t.message.metadata.submittedFeedback?.type === "negative";
}
const wb = (t) => {
  const e = S(6);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { filename: n, onExport: r } = s, o = re(), i = k(xb);
  let a;
  e[2] !== o.message || e[3] !== n || e[4] !== r ? (a = async () => {
    const l = o.message.getCopyText();
    if (!l) return;
    if (r) {
      await r(l);
      return;
    }
    const u = new Blob([l], { type: "text/markdown" }), f = URL.createObjectURL(u), h = document.createElement("a");
    h.href = f, h.download = n ?? `message-${Date.now()}.md`, h.click(), setTimeout(() => URL.revokeObjectURL(f), 4e4);
  }, e[2] = o.message, e[3] = n, e[4] = r, e[5] = a) : a = e[5];
  const c = a;
  return i ? c : null;
}, Nc = ge((t, e) => {
  const s = S(19);
  let n, r, o, i, a;
  s[0] !== t ? ({ filename: r, onExport: i, onClick: o, disabled: n, ...a } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o, s[4] = i, s[5] = a) : (n = s[1], r = s[2], o = s[3], i = s[4], a = s[5]);
  let c;
  s[6] !== r || s[7] !== i ? (c = {
    filename: r,
    onExport: i
  }, s[6] = r, s[7] = i, s[8] = c) : c = s[8];
  const l = wb(c), u = n || !l;
  let f;
  s[9] !== l ? (f = () => {
    l?.();
  }, s[9] = l, s[10] = f) : f = s[10];
  let h;
  s[11] !== o || s[12] !== f ? (h = gt(o, f), s[11] = o, s[12] = f, s[13] = h) : h = s[13];
  let d;
  return s[14] !== e || s[15] !== a || s[16] !== u || s[17] !== h ? (d = /* @__PURE__ */ m(Ie.button, {
    type: "button",
    ...a,
    ref: e,
    disabled: u,
    onClick: h
  }), s[14] = e, s[15] = a, s[16] = u, s[17] = h, s[18] = d) : d = s[18], d;
});
Nc.displayName = "ActionBarPrimitive.ExportMarkdown";
function Sb(t) {
  return t.type === "text" && t.text.length > 0;
}
function xb(t) {
  return (t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some(Sb);
}
var Ib = /* @__PURE__ */ Vr({
  Copy: () => Dc,
  Edit: () => fb,
  ExportMarkdown: () => Nc,
  FeedbackNegative: () => Oc,
  FeedbackPositive: () => Pc,
  Reload: () => db,
  Root: () => Ec,
  Speak: () => pb,
  StopSpeaking: () => kc
}), Tb = Object.defineProperty, Cb = (t, e) => Tb(t, "name", { value: e, configurable: !0 });
function zs(t) {
  const e = ne(t);
  return ce(() => {
    e.current = t;
  }), ze(() => ((...s) => e.current?.(...s)), []);
}
Cb(zs, "useCallbackRef");
const Eb = (t) => {
  const e = S(12);
  let s;
  return e[0] !== t.assistant || e[1] !== t.copied || e[2] !== t.hasAttachments || e[3] !== t.hasBranches || e[4] !== t.hasContent || e[5] !== t.last || e[6] !== t.lastOrHover || e[7] !== t.speaking || e[8] !== t.submittedFeedback || e[9] !== t.system || e[10] !== t.user ? (s = (n) => {
    const { role: r, attachments: o, parts: i, branchCount: a, isLast: c, speech: l, isCopied: u, isHovering: f } = n.message;
    return !(t.hasBranches === !0 && a < 2 || t.user && r !== "user" || t.assistant && r !== "assistant" || t.system && r !== "system" || t.lastOrHover === !0 && !f && !c || t.last !== void 0 && t.last !== c || t.copied === !0 && !u || t.copied === !1 && u || t.speaking === !0 && l == null || t.speaking === !1 && l != null || t.hasAttachments === !0 && (r !== "user" || !o?.length) || t.hasAttachments === !1 && r === "user" && o?.length || t.hasContent === !0 && i.length === 0 || t.hasContent === !1 && i.length > 0 || t.submittedFeedback !== void 0 && (n.message.metadata.submittedFeedback?.type ?? null) !== t.submittedFeedback);
  }, e[0] = t.assistant, e[1] = t.copied, e[2] = t.hasAttachments, e[3] = t.hasBranches, e[4] = t.hasContent, e[5] = t.last, e[6] = t.lastOrHover, e[7] = t.speaking, e[8] = t.submittedFeedback, e[9] = t.system, e[10] = t.user, e[11] = s) : s = e[11], k(s);
}, $c = (t) => {
  const e = S(3);
  let s, n;
  return e[0] !== t ? ({ children: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]), Eb(n) ? s : null;
};
$c.displayName = "MessagePrimitive.If";
const Rb = (t) => {
  const e = S(4), s = zs(t), n = Je(Ab);
  let r, o;
  e[0] !== s || e[1] !== n ? (r = () => n(s), o = [n, s], e[0] = s, e[1] = n, e[2] = r, e[3] = o) : (r = e[2], o = e[3]), ee(r, o);
};
function Ab(t) {
  return t.onScrollToBottom;
}
const Mb = () => !1, Db = () => {
}, kb = (t) => {
  const e = S(4);
  let s;
  e[0] !== t ? (s = (o) => {
    if (typeof window > "u" || t === null || !window.matchMedia) return Db;
    const i = window.matchMedia(t);
    return i.addEventListener("change", o), () => i.removeEventListener("change", o);
  }, e[0] = t, e[1] = s) : s = e[1];
  const n = s;
  let r;
  return e[2] !== t ? (r = () => typeof window > "u" || t === null || !window.matchMedia ? !1 : window.matchMedia(t).matches, e[2] = t, e[3] = r) : r = e[3], Ns(n, r, Mb);
}, Pb = Object.freeze({ type: "complete" }), Ob = Object.freeze({
  type: "text",
  text: "",
  status: Pb
}), Nb = () => k($b);
function $b(t) {
  return t.part.type !== "text" && t.part.type !== "reasoning" ? Ob : t.part;
}
const Bb = We(null);
function Fb(t) {
  const e = Bs(Bb);
  if (!t?.optional && !e) throw new Error("This component must be used within a SmoothContextProvider.");
  return e;
}
const { useSmoothStatus: My, useSmoothStatusStore: Lb } = _c(Fb, "useSmoothStatus"), Bc = 250, Fc = 5;
var Vb = class {
  animationFrameId = null;
  lastUpdateTime = Date.now();
  lastCommitTime = 0;
  targetText = "";
  drainMs = Bc;
  maxCharIntervalMs = Fc;
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
    let o = 0;
    for (; e >= n && o < r; )
      o++, e -= n;
    o === r && r === this.maxCharsPerFrame && (e = 0), o !== s ? this.animationFrameId = requestAnimationFrame(this.animate) : this.animationFrameId = null, o !== 0 && (this.currentText = this.targetText.slice(0, this.currentText.length + o), this.lastUpdateTime = t - e, (o === s || t - this.lastCommitTime >= this.minCommitMs) && (this.lastCommitTime = t, this.setText(this.currentText)));
  };
};
const cn = Object.freeze({ type: "running" }), hs = (t, e) => t !== void 0 && t > 0 ? t : e, qb = (t, e = !1) => {
  const { text: s } = t, n = kb("(prefers-reduced-motion: reduce)"), r = typeof e == "object" && e !== null ? e : void 0, o = e !== !1 && e !== null && !n, i = hs(r?.drainMs, Bc), a = hs(r?.maxCharIntervalMs, Fc), c = hs(r?.maxCharsPerFrame, 1 / 0), l = hs(r?.minCommitMs, 0), [u, f] = ue(t.status.type === "running" ? "" : s), h = re(), d = k(() => h.part), [p, g] = ue(d);
  (d !== p || !s.startsWith(u)) && (g(d), f(t.status.type === "running" ? "" : s));
  const _ = Lb({ optional: !0 }), x = zs((C) => {
    if (f(C), _) {
      const T = u !== C || t.status.type === "running" ? cn : t.status;
      Ds(_).setState(T, !0);
    }
  });
  ee(() => {
    if (_) {
      const C = o && (u !== s || t.status.type === "running") ? cn : t.status;
      Ds(_).setState(C, !0);
    }
  }, [
    _,
    o,
    s,
    u,
    t.status
  ]);
  const [w] = ue(new Vb(u, x));
  ee(() => {
    w.drainMs = i, w.maxCharIntervalMs = a, w.maxCharsPerFrame = c, w.minCommitMs = l;
  }, [
    w,
    i,
    a,
    c,
    l
  ]);
  const I = ae(d);
  return ee(() => {
    if (!o) {
      w.stop();
      return;
    }
    const C = I.current !== d;
    if (I.current = d, C || !s.startsWith(w.targetText)) {
      t.status.type === "running" ? (w.currentText = "", w.targetText = s, w.lastCommitTime = 0, w.start()) : (w.currentText = s, w.targetText = s, w.stop());
      return;
    }
    w.targetText = s, w.start();
  }, [
    w,
    o,
    s,
    t.status.type,
    d
  ]), ee(() => () => {
    w.stop();
  }, [w]), pe(() => o ? {
    ...t,
    text: u,
    status: s === u ? t.status : cn
  } : t, [
    o,
    u,
    t,
    s
  ]);
}, jb = Object.freeze({ type: "complete" }), Ub = Object.freeze({
  type: "image",
  image: "",
  status: jb
}), Hb = () => k(zb);
function zb(t) {
  return t.part.type !== "image" ? Ub : t.part;
}
const qr = ge((t, e) => {
  const s = S(10);
  let n, r, o;
  s[0] !== t ? ({ smooth: r, component: o, ...n } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o) : (n = s[1], r = s[2], o = s[3]);
  const i = r === void 0 ? !0 : r, a = o === void 0 ? "span" : o, { text: c, status: l } = qb(Nb(), i);
  let u;
  return s[4] !== a || s[5] !== e || s[6] !== n || s[7] !== l.type || s[8] !== c ? (u = /* @__PURE__ */ m(a, {
    "data-status": l.type,
    ...n,
    ref: e,
    children: c
  }), s[4] = a, s[5] = e, s[6] = n, s[7] = l.type, s[8] = c, s[9] = u) : u = s[9], u;
});
qr.displayName = "MessagePartPrimitive.Text";
const jr = ge((t, e) => {
  const s = S(4), { image: n } = Hb();
  let r;
  return s[0] !== e || s[1] !== n || s[2] !== t ? (r = /* @__PURE__ */ m(Ie.img, {
    src: n,
    ...t,
    ref: e
  }), s[0] = e, s[1] = n, s[2] = t, s[3] = r) : r = s[3], r;
});
jr.displayName = "MessagePartPrimitive.Image";
const bt = (t) => {
  const e = S(2), s = ae(void 0);
  let n;
  return e[0] !== t ? (n = (r) => {
    s.current && (s.current(), s.current = void 0), r && (s.current = t(r));
  }, e[0] = t, e[1] = n) : n = e[1], n;
}, jo = (t, e) => {
  const s = t.trim().match(/^(\d+(?:\.\d+)?|\.\d+)(em|px|rem)$/);
  if (!s) return Number.POSITIVE_INFINITY;
  const n = Number(s[1]), r = s[2];
  return r === "px" ? n : r === "em" ? n * (parseFloat(getComputedStyle(e).fontSize) || 16) : r === "rem" ? n * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) : Number.POSITIVE_INFINITY;
}, Gb = (t) => t.dataset.messageId, Wb = () => {
  const t = document.createElement("div");
  return t.dataset.auiTopAnchorReserve = "", t.style.height = "0px", t.style.flexShrink = "0", t.style.pointerEvents = "none", t.setAttribute("aria-hidden", "true"), t;
}, ln = (t, e) => {
  const s = `${e}px`;
  return t.style.height !== s ? (t.style.height = s, !0) : !1;
}, Yb = (t) => {
  const e = window.devicePixelRatio || 1;
  return Math.round(t * e) / e;
}, Lc = () => {
  const t = S(4), e = re();
  let s;
  t[0] !== e.message ? (s = () => e.message, t[0] = e.message, t[1] = s) : s = t[1];
  const n = k(s);
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
  }, t[2] = n, t[3] = r) : r = t[3], bt(r);
}, Qb = () => {
  const t = S(2), e = Je(t_);
  let s;
  return t[0] !== e ? (s = (n) => n.message.role === "user" && n.message.index > 0 && n.message.index === n.thread.messages.length - 2 && n.thread.messages.at(-1)?.role === "assistant" && (n.message.id === e || n.thread.isRunning), t[0] = e, t[1] = s) : s = t[1], k(s);
}, Jb = () => {
  const t = S(2), e = Je(s_);
  let s;
  return t[0] !== e ? (s = (n) => n.message.isLast && n.message.role === "assistant" && n.message.index >= 1 && n.thread.messages.at(n.message.index - 1)?.role === "user" && (n.message.id === e || n.thread.isRunning), t[0] = e, t[1] = s) : s = t[1], k(s);
}, Xb = (t, e) => {
  const s = S(3);
  let n;
  return s[0] !== t || s[1] !== e ? (n = (r) => {
    if (t)
      return e.getState().registerAnchorElement(r);
  }, s[0] = t, s[1] = e, s[2] = n) : n = s[2], bt(n);
}, Zb = (t) => {
  const e = S(3), { active: s, threadViewportStore: n } = t;
  let r;
  return e[0] !== s || e[1] !== n ? (r = (o) => {
    if (!s) return;
    const i = n.getState(), a = i.topAnchorMessageClamp;
    return i.registerAnchorTargetElement(o, {
      tallerThan: jo(a.tallerThan, o),
      visibleHeight: jo(a.visibleHeight, o)
    });
  }, e[0] = s, e[1] = n, e[2] = r) : r = e[2], bt(r);
}, Kb = (t) => {
  const e = S(7);
  let s, n;
  e[0] !== t ? ({ forwardedRef: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  const r = Lc(), o = pt(s, r), i = k(n_);
  let a;
  return e[3] !== i || e[4] !== n || e[5] !== o ? (a = /* @__PURE__ */ m(Ie.div, {
    ...n,
    ref: o,
    "data-message-id": i
  }), e[3] = i, e[4] = n, e[5] = o, e[6] = a) : a = e[6], a;
}, e_ = (t) => {
  const e = S(13);
  let s, n, r;
  e[0] !== t ? ({ forwardedRef: s, threadViewportStore: r, ...n } = t, e[0] = t, e[1] = s, e[2] = n, e[3] = r) : (s = e[1], n = e[2], r = e[3]);
  const o = Lc(), i = Qb(), a = Jb(), c = Xb(i, r);
  let l;
  e[4] !== a || e[5] !== r ? (l = {
    active: a,
    threadViewportStore: r
  }, e[4] = a, e[5] = r, e[6] = l) : l = e[6];
  const u = Zb(l), f = pt(s, o, c, u), h = k(r_), d = i ? "" : void 0, p = a ? "" : void 0;
  let g;
  return e[7] !== h || e[8] !== n || e[9] !== f || e[10] !== d || e[11] !== p ? (g = /* @__PURE__ */ m(Ie.div, {
    ...n,
    ref: f,
    "data-message-id": h,
    "data-aui-top-anchor-user": d,
    "data-aui-top-anchor-target": p
  }), e[7] = h, e[8] = n, e[9] = f, e[10] = d, e[11] = p, e[12] = g) : g = e[12], g;
}, Vc = ge((t, e) => {
  const s = S(7), n = mt();
  if (n.getState().turnAnchor === "top") {
    let o;
    return s[0] !== e || s[1] !== t || s[2] !== n ? (o = /* @__PURE__ */ m(e_, {
      ...t,
      forwardedRef: e,
      threadViewportStore: n
    }), s[0] = e, s[1] = t, s[2] = n, s[3] = o) : o = s[3], o;
  }
  let r;
  return s[4] !== e || s[5] !== t ? (r = /* @__PURE__ */ m(Kb, {
    ...t,
    forwardedRef: e
  }), s[4] = e, s[5] = t, s[6] = r) : r = s[6], r;
});
Vc.displayName = "MessagePrimitive.Root";
function t_(t) {
  return t.topAnchorTurn?.anchorId;
}
function s_(t) {
  return t.topAnchorTurn?.targetId;
}
function n_(t) {
  return t.message.id;
}
function r_(t) {
  return t.message.id;
}
const un = {
  ...fe,
  Text: () => /* @__PURE__ */ N("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ m(qr, {}), /* @__PURE__ */ m(Br, { children: /* @__PURE__ */ m("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Image: () => /* @__PURE__ */ m(jr, {})
}, Ln = (t) => {
  const e = S(10);
  if ("children" in t) {
    let a;
    return e[0] !== t.children ? (a = /* @__PURE__ */ m(Nn, { children: t.children }), e[0] = t.children, e[1] = a) : a = e[1], a;
  }
  let s, n;
  e[2] !== t ? ({ components: s, ...n } = t, e[2] = t, e[3] = s, e[4] = n) : (s = e[3], n = e[4]);
  let r;
  e[5] !== s ? (r = s ? {
    Text: s.Text ?? un.Text,
    Image: s.Image ?? un.Image,
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
  } : un, e[5] = s, e[6] = r) : r = e[6];
  const o = r;
  let i;
  return e[7] !== n || e[8] !== o ? (i = /* @__PURE__ */ m(Nn, {
    components: o,
    ...n
  }), e[7] = n, e[8] = o, e[9] = i) : i = e[9], i;
};
Ln.displayName = "MessagePrimitive.Parts";
const qc = (t) => {
  const { children: e } = t;
  return Dg() !== void 0 ? e : null;
};
qc.displayName = "MessagePrimitive.Error";
const o_ = (t) => {
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
}, i_ = (t) => {
  const e = S(4), s = k(g_);
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
}, a_ = (t) => {
  const e = S(9);
  let s, n;
  e[0] !== t ? ({ Fallback: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  e[3] !== s || e[4] !== n.toolName ? (r = (a) => a.tools.toolUIs[n.toolName]?.[0]?.render ?? s, e[3] = s, e[4] = n.toolName, e[5] = r) : r = e[5];
  const o = k(r);
  if (!o) return null;
  let i;
  return e[6] !== o || e[7] !== n ? (i = /* @__PURE__ */ m(o, { ...n }), e[6] = o, e[7] = n, e[8] = i) : i = e[8], i;
}, c_ = (t) => {
  const e = S(9);
  let s, n;
  e[0] !== t ? ({ Fallback: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  e[3] !== s || e[4] !== n.name ? (r = (a) => {
    const c = a.dataRenderers.renderers[n.name] ?? s;
    return Array.isArray(c) ? c[0] ?? s : c;
  }, e[3] = s, e[4] = n.name, e[5] = r) : r = e[5];
  const o = k(r);
  if (!o) return null;
  let i;
  return e[6] !== o || e[7] !== n ? (i = /* @__PURE__ */ m(o, { ...n }), e[6] = o, e[7] = n, e[8] = i) : i = e[8], i;
}, je = {
  Text: () => /* @__PURE__ */ N("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ m(qr, {}), /* @__PURE__ */ m(Br, { children: /* @__PURE__ */ m("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Reasoning: () => null,
  Source: () => null,
  Image: () => /* @__PURE__ */ m(jr, {}),
  File: () => null,
  Unstable_Audio: () => null,
  Group: ({ children: t }) => t
}, l_ = (t) => {
  const e = S(37), { components: s } = t;
  let n;
  e[0] !== s ? (n = s === void 0 ? {} : s, e[0] = s, e[1] = n) : n = e[1];
  const { Text: r, Reasoning: o, Image: i, Source: a, File: c, Unstable_Audio: l, tools: u, data: f } = n, h = r === void 0 ? je.Text : r, d = o === void 0 ? je.Reasoning : o, p = i === void 0 ? je.Image : i, g = a === void 0 ? je.Source : a, _ = c === void 0 ? je.File : c, x = l === void 0 ? je.Unstable_Audio : l;
  let w;
  e[2] !== u ? (w = u === void 0 ? {} : u, e[2] = u, e[3] = w) : w = e[3];
  const I = w, C = re(), T = k(b_), E = T.type;
  if (E === "tool-call") {
    const b = C.part.addToolResult, y = C.part.resumeToolCall, M = C.part.respondToToolApproval;
    if ("Override" in I) {
      let X;
      return e[4] !== b || e[5] !== T || e[6] !== M || e[7] !== y || e[8] !== I.Override ? (X = /* @__PURE__ */ m(I.Override, {
        ...T,
        addResult: b,
        resume: y,
        respondToApproval: M
      }), e[4] = b, e[5] = T, e[6] = M, e[7] = y, e[8] = I.Override, e[9] = X) : X = e[9], X;
    }
    const P = I.by_name?.[T.toolName] ?? I.Fallback;
    let W;
    return e[10] !== P || e[11] !== b || e[12] !== T || e[13] !== M || e[14] !== y ? (W = /* @__PURE__ */ m(a_, {
      ...T,
      Fallback: P,
      addResult: b,
      resume: y,
      respondToApproval: M
    }), e[10] = P, e[11] = b, e[12] = T, e[13] = M, e[14] = y, e[15] = W) : W = e[15], W;
  }
  if (T.status?.type === "requires-action") throw new Error("Encountered unexpected requires-action status");
  switch (E) {
    case "text": {
      let b;
      return e[16] !== h || e[17] !== T ? (b = /* @__PURE__ */ m(h, { ...T }), e[16] = h, e[17] = T, e[18] = b) : b = e[18], b;
    }
    case "reasoning": {
      let b;
      return e[19] !== d || e[20] !== T ? (b = /* @__PURE__ */ m(d, { ...T }), e[19] = d, e[20] = T, e[21] = b) : b = e[21], b;
    }
    case "source": {
      let b;
      return e[22] !== g || e[23] !== T ? (b = /* @__PURE__ */ m(g, { ...T }), e[22] = g, e[23] = T, e[24] = b) : b = e[24], b;
    }
    case "image": {
      let b;
      return e[25] !== p || e[26] !== T ? (b = /* @__PURE__ */ m(p, { ...T }), e[25] = p, e[26] = T, e[27] = b) : b = e[27], b;
    }
    case "file": {
      let b;
      return e[28] !== _ || e[29] !== T ? (b = /* @__PURE__ */ m(_, { ...T }), e[28] = _, e[29] = T, e[30] = b) : b = e[30], b;
    }
    case "audio": {
      let b;
      return e[31] !== x || e[32] !== T ? (b = /* @__PURE__ */ m(x, { ...T }), e[31] = x, e[32] = T, e[33] = b) : b = e[33], b;
    }
    case "data": {
      const b = f?.by_name?.[T.name] ?? f?.Fallback;
      let y;
      return e[34] !== b || e[35] !== T ? (y = /* @__PURE__ */ m(c_, {
        ...T,
        Fallback: b
      }), e[34] = b, e[35] = T, e[36] = y) : y = e[36], y;
    }
    default:
      return console.warn(`Unknown message part type: ${E}`), null;
  }
}, u_ = (t) => {
  const e = S(5), { partIndex: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ m(l_, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ m(Mr, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, d_ = ve(u_, (t, e) => t.partIndex === e.partIndex && t.components?.Text === e.components?.Text && t.components?.Reasoning === e.components?.Reasoning && t.components?.Source === e.components?.Source && t.components?.Image === e.components?.Image && t.components?.File === e.components?.File && t.components?.Unstable_Audio === e.components?.Unstable_Audio && t.components?.tools === e.components?.tools && t.components?.data === e.components?.data && t.components?.Group === e.components?.Group), h_ = (t) => {
  const e = S(6), { status: s, component: n } = t, r = s.type === "running";
  let o;
  e[0] !== n || e[1] !== s ? (o = /* @__PURE__ */ m(n, {
    type: "text",
    text: "",
    status: s
  }), e[0] = n, e[1] = s, e[2] = o) : o = e[2];
  let i;
  return e[3] !== r || e[4] !== o ? (i = /* @__PURE__ */ m(Dr, {
    text: "",
    isRunning: r,
    children: o
  }), e[3] = r, e[4] = o, e[5] = i) : i = e[5], i;
}, f_ = Object.freeze({ type: "complete" }), m_ = (t) => {
  const e = S(6), { components: s } = t, n = k(__);
  if (s?.Empty) {
    let i;
    return e[0] !== s.Empty || e[1] !== n ? (i = /* @__PURE__ */ m(s.Empty, { status: n }), e[0] = s.Empty, e[1] = n, e[2] = i) : i = e[2], i;
  }
  const r = s?.Text ?? je.Text;
  let o;
  return e[3] !== n || e[4] !== r ? (o = /* @__PURE__ */ m(h_, {
    status: n,
    component: r
  }), e[3] = n, e[4] = r, e[5] = o) : o = e[5], o;
}, p_ = ve(m_, (t, e) => t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), Ur = (t) => {
  const e = S(9), { groupingFunction: s, components: n } = t, r = k(v_), o = i_(s);
  let i;
  e: {
    if (r === 0) {
      let u;
      e[0] !== n ? (u = /* @__PURE__ */ m(p_, { components: n }), e[0] = n, e[1] = u) : u = e[1], i = u;
      break e;
    }
    let l;
    if (e[2] !== n || e[3] !== o) {
      let u;
      e[5] !== n ? (u = (f, h) => {
        const d = n?.Group ?? je.Group;
        return /* @__PURE__ */ m(d, {
          groupKey: f.groupKey,
          indices: f.indices,
          children: f.indices.map((p) => /* @__PURE__ */ m(d_, {
            partIndex: p,
            components: n
          }, p))
        }, `group-${h}-${f.groupKey ?? "ungrouped"}`);
      }, e[5] = n, e[6] = u) : u = e[6], l = o.map(u), e[2] = n, e[3] = o, e[4] = l;
    } else l = e[4];
    i = l;
  }
  const a = i;
  let c;
  return e[7] !== a ? (c = /* @__PURE__ */ m(Ne, { children: a }), e[7] = a, e[8] = c) : c = e[8], c;
};
Ur.displayName = "MessagePrimitive.Unstable_PartsGrouped";
const jc = (t) => {
  const e = S(6);
  let s, n;
  e[0] !== t ? ({ components: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  return e[3] !== s || e[4] !== n ? (r = /* @__PURE__ */ m(Ur, {
    ...n,
    components: s,
    groupingFunction: o_
  }), e[3] = s, e[4] = n, e[5] = r) : r = e[5], r;
};
jc.displayName = "MessagePrimitive.Unstable_PartsGroupedByParentId";
function g_(t) {
  return t.message.parts;
}
function b_(t) {
  return t.part;
}
function __(t) {
  return t.message.status ?? f_;
}
function v_(t) {
  return t.message.parts.length;
}
var Vn = /* @__PURE__ */ Vr({
  AttachmentByIndex: () => fc,
  Attachments: () => mc,
  Content: () => Ln,
  Error: () => qc,
  GenerativeUI: () => sc,
  GroupedParts: () => uc,
  If: () => $c,
  PartByIndex: () => Vt,
  Parts: () => Ln,
  Quote: () => dc,
  Root: () => Vc,
  Unstable_PartsGrouped: () => Ur,
  Unstable_PartsGroupedByParentId: () => jc
});
const y_ = (t) => {
  const e = S(2), s = zs(t);
  let n;
  return e[0] !== s ? (n = (r) => {
    const o = new ResizeObserver(() => {
      s();
    }), i = new MutationObserver((a) => {
      a.some(w_) && s();
    });
    return o.observe(r), i.observe(r, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      characterData: !0
    }), () => {
      o.disconnect(), i.disconnect();
    };
  }, e[0] = s, e[1] = n) : n = e[1], bt(n);
};
function w_(t) {
  return t.type !== "attributes" || t.attributeName !== "style";
}
const S_ = ({ autoScroll: t, scrollToBottomOnRunStart: e = !0, scrollToBottomOnInitialize: s = !0, scrollToBottomOnThreadSwitch: n = !0 }) => {
  const r = ae(null), o = k((b) => b.thread.messages.length > 0), i = k((b) => b.thread.isRunning), a = ae(!1), c = ae(null), l = mt();
  t === void 0 && (t = l.getState().turnAnchor !== "top");
  const u = ae(0), f = ae(0), h = ae(0), d = ae(0), p = ae(null), g = ae(t), _ = Bt((b) => {
    const y = r.current;
    y && (g.current = !0, p.current = b, y.scrollTo({
      top: y.scrollHeight,
      behavior: b
    }));
  }, []), x = Bt(() => {
    c.current !== null && (cancelAnimationFrame(c.current), c.current = null);
  }, []), w = Bt((b) => {
    p.current = b, x(), c.current = requestAnimationFrame(() => {
      c.current = null, _(b);
    });
  }, [x, _]);
  Ct(() => () => x(), [x]);
  const I = Bt(() => {
    const b = l.getState();
    return b.turnAnchor === "top" && b.element.viewport === r.current && b.element.anchor !== null;
  }, [l]), C = () => {
    const b = r.current;
    if (!b) return;
    const y = l.getState().isAtBottom, M = Math.abs(b.scrollHeight - b.scrollTop - b.clientHeight) <= 1 || b.scrollHeight <= b.clientHeight;
    if (!(!M && u.current < b.scrollTop)) {
      const P = yh({
        scrollTop: u.current,
        scrollHeight: f.current
      }, b);
      M ? (b.scrollHeight > b.clientHeight + 1 && (p.current = null), t && (g.current = !0)) : P && (x(), p.current = null, g.current = !1), (M || p.current === null) && M !== y && Ds(l).setState({ isAtBottom: M });
    }
    u.current = b.scrollTop, f.current = b.scrollHeight;
  }, T = y_(() => {
    const b = r.current;
    if (!b) return;
    const { scrollHeight: y, clientHeight: M } = b;
    if (y === h.current && M === d.current) return;
    h.current = y, d.current = M;
    const P = p.current;
    P && I() ? p.current = null : P ? _(P) : t && !(i && I()) && g.current && _("instant"), C();
  }), E = bt((b) => {
    const y = () => {
      p.current = null;
    };
    return b.addEventListener("scroll", C), b.addEventListener("pointerdown", y), () => {
      b.removeEventListener("scroll", C), b.removeEventListener("pointerdown", y);
    };
  });
  return Ct(() => {
    if (s) {
      if (!o) {
        a.current = !1;
        return;
      }
      a.current || (a.current = !0, p.current === null && w("instant"));
    }
  }, [
    o,
    w,
    s
  ]), Rb(({ behavior: b }) => {
    _(b);
  }), ho("thread.runStart", () => {
    e && l.getState().turnAnchor !== "top" && w("auto");
  }), ho("threads.selectionChanged", () => {
    n && w("instant");
  }), pt(T, E, r);
}, Uc = ge((t, e) => {
  const s = S(6), n = re();
  let r, o;
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
  }, o = [n], s[0] = n, s[1] = r, s[2] = o) : (r = s[1], o = s[2]), ee(r, o);
  let i;
  return s[3] !== t || s[4] !== e ? (i = /* @__PURE__ */ m(Ie.div, {
    ...t,
    ref: e
  }), s[3] = t, s[4] = e, s[5] = i) : i = s[5], i;
});
Uc.displayName = "ThreadPrimitive.Root";
const Hc = (t) => {
  const { children: e } = t;
  return k(x_) ? e : null;
};
Hc.displayName = "ThreadPrimitive.Empty";
function x_(t) {
  return t.thread.isEmpty;
}
const I_ = (t) => {
  const e = S(4);
  let s;
  return e[0] !== t.disabled || e[1] !== t.empty || e[2] !== t.running ? (s = (n) => !(t.empty === !0 && !n.thread.isEmpty || t.empty === !1 && n.thread.isEmpty || t.running === !0 && !n.thread.isRunning || t.running === !1 && n.thread.isRunning || t.disabled === !0 && !n.thread.isDisabled || t.disabled === !1 && n.thread.isDisabled), e[0] = t.disabled, e[1] = t.empty, e[2] = t.running, e[3] = s) : s = e[3], k(s);
}, zc = (t) => {
  const e = S(3);
  let s, n;
  return e[0] !== t ? ({ children: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]), I_(n) ? s : null;
};
zc.displayName = "ThreadPrimitive.If";
const Gc = (t, e) => {
  const s = S(3);
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
  }, s[0] = e, s[1] = t, s[2] = n) : n = s[2], bt(n);
}, Uo = (t) => {
  let e = 0, s = t;
  for (; s; )
    e += s.offsetTop, s = s.offsetParent;
  return e;
}, T_ = (t, e) => {
  let s = 0, n = t;
  for (; n && n !== e; )
    s += n.offsetTop, n = n.offsetParent;
  return n === e ? s : Uo(t) - Uo(e);
}, Wc = ({ viewport: t, anchor: e, tallerThan: s, visibleHeight: n }) => {
  const r = T_(e, t), o = e.offsetHeight;
  return r + Math.max(0, o - (o <= s ? o : n));
}, C_ = ({ scrollHeight: t, ...e }) => {
  const { viewport: s } = e, n = Wc(e) + s.clientHeight;
  return Math.max(0, n - t);
}, E_ = ({ viewport: t, reserve: e, ...s }) => C_({
  viewport: t,
  ...s,
  scrollHeight: t.scrollHeight - e.offsetHeight
}), R_ = (t) => {
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
}, A_ = (t) => {
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
}, M_ = (t) => {
  let e = null, s;
  function n() {
    const a = t.getState(), { viewport: c, anchor: l, target: u } = a.element, f = a.targetConfig;
    if (a.turnAnchor !== "top" || !c) {
      o.disconnect(), e && (ln(e, 0), e.remove());
      return;
    }
    if (!l && !u && !f && a.topAnchorTurn) {
      o.disconnect(), e?.parentElement && e.parentElement.lastElementChild !== e && e.parentElement.append(e);
      return;
    }
    if (!l || !u || !f) {
      o.disconnect(), e && (ln(e, 0), e.remove());
      return;
    }
    if (e ??= Wb(), (e.parentElement !== u.parentElement || e.previousElementSibling !== u) && u.after(e), o.target(c, l, u), ln(e, E_({
      viewport: c,
      anchor: l,
      reserve: e,
      ...f
    }))) {
      r.schedule();
      return;
    }
    const h = Gb(l);
    if (h !== void 0 && s === h) return;
    const d = Yb(Wc({
      viewport: c,
      anchor: l,
      ...f
    }));
    Math.abs(c.scrollTop - d) > 1 && c.scrollTo({
      top: d,
      behavior: "smooth"
    }), h !== void 0 && (s = h);
  }
  const r = A_(n), o = R_(r.schedule);
  r.schedule();
  const i = t.subscribe(r.schedule);
  return () => {
    r.cancel(), i(), o.disconnect(), e?.remove();
  };
}, D_ = (t) => {
  const e = S(4), s = mt();
  let n, r;
  e[0] !== t || e[1] !== s ? (n = () => {
    if (t)
      return M_(s);
  }, r = [t, s], e[0] = t, e[1] = s, e[2] = n, e[3] = r) : (n = e[2], r = e[3]), Ct(n, r);
}, k_ = (t, e) => {
  if (!t) return !1;
  const s = e.findIndex((n) => n.id === t.targetId);
  return s < 1 ? !1 : e[s - 1]?.id === t.anchorId && e.slice(s + 1).every((n) => n.role === "user");
}, Yc = ({ isRunning: t, messages: e }) => {
  if (!t) return null;
  const s = e.at(-1), n = e.at(-2);
  return n?.role !== "user" || s?.role !== "assistant" ? null : {
    anchorId: n.id,
    targetId: s.id
  };
}, P_ = (t) => Yc(t)?.anchorId, O_ = (t) => Yc(t)?.targetId, N_ = () => {
  const t = Je(F_);
  return Gc(t, L_);
}, $_ = () => {
  const t = Je(V_);
  return bt(t);
}, B_ = (t) => {
  const e = S(19), s = mt();
  let n;
  e[0] !== t ? (n = (_) => {
    if (t)
      return P_(_.thread);
  }, e[0] = t, e[1] = n) : n = e[1];
  const r = k(n);
  let o;
  e[2] !== t ? (o = (_) => {
    if (t)
      return O_(_.thread);
  }, e[2] = t, e[3] = o) : o = e[3];
  const i = k(o), a = Je(q_);
  let c;
  e: {
    if (!r || !i) {
      c = null;
      break e;
    }
    let _;
    e[4] !== r || e[5] !== i ? (_ = {
      anchorId: r,
      targetId: i
    }, e[4] = r, e[5] = i, e[6] = _) : _ = e[6], c = _;
  }
  const l = c;
  let u;
  e[7] !== t || e[8] !== a ? (u = (_) => t && !!a && k_(a, _.thread.messages), e[7] = t, e[8] = a, e[9] = u) : u = e[9];
  const f = k(u);
  let h, d;
  e[10] !== s || e[11] !== a || e[12] !== f ? (h = () => {
    !a || f || s.getState().setTopAnchorTurn(null);
  }, d = [
    s,
    a,
    f
  ], e[10] = s, e[11] = a, e[12] = f, e[13] = h, e[14] = d) : (h = e[13], d = e[14]), Ct(h, d);
  let p, g;
  e[15] !== l || e[16] !== s ? (p = () => {
    if (!l) return;
    const _ = s.getState(), x = _.topAnchorTurn;
    x?.anchorId === l.anchorId && x.targetId === l.targetId || _.setTopAnchorTurn(l);
  }, g = [l, s], e[15] = l, e[16] = s, e[17] = p, e[18] = g) : (p = e[17], g = e[18]), Ct(p, g);
}, Qc = ge((t, e) => {
  const s = S(18);
  let n, r, o, i, a, c;
  s[0] !== t ? ({ autoScroll: n, scrollToBottomOnRunStart: a, scrollToBottomOnInitialize: i, scrollToBottomOnThreadSwitch: c, children: r, ...o } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o, s[4] = i, s[5] = a, s[6] = c) : (n = s[1], r = s[2], o = s[3], i = s[4], a = s[5], c = s[6]);
  let l;
  s[7] !== n || s[8] !== i || s[9] !== a || s[10] !== c ? (l = {
    autoScroll: n,
    scrollToBottomOnRunStart: a,
    scrollToBottomOnInitialize: i,
    scrollToBottomOnThreadSwitch: c
  }, s[7] = n, s[8] = i, s[9] = a, s[10] = c, s[11] = l) : l = s[11];
  const u = S_(l), f = N_(), h = $_(), d = mt();
  let p;
  s[12] !== d ? (p = d.getState(), s[12] = d, s[13] = p) : p = s[13];
  const g = p.turnAnchor === "top";
  B_(g), D_(g);
  const _ = pt(e, u, f, h);
  let x;
  return s[14] !== r || s[15] !== _ || s[16] !== o ? (x = /* @__PURE__ */ m(Ie.div, {
    ...o,
    ref: _,
    children: r
  }), s[14] = r, s[15] = _, s[16] = o, s[17] = x) : x = s[17], x;
});
Qc.displayName = "ThreadPrimitive.ViewportScrollable";
const Jc = ge((t, e) => {
  const s = S(13);
  let n, r, o;
  s[0] !== t ? ({ turnAnchor: o, topAnchorMessageClamp: r, ...n } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o) : (n = s[1], r = s[2], o = s[3]);
  let i;
  s[4] !== r || s[5] !== o ? (i = {
    turnAnchor: o,
    topAnchorMessageClamp: r
  }, s[4] = r, s[5] = o, s[6] = i) : i = s[6];
  let a;
  s[7] !== n || s[8] !== e ? (a = /* @__PURE__ */ m(Qc, {
    ...n,
    ref: e
  }), s[7] = n, s[8] = e, s[9] = a) : a = s[9];
  let c;
  return s[10] !== i || s[11] !== a ? (c = /* @__PURE__ */ m(Fr, {
    options: i,
    children: a
  }), s[10] = i, s[11] = a, s[12] = c) : c = s[12], c;
});
Jc.displayName = "ThreadPrimitive.Viewport";
function F_(t) {
  return t.registerViewport;
}
function L_(t) {
  return t.clientHeight;
}
function V_(t) {
  return t.registerViewportElement;
}
function q_(t) {
  return t.topAnchorTurn;
}
const Xc = ge((t, e) => {
  const s = S(3), n = Je(j_), r = Gc(n, U_), o = pt(e, r);
  let i;
  return s[0] !== t || s[1] !== o ? (i = /* @__PURE__ */ m(Ie.div, {
    ...t,
    ref: o
  }), s[0] = t, s[1] = o, s[2] = i) : i = s[2], i;
});
Xc.displayName = "ThreadPrimitive.ViewportFooter";
function j_(t) {
  return t.registerContentInset;
}
function U_(t) {
  const e = parseFloat(getComputedStyle(t).marginTop) || 0;
  return t.offsetHeight + e;
}
const H_ = (t) => {
  const e = S(5);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { behavior: n } = s, r = Je(G_), o = mt();
  let i;
  e[2] !== n || e[3] !== o ? (i = () => {
    o.getState().scrollToBottom({ behavior: n });
  }, e[2] = n, e[3] = o, e[4] = i) : i = e[4];
  const a = i;
  return r ? null : a;
}, z_ = es("ThreadPrimitive.ScrollToBottom", H_, ["behavior"]);
function G_(t) {
  return t.isAtBottom;
}
const W_ = (t) => {
  const e = S(4), { prompt: s, send: n, clearComposer: r, autoSend: o } = t, i = n ?? o ?? !1;
  let a;
  e[0] !== r || e[1] !== s || e[2] !== i ? (a = {
    prompt: s,
    send: i,
    clearComposer: r
  }, e[0] = r, e[1] = s, e[2] = i, e[3] = a) : a = e[3];
  const { disabled: c, trigger: l } = Ag(a);
  return c ? null : l;
}, Y_ = es("ThreadPrimitive.Suggestion", W_, [
  "prompt",
  "send",
  "clearComposer",
  "autoSend",
  "method"
]);
var Ot = /* @__PURE__ */ Vr({
  Empty: () => Hc,
  If: () => zc,
  MessageByIndex: () => Xa,
  Messages: () => hp,
  Root: () => Uc,
  ScrollToBottom: () => z_,
  Suggestion: () => Y_,
  SuggestionByIndex: () => gc,
  Suggestions: () => cg,
  Unstable_MessageById: () => Za,
  Viewport: () => Jc,
  ViewportFooter: () => Xc,
  ViewportProvider: () => Fr
});
function Q_({
  controller: t,
  children: e
}) {
  const s = B(
    async (o) => {
      const i = o.content.filter((a) => a.type === "text").map((a) => a.text).join("").trim();
      i && await t.send(Si(i));
    },
    [t.send]
  ), n = B(() => t.stop(), [t.stop]), r = cp({
    messages: t.messages,
    isRunning: t.running,
    isLoading: t.sessionLoading,
    isDisabled: t.sessionLoading,
    isSendDisabled: t.sendDisabled,
    convertMessage: J_,
    onNew: s,
    onCancel: n
  });
  return /* @__PURE__ */ m(Lg, { runtime: r, children: e });
}
function J_(t) {
  return t.role === "user" ? {
    id: t.id,
    role: "user",
    content: t.text ? [{ type: "text", text: t.text }] : [],
    metadata: {
      custom: Ho(t)
    }
  } : {
    id: t.id,
    role: "assistant",
    content: El(t),
    status: t.running ? { type: "running" } : t.error ? {
      type: "incomplete",
      reason: "error",
      error: t.failureMessage || t.text
    } : { type: "complete", reason: "stop" },
    metadata: {
      custom: Ho(t)
    }
  };
}
function Ho(t) {
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
const qn = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!qn || Object.keys(qn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const Nt = qn.Button, Ge = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!Ge || Object.keys(Ge).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const zo = Ge.Dialog, Go = Ge.DialogContent, Wo = Ge.DialogDescription, Yo = Ge.DialogFooter, Qo = Ge.DialogHeader, Jo = Ge.DialogTitle, jn = window.DeverFront?.sdk?.getCompatModule("@/components/ui/input");
if (!jn || Object.keys(jn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/input");
const X_ = jn.Input, Un = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!Un || Object.keys(Un).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const Z_ = Un.cn, Hn = 152, Xo = 76, Zo = 6, $t = 8;
function K_({
  session: t,
  active: e,
  controller: s
}) {
  const [n, r] = G(!1), [o, i] = G(!1), [a, c] = G(t.title), [l, u] = G(""), [f, h] = G(!1), [d, p] = G(!1), [g, _] = G(!1), [x, w] = G({
    top: 0,
    left: 0
  }), I = ne(null), C = ne(null);
  ce(() => {
    if (!g)
      return;
    const P = (j) => {
      const U = j.target;
      U instanceof Node && (I.current?.contains(U) || C.current?.contains(U) || _(!1));
    }, W = (j) => {
      j.key === "Escape" && _(!1);
    }, X = () => _(!1);
    return document.addEventListener("pointerdown", P, !0), document.addEventListener("keydown", W), document.addEventListener("scroll", X, !0), window.addEventListener("resize", X), () => {
      document.removeEventListener("pointerdown", P, !0), document.removeEventListener("keydown", W), document.removeEventListener("scroll", X, !0), window.removeEventListener("resize", X);
    };
  }, [g]);
  const T = () => {
    _(!1), c(t.title), u(""), r(!0);
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
      u(Ko(X, "编辑标题失败"));
    } finally {
      h(!1);
    }
  }, b = async () => {
    p(!0), u("");
    try {
      await s.deleteSession(t.id), i(!1);
    } catch (P) {
      u(Ko(P, "删除会话失败"));
    } finally {
      p(!1);
    }
  }, y = (P) => {
    if (P.stopPropagation(), g) {
      _(!1);
      return;
    }
    I.current && (w(ev(I.current)), _(!0));
  }, M = g && typeof document < "u" ? Jl(
    /* @__PURE__ */ N(
      "div",
      {
        ref: C,
        role: "menu",
        "aria-label": `管理会话：${t.title}`,
        "data-assistant-layer": "true",
        className: "rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        style: {
          position: "fixed",
          top: x.top,
          left: x.left,
          width: Hn,
          zIndex: _s,
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
                /* @__PURE__ */ m(fl, { className: "size-4 shrink-0" }),
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
                _(!1), u(""), i(!0);
              },
              children: [
                /* @__PURE__ */ m(ml, { className: "size-4 shrink-0" }),
                "删除"
              ]
            }
          )
        ]
      }
    ),
    tv(I.current)
  ) : null;
  return /* @__PURE__ */ N(Ne, { children: [
    /* @__PURE__ */ m("span", { ref: I, className: "flex shrink-0", children: /* @__PURE__ */ m(Ii, { label: "会话操作", children: /* @__PURE__ */ m(
      Nt,
      {
        type: "button",
        variant: "ghost",
        size: "icon",
        className: Z_(
          "size-7 shrink-0 text-muted-foreground transition-opacity hover:text-foreground",
          e ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
        ),
        "aria-label": `管理会话：${t.title}`,
        "aria-haspopup": "menu",
        "aria-expanded": g,
        onClick: y,
        children: /* @__PURE__ */ m(pl, { className: "size-4" })
      }
    ) }) }),
    M,
    /* @__PURE__ */ m(
      zo,
      {
        open: n,
        onOpenChange: (P) => {
          f || r(P);
        },
        children: /* @__PURE__ */ N(
          Go,
          {
            "data-assistant-layer": "true",
            layerZIndex: _s,
            showCloseButton: !f,
            className: "sm:max-w-md",
            children: [
              /* @__PURE__ */ N(Qo, { children: [
                /* @__PURE__ */ m(Jo, { children: "编辑标题" }),
                /* @__PURE__ */ m(Wo, { children: "修改左侧显示的会话标题。" })
              ] }),
              /* @__PURE__ */ N("form", { className: "space-y-4", onSubmit: E, children: [
                /* @__PURE__ */ m(
                  X_,
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
                /* @__PURE__ */ N(Yo, { children: [
                  /* @__PURE__ */ m(
                    Nt,
                    {
                      type: "button",
                      variant: "outline",
                      disabled: f,
                      onClick: () => r(!1),
                      children: "取消"
                    }
                  ),
                  /* @__PURE__ */ m(Nt, { type: "submit", disabled: f || !a.trim(), children: f ? "保存中..." : "保存" })
                ] })
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ m(
      zo,
      {
        open: o,
        onOpenChange: (P) => {
          d || i(P);
        },
        children: /* @__PURE__ */ N(
          Go,
          {
            "data-assistant-layer": "true",
            layerZIndex: _s,
            showCloseButton: !d,
            className: "sm:max-w-md",
            children: [
              /* @__PURE__ */ N(Qo, { children: [
                /* @__PURE__ */ m(Jo, { children: "删除对话？" }),
                /* @__PURE__ */ N(Wo, { children: [
                  "删除后，“",
                  t.title,
                  "”将从历史会话中移除。"
                ] })
              ] }),
              l ? /* @__PURE__ */ m("p", { className: "text-sm text-destructive", children: l }) : null,
              /* @__PURE__ */ N(Yo, { children: [
                /* @__PURE__ */ m(
                  Nt,
                  {
                    type: "button",
                    variant: "outline",
                    disabled: d,
                    onClick: () => i(!1),
                    children: "取消"
                  }
                ),
                /* @__PURE__ */ m(
                  Nt,
                  {
                    type: "button",
                    variant: "destructive",
                    disabled: d,
                    onClick: () => {
                      b();
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
function Ko(t, e) {
  return t instanceof Error && t.message.trim() ? t.message.trim() : e;
}
function ev(t) {
  const e = t.getBoundingClientRect(), s = Math.max(
    $t,
    window.innerWidth - Hn - $t
  ), n = Math.min(
    s,
    Math.max($t, e.right - Hn)
  ), r = e.bottom + Zo;
  return { top: r + Xo <= window.innerHeight - $t ? r : Math.max($t, e.top - Xo - Zo), left: n };
}
function tv(t) {
  return t?.closest('[data-agent-chat-layer="true"]') || document.body;
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/lib/utils"]);
const zn = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!zn || Object.keys(zn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const ei = zn.Button, Gn = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!Gn || Object.keys(Gn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const ti = Gn.cn;
function si({
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
  return /* @__PURE__ */ N(
    "aside",
    {
      className: ti(
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
        /* @__PURE__ */ m("div", { className: "agent-chat-sidebar-header shrink-0 border-b p-3", children: /* @__PURE__ */ N("div", { className: "agent-chat-sidebar-controls flex min-w-0 items-center gap-2", children: [
          i ? /* @__PURE__ */ N(
            ei,
            {
              type: "button",
              size: "icon",
              variant: "ghost",
              className: "size-9 shrink-0",
              title: "返回当前对话",
              onClick: a,
              children: [
                /* @__PURE__ */ m(_i, { className: "size-4" }),
                /* @__PURE__ */ m("span", { className: "sr-only", children: "返回当前对话" })
              ]
            }
          ) : null,
          /* @__PURE__ */ m("div", { className: "agent-chat-sidebar-name min-w-0 flex-1 truncate px-2 py-1 text-left text-sm font-semibold text-foreground", children: e ?? (t || "智能体") }),
          /* @__PURE__ */ N(
            ei,
            {
              type: "button",
              variant: "outline",
              className: "agent-chat-new-session h-10 shrink-0 justify-start gap-2 bg-background px-3",
              disabled: n.sessionLoading || !s,
              onClick: () => {
                l ? l() : n.startNewSession();
              },
              children: [
                /* @__PURE__ */ m("span", { className: "agent-chat-new-session-icon contents", children: /* @__PURE__ */ m(vi, { className: "size-4" }) }),
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
              children: n.sessionsLoading && n.sessions.length === 0 ? /* @__PURE__ */ m("div", { className: "flex h-24 items-center justify-center text-muted-foreground", children: /* @__PURE__ */ m(Ft, { className: "size-4 animate-spin" }) }) : n.sessions.length === 0 ? /* @__PURE__ */ m("div", { className: "px-2 py-6 text-center text-xs leading-5 text-muted-foreground", children: "暂无历史会话" }) : /* @__PURE__ */ N("div", { className: "space-y-1", children: [
                n.sessions.map((u) => /* @__PURE__ */ N(
                  "div",
                  {
                    className: ti(
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
                            u.running ? /* @__PURE__ */ m(Ft, { className: "size-3.5 shrink-0 animate-spin" }) : /* @__PURE__ */ m(gl, { className: "size-3.5 shrink-0" }),
                            /* @__PURE__ */ m("span", { className: "min-w-0 flex-1 truncate", children: u.title })
                          ]
                        }
                      ),
                      /* @__PURE__ */ m(
                        K_,
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
                n.sessionsLoadingMore ? /* @__PURE__ */ m("div", { className: "flex h-10 items-center justify-center text-muted-foreground", children: /* @__PURE__ */ m(Ft, { className: "size-4 animate-spin" }) }) : null
              ] })
            }
          )
        ] })
      ]
    }
  );
}
const sv = 32;
function nv(t, e, s = sv) {
  let n = t, r = null, o = !0, i = 0;
  const a = () => {
    r != null && (clearTimeout(r), r = null);
  }, c = () => {
    a(), i = ni(), e(n);
  }, l = () => {
    if (r != null)
      return;
    const u = ni() - i, f = Math.max(0, s - u);
    r = setTimeout(c, f);
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
function ni() {
  return typeof performance > "u" ? Date.now() : performance.now();
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-runner", "@/lib/runtime-stream-output", "@/lib/stream"]);
const Wt = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-runner");
if (!Wt || Object.keys(Wt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-runner");
const rv = Wt.runRuntimeStream, ov = Wt.stopRuntimeStream, iv = Wt.watchRuntimeStream, Wn = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!Wn || Object.keys(Wn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const dn = Wn.runtimeErrorMessage, Yn = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!Yn || Object.keys(Yn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const ri = Yn.streamValueText;
function av({
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
  getSessionMessages: f,
  updateSessionMessages: h,
  updateSessionTitle: d,
  syncSessionTitle: p,
  setSessionRunning: g,
  setError: _
}) {
  const [x, w] = G({}), I = ne(/* @__PURE__ */ new Map()), C = B(
    (v) => {
      v.detached || (w((A) => ({
        ...A,
        [v.sessionID]: {
          requestID: v.requestID,
          cancelable: v.cancelable,
          stopping: v.stopping
        }
      })), g(v.sessionID, !0));
    },
    [g]
  ), T = B(
    (v) => {
      const A = I.current.get(v.sessionID);
      return A && A !== v ? !1 : (I.current.set(v.sessionID, v), C(v), !0);
    },
    [C]
  ), E = B(
    (v) => {
      I.current.get(v.sessionID) === v && (v.buffer.dispose(), I.current.delete(v.sessionID), w((A) => {
        const D = { ...A };
        return delete D[v.sessionID], D;
      }), g(v.sessionID, !1));
    },
    [g]
  ), b = B(
    (v, A) => {
      v.detached || h(
        v.sessionID,
        (D) => D.map(
          (F) => Qn(F, v) ? {
            ...F,
            ...typeof A == "function" ? A(F) : A
          } : F
        )
      );
    },
    [h]
  ), y = B(
    (v, A) => {
      I.current.get(v.sessionID) === v && (v.buffer.flush(), b(v, (D) => {
        const F = Ti(A.output), q = tu(
          A.output?.document
        ), Q = {
          text: A.text,
          requestID: A.requestID || v.requestID || void 0,
          running: !1,
          error: !!A.error,
          // 运行失败由所属消息展示，输入区只承载尚未完成的操作错误。
          failureMessage: A.error ? A.failureMessage?.trim() || "智能体运行失败。" : void 0,
          activities: su(
            D.activities,
            F
          )
        };
        return nu(A.output) && (Q.output = A.output), Q.document = ks(
          D.document,
          q
        ), q && D.document?.id !== q.id && (Q.autoOpenDocument = !0), Q;
      }), E(v), v.kind !== "opening" && p(v.sessionID));
    },
    [E, p, b]
  ), M = B(
    (v, A) => {
      if (v.detached || I.current.get(v.sessionID) !== v)
        return !1;
      const D = ru(A);
      if (D.requestID && !v.requestID && (v.requestID = D.requestID), D.streamID && (v.lastStreamID = D.streamID), D.runVersion > 0) {
        if (v.runVersion > D.runVersion)
          return !0;
        v.runVersion = D.runVersion;
      }
      D.assistantMessageID > 0 && b(v, { recordID: D.assistantMessageID }), D.cancelable != null && D.cancelable !== v.cancelable && (v.cancelable = D.cancelable, C(v)), cv(D.event, D.output) && b(v, (q) => {
        const Q = Ci(
          q.document,
          D.output
        );
        return {
          document: Q,
          autoOpenDocument: q.autoOpenDocument || D.event === "document_start" && !!Q && q.document?.id !== Q?.id,
          requestID: D.requestID || v.requestID || void 0,
          running: !0
        };
      }), D.event === "reset" && (v.replayPending = !1, v.buffer.reset(ri(D.output.text)), v.buffer.flush()), (D.runtimeStatus || D.event === "reset") && b(v, (q) => ({
        output: {
          ...q.output,
          runtime_status: D.runtimeStatus
        }
      })), D.delta && (v.replayPending && (v.replayPending = !1, v.buffer.reset()), v.buffer.append(D.delta));
      const F = D.activity;
      if (F) {
        v.buffer.flush();
        const q = F.anchorText ? F : { ...F, anchorText: v.buffer.text };
        b(v, (Q) => ({
          activities: ou(
            Q.activities,
            q
          ),
          requestID: D.requestID || v.requestID || void 0,
          running: !0
        }));
      }
      return v.kind === "opening" && D.finished && D.event === "opening_skipped" ? (h(
        v.sessionID,
        (q) => q.filter((Q) => !Qn(Q, v))
      ), E(v), !1) : D.finished ? (y(v, {
        text: oi({
          text: D.finalText,
          streamedText: v.buffer.text,
          error: D.error,
          failed: D.failed
        }),
        error: D.failed,
        failureMessage: D.error,
        requestID: D.requestID,
        output: D.output
      }), !1) : !0;
    },
    [y, C, E, b, h]
  ), P = B(
    (v) => {
      const A = {
        kind: v.kind || "chat",
        sessionID: v.sessionID,
        requestID: v.requestID || "",
        userMessageID: v.userMessageID,
        assistantMessageID: v.assistantMessageID,
        createdAt: v.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        input: v.prompt || "",
        content: v.content,
        buffer: nv(v.text || "", (D) => {
          b(A, {
            text: D,
            requestID: A.requestID || void 0,
            running: !0,
            error: !1
          });
        }),
        lastStreamID: "0-0",
        cancelable: !1,
        stopping: !1,
        stopped: !1,
        detached: !1,
        replayPending: !!v.replayPending,
        runVersion: 0,
        controller: new AbortController()
      };
      return A;
    },
    [b]
  ), W = B(
    (v, A) => {
      if (!iu(A.status))
        return !1;
      const D = A.status === "fail", F = A.status === "canceled", q = oi({
        text: A.text,
        streamedText: v.buffer.text,
        error: A.error,
        failed: D,
        canceled: F
      });
      return y(v, {
        text: q,
        error: D,
        failureMessage: A.error,
        requestID: A.requestID,
        output: A.output
      }), !0;
    },
    [y]
  ), X = B(
    async (v, A) => {
      const D = A.requestID || "";
      if (!D || !v || I.current.has(v))
        return;
      const F = P({
        kind: A.kind === "opening" ? "opening" : "chat",
        sessionID: v,
        requestID: D,
        userMessageID: "",
        assistantMessageID: A.id,
        createdAt: A.createdAt,
        text: A.text,
        replayPending: !!A.text
      });
      if (!T(F)) {
        F.buffer.dispose();
        return;
      }
      try {
        const q = await Yr(
          a.status,
          D
        );
        if (F.detached || I.current.get(v) !== F || (F.runVersion = Math.max(F.runVersion, q.runVersion), W(F, q)) || (await iv({
          streamApi: a.stream,
          requestID: D,
          lastID: F.lastStreamID,
          blockMs: i,
          signal: F.controller.signal,
          // applyFrame only returns false for the current run version. Old
          // terminal frames from an interrupted attempt must not stop replay.
          stopOnResult: !1,
          recoverOnError: !0,
          fallbackToPoll: !1,
          onFrame: (oe) => M(F, oe) ? void 0 : !1
        }), F.detached || F.controller.signal.aborted || I.current.get(v) !== F))
          return;
        const Q = await Yr(
          a.status,
          D
        );
        W(F, Q);
      } catch (q) {
        if (F.detached || F.controller.signal.aborted || I.current.get(v) !== F)
          return;
        const Q = dn(
          q,
          "恢复智能体运行失败。"
        );
        y(F, {
          text: F.buffer.text.trim() || Q,
          error: !0,
          failureMessage: Q,
          requestID: D
        });
      }
    },
    [
      M,
      i,
      P,
      y,
      W,
      T,
      a.status,
      a.stream
    ]
  );
  ce(() => {
    if (!s || n || !r)
      return;
    const v = o.find(
      (D) => D.role === "assistant" && D.running && !!D.requestID
    );
    if (!v)
      return;
    let A = !1;
    return window.queueMicrotask(() => {
      A || X(r, v);
    }), () => {
      A = !0;
    };
  }, [o, s, X, r, n]);
  const j = B(
    async (v, A, D) => {
      _("");
      try {
        const F = await rv({
          requestApi: A,
          streamApi: a.stream,
          stopApi: a.stop,
          stopOnAbort: !1,
          fallbackToPoll: !1,
          blockMs: i,
          signal: v.controller.signal,
          body: D,
          onRequestID: (oe) => {
            v.detached || (v.requestID = oe, C(v), b(v, { requestID: oe }));
          },
          onFrame: (oe) => {
            M(v, oe);
          }
        });
        if (v.detached || v.stopped || I.current.get(v.sessionID) !== v)
          return;
        const q = au(F.finalOutput), Q = ri(
          F.finalOutput?.text || F.textOutput || v.buffer.text
        ).trim();
        y(v, {
          text: Q,
          output: q,
          requestID: F.requestID
        });
      } catch (F) {
        if (v.detached || v.stopped || I.current.get(v.sessionID) !== v)
          return;
        const q = dn(
          F,
          v.kind === "opening" ? "智能体开场失败。" : "智能体运行失败。"
        );
        y(v, {
          text: v.buffer.text.trim() || q,
          error: !0,
          failureMessage: q,
          requestID: v.requestID
        });
      }
    },
    [
      M,
      i,
      y,
      C,
      a.stop,
      a.stream,
      _,
      b
    ]
  ), U = B(
    async (v) => {
      const A = v.text.trim(), D = l();
      if (!xi(v) || !t || !D || I.current.has(D))
        return;
      const F = Date.now(), q = new Date(F).toISOString(), Q = {
        id: `${D}-user-${F}`,
        role: "user",
        text: A,
        createdAt: q,
        content: v.content
      }, oe = `${D}-assistant-${F}`, be = P({
        sessionID: D,
        userMessageID: Q.id,
        assistantMessageID: oe,
        createdAt: q,
        prompt: A,
        content: v.content
      });
      if (!T(be)) {
        be.buffer.dispose();
        return;
      }
      d(
        D,
        uv(u(D), A)
      ), h(D, (Oe) => [
        ...Oe,
        Q,
        {
          id: oe,
          role: "assistant",
          text: "",
          createdAt: q,
          running: !0
        }
      ]), await j(be, a.request, {
        ...c,
        agent: t,
        session_id: D,
        context_key: e,
        input: {
          text: A,
          content: v.content,
          params: v.params,
          canvas_context: v.canvas_context
        }
      });
    },
    [
      t,
      e,
      P,
      j,
      l,
      u,
      T,
      c,
      a.request,
      h,
      d
    ]
  ), he = B(
    async (v) => {
      const A = a.opening?.trim() || "";
      if (!A || !t || !v || I.current.has(v))
        return;
      const D = Date.now(), F = new Date(D).toISOString(), q = f(v).find(
        (be) => be.role === "assistant" && be.kind === "opening" && !!be.requestID
      ), Q = q?.id || `${v}-opening-${D}`, oe = P({
        kind: "opening",
        sessionID: v,
        requestID: q?.requestID,
        userMessageID: "",
        assistantMessageID: Q,
        createdAt: q?.createdAt || F,
        text: q?.text,
        replayPending: !!(q?.running && q.text)
      });
      if (!T(oe)) {
        oe.buffer.dispose();
        return;
      }
      q || h(v, (be) => [
        ...be,
        {
          id: Q,
          role: "assistant",
          kind: "opening",
          text: "",
          createdAt: F,
          running: !0
        }
      ]), await j(oe, A, {
        ...c,
        agent: t,
        session_id: v,
        context_key: e
      });
    },
    [
      t,
      e,
      P,
      j,
      f,
      T,
      c,
      a.opening,
      h
    ]
  ), de = B(async () => {
    const v = l(), A = I.current.get(v);
    if (!(!A?.requestID || !A.cancelable || A.stopping)) {
      A.stopping = !0, C(A), _("");
      try {
        if (await ov(A.requestID, a.stop), I.current.get(v) !== A)
          return;
        A.stopped = !0, A.controller.abort(), y(A, {
          text: A.buffer.text.trim() || "已停止生成",
          requestID: A.requestID
        });
      } catch (D) {
        if (I.current.get(v) !== A)
          return;
        A.stopping = !1, C(A), l() === v && _(dn(D, "停止生成失败。"));
      }
    }
  }, [y, l, C, a.stop, _]), Z = B(
    (v) => I.current.has(v),
    []
  ), H = B(
    (v, A) => lv(A, I.current.get(v)),
    []
  ), K = B(() => {
    for (const v of I.current.values())
      v.detached = !0, v.buffer.dispose(), v.controller.abort(), g(v.sessionID, !1);
    I.current.clear(), w({});
  }, [g]);
  ce(() => {
    const v = I.current;
    return () => {
      for (const A of v.values())
        A.detached = !0, A.buffer.dispose(), A.controller.abort();
      v.clear();
    };
  }, []);
  const L = x[r];
  return {
    running: !!(L || o.some(
      (v) => v.role === "assistant" && v.running
    )),
    stopping: !!L?.stopping,
    cancelable: !!L?.cancelable,
    hasRun: Z,
    mergeMessages: H,
    reset: K,
    send: U,
    startOpening: he,
    stop: de
  };
}
function Qn(t, e) {
  return t.id === e.assistantMessageID || !!(e.requestID && t.requestID === e.requestID);
}
function cv(t, e) {
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
function lv(t, e) {
  if (!e)
    return t;
  let s = !1;
  const n = t.map((r) => Qn(r, e) ? (s = !0, {
    ...r,
    requestID: e.requestID || r.requestID,
    text: e.buffer.text || r.text,
    running: !0,
    error: !1
  }) : r);
  return s ? n : [
    ...n,
    ...e.input || Rl(e.content) ? [
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
function uv(t, e) {
  return t.trim() && t.trim() !== "新会话" ? t : Array.from(e.trim().replace(/\s+/g, " ")).slice(0, 40).join("") || "新会话";
}
function oi(t) {
  const e = t.text?.trim() || t.streamedText?.trim() || "";
  return e || (t.canceled ? "已停止生成" : t.failed ? t.error?.trim() || "智能体运行失败。" : "");
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-runner", "@/lib/runtime-stream-output"]);
const Jn = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-runner");
if (!Jn || Object.keys(Jn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-runner");
const dv = Jn.watchRuntimeStream, Xn = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!Xn || Object.keys(Xn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const hv = Xn.normalizeRuntimeFrameOutput;
function fv({
  modalOpen: t,
  sessionID: e,
  messages: s,
  blockMs: n,
  runtimeApi: r,
  updateDocument: o
}) {
  const i = ne(/* @__PURE__ */ new Map());
  ce(() => {
    const a = i.current;
    if (!t || !e) {
      ii(a);
      return;
    }
    const c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
    for (const u of s)
      u.document && (c.set(u.document.id, u.document), cu(u.document) && l.set(u.document.id, u.document));
    for (const [u, f] of a) {
      const h = c.get(u);
      if (!h || f.sessionID !== e) {
        f.controller.abort(), a.delete(u);
        continue;
      }
      f.document = ks(f.document, h) || h;
    }
    for (const u of l.values()) {
      if (a.has(u.id))
        continue;
      const f = {
        sessionID: e,
        controller: new AbortController(),
        document: u
      };
      a.set(u.id, f), mv({
        watch: f,
        watches: a,
        blockMs: n,
        runtimeApi: r,
        updateDocument: o
      });
    }
  }, [n, s, t, r, e, o]), ce(() => {
    const a = i.current;
    return () => ii(a);
  }, []);
}
async function mv(t) {
  const { watch: e, watches: s, blockMs: n, runtimeApi: r, updateDocument: o } = t, i = e.document.id;
  let a = null, c = 0, l = 0;
  const u = (d) => {
    !d || e.controller.signal.aborted || (e.document = d, o(e.sessionID, i, d));
  }, f = async () => {
    const d = await Al(
      r.document,
      i
    );
    return u(ks(e.document, d)), d;
  }, h = () => {
    if (a || e.controller.signal.aborted)
      return;
    const d = new AbortController(), p = () => d.abort();
    a = d, c = Date.now(), e.controller.signal.addEventListener("abort", p, { once: !0 }), dv({
      streamApi: r.documentStream,
      requestID: `document:${i}`,
      blockMs: n,
      signal: d.signal,
      stopOnResult: !1,
      recoverOnError: !0,
      fallbackToPoll: !1,
      onFrame: (g) => {
        c = Date.now();
        const _ = bv(g);
        u(Ci(e.document, _)), _v(_) === "document_complete" && f().catch(() => {
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
      if (!Ss(d))
        return;
    } catch {
      if (e.controller.signal.aborted)
        return;
      l = 1;
    }
    for (; !e.controller.signal.aborted; ) {
      if (await gv(
        e.controller.signal,
        pv(l)
      ), e.controller.signal.aborted)
        return;
      if (!(a !== null && Date.now() - c < Math.max(6e3, n * 3)))
        try {
          const p = await f();
          if (!Ss(p))
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
function pv(t) {
  const e = [2e3, 4e3, 8e3, 12e3];
  return e[Math.min(t, e.length - 1)] ?? e[e.length - 1];
}
function gv(t, e) {
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
function bv(t) {
  return hv(t.output, t);
}
function _v(t) {
  return String(t.event || t.semantic_event || "").trim().toLowerCase();
}
function ii(t) {
  for (const e of t.values())
    e.controller.abort();
  t.clear();
}
const fs = [800, 1500, 3e3, 5e3, 8e3];
function vv({
  modalOpen: t,
  sessionID: e,
  messages: s,
  refreshSession: n
}) {
  const r = wv(s);
  ce(() => {
    if (!t || !e || !r)
      return;
    const o = new AbortController();
    return yv(e, o.signal, n), () => o.abort();
  }, [t, r, n, e]);
}
async function yv(t, e, s) {
  let n = 0;
  for (; !e.aborted; ) {
    const r = fs[Math.min(n, fs.length - 1)] ?? fs[fs.length - 1];
    if (await Sv(e, r), e.aborted)
      return;
    try {
      await s(t);
    } catch {
    }
    n += 1;
  }
}
function wv(t) {
  return t.filter((e) => !e.document).flatMap(
    (e) => Ei(e.output).filter((s) => s.status === "generating").map((s) => s.id)
  ).sort((e, s) => e - s).join(":");
}
function Sv(t, e) {
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
function ai(t, e, s) {
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
function xv(t, e) {
  const s = new Set(t.map((n) => n.id));
  return [
    ...t,
    ...e.filter((n) => !s.has(n.id))
  ];
}
function Iv(t, e) {
  const s = new Set(
    t.map((r) => r.recordID).filter((r) => !!r)
  );
  return [...e.filter(
    (r) => !r.recordID || !s.has(r.recordID)
  ), ...t];
}
function ci(t, e) {
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
function hn(t) {
  return t.map((e, s) => ({
    id: e.id ? `saved-${e.id}` : `saved-${s}`,
    recordID: e.id || void 0,
    role: e.role,
    kind: e.kind,
    text: e.text,
    createdAt: e.createdAt,
    content: e.content,
    output: e.output,
    activities: Ti(e.output),
    requestID: e.requestID || void 0,
    running: e.status === 3,
    error: e.status === 2,
    failureMessage: e.status === 2 && typeof e.output.error == "string" ? e.output.error : void 0,
    document: e.document
  }));
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output"]);
const Zn = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!Zn || Object.keys(Zn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const tt = Zn.runtimeErrorMessage, li = 20, ms = 20, ui = 10, fn = 48, Tv = [500, 1e3, 2e3, 4e3, 8e3, 8e3];
function Cv({
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
  const u = e?.trim() || (t ? `agent-runtime:${t}` : ""), [f, h] = G([]), [d, p] = G(0), [g, _] = G("新会话"), [x, w] = G([]), [I, C] = G(!1), [T, E] = G(!1), [b, y] = G(!1), [M, P] = G(""), [W, X] = G([]), j = ne(0), U = ne(/* @__PURE__ */ new Map()), he = ne(
    /* @__PURE__ */ new Map()
  ), de = ne(""), Z = ne(0), H = ne(0), K = ne(0), L = ne(!1), v = ne(!1), A = ne(!1), D = ne(0), F = ne(null), q = ne(null), Q = B(
    (R, $) => {
      j.current = R, p(R), _($.title), w($.messages), D.current = 0;
    },
    []
  ), oe = B(
    (R, $) => {
      U.current.set(R, $), j.current === R && (_($.title), w($.messages));
    },
    []
  ), be = B(() => j.current, []), Oe = B((R) => U.current.get(R)?.title || "新会话", []), ye = B((R) => U.current.get(R)?.messages || [], []), Te = B(
    (R, $) => {
      const O = U.current.get(R);
      O && oe(R, {
        ...O,
        messages: $(O.messages)
      });
    },
    [oe]
  ), z = B(
    (R, $, O) => {
      Te(
        R,
        (V) => V.map(
          (Y) => Y.document?.id === $ || O.messageID > 0 && Y.recordID === O.messageID ? {
            ...Y,
            document: ks(Y.document, O) || O
          } : Y
        )
      );
    },
    [Te]
  ), J = B(
    (R, $) => {
      const O = U.current.get(R);
      O && oe(R, { ...O, title: $ }), h(
        (V) => V.map(
          (Y) => Y.id === R ? { ...Y, title: $ } : Y
        )
      );
    },
    [oe]
  ), te = B(
    async (R) => {
      const $ = `${t}:${u}`;
      for (const O of Tv) {
        if (await Ev(O), de.current !== $)
          return;
        try {
          const V = await Ml(i, {
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
    [t, i, u, J]
  ), we = B(
    (R, $) => {
      h((O) => {
        const V = O.find(
          (Y) => Y.id === R
        );
        return V ? ai(O, { ...V, running: $ }, $) : O;
      });
    },
    []
  ), Gs = B(
    (R) => Dl(
      {
        api: i,
        agentKey: t,
        contextKey: u,
        sessionID: j.current
      },
      R
    ),
    [t, i, u]
  ), Ws = B(
    (R) => {
      const $ = j.current;
      if (!$ || !t)
        return Promise.reject(new Error("当前会话不可用"));
      const O = `${$}:${R.refType}:${R.refId}`, V = he.current.get(O);
      if (V)
        return V;
      const Y = kl(
        a.referencePreview,
        { agentKey: t, sessionID: $ },
        R
      );
      return he.current.set(O, Y), Y.catch(() => {
        he.current.get(O) === Y && he.current.delete(O);
      }), Y;
    },
    [t, a.referencePreview]
  ), se = av({
    agentKey: t,
    contextKey: u,
    modalOpen: s,
    sessionLoading: b,
    sessionID: d,
    messages: x,
    blockMs: n,
    runtimeApi: a,
    requestScope: c,
    getActiveSessionID: be,
    getSessionTitle: Oe,
    getSessionMessages: ye,
    updateSessionMessages: Te,
    updateSessionTitle: J,
    syncSessionTitle: te,
    setSessionRunning: we,
    setError: P
  });
  fv({
    modalOpen: s,
    sessionID: d,
    messages: x,
    blockMs: n,
    runtimeApi: a,
    updateDocument: z
  });
  const ts = B(
    async (R) => {
      if (!t || !u || j.current !== R)
        return;
      const $ = await Pt(i, {
        agentKey: t,
        contextKey: u,
        sessionID: R,
        limit: ms
      });
      if (j.current !== R)
        return;
      const O = se.mergeMessages(
        R,
        hn($.messages)
      );
      Te(
        R,
        (V) => ci(V, O)
      );
    },
    [
      t,
      i,
      u,
      se.mergeMessages,
      Te
    ]
  );
  vv({
    modalOpen: s,
    sessionID: d,
    messages: x,
    refreshSession: ts
  });
  const _e = B(
    (R, $ = !1) => {
      const O = R.session?.id || 0;
      if (!O)
        return;
      const V = se.mergeMessages(
        O,
        hn(R.messages)
      ), Y = U.current.get(O), Se = Y ? ci(Y.messages, V) : V, Ce = {
        title: R.session?.title || "新会话",
        messages: Se,
        oldestMessageID: Y?.oldestMessageID || R.messages[0]?.id || 0,
        canLoadOlder: Y?.canLoadOlder ?? R.messages.length > 0
      };
      if (U.current.set(O, Ce), Q(O, Ce), R.session) {
        const Xe = {
          ...R.session,
          running: se.hasRun(O) || Se.some((qe) => qe.running)
        };
        h(
          (qe) => ai(qe, Xe, $)
        );
      }
    },
    [se.hasRun, se.mergeMessages, Q]
  ), _t = B(async () => {
    if (!t || !u)
      return;
    const R = ++Z.current, $ = ++H.current;
    v.current = !0, C(!0), E(!1), j.current || y(!0), P("");
    try {
      const O = await Wr(i, {
        agentKey: t,
        contextKey: u,
        limit: li
      });
      if (Z.current !== R || H.current !== $)
        return;
      h(
        O.sessions.map((Ce) => ({
          ...Ce,
          running: !!Ce.running || se.hasRun(Ce.id)
        }))
      ), K.current = O.sessions[O.sessions.length - 1]?.id || 0, L.current = O.hasMore, C(!1);
      const V = O.sessions[0], Y = V ? U.current.get(V.id) : void 0;
      if (V && Y && (Q(V.id, Y), y(!1)), !V && r && !o) {
        j.current = 0, p(0), _("新会话"), w([]);
        return;
      }
      const Se = await Pt(i, {
        agentKey: t,
        contextKey: u,
        sessionID: V?.id,
        create: !V && !o,
        title: "新会话",
        limit: ms
      });
      Z.current === R && (_e(Se, !V), !V && o && Se.session?.id && se.startOpening(Se.session.id));
    } catch (O) {
      Z.current === R && H.current === $ && P(tt(O, "加载会话失败。"));
    } finally {
      Z.current === R && H.current === $ && (v.current = !1, C(!1), y(!1));
    }
  }, [
    t,
    _e,
    i,
    u,
    r,
    o,
    se.hasRun,
    se.startOpening,
    Q
  ]), Ve = B(
    async (R, $ = !1) => {
      if (!t || !u)
        return;
      const O = ++Z.current;
      A.current = !1;
      const V = $ ? void 0 : U.current.get(R);
      V ? (Q(R, V), y(!1)) : ($ && (j.current = 0, p(0), _("新会话"), w([])), y(!0)), P("");
      try {
        const Y = await Pt(i, {
          agentKey: t,
          contextKey: u,
          sessionID: R || void 0,
          create: $,
          title: "新会话",
          limit: $ ? ms : ui
        });
        Z.current === O && (_e(Y, $), $ && o && Y.session?.id && se.startOpening(Y.session.id));
      } catch (Y) {
        Z.current === O && P(tt(Y, "加载会话失败。"));
      } finally {
        Z.current === O && y(!1);
      }
    },
    [
      t,
      _e,
      i,
      u,
      o,
      se.startOpening,
      Q
    ]
  ), Dt = B(() => {
    Z.current += 1, A.current = !1, j.current = 0, p(0), _("新会话"), w([]), y(!1), P("");
  }, []), Ys = B(
    async () => {
      if (r && !o) {
        Dt();
        return;
      }
      await Ve(0, !0);
    },
    [r, Dt, Ve, o]
  ), sl = B(
    async (R, $) => {
      try {
        const O = await Pl(
          i,
          R,
          $
        );
        J(R, O.title), P("");
      } catch (O) {
        const V = tt(O, "编辑标题失败。");
        throw P(V), new Error(V);
      }
    },
    [i, J]
  ), nl = B(
    async (R) => {
      if (se.hasRun(R))
        throw new Error("当前会话正在生成，暂时不能删除。");
      const $ = f.findIndex(
        (V) => V.id === R
      ), O = f.filter(
        (V) => V.id !== R
      );
      try {
        if (await Ol(i, R), U.current.delete(R), h(O), P(""), j.current !== R)
          return;
        const V = Math.min(
          Math.max(0, $),
          Math.max(0, O.length - 1)
        ), Y = O[V];
        Y ? await Ve(Y.id, !1) : await Ys();
      } catch (V) {
        const Y = tt(V, "删除会话失败。");
        throw P(Y), new Error(Y);
      }
    },
    [i, Ve, se.hasRun, f, Ys]
  ), Qs = B(async () => {
    if (!t || !u || !L.current || v.current)
      return;
    const R = H.current, $ = K.current;
    v.current = !0, E(!0);
    try {
      const O = await Wr(i, {
        agentKey: t,
        contextKey: u,
        limit: li,
        lastSessionID: K.current
      });
      if (H.current !== R)
        return;
      if (O.sessions.length === 0) {
        L.current = !1;
        return;
      }
      const V = O.sessions[O.sessions.length - 1]?.id || 0;
      h(
        (Y) => xv(
          Y,
          O.sessions.map((Se) => ({
            ...Se,
            running: !!Se.running || se.hasRun(Se.id)
          }))
        )
      ), K.current = V, L.current = O.hasMore && V > 0 && V !== $;
    } catch (O) {
      H.current === R && P(tt(O, "加载更多会话失败。"));
    } finally {
      H.current === R && (v.current = !1, E(!1));
    }
  }, [t, i, u, se.hasRun]), kt = B(async () => {
    const R = j.current, $ = U.current.get(R);
    if (!R || !$?.canLoadOlder || !$.oldestMessageID || !t || !u || A.current)
      return;
    const O = q.current, V = O?.scrollHeight || 0, Y = O?.scrollTop || 0, Se = Z.current;
    A.current = !0;
    try {
      const Ce = await Pt(i, {
        agentKey: t,
        contextKey: u,
        sessionID: R,
        limit: ui,
        lastMessageID: $.oldestMessageID
      });
      if (Z.current !== Se || j.current !== R)
        return;
      const Xe = U.current.get(R);
      if (!Xe)
        return;
      if (Ce.messages.length === 0) {
        oe(R, {
          ...Xe,
          canLoadOlder: !1
        });
        return;
      }
      oe(R, {
        ...Xe,
        messages: Iv(
          Xe.messages,
          hn(Ce.messages)
        ),
        oldestMessageID: Ce.messages[0]?.id || Xe.oldestMessageID,
        canLoadOlder: !0
      }), window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const qe = q.current;
          !qe || j.current !== R || (qe.scrollTop = Y + qe.scrollHeight - V, D.current = qe.scrollTop);
        });
      });
    } catch (Ce) {
      Z.current === Se && j.current === R && P(tt(Ce, "加载历史消息失败。"));
    } finally {
      Z.current === Se && j.current === R && (A.current = !1);
    }
  }, [t, i, u, oe]), rl = B((R) => {
    const $ = R || F.current;
    $ && $.scrollHeight - $.scrollTop - $.clientHeight <= fn && Qs();
  }, [Qs]), ol = B(() => {
    const R = q.current;
    if (!R)
      return;
    const $ = D.current, O = R.scrollTop;
    D.current = O, O < $ && O <= fn && kt();
  }, [kt]), il = B(
    (R) => {
      R.deltaY < 0 && R.currentTarget.scrollTop <= fn && kt();
    },
    [kt]
  );
  ce(() => {
    if (!s || !t)
      return;
    const R = `${t}:${u}`;
    return de.current !== R && (de.current = R, se.reset(), U.current.clear(), he.current.clear(), h([]), j.current = 0, p(0), _("新会话"), w([]), K.current = 0, L.current = !1, D.current = 0), _t(), () => {
      Z.current += 1, H.current += 1, v.current = !1, A.current = !1;
    };
  }, [t, u, _t, s, se.reset]), ce(() => {
    if (!s || !t) {
      X([]);
      return;
    }
    X([]);
    let R = !0;
    return Nl(a.inputConfig, t).then(($) => {
      R && X($);
    }).catch(() => {
      R && X([]);
    }), () => {
      R = !1;
    };
  }, [t, s, a.inputConfig]);
  const al = B(
    async (R) => {
      const $ = l ? await l(R) : R;
      if (!(!xi($) || !t)) {
        if (!j.current && r) {
          y(!0), P("");
          try {
            const O = await Pt(i, {
              agentKey: t,
              contextKey: u,
              create: !0,
              title: "新会话",
              limit: ms
            });
            _e(O, !0);
          } catch (O) {
            P(tt(O, "创建会话失败。"));
            return;
          } finally {
            y(!1);
          }
        }
        await se.send($);
      }
    },
    [
      t,
      _e,
      i,
      u,
      r,
      l,
      se.send
    ]
  );
  return {
    sessionID: d,
    sessionTitle: g,
    sessions: f,
    messages: x,
    sessionsLoading: I,
    sessionsLoadingMore: T,
    sessionLoading: b,
    running: se.running,
    stopping: se.stopping,
    cancelable: se.cancelable,
    sendDisabled: !t || !d && !r || b || se.running,
    error: M,
    inputParams: W,
    sessionListRef: F,
    messageListRef: q,
    openSession: (R) => Ve(R, !1),
    startNewSession: Ys,
    renameSession: sl,
    deleteSession: nl,
    loadMoreSessions: Qs,
    loadOlderMessages: kt,
    handleSessionListScroll: rl,
    handleMessageListScroll: ol,
    handleMessageListWheel: il,
    loadReferences: Gs,
    loadReferencePreview: Ws,
    send: al,
    stop: se.stop
  };
}
function Ev(t) {
  return new Promise((e) => window.setTimeout(e, t));
}
const qt = 10;
function Rv({
  controller: t
}) {
  const e = ze(
    () => t.messages.filter(Av),
    [t.messages]
  ), s = JSON.stringify(
    e.map((d) => d.id)
  ), [n, r] = G(""), [o, i] = G(0), a = ne(null);
  ce(() => {
    const d = t.messageListRef.current, p = JSON.parse(s);
    if (!d || p.length === 0) {
      r("");
      return;
    }
    let g = 0;
    const _ = () => {
      g = 0;
      const w = Mv(d, p);
      r(
        (I) => I === w ? I : w
      );
    }, x = () => {
      g || (g = window.requestAnimationFrame(_));
    };
    return d.addEventListener("scroll", x, { passive: !0 }), window.addEventListener("resize", x), x(), () => {
      d.removeEventListener("scroll", x), window.removeEventListener("resize", x), g && window.cancelAnimationFrame(g);
    };
  }, [t.messageListRef, s]), ce(() => {
    const d = JSON.parse(s), p = d.indexOf(n);
    i((g) => p < 0 ? Kn(g, d.length) : kv(p, d.length));
  }, [n, s]), ce(() => {
    a.current && n && Pv(a.current, n);
  }, [n, s]);
  const c = B(
    (d) => {
      const p = t.messageListRef.current, g = p ? Dv(p, d) : null;
      if (!p || !g)
        return;
      const _ = p.getBoundingClientRect(), x = g.getBoundingClientRect();
      r(d), p.scrollTo({
        top: Math.max(
          0,
          p.scrollTop + x.top - _.top - 24
        ),
        behavior: "smooth"
      });
    },
    [t.messageListRef]
  ), l = B(
    (d) => {
      i(
        (p) => Kn(
          p + d * qt,
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
    o + qt
  ), f = o > 0, h = o + qt < e.length;
  return /* @__PURE__ */ N("nav", { className: "agent-chat-message-navigator", "aria-label": "用户消息快速跳转", children: [
    /* @__PURE__ */ m("style", { children: Ov }),
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
          children: /* @__PURE__ */ m(bl, {})
        }
      ),
      /* @__PURE__ */ m("div", { className: "agent-chat-message-navigator-rail", children: u.map((d, p) => /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: "agent-chat-message-navigator-mark",
          "data-active": d.id === n ? "true" : void 0,
          title: `跳转到：${di(d.text)}`,
          "aria-label": `跳转到第 ${o + p + 1} 条用户消息`,
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
          children: /* @__PURE__ */ m(yi, {})
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
        children: di(d.text)
      },
      d.id
    )) })
  ] });
}
function Av(t) {
  return t.role === "user";
}
function Mv(t, e) {
  const s = t.getBoundingClientRect(), n = s.top + Math.min(s.height * 0.28, 220), r = Zc(t);
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
function Dv(t, e) {
  return Zc(t).get(e);
}
function Zc(t) {
  return new Map(
    Array.from(
      t.querySelectorAll("[data-message-id]")
    ).map((e) => [e.dataset.messageId || "", e])
  );
}
function di(t) {
  const e = String(t || "").replace(/\s+/g, " ").trim();
  if (!e)
    return "空消息";
  const s = Array.from(e);
  return s.length > 46 ? `${s.slice(0, 46).join("")}...` : e;
}
function kv(t, e) {
  return Kn(
    t - Math.floor(qt / 2),
    e
  );
}
function Kn(t, e) {
  return Math.min(
    Math.max(0, e - qt),
    Math.max(0, t)
  );
}
function Pv(t, e) {
  const s = Array.from(
    t.querySelectorAll("[data-navigator-message-id]")
  ).find((a) => a.dataset.navigatorMessageId === e);
  if (!s)
    return;
  const n = s.offsetTop, r = n + s.offsetHeight, o = t.scrollTop + 8, i = t.scrollTop + t.clientHeight - 8;
  n < o ? t.scrollTop = Math.max(0, n - 8) : r > i && (t.scrollTop = r - t.clientHeight + 8);
}
const Ov = `
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
const er = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!er || Object.keys(er).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const Hr = er.cn, tr = window.DeverFront?.sdk?.getCompatModule("@/components/reference-composer");
if (!tr || Object.keys(tr).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/reference-composer");
const Kc = tr, Nv = Kc.ReferenceComposer, $v = Kc.ReferenceContentView, hi = "agent-chat-column", Bv = {
  "@": "hidden",
  "#": "hidden"
};
function Fv({
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
  renderMessageActions: f,
  renderArtifactActions: h,
  onOpenDocument: d,
  referenceProviders: p = []
}) {
  const g = [
    ...p,
    {
      trigger: "#",
      referenceTypes: ["message", "artifact", "upload_file", "session"],
      loadReferences: t.loadReferences,
      loadPreview: t.loadReferencePreview,
      availableScopes: ["current", "history"],
      searchPlaceholder: "搜索消息或会话"
    }
  ], _ = Uv(
    g,
    t.loadReferencePreview
  );
  return /* @__PURE__ */ N(Ot.Root, { className: "agent-chat-thread relative flex min-h-0 flex-1 flex-col bg-background", children: [
    /* @__PURE__ */ m("style", { children: Gv }),
    /* @__PURE__ */ N(Ot.ViewportProvider, { children: [
      /* @__PURE__ */ m(
        Ot.Viewport,
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
              className: Hr(
                hi,
                "agent-chat-message-column flex min-h-full flex-col"
              ),
              children: t.sessionLoading && t.messages.length === 0 ? /* @__PURE__ */ m("div", { className: "agent-chat-empty-state text-muted-foreground", children: /* @__PURE__ */ m(Ft, { className: "size-5 animate-spin" }) }) : t.messages.length === 0 ? /* @__PURE__ */ N("div", { className: "agent-chat-empty-state", children: [
                /* @__PURE__ */ m("span", { className: "flex size-10 items-center justify-center rounded-md border bg-muted/30 text-muted-foreground", children: /* @__PURE__ */ m(_l, { className: "size-5" }) }),
                /* @__PURE__ */ m("span", { className: "text-sm text-muted-foreground", children: "开始一段新对话" })
              ] }) : /* @__PURE__ */ m("div", { className: "agent-chat-message-stack flex flex-col", children: /* @__PURE__ */ m(Ot.Messages, { children: () => /* @__PURE__ */ m(
                Lv,
                {
                  controller: t,
                  loadPreview: _,
                  renderMessageActions: f,
                  renderArtifactActions: h,
                  onOpenDocument: d
                }
              ) }) })
            }
          )
        }
      ),
      /* @__PURE__ */ m(Rv, { controller: t }),
      /* @__PURE__ */ N(
        "footer",
        {
          className: "agent-chat-footer shrink-0",
          style: {
            paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))"
          },
          children: [
            /* @__PURE__ */ m(
              Ot.ScrollToBottom,
              {
                behavior: "smooth",
                className: "agent-chat-scroll-to-bottom",
                title: "回到底部",
                "aria-label": "回到底部",
                children: /* @__PURE__ */ m(vl, {})
              }
            ),
            /* @__PURE__ */ N("div", { className: hi, children: [
              t.error ? /* @__PURE__ */ m("div", { className: "mb-2 text-sm text-destructive", children: t.error }) : null,
              /* @__PURE__ */ m(
                jv,
                {
                  controller: t,
                  referenceProviders: g,
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
function Lv({
  controller: t,
  loadPreview: e,
  renderMessageActions: s,
  renderArtifactActions: n,
  onOpenDocument: r
}) {
  return k((i) => i.message.role) === "user" ? /* @__PURE__ */ m(
    Vv,
    {
      controller: t,
      loadPreview: e,
      renderMessageActions: s
    }
  ) : /* @__PURE__ */ m(
    qv,
    {
      controller: t,
      loadPreview: e,
      renderMessageActions: s,
      renderArtifactActions: n,
      onOpenDocument: r
    }
  );
}
function Vv({
  controller: t,
  loadPreview: e,
  renderMessageActions: s
}) {
  const n = k(
    (o) => o.message.metadata.custom?.content
  ), r = k(
    (o) => o.message.metadata.custom?.sourceText
  );
  return /* @__PURE__ */ N(Vn.Root, { className: "agent-chat-message agent-chat-user-message relative flex flex-col items-end pl-6 md:pl-20", children: [
    /* @__PURE__ */ m("div", { className: "agent-chat-user-bubble max-w-[88%] whitespace-pre-wrap break-words rounded-lg bg-muted px-3.5 py-2.5 text-base leading-7 text-foreground [overflow-wrap:anywhere] md:max-w-full", children: /* @__PURE__ */ m(
      $v,
      {
        content: n,
        fallback: typeof r == "string" ? r : "",
        loadPreview: e
      }
    ) }),
    /* @__PURE__ */ m(
      el,
      {
        role: "user",
        sessionTitle: t.sessionTitle,
        renderMessageActions: s
      }
    )
  ] });
}
function qv({
  controller: t,
  loadPreview: e,
  renderMessageActions: s,
  renderArtifactActions: n,
  onOpenDocument: r
}) {
  const o = k((b) => b.message.status), i = k((b) => b.message.metadata.custom?.output), a = k(
    (b) => b.message.metadata.custom?.activities
  ), c = k(
    (b) => b.message.metadata.custom?.sourceText
  ), l = k(
    (b) => b.message.metadata.custom?.document
  ), u = lu(l), f = k(
    (b) => b.message.metadata.custom?.failureMessage
  ), h = Number(
    k((b) => b.message.metadata.custom?.recordID) || 0
  ), d = Array.isArray(a) ? a : [], p = o?.type === "running" && !l && !d.some(
    (b) => ["image", "video", "audio", "file"].includes(b.kind)
  ) ? uu(i) : void 0, g = du(i), _ = g?.id ? hu(t.messages, g.id) : void 0, x = fu(i), w = Ri(
    l,
    mu(i)
  ), I = o?.type === "incomplete" && o.reason === "error", C = I && typeof f == "string" && f.trim() && (l || f.trim() !== String(c || "").trim()) ? f : "", T = !!(l && o?.type === "running" && !Ss(l) && !w), E = zv(
    o?.type === "running",
    d,
    c
  );
  return /* @__PURE__ */ m(
    Vn.Root,
    {
      className: Hr(
        "agent-chat-message relative min-w-0 [contain-intrinsic-size:auto_180px] [content-visibility:auto]",
        I && "text-destructive"
      ),
      children: /* @__PURE__ */ N(
        $l,
        {
          messageID: h,
          render: n,
          children: [
            p ? /* @__PURE__ */ m("div", { role: "status", className: "mb-3 text-xs text-muted-foreground", children: p.text }) : null,
            l ? /* @__PURE__ */ N(Ne, { children: [
              u ? /* @__PURE__ */ m(Js, { text: u, error: I }) : null,
              /* @__PURE__ */ m(
                Bl,
                {
                  document: l,
                  onOpen: r
                }
              ),
              T ? /* @__PURE__ */ m(fi, {}) : null,
              w ? /* @__PURE__ */ m(
                Js,
                {
                  text: w,
                  error: I,
                  className: "mt-4"
                }
              ) : null
            ] }) : /* @__PURE__ */ N(Ne, { children: [
              /* @__PURE__ */ m(Vn.Parts, { children: ({ part: b }) => {
                if (b.type === "text") {
                  const y = b.status.type === "running";
                  return y && !b.text && d.length === 0 ? /* @__PURE__ */ m(Hv, {}) : b.text ? /* @__PURE__ */ m(
                    Js,
                    {
                      text: b.text,
                      streaming: y,
                      error: I
                    }
                  ) : null;
                }
                if (b.type === "tool-call") {
                  const y = d.find(
                    (M) => M.id === b.toolCallId
                  );
                  return /* @__PURE__ */ m(Fl, { activity: y });
                }
                return null;
              } }),
              E ? /* @__PURE__ */ m(fi, {}) : null,
              /* @__PURE__ */ m(
                Ll,
                {
                  output: i,
                  excludeOutputs: d.map(
                    (b) => b.output
                  ),
                  excludeText: typeof c == "string" ? c : ""
                }
              )
            ] }),
            C ? /* @__PURE__ */ m("div", { role: "alert", className: "mt-3 text-sm text-destructive", children: C }) : null,
            g ? /* @__PURE__ */ m(
              Vl,
              {
                interaction: g,
                response: _,
                disabled: t.sendDisabled,
                onSubmit: (b) => {
                  t.send(
                    ql(
                      g.id || "",
                      b.text,
                      b.data
                    )
                  );
                }
              }
            ) : null,
            /* @__PURE__ */ m(
              jl,
              {
                suggestions: x,
                disabled: t.sendDisabled,
                onSelect: (b) => {
                  t.send(Si(b.prompt));
                }
              }
            ),
            /* @__PURE__ */ m(
              el,
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
function el({
  role: t,
  sessionTitle: e,
  renderMessageActions: s
}) {
  const n = k((T) => T.message.status), r = Number(
    k((T) => T.message.metadata.custom?.recordID) || 0
  ), o = String(
    k((T) => T.message.metadata.custom?.requestID) || ""
  ), i = String(
    k((T) => T.message.metadata.custom?.createdAt) || ""
  ), a = k(
    (T) => T.message.metadata.custom?.sourceText
  ), c = k(
    (T) => T.message.metadata.custom?.document
  ), l = k((T) => T.message.metadata.custom?.output), u = k(
    (T) => T.message.parts.filter((E) => E.type === "text").map((E) => E.text).join(`
`)
  ), f = c?.hydrated ? pu(c) : typeof a == "string" && a.trim() ? Ri(c, a) : u, [h, d] = G(!1), [p, g] = G(!1), _ = ne(null);
  ce(
    () => () => {
      _.current != null && window.clearTimeout(_.current);
    },
    []
  );
  const x = () => {
    _.current != null && window.clearTimeout(_.current), _.current = window.setTimeout(() => {
      d(!1), g(!1), _.current = null;
    }, 1800);
  }, w = async () => {
    if (f.trim()) {
      g(!1);
      try {
        await Zl(f), d(!0);
      } catch {
        d(!1), g(!0);
      }
      x();
    }
  }, I = !f.trim() || t === "assistant" && n?.type === "running", C = Ei(l).some(
    (T) => T.status === "generating"
  ) || !!(c && Ss(c));
  return /* @__PURE__ */ N(
    Ib.Root,
    {
      className: Hr(
        "agent-chat-message-actions",
        t === "user" && "justify-end"
      ),
      "data-message-role": t,
      children: [
        /* @__PURE__ */ m(
          Ii,
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
                disabled: I,
                onClick: () => {
                  w();
                },
                children: [
                  /* @__PURE__ */ m(yl, { className: "agent-chat-copy-icon", "aria-hidden": "true" }),
                  /* @__PURE__ */ m(wi, { className: "agent-chat-copied-icon", "aria-hidden": "true" })
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
          hasPendingArtifacts: C,
          document: c
        })
      ]
    }
  );
}
function jv({
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
  referenceProviders: f
}) {
  return /* @__PURE__ */ m(
    Nv,
    {
      placeholder: "请输入消息，输入 @ 引用资产，输入 # 引用会话信息",
      disabled: o || t.sendDisabled && !t.running,
      running: t.running,
      stopping: t.stopping,
      cancelable: t.cancelable,
      layerZIndex: _s,
      clipboardImageUploadRuleId: e,
      uploadBizKey: s,
      uploadBizName: n,
      allowResourceLibrary: r,
      renderFileLibrary: l,
      fileLibraryIncludesUpload: !0,
      referenceActionPlacements: Bv,
      toolbar: i,
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
function Uv(t, e) {
  return (s) => {
    const n = t.find(
      (r) => r.referenceTypes.includes(s.refType)
    );
    return n?.loadPreview ? n.loadPreview(s) : e(s);
  };
}
function Hv() {
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
function fi() {
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
function zv(t, e, s) {
  if (!t)
    return !1;
  const n = e.at(-1);
  return !n || n.kind !== "knowledge" && n.kind !== "skill" || n.status === "running" ? !1 : String(s || "").trimEnd() === n.anchorText.trimEnd();
}
const Gv = `
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
const ut = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dropdown-menu");
if (!ut || Object.keys(ut).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const Wv = ut.DropdownMenu, Yv = ut.DropdownMenuContent, Qv = ut.DropdownMenuItem, Jv = ut.DropdownMenuSeparator, Xv = ut.DropdownMenuTrigger, dt = window.DeverFront?.sdk?.getCompatModule("@/components/ui/select");
if (!dt || Object.keys(dt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/select");
const Zv = dt.Select, Kv = dt.SelectContent, ey = dt.SelectItem, ty = dt.SelectTrigger, sy = dt.SelectValue, sr = window.DeverFront?.sdk?.getCompatModule("@/lib/floating-layer");
if (!sr || Object.keys(sr).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/floating-layer");
const tl = sr.findFloatingLayerContainer;
function ny({
  value: t,
  powers: e,
  categories: s,
  onValueChange: n
}) {
  const r = ne(null), [o, i] = G(
    null
  ), [a, c] = G(!1), l = e.find(
    (h) => typeof t == "number" && h.id === t
  ), u = t === "auto" ? "自动选择" : l?.name || "选择", f = t === "auto" ? "自动" : u;
  return /* @__PURE__ */ N(
    Wv,
    {
      modal: !1,
      open: a,
      onOpenChange: (h) => {
        h && i(tl(r.current)), c(h);
      },
      children: [
        /* @__PURE__ */ m(Xv, { asChild: !0, children: /* @__PURE__ */ N(
          "button",
          {
            ref: r,
            type: "button",
            className: "agent-chat-execution-trigger",
            "aria-label": `选择工具，当前${u}`,
            title: u,
            children: [
              /* @__PURE__ */ N("span", { className: "agent-chat-execution-trigger-content", children: [
                t === "auto" ? /* @__PURE__ */ m(Gr, { "aria-hidden": "true" }) : l ? /* @__PURE__ */ m(gu, { power: l, size: 15 }) : null,
                /* @__PURE__ */ m("span", { children: f })
              ] }),
              /* @__PURE__ */ m(yi, { className: "agent-chat-execution-chevron" })
            ]
          }
        ) }),
        /* @__PURE__ */ N(
          Yv,
          {
            align: "start",
            container: o,
            className: "agent-chat-execution-menu",
            children: [
              /* @__PURE__ */ N(
                Qv,
                {
                  className: `agent-chat-execution-menu-item agent-chat-execution-power-item${t === "auto" ? " is-selected" : ""}`,
                  onSelect: () => n("auto"),
                  children: [
                    /* @__PURE__ */ m(Gr, { "aria-hidden": "true" }),
                    /* @__PURE__ */ m("span", { className: "min-w-0 flex-1 truncate", children: "自动选择" }),
                    t === "auto" ? /* @__PURE__ */ m(wi, { "aria-hidden": "true" }) : null
                  ]
                }
              ),
              e.length > 0 ? /* @__PURE__ */ m(Jv, {}) : null,
              /* @__PURE__ */ m(
                bu,
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
function mi({
  value: t,
  options: e,
  ariaLabel: s,
  onValueChange: n
}) {
  const r = ne(null), [o, i] = G(
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
    Zv,
    {
      value: String(t),
      onValueChange: (u) => n(Number(u)),
      onOpenChange: (u) => {
        u && i(tl(r.current));
      },
      children: [
        /* @__PURE__ */ m(
          ty,
          {
            ref: r,
            "aria-label": s,
            title: c,
            className: "agent-chat-execution-trigger agent-chat-execution-source-trigger",
            children: /* @__PURE__ */ m(sy, {})
          }
        ),
        /* @__PURE__ */ m(
          Kv,
          {
            align: "start",
            container: o,
            className: "agent-chat-execution-menu",
            children: e.map((u) => /* @__PURE__ */ m(
              ey,
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
const nr = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!nr || Object.keys(nr).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const ry = nr.isPromptParam;
function oy({
  enabled: t,
  scopeKey: e,
  toolIDField: s,
  loadConfig: n,
  loadToolForm: r,
  renderFileLibrary: o
}) {
  const [i, a] = G(null), [c, l] = G(""), [u, f] = G(0), [h, d] = G(t), [p, g] = G(""), [_, x] = G(0), [w, I] = G("auto"), [C, T] = G(0), [E, b] = G(null), [y, M] = G(!1), [P, W] = G(""), [X, j] = G(0), [U, he] = G({
    scopeKey: "",
    sessionID: 0,
    messageIdentity: ""
  }), de = ne(""), Z = ne(null), H = ne(null), K = c === e ? i : null, L = !!K?.toolsEnabled, v = L && typeof w == "number" && E?.toolID === w ? E.config : null, A = pi(
    K?.modelSourceRule,
    _
  ), D = L && typeof w == "number" && pi(v?.sourceRule, C);
  ce(() => {
    let z = !0;
    return a(null), l(""), d(t), g(""), b(null), W(""), I("auto"), T(0), Z.current = null, H.current = null, de.current = "", t ? (n().then((J) => {
      z && (a(J), l(e), x(J.selectedModelTargetID));
    }).catch((J) => {
      z && g(gi(J, "加载对话配置失败"));
    }).finally(() => {
      z && d(!1);
    }), () => {
      z = !1;
    }) : () => {
      z = !1;
    };
  }, [u, t, n, e]), ce(() => {
    if (!t || !K || U.scopeKey !== e)
      return;
    const z = `${e}:${U.sessionID}:${U.messageIdentity || "empty"}`;
    if (de.current === z) return;
    const J = Z.current;
    if (!U.messageIdentity && J && J.scopeKey === e && (J.sessionID === 0 || J.sessionID === U.sessionID))
      return;
    J && (Z.current = null), de.current = z;
    const te = U.execution;
    H.current = te ? { ...te } : null, x(ly(K, te));
    const we = uy(
      K,
      te,
      s
    );
    I(we.selection), T(we.targetID), b(null), W("");
  }, [
    K,
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
      const J = ay(
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
  ce(() => {
    if (!t || !L || typeof w != "number") {
      b(null), M(!1), W("");
      return;
    }
    if (E?.toolID === w && Number(E.config.selectedSourceID) === C)
      return;
    let z = !0;
    return M(!0), W(""), (async () => {
      try {
        return await r(w, C);
      } catch (te) {
        if (!C) throw te;
        return r(w, 0);
      }
    })().then((te) => {
      z && (b({ toolID: w, config: te }), T(Number(te.selectedSourceID || 0)));
    }).catch((te) => {
      z && (b(null), W(gi(te, "加载工具参数失败")));
    }).finally(() => {
      z && M(!1);
    }), () => {
      z = !1;
    };
  }, [
    t,
    r,
    E,
    X,
    w,
    C,
    L
  ]);
  const q = ze(() => {
    if (!(!t || !L || typeof w != "number"))
      return v ? dy(
        v.params.filter((z) => !ry(z)),
        U.execution,
        w,
        s,
        C
      ) : [];
  }, [
    v,
    U.execution,
    t,
    s,
    w,
    C,
    L
  ]), Q = B(
    (z) => {
      z !== w && (I(z), T(0), b(null), W(""), j((J) => J + 1));
    },
    [w]
  ), oe = B(
    (z) => {
      z !== C && (T(z), W(""), j((J) => J + 1));
    },
    [C]
  ), be = B(() => {
    if (p) {
      f((z) => z + 1);
      return;
    }
    b(null), W(""), j((z) => z + 1);
  }, [p]), Oe = B(
    (z) => {
      if (!t) return z;
      const J = { ...z.content };
      if (Tt(J.interaction_response)) {
        const we = H.current ? { ...H.current } : null;
        return we ? J.execution = we : delete J.execution, delete J.params, Z.current = {
          scopeKey: e,
          sessionID: U.sessionID
        }, { ...z, content: J, params: void 0 };
      }
      if (A)
        throw new Error("当前对话没有可用模型");
      const te = {
        model_target_id: _,
        tool_mode: L ? fy(w) : "none"
      };
      if (L && typeof w == "number") {
        if (!v || y || P)
          throw new Error(P || "工具参数尚未加载完成");
        if (te[s] = w, D)
          throw new Error("当前工具没有可用模型");
        te.tool_target_id = C, te.tool_params = { ...z.params || {} }, delete J.params;
      }
      return J.execution = te, Z.current = {
        scopeKey: e,
        sessionID: U.sessionID
      }, H.current = te, L && typeof w == "number" ? { ...z, content: J, params: void 0 } : { ...z, content: J };
    },
    [
      v,
      U.sessionID,
      t,
      A,
      D,
      _,
      e,
      P,
      y,
      s,
      w,
      C,
      L
    ]
  ), ye = U.scopeKey === e ? `${e}:session:${U.sessionID}` : `${e}:session:pending`, Te = h || !!p || !!K?.readiness?.warnings.length || L || rr(
    K?.modelSourceRule,
    K?.modelSources
  );
  return {
    disabled: t && (h || !!p || !K || A || L && typeof w == "number" && (y || !!P || !v || D)),
    toolbar: t && Te ? /* @__PURE__ */ m(
      iy,
      {
        config: K,
        configLoading: h,
        configError: p,
        modelTargetID: _,
        toolSelection: w,
        toolTargetID: C,
        toolForm: v,
        toolFormLoading: y,
        toolFormError: P,
        onModelChange: x,
        onToolChange: Q,
        onToolTargetChange: oe,
        onRetry: be
      }
    ) : null,
    parameters: q,
    // Parameter controls belong to the unsent conversation draft. Switching
    // tools or model sources must not discard values already entered there.
    parameterScopeKey: ye,
    prepareInput: Oe,
    renderFileLibrary: o,
    onConversationStateChange: F
  };
}
function iy({
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
  onToolTargetChange: f,
  onRetry: h
}) {
  const d = ze(
    () => (i?.sources || []).map((C) => ({
      id: Number(C.id),
      name: Xl(
        C.service_name,
        C.name,
        "未命名模型"
      )
    })).filter((C) => C.id > 0),
    [i?.sources]
  ), p = !!t?.toolsEnabled, g = s || (p ? c : ""), _ = t?.readiness?.warnings || [], x = (!p || typeof r != "number") && rr(t?.modelSourceRule, t?.modelSources), w = p && typeof r == "number" && rr(i?.sourceRule, d);
  return /* @__PURE__ */ N("div", { className: "agent-chat-execution-controls", children: [
    p || x || w ? /* @__PURE__ */ N("div", { className: "agent-chat-execution-choice-group", children: [
      p ? /* @__PURE__ */ m("div", { className: "agent-chat-execution-picker is-tool", children: /* @__PURE__ */ m(
        ny,
        {
          value: r,
          powers: t?.tools || [],
          categories: t?.categories || [],
          onValueChange: u
        }
      ) }) : null,
      x ? /* @__PURE__ */ m("div", { className: "agent-chat-execution-picker is-model", children: /* @__PURE__ */ m(
        mi,
        {
          value: n,
          options: t?.modelSources || [],
          ariaLabel: "选择智能体模型",
          onValueChange: l
        }
      ) }) : null,
      w ? /* @__PURE__ */ m("div", { className: "agent-chat-execution-picker is-model", children: /* @__PURE__ */ m(
        mi,
        {
          value: o,
          options: d,
          ariaLabel: "选择工具模型",
          onValueChange: f
        }
      ) }) : null
    ] }) : null,
    e || p && a ? /* @__PURE__ */ m(
      Ft,
      {
        className: "agent-chat-execution-loading animate-spin",
        "aria-label": "正在加载执行配置"
      }
    ) : null,
    g ? /* @__PURE__ */ m("span", { className: "agent-chat-execution-error", title: g, children: g }) : null,
    !g && _.length > 0 ? /* @__PURE__ */ N(
      "span",
      {
        className: "agent-chat-execution-warning",
        title: _.join(`
`),
        children: [
          /* @__PURE__ */ m(wl, { "aria-hidden": "true" }),
          /* @__PURE__ */ N("span", { children: [
            _[0],
            _.length > 1 ? `（另有 ${_.length - 1} 项）` : ""
          ] })
        ]
      }
    ) : null,
    g ? /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: "agent-chat-execution-retry",
        "aria-label": "重新加载执行配置",
        title: "重新加载",
        onClick: h,
        children: /* @__PURE__ */ m(Sl, {})
      }
    ) : null
  ] });
}
function ay(t, e) {
  for (let s = t.length - 1; s >= 0; s -= 1) {
    const n = t[s];
    if (n.role !== "user") continue;
    const r = Tt(n.content?.execution) ? n.content.execution : void 0, o = r && n.content?.interaction_response ? cy(
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
function cy(t, e, s, n) {
  if (String(s.tool_mode || "").trim() !== "specific" || Tt(s.tool_params))
    return s;
  const r = Number(s[n] || 0), o = Number(s.tool_target_id || 0);
  if (!r) return s;
  for (let i = e - 1; i >= 0; i -= 1) {
    const a = t[i];
    if (a.role !== "user") continue;
    const c = a.content?.execution;
    if (!(!Tt(c) || String(c.tool_mode || "").trim() !== "specific" || Number(c[n] || 0) !== r || Number(c.tool_target_id || 0) !== o || !Tt(c.tool_params)))
      return { ...s, tool_params: c.tool_params };
  }
  return s;
}
function ly(t, e) {
  if (!lr(t.modelSourceRule)) return 0;
  const s = Number(e?.model_target_id || 0);
  return t.modelSources.some((n) => n.id === s) ? s : t.selectedModelTargetID;
}
function uy(t, e, s) {
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
function dy(t, e, s, n, r) {
  if (String(e?.tool_mode || "").trim() !== "specific" || Number(e?.[n] || 0) !== s)
    return t;
  const o = Number(e?.tool_target_id || 0);
  if (o > 0 && r > 0 && o !== r)
    return t;
  const i = e?.tool_params;
  if (!Tt(i)) return t;
  let a = !1;
  const c = t.map((l) => {
    const u = String(l.key || "").trim();
    return !u || !Object.prototype.hasOwnProperty.call(i, u) ? l : (a = !0, {
      ...l,
      default_value: hy(i[u])
    });
  });
  return a ? c : t;
}
function hy(t) {
  if (t == null) return "";
  if (typeof t == "string") return t;
  if (typeof t != "object") return String(t);
  try {
    return JSON.stringify(t);
  } catch {
    return "";
  }
}
function fy(t) {
  return typeof t == "number" ? "specific" : "auto";
}
function pi(t, e) {
  return lr(t) && e <= 0;
}
function rr(t, e) {
  return lr(t) && (e?.length || 0) > 0;
}
function Tt(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function gi(t, e) {
  return t instanceof Error && t.message ? t.message : e;
}
function my({
  agentKey: t,
  configApi: e,
  toolFormApi: s
}) {
  const n = !!(t && e && s), r = B(
    () => Ul(e, t),
    [t, e]
  ), o = B(
    (i, a) => Hl(s, {
      agentKey: t,
      powerID: i,
      sourceTargetID: a
    }),
    [t, s]
  );
  return oy({
    enabled: n,
    scopeKey: `admin-agent-runtime:${t}`,
    toolIDField: "power_id",
    loadConfig: r,
    loadToolForm: o
  });
}
await window.DeverFront?.ensureCompat?.(["@/lib/store", "@/lib/stream", "@/lib/utils", "@/components/ui/button", "@/components/ui/dialog"]);
const or = window.DeverFront?.sdk?.getCompatModule("@/lib/store");
if (!or || Object.keys(or).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/store");
const ps = or.getStoreValueByPath, ir = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!ir || Object.keys(ir).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const mn = ir.streamValueText, ar = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!ar || Object.keys(ar).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const gs = ar.cn, cr = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!cr || Object.keys(cr).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const bs = cr.Button, ht = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!ht || Object.keys(ht).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const py = ht.Dialog, gy = ht.DialogContent, by = ht.DialogDescription, _y = ht.DialogHeader, vy = ht.DialogTitle;
function Dy({ item: t, store: e }) {
  const s = ss(
    e,
    () => mn(ps(e, String(t.meta?.agentPath || "")))
  ), n = ss(
    e,
    () => mn(
      ps(e, String(t.meta?.agentNamePath || ""))
    )
  ), r = String(t.meta?.openPath || ""), o = ss(
    e,
    () => r ? !!ps(e, r) : !0
  ), i = String(t.meta?.openingEnabledPath || ""), a = ss(
    e,
    () => i ? !!ps(e, i) : !!t.meta?.proactiveOpening
  ), c = String(t.meta?.executionConfigApi || ""), l = String(t.meta?.toolFormApi || ""), u = my({
    agentKey: s,
    configApi: c,
    toolFormApi: l
  }), f = ze(
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
  ), h = ze(
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
    yy,
    {
      agentKey: s,
      agentName: n,
      open: o,
      fullScreen: !!r,
      height: mn(t.meta?.height || t.meta?.containerHeight) || "min(78dvh, 720px)",
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
function yy({
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
  appearance: f = "default",
  expanded: h = !1,
  sidebarTitle: d,
  clipboardImageUploadRuleId: p = 0,
  uploadBizKey: g,
  uploadBizName: _,
  allowResourceLibrary: x = !0,
  composerDisabled: w = !1,
  composerToolbar: I,
  composerParameters: C,
  composerParameterScopeKey: T,
  renderFileLibrary: E,
  prepareInput: b,
  onConversationStateChange: y,
  onUploadedFiles: M,
  blockMs: P = 1e3,
  assistantApi: W,
  runtimeApi: X,
  requestScope: j,
  referenceProviders: U,
  renderMessageActions: he,
  renderArtifactActions: de,
  renderDocumentActions: Z,
  onToggleExpanded: H,
  onClose: K
}) {
  const L = Cv({
    agentKey: t,
    contextKey: s,
    modalOpen: n,
    blockMs: P,
    lazySession: a,
    proactiveOpening: c,
    assistantApi: W,
    runtimeApi: X,
    requestScope: j,
    prepareInput: b
  }), v = zl(), A = v.open && v.request?.kind !== "audio" && v.request?.kind !== "file", [D, F] = G("chat"), q = ne(null), [Q, oe] = G(0), [be, Oe] = G(!1), ye = u === "internal", Te = ye || l, z = ne(/* @__PURE__ */ new Set()), J = ze(
    () => L.messages.find(
      (_e) => _e.document?.id === Q
    ),
    [Q, L.messages]
  ), te = J?.document, we = !!(be && te && !A);
  ce(() => {
    v.closePreview();
  }, [t, L.sessionID, v.closePreview, n]), ce(() => {
    y?.({
      sessionID: L.sessionID,
      messages: L.messages
    });
  }, [L.messages, L.sessionID, y]), ce(() => {
    F("chat");
  }, [t, s, Te]), ce(() => {
    oe(0), Oe(!1);
  }, [t, s, L.sessionID]), ce(() => {
    z.current.clear();
  }, [t, s]), ce(() => {
    const _t = [...L.messages].reverse().find((Dt) => Dt.autoOpenDocument && Dt.document)?.document?.id || 0, Ve = `${L.sessionID}:${_t}`;
    !_t || z.current.has(Ve) || (z.current.add(Ve), oe(_t), Oe(!0));
  }, [L.messages, L.sessionID]);
  const Gs = B((_e) => {
    oe(_e.id), Oe(!0);
  }, []), Ws = B(
    async (_e) => {
      await L.openSession(_e), F("chat");
    },
    [L.openSession]
  ), se = B(async () => {
    await L.startNewSession(), F("chat");
  }, [L.startNewSession]);
  if (!n)
    return null;
  const ts = /* @__PURE__ */ m(Yl, { controller: v, children: /* @__PURE__ */ N(
    "div",
    {
      ref: q,
      "data-agent-chat-layer": "true",
      "data-agent-chat-appearance": f,
      "data-agent-chat-navigation": u,
      "data-media-inspector-open": A ? "true" : void 0,
      className: gs(
        "relative flex min-h-0 w-full flex-col overflow-hidden bg-background md:flex-row",
        i ? "h-full flex-1" : f === "canvas" ? "" : "border-y"
      ),
      style: i ? void 0 : { height: r, minHeight: o },
      children: [
        ye ? null : /* @__PURE__ */ m(
          si,
          {
            agentName: e,
            title: d,
            agentReady: !!t,
            controller: L,
            collapsed: A
          }
        ),
        Te && D === "sessions" ? /* @__PURE__ */ m(
          si,
          {
            mobile: !ye,
            embedded: ye,
            agentName: e,
            title: d,
            agentReady: !!t,
            controller: L,
            onOpenSession: Ws,
            onStartNewSession: se,
            onBack: () => F("chat")
          }
        ) : null,
        /* @__PURE__ */ N(
          "section",
          {
            className: gs(
              "min-h-0 min-w-0 flex-1 flex-col bg-background",
              Te && D === "sessions" ? ye ? "hidden" : "hidden md:flex" : "flex",
              A && "md:w-[38vw] md:min-w-[360px] md:max-w-[640px] md:flex-none"
            ),
            children: [
              /* @__PURE__ */ N("header", { className: "agent-chat-header flex h-12 shrink-0 items-center gap-2 px-3 md:h-14 md:px-6", children: [
                Te ? /* @__PURE__ */ N(
                  bs,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: gs(
                      "size-10 shrink-0",
                      !ye && "md:hidden"
                    ),
                    title: "历史会话",
                    onClick: () => F("sessions"),
                    children: [
                      ye ? /* @__PURE__ */ m(xl, { className: "size-4" }) : /* @__PURE__ */ m(_i, { className: "size-4" }),
                      /* @__PURE__ */ m("span", { className: "sr-only", children: "历史会话" })
                    ]
                  }
                ) : null,
                /* @__PURE__ */ N("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ m("div", { className: "truncate text-sm font-semibold text-foreground", children: ye ? e || "画布助手" : L.sessionTitle || "新会话" }),
                  ye ? /* @__PURE__ */ m("div", { className: "truncate text-[11px] leading-4 text-muted-foreground", children: L.sessionTitle || "新会话" }) : null
                ] }),
                /* @__PURE__ */ N(
                  bs,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: gs(
                      "size-10 shrink-0",
                      !ye && "md:hidden"
                    ),
                    title: "新对话",
                    disabled: L.sessionLoading || !t,
                    onClick: () => {
                      se();
                    },
                    children: [
                      /* @__PURE__ */ m(vi, { className: "size-4" }),
                      /* @__PURE__ */ m("span", { className: "sr-only", children: "新对话" })
                    ]
                  }
                ),
                H && !v.open ? /* @__PURE__ */ N(
                  bs,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: "size-10 shrink-0 md:size-8",
                    title: h ? "退出全屏" : "展开对话",
                    onClick: H,
                    children: [
                      h ? /* @__PURE__ */ m(Il, { className: "size-4" }) : /* @__PURE__ */ m(Tl, { className: "size-4" }),
                      /* @__PURE__ */ m("span", { className: "sr-only", children: h ? "退出全屏" : "展开对话" })
                    ]
                  }
                ) : null,
                (i || f === "canvas") && K && !v.open ? /* @__PURE__ */ N(
                  bs,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: "size-10 shrink-0 md:size-8",
                    title: "关闭对话",
                    onClick: K,
                    children: [
                      /* @__PURE__ */ m(Cl, { className: "size-4" }),
                      /* @__PURE__ */ m("span", { className: "sr-only", children: "关闭对话" })
                    ]
                  }
                ) : null
              ] }),
              /* @__PURE__ */ m(
                Q_,
                {
                  controller: L,
                  children: /* @__PURE__ */ m(
                    Fv,
                    {
                      controller: L,
                      clipboardImageUploadRuleId: p,
                      uploadBizKey: g,
                      uploadBizName: _,
                      allowResourceLibrary: x,
                      composerDisabled: w,
                      composerToolbar: I,
                      composerParameters: C,
                      composerParameterScopeKey: T,
                      renderFileLibrary: E,
                      onUploadedFiles: M,
                      referenceProviders: U,
                      renderMessageActions: he,
                      renderArtifactActions: de,
                      onOpenDocument: Gs
                    }
                  )
                },
                `${t}:${s || "default"}:${L.sessionID || "draft"}`
              )
            ]
          }
        ),
        te ? /* @__PURE__ */ m(
          Gl,
          {
            open: we,
            portalContainer: q.current,
            document: te,
            messageID: J?.recordID || 0,
            renderArtifactActions: de,
            renderDocumentActions: Z,
            onClose: () => Oe(!1)
          }
        ) : null,
        /* @__PURE__ */ m(
          Wl,
          {
            controller: v,
            renderArtifactActions: de
          }
        )
      ]
    }
  ) });
  return i ? /* @__PURE__ */ m(
    py,
    {
      open: n,
      onOpenChange: (_e) => {
        _e || K?.();
      },
      children: /* @__PURE__ */ N(
        gy,
        {
          layerClassName: eu,
          layerZIndex: Kl,
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
            /* @__PURE__ */ N(_y, { className: "sr-only", children: [
              /* @__PURE__ */ m(vy, { children: "运行智能体" }),
              /* @__PURE__ */ m(by, { children: e || t || "智能体对话" })
            ] }),
            ts
          ]
        }
      )
    }
  ) : ts;
}
export {
  yy as A,
  Dy as S,
  oy as u
};
