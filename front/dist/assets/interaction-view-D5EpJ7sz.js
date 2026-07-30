import { c as je, a as B, j as w, F as Pn } from "./createLucideIcon-Gw0gLVQ5.js";
import { R as Nn, a as ue, K as cu, e as _e, c as xt, b as de, s as yo, C as Zr, E as On, u as Re, L as Ln, J as Fn, M as hu, h as fu } from "./runtime-entry-CkPHMDB1.js";
import { c as du, a as Me, m as xo } from "./stream-DlOGAsXV.js";
import { L as Ct } from "./loader-circle-3ZsHTZm7.js";
import { C as pu, A as mu } from "./copy-Cai3ZDxm.js";
import { C as gu } from "./check-_lGX5Mgn.js";
import { C as bu } from "./chevron-right-2QoHuRdg.js";
import { F as ut } from "./file-text-Cka6tQvG.js";
import { X as wo } from "./x-CDJG94MJ.js";
import { m as ko } from "./button-DF4roUfC.js";
import { m as Gt } from "./sheet-D2kGbZbn.js";
import { m as ct } from "./utils-DDwUJ6_F.js";
import { A as yt, a as yu, c as xu } from "./clipboard-B5e8l_LF.js";
import { m as _o } from "./request-DpEDwvYb.js";
import { C as ei } from "./circle-alert-CvRrJNY4.js";
import { C as wu } from "./circle-check-AYVCInlq.js";
import { a as ku } from "./bot-D8R22pEh.js";
import { I as Bn, D as _u } from "./image-C-kQbAhR.js";
import { V as zn } from "./video-Ek8U3fJ3.js";
import { m as $n } from "./content-view-BWYCBIVh.js";
import { P as Su } from "./plus-rAwvnIn1.js";
import { g as jn } from "./_commonjsHelpers-CqEciG1_.js";
import { m as Cu } from "./interaction-panel-Cle1Og4M.js";
const vu = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
], Eu = je("arrow-right", vu);
const Iu = [
  ["path", { d: "M2 10v3", key: "1fnikh" }],
  ["path", { d: "M6 6v11", key: "11sgs0" }],
  ["path", { d: "M10 3v18", key: "yhl04a" }],
  ["path", { d: "M14 8v7", key: "3a1oy3" }],
  ["path", { d: "M18 5v13", key: "123xd1" }],
  ["path", { d: "M22 10v3", key: "154ddg" }]
], Au = je("audio-lines", Iu);
const Tu = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]], Kk = je("chevron-up", Tu);
const Ru = [
  ["path", { d: "M8 5h13", key: "1pao27" }],
  ["path", { d: "M13 12h8", key: "h98zly" }],
  ["path", { d: "M13 19h8", key: "c3s6r1" }],
  ["path", { d: "M3 10a2 2 0 0 0 2 2h3", key: "1npucw" }],
  ["path", { d: "M3 5v12a2 2 0 0 0 2 2h3", key: "x1gjn2" }]
], Du = je("list-tree", Ru);
const Mu = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "m21 3-7 7", key: "1l2asr" }],
  ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
  ["path", { d: "M9 21H3v-6", key: "wtvkvv" }]
], Pu = je("maximize-2", Mu);
const Nu = [["path", { d: "M5 12h14", key: "1ays0h" }]], Ou = je("minus", Nu);
const Lu = [
  ["path", { d: "M9 18V5l12-2v13", key: "1jmyc2" }],
  ["path", { d: "m9 9 12-2", key: "1e64n2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["circle", { cx: "18", cy: "16", r: "3", key: "1hluhg" }]
], So = je("music-4", Lu);
const Fu = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
  ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
], Bu = je("volume-2", Fu);
const zu = [
  [
    "path",
    {
      d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",
      key: "1ngwbx"
    }
  ]
], $u = je("wrench", zu);
let wt = null;
function ju(e, t) {
  e.currentIndex = 0, e.wipContextDeps = null, e.wipCommitCallbacks = [];
  const n = wt;
  wt = e;
  try {
    if (t(), e.isFirstRender = !1, e.cells.length !== e.currentIndex) throw new Error(`Rendered ${e.currentIndex} hooks but expected ${e.cells.length}. Hooks must be called in the exact same order in every render.`);
  } finally {
    wt = n;
  }
}
function Ue() {
  if (!wt) throw new Error("No resource fiber available");
  return wt;
}
function vt() {
  return wt;
}
const ti = /* @__PURE__ */ Symbol("tap.Context.defaultValue"), Uu = (e) => e;
let Ae = /* @__PURE__ */ new Map();
const tt = /* @__PURE__ */ new Set(), Co = () => new Map(Ae), Yi = (e, t) => {
  const n = Ae;
  Ae = e;
  try {
    return t();
  } finally {
    Ae = n;
  }
}, vo = (e, t) => {
  e[ti] = t;
}, Eo = (e) => typeof e == "object" && e !== null && ti in e, Io = (e) => typeof e == "object" && e !== null && "$$typeof" in e && e.$$typeof === /* @__PURE__ */ Symbol.for("react.context"), ni = (e) => Eo(e) || Io(e), Ao = (e) => {
  if (!Eo(e)) {
    if (Io(e)) {
      vo(e, e._currentValue ?? e._currentValue2);
      return;
    }
    throw new Error("A tap resource's `use()` only accepts a tap context.");
  }
}, To = (e, t, n) => {
  if (typeof e != "object" || e === null) throw new Error("useContextProvider only accepts a React context.");
  Ao(e);
  const r = e, i = Ue(), s = De(void 0), o = s.current === void 0 || !Object.is(s.current.value, t);
  X(() => {
    s.current = { value: t };
  }, [t]);
  const a = Ae.get(r), l = a !== void 0 || Ae.has(r);
  Ae.set(r, {
    value: t,
    source: i
  });
  try {
    return Vu(r, o, n);
  } finally {
    l ? Ae.set(r, a) : Ae.delete(r);
  }
}, Vu = (e, t, n) => {
  const r = tt.has(e);
  t ? tt.add(e) : tt.delete(e);
  try {
    return n();
  } finally {
    r ? tt.add(e) : tt.delete(e);
  }
}, Hu = (e) => {
  Ao(e);
  const t = e, n = qu(t, e), r = Ue();
  return (r.wipContextDeps ??= /* @__PURE__ */ new Map()).set(t, n.source), n.value;
}, qu = (e, t) => Ae.get(e) ?? {
  value: Uu(t)[ti],
  source: null
}, Ku = (e, t, n, r) => {
  if (!r) return n;
  let i = n;
  for (const [s, o] of r)
    o === t || o === e || (i ??= /* @__PURE__ */ new Map()).set(s, o);
  return i;
}, Ro = (e, t = e.wipContextDeps) => {
  const n = vt();
  !n || !t || (n.wipContextDeps = Ku(n, e, n.wipContextDeps, t));
}, Do = () => tt.size > 0, ri = (e) => {
  if (!e.contextDeps || !Do()) return !1;
  for (const t of tt.keys()) if (e.contextDeps.has(t)) return !0;
  return !1;
}, ze = {
  HookState: 0,
  EffectEvent: 1,
  PassiveEffectCleanup: 2,
  PassiveEffectSetup: 3
}, Wu = [
  ze.HookState,
  ze.EffectEvent,
  ze.PassiveEffectCleanup,
  ze.PassiveEffectSetup
];
function Ju(e) {
  const t = [];
  for (const n of Wu) {
    const r = e[n];
    if (r !== void 0)
      for (let i = 0; i < r.length; i++) try {
        r[i]();
      } catch (s) {
        t.push(s);
      }
  }
  if (t.length > 0) {
    if (t.length === 1) throw t[0];
    for (const n of t) console.error(n);
    throw new AggregateError(t, "Errors during commit");
  }
}
function Yu(e) {
  const t = [];
  for (const n of e.cells) if (n?.type === "effect" && (n.deps = null, n.cleanup))
    try {
      n.cleanup?.();
    } catch (r) {
      t.push(r);
    } finally {
      n.cleanup = void 0;
    }
  if (t.length > 0) {
    if (t.length === 1) throw t[0];
    for (const n of t) console.error(n);
    throw new AggregateError(t, "Errors during cleanup");
  }
}
const Mo = (e) => ({
  version: 0,
  committedVersion: 0,
  context: Co(),
  dispatchUpdate: e,
  changelog: [],
  rollbackCallbacks: []
}), wn = (e) => {
  e.committedVersion = e.version, e.changelog.length = 0, e.rollbackCallbacks.length = 0;
}, zt = (e, t) => {
  const n = e.version > t;
  if (e.version = t, n) {
    for (let r = 0; r < e.rollbackCallbacks.length; r++) e.rollbackCallbacks[r]();
    if (e.rollbackCallbacks.length = 0, t === e.committedVersion) e.changelog.length = 0;
    else {
      if (e.committedVersion > t) throw new Error("Version is less than committed version");
      for (; e.committedVersion + e.changelog.length > t; ) e.changelog.pop();
      for (let r = 0; r < e.changelog.length; r++) Po(e.changelog[r]);
      wn(e);
    }
  }
}, Po = (e) => {
  Oo(e.fiber, e.cell), e.queued || (e.queued = !0, (e.cell.queue ??= []).push(e));
}, Ht = (e, t, n) => {
  const r = e.wipCommitCallbacks;
  (r[t] ??= []).push(n);
}, No = (e, t) => {
  e.rollbackCallbacks.push(t);
}, Oo = (e, t) => {
  t.isDirty || (t.isDirty = !0, e.markDirty?.(), No(e.root, () => {
    if (t.queue !== null) {
      for (const n of t.queue) n.queued = !1;
      t.queue = null;
    }
    t.workInProgress = t.current, t.isDirty = !1;
  }));
}, ii = () => {
  throw new Error("Rendered more hooks than during the previous render. Hooks must be called in the exact same order in every render.");
}, si = () => {
  throw new Error("Hook order changed between renders");
}, Qu = (e, t, n) => {
  if (e.isNeverMounted) throw new Error("Resource updated before mount");
  let r = !1, i = !0;
  e.root.dispatchUpdate(() => (r || (r = !0, n && e.root.changelog.length === 0 && !t.cell.isDirty && !t.hasEagerState && (t.eagerState = n(t.cell.workInProgress, t.action), t.hasEagerState = !0, i = !Object.is(t.cell.current, t.eagerState))), i), () => (r = !0, i = !0, Po(t), e.root.changelog.push(t), !0));
}, Gu = (e, t, n, r, i) => {
  const s = r ? r(n) : n, o = {
    type: "reducer",
    workInProgress: s,
    current: s,
    isDirty: !1,
    queue: null,
    renderQueue: null,
    reducer: t,
    dispatch: (a) => {
      const l = vt();
      if (l !== null) {
        if (l !== e) throw new Error("Cannot update a resource while rendering a different resource.");
        (e.renderPendingCells ??= /* @__PURE__ */ new Set()).add(o), (o.renderQueue ??= []).push(a);
      } else Qu(e, {
        fiber: e,
        cell: o,
        action: a,
        hasEagerState: !1,
        eagerState: void 0,
        queued: !1
      }, i ? t : void 0);
    }
  };
  return o;
};
function Lo(e, t, n, r) {
  const i = Ue(), s = i.currentIndex++, o = i.cells[s], a = (() => {
    if (o !== void 0) return o.type === "reducer" ? o : si();
    !i.isFirstRender && s >= i.cells.length && ii();
    const u = Gu(i, e, t, n, r);
    return i.cells[s] = u, u;
  })(), l = a.queue;
  if (l !== null) {
    const u = e === a.reducer;
    for (let h = 0; h < l.length; h++) {
      const c = l[h];
      (!c.hasEagerState || !u) && (c.eagerState = e(a.workInProgress, c.action), c.hasEagerState = !0), c.queued = !1, a.workInProgress = c.eagerState;
    }
    a.queue = null;
  }
  if (a.reducer = e, a.renderQueue !== null) {
    let u = a.workInProgress;
    for (const h of a.renderQueue) u = e(u, h);
    a.renderQueue = null, i.renderPendingCells?.delete(a), Object.is(u, a.workInProgress) || (Oo(i, a), a.workInProgress = u);
  }
  return a.isDirty && Ht(i, ze.HookState, () => {
    a.current = a.workInProgress, a.isDirty = !1;
  }), [a.workInProgress, a.dispatch];
}
function Fo(e, t, n) {
  return Lo(e, t, n, !1);
}
const Xu = (e, t) => typeof t == "function" ? t(e) : t, Zu = (e) => e === void 0 ? void 0 : typeof e == "function" ? e() : e;
function oi(e) {
  return Lo(Xu, e, Zu, !0);
}
const Un = (e, t) => {
  for (let n = 0; n < e.length && n < t.length; n++) if (!Object.is(e[n], t[n])) return !1;
  return !0;
}, Qi = (e, t) => {
  Ht(e, ze.HookState, () => {
    t.current = t.wip, t.currentDeps = t.wipDeps, t.isDirty = !1;
  });
}, Vn = (e, t) => {
  const n = Ue(), r = n.currentIndex++;
  let i = n.cells[r];
  if (i === void 0) {
    !n.isFirstRender && r >= n.cells.length && ii();
    const a = e();
    return i = {
      type: "memo",
      current: a,
      currentDeps: t,
      wip: a,
      wipDeps: t,
      isDirty: !1
    }, n.cells[r] = i, a;
  }
  i.type !== "memo" && si();
  const s = i;
  if (Un(s.wipDeps, t))
    return s.isDirty && Qi(n, s), s.wip;
  const o = e();
  return s.wip = o, s.wipDeps = t, s.isDirty || (s.isDirty = !0, No(n.root, () => {
    s.wip = s.current, s.wipDeps = s.currentDeps, s.isDirty = !1;
  })), Qi(n, s), o;
};
function Hn(e) {
  return Vn(() => ({ current: e }), []);
}
const ai = (e, t) => Vn(() => e, t), ec = () => ({
  type: "effect",
  cleanup: void 0,
  deps: null
});
function kt(e, t) {
  const n = Ue(), r = n.currentIndex++, i = n.cells[r], s = i === void 0 ? ec() : i.type === "effect" ? i : si();
  if (i === void 0 && (!n.isFirstRender && r >= n.cells.length && ii(), n.cells[r] = s), !(t && s.deps && Un(s.deps, t))) {
    if (s.deps !== null && !!t != !!s.deps) throw new Error("useEffect called with and without dependencies across re-renders");
    Ht(n, ze.PassiveEffectCleanup, () => {
      try {
        s.cleanup?.();
      } finally {
        s.cleanup = void 0;
      }
    }), Ht(n, ze.PassiveEffectSetup, () => {
      try {
        const o = e();
        if (o !== void 0 && typeof o != "function") throw new Error(`An effect function must either return a cleanup function or nothing. Received: ${typeof o}`);
        s.cleanup = o;
      } finally {
        s.deps = t;
      }
    });
  }
}
function li(e) {
  const t = Ue(), n = Hn(e);
  return n.current !== e && Ht(t, ze.EffectEvent, () => {
    n.current = e;
  }), ai(((...r) => n.current(...r)), []);
}
const kn = (e) => {
  if (!ni(e)) throw new Error("A tap resource's `use()` only accepts a tap context.");
  return Hu(e);
}, Bo = (e, t, n = t) => {
  const r = Hn(!0), i = r.current ? n() : t();
  r.current = !1;
  const [, s] = oi(0), o = li(() => {
    try {
      if (Object.is(i, t())) return;
    } catch {
      return;
    }
    s((a) => a + 1);
  });
  return kt(() => (o(), e(o)), [e]), i;
}, zo = (e, t) => {
}, tc = Nn;
function nc(e) {
  const t = ue(e);
  return cu(() => {
    t.current = e;
  }), _e(((...n) => t.current(...n)), []);
}
const rc = tc.useEffectEvent ?? nc, me = () => vt() !== null, ge = Nn, Se = (e) => me() ? oi(e) : ge.useState(e), ic = (e, t, n) => me() ? Fo(e, t, n) : ge.useReducer(e, t, n), De = (e) => me() ? Hn(e) : ge.useRef(e), he = (e, t) => me() ? Vn(e, t) : ge.useMemo(e, t), sc = (e, t) => me() ? ai(e, t) : ge.useCallback(e, t), X = (e, t) => me() ? kt(e, t) : ge.useEffect(e, t), Wk = (e, t) => me() ? kt(e, t) : ge.useLayoutEffect(e, t), $o = (e) => me() ? li(e) : rc(e), jo = (e, t, n) => me() ? Bo(e, t, n) : ge.useSyncExternalStore(e, t, n), oc = (e, t) => me() ? zo() : ge.useDebugValue(e, t), Xt = (e) => {
  const t = ge.createContext(e);
  return vo(t, e), t;
}, Uo = (e) => me() && ni(e) ? kn(e) : ge.use(e), ui = (e) => me() && ni(e) ? kn(e) : ge.useContext(e), Vo = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), Ho = (e) => new Array(e).fill(Vo), ac = (e, t) => {
  const n = e.memoCache;
  let r = n.workInProgress;
  if (r === null) {
    const o = n.current;
    r = o === null ? [] : o.map((a) => a.slice()), n.workInProgress = r;
  }
  const i = n.index++;
  let s = r[i];
  return s === void 0 && (s = Ho(t), r[i] = s), s;
}, qo = (e) => ac(Ue(), e), lc = Nn, uc = (e) => xt(() => {
  const t = Ho(e);
  return t[Vo] = !0, t;
}, []), cc = lc.__COMPILER_RUNTIME?.c ?? uc, hc = () => vt() !== null, be = (e) => hc() ? qo(e) : cc(e);
function ht(e) {
  return (...t) => ({
    hook: e,
    args: t
  });
}
function ci(e, t, n) {
  return typeof t == "function" ? (...r) => ci(e, t(...r)) : n ? {
    ...t,
    key: e,
    deps: n
  } : {
    ...t,
    key: e
  };
}
const fc = 50;
let nt = {
  schedulers: /* @__PURE__ */ new Set([]),
  isScheduled: !1
};
var dc = class {
  _isDirty = !1;
  _task;
  constructor(e) {
    this._task = e;
  }
  get isDirty() {
    return this._isDirty;
  }
  markDirty() {
    this._isDirty = !0, nt.schedulers.add(this), pc();
  }
  runTask() {
    this._isDirty = !1, this._task();
  }
};
const pc = () => {
  nt.isScheduled || (nt.isScheduled = !0, mc());
}, Gi = () => {
  try {
    const e = [];
    let t = 0;
    for (const n of nt.schedulers)
      if (nt.schedulers.delete(n), !!n.isDirty) {
        if (t++, t > fc) throw new Error("Maximum update depth exceeded. This can happen when a resource repeatedly calls setState inside useEffect.");
        try {
          n.runTask();
        } catch (r) {
          e.push(r);
        }
      }
    if (e.length > 0) {
      if (e.length === 1) throw e[0];
      for (const n of e) console.error(n);
      throw new AggregateError(e, "Errors occurred during flushSync");
    }
  } finally {
    nt.schedulers.clear(), nt.isScheduled = !1;
  }
}, mc = (() => {
  if (typeof MessageChannel < "u") {
    let e = null, t;
    return () => {
      if (!e) {
        const n = new MessageChannel();
        n.port1.onmessage = () => {
          e?.unref?.(), Gi();
        }, e = n.port1, t = n.port2;
      }
      e.ref?.(), t.postMessage(null);
    };
  }
  return () => setTimeout(Gi, 0);
})(), gc = {
  useState: oi,
  useReducer: Fo,
  useRef: Hn,
  useMemo: Vn,
  useCallback: ai,
  useEffect: kt,
  useLayoutEffect: kt,
  useInsertionEffect: kt,
  useEffectEvent: li,
  useContext: kn,
  use: kn,
  useSyncExternalStore: Bo,
  useDebugValue: zo,
  useMemoCache: qo
}, Xi = Nn, Ge = Xi.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ?? Xi.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, rn = Ge == null ? null : "H" in Ge ? {
  get current() {
    return Ge.H;
  },
  set current(e) {
    Ge.H = e;
  }
} : "ReactCurrentDispatcher" in Ge ? {
  get current() {
    return Ge.ReactCurrentDispatcher.current;
  },
  set current(e) {
    Ge.ReactCurrentDispatcher.current = e;
  }
} : null;
function bc(e) {
  if (!rn) return e();
  const t = rn.current;
  rn.current = gc;
  try {
    return e();
  } finally {
    rn.current = t;
  }
}
function Ko(e, t, n = void 0, r) {
  return {
    hook: e,
    root: t,
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
function _t(e) {
  if (!e.isMounted) throw new Error("Tried to unmount a fiber that is already unmounted");
  e.isMounted = !1, Yu(e);
}
function it(e, t) {
  if (e.memoCache.workInProgress = null, e.renderPendingCells !== null) {
    for (const i of e.renderPendingCells) i.renderQueue = null;
    e.renderPendingCells.clear();
  }
  let n = 0, r;
  do {
    if (++n > 25) throw new Error("Too many re-renders. tap limits the number of renders to prevent an infinite loop.");
    e.memoCache.index = 0, ju(e, () => {
      r = bc(() => e.hook(...t));
    });
  } while ((e.renderPendingCells?.size ?? 0) > 0);
  return Ro(e), r;
}
function qt(e) {
  const t = e.wipCommitCallbacks ?? e.commitCallbacks ?? [];
  e.wipCommitCallbacks = null, e.commitCallbacks = t, e.isMounted = !0, e.contextDeps = e.wipContextDeps, wn(e.root), e.memoCache.workInProgress !== null && (e.memoCache.current = e.memoCache.workInProgress, e.memoCache.workInProgress = null), e.isNeverMounted = !1, Ju(t);
}
const yc = () => {
  const e = Ue();
  return e.devStrictMode ? e.isFirstRender ? "child" : "root" : null;
}, xc = () => null, wc = () => xc, Wo = () => vt() ? yc : wc(), kc = (e) => e(), _c = (e) => {
  const [t] = Se(() => new dc(() => d())), [n] = Se(() => []), r = Wo(), [i] = Se(() => {
    const p = Mo((y, x) => {
      if (!t.isDirty) {
        if (!y()) return;
        x();
      }
      zt(p, p.committedVersion + p.changelog.length), n.push(x), t.markDirty();
    });
    return Ko(kc, p, void 0, r());
  }), s = Co(), o = i.root.version - i.root.committedVersion, a = Yi(s, () => it(i, [e])), l = De(!1), u = De([e]), h = De(a), [c] = Se(() => /* @__PURE__ */ new Set()), f = (p) => {
    t.isDirty || h.current === p || (h.current = p, c.forEach((y) => y()));
  }, d = $o(() => {
    zt(i.root, i.root.committedVersion), n.forEach((y) => {
      y();
    }), zt(i.root, i.root.committedVersion + i.root.changelog.length);
    const p = Yi(i.root.context, () => it(i, u.current));
    if (t.isDirty) throw new Error("Scheduler is dirty, this should never happen");
    wn(i.root), n.length = 0, l.current && qt(i), f(p);
  });
  return X(() => (l.current = !0, () => {
    l.current = !1, _t(i);
  }), [i]), X(() => {
    u.current = [e], wn(i.root), n.splice(0, o), i.root.context = s, qt(i), f(a);
  }), he(() => ({
    getValue: () => h.current,
    subscribe: (p) => (c.add(p), () => c.delete(p))
  }), [c]);
}, Sc = () => {
  const e = De(0), t = e.current, n = Ue();
  return {
    version: t,
    markDirty: he(() => () => {
      e.current++, n?.markDirty?.();
    }, [n]),
    root: n.root
  };
}, Cc = () => {
  const [e] = Se(() => Mo((i, s) => {
    let o = !1;
    r((a) => (o = !i(), o ? a : a + 1)), o || n(s);
  })), [t, n] = ic((i, s) => (zt(e, i), i + (s() ? 1 : 0)), 0), [, r] = Se(0);
  return zt(e, t), {
    root: e,
    version: t,
    markDirty: void 0
  };
}, hi = () => {
  const e = Wo(), { root: t, version: n, markDirty: r } = vt() ? Sc() : Cc();
  return {
    version: n,
    createFiber: sc((i, s, o) => Ko(i, t, o ? () => {
      o(), r?.();
    } : r, e()), [])
  };
}, Jo = (e, t, n) => {
  const r = De(null), i = r.current ?? (r.current = {
    wipDeps: null,
    wip: null,
    currentDeps: null,
    current: null
  });
  return i.wipDeps = i.currentDeps, i.wip = i.current, X(() => {
    i.currentDeps = i.wipDeps, i.current = i.wip;
  }), !n && i.currentDeps && Un(i.currentDeps, t) ? i.current : (i.wipDeps = t, i.wip = e(), i.wip);
};
function fi(e) {
  const { version: t, createFiber: n } = hi(), r = he(() => n(e.hook, e.key), [
    e.hook,
    e.key,
    n
  ]), i = Jo(() => ({ value: it(r, e.args) }), [
    r,
    t,
    e.args
  ], ri(r));
  return X(() => () => _t(r), [r]), X(() => {
    qt(r);
  }, [r, i]), i.value;
}
const Zi = (e, t) => {
  const n = e.get(t);
  n && (n.isDirty = !0);
}, vc = (e, t) => !e.isDirty && !ri(e.fiber) && t !== void 0 && e.committedDeps !== void 0 && Un(e.committedDeps, t), Ec = (e) => {
  if (!Do()) return !1;
  for (const { fiber: t } of e.values()) if (ri(t)) return !0;
  return !1;
};
function Yo(e) {
  const [t] = Se(() => /* @__PURE__ */ new Map()), { version: n, createFiber: r } = hi(), i = Ec(t), s = Jo(() => {
    const o = /* @__PURE__ */ new Set(), a = [];
    let l = 0;
    for (let u = 0; u < e.length; u++) {
      const h = e[u], c = h.key;
      if (c === void 0) throw new Error(`useResources did not provide a key for array at index ${u}`);
      if (o.has(c)) throw new Error(`Duplicate key ${c} in useResources`);
      o.add(c);
      let f = t.get(c);
      if (f)
        if (f.fiber.hook !== h.hook) {
          const d = r(h.hook, h.key, () => Zi(t, c)), p = it(d, h.args);
          f.next = {
            value: p,
            deps: h.deps,
            remount: d
          };
        } else if (vc(f, h.deps))
          f.fiber.contextDeps && Ro(f.fiber, f.fiber.contextDeps), f.next = "skip";
        else {
          const d = it(f.fiber, h.args);
          f.next = {
            value: d,
            deps: h.deps
          };
        }
      else {
        const d = r(h.hook, h.key, () => Zi(t, c));
        f = {
          fiber: d,
          next: {
            value: it(d, h.args),
            deps: h.deps
          },
          isDirty: !1,
          committedDeps: void 0,
          committedValue: void 0
        }, l++, t.set(c, f);
      }
      a.push(typeof f.next == "object" ? f.next.value : f.committedValue);
    }
    if (t.size > a.length - l)
      for (const u of t.keys()) o.has(u) || (t.get(u).next = "delete");
    return a;
  }, [
    e,
    t,
    r,
    n
  ], i);
  return X(() => () => {
    for (const o of t.keys()) {
      const a = t.get(o).fiber;
      _t(a);
    }
  }, [t]), X(() => {
    for (const [o, a] of t.entries()) {
      const l = a.next;
      l === "delete" ? (a.fiber.isMounted && _t(a.fiber), t.delete(o)) : l === "skip" || (l.remount && (_t(a.fiber), a.fiber = l.remount), qt(a.fiber), a.committedDeps = l.deps, a.committedValue = l.value, a.isDirty = !1);
    }
  }, [s, t]), s;
}
const Ic = (e) => e(), Ac = (e) => {
  const { createFiber: t } = hi(), n = he(() => t(Ic, void 0), [t]), r = it(n, [e]);
  X(() => () => {
    _t(n);
  }, [n]);
  let i = !1;
  const s = () => {
    i && n.isMounted || (i = !0, qt(n));
  };
  return X(s), {
    value: r,
    effects: s
  };
}, nr = (e) => {
  if (!e.overwrite) return e;
  const { overwrite: t, ...n } = e;
  return n;
}, Tc = (e) => {
  const t = Array.from(e).map((r) => r.getModelContext()).sort((r, i) => (i.priority ?? 0) - (r.priority ?? 0)), n = {};
  return t.reduce((r, i) => {
    const s = i.priority ?? 0;
    if (i.system && (r.system ? r.system += `

${i.system}` : r.system = i.system), i.tools) for (const [o, a] of Object.entries(i.tools)) {
      const l = r.tools?.[o];
      if (l && l !== a) {
        const u = n[o];
        if (u === s) {
          if (!a.overwrite) throw new Error(`You tried to define a tool with the name ${o}, but it already exists.`);
          r.tools[o] = nr(a);
          continue;
        }
        const h = u > s ? l : a, c = u > s ? a : l;
        r.tools[o] = nr({
          ...c,
          ...h
        }), n[o] = Math.max(u, s);
        continue;
      }
      r.tools || (r.tools = {}), r.tools[o] = nr(a), n[o] ??= s;
    }
    return i.config && (r.config = {
      ...r.config,
      ...i.config
    }), i.callSettings && (r.callSettings = {
      ...r.callSettings,
      ...i.callSettings
    }), i.unstable_composerMetadata && (r.unstable_composerMetadata = {
      ...r.unstable_composerMetadata,
      ...i.unstable_composerMetadata
    }), r;
  }, {});
};
var Qo = class {
  _providers = /* @__PURE__ */ new Set();
  getModelContext() {
    return Tc(this._providers);
  }
  registerModelContextProvider(e) {
    this._providers.add(e);
    const t = e.subscribe?.(() => {
      this.notifySubscribers();
    });
    return this.notifySubscribers(), () => {
      this._providers.delete(e), t?.(), this.notifySubscribers();
    };
  }
  _subscribers = /* @__PURE__ */ new Set();
  notifySubscribers() {
    for (const e of this._subscribers) e();
  }
  subscribe(e) {
    return this._subscribers.add(e), () => {
      this._subscribers.delete(e);
    };
  }
};
const Dr = /* @__PURE__ */ Symbol("assistant-ui.store.clientIndex"), Rc = (e) => e[Dr], Go = Xt([]), di = () => Uo(Go), Dc = (e, t) => {
  const n = be(3), r = di();
  let i;
  return n[0] !== e || n[1] !== r ? (i = [...r, e], n[0] = e, n[1] = r, n[2] = i) : i = n[2], To(Go, i, t);
}, Mc = /* @__PURE__ */ new Set([
  "$$typeof",
  "nodeType",
  "then"
]), qn = (e, t) => {
  if (e === Symbol.toStringTag) return t;
  if (typeof e != "symbol") {
    if (e === "toJSON") return () => t;
    if (!Mc.has(e))
      return !1;
  }
};
var pi = class {
  getOwnPropertyDescriptor(e, t) {
    const n = this.get(e, t);
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
const _n = /* @__PURE__ */ Symbol("assistant-ui.store.getValue"), Pc = (e) => {
  const t = e[_n];
  if (!t) throw new Error("Client scope contains a non-client resource. Ensure your Derived get() returns a client created with useClientResource(), not a plain resource.");
  return t.getState?.();
}, es = /* @__PURE__ */ new Map();
function Nc(e) {
  let t = es.get(e);
  return t || (t = function(...n) {
    if (!this || typeof this != "object") throw new Error(`Method "${String(e)}" called without proper context. This may indicate the function was called incorrectly.`);
    const r = this[_n];
    if (!r) throw new Error(`Method "${String(e)}" called on invalid client proxy. Ensure you are calling this method on a valid client instance.`);
    const i = r[e];
    if (!i) throw new Error(`Method "${String(e)}" is not implemented.`);
    if (typeof i != "function") throw new Error(`"${String(e)}" is not a function.`);
    return i(...n);
  }, es.set(e, t)), t;
}
var Oc = class extends pi {
  boundFns;
  cachedReceiver;
  outputRef;
  index;
  constructor(e, t) {
    super(), this.outputRef = e, this.index = t;
  }
  get(e, t, n) {
    if (t === _n) return this.outputRef.current;
    if (t === Dr) return this.index;
    const r = qn(t, "ClientProxy");
    if (r !== !1) return r;
    const i = this.outputRef.current[t];
    if (typeof i == "function") {
      this.cachedReceiver !== n && (this.boundFns = /* @__PURE__ */ new Map(), this.cachedReceiver = n);
      let s = this.boundFns.get(t);
      return s || (s = Nc(t).bind(n), this.boundFns.set(t, s)), s;
    }
    return i;
  }
  ownKeys() {
    return Object.keys(this.outputRef.current);
  }
  has(e, t) {
    return t === _n || t === Dr ? !0 : t in this.outputRef.current;
  }
};
const Xo = (e) => {
  const t = De(null), n = di().length, r = he(() => new Proxy({}, new Oc(t, n)), [n]), i = Dc(r, function() {
    return fi(e);
  });
  return t.current || (t.current = i), X(() => {
    t.current = i;
  }), {
    methods: r,
    state: i.getState?.(),
    key: e.key
  };
}, Jk = ht(Xo), $t = /* @__PURE__ */ Symbol("assistant-ui.store.proxiedAssistantState"), rr = (e) => e === "on" || e === "subscribe" || typeof e == "symbol", Zo = (e) => {
  class t extends pi {
    get(r, i) {
      const s = qn(i, "AssistantState");
      if (s !== !1) return s;
      const o = i;
      if (!rr(o))
        return Pc(e[o]());
    }
    ownKeys() {
      return Object.keys(e).filter((r) => !rr(r));
    }
    has(r, i) {
      return !rr(i) && i in e;
    }
  }
  return new Proxy({}, new t());
}, Lc = (e) => e[$t], ts = () => () => {
}, ea = (e) => {
  const t = (() => {
    throw new Error(e);
  });
  return t.source = null, t.query = null, t;
};
var Fc = class extends pi {
  get(e, t) {
    if (t === "subscribe" || t === "on") return ts;
    if (t === $t) return Bc;
    const n = qn(t, "DefaultAssistantClient");
    return n !== !1 ? n : ea("You are using a component or hook that requires an AuiProvider. Wrap your component in an <AuiProvider> component.");
  }
  ownKeys() {
    return [
      "subscribe",
      "on",
      $t
    ];
  }
  has(e, t) {
    return t === "subscribe" || t === "on" || t === $t;
  }
};
const Kn = new Proxy({}, new Fc()), Bc = Zo(Kn), zc = () => new Proxy({}, { get(e, t) {
  const n = qn(t, "AssistantClient");
  return n !== !1 ? n : ea(`The current scope does not have a "${String(t)}" property.`);
} }), ta = Xt(Kn), na = /* @__PURE__ */ Symbol("assistant-ui.store.useEffects"), $c = () => {
}, jc = (e) => e[na] ?? $c, Uc = () => {
  "use no memo";
  const e = ra();
  return X(jc(e)), null;
}, ra = () => ui(ta), Yk = ({ value: e, children: t }) => {
  "use no memo";
  return /* @__PURE__ */ B(ta.Provider, {
    value: e,
    children: [/* @__PURE__ */ w(Uc, {}), t]
  });
}, Mr = (e) => {
  throw new Error("Derived elements are config-only and must not be mounted");
}, Qk = ht(Mr), Pr = /* @__PURE__ */ Symbol("assistant-ui.transform-scopes");
function Gk(e, t) {
  const n = e;
  if (n[Pr]) throw new Error("transformScopes is already attached to this resource");
  n[Pr] = t;
}
function Vc(e) {
  return e[Pr];
}
const Hc = (e) => typeof e == "string" ? {
  scope: e.split(".")[0],
  event: e
} : {
  scope: e.scope,
  event: e.event
}, ia = Xt(null), qc = (e, t) => To(ia, e, t), sa = () => {
  const e = Uo(ia);
  if (!e) throw new Error("AssistantTapContext is not available");
  return e;
}, Xk = () => sa().clientRef, Zk = () => {
  const e = be(3), { emit: t } = sa(), n = di();
  let r;
  return e[0] !== n || e[1] !== t ? (r = (i, s) => {
    t(i, s, n);
  }, e[0] = n, e[1] = t, e[2] = r) : r = e[2], $o(r);
};
function Kc(e, t) {
  const n = { ...e }, r = /* @__PURE__ */ new Set();
  let i = !0;
  for (; i; ) {
    i = !1;
    for (const a of Object.values(n)) {
      if (a.hook === Mr || r.has(a.hook)) continue;
      r.add(a.hook);
      const l = Vc(a.hook);
      if (l) {
        l(n, t), i = !0;
        break;
      }
    }
  }
  const s = {}, o = {};
  for (const [a, l] of Object.entries(n)) l.hook === Mr ? o[a] = l : s[a] = l;
  return {
    rootClients: s,
    derivedClients: o
  };
}
const ns = (e) => he(() => e, [...Object.entries(e).flat()]), Wc = (e, t) => {
  const n = be(6);
  let r;
  n[0] !== t || n[1] !== e ? (r = Kc(e, t), n[0] = t, n[1] = e, n[2] = r) : r = n[2];
  const { rootClients: i, derivedClients: s } = r, o = ns(i), a = ns(s);
  let l;
  return n[3] !== o || n[4] !== a ? (l = {
    rootClients: o,
    derivedClients: a
  }, n[3] = o, n[4] = a, n[5] = l) : l = n[5], l;
}, Jc = () => {
  const e = be(3);
  let t;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t = /* @__PURE__ */ new Map(), e[0] = t) : t = e[0];
  const n = t;
  let r;
  e[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (r = /* @__PURE__ */ new Set(), e[1] = r) : r = e[1];
  const i = r;
  let s;
  if (e[2] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel")) {
    const o = /* @__PURE__ */ new Set();
    s = {
      on(a, l) {
        const u = l;
        if (a === "*")
          return i.add(u), () => i.delete(u);
        let h = n.get(a);
        return h || (h = /* @__PURE__ */ new Set(), n.set(a, h)), h.add(u), () => {
          h.delete(u), h.size === 0 && n.delete(a);
        };
      },
      emit(a, l, u) {
        const h = n.get(a);
        !h && i.size === 0 || queueMicrotask(() => {
          const c = [];
          if (h) for (const f of h) try {
            f(l, u);
          } catch (d) {
            const p = d;
            c.push(p);
          }
          if (i.size > 0) {
            const f = {
              event: a,
              payload: l
            };
            for (const d of i) try {
              d(f, u);
            } catch (p) {
              const y = p;
              c.push(y);
            }
          }
          if (c.length > 0) {
            if (c.length === 1) throw c[0];
            for (const f of c) console.error(f);
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
    }, e[2] = s;
  } else s = e[2];
  return s;
}, Yc = ht(Jc), oa = (e) => he(() => e, e), Qc = ({ element: e, emit: t, clientRef: n }) => {
  const { methods: r, state: i } = qc({
    clientRef: n,
    emit: t
  }, function() {
    return Xo(e);
  });
  return he(() => ({
    state: i,
    methods: r
  }), [r, i]);
}, Gc = ({ element: e, notifications: t, clientRef: n, name: r }) => {
  const i = _c(function() {
    return Qc({
      element: e,
      emit: t.emit,
      clientRef: n
    });
  });
  return X(() => i.subscribe(t.notifySubscribers), [i, t]), he(() => {
    const s = () => i.getValue().methods;
    return Object.defineProperties(s, {
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
    }), s;
  }, [i, r]);
}, Xc = ht(Gc), Zc = () => {
  const e = be(2);
  let t;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t = [], e[0] = t) : t = e[0];
  let n;
  return e[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (n = {
    clients: t,
    subscribe: void 0,
    on: void 0
  }, e[1] = n) : n = e[1], n;
}, eh = ht(Zc), th = (e) => {
  const t = be(14), { clients: n, clientRef: r } = e;
  let i;
  t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (i = Yc(), t[0] = i) : i = t[0];
  const s = fi(i);
  let o;
  t[1] !== r.parent || t[2] !== s.notifySubscribers ? (o = () => r.parent.subscribe(s.notifySubscribers), t[1] = r.parent, t[2] = s.notifySubscribers, t[3] = o) : o = t[3];
  let a;
  t[4] !== r || t[5] !== s ? (a = [r, s], t[4] = r, t[5] = s, t[6] = a) : a = t[6], X(o, a);
  let l;
  t[7] !== r || t[8] !== n || t[9] !== s ? (l = Object.keys(n).map((c) => ci(c, Xc({
    element: n[c],
    notifications: s,
    clientRef: r,
    name: c
  }))), t[7] = r, t[8] = n, t[9] = s, t[10] = l) : l = t[10];
  const u = oa(Yo(l));
  let h;
  return t[11] !== s || t[12] !== u ? (h = {
    notifications: s,
    results: u
  }, t[11] = s, t[12] = u, t[13] = h) : h = t[13], h;
}, nh = (e) => {
  const { clientRef: t } = e, { notifications: n, results: r } = th(e);
  return he(() => ({
    clients: r,
    subscribe: n.subscribe,
    on: function(i, s) {
      if (!this) throw new Error("const { on } = useAui() is not supported. Use aui.on() instead.");
      const { scope: o, event: a } = Hc(i);
      if (o !== "*" && this[o].source === null)
        throw new Error(`Scope "${o}" is not available. Use { scope: "*", event: "${a}" } to listen globally.`);
      const l = n.on(a, (h, c) => {
        if (o === "*") {
          s(h);
          return;
        }
        const f = this[o]();
        f === c[Rc(f)] && s(h);
      });
      if (o !== "*" && t.parent[o].source === null) return l;
      const u = t.parent.on(i, s);
      return () => {
        l(), u();
      };
    }
  }), [
    r,
    n,
    t
  ]);
}, rh = ht(nh), ih = ({ element: e, clientRef: t, name: n }) => {
  const r = De(e.args[0]);
  return r.current = e.args[0], he(() => {
    const i = () => r.current.get(t.current);
    return Object.defineProperties(i, {
      source: { value: r.current.source },
      query: { value: r.current.query },
      name: {
        value: n,
        configurable: !0
      }
    }), i;
  }, [t, n]);
}, sh = ht(ih), oh = (e, t) => {
  let n;
  try {
    const r = {};
    for (const i of Object.keys(t.query).sort()) r[i] = t.query[i];
    n = JSON.stringify(r);
  } catch {
    n = String(t.query);
  }
  return `${e}::${t.source}::${n}`;
}, ah = (e) => {
  const t = be(3), { clients: n, clientRef: r } = e;
  let i;
  return t[0] !== r || t[1] !== n ? (i = Object.keys(n).map((s) => {
    const o = s, a = n[o];
    return ci(oh(o, a.args[0]), sh({
      element: a,
      clientRef: r,
      name: o
    }));
  }), t[0] = r, t[1] = n, t[2] = i) : i = t[2], oa(Yo(i));
}, lh = (e) => {
  const t = be(3), { rootClients: n, clientRef: r } = e;
  let i;
  return t[0] !== r || t[1] !== n ? (i = Object.keys(n).length > 0 ? rh({
    clients: n,
    clientRef: r
  }) : eh(), t[0] = r, t[1] = n, t[2] = i) : i = t[2], fi(i);
}, uh = ({ parent: e, clients: t }) => {
  const { rootClients: n, derivedClients: r } = Wc(t, e), i = De({
    parent: e,
    current: null
  }).current;
  X(() => {
    i.current = a;
  });
  const s = lh({
    rootClients: n,
    clientRef: i
  }), o = ah({
    clients: r,
    clientRef: i
  }), a = he(() => {
    const l = e === Kn ? zc() : e, u = Object.create(l);
    Object.assign(u, {
      subscribe: s.subscribe ?? e.subscribe,
      on: s.on ?? e.on,
      [$t]: Zo(u)
    });
    for (const h of s.clients) u[h.name] = h;
    for (const h of o) u[h.name] = h;
    return u;
  }, [
    e,
    s,
    o
  ]);
  return i.current === null && (i.current = a), a;
}, ch = (e) => {
  const { value: t, effects: n } = Ac(function() {
    return uh(e);
  });
  return t[na] = n, t;
};
function mi(e, { parent: t } = { parent: ra() }) {
  if (e) return ch({
    parent: t ?? Kn,
    clients: e
  });
  if (t === null) throw new Error("received null parent, this usage is not allowed");
  return t;
}
const aa = (e) => {
  const t = be(6), n = mi();
  let r;
  t[0] !== n ? (r = Lc(n), t[0] = n, t[1] = r) : r = t[1];
  const i = r;
  let s, o;
  t[2] !== i || t[3] !== e ? (s = () => e(i), o = () => e(i), t[2] = i, t[3] = e, t[4] = s, t[5] = o) : (s = t[4], o = t[5]);
  const a = jo(n.subscribe, s, o);
  if (a === i) throw new Error("You tried to return the entire AssistantState. This is not supported due to technical limitations.");
  return oc(a), a;
};
function ee(e) {
  return e != null && typeof e == "object" && !Array.isArray(e);
}
function Sn(e, t = 0) {
  return t > 100 ? !1 : e === null || typeof e == "string" || typeof e == "boolean" ? !0 : typeof e == "number" ? !Number.isNaN(e) && Number.isFinite(e) : Array.isArray(e) ? e.every((n) => Sn(n, t + 1)) : ee(e) ? Object.entries(e).every(([n, r]) => typeof n == "string" && Sn(r, t + 1)) : !1;
}
const hh = 100, Nr = (e, t, n) => {
  if (e === t) return !0;
  if (n > hh || e == null || t == null) return !1;
  if (Array.isArray(e))
    return !Array.isArray(t) || e.length !== t.length ? !1 : e.every((s, o) => Nr(s, t[o], n + 1));
  if (Array.isArray(t) || !ee(e) || !ee(t)) return !1;
  const r = Object.keys(e), i = Object.keys(t);
  return r.length !== i.length ? !1 : r.every((s) => Object.hasOwn(t, s) && Nr(e[s], t[s], n + 1));
}, la = (e, t) => !Sn(e) || !Sn(t) ? !1 : Nr(e, t, 0);
function fh(e) {
  const t = e.metadata;
  if (!t || typeof t != "object") return;
  const n = t.custom;
  if (!n || typeof n != "object") return;
  const r = n.interactables;
  return Array.isArray(r) ? r : void 0;
}
function dh(e) {
  return `update_${e.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}
const rs = (e) => {
  if (!ee(e)) return;
  const t = e.id;
  return typeof t == "string" || typeof t == "number" ? t : void 0;
};
function ph(e, t, n) {
  let r = Array.isArray(t.set) ? [...t.set] : [...e];
  if (t.clear === !0 && (r = []), Array.isArray(t.remove) && t.remove.length > 0) {
    const s = new Set(t.remove);
    r = r.filter((o) => {
      const a = rs(o);
      return a !== void 0 ? !s.has(a) : !s.has(o);
    });
  }
  const i = t.update;
  if (Array.isArray(i) && i.length > 0 && (r = r.map((s) => {
    const o = rs(s);
    if (o === void 0 || !ee(s)) return s;
    const a = i.find((l) => ee(l) && l.id === o);
    return a ? {
      ...s,
      ...a
    } : s;
  })), Array.isArray(t.add) && t.add.length > 0) {
    const s = n ? t.add.map((o) => {
      if (!ee(o) || o.id !== void 0) return o;
      const a = n();
      return a === void 0 ? o : {
        ...o,
        id: a
      };
    }) : t.add;
    r = [...r, ...s];
  }
  return r;
}
function ir(e, t, n) {
  if (!ee(e) || !ee(t)) return t;
  const r = ee(n?.arrayBaseline) ? n.arrayBaseline : e, i = { ...e };
  for (const [s, o] of Object.entries(t)) {
    const a = r[s];
    Array.isArray(a) && ee(o) ? i[s] = ph(a, o, n?.idFactory && (n.idKeyedFields === void 0 || n.idKeyedFields.has(s)) ? () => n.idFactory?.(s) : void 0) : i[s] = o;
  }
  return i;
}
function mh(e, t) {
  if (!ee(e) || !ee(t)) return;
  for (const i of Object.keys(e)) if (!(i in t)) return;
  const n = {};
  for (const [i, s] of Object.entries(t)) (!(i in e) || !la(e[i], s)) && (n[i] = s);
  const r = Object.keys(n).length;
  if (!(r === 0 || r === Object.keys(t).length))
    return n;
}
const gh = (e) => {
  if (!e || typeof e != "object") return;
  const t = e;
  return t.type === "tool-call" ? t : void 0;
}, bh = (e, t) => {
  if (!e.args || typeof e.args != "object") return !1;
  const n = ee(e.result) ? e.result : void 0;
  if (n?.success === !1) return !1;
  if (typeof n?.id == "string") return n.id === t;
  const r = e.args.id;
  return r === t || r === void 0;
}, yh = (e) => {
  const t = ee(e) ? e.addedItemIds : void 0;
  if (!ee(t)) return;
  const n = /* @__PURE__ */ new Map();
  for (const [r, i] of Object.entries(t)) {
    if (!Array.isArray(i)) continue;
    const s = i.filter((o) => typeof o == "string");
    s.length > 0 && n.set(r, s);
  }
  if (n.size !== 0)
    return (r) => n.get(r)?.shift();
}, is = /* @__PURE__ */ new WeakMap();
function xh(e, t, n) {
  let r = is.get(e);
  r || (r = /* @__PURE__ */ new Map(), is.set(e, r));
  let i = r.get(n);
  i || (i = /* @__PURE__ */ new Map(), r.set(n, i));
  const s = i.get(t);
  if (s) return s;
  const o = dh(n), a = [], l = () => a[a.length - 1];
  for (const u of e) {
    if (u.role === "user") {
      const h = fh(u)?.find((c) => c.id === t);
      if (!h) continue;
      if (h.partial) {
        const c = l();
        c && a.push({
          state: ir(c.state, h.state),
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
        const c = gh(h);
        if (c) {
          if (c.toolCallId === t && c.toolName === n)
            c.args && typeof c.args == "object" && a.push({
              state: c.args,
              origin: "create",
              toolCallId: t
            });
          else if (c.toolName === o && bh(c, t)) {
            const f = l();
            if (f) {
              const { id: d, ...p } = c.args, y = yh(c.result);
              a.push({
                state: y ? ir(f.state, p, { idFactory: y }) : ir(f.state, p),
                origin: "update",
                toolCallId: c.toolCallId
              });
            }
          }
        }
      }
  }
  return i.set(t, a), a;
}
function wh(e, t, n) {
  const r = xh(e, t, n), i = r[r.length - 1];
  return i ? { state: i.state } : void 0;
}
function kh(e, t) {
  if (!e) return;
  const { interactables: n, ...r } = e, i = { ...r };
  if (Array.isArray(n)) {
    const s = [];
    for (const o of n) {
      const a = wh(t, o.id, o.name);
      if (!a) {
        s.push({
          id: o.id,
          name: o.name,
          state: o.state
        });
        continue;
      }
      if (la(o.state, a.state)) continue;
      const l = mh(a.state, o.state);
      s.push(l ? {
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
    s.length && (i.interactables = s);
  }
  return Object.keys(i).length ? i : void 0;
}
var Xe = { exports: {} }, ss;
function _h() {
  if (ss) return Xe.exports;
  ss = 1;
  const e = typeof Buffer < "u", t = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/, n = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
  function r(a, l, u) {
    u == null && l !== null && typeof l == "object" && (u = l, l = void 0), e && Buffer.isBuffer(a) && (a = a.toString()), a && a.charCodeAt(0) === 65279 && (a = a.slice(1));
    const h = JSON.parse(a, l);
    if (h === null || typeof h != "object")
      return h;
    const c = u && u.protoAction || "error", f = u && u.constructorAction || "error";
    if (c === "ignore" && f === "ignore")
      return h;
    if (c !== "ignore" && f !== "ignore") {
      if (t.test(a) === !1 && n.test(a) === !1)
        return h;
    } else if (c !== "ignore" && f === "ignore") {
      if (t.test(a) === !1)
        return h;
    } else if (n.test(a) === !1)
      return h;
    return i(h, { protoAction: c, constructorAction: f, safe: u && u.safe });
  }
  function i(a, { protoAction: l = "error", constructorAction: u = "error", safe: h } = {}) {
    let c = [a];
    for (; c.length; ) {
      const f = c;
      c = [];
      for (const d of f) {
        if (l !== "ignore" && Object.prototype.hasOwnProperty.call(d, "__proto__")) {
          if (h === !0)
            return null;
          if (l === "error")
            throw new SyntaxError("Object contains forbidden prototype property");
          delete d.__proto__;
        }
        if (u !== "ignore" && Object.prototype.hasOwnProperty.call(d, "constructor") && d.constructor !== null && typeof d.constructor == "object" && Object.prototype.hasOwnProperty.call(d.constructor, "prototype")) {
          if (h === !0)
            return null;
          if (u === "error")
            throw new SyntaxError("Object contains forbidden prototype property");
          delete d.constructor;
        }
        for (const p in d) {
          const y = d[p];
          y && typeof y == "object" && c.push(y);
        }
      }
    }
    return a;
  }
  function s(a, l, u) {
    const { stackTraceLimit: h } = Error;
    Error.stackTraceLimit = 0;
    try {
      return r(a, l, u);
    } finally {
      Error.stackTraceLimit = h;
    }
  }
  function o(a, l) {
    const { stackTraceLimit: u } = Error;
    Error.stackTraceLimit = 0;
    try {
      return r(a, l, { safe: !0 });
    } catch {
      return;
    } finally {
      Error.stackTraceLimit = u;
    }
  }
  return Xe.exports = s, Xe.exports.default = s, Xe.exports.parse = s, Xe.exports.safeParse = o, Xe.exports.scan = i, Xe.exports;
}
var Sh = _h();
const os = /* @__PURE__ */ jn(Sh);
let Ch = (e, t = 21) => (n = t) => {
  let r = "", i = n | 0;
  for (; i-- > 0; )
    r += e[Math.random() * e.length | 0];
  return r;
};
function vh(e) {
  const t = ["ROOT"];
  let n = -1, r = null;
  const i = [];
  let s;
  function o() {
    s !== void 0 && (i.push(JSON.parse(`"${s}"`)), s = void 0);
  }
  function a(c, f, d) {
    switch (c) {
      case '"':
        n = f, t.pop(), t.push(d), t.push("INSIDE_STRING"), o();
        break;
      case "f":
      case "t":
      case "n":
        n = f, r = f, t.pop(), t.push(d), t.push("INSIDE_LITERAL");
        break;
      case "-":
        t.pop(), t.push(d), t.push("INSIDE_NUMBER"), o();
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
        n = f, t.pop(), t.push(d), t.push("INSIDE_NUMBER"), o();
        break;
      case "{":
        n = f, t.pop(), t.push(d), t.push("INSIDE_OBJECT_START"), o();
        break;
      case "[":
        n = f, t.pop(), t.push(d), t.push("INSIDE_ARRAY_START"), o();
        break;
    }
  }
  function l(c, f) {
    switch (c) {
      case ",":
        t.pop(), t.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      case "}":
        n = f, t.pop(), s = i.pop();
        break;
    }
  }
  function u(c, f) {
    switch (c) {
      case ",":
        t.pop(), t.push("INSIDE_ARRAY_AFTER_COMMA"), s = (Number(s) + 1).toString();
        break;
      case "]":
        n = f, t.pop(), s = i.pop();
        break;
    }
  }
  for (let c = 0; c < e.length; c++) {
    const f = e[c];
    switch (t[t.length - 1]) {
      case "ROOT":
        a(f, c, "FINISH");
        break;
      case "INSIDE_OBJECT_START":
        switch (f) {
          case '"':
            t.pop(), t.push("INSIDE_OBJECT_KEY"), s = "";
            break;
          case "}":
            n = c, t.pop(), s = i.pop();
            break;
        }
        break;
      case "INSIDE_OBJECT_AFTER_COMMA":
        f === '"' && (t.pop(), t.push("INSIDE_OBJECT_KEY"), s = "");
        break;
      case "INSIDE_OBJECT_KEY":
        switch (f) {
          case '"':
            t.pop(), t.push("INSIDE_OBJECT_AFTER_KEY");
            break;
          case "\\":
            t.push("INSIDE_STRING_ESCAPE"), s += f;
            break;
          default:
            s += f;
            break;
        }
        break;
      case "INSIDE_OBJECT_AFTER_KEY":
        f === ":" && (t.pop(), t.push("INSIDE_OBJECT_BEFORE_VALUE"));
        break;
      case "INSIDE_OBJECT_BEFORE_VALUE":
        a(f, c, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      case "INSIDE_OBJECT_AFTER_VALUE":
        l(f, c);
        break;
      case "INSIDE_STRING":
        switch (f) {
          case '"':
            t.pop(), n = c, s = i.pop();
            break;
          case "\\":
            t.push("INSIDE_STRING_ESCAPE");
            break;
          default:
            n = c;
        }
        break;
      case "INSIDE_ARRAY_START":
        f === "]" ? (n = c, t.pop(), s = i.pop()) : (n = c, s = "0", a(f, c, "INSIDE_ARRAY_AFTER_VALUE"));
        break;
      case "INSIDE_ARRAY_AFTER_VALUE":
        switch (f) {
          case ",":
            t.pop(), t.push("INSIDE_ARRAY_AFTER_COMMA"), s = (Number(s) + 1).toString();
            break;
          case "]":
            n = c, t.pop(), s = i.pop();
            break;
          default:
            n = c;
            break;
        }
        break;
      case "INSIDE_ARRAY_AFTER_COMMA":
        a(f, c, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      case "INSIDE_STRING_ESCAPE":
        t.pop(), t[t.length - 1] === "INSIDE_STRING" ? n = c : t[t.length - 1] === "INSIDE_OBJECT_KEY" && (s += f);
        break;
      case "INSIDE_NUMBER":
        switch (f) {
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
            t.pop(), s = i.pop(), t[t.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && u(f, c), t[t.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && l(f, c);
            break;
          case "}":
            t.pop(), s = i.pop(), t[t.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && l(f, c);
            break;
          case "]":
            t.pop(), s = i.pop(), t[t.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && u(f, c);
            break;
          default:
            t.pop(), s = i.pop();
            break;
        }
        break;
      case "INSIDE_LITERAL": {
        const d = e.substring(r, c + 1);
        !"false".startsWith(d) && !"true".startsWith(d) && !"null".startsWith(d) ? (t.pop(), t[t.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" ? l(f, c) : t[t.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && u(f, c)) : n = c;
        break;
      }
    }
  }
  let h = e.slice(0, n + 1);
  for (let c = t.length - 1; c >= 0; c--) switch (t[c]) {
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
      const f = e.substring(r, e.length);
      "true".startsWith(f) ? h += "true".slice(f.length) : "false".startsWith(f) ? h += "false".slice(f.length) : "null".startsWith(f) && (h += "null".slice(f.length));
    }
  }
  return [h, i];
}
const gn = /* @__PURE__ */ Symbol("aui.parse-partial-json-object.meta"), Eh = (e) => e?.[gn], Ih = (e) => {
  if (e.length === 0) return { [gn]: {
    state: "partial",
    partialPath: []
  } };
  try {
    const t = os.parse(e);
    if (typeof t != "object" || t === null) throw new Error("argsText is expected to be an object");
    return t[gn] = {
      state: "complete",
      partialPath: []
    }, t;
  } catch {
    try {
      const [t, n] = vh(e), r = os.parse(t);
      if (typeof r != "object" || r === null) throw new Error("argsText is expected to be an object");
      return r[gn] = {
        state: "partial",
        partialPath: n
      }, r;
    } catch {
      return;
    }
  }
}, ua = (e, t, n) => {
  if (typeof e != "object" || e === null) return t.state;
  if (t.state === "complete") return "complete";
  if (n.length === 0) return t.state;
  const [r, ...i] = n;
  if (!Object.hasOwn(e, r)) return "partial";
  const [s, ...o] = t.partialPath;
  if (r !== s) return "complete";
  const a = e[r];
  return ua(a, {
    state: "partial",
    partialPath: o
  }, i);
}, e_ = (e, t) => {
  const n = Eh(e);
  if (!n) throw new Error("unable to determine object state");
  return ua(e, n, t.map(String));
}, as = /* @__PURE__ */ Symbol.for("aui.tool-response");
var Ah = class Or {
  get [as]() {
    return !0;
  }
  artifact;
  result;
  isError;
  modelContent;
  messages;
  constructor(t) {
    t.artifact !== void 0 && (this.artifact = t.artifact), this.result = t.result, this.isError = t.isError ?? !1, t.modelContent !== void 0 && (this.modelContent = t.modelContent), t.messages !== void 0 && (this.messages = t.messages);
  }
  static [Symbol.hasInstance](t) {
    return typeof t == "object" && t !== null && as in t;
  }
  /**
  * Converts a plain tool return value into a {@link ToolResponse}.
  *
  * Existing `ToolResponse` instances are returned unchanged. `undefined`
  * becomes the string `"<no result>"` so downstream protocol chunks always
  * carry a concrete result.
  */
  static toResponse(t) {
    return t instanceof Or ? t : new Or({ result: t === void 0 ? "<no result>" : t });
  }
};
const Wn = Ch("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7), at = /* @__PURE__ */ Symbol("innerMessage"), sr = /* @__PURE__ */ Symbol("innerMessages"), Th = [], t_ = (e, t) => {
  at in e || (e[at] = t);
}, n_ = (e) => {
  const t = "messages" in e ? e.messages : e, n = t[sr] || t[at];
  return n ? Array.isArray(n) ? n : (t[sr] = [n], t[sr]) : Th;
}, gi = (e, t, n) => {
  const r = (i) => {
    console.error(`[assistant-ui] ${n} listener threw an error`, i);
  };
  for (const i of e) try {
    const s = i(t);
    s !== null && (typeof s == "object" || typeof s == "function") && "then" in s && typeof s.then == "function" && Promise.resolve(s).catch(r);
  } catch (s) {
    r(s);
  }
}, Ee = /* @__PURE__ */ Symbol("skip-update");
function Rh(e, t) {
  if (e === void 0 && t === void 0) return !0;
  if (e === void 0 || t === void 0) return !1;
  const n = Object.keys(e);
  if (n.length !== Object.keys(t).length) return !1;
  for (const r of n) {
    const i = e[r], s = t[r];
    if (!Object.is(i, s)) return !1;
  }
  return !0;
}
var Dh = class {
  _subscribers = /* @__PURE__ */ new Set();
  subscribe(e) {
    return this._subscribers.add(e), () => this._subscribers.delete(e);
  }
  waitForUpdate() {
    return new Promise((e) => {
      const t = this.subscribe(() => {
        t(), e();
      });
    });
  }
  _notifySubscribers() {
    const e = [];
    for (const t of this._subscribers) try {
      t();
    } catch (n) {
      e.push(n);
    }
    if (e.length > 0) {
      if (e.length === 1) throw e[0];
      for (const t of e) console.error(t);
      throw new AggregateError(e);
    }
  }
}, Jn = class {
  _subscriptions = /* @__PURE__ */ new Set();
  _connection;
  get isConnected() {
    return !!this._connection;
  }
  notifySubscribers(e, t) {
    if (t) {
      gi(this._subscriptions, e, t);
      return;
    }
    for (const n of this._subscriptions) n(e);
  }
  _updateConnection() {
    if (this._subscriptions.size > 0) {
      if (this._connection) return;
      this._connection = this._connect();
    } else
      this._connection?.(), this._connection = void 0;
  }
  subscribe(e) {
    return this._subscriptions.add(e), this._updateConnection(), () => {
      this._subscriptions.delete(e), this._updateConnection();
    };
  }
}, Ce = class extends Jn {
  get path() {
    return this.binding.path;
  }
  binding;
  constructor(e) {
    super(), this.binding = e;
    const t = e.getState();
    if (t === Ee) throw new Error("Entry not available in the store");
    this._previousState = t;
  }
  _previousState;
  getState = () => (this.isConnected || this._syncState(), this._previousState);
  _syncState() {
    const e = this.binding.getState();
    return e === Ee || Rh(e, this._previousState) ? !1 : (this._previousState = e, !0);
  }
  _connect() {
    const e = () => {
      this._syncState() && this.notifySubscribers();
    };
    return this.binding.subscribe(e);
  }
}, bi = class extends Jn {
  get path() {
    return this.binding.path;
  }
  binding;
  constructor(e) {
    super(), this.binding = e;
  }
  _previousStateDirty = !0;
  _previousState;
  getState = () => {
    if (!this.isConnected || this._previousStateDirty) {
      const e = this.binding.getState();
      e !== Ee && (this._previousState = e), this._previousStateDirty = !1;
    }
    if (this._previousState === void 0) throw new Error("Entry not available in the store");
    return this._previousState;
  };
  _connect() {
    const e = () => {
      this._previousStateDirty = !0, this.notifySubscribers();
    };
    return this.binding.subscribe(e);
  }
}, Cn = class extends Jn {
  get path() {
    return this.binding.path;
  }
  binding;
  constructor(e) {
    super(), this.binding = e;
  }
  getState() {
    return this.binding.getState();
  }
  outerSubscribe(e) {
    return this.binding.subscribe(e);
  }
  _connect() {
    const e = () => {
      this.notifySubscribers();
    };
    let t = this.binding.getState(), n = t?.subscribe(e);
    const r = () => {
      const s = this.binding.getState();
      s !== t && (t = s, n?.(), n = s?.subscribe(e), e());
    }, i = this.outerSubscribe(r);
    return () => {
      i?.(), n?.();
    };
  }
}, ca = class extends Jn {
  config;
  constructor(e) {
    super(), this.config = e;
  }
  getState() {
    return this.config.binding.getState();
  }
  outerSubscribe(e) {
    return this.config.binding.subscribe(e);
  }
  _connect() {
    const e = `Runtime event "${this.config.event}"`, t = (o) => {
      this.notifySubscribers(o, e);
    };
    let n = this.config.binding.getState(), r = n?.unstable_on(this.config.event, t);
    const i = () => {
      const o = this.config.binding.getState();
      o !== n && (n = o, r?.(), r = o?.unstable_on(this.config.event, t));
    }, s = this.outerSubscribe(i);
    return () => {
      s?.(), r?.();
    };
  }
}, ha = class {
  get path() {
    return this._core.path;
  }
  _core;
  constructor(e) {
    this._core = e, this.__internal_bindMethods();
  }
  __internal_bindMethods() {
    this.getState = this.getState.bind(this), this.remove = this.remove.bind(this), this.subscribe = this.subscribe.bind(this);
  }
  getState() {
    return this._core.getState();
  }
  subscribe(e) {
    return this._core.subscribe(e);
  }
}, fa = class extends ha {
  _composerApi;
  constructor(e, t) {
    super(e), this._composerApi = t;
  }
  remove() {
    const e = this._composerApi.getState();
    if (!e) throw new Error("Composer is not available");
    return e.removeAttachment(this.getState().id);
  }
}, Mh = class extends fa {
  get source() {
    return "thread-composer";
  }
}, Ph = class extends fa {
  get source() {
    return "edit-composer";
  }
}, Nh = class extends ha {
  get source() {
    return "message";
  }
  remove() {
    throw new Error("Message attachments cannot be removed");
  }
};
const vn = Object.freeze([]), da = Object.freeze({}), Oh = (e) => Object.freeze({
  type: "thread",
  isEditing: e?.isEditing ?? !1,
  canCancel: e?.canCancel ?? !1,
  canSend: e?.canSend ?? !1,
  isEmpty: e?.isEmpty ?? !0,
  attachments: e?.attachments ?? vn,
  text: e?.text ?? "",
  role: e?.role ?? "user",
  runConfig: e?.runConfig ?? da,
  attachmentAccept: e?.attachmentAccept ?? "",
  dictation: e?.dictation,
  quote: e?.quote,
  queue: e?.queue ?? vn,
  value: e?.text ?? ""
}), Lh = (e) => Object.freeze({
  type: "edit",
  isEditing: e?.isEditing ?? !1,
  canCancel: e?.canCancel ?? !1,
  canSend: e?.canSend ?? !1,
  isEmpty: e?.isEmpty ?? !0,
  text: e?.text ?? "",
  role: e?.role ?? "user",
  attachments: e?.attachments ?? vn,
  runConfig: e?.runConfig ?? da,
  attachmentAccept: e?.attachmentAccept ?? "",
  dictation: e?.dictation,
  quote: e?.quote,
  queue: e?.queue ?? vn,
  parentId: e?.parentId ?? null,
  sourceId: e?.sourceId ?? null,
  value: e?.text ?? ""
});
var pa = class {
  get path() {
    return this._core.path;
  }
  _core;
  constructor(e) {
    this._core = e;
  }
  __internal_bindMethods() {
    this.setText = this.setText.bind(this), this.setRunConfig = this.setRunConfig.bind(this), this.getState = this.getState.bind(this), this.subscribe = this.subscribe.bind(this), this.addAttachment = this.addAttachment.bind(this), this.reset = this.reset.bind(this), this.clearAttachments = this.clearAttachments.bind(this), this.send = this.send.bind(this), this.cancel = this.cancel.bind(this), this.steerQueueItem = this.steerQueueItem.bind(this), this.removeQueueItem = this.removeQueueItem.bind(this), this.setRole = this.setRole.bind(this), this.getAttachmentByIndex = this.getAttachmentByIndex.bind(this), this.startDictation = this.startDictation.bind(this), this.stopDictation = this.stopDictation.bind(this), this.setQuote = this.setQuote.bind(this), this.unstable_on = this.unstable_on.bind(this);
  }
  setText(e) {
    const t = this._core.getState();
    if (!t) throw new Error("Composer is not available");
    t.setText(e);
  }
  setRunConfig(e) {
    const t = this._core.getState();
    if (!t) throw new Error("Composer is not available");
    t.setRunConfig(e);
  }
  addAttachment(e) {
    const t = this._core.getState();
    if (!t) throw new Error("Composer is not available");
    return t.addAttachment(e);
  }
  reset() {
    const e = this._core.getState();
    if (!e) throw new Error("Composer is not available");
    return e.reset();
  }
  clearAttachments() {
    const e = this._core.getState();
    if (!e) throw new Error("Composer is not available");
    return e.clearAttachments();
  }
  send(e) {
    const t = this._core.getState();
    if (!t) throw new Error("Composer is not available");
    t.send(e);
  }
  cancel() {
    const e = this._core.getState();
    if (!e) throw new Error("Composer is not available");
    e.cancel();
  }
  steerQueueItem(e) {
    const t = this._core.getState();
    if (!t) throw new Error("Composer is not available");
    t.steerQueueItem(e);
  }
  removeQueueItem(e) {
    const t = this._core.getState();
    if (!t) throw new Error("Composer is not available");
    t.removeQueueItem(e);
  }
  setRole(e) {
    const t = this._core.getState();
    if (!t) throw new Error("Composer is not available");
    t.setRole(e);
  }
  startDictation() {
    const e = this._core.getState();
    if (!e) throw new Error("Composer is not available");
    e.startDictation();
  }
  stopDictation() {
    const e = this._core.getState();
    if (!e) throw new Error("Composer is not available");
    e.stopDictation();
  }
  setQuote(e) {
    const t = this._core.getState();
    if (!t) throw new Error("Composer is not available");
    t.setQuote(e);
  }
  subscribe(e) {
    return this._core.subscribe(e);
  }
  _eventSubscriptionSubjects = /* @__PURE__ */ new Map();
  unstable_on(e, t) {
    let n = this._eventSubscriptionSubjects.get(e);
    return n || (n = new ca({
      event: e,
      binding: this._core
    }), this._eventSubscriptionSubjects.set(e, n)), n.subscribe(t);
  }
}, Fh = class extends pa {
  get path() {
    return this._core.path;
  }
  get type() {
    return "thread";
  }
  _getState;
  constructor(e) {
    const t = new bi({
      path: e.path,
      getState: () => Oh(e.getState()),
      subscribe: (n) => e.subscribe(n)
    });
    super({
      path: e.path,
      getState: () => e.getState(),
      subscribe: (n) => t.subscribe(n)
    }), this._getState = t.getState.bind(t), this.__internal_bindMethods();
  }
  getState() {
    return this._getState();
  }
  getAttachmentByIndex(e) {
    return new Mh(new Ce({
      path: {
        ...this.path,
        attachmentSource: "thread-composer",
        attachmentSelector: {
          type: "index",
          index: e
        },
        ref: `${this.path.ref}.attachments[${e}]`
      },
      getState: () => {
        const t = this.getState().attachments[e];
        return t ? {
          ...t,
          source: "thread-composer"
        } : Ee;
      },
      subscribe: (t) => this._core.subscribe(t)
    }), this._core);
  }
}, Bh = class extends pa {
  get path() {
    return this._core.path;
  }
  get type() {
    return "edit";
  }
  _getState;
  _beginEdit;
  constructor(e, t) {
    const n = new bi({
      path: e.path,
      getState: () => Lh(e.getState()),
      subscribe: (r) => e.subscribe(r)
    });
    super({
      path: e.path,
      getState: () => e.getState(),
      subscribe: (r) => n.subscribe(r)
    }), this._beginEdit = t, this._getState = n.getState.bind(n), this.__internal_bindMethods();
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
  getAttachmentByIndex(e) {
    return new Ph(new Ce({
      path: {
        ...this.path,
        attachmentSource: "edit-composer",
        attachmentSelector: {
          type: "index",
          index: e
        },
        ref: `${this.path.ref}.attachments[${e}]`
      },
      getState: () => {
        const t = this.getState().attachments[e];
        return t ? {
          ...t,
          source: "edit-composer"
        } : Ee;
      },
      subscribe: (t) => this._core.subscribe(t)
    }), this._core);
  }
};
const zh = (e) => e.content.filter((t) => t.type === "text").map((t) => t.text).join(`

`), ls = {
  "allow-once": !0,
  "allow-always": !0,
  "reject-once": !1,
  "reject-always": !1
}, $h = (e, t) => {
  let n, r;
  if ("optionId" in t) {
    const i = e.options?.find((s) => s.id === t.optionId);
    if (!i) throw new Error(`Tool approval has no option with id "${t.optionId}"`);
    if ("approved" in t) n = t.approved;
    else {
      if (!Object.hasOwn(ls, i.kind)) throw new Error(`Tool approval option "${i.id}" has a custom kind "${i.kind}"; respond with an explicit approved value instead`);
      n = ls[i.kind];
    }
    r = i.id;
  } else n = t.approved;
  return {
    approvalId: e.id,
    approved: n,
    ...r !== void 0 && { optionId: r },
    ...t.reason != null && { reason: t.reason }
  };
};
var us = class {
  get path() {
    return this.contentBinding.path;
  }
  contentBinding;
  messageApi;
  threadApi;
  constructor(e, t, n) {
    this.contentBinding = e, this.messageApi = t, this.threadApi = n, this.__internal_bindMethods();
  }
  __internal_bindMethods() {
    this.addToolResult = this.addToolResult.bind(this), this.resumeToolCall = this.resumeToolCall.bind(this), this.respondToToolApproval = this.respondToToolApproval.bind(this), this.getState = this.getState.bind(this), this.subscribe = this.subscribe.bind(this);
  }
  getState() {
    return this.contentBinding.getState();
  }
  addToolResult(e) {
    const t = this.contentBinding.getState();
    if (!t) throw new Error("Message part is not available");
    if (t.type !== "tool-call") throw new Error("Tried to add tool result to non-tool message part");
    if (!this.messageApi) throw new Error("Message API is not available. This is likely a bug in assistant-ui.");
    if (!this.threadApi) throw new Error("Thread API is not available");
    const n = this.messageApi.getState();
    if (!n) throw new Error("Message is not available");
    const r = t.toolName, i = t.toolCallId, s = Ah.toResponse(e);
    this.threadApi.getState().addToolResult({
      messageId: n.id,
      toolName: r,
      toolCallId: i,
      result: s.result,
      artifact: s.artifact,
      isError: s.isError
    });
  }
  resumeToolCall(e) {
    const t = this.contentBinding.getState();
    if (!t) throw new Error("Message part is not available");
    if (t.type !== "tool-call") throw new Error("Tried to resume tool call on non-tool message part");
    if (!this.threadApi) throw new Error("Thread API is not available");
    const n = t.toolCallId;
    this.threadApi.getState().resumeToolCall({
      toolCallId: n,
      payload: e
    });
  }
  respondToToolApproval(e) {
    const t = this.contentBinding.getState();
    if (!t) throw new Error("Message part is not available");
    if (t.type !== "tool-call") throw new Error("Tried to respond to tool approval on non-tool message part");
    if (!t.approval || t.approval.approved !== void 0 || t.approval.resolution !== void 0) throw new Error("Tool call has no pending approval");
    if (!this.threadApi) throw new Error("Thread API is not available");
    this.threadApi.getState().respondToToolApproval($h(t.approval, e));
  }
  subscribe(e) {
    return this.contentBinding.subscribe(e);
  }
};
const sn = Object.freeze({ type: "complete" }), jh = (e, t, n) => {
  if (e.role !== "assistant") return sn;
  if (n.type === "tool-call") return n.result ? sn : e.status;
  const r = t === Math.max(0, e.content.length - 1);
  return e.status.type === "requires-action" ? sn : r ? e.status : sn;
}, cs = (e, t) => {
  const n = e.content[t];
  if (!n) return Ee;
  const r = jh(e, t, n);
  return Object.freeze({
    ...n,
    [at]: n[at],
    status: r
  });
};
var Uh = class {
  get path() {
    return this._core.path;
  }
  _core;
  _threadBinding;
  constructor(e, t) {
    this._core = e, this._threadBinding = t, this.composer = new Bh(new Cn({
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
    const e = this._core.getState();
    return this._threadBinding.getState().deleteMessage(e.id);
  }
  reload(e = {}) {
    const t = this._getEditComposerRuntimeCore(), n = t ?? this._threadBinding.getState().composer, r = t ?? n, { runConfig: i = r.runConfig } = e, s = this._core.getState();
    if (s.role !== "assistant") throw new Error("Can only reload assistant messages");
    this._threadBinding.getState().startRun({
      parentId: s.parentId,
      sourceId: s.id,
      runConfig: i
    });
  }
  speak() {
    const e = this._core.getState();
    return this._threadBinding.getState().speak(e.id);
  }
  stopSpeaking() {
    const e = this._core.getState();
    if (this._threadBinding.getState().speech?.messageId === e.id) this._threadBinding.getState().stopSpeaking();
    else throw new Error("Message is not being spoken");
  }
  submitFeedback({ type: e }) {
    const t = this._core.getState();
    this._threadBinding.getState().submitFeedback({
      messageId: t.id,
      type: e
    });
  }
  switchToBranch({ position: e, branchId: t }) {
    const n = this._core.getState();
    if (t && e) throw new Error("May not specify both branchId and position");
    if (!t && !e) throw new Error("Must specify either branchId or position");
    const r = this._threadBinding.getState().getBranches(n.id);
    let i = t;
    if (e === "previous" ? i = r[n.branchNumber - 2] : e === "next" && (i = r[n.branchNumber]), !i) throw new Error("Branch not found");
    this._threadBinding.getState().switchToBranch(i);
  }
  unstable_getCopyText() {
    return zh(this.getState());
  }
  subscribe(e) {
    return this._core.subscribe(e);
  }
  getMessagePartByIndex(e) {
    if (e < 0) throw new Error("Message part index must be >= 0");
    return new us(new Ce({
      path: {
        ...this.path,
        ref: `${this.path.ref}.content[${e}]`,
        messagePartSelector: {
          type: "index",
          index: e
        }
      },
      getState: () => cs(this.getState(), e),
      subscribe: (t) => this._core.subscribe(t)
    }), this._core, this._threadBinding);
  }
  getMessagePartByToolCallId(e) {
    return new us(new Ce({
      path: {
        ...this.path,
        ref: `${this.path.ref}.content[toolCallId=${JSON.stringify(e)}]`,
        messagePartSelector: {
          type: "toolCallId",
          toolCallId: e
        }
      },
      getState: () => {
        const t = this._core.getState(), n = t.content.findIndex((r) => r.type === "tool-call" && r.toolCallId === e);
        return n === -1 ? Ee : cs(t, n);
      },
      subscribe: (t) => this._core.subscribe(t)
    }), this._core, this._threadBinding);
  }
  getAttachmentByIndex(e) {
    return new Nh(new Ce({
      path: {
        ...this.path,
        ref: `${this.path.ref}.attachments[${e}]`,
        attachmentSource: "message",
        attachmentSelector: {
          type: "index",
          index: e
        }
      },
      getState: () => {
        const t = this.getState().attachments?.[e];
        return t ? {
          ...t,
          source: "message"
        } : Ee;
      },
      subscribe: (t) => this._core.subscribe(t)
    }));
  }
};
const Vh = (e) => ({
  parentId: e.parentId ?? null,
  sourceId: e.sourceId ?? null,
  runConfig: e.runConfig ?? {},
  ...e.stream ? { stream: e.stream } : {}
}), Hh = (e) => ({
  parentId: e.parentId ?? null,
  sourceId: e.sourceId ?? null,
  runConfig: e.runConfig ?? {}
}), qh = (e, t) => typeof t == "string" ? {
  createdAt: /* @__PURE__ */ new Date(),
  parentId: e.at(-1)?.id ?? null,
  sourceId: null,
  runConfig: {},
  role: "user",
  content: [{
    type: "text",
    text: t
  }],
  attachments: [],
  metadata: { custom: {} }
} : {
  createdAt: t.createdAt ?? /* @__PURE__ */ new Date(),
  parentId: t.parentId ?? e.at(-1)?.id ?? null,
  sourceId: t.sourceId ?? null,
  role: t.role ?? "user",
  content: t.content,
  attachments: t.attachments ?? [],
  metadata: t.metadata ?? { custom: {} },
  runConfig: t.runConfig ?? {},
  startRun: t.startRun
}, Kh = (e, t) => {
  const n = e.messages.at(-1);
  return Object.freeze({
    threadId: t.id,
    metadata: t,
    capabilities: e.capabilities,
    isDisabled: e.isDisabled,
    isLoading: e.isLoading,
    isRunning: e.isRunning ?? (n?.role !== "assistant" ? !1 : n.status.type === "running"),
    messages: e.messages,
    state: e.state,
    suggestions: e.suggestions,
    extras: e.extras,
    speech: e.speech,
    voice: e.voice
  });
};
var ma = class {
  get path() {
    return this._threadBinding.path;
  }
  get __internal_threadBinding() {
    return this._threadBinding;
  }
  _threadBinding;
  constructor(e, t) {
    const n = new Ce({
      path: e.path,
      getState: () => Kh(e.getState(), t.getState()),
      subscribe: (r) => {
        const i = e.subscribe(r), s = t.subscribe(r);
        return () => {
          i(), s();
        };
      }
    });
    this._threadBinding = {
      path: e.path,
      getState: () => e.getState(),
      getStateState: () => n.getState(),
      outerSubscribe: (r) => e.outerSubscribe(r),
      subscribe: (r) => e.subscribe(r)
    }, this.composer = new Fh(new Cn({
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
  append(e) {
    this._threadBinding.getState().append(qh(this._threadBinding.getState().messages, e));
  }
  deleteMessage(e) {
    return this._threadBinding.getState().deleteMessage(e);
  }
  subscribe(e) {
    return this._threadBinding.subscribe(e);
  }
  getModelContext() {
    return this._threadBinding.getState().getModelContext();
  }
  startRun(e) {
    return this._threadBinding.getState().startRun(Hh(e));
  }
  resumeRun(e) {
    return this._threadBinding.getState().resumeRun(Vh(e));
  }
  exportExternalState() {
    return this._threadBinding.getState().exportExternalState();
  }
  importExternalState(e) {
    this._threadBinding.getState().importExternalState(e);
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
  subscribeVoiceVolume(e) {
    return this._threadBinding.getState().subscribeVoiceVolume(e);
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
  import(e) {
    this._threadBinding.getState().import(e);
  }
  reset(e) {
    this._threadBinding.getState().reset(e);
  }
  getMessageByIndex(e) {
    if (e < 0) throw new Error("Message index must be >= 0");
    return this._getMessageRuntime({
      ...this.path,
      ref: `${this.path.ref}.messages[${e}]`,
      messageSelector: {
        type: "index",
        index: e
      }
    }, () => {
      const t = this._threadBinding.getState().messages, n = t[e];
      if (n)
        return {
          message: n,
          parentId: t[e - 1]?.id ?? null,
          index: e
        };
    });
  }
  getMessageById(e) {
    return this._getMessageRuntime({
      ...this.path,
      ref: `${this.path.ref}.messages[messageId=${JSON.stringify(e)}]`,
      messageSelector: {
        type: "messageId",
        messageId: e
      }
    }, () => this._threadBinding.getState().getMessageById(e));
  }
  _getMessageRuntime(e, t) {
    return new Uh(new Ce({
      path: e,
      getState: () => {
        const { message: n, parentId: r, index: i } = t() ?? {}, { messages: s, speech: o } = this._threadBinding.getState();
        if (!n || r === void 0 || i === void 0) return Ee;
        const a = this._threadBinding.getState().getBranches(n.id);
        return {
          ...n,
          [at]: n[at],
          index: i,
          isLast: s.at(-1)?.id === n.id,
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
  unstable_on(e, t) {
    let n = this._eventSubscriptionSubjects.get(e);
    return n || (n = new ca({
      event: e,
      binding: this._threadBinding
    }), this._eventSubscriptionSubjects.set(e, n)), n.subscribe(t);
  }
}, on = class {
  get path() {
    return this._core.path;
  }
  _core;
  _threadListBinding;
  constructor(e, t) {
    this._core = e, this._threadListBinding = t, this.__internal_bindMethods();
  }
  __internal_bindMethods() {
    this.switchTo = this.switchTo.bind(this), this.rename = this.rename.bind(this), this.updateCustom = this.updateCustom.bind(this), this.archive = this.archive.bind(this), this.unarchive = this.unarchive.bind(this), this.delete = this.delete.bind(this), this.initialize = this.initialize.bind(this), this.generateTitle = this.generateTitle.bind(this), this.subscribe = this.subscribe.bind(this), this.unstable_on = this.unstable_on.bind(this), this.getState = this.getState.bind(this), this.detach = this.detach.bind(this);
  }
  getState() {
    return this._core.getState();
  }
  switchTo(e) {
    const t = this._core.getState();
    return this._threadListBinding.switchToThread(t.id, e);
  }
  rename(e) {
    const t = this._core.getState();
    return this._threadListBinding.rename(t.id, e);
  }
  updateCustom(e) {
    const t = this._core.getState();
    if (!this._threadListBinding.updateCustom) throw new Error("Thread list runtime does not support updating custom metadata");
    return this._threadListBinding.updateCustom(t.id, e);
  }
  archive() {
    const e = this._core.getState();
    return this._threadListBinding.archive(e.id);
  }
  unarchive() {
    const e = this._core.getState();
    return this._threadListBinding.unarchive(e.id);
  }
  delete() {
    const e = this._core.getState();
    return this._threadListBinding.delete(e.id);
  }
  initialize() {
    const e = this._core.getState();
    return this._threadListBinding.initialize(e.id);
  }
  generateTitle() {
    const e = this._core.getState();
    return this._threadListBinding.generateTitle(e.id);
  }
  unstable_on(e, t) {
    let n = this._core.getState().isMain, r = this._core.getState().id;
    return this.subscribe(() => {
      const i = this._core.getState(), s = i.isMain, o = i.id;
      n === s && r === o || (n = s, r = o, !(e === "switchedTo" && !s) && (e === "switchedAway" && s || gi([t], {}, `Thread list item "${e}"`)));
    });
  }
  subscribe(e) {
    return this._core.subscribe(e);
  }
  detach() {
    const e = this._core.getState();
    this._threadListBinding.detach(e.id);
  }
  __internal_getRuntime() {
    return this;
  }
};
const hs = Promise.resolve(), Wh = (e) => ({
  mainThreadId: e.mainThreadId,
  newThreadId: e.newThreadId,
  threadIds: e.threadIds,
  archivedThreadIds: e.archivedThreadIds,
  isLoading: e.isLoading,
  isLoadingMore: e.isLoadingMore ?? !1,
  hasMore: e.hasMore ?? !1,
  threadItems: e.threadItems
}), an = (e, t) => {
  if (t === void 0) return Ee;
  const n = e.getItemById(t);
  return n ? {
    id: n.id,
    remoteId: n.remoteId,
    externalId: n.externalId,
    title: n.title,
    status: n.status,
    lastMessageAt: n.lastMessageAt,
    custom: n.custom,
    isMain: n.id === e.mainThreadId
  } : Ee;
};
var Jh = class {
  _getState;
  _core;
  _runtimeFactory;
  constructor(e, t = ma) {
    this._core = e, this._runtimeFactory = t;
    const n = new bi({
      path: {},
      getState: () => Wh(e),
      subscribe: (r) => e.subscribe(r)
    });
    this._getState = n.getState.bind(n), this._mainThreadListItemRuntime = new on(new Ce({
      path: {
        ref: "threadItems[main]",
        threadSelector: { type: "main" }
      },
      getState: () => an(this._core, this._core.mainThreadId),
      subscribe: (r) => this._core.subscribe(r)
    }), this._core), this.main = new t(new Cn({
      path: {
        ref: "threads.main",
        threadSelector: { type: "main" }
      },
      getState: () => e.getMainThreadRuntimeCore(),
      subscribe: (r) => e.subscribe(r)
    }), this._mainThreadListItemRuntime), this.__internal_bindMethods();
  }
  __internal_bindMethods() {
    this.switchToThread = this.switchToThread.bind(this), this.switchToNewThread = this.switchToNewThread.bind(this), this.getLoadThreadsPromise = this.getLoadThreadsPromise.bind(this), this.reload = this.reload.bind(this), this.loadMore = this.loadMore.bind(this), this.getState = this.getState.bind(this), this.subscribe = this.subscribe.bind(this), this.getById = this.getById.bind(this), this.getItemById = this.getItemById.bind(this), this.getItemByIndex = this.getItemByIndex.bind(this), this.getArchivedItemByIndex = this.getArchivedItemByIndex.bind(this);
  }
  switchToThread(e, t) {
    return this._core.switchToThread(e, t);
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
  subscribe(e) {
    return this._core.subscribe(e);
  }
  _mainThreadListItemRuntime;
  main;
  get mainItem() {
    return this._mainThreadListItemRuntime;
  }
  getById(e) {
    return new this._runtimeFactory(new Cn({
      path: {
        ref: `threads[threadId=${JSON.stringify(e)}]`,
        threadSelector: {
          type: "threadId",
          threadId: e
        }
      },
      getState: () => this._core.getThreadRuntimeCore(e),
      subscribe: (t) => this._core.subscribe(t)
    }), this.mainItem);
  }
  getItemByIndex(e) {
    return new on(new Ce({
      path: {
        ref: `threadItems[${e}]`,
        threadSelector: {
          type: "index",
          index: e
        }
      },
      getState: () => an(this._core, this._core.threadIds[e]),
      subscribe: (t) => this._core.subscribe(t)
    }), this._core);
  }
  getArchivedItemByIndex(e) {
    return new on(new Ce({
      path: {
        ref: `archivedThreadItems[${e}]`,
        threadSelector: {
          type: "archiveIndex",
          index: e
        }
      },
      getState: () => an(this._core, this._core.archivedThreadIds[e]),
      subscribe: (t) => this._core.subscribe(t)
    }), this._core);
  }
  getItemById(e) {
    return new on(new Ce({
      path: {
        ref: `threadItems[threadId=${e}]`,
        threadSelector: {
          type: "threadId",
          threadId: e
        }
      },
      getState: () => an(this._core, e),
      subscribe: (t) => this._core.subscribe(t)
    }), this._core);
  }
}, Yh = class {
  threads;
  _thread;
  _core;
  constructor(e) {
    this._core = e, this.threads = new Jh(e.threads), this._thread = this.threads.main, this.__internal_bindMethods();
  }
  __internal_bindMethods() {
    this.registerModelContextProvider = this.registerModelContextProvider.bind(this);
  }
  get thread() {
    return this._thread;
  }
  registerModelContextProvider(e) {
    return this._core.registerModelContextProvider(e);
  }
}, Qh = class {
  _contextProvider = new Qo();
  registerModelContextProvider(e) {
    return this._contextProvider.registerModelContextProvider(e);
  }
  getModelContextProvider() {
    return this._contextProvider;
  }
};
const or = (e, t) => {
  if (e.startsWith("data-"))
    return {
      type: "data",
      name: e.substring(5),
      data: t
    };
}, fs = (e, t, n) => {
  const { role: r, id: i, createdAt: s, attachments: o, status: a, metadata: l } = e, u = {
    id: i ?? t,
    createdAt: s ?? /* @__PURE__ */ new Date()
  }, h = typeof e.content == "string" ? [{
    type: "text",
    text: e.content
  }] : e.content, c = ({ image: f, ...d }) => typeof f != "string" ? null : f.match(/^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,(.*)$/) ? {
    ...d,
    image: f
  } : /^(https:\/\/|blob:)/.test(f) ? {
    ...d,
    image: f
  } : (console.warn("Invalid image data format detected"), null);
  if (r !== "user" && o?.length) throw new Error("attachments are only supported for user messages");
  if (r !== "assistant" && a) throw new Error("status is only supported for assistant messages");
  if (r !== "assistant" && l?.steps) throw new Error("metadata.steps is only supported for assistant messages");
  switch (r) {
    case "assistant":
      return {
        ...u,
        role: r,
        content: h.map((f) => {
          const d = f.type;
          switch (d) {
            case "text":
            case "reasoning":
              return f.text?.trim() ? f : null;
            case "file":
            case "source":
              return f;
            case "image":
              return c(f);
            case "data":
              return f;
            case "generative-ui":
              return f;
            case "tool-call": {
              const { parentId: p, messages: y, ...x } = f, b = {
                ...x,
                toolCallId: f.toolCallId ?? `tool-${Wn()}`,
                ...p !== void 0 && { parentId: p },
                ...y !== void 0 && { messages: y }
              };
              return f.args ? {
                ...b,
                args: f.args,
                argsText: f.argsText ?? JSON.stringify(f.args)
              } : {
                ...b,
                args: Ih(f.argsText ?? "") ?? {},
                argsText: f.argsText ?? ""
              };
            }
            default: {
              const p = or(d, f.data);
              if (p) return p;
              throw new Error(`Unsupported assistant message part type: ${d}`);
            }
          }
        }).filter((f) => !!f),
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
        content: h.map((f) => {
          const d = f.type;
          switch (d) {
            case "text":
            case "image":
            case "audio":
            case "file":
            case "data":
              return f;
            default: {
              const p = or(d, f.data);
              if (p) return p;
              throw new Error(`Unsupported user message part type: ${d}`);
            }
          }
        }),
        attachments: (o ?? []).map((f) => ({
          ...f,
          content: f.content.map((d) => or(d.type, d.data) ?? d)
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
}, Et = /* @__PURE__ */ Symbol("autoStatus"), Gh = Object.freeze(Object.assign({ type: "running" }, { [Et]: !0 })), Xh = Object.freeze(Object.assign({
  type: "complete",
  reason: "unknown"
}, { [Et]: !0 })), Zh = Object.freeze(Object.assign({
  type: "requires-action",
  reason: "tool-calls"
}, { [Et]: !0 })), ef = Object.freeze(Object.assign({
  type: "requires-action",
  reason: "interrupt"
}, { [Et]: !0 })), r_ = (e) => e[Et] === !0, Lr = (e, t, n, r, i) => e && i ? Object.assign({
  type: "incomplete",
  reason: "error",
  error: i
}, { [Et]: !0 }) : e && t ? Gh : n ? ef : r ? Zh : Xh, i_ = {
  fromArray: (e) => {
    const t = e.map((n) => fs(n, Wn(), Lr(!1, !1, !1, !1, void 0)));
    return { messages: t.map((n, r) => ({
      parentId: r > 0 ? t[r - 1].id : null,
      message: n
    })) };
  },
  fromBranchableArray: (e, t) => {
    const n = Lr(!1, !1, !1, !1, void 0);
    return {
      ...t?.headId !== void 0 ? { headId: t.headId } : void 0,
      messages: e.map(({ message: r, parentId: i }) => {
        if (!r.id) throw new Error("ExportedMessageRepository.fromBranchableArray: Each message must have an 'id' field set.");
        return {
          parentId: i,
          message: fs(r, r.id, n)
        };
      })
    };
  }
}, bn = (e) => e.next ? bn(e.next) : "current" in e ? e : null;
var tf = class {
  _value = null;
  func;
  constructor(e) {
    this.func = e;
  }
  get value() {
    return this._value === null && (this._value = this.func()), this._value;
  }
  dirty() {
    this._value = null;
  }
}, nf = class {
  messages = /* @__PURE__ */ new Map();
  head = null;
  root = {
    children: [],
    next: null
  };
  updateLevels(e, t) {
    e.level = t;
    for (const n of e.children) {
      const r = this.messages.get(n);
      r && this.updateLevels(r, t + 1);
    }
  }
  performOp(e, t, n) {
    const r = t.prev ?? this.root, i = e ?? this.root;
    if (!(n === "relink" && r === i)) {
      if (n !== "cut") {
        for (let s = e; s; s = s.prev) if (s.current.id === t.current.id) throw new Error("MessageRepository(performOp/link): A message with the same id already exists in the parent tree. This error occurs if the same message id is found multiple times. This is likely an internal bug in assistant-ui.");
      }
      if (n !== "link" && (r.children = r.children.filter((s) => s !== t.current.id), r.next === t)) {
        const s = r.children.at(-1), o = s ? this.messages.get(s) : null;
        if (o === void 0) throw new Error("MessageRepository(performOp/cut): Fallback sibling message not found. This is likely an internal bug in assistant-ui.");
        r.next = o;
      }
      if (n !== "cut") {
        i.children = [...i.children, t.current.id], (bn(t) === this.head || i.next === null) && (i.next = t), t.prev = e;
        const s = e ? e.level + 1 : 0;
        this.updateLevels(t, s);
      }
    }
  }
  _messages = new tf(() => {
    const e = new Array((this.head?.level ?? -1) + 1);
    for (let t = this.head; t; t = t.prev) e[t.level] = t.current;
    return e;
  });
  get headId() {
    return this.head?.current.id ?? null;
  }
  get canonicalHeadId() {
    let e = this.head;
    for (; e?.current.metadata?.isOptimistic; ) e = e.prev;
    return e?.current.id ?? null;
  }
  getMessages(e) {
    if (e === void 0 || e === this.head?.current.id) return this._messages.value;
    const t = this.messages.get(e);
    if (!t) throw new Error("MessageRepository(getMessages): Head message not found. This is likely an internal bug in assistant-ui.");
    const n = new Array(t.level + 1);
    for (let r = t; r; r = r.prev) n[r.level] = r.current;
    return n;
  }
  addOrUpdateMessage(e, t) {
    const n = this.messages.get(t.id), r = e ? this.messages.get(e) : null;
    if (r === void 0) throw new Error("MessageRepository(addOrUpdateMessage): Parent message not found. This is likely an internal bug in assistant-ui.");
    if (n) {
      n.current = t, this.performOp(r, n, "relink"), this._messages.dirty();
      return;
    }
    const i = {
      prev: r,
      current: t,
      next: null,
      children: [],
      level: r ? r.level + 1 : 0
    };
    this.messages.set(t.id, i), this.performOp(r, i, "link"), this.head === r && (this.head = i), this._messages.dirty();
  }
  getMessage(e) {
    const t = this.messages.get(e);
    if (!t) throw new Error("MessageRepository(updateMessage): Message not found. This is likely an internal bug in assistant-ui.");
    return {
      parentId: t.prev?.current.id ?? null,
      message: t.current,
      index: t.level
    };
  }
  deleteMessage(e, t) {
    const n = this.messages.get(e);
    if (!n) throw new Error("MessageRepository(deleteMessage): Message not found. This is likely an internal bug in assistant-ui.");
    const r = t === void 0 ? n.prev : t === null ? null : this.messages.get(t);
    if (r === void 0) throw new Error("MessageRepository(deleteMessage): Replacement not found. This is likely an internal bug in assistant-ui.");
    for (const i of n.children) {
      const s = this.messages.get(i);
      if (!s) throw new Error("MessageRepository(deleteMessage): Child message not found. This is likely an internal bug in assistant-ui.");
      this.performOp(r, s, "relink");
    }
    this.performOp(null, n, "cut"), this.messages.delete(e), this.head === n && (this.head = bn(r ?? this.root)), this._messages.dirty();
  }
  getBranches(e) {
    const t = this.messages.get(e);
    if (!t) throw new Error("MessageRepository(getBranches): Message not found. This is likely an internal bug in assistant-ui.");
    const { children: n } = t.prev ?? this.root;
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
  evictOffBranchOptimisticMessages(e, t) {
    if (!e) return;
    const n = /* @__PURE__ */ new Set();
    for (let i = t; i; i = i.prev) n.add(i.current.id);
    const r = [];
    for (let i = e; i && !n.has(i.current.id); i = i.prev)
      i.current.metadata?.isOptimistic && r.push(i.current.id);
    for (const i of r) this.messages.has(i) && this.deleteMessage(i);
  }
  switchToBranch(e) {
    const t = this.messages.get(e);
    if (!t) throw new Error("MessageRepository(switchToBranch): Branch not found. This is likely an internal bug in assistant-ui.");
    const n = this.head, r = t.prev ?? this.root;
    r.next = t, this.head = bn(t), this.evictOffBranchOptimisticMessages(n, this.head), this._messages.dirty();
  }
  resetHead(e) {
    if (e === null) {
      this.clear();
      return;
    }
    const t = this.messages.get(e);
    if (!t) throw new Error("MessageRepository(resetHead): Branch not found. This is likely an internal bug in assistant-ui.");
    const n = this.head;
    if (t.children.length > 0) {
      const r = (i) => {
        for (const s of i.children) {
          const o = this.messages.get(s);
          o && (r(o), this.messages.delete(s));
        }
      };
      r(t), t.children = [], t.next = null;
    }
    this.head = t;
    for (let r = t; r; r = r.prev) r.prev ? r.prev.next = r : this.root.next = r;
    this.evictOffBranchOptimisticMessages(n, this.head), this._messages.dirty();
  }
  clear() {
    this.messages.clear(), this.head = null, this.root = {
      children: [],
      next: null
    }, this._messages.dirty();
  }
  export() {
    const e = [];
    for (const [, t] of this.messages) {
      if (t.current.metadata?.isOptimistic) continue;
      let n = t.prev;
      for (; n && n.current.metadata?.isOptimistic; ) n = n.prev;
      e.push({
        message: t.current,
        parentId: n?.current.id ?? null
      });
    }
    return {
      headId: this.canonicalHeadId,
      messages: e
    };
  }
  import({ headId: e, messages: t }) {
    for (const { message: n, parentId: r } of t) this.addOrUpdateMessage(r, n);
    this.resetHead(e ?? t.at(-1)?.message.id ?? null);
  }
};
const ga = Object.freeze([]);
function ds(e, t) {
  if (t === "*") return !0;
  const n = t.split(",").map((s) => s.trim().toLowerCase()), r = `.${e.name.split(".").pop().toLowerCase()}`, i = e.type.split(";", 1)[0].trim().toLowerCase();
  for (const s of n) {
    if (s.startsWith(".") && s === r || s.includes("/") && s === i) return !0;
    if (s.endsWith("/*")) {
      const o = s.split("/")[0];
      if (i.startsWith(`${o}/`)) return !0;
    }
  }
  return !1;
}
function s_(e, t) {
  return e.length !== t.length ? !1 : e.every((n, r) => n.id === t[r].id);
}
function rf(e) {
  const t = Wn();
  return e.type === "image" ? {
    id: t,
    type: "image",
    name: e.filename ?? "image",
    content: [e],
    status: { type: "complete" }
  } : e.type === "file" ? {
    id: t,
    type: "document",
    name: e.filename ?? "document",
    contentType: e.mimeType,
    content: [e],
    status: { type: "complete" }
  } : e.type === "audio" ? {
    id: t,
    type: "audio",
    name: `audio.${e.audio.format}`,
    contentType: `audio/${e.audio.format}`,
    content: [e],
    status: { type: "complete" }
  } : {
    id: t,
    type: "data",
    name: e.name,
    content: [e],
    status: { type: "complete" }
  };
}
function o_(e) {
  const t = [];
  for (const n of e) n.type !== "text" && t.push(rf(n));
  return t;
}
const sf = (e) => "content" in e && !("lastModified" in e), ar = (e) => e.status.type === "complete";
var of = class extends Dh {
  isEditing = !0;
  enrichWithComposerMetadata(e, t) {
    return t ? {
      ...e,
      metadata: {
        ...e.metadata,
        custom: {
          ...e.metadata?.custom,
          ...t
        }
      }
    } : e;
  }
  get attachmentAccept() {
    return this.getAttachmentAdapter()?.accept ?? "*";
  }
  _attachments = [];
  get attachments() {
    return this._attachments;
  }
  setAttachments(e) {
    this._attachments = e, this._notifySubscribers();
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
  setQuote(e) {
    this._quote !== e && (this._quote = e, this._notifySubscribers());
  }
  setText(e) {
    if (this._text !== e) {
      if (this._text = e, this._dictation) {
        this._dictationBaseText = e, this._currentInterimText = "";
        const { status: t, inputDisabled: n } = this._dictation;
        this._dictation = n ? {
          status: t,
          inputDisabled: n
        } : { status: t };
      }
      this._notifySubscribers();
    }
  }
  setRole(e) {
    this._role !== e && (this._role = e, this._notifySubscribers());
  }
  setRunConfig(e) {
    this._runConfig !== e && (this._runConfig = e, this._notifySubscribers());
  }
  _isSending = !1;
  _removedDuringSend = /* @__PURE__ */ new Set();
  _sendGeneration = 0;
  _emptyTextAndAttachments() {
    this._attachments = [], this._text = "", this._notifySubscribers();
  }
  async _onClearAttachments() {
    const e = this.getAttachmentAdapter();
    if (e) {
      const t = this._attachments.filter((n) => !ar(n));
      await Promise.all(t.map((n) => e.remove(n)));
    }
  }
  async reset() {
    if (this._sendGeneration++, this._isSending = !1, this._removedDuringSend.clear(), this._attachments.length === 0 && this._text === "" && this._role === "user" && Object.keys(this._runConfig).length === 0 && this._quote === void 0) return;
    this._role = "user", this._runConfig = {}, this._quote = void 0;
    const e = this._onClearAttachments();
    this._emptyTextAndAttachments(), await e;
  }
  async clearAttachments() {
    const e = this._onClearAttachments();
    this.setAttachments([]), await e;
  }
  async send(e) {
    if (!this.canSend || this._isSending) return;
    this._dictationSession && (this._dictationSession.cancel(), this._cleanupDictation());
    const t = this.getAttachmentAdapter(), n = this.attachments.map(async (f) => {
      if (ar(f)) return f;
      if (!t) throw new Error("Attachments are not supported");
      return await t.send(f);
    }), r = this.attachments, i = this.text, s = this._quote;
    this._quote = void 0, this._text = "", this._isSending = !0;
    const o = ++this._sendGeneration;
    this._notifySubscribers();
    let a;
    try {
      a = await Promise.all(n);
    } catch (f) {
      throw o === this._sendGeneration && (!this.text.trim() && this._quote === void 0 && (this._text = i, this._quote = s, this._notifySubscribers()), Promise.allSettled(n).then(() => {
        o === this._sendGeneration && (this._removedDuringSend.clear(), this._isSending = !1, this._notifySubscribers());
      })), f;
    }
    if (o !== this._sendGeneration) return;
    const l = new Set(r.map((f) => f.id));
    this._attachments = this._attachments.filter((f) => !l.has(f.id)), this._isSending = !1, this._notifySubscribers();
    const u = a.filter((f) => !this._removedDuringSend.has(f.id));
    this._removedDuringSend.clear();
    const h = {
      createdAt: /* @__PURE__ */ new Date(),
      role: this.role,
      content: i ? [{
        type: "text",
        text: i
      }] : [],
      attachments: u,
      runConfig: this.runConfig,
      metadata: { custom: { ...s ? { quote: s } : {} } }
    }, c = this.handleSend(h, e);
    c && c.catch(() => {
    }), this._notifyEventSubscribers("send", {});
  }
  cancel() {
    this.handleCancel();
  }
  get queue() {
    return ga;
  }
  steerQueueItem(e) {
  }
  removeQueueItem(e) {
  }
  async addAttachment(e) {
    if (sf(e)) {
      const i = this.getAttachmentAdapter();
      if (i && !ds({
        name: e.name,
        type: e.contentType ?? ""
      }, i.accept)) {
        const o = `File type ${e.contentType || "unknown"} is not accepted. Accepted types: ${i.accept}`, a = new Error(o);
        throw this._safeEmitAttachmentAddError("not-accepted", o, void 0, a), a;
      }
      const s = {
        id: e.id ?? Wn(),
        type: e.type ?? "document",
        name: e.name,
        contentType: e.contentType,
        content: e.content,
        status: { type: "complete" }
      };
      this._attachments = [...this._attachments, s], this._notifySubscribers(), this._notifyEventSubscribers("attachmentAdd", {});
      return;
    }
    const t = (i) => {
      const s = this._attachments.findIndex((o) => o.id === i.id);
      s !== -1 ? this._attachments = [
        ...this._attachments.slice(0, s),
        i,
        ...this._attachments.slice(s + 1)
      ] : this._attachments = [...this._attachments, i], this._notifySubscribers();
    }, n = this.getAttachmentAdapter();
    if (!n) {
      const i = "Attachments are not supported", s = /* @__PURE__ */ new Error(i);
      throw this._safeEmitAttachmentAddError("no-adapter", i, void 0, s), s;
    }
    if (!ds({
      name: e.name,
      type: e.type
    }, n.accept)) {
      const i = `File type ${e.type || "unknown"} is not accepted. Accepted types: ${n.accept}`, s = new Error(i);
      throw this._safeEmitAttachmentAddError("not-accepted", i, void 0, s), s;
    }
    let r;
    try {
      const i = n.add({ file: e });
      if (Symbol.asyncIterator in i) for await (const s of i)
        r = s, t(s);
      else
        r = await i, t(r);
    } catch (i) {
      throw r && t({
        ...r,
        status: {
          type: "incomplete",
          reason: "error",
          message: i instanceof Error ? i.message : String(i)
        }
      }), this._safeEmitAttachmentAddError("adapter-error", i instanceof Error ? i.message : String(i), r?.id, i instanceof Error ? i : void 0), i;
    }
    r?.status.type === "incomplete" && r.status.reason === "error" ? this._safeEmitAttachmentAddError("adapter-error", r.status.message ?? "Attachment upload did not complete successfully.", r.id) : this._notifyEventSubscribers("attachmentAdd", {});
  }
  _safeEmitAttachmentAddError(e, t, n, r) {
    try {
      this._notifyEventSubscribers("attachmentAddError", {
        reason: e,
        message: t,
        ...n !== void 0 && { attachmentId: n },
        ...r !== void 0 && { error: r }
      });
    } catch (i) {
      console.error("[assistant-ui] attachmentAddError subscriber threw:", i);
    }
  }
  async removeAttachment(e) {
    const t = this._attachments.findIndex((r) => r.id === e);
    if (t === -1) throw new Error("Attachment not found");
    const n = this._attachments[t];
    if (this._isSending && this._removedDuringSend.add(e), !ar(n)) {
      const r = this.getAttachmentAdapter();
      if (!r) throw new Error("Attachments are not supported");
      await r.remove(n);
    }
    this._attachments = this._attachments.filter((r) => r.id !== e), this._notifySubscribers();
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
  _isActiveSession(e, t) {
    return this._activeDictationSessionId === e && this._dictationSession === t;
  }
  startDictation() {
    const e = this.getDictationAdapter();
    if (!e) throw new Error("Dictation adapter not configured");
    if (this._dictationSession) {
      for (const l of this._dictationUnsubscribes) l();
      this._dictationUnsubscribes = [], this._dictationSession.stop().catch(() => {
      }), this._dictationSession = void 0;
    }
    const t = e.disableInputDuringDictation ?? !1;
    this._dictationBaseText = this._text, this._currentInterimText = "";
    const n = e.listen();
    this._dictationSession = n;
    const r = ++this._dictationSessionIdCounter;
    this._activeDictationSessionId = r, this._dictation = {
      status: n.status,
      inputDisabled: t
    }, this._notifySubscribers();
    const i = n.onSpeech((l) => {
      if (!this._isActiveSession(r, n)) return;
      const u = l.isFinal !== !1, h = this._dictationBaseText && !this._dictationBaseText.endsWith(" ") && l.transcript ? " " : "";
      if (u) {
        if (this._dictationBaseText = this._dictationBaseText + h + l.transcript, this._currentInterimText = "", this._text = this._dictationBaseText, this._dictation) {
          const { transcript: c, ...f } = this._dictation;
          this._dictation = f;
        }
        this._notifySubscribers();
      } else
        this._currentInterimText = h + l.transcript, this._text = this._dictationBaseText + this._currentInterimText, this._dictation && (this._dictation = {
          ...this._dictation,
          transcript: l.transcript
        }), this._notifySubscribers();
    });
    this._dictationUnsubscribes.push(i);
    const s = n.onSpeechStart(() => {
      this._isActiveSession(r, n) && (this._dictation = {
        status: { type: "running" },
        inputDisabled: t,
        ...this._dictation?.transcript && { transcript: this._dictation.transcript }
      }, this._notifySubscribers());
    });
    this._dictationUnsubscribes.push(s);
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
    const e = this._dictationSession, t = this._activeDictationSessionId;
    e.stop().finally(() => {
      this._cleanupDictation({ sessionId: t });
    });
  }
  _cleanupDictation(e) {
    if (!(e?.sessionId !== void 0 && e.sessionId !== this._activeDictationSessionId || this._isCleaningDictation)) {
      this._isCleaningDictation = !0;
      try {
        for (const t of this._dictationUnsubscribes) t();
        this._dictationUnsubscribes = [], this._dictationSession = void 0, this._activeDictationSessionId = void 0, this._dictation = void 0, this._dictationBaseText = "", this._currentInterimText = "", this._notifySubscribers();
      } finally {
        this._isCleaningDictation = !1;
      }
    }
  }
  _eventSubscribers = /* @__PURE__ */ new Map();
  _notifyEventSubscribers(e, t) {
    const n = this._eventSubscribers.get(e);
    n && gi(n, t, `Composer runtime "${e}"`);
  }
  unstable_on(e, t) {
    const n = t;
    let r = this._eventSubscribers.get(e);
    return r || (r = /* @__PURE__ */ new Set(), this._eventSubscribers.set(e, r)), r.add(n), () => {
      this._eventSubscribers.get(e)?.delete(n);
    };
  }
}, af = class extends of {
  _canCancel = !1;
  get canCancel() {
    return this._canCancel;
  }
  get canSend() {
    return !this.isEmpty && !this.runtime.isSendDisabled && !this._isSending;
  }
  get queue() {
    return this.runtime.getQueueItems?.() ?? ga;
  }
  steerQueueItem(e) {
    this.runtime.steerQueueItem?.(e);
  }
  removeQueueItem(e) {
    this.runtime.removeQueueItem?.(e);
  }
  getAttachmentAdapter() {
    return this.runtime.adapters?.attachments;
  }
  getDictationAdapter() {
    return this.runtime.adapters?.dictation;
  }
  runtime;
  constructor(e) {
    super(), this.runtime = e, this.connect();
  }
  connect() {
    let e = this.runtime.isSendDisabled, t = this.queue;
    return this.runtime.subscribe(() => {
      let n = !1;
      this.canCancel !== this.runtime.capabilities.cancel && (this._canCancel = this.runtime.capabilities.cancel, n = !0), e !== this.runtime.isSendDisabled && (e = this.runtime.isSendDisabled, n = !0), t !== this.queue && (t = this.queue, n = !0), n && this._notifySubscribers();
    });
  }
  async handleSend(e, t) {
    const n = kh(this.runtime.getModelContext().unstable_composerMetadata, this.runtime.messages), r = this.enrichWithComposerMetadata(e, n);
    return this.runtime.append({
      ...r,
      parentId: this.runtime.messages.at(-1)?.id ?? null,
      sourceId: null,
      startRun: t?.startRun,
      steer: t?.steer
    });
  }
  async handleCancel() {
    this.runtime.cancelRun();
  }
};
const lf = (e) => {
  const { cloud: t, initialMessages: n, maxSteps: r, adapters: i, unstable_humanToolNames: s, unstable_enableMessageQueue: o, ...a } = e;
  return {
    localRuntimeOptions: {
      cloud: t,
      initialMessages: n,
      maxSteps: r,
      adapters: i,
      unstable_humanToolNames: s,
      unstable_enableMessageQueue: o
    },
    otherOptions: a
  };
};
function uf(e, t) {
  function n(i) {
    const s = e(i);
    return s ? s[t] : null;
  }
  function r(i) {
    let s = !1, o;
    typeof i == "function" ? o = i : i && typeof i == "object" && (s = !!i.optional, o = i.selector);
    const a = n({ optional: s });
    return a ? o ? a(o) : a() : null;
  }
  return {
    [t]: r,
    [`${t}Store`]: n
  };
}
const ps = (e) => e;
var ms = Object.defineProperty, cf = (e, t) => {
  let n = {};
  for (var r in e) ms(n, r, {
    get: e[r],
    enumerable: !0
  });
  return ms(n, Symbol.toStringTag, { value: "Module" }), n;
}, hf = Object.defineProperty, ff = (e, t) => hf(e, "name", { value: t, configurable: !0 });
function Kt(e) {
  const t = ue(e);
  return de(() => {
    t.current = e;
  }), xt(() => ((...n) => t.current?.(...n)), []);
}
ff(Kt, "useCallbackRef");
const df = Xt(null), pf = () => ui(df), mf = () => !1, gf = () => {
}, bf = (e) => {
  const t = be(4);
  let n;
  t[0] !== e ? (n = (s) => {
    if (typeof window > "u" || e === null || !window.matchMedia) return gf;
    const o = window.matchMedia(e);
    return o.addEventListener("change", s), () => o.removeEventListener("change", s);
  }, t[0] = e, t[1] = n) : n = t[1];
  const r = n;
  let i;
  return t[2] !== e ? (i = () => typeof window > "u" || e === null || !window.matchMedia ? !1 : window.matchMedia(e).matches, t[2] = e, t[3] = i) : i = t[3], jo(r, i, mf);
}, yf = () => aa(xf);
function xf(e) {
  if (e.part.type !== "text" && e.part.type !== "reasoning") throw new Error("MessagePartText can only be used inside text or reasoning message parts.");
  return e.part;
}
const ba = Xt(null), wf = (e) => ({ useSmoothStatus: du(() => e) }), kf = (e) => {
  const t = be(6), { children: n } = e;
  let r;
  t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (r = { optional: !0 }, t[0] = r) : r = t[0];
  const i = ya(r), s = mi();
  let o;
  t[1] !== s ? (o = () => wf(s.part().getState().status), t[1] = s, t[2] = o) : o = t[2];
  const [a] = Se(o);
  if (i) return n;
  let l;
  return t[3] !== n || t[4] !== a ? (l = /* @__PURE__ */ w(ba.Provider, {
    value: a,
    children: n
  }), t[3] = n, t[4] = a, t[5] = l) : l = t[5], l;
}, _f = (e) => {
  const t = yo((n, r) => {
    const i = be(3), s = n;
    let o;
    return i[0] !== r || i[1] !== s ? (o = /* @__PURE__ */ w(kf, { children: /* @__PURE__ */ w(e, {
      ...s,
      ref: r
    }) }), i[0] = r, i[1] = s, i[2] = o) : o = i[2], o;
  });
  return t.displayName = e.displayName, t;
};
function ya(e) {
  const t = ui(ba);
  if (!e?.optional && !t) throw new Error("This component must be used within a SmoothContextProvider.");
  return t;
}
const { useSmoothStatus: Sf, useSmoothStatusStore: Cf } = uf(ya, "useSmoothStatus"), xa = 250, wa = 5;
var vf = class {
  currentText;
  setText;
  animationFrameId = null;
  lastUpdateTime = Date.now();
  lastCommitTime = 0;
  targetText = "";
  drainMs = xa;
  maxCharIntervalMs = wa;
  maxCharsPerFrame = 1 / 0;
  minCommitMs = 0;
  constructor(e, t) {
    this.currentText = e, this.setText = t;
  }
  start() {
    this.animationFrameId === null && (this.lastUpdateTime = Date.now(), this.animate());
  }
  stop() {
    this.animationFrameId !== null && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null);
  }
  animate = () => {
    const e = Date.now();
    let t = e - this.lastUpdateTime;
    const n = this.targetText.length - this.currentText.length, r = Math.min(this.maxCharIntervalMs, this.drainMs / n), i = Math.min(n, this.maxCharsPerFrame);
    let s = 0;
    for (; t >= r && s < i; )
      s++, t -= r;
    s === i && i === this.maxCharsPerFrame && (t = 0), s !== n ? this.animationFrameId = requestAnimationFrame(this.animate) : this.animationFrameId = null, s !== 0 && (this.currentText = this.targetText.slice(0, this.currentText.length + s), this.lastUpdateTime = e - t, (s === n || e - this.lastCommitTime >= this.minCommitMs) && (this.lastCommitTime = e, this.setText(this.currentText)));
  };
};
const lr = Object.freeze({ type: "running" }), ln = (e, t) => e !== void 0 && e > 0 ? e : t, Ef = (e, t = !1) => {
  const { text: n } = e, r = bf("(prefers-reduced-motion: reduce)"), i = typeof t == "object" && t !== null ? t : void 0, s = t !== !1 && t !== null && !r, o = ln(i?.drainMs, xa), a = ln(i?.maxCharIntervalMs, wa), l = ln(i?.maxCharsPerFrame, 1 / 0), u = ln(i?.minCommitMs, 0), [h, c] = Se(e.status.type === "running" ? "" : n), f = mi(), d = aa(() => f.part()), [p, y] = Se(d);
  (d !== p || !n.startsWith(h)) && (y(d), c(e.status.type === "running" ? "" : n));
  const x = Cf({ optional: !0 }), b = Kt((M) => {
    if (c(M), x) {
      const A = h !== M || e.status.type === "running" ? lr : e.status;
      ps(x).setState(A, !0);
    }
  });
  X(() => {
    if (x) {
      const M = s && (h !== n || e.status.type === "running") ? lr : e.status;
      ps(x).setState(M, !0);
    }
  }, [
    x,
    s,
    n,
    h,
    e.status
  ]);
  const [S] = Se(new vf(h, b));
  X(() => {
    S.drainMs = o, S.maxCharIntervalMs = a, S.maxCharsPerFrame = l, S.minCommitMs = u;
  }, [
    S,
    o,
    a,
    l,
    u
  ]);
  const v = De(d);
  return X(() => {
    if (!s) {
      S.stop();
      return;
    }
    const M = v.current !== d;
    if (v.current = d, M || !n.startsWith(S.targetText)) {
      e.status.type === "running" ? (S.currentText = "", S.targetText = n, S.lastCommitTime = 0, S.start()) : (S.currentText = n, S.targetText = n, S.stop());
      return;
    }
    S.targetText = n, S.start();
  }, [
    S,
    s,
    n,
    e.status.type,
    d
  ]), X(() => () => {
    S.stop();
  }, [S]), he(() => s ? {
    ...e,
    text: h,
    status: n === h ? e.status : lr
  } : e, [
    s,
    h,
    e,
    n
  ]);
};
var If = /* @__PURE__ */ cf({
  AssistantRuntimeImpl: () => Yh,
  BaseAssistantRuntimeCore: () => Qh,
  CompositeContextProvider: () => Qo,
  DefaultThreadComposerRuntimeCore: () => af,
  MessageRepository: () => nf,
  ThreadRuntimeImpl: () => ma,
  getAutoStatus: () => Lr,
  splitLocalRuntimeOptions: () => lf,
  useComposerInputPluginRegistryOptional: () => pf,
  useSmooth: () => Ef,
  useSmoothStatus: () => Sf,
  withSmoothContextProvider: () => _f
});
const Fr = Me.isPlainRecord;
function st(e) {
  return !Fr(e) || !Array.isArray(e.artifacts) ? [] : e.artifacts.map(Af).filter((t) => !!t);
}
function yi(e) {
  const t = {};
  for (const n of st(e)) {
    if (n.status !== "ready" || !n.url)
      continue;
    const r = Df(n.kind), i = t[r], s = Array.isArray(i) ? i : [];
    t[r] = [
      ...s,
      {
        id: n.fileID,
        name: n.name || n.label,
        url: n.url,
        thumbnail: n.previewUrl,
        mime: n.mime,
        size: n.size
      }
    ];
  }
  return t;
}
function Af(e) {
  if (!Fr(e))
    return null;
  const t = un(e.artifact_id ?? e.id);
  return t ? {
    id: t,
    fileID: un(e.file_id ?? e.fileID),
    displayNo: Math.floor(un(e.display_no ?? e.displayNo)),
    label: Ke(e.label) || `素材 ${t}`,
    name: Ke(e.name),
    kind: Tf(e.kind),
    status: Rf(e.status),
    error: Ke(e.error),
    url: Ke(e.url || e.open_url),
    previewUrl: Ke(e.preview_url || e.previewUrl || e.url),
    mime: Ke(e.mime),
    size: un(e.size),
    meta: Fr(e.meta) ? { ...e.meta } : {}
  } : null;
}
function Tf(e) {
  const t = Ke(e).toLowerCase();
  return t === "image" || t === "video" || t === "audio" ? t : "file";
}
function Rf(e) {
  const t = Ke(e).toLowerCase();
  return t === "ready" || t === "failed" ? t : "generating";
}
function Df(e) {
  return e === "image" ? "images" : e === "video" ? "videos" : e === "audio" ? "audios" : "files";
}
function un(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? t : 0;
}
function Ke(e) {
  return e == null ? "" : String(e).trim();
}
const Wt = Me.isPlainRecord, Mf = _o.resolveAssetUrl;
function Pf(e) {
  return e && typeof e.meta.intro == "string" ? e.meta.intro.trim() : "";
}
function ka(e, t) {
  const n = t.trim(), r = String(e || "").trim().split(/\n{2,}/).map(
    (i) => i.split(`
`).filter((s) => !Hf(s, n)).join(`
`).trim()
  ).filter(Boolean);
  return r.filter((i, s) => i !== r[s - 1]).join(`

`);
}
function Nf(e) {
  return Of(e);
}
function Of(e) {
  const t = e.blocks.flatMap((n) => {
    if (n.type === "text") {
      const r = ka(
        n.text,
        e.title
      );
      return r ? [r] : [];
    }
    return n.artifacts.map(Lf).filter((r) => !!r);
  });
  return e.title && t.unshift(`# ${e.title}`), t.join(`

`);
}
function Lf(e) {
  const t = Mf(
    String(e.url || e.previewUrl || "").trim()
  );
  if (e.status !== "ready" || !t)
    return "";
  const n = Ff(
    e.label || e.name || `素材 ${e.id}`
  ), r = `<${t.replaceAll("<", "%3C").replaceAll(">", "%3E").replaceAll(" ", "%20")}>`;
  return e.kind === "image" ? `![${n}](${r})` : `[${n}](${r})`;
}
function Ff(e) {
  return String(e || "").replace(/[\\[\]]/g, "\\$&");
}
function xi(e) {
  if (!Wt(e))
    return;
  const t = rt(e.id);
  if (!t)
    return;
  const n = Array.isArray(e.blocks), r = n ? e.blocks.map(Sa).filter((s) => !!s).sort(Aa) : [], i = zr(e.status);
  return {
    id: t,
    hydrated: n,
    sessionID: rt(e.session_id),
    messageID: rt(e.message_id),
    runID: rt(e.run_id),
    title: re(e.title),
    status: i,
    blockCount: $e(e.block_count) || r.length,
    pendingJobCount: wi(i) ? 0 : $e(e.pending_job_count),
    meta: Wt(e.meta) ? { ...e.meta } : {},
    blocks: r,
    createdAt: re(e.created_at),
    updatedAt: re(e.updated_at),
    completedAt: re(e.completed_at)
  };
}
function Bf(e, t) {
  if (!t)
    return e;
  if (!e || e.id !== t.id)
    return t;
  const n = Br(e.status, t.status);
  return {
    ...e,
    ...t,
    sessionID: t.sessionID || e.sessionID,
    messageID: t.messageID || e.messageID,
    runID: t.runID || e.runID,
    title: t.title || e.title,
    status: n,
    pendingJobCount: wi(n) ? 0 : t.pendingJobCount,
    hydrated: e.hydrated || t.hydrated,
    meta: { ...e.meta, ...t.meta },
    blocks: Ca(e.blocks, t.blocks)
  };
}
function a_(e, t) {
  if (!Wt(t))
    return e;
  const n = xi(t.document);
  let r = Bf(e, n);
  const i = rt(t.document_id) || n?.id || 0;
  if (!r || i && r.id !== i)
    return r;
  const s = Sa(t.block);
  if (s) {
    const h = Ca(r.blocks, [s]);
    r = {
      ...r,
      blocks: h,
      blockCount: Math.max(r.blockCount, h.length)
    };
  }
  const o = rt(t.block_id) || s?.id || 0, a = Ea(t.artifacts), l = re(t.event).toLowerCase();
  l === "text_delta" && o && (r = $f(r, o, {
    revision: $e(t.revision),
    delta: re(t.delta, !1)
  })), o && (r = va(r, o, (h) => ({
    ...h,
    status: Ta(
      h.status,
      Uf(l, h.status)
    ),
    artifacts: a.length > 0 ? Ia(h.artifacts, a) : h.artifacts,
    meta: {
      ...h.meta,
      ...t.progress == null ? {} : { progress: t.progress },
      ...re(t.text) ? { progress_text: re(t.text) } : {}
    }
  })));
  const u = re(t.status);
  return l === "document_content_complete" ? r = {
    ...r,
    status: Br(
      r.status,
      zr(u || "generating")
    )
  } : l === "document_complete" && (r = {
    ...r,
    status: Br(
      r.status,
      zr(u || "ready")
    ),
    pendingJobCount: 0
  }), r;
}
function Yn(e) {
  return !e || wi(e.status) ? !1 : e.status === "writing" || e.status === "generating" || e.pendingJobCount > 0 || e.blocks.some(
    (t) => t.type === "media" && t.status !== "failed" && !_a(t)
  );
}
function _a(e) {
  return e.type === "media" && e.artifacts.length > 0 && e.artifacts.every(
    (t) => t.status === "ready" && !!String(t.url || t.previewUrl || "").trim()
  );
}
function l_(e) {
  return !!(e && (!e.hydrated || Yn(e) || e.blocks.some(
    (t) => t.meta.stream_out_of_sync === !0
  )));
}
function Sa(e) {
  if (!Wt(e))
    return null;
  const t = rt(e.id);
  if (!t)
    return null;
  const n = re(e.type) === "media" ? "media" : "text";
  return {
    id: t,
    seq: $e(e.seq),
    type: n,
    format: re(e.format) || (n === "media" ? "artifact" : "markdown"),
    mediaKind: Kf(e.media_kind),
    text: re(e.text, !1),
    status: qf(e.status, n),
    meta: Wt(e.meta) ? { ...e.meta } : {},
    artifacts: Ea(e.artifacts)
  };
}
function Ca(e, t) {
  const n = new Map(e.map((r) => [r.id, r]));
  for (const r of t) {
    const i = n.get(r.id), s = i ? jf(i.meta, r.meta) : r.meta;
    n.set(
      r.id,
      i ? {
        ...i,
        ...r,
        text: zf(i, r),
        status: Ta(i.status, r.status),
        meta: s,
        artifacts: Ia(i.artifacts, r.artifacts)
      } : r
    );
  }
  return Array.from(n.values()).sort(Aa);
}
function zf(e, t) {
  const n = $e(e.meta.stream_revision), r = $e(t.meta.stream_revision);
  return n > r ? e.text : t.text || e.text;
}
function $f(e, t, n) {
  return !n.revision || !n.delta ? e : va(e, t, (r) => {
    if (r.type !== "text")
      return r;
    const i = $e(r.meta.stream_revision);
    if (n.revision <= i)
      return r;
    if (n.revision !== i + 1)
      return {
        ...r,
        meta: { ...r.meta, stream_out_of_sync: !0 }
      };
    const s = { ...r.meta, stream_revision: n.revision };
    return delete s.stream_out_of_sync, { ...r, text: `${r.text}${n.delta}`, meta: s };
  });
}
function jf(e, t) {
  const n = { ...e, ...t }, r = $e(e.stream_revision), i = $e(t.stream_revision);
  return r > i ? (n.stream_revision = r, n) : (i >= r && i > 0 && delete n.stream_out_of_sync, n);
}
function va(e, t, n) {
  return {
    ...e,
    blocks: e.blocks.map(
      (r) => r.id === t ? n(r) : r
    )
  };
}
function Ea(e) {
  return st({ artifacts: Array.isArray(e) ? e : [] });
}
function Ia(e, t) {
  const n = new Map(e.map((r) => [r.id, r]));
  for (const r of t) {
    const i = n.get(r.id);
    n.set(
      r.id,
      i ? {
        ...i,
        ...r,
        fileID: r.fileID || i.fileID,
        status: Vf(i.status, r.status),
        url: r.url || i.url,
        previewUrl: r.previewUrl || i.previewUrl,
        mime: r.mime || i.mime,
        size: r.size || i.size
      } : r
    );
  }
  return Array.from(n.values()).sort(
    (r, i) => r.displayNo - i.displayNo || r.id - i.id
  );
}
function Aa(e, t) {
  return e.seq - t.seq || e.id - t.id;
}
function Uf(e, t) {
  return e === "artifact_ready" ? "ready" : e === "artifact_failed" ? "failed" : e === "artifact_progress" ? "generating" : t;
}
function Br(e, t) {
  return gs(t) >= gs(e) ? t : e;
}
function gs(e) {
  return e === "failed" ? 3 : e === "ready" || e === "partial_failed" ? 2 : e === "generating" ? 1 : 0;
}
function wi(e) {
  return e === "ready" || e === "partial_failed" || e === "failed";
}
function Ta(e, t) {
  return e !== "generating" && t === "generating" ? e : t;
}
function Vf(e, t) {
  return e !== "generating" && t === "generating" ? e : t;
}
function Hf(e, t) {
  if (!t)
    return !1;
  const n = e.trim().match(/^#{1,6}\s+(.+)$/);
  return !!(n && n[1].trim() === t);
}
function zr(e) {
  const t = re(e).toLowerCase();
  return t === "generating" || t === "ready" || t === "partial_failed" || t === "failed" ? t : "writing";
}
function qf(e, t) {
  const n = re(e).toLowerCase();
  return n === "generating" || n === "failed" ? n : t === "media" && !n ? "generating" : "ready";
}
function Kf(e) {
  const t = re(e).toLowerCase();
  return t === "image" || t === "video" || t === "audio" ? t : "file";
}
function rt(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? Math.floor(t) : 0;
}
function $e(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? Math.floor(t) : 0;
}
function re(e, t = !0) {
  const n = e == null ? "" : String(e);
  return t ? n.trim() : n;
}
const Wf = _o.resolveAssetUrl, Ra = Zr({
  messageID: 0
});
function Jf({
  messageID: e,
  render: t,
  children: n
}) {
  return /* @__PURE__ */ w(Ra.Provider, { value: { messageID: e, render: t }, children: n });
}
function Yf() {
  return On(Ra);
}
function Qf(e, t, n) {
  return {
    ...e,
    context: {
      source: "agent-chat",
      messageID: t,
      artifacts: n
    }
  };
}
function Gf(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return null;
  const t = e;
  return t.source !== "agent-chat" || !Number(t.messageID) || !Array.isArray(t.artifacts) ? null : {
    source: "agent-chat",
    messageID: Number(t.messageID),
    artifacts: t.artifacts
  };
}
function Da(e, t, n, r = 0) {
  const i = e.filter(
    (a) => a.kind === t && a.status === "ready" && a.url
  ), s = ur(n);
  return i.find(
    (a) => ur(a.url) === s || ur(a.previewUrl) === s
  ) || i[r] || null;
}
function ur(e) {
  return Wf(String(e || "").trim());
}
const Xf = $n.EnergonAudioPlayer;
function Zf({
  kind: e,
  items: t,
  activeIndex: n,
  zoom: r = 1,
  compact: i = !1,
  className: s = "",
  onSelect: o
}) {
  const a = t[n] || t[0];
  return a ? /* @__PURE__ */ B(
    "div",
    {
      className: [
        "bot-media-inspector-gallery",
        i ? "is-compact" : "",
        s
      ].filter(Boolean).join(" "),
      children: [
        /* @__PURE__ */ w("style", { children: rd }),
        /* @__PURE__ */ w(ed, { kind: e, item: a, zoom: r }),
        t.length > 1 ? /* @__PURE__ */ w(
          td,
          {
            kind: e,
            items: t,
            activeIndex: n,
            onSelect: o
          }
        ) : null
      ]
    }
  ) : null;
}
function ed({
  kind: e,
  item: t,
  zoom: n
}) {
  return /* @__PURE__ */ B("div", { className: "bot-media-inspector-stage", children: [
    e === "image" ? t.url ? /* @__PURE__ */ w(
      "img",
      {
        src: t.url,
        alt: t.name,
        draggable: !1,
        style: { transform: `scale(${n})` }
      },
      t.url
    ) : /* @__PURE__ */ w(cr, { kind: e }) : null,
    e === "video" ? t.url ? /* @__PURE__ */ w(
      "video",
      {
        src: t.url,
        poster: t.thumbnail,
        controls: !0,
        playsInline: !0,
        preload: "metadata"
      },
      t.url
    ) : /* @__PURE__ */ w(cr, { kind: e }) : null,
    e === "audio" ? t.url ? /* @__PURE__ */ w(
      Xf,
      {
        src: t.url,
        detailed: !0,
        className: "bot-media-inspector-audio"
      },
      t.url
    ) : /* @__PURE__ */ w(cr, { kind: e }) : null,
    e === "file" ? /* @__PURE__ */ B("div", { className: "bot-media-inspector-file", children: [
      /* @__PURE__ */ w(ut, { "aria-hidden": "true" }),
      /* @__PURE__ */ w("strong", { children: t.name })
    ] }) : null
  ] });
}
function td({
  kind: e,
  items: t,
  activeIndex: n,
  onSelect: r
}) {
  const i = ue(null);
  return de(() => {
    i.current?.scrollIntoView({
      block: "nearest",
      inline: "nearest"
    });
  }, [n]), /* @__PURE__ */ w("nav", { className: "bot-media-inspector-rail", "aria-label": "同批素材", children: /* @__PURE__ */ w("div", { className: "bot-media-inspector-list", children: t.map((s, o) => /* @__PURE__ */ w(
    "button",
    {
      ref: o === n ? i : void 0,
      type: "button",
      title: s.name,
      "aria-label": `查看第 ${o + 1} 个素材`,
      "aria-current": o === n ? "true" : void 0,
      onClick: () => r(o),
      children: e === "image" && s.url || s.thumbnail ? /* @__PURE__ */ w("img", { src: s.thumbnail || s.url, alt: "" }) : /* @__PURE__ */ w(Ma, { kind: e })
    },
    `${String(s.id)}-${o}`
  )) }) });
}
function cr({ kind: e }) {
  return /* @__PURE__ */ B("div", { className: "bot-media-inspector-empty", children: [
    /* @__PURE__ */ w(Ma, { kind: e }),
    /* @__PURE__ */ w("span", { children: "当前素材无法在线预览" })
  ] });
}
function Ma({ kind: e }) {
  const t = nd[e];
  return /* @__PURE__ */ w(t, { "aria-hidden": "true" });
}
const nd = {
  image: Bn,
  video: zn,
  audio: So,
  file: ut
}, rd = `
.bot-media-inspector-gallery {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
}

.bot-media-inspector-gallery.is-compact {
  height: auto;
  flex: 0 0 auto;
}

.bot-media-inspector-stage {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background: var(--wb-detail-surface-soft, hsl(var(--muted) / 0.2));
  padding: 16px;
}

.bot-media-inspector-gallery.is-compact .bot-media-inspector-stage {
  min-height: 224px;
  padding: 32px 24px;
}

.bot-media-inspector-stage > img,
.bot-media-inspector-stage > video {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.bot-media-inspector-stage > img {
  user-select: none;
  transition: transform 150ms ease;
}

.bot-media-inspector-stage > video {
  background: #000;
}

.bot-media-inspector-audio {
  width: min(768px, 100%);
}

.bot-media-inspector-file,
.bot-media-inspector-empty {
  display: flex;
  max-width: 420px;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--wb-detail-muted, hsl(var(--muted-foreground)));
  text-align: center;
}

.bot-media-inspector-file svg,
.bot-media-inspector-empty svg {
  width: 40px;
  height: 40px;
}

.bot-media-inspector-file strong {
  color: var(--wb-detail-text, hsl(var(--foreground)));
  font-size: 14px;
  overflow-wrap: anywhere;
}

.bot-media-inspector-rail {
  display: flex;
  height: 80px;
  flex: 0 0 80px;
  border-top: 1px solid var(--wb-detail-line, hsl(var(--border)));
  background: var(--wb-detail-surface, hsl(var(--background)));
  padding: 8px 12px;
}

.bot-media-inspector-list {
  display: flex;
  min-width: 0;
  flex: 1;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
}

.bot-media-inspector-list > button {
  display: flex;
  width: 64px;
  height: 64px;
  flex: 0 0 64px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--wb-detail-line, hsl(var(--border)));
  border-radius: 5px;
  background: var(--wb-detail-surface-soft, hsl(var(--muted) / 0.3));
  color: var(--wb-detail-muted, hsl(var(--muted-foreground)));
  padding: 0;
  cursor: pointer;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.bot-media-inspector-list > button:hover {
  border-color: color-mix(
    in srgb,
    var(--wb-detail-text, hsl(var(--foreground))) 40%,
    var(--wb-detail-line, hsl(var(--border)))
  );
}

.bot-media-inspector-list > button[aria-current="true"] {
  border-color: var(--wb-detail-text, hsl(var(--foreground)));
  box-shadow: 0 0 0 1px var(--wb-detail-text, hsl(var(--foreground)));
}

.bot-media-inspector-list > button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bot-media-inspector-list > button svg {
  width: 20px;
  height: 20px;
}

@media (min-width: 768px) {
  .bot-media-inspector-gallery {
    flex-direction: row;
  }

  .bot-media-inspector-rail {
    width: 92px;
    height: 100%;
    flex: 0 0 92px;
    border-top: 0;
    border-left: 1px solid var(--wb-detail-line, hsl(var(--border)));
    padding: 12px 10px;
  }

  .bot-media-inspector-list {
    display: grid;
    width: 100%;
    max-height: 100%;
    flex: none;
    grid-template-columns: minmax(0, 1fr);
    grid-auto-rows: 70px;
    gap: 8px;
    overflow-x: hidden;
    overflow-y: auto;
    padding-right: 2px;
  }

  .bot-media-inspector-list > button {
    width: 100%;
    height: 70px;
    min-height: 70px;
    flex: none;
  }
}
`, id = ko.Button, sd = ct.cn, Pa = Zr(
  null
);
function u_() {
  const [e, t] = Re(
    null
  ), [n, r] = Re(0), i = _e((u) => {
    const h = u.items.findIndex(
      (c) => String(c.id) === String(u.initialItemId)
    );
    t(u), r(h >= 0 ? h : 0);
  }, []), s = _e(() => {
    t(null), r(0);
  }, []), o = _e((u) => {
    r(u);
  }, []), a = _e(
    (u) => {
      const h = e?.items.length || 0;
      h <= 1 || r((c) => (c + u + h) % h);
    },
    [e?.items.length]
  ), l = e?.items[n];
  return {
    request: e,
    activeIndex: n,
    activeItem: l,
    open: !!(e && l),
    openPreview: i,
    closePreview: s,
    selectIndex: o,
    move: a
  };
}
function c_({
  controller: e,
  children: t
}) {
  return /* @__PURE__ */ w(Pa.Provider, { value: e.openPreview, children: t });
}
function od() {
  return On(Pa) || void 0;
}
function h_({
  controller: e,
  renderArtifactActions: t
}) {
  const { request: n, activeIndex: r, activeItem: i, closePreview: s, move: o, selectIndex: a } = e, [l, u] = Re(1), [h, c] = Re(!1), [f, d] = Re("");
  de(() => {
    u(1), d("");
  }, [i?.id]), de(() => {
    if (!n)
      return;
    const A = (_) => {
      if (_.key === "Escape") {
        _.preventDefault(), _.stopImmediatePropagation(), s();
        return;
      }
      cd(_.target) || (_.key === "ArrowLeft" && (_.preventDefault(), o(-1)), _.key === "ArrowRight" && (_.preventDefault(), o(1)));
    };
    return window.addEventListener("keydown", A, !0), () => window.removeEventListener("keydown", A, !0);
  }, [s, o, n]);
  const p = _e(async () => {
    if (!(!n || !i || h)) {
      c(!0), d("");
      try {
        await n.download(i.id);
      } catch (A) {
        d(A instanceof Error ? A.message : "下载素材失败");
      } finally {
        c(!1);
      }
    }
  }, [i, h, n]);
  if (!n || !i)
    return null;
  const y = n.items.length > 1, x = ud(n.kind), b = n.kind === "audio" || n.kind === "file", S = Gf(n.context), v = S ? Da(
    S.artifacts,
    n.kind,
    i.url,
    r
  ) : null, M = /* @__PURE__ */ B(
    "aside",
    {
      className: sd(
        "flex min-h-0 min-w-0 flex-col bg-background",
        b ? "relative max-h-[min(80dvh,480px)] w-full max-w-2xl overflow-hidden rounded-lg border shadow-xl" : "absolute inset-0 z-30 md:static md:z-auto md:flex-1 md:border-l"
      ),
      role: b ? "dialog" : void 0,
      "aria-modal": b ? "true" : void 0,
      "aria-label": `${x}预览`,
      children: [
        /* @__PURE__ */ B("header", { className: "flex h-14 shrink-0 items-center gap-3 border-b px-3 md:px-4", children: [
          /* @__PURE__ */ B("div", { className: "flex min-w-0 flex-1 items-center gap-2", children: [
            /* @__PURE__ */ w(ad, { kind: n.kind, className: "size-4 shrink-0" }),
            /* @__PURE__ */ B("span", { className: "shrink-0 text-sm font-semibold text-foreground", children: [
              x,
              y ? ` ${r + 1}/${n.items.length}` : ""
            ] }),
            n.kind === "audio" || n.kind === "file" ? /* @__PURE__ */ w("span", { className: "truncate text-xs text-muted-foreground", children: i.name }) : null
          ] }),
          /* @__PURE__ */ B("div", { className: "flex shrink-0 items-center gap-1", children: [
            v && S && t ? t({
              messageID: S.messageID,
              artifact: v,
              placement: "preview"
            }) : null,
            n.kind === "image" ? /* @__PURE__ */ B(Pn, { children: [
              /* @__PURE__ */ w(
                Nt,
                {
                  label: "缩小",
                  disabled: l <= 0.5,
                  onClick: () => u((A) => bs(A - 0.25)),
                  children: /* @__PURE__ */ w(Ou, {})
                }
              ),
              /* @__PURE__ */ B("span", { className: "hidden w-11 text-center text-xs tabular-nums text-muted-foreground sm:inline", children: [
                Math.round(l * 100),
                "%"
              ] }),
              /* @__PURE__ */ w(
                Nt,
                {
                  label: "放大",
                  disabled: l >= 3,
                  onClick: () => u((A) => bs(A + 0.25)),
                  children: /* @__PURE__ */ w(Su, {})
                }
              ),
              /* @__PURE__ */ w(Nt, { label: "适应窗口", onClick: () => u(1), children: /* @__PURE__ */ w(Pu, {}) })
            ] }) : null,
            /* @__PURE__ */ w(
              Nt,
              {
                label: "下载",
                disabled: h,
                onClick: () => {
                  p();
                },
                children: h ? /* @__PURE__ */ w(Ct, { className: "animate-spin" }) : /* @__PURE__ */ w(_u, {})
              }
            ),
            /* @__PURE__ */ w(Nt, { label: "关闭预览", onClick: s, children: /* @__PURE__ */ w(wo, {}) })
          ] })
        ] }),
        /* @__PURE__ */ w(
          Zf,
          {
            kind: n.kind,
            items: n.items,
            activeIndex: r,
            zoom: l,
            compact: b,
            className: b ? "flex-none" : "flex-1",
            onSelect: a
          }
        ),
        f ? /* @__PURE__ */ w(
          "div",
          {
            role: "alert",
            className: "absolute bottom-4 left-1/2 max-w-[80%] -translate-x-1/2 rounded-md bg-destructive px-3 py-2 text-xs text-white shadow-lg",
            children: f
          }
        ) : null
      ]
    }
  );
  return b ? /* @__PURE__ */ w(
    "div",
    {
      className: "absolute inset-0 z-30 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-[1px]",
      role: "presentation",
      onPointerDown: (A) => {
        A.target === A.currentTarget && s();
      },
      children: M
    }
  ) : M;
}
function Nt({
  label: e,
  children: t,
  disabled: n,
  onClick: r
}) {
  return /* @__PURE__ */ w(yt, { label: e, children: /* @__PURE__ */ w(
    id,
    {
      type: "button",
      size: "icon",
      variant: "ghost",
      className: "size-9",
      "aria-label": e,
      disabled: n,
      onClick: r,
      children: /* @__PURE__ */ w("span", { className: "[&>svg]:size-4", children: t })
    }
  ) });
}
function ad({
  kind: e,
  className: t
}) {
  const n = ld[e];
  return /* @__PURE__ */ w(n, { className: t });
}
const ld = {
  image: Bn,
  video: zn,
  audio: So,
  file: ut
};
function ud(e) {
  return e === "image" ? "图片" : e === "video" ? "视频" : e === "audio" ? "音频" : "文件";
}
function bs(e) {
  return Math.min(3, Math.max(0.5, e));
}
function cd(e) {
  return e instanceof HTMLElement && !!e.closest("button, input, textarea, select, video, audio");
}
const hd = $n.EnergonContentView, fd = $n.normalizeEnergonOutput, Na = ct.cn, Oa = [
  "rich",
  "images",
  "videos",
  "audios",
  "files"
];
function dd({
  output: e,
  excludeOutputs: t = [],
  excludeText: n = "",
  className: r
}) {
  const i = od(), s = Yf(), o = Fa(e, {
    excludedKeys: yd(t),
    excludeText: n
  }), a = new Set(
    t.flatMap(
      (f) => st(f).map((d) => d.id)
    )
  ), l = st(e).filter(
    (f) => f.status === "generating" && !a.has(f.id)
  ), u = st(e).filter(
    (f) => f.status === "ready" && !a.has(f.id)
  ), h = s.render ? (f) => {
    const d = Da(
      u,
      f.kind,
      f.item.url,
      f.index
    );
    return d && s.messageID > 0 ? s.render?.({
      messageID: s.messageID,
      artifact: d,
      placement: "inline"
    }) : null;
  } : void 0, c = i ? (f) => i(
    Qf(
      f,
      s.messageID,
      u
    )
  ) : void 0;
  return o.length === 0 && l.length === 0 ? null : /* @__PURE__ */ B(
    "div",
    {
      className: Na(
        "agent-chat-message-output mt-4 min-w-0 max-w-full",
        r
      ),
      children: [
        l.length > 0 ? /* @__PURE__ */ w(pd, { artifacts: l }) : null,
        o.length > 0 ? /* @__PURE__ */ w(
          hd,
          {
            output: o,
            mediaLayout: "chat",
            onMediaPreview: c,
            renderMediaActions: h
          }
        ) : null
      ]
    }
  );
}
function pd({
  artifacts: e
}) {
  return /* @__PURE__ */ w("div", { className: "agent-chat-media-grid", role: "status", "aria-label": "素材生成中", children: e.map((t) => {
    const n = md(t.kind), r = t.kind === "image" || t.kind === "video";
    return /* @__PURE__ */ B(
      "div",
      {
        className: Na(
          "agent-chat-media-placeholder relative flex overflow-hidden rounded-lg border bg-muted/30",
          r ? "items-center justify-center" : "h-24 items-center px-5"
        ),
        style: r ? { aspectRatio: t.kind === "video" ? "16 / 9" : "4 / 3" } : void 0,
        children: [
          /* @__PURE__ */ w(n, { className: "agent-chat-media-placeholder-icon relative size-7 text-muted-foreground/35" }),
          /* @__PURE__ */ w(Ct, { className: "agent-chat-media-spinner absolute right-3 top-3 z-[2] size-4 text-muted-foreground/55" })
        ]
      },
      t.id
    );
  }) });
}
function md(e) {
  return e === "image" ? Bn : e === "video" ? zn : e === "audio" ? Bu : ut;
}
function gd(e) {
  return La(e).length > 0;
}
function La(e) {
  return Fa(e, {
    excludedKeys: /* @__PURE__ */ new Set(),
    excludeText: ""
  });
}
function Fa(e, t) {
  return Ba(e).map((n) => bd(n, t)).filter((n) => !!n);
}
function Ba(e) {
  const t = fd(e), n = yi(e);
  return Object.keys(n).length > 0 ? [...t, n] : t;
}
function bd(e, t) {
  const n = {};
  for (const r of Oa) {
    if (t.excludedKeys.has(r))
      continue;
    const i = xd(e[r], r, t.excludeText);
    $r(i) && (n[r] = i);
  }
  return Object.keys(n).length === 0 ? null : ($r(e.title) && (n.title = e.title), e.meta && (n.meta = e.meta), n);
}
function yd(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    for (const r of Ba(n))
      for (const i of Oa)
        $r(r[i]) && t.add(i);
  return t;
}
function xd(e, t, n) {
  return t === "rich" || !n || !Array.isArray(e) ? e : e.filter(
    (r) => typeof r != "string" || !n.includes(r)
  );
}
function $r(e) {
  return e == null || e === "" ? !1 : !Array.isArray(e) || e.length > 0;
}
function f_(e) {
  const t = e.activities || [], n = e.document ? Pf(e.document) : e.text;
  return za(n, t).map(
    (r) => r.type === "text" ? { type: "text", text: r.text } : {
      type: "tool-call",
      toolCallId: r.activity.id,
      toolName: r.activity.title,
      args: {},
      argsText: "{}",
      result: r.activity.output,
      isError: r.activity.status === "failed"
    }
  );
}
function za(e, t) {
  const n = xs(e, t);
  if (t.length === 0)
    return n ? [{ type: "text", text: n }] : [];
  const r = [];
  let i = 0;
  for (const s of t) {
    const o = xs(
      s.anchorText,
      t
    ), a = kd(n, o, i);
    ys(r, n.slice(i, a)), r.push({ type: "activity", activity: s }), i = a;
  }
  return ys(r, n.slice(i)), r;
}
function wd(e, t) {
  const n = [];
  let r = !1;
  for (const i of za(e, t)) {
    if (i.type === "text") {
      n.push(i.text);
      continue;
    }
    const s = yi(i.activity.output), o = La(
      Object.keys(s).length > 0 ? s : i.activity.output
    );
    o.length !== 0 && (r = !0, n.push(...o));
  }
  return r ? n : [];
}
function ys(e, t) {
  t && e.push({ type: "text", text: t });
}
function kd(e, t, n) {
  if (!t)
    return n;
  if (e.startsWith(t))
    return Math.max(n, t.length);
  const r = e.indexOf(t, n);
  return r < 0 ? n : r + t.length;
}
function xs(e, t) {
  let n = String(e || "").replace(/\r\n/g, `
`);
  for (const r of _d(t)) {
    const i = Sd(r);
    n = n.replace(
      new RegExp(
        `!\\[[^\\]]*\\]\\(\\s*<?${i}>?(?:\\s+["'][^"']*["'])?\\s*\\)`,
        "g"
      ),
      ""
    ).replace(
      new RegExp(
        `\\[[^\\]]*\\]\\(\\s*<?${i}>?(?:\\s+["'][^"']*["'])?\\s*\\)`,
        "g"
      ),
      ""
    );
  }
  return n.replace(/\n{3,}/g, `

`).trim();
}
function _d(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    for (const r of ["images", "videos", "audios", "files"]) {
      const i = n.output[r];
      for (const s of Array.isArray(i) ? i : [i])
        typeof s == "string" && s.trim() && t.add(s.trim());
    }
  return t;
}
function Sd(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const $a = Me.isPlainRecord;
function It(e) {
  return $a(e) ? { ...e } : {};
}
function d_(e) {
  return $a(e) && Object.keys(e).length > 0;
}
const Cd = Me.isPlainRecord;
function En(...e) {
  for (const t of e) {
    const n = vd(t);
    if (n)
      return n;
  }
  return "";
}
function vd(e) {
  if (typeof e == "string" || typeof e == "number") {
    const t = String(e).trim().match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
    return t && Number(t[1]) > 0 && Number(t[2]) > 0 ? `${t[1]} / ${t[2]}` : "";
  }
  return Array.isArray(e) ? En(...e) : Cd(e) ? En(...Object.values(e)) : "";
}
const In = Me.isPlainRecord, Be = xo.streamValueText, ja = {
  load_skill: "技能加载",
  list_skill_files: "技能目录读取",
  read_skill_file: "技能文件读取",
  read_temp_file: "技能文件读取",
  write_temp_file: "技能文件准备",
  run_skill_script: "技能执行",
  http_request: "技能请求",
  curl_request: "技能请求",
  mcp_call: "技能工具调用"
};
function Ua(e) {
  const t = It(e), n = Be(t.event).toLowerCase();
  if (!Ld(n))
    return;
  const r = In(t.meta) ? t.meta : {}, i = In(r.tool_params) ? r.tool_params : {}, s = Be(r.tool_name), o = Be(r.tool_call_id || s);
  if (!o)
    return;
  const a = Ed(r.tool_kind, s), l = Fd(n, r.tool_status);
  return {
    id: o,
    title: Be(r.tool_title) || Td(a) || s || "工具调用",
    kind: a,
    status: l,
    text: Id(t.text, a, l, s),
    error: Be(t.error),
    progress: Bd(t.progress ?? r.progress ?? r.percent),
    count: zd(r.tool_count),
    aspectRatio: En(Object.values(i)),
    anchorText: Be(t.anchor_text),
    output: t
  };
}
function Ed(e, t) {
  const n = Be(e).toLowerCase();
  if (n)
    return n;
  const r = t.toLowerCase();
  return r.includes("knowledge") ? "knowledge" : Rd(r) ? "skill" : "";
}
function Id(e, t, n, r) {
  const i = Be(e);
  return Ad(i) ? t === "knowledge" ? n === "succeeded" ? Md(r) : "正在读取知识库" : t === "skill" ? Dd(r, n) : i : i;
}
function Ad(e) {
  return e === "内容生成完成" || e === "内容生成中，请稍后";
}
function Td(e) {
  return e === "knowledge" ? "知识库" : e === "skill" ? "技能调用" : "";
}
function Rd(e) {
  return e.startsWith("skill_") || !!ja[e];
}
function Dd(e, t) {
  const n = t === "succeeded" ? "完成" : "中";
  return `${ja[e.toLowerCase()] || "技能调用"}${n}`;
}
function Md(e) {
  switch (e.toLowerCase()) {
    case "open_knowledge_init":
      return "已读取知识库说明";
    case "list_knowledge_files":
    case "list_knowledge_tree":
    case "expand_knowledge_node":
      return "已读取知识库结构";
    case "search_knowledge_files":
    case "search_knowledge_nodes":
    case "find_related_knowledge":
    case "debug_knowledge_retrieval":
      return "已完成知识库搜索";
    case "read_knowledge_file":
    case "open_knowledge_node":
      return "已读取知识库文件";
    default:
      return "已参考知识库";
  }
}
function Pd(e) {
  const t = It(e);
  return Array.isArray(t.activities) ? t.activities.map(Ua).filter((n) => !!n) : [];
}
function Nd(e, t) {
  const n = e ? [...e] : [], r = n.findIndex((i) => i.id === t.id);
  return r < 0 ? [...n, t] : (n[r] = Od(n[r], t), n);
}
function p_(e, t) {
  return t.reduce(Nd, e || []);
}
function Od(e, t) {
  return {
    ...e,
    ...t,
    text: t.text || e.text,
    error: t.error || e.error,
    count: t.count || e.count,
    aspectRatio: t.aspectRatio || e.aspectRatio,
    anchorText: t.anchorText || e.anchorText,
    progress: $d(e.progress, t.progress),
    output: {
      ...e.output,
      ...t.output,
      meta: jd(e.output.meta, t.output.meta)
    }
  };
}
function Ld(e) {
  return ["tool_start", "tool_progress", "tool_result", "tool_error"].includes(
    e
  );
}
function Fd(e, t) {
  const n = Be(t).toLowerCase();
  return e === "tool_error" || n === "failed" ? "failed" : e === "tool_result" || n === "succeeded" ? "succeeded" : "running";
}
function Bd(e) {
  if (e == null || e === "")
    return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.min(100, Math.round(t))) : null;
}
function zd(e) {
  const t = Number(e);
  return !Number.isFinite(t) || t < 1 ? 1 : Math.min(8, Math.floor(t));
}
function $d(e, t) {
  return e == null ? t : t == null ? e : Math.max(e, t);
}
function jd(e, t) {
  return {
    ...In(e) ? e : {},
    ...In(t) ? t : {}
  };
}
const pe = Me.isPlainRecord;
async function m_(e, t) {
  const n = await ki(
    Ln(e, "get", { agent_key: t }),
    "读取智能体输入参数失败"
  );
  return Kd(n.params);
}
async function g_(e, t) {
  const n = await ki(
    Ln(e, "get", { document_id: t }),
    "读取图文内容失败"
  ), r = xi(n);
  if (!r)
    throw new Error("图文内容无效");
  return r;
}
async function Ud(e, t) {
  const n = await At(
    t.create ? e.newSession : e.session,
    {
      session_id: t.sessionID || void 0,
      agent_key: t.agentKey,
      context_key: t.contextKey,
      title: t.title || "新会话",
      limit: t.limit || 10,
      last_message_id: t.lastMessageID || void 0
    }
  );
  return {
    session: Qn(n.session),
    messages: Hd(n.messages)
  };
}
async function Vd(e, t) {
  const n = await At(e.sessions, {
    agent_key: t.agentKey,
    context_key: t.contextKey,
    limit: t.limit || 20,
    last_session_id: t.lastSessionID || void 0,
    status: "active"
  }), i = (Array.isArray(n.sessions) ? n.sessions : []).map(Qn).filter((a) => !!a), s = t.limit || 20, o = n.has_more == null ? i.length >= s : !!n.has_more;
  return { sessions: i, hasMore: o };
}
async function b_(e, t) {
  const n = await At(e.session, {
    session_id: t.sessionID,
    agent_key: t.agentKey,
    context_key: t.contextKey,
    session_only: !0
  });
  return Qn(n.session);
}
async function y_(e, t, n) {
  const r = await At(e.renameSession, {
    session_id: t,
    title: n
  }), i = Qn(r.session);
  if (!i)
    throw new Error("更新会话标题失败");
  return i;
}
async function x_(e, t) {
  await At(e.archiveSession, { session_id: t });
}
async function w_(e, t, n) {
  const r = await At(e, {
    session_id: t.sessionID,
    agent_key: t.agentKey,
    ref_type: n.refType,
    ref_id: n.refId,
    label: n.label
  }), i = q(r.ref_type), s = Number(r.ref_id || 0);
  if (!_i(i) || !s)
    throw new Error("引用内容无效");
  const o = r.text == null ? "" : String(r.text), a = It(r.output), l = wd(
    o,
    Pd(a)
  );
  return {
    refType: i,
    refId: s,
    title: q(r.title) || n.label,
    text: o,
    media: Jd(r.media),
    content: l.length > 0 ? l : void 0
  };
}
async function At(e, t) {
  return ki(Ln(e, "post", t), "会话请求失败");
}
async function ki(e, t) {
  const n = await e;
  if (!pe(n))
    throw new Error(t);
  const r = Number(n.code || 0), i = Number(n.status || 0);
  if (r !== 0 || i === 2)
    throw new Error(q(n.message || n.msg) || t);
  return pe(n.data) ? n.data : {};
}
function Qn(e) {
  if (!pe(e))
    return null;
  const t = Number(e.id || 0);
  return !Number.isFinite(t) || t <= 0 ? null : {
    id: t,
    title: q(e.title) || "新会话",
    titleSource: q(e.title_source),
    running: !!e.running
  };
}
function Hd(e) {
  return (Array.isArray(e) ? e : []).map((n) => {
    if (!pe(n))
      return null;
    const r = q(n.role) === "user" ? "user" : "assistant";
    return {
      id: Number(n.id || 0),
      role: r,
      kind: q(n.kind) || "chat",
      text: q(n.text),
      content: qd(n.content),
      output: It(n.output),
      requestID: q(n.request_id),
      status: Number(n.status || 1),
      createdAt: q(n.created_at),
      document: xi(n.document)
    };
  }).filter((n) => !!n);
}
function qd(e) {
  if (!pe(e) || Number(e.version) !== 1)
    return;
  const n = (Array.isArray(e.parts) ? e.parts : []).map((i) => {
    if (!pe(i))
      return null;
    if (i.type === "text")
      return { type: "text", text: String(i.text || "") };
    const s = Number(i.ref_id || 0), o = q(i.ref_type);
    return i.type !== "reference" || !s || !_i(o) ? null : {
      type: "reference",
      ref_type: o,
      ref_id: s,
      label: q(i.label) || `${o} ${s}`,
      usage: q(i.usage) || void 0
    };
  }).filter((i) => !!i), r = Wd(
    e.interaction_response
  );
  return {
    version: 1,
    parts: n,
    params: pe(e.params) ? e.params : void 0,
    interaction_response: r
  };
}
function Kd(e) {
  return Array.isArray(e) ? e.map((t) => {
    if (!pe(t))
      return null;
    const n = Number(t.id || 0), r = q(t.key), i = q(t.type).toLowerCase();
    if (!n || !r || i === "prompt")
      return null;
    const s = Array.isArray(t.options) ? t.options.map((o) => pe(o) ? {
      id: Number(o.id || 0) || q(o.id),
      name: q(o.name) || void 0,
      value: q(o.value || o.name),
      native_value: q(o.native_value) || void 0,
      sort: Number(o.sort || 0)
    } : null).filter(
      (o) => !!o
    ) : [];
    return {
      id: n,
      power_param_id: Number(t.power_param_id || 0) || void 0,
      name: q(t.name || t.key),
      key: r,
      icon: q(t.icon) || void 0,
      type: i || "input",
      usage: Number(t.usage || 1),
      value_type: q(t.value_type) || "string",
      default_value: q(t.default_value) || void 0,
      required: !!t.required,
      upload_rule_id: Number(t.upload_rule_id || 0) || void 0,
      max_files: Number(t.max_files || 0) || void 0,
      sort: Number(t.sort || 0),
      options: s
    };
  }).filter((t) => !!t) : [];
}
function Wd(e) {
  if (!pe(e))
    return;
  const t = q(e.interaction_id);
  if (t)
    return {
      interaction_id: t,
      data: pe(e.data) ? e.data : {}
    };
}
function Jd(e) {
  return (Array.isArray(e) ? e : []).map((n) => {
    if (!pe(n))
      return null;
    const r = q(n.url);
    if (!r)
      return null;
    const i = q(n.ref_type);
    return {
      refType: _i(i) ? i : void 0,
      refId: cn(n.ref_id) || void 0,
      artifactId: cn(n.artifact_id) || void 0,
      fileId: cn(n.file_id) || void 0,
      seriesId: cn(n.series_id) || void 0,
      kind: Yd(n.kind),
      name: q(n.name) || void 0,
      label: q(n.label || n.name) || "素材",
      url: r
    };
  }).filter((n) => !!n);
}
function Yd(e) {
  const t = q(e).toLowerCase();
  return ["image", "video", "audio"].includes(t) ? t : "file";
}
function _i(e) {
  return ["message", "artifact", "upload_file", "session"].includes(e);
}
function cn(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? Math.floor(t) : 0;
}
function q(e) {
  return e == null ? "" : String(e).trim();
}
function Qd(e) {
  return {
    text: e,
    content: {
      version: 1,
      parts: [{ type: "text", text: e }]
    }
  };
}
function k_(e, t, n) {
  const r = Qd(t);
  return r.content.interaction_response = {
    interaction_id: e,
    data: n
  }, r;
}
async function __(e, t) {
  if (t.scope === "history" && !t.parent) {
    const i = await Vd(e.api, {
      agentKey: e.agentKey,
      contextKey: e.contextKey,
      limit: 20,
      lastSessionID: ks(t.cursor)
    }), s = i.sessions.filter(
      (o) => o.id !== e.sessionID
    );
    return {
      items: ws(
        s.map((o) => ({
          key: `session:${o.id}`,
          refType: "session",
          refId: o.id,
          label: o.title,
          description: "查看此会话的消息和素材",
          selectable: !1,
          hasChildren: !0
        })),
        t.query
      ),
      nextCursor: i.sessions.length > 0 ? String(i.sessions[i.sessions.length - 1]?.id || "") : void 0
    };
  }
  const n = t.scope === "history" ? t.parent?.refId || 0 : e.sessionID;
  if (!n)
    return { items: [] };
  const r = await Ud(e.api, {
    agentKey: e.agentKey,
    contextKey: e.contextKey,
    sessionID: n,
    limit: 20,
    lastMessageID: ks(t.cursor)
  });
  return {
    items: ws(
      Gd([...r.messages].reverse()),
      t.query
    ),
    nextCursor: r.messages.length > 0 ? String(r.messages[0]?.id || "") : void 0
  };
}
function Gd(e) {
  return e.map(
    (t) => ({
      key: `message:${t.id}`,
      refType: "message",
      refId: t.id,
      label: Zd(t),
      description: t.role === "user" ? "用户消息" : "智能体回复",
      messageRole: t.role,
      preview: {
        text: t.text,
        kind: "message"
      },
      materials: Xd(t)
    })
  );
}
function Xd(e) {
  const t = {
    image: 0,
    video: 0,
    audio: 0,
    file: 0
  };
  return st(e.output).filter(
    (n) => n.status === "ready" && !!(n.url || n.previewUrl)
  ).map((n) => {
    t[n.kind] = (t[n.kind] || 0) + 1;
    const r = n.displayNo || t[n.kind] || 1;
    return {
      key: `artifact:${n.id}`,
      refType: "artifact",
      refId: n.id,
      label: `${ep(n.kind)}${r}`,
      preview: {
        text: n.name || n.label,
        kind: n.kind,
        url: n.previewUrl || n.url,
        sourceUrl: n.url
      }
    };
  });
}
function Zd(e) {
  const t = e.text.replace(/\s+/g, " ").trim();
  return t ? Array.from(t).slice(0, 48).join("") : e.role === "user" ? "用户消息" : "生成结果";
}
function ws(e, t) {
  const n = hr(t);
  return n ? e.filter((r) => hr(
    `${r.label} ${r.description || ""}`
  ).includes(n) || (r.materials || []).some(
    (s) => hr(
      `${s.label} ${s.preview?.text || ""} ${s.preview?.kind || ""}`
    ).includes(n)
  )) : e;
}
function hr(e) {
  return e.trim().toLowerCase().replace(/(图|视频|音频|文件)\s+(\d+)/g, "$1$2");
}
function ep(e) {
  return e === "image" ? "图" : e === "video" ? "视频" : e === "audio" ? "音频" : "文件";
}
function ks(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? Math.floor(t) : 0;
}
const yn = Me.isPlainRecord, tp = Me.normalizeRuntimeFrameOutput, np = Me.resolveRuntimeFrameCancelable, Te = xo.streamValueText;
async function S_(e, t) {
  const n = await Ln(e, "get", { request_id: t });
  if (!yn(n))
    throw new Error("读取智能体运行状态失败");
  const r = Number(n.code || 0), i = Number(n.status || 0);
  if (r !== 0 || i === 2)
    throw new Error(
      Te(n.message || n.msg) || "读取智能体运行状态失败"
    );
  const s = yn(n.data) ? n.data : {}, o = yn(s.run) ? s.run : {}, a = It(o.output);
  return {
    requestID: Te(o.request_id) || t,
    status: Te(o.status).toLowerCase(),
    runVersion: Number(o.version || 0),
    text: Te(a.text),
    output: a,
    error: Te(o.error || a.error)
  };
}
function C_(e) {
  const t = tp(e?.output, e), n = It(t), r = Te(n.semantic_event || n.event).toLowerCase(), i = Te(n.text), s = e?.type === "result", o = Number(e?.status || 0) === 2, a = r === "delta" || !r && !!i && !s, l = yn(n.meta) ? n.meta : {};
  return {
    requestID: Te(e?.request_id),
    streamID: Te(e?.stream_id),
    event: r,
    delta: a ? i : "",
    finalText: s ? i : "",
    output: n,
    activity: Ua(n),
    error: Te(n.error || (o ? e?.msg : "")),
    cancelable: np(e),
    runVersion: Number(l.run_version || 0),
    assistantMessageID: Number(l.assistant_message_id || 0),
    finished: s,
    failed: o
  };
}
function v_(e) {
  return ["success", "fail", "canceled"].includes(e);
}
const rp = (e, t) => typeof e == "string" ? e === t : JSON.stringify(e) === JSON.stringify(t), ip = (e, t) => {
  if (!e || !t) return !1;
  const n = (r) => {
    const { position: i, data: s, ...o } = r || {};
    return o;
  };
  return JSON.stringify(n(e.properties)) === JSON.stringify(n(t.properties)) && rp(e.children, t.children);
}, Va = (e, t) => ip(e.node, t.node), Si = Zr(null), sp = () => On(Si) !== null, op = ({ children: e, ...t }) => /* @__PURE__ */ w(Si.Provider, {
  value: t,
  children: e
}), ap = Fn(op, Va), lp = ({ node: e, ...t }) => /* @__PURE__ */ w("pre", { ...t }), up = ({ node: e, ...t }) => /* @__PURE__ */ w("code", { ...t }), Ci = ({ node: e, components: { Pre: t, Code: n }, code: r }) => /* @__PURE__ */ w(t, { children: /* @__PURE__ */ w(n, {
  node: e,
  children: r
}) }), cp = () => null, hp = ({ node: e, components: { Pre: t, Code: n, SyntaxHighlighter: r, CodeHeader: i }, language: s, code: o }) => {
  const a = xt(() => ({
    Pre: t,
    Code: n
  }), [t, n]);
  return /* @__PURE__ */ B(Pn, { children: [/* @__PURE__ */ w(i, {
    node: e,
    language: s,
    code: o
  }), /* @__PURE__ */ w(s ? r : Ci, {
    node: e,
    components: a,
    language: s ?? "unknown",
    code: o
  })] });
};
var fr = { exports: {} };
var _s;
function fp() {
  return _s || (_s = 1, (function(e) {
    (function() {
      var t = {}.hasOwnProperty;
      function n() {
        for (var s = "", o = 0; o < arguments.length; o++) {
          var a = arguments[o];
          a && (s = i(s, r(a)));
        }
        return s;
      }
      function r(s) {
        if (typeof s == "string" || typeof s == "number")
          return s;
        if (typeof s != "object")
          return "";
        if (Array.isArray(s))
          return n.apply(null, s);
        if (s.toString !== Object.prototype.toString && !s.toString.toString().includes("[native code]"))
          return s.toString();
        var o = "";
        for (var a in s)
          t.call(s, a) && s[a] && (o = i(o, a));
        return o;
      }
      function i(s, o) {
        return o ? s ? s + " " + o : s + o : s;
      }
      e.exports ? (n.default = n, e.exports = n) : window.classNames = n;
    })();
  })(fr)), fr.exports;
}
var dp = fp();
const Ha = /* @__PURE__ */ jn(dp), Ss = ({ className: e, ...t }) => ({ className: n, ...r }) => ({
  className: Ha(e, n),
  ...t,
  ...r
}), pp = ({ node: e, components: { Pre: t, Code: n, SyntaxHighlighter: r, CodeHeader: i }, componentsByLanguage: s = {}, children: o, ...a }) => {
  const l = Ss(On(Si)), u = Kt((d) => /* @__PURE__ */ w(t, { ...l(d) })), h = Ss(a), c = Kt((d) => /* @__PURE__ */ w(n, { ...h(d) })), f = /language-(\w+)/.exec(a.className || "")?.[1] ?? "";
  return typeof o != "string" ? /* @__PURE__ */ w(Ci, {
    node: e,
    components: {
      Pre: u,
      Code: c
    },
    code: o
  }) : /* @__PURE__ */ w(hp, {
    node: e,
    components: {
      Pre: u,
      Code: c,
      SyntaxHighlighter: s[f]?.SyntaxHighlighter ?? r,
      CodeHeader: s[f]?.CodeHeader ?? i
    },
    language: f || "unknown",
    code: o
  });
}, mp = ({ node: e, components: t, componentsByLanguage: n, ...r }) => sp() ? /* @__PURE__ */ w(pp, {
  node: e,
  components: t,
  componentsByLanguage: n,
  ...r
}) : /* @__PURE__ */ w(t.Code, { ...r }), gp = Fn(mp, (e, t) => e.components === t.components && e.componentsByLanguage === t.componentsByLanguage && Va(e, t));
function bp(e, t) {
  const n = {};
  return (e[e.length - 1] === "" ? [...e, ""] : e).join(
    (n.padRight ? " " : "") + "," + (n.padLeft === !1 ? "" : " ")
  ).trim();
}
const yp = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, xp = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, wp = {};
function Cs(e, t) {
  return (wp.jsx ? xp : yp).test(e);
}
const kp = /[ \t\n\f\r]/g;
function _p(e) {
  return typeof e == "object" ? e.type === "text" ? vs(e.value) : !1 : vs(e);
}
function vs(e) {
  return e.replace(kp, "") === "";
}
class Zt {
  /**
   * @param {SchemaType['property']} property
   *   Property.
   * @param {SchemaType['normal']} normal
   *   Normal.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Schema.
   */
  constructor(t, n, r) {
    this.normal = n, this.property = t, r && (this.space = r);
  }
}
Zt.prototype.normal = {};
Zt.prototype.property = {};
Zt.prototype.space = void 0;
function qa(e, t) {
  const n = {}, r = {};
  for (const i of e)
    Object.assign(n, i.property), Object.assign(r, i.normal);
  return new Zt(n, r, t);
}
function jr(e) {
  return e.toLowerCase();
}
class oe {
  /**
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @returns
   *   Info.
   */
  constructor(t, n) {
    this.attribute = n, this.property = t;
  }
}
oe.prototype.attribute = "";
oe.prototype.booleanish = !1;
oe.prototype.boolean = !1;
oe.prototype.commaOrSpaceSeparated = !1;
oe.prototype.commaSeparated = !1;
oe.prototype.defined = !1;
oe.prototype.mustUseProperty = !1;
oe.prototype.number = !1;
oe.prototype.overloadedBoolean = !1;
oe.prototype.property = "";
oe.prototype.spaceSeparated = !1;
oe.prototype.space = void 0;
let Sp = 0;
const O = ft(), Q = ft(), Ur = ft(), E = ft(), J = ft(), ot = ft(), le = ft();
function ft() {
  return 2 ** ++Sp;
}
const Vr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  boolean: O,
  booleanish: Q,
  commaOrSpaceSeparated: le,
  commaSeparated: ot,
  number: E,
  overloadedBoolean: Ur,
  spaceSeparated: J
}, Symbol.toStringTag, { value: "Module" })), dr = (
  /** @type {ReadonlyArray<keyof typeof types>} */
  Object.keys(Vr)
);
class vi extends oe {
  /**
   * @constructor
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @param {number | null | undefined} [mask]
   *   Mask.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Info.
   */
  constructor(t, n, r, i) {
    let s = -1;
    if (super(t, n), Es(this, "space", i), typeof r == "number")
      for (; ++s < dr.length; ) {
        const o = dr[s];
        Es(this, dr[s], (r & Vr[o]) === Vr[o]);
      }
  }
}
vi.prototype.defined = !0;
function Es(e, t, n) {
  n && (e[t] = n);
}
function Tt(e) {
  const t = {}, n = {};
  for (const [r, i] of Object.entries(e.properties)) {
    const s = new vi(
      r,
      e.transform(e.attributes || {}, r),
      i,
      e.space
    );
    e.mustUseProperty && e.mustUseProperty.includes(r) && (s.mustUseProperty = !0), t[r] = s, n[jr(r)] = r, n[jr(s.attribute)] = r;
  }
  return new Zt(t, n, e.space);
}
const Ka = Tt({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: Q,
    ariaAutoComplete: null,
    ariaBusy: Q,
    ariaChecked: Q,
    ariaColCount: E,
    ariaColIndex: E,
    ariaColSpan: E,
    ariaControls: J,
    ariaCurrent: null,
    ariaDescribedBy: J,
    ariaDetails: null,
    ariaDisabled: Q,
    ariaDropEffect: J,
    ariaErrorMessage: null,
    ariaExpanded: Q,
    ariaFlowTo: J,
    ariaGrabbed: Q,
    ariaHasPopup: null,
    ariaHidden: Q,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: J,
    ariaLevel: E,
    ariaLive: null,
    ariaModal: Q,
    ariaMultiLine: Q,
    ariaMultiSelectable: Q,
    ariaOrientation: null,
    ariaOwns: J,
    ariaPlaceholder: null,
    ariaPosInSet: E,
    ariaPressed: Q,
    ariaReadOnly: Q,
    ariaRelevant: null,
    ariaRequired: Q,
    ariaRoleDescription: J,
    ariaRowCount: E,
    ariaRowIndex: E,
    ariaRowSpan: E,
    ariaSelected: Q,
    ariaSetSize: E,
    ariaSort: null,
    ariaValueMax: E,
    ariaValueMin: E,
    ariaValueNow: E,
    ariaValueText: null,
    role: null
  },
  transform(e, t) {
    return t === "role" ? t : "aria-" + t.slice(4).toLowerCase();
  }
});
function Wa(e, t) {
  return t in e ? e[t] : t;
}
function Ja(e, t) {
  return Wa(e, t.toLowerCase());
}
const Cp = Tt({
  attributes: {
    acceptcharset: "accept-charset",
    classname: "class",
    htmlfor: "for",
    httpequiv: "http-equiv"
  },
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: ot,
    acceptCharset: J,
    accessKey: J,
    action: null,
    allow: null,
    allowFullScreen: O,
    allowPaymentRequest: O,
    allowUserMedia: O,
    alpha: O,
    alt: null,
    as: null,
    async: O,
    autoCapitalize: null,
    autoComplete: J,
    autoFocus: O,
    autoPlay: O,
    blocking: J,
    capture: null,
    charSet: null,
    checked: O,
    cite: null,
    className: J,
    closedBy: null,
    colorSpace: null,
    cols: E,
    colSpan: E,
    command: null,
    commandFor: null,
    content: null,
    contentEditable: Q,
    controls: O,
    controlsList: J,
    coords: E | ot,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: O,
    defer: O,
    dir: null,
    dirName: null,
    disabled: O,
    download: Ur,
    draggable: Q,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: O,
    formTarget: null,
    headers: J,
    height: E,
    hidden: Ur,
    high: E,
    href: null,
    hrefLang: null,
    htmlFor: J,
    httpEquiv: J,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: O,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: O,
    itemId: null,
    itemProp: J,
    itemRef: J,
    itemScope: O,
    itemType: J,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: O,
    low: E,
    manifest: null,
    max: null,
    maxLength: E,
    media: null,
    method: null,
    min: null,
    minLength: E,
    multiple: O,
    muted: O,
    name: null,
    nonce: null,
    noModule: O,
    noValidate: O,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeToggle: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: O,
    optimum: E,
    pattern: null,
    ping: J,
    placeholder: null,
    playsInline: O,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: O,
    referrerPolicy: null,
    rel: J,
    required: O,
    reversed: O,
    rows: E,
    rowSpan: E,
    sandbox: J,
    scope: null,
    scoped: O,
    seamless: O,
    selected: O,
    shadowRootClonable: O,
    shadowRootCustomElementRegistry: O,
    shadowRootDelegatesFocus: O,
    shadowRootMode: null,
    shadowRootSerializable: O,
    shape: null,
    size: E,
    sizes: null,
    slot: null,
    span: E,
    spellCheck: Q,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: E,
    step: null,
    style: null,
    tabIndex: E,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: O,
    useMap: null,
    value: Q,
    width: E,
    wrap: null,
    writingSuggestions: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: J,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: E,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: E,
    // `<body>`
    cellPadding: null,
    // `<table>`
    cellSpacing: null,
    // `<table>`
    char: null,
    // Several table elements. When `align=char`, sets the character to align on
    charOff: null,
    // Several table elements. When `char`, offsets the alignment
    classId: null,
    // `<object>`
    clear: null,
    // `<br>`. Use CSS `clear` instead
    code: null,
    // `<object>`
    codeBase: null,
    // `<object>`
    codeType: null,
    // `<object>`
    color: null,
    // `<font>` and `<hr>`. Use CSS instead
    compact: O,
    // Lists. Use CSS to reduce space between items instead
    declare: O,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: E,
    // `<img>` and `<object>`
    leftMargin: E,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: E,
    // `<body>`
    marginWidth: E,
    // `<body>`
    noResize: O,
    // `<frame>`
    noHref: O,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: O,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: O,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: E,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: Q,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: E,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: E,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    credentialless: O,
    disablePictureInPicture: O,
    disableRemotePlayback: O,
    exportParts: ot,
    part: J,
    prefix: null,
    property: null,
    results: E,
    security: null,
    unselectable: null
  },
  space: "html",
  transform: Ja
}), vp = Tt({
  attributes: {
    accentHeight: "accent-height",
    alignmentBaseline: "alignment-baseline",
    arabicForm: "arabic-form",
    baselineShift: "baseline-shift",
    capHeight: "cap-height",
    className: "class",
    clipPath: "clip-path",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    crossOrigin: "crossorigin",
    dataType: "datatype",
    dominantBaseline: "dominant-baseline",
    enableBackground: "enable-background",
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    hrefLang: "hreflang",
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    horizOriginY: "horiz-origin-y",
    imageRendering: "image-rendering",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    markerEnd: "marker-end",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    maskType: "mask-type",
    navDown: "nav-down",
    navDownLeft: "nav-down-left",
    navDownRight: "nav-down-right",
    navLeft: "nav-left",
    navNext: "nav-next",
    navPrev: "nav-prev",
    navRight: "nav-right",
    navUp: "nav-up",
    navUpLeft: "nav-up-left",
    navUpRight: "nav-up-right",
    onAbort: "onabort",
    onActivate: "onactivate",
    onAfterPrint: "onafterprint",
    onBeforePrint: "onbeforeprint",
    onBegin: "onbegin",
    onCancel: "oncancel",
    onCanPlay: "oncanplay",
    onCanPlayThrough: "oncanplaythrough",
    onChange: "onchange",
    onClick: "onclick",
    onClose: "onclose",
    onCopy: "oncopy",
    onCueChange: "oncuechange",
    onCut: "oncut",
    onDblClick: "ondblclick",
    onDrag: "ondrag",
    onDragEnd: "ondragend",
    onDragEnter: "ondragenter",
    onDragExit: "ondragexit",
    onDragLeave: "ondragleave",
    onDragOver: "ondragover",
    onDragStart: "ondragstart",
    onDrop: "ondrop",
    onDurationChange: "ondurationchange",
    onEmptied: "onemptied",
    onEnd: "onend",
    onEnded: "onended",
    onError: "onerror",
    onFocus: "onfocus",
    onFocusIn: "onfocusin",
    onFocusOut: "onfocusout",
    onHashChange: "onhashchange",
    onInput: "oninput",
    onInvalid: "oninvalid",
    onKeyDown: "onkeydown",
    onKeyPress: "onkeypress",
    onKeyUp: "onkeyup",
    onLoad: "onload",
    onLoadedData: "onloadeddata",
    onLoadedMetadata: "onloadedmetadata",
    onLoadStart: "onloadstart",
    onMessage: "onmessage",
    onMouseDown: "onmousedown",
    onMouseEnter: "onmouseenter",
    onMouseLeave: "onmouseleave",
    onMouseMove: "onmousemove",
    onMouseOut: "onmouseout",
    onMouseOver: "onmouseover",
    onMouseUp: "onmouseup",
    onMouseWheel: "onmousewheel",
    onOffline: "onoffline",
    onOnline: "ononline",
    onPageHide: "onpagehide",
    onPageShow: "onpageshow",
    onPaste: "onpaste",
    onPause: "onpause",
    onPlay: "onplay",
    onPlaying: "onplaying",
    onPopState: "onpopstate",
    onProgress: "onprogress",
    onRateChange: "onratechange",
    onRepeat: "onrepeat",
    onReset: "onreset",
    onResize: "onresize",
    onScroll: "onscroll",
    onSeeked: "onseeked",
    onSeeking: "onseeking",
    onSelect: "onselect",
    onShow: "onshow",
    onStalled: "onstalled",
    onStorage: "onstorage",
    onSubmit: "onsubmit",
    onSuspend: "onsuspend",
    onTimeUpdate: "ontimeupdate",
    onToggle: "ontoggle",
    onUnload: "onunload",
    onVolumeChange: "onvolumechange",
    onWaiting: "onwaiting",
    onZoom: "onzoom",
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pointerEvents: "pointer-events",
    referrerPolicy: "referrerpolicy",
    renderingIntent: "rendering-intent",
    shapeRendering: "shape-rendering",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    strokeDashArray: "stroke-dasharray",
    strokeDashOffset: "stroke-dashoffset",
    strokeLineCap: "stroke-linecap",
    strokeLineJoin: "stroke-linejoin",
    strokeMiterLimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    tabIndex: "tabindex",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textRendering: "text-rendering",
    transformOrigin: "transform-origin",
    typeOf: "typeof",
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    vectorEffect: "vector-effect",
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    xHeight: "x-height",
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: "playbackorder",
    timelineBegin: "timelinebegin"
  },
  properties: {
    about: le,
    accentHeight: E,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: E,
    amplitude: E,
    arabicForm: null,
    ascent: E,
    attributeName: null,
    attributeType: null,
    azimuth: E,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: E,
    by: null,
    calcMode: null,
    capHeight: E,
    className: J,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: E,
    diffuseConstant: E,
    direction: null,
    display: null,
    dur: null,
    divisor: E,
    dominantBaseline: null,
    download: O,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: E,
    enableBackground: null,
    end: null,
    event: null,
    exponent: E,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: E,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: ot,
    g2: ot,
    glyphName: ot,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: E,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: E,
    horizOriginX: E,
    horizOriginY: E,
    id: null,
    ideographic: E,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: E,
    k: E,
    k1: E,
    k2: E,
    k3: E,
    k4: E,
    kernelMatrix: le,
    kernelUnitLength: null,
    keyPoints: null,
    // SEMI_COLON_SEPARATED
    keySplines: null,
    // SEMI_COLON_SEPARATED
    keyTimes: null,
    // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: E,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskType: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: E,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: E,
    overlineThickness: E,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: E,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: J,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: E,
    pointsAtY: E,
    pointsAtZ: E,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: le,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: le,
    rev: le,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: le,
    requiredFeatures: le,
    requiredFonts: le,
    requiredFormats: le,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: E,
    specularExponent: E,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: E,
    strikethroughThickness: E,
    string: null,
    stroke: null,
    strokeDashArray: le,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: E,
    strokeOpacity: E,
    strokeWidth: null,
    style: null,
    surfaceScale: E,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: le,
    tabIndex: E,
    tableValues: null,
    target: null,
    targetX: E,
    targetY: E,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: le,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: E,
    underlineThickness: E,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: E,
    values: null,
    vAlphabetic: E,
    vMathematical: E,
    vectorEffect: null,
    vHanging: E,
    vIdeographic: E,
    version: null,
    vertAdvY: E,
    vertOriginX: E,
    vertOriginY: E,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: E,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  },
  space: "svg",
  transform: Wa
}), Ya = Tt({
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  },
  space: "xlink",
  transform(e, t) {
    return "xlink:" + t.slice(5).toLowerCase();
  }
}), Qa = Tt({
  attributes: { xmlnsxlink: "xmlns:xlink" },
  properties: { xmlnsXLink: null, xmlns: null },
  space: "xmlns",
  transform: Ja
}), Ga = Tt({
  properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
  space: "xml",
  transform(e, t) {
    return "xml:" + t.slice(3).toLowerCase();
  }
}), Ep = {
  classId: "classID",
  dataType: "datatype",
  itemId: "itemID",
  strokeDashArray: "strokeDasharray",
  strokeDashOffset: "strokeDashoffset",
  strokeLineCap: "strokeLinecap",
  strokeLineJoin: "strokeLinejoin",
  strokeMiterLimit: "strokeMiterlimit",
  typeOf: "typeof",
  xLinkActuate: "xlinkActuate",
  xLinkArcRole: "xlinkArcrole",
  xLinkHref: "xlinkHref",
  xLinkRole: "xlinkRole",
  xLinkShow: "xlinkShow",
  xLinkTitle: "xlinkTitle",
  xLinkType: "xlinkType",
  xmlnsXLink: "xmlnsXlink"
}, Ip = /[A-Z]/g, Is = /-[a-z]/g, Ap = /^data[-\w.:]+$/i;
function Tp(e, t) {
  const n = jr(t);
  let r = t, i = oe;
  if (n in e.normal)
    return e.property[e.normal[n]];
  if (n.length > 4 && n.slice(0, 4) === "data" && Ap.test(t)) {
    if (t.charAt(4) === "-") {
      const s = t.slice(5).replace(Is, Dp);
      r = "data" + s.charAt(0).toUpperCase() + s.slice(1);
    } else {
      const s = t.slice(4);
      if (!Is.test(s)) {
        let o = s.replace(Ip, Rp);
        o.charAt(0) !== "-" && (o = "-" + o), t = "data" + o;
      }
    }
    i = vi;
  }
  return new i(r, t);
}
function Rp(e) {
  return "-" + e.toLowerCase();
}
function Dp(e) {
  return e.charAt(1).toUpperCase();
}
const Mp = qa([Ka, Cp, Ya, Qa, Ga], "html"), Ei = qa([Ka, vp, Ya, Qa, Ga], "svg");
function Pp(e) {
  return e.join(" ").trim();
}
var gt = {}, pr, As;
function Np() {
  if (As) return pr;
  As = 1;
  var e = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, t = /\n/g, n = /^\s*/, r = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, i = /^:\s*/, s = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, o = /^[;\s]*/, a = /^\s+|\s+$/g, l = `
`, u = "/", h = "*", c = "", f = "comment", d = "declaration";
  function p(x, b) {
    if (typeof x != "string")
      throw new TypeError("First argument must be a string");
    if (!x) return [];
    b = b || {};
    var S = 1, v = 1;
    function M(N) {
      var T = N.match(t);
      T && (S += T.length);
      var K = N.lastIndexOf(l);
      v = ~K ? N.length - K : v + N.length;
    }
    function A() {
      var N = { line: S, column: v };
      return function(T) {
        return T.position = new _(N), V(), T;
      };
    }
    function _(N) {
      this.start = N, this.end = { line: S, column: v }, this.source = b.source;
    }
    _.prototype.content = x;
    function F(N) {
      var T = new Error(
        b.source + ":" + S + ":" + v + ": " + N
      );
      if (T.reason = N, T.filename = b.source, T.line = S, T.column = v, T.source = x, !b.silent) throw T;
    }
    function $(N) {
      var T = N.exec(x);
      if (T) {
        var K = T[0];
        return M(K), x = x.slice(K.length), T;
      }
    }
    function V() {
      $(n);
    }
    function k(N) {
      var T;
      for (N = N || []; T = R(); )
        T !== !1 && N.push(T);
      return N;
    }
    function R() {
      var N = A();
      if (!(u != x.charAt(0) || h != x.charAt(1))) {
        for (var T = 2; c != x.charAt(T) && (h != x.charAt(T) || u != x.charAt(T + 1)); )
          ++T;
        if (T += 2, c === x.charAt(T - 1))
          return F("End of comment missing");
        var K = x.slice(2, T - 2);
        return v += 2, M(K), x = x.slice(T), v += 2, N({
          type: f,
          comment: K
        });
      }
    }
    function D() {
      var N = A(), T = $(r);
      if (T) {
        if (R(), !$(i)) return F("property missing ':'");
        var K = $(s), G = N({
          type: d,
          property: y(T[0].replace(e, c)),
          value: K ? y(K[0].replace(e, c)) : c
        });
        return $(o), G;
      }
    }
    function H() {
      var N = [];
      k(N);
      for (var T; T = D(); )
        T !== !1 && (N.push(T), k(N));
      return N;
    }
    return V(), H();
  }
  function y(x) {
    return x ? x.replace(a, c) : c;
  }
  return pr = p, pr;
}
var Ts;
function Op() {
  if (Ts) return gt;
  Ts = 1;
  var e = gt && gt.__importDefault || function(r) {
    return r && r.__esModule ? r : { default: r };
  };
  Object.defineProperty(gt, "__esModule", { value: !0 }), gt.default = n;
  const t = e(Np());
  function n(r, i) {
    let s = null;
    if (!r || typeof r != "string")
      return s;
    const o = (0, t.default)(r), a = typeof i == "function";
    return o.forEach((l) => {
      if (l.type !== "declaration")
        return;
      const { property: u, value: h } = l;
      a ? i(u, h, l) : h && (s = s || {}, s[u] = h);
    }), s;
  }
  return gt;
}
var Ot = {}, Rs;
function Lp() {
  if (Rs) return Ot;
  Rs = 1, Object.defineProperty(Ot, "__esModule", { value: !0 }), Ot.camelCase = void 0;
  var e = /^--[a-zA-Z0-9_-]+$/, t = /-([a-z])/g, n = /^[^-]+$/, r = /^-(webkit|moz|ms|o|khtml)-/, i = /^-(ms)-/, s = function(u) {
    return !u || n.test(u) || e.test(u);
  }, o = function(u, h) {
    return h.toUpperCase();
  }, a = function(u, h) {
    return "".concat(h, "-");
  }, l = function(u, h) {
    return h === void 0 && (h = {}), s(u) ? u : (u = u.toLowerCase(), h.reactCompat ? u = u.replace(i, a) : u = u.replace(r, a), u.replace(t, o));
  };
  return Ot.camelCase = l, Ot;
}
var Lt, Ds;
function Fp() {
  if (Ds) return Lt;
  Ds = 1;
  var e = Lt && Lt.__importDefault || function(i) {
    return i && i.__esModule ? i : { default: i };
  }, t = e(Op()), n = Lp();
  function r(i, s) {
    var o = {};
    return !i || typeof i != "string" || (0, t.default)(i, function(a, l) {
      a && l && (o[(0, n.camelCase)(a, s)] = l);
    }), o;
  }
  return r.default = r, Lt = r, Lt;
}
var Bp = Fp();
const zp = /* @__PURE__ */ jn(Bp), Xa = Za("end"), Ii = Za("start");
function Za(e) {
  return t;
  function t(n) {
    const r = n && n.position && n.position[e] || {};
    if (typeof r.line == "number" && r.line > 0 && typeof r.column == "number" && r.column > 0)
      return {
        line: r.line,
        column: r.column,
        offset: typeof r.offset == "number" && r.offset > -1 ? r.offset : void 0
      };
  }
}
function $p(e) {
  const t = Ii(e), n = Xa(e);
  if (t && n)
    return { start: t, end: n };
}
function jt(e) {
  return !e || typeof e != "object" ? "" : "position" in e || "type" in e ? Ms(e.position) : "start" in e || "end" in e ? Ms(e) : "line" in e || "column" in e ? Hr(e) : "";
}
function Hr(e) {
  return Ps(e && e.line) + ":" + Ps(e && e.column);
}
function Ms(e) {
  return Hr(e && e.start) + "-" + Hr(e && e.end);
}
function Ps(e) {
  return e && typeof e == "number" ? e : 1;
}
class ne extends Error {
  /**
   * Create a message for `reason`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {Options | null | undefined} [options]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns
   *   Instance of `VFileMessage`.
   */
  // eslint-disable-next-line complexity
  constructor(t, n, r) {
    super(), typeof n == "string" && (r = n, n = void 0);
    let i = "", s = {}, o = !1;
    if (n && ("line" in n && "column" in n ? s = { place: n } : "start" in n && "end" in n ? s = { place: n } : "type" in n ? s = {
      ancestors: [n],
      place: n.position
    } : s = { ...n }), typeof t == "string" ? i = t : !s.cause && t && (o = !0, i = t.message, s.cause = t), !s.ruleId && !s.source && typeof r == "string") {
      const l = r.indexOf(":");
      l === -1 ? s.ruleId = r : (s.source = r.slice(0, l), s.ruleId = r.slice(l + 1));
    }
    if (!s.place && s.ancestors && s.ancestors) {
      const l = s.ancestors[s.ancestors.length - 1];
      l && (s.place = l.position);
    }
    const a = s.place && "start" in s.place ? s.place.start : s.place;
    this.ancestors = s.ancestors || void 0, this.cause = s.cause || void 0, this.column = a ? a.column : void 0, this.fatal = void 0, this.file = "", this.message = i, this.line = a ? a.line : void 0, this.name = jt(s.place) || "1:1", this.place = s.place || void 0, this.reason = this.message, this.ruleId = s.ruleId || void 0, this.source = s.source || void 0, this.stack = o && s.cause && typeof s.cause.stack == "string" ? s.cause.stack : "", this.actual = void 0, this.expected = void 0, this.note = void 0, this.url = void 0;
  }
}
ne.prototype.file = "";
ne.prototype.name = "";
ne.prototype.reason = "";
ne.prototype.message = "";
ne.prototype.stack = "";
ne.prototype.column = void 0;
ne.prototype.line = void 0;
ne.prototype.ancestors = void 0;
ne.prototype.cause = void 0;
ne.prototype.fatal = void 0;
ne.prototype.place = void 0;
ne.prototype.ruleId = void 0;
ne.prototype.source = void 0;
const Ai = {}.hasOwnProperty, jp = /* @__PURE__ */ new Map(), Up = /[A-Z]/g, Vp = /* @__PURE__ */ new Set(["table", "tbody", "thead", "tfoot", "tr"]), Hp = /* @__PURE__ */ new Set(["td", "th"]), el = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";
function qp(e, t) {
  if (!t || t.Fragment === void 0)
    throw new TypeError("Expected `Fragment` in options");
  const n = t.filePath || void 0;
  let r;
  if (t.development) {
    if (typeof t.jsxDEV != "function")
      throw new TypeError(
        "Expected `jsxDEV` in options when `development: true`"
      );
    r = Zp(n, t.jsxDEV);
  } else {
    if (typeof t.jsx != "function")
      throw new TypeError("Expected `jsx` in production options");
    if (typeof t.jsxs != "function")
      throw new TypeError("Expected `jsxs` in production options");
    r = Xp(n, t.jsx, t.jsxs);
  }
  const i = {
    Fragment: t.Fragment,
    ancestors: [],
    components: t.components || {},
    create: r,
    elementAttributeNameCase: t.elementAttributeNameCase || "react",
    evaluater: t.createEvaluater ? t.createEvaluater() : void 0,
    filePath: n,
    ignoreInvalidStyle: t.ignoreInvalidStyle || !1,
    passKeys: t.passKeys !== !1,
    passNode: t.passNode || !1,
    schema: t.space === "svg" ? Ei : Mp,
    stylePropertyNameCase: t.stylePropertyNameCase || "dom",
    tableCellAlignToStyle: t.tableCellAlignToStyle !== !1
  }, s = tl(i, e, void 0);
  return s && typeof s != "string" ? s : i.create(
    e,
    i.Fragment,
    { children: s || void 0 },
    void 0
  );
}
function tl(e, t, n) {
  if (t.type === "element")
    return Kp(e, t, n);
  if (t.type === "mdxFlowExpression" || t.type === "mdxTextExpression")
    return Wp(e, t);
  if (t.type === "mdxJsxFlowElement" || t.type === "mdxJsxTextElement")
    return Yp(e, t, n);
  if (t.type === "mdxjsEsm")
    return Jp(e, t);
  if (t.type === "root")
    return Qp(e, t, n);
  if (t.type === "text")
    return Gp(e, t);
}
function Kp(e, t, n) {
  const r = e.schema;
  let i = r;
  t.tagName.toLowerCase() === "svg" && r.space === "html" && (i = Ei, e.schema = i), e.ancestors.push(t);
  const s = rl(e, t.tagName, !1), o = em(e, t);
  let a = Ri(e, t);
  return Vp.has(t.tagName) && (a = a.filter(function(l) {
    return typeof l == "string" ? !_p(l) : !0;
  })), nl(e, o, s, t), Ti(o, a), e.ancestors.pop(), e.schema = r, e.create(t, s, o, n);
}
function Wp(e, t) {
  if (t.data && t.data.estree && e.evaluater) {
    const r = t.data.estree.body[0];
    return r.type, /** @type {Child | undefined} */
    e.evaluater.evaluateExpression(r.expression);
  }
  Jt(e, t.position);
}
function Jp(e, t) {
  if (t.data && t.data.estree && e.evaluater)
    return (
      /** @type {Child | undefined} */
      e.evaluater.evaluateProgram(t.data.estree)
    );
  Jt(e, t.position);
}
function Yp(e, t, n) {
  const r = e.schema;
  let i = r;
  t.name === "svg" && r.space === "html" && (i = Ei, e.schema = i), e.ancestors.push(t);
  const s = t.name === null ? e.Fragment : rl(e, t.name, !0), o = tm(e, t), a = Ri(e, t);
  return nl(e, o, s, t), Ti(o, a), e.ancestors.pop(), e.schema = r, e.create(t, s, o, n);
}
function Qp(e, t, n) {
  const r = {};
  return Ti(r, Ri(e, t)), e.create(t, e.Fragment, r, n);
}
function Gp(e, t) {
  return t.value;
}
function nl(e, t, n, r) {
  typeof n != "string" && n !== e.Fragment && e.passNode && (t.node = r);
}
function Ti(e, t) {
  if (t.length > 0) {
    const n = t.length > 1 ? t : t[0];
    n && (e.children = n);
  }
}
function Xp(e, t, n) {
  return r;
  function r(i, s, o, a) {
    const u = Array.isArray(o.children) ? n : t;
    return a ? u(s, o, a) : u(s, o);
  }
}
function Zp(e, t) {
  return n;
  function n(r, i, s, o) {
    const a = Array.isArray(s.children), l = Ii(r);
    return t(
      i,
      s,
      o,
      a,
      {
        columnNumber: l ? l.column - 1 : void 0,
        fileName: e,
        lineNumber: l ? l.line : void 0
      },
      void 0
    );
  }
}
function em(e, t) {
  const n = {};
  let r, i;
  for (i in t.properties)
    if (i !== "children" && Ai.call(t.properties, i)) {
      const s = nm(e, i, t.properties[i]);
      if (s) {
        const [o, a] = s;
        e.tableCellAlignToStyle && o === "align" && typeof a == "string" && Hp.has(t.tagName) ? r = a : n[o] = a;
      }
    }
  if (r) {
    const s = (
      /** @type {Style} */
      n.style || (n.style = {})
    );
    s[e.stylePropertyNameCase === "css" ? "text-align" : "textAlign"] = r;
  }
  return n;
}
function tm(e, t) {
  const n = {};
  for (const r of t.attributes)
    if (r.type === "mdxJsxExpressionAttribute")
      if (r.data && r.data.estree && e.evaluater) {
        const s = r.data.estree.body[0];
        s.type;
        const o = s.expression;
        o.type;
        const a = o.properties[0];
        a.type, Object.assign(
          n,
          e.evaluater.evaluateExpression(a.argument)
        );
      } else
        Jt(e, t.position);
    else {
      const i = r.name;
      let s;
      if (r.value && typeof r.value == "object")
        if (r.value.data && r.value.data.estree && e.evaluater) {
          const a = r.value.data.estree.body[0];
          a.type, s = e.evaluater.evaluateExpression(a.expression);
        } else
          Jt(e, t.position);
      else
        s = r.value === null ? !0 : r.value;
      n[i] = /** @type {Props[keyof Props]} */
      s;
    }
  return n;
}
function Ri(e, t) {
  const n = [];
  let r = -1;
  const i = e.passKeys ? /* @__PURE__ */ new Map() : jp;
  for (; ++r < t.children.length; ) {
    const s = t.children[r];
    let o;
    if (e.passKeys) {
      const l = s.type === "element" ? s.tagName : s.type === "mdxJsxFlowElement" || s.type === "mdxJsxTextElement" ? s.name : void 0;
      if (l) {
        const u = i.get(l) || 0;
        o = l + "-" + u, i.set(l, u + 1);
      }
    }
    const a = tl(e, s, o);
    a !== void 0 && n.push(a);
  }
  return n;
}
function nm(e, t, n) {
  const r = Tp(e.schema, t);
  if (!(n == null || typeof n == "number" && Number.isNaN(n))) {
    if (Array.isArray(n) && (n = r.commaSeparated ? bp(n) : Pp(n)), r.property === "style") {
      let i = typeof n == "object" ? n : rm(e, String(n));
      return e.stylePropertyNameCase === "css" && (i = im(i)), ["style", i];
    }
    return [
      e.elementAttributeNameCase === "react" && r.space ? Ep[r.property] || r.property : r.attribute,
      n
    ];
  }
}
function rm(e, t) {
  try {
    return zp(t, { reactCompat: !0 });
  } catch (n) {
    if (e.ignoreInvalidStyle)
      return {};
    const r = (
      /** @type {Error} */
      n
    ), i = new ne("Cannot parse `style` attribute", {
      ancestors: e.ancestors,
      cause: r,
      ruleId: "style",
      source: "hast-util-to-jsx-runtime"
    });
    throw i.file = e.filePath || void 0, i.url = el + "#cannot-parse-style-attribute", i;
  }
}
function rl(e, t, n) {
  let r;
  if (!n)
    r = { type: "Literal", value: t };
  else if (t.includes(".")) {
    const i = t.split(".");
    let s = -1, o;
    for (; ++s < i.length; ) {
      const a = Cs(i[s]) ? { type: "Identifier", name: i[s] } : { type: "Literal", value: i[s] };
      o = o ? {
        type: "MemberExpression",
        object: o,
        property: a,
        computed: !!(s && a.type === "Literal"),
        optional: !1
      } : a;
    }
    r = o;
  } else
    r = Cs(t) && !/^[a-z]/.test(t) ? { type: "Identifier", name: t } : { type: "Literal", value: t };
  if (r.type === "Literal") {
    const i = (
      /** @type {string | number} */
      r.value
    );
    return Ai.call(e.components, i) ? e.components[i] : i;
  }
  if (e.evaluater)
    return e.evaluater.evaluateExpression(r);
  Jt(e);
}
function Jt(e, t) {
  const n = new ne(
    "Cannot handle MDX estrees without `createEvaluater`",
    {
      ancestors: e.ancestors,
      place: t,
      ruleId: "mdx-estree",
      source: "hast-util-to-jsx-runtime"
    }
  );
  throw n.file = e.filePath || void 0, n.url = el + "#cannot-handle-mdx-estrees-without-createevaluater", n;
}
function im(e) {
  const t = {};
  let n;
  for (n in e)
    Ai.call(e, n) && (t[sm(n)] = e[n]);
  return t;
}
function sm(e) {
  let t = e.replace(Up, om);
  return t.slice(0, 3) === "ms-" && (t = "-" + t), t;
}
function om(e) {
  return "-" + e.toLowerCase();
}
const mr = {
  action: ["form"],
  cite: ["blockquote", "del", "ins", "q"],
  data: ["object"],
  formAction: ["button", "input"],
  href: ["a", "area", "base", "link"],
  icon: ["menuitem"],
  itemId: null,
  manifest: ["html"],
  ping: ["a", "area"],
  poster: ["video"],
  src: [
    "audio",
    "embed",
    "iframe",
    "img",
    "input",
    "script",
    "source",
    "track",
    "video"
  ]
}, am = {};
function Di(e, t) {
  const n = am, r = typeof n.includeImageAlt == "boolean" ? n.includeImageAlt : !0, i = typeof n.includeHtml == "boolean" ? n.includeHtml : !0;
  return il(e, r, i);
}
function il(e, t, n) {
  if (lm(e)) {
    if ("value" in e)
      return e.type === "html" && !n ? "" : e.value;
    if (t && "alt" in e && e.alt)
      return e.alt;
    if ("children" in e)
      return Ns(e.children, t, n);
  }
  return Array.isArray(e) ? Ns(e, t, n) : "";
}
function Ns(e, t, n) {
  const r = [];
  let i = -1;
  for (; ++i < e.length; )
    r[i] = il(e[i], t, n);
  return r.join("");
}
function lm(e) {
  return !!(e && typeof e == "object");
}
const Os = document.createElement("i");
function Mi(e) {
  const t = "&" + e + ";";
  Os.innerHTML = t;
  const n = Os.textContent;
  return n.charCodeAt(n.length - 1) === 59 && e !== "semi" || n === t ? !1 : n;
}
function ce(e, t, n, r) {
  const i = e.length;
  let s = 0, o;
  if (t < 0 ? t = -t > i ? 0 : i + t : t = t > i ? i : t, n = n > 0 ? n : 0, r.length < 1e4)
    o = Array.from(r), o.unshift(t, n), e.splice(...o);
  else
    for (n && e.splice(t, n); s < r.length; )
      o = r.slice(s, s + 1e4), o.unshift(t, 0), e.splice(...o), s += 1e4, t += 1e4;
}
function fe(e, t) {
  return e.length > 0 ? (ce(e, e.length, 0, t), e) : t;
}
const Ls = {}.hasOwnProperty;
function sl(e) {
  const t = {};
  let n = -1;
  for (; ++n < e.length; )
    um(t, e[n]);
  return t;
}
function um(e, t) {
  let n;
  for (n in t) {
    const i = (Ls.call(e, n) ? e[n] : void 0) || (e[n] = {}), s = t[n];
    let o;
    if (s)
      for (o in s) {
        Ls.call(i, o) || (i[o] = []);
        const a = s[o];
        cm(
          // @ts-expect-error Looks like a list.
          i[o],
          Array.isArray(a) ? a : a ? [a] : []
        );
      }
  }
}
function cm(e, t) {
  let n = -1;
  const r = [];
  for (; ++n < t.length; )
    (t[n].add === "after" ? e : r).push(t[n]);
  ce(e, 0, 0, r);
}
function ol(e, t) {
  const n = Number.parseInt(e, t);
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
function ve(e) {
  return e.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}
const ie = Je(/[A-Za-z]/), te = Je(/[\dA-Za-z]/), hm = Je(/[#-'*+\--9=?A-Z^-~]/);
function An(e) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    e !== null && (e < 32 || e === 127)
  );
}
const qr = Je(/\d/), fm = Je(/[\dA-Fa-f]/), dm = Je(/[!-/:-@[-`{-~]/);
function P(e) {
  return e !== null && e < -2;
}
function Y(e) {
  return e !== null && (e < 0 || e === 32);
}
function z(e) {
  return e === -2 || e === -1 || e === 32;
}
const Gn = Je(new RegExp("\\p{P}|\\p{S}", "u")), lt = Je(/\s/);
function Je(e) {
  return t;
  function t(n) {
    return n !== null && n > -1 && e.test(String.fromCharCode(n));
  }
}
function Rt(e) {
  const t = [];
  let n = -1, r = 0, i = 0;
  for (; ++n < e.length; ) {
    const s = e.charCodeAt(n);
    let o = "";
    if (s === 37 && te(e.charCodeAt(n + 1)) && te(e.charCodeAt(n + 2)))
      i = 2;
    else if (s < 128)
      /[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(s)) || (o = String.fromCharCode(s));
    else if (s > 55295 && s < 57344) {
      const a = e.charCodeAt(n + 1);
      s < 56320 && a > 56319 && a < 57344 ? (o = String.fromCharCode(s, a), i = 1) : o = "�";
    } else
      o = String.fromCharCode(s);
    o && (t.push(e.slice(r, n), encodeURIComponent(o)), r = n + i + 1, o = ""), i && (n += i, i = 0);
  }
  return t.join("") + e.slice(r);
}
function U(e, t, n, r) {
  const i = r ? r - 1 : Number.POSITIVE_INFINITY;
  let s = 0;
  return o;
  function o(l) {
    return z(l) ? (e.enter(n), a(l)) : t(l);
  }
  function a(l) {
    return z(l) && s++ < i ? (e.consume(l), a) : (e.exit(n), t(l));
  }
}
const pm = {
  tokenize: mm
};
function mm(e) {
  const t = e.attempt(this.parser.constructs.contentInitial, r, i);
  let n;
  return t;
  function r(a) {
    if (a === null) {
      e.consume(a);
      return;
    }
    return e.enter("lineEnding"), e.consume(a), e.exit("lineEnding"), U(e, t, "linePrefix");
  }
  function i(a) {
    return e.enter("paragraph"), s(a);
  }
  function s(a) {
    const l = e.enter("chunkText", {
      contentType: "text",
      previous: n
    });
    return n && (n.next = l), n = l, o(a);
  }
  function o(a) {
    if (a === null) {
      e.exit("chunkText"), e.exit("paragraph"), e.consume(a);
      return;
    }
    return P(a) ? (e.consume(a), e.exit("chunkText"), s) : (e.consume(a), o);
  }
}
const gm = {
  tokenize: bm
}, Fs = {
  tokenize: ym
};
function bm(e) {
  const t = this, n = [];
  let r = 0, i, s, o;
  return a;
  function a(v) {
    if (r < n.length) {
      const M = n[r];
      return t.containerState = M[1], e.attempt(M[0].continuation, l, u)(v);
    }
    return u(v);
  }
  function l(v) {
    if (r++, t.containerState._closeFlow) {
      t.containerState._closeFlow = void 0, i && S();
      const M = t.events.length;
      let A = M, _;
      for (; A--; )
        if (t.events[A][0] === "exit" && t.events[A][1].type === "chunkFlow") {
          _ = t.events[A][1].end;
          break;
        }
      b(r);
      let F = M;
      for (; F < t.events.length; )
        t.events[F][1].end = {
          ..._
        }, F++;
      return ce(t.events, A + 1, 0, t.events.slice(M)), t.events.length = F, u(v);
    }
    return a(v);
  }
  function u(v) {
    if (r === n.length) {
      if (!i)
        return f(v);
      if (i.currentConstruct && i.currentConstruct.concrete)
        return p(v);
      t.interrupt = !!(i.currentConstruct && !i._gfmTableDynamicInterruptHack);
    }
    return t.containerState = {}, e.check(Fs, h, c)(v);
  }
  function h(v) {
    return i && S(), b(r), f(v);
  }
  function c(v) {
    return t.parser.lazy[t.now().line] = r !== n.length, o = t.now().offset, p(v);
  }
  function f(v) {
    return t.containerState = {}, e.attempt(Fs, d, p)(v);
  }
  function d(v) {
    return r++, n.push([t.currentConstruct, t.containerState]), f(v);
  }
  function p(v) {
    if (v === null) {
      i && S(), b(0), e.consume(v);
      return;
    }
    return i = i || t.parser.flow(t.now()), e.enter("chunkFlow", {
      _tokenizer: i,
      contentType: "flow",
      previous: s
    }), y(v);
  }
  function y(v) {
    if (v === null) {
      x(e.exit("chunkFlow"), !0), b(0), e.consume(v);
      return;
    }
    return P(v) ? (e.consume(v), x(e.exit("chunkFlow")), r = 0, t.interrupt = void 0, a) : (e.consume(v), y);
  }
  function x(v, M) {
    const A = t.sliceStream(v);
    if (M && A.push(null), v.previous = s, s && (s.next = v), s = v, i.defineSkip(v.start), i.write(A), t.parser.lazy[v.start.line]) {
      let _ = i.events.length;
      for (; _--; )
        if (
          // The token starts before the line ending…
          i.events[_][1].start.offset < o && // …and either is not ended yet…
          (!i.events[_][1].end || // …or ends after it.
          i.events[_][1].end.offset > o)
        )
          return;
      const F = t.events.length;
      let $ = F, V, k;
      for (; $--; )
        if (t.events[$][0] === "exit" && t.events[$][1].type === "chunkFlow") {
          if (V) {
            k = t.events[$][1].end;
            break;
          }
          V = !0;
        }
      for (b(r), _ = F; _ < t.events.length; )
        t.events[_][1].end = {
          ...k
        }, _++;
      ce(t.events, $ + 1, 0, t.events.slice(F)), t.events.length = _;
    }
  }
  function b(v) {
    let M = n.length;
    for (; M-- > v; ) {
      const A = n[M];
      t.containerState = A[1], A[0].exit.call(t, e);
    }
    n.length = v;
  }
  function S() {
    i.write([null]), s = void 0, i = void 0, t.containerState._closeFlow = void 0;
  }
}
function ym(e, t, n) {
  return U(e, e.attempt(this.parser.constructs.document, t, n), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}
function St(e) {
  if (e === null || Y(e) || lt(e))
    return 1;
  if (Gn(e))
    return 2;
}
function Xn(e, t, n) {
  const r = [];
  let i = -1;
  for (; ++i < e.length; ) {
    const s = e[i].resolveAll;
    s && !r.includes(s) && (t = s(t, n), r.push(s));
  }
  return t;
}
const Kr = {
  name: "attention",
  resolveAll: xm,
  tokenize: wm
};
function xm(e, t) {
  let n = -1, r, i, s, o, a, l, u, h;
  for (; ++n < e.length; )
    if (e[n][0] === "enter" && e[n][1].type === "attentionSequence" && e[n][1]._close) {
      for (r = n; r--; )
        if (e[r][0] === "exit" && e[r][1].type === "attentionSequence" && e[r][1]._open && // If the markers are the same:
        t.sliceSerialize(e[r][1]).charCodeAt(0) === t.sliceSerialize(e[n][1]).charCodeAt(0)) {
          if ((e[r][1]._close || e[n][1]._open) && (e[n][1].end.offset - e[n][1].start.offset) % 3 && !((e[r][1].end.offset - e[r][1].start.offset + e[n][1].end.offset - e[n][1].start.offset) % 3))
            continue;
          l = e[r][1].end.offset - e[r][1].start.offset > 1 && e[n][1].end.offset - e[n][1].start.offset > 1 ? 2 : 1;
          const c = {
            ...e[r][1].end
          }, f = {
            ...e[n][1].start
          };
          Bs(c, -l), Bs(f, l), o = {
            type: l > 1 ? "strongSequence" : "emphasisSequence",
            start: c,
            end: {
              ...e[r][1].end
            }
          }, a = {
            type: l > 1 ? "strongSequence" : "emphasisSequence",
            start: {
              ...e[n][1].start
            },
            end: f
          }, s = {
            type: l > 1 ? "strongText" : "emphasisText",
            start: {
              ...e[r][1].end
            },
            end: {
              ...e[n][1].start
            }
          }, i = {
            type: l > 1 ? "strong" : "emphasis",
            start: {
              ...o.start
            },
            end: {
              ...a.end
            }
          }, e[r][1].end = {
            ...o.start
          }, e[n][1].start = {
            ...a.end
          }, u = [], e[r][1].end.offset - e[r][1].start.offset && (u = fe(u, [["enter", e[r][1], t], ["exit", e[r][1], t]])), u = fe(u, [["enter", i, t], ["enter", o, t], ["exit", o, t], ["enter", s, t]]), u = fe(u, Xn(t.parser.constructs.insideSpan.null, e.slice(r + 1, n), t)), u = fe(u, [["exit", s, t], ["enter", a, t], ["exit", a, t], ["exit", i, t]]), e[n][1].end.offset - e[n][1].start.offset ? (h = 2, u = fe(u, [["enter", e[n][1], t], ["exit", e[n][1], t]])) : h = 0, ce(e, r - 1, n - r + 3, u), n = r + u.length - h - 2;
          break;
        }
    }
  for (n = -1; ++n < e.length; )
    e[n][1].type === "attentionSequence" && (e[n][1].type = "data");
  return e;
}
function wm(e, t) {
  const n = this.parser.constructs.attentionMarkers.null, r = this.previous, i = St(r);
  let s;
  return o;
  function o(l) {
    return s = l, e.enter("attentionSequence"), a(l);
  }
  function a(l) {
    if (l === s)
      return e.consume(l), a;
    const u = e.exit("attentionSequence"), h = St(l), c = !h || h === 2 && i || n.includes(l), f = !i || i === 2 && h || n.includes(r);
    return u._open = !!(s === 42 ? c : c && (i || !f)), u._close = !!(s === 42 ? f : f && (h || !c)), t(l);
  }
}
function Bs(e, t) {
  e.column += t, e.offset += t, e._bufferIndex += t;
}
const km = {
  name: "autolink",
  tokenize: _m
};
function _m(e, t, n) {
  let r = 0;
  return i;
  function i(d) {
    return e.enter("autolink"), e.enter("autolinkMarker"), e.consume(d), e.exit("autolinkMarker"), e.enter("autolinkProtocol"), s;
  }
  function s(d) {
    return ie(d) ? (e.consume(d), o) : d === 64 ? n(d) : u(d);
  }
  function o(d) {
    return d === 43 || d === 45 || d === 46 || te(d) ? (r = 1, a(d)) : u(d);
  }
  function a(d) {
    return d === 58 ? (e.consume(d), r = 0, l) : (d === 43 || d === 45 || d === 46 || te(d)) && r++ < 32 ? (e.consume(d), a) : (r = 0, u(d));
  }
  function l(d) {
    return d === 62 ? (e.exit("autolinkProtocol"), e.enter("autolinkMarker"), e.consume(d), e.exit("autolinkMarker"), e.exit("autolink"), t) : d === null || d === 32 || d === 60 || An(d) ? n(d) : (e.consume(d), l);
  }
  function u(d) {
    return d === 64 ? (e.consume(d), h) : hm(d) ? (e.consume(d), u) : n(d);
  }
  function h(d) {
    return te(d) ? c(d) : n(d);
  }
  function c(d) {
    return d === 46 ? (e.consume(d), r = 0, h) : d === 62 ? (e.exit("autolinkProtocol").type = "autolinkEmail", e.enter("autolinkMarker"), e.consume(d), e.exit("autolinkMarker"), e.exit("autolink"), t) : f(d);
  }
  function f(d) {
    if ((d === 45 || te(d)) && r++ < 63) {
      const p = d === 45 ? f : c;
      return e.consume(d), p;
    }
    return n(d);
  }
}
const en = {
  partial: !0,
  tokenize: Sm
};
function Sm(e, t, n) {
  return r;
  function r(s) {
    return z(s) ? U(e, i, "linePrefix")(s) : i(s);
  }
  function i(s) {
    return s === null || P(s) ? t(s) : n(s);
  }
}
const al = {
  continuation: {
    tokenize: vm
  },
  exit: Em,
  name: "blockQuote",
  tokenize: Cm
};
function Cm(e, t, n) {
  const r = this;
  return i;
  function i(o) {
    if (o === 62) {
      const a = r.containerState;
      return a.open || (e.enter("blockQuote", {
        _container: !0
      }), a.open = !0), e.enter("blockQuotePrefix"), e.enter("blockQuoteMarker"), e.consume(o), e.exit("blockQuoteMarker"), s;
    }
    return n(o);
  }
  function s(o) {
    return z(o) ? (e.enter("blockQuotePrefixWhitespace"), e.consume(o), e.exit("blockQuotePrefixWhitespace"), e.exit("blockQuotePrefix"), t) : (e.exit("blockQuotePrefix"), t(o));
  }
}
function vm(e, t, n) {
  const r = this;
  return i;
  function i(o) {
    return z(o) ? U(e, s, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(o) : s(o);
  }
  function s(o) {
    return e.attempt(al, t, n)(o);
  }
}
function Em(e) {
  e.exit("blockQuote");
}
const ll = {
  name: "characterEscape",
  tokenize: Im
};
function Im(e, t, n) {
  return r;
  function r(s) {
    return e.enter("characterEscape"), e.enter("escapeMarker"), e.consume(s), e.exit("escapeMarker"), i;
  }
  function i(s) {
    return dm(s) ? (e.enter("characterEscapeValue"), e.consume(s), e.exit("characterEscapeValue"), e.exit("characterEscape"), t) : n(s);
  }
}
const ul = {
  name: "characterReference",
  tokenize: Am
};
function Am(e, t, n) {
  const r = this;
  let i = 0, s, o;
  return a;
  function a(c) {
    return e.enter("characterReference"), e.enter("characterReferenceMarker"), e.consume(c), e.exit("characterReferenceMarker"), l;
  }
  function l(c) {
    return c === 35 ? (e.enter("characterReferenceMarkerNumeric"), e.consume(c), e.exit("characterReferenceMarkerNumeric"), u) : (e.enter("characterReferenceValue"), s = 31, o = te, h(c));
  }
  function u(c) {
    return c === 88 || c === 120 ? (e.enter("characterReferenceMarkerHexadecimal"), e.consume(c), e.exit("characterReferenceMarkerHexadecimal"), e.enter("characterReferenceValue"), s = 6, o = fm, h) : (e.enter("characterReferenceValue"), s = 7, o = qr, h(c));
  }
  function h(c) {
    if (c === 59 && i) {
      const f = e.exit("characterReferenceValue");
      return o === te && !Mi(r.sliceSerialize(f)) ? n(c) : (e.enter("characterReferenceMarker"), e.consume(c), e.exit("characterReferenceMarker"), e.exit("characterReference"), t);
    }
    return o(c) && i++ < s ? (e.consume(c), h) : n(c);
  }
}
const zs = {
  partial: !0,
  tokenize: Rm
}, $s = {
  concrete: !0,
  name: "codeFenced",
  tokenize: Tm
};
function Tm(e, t, n) {
  const r = this, i = {
    partial: !0,
    tokenize: A
  };
  let s = 0, o = 0, a;
  return l;
  function l(_) {
    return u(_);
  }
  function u(_) {
    const F = r.events[r.events.length - 1];
    return s = F && F[1].type === "linePrefix" ? F[2].sliceSerialize(F[1], !0).length : 0, a = _, e.enter("codeFenced"), e.enter("codeFencedFence"), e.enter("codeFencedFenceSequence"), h(_);
  }
  function h(_) {
    return _ === a ? (o++, e.consume(_), h) : o < 3 ? n(_) : (e.exit("codeFencedFenceSequence"), z(_) ? U(e, c, "whitespace")(_) : c(_));
  }
  function c(_) {
    return _ === null || P(_) ? (e.exit("codeFencedFence"), r.interrupt ? t(_) : e.check(zs, y, M)(_)) : (e.enter("codeFencedFenceInfo"), e.enter("chunkString", {
      contentType: "string"
    }), f(_));
  }
  function f(_) {
    return _ === null || P(_) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), c(_)) : z(_) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), U(e, d, "whitespace")(_)) : _ === 96 && _ === a ? n(_) : (e.consume(_), f);
  }
  function d(_) {
    return _ === null || P(_) ? c(_) : (e.enter("codeFencedFenceMeta"), e.enter("chunkString", {
      contentType: "string"
    }), p(_));
  }
  function p(_) {
    return _ === null || P(_) ? (e.exit("chunkString"), e.exit("codeFencedFenceMeta"), c(_)) : _ === 96 && _ === a ? n(_) : (e.consume(_), p);
  }
  function y(_) {
    return e.attempt(i, M, x)(_);
  }
  function x(_) {
    return e.enter("lineEnding"), e.consume(_), e.exit("lineEnding"), b;
  }
  function b(_) {
    return s > 0 && z(_) ? U(e, S, "linePrefix", s + 1)(_) : S(_);
  }
  function S(_) {
    return _ === null || P(_) ? e.check(zs, y, M)(_) : (e.enter("codeFlowValue"), v(_));
  }
  function v(_) {
    return _ === null || P(_) ? (e.exit("codeFlowValue"), S(_)) : (e.consume(_), v);
  }
  function M(_) {
    return e.exit("codeFenced"), t(_);
  }
  function A(_, F, $) {
    let V = 0;
    return k;
    function k(T) {
      return _.enter("lineEnding"), _.consume(T), _.exit("lineEnding"), R;
    }
    function R(T) {
      return _.enter("codeFencedFence"), z(T) ? U(_, D, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(T) : D(T);
    }
    function D(T) {
      return T === a ? (_.enter("codeFencedFenceSequence"), H(T)) : $(T);
    }
    function H(T) {
      return T === a ? (V++, _.consume(T), H) : V >= o ? (_.exit("codeFencedFenceSequence"), z(T) ? U(_, N, "whitespace")(T) : N(T)) : $(T);
    }
    function N(T) {
      return T === null || P(T) ? (_.exit("codeFencedFence"), F(T)) : $(T);
    }
  }
}
function Rm(e, t, n) {
  const r = this;
  return i;
  function i(o) {
    return o === null ? n(o) : (e.enter("lineEnding"), e.consume(o), e.exit("lineEnding"), s);
  }
  function s(o) {
    return r.parser.lazy[r.now().line] ? n(o) : t(o);
  }
}
const gr = {
  name: "codeIndented",
  tokenize: Mm
}, Dm = {
  partial: !0,
  tokenize: Pm
};
function Mm(e, t, n) {
  const r = this;
  return i;
  function i(u) {
    return e.enter("codeIndented"), U(e, s, "linePrefix", 5)(u);
  }
  function s(u) {
    const h = r.events[r.events.length - 1];
    return h && h[1].type === "linePrefix" && h[2].sliceSerialize(h[1], !0).length >= 4 ? o(u) : n(u);
  }
  function o(u) {
    return u === null ? l(u) : P(u) ? e.attempt(Dm, o, l)(u) : (e.enter("codeFlowValue"), a(u));
  }
  function a(u) {
    return u === null || P(u) ? (e.exit("codeFlowValue"), o(u)) : (e.consume(u), a);
  }
  function l(u) {
    return e.exit("codeIndented"), t(u);
  }
}
function Pm(e, t, n) {
  const r = this;
  return i;
  function i(o) {
    return r.parser.lazy[r.now().line] ? n(o) : P(o) ? (e.enter("lineEnding"), e.consume(o), e.exit("lineEnding"), i) : U(e, s, "linePrefix", 5)(o);
  }
  function s(o) {
    const a = r.events[r.events.length - 1];
    return a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? t(o) : P(o) ? i(o) : n(o);
  }
}
const Nm = {
  name: "codeText",
  previous: Lm,
  resolve: Om,
  tokenize: Fm
};
function Om(e) {
  let t = e.length - 4, n = 3, r, i;
  if ((e[n][1].type === "lineEnding" || e[n][1].type === "space") && (e[t][1].type === "lineEnding" || e[t][1].type === "space")) {
    for (r = n; ++r < t; )
      if (e[r][1].type === "codeTextData") {
        e[n][1].type = "codeTextPadding", e[t][1].type = "codeTextPadding", n += 2, t -= 2;
        break;
      }
  }
  for (r = n - 1, t++; ++r <= t; )
    i === void 0 ? r !== t && e[r][1].type !== "lineEnding" && (i = r) : (r === t || e[r][1].type === "lineEnding") && (e[i][1].type = "codeTextData", r !== i + 2 && (e[i][1].end = e[r - 1][1].end, e.splice(i + 2, r - i - 2), t -= r - i - 2, r = i + 2), i = void 0);
  return e;
}
function Lm(e) {
  return e !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function Fm(e, t, n) {
  let r = 0, i, s;
  return o;
  function o(c) {
    return e.enter("codeText"), e.enter("codeTextSequence"), a(c);
  }
  function a(c) {
    return c === 96 ? (e.consume(c), r++, a) : (e.exit("codeTextSequence"), l(c));
  }
  function l(c) {
    return c === null ? n(c) : c === 32 ? (e.enter("space"), e.consume(c), e.exit("space"), l) : c === 96 ? (s = e.enter("codeTextSequence"), i = 0, h(c)) : P(c) ? (e.enter("lineEnding"), e.consume(c), e.exit("lineEnding"), l) : (e.enter("codeTextData"), u(c));
  }
  function u(c) {
    return c === null || c === 32 || c === 96 || P(c) ? (e.exit("codeTextData"), l(c)) : (e.consume(c), u);
  }
  function h(c) {
    return c === 96 ? (e.consume(c), i++, h) : i === r ? (e.exit("codeTextSequence"), e.exit("codeText"), t(c)) : (s.type = "codeTextData", u(c));
  }
}
class Bm {
  /**
   * @param {ReadonlyArray<T> | null | undefined} [initial]
   *   Initial items (optional).
   * @returns
   *   Splice buffer.
   */
  constructor(t) {
    this.left = t ? [...t] : [], this.right = [];
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
  get(t) {
    if (t < 0 || t >= this.left.length + this.right.length)
      throw new RangeError("Cannot access index `" + t + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
    return t < this.left.length ? this.left[t] : this.right[this.right.length - t + this.left.length - 1];
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
  slice(t, n) {
    const r = n ?? Number.POSITIVE_INFINITY;
    return r < this.left.length ? this.left.slice(t, r) : t > this.left.length ? this.right.slice(this.right.length - r + this.left.length, this.right.length - t + this.left.length).reverse() : this.left.slice(t).concat(this.right.slice(this.right.length - r + this.left.length).reverse());
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
  splice(t, n, r) {
    const i = n || 0;
    this.setCursor(Math.trunc(t));
    const s = this.right.splice(this.right.length - i, Number.POSITIVE_INFINITY);
    return r && Ft(this.left, r), s.reverse();
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
  push(t) {
    this.setCursor(Number.POSITIVE_INFINITY), this.left.push(t);
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
  pushMany(t) {
    this.setCursor(Number.POSITIVE_INFINITY), Ft(this.left, t);
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
  unshift(t) {
    this.setCursor(0), this.right.push(t);
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
  unshiftMany(t) {
    this.setCursor(0), Ft(this.right, t.reverse());
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
  setCursor(t) {
    if (!(t === this.left.length || t > this.left.length && this.right.length === 0 || t < 0 && this.left.length === 0))
      if (t < this.left.length) {
        const n = this.left.splice(t, Number.POSITIVE_INFINITY);
        Ft(this.right, n.reverse());
      } else {
        const n = this.right.splice(this.left.length + this.right.length - t, Number.POSITIVE_INFINITY);
        Ft(this.left, n.reverse());
      }
  }
}
function Ft(e, t) {
  let n = 0;
  if (t.length < 1e4)
    e.push(...t);
  else
    for (; n < t.length; )
      e.push(...t.slice(n, n + 1e4)), n += 1e4;
}
function cl(e) {
  const t = {};
  let n = -1, r, i, s, o, a, l, u;
  const h = new Bm(e);
  for (; ++n < h.length; ) {
    for (; n in t; )
      n = t[n];
    if (r = h.get(n), n && r[1].type === "chunkFlow" && h.get(n - 1)[1].type === "listItemPrefix" && (l = r[1]._tokenizer.events, s = 0, s < l.length && l[s][1].type === "lineEndingBlank" && (s += 2), s < l.length && l[s][1].type === "content"))
      for (; ++s < l.length && l[s][1].type !== "content"; )
        l[s][1].type === "chunkText" && (l[s][1]._isInFirstContentOfListItem = !0, s++);
    if (r[0] === "enter")
      r[1].contentType && (Object.assign(t, zm(h, n)), n = t[n], u = !0);
    else if (r[1]._container) {
      for (s = n, i = void 0; s--; )
        if (o = h.get(s), o[1].type === "lineEnding" || o[1].type === "lineEndingBlank")
          o[0] === "enter" && (i && (h.get(i)[1].type = "lineEndingBlank"), o[1].type = "lineEnding", i = s);
        else if (!(o[1].type === "linePrefix" || o[1].type === "listItemIndent")) break;
      i && (r[1].end = {
        ...h.get(i)[1].start
      }, a = h.slice(i, n), a.unshift(r), h.splice(i, n - i + 1, a));
    }
  }
  return ce(e, 0, Number.POSITIVE_INFINITY, h.slice(0)), !u;
}
function zm(e, t) {
  const n = e.get(t)[1], r = e.get(t)[2];
  let i = t - 1;
  const s = [];
  let o = n._tokenizer;
  o || (o = r.parser[n.contentType](n.start), n._contentTypeTextTrailing && (o._contentTypeTextTrailing = !0));
  const a = o.events, l = [], u = {};
  let h, c, f = -1, d = n, p = 0, y = 0;
  const x = [y];
  for (; d; ) {
    for (; e.get(++i)[1] !== d; )
      ;
    s.push(i), d._tokenizer || (h = r.sliceStream(d), d.next || h.push(null), c && o.defineSkip(d.start), d._isInFirstContentOfListItem && (o._gfmTasklistFirstContentOfListItem = !0), o.write(h), d._isInFirstContentOfListItem && (o._gfmTasklistFirstContentOfListItem = void 0)), c = d, d = d.next;
  }
  for (d = n; ++f < a.length; )
    // Find a void token that includes a break.
    a[f][0] === "exit" && a[f - 1][0] === "enter" && a[f][1].type === a[f - 1][1].type && a[f][1].start.line !== a[f][1].end.line && (y = f + 1, x.push(y), d._tokenizer = void 0, d.previous = void 0, d = d.next);
  for (o.events = [], d ? (d._tokenizer = void 0, d.previous = void 0) : x.pop(), f = x.length; f--; ) {
    const b = a.slice(x[f], x[f + 1]), S = s.pop();
    l.push([S, S + b.length - 1]), e.splice(S, 2, b);
  }
  for (l.reverse(), f = -1; ++f < l.length; )
    u[p + l[f][0]] = p + l[f][1], p += l[f][1] - l[f][0] - 1;
  return u;
}
const $m = {
  resolve: Um,
  tokenize: Vm
}, jm = {
  partial: !0,
  tokenize: Hm
};
function Um(e) {
  return cl(e), e;
}
function Vm(e, t) {
  let n;
  return r;
  function r(a) {
    return e.enter("content"), n = e.enter("chunkContent", {
      contentType: "content"
    }), i(a);
  }
  function i(a) {
    return a === null ? s(a) : P(a) ? e.check(jm, o, s)(a) : (e.consume(a), i);
  }
  function s(a) {
    return e.exit("chunkContent"), e.exit("content"), t(a);
  }
  function o(a) {
    return e.consume(a), e.exit("chunkContent"), n.next = e.enter("chunkContent", {
      contentType: "content",
      previous: n
    }), n = n.next, i;
  }
}
function Hm(e, t, n) {
  const r = this;
  return i;
  function i(o) {
    return e.exit("chunkContent"), e.enter("lineEnding"), e.consume(o), e.exit("lineEnding"), U(e, s, "linePrefix");
  }
  function s(o) {
    if (o === null || P(o))
      return n(o);
    const a = r.events[r.events.length - 1];
    return !r.parser.constructs.disable.null.includes("codeIndented") && a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? t(o) : e.interrupt(r.parser.constructs.flow, n, t)(o);
  }
}
function hl(e, t, n, r, i, s, o, a, l) {
  const u = l || Number.POSITIVE_INFINITY;
  let h = 0;
  return c;
  function c(b) {
    return b === 60 ? (e.enter(r), e.enter(i), e.enter(s), e.consume(b), e.exit(s), f) : b === null || b === 32 || b === 41 || An(b) ? n(b) : (e.enter(r), e.enter(o), e.enter(a), e.enter("chunkString", {
      contentType: "string"
    }), y(b));
  }
  function f(b) {
    return b === 62 ? (e.enter(s), e.consume(b), e.exit(s), e.exit(i), e.exit(r), t) : (e.enter(a), e.enter("chunkString", {
      contentType: "string"
    }), d(b));
  }
  function d(b) {
    return b === 62 ? (e.exit("chunkString"), e.exit(a), f(b)) : b === null || b === 60 || P(b) ? n(b) : (e.consume(b), b === 92 ? p : d);
  }
  function p(b) {
    return b === 60 || b === 62 || b === 92 ? (e.consume(b), d) : d(b);
  }
  function y(b) {
    return !h && (b === null || b === 41 || Y(b)) ? (e.exit("chunkString"), e.exit(a), e.exit(o), e.exit(r), t(b)) : h < u && b === 40 ? (e.consume(b), h++, y) : b === 41 ? (e.consume(b), h--, y) : b === null || b === 32 || b === 40 || An(b) ? n(b) : (e.consume(b), b === 92 ? x : y);
  }
  function x(b) {
    return b === 40 || b === 41 || b === 92 ? (e.consume(b), y) : y(b);
  }
}
function fl(e, t, n, r, i, s) {
  const o = this;
  let a = 0, l;
  return u;
  function u(d) {
    return e.enter(r), e.enter(i), e.consume(d), e.exit(i), e.enter(s), h;
  }
  function h(d) {
    return a > 999 || d === null || d === 91 || d === 93 && !l || // To do: remove in the future once we’ve switched from
    // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
    // which doesn’t need this.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    d === 94 && !a && "_hiddenFootnoteSupport" in o.parser.constructs ? n(d) : d === 93 ? (e.exit(s), e.enter(i), e.consume(d), e.exit(i), e.exit(r), t) : P(d) ? (e.enter("lineEnding"), e.consume(d), e.exit("lineEnding"), h) : (e.enter("chunkString", {
      contentType: "string"
    }), c(d));
  }
  function c(d) {
    return d === null || d === 91 || d === 93 || P(d) || a++ > 999 ? (e.exit("chunkString"), h(d)) : (e.consume(d), l || (l = !z(d)), d === 92 ? f : c);
  }
  function f(d) {
    return d === 91 || d === 92 || d === 93 ? (e.consume(d), a++, c) : c(d);
  }
}
function dl(e, t, n, r, i, s) {
  let o;
  return a;
  function a(f) {
    return f === 34 || f === 39 || f === 40 ? (e.enter(r), e.enter(i), e.consume(f), e.exit(i), o = f === 40 ? 41 : f, l) : n(f);
  }
  function l(f) {
    return f === o ? (e.enter(i), e.consume(f), e.exit(i), e.exit(r), t) : (e.enter(s), u(f));
  }
  function u(f) {
    return f === o ? (e.exit(s), l(o)) : f === null ? n(f) : P(f) ? (e.enter("lineEnding"), e.consume(f), e.exit("lineEnding"), U(e, u, "linePrefix")) : (e.enter("chunkString", {
      contentType: "string"
    }), h(f));
  }
  function h(f) {
    return f === o || f === null || P(f) ? (e.exit("chunkString"), u(f)) : (e.consume(f), f === 92 ? c : h);
  }
  function c(f) {
    return f === o || f === 92 ? (e.consume(f), h) : h(f);
  }
}
function Ut(e, t) {
  let n;
  return r;
  function r(i) {
    return P(i) ? (e.enter("lineEnding"), e.consume(i), e.exit("lineEnding"), n = !0, r) : z(i) ? U(e, r, n ? "linePrefix" : "lineSuffix")(i) : t(i);
  }
}
const qm = {
  name: "definition",
  tokenize: Wm
}, Km = {
  partial: !0,
  tokenize: Jm
};
function Wm(e, t, n) {
  const r = this;
  let i;
  return s;
  function s(d) {
    return e.enter("definition"), o(d);
  }
  function o(d) {
    return fl.call(
      r,
      e,
      a,
      // Note: we don’t need to reset the way `markdown-rs` does.
      n,
      "definitionLabel",
      "definitionLabelMarker",
      "definitionLabelString"
    )(d);
  }
  function a(d) {
    return i = ve(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1)), d === 58 ? (e.enter("definitionMarker"), e.consume(d), e.exit("definitionMarker"), l) : n(d);
  }
  function l(d) {
    return Y(d) ? Ut(e, u)(d) : u(d);
  }
  function u(d) {
    return hl(
      e,
      h,
      // Note: we don’t need to reset the way `markdown-rs` does.
      n,
      "definitionDestination",
      "definitionDestinationLiteral",
      "definitionDestinationLiteralMarker",
      "definitionDestinationRaw",
      "definitionDestinationString"
    )(d);
  }
  function h(d) {
    return e.attempt(Km, c, c)(d);
  }
  function c(d) {
    return z(d) ? U(e, f, "whitespace")(d) : f(d);
  }
  function f(d) {
    return d === null || P(d) ? (e.exit("definition"), r.parser.defined.push(i), t(d)) : n(d);
  }
}
function Jm(e, t, n) {
  return r;
  function r(a) {
    return Y(a) ? Ut(e, i)(a) : n(a);
  }
  function i(a) {
    return dl(e, s, n, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(a);
  }
  function s(a) {
    return z(a) ? U(e, o, "whitespace")(a) : o(a);
  }
  function o(a) {
    return a === null || P(a) ? t(a) : n(a);
  }
}
const Ym = {
  name: "hardBreakEscape",
  tokenize: Qm
};
function Qm(e, t, n) {
  return r;
  function r(s) {
    return e.enter("hardBreakEscape"), e.consume(s), i;
  }
  function i(s) {
    return P(s) ? (e.exit("hardBreakEscape"), t(s)) : n(s);
  }
}
const Gm = {
  name: "headingAtx",
  resolve: Xm,
  tokenize: Zm
};
function Xm(e, t) {
  let n = e.length - 2, r = 3, i, s;
  return e[r][1].type === "whitespace" && (r += 2), n - 2 > r && e[n][1].type === "whitespace" && (n -= 2), e[n][1].type === "atxHeadingSequence" && (r === n - 1 || n - 4 > r && e[n - 2][1].type === "whitespace") && (n -= r + 1 === n ? 2 : 4), n > r && (i = {
    type: "atxHeadingText",
    start: e[r][1].start,
    end: e[n][1].end
  }, s = {
    type: "chunkText",
    start: e[r][1].start,
    end: e[n][1].end,
    contentType: "text"
  }, ce(e, r, n - r + 1, [["enter", i, t], ["enter", s, t], ["exit", s, t], ["exit", i, t]])), e;
}
function Zm(e, t, n) {
  let r = 0;
  return i;
  function i(h) {
    return e.enter("atxHeading"), s(h);
  }
  function s(h) {
    return e.enter("atxHeadingSequence"), o(h);
  }
  function o(h) {
    return h === 35 && r++ < 6 ? (e.consume(h), o) : h === null || Y(h) ? (e.exit("atxHeadingSequence"), a(h)) : n(h);
  }
  function a(h) {
    return h === 35 ? (e.enter("atxHeadingSequence"), l(h)) : h === null || P(h) ? (e.exit("atxHeading"), t(h)) : z(h) ? U(e, a, "whitespace")(h) : (e.enter("atxHeadingText"), u(h));
  }
  function l(h) {
    return h === 35 ? (e.consume(h), l) : (e.exit("atxHeadingSequence"), a(h));
  }
  function u(h) {
    return h === null || h === 35 || Y(h) ? (e.exit("atxHeadingText"), a(h)) : (e.consume(h), u);
  }
}
const eg = [
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
], js = ["pre", "script", "style", "textarea"], tg = {
  concrete: !0,
  name: "htmlFlow",
  resolveTo: ig,
  tokenize: sg
}, ng = {
  partial: !0,
  tokenize: ag
}, rg = {
  partial: !0,
  tokenize: og
};
function ig(e) {
  let t = e.length;
  for (; t-- && !(e[t][0] === "enter" && e[t][1].type === "htmlFlow"); )
    ;
  return t > 1 && e[t - 2][1].type === "linePrefix" && (e[t][1].start = e[t - 2][1].start, e[t + 1][1].start = e[t - 2][1].start, e.splice(t - 2, 2)), e;
}
function sg(e, t, n) {
  const r = this;
  let i, s, o, a, l;
  return u;
  function u(g) {
    return h(g);
  }
  function h(g) {
    return e.enter("htmlFlow"), e.enter("htmlFlowData"), e.consume(g), c;
  }
  function c(g) {
    return g === 33 ? (e.consume(g), f) : g === 47 ? (e.consume(g), s = !0, y) : g === 63 ? (e.consume(g), i = 3, r.interrupt ? t : m) : ie(g) ? (e.consume(g), o = String.fromCharCode(g), x) : n(g);
  }
  function f(g) {
    return g === 45 ? (e.consume(g), i = 2, d) : g === 91 ? (e.consume(g), i = 5, a = 0, p) : ie(g) ? (e.consume(g), i = 4, r.interrupt ? t : m) : n(g);
  }
  function d(g) {
    return g === 45 ? (e.consume(g), r.interrupt ? t : m) : n(g);
  }
  function p(g) {
    const we = "CDATA[";
    return g === we.charCodeAt(a++) ? (e.consume(g), a === we.length ? r.interrupt ? t : D : p) : n(g);
  }
  function y(g) {
    return ie(g) ? (e.consume(g), o = String.fromCharCode(g), x) : n(g);
  }
  function x(g) {
    if (g === null || g === 47 || g === 62 || Y(g)) {
      const we = g === 47, Ye = o.toLowerCase();
      return !we && !s && js.includes(Ye) ? (i = 1, r.interrupt ? t(g) : D(g)) : eg.includes(o.toLowerCase()) ? (i = 6, we ? (e.consume(g), b) : r.interrupt ? t(g) : D(g)) : (i = 7, r.interrupt && !r.parser.lazy[r.now().line] ? n(g) : s ? S(g) : v(g));
    }
    return g === 45 || te(g) ? (e.consume(g), o += String.fromCharCode(g), x) : n(g);
  }
  function b(g) {
    return g === 62 ? (e.consume(g), r.interrupt ? t : D) : n(g);
  }
  function S(g) {
    return z(g) ? (e.consume(g), S) : k(g);
  }
  function v(g) {
    return g === 47 ? (e.consume(g), k) : g === 58 || g === 95 || ie(g) ? (e.consume(g), M) : z(g) ? (e.consume(g), v) : k(g);
  }
  function M(g) {
    return g === 45 || g === 46 || g === 58 || g === 95 || te(g) ? (e.consume(g), M) : A(g);
  }
  function A(g) {
    return g === 61 ? (e.consume(g), _) : z(g) ? (e.consume(g), A) : v(g);
  }
  function _(g) {
    return g === null || g === 60 || g === 61 || g === 62 || g === 96 ? n(g) : g === 34 || g === 39 ? (e.consume(g), l = g, F) : z(g) ? (e.consume(g), _) : $(g);
  }
  function F(g) {
    return g === l ? (e.consume(g), l = null, V) : g === null || P(g) ? n(g) : (e.consume(g), F);
  }
  function $(g) {
    return g === null || g === 34 || g === 39 || g === 47 || g === 60 || g === 61 || g === 62 || g === 96 || Y(g) ? A(g) : (e.consume(g), $);
  }
  function V(g) {
    return g === 47 || g === 62 || z(g) ? v(g) : n(g);
  }
  function k(g) {
    return g === 62 ? (e.consume(g), R) : n(g);
  }
  function R(g) {
    return g === null || P(g) ? D(g) : z(g) ? (e.consume(g), R) : n(g);
  }
  function D(g) {
    return g === 45 && i === 2 ? (e.consume(g), K) : g === 60 && i === 1 ? (e.consume(g), G) : g === 62 && i === 4 ? (e.consume(g), xe) : g === 63 && i === 3 ? (e.consume(g), m) : g === 93 && i === 5 ? (e.consume(g), Ne) : P(g) && (i === 6 || i === 7) ? (e.exit("htmlFlowData"), e.check(ng, Oe, H)(g)) : g === null || P(g) ? (e.exit("htmlFlowData"), H(g)) : (e.consume(g), D);
  }
  function H(g) {
    return e.check(rg, N, Oe)(g);
  }
  function N(g) {
    return e.enter("lineEnding"), e.consume(g), e.exit("lineEnding"), T;
  }
  function T(g) {
    return g === null || P(g) ? H(g) : (e.enter("htmlFlowData"), D(g));
  }
  function K(g) {
    return g === 45 ? (e.consume(g), m) : D(g);
  }
  function G(g) {
    return g === 47 ? (e.consume(g), o = "", ye) : D(g);
  }
  function ye(g) {
    if (g === 62) {
      const we = o.toLowerCase();
      return js.includes(we) ? (e.consume(g), xe) : D(g);
    }
    return ie(g) && o.length < 8 ? (e.consume(g), o += String.fromCharCode(g), ye) : D(g);
  }
  function Ne(g) {
    return g === 93 ? (e.consume(g), m) : D(g);
  }
  function m(g) {
    return g === 62 ? (e.consume(g), xe) : g === 45 && i === 2 ? (e.consume(g), m) : D(g);
  }
  function xe(g) {
    return g === null || P(g) ? (e.exit("htmlFlowData"), Oe(g)) : (e.consume(g), xe);
  }
  function Oe(g) {
    return e.exit("htmlFlow"), t(g);
  }
}
function og(e, t, n) {
  const r = this;
  return i;
  function i(o) {
    return P(o) ? (e.enter("lineEnding"), e.consume(o), e.exit("lineEnding"), s) : n(o);
  }
  function s(o) {
    return r.parser.lazy[r.now().line] ? n(o) : t(o);
  }
}
function ag(e, t, n) {
  return r;
  function r(i) {
    return e.enter("lineEnding"), e.consume(i), e.exit("lineEnding"), e.attempt(en, t, n);
  }
}
const lg = {
  name: "htmlText",
  tokenize: ug
};
function ug(e, t, n) {
  const r = this;
  let i, s, o;
  return a;
  function a(m) {
    return e.enter("htmlText"), e.enter("htmlTextData"), e.consume(m), l;
  }
  function l(m) {
    return m === 33 ? (e.consume(m), u) : m === 47 ? (e.consume(m), A) : m === 63 ? (e.consume(m), v) : ie(m) ? (e.consume(m), $) : n(m);
  }
  function u(m) {
    return m === 45 ? (e.consume(m), h) : m === 91 ? (e.consume(m), s = 0, p) : ie(m) ? (e.consume(m), S) : n(m);
  }
  function h(m) {
    return m === 45 ? (e.consume(m), d) : n(m);
  }
  function c(m) {
    return m === null ? n(m) : m === 45 ? (e.consume(m), f) : P(m) ? (o = c, G(m)) : (e.consume(m), c);
  }
  function f(m) {
    return m === 45 ? (e.consume(m), d) : c(m);
  }
  function d(m) {
    return m === 62 ? K(m) : m === 45 ? f(m) : c(m);
  }
  function p(m) {
    const xe = "CDATA[";
    return m === xe.charCodeAt(s++) ? (e.consume(m), s === xe.length ? y : p) : n(m);
  }
  function y(m) {
    return m === null ? n(m) : m === 93 ? (e.consume(m), x) : P(m) ? (o = y, G(m)) : (e.consume(m), y);
  }
  function x(m) {
    return m === 93 ? (e.consume(m), b) : y(m);
  }
  function b(m) {
    return m === 62 ? K(m) : m === 93 ? (e.consume(m), b) : y(m);
  }
  function S(m) {
    return m === null || m === 62 ? K(m) : P(m) ? (o = S, G(m)) : (e.consume(m), S);
  }
  function v(m) {
    return m === null ? n(m) : m === 63 ? (e.consume(m), M) : P(m) ? (o = v, G(m)) : (e.consume(m), v);
  }
  function M(m) {
    return m === 62 ? K(m) : v(m);
  }
  function A(m) {
    return ie(m) ? (e.consume(m), _) : n(m);
  }
  function _(m) {
    return m === 45 || te(m) ? (e.consume(m), _) : F(m);
  }
  function F(m) {
    return P(m) ? (o = F, G(m)) : z(m) ? (e.consume(m), F) : K(m);
  }
  function $(m) {
    return m === 45 || te(m) ? (e.consume(m), $) : m === 47 || m === 62 || Y(m) ? V(m) : n(m);
  }
  function V(m) {
    return m === 47 ? (e.consume(m), K) : m === 58 || m === 95 || ie(m) ? (e.consume(m), k) : P(m) ? (o = V, G(m)) : z(m) ? (e.consume(m), V) : K(m);
  }
  function k(m) {
    return m === 45 || m === 46 || m === 58 || m === 95 || te(m) ? (e.consume(m), k) : R(m);
  }
  function R(m) {
    return m === 61 ? (e.consume(m), D) : P(m) ? (o = R, G(m)) : z(m) ? (e.consume(m), R) : V(m);
  }
  function D(m) {
    return m === null || m === 60 || m === 61 || m === 62 || m === 96 ? n(m) : m === 34 || m === 39 ? (e.consume(m), i = m, H) : P(m) ? (o = D, G(m)) : z(m) ? (e.consume(m), D) : (e.consume(m), N);
  }
  function H(m) {
    return m === i ? (e.consume(m), i = void 0, T) : m === null ? n(m) : P(m) ? (o = H, G(m)) : (e.consume(m), H);
  }
  function N(m) {
    return m === null || m === 34 || m === 39 || m === 60 || m === 61 || m === 96 ? n(m) : m === 47 || m === 62 || Y(m) ? V(m) : (e.consume(m), N);
  }
  function T(m) {
    return m === 47 || m === 62 || Y(m) ? V(m) : n(m);
  }
  function K(m) {
    return m === 62 ? (e.consume(m), e.exit("htmlTextData"), e.exit("htmlText"), t) : n(m);
  }
  function G(m) {
    return e.exit("htmlTextData"), e.enter("lineEnding"), e.consume(m), e.exit("lineEnding"), ye;
  }
  function ye(m) {
    return z(m) ? U(e, Ne, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(m) : Ne(m);
  }
  function Ne(m) {
    return e.enter("htmlTextData"), o(m);
  }
}
const Pi = {
  name: "labelEnd",
  resolveAll: dg,
  resolveTo: pg,
  tokenize: mg
}, cg = {
  tokenize: gg
}, hg = {
  tokenize: bg
}, fg = {
  tokenize: yg
};
function dg(e) {
  let t = -1;
  const n = [];
  for (; ++t < e.length; ) {
    const r = e[t][1];
    if (n.push(e[t]), r.type === "labelImage" || r.type === "labelLink" || r.type === "labelEnd") {
      const i = r.type === "labelImage" ? 4 : 2;
      r.type = "data", t += i;
    }
  }
  return e.length !== n.length && ce(e, 0, e.length, n), e;
}
function pg(e, t) {
  let n = e.length, r = 0, i, s, o, a;
  for (; n--; )
    if (i = e[n][1], s) {
      if (i.type === "link" || i.type === "labelLink" && i._inactive)
        break;
      e[n][0] === "enter" && i.type === "labelLink" && (i._inactive = !0);
    } else if (o) {
      if (e[n][0] === "enter" && (i.type === "labelImage" || i.type === "labelLink") && !i._balanced && (s = n, i.type !== "labelLink")) {
        r = 2;
        break;
      }
    } else i.type === "labelEnd" && (o = n);
  const l = {
    type: e[s][1].type === "labelLink" ? "link" : "image",
    start: {
      ...e[s][1].start
    },
    end: {
      ...e[e.length - 1][1].end
    }
  }, u = {
    type: "label",
    start: {
      ...e[s][1].start
    },
    end: {
      ...e[o][1].end
    }
  }, h = {
    type: "labelText",
    start: {
      ...e[s + r + 2][1].end
    },
    end: {
      ...e[o - 2][1].start
    }
  };
  return a = [["enter", l, t], ["enter", u, t]], a = fe(a, e.slice(s + 1, s + r + 3)), a = fe(a, [["enter", h, t]]), a = fe(a, Xn(t.parser.constructs.insideSpan.null, e.slice(s + r + 4, o - 3), t)), a = fe(a, [["exit", h, t], e[o - 2], e[o - 1], ["exit", u, t]]), a = fe(a, e.slice(o + 1)), a = fe(a, [["exit", l, t]]), ce(e, s, e.length, a), e;
}
function mg(e, t, n) {
  const r = this;
  let i = r.events.length, s, o;
  for (; i--; )
    if ((r.events[i][1].type === "labelImage" || r.events[i][1].type === "labelLink") && !r.events[i][1]._balanced) {
      s = r.events[i][1];
      break;
    }
  return a;
  function a(f) {
    return s ? s._inactive ? c(f) : (o = r.parser.defined.includes(ve(r.sliceSerialize({
      start: s.end,
      end: r.now()
    }))), e.enter("labelEnd"), e.enter("labelMarker"), e.consume(f), e.exit("labelMarker"), e.exit("labelEnd"), l) : n(f);
  }
  function l(f) {
    return f === 40 ? e.attempt(cg, h, o ? h : c)(f) : f === 91 ? e.attempt(hg, h, o ? u : c)(f) : o ? h(f) : c(f);
  }
  function u(f) {
    return e.attempt(fg, h, c)(f);
  }
  function h(f) {
    return t(f);
  }
  function c(f) {
    return s._balanced = !0, n(f);
  }
}
function gg(e, t, n) {
  return r;
  function r(c) {
    return e.enter("resource"), e.enter("resourceMarker"), e.consume(c), e.exit("resourceMarker"), i;
  }
  function i(c) {
    return Y(c) ? Ut(e, s)(c) : s(c);
  }
  function s(c) {
    return c === 41 ? h(c) : hl(e, o, a, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(c);
  }
  function o(c) {
    return Y(c) ? Ut(e, l)(c) : h(c);
  }
  function a(c) {
    return n(c);
  }
  function l(c) {
    return c === 34 || c === 39 || c === 40 ? dl(e, u, n, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(c) : h(c);
  }
  function u(c) {
    return Y(c) ? Ut(e, h)(c) : h(c);
  }
  function h(c) {
    return c === 41 ? (e.enter("resourceMarker"), e.consume(c), e.exit("resourceMarker"), e.exit("resource"), t) : n(c);
  }
}
function bg(e, t, n) {
  const r = this;
  return i;
  function i(a) {
    return fl.call(r, e, s, o, "reference", "referenceMarker", "referenceString")(a);
  }
  function s(a) {
    return r.parser.defined.includes(ve(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1))) ? t(a) : n(a);
  }
  function o(a) {
    return n(a);
  }
}
function yg(e, t, n) {
  return r;
  function r(s) {
    return e.enter("reference"), e.enter("referenceMarker"), e.consume(s), e.exit("referenceMarker"), i;
  }
  function i(s) {
    return s === 93 ? (e.enter("referenceMarker"), e.consume(s), e.exit("referenceMarker"), e.exit("reference"), t) : n(s);
  }
}
const xg = {
  name: "labelStartImage",
  resolveAll: Pi.resolveAll,
  tokenize: wg
};
function wg(e, t, n) {
  const r = this;
  return i;
  function i(a) {
    return e.enter("labelImage"), e.enter("labelImageMarker"), e.consume(a), e.exit("labelImageMarker"), s;
  }
  function s(a) {
    return a === 91 ? (e.enter("labelMarker"), e.consume(a), e.exit("labelMarker"), e.exit("labelImage"), o) : n(a);
  }
  function o(a) {
    return a === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(a) : t(a);
  }
}
const kg = {
  name: "labelStartLink",
  resolveAll: Pi.resolveAll,
  tokenize: _g
};
function _g(e, t, n) {
  const r = this;
  return i;
  function i(o) {
    return e.enter("labelLink"), e.enter("labelMarker"), e.consume(o), e.exit("labelMarker"), e.exit("labelLink"), s;
  }
  function s(o) {
    return o === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(o) : t(o);
  }
}
const br = {
  name: "lineEnding",
  tokenize: Sg
};
function Sg(e, t) {
  return n;
  function n(r) {
    return e.enter("lineEnding"), e.consume(r), e.exit("lineEnding"), U(e, t, "linePrefix");
  }
}
const xn = {
  name: "thematicBreak",
  tokenize: Cg
};
function Cg(e, t, n) {
  let r = 0, i;
  return s;
  function s(u) {
    return e.enter("thematicBreak"), o(u);
  }
  function o(u) {
    return i = u, a(u);
  }
  function a(u) {
    return u === i ? (e.enter("thematicBreakSequence"), l(u)) : r >= 3 && (u === null || P(u)) ? (e.exit("thematicBreak"), t(u)) : n(u);
  }
  function l(u) {
    return u === i ? (e.consume(u), r++, l) : (e.exit("thematicBreakSequence"), z(u) ? U(e, a, "whitespace")(u) : a(u));
  }
}
const se = {
  continuation: {
    tokenize: Ag
  },
  exit: Rg,
  name: "list",
  tokenize: Ig
}, vg = {
  partial: !0,
  tokenize: Dg
}, Eg = {
  partial: !0,
  tokenize: Tg
};
function Ig(e, t, n) {
  const r = this, i = r.events[r.events.length - 1];
  let s = i && i[1].type === "linePrefix" ? i[2].sliceSerialize(i[1], !0).length : 0, o = 0;
  return a;
  function a(d) {
    const p = r.containerState.type || (d === 42 || d === 43 || d === 45 ? "listUnordered" : "listOrdered");
    if (p === "listUnordered" ? !r.containerState.marker || d === r.containerState.marker : qr(d)) {
      if (r.containerState.type || (r.containerState.type = p, e.enter(p, {
        _container: !0
      })), p === "listUnordered")
        return e.enter("listItemPrefix"), d === 42 || d === 45 ? e.check(xn, n, u)(d) : u(d);
      if (!r.interrupt || d === 49)
        return e.enter("listItemPrefix"), e.enter("listItemValue"), l(d);
    }
    return n(d);
  }
  function l(d) {
    return qr(d) && ++o < 10 ? (e.consume(d), l) : (!r.interrupt || o < 2) && (r.containerState.marker ? d === r.containerState.marker : d === 41 || d === 46) ? (e.exit("listItemValue"), u(d)) : n(d);
  }
  function u(d) {
    return e.enter("listItemMarker"), e.consume(d), e.exit("listItemMarker"), r.containerState.marker = r.containerState.marker || d, e.check(
      en,
      // Can’t be empty when interrupting.
      r.interrupt ? n : h,
      e.attempt(vg, f, c)
    );
  }
  function h(d) {
    return r.containerState.initialBlankLine = !0, s++, f(d);
  }
  function c(d) {
    return z(d) ? (e.enter("listItemPrefixWhitespace"), e.consume(d), e.exit("listItemPrefixWhitespace"), f) : n(d);
  }
  function f(d) {
    return r.containerState.size = s + r.sliceSerialize(e.exit("listItemPrefix"), !0).length, t(d);
  }
}
function Ag(e, t, n) {
  const r = this;
  return r.containerState._closeFlow = void 0, e.check(en, i, s);
  function i(a) {
    return r.containerState.furtherBlankLines = r.containerState.furtherBlankLines || r.containerState.initialBlankLine, U(e, t, "listItemIndent", r.containerState.size + 1)(a);
  }
  function s(a) {
    return r.containerState.furtherBlankLines || !z(a) ? (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, o(a)) : (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, e.attempt(Eg, t, o)(a));
  }
  function o(a) {
    return r.containerState._closeFlow = !0, r.interrupt = void 0, U(e, e.attempt(se, t, n), "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(a);
  }
}
function Tg(e, t, n) {
  const r = this;
  return U(e, i, "listItemIndent", r.containerState.size + 1);
  function i(s) {
    const o = r.events[r.events.length - 1];
    return o && o[1].type === "listItemIndent" && o[2].sliceSerialize(o[1], !0).length === r.containerState.size ? t(s) : n(s);
  }
}
function Rg(e) {
  e.exit(this.containerState.type);
}
function Dg(e, t, n) {
  const r = this;
  return U(e, i, "listItemPrefixWhitespace", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5);
  function i(s) {
    const o = r.events[r.events.length - 1];
    return !z(s) && o && o[1].type === "listItemPrefixWhitespace" ? t(s) : n(s);
  }
}
const Us = {
  name: "setextUnderline",
  resolveTo: Mg,
  tokenize: Pg
};
function Mg(e, t) {
  let n = e.length, r, i, s;
  for (; n--; )
    if (e[n][0] === "enter") {
      if (e[n][1].type === "content") {
        r = n;
        break;
      }
      e[n][1].type === "paragraph" && (i = n);
    } else
      e[n][1].type === "content" && e.splice(n, 1), !s && e[n][1].type === "definition" && (s = n);
  const o = {
    type: "setextHeading",
    start: {
      ...e[r][1].start
    },
    end: {
      ...e[e.length - 1][1].end
    }
  };
  return e[i][1].type = "setextHeadingText", s ? (e.splice(i, 0, ["enter", o, t]), e.splice(s + 1, 0, ["exit", e[r][1], t]), e[r][1].end = {
    ...e[s][1].end
  }) : e[r][1] = o, e.push(["exit", o, t]), e;
}
function Pg(e, t, n) {
  const r = this;
  let i;
  return s;
  function s(u) {
    let h = r.events.length, c;
    for (; h--; )
      if (r.events[h][1].type !== "lineEnding" && r.events[h][1].type !== "linePrefix" && r.events[h][1].type !== "content") {
        c = r.events[h][1].type === "paragraph";
        break;
      }
    return !r.parser.lazy[r.now().line] && (r.interrupt || c) ? (e.enter("setextHeadingLine"), i = u, o(u)) : n(u);
  }
  function o(u) {
    return e.enter("setextHeadingLineSequence"), a(u);
  }
  function a(u) {
    return u === i ? (e.consume(u), a) : (e.exit("setextHeadingLineSequence"), z(u) ? U(e, l, "lineSuffix")(u) : l(u));
  }
  function l(u) {
    return u === null || P(u) ? (e.exit("setextHeadingLine"), t(u)) : n(u);
  }
}
const Ng = {
  tokenize: Og
};
function Og(e) {
  const t = this, n = e.attempt(
    // Try to parse a blank line.
    en,
    r,
    // Try to parse initial flow (essentially, only code).
    e.attempt(this.parser.constructs.flowInitial, i, U(e, e.attempt(this.parser.constructs.flow, i, e.attempt($m, i)), "linePrefix"))
  );
  return n;
  function r(s) {
    if (s === null) {
      e.consume(s);
      return;
    }
    return e.enter("lineEndingBlank"), e.consume(s), e.exit("lineEndingBlank"), t.currentConstruct = void 0, n;
  }
  function i(s) {
    if (s === null) {
      e.consume(s);
      return;
    }
    return e.enter("lineEnding"), e.consume(s), e.exit("lineEnding"), t.currentConstruct = void 0, n;
  }
}
const Lg = {
  resolveAll: ml()
}, Fg = pl("string"), Bg = pl("text");
function pl(e) {
  return {
    resolveAll: ml(e === "text" ? zg : void 0),
    tokenize: t
  };
  function t(n) {
    const r = this, i = this.parser.constructs[e], s = n.attempt(i, o, a);
    return o;
    function o(h) {
      return u(h) ? s(h) : a(h);
    }
    function a(h) {
      if (h === null) {
        n.consume(h);
        return;
      }
      return n.enter("data"), n.consume(h), l;
    }
    function l(h) {
      return u(h) ? (n.exit("data"), s(h)) : (n.consume(h), l);
    }
    function u(h) {
      if (h === null)
        return !0;
      const c = i[h];
      let f = -1;
      if (c)
        for (; ++f < c.length; ) {
          const d = c[f];
          if (!d.previous || d.previous.call(r, r.previous))
            return !0;
        }
      return !1;
    }
  }
}
function ml(e) {
  return t;
  function t(n, r) {
    let i = -1, s;
    for (; ++i <= n.length; )
      s === void 0 ? n[i] && n[i][1].type === "data" && (s = i, i++) : (!n[i] || n[i][1].type !== "data") && (i !== s + 2 && (n[s][1].end = n[i - 1][1].end, n.splice(s + 2, i - s - 2), i = s + 2), s = void 0);
    return e ? e(n, r) : n;
  }
}
function zg(e, t) {
  let n = 0;
  for (; ++n <= e.length; )
    if ((n === e.length || e[n][1].type === "lineEnding") && e[n - 1][1].type === "data") {
      const r = e[n - 1][1], i = t.sliceStream(r);
      let s = i.length, o = -1, a = 0, l;
      for (; s--; ) {
        const u = i[s];
        if (typeof u == "string") {
          for (o = u.length; u.charCodeAt(o - 1) === 32; )
            a++, o--;
          if (o) break;
          o = -1;
        } else if (u === -2)
          l = !0, a++;
        else if (u !== -1) {
          s++;
          break;
        }
      }
      if (t._contentTypeTextTrailing && n === e.length && (a = 0), a) {
        const u = {
          type: n === e.length || l || a < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            _bufferIndex: s ? o : r.start._bufferIndex + o,
            _index: r.start._index + s,
            line: r.end.line,
            column: r.end.column - a,
            offset: r.end.offset - a
          },
          end: {
            ...r.end
          }
        };
        r.end = {
          ...u.start
        }, r.start.offset === r.end.offset ? Object.assign(r, u) : (e.splice(n, 0, ["enter", u, t], ["exit", u, t]), n += 2);
      }
      n++;
    }
  return e;
}
const $g = {
  42: se,
  43: se,
  45: se,
  48: se,
  49: se,
  50: se,
  51: se,
  52: se,
  53: se,
  54: se,
  55: se,
  56: se,
  57: se,
  62: al
}, jg = {
  91: qm
}, Ug = {
  [-2]: gr,
  [-1]: gr,
  32: gr
}, Vg = {
  35: Gm,
  42: xn,
  45: [Us, xn],
  60: tg,
  61: Us,
  95: xn,
  96: $s,
  126: $s
}, Hg = {
  38: ul,
  92: ll
}, qg = {
  [-5]: br,
  [-4]: br,
  [-3]: br,
  33: xg,
  38: ul,
  42: Kr,
  60: [km, lg],
  91: kg,
  92: [Ym, ll],
  93: Pi,
  95: Kr,
  96: Nm
}, Kg = {
  null: [Kr, Lg]
}, Wg = {
  null: [42, 95]
}, Jg = {
  null: []
}, Yg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  attentionMarkers: Wg,
  contentInitial: jg,
  disable: Jg,
  document: $g,
  flow: Vg,
  flowInitial: Ug,
  insideSpan: Kg,
  string: Hg,
  text: qg
}, Symbol.toStringTag, { value: "Module" }));
function Qg(e, t, n) {
  let r = {
    _bufferIndex: -1,
    _index: 0,
    line: n && n.line || 1,
    column: n && n.column || 1,
    offset: n && n.offset || 0
  };
  const i = {}, s = [];
  let o = [], a = [];
  const l = {
    attempt: F(A),
    check: F(_),
    consume: S,
    enter: v,
    exit: M,
    interrupt: F(_, {
      interrupt: !0
    })
  }, u = {
    code: null,
    containerState: {},
    defineSkip: y,
    events: [],
    now: p,
    parser: e,
    previous: null,
    sliceSerialize: f,
    sliceStream: d,
    write: c
  };
  let h = t.tokenize.call(u, l);
  return t.resolveAll && s.push(t), u;
  function c(R) {
    return o = fe(o, R), x(), o[o.length - 1] !== null ? [] : ($(t, 0), u.events = Xn(s, u.events, u), u.events);
  }
  function f(R, D) {
    return Xg(d(R), D);
  }
  function d(R) {
    return Gg(o, R);
  }
  function p() {
    const {
      _bufferIndex: R,
      _index: D,
      line: H,
      column: N,
      offset: T
    } = r;
    return {
      _bufferIndex: R,
      _index: D,
      line: H,
      column: N,
      offset: T
    };
  }
  function y(R) {
    i[R.line] = R.column, k();
  }
  function x() {
    let R;
    for (; r._index < o.length; ) {
      const D = o[r._index];
      if (typeof D == "string")
        for (R = r._index, r._bufferIndex < 0 && (r._bufferIndex = 0); r._index === R && r._bufferIndex < D.length; )
          b(D.charCodeAt(r._bufferIndex));
      else
        b(D);
    }
  }
  function b(R) {
    h = h(R);
  }
  function S(R) {
    P(R) ? (r.line++, r.column = 1, r.offset += R === -3 ? 2 : 1, k()) : R !== -1 && (r.column++, r.offset++), r._bufferIndex < 0 ? r._index++ : (r._bufferIndex++, r._bufferIndex === // Points w/ non-negative `_bufferIndex` reference
    // strings.
    /** @type {string} */
    o[r._index].length && (r._bufferIndex = -1, r._index++)), u.previous = R;
  }
  function v(R, D) {
    const H = D || {};
    return H.type = R, H.start = p(), u.events.push(["enter", H, u]), a.push(H), H;
  }
  function M(R) {
    const D = a.pop();
    return D.end = p(), u.events.push(["exit", D, u]), D;
  }
  function A(R, D) {
    $(R, D.from);
  }
  function _(R, D) {
    D.restore();
  }
  function F(R, D) {
    return H;
    function H(N, T, K) {
      let G, ye, Ne, m;
      return Array.isArray(N) ? (
        /* c8 ignore next 1 */
        Oe(N)
      ) : "tokenize" in N ? (
        // Looks like a construct.
        Oe([
          /** @type {Construct} */
          N
        ])
      ) : xe(N);
      function xe(Z) {
        return Dt;
        function Dt(He) {
          const dt = He !== null && Z[He], pt = He !== null && Z.null, nn = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...Array.isArray(dt) ? dt : dt ? [dt] : [],
            ...Array.isArray(pt) ? pt : pt ? [pt] : []
          ];
          return Oe(nn)(He);
        }
      }
      function Oe(Z) {
        return G = Z, ye = 0, Z.length === 0 ? K : g(Z[ye]);
      }
      function g(Z) {
        return Dt;
        function Dt(He) {
          return m = V(), Ne = Z, Z.partial || (u.currentConstruct = Z), Z.name && u.parser.constructs.disable.null.includes(Z.name) ? Ye() : Z.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            D ? Object.assign(Object.create(u), D) : u,
            l,
            we,
            Ye
          )(He);
        }
      }
      function we(Z) {
        return R(Ne, m), T;
      }
      function Ye(Z) {
        return m.restore(), ++ye < G.length ? g(G[ye]) : K;
      }
    }
  }
  function $(R, D) {
    R.resolveAll && !s.includes(R) && s.push(R), R.resolve && ce(u.events, D, u.events.length - D, R.resolve(u.events.slice(D), u)), R.resolveTo && (u.events = R.resolveTo(u.events, u));
  }
  function V() {
    const R = p(), D = u.previous, H = u.currentConstruct, N = u.events.length, T = Array.from(a);
    return {
      from: N,
      restore: K
    };
    function K() {
      r = R, u.previous = D, u.currentConstruct = H, u.events.length = N, a = T, k();
    }
  }
  function k() {
    r.line in i && r.column < 2 && (r.column = i[r.line], r.offset += i[r.line] - 1);
  }
}
function Gg(e, t) {
  const n = t.start._index, r = t.start._bufferIndex, i = t.end._index, s = t.end._bufferIndex;
  let o;
  if (n === i)
    o = [e[n].slice(r, s)];
  else {
    if (o = e.slice(n, i), r > -1) {
      const a = o[0];
      typeof a == "string" ? o[0] = a.slice(r) : o.shift();
    }
    s > 0 && o.push(e[i].slice(0, s));
  }
  return o;
}
function Xg(e, t) {
  let n = -1;
  const r = [];
  let i;
  for (; ++n < e.length; ) {
    const s = e[n];
    let o;
    if (typeof s == "string")
      o = s;
    else switch (s) {
      case -5: {
        o = "\r";
        break;
      }
      case -4: {
        o = `
`;
        break;
      }
      case -3: {
        o = `\r
`;
        break;
      }
      case -2: {
        o = t ? " " : "	";
        break;
      }
      case -1: {
        if (!t && i) continue;
        o = " ";
        break;
      }
      default:
        o = String.fromCharCode(s);
    }
    i = s === -2, r.push(o);
  }
  return r.join("");
}
function Zg(e) {
  const r = {
    constructs: (
      /** @type {FullNormalizedExtension} */
      sl([Yg, ...(e || {}).extensions || []])
    ),
    content: i(pm),
    defined: [],
    document: i(gm),
    flow: i(Ng),
    lazy: {},
    string: i(Fg),
    text: i(Bg)
  };
  return r;
  function i(s) {
    return o;
    function o(a) {
      return Qg(r, s, a);
    }
  }
}
function eb(e) {
  for (; !cl(e); )
    ;
  return e;
}
const Vs = /[\0\t\n\r]/g;
function tb() {
  let e = 1, t = "", n = !0, r;
  return i;
  function i(s, o, a) {
    const l = [];
    let u, h, c, f, d;
    for (s = t + (typeof s == "string" ? s.toString() : new TextDecoder(o || void 0).decode(s)), c = 0, t = "", n && (s.charCodeAt(0) === 65279 && c++, n = void 0); c < s.length; ) {
      if (Vs.lastIndex = c, u = Vs.exec(s), f = u && u.index !== void 0 ? u.index : s.length, d = s.charCodeAt(f), !u) {
        t = s.slice(c);
        break;
      }
      if (d === 10 && c === f && r)
        l.push(-3), r = void 0;
      else
        switch (r && (l.push(-5), r = void 0), c < f && (l.push(s.slice(c, f)), e += f - c), d) {
          case 0: {
            l.push(65533), e++;
            break;
          }
          case 9: {
            for (h = Math.ceil(e / 4) * 4, l.push(-2); e++ < h; ) l.push(-1);
            break;
          }
          case 10: {
            l.push(-4), e = 1;
            break;
          }
          default:
            r = !0, e = 1;
        }
      c = f + 1;
    }
    return a && (r && l.push(-5), t && l.push(t), l.push(null)), l;
  }
}
const nb = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function rb(e) {
  return e.replace(nb, ib);
}
function ib(e, t, n) {
  if (t)
    return t;
  if (n.charCodeAt(0) === 35) {
    const i = n.charCodeAt(1), s = i === 120 || i === 88;
    return ol(n.slice(s ? 2 : 1), s ? 16 : 10);
  }
  return Mi(n) || e;
}
const gl = {}.hasOwnProperty;
function sb(e, t, n) {
  return t && typeof t == "object" && (n = t, t = void 0), ob(n)(eb(Zg(n).document().write(tb()(e, t, !0))));
}
function ob(e) {
  const t = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: s(Wi),
      autolinkProtocol: V,
      autolinkEmail: V,
      atxHeading: s(Hi),
      blockQuote: s(pt),
      characterEscape: V,
      characterReference: V,
      codeFenced: s(nn),
      codeFencedFenceInfo: o,
      codeFencedFenceMeta: o,
      codeIndented: s(nn, o),
      codeText: s(tu, o),
      codeTextData: V,
      data: V,
      codeFlowValue: V,
      definition: s(nu),
      definitionDestinationString: o,
      definitionLabelString: o,
      definitionTitleString: o,
      emphasis: s(ru),
      hardBreakEscape: s(qi),
      hardBreakTrailing: s(qi),
      htmlFlow: s(Ki, o),
      htmlFlowData: V,
      htmlText: s(Ki, o),
      htmlTextData: V,
      image: s(iu),
      label: o,
      link: s(Wi),
      listItem: s(su),
      listItemValue: f,
      listOrdered: s(Ji, c),
      listUnordered: s(Ji),
      paragraph: s(ou),
      reference: g,
      referenceString: o,
      resourceDestinationString: o,
      resourceTitleString: o,
      setextHeading: s(Hi),
      strong: s(au),
      thematicBreak: s(uu)
    },
    exit: {
      atxHeading: l(),
      atxHeadingSequence: A,
      autolink: l(),
      autolinkEmail: dt,
      autolinkProtocol: He,
      blockQuote: l(),
      characterEscapeValue: k,
      characterReferenceMarkerHexadecimal: Ye,
      characterReferenceMarkerNumeric: Ye,
      characterReferenceValue: Z,
      characterReference: Dt,
      codeFenced: l(x),
      codeFencedFence: y,
      codeFencedFenceInfo: d,
      codeFencedFenceMeta: p,
      codeFlowValue: k,
      codeIndented: l(b),
      codeText: l(T),
      codeTextData: k,
      data: k,
      definition: l(),
      definitionDestinationString: M,
      definitionLabelString: S,
      definitionTitleString: v,
      emphasis: l(),
      hardBreakEscape: l(D),
      hardBreakTrailing: l(D),
      htmlFlow: l(H),
      htmlFlowData: k,
      htmlText: l(N),
      htmlTextData: k,
      image: l(G),
      label: Ne,
      labelText: ye,
      lineEnding: R,
      link: l(K),
      listItem: l(),
      listOrdered: l(),
      listUnordered: l(),
      paragraph: l(),
      referenceString: we,
      resourceDestinationString: m,
      resourceTitleString: xe,
      resource: Oe,
      setextHeading: l($),
      setextHeadingLineSequence: F,
      setextHeadingText: _,
      strong: l(),
      thematicBreak: l()
    }
  };
  bl(t, (e || {}).mdastExtensions || []);
  const n = {};
  return r;
  function r(C) {
    let I = {
      type: "root",
      children: []
    };
    const L = {
      stack: [I],
      tokenStack: [],
      config: t,
      enter: a,
      exit: u,
      buffer: o,
      resume: h,
      data: n
    }, j = [];
    let W = -1;
    for (; ++W < C.length; )
      if (C[W][1].type === "listOrdered" || C[W][1].type === "listUnordered")
        if (C[W][0] === "enter")
          j.push(W);
        else {
          const ke = j.pop();
          W = i(C, ke, W);
        }
    for (W = -1; ++W < C.length; ) {
      const ke = t[C[W][0]];
      gl.call(ke, C[W][1].type) && ke[C[W][1].type].call(Object.assign({
        sliceSerialize: C[W][2].sliceSerialize
      }, L), C[W][1]);
    }
    if (L.tokenStack.length > 0) {
      const ke = L.tokenStack[L.tokenStack.length - 1];
      (ke[1] || Hs).call(L, void 0, ke[0]);
    }
    for (I.position = {
      start: qe(C.length > 0 ? C[0][1].start : {
        line: 1,
        column: 1,
        offset: 0
      }),
      end: qe(C.length > 0 ? C[C.length - 2][1].end : {
        line: 1,
        column: 1,
        offset: 0
      })
    }, W = -1; ++W < t.transforms.length; )
      I = t.transforms[W](I) || I;
    return I;
  }
  function i(C, I, L) {
    let j = I - 1, W = -1, ke = !1, Qe, Le, Mt, Pt;
    for (; ++j <= L; ) {
      const ae = C[j];
      switch (ae[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote": {
          ae[0] === "enter" ? W++ : W--, Pt = void 0;
          break;
        }
        case "lineEndingBlank": {
          ae[0] === "enter" && (Qe && !Pt && !W && !Mt && (Mt = j), Pt = void 0);
          break;
        }
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace":
          break;
        default:
          Pt = void 0;
      }
      if (!W && ae[0] === "enter" && ae[1].type === "listItemPrefix" || W === -1 && ae[0] === "exit" && (ae[1].type === "listUnordered" || ae[1].type === "listOrdered")) {
        if (Qe) {
          let mt = j;
          for (Le = void 0; mt--; ) {
            const Fe = C[mt];
            if (Fe[1].type === "lineEnding" || Fe[1].type === "lineEndingBlank") {
              if (Fe[0] === "exit") continue;
              Le && (C[Le][1].type = "lineEndingBlank", ke = !0), Fe[1].type = "lineEnding", Le = mt;
            } else if (!(Fe[1].type === "linePrefix" || Fe[1].type === "blockQuotePrefix" || Fe[1].type === "blockQuotePrefixWhitespace" || Fe[1].type === "blockQuoteMarker" || Fe[1].type === "listItemIndent")) break;
          }
          Mt && (!Le || Mt < Le) && (Qe._spread = !0), Qe.end = Object.assign({}, Le ? C[Le][1].start : ae[1].end), C.splice(Le || j, 0, ["exit", Qe, ae[2]]), j++, L++;
        }
        if (ae[1].type === "listItemPrefix") {
          const mt = {
            type: "listItem",
            _spread: !1,
            start: Object.assign({}, ae[1].start),
            // @ts-expect-error: we’ll add `end` in a second.
            end: void 0
          };
          Qe = mt, C.splice(j, 0, ["enter", mt, ae[2]]), j++, L++, Mt = void 0, Pt = !0;
        }
      }
    }
    return C[I][1]._spread = ke, L;
  }
  function s(C, I) {
    return L;
    function L(j) {
      a.call(this, C(j), j), I && I.call(this, j);
    }
  }
  function o() {
    this.stack.push({
      type: "fragment",
      children: []
    });
  }
  function a(C, I, L) {
    this.stack[this.stack.length - 1].children.push(C), this.stack.push(C), this.tokenStack.push([I, L || void 0]), C.position = {
      start: qe(I.start),
      // @ts-expect-error: `end` will be patched later.
      end: void 0
    };
  }
  function l(C) {
    return I;
    function I(L) {
      C && C.call(this, L), u.call(this, L);
    }
  }
  function u(C, I) {
    const L = this.stack.pop(), j = this.tokenStack.pop();
    if (j)
      j[0].type !== C.type && (I ? I.call(this, C, j[0]) : (j[1] || Hs).call(this, C, j[0]));
    else throw new Error("Cannot close `" + C.type + "` (" + jt({
      start: C.start,
      end: C.end
    }) + "): it’s not open");
    L.position.end = qe(C.end);
  }
  function h() {
    return Di(this.stack.pop());
  }
  function c() {
    this.data.expectingFirstListItemValue = !0;
  }
  function f(C) {
    if (this.data.expectingFirstListItemValue) {
      const I = this.stack[this.stack.length - 2];
      I.start = Number.parseInt(this.sliceSerialize(C), 10), this.data.expectingFirstListItemValue = void 0;
    }
  }
  function d() {
    const C = this.resume(), I = this.stack[this.stack.length - 1];
    I.lang = C;
  }
  function p() {
    const C = this.resume(), I = this.stack[this.stack.length - 1];
    I.meta = C;
  }
  function y() {
    this.data.flowCodeInside || (this.buffer(), this.data.flowCodeInside = !0);
  }
  function x() {
    const C = this.resume(), I = this.stack[this.stack.length - 1];
    I.value = C.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""), this.data.flowCodeInside = void 0;
  }
  function b() {
    const C = this.resume(), I = this.stack[this.stack.length - 1];
    I.value = C.replace(/(\r?\n|\r)$/g, "");
  }
  function S(C) {
    const I = this.resume(), L = this.stack[this.stack.length - 1];
    L.label = I, L.identifier = ve(this.sliceSerialize(C)).toLowerCase();
  }
  function v() {
    const C = this.resume(), I = this.stack[this.stack.length - 1];
    I.title = C;
  }
  function M() {
    const C = this.resume(), I = this.stack[this.stack.length - 1];
    I.url = C;
  }
  function A(C) {
    const I = this.stack[this.stack.length - 1];
    if (!I.depth) {
      const L = this.sliceSerialize(C).length;
      I.depth = L;
    }
  }
  function _() {
    this.data.setextHeadingSlurpLineEnding = !0;
  }
  function F(C) {
    const I = this.stack[this.stack.length - 1];
    I.depth = this.sliceSerialize(C).codePointAt(0) === 61 ? 1 : 2;
  }
  function $() {
    this.data.setextHeadingSlurpLineEnding = void 0;
  }
  function V(C) {
    const L = this.stack[this.stack.length - 1].children;
    let j = L[L.length - 1];
    (!j || j.type !== "text") && (j = lu(), j.position = {
      start: qe(C.start),
      // @ts-expect-error: we’ll add `end` later.
      end: void 0
    }, L.push(j)), this.stack.push(j);
  }
  function k(C) {
    const I = this.stack.pop();
    I.value += this.sliceSerialize(C), I.position.end = qe(C.end);
  }
  function R(C) {
    const I = this.stack[this.stack.length - 1];
    if (this.data.atHardBreak) {
      const L = I.children[I.children.length - 1];
      L.position.end = qe(C.end), this.data.atHardBreak = void 0;
      return;
    }
    !this.data.setextHeadingSlurpLineEnding && t.canContainEols.includes(I.type) && (V.call(this, C), k.call(this, C));
  }
  function D() {
    this.data.atHardBreak = !0;
  }
  function H() {
    const C = this.resume(), I = this.stack[this.stack.length - 1];
    I.value = C;
  }
  function N() {
    const C = this.resume(), I = this.stack[this.stack.length - 1];
    I.value = C;
  }
  function T() {
    const C = this.resume(), I = this.stack[this.stack.length - 1];
    I.value = C;
  }
  function K() {
    const C = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const I = this.data.referenceType || "shortcut";
      C.type += "Reference", C.referenceType = I, delete C.url, delete C.title;
    } else
      delete C.identifier, delete C.label;
    this.data.referenceType = void 0;
  }
  function G() {
    const C = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const I = this.data.referenceType || "shortcut";
      C.type += "Reference", C.referenceType = I, delete C.url, delete C.title;
    } else
      delete C.identifier, delete C.label;
    this.data.referenceType = void 0;
  }
  function ye(C) {
    const I = this.sliceSerialize(C), L = this.stack[this.stack.length - 2];
    L.label = rb(I), L.identifier = ve(I).toLowerCase();
  }
  function Ne() {
    const C = this.stack[this.stack.length - 1], I = this.resume(), L = this.stack[this.stack.length - 1];
    if (this.data.inReference = !0, L.type === "link") {
      const j = C.children;
      L.children = j;
    } else
      L.alt = I;
  }
  function m() {
    const C = this.resume(), I = this.stack[this.stack.length - 1];
    I.url = C;
  }
  function xe() {
    const C = this.resume(), I = this.stack[this.stack.length - 1];
    I.title = C;
  }
  function Oe() {
    this.data.inReference = void 0;
  }
  function g() {
    this.data.referenceType = "collapsed";
  }
  function we(C) {
    const I = this.resume(), L = this.stack[this.stack.length - 1];
    L.label = I, L.identifier = ve(this.sliceSerialize(C)).toLowerCase(), this.data.referenceType = "full";
  }
  function Ye(C) {
    this.data.characterReferenceType = C.type;
  }
  function Z(C) {
    const I = this.sliceSerialize(C), L = this.data.characterReferenceType;
    let j;
    L ? (j = ol(I, L === "characterReferenceMarkerNumeric" ? 10 : 16), this.data.characterReferenceType = void 0) : j = Mi(I);
    const W = this.stack[this.stack.length - 1];
    W.value += j;
  }
  function Dt(C) {
    const I = this.stack.pop();
    I.position.end = qe(C.end);
  }
  function He(C) {
    k.call(this, C);
    const I = this.stack[this.stack.length - 1];
    I.url = this.sliceSerialize(C);
  }
  function dt(C) {
    k.call(this, C);
    const I = this.stack[this.stack.length - 1];
    I.url = "mailto:" + this.sliceSerialize(C);
  }
  function pt() {
    return {
      type: "blockquote",
      children: []
    };
  }
  function nn() {
    return {
      type: "code",
      lang: null,
      meta: null,
      value: ""
    };
  }
  function tu() {
    return {
      type: "inlineCode",
      value: ""
    };
  }
  function nu() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: ""
    };
  }
  function ru() {
    return {
      type: "emphasis",
      children: []
    };
  }
  function Hi() {
    return {
      type: "heading",
      // @ts-expect-error `depth` will be set later.
      depth: 0,
      children: []
    };
  }
  function qi() {
    return {
      type: "break"
    };
  }
  function Ki() {
    return {
      type: "html",
      value: ""
    };
  }
  function iu() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null
    };
  }
  function Wi() {
    return {
      type: "link",
      title: null,
      url: "",
      children: []
    };
  }
  function Ji(C) {
    return {
      type: "list",
      ordered: C.type === "listOrdered",
      start: null,
      spread: C._spread,
      children: []
    };
  }
  function su(C) {
    return {
      type: "listItem",
      spread: C._spread,
      checked: null,
      children: []
    };
  }
  function ou() {
    return {
      type: "paragraph",
      children: []
    };
  }
  function au() {
    return {
      type: "strong",
      children: []
    };
  }
  function lu() {
    return {
      type: "text",
      value: ""
    };
  }
  function uu() {
    return {
      type: "thematicBreak"
    };
  }
}
function qe(e) {
  return {
    line: e.line,
    column: e.column,
    offset: e.offset
  };
}
function bl(e, t) {
  let n = -1;
  for (; ++n < t.length; ) {
    const r = t[n];
    Array.isArray(r) ? bl(e, r) : ab(e, r);
  }
}
function ab(e, t) {
  let n;
  for (n in t)
    if (gl.call(t, n))
      switch (n) {
        case "canContainEols": {
          const r = t[n];
          r && e[n].push(...r);
          break;
        }
        case "transforms": {
          const r = t[n];
          r && e[n].push(...r);
          break;
        }
        case "enter":
        case "exit": {
          const r = t[n];
          r && Object.assign(e[n], r);
          break;
        }
      }
}
function Hs(e, t) {
  throw e ? new Error("Cannot close `" + e.type + "` (" + jt({
    start: e.start,
    end: e.end
  }) + "): a different token (`" + t.type + "`, " + jt({
    start: t.start,
    end: t.end
  }) + ") is open") : new Error("Cannot close document, a token (`" + t.type + "`, " + jt({
    start: t.start,
    end: t.end
  }) + ") is still open");
}
function lb(e) {
  const t = this;
  t.parser = n;
  function n(r) {
    return sb(r, {
      ...t.data("settings"),
      ...e,
      // Note: these options are not in the readme.
      // The goal is for them to be set by plugins on `data` instead of being
      // passed by users.
      extensions: t.data("micromarkExtensions") || [],
      mdastExtensions: t.data("fromMarkdownExtensions") || []
    });
  }
}
function ub(e, t) {
  const n = {
    type: "element",
    tagName: "blockquote",
    properties: {},
    children: e.wrap(e.all(t), !0)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function cb(e, t) {
  const n = { type: "element", tagName: "br", properties: {}, children: [] };
  return e.patch(t, n), [e.applyData(t, n), { type: "text", value: `
` }];
}
function hb(e, t) {
  const n = t.value ? t.value + `
` : "", r = {}, i = t.lang ? t.lang.split(/\s+/) : [];
  i.length > 0 && (r.className = ["language-" + i[0]]);
  let s = {
    type: "element",
    tagName: "code",
    properties: r,
    children: [{ type: "text", value: n }]
  };
  return t.meta && (s.data = { meta: t.meta }), e.patch(t, s), s = e.applyData(t, s), s = { type: "element", tagName: "pre", properties: {}, children: [s] }, e.patch(t, s), s;
}
function fb(e, t) {
  const n = {
    type: "element",
    tagName: "del",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function db(e, t) {
  const n = {
    type: "element",
    tagName: "em",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function pb(e, t) {
  const n = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-", r = String(t.identifier).toUpperCase(), i = Rt(r.toLowerCase()), s = e.footnoteOrder.indexOf(r);
  let o, a = e.footnoteCounts.get(r);
  a === void 0 ? (a = 0, e.footnoteOrder.push(r), o = e.footnoteOrder.length) : o = s + 1, a += 1, e.footnoteCounts.set(r, a);
  const l = {
    type: "element",
    tagName: "a",
    properties: {
      href: "#" + n + "fn-" + i,
      id: n + "fnref-" + i + (a > 1 ? "-" + a : ""),
      dataFootnoteRef: !0,
      ariaDescribedBy: ["footnote-label"]
    },
    children: [{ type: "text", value: String(o) }]
  };
  e.patch(t, l);
  const u = {
    type: "element",
    tagName: "sup",
    properties: {},
    children: [l]
  };
  return e.patch(t, u), e.applyData(t, u);
}
function mb(e, t) {
  const n = {
    type: "element",
    tagName: "h" + t.depth,
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function gb(e, t) {
  if (e.options.allowDangerousHtml) {
    const n = { type: "raw", value: t.value };
    return e.patch(t, n), e.applyData(t, n);
  }
}
function yl(e, t) {
  const n = t.referenceType;
  let r = "]";
  if (n === "collapsed" ? r += "[]" : n === "full" && (r += "[" + (t.label || t.identifier) + "]"), t.type === "imageReference")
    return [{ type: "text", value: "![" + t.alt + r }];
  const i = e.all(t), s = i[0];
  s && s.type === "text" ? s.value = "[" + s.value : i.unshift({ type: "text", value: "[" });
  const o = i[i.length - 1];
  return o && o.type === "text" ? o.value += r : i.push({ type: "text", value: r }), i;
}
function bb(e, t) {
  const n = String(t.identifier).toUpperCase(), r = e.definitionById.get(n);
  if (!r)
    return yl(e, t);
  const i = { src: Rt(r.url || ""), alt: t.alt };
  r.title !== null && r.title !== void 0 && (i.title = r.title);
  const s = { type: "element", tagName: "img", properties: i, children: [] };
  return e.patch(t, s), e.applyData(t, s);
}
function yb(e, t) {
  const n = { src: Rt(t.url) };
  t.alt !== null && t.alt !== void 0 && (n.alt = t.alt), t.title !== null && t.title !== void 0 && (n.title = t.title);
  const r = { type: "element", tagName: "img", properties: n, children: [] };
  return e.patch(t, r), e.applyData(t, r);
}
function xb(e, t) {
  const n = { type: "text", value: t.value.replace(/\r?\n|\r/g, " ") };
  e.patch(t, n);
  const r = {
    type: "element",
    tagName: "code",
    properties: {},
    children: [n]
  };
  return e.patch(t, r), e.applyData(t, r);
}
function wb(e, t) {
  const n = String(t.identifier).toUpperCase(), r = e.definitionById.get(n);
  if (!r)
    return yl(e, t);
  const i = { href: Rt(r.url || "") };
  r.title !== null && r.title !== void 0 && (i.title = r.title);
  const s = {
    type: "element",
    tagName: "a",
    properties: i,
    children: e.all(t)
  };
  return e.patch(t, s), e.applyData(t, s);
}
function kb(e, t) {
  const n = { href: Rt(t.url) };
  t.title !== null && t.title !== void 0 && (n.title = t.title);
  const r = {
    type: "element",
    tagName: "a",
    properties: n,
    children: e.all(t)
  };
  return e.patch(t, r), e.applyData(t, r);
}
function _b(e, t, n) {
  const r = e.all(t), i = n ? Sb(n) : xl(t), s = {}, o = [];
  if (typeof t.checked == "boolean") {
    const h = r[0];
    let c;
    h && h.type === "element" && h.tagName === "p" ? c = h : (c = { type: "element", tagName: "p", properties: {}, children: [] }, r.unshift(c)), c.children.length > 0 && c.children.unshift({ type: "text", value: " " }), c.children.unshift({
      type: "element",
      tagName: "input",
      properties: { type: "checkbox", checked: t.checked, disabled: !0 },
      children: []
    }), s.className = ["task-list-item"];
  }
  let a = -1;
  for (; ++a < r.length; ) {
    const h = r[a];
    (i || a !== 0 || h.type !== "element" || h.tagName !== "p") && o.push({ type: "text", value: `
` }), h.type === "element" && h.tagName === "p" && !i ? o.push(...h.children) : o.push(h);
  }
  const l = r[r.length - 1];
  l && (i || l.type !== "element" || l.tagName !== "p") && o.push({ type: "text", value: `
` });
  const u = { type: "element", tagName: "li", properties: s, children: o };
  return e.patch(t, u), e.applyData(t, u);
}
function Sb(e) {
  let t = !1;
  if (e.type === "list") {
    t = e.spread || !1;
    const n = e.children;
    let r = -1;
    for (; !t && ++r < n.length; )
      t = xl(n[r]);
  }
  return t;
}
function xl(e) {
  const t = e.spread;
  return t ?? e.children.length > 1;
}
function Cb(e, t) {
  const n = {}, r = e.all(t);
  let i = -1;
  for (typeof t.start == "number" && t.start !== 1 && (n.start = t.start); ++i < r.length; ) {
    const o = r[i];
    if (o.type === "element" && o.tagName === "li" && o.properties && Array.isArray(o.properties.className) && o.properties.className.includes("task-list-item")) {
      n.className = ["contains-task-list"];
      break;
    }
  }
  const s = {
    type: "element",
    tagName: t.ordered ? "ol" : "ul",
    properties: n,
    children: e.wrap(r, !0)
  };
  return e.patch(t, s), e.applyData(t, s);
}
function vb(e, t) {
  const n = {
    type: "element",
    tagName: "p",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function Eb(e, t) {
  const n = { type: "root", children: e.wrap(e.all(t)) };
  return e.patch(t, n), e.applyData(t, n);
}
function Ib(e, t) {
  const n = {
    type: "element",
    tagName: "strong",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function Ab(e, t) {
  const n = e.all(t), r = n.shift(), i = [];
  if (r) {
    const o = {
      type: "element",
      tagName: "thead",
      properties: {},
      children: e.wrap([r], !0)
    };
    e.patch(t.children[0], o), i.push(o);
  }
  if (n.length > 0) {
    const o = {
      type: "element",
      tagName: "tbody",
      properties: {},
      children: e.wrap(n, !0)
    }, a = Ii(t.children[1]), l = Xa(t.children[t.children.length - 1]);
    a && l && (o.position = { start: a, end: l }), i.push(o);
  }
  const s = {
    type: "element",
    tagName: "table",
    properties: {},
    children: e.wrap(i, !0)
  };
  return e.patch(t, s), e.applyData(t, s);
}
function Tb(e, t, n) {
  const r = n ? n.children : void 0, s = (r ? r.indexOf(t) : 1) === 0 ? "th" : "td", o = n && n.type === "table" ? n.align : void 0, a = o ? o.length : t.children.length;
  let l = -1;
  const u = [];
  for (; ++l < a; ) {
    const c = t.children[l], f = {}, d = o ? o[l] : void 0;
    d && (f.align = d);
    let p = { type: "element", tagName: s, properties: f, children: [] };
    c && (p.children = e.all(c), e.patch(c, p), p = e.applyData(c, p)), u.push(p);
  }
  const h = {
    type: "element",
    tagName: "tr",
    properties: {},
    children: e.wrap(u, !0)
  };
  return e.patch(t, h), e.applyData(t, h);
}
function Rb(e, t) {
  const n = {
    type: "element",
    tagName: "td",
    // Assume body cell.
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
const qs = 9, Ks = 32;
function Db(e) {
  const t = String(e), n = /\r?\n|\r/g;
  let r = n.exec(t), i = 0;
  const s = [];
  for (; r; )
    s.push(
      Ws(t.slice(i, r.index), i > 0, !0),
      r[0]
    ), i = r.index + r[0].length, r = n.exec(t);
  return s.push(Ws(t.slice(i), i > 0, !1)), s.join("");
}
function Ws(e, t, n) {
  let r = 0, i = e.length;
  if (t) {
    let s = e.codePointAt(r);
    for (; s === qs || s === Ks; )
      r++, s = e.codePointAt(r);
  }
  if (n) {
    let s = e.codePointAt(i - 1);
    for (; s === qs || s === Ks; )
      i--, s = e.codePointAt(i - 1);
  }
  return i > r ? e.slice(r, i) : "";
}
function Mb(e, t) {
  const n = { type: "text", value: Db(String(t.value)) };
  return e.patch(t, n), e.applyData(t, n);
}
function Pb(e, t) {
  const n = {
    type: "element",
    tagName: "hr",
    properties: {},
    children: []
  };
  return e.patch(t, n), e.applyData(t, n);
}
const Nb = {
  blockquote: ub,
  break: cb,
  code: hb,
  delete: fb,
  emphasis: db,
  footnoteReference: pb,
  heading: mb,
  html: gb,
  imageReference: bb,
  image: yb,
  inlineCode: xb,
  linkReference: wb,
  link: kb,
  listItem: _b,
  list: Cb,
  paragraph: vb,
  // @ts-expect-error: root is different, but hard to type.
  root: Eb,
  strong: Ib,
  table: Ab,
  tableCell: Rb,
  tableRow: Tb,
  text: Mb,
  thematicBreak: Pb,
  toml: hn,
  yaml: hn,
  definition: hn,
  footnoteDefinition: hn
};
function hn() {
}
const wl = -1, Zn = 0, Vt = 1, Tn = 2, Ni = 3, Oi = 4, Li = 5, Fi = 6, kl = 7, _l = 8, Sl = typeof self == "object" ? self : globalThis, Js = (e, t) => {
  switch (e) {
    case "Function":
    case "SharedWorker":
    case "Worker":
    case "eval":
    case "setInterval":
    case "setTimeout":
      throw new TypeError("unable to deserialize " + e);
  }
  return new Sl[e](t);
}, Ob = (e, t) => {
  const n = (i, s) => (e.set(s, i), i), r = (i) => {
    if (e.has(i))
      return e.get(i);
    const [s, o] = t[i];
    switch (s) {
      case Zn:
      case wl:
        return n(o, i);
      case Vt: {
        const a = n([], i);
        for (const l of o)
          a.push(r(l));
        return a;
      }
      case Tn: {
        const a = n({}, i);
        for (const [l, u] of o)
          a[r(l)] = r(u);
        return a;
      }
      case Ni:
        return n(new Date(o), i);
      case Oi: {
        const { source: a, flags: l } = o;
        return n(new RegExp(a, l), i);
      }
      case Li: {
        const a = n(/* @__PURE__ */ new Map(), i);
        for (const [l, u] of o)
          a.set(r(l), r(u));
        return a;
      }
      case Fi: {
        const a = n(/* @__PURE__ */ new Set(), i);
        for (const l of o)
          a.add(r(l));
        return a;
      }
      case kl: {
        const { name: a, message: l } = o;
        return n(
          typeof Sl[a] == "function" ? Js(a, l) : new Error(l),
          i
        );
      }
      case _l:
        return n(BigInt(o), i);
      case "BigInt":
        return n(Object(BigInt(o)), i);
      case "ArrayBuffer":
        return n(new Uint8Array(o).buffer, o);
      case "DataView": {
        const { buffer: a } = new Uint8Array(o);
        return n(new DataView(a), o);
      }
    }
    return n(Js(s, o), i);
  };
  return r;
}, Ys = (e) => Ob(/* @__PURE__ */ new Map(), e)(0), et = "", { toString: Lb } = {}, { keys: Fb } = Object, Bt = (e) => {
  const t = typeof e;
  if (t !== "object" || !e)
    return [Zn, t];
  const n = Lb.call(e).slice(8, -1);
  switch (n) {
    case "Array":
      return [Vt, et];
    case "Object":
      return [Tn, et];
    case "Date":
      return [Ni, et];
    case "RegExp":
      return [Oi, et];
    case "Map":
      return [Li, et];
    case "Set":
      return [Fi, et];
    case "DataView":
      return [Vt, n];
  }
  return n.includes("Array") ? [Vt, n] : e instanceof Error ? [kl, e.name || "Error"] : [Tn, n];
}, fn = ([e, t]) => e === Zn && (t === "function" || t === "symbol"), Bb = (e, t, n, r) => {
  const i = (o, a) => {
    const l = r.push(o) - 1;
    return n.set(a, l), l;
  }, s = (o) => {
    if (n.has(o))
      return n.get(o);
    let [a, l] = Bt(o);
    switch (a) {
      case Zn: {
        let h = o;
        switch (l) {
          case "bigint":
            a = _l, h = o.toString();
            break;
          case "function":
          case "symbol":
            if (e)
              throw new TypeError("unable to serialize " + l);
            h = null;
            break;
          case "undefined":
            return i([wl], o);
        }
        return i([a, h], o);
      }
      case Vt: {
        if (l) {
          let f = o;
          return l === "DataView" ? f = new Uint8Array(o.buffer) : l === "ArrayBuffer" && (f = new Uint8Array(o)), i([l, [...f]], o);
        }
        const h = [], c = i([a, h], o);
        for (const f of o)
          h.push(s(f));
        return c;
      }
      case Tn: {
        if (l)
          switch (l) {
            case "BigInt":
              return i([l, o.toString()], o);
            case "Boolean":
            case "Number":
            case "String":
              return i([l, o.valueOf()], o);
          }
        if (t && "toJSON" in o)
          return s(o.toJSON());
        const h = [], c = i([a, h], o);
        for (const f of Fb(o))
          (e || !fn(Bt(o[f]))) && h.push([s(f), s(o[f])]);
        return c;
      }
      case Ni:
        return i([a, isNaN(o.getTime()) ? et : o.toISOString()], o);
      case Oi: {
        const { source: h, flags: c } = o;
        return i([a, { source: h, flags: c }], o);
      }
      case Li: {
        const h = [], c = i([a, h], o);
        for (const [f, d] of o)
          (e || !(fn(Bt(f)) || fn(Bt(d)))) && h.push([s(f), s(d)]);
        return c;
      }
      case Fi: {
        const h = [], c = i([a, h], o);
        for (const f of o)
          (e || !fn(Bt(f))) && h.push(s(f));
        return c;
      }
    }
    const { message: u } = o;
    return i([a, { name: l, message: u }], o);
  };
  return s;
}, Qs = (e, { json: t, lossy: n } = {}) => {
  const r = [];
  return Bb(!(t || n), !!t, /* @__PURE__ */ new Map(), r)(e), r;
}, Rn = typeof structuredClone == "function" ? (
  /* c8 ignore start */
  (e, t) => t && ("json" in t || "lossy" in t) ? Ys(Qs(e, t)) : structuredClone(e)
) : (e, t) => Ys(Qs(e, t));
function zb(e, t) {
  const n = [{ type: "text", value: "↩" }];
  return t > 1 && n.push({
    type: "element",
    tagName: "sup",
    properties: {},
    children: [{ type: "text", value: String(t) }]
  }), n;
}
function $b(e, t) {
  return "Back to reference " + (e + 1) + (t > 1 ? "-" + t : "");
}
function jb(e) {
  const t = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-", n = e.options.footnoteBackContent || zb, r = e.options.footnoteBackLabel || $b, i = e.options.footnoteLabel || "Footnotes", s = e.options.footnoteLabelTagName || "h2", o = e.options.footnoteLabelProperties || {
    className: ["sr-only"]
  }, a = [];
  let l = -1;
  for (; ++l < e.footnoteOrder.length; ) {
    const u = e.footnoteById.get(
      e.footnoteOrder[l]
    );
    if (!u)
      continue;
    const h = e.all(u), c = String(u.identifier).toUpperCase(), f = Rt(c.toLowerCase());
    let d = 0;
    const p = [], y = e.footnoteCounts.get(c);
    for (; y !== void 0 && ++d <= y; ) {
      p.length > 0 && p.push({ type: "text", value: " " });
      let S = typeof n == "string" ? n : n(l, d);
      typeof S == "string" && (S = { type: "text", value: S }), p.push({
        type: "element",
        tagName: "a",
        properties: {
          href: "#" + t + "fnref-" + f + (d > 1 ? "-" + d : ""),
          dataFootnoteBackref: "",
          ariaLabel: typeof r == "string" ? r : r(l, d),
          className: ["data-footnote-backref"]
        },
        children: Array.isArray(S) ? S : [S]
      });
    }
    const x = h[h.length - 1];
    if (x && x.type === "element" && x.tagName === "p") {
      const S = x.children[x.children.length - 1];
      S && S.type === "text" ? S.value += " " : x.children.push({ type: "text", value: " " }), x.children.push(...p);
    } else
      h.push(...p);
    const b = {
      type: "element",
      tagName: "li",
      properties: { id: t + "fn-" + f },
      children: e.wrap(h, !0)
    };
    e.patch(u, b), a.push(b);
  }
  if (a.length !== 0)
    return {
      type: "element",
      tagName: "section",
      properties: { dataFootnotes: !0, className: ["footnotes"] },
      children: [
        {
          type: "element",
          tagName: s,
          properties: {
            ...Rn(o),
            id: "footnote-label"
          },
          children: [{ type: "text", value: i }]
        },
        { type: "text", value: `
` },
        {
          type: "element",
          tagName: "ol",
          properties: {},
          children: e.wrap(a, !0)
        },
        { type: "text", value: `
` }
      ]
    };
}
const er = (
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
  (function(e) {
    if (e == null)
      return qb;
    if (typeof e == "function")
      return tr(e);
    if (typeof e == "object")
      return Array.isArray(e) ? Ub(e) : (
        // Cast because `ReadonlyArray` goes into the above but `isArray`
        // narrows to `Array`.
        Vb(
          /** @type {Props} */
          e
        )
      );
    if (typeof e == "string")
      return Hb(e);
    throw new Error("Expected function, string, or object as test");
  })
);
function Ub(e) {
  const t = [];
  let n = -1;
  for (; ++n < e.length; )
    t[n] = er(e[n]);
  return tr(r);
  function r(...i) {
    let s = -1;
    for (; ++s < t.length; )
      if (t[s].apply(this, i)) return !0;
    return !1;
  }
}
function Vb(e) {
  const t = (
    /** @type {Record<string, unknown>} */
    e
  );
  return tr(n);
  function n(r) {
    const i = (
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      r
    );
    let s;
    for (s in e)
      if (i[s] !== t[s]) return !1;
    return !0;
  }
}
function Hb(e) {
  return tr(t);
  function t(n) {
    return n && n.type === e;
  }
}
function tr(e) {
  return t;
  function t(n, r, i) {
    return !!(Kb(n) && e.call(
      this,
      n,
      typeof r == "number" ? r : void 0,
      i || void 0
    ));
  }
}
function qb() {
  return !0;
}
function Kb(e) {
  return e !== null && typeof e == "object" && "type" in e;
}
const Cl = [], Wb = !0, Wr = !1, Jb = "skip";
function vl(e, t, n, r) {
  let i;
  typeof t == "function" && typeof n != "function" ? (r = n, n = t) : i = t;
  const s = er(i), o = r ? -1 : 1;
  a(e, void 0, [])();
  function a(l, u, h) {
    const c = (
      /** @type {Record<string, unknown>} */
      l && typeof l == "object" ? l : {}
    );
    if (typeof c.type == "string") {
      const d = (
        // `hast`
        typeof c.tagName == "string" ? c.tagName : (
          // `xast`
          typeof c.name == "string" ? c.name : void 0
        )
      );
      Object.defineProperty(f, "name", {
        value: "node (" + (l.type + (d ? "<" + d + ">" : "")) + ")"
      });
    }
    return f;
    function f() {
      let d = Cl, p, y, x;
      if ((!t || s(l, u, h[h.length - 1] || void 0)) && (d = Yb(n(l, h)), d[0] === Wr))
        return d;
      if ("children" in l && l.children) {
        const b = (
          /** @type {UnistParent} */
          l
        );
        if (b.children && d[0] !== Jb)
          for (y = (r ? b.children.length : -1) + o, x = h.concat(b); y > -1 && y < b.children.length; ) {
            const S = b.children[y];
            if (p = a(S, y, x)(), p[0] === Wr)
              return p;
            y = typeof p[1] == "number" ? p[1] : y + o;
          }
      }
      return d;
    }
  }
}
function Yb(e) {
  return Array.isArray(e) ? e : typeof e == "number" ? [Wb, e] : e == null ? Cl : [e];
}
function Bi(e, t, n, r) {
  let i, s, o;
  typeof t == "function" && typeof n != "function" ? (s = void 0, o = t, i = n) : (s = t, o = n, i = r), vl(e, s, a, i);
  function a(l, u) {
    const h = u[u.length - 1], c = h ? h.children.indexOf(l) : void 0;
    return o(l, c, h);
  }
}
const Jr = {}.hasOwnProperty, Qb = {};
function Gb(e, t) {
  const n = t || Qb, r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), o = { ...Nb, ...n.handlers }, a = {
    all: u,
    applyData: Zb,
    definitionById: r,
    footnoteById: i,
    footnoteCounts: s,
    footnoteOrder: [],
    handlers: o,
    one: l,
    options: n,
    patch: Xb,
    wrap: ty
  };
  return Bi(e, function(h) {
    if (h.type === "definition" || h.type === "footnoteDefinition") {
      const c = h.type === "definition" ? r : i, f = String(h.identifier).toUpperCase();
      c.has(f) || c.set(f, h);
    }
  }), a;
  function l(h, c) {
    const f = h.type, d = a.handlers[f];
    if (Jr.call(a.handlers, f) && d)
      return d(a, h, c);
    if (a.options.passThrough && a.options.passThrough.includes(f)) {
      if ("children" in h) {
        const { children: y, ...x } = h, b = Rn(x);
        return b.children = a.all(h), b;
      }
      return Rn(h);
    }
    return (a.options.unknownHandler || ey)(a, h, c);
  }
  function u(h) {
    const c = [];
    if ("children" in h) {
      const f = h.children;
      let d = -1;
      for (; ++d < f.length; ) {
        const p = a.one(f[d], h);
        if (p) {
          if (d && f[d - 1].type === "break" && (!Array.isArray(p) && p.type === "text" && (p.value = Gs(p.value)), !Array.isArray(p) && p.type === "element")) {
            const y = p.children[0];
            y && y.type === "text" && (y.value = Gs(y.value));
          }
          Array.isArray(p) ? c.push(...p) : c.push(p);
        }
      }
    }
    return c;
  }
}
function Xb(e, t) {
  e.position && (t.position = $p(e));
}
function Zb(e, t) {
  let n = t;
  if (e && e.data) {
    const r = e.data.hName, i = e.data.hChildren, s = e.data.hProperties;
    if (typeof r == "string")
      if (n.type === "element")
        n.tagName = r;
      else {
        const o = "children" in n ? n.children : [n];
        n = { type: "element", tagName: r, properties: {}, children: o };
      }
    n.type === "element" && s && Object.assign(n.properties, Rn(s)), "children" in n && n.children && i !== null && i !== void 0 && (n.children = i);
  }
  return n;
}
function ey(e, t) {
  const n = t.data || {}, r = "value" in t && !(Jr.call(n, "hProperties") || Jr.call(n, "hChildren")) ? { type: "text", value: t.value } : {
    type: "element",
    tagName: "div",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, r), e.applyData(t, r);
}
function ty(e, t) {
  const n = [];
  let r = -1;
  for (t && n.push({ type: "text", value: `
` }); ++r < e.length; )
    r && n.push({ type: "text", value: `
` }), n.push(e[r]);
  return t && e.length > 0 && n.push({ type: "text", value: `
` }), n;
}
function Gs(e) {
  let t = 0, n = e.charCodeAt(t);
  for (; n === 9 || n === 32; )
    t++, n = e.charCodeAt(t);
  return e.slice(t);
}
function Xs(e, t) {
  const n = Gb(e, t), r = n.one(e, void 0), i = jb(n), s = Array.isArray(r) ? { type: "root", children: r } : r || { type: "root", children: [] };
  return i && s.children.push({ type: "text", value: `
` }, i), s;
}
function ny(e, t) {
  return e && "run" in e ? async function(n, r) {
    const i = (
      /** @type {HastRoot} */
      Xs(n, { file: r, ...t })
    );
    await e.run(i, r);
  } : function(n, r) {
    return (
      /** @type {HastRoot} */
      Xs(n, { file: r, ...e || t })
    );
  };
}
function Zs(e) {
  if (e)
    throw e;
}
var yr, eo;
function ry() {
  if (eo) return yr;
  eo = 1;
  var e = Object.prototype.hasOwnProperty, t = Object.prototype.toString, n = Object.defineProperty, r = Object.getOwnPropertyDescriptor, i = function(u) {
    return typeof Array.isArray == "function" ? Array.isArray(u) : t.call(u) === "[object Array]";
  }, s = function(u) {
    if (!u || t.call(u) !== "[object Object]")
      return !1;
    var h = e.call(u, "constructor"), c = u.constructor && u.constructor.prototype && e.call(u.constructor.prototype, "isPrototypeOf");
    if (u.constructor && !h && !c)
      return !1;
    var f;
    for (f in u)
      ;
    return typeof f > "u" || e.call(u, f);
  }, o = function(u, h) {
    n && h.name === "__proto__" ? n(u, h.name, {
      enumerable: !0,
      configurable: !0,
      value: h.newValue,
      writable: !0
    }) : u[h.name] = h.newValue;
  }, a = function(u, h) {
    if (h === "__proto__")
      if (e.call(u, h)) {
        if (r)
          return r(u, h).value;
      } else return;
    return u[h];
  };
  return yr = function l() {
    var u, h, c, f, d, p, y = arguments[0], x = 1, b = arguments.length, S = !1;
    for (typeof y == "boolean" && (S = y, y = arguments[1] || {}, x = 2), (y == null || typeof y != "object" && typeof y != "function") && (y = {}); x < b; ++x)
      if (u = arguments[x], u != null)
        for (h in u)
          c = a(y, h), f = a(u, h), y !== f && (S && f && (s(f) || (d = i(f))) ? (d ? (d = !1, p = c && i(c) ? c : []) : p = c && s(c) ? c : {}, o(y, { name: h, newValue: l(S, p, f) })) : typeof f < "u" && o(y, { name: h, newValue: f }));
    return y;
  }, yr;
}
var iy = ry();
const xr = /* @__PURE__ */ jn(iy);
function Yr(e) {
  if (typeof e != "object" || e === null)
    return !1;
  const t = Object.getPrototypeOf(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
function sy() {
  const e = [], t = { run: n, use: r };
  return t;
  function n(...i) {
    let s = -1;
    const o = i.pop();
    if (typeof o != "function")
      throw new TypeError("Expected function as last argument, not " + o);
    a(null, ...i);
    function a(l, ...u) {
      const h = e[++s];
      let c = -1;
      if (l) {
        o(l);
        return;
      }
      for (; ++c < i.length; )
        (u[c] === null || u[c] === void 0) && (u[c] = i[c]);
      i = u, h ? oy(h, a)(...u) : o(null, ...u);
    }
  }
  function r(i) {
    if (typeof i != "function")
      throw new TypeError(
        "Expected `middelware` to be a function, not " + i
      );
    return e.push(i), t;
  }
}
function oy(e, t) {
  let n;
  return r;
  function r(...o) {
    const a = e.length > o.length;
    let l;
    a && o.push(i);
    try {
      l = e.apply(this, o);
    } catch (u) {
      const h = (
        /** @type {Error} */
        u
      );
      if (a && n)
        throw h;
      return i(h);
    }
    a || (l && l.then && typeof l.then == "function" ? l.then(s, i) : l instanceof Error ? i(l) : s(l));
  }
  function i(o, ...a) {
    n || (n = !0, t(o, ...a));
  }
  function s(o) {
    i(null, o);
  }
}
const Ie = { basename: ay, dirname: ly, extname: uy, join: cy, sep: "/" };
function ay(e, t) {
  if (t !== void 0 && typeof t != "string")
    throw new TypeError('"ext" argument must be a string');
  tn(e);
  let n = 0, r = -1, i = e.length, s;
  if (t === void 0 || t.length === 0 || t.length > e.length) {
    for (; i--; )
      if (e.codePointAt(i) === 47) {
        if (s) {
          n = i + 1;
          break;
        }
      } else r < 0 && (s = !0, r = i + 1);
    return r < 0 ? "" : e.slice(n, r);
  }
  if (t === e)
    return "";
  let o = -1, a = t.length - 1;
  for (; i--; )
    if (e.codePointAt(i) === 47) {
      if (s) {
        n = i + 1;
        break;
      }
    } else
      o < 0 && (s = !0, o = i + 1), a > -1 && (e.codePointAt(i) === t.codePointAt(a--) ? a < 0 && (r = i) : (a = -1, r = o));
  return n === r ? r = o : r < 0 && (r = e.length), e.slice(n, r);
}
function ly(e) {
  if (tn(e), e.length === 0)
    return ".";
  let t = -1, n = e.length, r;
  for (; --n; )
    if (e.codePointAt(n) === 47) {
      if (r) {
        t = n;
        break;
      }
    } else r || (r = !0);
  return t < 0 ? e.codePointAt(0) === 47 ? "/" : "." : t === 1 && e.codePointAt(0) === 47 ? "//" : e.slice(0, t);
}
function uy(e) {
  tn(e);
  let t = e.length, n = -1, r = 0, i = -1, s = 0, o;
  for (; t--; ) {
    const a = e.codePointAt(t);
    if (a === 47) {
      if (o) {
        r = t + 1;
        break;
      }
      continue;
    }
    n < 0 && (o = !0, n = t + 1), a === 46 ? i < 0 ? i = t : s !== 1 && (s = 1) : i > -1 && (s = -1);
  }
  return i < 0 || n < 0 || // We saw a non-dot character immediately before the dot.
  s === 0 || // The (right-most) trimmed path component is exactly `..`.
  s === 1 && i === n - 1 && i === r + 1 ? "" : e.slice(i, n);
}
function cy(...e) {
  let t = -1, n;
  for (; ++t < e.length; )
    tn(e[t]), e[t] && (n = n === void 0 ? e[t] : n + "/" + e[t]);
  return n === void 0 ? "." : hy(n);
}
function hy(e) {
  tn(e);
  const t = e.codePointAt(0) === 47;
  let n = fy(e, !t);
  return n.length === 0 && !t && (n = "."), n.length > 0 && e.codePointAt(e.length - 1) === 47 && (n += "/"), t ? "/" + n : n;
}
function fy(e, t) {
  let n = "", r = 0, i = -1, s = 0, o = -1, a, l;
  for (; ++o <= e.length; ) {
    if (o < e.length)
      a = e.codePointAt(o);
    else {
      if (a === 47)
        break;
      a = 47;
    }
    if (a === 47) {
      if (!(i === o - 1 || s === 1)) if (i !== o - 1 && s === 2) {
        if (n.length < 2 || r !== 2 || n.codePointAt(n.length - 1) !== 46 || n.codePointAt(n.length - 2) !== 46) {
          if (n.length > 2) {
            if (l = n.lastIndexOf("/"), l !== n.length - 1) {
              l < 0 ? (n = "", r = 0) : (n = n.slice(0, l), r = n.length - 1 - n.lastIndexOf("/")), i = o, s = 0;
              continue;
            }
          } else if (n.length > 0) {
            n = "", r = 0, i = o, s = 0;
            continue;
          }
        }
        t && (n = n.length > 0 ? n + "/.." : "..", r = 2);
      } else
        n.length > 0 ? n += "/" + e.slice(i + 1, o) : n = e.slice(i + 1, o), r = o - i - 1;
      i = o, s = 0;
    } else a === 46 && s > -1 ? s++ : s = -1;
  }
  return n;
}
function tn(e) {
  if (typeof e != "string")
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(e)
    );
}
const dy = { cwd: py };
function py() {
  return "/";
}
function Qr(e) {
  return !!(e !== null && typeof e == "object" && "href" in e && e.href && "protocol" in e && e.protocol && // @ts-expect-error: indexing is fine.
  e.auth === void 0);
}
function my(e) {
  if (typeof e == "string")
    e = new URL(e);
  else if (!Qr(e)) {
    const t = new TypeError(
      'The "path" argument must be of type string or an instance of URL. Received `' + e + "`"
    );
    throw t.code = "ERR_INVALID_ARG_TYPE", t;
  }
  if (e.protocol !== "file:") {
    const t = new TypeError("The URL must be of scheme file");
    throw t.code = "ERR_INVALID_URL_SCHEME", t;
  }
  return gy(e);
}
function gy(e) {
  if (e.hostname !== "") {
    const r = new TypeError(
      'File URL host must be "localhost" or empty on darwin'
    );
    throw r.code = "ERR_INVALID_FILE_URL_HOST", r;
  }
  const t = e.pathname;
  let n = -1;
  for (; ++n < t.length; )
    if (t.codePointAt(n) === 37 && t.codePointAt(n + 1) === 50) {
      const r = t.codePointAt(n + 2);
      if (r === 70 || r === 102) {
        const i = new TypeError(
          "File URL path must not include encoded / characters"
        );
        throw i.code = "ERR_INVALID_FILE_URL_PATH", i;
      }
    }
  return decodeURIComponent(t);
}
const wr = (
  /** @type {const} */
  [
    "history",
    "path",
    "basename",
    "stem",
    "extname",
    "dirname"
  ]
);
class El {
  /**
   * Create a new virtual file.
   *
   * `options` is treated as:
   *
   * *   `string` or `Uint8Array` — `{value: options}`
   * *   `URL` — `{path: options}`
   * *   `VFile` — shallow copies its data over to the new file
   * *   `object` — all fields are shallow copied over to the new file
   *
   * Path related fields are set in the following order (least specific to
   * most specific): `history`, `path`, `basename`, `stem`, `extname`,
   * `dirname`.
   *
   * You cannot set `dirname` or `extname` without setting either `history`,
   * `path`, `basename`, or `stem` too.
   *
   * @param {Compatible | null | undefined} [value]
   *   File value.
   * @returns
   *   New instance.
   */
  constructor(t) {
    let n;
    t ? Qr(t) ? n = { path: t } : typeof t == "string" || by(t) ? n = { value: t } : n = t : n = {}, this.cwd = "cwd" in n ? "" : dy.cwd(), this.data = {}, this.history = [], this.messages = [], this.value, this.map, this.result, this.stored;
    let r = -1;
    for (; ++r < wr.length; ) {
      const s = wr[r];
      s in n && n[s] !== void 0 && n[s] !== null && (this[s] = s === "history" ? [...n[s]] : n[s]);
    }
    let i;
    for (i in n)
      wr.includes(i) || (this[i] = n[i]);
  }
  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   *
   * @returns {string | undefined}
   *   Basename.
   */
  get basename() {
    return typeof this.path == "string" ? Ie.basename(this.path) : void 0;
  }
  /**
   * Set basename (including extname) (`'index.min.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} basename
   *   Basename.
   * @returns {undefined}
   *   Nothing.
   */
  set basename(t) {
    _r(t, "basename"), kr(t, "basename"), this.path = Ie.join(this.dirname || "", t);
  }
  /**
   * Get the parent path (example: `'~'`).
   *
   * @returns {string | undefined}
   *   Dirname.
   */
  get dirname() {
    return typeof this.path == "string" ? Ie.dirname(this.path) : void 0;
  }
  /**
   * Set the parent path (example: `'~'`).
   *
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} dirname
   *   Dirname.
   * @returns {undefined}
   *   Nothing.
   */
  set dirname(t) {
    to(this.basename, "dirname"), this.path = Ie.join(t || "", this.basename);
  }
  /**
   * Get the extname (including dot) (example: `'.js'`).
   *
   * @returns {string | undefined}
   *   Extname.
   */
  get extname() {
    return typeof this.path == "string" ? Ie.extname(this.path) : void 0;
  }
  /**
   * Set the extname (including dot) (example: `'.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} extname
   *   Extname.
   * @returns {undefined}
   *   Nothing.
   */
  set extname(t) {
    if (kr(t, "extname"), to(this.dirname, "extname"), t) {
      if (t.codePointAt(0) !== 46)
        throw new Error("`extname` must start with `.`");
      if (t.includes(".", 1))
        throw new Error("`extname` cannot contain multiple dots");
    }
    this.path = Ie.join(this.dirname, this.stem + (t || ""));
  }
  /**
   * Get the full path (example: `'~/index.min.js'`).
   *
   * @returns {string}
   *   Path.
   */
  get path() {
    return this.history[this.history.length - 1];
  }
  /**
   * Set the full path (example: `'~/index.min.js'`).
   *
   * Cannot be nullified.
   * You can set a file URL (a `URL` object with a `file:` protocol) which will
   * be turned into a path with `url.fileURLToPath`.
   *
   * @param {URL | string} path
   *   Path.
   * @returns {undefined}
   *   Nothing.
   */
  set path(t) {
    Qr(t) && (t = my(t)), _r(t, "path"), this.path !== t && this.history.push(t);
  }
  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   *
   * @returns {string | undefined}
   *   Stem.
   */
  get stem() {
    return typeof this.path == "string" ? Ie.basename(this.path, this.extname) : void 0;
  }
  /**
   * Set the stem (basename w/o extname) (example: `'index.min'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} stem
   *   Stem.
   * @returns {undefined}
   *   Nothing.
   */
  set stem(t) {
    _r(t, "stem"), kr(t, "stem"), this.path = Ie.join(this.dirname || "", t + (this.extname || ""));
  }
  // Normal prototypal methods.
  /**
   * Create a fatal message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `true` (error; file not usable)
   * and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {never}
   *   Never.
   * @throws {VFileMessage}
   *   Message.
   */
  fail(t, n, r) {
    const i = this.message(t, n, r);
    throw i.fatal = !0, i;
  }
  /**
   * Create an info message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `undefined` (info; change
   * likely not needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  info(t, n, r) {
    const i = this.message(t, n, r);
    return i.fatal = void 0, i;
  }
  /**
   * Create a message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `false` (warning; change may be
   * needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  message(t, n, r) {
    const i = new ne(
      // @ts-expect-error: the overloads are fine.
      t,
      n,
      r
    );
    return this.path && (i.name = this.path + ":" + i.name, i.file = this.path), i.fatal = !1, this.messages.push(i), i;
  }
  /**
   * Serialize the file.
   *
   * > **Note**: which encodings are supported depends on the engine.
   * > For info on Node.js, see:
   * > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
   *
   * @param {string | null | undefined} [encoding='utf8']
   *   Character encoding to understand `value` as when it’s a `Uint8Array`
   *   (default: `'utf-8'`).
   * @returns {string}
   *   Serialized file.
   */
  toString(t) {
    return this.value === void 0 ? "" : typeof this.value == "string" ? this.value : new TextDecoder(t || void 0).decode(this.value);
  }
}
function kr(e, t) {
  if (e && e.includes(Ie.sep))
    throw new Error(
      "`" + t + "` cannot be a path: did not expect `" + Ie.sep + "`"
    );
}
function _r(e, t) {
  if (!e)
    throw new Error("`" + t + "` cannot be empty");
}
function to(e, t) {
  if (!e)
    throw new Error("Setting `" + t + "` requires `path` to be set too");
}
function by(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
const yy = (
  /**
   * @type {new <Parameters extends Array<unknown>, Result>(property: string | symbol) => (...parameters: Parameters) => Result}
   */
  /** @type {unknown} */
  /**
   * @this {Function}
   * @param {string | symbol} property
   * @returns {(...parameters: Array<unknown>) => unknown}
   */
  (function(e) {
    const r = (
      /** @type {Record<string | symbol, Function>} */
      // Prototypes do exist.
      // type-coverage:ignore-next-line
      this.constructor.prototype
    ), i = r[e], s = function() {
      return i.apply(s, arguments);
    };
    return Object.setPrototypeOf(s, r), s;
  })
), xy = {}.hasOwnProperty;
class zi extends yy {
  /**
   * Create a processor.
   */
  constructor() {
    super("copy"), this.Compiler = void 0, this.Parser = void 0, this.attachers = [], this.compiler = void 0, this.freezeIndex = -1, this.frozen = void 0, this.namespace = {}, this.parser = void 0, this.transformers = sy();
  }
  /**
   * Copy a processor.
   *
   * @deprecated
   *   This is a private internal method and should not be used.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   New *unfrozen* processor ({@linkcode Processor}) that is
   *   configured to work the same as its ancestor.
   *   When the descendant processor is configured in the future it does not
   *   affect the ancestral processor.
   */
  copy() {
    const t = (
      /** @type {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>} */
      new zi()
    );
    let n = -1;
    for (; ++n < this.attachers.length; ) {
      const r = this.attachers[n];
      t.use(...r);
    }
    return t.data(xr(!0, {}, this.namespace)), t;
  }
  /**
   * Configure the processor with info available to all plugins.
   * Information is stored in an object.
   *
   * Typically, options can be given to a specific plugin, but sometimes it
   * makes sense to have information shared with several plugins.
   * For example, a list of HTML elements that are self-closing, which is
   * needed during all phases.
   *
   * > **Note**: setting information cannot occur on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * > **Note**: to register custom data in TypeScript, augment the
   * > {@linkcode Data} interface.
   *
   * @example
   *   This example show how to get and set info:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   const processor = unified().data('alpha', 'bravo')
   *
   *   processor.data('alpha') // => 'bravo'
   *
   *   processor.data() // => {alpha: 'bravo'}
   *
   *   processor.data({charlie: 'delta'})
   *
   *   processor.data() // => {charlie: 'delta'}
   *   ```
   *
   * @template {keyof Data} Key
   *
   * @overload
   * @returns {Data}
   *
   * @overload
   * @param {Data} dataset
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Key} key
   * @returns {Data[Key]}
   *
   * @overload
   * @param {Key} key
   * @param {Data[Key]} value
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @param {Data | Key} [key]
   *   Key to get or set, or entire dataset to set, or nothing to get the
   *   entire dataset (optional).
   * @param {Data[Key]} [value]
   *   Value to set (optional).
   * @returns {unknown}
   *   The current processor when setting, the value at `key` when getting, or
   *   the entire dataset when getting without key.
   */
  data(t, n) {
    return typeof t == "string" ? arguments.length === 2 ? (vr("data", this.frozen), this.namespace[t] = n, this) : xy.call(this.namespace, t) && this.namespace[t] || void 0 : t ? (vr("data", this.frozen), this.namespace = t, this) : this.namespace;
  }
  /**
   * Freeze a processor.
   *
   * Frozen processors are meant to be extended and not to be configured
   * directly.
   *
   * When a processor is frozen it cannot be unfrozen.
   * New processors working the same way can be created by calling the
   * processor.
   *
   * It’s possible to freeze processors explicitly by calling `.freeze()`.
   * Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
   * `.stringify()`, `.process()`, or `.processSync()` are called.
   *
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   The current processor.
   */
  freeze() {
    if (this.frozen)
      return this;
    const t = (
      /** @type {Processor} */
      /** @type {unknown} */
      this
    );
    for (; ++this.freezeIndex < this.attachers.length; ) {
      const [n, ...r] = this.attachers[this.freezeIndex];
      if (r[0] === !1)
        continue;
      r[0] === !0 && (r[0] = void 0);
      const i = n.call(t, ...r);
      typeof i == "function" && this.transformers.use(i);
    }
    return this.frozen = !0, this.freezeIndex = Number.POSITIVE_INFINITY, this;
  }
  /**
   * Parse text to a syntax tree.
   *
   * > **Note**: `parse` freezes the processor if not already *frozen*.
   *
   * > **Note**: `parse` performs the parse phase, not the run phase or other
   * > phases.
   *
   * @param {Compatible | undefined} [file]
   *   file to parse (optional); typically `string` or `VFile`; any value
   *   accepted as `x` in `new VFile(x)`.
   * @returns {ParseTree extends undefined ? Node : ParseTree}
   *   Syntax tree representing `file`.
   */
  parse(t) {
    this.freeze();
    const n = dn(t), r = this.parser || this.Parser;
    return Sr("parse", r), r(String(n), n);
  }
  /**
   * Process the given file as configured on the processor.
   *
   * > **Note**: `process` freezes the processor if not already *frozen*.
   *
   * > **Note**: `process` performs the parse, run, and stringify phases.
   *
   * @overload
   * @param {Compatible | undefined} file
   * @param {ProcessCallback<VFileWithOutput<CompileResult>>} done
   * @returns {undefined}
   *
   * @overload
   * @param {Compatible | undefined} [file]
   * @returns {Promise<VFileWithOutput<CompileResult>>}
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`]; any value accepted as
   *   `x` in `new VFile(x)`.
   * @param {ProcessCallback<VFileWithOutput<CompileResult>> | undefined} [done]
   *   Callback (optional).
   * @returns {Promise<VFile> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise a promise, rejected with a fatal error or resolved with the
   *   processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  process(t, n) {
    const r = this;
    return this.freeze(), Sr("process", this.parser || this.Parser), Cr("process", this.compiler || this.Compiler), n ? i(void 0, n) : new Promise(i);
    function i(s, o) {
      const a = dn(t), l = (
        /** @type {HeadTree extends undefined ? Node : HeadTree} */
        /** @type {unknown} */
        r.parse(a)
      );
      r.run(l, a, function(h, c, f) {
        if (h || !c || !f)
          return u(h);
        const d = (
          /** @type {CompileTree extends undefined ? Node : CompileTree} */
          /** @type {unknown} */
          c
        ), p = r.stringify(d, f);
        _y(p) ? f.value = p : f.result = p, u(
          h,
          /** @type {VFileWithOutput<CompileResult>} */
          f
        );
      });
      function u(h, c) {
        h || !c ? o(h) : s ? s(c) : n(void 0, c);
      }
    }
  }
  /**
   * Process the given file as configured on the processor.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `processSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `processSync` performs the parse, run, and stringify phases.
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`; any value accepted as
   *   `x` in `new VFile(x)`.
   * @returns {VFileWithOutput<CompileResult>}
   *   The processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  processSync(t) {
    let n = !1, r;
    return this.freeze(), Sr("processSync", this.parser || this.Parser), Cr("processSync", this.compiler || this.Compiler), this.process(t, i), ro("processSync", "process", n), r;
    function i(s, o) {
      n = !0, Zs(s), r = o;
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * > **Note**: `run` freezes the processor if not already *frozen*.
   *
   * > **Note**: `run` performs the run phase, not other phases.
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} file
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} [file]
   * @returns {Promise<TailTree extends undefined ? Node : TailTree>}
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {(
   *   RunCallback<TailTree extends undefined ? Node : TailTree> |
   *   Compatible
   * )} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} [done]
   *   Callback (optional).
   * @returns {Promise<TailTree extends undefined ? Node : TailTree> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise, a promise rejected with a fatal error or resolved with the
   *   transformed tree.
   */
  run(t, n, r) {
    no(t), this.freeze();
    const i = this.transformers;
    return !r && typeof n == "function" && (r = n, n = void 0), r ? s(void 0, r) : new Promise(s);
    function s(o, a) {
      const l = dn(n);
      i.run(t, l, u);
      function u(h, c, f) {
        const d = (
          /** @type {TailTree extends undefined ? Node : TailTree} */
          c || t
        );
        h ? a(h) : o ? o(d) : r(void 0, d, f);
      }
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `runSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `runSync` performs the run phase, not other phases.
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {TailTree extends undefined ? Node : TailTree}
   *   Transformed tree.
   */
  runSync(t, n) {
    let r = !1, i;
    return this.run(t, n, s), ro("runSync", "run", r), i;
    function s(o, a) {
      Zs(o), i = a, r = !0;
    }
  }
  /**
   * Compile a syntax tree.
   *
   * > **Note**: `stringify` freezes the processor if not already *frozen*.
   *
   * > **Note**: `stringify` performs the stringify phase, not the run phase
   * > or other phases.
   *
   * @param {CompileTree extends undefined ? Node : CompileTree} tree
   *   Tree to compile.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {CompileResult extends undefined ? Value : CompileResult}
   *   Textual representation of the tree (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most compilers
   *   > return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  stringify(t, n) {
    this.freeze();
    const r = dn(n), i = this.compiler || this.Compiler;
    return Cr("stringify", i), no(t), i(t, r);
  }
  /**
   * Configure the processor to use a plugin, a list of usable values, or a
   * preset.
   *
   * If the processor is already using a plugin, the previous plugin
   * configuration is changed based on the options that are passed in.
   * In other words, the plugin is not added a second time.
   *
   * > **Note**: `use` cannot be called on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * @example
   *   There are many ways to pass plugins to `.use()`.
   *   This example gives an overview:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   unified()
   *     // Plugin with options:
   *     .use(pluginA, {x: true, y: true})
   *     // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
   *     .use(pluginA, {y: false, z: true})
   *     // Plugins:
   *     .use([pluginB, pluginC])
   *     // Two plugins, the second with options:
   *     .use([pluginD, [pluginE, {}]])
   *     // Preset with plugins and settings:
   *     .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
   *     // Settings only:
   *     .use({settings: {position: false}})
   *   ```
   *
   * @template {Array<unknown>} [Parameters=[]]
   * @template {Node | string | undefined} [Input=undefined]
   * @template [Output=Input]
   *
   * @overload
   * @param {Preset | null | undefined} [preset]
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {PluggableList} list
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Plugin<Parameters, Input, Output>} plugin
   * @param {...(Parameters | [boolean])} parameters
   * @returns {UsePlugin<ParseTree, HeadTree, TailTree, CompileTree, CompileResult, Input, Output>}
   *
   * @param {PluggableList | Plugin | Preset | null | undefined} value
   *   Usable value.
   * @param {...unknown} parameters
   *   Parameters, when a plugin is given as a usable value.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   Current processor.
   */
  use(t, ...n) {
    const r = this.attachers, i = this.namespace;
    if (vr("use", this.frozen), t != null) if (typeof t == "function")
      l(t, n);
    else if (typeof t == "object")
      Array.isArray(t) ? a(t) : o(t);
    else
      throw new TypeError("Expected usable value, not `" + t + "`");
    return this;
    function s(u) {
      if (typeof u == "function")
        l(u, []);
      else if (typeof u == "object")
        if (Array.isArray(u)) {
          const [h, ...c] = (
            /** @type {PluginTuple<Array<unknown>>} */
            u
          );
          l(h, c);
        } else
          o(u);
      else
        throw new TypeError("Expected usable value, not `" + u + "`");
    }
    function o(u) {
      if (!("plugins" in u) && !("settings" in u))
        throw new Error(
          "Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither"
        );
      a(u.plugins), u.settings && (i.settings = xr(!0, i.settings, u.settings));
    }
    function a(u) {
      let h = -1;
      if (u != null) if (Array.isArray(u))
        for (; ++h < u.length; ) {
          const c = u[h];
          s(c);
        }
      else
        throw new TypeError("Expected a list of plugins, not `" + u + "`");
    }
    function l(u, h) {
      let c = -1, f = -1;
      for (; ++c < r.length; )
        if (r[c][0] === u) {
          f = c;
          break;
        }
      if (f === -1)
        r.push([u, ...h]);
      else if (h.length > 0) {
        let [d, ...p] = h;
        const y = r[f][1];
        Yr(y) && Yr(d) && (d = xr(!0, y, d)), r[f] = [u, d, ...p];
      }
    }
  }
}
const wy = new zi().freeze();
function Sr(e, t) {
  if (typeof t != "function")
    throw new TypeError("Cannot `" + e + "` without `parser`");
}
function Cr(e, t) {
  if (typeof t != "function")
    throw new TypeError("Cannot `" + e + "` without `compiler`");
}
function vr(e, t) {
  if (t)
    throw new Error(
      "Cannot call `" + e + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
    );
}
function no(e) {
  if (!Yr(e) || typeof e.type != "string")
    throw new TypeError("Expected node, got `" + e + "`");
}
function ro(e, t, n) {
  if (!n)
    throw new Error(
      "`" + e + "` finished async. Use `" + t + "` instead"
    );
}
function dn(e) {
  return ky(e) ? e : new El(e);
}
function ky(e) {
  return !!(e && typeof e == "object" && "message" in e && "messages" in e);
}
function _y(e) {
  return typeof e == "string" || Sy(e);
}
function Sy(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
const Cy = "https://github.com/remarkjs/react-markdown/blob/main/changelog.md", io = [], so = { allowDangerousHtml: !0 }, vy = /^(https?|ircs?|mailto|xmpp)$/i, Ey = [
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
function Iy(e) {
  const t = Ay(e), n = Ty(e);
  return Ry(t.runSync(t.parse(n), n), e);
}
function Ay(e) {
  const t = e.rehypePlugins || io, n = e.remarkPlugins || io, r = e.remarkRehypeOptions ? { ...e.remarkRehypeOptions, ...so } : so;
  return wy().use(lb).use(n).use(ny, r).use(t);
}
function Ty(e) {
  const t = e.children || "", n = new El();
  return typeof t == "string" && (n.value = t), n;
}
function Ry(e, t) {
  const n = t.allowedElements, r = t.allowElement, i = t.components, s = t.disallowedElements, o = t.skipHtml, a = t.unwrapDisallowed, l = t.urlTransform || Dy;
  for (const h of Ey)
    Object.hasOwn(t, h.from) && ("" + h.from + (h.to ? "use `" + h.to + "` instead" : "remove it") + Cy + h.id, void 0);
  return Bi(e, u), qp(e, {
    Fragment: Pn,
    components: i,
    ignoreInvalidStyle: !0,
    jsx: w,
    jsxs: B,
    passKeys: !0,
    passNode: !0
  });
  function u(h, c, f) {
    if (h.type === "raw" && f && typeof c == "number")
      return o ? f.children.splice(c, 1) : f.children[c] = { type: "text", value: h.value }, c;
    if (h.type === "element") {
      let d;
      for (d in mr)
        if (Object.hasOwn(mr, d) && Object.hasOwn(h.properties, d)) {
          const p = h.properties[d], y = mr[d];
          (y === null || y.includes(h.tagName)) && (h.properties[d] = l(String(p || ""), d, h));
        }
    }
    if (h.type === "element") {
      let d = n ? !n.includes(h.tagName) : s ? s.includes(h.tagName) : !1;
      if (!d && r && typeof c == "number" && (d = !r(h, c, f)), d && f && typeof c == "number")
        return a && h.children ? f.children.splice(c, 1, ...h.children) : f.children.splice(c, 1), c;
    }
  }
}
function Dy(e) {
  const t = e.indexOf(":"), n = e.indexOf("?"), r = e.indexOf("#"), i = e.indexOf("/");
  return (
    // If there is no protocol, it’s relative.
    t === -1 || // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    i !== -1 && t > i || n !== -1 && t > n || r !== -1 && t > r || // It is a protocol, it should be allowed.
    vy.test(e.slice(0, t)) ? e : ""
  );
}
const { useSmooth: My, useSmoothStatus: Py, withSmoothContextProvider: Ny } = If, Oy = ({ components: e, componentsByLanguage: t, smooth: n = !0, defer: r = !1, preprocess: i, ...s }) => {
  const o = yf(), { text: a } = My(xt(() => i ? {
    ...o,
    text: i(o.text)
  } : o, [o, i]), n), l = hu(a), u = r ? l : a, { pre: h = lp, code: c = up, SyntaxHighlighter: f = Ci, CodeHeader: d = cp } = e ?? {}, p = xt(() => ({
    Pre: h,
    Code: c,
    SyntaxHighlighter: f,
    CodeHeader: d
  }), [
    h,
    c,
    f,
    d
  ]), y = Kt((x) => /* @__PURE__ */ w(gp, {
    components: p,
    componentsByLanguage: t,
    ...x
  }));
  return /* @__PURE__ */ w(Iy, {
    components: xt(() => {
      const { pre: x, code: b, SyntaxHighlighter: S, CodeHeader: v, ...M } = e ?? {};
      return {
        ...M,
        pre: ap,
        code: y
      };
    }, [y, e]),
    ...s,
    children: u
  });
}, Il = yo(({ className: e, containerProps: t, containerComponent: n = "div", ...r }, i) => /* @__PURE__ */ w(n, {
  "data-status": Py().type,
  ...t,
  className: Ha(e, t?.className),
  ref: i,
  children: /* @__PURE__ */ w(Oy, { ...r })
}));
Il.displayName = "MarkdownTextPrimitive";
const Ly = Ny(Il);
function oo(e, t) {
  const n = String(e);
  if (typeof t != "string")
    throw new TypeError("Expected character");
  let r = 0, i = n.indexOf(t);
  for (; i !== -1; )
    r++, i = n.indexOf(t, i + t.length);
  return r;
}
function Fy(e) {
  if (typeof e != "string")
    throw new TypeError("Expected a string");
  return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function By(e, t, n) {
  const i = er((n || {}).ignore || []), s = zy(t);
  let o = -1;
  for (; ++o < s.length; )
    vl(e, "text", a);
  function a(u, h) {
    let c = -1, f;
    for (; ++c < h.length; ) {
      const d = h[c], p = f ? f.children : void 0;
      if (i(
        d,
        p ? p.indexOf(d) : void 0,
        f
      ))
        return;
      f = d;
    }
    if (f)
      return l(u, h);
  }
  function l(u, h) {
    const c = h[h.length - 1], f = s[o][0], d = s[o][1];
    let p = 0;
    const x = c.children.indexOf(u);
    let b = !1, S = [];
    f.lastIndex = 0;
    let v = f.exec(u.value);
    for (; v; ) {
      const M = v.index, A = {
        index: v.index,
        input: v.input,
        stack: [...h, u]
      };
      let _ = d(...v, A);
      if (typeof _ == "string" && (_ = _.length > 0 ? { type: "text", value: _ } : void 0), _ === !1 ? f.lastIndex = M + 1 : (p !== M && S.push({
        type: "text",
        value: u.value.slice(p, M)
      }), Array.isArray(_) ? S.push(..._) : _ && S.push(_), p = M + v[0].length, b = !0), !f.global)
        break;
      v = f.exec(u.value);
    }
    return b ? (p < u.value.length && S.push({ type: "text", value: u.value.slice(p) }), c.children.splice(x, 1, ...S)) : S = [u], x + S.length;
  }
}
function zy(e) {
  const t = [];
  if (!Array.isArray(e))
    throw new TypeError("Expected find and replace tuple or list of tuples");
  const n = !e[0] || Array.isArray(e[0]) ? e : [e];
  let r = -1;
  for (; ++r < n.length; ) {
    const i = n[r];
    t.push([$y(i[0]), jy(i[1])]);
  }
  return t;
}
function $y(e) {
  return typeof e == "string" ? new RegExp(Fy(e), "g") : e;
}
function jy(e) {
  return typeof e == "function" ? e : function() {
    return e;
  };
}
const Er = "phrasing", Ir = ["autolink", "link", "image", "label"];
function Uy() {
  return {
    transforms: [Yy],
    enter: {
      literalAutolink: Hy,
      literalAutolinkEmail: Ar,
      literalAutolinkHttp: Ar,
      literalAutolinkWww: Ar
    },
    exit: {
      literalAutolink: Jy,
      literalAutolinkEmail: Wy,
      literalAutolinkHttp: qy,
      literalAutolinkWww: Ky
    }
  };
}
function Vy() {
  return {
    unsafe: [
      {
        character: "@",
        before: "[+\\-.\\w]",
        after: "[\\-.\\w]",
        inConstruct: Er,
        notInConstruct: Ir
      },
      {
        character: ".",
        before: "[Ww]",
        after: "[\\-.\\w]",
        inConstruct: Er,
        notInConstruct: Ir
      },
      {
        character: ":",
        before: "[ps]",
        after: "\\/",
        inConstruct: Er,
        notInConstruct: Ir
      }
    ]
  };
}
function Hy(e) {
  this.enter({ type: "link", title: null, url: "", children: [] }, e);
}
function Ar(e) {
  this.config.enter.autolinkProtocol.call(this, e);
}
function qy(e) {
  this.config.exit.autolinkProtocol.call(this, e);
}
function Ky(e) {
  this.config.exit.data.call(this, e);
  const t = this.stack[this.stack.length - 1];
  t.type, t.url = "http://" + this.sliceSerialize(e);
}
function Wy(e) {
  this.config.exit.autolinkEmail.call(this, e);
}
function Jy(e) {
  this.exit(e);
}
function Yy(e) {
  By(
    e,
    [
      [/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, Qy],
      [new RegExp("(?<=^|\\s|\\p{P}|\\p{S})([-.\\w+]+)@([-\\w]+(?:\\.[-\\w]+)+)", "gu"), Gy]
    ],
    { ignore: ["link", "linkReference"] }
  );
}
function Qy(e, t, n, r, i) {
  let s = "";
  if (!Al(i) || (/^w/i.test(t) && (n = t + n, t = "", s = "http://"), !Xy(n)))
    return !1;
  const o = Zy(n + r);
  if (!o[0]) return !1;
  const a = {
    type: "link",
    title: null,
    url: s + t + o[0],
    children: [{ type: "text", value: t + o[0] }]
  };
  return o[1] ? [a, { type: "text", value: o[1] }] : a;
}
function Gy(e, t, n, r) {
  return (
    // Not an expected previous character.
    !Al(r, !0) || // Label ends in not allowed character.
    /[-\d_]$/.test(n) ? !1 : {
      type: "link",
      title: null,
      url: "mailto:" + t + "@" + n,
      children: [{ type: "text", value: t + "@" + n }]
    }
  );
}
function Xy(e) {
  const t = e.split(".");
  return !(t.length < 2 || t[t.length - 1] && (/_/.test(t[t.length - 1]) || !/[a-zA-Z\d]/.test(t[t.length - 1])) || t[t.length - 2] && (/_/.test(t[t.length - 2]) || !/[a-zA-Z\d]/.test(t[t.length - 2])));
}
function Zy(e) {
  const t = /[!"&'),.:;<>?\]}]+$/.exec(e);
  if (!t)
    return [e, void 0];
  e = e.slice(0, t.index);
  let n = t[0], r = n.indexOf(")");
  const i = oo(e, "(");
  let s = oo(e, ")");
  for (; r !== -1 && i > s; )
    e += n.slice(0, r + 1), n = n.slice(r + 1), r = n.indexOf(")"), s++;
  return [e, n];
}
function Al(e, t) {
  const n = e.input.charCodeAt(e.index - 1);
  return (e.index === 0 || lt(n) || Gn(n)) && // If it’s an email, the previous character should not be a slash.
  (!t || n !== 47);
}
Tl.peek = lx;
function ex() {
  this.buffer();
}
function tx(e) {
  this.enter({ type: "footnoteReference", identifier: "", label: "" }, e);
}
function nx() {
  this.buffer();
}
function rx(e) {
  this.enter(
    { type: "footnoteDefinition", identifier: "", label: "", children: [] },
    e
  );
}
function ix(e) {
  const t = this.resume(), n = this.stack[this.stack.length - 1];
  n.type, n.identifier = ve(
    this.sliceSerialize(e)
  ).toLowerCase(), n.label = t;
}
function sx(e) {
  this.exit(e);
}
function ox(e) {
  const t = this.resume(), n = this.stack[this.stack.length - 1];
  n.type, n.identifier = ve(
    this.sliceSerialize(e)
  ).toLowerCase(), n.label = t;
}
function ax(e) {
  this.exit(e);
}
function lx() {
  return "[";
}
function Tl(e, t, n, r) {
  const i = n.createTracker(r);
  let s = i.move("[^");
  const o = n.enter("footnoteReference"), a = n.enter("reference");
  return s += i.move(
    n.safe(n.associationId(e), { after: "]", before: s })
  ), a(), o(), s += i.move("]"), s;
}
function ux() {
  return {
    enter: {
      gfmFootnoteCallString: ex,
      gfmFootnoteCall: tx,
      gfmFootnoteDefinitionLabelString: nx,
      gfmFootnoteDefinition: rx
    },
    exit: {
      gfmFootnoteCallString: ix,
      gfmFootnoteCall: sx,
      gfmFootnoteDefinitionLabelString: ox,
      gfmFootnoteDefinition: ax
    }
  };
}
function cx(e) {
  let t = !1;
  return e && e.firstLineBlank && (t = !0), {
    handlers: { footnoteDefinition: n, footnoteReference: Tl },
    // This is on by default already.
    unsafe: [{ character: "[", inConstruct: ["label", "phrasing", "reference"] }]
  };
  function n(r, i, s, o) {
    const a = s.createTracker(o);
    let l = a.move("[^");
    const u = s.enter("footnoteDefinition"), h = s.enter("label");
    return l += a.move(
      s.safe(s.associationId(r), { before: l, after: "]" })
    ), h(), l += a.move("]:"), r.children && r.children.length > 0 && (a.shift(4), l += a.move(
      (t ? `
` : " ") + s.indentLines(
        s.containerFlow(r, a.current()),
        t ? Rl : hx
      )
    )), u(), l;
  }
}
function hx(e, t, n) {
  return t === 0 ? e : Rl(e, t, n);
}
function Rl(e, t, n) {
  return (n ? "" : "    ") + e;
}
const fx = [
  "autolink",
  "destinationLiteral",
  "destinationRaw",
  "reference",
  "titleQuote",
  "titleApostrophe"
];
Dl.peek = bx;
function dx() {
  return {
    canContainEols: ["delete"],
    enter: { strikethrough: mx },
    exit: { strikethrough: gx }
  };
}
function px() {
  return {
    unsafe: [
      {
        character: "~",
        inConstruct: "phrasing",
        notInConstruct: fx
      }
    ],
    handlers: { delete: Dl }
  };
}
function mx(e) {
  this.enter({ type: "delete", children: [] }, e);
}
function gx(e) {
  this.exit(e);
}
function Dl(e, t, n, r) {
  const i = n.createTracker(r), s = n.enter("strikethrough");
  let o = i.move("~~");
  return o += n.containerPhrasing(e, {
    ...i.current(),
    before: o,
    after: "~"
  }), o += i.move("~~"), s(), o;
}
function bx() {
  return "~";
}
function yx(e) {
  return e.length;
}
function xx(e, t) {
  const n = t || {}, r = (n.align || []).concat(), i = n.stringLength || yx, s = [], o = [], a = [], l = [];
  let u = 0, h = -1;
  for (; ++h < e.length; ) {
    const y = [], x = [];
    let b = -1;
    for (e[h].length > u && (u = e[h].length); ++b < e[h].length; ) {
      const S = wx(e[h][b]);
      if (n.alignDelimiters !== !1) {
        const v = i(S);
        x[b] = v, (l[b] === void 0 || v > l[b]) && (l[b] = v);
      }
      y.push(S);
    }
    o[h] = y, a[h] = x;
  }
  let c = -1;
  if (typeof r == "object" && "length" in r)
    for (; ++c < u; )
      s[c] = ao(r[c]);
  else {
    const y = ao(r);
    for (; ++c < u; )
      s[c] = y;
  }
  c = -1;
  const f = [], d = [];
  for (; ++c < u; ) {
    const y = s[c];
    let x = "", b = "";
    y === 99 ? (x = ":", b = ":") : y === 108 ? x = ":" : y === 114 && (b = ":");
    let S = n.alignDelimiters === !1 ? 1 : Math.max(
      1,
      l[c] - x.length - b.length
    );
    const v = x + "-".repeat(S) + b;
    n.alignDelimiters !== !1 && (S = x.length + S + b.length, S > l[c] && (l[c] = S), d[c] = S), f[c] = v;
  }
  o.splice(1, 0, f), a.splice(1, 0, d), h = -1;
  const p = [];
  for (; ++h < o.length; ) {
    const y = o[h], x = a[h];
    c = -1;
    const b = [];
    for (; ++c < u; ) {
      const S = y[c] || "";
      let v = "", M = "";
      if (n.alignDelimiters !== !1) {
        const A = l[c] - (x[c] || 0), _ = s[c];
        _ === 114 ? v = " ".repeat(A) : _ === 99 ? A % 2 ? (v = " ".repeat(A / 2 + 0.5), M = " ".repeat(A / 2 - 0.5)) : (v = " ".repeat(A / 2), M = v) : M = " ".repeat(A);
      }
      n.delimiterStart !== !1 && !c && b.push("|"), n.padding !== !1 && // Don’t add the opening space if we’re not aligning and the cell is
      // empty: there will be a closing space.
      !(n.alignDelimiters === !1 && S === "") && (n.delimiterStart !== !1 || c) && b.push(" "), n.alignDelimiters !== !1 && b.push(v), b.push(S), n.alignDelimiters !== !1 && b.push(M), n.padding !== !1 && b.push(" "), (n.delimiterEnd !== !1 || c !== u - 1) && b.push("|");
    }
    p.push(
      n.delimiterEnd === !1 ? b.join("").replace(/ +$/, "") : b.join("")
    );
  }
  return p.join(`
`);
}
function wx(e) {
  return e == null ? "" : String(e);
}
function ao(e) {
  const t = typeof e == "string" ? e.codePointAt(0) : 0;
  return t === 67 || t === 99 ? 99 : t === 76 || t === 108 ? 108 : t === 82 || t === 114 ? 114 : 0;
}
function kx(e, t, n, r) {
  const i = n.enter("blockquote"), s = n.createTracker(r);
  s.move("> "), s.shift(2);
  const o = n.indentLines(
    n.containerFlow(e, s.current()),
    _x
  );
  return i(), o;
}
function _x(e, t, n) {
  return ">" + (n ? "" : " ") + e;
}
function Sx(e, t) {
  return lo(e, t.inConstruct, !0) && !lo(e, t.notInConstruct, !1);
}
function lo(e, t, n) {
  if (typeof t == "string" && (t = [t]), !t || t.length === 0)
    return n;
  let r = -1;
  for (; ++r < t.length; )
    if (e.includes(t[r]))
      return !0;
  return !1;
}
function uo(e, t, n, r) {
  let i = -1;
  for (; ++i < n.unsafe.length; )
    if (n.unsafe[i].character === `
` && Sx(n.stack, n.unsafe[i]))
      return /[ \t]/.test(r.before) ? "" : " ";
  return `\\
`;
}
function Cx(e, t) {
  const n = String(e);
  let r = n.indexOf(t), i = r, s = 0, o = 0;
  if (typeof t != "string")
    throw new TypeError("Expected substring");
  for (; r !== -1; )
    r === i ? ++s > o && (o = s) : s = 1, i = r + t.length, r = n.indexOf(t, i);
  return o;
}
function vx(e, t) {
  return !!(t.options.fences === !1 && e.value && // If there’s no info…
  !e.lang && // And there’s a non-whitespace character…
  /[^ \r\n]/.test(e.value) && // And the value doesn’t start or end in a blank…
  !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(e.value));
}
function Ex(e) {
  const t = e.options.fence || "`";
  if (t !== "`" && t !== "~")
    throw new Error(
      "Cannot serialize code with `" + t + "` for `options.fence`, expected `` ` `` or `~`"
    );
  return t;
}
function Ix(e, t, n, r) {
  const i = Ex(n), s = e.value || "", o = i === "`" ? "GraveAccent" : "Tilde";
  if (vx(e, n)) {
    const c = n.enter("codeIndented"), f = n.indentLines(s, Ax);
    return c(), f;
  }
  const a = n.createTracker(r), l = i.repeat(Math.max(Cx(s, i) + 1, 3)), u = n.enter("codeFenced");
  let h = a.move(l);
  if (e.lang) {
    const c = n.enter(`codeFencedLang${o}`);
    h += a.move(
      n.safe(e.lang, {
        before: h,
        after: " ",
        encode: ["`"],
        ...a.current()
      })
    ), c();
  }
  if (e.lang && e.meta) {
    const c = n.enter(`codeFencedMeta${o}`);
    h += a.move(" "), h += a.move(
      n.safe(e.meta, {
        before: h,
        after: `
`,
        encode: ["`"],
        ...a.current()
      })
    ), c();
  }
  return h += a.move(`
`), s && (h += a.move(s + `
`)), h += a.move(l), u(), h;
}
function Ax(e, t, n) {
  return (n ? "" : "    ") + e;
}
function $i(e) {
  const t = e.options.quote || '"';
  if (t !== '"' && t !== "'")
    throw new Error(
      "Cannot serialize title with `" + t + "` for `options.quote`, expected `\"`, or `'`"
    );
  return t;
}
function Tx(e, t, n, r) {
  const i = $i(n), s = i === '"' ? "Quote" : "Apostrophe", o = n.enter("definition");
  let a = n.enter("label");
  const l = n.createTracker(r);
  let u = l.move("[");
  return u += l.move(
    n.safe(n.associationId(e), {
      before: u,
      after: "]",
      ...l.current()
    })
  ), u += l.move("]: "), a(), // If there’s no url, or…
  !e.url || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(e.url) ? (a = n.enter("destinationLiteral"), u += l.move("<"), u += l.move(
    n.safe(e.url, { before: u, after: ">", ...l.current() })
  ), u += l.move(">")) : (a = n.enter("destinationRaw"), u += l.move(
    n.safe(e.url, {
      before: u,
      after: e.title ? " " : `
`,
      ...l.current()
    })
  )), a(), e.title && (a = n.enter(`title${s}`), u += l.move(" " + i), u += l.move(
    n.safe(e.title, {
      before: u,
      after: i,
      ...l.current()
    })
  ), u += l.move(i), a()), o(), u;
}
function Rx(e) {
  const t = e.options.emphasis || "*";
  if (t !== "*" && t !== "_")
    throw new Error(
      "Cannot serialize emphasis with `" + t + "` for `options.emphasis`, expected `*`, or `_`"
    );
  return t;
}
function Yt(e) {
  return "&#x" + e.toString(16).toUpperCase() + ";";
}
function Dn(e, t, n) {
  const r = St(e), i = St(t);
  return r === void 0 ? i === void 0 ? (
    // Letter inside:
    // we have to encode *both* letters for `_` as it is looser.
    // it already forms for `*` (and GFMs `~`).
    n === "_" ? { inside: !0, outside: !0 } : { inside: !1, outside: !1 }
  ) : i === 1 ? (
    // Whitespace inside: encode both (letter, whitespace).
    { inside: !0, outside: !0 }
  ) : (
    // Punctuation inside: encode outer (letter)
    { inside: !1, outside: !0 }
  ) : r === 1 ? i === void 0 ? (
    // Letter inside: already forms.
    { inside: !1, outside: !1 }
  ) : i === 1 ? (
    // Whitespace inside: encode both (whitespace).
    { inside: !0, outside: !0 }
  ) : (
    // Punctuation inside: already forms.
    { inside: !1, outside: !1 }
  ) : i === void 0 ? (
    // Letter inside: already forms.
    { inside: !1, outside: !1 }
  ) : i === 1 ? (
    // Whitespace inside: encode inner (whitespace).
    { inside: !0, outside: !1 }
  ) : (
    // Punctuation inside: already forms.
    { inside: !1, outside: !1 }
  );
}
Ml.peek = Dx;
function Ml(e, t, n, r) {
  const i = Rx(n), s = n.enter("emphasis"), o = n.createTracker(r), a = o.move(i);
  let l = o.move(
    n.containerPhrasing(e, {
      after: i,
      before: a,
      ...o.current()
    })
  );
  const u = l.charCodeAt(0), h = Dn(
    r.before.charCodeAt(r.before.length - 1),
    u,
    i
  );
  h.inside && (l = Yt(u) + l.slice(1));
  const c = l.charCodeAt(l.length - 1), f = Dn(r.after.charCodeAt(0), c, i);
  f.inside && (l = l.slice(0, -1) + Yt(c));
  const d = o.move(i);
  return s(), n.attentionEncodeSurroundingInfo = {
    after: f.outside,
    before: h.outside
  }, a + l + d;
}
function Dx(e, t, n) {
  return n.options.emphasis || "*";
}
function Mx(e, t) {
  let n = !1;
  return Bi(e, function(r) {
    if ("value" in r && /\r?\n|\r/.test(r.value) || r.type === "break")
      return n = !0, Wr;
  }), !!((!e.depth || e.depth < 3) && Di(e) && (t.options.setext || n));
}
function Px(e, t, n, r) {
  const i = Math.max(Math.min(6, e.depth || 1), 1), s = n.createTracker(r);
  if (Mx(e, n)) {
    const h = n.enter("headingSetext"), c = n.enter("phrasing"), f = n.containerPhrasing(e, {
      ...s.current(),
      before: `
`,
      after: `
`
    });
    return c(), h(), f + `
` + (i === 1 ? "=" : "-").repeat(
      // The whole size…
      f.length - // Minus the position of the character after the last EOL (or
      // 0 if there is none)…
      (Math.max(f.lastIndexOf("\r"), f.lastIndexOf(`
`)) + 1)
    );
  }
  const o = "#".repeat(i), a = n.enter("headingAtx"), l = n.enter("phrasing");
  s.move(o + " ");
  let u = n.containerPhrasing(e, {
    before: "# ",
    after: `
`,
    ...s.current()
  });
  return /^[\t ]/.test(u) && (u = Yt(u.charCodeAt(0)) + u.slice(1)), u = u ? o + " " + u : o, n.options.closeAtx && (u += " " + o), l(), a(), u;
}
Pl.peek = Nx;
function Pl(e) {
  return e.value || "";
}
function Nx() {
  return "<";
}
Nl.peek = Ox;
function Nl(e, t, n, r) {
  const i = $i(n), s = i === '"' ? "Quote" : "Apostrophe", o = n.enter("image");
  let a = n.enter("label");
  const l = n.createTracker(r);
  let u = l.move("![");
  return u += l.move(
    n.safe(e.alt, { before: u, after: "]", ...l.current() })
  ), u += l.move("]("), a(), // If there’s no url but there is a title…
  !e.url && e.title || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(e.url) ? (a = n.enter("destinationLiteral"), u += l.move("<"), u += l.move(
    n.safe(e.url, { before: u, after: ">", ...l.current() })
  ), u += l.move(">")) : (a = n.enter("destinationRaw"), u += l.move(
    n.safe(e.url, {
      before: u,
      after: e.title ? " " : ")",
      ...l.current()
    })
  )), a(), e.title && (a = n.enter(`title${s}`), u += l.move(" " + i), u += l.move(
    n.safe(e.title, {
      before: u,
      after: i,
      ...l.current()
    })
  ), u += l.move(i), a()), u += l.move(")"), o(), u;
}
function Ox() {
  return "!";
}
Ol.peek = Lx;
function Ol(e, t, n, r) {
  const i = e.referenceType, s = n.enter("imageReference");
  let o = n.enter("label");
  const a = n.createTracker(r);
  let l = a.move("![");
  const u = n.safe(e.alt, {
    before: l,
    after: "]",
    ...a.current()
  });
  l += a.move(u + "]["), o();
  const h = n.stack;
  n.stack = [], o = n.enter("reference");
  const c = n.safe(n.associationId(e), {
    before: l,
    after: "]",
    ...a.current()
  });
  return o(), n.stack = h, s(), i === "full" || !u || u !== c ? l += a.move(c + "]") : i === "shortcut" ? l = l.slice(0, -1) : l += a.move("]"), l;
}
function Lx() {
  return "!";
}
Ll.peek = Fx;
function Ll(e, t, n) {
  let r = e.value || "", i = "`", s = -1;
  for (; new RegExp("(^|[^`])" + i + "([^`]|$)").test(r); )
    i += "`";
  for (/[^ \r\n]/.test(r) && (/^[ \r\n]/.test(r) && /[ \r\n]$/.test(r) || /^`|`$/.test(r)) && (r = " " + r + " "); ++s < n.unsafe.length; ) {
    const o = n.unsafe[s], a = n.compilePattern(o);
    let l;
    if (o.atBreak)
      for (; l = a.exec(r); ) {
        let u = l.index;
        r.charCodeAt(u) === 10 && r.charCodeAt(u - 1) === 13 && u--, r = r.slice(0, u) + " " + r.slice(l.index + 1);
      }
  }
  return i + r + i;
}
function Fx() {
  return "`";
}
function Fl(e, t) {
  const n = Di(e);
  return !!(!t.options.resourceLink && // If there’s a url…
  e.url && // And there’s a no title…
  !e.title && // And the content of `node` is a single text node…
  e.children && e.children.length === 1 && e.children[0].type === "text" && // And if the url is the same as the content…
  (n === e.url || "mailto:" + n === e.url) && // And that starts w/ a protocol…
  /^[a-z][a-z+.-]+:/i.test(e.url) && // And that doesn’t contain ASCII control codes (character escapes and
  // references don’t work), space, or angle brackets…
  !/[\0- <>\u007F]/.test(e.url));
}
Bl.peek = Bx;
function Bl(e, t, n, r) {
  const i = $i(n), s = i === '"' ? "Quote" : "Apostrophe", o = n.createTracker(r);
  let a, l;
  if (Fl(e, n)) {
    const h = n.stack;
    n.stack = [], a = n.enter("autolink");
    let c = o.move("<");
    return c += o.move(
      n.containerPhrasing(e, {
        before: c,
        after: ">",
        ...o.current()
      })
    ), c += o.move(">"), a(), n.stack = h, c;
  }
  a = n.enter("link"), l = n.enter("label");
  let u = o.move("[");
  return u += o.move(
    n.containerPhrasing(e, {
      before: u,
      after: "](",
      ...o.current()
    })
  ), u += o.move("]("), l(), // If there’s no url but there is a title…
  !e.url && e.title || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(e.url) ? (l = n.enter("destinationLiteral"), u += o.move("<"), u += o.move(
    n.safe(e.url, { before: u, after: ">", ...o.current() })
  ), u += o.move(">")) : (l = n.enter("destinationRaw"), u += o.move(
    n.safe(e.url, {
      before: u,
      after: e.title ? " " : ")",
      ...o.current()
    })
  )), l(), e.title && (l = n.enter(`title${s}`), u += o.move(" " + i), u += o.move(
    n.safe(e.title, {
      before: u,
      after: i,
      ...o.current()
    })
  ), u += o.move(i), l()), u += o.move(")"), a(), u;
}
function Bx(e, t, n) {
  return Fl(e, n) ? "<" : "[";
}
zl.peek = zx;
function zl(e, t, n, r) {
  const i = e.referenceType, s = n.enter("linkReference");
  let o = n.enter("label");
  const a = n.createTracker(r);
  let l = a.move("[");
  const u = n.containerPhrasing(e, {
    before: l,
    after: "]",
    ...a.current()
  });
  l += a.move(u + "]["), o();
  const h = n.stack;
  n.stack = [], o = n.enter("reference");
  const c = n.safe(n.associationId(e), {
    before: l,
    after: "]",
    ...a.current()
  });
  return o(), n.stack = h, s(), i === "full" || !u || u !== c ? l += a.move(c + "]") : i === "shortcut" ? l = l.slice(0, -1) : l += a.move("]"), l;
}
function zx() {
  return "[";
}
function ji(e) {
  const t = e.options.bullet || "*";
  if (t !== "*" && t !== "+" && t !== "-")
    throw new Error(
      "Cannot serialize items with `" + t + "` for `options.bullet`, expected `*`, `+`, or `-`"
    );
  return t;
}
function $x(e) {
  const t = ji(e), n = e.options.bulletOther;
  if (!n)
    return t === "*" ? "-" : "*";
  if (n !== "*" && n !== "+" && n !== "-")
    throw new Error(
      "Cannot serialize items with `" + n + "` for `options.bulletOther`, expected `*`, `+`, or `-`"
    );
  if (n === t)
    throw new Error(
      "Expected `bullet` (`" + t + "`) and `bulletOther` (`" + n + "`) to be different"
    );
  return n;
}
function jx(e) {
  const t = e.options.bulletOrdered || ".";
  if (t !== "." && t !== ")")
    throw new Error(
      "Cannot serialize items with `" + t + "` for `options.bulletOrdered`, expected `.` or `)`"
    );
  return t;
}
function $l(e) {
  const t = e.options.rule || "*";
  if (t !== "*" && t !== "-" && t !== "_")
    throw new Error(
      "Cannot serialize rules with `" + t + "` for `options.rule`, expected `*`, `-`, or `_`"
    );
  return t;
}
function Ux(e, t, n, r) {
  const i = n.enter("list"), s = n.bulletCurrent;
  let o = e.ordered ? jx(n) : ji(n);
  const a = e.ordered ? o === "." ? ")" : "." : $x(n);
  let l = t && n.bulletLastUsed ? o === n.bulletLastUsed : !1;
  if (!e.ordered) {
    const h = e.children ? e.children[0] : void 0;
    if (
      // Bullet could be used as a thematic break marker:
      (o === "*" || o === "-") && // Empty first list item:
      h && (!h.children || !h.children[0]) && // Directly in two other list items:
      n.stack[n.stack.length - 1] === "list" && n.stack[n.stack.length - 2] === "listItem" && n.stack[n.stack.length - 3] === "list" && n.stack[n.stack.length - 4] === "listItem" && // That are each the first child.
      n.indexStack[n.indexStack.length - 1] === 0 && n.indexStack[n.indexStack.length - 2] === 0 && n.indexStack[n.indexStack.length - 3] === 0 && (l = !0), $l(n) === o && h
    ) {
      let c = -1;
      for (; ++c < e.children.length; ) {
        const f = e.children[c];
        if (f && f.type === "listItem" && f.children && f.children[0] && f.children[0].type === "thematicBreak") {
          l = !0;
          break;
        }
      }
    }
  }
  l && (o = a), n.bulletCurrent = o;
  const u = n.containerFlow(e, r);
  return n.bulletLastUsed = o, n.bulletCurrent = s, i(), u;
}
function Vx(e) {
  const t = e.options.listItemIndent || "one";
  if (t !== "tab" && t !== "one" && t !== "mixed")
    throw new Error(
      "Cannot serialize items with `" + t + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`"
    );
  return t;
}
function Hx(e, t, n, r) {
  const i = Vx(n);
  let s = n.bulletCurrent || ji(n);
  t && t.type === "list" && t.ordered && (s = (typeof t.start == "number" && t.start > -1 ? t.start : 1) + (n.options.incrementListMarker === !1 ? 0 : t.children.indexOf(e)) + s);
  let o = s.length + 1;
  (i === "tab" || i === "mixed" && (t && t.type === "list" && t.spread || e.spread)) && (o = Math.ceil(o / 4) * 4);
  const a = n.createTracker(r);
  a.move(s + " ".repeat(o - s.length)), a.shift(o);
  const l = n.enter("listItem"), u = n.indentLines(
    n.containerFlow(e, a.current()),
    h
  );
  return l(), u;
  function h(c, f, d) {
    return f ? (d ? "" : " ".repeat(o)) + c : (d ? s : s + " ".repeat(o - s.length)) + c;
  }
}
function qx(e, t, n, r) {
  const i = n.enter("paragraph"), s = n.enter("phrasing"), o = n.containerPhrasing(e, r);
  return s(), i(), o;
}
const Kx = (
  /** @type {(node?: unknown) => node is Exclude<PhrasingContent, Html>} */
  er([
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
function Wx(e, t, n, r) {
  return (e.children.some(function(o) {
    return Kx(o);
  }) ? n.containerPhrasing : n.containerFlow).call(n, e, r);
}
function Jx(e) {
  const t = e.options.strong || "*";
  if (t !== "*" && t !== "_")
    throw new Error(
      "Cannot serialize strong with `" + t + "` for `options.strong`, expected `*`, or `_`"
    );
  return t;
}
jl.peek = Yx;
function jl(e, t, n, r) {
  const i = Jx(n), s = n.enter("strong"), o = n.createTracker(r), a = o.move(i + i);
  let l = o.move(
    n.containerPhrasing(e, {
      after: i,
      before: a,
      ...o.current()
    })
  );
  const u = l.charCodeAt(0), h = Dn(
    r.before.charCodeAt(r.before.length - 1),
    u,
    i
  );
  h.inside && (l = Yt(u) + l.slice(1));
  const c = l.charCodeAt(l.length - 1), f = Dn(r.after.charCodeAt(0), c, i);
  f.inside && (l = l.slice(0, -1) + Yt(c));
  const d = o.move(i + i);
  return s(), n.attentionEncodeSurroundingInfo = {
    after: f.outside,
    before: h.outside
  }, a + l + d;
}
function Yx(e, t, n) {
  return n.options.strong || "*";
}
function Qx(e, t, n, r) {
  return n.safe(e.value, r);
}
function Gx(e) {
  const t = e.options.ruleRepetition || 3;
  if (t < 3)
    throw new Error(
      "Cannot serialize rules with repetition `" + t + "` for `options.ruleRepetition`, expected `3` or more"
    );
  return t;
}
function Xx(e, t, n) {
  const r = ($l(n) + (n.options.ruleSpaces ? " " : "")).repeat(Gx(n));
  return n.options.ruleSpaces ? r.slice(0, -1) : r;
}
const Ul = {
  blockquote: kx,
  break: uo,
  code: Ix,
  definition: Tx,
  emphasis: Ml,
  hardBreak: uo,
  heading: Px,
  html: Pl,
  image: Nl,
  imageReference: Ol,
  inlineCode: Ll,
  link: Bl,
  linkReference: zl,
  list: Ux,
  listItem: Hx,
  paragraph: qx,
  root: Wx,
  strong: jl,
  text: Qx,
  thematicBreak: Xx
};
function Zx() {
  return {
    enter: {
      table: ew,
      tableData: co,
      tableHeader: co,
      tableRow: nw
    },
    exit: {
      codeText: rw,
      table: tw,
      tableData: Tr,
      tableHeader: Tr,
      tableRow: Tr
    }
  };
}
function ew(e) {
  const t = e._align;
  this.enter(
    {
      type: "table",
      align: t.map(function(n) {
        return n === "none" ? null : n;
      }),
      children: []
    },
    e
  ), this.data.inTable = !0;
}
function tw(e) {
  this.exit(e), this.data.inTable = void 0;
}
function nw(e) {
  this.enter({ type: "tableRow", children: [] }, e);
}
function Tr(e) {
  this.exit(e);
}
function co(e) {
  this.enter({ type: "tableCell", children: [] }, e);
}
function rw(e) {
  let t = this.resume();
  this.data.inTable && (t = t.replace(/\\([\\|])/g, iw));
  const n = this.stack[this.stack.length - 1];
  n.type, n.value = t, this.exit(e);
}
function iw(e, t) {
  return t === "|" ? t : e;
}
function sw(e) {
  const t = e || {}, n = t.tableCellPadding, r = t.tablePipeAlign, i = t.stringLength, s = n ? " " : "|";
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
      inlineCode: f,
      table: o,
      tableCell: l,
      tableRow: a
    }
  };
  function o(d, p, y, x) {
    return u(h(d, y, x), d.align);
  }
  function a(d, p, y, x) {
    const b = c(d, y, x), S = u([b]);
    return S.slice(0, S.indexOf(`
`));
  }
  function l(d, p, y, x) {
    const b = y.enter("tableCell"), S = y.enter("phrasing"), v = y.containerPhrasing(d, {
      ...x,
      before: s,
      after: s
    });
    return S(), b(), v;
  }
  function u(d, p) {
    return xx(d, {
      align: p,
      // @ts-expect-error: `markdown-table` types should support `null`.
      alignDelimiters: r,
      // @ts-expect-error: `markdown-table` types should support `null`.
      padding: n,
      // @ts-expect-error: `markdown-table` types should support `null`.
      stringLength: i
    });
  }
  function h(d, p, y) {
    const x = d.children;
    let b = -1;
    const S = [], v = p.enter("table");
    for (; ++b < x.length; )
      S[b] = c(x[b], p, y);
    return v(), S;
  }
  function c(d, p, y) {
    const x = d.children;
    let b = -1;
    const S = [], v = p.enter("tableRow");
    for (; ++b < x.length; )
      S[b] = l(x[b], d, p, y);
    return v(), S;
  }
  function f(d, p, y) {
    let x = Ul.inlineCode(d, p, y);
    return y.stack.includes("tableCell") && (x = x.replace(/\|/g, "\\$&")), x;
  }
}
function ow() {
  return {
    exit: {
      taskListCheckValueChecked: ho,
      taskListCheckValueUnchecked: ho,
      paragraph: lw
    }
  };
}
function aw() {
  return {
    unsafe: [{ atBreak: !0, character: "-", after: "[:|-]" }],
    handlers: { listItem: uw }
  };
}
function ho(e) {
  const t = this.stack[this.stack.length - 2];
  t.type, t.checked = e.type === "taskListCheckValueChecked";
}
function lw(e) {
  const t = this.stack[this.stack.length - 2];
  if (t && t.type === "listItem" && typeof t.checked == "boolean") {
    const n = this.stack[this.stack.length - 1];
    n.type;
    const r = n.children[0];
    if (r && r.type === "text") {
      const i = t.children;
      let s = -1, o;
      for (; ++s < i.length; ) {
        const a = i[s];
        if (a.type === "paragraph") {
          o = a;
          break;
        }
      }
      o === n && (r.value = r.value.slice(1), r.value.length === 0 ? n.children.shift() : n.position && r.position && typeof r.position.start.offset == "number" && (r.position.start.column++, r.position.start.offset++, n.position.start = Object.assign({}, r.position.start)));
    }
  }
  this.exit(e);
}
function uw(e, t, n, r) {
  const i = e.children[0], s = typeof e.checked == "boolean" && i && i.type === "paragraph", o = "[" + (e.checked ? "x" : " ") + "] ", a = n.createTracker(r);
  s && a.move(o);
  let l = Ul.listItem(e, t, n, {
    ...r,
    ...a.current()
  });
  return s && (l = l.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, u)), l;
  function u(h) {
    return h + o;
  }
}
function cw() {
  return [
    Uy(),
    ux(),
    dx(),
    Zx(),
    ow()
  ];
}
function hw(e) {
  return {
    extensions: [
      Vy(),
      cx(e),
      px(),
      sw(e),
      aw()
    ]
  };
}
const fw = {
  tokenize: yw,
  partial: !0
}, Vl = {
  tokenize: xw,
  partial: !0
}, Hl = {
  tokenize: ww,
  partial: !0
}, ql = {
  tokenize: kw,
  partial: !0
}, dw = {
  tokenize: _w,
  partial: !0
}, Kl = {
  name: "wwwAutolink",
  tokenize: gw,
  previous: Jl
}, Wl = {
  name: "protocolAutolink",
  tokenize: bw,
  previous: Yl
}, Ve = {
  name: "emailAutolink",
  tokenize: mw,
  previous: Ql
}, Pe = {};
function pw() {
  return {
    text: Pe
  };
}
let Ze = 48;
for (; Ze < 123; )
  Pe[Ze] = Ve, Ze++, Ze === 58 ? Ze = 65 : Ze === 91 && (Ze = 97);
Pe[43] = Ve;
Pe[45] = Ve;
Pe[46] = Ve;
Pe[95] = Ve;
Pe[72] = [Ve, Wl];
Pe[104] = [Ve, Wl];
Pe[87] = [Ve, Kl];
Pe[119] = [Ve, Kl];
function mw(e, t, n) {
  const r = this;
  let i, s;
  return o;
  function o(c) {
    return !Gr(c) || !Ql.call(r, r.previous) || Ui(r.events) ? n(c) : (e.enter("literalAutolink"), e.enter("literalAutolinkEmail"), a(c));
  }
  function a(c) {
    return Gr(c) ? (e.consume(c), a) : c === 64 ? (e.consume(c), l) : n(c);
  }
  function l(c) {
    return c === 46 ? e.check(dw, h, u)(c) : c === 45 || c === 95 || te(c) ? (s = !0, e.consume(c), l) : h(c);
  }
  function u(c) {
    return e.consume(c), i = !0, l;
  }
  function h(c) {
    return s && i && ie(r.previous) ? (e.exit("literalAutolinkEmail"), e.exit("literalAutolink"), t(c)) : n(c);
  }
}
function gw(e, t, n) {
  const r = this;
  return i;
  function i(o) {
    return o !== 87 && o !== 119 || !Jl.call(r, r.previous) || Ui(r.events) ? n(o) : (e.enter("literalAutolink"), e.enter("literalAutolinkWww"), e.check(fw, e.attempt(Vl, e.attempt(Hl, s), n), n)(o));
  }
  function s(o) {
    return e.exit("literalAutolinkWww"), e.exit("literalAutolink"), t(o);
  }
}
function bw(e, t, n) {
  const r = this;
  let i = "", s = !1;
  return o;
  function o(c) {
    return (c === 72 || c === 104) && Yl.call(r, r.previous) && !Ui(r.events) ? (e.enter("literalAutolink"), e.enter("literalAutolinkHttp"), i += String.fromCodePoint(c), e.consume(c), a) : n(c);
  }
  function a(c) {
    if (ie(c) && i.length < 5)
      return i += String.fromCodePoint(c), e.consume(c), a;
    if (c === 58) {
      const f = i.toLowerCase();
      if (f === "http" || f === "https")
        return e.consume(c), l;
    }
    return n(c);
  }
  function l(c) {
    return c === 47 ? (e.consume(c), s ? u : (s = !0, l)) : n(c);
  }
  function u(c) {
    return c === null || An(c) || Y(c) || lt(c) || Gn(c) ? n(c) : e.attempt(Vl, e.attempt(Hl, h), n)(c);
  }
  function h(c) {
    return e.exit("literalAutolinkHttp"), e.exit("literalAutolink"), t(c);
  }
}
function yw(e, t, n) {
  let r = 0;
  return i;
  function i(o) {
    return (o === 87 || o === 119) && r < 3 ? (r++, e.consume(o), i) : o === 46 && r === 3 ? (e.consume(o), s) : n(o);
  }
  function s(o) {
    return o === null ? n(o) : t(o);
  }
}
function xw(e, t, n) {
  let r, i, s;
  return o;
  function o(u) {
    return u === 46 || u === 95 ? e.check(ql, l, a)(u) : u === null || Y(u) || lt(u) || u !== 45 && Gn(u) ? l(u) : (s = !0, e.consume(u), o);
  }
  function a(u) {
    return u === 95 ? r = !0 : (i = r, r = void 0), e.consume(u), o;
  }
  function l(u) {
    return i || r || !s ? n(u) : t(u);
  }
}
function ww(e, t) {
  let n = 0, r = 0;
  return i;
  function i(o) {
    return o === 40 ? (n++, e.consume(o), i) : o === 41 && r < n ? s(o) : o === 33 || o === 34 || o === 38 || o === 39 || o === 41 || o === 42 || o === 44 || o === 46 || o === 58 || o === 59 || o === 60 || o === 63 || o === 93 || o === 95 || o === 126 ? e.check(ql, t, s)(o) : o === null || Y(o) || lt(o) ? t(o) : (e.consume(o), i);
  }
  function s(o) {
    return o === 41 && r++, e.consume(o), i;
  }
}
function kw(e, t, n) {
  return r;
  function r(a) {
    return a === 33 || a === 34 || a === 39 || a === 41 || a === 42 || a === 44 || a === 46 || a === 58 || a === 59 || a === 63 || a === 95 || a === 126 ? (e.consume(a), r) : a === 38 ? (e.consume(a), s) : a === 93 ? (e.consume(a), i) : (
      // `<` is an end.
      a === 60 || // So is whitespace.
      a === null || Y(a) || lt(a) ? t(a) : n(a)
    );
  }
  function i(a) {
    return a === null || a === 40 || a === 91 || Y(a) || lt(a) ? t(a) : r(a);
  }
  function s(a) {
    return ie(a) ? o(a) : n(a);
  }
  function o(a) {
    return a === 59 ? (e.consume(a), r) : ie(a) ? (e.consume(a), o) : n(a);
  }
}
function _w(e, t, n) {
  return r;
  function r(s) {
    return e.consume(s), i;
  }
  function i(s) {
    return te(s) ? n(s) : t(s);
  }
}
function Jl(e) {
  return e === null || e === 40 || e === 42 || e === 95 || e === 91 || e === 93 || e === 126 || Y(e);
}
function Yl(e) {
  return !ie(e);
}
function Ql(e) {
  return !(e === 47 || Gr(e));
}
function Gr(e) {
  return e === 43 || e === 45 || e === 46 || e === 95 || te(e);
}
function Ui(e) {
  let t = e.length, n = !1;
  for (; t--; ) {
    const r = e[t][1];
    if ((r.type === "labelLink" || r.type === "labelImage") && !r._balanced) {
      n = !0;
      break;
    }
    if (r._gfmAutolinkLiteralWalkedInto) {
      n = !1;
      break;
    }
  }
  return e.length > 0 && !n && (e[e.length - 1][1]._gfmAutolinkLiteralWalkedInto = !0), n;
}
const Sw = {
  tokenize: Dw,
  partial: !0
};
function Cw() {
  return {
    document: {
      91: {
        name: "gfmFootnoteDefinition",
        tokenize: Aw,
        continuation: {
          tokenize: Tw
        },
        exit: Rw
      }
    },
    text: {
      91: {
        name: "gfmFootnoteCall",
        tokenize: Iw
      },
      93: {
        name: "gfmPotentialFootnoteCall",
        add: "after",
        tokenize: vw,
        resolveTo: Ew
      }
    }
  };
}
function vw(e, t, n) {
  const r = this;
  let i = r.events.length;
  const s = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let o;
  for (; i--; ) {
    const l = r.events[i][1];
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
    const u = ve(r.sliceSerialize({
      start: o.end,
      end: r.now()
    }));
    return u.codePointAt(0) !== 94 || !s.includes(u.slice(1)) ? n(l) : (e.enter("gfmFootnoteCallLabelMarker"), e.consume(l), e.exit("gfmFootnoteCallLabelMarker"), t(l));
  }
}
function Ew(e, t) {
  let n = e.length;
  for (; n--; )
    if (e[n][1].type === "labelImage" && e[n][0] === "enter") {
      e[n][1];
      break;
    }
  e[n + 1][1].type = "data", e[n + 3][1].type = "gfmFootnoteCallLabelMarker";
  const r = {
    type: "gfmFootnoteCall",
    start: Object.assign({}, e[n + 3][1].start),
    end: Object.assign({}, e[e.length - 1][1].end)
  }, i = {
    type: "gfmFootnoteCallMarker",
    start: Object.assign({}, e[n + 3][1].end),
    end: Object.assign({}, e[n + 3][1].end)
  };
  i.end.column++, i.end.offset++, i.end._bufferIndex++;
  const s = {
    type: "gfmFootnoteCallString",
    start: Object.assign({}, i.end),
    end: Object.assign({}, e[e.length - 1][1].start)
  }, o = {
    type: "chunkString",
    contentType: "string",
    start: Object.assign({}, s.start),
    end: Object.assign({}, s.end)
  }, a = [
    // Take the `labelImageMarker` (now `data`, the `!`)
    e[n + 1],
    e[n + 2],
    ["enter", r, t],
    // The `[`
    e[n + 3],
    e[n + 4],
    // The `^`.
    ["enter", i, t],
    ["exit", i, t],
    // Everything in between.
    ["enter", s, t],
    ["enter", o, t],
    ["exit", o, t],
    ["exit", s, t],
    // The ending (`]`, properly parsed and labelled).
    e[e.length - 2],
    e[e.length - 1],
    ["exit", r, t]
  ];
  return e.splice(n, e.length - n + 1, ...a), e;
}
function Iw(e, t, n) {
  const r = this, i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let s = 0, o;
  return a;
  function a(c) {
    return e.enter("gfmFootnoteCall"), e.enter("gfmFootnoteCallLabelMarker"), e.consume(c), e.exit("gfmFootnoteCallLabelMarker"), l;
  }
  function l(c) {
    return c !== 94 ? n(c) : (e.enter("gfmFootnoteCallMarker"), e.consume(c), e.exit("gfmFootnoteCallMarker"), e.enter("gfmFootnoteCallString"), e.enter("chunkString").contentType = "string", u);
  }
  function u(c) {
    if (
      // Too long.
      s > 999 || // Closing brace with nothing.
      c === 93 && !o || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      c === null || c === 91 || Y(c)
    )
      return n(c);
    if (c === 93) {
      e.exit("chunkString");
      const f = e.exit("gfmFootnoteCallString");
      return i.includes(ve(r.sliceSerialize(f))) ? (e.enter("gfmFootnoteCallLabelMarker"), e.consume(c), e.exit("gfmFootnoteCallLabelMarker"), e.exit("gfmFootnoteCall"), t) : n(c);
    }
    return Y(c) || (o = !0), s++, e.consume(c), c === 92 ? h : u;
  }
  function h(c) {
    return c === 91 || c === 92 || c === 93 ? (e.consume(c), s++, u) : u(c);
  }
}
function Aw(e, t, n) {
  const r = this, i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let s, o = 0, a;
  return l;
  function l(p) {
    return e.enter("gfmFootnoteDefinition")._container = !0, e.enter("gfmFootnoteDefinitionLabel"), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(p), e.exit("gfmFootnoteDefinitionLabelMarker"), u;
  }
  function u(p) {
    return p === 94 ? (e.enter("gfmFootnoteDefinitionMarker"), e.consume(p), e.exit("gfmFootnoteDefinitionMarker"), e.enter("gfmFootnoteDefinitionLabelString"), e.enter("chunkString").contentType = "string", h) : n(p);
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
      e.exit("chunkString");
      const y = e.exit("gfmFootnoteDefinitionLabelString");
      return s = ve(r.sliceSerialize(y)), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(p), e.exit("gfmFootnoteDefinitionLabelMarker"), e.exit("gfmFootnoteDefinitionLabel"), f;
    }
    return Y(p) || (a = !0), o++, e.consume(p), p === 92 ? c : h;
  }
  function c(p) {
    return p === 91 || p === 92 || p === 93 ? (e.consume(p), o++, h) : h(p);
  }
  function f(p) {
    return p === 58 ? (e.enter("definitionMarker"), e.consume(p), e.exit("definitionMarker"), i.includes(s) || i.push(s), U(e, d, "gfmFootnoteDefinitionWhitespace")) : n(p);
  }
  function d(p) {
    return t(p);
  }
}
function Tw(e, t, n) {
  return e.check(en, t, e.attempt(Sw, t, n));
}
function Rw(e) {
  e.exit("gfmFootnoteDefinition");
}
function Dw(e, t, n) {
  const r = this;
  return U(e, i, "gfmFootnoteDefinitionIndent", 5);
  function i(s) {
    const o = r.events[r.events.length - 1];
    return o && o[1].type === "gfmFootnoteDefinitionIndent" && o[2].sliceSerialize(o[1], !0).length === 4 ? t(s) : n(s);
  }
}
function Mw(e) {
  let n = (e || {}).singleTilde;
  const r = {
    name: "strikethrough",
    tokenize: s,
    resolveAll: i
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
  function i(o, a) {
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
            }, f = [["enter", h, a], ["enter", o[u][1], a], ["exit", o[u][1], a], ["enter", c, a]], d = a.parser.constructs.insideSpan.null;
            d && ce(f, f.length, 0, Xn(d, o.slice(u + 1, l), a)), ce(f, f.length, 0, [["exit", c, a], ["enter", o[l][1], a], ["exit", o[l][1], a], ["exit", h, a]]), ce(o, u - 1, l - u + 3, f), l = u + f.length - 2;
            break;
          }
      }
    for (l = -1; ++l < o.length; )
      o[l][1].type === "strikethroughSequenceTemporary" && (o[l][1].type = "data");
    return o;
  }
  function s(o, a, l) {
    const u = this.previous, h = this.events;
    let c = 0;
    return f;
    function f(p) {
      return u === 126 && h[h.length - 1][1].type !== "characterEscape" ? l(p) : (o.enter("strikethroughSequenceTemporary"), d(p));
    }
    function d(p) {
      const y = St(u);
      if (p === 126)
        return c > 1 ? l(p) : (o.consume(p), c++, d);
      if (c < 2 && !n) return l(p);
      const x = o.exit("strikethroughSequenceTemporary"), b = St(p);
      return x._open = !b || b === 2 && !!y, x._close = !y || y === 2 && !!b, a(p);
    }
  }
}
class Pw {
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
  add(t, n, r) {
    Nw(this, t, n, r);
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
  consume(t) {
    if (this.map.sort(function(s, o) {
      return s[0] - o[0];
    }), this.map.length === 0)
      return;
    let n = this.map.length;
    const r = [];
    for (; n > 0; )
      n -= 1, r.push(t.slice(this.map[n][0] + this.map[n][1]), this.map[n][2]), t.length = this.map[n][0];
    r.push(t.slice()), t.length = 0;
    let i = r.pop();
    for (; i; ) {
      for (const s of i)
        t.push(s);
      i = r.pop();
    }
    this.map.length = 0;
  }
}
function Nw(e, t, n, r) {
  let i = 0;
  if (!(n === 0 && r.length === 0)) {
    for (; i < e.map.length; ) {
      if (e.map[i][0] === t) {
        e.map[i][1] += n, e.map[i][2].push(...r);
        return;
      }
      i += 1;
    }
    e.map.push([t, n, r]);
  }
}
function Ow(e, t) {
  let n = !1;
  const r = [];
  for (; t < e.length; ) {
    const i = e[t];
    if (n) {
      if (i[0] === "enter")
        i[1].type === "tableContent" && r.push(e[t + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
      else if (i[1].type === "tableContent") {
        if (e[t - 1][1].type === "tableDelimiterMarker") {
          const s = r.length - 1;
          r[s] = r[s] === "left" ? "center" : "right";
        }
      } else if (i[1].type === "tableDelimiterRow")
        break;
    } else i[0] === "enter" && i[1].type === "tableDelimiterRow" && (n = !0);
    t += 1;
  }
  return r;
}
function Lw() {
  return {
    flow: {
      null: {
        name: "table",
        tokenize: Fw,
        resolveAll: Bw
      }
    }
  };
}
function Fw(e, t, n) {
  const r = this;
  let i = 0, s = 0, o;
  return a;
  function a(k) {
    let R = r.events.length - 1;
    for (; R > -1; ) {
      const N = r.events[R][1].type;
      if (N === "lineEnding" || // Note: markdown-rs uses `whitespace` instead of `linePrefix`
      N === "linePrefix") R--;
      else break;
    }
    const D = R > -1 ? r.events[R][1].type : null, H = D === "tableHead" || D === "tableRow" ? _ : l;
    return H === _ && r.parser.lazy[r.now().line] ? n(k) : H(k);
  }
  function l(k) {
    return e.enter("tableHead"), e.enter("tableRow"), u(k);
  }
  function u(k) {
    return k === 124 || (o = !0, s += 1), h(k);
  }
  function h(k) {
    return k === null ? n(k) : P(k) ? s > 1 ? (s = 0, r.interrupt = !0, e.exit("tableRow"), e.enter("lineEnding"), e.consume(k), e.exit("lineEnding"), d) : n(k) : z(k) ? U(e, h, "whitespace")(k) : (s += 1, o && (o = !1, i += 1), k === 124 ? (e.enter("tableCellDivider"), e.consume(k), e.exit("tableCellDivider"), o = !0, h) : (e.enter("data"), c(k)));
  }
  function c(k) {
    return k === null || k === 124 || Y(k) ? (e.exit("data"), h(k)) : (e.consume(k), k === 92 ? f : c);
  }
  function f(k) {
    return k === 92 || k === 124 ? (e.consume(k), c) : c(k);
  }
  function d(k) {
    return r.interrupt = !1, r.parser.lazy[r.now().line] ? n(k) : (e.enter("tableDelimiterRow"), o = !1, z(k) ? U(e, p, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(k) : p(k));
  }
  function p(k) {
    return k === 45 || k === 58 ? x(k) : k === 124 ? (o = !0, e.enter("tableCellDivider"), e.consume(k), e.exit("tableCellDivider"), y) : A(k);
  }
  function y(k) {
    return z(k) ? U(e, x, "whitespace")(k) : x(k);
  }
  function x(k) {
    return k === 58 ? (s += 1, o = !0, e.enter("tableDelimiterMarker"), e.consume(k), e.exit("tableDelimiterMarker"), b) : k === 45 ? (s += 1, b(k)) : k === null || P(k) ? M(k) : A(k);
  }
  function b(k) {
    return k === 45 ? (e.enter("tableDelimiterFiller"), S(k)) : A(k);
  }
  function S(k) {
    return k === 45 ? (e.consume(k), S) : k === 58 ? (o = !0, e.exit("tableDelimiterFiller"), e.enter("tableDelimiterMarker"), e.consume(k), e.exit("tableDelimiterMarker"), v) : (e.exit("tableDelimiterFiller"), v(k));
  }
  function v(k) {
    return z(k) ? U(e, M, "whitespace")(k) : M(k);
  }
  function M(k) {
    return k === 124 ? p(k) : k === null || P(k) ? !o || i !== s ? A(k) : (e.exit("tableDelimiterRow"), e.exit("tableHead"), t(k)) : A(k);
  }
  function A(k) {
    return n(k);
  }
  function _(k) {
    return e.enter("tableRow"), F(k);
  }
  function F(k) {
    return k === 124 ? (e.enter("tableCellDivider"), e.consume(k), e.exit("tableCellDivider"), F) : k === null || P(k) ? (e.exit("tableRow"), t(k)) : z(k) ? U(e, F, "whitespace")(k) : (e.enter("data"), $(k));
  }
  function $(k) {
    return k === null || k === 124 || Y(k) ? (e.exit("data"), F(k)) : (e.consume(k), k === 92 ? V : $);
  }
  function V(k) {
    return k === 92 || k === 124 ? (e.consume(k), $) : $(k);
  }
}
function Bw(e, t) {
  let n = -1, r = !0, i = 0, s = [0, 0, 0, 0], o = [0, 0, 0, 0], a = !1, l = 0, u, h, c;
  const f = new Pw();
  for (; ++n < e.length; ) {
    const d = e[n], p = d[1];
    d[0] === "enter" ? p.type === "tableHead" ? (a = !1, l !== 0 && (fo(f, t, l, u, h), h = void 0, l = 0), u = {
      type: "table",
      start: Object.assign({}, p.start),
      // Note: correct end is set later.
      end: Object.assign({}, p.end)
    }, f.add(n, 0, [["enter", u, t]])) : p.type === "tableRow" || p.type === "tableDelimiterRow" ? (r = !0, c = void 0, s = [0, 0, 0, 0], o = [0, n + 1, 0, 0], a && (a = !1, h = {
      type: "tableBody",
      start: Object.assign({}, p.start),
      // Note: correct end is set later.
      end: Object.assign({}, p.end)
    }, f.add(n, 0, [["enter", h, t]])), i = p.type === "tableDelimiterRow" ? 2 : h ? 3 : 1) : i && (p.type === "data" || p.type === "tableDelimiterMarker" || p.type === "tableDelimiterFiller") ? (r = !1, o[2] === 0 && (s[1] !== 0 && (o[0] = o[1], c = pn(f, t, s, i, void 0, c), s = [0, 0, 0, 0]), o[2] = n)) : p.type === "tableCellDivider" && (r ? r = !1 : (s[1] !== 0 && (o[0] = o[1], c = pn(f, t, s, i, void 0, c)), s = o, o = [s[1], n, 0, 0])) : p.type === "tableHead" ? (a = !0, l = n) : p.type === "tableRow" || p.type === "tableDelimiterRow" ? (l = n, s[1] !== 0 ? (o[0] = o[1], c = pn(f, t, s, i, n, c)) : o[1] !== 0 && (c = pn(f, t, o, i, n, c)), i = 0) : i && (p.type === "data" || p.type === "tableDelimiterMarker" || p.type === "tableDelimiterFiller") && (o[3] = n);
  }
  for (l !== 0 && fo(f, t, l, u, h), f.consume(t.events), n = -1; ++n < t.events.length; ) {
    const d = t.events[n];
    d[0] === "enter" && d[1].type === "table" && (d[1]._align = Ow(t.events, n));
  }
  return e;
}
function pn(e, t, n, r, i, s) {
  const o = r === 1 ? "tableHeader" : r === 2 ? "tableDelimiter" : "tableData", a = "tableContent";
  n[0] !== 0 && (s.end = Object.assign({}, bt(t.events, n[0])), e.add(n[0], 0, [["exit", s, t]]));
  const l = bt(t.events, n[1]);
  if (s = {
    type: o,
    start: Object.assign({}, l),
    // Note: correct end is set later.
    end: Object.assign({}, l)
  }, e.add(n[1], 0, [["enter", s, t]]), n[2] !== 0) {
    const u = bt(t.events, n[2]), h = bt(t.events, n[3]), c = {
      type: a,
      start: Object.assign({}, u),
      end: Object.assign({}, h)
    };
    if (e.add(n[2], 0, [["enter", c, t]]), r !== 2) {
      const f = t.events[n[2]], d = t.events[n[3]];
      if (f[1].end = Object.assign({}, d[1].end), f[1].type = "chunkText", f[1].contentType = "text", n[3] > n[2] + 1) {
        const p = n[2] + 1, y = n[3] - n[2] - 1;
        e.add(p, y, []);
      }
    }
    e.add(n[3] + 1, 0, [["exit", c, t]]);
  }
  return i !== void 0 && (s.end = Object.assign({}, bt(t.events, i)), e.add(i, 0, [["exit", s, t]]), s = void 0), s;
}
function fo(e, t, n, r, i) {
  const s = [], o = bt(t.events, n);
  i && (i.end = Object.assign({}, o), s.push(["exit", i, t])), r.end = Object.assign({}, o), s.push(["exit", r, t]), e.add(n + 1, 0, s);
}
function bt(e, t) {
  const n = e[t], r = n[0] === "enter" ? "start" : "end";
  return n[1][r];
}
const zw = {
  name: "tasklistCheck",
  tokenize: jw
};
function $w() {
  return {
    text: {
      91: zw
    }
  };
}
function jw(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    return (
      // Exit if there’s stuff before.
      r.previous !== null || // Exit if not in the first content that is the first child of a list
      // item.
      !r._gfmTasklistFirstContentOfListItem ? n(l) : (e.enter("taskListCheck"), e.enter("taskListCheckMarker"), e.consume(l), e.exit("taskListCheckMarker"), s)
    );
  }
  function s(l) {
    return Y(l) ? (e.enter("taskListCheckValueUnchecked"), e.consume(l), e.exit("taskListCheckValueUnchecked"), o) : l === 88 || l === 120 ? (e.enter("taskListCheckValueChecked"), e.consume(l), e.exit("taskListCheckValueChecked"), o) : n(l);
  }
  function o(l) {
    return l === 93 ? (e.enter("taskListCheckMarker"), e.consume(l), e.exit("taskListCheckMarker"), e.exit("taskListCheck"), a) : n(l);
  }
  function a(l) {
    return P(l) ? t(l) : z(l) ? e.check({
      tokenize: Uw
    }, t, n)(l) : n(l);
  }
}
function Uw(e, t, n) {
  return U(e, r, "whitespace");
  function r(i) {
    return i === null ? n(i) : t(i);
  }
}
function Vw(e) {
  return sl([
    pw(),
    Cw(),
    Mw(e),
    Lw(),
    $w()
  ]);
}
const Hw = {};
function qw(e) {
  const t = (
    /** @type {Processor<Root>} */
    this
  ), n = e || Hw, r = t.data(), i = r.micromarkExtensions || (r.micromarkExtensions = []), s = r.fromMarkdownExtensions || (r.fromMarkdownExtensions = []), o = r.toMarkdownExtensions || (r.toMarkdownExtensions = []);
  i.push(Vw(n)), s.push(cw()), o.push(hw(n));
}
const Kw = $n.EnergonContentView, Vi = ct.cn, Ww = {
  a({ children: e, node: t, ...n }) {
    return /* @__PURE__ */ w("a", { ...n, target: "_blank", rel: "noreferrer", children: e });
  }
}, Jw = [qw], Yw = Fn(function({
  text: t,
  streaming: n = !1,
  error: r = !1,
  className: i
}) {
  return t ? /* @__PURE__ */ w(
    Kw,
    {
      output: { text: Gl(t) },
      streaming: n,
      markdownClassName: Xl,
      className: Vi(
        "agent-chat-markdown",
        r && "[&_*]:text-destructive",
        i
      )
    }
  ) : null;
});
function Gl(e) {
  return String(e || "").replace(/\r\n/g, `
`).replace(
    /([。！？!?：:；;])([ \t\u00a0\u3000]*)(#{1,6})(?!#)([ \t\u00a0\u3000]+)(?=\S)/g,
    `$1

$3 `
  ).replace(
    /(^|\n)([ \t\u00a0\u3000]{0,3})(#{1,6})(?!#)([ \t\u00a0\u3000]*)(?=\S)/g,
    Qw
  );
}
function Qw(e, t, n, r, i) {
  return r.length === 1 && i.length === 0 ? e : `${t}${n}${r} `;
}
const E_ = Fn(function({
  error: t
}) {
  return /* @__PURE__ */ w(
    Ly,
    {
      skipHtml: !0,
      defer: !0,
      smooth: {
        drainMs: 180,
        maxCharIntervalMs: 18,
        maxCharsPerFrame: 28,
        minCommitMs: 16
      },
      remarkPlugins: Jw,
      components: Ww,
      preprocess: Gl,
      className: Vi(
        Xl,
        "agent-chat-markdown",
        t && "text-destructive"
      )
    }
  );
}), Xl = Vi(
  "min-w-0 text-base leading-7 text-foreground",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
  "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground",
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em]",
  "[&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:text-2xl [&_h1]:font-semibold",
  "[&_h2]:mb-2.5 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold",
  "[&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold",
  "[&_h4]:mb-1.5 [&_h4]:mt-3 [&_h4]:text-base [&_h4]:font-semibold",
  "[&_h5]:mb-1.5 [&_h5]:mt-3 [&_h5]:text-base [&_h5]:font-medium",
  "[&_h6]:mb-1.5 [&_h6]:mt-3 [&_h6]:text-sm [&_h6]:font-medium [&_h6]:text-muted-foreground",
  "[&_hr]:my-4 [&_hr]:border-border",
  "[&_img]:my-4 [&_img]:block [&_img]:max-w-full [&_img]:rounded-lg",
  "[&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_p]:my-2 [&_pre]:my-3 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:bg-muted/60",
  "[&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_strong]:font-semibold [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse",
  "[&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1",
  "[&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left",
  "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6"
), Mn = ct.cn, Gw = /* @__PURE__ */ new Set(["image", "video", "audio", "file"]), Xw = /* @__PURE__ */ new Set(["knowledge", "skill"]);
function Zw({
  activity: e
}) {
  if (!e)
    return null;
  const t = st(e.output), n = yi(e.output);
  if (Object.keys(n).length > 0 || gd(e.output)) {
    const i = e.aspectRatio || (e.kind === "video" ? "16 / 9" : "4 / 3");
    return /* @__PURE__ */ w(
      "div",
      {
        className: "agent-chat-media-result",
        "data-kind": e.kind,
        style: {
          "--agent-chat-media-aspect-ratio": i
        },
        children: /* @__PURE__ */ w(
          dd,
          {
            output: e.output,
            className: "agent-chat-activity-output"
          }
        )
      }
    );
  }
  return /* @__PURE__ */ w(ek, { activity: e, artifactCount: t.length });
}
function ek({
  activity: e,
  artifactCount: t
}) {
  const n = tk(e.kind), r = Gw.has(e.kind), i = e.status === "failed";
  if (Xw.has(e.kind))
    return /* @__PURE__ */ w("div", { className: "mt-2 max-w-2xl py-1 text-muted-foreground", children: /* @__PURE__ */ w(po, { activity: e }) });
  if (i || !r)
    return /* @__PURE__ */ w(
      "div",
      {
        className: Mn(
          "mt-4 max-w-2xl rounded-lg border bg-muted/20 px-3.5 py-3",
          i && "border-destructive/30 bg-destructive/5"
        ),
        children: /* @__PURE__ */ w(po, { activity: e })
      }
    );
  const s = Math.min(8, Math.max(1, t || e.count)), o = e.kind === "image" || e.kind === "video", a = e.aspectRatio || (e.kind === "video" ? "16 / 9" : "4 / 3");
  return /* @__PURE__ */ w(
    "div",
    {
      role: "status",
      "aria-label": e.text || e.title,
      className: "agent-chat-media-grid mt-4",
      "data-count": s,
      children: Array.from({ length: s }, (l, u) => /* @__PURE__ */ B(
        "div",
        {
          className: Mn(
            "agent-chat-media-placeholder relative flex overflow-hidden rounded-lg border bg-muted/30",
            e.kind === "audio" || e.kind === "file" ? "h-24 items-center justify-start px-5" : "items-center justify-center"
          ),
          style: o ? { aspectRatio: a } : void 0,
          children: [
            /* @__PURE__ */ w(n, { className: "agent-chat-media-placeholder-icon relative size-7 text-muted-foreground/35" }),
            /* @__PURE__ */ w(Ct, { className: "agent-chat-media-spinner absolute right-3 top-3 z-[2] size-4 text-muted-foreground/55" }),
            e.progress != null ? /* @__PURE__ */ w(
              "span",
              {
                className: "absolute bottom-0 left-0 z-[2] h-1 bg-foreground/15 transition-[width] duration-300",
                style: { width: `${e.progress}%` }
              }
            ) : null
          ]
        },
        `${e.id}-${u}`
      ))
    }
  );
}
function po({ activity: e }) {
  const t = nk(e.status), n = e.status === "failed", r = e.error || e.text || e.title;
  return /* @__PURE__ */ B(
    "div",
    {
      className: Mn(
        "flex min-w-0 items-center gap-2 text-sm text-muted-foreground",
        n && "text-destructive"
      ),
      children: [
        /* @__PURE__ */ w(
          t,
          {
            className: Mn(
              "size-4 shrink-0",
              e.status === "running" && "animate-spin"
            )
          }
        ),
        /* @__PURE__ */ w("span", { className: "min-w-0 flex-1 truncate", children: r }),
        e.progress != null && e.status === "running" ? /* @__PURE__ */ B("span", { className: "shrink-0 tabular-nums", children: [
          e.progress,
          "%"
        ] }) : null
      ]
    }
  );
}
function tk(e) {
  switch (e) {
    case "image":
      return Bn;
    case "video":
      return zn;
    case "audio":
      return Au;
    case "file":
      return ut;
    case "knowledge":
      return ku;
    default:
      return $u;
  }
}
function nk(e) {
  return e === "succeeded" ? wu : e === "failed" ? ei : Ct;
}
const mo = ct.cn;
function rk({
  documentID: e,
  enabled: t,
  contentRef: n,
  scrollRef: r
}) {
  const [i, s] = Re([]), [o, a] = Re(""), l = i.map((h) => h.id).join(`
`);
  de(() => {
    if (!t)
      return;
    const h = n.current;
    if (!h)
      return;
    let c = 0;
    const f = () => {
      window.cancelAnimationFrame(c), c = window.requestAnimationFrame(() => {
        const p = ik(h, e);
        s(
          (y) => sk(y, p) ? y : p
        ), a(
          (y) => p.some((x) => x.id === y) ? y : p[0]?.id || ""
        );
      });
    };
    f();
    const d = new MutationObserver(f);
    return d.observe(h, {
      childList: !0,
      characterData: !0,
      subtree: !0
    }), () => {
      d.disconnect(), window.cancelAnimationFrame(c);
    };
  }, [n, e, t]), de(() => {
    if (!t || !l)
      return;
    const h = r.current, c = n.current;
    if (!h || !c)
      return;
    const f = /* @__PURE__ */ new Map(), d = new IntersectionObserver(
      (p) => {
        for (const x of p)
          x.isIntersecting ? f.set(x.target.id, x.boundingClientRect.top) : f.delete(x.target.id);
        const y = Array.from(f.entries()).sort(
          (x, b) => x[1] - b[1]
        )[0];
        y && a(y[0]);
      },
      {
        root: h,
        rootMargin: "-24px 0px -68% 0px",
        threshold: [0, 1]
      }
    );
    for (const p of l.split(`
`)) {
      const y = document.getElementById(p);
      y && c.contains(y) && d.observe(y);
    }
    return () => d.disconnect();
  }, [n, t, l, r]);
  const u = _e(
    (h) => {
      const c = r.current, f = n.current, d = document.getElementById(h);
      if (!c || !f || !d || !f.contains(d))
        return;
      const p = c.getBoundingClientRect().top, y = d.getBoundingClientRect().top, x = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      c.scrollTo({
        top: c.scrollTop + y - p - 24,
        behavior: x ? "auto" : "smooth"
      }), a(h);
    },
    [n, r]
  );
  return { items: i, activeID: o, selectItem: u };
}
function go({
  items: e,
  activeID: t,
  className: n,
  onSelect: r
}) {
  if (e.length === 0)
    return null;
  const i = Math.min(...e.map((s) => s.level));
  return /* @__PURE__ */ w("nav", { "aria-label": "文档目录", className: mo("py-1", n), children: e.map((s) => {
    const o = s.id === t;
    return /* @__PURE__ */ w(
      "button",
      {
        type: "button",
        className: mo(
          "block w-full border-l-2 py-1.5 pr-3 text-left text-sm leading-5 transition-colors",
          o ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
        ),
        style: {
          paddingLeft: 12 + Math.min(s.level - i, 2) * 12
        },
        title: s.title,
        "aria-current": o ? "location" : void 0,
        onClick: () => r(s.id),
        children: /* @__PURE__ */ w("span", { className: "line-clamp-2", children: s.title })
      },
      s.id
    );
  }) });
}
function ik(e, t) {
  const n = /* @__PURE__ */ new Map();
  return Array.from(
    e.querySelectorAll(
      "[data-agent-document-block-id] h1, [data-agent-document-block-id] h2, [data-agent-document-block-id] h3, [data-agent-document-block-id] h4"
    )
  ).flatMap((r) => {
    const i = String(r.textContent || "").replace(/\s+/g, " ").trim(), o = r.closest(
      "[data-agent-document-block-id]"
    )?.dataset.agentDocumentBlockId || "";
    if (!i || !o)
      return [];
    const a = n.get(o) || 0;
    n.set(o, a + 1);
    const l = `agent-document-${t}-block-${o}-heading-${a}`;
    return r.id = l, r.dataset.agentDocumentHeading = "true", [
      {
        id: l,
        level: Number(r.tagName.slice(1)) || 2,
        title: i
      }
    ];
  });
}
function sk(e, t) {
  return e.length === t.length && e.every(
    (n, r) => n.id === t[r]?.id && n.level === t[r]?.level && n.title === t[r]?.title
  );
}
const ok = 64;
function ak({
  documentID: e,
  contentVersion: t,
  enabled: n,
  pending: r
}) {
  const i = ue(null), s = ue(null), o = ue(null), a = ue(""), l = ue(!1), u = ue(0), [h, c] = Re(!0), f = _e(() => {
    const x = s.current;
    if (!x)
      return !0;
    const b = x.scrollHeight - x.scrollTop - x.clientHeight <= ok;
    return c(
      (S) => S === b ? S : b
    ), b;
  }, []), d = _e((x = "auto") => {
    const b = s.current;
    b && (l.current = !0, b.scrollTo({ top: b.scrollHeight, behavior: x }), u.current = b.scrollTop, c(!0));
  }, []), p = _e(() => {
    o.current != null && window.cancelAnimationFrame(o.current), o.current = window.requestAnimationFrame(() => {
      if (o.current = null, l.current) {
        d();
        return;
      }
      f();
    });
  }, [d, f]);
  de(() => {
    const x = n ? String(e) : "";
    if (!x) {
      a.current = "", l.current = !1;
      return;
    }
    if (a.current === x) {
      r && f() && (l.current = !0);
      return;
    }
    a.current = x, l.current = r;
    const b = s.current;
    b && !r && (b.scrollTop = 0), u.current = b?.scrollTop || 0, p();
  }, [e, n, r, p, f]), fu(() => {
    n && p();
  }, [t, n, p]), de(() => {
    if (!n)
      return;
    const x = i.current;
    if (!x)
      return;
    const b = new ResizeObserver(p);
    return b.observe(x), p(), () => b.disconnect();
  }, [e, n, p]), de(
    () => () => {
      o.current != null && window.cancelAnimationFrame(o.current);
    },
    []
  );
  const y = _e(() => {
    const x = s.current;
    if (!x)
      return;
    const b = x.scrollTop < u.current - 1, S = f();
    b ? l.current = !1 : S && (l.current = !0), u.current = x.scrollTop;
  }, [f]);
  return {
    atBottom: h,
    contentRef: i,
    handleScroll: y,
    scrollRef: s,
    scrollToBottom: d
  };
}
function lk({
  document: e,
  running: t,
  error: n
}) {
  const r = t && e.status === "writing" && e.blocks.length > 0;
  return /* @__PURE__ */ B("div", { className: "agent-chat-document min-w-0", children: [
    e.title ? /* @__PURE__ */ w("h1", { className: "mb-5 text-xl font-semibold leading-tight", children: e.title }) : null,
    e.blocks.map(
      (i) => i.type === "media" ? /* @__PURE__ */ w(ck, { block: i }, i.id) : /* @__PURE__ */ w(
        uk,
        {
          block: i,
          title: e.title,
          error: n
        },
        i.id
      )
    ),
    e.blocks.length === 0 && t ? /* @__PURE__ */ w(fk, {}) : null,
    e.blocks.length === 0 && e.status === "failed" ? /* @__PURE__ */ w(dk, { message: pk(e) }) : null,
    r ? /* @__PURE__ */ w(bo, {}) : null,
    !t && Yn(e) ? /* @__PURE__ */ w(bo, {}) : null
  ] });
}
function uk({
  block: e,
  title: t,
  error: n
}) {
  const r = ka(e.text, t);
  return r ? /* @__PURE__ */ w("div", { "data-agent-document-block-id": e.id, children: /* @__PURE__ */ w(
    Yw,
    {
      text: r,
      error: n,
      className: "agent-chat-document-text"
    }
  ) }) : null;
}
function ck({ block: e }) {
  return e.status === "failed" ? /* @__PURE__ */ B("div", { className: "my-4 flex items-center gap-2 text-sm text-destructive", children: [
    /* @__PURE__ */ w(ei, { className: "size-4 shrink-0" }),
    /* @__PURE__ */ B("span", { children: [
      Xr(e.mediaKind),
      "生成失败"
    ] })
  ] }) : /* @__PURE__ */ w(Zw, { activity: hk(e) });
}
function hk(e) {
  const t = Number(e.meta.progress), n = _a(e);
  return {
    id: `document-block-${e.id}`,
    title: `${Xr(e.mediaKind)}生成`,
    kind: e.mediaKind,
    status: n ? "succeeded" : "running",
    text: typeof e.meta.progress_text == "string" ? e.meta.progress_text : `${Xr(e.mediaKind)}生成中`,
    error: "",
    progress: Number.isFinite(t) ? Math.max(0, Math.min(100, Math.round(t))) : null,
    count: Math.max(1, e.artifacts.length),
    aspectRatio: En(
      e.meta,
      e.artifacts.map((r) => r.meta)
    ) || (e.mediaKind === "video" ? "16 / 9" : "4 / 3"),
    anchorText: "",
    output: { artifacts: e.artifacts }
  };
}
function Xr(e) {
  return e === "image" ? "图片" : e === "video" ? "视频" : e === "audio" ? "音频" : "文件";
}
function fk() {
  return /* @__PURE__ */ w(
    "div",
    {
      role: "status",
      "aria-label": "正在组织图文内容",
      className: "agent-chat-waiting-indicator",
      children: [0, 1, 2].map((e) => /* @__PURE__ */ w(
        "span",
        {
          className: "agent-chat-waiting-dot",
          style: { animationDelay: `${e * 140}ms` }
        },
        e
      ))
    }
  );
}
function dk({ message: e }) {
  return /* @__PURE__ */ B("div", { className: "flex items-center gap-2 text-sm text-destructive", children: [
    /* @__PURE__ */ w(ei, { className: "size-4 shrink-0" }),
    /* @__PURE__ */ w("span", { children: e })
  ] });
}
function pk(e) {
  const t = e.meta.error;
  return typeof t == "string" && t.trim() ? t.trim() : "文档生成失败，请重新生成。";
}
function bo() {
  return /* @__PURE__ */ w(
    "div",
    {
      role: "status",
      "aria-label": "正在继续生成图文内容",
      className: "agent-chat-next-step-indicator",
      children: /* @__PURE__ */ w("span", { className: "agent-chat-pulse-dot" })
    }
  );
}
const mn = ko.Button, mk = Gt.Sheet, gk = Gt.SheetContent, bk = Gt.SheetDescription, yk = Gt.SheetHeader, xk = Gt.SheetTitle, Rr = ct.cn;
function I_({
  document: e,
  onOpen: t
}) {
  const n = Yn(e);
  return /* @__PURE__ */ B(
    "button",
    {
      type: "button",
      className: "mt-3 flex items-center gap-3 rounded-md border bg-background px-3 py-2.5 text-left transition-colors hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      style: { width: "min(100%, 28rem)" },
      "aria-label": `打开文档：${e.title || "生成的文档"}`,
      onClick: () => t(e),
      children: [
        /* @__PURE__ */ w("span", { className: "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/70 text-muted-foreground", children: /* @__PURE__ */ w(ut, { className: "size-4" }) }),
        /* @__PURE__ */ B("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ w("span", { className: "block truncate text-sm font-medium text-foreground", children: e.title || "生成的文档" }),
          /* @__PURE__ */ w("span", { className: "mt-0.5 block text-xs text-muted-foreground", children: n ? "正在生成" : Zl(e.status) })
        ] }),
        n ? /* @__PURE__ */ w(Ct, { className: "size-4 shrink-0 animate-spin text-muted-foreground" }) : /* @__PURE__ */ w(bu, { className: "size-4 shrink-0 text-muted-foreground" })
      ]
    }
  );
}
function A_({
  open: e,
  portalContainer: t,
  document: n,
  messageID: r,
  renderArtifactActions: i,
  renderDocumentActions: s,
  onClose: o
}) {
  const [a, l] = Re(!1), [u, h] = Re(!1), c = ue(!1), f = ue(null), d = ue(null), p = ue(null), y = n.status === "failed", x = Yn(n), b = ak({
    documentID: n.id,
    contentVersion: wk(n),
    enabled: e,
    pending: x
  }), S = rk({
    documentID: n.id,
    enabled: e,
    contentRef: b.contentRef,
    scrollRef: b.scrollRef
  }), v = S.items.length >= 2;
  de(() => {
    h(!1);
  }, [n.id, e]), de(() => {
    if (!u)
      return;
    const A = (F) => {
      const $ = F.target;
      !($ instanceof Node) || d.current?.contains($) || p.current?.contains($) || h(!1);
    }, _ = (F) => {
      F.key === "Escape" && h(!1);
    };
    return window.document.addEventListener(
      "pointerdown",
      A,
      !0
    ), window.document.addEventListener("keydown", _), () => {
      window.document.removeEventListener(
        "pointerdown",
        A,
        !0
      ), window.document.removeEventListener("keydown", _);
    };
  }, [u]), de(
    () => () => {
      f.current != null && window.clearTimeout(f.current);
    },
    []
  );
  const M = async () => {
    const A = Nf(n);
    if (A.trim()) {
      c.current = !0;
      try {
        await xu(A);
      } catch {
        return;
      } finally {
        c.current = !1;
      }
      l(!0), f.current != null && window.clearTimeout(f.current), f.current = window.setTimeout(() => {
        l(!1), f.current = null;
      }, 1800);
    }
  };
  return /* @__PURE__ */ w(
    mk,
    {
      open: e,
      modal: !1,
      onOpenChange: (A) => {
        A || o();
      },
      children: /* @__PURE__ */ B(
        gk,
        {
          container: t,
          side: "right",
          showCloseButton: !1,
          showOverlay: !1,
          "data-assistant-layer": "true",
          layerZIndex: yu,
          onOpenAutoFocus: (A) => {
            A.preventDefault(), b.scrollRef.current?.focus({ preventScroll: !0 });
          },
          onFocusOutside: (A) => {
            c.current && A.preventDefault();
          },
          onInteractOutside: (A) => {
            c.current && A.preventDefault();
          },
          className: "flex w-[94vw] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none md:w-[72vw] xl:w-[64vw] 2xl:w-[1120px]",
          children: [
            /* @__PURE__ */ B(yk, { className: "flex h-14 shrink-0 flex-row items-center gap-3 border-b px-5 py-0 text-start", children: [
              /* @__PURE__ */ w(ut, { className: "size-4 shrink-0 text-muted-foreground" }),
              /* @__PURE__ */ B("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ w(xk, { className: "truncate text-sm", children: n.title || "生成的文档" }),
                /* @__PURE__ */ B(
                  bk,
                  {
                    className: Rr(
                      "mt-0.5 flex items-center gap-1.5 text-xs",
                      y ? "text-destructive" : "text-muted-foreground"
                    ),
                    children: [
                      x && !y ? /* @__PURE__ */ w(Ct, { className: "size-3 animate-spin" }) : null,
                      /* @__PURE__ */ w("span", { children: y ? "生成失败" : x ? n.status === "writing" ? "正文生成中" : "素材生成中" : Zl(n.status) })
                    ]
                  }
                )
              ] }),
              v ? /* @__PURE__ */ w(yt, { label: "查看文档目录", children: /* @__PURE__ */ B(
                mn,
                {
                  ref: d,
                  type: "button",
                  size: "sm",
                  variant: "ghost",
                  className: "h-8 shrink-0 gap-1.5 px-2 xl:hidden",
                  "aria-label": "查看文档目录",
                  "aria-haspopup": "dialog",
                  "aria-expanded": u,
                  onClick: () => h((A) => !A),
                  children: [
                    /* @__PURE__ */ w(Du, { className: "size-4" }),
                    /* @__PURE__ */ w("span", { className: "hidden sm:inline", children: "目录" })
                  ]
                }
              ) }) : null,
              s?.({
                messageID: r,
                document: n,
                running: x,
                error: y
              }),
              /* @__PURE__ */ w(yt, { label: a ? "已复制" : "复制文档", children: /* @__PURE__ */ w(
                mn,
                {
                  type: "button",
                  size: "icon",
                  variant: "ghost",
                  className: "size-8 shrink-0",
                  "aria-label": a ? "文档已复制" : "复制文档",
                  disabled: !n.blocks.length,
                  onClick: () => {
                    M();
                  },
                  children: a ? /* @__PURE__ */ w(gu, { className: "size-4" }) : /* @__PURE__ */ w(pu, { className: "size-4" })
                }
              ) }),
              /* @__PURE__ */ w(yt, { label: "关闭文档", children: /* @__PURE__ */ w(
                mn,
                {
                  type: "button",
                  size: "icon",
                  variant: "ghost",
                  className: "size-8 shrink-0",
                  "aria-label": "关闭文档",
                  onClick: o,
                  children: /* @__PURE__ */ w(wo, { className: "size-4" })
                }
              ) })
            ] }),
            v && u ? /* @__PURE__ */ B(
              "div",
              {
                ref: p,
                role: "dialog",
                "aria-label": "文档目录",
                "data-assistant-layer": "true",
                className: "absolute right-4 top-14 z-50 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md xl:hidden",
                style: { width: "min(20rem, calc(100% - 2rem))" },
                children: [
                  /* @__PURE__ */ w("div", { className: "border-b px-4 py-3 text-sm font-medium", children: "目录" }),
                  /* @__PURE__ */ w("div", { className: "max-h-[60vh] overflow-y-auto px-2 py-2 overscroll-contain", children: /* @__PURE__ */ w(
                    go,
                    {
                      items: S.items,
                      activeID: S.activeID,
                      onSelect: (A) => {
                        S.selectItem(A), h(!1);
                      }
                    }
                  ) })
                ]
              }
            ) : null,
            /* @__PURE__ */ B(
              "div",
              {
                className: Rr(
                  "min-h-0 flex-1",
                  v && "xl:grid xl:grid-cols-[13rem_minmax(0,1fr)]"
                ),
                children: [
                  /* @__PURE__ */ w(
                    "aside",
                    {
                      className: Rr(
                        "hidden min-h-0 flex-col border-r bg-muted/10",
                        v && "xl:flex"
                      ),
                      children: v ? /* @__PURE__ */ B(Pn, { children: [
                        /* @__PURE__ */ w("div", { className: "shrink-0 px-5 pb-2 pt-8 text-xs font-medium text-muted-foreground", children: "目录" }),
                        /* @__PURE__ */ w("div", { className: "min-h-0 flex-1 overflow-y-auto px-3 pb-6 overscroll-contain", children: /* @__PURE__ */ w(
                          go,
                          {
                            items: S.items,
                            activeID: S.activeID,
                            onSelect: S.selectItem
                          }
                        ) })
                      ] }) : null
                    }
                  ),
                  /* @__PURE__ */ B("div", { className: "relative h-full min-h-0", children: [
                    /* @__PURE__ */ w(
                      "div",
                      {
                        ref: b.scrollRef,
                        tabIndex: -1,
                        className: "h-full min-h-0 overflow-y-auto overscroll-contain focus:outline-none",
                        style: { scrollbarGutter: "stable" },
                        onScroll: b.handleScroll,
                        children: /* @__PURE__ */ w(
                          "div",
                          {
                            ref: b.contentRef,
                            className: "mx-auto w-full max-w-3xl px-6 py-8 md:px-9 md:py-10",
                            children: /* @__PURE__ */ w(
                              Jf,
                              {
                                messageID: r,
                                render: i,
                                children: /* @__PURE__ */ w(
                                  lk,
                                  {
                                    document: n,
                                    running: x,
                                    error: y
                                  }
                                )
                              }
                            )
                          }
                        )
                      }
                    ),
                    b.atBottom ? null : /* @__PURE__ */ w(yt, { label: "回到底部", children: /* @__PURE__ */ w(
                      mn,
                      {
                        type: "button",
                        size: "icon",
                        variant: "outline",
                        className: "absolute bottom-4 right-4 z-10 size-9 rounded-full bg-background shadow-sm",
                        "aria-label": "回到底部",
                        onClick: () => b.scrollToBottom("smooth"),
                        children: /* @__PURE__ */ w(mu, { className: "size-4" })
                      }
                    ) })
                  ] })
                ]
              }
            )
          ]
        }
      )
    }
  );
}
function wk(e) {
  const t = e.blocks.map((n) => {
    const r = n.artifacts.map(
      (i) => `${i.id}:${i.status}:${i.url}:${i.previewUrl}`
    ).join(",");
    return [
      n.id,
      n.status,
      n.text.length,
      n.text.slice(-64),
      String(n.meta.stream_revision || ""),
      r
    ].join(":");
  });
  return [e.status, e.pendingJobCount, ...t].join("|");
}
function Zl(e) {
  return e === "failed" ? "生成失败" : e === "partial_failed" ? "部分素材生成失败" : e === "ready" ? "已生成" : e === "generating" ? "素材生成中" : "正文生成中";
}
const Qt = Me.isPlainRecord, kk = 8;
function T_(e) {
  if (!Qt(e) || !Qt(e.interaction))
    return;
  const t = e.interaction, n = We(t.id), r = Array.isArray(t.fields) ? t.fields : [];
  if (!(!n || r.length === 0))
    return {
      ...t,
      id: n,
      type: We(t.type) || "form",
      presentation: We(t.presentation),
      title: We(t.title) || "需要补充信息",
      description: We(t.description),
      fields: r
    };
}
function R_(e) {
  if (!Qt(e) || !Array.isArray(e.suggestions))
    return [];
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const r of e.suggestions) {
    if (!Qt(r))
      continue;
    const i = We(r.label), s = We(r.prompt);
    if (!(!i || !s || t.has(s)) && (t.add(s), n.push({ label: i, prompt: s }), n.length === kk))
      break;
  }
  return n;
}
function D_(e) {
  return Qt(e) ? We(e.message) : "";
}
function M_(e, t) {
  for (const n of e) {
    if (n.role !== "user")
      continue;
    const r = n.content?.interaction_response;
    if (r?.interaction_id === t)
      return { data: r.data };
  }
}
function We(e) {
  return e == null ? "" : String(e).trim();
}
const _k = Cu.AgentInteractionPanel, eu = ct.cn;
function P_({
  interaction: e,
  response: t,
  disabled: n,
  onSubmit: r
}) {
  return /* @__PURE__ */ B(
    "div",
    {
      "data-presentation": e.presentation || "form",
      className: eu(
        "agent-chat-interaction mt-5",
        e.presentation === "stepper" ? "w-full" : "max-w-2xl"
      ),
      children: [
        t ? null : /* @__PURE__ */ B(
          "div",
          {
            role: "status",
            "aria-live": "polite",
            className: "mb-3 flex items-center gap-2 text-sm text-muted-foreground",
            children: [
              /* @__PURE__ */ w("span", { className: "agent-chat-pulse-dot" }),
              /* @__PURE__ */ w("span", { children: "等待补充信息" })
            ]
          }
        ),
        /* @__PURE__ */ w(
          _k,
          {
            interaction: e,
            disabled: n,
            readonly: !!t,
            initialData: t?.data,
            onSubmit: r
          }
        )
      ]
    }
  );
}
function N_({
  suggestions: e,
  disabled: t,
  onSelect: n
}) {
  return e.length === 0 ? null : /* @__PURE__ */ w("div", { className: "agent-chat-suggestions mt-5 flex flex-wrap gap-2", children: e.map((r) => /* @__PURE__ */ w(yt, { label: r.prompt, children: /* @__PURE__ */ B(
    "button",
    {
      type: "button",
      disabled: t,
      className: eu(
        "group inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-left text-sm leading-5 text-foreground shadow-sm transition-colors",
        "hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50"
      ),
      onClick: () => n(r),
      children: [
        /* @__PURE__ */ w("span", { className: "truncate", children: r.label }),
        /* @__PURE__ */ w(Eu, { className: "size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" })
      ]
    }
  ) }, r.prompt)) });
}
export {
  s_ as $,
  Zw as A,
  he as B,
  Kk as C,
  Hc as D,
  Yo as E,
  ci as F,
  Jk as G,
  Xk as H,
  Gk as I,
  jo as J,
  Zk as K,
  fi as L,
  Pu as M,
  Xo as N,
  Qk as O,
  Yk as P,
  Ch as Q,
  Ih as R,
  e_ as S,
  Ah as T,
  os as U,
  Bu as V,
  ui as W,
  Xt as X,
  of as Y,
  zh as Z,
  o_ as _,
  Ou as a,
  kh as a0,
  nf as a1,
  af as a2,
  gi as a3,
  Wn as a4,
  i_ as a5,
  la as a6,
  Lr as a7,
  r_ as a8,
  fs as a9,
  Vd as aA,
  y_ as aB,
  x_ as aC,
  m_ as aD,
  M_ as aE,
  D_ as aF,
  Jf as aG,
  Yw as aH,
  E_ as aI,
  P_ as aJ,
  k_ as aK,
  Nf as aL,
  u_ as aM,
  h_ as aN,
  c_ as aO,
  t_ as aa,
  ga as ab,
  n_ as ac,
  Qh as ad,
  Yh as ae,
  uf as af,
  ps as ag,
  Kt as ah,
  cf as ai,
  Ef as aj,
  yf as ak,
  sc as al,
  Wk as am,
  f_ as an,
  p_ as ao,
  d_ as ap,
  v_ as aq,
  S_ as ar,
  l_ as as,
  Yn as at,
  g_ as au,
  st as av,
  b_ as aw,
  __ as ax,
  w_ as ay,
  Ud as az,
  T_ as b,
  Pd as c,
  It as d,
  C_ as e,
  Bf as f,
  a_ as g,
  Pf as h,
  za as i,
  dd as j,
  I_ as k,
  N_ as l,
  Nd as m,
  xi as n,
  A_ as o,
  Zf as p,
  ht as q,
  R_ as r,
  be as s,
  Qd as t,
  Se as u,
  X as v,
  Qo as w,
  mi as x,
  De as y,
  aa as z
};
