import { s as fn, t as ln, R as hn } from "./react-C7Xtl8sB.js";
import { g as pn, b as dn } from "./_commonjsHelpers-CTFd9u1x.js";
function gn(t) {
  if (typeof t == "string" || typeof t == "number") return "" + t;
  let e = "";
  if (Array.isArray(t))
    for (let n = 0, r; n < t.length; n++)
      (r = gn(t[n])) !== "" && (e += (e && " ") + r);
  else
    for (let n in t)
      t[n] && (e += (e && " ") + n);
  return e;
}
var mn = { value: () => {
} };
function Ft() {
  for (var t = 0, e = arguments.length, n = {}, r; t < e; ++t) {
    if (!(r = arguments[t] + "") || r in n || /[\s.]/.test(r)) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new kt(n);
}
function kt(t) {
  this._ = t;
}
function yn(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var r = "", i = n.indexOf(".");
    if (i >= 0 && (r = n.slice(i + 1), n = n.slice(0, i)), n && !e.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
kt.prototype = Ft.prototype = {
  constructor: kt,
  on: function(t, e) {
    var n = this._, r = yn(t + "", n), i, u = -1, o = r.length;
    if (arguments.length < 2) {
      for (; ++u < o; ) if ((i = (t = r[u]).type) && (i = _n(n[i], t.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++u < o; )
      if (i = (t = r[u]).type) n[i] = he(n[i], t.name, e);
      else if (e == null) for (i in n) n[i] = he(n[i], t.name, null);
    return this;
  },
  copy: function() {
    var t = {}, e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new kt(t);
  },
  call: function(t, e) {
    if ((i = arguments.length - 2) > 0) for (var n = new Array(i), r = 0, i, u; r < i; ++r) n[r] = arguments[r + 2];
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (u = this._[t], r = 0, i = u.length; r < i; ++r) u[r].value.apply(e, n);
  },
  apply: function(t, e, n) {
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (var r = this._[t], i = 0, u = r.length; i < u; ++i) r[i].value.apply(e, n);
  }
};
function _n(t, e) {
  for (var n = 0, r = t.length, i; n < r; ++n)
    if ((i = t[n]).name === e)
      return i.value;
}
function he(t, e, n) {
  for (var r = 0, i = t.length; r < i; ++r)
    if (t[r].name === e) {
      t[r] = mn, t = t.slice(0, r).concat(t.slice(r + 1));
      break;
    }
  return n != null && t.push({ name: e, value: n }), t;
}
var Qt = "http://www.w3.org/1999/xhtml";
const pe = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Qt,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Ot(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), pe.hasOwnProperty(e) ? { space: pe[e], local: t } : t;
}
function vn(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === Qt && e.documentElement.namespaceURI === Qt ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function wn(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function De(t) {
  var e = Ot(t);
  return (e.local ? wn : vn)(e);
}
function xn() {
}
function ie(t) {
  return t == null ? xn : function() {
    return this.querySelector(t);
  };
}
function bn(t) {
  typeof t != "function" && (t = ie(t));
  for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
    for (var u = e[i], o = u.length, s = r[i] = new Array(o), a, c, f = 0; f < o; ++f)
      (a = u[f]) && (c = t.call(a, a.__data__, f, u)) && ("__data__" in a && (c.__data__ = a.__data__), s[f] = c);
  return new F(r, this._parents);
}
function Sn(t) {
  return t == null ? [] : Array.isArray(t) ? t : Array.from(t);
}
function En() {
  return [];
}
function Ie(t) {
  return t == null ? En : function() {
    return this.querySelectorAll(t);
  };
}
function Nn(t) {
  return function() {
    return Sn(t.apply(this, arguments));
  };
}
function kn(t) {
  typeof t == "function" ? t = Nn(t) : t = Ie(t);
  for (var e = this._groups, n = e.length, r = [], i = [], u = 0; u < n; ++u)
    for (var o = e[u], s = o.length, a, c = 0; c < s; ++c)
      (a = o[c]) && (r.push(t.call(a, a.__data__, c, o)), i.push(a));
  return new F(r, i);
}
function qe(t) {
  return function() {
    return this.matches(t);
  };
}
function Fe(t) {
  return function(e) {
    return e.matches(t);
  };
}
var $n = Array.prototype.find;
function An(t) {
  return function() {
    return $n.call(this.children, t);
  };
}
function Mn() {
  return this.firstElementChild;
}
function Tn(t) {
  return this.select(t == null ? Mn : An(typeof t == "function" ? t : Fe(t)));
}
var zn = Array.prototype.filter;
function Rn() {
  return Array.from(this.children);
}
function Cn(t) {
  return function() {
    return zn.call(this.children, t);
  };
}
function Dn(t) {
  return this.selectAll(t == null ? Rn : Cn(typeof t == "function" ? t : Fe(t)));
}
function In(t) {
  typeof t != "function" && (t = qe(t));
  for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
    for (var u = e[i], o = u.length, s = r[i] = [], a, c = 0; c < o; ++c)
      (a = u[c]) && t.call(a, a.__data__, c, u) && s.push(a);
  return new F(r, this._parents);
}
function Oe(t) {
  return new Array(t.length);
}
function qn() {
  return new F(this._enter || this._groups.map(Oe), this._parents);
}
function Tt(t, e) {
  this.ownerDocument = t.ownerDocument, this.namespaceURI = t.namespaceURI, this._next = null, this._parent = t, this.__data__ = e;
}
Tt.prototype = {
  constructor: Tt,
  appendChild: function(t) {
    return this._parent.insertBefore(t, this._next);
  },
  insertBefore: function(t, e) {
    return this._parent.insertBefore(t, e);
  },
  querySelector: function(t) {
    return this._parent.querySelector(t);
  },
  querySelectorAll: function(t) {
    return this._parent.querySelectorAll(t);
  }
};
function Fn(t) {
  return function() {
    return t;
  };
}
function On(t, e, n, r, i, u) {
  for (var o = 0, s, a = e.length, c = u.length; o < c; ++o)
    (s = e[o]) ? (s.__data__ = u[o], r[o] = s) : n[o] = new Tt(t, u[o]);
  for (; o < a; ++o)
    (s = e[o]) && (i[o] = s);
}
function Vn(t, e, n, r, i, u, o) {
  var s, a, c = /* @__PURE__ */ new Map(), f = e.length, d = u.length, h = new Array(f), m;
  for (s = 0; s < f; ++s)
    (a = e[s]) && (h[s] = m = o.call(a, a.__data__, s, e) + "", c.has(m) ? i[s] = a : c.set(m, a));
  for (s = 0; s < d; ++s)
    m = o.call(t, u[s], s, u) + "", (a = c.get(m)) ? (r[s] = a, a.__data__ = u[s], c.delete(m)) : n[s] = new Tt(t, u[s]);
  for (s = 0; s < f; ++s)
    (a = e[s]) && c.get(h[s]) === a && (i[s] = a);
}
function Xn(t) {
  return t.__data__;
}
function Pn(t, e) {
  if (!arguments.length) return Array.from(this, Xn);
  var n = e ? Vn : On, r = this._parents, i = this._groups;
  typeof t != "function" && (t = Fn(t));
  for (var u = i.length, o = new Array(u), s = new Array(u), a = new Array(u), c = 0; c < u; ++c) {
    var f = r[c], d = i[c], h = d.length, m = Hn(t.call(f, f && f.__data__, c, r)), b = m.length, w = s[c] = new Array(b), A = o[c] = new Array(b), v = a[c] = new Array(h);
    n(f, d, w, A, v, m, e);
    for (var C = 0, T = 0, g, k; C < b; ++C)
      if (g = w[C]) {
        for (C >= T && (T = C + 1); !(k = A[T]) && ++T < b; ) ;
        g._next = k || null;
      }
  }
  return o = new F(o, r), o._enter = s, o._exit = a, o;
}
function Hn(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function Yn() {
  return new F(this._exit || this._groups.map(Oe), this._parents);
}
function Ln(t, e, n) {
  var r = this.enter(), i = this, u = this.exit();
  return typeof t == "function" ? (r = t(r), r && (r = r.selection())) : r = r.append(t + ""), e != null && (i = e(i), i && (i = i.selection())), n == null ? u.remove() : n(u), r && i ? r.merge(i).order() : i;
}
function Wn(t) {
  for (var e = t.selection ? t.selection() : t, n = this._groups, r = e._groups, i = n.length, u = r.length, o = Math.min(i, u), s = new Array(i), a = 0; a < o; ++a)
    for (var c = n[a], f = r[a], d = c.length, h = s[a] = new Array(d), m, b = 0; b < d; ++b)
      (m = c[b] || f[b]) && (h[b] = m);
  for (; a < i; ++a)
    s[a] = n[a];
  return new F(s, this._parents);
}
function Un() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var r = t[e], i = r.length - 1, u = r[i], o; --i >= 0; )
      (o = r[i]) && (u && o.compareDocumentPosition(u) ^ 4 && u.parentNode.insertBefore(o, u), u = o);
  return this;
}
function Gn(t) {
  t || (t = Bn);
  function e(d, h) {
    return d && h ? t(d.__data__, h.__data__) : !d - !h;
  }
  for (var n = this._groups, r = n.length, i = new Array(r), u = 0; u < r; ++u) {
    for (var o = n[u], s = o.length, a = i[u] = new Array(s), c, f = 0; f < s; ++f)
      (c = o[f]) && (a[f] = c);
    a.sort(e);
  }
  return new F(i, this._parents).order();
}
function Bn(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Kn() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function Qn() {
  return Array.from(this);
}
function Zn() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var r = t[e], i = 0, u = r.length; i < u; ++i) {
      var o = r[i];
      if (o) return o;
    }
  return null;
}
function Jn() {
  let t = 0;
  for (const e of this) ++t;
  return t;
}
function jn() {
  return !this.node();
}
function tr(t) {
  for (var e = this._groups, n = 0, r = e.length; n < r; ++n)
    for (var i = e[n], u = 0, o = i.length, s; u < o; ++u)
      (s = i[u]) && t.call(s, s.__data__, u, i);
  return this;
}
function er(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function nr(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function rr(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function ir(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function or(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function ur(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function sr(t, e) {
  var n = Ot(t);
  if (arguments.length < 2) {
    var r = this.node();
    return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
  }
  return this.each((e == null ? n.local ? nr : er : typeof e == "function" ? n.local ? ur : or : n.local ? ir : rr)(n, e));
}
function Ve(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function ar(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function cr(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function fr(t, e, n) {
  return function() {
    var r = e.apply(this, arguments);
    r == null ? this.style.removeProperty(t) : this.style.setProperty(t, r, n);
  };
}
function lr(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? ar : typeof e == "function" ? fr : cr)(t, e, n ?? "")) : st(this.node(), t);
}
function st(t, e) {
  return t.style.getPropertyValue(e) || Ve(t).getComputedStyle(t, null).getPropertyValue(e);
}
function hr(t) {
  return function() {
    delete this[t];
  };
}
function pr(t, e) {
  return function() {
    this[t] = e;
  };
}
function dr(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function gr(t, e) {
  return arguments.length > 1 ? this.each((e == null ? hr : typeof e == "function" ? dr : pr)(t, e)) : this.node()[t];
}
function Xe(t) {
  return t.trim().split(/^|\s+/);
}
function oe(t) {
  return t.classList || new Pe(t);
}
function Pe(t) {
  this._node = t, this._names = Xe(t.getAttribute("class") || "");
}
Pe.prototype = {
  add: function(t) {
    var e = this._names.indexOf(t);
    e < 0 && (this._names.push(t), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(t) {
    var e = this._names.indexOf(t);
    e >= 0 && (this._names.splice(e, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(t) {
    return this._names.indexOf(t) >= 0;
  }
};
function He(t, e) {
  for (var n = oe(t), r = -1, i = e.length; ++r < i; ) n.add(e[r]);
}
function Ye(t, e) {
  for (var n = oe(t), r = -1, i = e.length; ++r < i; ) n.remove(e[r]);
}
function mr(t) {
  return function() {
    He(this, t);
  };
}
function yr(t) {
  return function() {
    Ye(this, t);
  };
}
function _r(t, e) {
  return function() {
    (e.apply(this, arguments) ? He : Ye)(this, t);
  };
}
function vr(t, e) {
  var n = Xe(t + "");
  if (arguments.length < 2) {
    for (var r = oe(this.node()), i = -1, u = n.length; ++i < u; ) if (!r.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? _r : e ? mr : yr)(n, e));
}
function wr() {
  this.textContent = "";
}
function xr(t) {
  return function() {
    this.textContent = t;
  };
}
function br(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function Sr(t) {
  return arguments.length ? this.each(t == null ? wr : (typeof t == "function" ? br : xr)(t)) : this.node().textContent;
}
function Er() {
  this.innerHTML = "";
}
function Nr(t) {
  return function() {
    this.innerHTML = t;
  };
}
function kr(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function $r(t) {
  return arguments.length ? this.each(t == null ? Er : (typeof t == "function" ? kr : Nr)(t)) : this.node().innerHTML;
}
function Ar() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Mr() {
  return this.each(Ar);
}
function Tr() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function zr() {
  return this.each(Tr);
}
function Rr(t) {
  var e = typeof t == "function" ? t : De(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function Cr() {
  return null;
}
function Dr(t, e) {
  var n = typeof t == "function" ? t : De(t), r = e == null ? Cr : typeof e == "function" ? e : ie(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function Ir() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function qr() {
  return this.each(Ir);
}
function Fr() {
  var t = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Or() {
  var t = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Vr(t) {
  return this.select(t ? Or : Fr);
}
function Xr(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
function Pr(t) {
  return function(e) {
    t.call(this, e, this.__data__);
  };
}
function Hr(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", r = e.indexOf(".");
    return r >= 0 && (n = e.slice(r + 1), e = e.slice(0, r)), { type: e, name: n };
  });
}
function Yr(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, r = -1, i = e.length, u; n < i; ++n)
        u = e[n], (!t.type || u.type === t.type) && u.name === t.name ? this.removeEventListener(u.type, u.listener, u.options) : e[++r] = u;
      ++r ? e.length = r : delete this.__on;
    }
  };
}
function Lr(t, e, n) {
  return function() {
    var r = this.__on, i, u = Pr(e);
    if (r) {
      for (var o = 0, s = r.length; o < s; ++o)
        if ((i = r[o]).type === t.type && i.name === t.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = u, i.options = n), i.value = e;
          return;
        }
    }
    this.addEventListener(t.type, u, n), i = { type: t.type, name: t.name, value: e, listener: u, options: n }, r ? r.push(i) : this.__on = [i];
  };
}
function Wr(t, e, n) {
  var r = Hr(t + ""), i, u = r.length, o;
  if (arguments.length < 2) {
    var s = this.node().__on;
    if (s) {
      for (var a = 0, c = s.length, f; a < c; ++a)
        for (i = 0, f = s[a]; i < u; ++i)
          if ((o = r[i]).type === f.type && o.name === f.name)
            return f.value;
    }
    return;
  }
  for (s = e ? Lr : Yr, i = 0; i < u; ++i) this.each(s(r[i], e, n));
  return this;
}
function Le(t, e, n) {
  var r = Ve(t), i = r.CustomEvent;
  typeof i == "function" ? i = new i(e, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(e, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(e, !1, !1)), t.dispatchEvent(i);
}
function Ur(t, e) {
  return function() {
    return Le(this, t, e);
  };
}
function Gr(t, e) {
  return function() {
    return Le(this, t, e.apply(this, arguments));
  };
}
function Br(t, e) {
  return this.each((typeof e == "function" ? Gr : Ur)(t, e));
}
function* Kr() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var r = t[e], i = 0, u = r.length, o; i < u; ++i)
      (o = r[i]) && (yield o);
}
var We = [null];
function F(t, e) {
  this._groups = t, this._parents = e;
}
function yt() {
  return new F([[document.documentElement]], We);
}
function Qr() {
  return this;
}
F.prototype = yt.prototype = {
  constructor: F,
  select: bn,
  selectAll: kn,
  selectChild: Tn,
  selectChildren: Dn,
  filter: In,
  data: Pn,
  enter: qn,
  exit: Yn,
  join: Ln,
  merge: Wn,
  selection: Qr,
  order: Un,
  sort: Gn,
  call: Kn,
  nodes: Qn,
  node: Zn,
  size: Jn,
  empty: jn,
  each: tr,
  attr: sr,
  style: lr,
  property: gr,
  classed: vr,
  text: Sr,
  html: $r,
  raise: Mr,
  lower: zr,
  append: Rr,
  insert: Dr,
  remove: qr,
  clone: Vr,
  datum: Xr,
  on: Wr,
  dispatch: Br,
  [Symbol.iterator]: Kr
};
function J(t) {
  return typeof t == "string" ? new F([[document.querySelector(t)]], [document.documentElement]) : new F([[t]], We);
}
function Zr(t) {
  let e;
  for (; e = t.sourceEvent; ) t = e;
  return t;
}
function Z(t, e) {
  if (t = Zr(t), e === void 0 && (e = t.currentTarget), e) {
    var n = e.ownerSVGElement || e;
    if (n.createSVGPoint) {
      var r = n.createSVGPoint();
      return r.x = t.clientX, r.y = t.clientY, r = r.matrixTransform(e.getScreenCTM().inverse()), [r.x, r.y];
    }
    if (e.getBoundingClientRect) {
      var i = e.getBoundingClientRect();
      return [t.clientX - i.left - e.clientLeft, t.clientY - i.top - e.clientTop];
    }
  }
  return [t.pageX, t.pageY];
}
const Jr = { passive: !1 }, pt = { capture: !0, passive: !1 };
function Ht(t) {
  t.stopImmediatePropagation();
}
function ot(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function Ue(t) {
  var e = t.document.documentElement, n = J(t).on("dragstart.drag", ot, pt);
  "onselectstart" in e ? n.on("selectstart.drag", ot, pt) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function Ge(t, e) {
  var n = t.document.documentElement, r = J(t).on("dragstart.drag", null);
  e && (r.on("click.drag", ot, pt), setTimeout(function() {
    r.on("click.drag", null);
  }, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const xt = (t) => () => t;
function Zt(t, {
  sourceEvent: e,
  subject: n,
  target: r,
  identifier: i,
  active: u,
  x: o,
  y: s,
  dx: a,
  dy: c,
  dispatch: f
}) {
  Object.defineProperties(this, {
    type: { value: t, enumerable: !0, configurable: !0 },
    sourceEvent: { value: e, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: r, enumerable: !0, configurable: !0 },
    identifier: { value: i, enumerable: !0, configurable: !0 },
    active: { value: u, enumerable: !0, configurable: !0 },
    x: { value: o, enumerable: !0, configurable: !0 },
    y: { value: s, enumerable: !0, configurable: !0 },
    dx: { value: a, enumerable: !0, configurable: !0 },
    dy: { value: c, enumerable: !0, configurable: !0 },
    _: { value: f }
  });
}
Zt.prototype.on = function() {
  var t = this._.on.apply(this._, arguments);
  return t === this._ ? this : t;
};
function jr(t) {
  return !t.ctrlKey && !t.button;
}
function ti() {
  return this.parentNode;
}
function ei(t, e) {
  return e ?? { x: t.x, y: t.y };
}
function ni() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function fu() {
  var t = jr, e = ti, n = ei, r = ni, i = {}, u = Ft("start", "drag", "end"), o = 0, s, a, c, f, d = 0;
  function h(g) {
    g.on("mousedown.drag", m).filter(r).on("touchstart.drag", A).on("touchmove.drag", v, Jr).on("touchend.drag touchcancel.drag", C).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function m(g, k) {
    if (!(f || !t.call(this, g, k))) {
      var S = T(this, e.call(this, g, k), g, k, "mouse");
      S && (J(g.view).on("mousemove.drag", b, pt).on("mouseup.drag", w, pt), Ue(g.view), Ht(g), c = !1, s = g.clientX, a = g.clientY, S("start", g));
    }
  }
  function b(g) {
    if (ot(g), !c) {
      var k = g.clientX - s, S = g.clientY - a;
      c = k * k + S * S > d;
    }
    i.mouse("drag", g);
  }
  function w(g) {
    J(g.view).on("mousemove.drag mouseup.drag", null), Ge(g.view, c), ot(g), i.mouse("end", g);
  }
  function A(g, k) {
    if (t.call(this, g, k)) {
      var S = g.changedTouches, $ = e.call(this, g, k), R = S.length, q, V;
      for (q = 0; q < R; ++q)
        (V = T(this, $, g, k, S[q].identifier, S[q])) && (Ht(g), V("start", g, S[q]));
    }
  }
  function v(g) {
    var k = g.changedTouches, S = k.length, $, R;
    for ($ = 0; $ < S; ++$)
      (R = i[k[$].identifier]) && (ot(g), R("drag", g, k[$]));
  }
  function C(g) {
    var k = g.changedTouches, S = k.length, $, R;
    for (f && clearTimeout(f), f = setTimeout(function() {
      f = null;
    }, 500), $ = 0; $ < S; ++$)
      (R = i[k[$].identifier]) && (Ht(g), R("end", g, k[$]));
  }
  function T(g, k, S, $, R, q) {
    var V = u.copy(), O = Z(q || S, k), vt, wt, l;
    if ((l = n.call(g, new Zt("beforestart", {
      sourceEvent: S,
      target: h,
      identifier: R,
      active: o,
      x: O[0],
      y: O[1],
      dx: 0,
      dy: 0,
      dispatch: V
    }), $)) != null)
      return vt = l.x - O[0] || 0, wt = l.y - O[1] || 0, function y(p, _, x) {
        var E = O, N;
        switch (p) {
          case "start":
            i[R] = y, N = o++;
            break;
          case "end":
            delete i[R], --o;
          // falls through
          case "drag":
            O = Z(x || _, k), N = o;
            break;
        }
        V.call(
          p,
          g,
          new Zt(p, {
            sourceEvent: _,
            subject: l,
            target: h,
            identifier: R,
            active: N,
            x: O[0] + vt,
            y: O[1] + wt,
            dx: O[0] - E[0],
            dy: O[1] - E[1],
            dispatch: V
          }),
          $
        );
      };
  }
  return h.filter = function(g) {
    return arguments.length ? (t = typeof g == "function" ? g : xt(!!g), h) : t;
  }, h.container = function(g) {
    return arguments.length ? (e = typeof g == "function" ? g : xt(g), h) : e;
  }, h.subject = function(g) {
    return arguments.length ? (n = typeof g == "function" ? g : xt(g), h) : n;
  }, h.touchable = function(g) {
    return arguments.length ? (r = typeof g == "function" ? g : xt(!!g), h) : r;
  }, h.on = function() {
    var g = u.on.apply(u, arguments);
    return g === u ? h : g;
  }, h.clickDistance = function(g) {
    return arguments.length ? (d = (g = +g) * g, h) : Math.sqrt(d);
  }, h;
}
function ue(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function Be(t, e) {
  var n = Object.create(t.prototype);
  for (var r in e) n[r] = e[r];
  return n;
}
function _t() {
}
var dt = 0.7, zt = 1 / dt, ut = "\\s*([+-]?\\d+)\\s*", gt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", U = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", ri = /^#([0-9a-f]{3,8})$/, ii = new RegExp(`^rgb\\(${ut},${ut},${ut}\\)$`), oi = new RegExp(`^rgb\\(${U},${U},${U}\\)$`), ui = new RegExp(`^rgba\\(${ut},${ut},${ut},${gt}\\)$`), si = new RegExp(`^rgba\\(${U},${U},${U},${gt}\\)$`), ai = new RegExp(`^hsl\\(${gt},${U},${U}\\)$`), ci = new RegExp(`^hsla\\(${gt},${U},${U},${gt}\\)$`), de = {
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
ue(_t, rt, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: ge,
  // Deprecated! Use color.formatHex.
  formatHex: ge,
  formatHex8: fi,
  formatHsl: li,
  formatRgb: me,
  toString: me
});
function ge() {
  return this.rgb().formatHex();
}
function fi() {
  return this.rgb().formatHex8();
}
function li() {
  return Ke(this).formatHsl();
}
function me() {
  return this.rgb().formatRgb();
}
function rt(t) {
  var e, n;
  return t = (t + "").trim().toLowerCase(), (e = ri.exec(t)) ? (n = e[1].length, e = parseInt(e[1], 16), n === 6 ? ye(e) : n === 3 ? new I(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : n === 8 ? bt(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : n === 4 ? bt(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = ii.exec(t)) ? new I(e[1], e[2], e[3], 1) : (e = oi.exec(t)) ? new I(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = ui.exec(t)) ? bt(e[1], e[2], e[3], e[4]) : (e = si.exec(t)) ? bt(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = ai.exec(t)) ? we(e[1], e[2] / 100, e[3] / 100, 1) : (e = ci.exec(t)) ? we(e[1], e[2] / 100, e[3] / 100, e[4]) : de.hasOwnProperty(t) ? ye(de[t]) : t === "transparent" ? new I(NaN, NaN, NaN, 0) : null;
}
function ye(t) {
  return new I(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function bt(t, e, n, r) {
  return r <= 0 && (t = e = n = NaN), new I(t, e, n, r);
}
function hi(t) {
  return t instanceof _t || (t = rt(t)), t ? (t = t.rgb(), new I(t.r, t.g, t.b, t.opacity)) : new I();
}
function Jt(t, e, n, r) {
  return arguments.length === 1 ? hi(t) : new I(t, e, n, r ?? 1);
}
function I(t, e, n, r) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +r;
}
ue(I, Jt, Be(_t, {
  brighter(t) {
    return t = t == null ? zt : Math.pow(zt, t), new I(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? dt : Math.pow(dt, t), new I(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new I(nt(this.r), nt(this.g), nt(this.b), Rt(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: _e,
  // Deprecated! Use color.formatHex.
  formatHex: _e,
  formatHex8: pi,
  formatRgb: ve,
  toString: ve
}));
function _e() {
  return `#${et(this.r)}${et(this.g)}${et(this.b)}`;
}
function pi() {
  return `#${et(this.r)}${et(this.g)}${et(this.b)}${et((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function ve() {
  const t = Rt(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${nt(this.r)}, ${nt(this.g)}, ${nt(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function Rt(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function nt(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function et(t) {
  return t = nt(t), (t < 16 ? "0" : "") + t.toString(16);
}
function we(t, e, n, r) {
  return r <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new H(t, e, n, r);
}
function Ke(t) {
  if (t instanceof H) return new H(t.h, t.s, t.l, t.opacity);
  if (t instanceof _t || (t = rt(t)), !t) return new H();
  if (t instanceof H) return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, r = t.b / 255, i = Math.min(e, n, r), u = Math.max(e, n, r), o = NaN, s = u - i, a = (u + i) / 2;
  return s ? (e === u ? o = (n - r) / s + (n < r) * 6 : n === u ? o = (r - e) / s + 2 : o = (e - n) / s + 4, s /= a < 0.5 ? u + i : 2 - u - i, o *= 60) : s = a > 0 && a < 1 ? 0 : o, new H(o, s, a, t.opacity);
}
function di(t, e, n, r) {
  return arguments.length === 1 ? Ke(t) : new H(t, e, n, r ?? 1);
}
function H(t, e, n, r) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +r;
}
ue(H, di, Be(_t, {
  brighter(t) {
    return t = t == null ? zt : Math.pow(zt, t), new H(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? dt : Math.pow(dt, t), new H(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * e, i = 2 * n - r;
    return new I(
      Yt(t >= 240 ? t - 240 : t + 120, i, r),
      Yt(t, i, r),
      Yt(t < 120 ? t + 240 : t - 120, i, r),
      this.opacity
    );
  },
  clamp() {
    return new H(xe(this.h), St(this.s), St(this.l), Rt(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = Rt(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${xe(this.h)}, ${St(this.s) * 100}%, ${St(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function xe(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function St(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function Yt(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
const se = (t) => () => t;
function gi(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function mi(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(r) {
    return Math.pow(t + r * e, n);
  };
}
function yi(t) {
  return (t = +t) == 1 ? Qe : function(e, n) {
    return n - e ? mi(e, n, t) : se(isNaN(e) ? n : e);
  };
}
function Qe(t, e) {
  var n = e - t;
  return n ? gi(t, n) : se(isNaN(t) ? e : t);
}
const Ct = (function t(e) {
  var n = yi(e);
  function r(i, u) {
    var o = n((i = Jt(i)).r, (u = Jt(u)).r), s = n(i.g, u.g), a = n(i.b, u.b), c = Qe(i.opacity, u.opacity);
    return function(f) {
      return i.r = o(f), i.g = s(f), i.b = a(f), i.opacity = c(f), i + "";
    };
  }
  return r.gamma = t, r;
})(1);
function _i(t, e) {
  e || (e = []);
  var n = t ? Math.min(e.length, t.length) : 0, r = e.slice(), i;
  return function(u) {
    for (i = 0; i < n; ++i) r[i] = t[i] * (1 - u) + e[i] * u;
    return r;
  };
}
function vi(t) {
  return ArrayBuffer.isView(t) && !(t instanceof DataView);
}
function wi(t, e) {
  var n = e ? e.length : 0, r = t ? Math.min(n, t.length) : 0, i = new Array(r), u = new Array(n), o;
  for (o = 0; o < r; ++o) i[o] = Je(t[o], e[o]);
  for (; o < n; ++o) u[o] = e[o];
  return function(s) {
    for (o = 0; o < r; ++o) u[o] = i[o](s);
    return u;
  };
}
function xi(t, e) {
  var n = /* @__PURE__ */ new Date();
  return t = +t, e = +e, function(r) {
    return n.setTime(t * (1 - r) + e * r), n;
  };
}
function W(t, e) {
  return t = +t, e = +e, function(n) {
    return t * (1 - n) + e * n;
  };
}
function bi(t, e) {
  var n = {}, r = {}, i;
  (t === null || typeof t != "object") && (t = {}), (e === null || typeof e != "object") && (e = {});
  for (i in e)
    i in t ? n[i] = Je(t[i], e[i]) : r[i] = e[i];
  return function(u) {
    for (i in n) r[i] = n[i](u);
    return r;
  };
}
var jt = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Lt = new RegExp(jt.source, "g");
function Si(t) {
  return function() {
    return t;
  };
}
function Ei(t) {
  return function(e) {
    return t(e) + "";
  };
}
function Ze(t, e) {
  var n = jt.lastIndex = Lt.lastIndex = 0, r, i, u, o = -1, s = [], a = [];
  for (t = t + "", e = e + ""; (r = jt.exec(t)) && (i = Lt.exec(e)); )
    (u = i.index) > n && (u = e.slice(n, u), s[o] ? s[o] += u : s[++o] = u), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, a.push({ i: o, x: W(r, i) })), n = Lt.lastIndex;
  return n < e.length && (u = e.slice(n), s[o] ? s[o] += u : s[++o] = u), s.length < 2 ? a[0] ? Ei(a[0].x) : Si(e) : (e = a.length, function(c) {
    for (var f = 0, d; f < e; ++f) s[(d = a[f]).i] = d.x(c);
    return s.join("");
  });
}
function Je(t, e) {
  var n = typeof e, r;
  return e == null || n === "boolean" ? se(e) : (n === "number" ? W : n === "string" ? (r = rt(e)) ? (e = r, Ct) : Ze : e instanceof rt ? Ct : e instanceof Date ? xi : vi(e) ? _i : Array.isArray(e) ? wi : typeof e.valueOf != "function" && typeof e.toString != "function" || isNaN(e) ? bi : W)(t, e);
}
var be = 180 / Math.PI, te = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function je(t, e, n, r, i, u) {
  var o, s, a;
  return (o = Math.sqrt(t * t + e * e)) && (t /= o, e /= o), (a = t * n + e * r) && (n -= t * a, r -= e * a), (s = Math.sqrt(n * n + r * r)) && (n /= s, r /= s, a /= s), t * r < e * n && (t = -t, e = -e, a = -a, o = -o), {
    translateX: i,
    translateY: u,
    rotate: Math.atan2(e, t) * be,
    skewX: Math.atan(a) * be,
    scaleX: o,
    scaleY: s
  };
}
var Et;
function Ni(t) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(t + "");
  return e.isIdentity ? te : je(e.a, e.b, e.c, e.d, e.e, e.f);
}
function ki(t) {
  return t == null || (Et || (Et = document.createElementNS("http://www.w3.org/2000/svg", "g")), Et.setAttribute("transform", t), !(t = Et.transform.baseVal.consolidate())) ? te : (t = t.matrix, je(t.a, t.b, t.c, t.d, t.e, t.f));
}
function tn(t, e, n, r) {
  function i(c) {
    return c.length ? c.pop() + " " : "";
  }
  function u(c, f, d, h, m, b) {
    if (c !== d || f !== h) {
      var w = m.push("translate(", null, e, null, n);
      b.push({ i: w - 4, x: W(c, d) }, { i: w - 2, x: W(f, h) });
    } else (d || h) && m.push("translate(" + d + e + h + n);
  }
  function o(c, f, d, h) {
    c !== f ? (c - f > 180 ? f += 360 : f - c > 180 && (c += 360), h.push({ i: d.push(i(d) + "rotate(", null, r) - 2, x: W(c, f) })) : f && d.push(i(d) + "rotate(" + f + r);
  }
  function s(c, f, d, h) {
    c !== f ? h.push({ i: d.push(i(d) + "skewX(", null, r) - 2, x: W(c, f) }) : f && d.push(i(d) + "skewX(" + f + r);
  }
  function a(c, f, d, h, m, b) {
    if (c !== d || f !== h) {
      var w = m.push(i(m) + "scale(", null, ",", null, ")");
      b.push({ i: w - 4, x: W(c, d) }, { i: w - 2, x: W(f, h) });
    } else (d !== 1 || h !== 1) && m.push(i(m) + "scale(" + d + "," + h + ")");
  }
  return function(c, f) {
    var d = [], h = [];
    return c = t(c), f = t(f), u(c.translateX, c.translateY, f.translateX, f.translateY, d, h), o(c.rotate, f.rotate, d, h), s(c.skewX, f.skewX, d, h), a(c.scaleX, c.scaleY, f.scaleX, f.scaleY, d, h), c = f = null, function(m) {
      for (var b = -1, w = h.length, A; ++b < w; ) d[(A = h[b]).i] = A.x(m);
      return d.join("");
    };
  };
}
var $i = tn(Ni, "px, ", "px)", "deg)"), Ai = tn(ki, ", ", ")", ")"), Mi = 1e-12;
function Se(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function Ti(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function zi(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
const Ri = (function t(e, n, r) {
  function i(u, o) {
    var s = u[0], a = u[1], c = u[2], f = o[0], d = o[1], h = o[2], m = f - s, b = d - a, w = m * m + b * b, A, v;
    if (w < Mi)
      v = Math.log(h / c) / e, A = function($) {
        return [
          s + $ * m,
          a + $ * b,
          c * Math.exp(e * $ * v)
        ];
      };
    else {
      var C = Math.sqrt(w), T = (h * h - c * c + r * w) / (2 * c * n * C), g = (h * h - c * c - r * w) / (2 * h * n * C), k = Math.log(Math.sqrt(T * T + 1) - T), S = Math.log(Math.sqrt(g * g + 1) - g);
      v = (S - k) / e, A = function($) {
        var R = $ * v, q = Se(k), V = c / (n * C) * (q * zi(e * R + k) - Ti(k));
        return [
          s + V * m,
          a + V * b,
          c * q / Se(e * R + k)
        ];
      };
    }
    return A.duration = v * 1e3 * e / Math.SQRT2, A;
  }
  return i.rho = function(u) {
    var o = Math.max(1e-3, +u), s = o * o, a = s * s;
    return t(o, s, a);
  }, i;
})(Math.SQRT2, 2, 4);
var at = 0, lt = 0, ct = 0, en = 1e3, Dt, ht, It = 0, it = 0, Vt = 0, mt = typeof performance == "object" && performance.now ? performance : Date, nn = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function ae() {
  return it || (nn(Ci), it = mt.now() + Vt);
}
function Ci() {
  it = 0;
}
function qt() {
  this._call = this._time = this._next = null;
}
qt.prototype = rn.prototype = {
  constructor: qt,
  restart: function(t, e, n) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    n = (n == null ? ae() : +n) + (e == null ? 0 : +e), !this._next && ht !== this && (ht ? ht._next = this : Dt = this, ht = this), this._call = t, this._time = n, ee();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, ee());
  }
};
function rn(t, e, n) {
  var r = new qt();
  return r.restart(t, e, n), r;
}
function Di() {
  ae(), ++at;
  for (var t = Dt, e; t; )
    (e = it - t._time) >= 0 && t._call.call(void 0, e), t = t._next;
  --at;
}
function Ee() {
  it = (It = mt.now()) + Vt, at = lt = 0;
  try {
    Di();
  } finally {
    at = 0, qi(), it = 0;
  }
}
function Ii() {
  var t = mt.now(), e = t - It;
  e > en && (Vt -= e, It = t);
}
function qi() {
  for (var t, e = Dt, n, r = 1 / 0; e; )
    e._call ? (r > e._time && (r = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : Dt = n);
  ht = t, ee(r);
}
function ee(t) {
  if (!at) {
    lt && (lt = clearTimeout(lt));
    var e = t - it;
    e > 24 ? (t < 1 / 0 && (lt = setTimeout(Ee, t - mt.now() - Vt)), ct && (ct = clearInterval(ct))) : (ct || (It = mt.now(), ct = setInterval(Ii, en)), at = 1, nn(Ee));
  }
}
function Ne(t, e, n) {
  var r = new qt();
  return e = e == null ? 0 : +e, r.restart((i) => {
    r.stop(), t(i + e);
  }, e, n), r;
}
var Fi = Ft("start", "end", "cancel", "interrupt"), Oi = [], on = 0, ke = 1, ne = 2, $t = 3, $e = 4, re = 5, At = 6;
function Xt(t, e, n, r, i, u) {
  var o = t.__transition;
  if (!o) t.__transition = {};
  else if (n in o) return;
  Vi(t, n, {
    name: e,
    index: r,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Fi,
    tween: Oi,
    time: u.time,
    delay: u.delay,
    duration: u.duration,
    ease: u.ease,
    timer: null,
    state: on
  });
}
function ce(t, e) {
  var n = Y(t, e);
  if (n.state > on) throw new Error("too late; already scheduled");
  return n;
}
function G(t, e) {
  var n = Y(t, e);
  if (n.state > $t) throw new Error("too late; already running");
  return n;
}
function Y(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error("transition not found");
  return n;
}
function Vi(t, e, n) {
  var r = t.__transition, i;
  r[e] = n, n.timer = rn(u, 0, n.time);
  function u(c) {
    n.state = ke, n.timer.restart(o, n.delay, n.time), n.delay <= c && o(c - n.delay);
  }
  function o(c) {
    var f, d, h, m;
    if (n.state !== ke) return a();
    for (f in r)
      if (m = r[f], m.name === n.name) {
        if (m.state === $t) return Ne(o);
        m.state === $e ? (m.state = At, m.timer.stop(), m.on.call("interrupt", t, t.__data__, m.index, m.group), delete r[f]) : +f < e && (m.state = At, m.timer.stop(), m.on.call("cancel", t, t.__data__, m.index, m.group), delete r[f]);
      }
    if (Ne(function() {
      n.state === $t && (n.state = $e, n.timer.restart(s, n.delay, n.time), s(c));
    }), n.state = ne, n.on.call("start", t, t.__data__, n.index, n.group), n.state === ne) {
      for (n.state = $t, i = new Array(h = n.tween.length), f = 0, d = -1; f < h; ++f)
        (m = n.tween[f].value.call(t, t.__data__, n.index, n.group)) && (i[++d] = m);
      i.length = d + 1;
    }
  }
  function s(c) {
    for (var f = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(a), n.state = re, 1), d = -1, h = i.length; ++d < h; )
      i[d].call(t, f);
    n.state === re && (n.on.call("end", t, t.__data__, n.index, n.group), a());
  }
  function a() {
    n.state = At, n.timer.stop(), delete r[e];
    for (var c in r) return;
    delete t.__transition;
  }
}
function Mt(t, e) {
  var n = t.__transition, r, i, u = !0, o;
  if (n) {
    e = e == null ? null : e + "";
    for (o in n) {
      if ((r = n[o]).name !== e) {
        u = !1;
        continue;
      }
      i = r.state > ne && r.state < re, r.state = At, r.timer.stop(), r.on.call(i ? "interrupt" : "cancel", t, t.__data__, r.index, r.group), delete n[o];
    }
    u && delete t.__transition;
  }
}
function Xi(t) {
  return this.each(function() {
    Mt(this, t);
  });
}
function Pi(t, e) {
  var n, r;
  return function() {
    var i = G(this, t), u = i.tween;
    if (u !== n) {
      r = n = u;
      for (var o = 0, s = r.length; o < s; ++o)
        if (r[o].name === e) {
          r = r.slice(), r.splice(o, 1);
          break;
        }
    }
    i.tween = r;
  };
}
function Hi(t, e, n) {
  var r, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var u = G(this, t), o = u.tween;
    if (o !== r) {
      i = (r = o).slice();
      for (var s = { name: e, value: n }, a = 0, c = i.length; a < c; ++a)
        if (i[a].name === e) {
          i[a] = s;
          break;
        }
      a === c && i.push(s);
    }
    u.tween = i;
  };
}
function Yi(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var r = Y(this.node(), n).tween, i = 0, u = r.length, o; i < u; ++i)
      if ((o = r[i]).name === t)
        return o.value;
    return null;
  }
  return this.each((e == null ? Pi : Hi)(n, t, e));
}
function fe(t, e, n) {
  var r = t._id;
  return t.each(function() {
    var i = G(this, r);
    (i.value || (i.value = {}))[e] = n.apply(this, arguments);
  }), function(i) {
    return Y(i, r).value[e];
  };
}
function un(t, e) {
  var n;
  return (typeof e == "number" ? W : e instanceof rt ? Ct : (n = rt(e)) ? (e = n, Ct) : Ze)(t, e);
}
function Li(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function Wi(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function Ui(t, e, n) {
  var r, i = n + "", u;
  return function() {
    var o = this.getAttribute(t);
    return o === i ? null : o === r ? u : u = e(r = o, n);
  };
}
function Gi(t, e, n) {
  var r, i = n + "", u;
  return function() {
    var o = this.getAttributeNS(t.space, t.local);
    return o === i ? null : o === r ? u : u = e(r = o, n);
  };
}
function Bi(t, e, n) {
  var r, i, u;
  return function() {
    var o, s = n(this), a;
    return s == null ? void this.removeAttribute(t) : (o = this.getAttribute(t), a = s + "", o === a ? null : o === r && a === i ? u : (i = a, u = e(r = o, s)));
  };
}
function Ki(t, e, n) {
  var r, i, u;
  return function() {
    var o, s = n(this), a;
    return s == null ? void this.removeAttributeNS(t.space, t.local) : (o = this.getAttributeNS(t.space, t.local), a = s + "", o === a ? null : o === r && a === i ? u : (i = a, u = e(r = o, s)));
  };
}
function Qi(t, e) {
  var n = Ot(t), r = n === "transform" ? Ai : un;
  return this.attrTween(t, typeof e == "function" ? (n.local ? Ki : Bi)(n, r, fe(this, "attr." + t, e)) : e == null ? (n.local ? Wi : Li)(n) : (n.local ? Gi : Ui)(n, r, e));
}
function Zi(t, e) {
  return function(n) {
    this.setAttribute(t, e.call(this, n));
  };
}
function Ji(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e.call(this, n));
  };
}
function ji(t, e) {
  var n, r;
  function i() {
    var u = e.apply(this, arguments);
    return u !== r && (n = (r = u) && Ji(t, u)), n;
  }
  return i._value = e, i;
}
function to(t, e) {
  var n, r;
  function i() {
    var u = e.apply(this, arguments);
    return u !== r && (n = (r = u) && Zi(t, u)), n;
  }
  return i._value = e, i;
}
function eo(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  var r = Ot(t);
  return this.tween(n, (r.local ? ji : to)(r, e));
}
function no(t, e) {
  return function() {
    ce(this, t).delay = +e.apply(this, arguments);
  };
}
function ro(t, e) {
  return e = +e, function() {
    ce(this, t).delay = e;
  };
}
function io(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? no : ro)(e, t)) : Y(this.node(), e).delay;
}
function oo(t, e) {
  return function() {
    G(this, t).duration = +e.apply(this, arguments);
  };
}
function uo(t, e) {
  return e = +e, function() {
    G(this, t).duration = e;
  };
}
function so(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? oo : uo)(e, t)) : Y(this.node(), e).duration;
}
function ao(t, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    G(this, t).ease = e;
  };
}
function co(t) {
  var e = this._id;
  return arguments.length ? this.each(ao(e, t)) : Y(this.node(), e).ease;
}
function fo(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    G(this, t).ease = n;
  };
}
function lo(t) {
  if (typeof t != "function") throw new Error();
  return this.each(fo(this._id, t));
}
function ho(t) {
  typeof t != "function" && (t = qe(t));
  for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
    for (var u = e[i], o = u.length, s = r[i] = [], a, c = 0; c < o; ++c)
      (a = u[c]) && t.call(a, a.__data__, c, u) && s.push(a);
  return new tt(r, this._parents, this._name, this._id);
}
function po(t) {
  if (t._id !== this._id) throw new Error();
  for (var e = this._groups, n = t._groups, r = e.length, i = n.length, u = Math.min(r, i), o = new Array(r), s = 0; s < u; ++s)
    for (var a = e[s], c = n[s], f = a.length, d = o[s] = new Array(f), h, m = 0; m < f; ++m)
      (h = a[m] || c[m]) && (d[m] = h);
  for (; s < r; ++s)
    o[s] = e[s];
  return new tt(o, this._parents, this._name, this._id);
}
function go(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function mo(t, e, n) {
  var r, i, u = go(e) ? ce : G;
  return function() {
    var o = u(this, t), s = o.on;
    s !== r && (i = (r = s).copy()).on(e, n), o.on = i;
  };
}
function yo(t, e) {
  var n = this._id;
  return arguments.length < 2 ? Y(this.node(), n).on.on(t) : this.each(mo(n, t, e));
}
function _o(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition) if (+n !== t) return;
    e && e.removeChild(this);
  };
}
function vo() {
  return this.on("end.remove", _o(this._id));
}
function wo(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = ie(t));
  for (var r = this._groups, i = r.length, u = new Array(i), o = 0; o < i; ++o)
    for (var s = r[o], a = s.length, c = u[o] = new Array(a), f, d, h = 0; h < a; ++h)
      (f = s[h]) && (d = t.call(f, f.__data__, h, s)) && ("__data__" in f && (d.__data__ = f.__data__), c[h] = d, Xt(c[h], e, n, h, c, Y(f, n)));
  return new tt(u, this._parents, e, n);
}
function xo(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = Ie(t));
  for (var r = this._groups, i = r.length, u = [], o = [], s = 0; s < i; ++s)
    for (var a = r[s], c = a.length, f, d = 0; d < c; ++d)
      if (f = a[d]) {
        for (var h = t.call(f, f.__data__, d, a), m, b = Y(f, n), w = 0, A = h.length; w < A; ++w)
          (m = h[w]) && Xt(m, e, n, w, h, b);
        u.push(h), o.push(f);
      }
  return new tt(u, o, e, n);
}
var bo = yt.prototype.constructor;
function So() {
  return new bo(this._groups, this._parents);
}
function Eo(t, e) {
  var n, r, i;
  return function() {
    var u = st(this, t), o = (this.style.removeProperty(t), st(this, t));
    return u === o ? null : u === n && o === r ? i : i = e(n = u, r = o);
  };
}
function sn(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function No(t, e, n) {
  var r, i = n + "", u;
  return function() {
    var o = st(this, t);
    return o === i ? null : o === r ? u : u = e(r = o, n);
  };
}
function ko(t, e, n) {
  var r, i, u;
  return function() {
    var o = st(this, t), s = n(this), a = s + "";
    return s == null && (a = s = (this.style.removeProperty(t), st(this, t))), o === a ? null : o === r && a === i ? u : (i = a, u = e(r = o, s));
  };
}
function $o(t, e) {
  var n, r, i, u = "style." + e, o = "end." + u, s;
  return function() {
    var a = G(this, t), c = a.on, f = a.value[u] == null ? s || (s = sn(e)) : void 0;
    (c !== n || i !== f) && (r = (n = c).copy()).on(o, i = f), a.on = r;
  };
}
function Ao(t, e, n) {
  var r = (t += "") == "transform" ? $i : un;
  return e == null ? this.styleTween(t, Eo(t, r)).on("end.style." + t, sn(t)) : typeof e == "function" ? this.styleTween(t, ko(t, r, fe(this, "style." + t, e))).each($o(this._id, t)) : this.styleTween(t, No(t, r, e), n).on("end.style." + t, null);
}
function Mo(t, e, n) {
  return function(r) {
    this.style.setProperty(t, e.call(this, r), n);
  };
}
function To(t, e, n) {
  var r, i;
  function u() {
    var o = e.apply(this, arguments);
    return o !== i && (r = (i = o) && Mo(t, o, n)), r;
  }
  return u._value = e, u;
}
function zo(t, e, n) {
  var r = "style." + (t += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (e == null) return this.tween(r, null);
  if (typeof e != "function") throw new Error();
  return this.tween(r, To(t, e, n ?? ""));
}
function Ro(t) {
  return function() {
    this.textContent = t;
  };
}
function Co(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function Do(t) {
  return this.tween("text", typeof t == "function" ? Co(fe(this, "text", t)) : Ro(t == null ? "" : t + ""));
}
function Io(t) {
  return function(e) {
    this.textContent = t.call(this, e);
  };
}
function qo(t) {
  var e, n;
  function r() {
    var i = t.apply(this, arguments);
    return i !== n && (e = (n = i) && Io(i)), e;
  }
  return r._value = t, r;
}
function Fo(t) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (t == null) return this.tween(e, null);
  if (typeof t != "function") throw new Error();
  return this.tween(e, qo(t));
}
function Oo() {
  for (var t = this._name, e = this._id, n = an(), r = this._groups, i = r.length, u = 0; u < i; ++u)
    for (var o = r[u], s = o.length, a, c = 0; c < s; ++c)
      if (a = o[c]) {
        var f = Y(a, e);
        Xt(a, t, n, c, o, {
          time: f.time + f.delay + f.duration,
          delay: 0,
          duration: f.duration,
          ease: f.ease
        });
      }
  return new tt(r, this._parents, t, n);
}
function Vo() {
  var t, e, n = this, r = n._id, i = n.size();
  return new Promise(function(u, o) {
    var s = { value: o }, a = { value: function() {
      --i === 0 && u();
    } };
    n.each(function() {
      var c = G(this, r), f = c.on;
      f !== t && (e = (t = f).copy(), e._.cancel.push(s), e._.interrupt.push(s), e._.end.push(a)), c.on = e;
    }), i === 0 && u();
  });
}
var Xo = 0;
function tt(t, e, n, r) {
  this._groups = t, this._parents = e, this._name = n, this._id = r;
}
function an() {
  return ++Xo;
}
var Q = yt.prototype;
tt.prototype = {
  constructor: tt,
  select: wo,
  selectAll: xo,
  selectChild: Q.selectChild,
  selectChildren: Q.selectChildren,
  filter: ho,
  merge: po,
  selection: So,
  transition: Oo,
  call: Q.call,
  nodes: Q.nodes,
  node: Q.node,
  size: Q.size,
  empty: Q.empty,
  each: Q.each,
  on: yo,
  attr: Qi,
  attrTween: eo,
  style: Ao,
  styleTween: zo,
  text: Do,
  textTween: Fo,
  remove: vo,
  tween: Yi,
  delay: io,
  duration: so,
  ease: co,
  easeVarying: lo,
  end: Vo,
  [Symbol.iterator]: Q[Symbol.iterator]
};
function Po(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var Ho = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Po
};
function Yo(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      throw new Error(`transition ${e} not found`);
  return n;
}
function Lo(t) {
  var e, n;
  t instanceof tt ? (e = t._id, t = t._name) : (e = an(), (n = Ho).time = ae(), t = t == null ? null : t + "");
  for (var r = this._groups, i = r.length, u = 0; u < i; ++u)
    for (var o = r[u], s = o.length, a, c = 0; c < s; ++c)
      (a = o[c]) && Xt(a, t, e, c, o, n || Yo(a, e));
  return new tt(r, this._parents, t, e);
}
yt.prototype.interrupt = Xi;
yt.prototype.transition = Lo;
const Nt = (t) => () => t;
function Wo(t, {
  sourceEvent: e,
  target: n,
  transform: r,
  dispatch: i
}) {
  Object.defineProperties(this, {
    type: { value: t, enumerable: !0, configurable: !0 },
    sourceEvent: { value: e, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: r, enumerable: !0, configurable: !0 },
    _: { value: i }
  });
}
function j(t, e, n) {
  this.k = t, this.x = e, this.y = n;
}
j.prototype = {
  constructor: j,
  scale: function(t) {
    return t === 1 ? this : new j(this.k * t, this.x, this.y);
  },
  translate: function(t, e) {
    return t === 0 & e === 0 ? this : new j(this.k, this.x + this.k * t, this.y + this.k * e);
  },
  apply: function(t) {
    return [t[0] * this.k + this.x, t[1] * this.k + this.y];
  },
  applyX: function(t) {
    return t * this.k + this.x;
  },
  applyY: function(t) {
    return t * this.k + this.y;
  },
  invert: function(t) {
    return [(t[0] - this.x) / this.k, (t[1] - this.y) / this.k];
  },
  invertX: function(t) {
    return (t - this.x) / this.k;
  },
  invertY: function(t) {
    return (t - this.y) / this.k;
  },
  rescaleX: function(t) {
    return t.copy().domain(t.range().map(this.invertX, this).map(t.invert, t));
  },
  rescaleY: function(t) {
    return t.copy().domain(t.range().map(this.invertY, this).map(t.invert, t));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var le = new j(1, 0, 0);
Uo.prototype = j.prototype;
function Uo(t) {
  for (; !t.__zoom; ) if (!(t = t.parentNode)) return le;
  return t.__zoom;
}
function Wt(t) {
  t.stopImmediatePropagation();
}
function ft(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function Go(t) {
  return (!t.ctrlKey || t.type === "wheel") && !t.button;
}
function Bo() {
  var t = this;
  return t instanceof SVGElement ? (t = t.ownerSVGElement || t, t.hasAttribute("viewBox") ? (t = t.viewBox.baseVal, [[t.x, t.y], [t.x + t.width, t.y + t.height]]) : [[0, 0], [t.width.baseVal.value, t.height.baseVal.value]]) : [[0, 0], [t.clientWidth, t.clientHeight]];
}
function Ae() {
  return this.__zoom || le;
}
function Ko(t) {
  return -t.deltaY * (t.deltaMode === 1 ? 0.05 : t.deltaMode ? 1 : 2e-3) * (t.ctrlKey ? 10 : 1);
}
function Qo() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Zo(t, e, n) {
  var r = t.invertX(e[0][0]) - n[0][0], i = t.invertX(e[1][0]) - n[1][0], u = t.invertY(e[0][1]) - n[0][1], o = t.invertY(e[1][1]) - n[1][1];
  return t.translate(
    i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i),
    o > u ? (u + o) / 2 : Math.min(0, u) || Math.max(0, o)
  );
}
function lu() {
  var t = Go, e = Bo, n = Zo, r = Ko, i = Qo, u = [0, 1 / 0], o = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], s = 250, a = Ri, c = Ft("start", "zoom", "end"), f, d, h, m = 500, b = 150, w = 0, A = 10;
  function v(l) {
    l.property("__zoom", Ae).on("wheel.zoom", R, { passive: !1 }).on("mousedown.zoom", q).on("dblclick.zoom", V).filter(i).on("touchstart.zoom", O).on("touchmove.zoom", vt).on("touchend.zoom touchcancel.zoom", wt).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  v.transform = function(l, y, p, _) {
    var x = l.selection ? l.selection() : l;
    x.property("__zoom", Ae), l !== x ? k(l, y, p, _) : x.interrupt().each(function() {
      S(this, arguments).event(_).start().zoom(null, typeof y == "function" ? y.apply(this, arguments) : y).end();
    });
  }, v.scaleBy = function(l, y, p, _) {
    v.scaleTo(l, function() {
      var x = this.__zoom.k, E = typeof y == "function" ? y.apply(this, arguments) : y;
      return x * E;
    }, p, _);
  }, v.scaleTo = function(l, y, p, _) {
    v.transform(l, function() {
      var x = e.apply(this, arguments), E = this.__zoom, N = p == null ? g(x) : typeof p == "function" ? p.apply(this, arguments) : p, M = E.invert(N), z = typeof y == "function" ? y.apply(this, arguments) : y;
      return n(T(C(E, z), N, M), x, o);
    }, p, _);
  }, v.translateBy = function(l, y, p, _) {
    v.transform(l, function() {
      return n(this.__zoom.translate(
        typeof y == "function" ? y.apply(this, arguments) : y,
        typeof p == "function" ? p.apply(this, arguments) : p
      ), e.apply(this, arguments), o);
    }, null, _);
  }, v.translateTo = function(l, y, p, _, x) {
    v.transform(l, function() {
      var E = e.apply(this, arguments), N = this.__zoom, M = _ == null ? g(E) : typeof _ == "function" ? _.apply(this, arguments) : _;
      return n(le.translate(M[0], M[1]).scale(N.k).translate(
        typeof y == "function" ? -y.apply(this, arguments) : -y,
        typeof p == "function" ? -p.apply(this, arguments) : -p
      ), E, o);
    }, _, x);
  };
  function C(l, y) {
    return y = Math.max(u[0], Math.min(u[1], y)), y === l.k ? l : new j(y, l.x, l.y);
  }
  function T(l, y, p) {
    var _ = y[0] - p[0] * l.k, x = y[1] - p[1] * l.k;
    return _ === l.x && x === l.y ? l : new j(l.k, _, x);
  }
  function g(l) {
    return [(+l[0][0] + +l[1][0]) / 2, (+l[0][1] + +l[1][1]) / 2];
  }
  function k(l, y, p, _) {
    l.on("start.zoom", function() {
      S(this, arguments).event(_).start();
    }).on("interrupt.zoom end.zoom", function() {
      S(this, arguments).event(_).end();
    }).tween("zoom", function() {
      var x = this, E = arguments, N = S(x, E).event(_), M = e.apply(x, E), z = p == null ? g(M) : typeof p == "function" ? p.apply(x, E) : p, L = Math.max(M[1][0] - M[0][0], M[1][1] - M[0][1]), D = x.__zoom, X = typeof y == "function" ? y.apply(x, E) : y, B = a(D.invert(z).concat(L / D.k), X.invert(z).concat(L / X.k));
      return function(P) {
        if (P === 1) P = X;
        else {
          var K = B(P), Pt = L / K[2];
          P = new j(Pt, z[0] - K[0] * Pt, z[1] - K[1] * Pt);
        }
        N.zoom(null, P);
      };
    });
  }
  function S(l, y, p) {
    return !p && l.__zooming || new $(l, y);
  }
  function $(l, y) {
    this.that = l, this.args = y, this.active = 0, this.sourceEvent = null, this.extent = e.apply(l, y), this.taps = 0;
  }
  $.prototype = {
    event: function(l) {
      return l && (this.sourceEvent = l), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(l, y) {
      return this.mouse && l !== "mouse" && (this.mouse[1] = y.invert(this.mouse[0])), this.touch0 && l !== "touch" && (this.touch0[1] = y.invert(this.touch0[0])), this.touch1 && l !== "touch" && (this.touch1[1] = y.invert(this.touch1[0])), this.that.__zoom = y, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(l) {
      var y = J(this.that).datum();
      c.call(
        l,
        this.that,
        new Wo(l, {
          sourceEvent: this.sourceEvent,
          target: v,
          transform: this.that.__zoom,
          dispatch: c
        }),
        y
      );
    }
  };
  function R(l, ...y) {
    if (!t.apply(this, arguments)) return;
    var p = S(this, y).event(l), _ = this.__zoom, x = Math.max(u[0], Math.min(u[1], _.k * Math.pow(2, r.apply(this, arguments)))), E = Z(l);
    if (p.wheel)
      (p.mouse[0][0] !== E[0] || p.mouse[0][1] !== E[1]) && (p.mouse[1] = _.invert(p.mouse[0] = E)), clearTimeout(p.wheel);
    else {
      if (_.k === x) return;
      p.mouse = [E, _.invert(E)], Mt(this), p.start();
    }
    ft(l), p.wheel = setTimeout(N, b), p.zoom("mouse", n(T(C(_, x), p.mouse[0], p.mouse[1]), p.extent, o));
    function N() {
      p.wheel = null, p.end();
    }
  }
  function q(l, ...y) {
    if (h || !t.apply(this, arguments)) return;
    var p = l.currentTarget, _ = S(this, y, !0).event(l), x = J(l.view).on("mousemove.zoom", z, !0).on("mouseup.zoom", L, !0), E = Z(l, p), N = l.clientX, M = l.clientY;
    Ue(l.view), Wt(l), _.mouse = [E, this.__zoom.invert(E)], Mt(this), _.start();
    function z(D) {
      if (ft(D), !_.moved) {
        var X = D.clientX - N, B = D.clientY - M;
        _.moved = X * X + B * B > w;
      }
      _.event(D).zoom("mouse", n(T(_.that.__zoom, _.mouse[0] = Z(D, p), _.mouse[1]), _.extent, o));
    }
    function L(D) {
      x.on("mousemove.zoom mouseup.zoom", null), Ge(D.view, _.moved), ft(D), _.event(D).end();
    }
  }
  function V(l, ...y) {
    if (t.apply(this, arguments)) {
      var p = this.__zoom, _ = Z(l.changedTouches ? l.changedTouches[0] : l, this), x = p.invert(_), E = p.k * (l.shiftKey ? 0.5 : 2), N = n(T(C(p, E), _, x), e.apply(this, y), o);
      ft(l), s > 0 ? J(this).transition().duration(s).call(k, N, _, l) : J(this).call(v.transform, N, _, l);
    }
  }
  function O(l, ...y) {
    if (t.apply(this, arguments)) {
      var p = l.touches, _ = p.length, x = S(this, y, l.changedTouches.length === _).event(l), E, N, M, z;
      for (Wt(l), N = 0; N < _; ++N)
        M = p[N], z = Z(M, this), z = [z, this.__zoom.invert(z), M.identifier], x.touch0 ? !x.touch1 && x.touch0[2] !== z[2] && (x.touch1 = z, x.taps = 0) : (x.touch0 = z, E = !0, x.taps = 1 + !!f);
      f && (f = clearTimeout(f)), E && (x.taps < 2 && (d = z[0], f = setTimeout(function() {
        f = null;
      }, m)), Mt(this), x.start());
    }
  }
  function vt(l, ...y) {
    if (this.__zooming) {
      var p = S(this, y).event(l), _ = l.changedTouches, x = _.length, E, N, M, z;
      for (ft(l), E = 0; E < x; ++E)
        N = _[E], M = Z(N, this), p.touch0 && p.touch0[2] === N.identifier ? p.touch0[0] = M : p.touch1 && p.touch1[2] === N.identifier && (p.touch1[0] = M);
      if (N = p.that.__zoom, p.touch1) {
        var L = p.touch0[0], D = p.touch0[1], X = p.touch1[0], B = p.touch1[1], P = (P = X[0] - L[0]) * P + (P = X[1] - L[1]) * P, K = (K = B[0] - D[0]) * K + (K = B[1] - D[1]) * K;
        N = C(N, Math.sqrt(P / K)), M = [(L[0] + X[0]) / 2, (L[1] + X[1]) / 2], z = [(D[0] + B[0]) / 2, (D[1] + B[1]) / 2];
      } else if (p.touch0) M = p.touch0[0], z = p.touch0[1];
      else return;
      p.zoom("touch", n(T(N, M, z), p.extent, o));
    }
  }
  function wt(l, ...y) {
    if (this.__zooming) {
      var p = S(this, y).event(l), _ = l.changedTouches, x = _.length, E, N;
      for (Wt(l), h && clearTimeout(h), h = setTimeout(function() {
        h = null;
      }, m), E = 0; E < x; ++E)
        N = _[E], p.touch0 && p.touch0[2] === N.identifier ? delete p.touch0 : p.touch1 && p.touch1[2] === N.identifier && delete p.touch1;
      if (p.touch1 && !p.touch0 && (p.touch0 = p.touch1, delete p.touch1), p.touch0) p.touch0[1] = this.__zoom.invert(p.touch0[0]);
      else if (p.end(), p.taps === 2 && (N = Z(N, this), Math.hypot(d[0] - N[0], d[1] - N[1]) < A)) {
        var M = J(this).on("dblclick.zoom");
        M && M.apply(this, arguments);
      }
    }
  }
  return v.wheelDelta = function(l) {
    return arguments.length ? (r = typeof l == "function" ? l : Nt(+l), v) : r;
  }, v.filter = function(l) {
    return arguments.length ? (t = typeof l == "function" ? l : Nt(!!l), v) : t;
  }, v.touchable = function(l) {
    return arguments.length ? (i = typeof l == "function" ? l : Nt(!!l), v) : i;
  }, v.extent = function(l) {
    return arguments.length ? (e = typeof l == "function" ? l : Nt([[+l[0][0], +l[0][1]], [+l[1][0], +l[1][1]]]), v) : e;
  }, v.scaleExtent = function(l) {
    return arguments.length ? (u[0] = +l[0], u[1] = +l[1], v) : [u[0], u[1]];
  }, v.translateExtent = function(l) {
    return arguments.length ? (o[0][0] = +l[0][0], o[1][0] = +l[1][0], o[0][1] = +l[0][1], o[1][1] = +l[1][1], v) : [[o[0][0], o[0][1]], [o[1][0], o[1][1]]];
  }, v.constrain = function(l) {
    return arguments.length ? (n = l, v) : n;
  }, v.duration = function(l) {
    return arguments.length ? (s = +l, v) : s;
  }, v.interpolate = function(l) {
    return arguments.length ? (a = l, v) : a;
  }, v.on = function() {
    var l = c.on.apply(c, arguments);
    return l === c ? v : l;
  }, v.clickDistance = function(l) {
    return arguments.length ? (w = (l = +l) * l, v) : Math.sqrt(w);
  }, v.tapDistance = function(l) {
    return arguments.length ? (A = +l, v) : A;
  }, v;
}
var Ut = { exports: {} }, Gt = {};
const cn = /* @__PURE__ */ pn(fn);
var Bt = { exports: {} }, Kt = {};
var Me;
function Jo() {
  if (Me) return Kt;
  Me = 1;
  var t = cn;
  function e(d, h) {
    return d === h && (d !== 0 || 1 / d === 1 / h) || d !== d && h !== h;
  }
  var n = typeof Object.is == "function" ? Object.is : e, r = t.useState, i = t.useEffect, u = t.useLayoutEffect, o = t.useDebugValue;
  function s(d, h) {
    var m = h(), b = r({ inst: { value: m, getSnapshot: h } }), w = b[0].inst, A = b[1];
    return u(
      function() {
        w.value = m, w.getSnapshot = h, a(w) && A({ inst: w });
      },
      [d, m, h]
    ), i(
      function() {
        return a(w) && A({ inst: w }), d(function() {
          a(w) && A({ inst: w });
        });
      },
      [d]
    ), o(m), m;
  }
  function a(d) {
    var h = d.getSnapshot;
    d = d.value;
    try {
      var m = h();
      return !n(d, m);
    } catch {
      return !0;
    }
  }
  function c(d, h) {
    return h();
  }
  var f = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? c : s;
  return Kt.useSyncExternalStore = t.useSyncExternalStore !== void 0 ? t.useSyncExternalStore : f, Kt;
}
var Te;
function jo() {
  return Te || (Te = 1, Bt.exports = Jo()), Bt.exports;
}
var ze;
function tu() {
  if (ze) return Gt;
  ze = 1;
  var t = cn, e = jo();
  function n(c, f) {
    return c === f && (c !== 0 || 1 / c === 1 / f) || c !== c && f !== f;
  }
  var r = typeof Object.is == "function" ? Object.is : n, i = e.useSyncExternalStore, u = t.useRef, o = t.useEffect, s = t.useMemo, a = t.useDebugValue;
  return Gt.useSyncExternalStoreWithSelector = function(c, f, d, h, m) {
    var b = u(null);
    if (b.current === null) {
      var w = { hasValue: !1, value: null };
      b.current = w;
    } else w = b.current;
    b = s(
      function() {
        function v(S) {
          if (!C) {
            if (C = !0, T = S, S = h(S), m !== void 0 && w.hasValue) {
              var $ = w.value;
              if (m($, S))
                return g = $;
            }
            return g = S;
          }
          if ($ = g, r(T, S)) return $;
          var R = h(S);
          return m !== void 0 && m($, R) ? (T = S, $) : (T = S, g = R);
        }
        var C = !1, T, g, k = d === void 0 ? null : d;
        return [
          function() {
            return v(f());
          },
          k === null ? void 0 : function() {
            return v(k());
          }
        ];
      },
      [f, d, h, m]
    );
    var A = i(c, b[0], b[1]);
    return o(
      function() {
        w.hasValue = !0, w.value = A;
      },
      [A]
    ), a(A), A;
  }, Gt;
}
var Re;
function eu() {
  return Re || (Re = 1, Ut.exports = tu()), Ut.exports;
}
var nu = eu();
const ru = /* @__PURE__ */ dn(nu), { useDebugValue: iu } = hn, { useSyncExternalStoreWithSelector: ou } = ru, uu = (t) => t;
function su(t, e = uu, n) {
  const r = ou(
    t.subscribe,
    t.getState,
    t.getServerState || t.getInitialState,
    e,
    n
  );
  return iu(r), r;
}
const Ce = (t, e) => {
  const n = ln(t), r = (i, u = e) => su(n, i, u);
  return Object.assign(r, n), r;
}, hu = (t, e) => t ? Ce(t, e) : Ce;
function pu(t, e) {
  if (Object.is(t, e))
    return !0;
  if (typeof t != "object" || t === null || typeof e != "object" || e === null)
    return !1;
  if (t instanceof Map && e instanceof Map) {
    if (t.size !== e.size) return !1;
    for (const [r, i] of t)
      if (!Object.is(i, e.get(r)))
        return !1;
    return !0;
  }
  if (t instanceof Set && e instanceof Set) {
    if (t.size !== e.size) return !1;
    for (const r of t)
      if (!e.has(r))
        return !1;
    return !0;
  }
  const n = Object.keys(t);
  if (n.length !== Object.keys(e).length)
    return !1;
  for (const r of n)
    if (!Object.prototype.hasOwnProperty.call(e, r) || !Object.is(t[r], e[r]))
      return !1;
  return !0;
}
export {
  Ri as a,
  Je as b,
  hu as c,
  fu as d,
  gn as e,
  pu as f,
  le as i,
  Z as p,
  J as s,
  Uo as t,
  su as u,
  lu as z
};
