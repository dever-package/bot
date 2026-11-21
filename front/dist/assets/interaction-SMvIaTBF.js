import { a as le, j as T, F as He } from "./preloadable-CnUP9jgB.js";
import { B as Ea, A as Na, w as Ca, R as Ma, D as Ia, r as se, f as Pr, b as te, d as oe, h as we, o as ut, u as xe, a as ve, p as sn, l as ka } from "./file-kind-Cq3pESGF.js";
import { c as Aa } from "./space-assistant-layout-B9KyeCM0.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./interaction-BnuhLJ6X.css", import.meta.url).href]);
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
var $a = { value: () => {
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
function Pa(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", r = n.indexOf(".");
    if (r >= 0 && (o = n.slice(r + 1), n = n.slice(0, r)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Ft.prototype = an.prototype = {
  constructor: Ft,
  on: function(e, t) {
    var n = this._, o = Pa(e + "", n), r, i = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++i < s; ) if ((r = (e = o[i]).type) && (r = Da(n[r], e.name))) return r;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++i < s; )
      if (r = (e = o[i]).type) n[r] = Eo(n[r], e.name, t);
      else if (t == null) for (r in n) n[r] = Eo(n[r], e.name, null);
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
function Da(e, t) {
  for (var n = 0, o = e.length, r; n < o; ++n)
    if ((r = e[n]).name === t)
      return r.value;
}
function Eo(e, t, n) {
  for (var o = 0, r = e.length; o < r; ++o)
    if (e[o].name === t) {
      e[o] = $a, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var zn = "http://www.w3.org/1999/xhtml";
const No = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: zn,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function cn(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), No.hasOwnProperty(t) ? { space: No[t], local: e } : e;
}
function Ta(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === zn && t.documentElement.namespaceURI === zn ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function za(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Dr(e) {
  var t = cn(e);
  return (t.local ? za : Ta)(t);
}
function Ha() {
}
function Kn(e) {
  return e == null ? Ha : function() {
    return this.querySelector(e);
  };
}
function Ra(e) {
  typeof e != "function" && (e = Kn(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var i = t[r], s = i.length, a = o[r] = new Array(s), c, l, u = 0; u < s; ++u)
      (c = i[u]) && (l = e.call(c, c.__data__, u, i)) && ("__data__" in c && (l.__data__ = c.__data__), a[u] = l);
  return new fe(o, this._parents);
}
function La(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function Va() {
  return [];
}
function Tr(e) {
  return e == null ? Va : function() {
    return this.querySelectorAll(e);
  };
}
function Oa(e) {
  return function() {
    return La(e.apply(this, arguments));
  };
}
function Ba(e) {
  typeof e == "function" ? e = Oa(e) : e = Tr(e);
  for (var t = this._groups, n = t.length, o = [], r = [], i = 0; i < n; ++i)
    for (var s = t[i], a = s.length, c, l = 0; l < a; ++l)
      (c = s[l]) && (o.push(e.call(c, c.__data__, l, s)), r.push(c));
  return new fe(o, r);
}
function zr(e) {
  return function() {
    return this.matches(e);
  };
}
function Hr(e) {
  return function(t) {
    return t.matches(e);
  };
}
var Fa = Array.prototype.find;
function Xa(e) {
  return function() {
    return Fa.call(this.children, e);
  };
}
function Ya() {
  return this.firstElementChild;
}
function Za(e) {
  return this.select(e == null ? Ya : Xa(typeof e == "function" ? e : Hr(e)));
}
var Wa = Array.prototype.filter;
function qa() {
  return Array.from(this.children);
}
function Ga(e) {
  return function() {
    return Wa.call(this.children, e);
  };
}
function Ua(e) {
  return this.selectAll(e == null ? qa : Ga(typeof e == "function" ? e : Hr(e)));
}
function Ka(e) {
  typeof e != "function" && (e = zr(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var i = t[r], s = i.length, a = o[r] = [], c, l = 0; l < s; ++l)
      (c = i[l]) && e.call(c, c.__data__, l, i) && a.push(c);
  return new fe(o, this._parents);
}
function Rr(e) {
  return new Array(e.length);
}
function Qa() {
  return new fe(this._enter || this._groups.map(Rr), this._parents);
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
function Ja(e) {
  return function() {
    return e;
  };
}
function ja(e, t, n, o, r, i) {
  for (var s = 0, a, c = t.length, l = i.length; s < l; ++s)
    (a = t[s]) ? (a.__data__ = i[s], o[s] = a) : n[s] = new qt(e, i[s]);
  for (; s < c; ++s)
    (a = t[s]) && (r[s] = a);
}
function ec(e, t, n, o, r, i, s) {
  var a, c, l = /* @__PURE__ */ new Map(), u = t.length, f = i.length, d = new Array(u), h;
  for (a = 0; a < u; ++a)
    (c = t[a]) && (d[a] = h = s.call(c, c.__data__, a, t) + "", l.has(h) ? r[a] = c : l.set(h, c));
  for (a = 0; a < f; ++a)
    h = s.call(e, i[a], a, i) + "", (c = l.get(h)) ? (o[a] = c, c.__data__ = i[a], l.delete(h)) : n[a] = new qt(e, i[a]);
  for (a = 0; a < u; ++a)
    (c = t[a]) && l.get(d[a]) === c && (r[a] = c);
}
function tc(e) {
  return e.__data__;
}
function nc(e, t) {
  if (!arguments.length) return Array.from(this, tc);
  var n = t ? ec : ja, o = this._parents, r = this._groups;
  typeof e != "function" && (e = Ja(e));
  for (var i = r.length, s = new Array(i), a = new Array(i), c = new Array(i), l = 0; l < i; ++l) {
    var u = o[l], f = r[l], d = f.length, h = oc(e.call(u, u && u.__data__, l, o)), g = h.length, v = a[l] = new Array(g), w = s[l] = new Array(g), m = c[l] = new Array(d);
    n(u, f, v, w, m, h, t);
    for (var b = 0, p = 0, x, N; b < g; ++b)
      if (x = v[b]) {
        for (b >= p && (p = b + 1); !(N = w[p]) && ++p < g; ) ;
        x._next = N || null;
      }
  }
  return s = new fe(s, o), s._enter = a, s._exit = c, s;
}
function oc(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function rc() {
  return new fe(this._exit || this._groups.map(Rr), this._parents);
}
function ic(e, t, n) {
  var o = this.enter(), r = this, i = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (r = t(r), r && (r = r.selection())), n == null ? i.remove() : n(i), o && r ? o.merge(r).order() : r;
}
function sc(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, r = n.length, i = o.length, s = Math.min(r, i), a = new Array(r), c = 0; c < s; ++c)
    for (var l = n[c], u = o[c], f = l.length, d = a[c] = new Array(f), h, g = 0; g < f; ++g)
      (h = l[g] || u[g]) && (d[g] = h);
  for (; c < r; ++c)
    a[c] = n[c];
  return new fe(a, this._parents);
}
function ac() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], r = o.length - 1, i = o[r], s; --r >= 0; )
      (s = o[r]) && (i && s.compareDocumentPosition(i) ^ 4 && i.parentNode.insertBefore(s, i), i = s);
  return this;
}
function cc(e) {
  e || (e = lc);
  function t(f, d) {
    return f && d ? e(f.__data__, d.__data__) : !f - !d;
  }
  for (var n = this._groups, o = n.length, r = new Array(o), i = 0; i < o; ++i) {
    for (var s = n[i], a = s.length, c = r[i] = new Array(a), l, u = 0; u < a; ++u)
      (l = s[u]) && (c[u] = l);
    c.sort(t);
  }
  return new fe(r, this._parents).order();
}
function lc(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function uc() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function dc() {
  return Array.from(this);
}
function fc() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], r = 0, i = o.length; r < i; ++r) {
      var s = o[r];
      if (s) return s;
    }
  return null;
}
function hc() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function gc() {
  return !this.node();
}
function pc(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var r = t[n], i = 0, s = r.length, a; i < s; ++i)
      (a = r[i]) && e.call(a, a.__data__, i, r);
  return this;
}
function mc(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function yc(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function wc(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function xc(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function vc(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function bc(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function _c(e, t) {
  var n = cn(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? yc : mc : typeof t == "function" ? n.local ? bc : vc : n.local ? xc : wc)(n, t));
}
function Lr(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function Sc(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Ec(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function Nc(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function Cc(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? Sc : typeof t == "function" ? Nc : Ec)(e, t, n ?? "")) : rt(this.node(), e);
}
function rt(e, t) {
  return e.style.getPropertyValue(t) || Lr(e).getComputedStyle(e, null).getPropertyValue(t);
}
function Mc(e) {
  return function() {
    delete this[e];
  };
}
function Ic(e, t) {
  return function() {
    this[e] = t;
  };
}
function kc(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function Ac(e, t) {
  return arguments.length > 1 ? this.each((t == null ? Mc : typeof t == "function" ? kc : Ic)(e, t)) : this.node()[e];
}
function Vr(e) {
  return e.trim().split(/^|\s+/);
}
function Qn(e) {
  return e.classList || new Or(e);
}
function Or(e) {
  this._node = e, this._names = Vr(e.getAttribute("class") || "");
}
Or.prototype = {
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
function Br(e, t) {
  for (var n = Qn(e), o = -1, r = t.length; ++o < r; ) n.add(t[o]);
}
function Fr(e, t) {
  for (var n = Qn(e), o = -1, r = t.length; ++o < r; ) n.remove(t[o]);
}
function $c(e) {
  return function() {
    Br(this, e);
  };
}
function Pc(e) {
  return function() {
    Fr(this, e);
  };
}
function Dc(e, t) {
  return function() {
    (t.apply(this, arguments) ? Br : Fr)(this, e);
  };
}
function Tc(e, t) {
  var n = Vr(e + "");
  if (arguments.length < 2) {
    for (var o = Qn(this.node()), r = -1, i = n.length; ++r < i; ) if (!o.contains(n[r])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? Dc : t ? $c : Pc)(n, t));
}
function zc() {
  this.textContent = "";
}
function Hc(e) {
  return function() {
    this.textContent = e;
  };
}
function Rc(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function Lc(e) {
  return arguments.length ? this.each(e == null ? zc : (typeof e == "function" ? Rc : Hc)(e)) : this.node().textContent;
}
function Vc() {
  this.innerHTML = "";
}
function Oc(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Bc(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Fc(e) {
  return arguments.length ? this.each(e == null ? Vc : (typeof e == "function" ? Bc : Oc)(e)) : this.node().innerHTML;
}
function Xc() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Yc() {
  return this.each(Xc);
}
function Zc() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Wc() {
  return this.each(Zc);
}
function qc(e) {
  var t = typeof e == "function" ? e : Dr(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function Gc() {
  return null;
}
function Uc(e, t) {
  var n = typeof e == "function" ? e : Dr(e), o = t == null ? Gc : typeof t == "function" ? t : Kn(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function Kc() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Qc() {
  return this.each(Kc);
}
function Jc() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function jc() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function el(e) {
  return this.select(e ? jc : Jc);
}
function tl(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function nl(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function ol(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function rl(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, r = t.length, i; n < r; ++n)
        i = t[n], (!e.type || i.type === e.type) && i.name === e.name ? this.removeEventListener(i.type, i.listener, i.options) : t[++o] = i;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function il(e, t, n) {
  return function() {
    var o = this.__on, r, i = nl(t);
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
function sl(e, t, n) {
  var o = ol(e + ""), r, i = o.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var c = 0, l = a.length, u; c < l; ++c)
        for (r = 0, u = a[c]; r < i; ++r)
          if ((s = o[r]).type === u.type && s.name === u.name)
            return u.value;
    }
    return;
  }
  for (a = t ? il : rl, r = 0; r < i; ++r) this.each(a(o[r], t, n));
  return this;
}
function Xr(e, t, n) {
  var o = Lr(e), r = o.CustomEvent;
  typeof r == "function" ? r = new r(t, n) : (r = o.document.createEvent("Event"), n ? (r.initEvent(t, n.bubbles, n.cancelable), r.detail = n.detail) : r.initEvent(t, !1, !1)), e.dispatchEvent(r);
}
function al(e, t) {
  return function() {
    return Xr(this, e, t);
  };
}
function cl(e, t) {
  return function() {
    return Xr(this, e, t.apply(this, arguments));
  };
}
function ll(e, t) {
  return this.each((typeof t == "function" ? cl : al)(e, t));
}
function* ul() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], r = 0, i = o.length, s; r < i; ++r)
      (s = o[r]) && (yield s);
}
var Yr = [null];
function fe(e, t) {
  this._groups = e, this._parents = t;
}
function Mt() {
  return new fe([[document.documentElement]], Yr);
}
function dl() {
  return this;
}
fe.prototype = Mt.prototype = {
  constructor: fe,
  select: Ra,
  selectAll: Ba,
  selectChild: Za,
  selectChildren: Ua,
  filter: Ka,
  data: nc,
  enter: Qa,
  exit: rc,
  join: ic,
  merge: sc,
  selection: dl,
  order: ac,
  sort: cc,
  call: uc,
  nodes: dc,
  node: fc,
  size: hc,
  empty: gc,
  each: pc,
  attr: _c,
  style: Cc,
  property: Ac,
  classed: Tc,
  text: Lc,
  html: Fc,
  raise: Yc,
  lower: Wc,
  append: qc,
  insert: Uc,
  remove: Qc,
  clone: el,
  datum: tl,
  on: sl,
  dispatch: ll,
  [Symbol.iterator]: ul
};
function de(e) {
  return typeof e == "string" ? new fe([[document.querySelector(e)]], [document.documentElement]) : new fe([[e]], Yr);
}
function fl(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function ge(e, t) {
  if (e = fl(e), t === void 0 && (t = e.currentTarget), t) {
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
const hl = { passive: !1 }, wt = { capture: !0, passive: !1 };
function _n(e) {
  e.stopImmediatePropagation();
}
function nt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Zr(e) {
  var t = e.document.documentElement, n = de(e).on("dragstart.drag", nt, wt);
  "onselectstart" in t ? n.on("selectstart.drag", nt, wt) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Wr(e, t) {
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
  dx: c,
  dy: l,
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
    dx: { value: c, enumerable: !0, configurable: !0 },
    dy: { value: l, enumerable: !0, configurable: !0 },
    _: { value: u }
  });
}
Hn.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function gl(e) {
  return !e.ctrlKey && !e.button;
}
function pl() {
  return this.parentNode;
}
function ml(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function yl() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function qr() {
  var e = gl, t = pl, n = ml, o = yl, r = {}, i = an("start", "drag", "end"), s = 0, a, c, l, u, f = 0;
  function d(x) {
    x.on("mousedown.drag", h).filter(o).on("touchstart.drag", w).on("touchmove.drag", m, hl).on("touchend.drag touchcancel.drag", b).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(x, N) {
    if (!(u || !e.call(this, x, N))) {
      var _ = p(this, t.call(this, x, N), x, N, "mouse");
      _ && (de(x.view).on("mousemove.drag", g, wt).on("mouseup.drag", v, wt), Zr(x.view), _n(x), l = !1, a = x.clientX, c = x.clientY, _("start", x));
    }
  }
  function g(x) {
    if (nt(x), !l) {
      var N = x.clientX - a, _ = x.clientY - c;
      l = N * N + _ * _ > f;
    }
    r.mouse("drag", x);
  }
  function v(x) {
    de(x.view).on("mousemove.drag mouseup.drag", null), Wr(x.view, l), nt(x), r.mouse("end", x);
  }
  function w(x, N) {
    if (e.call(this, x, N)) {
      var _ = x.changedTouches, C = t.call(this, x, N), k = _.length, I, V;
      for (I = 0; I < k; ++I)
        (V = p(this, C, x, N, _[I].identifier, _[I])) && (_n(x), V("start", x, _[I]));
    }
  }
  function m(x) {
    var N = x.changedTouches, _ = N.length, C, k;
    for (C = 0; C < _; ++C)
      (k = r[N[C].identifier]) && (nt(x), k("drag", x, N[C]));
  }
  function b(x) {
    var N = x.changedTouches, _ = N.length, C, k;
    for (u && clearTimeout(u), u = setTimeout(function() {
      u = null;
    }, 500), C = 0; C < _; ++C)
      (k = r[N[C].identifier]) && (_n(x), k("end", x, N[C]));
  }
  function p(x, N, _, C, k, I) {
    var V = i.copy(), P = ge(I || _, N), L, z, y;
    if ((y = n.call(x, new Hn("beforestart", {
      sourceEvent: _,
      target: d,
      identifier: k,
      active: s,
      x: P[0],
      y: P[1],
      dx: 0,
      dy: 0,
      dispatch: V
    }), C)) != null)
      return L = y.x - P[0] || 0, z = y.y - P[1] || 0, function S(E, M, A) {
        var $ = P, R;
        switch (E) {
          case "start":
            r[k] = S, R = s++;
            break;
          case "end":
            delete r[k], --s;
          // falls through
          case "drag":
            P = ge(A || M, N), R = s;
            break;
        }
        V.call(
          E,
          x,
          new Hn(E, {
            sourceEvent: M,
            subject: y,
            target: d,
            identifier: k,
            active: R,
            x: P[0] + L,
            y: P[1] + z,
            dx: P[0] - $[0],
            dy: P[1] - $[1],
            dispatch: V
          }),
          C
        );
      };
  }
  return d.filter = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : Dt(!!x), d) : e;
  }, d.container = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : Dt(x), d) : t;
  }, d.subject = function(x) {
    return arguments.length ? (n = typeof x == "function" ? x : Dt(x), d) : n;
  }, d.touchable = function(x) {
    return arguments.length ? (o = typeof x == "function" ? x : Dt(!!x), d) : o;
  }, d.on = function() {
    var x = i.on.apply(i, arguments);
    return x === i ? d : x;
  }, d.clickDistance = function(x) {
    return arguments.length ? (f = (x = +x) * x, d) : Math.sqrt(f);
  }, d;
}
function Jn(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Gr(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t) n[o] = t[o];
  return n;
}
function It() {
}
var xt = 0.7, Gt = 1 / xt, ot = "\\s*([+-]?\\d+)\\s*", vt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Me = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", wl = /^#([0-9a-f]{3,8})$/, xl = new RegExp(`^rgb\\(${ot},${ot},${ot}\\)$`), vl = new RegExp(`^rgb\\(${Me},${Me},${Me}\\)$`), bl = new RegExp(`^rgba\\(${ot},${ot},${ot},${vt}\\)$`), _l = new RegExp(`^rgba\\(${Me},${Me},${Me},${vt}\\)$`), Sl = new RegExp(`^hsl\\(${vt},${Me},${Me}\\)$`), El = new RegExp(`^hsla\\(${vt},${Me},${Me},${vt}\\)$`), Co = {
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
Jn(It, Ue, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Mo,
  // Deprecated! Use color.formatHex.
  formatHex: Mo,
  formatHex8: Nl,
  formatHsl: Cl,
  formatRgb: Io,
  toString: Io
});
function Mo() {
  return this.rgb().formatHex();
}
function Nl() {
  return this.rgb().formatHex8();
}
function Cl() {
  return Ur(this).formatHsl();
}
function Io() {
  return this.rgb().formatRgb();
}
function Ue(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = wl.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? ko(t) : n === 3 ? new ue(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Tt(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Tt(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = xl.exec(e)) ? new ue(t[1], t[2], t[3], 1) : (t = vl.exec(e)) ? new ue(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = bl.exec(e)) ? Tt(t[1], t[2], t[3], t[4]) : (t = _l.exec(e)) ? Tt(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Sl.exec(e)) ? Po(t[1], t[2] / 100, t[3] / 100, 1) : (t = El.exec(e)) ? Po(t[1], t[2] / 100, t[3] / 100, t[4]) : Co.hasOwnProperty(e) ? ko(Co[e]) : e === "transparent" ? new ue(NaN, NaN, NaN, 0) : null;
}
function ko(e) {
  return new ue(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Tt(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new ue(e, t, n, o);
}
function Ml(e) {
  return e instanceof It || (e = Ue(e)), e ? (e = e.rgb(), new ue(e.r, e.g, e.b, e.opacity)) : new ue();
}
function Rn(e, t, n, o) {
  return arguments.length === 1 ? Ml(e) : new ue(e, t, n, o ?? 1);
}
function ue(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
Jn(ue, Rn, Gr(It, {
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
    return new ue(qe(this.r), qe(this.g), qe(this.b), Ut(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Ao,
  // Deprecated! Use color.formatHex.
  formatHex: Ao,
  formatHex8: Il,
  formatRgb: $o,
  toString: $o
}));
function Ao() {
  return `#${We(this.r)}${We(this.g)}${We(this.b)}`;
}
function Il() {
  return `#${We(this.r)}${We(this.g)}${We(this.b)}${We((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function $o() {
  const e = Ut(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${qe(this.r)}, ${qe(this.g)}, ${qe(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Ut(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function qe(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function We(e) {
  return e = qe(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Po(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new pe(e, t, n, o);
}
function Ur(e) {
  if (e instanceof pe) return new pe(e.h, e.s, e.l, e.opacity);
  if (e instanceof It || (e = Ue(e)), !e) return new pe();
  if (e instanceof pe) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, r = Math.min(t, n, o), i = Math.max(t, n, o), s = NaN, a = i - r, c = (i + r) / 2;
  return a ? (t === i ? s = (n - o) / a + (n < o) * 6 : n === i ? s = (o - t) / a + 2 : s = (t - n) / a + 4, a /= c < 0.5 ? i + r : 2 - i - r, s *= 60) : a = c > 0 && c < 1 ? 0 : s, new pe(s, a, c, e.opacity);
}
function kl(e, t, n, o) {
  return arguments.length === 1 ? Ur(e) : new pe(e, t, n, o ?? 1);
}
function pe(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
Jn(pe, kl, Gr(It, {
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
    return new pe(Do(this.h), zt(this.s), zt(this.l), Ut(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Ut(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Do(this.h)}, ${zt(this.s) * 100}%, ${zt(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Do(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function zt(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Sn(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const jn = (e) => () => e;
function Al(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function $l(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function Pl(e) {
  return (e = +e) == 1 ? Kr : function(t, n) {
    return n - t ? $l(t, n, e) : jn(isNaN(t) ? n : t);
  };
}
function Kr(e, t) {
  var n = t - e;
  return n ? Al(e, n) : jn(isNaN(e) ? t : e);
}
const Kt = (function e(t) {
  var n = Pl(t);
  function o(r, i) {
    var s = n((r = Rn(r)).r, (i = Rn(i)).r), a = n(r.g, i.g), c = n(r.b, i.b), l = Kr(r.opacity, i.opacity);
    return function(u) {
      return r.r = s(u), r.g = a(u), r.b = c(u), r.opacity = l(u), r + "";
    };
  }
  return o.gamma = e, o;
})(1);
function Dl(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, o = t.slice(), r;
  return function(i) {
    for (r = 0; r < n; ++r) o[r] = e[r] * (1 - i) + t[r] * i;
    return o;
  };
}
function Tl(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function zl(e, t) {
  var n = t ? t.length : 0, o = e ? Math.min(n, e.length) : 0, r = new Array(o), i = new Array(n), s;
  for (s = 0; s < o; ++s) r[s] = mt(e[s], t[s]);
  for (; s < n; ++s) i[s] = t[s];
  return function(a) {
    for (s = 0; s < o; ++s) i[s] = r[s](a);
    return i;
  };
}
function Hl(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(o) {
    return n.setTime(e * (1 - o) + t * o), n;
  };
}
function Ce(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function Rl(e, t) {
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
function Ll(e) {
  return function() {
    return e;
  };
}
function Vl(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Qr(e, t) {
  var n = Ln.lastIndex = En.lastIndex = 0, o, r, i, s = -1, a = [], c = [];
  for (e = e + "", t = t + ""; (o = Ln.exec(e)) && (r = En.exec(t)); )
    (i = r.index) > n && (i = t.slice(n, i), a[s] ? a[s] += i : a[++s] = i), (o = o[0]) === (r = r[0]) ? a[s] ? a[s] += r : a[++s] = r : (a[++s] = null, c.push({ i: s, x: Ce(o, r) })), n = En.lastIndex;
  return n < t.length && (i = t.slice(n), a[s] ? a[s] += i : a[++s] = i), a.length < 2 ? c[0] ? Vl(c[0].x) : Ll(t) : (t = c.length, function(l) {
    for (var u = 0, f; u < t; ++u) a[(f = c[u]).i] = f.x(l);
    return a.join("");
  });
}
function mt(e, t) {
  var n = typeof t, o;
  return t == null || n === "boolean" ? jn(t) : (n === "number" ? Ce : n === "string" ? (o = Ue(t)) ? (t = o, Kt) : Qr : t instanceof Ue ? Kt : t instanceof Date ? Hl : Tl(t) ? Dl : Array.isArray(t) ? zl : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Rl : Ce)(e, t);
}
var To = 180 / Math.PI, Vn = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Jr(e, t, n, o, r, i) {
  var s, a, c;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (c = e * n + t * o) && (n -= e * c, o -= t * c), (a = Math.sqrt(n * n + o * o)) && (n /= a, o /= a, c /= a), e * o < t * n && (e = -e, t = -t, c = -c, s = -s), {
    translateX: r,
    translateY: i,
    rotate: Math.atan2(t, e) * To,
    skewX: Math.atan(c) * To,
    scaleX: s,
    scaleY: a
  };
}
var Ht;
function Ol(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? Vn : Jr(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Bl(e) {
  return e == null || (Ht || (Ht = document.createElementNS("http://www.w3.org/2000/svg", "g")), Ht.setAttribute("transform", e), !(e = Ht.transform.baseVal.consolidate())) ? Vn : (e = e.matrix, Jr(e.a, e.b, e.c, e.d, e.e, e.f));
}
function jr(e, t, n, o) {
  function r(l) {
    return l.length ? l.pop() + " " : "";
  }
  function i(l, u, f, d, h, g) {
    if (l !== f || u !== d) {
      var v = h.push("translate(", null, t, null, n);
      g.push({ i: v - 4, x: Ce(l, f) }, { i: v - 2, x: Ce(u, d) });
    } else (f || d) && h.push("translate(" + f + t + d + n);
  }
  function s(l, u, f, d) {
    l !== u ? (l - u > 180 ? u += 360 : u - l > 180 && (l += 360), d.push({ i: f.push(r(f) + "rotate(", null, o) - 2, x: Ce(l, u) })) : u && f.push(r(f) + "rotate(" + u + o);
  }
  function a(l, u, f, d) {
    l !== u ? d.push({ i: f.push(r(f) + "skewX(", null, o) - 2, x: Ce(l, u) }) : u && f.push(r(f) + "skewX(" + u + o);
  }
  function c(l, u, f, d, h, g) {
    if (l !== f || u !== d) {
      var v = h.push(r(h) + "scale(", null, ",", null, ")");
      g.push({ i: v - 4, x: Ce(l, f) }, { i: v - 2, x: Ce(u, d) });
    } else (f !== 1 || d !== 1) && h.push(r(h) + "scale(" + f + "," + d + ")");
  }
  return function(l, u) {
    var f = [], d = [];
    return l = e(l), u = e(u), i(l.translateX, l.translateY, u.translateX, u.translateY, f, d), s(l.rotate, u.rotate, f, d), a(l.skewX, u.skewX, f, d), c(l.scaleX, l.scaleY, u.scaleX, u.scaleY, f, d), l = u = null, function(h) {
      for (var g = -1, v = d.length, w; ++g < v; ) f[(w = d[g]).i] = w.x(h);
      return f.join("");
    };
  };
}
var Fl = jr(Ol, "px, ", "px)", "deg)"), Xl = jr(Bl, ", ", ")", ")"), Yl = 1e-12;
function zo(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function Zl(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function Wl(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const Xt = (function e(t, n, o) {
  function r(i, s) {
    var a = i[0], c = i[1], l = i[2], u = s[0], f = s[1], d = s[2], h = u - a, g = f - c, v = h * h + g * g, w, m;
    if (v < Yl)
      m = Math.log(d / l) / t, w = function(C) {
        return [
          a + C * h,
          c + C * g,
          l * Math.exp(t * C * m)
        ];
      };
    else {
      var b = Math.sqrt(v), p = (d * d - l * l + o * v) / (2 * l * n * b), x = (d * d - l * l - o * v) / (2 * d * n * b), N = Math.log(Math.sqrt(p * p + 1) - p), _ = Math.log(Math.sqrt(x * x + 1) - x);
      m = (_ - N) / t, w = function(C) {
        var k = C * m, I = zo(N), V = l / (n * b) * (I * Wl(t * k + N) - Zl(N));
        return [
          a + V * h,
          c + V * g,
          l * I / zo(t * k + N)
        ];
      };
    }
    return w.duration = m * 1e3 * t / Math.SQRT2, w;
  }
  return r.rho = function(i) {
    var s = Math.max(1e-3, +i), a = s * s, c = a * a;
    return e(s, a, c);
  }, r;
})(Math.SQRT2, 2, 4);
var it = 0, gt = 0, ft = 0, ei = 1e3, Qt, pt, Jt = 0, Ke = 0, ln = 0, bt = typeof performance == "object" && performance.now ? performance : Date, ti = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function eo() {
  return Ke || (ti(ql), Ke = bt.now() + ln);
}
function ql() {
  Ke = 0;
}
function jt() {
  this._call = this._time = this._next = null;
}
jt.prototype = ni.prototype = {
  constructor: jt,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? eo() : +n) + (t == null ? 0 : +t), !this._next && pt !== this && (pt ? pt._next = this : Qt = this, pt = this), this._call = e, this._time = n, On();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, On());
  }
};
function ni(e, t, n) {
  var o = new jt();
  return o.restart(e, t, n), o;
}
function Gl() {
  eo(), ++it;
  for (var e = Qt, t; e; )
    (t = Ke - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --it;
}
function Ho() {
  Ke = (Jt = bt.now()) + ln, it = gt = 0;
  try {
    Gl();
  } finally {
    it = 0, Kl(), Ke = 0;
  }
}
function Ul() {
  var e = bt.now(), t = e - Jt;
  t > ei && (ln -= t, Jt = e);
}
function Kl() {
  for (var e, t = Qt, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Qt = n);
  pt = e, On(o);
}
function On(e) {
  if (!it) {
    gt && (gt = clearTimeout(gt));
    var t = e - Ke;
    t > 24 ? (e < 1 / 0 && (gt = setTimeout(Ho, e - bt.now() - ln)), ft && (ft = clearInterval(ft))) : (ft || (Jt = bt.now(), ft = setInterval(Ul, ei)), it = 1, ti(Ho));
  }
}
function Ro(e, t, n) {
  var o = new jt();
  return t = t == null ? 0 : +t, o.restart((r) => {
    o.stop(), e(r + t);
  }, t, n), o;
}
var Ql = an("start", "end", "cancel", "interrupt"), Jl = [], oi = 0, Lo = 1, Bn = 2, Yt = 3, Vo = 4, Fn = 5, Zt = 6;
function un(e, t, n, o, r, i) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  jl(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: r,
    // For context during callback.
    on: Ql,
    tween: Jl,
    time: i.time,
    delay: i.delay,
    duration: i.duration,
    ease: i.ease,
    timer: null,
    state: oi
  });
}
function to(e, t) {
  var n = _e(e, t);
  if (n.state > oi) throw new Error("too late; already scheduled");
  return n;
}
function Ie(e, t) {
  var n = _e(e, t);
  if (n.state > Yt) throw new Error("too late; already running");
  return n;
}
function _e(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function jl(e, t, n) {
  var o = e.__transition, r;
  o[t] = n, n.timer = ni(i, 0, n.time);
  function i(l) {
    n.state = Lo, n.timer.restart(s, n.delay, n.time), n.delay <= l && s(l - n.delay);
  }
  function s(l) {
    var u, f, d, h;
    if (n.state !== Lo) return c();
    for (u in o)
      if (h = o[u], h.name === n.name) {
        if (h.state === Yt) return Ro(s);
        h.state === Vo ? (h.state = Zt, h.timer.stop(), h.on.call("interrupt", e, e.__data__, h.index, h.group), delete o[u]) : +u < t && (h.state = Zt, h.timer.stop(), h.on.call("cancel", e, e.__data__, h.index, h.group), delete o[u]);
      }
    if (Ro(function() {
      n.state === Yt && (n.state = Vo, n.timer.restart(a, n.delay, n.time), a(l));
    }), n.state = Bn, n.on.call("start", e, e.__data__, n.index, n.group), n.state === Bn) {
      for (n.state = Yt, r = new Array(d = n.tween.length), u = 0, f = -1; u < d; ++u)
        (h = n.tween[u].value.call(e, e.__data__, n.index, n.group)) && (r[++f] = h);
      r.length = f + 1;
    }
  }
  function a(l) {
    for (var u = l < n.duration ? n.ease.call(null, l / n.duration) : (n.timer.restart(c), n.state = Fn, 1), f = -1, d = r.length; ++f < d; )
      r[f].call(e, u);
    n.state === Fn && (n.on.call("end", e, e.__data__, n.index, n.group), c());
  }
  function c() {
    n.state = Zt, n.timer.stop(), delete o[t];
    for (var l in o) return;
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
function eu(e) {
  return this.each(function() {
    Wt(this, e);
  });
}
function tu(e, t) {
  var n, o;
  return function() {
    var r = Ie(this, e), i = r.tween;
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
function nu(e, t, n) {
  var o, r;
  if (typeof n != "function") throw new Error();
  return function() {
    var i = Ie(this, e), s = i.tween;
    if (s !== o) {
      r = (o = s).slice();
      for (var a = { name: t, value: n }, c = 0, l = r.length; c < l; ++c)
        if (r[c].name === t) {
          r[c] = a;
          break;
        }
      c === l && r.push(a);
    }
    i.tween = r;
  };
}
function ou(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = _e(this.node(), n).tween, r = 0, i = o.length, s; r < i; ++r)
      if ((s = o[r]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? tu : nu)(n, e, t));
}
function no(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var r = Ie(this, o);
    (r.value || (r.value = {}))[t] = n.apply(this, arguments);
  }), function(r) {
    return _e(r, o).value[t];
  };
}
function ri(e, t) {
  var n;
  return (typeof t == "number" ? Ce : t instanceof Ue ? Kt : (n = Ue(t)) ? (t = n, Kt) : Qr)(e, t);
}
function ru(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function iu(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function su(e, t, n) {
  var o, r = n + "", i;
  return function() {
    var s = this.getAttribute(e);
    return s === r ? null : s === o ? i : i = t(o = s, n);
  };
}
function au(e, t, n) {
  var o, r = n + "", i;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === r ? null : s === o ? i : i = t(o = s, n);
  };
}
function cu(e, t, n) {
  var o, r, i;
  return function() {
    var s, a = n(this), c;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), c = a + "", s === c ? null : s === o && c === r ? i : (r = c, i = t(o = s, a)));
  };
}
function lu(e, t, n) {
  var o, r, i;
  return function() {
    var s, a = n(this), c;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), c = a + "", s === c ? null : s === o && c === r ? i : (r = c, i = t(o = s, a)));
  };
}
function uu(e, t) {
  var n = cn(e), o = n === "transform" ? Xl : ri;
  return this.attrTween(e, typeof t == "function" ? (n.local ? lu : cu)(n, o, no(this, "attr." + e, t)) : t == null ? (n.local ? iu : ru)(n) : (n.local ? au : su)(n, o, t));
}
function du(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function fu(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function hu(e, t) {
  var n, o;
  function r() {
    var i = t.apply(this, arguments);
    return i !== o && (n = (o = i) && fu(e, i)), n;
  }
  return r._value = t, r;
}
function gu(e, t) {
  var n, o;
  function r() {
    var i = t.apply(this, arguments);
    return i !== o && (n = (o = i) && du(e, i)), n;
  }
  return r._value = t, r;
}
function pu(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var o = cn(e);
  return this.tween(n, (o.local ? hu : gu)(o, t));
}
function mu(e, t) {
  return function() {
    to(this, e).delay = +t.apply(this, arguments);
  };
}
function yu(e, t) {
  return t = +t, function() {
    to(this, e).delay = t;
  };
}
function wu(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? mu : yu)(t, e)) : _e(this.node(), t).delay;
}
function xu(e, t) {
  return function() {
    Ie(this, e).duration = +t.apply(this, arguments);
  };
}
function vu(e, t) {
  return t = +t, function() {
    Ie(this, e).duration = t;
  };
}
function bu(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? xu : vu)(t, e)) : _e(this.node(), t).duration;
}
function _u(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    Ie(this, e).ease = t;
  };
}
function Su(e) {
  var t = this._id;
  return arguments.length ? this.each(_u(t, e)) : _e(this.node(), t).ease;
}
function Eu(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Ie(this, e).ease = n;
  };
}
function Nu(e) {
  if (typeof e != "function") throw new Error();
  return this.each(Eu(this._id, e));
}
function Cu(e) {
  typeof e != "function" && (e = zr(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var i = t[r], s = i.length, a = o[r] = [], c, l = 0; l < s; ++l)
      (c = i[l]) && e.call(c, c.__data__, l, i) && a.push(c);
  return new ze(o, this._parents, this._name, this._id);
}
function Mu(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, r = n.length, i = Math.min(o, r), s = new Array(o), a = 0; a < i; ++a)
    for (var c = t[a], l = n[a], u = c.length, f = s[a] = new Array(u), d, h = 0; h < u; ++h)
      (d = c[h] || l[h]) && (f[h] = d);
  for (; a < o; ++a)
    s[a] = t[a];
  return new ze(s, this._parents, this._name, this._id);
}
function Iu(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function ku(e, t, n) {
  var o, r, i = Iu(t) ? to : Ie;
  return function() {
    var s = i(this, e), a = s.on;
    a !== o && (r = (o = a).copy()).on(t, n), s.on = r;
  };
}
function Au(e, t) {
  var n = this._id;
  return arguments.length < 2 ? _e(this.node(), n).on.on(e) : this.each(ku(n, e, t));
}
function $u(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function Pu() {
  return this.on("end.remove", $u(this._id));
}
function Du(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Kn(e));
  for (var o = this._groups, r = o.length, i = new Array(r), s = 0; s < r; ++s)
    for (var a = o[s], c = a.length, l = i[s] = new Array(c), u, f, d = 0; d < c; ++d)
      (u = a[d]) && (f = e.call(u, u.__data__, d, a)) && ("__data__" in u && (f.__data__ = u.__data__), l[d] = f, un(l[d], t, n, d, l, _e(u, n)));
  return new ze(i, this._parents, t, n);
}
function Tu(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Tr(e));
  for (var o = this._groups, r = o.length, i = [], s = [], a = 0; a < r; ++a)
    for (var c = o[a], l = c.length, u, f = 0; f < l; ++f)
      if (u = c[f]) {
        for (var d = e.call(u, u.__data__, f, c), h, g = _e(u, n), v = 0, w = d.length; v < w; ++v)
          (h = d[v]) && un(h, t, n, v, d, g);
        i.push(d), s.push(u);
      }
  return new ze(i, s, t, n);
}
var zu = Mt.prototype.constructor;
function Hu() {
  return new zu(this._groups, this._parents);
}
function Ru(e, t) {
  var n, o, r;
  return function() {
    var i = rt(this, e), s = (this.style.removeProperty(e), rt(this, e));
    return i === s ? null : i === n && s === o ? r : r = t(n = i, o = s);
  };
}
function ii(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Lu(e, t, n) {
  var o, r = n + "", i;
  return function() {
    var s = rt(this, e);
    return s === r ? null : s === o ? i : i = t(o = s, n);
  };
}
function Vu(e, t, n) {
  var o, r, i;
  return function() {
    var s = rt(this, e), a = n(this), c = a + "";
    return a == null && (c = a = (this.style.removeProperty(e), rt(this, e))), s === c ? null : s === o && c === r ? i : (r = c, i = t(o = s, a));
  };
}
function Ou(e, t) {
  var n, o, r, i = "style." + t, s = "end." + i, a;
  return function() {
    var c = Ie(this, e), l = c.on, u = c.value[i] == null ? a || (a = ii(t)) : void 0;
    (l !== n || r !== u) && (o = (n = l).copy()).on(s, r = u), c.on = o;
  };
}
function Bu(e, t, n) {
  var o = (e += "") == "transform" ? Fl : ri;
  return t == null ? this.styleTween(e, Ru(e, o)).on("end.style." + e, ii(e)) : typeof t == "function" ? this.styleTween(e, Vu(e, o, no(this, "style." + e, t))).each(Ou(this._id, e)) : this.styleTween(e, Lu(e, o, t), n).on("end.style." + e, null);
}
function Fu(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function Xu(e, t, n) {
  var o, r;
  function i() {
    var s = t.apply(this, arguments);
    return s !== r && (o = (r = s) && Fu(e, s, n)), o;
  }
  return i._value = t, i;
}
function Yu(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (t == null) return this.tween(o, null);
  if (typeof t != "function") throw new Error();
  return this.tween(o, Xu(e, t, n ?? ""));
}
function Zu(e) {
  return function() {
    this.textContent = e;
  };
}
function Wu(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function qu(e) {
  return this.tween("text", typeof e == "function" ? Wu(no(this, "text", e)) : Zu(e == null ? "" : e + ""));
}
function Gu(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function Uu(e) {
  var t, n;
  function o() {
    var r = e.apply(this, arguments);
    return r !== n && (t = (n = r) && Gu(r)), t;
  }
  return o._value = e, o;
}
function Ku(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, Uu(e));
}
function Qu() {
  for (var e = this._name, t = this._id, n = si(), o = this._groups, r = o.length, i = 0; i < r; ++i)
    for (var s = o[i], a = s.length, c, l = 0; l < a; ++l)
      if (c = s[l]) {
        var u = _e(c, t);
        un(c, e, n, l, s, {
          time: u.time + u.delay + u.duration,
          delay: 0,
          duration: u.duration,
          ease: u.ease
        });
      }
  return new ze(o, this._parents, e, n);
}
function Ju() {
  var e, t, n = this, o = n._id, r = n.size();
  return new Promise(function(i, s) {
    var a = { value: s }, c = { value: function() {
      --r === 0 && i();
    } };
    n.each(function() {
      var l = Ie(this, o), u = l.on;
      u !== e && (t = (e = u).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(c)), l.on = t;
    }), r === 0 && i();
  });
}
var ju = 0;
function ze(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function si() {
  return ++ju;
}
var De = Mt.prototype;
ze.prototype = {
  constructor: ze,
  select: Du,
  selectAll: Tu,
  selectChild: De.selectChild,
  selectChildren: De.selectChildren,
  filter: Cu,
  merge: Mu,
  selection: Hu,
  transition: Qu,
  call: De.call,
  nodes: De.nodes,
  node: De.node,
  size: De.size,
  empty: De.empty,
  each: De.each,
  on: Au,
  attr: uu,
  attrTween: pu,
  style: Bu,
  styleTween: Yu,
  text: qu,
  textTween: Ku,
  remove: Pu,
  tween: ou,
  delay: wu,
  duration: bu,
  ease: Su,
  easeVarying: Nu,
  end: Ju,
  [Symbol.iterator]: De[Symbol.iterator]
};
function ed(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var td = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: ed
};
function nd(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function od(e) {
  var t, n;
  e instanceof ze ? (t = e._id, e = e._name) : (t = si(), (n = td).time = eo(), e = e == null ? null : e + "");
  for (var o = this._groups, r = o.length, i = 0; i < r; ++i)
    for (var s = o[i], a = s.length, c, l = 0; l < a; ++l)
      (c = s[l]) && un(c, e, t, l, s, n || nd(c, t));
  return new ze(o, this._parents, e, t);
}
Mt.prototype.interrupt = eu;
Mt.prototype.transition = od;
const Rt = (e) => () => e;
function rd(e, {
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
function Te(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
Te.prototype = {
  constructor: Te,
  scale: function(e) {
    return e === 1 ? this : new Te(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new Te(this.k, this.x + this.k * e, this.y + this.k * t);
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
var dn = new Te(1, 0, 0);
ai.prototype = Te.prototype;
function ai(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return dn;
  return e.__zoom;
}
function Nn(e) {
  e.stopImmediatePropagation();
}
function ht(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function id(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function sd() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Oo() {
  return this.__zoom || dn;
}
function ad(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function cd() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function ld(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], r = e.invertX(t[1][0]) - n[1][0], i = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    r > o ? (o + r) / 2 : Math.min(0, o) || Math.max(0, r),
    s > i ? (i + s) / 2 : Math.min(0, i) || Math.max(0, s)
  );
}
function ci() {
  var e = id, t = sd, n = ld, o = ad, r = cd, i = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, c = Xt, l = an("start", "zoom", "end"), u, f, d, h = 500, g = 150, v = 0, w = 10;
  function m(y) {
    y.property("__zoom", Oo).on("wheel.zoom", k, { passive: !1 }).on("mousedown.zoom", I).on("dblclick.zoom", V).filter(r).on("touchstart.zoom", P).on("touchmove.zoom", L).on("touchend.zoom touchcancel.zoom", z).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(y, S, E, M) {
    var A = y.selection ? y.selection() : y;
    A.property("__zoom", Oo), y !== A ? N(y, S, E, M) : A.interrupt().each(function() {
      _(this, arguments).event(M).start().zoom(null, typeof S == "function" ? S.apply(this, arguments) : S).end();
    });
  }, m.scaleBy = function(y, S, E, M) {
    m.scaleTo(y, function() {
      var A = this.__zoom.k, $ = typeof S == "function" ? S.apply(this, arguments) : S;
      return A * $;
    }, E, M);
  }, m.scaleTo = function(y, S, E, M) {
    m.transform(y, function() {
      var A = t.apply(this, arguments), $ = this.__zoom, R = E == null ? x(A) : typeof E == "function" ? E.apply(this, arguments) : E, H = $.invert(R), O = typeof S == "function" ? S.apply(this, arguments) : S;
      return n(p(b($, O), R, H), A, s);
    }, E, M);
  }, m.translateBy = function(y, S, E, M) {
    m.transform(y, function() {
      return n(this.__zoom.translate(
        typeof S == "function" ? S.apply(this, arguments) : S,
        typeof E == "function" ? E.apply(this, arguments) : E
      ), t.apply(this, arguments), s);
    }, null, M);
  }, m.translateTo = function(y, S, E, M, A) {
    m.transform(y, function() {
      var $ = t.apply(this, arguments), R = this.__zoom, H = M == null ? x($) : typeof M == "function" ? M.apply(this, arguments) : M;
      return n(dn.translate(H[0], H[1]).scale(R.k).translate(
        typeof S == "function" ? -S.apply(this, arguments) : -S,
        typeof E == "function" ? -E.apply(this, arguments) : -E
      ), $, s);
    }, M, A);
  };
  function b(y, S) {
    return S = Math.max(i[0], Math.min(i[1], S)), S === y.k ? y : new Te(S, y.x, y.y);
  }
  function p(y, S, E) {
    var M = S[0] - E[0] * y.k, A = S[1] - E[1] * y.k;
    return M === y.x && A === y.y ? y : new Te(y.k, M, A);
  }
  function x(y) {
    return [(+y[0][0] + +y[1][0]) / 2, (+y[0][1] + +y[1][1]) / 2];
  }
  function N(y, S, E, M) {
    y.on("start.zoom", function() {
      _(this, arguments).event(M).start();
    }).on("interrupt.zoom end.zoom", function() {
      _(this, arguments).event(M).end();
    }).tween("zoom", function() {
      var A = this, $ = arguments, R = _(A, $).event(M), H = t.apply(A, $), O = E == null ? x(H) : typeof E == "function" ? E.apply(A, $) : E, W = Math.max(H[1][0] - H[0][0], H[1][1] - H[0][1]), B = A.__zoom, q = typeof S == "function" ? S.apply(A, $) : S, Q = c(B.invert(O).concat(W / B.k), q.invert(O).concat(W / q.k));
      return function(Z) {
        if (Z === 1) Z = q;
        else {
          var D = Q(Z), F = W / D[2];
          Z = new Te(F, O[0] - D[0] * F, O[1] - D[1] * F);
        }
        R.zoom(null, Z);
      };
    });
  }
  function _(y, S, E) {
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
      l.call(
        y,
        this.that,
        new rd(y, {
          sourceEvent: this.sourceEvent,
          target: m,
          transform: this.that.__zoom,
          dispatch: l
        }),
        S
      );
    }
  };
  function k(y, ...S) {
    if (!e.apply(this, arguments)) return;
    var E = _(this, S).event(y), M = this.__zoom, A = Math.max(i[0], Math.min(i[1], M.k * Math.pow(2, o.apply(this, arguments)))), $ = ge(y);
    if (E.wheel)
      (E.mouse[0][0] !== $[0] || E.mouse[0][1] !== $[1]) && (E.mouse[1] = M.invert(E.mouse[0] = $)), clearTimeout(E.wheel);
    else {
      if (M.k === A) return;
      E.mouse = [$, M.invert($)], Wt(this), E.start();
    }
    ht(y), E.wheel = setTimeout(R, g), E.zoom("mouse", n(p(b(M, A), E.mouse[0], E.mouse[1]), E.extent, s));
    function R() {
      E.wheel = null, E.end();
    }
  }
  function I(y, ...S) {
    if (d || !e.apply(this, arguments)) return;
    var E = y.currentTarget, M = _(this, S, !0).event(y), A = de(y.view).on("mousemove.zoom", O, !0).on("mouseup.zoom", W, !0), $ = ge(y, E), R = y.clientX, H = y.clientY;
    Zr(y.view), Nn(y), M.mouse = [$, this.__zoom.invert($)], Wt(this), M.start();
    function O(B) {
      if (ht(B), !M.moved) {
        var q = B.clientX - R, Q = B.clientY - H;
        M.moved = q * q + Q * Q > v;
      }
      M.event(B).zoom("mouse", n(p(M.that.__zoom, M.mouse[0] = ge(B, E), M.mouse[1]), M.extent, s));
    }
    function W(B) {
      A.on("mousemove.zoom mouseup.zoom", null), Wr(B.view, M.moved), ht(B), M.event(B).end();
    }
  }
  function V(y, ...S) {
    if (e.apply(this, arguments)) {
      var E = this.__zoom, M = ge(y.changedTouches ? y.changedTouches[0] : y, this), A = E.invert(M), $ = E.k * (y.shiftKey ? 0.5 : 2), R = n(p(b(E, $), M, A), t.apply(this, S), s);
      ht(y), a > 0 ? de(this).transition().duration(a).call(N, R, M, y) : de(this).call(m.transform, R, M, y);
    }
  }
  function P(y, ...S) {
    if (e.apply(this, arguments)) {
      var E = y.touches, M = E.length, A = _(this, S, y.changedTouches.length === M).event(y), $, R, H, O;
      for (Nn(y), R = 0; R < M; ++R)
        H = E[R], O = ge(H, this), O = [O, this.__zoom.invert(O), H.identifier], A.touch0 ? !A.touch1 && A.touch0[2] !== O[2] && (A.touch1 = O, A.taps = 0) : (A.touch0 = O, $ = !0, A.taps = 1 + !!u);
      u && (u = clearTimeout(u)), $ && (A.taps < 2 && (f = O[0], u = setTimeout(function() {
        u = null;
      }, h)), Wt(this), A.start());
    }
  }
  function L(y, ...S) {
    if (this.__zooming) {
      var E = _(this, S).event(y), M = y.changedTouches, A = M.length, $, R, H, O;
      for (ht(y), $ = 0; $ < A; ++$)
        R = M[$], H = ge(R, this), E.touch0 && E.touch0[2] === R.identifier ? E.touch0[0] = H : E.touch1 && E.touch1[2] === R.identifier && (E.touch1[0] = H);
      if (R = E.that.__zoom, E.touch1) {
        var W = E.touch0[0], B = E.touch0[1], q = E.touch1[0], Q = E.touch1[1], Z = (Z = q[0] - W[0]) * Z + (Z = q[1] - W[1]) * Z, D = (D = Q[0] - B[0]) * D + (D = Q[1] - B[1]) * D;
        R = b(R, Math.sqrt(Z / D)), H = [(W[0] + q[0]) / 2, (W[1] + q[1]) / 2], O = [(B[0] + Q[0]) / 2, (B[1] + Q[1]) / 2];
      } else if (E.touch0) H = E.touch0[0], O = E.touch0[1];
      else return;
      E.zoom("touch", n(p(R, H, O), E.extent, s));
    }
  }
  function z(y, ...S) {
    if (this.__zooming) {
      var E = _(this, S).event(y), M = y.changedTouches, A = M.length, $, R;
      for (Nn(y), d && clearTimeout(d), d = setTimeout(function() {
        d = null;
      }, h), $ = 0; $ < A; ++$)
        R = M[$], E.touch0 && E.touch0[2] === R.identifier ? delete E.touch0 : E.touch1 && E.touch1[2] === R.identifier && delete E.touch1;
      if (E.touch1 && !E.touch0 && (E.touch0 = E.touch1, delete E.touch1), E.touch0) E.touch0[1] = this.__zoom.invert(E.touch0[0]);
      else if (E.end(), E.taps === 2 && (R = ge(R, this), Math.hypot(f[0] - R[0], f[1] - R[1]) < w)) {
        var H = de(this).on("dblclick.zoom");
        H && H.apply(this, arguments);
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
    return arguments.length ? (c = y, m) : c;
  }, m.on = function() {
    var y = l.on.apply(l, arguments);
    return y === l ? m : y;
  }, m.clickDistance = function(y) {
    return arguments.length ? (v = (y = +y) * y, m) : Math.sqrt(v);
  }, m.tapDistance = function(y) {
    return arguments.length ? (w = +y, m) : w;
  }, m;
}
const be = {
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
], li = ["Enter", " ", "Escape"], ui = {
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
var Ge;
(function(e) {
  e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(Ge || (Ge = {}));
var St;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(St || (St = {}));
const di = {
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
var Oe;
(function(e) {
  e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})(Oe || (Oe = {}));
var en;
(function(e) {
  e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(en || (en = {}));
var Y;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(Y || (Y = {}));
const Bo = {
  [Y.Left]: Y.Right,
  [Y.Right]: Y.Left,
  [Y.Top]: Y.Bottom,
  [Y.Bottom]: Y.Top
}, fi = (e) => !!e && typeof e == "object" && "id" in e && "source" in e && "target" in e, ud = (e) => !!e && typeof e == "object" && "id" in e && "position" in e && !("source" in e) && !("target" in e), oo = (e) => !!e && typeof e == "object" && "id" in e && "internals" in e && !("source" in e) && !("target" in e), kt = (e, t = [0, 0]) => {
  const { width: n, height: o } = Se(e), r = e.origin ?? t, i = n * r[0], s = o * r[1];
  return {
    x: e.position.x - i,
    y: e.position.y - s
  };
}, dd = (e, t = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = !1;
  const o = e.reduce((r, i) => {
    const s = typeof i == "string";
    let a = !t.nodeLookup && !s ? i : void 0;
    return t.nodeLookup && (a = s ? t.nodeLookup.get(i) : oo(i) ? i : t.nodeLookup.get(i.id)), a ? (n = !0, fn(r, tn(a, t.nodeOrigin))) : r;
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return n ? hn(o) : { x: 0, y: 0, width: 0, height: 0 };
}, At = (e, t = {}) => {
  let n = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, o = !1;
  return e.forEach((r) => {
    (t.filter === void 0 || t.filter(r)) && (n = fn(n, tn(r)), o = !0);
  }), o ? hn(n) : { x: 0, y: 0, width: 0, height: 0 };
}, ro = (e, t, [n, o, r] = [0, 0, 1], i = !1, s = !1) => {
  const a = (t.x - n) / r, c = (t.y - o) / r, l = t.width / r, u = t.height / r, f = [];
  for (const d of e.values()) {
    const { measured: h, selectable: g = !0, hidden: v = !1 } = d;
    if (s && !g || v)
      continue;
    const w = h.width ?? d.width ?? d.initialWidth ?? 0, m = h.height ?? d.height ?? d.initialHeight ?? 0, { x: b, y: p } = d.internals.positionAbsolute, x = mi(a, c, l, u, b, p, w, m), N = w * m, _ = i && x > 0;
    (!d.internals.handleBounds || _ || x >= N || d.dragging) && f.push(d);
  }
  return f;
}, fd = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((o) => {
    n.add(o.id);
  }), t.filter((o) => n.has(o.source) || n.has(o.target));
};
function hd(e, t) {
  const n = /* @__PURE__ */ new Map(), o = t?.nodes ? new Set(t.nodes.map((r) => r.id)) : null;
  return e.forEach((r) => {
    let i;
    if (t?.includeHiddenNodes) {
      const { width: s, height: a } = Se(r);
      i = s > 0 && a > 0;
    } else
      i = !!(r.measured.width && r.measured.height && !r.hidden);
    i && (!o || o.has(r.id)) && n.set(r.id, r);
  }), n;
}
async function gd({ nodes: e, width: t, height: n, panZoom: o, minZoom: r, maxZoom: i }, s) {
  if (e.size === 0)
    return !0;
  const a = hd(e, s), c = At(a), l = so(c, t, n, s?.minZoom ?? r, s?.maxZoom ?? i, s?.padding ?? 0.1);
  return await o.setViewport(l, {
    duration: s?.duration,
    ease: s?.ease,
    interpolate: s?.interpolate
  }), !0;
}
function hi({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: o = [0, 0], nodeExtent: r, onError: i }) {
  const s = n.get(e), a = s.parentId ? n.get(s.parentId) : void 0, { x: c, y: l } = a ? a.internals.positionAbsolute : { x: 0, y: 0 }, u = s.origin ?? o;
  let f = s.extent || r;
  if (s.extent === "parent" && !s.expandParent)
    if (!a)
      i?.("005", be.error005());
    else {
      const { width: h, height: g } = Se(a);
      h && g && (f = [
        [c, l],
        [c + h, l + g]
      ]);
    }
  else a && Je(s.extent) && (f = [
    [s.extent[0][0] + c, s.extent[0][1] + l],
    [s.extent[1][0] + c, s.extent[1][1] + l]
  ]);
  const d = Je(f) ? Qe(t, f, s.measured) : t;
  return (s.measured.width === void 0 || s.measured.height === void 0) && i?.("015", be.error015()), {
    position: {
      x: d.x - c + (s.measured.width ?? 0) * u[0],
      y: d.y - l + (s.measured.height ?? 0) * u[1]
    },
    positionAbsolute: d
  };
}
async function pd({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: o, onBeforeDelete: r }) {
  const i = new Set(e.map((d) => d.id)), s = [];
  for (const d of n) {
    if (d.deletable === !1)
      continue;
    const h = i.has(d.id), g = !h && d.parentId && s.find((v) => v.id === d.parentId);
    (h || g) && s.push(d);
  }
  const a = new Set(t.map((d) => d.id)), c = o.filter((d) => d.deletable !== !1), u = fd(s, c);
  for (const d of c)
    a.has(d.id) && !u.find((g) => g.id === d.id) && u.push(d);
  if (!r)
    return {
      edges: u,
      nodes: s
    };
  const f = await r({
    nodes: s,
    edges: u
  });
  return typeof f == "boolean" ? f ? { edges: u, nodes: s } : { edges: [], nodes: [] } : f;
}
const at = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), Qe = (e = { x: 0, y: 0 }, t, n) => ({
  x: at(e.x, t[0][0], t[1][0] - (n?.width ?? 0)),
  y: at(e.y, t[0][1], t[1][1] - (n?.height ?? 0))
});
function gi(e, t, n) {
  const { width: o, height: r } = Se(n), { x: i, y: s } = n.internals.positionAbsolute;
  return Qe(e, [
    [i, s],
    [i + o, s + r]
  ], t);
}
const Fo = (e, t, n) => e < t ? at(Math.abs(e - t), 1, t) / t : e > n ? -at(Math.abs(e - n), 1, t) / t : 0, io = (e, t, n = 15, o = 40) => {
  const r = Fo(e.x, o, t.width - o) * n, i = Fo(e.y, o, t.height - o) * n;
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
  const { x: n, y: o } = oo(e) ? e.internals.positionAbsolute : kt(e, t);
  return {
    x: n,
    y: o,
    width: e.measured?.width ?? e.width ?? e.initialWidth ?? 0,
    height: e.measured?.height ?? e.height ?? e.initialHeight ?? 0
  };
}, tn = (e, t = [0, 0]) => {
  const { x: n, y: o } = oo(e) ? e.internals.positionAbsolute : kt(e, t);
  return {
    x: n,
    y: o,
    x2: n + (e.measured?.width ?? e.width ?? e.initialWidth ?? 0),
    y2: o + (e.measured?.height ?? e.height ?? e.initialHeight ?? 0)
  };
}, pi = (e, t) => hn(fn(Xn(e), Xn(t))), mi = (e, t, n, o, r, i, s, a) => {
  const c = Math.max(0, Math.min(e + n, r + s) - Math.max(e, r)), l = Math.max(0, Math.min(t + o, i + a) - Math.max(t, i));
  return Math.ceil(c * l);
}, nn = (e, t) => mi(e.x, e.y, e.width, e.height, t.x, t.y, t.width, t.height), Xo = (e) => me(e.width) && me(e.height) && me(e.x) && me(e.y), me = (e) => !isNaN(e) && isFinite(e), yi = (e, t) => (n, o) => {
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
function et(e, t) {
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
function md(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const o = et(e, n), r = et(e, t);
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
    const o = et(e.top ?? e.y ?? 0, n), r = et(e.bottom ?? e.y ?? 0, n), i = et(e.left ?? e.x ?? 0, t), s = et(e.right ?? e.x ?? 0, t);
    return { top: o, right: s, bottom: r, left: i, x: i + s, y: o + r };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function yd(e, t, n, o, r, i) {
  const { x: s, y: a } = ct(e, [t, n, o]), { x: c, y: l } = ct({ x: e.x + e.width, y: e.y + e.height }, [t, n, o]), u = r - c, f = i - l;
  return {
    left: Math.floor(s),
    top: Math.floor(a),
    right: Math.floor(u),
    bottom: Math.floor(f)
  };
}
const so = (e, t, n, o, r, i) => {
  const s = md(i, t, n), a = (t - s.x) / e.width, c = (n - s.y) / e.height, l = Math.min(a, c), u = at(l, o, r), f = e.x + e.width / 2, d = e.y + e.height / 2, h = t / 2 - f * u, g = n / 2 - d * u, v = yd(e, h, g, u, t, n), w = {
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
function Je(e) {
  return e != null && e !== "parent";
}
function Se(e) {
  return {
    width: e.measured?.width ?? e.width ?? e.initialWidth ?? 0,
    height: e.measured?.height ?? e.height ?? e.initialHeight ?? 0
  };
}
function wi(e) {
  return (e.measured?.width ?? e.width ?? e.initialWidth) !== void 0 && (e.measured?.height ?? e.height ?? e.initialHeight) !== void 0;
}
function xi(e, t = { width: 0, height: 0 }, n, o, r) {
  const i = { ...e }, s = o.get(n);
  if (s) {
    const a = s.origin || r;
    i.x += s.internals.positionAbsolute.x - (t.width ?? 0) * a[0], i.y += s.internals.positionAbsolute.y - (t.height ?? 0) * a[1];
  }
  return i;
}
function Yo(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function wd() {
  let e, t;
  return { promise: new Promise((o, r) => {
    e = o, t = r;
  }), resolve: e, reject: t };
}
function xd(e) {
  return { ...ui, ...e || {} };
}
function vi(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
function yt(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: o, containerBounds: r }) {
  const { x: i, y: s } = ye(e), a = Pt({ x: i - (r?.left ?? 0), y: s - (r?.top ?? 0) }, o), { x: c, y: l } = n ? $t(a, t) : a;
  return {
    xSnapped: c,
    ySnapped: l,
    ...a
  };
}
const ao = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), bi = (e) => e?.getRootNode?.() || window?.document, vd = ["INPUT", "SELECT", "TEXTAREA"];
function _i(e) {
  const t = e.composedPath?.()?.[0] || e.target;
  return t?.nodeType !== 1 ? !1 : vd.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey");
}
const Si = (e) => "clientX" in e, ye = (e, t) => {
  const n = Si(e), o = n ? e.clientX : e.touches?.[0].clientX, r = n ? e.clientY : e.touches?.[0].clientY;
  return {
    x: o - (t?.left ?? 0),
    y: r - (t?.top ?? 0)
  };
}, Zo = (e, t, n, o, r) => {
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
function Ei({ sourceX: e, sourceY: t, targetX: n, targetY: o, sourceControlX: r, sourceControlY: i, targetControlX: s, targetControlY: a }) {
  const c = e * 0.125 + r * 0.375 + s * 0.375 + n * 0.125, l = t * 0.125 + i * 0.375 + a * 0.375 + o * 0.125, u = Math.abs(c - e), f = Math.abs(l - t);
  return [c, l, u, f];
}
function Lt(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function Wo({ pos: e, x1: t, y1: n, x2: o, y2: r, c: i }) {
  switch (e) {
    case Y.Left:
      return [t - Lt(t - o, i), n];
    case Y.Right:
      return [t + Lt(o - t, i), n];
    case Y.Top:
      return [t, n - Lt(n - r, i)];
    case Y.Bottom:
      return [t, n + Lt(r - n, i)];
  }
}
function Ni({ sourceX: e, sourceY: t, sourcePosition: n = Y.Bottom, targetX: o, targetY: r, targetPosition: i = Y.Top, curvature: s = 0.25 }) {
  const [a, c] = Wo({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: r,
    c: s
  }), [l, u] = Wo({
    pos: i,
    x1: o,
    y1: r,
    x2: e,
    y2: t,
    c: s
  }), [f, d, h, g] = Ei({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: r,
    sourceControlX: a,
    sourceControlY: c,
    targetControlX: l,
    targetControlY: u
  });
  return [
    `M${e},${t} C${a},${c} ${l},${u} ${o},${r}`,
    f,
    d,
    h,
    g
  ];
}
function Ci({ sourceX: e, sourceY: t, targetX: n, targetY: o }) {
  const r = Math.abs(n - e) / 2, i = n < e ? n + r : n - r, s = Math.abs(o - t) / 2, a = o < t ? o + s : o - s;
  return [i, a, r, s];
}
function bd({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: o = 0, elevateOnSelect: r = !1, zIndexMode: i = "basic" }) {
  if (i === "manual")
    return o;
  const s = r && n ? o + 1e3 : o, a = Math.max(e.parentId || r && e.selected ? e.internals.z : 0, t.parentId || r && t.selected ? t.internals.z : 0);
  return s + a;
}
function _d({ sourceNode: e, targetNode: t, width: n, height: o, transform: r }) {
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
const Sd = ({ source: e, sourceHandle: t, target: n, targetHandle: o }) => `xy-edge__${e}${t || ""}-${n}${o || ""}`, Ed = (e, t) => t.some((n) => n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)), Nd = (e, t, n = {}) => {
  if (!e.source || !e.target)
    return n.onError?.("006", be.error006()), t;
  const o = n.getEdgeId || Sd;
  let r;
  return fi(e) ? r = { ...e } : r = {
    ...e,
    id: o(e)
  }, Ed(r, t) ? t : (r.sourceHandle === null && delete r.sourceHandle, r.targetHandle === null && delete r.targetHandle, t.concat(r));
};
function Mi({ sourceX: e, sourceY: t, targetX: n, targetY: o }) {
  const [r, i, s, a] = Ci({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: o
  });
  return [`M ${e},${t}L ${n},${o}`, r, i, s, a];
}
const qo = {
  [Y.Left]: { x: -1, y: 0 },
  [Y.Right]: { x: 1, y: 0 },
  [Y.Top]: { x: 0, y: -1 },
  [Y.Bottom]: { x: 0, y: 1 }
}, Cd = ({ source: e, sourcePosition: t = Y.Bottom, target: n }) => t === Y.Left || t === Y.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, Go = (e, t) => Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
function Md({ source: e, sourcePosition: t = Y.Bottom, target: n, targetPosition: o = Y.Top, center: r, offset: i, stepPosition: s }) {
  const a = qo[t], c = qo[o], l = { x: e.x + a.x * i, y: e.y + a.y * i }, u = { x: n.x + c.x * i, y: n.y + c.y * i }, f = Cd({
    source: l,
    sourcePosition: t,
    target: u
  }), d = f.x !== 0 ? "x" : "y", h = f[d];
  let g = [], v, w;
  const m = { x: 0, y: 0 }, b = { x: 0, y: 0 }, [, , p, x] = Ci({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (a[d] * c[d] === -1) {
    d === "x" ? (v = r.x ?? l.x + (u.x - l.x) * s, w = r.y ?? (l.y + u.y) / 2) : (v = r.x ?? (l.x + u.x) / 2, w = r.y ?? l.y + (u.y - l.y) * s);
    const k = [
      { x: v, y: l.y },
      { x: v, y: u.y }
    ], I = [
      { x: l.x, y: w },
      { x: u.x, y: w }
    ];
    a[d] === h ? g = d === "x" ? k : I : g = d === "x" ? I : k;
  } else {
    const k = [{ x: l.x, y: u.y }], I = [{ x: u.x, y: l.y }];
    if (d === "x" ? g = a.x === h ? I : k : g = a.y === h ? k : I, t === o) {
      const y = Math.abs(e[d] - n[d]);
      if (y <= i) {
        const S = Math.min(i - 1, i - y);
        a[d] === h ? m[d] = (l[d] > e[d] ? -1 : 1) * S : b[d] = (u[d] > n[d] ? -1 : 1) * S;
      }
    }
    if (t !== o) {
      const y = d === "x" ? "y" : "x", S = a[d] === c[y], E = l[y] > u[y], M = l[y] < u[y];
      (a[d] === 1 && (!S && E || S && M) || a[d] !== 1 && (!S && M || S && E)) && (g = d === "x" ? k : I);
    }
    const V = { x: l.x + m.x, y: l.y + m.y }, P = { x: u.x + b.x, y: u.y + b.y }, L = Math.max(Math.abs(V.x - g[0].x), Math.abs(P.x - g[0].x)), z = Math.max(Math.abs(V.y - g[0].y), Math.abs(P.y - g[0].y));
    L >= z ? (v = (V.x + P.x) / 2, w = g[0].y) : (v = g[0].x, w = (V.y + P.y) / 2);
  }
  const N = { x: l.x + m.x, y: l.y + m.y }, _ = { x: u.x + b.x, y: u.y + b.y };
  return [[
    e,
    // we only want to add the gapped source/target if they are different from the first/last point to avoid duplicates which can cause issues with the bends
    ...N.x !== g[0].x || N.y !== g[0].y ? [N] : [],
    ...g,
    ..._.x !== g[g.length - 1].x || _.y !== g[g.length - 1].y ? [_] : [],
    n
  ], v, w, p, x];
}
function Id(e, t, n, o) {
  const r = Math.min(Go(e, t) / 2, Go(t, n) / 2, o), { x: i, y: s } = t;
  if (e.x === i && i === n.x || e.y === s && s === n.y)
    return `L${i} ${s}`;
  if (e.y === s) {
    const l = e.x < n.x ? -1 : 1, u = e.y < n.y ? 1 : -1;
    return `L ${i + r * l},${s}Q ${i},${s} ${i},${s + r * u}`;
  }
  const a = e.x < n.x ? 1 : -1, c = e.y < n.y ? -1 : 1;
  return `L ${i},${s + r * c}Q ${i},${s} ${i + r * a},${s}`;
}
function Yn({ sourceX: e, sourceY: t, sourcePosition: n = Y.Bottom, targetX: o, targetY: r, targetPosition: i = Y.Top, borderRadius: s = 5, centerX: a, centerY: c, offset: l = 20, stepPosition: u = 0.5 }) {
  const [f, d, h, g, v] = Md({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: o, y: r },
    targetPosition: i,
    center: { x: a, y: c },
    offset: l,
    stepPosition: u
  });
  let w = `M${f[0].x} ${f[0].y}`;
  for (let m = 1; m < f.length - 1; m++)
    w += Id(f[m - 1], f[m], f[m + 1], s);
  return w += `L${f[f.length - 1].x} ${f[f.length - 1].y}`, [w, d, h, g, v];
}
function Uo(e) {
  return e && !!(e.internals.handleBounds || e.handles?.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function kd(e) {
  const { sourceNode: t, targetNode: n } = e;
  if (!Uo(t) || !Uo(n))
    return null;
  const o = t.internals.handleBounds || Ko(t.handles), r = n.internals.handleBounds || Ko(n.handles), i = Qo(o?.source ?? [], e.sourceHandle), s = Qo(
    // when connection type is loose we can define all handles as sources and connect source -> source
    e.connectionMode === st.Strict ? r?.target ?? [] : (r?.target ?? []).concat(r?.source ?? []),
    e.targetHandle
  );
  if (!i || !s)
    return e.onError?.("008", be.error008(i ? "target" : "source", {
      id: e.id,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle
    })), null;
  const a = i?.position || Y.Bottom, c = s?.position || Y.Top, l = je(t, i, a), u = je(n, s, c);
  return {
    sourceX: l.x,
    sourceY: l.y,
    targetX: u.x,
    targetY: u.y,
    sourcePosition: a,
    targetPosition: c
  };
}
function Ko(e) {
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
function je(e, t, n = Y.Left, o = !1) {
  const r = (t?.x ?? 0) + e.internals.positionAbsolute.x, i = (t?.y ?? 0) + e.internals.positionAbsolute.y, { width: s, height: a } = t ?? Se(e);
  if (o)
    return { x: r + s / 2, y: i + a / 2 };
  switch (t?.position ?? n) {
    case Y.Top:
      return { x: r + s / 2, y: i };
    case Y.Right:
      return { x: r + s, y: i + a / 2 };
    case Y.Bottom:
      return { x: r + s / 2, y: i + a };
    case Y.Left:
      return { x: r, y: i + a / 2 };
  }
}
function Qo(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function Zn(e, t) {
  return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((o) => `${o}=${e[o]}`).join("&")}` : "";
}
function Ad(e, { id: t, defaultColor: n, defaultMarkerStart: o, defaultMarkerEnd: r }) {
  const i = /* @__PURE__ */ new Set();
  return e.reduce((s, a) => ([a.markerStart || o, a.markerEnd || r].forEach((c) => {
    if (c && typeof c == "object") {
      const l = Zn(c, t);
      i.has(l) || (s.push({ id: l, color: c.color || n, ...c }), i.add(l));
    }
  }), s), []).sort((s, a) => s.id.localeCompare(a.id));
}
const Ii = 1e3, $d = 10, co = {
  nodeOrigin: [0, 0],
  nodeExtent: _t,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, Pd = {
  ...co,
  checkEquality: !0
};
function lo(e, t) {
  const n = { ...e };
  for (const o in t)
    t[o] !== void 0 && (n[o] = t[o]);
  return n;
}
function Dd(e, t, n) {
  const o = lo(co, n);
  for (const r of e.values())
    if (r.parentId)
      fo(r, e, t, o);
    else {
      const i = kt(r, o.nodeOrigin), s = Je(r.extent) ? r.extent : o.nodeExtent, a = Qe(i, s, Se(r));
      r.internals.positionAbsolute = a;
    }
}
function Td(e, t) {
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
  const r = lo(Pd, o), i = { i: 0 }, s = new Map(t), a = r?.elevateNodesOnSelect && !uo(r.zIndexMode) ? Ii : 0;
  let c = e.length > 0, l = !1;
  t.clear(), n.clear();
  for (const u of e) {
    let f = s.get(u.id);
    if (r.checkEquality && u === f?.internals.userNode)
      t.set(u.id, f);
    else {
      const d = kt(u, r.nodeOrigin), h = Je(u.extent) ? u.extent : r.nodeExtent, g = Qe(d, h, Se(u));
      f = {
        ...r.defaults,
        ...u,
        measured: {
          width: u.measured?.width,
          height: u.measured?.height
        },
        internals: {
          positionAbsolute: g,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: Td(u, f),
          z: ki(u, a, r.zIndexMode),
          userNode: u
        }
      }, t.set(u.id, f);
    }
    (f.measured === void 0 || f.measured.width === void 0 || f.measured.height === void 0) && !f.hidden && (c = !1), u.parentId && fo(f, t, n, o, i), l ||= u.selected ?? !1;
  }
  return { nodesInitialized: c, hasSelectedNodes: l };
}
function zd(e, t) {
  if (!e.parentId)
    return;
  const n = t.get(e.parentId);
  n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function fo(e, t, n, o, r) {
  const { elevateNodesOnSelect: i, nodeOrigin: s, nodeExtent: a, zIndexMode: c } = lo(co, o), l = e.parentId, u = t.get(l);
  if (!u) {
    console.warn(`Parent node ${l} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  zd(e, n), r && !u.parentId && u.internals.rootParentIndex === void 0 && c === "auto" && (u.internals.rootParentIndex = ++r.i, u.internals.z = u.internals.z + r.i * $d), r && u.internals.rootParentIndex !== void 0 && (r.i = u.internals.rootParentIndex);
  const f = i && !uo(c) ? Ii : 0, { x: d, y: h, z: g } = Hd(e, u, s, a, f, c), { positionAbsolute: v } = e.internals, w = d !== v.x || h !== v.y;
  (w || g !== e.internals.z) && t.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: w ? { x: d, y: h } : v,
      z: g
    }
  });
}
function ki(e, t, n) {
  const o = me(e.zIndex) ? e.zIndex : 0;
  return uo(n) ? o : o + (e.selected ? t : 0);
}
function Hd(e, t, n, o, r, i) {
  const { x: s, y: a } = t.internals.positionAbsolute, c = Se(e), l = kt(e, n), u = Je(e.extent) ? Qe(l, e.extent, c) : l;
  let f = Qe({ x: s + u.x, y: a + u.y }, o, c);
  e.extent === "parent" && (f = gi(f, c, t));
  const d = ki(e, r, i), h = t.internals.z ?? 0;
  return {
    x: f.x,
    y: f.y,
    z: h >= d ? h + 1 : d
  };
}
function ho(e, t, n, o = [0, 0]) {
  const r = [], i = /* @__PURE__ */ new Map();
  for (const s of e) {
    const a = t.get(s.parentId);
    if (!a)
      continue;
    const c = i.get(s.parentId)?.expandedRect ?? Et(a), l = pi(c, s.rect);
    i.set(s.parentId, { expandedRect: l, parent: a });
  }
  return i.size > 0 && i.forEach(({ expandedRect: s, parent: a }, c) => {
    const l = a.internals.positionAbsolute, u = Se(a), f = a.origin ?? o, d = s.x < l.x ? Math.round(Math.abs(l.x - s.x)) : 0, h = s.y < l.y ? Math.round(Math.abs(l.y - s.y)) : 0, g = Math.max(u.width, Math.round(s.width)), v = Math.max(u.height, Math.round(s.height)), w = (g - u.width) * f[0], m = (v - u.height) * f[1];
    (d > 0 || h > 0 || w || m) && (r.push({
      id: c,
      type: "position",
      position: {
        x: a.position.x - d + w,
        y: a.position.y - h + m
      }
    }), n.get(c)?.forEach((b) => {
      e.some((p) => p.id === b.id) || r.push({
        id: b.id,
        type: "position",
        position: {
          x: b.position.x + d,
          y: b.position.y + h
        }
      });
    })), (u.width < s.width || u.height < s.height || d || h) && r.push({
      id: c,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: g + (d ? f[0] * d - w : 0),
        height: v + (h ? f[1] * h - m : 0)
      }
    });
  }), r;
}
function Rd(e, t, n, o, r, i, s) {
  const a = o?.querySelector(".xyflow__viewport");
  let c = !1;
  if (!a)
    return { changes: [], updatedInternals: c };
  const l = [], u = window.getComputedStyle(a), { m22: f } = new window.DOMMatrixReadOnly(u.transform), d = [];
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
      }), c = !0;
      continue;
    }
    const v = ao(h.nodeElement), w = g.measured.width !== v.width || g.measured.height !== v.height;
    if (!!(v.width && v.height && (w || !g.internals.handleBounds || h.force))) {
      const b = h.nodeElement.getBoundingClientRect(), p = Je(g.extent) ? g.extent : i;
      let { positionAbsolute: x } = g.internals;
      if (g.parentId && g.extent === "parent") {
        const _ = t.get(g.parentId);
        _ && (x = gi(x, v, _));
      } else p && (x = Qe(x, p, v));
      const N = {
        ...g,
        measured: v,
        internals: {
          ...g.internals,
          positionAbsolute: x,
          handleBounds: {
            source: Zo("source", h.nodeElement, b, f, g.id),
            target: Zo("target", h.nodeElement, b, f, g.id)
          }
        }
      };
      t.set(g.id, N), g.parentId && fo(N, t, n, { nodeOrigin: r, zIndexMode: s }), c = !0, w && (l.push({
        id: g.id,
        type: "dimensions",
        dimensions: v
      }), g.expandParent && g.parentId && d.push({
        id: g.id,
        parentId: g.parentId,
        rect: Et(N, r)
      }));
    }
  }
  if (d.length > 0) {
    const h = ho(d, t, n, r);
    l.push(...h);
  }
  return { changes: l, updatedInternals: c };
}
async function Ld({ delta: e, panZoom: t, transform: n, translateExtent: o, width: r, height: i }) {
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
function Jo(e, t, n, o, r, i) {
  let s = r;
  const a = o.get(s) || /* @__PURE__ */ new Map();
  o.set(s, a.set(n, t)), s = `${r}-${e}`;
  const c = o.get(s) || /* @__PURE__ */ new Map();
  if (o.set(s, c.set(n, t)), i) {
    s = `${r}-${e}-${i}`;
    const l = o.get(s) || /* @__PURE__ */ new Map();
    o.set(s, l.set(n, t));
  }
}
function Ai(e, t, n) {
  e.clear(), t.clear();
  for (const o of n) {
    const { source: r, target: i, sourceHandle: s = null, targetHandle: a = null } = o, c = { edgeId: o.id, source: r, target: i, sourceHandle: s, targetHandle: a }, l = `${r}-${s}--${i}-${a}`, u = `${i}-${a}--${r}-${s}`;
    Jo("source", c, u, e, r, s), Jo("target", c, l, e, i, a), t.set(o.id, o);
  }
}
function $i(e, t) {
  if (!e.parentId)
    return !1;
  const n = t.get(e.parentId);
  return n ? n.selected ? !0 : $i(n, t) : !1;
}
function jo(e, t, n) {
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
function Vd(e, t, n, o) {
  const r = /* @__PURE__ */ new Map();
  for (const [i, s] of e)
    if ((s.selected || s.id === o) && (!s.parentId || !$i(s, e)) && (s.draggable || t && typeof s.draggable > "u")) {
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
    const c = n.get(s)?.internals.userNode;
    c && r.push({
      ...c,
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
function Od({ dragItems: e, snapGrid: t, x: n, y: o }) {
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
function Bd({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: o, onDragStop: r }) {
  let i = { x: null, y: null }, s = 0, a = /* @__PURE__ */ new Map(), c = !1, l = { x: 0, y: 0 }, u = null, f = !1, d = null, h = !1, g = !1, v = null;
  function w({ noDragClassName: b, handleSelector: p, domNode: x, isSelectable: N, nodeId: _, nodeClickDistance: C = 0 }) {
    d = de(x);
    function k({ x: L, y: z }) {
      const { nodeLookup: y, nodeExtent: S, snapGrid: E, snapToGrid: M, nodeOrigin: A, onNodeDrag: $, onSelectionDrag: R, onError: H, updateNodePositions: O } = t();
      i = { x: L, y: z };
      let W = !1;
      const B = a.size > 1, q = B && S ? Xn(At(a)) : null, Q = B && M ? Od({
        dragItems: a,
        snapGrid: E,
        x: L,
        y: z
      }) : null;
      for (const [Z, D] of a) {
        if (!y.has(Z))
          continue;
        let F = { x: L - D.distance.x, y: z - D.distance.y };
        M && (F = Q ? {
          x: Math.round(F.x + Q.x),
          y: Math.round(F.y + Q.y)
        } : $t(F, E));
        let K = null;
        if (B && S && !D.extent && q) {
          const { positionAbsolute: G } = D.internals, J = G.x - q.x + S[0][0], j = G.x + D.measured.width - q.x2 + S[1][0], ne = G.y - q.y + S[0][1], ce = G.y + D.measured.height - q.y2 + S[1][1];
          K = [
            [J, ne],
            [j, ce]
          ];
        }
        const { position: U, positionAbsolute: X } = hi({
          nodeId: Z,
          nextPosition: F,
          nodeLookup: y,
          nodeExtent: K || S,
          nodeOrigin: A,
          onError: H
        });
        W = W || D.position.x !== U.x || D.position.y !== U.y, D.position = U, D.internals.positionAbsolute = X;
      }
      if (g = g || W, !!W && (O(a, !0), v && (o || $ || !_ && R))) {
        const [Z, D] = Cn({
          nodeId: _,
          dragItems: a,
          nodeLookup: y
        });
        o?.(v, a, Z, D), $?.(v, Z, D), _ || R?.(v, D);
      }
    }
    async function I() {
      if (!u)
        return;
      const { transform: L, panBy: z, autoPanSpeed: y, autoPanOnNodeDrag: S } = t();
      if (!S) {
        c = !1, cancelAnimationFrame(s);
        return;
      }
      const [E, M] = io(l, u, y);
      (E !== 0 || M !== 0) && (i.x = (i.x ?? 0) - E / L[2], i.y = (i.y ?? 0) - M / L[2], await z({ x: E, y: M }) && k(i)), s = requestAnimationFrame(I);
    }
    function V(L) {
      const { nodeLookup: z, multiSelectionActive: y, nodesDraggable: S, transform: E, snapGrid: M, snapToGrid: A, selectNodesOnDrag: $, onNodeDragStart: R, onSelectionDragStart: H, unselectNodesAndEdges: O } = t();
      f = !0, (!$ || !N) && !y && _ && (z.get(_)?.selected || O()), N && $ && _ && e?.(_);
      const W = yt(L.sourceEvent, { transform: E, snapGrid: M, snapToGrid: A, containerBounds: u });
      if (i = W, a = Vd(z, S, W, _), a.size > 0 && (n || R || !_ && H)) {
        const [B, q] = Cn({
          nodeId: _,
          dragItems: a,
          nodeLookup: z
        });
        n?.(L.sourceEvent, a, B, q), R?.(L.sourceEvent, B, q), _ || H?.(L.sourceEvent, q);
      }
    }
    const P = qr().clickDistance(C).on("start", (L) => {
      const { domNode: z, nodeDragThreshold: y, transform: S, snapGrid: E, snapToGrid: M } = t();
      u = z?.getBoundingClientRect() || null, h = !1, g = !1, v = L.sourceEvent, y === 0 && V(L), i = yt(L.sourceEvent, { transform: S, snapGrid: E, snapToGrid: M, containerBounds: u }), l = ye(L.sourceEvent, u);
    }).on("drag", (L) => {
      const { autoPanOnNodeDrag: z, transform: y, snapGrid: S, snapToGrid: E, nodeDragThreshold: M, nodeLookup: A } = t(), $ = yt(L.sourceEvent, { transform: y, snapGrid: S, snapToGrid: E, containerBounds: u });
      if (v = L.sourceEvent, (L.sourceEvent.type === "touchmove" && L.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      _ && !A.has(_)) && (h = !0), !h) {
        if (!c && z && f && (c = !0, I()), !f) {
          const R = ye(L.sourceEvent, u), H = R.x - l.x, O = R.y - l.y;
          Math.sqrt(H * H + O * O) > M && V(L);
        }
        (i.x !== $.xSnapped || i.y !== $.ySnapped) && a && f && (l = ye(L.sourceEvent, u), k($));
      }
    }).on("end", (L) => {
      if (!f || h) {
        h && a.size > 0 && t().updateNodePositions(a, !1);
        return;
      }
      if (c = !1, f = !1, cancelAnimationFrame(s), a.size > 0) {
        const { nodeLookup: z, updateNodePositions: y, onNodeDragStop: S, onSelectionDragStop: E } = t();
        if (g && (y(a, !1), g = !1), r || S || !_ && E) {
          const [M, A] = Cn({
            nodeId: _,
            dragItems: a,
            nodeLookup: z,
            dragging: !1
          });
          r?.(L.sourceEvent, a, M, A), S?.(L.sourceEvent, M, A), _ || E?.(L.sourceEvent, A);
        }
      }
    }).filter((L) => {
      const z = L.target;
      return !L.button && (!b || !jo(z, `.${b}`, x)) && (!p || jo(z, p, x));
    });
    d.call(P);
  }
  function m() {
    d?.on(".drag", null);
  }
  return {
    update: w,
    destroy: m
  };
}
function Fd(e, t, n) {
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
const Xd = 250;
function Yd(e, t, n, o) {
  let r = [], i = 1 / 0;
  const s = Fd(e, n, t + Xd);
  for (const a of s) {
    const c = [...a.internals.handleBounds?.source ?? [], ...a.internals.handleBounds?.target ?? []];
    for (const l of c) {
      if (o.nodeId === l.nodeId && o.type === l.type && o.id === l.id)
        continue;
      const { x: u, y: f } = je(a, l, l.position, !0), d = Math.sqrt(Math.pow(u - e.x, 2) + Math.pow(f - e.y, 2));
      d > t || (d < i ? (r = [{ ...l, x: u, y: f }], i = d) : d === i && r.push({ ...l, x: u, y: f }));
    }
  }
  if (!r.length)
    return null;
  if (r.length > 1) {
    const a = o.type === "source" ? "target" : "source";
    return r.find((c) => c.type === a) ?? r[0];
  }
  return r[0];
}
function Pi(e, t, n, o, r, i = !1) {
  const s = o.get(e);
  if (!s)
    return null;
  const a = r === "strict" ? s.internals.handleBounds?.[t] : [...s.internals.handleBounds?.source ?? [], ...s.internals.handleBounds?.target ?? []], c = (n ? a?.find((l) => l.id === n) : a?.[0]) ?? null;
  return c && i ? { ...c, ...je(s, c, c.position, !0) } : c;
}
function Di(e, t) {
  return e || (t?.classList.contains("target") ? "target" : t?.classList.contains("source") ? "source" : null);
}
function Zd(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
const Ti = () => !0;
function Wd(e, { connectionMode: t, connectionRadius: n, handleId: o, nodeId: r, edgeUpdaterType: i, isTarget: s, domNode: a, nodeLookup: c, lib: l, autoPanOnConnect: u, flowId: f, panBy: d, cancelConnection: h, onConnectStart: g, onConnect: v, onConnectEnd: w, isValidConnection: m = Ti, onReconnectEnd: b, updateConnection: p, getTransform: x, getFromHandle: N, autoPanSpeed: _, dragThreshold: C = 1, handleDomNode: k }) {
  const I = bi(e.target);
  let V = 0, P;
  const { x: L, y: z } = ye(e), y = Di(i, k), S = a?.getBoundingClientRect();
  let E = !1;
  if (!S || !y)
    return;
  const M = Pi(r, y, o, c, t);
  if (!M)
    return;
  let A = ye(e, S), $ = !1, R = null, H = !1, O = null;
  function W() {
    if (!u || !S)
      return;
    const [U, X] = io(A, S, _);
    d({ x: U, y: X }), V = requestAnimationFrame(W);
  }
  const B = {
    ...M,
    nodeId: r,
    type: y,
    position: M.position
  }, q = c.get(r);
  let Z = {
    inProgress: !0,
    isValid: null,
    from: je(q, B, Y.Left, !0),
    fromHandle: B,
    fromPosition: B.position,
    fromNode: q,
    to: A,
    toHandle: null,
    toPosition: Bo[B.position],
    toNode: null,
    pointer: A
  };
  function D() {
    E = !0, p(Z), g?.(e, { nodeId: r, handleId: o, handleType: y });
  }
  C === 0 && D();
  function F(U) {
    if (!E) {
      const { x: ce, y: ke } = ye(U), Ee = ce - L, Ne = ke - z;
      if (!(Ee * Ee + Ne * Ne > C * C))
        return;
      D();
    }
    if (!N() || !B) {
      K(U);
      return;
    }
    const X = x();
    A = ye(U, S), P = Yd(Pt(A, X, !1, [1, 1]), n, c, B), $ || (W(), $ = !0);
    const G = zi(U, {
      handle: P,
      connectionMode: t,
      fromNodeId: r,
      fromHandleId: o,
      fromType: s ? "target" : "source",
      isValidConnection: m,
      doc: I,
      lib: l,
      flowId: f,
      nodeLookup: c
    });
    O = G.handleDomNode, R = G.connection, H = Zd(!!P, G.isValid);
    const J = c.get(r), j = J ? je(J, B, Y.Left, !0) : Z.from, ne = {
      ...Z,
      from: j,
      isValid: H,
      to: G.toHandle && H ? ct({ x: G.toHandle.x, y: G.toHandle.y }, X) : A,
      toHandle: G.toHandle,
      toPosition: H && G.toHandle ? G.toHandle.position : Bo[B.position],
      toNode: G.toHandle ? c.get(G.toHandle.nodeId) : null,
      pointer: A
    };
    p(ne), Z = ne;
  }
  function K(U) {
    if (!("touches" in U && U.touches.length > 0)) {
      if (E) {
        (P || O) && R && H && v?.(R);
        const { inProgress: X, ...G } = Z, J = {
          ...G,
          toPosition: Z.toHandle ? Z.toPosition : null
        };
        w?.(U, J), i && b?.(U, J);
      }
      h(), cancelAnimationFrame(V), $ = !1, H = !1, R = null, O = null, I.removeEventListener("mousemove", F), I.removeEventListener("mouseup", K), I.removeEventListener("touchmove", F), I.removeEventListener("touchend", K);
    }
  }
  I.addEventListener("mousemove", F), I.addEventListener("mouseup", K), I.addEventListener("touchmove", F), I.addEventListener("touchend", K);
}
function zi(e, { handle: t, connectionMode: n, fromNodeId: o, fromHandleId: r, fromType: i, doc: s, lib: a, flowId: c, isValidConnection: l = Ti, nodeLookup: u }) {
  const f = i === "target", d = t ? s.querySelector(`.${a}-flow__handle[data-id="${c}-${t?.nodeId}-${t?.id}-${t?.type}"]`) : null, { x: h, y: g } = ye(e), v = s.elementFromPoint(h, g), w = v?.classList.contains(`${a}-flow__handle`) ? v : d, m = {
    handleDomNode: w,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (w) {
    const b = Di(void 0, w), p = w.getAttribute("data-nodeid"), x = w.getAttribute("data-handleid"), N = w.classList.contains("connectable"), _ = w.classList.contains("connectableend");
    if (!p || !b)
      return m;
    const C = {
      source: f ? p : o,
      sourceHandle: f ? x : r,
      target: f ? o : p,
      targetHandle: f ? r : x
    };
    m.connection = C;
    const I = N && _ && (n === st.Strict ? f && b === "source" || !f && b === "target" : p !== o || x !== r);
    m.isValid = I && l(C), m.toHandle = Pi(p, b, x, u, n, !0);
  }
  return m;
}
const qn = {
  onPointerDown: Wd,
  isValid: zi
};
function qd({ domNode: e, panZoom: t, getTransform: n, getViewScale: o }) {
  const r = de(e);
  function i({ translateExtent: a, width: c, height: l, zoomStep: u = 1, pannable: f = !0, zoomable: d = !0, inversePan: h = !1 }) {
    const g = (p) => {
      if (p.sourceEvent.type !== "wheel" || !t)
        return;
      const x = n(), N = p.sourceEvent.ctrlKey && Nt() ? 10 : 1, _ = -p.sourceEvent.deltaY * (p.sourceEvent.deltaMode === 1 ? 0.05 : p.sourceEvent.deltaMode ? 1 : 2e-3) * u, C = x[2] * Math.pow(2, _ * N);
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
      ], _ = [N[0] - v[0], N[1] - v[1]];
      v = N;
      const C = o() * Math.max(x[2], Math.log(x[2])) * (h ? -1 : 1), k = {
        x: x[0] - _[0] * C,
        y: x[1] - _[1] * C
      }, I = [
        [0, 0],
        [c, l]
      ];
      t.setViewportConstrained({
        x: k.x,
        y: k.y,
        zoom: x[2]
      }, I, a);
    }, b = ci().on("start", w).on("zoom", f ? m : null).on("zoom.wheel", d ? g : null);
    r.call(b, {});
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
}), Mn = ({ x: e, y: t, zoom: n }) => dn.translate(e, t).scale(n), Ve = (e, t) => e.target.closest(`.${t}`), Hi = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), Gd = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, In = (e, t = 0, n = Gd, o = () => {
}) => {
  const r = typeof t == "number" && t > 0;
  return r || o(), r ? e.transition().duration(t).ease(n).on("end", o) : e;
}, Ri = (e) => {
  const t = e.ctrlKey && Nt() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
};
function Ud({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: o, panOnScrollMode: r, panOnScrollSpeed: i, zoomOnPinch: s, onPanZoomStart: a, onPanZoom: c, onPanZoomEnd: l }) {
  return (u) => {
    if (Ve(u, t))
      return u.ctrlKey && u.preventDefault(), !1;
    u.preventDefault(), u.stopImmediatePropagation();
    const f = n.property("__zoom").k || 1;
    if (u.ctrlKey && s) {
      const w = ge(u), m = Ri(u), b = f * Math.pow(2, m);
      o.scaleTo(n, b, w, u);
      return;
    }
    const d = u.deltaMode === 1 ? 20 : 1;
    let h = r === Ge.Vertical ? 0 : u.deltaX * d, g = r === Ge.Horizontal ? 0 : u.deltaY * d;
    !Nt() && u.shiftKey && r !== Ge.Vertical && (h = u.deltaY * d, g = 0), o.translateBy(
      n,
      -(h / f) * i,
      -(g / f) * i,
      // @ts-ignore
      { internal: !0 }
    );
    const v = gn(n.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? c?.(u, v) : (e.isPanScrolling = !0, a?.(u, v)), e.panScrollTimeout = setTimeout(() => {
      l?.(u, v), e.isPanScrolling = !1;
    }, 150);
  };
}
function Kd({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
  return function(o, r) {
    const i = o.type === "wheel", s = !t && i && !o.ctrlKey, a = Ve(o, e);
    if (o.ctrlKey && i && a && o.preventDefault(), s || a)
      return null;
    o.preventDefault(), n.call(this, o, r);
  };
}
function Qd({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
  return (o) => {
    if (o.sourceEvent?.internal)
      return;
    const r = gn(o.transform);
    e.mouseButton = o.sourceEvent?.button || 0, e.isZoomingOrPanning = !0, e.prevViewport = r, o.sourceEvent?.type === "mousedown" && t(!0), n && n?.(o.sourceEvent, r);
  };
}
function Jd({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: o, onPanZoom: r }) {
  return (i) => {
    e.usedRightMouseButton = !!(n && Hi(t, e.mouseButton ?? 0)), i.sourceEvent?.sync || o([i.transform.x, i.transform.y, i.transform.k]), r && !i.sourceEvent?.internal && r?.(i.sourceEvent, gn(i.transform));
  };
}
function jd({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: o, onPanZoomEnd: r, onPaneContextMenu: i }) {
  return (s) => {
    if (!s.sourceEvent?.internal && (e.isZoomingOrPanning = !1, i && Hi(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && s.sourceEvent && i(s.sourceEvent), e.usedRightMouseButton = !1, o(!1), r)) {
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
function ef({ panActivationKeyPressed: e, zoomActivationKeyPressed: t, zoomOnScroll: n, zoomOnPinch: o, panOnDrag: r, panOnScroll: i, zoomOnDoubleClick: s, userSelectionActive: a, noWheelClassName: c, noPanClassName: l, lib: u, connectionInProgress: f }) {
  return (d) => {
    const h = t || n, g = o && d.ctrlKey, v = d.type === "wheel";
    if (d.button === 1 && d.type === "mousedown" && (Ve(d, `${u}-flow__node`) || Ve(d, `${u}-flow__edge`) || Ve(d, `${u}-flow__selection`) || Ve(d, `${u}-flow__nodesselection`)))
      return !0;
    if (!r && !h && !i && !s && !o || a || f && !v || Ve(d, c) && v || Ve(d, l) && (!v || i && v && !t) || !o && d.ctrlKey && v)
      return !1;
    if (!o && d.type === "touchstart" && d.touches?.length > 1)
      return d.preventDefault(), !1;
    if (!h && !i && !g && v || !r && (d.type === "mousedown" || d.type === "touchstart") || Array.isArray(r) && !r.includes(d.button) && d.type === "mousedown")
      return !1;
    const w = Array.isArray(r) && r.includes(d.button) || !d.button || d.button <= 1;
    return (!d.ctrlKey || v || e) && w;
  };
}
function tf({ domNode: e, minZoom: t, maxZoom: n, translateExtent: o, viewport: r, onPanZoom: i, onPanZoomStart: s, onPanZoomEnd: a, onDraggingChange: c }) {
  const l = {
    isZoomingOrPanning: !1,
    usedRightMouseButton: !1,
    prevViewport: {},
    mouseButton: 0,
    timerId: void 0,
    panScrollTimeout: void 0,
    isPanScrolling: !1
  }, u = e.getBoundingClientRect();
  let f = [
    [0, 0],
    [u.width, u.height]
  ];
  (typeof ResizeObserver < "u" ? new ResizeObserver((z) => {
    const y = z[0];
    y && (f = [
      [0, 0],
      [y.contentRect.width, y.contentRect.height]
    ]);
  }) : null)?.observe(e);
  const h = ci().extent(() => f).scaleExtent([t, n]).translateExtent(o), g = de(e).call(h);
  x({
    x: r.x,
    y: r.y,
    zoom: at(r.zoom, t, n)
  }, [
    [0, 0],
    [u.width, u.height]
  ], o);
  const v = g.on("wheel.zoom"), w = g.on("dblclick.zoom");
  h.wheelDelta(Ri);
  async function m(z, y) {
    return g ? new Promise((S) => {
      h?.interpolate(y?.interpolate === "linear" ? mt : Xt).transform(In(g, y?.duration, y?.ease, () => S(!0)), z);
    }) : !1;
  }
  function b({ noWheelClassName: z, noPanClassName: y, onPaneContextMenu: S, userSelectionActive: E, panOnScroll: M, panOnDrag: A, panOnScrollMode: $, panOnScrollSpeed: R, preventScrolling: H, zoomOnPinch: O, zoomOnScroll: W, zoomOnDoubleClick: B, panActivationKeyPressed: q = !1, zoomActivationKeyPressed: Q, lib: Z, onTransformChange: D, connectionInProgress: F, paneClickDistance: K, selectionOnDrag: U }) {
    E && !l.isZoomingOrPanning && p();
    const X = M && !Q && !E;
    h.clickDistance(U ? 1 / 0 : !me(K) || K < 0 ? 0 : K);
    const G = X ? Ud({
      zoomPanValues: l,
      noWheelClassName: z,
      d3Selection: g,
      d3Zoom: h,
      panOnScrollMode: $,
      panOnScrollSpeed: R,
      zoomOnPinch: O,
      onPanZoomStart: s,
      onPanZoom: i,
      onPanZoomEnd: a
    }) : Kd({
      noWheelClassName: z,
      preventScrolling: H,
      d3ZoomHandler: v
    });
    g.on("wheel.zoom", G, { passive: !1 });
    const J = Qd({
      zoomPanValues: l,
      onDraggingChange: c,
      onPanZoomStart: s
    });
    h.on("start", J);
    const j = Jd({
      zoomPanValues: l,
      panOnDrag: A,
      onPaneContextMenu: !!S,
      onPanZoom: i,
      onTransformChange: D
    });
    h.on("zoom", j);
    const ne = jd({
      zoomPanValues: l,
      panOnDrag: A,
      panOnScroll: M,
      onPaneContextMenu: S,
      onPanZoomEnd: a,
      onDraggingChange: c
    });
    h.on("end", ne);
    const ce = ef({
      panActivationKeyPressed: q,
      zoomActivationKeyPressed: Q,
      panOnDrag: A,
      zoomOnScroll: W,
      panOnScroll: M,
      zoomOnDoubleClick: B,
      zoomOnPinch: O,
      userSelectionActive: E,
      noPanClassName: y,
      noWheelClassName: z,
      lib: Z,
      connectionInProgress: F
    });
    h.filter(ce), B ? g.on("dblclick.zoom", w) : g.on("dblclick.zoom", null);
  }
  function p() {
    h.on("zoom", null);
  }
  async function x(z, y, S) {
    const E = Mn(z), M = h?.constrain()(E, y, S);
    return M && await m(M), M;
  }
  async function N(z, y) {
    const S = Mn(z);
    return await m(S, y), S;
  }
  function _(z) {
    if (g) {
      const y = Mn(z), S = g.property("__zoom");
      (S.k !== z.zoom || S.x !== z.x || S.y !== z.y) && h?.transform(g, y, null, { sync: !0 });
    }
  }
  function C() {
    const z = g ? ai(g.node()) : { x: 0, y: 0, k: 1 };
    return { x: z.x, y: z.y, zoom: z.k };
  }
  async function k(z, y) {
    return g ? new Promise((S) => {
      h?.interpolate(y?.interpolate === "linear" ? mt : Xt).scaleTo(In(g, y?.duration, y?.ease, () => S(!0)), z);
    }) : !1;
  }
  async function I(z, y) {
    return g ? new Promise((S) => {
      h?.interpolate(y?.interpolate === "linear" ? mt : Xt).scaleBy(In(g, y?.duration, y?.ease, () => S(!0)), z);
    }) : !1;
  }
  function V(z) {
    h?.scaleExtent(z);
  }
  function P(z) {
    h?.translateExtent(z);
  }
  function L(z) {
    const y = !me(z) || z < 0 ? 0 : z;
    h?.clickDistance(y);
  }
  return {
    update: b,
    destroy: p,
    setViewport: N,
    setViewportConstrained: x,
    getViewport: C,
    scaleTo: k,
    scaleBy: I,
    setScaleExtent: V,
    setTranslateExtent: P,
    syncViewport: _,
    setClickDistance: L
  };
}
var lt;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(lt || (lt = {}));
function nf({ width: e, prevWidth: t, height: n, prevHeight: o, affectsX: r, affectsY: i }) {
  const s = e - t, a = n - o, c = [s > 0 ? 1 : s < 0 ? -1 : 0, a > 0 ? 1 : a < 0 ? -1 : 0];
  return s && r && (c[0] = c[0] * -1), a && i && (c[1] = c[1] * -1), c;
}
function er(e) {
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
function tr(e, t) {
  return e ? !t : t;
}
function of(e, t, n, o, r, i, s, a) {
  let { affectsX: c, affectsY: l } = t;
  const { isHorizontal: u, isVertical: f } = t, d = u && f, { xSnapped: h, ySnapped: g } = n, { minWidth: v, maxWidth: w, minHeight: m, maxHeight: b } = o, { x: p, y: x, width: N, height: _, aspectRatio: C } = e;
  let k = Math.floor(u ? h - e.pointerX : 0), I = Math.floor(f ? g - e.pointerY : 0);
  const V = N + (c ? -k : k), P = _ + (l ? -I : I), L = -i[0] * N, z = -i[1] * _;
  let y = Vt(V, v, w), S = Vt(P, m, b);
  if (s) {
    let A = 0, $ = 0;
    c && k < 0 ? A = Re(p + k + L, s[0][0]) : !c && k > 0 && (A = Le(p + V + L, s[1][0])), l && I < 0 ? $ = Re(x + I + z, s[0][1]) : !l && I > 0 && ($ = Le(x + P + z, s[1][1])), y = Math.max(y, A), S = Math.max(S, $);
  }
  if (a) {
    let A = 0, $ = 0;
    c && k > 0 ? A = Le(p + k, a[0][0]) : !c && k < 0 && (A = Re(p + V, a[1][0])), l && I > 0 ? $ = Le(x + I, a[0][1]) : !l && I < 0 && ($ = Re(x + P, a[1][1])), y = Math.max(y, A), S = Math.max(S, $);
  }
  if (r) {
    if (u) {
      const A = Vt(V / C, m, b) * C;
      if (y = Math.max(y, A), s) {
        let $ = 0;
        !c && !l || c && !l && d ? $ = Le(x + z + V / C, s[1][1]) * C : $ = Re(x + z + (c ? k : -k) / C, s[0][1]) * C, y = Math.max(y, $);
      }
      if (a) {
        let $ = 0;
        !c && !l || c && !l && d ? $ = Re(x + V / C, a[1][1]) * C : $ = Le(x + (c ? k : -k) / C, a[0][1]) * C, y = Math.max(y, $);
      }
    }
    if (f) {
      const A = Vt(P * C, v, w) / C;
      if (S = Math.max(S, A), s) {
        let $ = 0;
        !c && !l || l && !c && d ? $ = Le(p + P * C + L, s[1][0]) / C : $ = Re(p + (l ? I : -I) * C + L, s[0][0]) / C, S = Math.max(S, $);
      }
      if (a) {
        let $ = 0;
        !c && !l || l && !c && d ? $ = Re(p + P * C, a[1][0]) / C : $ = Le(p + (l ? I : -I) * C, a[0][0]) / C, S = Math.max(S, $);
      }
    }
  }
  I = I + (I < 0 ? S : -S), k = k + (k < 0 ? y : -y), r && (d ? V > P * C ? I = (tr(c, l) ? -k : k) / C : k = (tr(c, l) ? -I : I) * C : u ? (I = k / C, l = c) : (k = I * C, c = l));
  const E = c ? p + k : p, M = l ? x + I : x;
  return {
    width: N + (c ? -k : k),
    height: _ + (l ? -I : I),
    x: i[0] * k * (c ? -1 : 1) + E,
    y: i[1] * I * (l ? -1 : 1) + M
  };
}
const Li = { width: 0, height: 0, x: 0, y: 0 }, rf = {
  ...Li,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function sf(e, t, n) {
  const o = t.position.x + e.position.x, r = t.position.y + e.position.y, i = e.measured.width ?? 0, s = e.measured.height ?? 0, a = n[0] * i, c = n[1] * s;
  return [
    [o - a, r - c],
    [o + i - a, r + s - c]
  ];
}
function af({ domNode: e, nodeId: t, getStoreItems: n, onChange: o, onEnd: r }) {
  const i = de(e);
  let s = {
    controlDirection: er("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function a({ controlPosition: l, boundaries: u, keepAspectRatio: f, resizeDirection: d, onResizeStart: h, onResize: g, onResizeEnd: v, shouldResize: w }) {
    let m = { ...Li }, b = { ...rf };
    s = {
      boundaries: u,
      resizeDirection: d,
      keepAspectRatio: f,
      controlDirection: er(l)
    };
    let p, x = null, N = [], _, C, k;
    const I = qr().on("start", (V) => {
      const { nodeLookup: P, transform: L, snapGrid: z, snapToGrid: y, nodeOrigin: S, paneDomNode: E } = n();
      if (p = P.get(t), !p)
        return;
      x = E?.getBoundingClientRect() ?? null;
      const { xSnapped: M, ySnapped: A } = yt(V.sourceEvent, {
        transform: L,
        snapGrid: z,
        snapToGrid: y,
        containerBounds: x
      });
      m = {
        width: p.measured.width ?? 0,
        height: p.measured.height ?? 0,
        x: p.position.x ?? 0,
        y: p.position.y ?? 0
      }, b = {
        ...m,
        pointerX: M,
        pointerY: A,
        aspectRatio: m.width / m.height
      }, _ = void 0, C = Je(p.extent) ? p.extent : void 0, p.parentId && (p.extent === "parent" || p.expandParent) && (_ = P.get(p.parentId)), _ && p.extent === "parent" && (C = [
        [0, 0],
        [_.measured.width, _.measured.height]
      ]), N = [], k = void 0;
      for (const [$, R] of P)
        if (R.parentId === t && (N.push({
          id: $,
          position: { ...R.position },
          extent: R.extent
        }), R.extent === "parent" || R.expandParent)) {
          const H = sf(R, p, R.origin ?? S);
          k ? k = [
            [Math.min(H[0][0], k[0][0]), Math.min(H[0][1], k[0][1])],
            [Math.max(H[1][0], k[1][0]), Math.max(H[1][1], k[1][1])]
          ] : k = H;
        }
      h?.(V, { ...m });
    }).on("drag", (V) => {
      const { transform: P, snapGrid: L, snapToGrid: z, nodeOrigin: y } = n(), S = yt(V.sourceEvent, {
        transform: P,
        snapGrid: L,
        snapToGrid: z,
        containerBounds: x
      }), E = [];
      if (!p)
        return;
      const { x: M, y: A, width: $, height: R } = m, H = {}, O = p.origin ?? y, { width: W, height: B, x: q, y: Q } = of(b, s.controlDirection, S, s.boundaries, s.keepAspectRatio, O, C, k), Z = W !== $, D = B !== R, F = q !== M && Z, K = Q !== A && D;
      if (!F && !K && !Z && !D)
        return;
      const U = {
        prevValues: { ...m },
        startX: b.x,
        startY: b.y,
        childNodes: N.map((j) => ({
          ...j,
          position: { ...j.position }
        }))
      };
      if ((F || K || O[0] === 1 || O[1] === 1) && (H.x = F ? q : m.x, H.y = K ? Q : m.y, m.x = H.x, m.y = H.y, N.length > 0)) {
        const j = q - M, ne = Q - A;
        for (const ce of N)
          ce.position = {
            x: ce.position.x - j + O[0] * (W - $),
            y: ce.position.y - ne + O[1] * (B - R)
          }, E.push(ce);
      }
      if ((Z || D) && (H.width = Z && (!s.resizeDirection || s.resizeDirection === "horizontal") ? W : m.width, H.height = D && (!s.resizeDirection || s.resizeDirection === "vertical") ? B : m.height, m.width = H.width, m.height = H.height), _ && p.expandParent) {
        const j = O[0] * (H.width ?? 0);
        H.x && H.x < j && (m.x = j, b.x = b.x - (H.x - j));
        const ne = O[1] * (H.height ?? 0);
        H.y && H.y < ne && (m.y = ne, b.y = b.y - (H.y - ne));
      }
      const X = nf({
        width: m.width,
        prevWidth: $,
        height: m.height,
        prevHeight: R,
        affectsX: s.controlDirection.affectsX,
        affectsY: s.controlDirection.affectsY
      }), G = { ...m, direction: X };
      if (w?.(V, G) === !1) {
        m = U.prevValues, b.x = U.startX, b.y = U.startY, N.forEach((j, ne) => {
          j.position = U.childNodes[ne].position;
        });
        return;
      }
      g?.(V, G), o(H, E);
    }).on("end", (V) => {
      v?.(V, { ...m }), r?.({ ...m });
    });
    i.call(I);
  }
  function c() {
    i.on(".drag", null);
  }
  return {
    update: a,
    destroy: c
  };
}
var kn = { exports: {} }, An = {};
const Vi = /* @__PURE__ */ Ea(Na);
var $n = { exports: {} }, Pn = {};
var nr;
function cf() {
  if (nr) return Pn;
  nr = 1;
  var e = Vi;
  function t(f, d) {
    return f === d && (f !== 0 || 1 / f === 1 / d) || f !== f && d !== d;
  }
  var n = typeof Object.is == "function" ? Object.is : t, o = e.useState, r = e.useEffect, i = e.useLayoutEffect, s = e.useDebugValue;
  function a(f, d) {
    var h = d(), g = o({ inst: { value: h, getSnapshot: d } }), v = g[0].inst, w = g[1];
    return i(
      function() {
        v.value = h, v.getSnapshot = d, c(v) && w({ inst: v });
      },
      [f, h, d]
    ), r(
      function() {
        return c(v) && w({ inst: v }), f(function() {
          c(v) && w({ inst: v });
        });
      },
      [f]
    ), s(h), h;
  }
  function c(f) {
    var d = f.getSnapshot;
    f = f.value;
    try {
      var h = d();
      return !n(f, h);
    } catch {
      return !0;
    }
  }
  function l(f, d) {
    return d();
  }
  var u = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? l : a;
  return Pn.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : u, Pn;
}
var or;
function lf() {
  return or || (or = 1, $n.exports = cf()), $n.exports;
}
var rr;
function uf() {
  if (rr) return An;
  rr = 1;
  var e = Vi, t = lf();
  function n(l, u) {
    return l === u && (l !== 0 || 1 / l === 1 / u) || l !== l && u !== u;
  }
  var o = typeof Object.is == "function" ? Object.is : n, r = t.useSyncExternalStore, i = e.useRef, s = e.useEffect, a = e.useMemo, c = e.useDebugValue;
  return An.useSyncExternalStoreWithSelector = function(l, u, f, d, h) {
    var g = i(null);
    if (g.current === null) {
      var v = { hasValue: !1, value: null };
      g.current = v;
    } else v = g.current;
    g = a(
      function() {
        function m(_) {
          if (!b) {
            if (b = !0, p = _, _ = d(_), h !== void 0 && v.hasValue) {
              var C = v.value;
              if (h(C, _))
                return x = C;
            }
            return x = _;
          }
          if (C = x, o(p, _)) return C;
          var k = d(_);
          return h !== void 0 && h(C, k) ? (p = _, C) : (p = _, x = k);
        }
        var b = !1, p, x, N = f === void 0 ? null : f;
        return [
          function() {
            return m(u());
          },
          N === null ? void 0 : function() {
            return m(N());
          }
        ];
      },
      [u, f, d, h]
    );
    var w = r(l, g[0], g[1]);
    return s(
      function() {
        v.hasValue = !0, v.value = w;
      },
      [w]
    ), c(w), w;
  }, An;
}
var ir;
function df() {
  return ir || (ir = 1, kn.exports = uf()), kn.exports;
}
var ff = df();
const hf = /* @__PURE__ */ Ca(ff), { useDebugValue: gf } = Ma, { useSyncExternalStoreWithSelector: pf } = hf, mf = (e) => e;
function Oi(e, t = mf, n) {
  const o = pf(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    t,
    n
  );
  return gf(o), o;
}
const sr = (e, t) => {
  const n = Ia(e), o = (r, i = t) => Oi(n, r, i);
  return Object.assign(o, n), o;
}, yf = (e, t) => e ? sr(e, t) : sr;
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
const pn = sn(null), wf = pn.Provider, Bi = be.error001("react");
function ee(e, t) {
  const n = ut(pn);
  if (n === null)
    throw new Error(Bi);
  return Oi(n, e, t);
}
function re() {
  const e = ut(pn);
  if (e === null)
    throw new Error(Bi);
  return xe(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const ar = { display: "none" }, xf = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, Fi = "react-flow__node-desc", Xi = "react-flow__edge-desc", vf = "react-flow__aria-live", bf = (e) => e.ariaLiveMessage, _f = (e) => e.ariaLabelConfig;
function Sf({ rfId: e }) {
  const t = ee(bf);
  return T("div", { id: `${vf}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: xf, children: t });
}
function Ef({ rfId: e, disableKeyboardA11y: t }) {
  const n = ee(_f);
  return le(He, { children: [T("div", { id: `${Fi}-${e}`, style: ar, children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"] }), T("div", { id: `${Xi}-${e}`, style: ar, children: n["edge.a11yDescription.default"] }), !t && T(Sf, { rfId: e })] });
}
const mn = Pr(({ position: e = "top-left", children: t, className: n, style: o, ...r }, i) => {
  const s = `${e}`.split("-");
  return T("div", { className: ae(["react-flow__panel", n, ...s]), style: o, ref: i, ...r, children: t });
});
mn.displayName = "Panel";
const cr = "https://reactflow.dev?utm_source=attribution";
function Nf({ proOptions: e, position: t = "bottom-right" }) {
  return oe(() => {
  }, []), e?.hideAttribution ? null : T(mn, { position: t, className: "react-flow__attribution", "data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${cr}`, children: T("a", { href: cr, target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const Cf = (e) => {
  const t = [], n = [];
  for (const [, o] of e.nodeLookup)
    o.selected && t.push(o.internals.userNode);
  for (const [, o] of e.edgeLookup)
    o.selected && n.push(o);
  return { selectedNodes: t, selectedEdges: n };
}, Ot = (e) => e.id;
function Mf(e, t) {
  return ie(e.selectedNodes.map(Ot), t.selectedNodes.map(Ot)) && ie(e.selectedEdges.map(Ot), t.selectedEdges.map(Ot));
}
function If({ onSelectionChange: e }) {
  const t = re(), { selectedNodes: n, selectedEdges: o } = ee(Cf, Mf);
  return oe(() => {
    const r = { nodes: n, edges: o };
    e?.(r), t.getState().onSelectionChangeHandlers.forEach((i) => i(r));
  }, [n, o, e]), null;
}
const kf = (e) => !!e.onSelectionChangeHandlers;
function Af({ onSelectionChange: e }) {
  const t = ee(kf);
  return e || t ? T(If, { onSelectionChange: e }) : null;
}
const Yi = [0, 0], $f = { x: 0, y: 0, zoom: 1 }, Pf = [
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
], lr = [...Pf, "rfId"], Df = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), ur = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: _t,
  nodeOrigin: Yi,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function Tf(e) {
  const { setNodes: t, setEdges: n, setMinZoom: o, setMaxZoom: r, setTranslateExtent: i, setNodeExtent: s, reset: a, setDefaultNodesAndEdges: c } = ee(Df, ie), l = re();
  oe(() => (c(e.defaultNodes, e.defaultEdges), () => {
    u.current = ur, a();
  }), []);
  const u = te(ur);
  return oe(
    () => {
      for (const f of lr) {
        const d = e[f], h = u.current[f];
        d !== h && (typeof e[f] > "u" || (f === "nodes" ? t(d) : f === "edges" ? n(d) : f === "minZoom" ? o(d) : f === "maxZoom" ? r(d) : f === "translateExtent" ? i(d) : f === "nodeExtent" ? s(d) : f === "ariaLabelConfig" ? l.setState({ ariaLabelConfig: xd(d) }) : f === "fitView" ? l.setState({ fitViewQueued: d }) : f === "fitViewOptions" ? l.setState({ fitViewOptions: d }) : l.setState({ [f]: d })));
      }
      u.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    lr.map((f) => e[f])
  ), null;
}
function dr() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function zf(e) {
  const [t, n] = ve(e === "system" ? null : e);
  return oe(() => {
    if (e !== "system") {
      n(e);
      return;
    }
    const o = dr(), r = () => n(o?.matches ? "dark" : "light");
    return r(), o?.addEventListener("change", r), () => {
      o?.removeEventListener("change", r);
    };
  }, [e]), t !== null ? t : dr()?.matches ? "dark" : "light";
}
const fr = typeof document < "u" ? document : null;
function Ct(e = null, t = { target: fr, actInsideInputWithModifier: !0 }) {
  const [n, o] = ve(!1), r = te(!1), i = te(/* @__PURE__ */ new Set([])), [s, a] = xe(() => {
    if (e !== null) {
      const l = (Array.isArray(e) ? e : [e]).filter((f) => typeof f == "string").map((f) => f.replace(/\+/g, `
`).replace(`

`, `
+`).split(`
`)), u = l.reduce((f, d) => f.concat(...d), []);
      return [l, u];
    }
    return [[], []];
  }, [e]);
  return oe(() => {
    const c = t?.target ?? fr, l = t?.actInsideInputWithModifier ?? !0;
    if (e !== null) {
      const u = (h) => {
        if (r.current = h.ctrlKey || h.metaKey || h.shiftKey || h.altKey, (!r.current || r.current && !l) && _i(h))
          return !1;
        const v = gr(h.code, a);
        if (i.current.add(h[v]), hr(s, i.current, !1)) {
          const w = h.composedPath?.()?.[0] || h.target, m = w?.nodeName === "BUTTON" || w?.nodeName === "A";
          t.preventDefault !== !1 && (r.current || !m) && h.preventDefault(), o(!0);
        }
      }, f = (h) => {
        const g = gr(h.code, a);
        hr(s, i.current, !0) ? (o(!1), i.current.clear()) : i.current.delete(h[g]), h.key === "Meta" && i.current.clear(), r.current = !1;
      }, d = () => {
        i.current.clear(), o(!1);
      };
      return c?.addEventListener("keydown", u), c?.addEventListener("keyup", f), window.addEventListener("blur", d), window.addEventListener("contextmenu", d), () => {
        c?.removeEventListener("keydown", u), c?.removeEventListener("keyup", f), window.removeEventListener("blur", d), window.removeEventListener("contextmenu", d);
      };
    }
  }, [e, o]), n;
}
function hr(e, t, n) {
  return e.filter((o) => n || o.length === t.size).some((o) => o.every((r) => t.has(r)));
}
function gr(e, t) {
  return t.includes(e) ? "code" : "key";
}
const Hf = () => {
  const e = re();
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
      const { width: o, height: r, minZoom: i, maxZoom: s, panZoom: a } = e.getState(), c = so(t, o, r, i, s, n?.padding ?? 0.1);
      return a ? (await a.setViewport(c, {
        duration: n?.duration,
        ease: n?.ease,
        interpolate: n?.interpolate
      }), !0) : !1;
    },
    screenToFlowPosition: (t, n = {}) => {
      const { transform: o, snapGrid: r, snapToGrid: i, domNode: s } = e.getState();
      if (!s)
        return t;
      const { x: a, y: c } = s.getBoundingClientRect(), l = {
        x: t.x - a,
        y: t.y - c
      }, u = n.snapGrid ?? r, f = n.snapToGrid ?? i;
      return Pt(l, o, f, u);
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
function Zi(e, t) {
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
    for (const c of s)
      Rf(c, a);
    n.push(a);
  }
  return r.length && r.forEach((i) => {
    i.index !== void 0 ? n.splice(i.index, 0, { ...i.item }) : n.push({ ...i.item });
  }), n;
}
function Rf(e, t) {
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
function Lf(e, t) {
  return Zi(e, t);
}
function Vf(e, t) {
  return Zi(e, t);
}
function Ze(e, t) {
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
    !(i.selected === void 0 && !s) && i.selected !== s && (n && (i.selected = s), o.push(Ze(i.id, s)));
  }
  return o;
}
function pr({ items: e = [], lookup: t }) {
  const n = [], o = new Map(e.map((r) => [r.id, r]));
  for (const [r, i] of e.entries()) {
    const s = t.get(i.id), a = s?.internals?.userNode ?? s;
    a !== void 0 && a !== i && n.push({ id: i.id, item: i, type: "replace" }), a === void 0 && n.push({ item: i, type: "add", index: r });
  }
  for (const [r] of t)
    o.get(r) === void 0 && n.push({ id: r, type: "remove" });
  return n;
}
function mr(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const Of = yi();
function Bf(e, t, n = {}) {
  return Nd(e, t, {
    ...n,
    onError: n.onError ?? Of
  });
}
const yr = (e) => ud(e), Ff = (e) => fi(e);
function Wi(e) {
  return Pr(e);
}
const qi = typeof window < "u" ? ka : oe;
function wr(e) {
  const [t, n] = ve(BigInt(0)), [o] = ve(() => Xf(() => n((r) => r + BigInt(1))));
  return qi(() => {
    const r = o.get();
    r.length && (e(r), o.reset());
  }, [t]), o;
}
function Xf(e) {
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
const Gi = sn(null);
function Yf({ children: e }) {
  const t = re(), n = we((a) => {
    const { nodes: c = [], setNodes: l, hasDefaultNodes: u, onNodesChange: f, nodeLookup: d, fitViewQueued: h, onNodesChangeMiddlewareMap: g } = t.getState();
    let v = c;
    for (const m of a)
      v = typeof m == "function" ? m(v) : m;
    let w = pr({
      items: v,
      lookup: d
    });
    for (const m of g.values())
      w = m(w);
    u && l(v), w.length > 0 ? f?.(w) : h && window.requestAnimationFrame(() => {
      const { fitViewQueued: m, nodes: b, setNodes: p } = t.getState();
      m && p(b);
    });
  }, []), o = wr(n), r = we((a) => {
    const { edges: c = [], setEdges: l, hasDefaultEdges: u, onEdgesChange: f, edgeLookup: d } = t.getState();
    let h = c;
    for (const g of a)
      h = typeof g == "function" ? g(h) : g;
    u ? l(h) : f && f(pr({
      items: h,
      lookup: d
    }));
  }, []), i = wr(r), s = xe(() => ({ nodeQueue: o, edgeQueue: i }), []);
  return T(Gi.Provider, { value: s, children: e });
}
function Zf() {
  const e = ut(Gi);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const Wf = (e) => !!e.panZoom;
function go() {
  const e = Hf(), t = re(), n = Zf(), o = ee(Wf), r = xe(() => {
    const i = (f) => t.getState().nodeLookup.get(f), s = (f) => {
      n.nodeQueue.push(f);
    }, a = (f) => {
      n.edgeQueue.push(f);
    }, c = (f) => {
      const { nodeLookup: d, nodeOrigin: h } = t.getState(), g = yr(f) ? f : d.get(f.id), v = g.parentId ? xi(g.position, g.measured, g.parentId, d, h) : g.position, w = {
        ...g,
        position: v,
        width: g.measured?.width ?? g.width,
        height: g.measured?.height ?? g.height
      };
      return Et(w);
    }, l = (f, d, h = { replace: !1 }) => {
      s((g) => g.map((v) => {
        if (v.id === f) {
          const w = typeof d == "function" ? d(v) : d;
          return h.replace && yr(w) ? w : { ...v, ...w };
        }
        return v;
      }));
    }, u = (f, d, h = { replace: !1 }) => {
      a((g) => g.map((v) => {
        if (v.id === f) {
          const w = typeof d == "function" ? d(v) : d;
          return h.replace && Ff(w) ? w : { ...v, ...w };
        }
        return v;
      }));
    };
    return {
      getNodes: () => t.getState().nodes.map((f) => ({ ...f })),
      getNode: (f) => i(f)?.internals.userNode,
      getInternalNode: i,
      getEdges: () => {
        const { edges: f = [] } = t.getState();
        return f.map((d) => ({ ...d }));
      },
      getEdge: (f) => t.getState().edgeLookup.get(f),
      setNodes: s,
      setEdges: a,
      addNodes: (f) => {
        const d = Array.isArray(f) ? f : [f];
        n.nodeQueue.push((h) => [...h, ...d]);
      },
      addEdges: (f) => {
        const d = Array.isArray(f) ? f : [f];
        n.edgeQueue.push((h) => [...h, ...d]);
      },
      toObject: () => {
        const { nodes: f = [], edges: d = [], transform: h } = t.getState(), [g, v, w] = h;
        return {
          nodes: f.map((m) => ({ ...m })),
          edges: d.map((m) => ({ ...m })),
          viewport: {
            x: g,
            y: v,
            zoom: w
          }
        };
      },
      deleteElements: async ({ nodes: f = [], edges: d = [] }) => {
        const { nodes: h, edges: g, onNodesDelete: v, onEdgesDelete: w, triggerNodeChanges: m, triggerEdgeChanges: b, onDelete: p, onBeforeDelete: x } = t.getState(), { nodes: N, edges: _ } = await pd({
          nodesToRemove: f,
          edgesToRemove: d,
          nodes: h,
          edges: g,
          onBeforeDelete: x
        }), C = _.length > 0, k = N.length > 0;
        if (C) {
          const I = _.map(mr);
          w?.(_), b(I);
        }
        if (k) {
          const I = N.map(mr);
          v?.(N), m(I);
        }
        return (k || C) && p?.({ nodes: N, edges: _ }), { deletedNodes: N, deletedEdges: _ };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (f, d = !0, h) => {
        const g = Xo(f), v = g ? f : c(f), w = h !== void 0;
        return v ? (h || t.getState().nodes).filter((m) => {
          const b = t.getState().nodeLookup.get(m.id);
          if (b && !g && (m.id === f.id || !b.internals.positionAbsolute))
            return !1;
          const p = Et(w ? m : b), x = nn(p, v);
          return d && x > 0 || x >= p.width * p.height || x >= v.width * v.height;
        }) : [];
      },
      isNodeIntersecting: (f, d, h = !0) => {
        const v = Xo(f) ? f : c(f);
        if (!v)
          return !1;
        const w = nn(v, d);
        return h && w > 0 || w >= d.width * d.height || w >= v.width * v.height;
      },
      updateNode: l,
      updateNodeData: (f, d, h = { replace: !1 }) => {
        l(f, (g) => {
          const v = typeof d == "function" ? d(g) : d;
          return h.replace ? { ...g, data: v } : { ...g, data: { ...g.data, ...v } };
        }, h);
      },
      updateEdge: u,
      updateEdgeData: (f, d, h = { replace: !1 }) => {
        u(f, (g) => {
          const v = typeof d == "function" ? d(g) : d;
          return h.replace ? { ...g, data: v } : { ...g, data: { ...g.data, ...v } };
        }, h);
      },
      getNodesBounds: (f) => {
        const { nodeLookup: d, nodeOrigin: h } = t.getState();
        return dd(f, { nodeLookup: d, nodeOrigin: h });
      },
      getHandleConnections: ({ type: f, id: d, nodeId: h }) => Array.from(t.getState().connectionLookup.get(`${h}-${f}${d ? `-${d}` : ""}`)?.values() ?? []),
      getNodeConnections: ({ type: f, handleId: d, nodeId: h }) => Array.from(t.getState().connectionLookup.get(`${h}${f ? d ? `-${f}-${d}` : `-${f}` : ""}`)?.values() ?? []),
      fitView: async (f) => {
        const d = t.getState().fitViewResolver ?? wd();
        return t.setState({ fitViewQueued: !0, fitViewOptions: f, fitViewResolver: d }), n.nodeQueue.push((h) => [...h]), d.promise;
      }
    };
  }, []);
  return xe(() => ({
    ...r,
    ...e,
    viewportInitialized: o
  }), [o]);
}
const xr = (e) => e.selected, qf = typeof window < "u" ? window : void 0;
function Gf({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
  const n = re(), { deleteElements: o } = go(), r = Ct(e, { actInsideInputWithModifier: !1 }), i = Ct(t, { target: qf });
  oe(() => {
    if (r) {
      const { edges: s, nodes: a } = n.getState();
      o({ nodes: a.filter(xr), edges: s.filter(xr) }), n.setState({ nodesSelectionActive: !1 });
    }
  }, [r]), oe(() => {
    n.setState({ multiSelectionActive: i });
  }, [i]);
}
function Uf(e) {
  const t = re();
  oe(() => {
    const n = () => {
      if (!e.current || !(e.current.checkVisibility?.() ?? !0))
        return !1;
      const o = ao(e.current);
      (o.height === 0 || o.width === 0) && t.getState().onError?.("004", be.error004()), t.setState({ width: o.width || 500, height: o.height || 500 });
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
}, Kf = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function Qf({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: o = !1, panActivationKeyPressed: r, panOnScrollSpeed: i = 0.5, panOnScrollMode: s = Ge.Free, zoomOnDoubleClick: a = !0, panOnDrag: c = !0, defaultViewport: l, translateExtent: u, minZoom: f, maxZoom: d, zoomActivationKeyCode: h, preventScrolling: g = !0, children: v, noWheelClassName: w, noPanClassName: m, onViewportChange: b, isControlledViewport: p, paneClickDistance: x, selectionOnDrag: N }) {
  const _ = re(), C = te(null), { userSelectionActive: k, lib: I, connectionInProgress: V } = ee(Kf, ie), P = Ct(h), L = te();
  Uf(C);
  const z = we((y) => {
    b?.({ x: y[0], y: y[1], zoom: y[2] }), p || _.setState({ transform: y });
  }, [b, p]);
  return oe(() => {
    if (C.current) {
      L.current = tf({
        domNode: C.current,
        minZoom: f,
        maxZoom: d,
        translateExtent: u,
        viewport: l,
        onDraggingChange: (M) => _.setState((A) => A.paneDragging === M ? A : { paneDragging: M }),
        onPanZoomStart: (M, A) => {
          const { onViewportChangeStart: $, onMoveStart: R } = _.getState();
          R?.(M, A), $?.(A);
        },
        onPanZoom: (M, A) => {
          const { onViewportChange: $, onMove: R } = _.getState();
          R?.(M, A), $?.(A);
        },
        onPanZoomEnd: (M, A) => {
          const { onViewportChangeEnd: $, onMoveEnd: R } = _.getState();
          R?.(M, A), $?.(A);
        }
      });
      const { x: y, y: S, zoom: E } = L.current.getViewport();
      return _.setState({
        panZoom: L.current,
        transform: [y, S, E],
        domNode: C.current.closest(".react-flow")
      }), () => {
        L.current?.destroy();
      };
    }
  }, []), oe(() => {
    L.current?.update({
      onPaneContextMenu: e,
      zoomOnScroll: t,
      zoomOnPinch: n,
      panOnScroll: o,
      panActivationKeyPressed: r,
      panOnScrollSpeed: i,
      panOnScrollMode: s,
      zoomOnDoubleClick: a,
      panOnDrag: c,
      zoomActivationKeyPressed: P,
      preventScrolling: g,
      noPanClassName: m,
      userSelectionActive: k,
      noWheelClassName: w,
      lib: I,
      onTransformChange: z,
      connectionInProgress: V,
      selectionOnDrag: N,
      paneClickDistance: x
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
    c,
    P,
    g,
    m,
    k,
    w,
    I,
    z,
    V,
    N,
    x
  ]), T("div", { className: "react-flow__renderer", ref: C, style: yn, children: v });
}
const Jf = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function jf() {
  const { userSelectionActive: e, userSelectionRect: t } = ee(Jf, ie);
  return e && t ? T("div", { className: "react-flow__selection react-flow__container", style: {
    width: t.width,
    height: t.height,
    transform: `translate(${t.x}px, ${t.y}px)`
  } }) : null;
}
const Dn = (e, t) => (n) => {
  n.target === t.current && e?.(n);
}, eh = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  dragging: e.paneDragging,
  panBy: e.panBy,
  autoPanSpeed: e.autoPanSpeed
});
function th({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = St.Full, panOnDrag: o, autoPanOnSelection: r, paneClickDistance: i, selectionOnDrag: s, onSelectionStart: a, onSelectionEnd: c, onPaneClick: l, onPaneContextMenu: u, onPaneScroll: f, onPaneMouseEnter: d, onPaneMouseMove: h, onPaneMouseLeave: g, children: v }) {
  const w = te(0), m = re(), { userSelectionActive: b, elementsSelectable: p, dragging: x, panBy: N, autoPanSpeed: _ } = ee(eh, ie), C = p && (e || b), k = te(null), I = te(), V = te(/* @__PURE__ */ new Set()), P = te(/* @__PURE__ */ new Set()), L = te(!1), z = te(!1), y = te({ x: 0, y: 0 }), S = te(!1), E = (D) => {
    if (z.current || L.current || m.getState().connection.inProgress) {
      z.current = !1, L.current = !1;
      return;
    }
    l?.(D), m.getState().resetSelectedElements(), m.setState({ nodesSelectionActive: !1 });
  }, M = (D) => {
    if (Array.isArray(o) && o?.includes(2)) {
      D.preventDefault();
      return;
    }
    u?.(D);
  }, A = f ? (D) => f(D) : void 0, $ = (D) => {
    z.current && (D.stopPropagation(), z.current = !1);
  }, R = (D) => {
    if (D.pointerType === "touch" && o !== !1 && !t)
      return;
    const { domNode: F, transform: K } = m.getState();
    if (I.current = F?.getBoundingClientRect(), !I.current)
      return;
    const U = D.target === k.current;
    if (!U && !!D.target.closest(".nokey") || !e || !(s && U || t) || D.button !== 0 || !D.isPrimary)
      return;
    D.target?.setPointerCapture?.(D.pointerId), z.current = !1;
    const { x: J, y: j } = ye(D.nativeEvent, I.current), ne = Pt({ x: J, y: j }, K);
    m.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: ne.x,
        startY: ne.y,
        x: J,
        y: j
      }
    }), U || (D.stopPropagation(), D.preventDefault());
  };
  function H(D, F) {
    const { userSelectionRect: K } = m.getState();
    if (!K)
      return;
    const { transform: U, nodeLookup: X, edgeLookup: G, connectionLookup: J, triggerNodeChanges: j, triggerEdgeChanges: ne, defaultEdgeOptions: ce } = m.getState(), ke = { x: K.startX, y: K.startY }, { x: Ee, y: Ne } = ct(ke, U), Ae = {
      startX: ke.x,
      startY: ke.y,
      x: D < Ee ? D : Ee,
      y: F < Ne ? F : Ne,
      width: Math.abs(D - Ee),
      height: Math.abs(F - Ne)
    }, dt = V.current, Fe = P.current;
    V.current = new Set(ro(X, Ae, U, n === St.Partial, !0).map((he) => he.id)), P.current = /* @__PURE__ */ new Set();
    const Xe = ce?.selectable ?? !0;
    for (const he of V.current) {
      const $e = J.get(he);
      if ($e)
        for (const { edgeId: Pe } of $e.values()) {
          const Ye = G.get(Pe);
          Ye && (Ye.selectable ?? Xe) && P.current.add(Pe);
        }
    }
    if (!Yo(dt, V.current)) {
      const he = tt(X, V.current, !0);
      j(he);
    }
    if (!Yo(Fe, P.current)) {
      const he = tt(G, P.current);
      ne(he);
    }
    m.setState({
      userSelectionRect: Ae,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }
  function O() {
    if (!r || !I.current)
      return;
    const [D, F] = io(y.current, I.current, _);
    N({ x: D, y: F }).then((K) => {
      if (!z.current || !K) {
        w.current = requestAnimationFrame(O);
        return;
      }
      const { x: U, y: X } = y.current;
      H(U, X), w.current = requestAnimationFrame(O);
    });
  }
  const W = () => {
    cancelAnimationFrame(w.current), w.current = 0, S.current = !1;
  };
  oe(() => () => W(), []);
  const B = (D) => {
    const { userSelectionRect: F, transform: K, resetSelectedElements: U } = m.getState();
    if (!I.current || !F)
      return;
    const { x: X, y: G } = ye(D.nativeEvent, I.current);
    y.current = { x: X, y: G };
    const J = ct({ x: F.startX, y: F.startY }, K);
    if (!z.current) {
      const j = t ? 0 : i;
      if (Math.hypot(X - J.x, G - J.y) <= j)
        return;
      U(), a?.(D);
    }
    z.current = !0, S.current || (O(), S.current = !0), H(X, G);
  }, q = (D) => {
    if (!C) {
      D.target === k.current && m.getState().connection.inProgress && (L.current = !0);
      return;
    }
    D.button === 0 && (D.target?.releasePointerCapture?.(D.pointerId), !b && D.target === k.current && m.getState().userSelectionRect && E?.(D), m.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), z.current && (c?.(D), m.setState({
      nodesSelectionActive: V.current.size > 0
    })), W());
  }, Q = (D) => {
    D.target?.releasePointerCapture?.(D.pointerId), W();
  }, Z = o === !0 || Array.isArray(o) && o.includes(0);
  return le("div", { className: ae(["react-flow__pane", { draggable: Z, dragging: x, selection: e }]), onClick: C ? void 0 : Dn(E, k), onContextMenu: Dn(M, k), onWheel: Dn(A, k), onPointerEnter: C ? void 0 : d, onPointerMove: C ? B : h, onPointerUp: q, onPointerCancel: C ? Q : void 0, onPointerDownCapture: C ? R : void 0, onClickCapture: C ? $ : void 0, onPointerLeave: g, ref: k, style: yn, children: [v, T(jf, {})] });
}
function Gn({ id: e, store: t, unselect: n = !1, nodeRef: o }) {
  const { addSelectedNodes: r, unselectNodesAndEdges: i, multiSelectionActive: s, nodeLookup: a, onError: c } = t.getState(), l = a.get(e);
  if (!l) {
    c?.("012", be.error012(e));
    return;
  }
  t.setState({ nodesSelectionActive: !1 }), l.selected ? (n || l.selected && s) && (i({ nodes: [l], edges: [] }), requestAnimationFrame(() => o?.current?.blur())) : r([e]);
}
function Ui({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: o, nodeId: r, isSelectable: i, nodeClickDistance: s }) {
  const a = re(), [c, l] = ve(!1), u = te();
  return oe(() => {
    if (!t)
      return u.current = Bd({
        getStoreItems: () => a.getState(),
        onNodeMouseDown: (f) => {
          Gn({
            id: f,
            store: a,
            nodeRef: e
          });
        },
        onDragStart: () => {
          l(!0);
        },
        onDragStop: () => {
          l(!1);
        }
      }), () => {
        u.current?.destroy(), u.current = void 0;
      };
  }, [t, a, e]), oe(() => {
    t || !e.current || !u.current || u.current.update({
      noDragClassName: n,
      handleSelector: o,
      domNode: e.current,
      isSelectable: i,
      nodeId: r,
      nodeClickDistance: s
    });
  }, [n, o, t, i, e, r, s]), c;
}
const nh = (e) => (t) => t.selected && (t.draggable || e && typeof t.draggable > "u");
function Ki() {
  const e = re();
  return we((n) => {
    const { nodeExtent: o, snapToGrid: r, snapGrid: i, nodesDraggable: s, onError: a, updateNodePositions: c, nodeLookup: l, nodeOrigin: u } = e.getState(), f = /* @__PURE__ */ new Map(), d = nh(s), h = r ? i[0] : 5, g = r ? i[1] : 5, v = n.direction.x * h * n.factor, w = n.direction.y * g * n.factor;
    for (const [, m] of l) {
      if (!d(m))
        continue;
      let b = {
        x: m.internals.positionAbsolute.x + v,
        y: m.internals.positionAbsolute.y + w
      };
      r && (b = $t(b, i));
      const { position: p, positionAbsolute: x } = hi({
        nodeId: m.id,
        nextPosition: b,
        nodeLookup: l,
        nodeExtent: o,
        nodeOrigin: u,
        onError: a
      });
      m.position = p, m.internals.positionAbsolute = x, f.set(m.id, m);
    }
    c(f);
  }, []);
}
const po = sn(null), oh = po.Provider;
po.Consumer;
const Qi = () => ut(po), rh = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), Ji = sn(null);
function ih({ children: e }) {
  const t = ee(rh, ie);
  return T(Ji.Provider, { value: t, children: e });
}
function sh() {
  const e = ut(Ji);
  if (!e)
    throw new Error("useHandleConfig must be used within a HandleConfigProvider");
  return e;
}
const ah = {
  connectingFrom: !1,
  connectingTo: !1,
  clickConnecting: !1,
  isPossibleEndHandle: !0,
  connectionInProcess: !1,
  clickConnectionInProcess: !1,
  valid: !1
}, ch = (e, t, n) => (o) => {
  const { connectionClickStartHandle: r, connectionMode: i, connection: s } = o, { fromHandle: a, toHandle: c, isValid: l } = s;
  if (!a && !r)
    return ah;
  const u = c?.nodeId === e && c?.id === t && c?.type === n;
  return {
    connectingFrom: a?.nodeId === e && a?.id === t && a?.type === n,
    connectingTo: u,
    clickConnecting: r?.nodeId === e && r?.id === t && r?.type === n,
    isPossibleEndHandle: i === st.Strict ? a?.type !== n : e !== a?.nodeId || t !== a?.id,
    connectionInProcess: !!a,
    clickConnectionInProcess: !!r,
    valid: u && l
  };
};
function lh({ type: e = "source", position: t = Y.Top, isValidConnection: n, isConnectable: o = !0, isConnectableStart: r = !0, isConnectableEnd: i = !0, id: s, onConnect: a, children: c, className: l, onMouseDown: u, onTouchStart: f, ...d }, h) {
  const g = s || null, v = e === "target", w = re(), m = Qi(), { connectOnClick: b, noPanClassName: p, rfId: x } = sh(), { connectingFrom: N, connectingTo: _, clickConnecting: C, isPossibleEndHandle: k, connectionInProcess: I, clickConnectionInProcess: V, valid: P } = ee(ch(m, g, e), ie);
  m || w.getState().onError?.("010", be.error010());
  const L = (S) => {
    const { defaultEdgeOptions: E, onConnect: M, hasDefaultEdges: A } = w.getState(), $ = {
      ...E,
      ...S
    };
    if (A) {
      const { edges: R, setEdges: H, onError: O } = w.getState();
      H(Bf($, R, { onError: O }));
    }
    M?.($), a?.($);
  }, z = (S) => {
    if (!m)
      return;
    const E = Si(S.nativeEvent);
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
        onConnectEnd: (...A) => w.getState().onConnectEnd?.(...A),
        updateConnection: M.updateConnection,
        onConnect: L,
        isValidConnection: n || ((...A) => w.getState().isValidConnection?.(...A) ?? !0),
        getTransform: () => w.getState().transform,
        getFromHandle: () => w.getState().connection.fromHandle,
        autoPanSpeed: M.autoPanSpeed,
        dragThreshold: M.connectionDragThreshold
      });
    }
    E ? u?.(S) : f?.(S);
  }, y = (S) => {
    const { onClickConnectStart: E, onClickConnectEnd: M, connectionClickStartHandle: A, connectionMode: $, isValidConnection: R, lib: H, rfId: O, nodeLookup: W, connection: B } = w.getState();
    if (!m || !A && !r)
      return;
    if (!A) {
      E?.(S.nativeEvent, { nodeId: m, handleId: g, handleType: e }), w.setState({ connectionClickStartHandle: { nodeId: m, type: e, id: g } });
      return;
    }
    const q = bi(S.target), Q = n || R, { connection: Z, isValid: D } = qn.isValid(S.nativeEvent, {
      handle: {
        nodeId: m,
        id: g,
        type: e
      },
      connectionMode: $,
      fromNodeId: A.nodeId,
      fromHandleId: A.id || null,
      fromType: A.type,
      isValidConnection: Q,
      flowId: O,
      doc: q,
      lib: H,
      nodeLookup: W
    });
    D && Z && L(Z);
    const F = structuredClone(B);
    delete F.inProgress, F.toPosition = F.toHandle ? F.toHandle.position : null, M?.(S, F), w.setState({ connectionClickStartHandle: null });
  };
  return T("div", { "data-handleid": g, "data-nodeid": m, "data-handlepos": t, "data-id": `${x}-${m}-${g}-${e}`, className: ae([
    "react-flow__handle",
    `react-flow__handle-${t}`,
    "nodrag",
    p,
    l,
    {
      source: !v,
      target: v,
      connectable: o,
      connectablestart: r,
      connectableend: i,
      clickconnecting: C,
      connectingfrom: N,
      connectingto: _,
      valid: P,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: o && (!I || k) && (I || V ? i : r)
    }
  ]), onMouseDown: z, onTouchStart: z, onClick: b ? y : void 0, ref: h, ...d, children: c });
}
const on = se(Wi(lh));
function uh({ data: e, isConnectable: t, sourcePosition: n = Y.Bottom }) {
  return le(He, { children: [e?.label, T(on, { type: "source", position: n, isConnectable: t })] });
}
function dh({ data: e, isConnectable: t, targetPosition: n = Y.Top, sourcePosition: o = Y.Bottom }) {
  return le(He, { children: [T(on, { type: "target", position: n, isConnectable: t }), e?.label, T(on, { type: "source", position: o, isConnectable: t })] });
}
function fh() {
  return null;
}
function hh({ data: e, isConnectable: t, targetPosition: n = Y.Top }) {
  return le(He, { children: [T(on, { type: "target", position: n, isConnectable: t }), e?.label] });
}
const rn = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, vr = {
  input: uh,
  default: dh,
  output: hh,
  group: fh
};
function gh(e) {
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? e.style?.width,
    height: e.height ?? e.initialHeight ?? e.style?.height
  } : {
    width: e.width ?? e.style?.width,
    height: e.height ?? e.style?.height
  };
}
const ph = (e) => {
  const { width: t, height: n, x: o, y: r } = At(e.nodeLookup, {
    filter: (i) => !!i.selected
  });
  return {
    width: me(t) ? t : null,
    height: me(n) ? n : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${o}px,${r}px)`
  };
};
function mh({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
  const o = re(), { width: r, height: i, transformString: s, userSelectionActive: a } = ee(ph, ie), c = Ki(), l = te(null);
  oe(() => {
    n || l.current?.focus({
      preventScroll: !0
    });
  }, [n]);
  const u = !a && r !== null && i !== null;
  if (Ui({
    nodeRef: l,
    disabled: !u
  }), !u)
    return null;
  const f = e ? (h) => {
    const g = o.getState().nodes.filter((v) => v.selected);
    e(h, g);
  } : void 0, d = (h) => {
    Object.prototype.hasOwnProperty.call(rn, h.key) && (h.preventDefault(), c({
      direction: rn[h.key],
      factor: h.shiftKey ? 4 : 1
    }));
  };
  return T("div", { className: ae(["react-flow__nodesselection", "react-flow__container", t]), style: {
    transform: s
  }, children: T("div", { ref: l, className: "react-flow__nodesselection-rect", onContextMenu: f, tabIndex: n ? void 0 : -1, onKeyDown: n ? void 0 : d, style: {
    width: r,
    height: i
  } }) });
}
const br = typeof window < "u" ? window : void 0, yh = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function ji({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: o, onPaneMouseLeave: r, onPaneContextMenu: i, onPaneScroll: s, paneClickDistance: a, deleteKeyCode: c, selectionKeyCode: l, selectionOnDrag: u, selectionMode: f, onSelectionStart: d, onSelectionEnd: h, multiSelectionKeyCode: g, panActivationKeyCode: v, zoomActivationKeyCode: w, elementsSelectable: m, zoomOnScroll: b, zoomOnPinch: p, panOnScroll: x, panOnScrollSpeed: N, panOnScrollMode: _, zoomOnDoubleClick: C, panOnDrag: k, autoPanOnSelection: I, defaultViewport: V, translateExtent: P, minZoom: L, maxZoom: z, preventScrolling: y, onSelectionContextMenu: S, noWheelClassName: E, noPanClassName: M, disableKeyboardA11y: A, onViewportChange: $, isControlledViewport: R }) {
  const { nodesSelectionActive: H, userSelectionActive: O } = ee(yh, ie), W = Ct(l, { target: br }), B = Ct(v, { target: br }), q = B || k, Q = B || x, Z = u && q !== !0, D = W || O || Z;
  return Gf({ deleteKeyCode: c, multiSelectionKeyCode: g }), T(Qf, { onPaneContextMenu: i, elementsSelectable: m, zoomOnScroll: b, zoomOnPinch: p, panOnScroll: Q, panActivationKeyPressed: B, panOnScrollSpeed: N, panOnScrollMode: _, zoomOnDoubleClick: C, panOnDrag: !W && q, defaultViewport: V, translateExtent: P, minZoom: L, maxZoom: z, zoomActivationKeyCode: w, preventScrolling: y, noWheelClassName: E, noPanClassName: M, onViewportChange: $, isControlledViewport: R, paneClickDistance: a, selectionOnDrag: Z, children: le(th, { onSelectionStart: d, onSelectionEnd: h, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: o, onPaneMouseLeave: r, onPaneContextMenu: i, onPaneScroll: s, panOnDrag: q, autoPanOnSelection: I, isSelecting: !!D, selectionMode: f, selectionKeyPressed: W, paneClickDistance: a, selectionOnDrag: Z, children: [e, H && T(mh, { onSelectionContextMenu: S, noPanClassName: M, disableKeyboardA11y: A })] }) });
}
ji.displayName = "FlowRenderer";
const wh = se(ji), xh = (e) => (t) => e ? ro(t.nodeLookup, { x: 0, y: 0, width: t.width, height: t.height }, t.transform, !0).map((n) => n.id) : Array.from(t.nodeLookup.keys());
function vh(e) {
  return ee(we(xh(e), [e]), ie);
}
const bh = (e) => e.updateNodeInternals;
function _h() {
  const e = ee(bh), [t] = ve(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((n) => {
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
  return oe(() => () => {
    t?.disconnect();
  }, [t]), t;
}
function Sh({ node: e, nodeType: t, hasDimensions: n, resizeObserver: o }) {
  const r = re(), i = te(null), s = te(null), a = te(e.sourcePosition), c = te(e.targetPosition), l = te(t), u = n && !!e.internals.handleBounds;
  return oe(() => {
    i.current && !e.hidden && (!u || s.current !== i.current) && (s.current && o?.unobserve(s.current), o?.observe(i.current), s.current = i.current);
  }, [u, e.hidden]), oe(() => () => {
    s.current && (o?.unobserve(s.current), s.current = null);
  }, []), oe(() => {
    if (i.current) {
      const f = l.current !== t, d = a.current !== e.sourcePosition, h = c.current !== e.targetPosition;
      (f || d || h) && (l.current = t, a.current = e.sourcePosition, c.current = e.targetPosition, r.getState().updateNodeInternals(/* @__PURE__ */ new Map([[e.id, { id: e.id, nodeElement: i.current, force: !0 }]])));
    }
  }, [e.id, t, e.sourcePosition, e.targetPosition]), i;
}
function Eh({ id: e, onClick: t, onMouseEnter: n, onMouseMove: o, onMouseLeave: r, onContextMenu: i, onDoubleClick: s, nodesDraggable: a, elementsSelectable: c, nodesConnectable: l, nodesFocusable: u, resizeObserver: f, noDragClassName: d, noPanClassName: h, disableKeyboardA11y: g, rfId: v, nodeTypes: w, nodeClickDistance: m, onError: b }) {
  const { node: p, internals: x, isParent: N } = ee((D) => {
    const F = D.nodeLookup.get(e), K = D.parentLookup.has(e);
    return {
      node: F,
      internals: F.internals,
      isParent: K
    };
  }, ie);
  let _ = p.type || "default", C = w?.[_] || vr[_];
  C === void 0 && (b?.("003", be.error003(_)), _ = "default", C = w?.default || vr.default);
  const k = !!(p.draggable || a && typeof p.draggable > "u"), I = !!(p.selectable || c && typeof p.selectable > "u"), V = !!(p.connectable || l && typeof p.connectable > "u"), P = !!(p.focusable || u && typeof p.focusable > "u"), L = re(), z = wi(p), y = Sh({ node: p, nodeType: _, hasDimensions: z, resizeObserver: f }), S = Ui({
    nodeRef: y,
    disabled: p.hidden || !k,
    noDragClassName: d,
    handleSelector: p.dragHandle,
    nodeId: e,
    isSelectable: I,
    nodeClickDistance: m
  }), E = Ki();
  if (p.hidden)
    return null;
  const M = Se(p), A = gh(p), $ = I || k || t || n || o || r, R = n ? (D) => n(D, { ...x.userNode }) : void 0, H = o ? (D) => o(D, { ...x.userNode }) : void 0, O = r ? (D) => r(D, { ...x.userNode }) : void 0, W = i ? (D) => i(D, { ...x.userNode }) : void 0, B = s ? (D) => s(D, { ...x.userNode }) : void 0, q = (D) => {
    const { selectNodesOnDrag: F, nodeDragThreshold: K } = L.getState();
    I && (!F || !k || K > 0) && Gn({
      id: e,
      store: L,
      nodeRef: y
    }), t && t(D, { ...x.userNode });
  }, Q = (D) => {
    if (!(_i(D.nativeEvent) || g)) {
      if (li.includes(D.key) && I) {
        const F = D.key === "Escape";
        Gn({
          id: e,
          store: L,
          unselect: F,
          nodeRef: y
        });
      } else if (k && p.selected && Object.prototype.hasOwnProperty.call(rn, D.key)) {
        D.preventDefault();
        const { ariaLabelConfig: F } = L.getState();
        L.setState({
          ariaLiveMessage: F["node.a11yDescription.ariaLiveMessage"]({
            direction: D.key.replace("Arrow", "").toLowerCase(),
            x: ~~x.positionAbsolute.x,
            y: ~~x.positionAbsolute.y
          })
        }), E({
          direction: rn[D.key],
          factor: D.shiftKey ? 4 : 1
        });
      }
    }
  }, Z = () => {
    if (g || !y.current?.matches(":focus-visible"))
      return;
    const { transform: D, width: F, height: K, autoPanOnNodeFocus: U, setCenter: X } = L.getState();
    if (!U)
      return;
    ro(/* @__PURE__ */ new Map([[e, p]]), { x: 0, y: 0, width: F, height: K }, D, !0).length > 0 || X(p.position.x + M.width / 2, p.position.y + M.height / 2, {
      zoom: D[2]
    });
  };
  return T("div", { className: ae([
    "react-flow__node",
    `react-flow__node-${_}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [h]: k
    },
    p.className,
    {
      selected: p.selected,
      selectable: I,
      parent: N,
      draggable: k,
      dragging: S
    }
  ]), ref: y, style: {
    zIndex: x.z,
    transform: `translate(${x.positionAbsolute.x}px,${x.positionAbsolute.y}px)`,
    pointerEvents: $ ? "all" : "none",
    visibility: z ? "visible" : "hidden",
    ...p.style,
    ...A
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: R, onMouseMove: H, onMouseLeave: O, onContextMenu: W, onClick: q, onDoubleClick: B, onKeyDown: P ? Q : void 0, tabIndex: P ? 0 : void 0, onFocus: P ? Z : void 0, role: p.ariaRole ?? (P ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": g ? void 0 : `${Fi}-${v}`, "aria-label": p.ariaLabel, ...p.domAttributes, children: T(oh, { value: e, children: T(C, { id: e, data: p.data, type: _, positionAbsoluteX: x.positionAbsolute.x, positionAbsoluteY: x.positionAbsolute.y, selected: p.selected ?? !1, selectable: I, draggable: k, deletable: p.deletable ?? !0, isConnectable: V, sourcePosition: p.sourcePosition, targetPosition: p.targetPosition, dragging: S, dragHandle: p.dragHandle, zIndex: x.z, parentId: p.parentId, ...M }) }) });
}
var Nh = se(Eh);
const Ch = (e) => ({
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function es(e) {
  const { nodesConnectable: t, nodesFocusable: n, elementsSelectable: o, onError: r } = ee(Ch, ie), i = vh(e.onlyRenderVisibleElements), s = _h();
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
    T(Nh, { id: a, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: s, nodesDraggable: e.nodesDraggable ?? !0, nodesConnectable: t, nodesFocusable: n, elementsSelectable: o, nodeClickDistance: e.nodeClickDistance, onError: r }, a)
  )) });
}
es.displayName = "NodeRenderer";
const Mh = se(es);
function Ih(e) {
  return ee(we((n) => {
    if (!e)
      return n.edges.map((r) => r.id);
    const o = [];
    if (n.width && n.height)
      for (const r of n.edges) {
        const i = n.nodeLookup.get(r.source), s = n.nodeLookup.get(r.target);
        i && s && _d({
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
const kh = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e }
  };
  return T("polyline", { className: "arrow", style: n, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, Ah = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e, fill: e }
  };
  return T("polyline", { className: "arrowclosed", style: n, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, _r = {
  [en.Arrow]: kh,
  [en.ArrowClosed]: Ah
};
function $h(e) {
  const t = re();
  return xe(() => Object.prototype.hasOwnProperty.call(_r, e) ? _r[e] : (t.getState().onError?.("009", be.error009(e)), null), [e]);
}
const Ph = ({ id: e, type: t, color: n, width: o = 12.5, height: r = 12.5, markerUnits: i = "strokeWidth", strokeWidth: s, orient: a = "auto-start-reverse" }) => {
  const c = $h(t);
  return c ? T("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${o}`, markerHeight: `${r}`, viewBox: "-10 -10 20 20", markerUnits: i, orient: a, refX: "0", refY: "0", children: T(c, { color: n, strokeWidth: s }) }) : null;
}, ts = ({ defaultColor: e, rfId: t }) => {
  const n = ee((i) => i.edges), o = ee((i) => i.defaultEdgeOptions), r = xe(() => Ad(n, {
    id: t,
    defaultColor: e,
    defaultMarkerStart: o?.markerStart,
    defaultMarkerEnd: o?.markerEnd
  }), [n, o, t, e]);
  return r.length ? T("svg", { className: "react-flow__marker", "aria-hidden": "true", children: T("defs", { children: r.map((i) => T(Ph, { id: i.id, type: i.type, color: i.color, width: i.width, height: i.height, markerUnits: i.markerUnits, strokeWidth: i.strokeWidth, orient: i.orient }, i.id)) }) }) : null;
};
ts.displayName = "MarkerDefinitions";
var Dh = se(ts);
function ns({ x: e, y: t, label: n, labelStyle: o, labelShowBg: r = !0, labelBgStyle: i, labelBgPadding: s = [2, 4], labelBgBorderRadius: a = 2, children: c, className: l, ...u }) {
  const [f, d] = ve({ x: 1, y: 0, width: 0, height: 0 }), h = ae(["react-flow__edge-textwrapper", l]), g = te(null);
  return oe(() => {
    if (g.current) {
      const v = g.current.getBBox();
      d({
        x: v.x,
        y: v.y,
        width: v.width,
        height: v.height
      });
    }
  }, [n]), n ? le("g", { transform: `translate(${e - f.width / 2} ${t - f.height / 2})`, className: h, visibility: f.width ? "visible" : "hidden", ...u, children: [r && T("rect", { width: f.width + 2 * s[0], x: -s[0], y: -s[1], height: f.height + 2 * s[1], className: "react-flow__edge-textbg", style: i, rx: a, ry: a }), T("text", { className: "react-flow__edge-text", y: f.height / 2, dy: "0.3em", ref: g, style: o, children: n }), c] }) : null;
}
ns.displayName = "EdgeText";
const Th = se(ns);
function wn({ path: e, labelX: t, labelY: n, label: o, labelStyle: r, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: c, interactionWidth: l = 20, ...u }) {
  return le(He, { children: [T("path", { ...u, d: e, fill: "none", className: ae(["react-flow__edge-path", u.className]) }), l ? T("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: l, className: "react-flow__edge-interaction" }) : null, o && me(t) && me(n) ? T(Th, { x: t, y: n, label: o, labelStyle: r, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: c }) : null] });
}
function Sr({ pos: e, x1: t, y1: n, x2: o, y2: r }) {
  return e === Y.Left || e === Y.Right ? [0.5 * (t + o), n] : [t, 0.5 * (n + r)];
}
function os({ sourceX: e, sourceY: t, sourcePosition: n = Y.Bottom, targetX: o, targetY: r, targetPosition: i = Y.Top }) {
  const [s, a] = Sr({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: r
  }), [c, l] = Sr({
    pos: i,
    x1: o,
    y1: r,
    x2: e,
    y2: t
  }), [u, f, d, h] = Ei({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: r,
    sourceControlX: s,
    sourceControlY: a,
    targetControlX: c,
    targetControlY: l
  });
  return [
    `M${e},${t} C${s},${a} ${c},${l} ${o},${r}`,
    u,
    f,
    d,
    h
  ];
}
function rs(e) {
  return se(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: i, sourcePosition: s, targetPosition: a, label: c, labelStyle: l, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: w, interactionWidth: m }) => {
    const [b, p, x] = os({
      sourceX: n,
      sourceY: o,
      sourcePosition: s,
      targetX: r,
      targetY: i,
      targetPosition: a
    }), N = e.isInternal ? void 0 : t;
    return T(wn, { id: N, path: b, labelX: p, labelY: x, label: c, labelStyle: l, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: w, interactionWidth: m });
  });
}
const zh = rs({ isInternal: !1 }), is = rs({ isInternal: !0 });
zh.displayName = "SimpleBezierEdge";
is.displayName = "SimpleBezierEdgeInternal";
function ss(e) {
  return se(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: i, label: s, labelStyle: a, labelShowBg: c, labelBgStyle: l, labelBgPadding: u, labelBgBorderRadius: f, style: d, sourcePosition: h = Y.Bottom, targetPosition: g = Y.Top, markerEnd: v, markerStart: w, pathOptions: m, interactionWidth: b }) => {
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
    }), _ = e.isInternal ? void 0 : t;
    return T(wn, { id: _, path: p, labelX: x, labelY: N, label: s, labelStyle: a, labelShowBg: c, labelBgStyle: l, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: v, markerStart: w, interactionWidth: b });
  });
}
const as = ss({ isInternal: !1 }), cs = ss({ isInternal: !0 });
as.displayName = "SmoothStepEdge";
cs.displayName = "SmoothStepEdgeInternal";
function ls(e) {
  return se(({ id: t, ...n }) => {
    const o = e.isInternal ? void 0 : t;
    return T(as, { ...n, id: o, pathOptions: xe(() => ({ borderRadius: 0, offset: n.pathOptions?.offset }), [n.pathOptions?.offset]) });
  });
}
const Hh = ls({ isInternal: !1 }), us = ls({ isInternal: !0 });
Hh.displayName = "StepEdge";
us.displayName = "StepEdgeInternal";
function ds(e) {
  return se(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: i, label: s, labelStyle: a, labelShowBg: c, labelBgStyle: l, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: h, markerStart: g, interactionWidth: v }) => {
    const [w, m, b] = Mi({ sourceX: n, sourceY: o, targetX: r, targetY: i }), p = e.isInternal ? void 0 : t;
    return T(wn, { id: p, path: w, labelX: m, labelY: b, label: s, labelStyle: a, labelShowBg: c, labelBgStyle: l, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: h, markerStart: g, interactionWidth: v });
  });
}
const Rh = ds({ isInternal: !1 }), fs = ds({ isInternal: !0 });
Rh.displayName = "StraightEdge";
fs.displayName = "StraightEdgeInternal";
function hs(e) {
  return se(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: i, sourcePosition: s = Y.Bottom, targetPosition: a = Y.Top, label: c, labelStyle: l, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: w, pathOptions: m, interactionWidth: b }) => {
    const [p, x, N] = Ni({
      sourceX: n,
      sourceY: o,
      sourcePosition: s,
      targetX: r,
      targetY: i,
      targetPosition: a,
      curvature: m?.curvature
    }), _ = e.isInternal ? void 0 : t;
    return T(wn, { id: _, path: p, labelX: x, labelY: N, label: c, labelStyle: l, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: w, interactionWidth: b });
  });
}
const Lh = hs({ isInternal: !1 }), gs = hs({ isInternal: !0 });
Lh.displayName = "BezierEdge";
gs.displayName = "BezierEdgeInternal";
const Er = {
  default: gs,
  straight: fs,
  step: us,
  smoothstep: cs,
  simplebezier: is
}, Nr = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  zIndex: void 0
}, Vh = (e, t, n) => n === Y.Left ? e - t : n === Y.Right ? e + t : e, Oh = (e, t, n) => n === Y.Top ? e - t : n === Y.Bottom ? e + t : e, Cr = "react-flow__edgeupdater";
function Mr({ position: e, centerX: t, centerY: n, radius: o = 10, onMouseDown: r, onMouseEnter: i, onMouseOut: s, type: a }) {
  return T("circle", { onMouseDown: r, onMouseEnter: i, onMouseOut: s, className: ae([Cr, `${Cr}-${a}`]), cx: Vh(t, o, e), cy: Oh(n, o, e), r: o, stroke: "transparent", fill: "transparent" });
}
function Bh({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: o, sourceY: r, targetX: i, targetY: s, sourcePosition: a, targetPosition: c, onReconnect: l, onReconnectStart: u, onReconnectEnd: f, setReconnecting: d, setUpdateHover: h }) {
  const g = re(), v = (x, N) => {
    if (x.button !== 0)
      return;
    const { autoPanOnConnect: _, domNode: C, connectionMode: k, connectionRadius: I, lib: V, onConnectStart: P, cancelConnection: L, nodeLookup: z, rfId: y, panBy: S, updateConnection: E } = g.getState(), M = N.type === "target", A = (H, O) => {
      d(!1), f?.(H, n, N.type, O);
    }, $ = (H) => l?.(n, H), R = (H, O) => {
      d(!0), u?.(x, n, N.type), P?.(H, O);
    };
    qn.onPointerDown(x.nativeEvent, {
      autoPanOnConnect: _,
      connectionMode: k,
      connectionRadius: I,
      domNode: C,
      handleId: N.id,
      nodeId: N.nodeId,
      nodeLookup: z,
      isTarget: M,
      edgeUpdaterType: N.type,
      lib: V,
      flowId: y,
      cancelConnection: L,
      panBy: S,
      isValidConnection: (...H) => g.getState().isValidConnection?.(...H) ?? !0,
      onConnect: $,
      onConnectStart: R,
      onConnectEnd: (...H) => g.getState().onConnectEnd?.(...H),
      onReconnectEnd: A,
      updateConnection: E,
      getTransform: () => g.getState().transform,
      getFromHandle: () => g.getState().connection.fromHandle,
      dragThreshold: g.getState().connectionDragThreshold,
      handleDomNode: x.currentTarget
    });
  }, w = (x) => v(x, { nodeId: n.target, id: n.targetHandle ?? null, type: "target" }), m = (x) => v(x, { nodeId: n.source, id: n.sourceHandle ?? null, type: "source" }), b = () => h(!0), p = () => h(!1);
  return le(He, { children: [(e === !0 || e === "source") && T(Mr, { position: a, centerX: o, centerY: r, radius: t, onMouseDown: w, onMouseEnter: b, onMouseOut: p, type: "source" }), (e === !0 || e === "target") && T(Mr, { position: c, centerX: i, centerY: s, radius: t, onMouseDown: m, onMouseEnter: b, onMouseOut: p, type: "target" })] });
}
function Fh({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: o, onClick: r, onDoubleClick: i, onContextMenu: s, onMouseEnter: a, onMouseMove: c, onMouseLeave: l, reconnectRadius: u, onReconnect: f, onReconnectStart: d, onReconnectEnd: h, rfId: g, edgeTypes: v, noPanClassName: w, onError: m, disableKeyboardA11y: b }) {
  let p = ee((X) => X.edgeLookup.get(e));
  const x = ee((X) => X.defaultEdgeOptions);
  p = x ? { ...x, ...p } : p;
  let N = p.type || "default", _ = v?.[N] || Er[N];
  _ === void 0 && (m?.("011", be.error011(N)), N = "default", _ = v?.default || Er.default);
  const C = !!(p.focusable || t && typeof p.focusable > "u"), k = typeof f < "u" && (p.reconnectable || n && typeof p.reconnectable > "u"), I = !!(p.selectable || o && typeof p.selectable > "u"), V = te(null), [P, L] = ve(!1), [z, y] = ve(!1), S = re(), { zIndex: E = p.zIndex, sourceX: M, sourceY: A, targetX: $, targetY: R, sourcePosition: H, targetPosition: O } = ee(we((X) => {
    const G = X.nodeLookup.get(p.source), J = X.nodeLookup.get(p.target);
    if (!G || !J)
      return Nr;
    const j = kd({
      id: e,
      sourceNode: G,
      targetNode: J,
      sourceHandle: p.sourceHandle || null,
      targetHandle: p.targetHandle || null,
      connectionMode: X.connectionMode,
      onError: m
    }), ne = bd({
      selected: p.selected,
      zIndex: p.zIndex,
      sourceNode: G,
      targetNode: J,
      elevateOnSelect: X.elevateEdgesOnSelect,
      zIndexMode: X.zIndexMode
    });
    return {
      ...j || Nr,
      zIndex: ne
    };
  }, [p.source, p.target, p.sourceHandle, p.targetHandle, p.selected, p.zIndex, m]), ie), W = xe(() => p.markerStart ? `url('#${Zn(p.markerStart, g)}')` : void 0, [p.markerStart, g]), B = xe(() => p.markerEnd ? `url('#${Zn(p.markerEnd, g)}')` : void 0, [p.markerEnd, g]);
  if (p.hidden || M === null || A === null || $ === null || R === null)
    return null;
  const q = (X) => {
    const { addSelectedEdges: G, unselectNodesAndEdges: J, multiSelectionActive: j } = S.getState();
    I && (S.setState({ nodesSelectionActive: !1 }), p.selected && j ? (J({ nodes: [], edges: [p] }), V.current?.blur()) : G([e])), r && r(X, p);
  }, Q = i ? (X) => {
    i(X, { ...p });
  } : void 0, Z = s ? (X) => {
    s(X, { ...p });
  } : void 0, D = a ? (X) => {
    a(X, { ...p });
  } : void 0, F = c ? (X) => {
    c(X, { ...p });
  } : void 0, K = l ? (X) => {
    l(X, { ...p });
  } : void 0, U = (X) => {
    if (!b && li.includes(X.key) && I) {
      const { unselectNodesAndEdges: G, addSelectedEdges: J } = S.getState();
      X.key === "Escape" ? (V.current?.blur(), G({ edges: [p] })) : J([e]);
    }
  };
  return T("svg", { style: { zIndex: E }, children: le("g", { className: ae([
    "react-flow__edge",
    `react-flow__edge-${N}`,
    p.className,
    w,
    {
      selected: p.selected,
      animated: p.animated,
      inactive: !I && !r,
      updating: P,
      selectable: I
    }
  ]), onClick: q, onDoubleClick: Q, onContextMenu: Z, onMouseEnter: D, onMouseMove: F, onMouseLeave: K, onKeyDown: C ? U : void 0, tabIndex: C ? 0 : void 0, role: p.ariaRole ?? (C ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": p.ariaLabel === null ? void 0 : p.ariaLabel || `Edge from ${p.source} to ${p.target}`, "aria-describedby": C ? `${Xi}-${g}` : void 0, ref: V, ...p.domAttributes, children: [!z && T(_, { id: e, source: p.source, target: p.target, type: p.type, selected: p.selected, animated: p.animated, selectable: I, deletable: p.deletable ?? !0, label: p.label, labelStyle: p.labelStyle, labelShowBg: p.labelShowBg, labelBgStyle: p.labelBgStyle, labelBgPadding: p.labelBgPadding, labelBgBorderRadius: p.labelBgBorderRadius, sourceX: M, sourceY: A, targetX: $, targetY: R, sourcePosition: H, targetPosition: O, data: p.data, style: p.style, sourceHandleId: p.sourceHandle, targetHandleId: p.targetHandle, markerStart: W, markerEnd: B, pathOptions: "pathOptions" in p ? p.pathOptions : void 0, interactionWidth: p.interactionWidth }), k && T(Bh, { edge: p, isReconnectable: k, reconnectRadius: u, onReconnect: f, onReconnectStart: d, onReconnectEnd: h, sourceX: M, sourceY: A, targetX: $, targetY: R, sourcePosition: H, targetPosition: O, setUpdateHover: L, setReconnecting: y })] }) });
}
var Xh = se(Fh);
const Yh = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function ps({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: o, noPanClassName: r, onReconnect: i, onEdgeContextMenu: s, onEdgeMouseEnter: a, onEdgeMouseMove: c, onEdgeMouseLeave: l, onEdgeClick: u, reconnectRadius: f, onEdgeDoubleClick: d, onReconnectStart: h, onReconnectEnd: g, disableKeyboardA11y: v }) {
  const { edgesFocusable: w, edgesReconnectable: m, elementsSelectable: b, onError: p } = ee(Yh, ie), x = Ih(t);
  return le("div", { className: "react-flow__edges", children: [T(Dh, { defaultColor: e, rfId: n }), x.map((N) => T(Xh, { id: N, edgesFocusable: w, edgesReconnectable: m, elementsSelectable: b, noPanClassName: r, onReconnect: i, onContextMenu: s, onMouseEnter: a, onMouseMove: c, onMouseLeave: l, onClick: u, reconnectRadius: f, onDoubleClick: d, onReconnectStart: h, onReconnectEnd: g, rfId: n, onError: p, edgeTypes: o, disableKeyboardA11y: v }, N))] });
}
ps.displayName = "EdgeRenderer";
const Zh = se(ps), Ir = (e) => `translate(${e[0]}px,${e[1]}px) scale(${e[2]})`;
function Wh({ children: e }) {
  const t = re(), n = te(null), [o] = ve(() => t.getState().transform);
  return qi(() => {
    let r = null;
    const i = () => {
      const s = t.getState().transform;
      r && s[0] === r[0] && s[1] === r[1] && s[2] === r[2] || (r = s, n.current && (n.current.style.transform = Ir(s)));
    };
    return i(), t.subscribe(i);
  }, [t]), T("div", { ref: n, className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: Ir(o) }, children: e });
}
function qh(e) {
  const t = go(), n = te(!1);
  oe(() => {
    !n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
  }, [e, t.viewportInitialized]);
}
const Gh = (e) => e.panZoom?.syncViewport;
function Uh(e) {
  const t = ee(Gh), n = re();
  return oe(() => {
    e && (t?.(e), n.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, t]), null;
}
function Kh(e) {
  return e.connection.inProgress ? { ...e.connection, to: Pt(e.connection.to, e.transform) } : { ...e.connection };
}
function Qh(e) {
  return Kh;
}
function Jh(e) {
  const t = Qh();
  return ee(t, ie);
}
const jh = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function eg({ containerStyle: e, style: t, type: n, component: o }) {
  const { nodesConnectable: r, width: i, height: s, isValid: a, inProgress: c } = ee(jh, ie);
  return !(i && r && c) ? null : T("svg", { style: e, width: i, height: s, className: "react-flow__connectionline react-flow__container", children: T("g", { className: ae(["react-flow__connection", vi(a)]), children: T(ms, { style: t, type: n, CustomComponent: o, isValid: a }) }) });
}
const ms = ({ style: e, type: t = Oe.Bezier, CustomComponent: n, isValid: o }) => {
  const { inProgress: r, from: i, fromNode: s, fromHandle: a, fromPosition: c, to: l, toNode: u, toHandle: f, toPosition: d, pointer: h } = Jh();
  if (!r)
    return;
  if (n)
    return T(n, { connectionLineType: t, connectionLineStyle: e, fromNode: s, fromHandle: a, fromX: i.x, fromY: i.y, toX: l.x, toY: l.y, fromPosition: c, toPosition: d, connectionStatus: vi(o), toNode: u, toHandle: f, pointer: h });
  let g = "";
  const v = {
    sourceX: i.x,
    sourceY: i.y,
    sourcePosition: c,
    targetX: l.x,
    targetY: l.y,
    targetPosition: d
  };
  switch (t) {
    case Oe.Bezier:
      [g] = Ni(v);
      break;
    case Oe.SimpleBezier:
      [g] = os(v);
      break;
    case Oe.Step:
      [g] = Yn({
        ...v,
        borderRadius: 0
      });
      break;
    case Oe.SmoothStep:
      [g] = Yn(v);
      break;
    default:
      [g] = Mi(v);
  }
  return T("path", { d: g, fill: "none", className: "react-flow__connection-path", style: e });
};
ms.displayName = "ConnectionLine";
const tg = {};
function kr(e = tg) {
  te(e), re(), oe(() => {
  }, [e]);
}
function ng() {
  re(), te(!1), oe(() => {
  }, []);
}
function ys({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: o, onEdgeClick: r, onNodeDoubleClick: i, onEdgeDoubleClick: s, onNodeMouseEnter: a, onNodeMouseMove: c, onNodeMouseLeave: l, onNodeContextMenu: u, onSelectionContextMenu: f, onSelectionStart: d, onSelectionEnd: h, connectionLineType: g, connectionLineStyle: v, connectionLineComponent: w, connectionLineContainerStyle: m, selectionKeyCode: b, selectionOnDrag: p, selectionMode: x, multiSelectionKeyCode: N, panActivationKeyCode: _, zoomActivationKeyCode: C, deleteKeyCode: k, onlyRenderVisibleElements: I, elementsSelectable: V, defaultViewport: P, translateExtent: L, minZoom: z, maxZoom: y, preventScrolling: S, defaultMarkerColor: E, zoomOnScroll: M, zoomOnPinch: A, panOnScroll: $, panOnScrollSpeed: R, panOnScrollMode: H, zoomOnDoubleClick: O, panOnDrag: W, autoPanOnSelection: B, onPaneClick: q, onPaneMouseEnter: Q, onPaneMouseMove: Z, onPaneMouseLeave: D, onPaneScroll: F, onPaneContextMenu: K, paneClickDistance: U, nodeClickDistance: X, onEdgeContextMenu: G, onEdgeMouseEnter: J, onEdgeMouseMove: j, onEdgeMouseLeave: ne, reconnectRadius: ce, onReconnect: ke, onReconnectStart: Ee, onReconnectEnd: Ne, noDragClassName: Ae, noWheelClassName: dt, noPanClassName: Fe, disableKeyboardA11y: Xe, nodeExtent: he, rfId: $e, viewport: Pe, onViewportChange: Ye, nodesDraggable: xn }) {
  return kr(e), kr(t), ng(), qh(n), Uh(Pe), T(wh, { onPaneClick: q, onPaneMouseEnter: Q, onPaneMouseMove: Z, onPaneMouseLeave: D, onPaneContextMenu: K, onPaneScroll: F, paneClickDistance: U, deleteKeyCode: k, selectionKeyCode: b, selectionOnDrag: p, selectionMode: x, onSelectionStart: d, onSelectionEnd: h, multiSelectionKeyCode: N, panActivationKeyCode: _, zoomActivationKeyCode: C, elementsSelectable: V, zoomOnScroll: M, zoomOnPinch: A, zoomOnDoubleClick: O, panOnScroll: $, panOnScrollSpeed: R, panOnScrollMode: H, panOnDrag: W, autoPanOnSelection: B, defaultViewport: P, translateExtent: L, minZoom: z, maxZoom: y, onSelectionContextMenu: f, preventScrolling: S, noDragClassName: Ae, noWheelClassName: dt, noPanClassName: Fe, disableKeyboardA11y: Xe, onViewportChange: Ye, isControlledViewport: !!Pe, children: le(Wh, { children: [T(Zh, { edgeTypes: t, onEdgeClick: r, onEdgeDoubleClick: s, onReconnect: ke, onReconnectStart: Ee, onReconnectEnd: Ne, onlyRenderVisibleElements: I, onEdgeContextMenu: G, onEdgeMouseEnter: J, onEdgeMouseMove: j, onEdgeMouseLeave: ne, reconnectRadius: ce, defaultMarkerColor: E, noPanClassName: Fe, disableKeyboardA11y: Xe, rfId: $e }), T(eg, { style: v, type: g, component: w, containerStyle: m }), T("div", { className: "react-flow__edgelabel-renderer" }), T(Mh, { nodeTypes: e, onNodeClick: o, onNodeDoubleClick: i, onNodeMouseEnter: a, onNodeMouseMove: c, onNodeMouseLeave: l, onNodeContextMenu: u, nodeClickDistance: X, onlyRenderVisibleElements: I, noPanClassName: Fe, noDragClassName: Ae, disableKeyboardA11y: Xe, nodeExtent: he, rfId: $e, nodesDraggable: xn }), T("div", { className: "react-flow__viewport-portal" })] }) });
}
ys.displayName = "GraphView";
const og = se(ys), rg = yi(), Ar = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, width: r, height: i, fitView: s, fitViewOptions: a, minZoom: c = 0.5, maxZoom: l = 2, nodeOrigin: u, nodeExtent: f, zIndexMode: d = "basic" } = {}) => {
  const h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), m = o ?? t ?? [], b = n ?? e ?? [], p = u ?? [0, 0], x = f ?? _t;
  Ai(v, w, m);
  const { nodesInitialized: N } = Wn(b, h, g, {
    nodeOrigin: p,
    nodeExtent: x,
    zIndexMode: d
  });
  let _ = [0, 0, 1];
  if (s && r && i) {
    const C = At(h, {
      filter: (P) => !!((P.width || P.initialWidth) && (P.height || P.initialHeight))
    }), { x: k, y: I, zoom: V } = so(C, r, i, c, l, a?.padding ?? 0.1);
    _ = [k, I, V];
  }
  return {
    rfId: "1",
    width: r ?? 0,
    height: i ?? 0,
    transform: _,
    nodes: b,
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
    minZoom: c,
    maxZoom: l,
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
    connection: { ...di },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: rg,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: ui,
    zIndexMode: d,
    defaultEdgeOptions: void 0,
    onNodesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
    onEdgesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
    onNodesDelete: void 0,
    onEdgesDelete: void 0,
    onDelete: void 0,
    onBeforeDelete: void 0,
    onViewportChangeStart: void 0,
    onViewportChange: void 0,
    onViewportChangeEnd: void 0,
    onNodeDragStart: void 0,
    onNodeDrag: void 0,
    onNodeDragStop: void 0,
    onSelectionDragStart: void 0,
    onSelectionDrag: void 0,
    onSelectionDragStop: void 0,
    onMoveStart: void 0,
    onMove: void 0,
    onMoveEnd: void 0,
    onConnect: void 0,
    onConnectStart: void 0,
    onConnectEnd: void 0,
    onClickConnectStart: void 0,
    onClickConnectEnd: void 0
  };
}, ig = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, width: r, height: i, fitView: s, fitViewOptions: a, minZoom: c, maxZoom: l, nodeOrigin: u, nodeExtent: f, zIndexMode: d }) => yf((h, g) => {
  async function v() {
    const { nodeLookup: w, panZoom: m, fitViewOptions: b, fitViewResolver: p, width: x, height: N, minZoom: _, maxZoom: C } = g();
    m && (await gd({
      nodes: w,
      width: x,
      height: N,
      panZoom: m,
      minZoom: _,
      maxZoom: C
    }, b), p?.resolve(!0), h({ fitViewResolver: null }));
  }
  return {
    ...Ar({
      nodes: e,
      edges: t,
      width: r,
      height: i,
      fitView: s,
      fitViewOptions: a,
      minZoom: c,
      maxZoom: l,
      nodeOrigin: u,
      nodeExtent: f,
      defaultNodes: n,
      defaultEdges: o,
      zIndexMode: d
    }),
    setNodes: (w) => {
      const { nodeLookup: m, parentLookup: b, nodeOrigin: p, nodeExtent: x, elevateNodesOnSelect: N, fitViewQueued: _, zIndexMode: C, nodesSelectionActive: k } = g(), { nodesInitialized: I, hasSelectedNodes: V } = Wn(w, m, b, {
        nodeOrigin: p,
        nodeExtent: x,
        elevateNodesOnSelect: N,
        checkEquality: !0,
        zIndexMode: C
      }), P = k && V;
      _ && I ? (v(), h({
        nodes: w,
        nodesInitialized: I,
        fitViewQueued: !1,
        fitViewOptions: void 0,
        nodesSelectionActive: P
      })) : h({ nodes: w, nodesInitialized: I, nodesSelectionActive: P });
    },
    setEdges: (w) => {
      const { connectionLookup: m, edgeLookup: b } = g();
      Ai(m, b, w), h({ edges: w });
    },
    setDefaultNodesAndEdges: (w, m) => {
      if (w) {
        const { setNodes: b } = g();
        b(w), h({ hasDefaultNodes: !0 });
      }
      if (m) {
        const { setEdges: b } = g();
        b(m), h({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registered at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (w) => {
      const { triggerNodeChanges: m, nodeLookup: b, parentLookup: p, domNode: x, nodeOrigin: N, nodeExtent: _, debug: C, fitViewQueued: k, zIndexMode: I } = g(), { changes: V, updatedInternals: P } = Rd(w, b, p, x, N, _, I);
      P && (Dd(b, p, { nodeOrigin: N, nodeExtent: _, zIndexMode: I }), k ? (v(), h({ fitViewQueued: !1, fitViewOptions: void 0 })) : h({}), V?.length > 0 && (C && console.log("React Flow: trigger node changes", V), m?.(V)));
    },
    updateNodePositions: (w, m = !1) => {
      const b = [];
      let p = [];
      const { nodeLookup: x, triggerNodeChanges: N, connection: _, updateConnection: C, onNodesChangeMiddlewareMap: k } = g();
      for (const [I, V] of w) {
        const P = x.get(I), L = !!(P?.expandParent && P?.parentId && V?.position), z = {
          id: I,
          type: "position",
          position: L ? {
            x: Math.max(0, V.position.x),
            y: Math.max(0, V.position.y)
          } : V.position,
          dragging: m
        };
        if (P && _.inProgress && _.fromNode.id === P.id) {
          const y = je(P, _.fromHandle, Y.Left, !0);
          C({ ..._, from: y });
        }
        L && P.parentId && b.push({
          id: I,
          parentId: P.parentId,
          rect: {
            ...V.internals.positionAbsolute,
            width: V.measured.width ?? 0,
            height: V.measured.height ?? 0
          }
        }), p.push(z);
      }
      if (b.length > 0) {
        const { parentLookup: I, nodeOrigin: V } = g(), P = ho(b, x, I, V);
        p.push(...P);
      }
      for (const I of k.values())
        p = I(p);
      N(p);
    },
    triggerNodeChanges: (w) => {
      const { onNodesChange: m, setNodes: b, nodes: p, hasDefaultNodes: x, debug: N } = g();
      if (w?.length) {
        if (x) {
          const _ = Lf(w, p);
          b(_);
        }
        N && console.log("React Flow: trigger node changes", w), m?.(w);
      }
    },
    triggerEdgeChanges: (w) => {
      const { onEdgesChange: m, setEdges: b, edges: p, hasDefaultEdges: x, debug: N } = g();
      if (w?.length) {
        if (x) {
          const _ = Vf(w, p);
          b(_);
        }
        N && console.log("React Flow: trigger edge changes", w), m?.(w);
      }
    },
    addSelectedNodes: (w) => {
      const { multiSelectionActive: m, edgeLookup: b, nodeLookup: p, triggerNodeChanges: x, triggerEdgeChanges: N } = g();
      if (m) {
        const _ = w.map((C) => Ze(C, !0));
        x(_);
        return;
      }
      x(tt(p, /* @__PURE__ */ new Set([...w]), !0)), N(tt(b));
    },
    addSelectedEdges: (w) => {
      const { multiSelectionActive: m, edgeLookup: b, nodeLookup: p, triggerNodeChanges: x, triggerEdgeChanges: N } = g();
      if (m) {
        const _ = w.map((C) => Ze(C, !0));
        N(_);
        return;
      }
      N(tt(b, /* @__PURE__ */ new Set([...w]))), x(tt(p, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: w, edges: m } = {}) => {
      const { edges: b, nodes: p, nodeLookup: x, triggerNodeChanges: N, triggerEdgeChanges: _ } = g(), C = w || p, k = m || b, I = [];
      for (const P of C) {
        if (!P.selected)
          continue;
        const L = x.get(P.id);
        L && (L.selected = !1), I.push(Ze(P.id, !1));
      }
      const V = [];
      for (const P of k)
        P.selected && V.push(Ze(P.id, !1));
      N(I), _(V);
    },
    setMinZoom: (w) => {
      const { panZoom: m, maxZoom: b } = g();
      m?.setScaleExtent([w, b]), h({ minZoom: w });
    },
    setMaxZoom: (w) => {
      const { panZoom: m, minZoom: b } = g();
      m?.setScaleExtent([b, w]), h({ maxZoom: w });
    },
    setTranslateExtent: (w) => {
      g().panZoom?.setTranslateExtent(w), h({ translateExtent: w });
    },
    resetSelectedElements: () => {
      const { edges: w, nodes: m, triggerNodeChanges: b, triggerEdgeChanges: p, elementsSelectable: x } = g();
      if (!x)
        return;
      const N = m.reduce((C, k) => k.selected ? [...C, Ze(k.id, !1)] : C, []), _ = w.reduce((C, k) => k.selected ? [...C, Ze(k.id, !1)] : C, []);
      b(N), p(_);
    },
    setNodeExtent: (w) => {
      const { nodes: m, nodeLookup: b, parentLookup: p, nodeOrigin: x, elevateNodesOnSelect: N, nodeExtent: _, zIndexMode: C } = g();
      w[0][0] === _[0][0] && w[0][1] === _[0][1] && w[1][0] === _[1][0] && w[1][1] === _[1][1] || (Wn(m, b, p, {
        nodeOrigin: x,
        nodeExtent: w,
        elevateNodesOnSelect: N,
        checkEquality: !1,
        zIndexMode: C
      }), h({ nodeExtent: w }));
    },
    panBy: (w) => {
      const { transform: m, width: b, height: p, panZoom: x, translateExtent: N } = g();
      return Ld({ delta: w, panZoom: x, transform: m, translateExtent: N, width: b, height: p });
    },
    setCenter: async (w, m, b) => {
      const { width: p, height: x, maxZoom: N, panZoom: _ } = g();
      if (!_)
        return !1;
      const C = typeof b?.zoom < "u" ? b.zoom : N;
      return await _.setViewport({
        x: p / 2 - w * C,
        y: x / 2 - m * C,
        zoom: C
      }, { duration: b?.duration, ease: b?.ease, interpolate: b?.interpolate }), !0;
    },
    cancelConnection: () => {
      h({
        connection: { ...di }
      });
    },
    updateConnection: (w) => {
      h({ connection: w });
    },
    reset: () => h({ ...Ar() })
  };
}, Object.is);
function sg({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: o, initialWidth: r, initialHeight: i, initialMinZoom: s, initialMaxZoom: a, initialFitViewOptions: c, fitView: l, nodeOrigin: u, nodeExtent: f, zIndexMode: d, children: h }) {
  const [g] = ve(() => ig({
    nodes: e,
    edges: t,
    defaultNodes: n,
    defaultEdges: o,
    width: r,
    height: i,
    fitView: l,
    minZoom: s,
    maxZoom: a,
    fitViewOptions: c,
    nodeOrigin: u,
    nodeExtent: f,
    zIndexMode: d
  }));
  return T(wf, { value: g, children: T(Yf, { children: T(ih, { children: h }) }) });
}
function ag({ children: e, nodes: t, edges: n, defaultNodes: o, defaultEdges: r, width: i, height: s, fitView: a, fitViewOptions: c, minZoom: l, maxZoom: u, nodeOrigin: f, nodeExtent: d, zIndexMode: h }) {
  return ut(pn) ? T(He, { children: e }) : T(sg, { initialNodes: t, initialEdges: n, defaultNodes: o, defaultEdges: r, initialWidth: i, initialHeight: s, fitView: a, initialFitViewOptions: c, initialMinZoom: l, initialMaxZoom: u, nodeOrigin: f, nodeExtent: d, zIndexMode: h, children: e });
}
const cg = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function lg({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, className: r, nodeTypes: i, edgeTypes: s, onNodeClick: a, onEdgeClick: c, onInit: l, onMove: u, onMoveStart: f, onMoveEnd: d, onConnect: h, onConnectStart: g, onConnectEnd: v, onClickConnectStart: w, onClickConnectEnd: m, onNodeMouseEnter: b, onNodeMouseMove: p, onNodeMouseLeave: x, onNodeContextMenu: N, onNodeDoubleClick: _, onNodeDragStart: C, onNodeDrag: k, onNodeDragStop: I, onNodesDelete: V, onEdgesDelete: P, onDelete: L, onSelectionChange: z, onSelectionDragStart: y, onSelectionDrag: S, onSelectionDragStop: E, onSelectionContextMenu: M, onSelectionStart: A, onSelectionEnd: $, onBeforeDelete: R, connectionMode: H, connectionLineType: O = Oe.Bezier, connectionLineStyle: W, connectionLineComponent: B, connectionLineContainerStyle: q, deleteKeyCode: Q = "Backspace", selectionKeyCode: Z = "Shift", selectionOnDrag: D = !1, selectionMode: F = St.Full, panActivationKeyCode: K = "Space", multiSelectionKeyCode: U = Nt() ? "Meta" : "Control", zoomActivationKeyCode: X = Nt() ? "Meta" : "Control", snapToGrid: G, snapGrid: J, onlyRenderVisibleElements: j = !1, selectNodesOnDrag: ne, nodesDraggable: ce, autoPanOnNodeFocus: ke, nodesConnectable: Ee, nodesFocusable: Ne, nodeOrigin: Ae = Yi, edgesFocusable: dt, edgesReconnectable: Fe, elementsSelectable: Xe = !0, defaultViewport: he = $f, minZoom: $e = 0.5, maxZoom: Pe = 2, translateExtent: Ye = _t, preventScrolling: xn = !0, nodeExtent: vn, defaultMarkerColor: bs = "#b1b1b7", zoomOnScroll: _s = !0, zoomOnPinch: Ss = !0, panOnScroll: Es = !1, panOnScrollSpeed: Ns = 0.5, panOnScrollMode: Cs = Ge.Free, zoomOnDoubleClick: Ms = !0, panOnDrag: Is = !0, onPaneClick: ks, onPaneMouseEnter: As, onPaneMouseMove: $s, onPaneMouseLeave: Ps, onPaneScroll: Ds, onPaneContextMenu: Ts, paneClickDistance: zs = 1, nodeClickDistance: Hs = 0, children: Rs, onReconnect: Ls, onReconnectStart: Vs, onReconnectEnd: Os, onEdgeContextMenu: Bs, onEdgeDoubleClick: Fs, onEdgeMouseEnter: Xs, onEdgeMouseMove: Ys, onEdgeMouseLeave: Zs, reconnectRadius: Ws = 10, onNodesChange: qs, onEdgesChange: Gs, noDragClassName: Us = "nodrag", noWheelClassName: Ks = "nowheel", noPanClassName: mo = "nopan", fitView: yo, fitViewOptions: wo, connectOnClick: Qs, attributionPosition: Js, proOptions: js, defaultEdgeOptions: ea, elevateNodesOnSelect: ta = !0, elevateEdgesOnSelect: na = !1, disableKeyboardA11y: xo = !1, autoPanOnConnect: oa, autoPanOnNodeDrag: ra, autoPanOnSelection: ia = !0, autoPanSpeed: sa, connectionRadius: aa, isValidConnection: ca, onError: la, style: ua, id: vo, nodeDragThreshold: da, connectionDragThreshold: fa, viewport: ha, onViewportChange: ga, width: pa, height: ma, colorMode: ya = "light", debug: wa, onScroll: bo, ariaLabelConfig: xa, zIndexMode: _o = "basic", ...va }, ba) {
  const bn = vo || "1", _a = zf(ya), Sa = we((So) => {
    So.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), bo?.(So);
  }, [bo]);
  return T("div", { "data-testid": "rf__wrapper", ...va, onScroll: Sa, style: { ...ua, ...cg }, ref: ba, className: ae(["react-flow", r, _a]), id: vo, role: "application", children: le(ag, { nodes: e, edges: t, width: pa, height: ma, fitView: yo, fitViewOptions: wo, minZoom: $e, maxZoom: Pe, nodeOrigin: Ae, nodeExtent: vn, zIndexMode: _o, children: [T(Tf, { nodes: e, edges: t, defaultNodes: n, defaultEdges: o, onConnect: h, onConnectStart: g, onConnectEnd: v, onClickConnectStart: w, onClickConnectEnd: m, nodesDraggable: ce, autoPanOnNodeFocus: ke, nodesConnectable: Ee, nodesFocusable: Ne, edgesFocusable: dt, edgesReconnectable: Fe, elementsSelectable: Xe, elevateNodesOnSelect: ta, elevateEdgesOnSelect: na, minZoom: $e, maxZoom: Pe, nodeExtent: vn, onNodesChange: qs, onEdgesChange: Gs, snapToGrid: G, snapGrid: J, connectionMode: H, translateExtent: Ye, connectOnClick: Qs, defaultEdgeOptions: ea, fitView: yo, fitViewOptions: wo, onNodesDelete: V, onEdgesDelete: P, onDelete: L, onNodeDragStart: C, onNodeDrag: k, onNodeDragStop: I, onSelectionDrag: S, onSelectionDragStart: y, onSelectionDragStop: E, onMove: u, onMoveStart: f, onMoveEnd: d, noPanClassName: mo, nodeOrigin: Ae, rfId: bn, autoPanOnConnect: oa, autoPanOnNodeDrag: ra, autoPanSpeed: sa, onError: la, connectionRadius: aa, isValidConnection: ca, selectNodesOnDrag: ne, nodeDragThreshold: da, connectionDragThreshold: fa, onBeforeDelete: R, debug: wa, ariaLabelConfig: xa, zIndexMode: _o }), T(og, { onInit: l, onNodeClick: a, onEdgeClick: c, onNodeMouseEnter: b, onNodeMouseMove: p, onNodeMouseLeave: x, onNodeContextMenu: N, onNodeDoubleClick: _, nodeTypes: i, edgeTypes: s, connectionLineType: O, connectionLineStyle: W, connectionLineComponent: B, connectionLineContainerStyle: q, selectionKeyCode: Z, selectionOnDrag: D, selectionMode: F, deleteKeyCode: Q, multiSelectionKeyCode: U, panActivationKeyCode: K, zoomActivationKeyCode: X, onlyRenderVisibleElements: j, defaultViewport: he, translateExtent: Ye, minZoom: $e, maxZoom: Pe, preventScrolling: xn, zoomOnScroll: _s, zoomOnPinch: Ss, zoomOnDoubleClick: Ms, panOnScroll: Es, panOnScrollSpeed: Ns, panOnScrollMode: Cs, panOnDrag: Is, autoPanOnSelection: ia, onPaneClick: ks, onPaneMouseEnter: As, onPaneMouseMove: $s, onPaneMouseLeave: Ps, onPaneScroll: Ds, onPaneContextMenu: Ts, paneClickDistance: zs, nodeClickDistance: Hs, onSelectionContextMenu: M, onSelectionStart: A, onSelectionEnd: $, onReconnect: Ls, onReconnectStart: Vs, onReconnectEnd: Os, onEdgeContextMenu: Bs, onEdgeDoubleClick: Fs, onEdgeMouseEnter: Xs, onEdgeMouseMove: Ys, onEdgeMouseLeave: Zs, reconnectRadius: Ws, defaultMarkerColor: bs, noDragClassName: Us, noWheelClassName: Ks, noPanClassName: mo, rfId: bn, disableKeyboardA11y: xo, nodeExtent: vn, viewport: ha, onViewportChange: ga, nodesDraggable: ce }), T(Af, { onSelectionChange: z }), Rs, T(Nf, { proOptions: js, position: Js }), T(Ef, { rfId: bn, disableKeyboardA11y: xo })] }) });
}
var Bg = Wi(lg);
const ug = (e) => e.domNode?.querySelector(".react-flow__edgelabel-renderer");
function Fg({ children: e }) {
  const t = ee(ug);
  return t ? Aa(e, t) : null;
}
function Xg() {
  const e = re();
  return we((t) => {
    const { domNode: n, updateNodeInternals: o } = e.getState(), r = Array.isArray(t) ? t : [t], i = /* @__PURE__ */ new Map();
    r.forEach((s) => {
      const a = n?.querySelector(`.react-flow__node[data-id="${s}"]`);
      a && i.set(s, { id: s, nodeElement: a, force: !0 });
    }), requestAnimationFrame(() => o(i, { triggerFitView: !1 }));
  }, []);
}
function dg({ dimensions: e, lineWidth: t, variant: n, className: o }) {
  return T("path", { strokeWidth: t, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: ae(["react-flow__background-pattern", n, o]) });
}
function fg({ radius: e, className: t }) {
  return T("circle", { cx: e, cy: e, r: e, className: ae(["react-flow__background-pattern", "dots", t]) });
}
var Be;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(Be || (Be = {}));
const hg = {
  [Be.Dots]: 1,
  [Be.Lines]: 1,
  [Be.Cross]: 6
}, gg = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function ws({
  id: e,
  variant: t = Be.Dots,
  // only used for dots and cross
  gap: n = 20,
  // only used for lines and cross
  size: o,
  lineWidth: r = 1,
  offset: i = 0,
  color: s,
  bgColor: a,
  style: c,
  className: l,
  patternClassName: u
}) {
  const f = te(null), { transform: d, patternId: h } = ee(gg, ie), g = o || hg[t], v = t === Be.Dots, w = t === Be.Cross, m = Array.isArray(n) ? n : [n, n], b = [m[0] * d[2] || 1, m[1] * d[2] || 1], p = g * d[2], x = Array.isArray(i) ? i : [i, i], N = w ? [p, p] : b, _ = [
    x[0] * d[2] + N[0] / 2,
    x[1] * d[2] + N[1] / 2
  ], C = `${h}${e || ""}`;
  return le("svg", { className: ae(["react-flow__background", l]), style: {
    ...c,
    ...yn,
    "--xy-background-color-props": a,
    "--xy-background-pattern-color-props": s
  }, ref: f, "data-testid": "rf__background", children: [T("pattern", { id: C, x: d[0] % b[0], y: d[1] % b[1], width: b[0], height: b[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${_[0]},-${_[1]})`, children: v ? T(fg, { radius: p / 2, className: u }) : T(dg, { dimensions: N, lineWidth: r, variant: t, className: u }) }), T("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${C})` })] });
}
ws.displayName = "Background";
se(ws);
function pg() {
  return T("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: T("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function mg() {
  return T("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: T("path", { d: "M0 0h32v4.2H0z" }) });
}
function yg() {
  return T("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: T("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function wg() {
  return T("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: T("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function xg() {
  return T("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: T("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function Bt({ children: e, className: t, ...n }) {
  return T("button", { type: "button", className: ae(["react-flow__controls-button", t]), ...n, children: e });
}
const vg = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function xs({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: o = !0, fitViewOptions: r, onZoomIn: i, onZoomOut: s, onFitView: a, onInteractiveChange: c, className: l, children: u, position: f = "bottom-left", orientation: d = "vertical", "aria-label": h }) {
  const g = re(), { isInteractive: v, minZoomReached: w, maxZoomReached: m, ariaLabelConfig: b } = ee(vg, ie), { zoomIn: p, zoomOut: x, fitView: N } = go(), _ = () => {
    p(), i?.();
  }, C = () => {
    x(), s?.();
  }, k = () => {
    N(r), a?.();
  }, I = () => {
    g.setState({
      nodesDraggable: !v,
      nodesConnectable: !v,
      elementsSelectable: !v
    }), c?.(!v);
  };
  return le(mn, { className: ae(["react-flow__controls", d === "horizontal" ? "horizontal" : "vertical", l]), position: f, style: e, "data-testid": "rf__controls", "aria-label": h ?? b["controls.ariaLabel"], children: [t && le(He, { children: [T(Bt, { onClick: _, className: "react-flow__controls-zoomin", title: b["controls.zoomIn.ariaLabel"], "aria-label": b["controls.zoomIn.ariaLabel"], disabled: m, children: T(pg, {}) }), T(Bt, { onClick: C, className: "react-flow__controls-zoomout", title: b["controls.zoomOut.ariaLabel"], "aria-label": b["controls.zoomOut.ariaLabel"], disabled: w, children: T(mg, {}) })] }), n && T(Bt, { className: "react-flow__controls-fitview", onClick: k, title: b["controls.fitView.ariaLabel"], "aria-label": b["controls.fitView.ariaLabel"], children: T(yg, {}) }), o && T(Bt, { className: "react-flow__controls-interactive", onClick: I, title: b["controls.interactive.ariaLabel"], "aria-label": b["controls.interactive.ariaLabel"], children: v ? T(xg, {}) : T(wg, {}) }), u] });
}
xs.displayName = "Controls";
const Yg = se(xs);
function bg({ id: e, x: t, y: n, width: o, height: r, style: i, color: s, strokeColor: a, strokeWidth: c, className: l, borderRadius: u, shapeRendering: f, selected: d, onClick: h }) {
  const { background: g, backgroundColor: v } = i || {}, w = s || g || v;
  return T("rect", { className: ae(["react-flow__minimap-node", { selected: d }, l]), x: t, y: n, rx: u, ry: u, width: o, height: r, style: {
    fill: w,
    stroke: a,
    strokeWidth: c
  }, shapeRendering: f, onClick: h ? (m) => h(m, e) : void 0 });
}
const _g = se(bg), Sg = (e) => e.nodes.map((t) => t.id), Tn = (e) => e instanceof Function ? e : () => e;
function Eg({
  nodeStrokeColor: e,
  nodeColor: t,
  nodeClassName: n = "",
  nodeBorderRadius: o = 5,
  nodeStrokeWidth: r,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: i = _g,
  onClick: s
}) {
  const a = ee(Sg, ie), c = Tn(t), l = Tn(e), u = Tn(n), f = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return T(He, { children: a.map((d) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    T(Cg, { id: d, nodeColorFunc: c, nodeStrokeColorFunc: l, nodeClassNameFunc: u, nodeBorderRadius: o, nodeStrokeWidth: r, NodeComponent: i, onClick: s, shapeRendering: f }, d)
  )) });
}
function Ng({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: o, nodeBorderRadius: r, nodeStrokeWidth: i, shapeRendering: s, NodeComponent: a, onClick: c }) {
  const { node: l, x: u, y: f, width: d, height: h } = ee((g) => {
    const v = g.nodeLookup.get(e);
    if (!v)
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    const w = v.internals.userNode, { x: m, y: b } = v.internals.positionAbsolute, { width: p, height: x } = Se(w);
    return {
      node: w,
      x: m,
      y: b,
      width: p,
      height: x
    };
  }, ie);
  return !l || l.hidden || !wi(l) ? null : T(a, { x: u, y: f, width: d, height: h, style: l.style, selected: !!l.selected, className: o(l), color: t(l), borderRadius: r, strokeColor: n(l), strokeWidth: i, shapeRendering: s, onClick: c, id: l.id });
}
const Cg = se(Ng);
var Mg = se(Eg);
const Ig = 200, kg = 150, Ag = (e) => !e.hidden, $g = (e) => {
  const t = {
    x: -e.transform[0] / e.transform[2],
    y: -e.transform[1] / e.transform[2],
    width: e.width / e.transform[2],
    height: e.height / e.transform[2]
  };
  let n = !1;
  for (const o of e.nodeLookup.values())
    if (!o.hidden) {
      n = !0;
      break;
    }
  return {
    viewBB: t,
    boundingRect: n ? pi(At(e.nodeLookup, { filter: Ag }), t) : t,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, $r = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, Pg = (e, t) => $r(e.viewBB, t.viewBB) && $r(e.boundingRect, t.boundingRect) && e.rfId === t.rfId && e.panZoom === t.panZoom && e.translateExtent === t.translateExtent && e.flowWidth === t.flowWidth && e.flowHeight === t.flowHeight && e.ariaLabelConfig === t.ariaLabelConfig, Dg = "react-flow__minimap-desc";
function vs({
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
  bgColor: c,
  maskColor: l,
  maskStrokeColor: u,
  maskStrokeWidth: f,
  position: d = "bottom-right",
  onClick: h,
  onNodeClick: g,
  pannable: v = !1,
  zoomable: w = !1,
  ariaLabel: m,
  inversePan: b,
  zoomStep: p = 1,
  offsetScale: x = 5
}) {
  const N = re(), _ = te(null), { boundingRect: C, panZoom: k, viewBB: I, rfId: V, translateExtent: P, flowWidth: L, flowHeight: z, ariaLabelConfig: y } = ee($g, Pg), S = e?.width ?? Ig, E = e?.height ?? kg, M = C.width / S, A = C.height / E, $ = Math.max(M, A), R = $ * S, H = $ * E, O = x * $, W = C.x - (R - C.width) / 2 - O, B = C.y - (H - C.height) / 2 - O, q = R + O * 2, Q = H + O * 2, Z = `${Dg}-${V}`, D = te(0), F = te();
  D.current = $, oe(() => {
    const J = N.getState().panZoom;
    if (_.current && J)
      return F.current = qd({
        domNode: _.current,
        panZoom: J,
        getTransform: () => N.getState().transform,
        getViewScale: () => D.current
      }), () => {
        F.current?.destroy();
      };
  }, [k]), oe(() => {
    F.current?.update({
      translateExtent: P,
      width: L,
      height: z,
      inversePan: b,
      pannable: v,
      zoomStep: p,
      zoomable: w
    });
  }, [v, w, b, p, P, L, z]);
  const K = h ? (J) => {
    const [j, ne] = F.current?.pointer(J) || [0, 0];
    h(J, { x: j, y: ne });
  } : void 0, U = we((J, j) => {
    const ne = N.getState().nodeLookup.get(j).internals.userNode;
    g?.(J, ne);
  }, [g]), X = g ? U : void 0, G = m ?? y["minimap.ariaLabel"];
  return T(mn, { position: d, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof c == "string" ? c : void 0,
    "--xy-minimap-mask-background-color-props": typeof l == "string" ? l : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof u == "string" ? u : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof f == "number" ? f * $ : void 0,
    "--xy-minimap-node-background-color-props": typeof o == "string" ? o : void 0,
    "--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
    "--xy-minimap-node-stroke-width-props": typeof s == "number" ? s : void 0
  }, className: ae(["react-flow__minimap", t]), "data-testid": "rf__minimap", children: le("svg", { width: S, height: E, viewBox: `${W} ${B} ${q} ${Q}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": Z, ref: _, onClick: K, children: [G && T("title", { id: Z, children: G }), T(Mg, { onClick: X, nodeColor: o, nodeStrokeColor: n, nodeBorderRadius: i, nodeClassName: r, nodeStrokeWidth: s, nodeComponent: a }), T("path", { className: "react-flow__minimap-mask", d: `M${W - O},${B - O}h${q + O * 2}v${Q + O * 2}h${-q - O * 2}z
        M${I.x},${I.y}h${I.width}v${I.height}h${-I.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
vs.displayName = "MiniMap";
const Zg = se(vs), Tg = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, zg = {
  [lt.Line]: "right",
  [lt.Handle]: "bottom-right"
};
function Hg({ nodeId: e, position: t, variant: n = lt.Handle, className: o, style: r = void 0, children: i, color: s, minWidth: a = 10, minHeight: c = 10, maxWidth: l = Number.MAX_VALUE, maxHeight: u = Number.MAX_VALUE, keepAspectRatio: f = !1, resizeDirection: d, autoScale: h = !0, shouldResize: g, onResizeStart: v, onResize: w, onResizeEnd: m }) {
  const b = Qi(), p = typeof e == "string" ? e : b, x = re(), N = te(null), _ = n === lt.Handle, C = ee(we(Tg(_ && h), [_, h]), ie), k = te(null), I = t ?? zg[n];
  oe(() => {
    if (!(!N.current || !p))
      return k.current || (k.current = af({
        domNode: N.current,
        nodeId: p,
        getStoreItems: () => {
          const { nodeLookup: P, transform: L, snapGrid: z, snapToGrid: y, nodeOrigin: S, domNode: E } = x.getState();
          return {
            nodeLookup: P,
            transform: L,
            snapGrid: z,
            snapToGrid: y,
            nodeOrigin: S,
            paneDomNode: E
          };
        },
        onChange: (P, L) => {
          const { triggerNodeChanges: z, nodeLookup: y, parentLookup: S, nodeOrigin: E } = x.getState(), M = [], A = { x: P.x, y: P.y }, $ = y.get(p);
          if ($ && $.expandParent && $.parentId) {
            const R = $.origin ?? E, H = P.width ?? $.measured.width ?? 0, O = P.height ?? $.measured.height ?? 0, W = {
              id: $.id,
              parentId: $.parentId,
              rect: {
                width: H,
                height: O,
                ...xi({
                  x: P.x ?? $.position.x,
                  y: P.y ?? $.position.y
                }, { width: H, height: O }, $.parentId, y, R)
              }
            }, B = ho([W], y, S, E);
            M.push(...B), A.x = P.x ? Math.max(R[0] * H, P.x) : void 0, A.y = P.y ? Math.max(R[1] * O, P.y) : void 0;
          }
          if (A.x !== void 0 && A.y !== void 0) {
            const R = {
              id: p,
              type: "position",
              position: { ...A }
            };
            M.push(R);
          }
          if (P.width !== void 0 && P.height !== void 0) {
            const H = {
              id: p,
              type: "dimensions",
              resizing: !0,
              setAttributes: d ? d === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: P.width,
                height: P.height
              }
            };
            M.push(H);
          }
          for (const R of L) {
            const H = {
              ...R,
              type: "position"
            };
            M.push(H);
          }
          z(M);
        },
        onEnd: ({ width: P, height: L }) => {
          const z = {
            id: p,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: P,
              height: L
            }
          };
          x.getState().triggerNodeChanges([z]);
        }
      })), k.current.update({
        controlPosition: I,
        boundaries: {
          minWidth: a,
          minHeight: c,
          maxWidth: l,
          maxHeight: u
        },
        keepAspectRatio: f,
        resizeDirection: d,
        onResizeStart: v,
        onResize: w,
        onResizeEnd: m,
        shouldResize: g
      }), () => {
        k.current?.destroy();
      };
  }, [
    I,
    a,
    c,
    l,
    u,
    f,
    v,
    w,
    m,
    g
  ]);
  const V = I.split("-");
  return T("div", { className: ae(["react-flow__resize-control", "nodrag", ...V, n, o]), ref: N, style: {
    ...r,
    scale: C,
    ...s && { [_ ? "backgroundColor" : "borderColor"]: s }
  }, children: i });
}
const Wg = se(Hg);
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-runner"]);
const Un = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-runner");
if (!Un || Object.keys(Un).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-runner");
const Rg = Un.watchRuntimeStream;
async function qg(e) {
  let t = e.initialState;
  const n = await Rg({
    streamApi: e.streamApi,
    requestID: e.requestID,
    lastID: e.lastID || "0-0",
    blockMs: e.blockMs || 15e3,
    signal: e.signal,
    stopOnResult: !0,
    acceptErrorResult: e.acceptErrorResult,
    recoverOnError: e.recoverOnError,
    fallbackToPoll: e.fallbackToPoll,
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
function Gg(e) {
  const t = e?.interaction && typeof e.interaction == "object" && !Array.isArray(e.interaction) ? e.interaction : {};
  return {
    runId: Number(e?.run_id || e?.runId || 0),
    nodeRunId: Number(e?.node_run_id || e?.nodeRunId || 0),
    nodeKey: String(e?.node_key || e?.nodeKey || ""),
    nodeName: String(e?.node_name || e?.nodeName || ""),
    interaction: t
  };
}
export {
  wn as B,
  Yg as C,
  Fg as E,
  on as H,
  Zg as M,
  Wg as N,
  Y as P,
  sg as R,
  Lf as a,
  Vf as b,
  Xg as c,
  Ni as g,
  Bg as i,
  Gg as n,
  go as u,
  qg as w
};
