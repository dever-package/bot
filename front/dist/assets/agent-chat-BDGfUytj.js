import { c as so, j as d, a as V, F as xe } from "./createLucideIcon-Gw0gLVQ5.js";
import { R as Fe, J as le, k as no, G as pn, e as L, s as ae, N as ps, O as mt, P as et, H as ro, b as ie, u as X, a as ee, c as ht, g as oo } from "./runtime-entry-CkPHMDB1.js";
import { c as io, m as fn, a as jt, u as nt } from "./stream-DlOGAsXV.js";
import { A as ao } from "./arrow-left-CNjrQxkH.js";
import { P as gn } from "./plus-rAwvnIn1.js";
import { X as co } from "./x-CDJG94MJ.js";
import { m as lo } from "./store-BeRODhS3.js";
import { m as bt } from "./utils-DDwUJ6_F.js";
import { m as Gt } from "./button-DF4roUfC.js";
import { m as fe } from "./dialog-C65rQcQf.js";
import { q as te, s as y, u as pe, v as de, w as uo, x as Q, y as ve, z as M, B as Ue, D as mo, E as vn, F as ye, G as ho, H as bn, I as xn, J as po, K as Wt, L as ze, N as Yt, O as be, P as _e, Q as fo, R as fs, S as Ve, T as Se, U as go, W as yn, X as Qt, Y as vo, Z as pt, _ as bo, $ as xo, a0 as yo, a1 as _n, a2 as _o, a3 as wo, a4 as Dt, a5 as wn, a6 as To, a7 as Io, a8 as So, a9 as gs, aa as Co, ab as Ro, ac as Eo, ad as Mo, ae as Ao, af as Po, ag as Tn, ah as Jt, ai as Zt, aj as ko, ak as Do, al as It, am as ft, t as In, an as $o, c as Sn, n as No, ao as Oo, ap as Bo, f as xt, e as Lo, g as Cn, m as Fo, aq as Vo, ar as vs, d as qo, as as Uo, at as gt, au as zo, av as Rn, aw as Ho, ax as jo, ay as Go, az as Ye, aA as bs, aB as Wo, aC as Yo, aD as Qo, C as Jo, h as Zo, b as Xo, aE as Ko, r as ei, aF as ti, aG as si, aH as xs, k as ni, aI as ri, A as oi, j as ii, aJ as ai, aK as ci, l as li, aL as ui, aM as di, o as mi, aN as hi, aO as pi } from "./interaction-view-D5EpJ7sz.js";
import { L as ut } from "./loader-circle-3ZsHTZm7.js";
import { f as fi, c as gi } from "./react-dom-C2oimP4o.js";
import { E as vi } from "./ellipsis-Dnz6zolG.js";
import { P as bi } from "./pencil-WDd5tOSC.js";
import { T as xi } from "./trash-2-Cga0ORNu.js";
import { m as yi } from "./input-CELCGXqo.js";
import { A as En, a as dt, c as _i, b as wi, d as Ti } from "./clipboard-B5e8l_LF.js";
import { m as yt } from "./runtime-stream-runner-5OE2JsJo.js";
import { A as Ii, C as Si } from "./copy-Cai3ZDxm.js";
import { B as Ci } from "./bot-D8R22pEh.js";
import { C as Ri } from "./check-_lGX5Mgn.js";
import { C as Ei } from "./chevron-down-DXFjwlDo.js";
const Mi = [
  [
    "path",
    {
      d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      key: "18887p"
    }
  ]
], Ai = so("message-square", Mi), Pi = () => {
  const t = y(4), [e, s] = pe(Di);
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
        [c]: u.renderers[c]?.filter((m) => m !== l) ?? []
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
}, ki = te(Pi);
function Di() {
  return {
    renderers: {},
    fallbacks: []
  };
}
const $t = [], $i = {
  modelName: void 0,
  toolNames: $t
}, Ni = (t, e) => t === e || t.length === e.length && t.every((s, n) => s === e[n]), rt = (t, e) => {
  const s = t.getModelContext(), n = s.config?.modelName, r = s.tools ? Object.keys(s.tools).sort() : $t, o = r.length ? r : $t;
  return n === e.modelName && Ni(o, e.toolNames) ? e : {
    modelName: n,
    toolNames: o
  };
}, Oi = () => {
  const t = y(11);
  let e;
  t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (e = new uo(), t[0] = e) : e = t[0];
  const s = e;
  let n;
  t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (n = () => rt(s, $i), t[1] = n) : n = t[1];
  const [r, o] = pe(n);
  let i, a;
  t[2] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (i = () => (o((h) => rt(s, h)), s.subscribe(() => {
    o((h) => rt(s, h));
  })), a = [s], t[2] = i, t[3] = a) : (i = t[2], a = t[3]), de(i, a);
  let c;
  t[4] !== r ? (c = () => rt(s, r), t[4] = r, t[5] = c) : c = t[5];
  let l, u, m;
  t[6] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (l = () => s.getModelContext(), u = (h) => s.subscribe(h), m = (h) => s.registerModelContextProvider(h), t[6] = l, t[7] = u, t[8] = m) : (l = t[6], u = t[7], m = t[8]);
  let p;
  return t[9] !== c ? (p = {
    getState: c,
    getModelContext: l,
    subscribe: u,
    register: m
  }, t[9] = c, t[10] = p) : p = t[10], p;
}, Mn = te(Oi), Bi = (t) => t.display !== void 0 ? t.display === "standalone" : t.type === "human", Li = (t, e) => {
  if (!(e.status?.type === "running" || e.status?.type === "requires-action")) {
    const n = t.complete;
    return typeof n != "function" ? n ?? null : n({
      args: e.args,
      result: e.result
    });
  }
  const s = t.running;
  return typeof s != "function" ? s ?? null : s({ args: e.args });
}, Fi = (t) => function(s) {
  return Li(t, s);
}, Vi = (t) => {
  const e = Q(), s = ve(!1), n = s.current ? null : t(e);
  return M(() => s.current ? t(e) : n), () => (s.current = !0, t(e));
}, qi = Object.freeze({});
function _t(t) {
  const e = y(3), { getItemState: s, children: n } = t, r = Vi(s);
  let o;
  return e[0] !== n || e[1] !== r ? (o = n(r), e[0] = n, e[1] = r, e[2] = o) : o = e[2], Ui(o);
}
const Ui = (t) => {
  const e = typeof t == "object" && t != null && "type" in t ? t : null, s = e?.type, n = e?.key;
  return Ue(() => e, [
    s,
    n,
    typeof e?.props == "object" && e.props != null && Object.entries(e.props).length === 0 ? qi : e?.props
  ]) ?? t;
}, zi = Fe.createContext(!0);
function ys() {
  throw new Error("A function wrapped in useEffectEvent can't be called during rendering.");
}
const Hi = "use" in Fe ? () => {
  try {
    return Fe.use(zi);
  } catch {
    return !1;
  }
} : () => !1;
function ji(t) {
  const e = Fe.useRef(ys);
  return Fe.useInsertionEffect(() => {
    e.current = t;
  }, [t]), (...s) => {
    Hi() && ys();
    const n = e.current;
    return n(...s);
  };
}
const vt = (t, e) => {
  const s = y(11), n = Q(), r = ji(e);
  let o;
  s[0] !== t ? (o = mo(t), s[0] = t, s[1] = o) : o = s[1];
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
  ], s[7] = n, s[8] = a, s[9] = i, s[10] = l) : l = s[10], de(c, l);
}, Gi = (t) => {
  if (t.key === void 0) throw new Error("useClientLookup: Element has no key");
  return t.key;
};
function Ae(t) {
  const e = y(15);
  let s;
  e[0] !== t ? (s = t.map(Qi), e[0] = t, e[1] = s) : s = e[1];
  const n = vn(s);
  let r;
  e[2] !== n ? (r = Object.keys(n), e[2] = n, e[3] = r) : r = e[3];
  const o = r;
  let i;
  e[4] !== n ? (i = n.reduce(Yi, {}), e[4] = n, e[5] = i) : i = e[5];
  const a = i;
  let c;
  e[6] !== n ? (c = n.map(Wi), e[6] = n, e[7] = c) : c = e[7];
  const l = c;
  let u;
  e[8] !== a || e[9] !== o || e[10] !== n ? (u = (p) => {
    if ("index" in p) {
      if (p.index < 0 || o.length === 0) throw new Error(`useClientLookup: Index ${p.index} out of bounds (length: ${o.length})`);
      const g = Math.min(p.index, o.length - 1);
      return g !== p.index && console.warn(`useClientLookup: Clamped stale index ${p.index} to ${g} (length: ${o.length})`), n[g].methods;
    }
    const h = a[p.key];
    if (h === void 0) throw new Error(`useClientLookup: Key "${p.key}" not found`);
    return n[h].methods;
  }, e[8] = a, e[9] = o, e[10] = n, e[11] = u) : u = e[11];
  let m;
  return e[12] !== l || e[13] !== u ? (m = {
    state: l,
    get: u
  }, e[12] = l, e[13] = u, e[14] = m) : m = e[14], m;
}
function Wi(t) {
  return t.state;
}
function Yi(t, e, s) {
  return t[e.key] = s, t;
}
function Qi(t) {
  return ye(Gi(t), ho(t), t.deps);
}
const An = (t) => {
  const e = y(15), { toolkit: s, mcpApp: n } = t;
  let r;
  e[0] !== n ? (r = n ? [ye("mcpApp", n)] : [], e[0] = n, e[1] = r) : r = e[1];
  const o = vn(r)[0], [i, a] = pe(Zi);
  let c;
  e[2] !== i ? (c = Object.fromEntries(Object.entries(i).map(Ki)), e[2] = i, e[3] = c) : c = e[3];
  let l;
  e[4] !== o || e[5] !== c || e[6] !== i ? (l = {
    toolUIs: i,
    mcpApp: o,
    tools: c
  }, e[4] = o, e[5] = c, e[6] = i, e[7] = l) : l = e[7];
  const u = l, m = bn();
  let p;
  e[8] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (p = (C, D, R) => {
    const v = {
      render: D,
      standalone: R?.standalone ?? !1
    };
    return a((b) => ({
      ...b,
      [C]: [...b[C] ?? [], v]
    })), () => {
      a((b) => {
        const I = b[C]?.filter((T) => T !== v) ?? [];
        if (I.length > 0) return {
          ...b,
          [C]: I
        };
        const _ = { ...b };
        return delete _[C], _;
      });
    };
  }, e[8] = p) : p = e[8];
  const h = p;
  let g, w;
  e[9] !== m || e[10] !== s ? (g = () => {
    if (!s) return;
    const C = [];
    for (const [R, v] of Object.entries(s)) {
      const b = "render" in v ? v.render : void 0, I = "renderText" in v ? v.renderText : void 0, _ = b ?? (I ? Fi(I) : void 0);
      _ && C.push(h(R, _, { standalone: Bi(v) }));
    }
    const D = Object.entries(s).reduce(ea, {});
    return C.push(m.current.modelContext().register({ getModelContext: () => ({ tools: D }) })), () => {
      C.forEach(ta);
    };
  }, w = [
    s,
    h,
    m
  ], e[9] = m, e[10] = s, e[11] = g, e[12] = w) : (g = e[11], w = e[12]), de(g, w);
  let x;
  return e[13] !== u ? (x = {
    getState: () => u,
    setToolUI: h
  }, e[13] = u, e[14] = x) : x = e[14], x;
}, Ji = te(An);
xn(An, (t, e) => {
  !t.modelContext && e.modelContext.source === null && (t.modelContext = Mn());
});
function Zi() {
  return {};
}
function Xi(t) {
  return t.render;
}
function Ki(t) {
  const [e, s] = t;
  return [e, s.map(Xi)];
}
function ea(t, e) {
  const [s, n] = e;
  if (n.type === "mcp") return t;
  const { display: r, render: o, renderText: i, ...a } = n;
  return t[s] = a, t;
}
function ta(t) {
  return t();
}
const Pe = (t) => po(t.subscribe, t.getState), sa = (t) => {
  const e = y(8), { runtime: s } = t, n = Pe(s);
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
}, Pn = te(sa), na = (t) => {
  const e = y(5), { runtime: s, index: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getAttachmentByIndex(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const o = r;
  let i;
  return e[3] !== o ? (i = Pn({ runtime: o }), e[3] = o, e[4] = i) : i = e[4], ze(i);
}, ra = te(na), oa = ({ item: t, onSteer: e, onRemove: s }) => ({
  getState: () => t,
  steer: e,
  remove: s
}), ia = te(oa), aa = (t) => {
  const e = y(55), { threadIdRef: s, messageIdRef: n, runtime: r } = t, o = Pe(r), i = Wt();
  let a, c;
  e[0] !== i || e[1] !== n || e[2] !== r || e[3] !== s ? (a = () => {
    const _ = [];
    for (const T of ["send", "attachmentAdd"]) {
      const $ = r.unstable_on(T, () => {
        i(`composer.${T}`, {
          threadId: s.current,
          ...n && { messageId: n.current }
        });
      });
      _.push($);
    }
    return _.push(r.unstable_on("attachmentAddError", (T) => {
      i("composer.attachmentAddError", {
        threadId: s.current,
        ...n && { messageId: n.current },
        ...T.attachmentId && { attachmentId: T.attachmentId },
        reason: T.reason,
        message: T.message
      });
    })), () => {
      for (const T of _) T();
    };
  }, c = [
    r,
    i,
    s,
    n
  ], e[0] = i, e[1] = n, e[2] = r, e[3] = s, e[4] = a, e[5] = c) : (a = e[4], c = e[5]), de(a, c);
  let l;
  if (e[6] !== r || e[7] !== o.attachments) {
    let _;
    e[9] !== r ? (_ = (T, $) => ye(T.id, ra({
      runtime: r,
      index: $
    }), [r, $]), e[9] = r, e[10] = _) : _ = e[10], l = o.attachments.map(_), e[6] = r, e[7] = o.attachments, e[8] = l;
  } else l = e[8];
  const u = Ae(l), m = o.queue;
  let p;
  if (e[11] !== m || e[12] !== r) {
    let _;
    e[14] !== r ? (_ = (T) => ye(T.id, ia({
      item: T,
      onSteer: () => r.steerQueueItem(T.id),
      onRemove: () => r.removeQueueItem(T.id)
    })), e[14] = r, e[15] = _) : _ = e[15], p = m.map(_), e[11] = m, e[12] = r, e[13] = p;
  } else p = e[13];
  const h = Ae(p), g = o.type ?? "thread";
  let w;
  e[16] !== u.state || e[17] !== m || e[18] !== o.attachmentAccept || e[19] !== o.canCancel || e[20] !== o.canSend || e[21] !== o.dictation || e[22] !== o.isEditing || e[23] !== o.isEmpty || e[24] !== o.quote || e[25] !== o.role || e[26] !== o.runConfig || e[27] !== o.text || e[28] !== g ? (w = {
    text: o.text,
    role: o.role,
    attachments: u.state,
    runConfig: o.runConfig,
    isEditing: o.isEditing,
    canCancel: o.canCancel,
    canSend: o.canSend,
    attachmentAccept: o.attachmentAccept,
    isEmpty: o.isEmpty,
    type: g,
    dictation: o.dictation,
    quote: o.quote,
    queue: m
  }, e[16] = u.state, e[17] = m, e[18] = o.attachmentAccept, e[19] = o.canCancel, e[20] = o.canSend, e[21] = o.dictation, e[22] = o.isEditing, e[23] = o.isEmpty, e[24] = o.quote, e[25] = o.role, e[26] = o.runConfig, e[27] = o.text, e[28] = g, e[29] = w) : w = e[29];
  const x = w;
  let C;
  e[30] !== x ? (C = () => x, e[30] = x, e[31] = C) : C = e[31];
  const D = r.beginEdit ?? ca;
  let R;
  e[32] !== u ? (R = (_) => "id" in _ ? u.get({ key: _.id }) : u.get(_), e[32] = u, e[33] = R) : R = e[33];
  let v;
  e[34] !== h ? (v = (_) => h.get(_), e[34] = h, e[35] = v) : v = e[35];
  let b;
  e[36] !== r ? (b = () => r, e[36] = r, e[37] = b) : b = e[37];
  let I;
  return e[38] !== r.addAttachment || e[39] !== r.cancel || e[40] !== r.clearAttachments || e[41] !== r.reset || e[42] !== r.send || e[43] !== r.setQuote || e[44] !== r.setRole || e[45] !== r.setRunConfig || e[46] !== r.setText || e[47] !== r.startDictation || e[48] !== r.stopDictation || e[49] !== v || e[50] !== b || e[51] !== C || e[52] !== D || e[53] !== R ? (I = {
    getState: C,
    setText: r.setText,
    setRole: r.setRole,
    setRunConfig: r.setRunConfig,
    addAttachment: r.addAttachment,
    reset: r.reset,
    clearAttachments: r.clearAttachments,
    send: r.send,
    cancel: r.cancel,
    beginEdit: D,
    startDictation: r.startDictation,
    stopDictation: r.stopDictation,
    setQuote: r.setQuote,
    attachment: R,
    queueItem: v,
    __internal_getRuntime: b
  }, e[38] = r.addAttachment, e[39] = r.cancel, e[40] = r.clearAttachments, e[41] = r.reset, e[42] = r.send, e[43] = r.setQuote, e[44] = r.setRole, e[45] = r.setRunConfig, e[46] = r.setText, e[47] = r.startDictation, e[48] = r.stopDictation, e[49] = v, e[50] = b, e[51] = C, e[52] = D, e[53] = R, e[54] = I) : I = e[54], I;
}, kn = te(aa);
function ca() {
  throw new Error("beginEdit is not supported in this runtime");
}
const Dn = (t) => ({ get current() {
  return t();
} }), la = (t) => {
  const e = y(13), { runtime: s } = t, n = Pe(s);
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
}, ua = te(la), da = (t) => {
  const e = y(5), { runtime: s, index: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getAttachmentByIndex(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const o = r;
  let i;
  return e[3] !== o ? (i = Pn({ runtime: o }), e[3] = o, e[4] = i) : i = e[4], ze(i);
}, ma = te(da), ha = (t) => {
  const e = y(5), { runtime: s, index: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getMessagePartByIndex(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const o = r;
  let i;
  return e[3] !== o ? (i = ua({ runtime: o }), e[3] = o, e[4] = i) : i = e[4], ze(i);
}, pa = te(ha), fa = (t) => {
  const e = y(55), { runtime: s, threadIdRef: n } = t, r = Pe(s), [o, i] = pe(!1), [a, c] = pe(!1);
  let l;
  e[0] !== s ? (l = Dn(() => s.getState().id), e[0] = s, e[1] = l) : l = e[1];
  const u = l;
  let m;
  e[2] !== u || e[3] !== s.composer || e[4] !== n ? (m = kn({
    runtime: s.composer,
    threadIdRef: n,
    messageIdRef: u
  }), e[2] = u, e[3] = s.composer, e[4] = n, e[5] = m) : m = e[5];
  const p = Yt(m);
  let h;
  if (e[6] !== s || e[7] !== r.content) {
    let G;
    e[9] !== s ? (G = (re, K) => ye("toolCallId" in re && re.toolCallId != null ? `toolCallId-${re.toolCallId}` : `index-${K}`, pa({
      runtime: s,
      index: K
    }), [s, K]), e[9] = s, e[10] = G) : G = e[10], h = r.content.map(G), e[6] = s, e[7] = r.content, e[8] = h;
  } else h = e[8];
  const g = Ae(h);
  let w;
  e[11] !== r.attachments ? (w = r.attachments ?? [], e[11] = r.attachments, e[12] = w) : w = e[12];
  let x;
  if (e[13] !== s || e[14] !== w) {
    let G;
    e[16] !== s ? (G = (re, K) => ye(re.id, ma({
      runtime: s,
      index: K
    }), [s, K]), e[16] = s, e[17] = G) : G = e[17], x = w.map(G), e[13] = s, e[14] = w, e[15] = x;
  } else x = e[15];
  const C = Ae(x), D = r;
  let R;
  e[18] !== p.state || e[19] !== o || e[20] !== a || e[21] !== g.state || e[22] !== D ? (R = {
    ...D,
    parts: g.state,
    composer: p.state,
    isCopied: o,
    isHovering: a
  }, e[18] = p.state, e[19] = o, e[20] = a, e[21] = g.state, e[22] = D, e[23] = R) : R = e[23];
  const v = R;
  let b;
  e[24] !== v ? (b = () => v, e[24] = v, e[25] = b) : b = e[25];
  let I;
  e[26] !== p.methods ? (I = () => p.methods, e[26] = p.methods, e[27] = I) : I = e[27];
  let _, T, $, k, z, B, U;
  e[28] !== s ? (_ = () => s.delete(), T = (G) => s.reload(G), $ = () => s.speak(), k = () => s.stopSpeaking(), z = (G) => s.submitFeedback(G), B = (G) => s.switchToBranch(G), U = () => s.unstable_getCopyText(), e[28] = s, e[29] = _, e[30] = T, e[31] = $, e[32] = k, e[33] = z, e[34] = B, e[35] = U) : (_ = e[29], T = e[30], $ = e[31], k = e[32], z = e[33], B = e[34], U = e[35]);
  let W;
  e[36] !== g ? (W = (G) => "index" in G ? g.get({ index: G.index }) : g.get({ key: `toolCallId-${G.toolCallId}` }), e[36] = g, e[37] = W) : W = e[37];
  let J;
  e[38] !== C ? (J = (G) => "id" in G ? C.get({ key: G.id }) : C.get(G), e[38] = C, e[39] = J) : J = e[39];
  let Y;
  e[40] !== s ? (Y = () => s, e[40] = s, e[41] = Y) : Y = e[41];
  let se;
  return e[42] !== _ || e[43] !== T || e[44] !== $ || e[45] !== k || e[46] !== z || e[47] !== B || e[48] !== U || e[49] !== W || e[50] !== J || e[51] !== Y || e[52] !== b || e[53] !== I ? (se = {
    getState: b,
    composer: I,
    delete: _,
    reload: T,
    speak: $,
    stopSpeaking: k,
    submitFeedback: z,
    switchToBranch: B,
    getCopyText: U,
    part: W,
    attachment: J,
    setIsCopied: i,
    setIsHovering: c,
    __internal_getRuntime: Y
  }, e[42] = _, e[43] = T, e[44] = $, e[45] = k, e[46] = z, e[47] = B, e[48] = U, e[49] = W, e[50] = J, e[51] = Y, e[52] = b, e[53] = I, e[54] = se) : se = e[54], se;
}, ga = te(fa), va = (t) => {
  const e = y(6), { runtime: s, id: n, threadIdRef: r } = t;
  let o;
  e[0] !== n || e[1] !== s ? (o = s.getMessageById(n), e[0] = n, e[1] = s, e[2] = o) : o = e[2];
  const i = o;
  let a;
  return e[3] !== i || e[4] !== r ? (a = ga({
    runtime: i,
    threadIdRef: r
  }), e[3] = i, e[4] = r, e[5] = a) : a = e[5], ze(a);
}, ba = te(va), xa = (t) => {
  const e = y(59), { runtime: s } = t, n = Pe(s), r = Wt();
  let o, i;
  e[0] !== r || e[1] !== s ? (o = () => {
    const b = [];
    for (const I of [
      "runStart",
      "runEnd",
      "initialize",
      "modelContextUpdate"
    ]) {
      const _ = s.unstable_on(I, () => {
        const T = s.getState()?.threadId || "unknown";
        r(`thread.${I}`, { threadId: T });
      });
      b.push(_);
    }
    return () => {
      for (const I of b) I();
    };
  }, i = [s, r], e[0] = r, e[1] = s, e[2] = o, e[3] = i) : (o = e[2], i = e[3]), de(o, i);
  let a;
  e[4] !== s ? (a = Dn(() => s.getState().threadId), e[4] = s, e[5] = a) : a = e[5];
  const c = a;
  let l;
  e[6] !== s.composer || e[7] !== c ? (l = kn({
    runtime: s.composer,
    threadIdRef: c
  }), e[6] = s.composer, e[7] = c, e[8] = l) : l = e[8];
  const u = Yt(l);
  let m;
  if (e[9] !== s || e[10] !== n.messages || e[11] !== c) {
    let b;
    e[13] !== s || e[14] !== c ? (b = (I) => ye(I.id, ba({
      runtime: s,
      id: I.id,
      threadIdRef: c
    }), [
      s,
      I.id,
      c
    ]), e[13] = s, e[14] = c, e[15] = b) : b = e[15], m = n.messages.map(b), e[9] = s, e[10] = n.messages, e[11] = c, e[12] = m;
  } else m = e[12];
  const p = Ae(m), h = p.state.length === 0 && !n.isLoading;
  let g;
  e[16] !== u.state || e[17] !== p.state || e[18] !== n.capabilities || e[19] !== n.extras || e[20] !== n.isDisabled || e[21] !== n.isLoading || e[22] !== n.isRunning || e[23] !== n.speech || e[24] !== n.state || e[25] !== n.suggestions || e[26] !== n.voice || e[27] !== h ? (g = {
    isEmpty: h,
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
  }, e[16] = u.state, e[17] = p.state, e[18] = n.capabilities, e[19] = n.extras, e[20] = n.isDisabled, e[21] = n.isLoading, e[22] = n.isRunning, e[23] = n.speech, e[24] = n.state, e[25] = n.suggestions, e[26] = n.voice, e[27] = h, e[28] = g) : g = e[28];
  const w = g;
  let x;
  e[29] !== w ? (x = () => w, e[29] = w, e[30] = x) : x = e[30];
  let C;
  e[31] !== u.methods ? (C = () => u.methods, e[31] = u.methods, e[32] = C) : C = e[32];
  let D;
  e[33] !== p ? (D = (b) => "id" in b ? p.get({ key: b.id }) : p.get(b), e[33] = p, e[34] = D) : D = e[34];
  let R;
  e[35] !== s ? (R = () => s, e[35] = s, e[36] = R) : R = e[36];
  let v;
  return e[37] !== s.append || e[38] !== s.cancelRun || e[39] !== s.connectVoice || e[40] !== s.deleteMessage || e[41] !== s.disconnectVoice || e[42] !== s.export || e[43] !== s.getModelContext || e[44] !== s.getVoiceVolume || e[45] !== s.import || e[46] !== s.importExternalState || e[47] !== s.muteVoice || e[48] !== s.reset || e[49] !== s.resumeRun || e[50] !== s.startRun || e[51] !== s.stopSpeaking || e[52] !== s.subscribeVoiceVolume || e[53] !== s.unmuteVoice || e[54] !== D || e[55] !== R || e[56] !== x || e[57] !== C ? (v = {
    getState: x,
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
    message: D,
    __internal_getRuntime: R
  }, e[37] = s.append, e[38] = s.cancelRun, e[39] = s.connectVoice, e[40] = s.deleteMessage, e[41] = s.disconnectVoice, e[42] = s.export, e[43] = s.getModelContext, e[44] = s.getVoiceVolume, e[45] = s.import, e[46] = s.importExternalState, e[47] = s.muteVoice, e[48] = s.reset, e[49] = s.resumeRun, e[50] = s.startRun, e[51] = s.stopSpeaking, e[52] = s.subscribeVoiceVolume, e[53] = s.unmuteVoice, e[54] = D, e[55] = R, e[56] = x, e[57] = C, e[58] = v) : v = e[58], v;
}, ya = te(xa), _a = (t) => {
  const e = y(20), { runtime: s } = t, n = Pe(s), r = Wt();
  let o, i;
  e[0] !== r || e[1] !== s ? (o = () => {
    const u = [];
    for (const m of ["switchedTo", "switchedAway"]) {
      const p = s.unstable_on(m, () => {
        r(`threadListItem.${m}`, { threadId: s.getState().id });
      });
      u.push(p);
    }
    return () => {
      for (const m of u) m();
    };
  }, i = [s, r], e[0] = r, e[1] = s, e[2] = o, e[3] = i) : (o = e[2], i = e[3]), de(o, i);
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
}, wa = te(_a), Ta = (t) => {
  const e = y(5), { runtime: s, id: n } = t;
  let r;
  e[0] !== n || e[1] !== s ? (r = s.getItemById(n), e[0] = n, e[1] = s, e[2] = r) : r = e[2];
  const o = r;
  let i;
  return e[3] !== o ? (i = wa({ runtime: o }), e[3] = o, e[4] = i) : i = e[4], ze(i);
}, Ia = te(Ta), Sa = (t) => {
  const e = y(40), { runtime: s, __internal_assistantRuntime: n } = t, r = Pe(s);
  let o;
  e[0] !== s.main ? (o = ya({ runtime: s.main }), e[0] = s.main, e[1] = o) : o = e[1];
  const i = Yt(o);
  let a;
  e[2] !== s || e[3] !== r.threadItems ? (a = Object.keys(r.threadItems).map((I) => ye(I, Ia({
    runtime: s,
    id: I
  }), [s, I])), e[2] = s, e[3] = r.threadItems, e[4] = a) : a = e[4];
  const c = Ae(a), l = r.newThreadId ?? null;
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
  const m = u;
  let p;
  e[15] !== m ? (p = () => m, e[15] = m, e[16] = p) : p = e[16];
  let h;
  e[17] !== i.methods ? (h = () => i.methods, e[17] = i.methods, e[18] = h) : h = e[18];
  let g;
  e[19] !== m || e[20] !== c ? (g = (I) => {
    if (I === "main") return c.get({ key: m.mainThreadId });
    if ("id" in I) return c.get({ key: I.id });
    const { index: _, archived: T } = I, $ = T !== void 0 && T ? m.archivedThreadIds[_] : m.threadIds[_];
    return c.get({ key: $ });
  }, e[19] = m, e[20] = c, e[21] = g) : g = e[21];
  let w, x, C, D, R;
  e[22] !== s ? (D = async (I, _) => {
    await s.switchToThread(I, _);
  }, R = async () => {
    await s.switchToNewThread();
  }, w = () => s.getLoadThreadsPromise(), x = () => s.reload(), C = () => s.loadMore(), e[22] = s, e[23] = w, e[24] = x, e[25] = C, e[26] = D, e[27] = R) : (w = e[23], x = e[24], C = e[25], D = e[26], R = e[27]);
  let v;
  e[28] !== n ? (v = () => n, e[28] = n, e[29] = v) : v = e[29];
  let b;
  return e[30] !== w || e[31] !== x || e[32] !== C || e[33] !== v || e[34] !== p || e[35] !== h || e[36] !== g || e[37] !== D || e[38] !== R ? (b = {
    getState: p,
    thread: h,
    item: g,
    switchToThread: D,
    switchToNewThread: R,
    getLoadThreadsPromise: w,
    reload: x,
    loadMore: C,
    __internal_getAssistantRuntime: v
  }, e[30] = w, e[31] = x, e[32] = C, e[33] = v, e[34] = p, e[35] = h, e[36] = g, e[37] = D, e[38] = R, e[39] = b) : b = e[39], b;
}, Ca = te(Sa), Ra = (t) => ({ getState: () => t }), Ea = te(Ra), Ma = (t) => {
  const e = y(11);
  let s;
  e[0] !== t ? (s = () => ({ suggestions: (t ?? []).map(Pa) }), e[0] = t, e[1] = s) : s = e[1];
  const [n] = pe(s);
  let r;
  e[2] !== n.suggestions ? (r = n.suggestions.map(ka), e[2] = n.suggestions, e[3] = r) : r = e[3];
  const o = Ae(r);
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
}, Aa = te(Ma);
function Pa(t) {
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
function ka(t, e) {
  return ye(e, Ea(t), [t]);
}
const Da = (t, e) => {
  t.thread ??= be({
    source: "threads",
    query: { type: "main" },
    get: (s) => s.threads().thread("main")
  }), t.threadListItem ??= be({
    source: "threads",
    query: { type: "main" },
    get: (s) => s.threads().item("main")
  }), t.composer ??= be({
    source: "thread",
    query: {},
    get: (s) => s.threads().thread("main").composer()
  }), !t.modelContext && e.modelContext.source === null && (t.modelContext = Mn()), !t.suggestions && e.suggestions.source === null && (t.suggestions = Aa());
}, $n = (t) => {
  const e = y(6), s = bn();
  let n, r;
  e[0] !== s || e[1] !== t ? (n = () => t.registerModelContextProvider(s.current.modelContext()), r = [t, s], e[0] = s, e[1] = t, e[2] = n, e[3] = r) : (n = e[2], r = e[3]), de(n, r);
  let o;
  return e[4] !== t ? (o = Ca({
    runtime: t.threads,
    __internal_assistantRuntime: t
  }), e[4] = t, e[5] = o) : o = e[5], ze(o);
}, $a = te($n);
xn($n, (t, e) => {
  Da(t, e), !t.tools && e.tools.source === null && (t.tools = Ji({})), !t.dataRenderers && e.dataRenderers.source === null && (t.dataRenderers = ki());
});
const Na = (t) => t._core?.RenderComponent, Oa = le(({ runtime: t, aui: e = null, children: s }) => {
  "use no memo";
  const n = Q({ threads: $a(t) }, { parent: e }), r = Na(t), o = /* @__PURE__ */ V(_e, {
    value: n,
    children: [r && /* @__PURE__ */ d(r, {}), s]
  });
  return e ? /* @__PURE__ */ d(_e, {
    value: e,
    children: o
  }) : o;
}), Xt = () => {
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
}, Ba = () => {
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
        return o = Xt(), t.forEach((c) => {
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
var _s = class {
  _controller;
  _isClosed = !1;
  constructor(t) {
    this._controller = t;
  }
  append(t) {
    return this._controller.enqueue({
      type: "text-delta",
      path: [],
      textDelta: t
    }), this;
  }
  close() {
    this._isClosed || (this._isClosed = !0, this._controller.enqueue({
      type: "part-finish",
      path: []
    }), this._controller.close());
  }
};
const Nn = (t) => new ReadableStream({
  start(e) {
    return t.start?.(new _s(e));
  },
  pull(e) {
    return t.pull?.(new _s(e));
  },
  cancel(e) {
    return t.cancel?.(e);
  }
}), ws = () => {
  let t;
  return [Nn({ start(e) {
    t = e;
  } }), t];
};
var Ts = class {
  _isClosed = !1;
  _mergeTask;
  _controller;
  constructor(t) {
    this._controller = t;
    const e = Nn({ start: (n) => {
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
    this._isClosed || (this._controller.enqueue({
      type: "result",
      path: [],
      ...t.artifact !== void 0 ? { artifact: t.artifact } : {},
      result: t.result,
      isError: t.isError ?? !1,
      ...t.modelContent !== void 0 ? { modelContent: t.modelContent } : {},
      ...t.messages !== void 0 ? { messages: t.messages } : {}
    }), await this.close());
  }
  async close() {
    this._isClosed || (this._isClosed = !0, this._argsTextController.close(), await this._mergeTask, this._controller.enqueue({
      type: "part-finish",
      path: []
    }), this._controller.close());
  }
};
const La = (t) => new ReadableStream({
  start(e) {
    return t.start?.(new Ts(e));
  },
  pull(e) {
    return t.pull?.(new Ts(e));
  },
  cancel(e) {
    return t.cancel?.(e);
  }
}), Fa = () => {
  let t;
  return [La({ start(e) {
    t = e;
  } }), t];
};
var On = class {
  value = -1;
  up() {
    return ++this.value;
  }
}, Va = class extends TransformStream {
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
var qa = class extends TransformStream {
  constructor(t) {
    const e = new On(), s = /* @__PURE__ */ new Map();
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
}, Ua = class extends TransformStream {
  constructor(t) {
    super();
    const e = t(super.readable);
    Object.defineProperty(this, "readable", {
      value: e,
      writable: !1
    });
  }
}, Bn = class extends TransformStream {
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
const za = fo("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);
var Ha = class Ln {
  _state;
  _parentId;
  constructor(e) {
    this._state = e || {
      merger: Ba(),
      contentCounter: new On()
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
    }), this._state.merger.addStream(s.pipeThrough(new Va(this._state.contentCounter.value)));
  }
  merge(e) {
    this._state.merger.addStream(e.pipeThrough(new qa(this._state.contentCounter)));
  }
  appendText(e) {
    (this._state.append?.kind !== "text" || this._state.append.parentId !== this._parentId) && (this._state.append = {
      kind: "text",
      parentId: this._parentId,
      controller: this.addTextPart()
    }), this._state.append.controller.append(e);
  }
  appendReasoning(e) {
    (this._state.append?.kind !== "reasoning" || this._state.append.parentId !== this._parentId) && (this._state.append = {
      kind: "reasoning",
      parentId: this._parentId,
      controller: this.addReasoningPart()
    }), this._state.append.controller.append(e);
  }
  addTextPart() {
    const [e, s] = ws();
    return this._addPart(this._withParentIdOption({ type: "text" }), e), s;
  }
  addReasoningPart() {
    const [e, s] = ws();
    return this._addPart(this._withParentIdOption({ type: "reasoning" }), e), s;
  }
  addToolCallPart(e) {
    const s = typeof e == "string" ? { toolName: e } : e, n = s.toolName, r = s.toolCallId ?? za(), [o, i] = Fa();
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
    const s = new Ln(this._state);
    return s._parentId = e, s;
  }
  close() {
    this._state.append?.controller?.close(), this._state.merger.seal(), this._state.closeSubscriber?.();
  }
};
function ja(t) {
  const e = new Ha();
  return (async () => {
    try {
      await t(e);
    } catch (n) {
      e.__internal_isClosed ? e.__internal_isCancelled || console.error(n) : e.enqueue({
        type: "error",
        path: [],
        error: String(n)
      });
    } finally {
      e.__internal_isClosed || e.close();
    }
  })(), e.__internal_getReadable();
}
function Ga() {
  const { resolve: t, promise: e } = Xt();
  let s;
  return [ja((n) => (s = n, s.__internal_subscribeToClose(t), e)), s];
}
async function* Wa() {
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
function St(t) {
  return t[Symbol.asyncIterator] ??= Wa, t;
}
function Ya(t, e, s) {
  try {
    const n = t();
    if (typeof n == "object" && n !== null && "then" in n) return n.then(e, s);
    e(n);
  } catch (n) {
    s(n);
  }
}
function qe(t, e) {
  let s = t;
  for (const n of e) {
    if (s == null) return;
    s = s[n];
  }
  return s;
}
var Qa = class {
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
        if (Ve(t, this.fieldPath) === "complete") {
          const e = qe(t, this.fieldPath);
          e !== void 0 && (this.resolve(e), this.dispose());
        }
      } catch (e) {
        this.reject(e), this.dispose();
      }
  }
  end(t) {
    if (!this.disposed)
      try {
        const e = qe(t, this.fieldPath);
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
}, Ja = class {
  controller;
  disposed = !1;
  fieldPath;
  constructor(t, e) {
    this.controller = t, this.fieldPath = e;
  }
  update(t) {
    if (!this.disposed)
      try {
        const e = qe(t, this.fieldPath);
        e !== void 0 && this.controller.enqueue(e), Ve(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
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
}, Za = class {
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
        const e = qe(t, this.fieldPath);
        if (e !== void 0 && typeof e == "string") {
          const s = e.substring(this.lastValue?.length || 0);
          this.lastValue = e, this.controller.enqueue(s);
        }
        Ve(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
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
}, Xa = class {
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
        const e = qe(t, this.fieldPath);
        if (!Array.isArray(e)) return;
        for (let s = 0; s < e.length; s++) this.processedIndexes.has(s) || Ve(t, [...this.fieldPath, s]) === "complete" && (this.controller.enqueue(e[s]), this.processedIndexes.add(s));
        Ve(t, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
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
}, Ka = class {
  argTextDeltas;
  handles = /* @__PURE__ */ new Set();
  args = fs("");
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
        const r = fs(t);
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
      const n = new Qa(e, s, t);
      if (this.args && Ve(this.args, t) === "complete") {
        const r = qe(this.args, t);
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
    return St(new ReadableStream({
      start: (n) => {
        s = new Ja(n, e), this.finished || this.handles.add(s), s.update(this.args), this.finished && s.end();
      },
      cancel: () => {
        s && (s.dispose(), this.handles.delete(s));
      }
    }));
  }
  streamText(...t) {
    const e = t;
    let s;
    return St(new ReadableStream({
      start: (n) => {
        s = new Za(n, e), this.finished || this.handles.add(s), s.update(this.args), this.finished && s.end();
      },
      cancel: () => {
        s && (s.dispose(), this.handles.delete(s));
      }
    }));
  }
  forEach(...t) {
    const e = t;
    let s;
    return St(new ReadableStream({
      start: (n) => {
        s = new Xa(n, e), this.finished || this.handles.add(s), s.update(this.args), this.finished && s.end();
      },
      cancel: () => {
        s && (s.dispose(), this.handles.delete(s));
      }
    }));
  }
}, ec = class {
  promise;
  constructor(t) {
    this.promise = t;
  }
  get() {
    return this.promise;
  }
}, tc = class {
  args;
  response;
  writable;
  resolve;
  argsText = "";
  constructor() {
    const t = new TransformStream();
    this.writable = t.writable, this.args = new Ka(t.readable);
    const { promise: e, resolve: s } = Xt();
    this.resolve = s, this.response = new ec(e);
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
}, sc = class extends Ua {
  constructor(t) {
    const e = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
    super((r) => {
      const o = new TransformStream({
        async transform(i, a) {
          switch ((i.type !== "part-finish" || i.meta.type !== "tool-call") && a.enqueue(i), i.type) {
            case "part-start":
              if (i.part.type === "tool-call") {
                const c = new tc();
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
              l.setResponse(new Se({
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
              let m = !1;
              const p = Ya(() => {
                let h;
                try {
                  h = go.parse(u.argsText);
                } catch (w) {
                  throw new Error(`Function parameter parsing failed. ${JSON.stringify(w.message)}`);
                }
                const g = t.execute({
                  toolCallId: c,
                  toolName: l,
                  args: h
                });
                return g !== void 0 && (m = !0, t.onExecutionStart?.(c, l)), g;
              }, (h) => {
                if (m && t.onExecutionEnd?.(c, l), h === void 0) return;
                const g = new Se({
                  artifact: h.artifact,
                  result: h.result,
                  isError: h.isError,
                  messages: h.messages,
                  modelContent: h.modelContent
                });
                u.setResponse(g), a.enqueue({
                  type: "result",
                  path: i.path,
                  ...g
                });
              }, (h) => {
                m && t.onExecutionEnd?.(c, l);
                const g = new Se({
                  result: String(h),
                  isError: !0
                });
                u.setResponse(g), a.enqueue({
                  type: "result",
                  path: i.path,
                  ...g
                });
              });
              p && e.set(c, p);
              break;
            }
            case "part-finish": {
              if (i.meta.type !== "tool-call") break;
              const { toolCallId: c } = i.meta, l = e.get(c);
              l ? l.then(() => {
                e.delete(c), s.delete(c), n.delete(c), a.enqueue(i);
              }) : (s.delete(c), n.delete(c), a.enqueue(i));
            }
          }
        },
        async flush() {
          await Promise.all(e.values());
        }
      });
      return r.pipeThrough(new Bn()).pipeThrough(o);
    });
  }
};
const nc = (t) => typeof t == "object" && t !== null && "~standard" in t && t["~standard"].version === 1;
function rc(t, e, s, n) {
  const r = t?.[s.toolName];
  return r?.execute ? (async (i) => {
    if (e.aborted) return new Se({
      result: "Tool execution was cancelled.",
      isError: !0
    });
    let a = i;
    if (nc(r.parameters)) {
      let m = r.parameters["~standard"].validate(s.args);
      m instanceof Promise && (m = await m), m.issues && (a = r.experimental_onSchemaValidationError ?? (() => {
        throw new Error(`Function parameter validation failed. ${JSON.stringify(m.issues)}`);
      }));
    }
    let c;
    const l = new Promise((m) => {
      c = () => {
        queueMicrotask(() => {
          queueMicrotask(() => {
            m(new Se({
              result: "Tool execution was cancelled.",
              isError: !0
            }));
          });
        });
      }, e.aborted ? c() : e.addEventListener("abort", c, { once: !0 });
    }), u = (async () => {
      const m = await a(s.args, {
        toolCallId: s.toolCallId,
        abortSignal: e,
        human: (h) => n(s.toolCallId, h)
      }), p = Se.toResponse(m);
      if (r.toModelOutput && !p.isError && p.modelContent === void 0) try {
        const h = await r.toModelOutput({
          toolCallId: s.toolCallId,
          input: s.args,
          output: p.result
        });
        return new Se({
          result: p.result,
          artifact: p.artifact,
          isError: p.isError,
          messages: p.messages,
          modelContent: h
        });
      } catch (h) {
        console.warn(`[assistant-stream] tool "${s.toolName}" toModelOutput threw; falling back to default projection.`, h);
      }
      return p;
    })();
    try {
      return await Promise.race([u, l]);
    } finally {
      e.removeEventListener("abort", c);
    }
  })(r.execute) : void 0;
}
function oc(t, e, s, n, r) {
  t?.[n.toolName]?.streamCall?.(s, {
    toolCallId: n.toolCallId,
    abortSignal: e,
    human: (o) => r(n.toolCallId, o)
  });
}
function ic(t, e, s, n) {
  const r = typeof t == "function" ? t : () => t, o = typeof e == "function" ? e : () => e;
  return new sc({
    execute: (i) => rc(r(), o(), i, s),
    streamCall: ({ reader: i, ...a }) => oc(r(), o(), i, a, s),
    onExecutionStart: n?.onExecutionStart,
    onExecutionEnd: n?.onExecutionEnd
  });
}
const Fn = (t) => {
  const e = y(7), { index: s, children: n } = t;
  let r;
  e[0] !== s ? (r = be({
    source: "message",
    query: {
      type: "index",
      index: s
    },
    get: (c) => c.message().attachment({ index: s })
  }), e[0] = s, e[1] = r) : r = e[1];
  let o;
  e[2] !== r ? (o = { attachment: r }, e[2] = r, e[3] = o) : o = e[3];
  const i = Q(o);
  let a;
  return e[4] !== i || e[5] !== n ? (a = /* @__PURE__ */ d(_e, {
    value: i,
    children: n
  }), e[4] = i, e[5] = n, e[6] = a) : a = e[6], a;
}, Vn = (t) => {
  const e = y(10), { index: s, children: n } = t;
  let r;
  e[0] !== s ? (r = be({
    source: "thread",
    query: {
      type: "index",
      index: s
    },
    get: (l) => l.thread().message({ index: s })
  }), e[0] = s, e[1] = r) : r = e[1];
  let o;
  e[2] !== s ? (o = be({
    source: "message",
    query: {},
    get: (l) => l.thread().message({ index: s }).composer()
  }), e[2] = s, e[3] = o) : o = e[3];
  let i;
  e[4] !== r || e[5] !== o ? (i = {
    message: r,
    composer: o
  }, e[4] = r, e[5] = o, e[6] = i) : i = e[6];
  const a = Q(i);
  let c;
  return e[7] !== a || e[8] !== n ? (c = /* @__PURE__ */ d(_e, {
    value: a,
    children: n
  }), e[7] = a, e[8] = n, e[9] = c) : c = e[9], c;
}, Kt = ({ index: t, children: e }) => {
  const s = Ue(() => ({
    index: t,
    current: null
  }), [t]);
  return /* @__PURE__ */ d(_e, {
    value: Q({ part: be({
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
}, ac = (t) => {
  const e = y(7), { text: s, isRunning: n } = t;
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
    addToolResult: lc,
    resumeToolCall: uc,
    respondToToolApproval: dc
  }, e[5] = i, e[6] = a) : a = e[6], a;
}, cc = te(ac), es = (t) => {
  const e = y(8), { text: s, isRunning: n, children: r } = t, o = n === void 0 ? !1 : n;
  let i;
  e[0] !== o || e[1] !== s ? (i = cc({
    text: s,
    isRunning: o
  }), e[0] = o, e[1] = s, e[2] = i) : i = e[2];
  let a;
  e[3] !== i ? (a = { part: i }, e[3] = i, e[4] = a) : a = e[4];
  const c = Q(a);
  let l;
  return e[5] !== c || e[6] !== r ? (l = /* @__PURE__ */ d(_e, {
    value: c,
    children: r
  }), e[5] = c, e[6] = r, e[7] = l) : l = e[7], l;
};
function lc() {
  throw new Error("Not supported");
}
function uc() {
  throw new Error("Not supported");
}
function dc() {
  throw new Error("Not supported");
}
const mc = Object.freeze({ type: "complete" }), hc = (t) => {
  const e = y(9), { parts: s, getMessagePart: n } = t, [r, o] = pe(!0), i = s[s.length - 1]?.status ?? mc;
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
}, pc = te(hc), fc = (t) => {
  const e = y(5), { startIndex: s, endIndex: n, children: r } = t, o = M(gc).slice(s, n + 1), i = Q(), a = pc({
    parts: o,
    getMessagePart: (m) => {
      const { index: p } = m;
      if (p < 0 || p >= o.length) throw new Error(`ChainOfThought part index ${p} is out of bounds (0..${o.length - 1})`);
      return i.message().part({ index: s + p });
    }
  });
  let c;
  e[0] !== a ? (c = { chainOfThought: a }, e[0] = a, e[1] = c) : c = e[1];
  const l = Q(c);
  let u;
  return e[2] !== l || e[3] !== r ? (u = /* @__PURE__ */ d(_e, {
    value: l,
    children: r
  }), e[2] = l, e[3] = r, e[4] = u) : u = e[4], u;
};
function gc(t) {
  return t.message.parts;
}
const qn = (t) => {
  const e = y(7), { index: s, children: n } = t;
  let r;
  e[0] !== s ? (r = be({
    source: "suggestions",
    query: { index: s },
    get: (c) => c.suggestions().suggestion({ index: s })
  }), e[0] = s, e[1] = r) : r = e[1];
  let o;
  e[2] !== r ? (o = { suggestion: r }, e[2] = r, e[3] = o) : o = e[3];
  const i = Q(o);
  let a;
  return e[4] !== i || e[5] !== n ? (a = /* @__PURE__ */ d(_e, {
    value: i,
    children: n
  }), e[4] = i, e[5] = n, e[6] = a) : a = e[6], a;
}, vc = Qt(null), bc = () => yn(vc), Ee = Object.freeze([]), Le = "DEFAULT_THREAD_ID", xc = Object.freeze([Le]), yc = Object.freeze({
  id: Le,
  remoteId: void 0,
  externalId: void 0,
  status: "regular"
}), _c = Promise.resolve(), Is = Object.freeze({ [Le]: yc });
var wc = class {
  _mainThreadId = Le;
  _threads = xc;
  _archivedThreads = Ee;
  _threadData = Is;
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
    return _c;
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
    const n = t.threadId ?? Le, r = t.threads ?? Ee, o = t.archivedThreads ?? Ee, i = s.threadId ?? Le, a = s.threads ?? Ee, c = s.archivedThreads ?? Ee;
    !e && i === n && a === r && c === o || ((a !== r || c !== o || i !== n) && (this._threadData = {
      ...Is,
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
    }), a !== r && (this._threads = this.adapter.threads?.map((l) => l.id) ?? Ee), c !== o && (this._archivedThreads = this.adapter.archivedThreads?.map((l) => l.id) ?? Ee), (e || i !== n) && (this._mainThreadId = n, this._mainThread = this.threadFactory()), this._threadData[this._mainThreadId] || (this._threadData = {
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
}, Tc = class extends vo {
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
    super(), this.runtime = t, this.endEditCallback = e, this._parentId = s, this._sourceId = n.id, this._previousText = pt(n), this.setText(this._previousText), this.setRole(n.role), n.role === "user" ? (this._previousAttachments = [...n.attachments ?? [], ...bo(n.content)], this._nonTextPassthrough = []) : (this._previousAttachments = n.attachments ?? [], this._nonTextPassthrough = n.content.filter((r) => r.type !== "text")), this.setAttachments(this._previousAttachments), this.setRunConfig({ ...t.composer.runConfig });
  }
  get parentId() {
    return this._parentId;
  }
  get sourceId() {
    return this._sourceId;
  }
  async handleSend(t, e) {
    let s;
    const n = pt(t), r = !xo(t.attachments ?? [], this._previousAttachments);
    if (n !== this._previousText || r || e?.startRun) {
      const o = this._nonTextPassthrough.length > 0 ? [...t.content, ...this._nonTextPassthrough] : t.content, i = this.runtime.messages, a = this._parentId === null ? -1 : i.findIndex((u) => u.id === this._parentId), c = yo(this.runtime.getModelContext().unstable_composerMetadata, i.slice(0, a + 1)), l = this.enrichWithComposerMetadata(t, c);
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
}, Ic = class {
  _subscriptions = /* @__PURE__ */ new Set();
  _isInitialized = !1;
  repository = new _n();
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
  composer = new _o(this);
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
    this._editComposers.set(t, new Tc(this, () => this._editComposers.delete(t), this.repository.getMessage(t))), this._notifySubscribers();
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
    s && wo(s, e, `Thread runtime "${t}"`);
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
    const n = e.speak(pt(s)), r = n.subscribe(() => {
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
        id: Dt(),
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
          id: Dt(),
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
    this.import(wn.fromArray(t ?? []));
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
}, Ss = class {
  cache = /* @__PURE__ */ new WeakMap();
  convertMessages(t, e) {
    return t.map((s, n) => {
      const r = e(this.cache.get(s), s, n);
      return this.cache.set(s, r), r;
    });
  }
};
const ot = (t) => {
  try {
    return JSON.parse(t), !0;
  } catch {
    return !1;
  }
}, Cs = (t) => {
  try {
    return JSON.parse(t);
  } catch {
    return;
  }
}, Rs = (t, e) => {
  const s = Cs(t), n = Cs(e);
  return s === void 0 || n === void 0 ? !1 : To(s, n);
};
var Sc = class {
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
    const [t, e] = Ga();
    this._controller = e;
    const s = ic(() => this._getWrappedTools(), () => this._ac.signal, (n, r) => this._onHumanInput(n, r), {
      onExecutionStart: (n) => this._onExecutionStart(n),
      onExecutionEnd: (n) => this._onExecutionEnd(n)
    });
    t.pipeThrough(s).pipeThrough(new Bn()).pipeTo(new WritableStream({ write: (n) => {
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
    return s ? !0 : (this._hasExecutableTool(t) || !this._isRunning) && ot(e);
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
      if (t.argsComplete) Rs(t.argsText, e.argsText) && (t.argsText = e.argsText), n = !1;
      else if (!e.argsText.startsWith(t.argsText)) if (ot(t.argsText) && ot(e.argsText) && Rs(t.argsText, e.argsText)) {
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
            o.hasResult = !0, o.argsComplete = !0, i.setResponse(new Se({
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
const Cc = Object.freeze([]), Es = (t, e) => {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length) return !1;
  for (const n of s) if (t[n] !== e[n]) return !1;
  return !0;
}, Rc = (t, e) => t && e[e.length - 1]?.role !== "assistant";
var Ec = class extends Ic {
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
  _converter = new Ss();
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
    const n = t.suggestions ?? Cc;
    Es(this.suggestions, n) || (this.suggestions = n);
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
    Es(this._capabilities, r) || (this._capabilities = r);
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
        for (const { message: u, parentId: m } of a) this.repository.addOrUpdateMessage(m, u);
        for (const { message: u } of this.repository.export().messages) l.has(u.id) || this.repository.deleteMessage(u.id);
        this.repository.resetHead(c), o = this.repository.getMessages();
      }
    } else if (t.messages) {
      if (s) {
        if (s.convertMessage !== t.convertMessage) this._converter = new Ss();
        else if (s.isRunning === t.isRunning && s.messages === t.messages) {
          this._notifySubscribers();
          return;
        }
      }
      o = t.convertMessage ? this._converter.convertMessages(t.messages, (l, u, m) => {
        if (!t.convertMessage) return u;
        const p = Io(m === (t.messages?.length ?? 0) - 1, e, !1, !1, void 0);
        if (l && (l.role !== "assistant" || !So(l.status) || l.status === p)) return l;
        const h = gs(t.convertMessage(u, m), m.toString(), p);
        return Co(h, u), h;
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
        const u = o[l], m = o[l - 1];
        this.repository.addOrUpdateMessage(m?.id ?? null, u);
      }
    } else throw new Error("ExternalStoreAdapter must provide either 'messages' or 'messageRepository'");
    o.length > 0 && this.ensureInitialized(), (s?.isRunning ?? !1) !== (t.isRunning ?? !1) && (t.isRunning ? this._notifyEventSubscribers("runStart", {}) : this._notifyEventSubscribers("runEnd", {}));
    let i = null;
    Rc(e, o) && (i = Dt(), this.repository.addOrUpdateMessage(o.at(-1)?.id ?? null, gs({
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
    this._toolInvocations || (this._toolInvocations = new Sc(() => this.getModelContext().tools, {
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
    return this._store?.queue?.items ?? Ro;
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
    s?.role === "user" && s.id === e.at(-1)?.id ? (this.repository.deleteMessage(s.id), this.composer.text.trim() || this.composer.setText(pt(s)), e = this.repository.getMessages()) : this._notifySubscribers(), setTimeout(() => {
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
    const e = new _n();
    e.import(wn.fromArray(t ?? [])), this.updateMessages(e.getMessages());
  }
  import(t) {
    super.import(t), this._store.onImport && this._store.onImport(this.repository.getMessages());
  }
  updateMessages = (t) => {
    this._store.convertMessage !== void 0 ? this._store.setMessages?.(t.flatMap(Eo)) : this._store.setMessages?.(t);
  };
};
const Ms = (t) => t.adapters?.threadList ?? {};
var Mc = class extends Mo {
  threads;
  constructor(t) {
    super(), this.threads = new wc(Ms(t), () => new Ec(this._contextProvider, t));
  }
  setAdapter(t) {
    this.threads.__internal_setAdapter(Ms(t)), this.threads.getMainThreadRuntimeCore().__internal_setAdapter(t);
  }
};
const Ac = (t) => {
  const e = y(11);
  let s;
  e[0] !== t ? (s = () => new Mc(t), e[0] = t, e[1] = s) : s = e[1];
  const [n] = pe(s);
  let r;
  e[2] !== n || e[3] !== t ? (r = () => {
    n.setAdapter(t);
  }, e[2] = n, e[3] = t, e[4] = r) : r = e[4], de(r);
  const { modelContext: o } = bc() ?? {};
  let i, a;
  e[5] !== o || e[6] !== n ? (i = () => {
    if (o)
      return n.registerModelContextProvider(o);
  }, a = [o, n], e[5] = o, e[6] = n, e[7] = i, e[8] = a) : (i = e[7], a = e[8]), de(i, a);
  let c;
  return e[9] !== n ? (c = new Ao(n), e[9] = n, e[10] = c) : c = e[10], c;
}, Pc = (t) => {
  const e = y(10), { id: s, children: n } = t;
  let r;
  e[0] !== s ? (r = be({
    source: "thread",
    query: {
      type: "id",
      id: s
    },
    get: (l) => l.thread().message({ id: s })
  }), e[0] = s, e[1] = r) : r = e[1];
  let o;
  e[2] !== s ? (o = be({
    source: "message",
    query: {},
    get: (l) => l.thread().message({ id: s }).composer()
  }), e[2] = s, e[3] = o) : o = e[3];
  let i;
  e[4] !== r || e[5] !== o ? (i = {
    message: r,
    composer: o
  }, e[4] = r, e[5] = o, e[6] = i) : i = e[6];
  const a = Q(i);
  let c;
  return e[7] !== a || e[8] !== n ? (c = /* @__PURE__ */ d(_e, {
    value: a,
    children: n
  }), e[7] = a, e[8] = n, e[9] = c) : c = e[9], c;
}, ts = (t, e) => t.Message === e.Message && t.EditComposer === e.EditComposer && t.UserEditComposer === e.UserEditComposer && t.AssistantEditComposer === e.AssistantEditComposer && t.SystemEditComposer === e.SystemEditComposer && t.UserMessage === e.UserMessage && t.AssistantMessage === e.AssistantMessage && t.SystemMessage === e.SystemMessage, kc = () => null, As = /* @__PURE__ */ new WeakMap(), Dc = (t, e) => {
  let s = As.get(t);
  return s || (s = new Set(t.map((n) => n.id)), As.set(t, s)), s.has(e);
}, $c = (t, e, s) => {
  switch (e) {
    case "user":
      return s ? t.UserEditComposer ?? t.EditComposer ?? t.UserMessage ?? t.Message : t.UserMessage ?? t.Message;
    case "assistant":
      return s ? t.AssistantEditComposer ?? t.EditComposer ?? t.AssistantMessage ?? t.Message : t.AssistantMessage ?? t.Message;
    case "system":
      return s ? t.SystemEditComposer ?? t.EditComposer ?? t.SystemMessage ?? t.Message : t.SystemMessage ?? t.Message ?? kc;
    default:
      throw new Error(`Unknown message role: ${e}`);
  }
}, ss = (t) => {
  const e = y(6), { components: s } = t, n = M(Oc), r = M(Bc);
  let o;
  e[0] !== s || e[1] !== r || e[2] !== n ? (o = $c(s, n, r), e[0] = s, e[1] = r, e[2] = n, e[3] = o) : o = e[3];
  const i = o;
  let a;
  return e[4] !== i ? (a = /* @__PURE__ */ d(i, {}), e[4] = i, e[5] = a) : a = e[5], a;
}, Un = le((t) => {
  const e = y(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ d(ss, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ d(Vn, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && ts(t.components, e.components));
Un.displayName = "ThreadPrimitive.MessageByIndex";
const zn = le((t) => {
  const e = y(7), { messageId: s, components: n } = t;
  let r;
  if (e[0] !== s ? (r = (a) => Dc(a.thread.messages, s), e[0] = s, e[1] = r) : r = e[1], !M(r)) return null;
  let o;
  e[2] !== n ? (o = /* @__PURE__ */ d(ss, { components: n }), e[2] = n, e[3] = o) : o = e[3];
  let i;
  return e[4] !== s || e[5] !== o ? (i = /* @__PURE__ */ d(Pc, {
    id: s,
    children: o
  }), e[4] = s, e[5] = o, e[6] = i) : i = e[6], i;
}, (t, e) => t.messageId === e.messageId && ts(t.components, e.components));
zn.displayName = "ThreadPrimitive.Unstable_MessageById";
const Ps = ({ children: t }) => {
  const e = M((s) => s.thread.messages.length);
  return Ue(() => e === 0 ? null : Array.from({ length: e }, (s, n) => /* @__PURE__ */ d(Vn, {
    index: n,
    children: /* @__PURE__ */ d(_t, {
      getItemState: (r) => r.thread().message({ index: n }).getState(),
      children: (r) => t({ get message() {
        return r();
      } })
    })
  }, n)), [e, t]);
}, Hn = (t) => {
  const e = y(4), { components: s, children: n } = t;
  if (s) {
    let o;
    return e[0] !== s ? (o = /* @__PURE__ */ d(Ps, { children: () => /* @__PURE__ */ d(ss, { components: s }) }), e[0] = s, e[1] = o) : o = e[1], o;
  }
  let r;
  return e[2] !== n ? (r = /* @__PURE__ */ d(Ps, { children: n }), e[2] = n, e[3] = r) : r = e[3], r;
};
Hn.displayName = "ThreadPrimitive.Messages";
const Nc = le(Hn, (t, e) => t.children || e.children ? t.children === e.children : ts(t.components, e.components));
function Oc(t) {
  return t.message.role;
}
function Bc(t) {
  return t.message.composer.isEditing;
}
const jn = (t) => {
  const e = t.message.metadata;
  if (!(!e || typeof e != "object"))
    return e.custom?.quote;
};
var Lc = class extends Error {
  componentName;
  constructor(t, e = `Component "${t}" is not in the generative-ui allowlist.`) {
    super(e), this.name = "GenerativeUIRenderError", this.componentName = t;
  }
};
const Fc = (t) => typeof t == "object" && t !== null, Gn = (t, e, s, n) => {
  if (t == null) return null;
  if (typeof t == "string") return t;
  if (!Fc(t) || !("component" in t) || typeof t.component != "string")
    return null;
  const { component: r, props: o, children: i, key: a } = t, c = e[r];
  if (!c) {
    if (s) return /* @__PURE__ */ d(s, {
      component: r,
      props: o
    }, a ?? n);
    throw new Lc(r);
  }
  const l = i?.length ? i.map((u, m) => Gn(u, e, s, `${n}/${m}`)) : void 0;
  return no(c, {
    ...o ?? {},
    key: a ?? n
  }, ...l ?? []);
}, Vc = (t) => {
  if (!t || t.root === void 0 || t.root === null) return [];
  const e = t.root;
  return Array.isArray(e) ? e : [e];
}, ns = (t) => {
  const e = y(11), { spec: s, components: n, Fallback: r } = t;
  let o;
  e[0] !== s ? (o = Vc(s), e[0] = s, e[1] = o) : o = e[1];
  const i = o;
  let a;
  if (e[2] !== r || e[3] !== n || e[4] !== i) {
    let l;
    e[6] !== r || e[7] !== n ? (l = (u, m) => Gn(u, n, r, `${m}`), e[6] = r, e[7] = n, e[8] = l) : l = e[8], a = i.map(l), e[2] = r, e[3] = n, e[4] = i, e[5] = a;
  } else a = e[5];
  let c;
  return e[9] !== a ? (c = /* @__PURE__ */ d(xe, { children: a }), e[9] = a, e[10] = c) : c = e[10], c;
};
ns.displayName = "GenerativeUIRender";
const Wn = (t) => {
  const e = y(4), { components: s, spec: n, Fallback: r } = t, o = M(qc), i = n ?? o;
  if (!i) return null;
  let a;
  return e[0] !== r || e[1] !== s || e[2] !== i ? (a = /* @__PURE__ */ d(ns, {
    spec: i,
    components: s,
    Fallback: r
  }), e[0] = r, e[1] = s, e[2] = i, e[3] = a) : a = e[3], a;
};
Wn.displayName = "MessagePrimitive.GenerativeUI";
function qc(t) {
  const e = t.part;
  return e?.type === "generative-ui" ? e.spec : void 0;
}
const Uc = "ui://", zc = (t) => !!t?.startsWith(Uc), ks = (t) => Symbol.iterator in t, Ds = (t) => (
  // HACK: avoid checking entries type
  "entries" in t
), $s = (t, e) => {
  const s = t instanceof Map ? t : new Map(t.entries()), n = e instanceof Map ? e : new Map(e.entries());
  if (s.size !== n.size)
    return !1;
  for (const [r, o] of s)
    if (!n.has(r) || !Object.is(o, n.get(r)))
      return !1;
  return !0;
}, Hc = (t, e) => {
  const s = t[Symbol.iterator](), n = e[Symbol.iterator]();
  let r = s.next(), o = n.next();
  for (; !r.done && !o.done; ) {
    if (!Object.is(r.value, o.value))
      return !1;
    r = s.next(), o = n.next();
  }
  return !!r.done && !!o.done;
};
function jc(t, e) {
  return Object.is(t, e) ? !0 : typeof t != "object" || t === null || typeof e != "object" || e === null || Object.getPrototypeOf(t) !== Object.getPrototypeOf(e) ? !1 : ks(t) && ks(e) ? Ds(t) && Ds(e) ? $s(t, e) : Hc(t, e) : $s(
    { entries: () => Object.entries(t) },
    { entries: () => Object.entries(e) }
  );
}
function Nt(t) {
  const e = Fe.useRef(void 0);
  return (s) => {
    const n = t(s);
    return jc(e.current, n) ? e.current : e.current = n;
  };
}
const Ct = (t) => {
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
}, Gc = (t, e, s) => {
  const n = [];
  if (e) {
    const r = Ct("chainOfThoughtGroup");
    for (let o = 0; o < t.length; o++) {
      const i = t[o];
      i === "tool-call" || i === "reasoning" ? r.startGroup(o) : (r.endGroup(o - 1, n), n.push({
        type: "single",
        index: o
      }));
    }
    r.finalize(t.length - 1, n);
  } else {
    const r = Ct("toolGroup"), o = Ct("reasoningGroup");
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
}, Wc = (t) => {
  const e = y(10), s = M(Nt(dl)), n = M(Nt(hl));
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
    e[3] !== s || e[4] !== n || e[5] !== t ? (o = Gc(s, t, n), e[3] = s, e[4] = n, e[5] = t, e[6] = o) : o = e[6];
    let i;
    e[7] !== n || e[8] !== o ? (i = {
      ranges: o,
      partIds: n
    }, e[7] = n, e[8] = o, e[9] = i) : i = e[9], r = i;
  }
  return r;
}, Yc = (t) => {
  const e = y(9);
  let s, n;
  e[0] !== t ? ({ Fallback: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  e[3] !== s || e[4] !== n.toolName ? (r = (a) => a.tools.toolUIs[n.toolName]?.[0]?.render ?? s, e[3] = s, e[4] = n.toolName, e[5] = r) : r = e[5];
  const o = M(r);
  if (!o) return null;
  let i;
  return e[6] !== o || e[7] !== n ? (i = /* @__PURE__ */ d(o, { ...n }), e[6] = o, e[7] = n, e[8] = i) : i = e[8], i;
}, rs = (t, e, s) => {
  const n = t.renderers[e]?.[0];
  return n || (t.fallbacks[0] ?? s);
}, Qc = (t) => {
  const e = y(9);
  let s, n;
  e[0] !== t ? ({ Fallback: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  e[3] !== s || e[4] !== n.name ? (r = (a) => rs(a.dataRenderers, n.name, s), e[3] = s, e[4] = n.name, e[5] = r) : r = e[5];
  const o = M(r);
  if (!o) return null;
  let i;
  return e[6] !== o || e[7] !== n ? (i = /* @__PURE__ */ d(o, { ...n }), e[6] = o, e[7] = n, e[8] = i) : i = e[8], i;
}, ce = {
  Text: () => null,
  Reasoning: () => null,
  Source: () => null,
  Image: () => null,
  File: () => null,
  Unstable_Audio: () => null,
  ToolGroup: ({ children: t }) => t,
  ReasoningGroup: ({ children: t }) => t
}, Jc = (t) => {
  const e = y(47), { components: s } = t;
  let n;
  e[0] !== s ? (n = s === void 0 ? {} : s, e[0] = s, e[1] = n) : n = e[1];
  const { Text: r, Reasoning: o, Image: i, Source: a, File: c, Unstable_Audio: l, tools: u, data: m, generativeUI: p } = n, h = r === void 0 ? ce.Text : r, g = o === void 0 ? ce.Reasoning : o, w = i === void 0 ? ce.Image : i, x = a === void 0 ? ce.Source : a, C = c === void 0 ? ce.File : c, D = l === void 0 ? ce.Unstable_Audio : l;
  let R;
  e[2] !== u ? (R = u === void 0 ? {} : u, e[2] = u, e[3] = R) : R = e[3];
  const v = R, b = Q(), I = M(pl), _ = I.type;
  if (_ === "tool-call") {
    let T;
    e[4] !== b ? (T = b.part(), e[4] = b, e[5] = T) : T = e[5];
    const $ = T.addToolResult;
    let k;
    e[6] !== b ? (k = b.part(), e[6] = b, e[7] = k) : k = e[7];
    const z = k.resumeToolCall;
    let B;
    e[8] !== b ? (B = b.part(), e[8] = b, e[9] = B) : B = e[9];
    const U = B.respondToToolApproval;
    if ("Override" in v) {
      let Y;
      return e[10] !== $ || e[11] !== I || e[12] !== U || e[13] !== z || e[14] !== v.Override ? (Y = /* @__PURE__ */ d(v.Override, {
        ...I,
        addResult: $,
        resume: z,
        respondToApproval: U
      }), e[10] = $, e[11] = I, e[12] = U, e[13] = z, e[14] = v.Override, e[15] = Y) : Y = e[15], Y;
    }
    const W = v.by_name?.[I.toolName] ?? v.Fallback;
    let J;
    return e[16] !== W || e[17] !== $ || e[18] !== I || e[19] !== U || e[20] !== z ? (J = /* @__PURE__ */ d(Yc, {
      ...I,
      Fallback: W,
      addResult: $,
      resume: z,
      respondToApproval: U
    }), e[16] = W, e[17] = $, e[18] = I, e[19] = U, e[20] = z, e[21] = J) : J = e[21], J;
  }
  if (I.status?.type === "requires-action") throw new Error("Encountered unexpected requires-action status");
  switch (_) {
    case "text": {
      let T;
      return e[22] !== h || e[23] !== I ? (T = /* @__PURE__ */ d(h, { ...I }), e[22] = h, e[23] = I, e[24] = T) : T = e[24], T;
    }
    case "reasoning": {
      let T;
      return e[25] !== g || e[26] !== I ? (T = /* @__PURE__ */ d(g, { ...I }), e[25] = g, e[26] = I, e[27] = T) : T = e[27], T;
    }
    case "source": {
      let T;
      return e[28] !== x || e[29] !== I ? (T = /* @__PURE__ */ d(x, { ...I }), e[28] = x, e[29] = I, e[30] = T) : T = e[30], T;
    }
    case "image": {
      let T;
      return e[31] !== w || e[32] !== I ? (T = /* @__PURE__ */ d(w, { ...I }), e[31] = w, e[32] = I, e[33] = T) : T = e[33], T;
    }
    case "file": {
      let T;
      return e[34] !== C || e[35] !== I ? (T = /* @__PURE__ */ d(C, { ...I }), e[34] = C, e[35] = I, e[36] = T) : T = e[36], T;
    }
    case "audio": {
      let T;
      return e[37] !== D || e[38] !== I ? (T = /* @__PURE__ */ d(D, { ...I }), e[37] = D, e[38] = I, e[39] = T) : T = e[39], T;
    }
    case "data": {
      const T = m?.by_name?.[I.name] ?? m?.Fallback;
      let $;
      return e[40] !== T || e[41] !== I ? ($ = /* @__PURE__ */ d(Qc, {
        ...I,
        Fallback: T
      }), e[40] = T, e[41] = I, e[42] = $) : $ = e[42], $;
    }
    case "generative-ui": {
      if (!p?.components)
        return null;
      const T = I;
      let $;
      return e[43] !== p.Fallback || e[44] !== p.components || e[45] !== T.spec ? ($ = /* @__PURE__ */ d(ns, {
        spec: T.spec,
        components: p.components,
        Fallback: p.Fallback
      }), e[43] = p.Fallback, e[44] = p.components, e[45] = T.spec, e[46] = $) : $ = e[46], $;
    }
    default:
      return console.warn(`Unknown message part type: ${_}`), null;
  }
}, Xe = le((t) => {
  const e = y(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ d(Jc, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ d(Kt, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && t.components?.Text === e.components?.Text && t.components?.Reasoning === e.components?.Reasoning && t.components?.Source === e.components?.Source && t.components?.Image === e.components?.Image && t.components?.File === e.components?.File && t.components?.Unstable_Audio === e.components?.Unstable_Audio && t.components?.tools === e.components?.tools && t.components?.data === e.components?.data && t.components?.generativeUI === e.components?.generativeUI && t.components?.ToolGroup === e.components?.ToolGroup && t.components?.ReasoningGroup === e.components?.ReasoningGroup);
Xe.displayName = "MessagePrimitive.PartByIndex";
const Zc = (t) => {
  const e = y(6), { status: s, component: n } = t, r = s.type === "running";
  let o;
  e[0] !== n || e[1] !== s ? (o = /* @__PURE__ */ d(n, {
    type: "text",
    text: "",
    status: s
  }), e[0] = n, e[1] = s, e[2] = o) : o = e[2];
  let i;
  return e[3] !== r || e[4] !== o ? (i = /* @__PURE__ */ d(es, {
    text: "",
    isRunning: r,
    children: o
  }), e[3] = r, e[4] = o, e[5] = i) : i = e[5], i;
}, Xc = Object.freeze({ type: "complete" }), Kc = Object.freeze({ type: "running" }), el = (t) => {
  const e = y(6), { components: s } = t, n = M(fl);
  if (s?.Empty) {
    let i;
    return e[0] !== s.Empty || e[1] !== n ? (i = /* @__PURE__ */ d(s.Empty, { status: n }), e[0] = s.Empty, e[1] = n, e[2] = i) : i = e[2], i;
  }
  if (n.type !== "running") return null;
  const r = s?.Text ?? ce.Text;
  let o;
  return e[3] !== n || e[4] !== r ? (o = /* @__PURE__ */ d(Zc, {
    status: n,
    component: r
  }), e[3] = n, e[4] = r, e[5] = o) : o = e[5], o;
}, Yn = le(el, (t, e) => t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), tl = (t) => {
  const e = y(4), { components: s, enabled: n } = t;
  let r;
  if (e[0] !== n ? (r = (i) => {
    if (!n || i.message.parts.length === 0) return !1;
    const a = i.message.parts[i.message.parts.length - 1];
    return a?.type !== "text" && a?.type !== "reasoning";
  }, e[0] = n, e[1] = r) : r = e[1], !M(r)) return null;
  let o;
  return e[2] !== s ? (o = /* @__PURE__ */ d(Yn, { components: s }), e[2] = s, e[3] = o) : o = e[3], o;
}, sl = le(tl, (t, e) => t.enabled === e.enabled && t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), nl = (t) => {
  const e = y(4), { Quote: s } = t, n = M(jn);
  if (!n) return null;
  let r;
  return e[0] !== s || e[1] !== n.messageId || e[2] !== n.text ? (r = /* @__PURE__ */ d(s, {
    text: n.text,
    messageId: n.messageId
  }), e[0] = s, e[1] = n.messageId, e[2] = n.text, e[3] = r) : r = e[3], r;
}, rl = le(nl);
function Qn(t, e) {
  const s = t.toolUIs[e.toolName]?.[0]?.render ?? null;
  return s || (zc(e.mcp?.app?.resourceUri) && t.mcpApp ? t.mcpApp.render : null);
}
const Jn = () => {
  const t = y(12), e = Q(), s = M(gl), n = M(vl);
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
  return t[6] !== n || t[7] !== s || t[8] !== r.addToolResult || t[9] !== i.resumeToolCall || t[10] !== c.respondToToolApproval ? (l = /* @__PURE__ */ d(n, {
    ...s,
    addResult: o,
    resume: a,
    respondToApproval: c.respondToToolApproval
  }), t[6] = n, t[7] = s, t[8] = r.addToolResult, t[9] = i.resumeToolCall, t[10] = c.respondToToolApproval, t[11] = l) : l = t[11], l;
}, Zn = () => {
  const t = y(3), e = M(bl), s = M(xl);
  if (!s || e.type !== "data") return null;
  const n = e;
  let r;
  return t[0] !== s || t[1] !== n ? (r = /* @__PURE__ */ d(s, { ...n }), t[0] = s, t[1] = n, t[2] = r) : r = t[2], r;
}, ol = () => {
  const t = y(2), e = M(yl);
  if (e === "tool-call") {
    let s;
    return t[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = /* @__PURE__ */ d(Jn, {}), t[0] = s) : s = t[0], s;
  }
  if (e === "data") {
    let s;
    return t[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = /* @__PURE__ */ d(Zn, {}), t[1] = s) : s = t[1], s;
  }
  return null;
}, il = Object.freeze({
  type: "text",
  text: "",
  status: Kc
}), al = ({ children: t }) => {
  const e = Q(), s = M((n) => n.dataRenderers);
  return /* @__PURE__ */ d(_t, {
    getItemState: (n) => n.part().getState(),
    children: (n) => t({ get part() {
      const r = n();
      if (r.type === "tool-call") {
        const o = Qn(e.tools().getState(), r) !== null, i = e.part();
        return {
          ...r,
          toolUI: o ? /* @__PURE__ */ d(Jn, {}) : null,
          addResult: i.addToolResult,
          resume: i.resumeToolCall,
          respondToApproval: i.respondToToolApproval
        };
      }
      if (r.type === "data") {
        const o = rs(s, r.name, void 0) !== void 0;
        return {
          ...r,
          dataRendererUI: o ? /* @__PURE__ */ d(Zn, {}) : null
        };
      }
      return r;
    } })
  });
}, Xn = (t) => {
  const e = y(5), { index: s, children: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ d(al, { children: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ d(Kt, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, cl = (t) => {
  const e = y(9), { children: s } = t, n = M(_l), r = M(wl), o = n === 0 && r;
  if (n === 0) {
    if (!o) return null;
    let a;
    e[0] !== s ? (a = s({ part: il }), e[0] = s, e[1] = a) : a = e[1];
    let c;
    return e[2] !== a ? (c = /* @__PURE__ */ d(es, {
      text: "",
      isRunning: !0,
      children: a
    }), e[2] = a, e[3] = c) : c = e[3], c;
  }
  let i;
  if (e[4] !== s || e[5] !== n) {
    let a;
    e[7] !== s ? (a = (c, l) => /* @__PURE__ */ d(Xn, {
      index: l,
      children: (u) => s(u) ?? /* @__PURE__ */ d(ol, {})
    }, l), e[7] = s, e[8] = a) : a = e[8], i = /* @__PURE__ */ d(xe, { children: Array.from({ length: n }, a) }), e[4] = s, e[5] = n, e[6] = i;
  } else i = e[6];
  return i;
}, Ot = (t) => {
  const e = y(5), { components: s, unstable_showEmptyOnNonTextEnd: n, children: r } = t, o = n === void 0 ? !0 : n;
  if (r) {
    let a;
    return e[0] !== r ? (a = /* @__PURE__ */ d(cl, { children: r }), e[0] = r, e[1] = a) : a = e[1], a;
  }
  let i;
  return e[2] !== s || e[3] !== o ? (i = /* @__PURE__ */ d(ll, {
    components: s,
    unstable_showEmptyOnNonTextEnd: o
  }), e[2] = s, e[3] = o, e[4] = i) : i = e[4], i;
};
Ot.displayName = "MessagePrimitive.Parts";
const ll = (t) => {
  const e = y(15), { components: s, unstable_showEmptyOnNonTextEnd: n } = t, r = M(Tl), o = !!s?.ChainOfThought, { ranges: i, partIds: a } = Wc(o);
  let c;
  e: {
    if (r === 0) {
      let g;
      e[0] !== s ? (g = /* @__PURE__ */ d(Yn, { components: s }), e[0] = s, e[1] = g) : g = e[1], c = g;
      break e;
    }
    let h;
    if (e[2] !== s || e[3] !== i || e[4] !== a) {
      const g = /* @__PURE__ */ new Set(), w = (x) => {
        const C = a[x];
        return C !== void 0 && !g.has(C) ? (g.add(C), `part-id:${C}`) : `part-${x}`;
      };
      h = i.map((x) => {
        if (x.type === "single") return /* @__PURE__ */ d(Xe, {
          index: x.index,
          components: s
        }, x.index);
        if (x.type === "chainOfThoughtGroup") {
          const C = s?.ChainOfThought;
          return C ? /* @__PURE__ */ d(fc, {
            startIndex: x.startIndex,
            endIndex: x.endIndex,
            children: /* @__PURE__ */ d(C, {})
          }, `chainOfThought-${x.idKey ?? x.startIndex}`) : null;
        } else return x.type === "toolGroup" ? /* @__PURE__ */ d(s?.ToolGroup ?? ce.ToolGroup, {
          startIndex: x.startIndex,
          endIndex: x.endIndex,
          children: Array.from({ length: x.endIndex - x.startIndex + 1 }, (C, D) => {
            const R = x.startIndex + D;
            return /* @__PURE__ */ d(Xe, {
              index: R,
              components: s
            }, w(R));
          })
        }, `tool-${x.idKey ?? x.startIndex}`) : /* @__PURE__ */ d(s?.ReasoningGroup ?? ce.ReasoningGroup, {
          startIndex: x.startIndex,
          endIndex: x.endIndex,
          children: Array.from({ length: x.endIndex - x.startIndex + 1 }, (C, D) => {
            const R = x.startIndex + D;
            return /* @__PURE__ */ d(Xe, {
              index: R,
              components: s
            }, `part-${R}`);
          })
        }, `reasoning-${x.startIndex}`);
      }), e[2] = s, e[3] = i, e[4] = a, e[5] = h;
    } else h = e[5];
    c = h;
  }
  const l = c;
  let u;
  e[6] !== s ? (u = s?.Quote && /* @__PURE__ */ d(rl, { Quote: s.Quote }), e[6] = s, e[7] = u) : u = e[7];
  let m;
  e[8] !== s || e[9] !== n ? (m = /* @__PURE__ */ d(sl, {
    components: s,
    enabled: n
  }), e[8] = s, e[9] = n, e[10] = m) : m = e[10];
  let p;
  return e[11] !== l || e[12] !== u || e[13] !== m ? (p = /* @__PURE__ */ V(xe, { children: [
    u,
    l,
    m
  ] }), e[11] = l, e[12] = u, e[13] = m, e[14] = p) : p = e[14], p;
};
function ul(t) {
  return t.type;
}
function dl(t) {
  return t.message.parts.map(ul);
}
function ml(t) {
  return t.type === "tool-call" ? t.toolCallId : void 0;
}
function hl(t) {
  return t.message.parts.map(ml);
}
function pl(t) {
  return t.part;
}
function fl(t) {
  return t.message.status ?? Xc;
}
function gl(t) {
  return t.part;
}
function vl(t) {
  return t.part.type === "tool-call" ? Qn(t.tools, t.part) : null;
}
function bl(t) {
  return t.part;
}
function xl(t) {
  return t.part.type === "data" ? rs(t.dataRenderers, t.part.name, void 0) ?? null : null;
}
function yl(t) {
  return t.part.type;
}
function _l(t) {
  return t.message.parts.length;
}
function wl(t) {
  return (t.message.status?.type ?? "complete") === "running";
}
function Tl(t) {
  return t.message.parts.length;
}
const Il = /* @__PURE__ */ Symbol.for("@assistant-ui/groupBy.memoKey"), Ns = (t) => {
  const e = t.nextChildIdx++;
  return t.nodeKey === "" ? String(e) : `${t.nodeKey}.${e}`;
}, Os = (t, e) => {
  if (!(e === void 0 || t.claimed.has(e)))
    return t.claimed.add(e), `id:${e}`;
}, Sl = (t, e) => {
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
      idKey: Os(i, e?.[o.indices[0]]),
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
        nodeKey: Ns(l),
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
      nodeKey: Ns(c),
      idKey: Os(c, e?.[o])
    });
    for (let l = 1; l < n.length; l++) n[l].indices.push(o);
  }
  for (; n.length > 1; ) r();
  return s.children;
}, Cl = Object.freeze({ type: "complete" }), Rl = (t, e, s) => {
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
}, Kn = () => {
  throw new Error("MessagePrimitive.GroupedParts: rendered `children` under a leaf part. `children` is only meaningful for `group-…` cases — add a matching case for the part type or return `null` to skip it.");
}, er = (t, e, s) => {
  if (t.type === "part") return /* @__PURE__ */ d(Xn, {
    index: t.index,
    children: ({ part: r }) => s({
      part: r,
      children: /* @__PURE__ */ d(Kn, {})
    })
  }, t.idKey ? `part-${t.idKey}` : `part-${t.index}`);
  const n = e[t.indices.at(-1)]?.status ?? Cl;
  return /* @__PURE__ */ d(pn, { children: s({
    part: {
      type: t.key,
      status: n,
      indices: t.indices
    },
    children: /* @__PURE__ */ d(xe, { children: t.children.map((r) => er(r, e, s)) })
  }) }, t.idKey ?? t.nodeKey);
}, tr = ({ groupBy: t, indicator: e = "no-text", children: s }) => {
  const n = M(Nt((i) => i.message.parts)), r = M((i) => i.tools.toolUIs), o = M((i) => e === "never" ? !1 : i.message.status?.type === "running");
  return /* @__PURE__ */ V(xe, { children: [Ue(() => {
    const i = { toolUIs: r };
    return Sl(n.map((a) => t(a, i) ?? []), n.map((a) => a.type === "tool-call" ? a.toolCallId : void 0));
  }, [
    n,
    t[Il] ?? t,
    r
  ]).map((i) => er(i, n, s)), Rl(e, n, o) && s({
    part: { type: "indicator" },
    children: /* @__PURE__ */ d(Kn, {})
  })] });
};
tr.displayName = "MessagePrimitive.GroupedParts";
const El = (t) => {
  const e = y(5), { children: s } = t, n = M(jn);
  if (!n) return null;
  let r;
  e[0] !== s || e[1] !== n ? (r = s(n), e[0] = s, e[1] = n, e[2] = r) : r = e[2];
  let o;
  return e[3] !== r ? (o = /* @__PURE__ */ d(xe, { children: r }), e[3] = r, e[4] = o) : o = e[4], o;
}, sr = le(El);
sr.displayName = "MessagePrimitive.Quote";
const nr = (t, e) => {
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
}, Ml = (t) => {
  const e = y(5), { components: s } = t, n = M(Al);
  if (!n) return null;
  const r = n;
  let o;
  e[0] !== s || e[1] !== r ? (o = nr(s, r), e[0] = s, e[1] = r, e[2] = o) : o = e[2];
  const i = o;
  if (!i) return null;
  let a;
  return e[3] !== i ? (a = /* @__PURE__ */ d(i, {}), e[3] = i, e[4] = a) : a = e[4], a;
}, rr = le((t) => {
  const e = y(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ d(Ml, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ d(Fn, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && t.components?.Image === e.components?.Image && t.components?.Document === e.components?.Document && t.components?.File === e.components?.File && t.components?.Attachment === e.components?.Attachment);
rr.displayName = "MessagePrimitive.AttachmentByIndex";
const Bs = ({ children: t }) => {
  const e = M((s) => s.message.role !== "user" ? 0 : (s.message.attachments ?? []).length);
  return Ue(() => Array.from({ length: e }, (s, n) => /* @__PURE__ */ d(Fn, {
    index: n,
    children: /* @__PURE__ */ d(_t, {
      getItemState: (r) => r.message().attachment({ index: n }).getState(),
      children: (r) => t({ get attachment() {
        return r();
      } })
    })
  }, n)), [e, t]);
}, or = (t) => {
  const e = y(4), { components: s, children: n } = t;
  if (s) {
    let o;
    return e[0] !== s ? (o = /* @__PURE__ */ d(Bs, { children: (i) => {
      const { attachment: a } = i, c = nr(s, a);
      return c ? /* @__PURE__ */ d(c, {}) : null;
    } }), e[0] = s, e[1] = o) : o = e[1], o;
  }
  let r;
  return e[2] !== n ? (r = /* @__PURE__ */ d(Bs, { children: n }), e[2] = n, e[3] = r) : r = e[3], r;
};
or.displayName = "MessagePrimitive.Attachments";
function Al(t) {
  return t.attachment;
}
const os = (t) => {
  const { children: e } = t;
  return M(Pl) ? e : null;
};
os.displayName = "MessagePartPrimitive.InProgress";
function Pl(t) {
  return t.part.status.type === "running";
}
const ir = (t) => {
  const e = y(2), { components: s } = t, n = s.Suggestion;
  let r;
  return e[0] !== n ? (r = /* @__PURE__ */ d(n, {}), e[0] = n, e[1] = r) : r = e[1], r;
}, ar = le((t) => {
  const e = y(5), { index: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ d(ir, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ d(qn, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && t.components.Suggestion === e.components.Suggestion);
ar.displayName = "ThreadPrimitive.SuggestionByIndex";
const Ls = ({ children: t }) => {
  const e = M((s) => s.suggestions.suggestions.length);
  return Ue(() => e === 0 ? null : Array.from({ length: e }, (s, n) => /* @__PURE__ */ d(qn, {
    index: n,
    children: /* @__PURE__ */ d(_t, {
      getItemState: (r) => r.suggestions().suggestion({ index: n }).getState(),
      children: (r) => t({ get suggestion() {
        return r();
      } })
    })
  }, n)), [e, t]);
}, cr = (t) => {
  const e = y(4), { components: s, children: n } = t;
  if (s) {
    let o;
    return e[0] !== s ? (o = /* @__PURE__ */ d(Ls, { children: () => /* @__PURE__ */ d(ir, { components: s }) }), e[0] = s, e[1] = o) : o = e[1], o;
  }
  let r;
  return e[2] !== n ? (r = /* @__PURE__ */ d(Ls, { children: n }), e[2] = n, e[3] = r) : r = e[3], r;
};
cr.displayName = "ThreadPrimitive.Suggestions";
const kl = le(cr, (t, e) => t.children || e.children ? t.children === e.children : t.components.Suggestion === e.components.Suggestion), Dl = (t) => {
  const e = y(12);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { copiedDuration: n, copyToClipboard: r } = s, o = n === void 0 ? 3e3 : n, i = Q(), a = M(Nl), c = M(Ol), l = M(Bl), u = M(Ll);
  let m;
  e[2] !== i || e[3] !== u || e[4] !== o || e[5] !== r || e[6] !== l ? (m = () => {
    if (!r) return;
    const w = l ? u : i.message().getCopyText();
    w && Promise.resolve(r(w)).then(() => {
      i.message().setIsCopied(!0), setTimeout(() => i.message().setIsCopied(!1), o);
    }, Fl);
  }, e[2] = i, e[3] = u, e[4] = o, e[5] = r, e[6] = l, e[7] = m) : m = e[7];
  const p = m, h = a || !r;
  let g;
  return e[8] !== p || e[9] !== c || e[10] !== h ? (g = {
    copy: p,
    disabled: h,
    isCopied: c
  }, e[8] = p, e[9] = c, e[10] = h, e[11] = g) : g = e[11], g;
};
function $l(t) {
  return t.type === "text" && t.text.length > 0;
}
function Nl(t) {
  return !((t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some($l));
}
function Ol(t) {
  return t.message.isCopied;
}
function Bl(t) {
  return t.composer.isEditing;
}
function Ll(t) {
  return t.composer.text;
}
function Fl() {
}
const Vl = () => {
  const t = y(5), e = Q(), s = M(ql);
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
function ql(t) {
  return t.composer.isEditing;
}
const Ul = () => {
  const t = y(5), e = Q(), s = M(zl);
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
function zl(t) {
  return t.thread.isRunning || t.thread.isDisabled || t.message.role !== "assistant";
}
const Hl = () => {
  const t = y(5), e = Q(), s = M(Gl);
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
}, jl = () => {
  const t = y(5), e = Q(), s = M(Wl);
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
function Gl(t) {
  return t.message.metadata.submittedFeedback?.type === "positive";
}
function Wl(t) {
  return t.message.metadata.submittedFeedback?.type === "negative";
}
const Yl = () => {
  const t = y(5), e = Q(), s = M(Jl);
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
function Ql(t) {
  return t.type === "text" && t.text.length > 0;
}
function Jl(t) {
  return !((t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some(Ql));
}
const Zl = () => {
  const t = y(5), e = Q(), s = M(Xl);
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
function Xl(t) {
  return t.message.speech == null;
}
const Kl = (t) => {
  const e = y(8), { prompt: s, send: n, clearComposer: r } = t, o = r === void 0 ? !0 : r, i = Q(), a = M(eu), c = n ?? !1;
  let l;
  e[0] !== i || e[1] !== o || e[2] !== s || e[3] !== c ? (l = () => {
    const p = i.thread().getState().isRunning;
    if (c && !p)
      i.thread().append({
        content: [{
          type: "text",
          text: s
        }],
        runConfig: i.composer().getState().runConfig
      }), o && i.composer().setText("");
    else if (o) i.composer().setText(s);
    else {
      const h = i.composer().getState().text;
      i.composer().setText(h.trim() ? `${h} ${s}` : s);
    }
  }, e[0] = i, e[1] = o, e[2] = s, e[3] = c, e[4] = l) : l = e[4];
  const u = l;
  let m;
  return e[5] !== a || e[6] !== u ? (m = {
    trigger: u,
    disabled: a
  }, e[5] = a, e[6] = u, e[7] = m) : m = e[7], m;
};
function eu(t) {
  return t.thread.isDisabled;
}
const tu = () => M(su);
function su(t) {
  if (t.message.status?.type !== "incomplete" || t.message.status.reason !== "error") return;
  const e = t.message.status.error;
  return typeof e == "string" ? e : typeof e == "object" && e !== null && "message" in e && typeof e.message == "string" ? e.message : e ?? "An error occurred";
}
function nu(t, e) {
  function s(n) {
    const r = yn(t);
    if (!n?.optional && !r) throw new Error(`This component must be used within ${e}.`);
    return r;
  }
  return s;
}
const lr = Qt(null), { useThreadViewport: ke, useThreadViewportStore: De } = Po(nu(lr, "ThreadPrimitive.Viewport"), "useThreadViewport"), Fs = (t) => {
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
}, ru = (t = {}) => {
  const e = /* @__PURE__ */ new Set(), s = Fs((i) => {
    o.setState({ height: {
      ...o.getState().height,
      viewport: i
    } });
  }), n = Fs((i) => {
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
  }), o = io(() => ({
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
}, ou = (t) => {
  const e = y(11);
  let s;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (s = { optional: !0 }, e[0] = s) : s = e[0];
  const n = De(s);
  let r;
  e[1] !== t ? (r = () => ru(t), e[1] = t, e[2] = r) : r = e[2];
  const [o] = pe(r);
  let i, a;
  e[3] !== n || e[4] !== o ? (i = () => n?.getState().onScrollToBottom(() => {
    o.getState().scrollToBottom();
  }), a = [n, o], e[3] = n, e[4] = o, e[5] = i, e[6] = a) : (i = e[5], a = e[6]), de(i, a);
  let c, l;
  return e[7] !== n || e[8] !== o ? (c = () => {
    if (n)
      return o.subscribe((u) => {
        n.getState().isAtBottom !== u.isAtBottom && Tn(n).setState({ isAtBottom: u.isAtBottom });
      });
  }, l = [o, n], e[7] = n, e[8] = o, e[9] = c, e[10] = l) : (c = e[9], l = e[10]), de(c, l), o;
}, is = (t) => {
  const e = y(7), { children: s, options: n } = t;
  let r;
  e[0] !== n ? (r = n === void 0 ? {} : n, e[0] = n, e[1] = r) : r = e[1];
  const o = ou(r);
  let i;
  e[2] !== o ? (i = () => ({ useThreadViewport: o }), e[2] = o, e[3] = i) : i = e[3];
  const [a] = pe(i);
  let c;
  return e[4] !== s || e[5] !== a ? (c = /* @__PURE__ */ d(lr.Provider, {
    value: a,
    children: s
  }), e[4] = s, e[5] = a, e[6] = c) : c = e[6], c;
}, iu = () => {
  const t = y(3), e = Q();
  let s, n;
  return t[0] !== e ? (s = () => {
  }, n = [e], t[0] = e, t[1] = s, t[2] = n) : (s = t[1], n = t[2]), de(s, n), null;
}, au = (t) => {
  const e = y(7), { children: s, aui: n, runtime: r } = t, o = n ?? null;
  let i;
  e[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (i = /* @__PURE__ */ d(iu, {}), e[0] = i) : i = e[0];
  let a;
  e[1] !== s ? (a = /* @__PURE__ */ d(is, { children: s }), e[1] = s, e[2] = a) : a = e[2];
  let c;
  return e[3] !== r || e[4] !== o || e[5] !== a ? (c = /* @__PURE__ */ V(Oa, {
    runtime: r,
    aui: o,
    children: [i, a]
  }), e[3] = r, e[4] = o, e[5] = a, e[6] = c) : c = e[6], c;
}, cu = le(au);
var lu = Object.defineProperty, as = (t, e) => lu(t, "name", { value: e, configurable: !0 });
function Bt(t, e) {
  if (typeof t == "function")
    return t(e);
  t != null && (t.current = e);
}
as(Bt, "setRef");
function ur(...t) {
  return (e) => {
    let s = !1;
    const n = t.map((r) => {
      const o = Bt(r, e);
      return !s && typeof o == "function" && (s = !0), o;
    });
    if (s)
      return () => {
        for (let r = 0; r < n.length; r++) {
          const o = n[r];
          typeof o == "function" ? o() : Bt(t[r], null);
        }
      };
  };
}
as(ur, "composeRefs");
function $e(...t) {
  return L(ur(...t), t);
}
as($e, "useComposedRefs");
var uu = Object.defineProperty, ge = (t, e) => uu(t, "name", { value: e, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function dr(t) {
  const e = ae((s, n) => {
    let { children: r, ...o } = s, i = null, a = !1;
    const c = [];
    Lt(r) && typeof it == "function" && (r = it(r._payload)), ps.forEach(r, (p) => {
      if (fr(p)) {
        a = !0;
        const h = p;
        let g = "child" in h.props ? h.props.child : h.props.children;
        Lt(g) && typeof it == "function" && (g = it(g._payload)), i = mu(h, g), c.push(i?.props?.children);
      } else
        c.push(p);
    }), i ? i = mt(i, void 0, c) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && ps.count(r) === 1 && et(r) && (i = r)
    );
    const l = i ? pr(i) : void 0, u = $e(n, l);
    if (!i) {
      if (r || r === 0)
        throw new Error(
          a ? fu(t) : pu(t)
        );
      return r;
    }
    const m = hr(o, i.props ?? {});
    return i.type !== pn && (m.ref = n ? u : l), mt(i, m);
  });
  return e.displayName = `${t}.Slot`, e;
}
ge(dr, "createSlot");
var mr = /* @__PURE__ */ Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function du(t) {
  const e = /* @__PURE__ */ ge((s) => "child" in s ? s.children(s.child) : s.children, "Slottable");
  return e.displayName = `${t}.Slottable`, e.__radixId = mr, e;
}
ge(du, "createSlottable");
var mu = /* @__PURE__ */ ge((t, e) => {
  if ("child" in t.props) {
    const s = t.props.child;
    return et(s) ? mt(s, void 0, t.props.children(s.props.children)) : null;
  }
  return et(e) ? e : null;
}, "getSlottableElementFromSlottable");
function hr(t, e) {
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
ge(hr, "mergeProps");
function pr(t) {
  let e = Object.getOwnPropertyDescriptor(t.props, "ref")?.get, s = e && "isReactWarning" in e && e.isReactWarning;
  return s ? t.ref : (e = Object.getOwnPropertyDescriptor(t, "ref")?.get, s = e && "isReactWarning" in e && e.isReactWarning, s ? t.props.ref : t.props.ref || t.ref);
}
ge(pr, "getElementRef");
function fr(t) {
  return et(t) && typeof t.type == "function" && "__radixId" in t.type && t.type.__radixId === mr;
}
ge(fr, "isSlottable");
var hu = /* @__PURE__ */ Symbol.for("react.lazy");
function Lt(t) {
  return t != null && typeof t == "object" && "$$typeof" in t && t.$$typeof === hu && "_payload" in t && gr(t._payload);
}
ge(Lt, "isLazyComponent");
function gr(t) {
  return typeof t == "object" && t !== null && "then" in t;
}
ge(gr, "isPromiseLike");
var pu = /* @__PURE__ */ ge((t) => `${t} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), fu = /* @__PURE__ */ ge((t) => `${t} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), it = ro[" use ".trim().toString()], gu = Object.defineProperty, vu = (t, e) => gu(t, "name", { value: e, configurable: !0 }), bu = [
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
], xu = bu.reduce((t, e) => {
  const s = /* @__PURE__ */ dr(`Primitive.${e}`), n = ae((r, o) => {
    const { asChild: i, ...a } = r, c = i ? s : e;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ d(c, { ...a, ref: o });
  });
  return n.displayName = `Primitive.${e}`, { ...t, [e]: n };
}, {});
function yu(t, e) {
  t && fi(() => t.dispatchEvent(e));
}
vu(yu, "dispatchDiscreteCustomEvent");
const _u = [
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
function wu(t) {
  const e = ae((s, n) => {
    const r = y(17);
    let o, i, a, c;
    r[0] !== s ? ({ render: a, asChild: o, children: i, ...c } = s, r[0] = s, r[1] = o, r[2] = i, r[3] = a, r[4] = c) : (o = r[1], i = r[2], a = r[3], c = r[4]);
    const l = t;
    if (a && et(a)) {
      const p = i !== void 0 ? i : a.props.children, h = c;
      let g;
      r[5] !== a || r[6] !== p ? (g = mt(a, void 0, p), r[5] = a, r[6] = p, r[7] = g) : g = r[7];
      let w;
      return r[8] !== n || r[9] !== h || r[10] !== g ? (w = /* @__PURE__ */ d(l, {
        ...h,
        asChild: !0,
        ref: n,
        children: g
      }), r[8] = n, r[9] = h, r[10] = g, r[11] = w) : w = r[11], w;
    }
    const u = c;
    let m;
    return r[12] !== o || r[13] !== i || r[14] !== n || r[15] !== u ? (m = /* @__PURE__ */ d(l, {
      ...u,
      asChild: o,
      ref: n,
      children: i
    }), r[12] = o, r[13] = i, r[14] = n, r[15] = u, r[16] = m) : m = r[16], m;
  });
  return e.displayName = typeof t == "string" ? t : t.displayName ?? t.name ?? "Component", e;
}
function Tu(t) {
  const e = xu[t], s = wu(e);
  return s.displayName = `Primitive.${t}`, s;
}
const me = _u.reduce((t, e) => (t[e] = Tu(e), t), {}), Iu = (t) => {
  const e = y(5), { hideWhenRunning: s, autohide: n, autohideFloat: r, forceVisible: o } = t;
  let i;
  return e[0] !== n || e[1] !== r || e[2] !== o || e[3] !== s ? (i = (a) => {
    if (s && a.thread.isRunning) return "hidden";
    const c = n === "always" || n === "not-last" && !a.message.isLast, l = o || a.message.isHovering;
    return c ? l ? r === "always" || r === "single-branch" && a.message.branchCount <= 1 ? "floating" : "normal" : "hidden" : "normal";
  }, e[0] = n, e[1] = r, e[2] = o, e[3] = s, e[4] = i) : i = e[4], M(i);
}, Su = Qt(null), vr = ae((t, e) => {
  const s = y(18);
  let n, r, o, i;
  s[0] !== t ? ({ hideWhenRunning: o, autohide: n, autohideFloat: r, ...i } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o, s[4] = i) : (n = s[1], r = s[2], o = s[3], i = s[4]);
  const [a, c] = pe(0);
  let l;
  s[5] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (l = () => {
    let D = !1;
    return c(Cu), () => {
      D || (D = !0, c(Ru));
    };
  }, s[5] = l) : l = s[5];
  const u = l;
  let m;
  s[6] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (m = { acquireInteractionLock: u }, s[6] = m) : m = s[6];
  const p = m, h = a > 0;
  let g;
  s[7] !== n || s[8] !== r || s[9] !== o || s[10] !== h ? (g = {
    hideWhenRunning: o,
    autohide: n,
    autohideFloat: r,
    forceVisible: h
  }, s[7] = n, s[8] = r, s[9] = o, s[10] = h, s[11] = g) : g = s[11];
  const w = Iu(g);
  if (w === "hidden") return null;
  let x;
  s[12] !== w ? (x = w === "floating" ? { "data-floating": "true" } : null, s[12] = w, s[13] = x) : x = s[13];
  let C;
  return s[14] !== e || s[15] !== i || s[16] !== x ? (C = /* @__PURE__ */ d(Su.Provider, {
    value: p,
    children: /* @__PURE__ */ d(me.div, {
      ...x,
      ...i,
      ref: e
    })
  }), s[14] = e, s[15] = i, s[16] = x, s[17] = C) : C = s[17], C;
});
vr.displayName = "ActionBarPrimitive.Root";
function Cu(t) {
  return t + 1;
}
function Ru(t) {
  return Math.max(0, t - 1);
}
var Eu = Object.defineProperty, He = (t, e) => Eu(t, "name", { value: e, configurable: !0 }), br = !!(typeof window < "u" && window.document && window.document.createElement);
function Ne(t, e, { checkForDefaultPrevented: s = !0 } = {}) {
  return /* @__PURE__ */ He(function(r) {
    if (t?.(r), s === !1 || !r || !r.defaultPrevented)
      return e?.(r);
  }, "handleEvent");
}
He(Ne, "composeEventHandlers");
function Mu(t) {
  if (!br)
    throw new Error("Cannot access window outside of the DOM");
  return t?.ownerDocument?.defaultView ?? window;
}
He(Mu, "getOwnerWindow");
function Ft(t) {
  if (!br)
    throw new Error("Cannot access document outside of the DOM");
  return t?.ownerDocument ?? document;
}
He(Ft, "getOwnerDocument");
function xr(t, e = !1) {
  const { activeElement: s } = Ft(t);
  if (!s?.nodeName)
    return null;
  if (yr(s) && s.contentDocument)
    return xr(s.contentDocument.body, e);
  if (e) {
    const n = s.getAttribute("aria-activedescendant");
    if (n) {
      const r = Ft(s).getElementById(n);
      if (r)
        return r;
    }
  }
  return s;
}
He(xr, "getActiveElement");
function yr(t) {
  return t.tagName === "IFRAME";
}
He(yr, "isFrame");
const Au = (t) => {
  const e = y(4);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { copiedDuration: n } = s, r = n === void 0 ? 3e3 : n;
  let o;
  e[2] !== r ? (o = {
    copiedDuration: r,
    copyToClipboard: Pu
  }, e[2] = r, e[3] = o) : o = e[3];
  const { copy: i, disabled: a } = Dl(o);
  return a ? null : i;
}, _r = ae((t, e) => {
  const s = y(20);
  let n, r, o, i;
  s[0] !== t ? ({ copiedDuration: n, onClick: o, disabled: r, ...i } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o, s[4] = i) : (n = s[1], r = s[2], o = s[3], i = s[4]);
  const a = M(ku);
  let c;
  s[5] !== n ? (c = { copiedDuration: n }, s[5] = n, s[6] = c) : c = s[6];
  const l = Au(c);
  let u;
  s[7] !== a ? (u = a ? { "data-copied": "true" } : {}, s[7] = a, s[8] = u) : u = s[8];
  const m = r || !l;
  let p;
  s[9] !== l ? (p = () => {
    l?.();
  }, s[9] = l, s[10] = p) : p = s[10];
  let h;
  s[11] !== o || s[12] !== p ? (h = Ne(o, p), s[11] = o, s[12] = p, s[13] = h) : h = s[13];
  let g;
  return s[14] !== e || s[15] !== i || s[16] !== u || s[17] !== m || s[18] !== h ? (g = /* @__PURE__ */ d(me.button, {
    type: "button",
    ...u,
    ...i,
    ref: e,
    disabled: m,
    onClick: h
  }), s[14] = e, s[15] = i, s[16] = u, s[17] = m, s[18] = h, s[19] = g) : g = s[19], g;
});
_r.displayName = "ActionBarPrimitive.Copy";
function Pu(t) {
  return typeof navigator > "u" || !navigator.clipboard ? Promise.reject(/* @__PURE__ */ new Error("Clipboard API is unavailable")) : navigator.clipboard.writeText(t);
}
function ku(t) {
  return t.message.isCopied;
}
const tt = (t, e, s = []) => {
  const n = ae((r, o) => {
    const i = y(6), a = {}, c = {};
    Object.keys(r).forEach((w) => {
      s.includes(w) ? a[w] = r[w] : c[w] = r[w];
    });
    const l = e(a) ?? void 0, u = me, m = "button", p = c.disabled || !l, h = Ne(c.onClick, l);
    let g;
    return i[0] !== o || i[1] !== c || i[2] !== u.button || i[3] !== p || i[4] !== h ? (g = /* @__PURE__ */ d(u.button, {
      ...c,
      type: m,
      ref: o,
      disabled: p,
      onClick: h
    }), i[0] = o, i[1] = c, i[2] = u.button, i[3] = p, i[4] = h, i[5] = g) : g = i[5], g;
  });
  return n.displayName = t, n;
}, Du = () => {
  const { disabled: t, reload: e } = Ul();
  return t ? null : e;
}, $u = tt("ActionBarPrimitive.Reload", Du), Nu = () => {
  const { disabled: t, edit: e } = Vl();
  return t ? null : e;
}, Ou = tt("ActionBarPrimitive.Edit", Nu), Bu = () => {
  const { disabled: t, speak: e } = Yl();
  return t ? null : e;
}, Lu = tt("ActionBarPrimitive.Speak", Bu);
var Fu = Object.defineProperty, wr = (t, e) => Fu(t, "name", { value: e, configurable: !0 });
function Tr(t, e = globalThis?.document) {
  const s = Jt(t);
  ie(() => {
    const n = /* @__PURE__ */ wr((r) => {
      r.key === "Escape" && s(r);
    }, "handleKeyDown");
    return e.addEventListener("keydown", n, { capture: !0 }), () => e.removeEventListener("keydown", n, { capture: !0 });
  }, [s, e]);
}
wr(Tr, "useEscapeKeydown");
const Vu = () => {
  const { disabled: t, stopSpeaking: e } = Zl();
  return t ? null : e;
}, Ir = ae((t, e) => {
  const s = y(12), n = Vu();
  let r;
  s[0] !== n ? (r = (l) => {
    n && (l.preventDefault(), n());
  }, s[0] = n, s[1] = r) : r = s[1], Tr(r);
  const o = !n;
  let i;
  s[2] !== n ? (i = () => {
    n?.();
  }, s[2] = n, s[3] = i) : i = s[3];
  let a;
  s[4] !== t.onClick || s[5] !== i ? (a = Ne(t.onClick, i), s[4] = t.onClick, s[5] = i, s[6] = a) : a = s[6];
  let c;
  return s[7] !== t || s[8] !== e || s[9] !== o || s[10] !== a ? (c = /* @__PURE__ */ d(me.button, {
    type: "button",
    disabled: o,
    ...t,
    ref: e,
    onClick: a
  }), s[7] = t, s[8] = e, s[9] = o, s[10] = a, s[11] = c) : c = s[11], c;
});
Ir.displayName = "ActionBarPrimitive.StopSpeaking";
const qu = () => {
  const { submit: t } = Hl();
  return t;
}, Sr = ae((t, e) => {
  const s = y(17);
  let n, r, o;
  s[0] !== t ? ({ onClick: r, disabled: n, ...o } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o) : (n = s[1], r = s[2], o = s[3]);
  const i = M(Uu), a = qu();
  let c;
  s[4] !== i ? (c = i ? { "data-submitted": "true" } : {}, s[4] = i, s[5] = c) : c = s[5];
  const l = n || !a;
  let u;
  s[6] !== a ? (u = () => {
    a?.();
  }, s[6] = a, s[7] = u) : u = s[7];
  let m;
  s[8] !== r || s[9] !== u ? (m = Ne(r, u), s[8] = r, s[9] = u, s[10] = m) : m = s[10];
  let p;
  return s[11] !== e || s[12] !== o || s[13] !== c || s[14] !== l || s[15] !== m ? (p = /* @__PURE__ */ d(me.button, {
    type: "button",
    ...c,
    ...o,
    ref: e,
    disabled: l,
    onClick: m
  }), s[11] = e, s[12] = o, s[13] = c, s[14] = l, s[15] = m, s[16] = p) : p = s[16], p;
});
Sr.displayName = "ActionBarPrimitive.FeedbackPositive";
function Uu(t) {
  return t.message.metadata.submittedFeedback?.type === "positive";
}
const zu = () => {
  const { submit: t } = jl();
  return t;
}, Cr = ae((t, e) => {
  const s = y(17);
  let n, r, o;
  s[0] !== t ? ({ onClick: r, disabled: n, ...o } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o) : (n = s[1], r = s[2], o = s[3]);
  const i = M(Hu), a = zu();
  let c;
  s[4] !== i ? (c = i ? { "data-submitted": "true" } : {}, s[4] = i, s[5] = c) : c = s[5];
  const l = n || !a;
  let u;
  s[6] !== a ? (u = () => {
    a?.();
  }, s[6] = a, s[7] = u) : u = s[7];
  let m;
  s[8] !== r || s[9] !== u ? (m = Ne(r, u), s[8] = r, s[9] = u, s[10] = m) : m = s[10];
  let p;
  return s[11] !== e || s[12] !== o || s[13] !== c || s[14] !== l || s[15] !== m ? (p = /* @__PURE__ */ d(me.button, {
    type: "button",
    ...c,
    ...o,
    ref: e,
    disabled: l,
    onClick: m
  }), s[11] = e, s[12] = o, s[13] = c, s[14] = l, s[15] = m, s[16] = p) : p = s[16], p;
});
Cr.displayName = "ActionBarPrimitive.FeedbackNegative";
function Hu(t) {
  return t.message.metadata.submittedFeedback?.type === "negative";
}
const ju = (t) => {
  const e = y(6);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { filename: n, onExport: r } = s, o = Q(), i = M(Wu);
  let a;
  e[2] !== o || e[3] !== n || e[4] !== r ? (a = async () => {
    const l = o.message().getCopyText();
    if (!l) return;
    if (r) {
      await r(l);
      return;
    }
    const u = new Blob([l], { type: "text/markdown" }), m = URL.createObjectURL(u), p = document.createElement("a");
    p.href = m, p.download = n ?? `message-${Date.now()}.md`, p.click(), URL.revokeObjectURL(m);
  }, e[2] = o, e[3] = n, e[4] = r, e[5] = a) : a = e[5];
  const c = a;
  return i ? c : null;
}, Rr = ae((t, e) => {
  const s = y(19);
  let n, r, o, i, a;
  s[0] !== t ? ({ filename: r, onExport: i, onClick: o, disabled: n, ...a } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o, s[4] = i, s[5] = a) : (n = s[1], r = s[2], o = s[3], i = s[4], a = s[5]);
  let c;
  s[6] !== r || s[7] !== i ? (c = {
    filename: r,
    onExport: i
  }, s[6] = r, s[7] = i, s[8] = c) : c = s[8];
  const l = ju(c), u = n || !l;
  let m;
  s[9] !== l ? (m = () => {
    l?.();
  }, s[9] = l, s[10] = m) : m = s[10];
  let p;
  s[11] !== o || s[12] !== m ? (p = Ne(o, m), s[11] = o, s[12] = m, s[13] = p) : p = s[13];
  let h;
  return s[14] !== e || s[15] !== a || s[16] !== u || s[17] !== p ? (h = /* @__PURE__ */ d(me.button, {
    type: "button",
    ...a,
    ref: e,
    disabled: u,
    onClick: p
  }), s[14] = e, s[15] = a, s[16] = u, s[17] = p, s[18] = h) : h = s[18], h;
});
Rr.displayName = "ActionBarPrimitive.ExportMarkdown";
function Gu(t) {
  return t.type === "text" && t.text.length > 0;
}
function Wu(t) {
  return (t.message.role !== "assistant" || t.message.status?.type !== "running") && t.message.parts.some(Gu);
}
var Yu = /* @__PURE__ */ Zt({
  Copy: () => _r,
  Edit: () => Ou,
  ExportMarkdown: () => Rr,
  FeedbackNegative: () => Cr,
  FeedbackPositive: () => Sr,
  Reload: () => $u,
  Root: () => vr,
  Speak: () => Lu,
  StopSpeaking: () => Ir
});
const Qu = (t) => {
  const e = y(12);
  let s;
  return e[0] !== t.assistant || e[1] !== t.copied || e[2] !== t.hasAttachments || e[3] !== t.hasBranches || e[4] !== t.hasContent || e[5] !== t.last || e[6] !== t.lastOrHover || e[7] !== t.speaking || e[8] !== t.submittedFeedback || e[9] !== t.system || e[10] !== t.user ? (s = (n) => {
    const { role: r, attachments: o, parts: i, branchCount: a, isLast: c, speech: l, isCopied: u, isHovering: m } = n.message;
    return !(t.hasBranches === !0 && a < 2 || t.user && r !== "user" || t.assistant && r !== "assistant" || t.system && r !== "system" || t.lastOrHover === !0 && !m && !c || t.last !== void 0 && t.last !== c || t.copied === !0 && !u || t.copied === !1 && u || t.speaking === !0 && l == null || t.speaking === !1 && l != null || t.hasAttachments === !0 && (r !== "user" || !o?.length) || t.hasAttachments === !1 && r === "user" && o?.length || t.hasContent === !0 && i.length === 0 || t.hasContent === !1 && i.length > 0 || t.submittedFeedback !== void 0 && (n.message.metadata.submittedFeedback?.type ?? null) !== t.submittedFeedback);
  }, e[0] = t.assistant, e[1] = t.copied, e[2] = t.hasAttachments, e[3] = t.hasBranches, e[4] = t.hasContent, e[5] = t.last, e[6] = t.lastOrHover, e[7] = t.speaking, e[8] = t.submittedFeedback, e[9] = t.system, e[10] = t.user, e[11] = s) : s = e[11], M(s);
}, Er = (t) => {
  const e = y(3);
  let s, n;
  return e[0] !== t ? ({ children: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]), Qu(n) ? s : null;
};
Er.displayName = "MessagePrimitive.If";
const Ju = (t) => {
  const e = y(4), s = Jt(t), n = ke(Zu);
  let r, o;
  e[0] !== s || e[1] !== n ? (r = () => n(s), o = [n, s], e[0] = s, e[1] = n, e[2] = r, e[3] = o) : (r = e[2], o = e[3]), de(r, o);
};
function Zu(t) {
  return t.onScrollToBottom;
}
const Xu = () => M(Ku);
function Ku(t) {
  if (t.part.type !== "image") throw new Error("MessagePartImage can only be used inside image message parts.");
  return t.part;
}
const cs = ae((t, e) => {
  const s = y(10);
  let n, r, o;
  s[0] !== t ? ({ smooth: r, component: o, ...n } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o) : (n = s[1], r = s[2], o = s[3]);
  const i = r === void 0 ? !0 : r, a = o === void 0 ? "span" : o, { text: c, status: l } = ko(Do(), i);
  let u;
  return s[4] !== a || s[5] !== e || s[6] !== n || s[7] !== l.type || s[8] !== c ? (u = /* @__PURE__ */ d(a, {
    "data-status": l.type,
    ...n,
    ref: e,
    children: c
  }), s[4] = a, s[5] = e, s[6] = n, s[7] = l.type, s[8] = c, s[9] = u) : u = s[9], u;
});
cs.displayName = "MessagePartPrimitive.Text";
const ls = ae((t, e) => {
  const s = y(4), { image: n } = Xu();
  let r;
  return s[0] !== e || s[1] !== n || s[2] !== t ? (r = /* @__PURE__ */ d(me.img, {
    src: n,
    ...t,
    ref: e
  }), s[0] = e, s[1] = n, s[2] = t, s[3] = r) : r = s[3], r;
});
ls.displayName = "MessagePartPrimitive.Image";
const Oe = (t) => {
  const e = y(2), s = ve(void 0);
  let n;
  return e[0] !== t ? (n = (r) => {
    s.current && (s.current(), s.current = void 0), r && (s.current = t(r));
  }, e[0] = t, e[1] = n) : n = e[1], n;
}, Vs = (t, e) => {
  const s = t.trim().match(/^(\d+(?:\.\d+)?|\.\d+)(em|px|rem)$/);
  if (!s) return Number.POSITIVE_INFINITY;
  const n = Number(s[1]), r = s[2];
  return r === "px" ? n : r === "em" ? n * (parseFloat(getComputedStyle(e).fontSize) || 16) : r === "rem" ? n * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) : Number.POSITIVE_INFINITY;
}, ed = (t) => t.dataset.messageId, td = () => {
  const t = document.createElement("div");
  return t.dataset.auiTopAnchorReserve = "", t.style.height = "0px", t.style.flexShrink = "0", t.style.pointerEvents = "none", t.setAttribute("aria-hidden", "true"), t;
}, qs = (t, e) => {
  const s = `${e}px`;
  return t.style.height !== s ? (t.style.height = s, !0) : !1;
}, sd = (t) => {
  const e = window.devicePixelRatio || 1;
  return Math.round(t * e) / e;
}, Mr = () => {
  const t = y(4), e = Q();
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
  }, t[2] = n, t[3] = r) : r = t[3], Oe(r);
}, nd = () => {
  const t = y(2), e = ke(ld);
  let s;
  return t[0] !== e ? (s = (n) => n.message.role === "user" && n.message.index > 0 && n.message.index === n.thread.messages.length - 2 && n.thread.messages.at(-1)?.role === "assistant" && (n.message.id === e || n.thread.isRunning), t[0] = e, t[1] = s) : s = t[1], M(s);
}, rd = () => {
  const t = y(2), e = ke(ud);
  let s;
  return t[0] !== e ? (s = (n) => n.message.isLast && n.message.role === "assistant" && n.message.index >= 1 && n.thread.messages.at(n.message.index - 1)?.role === "user" && (n.message.id === e || n.thread.isRunning), t[0] = e, t[1] = s) : s = t[1], M(s);
}, od = (t, e) => {
  const s = y(3);
  let n;
  return s[0] !== t || s[1] !== e ? (n = (r) => {
    if (t)
      return e.getState().registerAnchorElement(r);
  }, s[0] = t, s[1] = e, s[2] = n) : n = s[2], Oe(n);
}, id = (t) => {
  const e = y(3), { active: s, threadViewportStore: n } = t;
  let r;
  return e[0] !== s || e[1] !== n ? (r = (o) => {
    if (!s) return;
    const i = n.getState(), a = i.topAnchorMessageClamp;
    return i.registerAnchorTargetElement(o, {
      tallerThan: Vs(a.tallerThan, o),
      visibleHeight: Vs(a.visibleHeight, o)
    });
  }, e[0] = s, e[1] = n, e[2] = r) : r = e[2], Oe(r);
}, ad = (t) => {
  const e = y(7);
  let s, n;
  e[0] !== t ? ({ forwardedRef: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  const r = Mr(), o = $e(s, r), i = M(dd);
  let a;
  return e[3] !== i || e[4] !== n || e[5] !== o ? (a = /* @__PURE__ */ d(me.div, {
    ...n,
    ref: o,
    "data-message-id": i
  }), e[3] = i, e[4] = n, e[5] = o, e[6] = a) : a = e[6], a;
}, cd = (t) => {
  const e = y(13);
  let s, n, r;
  e[0] !== t ? ({ forwardedRef: s, threadViewportStore: r, ...n } = t, e[0] = t, e[1] = s, e[2] = n, e[3] = r) : (s = e[1], n = e[2], r = e[3]);
  const o = Mr(), i = nd(), a = rd(), c = od(i, r);
  let l;
  e[4] !== a || e[5] !== r ? (l = {
    active: a,
    threadViewportStore: r
  }, e[4] = a, e[5] = r, e[6] = l) : l = e[6];
  const u = id(l), m = $e(s, o, c, u), p = M(md), h = i ? "" : void 0, g = a ? "" : void 0;
  let w;
  return e[7] !== p || e[8] !== n || e[9] !== m || e[10] !== h || e[11] !== g ? (w = /* @__PURE__ */ d(me.div, {
    ...n,
    ref: m,
    "data-message-id": p,
    "data-aui-top-anchor-user": h,
    "data-aui-top-anchor-target": g
  }), e[7] = p, e[8] = n, e[9] = m, e[10] = h, e[11] = g, e[12] = w) : w = e[12], w;
}, Ar = ae((t, e) => {
  const s = y(7), n = De();
  if (n.getState().turnAnchor === "top") {
    let o;
    return s[0] !== e || s[1] !== t || s[2] !== n ? (o = /* @__PURE__ */ d(cd, {
      ...t,
      forwardedRef: e,
      threadViewportStore: n
    }), s[0] = e, s[1] = t, s[2] = n, s[3] = o) : o = s[3], o;
  }
  let r;
  return s[4] !== e || s[5] !== t ? (r = /* @__PURE__ */ d(ad, {
    ...t,
    forwardedRef: e
  }), s[4] = e, s[5] = t, s[6] = r) : r = s[6], r;
});
Ar.displayName = "MessagePrimitive.Root";
function ld(t) {
  return t.topAnchorTurn?.anchorId;
}
function ud(t) {
  return t.topAnchorTurn?.targetId;
}
function dd(t) {
  return t.message.id;
}
function md(t) {
  return t.message.id;
}
const Rt = {
  ...ce,
  Text: () => /* @__PURE__ */ V("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ d(cs, {}), /* @__PURE__ */ d(os, { children: /* @__PURE__ */ d("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Image: () => /* @__PURE__ */ d(ls, {})
}, Vt = (t) => {
  const e = y(10);
  if ("children" in t) {
    let a;
    return e[0] !== t.children ? (a = /* @__PURE__ */ d(Ot, { children: t.children }), e[0] = t.children, e[1] = a) : a = e[1], a;
  }
  let s, n;
  e[2] !== t ? ({ components: s, ...n } = t, e[2] = t, e[3] = s, e[4] = n) : (s = e[3], n = e[4]);
  let r;
  e[5] !== s ? (r = s ? {
    Text: s.Text ?? Rt.Text,
    Image: s.Image ?? Rt.Image,
    Reasoning: s.Reasoning ?? ce.Reasoning,
    Source: s.Source ?? ce.Source,
    File: s.File ?? ce.File,
    Unstable_Audio: s.Unstable_Audio ?? ce.Unstable_Audio,
    ..."ChainOfThought" in s ? { ChainOfThought: s.ChainOfThought } : {
      tools: s.tools,
      data: s.data,
      ToolGroup: s.ToolGroup ?? ce.ToolGroup,
      ReasoningGroup: s.ReasoningGroup ?? ce.ReasoningGroup
    },
    Empty: s.Empty,
    Quote: s.Quote,
    generativeUI: s.generativeUI
  } : Rt, e[5] = s, e[6] = r) : r = e[6];
  const o = r;
  let i;
  return e[7] !== n || e[8] !== o ? (i = /* @__PURE__ */ d(Ot, {
    components: o,
    ...n
  }), e[7] = n, e[8] = o, e[9] = i) : i = e[9], i;
};
Vt.displayName = "MessagePrimitive.Parts";
const Pr = (t) => {
  const { children: e } = t;
  return tu() !== void 0 ? e : null;
};
Pr.displayName = "MessagePrimitive.Error";
const hd = (t) => {
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
}, pd = (t) => {
  const e = y(4), s = M(Id);
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
}, fd = (t) => {
  const e = y(9);
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
  return e[6] !== o || e[7] !== n ? (i = /* @__PURE__ */ d(o, { ...n }), e[6] = o, e[7] = n, e[8] = i) : i = e[8], i;
}, gd = (t) => {
  const e = y(9);
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
  return e[6] !== o || e[7] !== n ? (i = /* @__PURE__ */ d(o, { ...n }), e[6] = o, e[7] = n, e[8] = i) : i = e[8], i;
}, Ie = {
  Text: () => /* @__PURE__ */ V("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ d(cs, {}), /* @__PURE__ */ d(os, { children: /* @__PURE__ */ d("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Reasoning: () => null,
  Source: () => null,
  Image: () => /* @__PURE__ */ d(ls, {}),
  File: () => null,
  Unstable_Audio: () => null,
  Group: ({ children: t }) => t
}, vd = (t) => {
  const e = y(43), { components: s } = t;
  let n;
  e[0] !== s ? (n = s === void 0 ? {} : s, e[0] = s, e[1] = n) : n = e[1];
  const { Text: r, Reasoning: o, Image: i, Source: a, File: c, Unstable_Audio: l, tools: u, data: m } = n, p = r === void 0 ? Ie.Text : r, h = o === void 0 ? Ie.Reasoning : o, g = i === void 0 ? Ie.Image : i, w = a === void 0 ? Ie.Source : a, x = c === void 0 ? Ie.File : c, C = l === void 0 ? Ie.Unstable_Audio : l;
  let D;
  e[2] !== u ? (D = u === void 0 ? {} : u, e[2] = u, e[3] = D) : D = e[3];
  const R = D, v = Q(), b = M(Sd), I = b.type;
  if (I === "tool-call") {
    let _;
    e[4] !== v ? (_ = v.part(), e[4] = v, e[5] = _) : _ = e[5];
    const T = _.addToolResult;
    let $;
    e[6] !== v ? ($ = v.part(), e[6] = v, e[7] = $) : $ = e[7];
    const k = $.resumeToolCall;
    let z;
    e[8] !== v ? (z = v.part(), e[8] = v, e[9] = z) : z = e[9];
    const B = z.respondToToolApproval;
    if ("Override" in R) {
      let J;
      return e[10] !== T || e[11] !== b || e[12] !== B || e[13] !== k || e[14] !== R.Override ? (J = /* @__PURE__ */ d(R.Override, {
        ...b,
        addResult: T,
        resume: k,
        respondToApproval: B
      }), e[10] = T, e[11] = b, e[12] = B, e[13] = k, e[14] = R.Override, e[15] = J) : J = e[15], J;
    }
    const U = R.by_name?.[b.toolName] ?? R.Fallback;
    let W;
    return e[16] !== U || e[17] !== T || e[18] !== b || e[19] !== B || e[20] !== k ? (W = /* @__PURE__ */ d(fd, {
      ...b,
      Fallback: U,
      addResult: T,
      resume: k,
      respondToApproval: B
    }), e[16] = U, e[17] = T, e[18] = b, e[19] = B, e[20] = k, e[21] = W) : W = e[21], W;
  }
  if (b.status?.type === "requires-action") throw new Error("Encountered unexpected requires-action status");
  switch (I) {
    case "text": {
      let _;
      return e[22] !== p || e[23] !== b ? (_ = /* @__PURE__ */ d(p, { ...b }), e[22] = p, e[23] = b, e[24] = _) : _ = e[24], _;
    }
    case "reasoning": {
      let _;
      return e[25] !== h || e[26] !== b ? (_ = /* @__PURE__ */ d(h, { ...b }), e[25] = h, e[26] = b, e[27] = _) : _ = e[27], _;
    }
    case "source": {
      let _;
      return e[28] !== w || e[29] !== b ? (_ = /* @__PURE__ */ d(w, { ...b }), e[28] = w, e[29] = b, e[30] = _) : _ = e[30], _;
    }
    case "image": {
      let _;
      return e[31] !== g || e[32] !== b ? (_ = /* @__PURE__ */ d(g, { ...b }), e[31] = g, e[32] = b, e[33] = _) : _ = e[33], _;
    }
    case "file": {
      let _;
      return e[34] !== x || e[35] !== b ? (_ = /* @__PURE__ */ d(x, { ...b }), e[34] = x, e[35] = b, e[36] = _) : _ = e[36], _;
    }
    case "audio": {
      let _;
      return e[37] !== C || e[38] !== b ? (_ = /* @__PURE__ */ d(C, { ...b }), e[37] = C, e[38] = b, e[39] = _) : _ = e[39], _;
    }
    case "data": {
      const _ = m?.by_name?.[b.name] ?? m?.Fallback;
      let T;
      return e[40] !== _ || e[41] !== b ? (T = /* @__PURE__ */ d(gd, {
        ...b,
        Fallback: _
      }), e[40] = _, e[41] = b, e[42] = T) : T = e[42], T;
    }
    default:
      return console.warn(`Unknown message part type: ${I}`), null;
  }
}, bd = (t) => {
  const e = y(5), { partIndex: s, components: n } = t;
  let r;
  e[0] !== n ? (r = /* @__PURE__ */ d(vd, { components: n }), e[0] = n, e[1] = r) : r = e[1];
  let o;
  return e[2] !== s || e[3] !== r ? (o = /* @__PURE__ */ d(Kt, {
    index: s,
    children: r
  }), e[2] = s, e[3] = r, e[4] = o) : o = e[4], o;
}, xd = le(bd, (t, e) => t.partIndex === e.partIndex && t.components?.Text === e.components?.Text && t.components?.Reasoning === e.components?.Reasoning && t.components?.Source === e.components?.Source && t.components?.Image === e.components?.Image && t.components?.File === e.components?.File && t.components?.Unstable_Audio === e.components?.Unstable_Audio && t.components?.tools === e.components?.tools && t.components?.data === e.components?.data && t.components?.Group === e.components?.Group), yd = (t) => {
  const e = y(6), { status: s, component: n } = t, r = s.type === "running";
  let o;
  e[0] !== n || e[1] !== s ? (o = /* @__PURE__ */ d(n, {
    type: "text",
    text: "",
    status: s
  }), e[0] = n, e[1] = s, e[2] = o) : o = e[2];
  let i;
  return e[3] !== r || e[4] !== o ? (i = /* @__PURE__ */ d(es, {
    text: "",
    isRunning: r,
    children: o
  }), e[3] = r, e[4] = o, e[5] = i) : i = e[5], i;
}, _d = Object.freeze({ type: "complete" }), wd = (t) => {
  const e = y(6), { components: s } = t, n = M(Cd);
  if (s?.Empty) {
    let i;
    return e[0] !== s.Empty || e[1] !== n ? (i = /* @__PURE__ */ d(s.Empty, { status: n }), e[0] = s.Empty, e[1] = n, e[2] = i) : i = e[2], i;
  }
  const r = s?.Text ?? Ie.Text;
  let o;
  return e[3] !== n || e[4] !== r ? (o = /* @__PURE__ */ d(yd, {
    status: n,
    component: r
  }), e[3] = n, e[4] = r, e[5] = o) : o = e[5], o;
}, Td = le(wd, (t, e) => t.components?.Empty === e.components?.Empty && t.components?.Text === e.components?.Text), us = (t) => {
  const e = y(9), { groupingFunction: s, components: n } = t, r = M(Rd), o = pd(s);
  let i;
  e: {
    if (r === 0) {
      let u;
      e[0] !== n ? (u = /* @__PURE__ */ d(Td, { components: n }), e[0] = n, e[1] = u) : u = e[1], i = u;
      break e;
    }
    let l;
    if (e[2] !== n || e[3] !== o) {
      let u;
      e[5] !== n ? (u = (m, p) => /* @__PURE__ */ d(n?.Group ?? Ie.Group, {
        groupKey: m.groupKey,
        indices: m.indices,
        children: m.indices.map((h) => /* @__PURE__ */ d(xd, {
          partIndex: h,
          components: n
        }, h))
      }, `group-${p}-${m.groupKey ?? "ungrouped"}`), e[5] = n, e[6] = u) : u = e[6], l = o.map(u), e[2] = n, e[3] = o, e[4] = l;
    } else l = e[4];
    i = l;
  }
  const a = i;
  let c;
  return e[7] !== a ? (c = /* @__PURE__ */ d(xe, { children: a }), e[7] = a, e[8] = c) : c = e[8], c;
};
us.displayName = "MessagePrimitive.Unstable_PartsGrouped";
const kr = (t) => {
  const e = y(6);
  let s, n;
  e[0] !== t ? ({ components: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]);
  let r;
  return e[3] !== s || e[4] !== n ? (r = /* @__PURE__ */ d(us, {
    ...n,
    components: s,
    groupingFunction: hd
  }), e[3] = s, e[4] = n, e[5] = r) : r = e[5], r;
};
kr.displayName = "MessagePrimitive.Unstable_PartsGroupedByParentId";
function Id(t) {
  return t.message.parts;
}
function Sd(t) {
  return t.part;
}
function Cd(t) {
  return t.message.status ?? _d;
}
function Rd(t) {
  return t.message.parts.length;
}
var qt = /* @__PURE__ */ Zt({
  AttachmentByIndex: () => rr,
  Attachments: () => or,
  Content: () => Vt,
  Error: () => Pr,
  GenerativeUI: () => Wn,
  GroupedParts: () => tr,
  If: () => Er,
  PartByIndex: () => Xe,
  Parts: () => Vt,
  Quote: () => sr,
  Root: () => Ar,
  Unstable_PartsGrouped: () => us,
  Unstable_PartsGroupedByParentId: () => kr
});
const Ed = (t) => {
  const e = y(2), s = Jt(t);
  let n;
  return e[0] !== s ? (n = (r) => {
    const o = new ResizeObserver(() => {
      s();
    }), i = new MutationObserver((a) => {
      a.some(Md) && s();
    });
    return o.observe(r), i.observe(r, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      characterData: !0
    }), () => {
      o.disconnect(), i.disconnect();
    };
  }, e[0] = s, e[1] = n) : n = e[1], Oe(n);
};
function Md(t) {
  return t.type !== "attributes" || t.attributeName !== "style";
}
const Ad = ({ autoScroll: t, scrollToBottomOnRunStart: e = !0, scrollToBottomOnInitialize: s = !0, scrollToBottomOnThreadSwitch: n = !0 }) => {
  const r = ve(null), o = M((v) => v.thread.messages.length > 0), i = ve(!1), a = ve(null), c = De();
  t === void 0 && (t = c.getState().turnAnchor !== "top");
  const l = ve(0), u = ve(0), m = ve(0), p = ve(0), h = ve(null), g = It((v) => {
    const b = r.current;
    b && (h.current = v, b.scrollTo({
      top: b.scrollHeight,
      behavior: v
    }));
  }, []), w = It((v) => {
    h.current = v, a.current !== null && cancelAnimationFrame(a.current), a.current = requestAnimationFrame(() => {
      a.current = null, g(v);
    });
  }, [g]);
  ft(() => () => {
    a.current !== null && cancelAnimationFrame(a.current);
  }, []);
  const x = It(() => {
    const v = c.getState();
    return v.turnAnchor === "top" && v.element.viewport === r.current && v.element.anchor !== null;
  }, [c]), C = () => {
    const v = r.current;
    if (!v) return;
    const b = c.getState().isAtBottom, I = Math.abs(v.scrollHeight - v.scrollTop - v.clientHeight) <= 1 || v.scrollHeight <= v.clientHeight;
    !I && l.current < v.scrollTop || (I ? v.scrollHeight > v.clientHeight + 1 && (h.current = null) : l.current > v.scrollTop && u.current === v.scrollHeight && (h.current = null), (I || h.current === null) && I !== b && Tn(c).setState({ isAtBottom: I })), l.current = v.scrollTop, u.current = v.scrollHeight;
  }, D = Ed(() => {
    const v = r.current;
    if (!v) return;
    const { scrollHeight: b, clientHeight: I } = v;
    if (b === m.current && I === p.current) return;
    m.current = b, p.current = I;
    const _ = h.current;
    _ && x() ? h.current = null : _ ? g(_) : t && c.getState().isAtBottom && g("instant"), C();
  }), R = Oe((v) => {
    const b = () => {
      h.current = null;
    };
    return v.addEventListener("scroll", C), v.addEventListener("pointerdown", b), () => {
      v.removeEventListener("scroll", C), v.removeEventListener("pointerdown", b);
    };
  });
  return ft(() => {
    if (s) {
      if (!o) {
        i.current = !1;
        return;
      }
      i.current || (i.current = !0, h.current === null && w("instant"));
    }
  }, [
    o,
    w,
    s
  ]), Ju(({ behavior: v }) => {
    g(v);
  }), vt("thread.runStart", () => {
    e && c.getState().turnAnchor !== "top" && w("auto");
  }), vt("threadListItem.switchedTo", () => {
    n && w("instant");
  }), $e(D, R, r);
}, Dr = ae((t, e) => {
  const s = y(3);
  let n;
  return s[0] !== t || s[1] !== e ? (n = /* @__PURE__ */ d(me.div, {
    ...t,
    ref: e
  }), s[0] = t, s[1] = e, s[2] = n) : n = s[2], n;
});
Dr.displayName = "ThreadPrimitive.Root";
const $r = (t) => {
  const { children: e } = t;
  return M(Pd) ? e : null;
};
$r.displayName = "ThreadPrimitive.Empty";
function Pd(t) {
  return t.thread.isEmpty;
}
const kd = (t) => {
  const e = y(4);
  let s;
  return e[0] !== t.disabled || e[1] !== t.empty || e[2] !== t.running ? (s = (n) => !(t.empty === !0 && !n.thread.isEmpty || t.empty === !1 && n.thread.isEmpty || t.running === !0 && !n.thread.isRunning || t.running === !1 && n.thread.isRunning || t.disabled === !0 && !n.thread.isDisabled || t.disabled === !1 && n.thread.isDisabled), e[0] = t.disabled, e[1] = t.empty, e[2] = t.running, e[3] = s) : s = e[3], M(s);
}, Nr = (t) => {
  const e = y(3);
  let s, n;
  return e[0] !== t ? ({ children: s, ...n } = t, e[0] = t, e[1] = s, e[2] = n) : (s = e[1], n = e[2]), kd(n) ? s : null;
};
Nr.displayName = "ThreadPrimitive.If";
const Or = (t, e) => {
  const s = y(3);
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
  }, s[0] = e, s[1] = t, s[2] = n) : n = s[2], Oe(n);
}, Us = (t) => {
  let e = 0, s = t;
  for (; s; )
    e += s.offsetTop, s = s.offsetParent;
  return e;
}, Dd = (t, e) => {
  let s = 0, n = t;
  for (; n && n !== e; )
    s += n.offsetTop, n = n.offsetParent;
  return n === e ? s : Us(t) - Us(e);
}, Br = ({ viewport: t, anchor: e, tallerThan: s, visibleHeight: n }) => {
  const r = Dd(e, t), o = e.offsetHeight;
  return r + Math.max(0, o - (o <= s ? o : n));
}, $d = ({ scrollHeight: t, ...e }) => {
  const { viewport: s } = e, n = Br(e) + s.clientHeight;
  return Math.max(0, n - t);
}, Nd = ({ viewport: t, reserve: e, ...s }) => $d({
  viewport: t,
  ...s,
  scrollHeight: t.scrollHeight - e.offsetHeight
}), Od = (t) => {
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
}, Bd = (t) => {
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
}, Ld = (t) => {
  let e = null, s;
  function n() {
    const a = t.getState(), { viewport: c, anchor: l, target: u } = a.element, m = a.targetConfig;
    if (a.turnAnchor !== "top" || !c || !l || !u || !m) {
      o.disconnect(), e && (qs(e, 0), e.remove());
      return;
    }
    if (e ??= td(), (e.parentElement !== u.parentElement || e.previousElementSibling !== u) && u.after(e), o.target(c, l, u), qs(e, Nd({
      viewport: c,
      anchor: l,
      reserve: e,
      ...m
    }))) {
      r.schedule();
      return;
    }
    const p = ed(l);
    if (p !== void 0 && s === p) return;
    const h = sd(Br({
      viewport: c,
      anchor: l,
      ...m
    }));
    Math.abs(c.scrollTop - h) > 1 && c.scrollTo({
      top: h,
      behavior: "smooth"
    }), p !== void 0 && (s = p);
  }
  const r = Bd(n), o = Od(r.schedule);
  r.schedule();
  const i = t.subscribe(r.schedule);
  return () => {
    r.cancel(), i(), o.disconnect(), e?.remove();
  };
}, Fd = (t) => {
  const e = y(4), s = De();
  let n, r;
  e[0] !== t || e[1] !== s ? (n = () => {
    if (t)
      return Ld(s);
  }, r = [t, s], e[0] = t, e[1] = s, e[2] = n, e[3] = r) : (n = e[2], r = e[3]), ft(n, r);
}, Lr = ({ isRunning: t, messages: e }) => {
  if (!t) return null;
  const s = e.at(-1), n = e.at(-2);
  return n?.role !== "user" || s?.role !== "assistant" ? null : {
    anchorId: n.id,
    targetId: s.id
  };
}, Vd = (t) => Lr(t)?.anchorId, qd = (t) => Lr(t)?.targetId, Ud = () => Or(ke(jd), Gd), zd = () => Oe(ke(Wd)), Hd = (t) => {
  const e = y(13), s = De();
  let n;
  e[0] !== t ? (n = (h) => {
    if (t)
      return Vd(h.thread);
  }, e[0] = t, e[1] = n) : n = e[1];
  const r = M(n);
  let o;
  e[2] !== t ? (o = (h) => {
    if (t)
      return qd(h.thread);
  }, e[2] = t, e[3] = o) : o = e[3];
  const i = M(o);
  let a;
  e: {
    if (!r || !i) {
      a = null;
      break e;
    }
    let h;
    e[4] !== r || e[5] !== i ? (h = {
      anchorId: r,
      targetId: i
    }, e[4] = r, e[5] = i, e[6] = h) : h = e[6], a = h;
  }
  const c = a;
  let l, u;
  e[7] !== c || e[8] !== s ? (l = () => {
    if (!c) return;
    const h = s.getState(), g = h.topAnchorTurn;
    g?.anchorId === c.anchorId && g.targetId === c.targetId || h.setTopAnchorTurn(c);
  }, u = [c, s], e[7] = c, e[8] = s, e[9] = l, e[10] = u) : (l = e[9], u = e[10]), ft(l, u);
  let m;
  e[11] !== s ? (m = () => {
    s.getState().setTopAnchorTurn(null);
  }, e[11] = s, e[12] = m) : m = e[12];
  const p = m;
  vt("thread.initialize", p), vt("threadListItem.switchedTo", p);
}, Fr = ae((t, e) => {
  const s = y(18);
  let n, r, o, i, a, c;
  s[0] !== t ? ({ autoScroll: n, scrollToBottomOnRunStart: a, scrollToBottomOnInitialize: i, scrollToBottomOnThreadSwitch: c, children: r, ...o } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o, s[4] = i, s[5] = a, s[6] = c) : (n = s[1], r = s[2], o = s[3], i = s[4], a = s[5], c = s[6]);
  let l;
  s[7] !== n || s[8] !== i || s[9] !== a || s[10] !== c ? (l = {
    autoScroll: n,
    scrollToBottomOnRunStart: a,
    scrollToBottomOnInitialize: i,
    scrollToBottomOnThreadSwitch: c
  }, s[7] = n, s[8] = i, s[9] = a, s[10] = c, s[11] = l) : l = s[11];
  const u = Ad(l), m = Ud(), p = zd(), h = De();
  let g;
  s[12] !== h ? (g = h.getState(), s[12] = h, s[13] = g) : g = s[13];
  const w = g.turnAnchor === "top";
  Hd(w), Fd(w);
  const x = $e(e, u, m, p);
  let C;
  return s[14] !== r || s[15] !== x || s[16] !== o ? (C = /* @__PURE__ */ d(me.div, {
    ...o,
    ref: x,
    children: r
  }), s[14] = r, s[15] = x, s[16] = o, s[17] = C) : C = s[17], C;
});
Fr.displayName = "ThreadPrimitive.ViewportScrollable";
const Vr = ae((t, e) => {
  const s = y(13);
  let n, r, o;
  s[0] !== t ? ({ turnAnchor: o, topAnchorMessageClamp: r, ...n } = t, s[0] = t, s[1] = n, s[2] = r, s[3] = o) : (n = s[1], r = s[2], o = s[3]);
  let i;
  s[4] !== r || s[5] !== o ? (i = {
    turnAnchor: o,
    topAnchorMessageClamp: r
  }, s[4] = r, s[5] = o, s[6] = i) : i = s[6];
  let a;
  s[7] !== n || s[8] !== e ? (a = /* @__PURE__ */ d(Fr, {
    ...n,
    ref: e
  }), s[7] = n, s[8] = e, s[9] = a) : a = s[9];
  let c;
  return s[10] !== i || s[11] !== a ? (c = /* @__PURE__ */ d(is, {
    options: i,
    children: a
  }), s[10] = i, s[11] = a, s[12] = c) : c = s[12], c;
});
Vr.displayName = "ThreadPrimitive.Viewport";
function jd(t) {
  return t.registerViewport;
}
function Gd(t) {
  return t.clientHeight;
}
function Wd(t) {
  return t.registerViewportElement;
}
const qr = ae((t, e) => {
  const s = y(3), n = $e(e, Or(ke(Yd), Qd));
  let r;
  return s[0] !== t || s[1] !== n ? (r = /* @__PURE__ */ d(me.div, {
    ...t,
    ref: n
  }), s[0] = t, s[1] = n, s[2] = r) : r = s[2], r;
});
qr.displayName = "ThreadPrimitive.ViewportFooter";
function Yd(t) {
  return t.registerContentInset;
}
function Qd(t) {
  const e = parseFloat(getComputedStyle(t).marginTop) || 0;
  return t.offsetHeight + e;
}
const Jd = (t) => {
  const e = y(5);
  let s;
  e[0] !== t ? (s = t === void 0 ? {} : t, e[0] = t, e[1] = s) : s = e[1];
  const { behavior: n } = s, r = ke(Xd), o = De();
  let i;
  e[2] !== n || e[3] !== o ? (i = () => {
    o.getState().scrollToBottom({ behavior: n });
  }, e[2] = n, e[3] = o, e[4] = i) : i = e[4];
  const a = i;
  return r ? null : a;
}, Zd = tt("ThreadPrimitive.ScrollToBottom", Jd, ["behavior"]);
function Xd(t) {
  return t.isAtBottom;
}
const Kd = (t) => {
  const e = y(4), { prompt: s, send: n, clearComposer: r, autoSend: o } = t, i = n ?? o ?? !1;
  let a;
  e[0] !== r || e[1] !== s || e[2] !== i ? (a = {
    prompt: s,
    send: i,
    clearComposer: r
  }, e[0] = r, e[1] = s, e[2] = i, e[3] = a) : a = e[3];
  const { disabled: c, trigger: l } = Kl(a);
  return c ? null : l;
}, em = tt("ThreadPrimitive.Suggestion", Kd, [
  "prompt",
  "send",
  "clearComposer",
  "autoSend",
  "method"
]);
var Qe = /* @__PURE__ */ Zt({
  Empty: () => $r,
  If: () => Nr,
  MessageByIndex: () => Un,
  Messages: () => Nc,
  Root: () => Dr,
  ScrollToBottom: () => Zd,
  Suggestion: () => em,
  SuggestionByIndex: () => ar,
  Suggestions: () => kl,
  Unstable_MessageById: () => zn,
  Viewport: () => Vr,
  ViewportFooter: () => qr,
  ViewportProvider: () => is
});
function tm({
  controller: t,
  children: e
}) {
  const s = L(
    async (o) => {
      const i = o.content.filter((a) => a.type === "text").map((a) => a.text).join("").trim();
      i && await t.send(In(i));
    },
    [t.send]
  ), n = L(() => t.stop(), [t.stop]), r = Ac({
    messages: t.messages,
    isRunning: t.running,
    isLoading: t.sessionLoading,
    isDisabled: t.sessionLoading,
    isSendDisabled: t.sendDisabled,
    convertMessage: sm,
    onNew: s,
    onCancel: n
  });
  return /* @__PURE__ */ d(cu, { runtime: r, children: e });
}
function sm(t) {
  return t.role === "user" ? {
    id: t.id,
    role: "user",
    content: t.text ? [{ type: "text", text: t.text }] : [],
    metadata: {
      custom: zs(t)
    }
  } : {
    id: t.id,
    role: "assistant",
    content: $o(t),
    status: t.running ? { type: "running" } : t.error ? { type: "incomplete", reason: "error", error: t.text } : { type: "complete", reason: "stop" },
    metadata: {
      custom: zs(t)
    }
  };
}
function zs(t) {
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
const Je = Gt.Button, Hs = fe.Dialog, js = fe.DialogContent, Gs = fe.DialogDescription, Ws = fe.DialogFooter, Ys = fe.DialogHeader, Qs = fe.DialogTitle, nm = yi.Input, rm = bt.cn, Ut = 152, Js = 76, Zs = 6, Ze = 8;
function om({
  session: t,
  active: e,
  controller: s
}) {
  const [n, r] = X(!1), [o, i] = X(!1), [a, c] = X(t.title), [l, u] = X(""), [m, p] = X(!1), [h, g] = X(!1), [w, x] = X(!1), [C, D] = X({
    top: 0,
    left: 0
  }), R = ee(null), v = ee(null);
  ie(() => {
    if (!w)
      return;
    const k = (U) => {
      const W = U.target;
      W instanceof Node && (R.current?.contains(W) || v.current?.contains(W) || x(!1));
    }, z = (U) => {
      U.key === "Escape" && x(!1);
    }, B = () => x(!1);
    return document.addEventListener("pointerdown", k, !0), document.addEventListener("keydown", z), document.addEventListener("scroll", B, !0), window.addEventListener("resize", B), () => {
      document.removeEventListener("pointerdown", k, !0), document.removeEventListener("keydown", z), document.removeEventListener("scroll", B, !0), window.removeEventListener("resize", B);
    };
  }, [w]);
  const b = () => {
    x(!1), c(t.title), u(""), r(!0);
  }, I = async (k) => {
    k.preventDefault();
    const z = a.trim();
    if (!z) {
      u("请输入会话标题");
      return;
    }
    p(!0), u("");
    try {
      await s.renameSession(t.id, z), r(!1);
    } catch (B) {
      u(Xs(B, "编辑标题失败"));
    } finally {
      p(!1);
    }
  }, _ = async () => {
    g(!0), u("");
    try {
      await s.deleteSession(t.id), i(!1);
    } catch (k) {
      u(Xs(k, "删除会话失败"));
    } finally {
      g(!1);
    }
  }, T = (k) => {
    if (k.stopPropagation(), w) {
      x(!1);
      return;
    }
    R.current && (D(im(R.current)), x(!0));
  }, $ = w && typeof document < "u" ? gi(
    /* @__PURE__ */ V(
      "div",
      {
        ref: v,
        role: "menu",
        "aria-label": `管理会话：${t.title}`,
        "data-assistant-layer": "true",
        className: "rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        style: {
          position: "fixed",
          top: C.top,
          left: C.left,
          width: Ut,
          zIndex: dt,
          pointerEvents: "auto"
        },
        onClick: (k) => k.stopPropagation(),
        children: [
          /* @__PURE__ */ V(
            "button",
            {
              type: "button",
              role: "menuitem",
              className: "flex w-full items-center gap-2 rounded-sm border-0 bg-transparent px-2 py-1.5 text-left text-sm outline-none hover:bg-accent focus-visible:bg-accent",
              onClick: b,
              children: [
                /* @__PURE__ */ d(bi, { className: "size-4 shrink-0" }),
                "编辑标题"
              ]
            }
          ),
          /* @__PURE__ */ V(
            "button",
            {
              type: "button",
              role: "menuitem",
              disabled: !!t.running,
              className: "flex w-full items-center gap-2 rounded-sm border-0 bg-transparent px-2 py-1.5 text-left text-sm text-destructive outline-none hover:bg-destructive/10 focus-visible:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50",
              onClick: () => {
                x(!1), u(""), i(!0);
              },
              children: [
                /* @__PURE__ */ d(xi, { className: "size-4 shrink-0" }),
                "删除"
              ]
            }
          )
        ]
      }
    ),
    am(R.current)
  ) : null;
  return /* @__PURE__ */ V(xe, { children: [
    /* @__PURE__ */ d("span", { ref: R, className: "flex shrink-0", children: /* @__PURE__ */ d(En, { label: "会话操作", children: /* @__PURE__ */ d(
      Je,
      {
        type: "button",
        variant: "ghost",
        size: "icon",
        className: rm(
          "size-7 shrink-0 text-muted-foreground transition-opacity hover:text-foreground",
          e ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
        ),
        "aria-label": `管理会话：${t.title}`,
        "aria-haspopup": "menu",
        "aria-expanded": w,
        onClick: T,
        children: /* @__PURE__ */ d(vi, { className: "size-4" })
      }
    ) }) }),
    $,
    /* @__PURE__ */ d(
      Hs,
      {
        open: n,
        onOpenChange: (k) => {
          m || r(k);
        },
        children: /* @__PURE__ */ V(
          js,
          {
            "data-assistant-layer": "true",
            layerZIndex: dt,
            showCloseButton: !m,
            className: "sm:max-w-md",
            children: [
              /* @__PURE__ */ V(Ys, { children: [
                /* @__PURE__ */ d(Qs, { children: "编辑标题" }),
                /* @__PURE__ */ d(Gs, { children: "修改左侧显示的会话标题。" })
              ] }),
              /* @__PURE__ */ V("form", { className: "space-y-4", onSubmit: I, children: [
                /* @__PURE__ */ d(
                  nm,
                  {
                    autoFocus: !0,
                    value: a,
                    maxLength: 255,
                    disabled: m,
                    "aria-label": "会话标题",
                    onChange: (k) => c(k.target.value)
                  }
                ),
                l ? /* @__PURE__ */ d("p", { className: "text-sm text-destructive", children: l }) : null,
                /* @__PURE__ */ V(Ws, { children: [
                  /* @__PURE__ */ d(
                    Je,
                    {
                      type: "button",
                      variant: "outline",
                      disabled: m,
                      onClick: () => r(!1),
                      children: "取消"
                    }
                  ),
                  /* @__PURE__ */ d(Je, { type: "submit", disabled: m || !a.trim(), children: m ? "保存中..." : "保存" })
                ] })
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ d(
      Hs,
      {
        open: o,
        onOpenChange: (k) => {
          h || i(k);
        },
        children: /* @__PURE__ */ V(
          js,
          {
            "data-assistant-layer": "true",
            layerZIndex: dt,
            showCloseButton: !h,
            className: "sm:max-w-md",
            children: [
              /* @__PURE__ */ V(Ys, { children: [
                /* @__PURE__ */ d(Qs, { children: "删除对话？" }),
                /* @__PURE__ */ V(Gs, { children: [
                  "删除后，“",
                  t.title,
                  "”将从历史会话中移除。"
                ] })
              ] }),
              l ? /* @__PURE__ */ d("p", { className: "text-sm text-destructive", children: l }) : null,
              /* @__PURE__ */ V(Ws, { children: [
                /* @__PURE__ */ d(
                  Je,
                  {
                    type: "button",
                    variant: "outline",
                    disabled: h,
                    onClick: () => i(!1),
                    children: "取消"
                  }
                ),
                /* @__PURE__ */ d(
                  Je,
                  {
                    type: "button",
                    variant: "destructive",
                    disabled: h,
                    onClick: () => {
                      _();
                    },
                    children: h ? "删除中..." : "删除"
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
function Xs(t, e) {
  return t instanceof Error && t.message.trim() ? t.message.trim() : e;
}
function im(t) {
  const e = t.getBoundingClientRect(), s = Math.max(
    Ze,
    window.innerWidth - Ut - Ze
  ), n = Math.min(
    s,
    Math.max(Ze, e.right - Ut)
  ), r = e.bottom + Zs;
  return { top: r + Js <= window.innerHeight - Ze ? r : Math.max(Ze, e.top - Js - Zs), left: n };
}
function am(t) {
  return t?.closest('[data-agent-chat-layer="true"]') || document.body;
}
const cm = Gt.Button, Ks = bt.cn;
function en({
  agentName: t,
  title: e,
  agentReady: s,
  controller: n,
  collapsed: r = !1,
  mobile: o = !1,
  onOpenSession: i,
  onStartNewSession: a
}) {
  return /* @__PURE__ */ V(
    "aside",
    {
      className: Ks(
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
        /* @__PURE__ */ d("div", { className: "agent-chat-sidebar-header shrink-0 border-b p-3", children: /* @__PURE__ */ V("div", { className: "agent-chat-sidebar-controls flex min-w-0 items-center gap-2", children: [
          /* @__PURE__ */ d("div", { className: "agent-chat-sidebar-name min-w-0 flex-1 truncate px-2 py-1 text-left text-sm font-semibold text-foreground", children: e ?? (t || "智能体") }),
          /* @__PURE__ */ V(
            cm,
            {
              type: "button",
              variant: "outline",
              className: "agent-chat-new-session h-10 shrink-0 justify-start gap-2 bg-background px-3",
              disabled: n.sessionLoading || !s,
              onClick: () => {
                a ? a() : n.startNewSession();
              },
              children: [
                /* @__PURE__ */ d("span", { className: "agent-chat-new-session-icon contents", children: /* @__PURE__ */ d(gn, { className: "size-4" }) }),
                /* @__PURE__ */ d("span", { children: "新对话" })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ V("div", { className: "agent-chat-session-section flex min-h-0 flex-1 flex-col", children: [
          /* @__PURE__ */ d("div", { className: "agent-chat-session-heading shrink-0 px-4 pb-2 pt-4 text-xs font-medium text-muted-foreground", children: "历史会话" }),
          /* @__PURE__ */ d(
            "div",
            {
              ref: n.sessionListRef,
              className: "agent-chat-session-list min-h-0 flex-1 overflow-y-auto px-2 pb-3",
              onScroll: (c) => n.handleSessionListScroll(c.currentTarget),
              children: n.sessionsLoading && n.sessions.length === 0 ? /* @__PURE__ */ d("div", { className: "flex h-24 items-center justify-center text-muted-foreground", children: /* @__PURE__ */ d(ut, { className: "size-4 animate-spin" }) }) : n.sessions.length === 0 ? /* @__PURE__ */ d("div", { className: "px-2 py-6 text-center text-xs leading-5 text-muted-foreground", children: "暂无历史会话" }) : /* @__PURE__ */ V("div", { className: "space-y-1", children: [
                n.sessions.map((c) => /* @__PURE__ */ V(
                  "div",
                  {
                    className: Ks(
                      "agent-chat-session-item group flex min-h-10 w-full items-center rounded-md px-1 transition-colors",
                      c.id === n.sessionID ? "bg-background font-medium text-foreground shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                    ),
                    children: [
                      /* @__PURE__ */ V(
                        "button",
                        {
                          type: "button",
                          className: "agent-chat-session-trigger flex min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left text-sm",
                          onClick: () => {
                            i ? i(c.id) : n.openSession(c.id);
                          },
                          children: [
                            c.running ? /* @__PURE__ */ d(ut, { className: "size-3.5 shrink-0 animate-spin" }) : /* @__PURE__ */ d(Ai, { className: "size-3.5 shrink-0" }),
                            /* @__PURE__ */ d("span", { className: "min-w-0 flex-1 truncate", children: c.title })
                          ]
                        }
                      ),
                      /* @__PURE__ */ d(
                        om,
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
                n.sessionsLoadingMore ? /* @__PURE__ */ d("div", { className: "flex h-10 items-center justify-center text-muted-foreground", children: /* @__PURE__ */ d(ut, { className: "size-4 animate-spin" }) }) : null
              ] })
            }
          )
        ] })
      ]
    }
  );
}
const lm = 32;
function um(t, e, s = lm) {
  let n = t, r = null, o = !0, i = 0;
  const a = () => {
    r != null && (clearTimeout(r), r = null);
  }, c = () => {
    a(), i = tn(), e(n);
  }, l = () => {
    if (r != null)
      return;
    const u = tn() - i, m = Math.max(0, s - u);
    r = setTimeout(c, m);
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
function tn() {
  return typeof performance > "u" ? Date.now() : performance.now();
}
const dm = yt.runRuntimeStream, mm = yt.stopRuntimeStream, hm = yt.watchRuntimeStream, Et = jt.runtimeErrorMessage, sn = fn.streamValueText;
function pm({
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
  getSessionMessages: m,
  updateSessionMessages: p,
  updateSessionTitle: h,
  syncSessionTitle: g,
  setSessionRunning: w,
  setError: x
}) {
  const [C, D] = X({}), R = ee(/* @__PURE__ */ new Map()), v = L(
    (f) => {
      f.detached || (D((E) => ({
        ...E,
        [f.sessionID]: {
          requestID: f.requestID,
          cancelable: f.cancelable,
          stopping: f.stopping
        }
      })), w(f.sessionID, !0));
    },
    [w]
  ), b = L(
    (f) => {
      const E = R.current.get(f.sessionID);
      return E && E !== f ? !1 : (R.current.set(f.sessionID, f), v(f), !0);
    },
    [v]
  ), I = L(
    (f) => {
      R.current.get(f.sessionID) === f && (f.buffer.dispose(), R.current.delete(f.sessionID), D((E) => {
        const A = { ...E };
        return delete A[f.sessionID], A;
      }), w(f.sessionID, !1));
    },
    [w]
  ), _ = L(
    (f, E) => {
      f.detached || p(
        f.sessionID,
        (A) => A.map(
          (O) => zt(O, f) ? {
            ...O,
            ...typeof E == "function" ? E(O) : E
          } : O
        )
      );
    },
    [p]
  ), T = L(
    (f, E) => {
      R.current.get(f.sessionID) === f && (f.buffer.flush(), _(f, (A) => {
        const O = Sn(E.output), q = No(
          E.output?.document
        ), j = {
          text: E.text,
          requestID: E.requestID || f.requestID || void 0,
          running: !1,
          error: !!E.error,
          activities: Oo(
            A.activities,
            O
          )
        };
        return Bo(E.output) && (j.output = E.output), j.document = xt(
          A.document,
          q
        ), q && A.document?.id !== q.id && (j.autoOpenDocument = !0), j;
      }), I(f), f.kind !== "opening" && g(f.sessionID));
    },
    [I, g, _]
  ), $ = L(
    (f, E) => {
      if (f.detached || R.current.get(f.sessionID) !== f)
        return !1;
      const A = Lo(E);
      if (A.requestID && !f.requestID && (f.requestID = A.requestID), A.streamID && (f.lastStreamID = A.streamID), A.runVersion > 0) {
        if (f.runVersion > A.runVersion)
          return !0;
        f.runVersion = A.runVersion;
      }
      A.assistantMessageID > 0 && _(f, { recordID: A.assistantMessageID }), A.cancelable != null && A.cancelable !== f.cancelable && (f.cancelable = A.cancelable, v(f)), fm(A.event, A.output) && _(f, (q) => {
        const j = Cn(
          q.document,
          A.output
        );
        return {
          document: j,
          autoOpenDocument: q.autoOpenDocument || A.event === "document_start" && !!j && q.document?.id !== j?.id,
          requestID: A.requestID || f.requestID || void 0,
          running: !0
        };
      }), A.event === "reset" && (f.replayPending = !1, f.buffer.reset(sn(A.output.text)), f.buffer.flush()), A.delta && (f.replayPending && (f.replayPending = !1, f.buffer.reset()), f.buffer.append(A.delta));
      const O = A.activity;
      if (O) {
        f.buffer.flush();
        const q = O.anchorText ? O : { ...O, anchorText: f.buffer.text };
        _(f, (j) => ({
          activities: Fo(
            j.activities,
            q
          ),
          requestID: A.requestID || f.requestID || void 0,
          running: !0
        }));
      }
      return f.kind === "opening" && A.finished && A.event === "opening_skipped" ? (p(
        f.sessionID,
        (q) => q.filter((j) => !zt(j, f))
      ), I(f), !1) : A.finished ? (T(f, {
        text: nn({
          text: A.finalText,
          streamedText: f.buffer.text,
          error: A.error,
          failed: A.failed
        }),
        error: A.failed,
        requestID: A.requestID,
        output: A.output
      }), !1) : !0;
    },
    [T, v, I, _, p]
  ), k = L(
    (f) => {
      let E;
      const A = um(f.text || "", (O) => {
        _(E, {
          text: O,
          requestID: E.requestID || void 0,
          running: !0,
          error: !1
        });
      });
      return E = {
        kind: f.kind || "chat",
        sessionID: f.sessionID,
        requestID: f.requestID || "",
        userMessageID: f.userMessageID,
        assistantMessageID: f.assistantMessageID,
        createdAt: f.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        input: f.prompt || "",
        content: f.content,
        buffer: A,
        lastStreamID: "0-0",
        cancelable: !1,
        stopping: !1,
        stopped: !1,
        detached: !1,
        replayPending: !!f.replayPending,
        runVersion: 0,
        controller: new AbortController()
      }, E;
    },
    [_]
  ), z = L(
    (f, E) => {
      if (!Vo(E.status))
        return !1;
      const A = E.status === "fail", O = E.status === "canceled", q = nn({
        text: E.text,
        streamedText: f.buffer.text,
        error: E.error,
        failed: A,
        canceled: O
      });
      return T(f, {
        text: q,
        error: A,
        requestID: E.requestID,
        output: E.output
      }), A && l() === f.sessionID && x(E.error.trim() || q), !0;
    },
    [T, l, x]
  ), B = L(
    async (f, E) => {
      const A = E.requestID || "";
      if (!A || !f || R.current.has(f))
        return;
      const O = k({
        kind: E.kind === "opening" ? "opening" : "chat",
        sessionID: f,
        requestID: A,
        userMessageID: "",
        assistantMessageID: E.id,
        createdAt: E.createdAt,
        text: E.text,
        replayPending: !!E.text
      });
      if (!b(O)) {
        O.buffer.dispose();
        return;
      }
      try {
        const q = await vs(
          a.status,
          A
        );
        if (O.detached || R.current.get(f) !== O || (O.runVersion = Math.max(O.runVersion, q.runVersion), z(O, q)) || (await hm({
          streamApi: a.stream,
          requestID: A,
          lastID: O.lastStreamID,
          blockMs: i,
          signal: O.controller.signal,
          // applyFrame only returns false for the current run version. Old
          // terminal frames from an interrupted attempt must not stop replay.
          stopOnResult: !1,
          recoverOnError: !0,
          fallbackToPoll: !1,
          onFrame: (oe) => $(O, oe) ? void 0 : !1
        }), O.detached || O.controller.signal.aborted || R.current.get(f) !== O))
          return;
        const j = await vs(
          a.status,
          A
        );
        z(O, j);
      } catch (q) {
        if (O.detached || O.controller.signal.aborted || R.current.get(f) !== O)
          return;
        const j = Et(
          q,
          "恢复智能体运行失败。"
        );
        T(O, {
          text: O.buffer.text.trim() || j,
          error: !0,
          requestID: A
        }), l() === f && x(j);
      }
    },
    [
      $,
      i,
      k,
      T,
      z,
      l,
      b,
      a.status,
      a.stream,
      x
    ]
  );
  ie(() => {
    if (!s || n || !r)
      return;
    const f = o.find(
      (E) => E.role === "assistant" && E.running && !!E.requestID
    );
    f && B(r, f);
  }, [o, s, B, r, n]);
  const U = L(
    async (f, E, A) => {
      x("");
      try {
        const O = await dm({
          requestApi: E,
          streamApi: a.stream,
          stopApi: a.stop,
          stopOnAbort: !1,
          fallbackToPoll: !1,
          blockMs: i,
          signal: f.controller.signal,
          body: A,
          onRequestID: (oe) => {
            f.detached || (f.requestID = oe, v(f), _(f, { requestID: oe }));
          },
          onFrame: (oe) => {
            $(f, oe);
          }
        });
        if (f.detached || f.stopped || R.current.get(f.sessionID) !== f)
          return;
        const q = qo(O.finalOutput), j = sn(
          O.finalOutput?.text || O.textOutput || f.buffer.text
        ).trim();
        T(f, {
          text: j,
          output: q,
          requestID: O.requestID
        });
      } catch (O) {
        if (f.detached || f.stopped || R.current.get(f.sessionID) !== f)
          return;
        const q = Et(
          O,
          f.kind === "opening" ? "智能体开场失败。" : "智能体运行失败。"
        );
        T(f, {
          text: f.buffer.text.trim() || q,
          error: !0,
          requestID: f.requestID
        }), l() === f.sessionID && x(q);
      }
    },
    [
      $,
      i,
      T,
      l,
      v,
      a.stop,
      a.stream,
      x,
      _
    ]
  ), W = L(
    async (f) => {
      const E = f.text.trim(), A = l();
      if (!E || !t || !A || R.current.has(A))
        return;
      const O = Date.now(), q = new Date(O).toISOString(), j = {
        id: `${A}-user-${O}`,
        role: "user",
        text: E,
        createdAt: q,
        content: f.content
      }, oe = `${A}-assistant-${O}`, ne = k({
        sessionID: A,
        userMessageID: j.id,
        assistantMessageID: oe,
        createdAt: q,
        prompt: E,
        content: f.content
      });
      if (!b(ne)) {
        ne.buffer.dispose();
        return;
      }
      h(
        A,
        vm(u(A), E)
      ), p(A, (Ce) => [
        ...Ce,
        j,
        {
          id: oe,
          role: "assistant",
          text: "",
          createdAt: q,
          running: !0
        }
      ]), await U(ne, a.request, {
        ...c,
        agent: t,
        session_id: A,
        context_key: e,
        input: {
          text: E,
          content: f.content,
          params: f.params
        }
      });
    },
    [
      t,
      e,
      k,
      U,
      l,
      u,
      b,
      c,
      a.request,
      p,
      h
    ]
  ), J = L(
    async (f) => {
      const E = a.opening?.trim() || "";
      if (!E || !t || !f || R.current.has(f))
        return;
      const A = Date.now(), O = new Date(A).toISOString(), q = m(f).find(
        (ne) => ne.role === "assistant" && ne.kind === "opening" && !!ne.requestID
      ), j = q?.id || `${f}-opening-${A}`, oe = k({
        kind: "opening",
        sessionID: f,
        requestID: q?.requestID,
        userMessageID: "",
        assistantMessageID: j,
        createdAt: q?.createdAt || O,
        text: q?.text,
        replayPending: !!(q?.running && q.text)
      });
      if (!b(oe)) {
        oe.buffer.dispose();
        return;
      }
      q || p(f, (ne) => [
        ...ne,
        {
          id: j,
          role: "assistant",
          kind: "opening",
          text: "",
          createdAt: O,
          running: !0
        }
      ]), await U(oe, E, {
        ...c,
        agent: t,
        session_id: f,
        context_key: e
      });
    },
    [
      t,
      e,
      k,
      U,
      m,
      b,
      c,
      a.opening,
      p
    ]
  ), Y = L(async () => {
    const f = l(), E = R.current.get(f);
    if (!(!E?.requestID || !E.cancelable || E.stopping)) {
      E.stopping = !0, v(E), x("");
      try {
        if (await mm(E.requestID, a.stop), R.current.get(f) !== E)
          return;
        E.stopped = !0, E.controller.abort(), T(E, {
          text: E.buffer.text.trim() || "已停止生成",
          requestID: E.requestID
        });
      } catch (A) {
        if (R.current.get(f) !== E)
          return;
        E.stopping = !1, v(E), l() === f && x(Et(A, "停止生成失败。"));
      }
    }
  }, [T, l, v, a.stop, x]), se = L(
    (f) => R.current.has(f),
    []
  ), G = L(
    (f, E) => gm(E, R.current.get(f)),
    []
  ), re = L(() => {
    for (const f of R.current.values())
      f.detached = !0, f.buffer.dispose(), f.controller.abort(), w(f.sessionID, !1);
    R.current.clear(), D({});
  }, [w]);
  ie(() => () => {
    for (const f of R.current.values())
      f.detached = !0, f.buffer.dispose(), f.controller.abort();
    R.current.clear();
  }, []);
  const K = C[r];
  return {
    running: !!(K || o.some(
      (f) => f.role === "assistant" && f.running
    )),
    stopping: !!K?.stopping,
    cancelable: !!K?.cancelable,
    hasRun: se,
    mergeMessages: G,
    reset: re,
    send: W,
    startOpening: J,
    stop: Y
  };
}
function zt(t, e) {
  return t.id === e.assistantMessageID || !!(e.requestID && t.requestID === e.requestID);
}
function fm(t, e) {
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
function gm(t, e) {
  if (!e)
    return t;
  let s = !1;
  const n = t.map((r) => zt(r, e) ? (s = !0, {
    ...r,
    requestID: e.requestID || r.requestID,
    text: e.buffer.text || r.text,
    running: !0,
    error: !1
  }) : r);
  return s ? n : [
    ...n,
    ...e.input ? [
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
function vm(t, e) {
  return t.trim() && t.trim() !== "新会话" ? t : Array.from(e.trim().replace(/\s+/g, " ")).slice(0, 40).join("") || "新会话";
}
function nn(t) {
  const e = t.text?.trim() || t.streamedText?.trim() || "";
  return e || (t.canceled ? "已停止生成" : t.failed ? t.error?.trim() || "智能体运行失败。" : "");
}
const bm = yt.watchRuntimeStream, xm = jt.normalizeRuntimeFrameOutput;
function ym({
  modalOpen: t,
  sessionID: e,
  messages: s,
  blockMs: n,
  runtimeApi: r,
  updateDocument: o
}) {
  const i = ee(/* @__PURE__ */ new Map());
  ie(() => {
    const a = i.current;
    if (!t || !e) {
      rn(a);
      return;
    }
    const c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
    for (const u of s)
      u.document && (c.set(u.document.id, u.document), Uo(u.document) && l.set(u.document.id, u.document));
    for (const [u, m] of a) {
      const p = c.get(u);
      if (!p || m.sessionID !== e) {
        m.controller.abort(), a.delete(u);
        continue;
      }
      m.document = xt(m.document, p) || p;
    }
    for (const u of l.values()) {
      if (a.has(u.id))
        continue;
      const m = {
        sessionID: e,
        controller: new AbortController(),
        document: u
      };
      a.set(u.id, m), _m({
        watch: m,
        watches: a,
        blockMs: n,
        runtimeApi: r,
        updateDocument: o
      });
    }
  }, [n, s, t, r, e, o]), ie(() => {
    const a = i.current;
    return () => rn(a);
  }, []);
}
async function _m(t) {
  const { watch: e, watches: s, blockMs: n, runtimeApi: r, updateDocument: o } = t, i = e.document.id;
  let a = null, c = 0, l = 0;
  const u = (h) => {
    !h || e.controller.signal.aborted || (e.document = h, o(e.sessionID, i, h));
  }, m = async () => {
    const h = await zo(
      r.document,
      i
    );
    return u(xt(e.document, h)), h;
  }, p = () => {
    if (a || e.controller.signal.aborted)
      return;
    const h = new AbortController(), g = () => h.abort();
    a = h, c = Date.now(), e.controller.signal.addEventListener("abort", g, { once: !0 }), bm({
      streamApi: r.documentStream,
      requestID: `document:${i}`,
      blockMs: n,
      signal: h.signal,
      stopOnResult: !1,
      recoverOnError: !0,
      fallbackToPoll: !1,
      onFrame: (w) => {
        c = Date.now();
        const x = Im(w);
        u(Cn(e.document, x)), Sm(x) === "document_complete" && m().catch(() => {
        });
      }
    }).catch(() => {
    }).finally(() => {
      e.controller.signal.removeEventListener("abort", g), a === h && (a = null);
    });
  };
  try {
    p();
    try {
      const h = await m();
      if (!gt(h))
        return;
    } catch {
      if (e.controller.signal.aborted)
        return;
      l = 1;
    }
    for (; !e.controller.signal.aborted; ) {
      if (await Tm(
        e.controller.signal,
        wm(l)
      ), e.controller.signal.aborted)
        return;
      if (!(a !== null && Date.now() - c < Math.max(6e3, n * 3)))
        try {
          const g = await m();
          if (!gt(g))
            return;
          l = Math.min(l + 1, 3), p();
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
function wm(t) {
  const e = [2e3, 4e3, 8e3, 12e3];
  return e[Math.min(t, e.length - 1)] ?? e[e.length - 1];
}
function Tm(t, e) {
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
function Im(t) {
  return xm(t.output, t);
}
function Sm(t) {
  return String(t.event || t.semantic_event || "").trim().toLowerCase();
}
function rn(t) {
  for (const e of t.values())
    e.controller.abort();
  t.clear();
}
const at = [800, 1500, 3e3, 5e3, 8e3];
function Cm({
  modalOpen: t,
  sessionID: e,
  messages: s,
  refreshSession: n
}) {
  const r = Em(s);
  ie(() => {
    if (!t || !e || !r)
      return;
    const o = new AbortController();
    return Rm(e, o.signal, n), () => o.abort();
  }, [t, r, n, e]);
}
async function Rm(t, e, s) {
  let n = 0;
  for (; !e.aborted; ) {
    const r = at[Math.min(n, at.length - 1)] ?? at[at.length - 1];
    if (await Mm(e, r), e.aborted)
      return;
    try {
      await s(t);
    } catch {
    }
    n += 1;
  }
}
function Em(t) {
  return t.filter((e) => !e.document).flatMap(
    (e) => Rn(e.output).filter((s) => s.status === "generating").map((s) => s.id)
  ).sort((e, s) => e - s).join(":");
}
function Mm(t, e) {
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
function on(t, e, s) {
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
function Am(t, e) {
  const s = new Set(t.map((n) => n.id));
  return [
    ...t,
    ...e.filter((n) => !s.has(n.id))
  ];
}
function Pm(t, e) {
  const s = new Set(
    t.map((r) => r.recordID).filter((r) => !!r)
  );
  return [...e.filter(
    (r) => !r.recordID || !s.has(r.recordID)
  ), ...t];
}
function an(t, e) {
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
function Mt(t) {
  return t.map((e, s) => ({
    id: e.id ? `saved-${e.id}` : `saved-${s}`,
    recordID: e.id || void 0,
    role: e.role,
    kind: e.kind,
    text: e.text,
    createdAt: e.createdAt,
    content: e.content,
    output: e.output,
    activities: Sn(e.output),
    requestID: e.requestID || void 0,
    running: e.status === 3,
    error: e.status === 2,
    document: e.document
  }));
}
const Me = jt.runtimeErrorMessage, cn = 20, ct = 20, ln = 10, At = 48, km = [500, 1e3, 2e3, 4e3, 8e3, 8e3];
function Dm({
  agentKey: t,
  contextKey: e,
  modalOpen: s,
  blockMs: n,
  lazySession: r = !1,
  proactiveOpening: o = !1,
  assistantApi: i,
  runtimeApi: a,
  requestScope: c
}) {
  const l = e?.trim() || (t ? `agent-runtime:${t}` : ""), [u, m] = X([]), [p, h] = X(0), [g, w] = X("新会话"), [x, C] = X([]), [D, R] = X(!1), [v, b] = X(!1), [I, _] = X(!1), [T, $] = X(""), [k, z] = X([]), B = ee(0), U = ee(/* @__PURE__ */ new Map()), W = ee(
    /* @__PURE__ */ new Map()
  ), J = ee(""), Y = ee(0), se = ee(0), G = ee(0), re = ee(!1), K = ee(!1), f = ee(!1), E = ee(0), A = ee(null), O = ee(null), q = L(
    (S, N) => {
      B.current = S, h(S), w(N.title), C(N.messages), E.current = 0;
    },
    []
  ), j = L(
    (S, N) => {
      U.current.set(S, N), B.current === S && (w(N.title), C(N.messages));
    },
    []
  ), oe = L(() => B.current, []), ne = L((S) => U.current.get(S)?.title || "新会话", []), Ce = L((S) => U.current.get(S)?.messages || [], []), we = L(
    (S, N) => {
      const P = U.current.get(S);
      P && j(S, {
        ...P,
        messages: N(P.messages)
      });
    },
    [j]
  ), st = L(
    (S, N, P) => {
      we(
        S,
        (F) => F.map(
          (H) => H.document?.id === N || P.messageID > 0 && H.recordID === P.messageID ? {
            ...H,
            document: xt(H.document, P) || P
          } : H
        )
      );
    },
    [we]
  ), je = L(
    (S, N) => {
      const P = U.current.get(S);
      P && j(S, { ...P, title: N }), m(
        (F) => F.map(
          (H) => H.id === S ? { ...H, title: N } : H
        )
      );
    },
    [j]
  ), jr = L(
    async (S) => {
      const N = `${t}:${l}`;
      for (const P of km) {
        if (await $m(P), J.current !== N)
          return;
        try {
          const F = await Ho(i, {
            agentKey: t,
            contextKey: l,
            sessionID: S
          });
          if (!F)
            return;
          if (F.titleSource === "llm" || F.titleSource === "manual") {
            je(S, F.title);
            return;
          }
        } catch {
        }
      }
    },
    [t, i, l, je]
  ), Gr = L(
    (S, N) => {
      m((P) => {
        const F = P.find(
          (H) => H.id === S
        );
        return F ? on(P, { ...F, running: N }, N) : P;
      });
    },
    []
  ), Wr = L(
    (S) => jo(
      {
        api: i,
        agentKey: t,
        contextKey: l,
        sessionID: B.current
      },
      S
    ),
    [t, i, l]
  ), Yr = L(
    (S) => {
      const N = B.current;
      if (!N || !t)
        return Promise.reject(new Error("当前会话不可用"));
      const P = `${N}:${S.refType}:${S.refId}`, F = W.current.get(P);
      if (F)
        return F;
      const H = Go(
        a.referencePreview,
        { agentKey: t, sessionID: N },
        S
      );
      return W.current.set(P, H), H.catch(() => {
        W.current.get(P) === H && W.current.delete(P);
      }), H;
    },
    [t, a.referencePreview]
  ), Z = pm({
    agentKey: t,
    contextKey: l,
    modalOpen: s,
    sessionLoading: I,
    sessionID: p,
    messages: x,
    blockMs: n,
    runtimeApi: a,
    requestScope: c,
    getActiveSessionID: oe,
    getSessionTitle: ne,
    getSessionMessages: Ce,
    updateSessionMessages: we,
    updateSessionTitle: je,
    syncSessionTitle: jr,
    setSessionRunning: Gr,
    setError: $
  });
  ym({
    modalOpen: s,
    sessionID: p,
    messages: x,
    blockMs: n,
    runtimeApi: a,
    updateDocument: st
  });
  const Qr = L(
    async (S) => {
      if (!t || !l || B.current !== S)
        return;
      const N = await Ye(i, {
        agentKey: t,
        contextKey: l,
        sessionID: S,
        limit: ct
      });
      if (B.current !== S)
        return;
      const P = Z.mergeMessages(
        S,
        Mt(N.messages)
      );
      we(
        S,
        (F) => an(F, P)
      );
    },
    [
      t,
      i,
      l,
      Z.mergeMessages,
      we
    ]
  );
  Cm({
    modalOpen: s,
    sessionID: p,
    messages: x,
    refreshSession: Qr
  });
  const Be = L(
    (S, N = !1) => {
      const P = S.session?.id || 0;
      if (!P)
        return;
      const F = Z.mergeMessages(
        P,
        Mt(S.messages)
      ), H = U.current.get(P), ue = H ? an(H.messages, F) : F, he = {
        title: S.session?.title || "新会话",
        messages: ue,
        oldestMessageID: H?.oldestMessageID || S.messages[0]?.id || 0,
        canLoadOlder: H?.canLoadOlder ?? S.messages.length > 0
      };
      if (U.current.set(P, he), q(P, he), S.session) {
        const Re = {
          ...S.session,
          running: Z.hasRun(P) || ue.some((Te) => Te.running)
        };
        m(
          (Te) => on(Te, Re, N)
        );
      }
    },
    [Z.hasRun, Z.mergeMessages, q]
  ), ms = L(async () => {
    if (!t || !l)
      return;
    const S = ++Y.current, N = ++se.current;
    K.current = !0, R(!0), b(!1), B.current || _(!0), $("");
    try {
      const P = await bs(i, {
        agentKey: t,
        contextKey: l,
        limit: cn
      });
      if (Y.current !== S || se.current !== N)
        return;
      m(
        P.sessions.map((he) => ({
          ...he,
          running: !!he.running || Z.hasRun(he.id)
        }))
      ), G.current = P.sessions[P.sessions.length - 1]?.id || 0, re.current = P.hasMore, R(!1);
      const F = P.sessions[0], H = F ? U.current.get(F.id) : void 0;
      if (F && H && (q(F.id, H), _(!1)), !F && r && !o) {
        B.current = 0, h(0), w("新会话"), C([]);
        return;
      }
      const ue = await Ye(i, {
        agentKey: t,
        contextKey: l,
        sessionID: F?.id,
        create: !F && !o,
        title: "新会话",
        limit: ct
      });
      Y.current === S && (Be(ue, !F), !F && o && ue.session?.id && Z.startOpening(ue.session.id));
    } catch (P) {
      Y.current === S && se.current === N && $(Me(P, "加载会话失败。"));
    } finally {
      Y.current === S && se.current === N && (K.current = !1, R(!1), _(!1));
    }
  }, [
    t,
    Be,
    i,
    l,
    r,
    o,
    Z.hasRun,
    Z.startOpening,
    q
  ]), Ge = L(
    async (S, N = !1) => {
      if (!t || !l)
        return;
      const P = ++Y.current;
      f.current = !1;
      const F = N ? void 0 : U.current.get(S);
      F ? (q(S, F), _(!1)) : (N && (B.current = 0, h(0), w("新会话"), C([])), _(!0)), $("");
      try {
        const H = await Ye(i, {
          agentKey: t,
          contextKey: l,
          sessionID: S || void 0,
          create: N,
          title: "新会话",
          limit: N ? ct : ln
        });
        Y.current === P && (Be(H, N), N && o && H.session?.id && Z.startOpening(H.session.id));
      } catch (H) {
        Y.current === P && $(Me(H, "加载会话失败。"));
      } finally {
        Y.current === P && _(!1);
      }
    },
    [
      t,
      Be,
      i,
      l,
      o,
      Z.startOpening,
      q
    ]
  ), hs = L(() => {
    Y.current += 1, f.current = !1, B.current = 0, h(0), w("新会话"), C([]), _(!1), $("");
  }, []), wt = L(
    async () => {
      if (r && !o) {
        hs();
        return;
      }
      await Ge(0, !0);
    },
    [r, hs, Ge, o]
  ), Jr = L(
    async (S, N) => {
      try {
        const P = await Wo(
          i,
          S,
          N
        );
        je(S, P.title), $("");
      } catch (P) {
        const F = Me(P, "编辑标题失败。");
        throw $(F), new Error(F);
      }
    },
    [i, je]
  ), Zr = L(
    async (S) => {
      if (Z.hasRun(S))
        throw new Error("当前会话正在生成，暂时不能删除。");
      const N = u.findIndex(
        (F) => F.id === S
      ), P = u.filter(
        (F) => F.id !== S
      );
      try {
        if (await Yo(i, S), U.current.delete(S), m(P), $(""), B.current !== S)
          return;
        const F = Math.min(
          Math.max(0, N),
          Math.max(0, P.length - 1)
        ), H = P[F];
        H ? await Ge(H.id, !1) : await wt();
      } catch (F) {
        const H = Me(F, "删除会话失败。");
        throw $(H), new Error(H);
      }
    },
    [i, Ge, Z.hasRun, u, wt]
  ), Tt = L(async () => {
    if (!t || !l || !re.current || K.current)
      return;
    const S = se.current, N = G.current;
    K.current = !0, b(!0);
    try {
      const P = await bs(i, {
        agentKey: t,
        contextKey: l,
        limit: cn,
        lastSessionID: G.current
      });
      if (se.current !== S)
        return;
      if (P.sessions.length === 0) {
        re.current = !1;
        return;
      }
      const F = P.sessions[P.sessions.length - 1]?.id || 0;
      m(
        (H) => Am(
          H,
          P.sessions.map((ue) => ({
            ...ue,
            running: !!ue.running || Z.hasRun(ue.id)
          }))
        )
      ), G.current = F, re.current = P.hasMore && F > 0 && F !== N;
    } catch (P) {
      se.current === S && $(Me(P, "加载更多会话失败。"));
    } finally {
      se.current === S && (K.current = !1, b(!1));
    }
  }, [t, i, l, Z.hasRun]), We = L(async () => {
    const S = B.current, N = U.current.get(S);
    if (!S || !N?.canLoadOlder || !N.oldestMessageID || !t || !l || f.current)
      return;
    const P = O.current, F = P?.scrollHeight || 0, H = P?.scrollTop || 0, ue = Y.current;
    f.current = !0;
    try {
      const he = await Ye(i, {
        agentKey: t,
        contextKey: l,
        sessionID: S,
        limit: ln,
        lastMessageID: N.oldestMessageID
      });
      if (Y.current !== ue || B.current !== S)
        return;
      const Re = U.current.get(S);
      if (!Re)
        return;
      if (he.messages.length === 0) {
        j(S, {
          ...Re,
          canLoadOlder: !1
        });
        return;
      }
      j(S, {
        ...Re,
        messages: Pm(
          Re.messages,
          Mt(he.messages)
        ),
        oldestMessageID: he.messages[0]?.id || Re.oldestMessageID,
        canLoadOlder: !0
      }), window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const Te = O.current;
          !Te || B.current !== S || (Te.scrollTop = H + Te.scrollHeight - F, E.current = Te.scrollTop);
        });
      });
    } catch (he) {
      Y.current === ue && B.current === S && $(Me(he, "加载历史消息失败。"));
    } finally {
      Y.current === ue && B.current === S && (f.current = !1);
    }
  }, [t, i, l, j]), Xr = L((S) => {
    const N = S || A.current;
    N && N.scrollHeight - N.scrollTop - N.clientHeight <= At && Tt();
  }, [Tt]), Kr = L(() => {
    const S = O.current;
    if (!S)
      return;
    const N = E.current, P = S.scrollTop;
    E.current = P, P < N && P <= At && We();
  }, [We]), eo = L(
    (S) => {
      S.deltaY < 0 && S.currentTarget.scrollTop <= At && We();
    },
    [We]
  );
  ie(() => {
    if (!s || !t)
      return;
    const S = `${t}:${l}`;
    return J.current !== S && (J.current = S, Z.reset(), U.current.clear(), W.current.clear(), m([]), B.current = 0, h(0), w("新会话"), C([]), G.current = 0, re.current = !1, E.current = 0), ms(), () => {
      Y.current += 1, se.current += 1, K.current = !1, f.current = !1;
    };
  }, [t, l, ms, s, Z.reset]), ie(() => {
    if (!s || !t) {
      z([]);
      return;
    }
    z([]);
    let S = !0;
    return Qo(a.inputConfig, t).then((N) => {
      S && z(N);
    }).catch(() => {
      S && z([]);
    }), () => {
      S = !1;
    };
  }, [t, s, a.inputConfig]);
  const to = L(
    async (S) => {
      if (!(!S.text.trim() || !t)) {
        if (!B.current && r) {
          _(!0), $("");
          try {
            const N = await Ye(i, {
              agentKey: t,
              contextKey: l,
              create: !0,
              title: "新会话",
              limit: ct
            });
            Be(N, !0);
          } catch (N) {
            $(Me(N, "创建会话失败。"));
            return;
          } finally {
            _(!1);
          }
        }
        await Z.send(S);
      }
    },
    [
      t,
      Be,
      i,
      l,
      r,
      Z.send
    ]
  );
  return {
    sessionID: p,
    sessionTitle: g,
    sessions: u,
    messages: x,
    sessionsLoading: D,
    sessionsLoadingMore: v,
    sessionLoading: I,
    running: Z.running,
    stopping: Z.stopping,
    cancelable: Z.cancelable,
    sendDisabled: !t || !p && !r || I || Z.running,
    error: T,
    inputParams: k,
    sessionListRef: A,
    messageListRef: O,
    openSession: (S) => Ge(S, !1),
    startNewSession: wt,
    renameSession: Jr,
    deleteSession: Zr,
    loadMoreSessions: Tt,
    loadOlderMessages: We,
    handleSessionListScroll: Xr,
    handleMessageListScroll: Kr,
    handleMessageListWheel: eo,
    loadReferences: Wr,
    loadReferencePreview: Yr,
    send: to,
    stop: Z.stop
  };
}
function $m(t) {
  return new Promise((e) => window.setTimeout(e, t));
}
const Ke = 10;
function Nm({
  controller: t
}) {
  const e = ht(
    () => t.messages.filter(Om),
    [t.messages]
  ), s = JSON.stringify(
    e.map((h) => h.id)
  ), [n, r] = X(""), [o, i] = X(0), a = ee(null);
  ie(() => {
    const h = t.messageListRef.current, g = JSON.parse(s);
    if (!h || g.length === 0) {
      r("");
      return;
    }
    let w = 0;
    const x = () => {
      w = 0;
      const D = Bm(h, g);
      r(
        (R) => R === D ? R : D
      );
    }, C = () => {
      w || (w = window.requestAnimationFrame(x));
    };
    return h.addEventListener("scroll", C, { passive: !0 }), window.addEventListener("resize", C), C(), () => {
      h.removeEventListener("scroll", C), window.removeEventListener("resize", C), w && window.cancelAnimationFrame(w);
    };
  }, [t.messageListRef, s]), ie(() => {
    const h = JSON.parse(s), g = h.indexOf(n);
    i((w) => g < 0 ? Ht(w, h.length) : Fm(g, h.length));
  }, [n, s]), ie(() => {
    a.current && n && Vm(a.current, n);
  }, [n, s]);
  const c = L(
    (h) => {
      const g = t.messageListRef.current, w = g ? Lm(g, h) : null;
      if (!g || !w)
        return;
      const x = g.getBoundingClientRect(), C = w.getBoundingClientRect();
      r(h), g.scrollTo({
        top: Math.max(
          0,
          g.scrollTop + C.top - x.top - 24
        ),
        behavior: "smooth"
      });
    },
    [t.messageListRef]
  ), l = L(
    (h) => {
      i(
        (g) => Ht(
          g + h * Ke,
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
    o + Ke
  ), m = o > 0, p = o + Ke < e.length;
  return /* @__PURE__ */ V("nav", { className: "agent-chat-message-navigator", "aria-label": "用户消息快速跳转", children: [
    /* @__PURE__ */ d("style", { children: qm }),
    /* @__PURE__ */ V("div", { className: "agent-chat-message-navigator-controls", children: [
      /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          className: "agent-chat-message-navigator-page",
          title: "显示上一组消息",
          "aria-label": "显示上一组用户消息",
          disabled: !m,
          onClick: () => l(-1),
          children: /* @__PURE__ */ d(Jo, {})
        }
      ),
      /* @__PURE__ */ d("div", { className: "agent-chat-message-navigator-rail", children: u.map((h, g) => /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          className: "agent-chat-message-navigator-mark",
          "data-active": h.id === n ? "true" : void 0,
          title: `跳转到：${un(h.text)}`,
          "aria-label": `跳转到第 ${o + g + 1} 条用户消息`,
          "aria-current": h.id === n ? "location" : void 0,
          onClick: () => c(h.id)
        },
        h.id
      )) }),
      /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          className: "agent-chat-message-navigator-page",
          title: "显示下一组消息",
          "aria-label": "显示下一组用户消息",
          disabled: !p,
          onClick: () => l(1),
          children: /* @__PURE__ */ d(Ei, {})
        }
      )
    ] }),
    /* @__PURE__ */ d("div", { ref: a, className: "agent-chat-message-navigator-panel", children: u.map((h) => /* @__PURE__ */ d(
      "button",
      {
        type: "button",
        className: "agent-chat-message-navigator-item",
        "data-navigator-message-id": h.id,
        "data-active": h.id === n ? "true" : void 0,
        onClick: () => c(h.id),
        children: un(h.text)
      },
      h.id
    )) })
  ] });
}
function Om(t) {
  return t.role === "user";
}
function Bm(t, e) {
  const s = t.getBoundingClientRect(), n = s.top + Math.min(s.height * 0.28, 220), r = Ur(t);
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
function Lm(t, e) {
  return Ur(t).get(e);
}
function Ur(t) {
  return new Map(
    Array.from(
      t.querySelectorAll("[data-message-id]")
    ).map((e) => [e.dataset.messageId || "", e])
  );
}
function un(t) {
  const e = String(t || "").replace(/\s+/g, " ").trim();
  if (!e)
    return "空消息";
  const s = Array.from(e);
  return s.length > 46 ? `${s.slice(0, 46).join("")}...` : e;
}
function Fm(t, e) {
  return Ht(
    t - Math.floor(Ke / 2),
    e
  );
}
function Ht(t, e) {
  return Math.min(
    Math.max(0, e - Ke),
    Math.max(0, t)
  );
}
function Vm(t, e) {
  const s = Array.from(
    t.querySelectorAll("[data-navigator-message-id]")
  ).find((a) => a.dataset.navigatorMessageId === e);
  if (!s)
    return;
  const n = s.offsetTop, r = n + s.offsetHeight, o = t.scrollTop + 8, i = t.scrollTop + t.clientHeight - 8;
  n < o ? t.scrollTop = Math.max(0, n - 8) : r > i && (t.scrollTop = r - t.clientHeight + 8);
}
const qm = `
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
`, ds = bt.cn, zr = oo(
  "@/components/reference-composer"
), Um = zr.ReferenceComposer, zm = zr.ReferenceContentView, dn = "agent-chat-column";
function Hm({
  controller: t,
  clipboardImageUploadRuleId: e,
  uploadBizKey: s,
  uploadBizName: n,
  allowResourceLibrary: r,
  onUploadedFiles: o,
  renderMessageActions: i,
  renderArtifactActions: a,
  onOpenDocument: c,
  referenceProviders: l = []
}) {
  const u = [
    ...l,
    {
      trigger: "#",
      referenceTypes: ["message", "artifact", "upload_file", "session"],
      loadReferences: t.loadReferences,
      loadPreview: t.loadReferencePreview,
      availableScopes: ["current", "history"],
      searchPlaceholder: "搜索消息或会话"
    }
  ], m = Qm(
    u,
    t.loadReferencePreview
  );
  return /* @__PURE__ */ V(Qe.Root, { className: "agent-chat-thread relative flex min-h-0 flex-1 flex-col bg-background", children: [
    /* @__PURE__ */ d("style", { children: Xm }),
    /* @__PURE__ */ V(Qe.ViewportProvider, { children: [
      /* @__PURE__ */ d(
        Qe.Viewport,
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
          children: /* @__PURE__ */ d(
            "div",
            {
              className: ds(
                dn,
                "agent-chat-message-column flex min-h-full flex-col"
              ),
              children: t.sessionLoading && t.messages.length === 0 ? /* @__PURE__ */ d("div", { className: "agent-chat-empty-state text-muted-foreground", children: /* @__PURE__ */ d(ut, { className: "size-5 animate-spin" }) }) : t.messages.length === 0 ? /* @__PURE__ */ V("div", { className: "agent-chat-empty-state", children: [
                /* @__PURE__ */ d("span", { className: "flex size-10 items-center justify-center rounded-md border bg-muted/30 text-muted-foreground", children: /* @__PURE__ */ d(Ci, { className: "size-5" }) }),
                /* @__PURE__ */ d("span", { className: "text-sm text-muted-foreground", children: "开始一段新对话" })
              ] }) : /* @__PURE__ */ d("div", { className: "agent-chat-message-stack flex flex-col", children: /* @__PURE__ */ d(Qe.Messages, { children: () => /* @__PURE__ */ d(
                jm,
                {
                  controller: t,
                  loadPreview: m,
                  renderMessageActions: i,
                  renderArtifactActions: a,
                  onOpenDocument: c
                }
              ) }) })
            }
          )
        }
      ),
      /* @__PURE__ */ d(Nm, { controller: t }),
      /* @__PURE__ */ V(
        "footer",
        {
          className: "agent-chat-footer shrink-0",
          style: {
            paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))"
          },
          children: [
            /* @__PURE__ */ d(
              Qe.ScrollToBottom,
              {
                behavior: "smooth",
                className: "agent-chat-scroll-to-bottom",
                title: "回到底部",
                "aria-label": "回到底部",
                children: /* @__PURE__ */ d(Ii, {})
              }
            ),
            /* @__PURE__ */ V("div", { className: dn, children: [
              t.error ? /* @__PURE__ */ d("div", { className: "mb-2 text-sm text-destructive", children: t.error }) : null,
              /* @__PURE__ */ d(
                Ym,
                {
                  controller: t,
                  referenceProviders: u,
                  clipboardImageUploadRuleId: e,
                  uploadBizKey: s,
                  uploadBizName: n,
                  allowResourceLibrary: r,
                  onUploadedFiles: o
                }
              )
            ] })
          ]
        }
      )
    ] })
  ] });
}
function jm({
  controller: t,
  loadPreview: e,
  renderMessageActions: s,
  renderArtifactActions: n,
  onOpenDocument: r
}) {
  return M((i) => i.message.role) === "user" ? /* @__PURE__ */ d(
    Gm,
    {
      controller: t,
      loadPreview: e,
      renderMessageActions: s
    }
  ) : /* @__PURE__ */ d(
    Wm,
    {
      controller: t,
      loadPreview: e,
      renderMessageActions: s,
      renderArtifactActions: n,
      onOpenDocument: r
    }
  );
}
function Gm({
  controller: t,
  loadPreview: e,
  renderMessageActions: s
}) {
  const n = M(
    (o) => o.message.metadata.custom?.content
  ), r = M(
    (o) => o.message.metadata.custom?.sourceText
  );
  return /* @__PURE__ */ V(qt.Root, { className: "agent-chat-message agent-chat-user-message relative flex flex-col items-end pl-6 md:pl-20", children: [
    /* @__PURE__ */ d("div", { className: "agent-chat-user-bubble max-w-[88%] whitespace-pre-wrap break-words rounded-lg bg-muted px-3.5 py-2.5 text-base leading-7 text-foreground [overflow-wrap:anywhere] md:max-w-full", children: /* @__PURE__ */ d(
      zm,
      {
        content: n,
        fallback: typeof r == "string" ? r : "",
        loadPreview: e
      }
    ) }),
    /* @__PURE__ */ d(
      Hr,
      {
        role: "user",
        sessionTitle: t.sessionTitle,
        renderMessageActions: s
      }
    )
  ] });
}
function Wm({
  controller: t,
  loadPreview: e,
  renderMessageActions: s,
  renderArtifactActions: n,
  onOpenDocument: r
}) {
  const o = M((v) => v.message.status), i = M((v) => v.message.metadata.custom?.output), a = M(
    (v) => v.message.metadata.custom?.activities
  ), c = M(
    (v) => v.message.metadata.custom?.sourceText
  ), l = M(
    (v) => v.message.metadata.custom?.document
  ), u = Zo(l), m = Number(
    M((v) => v.message.metadata.custom?.recordID) || 0
  ), p = Array.isArray(a) ? a : [], h = Xo(i), g = h?.id ? Ko(t.messages, h.id) : void 0, w = ei(i), x = ti(i), C = o?.type === "incomplete" && o.reason === "error", D = !!(l && o?.type === "running" && !gt(l) && !x), R = Zm(
    o?.type === "running",
    p,
    c
  );
  return /* @__PURE__ */ d(
    qt.Root,
    {
      className: ds(
        "agent-chat-message relative min-w-0 [contain-intrinsic-size:auto_180px] [content-visibility:auto]",
        C && "text-destructive"
      ),
      children: /* @__PURE__ */ V(
        si,
        {
          messageID: m,
          render: n,
          children: [
            l ? /* @__PURE__ */ V(xe, { children: [
              u ? /* @__PURE__ */ d(xs, { text: u, error: C }) : null,
              /* @__PURE__ */ d(
                ni,
                {
                  document: l,
                  onOpen: r
                }
              ),
              D ? /* @__PURE__ */ d(mn, {}) : null,
              x ? /* @__PURE__ */ d(
                xs,
                {
                  text: x,
                  error: C,
                  className: "mt-4"
                }
              ) : null
            ] }) : /* @__PURE__ */ V(xe, { children: [
              /* @__PURE__ */ d(qt.Parts, { children: ({ part: v }) => {
                if (v.type === "text")
                  return v.status.type === "running" && !v.text && p.length === 0 ? /* @__PURE__ */ d(Jm, {}) : v.text ? /* @__PURE__ */ d(ri, { error: C }) : null;
                if (v.type === "tool-call") {
                  const b = p.find(
                    (I) => I.id === v.toolCallId
                  );
                  return /* @__PURE__ */ d(oi, { activity: b });
                }
                return null;
              } }),
              R ? /* @__PURE__ */ d(mn, {}) : null,
              /* @__PURE__ */ d(
                ii,
                {
                  output: i,
                  excludeOutputs: p.map(
                    (v) => v.output
                  ),
                  excludeText: typeof c == "string" ? c : ""
                }
              )
            ] }),
            h ? /* @__PURE__ */ d(
              ai,
              {
                interaction: h,
                response: g,
                disabled: t.sendDisabled,
                onSubmit: (v) => {
                  t.send(
                    ci(
                      h.id || "",
                      v.text,
                      v.data
                    )
                  );
                }
              }
            ) : null,
            /* @__PURE__ */ d(
              li,
              {
                suggestions: w,
                disabled: t.sendDisabled,
                onSelect: (v) => {
                  t.send(In(v.prompt));
                }
              }
            ),
            /* @__PURE__ */ d(
              Hr,
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
function Hr({
  role: t,
  sessionTitle: e,
  renderMessageActions: s
}) {
  const n = M((b) => b.message.status), r = Number(
    M((b) => b.message.metadata.custom?.recordID) || 0
  ), o = String(
    M((b) => b.message.metadata.custom?.requestID) || ""
  ), i = String(
    M((b) => b.message.metadata.custom?.createdAt) || ""
  ), a = M(
    (b) => b.message.metadata.custom?.sourceText
  ), c = M(
    (b) => b.message.metadata.custom?.document
  ), l = M((b) => b.message.metadata.custom?.output), u = M(
    (b) => b.message.parts.filter((I) => I.type === "text").map((I) => I.text).join(`
`)
  ), m = c?.hydrated ? ui(c) : typeof a == "string" && a.trim() ? a : u, [p, h] = X(!1), [g, w] = X(!1), x = ee(null);
  ie(
    () => () => {
      x.current != null && window.clearTimeout(x.current);
    },
    []
  );
  const C = () => {
    x.current != null && window.clearTimeout(x.current), x.current = window.setTimeout(() => {
      h(!1), w(!1), x.current = null;
    }, 1800);
  }, D = async () => {
    if (m.trim()) {
      w(!1);
      try {
        await _i(m), h(!0);
      } catch {
        h(!1), w(!0);
      }
      C();
    }
  }, R = !m.trim() || t === "assistant" && n?.type === "running", v = Rn(l).some(
    (b) => b.status === "generating"
  ) || !!(c && gt(c));
  return /* @__PURE__ */ V(
    Yu.Root,
    {
      className: ds(
        "agent-chat-message-actions",
        t === "user" && "justify-end"
      ),
      "data-message-role": t,
      children: [
        /* @__PURE__ */ d(
          En,
          {
            label: g ? "复制失败，请手动选择消息文本" : p ? "已复制" : "复制",
            children: /* @__PURE__ */ V(
              "button",
              {
                type: "button",
                className: "agent-chat-message-action agent-chat-copy-action",
                "aria-label": p ? "消息已复制" : "复制消息",
                "data-copied": p ? "true" : void 0,
                "data-copy-failed": g ? "true" : void 0,
                disabled: R,
                onClick: () => {
                  D();
                },
                children: [
                  /* @__PURE__ */ d(Si, { className: "agent-chat-copy-icon", "aria-hidden": "true" }),
                  /* @__PURE__ */ d(Ri, { className: "agent-chat-copied-icon", "aria-hidden": "true" })
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
          hasPendingArtifacts: v,
          document: c
        })
      ]
    }
  );
}
function Ym({
  controller: t,
  clipboardImageUploadRuleId: e,
  uploadBizKey: s,
  uploadBizName: n,
  allowResourceLibrary: r,
  onUploadedFiles: o,
  referenceProviders: i
}) {
  return /* @__PURE__ */ d(
    Um,
    {
      placeholder: "发消息",
      disabled: t.sendDisabled && !t.running,
      running: t.running,
      stopping: t.stopping,
      cancelable: t.cancelable,
      layerZIndex: dt,
      clipboardImageUploadRuleId: e,
      uploadBizKey: s,
      uploadBizName: n,
      allowResourceLibrary: r,
      onUploadedFiles: o,
      parameters: t.inputParams,
      providers: i,
      loadReferences: t.loadReferences,
      loadPreview: t.loadReferencePreview,
      onSubmit: t.send,
      onCancel: t.stop
    }
  );
}
function Qm(t, e) {
  return (s) => {
    const n = t.find(
      (r) => r.referenceTypes.includes(s.refType)
    );
    return n?.loadPreview ? n.loadPreview(s) : e(s);
  };
}
function Jm() {
  return /* @__PURE__ */ d(
    "div",
    {
      role: "status",
      "aria-label": "智能体正在生成",
      className: "agent-chat-waiting-indicator",
      children: [0, 1, 2].map((t) => /* @__PURE__ */ d(
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
function mn() {
  return /* @__PURE__ */ d(
    "div",
    {
      role: "status",
      "aria-label": "智能体正在执行下一步",
      className: "agent-chat-next-step-indicator",
      children: /* @__PURE__ */ d("span", { className: "agent-chat-pulse-dot" })
    }
  );
}
function Zm(t, e, s) {
  if (!t)
    return !1;
  const n = e.at(-1);
  return !n || n.kind !== "knowledge" && n.kind !== "skill" || n.status === "running" ? !1 : String(s || "").trimEnd() === n.anchorText.trimEnd();
}
const Xm = `
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

`, lt = lo.getStoreValueByPath, Pt = fn.streamValueText, hn = bt.cn, kt = Gt.Button, Km = fe.Dialog, eh = fe.DialogContent, th = fe.DialogDescription, sh = fe.DialogHeader, nh = fe.DialogTitle;
function rh({ item: t, store: e }) {
  const s = nt(
    e,
    () => Pt(lt(e, String(t.meta?.agentPath || "")))
  ), n = nt(
    e,
    () => Pt(
      lt(e, String(t.meta?.agentNamePath || ""))
    )
  ), r = String(t.meta?.openPath || ""), o = nt(
    e,
    () => r ? !!lt(e, r) : !0
  ), i = String(t.meta?.openingEnabledPath || ""), a = nt(
    e,
    () => i ? !!lt(e, i) : !!t.meta?.proactiveOpening
  ), c = ht(
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
  ), l = ht(
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
  ), u = L(() => {
    r && e.getState().setValueByPath(r, !1);
  }, [r, e]);
  return /* @__PURE__ */ d(
    oh,
    {
      agentKey: s,
      agentName: n,
      open: o,
      fullScreen: !!r,
      height: Pt(t.meta?.height || t.meta?.containerHeight) || "min(78dvh, 720px)",
      clipboardImageUploadRuleId: Number(
        t.meta?.clipboardImageUploadRuleId || 0
      ),
      blockMs: Number(t.meta?.blockMs || 1e3),
      proactiveOpening: a,
      assistantApi: c,
      runtimeApi: l,
      onClose: u
    }
  );
}
function oh({
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
  sidebarTitle: m,
  clipboardImageUploadRuleId: p = 0,
  uploadBizKey: h,
  uploadBizName: g,
  allowResourceLibrary: w = !0,
  onUploadedFiles: x,
  blockMs: C = 1e3,
  assistantApi: D,
  runtimeApi: R,
  requestScope: v,
  referenceProviders: b,
  renderMessageActions: I,
  renderArtifactActions: _,
  renderDocumentActions: T,
  onClose: $
}) {
  const k = Dm({
    agentKey: t,
    contextKey: s,
    modalOpen: n,
    blockMs: C,
    lazySession: a,
    proactiveOpening: c,
    assistantApi: D,
    runtimeApi: R,
    requestScope: v
  }), z = di(), B = z.open && z.request?.kind !== "audio" && z.request?.kind !== "file", [U, W] = X("chat"), J = ee(null), [Y, se] = X(0), [G, re] = X(!1), K = ee(/* @__PURE__ */ new Set()), f = ht(
    () => k.messages.find(
      (ne) => ne.document?.id === Y
    ),
    [Y, k.messages]
  ), E = f?.document, A = !!(G && E && !B);
  ie(() => {
    z.closePreview();
  }, [t, k.sessionID, z.closePreview, n]), ie(() => {
    W("chat");
  }, [t, s, l]), ie(() => {
    se(0), re(!1);
  }, [t, s, k.sessionID]), ie(() => {
    K.current.clear();
  }, [t, s]), ie(() => {
    const Ce = [...k.messages].reverse().find((st) => st.autoOpenDocument && st.document)?.document?.id || 0, we = `${k.sessionID}:${Ce}`;
    !Ce || K.current.has(we) || (K.current.add(we), se(Ce), re(!0));
  }, [k.messages, k.sessionID]);
  const O = L((ne) => {
    se(ne.id), re(!0);
  }, []), q = L(
    async (ne) => {
      await k.openSession(ne), W("chat");
    },
    [k.openSession]
  ), j = L(async () => {
    await k.startNewSession(), W("chat");
  }, [k.startNewSession]);
  if (!n)
    return null;
  const oe = /* @__PURE__ */ d(pi, { controller: z, children: /* @__PURE__ */ V(
    "div",
    {
      ref: J,
      "data-agent-chat-layer": "true",
      "data-agent-chat-appearance": u,
      "data-media-inspector-open": B ? "true" : void 0,
      className: hn(
        "relative flex min-h-0 w-full flex-col overflow-hidden bg-background md:flex-row",
        i ? "h-full flex-1" : "border-y"
      ),
      style: i ? void 0 : { height: r, minHeight: o },
      children: [
        /* @__PURE__ */ d(
          en,
          {
            agentName: e,
            title: m,
            agentReady: !!t,
            controller: k,
            collapsed: B
          }
        ),
        l && U === "sessions" ? /* @__PURE__ */ d(
          en,
          {
            mobile: !0,
            agentName: e,
            title: m,
            agentReady: !!t,
            controller: k,
            onOpenSession: q,
            onStartNewSession: j
          }
        ) : null,
        /* @__PURE__ */ V(
          "section",
          {
            className: hn(
              "min-h-0 min-w-0 flex-1 flex-col bg-background",
              l && U === "sessions" ? "hidden md:flex" : "flex",
              B && "md:w-[38vw] md:min-w-[360px] md:max-w-[640px] md:flex-none"
            ),
            children: [
              /* @__PURE__ */ V("header", { className: "agent-chat-header flex h-12 shrink-0 items-center gap-2 px-3 md:h-14 md:px-6", children: [
                l ? /* @__PURE__ */ V(
                  kt,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: "size-10 shrink-0 md:hidden",
                    title: "返回会话列表",
                    onClick: () => W("sessions"),
                    children: [
                      /* @__PURE__ */ d(ao, { className: "size-4" }),
                      /* @__PURE__ */ d("span", { className: "sr-only", children: "返回会话列表" })
                    ]
                  }
                ) : null,
                /* @__PURE__ */ d("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ d("div", { className: "truncate text-sm font-semibold text-foreground", children: k.sessionTitle || "新会话" }) }),
                /* @__PURE__ */ V(
                  kt,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: "size-10 shrink-0 md:hidden",
                    title: "新对话",
                    disabled: k.sessionLoading || !t,
                    onClick: () => {
                      j();
                    },
                    children: [
                      /* @__PURE__ */ d(gn, { className: "size-4" }),
                      /* @__PURE__ */ d("span", { className: "sr-only", children: "新对话" })
                    ]
                  }
                ),
                i && !z.open ? /* @__PURE__ */ V(
                  kt,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: "size-10 shrink-0 md:size-8",
                    title: "关闭运行智能体",
                    onClick: $,
                    children: [
                      /* @__PURE__ */ d(co, { className: "size-4" }),
                      /* @__PURE__ */ d("span", { className: "sr-only", children: "关闭运行智能体" })
                    ]
                  }
                ) : null
              ] }),
              /* @__PURE__ */ d(
                tm,
                {
                  controller: k,
                  children: /* @__PURE__ */ d(
                    Hm,
                    {
                      controller: k,
                      clipboardImageUploadRuleId: p,
                      uploadBizKey: h,
                      uploadBizName: g,
                      allowResourceLibrary: w,
                      onUploadedFiles: x,
                      referenceProviders: b,
                      renderMessageActions: I,
                      renderArtifactActions: _,
                      onOpenDocument: O
                    }
                  )
                },
                `${t}:${s || "default"}:${k.sessionID || "draft"}`
              )
            ]
          }
        ),
        E ? /* @__PURE__ */ d(
          mi,
          {
            open: A,
            portalContainer: J.current,
            document: E,
            messageID: f?.recordID || 0,
            renderArtifactActions: _,
            renderDocumentActions: T,
            onClose: () => re(!1)
          }
        ) : null,
        /* @__PURE__ */ d(
          hi,
          {
            controller: z,
            renderArtifactActions: _
          }
        )
      ]
    }
  ) });
  return i ? /* @__PURE__ */ d(
    Km,
    {
      open: n,
      onOpenChange: (ne) => {
        ne || $?.();
      },
      children: /* @__PURE__ */ V(
        eh,
        {
          layerClassName: Ti,
          layerZIndex: wi,
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
            /* @__PURE__ */ V(sh, { className: "sr-only", children: [
              /* @__PURE__ */ d(nh, { children: "运行智能体" }),
              /* @__PURE__ */ d(th, { children: e || t || "智能体对话" })
            ] }),
            oe
          ]
        }
      )
    }
  ) : oe;
}
const Mh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShowAgentChat: rh
}, Symbol.toStringTag, { value: "Module" }));
export {
  oh as A,
  Mh as a
};
