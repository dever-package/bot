import { c as Aa, j as T, a as ce, F as He } from "./createLucideIcon-Gw0gLVQ5.js";
import { H as ka, R as $a, J as se, u as we, s as Rr, a as ee, b as ne, e as Ce, c as xe, C as sn, E as ut, h as Pa } from "./runtime-entry-CkPHMDB1.js";
import { a as Da, g as za } from "./_commonjsHelpers-CqEciG1_.js";
import { c as Ta } from "./vanilla-Ddg6vX1P.js";
import { c as Ha } from "./react-dom-C2oimP4o.js";
import { m as Ra } from "./runtime-stream-runner-5OE2JsJo.js";
const La = [
  [
    "path",
    {
      d: "M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z",
      key: "nt11vn"
    }
  ],
  [
    "path",
    {
      d: "m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18",
      key: "15qc1e"
    }
  ],
  ["path", { d: "m2.3 2.3 7.286 7.286", key: "1wuzzi" }],
  ["circle", { cx: "11", cy: "11", r: "2", key: "xmgehs" }]
], jg = Aa("pen-tool", La);
function ae(e) {
  if (typeof e == "string" || typeof e == "number") return "" + e;
  let t = "";
  if (Array.isArray(e))
    for (let n = 0, o; n < e.length; n++)
      (o = ae(e[n])) !== "" && (t += (t && " ") + o);
  else
    for (let n in e)
      e[n] && (t += (t && " ") + n);
  return t;
}
var Va = { value: () => {
} };
function an() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new Ft(n);
}
function Ft(e) {
  this._ = e;
}
function Oa(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", r = n.indexOf(".");
    if (r >= 0 && (o = n.slice(r + 1), n = n.slice(0, r)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Ft.prototype = an.prototype = {
  constructor: Ft,
  on: function(e, t) {
    var n = this._, o = Oa(e + "", n), r, i = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++i < s; ) if ((r = (e = o[i]).type) && (r = Ba(n[r], e.name))) return r;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++i < s; )
      if (r = (e = o[i]).type) n[r] = No(n[r], e.name, t);
      else if (t == null) for (r in n) n[r] = No(n[r], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new Ft(e);
  },
  call: function(e, t) {
    if ((r = arguments.length - 2) > 0) for (var n = new Array(r), o = 0, r, i; o < r; ++o) n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (i = this._[e], o = 0, r = i.length; o < r; ++o) i[o].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var o = this._[e], r = 0, i = o.length; r < i; ++r) o[r].value.apply(t, n);
  }
};
function Ba(e, t) {
  for (var n = 0, o = e.length, r; n < o; ++n)
    if ((r = e[n]).name === t)
      return r.value;
}
function No(e, t, n) {
  for (var o = 0, r = e.length; o < r; ++o)
    if (e[o].name === t) {
      e[o] = Va, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var Tn = "http://www.w3.org/1999/xhtml";
const Co = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Tn,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function cn(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), Co.hasOwnProperty(t) ? { space: Co[t], local: e } : e;
}
function Fa(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === Tn && t.documentElement.namespaceURI === Tn ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function Xa(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Lr(e) {
  var t = cn(e);
  return (t.local ? Xa : Fa)(t);
}
function Ya() {
}
function Kn(e) {
  return e == null ? Ya : function() {
    return this.querySelector(e);
  };
}
function Za(e) {
  typeof e != "function" && (e = Kn(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var i = t[r], s = i.length, a = o[r] = new Array(s), l, c, u = 0; u < s; ++u)
      (l = i[u]) && (c = e.call(l, l.__data__, u, i)) && ("__data__" in l && (c.__data__ = l.__data__), a[u] = c);
  return new fe(o, this._parents);
}
function Wa(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function qa() {
  return [];
}
function Vr(e) {
  return e == null ? qa : function() {
    return this.querySelectorAll(e);
  };
}
function Ga(e) {
  return function() {
    return Wa(e.apply(this, arguments));
  };
}
function Ua(e) {
  typeof e == "function" ? e = Ga(e) : e = Vr(e);
  for (var t = this._groups, n = t.length, o = [], r = [], i = 0; i < n; ++i)
    for (var s = t[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && (o.push(e.call(l, l.__data__, c, s)), r.push(l));
  return new fe(o, r);
}
function Or(e) {
  return function() {
    return this.matches(e);
  };
}
function Br(e) {
  return function(t) {
    return t.matches(e);
  };
}
var Ka = Array.prototype.find;
function Qa(e) {
  return function() {
    return Ka.call(this.children, e);
  };
}
function Ja() {
  return this.firstElementChild;
}
function ja(e) {
  return this.select(e == null ? Ja : Qa(typeof e == "function" ? e : Br(e)));
}
var ec = Array.prototype.filter;
function tc() {
  return Array.from(this.children);
}
function nc(e) {
  return function() {
    return ec.call(this.children, e);
  };
}
function oc(e) {
  return this.selectAll(e == null ? tc : nc(typeof e == "function" ? e : Br(e)));
}
function rc(e) {
  typeof e != "function" && (e = Or(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var i = t[r], s = i.length, a = o[r] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new fe(o, this._parents);
}
function Fr(e) {
  return new Array(e.length);
}
function ic() {
  return new fe(this._enter || this._groups.map(Fr), this._parents);
}
function qt(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
qt.prototype = {
  constructor: qt,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function sc(e) {
  return function() {
    return e;
  };
}
function ac(e, t, n, o, r, i) {
  for (var s = 0, a, l = t.length, c = i.length; s < c; ++s)
    (a = t[s]) ? (a.__data__ = i[s], o[s] = a) : n[s] = new qt(e, i[s]);
  for (; s < l; ++s)
    (a = t[s]) && (r[s] = a);
}
function cc(e, t, n, o, r, i, s) {
  var a, l, c = /* @__PURE__ */ new Map(), u = t.length, d = i.length, f = new Array(u), h;
  for (a = 0; a < u; ++a)
    (l = t[a]) && (f[a] = h = s.call(l, l.__data__, a, t) + "", c.has(h) ? r[a] = l : c.set(h, l));
  for (a = 0; a < d; ++a)
    h = s.call(e, i[a], a, i) + "", (l = c.get(h)) ? (o[a] = l, l.__data__ = i[a], c.delete(h)) : n[a] = new qt(e, i[a]);
  for (a = 0; a < u; ++a)
    (l = t[a]) && c.get(f[a]) === l && (r[a] = l);
}
function lc(e) {
  return e.__data__;
}
function uc(e, t) {
  if (!arguments.length) return Array.from(this, lc);
  var n = t ? cc : ac, o = this._parents, r = this._groups;
  typeof e != "function" && (e = sc(e));
  for (var i = r.length, s = new Array(i), a = new Array(i), l = new Array(i), c = 0; c < i; ++c) {
    var u = o[c], d = r[c], f = d.length, h = dc(e.call(u, u && u.__data__, c, o)), g = h.length, v = a[c] = new Array(g), w = s[c] = new Array(g), m = l[c] = new Array(f);
    n(u, d, v, w, m, h, t);
    for (var _ = 0, p = 0, x, N; _ < g; ++_)
      if (x = v[_]) {
        for (_ >= p && (p = _ + 1); !(N = w[p]) && ++p < g; ) ;
        x._next = N || null;
      }
  }
  return s = new fe(s, o), s._enter = a, s._exit = l, s;
}
function dc(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function fc() {
  return new fe(this._exit || this._groups.map(Fr), this._parents);
}
function hc(e, t, n) {
  var o = this.enter(), r = this, i = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (r = t(r), r && (r = r.selection())), n == null ? i.remove() : n(i), o && r ? o.merge(r).order() : r;
}
function gc(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, r = n.length, i = o.length, s = Math.min(r, i), a = new Array(r), l = 0; l < s; ++l)
    for (var c = n[l], u = o[l], d = c.length, f = a[l] = new Array(d), h, g = 0; g < d; ++g)
      (h = c[g] || u[g]) && (f[g] = h);
  for (; l < r; ++l)
    a[l] = n[l];
  return new fe(a, this._parents);
}
function pc() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], r = o.length - 1, i = o[r], s; --r >= 0; )
      (s = o[r]) && (i && s.compareDocumentPosition(i) ^ 4 && i.parentNode.insertBefore(s, i), i = s);
  return this;
}
function mc(e) {
  e || (e = yc);
  function t(d, f) {
    return d && f ? e(d.__data__, f.__data__) : !d - !f;
  }
  for (var n = this._groups, o = n.length, r = new Array(o), i = 0; i < o; ++i) {
    for (var s = n[i], a = s.length, l = r[i] = new Array(a), c, u = 0; u < a; ++u)
      (c = s[u]) && (l[u] = c);
    l.sort(t);
  }
  return new fe(r, this._parents).order();
}
function yc(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function wc() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function xc() {
  return Array.from(this);
}
function vc() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], r = 0, i = o.length; r < i; ++r) {
      var s = o[r];
      if (s) return s;
    }
  return null;
}
function bc() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function _c() {
  return !this.node();
}
function Sc(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var r = t[n], i = 0, s = r.length, a; i < s; ++i)
      (a = r[i]) && e.call(a, a.__data__, i, r);
  return this;
}
function Ec(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Nc(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Cc(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function Mc(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function Ic(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function Ac(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function kc(e, t) {
  var n = cn(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? Nc : Ec : typeof t == "function" ? n.local ? Ac : Ic : n.local ? Mc : Cc)(n, t));
}
function Xr(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function $c(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Pc(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function Dc(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function zc(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? $c : typeof t == "function" ? Dc : Pc)(e, t, n ?? "")) : rt(this.node(), e);
}
function rt(e, t) {
  return e.style.getPropertyValue(t) || Xr(e).getComputedStyle(e, null).getPropertyValue(t);
}
function Tc(e) {
  return function() {
    delete this[e];
  };
}
function Hc(e, t) {
  return function() {
    this[e] = t;
  };
}
function Rc(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function Lc(e, t) {
  return arguments.length > 1 ? this.each((t == null ? Tc : typeof t == "function" ? Rc : Hc)(e, t)) : this.node()[e];
}
function Yr(e) {
  return e.trim().split(/^|\s+/);
}
function Qn(e) {
  return e.classList || new Zr(e);
}
function Zr(e) {
  this._node = e, this._names = Yr(e.getAttribute("class") || "");
}
Zr.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function Wr(e, t) {
  for (var n = Qn(e), o = -1, r = t.length; ++o < r; ) n.add(t[o]);
}
function qr(e, t) {
  for (var n = Qn(e), o = -1, r = t.length; ++o < r; ) n.remove(t[o]);
}
function Vc(e) {
  return function() {
    Wr(this, e);
  };
}
function Oc(e) {
  return function() {
    qr(this, e);
  };
}
function Bc(e, t) {
  return function() {
    (t.apply(this, arguments) ? Wr : qr)(this, e);
  };
}
function Fc(e, t) {
  var n = Yr(e + "");
  if (arguments.length < 2) {
    for (var o = Qn(this.node()), r = -1, i = n.length; ++r < i; ) if (!o.contains(n[r])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? Bc : t ? Vc : Oc)(n, t));
}
function Xc() {
  this.textContent = "";
}
function Yc(e) {
  return function() {
    this.textContent = e;
  };
}
function Zc(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function Wc(e) {
  return arguments.length ? this.each(e == null ? Xc : (typeof e == "function" ? Zc : Yc)(e)) : this.node().textContent;
}
function qc() {
  this.innerHTML = "";
}
function Gc(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Uc(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Kc(e) {
  return arguments.length ? this.each(e == null ? qc : (typeof e == "function" ? Uc : Gc)(e)) : this.node().innerHTML;
}
function Qc() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Jc() {
  return this.each(Qc);
}
function jc() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function el() {
  return this.each(jc);
}
function tl(e) {
  var t = typeof e == "function" ? e : Lr(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function nl() {
  return null;
}
function ol(e, t) {
  var n = typeof e == "function" ? e : Lr(e), o = t == null ? nl : typeof t == "function" ? t : Kn(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function rl() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function il() {
  return this.each(rl);
}
function sl() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function al() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function cl(e) {
  return this.select(e ? al : sl);
}
function ll(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function ul(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function dl(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function fl(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, r = t.length, i; n < r; ++n)
        i = t[n], (!e.type || i.type === e.type) && i.name === e.name ? this.removeEventListener(i.type, i.listener, i.options) : t[++o] = i;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function hl(e, t, n) {
  return function() {
    var o = this.__on, r, i = ul(t);
    if (o) {
      for (var s = 0, a = o.length; s < a; ++s)
        if ((r = o[s]).type === e.type && r.name === e.name) {
          this.removeEventListener(r.type, r.listener, r.options), this.addEventListener(r.type, r.listener = i, r.options = n), r.value = t;
          return;
        }
    }
    this.addEventListener(e.type, i, n), r = { type: e.type, name: e.name, value: t, listener: i, options: n }, o ? o.push(r) : this.__on = [r];
  };
}
function gl(e, t, n) {
  var o = dl(e + ""), r, i = o.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var l = 0, c = a.length, u; l < c; ++l)
        for (r = 0, u = a[l]; r < i; ++r)
          if ((s = o[r]).type === u.type && s.name === u.name)
            return u.value;
    }
    return;
  }
  for (a = t ? hl : fl, r = 0; r < i; ++r) this.each(a(o[r], t, n));
  return this;
}
function Gr(e, t, n) {
  var o = Xr(e), r = o.CustomEvent;
  typeof r == "function" ? r = new r(t, n) : (r = o.document.createEvent("Event"), n ? (r.initEvent(t, n.bubbles, n.cancelable), r.detail = n.detail) : r.initEvent(t, !1, !1)), e.dispatchEvent(r);
}
function pl(e, t) {
  return function() {
    return Gr(this, e, t);
  };
}
function ml(e, t) {
  return function() {
    return Gr(this, e, t.apply(this, arguments));
  };
}
function yl(e, t) {
  return this.each((typeof t == "function" ? ml : pl)(e, t));
}
function* wl() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], r = 0, i = o.length, s; r < i; ++r)
      (s = o[r]) && (yield s);
}
var Ur = [null];
function fe(e, t) {
  this._groups = e, this._parents = t;
}
function Mt() {
  return new fe([[document.documentElement]], Ur);
}
function xl() {
  return this;
}
fe.prototype = Mt.prototype = {
  constructor: fe,
  select: Za,
  selectAll: Ua,
  selectChild: ja,
  selectChildren: oc,
  filter: rc,
  data: uc,
  enter: ic,
  exit: fc,
  join: hc,
  merge: gc,
  selection: xl,
  order: pc,
  sort: mc,
  call: wc,
  nodes: xc,
  node: vc,
  size: bc,
  empty: _c,
  each: Sc,
  attr: kc,
  style: zc,
  property: Lc,
  classed: Fc,
  text: Wc,
  html: Kc,
  raise: Jc,
  lower: el,
  append: tl,
  insert: ol,
  remove: il,
  clone: cl,
  datum: ll,
  on: gl,
  dispatch: yl,
  [Symbol.iterator]: wl
};
function de(e) {
  return typeof e == "string" ? new fe([[document.querySelector(e)]], [document.documentElement]) : new fe([[e]], Ur);
}
function vl(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function ge(e, t) {
  if (e = vl(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var o = n.createSVGPoint();
      return o.x = e.clientX, o.y = e.clientY, o = o.matrixTransform(t.getScreenCTM().inverse()), [o.x, o.y];
    }
    if (t.getBoundingClientRect) {
      var r = t.getBoundingClientRect();
      return [e.clientX - r.left - t.clientLeft, e.clientY - r.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const bl = { passive: !1 }, wt = { capture: !0, passive: !1 };
function _n(e) {
  e.stopImmediatePropagation();
}
function nt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Kr(e) {
  var t = e.document.documentElement, n = de(e).on("dragstart.drag", nt, wt);
  "onselectstart" in t ? n.on("selectstart.drag", nt, wt) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Qr(e, t) {
  var n = e.document.documentElement, o = de(e).on("dragstart.drag", null);
  t && (o.on("click.drag", nt, wt), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Dt = (e) => () => e;
function Hn(e, {
  sourceEvent: t,
  subject: n,
  target: o,
  identifier: r,
  active: i,
  x: s,
  y: a,
  dx: l,
  dy: c,
  dispatch: u
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: o, enumerable: !0, configurable: !0 },
    identifier: { value: r, enumerable: !0, configurable: !0 },
    active: { value: i, enumerable: !0, configurable: !0 },
    x: { value: s, enumerable: !0, configurable: !0 },
    y: { value: a, enumerable: !0, configurable: !0 },
    dx: { value: l, enumerable: !0, configurable: !0 },
    dy: { value: c, enumerable: !0, configurable: !0 },
    _: { value: u }
  });
}
Hn.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function _l(e) {
  return !e.ctrlKey && !e.button;
}
function Sl() {
  return this.parentNode;
}
function El(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function Nl() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Jr() {
  var e = _l, t = Sl, n = El, o = Nl, r = {}, i = an("start", "drag", "end"), s = 0, a, l, c, u, d = 0;
  function f(x) {
    x.on("mousedown.drag", h).filter(o).on("touchstart.drag", w).on("touchmove.drag", m, bl).on("touchend.drag touchcancel.drag", _).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(x, N) {
    if (!(u || !e.call(this, x, N))) {
      var b = p(this, t.call(this, x, N), x, N, "mouse");
      b && (de(x.view).on("mousemove.drag", g, wt).on("mouseup.drag", v, wt), Kr(x.view), _n(x), c = !1, a = x.clientX, l = x.clientY, b("start", x));
    }
  }
  function g(x) {
    if (nt(x), !c) {
      var N = x.clientX - a, b = x.clientY - l;
      c = N * N + b * b > d;
    }
    r.mouse("drag", x);
  }
  function v(x) {
    de(x.view).on("mousemove.drag mouseup.drag", null), Qr(x.view, c), nt(x), r.mouse("end", x);
  }
  function w(x, N) {
    if (e.call(this, x, N)) {
      var b = x.changedTouches, C = t.call(this, x, N), I = b.length, A, O;
      for (A = 0; A < I; ++A)
        (O = p(this, C, x, N, b[A].identifier, b[A])) && (_n(x), O("start", x, b[A]));
    }
  }
  function m(x) {
    var N = x.changedTouches, b = N.length, C, I;
    for (C = 0; C < b; ++C)
      (I = r[N[C].identifier]) && (nt(x), I("drag", x, N[C]));
  }
  function _(x) {
    var N = x.changedTouches, b = N.length, C, I;
    for (u && clearTimeout(u), u = setTimeout(function() {
      u = null;
    }, 500), C = 0; C < b; ++C)
      (I = r[N[C].identifier]) && (_n(x), I("end", x, N[C]));
  }
  function p(x, N, b, C, I, A) {
    var O = i.copy(), P = ge(A || b, N), R, D, y;
    if ((y = n.call(x, new Hn("beforestart", {
      sourceEvent: b,
      target: f,
      identifier: I,
      active: s,
      x: P[0],
      y: P[1],
      dx: 0,
      dy: 0,
      dispatch: O
    }), C)) != null)
      return R = y.x - P[0] || 0, D = y.y - P[1] || 0, function S(E, M, $) {
        var k = P, V;
        switch (E) {
          case "start":
            r[I] = S, V = s++;
            break;
          case "end":
            delete r[I], --s;
          // falls through
          case "drag":
            P = ge($ || M, N), V = s;
            break;
        }
        O.call(
          E,
          x,
          new Hn(E, {
            sourceEvent: M,
            subject: y,
            target: f,
            identifier: I,
            active: V,
            x: P[0] + R,
            y: P[1] + D,
            dx: P[0] - k[0],
            dy: P[1] - k[1],
            dispatch: O
          }),
          C
        );
      };
  }
  return f.filter = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : Dt(!!x), f) : e;
  }, f.container = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : Dt(x), f) : t;
  }, f.subject = function(x) {
    return arguments.length ? (n = typeof x == "function" ? x : Dt(x), f) : n;
  }, f.touchable = function(x) {
    return arguments.length ? (o = typeof x == "function" ? x : Dt(!!x), f) : o;
  }, f.on = function() {
    var x = i.on.apply(i, arguments);
    return x === i ? f : x;
  }, f.clickDistance = function(x) {
    return arguments.length ? (d = (x = +x) * x, f) : Math.sqrt(d);
  }, f;
}
function Jn(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function jr(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t) n[o] = t[o];
  return n;
}
function It() {
}
var xt = 0.7, Gt = 1 / xt, ot = "\\s*([+-]?\\d+)\\s*", vt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ne = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Cl = /^#([0-9a-f]{3,8})$/, Ml = new RegExp(`^rgb\\(${ot},${ot},${ot}\\)$`), Il = new RegExp(`^rgb\\(${Ne},${Ne},${Ne}\\)$`), Al = new RegExp(`^rgba\\(${ot},${ot},${ot},${vt}\\)$`), kl = new RegExp(`^rgba\\(${Ne},${Ne},${Ne},${vt}\\)$`), $l = new RegExp(`^hsl\\(${vt},${Ne},${Ne}\\)$`), Pl = new RegExp(`^hsla\\(${vt},${Ne},${Ne},${vt}\\)$`), Mo = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
Jn(It, Ge, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Io,
  // Deprecated! Use color.formatHex.
  formatHex: Io,
  formatHex8: Dl,
  formatHsl: zl,
  formatRgb: Ao,
  toString: Ao
});
function Io() {
  return this.rgb().formatHex();
}
function Dl() {
  return this.rgb().formatHex8();
}
function zl() {
  return ei(this).formatHsl();
}
function Ao() {
  return this.rgb().formatRgb();
}
function Ge(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = Cl.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? ko(t) : n === 3 ? new ue(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? zt(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? zt(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Ml.exec(e)) ? new ue(t[1], t[2], t[3], 1) : (t = Il.exec(e)) ? new ue(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Al.exec(e)) ? zt(t[1], t[2], t[3], t[4]) : (t = kl.exec(e)) ? zt(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = $l.exec(e)) ? Do(t[1], t[2] / 100, t[3] / 100, 1) : (t = Pl.exec(e)) ? Do(t[1], t[2] / 100, t[3] / 100, t[4]) : Mo.hasOwnProperty(e) ? ko(Mo[e]) : e === "transparent" ? new ue(NaN, NaN, NaN, 0) : null;
}
function ko(e) {
  return new ue(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function zt(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new ue(e, t, n, o);
}
function Tl(e) {
  return e instanceof It || (e = Ge(e)), e ? (e = e.rgb(), new ue(e.r, e.g, e.b, e.opacity)) : new ue();
}
function Rn(e, t, n, o) {
  return arguments.length === 1 ? Tl(e) : new ue(e, t, n, o ?? 1);
}
function ue(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
Jn(ue, Rn, jr(It, {
  brighter(e) {
    return e = e == null ? Gt : Math.pow(Gt, e), new ue(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? xt : Math.pow(xt, e), new ue(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new ue(We(this.r), We(this.g), We(this.b), Ut(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: $o,
  // Deprecated! Use color.formatHex.
  formatHex: $o,
  formatHex8: Hl,
  formatRgb: Po,
  toString: Po
}));
function $o() {
  return `#${Ze(this.r)}${Ze(this.g)}${Ze(this.b)}`;
}
function Hl() {
  return `#${Ze(this.r)}${Ze(this.g)}${Ze(this.b)}${Ze((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Po() {
  const e = Ut(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${We(this.r)}, ${We(this.g)}, ${We(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Ut(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function We(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Ze(e) {
  return e = We(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Do(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new pe(e, t, n, o);
}
function ei(e) {
  if (e instanceof pe) return new pe(e.h, e.s, e.l, e.opacity);
  if (e instanceof It || (e = Ge(e)), !e) return new pe();
  if (e instanceof pe) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, r = Math.min(t, n, o), i = Math.max(t, n, o), s = NaN, a = i - r, l = (i + r) / 2;
  return a ? (t === i ? s = (n - o) / a + (n < o) * 6 : n === i ? s = (o - t) / a + 2 : s = (t - n) / a + 4, a /= l < 0.5 ? i + r : 2 - i - r, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new pe(s, a, l, e.opacity);
}
function Rl(e, t, n, o) {
  return arguments.length === 1 ? ei(e) : new pe(e, t, n, o ?? 1);
}
function pe(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
Jn(pe, Rl, jr(It, {
  brighter(e) {
    return e = e == null ? Gt : Math.pow(Gt, e), new pe(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? xt : Math.pow(xt, e), new pe(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, r = 2 * n - o;
    return new ue(
      Sn(e >= 240 ? e - 240 : e + 120, r, o),
      Sn(e, r, o),
      Sn(e < 120 ? e + 240 : e - 120, r, o),
      this.opacity
    );
  },
  clamp() {
    return new pe(zo(this.h), Tt(this.s), Tt(this.l), Ut(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Ut(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${zo(this.h)}, ${Tt(this.s) * 100}%, ${Tt(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function zo(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Tt(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Sn(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const jn = (e) => () => e;
function Ll(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function Vl(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function Ol(e) {
  return (e = +e) == 1 ? ti : function(t, n) {
    return n - t ? Vl(t, n, e) : jn(isNaN(t) ? n : t);
  };
}
function ti(e, t) {
  var n = t - e;
  return n ? Ll(e, n) : jn(isNaN(e) ? t : e);
}
const Kt = (function e(t) {
  var n = Ol(t);
  function o(r, i) {
    var s = n((r = Rn(r)).r, (i = Rn(i)).r), a = n(r.g, i.g), l = n(r.b, i.b), c = ti(r.opacity, i.opacity);
    return function(u) {
      return r.r = s(u), r.g = a(u), r.b = l(u), r.opacity = c(u), r + "";
    };
  }
  return o.gamma = e, o;
})(1);
function Bl(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, o = t.slice(), r;
  return function(i) {
    for (r = 0; r < n; ++r) o[r] = e[r] * (1 - i) + t[r] * i;
    return o;
  };
}
function Fl(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Xl(e, t) {
  var n = t ? t.length : 0, o = e ? Math.min(n, e.length) : 0, r = new Array(o), i = new Array(n), s;
  for (s = 0; s < o; ++s) r[s] = mt(e[s], t[s]);
  for (; s < n; ++s) i[s] = t[s];
  return function(a) {
    for (s = 0; s < o; ++s) i[s] = r[s](a);
    return i;
  };
}
function Yl(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(o) {
    return n.setTime(e * (1 - o) + t * o), n;
  };
}
function Ee(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function Zl(e, t) {
  var n = {}, o = {}, r;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (r in t)
    r in e ? n[r] = mt(e[r], t[r]) : o[r] = t[r];
  return function(i) {
    for (r in n) o[r] = n[r](i);
    return o;
  };
}
var Ln = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, En = new RegExp(Ln.source, "g");
function Wl(e) {
  return function() {
    return e;
  };
}
function ql(e) {
  return function(t) {
    return e(t) + "";
  };
}
function ni(e, t) {
  var n = Ln.lastIndex = En.lastIndex = 0, o, r, i, s = -1, a = [], l = [];
  for (e = e + "", t = t + ""; (o = Ln.exec(e)) && (r = En.exec(t)); )
    (i = r.index) > n && (i = t.slice(n, i), a[s] ? a[s] += i : a[++s] = i), (o = o[0]) === (r = r[0]) ? a[s] ? a[s] += r : a[++s] = r : (a[++s] = null, l.push({ i: s, x: Ee(o, r) })), n = En.lastIndex;
  return n < t.length && (i = t.slice(n), a[s] ? a[s] += i : a[++s] = i), a.length < 2 ? l[0] ? ql(l[0].x) : Wl(t) : (t = l.length, function(c) {
    for (var u = 0, d; u < t; ++u) a[(d = l[u]).i] = d.x(c);
    return a.join("");
  });
}
function mt(e, t) {
  var n = typeof t, o;
  return t == null || n === "boolean" ? jn(t) : (n === "number" ? Ee : n === "string" ? (o = Ge(t)) ? (t = o, Kt) : ni : t instanceof Ge ? Kt : t instanceof Date ? Yl : Fl(t) ? Bl : Array.isArray(t) ? Xl : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Zl : Ee)(e, t);
}
var To = 180 / Math.PI, Vn = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function oi(e, t, n, o, r, i) {
  var s, a, l;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (l = e * n + t * o) && (n -= e * l, o -= t * l), (a = Math.sqrt(n * n + o * o)) && (n /= a, o /= a, l /= a), e * o < t * n && (e = -e, t = -t, l = -l, s = -s), {
    translateX: r,
    translateY: i,
    rotate: Math.atan2(t, e) * To,
    skewX: Math.atan(l) * To,
    scaleX: s,
    scaleY: a
  };
}
var Ht;
function Gl(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? Vn : oi(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Ul(e) {
  return e == null || (Ht || (Ht = document.createElementNS("http://www.w3.org/2000/svg", "g")), Ht.setAttribute("transform", e), !(e = Ht.transform.baseVal.consolidate())) ? Vn : (e = e.matrix, oi(e.a, e.b, e.c, e.d, e.e, e.f));
}
function ri(e, t, n, o) {
  function r(c) {
    return c.length ? c.pop() + " " : "";
  }
  function i(c, u, d, f, h, g) {
    if (c !== d || u !== f) {
      var v = h.push("translate(", null, t, null, n);
      g.push({ i: v - 4, x: Ee(c, d) }, { i: v - 2, x: Ee(u, f) });
    } else (d || f) && h.push("translate(" + d + t + f + n);
  }
  function s(c, u, d, f) {
    c !== u ? (c - u > 180 ? u += 360 : u - c > 180 && (c += 360), f.push({ i: d.push(r(d) + "rotate(", null, o) - 2, x: Ee(c, u) })) : u && d.push(r(d) + "rotate(" + u + o);
  }
  function a(c, u, d, f) {
    c !== u ? f.push({ i: d.push(r(d) + "skewX(", null, o) - 2, x: Ee(c, u) }) : u && d.push(r(d) + "skewX(" + u + o);
  }
  function l(c, u, d, f, h, g) {
    if (c !== d || u !== f) {
      var v = h.push(r(h) + "scale(", null, ",", null, ")");
      g.push({ i: v - 4, x: Ee(c, d) }, { i: v - 2, x: Ee(u, f) });
    } else (d !== 1 || f !== 1) && h.push(r(h) + "scale(" + d + "," + f + ")");
  }
  return function(c, u) {
    var d = [], f = [];
    return c = e(c), u = e(u), i(c.translateX, c.translateY, u.translateX, u.translateY, d, f), s(c.rotate, u.rotate, d, f), a(c.skewX, u.skewX, d, f), l(c.scaleX, c.scaleY, u.scaleX, u.scaleY, d, f), c = u = null, function(h) {
      for (var g = -1, v = f.length, w; ++g < v; ) d[(w = f[g]).i] = w.x(h);
      return d.join("");
    };
  };
}
var Kl = ri(Gl, "px, ", "px)", "deg)"), Ql = ri(Ul, ", ", ")", ")"), Jl = 1e-12;
function Ho(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function jl(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function eu(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const Xt = (function e(t, n, o) {
  function r(i, s) {
    var a = i[0], l = i[1], c = i[2], u = s[0], d = s[1], f = s[2], h = u - a, g = d - l, v = h * h + g * g, w, m;
    if (v < Jl)
      m = Math.log(f / c) / t, w = function(C) {
        return [
          a + C * h,
          l + C * g,
          c * Math.exp(t * C * m)
        ];
      };
    else {
      var _ = Math.sqrt(v), p = (f * f - c * c + o * v) / (2 * c * n * _), x = (f * f - c * c - o * v) / (2 * f * n * _), N = Math.log(Math.sqrt(p * p + 1) - p), b = Math.log(Math.sqrt(x * x + 1) - x);
      m = (b - N) / t, w = function(C) {
        var I = C * m, A = Ho(N), O = c / (n * _) * (A * eu(t * I + N) - jl(N));
        return [
          a + O * h,
          l + O * g,
          c * A / Ho(t * I + N)
        ];
      };
    }
    return w.duration = m * 1e3 * t / Math.SQRT2, w;
  }
  return r.rho = function(i) {
    var s = Math.max(1e-3, +i), a = s * s, l = a * a;
    return e(s, a, l);
  }, r;
})(Math.SQRT2, 2, 4);
var it = 0, gt = 0, ft = 0, ii = 1e3, Qt, pt, Jt = 0, Ue = 0, ln = 0, bt = typeof performance == "object" && performance.now ? performance : Date, si = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function eo() {
  return Ue || (si(tu), Ue = bt.now() + ln);
}
function tu() {
  Ue = 0;
}
function jt() {
  this._call = this._time = this._next = null;
}
jt.prototype = ai.prototype = {
  constructor: jt,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? eo() : +n) + (t == null ? 0 : +t), !this._next && pt !== this && (pt ? pt._next = this : Qt = this, pt = this), this._call = e, this._time = n, On();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, On());
  }
};
function ai(e, t, n) {
  var o = new jt();
  return o.restart(e, t, n), o;
}
function nu() {
  eo(), ++it;
  for (var e = Qt, t; e; )
    (t = Ue - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --it;
}
function Ro() {
  Ue = (Jt = bt.now()) + ln, it = gt = 0;
  try {
    nu();
  } finally {
    it = 0, ru(), Ue = 0;
  }
}
function ou() {
  var e = bt.now(), t = e - Jt;
  t > ii && (ln -= t, Jt = e);
}
function ru() {
  for (var e, t = Qt, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Qt = n);
  pt = e, On(o);
}
function On(e) {
  if (!it) {
    gt && (gt = clearTimeout(gt));
    var t = e - Ue;
    t > 24 ? (e < 1 / 0 && (gt = setTimeout(Ro, e - bt.now() - ln)), ft && (ft = clearInterval(ft))) : (ft || (Jt = bt.now(), ft = setInterval(ou, ii)), it = 1, si(Ro));
  }
}
function Lo(e, t, n) {
  var o = new jt();
  return t = t == null ? 0 : +t, o.restart((r) => {
    o.stop(), e(r + t);
  }, t, n), o;
}
var iu = an("start", "end", "cancel", "interrupt"), su = [], ci = 0, Vo = 1, Bn = 2, Yt = 3, Oo = 4, Fn = 5, Zt = 6;
function un(e, t, n, o, r, i) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  au(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: r,
    // For context during callback.
    on: iu,
    tween: su,
    time: i.time,
    delay: i.delay,
    duration: i.duration,
    ease: i.ease,
    timer: null,
    state: ci
  });
}
function to(e, t) {
  var n = be(e, t);
  if (n.state > ci) throw new Error("too late; already scheduled");
  return n;
}
function Me(e, t) {
  var n = be(e, t);
  if (n.state > Yt) throw new Error("too late; already running");
  return n;
}
function be(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function au(e, t, n) {
  var o = e.__transition, r;
  o[t] = n, n.timer = ai(i, 0, n.time);
  function i(c) {
    n.state = Vo, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var u, d, f, h;
    if (n.state !== Vo) return l();
    for (u in o)
      if (h = o[u], h.name === n.name) {
        if (h.state === Yt) return Lo(s);
        h.state === Oo ? (h.state = Zt, h.timer.stop(), h.on.call("interrupt", e, e.__data__, h.index, h.group), delete o[u]) : +u < t && (h.state = Zt, h.timer.stop(), h.on.call("cancel", e, e.__data__, h.index, h.group), delete o[u]);
      }
    if (Lo(function() {
      n.state === Yt && (n.state = Oo, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = Bn, n.on.call("start", e, e.__data__, n.index, n.group), n.state === Bn) {
      for (n.state = Yt, r = new Array(f = n.tween.length), u = 0, d = -1; u < f; ++u)
        (h = n.tween[u].value.call(e, e.__data__, n.index, n.group)) && (r[++d] = h);
      r.length = d + 1;
    }
  }
  function a(c) {
    for (var u = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(l), n.state = Fn, 1), d = -1, f = r.length; ++d < f; )
      r[d].call(e, u);
    n.state === Fn && (n.on.call("end", e, e.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = Zt, n.timer.stop(), delete o[t];
    for (var c in o) return;
    delete e.__transition;
  }
}
function Wt(e, t) {
  var n = e.__transition, o, r, i = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((o = n[s]).name !== t) {
        i = !1;
        continue;
      }
      r = o.state > Bn && o.state < Fn, o.state = Zt, o.timer.stop(), o.on.call(r ? "interrupt" : "cancel", e, e.__data__, o.index, o.group), delete n[s];
    }
    i && delete e.__transition;
  }
}
function cu(e) {
  return this.each(function() {
    Wt(this, e);
  });
}
function lu(e, t) {
  var n, o;
  return function() {
    var r = Me(this, e), i = r.tween;
    if (i !== n) {
      o = n = i;
      for (var s = 0, a = o.length; s < a; ++s)
        if (o[s].name === t) {
          o = o.slice(), o.splice(s, 1);
          break;
        }
    }
    r.tween = o;
  };
}
function uu(e, t, n) {
  var o, r;
  if (typeof n != "function") throw new Error();
  return function() {
    var i = Me(this, e), s = i.tween;
    if (s !== o) {
      r = (o = s).slice();
      for (var a = { name: t, value: n }, l = 0, c = r.length; l < c; ++l)
        if (r[l].name === t) {
          r[l] = a;
          break;
        }
      l === c && r.push(a);
    }
    i.tween = r;
  };
}
function du(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = be(this.node(), n).tween, r = 0, i = o.length, s; r < i; ++r)
      if ((s = o[r]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? lu : uu)(n, e, t));
}
function no(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var r = Me(this, o);
    (r.value || (r.value = {}))[t] = n.apply(this, arguments);
  }), function(r) {
    return be(r, o).value[t];
  };
}
function li(e, t) {
  var n;
  return (typeof t == "number" ? Ee : t instanceof Ge ? Kt : (n = Ge(t)) ? (t = n, Kt) : ni)(e, t);
}
function fu(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function hu(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function gu(e, t, n) {
  var o, r = n + "", i;
  return function() {
    var s = this.getAttribute(e);
    return s === r ? null : s === o ? i : i = t(o = s, n);
  };
}
function pu(e, t, n) {
  var o, r = n + "", i;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === r ? null : s === o ? i : i = t(o = s, n);
  };
}
function mu(e, t, n) {
  var o, r, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), l = a + "", s === l ? null : s === o && l === r ? i : (r = l, i = t(o = s, a)));
  };
}
function yu(e, t, n) {
  var o, r, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), l = a + "", s === l ? null : s === o && l === r ? i : (r = l, i = t(o = s, a)));
  };
}
function wu(e, t) {
  var n = cn(e), o = n === "transform" ? Ql : li;
  return this.attrTween(e, typeof t == "function" ? (n.local ? yu : mu)(n, o, no(this, "attr." + e, t)) : t == null ? (n.local ? hu : fu)(n) : (n.local ? pu : gu)(n, o, t));
}
function xu(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function vu(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function bu(e, t) {
  var n, o;
  function r() {
    var i = t.apply(this, arguments);
    return i !== o && (n = (o = i) && vu(e, i)), n;
  }
  return r._value = t, r;
}
function _u(e, t) {
  var n, o;
  function r() {
    var i = t.apply(this, arguments);
    return i !== o && (n = (o = i) && xu(e, i)), n;
  }
  return r._value = t, r;
}
function Su(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var o = cn(e);
  return this.tween(n, (o.local ? bu : _u)(o, t));
}
function Eu(e, t) {
  return function() {
    to(this, e).delay = +t.apply(this, arguments);
  };
}
function Nu(e, t) {
  return t = +t, function() {
    to(this, e).delay = t;
  };
}
function Cu(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Eu : Nu)(t, e)) : be(this.node(), t).delay;
}
function Mu(e, t) {
  return function() {
    Me(this, e).duration = +t.apply(this, arguments);
  };
}
function Iu(e, t) {
  return t = +t, function() {
    Me(this, e).duration = t;
  };
}
function Au(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Mu : Iu)(t, e)) : be(this.node(), t).duration;
}
function ku(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    Me(this, e).ease = t;
  };
}
function $u(e) {
  var t = this._id;
  return arguments.length ? this.each(ku(t, e)) : be(this.node(), t).ease;
}
function Pu(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Me(this, e).ease = n;
  };
}
function Du(e) {
  if (typeof e != "function") throw new Error();
  return this.each(Pu(this._id, e));
}
function zu(e) {
  typeof e != "function" && (e = Or(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var i = t[r], s = i.length, a = o[r] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new Te(o, this._parents, this._name, this._id);
}
function Tu(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, r = n.length, i = Math.min(o, r), s = new Array(o), a = 0; a < i; ++a)
    for (var l = t[a], c = n[a], u = l.length, d = s[a] = new Array(u), f, h = 0; h < u; ++h)
      (f = l[h] || c[h]) && (d[h] = f);
  for (; a < o; ++a)
    s[a] = t[a];
  return new Te(s, this._parents, this._name, this._id);
}
function Hu(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function Ru(e, t, n) {
  var o, r, i = Hu(t) ? to : Me;
  return function() {
    var s = i(this, e), a = s.on;
    a !== o && (r = (o = a).copy()).on(t, n), s.on = r;
  };
}
function Lu(e, t) {
  var n = this._id;
  return arguments.length < 2 ? be(this.node(), n).on.on(e) : this.each(Ru(n, e, t));
}
function Vu(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function Ou() {
  return this.on("end.remove", Vu(this._id));
}
function Bu(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Kn(e));
  for (var o = this._groups, r = o.length, i = new Array(r), s = 0; s < r; ++s)
    for (var a = o[s], l = a.length, c = i[s] = new Array(l), u, d, f = 0; f < l; ++f)
      (u = a[f]) && (d = e.call(u, u.__data__, f, a)) && ("__data__" in u && (d.__data__ = u.__data__), c[f] = d, un(c[f], t, n, f, c, be(u, n)));
  return new Te(i, this._parents, t, n);
}
function Fu(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Vr(e));
  for (var o = this._groups, r = o.length, i = [], s = [], a = 0; a < r; ++a)
    for (var l = o[a], c = l.length, u, d = 0; d < c; ++d)
      if (u = l[d]) {
        for (var f = e.call(u, u.__data__, d, l), h, g = be(u, n), v = 0, w = f.length; v < w; ++v)
          (h = f[v]) && un(h, t, n, v, f, g);
        i.push(f), s.push(u);
      }
  return new Te(i, s, t, n);
}
var Xu = Mt.prototype.constructor;
function Yu() {
  return new Xu(this._groups, this._parents);
}
function Zu(e, t) {
  var n, o, r;
  return function() {
    var i = rt(this, e), s = (this.style.removeProperty(e), rt(this, e));
    return i === s ? null : i === n && s === o ? r : r = t(n = i, o = s);
  };
}
function ui(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Wu(e, t, n) {
  var o, r = n + "", i;
  return function() {
    var s = rt(this, e);
    return s === r ? null : s === o ? i : i = t(o = s, n);
  };
}
function qu(e, t, n) {
  var o, r, i;
  return function() {
    var s = rt(this, e), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), rt(this, e))), s === l ? null : s === o && l === r ? i : (r = l, i = t(o = s, a));
  };
}
function Gu(e, t) {
  var n, o, r, i = "style." + t, s = "end." + i, a;
  return function() {
    var l = Me(this, e), c = l.on, u = l.value[i] == null ? a || (a = ui(t)) : void 0;
    (c !== n || r !== u) && (o = (n = c).copy()).on(s, r = u), l.on = o;
  };
}
function Uu(e, t, n) {
  var o = (e += "") == "transform" ? Kl : li;
  return t == null ? this.styleTween(e, Zu(e, o)).on("end.style." + e, ui(e)) : typeof t == "function" ? this.styleTween(e, qu(e, o, no(this, "style." + e, t))).each(Gu(this._id, e)) : this.styleTween(e, Wu(e, o, t), n).on("end.style." + e, null);
}
function Ku(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function Qu(e, t, n) {
  var o, r;
  function i() {
    var s = t.apply(this, arguments);
    return s !== r && (o = (r = s) && Ku(e, s, n)), o;
  }
  return i._value = t, i;
}
function Ju(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (t == null) return this.tween(o, null);
  if (typeof t != "function") throw new Error();
  return this.tween(o, Qu(e, t, n ?? ""));
}
function ju(e) {
  return function() {
    this.textContent = e;
  };
}
function ed(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function td(e) {
  return this.tween("text", typeof e == "function" ? ed(no(this, "text", e)) : ju(e == null ? "" : e + ""));
}
function nd(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function od(e) {
  var t, n;
  function o() {
    var r = e.apply(this, arguments);
    return r !== n && (t = (n = r) && nd(r)), t;
  }
  return o._value = e, o;
}
function rd(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, od(e));
}
function id() {
  for (var e = this._name, t = this._id, n = di(), o = this._groups, r = o.length, i = 0; i < r; ++i)
    for (var s = o[i], a = s.length, l, c = 0; c < a; ++c)
      if (l = s[c]) {
        var u = be(l, t);
        un(l, e, n, c, s, {
          time: u.time + u.delay + u.duration,
          delay: 0,
          duration: u.duration,
          ease: u.ease
        });
      }
  return new Te(o, this._parents, e, n);
}
function sd() {
  var e, t, n = this, o = n._id, r = n.size();
  return new Promise(function(i, s) {
    var a = { value: s }, l = { value: function() {
      --r === 0 && i();
    } };
    n.each(function() {
      var c = Me(this, o), u = c.on;
      u !== e && (t = (e = u).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(l)), c.on = t;
    }), r === 0 && i();
  });
}
var ad = 0;
function Te(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function di() {
  return ++ad;
}
var De = Mt.prototype;
Te.prototype = {
  constructor: Te,
  select: Bu,
  selectAll: Fu,
  selectChild: De.selectChild,
  selectChildren: De.selectChildren,
  filter: zu,
  merge: Tu,
  selection: Yu,
  transition: id,
  call: De.call,
  nodes: De.nodes,
  node: De.node,
  size: De.size,
  empty: De.empty,
  each: De.each,
  on: Lu,
  attr: wu,
  attrTween: Su,
  style: Uu,
  styleTween: Ju,
  text: td,
  textTween: rd,
  remove: Ou,
  tween: du,
  delay: Cu,
  duration: Au,
  ease: $u,
  easeVarying: Du,
  end: sd,
  [Symbol.iterator]: De[Symbol.iterator]
};
function cd(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var ld = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: cd
};
function ud(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function dd(e) {
  var t, n;
  e instanceof Te ? (t = e._id, e = e._name) : (t = di(), (n = ld).time = eo(), e = e == null ? null : e + "");
  for (var o = this._groups, r = o.length, i = 0; i < r; ++i)
    for (var s = o[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && un(l, e, t, c, s, n || ud(l, t));
  return new Te(o, this._parents, e, t);
}
Mt.prototype.interrupt = cu;
Mt.prototype.transition = dd;
const Rt = (e) => () => e;
function fd(e, {
  sourceEvent: t,
  target: n,
  transform: o,
  dispatch: r
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: o, enumerable: !0, configurable: !0 },
    _: { value: r }
  });
}
function ze(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
ze.prototype = {
  constructor: ze,
  scale: function(e) {
    return e === 1 ? this : new ze(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new ze(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var dn = new ze(1, 0, 0);
fi.prototype = ze.prototype;
function fi(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return dn;
  return e.__zoom;
}
function Nn(e) {
  e.stopImmediatePropagation();
}
function ht(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function hd(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function gd() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Bo() {
  return this.__zoom || dn;
}
function pd(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function md() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function yd(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], r = e.invertX(t[1][0]) - n[1][0], i = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    r > o ? (o + r) / 2 : Math.min(0, o) || Math.max(0, r),
    s > i ? (i + s) / 2 : Math.min(0, i) || Math.max(0, s)
  );
}
function hi() {
  var e = hd, t = gd, n = yd, o = pd, r = md, i = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = Xt, c = an("start", "zoom", "end"), u, d, f, h = 500, g = 150, v = 0, w = 10;
  function m(y) {
    y.property("__zoom", Bo).on("wheel.zoom", I, { passive: !1 }).on("mousedown.zoom", A).on("dblclick.zoom", O).filter(r).on("touchstart.zoom", P).on("touchmove.zoom", R).on("touchend.zoom touchcancel.zoom", D).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(y, S, E, M) {
    var $ = y.selection ? y.selection() : y;
    $.property("__zoom", Bo), y !== $ ? N(y, S, E, M) : $.interrupt().each(function() {
      b(this, arguments).event(M).start().zoom(null, typeof S == "function" ? S.apply(this, arguments) : S).end();
    });
  }, m.scaleBy = function(y, S, E, M) {
    m.scaleTo(y, function() {
      var $ = this.__zoom.k, k = typeof S == "function" ? S.apply(this, arguments) : S;
      return $ * k;
    }, E, M);
  }, m.scaleTo = function(y, S, E, M) {
    m.transform(y, function() {
      var $ = t.apply(this, arguments), k = this.__zoom, V = E == null ? x($) : typeof E == "function" ? E.apply(this, arguments) : E, L = k.invert(V), H = typeof S == "function" ? S.apply(this, arguments) : S;
      return n(p(_(k, H), V, L), $, s);
    }, E, M);
  }, m.translateBy = function(y, S, E, M) {
    m.transform(y, function() {
      return n(this.__zoom.translate(
        typeof S == "function" ? S.apply(this, arguments) : S,
        typeof E == "function" ? E.apply(this, arguments) : E
      ), t.apply(this, arguments), s);
    }, null, M);
  }, m.translateTo = function(y, S, E, M, $) {
    m.transform(y, function() {
      var k = t.apply(this, arguments), V = this.__zoom, L = M == null ? x(k) : typeof M == "function" ? M.apply(this, arguments) : M;
      return n(dn.translate(L[0], L[1]).scale(V.k).translate(
        typeof S == "function" ? -S.apply(this, arguments) : -S,
        typeof E == "function" ? -E.apply(this, arguments) : -E
      ), k, s);
    }, M, $);
  };
  function _(y, S) {
    return S = Math.max(i[0], Math.min(i[1], S)), S === y.k ? y : new ze(S, y.x, y.y);
  }
  function p(y, S, E) {
    var M = S[0] - E[0] * y.k, $ = S[1] - E[1] * y.k;
    return M === y.x && $ === y.y ? y : new ze(y.k, M, $);
  }
  function x(y) {
    return [(+y[0][0] + +y[1][0]) / 2, (+y[0][1] + +y[1][1]) / 2];
  }
  function N(y, S, E, M) {
    y.on("start.zoom", function() {
      b(this, arguments).event(M).start();
    }).on("interrupt.zoom end.zoom", function() {
      b(this, arguments).event(M).end();
    }).tween("zoom", function() {
      var $ = this, k = arguments, V = b($, k).event(M), L = t.apply($, k), H = E == null ? x(L) : typeof E == "function" ? E.apply($, k) : E, X = Math.max(L[1][0] - L[0][0], L[1][1] - L[0][1]), F = $.__zoom, W = typeof S == "function" ? S.apply($, k) : S, Q = l(F.invert(H).concat(X / F.k), W.invert(H).concat(X / W.k));
      return function(q) {
        if (q === 1) q = W;
        else {
          var z = Q(q), B = X / z[2];
          q = new ze(B, H[0] - z[0] * B, H[1] - z[1] * B);
        }
        V.zoom(null, q);
      };
    });
  }
  function b(y, S, E) {
    return !E && y.__zooming || new C(y, S);
  }
  function C(y, S) {
    this.that = y, this.args = S, this.active = 0, this.sourceEvent = null, this.extent = t.apply(y, S), this.taps = 0;
  }
  C.prototype = {
    event: function(y) {
      return y && (this.sourceEvent = y), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(y, S) {
      return this.mouse && y !== "mouse" && (this.mouse[1] = S.invert(this.mouse[0])), this.touch0 && y !== "touch" && (this.touch0[1] = S.invert(this.touch0[0])), this.touch1 && y !== "touch" && (this.touch1[1] = S.invert(this.touch1[0])), this.that.__zoom = S, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(y) {
      var S = de(this.that).datum();
      c.call(
        y,
        this.that,
        new fd(y, {
          sourceEvent: this.sourceEvent,
          target: m,
          transform: this.that.__zoom,
          dispatch: c
        }),
        S
      );
    }
  };
  function I(y, ...S) {
    if (!e.apply(this, arguments)) return;
    var E = b(this, S).event(y), M = this.__zoom, $ = Math.max(i[0], Math.min(i[1], M.k * Math.pow(2, o.apply(this, arguments)))), k = ge(y);
    if (E.wheel)
      (E.mouse[0][0] !== k[0] || E.mouse[0][1] !== k[1]) && (E.mouse[1] = M.invert(E.mouse[0] = k)), clearTimeout(E.wheel);
    else {
      if (M.k === $) return;
      E.mouse = [k, M.invert(k)], Wt(this), E.start();
    }
    ht(y), E.wheel = setTimeout(V, g), E.zoom("mouse", n(p(_(M, $), E.mouse[0], E.mouse[1]), E.extent, s));
    function V() {
      E.wheel = null, E.end();
    }
  }
  function A(y, ...S) {
    if (f || !e.apply(this, arguments)) return;
    var E = y.currentTarget, M = b(this, S, !0).event(y), $ = de(y.view).on("mousemove.zoom", H, !0).on("mouseup.zoom", X, !0), k = ge(y, E), V = y.clientX, L = y.clientY;
    Kr(y.view), Nn(y), M.mouse = [k, this.__zoom.invert(k)], Wt(this), M.start();
    function H(F) {
      if (ht(F), !M.moved) {
        var W = F.clientX - V, Q = F.clientY - L;
        M.moved = W * W + Q * Q > v;
      }
      M.event(F).zoom("mouse", n(p(M.that.__zoom, M.mouse[0] = ge(F, E), M.mouse[1]), M.extent, s));
    }
    function X(F) {
      $.on("mousemove.zoom mouseup.zoom", null), Qr(F.view, M.moved), ht(F), M.event(F).end();
    }
  }
  function O(y, ...S) {
    if (e.apply(this, arguments)) {
      var E = this.__zoom, M = ge(y.changedTouches ? y.changedTouches[0] : y, this), $ = E.invert(M), k = E.k * (y.shiftKey ? 0.5 : 2), V = n(p(_(E, k), M, $), t.apply(this, S), s);
      ht(y), a > 0 ? de(this).transition().duration(a).call(N, V, M, y) : de(this).call(m.transform, V, M, y);
    }
  }
  function P(y, ...S) {
    if (e.apply(this, arguments)) {
      var E = y.touches, M = E.length, $ = b(this, S, y.changedTouches.length === M).event(y), k, V, L, H;
      for (Nn(y), V = 0; V < M; ++V)
        L = E[V], H = ge(L, this), H = [H, this.__zoom.invert(H), L.identifier], $.touch0 ? !$.touch1 && $.touch0[2] !== H[2] && ($.touch1 = H, $.taps = 0) : ($.touch0 = H, k = !0, $.taps = 1 + !!u);
      u && (u = clearTimeout(u)), k && ($.taps < 2 && (d = H[0], u = setTimeout(function() {
        u = null;
      }, h)), Wt(this), $.start());
    }
  }
  function R(y, ...S) {
    if (this.__zooming) {
      var E = b(this, S).event(y), M = y.changedTouches, $ = M.length, k, V, L, H;
      for (ht(y), k = 0; k < $; ++k)
        V = M[k], L = ge(V, this), E.touch0 && E.touch0[2] === V.identifier ? E.touch0[0] = L : E.touch1 && E.touch1[2] === V.identifier && (E.touch1[0] = L);
      if (V = E.that.__zoom, E.touch1) {
        var X = E.touch0[0], F = E.touch0[1], W = E.touch1[0], Q = E.touch1[1], q = (q = W[0] - X[0]) * q + (q = W[1] - X[1]) * q, z = (z = Q[0] - F[0]) * z + (z = Q[1] - F[1]) * z;
        V = _(V, Math.sqrt(q / z)), L = [(X[0] + W[0]) / 2, (X[1] + W[1]) / 2], H = [(F[0] + Q[0]) / 2, (F[1] + Q[1]) / 2];
      } else if (E.touch0) L = E.touch0[0], H = E.touch0[1];
      else return;
      E.zoom("touch", n(p(V, L, H), E.extent, s));
    }
  }
  function D(y, ...S) {
    if (this.__zooming) {
      var E = b(this, S).event(y), M = y.changedTouches, $ = M.length, k, V;
      for (Nn(y), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, h), k = 0; k < $; ++k)
        V = M[k], E.touch0 && E.touch0[2] === V.identifier ? delete E.touch0 : E.touch1 && E.touch1[2] === V.identifier && delete E.touch1;
      if (E.touch1 && !E.touch0 && (E.touch0 = E.touch1, delete E.touch1), E.touch0) E.touch0[1] = this.__zoom.invert(E.touch0[0]);
      else if (E.end(), E.taps === 2 && (V = ge(V, this), Math.hypot(d[0] - V[0], d[1] - V[1]) < w)) {
        var L = de(this).on("dblclick.zoom");
        L && L.apply(this, arguments);
      }
    }
  }
  return m.wheelDelta = function(y) {
    return arguments.length ? (o = typeof y == "function" ? y : Rt(+y), m) : o;
  }, m.filter = function(y) {
    return arguments.length ? (e = typeof y == "function" ? y : Rt(!!y), m) : e;
  }, m.touchable = function(y) {
    return arguments.length ? (r = typeof y == "function" ? y : Rt(!!y), m) : r;
  }, m.extent = function(y) {
    return arguments.length ? (t = typeof y == "function" ? y : Rt([[+y[0][0], +y[0][1]], [+y[1][0], +y[1][1]]]), m) : t;
  }, m.scaleExtent = function(y) {
    return arguments.length ? (i[0] = +y[0], i[1] = +y[1], m) : [i[0], i[1]];
  }, m.translateExtent = function(y) {
    return arguments.length ? (s[0][0] = +y[0][0], s[1][0] = +y[1][0], s[0][1] = +y[0][1], s[1][1] = +y[1][1], m) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, m.constrain = function(y) {
    return arguments.length ? (n = y, m) : n;
  }, m.duration = function(y) {
    return arguments.length ? (a = +y, m) : a;
  }, m.interpolate = function(y) {
    return arguments.length ? (l = y, m) : l;
  }, m.on = function() {
    var y = c.on.apply(c, arguments);
    return y === c ? m : y;
  }, m.clickDistance = function(y) {
    return arguments.length ? (v = (y = +y) * y, m) : Math.sqrt(v);
  }, m.tapDistance = function(y) {
    return arguments.length ? (w = +y, m) : w;
  }, m;
}
const ve = {
  error001: (e = "react") => `Seems like you have not used ${e === "svelte" ? "SvelteFlowProvider" : "ReactFlowProvider"} as an ancestor. Help: https://${e}flow.dev/error#001`,
  error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
  error003: (e) => `Node type "${e}" not found. Using fallback type "default".`,
  error004: () => "The parent container needs a width and a height to render the graph.",
  error005: () => "Only child nodes can use a parent extent.",
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: (e) => `The old edge with id=${e} does not exist.`,
  error009: (e) => `Marker type "${e}" doesn't exist.`,
  error008: (e, { id: t, sourceHandle: n, targetHandle: o }) => `Couldn't create edge for ${e} handle id: "${e === "source" ? n : o}", edge id: ${t}.`,
  error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
  error011: (e) => `Edge type "${e}" not found. Using fallback type "default".`,
  error012: (e) => `Node with id "${e}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
  error013: (e = "react") => `It seems that you haven't loaded the styles. Please import '@xyflow/${e}/dist/style.css' or base.css to make sure everything is working properly.`,
  error014: () => "useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.",
  error015: () => "It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs.",
  error016: (e) => `Edge with id "${e}" does not exist, it may have been removed. This can happen when an edge is deleted before the "onEdgeClick" handler is called.`
}, _t = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], gi = ["Enter", " ", "Escape"], pi = {
  "node.a11yDescription.default": "Press enter or space to select a node. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.keyboardDisabled": "Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.ariaLiveMessage": ({ direction: e, x: t, y: n }) => `Moved selected node ${e}. New position, x: ${t}, y: ${n}`,
  "edge.a11yDescription.default": "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.",
  // Control elements
  "controls.ariaLabel": "Control Panel",
  "controls.zoomIn.ariaLabel": "Zoom In",
  "controls.zoomOut.ariaLabel": "Zoom Out",
  "controls.fitView.ariaLabel": "Fit View",
  "controls.interactive.ariaLabel": "Toggle Interactivity",
  // Mini map
  "minimap.ariaLabel": "Mini Map",
  // Handle
  "handle.ariaLabel": "Handle"
};
var st;
(function(e) {
  e.Strict = "strict", e.Loose = "loose";
})(st || (st = {}));
var qe;
(function(e) {
  e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(qe || (qe = {}));
var St;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(St || (St = {}));
const mi = {
  inProgress: !1,
  isValid: null,
  from: null,
  fromHandle: null,
  fromPosition: null,
  fromNode: null,
  to: null,
  toHandle: null,
  toPosition: null,
  toNode: null,
  pointer: null
};
var Ve;
(function(e) {
  e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})(Ve || (Ve = {}));
var en;
(function(e) {
  e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(en || (en = {}));
var Z;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(Z || (Z = {}));
const Fo = {
  [Z.Left]: Z.Right,
  [Z.Right]: Z.Left,
  [Z.Top]: Z.Bottom,
  [Z.Bottom]: Z.Top
};
function yi(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
const wi = (e) => !!e && typeof e == "object" && "id" in e && "source" in e && "target" in e, wd = (e) => !!e && typeof e == "object" && "id" in e && "position" in e && !("source" in e) && !("target" in e), oo = (e) => !!e && typeof e == "object" && "id" in e && "internals" in e && !("source" in e) && !("target" in e), At = (e, t = [0, 0]) => {
  const { width: n, height: o } = Ie(e), r = e.origin ?? t, i = n * r[0], s = o * r[1];
  return {
    x: e.position.x - i,
    y: e.position.y - s
  };
}, xd = (e, t = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  const n = e.reduce((o, r) => {
    const i = typeof r == "string";
    let s = !t.nodeLookup && !i ? r : void 0;
    t.nodeLookup && (s = i ? t.nodeLookup.get(r) : oo(r) ? r : t.nodeLookup.get(r.id));
    const a = s ? tn(s, t.nodeOrigin) : { x: 0, y: 0, x2: 0, y2: 0 };
    return fn(o, a);
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return hn(n);
}, kt = (e, t = {}) => {
  let n = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, o = !1;
  return e.forEach((r) => {
    (t.filter === void 0 || t.filter(r)) && (n = fn(n, tn(r)), o = !0);
  }), o ? hn(n) : { x: 0, y: 0, width: 0, height: 0 };
}, ro = (e, t, [n, o, r] = [0, 0, 1], i = !1, s = !1) => {
  const a = (t.x - n) / r, l = (t.y - o) / r, c = t.width / r, u = t.height / r, d = [];
  for (const f of e.values()) {
    const { measured: h, selectable: g = !0, hidden: v = !1 } = f;
    if (s && !g || v)
      continue;
    const w = h.width ?? f.width ?? f.initialWidth ?? 0, m = h.height ?? f.height ?? f.initialHeight ?? 0, { x: _, y: p } = f.internals.positionAbsolute, x = _i(a, l, c, u, _, p, w, m), N = w * m, b = i && x > 0;
    (!f.internals.handleBounds || b || x >= N || f.dragging) && d.push(f);
  }
  return d;
}, vd = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((o) => {
    n.add(o.id);
  }), t.filter((o) => n.has(o.source) || n.has(o.target));
};
function bd(e, t) {
  const n = /* @__PURE__ */ new Map(), o = t?.nodes ? new Set(t.nodes.map((r) => r.id)) : null;
  return e.forEach((r) => {
    let i;
    if (t?.includeHiddenNodes) {
      const { width: s, height: a } = Ie(r);
      i = s > 0 && a > 0;
    } else
      i = !!(r.measured.width && r.measured.height && !r.hidden);
    i && (!o || o.has(r.id)) && n.set(r.id, r);
  }), n;
}
async function _d({ nodes: e, width: t, height: n, panZoom: o, minZoom: r, maxZoom: i }, s) {
  if (e.size === 0)
    return !0;
  const a = bd(e, s), l = kt(a), c = so(l, t, n, s?.minZoom ?? r, s?.maxZoom ?? i, s?.padding ?? 0.1);
  return await o.setViewport(c, {
    duration: s?.duration,
    ease: s?.ease,
    interpolate: s?.interpolate
  }), !0;
}
function xi({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: o = [0, 0], nodeExtent: r, onError: i }) {
  const s = n.get(e), a = s.parentId ? n.get(s.parentId) : void 0, { x: l, y: c } = a ? a.internals.positionAbsolute : { x: 0, y: 0 }, u = s.origin ?? o;
  let d = s.extent || r;
  if (s.extent === "parent" && !s.expandParent)
    if (!a)
      i?.("005", ve.error005());
    else {
      const h = a.measured.width, g = a.measured.height;
      h && g && (d = [
        [l, c],
        [l + h, c + g]
      ]);
    }
  else a && Qe(s.extent) && (d = [
    [s.extent[0][0] + l, s.extent[0][1] + c],
    [s.extent[1][0] + l, s.extent[1][1] + c]
  ]);
  const f = Qe(d) ? Ke(t, d, s.measured) : t;
  return (s.measured.width === void 0 || s.measured.height === void 0) && i?.("015", ve.error015()), {
    position: {
      x: f.x - l + (s.measured.width ?? 0) * u[0],
      y: f.y - c + (s.measured.height ?? 0) * u[1]
    },
    positionAbsolute: f
  };
}
async function Sd({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: o, onBeforeDelete: r }) {
  const i = new Set(e.map((f) => f.id)), s = [];
  for (const f of n) {
    if (f.deletable === !1)
      continue;
    const h = i.has(f.id), g = !h && f.parentId && s.find((v) => v.id === f.parentId);
    (h || g) && s.push(f);
  }
  const a = new Set(t.map((f) => f.id)), l = o.filter((f) => f.deletable !== !1), u = vd(s, l);
  for (const f of l)
    a.has(f.id) && !u.find((g) => g.id === f.id) && u.push(f);
  if (!r)
    return {
      edges: u,
      nodes: s
    };
  const d = await r({
    nodes: s,
    edges: u
  });
  return typeof d == "boolean" ? d ? { edges: u, nodes: s } : { edges: [], nodes: [] } : d;
}
const at = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), Ke = (e = { x: 0, y: 0 }, t, n) => ({
  x: at(e.x, t[0][0], t[1][0] - (n?.width ?? 0)),
  y: at(e.y, t[0][1], t[1][1] - (n?.height ?? 0))
});
function vi(e, t, n) {
  const { width: o, height: r } = Ie(n), { x: i, y: s } = n.internals.positionAbsolute;
  return Ke(e, [
    [i, s],
    [i + o, s + r]
  ], t);
}
const Xo = (e, t, n) => e < t ? at(Math.abs(e - t), 1, t) / t : e > n ? -at(Math.abs(e - n), 1, t) / t : 0, io = (e, t, n = 15, o = 40) => {
  const r = Xo(e.x, o, t.width - o) * n, i = Xo(e.y, o, t.height - o) * n;
  return [r, i];
}, fn = (e, t) => ({
  x: Math.min(e.x, t.x),
  y: Math.min(e.y, t.y),
  x2: Math.max(e.x2, t.x2),
  y2: Math.max(e.y2, t.y2)
}), Xn = ({ x: e, y: t, width: n, height: o }) => ({
  x: e,
  y: t,
  x2: e + n,
  y2: t + o
}), hn = ({ x: e, y: t, x2: n, y2: o }) => ({
  x: e,
  y: t,
  width: n - e,
  height: o - t
}), Et = (e, t = [0, 0]) => {
  const { x: n, y: o } = oo(e) ? e.internals.positionAbsolute : At(e, t);
  return {
    x: n,
    y: o,
    width: e.measured?.width ?? e.width ?? e.initialWidth ?? 0,
    height: e.measured?.height ?? e.height ?? e.initialHeight ?? 0
  };
}, tn = (e, t = [0, 0]) => {
  const { x: n, y: o } = oo(e) ? e.internals.positionAbsolute : At(e, t);
  return {
    x: n,
    y: o,
    x2: n + (e.measured?.width ?? e.width ?? e.initialWidth ?? 0),
    y2: o + (e.measured?.height ?? e.height ?? e.initialHeight ?? 0)
  };
}, bi = (e, t) => hn(fn(Xn(e), Xn(t))), _i = (e, t, n, o, r, i, s, a) => {
  const l = Math.max(0, Math.min(e + n, r + s) - Math.max(e, r)), c = Math.max(0, Math.min(t + o, i + a) - Math.max(t, i));
  return Math.ceil(l * c);
}, nn = (e, t) => _i(e.x, e.y, e.width, e.height, t.x, t.y, t.width, t.height), Yo = (e) => me(e.width) && me(e.height) && me(e.x) && me(e.y), me = (e) => !isNaN(e) && isFinite(e), Si = (e, t) => (n, o) => {
}, $t = (e, t = [1, 1]) => ({
  x: t[0] * Math.round(e.x / t[0]),
  y: t[1] * Math.round(e.y / t[1])
}), Pt = ({ x: e, y: t }, [n, o, r], i = !1, s = [1, 1]) => {
  const a = {
    x: (e - n) / r,
    y: (t - o) / r
  };
  return i ? $t(a, s) : a;
}, ct = ({ x: e, y: t }, [n, o, r]) => ({
  x: e * r + n,
  y: t * r + o
});
function je(e, t) {
  if (typeof e == "number")
    return Math.floor((t - t / (1 + e)) * 0.5);
  if (typeof e == "string" && e.endsWith("px")) {
    const n = parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(n);
  }
  if (typeof e == "string" && e.endsWith("%")) {
    const n = parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(t * n * 0.01);
  }
  return console.error(`The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function Ed(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const o = je(e, n), r = je(e, t);
    return {
      top: o,
      right: r,
      bottom: o,
      left: r,
      x: r * 2,
      y: o * 2
    };
  }
  if (typeof e == "object") {
    const o = je(e.top ?? e.y ?? 0, n), r = je(e.bottom ?? e.y ?? 0, n), i = je(e.left ?? e.x ?? 0, t), s = je(e.right ?? e.x ?? 0, t);
    return { top: o, right: s, bottom: r, left: i, x: i + s, y: o + r };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function Nd(e, t, n, o, r, i) {
  const { x: s, y: a } = ct(e, [t, n, o]), { x: l, y: c } = ct({ x: e.x + e.width, y: e.y + e.height }, [t, n, o]), u = r - l, d = i - c;
  return {
    left: Math.floor(s),
    top: Math.floor(a),
    right: Math.floor(u),
    bottom: Math.floor(d)
  };
}
const so = (e, t, n, o, r, i) => {
  const s = Ed(i, t, n), a = (t - s.x) / e.width, l = (n - s.y) / e.height, c = Math.min(a, l), u = at(c, o, r), d = e.x + e.width / 2, f = e.y + e.height / 2, h = t / 2 - d * u, g = n / 2 - f * u, v = Nd(e, h, g, u, t, n), w = {
    left: Math.min(v.left - s.left, 0),
    top: Math.min(v.top - s.top, 0),
    right: Math.min(v.right - s.right, 0),
    bottom: Math.min(v.bottom - s.bottom, 0)
  };
  return {
    x: h - w.left + w.right,
    y: g - w.top + w.bottom,
    zoom: u
  };
}, Nt = () => typeof navigator < "u" && navigator?.userAgent?.indexOf("Mac") >= 0;
function Qe(e) {
  return e != null && e !== "parent";
}
function Ie(e) {
  return {
    width: e.measured?.width ?? e.width ?? e.initialWidth ?? 0,
    height: e.measured?.height ?? e.height ?? e.initialHeight ?? 0
  };
}
function Ei(e) {
  return (e.measured?.width ?? e.width ?? e.initialWidth) !== void 0 && (e.measured?.height ?? e.height ?? e.initialHeight) !== void 0;
}
function Ni(e, t = { width: 0, height: 0 }, n, o, r) {
  const i = { ...e }, s = o.get(n);
  if (s) {
    const a = s.origin || r;
    i.x += s.internals.positionAbsolute.x - (t.width ?? 0) * a[0], i.y += s.internals.positionAbsolute.y - (t.height ?? 0) * a[1];
  }
  return i;
}
function Zo(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function Cd() {
  let e, t;
  return { promise: new Promise((o, r) => {
    e = o, t = r;
  }), resolve: e, reject: t };
}
function Md(e) {
  return { ...pi, ...e || {} };
}
function yt(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: o, containerBounds: r }) {
  const { x: i, y: s } = ye(e), a = Pt({ x: i - (r?.left ?? 0), y: s - (r?.top ?? 0) }, o), { x: l, y: c } = n ? $t(a, t) : a;
  return {
    xSnapped: l,
    ySnapped: c,
    ...a
  };
}
const ao = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), Ci = (e) => e?.getRootNode?.() || window?.document, Id = ["INPUT", "SELECT", "TEXTAREA"];
function Mi(e) {
  const t = e.composedPath?.()?.[0] || e.target;
  return t?.nodeType !== 1 ? !1 : Id.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey");
}
const Ii = (e) => "clientX" in e, ye = (e, t) => {
  const n = Ii(e), o = n ? e.clientX : e.touches?.[0].clientX, r = n ? e.clientY : e.touches?.[0].clientY;
  return {
    x: o - (t?.left ?? 0),
    y: r - (t?.top ?? 0)
  };
}, Wo = (e, t, n, o, r) => {
  const i = t.querySelectorAll(`.${e}`);
  return !i || !i.length ? null : Array.from(i).map((s) => {
    const a = s.getBoundingClientRect();
    return {
      id: s.getAttribute("data-handleid"),
      type: e,
      nodeId: r,
      position: s.getAttribute("data-handlepos"),
      x: (a.left - n.left) / o,
      y: (a.top - n.top) / o,
      ...ao(s)
    };
  });
};
function Ai({ sourceX: e, sourceY: t, targetX: n, targetY: o, sourceControlX: r, sourceControlY: i, targetControlX: s, targetControlY: a }) {
  const l = e * 0.125 + r * 0.375 + s * 0.375 + n * 0.125, c = t * 0.125 + i * 0.375 + a * 0.375 + o * 0.125, u = Math.abs(l - e), d = Math.abs(c - t);
  return [l, c, u, d];
}
function Lt(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function qo({ pos: e, x1: t, y1: n, x2: o, y2: r, c: i }) {
  switch (e) {
    case Z.Left:
      return [t - Lt(t - o, i), n];
    case Z.Right:
      return [t + Lt(o - t, i), n];
    case Z.Top:
      return [t, n - Lt(n - r, i)];
    case Z.Bottom:
      return [t, n + Lt(r - n, i)];
  }
}
function ki({ sourceX: e, sourceY: t, sourcePosition: n = Z.Bottom, targetX: o, targetY: r, targetPosition: i = Z.Top, curvature: s = 0.25 }) {
  const [a, l] = qo({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: r,
    c: s
  }), [c, u] = qo({
    pos: i,
    x1: o,
    y1: r,
    x2: e,
    y2: t,
    c: s
  }), [d, f, h, g] = Ai({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: r,
    sourceControlX: a,
    sourceControlY: l,
    targetControlX: c,
    targetControlY: u
  });
  return [
    `M${e},${t} C${a},${l} ${c},${u} ${o},${r}`,
    d,
    f,
    h,
    g
  ];
}
function $i({ sourceX: e, sourceY: t, targetX: n, targetY: o }) {
  const r = Math.abs(n - e) / 2, i = n < e ? n + r : n - r, s = Math.abs(o - t) / 2, a = o < t ? o + s : o - s;
  return [i, a, r, s];
}
function Ad({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: o = 0, elevateOnSelect: r = !1, zIndexMode: i = "basic" }) {
  if (i === "manual")
    return o;
  const s = r && n ? o + 1e3 : o, a = Math.max(e.parentId || r && e.selected ? e.internals.z : 0, t.parentId || r && t.selected ? t.internals.z : 0);
  return s + a;
}
function kd({ sourceNode: e, targetNode: t, width: n, height: o, transform: r }) {
  const i = fn(tn(e), tn(t));
  i.x === i.x2 && (i.x2 += 1), i.y === i.y2 && (i.y2 += 1);
  const s = {
    x: -r[0] / r[2],
    y: -r[1] / r[2],
    width: n / r[2],
    height: o / r[2]
  };
  return nn(s, hn(i)) > 0;
}
const $d = ({ source: e, sourceHandle: t, target: n, targetHandle: o }) => `xy-edge__${e}${t || ""}-${n}${o || ""}`, Pd = (e, t) => t.some((n) => n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)), Dd = (e, t, n = {}) => {
  if (!e.source || !e.target)
    return n.onError?.("006", ve.error006()), t;
  const o = n.getEdgeId || $d;
  let r;
  return wi(e) ? r = { ...e } : r = {
    ...e,
    id: o(e)
  }, Pd(r, t) ? t : (r.sourceHandle === null && delete r.sourceHandle, r.targetHandle === null && delete r.targetHandle, t.concat(r));
};
function Pi({ sourceX: e, sourceY: t, targetX: n, targetY: o }) {
  const [r, i, s, a] = $i({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: o
  });
  return [`M ${e},${t}L ${n},${o}`, r, i, s, a];
}
const Go = {
  [Z.Left]: { x: -1, y: 0 },
  [Z.Right]: { x: 1, y: 0 },
  [Z.Top]: { x: 0, y: -1 },
  [Z.Bottom]: { x: 0, y: 1 }
}, zd = ({ source: e, sourcePosition: t = Z.Bottom, target: n }) => t === Z.Left || t === Z.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, Uo = (e, t) => Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
function Td({ source: e, sourcePosition: t = Z.Bottom, target: n, targetPosition: o = Z.Top, center: r, offset: i, stepPosition: s }) {
  const a = Go[t], l = Go[o], c = { x: e.x + a.x * i, y: e.y + a.y * i }, u = { x: n.x + l.x * i, y: n.y + l.y * i }, d = zd({
    source: c,
    sourcePosition: t,
    target: u
  }), f = d.x !== 0 ? "x" : "y", h = d[f];
  let g = [], v, w;
  const m = { x: 0, y: 0 }, _ = { x: 0, y: 0 }, [, , p, x] = $i({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (a[f] * l[f] === -1) {
    f === "x" ? (v = r.x ?? c.x + (u.x - c.x) * s, w = r.y ?? (c.y + u.y) / 2) : (v = r.x ?? (c.x + u.x) / 2, w = r.y ?? c.y + (u.y - c.y) * s);
    const I = [
      { x: v, y: c.y },
      { x: v, y: u.y }
    ], A = [
      { x: c.x, y: w },
      { x: u.x, y: w }
    ];
    a[f] === h ? g = f === "x" ? I : A : g = f === "x" ? A : I;
  } else {
    const I = [{ x: c.x, y: u.y }], A = [{ x: u.x, y: c.y }];
    if (f === "x" ? g = a.x === h ? A : I : g = a.y === h ? I : A, t === o) {
      const y = Math.abs(e[f] - n[f]);
      if (y <= i) {
        const S = Math.min(i - 1, i - y);
        a[f] === h ? m[f] = (c[f] > e[f] ? -1 : 1) * S : _[f] = (u[f] > n[f] ? -1 : 1) * S;
      }
    }
    if (t !== o) {
      const y = f === "x" ? "y" : "x", S = a[f] === l[y], E = c[y] > u[y], M = c[y] < u[y];
      (a[f] === 1 && (!S && E || S && M) || a[f] !== 1 && (!S && M || S && E)) && (g = f === "x" ? I : A);
    }
    const O = { x: c.x + m.x, y: c.y + m.y }, P = { x: u.x + _.x, y: u.y + _.y }, R = Math.max(Math.abs(O.x - g[0].x), Math.abs(P.x - g[0].x)), D = Math.max(Math.abs(O.y - g[0].y), Math.abs(P.y - g[0].y));
    R >= D ? (v = (O.x + P.x) / 2, w = g[0].y) : (v = g[0].x, w = (O.y + P.y) / 2);
  }
  const N = { x: c.x + m.x, y: c.y + m.y }, b = { x: u.x + _.x, y: u.y + _.y };
  return [[
    e,
    // we only want to add the gapped source/target if they are different from the first/last point to avoid duplicates which can cause issues with the bends
    ...N.x !== g[0].x || N.y !== g[0].y ? [N] : [],
    ...g,
    ...b.x !== g[g.length - 1].x || b.y !== g[g.length - 1].y ? [b] : [],
    n
  ], v, w, p, x];
}
function Hd(e, t, n, o) {
  const r = Math.min(Uo(e, t) / 2, Uo(t, n) / 2, o), { x: i, y: s } = t;
  if (e.x === i && i === n.x || e.y === s && s === n.y)
    return `L${i} ${s}`;
  if (e.y === s) {
    const c = e.x < n.x ? -1 : 1, u = e.y < n.y ? 1 : -1;
    return `L ${i + r * c},${s}Q ${i},${s} ${i},${s + r * u}`;
  }
  const a = e.x < n.x ? 1 : -1, l = e.y < n.y ? -1 : 1;
  return `L ${i},${s + r * l}Q ${i},${s} ${i + r * a},${s}`;
}
function Yn({ sourceX: e, sourceY: t, sourcePosition: n = Z.Bottom, targetX: o, targetY: r, targetPosition: i = Z.Top, borderRadius: s = 5, centerX: a, centerY: l, offset: c = 20, stepPosition: u = 0.5 }) {
  const [d, f, h, g, v] = Td({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: o, y: r },
    targetPosition: i,
    center: { x: a, y: l },
    offset: c,
    stepPosition: u
  });
  let w = `M${d[0].x} ${d[0].y}`;
  for (let m = 1; m < d.length - 1; m++)
    w += Hd(d[m - 1], d[m], d[m + 1], s);
  return w += `L${d[d.length - 1].x} ${d[d.length - 1].y}`, [w, f, h, g, v];
}
function Ko(e) {
  return e && !!(e.internals.handleBounds || e.handles?.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function Rd(e) {
  const { sourceNode: t, targetNode: n } = e;
  if (!Ko(t) || !Ko(n))
    return null;
  const o = t.internals.handleBounds || Qo(t.handles), r = n.internals.handleBounds || Qo(n.handles), i = Jo(o?.source ?? [], e.sourceHandle), s = Jo(
    // when connection type is loose we can define all handles as sources and connect source -> source
    e.connectionMode === st.Strict ? r?.target ?? [] : (r?.target ?? []).concat(r?.source ?? []),
    e.targetHandle
  );
  if (!i || !s)
    return e.onError?.("008", ve.error008(i ? "target" : "source", {
      id: e.id,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle
    })), null;
  const a = i?.position || Z.Bottom, l = s?.position || Z.Top, c = Je(t, i, a), u = Je(n, s, l);
  return {
    sourceX: c.x,
    sourceY: c.y,
    targetX: u.x,
    targetY: u.y,
    sourcePosition: a,
    targetPosition: l
  };
}
function Qo(e) {
  if (!e)
    return null;
  const t = [], n = [];
  for (const o of e)
    o.width = o.width ?? 1, o.height = o.height ?? 1, o.type === "source" ? t.push(o) : o.type === "target" && n.push(o);
  return {
    source: t,
    target: n
  };
}
function Je(e, t, n = Z.Left, o = !1) {
  const r = (t?.x ?? 0) + e.internals.positionAbsolute.x, i = (t?.y ?? 0) + e.internals.positionAbsolute.y, { width: s, height: a } = t ?? Ie(e);
  if (o)
    return { x: r + s / 2, y: i + a / 2 };
  switch (t?.position ?? n) {
    case Z.Top:
      return { x: r + s / 2, y: i };
    case Z.Right:
      return { x: r + s, y: i + a / 2 };
    case Z.Bottom:
      return { x: r + s / 2, y: i + a };
    case Z.Left:
      return { x: r, y: i + a / 2 };
  }
}
function Jo(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function Zn(e, t) {
  return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((o) => `${o}=${e[o]}`).join("&")}` : "";
}
function Ld(e, { id: t, defaultColor: n, defaultMarkerStart: o, defaultMarkerEnd: r }) {
  const i = /* @__PURE__ */ new Set();
  return e.reduce((s, a) => ([a.markerStart || o, a.markerEnd || r].forEach((l) => {
    if (l && typeof l == "object") {
      const c = Zn(l, t);
      i.has(c) || (s.push({ id: c, color: l.color || n, ...l }), i.add(c));
    }
  }), s), []).sort((s, a) => s.id.localeCompare(a.id));
}
const Di = 1e3, Vd = 10, co = {
  nodeOrigin: [0, 0],
  nodeExtent: _t,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, Od = {
  ...co,
  checkEquality: !0
};
function lo(e, t) {
  const n = { ...e };
  for (const o in t)
    t[o] !== void 0 && (n[o] = t[o]);
  return n;
}
function Bd(e, t, n) {
  const o = lo(co, n);
  for (const r of e.values())
    if (r.parentId)
      fo(r, e, t, o);
    else {
      const i = At(r, o.nodeOrigin), s = Qe(r.extent) ? r.extent : o.nodeExtent, a = Ke(i, s, Ie(r));
      r.internals.positionAbsolute = a;
    }
}
function Fd(e, t) {
  if (!e.handles)
    return e.measured ? t?.internals.handleBounds : void 0;
  const n = [], o = [];
  for (const r of e.handles) {
    const i = {
      id: r.id,
      width: r.width ?? 1,
      height: r.height ?? 1,
      nodeId: e.id,
      x: r.x,
      y: r.y,
      position: r.position,
      type: r.type
    };
    r.type === "source" ? n.push(i) : r.type === "target" && o.push(i);
  }
  return {
    source: n,
    target: o
  };
}
function uo(e) {
  return e === "manual";
}
function Wn(e, t, n, o = {}) {
  const r = lo(Od, o), i = { i: 0 }, s = new Map(t), a = r?.elevateNodesOnSelect && !uo(r.zIndexMode) ? Di : 0;
  let l = e.length > 0, c = !1;
  t.clear(), n.clear();
  for (const u of e) {
    let d = s.get(u.id);
    if (r.checkEquality && u === d?.internals.userNode)
      t.set(u.id, d);
    else {
      const f = At(u, r.nodeOrigin), h = Qe(u.extent) ? u.extent : r.nodeExtent, g = Ke(f, h, Ie(u));
      d = {
        ...r.defaults,
        ...u,
        measured: {
          width: u.measured?.width,
          height: u.measured?.height
        },
        internals: {
          positionAbsolute: g,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: Fd(u, d),
          z: zi(u, a, r.zIndexMode),
          userNode: u
        }
      }, t.set(u.id, d);
    }
    (d.measured === void 0 || d.measured.width === void 0 || d.measured.height === void 0) && !d.hidden && (l = !1), u.parentId && fo(d, t, n, o, i), c ||= u.selected ?? !1;
  }
  return { nodesInitialized: l, hasSelectedNodes: c };
}
function Xd(e, t) {
  if (!e.parentId)
    return;
  const n = t.get(e.parentId);
  n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function fo(e, t, n, o, r) {
  const { elevateNodesOnSelect: i, nodeOrigin: s, nodeExtent: a, zIndexMode: l } = lo(co, o), c = e.parentId, u = t.get(c);
  if (!u) {
    console.warn(`Parent node ${c} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  Xd(e, n), r && !u.parentId && u.internals.rootParentIndex === void 0 && l === "auto" && (u.internals.rootParentIndex = ++r.i, u.internals.z = u.internals.z + r.i * Vd), r && u.internals.rootParentIndex !== void 0 && (r.i = u.internals.rootParentIndex);
  const d = i && !uo(l) ? Di : 0, { x: f, y: h, z: g } = Yd(e, u, s, a, d, l), { positionAbsolute: v } = e.internals, w = f !== v.x || h !== v.y;
  (w || g !== e.internals.z) && t.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: w ? { x: f, y: h } : v,
      z: g
    }
  });
}
function zi(e, t, n) {
  const o = me(e.zIndex) ? e.zIndex : 0;
  return uo(n) ? o : o + (e.selected ? t : 0);
}
function Yd(e, t, n, o, r, i) {
  const { x: s, y: a } = t.internals.positionAbsolute, l = Ie(e), c = At(e, n), u = Qe(e.extent) ? Ke(c, e.extent, l) : c;
  let d = Ke({ x: s + u.x, y: a + u.y }, o, l);
  e.extent === "parent" && (d = vi(d, l, t));
  const f = zi(e, r, i), h = t.internals.z ?? 0;
  return {
    x: d.x,
    y: d.y,
    z: h >= f ? h + 1 : f
  };
}
function ho(e, t, n, o = [0, 0]) {
  const r = [], i = /* @__PURE__ */ new Map();
  for (const s of e) {
    const a = t.get(s.parentId);
    if (!a)
      continue;
    const l = i.get(s.parentId)?.expandedRect ?? Et(a), c = bi(l, s.rect);
    i.set(s.parentId, { expandedRect: c, parent: a });
  }
  return i.size > 0 && i.forEach(({ expandedRect: s, parent: a }, l) => {
    const c = a.internals.positionAbsolute, u = Ie(a), d = a.origin ?? o, f = s.x < c.x ? Math.round(Math.abs(c.x - s.x)) : 0, h = s.y < c.y ? Math.round(Math.abs(c.y - s.y)) : 0, g = Math.max(u.width, Math.round(s.width)), v = Math.max(u.height, Math.round(s.height)), w = (g - u.width) * d[0], m = (v - u.height) * d[1];
    (f > 0 || h > 0 || w || m) && (r.push({
      id: l,
      type: "position",
      position: {
        x: a.position.x - f + w,
        y: a.position.y - h + m
      }
    }), n.get(l)?.forEach((_) => {
      e.some((p) => p.id === _.id) || r.push({
        id: _.id,
        type: "position",
        position: {
          x: _.position.x + f,
          y: _.position.y + h
        }
      });
    })), (u.width < s.width || u.height < s.height || f || h) && r.push({
      id: l,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: g + (f ? d[0] * f - w : 0),
        height: v + (h ? d[1] * h - m : 0)
      }
    });
  }), r;
}
function Zd(e, t, n, o, r, i, s) {
  const a = o?.querySelector(".xyflow__viewport");
  let l = !1;
  if (!a)
    return { changes: [], updatedInternals: l };
  const c = [], u = window.getComputedStyle(a), { m22: d } = new window.DOMMatrixReadOnly(u.transform), f = [];
  for (const h of e.values()) {
    const g = t.get(h.id);
    if (!g)
      continue;
    if (g.hidden) {
      t.set(g.id, {
        ...g,
        internals: {
          ...g.internals,
          handleBounds: void 0
        }
      }), l = !0;
      continue;
    }
    const v = ao(h.nodeElement), w = g.measured.width !== v.width || g.measured.height !== v.height;
    if (!!(v.width && v.height && (w || !g.internals.handleBounds || h.force))) {
      const _ = h.nodeElement.getBoundingClientRect(), p = Qe(g.extent) ? g.extent : i;
      let { positionAbsolute: x } = g.internals;
      if (g.parentId && g.extent === "parent") {
        const b = t.get(g.parentId);
        b && (x = vi(x, v, b));
      } else p && (x = Ke(x, p, v));
      const N = {
        ...g,
        measured: v,
        internals: {
          ...g.internals,
          positionAbsolute: x,
          handleBounds: {
            source: Wo("source", h.nodeElement, _, d, g.id),
            target: Wo("target", h.nodeElement, _, d, g.id)
          }
        }
      };
      t.set(g.id, N), g.parentId && fo(N, t, n, { nodeOrigin: r, zIndexMode: s }), l = !0, w && (c.push({
        id: g.id,
        type: "dimensions",
        dimensions: v
      }), g.expandParent && g.parentId && f.push({
        id: g.id,
        parentId: g.parentId,
        rect: Et(N, r)
      }));
    }
  }
  if (f.length > 0) {
    const h = ho(f, t, n, r);
    c.push(...h);
  }
  return { changes: c, updatedInternals: l };
}
async function Wd({ delta: e, panZoom: t, transform: n, translateExtent: o, width: r, height: i }) {
  if (!t || !e.x && !e.y)
    return !1;
  const s = await t.setViewportConstrained({
    x: n[0] + e.x,
    y: n[1] + e.y,
    zoom: n[2]
  }, [
    [0, 0],
    [r, i]
  ], o);
  return !!s && (s.x !== n[0] || s.y !== n[1] || s.k !== n[2]);
}
function jo(e, t, n, o, r, i) {
  let s = r;
  const a = o.get(s) || /* @__PURE__ */ new Map();
  o.set(s, a.set(n, t)), s = `${r}-${e}`;
  const l = o.get(s) || /* @__PURE__ */ new Map();
  if (o.set(s, l.set(n, t)), i) {
    s = `${r}-${e}-${i}`;
    const c = o.get(s) || /* @__PURE__ */ new Map();
    o.set(s, c.set(n, t));
  }
}
function Ti(e, t, n) {
  e.clear(), t.clear();
  for (const o of n) {
    const { source: r, target: i, sourceHandle: s = null, targetHandle: a = null } = o, l = { edgeId: o.id, source: r, target: i, sourceHandle: s, targetHandle: a }, c = `${r}-${s}--${i}-${a}`, u = `${i}-${a}--${r}-${s}`;
    jo("source", l, u, e, r, s), jo("target", l, c, e, i, a), t.set(o.id, o);
  }
}
function Hi(e, t) {
  if (!e.parentId)
    return !1;
  const n = t.get(e.parentId);
  return n ? n.selected ? !0 : Hi(n, t) : !1;
}
function er(e, t, n) {
  let o = e;
  do {
    if (o?.matches?.(t))
      return !0;
    if (o === n)
      return !1;
    o = o?.parentElement;
  } while (o);
  return !1;
}
function qd(e, t, n, o) {
  const r = /* @__PURE__ */ new Map();
  for (const [i, s] of e)
    if ((s.selected || s.id === o) && (!s.parentId || !Hi(s, e)) && (s.draggable || t && typeof s.draggable > "u")) {
      const a = e.get(i);
      a && r.set(i, {
        id: i,
        position: a.position || { x: 0, y: 0 },
        distance: {
          x: n.x - a.internals.positionAbsolute.x,
          y: n.y - a.internals.positionAbsolute.y
        },
        extent: a.extent,
        parentId: a.parentId,
        origin: a.origin,
        expandParent: a.expandParent,
        internals: {
          positionAbsolute: a.internals.positionAbsolute || { x: 0, y: 0 }
        },
        measured: {
          width: a.measured.width ?? 0,
          height: a.measured.height ?? 0
        }
      });
    }
  return r;
}
function Cn({ nodeId: e, dragItems: t, nodeLookup: n, dragging: o = !0 }) {
  const r = [];
  for (const [s, a] of t) {
    const l = n.get(s)?.internals.userNode;
    l && r.push({
      ...l,
      position: a.position,
      dragging: o
    });
  }
  if (!e)
    return [r[0], r];
  const i = n.get(e)?.internals.userNode;
  return [
    i ? {
      ...i,
      position: t.get(e)?.position || i.position,
      dragging: o
    } : r[0],
    r
  ];
}
function Gd({ dragItems: e, snapGrid: t, x: n, y: o }) {
  const r = e.values().next().value;
  if (!r)
    return null;
  const i = {
    x: n - r.distance.x,
    y: o - r.distance.y
  }, s = $t(i, t);
  return {
    x: s.x - i.x,
    y: s.y - i.y
  };
}
function Ud({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: o, onDragStop: r }) {
  let i = { x: null, y: null }, s = 0, a = /* @__PURE__ */ new Map(), l = !1, c = { x: 0, y: 0 }, u = null, d = !1, f = null, h = !1, g = !1, v = null;
  function w({ noDragClassName: _, handleSelector: p, domNode: x, isSelectable: N, nodeId: b, nodeClickDistance: C = 0 }) {
    f = de(x);
    function I({ x: R, y: D }) {
      const { nodeLookup: y, nodeExtent: S, snapGrid: E, snapToGrid: M, nodeOrigin: $, onNodeDrag: k, onSelectionDrag: V, onError: L, updateNodePositions: H } = t();
      i = { x: R, y: D };
      let X = !1;
      const F = a.size > 1, W = F && S ? Xn(kt(a)) : null, Q = F && M ? Gd({
        dragItems: a,
        snapGrid: E,
        x: R,
        y: D
      }) : null;
      for (const [q, z] of a) {
        if (!y.has(q))
          continue;
        let B = { x: R - z.distance.x, y: D - z.distance.y };
        M && (B = Q ? {
          x: Math.round(B.x + Q.x),
          y: Math.round(B.y + Q.y)
        } : $t(B, E));
        let K = null;
        if (F && S && !z.extent && W) {
          const { positionAbsolute: G } = z.internals, J = G.x - W.x + S[0][0], te = G.x + z.measured.width - W.x2 + S[1][0], re = G.y - W.y + S[0][1], le = G.y + z.measured.height - W.y2 + S[1][1];
          K = [
            [J, re],
            [te, le]
          ];
        }
        const { position: U, positionAbsolute: Y } = xi({
          nodeId: q,
          nextPosition: B,
          nodeLookup: y,
          nodeExtent: K || S,
          nodeOrigin: $,
          onError: L
        });
        X = X || z.position.x !== U.x || z.position.y !== U.y, z.position = U, z.internals.positionAbsolute = Y;
      }
      if (g = g || X, !!X && (H(a, !0), v && (o || k || !b && V))) {
        const [q, z] = Cn({
          nodeId: b,
          dragItems: a,
          nodeLookup: y
        });
        o?.(v, a, q, z), k?.(v, q, z), b || V?.(v, z);
      }
    }
    async function A() {
      if (!u)
        return;
      const { transform: R, panBy: D, autoPanSpeed: y, autoPanOnNodeDrag: S } = t();
      if (!S) {
        l = !1, cancelAnimationFrame(s);
        return;
      }
      const [E, M] = io(c, u, y);
      (E !== 0 || M !== 0) && (i.x = (i.x ?? 0) - E / R[2], i.y = (i.y ?? 0) - M / R[2], await D({ x: E, y: M }) && I(i)), s = requestAnimationFrame(A);
    }
    function O(R) {
      const { nodeLookup: D, multiSelectionActive: y, nodesDraggable: S, transform: E, snapGrid: M, snapToGrid: $, selectNodesOnDrag: k, onNodeDragStart: V, onSelectionDragStart: L, unselectNodesAndEdges: H } = t();
      d = !0, (!k || !N) && !y && b && (D.get(b)?.selected || H()), N && k && b && e?.(b);
      const X = yt(R.sourceEvent, { transform: E, snapGrid: M, snapToGrid: $, containerBounds: u });
      if (i = X, a = qd(D, S, X, b), a.size > 0 && (n || V || !b && L)) {
        const [F, W] = Cn({
          nodeId: b,
          dragItems: a,
          nodeLookup: D
        });
        n?.(R.sourceEvent, a, F, W), V?.(R.sourceEvent, F, W), b || L?.(R.sourceEvent, W);
      }
    }
    const P = Jr().clickDistance(C).on("start", (R) => {
      const { domNode: D, nodeDragThreshold: y, transform: S, snapGrid: E, snapToGrid: M } = t();
      u = D?.getBoundingClientRect() || null, h = !1, g = !1, v = R.sourceEvent, y === 0 && O(R), i = yt(R.sourceEvent, { transform: S, snapGrid: E, snapToGrid: M, containerBounds: u }), c = ye(R.sourceEvent, u);
    }).on("drag", (R) => {
      const { autoPanOnNodeDrag: D, transform: y, snapGrid: S, snapToGrid: E, nodeDragThreshold: M, nodeLookup: $ } = t(), k = yt(R.sourceEvent, { transform: y, snapGrid: S, snapToGrid: E, containerBounds: u });
      if (v = R.sourceEvent, (R.sourceEvent.type === "touchmove" && R.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      b && !$.has(b)) && (h = !0), !h) {
        if (!l && D && d && (l = !0, A()), !d) {
          const V = ye(R.sourceEvent, u), L = V.x - c.x, H = V.y - c.y;
          Math.sqrt(L * L + H * H) > M && O(R);
        }
        (i.x !== k.xSnapped || i.y !== k.ySnapped) && a && d && (c = ye(R.sourceEvent, u), I(k));
      }
    }).on("end", (R) => {
      if (!d || h) {
        h && a.size > 0 && t().updateNodePositions(a, !1);
        return;
      }
      if (l = !1, d = !1, cancelAnimationFrame(s), a.size > 0) {
        const { nodeLookup: D, updateNodePositions: y, onNodeDragStop: S, onSelectionDragStop: E } = t();
        if (g && (y(a, !1), g = !1), r || S || !b && E) {
          const [M, $] = Cn({
            nodeId: b,
            dragItems: a,
            nodeLookup: D,
            dragging: !1
          });
          r?.(R.sourceEvent, a, M, $), S?.(R.sourceEvent, M, $), b || E?.(R.sourceEvent, $);
        }
      }
    }).filter((R) => {
      const D = R.target;
      return !R.button && (!_ || !er(D, `.${_}`, x)) && (!p || er(D, p, x));
    });
    f.call(P);
  }
  function m() {
    f?.on(".drag", null);
  }
  return {
    update: w,
    destroy: m
  };
}
function Kd(e, t, n) {
  const o = [], r = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const i of t.values())
    nn(r, Et(i)) > 0 && o.push(i);
  return o;
}
const Qd = 250;
function Jd(e, t, n, o) {
  let r = [], i = 1 / 0;
  const s = Kd(e, n, t + Qd);
  for (const a of s) {
    const l = [...a.internals.handleBounds?.source ?? [], ...a.internals.handleBounds?.target ?? []];
    for (const c of l) {
      if (o.nodeId === c.nodeId && o.type === c.type && o.id === c.id)
        continue;
      const { x: u, y: d } = Je(a, c, c.position, !0), f = Math.sqrt(Math.pow(u - e.x, 2) + Math.pow(d - e.y, 2));
      f > t || (f < i ? (r = [{ ...c, x: u, y: d }], i = f) : f === i && r.push({ ...c, x: u, y: d }));
    }
  }
  if (!r.length)
    return null;
  if (r.length > 1) {
    const a = o.type === "source" ? "target" : "source";
    return r.find((l) => l.type === a) ?? r[0];
  }
  return r[0];
}
function Ri(e, t, n, o, r, i = !1) {
  const s = o.get(e);
  if (!s)
    return null;
  const a = r === "strict" ? s.internals.handleBounds?.[t] : [...s.internals.handleBounds?.source ?? [], ...s.internals.handleBounds?.target ?? []], l = (n ? a?.find((c) => c.id === n) : a?.[0]) ?? null;
  return l && i ? { ...l, ...Je(s, l, l.position, !0) } : l;
}
function Li(e, t) {
  return e || (t?.classList.contains("target") ? "target" : t?.classList.contains("source") ? "source" : null);
}
function jd(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
const Vi = () => !0;
function ef(e, { connectionMode: t, connectionRadius: n, handleId: o, nodeId: r, edgeUpdaterType: i, isTarget: s, domNode: a, nodeLookup: l, lib: c, autoPanOnConnect: u, flowId: d, panBy: f, cancelConnection: h, onConnectStart: g, onConnect: v, onConnectEnd: w, isValidConnection: m = Vi, onReconnectEnd: _, updateConnection: p, getTransform: x, getFromHandle: N, autoPanSpeed: b, dragThreshold: C = 1, handleDomNode: I }) {
  const A = Ci(e.target);
  let O = 0, P;
  const { x: R, y: D } = ye(e), y = Li(i, I), S = a?.getBoundingClientRect();
  let E = !1;
  if (!S || !y)
    return;
  const M = Ri(r, y, o, l, t);
  if (!M)
    return;
  let $ = ye(e, S), k = !1, V = null, L = !1, H = null;
  function X() {
    if (!u || !S)
      return;
    const [U, Y] = io($, S, b);
    f({ x: U, y: Y }), O = requestAnimationFrame(X);
  }
  const F = {
    ...M,
    nodeId: r,
    type: y,
    position: M.position
  }, W = l.get(r);
  let q = {
    inProgress: !0,
    isValid: null,
    from: Je(W, F, Z.Left, !0),
    fromHandle: F,
    fromPosition: F.position,
    fromNode: W,
    to: $,
    toHandle: null,
    toPosition: Fo[F.position],
    toNode: null,
    pointer: $
  };
  function z() {
    E = !0, p(q), g?.(e, { nodeId: r, handleId: o, handleType: y });
  }
  C === 0 && z();
  function B(U) {
    if (!E) {
      const { x: le, y: Ae } = ye(U), _e = le - R, Se = Ae - D;
      if (!(_e * _e + Se * Se > C * C))
        return;
      z();
    }
    if (!N() || !F) {
      K(U);
      return;
    }
    const Y = x();
    $ = ye(U, S), P = Jd(Pt($, Y, !1, [1, 1]), n, l, F), k || (X(), k = !0);
    const G = Oi(U, {
      handle: P,
      connectionMode: t,
      fromNodeId: r,
      fromHandleId: o,
      fromType: s ? "target" : "source",
      isValidConnection: m,
      doc: A,
      lib: c,
      flowId: d,
      nodeLookup: l
    });
    H = G.handleDomNode, V = G.connection, L = jd(!!P, G.isValid);
    const J = l.get(r), te = J ? Je(J, F, Z.Left, !0) : q.from, re = {
      ...q,
      from: te,
      isValid: L,
      to: G.toHandle && L ? ct({ x: G.toHandle.x, y: G.toHandle.y }, Y) : $,
      toHandle: G.toHandle,
      toPosition: L && G.toHandle ? G.toHandle.position : Fo[F.position],
      toNode: G.toHandle ? l.get(G.toHandle.nodeId) : null,
      pointer: $
    };
    p(re), q = re;
  }
  function K(U) {
    if (!("touches" in U && U.touches.length > 0)) {
      if (E) {
        (P || H) && V && L && v?.(V);
        const { inProgress: Y, ...G } = q, J = {
          ...G,
          toPosition: q.toHandle ? q.toPosition : null
        };
        w?.(U, J), i && _?.(U, J);
      }
      h(), cancelAnimationFrame(O), k = !1, L = !1, V = null, H = null, A.removeEventListener("mousemove", B), A.removeEventListener("mouseup", K), A.removeEventListener("touchmove", B), A.removeEventListener("touchend", K);
    }
  }
  A.addEventListener("mousemove", B), A.addEventListener("mouseup", K), A.addEventListener("touchmove", B), A.addEventListener("touchend", K);
}
function Oi(e, { handle: t, connectionMode: n, fromNodeId: o, fromHandleId: r, fromType: i, doc: s, lib: a, flowId: l, isValidConnection: c = Vi, nodeLookup: u }) {
  const d = i === "target", f = t ? s.querySelector(`.${a}-flow__handle[data-id="${l}-${t?.nodeId}-${t?.id}-${t?.type}"]`) : null, { x: h, y: g } = ye(e), v = s.elementFromPoint(h, g), w = v?.classList.contains(`${a}-flow__handle`) ? v : f, m = {
    handleDomNode: w,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (w) {
    const _ = Li(void 0, w), p = w.getAttribute("data-nodeid"), x = w.getAttribute("data-handleid"), N = w.classList.contains("connectable"), b = w.classList.contains("connectableend");
    if (!p || !_)
      return m;
    const C = {
      source: d ? p : o,
      sourceHandle: d ? x : r,
      target: d ? o : p,
      targetHandle: d ? r : x
    };
    m.connection = C;
    const A = N && b && (n === st.Strict ? d && _ === "source" || !d && _ === "target" : p !== o || x !== r);
    m.isValid = A && c(C), m.toHandle = Ri(p, _, x, u, n, !0);
  }
  return m;
}
const qn = {
  onPointerDown: ef,
  isValid: Oi
};
function tf({ domNode: e, panZoom: t, getTransform: n, getViewScale: o }) {
  const r = de(e);
  function i({ translateExtent: a, width: l, height: c, zoomStep: u = 1, pannable: d = !0, zoomable: f = !0, inversePan: h = !1 }) {
    const g = (p) => {
      if (p.sourceEvent.type !== "wheel" || !t)
        return;
      const x = n(), N = p.sourceEvent.ctrlKey && Nt() ? 10 : 1, b = -p.sourceEvent.deltaY * (p.sourceEvent.deltaMode === 1 ? 0.05 : p.sourceEvent.deltaMode ? 1 : 2e-3) * u, C = x[2] * Math.pow(2, b * N);
      t.scaleTo(C);
    };
    let v = [0, 0];
    const w = (p) => {
      (p.sourceEvent.type === "mousedown" || p.sourceEvent.type === "touchstart") && (v = [
        p.sourceEvent.clientX ?? p.sourceEvent.touches[0].clientX,
        p.sourceEvent.clientY ?? p.sourceEvent.touches[0].clientY
      ]);
    }, m = (p) => {
      const x = n();
      if (p.sourceEvent.type !== "mousemove" && p.sourceEvent.type !== "touchmove" || !t)
        return;
      const N = [
        p.sourceEvent.clientX ?? p.sourceEvent.touches[0].clientX,
        p.sourceEvent.clientY ?? p.sourceEvent.touches[0].clientY
      ], b = [N[0] - v[0], N[1] - v[1]];
      v = N;
      const C = o() * Math.max(x[2], Math.log(x[2])) * (h ? -1 : 1), I = {
        x: x[0] - b[0] * C,
        y: x[1] - b[1] * C
      }, A = [
        [0, 0],
        [l, c]
      ];
      t.setViewportConstrained({
        x: I.x,
        y: I.y,
        zoom: x[2]
      }, A, a);
    }, _ = hi().on("start", w).on("zoom", d ? m : null).on("zoom.wheel", f ? g : null);
    r.call(_, {});
  }
  function s() {
    r.on("zoom", null);
  }
  return {
    update: i,
    destroy: s,
    pointer: ge
  };
}
const gn = (e) => ({
  x: e.x,
  y: e.y,
  zoom: e.k
}), Mn = ({ x: e, y: t, zoom: n }) => dn.translate(e, t).scale(n), et = (e, t) => e.target.closest(`.${t}`), Bi = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), nf = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, In = (e, t = 0, n = nf, o = () => {
}) => {
  const r = typeof t == "number" && t > 0;
  return r || o(), r ? e.transition().duration(t).ease(n).on("end", o) : e;
}, Fi = (e) => {
  const t = e.ctrlKey && Nt() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
};
function of({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: o, panOnScrollMode: r, panOnScrollSpeed: i, zoomOnPinch: s, onPanZoomStart: a, onPanZoom: l, onPanZoomEnd: c }) {
  return (u) => {
    if (et(u, t))
      return u.ctrlKey && u.preventDefault(), !1;
    u.preventDefault(), u.stopImmediatePropagation();
    const d = n.property("__zoom").k || 1;
    if (u.ctrlKey && s) {
      const w = ge(u), m = Fi(u), _ = d * Math.pow(2, m);
      o.scaleTo(n, _, w, u);
      return;
    }
    const f = u.deltaMode === 1 ? 20 : 1;
    let h = r === qe.Vertical ? 0 : u.deltaX * f, g = r === qe.Horizontal ? 0 : u.deltaY * f;
    !Nt() && u.shiftKey && r !== qe.Vertical && (h = u.deltaY * f, g = 0), o.translateBy(
      n,
      -(h / d) * i,
      -(g / d) * i,
      // @ts-ignore
      { internal: !0 }
    );
    const v = gn(n.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? l?.(u, v) : (e.isPanScrolling = !0, a?.(u, v)), e.panScrollTimeout = setTimeout(() => {
      c?.(u, v), e.isPanScrolling = !1;
    }, 150);
  };
}
function rf({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
  return function(o, r) {
    const i = o.type === "wheel", s = !t && i && !o.ctrlKey, a = et(o, e);
    if (o.ctrlKey && i && a && o.preventDefault(), s || a)
      return null;
    o.preventDefault(), n.call(this, o, r);
  };
}
function sf({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
  return (o) => {
    if (o.sourceEvent?.internal)
      return;
    const r = gn(o.transform);
    e.mouseButton = o.sourceEvent?.button || 0, e.isZoomingOrPanning = !0, e.prevViewport = r, o.sourceEvent?.type === "mousedown" && t(!0), n && n?.(o.sourceEvent, r);
  };
}
function af({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: o, onPanZoom: r }) {
  return (i) => {
    e.usedRightMouseButton = !!(n && Bi(t, e.mouseButton ?? 0)), i.sourceEvent?.sync || o([i.transform.x, i.transform.y, i.transform.k]), r && !i.sourceEvent?.internal && r?.(i.sourceEvent, gn(i.transform));
  };
}
function cf({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: o, onPanZoomEnd: r, onPaneContextMenu: i }) {
  return (s) => {
    if (!s.sourceEvent?.internal && (e.isZoomingOrPanning = !1, i && Bi(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && s.sourceEvent && i(s.sourceEvent), e.usedRightMouseButton = !1, o(!1), r)) {
      const a = gn(s.transform);
      e.prevViewport = a, clearTimeout(e.timerId), e.timerId = setTimeout(
        () => {
          r?.(s.sourceEvent, a);
        },
        // we need a setTimeout for panOnScroll to suppress multiple end events fired during scroll
        n ? 150 : 0
      );
    }
  };
}
function lf({ zoomActivationKeyPressed: e, zoomOnScroll: t, zoomOnPinch: n, panOnDrag: o, panOnScroll: r, zoomOnDoubleClick: i, userSelectionActive: s, noWheelClassName: a, noPanClassName: l, lib: c, connectionInProgress: u }) {
  return (d) => {
    const f = e || t, h = n && d.ctrlKey, g = d.type === "wheel";
    if (d.button === 1 && d.type === "mousedown" && (et(d, `${c}-flow__node`) || et(d, `${c}-flow__edge`)))
      return !0;
    if (!o && !f && !r && !i && !n || s || u && !g || et(d, a) && g || et(d, l) && (!g || r && g && !e) || !n && d.ctrlKey && g)
      return !1;
    if (!n && d.type === "touchstart" && d.touches?.length > 1)
      return d.preventDefault(), !1;
    if (!f && !r && !h && g || !o && (d.type === "mousedown" || d.type === "touchstart") || Array.isArray(o) && !o.includes(d.button) && d.type === "mousedown")
      return !1;
    const v = Array.isArray(o) && o.includes(d.button) || !d.button || d.button <= 1;
    return (!d.ctrlKey || g) && v;
  };
}
function uf({ domNode: e, minZoom: t, maxZoom: n, translateExtent: o, viewport: r, onPanZoom: i, onPanZoomStart: s, onPanZoomEnd: a, onDraggingChange: l }) {
  const c = {
    isZoomingOrPanning: !1,
    usedRightMouseButton: !1,
    prevViewport: {},
    mouseButton: 0,
    timerId: void 0,
    panScrollTimeout: void 0,
    isPanScrolling: !1
  }, u = e.getBoundingClientRect();
  let d = [
    [0, 0],
    [u.width, u.height]
  ];
  (typeof ResizeObserver < "u" ? new ResizeObserver((D) => {
    const y = D[0];
    y && (d = [
      [0, 0],
      [y.contentRect.width, y.contentRect.height]
    ]);
  }) : null)?.observe(e);
  const h = hi().extent(() => d).scaleExtent([t, n]).translateExtent(o), g = de(e).call(h);
  x({
    x: r.x,
    y: r.y,
    zoom: at(r.zoom, t, n)
  }, [
    [0, 0],
    [u.width, u.height]
  ], o);
  const v = g.on("wheel.zoom"), w = g.on("dblclick.zoom");
  h.wheelDelta(Fi);
  async function m(D, y) {
    return g ? new Promise((S) => {
      h?.interpolate(y?.interpolate === "linear" ? mt : Xt).transform(In(g, y?.duration, y?.ease, () => S(!0)), D);
    }) : !1;
  }
  function _({ noWheelClassName: D, noPanClassName: y, onPaneContextMenu: S, userSelectionActive: E, panOnScroll: M, panOnDrag: $, panOnScrollMode: k, panOnScrollSpeed: V, preventScrolling: L, zoomOnPinch: H, zoomOnScroll: X, zoomOnDoubleClick: F, zoomActivationKeyPressed: W, lib: Q, onTransformChange: q, connectionInProgress: z, paneClickDistance: B, selectionOnDrag: K }) {
    E && !c.isZoomingOrPanning && p();
    const U = M && !W && !E;
    h.clickDistance(K ? 1 / 0 : !me(B) || B < 0 ? 0 : B);
    const Y = U ? of({
      zoomPanValues: c,
      noWheelClassName: D,
      d3Selection: g,
      d3Zoom: h,
      panOnScrollMode: k,
      panOnScrollSpeed: V,
      zoomOnPinch: H,
      onPanZoomStart: s,
      onPanZoom: i,
      onPanZoomEnd: a
    }) : rf({
      noWheelClassName: D,
      preventScrolling: L,
      d3ZoomHandler: v
    });
    g.on("wheel.zoom", Y, { passive: !1 });
    const G = sf({
      zoomPanValues: c,
      onDraggingChange: l,
      onPanZoomStart: s
    });
    h.on("start", G);
    const J = af({
      zoomPanValues: c,
      panOnDrag: $,
      onPaneContextMenu: !!S,
      onPanZoom: i,
      onTransformChange: q
    });
    h.on("zoom", J);
    const te = cf({
      zoomPanValues: c,
      panOnDrag: $,
      panOnScroll: M,
      onPaneContextMenu: S,
      onPanZoomEnd: a,
      onDraggingChange: l
    });
    h.on("end", te);
    const re = lf({
      zoomActivationKeyPressed: W,
      panOnDrag: $,
      zoomOnScroll: X,
      panOnScroll: M,
      zoomOnDoubleClick: F,
      zoomOnPinch: H,
      userSelectionActive: E,
      noPanClassName: y,
      noWheelClassName: D,
      lib: Q,
      connectionInProgress: z
    });
    h.filter(re), F ? g.on("dblclick.zoom", w) : g.on("dblclick.zoom", null);
  }
  function p() {
    h.on("zoom", null);
  }
  async function x(D, y, S) {
    const E = Mn(D), M = h?.constrain()(E, y, S);
    return M && await m(M), M;
  }
  async function N(D, y) {
    const S = Mn(D);
    return await m(S, y), S;
  }
  function b(D) {
    if (g) {
      const y = Mn(D), S = g.property("__zoom");
      (S.k !== D.zoom || S.x !== D.x || S.y !== D.y) && h?.transform(g, y, null, { sync: !0 });
    }
  }
  function C() {
    const D = g ? fi(g.node()) : { x: 0, y: 0, k: 1 };
    return { x: D.x, y: D.y, zoom: D.k };
  }
  async function I(D, y) {
    return g ? new Promise((S) => {
      h?.interpolate(y?.interpolate === "linear" ? mt : Xt).scaleTo(In(g, y?.duration, y?.ease, () => S(!0)), D);
    }) : !1;
  }
  async function A(D, y) {
    return g ? new Promise((S) => {
      h?.interpolate(y?.interpolate === "linear" ? mt : Xt).scaleBy(In(g, y?.duration, y?.ease, () => S(!0)), D);
    }) : !1;
  }
  function O(D) {
    h?.scaleExtent(D);
  }
  function P(D) {
    h?.translateExtent(D);
  }
  function R(D) {
    const y = !me(D) || D < 0 ? 0 : D;
    h?.clickDistance(y);
  }
  return {
    update: _,
    destroy: p,
    setViewport: N,
    setViewportConstrained: x,
    getViewport: C,
    scaleTo: I,
    scaleBy: A,
    setScaleExtent: O,
    setTranslateExtent: P,
    syncViewport: b,
    setClickDistance: R
  };
}
var lt;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(lt || (lt = {}));
function df({ width: e, prevWidth: t, height: n, prevHeight: o, affectsX: r, affectsY: i }) {
  const s = e - t, a = n - o, l = [s > 0 ? 1 : s < 0 ? -1 : 0, a > 0 ? 1 : a < 0 ? -1 : 0];
  return s && r && (l[0] = l[0] * -1), a && i && (l[1] = l[1] * -1), l;
}
function tr(e) {
  const t = e.includes("right") || e.includes("left"), n = e.includes("bottom") || e.includes("top"), o = e.includes("left"), r = e.includes("top");
  return {
    isHorizontal: t,
    isVertical: n,
    affectsX: o,
    affectsY: r
  };
}
function Re(e, t) {
  return Math.max(0, t - e);
}
function Le(e, t) {
  return Math.max(0, e - t);
}
function Vt(e, t, n) {
  return Math.max(0, t - e, e - n);
}
function nr(e, t) {
  return e ? !t : t;
}
function ff(e, t, n, o, r, i, s, a) {
  let { affectsX: l, affectsY: c } = t;
  const { isHorizontal: u, isVertical: d } = t, f = u && d, { xSnapped: h, ySnapped: g } = n, { minWidth: v, maxWidth: w, minHeight: m, maxHeight: _ } = o, { x: p, y: x, width: N, height: b, aspectRatio: C } = e;
  let I = Math.floor(u ? h - e.pointerX : 0), A = Math.floor(d ? g - e.pointerY : 0);
  const O = N + (l ? -I : I), P = b + (c ? -A : A), R = -i[0] * N, D = -i[1] * b;
  let y = Vt(O, v, w), S = Vt(P, m, _);
  if (s) {
    let $ = 0, k = 0;
    l && I < 0 ? $ = Re(p + I + R, s[0][0]) : !l && I > 0 && ($ = Le(p + O + R, s[1][0])), c && A < 0 ? k = Re(x + A + D, s[0][1]) : !c && A > 0 && (k = Le(x + P + D, s[1][1])), y = Math.max(y, $), S = Math.max(S, k);
  }
  if (a) {
    let $ = 0, k = 0;
    l && I > 0 ? $ = Le(p + I, a[0][0]) : !l && I < 0 && ($ = Re(p + O, a[1][0])), c && A > 0 ? k = Le(x + A, a[0][1]) : !c && A < 0 && (k = Re(x + P, a[1][1])), y = Math.max(y, $), S = Math.max(S, k);
  }
  if (r) {
    if (u) {
      const $ = Vt(O / C, m, _) * C;
      if (y = Math.max(y, $), s) {
        let k = 0;
        !l && !c || l && !c && f ? k = Le(x + D + O / C, s[1][1]) * C : k = Re(x + D + (l ? I : -I) / C, s[0][1]) * C, y = Math.max(y, k);
      }
      if (a) {
        let k = 0;
        !l && !c || l && !c && f ? k = Re(x + O / C, a[1][1]) * C : k = Le(x + (l ? I : -I) / C, a[0][1]) * C, y = Math.max(y, k);
      }
    }
    if (d) {
      const $ = Vt(P * C, v, w) / C;
      if (S = Math.max(S, $), s) {
        let k = 0;
        !l && !c || c && !l && f ? k = Le(p + P * C + R, s[1][0]) / C : k = Re(p + (c ? A : -A) * C + R, s[0][0]) / C, S = Math.max(S, k);
      }
      if (a) {
        let k = 0;
        !l && !c || c && !l && f ? k = Re(p + P * C, a[1][0]) / C : k = Le(p + (c ? A : -A) * C, a[0][0]) / C, S = Math.max(S, k);
      }
    }
  }
  A = A + (A < 0 ? S : -S), I = I + (I < 0 ? y : -y), r && (f ? O > P * C ? A = (nr(l, c) ? -I : I) / C : I = (nr(l, c) ? -A : A) * C : u ? (A = I / C, c = l) : (I = A * C, l = c));
  const E = l ? p + I : p, M = c ? x + A : x;
  return {
    width: N + (l ? -I : I),
    height: b + (c ? -A : A),
    x: i[0] * I * (l ? -1 : 1) + E,
    y: i[1] * A * (c ? -1 : 1) + M
  };
}
const Xi = { width: 0, height: 0, x: 0, y: 0 }, hf = {
  ...Xi,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function gf(e, t, n) {
  const o = t.position.x + e.position.x, r = t.position.y + e.position.y, i = e.measured.width ?? 0, s = e.measured.height ?? 0, a = n[0] * i, l = n[1] * s;
  return [
    [o - a, r - l],
    [o + i - a, r + s - l]
  ];
}
function pf({ domNode: e, nodeId: t, getStoreItems: n, onChange: o, onEnd: r }) {
  const i = de(e);
  let s = {
    controlDirection: tr("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function a({ controlPosition: c, boundaries: u, keepAspectRatio: d, resizeDirection: f, onResizeStart: h, onResize: g, onResizeEnd: v, shouldResize: w }) {
    let m = { ...Xi }, _ = { ...hf };
    s = {
      boundaries: u,
      resizeDirection: f,
      keepAspectRatio: d,
      controlDirection: tr(c)
    };
    let p, x = null, N = [], b, C, I, A = !1;
    const O = Jr().on("start", (P) => {
      const { nodeLookup: R, transform: D, snapGrid: y, snapToGrid: S, nodeOrigin: E, paneDomNode: M } = n();
      if (p = R.get(t), !p)
        return;
      x = M?.getBoundingClientRect() ?? null;
      const { xSnapped: $, ySnapped: k } = yt(P.sourceEvent, {
        transform: D,
        snapGrid: y,
        snapToGrid: S,
        containerBounds: x
      });
      m = {
        width: p.measured.width ?? 0,
        height: p.measured.height ?? 0,
        x: p.position.x ?? 0,
        y: p.position.y ?? 0
      }, _ = {
        ...m,
        pointerX: $,
        pointerY: k,
        aspectRatio: m.width / m.height
      }, b = void 0, C = Qe(p.extent) ? p.extent : void 0, p.parentId && (p.extent === "parent" || p.expandParent) && (b = R.get(p.parentId)), b && p.extent === "parent" && (C = [
        [0, 0],
        [b.measured.width, b.measured.height]
      ]), N = [], I = void 0;
      for (const [V, L] of R)
        if (L.parentId === t && (N.push({
          id: V,
          position: { ...L.position },
          extent: L.extent
        }), L.extent === "parent" || L.expandParent)) {
          const H = gf(L, p, L.origin ?? E);
          I ? I = [
            [Math.min(H[0][0], I[0][0]), Math.min(H[0][1], I[0][1])],
            [Math.max(H[1][0], I[1][0]), Math.max(H[1][1], I[1][1])]
          ] : I = H;
        }
      h?.(P, { ...m });
    }).on("drag", (P) => {
      const { transform: R, snapGrid: D, snapToGrid: y, nodeOrigin: S } = n(), E = yt(P.sourceEvent, {
        transform: R,
        snapGrid: D,
        snapToGrid: y,
        containerBounds: x
      }), M = [];
      if (!p)
        return;
      const { x: $, y: k, width: V, height: L } = m, H = {}, X = p.origin ?? S, { width: F, height: W, x: Q, y: q } = ff(_, s.controlDirection, E, s.boundaries, s.keepAspectRatio, X, C, I), z = F !== V, B = W !== L, K = Q !== $ && z, U = q !== k && B;
      if (!K && !U && !z && !B)
        return;
      if ((K || U || X[0] === 1 || X[1] === 1) && (H.x = K ? Q : m.x, H.y = U ? q : m.y, m.x = H.x, m.y = H.y, N.length > 0)) {
        const te = Q - $, re = q - k;
        for (const le of N)
          le.position = {
            x: le.position.x - te + X[0] * (F - V),
            y: le.position.y - re + X[1] * (W - L)
          }, M.push(le);
      }
      if ((z || B) && (H.width = z && (!s.resizeDirection || s.resizeDirection === "horizontal") ? F : m.width, H.height = B && (!s.resizeDirection || s.resizeDirection === "vertical") ? W : m.height, m.width = H.width, m.height = H.height), b && p.expandParent) {
        const te = X[0] * (H.width ?? 0);
        H.x && H.x < te && (m.x = te, _.x = _.x - (H.x - te));
        const re = X[1] * (H.height ?? 0);
        H.y && H.y < re && (m.y = re, _.y = _.y - (H.y - re));
      }
      const Y = df({
        width: m.width,
        prevWidth: V,
        height: m.height,
        prevHeight: L,
        affectsX: s.controlDirection.affectsX,
        affectsY: s.controlDirection.affectsY
      }), G = { ...m, direction: Y };
      w?.(P, G) !== !1 && (A = !0, g?.(P, G), o(H, M));
    }).on("end", (P) => {
      A && (v?.(P, { ...m }), r?.({ ...m }), A = !1);
    });
    i.call(O);
  }
  function l() {
    i.on(".drag", null);
  }
  return {
    update: a,
    destroy: l
  };
}
var An = { exports: {} }, kn = {};
const Yi = /* @__PURE__ */ Da(ka);
var $n = { exports: {} }, Pn = {};
var or;
function mf() {
  if (or) return Pn;
  or = 1;
  var e = Yi;
  function t(d, f) {
    return d === f && (d !== 0 || 1 / d === 1 / f) || d !== d && f !== f;
  }
  var n = typeof Object.is == "function" ? Object.is : t, o = e.useState, r = e.useEffect, i = e.useLayoutEffect, s = e.useDebugValue;
  function a(d, f) {
    var h = f(), g = o({ inst: { value: h, getSnapshot: f } }), v = g[0].inst, w = g[1];
    return i(
      function() {
        v.value = h, v.getSnapshot = f, l(v) && w({ inst: v });
      },
      [d, h, f]
    ), r(
      function() {
        return l(v) && w({ inst: v }), d(function() {
          l(v) && w({ inst: v });
        });
      },
      [d]
    ), s(h), h;
  }
  function l(d) {
    var f = d.getSnapshot;
    d = d.value;
    try {
      var h = f();
      return !n(d, h);
    } catch {
      return !0;
    }
  }
  function c(d, f) {
    return f();
  }
  var u = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? c : a;
  return Pn.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : u, Pn;
}
var rr;
function yf() {
  return rr || (rr = 1, $n.exports = mf()), $n.exports;
}
var ir;
function wf() {
  if (ir) return kn;
  ir = 1;
  var e = Yi, t = yf();
  function n(c, u) {
    return c === u && (c !== 0 || 1 / c === 1 / u) || c !== c && u !== u;
  }
  var o = typeof Object.is == "function" ? Object.is : n, r = t.useSyncExternalStore, i = e.useRef, s = e.useEffect, a = e.useMemo, l = e.useDebugValue;
  return kn.useSyncExternalStoreWithSelector = function(c, u, d, f, h) {
    var g = i(null);
    if (g.current === null) {
      var v = { hasValue: !1, value: null };
      g.current = v;
    } else v = g.current;
    g = a(
      function() {
        function m(b) {
          if (!_) {
            if (_ = !0, p = b, b = f(b), h !== void 0 && v.hasValue) {
              var C = v.value;
              if (h(C, b))
                return x = C;
            }
            return x = b;
          }
          if (C = x, o(p, b)) return C;
          var I = f(b);
          return h !== void 0 && h(C, I) ? (p = b, C) : (p = b, x = I);
        }
        var _ = !1, p, x, N = d === void 0 ? null : d;
        return [
          function() {
            return m(u());
          },
          N === null ? void 0 : function() {
            return m(N());
          }
        ];
      },
      [u, d, f, h]
    );
    var w = r(c, g[0], g[1]);
    return s(
      function() {
        v.hasValue = !0, v.value = w;
      },
      [w]
    ), l(w), w;
  }, kn;
}
var sr;
function xf() {
  return sr || (sr = 1, An.exports = wf()), An.exports;
}
var vf = xf();
const bf = /* @__PURE__ */ za(vf), { useDebugValue: _f } = $a, { useSyncExternalStoreWithSelector: Sf } = bf, Ef = (e) => e;
function Zi(e, t = Ef, n) {
  const o = Sf(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    t,
    n
  );
  return _f(o), o;
}
const ar = (e, t) => {
  const n = Ta(e), o = (r, i = t) => Zi(n, r, i);
  return Object.assign(o, n), o;
}, Nf = (e, t) => e ? ar(e, t) : ar;
function ie(e, t) {
  if (Object.is(e, t))
    return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  if (e instanceof Map && t instanceof Map) {
    if (e.size !== t.size) return !1;
    for (const [o, r] of e)
      if (!Object.is(r, t.get(o)))
        return !1;
    return !0;
  }
  if (e instanceof Set && t instanceof Set) {
    if (e.size !== t.size) return !1;
    for (const o of e)
      if (!t.has(o))
        return !1;
    return !0;
  }
  const n = Object.keys(e);
  if (n.length !== Object.keys(t).length)
    return !1;
  for (const o of n)
    if (!Object.prototype.hasOwnProperty.call(t, o) || !Object.is(e[o], t[o]))
      return !1;
  return !0;
}
const pn = sn(null), Cf = pn.Provider, Wi = ve.error001("react");
function j(e, t) {
  const n = ut(pn);
  if (n === null)
    throw new Error(Wi);
  return Zi(n, e, t);
}
function oe() {
  const e = ut(pn);
  if (e === null)
    throw new Error(Wi);
  return xe(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const cr = { display: "none" }, Mf = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, qi = "react-flow__node-desc", Gi = "react-flow__edge-desc", If = "react-flow__aria-live", Af = (e) => e.ariaLiveMessage, kf = (e) => e.ariaLabelConfig;
function $f({ rfId: e }) {
  const t = j(Af);
  return T("div", { id: `${If}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: Mf, children: t });
}
function Pf({ rfId: e, disableKeyboardA11y: t }) {
  const n = j(kf);
  return ce(He, { children: [T("div", { id: `${qi}-${e}`, style: cr, children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"] }), T("div", { id: `${Gi}-${e}`, style: cr, children: n["edge.a11yDescription.default"] }), !t && T($f, { rfId: e })] });
}
const mn = Rr(({ position: e = "top-left", children: t, className: n, style: o, ...r }, i) => {
  const s = `${e}`.split("-");
  return T("div", { className: ae(["react-flow__panel", n, ...s]), style: o, ref: i, ...r, children: t });
});
mn.displayName = "Panel";
const lr = "https://reactflow.dev?utm_source=attribution";
function Df({ proOptions: e, position: t = "bottom-right" }) {
  return e?.hideAttribution ? null : T(mn, { position: t, className: "react-flow__attribution", "data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${lr}`, children: T("a", { href: lr, target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const zf = (e) => {
  const t = [], n = [];
  for (const [, o] of e.nodeLookup)
    o.selected && t.push(o.internals.userNode);
  for (const [, o] of e.edgeLookup)
    o.selected && n.push(o);
  return { selectedNodes: t, selectedEdges: n };
}, Ot = (e) => e.id;
function Tf(e, t) {
  return ie(e.selectedNodes.map(Ot), t.selectedNodes.map(Ot)) && ie(e.selectedEdges.map(Ot), t.selectedEdges.map(Ot));
}
function Hf({ onSelectionChange: e }) {
  const t = oe(), { selectedNodes: n, selectedEdges: o } = j(zf, Tf);
  return ne(() => {
    const r = { nodes: n, edges: o };
    e?.(r), t.getState().onSelectionChangeHandlers.forEach((i) => i(r));
  }, [n, o, e]), null;
}
const Rf = (e) => !!e.onSelectionChangeHandlers;
function Lf({ onSelectionChange: e }) {
  const t = j(Rf);
  return e || t ? T(Hf, { onSelectionChange: e }) : null;
}
const Ui = [0, 0], Vf = { x: 0, y: 0, zoom: 1 }, Of = [
  "nodes",
  "edges",
  "defaultNodes",
  "defaultEdges",
  "onConnect",
  "onConnectStart",
  "onConnectEnd",
  "onClickConnectStart",
  "onClickConnectEnd",
  "nodesDraggable",
  "autoPanOnNodeFocus",
  "nodesConnectable",
  "nodesFocusable",
  "edgesFocusable",
  "edgesReconnectable",
  "elevateNodesOnSelect",
  "elevateEdgesOnSelect",
  "minZoom",
  "maxZoom",
  "nodeExtent",
  "onNodesChange",
  "onEdgesChange",
  "elementsSelectable",
  "connectionMode",
  "snapGrid",
  "snapToGrid",
  "translateExtent",
  "connectOnClick",
  "defaultEdgeOptions",
  "fitView",
  "fitViewOptions",
  "onNodesDelete",
  "onEdgesDelete",
  "onDelete",
  "onNodeDrag",
  "onNodeDragStart",
  "onNodeDragStop",
  "onSelectionDrag",
  "onSelectionDragStart",
  "onSelectionDragStop",
  "onMoveStart",
  "onMove",
  "onMoveEnd",
  "noPanClassName",
  "nodeOrigin",
  "autoPanOnConnect",
  "autoPanOnNodeDrag",
  "onError",
  "connectionRadius",
  "isValidConnection",
  "selectNodesOnDrag",
  "nodeDragThreshold",
  "connectionDragThreshold",
  "onBeforeDelete",
  "debug",
  "autoPanSpeed",
  "ariaLabelConfig",
  "zIndexMode"
], ur = [...Of, "rfId"], Bf = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), dr = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: _t,
  nodeOrigin: Ui,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function Ff(e) {
  const { setNodes: t, setEdges: n, setMinZoom: o, setMaxZoom: r, setTranslateExtent: i, setNodeExtent: s, reset: a, setDefaultNodesAndEdges: l } = j(Bf, ie), c = oe();
  ne(() => (l(e.defaultNodes, e.defaultEdges), () => {
    u.current = dr, a();
  }), []);
  const u = ee(dr);
  return ne(
    () => {
      for (const d of ur) {
        const f = e[d], h = u.current[d];
        f !== h && (typeof e[d] > "u" || (d === "nodes" ? t(f) : d === "edges" ? n(f) : d === "minZoom" ? o(f) : d === "maxZoom" ? r(f) : d === "translateExtent" ? i(f) : d === "nodeExtent" ? s(f) : d === "ariaLabelConfig" ? c.setState({ ariaLabelConfig: Md(f) }) : d === "fitView" ? c.setState({ fitViewQueued: f }) : d === "fitViewOptions" ? c.setState({ fitViewOptions: f }) : c.setState({ [d]: f })));
      }
      u.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    ur.map((d) => e[d])
  ), null;
}
function fr() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function Xf(e) {
  const [t, n] = we(e === "system" ? null : e);
  return ne(() => {
    if (e !== "system") {
      n(e);
      return;
    }
    const o = fr(), r = () => n(o?.matches ? "dark" : "light");
    return r(), o?.addEventListener("change", r), () => {
      o?.removeEventListener("change", r);
    };
  }, [e]), t !== null ? t : fr()?.matches ? "dark" : "light";
}
const hr = typeof document < "u" ? document : null;
function Ct(e = null, t = { target: hr, actInsideInputWithModifier: !0 }) {
  const [n, o] = we(!1), r = ee(!1), i = ee(/* @__PURE__ */ new Set([])), [s, a] = xe(() => {
    if (e !== null) {
      const c = (Array.isArray(e) ? e : [e]).filter((d) => typeof d == "string").map((d) => d.replace("+", `
`).replace(`

`, `
+`).split(`
`)), u = c.reduce((d, f) => d.concat(...f), []);
      return [c, u];
    }
    return [[], []];
  }, [e]);
  return ne(() => {
    const l = t?.target ?? hr, c = t?.actInsideInputWithModifier ?? !0;
    if (e !== null) {
      const u = (h) => {
        if (r.current = h.ctrlKey || h.metaKey || h.shiftKey || h.altKey, (!r.current || r.current && !c) && Mi(h))
          return !1;
        const v = pr(h.code, a);
        if (i.current.add(h[v]), gr(s, i.current, !1)) {
          const w = h.composedPath?.()?.[0] || h.target, m = w?.nodeName === "BUTTON" || w?.nodeName === "A";
          t.preventDefault !== !1 && (r.current || !m) && h.preventDefault(), o(!0);
        }
      }, d = (h) => {
        const g = pr(h.code, a);
        gr(s, i.current, !0) ? (o(!1), i.current.clear()) : i.current.delete(h[g]), h.key === "Meta" && i.current.clear(), r.current = !1;
      }, f = () => {
        i.current.clear(), o(!1);
      };
      return l?.addEventListener("keydown", u), l?.addEventListener("keyup", d), window.addEventListener("blur", f), window.addEventListener("contextmenu", f), () => {
        l?.removeEventListener("keydown", u), l?.removeEventListener("keyup", d), window.removeEventListener("blur", f), window.removeEventListener("contextmenu", f);
      };
    }
  }, [e, o]), n;
}
function gr(e, t, n) {
  return e.filter((o) => n || o.length === t.size).some((o) => o.every((r) => t.has(r)));
}
function pr(e, t) {
  return t.includes(e) ? "code" : "key";
}
const Yf = () => {
  const e = oe();
  return xe(() => ({
    zoomIn: async (t) => {
      const { panZoom: n } = e.getState();
      return n ? n.scaleBy(1.2, t) : !1;
    },
    zoomOut: async (t) => {
      const { panZoom: n } = e.getState();
      return n ? n.scaleBy(1 / 1.2, t) : !1;
    },
    zoomTo: async (t, n) => {
      const { panZoom: o } = e.getState();
      return o ? o.scaleTo(t, n) : !1;
    },
    getZoom: () => e.getState().transform[2],
    setViewport: async (t, n) => {
      const { transform: [o, r, i], panZoom: s } = e.getState();
      return s ? (await s.setViewport({
        x: t.x ?? o,
        y: t.y ?? r,
        zoom: t.zoom ?? i
      }, n), !0) : !1;
    },
    getViewport: () => {
      const [t, n, o] = e.getState().transform;
      return { x: t, y: n, zoom: o };
    },
    setCenter: async (t, n, o) => e.getState().setCenter(t, n, o),
    fitBounds: async (t, n) => {
      const { width: o, height: r, minZoom: i, maxZoom: s, panZoom: a } = e.getState(), l = so(t, o, r, i, s, n?.padding ?? 0.1);
      return a ? (await a.setViewport(l, {
        duration: n?.duration,
        ease: n?.ease,
        interpolate: n?.interpolate
      }), !0) : !1;
    },
    screenToFlowPosition: (t, n = {}) => {
      const { transform: o, snapGrid: r, snapToGrid: i, domNode: s } = e.getState();
      if (!s)
        return t;
      const { x: a, y: l } = s.getBoundingClientRect(), c = {
        x: t.x - a,
        y: t.y - l
      }, u = n.snapGrid ?? r, d = n.snapToGrid ?? i;
      return Pt(c, o, d, u);
    },
    flowToScreenPosition: (t) => {
      const { transform: n, domNode: o } = e.getState();
      if (!o)
        return t;
      const { x: r, y: i } = o.getBoundingClientRect(), s = ct(t, n);
      return {
        x: s.x + r,
        y: s.y + i
      };
    }
  }), []);
};
function Ki(e, t) {
  const n = [], o = /* @__PURE__ */ new Map(), r = [];
  for (const i of e)
    if (i.type === "add") {
      r.push(i);
      continue;
    } else if (i.type === "remove" || i.type === "replace")
      o.set(i.id, [i]);
    else {
      const s = o.get(i.id);
      s ? s.push(i) : o.set(i.id, [i]);
    }
  for (const i of t) {
    const s = o.get(i.id);
    if (!s) {
      n.push(i);
      continue;
    }
    if (s[0].type === "remove")
      continue;
    if (s[0].type === "replace") {
      n.push({ ...s[0].item });
      continue;
    }
    const a = { ...i };
    for (const l of s)
      Zf(l, a);
    n.push(a);
  }
  return r.length && r.forEach((i) => {
    i.index !== void 0 ? n.splice(i.index, 0, { ...i.item }) : n.push({ ...i.item });
  }), n;
}
function Zf(e, t) {
  switch (e.type) {
    case "select": {
      t.selected = e.selected;
      break;
    }
    case "position": {
      typeof e.position < "u" && (t.position = e.position), typeof e.dragging < "u" && (t.dragging = e.dragging);
      break;
    }
    case "dimensions": {
      typeof e.dimensions < "u" && (t.measured = {
        ...e.dimensions
      }, e.setAttributes && ((e.setAttributes === !0 || e.setAttributes === "width") && (t.width = e.dimensions.width), (e.setAttributes === !0 || e.setAttributes === "height") && (t.height = e.dimensions.height))), typeof e.resizing == "boolean" && (t.resizing = e.resizing);
      break;
    }
  }
}
function Wf(e, t) {
  return Ki(e, t);
}
function qf(e, t) {
  return Ki(e, t);
}
function Ye(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function tt(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const o = [];
  for (const [r, i] of e) {
    const s = t.has(r);
    !(i.selected === void 0 && !s) && i.selected !== s && (n && (i.selected = s), o.push(Ye(i.id, s)));
  }
  return o;
}
function mr({ items: e = [], lookup: t }) {
  const n = [], o = new Map(e.map((r) => [r.id, r]));
  for (const [r, i] of e.entries()) {
    const s = t.get(i.id), a = s?.internals?.userNode ?? s;
    a !== void 0 && a !== i && n.push({ id: i.id, item: i, type: "replace" }), a === void 0 && n.push({ item: i, type: "add", index: r });
  }
  for (const [r] of t)
    o.get(r) === void 0 && n.push({ id: r, type: "remove" });
  return n;
}
function yr(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const Gf = Si();
function Uf(e, t, n = {}) {
  return Dd(e, t, {
    ...n,
    onError: n.onError ?? Gf
  });
}
const wr = (e) => wd(e), Kf = (e) => wi(e);
function Qi(e) {
  return Rr(e);
}
const Ji = typeof window < "u" ? Pa : ne;
function xr(e) {
  const [t, n] = we(BigInt(0)), [o] = we(() => Qf(() => n((r) => r + BigInt(1))));
  return Ji(() => {
    const r = o.get();
    r.length && (e(r), o.reset());
  }, [t]), o;
}
function Qf(e) {
  let t = [];
  return {
    get: () => t,
    reset: () => {
      t = [];
    },
    push: (n) => {
      t.push(n), e();
    }
  };
}
const ji = sn(null);
function Jf({ children: e }) {
  const t = oe(), n = Ce((a) => {
    const { nodes: l = [], setNodes: c, hasDefaultNodes: u, onNodesChange: d, nodeLookup: f, fitViewQueued: h, onNodesChangeMiddlewareMap: g } = t.getState();
    let v = l;
    for (const m of a)
      v = typeof m == "function" ? m(v) : m;
    let w = mr({
      items: v,
      lookup: f
    });
    for (const m of g.values())
      w = m(w);
    u && c(v), w.length > 0 ? d?.(w) : h && window.requestAnimationFrame(() => {
      const { fitViewQueued: m, nodes: _, setNodes: p } = t.getState();
      m && p(_);
    });
  }, []), o = xr(n), r = Ce((a) => {
    const { edges: l = [], setEdges: c, hasDefaultEdges: u, onEdgesChange: d, edgeLookup: f } = t.getState();
    let h = l;
    for (const g of a)
      h = typeof g == "function" ? g(h) : g;
    u ? c(h) : d && d(mr({
      items: h,
      lookup: f
    }));
  }, []), i = xr(r), s = xe(() => ({ nodeQueue: o, edgeQueue: i }), []);
  return T(ji.Provider, { value: s, children: e });
}
function jf() {
  const e = ut(ji);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const eh = (e) => !!e.panZoom;
function go() {
  const e = Yf(), t = oe(), n = jf(), o = j(eh), r = xe(() => {
    const i = (d) => t.getState().nodeLookup.get(d), s = (d) => {
      n.nodeQueue.push(d);
    }, a = (d) => {
      n.edgeQueue.push(d);
    }, l = (d) => {
      const { nodeLookup: f, nodeOrigin: h } = t.getState(), g = wr(d) ? d : f.get(d.id), v = g.parentId ? Ni(g.position, g.measured, g.parentId, f, h) : g.position, w = {
        ...g,
        position: v,
        width: g.measured?.width ?? g.width,
        height: g.measured?.height ?? g.height
      };
      return Et(w);
    }, c = (d, f, h = { replace: !1 }) => {
      s((g) => g.map((v) => {
        if (v.id === d) {
          const w = typeof f == "function" ? f(v) : f;
          return h.replace && wr(w) ? w : { ...v, ...w };
        }
        return v;
      }));
    }, u = (d, f, h = { replace: !1 }) => {
      a((g) => g.map((v) => {
        if (v.id === d) {
          const w = typeof f == "function" ? f(v) : f;
          return h.replace && Kf(w) ? w : { ...v, ...w };
        }
        return v;
      }));
    };
    return {
      getNodes: () => t.getState().nodes.map((d) => ({ ...d })),
      getNode: (d) => i(d)?.internals.userNode,
      getInternalNode: i,
      getEdges: () => {
        const { edges: d = [] } = t.getState();
        return d.map((f) => ({ ...f }));
      },
      getEdge: (d) => t.getState().edgeLookup.get(d),
      setNodes: s,
      setEdges: a,
      addNodes: (d) => {
        const f = Array.isArray(d) ? d : [d];
        n.nodeQueue.push((h) => [...h, ...f]);
      },
      addEdges: (d) => {
        const f = Array.isArray(d) ? d : [d];
        n.edgeQueue.push((h) => [...h, ...f]);
      },
      toObject: () => {
        const { nodes: d = [], edges: f = [], transform: h } = t.getState(), [g, v, w] = h;
        return {
          nodes: d.map((m) => ({ ...m })),
          edges: f.map((m) => ({ ...m })),
          viewport: {
            x: g,
            y: v,
            zoom: w
          }
        };
      },
      deleteElements: async ({ nodes: d = [], edges: f = [] }) => {
        const { nodes: h, edges: g, onNodesDelete: v, onEdgesDelete: w, triggerNodeChanges: m, triggerEdgeChanges: _, onDelete: p, onBeforeDelete: x } = t.getState(), { nodes: N, edges: b } = await Sd({
          nodesToRemove: d,
          edgesToRemove: f,
          nodes: h,
          edges: g,
          onBeforeDelete: x
        }), C = b.length > 0, I = N.length > 0;
        if (C) {
          const A = b.map(yr);
          w?.(b), _(A);
        }
        if (I) {
          const A = N.map(yr);
          v?.(N), m(A);
        }
        return (I || C) && p?.({ nodes: N, edges: b }), { deletedNodes: N, deletedEdges: b };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (d, f = !0, h) => {
        const g = Yo(d), v = g ? d : l(d), w = h !== void 0;
        return v ? (h || t.getState().nodes).filter((m) => {
          const _ = t.getState().nodeLookup.get(m.id);
          if (_ && !g && (m.id === d.id || !_.internals.positionAbsolute))
            return !1;
          const p = Et(w ? m : _), x = nn(p, v);
          return f && x > 0 || x >= p.width * p.height || x >= v.width * v.height;
        }) : [];
      },
      isNodeIntersecting: (d, f, h = !0) => {
        const v = Yo(d) ? d : l(d);
        if (!v)
          return !1;
        const w = nn(v, f);
        return h && w > 0 || w >= f.width * f.height || w >= v.width * v.height;
      },
      updateNode: c,
      updateNodeData: (d, f, h = { replace: !1 }) => {
        c(d, (g) => {
          const v = typeof f == "function" ? f(g) : f;
          return h.replace ? { ...g, data: v } : { ...g, data: { ...g.data, ...v } };
        }, h);
      },
      updateEdge: u,
      updateEdgeData: (d, f, h = { replace: !1 }) => {
        u(d, (g) => {
          const v = typeof f == "function" ? f(g) : f;
          return h.replace ? { ...g, data: v } : { ...g, data: { ...g.data, ...v } };
        }, h);
      },
      getNodesBounds: (d) => {
        const { nodeLookup: f, nodeOrigin: h } = t.getState();
        return xd(d, { nodeLookup: f, nodeOrigin: h });
      },
      getHandleConnections: ({ type: d, id: f, nodeId: h }) => Array.from(t.getState().connectionLookup.get(`${h}-${d}${f ? `-${f}` : ""}`)?.values() ?? []),
      getNodeConnections: ({ type: d, handleId: f, nodeId: h }) => Array.from(t.getState().connectionLookup.get(`${h}${d ? f ? `-${d}-${f}` : `-${d}` : ""}`)?.values() ?? []),
      fitView: async (d) => {
        const f = t.getState().fitViewResolver ?? Cd();
        return t.setState({ fitViewQueued: !0, fitViewOptions: d, fitViewResolver: f }), n.nodeQueue.push((h) => [...h]), f.promise;
      }
    };
  }, []);
  return xe(() => ({
    ...r,
    ...e,
    viewportInitialized: o
  }), [o]);
}
const vr = (e) => e.selected, th = typeof window < "u" ? window : void 0;
function nh({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
  const n = oe(), { deleteElements: o } = go(), r = Ct(e, { actInsideInputWithModifier: !1 }), i = Ct(t, { target: th });
  ne(() => {
    if (r) {
      const { edges: s, nodes: a } = n.getState();
      o({ nodes: a.filter(vr), edges: s.filter(vr) }), n.setState({ nodesSelectionActive: !1 });
    }
  }, [r]), ne(() => {
    n.setState({ multiSelectionActive: i });
  }, [i]);
}
function oh(e) {
  const t = oe();
  ne(() => {
    const n = () => {
      if (!e.current || !(e.current.checkVisibility?.() ?? !0))
        return !1;
      const o = ao(e.current);
      (o.height === 0 || o.width === 0) && t.getState().onError?.("004", ve.error004()), t.setState({ width: o.width || 500, height: o.height || 500 });
    };
    if (e.current) {
      n(), window.addEventListener("resize", n);
      const o = new ResizeObserver(() => n());
      return o.observe(e.current), () => {
        window.removeEventListener("resize", n), o && e.current && o.unobserve(e.current);
      };
    }
  }, []);
}
const yn = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, rh = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function ih({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: o = !1, panOnScrollSpeed: r = 0.5, panOnScrollMode: i = qe.Free, zoomOnDoubleClick: s = !0, panOnDrag: a = !0, defaultViewport: l, translateExtent: c, minZoom: u, maxZoom: d, zoomActivationKeyCode: f, preventScrolling: h = !0, children: g, noWheelClassName: v, noPanClassName: w, onViewportChange: m, isControlledViewport: _, paneClickDistance: p, selectionOnDrag: x }) {
  const N = oe(), b = ee(null), { userSelectionActive: C, lib: I, connectionInProgress: A } = j(rh, ie), O = Ct(f), P = ee();
  oh(b);
  const R = Ce((D) => {
    m?.({ x: D[0], y: D[1], zoom: D[2] }), _ || N.setState({ transform: D });
  }, [m, _]);
  return ne(() => {
    if (b.current) {
      P.current = uf({
        domNode: b.current,
        minZoom: u,
        maxZoom: d,
        translateExtent: c,
        viewport: l,
        onDraggingChange: (E) => N.setState((M) => M.paneDragging === E ? M : { paneDragging: E }),
        onPanZoomStart: (E, M) => {
          const { onViewportChangeStart: $, onMoveStart: k } = N.getState();
          k?.(E, M), $?.(M);
        },
        onPanZoom: (E, M) => {
          const { onViewportChange: $, onMove: k } = N.getState();
          k?.(E, M), $?.(M);
        },
        onPanZoomEnd: (E, M) => {
          const { onViewportChangeEnd: $, onMoveEnd: k } = N.getState();
          k?.(E, M), $?.(M);
        }
      });
      const { x: D, y, zoom: S } = P.current.getViewport();
      return N.setState({
        panZoom: P.current,
        transform: [D, y, S],
        domNode: b.current.closest(".react-flow")
      }), () => {
        P.current?.destroy();
      };
    }
  }, []), ne(() => {
    P.current?.update({
      onPaneContextMenu: e,
      zoomOnScroll: t,
      zoomOnPinch: n,
      panOnScroll: o,
      panOnScrollSpeed: r,
      panOnScrollMode: i,
      zoomOnDoubleClick: s,
      panOnDrag: a,
      zoomActivationKeyPressed: O,
      preventScrolling: h,
      noPanClassName: w,
      userSelectionActive: C,
      noWheelClassName: v,
      lib: I,
      onTransformChange: R,
      connectionInProgress: A,
      selectionOnDrag: x,
      paneClickDistance: p
    });
  }, [
    e,
    t,
    n,
    o,
    r,
    i,
    s,
    a,
    O,
    h,
    w,
    C,
    v,
    I,
    R,
    A,
    x,
    p
  ]), T("div", { className: "react-flow__renderer", ref: b, style: yn, children: g });
}
const sh = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function ah() {
  const { userSelectionActive: e, userSelectionRect: t } = j(sh, ie);
  return e && t ? T("div", { className: "react-flow__selection react-flow__container", style: {
    width: t.width,
    height: t.height,
    transform: `translate(${t.x}px, ${t.y}px)`
  } }) : null;
}
const Dn = (e, t) => (n) => {
  n.target === t.current && e?.(n);
}, ch = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  dragging: e.paneDragging,
  panBy: e.panBy,
  autoPanSpeed: e.autoPanSpeed
});
function lh({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = St.Full, panOnDrag: o, autoPanOnSelection: r, paneClickDistance: i, selectionOnDrag: s, onSelectionStart: a, onSelectionEnd: l, onPaneClick: c, onPaneContextMenu: u, onPaneScroll: d, onPaneMouseEnter: f, onPaneMouseMove: h, onPaneMouseLeave: g, children: v }) {
  const w = ee(0), m = oe(), { userSelectionActive: _, elementsSelectable: p, dragging: x, panBy: N, autoPanSpeed: b } = j(ch, ie), C = p && (e || _), I = ee(null), A = ee(), O = ee(/* @__PURE__ */ new Set()), P = ee(/* @__PURE__ */ new Set()), R = ee(!1), D = ee(!1), y = ee({ x: 0, y: 0 }), S = ee(!1), E = (z) => {
    if (D.current || R.current || m.getState().connection.inProgress) {
      D.current = !1, R.current = !1;
      return;
    }
    c?.(z), m.getState().resetSelectedElements(), m.setState({ nodesSelectionActive: !1 });
  }, M = (z) => {
    if (Array.isArray(o) && o?.includes(2)) {
      z.preventDefault();
      return;
    }
    u?.(z);
  }, $ = d ? (z) => d(z) : void 0, k = (z) => {
    D.current && (z.stopPropagation(), D.current = !1);
  }, V = (z) => {
    const { domNode: B, transform: K } = m.getState();
    if (A.current = B?.getBoundingClientRect(), !A.current)
      return;
    const U = z.target === I.current;
    if (!U && !!z.target.closest(".nokey") || !e || !(s && U || t) || z.button !== 0 || !z.isPrimary)
      return;
    z.target?.setPointerCapture?.(z.pointerId), D.current = !1;
    const { x: J, y: te } = ye(z.nativeEvent, A.current), re = Pt({ x: J, y: te }, K);
    m.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: re.x,
        startY: re.y,
        x: J,
        y: te
      }
    }), U || (z.stopPropagation(), z.preventDefault());
  };
  function L(z, B) {
    const { userSelectionRect: K } = m.getState();
    if (!K)
      return;
    const { transform: U, nodeLookup: Y, edgeLookup: G, connectionLookup: J, triggerNodeChanges: te, triggerEdgeChanges: re, defaultEdgeOptions: le } = m.getState(), Ae = { x: K.startX, y: K.startY }, { x: _e, y: Se } = ct(Ae, U), ke = {
      startX: Ae.x,
      startY: Ae.y,
      x: z < _e ? z : _e,
      y: B < Se ? B : Se,
      width: Math.abs(z - _e),
      height: Math.abs(B - Se)
    }, dt = O.current, Be = P.current;
    O.current = new Set(ro(Y, ke, U, n === St.Partial, !0).map((he) => he.id)), P.current = /* @__PURE__ */ new Set();
    const Fe = le?.selectable ?? !0;
    for (const he of O.current) {
      const $e = J.get(he);
      if ($e)
        for (const { edgeId: Pe } of $e.values()) {
          const Xe = G.get(Pe);
          Xe && (Xe.selectable ?? Fe) && P.current.add(Pe);
        }
    }
    if (!Zo(dt, O.current)) {
      const he = tt(Y, O.current, !0);
      te(he);
    }
    if (!Zo(Be, P.current)) {
      const he = tt(G, P.current);
      re(he);
    }
    m.setState({
      userSelectionRect: ke,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }
  function H() {
    if (!r || !A.current)
      return;
    const [z, B] = io(y.current, A.current, b);
    N({ x: z, y: B }).then((K) => {
      if (!D.current || !K) {
        w.current = requestAnimationFrame(H);
        return;
      }
      const { x: U, y: Y } = y.current;
      L(U, Y), w.current = requestAnimationFrame(H);
    });
  }
  const X = () => {
    cancelAnimationFrame(w.current), w.current = 0, S.current = !1;
  };
  ne(() => () => X(), []);
  const F = (z) => {
    const { userSelectionRect: B, transform: K, resetSelectedElements: U } = m.getState();
    if (!A.current || !B)
      return;
    const { x: Y, y: G } = ye(z.nativeEvent, A.current);
    y.current = { x: Y, y: G };
    const J = ct({ x: B.startX, y: B.startY }, K);
    if (!D.current) {
      const te = t ? 0 : i;
      if (Math.hypot(Y - J.x, G - J.y) <= te)
        return;
      U(), a?.(z);
    }
    D.current = !0, S.current || (H(), S.current = !0), L(Y, G);
  }, W = (z) => {
    if (!C) {
      z.target === I.current && m.getState().connection.inProgress && (R.current = !0);
      return;
    }
    z.button === 0 && (z.target?.releasePointerCapture?.(z.pointerId), !_ && z.target === I.current && m.getState().userSelectionRect && E?.(z), m.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), D.current && (l?.(z), m.setState({
      nodesSelectionActive: O.current.size > 0
    })), X());
  }, Q = (z) => {
    z.target?.releasePointerCapture?.(z.pointerId), X();
  }, q = o === !0 || Array.isArray(o) && o.includes(0);
  return ce("div", { className: ae(["react-flow__pane", { draggable: q, dragging: x, selection: e }]), onClick: C ? void 0 : Dn(E, I), onContextMenu: Dn(M, I), onWheel: Dn($, I), onPointerEnter: C ? void 0 : f, onPointerMove: C ? F : h, onPointerUp: W, onPointerCancel: C ? Q : void 0, onPointerDownCapture: C ? V : void 0, onClickCapture: C ? k : void 0, onPointerLeave: g, ref: I, style: yn, children: [v, T(ah, {})] });
}
function Gn({ id: e, store: t, unselect: n = !1, nodeRef: o }) {
  const { addSelectedNodes: r, unselectNodesAndEdges: i, multiSelectionActive: s, nodeLookup: a, onError: l } = t.getState(), c = a.get(e);
  if (!c) {
    l?.("012", ve.error012(e));
    return;
  }
  t.setState({ nodesSelectionActive: !1 }), c.selected ? (n || c.selected && s) && (i({ nodes: [c], edges: [] }), requestAnimationFrame(() => o?.current?.blur())) : r([e]);
}
function es({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: o, nodeId: r, isSelectable: i, nodeClickDistance: s }) {
  const a = oe(), [l, c] = we(!1), u = ee();
  return ne(() => {
    if (!t)
      return u.current = Ud({
        getStoreItems: () => a.getState(),
        onNodeMouseDown: (d) => {
          Gn({
            id: d,
            store: a,
            nodeRef: e
          });
        },
        onDragStart: () => {
          c(!0);
        },
        onDragStop: () => {
          c(!1);
        }
      }), () => {
        u.current?.destroy(), u.current = void 0;
      };
  }, [t, a, e]), ne(() => {
    t || !e.current || !u.current || u.current.update({
      noDragClassName: n,
      handleSelector: o,
      domNode: e.current,
      isSelectable: i,
      nodeId: r,
      nodeClickDistance: s
    });
  }, [n, o, t, i, e, r, s]), l;
}
const uh = (e) => (t) => t.selected && (t.draggable || e && typeof t.draggable > "u");
function ts() {
  const e = oe();
  return Ce((n) => {
    const { nodeExtent: o, snapToGrid: r, snapGrid: i, nodesDraggable: s, onError: a, updateNodePositions: l, nodeLookup: c, nodeOrigin: u } = e.getState(), d = /* @__PURE__ */ new Map(), f = uh(s), h = r ? i[0] : 5, g = r ? i[1] : 5, v = n.direction.x * h * n.factor, w = n.direction.y * g * n.factor;
    for (const [, m] of c) {
      if (!f(m))
        continue;
      let _ = {
        x: m.internals.positionAbsolute.x + v,
        y: m.internals.positionAbsolute.y + w
      };
      r && (_ = $t(_, i));
      const { position: p, positionAbsolute: x } = xi({
        nodeId: m.id,
        nextPosition: _,
        nodeLookup: c,
        nodeExtent: o,
        nodeOrigin: u,
        onError: a
      });
      m.position = p, m.internals.positionAbsolute = x, d.set(m.id, m);
    }
    l(d);
  }, []);
}
const po = sn(null), dh = po.Provider;
po.Consumer;
const ns = () => ut(po), fh = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), os = sn(null);
function hh({ children: e }) {
  const t = j(fh, ie);
  return T(os.Provider, { value: t, children: e });
}
function gh() {
  const e = ut(os);
  if (!e)
    throw new Error("useHandleConfig must be used within a HandleConfigProvider");
  return e;
}
const ph = {
  connectingFrom: !1,
  connectingTo: !1,
  clickConnecting: !1,
  isPossibleEndHandle: !0,
  connectionInProcess: !1,
  clickConnectionInProcess: !1,
  valid: !1
}, mh = (e, t, n) => (o) => {
  const { connectionClickStartHandle: r, connectionMode: i, connection: s } = o, { fromHandle: a, toHandle: l, isValid: c } = s;
  if (!a && !r)
    return ph;
  const u = l?.nodeId === e && l?.id === t && l?.type === n;
  return {
    connectingFrom: a?.nodeId === e && a?.id === t && a?.type === n,
    connectingTo: u,
    clickConnecting: r?.nodeId === e && r?.id === t && r?.type === n,
    isPossibleEndHandle: i === st.Strict ? a?.type !== n : e !== a?.nodeId || t !== a?.id,
    connectionInProcess: !!a,
    clickConnectionInProcess: !!r,
    valid: u && c
  };
};
function yh({ type: e = "source", position: t = Z.Top, isValidConnection: n, isConnectable: o = !0, isConnectableStart: r = !0, isConnectableEnd: i = !0, id: s, onConnect: a, children: l, className: c, onMouseDown: u, onTouchStart: d, ...f }, h) {
  const g = s || null, v = e === "target", w = oe(), m = ns(), { connectOnClick: _, noPanClassName: p, rfId: x } = gh(), { connectingFrom: N, connectingTo: b, clickConnecting: C, isPossibleEndHandle: I, connectionInProcess: A, clickConnectionInProcess: O, valid: P } = j(mh(m, g, e), ie);
  m || w.getState().onError?.("010", ve.error010());
  const R = (S) => {
    const { defaultEdgeOptions: E, onConnect: M, hasDefaultEdges: $ } = w.getState(), k = {
      ...E,
      ...S
    };
    if ($) {
      const { edges: V, setEdges: L, onError: H } = w.getState();
      L(Uf(k, V, { onError: H }));
    }
    M?.(k), a?.(k);
  }, D = (S) => {
    if (!m)
      return;
    const E = Ii(S.nativeEvent);
    if (r && (E && S.button === 0 || !E)) {
      const M = w.getState();
      qn.onPointerDown(S.nativeEvent, {
        handleDomNode: S.currentTarget,
        autoPanOnConnect: M.autoPanOnConnect,
        connectionMode: M.connectionMode,
        connectionRadius: M.connectionRadius,
        domNode: M.domNode,
        nodeLookup: M.nodeLookup,
        lib: M.lib,
        isTarget: v,
        handleId: g,
        nodeId: m,
        flowId: M.rfId,
        panBy: M.panBy,
        cancelConnection: M.cancelConnection,
        onConnectStart: M.onConnectStart,
        onConnectEnd: (...$) => w.getState().onConnectEnd?.(...$),
        updateConnection: M.updateConnection,
        onConnect: R,
        isValidConnection: n || ((...$) => w.getState().isValidConnection?.(...$) ?? !0),
        getTransform: () => w.getState().transform,
        getFromHandle: () => w.getState().connection.fromHandle,
        autoPanSpeed: M.autoPanSpeed,
        dragThreshold: M.connectionDragThreshold
      });
    }
    E ? u?.(S) : d?.(S);
  }, y = (S) => {
    const { onClickConnectStart: E, onClickConnectEnd: M, connectionClickStartHandle: $, connectionMode: k, isValidConnection: V, lib: L, rfId: H, nodeLookup: X, connection: F } = w.getState();
    if (!m || !$ && !r)
      return;
    if (!$) {
      E?.(S.nativeEvent, { nodeId: m, handleId: g, handleType: e }), w.setState({ connectionClickStartHandle: { nodeId: m, type: e, id: g } });
      return;
    }
    const W = Ci(S.target), Q = n || V, { connection: q, isValid: z } = qn.isValid(S.nativeEvent, {
      handle: {
        nodeId: m,
        id: g,
        type: e
      },
      connectionMode: k,
      fromNodeId: $.nodeId,
      fromHandleId: $.id || null,
      fromType: $.type,
      isValidConnection: Q,
      flowId: H,
      doc: W,
      lib: L,
      nodeLookup: X
    });
    z && q && R(q);
    const B = structuredClone(F);
    delete B.inProgress, B.toPosition = B.toHandle ? B.toHandle.position : null, M?.(S, B), w.setState({ connectionClickStartHandle: null });
  };
  return T("div", { "data-handleid": g, "data-nodeid": m, "data-handlepos": t, "data-id": `${x}-${m}-${g}-${e}`, className: ae([
    "react-flow__handle",
    `react-flow__handle-${t}`,
    "nodrag",
    p,
    c,
    {
      source: !v,
      target: v,
      connectable: o,
      connectablestart: r,
      connectableend: i,
      clickconnecting: C,
      connectingfrom: N,
      connectingto: b,
      valid: P,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: o && (!A || I) && (A || O ? i : r)
    }
  ]), onMouseDown: D, onTouchStart: D, onClick: _ ? y : void 0, ref: h, ...f, children: l });
}
const on = se(Qi(yh));
function wh({ data: e, isConnectable: t, sourcePosition: n = Z.Bottom }) {
  return ce(He, { children: [e?.label, T(on, { type: "source", position: n, isConnectable: t })] });
}
function xh({ data: e, isConnectable: t, targetPosition: n = Z.Top, sourcePosition: o = Z.Bottom }) {
  return ce(He, { children: [T(on, { type: "target", position: n, isConnectable: t }), e?.label, T(on, { type: "source", position: o, isConnectable: t })] });
}
function vh() {
  return null;
}
function bh({ data: e, isConnectable: t, targetPosition: n = Z.Top }) {
  return ce(He, { children: [T(on, { type: "target", position: n, isConnectable: t }), e?.label] });
}
const rn = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, br = {
  input: wh,
  default: xh,
  output: bh,
  group: vh
};
function _h(e) {
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? e.style?.width,
    height: e.height ?? e.initialHeight ?? e.style?.height
  } : {
    width: e.width ?? e.style?.width,
    height: e.height ?? e.style?.height
  };
}
const Sh = (e) => {
  const { width: t, height: n, x: o, y: r } = kt(e.nodeLookup, {
    filter: (i) => !!i.selected
  });
  return {
    width: me(t) ? t : null,
    height: me(n) ? n : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${o}px,${r}px)`
  };
};
function Eh({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
  const o = oe(), { width: r, height: i, transformString: s, userSelectionActive: a } = j(Sh, ie), l = ts(), c = ee(null);
  ne(() => {
    n || c.current?.focus({
      preventScroll: !0
    });
  }, [n]);
  const u = !a && r !== null && i !== null;
  if (es({
    nodeRef: c,
    disabled: !u
  }), !u)
    return null;
  const d = e ? (h) => {
    const g = o.getState().nodes.filter((v) => v.selected);
    e(h, g);
  } : void 0, f = (h) => {
    Object.prototype.hasOwnProperty.call(rn, h.key) && (h.preventDefault(), l({
      direction: rn[h.key],
      factor: h.shiftKey ? 4 : 1
    }));
  };
  return T("div", { className: ae(["react-flow__nodesselection", "react-flow__container", t]), style: {
    transform: s
  }, children: T("div", { ref: c, className: "react-flow__nodesselection-rect", onContextMenu: d, tabIndex: n ? void 0 : -1, onKeyDown: n ? void 0 : f, style: {
    width: r,
    height: i
  } }) });
}
const _r = typeof window < "u" ? window : void 0, Nh = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function rs({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: o, onPaneMouseLeave: r, onPaneContextMenu: i, onPaneScroll: s, paneClickDistance: a, deleteKeyCode: l, selectionKeyCode: c, selectionOnDrag: u, selectionMode: d, onSelectionStart: f, onSelectionEnd: h, multiSelectionKeyCode: g, panActivationKeyCode: v, zoomActivationKeyCode: w, elementsSelectable: m, zoomOnScroll: _, zoomOnPinch: p, panOnScroll: x, panOnScrollSpeed: N, panOnScrollMode: b, zoomOnDoubleClick: C, panOnDrag: I, autoPanOnSelection: A, defaultViewport: O, translateExtent: P, minZoom: R, maxZoom: D, preventScrolling: y, onSelectionContextMenu: S, noWheelClassName: E, noPanClassName: M, disableKeyboardA11y: $, onViewportChange: k, isControlledViewport: V }) {
  const { nodesSelectionActive: L, userSelectionActive: H } = j(Nh, ie), X = Ct(c, { target: _r }), F = Ct(v, { target: _r }), W = F || I, Q = F || x, q = u && W !== !0, z = X || H || q;
  return nh({ deleteKeyCode: l, multiSelectionKeyCode: g }), T(ih, { onPaneContextMenu: i, elementsSelectable: m, zoomOnScroll: _, zoomOnPinch: p, panOnScroll: Q, panOnScrollSpeed: N, panOnScrollMode: b, zoomOnDoubleClick: C, panOnDrag: !X && W, defaultViewport: O, translateExtent: P, minZoom: R, maxZoom: D, zoomActivationKeyCode: w, preventScrolling: y, noWheelClassName: E, noPanClassName: M, onViewportChange: k, isControlledViewport: V, paneClickDistance: a, selectionOnDrag: q, children: ce(lh, { onSelectionStart: f, onSelectionEnd: h, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: o, onPaneMouseLeave: r, onPaneContextMenu: i, onPaneScroll: s, panOnDrag: W, autoPanOnSelection: A, isSelecting: !!z, selectionMode: d, selectionKeyPressed: X, paneClickDistance: a, selectionOnDrag: q, children: [e, L && T(Eh, { onSelectionContextMenu: S, noPanClassName: M, disableKeyboardA11y: $ })] }) });
}
rs.displayName = "FlowRenderer";
const Ch = se(rs), Mh = (e) => (t) => e ? ro(t.nodeLookup, { x: 0, y: 0, width: t.width, height: t.height }, t.transform, !0).map((n) => n.id) : Array.from(t.nodeLookup.keys());
function Ih(e) {
  return j(Ce(Mh(e), [e]), ie);
}
const Ah = (e) => e.updateNodeInternals;
function kh() {
  const e = j(Ah), [t] = we(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((n) => {
    const o = /* @__PURE__ */ new Map();
    n.forEach((r) => {
      const i = r.target.getAttribute("data-id");
      o.set(i, {
        id: i,
        nodeElement: r.target,
        force: !0
      });
    }), e(o);
  }));
  return ne(() => () => {
    t?.disconnect();
  }, [t]), t;
}
function $h({ node: e, nodeType: t, hasDimensions: n, resizeObserver: o }) {
  const r = oe(), i = ee(null), s = ee(null), a = ee(e.sourcePosition), l = ee(e.targetPosition), c = ee(t), u = n && !!e.internals.handleBounds;
  return ne(() => {
    i.current && !e.hidden && (!u || s.current !== i.current) && (s.current && o?.unobserve(s.current), o?.observe(i.current), s.current = i.current);
  }, [u, e.hidden]), ne(() => () => {
    s.current && (o?.unobserve(s.current), s.current = null);
  }, []), ne(() => {
    if (i.current) {
      const d = c.current !== t, f = a.current !== e.sourcePosition, h = l.current !== e.targetPosition;
      (d || f || h) && (c.current = t, a.current = e.sourcePosition, l.current = e.targetPosition, r.getState().updateNodeInternals(/* @__PURE__ */ new Map([[e.id, { id: e.id, nodeElement: i.current, force: !0 }]])));
    }
  }, [e.id, t, e.sourcePosition, e.targetPosition]), i;
}
function Ph({ id: e, onClick: t, onMouseEnter: n, onMouseMove: o, onMouseLeave: r, onContextMenu: i, onDoubleClick: s, nodesDraggable: a, elementsSelectable: l, nodesConnectable: c, nodesFocusable: u, resizeObserver: d, noDragClassName: f, noPanClassName: h, disableKeyboardA11y: g, rfId: v, nodeTypes: w, nodeClickDistance: m, onError: _ }) {
  const { node: p, internals: x, isParent: N } = j((z) => {
    const B = z.nodeLookup.get(e), K = z.parentLookup.has(e);
    return {
      node: B,
      internals: B.internals,
      isParent: K
    };
  }, ie);
  let b = p.type || "default", C = w?.[b] || br[b];
  C === void 0 && (_?.("003", ve.error003(b)), b = "default", C = w?.default || br.default);
  const I = !!(p.draggable || a && typeof p.draggable > "u"), A = !!(p.selectable || l && typeof p.selectable > "u"), O = !!(p.connectable || c && typeof p.connectable > "u"), P = !!(p.focusable || u && typeof p.focusable > "u"), R = oe(), D = Ei(p), y = $h({ node: p, nodeType: b, hasDimensions: D, resizeObserver: d }), S = es({
    nodeRef: y,
    disabled: p.hidden || !I,
    noDragClassName: f,
    handleSelector: p.dragHandle,
    nodeId: e,
    isSelectable: A,
    nodeClickDistance: m
  }), E = ts();
  if (p.hidden)
    return null;
  const M = Ie(p), $ = _h(p), k = A || I || t || n || o || r, V = n ? (z) => n(z, { ...x.userNode }) : void 0, L = o ? (z) => o(z, { ...x.userNode }) : void 0, H = r ? (z) => r(z, { ...x.userNode }) : void 0, X = i ? (z) => i(z, { ...x.userNode }) : void 0, F = s ? (z) => s(z, { ...x.userNode }) : void 0, W = (z) => {
    const { selectNodesOnDrag: B, nodeDragThreshold: K } = R.getState();
    A && (!B || !I || K > 0) && Gn({
      id: e,
      store: R,
      nodeRef: y
    }), t && t(z, { ...x.userNode });
  }, Q = (z) => {
    if (!(Mi(z.nativeEvent) || g)) {
      if (gi.includes(z.key) && A) {
        const B = z.key === "Escape";
        Gn({
          id: e,
          store: R,
          unselect: B,
          nodeRef: y
        });
      } else if (I && p.selected && Object.prototype.hasOwnProperty.call(rn, z.key)) {
        z.preventDefault();
        const { ariaLabelConfig: B } = R.getState();
        R.setState({
          ariaLiveMessage: B["node.a11yDescription.ariaLiveMessage"]({
            direction: z.key.replace("Arrow", "").toLowerCase(),
            x: ~~x.positionAbsolute.x,
            y: ~~x.positionAbsolute.y
          })
        }), E({
          direction: rn[z.key],
          factor: z.shiftKey ? 4 : 1
        });
      }
    }
  }, q = () => {
    if (g || !y.current?.matches(":focus-visible"))
      return;
    const { transform: z, width: B, height: K, autoPanOnNodeFocus: U, setCenter: Y } = R.getState();
    if (!U)
      return;
    ro(/* @__PURE__ */ new Map([[e, p]]), { x: 0, y: 0, width: B, height: K }, z, !0).length > 0 || Y(p.position.x + M.width / 2, p.position.y + M.height / 2, {
      zoom: z[2]
    });
  };
  return T("div", { className: ae([
    "react-flow__node",
    `react-flow__node-${b}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [h]: I
    },
    p.className,
    {
      selected: p.selected,
      selectable: A,
      parent: N,
      draggable: I,
      dragging: S
    }
  ]), ref: y, style: {
    zIndex: x.z,
    transform: `translate(${x.positionAbsolute.x}px,${x.positionAbsolute.y}px)`,
    pointerEvents: k ? "all" : "none",
    visibility: D ? "visible" : "hidden",
    ...p.style,
    ...$
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: V, onMouseMove: L, onMouseLeave: H, onContextMenu: X, onClick: W, onDoubleClick: F, onKeyDown: P ? Q : void 0, tabIndex: P ? 0 : void 0, onFocus: P ? q : void 0, role: p.ariaRole ?? (P ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": g ? void 0 : `${qi}-${v}`, "aria-label": p.ariaLabel, ...p.domAttributes, children: T(dh, { value: e, children: T(C, { id: e, data: p.data, type: b, positionAbsoluteX: x.positionAbsolute.x, positionAbsoluteY: x.positionAbsolute.y, selected: p.selected ?? !1, selectable: A, draggable: I, deletable: p.deletable ?? !0, isConnectable: O, sourcePosition: p.sourcePosition, targetPosition: p.targetPosition, dragging: S, dragHandle: p.dragHandle, zIndex: x.z, parentId: p.parentId, ...M }) }) });
}
var Dh = se(Ph);
const zh = (e) => ({
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function is(e) {
  const { nodesConnectable: t, nodesFocusable: n, elementsSelectable: o, onError: r } = j(zh, ie), i = Ih(e.onlyRenderVisibleElements), s = kh();
  return T("div", { className: "react-flow__nodes", style: yn, children: i.map((a) => (
    /*
     * The split of responsibilities between NodeRenderer and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For example, when you’re dragging a single node, that node gets
     * updated multiple times per second. If `NodeRenderer` were to update
     * every time, it would have to re-run the `nodes.map()` loop every
     * time. This gets pricey with hundreds of nodes, especially if every
     * loop cycle does more than just rendering a JSX element!
     *
     * As a result of this choice, we took the following implementation
     * decisions:
     * - NodeRenderer subscribes *only* to node IDs – and therefore
     *   rerender *only* when visible nodes are added or removed.
     * - NodeRenderer performs all operations the result of which can be
     *   shared between nodes (such as creating the `ResizeObserver`
     *   instance, or subscribing to `selector`). This means extra prop
     *   drilling into `NodeComponentWrapper`, but it means we need to run
     *   these operations only once – instead of once per node.
     * - Any operations that you’d normally write inside `nodes.map` are
     *   moved into `NodeComponentWrapper`. This ensures they are
     *   memorized – so if `NodeRenderer` *has* to rerender, it only
     *   needs to regenerate the list of nodes, nothing else.
     */
    T(Dh, { id: a, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: s, nodesDraggable: e.nodesDraggable ?? !0, nodesConnectable: t, nodesFocusable: n, elementsSelectable: o, nodeClickDistance: e.nodeClickDistance, onError: r }, a)
  )) });
}
is.displayName = "NodeRenderer";
const Th = se(is);
function Hh(e) {
  return j(Ce((n) => {
    if (!e)
      return n.edges.map((r) => r.id);
    const o = [];
    if (n.width && n.height)
      for (const r of n.edges) {
        const i = n.nodeLookup.get(r.source), s = n.nodeLookup.get(r.target);
        i && s && kd({
          sourceNode: i,
          targetNode: s,
          width: n.width,
          height: n.height,
          transform: n.transform
        }) && o.push(r.id);
      }
    return o;
  }, [e]), ie);
}
const Rh = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e }
  };
  return T("polyline", { className: "arrow", style: n, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, Lh = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e, fill: e }
  };
  return T("polyline", { className: "arrowclosed", style: n, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, Sr = {
  [en.Arrow]: Rh,
  [en.ArrowClosed]: Lh
};
function Vh(e) {
  const t = oe();
  return xe(() => Object.prototype.hasOwnProperty.call(Sr, e) ? Sr[e] : (t.getState().onError?.("009", ve.error009(e)), null), [e]);
}
const Oh = ({ id: e, type: t, color: n, width: o = 12.5, height: r = 12.5, markerUnits: i = "strokeWidth", strokeWidth: s, orient: a = "auto-start-reverse" }) => {
  const l = Vh(t);
  return l ? T("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${o}`, markerHeight: `${r}`, viewBox: "-10 -10 20 20", markerUnits: i, orient: a, refX: "0", refY: "0", children: T(l, { color: n, strokeWidth: s }) }) : null;
}, ss = ({ defaultColor: e, rfId: t }) => {
  const n = j((i) => i.edges), o = j((i) => i.defaultEdgeOptions), r = xe(() => Ld(n, {
    id: t,
    defaultColor: e,
    defaultMarkerStart: o?.markerStart,
    defaultMarkerEnd: o?.markerEnd
  }), [n, o, t, e]);
  return r.length ? T("svg", { className: "react-flow__marker", "aria-hidden": "true", children: T("defs", { children: r.map((i) => T(Oh, { id: i.id, type: i.type, color: i.color, width: i.width, height: i.height, markerUnits: i.markerUnits, strokeWidth: i.strokeWidth, orient: i.orient }, i.id)) }) }) : null;
};
ss.displayName = "MarkerDefinitions";
var Bh = se(ss);
function as({ x: e, y: t, label: n, labelStyle: o, labelShowBg: r = !0, labelBgStyle: i, labelBgPadding: s = [2, 4], labelBgBorderRadius: a = 2, children: l, className: c, ...u }) {
  const [d, f] = we({ x: 1, y: 0, width: 0, height: 0 }), h = ae(["react-flow__edge-textwrapper", c]), g = ee(null);
  return ne(() => {
    if (g.current) {
      const v = g.current.getBBox();
      f({
        x: v.x,
        y: v.y,
        width: v.width,
        height: v.height
      });
    }
  }, [n]), n ? ce("g", { transform: `translate(${e - d.width / 2} ${t - d.height / 2})`, className: h, visibility: d.width ? "visible" : "hidden", ...u, children: [r && T("rect", { width: d.width + 2 * s[0], x: -s[0], y: -s[1], height: d.height + 2 * s[1], className: "react-flow__edge-textbg", style: i, rx: a, ry: a }), T("text", { className: "react-flow__edge-text", y: d.height / 2, dy: "0.3em", ref: g, style: o, children: n }), l] }) : null;
}
as.displayName = "EdgeText";
const Fh = se(as);
function wn({ path: e, labelX: t, labelY: n, label: o, labelStyle: r, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l, interactionWidth: c = 20, ...u }) {
  return ce(He, { children: [T("path", { ...u, d: e, fill: "none", className: ae(["react-flow__edge-path", u.className]) }), c ? T("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: c, className: "react-flow__edge-interaction" }) : null, o && me(t) && me(n) ? T(Fh, { x: t, y: n, label: o, labelStyle: r, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l }) : null] });
}
function Er({ pos: e, x1: t, y1: n, x2: o, y2: r }) {
  return e === Z.Left || e === Z.Right ? [0.5 * (t + o), n] : [t, 0.5 * (n + r)];
}
function cs({ sourceX: e, sourceY: t, sourcePosition: n = Z.Bottom, targetX: o, targetY: r, targetPosition: i = Z.Top }) {
  const [s, a] = Er({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: r
  }), [l, c] = Er({
    pos: i,
    x1: o,
    y1: r,
    x2: e,
    y2: t
  }), [u, d, f, h] = Ai({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: r,
    sourceControlX: s,
    sourceControlY: a,
    targetControlX: l,
    targetControlY: c
  });
  return [
    `M${e},${t} C${s},${a} ${l},${c} ${o},${r}`,
    u,
    d,
    f,
    h
  ];
}
function ls(e) {
  return se(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: i, sourcePosition: s, targetPosition: a, label: l, labelStyle: c, labelShowBg: u, labelBgStyle: d, labelBgPadding: f, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: w, interactionWidth: m }) => {
    const [_, p, x] = cs({
      sourceX: n,
      sourceY: o,
      sourcePosition: s,
      targetX: r,
      targetY: i,
      targetPosition: a
    }), N = e.isInternal ? void 0 : t;
    return T(wn, { id: N, path: _, labelX: p, labelY: x, label: l, labelStyle: c, labelShowBg: u, labelBgStyle: d, labelBgPadding: f, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: w, interactionWidth: m });
  });
}
const Xh = ls({ isInternal: !1 }), us = ls({ isInternal: !0 });
Xh.displayName = "SimpleBezierEdge";
us.displayName = "SimpleBezierEdgeInternal";
function ds(e) {
  return se(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: d, style: f, sourcePosition: h = Z.Bottom, targetPosition: g = Z.Top, markerEnd: v, markerStart: w, pathOptions: m, interactionWidth: _ }) => {
    const [p, x, N] = Yn({
      sourceX: n,
      sourceY: o,
      sourcePosition: h,
      targetX: r,
      targetY: i,
      targetPosition: g,
      borderRadius: m?.borderRadius,
      offset: m?.offset,
      stepPosition: m?.stepPosition
    }), b = e.isInternal ? void 0 : t;
    return T(wn, { id: b, path: p, labelX: x, labelY: N, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: d, style: f, markerEnd: v, markerStart: w, interactionWidth: _ });
  });
}
const fs = ds({ isInternal: !1 }), hs = ds({ isInternal: !0 });
fs.displayName = "SmoothStepEdge";
hs.displayName = "SmoothStepEdgeInternal";
function gs(e) {
  return se(({ id: t, ...n }) => {
    const o = e.isInternal ? void 0 : t;
    return T(fs, { ...n, id: o, pathOptions: xe(() => ({ borderRadius: 0, offset: n.pathOptions?.offset }), [n.pathOptions?.offset]) });
  });
}
const Yh = gs({ isInternal: !1 }), ps = gs({ isInternal: !0 });
Yh.displayName = "StepEdge";
ps.displayName = "StepEdgeInternal";
function ms(e) {
  return se(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: d, style: f, markerEnd: h, markerStart: g, interactionWidth: v }) => {
    const [w, m, _] = Pi({ sourceX: n, sourceY: o, targetX: r, targetY: i }), p = e.isInternal ? void 0 : t;
    return T(wn, { id: p, path: w, labelX: m, labelY: _, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: d, style: f, markerEnd: h, markerStart: g, interactionWidth: v });
  });
}
const Zh = ms({ isInternal: !1 }), ys = ms({ isInternal: !0 });
Zh.displayName = "StraightEdge";
ys.displayName = "StraightEdgeInternal";
function ws(e) {
  return se(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: i, sourcePosition: s = Z.Bottom, targetPosition: a = Z.Top, label: l, labelStyle: c, labelShowBg: u, labelBgStyle: d, labelBgPadding: f, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: w, pathOptions: m, interactionWidth: _ }) => {
    const [p, x, N] = ki({
      sourceX: n,
      sourceY: o,
      sourcePosition: s,
      targetX: r,
      targetY: i,
      targetPosition: a,
      curvature: m?.curvature
    }), b = e.isInternal ? void 0 : t;
    return T(wn, { id: b, path: p, labelX: x, labelY: N, label: l, labelStyle: c, labelShowBg: u, labelBgStyle: d, labelBgPadding: f, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: w, interactionWidth: _ });
  });
}
const Wh = ws({ isInternal: !1 }), xs = ws({ isInternal: !0 });
Wh.displayName = "BezierEdge";
xs.displayName = "BezierEdgeInternal";
const Nr = {
  default: xs,
  straight: ys,
  step: ps,
  smoothstep: hs,
  simplebezier: us
}, Cr = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  zIndex: void 0
}, qh = (e, t, n) => n === Z.Left ? e - t : n === Z.Right ? e + t : e, Gh = (e, t, n) => n === Z.Top ? e - t : n === Z.Bottom ? e + t : e, Mr = "react-flow__edgeupdater";
function Ir({ position: e, centerX: t, centerY: n, radius: o = 10, onMouseDown: r, onMouseEnter: i, onMouseOut: s, type: a }) {
  return T("circle", { onMouseDown: r, onMouseEnter: i, onMouseOut: s, className: ae([Mr, `${Mr}-${a}`]), cx: qh(t, o, e), cy: Gh(n, o, e), r: o, stroke: "transparent", fill: "transparent" });
}
function Uh({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: o, sourceY: r, targetX: i, targetY: s, sourcePosition: a, targetPosition: l, onReconnect: c, onReconnectStart: u, onReconnectEnd: d, setReconnecting: f, setUpdateHover: h }) {
  const g = oe(), v = (x, N) => {
    if (x.button !== 0)
      return;
    const { autoPanOnConnect: b, domNode: C, connectionMode: I, connectionRadius: A, lib: O, onConnectStart: P, cancelConnection: R, nodeLookup: D, rfId: y, panBy: S, updateConnection: E } = g.getState(), M = N.type === "target", $ = (L, H) => {
      f(!1), d?.(L, n, N.type, H);
    }, k = (L) => c?.(n, L), V = (L, H) => {
      f(!0), u?.(x, n, N.type), P?.(L, H);
    };
    qn.onPointerDown(x.nativeEvent, {
      autoPanOnConnect: b,
      connectionMode: I,
      connectionRadius: A,
      domNode: C,
      handleId: N.id,
      nodeId: N.nodeId,
      nodeLookup: D,
      isTarget: M,
      edgeUpdaterType: N.type,
      lib: O,
      flowId: y,
      cancelConnection: R,
      panBy: S,
      isValidConnection: (...L) => g.getState().isValidConnection?.(...L) ?? !0,
      onConnect: k,
      onConnectStart: V,
      onConnectEnd: (...L) => g.getState().onConnectEnd?.(...L),
      onReconnectEnd: $,
      updateConnection: E,
      getTransform: () => g.getState().transform,
      getFromHandle: () => g.getState().connection.fromHandle,
      dragThreshold: g.getState().connectionDragThreshold,
      handleDomNode: x.currentTarget
    });
  }, w = (x) => v(x, { nodeId: n.target, id: n.targetHandle ?? null, type: "target" }), m = (x) => v(x, { nodeId: n.source, id: n.sourceHandle ?? null, type: "source" }), _ = () => h(!0), p = () => h(!1);
  return ce(He, { children: [(e === !0 || e === "source") && T(Ir, { position: a, centerX: o, centerY: r, radius: t, onMouseDown: w, onMouseEnter: _, onMouseOut: p, type: "source" }), (e === !0 || e === "target") && T(Ir, { position: l, centerX: i, centerY: s, radius: t, onMouseDown: m, onMouseEnter: _, onMouseOut: p, type: "target" })] });
}
function Kh({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: o, onClick: r, onDoubleClick: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, reconnectRadius: u, onReconnect: d, onReconnectStart: f, onReconnectEnd: h, rfId: g, edgeTypes: v, noPanClassName: w, onError: m, disableKeyboardA11y: _ }) {
  let p = j((Y) => Y.edgeLookup.get(e));
  const x = j((Y) => Y.defaultEdgeOptions);
  p = x ? { ...x, ...p } : p;
  let N = p.type || "default", b = v?.[N] || Nr[N];
  b === void 0 && (m?.("011", ve.error011(N)), N = "default", b = v?.default || Nr.default);
  const C = !!(p.focusable || t && typeof p.focusable > "u"), I = typeof d < "u" && (p.reconnectable || n && typeof p.reconnectable > "u"), A = !!(p.selectable || o && typeof p.selectable > "u"), O = ee(null), [P, R] = we(!1), [D, y] = we(!1), S = oe(), { zIndex: E = p.zIndex, sourceX: M, sourceY: $, targetX: k, targetY: V, sourcePosition: L, targetPosition: H } = j(Ce((Y) => {
    const G = Y.nodeLookup.get(p.source), J = Y.nodeLookup.get(p.target);
    if (!G || !J)
      return Cr;
    const te = Rd({
      id: e,
      sourceNode: G,
      targetNode: J,
      sourceHandle: p.sourceHandle || null,
      targetHandle: p.targetHandle || null,
      connectionMode: Y.connectionMode,
      onError: m
    }), re = Ad({
      selected: p.selected,
      zIndex: p.zIndex,
      sourceNode: G,
      targetNode: J,
      elevateOnSelect: Y.elevateEdgesOnSelect,
      zIndexMode: Y.zIndexMode
    });
    return {
      ...te || Cr,
      zIndex: re
    };
  }, [p.source, p.target, p.sourceHandle, p.targetHandle, p.selected, p.zIndex]), ie), X = xe(() => p.markerStart ? `url('#${Zn(p.markerStart, g)}')` : void 0, [p.markerStart, g]), F = xe(() => p.markerEnd ? `url('#${Zn(p.markerEnd, g)}')` : void 0, [p.markerEnd, g]);
  if (p.hidden || M === null || $ === null || k === null || V === null)
    return null;
  const W = (Y) => {
    const { addSelectedEdges: G, unselectNodesAndEdges: J, multiSelectionActive: te } = S.getState();
    A && (S.setState({ nodesSelectionActive: !1 }), p.selected && te ? (J({ nodes: [], edges: [p] }), O.current?.blur()) : G([e])), r && r(Y, p);
  }, Q = i ? (Y) => {
    i(Y, { ...p });
  } : void 0, q = s ? (Y) => {
    s(Y, { ...p });
  } : void 0, z = a ? (Y) => {
    a(Y, { ...p });
  } : void 0, B = l ? (Y) => {
    l(Y, { ...p });
  } : void 0, K = c ? (Y) => {
    c(Y, { ...p });
  } : void 0, U = (Y) => {
    if (!_ && gi.includes(Y.key) && A) {
      const { unselectNodesAndEdges: G, addSelectedEdges: J } = S.getState();
      Y.key === "Escape" ? (O.current?.blur(), G({ edges: [p] })) : J([e]);
    }
  };
  return T("svg", { style: { zIndex: E }, children: ce("g", { className: ae([
    "react-flow__edge",
    `react-flow__edge-${N}`,
    p.className,
    w,
    {
      selected: p.selected,
      animated: p.animated,
      inactive: !A && !r,
      updating: P,
      selectable: A
    }
  ]), onClick: W, onDoubleClick: Q, onContextMenu: q, onMouseEnter: z, onMouseMove: B, onMouseLeave: K, onKeyDown: C ? U : void 0, tabIndex: C ? 0 : void 0, role: p.ariaRole ?? (C ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": p.ariaLabel === null ? void 0 : p.ariaLabel || `Edge from ${p.source} to ${p.target}`, "aria-describedby": C ? `${Gi}-${g}` : void 0, ref: O, ...p.domAttributes, children: [!D && T(b, { id: e, source: p.source, target: p.target, type: p.type, selected: p.selected, animated: p.animated, selectable: A, deletable: p.deletable ?? !0, label: p.label, labelStyle: p.labelStyle, labelShowBg: p.labelShowBg, labelBgStyle: p.labelBgStyle, labelBgPadding: p.labelBgPadding, labelBgBorderRadius: p.labelBgBorderRadius, sourceX: M, sourceY: $, targetX: k, targetY: V, sourcePosition: L, targetPosition: H, data: p.data, style: p.style, sourceHandleId: p.sourceHandle, targetHandleId: p.targetHandle, markerStart: X, markerEnd: F, pathOptions: "pathOptions" in p ? p.pathOptions : void 0, interactionWidth: p.interactionWidth }), I && T(Uh, { edge: p, isReconnectable: I, reconnectRadius: u, onReconnect: d, onReconnectStart: f, onReconnectEnd: h, sourceX: M, sourceY: $, targetX: k, targetY: V, sourcePosition: L, targetPosition: H, setUpdateHover: R, setReconnecting: y })] }) });
}
var Qh = se(Kh);
const Jh = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function vs({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: o, noPanClassName: r, onReconnect: i, onEdgeContextMenu: s, onEdgeMouseEnter: a, onEdgeMouseMove: l, onEdgeMouseLeave: c, onEdgeClick: u, reconnectRadius: d, onEdgeDoubleClick: f, onReconnectStart: h, onReconnectEnd: g, disableKeyboardA11y: v }) {
  const { edgesFocusable: w, edgesReconnectable: m, elementsSelectable: _, onError: p } = j(Jh, ie), x = Hh(t);
  return ce("div", { className: "react-flow__edges", children: [T(Bh, { defaultColor: e, rfId: n }), x.map((N) => T(Qh, { id: N, edgesFocusable: w, edgesReconnectable: m, elementsSelectable: _, noPanClassName: r, onReconnect: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, onClick: u, reconnectRadius: d, onDoubleClick: f, onReconnectStart: h, onReconnectEnd: g, rfId: n, onError: p, edgeTypes: o, disableKeyboardA11y: v }, N))] });
}
vs.displayName = "EdgeRenderer";
const jh = se(vs), Ar = (e) => `translate(${e[0]}px,${e[1]}px) scale(${e[2]})`;
function eg({ children: e }) {
  const t = oe(), n = ee(null), [o] = we(() => t.getState().transform);
  return Ji(() => {
    let r = null;
    const i = () => {
      const s = t.getState().transform;
      r && s[0] === r[0] && s[1] === r[1] && s[2] === r[2] || (r = s, n.current && (n.current.style.transform = Ar(s)));
    };
    return i(), t.subscribe(i);
  }, [t]), T("div", { ref: n, className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: Ar(o) }, children: e });
}
function tg(e) {
  const t = go(), n = ee(!1);
  ne(() => {
    !n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
  }, [e, t.viewportInitialized]);
}
const ng = (e) => e.panZoom?.syncViewport;
function og(e) {
  const t = j(ng), n = oe();
  return ne(() => {
    e && (t?.(e), n.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, t]), null;
}
function rg(e) {
  return e.connection.inProgress ? { ...e.connection, to: Pt(e.connection.to, e.transform) } : { ...e.connection };
}
function ig(e) {
  return rg;
}
function sg(e) {
  const t = ig();
  return j(t, ie);
}
const ag = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function cg({ containerStyle: e, style: t, type: n, component: o }) {
  const { nodesConnectable: r, width: i, height: s, isValid: a, inProgress: l } = j(ag, ie);
  return !(i && r && l) ? null : T("svg", { style: e, width: i, height: s, className: "react-flow__connectionline react-flow__container", children: T("g", { className: ae(["react-flow__connection", yi(a)]), children: T(bs, { style: t, type: n, CustomComponent: o, isValid: a }) }) });
}
const bs = ({ style: e, type: t = Ve.Bezier, CustomComponent: n, isValid: o }) => {
  const { inProgress: r, from: i, fromNode: s, fromHandle: a, fromPosition: l, to: c, toNode: u, toHandle: d, toPosition: f, pointer: h } = sg();
  if (!r)
    return;
  if (n)
    return T(n, { connectionLineType: t, connectionLineStyle: e, fromNode: s, fromHandle: a, fromX: i.x, fromY: i.y, toX: c.x, toY: c.y, fromPosition: l, toPosition: f, connectionStatus: yi(o), toNode: u, toHandle: d, pointer: h });
  let g = "";
  const v = {
    sourceX: i.x,
    sourceY: i.y,
    sourcePosition: l,
    targetX: c.x,
    targetY: c.y,
    targetPosition: f
  };
  switch (t) {
    case Ve.Bezier:
      [g] = ki(v);
      break;
    case Ve.SimpleBezier:
      [g] = cs(v);
      break;
    case Ve.Step:
      [g] = Yn({
        ...v,
        borderRadius: 0
      });
      break;
    case Ve.SmoothStep:
      [g] = Yn(v);
      break;
    default:
      [g] = Pi(v);
  }
  return T("path", { d: g, fill: "none", className: "react-flow__connection-path", style: e });
};
bs.displayName = "ConnectionLine";
const lg = {};
function kr(e = lg) {
  ee(e), oe(), ne(() => {
  }, [e]);
}
function ug() {
  oe(), ee(!1), ne(() => {
  }, []);
}
function _s({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: o, onEdgeClick: r, onNodeDoubleClick: i, onEdgeDoubleClick: s, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: u, onSelectionContextMenu: d, onSelectionStart: f, onSelectionEnd: h, connectionLineType: g, connectionLineStyle: v, connectionLineComponent: w, connectionLineContainerStyle: m, selectionKeyCode: _, selectionOnDrag: p, selectionMode: x, multiSelectionKeyCode: N, panActivationKeyCode: b, zoomActivationKeyCode: C, deleteKeyCode: I, onlyRenderVisibleElements: A, elementsSelectable: O, defaultViewport: P, translateExtent: R, minZoom: D, maxZoom: y, preventScrolling: S, defaultMarkerColor: E, zoomOnScroll: M, zoomOnPinch: $, panOnScroll: k, panOnScrollSpeed: V, panOnScrollMode: L, zoomOnDoubleClick: H, panOnDrag: X, autoPanOnSelection: F, onPaneClick: W, onPaneMouseEnter: Q, onPaneMouseMove: q, onPaneMouseLeave: z, onPaneScroll: B, onPaneContextMenu: K, paneClickDistance: U, nodeClickDistance: Y, onEdgeContextMenu: G, onEdgeMouseEnter: J, onEdgeMouseMove: te, onEdgeMouseLeave: re, reconnectRadius: le, onReconnect: Ae, onReconnectStart: _e, onReconnectEnd: Se, noDragClassName: ke, noWheelClassName: dt, noPanClassName: Be, disableKeyboardA11y: Fe, nodeExtent: he, rfId: $e, viewport: Pe, onViewportChange: Xe, nodesDraggable: xn }) {
  return kr(e), kr(t), ug(), tg(n), og(Pe), T(Ch, { onPaneClick: W, onPaneMouseEnter: Q, onPaneMouseMove: q, onPaneMouseLeave: z, onPaneContextMenu: K, onPaneScroll: B, paneClickDistance: U, deleteKeyCode: I, selectionKeyCode: _, selectionOnDrag: p, selectionMode: x, onSelectionStart: f, onSelectionEnd: h, multiSelectionKeyCode: N, panActivationKeyCode: b, zoomActivationKeyCode: C, elementsSelectable: O, zoomOnScroll: M, zoomOnPinch: $, zoomOnDoubleClick: H, panOnScroll: k, panOnScrollSpeed: V, panOnScrollMode: L, panOnDrag: X, autoPanOnSelection: F, defaultViewport: P, translateExtent: R, minZoom: D, maxZoom: y, onSelectionContextMenu: d, preventScrolling: S, noDragClassName: ke, noWheelClassName: dt, noPanClassName: Be, disableKeyboardA11y: Fe, onViewportChange: Xe, isControlledViewport: !!Pe, children: ce(eg, { children: [T(jh, { edgeTypes: t, onEdgeClick: r, onEdgeDoubleClick: s, onReconnect: Ae, onReconnectStart: _e, onReconnectEnd: Se, onlyRenderVisibleElements: A, onEdgeContextMenu: G, onEdgeMouseEnter: J, onEdgeMouseMove: te, onEdgeMouseLeave: re, reconnectRadius: le, defaultMarkerColor: E, noPanClassName: Be, disableKeyboardA11y: Fe, rfId: $e }), T(cg, { style: v, type: g, component: w, containerStyle: m }), T("div", { className: "react-flow__edgelabel-renderer" }), T(Th, { nodeTypes: e, onNodeClick: o, onNodeDoubleClick: i, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: u, nodeClickDistance: Y, onlyRenderVisibleElements: A, noPanClassName: Be, noDragClassName: ke, disableKeyboardA11y: Fe, nodeExtent: he, rfId: $e, nodesDraggable: xn }), T("div", { className: "react-flow__viewport-portal" })] }) });
}
_s.displayName = "GraphView";
const dg = se(_s), fg = Si(), $r = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, width: r, height: i, fitView: s, fitViewOptions: a, minZoom: l = 0.5, maxZoom: c = 2, nodeOrigin: u, nodeExtent: d, zIndexMode: f = "basic" } = {}) => {
  const h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), m = o ?? t ?? [], _ = n ?? e ?? [], p = u ?? [0, 0], x = d ?? _t;
  Ti(v, w, m);
  const { nodesInitialized: N } = Wn(_, h, g, {
    nodeOrigin: p,
    nodeExtent: x,
    zIndexMode: f
  });
  let b = [0, 0, 1];
  if (s && r && i) {
    const C = kt(h, {
      filter: (P) => !!((P.width || P.initialWidth) && (P.height || P.initialHeight))
    }), { x: I, y: A, zoom: O } = so(C, r, i, l, c, a?.padding ?? 0.1);
    b = [I, A, O];
  }
  return {
    rfId: "1",
    width: r ?? 0,
    height: i ?? 0,
    transform: b,
    nodes: _,
    nodesInitialized: N,
    nodeLookup: h,
    parentLookup: g,
    edges: m,
    edgeLookup: w,
    connectionLookup: v,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: n !== void 0,
    hasDefaultEdges: o !== void 0,
    panZoom: null,
    minZoom: l,
    maxZoom: c,
    translateExtent: _t,
    nodeExtent: x,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: st.Strict,
    domNode: null,
    paneDragging: !1,
    noPanClassName: "nopan",
    nodeOrigin: p,
    nodeDragThreshold: 1,
    connectionDragThreshold: 1,
    snapGrid: [15, 15],
    snapToGrid: !1,
    nodesDraggable: !0,
    nodesConnectable: !0,
    nodesFocusable: !0,
    edgesFocusable: !0,
    edgesReconnectable: !0,
    elementsSelectable: !0,
    elevateNodesOnSelect: !0,
    elevateEdgesOnSelect: !0,
    selectNodesOnDrag: !0,
    multiSelectionActive: !1,
    fitViewQueued: s ?? !1,
    fitViewOptions: a,
    fitViewResolver: null,
    connection: { ...mi },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: fg,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: pi,
    zIndexMode: f,
    onNodesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
    onEdgesChangeMiddlewareMap: /* @__PURE__ */ new Map()
  };
}, hg = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, width: r, height: i, fitView: s, fitViewOptions: a, minZoom: l, maxZoom: c, nodeOrigin: u, nodeExtent: d, zIndexMode: f }) => Nf((h, g) => {
  async function v() {
    const { nodeLookup: w, panZoom: m, fitViewOptions: _, fitViewResolver: p, width: x, height: N, minZoom: b, maxZoom: C } = g();
    m && (await _d({
      nodes: w,
      width: x,
      height: N,
      panZoom: m,
      minZoom: b,
      maxZoom: C
    }, _), p?.resolve(!0), h({ fitViewResolver: null }));
  }
  return {
    ...$r({
      nodes: e,
      edges: t,
      width: r,
      height: i,
      fitView: s,
      fitViewOptions: a,
      minZoom: l,
      maxZoom: c,
      nodeOrigin: u,
      nodeExtent: d,
      defaultNodes: n,
      defaultEdges: o,
      zIndexMode: f
    }),
    setNodes: (w) => {
      const { nodeLookup: m, parentLookup: _, nodeOrigin: p, elevateNodesOnSelect: x, fitViewQueued: N, zIndexMode: b, nodesSelectionActive: C } = g(), { nodesInitialized: I, hasSelectedNodes: A } = Wn(w, m, _, {
        nodeOrigin: p,
        nodeExtent: d,
        elevateNodesOnSelect: x,
        checkEquality: !0,
        zIndexMode: b
      }), O = C && A;
      N && I ? (v(), h({
        nodes: w,
        nodesInitialized: I,
        fitViewQueued: !1,
        fitViewOptions: void 0,
        nodesSelectionActive: O
      })) : h({ nodes: w, nodesInitialized: I, nodesSelectionActive: O });
    },
    setEdges: (w) => {
      const { connectionLookup: m, edgeLookup: _ } = g();
      Ti(m, _, w), h({ edges: w });
    },
    setDefaultNodesAndEdges: (w, m) => {
      if (w) {
        const { setNodes: _ } = g();
        _(w), h({ hasDefaultNodes: !0 });
      }
      if (m) {
        const { setEdges: _ } = g();
        _(m), h({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registered at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (w) => {
      const { triggerNodeChanges: m, nodeLookup: _, parentLookup: p, domNode: x, nodeOrigin: N, nodeExtent: b, debug: C, fitViewQueued: I, zIndexMode: A } = g(), { changes: O, updatedInternals: P } = Zd(w, _, p, x, N, b, A);
      P && (Bd(_, p, { nodeOrigin: N, nodeExtent: b, zIndexMode: A }), I ? (v(), h({ fitViewQueued: !1, fitViewOptions: void 0 })) : h({}), O?.length > 0 && (C && console.log("React Flow: trigger node changes", O), m?.(O)));
    },
    updateNodePositions: (w, m = !1) => {
      const _ = [];
      let p = [];
      const { nodeLookup: x, triggerNodeChanges: N, connection: b, updateConnection: C, onNodesChangeMiddlewareMap: I } = g();
      for (const [A, O] of w) {
        const P = x.get(A), R = !!(P?.expandParent && P?.parentId && O?.position), D = {
          id: A,
          type: "position",
          position: R ? {
            x: Math.max(0, O.position.x),
            y: Math.max(0, O.position.y)
          } : O.position,
          dragging: m
        };
        if (P && b.inProgress && b.fromNode.id === P.id) {
          const y = Je(P, b.fromHandle, Z.Left, !0);
          C({ ...b, from: y });
        }
        R && P.parentId && _.push({
          id: A,
          parentId: P.parentId,
          rect: {
            ...O.internals.positionAbsolute,
            width: O.measured.width ?? 0,
            height: O.measured.height ?? 0
          }
        }), p.push(D);
      }
      if (_.length > 0) {
        const { parentLookup: A, nodeOrigin: O } = g(), P = ho(_, x, A, O);
        p.push(...P);
      }
      for (const A of I.values())
        p = A(p);
      N(p);
    },
    triggerNodeChanges: (w) => {
      const { onNodesChange: m, setNodes: _, nodes: p, hasDefaultNodes: x, debug: N } = g();
      if (w?.length) {
        if (x) {
          const b = Wf(w, p);
          _(b);
        }
        N && console.log("React Flow: trigger node changes", w), m?.(w);
      }
    },
    triggerEdgeChanges: (w) => {
      const { onEdgesChange: m, setEdges: _, edges: p, hasDefaultEdges: x, debug: N } = g();
      if (w?.length) {
        if (x) {
          const b = qf(w, p);
          _(b);
        }
        N && console.log("React Flow: trigger edge changes", w), m?.(w);
      }
    },
    addSelectedNodes: (w) => {
      const { multiSelectionActive: m, edgeLookup: _, nodeLookup: p, triggerNodeChanges: x, triggerEdgeChanges: N } = g();
      if (m) {
        const b = w.map((C) => Ye(C, !0));
        x(b);
        return;
      }
      x(tt(p, /* @__PURE__ */ new Set([...w]), !0)), N(tt(_));
    },
    addSelectedEdges: (w) => {
      const { multiSelectionActive: m, edgeLookup: _, nodeLookup: p, triggerNodeChanges: x, triggerEdgeChanges: N } = g();
      if (m) {
        const b = w.map((C) => Ye(C, !0));
        N(b);
        return;
      }
      N(tt(_, /* @__PURE__ */ new Set([...w]))), x(tt(p, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: w, edges: m } = {}) => {
      const { edges: _, nodes: p, nodeLookup: x, triggerNodeChanges: N, triggerEdgeChanges: b } = g(), C = w || p, I = m || _, A = [];
      for (const P of C) {
        if (!P.selected)
          continue;
        const R = x.get(P.id);
        R && (R.selected = !1), A.push(Ye(P.id, !1));
      }
      const O = [];
      for (const P of I)
        P.selected && O.push(Ye(P.id, !1));
      N(A), b(O);
    },
    setMinZoom: (w) => {
      const { panZoom: m, maxZoom: _ } = g();
      m?.setScaleExtent([w, _]), h({ minZoom: w });
    },
    setMaxZoom: (w) => {
      const { panZoom: m, minZoom: _ } = g();
      m?.setScaleExtent([_, w]), h({ maxZoom: w });
    },
    setTranslateExtent: (w) => {
      g().panZoom?.setTranslateExtent(w), h({ translateExtent: w });
    },
    resetSelectedElements: () => {
      const { edges: w, nodes: m, triggerNodeChanges: _, triggerEdgeChanges: p, elementsSelectable: x } = g();
      if (!x)
        return;
      const N = m.reduce((C, I) => I.selected ? [...C, Ye(I.id, !1)] : C, []), b = w.reduce((C, I) => I.selected ? [...C, Ye(I.id, !1)] : C, []);
      _(N), p(b);
    },
    setNodeExtent: (w) => {
      const { nodes: m, nodeLookup: _, parentLookup: p, nodeOrigin: x, elevateNodesOnSelect: N, nodeExtent: b, zIndexMode: C } = g();
      w[0][0] === b[0][0] && w[0][1] === b[0][1] && w[1][0] === b[1][0] && w[1][1] === b[1][1] || (Wn(m, _, p, {
        nodeOrigin: x,
        nodeExtent: w,
        elevateNodesOnSelect: N,
        checkEquality: !1,
        zIndexMode: C
      }), h({ nodeExtent: w }));
    },
    panBy: (w) => {
      const { transform: m, width: _, height: p, panZoom: x, translateExtent: N } = g();
      return Wd({ delta: w, panZoom: x, transform: m, translateExtent: N, width: _, height: p });
    },
    setCenter: async (w, m, _) => {
      const { width: p, height: x, maxZoom: N, panZoom: b } = g();
      if (!b)
        return !1;
      const C = typeof _?.zoom < "u" ? _.zoom : N;
      return await b.setViewport({
        x: p / 2 - w * C,
        y: x / 2 - m * C,
        zoom: C
      }, { duration: _?.duration, ease: _?.ease, interpolate: _?.interpolate }), !0;
    },
    cancelConnection: () => {
      h({
        connection: { ...mi }
      });
    },
    updateConnection: (w) => {
      h({ connection: w });
    },
    reset: () => h({ ...$r() })
  };
}, Object.is);
function gg({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: o, initialWidth: r, initialHeight: i, initialMinZoom: s, initialMaxZoom: a, initialFitViewOptions: l, fitView: c, nodeOrigin: u, nodeExtent: d, zIndexMode: f, children: h }) {
  const [g] = we(() => hg({
    nodes: e,
    edges: t,
    defaultNodes: n,
    defaultEdges: o,
    width: r,
    height: i,
    fitView: c,
    minZoom: s,
    maxZoom: a,
    fitViewOptions: l,
    nodeOrigin: u,
    nodeExtent: d,
    zIndexMode: f
  }));
  return T(Cf, { value: g, children: T(Jf, { children: T(hh, { children: h }) }) });
}
function pg({ children: e, nodes: t, edges: n, defaultNodes: o, defaultEdges: r, width: i, height: s, fitView: a, fitViewOptions: l, minZoom: c, maxZoom: u, nodeOrigin: d, nodeExtent: f, zIndexMode: h }) {
  return ut(pn) ? T(He, { children: e }) : T(gg, { initialNodes: t, initialEdges: n, defaultNodes: o, defaultEdges: r, initialWidth: i, initialHeight: s, fitView: a, initialFitViewOptions: l, initialMinZoom: c, initialMaxZoom: u, nodeOrigin: d, nodeExtent: f, zIndexMode: h, children: e });
}
const mg = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function yg({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, className: r, nodeTypes: i, edgeTypes: s, onNodeClick: a, onEdgeClick: l, onInit: c, onMove: u, onMoveStart: d, onMoveEnd: f, onConnect: h, onConnectStart: g, onConnectEnd: v, onClickConnectStart: w, onClickConnectEnd: m, onNodeMouseEnter: _, onNodeMouseMove: p, onNodeMouseLeave: x, onNodeContextMenu: N, onNodeDoubleClick: b, onNodeDragStart: C, onNodeDrag: I, onNodeDragStop: A, onNodesDelete: O, onEdgesDelete: P, onDelete: R, onSelectionChange: D, onSelectionDragStart: y, onSelectionDrag: S, onSelectionDragStop: E, onSelectionContextMenu: M, onSelectionStart: $, onSelectionEnd: k, onBeforeDelete: V, connectionMode: L, connectionLineType: H = Ve.Bezier, connectionLineStyle: X, connectionLineComponent: F, connectionLineContainerStyle: W, deleteKeyCode: Q = "Backspace", selectionKeyCode: q = "Shift", selectionOnDrag: z = !1, selectionMode: B = St.Full, panActivationKeyCode: K = "Space", multiSelectionKeyCode: U = Nt() ? "Meta" : "Control", zoomActivationKeyCode: Y = Nt() ? "Meta" : "Control", snapToGrid: G, snapGrid: J, onlyRenderVisibleElements: te = !1, selectNodesOnDrag: re, nodesDraggable: le, autoPanOnNodeFocus: Ae, nodesConnectable: _e, nodesFocusable: Se, nodeOrigin: ke = Ui, edgesFocusable: dt, edgesReconnectable: Be, elementsSelectable: Fe = !0, defaultViewport: he = Vf, minZoom: $e = 0.5, maxZoom: Pe = 2, translateExtent: Xe = _t, preventScrolling: xn = !0, nodeExtent: vn, defaultMarkerColor: Cs = "#b1b1b7", zoomOnScroll: Ms = !0, zoomOnPinch: Is = !0, panOnScroll: As = !1, panOnScrollSpeed: ks = 0.5, panOnScrollMode: $s = qe.Free, zoomOnDoubleClick: Ps = !0, panOnDrag: Ds = !0, onPaneClick: zs, onPaneMouseEnter: Ts, onPaneMouseMove: Hs, onPaneMouseLeave: Rs, onPaneScroll: Ls, onPaneContextMenu: Vs, paneClickDistance: Os = 1, nodeClickDistance: Bs = 0, children: Fs, onReconnect: Xs, onReconnectStart: Ys, onReconnectEnd: Zs, onEdgeContextMenu: Ws, onEdgeDoubleClick: qs, onEdgeMouseEnter: Gs, onEdgeMouseMove: Us, onEdgeMouseLeave: Ks, reconnectRadius: Qs = 10, onNodesChange: Js, onEdgesChange: js, noDragClassName: ea = "nodrag", noWheelClassName: ta = "nowheel", noPanClassName: yo = "nopan", fitView: wo, fitViewOptions: xo, connectOnClick: na, attributionPosition: oa, proOptions: ra, defaultEdgeOptions: ia, elevateNodesOnSelect: sa = !0, elevateEdgesOnSelect: aa = !1, disableKeyboardA11y: vo = !1, autoPanOnConnect: ca, autoPanOnNodeDrag: la, autoPanOnSelection: ua = !0, autoPanSpeed: da, connectionRadius: fa, isValidConnection: ha, onError: ga, style: pa, id: bo, nodeDragThreshold: ma, connectionDragThreshold: ya, viewport: wa, onViewportChange: xa, width: va, height: ba, colorMode: _a = "light", debug: Sa, onScroll: _o, ariaLabelConfig: Ea, zIndexMode: So = "basic", ...Na }, Ca) {
  const bn = bo || "1", Ma = Xf(_a), Ia = Ce((Eo) => {
    Eo.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), _o?.(Eo);
  }, [_o]);
  return T("div", { "data-testid": "rf__wrapper", ...Na, onScroll: Ia, style: { ...pa, ...mg }, ref: Ca, className: ae(["react-flow", r, Ma]), id: bo, role: "application", children: ce(pg, { nodes: e, edges: t, width: va, height: ba, fitView: wo, fitViewOptions: xo, minZoom: $e, maxZoom: Pe, nodeOrigin: ke, nodeExtent: vn, zIndexMode: So, children: [T(Ff, { nodes: e, edges: t, defaultNodes: n, defaultEdges: o, onConnect: h, onConnectStart: g, onConnectEnd: v, onClickConnectStart: w, onClickConnectEnd: m, nodesDraggable: le, autoPanOnNodeFocus: Ae, nodesConnectable: _e, nodesFocusable: Se, edgesFocusable: dt, edgesReconnectable: Be, elementsSelectable: Fe, elevateNodesOnSelect: sa, elevateEdgesOnSelect: aa, minZoom: $e, maxZoom: Pe, nodeExtent: vn, onNodesChange: Js, onEdgesChange: js, snapToGrid: G, snapGrid: J, connectionMode: L, translateExtent: Xe, connectOnClick: na, defaultEdgeOptions: ia, fitView: wo, fitViewOptions: xo, onNodesDelete: O, onEdgesDelete: P, onDelete: R, onNodeDragStart: C, onNodeDrag: I, onNodeDragStop: A, onSelectionDrag: S, onSelectionDragStart: y, onSelectionDragStop: E, onMove: u, onMoveStart: d, onMoveEnd: f, noPanClassName: yo, nodeOrigin: ke, rfId: bn, autoPanOnConnect: ca, autoPanOnNodeDrag: la, autoPanSpeed: da, onError: ga, connectionRadius: fa, isValidConnection: ha, selectNodesOnDrag: re, nodeDragThreshold: ma, connectionDragThreshold: ya, onBeforeDelete: V, debug: Sa, ariaLabelConfig: Ea, zIndexMode: So }), T(dg, { onInit: c, onNodeClick: a, onEdgeClick: l, onNodeMouseEnter: _, onNodeMouseMove: p, onNodeMouseLeave: x, onNodeContextMenu: N, onNodeDoubleClick: b, nodeTypes: i, edgeTypes: s, connectionLineType: H, connectionLineStyle: X, connectionLineComponent: F, connectionLineContainerStyle: W, selectionKeyCode: q, selectionOnDrag: z, selectionMode: B, deleteKeyCode: Q, multiSelectionKeyCode: U, panActivationKeyCode: K, zoomActivationKeyCode: Y, onlyRenderVisibleElements: te, defaultViewport: he, translateExtent: Xe, minZoom: $e, maxZoom: Pe, preventScrolling: xn, zoomOnScroll: Ms, zoomOnPinch: Is, zoomOnDoubleClick: Ps, panOnScroll: As, panOnScrollSpeed: ks, panOnScrollMode: $s, panOnDrag: Ds, autoPanOnSelection: ua, onPaneClick: zs, onPaneMouseEnter: Ts, onPaneMouseMove: Hs, onPaneMouseLeave: Rs, onPaneScroll: Ls, onPaneContextMenu: Vs, paneClickDistance: Os, nodeClickDistance: Bs, onSelectionContextMenu: M, onSelectionStart: $, onSelectionEnd: k, onReconnect: Xs, onReconnectStart: Ys, onReconnectEnd: Zs, onEdgeContextMenu: Ws, onEdgeDoubleClick: qs, onEdgeMouseEnter: Gs, onEdgeMouseMove: Us, onEdgeMouseLeave: Ks, reconnectRadius: Qs, defaultMarkerColor: Cs, noDragClassName: ea, noWheelClassName: ta, noPanClassName: yo, rfId: bn, disableKeyboardA11y: vo, nodeExtent: vn, viewport: wa, onViewportChange: xa, nodesDraggable: le }), T(Lf, { onSelectionChange: D }), Fs, T(Df, { proOptions: ra, position: oa }), T(Pf, { rfId: bn, disableKeyboardA11y: vo })] }) });
}
var ep = Qi(yg);
const wg = (e) => e.domNode?.querySelector(".react-flow__edgelabel-renderer");
function tp({ children: e }) {
  const t = j(wg);
  return t ? Ha(e, t) : null;
}
function xg({ dimensions: e, lineWidth: t, variant: n, className: o }) {
  return T("path", { strokeWidth: t, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: ae(["react-flow__background-pattern", n, o]) });
}
function vg({ radius: e, className: t }) {
  return T("circle", { cx: e, cy: e, r: e, className: ae(["react-flow__background-pattern", "dots", t]) });
}
var Oe;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(Oe || (Oe = {}));
const bg = {
  [Oe.Dots]: 1,
  [Oe.Lines]: 1,
  [Oe.Cross]: 6
}, _g = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function Ss({
  id: e,
  variant: t = Oe.Dots,
  // only used for dots and cross
  gap: n = 20,
  // only used for lines and cross
  size: o,
  lineWidth: r = 1,
  offset: i = 0,
  color: s,
  bgColor: a,
  style: l,
  className: c,
  patternClassName: u
}) {
  const d = ee(null), { transform: f, patternId: h } = j(_g, ie), g = o || bg[t], v = t === Oe.Dots, w = t === Oe.Cross, m = Array.isArray(n) ? n : [n, n], _ = [m[0] * f[2] || 1, m[1] * f[2] || 1], p = g * f[2], x = Array.isArray(i) ? i : [i, i], N = w ? [p, p] : _, b = [
    x[0] * f[2] || 1 + N[0] / 2,
    x[1] * f[2] || 1 + N[1] / 2
  ], C = `${h}${e || ""}`;
  return ce("svg", { className: ae(["react-flow__background", c]), style: {
    ...l,
    ...yn,
    "--xy-background-color-props": a,
    "--xy-background-pattern-color-props": s
  }, ref: d, "data-testid": "rf__background", children: [T("pattern", { id: C, x: f[0] % _[0], y: f[1] % _[1], width: _[0], height: _[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${b[0]},-${b[1]})`, children: v ? T(vg, { radius: p / 2, className: u }) : T(xg, { dimensions: N, lineWidth: r, variant: t, className: u }) }), T("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${C})` })] });
}
Ss.displayName = "Background";
se(Ss);
function Sg() {
  return T("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: T("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function Eg() {
  return T("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: T("path", { d: "M0 0h32v4.2H0z" }) });
}
function Ng() {
  return T("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: T("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function Cg() {
  return T("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: T("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function Mg() {
  return T("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: T("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function Bt({ children: e, className: t, ...n }) {
  return T("button", { type: "button", className: ae(["react-flow__controls-button", t]), ...n, children: e });
}
const Ig = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function Es({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: o = !0, fitViewOptions: r, onZoomIn: i, onZoomOut: s, onFitView: a, onInteractiveChange: l, className: c, children: u, position: d = "bottom-left", orientation: f = "vertical", "aria-label": h }) {
  const g = oe(), { isInteractive: v, minZoomReached: w, maxZoomReached: m, ariaLabelConfig: _ } = j(Ig, ie), { zoomIn: p, zoomOut: x, fitView: N } = go(), b = () => {
    p(), i?.();
  }, C = () => {
    x(), s?.();
  }, I = () => {
    N(r), a?.();
  }, A = () => {
    g.setState({
      nodesDraggable: !v,
      nodesConnectable: !v,
      elementsSelectable: !v
    }), l?.(!v);
  };
  return ce(mn, { className: ae(["react-flow__controls", f === "horizontal" ? "horizontal" : "vertical", c]), position: d, style: e, "data-testid": "rf__controls", "aria-label": h ?? _["controls.ariaLabel"], children: [t && ce(He, { children: [T(Bt, { onClick: b, className: "react-flow__controls-zoomin", title: _["controls.zoomIn.ariaLabel"], "aria-label": _["controls.zoomIn.ariaLabel"], disabled: m, children: T(Sg, {}) }), T(Bt, { onClick: C, className: "react-flow__controls-zoomout", title: _["controls.zoomOut.ariaLabel"], "aria-label": _["controls.zoomOut.ariaLabel"], disabled: w, children: T(Eg, {}) })] }), n && T(Bt, { className: "react-flow__controls-fitview", onClick: I, title: _["controls.fitView.ariaLabel"], "aria-label": _["controls.fitView.ariaLabel"], children: T(Ng, {}) }), o && T(Bt, { className: "react-flow__controls-interactive", onClick: A, title: _["controls.interactive.ariaLabel"], "aria-label": _["controls.interactive.ariaLabel"], children: v ? T(Mg, {}) : T(Cg, {}) }), u] });
}
Es.displayName = "Controls";
const np = se(Es);
function Ag({ id: e, x: t, y: n, width: o, height: r, style: i, color: s, strokeColor: a, strokeWidth: l, className: c, borderRadius: u, shapeRendering: d, selected: f, onClick: h }) {
  const { background: g, backgroundColor: v } = i || {}, w = s || g || v;
  return T("rect", { className: ae(["react-flow__minimap-node", { selected: f }, c]), x: t, y: n, rx: u, ry: u, width: o, height: r, style: {
    fill: w,
    stroke: a,
    strokeWidth: l
  }, shapeRendering: d, onClick: h ? (m) => h(m, e) : void 0 });
}
const kg = se(Ag), $g = (e) => e.nodes.map((t) => t.id), zn = (e) => e instanceof Function ? e : () => e;
function Pg({
  nodeStrokeColor: e,
  nodeColor: t,
  nodeClassName: n = "",
  nodeBorderRadius: o = 5,
  nodeStrokeWidth: r,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: i = kg,
  onClick: s
}) {
  const a = j($g, ie), l = zn(t), c = zn(e), u = zn(n), d = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return T(He, { children: a.map((f) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    T(zg, { id: f, nodeColorFunc: l, nodeStrokeColorFunc: c, nodeClassNameFunc: u, nodeBorderRadius: o, nodeStrokeWidth: r, NodeComponent: i, onClick: s, shapeRendering: d }, f)
  )) });
}
function Dg({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: o, nodeBorderRadius: r, nodeStrokeWidth: i, shapeRendering: s, NodeComponent: a, onClick: l }) {
  const { node: c, x: u, y: d, width: f, height: h } = j((g) => {
    const v = g.nodeLookup.get(e);
    if (!v)
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    const w = v.internals.userNode, { x: m, y: _ } = v.internals.positionAbsolute, { width: p, height: x } = Ie(w);
    return {
      node: w,
      x: m,
      y: _,
      width: p,
      height: x
    };
  }, ie);
  return !c || c.hidden || !Ei(c) ? null : T(a, { x: u, y: d, width: f, height: h, style: c.style, selected: !!c.selected, className: o(c), color: t(c), borderRadius: r, strokeColor: n(c), strokeWidth: i, shapeRendering: s, onClick: l, id: c.id });
}
const zg = se(Dg);
var Tg = se(Pg);
const Hg = 200, Rg = 150, Lg = (e) => !e.hidden, Vg = (e) => {
  const t = {
    x: -e.transform[0] / e.transform[2],
    y: -e.transform[1] / e.transform[2],
    width: e.width / e.transform[2],
    height: e.height / e.transform[2]
  };
  return {
    viewBB: t,
    boundingRect: e.nodeLookup.size > 0 ? bi(kt(e.nodeLookup, { filter: Lg }), t) : t,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, Pr = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, Og = (e, t) => Pr(e.viewBB, t.viewBB) && Pr(e.boundingRect, t.boundingRect) && e.rfId === t.rfId && e.panZoom === t.panZoom && e.translateExtent === t.translateExtent && e.flowWidth === t.flowWidth && e.flowHeight === t.flowHeight && e.ariaLabelConfig === t.ariaLabelConfig, Bg = "react-flow__minimap-desc";
function Ns({
  style: e,
  className: t,
  nodeStrokeColor: n,
  nodeColor: o,
  nodeClassName: r = "",
  nodeBorderRadius: i = 5,
  nodeStrokeWidth: s,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: a,
  bgColor: l,
  maskColor: c,
  maskStrokeColor: u,
  maskStrokeWidth: d,
  position: f = "bottom-right",
  onClick: h,
  onNodeClick: g,
  pannable: v = !1,
  zoomable: w = !1,
  ariaLabel: m,
  inversePan: _,
  zoomStep: p = 1,
  offsetScale: x = 5
}) {
  const N = oe(), b = ee(null), { boundingRect: C, viewBB: I, rfId: A, panZoom: O, translateExtent: P, flowWidth: R, flowHeight: D, ariaLabelConfig: y } = j(Vg, Og), S = e?.width ?? Hg, E = e?.height ?? Rg, M = C.width / S, $ = C.height / E, k = Math.max(M, $), V = k * S, L = k * E, H = x * k, X = C.x - (V - C.width) / 2 - H, F = C.y - (L - C.height) / 2 - H, W = V + H * 2, Q = L + H * 2, q = `${Bg}-${A}`, z = ee(0), B = ee();
  z.current = k, ne(() => {
    if (b.current && O)
      return B.current = tf({
        domNode: b.current,
        panZoom: O,
        getTransform: () => N.getState().transform,
        getViewScale: () => z.current
      }), () => {
        B.current?.destroy();
      };
  }, [O]), ne(() => {
    B.current?.update({
      translateExtent: P,
      width: R,
      height: D,
      inversePan: _,
      pannable: v,
      zoomStep: p,
      zoomable: w
    });
  }, [v, w, _, p, P, R, D]);
  const K = h ? (G) => {
    const [J, te] = B.current?.pointer(G) || [0, 0];
    h(G, { x: J, y: te });
  } : void 0, U = g ? Ce((G, J) => {
    const te = N.getState().nodeLookup.get(J).internals.userNode;
    g(G, te);
  }, []) : void 0, Y = m ?? y["minimap.ariaLabel"];
  return T(mn, { position: f, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof l == "string" ? l : void 0,
    "--xy-minimap-mask-background-color-props": typeof c == "string" ? c : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof u == "string" ? u : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof d == "number" ? d * k : void 0,
    "--xy-minimap-node-background-color-props": typeof o == "string" ? o : void 0,
    "--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
    "--xy-minimap-node-stroke-width-props": typeof s == "number" ? s : void 0
  }, className: ae(["react-flow__minimap", t]), "data-testid": "rf__minimap", children: ce("svg", { width: S, height: E, viewBox: `${X} ${F} ${W} ${Q}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": q, ref: b, onClick: K, children: [Y && T("title", { id: q, children: Y }), T(Tg, { onClick: U, nodeColor: o, nodeStrokeColor: n, nodeBorderRadius: i, nodeClassName: r, nodeStrokeWidth: s, nodeComponent: a }), T("path", { className: "react-flow__minimap-mask", d: `M${X - H},${F - H}h${W + H * 2}v${Q + H * 2}h${-W - H * 2}z
        M${I.x},${I.y}h${I.width}v${I.height}h${-I.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
Ns.displayName = "MiniMap";
const op = se(Ns), Fg = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, Xg = {
  [lt.Line]: "right",
  [lt.Handle]: "bottom-right"
};
function Yg({ nodeId: e, position: t, variant: n = lt.Handle, className: o, style: r = void 0, children: i, color: s, minWidth: a = 10, minHeight: l = 10, maxWidth: c = Number.MAX_VALUE, maxHeight: u = Number.MAX_VALUE, keepAspectRatio: d = !1, resizeDirection: f, autoScale: h = !0, shouldResize: g, onResizeStart: v, onResize: w, onResizeEnd: m }) {
  const _ = ns(), p = typeof e == "string" ? e : _, x = oe(), N = ee(null), b = n === lt.Handle, C = j(Ce(Fg(b && h), [b, h]), ie), I = ee(null), A = t ?? Xg[n];
  ne(() => {
    if (!(!N.current || !p))
      return I.current || (I.current = pf({
        domNode: N.current,
        nodeId: p,
        getStoreItems: () => {
          const { nodeLookup: P, transform: R, snapGrid: D, snapToGrid: y, nodeOrigin: S, domNode: E } = x.getState();
          return {
            nodeLookup: P,
            transform: R,
            snapGrid: D,
            snapToGrid: y,
            nodeOrigin: S,
            paneDomNode: E
          };
        },
        onChange: (P, R) => {
          const { triggerNodeChanges: D, nodeLookup: y, parentLookup: S, nodeOrigin: E } = x.getState(), M = [], $ = { x: P.x, y: P.y }, k = y.get(p);
          if (k && k.expandParent && k.parentId) {
            const V = k.origin ?? E, L = P.width ?? k.measured.width ?? 0, H = P.height ?? k.measured.height ?? 0, X = {
              id: k.id,
              parentId: k.parentId,
              rect: {
                width: L,
                height: H,
                ...Ni({
                  x: P.x ?? k.position.x,
                  y: P.y ?? k.position.y
                }, { width: L, height: H }, k.parentId, y, V)
              }
            }, F = ho([X], y, S, E);
            M.push(...F), $.x = P.x ? Math.max(V[0] * L, P.x) : void 0, $.y = P.y ? Math.max(V[1] * H, P.y) : void 0;
          }
          if ($.x !== void 0 && $.y !== void 0) {
            const V = {
              id: p,
              type: "position",
              position: { ...$ }
            };
            M.push(V);
          }
          if (P.width !== void 0 && P.height !== void 0) {
            const L = {
              id: p,
              type: "dimensions",
              resizing: !0,
              setAttributes: f ? f === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: P.width,
                height: P.height
              }
            };
            M.push(L);
          }
          for (const V of R) {
            const L = {
              ...V,
              type: "position"
            };
            M.push(L);
          }
          D(M);
        },
        onEnd: ({ width: P, height: R }) => {
          const D = {
            id: p,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: P,
              height: R
            }
          };
          x.getState().triggerNodeChanges([D]);
        }
      })), I.current.update({
        controlPosition: A,
        boundaries: {
          minWidth: a,
          minHeight: l,
          maxWidth: c,
          maxHeight: u
        },
        keepAspectRatio: d,
        resizeDirection: f,
        onResizeStart: v,
        onResize: w,
        onResizeEnd: m,
        shouldResize: g
      }), () => {
        I.current?.destroy();
      };
  }, [
    A,
    a,
    l,
    c,
    u,
    d,
    v,
    w,
    m,
    g
  ]);
  const O = A.split("-");
  return T("div", { className: ae(["react-flow__resize-control", "nodrag", ...O, n, o]), ref: N, style: {
    ...r,
    scale: C,
    ...s && { [b ? "backgroundColor" : "borderColor"]: s }
  }, children: i });
}
const rp = se(Yg), Zg = Ra.watchRuntimeStream;
async function ip(e) {
  let t = e.initialState;
  const n = await Zg({
    streamApi: e.streamApi,
    requestID: e.requestID,
    lastID: e.lastID || "0-0",
    blockMs: e.blockMs || 15e3,
    signal: e.signal,
    stopOnResult: !0,
    acceptErrorResult: e.acceptErrorResult,
    onFrame: (o) => {
      t = e.reduceFrame(t, o), e.onUpdate?.(t);
    }
  });
  if (!e.signal?.aborted && e.fetchSnapshot)
    try {
      const o = await e.fetchSnapshot();
      t = e.mergeSnapshot ? e.mergeSnapshot(t, o) : o, e.onUpdate?.(t);
    } catch (o) {
      if (!n.completed)
        throw o;
    }
  return {
    state: t,
    lastID: n.lastID,
    completed: n.completed
  };
}
function sp(e) {
  const t = e?.interaction && typeof e.interaction == "object" && !Array.isArray(e.interaction) ? e.interaction : {};
  return {
    runId: Number(e?.run_id || e?.runId || 0),
    nodeRunId: Number(e?.node_run_id || e?.nodeRunId || 0),
    nodeKey: String(e?.node_key || e?.nodeKey || ""),
    nodeName: String(e?.node_name || e?.nodeName || ""),
    interaction: t
  };
}
const Wg = {
  pending: "pending",
  queued: "pending",
  queue: "pending",
  running: "running",
  run: "running",
  started: "running",
  starting: "running",
  processing: "running",
  active: "running",
  executing: "running",
  execute: "running",
  in_progress: "running",
  "in-progress": "running",
  waiting: "waiting",
  wait: "waiting",
  success: "success",
  succeeded: "success",
  done: "success",
  completed: "success",
  complete: "success",
  fail: "fail",
  failed: "fail",
  failure: "fail",
  error: "fail",
  canceled: "canceled",
  cancelled: "canceled"
};
function mo(e) {
  const t = String(e || "").trim().toLowerCase();
  return Wg[t] || "pending";
}
function ap(e, t) {
  if (String(t || "").trim())
    return mo(t);
  const n = String(e.event || e.type || "").trim().toLowerCase();
  return n.includes("cancel") ? "canceled" : n.includes("fail") || n.includes("error") ? "fail" : n.includes("wait") ? "waiting" : n.includes("finish") || n.includes("success") || n.includes("complete") ? "success" : n.includes("start") || n.includes("progress") || n.includes("running") ? "running" : "pending";
}
function Dr(e) {
  const t = e && typeof e == "object" ? e : {}, n = t.run && typeof t.run == "object" ? t.run : t, o = {
    ...n,
    id: Number(n.id || t.run_id || 0),
    request_id: String(n.request_id || t.request_id || ""),
    status: mo(n.status || t.status),
    error: String(n.error || t.error || "")
  };
  return {
    ...t,
    view: String(t.view || ""),
    run: o,
    flow_runs: zr(t.flow_runs, "status"),
    node_runs: zr(t.node_runs, "status"),
    interactions: Un(t.interactions),
    approvals: Un(t.approvals),
    ...Array.isArray(t.agent_runs) ? { agent_runs: t.agent_runs } : {},
    ...Array.isArray(t.blackboard) ? { blackboard: t.blackboard } : {},
    ...Array.isArray(t.messages) ? { messages: t.messages } : {}
  };
}
function cp(e, t) {
  const n = Dr(e), o = Dr(t);
  return {
    ...n,
    ...o,
    run: {
      ...n.run,
      ...o.run
    },
    flow_runs: Tr(n.flow_runs, o.flow_runs),
    node_runs: Tr(n.node_runs, o.node_runs),
    interactions: o.interactions || n.interactions || [],
    approvals: o.approvals || n.approvals || [],
    agent_runs: o.agent_runs || n.agent_runs,
    blackboard: o.blackboard || n.blackboard,
    messages: o.messages || n.messages
  };
}
function zr(e, t) {
  return Un(e).map((n) => ({
    ...n,
    [t]: mo(n?.[t])
  }));
}
function Tr(e = [], t = []) {
  if (t.length === 0)
    return e;
  const n = new Map(
    e.map((o) => [Hr(o), o])
  );
  return t.map((o) => ({
    ...n.get(Hr(o)) || {},
    ...o
  }));
}
function Hr(e) {
  return String(
    e.id || e.node_run_id || e.flow_run_id || e.node_key || e.flow_id
  );
}
function Un(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
export {
  wn as B,
  np as C,
  tp as E,
  on as H,
  op as M,
  rp as N,
  Z as P,
  gg as R,
  mo as a,
  Wf as b,
  jg as c,
  qf as d,
  ki as g,
  ep as i,
  cp as m,
  sp as n,
  ap as r,
  go as u,
  ip as w
};
