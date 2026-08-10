import { R as K, b as vt, f as Bn, C as an, g as De, i as de, F as kt, s as Ct, u as Pt, o as Un, d as _t } from "./react-C7Xtl8sB.js";
import { b as me, a as At } from "./_commonjsHelpers-CTFd9u1x.js";
import { f as Rt } from "./preloadable-PCKj9Z7v.js";
import { s as Tt, p as It, f as qe, m as Xe, a as je, b as Ot, c as Lt, d as Dt, e as jt, l as F, g as un, t as be, h as cn, i as Mt, j as zt, k as Ee, n as Me, o as Vn, q as $n, u as Ft, v as Nt, w as Bt, x as Ut, y as Vt, z as $t, A as Ht, B as Se, C as qt, D as Xt, E as Wt, F as Jt } from "./vendor-assistant-BFRzuzys.js";
const Yt = K.createContext(!0);
function fn() {
  throw new Error("A function wrapped in useEffectEvent can't be called during rendering.");
}
const Kt = "use" in K ? () => {
  try {
    return K.use(Yt);
  } catch {
    return !1;
  }
} : () => !1;
function fl(e) {
  const n = K.useRef(fn);
  return K.useInsertionEffect(() => {
    n.current = e;
  }, [e]), (...t) => {
    Kt() && fn();
    const r = n.current;
    return r(...t);
  };
}
var H = { exports: {} }, pn;
function Gt() {
  if (pn) return H.exports;
  pn = 1;
  const e = typeof Buffer < "u", n = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/, t = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
  function r(s, u, a) {
    a == null && u !== null && typeof u == "object" && (a = u, u = void 0), e && Buffer.isBuffer(s) && (s = s.toString()), s && s.charCodeAt(0) === 65279 && (s = s.slice(1));
    const c = JSON.parse(s, u);
    if (c === null || typeof c != "object")
      return c;
    const f = a && a.protoAction || "error", d = a && a.constructorAction || "error";
    if (f === "ignore" && d === "ignore")
      return c;
    if (f !== "ignore" && d !== "ignore") {
      if (n.test(s) === !1 && t.test(s) === !1)
        return c;
    } else if (f !== "ignore" && d === "ignore") {
      if (n.test(s) === !1)
        return c;
    } else if (t.test(s) === !1)
      return c;
    return o(c, { protoAction: f, constructorAction: d, safe: a && a.safe });
  }
  function o(s, { protoAction: u = "error", constructorAction: a = "error", safe: c } = {}) {
    let f = [s];
    for (; f.length; ) {
      const d = f;
      f = [];
      for (const m of d) {
        if (u !== "ignore" && Object.prototype.hasOwnProperty.call(m, "__proto__")) {
          if (c === !0)
            return null;
          if (u === "error")
            throw new SyntaxError("Object contains forbidden prototype property");
          delete m.__proto__;
        }
        if (a !== "ignore" && Object.prototype.hasOwnProperty.call(m, "constructor") && m.constructor !== null && typeof m.constructor == "object" && Object.prototype.hasOwnProperty.call(m.constructor, "prototype")) {
          if (c === !0)
            return null;
          if (a === "error")
            throw new SyntaxError("Object contains forbidden prototype property");
          delete m.constructor;
        }
        for (const v in m) {
          const E = m[v];
          E && typeof E == "object" && f.push(E);
        }
      }
    }
    return s;
  }
  function l(s, u, a) {
    const { stackTraceLimit: c } = Error;
    Error.stackTraceLimit = 0;
    try {
      return r(s, u, a);
    } finally {
      Error.stackTraceLimit = c;
    }
  }
  function i(s, u) {
    const { stackTraceLimit: a } = Error;
    Error.stackTraceLimit = 0;
    try {
      return r(s, u, { safe: !0 });
    } catch {
      return;
    } finally {
      Error.stackTraceLimit = a;
    }
  }
  return H.exports = l, H.exports.default = l, H.exports.parse = l, H.exports.safeParse = i, H.exports.scan = o, H.exports;
}
var Zt = Gt();
const pl = /* @__PURE__ */ me(Zt);
let dl = (e, n = 21) => (t = n) => {
  let r = "", o = t | 0;
  for (; o-- > 0; )
    r += e[Math.random() * e.length | 0];
  return r;
};
const dn = (e) => Symbol.iterator in e, hn = (e) => (
  // HACK: avoid checking entries type
  "entries" in e
), mn = (e, n) => {
  const t = e instanceof Map ? e : new Map(e.entries()), r = n instanceof Map ? n : new Map(n.entries());
  if (t.size !== r.size)
    return !1;
  for (const [o, l] of t)
    if (!r.has(o) || !Object.is(l, r.get(o)))
      return !1;
  return !0;
}, Qt = (e, n) => {
  const t = e[Symbol.iterator](), r = n[Symbol.iterator]();
  let o = t.next(), l = r.next();
  for (; !o.done && !l.done; ) {
    if (!Object.is(o.value, l.value))
      return !1;
    o = t.next(), l = r.next();
  }
  return !!o.done && !!l.done;
};
function er(e, n) {
  return Object.is(e, n) ? !0 : typeof e != "object" || e === null || typeof n != "object" || n === null || Object.getPrototypeOf(e) !== Object.getPrototypeOf(n) ? !1 : dn(e) && dn(n) ? hn(e) && hn(n) ? mn(e, n) : Qt(e, n) : mn(
    { entries: () => Object.entries(e) },
    { entries: () => Object.entries(n) }
  );
}
function hl(e) {
  const n = K.useRef(void 0);
  return (t) => {
    const r = e(t);
    return er(n.current, r) ? n.current : n.current = r;
  };
}
var nr = Object.defineProperty, We = (e, n) => nr(e, "name", { value: n, configurable: !0 });
function ze(e, n) {
  if (typeof e == "function")
    return e(n);
  e != null && (e.current = n);
}
We(ze, "setRef");
function Hn(...e) {
  return (n) => {
    let t = !1;
    const r = e.map((o) => {
      const l = ze(o, n);
      return !t && typeof l == "function" && (t = !0), l;
    });
    if (t)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const l = r[o];
          typeof l == "function" ? l() : ze(e[o], null);
        }
      };
  };
}
We(Hn, "composeRefs");
function qn(...e) {
  return vt(Hn(...e), e);
}
We(qn, "useComposedRefs");
var tr = Object.defineProperty, B = (e, n) => tr(e, "name", { value: n, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Xn(e) {
  const n = Bn((t, r) => {
    let { children: o, ...l } = t, i = null, s = !1;
    const u = [];
    Fe(o) && typeof ce == "function" && (o = ce(o._payload)), an.forEach(o, (d) => {
      if (Kn(d)) {
        s = !0;
        const m = d;
        let v = "child" in m.props ? m.props.child : m.props.children;
        Fe(v) && typeof ce == "function" && (v = ce(v._payload)), i = or(m, v), u.push(i?.props?.children);
      } else
        u.push(d);
    }), i ? i = De(i, void 0, u) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !s && an.count(o) === 1 && de(o) && (i = o)
    );
    const a = i ? Yn(i) : void 0, c = qn(r, a);
    if (!i) {
      if (o || o === 0)
        throw new Error(
          s ? sr(e) : ir(e)
        );
      return o;
    }
    const f = Jn(l, i.props ?? {});
    return i.type !== kt && (f.ref = r ? c : a), De(i, f);
  });
  return n.displayName = `${e}.Slot`, n;
}
B(Xn, "createSlot");
var Wn = /* @__PURE__ */ Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function rr(e) {
  const n = /* @__PURE__ */ B((t) => "child" in t ? t.children(t.child) : t.children, "Slottable");
  return n.displayName = `${e}.Slottable`, n.__radixId = Wn, n;
}
B(rr, "createSlottable");
var or = /* @__PURE__ */ B((e, n) => {
  if ("child" in e.props) {
    const t = e.props.child;
    return de(t) ? De(t, void 0, e.props.children(t.props.children)) : null;
  }
  return de(n) ? n : null;
}, "getSlottableElementFromSlottable");
function Jn(e, n) {
  const t = { ...n };
  for (const r in n) {
    const o = e[r], l = n[r];
    /^on[A-Z]/.test(r) ? o && l ? t[r] = (...s) => {
      const u = l(...s);
      return o(...s), u;
    } : o && (t[r] = o) : r === "style" ? t[r] = { ...o, ...l } : r === "className" && (t[r] = [o, l].filter(Boolean).join(" "));
  }
  return { ...e, ...t };
}
B(Jn, "mergeProps");
function Yn(e) {
  let n = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, t = n && "isReactWarning" in n && n.isReactWarning;
  return t ? e.ref : (n = Object.getOwnPropertyDescriptor(e, "ref")?.get, t = n && "isReactWarning" in n && n.isReactWarning, t ? e.props.ref : e.props.ref || e.ref);
}
B(Yn, "getElementRef");
function Kn(e) {
  return de(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Wn;
}
B(Kn, "isSlottable");
var lr = /* @__PURE__ */ Symbol.for("react.lazy");
function Fe(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === lr && "_payload" in e && Gn(e._payload);
}
B(Fe, "isLazyComponent");
function Gn(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
B(Gn, "isPromiseLike");
var ir = /* @__PURE__ */ B((e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), sr = /* @__PURE__ */ B((e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), ce = Ct[" use ".trim().toString()], ar = Object.defineProperty, ur = (e, n) => ar(e, "name", { value: n, configurable: !0 }), cr = [
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
], ml = cr.reduce((e, n) => {
  const t = /* @__PURE__ */ Xn(`Primitive.${n}`), r = Bn((o, l) => {
    const { asChild: i, ...s } = o, u = i ? t : n;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ At(u, { ...s, ref: l });
  });
  return r.displayName = `Primitive.${n}`, { ...e, [n]: r };
}, {});
function fr(e, n) {
  e && Rt(() => e.dispatchEvent(n));
}
ur(fr, "dispatchDiscreteCustomEvent");
var pr = Object.defineProperty, G = (e, n) => pr(e, "name", { value: n, configurable: !0 }), Zn = !!(typeof window < "u" && window.document && window.document.createElement);
function dr(e, n, { checkForDefaultPrevented: t = !0 } = {}) {
  return /* @__PURE__ */ G(function(o) {
    if (e?.(o), t === !1 || !o || !o.defaultPrevented)
      return n?.(o);
  }, "handleEvent");
}
G(dr, "composeEventHandlers");
function hr(e) {
  if (!Zn)
    throw new Error("Cannot access window outside of the DOM");
  return e?.ownerDocument?.defaultView ?? window;
}
G(hr, "getOwnerWindow");
function Ne(e) {
  if (!Zn)
    throw new Error("Cannot access document outside of the DOM");
  return e?.ownerDocument ?? document;
}
G(Ne, "getOwnerDocument");
function Qn(e, n = !1) {
  const { activeElement: t } = Ne(e);
  if (!t?.nodeName)
    return null;
  if (et(t) && t.contentDocument)
    return Qn(t.contentDocument.body, n);
  if (n) {
    const r = t.getAttribute("aria-activedescendant");
    if (r) {
      const o = Ne(t).getElementById(r);
      if (o)
        return o;
    }
  }
  return t;
}
G(Qn, "getActiveElement");
function et(e) {
  return e.tagName === "IFRAME";
}
G(et, "isFrame");
var mr = Object.defineProperty, gr = (e, n) => mr(e, "name", { value: n, configurable: !0 });
function nt(e) {
  const n = Pt(e);
  return Un(() => {
    n.current = e;
  }), _t(() => ((...t) => n.current?.(...t)), []);
}
gr(nt, "useCallbackRef");
var yr = Object.defineProperty, tt = (e, n) => yr(e, "name", { value: n, configurable: !0 });
function wr(e, n = globalThis?.document) {
  const t = nt(e);
  Un(() => {
    const r = /* @__PURE__ */ tt((o) => {
      o.key === "Escape" && t(o);
    }, "handleKeyDown");
    return n.addEventListener("keydown", r, { capture: !0 }), () => n.removeEventListener("keydown", r, { capture: !0 });
  }, [t, n]);
}
tt(wr, "useEscapeKeydown");
var ve = { exports: {} };
var gn;
function xr() {
  return gn || (gn = 1, (function(e) {
    (function() {
      var n = {}.hasOwnProperty;
      function t() {
        for (var l = "", i = 0; i < arguments.length; i++) {
          var s = arguments[i];
          s && (l = o(l, r(s)));
        }
        return l;
      }
      function r(l) {
        if (typeof l == "string" || typeof l == "number")
          return l;
        if (typeof l != "object")
          return "";
        if (Array.isArray(l))
          return t.apply(null, l);
        if (l.toString !== Object.prototype.toString && !l.toString.toString().includes("[native code]"))
          return l.toString();
        var i = "";
        for (var s in l)
          n.call(l, s) && l[s] && (i = o(i, s));
        return i;
      }
      function o(l, i) {
        return i ? l ? l + " " + i : l + i : l;
      }
      e.exports ? (t.default = t, e.exports = t) : window.classNames = t;
    })();
  })(ve)), ve.exports;
}
var br = xr();
const gl = /* @__PURE__ */ me(br);
function yl() {
}
function wl() {
}
function Er(e, n) {
  const t = {};
  return (e[e.length - 1] === "" ? [...e, ""] : e).join(
    (t.padRight ? " " : "") + "," + (t.padLeft === !1 ? "" : " ")
  ).trim();
}
const Sr = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, vr = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, kr = {};
function yn(e, n) {
  return (kr.jsx ? vr : Sr).test(e);
}
const Cr = /[ \t\n\f\r]/g;
function Pr(e) {
  return typeof e == "object" ? e.type === "text" ? wn(e.value) : !1 : wn(e);
}
function wn(e) {
  return e.replace(Cr, "") === "";
}
class le {
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
  constructor(n, t, r) {
    this.normal = t, this.property = n, r && (this.space = r);
  }
}
le.prototype.normal = {};
le.prototype.property = {};
le.prototype.space = void 0;
function rt(e, n) {
  const t = {}, r = {};
  for (const o of e)
    Object.assign(t, o.property), Object.assign(r, o.normal);
  return new le(t, r, n);
}
function Be(e) {
  return e.toLowerCase();
}
class M {
  /**
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @returns
   *   Info.
   */
  constructor(n, t) {
    this.attribute = t, this.property = n;
  }
}
M.prototype.attribute = "";
M.prototype.booleanish = !1;
M.prototype.boolean = !1;
M.prototype.commaOrSpaceSeparated = !1;
M.prototype.commaSeparated = !1;
M.prototype.defined = !1;
M.prototype.mustUseProperty = !1;
M.prototype.number = !1;
M.prototype.overloadedBoolean = !1;
M.prototype.property = "";
M.prototype.spaceSeparated = !1;
M.prototype.space = void 0;
let _r = 0;
const g = W(), T = W(), Ue = W(), p = W(), P = W(), X = W(), N = W();
function W() {
  return 2 ** ++_r;
}
const Ve = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  boolean: g,
  booleanish: T,
  commaOrSpaceSeparated: N,
  commaSeparated: X,
  number: p,
  overloadedBoolean: Ue,
  spaceSeparated: P
}, Symbol.toStringTag, { value: "Module" })), ke = (
  /** @type {ReadonlyArray<keyof typeof types>} */
  Object.keys(Ve)
);
class Je extends M {
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
  constructor(n, t, r, o) {
    let l = -1;
    if (super(n, t), xn(this, "space", o), typeof r == "number")
      for (; ++l < ke.length; ) {
        const i = ke[l];
        xn(this, ke[l], (r & Ve[i]) === Ve[i]);
      }
  }
}
Je.prototype.defined = !0;
function xn(e, n, t) {
  t && (e[n] = t);
}
function Z(e) {
  const n = {}, t = {};
  for (const [r, o] of Object.entries(e.properties)) {
    const l = new Je(
      r,
      e.transform(e.attributes || {}, r),
      o,
      e.space
    );
    e.mustUseProperty && e.mustUseProperty.includes(r) && (l.mustUseProperty = !0), n[r] = l, t[Be(r)] = r, t[Be(l.attribute)] = r;
  }
  return new le(n, t, e.space);
}
const ot = Z({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: T,
    ariaAutoComplete: null,
    ariaBusy: T,
    ariaChecked: T,
    ariaColCount: p,
    ariaColIndex: p,
    ariaColSpan: p,
    ariaControls: P,
    ariaCurrent: null,
    ariaDescribedBy: P,
    ariaDetails: null,
    ariaDisabled: T,
    ariaDropEffect: P,
    ariaErrorMessage: null,
    ariaExpanded: T,
    ariaFlowTo: P,
    ariaGrabbed: T,
    ariaHasPopup: null,
    ariaHidden: T,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: P,
    ariaLevel: p,
    ariaLive: null,
    ariaModal: T,
    ariaMultiLine: T,
    ariaMultiSelectable: T,
    ariaOrientation: null,
    ariaOwns: P,
    ariaPlaceholder: null,
    ariaPosInSet: p,
    ariaPressed: T,
    ariaReadOnly: T,
    ariaRelevant: null,
    ariaRequired: T,
    ariaRoleDescription: P,
    ariaRowCount: p,
    ariaRowIndex: p,
    ariaRowSpan: p,
    ariaSelected: T,
    ariaSetSize: p,
    ariaSort: null,
    ariaValueMax: p,
    ariaValueMin: p,
    ariaValueNow: p,
    ariaValueText: null,
    role: null
  },
  transform(e, n) {
    return n === "role" ? n : "aria-" + n.slice(4).toLowerCase();
  }
});
function lt(e, n) {
  return n in e ? e[n] : n;
}
function it(e, n) {
  return lt(e, n.toLowerCase());
}
const Ar = Z({
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
    accept: X,
    acceptCharset: P,
    accessKey: P,
    action: null,
    allow: null,
    allowFullScreen: g,
    allowPaymentRequest: g,
    allowUserMedia: g,
    alpha: g,
    alt: null,
    as: null,
    async: g,
    autoCapitalize: null,
    autoComplete: P,
    autoFocus: g,
    autoPlay: g,
    blocking: P,
    capture: null,
    charSet: null,
    checked: g,
    cite: null,
    className: P,
    closedBy: null,
    colorSpace: null,
    cols: p,
    colSpan: p,
    command: null,
    commandFor: null,
    content: null,
    contentEditable: T,
    controls: g,
    controlsList: P,
    coords: p | X,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: g,
    defer: g,
    dir: null,
    dirName: null,
    disabled: g,
    download: Ue,
    draggable: T,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: g,
    formTarget: null,
    headers: P,
    height: p,
    hidden: Ue,
    high: p,
    href: null,
    hrefLang: null,
    htmlFor: P,
    httpEquiv: P,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: g,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: g,
    itemId: null,
    itemProp: P,
    itemRef: P,
    itemScope: g,
    itemType: P,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: g,
    low: p,
    manifest: null,
    max: null,
    maxLength: p,
    media: null,
    method: null,
    min: null,
    minLength: p,
    multiple: g,
    muted: g,
    name: null,
    nonce: null,
    noModule: g,
    noValidate: g,
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
    open: g,
    optimum: p,
    pattern: null,
    ping: P,
    placeholder: null,
    playsInline: g,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: g,
    referrerPolicy: null,
    rel: P,
    required: g,
    reversed: g,
    rows: p,
    rowSpan: p,
    sandbox: P,
    scope: null,
    scoped: g,
    seamless: g,
    selected: g,
    shadowRootClonable: g,
    shadowRootCustomElementRegistry: g,
    shadowRootDelegatesFocus: g,
    shadowRootMode: null,
    shadowRootSerializable: g,
    shape: null,
    size: p,
    sizes: null,
    slot: null,
    span: p,
    spellCheck: T,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: p,
    step: null,
    style: null,
    tabIndex: p,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: g,
    useMap: null,
    value: T,
    width: p,
    wrap: null,
    writingSuggestions: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: P,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: p,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: p,
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
    compact: g,
    // Lists. Use CSS to reduce space between items instead
    declare: g,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: p,
    // `<img>` and `<object>`
    leftMargin: p,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: p,
    // `<body>`
    marginWidth: p,
    // `<body>`
    noResize: g,
    // `<frame>`
    noHref: g,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: g,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: g,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: p,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: T,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: p,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: p,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    credentialless: g,
    disablePictureInPicture: g,
    disableRemotePlayback: g,
    exportParts: X,
    part: P,
    prefix: null,
    property: null,
    results: p,
    security: null,
    unselectable: null
  },
  space: "html",
  transform: it
}), Rr = Z({
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
    about: N,
    accentHeight: p,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: p,
    amplitude: p,
    arabicForm: null,
    ascent: p,
    attributeName: null,
    attributeType: null,
    azimuth: p,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: p,
    by: null,
    calcMode: null,
    capHeight: p,
    className: P,
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
    descent: p,
    diffuseConstant: p,
    direction: null,
    display: null,
    dur: null,
    divisor: p,
    dominantBaseline: null,
    download: g,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: p,
    enableBackground: null,
    end: null,
    event: null,
    exponent: p,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: p,
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
    g1: X,
    g2: X,
    glyphName: X,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: p,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: p,
    horizOriginX: p,
    horizOriginY: p,
    id: null,
    ideographic: p,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: p,
    k: p,
    k1: p,
    k2: p,
    k3: p,
    k4: p,
    kernelMatrix: N,
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
    limitingConeAngle: p,
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
    mediaSize: p,
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
    overlinePosition: p,
    overlineThickness: p,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: p,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: P,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: p,
    pointsAtY: p,
    pointsAtZ: p,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: N,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: N,
    rev: N,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: N,
    requiredFeatures: N,
    requiredFonts: N,
    requiredFormats: N,
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
    specularConstant: p,
    specularExponent: p,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: p,
    strikethroughThickness: p,
    string: null,
    stroke: null,
    strokeDashArray: N,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: p,
    strokeOpacity: p,
    strokeWidth: null,
    style: null,
    surfaceScale: p,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: N,
    tabIndex: p,
    tableValues: null,
    target: null,
    targetX: p,
    targetY: p,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: N,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: p,
    underlineThickness: p,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: p,
    values: null,
    vAlphabetic: p,
    vMathematical: p,
    vectorEffect: null,
    vHanging: p,
    vIdeographic: p,
    version: null,
    vertAdvY: p,
    vertOriginX: p,
    vertOriginY: p,
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
    xHeight: p,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  },
  space: "svg",
  transform: lt
}), st = Z({
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
  transform(e, n) {
    return "xlink:" + n.slice(5).toLowerCase();
  }
}), at = Z({
  attributes: { xmlnsxlink: "xmlns:xlink" },
  properties: { xmlnsXLink: null, xmlns: null },
  space: "xmlns",
  transform: it
}), ut = Z({
  properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
  space: "xml",
  transform(e, n) {
    return "xml:" + n.slice(3).toLowerCase();
  }
}), Tr = {
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
}, Ir = /[A-Z]/g, bn = /-[a-z]/g, Or = /^data[-\w.:]+$/i;
function Lr(e, n) {
  const t = Be(n);
  let r = n, o = M;
  if (t in e.normal)
    return e.property[e.normal[t]];
  if (t.length > 4 && t.slice(0, 4) === "data" && Or.test(n)) {
    if (n.charAt(4) === "-") {
      const l = n.slice(5).replace(bn, jr);
      r = "data" + l.charAt(0).toUpperCase() + l.slice(1);
    } else {
      const l = n.slice(4);
      if (!bn.test(l)) {
        let i = l.replace(Ir, Dr);
        i.charAt(0) !== "-" && (i = "-" + i), n = "data" + i;
      }
    }
    o = Je;
  }
  return new o(r, n);
}
function Dr(e) {
  return "-" + e.toLowerCase();
}
function jr(e) {
  return e.charAt(1).toUpperCase();
}
const Mr = rt([ot, Ar, st, at, ut], "html"), Ye = rt([ot, Rr, st, at, ut], "svg");
function zr(e) {
  return e.join(" ").trim();
}
var Y = {}, Ce, En;
function Fr() {
  if (En) return Ce;
  En = 1;
  var e = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, n = /\n/g, t = /^\s*/, r = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, o = /^:\s*/, l = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, i = /^[;\s]*/, s = /^\s+|\s+$/g, u = `
`, a = "/", c = "*", f = "", d = "comment", m = "declaration";
  function v(x, b) {
    if (typeof x != "string")
      throw new TypeError("First argument must be a string");
    if (!x) return [];
    b = b || {};
    var C = 1, h = 1;
    function A(S) {
      var y = S.match(n);
      y && (C += y.length);
      var I = S.lastIndexOf(u);
      h = ~I ? S.length - I : h + S.length;
    }
    function _() {
      var S = { line: C, column: h };
      return function(y) {
        return y.position = new R(S), $(), y;
      };
    }
    function R(S) {
      this.start = S, this.end = { line: C, column: h }, this.source = b.source;
    }
    R.prototype.content = x;
    function L(S) {
      var y = new Error(
        b.source + ":" + C + ":" + h + ": " + S
      );
      if (y.reason = S, y.filename = b.source, y.line = C, y.column = h, y.source = x, !b.silent) throw y;
    }
    function j(S) {
      var y = S.exec(x);
      if (y) {
        var I = y[0];
        return A(I), x = x.slice(I.length), y;
      }
    }
    function $() {
      j(t);
    }
    function V(S) {
      var y;
      for (S = S || []; y = w(); )
        y !== !1 && S.push(y);
      return S;
    }
    function w() {
      var S = _();
      if (!(a != x.charAt(0) || c != x.charAt(1))) {
        for (var y = 2; f != x.charAt(y) && (c != x.charAt(y) || a != x.charAt(y + 1)); )
          ++y;
        if (y += 2, f === x.charAt(y - 1))
          return L("End of comment missing");
        var I = x.slice(2, y - 2);
        return h += 2, A(I), x = x.slice(y), h += 2, S({
          type: d,
          comment: I
        });
      }
    }
    function k() {
      var S = _(), y = j(r);
      if (y) {
        if (w(), !j(o)) return L("property missing ':'");
        var I = j(l), Q = S({
          type: m,
          property: E(y[0].replace(e, f)),
          value: I ? E(I[0].replace(e, f)) : f
        });
        return j(i), Q;
      }
    }
    function z() {
      var S = [];
      V(S);
      for (var y; y = k(); )
        y !== !1 && (S.push(y), V(S));
      return S;
    }
    return $(), z();
  }
  function E(x) {
    return x ? x.replace(s, f) : f;
  }
  return Ce = v, Ce;
}
var Sn;
function Nr() {
  if (Sn) return Y;
  Sn = 1;
  var e = Y && Y.__importDefault || function(r) {
    return r && r.__esModule ? r : { default: r };
  };
  Object.defineProperty(Y, "__esModule", { value: !0 }), Y.default = t;
  const n = e(Fr());
  function t(r, o) {
    let l = null;
    if (!r || typeof r != "string")
      return l;
    const i = (0, n.default)(r), s = typeof o == "function";
    return i.forEach((u) => {
      if (u.type !== "declaration")
        return;
      const { property: a, value: c } = u;
      s ? o(a, c, u) : c && (l = l || {}, l[a] = c);
    }), l;
  }
  return Y;
}
var ee = {}, vn;
function Br() {
  if (vn) return ee;
  vn = 1, Object.defineProperty(ee, "__esModule", { value: !0 }), ee.camelCase = void 0;
  var e = /^--[a-zA-Z0-9_-]+$/, n = /-([a-z])/g, t = /^[^-]+$/, r = /^-(webkit|moz|ms|o|khtml)-/, o = /^-(ms)-/, l = function(a) {
    return !a || t.test(a) || e.test(a);
  }, i = function(a, c) {
    return c.toUpperCase();
  }, s = function(a, c) {
    return "".concat(c, "-");
  }, u = function(a, c) {
    return c === void 0 && (c = {}), l(a) ? a : (a = a.toLowerCase(), c.reactCompat ? a = a.replace(o, s) : a = a.replace(r, s), a.replace(n, i));
  };
  return ee.camelCase = u, ee;
}
var ne, kn;
function Ur() {
  if (kn) return ne;
  kn = 1;
  var e = ne && ne.__importDefault || function(o) {
    return o && o.__esModule ? o : { default: o };
  }, n = e(Nr()), t = Br();
  function r(o, l) {
    var i = {};
    return !o || typeof o != "string" || (0, n.default)(o, function(s, u) {
      s && u && (i[(0, t.camelCase)(s, l)] = u);
    }), i;
  }
  return r.default = r, ne = r, ne;
}
var Vr = Ur();
const $r = /* @__PURE__ */ me(Vr);
class O extends Error {
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
  constructor(n, t, r) {
    super(), typeof t == "string" && (r = t, t = void 0);
    let o = "", l = {}, i = !1;
    if (t && ("line" in t && "column" in t ? l = { place: t } : "start" in t && "end" in t ? l = { place: t } : "type" in t ? l = {
      ancestors: [t],
      place: t.position
    } : l = { ...t }), typeof n == "string" ? o = n : !l.cause && n && (i = !0, o = n.message, l.cause = n), !l.ruleId && !l.source && typeof r == "string") {
      const u = r.indexOf(":");
      u === -1 ? l.ruleId = r : (l.source = r.slice(0, u), l.ruleId = r.slice(u + 1));
    }
    if (!l.place && l.ancestors && l.ancestors) {
      const u = l.ancestors[l.ancestors.length - 1];
      u && (l.place = u.position);
    }
    const s = l.place && "start" in l.place ? l.place.start : l.place;
    this.ancestors = l.ancestors || void 0, this.cause = l.cause || void 0, this.column = s ? s.column : void 0, this.fatal = void 0, this.file = "", this.message = o, this.line = s ? s.line : void 0, this.name = Tt(l.place) || "1:1", this.place = l.place || void 0, this.reason = this.message, this.ruleId = l.ruleId || void 0, this.source = l.source || void 0, this.stack = i && l.cause && typeof l.cause.stack == "string" ? l.cause.stack : "", this.actual = void 0, this.expected = void 0, this.note = void 0, this.url = void 0;
  }
}
O.prototype.file = "";
O.prototype.name = "";
O.prototype.reason = "";
O.prototype.message = "";
O.prototype.stack = "";
O.prototype.column = void 0;
O.prototype.line = void 0;
O.prototype.ancestors = void 0;
O.prototype.cause = void 0;
O.prototype.fatal = void 0;
O.prototype.place = void 0;
O.prototype.ruleId = void 0;
O.prototype.source = void 0;
const Ke = {}.hasOwnProperty, Hr = /* @__PURE__ */ new Map(), qr = /[A-Z]/g, Xr = /* @__PURE__ */ new Set(["table", "tbody", "thead", "tfoot", "tr"]), Wr = /* @__PURE__ */ new Set(["td", "th"]), ct = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";
function xl(e, n) {
  if (!n || n.Fragment === void 0)
    throw new TypeError("Expected `Fragment` in options");
  const t = n.filePath || void 0;
  let r;
  if (n.development) {
    if (typeof n.jsxDEV != "function")
      throw new TypeError(
        "Expected `jsxDEV` in options when `development: true`"
      );
    r = no(t, n.jsxDEV);
  } else {
    if (typeof n.jsx != "function")
      throw new TypeError("Expected `jsx` in production options");
    if (typeof n.jsxs != "function")
      throw new TypeError("Expected `jsxs` in production options");
    r = eo(t, n.jsx, n.jsxs);
  }
  const o = {
    Fragment: n.Fragment,
    ancestors: [],
    components: n.components || {},
    create: r,
    elementAttributeNameCase: n.elementAttributeNameCase || "react",
    evaluater: n.createEvaluater ? n.createEvaluater() : void 0,
    filePath: t,
    ignoreInvalidStyle: n.ignoreInvalidStyle || !1,
    passKeys: n.passKeys !== !1,
    passNode: n.passNode || !1,
    schema: n.space === "svg" ? Ye : Mr,
    stylePropertyNameCase: n.stylePropertyNameCase || "dom",
    tableCellAlignToStyle: n.tableCellAlignToStyle !== !1
  }, l = ft(o, e, void 0);
  return l && typeof l != "string" ? l : o.create(
    e,
    o.Fragment,
    { children: l || void 0 },
    void 0
  );
}
function ft(e, n, t) {
  if (n.type === "element")
    return Jr(e, n, t);
  if (n.type === "mdxFlowExpression" || n.type === "mdxTextExpression")
    return Yr(e, n);
  if (n.type === "mdxJsxFlowElement" || n.type === "mdxJsxTextElement")
    return Gr(e, n, t);
  if (n.type === "mdxjsEsm")
    return Kr(e, n);
  if (n.type === "root")
    return Zr(e, n, t);
  if (n.type === "text")
    return Qr(e, n);
}
function Jr(e, n, t) {
  const r = e.schema;
  let o = r;
  n.tagName.toLowerCase() === "svg" && r.space === "html" && (o = Ye, e.schema = o), e.ancestors.push(n);
  const l = dt(e, n.tagName, !1), i = to(e, n);
  let s = Ze(e, n);
  return Xr.has(n.tagName) && (s = s.filter(function(u) {
    return typeof u == "string" ? !Pr(u) : !0;
  })), pt(e, i, l, n), Ge(i, s), e.ancestors.pop(), e.schema = r, e.create(n, l, i, t);
}
function Yr(e, n) {
  if (n.data && n.data.estree && e.evaluater) {
    const r = n.data.estree.body[0];
    return r.type, /** @type {Child | undefined} */
    e.evaluater.evaluateExpression(r.expression);
  }
  oe(e, n.position);
}
function Kr(e, n) {
  if (n.data && n.data.estree && e.evaluater)
    return (
      /** @type {Child | undefined} */
      e.evaluater.evaluateProgram(n.data.estree)
    );
  oe(e, n.position);
}
function Gr(e, n, t) {
  const r = e.schema;
  let o = r;
  n.name === "svg" && r.space === "html" && (o = Ye, e.schema = o), e.ancestors.push(n);
  const l = n.name === null ? e.Fragment : dt(e, n.name, !0), i = ro(e, n), s = Ze(e, n);
  return pt(e, i, l, n), Ge(i, s), e.ancestors.pop(), e.schema = r, e.create(n, l, i, t);
}
function Zr(e, n, t) {
  const r = {};
  return Ge(r, Ze(e, n)), e.create(n, e.Fragment, r, t);
}
function Qr(e, n) {
  return n.value;
}
function pt(e, n, t, r) {
  typeof t != "string" && t !== e.Fragment && e.passNode && (n.node = r);
}
function Ge(e, n) {
  if (n.length > 0) {
    const t = n.length > 1 ? n : n[0];
    t && (e.children = t);
  }
}
function eo(e, n, t) {
  return r;
  function r(o, l, i, s) {
    const a = Array.isArray(i.children) ? t : n;
    return s ? a(l, i, s) : a(l, i);
  }
}
function no(e, n) {
  return t;
  function t(r, o, l, i) {
    const s = Array.isArray(l.children), u = It(r);
    return n(
      o,
      l,
      i,
      s,
      {
        columnNumber: u ? u.column - 1 : void 0,
        fileName: e,
        lineNumber: u ? u.line : void 0
      },
      void 0
    );
  }
}
function to(e, n) {
  const t = {};
  let r, o;
  for (o in n.properties)
    if (o !== "children" && Ke.call(n.properties, o)) {
      const l = oo(e, o, n.properties[o]);
      if (l) {
        const [i, s] = l;
        e.tableCellAlignToStyle && i === "align" && typeof s == "string" && Wr.has(n.tagName) ? r = s : t[i] = s;
      }
    }
  if (r) {
    const l = (
      /** @type {Style} */
      t.style || (t.style = {})
    );
    l[e.stylePropertyNameCase === "css" ? "text-align" : "textAlign"] = r;
  }
  return t;
}
function ro(e, n) {
  const t = {};
  for (const r of n.attributes)
    if (r.type === "mdxJsxExpressionAttribute")
      if (r.data && r.data.estree && e.evaluater) {
        const l = r.data.estree.body[0];
        l.type;
        const i = l.expression;
        i.type;
        const s = i.properties[0];
        s.type, Object.assign(
          t,
          e.evaluater.evaluateExpression(s.argument)
        );
      } else
        oe(e, n.position);
    else {
      const o = r.name;
      let l;
      if (r.value && typeof r.value == "object")
        if (r.value.data && r.value.data.estree && e.evaluater) {
          const s = r.value.data.estree.body[0];
          s.type, l = e.evaluater.evaluateExpression(s.expression);
        } else
          oe(e, n.position);
      else
        l = r.value === null ? !0 : r.value;
      t[o] = /** @type {Props[keyof Props]} */
      l;
    }
  return t;
}
function Ze(e, n) {
  const t = [];
  let r = -1;
  const o = e.passKeys ? /* @__PURE__ */ new Map() : Hr;
  for (; ++r < n.children.length; ) {
    const l = n.children[r];
    let i;
    if (e.passKeys) {
      const u = l.type === "element" ? l.tagName : l.type === "mdxJsxFlowElement" || l.type === "mdxJsxTextElement" ? l.name : void 0;
      if (u) {
        const a = o.get(u) || 0;
        i = u + "-" + a, o.set(u, a + 1);
      }
    }
    const s = ft(e, l, i);
    s !== void 0 && t.push(s);
  }
  return t;
}
function oo(e, n, t) {
  const r = Lr(e.schema, n);
  if (!(t == null || typeof t == "number" && Number.isNaN(t))) {
    if (Array.isArray(t) && (t = r.commaSeparated ? Er(t) : zr(t)), r.property === "style") {
      let o = typeof t == "object" ? t : lo(e, String(t));
      return e.stylePropertyNameCase === "css" && (o = io(o)), ["style", o];
    }
    return [
      e.elementAttributeNameCase === "react" && r.space ? Tr[r.property] || r.property : r.attribute,
      t
    ];
  }
}
function lo(e, n) {
  try {
    return $r(n, { reactCompat: !0 });
  } catch (t) {
    if (e.ignoreInvalidStyle)
      return {};
    const r = (
      /** @type {Error} */
      t
    ), o = new O("Cannot parse `style` attribute", {
      ancestors: e.ancestors,
      cause: r,
      ruleId: "style",
      source: "hast-util-to-jsx-runtime"
    });
    throw o.file = e.filePath || void 0, o.url = ct + "#cannot-parse-style-attribute", o;
  }
}
function dt(e, n, t) {
  let r;
  if (!t)
    r = { type: "Literal", value: n };
  else if (n.includes(".")) {
    const o = n.split(".");
    let l = -1, i;
    for (; ++l < o.length; ) {
      const s = yn(o[l]) ? { type: "Identifier", name: o[l] } : { type: "Literal", value: o[l] };
      i = i ? {
        type: "MemberExpression",
        object: i,
        property: s,
        computed: !!(l && s.type === "Literal"),
        optional: !1
      } : s;
    }
    r = i;
  } else
    r = yn(n) && !/^[a-z]/.test(n) ? { type: "Identifier", name: n } : { type: "Literal", value: n };
  if (r.type === "Literal") {
    const o = (
      /** @type {string | number} */
      r.value
    );
    return Ke.call(e.components, o) ? e.components[o] : o;
  }
  if (e.evaluater)
    return e.evaluater.evaluateExpression(r);
  oe(e);
}
function oe(e, n) {
  const t = new O(
    "Cannot handle MDX estrees without `createEvaluater`",
    {
      ancestors: e.ancestors,
      place: n,
      ruleId: "mdx-estree",
      source: "hast-util-to-jsx-runtime"
    }
  );
  throw t.file = e.filePath || void 0, t.url = ct + "#cannot-handle-mdx-estrees-without-createevaluater", t;
}
function io(e) {
  const n = {};
  let t;
  for (t in e)
    Ke.call(e, t) && (n[so(t)] = e[t]);
  return n;
}
function so(e) {
  let n = e.replace(qr, ao);
  return n.slice(0, 3) === "ms-" && (n = "-" + n), n;
}
function ao(e) {
  return "-" + e.toLowerCase();
}
const bl = {
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
}, Cn = document.createElement("i");
function El(e) {
  const n = "&" + e + ";";
  Cn.innerHTML = n;
  const t = Cn.textContent;
  return t.charCodeAt(t.length - 1) === 59 && e !== "semi" || t === n ? !1 : t;
}
const uo = {
  tokenize: co
};
function co(e) {
  const n = e.attempt(this.parser.constructs.contentInitial, r, o);
  let t;
  return n;
  function r(s) {
    if (s === null) {
      e.consume(s);
      return;
    }
    return e.enter("lineEnding"), e.consume(s), e.exit("lineEnding"), qe(e, n, "linePrefix");
  }
  function o(s) {
    return e.enter("paragraph"), l(s);
  }
  function l(s) {
    const u = e.enter("chunkText", {
      contentType: "text",
      previous: t
    });
    return t && (t.next = u), t = u, i(s);
  }
  function i(s) {
    if (s === null) {
      e.exit("chunkText"), e.exit("paragraph"), e.consume(s);
      return;
    }
    return Xe(s) ? (e.consume(s), e.exit("chunkText"), l) : (e.consume(s), i);
  }
}
const fo = {
  tokenize: po
}, Pn = {
  tokenize: ho
};
function po(e) {
  const n = this, t = [];
  let r = 0, o, l, i;
  return s;
  function s(h) {
    if (r < t.length) {
      const A = t[r];
      return n.containerState = A[1], e.attempt(A[0].continuation, u, a)(h);
    }
    return a(h);
  }
  function u(h) {
    if (r++, n.containerState._closeFlow) {
      n.containerState._closeFlow = void 0, o && C();
      const A = n.events.length;
      let _ = A, R;
      for (; _--; )
        if (n.events[_][0] === "exit" && n.events[_][1].type === "chunkFlow") {
          R = n.events[_][1].end;
          break;
        }
      b(r);
      let L = A;
      for (; L < n.events.length; )
        n.events[L][1].end = {
          ...R
        }, L++;
      return je(n.events, _ + 1, 0, n.events.slice(A)), n.events.length = L, a(h);
    }
    return s(h);
  }
  function a(h) {
    if (r === t.length) {
      if (!o)
        return d(h);
      if (o.currentConstruct && o.currentConstruct.concrete)
        return v(h);
      n.interrupt = !!(o.currentConstruct && !o._gfmTableDynamicInterruptHack);
    }
    return n.containerState = {}, e.check(Pn, c, f)(h);
  }
  function c(h) {
    return o && C(), b(r), d(h);
  }
  function f(h) {
    return n.parser.lazy[n.now().line] = r !== t.length, i = n.now().offset, v(h);
  }
  function d(h) {
    return n.containerState = {}, e.attempt(Pn, m, v)(h);
  }
  function m(h) {
    return r++, t.push([n.currentConstruct, n.containerState]), d(h);
  }
  function v(h) {
    if (h === null) {
      o && C(), b(0), e.consume(h);
      return;
    }
    return o = o || n.parser.flow(n.now()), e.enter("chunkFlow", {
      _tokenizer: o,
      contentType: "flow",
      previous: l
    }), E(h);
  }
  function E(h) {
    if (h === null) {
      x(e.exit("chunkFlow"), !0), b(0), e.consume(h);
      return;
    }
    return Xe(h) ? (e.consume(h), x(e.exit("chunkFlow")), r = 0, n.interrupt = void 0, s) : (e.consume(h), E);
  }
  function x(h, A) {
    const _ = n.sliceStream(h);
    if (A && _.push(null), h.previous = l, l && (l.next = h), l = h, o.defineSkip(h.start), o.write(_), n.parser.lazy[h.start.line]) {
      let R = o.events.length;
      for (; R--; )
        if (
          // The token starts before the line ending…
          o.events[R][1].start.offset < i && // …and either is not ended yet…
          (!o.events[R][1].end || // …or ends after it.
          o.events[R][1].end.offset > i)
        )
          return;
      const L = n.events.length;
      let j = L, $, V;
      for (; j--; )
        if (n.events[j][0] === "exit" && n.events[j][1].type === "chunkFlow") {
          if ($) {
            V = n.events[j][1].end;
            break;
          }
          $ = !0;
        }
      for (b(r), R = L; R < n.events.length; )
        n.events[R][1].end = {
          ...V
        }, R++;
      je(n.events, j + 1, 0, n.events.slice(L)), n.events.length = R;
    }
  }
  function b(h) {
    let A = t.length;
    for (; A-- > h; ) {
      const _ = t[A];
      n.containerState = _[1], _[0].exit.call(n, e);
    }
    t.length = h;
  }
  function C() {
    o.write([null]), l = void 0, o = void 0, n.containerState._closeFlow = void 0;
  }
}
function ho(e, n, t) {
  return qe(e, e.attempt(this.parser.constructs.document, n, t), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}
const mo = {
  tokenize: go
};
function go(e) {
  const n = this, t = e.attempt(
    // Try to parse a blank line.
    Ot,
    r,
    // Try to parse initial flow (essentially, only code).
    e.attempt(this.parser.constructs.flowInitial, o, qe(e, e.attempt(this.parser.constructs.flow, o, e.attempt(Lt, o)), "linePrefix"))
  );
  return t;
  function r(l) {
    if (l === null) {
      e.consume(l);
      return;
    }
    return e.enter("lineEndingBlank"), e.consume(l), e.exit("lineEndingBlank"), n.currentConstruct = void 0, t;
  }
  function o(l) {
    if (l === null) {
      e.consume(l);
      return;
    }
    return e.enter("lineEnding"), e.consume(l), e.exit("lineEnding"), n.currentConstruct = void 0, t;
  }
}
const yo = {
  resolveAll: mt()
}, wo = ht("string"), xo = ht("text");
function ht(e) {
  return {
    resolveAll: mt(e === "text" ? bo : void 0),
    tokenize: n
  };
  function n(t) {
    const r = this, o = this.parser.constructs[e], l = t.attempt(o, i, s);
    return i;
    function i(c) {
      return a(c) ? l(c) : s(c);
    }
    function s(c) {
      if (c === null) {
        t.consume(c);
        return;
      }
      return t.enter("data"), t.consume(c), u;
    }
    function u(c) {
      return a(c) ? (t.exit("data"), l(c)) : (t.consume(c), u);
    }
    function a(c) {
      if (c === null)
        return !0;
      const f = o[c];
      let d = -1;
      if (f)
        for (; ++d < f.length; ) {
          const m = f[d];
          if (!m.previous || m.previous.call(r, r.previous))
            return !0;
        }
      return !1;
    }
  }
}
function mt(e) {
  return n;
  function n(t, r) {
    let o = -1, l;
    for (; ++o <= t.length; )
      l === void 0 ? t[o] && t[o][1].type === "data" && (l = o, o++) : (!t[o] || t[o][1].type !== "data") && (o !== l + 2 && (t[l][1].end = t[o - 1][1].end, t.splice(l + 2, o - l - 2), o = l + 2), l = void 0);
    return e ? e(t, r) : t;
  }
}
function bo(e, n) {
  let t = 0;
  for (; ++t <= e.length; )
    if ((t === e.length || e[t][1].type === "lineEnding") && e[t - 1][1].type === "data") {
      const r = e[t - 1][1], o = n.sliceStream(r);
      let l = o.length, i = -1, s = 0, u;
      for (; l--; ) {
        const a = o[l];
        if (typeof a == "string") {
          for (i = a.length; a.charCodeAt(i - 1) === 32; )
            s++, i--;
          if (i) break;
          i = -1;
        } else if (a === -2)
          u = !0, s++;
        else if (a !== -1) {
          l++;
          break;
        }
      }
      if (n._contentTypeTextTrailing && t === e.length && (s = 0), s) {
        const a = {
          type: t === e.length || u || s < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            _bufferIndex: l ? i : r.start._bufferIndex + i,
            _index: r.start._index + l,
            line: r.end.line,
            column: r.end.column - s,
            offset: r.end.offset - s
          },
          end: {
            ...r.end
          }
        };
        r.end = {
          ...a.start
        }, r.start.offset === r.end.offset ? Object.assign(r, a) : (e.splice(t, 0, ["enter", a, n], ["exit", a, n]), t += 2);
      }
      t++;
    }
  return e;
}
const Eo = {
  42: F,
  43: F,
  45: F,
  48: F,
  49: F,
  50: F,
  51: F,
  52: F,
  53: F,
  54: F,
  55: F,
  56: F,
  57: F,
  62: jt
}, So = {
  91: Dt
}, vo = {
  [-2]: Ee,
  [-1]: Ee,
  32: Ee
}, ko = {
  35: zt,
  42: be,
  45: [cn, be],
  60: Mt,
  61: cn,
  95: be,
  96: un,
  126: un
}, Co = {
  38: $n,
  92: Vn
}, Po = {
  [-5]: Se,
  [-4]: Se,
  [-3]: Se,
  33: Ht,
  38: $n,
  42: Me,
  60: [Vt, $t],
  91: Ut,
  92: [Bt, Vn],
  93: Nt,
  95: Me,
  96: Ft
}, _o = {
  null: [Me, yo]
}, Ao = {
  null: [42, 95]
}, Ro = {
  null: []
}, To = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  attentionMarkers: Ao,
  contentInitial: So,
  disable: Ro,
  document: Eo,
  flow: ko,
  flowInitial: vo,
  insideSpan: _o,
  string: Co,
  text: Po
}, Symbol.toStringTag, { value: "Module" }));
function Io(e, n, t) {
  let r = {
    _bufferIndex: -1,
    _index: 0,
    line: t && t.line || 1,
    column: t && t.column || 1,
    offset: t && t.offset || 0
  };
  const o = {}, l = [];
  let i = [], s = [];
  const u = {
    attempt: L(_),
    check: L(R),
    consume: C,
    enter: h,
    exit: A,
    interrupt: L(R, {
      interrupt: !0
    })
  }, a = {
    code: null,
    containerState: {},
    defineSkip: E,
    events: [],
    now: v,
    parser: e,
    previous: null,
    sliceSerialize: d,
    sliceStream: m,
    write: f
  };
  let c = n.tokenize.call(a, u);
  return n.resolveAll && l.push(n), a;
  function f(w) {
    return i = qt(i, w), x(), i[i.length - 1] !== null ? [] : (j(n, 0), a.events = Xt(l, a.events, a), a.events);
  }
  function d(w, k) {
    return Lo(m(w), k);
  }
  function m(w) {
    return Oo(i, w);
  }
  function v() {
    const {
      _bufferIndex: w,
      _index: k,
      line: z,
      column: S,
      offset: y
    } = r;
    return {
      _bufferIndex: w,
      _index: k,
      line: z,
      column: S,
      offset: y
    };
  }
  function E(w) {
    o[w.line] = w.column, V();
  }
  function x() {
    let w;
    for (; r._index < i.length; ) {
      const k = i[r._index];
      if (typeof k == "string")
        for (w = r._index, r._bufferIndex < 0 && (r._bufferIndex = 0); r._index === w && r._bufferIndex < k.length; )
          b(k.charCodeAt(r._bufferIndex));
      else
        b(k);
    }
  }
  function b(w) {
    c = c(w);
  }
  function C(w) {
    Xe(w) ? (r.line++, r.column = 1, r.offset += w === -3 ? 2 : 1, V()) : w !== -1 && (r.column++, r.offset++), r._bufferIndex < 0 ? r._index++ : (r._bufferIndex++, r._bufferIndex === // Points w/ non-negative `_bufferIndex` reference
    // strings.
    /** @type {string} */
    i[r._index].length && (r._bufferIndex = -1, r._index++)), a.previous = w;
  }
  function h(w, k) {
    const z = k || {};
    return z.type = w, z.start = v(), a.events.push(["enter", z, a]), s.push(z), z;
  }
  function A(w) {
    const k = s.pop();
    return k.end = v(), a.events.push(["exit", k, a]), k;
  }
  function _(w, k) {
    j(w, k.from);
  }
  function R(w, k) {
    k.restore();
  }
  function L(w, k) {
    return z;
    function z(S, y, I) {
      let Q, se, on, ye;
      return Array.isArray(S) ? (
        /* c8 ignore next 1 */
        we(S)
      ) : "tokenize" in S ? (
        // Looks like a construct.
        we([
          /** @type {Construct} */
          S
        ])
      ) : bt(S);
      function bt(D) {
        return xe;
        function xe(J) {
          const ae = J !== null && D[J], ue = J !== null && D.null, St = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...Array.isArray(ae) ? ae : ae ? [ae] : [],
            ...Array.isArray(ue) ? ue : ue ? [ue] : []
          ];
          return we(St)(J);
        }
      }
      function we(D) {
        return Q = D, se = 0, D.length === 0 ? I : ln(D[se]);
      }
      function ln(D) {
        return xe;
        function xe(J) {
          return ye = $(), on = D, D.partial || (a.currentConstruct = D), D.name && a.parser.constructs.disable.null.includes(D.name) ? sn() : D.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            k ? Object.assign(Object.create(a), k) : a,
            u,
            Et,
            sn
          )(J);
        }
      }
      function Et(D) {
        return w(on, ye), y;
      }
      function sn(D) {
        return ye.restore(), ++se < Q.length ? ln(Q[se]) : I;
      }
    }
  }
  function j(w, k) {
    w.resolveAll && !l.includes(w) && l.push(w), w.resolve && je(a.events, k, a.events.length - k, w.resolve(a.events.slice(k), a)), w.resolveTo && (a.events = w.resolveTo(a.events, a));
  }
  function $() {
    const w = v(), k = a.previous, z = a.currentConstruct, S = a.events.length, y = Array.from(s);
    return {
      from: S,
      restore: I
    };
    function I() {
      r = w, a.previous = k, a.currentConstruct = z, a.events.length = S, s = y, V();
    }
  }
  function V() {
    r.line in o && r.column < 2 && (r.column = o[r.line], r.offset += o[r.line] - 1);
  }
}
function Oo(e, n) {
  const t = n.start._index, r = n.start._bufferIndex, o = n.end._index, l = n.end._bufferIndex;
  let i;
  if (t === o)
    i = [e[t].slice(r, l)];
  else {
    if (i = e.slice(t, o), r > -1) {
      const s = i[0];
      typeof s == "string" ? i[0] = s.slice(r) : i.shift();
    }
    l > 0 && i.push(e[o].slice(0, l));
  }
  return i;
}
function Lo(e, n) {
  let t = -1;
  const r = [];
  let o;
  for (; ++t < e.length; ) {
    const l = e[t];
    let i;
    if (typeof l == "string")
      i = l;
    else switch (l) {
      case -5: {
        i = "\r";
        break;
      }
      case -4: {
        i = `
`;
        break;
      }
      case -3: {
        i = `\r
`;
        break;
      }
      case -2: {
        i = n ? " " : "	";
        break;
      }
      case -1: {
        if (!n && o) continue;
        i = " ";
        break;
      }
      default:
        i = String.fromCharCode(l);
    }
    o = l === -2, r.push(i);
  }
  return r.join("");
}
function Sl(e) {
  const r = {
    constructs: (
      /** @type {FullNormalizedExtension} */
      Wt([To, ...(e || {}).extensions || []])
    ),
    content: o(uo),
    defined: [],
    document: o(fo),
    flow: o(mo),
    lazy: {},
    string: o(wo),
    text: o(xo)
  };
  return r;
  function o(l) {
    return i;
    function i(s) {
      return Io(r, l, s);
    }
  }
}
function vl(e) {
  for (; !Jt(e); )
    ;
  return e;
}
const _n = /[\0\t\n\r]/g;
function kl() {
  let e = 1, n = "", t = !0, r;
  return o;
  function o(l, i, s) {
    const u = [];
    let a, c, f, d, m;
    for (l = n + (typeof l == "string" ? l.toString() : new TextDecoder(i || void 0).decode(l)), f = 0, n = "", t && (l.charCodeAt(0) === 65279 && f++, t = void 0); f < l.length; ) {
      if (_n.lastIndex = f, a = _n.exec(l), d = a && a.index !== void 0 ? a.index : l.length, m = l.charCodeAt(d), !a) {
        n = l.slice(f);
        break;
      }
      if (m === 10 && f === d && r)
        u.push(-3), r = void 0;
      else
        switch (r && (u.push(-5), r = void 0), f < d && (u.push(l.slice(f, d)), e += d - f), m) {
          case 0: {
            u.push(65533), e++;
            break;
          }
          case 9: {
            for (c = Math.ceil(e / 4) * 4, u.push(-2); e++ < c; ) u.push(-1);
            break;
          }
          case 10: {
            u.push(-4), e = 1;
            break;
          }
          default:
            r = !0, e = 1;
        }
      f = d + 1;
    }
    return s && (r && u.push(-5), n && u.push(n), u.push(null)), u;
  }
}
const An = 9, Rn = 32;
function Cl(e) {
  const n = String(e), t = /\r?\n|\r/g;
  let r = t.exec(n), o = 0;
  const l = [];
  for (; r; )
    l.push(
      Tn(n.slice(o, r.index), o > 0, !0),
      r[0]
    ), o = r.index + r[0].length, r = t.exec(n);
  return l.push(Tn(n.slice(o), o > 0, !1)), l.join("");
}
function Tn(e, n, t) {
  let r = 0, o = e.length;
  if (n) {
    let l = e.codePointAt(r);
    for (; l === An || l === Rn; )
      r++, l = e.codePointAt(r);
  }
  if (t) {
    let l = e.codePointAt(o - 1);
    for (; l === An || l === Rn; )
      o--, l = e.codePointAt(o - 1);
  }
  return o > r ? e.slice(r, o) : "";
}
const gt = -1, ge = 0, re = 1, he = 2, Qe = 3, en = 4, nn = 5, tn = 6, yt = 7, wt = 8, xt = typeof self == "object" ? self : globalThis, In = (e, n) => {
  switch (e) {
    case "Function":
    case "SharedWorker":
    case "Worker":
    case "eval":
    case "setInterval":
    case "setTimeout":
      throw new TypeError("unable to deserialize " + e);
  }
  return new xt[e](n);
}, Do = (e, n) => {
  const t = (o, l) => (e.set(l, o), o), r = (o) => {
    if (e.has(o))
      return e.get(o);
    const [l, i] = n[o];
    switch (l) {
      case ge:
      case gt:
        return t(i, o);
      case re: {
        const s = t([], o);
        for (const u of i)
          s.push(r(u));
        return s;
      }
      case he: {
        const s = t({}, o);
        for (const [u, a] of i)
          s[r(u)] = r(a);
        return s;
      }
      case Qe:
        return t(new Date(i), o);
      case en: {
        const { source: s, flags: u } = i;
        return t(new RegExp(s, u), o);
      }
      case nn: {
        const s = t(/* @__PURE__ */ new Map(), o);
        for (const [u, a] of i)
          s.set(r(u), r(a));
        return s;
      }
      case tn: {
        const s = t(/* @__PURE__ */ new Set(), o);
        for (const u of i)
          s.add(r(u));
        return s;
      }
      case yt: {
        const { name: s, message: u } = i;
        return t(
          typeof xt[s] == "function" ? In(s, u) : new Error(u),
          o
        );
      }
      case wt:
        return t(BigInt(i), o);
      case "BigInt":
        return t(Object(BigInt(i)), o);
      case "ArrayBuffer":
        return t(new Uint8Array(i).buffer, i);
      case "DataView": {
        const { buffer: s } = new Uint8Array(i);
        return t(new DataView(s), i);
      }
    }
    return t(In(l, i), o);
  };
  return r;
}, On = (e) => Do(/* @__PURE__ */ new Map(), e)(0), q = "", { toString: jo } = {}, { keys: Mo } = Object, te = (e) => {
  const n = typeof e;
  if (n !== "object" || !e)
    return [ge, n];
  const t = jo.call(e).slice(8, -1);
  switch (t) {
    case "Array":
      return [re, q];
    case "Object":
      return [he, q];
    case "Date":
      return [Qe, q];
    case "RegExp":
      return [en, q];
    case "Map":
      return [nn, q];
    case "Set":
      return [tn, q];
    case "DataView":
      return [re, t];
  }
  return t.includes("Array") ? [re, t] : e instanceof Error ? [yt, e.name || "Error"] : [he, t];
}, fe = ([e, n]) => e === ge && (n === "function" || n === "symbol"), zo = (e, n, t, r) => {
  const o = (i, s) => {
    const u = r.push(i) - 1;
    return t.set(s, u), u;
  }, l = (i) => {
    if (t.has(i))
      return t.get(i);
    let [s, u] = te(i);
    switch (s) {
      case ge: {
        let c = i;
        switch (u) {
          case "bigint":
            s = wt, c = i.toString();
            break;
          case "function":
          case "symbol":
            if (e)
              throw new TypeError("unable to serialize " + u);
            c = null;
            break;
          case "undefined":
            return o([gt], i);
        }
        return o([s, c], i);
      }
      case re: {
        if (u) {
          let d = i;
          return u === "DataView" ? d = new Uint8Array(i.buffer) : u === "ArrayBuffer" && (d = new Uint8Array(i)), o([u, [...d]], i);
        }
        const c = [], f = o([s, c], i);
        for (const d of i)
          c.push(l(d));
        return f;
      }
      case he: {
        if (u)
          switch (u) {
            case "BigInt":
              return o([u, i.toString()], i);
            case "Boolean":
            case "Number":
            case "String":
              return o([u, i.valueOf()], i);
          }
        if (n && "toJSON" in i)
          return l(i.toJSON());
        const c = [], f = o([s, c], i);
        for (const d of Mo(i))
          (e || !fe(te(i[d]))) && c.push([l(d), l(i[d])]);
        return f;
      }
      case Qe:
        return o([s, isNaN(i.getTime()) ? q : i.toISOString()], i);
      case en: {
        const { source: c, flags: f } = i;
        return o([s, { source: c, flags: f }], i);
      }
      case nn: {
        const c = [], f = o([s, c], i);
        for (const [d, m] of i)
          (e || !(fe(te(d)) || fe(te(m)))) && c.push([l(d), l(m)]);
        return f;
      }
      case tn: {
        const c = [], f = o([s, c], i);
        for (const d of i)
          (e || !fe(te(d))) && c.push(l(d));
        return f;
      }
    }
    const { message: a } = i;
    return o([s, { name: u, message: a }], i);
  };
  return l;
}, Ln = (e, { json: n, lossy: t } = {}) => {
  const r = [];
  return zo(!(n || t), !!n, /* @__PURE__ */ new Map(), r)(e), r;
}, Pl = typeof structuredClone == "function" ? (
  /* c8 ignore start */
  (e, n) => n && ("json" in n || "lossy" in n) ? On(Ln(e, n)) : structuredClone(e)
) : (e, n) => On(Ln(e, n));
function Dn(e) {
  if (e)
    throw e;
}
var Pe, jn;
function Fo() {
  if (jn) return Pe;
  jn = 1;
  var e = Object.prototype.hasOwnProperty, n = Object.prototype.toString, t = Object.defineProperty, r = Object.getOwnPropertyDescriptor, o = function(a) {
    return typeof Array.isArray == "function" ? Array.isArray(a) : n.call(a) === "[object Array]";
  }, l = function(a) {
    if (!a || n.call(a) !== "[object Object]")
      return !1;
    var c = e.call(a, "constructor"), f = a.constructor && a.constructor.prototype && e.call(a.constructor.prototype, "isPrototypeOf");
    if (a.constructor && !c && !f)
      return !1;
    var d;
    for (d in a)
      ;
    return typeof d > "u" || e.call(a, d);
  }, i = function(a, c) {
    t && c.name === "__proto__" ? t(a, c.name, {
      enumerable: !0,
      configurable: !0,
      value: c.newValue,
      writable: !0
    }) : a[c.name] = c.newValue;
  }, s = function(a, c) {
    if (c === "__proto__")
      if (e.call(a, c)) {
        if (r)
          return r(a, c).value;
      } else return;
    return a[c];
  };
  return Pe = function u() {
    var a, c, f, d, m, v, E = arguments[0], x = 1, b = arguments.length, C = !1;
    for (typeof E == "boolean" && (C = E, E = arguments[1] || {}, x = 2), (E == null || typeof E != "object" && typeof E != "function") && (E = {}); x < b; ++x)
      if (a = arguments[x], a != null)
        for (c in a)
          f = s(E, c), d = s(a, c), E !== d && (C && d && (l(d) || (m = o(d))) ? (m ? (m = !1, v = f && o(f) ? f : []) : v = f && l(f) ? f : {}, i(E, { name: c, newValue: u(C, v, d) })) : typeof d < "u" && i(E, { name: c, newValue: d }));
    return E;
  }, Pe;
}
var No = Fo();
const _e = /* @__PURE__ */ me(No);
function $e(e) {
  if (typeof e != "object" || e === null)
    return !1;
  const n = Object.getPrototypeOf(e);
  return (n === null || n === Object.prototype || Object.getPrototypeOf(n) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
function Bo() {
  const e = [], n = { run: t, use: r };
  return n;
  function t(...o) {
    let l = -1;
    const i = o.pop();
    if (typeof i != "function")
      throw new TypeError("Expected function as last argument, not " + i);
    s(null, ...o);
    function s(u, ...a) {
      const c = e[++l];
      let f = -1;
      if (u) {
        i(u);
        return;
      }
      for (; ++f < o.length; )
        (a[f] === null || a[f] === void 0) && (a[f] = o[f]);
      o = a, c ? Uo(c, s)(...a) : i(null, ...a);
    }
  }
  function r(o) {
    if (typeof o != "function")
      throw new TypeError(
        "Expected `middelware` to be a function, not " + o
      );
    return e.push(o), n;
  }
}
function Uo(e, n) {
  let t;
  return r;
  function r(...i) {
    const s = e.length > i.length;
    let u;
    s && i.push(o);
    try {
      u = e.apply(this, i);
    } catch (a) {
      const c = (
        /** @type {Error} */
        a
      );
      if (s && t)
        throw c;
      return o(c);
    }
    s || (u && u.then && typeof u.then == "function" ? u.then(l, o) : u instanceof Error ? o(u) : l(u));
  }
  function o(i, ...s) {
    t || (t = !0, n(i, ...s));
  }
  function l(i) {
    o(null, i);
  }
}
const U = { basename: Vo, dirname: $o, extname: Ho, join: qo, sep: "/" };
function Vo(e, n) {
  if (n !== void 0 && typeof n != "string")
    throw new TypeError('"ext" argument must be a string');
  ie(e);
  let t = 0, r = -1, o = e.length, l;
  if (n === void 0 || n.length === 0 || n.length > e.length) {
    for (; o--; )
      if (e.codePointAt(o) === 47) {
        if (l) {
          t = o + 1;
          break;
        }
      } else r < 0 && (l = !0, r = o + 1);
    return r < 0 ? "" : e.slice(t, r);
  }
  if (n === e)
    return "";
  let i = -1, s = n.length - 1;
  for (; o--; )
    if (e.codePointAt(o) === 47) {
      if (l) {
        t = o + 1;
        break;
      }
    } else
      i < 0 && (l = !0, i = o + 1), s > -1 && (e.codePointAt(o) === n.codePointAt(s--) ? s < 0 && (r = o) : (s = -1, r = i));
  return t === r ? r = i : r < 0 && (r = e.length), e.slice(t, r);
}
function $o(e) {
  if (ie(e), e.length === 0)
    return ".";
  let n = -1, t = e.length, r;
  for (; --t; )
    if (e.codePointAt(t) === 47) {
      if (r) {
        n = t;
        break;
      }
    } else r || (r = !0);
  return n < 0 ? e.codePointAt(0) === 47 ? "/" : "." : n === 1 && e.codePointAt(0) === 47 ? "//" : e.slice(0, n);
}
function Ho(e) {
  ie(e);
  let n = e.length, t = -1, r = 0, o = -1, l = 0, i;
  for (; n--; ) {
    const s = e.codePointAt(n);
    if (s === 47) {
      if (i) {
        r = n + 1;
        break;
      }
      continue;
    }
    t < 0 && (i = !0, t = n + 1), s === 46 ? o < 0 ? o = n : l !== 1 && (l = 1) : o > -1 && (l = -1);
  }
  return o < 0 || t < 0 || // We saw a non-dot character immediately before the dot.
  l === 0 || // The (right-most) trimmed path component is exactly `..`.
  l === 1 && o === t - 1 && o === r + 1 ? "" : e.slice(o, t);
}
function qo(...e) {
  let n = -1, t;
  for (; ++n < e.length; )
    ie(e[n]), e[n] && (t = t === void 0 ? e[n] : t + "/" + e[n]);
  return t === void 0 ? "." : Xo(t);
}
function Xo(e) {
  ie(e);
  const n = e.codePointAt(0) === 47;
  let t = Wo(e, !n);
  return t.length === 0 && !n && (t = "."), t.length > 0 && e.codePointAt(e.length - 1) === 47 && (t += "/"), n ? "/" + t : t;
}
function Wo(e, n) {
  let t = "", r = 0, o = -1, l = 0, i = -1, s, u;
  for (; ++i <= e.length; ) {
    if (i < e.length)
      s = e.codePointAt(i);
    else {
      if (s === 47)
        break;
      s = 47;
    }
    if (s === 47) {
      if (!(o === i - 1 || l === 1)) if (o !== i - 1 && l === 2) {
        if (t.length < 2 || r !== 2 || t.codePointAt(t.length - 1) !== 46 || t.codePointAt(t.length - 2) !== 46) {
          if (t.length > 2) {
            if (u = t.lastIndexOf("/"), u !== t.length - 1) {
              u < 0 ? (t = "", r = 0) : (t = t.slice(0, u), r = t.length - 1 - t.lastIndexOf("/")), o = i, l = 0;
              continue;
            }
          } else if (t.length > 0) {
            t = "", r = 0, o = i, l = 0;
            continue;
          }
        }
        n && (t = t.length > 0 ? t + "/.." : "..", r = 2);
      } else
        t.length > 0 ? t += "/" + e.slice(o + 1, i) : t = e.slice(o + 1, i), r = i - o - 1;
      o = i, l = 0;
    } else s === 46 && l > -1 ? l++ : l = -1;
  }
  return t;
}
function ie(e) {
  if (typeof e != "string")
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(e)
    );
}
const Jo = { cwd: Yo };
function Yo() {
  return "/";
}
function He(e) {
  return !!(e !== null && typeof e == "object" && "href" in e && e.href && "protocol" in e && e.protocol && // @ts-expect-error: indexing is fine.
  e.auth === void 0);
}
function Ko(e) {
  if (typeof e == "string")
    e = new URL(e);
  else if (!He(e)) {
    const n = new TypeError(
      'The "path" argument must be of type string or an instance of URL. Received `' + e + "`"
    );
    throw n.code = "ERR_INVALID_ARG_TYPE", n;
  }
  if (e.protocol !== "file:") {
    const n = new TypeError("The URL must be of scheme file");
    throw n.code = "ERR_INVALID_URL_SCHEME", n;
  }
  return Go(e);
}
function Go(e) {
  if (e.hostname !== "") {
    const r = new TypeError(
      'File URL host must be "localhost" or empty on darwin'
    );
    throw r.code = "ERR_INVALID_FILE_URL_HOST", r;
  }
  const n = e.pathname;
  let t = -1;
  for (; ++t < n.length; )
    if (n.codePointAt(t) === 37 && n.codePointAt(t + 1) === 50) {
      const r = n.codePointAt(t + 2);
      if (r === 70 || r === 102) {
        const o = new TypeError(
          "File URL path must not include encoded / characters"
        );
        throw o.code = "ERR_INVALID_FILE_URL_PATH", o;
      }
    }
  return decodeURIComponent(n);
}
const Ae = (
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
class Zo {
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
  constructor(n) {
    let t;
    n ? He(n) ? t = { path: n } : typeof n == "string" || Qo(n) ? t = { value: n } : t = n : t = {}, this.cwd = "cwd" in t ? "" : Jo.cwd(), this.data = {}, this.history = [], this.messages = [], this.value, this.map, this.result, this.stored;
    let r = -1;
    for (; ++r < Ae.length; ) {
      const l = Ae[r];
      l in t && t[l] !== void 0 && t[l] !== null && (this[l] = l === "history" ? [...t[l]] : t[l]);
    }
    let o;
    for (o in t)
      Ae.includes(o) || (this[o] = t[o]);
  }
  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   *
   * @returns {string | undefined}
   *   Basename.
   */
  get basename() {
    return typeof this.path == "string" ? U.basename(this.path) : void 0;
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
  set basename(n) {
    Te(n, "basename"), Re(n, "basename"), this.path = U.join(this.dirname || "", n);
  }
  /**
   * Get the parent path (example: `'~'`).
   *
   * @returns {string | undefined}
   *   Dirname.
   */
  get dirname() {
    return typeof this.path == "string" ? U.dirname(this.path) : void 0;
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
  set dirname(n) {
    Mn(this.basename, "dirname"), this.path = U.join(n || "", this.basename);
  }
  /**
   * Get the extname (including dot) (example: `'.js'`).
   *
   * @returns {string | undefined}
   *   Extname.
   */
  get extname() {
    return typeof this.path == "string" ? U.extname(this.path) : void 0;
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
  set extname(n) {
    if (Re(n, "extname"), Mn(this.dirname, "extname"), n) {
      if (n.codePointAt(0) !== 46)
        throw new Error("`extname` must start with `.`");
      if (n.includes(".", 1))
        throw new Error("`extname` cannot contain multiple dots");
    }
    this.path = U.join(this.dirname, this.stem + (n || ""));
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
  set path(n) {
    He(n) && (n = Ko(n)), Te(n, "path"), this.path !== n && this.history.push(n);
  }
  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   *
   * @returns {string | undefined}
   *   Stem.
   */
  get stem() {
    return typeof this.path == "string" ? U.basename(this.path, this.extname) : void 0;
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
  set stem(n) {
    Te(n, "stem"), Re(n, "stem"), this.path = U.join(this.dirname || "", n + (this.extname || ""));
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
  fail(n, t, r) {
    const o = this.message(n, t, r);
    throw o.fatal = !0, o;
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
  info(n, t, r) {
    const o = this.message(n, t, r);
    return o.fatal = void 0, o;
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
  message(n, t, r) {
    const o = new O(
      // @ts-expect-error: the overloads are fine.
      n,
      t,
      r
    );
    return this.path && (o.name = this.path + ":" + o.name, o.file = this.path), o.fatal = !1, this.messages.push(o), o;
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
  toString(n) {
    return this.value === void 0 ? "" : typeof this.value == "string" ? this.value : new TextDecoder(n || void 0).decode(this.value);
  }
}
function Re(e, n) {
  if (e && e.includes(U.sep))
    throw new Error(
      "`" + n + "` cannot be a path: did not expect `" + U.sep + "`"
    );
}
function Te(e, n) {
  if (!e)
    throw new Error("`" + n + "` cannot be empty");
}
function Mn(e, n) {
  if (!e)
    throw new Error("Setting `" + n + "` requires `path` to be set too");
}
function Qo(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
const el = (
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
    ), o = r[e], l = function() {
      return o.apply(l, arguments);
    };
    return Object.setPrototypeOf(l, r), l;
  })
), nl = {}.hasOwnProperty;
class rn extends el {
  /**
   * Create a processor.
   */
  constructor() {
    super("copy"), this.Compiler = void 0, this.Parser = void 0, this.attachers = [], this.compiler = void 0, this.freezeIndex = -1, this.frozen = void 0, this.namespace = {}, this.parser = void 0, this.transformers = Bo();
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
    const n = (
      /** @type {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>} */
      new rn()
    );
    let t = -1;
    for (; ++t < this.attachers.length; ) {
      const r = this.attachers[t];
      n.use(...r);
    }
    return n.data(_e(!0, {}, this.namespace)), n;
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
  data(n, t) {
    return typeof n == "string" ? arguments.length === 2 ? (Le("data", this.frozen), this.namespace[n] = t, this) : nl.call(this.namespace, n) && this.namespace[n] || void 0 : n ? (Le("data", this.frozen), this.namespace = n, this) : this.namespace;
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
    const n = (
      /** @type {Processor} */
      /** @type {unknown} */
      this
    );
    for (; ++this.freezeIndex < this.attachers.length; ) {
      const [t, ...r] = this.attachers[this.freezeIndex];
      if (r[0] === !1)
        continue;
      r[0] === !0 && (r[0] = void 0);
      const o = t.call(n, ...r);
      typeof o == "function" && this.transformers.use(o);
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
  parse(n) {
    this.freeze();
    const t = pe(n), r = this.parser || this.Parser;
    return Ie("parse", r), r(String(t), t);
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
  process(n, t) {
    const r = this;
    return this.freeze(), Ie("process", this.parser || this.Parser), Oe("process", this.compiler || this.Compiler), t ? o(void 0, t) : new Promise(o);
    function o(l, i) {
      const s = pe(n), u = (
        /** @type {HeadTree extends undefined ? Node : HeadTree} */
        /** @type {unknown} */
        r.parse(s)
      );
      r.run(u, s, function(c, f, d) {
        if (c || !f || !d)
          return a(c);
        const m = (
          /** @type {CompileTree extends undefined ? Node : CompileTree} */
          /** @type {unknown} */
          f
        ), v = r.stringify(m, d);
        rl(v) ? d.value = v : d.result = v, a(
          c,
          /** @type {VFileWithOutput<CompileResult>} */
          d
        );
      });
      function a(c, f) {
        c || !f ? i(c) : l ? l(f) : t(void 0, f);
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
  processSync(n) {
    let t = !1, r;
    return this.freeze(), Ie("processSync", this.parser || this.Parser), Oe("processSync", this.compiler || this.Compiler), this.process(n, o), Fn("processSync", "process", t), r;
    function o(l, i) {
      t = !0, Dn(l), r = i;
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
  run(n, t, r) {
    zn(n), this.freeze();
    const o = this.transformers;
    return !r && typeof t == "function" && (r = t, t = void 0), r ? l(void 0, r) : new Promise(l);
    function l(i, s) {
      const u = pe(t);
      o.run(n, u, a);
      function a(c, f, d) {
        const m = (
          /** @type {TailTree extends undefined ? Node : TailTree} */
          f || n
        );
        c ? s(c) : i ? i(m) : r(void 0, m, d);
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
  runSync(n, t) {
    let r = !1, o;
    return this.run(n, t, l), Fn("runSync", "run", r), o;
    function l(i, s) {
      Dn(i), o = s, r = !0;
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
  stringify(n, t) {
    this.freeze();
    const r = pe(t), o = this.compiler || this.Compiler;
    return Oe("stringify", o), zn(n), o(n, r);
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
  use(n, ...t) {
    const r = this.attachers, o = this.namespace;
    if (Le("use", this.frozen), n != null) if (typeof n == "function")
      u(n, t);
    else if (typeof n == "object")
      Array.isArray(n) ? s(n) : i(n);
    else
      throw new TypeError("Expected usable value, not `" + n + "`");
    return this;
    function l(a) {
      if (typeof a == "function")
        u(a, []);
      else if (typeof a == "object")
        if (Array.isArray(a)) {
          const [c, ...f] = (
            /** @type {PluginTuple<Array<unknown>>} */
            a
          );
          u(c, f);
        } else
          i(a);
      else
        throw new TypeError("Expected usable value, not `" + a + "`");
    }
    function i(a) {
      if (!("plugins" in a) && !("settings" in a))
        throw new Error(
          "Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither"
        );
      s(a.plugins), a.settings && (o.settings = _e(!0, o.settings, a.settings));
    }
    function s(a) {
      let c = -1;
      if (a != null) if (Array.isArray(a))
        for (; ++c < a.length; ) {
          const f = a[c];
          l(f);
        }
      else
        throw new TypeError("Expected a list of plugins, not `" + a + "`");
    }
    function u(a, c) {
      let f = -1, d = -1;
      for (; ++f < r.length; )
        if (r[f][0] === a) {
          d = f;
          break;
        }
      if (d === -1)
        r.push([a, ...c]);
      else if (c.length > 0) {
        let [m, ...v] = c;
        const E = r[d][1];
        $e(E) && $e(m) && (m = _e(!0, E, m)), r[d] = [a, m, ...v];
      }
    }
  }
}
const _l = new rn().freeze();
function Ie(e, n) {
  if (typeof n != "function")
    throw new TypeError("Cannot `" + e + "` without `parser`");
}
function Oe(e, n) {
  if (typeof n != "function")
    throw new TypeError("Cannot `" + e + "` without `compiler`");
}
function Le(e, n) {
  if (n)
    throw new Error(
      "Cannot call `" + e + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
    );
}
function zn(e) {
  if (!$e(e) || typeof e.type != "string")
    throw new TypeError("Expected node, got `" + e + "`");
}
function Fn(e, n, t) {
  if (!t)
    throw new Error(
      "`" + e + "` finished async. Use `" + n + "` instead"
    );
}
function pe(e) {
  return tl(e) ? e : new Zo(e);
}
function tl(e) {
  return !!(e && typeof e == "object" && "message" in e && "messages" in e);
}
function rl(e) {
  return typeof e == "string" || ol(e);
}
function ol(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
function Al(e, n) {
  const t = String(e);
  if (typeof n != "string")
    throw new TypeError("Expected character");
  let r = 0, o = t.indexOf(n);
  for (; o !== -1; )
    r++, o = t.indexOf(n, o + n.length);
  return r;
}
function Rl(e) {
  if (typeof e != "string")
    throw new TypeError("Expected a string");
  return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function ll(e) {
  return e.length;
}
function Tl(e, n) {
  const t = n || {}, r = (t.align || []).concat(), o = t.stringLength || ll, l = [], i = [], s = [], u = [];
  let a = 0, c = -1;
  for (; ++c < e.length; ) {
    const E = [], x = [];
    let b = -1;
    for (e[c].length > a && (a = e[c].length); ++b < e[c].length; ) {
      const C = il(e[c][b]);
      if (t.alignDelimiters !== !1) {
        const h = o(C);
        x[b] = h, (u[b] === void 0 || h > u[b]) && (u[b] = h);
      }
      E.push(C);
    }
    i[c] = E, s[c] = x;
  }
  let f = -1;
  if (typeof r == "object" && "length" in r)
    for (; ++f < a; )
      l[f] = Nn(r[f]);
  else {
    const E = Nn(r);
    for (; ++f < a; )
      l[f] = E;
  }
  f = -1;
  const d = [], m = [];
  for (; ++f < a; ) {
    const E = l[f];
    let x = "", b = "";
    E === 99 ? (x = ":", b = ":") : E === 108 ? x = ":" : E === 114 && (b = ":");
    let C = t.alignDelimiters === !1 ? 1 : Math.max(
      1,
      u[f] - x.length - b.length
    );
    const h = x + "-".repeat(C) + b;
    t.alignDelimiters !== !1 && (C = x.length + C + b.length, C > u[f] && (u[f] = C), m[f] = C), d[f] = h;
  }
  i.splice(1, 0, d), s.splice(1, 0, m), c = -1;
  const v = [];
  for (; ++c < i.length; ) {
    const E = i[c], x = s[c];
    f = -1;
    const b = [];
    for (; ++f < a; ) {
      const C = E[f] || "";
      let h = "", A = "";
      if (t.alignDelimiters !== !1) {
        const _ = u[f] - (x[f] || 0), R = l[f];
        R === 114 ? h = " ".repeat(_) : R === 99 ? _ % 2 ? (h = " ".repeat(_ / 2 + 0.5), A = " ".repeat(_ / 2 - 0.5)) : (h = " ".repeat(_ / 2), A = h) : A = " ".repeat(_);
      }
      t.delimiterStart !== !1 && !f && b.push("|"), t.padding !== !1 && // Don’t add the opening space if we’re not aligning and the cell is
      // empty: there will be a closing space.
      !(t.alignDelimiters === !1 && C === "") && (t.delimiterStart !== !1 || f) && b.push(" "), t.alignDelimiters !== !1 && b.push(h), b.push(C), t.alignDelimiters !== !1 && b.push(A), t.padding !== !1 && b.push(" "), (t.delimiterEnd !== !1 || f !== a - 1) && b.push("|");
    }
    v.push(
      t.delimiterEnd === !1 ? b.join("").replace(/ +$/, "") : b.join("")
    );
  }
  return v.join(`
`);
}
function il(e) {
  return e == null ? "" : String(e);
}
function Nn(e) {
  const n = typeof e == "string" ? e.codePointAt(0) : 0;
  return n === 67 || n === 99 ? 99 : n === 76 || n === 108 ? 108 : n === 82 || n === 114 ? 114 : 0;
}
function Il(e, n) {
  const t = String(e);
  let r = t.indexOf(n), o = r, l = 0, i = 0;
  if (typeof n != "string")
    throw new TypeError("Expected substring");
  for (; r !== -1; )
    r === o ? ++l > i && (i = l) : l = 1, o = r + n.length, r = t.indexOf(n, o);
  return i;
}
export {
  ml as P,
  Zo as V,
  hl as a,
  dr as b,
  dl as c,
  wr as d,
  nt as e,
  qn as f,
  gl as g,
  El as h,
  Sl as i,
  kl as j,
  Pl as k,
  _l as l,
  wl as m,
  xl as n,
  bl as o,
  vl as p,
  Rl as q,
  yl as r,
  pl as s,
  Cl as t,
  fl as u,
  Al as v,
  Il as w,
  Tl as x
};
