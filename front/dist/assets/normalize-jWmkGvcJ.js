import { j as z, a as le, F as He } from "./preloadable-Bomi5PEU.js";
import { n as ka, r as $a, o as Pa, R as Da, a as we, e as Me, u as xe, j as sn, i as ut, g as za, b as ne, f as Lr, m as se, d as ee } from "./_commonjsHelpers-61wyk6v6.js";
import { c as Ta } from "./react-CHwuTySH.js";
import { d as Ha } from "./file-kind-UfTAlHnR.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./normalize-BnuhLJ6X.css", import.meta.url).href]);
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
var Ra = { value: () => {
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
function La(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", r = n.indexOf(".");
    if (r >= 0 && (o = n.slice(r + 1), n = n.slice(0, r)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Ft.prototype = an.prototype = {
  constructor: Ft,
  on: function(e, t) {
    var n = this._, o = La(e + "", n), r, i = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++i < s; ) if ((r = (e = o[i]).type) && (r = Va(n[r], e.name))) return r;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++i < s; )
      if (r = (e = o[i]).type) n[r] = Co(n[r], e.name, t);
      else if (t == null) for (r in n) n[r] = Co(n[r], e.name, null);
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
function Va(e, t) {
  for (var n = 0, o = e.length, r; n < o; ++n)
    if ((r = e[n]).name === t)
      return r.value;
}
function Co(e, t, n) {
  for (var o = 0, r = e.length; o < r; ++o)
    if (e[o].name === t) {
      e[o] = Ra, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var Tn = "http://www.w3.org/1999/xhtml";
const Mo = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Tn,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function cn(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), Mo.hasOwnProperty(t) ? { space: Mo[t], local: e } : e;
}
function Oa(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === Tn && t.documentElement.namespaceURI === Tn ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function Ba(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Vr(e) {
  var t = cn(e);
  return (t.local ? Ba : Oa)(t);
}
function Fa() {
}
function Qn(e) {
  return e == null ? Fa : function() {
    return this.querySelector(e);
  };
}
function Xa(e) {
  typeof e != "function" && (e = Qn(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var i = t[r], s = i.length, a = o[r] = new Array(s), c, l, u = 0; u < s; ++u)
      (c = i[u]) && (l = e.call(c, c.__data__, u, i)) && ("__data__" in c && (l.__data__ = c.__data__), a[u] = l);
  return new fe(o, this._parents);
}
function Ya(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function Za() {
  return [];
}
function Or(e) {
  return e == null ? Za : function() {
    return this.querySelectorAll(e);
  };
}
function Wa(e) {
  return function() {
    return Ya(e.apply(this, arguments));
  };
}
function qa(e) {
  typeof e == "function" ? e = Wa(e) : e = Or(e);
  for (var t = this._groups, n = t.length, o = [], r = [], i = 0; i < n; ++i)
    for (var s = t[i], a = s.length, c, l = 0; l < a; ++l)
      (c = s[l]) && (o.push(e.call(c, c.__data__, l, s)), r.push(c));
  return new fe(o, r);
}
function Br(e) {
  return function() {
    return this.matches(e);
  };
}
function Fr(e) {
  return function(t) {
    return t.matches(e);
  };
}
var Ga = Array.prototype.find;
function Ua(e) {
  return function() {
    return Ga.call(this.children, e);
  };
}
function Ka() {
  return this.firstElementChild;
}
function Qa(e) {
  return this.select(e == null ? Ka : Ua(typeof e == "function" ? e : Fr(e)));
}
var Ja = Array.prototype.filter;
function ja() {
  return Array.from(this.children);
}
function ec(e) {
  return function() {
    return Ja.call(this.children, e);
  };
}
function tc(e) {
  return this.selectAll(e == null ? ja : ec(typeof e == "function" ? e : Fr(e)));
}
function nc(e) {
  typeof e != "function" && (e = Br(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var i = t[r], s = i.length, a = o[r] = [], c, l = 0; l < s; ++l)
      (c = i[l]) && e.call(c, c.__data__, l, i) && a.push(c);
  return new fe(o, this._parents);
}
function Xr(e) {
  return new Array(e.length);
}
function oc() {
  return new fe(this._enter || this._groups.map(Xr), this._parents);
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
function rc(e) {
  return function() {
    return e;
  };
}
function ic(e, t, n, o, r, i) {
  for (var s = 0, a, c = t.length, l = i.length; s < l; ++s)
    (a = t[s]) ? (a.__data__ = i[s], o[s] = a) : n[s] = new qt(e, i[s]);
  for (; s < c; ++s)
    (a = t[s]) && (r[s] = a);
}
function sc(e, t, n, o, r, i, s) {
  var a, c, l = /* @__PURE__ */ new Map(), u = t.length, f = i.length, d = new Array(u), h;
  for (a = 0; a < u; ++a)
    (c = t[a]) && (d[a] = h = s.call(c, c.__data__, a, t) + "", l.has(h) ? r[a] = c : l.set(h, c));
  for (a = 0; a < f; ++a)
    h = s.call(e, i[a], a, i) + "", (c = l.get(h)) ? (o[a] = c, c.__data__ = i[a], l.delete(h)) : n[a] = new qt(e, i[a]);
  for (a = 0; a < u; ++a)
    (c = t[a]) && l.get(d[a]) === c && (r[a] = c);
}
function ac(e) {
  return e.__data__;
}
function cc(e, t) {
  if (!arguments.length) return Array.from(this, ac);
  var n = t ? sc : ic, o = this._parents, r = this._groups;
  typeof e != "function" && (e = rc(e));
  for (var i = r.length, s = new Array(i), a = new Array(i), c = new Array(i), l = 0; l < i; ++l) {
    var u = o[l], f = r[l], d = f.length, h = lc(e.call(u, u && u.__data__, l, o)), g = h.length, v = a[l] = new Array(g), w = s[l] = new Array(g), m = c[l] = new Array(d);
    n(u, f, v, w, m, h, t);
    for (var _ = 0, p = 0, x, C; _ < g; ++_)
      if (x = v[_]) {
        for (_ >= p && (p = _ + 1); !(C = w[p]) && ++p < g; ) ;
        x._next = C || null;
      }
  }
  return s = new fe(s, o), s._enter = a, s._exit = c, s;
}
function lc(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function uc() {
  return new fe(this._exit || this._groups.map(Xr), this._parents);
}
function dc(e, t, n) {
  var o = this.enter(), r = this, i = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (r = t(r), r && (r = r.selection())), n == null ? i.remove() : n(i), o && r ? o.merge(r).order() : r;
}
function fc(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, r = n.length, i = o.length, s = Math.min(r, i), a = new Array(r), c = 0; c < s; ++c)
    for (var l = n[c], u = o[c], f = l.length, d = a[c] = new Array(f), h, g = 0; g < f; ++g)
      (h = l[g] || u[g]) && (d[g] = h);
  for (; c < r; ++c)
    a[c] = n[c];
  return new fe(a, this._parents);
}
function hc() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], r = o.length - 1, i = o[r], s; --r >= 0; )
      (s = o[r]) && (i && s.compareDocumentPosition(i) ^ 4 && i.parentNode.insertBefore(s, i), i = s);
  return this;
}
function gc(e) {
  e || (e = pc);
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
function pc(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function mc() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function yc() {
  return Array.from(this);
}
function wc() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], r = 0, i = o.length; r < i; ++r) {
      var s = o[r];
      if (s) return s;
    }
  return null;
}
function xc() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function vc() {
  return !this.node();
}
function bc(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var r = t[n], i = 0, s = r.length, a; i < s; ++i)
      (a = r[i]) && e.call(a, a.__data__, i, r);
  return this;
}
function _c(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Sc(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Ec(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function Nc(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function Cc(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function Mc(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function Ic(e, t) {
  var n = cn(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? Sc : _c : typeof t == "function" ? n.local ? Mc : Cc : n.local ? Nc : Ec)(n, t));
}
function Yr(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function Ac(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function kc(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function $c(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function Pc(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? Ac : typeof t == "function" ? $c : kc)(e, t, n ?? "")) : rt(this.node(), e);
}
function rt(e, t) {
  return e.style.getPropertyValue(t) || Yr(e).getComputedStyle(e, null).getPropertyValue(t);
}
function Dc(e) {
  return function() {
    delete this[e];
  };
}
function zc(e, t) {
  return function() {
    this[e] = t;
  };
}
function Tc(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function Hc(e, t) {
  return arguments.length > 1 ? this.each((t == null ? Dc : typeof t == "function" ? Tc : zc)(e, t)) : this.node()[e];
}
function Zr(e) {
  return e.trim().split(/^|\s+/);
}
function Jn(e) {
  return e.classList || new Wr(e);
}
function Wr(e) {
  this._node = e, this._names = Zr(e.getAttribute("class") || "");
}
Wr.prototype = {
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
function qr(e, t) {
  for (var n = Jn(e), o = -1, r = t.length; ++o < r; ) n.add(t[o]);
}
function Gr(e, t) {
  for (var n = Jn(e), o = -1, r = t.length; ++o < r; ) n.remove(t[o]);
}
function Rc(e) {
  return function() {
    qr(this, e);
  };
}
function Lc(e) {
  return function() {
    Gr(this, e);
  };
}
function Vc(e, t) {
  return function() {
    (t.apply(this, arguments) ? qr : Gr)(this, e);
  };
}
function Oc(e, t) {
  var n = Zr(e + "");
  if (arguments.length < 2) {
    for (var o = Jn(this.node()), r = -1, i = n.length; ++r < i; ) if (!o.contains(n[r])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? Vc : t ? Rc : Lc)(n, t));
}
function Bc() {
  this.textContent = "";
}
function Fc(e) {
  return function() {
    this.textContent = e;
  };
}
function Xc(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function Yc(e) {
  return arguments.length ? this.each(e == null ? Bc : (typeof e == "function" ? Xc : Fc)(e)) : this.node().textContent;
}
function Zc() {
  this.innerHTML = "";
}
function Wc(e) {
  return function() {
    this.innerHTML = e;
  };
}
function qc(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Gc(e) {
  return arguments.length ? this.each(e == null ? Zc : (typeof e == "function" ? qc : Wc)(e)) : this.node().innerHTML;
}
function Uc() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Kc() {
  return this.each(Uc);
}
function Qc() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Jc() {
  return this.each(Qc);
}
function jc(e) {
  var t = typeof e == "function" ? e : Vr(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function el() {
  return null;
}
function tl(e, t) {
  var n = typeof e == "function" ? e : Vr(e), o = t == null ? el : typeof t == "function" ? t : Qn(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function nl() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function ol() {
  return this.each(nl);
}
function rl() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function il() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function sl(e) {
  return this.select(e ? il : rl);
}
function al(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function cl(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function ll(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function ul(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, r = t.length, i; n < r; ++n)
        i = t[n], (!e.type || i.type === e.type) && i.name === e.name ? this.removeEventListener(i.type, i.listener, i.options) : t[++o] = i;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function dl(e, t, n) {
  return function() {
    var o = this.__on, r, i = cl(t);
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
function fl(e, t, n) {
  var o = ll(e + ""), r, i = o.length, s;
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
  for (a = t ? dl : ul, r = 0; r < i; ++r) this.each(a(o[r], t, n));
  return this;
}
function Ur(e, t, n) {
  var o = Yr(e), r = o.CustomEvent;
  typeof r == "function" ? r = new r(t, n) : (r = o.document.createEvent("Event"), n ? (r.initEvent(t, n.bubbles, n.cancelable), r.detail = n.detail) : r.initEvent(t, !1, !1)), e.dispatchEvent(r);
}
function hl(e, t) {
  return function() {
    return Ur(this, e, t);
  };
}
function gl(e, t) {
  return function() {
    return Ur(this, e, t.apply(this, arguments));
  };
}
function pl(e, t) {
  return this.each((typeof t == "function" ? gl : hl)(e, t));
}
function* ml() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], r = 0, i = o.length, s; r < i; ++r)
      (s = o[r]) && (yield s);
}
var Kr = [null];
function fe(e, t) {
  this._groups = e, this._parents = t;
}
function Mt() {
  return new fe([[document.documentElement]], Kr);
}
function yl() {
  return this;
}
fe.prototype = Mt.prototype = {
  constructor: fe,
  select: Xa,
  selectAll: qa,
  selectChild: Qa,
  selectChildren: tc,
  filter: nc,
  data: cc,
  enter: oc,
  exit: uc,
  join: dc,
  merge: fc,
  selection: yl,
  order: hc,
  sort: gc,
  call: mc,
  nodes: yc,
  node: wc,
  size: xc,
  empty: vc,
  each: bc,
  attr: Ic,
  style: Pc,
  property: Hc,
  classed: Oc,
  text: Yc,
  html: Gc,
  raise: Kc,
  lower: Jc,
  append: jc,
  insert: tl,
  remove: ol,
  clone: sl,
  datum: al,
  on: fl,
  dispatch: pl,
  [Symbol.iterator]: ml
};
function de(e) {
  return typeof e == "string" ? new fe([[document.querySelector(e)]], [document.documentElement]) : new fe([[e]], Kr);
}
function wl(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function ge(e, t) {
  if (e = wl(e), t === void 0 && (t = e.currentTarget), t) {
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
const xl = { passive: !1 }, wt = { capture: !0, passive: !1 };
function _n(e) {
  e.stopImmediatePropagation();
}
function nt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Qr(e) {
  var t = e.document.documentElement, n = de(e).on("dragstart.drag", nt, wt);
  "onselectstart" in t ? n.on("selectstart.drag", nt, wt) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Jr(e, t) {
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
function vl(e) {
  return !e.ctrlKey && !e.button;
}
function bl() {
  return this.parentNode;
}
function _l(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function Sl() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function jr() {
  var e = vl, t = bl, n = _l, o = Sl, r = {}, i = an("start", "drag", "end"), s = 0, a, c, l, u, f = 0;
  function d(x) {
    x.on("mousedown.drag", h).filter(o).on("touchstart.drag", w).on("touchmove.drag", m, xl).on("touchend.drag touchcancel.drag", _).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(x, C) {
    if (!(u || !e.call(this, x, C))) {
      var b = p(this, t.call(this, x, C), x, C, "mouse");
      b && (de(x.view).on("mousemove.drag", g, wt).on("mouseup.drag", v, wt), Qr(x.view), _n(x), l = !1, a = x.clientX, c = x.clientY, b("start", x));
    }
  }
  function g(x) {
    if (nt(x), !l) {
      var C = x.clientX - a, b = x.clientY - c;
      l = C * C + b * b > f;
    }
    r.mouse("drag", x);
  }
  function v(x) {
    de(x.view).on("mousemove.drag mouseup.drag", null), Jr(x.view, l), nt(x), r.mouse("end", x);
  }
  function w(x, C) {
    if (e.call(this, x, C)) {
      var b = x.changedTouches, N = t.call(this, x, C), I = b.length, A, O;
      for (A = 0; A < I; ++A)
        (O = p(this, N, x, C, b[A].identifier, b[A])) && (_n(x), O("start", x, b[A]));
    }
  }
  function m(x) {
    var C = x.changedTouches, b = C.length, N, I;
    for (N = 0; N < b; ++N)
      (I = r[C[N].identifier]) && (nt(x), I("drag", x, C[N]));
  }
  function _(x) {
    var C = x.changedTouches, b = C.length, N, I;
    for (u && clearTimeout(u), u = setTimeout(function() {
      u = null;
    }, 500), N = 0; N < b; ++N)
      (I = r[C[N].identifier]) && (_n(x), I("end", x, C[N]));
  }
  function p(x, C, b, N, I, A) {
    var O = i.copy(), P = ge(A || b, C), R, T, y;
    if ((y = n.call(x, new Hn("beforestart", {
      sourceEvent: b,
      target: d,
      identifier: I,
      active: s,
      x: P[0],
      y: P[1],
      dx: 0,
      dy: 0,
      dispatch: O
    }), N)) != null)
      return R = y.x - P[0] || 0, T = y.y - P[1] || 0, function S(E, M, k) {
        var $ = P, H;
        switch (E) {
          case "start":
            r[I] = S, H = s++;
            break;
          case "end":
            delete r[I], --s;
          // falls through
          case "drag":
            P = ge(k || M, C), H = s;
            break;
        }
        O.call(
          E,
          x,
          new Hn(E, {
            sourceEvent: M,
            subject: y,
            target: d,
            identifier: I,
            active: H,
            x: P[0] + R,
            y: P[1] + T,
            dx: P[0] - $[0],
            dy: P[1] - $[1],
            dispatch: O
          }),
          N
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
function jn(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function ei(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t) n[o] = t[o];
  return n;
}
function It() {
}
var xt = 0.7, Gt = 1 / xt, ot = "\\s*([+-]?\\d+)\\s*", vt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ce = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", El = /^#([0-9a-f]{3,8})$/, Nl = new RegExp(`^rgb\\(${ot},${ot},${ot}\\)$`), Cl = new RegExp(`^rgb\\(${Ce},${Ce},${Ce}\\)$`), Ml = new RegExp(`^rgba\\(${ot},${ot},${ot},${vt}\\)$`), Il = new RegExp(`^rgba\\(${Ce},${Ce},${Ce},${vt}\\)$`), Al = new RegExp(`^hsl\\(${vt},${Ce},${Ce}\\)$`), kl = new RegExp(`^hsla\\(${vt},${Ce},${Ce},${vt}\\)$`), Io = {
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
jn(It, Ue, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Ao,
  // Deprecated! Use color.formatHex.
  formatHex: Ao,
  formatHex8: $l,
  formatHsl: Pl,
  formatRgb: ko,
  toString: ko
});
function Ao() {
  return this.rgb().formatHex();
}
function $l() {
  return this.rgb().formatHex8();
}
function Pl() {
  return ti(this).formatHsl();
}
function ko() {
  return this.rgb().formatRgb();
}
function Ue(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = El.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? $o(t) : n === 3 ? new ue(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? zt(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? zt(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Nl.exec(e)) ? new ue(t[1], t[2], t[3], 1) : (t = Cl.exec(e)) ? new ue(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Ml.exec(e)) ? zt(t[1], t[2], t[3], t[4]) : (t = Il.exec(e)) ? zt(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Al.exec(e)) ? zo(t[1], t[2] / 100, t[3] / 100, 1) : (t = kl.exec(e)) ? zo(t[1], t[2] / 100, t[3] / 100, t[4]) : Io.hasOwnProperty(e) ? $o(Io[e]) : e === "transparent" ? new ue(NaN, NaN, NaN, 0) : null;
}
function $o(e) {
  return new ue(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function zt(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new ue(e, t, n, o);
}
function Dl(e) {
  return e instanceof It || (e = Ue(e)), e ? (e = e.rgb(), new ue(e.r, e.g, e.b, e.opacity)) : new ue();
}
function Rn(e, t, n, o) {
  return arguments.length === 1 ? Dl(e) : new ue(e, t, n, o ?? 1);
}
function ue(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
jn(ue, Rn, ei(It, {
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
  hex: Po,
  // Deprecated! Use color.formatHex.
  formatHex: Po,
  formatHex8: zl,
  formatRgb: Do,
  toString: Do
}));
function Po() {
  return `#${We(this.r)}${We(this.g)}${We(this.b)}`;
}
function zl() {
  return `#${We(this.r)}${We(this.g)}${We(this.b)}${We((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Do() {
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
function zo(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new pe(e, t, n, o);
}
function ti(e) {
  if (e instanceof pe) return new pe(e.h, e.s, e.l, e.opacity);
  if (e instanceof It || (e = Ue(e)), !e) return new pe();
  if (e instanceof pe) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, r = Math.min(t, n, o), i = Math.max(t, n, o), s = NaN, a = i - r, c = (i + r) / 2;
  return a ? (t === i ? s = (n - o) / a + (n < o) * 6 : n === i ? s = (o - t) / a + 2 : s = (t - n) / a + 4, a /= c < 0.5 ? i + r : 2 - i - r, s *= 60) : a = c > 0 && c < 1 ? 0 : s, new pe(s, a, c, e.opacity);
}
function Tl(e, t, n, o) {
  return arguments.length === 1 ? ti(e) : new pe(e, t, n, o ?? 1);
}
function pe(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
jn(pe, Tl, ei(It, {
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
    return new pe(To(this.h), Tt(this.s), Tt(this.l), Ut(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Ut(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${To(this.h)}, ${Tt(this.s) * 100}%, ${Tt(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function To(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Tt(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Sn(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const eo = (e) => () => e;
function Hl(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function Rl(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function Ll(e) {
  return (e = +e) == 1 ? ni : function(t, n) {
    return n - t ? Rl(t, n, e) : eo(isNaN(t) ? n : t);
  };
}
function ni(e, t) {
  var n = t - e;
  return n ? Hl(e, n) : eo(isNaN(e) ? t : e);
}
const Kt = (function e(t) {
  var n = Ll(t);
  function o(r, i) {
    var s = n((r = Rn(r)).r, (i = Rn(i)).r), a = n(r.g, i.g), c = n(r.b, i.b), l = ni(r.opacity, i.opacity);
    return function(u) {
      return r.r = s(u), r.g = a(u), r.b = c(u), r.opacity = l(u), r + "";
    };
  }
  return o.gamma = e, o;
})(1);
function Vl(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, o = t.slice(), r;
  return function(i) {
    for (r = 0; r < n; ++r) o[r] = e[r] * (1 - i) + t[r] * i;
    return o;
  };
}
function Ol(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Bl(e, t) {
  var n = t ? t.length : 0, o = e ? Math.min(n, e.length) : 0, r = new Array(o), i = new Array(n), s;
  for (s = 0; s < o; ++s) r[s] = mt(e[s], t[s]);
  for (; s < n; ++s) i[s] = t[s];
  return function(a) {
    for (s = 0; s < o; ++s) i[s] = r[s](a);
    return i;
  };
}
function Fl(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(o) {
    return n.setTime(e * (1 - o) + t * o), n;
  };
}
function Ne(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function Xl(e, t) {
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
function Yl(e) {
  return function() {
    return e;
  };
}
function Zl(e) {
  return function(t) {
    return e(t) + "";
  };
}
function oi(e, t) {
  var n = Ln.lastIndex = En.lastIndex = 0, o, r, i, s = -1, a = [], c = [];
  for (e = e + "", t = t + ""; (o = Ln.exec(e)) && (r = En.exec(t)); )
    (i = r.index) > n && (i = t.slice(n, i), a[s] ? a[s] += i : a[++s] = i), (o = o[0]) === (r = r[0]) ? a[s] ? a[s] += r : a[++s] = r : (a[++s] = null, c.push({ i: s, x: Ne(o, r) })), n = En.lastIndex;
  return n < t.length && (i = t.slice(n), a[s] ? a[s] += i : a[++s] = i), a.length < 2 ? c[0] ? Zl(c[0].x) : Yl(t) : (t = c.length, function(l) {
    for (var u = 0, f; u < t; ++u) a[(f = c[u]).i] = f.x(l);
    return a.join("");
  });
}
function mt(e, t) {
  var n = typeof t, o;
  return t == null || n === "boolean" ? eo(t) : (n === "number" ? Ne : n === "string" ? (o = Ue(t)) ? (t = o, Kt) : oi : t instanceof Ue ? Kt : t instanceof Date ? Fl : Ol(t) ? Vl : Array.isArray(t) ? Bl : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Xl : Ne)(e, t);
}
var Ho = 180 / Math.PI, Vn = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function ri(e, t, n, o, r, i) {
  var s, a, c;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (c = e * n + t * o) && (n -= e * c, o -= t * c), (a = Math.sqrt(n * n + o * o)) && (n /= a, o /= a, c /= a), e * o < t * n && (e = -e, t = -t, c = -c, s = -s), {
    translateX: r,
    translateY: i,
    rotate: Math.atan2(t, e) * Ho,
    skewX: Math.atan(c) * Ho,
    scaleX: s,
    scaleY: a
  };
}
var Ht;
function Wl(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? Vn : ri(t.a, t.b, t.c, t.d, t.e, t.f);
}
function ql(e) {
  return e == null || (Ht || (Ht = document.createElementNS("http://www.w3.org/2000/svg", "g")), Ht.setAttribute("transform", e), !(e = Ht.transform.baseVal.consolidate())) ? Vn : (e = e.matrix, ri(e.a, e.b, e.c, e.d, e.e, e.f));
}
function ii(e, t, n, o) {
  function r(l) {
    return l.length ? l.pop() + " " : "";
  }
  function i(l, u, f, d, h, g) {
    if (l !== f || u !== d) {
      var v = h.push("translate(", null, t, null, n);
      g.push({ i: v - 4, x: Ne(l, f) }, { i: v - 2, x: Ne(u, d) });
    } else (f || d) && h.push("translate(" + f + t + d + n);
  }
  function s(l, u, f, d) {
    l !== u ? (l - u > 180 ? u += 360 : u - l > 180 && (l += 360), d.push({ i: f.push(r(f) + "rotate(", null, o) - 2, x: Ne(l, u) })) : u && f.push(r(f) + "rotate(" + u + o);
  }
  function a(l, u, f, d) {
    l !== u ? d.push({ i: f.push(r(f) + "skewX(", null, o) - 2, x: Ne(l, u) }) : u && f.push(r(f) + "skewX(" + u + o);
  }
  function c(l, u, f, d, h, g) {
    if (l !== f || u !== d) {
      var v = h.push(r(h) + "scale(", null, ",", null, ")");
      g.push({ i: v - 4, x: Ne(l, f) }, { i: v - 2, x: Ne(u, d) });
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
var Gl = ii(Wl, "px, ", "px)", "deg)"), Ul = ii(ql, ", ", ")", ")"), Kl = 1e-12;
function Ro(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function Ql(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function Jl(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const Xt = (function e(t, n, o) {
  function r(i, s) {
    var a = i[0], c = i[1], l = i[2], u = s[0], f = s[1], d = s[2], h = u - a, g = f - c, v = h * h + g * g, w, m;
    if (v < Kl)
      m = Math.log(d / l) / t, w = function(N) {
        return [
          a + N * h,
          c + N * g,
          l * Math.exp(t * N * m)
        ];
      };
    else {
      var _ = Math.sqrt(v), p = (d * d - l * l + o * v) / (2 * l * n * _), x = (d * d - l * l - o * v) / (2 * d * n * _), C = Math.log(Math.sqrt(p * p + 1) - p), b = Math.log(Math.sqrt(x * x + 1) - x);
      m = (b - C) / t, w = function(N) {
        var I = N * m, A = Ro(C), O = l / (n * _) * (A * Jl(t * I + C) - Ql(C));
        return [
          a + O * h,
          c + O * g,
          l * A / Ro(t * I + C)
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
var it = 0, gt = 0, ft = 0, si = 1e3, Qt, pt, Jt = 0, Ke = 0, ln = 0, bt = typeof performance == "object" && performance.now ? performance : Date, ai = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function to() {
  return Ke || (ai(jl), Ke = bt.now() + ln);
}
function jl() {
  Ke = 0;
}
function jt() {
  this._call = this._time = this._next = null;
}
jt.prototype = ci.prototype = {
  constructor: jt,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? to() : +n) + (t == null ? 0 : +t), !this._next && pt !== this && (pt ? pt._next = this : Qt = this, pt = this), this._call = e, this._time = n, On();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, On());
  }
};
function ci(e, t, n) {
  var o = new jt();
  return o.restart(e, t, n), o;
}
function eu() {
  to(), ++it;
  for (var e = Qt, t; e; )
    (t = Ke - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --it;
}
function Lo() {
  Ke = (Jt = bt.now()) + ln, it = gt = 0;
  try {
    eu();
  } finally {
    it = 0, nu(), Ke = 0;
  }
}
function tu() {
  var e = bt.now(), t = e - Jt;
  t > si && (ln -= t, Jt = e);
}
function nu() {
  for (var e, t = Qt, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Qt = n);
  pt = e, On(o);
}
function On(e) {
  if (!it) {
    gt && (gt = clearTimeout(gt));
    var t = e - Ke;
    t > 24 ? (e < 1 / 0 && (gt = setTimeout(Lo, e - bt.now() - ln)), ft && (ft = clearInterval(ft))) : (ft || (Jt = bt.now(), ft = setInterval(tu, si)), it = 1, ai(Lo));
  }
}
function Vo(e, t, n) {
  var o = new jt();
  return t = t == null ? 0 : +t, o.restart((r) => {
    o.stop(), e(r + t);
  }, t, n), o;
}
var ou = an("start", "end", "cancel", "interrupt"), ru = [], li = 0, Oo = 1, Bn = 2, Yt = 3, Bo = 4, Fn = 5, Zt = 6;
function un(e, t, n, o, r, i) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  iu(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: r,
    // For context during callback.
    on: ou,
    tween: ru,
    time: i.time,
    delay: i.delay,
    duration: i.duration,
    ease: i.ease,
    timer: null,
    state: li
  });
}
function no(e, t) {
  var n = be(e, t);
  if (n.state > li) throw new Error("too late; already scheduled");
  return n;
}
function Ie(e, t) {
  var n = be(e, t);
  if (n.state > Yt) throw new Error("too late; already running");
  return n;
}
function be(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function iu(e, t, n) {
  var o = e.__transition, r;
  o[t] = n, n.timer = ci(i, 0, n.time);
  function i(l) {
    n.state = Oo, n.timer.restart(s, n.delay, n.time), n.delay <= l && s(l - n.delay);
  }
  function s(l) {
    var u, f, d, h;
    if (n.state !== Oo) return c();
    for (u in o)
      if (h = o[u], h.name === n.name) {
        if (h.state === Yt) return Vo(s);
        h.state === Bo ? (h.state = Zt, h.timer.stop(), h.on.call("interrupt", e, e.__data__, h.index, h.group), delete o[u]) : +u < t && (h.state = Zt, h.timer.stop(), h.on.call("cancel", e, e.__data__, h.index, h.group), delete o[u]);
      }
    if (Vo(function() {
      n.state === Yt && (n.state = Bo, n.timer.restart(a, n.delay, n.time), a(l));
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
function su(e) {
  return this.each(function() {
    Wt(this, e);
  });
}
function au(e, t) {
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
function cu(e, t, n) {
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
function lu(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = be(this.node(), n).tween, r = 0, i = o.length, s; r < i; ++r)
      if ((s = o[r]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? au : cu)(n, e, t));
}
function oo(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var r = Ie(this, o);
    (r.value || (r.value = {}))[t] = n.apply(this, arguments);
  }), function(r) {
    return be(r, o).value[t];
  };
}
function ui(e, t) {
  var n;
  return (typeof t == "number" ? Ne : t instanceof Ue ? Kt : (n = Ue(t)) ? (t = n, Kt) : oi)(e, t);
}
function uu(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function du(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function fu(e, t, n) {
  var o, r = n + "", i;
  return function() {
    var s = this.getAttribute(e);
    return s === r ? null : s === o ? i : i = t(o = s, n);
  };
}
function hu(e, t, n) {
  var o, r = n + "", i;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === r ? null : s === o ? i : i = t(o = s, n);
  };
}
function gu(e, t, n) {
  var o, r, i;
  return function() {
    var s, a = n(this), c;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), c = a + "", s === c ? null : s === o && c === r ? i : (r = c, i = t(o = s, a)));
  };
}
function pu(e, t, n) {
  var o, r, i;
  return function() {
    var s, a = n(this), c;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), c = a + "", s === c ? null : s === o && c === r ? i : (r = c, i = t(o = s, a)));
  };
}
function mu(e, t) {
  var n = cn(e), o = n === "transform" ? Ul : ui;
  return this.attrTween(e, typeof t == "function" ? (n.local ? pu : gu)(n, o, oo(this, "attr." + e, t)) : t == null ? (n.local ? du : uu)(n) : (n.local ? hu : fu)(n, o, t));
}
function yu(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function wu(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function xu(e, t) {
  var n, o;
  function r() {
    var i = t.apply(this, arguments);
    return i !== o && (n = (o = i) && wu(e, i)), n;
  }
  return r._value = t, r;
}
function vu(e, t) {
  var n, o;
  function r() {
    var i = t.apply(this, arguments);
    return i !== o && (n = (o = i) && yu(e, i)), n;
  }
  return r._value = t, r;
}
function bu(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var o = cn(e);
  return this.tween(n, (o.local ? xu : vu)(o, t));
}
function _u(e, t) {
  return function() {
    no(this, e).delay = +t.apply(this, arguments);
  };
}
function Su(e, t) {
  return t = +t, function() {
    no(this, e).delay = t;
  };
}
function Eu(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? _u : Su)(t, e)) : be(this.node(), t).delay;
}
function Nu(e, t) {
  return function() {
    Ie(this, e).duration = +t.apply(this, arguments);
  };
}
function Cu(e, t) {
  return t = +t, function() {
    Ie(this, e).duration = t;
  };
}
function Mu(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Nu : Cu)(t, e)) : be(this.node(), t).duration;
}
function Iu(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    Ie(this, e).ease = t;
  };
}
function Au(e) {
  var t = this._id;
  return arguments.length ? this.each(Iu(t, e)) : be(this.node(), t).ease;
}
function ku(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Ie(this, e).ease = n;
  };
}
function $u(e) {
  if (typeof e != "function") throw new Error();
  return this.each(ku(this._id, e));
}
function Pu(e) {
  typeof e != "function" && (e = Br(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var i = t[r], s = i.length, a = o[r] = [], c, l = 0; l < s; ++l)
      (c = i[l]) && e.call(c, c.__data__, l, i) && a.push(c);
  return new Te(o, this._parents, this._name, this._id);
}
function Du(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, r = n.length, i = Math.min(o, r), s = new Array(o), a = 0; a < i; ++a)
    for (var c = t[a], l = n[a], u = c.length, f = s[a] = new Array(u), d, h = 0; h < u; ++h)
      (d = c[h] || l[h]) && (f[h] = d);
  for (; a < o; ++a)
    s[a] = t[a];
  return new Te(s, this._parents, this._name, this._id);
}
function zu(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function Tu(e, t, n) {
  var o, r, i = zu(t) ? no : Ie;
  return function() {
    var s = i(this, e), a = s.on;
    a !== o && (r = (o = a).copy()).on(t, n), s.on = r;
  };
}
function Hu(e, t) {
  var n = this._id;
  return arguments.length < 2 ? be(this.node(), n).on.on(e) : this.each(Tu(n, e, t));
}
function Ru(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function Lu() {
  return this.on("end.remove", Ru(this._id));
}
function Vu(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Qn(e));
  for (var o = this._groups, r = o.length, i = new Array(r), s = 0; s < r; ++s)
    for (var a = o[s], c = a.length, l = i[s] = new Array(c), u, f, d = 0; d < c; ++d)
      (u = a[d]) && (f = e.call(u, u.__data__, d, a)) && ("__data__" in u && (f.__data__ = u.__data__), l[d] = f, un(l[d], t, n, d, l, be(u, n)));
  return new Te(i, this._parents, t, n);
}
function Ou(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Or(e));
  for (var o = this._groups, r = o.length, i = [], s = [], a = 0; a < r; ++a)
    for (var c = o[a], l = c.length, u, f = 0; f < l; ++f)
      if (u = c[f]) {
        for (var d = e.call(u, u.__data__, f, c), h, g = be(u, n), v = 0, w = d.length; v < w; ++v)
          (h = d[v]) && un(h, t, n, v, d, g);
        i.push(d), s.push(u);
      }
  return new Te(i, s, t, n);
}
var Bu = Mt.prototype.constructor;
function Fu() {
  return new Bu(this._groups, this._parents);
}
function Xu(e, t) {
  var n, o, r;
  return function() {
    var i = rt(this, e), s = (this.style.removeProperty(e), rt(this, e));
    return i === s ? null : i === n && s === o ? r : r = t(n = i, o = s);
  };
}
function di(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Yu(e, t, n) {
  var o, r = n + "", i;
  return function() {
    var s = rt(this, e);
    return s === r ? null : s === o ? i : i = t(o = s, n);
  };
}
function Zu(e, t, n) {
  var o, r, i;
  return function() {
    var s = rt(this, e), a = n(this), c = a + "";
    return a == null && (c = a = (this.style.removeProperty(e), rt(this, e))), s === c ? null : s === o && c === r ? i : (r = c, i = t(o = s, a));
  };
}
function Wu(e, t) {
  var n, o, r, i = "style." + t, s = "end." + i, a;
  return function() {
    var c = Ie(this, e), l = c.on, u = c.value[i] == null ? a || (a = di(t)) : void 0;
    (l !== n || r !== u) && (o = (n = l).copy()).on(s, r = u), c.on = o;
  };
}
function qu(e, t, n) {
  var o = (e += "") == "transform" ? Gl : ui;
  return t == null ? this.styleTween(e, Xu(e, o)).on("end.style." + e, di(e)) : typeof t == "function" ? this.styleTween(e, Zu(e, o, oo(this, "style." + e, t))).each(Wu(this._id, e)) : this.styleTween(e, Yu(e, o, t), n).on("end.style." + e, null);
}
function Gu(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function Uu(e, t, n) {
  var o, r;
  function i() {
    var s = t.apply(this, arguments);
    return s !== r && (o = (r = s) && Gu(e, s, n)), o;
  }
  return i._value = t, i;
}
function Ku(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (t == null) return this.tween(o, null);
  if (typeof t != "function") throw new Error();
  return this.tween(o, Uu(e, t, n ?? ""));
}
function Qu(e) {
  return function() {
    this.textContent = e;
  };
}
function Ju(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function ju(e) {
  return this.tween("text", typeof e == "function" ? Ju(oo(this, "text", e)) : Qu(e == null ? "" : e + ""));
}
function ed(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function td(e) {
  var t, n;
  function o() {
    var r = e.apply(this, arguments);
    return r !== n && (t = (n = r) && ed(r)), t;
  }
  return o._value = e, o;
}
function nd(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, td(e));
}
function od() {
  for (var e = this._name, t = this._id, n = fi(), o = this._groups, r = o.length, i = 0; i < r; ++i)
    for (var s = o[i], a = s.length, c, l = 0; l < a; ++l)
      if (c = s[l]) {
        var u = be(c, t);
        un(c, e, n, l, s, {
          time: u.time + u.delay + u.duration,
          delay: 0,
          duration: u.duration,
          ease: u.ease
        });
      }
  return new Te(o, this._parents, e, n);
}
function rd() {
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
var id = 0;
function Te(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function fi() {
  return ++id;
}
var De = Mt.prototype;
Te.prototype = {
  constructor: Te,
  select: Vu,
  selectAll: Ou,
  selectChild: De.selectChild,
  selectChildren: De.selectChildren,
  filter: Pu,
  merge: Du,
  selection: Fu,
  transition: od,
  call: De.call,
  nodes: De.nodes,
  node: De.node,
  size: De.size,
  empty: De.empty,
  each: De.each,
  on: Hu,
  attr: mu,
  attrTween: bu,
  style: qu,
  styleTween: Ku,
  text: ju,
  textTween: nd,
  remove: Lu,
  tween: lu,
  delay: Eu,
  duration: Mu,
  ease: Au,
  easeVarying: $u,
  end: rd,
  [Symbol.iterator]: De[Symbol.iterator]
};
function sd(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var ad = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: sd
};
function cd(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function ld(e) {
  var t, n;
  e instanceof Te ? (t = e._id, e = e._name) : (t = fi(), (n = ad).time = to(), e = e == null ? null : e + "");
  for (var o = this._groups, r = o.length, i = 0; i < r; ++i)
    for (var s = o[i], a = s.length, c, l = 0; l < a; ++l)
      (c = s[l]) && un(c, e, t, l, s, n || cd(c, t));
  return new Te(o, this._parents, e, t);
}
Mt.prototype.interrupt = su;
Mt.prototype.transition = ld;
const Rt = (e) => () => e;
function ud(e, {
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
hi.prototype = ze.prototype;
function hi(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return dn;
  return e.__zoom;
}
function Nn(e) {
  e.stopImmediatePropagation();
}
function ht(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function dd(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function fd() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Fo() {
  return this.__zoom || dn;
}
function hd(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function gd() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function pd(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], r = e.invertX(t[1][0]) - n[1][0], i = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    r > o ? (o + r) / 2 : Math.min(0, o) || Math.max(0, r),
    s > i ? (i + s) / 2 : Math.min(0, i) || Math.max(0, s)
  );
}
function gi() {
  var e = dd, t = fd, n = pd, o = hd, r = gd, i = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, c = Xt, l = an("start", "zoom", "end"), u, f, d, h = 500, g = 150, v = 0, w = 10;
  function m(y) {
    y.property("__zoom", Fo).on("wheel.zoom", I, { passive: !1 }).on("mousedown.zoom", A).on("dblclick.zoom", O).filter(r).on("touchstart.zoom", P).on("touchmove.zoom", R).on("touchend.zoom touchcancel.zoom", T).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(y, S, E, M) {
    var k = y.selection ? y.selection() : y;
    k.property("__zoom", Fo), y !== k ? C(y, S, E, M) : k.interrupt().each(function() {
      b(this, arguments).event(M).start().zoom(null, typeof S == "function" ? S.apply(this, arguments) : S).end();
    });
  }, m.scaleBy = function(y, S, E, M) {
    m.scaleTo(y, function() {
      var k = this.__zoom.k, $ = typeof S == "function" ? S.apply(this, arguments) : S;
      return k * $;
    }, E, M);
  }, m.scaleTo = function(y, S, E, M) {
    m.transform(y, function() {
      var k = t.apply(this, arguments), $ = this.__zoom, H = E == null ? x(k) : typeof E == "function" ? E.apply(this, arguments) : E, V = $.invert(H), L = typeof S == "function" ? S.apply(this, arguments) : S;
      return n(p(_($, L), H, V), k, s);
    }, E, M);
  }, m.translateBy = function(y, S, E, M) {
    m.transform(y, function() {
      return n(this.__zoom.translate(
        typeof S == "function" ? S.apply(this, arguments) : S,
        typeof E == "function" ? E.apply(this, arguments) : E
      ), t.apply(this, arguments), s);
    }, null, M);
  }, m.translateTo = function(y, S, E, M, k) {
    m.transform(y, function() {
      var $ = t.apply(this, arguments), H = this.__zoom, V = M == null ? x($) : typeof M == "function" ? M.apply(this, arguments) : M;
      return n(dn.translate(V[0], V[1]).scale(H.k).translate(
        typeof S == "function" ? -S.apply(this, arguments) : -S,
        typeof E == "function" ? -E.apply(this, arguments) : -E
      ), $, s);
    }, M, k);
  };
  function _(y, S) {
    return S = Math.max(i[0], Math.min(i[1], S)), S === y.k ? y : new ze(S, y.x, y.y);
  }
  function p(y, S, E) {
    var M = S[0] - E[0] * y.k, k = S[1] - E[1] * y.k;
    return M === y.x && k === y.y ? y : new ze(y.k, M, k);
  }
  function x(y) {
    return [(+y[0][0] + +y[1][0]) / 2, (+y[0][1] + +y[1][1]) / 2];
  }
  function C(y, S, E, M) {
    y.on("start.zoom", function() {
      b(this, arguments).event(M).start();
    }).on("interrupt.zoom end.zoom", function() {
      b(this, arguments).event(M).end();
    }).tween("zoom", function() {
      var k = this, $ = arguments, H = b(k, $).event(M), V = t.apply(k, $), L = E == null ? x(V) : typeof E == "function" ? E.apply(k, $) : E, X = Math.max(V[1][0] - V[0][0], V[1][1] - V[0][1]), B = k.__zoom, q = typeof S == "function" ? S.apply(k, $) : S, Q = c(B.invert(L).concat(X / B.k), q.invert(L).concat(X / q.k));
      return function(W) {
        if (W === 1) W = q;
        else {
          var D = Q(W), F = X / D[2];
          W = new ze(F, L[0] - D[0] * F, L[1] - D[1] * F);
        }
        H.zoom(null, W);
      };
    });
  }
  function b(y, S, E) {
    return !E && y.__zooming || new N(y, S);
  }
  function N(y, S) {
    this.that = y, this.args = S, this.active = 0, this.sourceEvent = null, this.extent = t.apply(y, S), this.taps = 0;
  }
  N.prototype = {
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
        new ud(y, {
          sourceEvent: this.sourceEvent,
          target: m,
          transform: this.that.__zoom,
          dispatch: l
        }),
        S
      );
    }
  };
  function I(y, ...S) {
    if (!e.apply(this, arguments)) return;
    var E = b(this, S).event(y), M = this.__zoom, k = Math.max(i[0], Math.min(i[1], M.k * Math.pow(2, o.apply(this, arguments)))), $ = ge(y);
    if (E.wheel)
      (E.mouse[0][0] !== $[0] || E.mouse[0][1] !== $[1]) && (E.mouse[1] = M.invert(E.mouse[0] = $)), clearTimeout(E.wheel);
    else {
      if (M.k === k) return;
      E.mouse = [$, M.invert($)], Wt(this), E.start();
    }
    ht(y), E.wheel = setTimeout(H, g), E.zoom("mouse", n(p(_(M, k), E.mouse[0], E.mouse[1]), E.extent, s));
    function H() {
      E.wheel = null, E.end();
    }
  }
  function A(y, ...S) {
    if (d || !e.apply(this, arguments)) return;
    var E = y.currentTarget, M = b(this, S, !0).event(y), k = de(y.view).on("mousemove.zoom", L, !0).on("mouseup.zoom", X, !0), $ = ge(y, E), H = y.clientX, V = y.clientY;
    Qr(y.view), Nn(y), M.mouse = [$, this.__zoom.invert($)], Wt(this), M.start();
    function L(B) {
      if (ht(B), !M.moved) {
        var q = B.clientX - H, Q = B.clientY - V;
        M.moved = q * q + Q * Q > v;
      }
      M.event(B).zoom("mouse", n(p(M.that.__zoom, M.mouse[0] = ge(B, E), M.mouse[1]), M.extent, s));
    }
    function X(B) {
      k.on("mousemove.zoom mouseup.zoom", null), Jr(B.view, M.moved), ht(B), M.event(B).end();
    }
  }
  function O(y, ...S) {
    if (e.apply(this, arguments)) {
      var E = this.__zoom, M = ge(y.changedTouches ? y.changedTouches[0] : y, this), k = E.invert(M), $ = E.k * (y.shiftKey ? 0.5 : 2), H = n(p(_(E, $), M, k), t.apply(this, S), s);
      ht(y), a > 0 ? de(this).transition().duration(a).call(C, H, M, y) : de(this).call(m.transform, H, M, y);
    }
  }
  function P(y, ...S) {
    if (e.apply(this, arguments)) {
      var E = y.touches, M = E.length, k = b(this, S, y.changedTouches.length === M).event(y), $, H, V, L;
      for (Nn(y), H = 0; H < M; ++H)
        V = E[H], L = ge(V, this), L = [L, this.__zoom.invert(L), V.identifier], k.touch0 ? !k.touch1 && k.touch0[2] !== L[2] && (k.touch1 = L, k.taps = 0) : (k.touch0 = L, $ = !0, k.taps = 1 + !!u);
      u && (u = clearTimeout(u)), $ && (k.taps < 2 && (f = L[0], u = setTimeout(function() {
        u = null;
      }, h)), Wt(this), k.start());
    }
  }
  function R(y, ...S) {
    if (this.__zooming) {
      var E = b(this, S).event(y), M = y.changedTouches, k = M.length, $, H, V, L;
      for (ht(y), $ = 0; $ < k; ++$)
        H = M[$], V = ge(H, this), E.touch0 && E.touch0[2] === H.identifier ? E.touch0[0] = V : E.touch1 && E.touch1[2] === H.identifier && (E.touch1[0] = V);
      if (H = E.that.__zoom, E.touch1) {
        var X = E.touch0[0], B = E.touch0[1], q = E.touch1[0], Q = E.touch1[1], W = (W = q[0] - X[0]) * W + (W = q[1] - X[1]) * W, D = (D = Q[0] - B[0]) * D + (D = Q[1] - B[1]) * D;
        H = _(H, Math.sqrt(W / D)), V = [(X[0] + q[0]) / 2, (X[1] + q[1]) / 2], L = [(B[0] + Q[0]) / 2, (B[1] + Q[1]) / 2];
      } else if (E.touch0) V = E.touch0[0], L = E.touch0[1];
      else return;
      E.zoom("touch", n(p(H, V, L), E.extent, s));
    }
  }
  function T(y, ...S) {
    if (this.__zooming) {
      var E = b(this, S).event(y), M = y.changedTouches, k = M.length, $, H;
      for (Nn(y), d && clearTimeout(d), d = setTimeout(function() {
        d = null;
      }, h), $ = 0; $ < k; ++$)
        H = M[$], E.touch0 && E.touch0[2] === H.identifier ? delete E.touch0 : E.touch1 && E.touch1[2] === H.identifier && delete E.touch1;
      if (E.touch1 && !E.touch0 && (E.touch0 = E.touch1, delete E.touch1), E.touch0) E.touch0[1] = this.__zoom.invert(E.touch0[0]);
      else if (E.end(), E.taps === 2 && (H = ge(H, this), Math.hypot(f[0] - H[0], f[1] - H[1]) < w)) {
        var V = de(this).on("dblclick.zoom");
        V && V.apply(this, arguments);
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
], pi = ["Enter", " ", "Escape"], mi = {
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
const yi = {
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
var Z;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(Z || (Z = {}));
const Xo = {
  [Z.Left]: Z.Right,
  [Z.Right]: Z.Left,
  [Z.Top]: Z.Bottom,
  [Z.Bottom]: Z.Top
};
function wi(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
const xi = (e) => !!e && typeof e == "object" && "id" in e && "source" in e && "target" in e, md = (e) => !!e && typeof e == "object" && "id" in e && "position" in e && !("source" in e) && !("target" in e), ro = (e) => !!e && typeof e == "object" && "id" in e && "internals" in e && !("source" in e) && !("target" in e), At = (e, t = [0, 0]) => {
  const { width: n, height: o } = _e(e), r = e.origin ?? t, i = n * r[0], s = o * r[1];
  return {
    x: e.position.x - i,
    y: e.position.y - s
  };
}, yd = (e, t = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = !1;
  const o = e.reduce((r, i) => {
    const s = typeof i == "string";
    let a = !t.nodeLookup && !s ? i : void 0;
    return t.nodeLookup && (a = s ? t.nodeLookup.get(i) : ro(i) ? i : t.nodeLookup.get(i.id)), a ? (n = !0, fn(r, tn(a, t.nodeOrigin))) : r;
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return n ? hn(o) : { x: 0, y: 0, width: 0, height: 0 };
}, kt = (e, t = {}) => {
  let n = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, o = !1;
  return e.forEach((r) => {
    (t.filter === void 0 || t.filter(r)) && (n = fn(n, tn(r)), o = !0);
  }), o ? hn(n) : { x: 0, y: 0, width: 0, height: 0 };
}, io = (e, t, [n, o, r] = [0, 0, 1], i = !1, s = !1) => {
  const a = (t.x - n) / r, c = (t.y - o) / r, l = t.width / r, u = t.height / r, f = [];
  for (const d of e.values()) {
    const { measured: h, selectable: g = !0, hidden: v = !1 } = d;
    if (s && !g || v)
      continue;
    const w = h.width ?? d.width ?? d.initialWidth ?? 0, m = h.height ?? d.height ?? d.initialHeight ?? 0, { x: _, y: p } = d.internals.positionAbsolute, x = Si(a, c, l, u, _, p, w, m), C = w * m, b = i && x > 0;
    (!d.internals.handleBounds || b || x >= C || d.dragging) && f.push(d);
  }
  return f;
}, wd = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((o) => {
    n.add(o.id);
  }), t.filter((o) => n.has(o.source) || n.has(o.target));
};
function xd(e, t) {
  const n = /* @__PURE__ */ new Map(), o = t?.nodes ? new Set(t.nodes.map((r) => r.id)) : null;
  return e.forEach((r) => {
    let i;
    if (t?.includeHiddenNodes) {
      const { width: s, height: a } = _e(r);
      i = s > 0 && a > 0;
    } else
      i = !!(r.measured.width && r.measured.height && !r.hidden);
    i && (!o || o.has(r.id)) && n.set(r.id, r);
  }), n;
}
async function vd({ nodes: e, width: t, height: n, panZoom: o, minZoom: r, maxZoom: i }, s) {
  if (e.size === 0)
    return !0;
  const a = xd(e, s), c = kt(a), l = ao(c, t, n, s?.minZoom ?? r, s?.maxZoom ?? i, s?.padding ?? 0.1);
  return await o.setViewport(l, {
    duration: s?.duration,
    ease: s?.ease,
    interpolate: s?.interpolate
  }), !0;
}
function vi({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: o = [0, 0], nodeExtent: r, onError: i }) {
  const s = n.get(e), a = s.parentId ? n.get(s.parentId) : void 0, { x: c, y: l } = a ? a.internals.positionAbsolute : { x: 0, y: 0 }, u = s.origin ?? o;
  let f = s.extent || r;
  if (s.extent === "parent" && !s.expandParent)
    if (!a)
      i?.("005", ve.error005());
    else {
      const { width: h, height: g } = _e(a);
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
  return (s.measured.width === void 0 || s.measured.height === void 0) && i?.("015", ve.error015()), {
    position: {
      x: d.x - c + (s.measured.width ?? 0) * u[0],
      y: d.y - l + (s.measured.height ?? 0) * u[1]
    },
    positionAbsolute: d
  };
}
async function bd({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: o, onBeforeDelete: r }) {
  const i = new Set(e.map((d) => d.id)), s = [];
  for (const d of n) {
    if (d.deletable === !1)
      continue;
    const h = i.has(d.id), g = !h && d.parentId && s.find((v) => v.id === d.parentId);
    (h || g) && s.push(d);
  }
  const a = new Set(t.map((d) => d.id)), c = o.filter((d) => d.deletable !== !1), u = wd(s, c);
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
function bi(e, t, n) {
  const { width: o, height: r } = _e(n), { x: i, y: s } = n.internals.positionAbsolute;
  return Qe(e, [
    [i, s],
    [i + o, s + r]
  ], t);
}
const Yo = (e, t, n) => e < t ? at(Math.abs(e - t), 1, t) / t : e > n ? -at(Math.abs(e - n), 1, t) / t : 0, so = (e, t, n = 15, o = 40) => {
  const r = Yo(e.x, o, t.width - o) * n, i = Yo(e.y, o, t.height - o) * n;
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
  const { x: n, y: o } = ro(e) ? e.internals.positionAbsolute : At(e, t);
  return {
    x: n,
    y: o,
    width: e.measured?.width ?? e.width ?? e.initialWidth ?? 0,
    height: e.measured?.height ?? e.height ?? e.initialHeight ?? 0
  };
}, tn = (e, t = [0, 0]) => {
  const { x: n, y: o } = ro(e) ? e.internals.positionAbsolute : At(e, t);
  return {
    x: n,
    y: o,
    x2: n + (e.measured?.width ?? e.width ?? e.initialWidth ?? 0),
    y2: o + (e.measured?.height ?? e.height ?? e.initialHeight ?? 0)
  };
}, _i = (e, t) => hn(fn(Xn(e), Xn(t))), Si = (e, t, n, o, r, i, s, a) => {
  const c = Math.max(0, Math.min(e + n, r + s) - Math.max(e, r)), l = Math.max(0, Math.min(t + o, i + a) - Math.max(t, i));
  return Math.ceil(c * l);
}, nn = (e, t) => Si(e.x, e.y, e.width, e.height, t.x, t.y, t.width, t.height), Zo = (e) => me(e.width) && me(e.height) && me(e.x) && me(e.y), me = (e) => !isNaN(e) && isFinite(e), Ei = (e, t) => (n, o) => {
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
function _d(e, t, n) {
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
function Sd(e, t, n, o, r, i) {
  const { x: s, y: a } = ct(e, [t, n, o]), { x: c, y: l } = ct({ x: e.x + e.width, y: e.y + e.height }, [t, n, o]), u = r - c, f = i - l;
  return {
    left: Math.floor(s),
    top: Math.floor(a),
    right: Math.floor(u),
    bottom: Math.floor(f)
  };
}
const ao = (e, t, n, o, r, i) => {
  const s = _d(i, t, n), a = (t - s.x) / e.width, c = (n - s.y) / e.height, l = Math.min(a, c), u = at(l, o, r), f = e.x + e.width / 2, d = e.y + e.height / 2, h = t / 2 - f * u, g = n / 2 - d * u, v = Sd(e, h, g, u, t, n), w = {
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
function _e(e) {
  return {
    width: e.measured?.width ?? e.width ?? e.initialWidth ?? 0,
    height: e.measured?.height ?? e.height ?? e.initialHeight ?? 0
  };
}
function Ni(e) {
  return (e.measured?.width ?? e.width ?? e.initialWidth) !== void 0 && (e.measured?.height ?? e.height ?? e.initialHeight) !== void 0;
}
function Ci(e, t = { width: 0, height: 0 }, n, o, r) {
  const i = { ...e }, s = o.get(n);
  if (s) {
    const a = s.origin || r;
    i.x += s.internals.positionAbsolute.x - (t.width ?? 0) * a[0], i.y += s.internals.positionAbsolute.y - (t.height ?? 0) * a[1];
  }
  return i;
}
function Wo(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function Ed() {
  let e, t;
  return { promise: new Promise((o, r) => {
    e = o, t = r;
  }), resolve: e, reject: t };
}
function Nd(e) {
  return { ...mi, ...e || {} };
}
function yt(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: o, containerBounds: r }) {
  const { x: i, y: s } = ye(e), a = Pt({ x: i - (r?.left ?? 0), y: s - (r?.top ?? 0) }, o), { x: c, y: l } = n ? $t(a, t) : a;
  return {
    xSnapped: c,
    ySnapped: l,
    ...a
  };
}
const co = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), Mi = (e) => e?.getRootNode?.() || window?.document, Cd = ["INPUT", "SELECT", "TEXTAREA"];
function Ii(e) {
  const t = e.composedPath?.()?.[0] || e.target;
  return t?.nodeType !== 1 ? !1 : Cd.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey");
}
const Ai = (e) => "clientX" in e, ye = (e, t) => {
  const n = Ai(e), o = n ? e.clientX : e.touches?.[0].clientX, r = n ? e.clientY : e.touches?.[0].clientY;
  return {
    x: o - (t?.left ?? 0),
    y: r - (t?.top ?? 0)
  };
}, qo = (e, t, n, o, r) => {
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
      ...co(s)
    };
  });
};
function ki({ sourceX: e, sourceY: t, targetX: n, targetY: o, sourceControlX: r, sourceControlY: i, targetControlX: s, targetControlY: a }) {
  const c = e * 0.125 + r * 0.375 + s * 0.375 + n * 0.125, l = t * 0.125 + i * 0.375 + a * 0.375 + o * 0.125, u = Math.abs(c - e), f = Math.abs(l - t);
  return [c, l, u, f];
}
function Lt(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function Go({ pos: e, x1: t, y1: n, x2: o, y2: r, c: i }) {
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
function $i({ sourceX: e, sourceY: t, sourcePosition: n = Z.Bottom, targetX: o, targetY: r, targetPosition: i = Z.Top, curvature: s = 0.25 }) {
  const [a, c] = Go({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: r,
    c: s
  }), [l, u] = Go({
    pos: i,
    x1: o,
    y1: r,
    x2: e,
    y2: t,
    c: s
  }), [f, d, h, g] = ki({
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
function Pi({ sourceX: e, sourceY: t, targetX: n, targetY: o }) {
  const r = Math.abs(n - e) / 2, i = n < e ? n + r : n - r, s = Math.abs(o - t) / 2, a = o < t ? o + s : o - s;
  return [i, a, r, s];
}
function Md({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: o = 0, elevateOnSelect: r = !1, zIndexMode: i = "basic" }) {
  if (i === "manual")
    return o;
  const s = r && n ? o + 1e3 : o, a = Math.max(e.parentId || r && e.selected ? e.internals.z : 0, t.parentId || r && t.selected ? t.internals.z : 0);
  return s + a;
}
function Id({ sourceNode: e, targetNode: t, width: n, height: o, transform: r }) {
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
const Ad = ({ source: e, sourceHandle: t, target: n, targetHandle: o }) => `xy-edge__${e}${t || ""}-${n}${o || ""}`, kd = (e, t) => t.some((n) => n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)), $d = (e, t, n = {}) => {
  if (!e.source || !e.target)
    return n.onError?.("006", ve.error006()), t;
  const o = n.getEdgeId || Ad;
  let r;
  return xi(e) ? r = { ...e } : r = {
    ...e,
    id: o(e)
  }, kd(r, t) ? t : (r.sourceHandle === null && delete r.sourceHandle, r.targetHandle === null && delete r.targetHandle, t.concat(r));
};
function Di({ sourceX: e, sourceY: t, targetX: n, targetY: o }) {
  const [r, i, s, a] = Pi({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: o
  });
  return [`M ${e},${t}L ${n},${o}`, r, i, s, a];
}
const Uo = {
  [Z.Left]: { x: -1, y: 0 },
  [Z.Right]: { x: 1, y: 0 },
  [Z.Top]: { x: 0, y: -1 },
  [Z.Bottom]: { x: 0, y: 1 }
}, Pd = ({ source: e, sourcePosition: t = Z.Bottom, target: n }) => t === Z.Left || t === Z.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, Ko = (e, t) => Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
function Dd({ source: e, sourcePosition: t = Z.Bottom, target: n, targetPosition: o = Z.Top, center: r, offset: i, stepPosition: s }) {
  const a = Uo[t], c = Uo[o], l = { x: e.x + a.x * i, y: e.y + a.y * i }, u = { x: n.x + c.x * i, y: n.y + c.y * i }, f = Pd({
    source: l,
    sourcePosition: t,
    target: u
  }), d = f.x !== 0 ? "x" : "y", h = f[d];
  let g = [], v, w;
  const m = { x: 0, y: 0 }, _ = { x: 0, y: 0 }, [, , p, x] = Pi({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (a[d] * c[d] === -1) {
    d === "x" ? (v = r.x ?? l.x + (u.x - l.x) * s, w = r.y ?? (l.y + u.y) / 2) : (v = r.x ?? (l.x + u.x) / 2, w = r.y ?? l.y + (u.y - l.y) * s);
    const I = [
      { x: v, y: l.y },
      { x: v, y: u.y }
    ], A = [
      { x: l.x, y: w },
      { x: u.x, y: w }
    ];
    a[d] === h ? g = d === "x" ? I : A : g = d === "x" ? A : I;
  } else {
    const I = [{ x: l.x, y: u.y }], A = [{ x: u.x, y: l.y }];
    if (d === "x" ? g = a.x === h ? A : I : g = a.y === h ? I : A, t === o) {
      const y = Math.abs(e[d] - n[d]);
      if (y <= i) {
        const S = Math.min(i - 1, i - y);
        a[d] === h ? m[d] = (l[d] > e[d] ? -1 : 1) * S : _[d] = (u[d] > n[d] ? -1 : 1) * S;
      }
    }
    if (t !== o) {
      const y = d === "x" ? "y" : "x", S = a[d] === c[y], E = l[y] > u[y], M = l[y] < u[y];
      (a[d] === 1 && (!S && E || S && M) || a[d] !== 1 && (!S && M || S && E)) && (g = d === "x" ? I : A);
    }
    const O = { x: l.x + m.x, y: l.y + m.y }, P = { x: u.x + _.x, y: u.y + _.y }, R = Math.max(Math.abs(O.x - g[0].x), Math.abs(P.x - g[0].x)), T = Math.max(Math.abs(O.y - g[0].y), Math.abs(P.y - g[0].y));
    R >= T ? (v = (O.x + P.x) / 2, w = g[0].y) : (v = g[0].x, w = (O.y + P.y) / 2);
  }
  const C = { x: l.x + m.x, y: l.y + m.y }, b = { x: u.x + _.x, y: u.y + _.y };
  return [[
    e,
    // we only want to add the gapped source/target if they are different from the first/last point to avoid duplicates which can cause issues with the bends
    ...C.x !== g[0].x || C.y !== g[0].y ? [C] : [],
    ...g,
    ...b.x !== g[g.length - 1].x || b.y !== g[g.length - 1].y ? [b] : [],
    n
  ], v, w, p, x];
}
function zd(e, t, n, o) {
  const r = Math.min(Ko(e, t) / 2, Ko(t, n) / 2, o), { x: i, y: s } = t;
  if (e.x === i && i === n.x || e.y === s && s === n.y)
    return `L${i} ${s}`;
  if (e.y === s) {
    const l = e.x < n.x ? -1 : 1, u = e.y < n.y ? 1 : -1;
    return `L ${i + r * l},${s}Q ${i},${s} ${i},${s + r * u}`;
  }
  const a = e.x < n.x ? 1 : -1, c = e.y < n.y ? -1 : 1;
  return `L ${i},${s + r * c}Q ${i},${s} ${i + r * a},${s}`;
}
function Yn({ sourceX: e, sourceY: t, sourcePosition: n = Z.Bottom, targetX: o, targetY: r, targetPosition: i = Z.Top, borderRadius: s = 5, centerX: a, centerY: c, offset: l = 20, stepPosition: u = 0.5 }) {
  const [f, d, h, g, v] = Dd({
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
    w += zd(f[m - 1], f[m], f[m + 1], s);
  return w += `L${f[f.length - 1].x} ${f[f.length - 1].y}`, [w, d, h, g, v];
}
function Qo(e) {
  return e && !!(e.internals.handleBounds || e.handles?.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function Td(e) {
  const { sourceNode: t, targetNode: n } = e;
  if (!Qo(t) || !Qo(n))
    return null;
  const o = t.internals.handleBounds || Jo(t.handles), r = n.internals.handleBounds || Jo(n.handles), i = jo(o?.source ?? [], e.sourceHandle), s = jo(
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
  const a = i?.position || Z.Bottom, c = s?.position || Z.Top, l = je(t, i, a), u = je(n, s, c);
  return {
    sourceX: l.x,
    sourceY: l.y,
    targetX: u.x,
    targetY: u.y,
    sourcePosition: a,
    targetPosition: c
  };
}
function Jo(e) {
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
function je(e, t, n = Z.Left, o = !1) {
  const r = (t?.x ?? 0) + e.internals.positionAbsolute.x, i = (t?.y ?? 0) + e.internals.positionAbsolute.y, { width: s, height: a } = t ?? _e(e);
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
function jo(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function Zn(e, t) {
  return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((o) => `${o}=${e[o]}`).join("&")}` : "";
}
function Hd(e, { id: t, defaultColor: n, defaultMarkerStart: o, defaultMarkerEnd: r }) {
  const i = /* @__PURE__ */ new Set();
  return e.reduce((s, a) => ([a.markerStart || o, a.markerEnd || r].forEach((c) => {
    if (c && typeof c == "object") {
      const l = Zn(c, t);
      i.has(l) || (s.push({ id: l, color: c.color || n, ...c }), i.add(l));
    }
  }), s), []).sort((s, a) => s.id.localeCompare(a.id));
}
const zi = 1e3, Rd = 10, lo = {
  nodeOrigin: [0, 0],
  nodeExtent: _t,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, Ld = {
  ...lo,
  checkEquality: !0
};
function uo(e, t) {
  const n = { ...e };
  for (const o in t)
    t[o] !== void 0 && (n[o] = t[o]);
  return n;
}
function Vd(e, t, n) {
  const o = uo(lo, n);
  for (const r of e.values())
    if (r.parentId)
      ho(r, e, t, o);
    else {
      const i = At(r, o.nodeOrigin), s = Je(r.extent) ? r.extent : o.nodeExtent, a = Qe(i, s, _e(r));
      r.internals.positionAbsolute = a;
    }
}
function Od(e, t) {
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
function fo(e) {
  return e === "manual";
}
function Wn(e, t, n, o = {}) {
  const r = uo(Ld, o), i = { i: 0 }, s = new Map(t), a = r?.elevateNodesOnSelect && !fo(r.zIndexMode) ? zi : 0;
  let c = e.length > 0, l = !1;
  t.clear(), n.clear();
  for (const u of e) {
    let f = s.get(u.id);
    if (r.checkEquality && u === f?.internals.userNode)
      t.set(u.id, f);
    else {
      const d = At(u, r.nodeOrigin), h = Je(u.extent) ? u.extent : r.nodeExtent, g = Qe(d, h, _e(u));
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
          handleBounds: Od(u, f),
          z: Ti(u, a, r.zIndexMode),
          userNode: u
        }
      }, t.set(u.id, f);
    }
    (f.measured === void 0 || f.measured.width === void 0 || f.measured.height === void 0) && !f.hidden && (c = !1), u.parentId && ho(f, t, n, o, i), l ||= u.selected ?? !1;
  }
  return { nodesInitialized: c, hasSelectedNodes: l };
}
function Bd(e, t) {
  if (!e.parentId)
    return;
  const n = t.get(e.parentId);
  n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function ho(e, t, n, o, r) {
  const { elevateNodesOnSelect: i, nodeOrigin: s, nodeExtent: a, zIndexMode: c } = uo(lo, o), l = e.parentId, u = t.get(l);
  if (!u) {
    console.warn(`Parent node ${l} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  Bd(e, n), r && !u.parentId && u.internals.rootParentIndex === void 0 && c === "auto" && (u.internals.rootParentIndex = ++r.i, u.internals.z = u.internals.z + r.i * Rd), r && u.internals.rootParentIndex !== void 0 && (r.i = u.internals.rootParentIndex);
  const f = i && !fo(c) ? zi : 0, { x: d, y: h, z: g } = Fd(e, u, s, a, f, c), { positionAbsolute: v } = e.internals, w = d !== v.x || h !== v.y;
  (w || g !== e.internals.z) && t.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: w ? { x: d, y: h } : v,
      z: g
    }
  });
}
function Ti(e, t, n) {
  const o = me(e.zIndex) ? e.zIndex : 0;
  return fo(n) ? o : o + (e.selected ? t : 0);
}
function Fd(e, t, n, o, r, i) {
  const { x: s, y: a } = t.internals.positionAbsolute, c = _e(e), l = At(e, n), u = Je(e.extent) ? Qe(l, e.extent, c) : l;
  let f = Qe({ x: s + u.x, y: a + u.y }, o, c);
  e.extent === "parent" && (f = bi(f, c, t));
  const d = Ti(e, r, i), h = t.internals.z ?? 0;
  return {
    x: f.x,
    y: f.y,
    z: h >= d ? h + 1 : d
  };
}
function go(e, t, n, o = [0, 0]) {
  const r = [], i = /* @__PURE__ */ new Map();
  for (const s of e) {
    const a = t.get(s.parentId);
    if (!a)
      continue;
    const c = i.get(s.parentId)?.expandedRect ?? Et(a), l = _i(c, s.rect);
    i.set(s.parentId, { expandedRect: l, parent: a });
  }
  return i.size > 0 && i.forEach(({ expandedRect: s, parent: a }, c) => {
    const l = a.internals.positionAbsolute, u = _e(a), f = a.origin ?? o, d = s.x < l.x ? Math.round(Math.abs(l.x - s.x)) : 0, h = s.y < l.y ? Math.round(Math.abs(l.y - s.y)) : 0, g = Math.max(u.width, Math.round(s.width)), v = Math.max(u.height, Math.round(s.height)), w = (g - u.width) * f[0], m = (v - u.height) * f[1];
    (d > 0 || h > 0 || w || m) && (r.push({
      id: c,
      type: "position",
      position: {
        x: a.position.x - d + w,
        y: a.position.y - h + m
      }
    }), n.get(c)?.forEach((_) => {
      e.some((p) => p.id === _.id) || r.push({
        id: _.id,
        type: "position",
        position: {
          x: _.position.x + d,
          y: _.position.y + h
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
function Xd(e, t, n, o, r, i, s) {
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
    const v = co(h.nodeElement), w = g.measured.width !== v.width || g.measured.height !== v.height;
    if (!!(v.width && v.height && (w || !g.internals.handleBounds || h.force))) {
      const _ = h.nodeElement.getBoundingClientRect(), p = Je(g.extent) ? g.extent : i;
      let { positionAbsolute: x } = g.internals;
      if (g.parentId && g.extent === "parent") {
        const b = t.get(g.parentId);
        b && (x = bi(x, v, b));
      } else p && (x = Qe(x, p, v));
      const C = {
        ...g,
        measured: v,
        internals: {
          ...g.internals,
          positionAbsolute: x,
          handleBounds: {
            source: qo("source", h.nodeElement, _, f, g.id),
            target: qo("target", h.nodeElement, _, f, g.id)
          }
        }
      };
      t.set(g.id, C), g.parentId && ho(C, t, n, { nodeOrigin: r, zIndexMode: s }), c = !0, w && (l.push({
        id: g.id,
        type: "dimensions",
        dimensions: v
      }), g.expandParent && g.parentId && d.push({
        id: g.id,
        parentId: g.parentId,
        rect: Et(C, r)
      }));
    }
  }
  if (d.length > 0) {
    const h = go(d, t, n, r);
    l.push(...h);
  }
  return { changes: l, updatedInternals: c };
}
async function Yd({ delta: e, panZoom: t, transform: n, translateExtent: o, width: r, height: i }) {
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
function er(e, t, n, o, r, i) {
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
function Hi(e, t, n) {
  e.clear(), t.clear();
  for (const o of n) {
    const { source: r, target: i, sourceHandle: s = null, targetHandle: a = null } = o, c = { edgeId: o.id, source: r, target: i, sourceHandle: s, targetHandle: a }, l = `${r}-${s}--${i}-${a}`, u = `${i}-${a}--${r}-${s}`;
    er("source", c, u, e, r, s), er("target", c, l, e, i, a), t.set(o.id, o);
  }
}
function Ri(e, t) {
  if (!e.parentId)
    return !1;
  const n = t.get(e.parentId);
  return n ? n.selected ? !0 : Ri(n, t) : !1;
}
function tr(e, t, n) {
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
function Zd(e, t, n, o) {
  const r = /* @__PURE__ */ new Map();
  for (const [i, s] of e)
    if ((s.selected || s.id === o) && (!s.parentId || !Ri(s, e)) && (s.draggable || t && typeof s.draggable > "u")) {
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
function Wd({ dragItems: e, snapGrid: t, x: n, y: o }) {
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
function qd({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: o, onDragStop: r }) {
  let i = { x: null, y: null }, s = 0, a = /* @__PURE__ */ new Map(), c = !1, l = { x: 0, y: 0 }, u = null, f = !1, d = null, h = !1, g = !1, v = null;
  function w({ noDragClassName: _, handleSelector: p, domNode: x, isSelectable: C, nodeId: b, nodeClickDistance: N = 0 }) {
    d = de(x);
    function I({ x: R, y: T }) {
      const { nodeLookup: y, nodeExtent: S, snapGrid: E, snapToGrid: M, nodeOrigin: k, onNodeDrag: $, onSelectionDrag: H, onError: V, updateNodePositions: L } = t();
      i = { x: R, y: T };
      let X = !1;
      const B = a.size > 1, q = B && S ? Xn(kt(a)) : null, Q = B && M ? Wd({
        dragItems: a,
        snapGrid: E,
        x: R,
        y: T
      }) : null;
      for (const [W, D] of a) {
        if (!y.has(W))
          continue;
        let F = { x: R - D.distance.x, y: T - D.distance.y };
        M && (F = Q ? {
          x: Math.round(F.x + Q.x),
          y: Math.round(F.y + Q.y)
        } : $t(F, E));
        let K = null;
        if (B && S && !D.extent && q) {
          const { positionAbsolute: G } = D.internals, J = G.x - q.x + S[0][0], te = G.x + D.measured.width - q.x2 + S[1][0], re = G.y - q.y + S[0][1], ce = G.y + D.measured.height - q.y2 + S[1][1];
          K = [
            [J, re],
            [te, ce]
          ];
        }
        const { position: U, positionAbsolute: Y } = vi({
          nodeId: W,
          nextPosition: F,
          nodeLookup: y,
          nodeExtent: K || S,
          nodeOrigin: k,
          onError: V
        });
        X = X || D.position.x !== U.x || D.position.y !== U.y, D.position = U, D.internals.positionAbsolute = Y;
      }
      if (g = g || X, !!X && (L(a, !0), v && (o || $ || !b && H))) {
        const [W, D] = Cn({
          nodeId: b,
          dragItems: a,
          nodeLookup: y
        });
        o?.(v, a, W, D), $?.(v, W, D), b || H?.(v, D);
      }
    }
    async function A() {
      if (!u)
        return;
      const { transform: R, panBy: T, autoPanSpeed: y, autoPanOnNodeDrag: S } = t();
      if (!S) {
        c = !1, cancelAnimationFrame(s);
        return;
      }
      const [E, M] = so(l, u, y);
      (E !== 0 || M !== 0) && (i.x = (i.x ?? 0) - E / R[2], i.y = (i.y ?? 0) - M / R[2], await T({ x: E, y: M }) && I(i)), s = requestAnimationFrame(A);
    }
    function O(R) {
      const { nodeLookup: T, multiSelectionActive: y, nodesDraggable: S, transform: E, snapGrid: M, snapToGrid: k, selectNodesOnDrag: $, onNodeDragStart: H, onSelectionDragStart: V, unselectNodesAndEdges: L } = t();
      f = !0, (!$ || !C) && !y && b && (T.get(b)?.selected || L()), C && $ && b && e?.(b);
      const X = yt(R.sourceEvent, { transform: E, snapGrid: M, snapToGrid: k, containerBounds: u });
      if (i = X, a = Zd(T, S, X, b), a.size > 0 && (n || H || !b && V)) {
        const [B, q] = Cn({
          nodeId: b,
          dragItems: a,
          nodeLookup: T
        });
        n?.(R.sourceEvent, a, B, q), H?.(R.sourceEvent, B, q), b || V?.(R.sourceEvent, q);
      }
    }
    const P = jr().clickDistance(N).on("start", (R) => {
      const { domNode: T, nodeDragThreshold: y, transform: S, snapGrid: E, snapToGrid: M } = t();
      u = T?.getBoundingClientRect() || null, h = !1, g = !1, v = R.sourceEvent, y === 0 && O(R), i = yt(R.sourceEvent, { transform: S, snapGrid: E, snapToGrid: M, containerBounds: u }), l = ye(R.sourceEvent, u);
    }).on("drag", (R) => {
      const { autoPanOnNodeDrag: T, transform: y, snapGrid: S, snapToGrid: E, nodeDragThreshold: M, nodeLookup: k } = t(), $ = yt(R.sourceEvent, { transform: y, snapGrid: S, snapToGrid: E, containerBounds: u });
      if (v = R.sourceEvent, (R.sourceEvent.type === "touchmove" && R.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      b && !k.has(b)) && (h = !0), !h) {
        if (!c && T && f && (c = !0, A()), !f) {
          const H = ye(R.sourceEvent, u), V = H.x - l.x, L = H.y - l.y;
          Math.sqrt(V * V + L * L) > M && O(R);
        }
        (i.x !== $.xSnapped || i.y !== $.ySnapped) && a && f && (l = ye(R.sourceEvent, u), I($));
      }
    }).on("end", (R) => {
      if (!f || h) {
        h && a.size > 0 && t().updateNodePositions(a, !1);
        return;
      }
      if (c = !1, f = !1, cancelAnimationFrame(s), a.size > 0) {
        const { nodeLookup: T, updateNodePositions: y, onNodeDragStop: S, onSelectionDragStop: E } = t();
        if (g && (y(a, !1), g = !1), r || S || !b && E) {
          const [M, k] = Cn({
            nodeId: b,
            dragItems: a,
            nodeLookup: T,
            dragging: !1
          });
          r?.(R.sourceEvent, a, M, k), S?.(R.sourceEvent, M, k), b || E?.(R.sourceEvent, k);
        }
      }
    }).filter((R) => {
      const T = R.target;
      return !R.button && (!_ || !tr(T, `.${_}`, x)) && (!p || tr(T, p, x));
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
function Gd(e, t, n) {
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
const Ud = 250;
function Kd(e, t, n, o) {
  let r = [], i = 1 / 0;
  const s = Gd(e, n, t + Ud);
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
function Li(e, t, n, o, r, i = !1) {
  const s = o.get(e);
  if (!s)
    return null;
  const a = r === "strict" ? s.internals.handleBounds?.[t] : [...s.internals.handleBounds?.source ?? [], ...s.internals.handleBounds?.target ?? []], c = (n ? a?.find((l) => l.id === n) : a?.[0]) ?? null;
  return c && i ? { ...c, ...je(s, c, c.position, !0) } : c;
}
function Vi(e, t) {
  return e || (t?.classList.contains("target") ? "target" : t?.classList.contains("source") ? "source" : null);
}
function Qd(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
const Oi = () => !0;
function Jd(e, { connectionMode: t, connectionRadius: n, handleId: o, nodeId: r, edgeUpdaterType: i, isTarget: s, domNode: a, nodeLookup: c, lib: l, autoPanOnConnect: u, flowId: f, panBy: d, cancelConnection: h, onConnectStart: g, onConnect: v, onConnectEnd: w, isValidConnection: m = Oi, onReconnectEnd: _, updateConnection: p, getTransform: x, getFromHandle: C, autoPanSpeed: b, dragThreshold: N = 1, handleDomNode: I }) {
  const A = Mi(e.target);
  let O = 0, P;
  const { x: R, y: T } = ye(e), y = Vi(i, I), S = a?.getBoundingClientRect();
  let E = !1;
  if (!S || !y)
    return;
  const M = Li(r, y, o, c, t);
  if (!M)
    return;
  let k = ye(e, S), $ = !1, H = null, V = !1, L = null;
  function X() {
    if (!u || !S)
      return;
    const [U, Y] = so(k, S, b);
    d({ x: U, y: Y }), O = requestAnimationFrame(X);
  }
  const B = {
    ...M,
    nodeId: r,
    type: y,
    position: M.position
  }, q = c.get(r);
  let W = {
    inProgress: !0,
    isValid: null,
    from: je(q, B, Z.Left, !0),
    fromHandle: B,
    fromPosition: B.position,
    fromNode: q,
    to: k,
    toHandle: null,
    toPosition: Xo[B.position],
    toNode: null,
    pointer: k
  };
  function D() {
    E = !0, p(W), g?.(e, { nodeId: r, handleId: o, handleType: y });
  }
  N === 0 && D();
  function F(U) {
    if (!E) {
      const { x: ce, y: Ae } = ye(U), Se = ce - R, Ee = Ae - T;
      if (!(Se * Se + Ee * Ee > N * N))
        return;
      D();
    }
    if (!C() || !B) {
      K(U);
      return;
    }
    const Y = x();
    k = ye(U, S), P = Kd(Pt(k, Y, !1, [1, 1]), n, c, B), $ || (X(), $ = !0);
    const G = Bi(U, {
      handle: P,
      connectionMode: t,
      fromNodeId: r,
      fromHandleId: o,
      fromType: s ? "target" : "source",
      isValidConnection: m,
      doc: A,
      lib: l,
      flowId: f,
      nodeLookup: c
    });
    L = G.handleDomNode, H = G.connection, V = Qd(!!P, G.isValid);
    const J = c.get(r), te = J ? je(J, B, Z.Left, !0) : W.from, re = {
      ...W,
      from: te,
      isValid: V,
      to: G.toHandle && V ? ct({ x: G.toHandle.x, y: G.toHandle.y }, Y) : k,
      toHandle: G.toHandle,
      toPosition: V && G.toHandle ? G.toHandle.position : Xo[B.position],
      toNode: G.toHandle ? c.get(G.toHandle.nodeId) : null,
      pointer: k
    };
    p(re), W = re;
  }
  function K(U) {
    if (!("touches" in U && U.touches.length > 0)) {
      if (E) {
        (P || L) && H && V && v?.(H);
        const { inProgress: Y, ...G } = W, J = {
          ...G,
          toPosition: W.toHandle ? W.toPosition : null
        };
        w?.(U, J), i && _?.(U, J);
      }
      h(), cancelAnimationFrame(O), $ = !1, V = !1, H = null, L = null, A.removeEventListener("mousemove", F), A.removeEventListener("mouseup", K), A.removeEventListener("touchmove", F), A.removeEventListener("touchend", K);
    }
  }
  A.addEventListener("mousemove", F), A.addEventListener("mouseup", K), A.addEventListener("touchmove", F), A.addEventListener("touchend", K);
}
function Bi(e, { handle: t, connectionMode: n, fromNodeId: o, fromHandleId: r, fromType: i, doc: s, lib: a, flowId: c, isValidConnection: l = Oi, nodeLookup: u }) {
  const f = i === "target", d = t ? s.querySelector(`.${a}-flow__handle[data-id="${c}-${t?.nodeId}-${t?.id}-${t?.type}"]`) : null, { x: h, y: g } = ye(e), v = s.elementFromPoint(h, g), w = v?.classList.contains(`${a}-flow__handle`) ? v : d, m = {
    handleDomNode: w,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (w) {
    const _ = Vi(void 0, w), p = w.getAttribute("data-nodeid"), x = w.getAttribute("data-handleid"), C = w.classList.contains("connectable"), b = w.classList.contains("connectableend");
    if (!p || !_)
      return m;
    const N = {
      source: f ? p : o,
      sourceHandle: f ? x : r,
      target: f ? o : p,
      targetHandle: f ? r : x
    };
    m.connection = N;
    const A = C && b && (n === st.Strict ? f && _ === "source" || !f && _ === "target" : p !== o || x !== r);
    m.isValid = A && l(N), m.toHandle = Li(p, _, x, u, n, !0);
  }
  return m;
}
const qn = {
  onPointerDown: Jd,
  isValid: Bi
};
function jd({ domNode: e, panZoom: t, getTransform: n, getViewScale: o }) {
  const r = de(e);
  function i({ translateExtent: a, width: c, height: l, zoomStep: u = 1, pannable: f = !0, zoomable: d = !0, inversePan: h = !1 }) {
    const g = (p) => {
      if (p.sourceEvent.type !== "wheel" || !t)
        return;
      const x = n(), C = p.sourceEvent.ctrlKey && Nt() ? 10 : 1, b = -p.sourceEvent.deltaY * (p.sourceEvent.deltaMode === 1 ? 0.05 : p.sourceEvent.deltaMode ? 1 : 2e-3) * u, N = x[2] * Math.pow(2, b * C);
      t.scaleTo(N);
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
      const C = [
        p.sourceEvent.clientX ?? p.sourceEvent.touches[0].clientX,
        p.sourceEvent.clientY ?? p.sourceEvent.touches[0].clientY
      ], b = [C[0] - v[0], C[1] - v[1]];
      v = C;
      const N = o() * Math.max(x[2], Math.log(x[2])) * (h ? -1 : 1), I = {
        x: x[0] - b[0] * N,
        y: x[1] - b[1] * N
      }, A = [
        [0, 0],
        [c, l]
      ];
      t.setViewportConstrained({
        x: I.x,
        y: I.y,
        zoom: x[2]
      }, A, a);
    }, _ = gi().on("start", w).on("zoom", f ? m : null).on("zoom.wheel", d ? g : null);
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
}), Mn = ({ x: e, y: t, zoom: n }) => dn.translate(e, t).scale(n), Ve = (e, t) => e.target.closest(`.${t}`), Fi = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), ef = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, In = (e, t = 0, n = ef, o = () => {
}) => {
  const r = typeof t == "number" && t > 0;
  return r || o(), r ? e.transition().duration(t).ease(n).on("end", o) : e;
}, Xi = (e) => {
  const t = e.ctrlKey && Nt() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
};
function tf({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: o, panOnScrollMode: r, panOnScrollSpeed: i, zoomOnPinch: s, onPanZoomStart: a, onPanZoom: c, onPanZoomEnd: l }) {
  return (u) => {
    if (Ve(u, t))
      return u.ctrlKey && u.preventDefault(), !1;
    u.preventDefault(), u.stopImmediatePropagation();
    const f = n.property("__zoom").k || 1;
    if (u.ctrlKey && s) {
      const w = ge(u), m = Xi(u), _ = f * Math.pow(2, m);
      o.scaleTo(n, _, w, u);
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
function nf({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
  return function(o, r) {
    const i = o.type === "wheel", s = !t && i && !o.ctrlKey, a = Ve(o, e);
    if (o.ctrlKey && i && a && o.preventDefault(), s || a)
      return null;
    o.preventDefault(), n.call(this, o, r);
  };
}
function of({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
  return (o) => {
    if (o.sourceEvent?.internal)
      return;
    const r = gn(o.transform);
    e.mouseButton = o.sourceEvent?.button || 0, e.isZoomingOrPanning = !0, e.prevViewport = r, o.sourceEvent?.type === "mousedown" && t(!0), n && n?.(o.sourceEvent, r);
  };
}
function rf({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: o, onPanZoom: r }) {
  return (i) => {
    e.usedRightMouseButton = !!(n && Fi(t, e.mouseButton ?? 0)), i.sourceEvent?.sync || o([i.transform.x, i.transform.y, i.transform.k]), r && !i.sourceEvent?.internal && r?.(i.sourceEvent, gn(i.transform));
  };
}
function sf({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: o, onPanZoomEnd: r, onPaneContextMenu: i }) {
  return (s) => {
    if (!s.sourceEvent?.internal && (e.isZoomingOrPanning = !1, i && Fi(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && s.sourceEvent && i(s.sourceEvent), e.usedRightMouseButton = !1, o(!1), r)) {
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
function af({ panActivationKeyPressed: e, zoomActivationKeyPressed: t, zoomOnScroll: n, zoomOnPinch: o, panOnDrag: r, panOnScroll: i, zoomOnDoubleClick: s, userSelectionActive: a, noWheelClassName: c, noPanClassName: l, lib: u, connectionInProgress: f }) {
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
function cf({ domNode: e, minZoom: t, maxZoom: n, translateExtent: o, viewport: r, onPanZoom: i, onPanZoomStart: s, onPanZoomEnd: a, onDraggingChange: c }) {
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
  (typeof ResizeObserver < "u" ? new ResizeObserver((T) => {
    const y = T[0];
    y && (f = [
      [0, 0],
      [y.contentRect.width, y.contentRect.height]
    ]);
  }) : null)?.observe(e);
  const h = gi().extent(() => f).scaleExtent([t, n]).translateExtent(o), g = de(e).call(h);
  x({
    x: r.x,
    y: r.y,
    zoom: at(r.zoom, t, n)
  }, [
    [0, 0],
    [u.width, u.height]
  ], o);
  const v = g.on("wheel.zoom"), w = g.on("dblclick.zoom");
  h.wheelDelta(Xi);
  async function m(T, y) {
    return g ? new Promise((S) => {
      h?.interpolate(y?.interpolate === "linear" ? mt : Xt).transform(In(g, y?.duration, y?.ease, () => S(!0)), T);
    }) : !1;
  }
  function _({ noWheelClassName: T, noPanClassName: y, onPaneContextMenu: S, userSelectionActive: E, panOnScroll: M, panOnDrag: k, panOnScrollMode: $, panOnScrollSpeed: H, preventScrolling: V, zoomOnPinch: L, zoomOnScroll: X, zoomOnDoubleClick: B, panActivationKeyPressed: q = !1, zoomActivationKeyPressed: Q, lib: W, onTransformChange: D, connectionInProgress: F, paneClickDistance: K, selectionOnDrag: U }) {
    E && !l.isZoomingOrPanning && p();
    const Y = M && !Q && !E;
    h.clickDistance(U ? 1 / 0 : !me(K) || K < 0 ? 0 : K);
    const G = Y ? tf({
      zoomPanValues: l,
      noWheelClassName: T,
      d3Selection: g,
      d3Zoom: h,
      panOnScrollMode: $,
      panOnScrollSpeed: H,
      zoomOnPinch: L,
      onPanZoomStart: s,
      onPanZoom: i,
      onPanZoomEnd: a
    }) : nf({
      noWheelClassName: T,
      preventScrolling: V,
      d3ZoomHandler: v
    });
    g.on("wheel.zoom", G, { passive: !1 });
    const J = of({
      zoomPanValues: l,
      onDraggingChange: c,
      onPanZoomStart: s
    });
    h.on("start", J);
    const te = rf({
      zoomPanValues: l,
      panOnDrag: k,
      onPaneContextMenu: !!S,
      onPanZoom: i,
      onTransformChange: D
    });
    h.on("zoom", te);
    const re = sf({
      zoomPanValues: l,
      panOnDrag: k,
      panOnScroll: M,
      onPaneContextMenu: S,
      onPanZoomEnd: a,
      onDraggingChange: c
    });
    h.on("end", re);
    const ce = af({
      panActivationKeyPressed: q,
      zoomActivationKeyPressed: Q,
      panOnDrag: k,
      zoomOnScroll: X,
      panOnScroll: M,
      zoomOnDoubleClick: B,
      zoomOnPinch: L,
      userSelectionActive: E,
      noPanClassName: y,
      noWheelClassName: T,
      lib: W,
      connectionInProgress: F
    });
    h.filter(ce), B ? g.on("dblclick.zoom", w) : g.on("dblclick.zoom", null);
  }
  function p() {
    h.on("zoom", null);
  }
  async function x(T, y, S) {
    const E = Mn(T), M = h?.constrain()(E, y, S);
    return M && await m(M), M;
  }
  async function C(T, y) {
    const S = Mn(T);
    return await m(S, y), S;
  }
  function b(T) {
    if (g) {
      const y = Mn(T), S = g.property("__zoom");
      (S.k !== T.zoom || S.x !== T.x || S.y !== T.y) && h?.transform(g, y, null, { sync: !0 });
    }
  }
  function N() {
    const T = g ? hi(g.node()) : { x: 0, y: 0, k: 1 };
    return { x: T.x, y: T.y, zoom: T.k };
  }
  async function I(T, y) {
    return g ? new Promise((S) => {
      h?.interpolate(y?.interpolate === "linear" ? mt : Xt).scaleTo(In(g, y?.duration, y?.ease, () => S(!0)), T);
    }) : !1;
  }
  async function A(T, y) {
    return g ? new Promise((S) => {
      h?.interpolate(y?.interpolate === "linear" ? mt : Xt).scaleBy(In(g, y?.duration, y?.ease, () => S(!0)), T);
    }) : !1;
  }
  function O(T) {
    h?.scaleExtent(T);
  }
  function P(T) {
    h?.translateExtent(T);
  }
  function R(T) {
    const y = !me(T) || T < 0 ? 0 : T;
    h?.clickDistance(y);
  }
  return {
    update: _,
    destroy: p,
    setViewport: C,
    setViewportConstrained: x,
    getViewport: N,
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
function lf({ width: e, prevWidth: t, height: n, prevHeight: o, affectsX: r, affectsY: i }) {
  const s = e - t, a = n - o, c = [s > 0 ? 1 : s < 0 ? -1 : 0, a > 0 ? 1 : a < 0 ? -1 : 0];
  return s && r && (c[0] = c[0] * -1), a && i && (c[1] = c[1] * -1), c;
}
function nr(e) {
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
function or(e, t) {
  return e ? !t : t;
}
function uf(e, t, n, o, r, i, s, a) {
  let { affectsX: c, affectsY: l } = t;
  const { isHorizontal: u, isVertical: f } = t, d = u && f, { xSnapped: h, ySnapped: g } = n, { minWidth: v, maxWidth: w, minHeight: m, maxHeight: _ } = o, { x: p, y: x, width: C, height: b, aspectRatio: N } = e;
  let I = Math.floor(u ? h - e.pointerX : 0), A = Math.floor(f ? g - e.pointerY : 0);
  const O = C + (c ? -I : I), P = b + (l ? -A : A), R = -i[0] * C, T = -i[1] * b;
  let y = Vt(O, v, w), S = Vt(P, m, _);
  if (s) {
    let k = 0, $ = 0;
    c && I < 0 ? k = Re(p + I + R, s[0][0]) : !c && I > 0 && (k = Le(p + O + R, s[1][0])), l && A < 0 ? $ = Re(x + A + T, s[0][1]) : !l && A > 0 && ($ = Le(x + P + T, s[1][1])), y = Math.max(y, k), S = Math.max(S, $);
  }
  if (a) {
    let k = 0, $ = 0;
    c && I > 0 ? k = Le(p + I, a[0][0]) : !c && I < 0 && (k = Re(p + O, a[1][0])), l && A > 0 ? $ = Le(x + A, a[0][1]) : !l && A < 0 && ($ = Re(x + P, a[1][1])), y = Math.max(y, k), S = Math.max(S, $);
  }
  if (r) {
    if (u) {
      const k = Vt(O / N, m, _) * N;
      if (y = Math.max(y, k), s) {
        let $ = 0;
        !c && !l || c && !l && d ? $ = Le(x + T + O / N, s[1][1]) * N : $ = Re(x + T + (c ? I : -I) / N, s[0][1]) * N, y = Math.max(y, $);
      }
      if (a) {
        let $ = 0;
        !c && !l || c && !l && d ? $ = Re(x + O / N, a[1][1]) * N : $ = Le(x + (c ? I : -I) / N, a[0][1]) * N, y = Math.max(y, $);
      }
    }
    if (f) {
      const k = Vt(P * N, v, w) / N;
      if (S = Math.max(S, k), s) {
        let $ = 0;
        !c && !l || l && !c && d ? $ = Le(p + P * N + R, s[1][0]) / N : $ = Re(p + (l ? A : -A) * N + R, s[0][0]) / N, S = Math.max(S, $);
      }
      if (a) {
        let $ = 0;
        !c && !l || l && !c && d ? $ = Re(p + P * N, a[1][0]) / N : $ = Le(p + (l ? A : -A) * N, a[0][0]) / N, S = Math.max(S, $);
      }
    }
  }
  A = A + (A < 0 ? S : -S), I = I + (I < 0 ? y : -y), r && (d ? O > P * N ? A = (or(c, l) ? -I : I) / N : I = (or(c, l) ? -A : A) * N : u ? (A = I / N, l = c) : (I = A * N, c = l));
  const E = c ? p + I : p, M = l ? x + A : x;
  return {
    width: C + (c ? -I : I),
    height: b + (l ? -A : A),
    x: i[0] * I * (c ? -1 : 1) + E,
    y: i[1] * A * (l ? -1 : 1) + M
  };
}
const Yi = { width: 0, height: 0, x: 0, y: 0 }, df = {
  ...Yi,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function ff(e, t, n) {
  const o = t.position.x + e.position.x, r = t.position.y + e.position.y, i = e.measured.width ?? 0, s = e.measured.height ?? 0, a = n[0] * i, c = n[1] * s;
  return [
    [o - a, r - c],
    [o + i - a, r + s - c]
  ];
}
function hf({ domNode: e, nodeId: t, getStoreItems: n, onChange: o, onEnd: r }) {
  const i = de(e);
  let s = {
    controlDirection: nr("bottom-right"),
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
    let m = { ...Yi }, _ = { ...df };
    s = {
      boundaries: u,
      resizeDirection: d,
      keepAspectRatio: f,
      controlDirection: nr(l)
    };
    let p, x = null, C = [], b, N, I, A = !1;
    const O = jr().on("start", (P) => {
      const { nodeLookup: R, transform: T, snapGrid: y, snapToGrid: S, nodeOrigin: E, paneDomNode: M } = n();
      if (p = R.get(t), !p)
        return;
      x = M?.getBoundingClientRect() ?? null;
      const { xSnapped: k, ySnapped: $ } = yt(P.sourceEvent, {
        transform: T,
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
        pointerX: k,
        pointerY: $,
        aspectRatio: m.width / m.height
      }, b = void 0, N = Je(p.extent) ? p.extent : void 0, p.parentId && (p.extent === "parent" || p.expandParent) && (b = R.get(p.parentId)), b && p.extent === "parent" && (N = [
        [0, 0],
        [b.measured.width, b.measured.height]
      ]), C = [], I = void 0;
      for (const [H, V] of R)
        if (V.parentId === t && (C.push({
          id: H,
          position: { ...V.position },
          extent: V.extent
        }), V.extent === "parent" || V.expandParent)) {
          const L = ff(V, p, V.origin ?? E);
          I ? I = [
            [Math.min(L[0][0], I[0][0]), Math.min(L[0][1], I[0][1])],
            [Math.max(L[1][0], I[1][0]), Math.max(L[1][1], I[1][1])]
          ] : I = L;
        }
      h?.(P, { ...m });
    }).on("drag", (P) => {
      const { transform: R, snapGrid: T, snapToGrid: y, nodeOrigin: S } = n(), E = yt(P.sourceEvent, {
        transform: R,
        snapGrid: T,
        snapToGrid: y,
        containerBounds: x
      }), M = [];
      if (!p)
        return;
      const { x: k, y: $, width: H, height: V } = m, L = {}, X = p.origin ?? S, { width: B, height: q, x: Q, y: W } = uf(_, s.controlDirection, E, s.boundaries, s.keepAspectRatio, X, N, I), D = B !== H, F = q !== V, K = Q !== k && D, U = W !== $ && F;
      if (!K && !U && !D && !F)
        return;
      if ((K || U || X[0] === 1 || X[1] === 1) && (L.x = K ? Q : m.x, L.y = U ? W : m.y, m.x = L.x, m.y = L.y, C.length > 0)) {
        const te = Q - k, re = W - $;
        for (const ce of C)
          ce.position = {
            x: ce.position.x - te + X[0] * (B - H),
            y: ce.position.y - re + X[1] * (q - V)
          }, M.push(ce);
      }
      if ((D || F) && (L.width = D && (!s.resizeDirection || s.resizeDirection === "horizontal") ? B : m.width, L.height = F && (!s.resizeDirection || s.resizeDirection === "vertical") ? q : m.height, m.width = L.width, m.height = L.height), b && p.expandParent) {
        const te = X[0] * (L.width ?? 0);
        L.x && L.x < te && (m.x = te, _.x = _.x - (L.x - te));
        const re = X[1] * (L.height ?? 0);
        L.y && L.y < re && (m.y = re, _.y = _.y - (L.y - re));
      }
      const Y = lf({
        width: m.width,
        prevWidth: H,
        height: m.height,
        prevHeight: V,
        affectsX: s.controlDirection.affectsX,
        affectsY: s.controlDirection.affectsY
      }), G = { ...m, direction: Y };
      w?.(P, G) !== !1 && (A = !0, g?.(P, G), o(L, M));
    }).on("end", (P) => {
      A && (v?.(P, { ...m }), r?.({ ...m }), A = !1);
    });
    i.call(O);
  }
  function c() {
    i.on(".drag", null);
  }
  return {
    update: a,
    destroy: c
  };
}
var An = { exports: {} }, kn = {};
const Zi = /* @__PURE__ */ ka($a);
var $n = { exports: {} }, Pn = {};
var rr;
function gf() {
  if (rr) return Pn;
  rr = 1;
  var e = Zi;
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
var ir;
function pf() {
  return ir || (ir = 1, $n.exports = gf()), $n.exports;
}
var sr;
function mf() {
  if (sr) return kn;
  sr = 1;
  var e = Zi, t = pf();
  function n(l, u) {
    return l === u && (l !== 0 || 1 / l === 1 / u) || l !== l && u !== u;
  }
  var o = typeof Object.is == "function" ? Object.is : n, r = t.useSyncExternalStore, i = e.useRef, s = e.useEffect, a = e.useMemo, c = e.useDebugValue;
  return kn.useSyncExternalStoreWithSelector = function(l, u, f, d, h) {
    var g = i(null);
    if (g.current === null) {
      var v = { hasValue: !1, value: null };
      g.current = v;
    } else v = g.current;
    g = a(
      function() {
        function m(b) {
          if (!_) {
            if (_ = !0, p = b, b = d(b), h !== void 0 && v.hasValue) {
              var N = v.value;
              if (h(N, b))
                return x = N;
            }
            return x = b;
          }
          if (N = x, o(p, b)) return N;
          var I = d(b);
          return h !== void 0 && h(N, I) ? (p = b, N) : (p = b, x = I);
        }
        var _ = !1, p, x, C = f === void 0 ? null : f;
        return [
          function() {
            return m(u());
          },
          C === null ? void 0 : function() {
            return m(C());
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
  }, kn;
}
var ar;
function yf() {
  return ar || (ar = 1, An.exports = mf()), An.exports;
}
var wf = yf();
const xf = /* @__PURE__ */ Pa(wf), { useDebugValue: vf } = Da, { useSyncExternalStoreWithSelector: bf } = xf, _f = (e) => e;
function Wi(e, t = _f, n) {
  const o = bf(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    t,
    n
  );
  return vf(o), o;
}
const cr = (e, t) => {
  const n = Ta(e), o = (r, i = t) => Wi(n, r, i);
  return Object.assign(o, n), o;
}, Sf = (e, t) => e ? cr(e, t) : cr;
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
const pn = sn(null), Ef = pn.Provider, qi = ve.error001("react");
function j(e, t) {
  const n = ut(pn);
  if (n === null)
    throw new Error(qi);
  return Wi(n, e, t);
}
function oe() {
  const e = ut(pn);
  if (e === null)
    throw new Error(qi);
  return xe(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const lr = { display: "none" }, Nf = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, Gi = "react-flow__node-desc", Ui = "react-flow__edge-desc", Cf = "react-flow__aria-live", Mf = (e) => e.ariaLiveMessage, If = (e) => e.ariaLabelConfig;
function Af({ rfId: e }) {
  const t = j(Mf);
  return z("div", { id: `${Cf}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: Nf, children: t });
}
function kf({ rfId: e, disableKeyboardA11y: t }) {
  const n = j(If);
  return le(He, { children: [z("div", { id: `${Gi}-${e}`, style: lr, children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"] }), z("div", { id: `${Ui}-${e}`, style: lr, children: n["edge.a11yDescription.default"] }), !t && z(Af, { rfId: e })] });
}
const mn = Lr(({ position: e = "top-left", children: t, className: n, style: o, ...r }, i) => {
  const s = `${e}`.split("-");
  return z("div", { className: ae(["react-flow__panel", n, ...s]), style: o, ref: i, ...r, children: t });
});
mn.displayName = "Panel";
const ur = "https://reactflow.dev?utm_source=attribution";
function $f({ proOptions: e, position: t = "bottom-right" }) {
  return e?.hideAttribution ? null : z(mn, { position: t, className: "react-flow__attribution", "data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${ur}`, children: z("a", { href: ur, target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const Pf = (e) => {
  const t = [], n = [];
  for (const [, o] of e.nodeLookup)
    o.selected && t.push(o.internals.userNode);
  for (const [, o] of e.edgeLookup)
    o.selected && n.push(o);
  return { selectedNodes: t, selectedEdges: n };
}, Ot = (e) => e.id;
function Df(e, t) {
  return ie(e.selectedNodes.map(Ot), t.selectedNodes.map(Ot)) && ie(e.selectedEdges.map(Ot), t.selectedEdges.map(Ot));
}
function zf({ onSelectionChange: e }) {
  const t = oe(), { selectedNodes: n, selectedEdges: o } = j(Pf, Df);
  return ne(() => {
    const r = { nodes: n, edges: o };
    e?.(r), t.getState().onSelectionChangeHandlers.forEach((i) => i(r));
  }, [n, o, e]), null;
}
const Tf = (e) => !!e.onSelectionChangeHandlers;
function Hf({ onSelectionChange: e }) {
  const t = j(Tf);
  return e || t ? z(zf, { onSelectionChange: e }) : null;
}
const Ki = [0, 0], Rf = { x: 0, y: 0, zoom: 1 }, Lf = [
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
], dr = [...Lf, "rfId"], Vf = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), fr = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: _t,
  nodeOrigin: Ki,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function Of(e) {
  const { setNodes: t, setEdges: n, setMinZoom: o, setMaxZoom: r, setTranslateExtent: i, setNodeExtent: s, reset: a, setDefaultNodesAndEdges: c } = j(Vf, ie), l = oe();
  ne(() => (c(e.defaultNodes, e.defaultEdges), () => {
    u.current = fr, a();
  }), []);
  const u = ee(fr);
  return ne(
    () => {
      for (const f of dr) {
        const d = e[f], h = u.current[f];
        d !== h && (typeof e[f] > "u" || (f === "nodes" ? t(d) : f === "edges" ? n(d) : f === "minZoom" ? o(d) : f === "maxZoom" ? r(d) : f === "translateExtent" ? i(d) : f === "nodeExtent" ? s(d) : f === "ariaLabelConfig" ? l.setState({ ariaLabelConfig: Nd(d) }) : f === "fitView" ? l.setState({ fitViewQueued: d }) : f === "fitViewOptions" ? l.setState({ fitViewOptions: d }) : l.setState({ [f]: d })));
      }
      u.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    dr.map((f) => e[f])
  ), null;
}
function hr() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function Bf(e) {
  const [t, n] = we(e === "system" ? null : e);
  return ne(() => {
    if (e !== "system") {
      n(e);
      return;
    }
    const o = hr(), r = () => n(o?.matches ? "dark" : "light");
    return r(), o?.addEventListener("change", r), () => {
      o?.removeEventListener("change", r);
    };
  }, [e]), t !== null ? t : hr()?.matches ? "dark" : "light";
}
const gr = typeof document < "u" ? document : null;
function Ct(e = null, t = { target: gr, actInsideInputWithModifier: !0 }) {
  const [n, o] = we(!1), r = ee(!1), i = ee(/* @__PURE__ */ new Set([])), [s, a] = xe(() => {
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
  return ne(() => {
    const c = t?.target ?? gr, l = t?.actInsideInputWithModifier ?? !0;
    if (e !== null) {
      const u = (h) => {
        if (r.current = h.ctrlKey || h.metaKey || h.shiftKey || h.altKey, (!r.current || r.current && !l) && Ii(h))
          return !1;
        const v = mr(h.code, a);
        if (i.current.add(h[v]), pr(s, i.current, !1)) {
          const w = h.composedPath?.()?.[0] || h.target, m = w?.nodeName === "BUTTON" || w?.nodeName === "A";
          t.preventDefault !== !1 && (r.current || !m) && h.preventDefault(), o(!0);
        }
      }, f = (h) => {
        const g = mr(h.code, a);
        pr(s, i.current, !0) ? (o(!1), i.current.clear()) : i.current.delete(h[g]), h.key === "Meta" && i.current.clear(), r.current = !1;
      }, d = () => {
        i.current.clear(), o(!1);
      };
      return c?.addEventListener("keydown", u), c?.addEventListener("keyup", f), window.addEventListener("blur", d), window.addEventListener("contextmenu", d), () => {
        c?.removeEventListener("keydown", u), c?.removeEventListener("keyup", f), window.removeEventListener("blur", d), window.removeEventListener("contextmenu", d);
      };
    }
  }, [e, o]), n;
}
function pr(e, t, n) {
  return e.filter((o) => n || o.length === t.size).some((o) => o.every((r) => t.has(r)));
}
function mr(e, t) {
  return t.includes(e) ? "code" : "key";
}
const Ff = () => {
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
      const { width: o, height: r, minZoom: i, maxZoom: s, panZoom: a } = e.getState(), c = ao(t, o, r, i, s, n?.padding ?? 0.1);
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
function Qi(e, t) {
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
      Xf(c, a);
    n.push(a);
  }
  return r.length && r.forEach((i) => {
    i.index !== void 0 ? n.splice(i.index, 0, { ...i.item }) : n.push({ ...i.item });
  }), n;
}
function Xf(e, t) {
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
function Yf(e, t) {
  return Qi(e, t);
}
function Zf(e, t) {
  return Qi(e, t);
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
function yr({ items: e = [], lookup: t }) {
  const n = [], o = new Map(e.map((r) => [r.id, r]));
  for (const [r, i] of e.entries()) {
    const s = t.get(i.id), a = s?.internals?.userNode ?? s;
    a !== void 0 && a !== i && n.push({ id: i.id, item: i, type: "replace" }), a === void 0 && n.push({ item: i, type: "add", index: r });
  }
  for (const [r] of t)
    o.get(r) === void 0 && n.push({ id: r, type: "remove" });
  return n;
}
function wr(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const Wf = Ei();
function qf(e, t, n = {}) {
  return $d(e, t, {
    ...n,
    onError: n.onError ?? Wf
  });
}
const xr = (e) => md(e), Gf = (e) => xi(e);
function Ji(e) {
  return Lr(e);
}
const ji = typeof window < "u" ? za : ne;
function vr(e) {
  const [t, n] = we(BigInt(0)), [o] = we(() => Uf(() => n((r) => r + BigInt(1))));
  return ji(() => {
    const r = o.get();
    r.length && (e(r), o.reset());
  }, [t]), o;
}
function Uf(e) {
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
const es = sn(null);
function Kf({ children: e }) {
  const t = oe(), n = Me((a) => {
    const { nodes: c = [], setNodes: l, hasDefaultNodes: u, onNodesChange: f, nodeLookup: d, fitViewQueued: h, onNodesChangeMiddlewareMap: g } = t.getState();
    let v = c;
    for (const m of a)
      v = typeof m == "function" ? m(v) : m;
    let w = yr({
      items: v,
      lookup: d
    });
    for (const m of g.values())
      w = m(w);
    u && l(v), w.length > 0 ? f?.(w) : h && window.requestAnimationFrame(() => {
      const { fitViewQueued: m, nodes: _, setNodes: p } = t.getState();
      m && p(_);
    });
  }, []), o = vr(n), r = Me((a) => {
    const { edges: c = [], setEdges: l, hasDefaultEdges: u, onEdgesChange: f, edgeLookup: d } = t.getState();
    let h = c;
    for (const g of a)
      h = typeof g == "function" ? g(h) : g;
    u ? l(h) : f && f(yr({
      items: h,
      lookup: d
    }));
  }, []), i = vr(r), s = xe(() => ({ nodeQueue: o, edgeQueue: i }), []);
  return z(es.Provider, { value: s, children: e });
}
function Qf() {
  const e = ut(es);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const Jf = (e) => !!e.panZoom;
function po() {
  const e = Ff(), t = oe(), n = Qf(), o = j(Jf), r = xe(() => {
    const i = (f) => t.getState().nodeLookup.get(f), s = (f) => {
      n.nodeQueue.push(f);
    }, a = (f) => {
      n.edgeQueue.push(f);
    }, c = (f) => {
      const { nodeLookup: d, nodeOrigin: h } = t.getState(), g = xr(f) ? f : d.get(f.id), v = g.parentId ? Ci(g.position, g.measured, g.parentId, d, h) : g.position, w = {
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
          return h.replace && xr(w) ? w : { ...v, ...w };
        }
        return v;
      }));
    }, u = (f, d, h = { replace: !1 }) => {
      a((g) => g.map((v) => {
        if (v.id === f) {
          const w = typeof d == "function" ? d(v) : d;
          return h.replace && Gf(w) ? w : { ...v, ...w };
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
        const { nodes: h, edges: g, onNodesDelete: v, onEdgesDelete: w, triggerNodeChanges: m, triggerEdgeChanges: _, onDelete: p, onBeforeDelete: x } = t.getState(), { nodes: C, edges: b } = await bd({
          nodesToRemove: f,
          edgesToRemove: d,
          nodes: h,
          edges: g,
          onBeforeDelete: x
        }), N = b.length > 0, I = C.length > 0;
        if (N) {
          const A = b.map(wr);
          w?.(b), _(A);
        }
        if (I) {
          const A = C.map(wr);
          v?.(C), m(A);
        }
        return (I || N) && p?.({ nodes: C, edges: b }), { deletedNodes: C, deletedEdges: b };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (f, d = !0, h) => {
        const g = Zo(f), v = g ? f : c(f), w = h !== void 0;
        return v ? (h || t.getState().nodes).filter((m) => {
          const _ = t.getState().nodeLookup.get(m.id);
          if (_ && !g && (m.id === f.id || !_.internals.positionAbsolute))
            return !1;
          const p = Et(w ? m : _), x = nn(p, v);
          return d && x > 0 || x >= p.width * p.height || x >= v.width * v.height;
        }) : [];
      },
      isNodeIntersecting: (f, d, h = !0) => {
        const v = Zo(f) ? f : c(f);
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
        return yd(f, { nodeLookup: d, nodeOrigin: h });
      },
      getHandleConnections: ({ type: f, id: d, nodeId: h }) => Array.from(t.getState().connectionLookup.get(`${h}-${f}${d ? `-${d}` : ""}`)?.values() ?? []),
      getNodeConnections: ({ type: f, handleId: d, nodeId: h }) => Array.from(t.getState().connectionLookup.get(`${h}${f ? d ? `-${f}-${d}` : `-${f}` : ""}`)?.values() ?? []),
      fitView: async (f) => {
        const d = t.getState().fitViewResolver ?? Ed();
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
const br = (e) => e.selected, jf = typeof window < "u" ? window : void 0;
function eh({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
  const n = oe(), { deleteElements: o } = po(), r = Ct(e, { actInsideInputWithModifier: !1 }), i = Ct(t, { target: jf });
  ne(() => {
    if (r) {
      const { edges: s, nodes: a } = n.getState();
      o({ nodes: a.filter(br), edges: s.filter(br) }), n.setState({ nodesSelectionActive: !1 });
    }
  }, [r]), ne(() => {
    n.setState({ multiSelectionActive: i });
  }, [i]);
}
function th(e) {
  const t = oe();
  ne(() => {
    const n = () => {
      if (!e.current || !(e.current.checkVisibility?.() ?? !0))
        return !1;
      const o = co(e.current);
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
}, nh = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function oh({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: o = !1, panActivationKeyPressed: r, panOnScrollSpeed: i = 0.5, panOnScrollMode: s = Ge.Free, zoomOnDoubleClick: a = !0, panOnDrag: c = !0, defaultViewport: l, translateExtent: u, minZoom: f, maxZoom: d, zoomActivationKeyCode: h, preventScrolling: g = !0, children: v, noWheelClassName: w, noPanClassName: m, onViewportChange: _, isControlledViewport: p, paneClickDistance: x, selectionOnDrag: C }) {
  const b = oe(), N = ee(null), { userSelectionActive: I, lib: A, connectionInProgress: O } = j(nh, ie), P = Ct(h), R = ee();
  th(N);
  const T = Me((y) => {
    _?.({ x: y[0], y: y[1], zoom: y[2] }), p || b.setState({ transform: y });
  }, [_, p]);
  return ne(() => {
    if (N.current) {
      R.current = cf({
        domNode: N.current,
        minZoom: f,
        maxZoom: d,
        translateExtent: u,
        viewport: l,
        onDraggingChange: (M) => b.setState((k) => k.paneDragging === M ? k : { paneDragging: M }),
        onPanZoomStart: (M, k) => {
          const { onViewportChangeStart: $, onMoveStart: H } = b.getState();
          H?.(M, k), $?.(k);
        },
        onPanZoom: (M, k) => {
          const { onViewportChange: $, onMove: H } = b.getState();
          H?.(M, k), $?.(k);
        },
        onPanZoomEnd: (M, k) => {
          const { onViewportChangeEnd: $, onMoveEnd: H } = b.getState();
          H?.(M, k), $?.(k);
        }
      });
      const { x: y, y: S, zoom: E } = R.current.getViewport();
      return b.setState({
        panZoom: R.current,
        transform: [y, S, E],
        domNode: N.current.closest(".react-flow")
      }), () => {
        R.current?.destroy();
      };
    }
  }, []), ne(() => {
    R.current?.update({
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
      userSelectionActive: I,
      noWheelClassName: w,
      lib: A,
      onTransformChange: T,
      connectionInProgress: O,
      selectionOnDrag: C,
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
    I,
    w,
    A,
    T,
    O,
    C,
    x
  ]), z("div", { className: "react-flow__renderer", ref: N, style: yn, children: v });
}
const rh = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function ih() {
  const { userSelectionActive: e, userSelectionRect: t } = j(rh, ie);
  return e && t ? z("div", { className: "react-flow__selection react-flow__container", style: {
    width: t.width,
    height: t.height,
    transform: `translate(${t.x}px, ${t.y}px)`
  } }) : null;
}
const Dn = (e, t) => (n) => {
  n.target === t.current && e?.(n);
}, sh = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  dragging: e.paneDragging,
  panBy: e.panBy,
  autoPanSpeed: e.autoPanSpeed
});
function ah({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = St.Full, panOnDrag: o, autoPanOnSelection: r, paneClickDistance: i, selectionOnDrag: s, onSelectionStart: a, onSelectionEnd: c, onPaneClick: l, onPaneContextMenu: u, onPaneScroll: f, onPaneMouseEnter: d, onPaneMouseMove: h, onPaneMouseLeave: g, children: v }) {
  const w = ee(0), m = oe(), { userSelectionActive: _, elementsSelectable: p, dragging: x, panBy: C, autoPanSpeed: b } = j(sh, ie), N = p && (e || _), I = ee(null), A = ee(), O = ee(/* @__PURE__ */ new Set()), P = ee(/* @__PURE__ */ new Set()), R = ee(!1), T = ee(!1), y = ee({ x: 0, y: 0 }), S = ee(!1), E = (D) => {
    if (T.current || R.current || m.getState().connection.inProgress) {
      T.current = !1, R.current = !1;
      return;
    }
    l?.(D), m.getState().resetSelectedElements(), m.setState({ nodesSelectionActive: !1 });
  }, M = (D) => {
    if (Array.isArray(o) && o?.includes(2)) {
      D.preventDefault();
      return;
    }
    u?.(D);
  }, k = f ? (D) => f(D) : void 0, $ = (D) => {
    T.current && (D.stopPropagation(), T.current = !1);
  }, H = (D) => {
    if (D.pointerType === "touch" && o !== !1 && !t)
      return;
    const { domNode: F, transform: K } = m.getState();
    if (A.current = F?.getBoundingClientRect(), !A.current)
      return;
    const U = D.target === I.current;
    if (!U && !!D.target.closest(".nokey") || !e || !(s && U || t) || D.button !== 0 || !D.isPrimary)
      return;
    D.target?.setPointerCapture?.(D.pointerId), T.current = !1;
    const { x: J, y: te } = ye(D.nativeEvent, A.current), re = Pt({ x: J, y: te }, K);
    m.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: re.x,
        startY: re.y,
        x: J,
        y: te
      }
    }), U || (D.stopPropagation(), D.preventDefault());
  };
  function V(D, F) {
    const { userSelectionRect: K } = m.getState();
    if (!K)
      return;
    const { transform: U, nodeLookup: Y, edgeLookup: G, connectionLookup: J, triggerNodeChanges: te, triggerEdgeChanges: re, defaultEdgeOptions: ce } = m.getState(), Ae = { x: K.startX, y: K.startY }, { x: Se, y: Ee } = ct(Ae, U), ke = {
      startX: Ae.x,
      startY: Ae.y,
      x: D < Se ? D : Se,
      y: F < Ee ? F : Ee,
      width: Math.abs(D - Se),
      height: Math.abs(F - Ee)
    }, dt = O.current, Fe = P.current;
    O.current = new Set(io(Y, ke, U, n === St.Partial, !0).map((he) => he.id)), P.current = /* @__PURE__ */ new Set();
    const Xe = ce?.selectable ?? !0;
    for (const he of O.current) {
      const $e = J.get(he);
      if ($e)
        for (const { edgeId: Pe } of $e.values()) {
          const Ye = G.get(Pe);
          Ye && (Ye.selectable ?? Xe) && P.current.add(Pe);
        }
    }
    if (!Wo(dt, O.current)) {
      const he = tt(Y, O.current, !0);
      te(he);
    }
    if (!Wo(Fe, P.current)) {
      const he = tt(G, P.current);
      re(he);
    }
    m.setState({
      userSelectionRect: ke,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }
  function L() {
    if (!r || !A.current)
      return;
    const [D, F] = so(y.current, A.current, b);
    C({ x: D, y: F }).then((K) => {
      if (!T.current || !K) {
        w.current = requestAnimationFrame(L);
        return;
      }
      const { x: U, y: Y } = y.current;
      V(U, Y), w.current = requestAnimationFrame(L);
    });
  }
  const X = () => {
    cancelAnimationFrame(w.current), w.current = 0, S.current = !1;
  };
  ne(() => () => X(), []);
  const B = (D) => {
    const { userSelectionRect: F, transform: K, resetSelectedElements: U } = m.getState();
    if (!A.current || !F)
      return;
    const { x: Y, y: G } = ye(D.nativeEvent, A.current);
    y.current = { x: Y, y: G };
    const J = ct({ x: F.startX, y: F.startY }, K);
    if (!T.current) {
      const te = t ? 0 : i;
      if (Math.hypot(Y - J.x, G - J.y) <= te)
        return;
      U(), a?.(D);
    }
    T.current = !0, S.current || (L(), S.current = !0), V(Y, G);
  }, q = (D) => {
    if (!N) {
      D.target === I.current && m.getState().connection.inProgress && (R.current = !0);
      return;
    }
    D.button === 0 && (D.target?.releasePointerCapture?.(D.pointerId), !_ && D.target === I.current && m.getState().userSelectionRect && E?.(D), m.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), T.current && (c?.(D), m.setState({
      nodesSelectionActive: O.current.size > 0
    })), X());
  }, Q = (D) => {
    D.target?.releasePointerCapture?.(D.pointerId), X();
  }, W = o === !0 || Array.isArray(o) && o.includes(0);
  return le("div", { className: ae(["react-flow__pane", { draggable: W, dragging: x, selection: e }]), onClick: N ? void 0 : Dn(E, I), onContextMenu: Dn(M, I), onWheel: Dn(k, I), onPointerEnter: N ? void 0 : d, onPointerMove: N ? B : h, onPointerUp: q, onPointerCancel: N ? Q : void 0, onPointerDownCapture: N ? H : void 0, onClickCapture: N ? $ : void 0, onPointerLeave: g, ref: I, style: yn, children: [v, z(ih, {})] });
}
function Gn({ id: e, store: t, unselect: n = !1, nodeRef: o }) {
  const { addSelectedNodes: r, unselectNodesAndEdges: i, multiSelectionActive: s, nodeLookup: a, onError: c } = t.getState(), l = a.get(e);
  if (!l) {
    c?.("012", ve.error012(e));
    return;
  }
  t.setState({ nodesSelectionActive: !1 }), l.selected ? (n || l.selected && s) && (i({ nodes: [l], edges: [] }), requestAnimationFrame(() => o?.current?.blur())) : r([e]);
}
function ts({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: o, nodeId: r, isSelectable: i, nodeClickDistance: s }) {
  const a = oe(), [c, l] = we(!1), u = ee();
  return ne(() => {
    if (!t)
      return u.current = qd({
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
  }, [t, a, e]), ne(() => {
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
const ch = (e) => (t) => t.selected && (t.draggable || e && typeof t.draggable > "u");
function ns() {
  const e = oe();
  return Me((n) => {
    const { nodeExtent: o, snapToGrid: r, snapGrid: i, nodesDraggable: s, onError: a, updateNodePositions: c, nodeLookup: l, nodeOrigin: u } = e.getState(), f = /* @__PURE__ */ new Map(), d = ch(s), h = r ? i[0] : 5, g = r ? i[1] : 5, v = n.direction.x * h * n.factor, w = n.direction.y * g * n.factor;
    for (const [, m] of l) {
      if (!d(m))
        continue;
      let _ = {
        x: m.internals.positionAbsolute.x + v,
        y: m.internals.positionAbsolute.y + w
      };
      r && (_ = $t(_, i));
      const { position: p, positionAbsolute: x } = vi({
        nodeId: m.id,
        nextPosition: _,
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
const mo = sn(null), lh = mo.Provider;
mo.Consumer;
const os = () => ut(mo), uh = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), rs = sn(null);
function dh({ children: e }) {
  const t = j(uh, ie);
  return z(rs.Provider, { value: t, children: e });
}
function fh() {
  const e = ut(rs);
  if (!e)
    throw new Error("useHandleConfig must be used within a HandleConfigProvider");
  return e;
}
const hh = {
  connectingFrom: !1,
  connectingTo: !1,
  clickConnecting: !1,
  isPossibleEndHandle: !0,
  connectionInProcess: !1,
  clickConnectionInProcess: !1,
  valid: !1
}, gh = (e, t, n) => (o) => {
  const { connectionClickStartHandle: r, connectionMode: i, connection: s } = o, { fromHandle: a, toHandle: c, isValid: l } = s;
  if (!a && !r)
    return hh;
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
function ph({ type: e = "source", position: t = Z.Top, isValidConnection: n, isConnectable: o = !0, isConnectableStart: r = !0, isConnectableEnd: i = !0, id: s, onConnect: a, children: c, className: l, onMouseDown: u, onTouchStart: f, ...d }, h) {
  const g = s || null, v = e === "target", w = oe(), m = os(), { connectOnClick: _, noPanClassName: p, rfId: x } = fh(), { connectingFrom: C, connectingTo: b, clickConnecting: N, isPossibleEndHandle: I, connectionInProcess: A, clickConnectionInProcess: O, valid: P } = j(gh(m, g, e), ie);
  m || w.getState().onError?.("010", ve.error010());
  const R = (S) => {
    const { defaultEdgeOptions: E, onConnect: M, hasDefaultEdges: k } = w.getState(), $ = {
      ...E,
      ...S
    };
    if (k) {
      const { edges: H, setEdges: V, onError: L } = w.getState();
      V(qf($, H, { onError: L }));
    }
    M?.($), a?.($);
  }, T = (S) => {
    if (!m)
      return;
    const E = Ai(S.nativeEvent);
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
        onConnectEnd: (...k) => w.getState().onConnectEnd?.(...k),
        updateConnection: M.updateConnection,
        onConnect: R,
        isValidConnection: n || ((...k) => w.getState().isValidConnection?.(...k) ?? !0),
        getTransform: () => w.getState().transform,
        getFromHandle: () => w.getState().connection.fromHandle,
        autoPanSpeed: M.autoPanSpeed,
        dragThreshold: M.connectionDragThreshold
      });
    }
    E ? u?.(S) : f?.(S);
  }, y = (S) => {
    const { onClickConnectStart: E, onClickConnectEnd: M, connectionClickStartHandle: k, connectionMode: $, isValidConnection: H, lib: V, rfId: L, nodeLookup: X, connection: B } = w.getState();
    if (!m || !k && !r)
      return;
    if (!k) {
      E?.(S.nativeEvent, { nodeId: m, handleId: g, handleType: e }), w.setState({ connectionClickStartHandle: { nodeId: m, type: e, id: g } });
      return;
    }
    const q = Mi(S.target), Q = n || H, { connection: W, isValid: D } = qn.isValid(S.nativeEvent, {
      handle: {
        nodeId: m,
        id: g,
        type: e
      },
      connectionMode: $,
      fromNodeId: k.nodeId,
      fromHandleId: k.id || null,
      fromType: k.type,
      isValidConnection: Q,
      flowId: L,
      doc: q,
      lib: V,
      nodeLookup: X
    });
    D && W && R(W);
    const F = structuredClone(B);
    delete F.inProgress, F.toPosition = F.toHandle ? F.toHandle.position : null, M?.(S, F), w.setState({ connectionClickStartHandle: null });
  };
  return z("div", { "data-handleid": g, "data-nodeid": m, "data-handlepos": t, "data-id": `${x}-${m}-${g}-${e}`, className: ae([
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
      clickconnecting: N,
      connectingfrom: C,
      connectingto: b,
      valid: P,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: o && (!A || I) && (A || O ? i : r)
    }
  ]), onMouseDown: T, onTouchStart: T, onClick: _ ? y : void 0, ref: h, ...d, children: c });
}
const on = se(Ji(ph));
function mh({ data: e, isConnectable: t, sourcePosition: n = Z.Bottom }) {
  return le(He, { children: [e?.label, z(on, { type: "source", position: n, isConnectable: t })] });
}
function yh({ data: e, isConnectable: t, targetPosition: n = Z.Top, sourcePosition: o = Z.Bottom }) {
  return le(He, { children: [z(on, { type: "target", position: n, isConnectable: t }), e?.label, z(on, { type: "source", position: o, isConnectable: t })] });
}
function wh() {
  return null;
}
function xh({ data: e, isConnectable: t, targetPosition: n = Z.Top }) {
  return le(He, { children: [z(on, { type: "target", position: n, isConnectable: t }), e?.label] });
}
const rn = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, _r = {
  input: mh,
  default: yh,
  output: xh,
  group: wh
};
function vh(e) {
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? e.style?.width,
    height: e.height ?? e.initialHeight ?? e.style?.height
  } : {
    width: e.width ?? e.style?.width,
    height: e.height ?? e.style?.height
  };
}
const bh = (e) => {
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
function _h({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
  const o = oe(), { width: r, height: i, transformString: s, userSelectionActive: a } = j(bh, ie), c = ns(), l = ee(null);
  ne(() => {
    n || l.current?.focus({
      preventScroll: !0
    });
  }, [n]);
  const u = !a && r !== null && i !== null;
  if (ts({
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
  return z("div", { className: ae(["react-flow__nodesselection", "react-flow__container", t]), style: {
    transform: s
  }, children: z("div", { ref: l, className: "react-flow__nodesselection-rect", onContextMenu: f, tabIndex: n ? void 0 : -1, onKeyDown: n ? void 0 : d, style: {
    width: r,
    height: i
  } }) });
}
const Sr = typeof window < "u" ? window : void 0, Sh = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function is({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: o, onPaneMouseLeave: r, onPaneContextMenu: i, onPaneScroll: s, paneClickDistance: a, deleteKeyCode: c, selectionKeyCode: l, selectionOnDrag: u, selectionMode: f, onSelectionStart: d, onSelectionEnd: h, multiSelectionKeyCode: g, panActivationKeyCode: v, zoomActivationKeyCode: w, elementsSelectable: m, zoomOnScroll: _, zoomOnPinch: p, panOnScroll: x, panOnScrollSpeed: C, panOnScrollMode: b, zoomOnDoubleClick: N, panOnDrag: I, autoPanOnSelection: A, defaultViewport: O, translateExtent: P, minZoom: R, maxZoom: T, preventScrolling: y, onSelectionContextMenu: S, noWheelClassName: E, noPanClassName: M, disableKeyboardA11y: k, onViewportChange: $, isControlledViewport: H }) {
  const { nodesSelectionActive: V, userSelectionActive: L } = j(Sh, ie), X = Ct(l, { target: Sr }), B = Ct(v, { target: Sr }), q = B || I, Q = B || x, W = u && q !== !0, D = X || L || W;
  return eh({ deleteKeyCode: c, multiSelectionKeyCode: g }), z(oh, { onPaneContextMenu: i, elementsSelectable: m, zoomOnScroll: _, zoomOnPinch: p, panOnScroll: Q, panActivationKeyPressed: B, panOnScrollSpeed: C, panOnScrollMode: b, zoomOnDoubleClick: N, panOnDrag: !X && q, defaultViewport: O, translateExtent: P, minZoom: R, maxZoom: T, zoomActivationKeyCode: w, preventScrolling: y, noWheelClassName: E, noPanClassName: M, onViewportChange: $, isControlledViewport: H, paneClickDistance: a, selectionOnDrag: W, children: le(ah, { onSelectionStart: d, onSelectionEnd: h, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: o, onPaneMouseLeave: r, onPaneContextMenu: i, onPaneScroll: s, panOnDrag: q, autoPanOnSelection: A, isSelecting: !!D, selectionMode: f, selectionKeyPressed: X, paneClickDistance: a, selectionOnDrag: W, children: [e, V && z(_h, { onSelectionContextMenu: S, noPanClassName: M, disableKeyboardA11y: k })] }) });
}
is.displayName = "FlowRenderer";
const Eh = se(is), Nh = (e) => (t) => e ? io(t.nodeLookup, { x: 0, y: 0, width: t.width, height: t.height }, t.transform, !0).map((n) => n.id) : Array.from(t.nodeLookup.keys());
function Ch(e) {
  return j(Me(Nh(e), [e]), ie);
}
const Mh = (e) => e.updateNodeInternals;
function Ih() {
  const e = j(Mh), [t] = we(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((n) => {
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
function Ah({ node: e, nodeType: t, hasDimensions: n, resizeObserver: o }) {
  const r = oe(), i = ee(null), s = ee(null), a = ee(e.sourcePosition), c = ee(e.targetPosition), l = ee(t), u = n && !!e.internals.handleBounds;
  return ne(() => {
    i.current && !e.hidden && (!u || s.current !== i.current) && (s.current && o?.unobserve(s.current), o?.observe(i.current), s.current = i.current);
  }, [u, e.hidden]), ne(() => () => {
    s.current && (o?.unobserve(s.current), s.current = null);
  }, []), ne(() => {
    if (i.current) {
      const f = l.current !== t, d = a.current !== e.sourcePosition, h = c.current !== e.targetPosition;
      (f || d || h) && (l.current = t, a.current = e.sourcePosition, c.current = e.targetPosition, r.getState().updateNodeInternals(/* @__PURE__ */ new Map([[e.id, { id: e.id, nodeElement: i.current, force: !0 }]])));
    }
  }, [e.id, t, e.sourcePosition, e.targetPosition]), i;
}
function kh({ id: e, onClick: t, onMouseEnter: n, onMouseMove: o, onMouseLeave: r, onContextMenu: i, onDoubleClick: s, nodesDraggable: a, elementsSelectable: c, nodesConnectable: l, nodesFocusable: u, resizeObserver: f, noDragClassName: d, noPanClassName: h, disableKeyboardA11y: g, rfId: v, nodeTypes: w, nodeClickDistance: m, onError: _ }) {
  const { node: p, internals: x, isParent: C } = j((D) => {
    const F = D.nodeLookup.get(e), K = D.parentLookup.has(e);
    return {
      node: F,
      internals: F.internals,
      isParent: K
    };
  }, ie);
  let b = p.type || "default", N = w?.[b] || _r[b];
  N === void 0 && (_?.("003", ve.error003(b)), b = "default", N = w?.default || _r.default);
  const I = !!(p.draggable || a && typeof p.draggable > "u"), A = !!(p.selectable || c && typeof p.selectable > "u"), O = !!(p.connectable || l && typeof p.connectable > "u"), P = !!(p.focusable || u && typeof p.focusable > "u"), R = oe(), T = Ni(p), y = Ah({ node: p, nodeType: b, hasDimensions: T, resizeObserver: f }), S = ts({
    nodeRef: y,
    disabled: p.hidden || !I,
    noDragClassName: d,
    handleSelector: p.dragHandle,
    nodeId: e,
    isSelectable: A,
    nodeClickDistance: m
  }), E = ns();
  if (p.hidden)
    return null;
  const M = _e(p), k = vh(p), $ = A || I || t || n || o || r, H = n ? (D) => n(D, { ...x.userNode }) : void 0, V = o ? (D) => o(D, { ...x.userNode }) : void 0, L = r ? (D) => r(D, { ...x.userNode }) : void 0, X = i ? (D) => i(D, { ...x.userNode }) : void 0, B = s ? (D) => s(D, { ...x.userNode }) : void 0, q = (D) => {
    const { selectNodesOnDrag: F, nodeDragThreshold: K } = R.getState();
    A && (!F || !I || K > 0) && Gn({
      id: e,
      store: R,
      nodeRef: y
    }), t && t(D, { ...x.userNode });
  }, Q = (D) => {
    if (!(Ii(D.nativeEvent) || g)) {
      if (pi.includes(D.key) && A) {
        const F = D.key === "Escape";
        Gn({
          id: e,
          store: R,
          unselect: F,
          nodeRef: y
        });
      } else if (I && p.selected && Object.prototype.hasOwnProperty.call(rn, D.key)) {
        D.preventDefault();
        const { ariaLabelConfig: F } = R.getState();
        R.setState({
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
  }, W = () => {
    if (g || !y.current?.matches(":focus-visible"))
      return;
    const { transform: D, width: F, height: K, autoPanOnNodeFocus: U, setCenter: Y } = R.getState();
    if (!U)
      return;
    io(/* @__PURE__ */ new Map([[e, p]]), { x: 0, y: 0, width: F, height: K }, D, !0).length > 0 || Y(p.position.x + M.width / 2, p.position.y + M.height / 2, {
      zoom: D[2]
    });
  };
  return z("div", { className: ae([
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
      parent: C,
      draggable: I,
      dragging: S
    }
  ]), ref: y, style: {
    zIndex: x.z,
    transform: `translate(${x.positionAbsolute.x}px,${x.positionAbsolute.y}px)`,
    pointerEvents: $ ? "all" : "none",
    visibility: T ? "visible" : "hidden",
    ...p.style,
    ...k
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: H, onMouseMove: V, onMouseLeave: L, onContextMenu: X, onClick: q, onDoubleClick: B, onKeyDown: P ? Q : void 0, tabIndex: P ? 0 : void 0, onFocus: P ? W : void 0, role: p.ariaRole ?? (P ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": g ? void 0 : `${Gi}-${v}`, "aria-label": p.ariaLabel, ...p.domAttributes, children: z(lh, { value: e, children: z(N, { id: e, data: p.data, type: b, positionAbsoluteX: x.positionAbsolute.x, positionAbsoluteY: x.positionAbsolute.y, selected: p.selected ?? !1, selectable: A, draggable: I, deletable: p.deletable ?? !0, isConnectable: O, sourcePosition: p.sourcePosition, targetPosition: p.targetPosition, dragging: S, dragHandle: p.dragHandle, zIndex: x.z, parentId: p.parentId, ...M }) }) });
}
var $h = se(kh);
const Ph = (e) => ({
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function ss(e) {
  const { nodesConnectable: t, nodesFocusable: n, elementsSelectable: o, onError: r } = j(Ph, ie), i = Ch(e.onlyRenderVisibleElements), s = Ih();
  return z("div", { className: "react-flow__nodes", style: yn, children: i.map((a) => (
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
    z($h, { id: a, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: s, nodesDraggable: e.nodesDraggable ?? !0, nodesConnectable: t, nodesFocusable: n, elementsSelectable: o, nodeClickDistance: e.nodeClickDistance, onError: r }, a)
  )) });
}
ss.displayName = "NodeRenderer";
const Dh = se(ss);
function zh(e) {
  return j(Me((n) => {
    if (!e)
      return n.edges.map((r) => r.id);
    const o = [];
    if (n.width && n.height)
      for (const r of n.edges) {
        const i = n.nodeLookup.get(r.source), s = n.nodeLookup.get(r.target);
        i && s && Id({
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
const Th = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e }
  };
  return z("polyline", { className: "arrow", style: n, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, Hh = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e, fill: e }
  };
  return z("polyline", { className: "arrowclosed", style: n, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, Er = {
  [en.Arrow]: Th,
  [en.ArrowClosed]: Hh
};
function Rh(e) {
  const t = oe();
  return xe(() => Object.prototype.hasOwnProperty.call(Er, e) ? Er[e] : (t.getState().onError?.("009", ve.error009(e)), null), [e]);
}
const Lh = ({ id: e, type: t, color: n, width: o = 12.5, height: r = 12.5, markerUnits: i = "strokeWidth", strokeWidth: s, orient: a = "auto-start-reverse" }) => {
  const c = Rh(t);
  return c ? z("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${o}`, markerHeight: `${r}`, viewBox: "-10 -10 20 20", markerUnits: i, orient: a, refX: "0", refY: "0", children: z(c, { color: n, strokeWidth: s }) }) : null;
}, as = ({ defaultColor: e, rfId: t }) => {
  const n = j((i) => i.edges), o = j((i) => i.defaultEdgeOptions), r = xe(() => Hd(n, {
    id: t,
    defaultColor: e,
    defaultMarkerStart: o?.markerStart,
    defaultMarkerEnd: o?.markerEnd
  }), [n, o, t, e]);
  return r.length ? z("svg", { className: "react-flow__marker", "aria-hidden": "true", children: z("defs", { children: r.map((i) => z(Lh, { id: i.id, type: i.type, color: i.color, width: i.width, height: i.height, markerUnits: i.markerUnits, strokeWidth: i.strokeWidth, orient: i.orient }, i.id)) }) }) : null;
};
as.displayName = "MarkerDefinitions";
var Vh = se(as);
function cs({ x: e, y: t, label: n, labelStyle: o, labelShowBg: r = !0, labelBgStyle: i, labelBgPadding: s = [2, 4], labelBgBorderRadius: a = 2, children: c, className: l, ...u }) {
  const [f, d] = we({ x: 1, y: 0, width: 0, height: 0 }), h = ae(["react-flow__edge-textwrapper", l]), g = ee(null);
  return ne(() => {
    if (g.current) {
      const v = g.current.getBBox();
      d({
        x: v.x,
        y: v.y,
        width: v.width,
        height: v.height
      });
    }
  }, [n]), n ? le("g", { transform: `translate(${e - f.width / 2} ${t - f.height / 2})`, className: h, visibility: f.width ? "visible" : "hidden", ...u, children: [r && z("rect", { width: f.width + 2 * s[0], x: -s[0], y: -s[1], height: f.height + 2 * s[1], className: "react-flow__edge-textbg", style: i, rx: a, ry: a }), z("text", { className: "react-flow__edge-text", y: f.height / 2, dy: "0.3em", ref: g, style: o, children: n }), c] }) : null;
}
cs.displayName = "EdgeText";
const Oh = se(cs);
function wn({ path: e, labelX: t, labelY: n, label: o, labelStyle: r, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: c, interactionWidth: l = 20, ...u }) {
  return le(He, { children: [z("path", { ...u, d: e, fill: "none", className: ae(["react-flow__edge-path", u.className]) }), l ? z("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: l, className: "react-flow__edge-interaction" }) : null, o && me(t) && me(n) ? z(Oh, { x: t, y: n, label: o, labelStyle: r, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: c }) : null] });
}
function Nr({ pos: e, x1: t, y1: n, x2: o, y2: r }) {
  return e === Z.Left || e === Z.Right ? [0.5 * (t + o), n] : [t, 0.5 * (n + r)];
}
function ls({ sourceX: e, sourceY: t, sourcePosition: n = Z.Bottom, targetX: o, targetY: r, targetPosition: i = Z.Top }) {
  const [s, a] = Nr({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: r
  }), [c, l] = Nr({
    pos: i,
    x1: o,
    y1: r,
    x2: e,
    y2: t
  }), [u, f, d, h] = ki({
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
function us(e) {
  return se(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: i, sourcePosition: s, targetPosition: a, label: c, labelStyle: l, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: w, interactionWidth: m }) => {
    const [_, p, x] = ls({
      sourceX: n,
      sourceY: o,
      sourcePosition: s,
      targetX: r,
      targetY: i,
      targetPosition: a
    }), C = e.isInternal ? void 0 : t;
    return z(wn, { id: C, path: _, labelX: p, labelY: x, label: c, labelStyle: l, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: w, interactionWidth: m });
  });
}
const Bh = us({ isInternal: !1 }), ds = us({ isInternal: !0 });
Bh.displayName = "SimpleBezierEdge";
ds.displayName = "SimpleBezierEdgeInternal";
function fs(e) {
  return se(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: i, label: s, labelStyle: a, labelShowBg: c, labelBgStyle: l, labelBgPadding: u, labelBgBorderRadius: f, style: d, sourcePosition: h = Z.Bottom, targetPosition: g = Z.Top, markerEnd: v, markerStart: w, pathOptions: m, interactionWidth: _ }) => {
    const [p, x, C] = Yn({
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
    return z(wn, { id: b, path: p, labelX: x, labelY: C, label: s, labelStyle: a, labelShowBg: c, labelBgStyle: l, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: v, markerStart: w, interactionWidth: _ });
  });
}
const hs = fs({ isInternal: !1 }), gs = fs({ isInternal: !0 });
hs.displayName = "SmoothStepEdge";
gs.displayName = "SmoothStepEdgeInternal";
function ps(e) {
  return se(({ id: t, ...n }) => {
    const o = e.isInternal ? void 0 : t;
    return z(hs, { ...n, id: o, pathOptions: xe(() => ({ borderRadius: 0, offset: n.pathOptions?.offset }), [n.pathOptions?.offset]) });
  });
}
const Fh = ps({ isInternal: !1 }), ms = ps({ isInternal: !0 });
Fh.displayName = "StepEdge";
ms.displayName = "StepEdgeInternal";
function ys(e) {
  return se(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: i, label: s, labelStyle: a, labelShowBg: c, labelBgStyle: l, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: h, markerStart: g, interactionWidth: v }) => {
    const [w, m, _] = Di({ sourceX: n, sourceY: o, targetX: r, targetY: i }), p = e.isInternal ? void 0 : t;
    return z(wn, { id: p, path: w, labelX: m, labelY: _, label: s, labelStyle: a, labelShowBg: c, labelBgStyle: l, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: h, markerStart: g, interactionWidth: v });
  });
}
const Xh = ys({ isInternal: !1 }), ws = ys({ isInternal: !0 });
Xh.displayName = "StraightEdge";
ws.displayName = "StraightEdgeInternal";
function xs(e) {
  return se(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: i, sourcePosition: s = Z.Bottom, targetPosition: a = Z.Top, label: c, labelStyle: l, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: w, pathOptions: m, interactionWidth: _ }) => {
    const [p, x, C] = $i({
      sourceX: n,
      sourceY: o,
      sourcePosition: s,
      targetX: r,
      targetY: i,
      targetPosition: a,
      curvature: m?.curvature
    }), b = e.isInternal ? void 0 : t;
    return z(wn, { id: b, path: p, labelX: x, labelY: C, label: c, labelStyle: l, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: w, interactionWidth: _ });
  });
}
const Yh = xs({ isInternal: !1 }), vs = xs({ isInternal: !0 });
Yh.displayName = "BezierEdge";
vs.displayName = "BezierEdgeInternal";
const Cr = {
  default: vs,
  straight: ws,
  step: ms,
  smoothstep: gs,
  simplebezier: ds
}, Mr = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  zIndex: void 0
}, Zh = (e, t, n) => n === Z.Left ? e - t : n === Z.Right ? e + t : e, Wh = (e, t, n) => n === Z.Top ? e - t : n === Z.Bottom ? e + t : e, Ir = "react-flow__edgeupdater";
function Ar({ position: e, centerX: t, centerY: n, radius: o = 10, onMouseDown: r, onMouseEnter: i, onMouseOut: s, type: a }) {
  return z("circle", { onMouseDown: r, onMouseEnter: i, onMouseOut: s, className: ae([Ir, `${Ir}-${a}`]), cx: Zh(t, o, e), cy: Wh(n, o, e), r: o, stroke: "transparent", fill: "transparent" });
}
function qh({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: o, sourceY: r, targetX: i, targetY: s, sourcePosition: a, targetPosition: c, onReconnect: l, onReconnectStart: u, onReconnectEnd: f, setReconnecting: d, setUpdateHover: h }) {
  const g = oe(), v = (x, C) => {
    if (x.button !== 0)
      return;
    const { autoPanOnConnect: b, domNode: N, connectionMode: I, connectionRadius: A, lib: O, onConnectStart: P, cancelConnection: R, nodeLookup: T, rfId: y, panBy: S, updateConnection: E } = g.getState(), M = C.type === "target", k = (V, L) => {
      d(!1), f?.(V, n, C.type, L);
    }, $ = (V) => l?.(n, V), H = (V, L) => {
      d(!0), u?.(x, n, C.type), P?.(V, L);
    };
    qn.onPointerDown(x.nativeEvent, {
      autoPanOnConnect: b,
      connectionMode: I,
      connectionRadius: A,
      domNode: N,
      handleId: C.id,
      nodeId: C.nodeId,
      nodeLookup: T,
      isTarget: M,
      edgeUpdaterType: C.type,
      lib: O,
      flowId: y,
      cancelConnection: R,
      panBy: S,
      isValidConnection: (...V) => g.getState().isValidConnection?.(...V) ?? !0,
      onConnect: $,
      onConnectStart: H,
      onConnectEnd: (...V) => g.getState().onConnectEnd?.(...V),
      onReconnectEnd: k,
      updateConnection: E,
      getTransform: () => g.getState().transform,
      getFromHandle: () => g.getState().connection.fromHandle,
      dragThreshold: g.getState().connectionDragThreshold,
      handleDomNode: x.currentTarget
    });
  }, w = (x) => v(x, { nodeId: n.target, id: n.targetHandle ?? null, type: "target" }), m = (x) => v(x, { nodeId: n.source, id: n.sourceHandle ?? null, type: "source" }), _ = () => h(!0), p = () => h(!1);
  return le(He, { children: [(e === !0 || e === "source") && z(Ar, { position: a, centerX: o, centerY: r, radius: t, onMouseDown: w, onMouseEnter: _, onMouseOut: p, type: "source" }), (e === !0 || e === "target") && z(Ar, { position: c, centerX: i, centerY: s, radius: t, onMouseDown: m, onMouseEnter: _, onMouseOut: p, type: "target" })] });
}
function Gh({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: o, onClick: r, onDoubleClick: i, onContextMenu: s, onMouseEnter: a, onMouseMove: c, onMouseLeave: l, reconnectRadius: u, onReconnect: f, onReconnectStart: d, onReconnectEnd: h, rfId: g, edgeTypes: v, noPanClassName: w, onError: m, disableKeyboardA11y: _ }) {
  let p = j((Y) => Y.edgeLookup.get(e));
  const x = j((Y) => Y.defaultEdgeOptions);
  p = x ? { ...x, ...p } : p;
  let C = p.type || "default", b = v?.[C] || Cr[C];
  b === void 0 && (m?.("011", ve.error011(C)), C = "default", b = v?.default || Cr.default);
  const N = !!(p.focusable || t && typeof p.focusable > "u"), I = typeof f < "u" && (p.reconnectable || n && typeof p.reconnectable > "u"), A = !!(p.selectable || o && typeof p.selectable > "u"), O = ee(null), [P, R] = we(!1), [T, y] = we(!1), S = oe(), { zIndex: E = p.zIndex, sourceX: M, sourceY: k, targetX: $, targetY: H, sourcePosition: V, targetPosition: L } = j(Me((Y) => {
    const G = Y.nodeLookup.get(p.source), J = Y.nodeLookup.get(p.target);
    if (!G || !J)
      return Mr;
    const te = Td({
      id: e,
      sourceNode: G,
      targetNode: J,
      sourceHandle: p.sourceHandle || null,
      targetHandle: p.targetHandle || null,
      connectionMode: Y.connectionMode,
      onError: m
    }), re = Md({
      selected: p.selected,
      zIndex: p.zIndex,
      sourceNode: G,
      targetNode: J,
      elevateOnSelect: Y.elevateEdgesOnSelect,
      zIndexMode: Y.zIndexMode
    });
    return {
      ...te || Mr,
      zIndex: re
    };
  }, [p.source, p.target, p.sourceHandle, p.targetHandle, p.selected, p.zIndex, m]), ie), X = xe(() => p.markerStart ? `url('#${Zn(p.markerStart, g)}')` : void 0, [p.markerStart, g]), B = xe(() => p.markerEnd ? `url('#${Zn(p.markerEnd, g)}')` : void 0, [p.markerEnd, g]);
  if (p.hidden || M === null || k === null || $ === null || H === null)
    return null;
  const q = (Y) => {
    const { addSelectedEdges: G, unselectNodesAndEdges: J, multiSelectionActive: te } = S.getState();
    A && (S.setState({ nodesSelectionActive: !1 }), p.selected && te ? (J({ nodes: [], edges: [p] }), O.current?.blur()) : G([e])), r && r(Y, p);
  }, Q = i ? (Y) => {
    i(Y, { ...p });
  } : void 0, W = s ? (Y) => {
    s(Y, { ...p });
  } : void 0, D = a ? (Y) => {
    a(Y, { ...p });
  } : void 0, F = c ? (Y) => {
    c(Y, { ...p });
  } : void 0, K = l ? (Y) => {
    l(Y, { ...p });
  } : void 0, U = (Y) => {
    if (!_ && pi.includes(Y.key) && A) {
      const { unselectNodesAndEdges: G, addSelectedEdges: J } = S.getState();
      Y.key === "Escape" ? (O.current?.blur(), G({ edges: [p] })) : J([e]);
    }
  };
  return z("svg", { style: { zIndex: E }, children: le("g", { className: ae([
    "react-flow__edge",
    `react-flow__edge-${C}`,
    p.className,
    w,
    {
      selected: p.selected,
      animated: p.animated,
      inactive: !A && !r,
      updating: P,
      selectable: A
    }
  ]), onClick: q, onDoubleClick: Q, onContextMenu: W, onMouseEnter: D, onMouseMove: F, onMouseLeave: K, onKeyDown: N ? U : void 0, tabIndex: N ? 0 : void 0, role: p.ariaRole ?? (N ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": p.ariaLabel === null ? void 0 : p.ariaLabel || `Edge from ${p.source} to ${p.target}`, "aria-describedby": N ? `${Ui}-${g}` : void 0, ref: O, ...p.domAttributes, children: [!T && z(b, { id: e, source: p.source, target: p.target, type: p.type, selected: p.selected, animated: p.animated, selectable: A, deletable: p.deletable ?? !0, label: p.label, labelStyle: p.labelStyle, labelShowBg: p.labelShowBg, labelBgStyle: p.labelBgStyle, labelBgPadding: p.labelBgPadding, labelBgBorderRadius: p.labelBgBorderRadius, sourceX: M, sourceY: k, targetX: $, targetY: H, sourcePosition: V, targetPosition: L, data: p.data, style: p.style, sourceHandleId: p.sourceHandle, targetHandleId: p.targetHandle, markerStart: X, markerEnd: B, pathOptions: "pathOptions" in p ? p.pathOptions : void 0, interactionWidth: p.interactionWidth }), I && z(qh, { edge: p, isReconnectable: I, reconnectRadius: u, onReconnect: f, onReconnectStart: d, onReconnectEnd: h, sourceX: M, sourceY: k, targetX: $, targetY: H, sourcePosition: V, targetPosition: L, setUpdateHover: R, setReconnecting: y })] }) });
}
var Uh = se(Gh);
const Kh = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function bs({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: o, noPanClassName: r, onReconnect: i, onEdgeContextMenu: s, onEdgeMouseEnter: a, onEdgeMouseMove: c, onEdgeMouseLeave: l, onEdgeClick: u, reconnectRadius: f, onEdgeDoubleClick: d, onReconnectStart: h, onReconnectEnd: g, disableKeyboardA11y: v }) {
  const { edgesFocusable: w, edgesReconnectable: m, elementsSelectable: _, onError: p } = j(Kh, ie), x = zh(t);
  return le("div", { className: "react-flow__edges", children: [z(Vh, { defaultColor: e, rfId: n }), x.map((C) => z(Uh, { id: C, edgesFocusable: w, edgesReconnectable: m, elementsSelectable: _, noPanClassName: r, onReconnect: i, onContextMenu: s, onMouseEnter: a, onMouseMove: c, onMouseLeave: l, onClick: u, reconnectRadius: f, onDoubleClick: d, onReconnectStart: h, onReconnectEnd: g, rfId: n, onError: p, edgeTypes: o, disableKeyboardA11y: v }, C))] });
}
bs.displayName = "EdgeRenderer";
const Qh = se(bs), kr = (e) => `translate(${e[0]}px,${e[1]}px) scale(${e[2]})`;
function Jh({ children: e }) {
  const t = oe(), n = ee(null), [o] = we(() => t.getState().transform);
  return ji(() => {
    let r = null;
    const i = () => {
      const s = t.getState().transform;
      r && s[0] === r[0] && s[1] === r[1] && s[2] === r[2] || (r = s, n.current && (n.current.style.transform = kr(s)));
    };
    return i(), t.subscribe(i);
  }, [t]), z("div", { ref: n, className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: kr(o) }, children: e });
}
function jh(e) {
  const t = po(), n = ee(!1);
  ne(() => {
    !n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
  }, [e, t.viewportInitialized]);
}
const eg = (e) => e.panZoom?.syncViewport;
function tg(e) {
  const t = j(eg), n = oe();
  return ne(() => {
    e && (t?.(e), n.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, t]), null;
}
function ng(e) {
  return e.connection.inProgress ? { ...e.connection, to: Pt(e.connection.to, e.transform) } : { ...e.connection };
}
function og(e) {
  return ng;
}
function rg(e) {
  const t = og();
  return j(t, ie);
}
const ig = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function sg({ containerStyle: e, style: t, type: n, component: o }) {
  const { nodesConnectable: r, width: i, height: s, isValid: a, inProgress: c } = j(ig, ie);
  return !(i && r && c) ? null : z("svg", { style: e, width: i, height: s, className: "react-flow__connectionline react-flow__container", children: z("g", { className: ae(["react-flow__connection", wi(a)]), children: z(_s, { style: t, type: n, CustomComponent: o, isValid: a }) }) });
}
const _s = ({ style: e, type: t = Oe.Bezier, CustomComponent: n, isValid: o }) => {
  const { inProgress: r, from: i, fromNode: s, fromHandle: a, fromPosition: c, to: l, toNode: u, toHandle: f, toPosition: d, pointer: h } = rg();
  if (!r)
    return;
  if (n)
    return z(n, { connectionLineType: t, connectionLineStyle: e, fromNode: s, fromHandle: a, fromX: i.x, fromY: i.y, toX: l.x, toY: l.y, fromPosition: c, toPosition: d, connectionStatus: wi(o), toNode: u, toHandle: f, pointer: h });
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
      [g] = $i(v);
      break;
    case Oe.SimpleBezier:
      [g] = ls(v);
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
      [g] = Di(v);
  }
  return z("path", { d: g, fill: "none", className: "react-flow__connection-path", style: e });
};
_s.displayName = "ConnectionLine";
const ag = {};
function $r(e = ag) {
  ee(e), oe(), ne(() => {
  }, [e]);
}
function cg() {
  oe(), ee(!1), ne(() => {
  }, []);
}
function Ss({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: o, onEdgeClick: r, onNodeDoubleClick: i, onEdgeDoubleClick: s, onNodeMouseEnter: a, onNodeMouseMove: c, onNodeMouseLeave: l, onNodeContextMenu: u, onSelectionContextMenu: f, onSelectionStart: d, onSelectionEnd: h, connectionLineType: g, connectionLineStyle: v, connectionLineComponent: w, connectionLineContainerStyle: m, selectionKeyCode: _, selectionOnDrag: p, selectionMode: x, multiSelectionKeyCode: C, panActivationKeyCode: b, zoomActivationKeyCode: N, deleteKeyCode: I, onlyRenderVisibleElements: A, elementsSelectable: O, defaultViewport: P, translateExtent: R, minZoom: T, maxZoom: y, preventScrolling: S, defaultMarkerColor: E, zoomOnScroll: M, zoomOnPinch: k, panOnScroll: $, panOnScrollSpeed: H, panOnScrollMode: V, zoomOnDoubleClick: L, panOnDrag: X, autoPanOnSelection: B, onPaneClick: q, onPaneMouseEnter: Q, onPaneMouseMove: W, onPaneMouseLeave: D, onPaneScroll: F, onPaneContextMenu: K, paneClickDistance: U, nodeClickDistance: Y, onEdgeContextMenu: G, onEdgeMouseEnter: J, onEdgeMouseMove: te, onEdgeMouseLeave: re, reconnectRadius: ce, onReconnect: Ae, onReconnectStart: Se, onReconnectEnd: Ee, noDragClassName: ke, noWheelClassName: dt, noPanClassName: Fe, disableKeyboardA11y: Xe, nodeExtent: he, rfId: $e, viewport: Pe, onViewportChange: Ye, nodesDraggable: xn }) {
  return $r(e), $r(t), cg(), jh(n), tg(Pe), z(Eh, { onPaneClick: q, onPaneMouseEnter: Q, onPaneMouseMove: W, onPaneMouseLeave: D, onPaneContextMenu: K, onPaneScroll: F, paneClickDistance: U, deleteKeyCode: I, selectionKeyCode: _, selectionOnDrag: p, selectionMode: x, onSelectionStart: d, onSelectionEnd: h, multiSelectionKeyCode: C, panActivationKeyCode: b, zoomActivationKeyCode: N, elementsSelectable: O, zoomOnScroll: M, zoomOnPinch: k, zoomOnDoubleClick: L, panOnScroll: $, panOnScrollSpeed: H, panOnScrollMode: V, panOnDrag: X, autoPanOnSelection: B, defaultViewport: P, translateExtent: R, minZoom: T, maxZoom: y, onSelectionContextMenu: f, preventScrolling: S, noDragClassName: ke, noWheelClassName: dt, noPanClassName: Fe, disableKeyboardA11y: Xe, onViewportChange: Ye, isControlledViewport: !!Pe, children: le(Jh, { children: [z(Qh, { edgeTypes: t, onEdgeClick: r, onEdgeDoubleClick: s, onReconnect: Ae, onReconnectStart: Se, onReconnectEnd: Ee, onlyRenderVisibleElements: A, onEdgeContextMenu: G, onEdgeMouseEnter: J, onEdgeMouseMove: te, onEdgeMouseLeave: re, reconnectRadius: ce, defaultMarkerColor: E, noPanClassName: Fe, disableKeyboardA11y: Xe, rfId: $e }), z(sg, { style: v, type: g, component: w, containerStyle: m }), z("div", { className: "react-flow__edgelabel-renderer" }), z(Dh, { nodeTypes: e, onNodeClick: o, onNodeDoubleClick: i, onNodeMouseEnter: a, onNodeMouseMove: c, onNodeMouseLeave: l, onNodeContextMenu: u, nodeClickDistance: Y, onlyRenderVisibleElements: A, noPanClassName: Fe, noDragClassName: ke, disableKeyboardA11y: Xe, nodeExtent: he, rfId: $e, nodesDraggable: xn }), z("div", { className: "react-flow__viewport-portal" })] }) });
}
Ss.displayName = "GraphView";
const lg = se(Ss), ug = Ei(), Pr = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, width: r, height: i, fitView: s, fitViewOptions: a, minZoom: c = 0.5, maxZoom: l = 2, nodeOrigin: u, nodeExtent: f, zIndexMode: d = "basic" } = {}) => {
  const h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), m = o ?? t ?? [], _ = n ?? e ?? [], p = u ?? [0, 0], x = f ?? _t;
  Hi(v, w, m);
  const { nodesInitialized: C } = Wn(_, h, g, {
    nodeOrigin: p,
    nodeExtent: x,
    zIndexMode: d
  });
  let b = [0, 0, 1];
  if (s && r && i) {
    const N = kt(h, {
      filter: (P) => !!((P.width || P.initialWidth) && (P.height || P.initialHeight))
    }), { x: I, y: A, zoom: O } = ao(N, r, i, c, l, a?.padding ?? 0.1);
    b = [I, A, O];
  }
  return {
    rfId: "1",
    width: r ?? 0,
    height: i ?? 0,
    transform: b,
    nodes: _,
    nodesInitialized: C,
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
    connection: { ...yi },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: ug,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: mi,
    zIndexMode: d,
    onNodesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
    onEdgesChangeMiddlewareMap: /* @__PURE__ */ new Map()
  };
}, dg = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, width: r, height: i, fitView: s, fitViewOptions: a, minZoom: c, maxZoom: l, nodeOrigin: u, nodeExtent: f, zIndexMode: d }) => Sf((h, g) => {
  async function v() {
    const { nodeLookup: w, panZoom: m, fitViewOptions: _, fitViewResolver: p, width: x, height: C, minZoom: b, maxZoom: N } = g();
    m && (await vd({
      nodes: w,
      width: x,
      height: C,
      panZoom: m,
      minZoom: b,
      maxZoom: N
    }, _), p?.resolve(!0), h({ fitViewResolver: null }));
  }
  return {
    ...Pr({
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
      const { nodeLookup: m, parentLookup: _, nodeOrigin: p, nodeExtent: x, elevateNodesOnSelect: C, fitViewQueued: b, zIndexMode: N, nodesSelectionActive: I } = g(), { nodesInitialized: A, hasSelectedNodes: O } = Wn(w, m, _, {
        nodeOrigin: p,
        nodeExtent: x,
        elevateNodesOnSelect: C,
        checkEquality: !0,
        zIndexMode: N
      }), P = I && O;
      b && A ? (v(), h({
        nodes: w,
        nodesInitialized: A,
        fitViewQueued: !1,
        fitViewOptions: void 0,
        nodesSelectionActive: P
      })) : h({ nodes: w, nodesInitialized: A, nodesSelectionActive: P });
    },
    setEdges: (w) => {
      const { connectionLookup: m, edgeLookup: _ } = g();
      Hi(m, _, w), h({ edges: w });
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
      const { triggerNodeChanges: m, nodeLookup: _, parentLookup: p, domNode: x, nodeOrigin: C, nodeExtent: b, debug: N, fitViewQueued: I, zIndexMode: A } = g(), { changes: O, updatedInternals: P } = Xd(w, _, p, x, C, b, A);
      P && (Vd(_, p, { nodeOrigin: C, nodeExtent: b, zIndexMode: A }), I ? (v(), h({ fitViewQueued: !1, fitViewOptions: void 0 })) : h({}), O?.length > 0 && (N && console.log("React Flow: trigger node changes", O), m?.(O)));
    },
    updateNodePositions: (w, m = !1) => {
      const _ = [];
      let p = [];
      const { nodeLookup: x, triggerNodeChanges: C, connection: b, updateConnection: N, onNodesChangeMiddlewareMap: I } = g();
      for (const [A, O] of w) {
        const P = x.get(A), R = !!(P?.expandParent && P?.parentId && O?.position), T = {
          id: A,
          type: "position",
          position: R ? {
            x: Math.max(0, O.position.x),
            y: Math.max(0, O.position.y)
          } : O.position,
          dragging: m
        };
        if (P && b.inProgress && b.fromNode.id === P.id) {
          const y = je(P, b.fromHandle, Z.Left, !0);
          N({ ...b, from: y });
        }
        R && P.parentId && _.push({
          id: A,
          parentId: P.parentId,
          rect: {
            ...O.internals.positionAbsolute,
            width: O.measured.width ?? 0,
            height: O.measured.height ?? 0
          }
        }), p.push(T);
      }
      if (_.length > 0) {
        const { parentLookup: A, nodeOrigin: O } = g(), P = go(_, x, A, O);
        p.push(...P);
      }
      for (const A of I.values())
        p = A(p);
      C(p);
    },
    triggerNodeChanges: (w) => {
      const { onNodesChange: m, setNodes: _, nodes: p, hasDefaultNodes: x, debug: C } = g();
      if (w?.length) {
        if (x) {
          const b = Yf(w, p);
          _(b);
        }
        C && console.log("React Flow: trigger node changes", w), m?.(w);
      }
    },
    triggerEdgeChanges: (w) => {
      const { onEdgesChange: m, setEdges: _, edges: p, hasDefaultEdges: x, debug: C } = g();
      if (w?.length) {
        if (x) {
          const b = Zf(w, p);
          _(b);
        }
        C && console.log("React Flow: trigger edge changes", w), m?.(w);
      }
    },
    addSelectedNodes: (w) => {
      const { multiSelectionActive: m, edgeLookup: _, nodeLookup: p, triggerNodeChanges: x, triggerEdgeChanges: C } = g();
      if (m) {
        const b = w.map((N) => Ze(N, !0));
        x(b);
        return;
      }
      x(tt(p, /* @__PURE__ */ new Set([...w]), !0)), C(tt(_));
    },
    addSelectedEdges: (w) => {
      const { multiSelectionActive: m, edgeLookup: _, nodeLookup: p, triggerNodeChanges: x, triggerEdgeChanges: C } = g();
      if (m) {
        const b = w.map((N) => Ze(N, !0));
        C(b);
        return;
      }
      C(tt(_, /* @__PURE__ */ new Set([...w]))), x(tt(p, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: w, edges: m } = {}) => {
      const { edges: _, nodes: p, nodeLookup: x, triggerNodeChanges: C, triggerEdgeChanges: b } = g(), N = w || p, I = m || _, A = [];
      for (const P of N) {
        if (!P.selected)
          continue;
        const R = x.get(P.id);
        R && (R.selected = !1), A.push(Ze(P.id, !1));
      }
      const O = [];
      for (const P of I)
        P.selected && O.push(Ze(P.id, !1));
      C(A), b(O);
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
      const C = m.reduce((N, I) => I.selected ? [...N, Ze(I.id, !1)] : N, []), b = w.reduce((N, I) => I.selected ? [...N, Ze(I.id, !1)] : N, []);
      _(C), p(b);
    },
    setNodeExtent: (w) => {
      const { nodes: m, nodeLookup: _, parentLookup: p, nodeOrigin: x, elevateNodesOnSelect: C, nodeExtent: b, zIndexMode: N } = g();
      w[0][0] === b[0][0] && w[0][1] === b[0][1] && w[1][0] === b[1][0] && w[1][1] === b[1][1] || (Wn(m, _, p, {
        nodeOrigin: x,
        nodeExtent: w,
        elevateNodesOnSelect: C,
        checkEquality: !1,
        zIndexMode: N
      }), h({ nodeExtent: w }));
    },
    panBy: (w) => {
      const { transform: m, width: _, height: p, panZoom: x, translateExtent: C } = g();
      return Yd({ delta: w, panZoom: x, transform: m, translateExtent: C, width: _, height: p });
    },
    setCenter: async (w, m, _) => {
      const { width: p, height: x, maxZoom: C, panZoom: b } = g();
      if (!b)
        return !1;
      const N = typeof _?.zoom < "u" ? _.zoom : C;
      return await b.setViewport({
        x: p / 2 - w * N,
        y: x / 2 - m * N,
        zoom: N
      }, { duration: _?.duration, ease: _?.ease, interpolate: _?.interpolate }), !0;
    },
    cancelConnection: () => {
      h({
        connection: { ...yi }
      });
    },
    updateConnection: (w) => {
      h({ connection: w });
    },
    reset: () => h({ ...Pr() })
  };
}, Object.is);
function fg({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: o, initialWidth: r, initialHeight: i, initialMinZoom: s, initialMaxZoom: a, initialFitViewOptions: c, fitView: l, nodeOrigin: u, nodeExtent: f, zIndexMode: d, children: h }) {
  const [g] = we(() => dg({
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
  return z(Ef, { value: g, children: z(Kf, { children: z(dh, { children: h }) }) });
}
function hg({ children: e, nodes: t, edges: n, defaultNodes: o, defaultEdges: r, width: i, height: s, fitView: a, fitViewOptions: c, minZoom: l, maxZoom: u, nodeOrigin: f, nodeExtent: d, zIndexMode: h }) {
  return ut(pn) ? z(He, { children: e }) : z(fg, { initialNodes: t, initialEdges: n, defaultNodes: o, defaultEdges: r, initialWidth: i, initialHeight: s, fitView: a, initialFitViewOptions: c, initialMinZoom: l, initialMaxZoom: u, nodeOrigin: f, nodeExtent: d, zIndexMode: h, children: e });
}
const gg = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function pg({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, className: r, nodeTypes: i, edgeTypes: s, onNodeClick: a, onEdgeClick: c, onInit: l, onMove: u, onMoveStart: f, onMoveEnd: d, onConnect: h, onConnectStart: g, onConnectEnd: v, onClickConnectStart: w, onClickConnectEnd: m, onNodeMouseEnter: _, onNodeMouseMove: p, onNodeMouseLeave: x, onNodeContextMenu: C, onNodeDoubleClick: b, onNodeDragStart: N, onNodeDrag: I, onNodeDragStop: A, onNodesDelete: O, onEdgesDelete: P, onDelete: R, onSelectionChange: T, onSelectionDragStart: y, onSelectionDrag: S, onSelectionDragStop: E, onSelectionContextMenu: M, onSelectionStart: k, onSelectionEnd: $, onBeforeDelete: H, connectionMode: V, connectionLineType: L = Oe.Bezier, connectionLineStyle: X, connectionLineComponent: B, connectionLineContainerStyle: q, deleteKeyCode: Q = "Backspace", selectionKeyCode: W = "Shift", selectionOnDrag: D = !1, selectionMode: F = St.Full, panActivationKeyCode: K = "Space", multiSelectionKeyCode: U = Nt() ? "Meta" : "Control", zoomActivationKeyCode: Y = Nt() ? "Meta" : "Control", snapToGrid: G, snapGrid: J, onlyRenderVisibleElements: te = !1, selectNodesOnDrag: re, nodesDraggable: ce, autoPanOnNodeFocus: Ae, nodesConnectable: Se, nodesFocusable: Ee, nodeOrigin: ke = Ki, edgesFocusable: dt, edgesReconnectable: Fe, elementsSelectable: Xe = !0, defaultViewport: he = Rf, minZoom: $e = 0.5, maxZoom: Pe = 2, translateExtent: Ye = _t, preventScrolling: xn = !0, nodeExtent: vn, defaultMarkerColor: Ms = "#b1b1b7", zoomOnScroll: Is = !0, zoomOnPinch: As = !0, panOnScroll: ks = !1, panOnScrollSpeed: $s = 0.5, panOnScrollMode: Ps = Ge.Free, zoomOnDoubleClick: Ds = !0, panOnDrag: zs = !0, onPaneClick: Ts, onPaneMouseEnter: Hs, onPaneMouseMove: Rs, onPaneMouseLeave: Ls, onPaneScroll: Vs, onPaneContextMenu: Os, paneClickDistance: Bs = 1, nodeClickDistance: Fs = 0, children: Xs, onReconnect: Ys, onReconnectStart: Zs, onReconnectEnd: Ws, onEdgeContextMenu: qs, onEdgeDoubleClick: Gs, onEdgeMouseEnter: Us, onEdgeMouseMove: Ks, onEdgeMouseLeave: Qs, reconnectRadius: Js = 10, onNodesChange: js, onEdgesChange: ea, noDragClassName: ta = "nodrag", noWheelClassName: na = "nowheel", noPanClassName: wo = "nopan", fitView: xo, fitViewOptions: vo, connectOnClick: oa, attributionPosition: ra, proOptions: ia, defaultEdgeOptions: sa, elevateNodesOnSelect: aa = !0, elevateEdgesOnSelect: ca = !1, disableKeyboardA11y: bo = !1, autoPanOnConnect: la, autoPanOnNodeDrag: ua, autoPanOnSelection: da = !0, autoPanSpeed: fa, connectionRadius: ha, isValidConnection: ga, onError: pa, style: ma, id: _o, nodeDragThreshold: ya, connectionDragThreshold: wa, viewport: xa, onViewportChange: va, width: ba, height: _a, colorMode: Sa = "light", debug: Ea, onScroll: So, ariaLabelConfig: Na, zIndexMode: Eo = "basic", ...Ca }, Ma) {
  const bn = _o || "1", Ia = Bf(Sa), Aa = Me((No) => {
    No.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), So?.(No);
  }, [So]);
  return z("div", { "data-testid": "rf__wrapper", ...Ca, onScroll: Aa, style: { ...ma, ...gg }, ref: Ma, className: ae(["react-flow", r, Ia]), id: _o, role: "application", children: le(hg, { nodes: e, edges: t, width: ba, height: _a, fitView: xo, fitViewOptions: vo, minZoom: $e, maxZoom: Pe, nodeOrigin: ke, nodeExtent: vn, zIndexMode: Eo, children: [z(Of, { nodes: e, edges: t, defaultNodes: n, defaultEdges: o, onConnect: h, onConnectStart: g, onConnectEnd: v, onClickConnectStart: w, onClickConnectEnd: m, nodesDraggable: ce, autoPanOnNodeFocus: Ae, nodesConnectable: Se, nodesFocusable: Ee, edgesFocusable: dt, edgesReconnectable: Fe, elementsSelectable: Xe, elevateNodesOnSelect: aa, elevateEdgesOnSelect: ca, minZoom: $e, maxZoom: Pe, nodeExtent: vn, onNodesChange: js, onEdgesChange: ea, snapToGrid: G, snapGrid: J, connectionMode: V, translateExtent: Ye, connectOnClick: oa, defaultEdgeOptions: sa, fitView: xo, fitViewOptions: vo, onNodesDelete: O, onEdgesDelete: P, onDelete: R, onNodeDragStart: N, onNodeDrag: I, onNodeDragStop: A, onSelectionDrag: S, onSelectionDragStart: y, onSelectionDragStop: E, onMove: u, onMoveStart: f, onMoveEnd: d, noPanClassName: wo, nodeOrigin: ke, rfId: bn, autoPanOnConnect: la, autoPanOnNodeDrag: ua, autoPanSpeed: fa, onError: pa, connectionRadius: ha, isValidConnection: ga, selectNodesOnDrag: re, nodeDragThreshold: ya, connectionDragThreshold: wa, onBeforeDelete: H, debug: Ea, ariaLabelConfig: Na, zIndexMode: Eo }), z(lg, { onInit: l, onNodeClick: a, onEdgeClick: c, onNodeMouseEnter: _, onNodeMouseMove: p, onNodeMouseLeave: x, onNodeContextMenu: C, onNodeDoubleClick: b, nodeTypes: i, edgeTypes: s, connectionLineType: L, connectionLineStyle: X, connectionLineComponent: B, connectionLineContainerStyle: q, selectionKeyCode: W, selectionOnDrag: D, selectionMode: F, deleteKeyCode: Q, multiSelectionKeyCode: U, panActivationKeyCode: K, zoomActivationKeyCode: Y, onlyRenderVisibleElements: te, defaultViewport: he, translateExtent: Ye, minZoom: $e, maxZoom: Pe, preventScrolling: xn, zoomOnScroll: Is, zoomOnPinch: As, zoomOnDoubleClick: Ds, panOnScroll: ks, panOnScrollSpeed: $s, panOnScrollMode: Ps, panOnDrag: zs, autoPanOnSelection: da, onPaneClick: Ts, onPaneMouseEnter: Hs, onPaneMouseMove: Rs, onPaneMouseLeave: Ls, onPaneScroll: Vs, onPaneContextMenu: Os, paneClickDistance: Bs, nodeClickDistance: Fs, onSelectionContextMenu: M, onSelectionStart: k, onSelectionEnd: $, onReconnect: Ys, onReconnectStart: Zs, onReconnectEnd: Ws, onEdgeContextMenu: qs, onEdgeDoubleClick: Gs, onEdgeMouseEnter: Us, onEdgeMouseMove: Ks, onEdgeMouseLeave: Qs, reconnectRadius: Js, defaultMarkerColor: Ms, noDragClassName: ta, noWheelClassName: na, noPanClassName: wo, rfId: bn, disableKeyboardA11y: bo, nodeExtent: vn, viewport: xa, onViewportChange: va, nodesDraggable: ce }), z(Hf, { onSelectionChange: T }), Xs, z($f, { proOptions: ia, position: ra }), z(kf, { rfId: bn, disableKeyboardA11y: bo })] }) });
}
var Ug = Ji(pg);
const mg = (e) => e.domNode?.querySelector(".react-flow__edgelabel-renderer");
function Kg({ children: e }) {
  const t = j(mg);
  return t ? Ha(e, t) : null;
}
function yg({ dimensions: e, lineWidth: t, variant: n, className: o }) {
  return z("path", { strokeWidth: t, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: ae(["react-flow__background-pattern", n, o]) });
}
function wg({ radius: e, className: t }) {
  return z("circle", { cx: e, cy: e, r: e, className: ae(["react-flow__background-pattern", "dots", t]) });
}
var Be;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(Be || (Be = {}));
const xg = {
  [Be.Dots]: 1,
  [Be.Lines]: 1,
  [Be.Cross]: 6
}, vg = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function Es({
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
  const f = ee(null), { transform: d, patternId: h } = j(vg, ie), g = o || xg[t], v = t === Be.Dots, w = t === Be.Cross, m = Array.isArray(n) ? n : [n, n], _ = [m[0] * d[2] || 1, m[1] * d[2] || 1], p = g * d[2], x = Array.isArray(i) ? i : [i, i], C = w ? [p, p] : _, b = [
    x[0] * d[2] + C[0] / 2,
    x[1] * d[2] + C[1] / 2
  ], N = `${h}${e || ""}`;
  return le("svg", { className: ae(["react-flow__background", l]), style: {
    ...c,
    ...yn,
    "--xy-background-color-props": a,
    "--xy-background-pattern-color-props": s
  }, ref: f, "data-testid": "rf__background", children: [z("pattern", { id: N, x: d[0] % _[0], y: d[1] % _[1], width: _[0], height: _[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${b[0]},-${b[1]})`, children: v ? z(wg, { radius: p / 2, className: u }) : z(yg, { dimensions: C, lineWidth: r, variant: t, className: u }) }), z("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${N})` })] });
}
Es.displayName = "Background";
se(Es);
function bg() {
  return z("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: z("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function _g() {
  return z("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: z("path", { d: "M0 0h32v4.2H0z" }) });
}
function Sg() {
  return z("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: z("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function Eg() {
  return z("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: z("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function Ng() {
  return z("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: z("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function Bt({ children: e, className: t, ...n }) {
  return z("button", { type: "button", className: ae(["react-flow__controls-button", t]), ...n, children: e });
}
const Cg = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function Ns({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: o = !0, fitViewOptions: r, onZoomIn: i, onZoomOut: s, onFitView: a, onInteractiveChange: c, className: l, children: u, position: f = "bottom-left", orientation: d = "vertical", "aria-label": h }) {
  const g = oe(), { isInteractive: v, minZoomReached: w, maxZoomReached: m, ariaLabelConfig: _ } = j(Cg, ie), { zoomIn: p, zoomOut: x, fitView: C } = po(), b = () => {
    p(), i?.();
  }, N = () => {
    x(), s?.();
  }, I = () => {
    C(r), a?.();
  }, A = () => {
    g.setState({
      nodesDraggable: !v,
      nodesConnectable: !v,
      elementsSelectable: !v
    }), c?.(!v);
  };
  return le(mn, { className: ae(["react-flow__controls", d === "horizontal" ? "horizontal" : "vertical", l]), position: f, style: e, "data-testid": "rf__controls", "aria-label": h ?? _["controls.ariaLabel"], children: [t && le(He, { children: [z(Bt, { onClick: b, className: "react-flow__controls-zoomin", title: _["controls.zoomIn.ariaLabel"], "aria-label": _["controls.zoomIn.ariaLabel"], disabled: m, children: z(bg, {}) }), z(Bt, { onClick: N, className: "react-flow__controls-zoomout", title: _["controls.zoomOut.ariaLabel"], "aria-label": _["controls.zoomOut.ariaLabel"], disabled: w, children: z(_g, {}) })] }), n && z(Bt, { className: "react-flow__controls-fitview", onClick: I, title: _["controls.fitView.ariaLabel"], "aria-label": _["controls.fitView.ariaLabel"], children: z(Sg, {}) }), o && z(Bt, { className: "react-flow__controls-interactive", onClick: A, title: _["controls.interactive.ariaLabel"], "aria-label": _["controls.interactive.ariaLabel"], children: v ? z(Ng, {}) : z(Eg, {}) }), u] });
}
Ns.displayName = "Controls";
const Qg = se(Ns);
function Mg({ id: e, x: t, y: n, width: o, height: r, style: i, color: s, strokeColor: a, strokeWidth: c, className: l, borderRadius: u, shapeRendering: f, selected: d, onClick: h }) {
  const { background: g, backgroundColor: v } = i || {}, w = s || g || v;
  return z("rect", { className: ae(["react-flow__minimap-node", { selected: d }, l]), x: t, y: n, rx: u, ry: u, width: o, height: r, style: {
    fill: w,
    stroke: a,
    strokeWidth: c
  }, shapeRendering: f, onClick: h ? (m) => h(m, e) : void 0 });
}
const Ig = se(Mg), Ag = (e) => e.nodes.map((t) => t.id), zn = (e) => e instanceof Function ? e : () => e;
function kg({
  nodeStrokeColor: e,
  nodeColor: t,
  nodeClassName: n = "",
  nodeBorderRadius: o = 5,
  nodeStrokeWidth: r,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: i = Ig,
  onClick: s
}) {
  const a = j(Ag, ie), c = zn(t), l = zn(e), u = zn(n), f = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return z(He, { children: a.map((d) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    z(Pg, { id: d, nodeColorFunc: c, nodeStrokeColorFunc: l, nodeClassNameFunc: u, nodeBorderRadius: o, nodeStrokeWidth: r, NodeComponent: i, onClick: s, shapeRendering: f }, d)
  )) });
}
function $g({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: o, nodeBorderRadius: r, nodeStrokeWidth: i, shapeRendering: s, NodeComponent: a, onClick: c }) {
  const { node: l, x: u, y: f, width: d, height: h } = j((g) => {
    const v = g.nodeLookup.get(e);
    if (!v)
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    const w = v.internals.userNode, { x: m, y: _ } = v.internals.positionAbsolute, { width: p, height: x } = _e(w);
    return {
      node: w,
      x: m,
      y: _,
      width: p,
      height: x
    };
  }, ie);
  return !l || l.hidden || !Ni(l) ? null : z(a, { x: u, y: f, width: d, height: h, style: l.style, selected: !!l.selected, className: o(l), color: t(l), borderRadius: r, strokeColor: n(l), strokeWidth: i, shapeRendering: s, onClick: c, id: l.id });
}
const Pg = se($g);
var Dg = se(kg);
const zg = 200, Tg = 150, Hg = (e) => !e.hidden, Rg = (e) => {
  const t = {
    x: -e.transform[0] / e.transform[2],
    y: -e.transform[1] / e.transform[2],
    width: e.width / e.transform[2],
    height: e.height / e.transform[2]
  };
  return {
    viewBB: t,
    boundingRect: e.nodeLookup.size > 0 ? _i(kt(e.nodeLookup, { filter: Hg }), t) : t,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, Dr = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, Lg = (e, t) => Dr(e.viewBB, t.viewBB) && Dr(e.boundingRect, t.boundingRect) && e.rfId === t.rfId && e.panZoom === t.panZoom && e.translateExtent === t.translateExtent && e.flowWidth === t.flowWidth && e.flowHeight === t.flowHeight && e.ariaLabelConfig === t.ariaLabelConfig, Vg = "react-flow__minimap-desc";
function Cs({
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
  inversePan: _,
  zoomStep: p = 1,
  offsetScale: x = 5
}) {
  const C = oe(), b = ee(null), { boundingRect: N, viewBB: I, rfId: A, panZoom: O, translateExtent: P, flowWidth: R, flowHeight: T, ariaLabelConfig: y } = j(Rg, Lg), S = e?.width ?? zg, E = e?.height ?? Tg, M = N.width / S, k = N.height / E, $ = Math.max(M, k), H = $ * S, V = $ * E, L = x * $, X = N.x - (H - N.width) / 2 - L, B = N.y - (V - N.height) / 2 - L, q = H + L * 2, Q = V + L * 2, W = `${Vg}-${A}`, D = ee(0), F = ee();
  D.current = $, ne(() => {
    if (b.current && O)
      return F.current = jd({
        domNode: b.current,
        panZoom: O,
        getTransform: () => C.getState().transform,
        getViewScale: () => D.current
      }), () => {
        F.current?.destroy();
      };
  }, [O]), ne(() => {
    F.current?.update({
      translateExtent: P,
      width: R,
      height: T,
      inversePan: _,
      pannable: v,
      zoomStep: p,
      zoomable: w
    });
  }, [v, w, _, p, P, R, T]);
  const K = h ? (G) => {
    const [J, te] = F.current?.pointer(G) || [0, 0];
    h(G, { x: J, y: te });
  } : void 0, U = g ? Me((G, J) => {
    const te = C.getState().nodeLookup.get(J).internals.userNode;
    g(G, te);
  }, []) : void 0, Y = m ?? y["minimap.ariaLabel"];
  return z(mn, { position: d, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof c == "string" ? c : void 0,
    "--xy-minimap-mask-background-color-props": typeof l == "string" ? l : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof u == "string" ? u : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof f == "number" ? f * $ : void 0,
    "--xy-minimap-node-background-color-props": typeof o == "string" ? o : void 0,
    "--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
    "--xy-minimap-node-stroke-width-props": typeof s == "number" ? s : void 0
  }, className: ae(["react-flow__minimap", t]), "data-testid": "rf__minimap", children: le("svg", { width: S, height: E, viewBox: `${X} ${B} ${q} ${Q}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": W, ref: b, onClick: K, children: [Y && z("title", { id: W, children: Y }), z(Dg, { onClick: U, nodeColor: o, nodeStrokeColor: n, nodeBorderRadius: i, nodeClassName: r, nodeStrokeWidth: s, nodeComponent: a }), z("path", { className: "react-flow__minimap-mask", d: `M${X - L},${B - L}h${q + L * 2}v${Q + L * 2}h${-q - L * 2}z
        M${I.x},${I.y}h${I.width}v${I.height}h${-I.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
Cs.displayName = "MiniMap";
const Jg = se(Cs), Og = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, Bg = {
  [lt.Line]: "right",
  [lt.Handle]: "bottom-right"
};
function Fg({ nodeId: e, position: t, variant: n = lt.Handle, className: o, style: r = void 0, children: i, color: s, minWidth: a = 10, minHeight: c = 10, maxWidth: l = Number.MAX_VALUE, maxHeight: u = Number.MAX_VALUE, keepAspectRatio: f = !1, resizeDirection: d, autoScale: h = !0, shouldResize: g, onResizeStart: v, onResize: w, onResizeEnd: m }) {
  const _ = os(), p = typeof e == "string" ? e : _, x = oe(), C = ee(null), b = n === lt.Handle, N = j(Me(Og(b && h), [b, h]), ie), I = ee(null), A = t ?? Bg[n];
  ne(() => {
    if (!(!C.current || !p))
      return I.current || (I.current = hf({
        domNode: C.current,
        nodeId: p,
        getStoreItems: () => {
          const { nodeLookup: P, transform: R, snapGrid: T, snapToGrid: y, nodeOrigin: S, domNode: E } = x.getState();
          return {
            nodeLookup: P,
            transform: R,
            snapGrid: T,
            snapToGrid: y,
            nodeOrigin: S,
            paneDomNode: E
          };
        },
        onChange: (P, R) => {
          const { triggerNodeChanges: T, nodeLookup: y, parentLookup: S, nodeOrigin: E } = x.getState(), M = [], k = { x: P.x, y: P.y }, $ = y.get(p);
          if ($ && $.expandParent && $.parentId) {
            const H = $.origin ?? E, V = P.width ?? $.measured.width ?? 0, L = P.height ?? $.measured.height ?? 0, X = {
              id: $.id,
              parentId: $.parentId,
              rect: {
                width: V,
                height: L,
                ...Ci({
                  x: P.x ?? $.position.x,
                  y: P.y ?? $.position.y
                }, { width: V, height: L }, $.parentId, y, H)
              }
            }, B = go([X], y, S, E);
            M.push(...B), k.x = P.x ? Math.max(H[0] * V, P.x) : void 0, k.y = P.y ? Math.max(H[1] * L, P.y) : void 0;
          }
          if (k.x !== void 0 && k.y !== void 0) {
            const H = {
              id: p,
              type: "position",
              position: { ...k }
            };
            M.push(H);
          }
          if (P.width !== void 0 && P.height !== void 0) {
            const V = {
              id: p,
              type: "dimensions",
              resizing: !0,
              setAttributes: d ? d === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: P.width,
                height: P.height
              }
            };
            M.push(V);
          }
          for (const H of R) {
            const V = {
              ...H,
              type: "position"
            };
            M.push(V);
          }
          T(M);
        },
        onEnd: ({ width: P, height: R }) => {
          const T = {
            id: p,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: P,
              height: R
            }
          };
          x.getState().triggerNodeChanges([T]);
        }
      })), I.current.update({
        controlPosition: A,
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
        I.current?.destroy();
      };
  }, [
    A,
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
  const O = A.split("-");
  return z("div", { className: ae(["react-flow__resize-control", "nodrag", ...O, n, o]), ref: C, style: {
    ...r,
    scale: N,
    ...s && { [b ? "backgroundColor" : "borderColor"]: s }
  }, children: i });
}
const jg = se(Fg);
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-runner"]);
const Un = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-runner");
if (!Un || Object.keys(Un).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-runner");
const Xg = Un.watchRuntimeStream;
async function ep(e) {
  let t = e.initialState;
  const n = await Xg({
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
function tp(e) {
  const t = e?.interaction && typeof e.interaction == "object" && !Array.isArray(e.interaction) ? e.interaction : {};
  return {
    runId: Number(e?.run_id || e?.runId || 0),
    nodeRunId: Number(e?.node_run_id || e?.nodeRunId || 0),
    nodeKey: String(e?.node_key || e?.nodeKey || ""),
    nodeName: String(e?.node_name || e?.nodeName || ""),
    interaction: t
  };
}
const Yg = {
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
function yo(e) {
  const t = String(e || "").trim().toLowerCase();
  return Yg[t] || "pending";
}
function np(e, t) {
  if (String(t || "").trim())
    return yo(t);
  const n = String(e.event || e.type || "").trim().toLowerCase();
  return n.includes("cancel") ? "canceled" : n.includes("fail") || n.includes("error") ? "fail" : n.includes("wait") ? "waiting" : n.includes("finish") || n.includes("success") || n.includes("complete") ? "success" : n.includes("start") || n.includes("progress") || n.includes("running") ? "running" : "pending";
}
function zr(e) {
  const t = e && typeof e == "object" ? e : {}, n = t.run && typeof t.run == "object" ? t.run : t, o = {
    ...n,
    id: Number(n.id || t.run_id || 0),
    request_id: String(n.request_id || t.request_id || ""),
    status: yo(n.status || t.status),
    error: String(n.error || t.error || "")
  };
  return {
    ...t,
    view: String(t.view || ""),
    run: o,
    flow_runs: Tr(t.flow_runs, "status"),
    node_runs: Tr(t.node_runs, "status"),
    interactions: Kn(t.interactions),
    approvals: Kn(t.approvals),
    ...Array.isArray(t.agent_runs) ? { agent_runs: t.agent_runs } : {},
    ...Array.isArray(t.blackboard) ? { blackboard: t.blackboard } : {},
    ...Array.isArray(t.messages) ? { messages: t.messages } : {}
  };
}
function op(e, t) {
  const n = zr(e), o = zr(t);
  return {
    ...n,
    ...o,
    run: {
      ...n.run,
      ...o.run
    },
    flow_runs: Hr(n.flow_runs, o.flow_runs),
    node_runs: Hr(n.node_runs, o.node_runs),
    interactions: o.interactions || n.interactions || [],
    approvals: o.approvals || n.approvals || [],
    agent_runs: o.agent_runs || n.agent_runs,
    blackboard: o.blackboard || n.blackboard,
    messages: o.messages || n.messages
  };
}
function Tr(e, t) {
  return Kn(e).map((n) => ({
    ...n,
    [t]: yo(n?.[t])
  }));
}
function Hr(e = [], t = []) {
  if (t.length === 0)
    return e;
  const n = new Map(
    e.map((o) => [Rr(o), o])
  );
  return t.map((o) => ({
    ...n.get(Rr(o)) || {},
    ...o
  }));
}
function Rr(e) {
  return String(
    e.id || e.node_run_id || e.flow_run_id || e.node_key || e.flow_id
  );
}
function Kn(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
export {
  wn as B,
  Qg as C,
  Kg as E,
  on as H,
  Jg as M,
  jg as N,
  Z as P,
  fg as R,
  yo as a,
  Yf as b,
  Zf as c,
  $i as g,
  Ug as i,
  op as m,
  tp as n,
  np as r,
  po as u,
  ep as w
};
